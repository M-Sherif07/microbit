/* Check every React lab's content without a browser.

Usage (from this folder):
    npm run check

For each lab in src/labs/ it checks that:
  - every round can be finished: bug lines exist, answers are among the options, fixed code runs,
    flowcharts have a way out of every box
  - "How many times?" and "Will it ever stop?" answers match what the simulator actually does
  - each "Code it here" model solution passes its check, and the untouched starter code doesn't
  - every line of code shown has a hover tooltip
  - the error help in "Code it here" says the right thing for a set of broken programs
It prints the problems it finds and exits with an error if there are any.
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lib = f => import(pathToFileURL(path.join(ROOT, "src", "lib", f)).href);

// Programs run with no waiting: every sleep() finishes at once
const realTimeout = globalThis.setTimeout;
globalThis.setTimeout = (fn) => realTimeout(fn, 0);

const { execute, compile, MB_HEAD } = await lib("python.js");
const { runner } = await lib("microbit.js");
const { fcLayout } = await lib("flowchart.js");
const { explainPy, explainPs } = await lib("explain.js");
const { errorHelp } = await lib("errorHelp.js");

// A stand-in for the board and buttons; records what the program does like CodeLab.jsx
async function simulate(lines, { cap = Infinity, presses = true, answer = "7" } = {}) {
  const grid = Array(25).fill(0);
  const rec = { texts: [], images: [], prints: [], clears: 0, inputs: [], source: lines.join("\n") };
  const sensors = { a: false, b: false, aLatch: false, bLatch: false, light: 60, pin1: 800, temp: 21 };
  const pressed = { a: 0, b: 0 };
  const R = runner(), s = R.start();
  let steps = 0, loops = 0, capped = false;
  const env = {
    board: { clear: () => grid.fill(0), show() {}, showChar() {}, scroll: async () => {}, setPixel: (x, y, v) => { grid[y * 5 + x] = v; }, getPixel: (x, y) => grid[y * 5 + x] },
    sensors, speaker: { play() {} }, serial: t => rec.prints.push(t), serialErr: t => rec.prints.push("ERROR " + t),
    mark: () => {
      steps++;
      // Press A once after a while, and B every 20 steps, for programs that wait for buttons
      if (presses && /button_a/.test(rec.source) && steps === 30) { sensors.a = true; sensors.aLatch = true; pressed.a++; }
      if (presses && /button_b/.test(rec.source) && steps % 20 === 0) { sensors.bLatch = true; pressed.b++; }
      if (steps > 5000) R.stop();
    },
    cond() {}, pace: 0, loopPace: 0,
    onLoop: () => { if (++loops >= cap) { capped = true; R.stop(); } },
    onScroll: t => rec.texts.push(t), onShow: (v, img) => (img ? rec.images : rec.texts).push(v), onClear: () => rec.clears++,
    input: async () => { rec.inputs.push(answer); return answer; },
    onError: e => { error = e; }
  };
  let error = null;
  const result = await execute(lines, env, s);
  return { result, loops, capped, error, run: { ...rec, pressed, lit: grid.filter(Boolean).length } };
}

const problems = [];
const labs = fs.readdirSync(path.join(ROOT, "src", "labs")).filter(d => fs.existsSync(path.join(ROOT, "src", "labs", d, "content.js")));

for (const slug of labs) {
  const { activities, challenges } = await import(pathToFileURL(path.join(ROOT, "src", "labs", slug, "content.js")).href);
  const bad = msg => problems.push(`${slug} ${msg}`);
  let tipLines = 0;
  const tips = (lines, ps, where) => lines.forEach((l, i) => {
    if (!l || !l.trim() || /\{\{/.test(l)) return;
    tipLines++;
    if (!(ps ? explainPs : explainPy)(lines, i)) bad(`${where}: no tooltip for "${l.trim()}"`);
  });

  for (const [id, { kind, data }] of Object.entries(activities)) {
    for (const [i, rd] of data.entries()) {
      const at = `${id} round ${i + 1} (${kind})`;
      const shown = rd.lines && kind !== "BugHunt" ? MB_HEAD.concat(rd.lines) : rd.lines;
      if (shown) tips(shown, false, at);
      if (rd.ps) tips(rd.ps, true, at);
      if (rd.src) tips(rd.src, false, at);
      if (rd.code) tips(rd.code.split("\n"), false, at);
      if (rd.options) rd.options.forEach(o => tips(o, false, at));

      if (kind === "BugHunt" || kind === "PseudoBug") {
        const lines = rd.lines || rd.ps, bug = typeof rd.bug === "string" ? lines.indexOf(rd.bug) + 1 : rd.bug;
        if (bug < 1) bad(`${at}: the bug line isn't in the code`);
        if (new Set(rd.fixes).size !== rd.fixes.length) bad(`${at}: two fixes are the same`);
        if (kind === "BugHunt" && bug > 0) { const fixed = lines.slice(); fixed[bug - 1] = rd.fixes[0]; try { compile(fixed); } catch (e) { bad(`${at}: the fixed code has a ${e.type}`); } }
      }
      if (kind === "LinePick") for (const k of ["track", "check", "update"]) if (!(rd[k] >= 1 && rd[k] <= rd.lines.length && rd.lines[rd[k] - 1].trim())) bad(`${at}: the ${k} line (${rd[k]}) isn't a line of code`);
      if (["Predict", "PseudoTrace", "Quiz"].includes(kind) && !(rd.a >= 0 && rd.a < rd.opts.length)) bad(`${at}: the answer isn't one of the options`);
      if (kind === "CodeMatch" && !(rd.a >= 0 && rd.a < rd.options.length)) bad(`${at}: the answer isn't one of the options`);
      if (kind === "PseudoTranslate" && rd.py.length !== rd.ps.length) bad(`${at}: ps and py have different numbers of lines`);
      if (kind === "FlowTrace") {
        const L = fcLayout(rd.chart);
        for (const n of L.nodes) if (n.id !== "end" && !L.edges.some(e => e.from === n.id)) bad(`${at}: the flowchart box "${n.text}" has no way out`);
      }
      if (["HowMany", "StopOrNot", "Predict"].includes(kind)) {
        try { compile(MB_HEAD.concat(rd.lines)); } catch (e) { bad(`${at}: the program has a ${e.type} on line ${e.line}`); continue; }
      }
      if (kind === "HowMany") {
        const { loops } = await simulate(MB_HEAD.concat(rd.lines), { presses: false });
        if (loops !== rd.answer) bad(`${at}: the answer says ${rd.answer} times, the simulator ran it ${loops} times`);
      }
      if (kind === "StopOrNot") {
        const { loops, capped } = await simulate(MB_HEAD.concat(rd.lines), { cap: 25, presses: false });
        const got = capped ? 1 : loops === 0 ? 2 : 0, words = ["stops", "runs forever", "never runs"];
        if (got !== rd.a) bad(`${at}: the answer says it ${words[rd.a]}, in the simulator it ${words[got]}`);
      }
    }
  }

  for (const [key, list] of Object.entries(challenges || {})) for (const [i, c] of list.entries()) {
    const at = `challenge ${key}-${i} "${c.title}"`;
    tips(c.starter.split("\n"), false, at);
    tips(c.solution.split("\n"), false, at);
    if (!c.check) continue;
    const sol = await simulate(c.solution.split("\n"));
    const hint = sol.result === "ok" ? c.check(sol.run) : `it ended with "${sol.result}"`;
    if (hint) bad(`${at}: the model solution doesn't pass its own check: ${hint}`);
    const start = await simulate(c.starter.split("\n"));
    if (start.result === "ok" && !c.check(start.run)) bad(`${at}: the untouched starter code already passes`);
  }
  console.log(`${slug}: ${Object.keys(activities).length} activities, ${Object.values(challenges || {}).flat().length} challenges, ${tipLines} lines of code with tooltips`);
}

/* ---------- error help: broken programs and what the help must say ---------- */
const BROKEN = [
  [["for i in range(3)", "    print(i)"], "need a colon"],
  [["count = 0", "while count < 3", "    count = count + 1"], "need a colon"],
  [["x = 2", "if x > 1:", "print(x)"], "line 3 has to be indented"],
  [["x = 2", "if x > 1:"], "nothing under it is indented"],
  [["x = 2", "    print(x)"], "the line above it doesn't end with a colon"],
  [["x = 1", "if x > 0:", "    print(x)", "  print(x)"], "doesn't line up"],
  [["count = 0", "print(cout)"], "Did you mean <code>count</code>"],
  [["print(score)", "score = 5"], "only created on line 2"],
  [["x = true"], "<code>True</code>"],
  [["print(Hello)"], "put it in quotes"],
  [["n = 5", 'print("Score: " + n)'], "<code>str(n)</code> instead of <code>n</code>"],
  [['age = input("Age? ")', "if age > 18:", "    print(1)"], "<code>int(input(...))</code>"],
  [['n = int(input("N? "))'], "type digits only", "abc"],
  [['n = int(input("N? "))'], "<code>float()</code>", "2.5"],
  [["display.show(Image.HART)"], "<code>Image.HEART</code>"],
  [['dispaly.scroll("hi")'], "<code>display.scroll</code>"],
  [["for i in range(5 / 2):", "    print(i)"], "<code>//</code>"],
  [["for i in range(0, 10, 0):", "    print(i)"], "can't be 0"],
  [["display.set_pixel(5, 0, 9)"], "0 to 4"],
  [["display.set_pixel(2, 2)"], "three numbers"],
  [["x = 5 / 0"], "divides by zero"],
  [["x = 2", "If x > 1:", "    print(x)"], "case-sensitive"],
  [["x = 1", "else:", "    print(x)"], "straight after an <code>if</code>"],
  [["x = 2", "if x = 2:", "    print(x)"], "use <code>==</code>"],
  [['print("hi)'], "no closing quote"],
  [['print("hi"))'], "extra <code>)</code>"],
  [["whlie True:", "    pass"], "Did you mean <code>while</code>"],
  [["nums = [1, 2]"], "doesn't run lists yet"],
  [['print(len("hi"))'], "doesn't run <code>len()</code> yet"],
  [['name = "a"', "print(name.upper())"], "doesn't run <code>.upper()</code> yet"],
  [["count = 0", "count++"], "no <code>++</code>"],
  [["for i = 0 to 4:", "    print(i)"], "<code>for i in range(5):</code>"],
  [["n = 5", "n()"], "holds a number, not a function"],
  [["for i in 5:", "    print(i)"], "can't go through a single number"]
];
let helpOk = 0;
for (const [lines, want, answer] of BROKEN) {
  const { result, error } = await simulate(lines, { presses: false, answer });
  const where = `error help for ${JSON.stringify(lines.join(" ⏎ "))}`;
  if (result !== "error" || !error) { problems.push(`${where}: expected an error, the program ended with "${result}"`); continue; }
  const help = errorHelp(error, lines);
  if (!help.includes(want)) problems.push(`${where}: ${error.type} "${error.msg}" got "${help.replace(/<[^>]+>/g, "")}", expected it to mention "${want.replace(/<[^>]+>/g, "")}"`);
  else helpOk++;
}
console.log(`error help: ${helpOk} of ${BROKEN.length} broken programs get the right advice`);

