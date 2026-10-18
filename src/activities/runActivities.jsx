/* Activities that run a Python program on the simulated micro:bit:
   HowMany (type a count), StopOrNot (stops / forever / never) and Predict (pick the output). */
import { useMemo, useRef, useState } from "react";
import Board from "../components/Board.jsx";
import { CodeBox, Feedback, NextButton, OptionRow, Panel, RoundPills, Serial, Vars, shuffle, useOnHide, useRounds, useRunner, useSerial } from "../components/ui.jsx";
import { esc } from "../lib/highlight.js";
import { MB_HEAD, execute, pyRepr } from "../lib/python.js";
import { CANCEL } from "../lib/microbit.js";

// Shared by all three: the code with its current line and True/False tags, the board and the serial pane.
function useProgram() {
  const R = useRunner();
  const board = useRef(null);
  const serial = useSerial();
  const [cur, setCur] = useState(0);
  const [conds, setConds] = useState({});
  const busy = useRef(false);
  function reset() {
    R.stop(); busy.current = false;
    serial.clear(); setCur(0); setConds({});
    board.current && board.current.clear();
  }
  function env(extra) {
    return {
      board: board.current, speaker: { play() {} }, sensors: {},
      serial: serial.write, serialErr: serial.writeErr,
      mark: setCur, cond: (n, v) => setConds(c => ({ ...c, [n]: v })),
      ...extra
    };
  }
  return { R, board, serial, cur, conds, setConds, busy, reset, env };
}

const times = n => `${n} time${n === 1 ? "" : "s"}`;

/* ---------- How many times? ---------- */
export function HowMany({ act, data, onDone, visible }) {
  const P = useProgram();
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const [guess, setGuess] = useState("");
  const [locked, setLocked] = useState(false);
  const [loops, setLoops] = useState(0);
  const [fb, setFb] = useState(null);
  const input = useRef(null);
  const rd = data[r];

  function load(k) {
    P.reset(); setR(k);
    setLoops(0); setGuess(""); setLocked(false); setFb(null);
  }
  useOnHide(visible, () => { if (P.busy.current) load(r); });

  async function run() {
    if (guess === "") { setFb({ kind: "bad", html: "Type how many times you think the loop body runs." }); input.current.focus(); return; }
    P.reset(); P.busy.current = true; setLocked(true);
    let n = 0;
    setLoops(0);
    const s = P.R.start();
    setFb({ kind: "info", html: "Running… watch the loop counter." });
    const res = await execute(MB_HEAD.concat(rd.lines), P.env({ pace: 90, loopPace: 60, onLoop: () => setLoops(++n) }), s);
    P.busy.current = false;
    if (res === "stopped") return;
    const right = +guess === rd.answer;
    setFb({ kind: right ? "ok" : "bad", html: (right ? `<strong>Correct, ${times(rd.answer)}.</strong> ` : `<strong>It ran ${times(rd.answer)}.</strong> You said ${esc(guess)}. `) + rd.why });
    solve(r);
  }

  const gid = act.id + "-guess";
  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={r} solved={solved} onPick={load} />
    <div className="split">
      <CodeBox lines={MB_HEAD.concat(rd.lines)} cur={P.cur} conds={P.conds} />
      <div className="side">
        <Board ref={P.board} />
        <Panel className="stat"><span>Times round the loop</span><strong>{loops}</strong></Panel>
        <Panel title="Serial"><Serial lines={P.serial.lines} /></Panel>
      </div>
    </div>
    <div className="guess-row">
      <label htmlFor={gid}>The body runs</label>
      <input type="number" id={gid} ref={input} min="0" max="100" placeholder="?" value={guess} disabled={locked}
        onChange={e => setGuess(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !locked) run(); }} />
      <span>times</span>
      <button className="btn primary" type="button" disabled={locked} onClick={run}>Lock in &amp; run</button>
      <NextButton show={!last} label={act.nextLabel} onClick={() => load(r + 1)} />
    </div>
    <Feedback fb={fb} />
  </>;
}

/* ---------- Will it ever stop? ---------- */
const STOP_OPTS = ["It stops", "It runs forever", "It never runs"], CAP = 25;

