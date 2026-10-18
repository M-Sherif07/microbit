/* Flowcharts and pseudocode plans: FlowTrace, PseudoTrace (dry run), PseudoTranslate and PseudoCloze. */
import { useMemo, useRef, useState } from "react";
import Board from "../components/Board.jsx";
import Flowchart, { FlowLegend } from "../components/Flowchart.jsx";
import { CodeBox, Feedback, NextButton, OptionRow, Panel, RoundPills, cx, shuffle, useOnHide, useRounds, useRunner } from "../components/ui.jsx";
import { esc, psHl, PS_NONE } from "../lib/highlight.js";
import { fcLayout } from "../lib/flowchart.js";
import { ignoreCancel } from "../lib/microbit.js";
import { CODE_HINT, useCodeLines, useTip } from "../components/Tooltip.jsx";

/* ---------- Follow the flowchart: answer Yes / No at each diamond ---------- */
export function FlowTrace({ act, data, onDone, visible }) {
  const R = useRunner();
  const board = useRef(null);
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const rd = data[r];
  const L = useMemo(() => fcLayout(rd.chart), [rd]);
  const [active, setActive] = useState(null);
  const [edge, setEdge] = useState(null);
  const [question, setQuestion] = useState("Press Start to begin at the Start symbol.");
  const [asking, setAsking] = useState(false);
  const [running, setRunning] = useState(false);
  const [fb, setFb] = useState(null);
  const answer = useRef(null);
  const runningRef = useRef(false);

  function load(k) {
    R.stop(); setR(k); answer.current = null; runningRef.current = false;
    setActive(null); setEdge(null); setAsking(false); setRunning(false); setFb(null);
    setQuestion("Press Start to begin at the Start symbol.");
    board.current.clear();
  }
  useOnHide(visible, () => { if (runningRef.current) load(r); });

  const ask = () => new Promise(res => { answer.current = res; setAsking(true); });
  function reply(v) {
    if (!answer.current) return;
    const a = answer.current;
    answer.current = null; setAsking(false); a(v);
  }

  async function start() {
    R.stop(); board.current.clear(); setFb(null);
    const s = R.start(), visits = rd.visits || [];
    const node = id => L.nodes.find(n => n.id === id), out = id => L.edges.filter(e => e.from === id);
    setRunning(true); runningRef.current = true;
    let cur = node("start"), vi = 0, passes = 0;
    try {
      for (;;) {
        setActive(cur.id);
        if (cur.type === "dec") {
          if (vi >= visits.length) { setQuestion("…and the loop carries on like this for ever."); break; }
          const v = visits[vi];
          setQuestion(v.q);
          let got;
          for (;;) {
            got = await ask();
            if (!s.live) return;
            if (got === v.a) break;
            setFb({ kind: "bad", html: `<strong>Not that way.</strong> ${esc(v.hint || "Check the value against the condition again.")}` });
          }
          setFb(null);
          vi++;
          const e = out(cur.id).find(x => (x.label || "").split(" ")[0] === (got ? "Yes" : "No"));
          setEdge(e); await s.sleep(450);
          if (e.loop) passes++;
          cur = node(e.to);
          continue;
        }
        if (cur.id === "end") { setQuestion("You reached End."); break; }
        setQuestion(cur.type === "term" ? "Starting…" : cur.type === "join" ? "The paths join up here." : cur.text.replace(/\n/g, " "));
        const o = cur.out;
        if (o && o.scroll) await board.current.scroll(o.scroll, s);
        else if (o && o.img) { board.current.show(o.img); await s.sleep(700); }
        else if (o && o.clear) { board.current.clear(); await s.sleep(500); }
        else await s.sleep(cur.type === "join" ? 300 : 650);
        const e = out(cur.id)[0];
        setEdge(e); await s.sleep(400);
        if (e.loop) {
          passes++;
          if (rd.loops && passes >= rd.loops) { setActive(e.to); setQuestion("…and round it goes again, for ever."); break; }
        }
        cur = node(e.to);
      }
      setEdge(null);
      setFb({ kind: "ok", html: "<strong>Traced.</strong> " + rd.why });
      solve(r);
      setRunning(false); runningRef.current = false;
    } catch (e) { ignoreCancel(e); }
  }

  return <>
    <FlowLegend />
    <RoundPills label={act.roundLabel} count={data.length} cur={r} solved={solved} onPick={load} />
    <div className="split fc-split">
      <div className="fcbox"><Flowchart layout={L} label={"Flowchart: " + rd.situation} active={active} activeEdge={edge} /></div>
      <div className="side">
        <Panel title="Situation"><p>{rd.situation}</p></Panel>
        <Board ref={board} />
        <Panel title="Now">
          <p>{question}</p>
          <div className="controls">
            <button className="btn primary" type="button" disabled={!asking} onClick={() => reply(true)}>Yes</button>
            <button className="btn" type="button" disabled={!asking} onClick={() => reply(false)}>No</button>
          </div>
        </Panel>
      </div>
    </div>
    <div className="controls">
      <button className="btn primary" type="button" disabled={running} onClick={start}>▶ Start</button>
      <NextButton show={!last} label={act.nextLabel} onClick={() => load(r + 1)} />
    </div>
    <Feedback fb={fb} />
  </>;
}

