import { OT } from "@rclarey/simple-ot";
import {
  inclusionTransform,
  exclusionTransform,
  Operation,
  Insert,
  ISerializedOperation,
  Delete,
  serialize,
  deserialize
} from "@rclarey/simple-ot/dist/charwise";
import { fatalError, networkError } from "./error";
import { deferred, ensureMode, genId, modeId } from "./util";

const WS_URL = "wss://cloudcode.fly.dev/:80";

interface AckMsgIn {
  type: "ack";
  mode: string;
  value: string;
  siteId: number;
  history: ISerializedOperation[];
}

interface OpMsgIn {
  type: "op";
  ops: ISerializedOperation[];
}

interface ModeMsgIn {
  type: "mode";
  mode: string;
}

type InMsg = AckMsgIn | OpMsgIn | ModeMsgIn;

interface InitMsgOut {
  type: "init";
  id: string;
}

interface OpMsgOut {
  type: "op";
  id: string;
  ops: ISerializedOperation[];
}

interface ModeMsgOut {
  type: "mode";
  id: string;
  mode: string;
  timestamp: number;
}

type OutMsg = InitMsgOut | OpMsgOut | ModeMsgOut;

function sendMsg(socket: WebSocket, msg: OutMsg): void {
  socket.send(JSON.stringify(msg));
}

function setMode(
  cm: CodeMirror.Editor,
  mode: string,
  value: string | null
): void {
  if (mode === "typescript") {
    cm.setOption("mode", {
      name: value,
      typescript: true
    });
  } else {
    cm.setOption("mode", value);
  }
}

function handleMessages(
  socket: WebSocket,
  cm: CodeMirror.Editor,
  select: HTMLSelectElement,
  ot: OT<Operation>
): (e: MessageEvent) => void {
  return async (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data) as InMsg;
      if (data.type === "mode") {
        const opt = select.namedItem(data.mode);
        if (opt) {
          const value = opt.value === "~null~" ? null : opt.value;
          await ensureMode(value);
          opt.selected = true;
          setMode(cm, modeId(opt.innerText), value);
        }
      } else if (data.type === "op") {
        // batch changes
        cm.operation(() => {
          const after = [];
          const initPos = data.ops[0].position;
          const transformed = ot.goto(deserialize(data.ops[0]));
          const posDiff = transformed.position - initPos;
          after.push(transformed);
          ot.addToHistory(transformed);

          for (const op of data.ops.slice(1)) {
            const newOp = deserialize(op);
            newOp.position += posDiff;
            after.push(newOp);
            ot.addToHistory(newOp);
          }

          for (const op of after) {
            const pos = cm.posFromIndex(op.position);
            if (op instanceof Insert) {
              cm.replaceRange(op.char, pos);
            } else {
              cm.replaceRange("", pos, cm.posFromIndex(op.position + 1));
            }
          }
        });
      }
    } catch (e) {
      console.error(e);
      fatalError(socket);
    }
  };
}

type ChangeFunc = (
  cm: CodeMirror.Editor,
  ch: CodeMirror.EditorChangeCancellable
) => void;
function handleEditorChange(
  id: string,
  socket: WebSocket,
  ot: OT<Operation>
): ChangeFunc {
  return (cm, change) => {
    if (change.origin == undefined || change.origin === "setValue") {
      return;
    }
    const ops: ISerializedOperation[] = [];
    let start = cm.indexFromPos(change.from);
    let end = cm.indexFromPos(change.to);
    for (let i = 0; i < end - start; i += 1) {
      const op = new Delete(start, genId(), ot.siteID, ot.history());
      ops.push(serialize(op));
      ot.addToHistory(op);
    }

    for (const c of change.text.join("\n")) {
      const op = new Insert(c, start, genId(), ot.siteID, ot.history());
      ops.push(serialize(op));
      ot.addToHistory(op);
      start += 1;
    }

    sendMsg(socket, {
      id,
      ops,
      type: "op"
    });
  };
}

function handleSocketClose(
  id: string,
  cm: CodeMirror.Editor,
  select: HTMLSelectElement,
  editorChangeHandler: ChangeFunc
): (e: CloseEvent) => void {
  return () => {
    cm.off("beforeChange", editorChangeHandler);
    cm.setOption("readOnly", true);
    networkError(
      (async () => {
        // keep trying to reconnect until we are successful
        while (true) {
          try {
            await setupSocket(id, cm, select);
            return;
          } catch {
            // sleep between retries
            await new Promise(r => setTimeout(r, 1000));
          }
        }
      })()
    );
  };
}

function handleSelectChange(
  id: string,
  socket: WebSocket,
  cm: CodeMirror.Editor
): (e: Event) => void {
  return async e => {
    const target = e.target as HTMLSelectElement;
    const opt = Array.from(target.children).find(
      o => o instanceof HTMLOptionElement && o.selected
    )! as HTMLOptionElement;
    const [value, mode] =
      target.value === "~null~"
        ? [null, "plain-text"]
        : [target.value, modeId(opt.innerText)];

    sendMsg(socket, {
      id,
      mode,
      timestamp: Date.now(),
      type: "mode"
    });

    await ensureMode(value);
    setMode(cm, mode, value);
  };
}

export async function setupSocket(
  id: string,
  cm: CodeMirror.Editor,
  select: HTMLSelectElement
): Promise<void> {
  const socket = new WebSocket(WS_URL);
  const opened = deferred<boolean>();
  const initMsg = deferred<MessageEvent>();
  socket.onopen = () => {
    opened.resolve(true);
    sendMsg(socket, { type: "init", id });
  };
  socket.onerror = () => opened.resolve(false);
  socket.onmessage = e => initMsg.resolve(e);

  const success = await opened;
  if (!success) {
    throw new Error("Failed to setup socket");
  }

  try {
    const { data } = await initMsg;
    const msg = JSON.parse(data) as InMsg;
    if (msg.type !== "ack") {
      throw new Error(
        `Expected an "ack" message, but received "${msg.type}" instead`
      );
    }

    const opt = select.namedItem(msg.mode);
    if (opt !== null) {
      const value = opt.value === "~null~" ? null : opt.value;
      await ensureMode(value);
      opt.selected = true;
      setMode(cm, modeId(opt.innerText), value);
    }

    const ot = new OT(inclusionTransform, exclusionTransform, msg.siteId);
    msg.history.forEach(op => ot.addToHistory(deserialize(op)));
    const editorChangeHandler = handleEditorChange(id, socket, ot);
    select.onchange = handleSelectChange(id, socket, cm);
    socket.onmessage = handleMessages(socket, cm, select, ot);
    socket.onclose = handleSocketClose(id, cm, select, editorChangeHandler);
    cm.on("beforeChange", editorChangeHandler);

    cm.setValue(msg.value);
    cm.setOption("readOnly", false);
  } catch (e) {
    console.error(e);
    fatalError(socket);
  }
}