export function StopOrNot({ act, data, onDone, visible }) {
  const P = useProgram();
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const [loops, setLoops] = useState(0);
  const [marks, setMarks] = useState(null); // null: not answered yet; {}: running; then { index: "right" | "wrong" }
  const [fb, setFb] = useState(null);
  const rd = data[r];

  function load(k) { P.reset(); setR(k); setLoops(0); setMarks(null); setFb(null); }
  useOnHide(visible, () => { if (P.busy.current) load(r); });

  async function choose(i) {
    if (P.busy.current) return;
    P.busy.current = true;
    setMarks({});
    const s = P.R.start();
    let n = 0, capped = false;
    P.serial.clear(); P.setConds({});
    setFb({ kind: "info", html: "Running…" });
    const res = await execute(MB_HEAD.concat(rd.lines), P.env({
      pace: 70, loopPace: 50,
      onLoop: () => { setLoops(++n); if (n >= CAP) { capped = true; P.R.stop(); } }
    }), s);
    P.busy.current = false;
    if (res === "stopped" && !capped) return; // left the tab or changed program
    if (capped) P.serial.writeErr(`Still going after ${CAP} times round. The simulator stopped it.`);
    const right = i === rd.a;
    setMarks(right ? { [i]: "right" } : { [rd.a]: "right", [i]: "wrong" });
    setFb({ kind: right ? "ok" : "bad", html: (right ? "<strong>Correct.</strong> " : `<strong>${STOP_OPTS[rd.a]}.</strong> `) + rd.why });
    solve(r);
  }

  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={r} solved={solved} onPick={load} />
    <div className="split">
      <CodeBox lines={MB_HEAD.concat(rd.lines)} cur={P.cur} conds={P.conds} />
      <div className="side">
        <Board ref={P.board} />
        <Panel className="stat"><span>Times round the loop</span><strong>{loops}</strong></Panel>
        <Panel title="Serial"><Serial lines={P.serial.lines} /></Panel>
      </div>
    </div>
    <p className="panel-title">This loop…</p>
    <OptionRow opts={STOP_OPTS} marks={marks || {}} disabled={marks !== null} onPick={choose} />
    <div className="controls"><NextButton show={!last} label={act.nextLabel} onClick={() => load(r + 1)} /></div>
    <Feedback fb={fb} />
  </>;
}

