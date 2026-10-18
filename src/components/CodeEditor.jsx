import { useLayoutEffect, useRef, useState } from "react";
import { hl } from "../lib/highlight.js";
import { explainPy } from "../lib/explain.js";
import { useTip } from "./Tooltip.jsx";
import { cx } from "./ui.jsx";

const IND = "    ";

/* A small Python editor: a transparent textarea over highlighted code, with line numbers.
   Tab / Shift+Tab indent and dedent, Enter keeps the indent (and adds one after a colon),
   Backspace in leading spaces removes a whole indent. Esc lets Tab move focus out again.
   Hovering a line shows what it does (the same tooltip as the activities), and so does moving the
   cursor onto a line with ↑ ↓ Page Up / Page Down; typing hides it.
   cur: the line being run · errLine: the line with an error */
export default function CodeEditor({ value, onChange, readOnly, cur = 0, errLine = 0, label = "Python code" }) {
  const ta = useRef(null);
  const sel = useRef(null);   // selection to restore after an edit
  const tabOut = useRef(false);
  const lines = value.split("\n");
  const tip = useTip();
  const [hover, setHover] = useState(-1);

  // Which line is under the pointer, from its height in the textarea
  function onPointerMove(e) {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget, cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const lh = parseFloat(cs.lineHeight), top = r.top + parseFloat(cs.paddingTop);
    const i = Math.floor((e.clientY - top) / lh);
    if (i === hover) return;
    const text = i >= 0 && i < lines.length ? explainPy(lines, i) : null;
    if (!text) { setHover(-1); tip.hide(); return; }
    setHover(i);
    tip.show(text, { left: r.left, right: r.right, top: top + i * lh, bottom: top + (i + 1) * lh }, i + 1);
  }
  function stopHover() {
    if (ta.current) ta.current.removeAttribute("aria-describedby");
    if (hover > -1) { setHover(-1); tip.hide(); }
  }
  // Keyboard: after moving the cursor up or down, explain the line it's now on
  function onKeyUp(e) {
    if (!/^(ArrowUp|ArrowDown|PageUp|PageDown)$/.test(e.key)) return;
    const el = e.currentTarget, i = el.value.slice(0, el.selectionStart).split("\n").length - 1;
    const text = explainPy(lines, i);
    if (!text) return;
    const place = () => {
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      const lh = parseFloat(cs.lineHeight), top = r.top + parseFloat(cs.paddingTop);
      return { left: r.left, right: r.right, top: top + i * lh, bottom: top + (i + 1) * lh };
    };
    setHover(i);
    tip.show(text, place, i + 1, true);
    el.setAttribute("aria-describedby", "code-tip");
  }

  useLayoutEffect(() => {
    if (sel.current && ta.current) { ta.current.setSelectionRange(sel.current[0], sel.current[1]); sel.current = null; }
  });

  function edit(text, start, end = start) { sel.current = [start, end]; onChange(text); }

  function onKeyDown(e) {
    stopHover();
    if (readOnly || e.nativeEvent.isComposing) return;
    const el = e.currentTarget, { selectionStart: s, selectionEnd: t } = el, v = el.value;
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    if (e.key === "Escape") { tabOut.current = true; return; }
    if (e.key === "Tab" && !tabOut.current) {
      e.preventDefault();
      const blockEnd = v.indexOf("\n", t - (t > s && v[t - 1] === "\n" ? 1 : 0));
      const end = blockEnd < 0 ? v.length : blockEnd;
      const block = v.slice(lineStart, end).split("\n");
      if (e.shiftKey) {
        const removed = block.map(l => l.match(/^ {0,4}/)[0].length);
        const out = block.map((l, i) => l.slice(removed[i])).join("\n");
        edit(v.slice(0, lineStart) + out + v.slice(end), Math.max(lineStart, s - removed[0]), t - removed.reduce((a, b) => a + b, 0));
      } else if (s === t) {
        edit(v.slice(0, s) + IND + v.slice(t), s + IND.length);
      } else {
        const out = block.map(l => IND + l).join("\n");
        edit(v.slice(0, lineStart) + out + v.slice(end), s + IND.length, t + IND.length * block.length);
      }
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      const line = v.slice(lineStart, s);
      let indent = line.match(/^ */)[0];
      if (/:\s*(#.*)?$/.test(line)) indent += IND;
      edit(v.slice(0, s) + "\n" + indent + v.slice(t), s + 1 + indent.length);
      return;
    }
    if (e.key === "Backspace" && s === t && s > lineStart) {
      const before = v.slice(lineStart, s);
      if (/^ +$/.test(before)) {
        e.preventDefault();
        const n = before.length % 4 || 4;
        edit(v.slice(0, s - n) + v.slice(t), s - n);
      }
    }
  }

  const width = Math.max(...lines.map(l => l.length), 20) + 2;
  return (
    <div className="ed">
      <ol className="ed-gutter" aria-hidden="true">
        {lines.map((_, i) => <li key={i} className={cx(cur === i + 1 && "cur", errLine === i + 1 && "err")}>{i + 1}</li>)}
      </ol>
      <div className="ed-stack" style={{ "--cols": width + "ch", "--rows": lines.length }}>
        <pre className="ed-hl" aria-hidden="true">
          {lines.map((l, i) => (
            <span key={i} className={cx("ed-line", cur === i + 1 && "cur", errLine === i + 1 && "err", hover === i && "hover")} dangerouslySetInnerHTML={{ __html: (hl(l) || "") + "\n" }} />
          ))}
        </pre>
        <textarea ref={ta} value={value} readOnly={readOnly} spellCheck={false} autoCapitalize="off" autoComplete="off" autoCorrect="off" wrap="off"
          aria-label={label + (readOnly ? " (running)" : ". Tab indents; press Esc then Tab to leave the editor.")}
          onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown}
          onFocus={() => { tabOut.current = false; }}
          onPointerMove={onPointerMove} onPointerLeave={stopHover} onKeyUp={onKeyUp} onBlur={stopHover} />
      </div>
    </div>
  );
}
