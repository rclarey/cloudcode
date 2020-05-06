(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "browser";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("main.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const editor_1 = __importDefault(require("./editor"));
const modal_1 = __importDefault(require("./modal"));
const util_1 = require("./util");
function docId() {
    var _a, _b, _c;
    const re = /\?doc=(?<id>[^&]*)/;
    return (_c = (_b = (_a = re.exec(location.search)) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : null;
}
function render() {
    const id = docId();
    if (!id) {
        modal_1.default({
            title: "Welcome!",
            body: [
                'Cloudcode was mostly built as a functional example for my <a href="https://github.com/rclarey/simple-ot">operational transform library</a>, however it <i>is</i> useful for quickly creating a shareable document that can be collaboratively edited, for a video call with your team for example.',
                "<b>WARNING:</b> documents are only stored in memory on the server, so there is no guarantee that they will be persisted once all clients disconnect. Do not rely on Cloudcode to persist your documents."
            ],
            confirm: "Create a new document",
            onConfirm: () => __awaiter(this, void 0, void 0, function* () {
                const newId = util_1.genId();
                location.search = `doc=${newId}`;
                editor_1.default(newId);
            })
        });
    }
    else {
        editor_1.default(id);
    }
}
render();

});
___scope___.file("editor.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("./socket");
const util_1 = require("./util");
const supportedModes = [
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
    ["Z80", "z80"]
];
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
    toggle.onchange = e => {
        const target = e.target;
        if (target.checked) {
            cm.setOption("keyMap", "vim");
        }
        else {
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
        const id = util_1.modeId(name);
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
        cursorBlinkRate: 0
    });
    window.cm = cm;
    const select = modePicker(bar);
    vimToggle(bar, cm);
    socket_1.setupSocket(id, cm, select);
}
exports.default = editor;

});
___scope___.file("socket.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_ot_1 = require("@rclarey/simple-ot");
const charwise_1 = require("@rclarey/simple-ot/dist/charwise");
const error_1 = require("./error");
const util_1 = require("./util");
const WS_URL = "ws://cloudcode.fly.dev/:80";
function sendMsg(socket, msg) {
    socket.send(JSON.stringify(msg));
}
function setMode(cm, mode, value) {
    if (mode === "typescript") {
        console.log("yes typescript");
        cm.setOption("mode", {
            name: value,
            typescript: true
        });
    }
    else {
        console.log(mode);
        cm.setOption("mode", value);
    }
}
function handleMessages(socket, cm, select, ot) {
    return (e) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = JSON.parse(e.data);
            if (data.type === "mode") {
                const opt = select.namedItem(data.mode);
                if (opt) {
                    const value = opt.value === "~null~" ? null : opt.value;
                    yield util_1.ensureMode(value);
                    opt.selected = true;
                    setMode(cm, util_1.modeId(opt.innerText), value);
                }
            }
            else if (data.type === "op") {
                cm.operation(() => {
                    const after = [];
                    const initPos = data.ops[0].position;
                    const transformed = ot.goto(charwise_1.deserialize(data.ops[0]));
                    const posDiff = transformed.position - initPos;
                    after.push(transformed);
                    ot.addToHistory(transformed);
                    for (const op of data.ops.slice(1)) {
                        const newOp = charwise_1.deserialize(op);
                        newOp.position += posDiff;
                        after.push(newOp);
                        ot.addToHistory(newOp);
                    }
                    for (const op of after) {
                        const pos = cm.posFromIndex(op.position);
                        if (op instanceof charwise_1.Insert) {
                            cm.replaceRange(op.char, pos);
                        }
                        else {
                            cm.replaceRange("", pos, cm.posFromIndex(op.position + 1));
                        }
                    }
                });
            }
        }
        catch (e) {
            console.error(e);
            error_1.fatalError(socket);
        }
    });
}
function handleEditorChange(id, socket, ot) {
    return (cm, change) => {
        console.log(change);
        if (change.origin == undefined || change.origin === "setValue") {
            return;
        }
        const ops = [];
        let start = cm.indexFromPos(change.from);
        let end = cm.indexFromPos(change.to);
        for (let i = 0; i < end - start; i += 1) {
            const op = new charwise_1.Delete(start, util_1.genId(), ot.siteID, ot.history());
            ops.push(charwise_1.serialize(op));
            ot.addToHistory(op);
        }
        for (const c of change.text.join("\n")) {
            console.log(start, ">i>", JSON.stringify(c));
            const op = new charwise_1.Insert(c, start, util_1.genId(), ot.siteID, ot.history());
            ops.push(charwise_1.serialize(op));
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
function handleSocketClose(id, cm, select, editorChangeHandler) {
    return () => {
        cm.off("beforeChange", editorChangeHandler);
        cm.setOption("readOnly", true);
        error_1.networkError((() => __awaiter(this, void 0, void 0, function* () {
            while (true) {
                try {
                    console.log("Trying to connect....");
                    yield setupSocket(id, cm, select);
                    return;
                }
                catch (_a) {
                    console.log("Sleeping...");
                    yield new Promise(r => setTimeout(r, 1000));
                }
            }
        }))());
    };
}
function handleSelectChange(id, socket, cm) {
    return (e) => __awaiter(this, void 0, void 0, function* () {
        const target = e.target;
        const opt = Array.from(target.children).find(o => o instanceof HTMLOptionElement && o.selected);
        const [value, mode] = target.value === "~null~"
            ? [null, "plain-text"]
            : [target.value, util_1.modeId(opt.innerText)];
        sendMsg(socket, {
            id,
            mode,
            timestamp: Date.now(),
            type: "mode"
        });
        yield util_1.ensureMode(value);
        setMode(cm, mode, value);
    });
}
function setupSocket(id, cm, select) {
    return __awaiter(this, void 0, void 0, function* () {
        const socket = new WebSocket(WS_URL);
        const opened = util_1.deferred();
        const initMsg = util_1.deferred();
        socket.onopen = () => {
            opened.resolve(true);
            sendMsg(socket, { type: "init", id });
        };
        socket.onerror = () => opened.resolve(false);
        socket.onmessage = e => initMsg.resolve(e);
        const success = yield opened;
        if (!success) {
            throw new Error("Failed to setup socket");
        }
        try {
            const { data } = yield initMsg;
            const msg = JSON.parse(data);
            if (msg.type !== "ack") {
                throw new Error(`Expected an "ack" message, but received "${msg.type}" instead`);
            }
            const opt = select.namedItem(msg.mode);
            if (opt !== null) {
                const value = opt.value === "~null~" ? null : opt.value;
                yield util_1.ensureMode(value);
                opt.selected = true;
                setMode(cm, util_1.modeId(opt.innerText), value);
            }
            const ot = new simple_ot_1.OT(charwise_1.inclusionTransform, charwise_1.exclusionTransform, msg.siteId);
            msg.history.forEach(op => ot.addToHistory(charwise_1.deserialize(op)));
            const editorChangeHandler = handleEditorChange(id, socket, ot);
            select.onchange = handleSelectChange(id, socket, cm);
            socket.onmessage = handleMessages(socket, cm, select, ot);
            socket.onclose = handleSocketClose(id, cm, select, editorChangeHandler);
            cm.on("beforeChange", editorChangeHandler);
            cm.setValue(msg.value);
            cm.setOption("readOnly", false);
        }
        catch (e) {
            console.error(e);
            error_1.fatalError(socket);
        }
    });
}
exports.setupSocket = setupSocket;

});
___scope___.file("error.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modal_1 = __importDefault(require("./modal"));
function fatalError(socket) {
    socket.onclose = null;
    if (socket.readyState !== socket.CLOSED &&
        socket.readyState !== socket.CLOSING) {
        socket.close();
    }
    for (const elem of document.body.children) {
        document.body.removeChild(elem);
    }
    modal_1.default({
        title: "Error!",
        body: [
            "Something unexpected went wrong!",
            "You can try refreshing the page to fix it."
        ]
    });
}
exports.fatalError = fatalError;
function networkError(p) {
    return __awaiter(this, void 0, void 0, function* () {
        const m = modal_1.default({
            title: "Lost connection!",
            body: ["Attempting to reconnect..."]
        });
        yield p;
        document.body.removeChild(m);
    });
}
exports.networkError = networkError;

});
___scope___.file("modal.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function modal(opts) {
    const bg = document.createElement("div");
    bg.className = "modal__bg";
    bg.onclick = e => e.stopPropagation();
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
        button.onclick = () => __awaiter(this, void 0, void 0, function* () {
            yield opts.onConfirm();
            document.body.removeChild(root);
            document.body.removeChild(bg);
        });
        root.appendChild(button);
    }
    document.body.appendChild(bg);
    return bg;
}
exports.default = modal;

});
___scope___.file("util.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_-abcdefghijklmnopqrstuvwxyz";
function genId() {
    let id = "";
    let i = 12;
    while (i--) {
        id += alphabet[(Math.random() * 64) | 0];
    }
    return id;
}
exports.genId = genId;
function ensureMode(name) {
    return new Promise(resolve => {
        const modeUrl = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.53.2/mode/${name}/${name}.min.js`;
        if (name != null && !document.querySelector(`script[src="${modeUrl}"]`)) {
            const s = document.createElement("script");
            s.src = modeUrl;
            s.onload = () => resolve();
            document.body.appendChild(s);
        }
        else {
            resolve();
        }
    });
}
exports.ensureMode = ensureMode;
function deferred() {
    let resolve;
    const p = new Promise(res => {
        resolve = res;
    });
    return Object.assign(p, { resolve });
}
exports.deferred = deferred;
function modeId(name) {
    return name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
}
exports.modeId = modeId;

});
return ___scope___.entry = "main.js";
});
FuseBox.pkg("@rclarey/simple-ot", {}, function(___scope___){
___scope___.file("dist/mod.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var control_1 = require("./control");
exports.OT = control_1.OT;
const charwise_1 = require("./charwise");
exports.charwise = {
    Delete: charwise_1.Delete,
    Insert: charwise_1.Insert,
    Operation: charwise_1.Operation,
    OperationType: charwise_1.OperationType,
    deserialize: charwise_1.deserialize,
    exclusionTransform: charwise_1.exclusionTransform,
    inclusionTransform: charwise_1.inclusionTransform,
    serialize: charwise_1.serialize,
};

});
___scope___.file("dist/control.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OT {
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
            if (OT.operationsAreIndependent(operation, this.historyBuffer[i])) {
                k = i;
                break;
            }
        }
        if (k === -1) {
            return operation;
        }
        const pre = [];
        for (let i = k + 1; i < this.historyBuffer.length; i += 1) {
            if (!OT.operationsAreIndependent(operation, this.historyBuffer[i])) {
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
}
exports.OT = OT;

});
___scope___.file("dist/charwise.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function (OperationType) {
    OperationType["DELETE"] = "d";
    OperationType["INSERT"] = "i";
})(exports.OperationType || (exports.OperationType = {}));
class Operation {
    constructor(type, position, id, siteID, historyBuffer, isNoop) {
        this.type = type;
        this.position = position;
        this.id = id;
        this.siteID = siteID;
        this.historyBuffer = historyBuffer;
        this.isNoop = isNoop;
        this.auxPos = position;
    }
}
exports.Operation = Operation;
class Insert extends Operation {
    constructor(char, position, id, siteID, historyBuffer, isNoop = false) {
        super(exports.OperationType.INSERT, position, id, siteID, historyBuffer, isNoop);
        this.char = char;
    }
}
exports.Insert = Insert;
class Delete extends Operation {
    constructor(position, id, siteID, historyBuffer, isNoop = false) {
        super(exports.OperationType.DELETE, position, id, siteID, historyBuffer, isNoop);
    }
}
exports.Delete = Delete;
function inclusionTransform(op1, op2) {
    if (op1.isNoop) {
        if (op1 instanceof Delete && op2 instanceof Insert && op1.position === op2.position) {
            return new Delete(op1.position, op1.id, op1.siteID, op1.historyBuffer);
        }
        return op1;
    }
    if (op2.isNoop) {
        if (op1 instanceof Insert && op2 instanceof Delete && op1.position === op2.auxPos) {
            return new Insert(op1.char, op1.position, op1.id, op1.siteID, op1.historyBuffer, true);
        }
        return op1;
    }
    if (op1 instanceof Insert && op2 instanceof Insert) {
        if (op1.position < op2.position ||
            (op1.position === op2.position && op1.siteID <= op2.siteID)) {
            return new Insert(op1.char, op1.auxPos, op1.id, op1.siteID, op1.historyBuffer);
        }
        const pos = Math.min(op1.position, op1.auxPos) + 1;
        return new Insert(op1.char, pos, op1.id, op1.siteID, op1.historyBuffer);
    }
    if (op1 instanceof Insert && op2 instanceof Delete) {
        if (op1.position <= op2.position) {
            return op1;
        }
        const op3 = new Insert(op1.char, op1.position - 1, op1.id, op1.siteID, op1.historyBuffer);
        op3.auxPos = op1.position;
        return op3;
    }
    if (op1 instanceof Delete && op2 instanceof Insert) {
        if (op1.position < op2.position) {
            return op1;
        }
        return new Delete(op1.position + 1, op1.id, op1.siteID, op1.historyBuffer);
    }
    if (op1 instanceof Delete && op2 instanceof Delete) {
        if (op1.position === op2.position) {
            return new Delete(op1.position, op1.id, op1.siteID, op1.historyBuffer, true);
        }
        if (op1.position < op2.position) {
            return op1;
        }
        const op3 = new Delete(op1.position - 1, op1.id, op1.siteID, op1.historyBuffer);
        op3.auxPos = op1.position;
        return op3;
    }
    return op1;
}
exports.inclusionTransform = inclusionTransform;
function exclusionTransform(op1, op2) {
    if (op1.isNoop) {
        if (op2.isNoop &&
            op1.position === op2.position &&
            op1 instanceof Insert &&
            op2 instanceof Delete) {
            return new Insert(op1.char, op1.position, op1.id, op1.siteID, op1.historyBuffer);
        }
        if (op1.position === op2.position && op1 instanceof Delete && op2 instanceof Delete) {
            return new Delete(op1.position, op1.id, op1.siteID, op1.historyBuffer);
        }
        if (op1 instanceof Delete && op2 instanceof Insert) {
            const op = new Delete(op1.position, op1.id, op1.siteID, op1.historyBuffer, true);
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
            const op3 = new Insert(op1.char, op1.position, op1.id, op1.siteID, op1.historyBuffer);
            op3.auxPos = op1.position - 1;
            return op3;
        }
        if (op1.position <= op2.position) {
            op2.auxPos = op2.position + 1;
            return op1;
        }
        const op4 = new Insert(op1.char, op1.position - 1, op1.id, op1.siteID, op1.historyBuffer);
        if (op1.siteID < op2.siteID) {
            op4.auxPos = op1.position;
        }
        return op4;
    }
    if (op1 instanceof Insert && op2 instanceof Delete) {
        if (op1.position === op2.position) {
            return new Insert(op1.char, op1.auxPos, op1.id, op1.siteID, op1.historyBuffer);
        }
        if (op1.position < op2.position) {
            return op1;
        }
        return new Insert(op1.char, op1.position + 1, op1.id, op1.siteID, op1.historyBuffer);
    }
    if (op1 instanceof Delete && op2 instanceof Insert) {
        if (op1.position === op2.position) {
            return new Delete(op1.position, op1.id, op1.siteID, op1.historyBuffer, true);
        }
        if (op1.position < op2.position) {
            return op1;
        }
        return new Delete(op1.position - 1, op1.id, op1.siteID, op1.historyBuffer);
    }
    if (op1 instanceof Delete && op2 instanceof Delete) {
        if (op1.position >= op2.position) {
            return new Delete(op1.position + 1, op1.id, op1.siteID, op1.historyBuffer);
        }
        return new Delete(op1.position, op1.id, op1.siteID, op1.historyBuffer);
    }
    return op1;
}
exports.exclusionTransform = exclusionTransform;
function serialize(operation) {
    const { historyBuffer, id, type, position, siteID } = operation;
    const serialized = { historyBuffer, id, type, position, siteID };
    if (operation instanceof Insert) {
        serialized.char = operation.char;
    }
    return serialized;
}
exports.serialize = serialize;
function deserialize(op) {
    if (op.type === exports.OperationType.INSERT) {
        return new Insert(op.char, op.position, op.id, op.siteID, op.historyBuffer);
    }
    return new Delete(op.position, op.id, op.siteID, op.historyBuffer);
}
exports.deserialize = deserialize;

});
return ___scope___.entry = "dist/mod.js";
});

FuseBox.import("default/main.js");
FuseBox.main("default/main.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{server:require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=x[a];if(!s){if(m&&"electron"!==_.target)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?h.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);_.dynamic(a,o),r(_.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=y[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){if(null!==e&&["function","object","array"].indexOf(typeof e)!==-1&&!e.hasOwnProperty("default"))return Object.isFrozen(e)?void(e.default=e):void Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1})}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=x[t.pkgName];if(f){var p={};for(var v in f.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var g="function"==typeof r,y=l("async",[e,r]);if(y===!1)return;return s(e,function(e){return g?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return _.sdep&&d(n),n},m||!h.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=h.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,h=m?v||p?{}:window:global;m&&(h.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var g=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:h.$fsbx=h.$fsbx||{};m||(h.require=require);var x=g.p=g.p||{},y=g.e=g.e||{},_=function(){function r(){}return r.global=function(e,r){return void 0===r?h[e]:void(h[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){y[e]=y[e]||[],y[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(h.FuseBox=_),e.FuseBox=_}(this))