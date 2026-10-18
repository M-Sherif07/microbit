import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Board from "./Board.jsx";
import CodeEditor from "./CodeEditor.jsx";
import { Feedback, Panel, Serial, Vars, cx, useOnHide, useRunner, useSerial } from "./ui.jsx";
import { esc } from "../lib/highlight.js";
import { execute } from "../lib/python.js";
import { errorHelp } from "../lib/errorHelp.js";

const SPEEDS = [["Slow", 350], ["Normal", 90], ["Fast", 5]];

/* "Code it here": write a challenge's program, run it on the simulator and have it checked.
   challenges: the topic's list (each may have check(run) → null | hint) · ids: matching ids ("w-0")
   store: { code, passed, setCode(id, src), pass(id) } kept by LabPage */
const CodeLab = forwardRef(function CodeLab({ title, challenges, ids, store, visible }, ref) {
  const [k, setK] = useState(0);
  const c = challenges[k], id = ids[k];
  const src = store.code[id] ?? c.starter;
  const section = useRef(null);

  const R = useRunner();
  const board = useRef(null);
  const serial = useSerial();
  const [running, setRunning] = useState(false);
  const [cur, setCur] = useState(0);
  const [errLine, setErrLine] = useState(0);
  const [vars, setVars] = useState({ vars: {}, changed: null, tick: 0 });
  const [speed, setSpeed] = useState(1);
  const [fb, setFb] = useState(null);
  const [asking, setAsking] = useState(null); // { prompt } while input() waits
  const [answer, setAnswer] = useState("");
  const answerFn = useRef(null);
  const sensors = useRef({ a: false, b: false, aLatch: false, bLatch: false });
  const [held, setHeld] = useState({});
  const presses = useRef({ a: 0, b: 0 });

  useImperativeHandle(ref, () => ({
    open(i) { pick(i); section.current.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }));

  function stop() {
    R.stop(); answerFn.current = null; setAsking(null);
    setRunning(false); setCur(0);
  }
  function pick(i) { stop(); setK(i); serial.clear(); setErrLine(0); setFb(null); setVars({ vars: {}, changed: null, tick: 0 }); board.current.clear(); }
  useOnHide(visible, () => { if (running) stop(); });

  function press(key, down) {
    const s = sensors.current;
    if (!down && !s[key]) return; // already up
    s[key] = down;
    if (down) { s[key + "Latch"] = true; presses.current[key]++; }
    setHeld(h => ({ ...h, [key]: down }));
  }
  // The A and B keys press the buttons while a program runs (not while typing)
  useEffect(() => {
    if (!running) return;
    const isTyping = e => /INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
    const down = e => { const key = e.key.toLowerCase(); if ((key === "a" || key === "b") && !e.repeat && !isTyping(e) && !e.ctrlKey && !e.metaKey && !e.altKey) press(key, true); };
    const up = e => { const key = e.key.toLowerCase(); if ((key === "a" || key === "b") && sensors.current[key]) press(key, false); };
    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
    return () => { document.removeEventListener("keydown", down); document.removeEventListener("keyup", up); };
  }, [running]);

  async function run() {
    stop();
    const s = R.start();
    serial.clear(); setErrLine(0); setFb({ kind: "info", html: "Running… Press Stop to end it early." });
    setVars({ vars: {}, changed: null, tick: 0 });
    board.current.clear();
    sensors.current = { a: false, b: false, aLatch: false, bLatch: false };
    presses.current = { a: 0, b: 0 };
    setHeld({});
    setRunning(true);
    const rec = { texts: [], images: [], prints: [], clears: 0, inputs: [], source: src };
    const pace = SPEEDS[speed][1];
    let error = null;
    const env = {
      board: board.current, sensors: sensors.current, speaker: { play() {} },
      serial: t => { rec.prints.push(t); serial.write(t); }, serialErr: serial.writeErr,
      mark: n => setCur(n), cond() {},
      pace, loopPace: pace,
      onScroll: t => rec.texts.push(t),
      onShow: (v, img) => (img ? rec.images : rec.texts).push(v),
      onClear: () => rec.clears++,
      onVars: (v, changed) => setVars(p => ({ vars: { ...v }, changed, tick: p.tick + 1 })),
      onError: e => { error = e; setErrLine(e.line); },
      input: prompt => new Promise(res => {
        setAnswer(""); setAsking({ prompt });
        answerFn.current = text => { rec.inputs.push(text); serial.write(prompt + text); res(text); };
      })
    };
    env.sensors = sensors.current;
    const res = await execute(src.split("\n"), env, s);
    if (res === "stopped") return;
    setRunning(false); setCur(0);
    if (res === "error") {
      setFb({ kind: "bad", html: errorHelp(error, src.split("\n")) });
      return;
    }
    const run = { ...rec, pressed: { ...presses.current }, lit: board.current.lit() };
    const hint = c.check ? c.check(run) : null;
    if (hint) setFb({ kind: "bad", html: "<strong>It ran, but it doesn't do the whole challenge yet.</strong> " + esc(hint) });
    else {
      store.pass(id);
      const more = k < challenges.length - 1 ? " Then try the next challenge." : " That's every challenge in this topic.";
      setFb({ kind: "ok", html: c.check ? "<strong>It works!</strong> That passes the challenge. Send it to your micro:bit and tick it off above." + more : "<strong>It ran without errors.</strong>" });
    }
  }

  function reply(e) {
    e.preventDefault();
    if (!answerFn.current) return;
    const fn = answerFn.current;
    answerFn.current = null; setAsking(null); fn(answer);
  }

  return (
    <section className="codelab" ref={section} aria-labelledby={`codelab-${ids[0]}`}>
      <div className="real-head">
        <div>
          <p className="eyebrow">Write it yourself</p>
          <h3 id={`codelab-${ids[0]}`}>{title}</h3>
          <p className="real-intro">Pick a challenge, write the code and press Run. When it finishes, it's checked against the challenge.</p>
        </div>
        <span className="real-count">{ids.filter(x => store.passed.has(x)).length}/{ids.length} passed in the simulator</span>
      </div>
      <div className="rounds" role="group" aria-label="Challenge">
        <span className="lbl">Challenge</span>
        {challenges.map((ch, i) => (
          <button key={i} type="button" className={cx("pill", store.passed.has(ids[i]) && "ok")} aria-pressed={i === k} onClick={() => pick(i)}>{i + 1}. {ch.title}</button>
        ))}
      </div>
      <div className="split">
        <div className="side">
          <Panel title={`Challenge ${k + 1}: ${c.title}`}>
            <ol className="lab-steps">{c.steps.map((t, i) => <li key={i}>{t}</li>)}</ol>
          </Panel>
          <div className="codebox">
            <div className="codebar"><span>main.py</span><span>{running ? "running…" : store.passed.has(id) ? "✓ passed" : "your code"}</span></div>
            <CodeEditor value={src} onChange={v => { store.setCode(id, v); setErrLine(0); }} readOnly={running} cur={cur} errLine={errLine} />
          </div>
          <div className="controls">
            {running
              ? <button className="btn primary" type="button" onClick={() => { stop(); setFb({ kind: "info", html: "Stopped." }); }}>■ Stop</button>
              : <button className="btn primary" type="button" onClick={run}>▶ Run</button>}
            <label htmlFor={`speed-${id}`}>Speed</label>
            <select id={`speed-${id}`} value={speed} disabled={running} onChange={e => setSpeed(+e.target.value)}>
              {SPEEDS.map(([n], i) => <option key={n} value={i}>{n}</option>)}
            </select>
            <button className="btn" type="button" disabled={running || src === c.starter} onClick={() => { store.setCode(id, c.starter); setErrLine(0); setFb(null); }}>Reset code</button>
            {/* Always there (except on the last challenge), so students can move on whenever they like */}
            {k < challenges.length - 1 && (
              <button className="btn" type="button" disabled={running} onClick={() => pick(k + 1)}>Next challenge →</button>
            )}
          </div>
        </div>
        <div className="side">
          <Board ref={board} onButton={press} held={held} />
          <p className="tip-small">Hold <b>A</b> or <b>B</b> on the board, or press the A and B keys while it runs.</p>
          {asking && (
            <form className="panel ask" onSubmit={reply}>
              <label htmlFor={`ask-${id}`}><b>input():</b> {asking.prompt || "type an answer"}</label>
              <input id={`ask-${id}`} type="text" value={answer} autoFocus onChange={e => setAnswer(e.target.value)} />
              <button className="btn primary" type="submit">Enter</button>
            </form>
          )}
          <Panel title="Variables"><Vars {...vars} /></Panel>
          <Panel title="Serial"><Serial lines={serial.lines} /></Panel>
        </div>
      </div>
      <Feedback fb={fb} />
    </section>
  );
});

export default CodeLab;