/* ---------- Predict the output ---------- */
// The run after an answer can be watched at full speed, or stepped through one line at a time,
// with a trace table that records each variable change and each print.
export function Predict({ act, data, onDone, visible }) {
  const P = useProgram();
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const [vars, setVars] = useState({ vars: {}, changed: null, tick: 0 });
  const [marks, setMarks] = useState(null);
  const [fb, setFb] = useState(null);
  const [rows, setRows] = useState([]);
  const [stepping, setStepping] = useState(false); // true while a step-by-step run waits for "Next step"
  const [loadKey, setLoadKey] = useState(0);
  const before = useRef({}), line = useRef(0), waiter = useRef(null);
  const rd = data[r];
  const lines = MB_HEAD.concat(rd.lines);
  // Options are shuffled each time a round loads, so the answer isn't always in the same place
  const order = useMemo(() => shuffle(rd.opts.map((_, i) => i)), [r, loadKey]);

  // Every variable change goes in the serial pane as a grey # note, with the sum worked out,
  // so each step can be followed. Only print() writes real output.
  function noteStep(v, changed) {
    if (!changed) return;
    const was = before.current, now = v[changed];
    before.current = { ...v };
    const src = (lines[line.current - 1] || "").trim();
    const val = t => (/^-?\d+$/.test(t) ? t : pyRepr(was[t]));
    let m;
    if (src.startsWith("for ")) P.serial.writeNote(`# ${changed} = ${pyRepr(now)} (from the range)`);
    else if ((m = src.match(/^(\w+) = \1 ([-+*/%]) (\w+)$/)) || (m = src.match(/^(\w+) ([-+*/%])= (\w+)$/)))
      P.serial.writeNote(`# ${changed} = ${pyRepr(was[changed])} ${m[2]} ${val(m[3])} = ${pyRepr(now)}`);
    else P.serial.writeNote(`# ${changed} = ${pyRepr(now)}`);
    setRows(x => [...x, { line: line.current, name: changed, value: pyRepr(now) }]);
  }

  function endStepping() {
    if (waiter.current) { waiter.current.rej(CANCEL); waiter.current = null; }
    setStepping(false);
  }
  function load(k) { endStepping(); P.reset(); setR(k); setLoadKey(x => x + 1); setVars({ vars: {}, changed: null, tick: 0 }); setRows([]); setMarks(null); setFb(null); }
  useOnHide(visible, () => { if (P.busy.current) load(r); });

  // Runs the round's program. In step mode each new line waits for the Next step button.
  async function run(step) {
    P.busy.current = true;
    const base = P.R.start();
    let paused = -1;
    const s = !step ? base : {
      get live() { return base.live; },
      sleep(ms) {
        if (line.current === paused || line.current <= MB_HEAD.length) return base.sleep(Math.min(ms, 40));
        paused = line.current;
        return new Promise((res, rej) => { waiter.current = { res, rej }; });
      }
    };
    P.serial.clear(); P.setConds({}); before.current = {}; setRows([]);
    setVars({ vars: {}, changed: null, tick: 0 });
    P.board.current && P.board.current.clear();
    setStepping(step);
    const env = P.env({
      pace: 160, loopPace: 120,
      onVars: (v, changed) => { noteStep(v, changed); setVars(p => ({ vars: { ...v }, changed, tick: p.tick + 1 })); }
    });
    const mark = env.mark, write = env.serial;
    env.mark = n => { line.current = n; mark(n); };
    env.serial = t => { write(t); setRows(x => [...x, { line: line.current, out: t }]); };
    const res = await execute(lines, env, s);
    waiter.current = null; setStepping(false);
    P.busy.current = false;
    return res;
  }

  async function choose(i) {
    if (P.busy.current) return;
    setMarks({});
    setFb({ kind: "info", html: "Running…" });
    if ((await run(false)) === "stopped") return;
    const right = i === rd.a;
    setMarks(right ? { [i]: "right" } : { [rd.a]: "right", [i]: "wrong" });
    setFb({ kind: right ? "ok" : "bad", html: (right ? "<strong>Correct.</strong> " : `<strong>It was "${esc(rd.opts[rd.a])}".</strong> `) + rd.why + " Press <strong>Step through</strong> to run it again one line at a time." });
    solve(r);
  }
  function nextStep() { const w = waiter.current; waiter.current = null; if (w) w.res(); }
  async function stepThrough() { if (!P.busy.current) await run(true); }

  const answered = marks !== null && Object.keys(marks).length > 0;
  const names = [...new Set(rows.filter(x => x.name).map(x => x.name))];
  const hasOut = rows.some(x => x.out !== undefined);
  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={r} solved={solved} onPick={load} />
    <div className="split">
      <div className="side">
        <CodeBox lines={lines} cur={P.cur} conds={P.conds} />
        <div>
          <p className="panel-title">{rd.q || "What is printed?"}</p>
          <OptionRow opts={order.map(i => rd.opts[i])} marks={Object.fromEntries(order.map((i, j) => [j, (marks || {})[i]]).filter(([, v]) => v))}
            disabled={marks !== null} onPick={j => choose(order[j])} />
        </div>
        <div className="controls">
          {answered && !stepping && <button className="btn" type="button" onClick={stepThrough}>Step through ▸</button>}
          {stepping && <button className="btn primary" type="button" onClick={nextStep}>Next step ▸</button>}
          {stepping && <button className="btn" type="button" onClick={() => { endStepping(); P.R.stop(); }}>Stop</button>}
          <NextButton show={!last} label={act.nextLabel} onClick={() => load(r + 1)} />
        </div>
      </div>
      <div className="side">
        <Board ref={P.board} />
        <Panel title="Variables"><Vars {...vars} /></Panel>
        <Panel title="Serial"><Serial lines={P.serial.lines} /></Panel>
      </div>
    </div>
    {rows.length > 0 && <Panel title="Trace table">
      <div className="trace-wrap trace-scroll">
        <table className="trace">
          <thead><tr><th>Line</th>{names.map(n => <th key={n}>{n}</th>)}{hasOut && <th>Output</th>}</tr></thead>
          <tbody>
            {rows.map((x, i) => (
              <tr key={i} className={i === rows.length - 1 ? "new" : ""}>
                <td>{x.line}</td>
                {names.map(n => <td key={n}>{x.name === n ? x.value : ""}</td>)}
                {hasOut && <td className="out">{x.out === undefined ? "" : x.out}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>}
    <Feedback fb={fb} />
  </>;
}
