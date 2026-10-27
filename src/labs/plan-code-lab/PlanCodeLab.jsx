/* Plan It, Code It: read a client brief, then understand it, write pseudocode, build a flowchart,
   code it and test it. One scenario per tab. Students' work is kept in localStorage; which steps
   are done is also saved as a progress set, so the home page can show it like the other labs. */
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import ThemeToggle from "../../components/ThemeToggle.jsx";
import { errorHelp } from "../../lib/errorHelp.js";
import { addPsKeywords, hl, psHl } from "../../lib/highlight.js";
import FlowSvg from "./Flowchart.jsx";
import { blankWork, flowChecks, norm, pseudoChecks, rowPass, runCode, splitInputs, stepDone, testRows, TEST_HELP, workText } from "./logic.js";
import { KINDS, PLACEHOLDER, SCENARIOS, STEPS } from "./scenarios.js";

const WORK_KEY = "ictprg302-plan-code-lab";
export const PROGRESS_KEY = "ictprg302-plan-code-progress";
const NAME_KEY = "ictprg302-student-name";
addPsKeywords(["FOR", "WHILE", "UNTIL"]);

const newId = () => Math.random().toString(36).slice(2, 9);
function addIds(list) { for (const n of list || []) { n.id = n.id || newId(); addIds(n.yes); addIds(n.no); addIds(n.body); } }
const clone = o => (typeof structuredClone === "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o)));
function loadWork() {
  try {
    const w = JSON.parse(localStorage.getItem(WORK_KEY) || "{}");
    const sc = w.sc || {};
    for (const v of Object.values(sc)) { addIds(v.flow); v.hints = v.hints || {}; v.reveal = v.reveal || {}; v.runId = v.runId || 0; }
    return sc;
  } catch (e) { return {}; }
}
const tabFromHash = () => { try { const h = location.hash.slice(1); return SCENARIOS.some(s => s.id === h) ? h : SCENARIOS[0].id; } catch (e) { return SCENARIOS[0].id; } };

// The flowchart builder addresses a node by its path, e.g. "1.no.0" is the first step on the No branch of step 2
function listIn(flow, path) {
  let list = flow;
  if (!path) return list;
  const parts = path.split(".");
  for (let i = 0; i < parts.length; i += 2) { const n = list[+parts[i]]; list = n[parts[i + 1]] || (n[parts[i + 1]] = []); }
  return list;
}
function nodeIn(flow, p) { const parts = p.split("."), i = +parts.pop(); return { list: listIn(flow, parts.join(".")), i }; }

export default function PlanCodeLab() {
  const [work, setWork] = useState(loadWork);
  const [tab, setTab] = useState(tabFromHash);
  const [name, setName] = useState(() => { try { return localStorage.getItem(NAME_KEY) || ""; } catch (e) { return ""; } });
  const [confirmReset, setConfirmReset] = useState(false);
  const sc = SCENARIOS.find(x => x.id === tab) || SCENARIOS[0];
  const s = work[sc.id] || blankWork(sc);
  const done = useMemo(() => stepDone(sc, s), [sc, s]);
  const allDone = useMemo(() => Object.fromEntries(SCENARIOS.map(x => [x.id, stepDone(x, work[x.id] || blankWork(x))])), [work]);

  // Save the work, and the finished steps as "<scenario>-<step>" for the home page
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(WORK_KEY, JSON.stringify({ sc: work }));
        const ids = SCENARIOS.flatMap(x => STEPS.filter(([k]) => allDone[x.id][k]).map(([k]) => `${x.id}-${k}`));
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(ids));
      } catch (e) { /* storage unavailable */ }
    }, 250);
    return () => clearTimeout(t);
  }, [work, allDone]);
  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const upd = fn => setWork(prev => { const cur = clone(prev[sc.id] || blankWork(sc)); fn(cur); return { ...prev, [sc.id]: cur }; });
  function showTab(id) {
    setTab(id);
    try { history.replaceState(null, "", "#" + id); } catch (e) { /* ignore */ }
    window.scrollTo({ top: 0 });
  }
  function reset() {
    if (!confirmReset) { setConfirmReset(true); return; }
    try { localStorage.removeItem(WORK_KEY); localStorage.setItem(PROGRESS_KEY, "[]"); } catch (e) { /* ignore */ }
    location.reload();
  }
  const nDone = Object.values(done).filter(Boolean).length;
  const props = { sc, s, upd };

  return <>
    <header className="top">
      <div className="top-inner">
        <a className="home-link" href="../index.html">← All labs</a>
        <div className="brand"><h1>Plan It, Code It</h1><span>micro:bit · Python</span></div>
        <nav className="tabs" role="tablist" aria-label="Scenarios">
          {SCENARIOS.map(x => {
            const n = Object.values(allDone[x.id]).filter(Boolean).length;
            return <button key={x.id} className="tab" role="tab" aria-selected={x.id === sc.id} onClick={() => showTab(x.id)}>
              {x.tab} <span className="count pc-pop" key={n}>{n}/5</span>
            </button>;
          })}
        </nav>
        <ThemeToggle />
      </div>
      <div className="pc-progress" aria-hidden="true"><span style={{ width: nDone * 20 + "%" }} /></div>
    </header>

    <main key={sc.id} className="pc-enter">
      <section className="intro pc-intro">
        <div>
          <p className="eyebrow">{sc.level}</p>
          <h2>{sc.title}</h2>
          <p className="lead">{sc.lead}</p>
          <ol className="pc-steps" aria-label="Your progress">
            {STEPS.map(([k, n], i) => <li key={k} className={done[k] ? "done" : ""}>{i + 1} {n}</li>)}
          </ol>
        </div>
        <article className="pc-ticket" aria-label="Client brief">
          <div className="pc-ticket-head"><span>{sc.ticket}</span><span>Client brief</span></div>
          <div className="pc-ticket-body">
            {/* the briefs are written in scenarios.js and contain a little HTML */}
            <div className="pc-brief-html" dangerouslySetInnerHTML={{ __html: sc.brief }} />
            <p className="pc-ticket-note">Use the exact words in yellow, so the tests in step 5 can check them.</p>
          </div>
        </article>
      </section>
      <Understand {...props} done={done.understand} />
      <Pseudo {...props} done={done.pseudo} />
      <Flow {...props} done={done.flow} />
      <Code {...props} done={done.code} />
      <Tests {...props} done={done.test} />
      <HandIn sc={sc} s={s} name={name} />
      <Note />
    </main>

    <footer>
      <span>Code runs in a simulator on this page. Test it on a real board in the micro:bit Python editor.</span>
      <button type="button" onClick={reset} onBlur={() => setConfirmReset(false)}>{confirmReset ? "Click again to delete all your work in this lab" : "Reset my work"}</button>
      <label>Your name <input type="text" autoComplete="name" value={name}
        onChange={e => { setName(e.target.value); try { localStorage.setItem(NAME_KEY, e.target.value.trim()); } catch (err) { /* ignore */ } }} /></label>
      <a className="next-lab" href="../index.html">Back to all labs →</a>
    </footer>
  </>;
}

