/* Plan It, Code It: everything that isn't drawing. Pseudocode and flowchart checklists, running
   a student's code against a list of inputs on the shared interpreter, and the hand-in text.
   No React here, so tools/check.mjs can import it. */
import { execute, PyErr } from "../../lib/python.js";
import { KINDS, STEPS } from "./scenarios.js";

/* ---------- checklists ---------- */
export function flowStats(list) {
  const s = { input: 0, output: 0, process: 0, decision: 0, loop: 0, brk: 0, inputInLoop: 0, loopCond: 0, empty: 0, emptyDecision: 0, noQuestion: 0, total: 0, brkOutside: 0 };
  (function walk(l, inLoop) {
    for (const n of l) {
      s.total++;
      if (!String(n.t || "").trim() && n.k !== "break") s.empty++;
      if (n.k === "input") { s.input++; if (inLoop) s.inputInLoop++; }
      else if (n.k === "output") s.output++;
      else if (n.k === "process") s.process++;
      else if (n.k === "break") { s.brk++; if (!inLoop) s.brkOutside++; }
      else if (n.k === "decision") {
        s.decision++;
        if (!(n.yes || []).length && !(n.no || []).length) s.emptyDecision++;
        if (String(n.t || "").trim() && !/\?\s*$/.test(n.t)) s.noQuestion++;
        walk(n.yes || [], inLoop); walk(n.no || [], inLoop);
      } else if (n.k === "loop") {
        s.loop++;
        if (!/forever|^\s*true\b/i.test(n.t || "")) s.loopCond++;
        walk(n.body || [], true);
      }
    }
  })(list, false);
  return s;
}
export function flowChecks(sc, list) {
  const s = flowStats(list);
  const out = sc.flowNeeds.map(([fn, msg]) => ({ ok: fn(s), msg }));
  out.push({ ok: s.empty === 0 && s.total > 0, msg: s.empty ? `Every shape has words in it (${s.empty} empty)` : "Every shape has words in it" });
  out.push({ ok: s.noQuestion === 0 && s.decision > 0, msg: "Decisions are written as Yes / No questions ending in ?" });
  if (s.emptyDecision) out.push({ ok: false, msg: "A decision has nothing on its Yes or No branch" });
  if (s.brkOutside) out.push({ ok: false, msg: "Stop repeating only works inside a loop" });
  return out;
}

