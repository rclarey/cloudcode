///<reference path="../types/codemirror.d.ts" />
import { setupSocket } from "./socket";
import { modeId } from "./util";

const supportedModes: [string, string][] = [
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

function vimToggle(parent: HTMLElement, cm: CodeMirror.Editor): void {
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
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      cm.setOption("keyMap", "vim");
    } else {
      cm.setOption("keyMap", "default");
    }
  };

  parent.appendChild(container);
}

function modePicker(parent: HTMLElement): HTMLSelectElement {
  const select = document.createElement("select");
  select.className = "mode__select";

  const pt = new Option("Plain text", "~null~", true);
  pt.id = "plain-text";
  select.add(pt);
  for (const [name, value] of supportedModes) {
    const id = modeId(name);
    const opt = new Option(name, value);
    opt.id = id;
    select.add(opt);
  }

  parent.appendChild(select);
  return select;
}

export default function editor(id: string): void {
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
  setupSocket(id, cm, select);
}
