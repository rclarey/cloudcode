// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register(
  "https://raw.githubusercontent.com/rclarey/simple-ot/v1.1.1/control.ts#^",
  [],
  function (exports_1, context_1) {
    "use strict";
    var OT;
    var __moduleName = context_1 && context_1.id;
    return {
      setters: [],
      execute: function () {
        OT = class OT {
          constructor(inclusionTransform, exclusionTransform, siteID) {
            this.inclusionTransform = inclusionTransform;
            this.exclusionTransform = exclusionTransform;
            this.siteID = siteID;
            this.historyBuffer = [];
            this.idHistory = [];
          }
          static operationsAreIndependent(op1, op2) {
            for (const id of op1.historyBuffer) {
              if (id === op2.id) {
                return false;
              }
            }
            return true;
          }
          addToHistory(op) {
            this.historyBuffer.push(op);
            this.idHistory.push(op.id);
          }
          history() {
            return this.idHistory;
          }
          transpose(op1, op2) {
            const op2Prime = this.exclusionTransform(op2, op1);
            const op1Prime = this.inclusionTransform(op1, op2Prime);
            return [op2Prime, op1Prime];
          }
          listTranspose(start, end) {
            const hb = this.historyBuffer;
            for (let i = end; i > start; i -= 1) {
              const result = this.transpose(hb[i - 1], hb[i]);
              [hb[i - 1], hb[i]] = result;
            }
          }
          listInclusionTransform(operation, start) {
            let transformed = operation;
            for (let i = start; i < this.historyBuffer.length; i += 1) {
              const op2 = this.historyBuffer[i];
              transformed = this.inclusionTransform(transformed, op2);
            }
            return transformed;
          }
          goto(operation) {
            let k = -1;
            for (let i = 0; i < this.historyBuffer.length; i += 1) {
              if (
                OT.operationsAreIndependent(operation, this.historyBuffer[i])
              ) {
                k = i;
                break;
              }
            }
            if (k === -1) {
              return operation;
            }
            const pre = [];
            for (let i = k + 1; i < this.historyBuffer.length; i += 1) {
              if (
                !OT.operationsAreIndependent(operation, this.historyBuffer[i])
              ) {
                pre.push(i);
              }
            }
            if (pre.length === 0) {
              return this.listInclusionTransform(operation, k);
            }
            const r = pre.length;
            for (let i = 0; i < r; i += 1) {
              this.listTranspose(k + i, pre[i]);
            }
            return this.listInclusionTransform(operation, k + r);
          }
        };
        exports_1("OT", OT);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/rclarey/simple-ot/v1.1.1/control",
  [],
  function (exports_2, context_2) {
    "use strict";
    var OT;
    var __moduleName = context_2 && context_2.id;
    return {
      setters: [],
      execute: function () {
        OT = class OT {
          constructor(inclusionTransform, exclusionTransform, siteID) {
            this.inclusionTransform = inclusionTransform;
            this.exclusionTransform = exclusionTransform;
            this.siteID = siteID;
            this.historyBuffer = [];
            this.idHistory = [];
          }
          static operationsAreIndependent(op1, op2) {
            for (const id of op1.historyBuffer) {
              if (id === op2.id) {
                return false;
              }
            }
            return true;
          }
          addToHistory(op) {
            this.historyBuffer.push(op);
            this.idHistory.push(op.id);
          }
          history() {
            return this.idHistory;
          }
          transpose(op1, op2) {
            const op2Prime = this.exclusionTransform(op2, op1);
            const op1Prime = this.inclusionTransform(op1, op2Prime);
            return [op2Prime, op1Prime];
          }
          listTranspose(start, end) {
            const hb = this.historyBuffer;
            for (let i = end; i > start; i -= 1) {
              const result = this.transpose(hb[i - 1], hb[i]);
              [hb[i - 1], hb[i]] = result;
            }
          }
          listInclusionTransform(operation, start) {
            let transformed = operation;
            for (let i = start; i < this.historyBuffer.length; i += 1) {
              const op2 = this.historyBuffer[i];
              transformed = this.inclusionTransform(transformed, op2);
            }
            return transformed;
          }
          goto(operation) {
            let k = -1;
            for (let i = 0; i < this.historyBuffer.length; i += 1) {
              if (
                OT.operationsAreIndependent(operation, this.historyBuffer[i])
              ) {
                k = i;
                break;
              }
            }
            if (k === -1) {
              return operation;
            }
            const pre = [];
            for (let i = k + 1; i < this.historyBuffer.length; i += 1) {
              if (
                !OT.operationsAreIndependent(operation, this.historyBuffer[i])
              ) {
                pre.push(i);
              }
            }
            if (pre.length === 0) {
              return this.listInclusionTransform(operation, k);
            }
            const r = pre.length;
            for (let i = 0; i < r; i += 1) {
              this.listTranspose(k + i, pre[i]);
            }
            return this.listInclusionTransform(operation, k + r);
          }
        };
        exports_2("OT", OT);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/rclarey/simple-ot/v1.1.1/charwise.ts#^",
  [],
  function (exports_3, context_3) {
    "use strict";
    var OperationType, Operation, Insert, Delete;
    var __moduleName = context_3 && context_3.id;
    function inclusionTransform(op1, op2) {
      if (op1.isNoop) {
        if (
          op1 instanceof Delete && op2 instanceof Insert &&
          op1.position === op2.position
        ) {
          return new Delete(
            op1.position,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
          );
        }
        return op1;
      }
      if (op2.isNoop) {
        if (
          op1 instanceof Insert && op2 instanceof Delete &&
          op1.position === op2.auxPos
        ) {
          return new Insert(
            op1.char,
            op1.position,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
            true,
          );
        }
        return op1;
      }
      if (op1 instanceof Insert && op2 instanceof Insert) {
        if (
          op1.position < op2.position ||
          (op1.position === op2.position && op1.siteID <= op2.siteID)
        ) {
          return new Insert(
            op1.char,
            op1.auxPos,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
          );
        }
        const pos = Math.min(op1.position, op1.auxPos) + 1;
        return new Insert(op1.char, pos, op1.id, op1.siteID, op1.historyBuffer);
      }
      if (op1 instanceof Insert && op2 instanceof Delete) {
        if (op1.position <= op2.position) {
          return op1;
        }
        const op3 = new Insert(
          op1.char,
          op1.position - 1,
          op1.id,
          op1.siteID,
          op1.historyBuffer,
        );
        op3.auxPos = op1.position;
        return op3;
      }
      if (op1 instanceof Delete && op2 instanceof Insert) {
        if (op1.position < op2.position) {
          return op1;
        }
        return new Delete(
          op1.position + 1,
          op1.id,
          op1.siteID,
          op1.historyBuffer,
        );
      }
      if (op1 instanceof Delete && op2 instanceof Delete) {
        if (op1.position === op2.position) {
          return new Delete(
            op1.position,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
            true,
          );
        }
        if (op1.position < op2.position) {
          return op1;
        }
        const op3 = new Delete(
          op1.position - 1,
          op1.id,
          op1.siteID,
          op1.historyBuffer,
        );
        op3.auxPos = op1.position;
        return op3;
      }
      return op1;
    }
    exports_3("inclusionTransform", inclusionTransform);
    function exclusionTransform(op1, op2) {
      if (op1.isNoop) {
        if (
          op2.isNoop &&
          op1.position === op2.position &&
          op1 instanceof Insert &&
          op2 instanceof Delete
        ) {
          return new Insert(
            op1.char,
            op1.position,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
          );
        }
        if (
          op1.position === op2.position && op1 instanceof Delete &&
          op2 instanceof Delete
        ) {
          return new Delete(
            op1.position,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
          );
        }
        if (op1 instanceof Delete && op2 instanceof Insert) {
          const op = new Delete(
            op1.position,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
            true,
          );
          op.auxPos = -1;
          return op;
        }
        return op1;
      }
      if (op2.isNoop) {
        return op1;
      }
      if (op1 instanceof Insert && op2 instanceof Insert) {
        if (op1.position === op2.position && op1.siteID > op2.siteID) {
          const op3 = new Insert(
            op1.char,
            op1.position,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
          );
          op3.auxPos = op1.position - 1;
          return op3;
        }
        if (op1.position <= op2.position) {
          op2.auxPos = op2.position + 1;
          return op1;
        }
        const op4 = new Insert(
          op1.char,
          op1.position - 1,
          op1.id,
          op1.siteID,
          op1.historyBuffer,
        );
        if (op1.siteID < op2.siteID) {
          op4.auxPos = op1.position;
        }
        return op4;
      }
      if (op1 instanceof Insert && op2 instanceof Delete) {
        if (op1.position === op2.position) {
          return new Insert(
            op1.char,
            op1.auxPos,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
          );
        }
        if (op1.position < op2.position) {
          return op1;
        }
        return new Insert(
          op1.char,
          op1.position + 1,
          op1.id,
          op1.siteID,
          op1.historyBuffer,
        );
      }
      if (op1 instanceof Delete && op2 instanceof Insert) {
        if (op1.position === op2.position) {
          return new Delete(
            op1.position,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
            true,
          );
        }
        if (op1.position < op2.position) {
          return op1;
        }
        return new Delete(
          op1.position - 1,
          op1.id,
          op1.siteID,
          op1.historyBuffer,
        );
      }
      if (op1 instanceof Delete && op2 instanceof Delete) {
        if (op1.position >= op2.position) {
          return new Delete(
            op1.position + 1,
            op1.id,
            op1.siteID,
            op1.historyBuffer,
          );
        }
        return new Delete(op1.position, op1.id, op1.siteID, op1.historyBuffer);
      }
      return op1;
    }
    exports_3("exclusionTransform", exclusionTransform);
    function serialize(operation) {
      const { historyBuffer, id, type, position, siteID } = operation;
      const serialized = {
        historyBuffer,
        id,
        type,
        position,
        siteID,
      };
      if (operation instanceof Insert) {
        serialized.char = operation.char;
      }
      return serialized;
    }
    exports_3("serialize", serialize);
    function deserialize(op) {
      if (op.type === OperationType.INSERT) {
        return new Insert(
          op.char,
          op.position,
          op.id,
          op.siteID,
          op.historyBuffer,
        );
      }
      return new Delete(op.position, op.id, op.siteID, op.historyBuffer);
    }
    exports_3("deserialize", deserialize);
    return {
      setters: [],
      execute: function () {
        (function (OperationType) {
          OperationType["DELETE"] = "d";
          OperationType["INSERT"] = "i";
        })(OperationType || (OperationType = {}));
        exports_3("OperationType", OperationType);
        Operation = class Operation {
          constructor(type, position, id, siteID, historyBuffer, isNoop) {
            this.type = type;
            this.position = position;
            this.id = id;
            this.siteID = siteID;
            this.historyBuffer = historyBuffer;
            this.isNoop = isNoop;
            this.auxPos = position;
          }
        };
        exports_3("Operation", Operation);
        Insert = class Insert extends Operation {
          constructor(
            char,
            position,
            id,
            siteID,
            historyBuffer,
            isNoop = false,
          ) {
            super(
              OperationType.INSERT,
              position,
              id,
              siteID,
              historyBuffer,
              isNoop,
            );
            this.char = char;
          }
        };
        exports_3("Insert", Insert);
        Delete = class Delete extends Operation {
          constructor(position, id, siteID, historyBuffer, isNoop = false) {
            super(
              OperationType.DELETE,
              position,
              id,
              siteID,
              historyBuffer,
              isNoop,
            );
          }
        };
        exports_3("Delete", Delete);
      },
    };
  },
);
System.register(
  "file:///Users/russell/Documents/Development/cloudcode/client/modal",
  [],
  function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function modal(opts) {
      const bg = document.createElement("div");
      bg.className = "modal__bg";
      bg.onclick = (e) => e.stopPropagation();
      const root = document.createElement("div");
      root.className = "modal__root";
      bg.appendChild(root);
      const head = document.createElement("h1");
      head.className = "modal__head";
      head.innerHTML = opts.title;
      root.appendChild(head);
      for (const text of opts.body) {
        const p = document.createElement("p");
        p.className = "modal__p";
        p.innerHTML = text;
        root.appendChild(p);
      }
      if (opts.confirm) {
        const button = document.createElement("button");
        button.className = "modal__confirm";
        button.innerHTML = opts.confirm;
        button.onclick = async () => {
          await opts.onConfirm();
          document.body.removeChild(root);
          document.body.removeChild(bg);
        };
        root.appendChild(button);
      }
      document.body.appendChild(bg);
      return bg;
    }
    exports_4("default", modal);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///Users/russell/Documents/Development/cloudcode/client/error",
  ["file:///Users/russell/Documents/Development/cloudcode/client/modal"],
  function (exports_5, context_5) {
    "use strict";
    var modal_ts_1;
    var __moduleName = context_5 && context_5.id;
    function fatalError(socket) {
      socket.onclose = null;
      if (
        socket.readyState !== socket.CLOSED &&
        socket.readyState !== socket.CLOSING
      ) {
        socket.close();
      }
      const everything = document.body.children;
      for (const elem of everything) {
        document.body.removeChild(elem);
      }
      modal_ts_1.default({
        title: "Error!",
        body: [
          "Something unexpected went wrong!",
          "You can try refreshing the page to fix it.",
        ],
      });
    }
    exports_5("fatalError", fatalError);
    async function networkError(p) {
      const m = modal_ts_1.default({
        title: "Lost connection!",
        body: ["Attempting to reconnect..."],
      });
      await p;
      document.body.removeChild(m);
    }
    exports_5("networkError", networkError);
    return {
      setters: [
        function (modal_ts_1_1) {
          modal_ts_1 = modal_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///Users/russell/Documents/Development/cloudcode/client/util",
  [],
  function (exports_6, context_6) {
    "use strict";
    var alphabet;
    var __moduleName = context_6 && context_6.id;
    function genId() {
      let id = "";
      let i = 12;
      while (i--) {
        id += alphabet[(Math.random() * 64) | 0];
      }
      return id;
    }
    exports_6("genId", genId);
    function ensureMode(name) {
      return new Promise((resolve) => {
        const modeUrl =
          `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.53.2/mode/${name}/${name}.min.js`;
        if (
          name != null && !document.querySelector(`script[src="${modeUrl}"]`)
        ) {
          const s = document.createElement("script");
          s.src = modeUrl;
          s.onload = () => resolve();
          document.body.appendChild(s);
        } else {
          resolve();
        }
      });
    }
    exports_6("ensureMode", ensureMode);
    function deferred() {
      let resolve;
      const p = new Promise((res) => {
        resolve = res;
      });
      return Object.assign(p, { resolve });
    }
    exports_6("deferred", deferred);
    function modeId(name) {
      return name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
    }
    exports_6("modeId", modeId);
    return {
      setters: [],
      execute: function () {
        alphabet =
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_-abcdefghijklmnopqrstuvwxyz";
      },
    };
  },
);
System.register(
  "file:///Users/russell/Documents/Development/cloudcode/client/socket",
  [
    "https://raw.githubusercontent.com/rclarey/simple-ot/v1.1.1/control.ts#^",
    "https://raw.githubusercontent.com/rclarey/simple-ot/v1.1.1/charwise.ts#^",
    "file:///Users/russell/Documents/Development/cloudcode/client/error",
    "file:///Users/russell/Documents/Development/cloudcode/client/util",
  ],
  function (exports_7, context_7) {
    "use strict";
    var control_ts__1, charwise_ts__1, error_ts_1, util_ts_1, WS_URL;
    var __moduleName = context_7 && context_7.id;
    function sendMsg(socket, msg) {
      socket.send(JSON.stringify(msg));
    }
    function setMode(cm, mode, value) {
      if (mode === "typescript") {
        cm.setOption("mode", {
          name: value,
          typescript: true,
        });
      } else {
        cm.setOption("mode", value);
      }
    }
    function handleMessages(socket, cm, select, ot) {
      return async (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === "mode") {
            const opt = select.namedItem(data.mode);
            if (opt) {
              const value = opt.value === "~null~" ? null : opt.value;
              await util_ts_1.ensureMode(value);
              opt.selected = true;
              setMode(cm, util_ts_1.modeId(opt.innerText), value);
            }
          } else if (data.type === "op") {
            cm.operation(() => {
              const after = [];
              const initPos = data.ops[0].position;
              const transformed = ot.goto(
                charwise_ts__1.deserialize(data.ops[0]),
              );
              const posDiff = transformed.position - initPos;
              after.push(transformed);
              ot.addToHistory(transformed);
              for (const op of data.ops.slice(1)) {
                const newOp = charwise_ts__1.deserialize(op);
                newOp.position += posDiff;
                after.push(newOp);
                ot.addToHistory(newOp);
              }
              for (const op of after) {
                const pos = cm.posFromIndex(op.position);
                if (op instanceof charwise_ts__1.Insert) {
                  cm.replaceRange(op.char, pos, pos, "~cloudcode~");
                } else {
                  cm.replaceRange(
                    "",
                    pos,
                    cm.posFromIndex(op.position + 1),
                    "~cloudcode~",
                  );
                }
              }
            });
          }
        } catch (e) {
          console.error(e);
          error_ts_1.fatalError(socket);
        }
      };
    }
    function handleEditorChange(id, socket, ot) {
      return (cm, change) => {
        if (change.origin === "~cloudcode~" || change.origin === "setValue") {
          return;
        }
        const ops = [];
        let start = cm.indexFromPos(change.from);
        let end = cm.indexFromPos(change.to);
        for (let i = 0; i < end - start; i += 1) {
          const op = new charwise_ts__1.Delete(
            start,
            util_ts_1.genId(),
            ot.siteID,
            ot.history(),
          );
          ops.push(charwise_ts__1.serialize(op));
          ot.addToHistory(op);
        }
        for (const c of change.text.join("\n")) {
          const op = new charwise_ts__1.Insert(
            c,
            start,
            util_ts_1.genId(),
            ot.siteID,
            ot.history(),
          );
          ops.push(charwise_ts__1.serialize(op));
          ot.addToHistory(op);
          start += 1;
        }
        sendMsg(socket, {
          id,
          ops,
          type: "op",
        });
      };
    }
    function handleSocketClose(id, cm, select, editorChangeHandler) {
      return () => {
        cm.off("beforeChange", editorChangeHandler);
        cm.setOption("readOnly", true);
        error_ts_1.networkError((async () => {
          while (true) {
            try {
              await setupSocket(id, cm, select);
              return;
            } catch {
              await new Promise((r) => setTimeout(r, 1000));
            }
          }
        })());
      };
    }
    function handleSelectChange(id, socket, cm) {
      return async (e) => {
        const target = e.target;
        const opt = Array.from(target.children).find((o) =>
          o instanceof HTMLOptionElement && o.selected
        );
        const [value, mode] = target.value === "~null~"
          ? [null, "plain-text"]
          : [target.value, util_ts_1.modeId(opt.innerText)];
        sendMsg(socket, {
          id,
          mode,
          timestamp: Date.now(),
          type: "mode",
        });
        await util_ts_1.ensureMode(value);
        setMode(cm, mode, value);
      };
    }
    async function setupSocket(id, cm, select) {
      const socket = new WebSocket(WS_URL);
      const opened = util_ts_1.deferred();
      const initMsg = util_ts_1.deferred();
      socket.onopen = () => {
        opened.resolve(true);
        sendMsg(socket, { type: "init", id });
      };
      socket.onerror = () => opened.resolve(false);
      socket.onmessage = (e) => initMsg.resolve(e);
      const success = await opened;
      if (!success) {
        throw new Error("Failed to setup socket");
      }
      try {
        const { data } = await initMsg;
        const msg = JSON.parse(data);
        if (msg.type !== "ack") {
          throw new Error(
            `Expected an "ack" message, but received "${msg.type}" instead`,
          );
        }
        const opt = select.namedItem(msg.mode);
        if (opt !== null) {
          const value = opt.value === "~null~" ? null : opt.value;
          await util_ts_1.ensureMode(value);
          opt.selected = true;
          setMode(cm, util_ts_1.modeId(opt.innerText), value);
        }
        const ot = new control_ts__1.OT(
          charwise_ts__1.inclusionTransform,
          charwise_ts__1.exclusionTransform,
          msg.siteId,
        );
        msg.history.forEach((op) =>
          ot.addToHistory(charwise_ts__1.deserialize(op))
        );
        const editorChangeHandler = handleEditorChange(id, socket, ot);
        select.onchange = handleSelectChange(id, socket, cm);
        socket.onmessage = handleMessages(socket, cm, select, ot);
        socket.onclose = handleSocketClose(id, cm, select, editorChangeHandler);
        cm.on("beforeChange", editorChangeHandler);
        cm.setValue(msg.value);
        cm.setOption("readOnly", false);
      } catch (e) {
        console.error(e);
        error_ts_1.fatalError(socket);
      }
    }
    exports_7("setupSocket", setupSocket);
    return {
      setters: [
        function (control_ts__1_1) {
          control_ts__1 = control_ts__1_1;
        },
        function (charwise_ts__1_1) {
          charwise_ts__1 = charwise_ts__1_1;
        },
        function (error_ts_1_1) {
          error_ts_1 = error_ts_1_1;
        },
        function (util_ts_1_1) {
          util_ts_1 = util_ts_1_1;
        },
      ],
      execute: function () {
        WS_URL = "ws://localhost:8080";
      },
    };
  },
);
System.register(
  "file:///Users/russell/Documents/Development/cloudcode/client/editor",
  [
    "file:///Users/russell/Documents/Development/cloudcode/client/socket",
    "file:///Users/russell/Documents/Development/cloudcode/client/util",
  ],
  function (exports_8, context_8) {
    "use strict";
    var socket_ts_1, util_ts_2, supportedModes;
    var __moduleName = context_8 && context_8.id;
    function vimToggle(parent, cm) {
      const container = document.createElement("div");
      container.className = "toggle__container";
      const label = document.createElement("label");
      label.htmlFor = "vim-toggle";
      label.className = "toggle__label";
      label.innerText = "Vim mode";
      container.appendChild(label);
      const toggle = document.createElement("input");
      toggle.name = "vim-toggle";
      toggle.type = "checkbox";
      toggle.className = "toggle__input";
      container.appendChild(toggle);
      toggle.onchange = (e) => {
        const target = e.target;
        if (target.checked) {
          cm.setOption("keyMap", "vim");
        } else {
          cm.setOption("keyMap", "default");
        }
      };
      parent.appendChild(container);
    }
    function modePicker(parent) {
      const select = document.createElement("select");
      select.className = "mode__select";
      const pt = new Option("Plain text", "~null~", true);
      pt.id = "plain-text";
      select.add(pt);
      for (const [name, value] of supportedModes) {
        const id = util_ts_2.modeId(name);
        const opt = new Option(name, value);
        opt.id = id;
        select.add(opt);
      }
      parent.appendChild(select);
      return select;
    }
    function editor(id) {
      const root = document.createElement("div");
      root.className = "editor__root";
      const bar = document.createElement("div");
      bar.className = "bar";
      document.body.appendChild(root);
      document.body.appendChild(bar);
      const cm = CodeMirror(root, {
        theme: "nord",
        lineNumbers: true,
        readOnly: true,
        cursorBlinkRate: 0,
      });
      const select = modePicker(bar);
      vimToggle(bar, cm);
      socket_ts_1.setupSocket(id, cm, select);
    }
    exports_8("default", editor);
    return {
      setters: [
        function (socket_ts_1_1) {
          socket_ts_1 = socket_ts_1_1;
        },
        function (util_ts_2_1) {
          util_ts_2 = util_ts_2_1;
        },
      ],
      execute: function () {
        supportedModes = [
          ["APL", "apl"],
          ["ASN.1", "asn.1"],
          ["Asterisk dialplan", "asterisk"],
          ["Brainfuck", "brainfuck"],
          ["C, C++, C#", "clike"],
          ["Ceylon", "clike"],
          ["Clojure", "clojure"],
          ["Closure Stylesheets (GSS)", "css"],
          ["CMake", "cmake"],
          ["COBOL", "cobol"],
          ["CSS", "css"],
          ["CoffeeScript", "coffeescript"],
          ["Common Lisp", "commonlisp"],
          ["Crystal", "crystal"],
          ["Cypher", "cypher"],
          ["Cython", "python"],
          ["D", "d"],
          ["DTD", "dtd"],
          ["Dart", "dart"],
          ["Django (templating language)", "django"],
          ["Dockerfile", "dockerfile"],
          ["Dylan", "dylan"],
          ["EBNF", "ebnf"],
          ["ECL", "ecl"],
          ["Eiffel", "eiffel"],
          ["Elm", "elm"],
          ["Erlang", "erlang"],
          ["F#", "mllike"],
          ["FCL", "fcl"],
          ["Factor", "factor"],
          ["Forth", "forth"],
          ["Fortran", "fortran"],
          ["Gas (AT&T-style assembly)", "gas"],
          ["Gherkin", "gherkin"],
          ["Go", "go"],
          ["Groovy", "groovy"],
          ["HAML", "haml"],
          ["HTML mixed-mode", "htmlmixed"],
          ["HTTP", "http"],
          ["Handlebars", "handlebars"],
          ["Haskell (Literate)", "haskell-literate"],
          ["Haskell", "haskell"],
          ["Haxe", "haxe"],
          ["IDL", "idl"],
          ["JSX", "jsx"],
          ["Java", "clike"],
          ["JavaScript", "javascript"],
          ["Jinja2", "jinja2"],
          ["Julia", "julia"],
          ["Kotlin", "clike"],
          ["LESS", "css"],
          ["LiveScript", "livescript"],
          ["Lua", "lua"],
          ["MUMPS", "mumps"],
          ["Markdown", "markdown"],
          ["Mathematica", "mathematica"],
          ["Modelica", "modelica"],
          ["MscGen", "mscgen"],
          ["N-Triples/N-Quads", "ntriples"],
          ["NSIS", "nsis"],
          ["Nginx", "nginx"],
          ["OCaml", "mllike"],
          ["Objective C", "clike"],
          ["Octave", "octave"],
          ["Oz", "oz"],
          ["PEG.js", "pegjs"],
          ["PGP (ASCII armor)", "asciiarmor"],
          ["PHP", "php"],
          ["Pascal", "pascal"],
          ["Perl", "perl"],
          ["Pig Latin", "pig"],
          ["PowerShell", "powershell"],
          ["Properties files", "properties"],
          ["ProtoBuf", "protobuf"],
          ["Pug", "pug"],
          ["Puppet", "puppet"],
          ["Python", "python"],
          ["Q", "q"],
          ["R", "r"],
          ["RPM", "rpm"],
          ["Ruby", "ruby"],
          ["Rust", "rust"],
          ["SAS", "sas"],
          ["SCSS", "css"],
          ["SPARQL", "sparql"],
          ["SQL", "sql"],
          ["Sass", "sass"],
          ["Scala", "clike"],
          ["Scheme", "scheme"],
          ["Shell", "shell"],
          ["Sieve", "sieve"],
          ["Slim", "slim"],
          ["Smalltalk", "smalltalk"],
          ["Smarty", "smarty"],
          ["Solr", "solr"],
          ["Soy", "soy"],
          ["Spreadsheet", "spreadsheet"],
          ["Squirrel", "clike"],
          ["Stylus", "stylus"],
          ["Swift", "swift"],
          ["TOML", "toml"],
          ["TTCN Configuration", "ttcn-cfg"],
          ["TTCN", "ttcn"],
          ["Tcl", "tcl"],
          ["Textile", "textile"],
          ["Tiddlywiki", "tiddlywiki"],
          ["Tiki wiki", "tiki"],
          ["Tornado", "tornado"],
          ["Turtle", "turtle"],
          ["Twig", "twig"],
          ["TypeScript", "javascript"],
          ["VB.NET", "vb"],
          ["VBScript", "vbscript"],
          ["diff", "diff"],
          ["mIRC", "mirc"],
          ["mbox", "mbox"],
          ["reStructuredText", "rst"],
          ["sTeX, LaTeX", "stex"],
          ["troff", "troff"],
          ["Velocity", "velocity"],
          ["Verilog/SystemVerilog", "verilog"],
          ["VHDL", "vhdl"],
          ["Vue.js app", "vue"],
          ["Web IDL", "webidl"],
          ["XML/HTML", "xml"],
          ["XQuery", "xquery"],
          ["Yacas", "yacas"],
          ["YAML", "yaml"],
          ["YAML frontmatter", "yaml-frontmatter"],
          ["Z80", "z80"],
        ];
      },
    };
  },
);
System.register(
  "file:///Users/russell/Documents/Development/cloudcode/client/main",
  [
    "file:///Users/russell/Documents/Development/cloudcode/client/editor",
    "file:///Users/russell/Documents/Development/cloudcode/client/modal",
    "file:///Users/russell/Documents/Development/cloudcode/client/util",
  ],
  function (exports_9, context_9) {
    "use strict";
    var editor_ts_1, modal_ts_2, util_ts_3;
    var __moduleName = context_9 && context_9.id;
    function docId() {
      const re = /\?doc=(?<id>[^&]*)/;
      return re.exec(location.search)?.groups?.id ?? null;
    }
    function render() {
      const id = docId();
      if (!id) {
        modal_ts_2.default({
          title: "Welcome!",
          body: [
            'Cloudcode was mostly built as a functional example for my <a href="https://github.com/rclarey/simple-ot">operational transform library</a>, however it <i>is</i> useful for quickly creating a shareable document that can be collaboratively edited, for a video call with your team for example.',
            "<b>WARNING:</b> documents are only stored in memory on the server, so there is no guarantee that they will be persisted once all clients disconnect. Do not rely on Cloudcode to persist your documents.",
          ],
          confirm: "Create a new document",
          onConfirm: async () => {
            const newId = util_ts_3.genId();
            location.search = `doc=${newId}`;
            editor_ts_1.default(newId);
          },
        });
      } else {
        editor_ts_1.default(id);
      }
    }
    return {
      setters: [
        function (editor_ts_1_1) {
          editor_ts_1 = editor_ts_1_1;
        },
        function (modal_ts_2_1) {
          modal_ts_2 = modal_ts_2_1;
        },
        function (util_ts_3_1) {
          util_ts_3 = util_ts_3_1;
        },
      ],
      execute: function () {
        render();
      },
    };
  },
);

__instantiate(
  "file:///Users/russell/Documents/Development/cloudcode/client/main",
);
