import { serve } from "https://deno.land/std@v0.41.0/http/server.ts";
import {
  acceptWebSocket,
  WebSocket
} from "https://deno.land/std@v0.41.0/ws/mod.ts";
import { OT } from "./control.ts";
import {
  ISerializedOperation,
  Insert,
  Operation,
  exclusionTransform,
  inclusionTransform,
  deserialize
} from "./charwise.ts";

const { PORT = "8080", CLOUDCODE_DEBUG } = Deno.env();

const debug = !CLOUDCODE_DEBUG ? () => {} : console.log;

function applyOps(s: string, ops: Operation[]): string {
  let str = s;
  for (const op of ops) {
    if (op.isNoop) {
      // nothing
    }
    if (op.position > str.length) {
      throw new Error(`op.position=${op.position} is out of bounds in ${str}`);
    }
    if (op instanceof Insert) {
      str = `${str.slice(0, op.position)}${op.char}${str.slice(op.position)}`;
    } else {
      str = `${str.slice(0, op.position)}${str.slice(op.position + 1)}`;
    }
  }
  return str;
}

interface DocData {
  id: string;
  ot: OT<Operation>;
  nextSiteId: number;
  clients: Map<WebSocket, number>;
  value: string;
  mode: {
    name: string;
    timestamp: number;
  };
}

const docs: Map<string, DocData> = new Map();

interface AckMsgOut {
  type: "ack";
  mode: string;
  value: string;
  siteId: number;
}

interface OpMsgOut {
  type: "op";
  ops: ISerializedOperation[];
}

interface ModeMsgOut {
  type: "mode";
  mode: string;
}

type OutMsg = AckMsgOut | OpMsgOut | ModeMsgOut;

interface InitMsgIn {
  type: "init";
  id: string;
}

interface OpMsgIn {
  type: "op";
  id: string;
  ops: ISerializedOperation[];
}

interface ModeMsgIn {
  type: "mode";
  id: string;
  mode: string;
  timestamp: number;
}

type InMsg = InitMsgIn | OpMsgIn | ModeMsgIn;

function sendMsg(socket: WebSocket, msg: OutMsg): void {
  socket.send(JSON.stringify(msg));
}

function handleInit(socket: WebSocket, msg: InitMsgIn): void {
  debug("init from", socket.conn.remoteAddr, msg);
  let data = docs.get(msg.id);
  if (!data) {
    debug("creating new doc with id:", msg.id);
    data = {
      id: msg.id,
      ot: new OT(inclusionTransform, exclusionTransform, 0),
      nextSiteId: 1,
      clients: new Map(),
      value: "Hello World!",
      mode: {
        name: "plain-text",
        timestamp: Date.now()
      }
    };
    docs.set(msg.id, data);
  } else {
    debug("doc exists with id:", msg.id, ", and mode:", data.mode.name);
  }

  data.clients.set(socket, data.nextSiteId);

  sendMsg(socket, {
    type: "ack",
    mode: data.mode.name,
    value: data.value,
    siteId: data.nextSiteId
  });

  data.nextSiteId += 1;
}

function handleOp(socket: WebSocket, msg: OpMsgIn): void {
  debug("ops from", socket.conn.remoteAddr, msg);
  const data = docs.get(msg.id);
  if (!data) {
    throw new Error(`received op for non-existent doc (id: ${msg.id})`);
  }

  const after = [];
  const initPos = msg.ops[0].position;
  const transformed = data.ot.goto(deserialize(msg.ops[0]));
  const posDiff = transformed.position - initPos;
  after.push(transformed);
  data.ot.addToHistory(transformed);

  for (const op of msg.ops.slice(1)) {
    const newOp = deserialize(op);
    newOp.position += posDiff;
    after.push(newOp);
    data.ot.addToHistory(newOp);
  }
  data.value = applyOps(data.value, after);
  debug(`doc is now: "${data.value}"`);

  const resp = JSON.stringify(msg);
  for (const client of data.clients.keys()) {
    if (client !== socket) {
      client.send(resp);
    }
  }
}

function handleMode(socket: WebSocket, msg: ModeMsgIn): void {
  debug("mode from", socket.conn.remoteAddr, msg);
  const data = docs.get(msg.id);
  if (!data) {
    throw new Error(`received mode for non-existent doc (id: ${msg.id})`);
  }

  if (data.mode.timestamp > msg.timestamp) {
    debug("mode is old! sending current mode to", socket.conn.remoteAddr);
    sendMsg(socket, { type: "mode", mode: data.mode.name });
  } else {
    debug("valid mode:", msg.mode);
    data.mode.name = msg.mode;
    data.mode.timestamp = msg.timestamp;
    const resp: ModeMsgOut = { type: "mode", mode: msg.mode };

    for (const client of data.clients.keys()) {
      if (client !== socket) {
        debug("sending new mode:", msg.mode, "to", client.conn.remoteAddr);
        sendMsg(client, resp);
      }
    }
  }
}

async function socketLoop(socket: WebSocket): Promise<void> {
  let id: string = "";
  const it = socket.receive();
  while (true) {
    try {
      const { done, value } = await it.next();
      if (done) {
        break;
      }
      if (typeof value !== "string") {
        // ignore
        continue;
      }

      const msg = JSON.parse(value) as InMsg;
      if (msg.type === "init") {
        id = msg.id;
        handleInit(socket, msg);
      } else if (msg.type === "op") {
        handleOp(socket, msg);
      } else {
        handleMode(socket, msg);
      }
    } catch (e) {
      debug(`failed to receive frame: ${e}`);
      await socket.close(1000).catch(console.error);
    }
  }

  debug("client disconnected", socket.conn.remoteAddr);
  docs.get(id)?.clients.delete(socket);
}

async function wsServer() {
  for await (const req of serve(`:${PORT}`)) {
    const { headers, conn } = req;
    const addr = conn.remoteAddr;
    try {
      const socket = await acceptWebSocket({
        conn,
        headers,
        bufReader: req.r,
        bufWriter: req.w
      });
      debug("Socket", addr, "connected");
      socketLoop(socket);
    } catch (e) {
      debug("ERROR: socket", addr, "failed to connect.", e);
    }
  }
}

debug("listening on", PORT);
wsServer();