// Plan It, Code It has no activities: check its model answers pass the lab's own checklists,
// and the model solution shows every test's expected result
const PCL = path.join(ROOT, "src", "labs", "plan-code-lab");
if (fs.existsSync(path.join(PCL, "scenarios.js"))) {
  const { SCENARIOS, STEPS } = await import(pathToFileURL(path.join(PCL, "scenarios.js")).href);
  const { pseudoChecks, flowChecks, runCode, splitInputs, norm } = await import(pathToFileURL(path.join(PCL, "logic.js")).href);
  let tests = 0;
  for (const sc of SCENARIOS) {
    const at = `plan-code-lab ${sc.id}`;
    for (const c of pseudoChecks(sc, sc.pseudo)) if (!c.ok) problems.push(`${at}: the model pseudocode fails "${c.msg}"`);
    for (const c of flowChecks(sc, sc.flow)) if (!c.ok) problems.push(`${at}: the model flowchart fails "${c.msg}"`);
    for (const [k] of STEPS) if (!(sc.hints[k] || []).length) problems.push(`${at}: no hints for the ${k} step`);
    for (const t of sc.tests) {
      tests++;
      const r = await runCode(sc.code, splitInputs(t.in)), got = r.outputs.join(" | ");
      if (r.error) problems.push(`${at} test "${t.in}": the model solution stops with ${r.error.split("\n").pop()}`);
      else if (norm(got) !== norm(t.exp)) problems.push(`${at} test "${t.in}": expected "${t.exp}", the model solution shows "${got}"`);
    }
  }
  console.log(`plan-code-lab: ${SCENARIOS.length} scenarios, ${tests} tests run against the model solutions`);
}

if (problems.length) { console.log(`\n${problems.length} problem${problems.length === 1 ? "" : "s"}:\n` + problems.map(p => "  - " + p).join("\n")); process.exit(1); }
console.log("All checks passed.");