/* ---------- Dry run the plan: predict, then watch the trace table fill ---------- */
export function PseudoTrace({ act, data, onDone, visible }) {
  const R = useRunner();
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const rd = data[r];
  const [rows, setRows] = useState([]);
  const [cur, setCur] = useState(0);
  const [marks, setMarks] = useState(null);
  const [fb, setFb] = useState({ kind: "info", html: "Make your prediction first. Then the dry run fills in the trace table one line at a time." });
  const busy = useRef(false);

  const cols = useMemo(() => {
    const vars = [];
    rd.steps.forEach(st => Object.keys(st.vars || {}).forEach(v => { if (!vars.includes(v)) vars.push(v); }));
    return { vars, hasCheck: rd.steps.some(st => st.check), hasOut: rd.steps.some(st => st.out !== undefined) };
  }, [rd]);

  function load(k) {
    R.stop(); busy.current = false; setR(k);
    setRows([]); setCur(0); setMarks(null);
    setFb({ kind: "info", html: "Make your prediction first. Then the dry run fills in the trace table one line at a time." });
  }
  useOnHide(visible, () => { if (busy.current) load(r); });

  async function run(i) {
    if (busy.current) return;
    busy.current = true;
    setMarks({}); setRows([]);
    const s = R.start();
    setFb({ kind: "info", html: "Dry running…" });
    try {
      for (const st of rd.steps) {
        setCur(st.l);
        setRows(x => [...x, st]);
        await s.sleep(650);
      }
      setCur(0);
      const right = i === rd.a;
      setMarks(right ? { [i]: "right" } : { [rd.a]: "right", [i]: "wrong" });
      setFb({ kind: right ? "ok" : "bad", html: (right ? "<strong>Correct.</strong> " : `<strong>It was ${esc(rd.opts[rd.a])}.</strong> `) + rd.why });
      solve(r);
    } catch (e) { ignoreCancel(e); }
    busy.current = false;
  }

  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={r} solved={solved} onPick={load} />
    <div className="split">
      <CodeBox title="pseudocode" lines={rd.ps} highlight={psHl} cur={cur} />
      <div className="side">
        <Panel title="Given"><p>{rd.given}</p></Panel>
        <Panel title="Your prediction">
          <p>{rd.q}</p>
          <OptionRow opts={rd.opts} marks={marks || {}} disabled={marks !== null} onPick={run} />
        </Panel>
      </div>
    </div>
    <Panel title="Trace table">
      <div className="trace-wrap">
        <table className="trace">
          <thead><tr><th>Line</th>{cols.vars.map(v => <th key={v}>{v}</th>)}{cols.hasCheck && <th>Check</th>}{cols.hasOut && <th>Output</th>}</tr></thead>
          <tbody>
            {rows.map((st, i) => (
              <tr key={i} className="new">
                <td>{st.l}</td>
                {cols.vars.map(v => <td key={v}>{st.vars && v in st.vars ? st.vars[v] : ""}</td>)}
                {cols.hasCheck && <td>{st.check || ""}</td>}
                {cols.hasOut && <td className="out">{st.out === undefined ? "" : st.out}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
    <div className="controls"><NextButton show={!last} label={act.nextLabel} onClick={() => load(r + 1)} /></div>
    <Feedback fb={fb} />
  </>;
}

/* ---------- Translate it: choose the Python for each pseudocode line ---------- */
export function PseudoTranslate({ act, data, onDone }) {
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const rd = data[r];
  const [loadKey, setLoadKey] = useState(0);
  const pool = useMemo(() => {
    const p = shuffle([...new Set(rd.py.filter(Boolean).map(s => s.trim()).concat(rd.distractors))]);
    if (rd.py.some(x => x === null)) p.push(PS_NONE);
    return p;
  }, [rd, loadKey]);
  const [picks, setPicks] = useState(() => rd.ps.map(() => ""));
  const [marks, setMarks] = useState({});
  const [fb, setFb] = useState(null);

  const lineProps = useCodeLines(rd.ps, true, { keyboard: false }); // the dropdowns take focus instead
  const tip = useTip();
  function load(k) { setR(k); setLoadKey(x => x + 1); setPicks(data[k].ps.map(() => "")); setMarks({}); setFb(null); }
  const preview = [];
  rd.py.forEach((py, i) => {
    const v = picks[i];
    if (!v || v === PS_NONE) return;
    preview.push((py ? py.match(/^ */)[0] : "") + v);
  });

  function check() {
    let right = 0;
    const m = {};
    rd.py.forEach((py, i) => {
      const v = picks[i], ok = py === null ? v === PS_NONE : v === py.trim();
      m[i] = ok ? "right" : v ? "wrong" : "";
      if (ok) right++;
    });
    setMarks(m);
    if (right === rd.py.length) {
      setFb({ kind: "ok", html: "<strong>Translated.</strong> " + rd.why });
      solve(r);
    } else setFb({ kind: "bad", html: `<strong>${right} of ${rd.py.length} lines correct.</strong> Red rows need another look. Remember that END IF and END REPEAT have no Python line of their own.` });
  }

  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={r} solved={solved} onPick={load} />
    <div className="split">
      <div className="ps-rows">
        {rd.ps.map((ps, i) => {
          const sid = `${act.id}-row-${i}`;
          return (
            <div key={`${loadKey}-${i}`} className={cx("ps-row", marks[i])}>
              <label className="ps-line" htmlFor={sid} {...lineProps(i)}><code dangerouslySetInnerHTML={{ __html: psHl(ps) }} /></label>
              <span className="ps-arrow" aria-hidden="true">→</span>
              <select id={sid} value={picks[i]}
                onFocus={e => { if (lineProps.show(i, e.currentTarget.closest(".ps-row").querySelector(".ps-line"))) e.currentTarget.setAttribute("aria-describedby", "code-tip"); }}
                onBlur={e => { e.currentTarget.removeAttribute("aria-describedby"); tip.hide(); }}
                onChange={e => { const v = e.target.value; setPicks(p => p.map((x, j) => (j === i ? v : x))); setMarks(m => ({ ...m, [i]: "" })); }}>
                <option value="">Choose the Python…</option>
                {pool.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          );
        })}
      </div>
      <CodeBox note="your translation" lines={preview.length ? (rd.head || []).concat(preview) : ["# choose a Python line for each pseudocode line"]} />
    </div>
    <div className="controls">
      <button className="btn primary" type="button" onClick={check}>Check</button>
      <NextButton show={!last} label={act.nextLabel} onClick={() => load(r + 1)} />
    </div>
    <Feedback fb={fb} />
  </>;
}

/* ---------- Complete the plan: fill each {{right|wrong|wrong}} blank ---------- */
export function PseudoCloze({ act, data, onDone }) {
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const rd = data[r];
  const [loadKey, setLoadKey] = useState(0);
  // lines → parts: plain text, or a blank { b: index, answer, choices (shuffled) }
  const parsed = useMemo(() => {
    let b = 0;
    return rd.ps.map(ln => ln.split(/(\{\{[^}]+\}\})/).map(part => {
      const m = part.match(/^\{\{(.+)\}\}$/);
      if (!m) return part;
      const choices = m[1].split("|");
      return { b: b++, answer: choices[0], choices: shuffle(choices) };
    }));
  }, [rd, loadKey]);
  const blanks = parsed.flat().filter(p => typeof p !== "string");
  // Lines with a blank get no tooltip and no focus stop (the dropdowns in them are focusable already)
  const lineProps = useCodeLines(rd.ps, true, { skip: i => /\{\{/.test(rd.ps[i]) });
  const [picks, setPicks] = useState({});
  const [marks, setMarks] = useState({});
  const [fb, setFb] = useState(null);
  const [showPy, setShowPy] = useState(false);

  function load(k) { setR(k); setLoadKey(x => x + 1); setPicks({}); setMarks({}); setFb(null); setShowPy(false); }
  function check() {
    let right = 0;
    const m = {};
    blanks.forEach(bl => { const v = picks[bl.b] || "", ok = v === bl.answer; m[bl.b] = ok ? "right" : v ? "wrong" : ""; if (ok) right++; });
    setMarks(m);
    if (right === blanks.length) {
      setFb({ kind: "ok", html: "<strong>The plan meets the goal.</strong> " + rd.why });
      setShowPy(true);
      solve(r);
    } else setFb({ kind: "bad", html: `<strong>${right} of ${blanks.length} blanks correct.</strong> Read the goal again, then test the plan with an example value.` });
  }

  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={r} solved={solved} onPick={load} />
    <div className="split">
      <CodeBox title="pseudocode">
        <ol className="code" aria-label={CODE_HINT}>
          {parsed.map((parts, i) => (
            <li key={`${loadKey}-${i}`} {...lineProps(i)}>
              <span className="ln">{i + 1}</span>
              <code>
                {parts.map((p, j) => (typeof p === "string"
                  ? <span key={j} dangerouslySetInnerHTML={{ __html: psHl(p) }} />
                  : <select key={j} className={cx("ps-blank", marks[p.b])} aria-label={`Blank on line ${i + 1}`} value={picks[p.b] || ""}
                      onChange={e => { const v = e.target.value; setPicks(x => ({ ...x, [p.b]: v })); setMarks(x => ({ ...x, [p.b]: "" })); }}>
                      <option value="">…</option>
                      {p.choices.map(c => <option key={c}>{c}</option>)}
                    </select>))}
              </code>
            </li>
          ))}
        </ol>
      </CodeBox>
      <div className="side">
        <Panel title="The goal"><p>{rd.goal}</p></Panel>
        {showPy && <CodeBox note="the same plan in Python" lines={rd.py} />}
      </div>
    </div>
    <div className="controls">
      <button className="btn primary" type="button" onClick={check}>Check</button>
      <NextButton show={!last} label={act.nextLabel} onClick={() => load(r + 1)} />
    </div>
    <Feedback fb={fb} />
  </>;
}

