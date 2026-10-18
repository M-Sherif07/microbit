import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { hl, psHl } from "../lib/highlight.js";
import { runner } from "../lib/microbit.js";
import { CODE_HINT, useCodeLines } from "./Tooltip.jsx";

/* ---------- hooks ---------- */

// One cancellable timer per activity. R.start() gives { sleep, live }; R.stop() cancels every pending sleep.
export function useRunner() {
  const ref = useRef(null);
  if (!ref.current) ref.current = runner();
  useEffect(() => () => ref.current.stop(), []);
  return ref.current;
}

// Round-based activities: which round is showing, which are solved, and finishing when all are.
export function useRounds(count, onDone) {
  const [r, setR] = useState(0);
  const [solved, setSolved] = useState(() => new Set());
  const solve = useCallback(k => setSolved(prev => (prev.has(k) ? prev : new Set(prev).add(k))), []);
  useEffect(() => { if (solved.size === count) onDone(); }, [solved, count, onDone]);
  return { r, setR, solved, solve, last: r === count - 1 };
}

// The serial pane: text lines, error lines in red, and grey notes that explain a step but aren't output. Keeps the last MAX_SERIAL lines, so a program
// that prints forever doesn't slow the page down.
const MAX_SERIAL = 200;
const keepLast = l => (l.length > MAX_SERIAL ? l.slice(l.length - MAX_SERIAL) : l);
export function useSerial() {
  const [lines, setLines] = useState([]);
  const write = useCallback(text => setLines(l => keepLast([...l, { text }])), []);
  const writeErr = useCallback(text => setLines(l => keepLast([...l, { text, err: true }])), []);
  const writeNote = useCallback(text => setLines(l => keepLast([...l, { text, note: true }])), []);
  const clear = useCallback(() => setLines([]), []);
  return { lines, write, writeErr, writeNote, clear };
}

// Run cb when the topic holding this activity is hidden (the original pages reset a running activity then).
export function useOnHide(visible, cb) {
  const ref = useRef(cb);
  ref.current = cb;
  const was = useRef(visible);
  useEffect(() => {
    if (was.current && !visible) ref.current();
    was.current = visible;
  }, [visible]);
}

export function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export const cx = (...c) => c.filter(Boolean).join(" ");

/* ---------- pieces ---------- */

export function Activity({ act, done, children }) {
  return (
    <article className="act" data-act={act.id}>
      <header className="act-head">
        <p className="act-tag">{act.tag}</p>
        <h3>{act.title}</h3>
        <span className={cx("status", done && "done")}>{done ? "Done" : "To do"}</span>
      </header>
      <p className="brief">{act.brief}</p>
      {children}
    </article>
  );
}

export function RoundPills({ label, count, cur, solved, onPick }) {
  return (
    <div className="rounds">
      <span className="lbl">{label}</span>
      {Array.from({ length: count }, (_, k) => (
        <button key={k} className={cx("pill", solved.has(k) && "ok")} type="button" aria-pressed={k === cur} onClick={() => onPick(k)}>{k + 1}</button>
      ))}
    </div>
  );
}

// fb is null or { kind: "ok" | "bad" | "info", html }
export function Feedback({ fb }) {
  return <p className={cx("feedback", fb && fb.kind)} aria-live="polite" dangerouslySetInnerHTML={{ __html: fb ? fb.html : "" }} />;
}

export function Serial({ lines, className = "serial" }) {
  const ref = useRef(null);
  useLayoutEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines]);
  return (
    <pre className={className} ref={ref}>
      {lines.map((l, i) => (l.err || l.note ? <span key={i}><span className={l.err ? "err" : "note"}>{l.text}</span>{"\n"}</span> : <span key={i}>{l.text + "\n"}</span>))}
    </pre>
  );
}

// changed: the name of the variable that just changed; tick restarts its highlight
export function Vars({ vars, changed, tick }) {
  const names = Object.keys(vars);
  if (!names.length) return <div className="vars"><span className="empty">No variables yet</span></div>;
  return (
    <div className="vars">
      {names.map(n => (
        <div key={n === changed ? `${n}-${tick}` : n} className={cx("var", n === changed && "changed")}><b>{n}</b><span>{String(vars[n])}</span></div>
      ))}
    </div>
  );
}

/* Numbered, highlighted code.
   cur: line being run · conds: { line: true/false } tags · tags: { line: [{ cls, text }] }
   lineClass: { line: "wrongpick" } · onPick(n): makes non-blank lines clickable · flash: { line, key }
   Keyboard: the code is one Tab stop; ↑ ↓ move between lines (see useCodeLines), Enter or Space picks. */
export function CodeView({ lines, highlight = hl, cur = 0, conds, tags, lineClass, onPick, flash }) {
  const lineProps = useCodeLines(lines, highlight === psHl);
  return (
    <ol className="code" aria-label={CODE_HINT + (onPick ? " Press Enter to choose a line." : "")}>
      {lines.map((ln, i) => {
        const n = i + 1, pick = onPick && ln.trim();
        const flashing = flash && flash.line === n;
        return (
          <li
            key={flashing ? `${i}-f${flash.key}` : i}
            className={cx(cur === n && "cur", flashing && "flash", lineClass && lineClass[n])}
            {...lineProps(i, pick ? { onKeyDown: e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(n); } } } : {})}
            {...(pick ? { role: "button", onClick: () => onPick(n) } : {})}
          >
            <span className="ln">{n}</span>
            <code dangerouslySetInnerHTML={{ __html: highlight(ln) || " " }} />
            {conds && n in conds && <span className={"tag ctag " + (conds[n] ? "true" : "false")}>{conds[n] ? "True" : "False"}</span>}
            {tags && (tags[n] || []).map((t, j) => <span key={j} className={"tag " + t.cls}>{t.text}</span>)}
          </li>
        );
      })}
    </ol>
  );
}

export function CodeBox({ title = "main.py", note, pickable, children, ...view }) {
  return (
    <div className={cx("codebox", pickable && "pickable")}>
      <div className="codebar"><span>{title}</span>{note != null && <span>{note}</span>}</div>
      <div className="codescroll">{children || <CodeView {...view} />}</div>
    </div>
  );
}

export function Panel({ title, className, children }) {
  return <div className={cx("panel", className)}>{title && <p className="panel-title">{title}</p>}{children}</div>;
}

export function NextButton({ show, label, onClick }) {
  return <button className="btn" type="button" hidden={!show} onClick={onClick}>{label}</button>;
}

// A row of answer buttons that lock after an answer: marks maps option index → "right" | "wrong".
export function OptionRow({ opts, marks = {}, disabled, onPick, className = "optrow", html }) {
  return (
    <div className={className}>
      {opts.map((o, i) => (
        <button key={i} className={cx("btn", marks[i])} type="button" disabled={typeof disabled === "function" ? disabled(i) : disabled} onClick={() => onPick(i)}
          {...(html ? { dangerouslySetInnerHTML: { __html: html(o) } } : { children: o })} />
      ))}
    </div>
  );
}