/* ---------- building blocks ---------- */
function Step({ n, id, title, done, children }) {
  return (
    <section className="act" aria-labelledby={"h-" + id}>
      <div className="act-head">
        <span className="act-tag">Step {n} of 5</span><h3 id={"h-" + id}>{title}</h3>
        <span key={done ? "d" : "t"} className={"status" + (done ? " done pc-done" : "")}>{done ? "Done" : "To do"}</span>
      </div>
      {children}
    </section>
  );
}
function Checklist({ items }) {
  return <ul className="pc-checks">{items.map((c, i) => <li key={i + (c.ok ? "y" : "n")} className={c.ok ? "ok" : "no"}>{c.msg}</li>)}</ul>;
}
function Hints({ list, n, onMore }) {
  return (
    <div className="pc-hints">
      {n > 0 && <ol className="pc-hint-list" aria-label="Hints">{list.slice(0, n).map((t, i) => <li key={i}>{t}</li>)}</ol>}
      {n < list.length
        ? <button className="btn small" onClick={onMore}>{n ? "Show another hint" : "Show a hint"} ({n} of {list.length})</button>
        : <span className="pc-hint">That's every hint for this step.</span>}
    </div>
  );
}
function Reveal({ open, tried, label = "Compare with a model answer", onToggle, children }) {
  const [msg, setMsg] = useState("");
  const click = () => {
    if (!open && !tried) { setMsg("Have a go first. The model answer opens once you've written something for this step."); return; }
    setMsg(""); onToggle();
  };
  return <>
    <div className="pc-row">
      <button className="btn small" aria-expanded={open} onClick={click}>{open ? "Hide model answer" : label}</button>
      {msg && <span className="pc-hint pc-fade">{msg}</span>}
    </div>
    <div className={"pc-collapse" + (open ? " open" : "")} aria-hidden={!open} inert={open ? undefined : ""}>
      <div className="inner"><div className="pc-model">{children}</div></div>
    </div>
  </>;
}
const hintProps = (sc, s, upd, key) => ({ list: sc.hints[key], n: s.hints[key] || 0, onMore: () => upd(x => { x.hints[key] = (x.hints[key] || 0) + 1; }) });

// A read-only block of coloured code (hl and psHl escape the text)
const Painted = ({ src, paint }) => <pre dangerouslySetInnerHTML={{ __html: src.split("\n").map(paint).join("\n") }} />;

// Editor with line numbers and coloured code, Tab to indent (Esc then Tab leaves) and auto-indent on Enter.
// It's a transparent textarea over the coloured lines, like the other labs' editor. errLine: the line with an error
const Editor = forwardRef(function Editor({ id, title, value, onChange, mode, rows, errLine = 0 }, ref) {
  const ta = useRef(null), box = useRef(null), caret = useRef(null), escaped = useRef(false);
  useLayoutEffect(() => {
    if (caret.current !== null && ta.current) { ta.current.selectionStart = ta.current.selectionEnd = caret.current; caret.current = null; }
  });
  // Scroll the line with the error into view
  useEffect(() => {
    const el = errLine && box.current && box.current.querySelector(".ed-line.err");
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [errLine]);
  const put = (text, a, b, at) => { caret.current = at === undefined ? a + text.length : at; onChange(value.slice(0, a) + text + value.slice(b)); };
  useImperativeHandle(ref, () => ({
    // Insert a keyword on its own line, with the caret in its gap ("IF | THEN")
    insert(text) {
      const el = ta.current, a = el.selectionStart, b = el.selectionEnd;
      const lineStart = value.lastIndexOf("\n", a - 1) + 1, atStart = !value.slice(lineStart, a).trim();
      const t = (atStart || !value ? "" : "\n") + text, gap = text.indexOf("  ");
      el.focus();
      put(t, a, b, gap >= 0 ? a + t.length - text.length + gap + 1 : undefined);
    }
  }), [value]);
  const onKeyDown = e => {
    const a = e.target.selectionStart, b = e.target.selectionEnd;
    if (e.key === "Escape") { escaped.current = true; return; }
    if (e.key === "Tab" && !escaped.current) {
      e.preventDefault();
      if (!e.shiftKey) { put("    ", a, b); return; }
      const start = value.lastIndexOf("\n", a - 1) + 1, m = value.slice(start).match(/^ {1,4}/);
      if (m) put("", start, start + m[0].length, Math.max(start, a - m[0].length));
      return;
    }
    escaped.current = false;
    if (e.key === "Enter") {
      e.preventDefault();
      const lineText = value.slice(value.lastIndexOf("\n", a - 1) + 1, a);
      let ind = lineText.match(/^\s*/)[0];
      if (mode === "py" ? /:\s*$/.test(lineText) : /^\s*(IF\b|ELSE\b|REPEAT\b|FOR\b)/i.test(lineText)) ind += "    ";
      put("\n" + ind, a, b);
    }
  };
  const lines = value.split("\n"), paint = mode === "py" ? hl : psHl;
  const width = Math.max(...lines.map(l => l.length), 20) + 2;
  const err = i => (errLine === i + 1 ? "err" : undefined);
  return (
    <div className="pc-editor">
      <div className="pc-editor-bar"><span>{title}</span>{errLine ? <span className="pc-err-tag">Error on line {errLine}</span> : <span>Tab indents · Esc then Tab leaves</span>}</div>
      <div className="ed" ref={box}>
        <ol className="ed-gutter" aria-hidden="true">{lines.map((_, i) => <li key={i} className={err(i)}>{i + 1}</li>)}</ol>
        <div className="ed-stack" style={{ "--cols": width + "ch", "--rows": Math.max(lines.length, Number(rows) || 0) }}>
          <pre className="ed-hl" aria-hidden="true">
            {lines.map((l, i) => <span key={i} className={"ed-line" + (err(i) ? " err" : "")} dangerouslySetInnerHTML={{ __html: (paint(l) || "") + "\n" }} />)}
          </pre>
          <textarea id={id} ref={ta} spellCheck={false} autoCapitalize="off" autoComplete="off" autoCorrect="off" wrap="off" value={value}
            aria-label={title + (errLine ? `. Error on line ${errLine}` : "")} aria-invalid={errLine ? true : undefined}
            onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown} onBlur={() => { escaped.current = false; }} />
        </div>
      </div>
    </div>
  );
});

/* ---------- step 1 ---------- */
function Understand({ sc, s, upd, done }) {
  const field = (k, label, small) => (
    <div className="pc-field">
      <label htmlFor={"ipo-" + k}>{label}</label><small>{small}</small>
      <textarea id={"ipo-" + k} rows="4" value={s.ipo[k]} onChange={e => { const v = e.target.value; upd(x => { x.ipo[k] = v; }); }} />
    </div>
  );
  return (
    <Step n="1" id="understand" title="Understand the problem" done={done}>
      <p className="brief">Read the brief twice. Before planning anything, write down what goes in, what the program has to work out, and what comes out.</p>
      <div className="pc-ipo">
        {field("in", "Inputs", "What does the user type?")}
        {field("proc", "Processing", "What decisions or calculations happen?")}
        {field("out", "Outputs", "What can the micro:bit show?")}
      </div>
      <Hints {...hintProps(sc, s, upd, "understand")} />
      <Reveal open={!!s.reveal.ipo} tried={!!(s.ipo.in + s.ipo.proc + s.ipo.out).trim()} onToggle={() => upd(x => { x.reveal.ipo = !x.reveal.ipo; })}>
        <h4>Model answer</h4><p><b>Inputs:</b> {sc.ipo.in}</p><p><b>Processing:</b> {sc.ipo.proc}</p><p><b>Outputs:</b> {sc.ipo.out}</p>
      </Reveal>
    </Step>
  );
}

/* ---------- step 2 ---------- */
const CHIPS = ["INPUT ", "DISPLAY ", "SET  TO ", "IF  THEN", "ELSE IF  THEN", "ELSE", "END IF", "REPEAT FOREVER", "FOR i FROM 1 TO ", "END FOR", "STOP REPEATING", "END REPEAT"];
function Pseudo({ sc, s, upd, done }) {
  const ed = useRef(null);
  const checks = useMemo(() => pseudoChecks(sc, s.pseudo), [sc, s.pseudo]);
  return (
    <Step n="2" id="pseudo" title="Write the pseudocode" done={done}>
      <p className="brief">Write the plan in plain English. One step per line, KEYWORDS in capitals, and indent the steps inside an IF or a REPEAT. The checklist updates as you type.</p>
      <div className="split">
        <div className="pc-stack">
          <Editor ref={ed} id="pseudo" title="plan.txt" mode="pseudo" rows="14" value={s.pseudo} onChange={v => upd(x => { x.pseudo = v; })} />
          <div className="pc-row" aria-label="Insert a keyword">
            {CHIPS.map(k => <button key={k} className="pc-chip" onClick={() => ed.current.insert(k)}>{k.trim()}</button>)}
          </div>
        </div>
        <div className="pc-stack">
          <div className="pc-panel"><h4>Checklist</h4>{s.pseudo.trim() ? <Checklist items={checks} /> : <p className="pc-hint">Start writing and the checklist appears here.</p>}</div>
          <div className="pc-panel"><h4>Pseudocode words</h4><div className="pc-ref">
            <span>INPUT x</span><span>the user types a value</span>
            <span>DISPLAY "Hi"</span><span>show something</span>
            <span>SET x TO 0</span><span>store a value</span>
            <span>IF … THEN</span><span>a question with two paths</span>
            <span>ELSE IF … THEN</span><span>another question</span>
            <span>REPEAT FOREVER</span><span>loop until STOP REPEATING</span>
            <span>FOR i FROM 1 TO n</span><span>loop n times</span>
          </div></div>
        </div>
      </div>
      <Hints {...hintProps(sc, s, upd, "pseudo")} />
      <Reveal open={!!s.reveal.pseudo} tried={!!s.pseudo.trim()} onToggle={() => upd(x => { x.reveal.pseudo = !x.reveal.pseudo; })}>
        <h4>Model pseudocode</h4><Painted src={sc.pseudo} paint={psHl} />
        <p>Yours can be worded differently and still be right. Check it covers every result in the brief, in an order that works.</p>
      </Reveal>
    </Step>
  );
}

/* ---------- step 3 ---------- */
function FlowList({ list, path, act, focusId }) {
  const [kind, setKind] = useState("input");
  return (
    <div className="pc-fb-list">
      {list.map((n, i) => {
        const p = path ? `${path}.${i}` : `${i}`;
        return (
          <div className="pc-fb-row" key={n.id}>
            <div className="pc-fb-line">
              <select aria-label="Shape" value={n.k} onChange={e => act("kind", p, e.target.value)}>{KINDS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
              <input type="text" aria-label="Words in this shape" value={n.t || ""} placeholder={PLACEHOLDER[n.k] || ""} autoFocus={n.id === focusId} onChange={e => act("text", p, e.target.value)} />
              <span className="pc-fb-tools">
                <button aria-label="Move up" title="Move up" onClick={() => act("up", p)}>↑</button>
                <button aria-label="Move down" title="Move down" onClick={() => act("down", p)}>↓</button>
                <button aria-label="Delete" title="Delete" onClick={() => act("del", p)}>✕</button>
              </span>
            </div>
            {n.k === "decision" && <>
              <div className="pc-fb-branch"><span className="pc-fb-label">Yes ↓</span><FlowList list={n.yes || []} path={p + ".yes"} act={act} focusId={focusId} /></div>
              <div className="pc-fb-branch"><span className="pc-fb-label">No ↓</span><FlowList list={n.no || []} path={p + ".no"} act={act} focusId={focusId} /></div>
            </>}
            {n.k === "loop" && <div className="pc-fb-branch"><span className="pc-fb-label">Repeat these steps</span><FlowList list={n.body || []} path={p + ".body"} act={act} focusId={focusId} /></div>}
          </div>
        );
      })}
      {!list.length && path && <span className="pc-fb-empty">Nothing here yet.</span>}
      <div className="pc-fb-add">
        <select aria-label="Shape to add" value={kind} onChange={e => setKind(e.target.value)}>{KINDS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <button className="btn small" onClick={() => act("add", path, kind)}>Add step{path ? "" : " to the main path"}</button>
      </div>
    </div>
  );
}
function Flow({ sc, s, upd, done }) {
  const [focusId, setFocusId] = useState(null);
  const checks = useMemo(() => flowChecks(sc, s.flow), [sc, s.flow]);
  const act = (type, path, val) => {
    const nid = newId();
    if (type === "add") setFocusId(nid);
    upd(x => {
      if (type === "add") {
        const n = { id: nid, k: val, t: val === "break" ? "Stop repeating" : "" };
        if (val === "decision") { n.yes = []; n.no = []; }
        if (val === "loop") n.body = [];
        listIn(x.flow, path).push(n);
        return;
      }
      const { list, i } = nodeIn(x.flow, path), n = list[i];
      if (type === "text") n.t = val;
      if (type === "kind") {
        n.k = val;
        if (val === "decision") { n.yes = n.yes || []; n.no = n.no || []; }
        if (val === "loop") n.body = n.body || [];
        if (val === "break" && !n.t) n.t = "Stop repeating";
      }
      if (type === "del") list.splice(i, 1);
      if (type === "up" && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
      if (type === "down" && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
    });
  };
  return (
    <Step n="3" id="flow" title="Turn the pseudocode into a flowchart" done={done}>
      <p className="brief">Go through your pseudocode line by line and add a shape for each step. An IF becomes a decision with a Yes and a No branch. A REPEAT or FOR becomes a loop. Start and End are added for you.</p>
      <div className="pc-legend" aria-label="Shape key">
        <span><i className="k-term" />Start / End</span><span><i className="k-io" />Input / Output</span>
        <span><i className="k-proc" />Process</span><span><i className="k-dec" />Decision</span><span><i className="k-loop" />Loop</span>
      </div>
      <div className="split">
        <div className="pc-stack">
          <FlowList list={s.flow} path="" act={act} focusId={focusId} />
          <div className="pc-panel"><h4>Checklist</h4>{s.flow.length ? <Checklist items={checks} /> : <p className="pc-hint">Add your first step. Most plans start with an Input.</p>}</div>
        </div>
        <div className="pc-fc-wrap"><FlowSvg list={s.flow} label="Your flowchart" /></div>
      </div>
      <Hints {...hintProps(sc, s, upd, "flow")} />
      <Reveal open={!!s.reveal.flow} tried={s.flow.length > 0} onToggle={() => upd(x => { x.reveal.flow = !x.reveal.flow; })}>
        <h4>Model flowchart</h4><div className="pc-fc-wrap"><FlowSvg list={sc.flow} label="Model flowchart" /></div>
      </Reveal>
    </Step>
  );
}

/* ---------- step 4 ---------- */
function ErrorText({ run, code }) {
  if (!run.error) return null;
  const help = run.err ? (TEST_HELP[run.err.type] || errorHelp(run.err, code.split("\n"))) : "";
  return (
    <div className="pc-err-in">
      <span className="pc-err">{run.error}</span>
      {/* errorHelp and TEST_HELP return escaped HTML with <code> and <strong> */}
      {help && <div className="pc-err-help" dangerouslySetInnerHTML={{ __html: help }} />}
    </div>
  );
}
function Code({ sc, s, upd, done }) {
  const [run, setRun] = useState(null);
  const go = async () => {
    const r = await runCode(s.code, splitInputs(s.runIn));
    setRun(prev => ({ ...r, code: s.code, n: (prev ? prev.n : 0) + 1 }));
    if (!r.error) upd(x => { x.codeRan = true; });
  };
  // Mark the line the error is on until the code is changed
  const errLine = run && run.err && run.code === s.code ? run.err.line || 0 : 0;
  let delay = 0;
  return (
    <Step n="4" id="code" title="Write the Python" done={done}>
      <p className="brief">Translate your plan one line at a time. Use <code>int(input("..."))</code> to read a number and <code>display.scroll(...)</code> to show a result. Run it with your own inputs before moving on to the tests.</p>
      <div className="split">
        <div className="pc-stack">
          <Editor id="code" title="main.py" mode="py" rows="16" errLine={errLine} value={s.code} onChange={v => upd(x => { x.code = v; x.results = null; })} />
          <div className="pc-row">
            <label htmlFor="run-in" className="pc-hint">Inputs, separated by commas</label>
            <input type="text" id="run-in" className="pc-mono-in" value={s.runIn} onChange={e => { const v = e.target.value; upd(x => { x.runIn = v; }); }} />
            <button className="btn primary" onClick={go}>Run ▶</button>
          </div>
          <div className="pc-screen" aria-live="polite" key={run ? run.n : 0}>
            {!run ? <span className="pc-dim">Press Run. What the micro:bit shows appears here.</span> : <>
              {run.outputs.length
                ? run.outputs.map((t, i) => {
                  const d = delay;
                  delay += 0.12 + t.length * 0.03;
                  return <div key={i}><span className="pc-led" style={{ "--n": Math.max(1, t.length), animationDelay: d + "s" }}>{t}</span></div>;
                })
                : <span className="pc-dim">(nothing shown)</span>}
              <div style={{ animationDelay: delay + "s" }} className="pc-fade-late"><ErrorText run={run} code={run.code} /></div>
            </>}
          </div>
        </div>
        <div className="pc-stack">
          <div className="pc-panel"><h4>Pseudocode to Python</h4><div className="pc-ref">
            <span>INPUT age</span><span>age = int(input("Age: "))</span>
            <span>DISPLAY "Hi"</span><span>display.scroll("Hi")</span>
            <span>SET total TO 0</span><span>total = 0</span>
            <span>IF age &lt; 5 THEN</span><span>if age &lt; 5:</span>
            <span>ELSE IF … THEN</span><span>elif …:</span>
            <span>ELSE</span><span>else:</span>
            <span>x = 3 (a test)</span><span>x == 3</span>
            <span>REPEAT FOREVER</span><span>while True:</span>
            <span>FOR i FROM 1 TO n</span><span>for i in range(n):</span>
            <span>STOP REPEATING</span><span>break</span>
            <span>"Total $" + total</span><span>"Total $" + str(total)</span>
            <span>END IF / END FOR</span><span>(nothing: stop indenting)</span>
          </div></div>
        </div>
      </div>
      <Hints {...hintProps(sc, s, upd, "code")} />
      <Reveal open={!!s.reveal.code} label="I'm stuck: show a model solution" tried={!!s.code.replace("from microbit import *", "").trim()} onToggle={() => upd(x => { x.reveal.code = !x.reveal.code; })}>
        <h4>Model solution</h4><Painted src={sc.code} paint={hl} />
      </Reveal>
    </Step>
  );
}

/* ---------- step 5 ---------- */
function Tests({ sc, s, upd, done }) {
  const [busy, setBusy] = useState(false);
  const rows = testRows(sc, s), res = s.results && s.results.length === rows.length ? s.results : null;
  const runAll = async () => {
    setBusy(true);
    const out = [];
    for (const r of rows) {
      const inputs = splitInputs(r.in);
      const mine = await runCode(s.code, inputs), model = await runCode(sc.code, inputs);
      const modelOut = model.error ? null : model.outputs.join(" | ");
      out.push({
        actual: mine.outputs.join(" | "), error: mine.error,
        // the student's expected result disagrees with the brief (the model solution's output)
        mismatch: !!(r.exp.trim() && modelOut !== null && norm(r.exp) !== norm(modelOut)),
        short: !!(r.mine && model.err && model.err.type === "EOFError")
      });
    }
    upd(x => { x.results = out; x.runId = (x.runId || 0) + 1; if (out.some(o => !o.error)) x.codeRan = true; });
    setBusy(false);
  };
  const edit = fn => upd(x => { fn(x); x.results = null; });
  const pass = res ? rows.filter((r, k) => rowPass(r, res[k])).length : 0;
  return (
    <Step n="5" id="test" title="Test it" done={done}>
      <p className="brief">For each test, work out from the brief what the micro:bit should show <em>before</em> you run anything, and type it in the Expected column. Then run all the tests. Add at least one test of your own. Separate several outputs with <code>|</code>, like <code>Wrong | Unlocked</code>.</p>
      <div className="pc-tests-wrap"><table className="pc-tests">
        <thead><tr><th>#</th><th>Inputs</th><th>Why this test</th><th>Expected</th><th>Actual</th><th>Result</th></tr></thead>
        <tbody>{rows.map((r, k) => {
          const x = res && res[k], anim = { animationDelay: k * 0.07 + "s" };
          const result = !x ? <span className="pc-res wait">Not run</span>
            : !r.exp.trim() ? <span className="pc-res wait pc-res-in" style={anim}>No expected</span>
            : rowPass(r, x) ? <span className="pc-res pass pc-res-in" style={anim}>Pass</span>
            : <span className="pc-res fail pc-res-in pc-shake" style={anim}>Fail</span>;
          return (
            <tr key={r.mine ? "m" + r.j : "g" + r.idx} className={r.mine ? "pc-row-new" : ""}>
              <td className="num">{k + 1}</td>
              <td>{r.mine
                ? <input type="text" aria-label={"Inputs for test " + (k + 1)} placeholder="e.g. 3, 10, 10, 11" value={r.in} onChange={e => { const v = e.target.value; edit(z => { z.extra[r.j].in = v; }); }} />
                : <span className="mono">{r.in}</span>}</td>
              <td>{r.why}{r.mine && <button style={{ marginLeft: 6 }} className="btn small" onClick={() => edit(z => { z.extra.splice(r.j, 1); })}>Remove</button>}</td>
              <td>{r.given
                ? <><span className="mono">{r.exp}</span><span className="pc-tag">given</span></>
                : <input type="text" aria-label={"Expected for test " + (k + 1)} value={r.exp} onChange={e => { const v = e.target.value; edit(z => { if (r.mine) z.extra[r.j].exp = v; else z.exp[r.idx] = v; }); }} />}</td>
              <td key={"a" + s.runId}>{x && <span className="mono pc-res-in" style={{ ...anim, color: x.error ? "var(--bad)" : undefined }}>{x.error ? x.error.split("\n").pop() : (x.actual || "(nothing shown)")}</span>}</td>
              <td key={"r" + s.runId}>{result}
                {x && x.mismatch && <span className="pc-note">Re-read the brief. Is this expected result right?</span>}
                {x && x.short && <span className="pc-note">These inputs run out before the program finishes.</span>}</td>
            </tr>
          );
        })}</tbody>
      </table></div>
      <div className="pc-row">
        <button className="btn primary" disabled={busy} onClick={runAll}>{busy ? "Running…" : "Run all tests ▶"}</button>
        <button className="btn" onClick={() => edit(z => { z.extra.push({ in: "", exp: "" }); })}>Add my own test</button>
        {res && <>
          <div className="pc-meter" role="img" aria-label={`${pass} of ${rows.length} passed`}><span className={pass === rows.length ? "good" : ""} style={{ width: (pass / rows.length * 100) + "%" }} /></div>
          <span className={"pc-summary" + (pass === rows.length ? " good" : "")}>{pass} of {rows.length} passed</span>
        </>}
      </div>
      <Hints {...hintProps(sc, s, upd, "test")} />
      <div className="pc-field">
        <label htmlFor="reflect">What did your tests find?</label>
        <small>Did any test fail the first time? What did you change in the plan or the code to fix it?</small>
        <textarea id="reflect" rows="3" value={s.reflect} onChange={e => { const v = e.target.value; upd(x => { x.reflect = v; }); }} />
      </div>
    </Step>
  );
}

/* ---------- hand in ---------- */
function HandIn({ sc, s, name }) {
  const [text, setText] = useState(null), [msg, setMsg] = useState("");
  const box = useRef(null);
  const copy = async () => {
    const t = workText(sc, s, name);
    setText(t);
    try { await navigator.clipboard.writeText(t); setMsg("Copied. Paste it into the LMS or Word."); }
    catch (e) { setMsg("Your work is selected below. Press Ctrl+C (or Cmd+C) to copy it."); setTimeout(() => { if (box.current) { box.current.focus(); box.current.select(); } }, 0); }
  };
  return (
    <section className="act" aria-labelledby="h-hand">
      <div className="act-head"><span className="act-tag">Hand in</span><h3 id="h-hand">Copy your work</h3></div>
      <p className="brief">Copies your answers for all five steps of this scenario as text. Paste it into the LMS or a Word document. Your work is also kept in this browser, so you can close the page and come back.</p>
      <div className="pc-row"><button className="btn primary" onClick={copy}>Copy my work</button>{msg && <span key={msg} className="pc-toast pc-fade">{msg}</span>}</div>
      {text !== null && <textarea ref={box} className="pc-copy pc-fade" readOnly aria-label="Your work as text" value={text} />}
    </section>
  );
}

function Note() {
  return (
    <details className="pc-note-box">
      <summary>Note</summary>
      <div className="tn">
        <p>Each scenario takes students through the same five steps, in order. The page saves work in the student's own browser only. Students hand in with <b>Copy my work</b>.</p>
        <ol>
          <li><b>Understand</b>: inputs, processing, outputs (an IPO table).</li>
          <li><b>Pseudocode</b>: written in the conventions from the Flowcharts &amp; Pseudocode slides. The checklist checks layout and that every result in the brief is covered, not the exact wording.</li>
          <li><b>Flowchart</b>: built from the pseudocode. Students pick each shape, so choosing the right symbol is part of the task.</li>
          <li><b>Code</b>: micro:bit Python, run in the page with typed inputs.</li>
          <li><b>Test</b>: students predict expected results from the brief before running. Boundary and invalid values are included. If a prediction disagrees with the brief, the row says so without giving the answer.</li>
        </ol>
        <p>Each step has 3 or 4 hints that open one at a time, from a gentle nudge to most of the answer. Students can use them at any point. The copied work records how many hints were used on each step.</p>
        <p>Suggested use: Cinema tickets as a guided example (about 40 min), Canteen till in pairs, PIN locker on their own. Model answers only open after a student has written something for that step. Students can still open them, so ask for the copied work rather than marking the ticks.</p>
        <p>Extension: ask students to change the brief (a new price band, 5 PIN tries) and update all four plans, then re-run the tests.</p>
      </div>
    </details>
  );
}
