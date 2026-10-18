/* A small Python interpreter: enough for if / elif / else, while and for loops, comparisons,
   input() and the micro:bit calls used in these lessons. It reports real Python error types. */
import { IMAGES, CANCEL } from "./microbit.js";

export const MB_HEAD = ["from microbit import *", ""];
const BREAK = Symbol("break");
export class PyErr { constructor(type, msg, line) { this.type = type; this.msg = msg; this.line = line; } }
const syntaxErr = line => new PyErr("SyntaxError", "invalid syntax", line);

function tokenize(s, line) {
  const t = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === " " || c === "\t") { i++; continue; }
    if (c === "#") break;
    if (/\d/.test(c)) { let j = i; while (j < s.length && /[\d.]/.test(s[j])) j++; t.push({ k: "num", v: parseFloat(s.slice(i, j)) }); i = j; continue; }
    if (c === '"' || c === "'") { let j = i + 1; while (j < s.length && s[j] !== c) j++; if (j >= s.length) throw syntaxErr(line); t.push({ k: "str", v: s.slice(i + 1, j) }); i = j + 1; continue; }
    if (/[A-Za-z_]/.test(c)) { let j = i; while (j < s.length && /\w/.test(s[j])) j++; t.push({ k: "name", v: s.slice(i, j) }); i = j; continue; }
    const two = s.slice(i, i + 2);
    if (["==", "!=", ">=", "<="].includes(two)) { t.push({ k: "op", v: two }); i += 2; continue; }
    if ("+-*/%<>(),.=:".includes(c)) { t.push({ k: "op", v: c }); i++; continue; }
    throw syntaxErr(line);
  }
  return t;
}
function parseExpr(src, line) {
  const tokens = tokenize(src, line);
  let i = 0;
  const fail = () => { throw syntaxErr(line); };
  const isOp = v => tokens[i] && tokens[i].k === "op" && tokens[i].v === v;
  const isKw = v => tokens[i] && tokens[i].k === "name" && tokens[i].v === v;
  const or = () => { let a = and(); while (isKw("or")) { i++; a = { t: "or", a, b: and() }; } return a; };
  const and = () => { let a = not(); while (isKw("and")) { i++; a = { t: "and", a, b: not() }; } return a; };
  const not = () => { if (isKw("not")) { i++; return { t: "not", a: not() }; } return cmp(); };
  const cmp = () => {
    const a = add(), t = tokens[i];
    if (t && t.k === "op" && ["==", "!=", "<", ">", "<=", ">="].includes(t.v)) { i++; return { t: "cmp", op: t.v, a, b: add() }; }
    return a;
  };
  const add = () => { let a = mul(); while (isOp("+") || isOp("-")) { const op = tokens[i++].v; a = { t: "bin", op, a, b: mul() }; } return a; };
  const mul = () => { let a = unary(); while (isOp("*") || isOp("/") || isOp("%")) { const op = tokens[i++].v; a = { t: "bin", op, a, b: unary() }; } return a; };
  const unary = () => { if (isOp("-")) { i++; return { t: "neg", a: unary() }; } return post(); };
  const post = () => {
    let a = atom();
    for (;;) {
      if (isOp(".")) { i++; const n = tokens[i++]; if (!n || n.k !== "name") fail(); a = { t: "attr", obj: a, name: n.v }; }
      else if (isOp("(")) {
        i++;
        const args = [];
        if (!isOp(")")) { for (;;) { args.push(or()); if (isOp(",")) { i++; continue; } break; } }
        if (!isOp(")")) fail();
        i++;
        a = { t: "call", fn: a, args };
      } else return a;
    }
  };
  const atom = () => {
    const t = tokens[i++];
    if (!t) fail();
    if (t.k === "num") return { t: "num", v: t.v };
    if (t.k === "str") return { t: "str", v: t.v };
    if (t.k === "name") { if (["and", "or", "not", "if", "elif", "else", "while", "def", "return", "import", "from"].includes(t.v)) fail(); return { t: "name", v: t.v }; }
    if (t.k === "op" && t.v === "(") { const e = or(); if (!isOp(")")) fail(); i++; return e; }
    fail();
  };
  const e = or();
  if (i < tokens.length) fail();
  return e;
}
function parseStmt(text, line) {
  const t = text.replace(/\s+#[^"']*$/, "");
  const ex = s => parseExpr(s, line);
  let m;
  if (/^(from|import)\b/.test(t)) return { kind: "pass" };
  if ((m = t.match(/^while\s+(.+):$/))) return { kind: "while", cond: ex(m[1]) };
  if ((m = t.match(/^if\s+(.+):$/))) return { kind: "if", cond: ex(m[1]) };
  if ((m = t.match(/^elif\s+(.+):$/))) return { kind: "elif", cond: ex(m[1]) };
  if (/^else\s*:$/.test(t)) return { kind: "else" };
  if ((m = t.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+):$/))) return { kind: "for", name: m[1], iter: ex(m[2]) };
  if (/^(if|elif|else|while|for)\b/.test(t)) throw syntaxErr(line);
  if (t === "break") return { kind: "break" };
  if (t === "pass") return { kind: "pass" };
  if ((m = t.match(/^([A-Za-z_]\w*)\s*([+\-*])=\s*(.+)$/))) return { kind: "assign", name: m[1], value: { t: "bin", op: m[2], a: { t: "name", v: m[1] }, b: ex(m[3]) } };
  if ((m = t.match(/^([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/))) return { kind: "assign", name: m[1], value: ex(m[2]) };
  return { kind: "expr", value: ex(t) };
}
export function compile(lines) {
  const items = [];
  lines.forEach((raw, idx) => {
    const text = raw.replace(/\s+$/, ""), stripped = text.trim();
    if (!stripped || stripped.startsWith("#")) return;
    // The real indent, in spaces (a tab counts as 4), compared exactly like Python does:
    // a line indented 2 spaces under a block indented 4 is an error, not "close enough"
    const lead = text.match(/^[ \t]*/)[0];
    items.push({ line: idx + 1, ind: lead.replace(/\t/g, "    ").length, text: stripped });
  });
  const opensBlock = t => t.replace(/\s+#[^"']*$/, "").endsWith(":");
  // Line by line, like Python: indentation of this line, then its syntax, then else/elif placement
  const blocks = [{ ind: 0, last: null }];
  let opens = false;
  for (const it of items) {
    const top = blocks[blocks.length - 1];
    if (opens) { if (it.ind <= top.ind) throw new PyErr("IndentationError", "expected an indented block", it.line); blocks.push({ ind: it.ind, last: null }); }
    else if (it.ind > top.ind) throw new PyErr("IndentationError", "unexpected indent", it.line);
    else if (it.ind < top.ind) {
      while (blocks[blocks.length - 1].ind > it.ind) blocks.pop();
      if (blocks[blocks.length - 1].ind !== it.ind) throw new PyErr("IndentationError", "unindent does not match any outer indentation level", it.line);
    }
    it.st = parseStmt(it.text, it.line);
    const b = blocks[blocks.length - 1];
    if ((it.st.kind === "elif" || it.st.kind === "else") && !(b.last === "if" || b.last === "elif")) throw syntaxErr(it.line);
    b.last = it.st.kind;
    opens = opensBlock(it.text);
  }
  if (opens && items.length) throw new PyErr("IndentationError", "expected an indented block", items[items.length - 1].line);
  const root = { kids: [] }, stack = [{ ind: -1, node: root }];
  for (const it of items) {
    while (stack[stack.length - 1].ind >= it.ind) stack.pop();
    const node = Object.assign({}, it.st, { line: it.line, kids: [] });
    stack[stack.length - 1].node.kids.push(node);
    if (opensBlock(it.text)) stack.push({ ind: it.ind, node });
  }
  (function link(list) {
    for (let k = 0; k < list.length; k++) {
      const n = list[k];
      link(n.kids);
      if (n.kind === "if") n.branches = [{ cond: n.cond, kids: n.kids, line: n.line }];
      if (n.kind === "elif" || n.kind === "else") {
        const prev = list[k - 1];
        if (!prev || prev.kind !== "if" || prev.closed) throw syntaxErr(n.line);
        if (n.kind === "elif") prev.branches.push({ cond: n.cond, kids: n.kids, line: n.line });
        else { prev.elseKids = n.kids; prev.elseLine = n.line; prev.closed = true; }
        list.splice(k, 1); k--;
      }
    }
  })(root.kids);
  return root.kids;
}
const pyType = v => (v && v.range ? "range" : typeof v === "string" ? "str" : typeof v === "boolean" ? "bool" : v === null || v === undefined ? "NoneType" : v && v.img ? "Image" : v && v.fn ? "function" : Number.isInteger(v) ? "int" : "float");
function pyStr(v) {
  if (v === true) return "True";
  if (v === false) return "False";
  if (v === null || v === undefined) return "None";
  if (v && v.img) return "Image." + v.img;
  if (v && v.fn) return "<function>";
  if (v && v.range) return "range(" + v.args.join(", ") + ")";
  return String(v);
}
export const pyRepr = v => (typeof v === "string" ? `"${v}"` : pyStr(v));
const truthy = v => !(v === false || v === 0 || v === "" || v === null || v === undefined);
const dotted = n => (n.t === "name" ? n.v : n.t === "attr" ? (dotted(n.obj) ? dotted(n.obj) + "." + n.name : null) : null);
const DUNDER = { "<": "__lt__", ">": "__gt__", "<=": "__le__", ">=": "__ge__", "-": "__sub__", "*": "__mul__", "/": "__truediv__", "%": "__mod__", "+": "__add__" };

const BUILTINS = {
  "print": async (a, c) => c.env.serial(a.map(pyStr).join(" ")),
  "sleep": async (a, c) => c.s.sleep(a[0]),
  "display.scroll": async (a, c) => { const t = pyStr(a[0]); if (c.env.onScroll) c.env.onScroll(t); await c.env.board.scroll(t, c.s, c.env.scrollDelay || 85); },
  "display.show": async (a, c) => {
    const v = a[0];
    if (v && v.img) { c.env.board.show(v.img); if (c.env.onShow) c.env.onShow(v.img, true); return; }
    const t = pyStr(v);
    for (const ch of t) { c.env.board.showChar(ch); if (t.length > 1) await c.s.sleep(400); }
    if (c.env.onShow) c.env.onShow(t);
  },
  "display.clear": async (a, c) => { c.env.board.clear(); if (c.env.onClear) c.env.onClear(); },
  "display.set_pixel": async (a, c) => {
    if (a.length !== 3) throw new PyErr("TypeError", `function takes 3 positional arguments but ${a.length} were given`);
    const [x, y, v] = a;
    if (![x, y, v].every(n => Number.isInteger(n))) throw new PyErr("TypeError", "can't convert to int");
    if (x < 0 || x > 4 || y < 0 || y > 4) throw new PyErr("ValueError", "index out of bounds");
    if (v < 0 || v > 9) throw new PyErr("ValueError", "brightness out of bounds");
    c.env.board.setPixel(x, y, v);
  },
  "display.get_pixel": async (a, c) => {
    const [x, y] = a;
    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || x > 4 || y < 0 || y > 4) throw new PyErr("ValueError", "index out of bounds");
    return c.env.board.getPixel(x, y);
  },
  "display.read_light_level": async (a, c) => c.env.sensors.light,
  "music.pitch": async (a, c) => { c.env.speaker.play(a[0], a[1] === undefined ? 200 : a[1]); if (c.env.onPitch) c.env.onPitch(a[0]); await c.s.sleep(a[1] === undefined ? 200 : a[1]); },
  "button_a.is_pressed": async (a, c) => c.env.sensors.a,
  "button_b.is_pressed": async (a, c) => c.env.sensors.b,
  "button_a.was_pressed": async (a, c) => { const v = c.env.sensors.aLatch; c.env.sensors.aLatch = false; return v; },
  "button_b.was_pressed": async (a, c) => { const v = c.env.sensors.bLatch; c.env.sensors.bLatch = false; return v; },
  "pin1.read_analog": async (a, c) => c.env.sensors.pin1,
  "microphone.set_threshold": async (a, c) => { c.env.sensors.threshold = a[1]; },
  "microphone.was_event": async (a, c) => { const v = c.env.sensors.loud; c.env.sensors.loud = false; return v; },
  "random.randint": async a => a[0] + Math.floor(Math.random() * (a[1] - a[0] + 1)),
  "int": async a => {
    if (typeof a[0] === "number") return Math.trunc(a[0]);
    if (typeof a[0] === "string" && /^\s*-?\d+\s*$/.test(a[0])) return parseInt(a[0], 10);
    throw new PyErr("ValueError", `invalid syntax for integer with base 10: ${pyRepr(a[0])}`);
  },
  "str": async a => pyStr(a[0]),
  "range": async a => {
    if (!a.length || a.length > 3) throw new PyErr("TypeError", "range expected 1 to 3 arguments");
    for (const x of a) if (typeof x !== "number" || !Number.isInteger(x)) throw new PyErr("TypeError", typeof x === "number" ? "can't convert float to int" : `can't convert ${pyType(x)} to int`);
    const [s, e, st] = a.length === 1 ? [0, a[0], 1] : [a[0], a[1], a.length > 2 ? a[2] : 1];
    if (st === 0) throw new PyErr("ValueError", "zero step for range()");
    const out = [];
    for (let v = s; st > 0 ? v < e : v > e; v += st) { out.push(v); if (out.length > 10000) break; }
    return { range: out, args: a };
  },
  "input": async (a, c) => c.env.input(a.length ? pyStr(a[0]) : ""),
  "temperature": async (a, c) => c.env.sensors.temp
};
async function ev(n, c) {
  switch (n.t) {
    case "num": return n.v;
    case "str": return n.v;
    case "name":
      if (n.v === "True") return true;
      if (n.v === "False") return false;
      if (n.v === "None") return null;
      if (n.v in c.vars) return c.vars[n.v];
      if (BUILTINS[n.v]) return { fn: n.v };
      throw new PyErr("NameError", `name '${n.v}' isn't defined`);
    case "attr": {
      const d = dotted(n);
      if (d && d.startsWith("Image.")) { if (IMAGES[n.name]) return { img: n.name }; throw new PyErr("AttributeError", `type object 'Image' has no attribute '${n.name}'`); }
      if (d === "SoundEvent.LOUD") return "LOUD";
      if (d && BUILTINS[d]) return { fn: d };
      throw new PyErr("AttributeError", `object has no attribute '${n.name}'`);
    }
    case "call": {
      const d = dotted(n.fn);
      if (!d || !BUILTINS[d]) {
        if (n.fn.t === "name" && n.fn.v in c.vars) throw new PyErr("TypeError", `'${pyType(c.vars[n.fn.v])}' object isn't callable`);
        await ev(n.fn, c);
        throw new PyErr("TypeError", "object isn't callable");
      }
      const args = [];
      for (const a of n.args) args.push(await ev(a, c));
      return BUILTINS[d](args, c);
    }
    case "not": return !truthy(await ev(n.a, c));
    case "and": { const a = await ev(n.a, c); return truthy(a) ? ev(n.b, c) : a; }
    case "or": { const a = await ev(n.a, c); return truthy(a) ? a : ev(n.b, c); }
    case "neg": { const a = await ev(n.a, c); if (typeof a !== "number") throw new PyErr("TypeError", `unsupported type for __neg__: '${pyType(a)}'`); return -a; }
    case "bin": {
      const a = await ev(n.a, c), b = await ev(n.b, c);
      if (n.op === "+") {
        if (typeof a === "string" && typeof b === "string") return a + b;
        if (typeof a === "number" && typeof b === "number") return a + b;
        if (typeof a === "string") throw new PyErr("TypeError", `can't convert '${pyType(b)}' object to str implicitly`);
        throw new PyErr("TypeError", `unsupported types for __add__: '${pyType(a)}', '${pyType(b)}'`);
      }
      if (typeof a !== "number" || typeof b !== "number") throw new PyErr("TypeError", `unsupported types for ${DUNDER[n.op]}: '${pyType(a)}', '${pyType(b)}'`);
      if ((n.op === "/" || n.op === "%") && b === 0) throw new PyErr("ZeroDivisionError", "division by zero");
      if (n.op === "-") return a - b;
      if (n.op === "*") return a * b;
      if (n.op === "/") return a / b;
      return ((a % b) + b) % b;
    }
    case "cmp": {
      const a = await ev(n.a, c), b = await ev(n.b, c);
      if (n.op === "==") return a === b || !!(a && b && a.img && a.img === b.img);
      if (n.op === "!=") return !(a === b);
      const comparable = (typeof a === "number" && typeof b === "number") || (typeof a === "string" && typeof b === "string");
      if (!comparable) throw new PyErr("TypeError", `unsupported types for ${DUNDER[n.op]}: '${pyType(a)}', '${pyType(b)}'`);
      return n.op === "<" ? a < b : n.op === ">" ? a > b : n.op === "<=" ? a <= b : a >= b;
    }
  }
  throw new PyErr("SyntaxError", "invalid syntax");
}
// env: board, sensors, speaker, serial(text), serialErr(text), input(prompt), mark(n), cond(n, v), pace, loopPace, onLoop, onVars
export async function runProgram(nodes, env, s) {
  const c = { vars: {}, env, s };
  const pace = env.pace === undefined ? 250 : env.pace;
  async function block(list) { for (const n of list) await stmt(n); }
  async function stmt(n) {
    env.mark(n.line);
    try {
      switch (n.kind) {
        case "pass": await s.sleep(pace / 3); break;
        case "while":
          for (;;) {
            const v = truthy(await ev(n.cond, c));
            env.cond(n.line, v);
            if (!v) { await s.sleep(pace); break; }
            await s.sleep(env.loopPace === undefined ? pace : env.loopPace);
            try { await block(n.kids); } catch (e) { if (e === BREAK) break; throw e; }
            if (env.onLoop) env.onLoop();
            env.mark(n.line);
          }
          break;
        case "for": {
          const it = await ev(n.iter, c);
          const vals = it && it.range ? it.range : typeof it === "string" ? [...it] : null;
          if (!vals) throw new PyErr("TypeError", `'${pyType(it)}' object isn't iterable`);
          for (const v of vals) {
            env.mark(n.line);
            c.vars[n.name] = v;
            if (env.onVars) env.onVars(c.vars, n.name);
            await s.sleep(env.loopPace === undefined ? pace : env.loopPace);
            try { await block(n.kids); } catch (e) { if (e === BREAK) break; throw e; }
            if (env.onLoop) env.onLoop();
          }
          if (env.onVars) env.onVars(c.vars, null);
          break;
        }
        case "if": {
          let ran = false;
          for (const br of n.branches) {
            env.mark(br.line);
            const v = truthy(await ev(br.cond, c));
            env.cond(br.line, v);
            await s.sleep(pace);
            if (v) { await block(br.kids); ran = true; break; }
          }
          if (!ran && n.elseKids) { env.mark(n.elseLine); await s.sleep(pace); await block(n.elseKids); }
          break;
        }
        case "assign":
          c.vars[n.name] = await ev(n.value, c);
          if (env.onVars) env.onVars(c.vars, n.name);
          await s.sleep(pace);
          break;
        case "expr": await ev(n.value, c); await s.sleep(pace / 2); break;
        case "break": await s.sleep(pace); throw BREAK;
      }
    } catch (e) {
      if (e instanceof PyErr && !e.line) e.line = n.line;
      throw e;
    }
  }
  await block(nodes);
}
function traceback(e, compileTime) {
  return compileTime
    ? `  File "main.py", line ${e.line}\n${e.type}: ${e.msg}`
    : `Traceback (most recent call last):\n  File "main.py", line ${e.line}, in <module>\n${e.type}: ${e.msg}`;
}
// Compile and run. Errors go to env.serialErr(text) and the failing line to env.mark(n).
// Returns "ok", "error" or "stopped".
export async function execute(lines, env, s) {
  let nodes;
  try { nodes = compile(lines); } catch (e) {
    if (!(e instanceof PyErr)) throw e;
    env.mark(e.line);
    env.serialErr(traceback(e, true));
    if (env.onError) env.onError(e);
    return "error";
  }
  try { await runProgram(nodes, env, s); env.mark(0); return "ok"; } catch (e) {
    if (e === CANCEL) return "stopped";
    if (!(e instanceof PyErr)) throw e;
    env.mark(e.line);
    env.serialErr(traceback(e, false));
    if (env.onError) env.onError(e);
    return "error";
  }
}