const PS_KEYWORDS = ["INPUT", "DISPLAY", "SET", "IF", "ELSE", "END", "REPEAT", "FOR", "STOP", "WAIT", "OUTPUT"];
export function pseudoChecks(sc, text) {
  const lines = text.split("\n").filter(l => l.trim());
  if (lines.length < 3) return [{ ok: false, msg: "Write the plan one step per line (at least a few lines)" }];
  const out = [];
  const firsts = lines.map(l => l.trim().split(/\s+/)[0]);
  const lowerKw = firsts.filter(w => PS_KEYWORDS.includes(w.toUpperCase()) && w !== w.toUpperCase());
  out.push({ ok: !lowerKw.length, msg: lowerKw.length ? `KEYWORDS in capitals (found "${lowerKw[0]}")` : "KEYWORDS in capitals" });
  const nIf = lines.filter(l => /^\s*IF\b/i.test(l)).length, nEndIf = lines.filter(l => /^\s*END\s*IF\b/i.test(l)).length;
  out.push({ ok: nIf === nEndIf, msg: `Every IF has an END IF (${nIf} IF, ${nEndIf} END IF)` });
  const nLoop = lines.filter(l => /^\s*(REPEAT|FOR)\b/i.test(l)).length, nEndLoop = lines.filter(l => /^\s*END\s*(REPEAT|FOR)\b/i.test(l)).length;
  if (nLoop || nEndLoop) out.push({ ok: nLoop === nEndLoop, msg: `Every REPEAT / FOR has an END REPEAT / END FOR (${nLoop} open, ${nEndLoop} close)` });
  const py = lines.find(l => /:\s*$|display\.|int\(|input\(|print\(|==|^\s*elif\b|^\s*while\b/i.test(l));
  out.push({ ok: !py, msg: py ? `Plain English, not Python (check "${py.trim()}")` : "Plain English, not Python (no colons, brackets or display.scroll)" });
  let indentOk = true;
  for (let k = 0; k < lines.length - 1; k++) {
    const opener = /^\s*(IF\b.*|ELSE.*|REPEAT.*|FOR\b.*)$/i.test(lines[k]) && !/^\s*END\b/i.test(lines[k]);
    if (!opener) continue;
    const next = lines[k + 1];
    if (/^\s*(END|ELSE)\b/i.test(next)) continue;
    if (next.match(/^\s*/)[0].length <= lines[k].match(/^\s*/)[0].length) { indentOk = false; break; }
  }
  out.push({ ok: indentOk, msg: "Steps inside IF, ELSE and REPEAT are indented" });
  for (const [re, msg] of sc.pseudoNeeds) out.push({ ok: re.test(text), msg });
  return out;
}

/* ---------- running code ---------- */
// The interpreter's own errors get the shared error help; these two are specific to tests.
export const TEST_HELP = {
  EOFError: "The program asked for more input than this test gives. Check how many times your loop calls <code>input()</code>.",
  Timeout: "The program never finished. Check that every loop has a way to stop: a <code>break</code>, or a condition that becomes False."
};
const MAX_STEPS = 20000;

// Run code with a list of typed inputs, as fast as possible.
// Returns { outputs: what the micro:bit showed, error: the traceback or null, err: the PyErr }
export async function runCode(code, inputs) {
  const outputs = [], queue = inputs.slice();
  let steps = 0, traceback = null, err = null;
  const env = {
    board: { scroll: async () => {}, show() {}, showChar() {}, clear() {}, setPixel() {}, getPixel: () => 0 },
    sensors: { a: false, b: false, aLatch: false, bLatch: false, light: 120, pin1: 0, temp: 21 },
    speaker: { play() {} },
    pace: 0, loopPace: 0, mark() {}, cond() {},
    onScroll: t => outputs.push(t),
    onShow: (v, img) => outputs.push(img ? "Image." + v : String(v)),
    serial: t => outputs.push(t),
    serialErr: t => { traceback = t; },
    onError: e => { err = e; },
    input: () => { if (!queue.length) throw new PyErr("EOFError", "EOF when reading a line"); return queue.shift(); }
  };
  const s = { sleep: async () => { if (++steps > MAX_STEPS) throw new PyErr("Timeout", "the program ran 20,000 steps without finishing"); }, get live() { return true; } };
  await execute(code.split("\n"), env, s);
  return { outputs, error: traceback, err };
}

/* ---------- tests and progress ---------- */
export const splitInputs = s => String(s || "").split(",").map(x => x.trim()).filter(x => x !== "");
export const norm = s => String(s || "").split("|").map(x => x.trim().toLowerCase().replace(/\s+/g, " ")).filter(Boolean).join(" | ");

export function blankWork(sc) {
  return { ipo: { in: "", proc: "", out: "" }, pseudo: "", flow: [], code: "from microbit import *\n\n", runIn: sc.runIn, exp: {}, extra: [], results: null, reflect: "", reveal: {}, hints: {}, codeRan: false, runId: 0 };
}
export function testRows(sc, s) {
  return sc.tests.map((t, i) => ({ in: t.in, exp: t.given ? t.exp : (s.exp[i] || ""), given: !!t.given, why: t.why, idx: i }))
    .concat(s.extra.map((t, j) => ({ in: t.in, exp: t.exp, mine: true, why: "Your own test", j })));
}
export const rowPass = (row, res) => !!(res && !res.error && row.exp.trim() && norm(res.actual) === norm(row.exp));

export function stepDone(sc, s) {
  const rows = testRows(sc, s);
  return {
    understand: ["in", "proc", "out"].every(k => s.ipo[k].trim().length >= 3),
    pseudo: pseudoChecks(sc, s.pseudo).every(c => c.ok),
    flow: s.flow.length > 0 && flowChecks(sc, s.flow).every(c => c.ok),
    code: s.codeRan,
    test: !!(s.results && s.results.length === rows.length && rows.every((r, i) => rowPass(r, s.results[i]) && !s.results[i].mismatch) && s.reflect.trim().length > 10)
  };
}

/* ---------- hand-in text ---------- */
export function flowText(list, ind = "") {
  return list.map(n => {
    const k = KINDS.find(x => x[0] === n.k);
    let s = `${ind}[${k ? k[1].replace(/ [▱▭◇↻]$/, "") : n.k}] ${n.t || ""}\n`;
    if (n.k === "decision") s += `${ind}  Yes:\n${flowText(n.yes || [], ind + "    ")}${ind}  No:\n${flowText(n.no || [], ind + "    ")}`;
    if (n.k === "loop") s += `${ind}  Repeat:\n${flowText(n.body || [], ind + "    ")}`;
    return s;
  }).join("");
}
const hintsUsed = (sc, s) => STEPS.map(([k, n]) => `${n} ${s.hints[k] || 0}/${sc.hints[k].length}`).join(", ");
export function workText(sc, s, name) {
  const rows = testRows(sc, s), d = stepDone(sc, s);
  const res = s.results && s.results.length === rows.length ? s.results : null;
  const rule = "-".repeat(48);
  let t = `ICTPRG302 Plan It, Code It: ${sc.title}\nStudent: ${name || "(no name)"}\nDate: ${new Date().toLocaleDateString("en-AU")}\nSteps done: ${Object.values(d).filter(Boolean).length} of 5\nHints used: ${hintsUsed(sc, s)}\n\n`;
  t += `1. UNDERSTAND\n${rule}\nInputs: ${s.ipo.in}\nProcessing: ${s.ipo.proc}\nOutputs: ${s.ipo.out}\n\n`;
  t += `2. PSEUDOCODE\n${rule}\n${s.pseudo}\n\n`;
  t += `3. FLOWCHART (shapes in order)\n${rule}\n[Start]\n${flowText(s.flow)}[End]\n\n`;
  t += `4. PYTHON\n${rule}\n${s.code}\n\n`;
  t += `5. TESTS\n${rule}\n`;
  rows.forEach((r, k) => {
    const x = res && res[k];
    t += `${k + 1}. Inputs: ${r.in} | Expected: ${r.exp || "-"} | Actual: ${x ? (x.error ? "error" : x.actual) : "not run"} | ${x ? (rowPass(r, x) ? "PASS" : "FAIL") : ""}\n`;
  });
  return t + `\nWhat my tests found:\n${s.reflect}\n`;
}
