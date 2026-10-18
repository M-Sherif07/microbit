/* Activities answered by choosing: Quiz, CodeMatch (pick the matching code) and RangeExplorer. */
import { useEffect, useMemo, useRef, useState } from "react";
import { CodeBox, Feedback, NextButton, Panel, RoundPills, cx, shuffle, useOnHide, useRounds, useRunner } from "../components/ui.jsx";
import Board from "../components/Board.jsx";
import { esc } from "../lib/highlight.js";
import { CodeBlock } from "../components/Tooltip.jsx";
import { MB_HEAD, execute } from "../lib/python.js";

/* ---------- Quiz: answer every card correctly ---------- */
export function Quiz({ data, onDone }) {
  const [state, setState] = useState(() => data.map(() => ({ wrong: new Set(), right: false })));
  const right = state.filter(q => q.right).length;
  useEffect(() => { if (right === data.length) onDone(); }, [right, data.length, onDone]);

  function answer(k, j) {
    setState(s => s.map((q, i) => {
      if (i !== k || q.right) return q;
      return j === data[k].a ? { wrong: new Set(), right: true } : { wrong: new Set([j]), right: false };
    }));
  }
  return (
    <div className="quiz">
      {data.map((q, k) => {
        const st = state[k];
        return (
          <div className="q" key={k}>
            <p><strong>{q.ask}</strong></p>
            {q.code && <CodeBlock code={q.code} />}
            <div className="q-opts">
              {q.opts.map((o, j) => (
                <button key={j} type="button" className={cx("btn", st.right && j === q.a && "right", st.wrong.has(j) && "wrong")}
                  disabled={st.right && j !== q.a} onClick={() => answer(k, j)}>{o}</button>
              ))}
            </div>
            <p className="why" aria-live="polite">{st.right ? q.why : st.wrong.size ? "Try another one." : ""}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Convert it: pick the code that does the same thing ---------- */
export function CodeMatch({ act, data, onDone }) {
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const [marks, setMarks] = useState({});
  const [fb, setFb] = useState(null);
  const [loadKey, setLoadKey] = useState(0);
  const rd = data[r];
  const order = useMemo(() => shuffle(rd.options.map((_, i) => i)), [r, loadKey]);
  const done = Object.values(marks).includes("right");

  function load(k) { setR(k); setLoadKey(x => x + 1); setMarks({}); setFb(null); }
  function pick(i) {
    if (i === rd.a) {
      setMarks(m => ({ ...m, [i]: "right" }));
      setFb({ kind: "ok", html: "<strong>Correct.</strong> " + rd.why });
      solve(r);
    } else {
      setMarks(m => ({ ...m, [i]: "wrong" }));
      setFb({ kind: "bad", html: "<strong>Not that one.</strong> " + ((rd.hints && rd.hints[i]) || "List the numbers each loop goes through and compare them.") });
    }
  }

  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={r} solved={solved} onPick={load} />
    <div className="split fc-split">
      <CodeBox note="the while loop" lines={rd.src} />
      <div className="code-opts">
        {order.map((i, n) => (
          <button key={`${loadKey}-${i}`} type="button" className={cx("code-opt", marks[i])} disabled={done && marks[i] !== "right"} onClick={() => pick(i)}>
            <span className="code-opt-tag">Option {"ABC"[n]}</span>
            <CodeBlock code={rd.options[i]} keyboard={false} />
          </button>
        ))}
      </div>
    </div>
    <div className="controls"><NextButton show={!last} label={act.nextLabel} onClick={() => load(r + 1)} /></div>
    <Feedback fb={fb} />
  </>;
}

/* ---------- Range explorer: set start, stop and step to hit each target, one target at a time ---------- */
const rangeCall = (s, e, st) => (st === 1 ? (s === 0 ? `range(${e})` : `range(${s}, ${e})`) : `range(${s}, ${e}, ${st})`);

export function RangeExplorer({ act, data, onDone, visible }) {
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const R = useRunner(), board = useRef(null);
  const [cur, setCur] = useState(0);
  const [running, setRunning] = useState(false);
  const [vals, setVals] = useState({ start: "0", stop: "5", step: "1" });
  const [fb, setFb] = useState(null);
  const rd = data[r];
  const s = parseInt(vals.start, 10), e = parseInt(vals.stop, 10), st = parseInt(vals.step, 10);
  // range() only takes whole numbers: 1.5 is a TypeError in Python, not 1
  const texts = [vals.start, vals.stop, vals.step];
  const valid = texts.every(t => /^\s*-?\d+\s*$/.test(t));
  const decimal = !valid && texts.every(t => t.trim() !== "" && Number.isFinite(Number(t)));
  const nums = useMemo(() => {
    if (!valid || st === 0) return null;
    const out = [];
    for (let v = s; st > 0 ? v < e : v > e; v += st) { out.push(v); if (out.length > 40) break; }
    return out;
  }, [valid, s, e, st]);
  const lastCode = useRef(MB_HEAD.concat(["for n in range(5):", "    display.scroll(n)"]));
  if (valid) lastCode.current = MB_HEAD.concat([`for n in ${rangeCall(s, e, st)}:`, "    display.scroll(n)"]);

  // Check the current target whenever the numbers change or a new target is picked
  // (call is a dependency too: some targets can be hit with more than one stop, and the message should name the current one)
  const hit = !!nums && rd.vals.length === nums.length && rd.vals.every((v, j) => v === nums[j]);
  const call = valid ? rangeCall(s, e, st) : "";
  useEffect(() => {
    if (!hit) return;
    solve(r);
    setFb({ kind: "ok", html: `<strong>Target hit:</strong> ${esc(rd.label)} with <code>${call}</code>. ${esc(rd.why)}` });
  }, [hit, r, call]);
  const firstOpen = data.findIndex((_, i) => !solved.has(i));

  function stop() { R.stop(); setRunning(false); setCur(0); }
  function load(k) { stop(); setR(k); setFb(null); }
  useOnHide(visible, stop);

  // Run the for loop shown in the code box: each number scrolls across the micro:bit
  async function run() {
    R.stop();
    const s = R.start();
    setRunning(true);
    board.current && board.current.clear();
    const env = { board: board.current, speaker: { play() {} }, sensors: {}, serial() {}, serialErr() {}, mark: setCur, cond() {}, pace: 150, loopPace: 150, scrollDelay: 70 };
    const res = await execute(lastCode.current, env, s);
    if (res !== "stopped") { setRunning(false); setCur(0); }
  }

  const field = name => (
    <label htmlFor={`${act.id}-${name}`}>{name}
      <input type="number" id={`${act.id}-${name}`} value={vals[name]} onChange={ev => { stop(); setVals(v => ({ ...v, [name]: ev.target.value })); }} />
    </label>
  );
  let chips;
  if (decimal) chips = <span className="err-text">TypeError: 'float' object cannot be interpreted as an integer. range() only takes whole numbers.</span>;
  else if (!valid) chips = <span className="empty">Type whole numbers in all three boxes.</span>;
  else if (st === 0) chips = <span className="err-text">ValueError: zero step for range(). The step can't be 0.</span>;
  else if (!nums.length) chips = <span className="empty">No numbers at all: the loop body would never run. Check the direction of the step.</span>;
  else chips = <>
    {nums.slice(0, 40).map((v, i) => <span key={i} className="chip">{v}</span>)}
    {nums.length > 40 && <span className="empty">…</span>}
    <span className="chip-count">{nums.length > 40 ? "40+" : nums.length} number{nums.length === 1 ? "" : "s"}</span>
  </>;

  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={r} solved={solved} onPick={load} />
    <div className="range-row">{field("start")}{field("stop")}{field("step")}</div>
    <div className="split">
      <div className="side">
        <CodeBox lines={lastCode.current} cur={cur} />
        <Panel title="The numbers range() gives"><div className="chips">{chips}</div></Panel>
      </div>
      <div className="side">
        <Panel title={`Target ${r + 1} of ${data.length}`}>
          <ul className="goals"><li className={solved.has(r) ? "met" : ""}>{rd.label}</li></ul>
        </Panel>
        <Board ref={board} />
      </div>
    </div>
    <div className="controls">
      <button className="btn primary" type="button" disabled={running || !nums || !nums.length} onClick={run}>▶ Run</button>
      <button className="btn" type="button" disabled={!running} onClick={stop}>■ Stop</button>
      <NextButton show={solved.has(r) && !last} label={act.nextLabel} onClick={() => load(r + 1)} />
      {/* Targets skipped with the pills: from the last one, point back to the first still to do */}
      <NextButton show={solved.has(r) && last && firstOpen > -1} label={`${data.length - solved.size} left: go to target ${firstOpen + 1} →`} onClick={() => load(firstOpen)} />
    </div>
    <Feedback fb={fb} />
  </>;
}
