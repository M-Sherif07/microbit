import { useState } from "react";
import { CodeBlock } from "./Tooltip.jsx";
import { cx } from "./ui.jsx";

function CopyButton({ text, label }) {
  const [shown, setShown] = useState(label);
  function copy() {
    const ok = () => { setShown("Copied"); setTimeout(() => setShown(label), 1600); };
    const fail = () => { setShown("Copy failed: select the code"); setTimeout(() => setShown(label), 2400); };
    try { navigator.clipboard.writeText(text).then(ok, fail); } catch (e) { fail(); }
  }
  return <button className="btn small" type="button" onClick={copy}>{shown}</button>;
}

function Challenge({ c, id, n, done, onToggle, passed, onTry }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={cx("ch", done && "done")}>
      <div className="ch-head"><h4>{c.title}</h4><span className={"lvl " + c.level.toLowerCase()}>{c.level}</span><span className="ch-num">Challenge {n}</span></div>
      {passed && <p className="ch-passed">✓ Passed in the simulator</p>}
      <ol>{c.steps.map((t, i) => <li key={i}>{t}</li>)}</ol>
      <CodeBlock code={c.starter} />
      <div className="controls">
        {onTry && <button className="btn small primary" type="button" onClick={onTry}>Try it here ↓</button>}
        <CopyButton text={c.starter} label="Copy starter code" />
        <button className="btn small" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Hide solution" : "Show a solution"}</button>
      </div>
      <div hidden={!open}>
        <p className="sol-label">One possible solution</p>
        <CodeBlock code={c.solution} />
        <div className="controls"><CopyButton text={c.solution} label="Copy solution" /></div>
      </div>
      <p className="tip"><strong>Tip:</strong> {c.tip}</p>
      <label className="ch-done" htmlFor={"ch-" + id}>
        <input type="checkbox" id={"ch-" + id} checked={done} onChange={e => onToggle(id, e.target.checked)} /> It works on my micro:bit
      </label>
    </article>
  );
}

// "On a real micro:bit" section for one topic. done is a Set of "key-index" ids shared by the whole lab.
// passed: ids that passed in the code editor · onTry(index) opens a challenge in it
export default function Challenges({ real, list, done, onToggle, passed, onTry, children }) {
  const n = list.filter((_, i) => done.has(`${real.key}-${i}`)).length;
  const hid = "real-" + real.key;
  return (
    <section className="real" aria-labelledby={hid}>
      <div className="real-head">
        <div>
          <p className="eyebrow">On a real micro:bit</p>
          <h3 id={hid}>{real.title}</h3>
          <p className="real-intro">{real.intro}</p>
        </div>
        <div className="real-side">
          <a className="btn primary" href="https://python.microbit.org/v/3" target="_blank" rel="noopener">Open the editor ↗</a>
          <span className="real-count">{n}/{list.length} working on a micro:bit</span>
        </div>
      </div>
      <div className="challenges">
        {list.map((c, i) => <Challenge key={i} c={c} id={`${real.key}-${i}`} n={i + 1} done={done.has(`${real.key}-${i}`)} onToggle={onToggle}
          passed={passed && passed.has(`${real.key}-${i}`)} onTry={onTry && (() => onTry(i))} />)}
      </div>
      {children}
    </section>
  );
}
