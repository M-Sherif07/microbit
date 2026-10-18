import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { hl, psHl } from "../lib/highlight.js";
import { explainPs, explainPy } from "../lib/explain.js";

/* One tooltip for the whole page, explaining a line of code.
   Lines call tip.show(text, element) on hover or focus and tip.hide() when the pointer leaves.
   On a touch screen, tapping a line shows its tooltip and tapping anywhere else hides it. */
const TipContext = createContext({ show() {}, hide() {} });
export const useTip = () => useContext(TipContext);

export function TipProvider({ children }) {
  const [tip, setTip] = useState(null); // { text, rect, line, place, keep }
  const box = useRef(null);
  const [pos, setPos] = useState(null);
  // where: the element to point at, a rectangle ({ left, top, right, bottom }), or a function giving one.
  // keep: opened from the keyboard, so scrolling moves the tooltip with its line instead of closing it.
  const show = useCallback((text, where, line, keep = false) => {
    if (!text) return;
    const place = where.getBoundingClientRect ? () => where.getBoundingClientRect() : typeof where === "function" ? where : () => where;
    setTip({ text, rect: place(), line, place, keep, el: where.getBoundingClientRect ? where : null });
  }, []);
  const hide = useCallback(() => setTip(null), []);
  const api = useMemo(() => ({ show, hide }), [show, hide]);

  // Place it under the line (or above, if there's no room), kept inside the window
  useLayoutEffect(() => {
    if (!tip || !box.current) { setPos(null); return; }
    const w = box.current.offsetWidth, h = box.current.offsetHeight, r = tip.rect, gap = 6;
    const left = Math.max(8, Math.min(r.left + 24, window.innerWidth - w - 8));
    const below = r.bottom + gap + h < window.innerHeight - 8;
    setPos({ left, top: below ? r.bottom + gap : r.top - gap - h, below, arrow: Math.max(12, Math.min(r.left + 40 - left, w - 20)) });
  }, [tip]);

  // Scrolling moves the line away from the tooltip: close it, or (keyboard) move it with the line. Esc closes it too.
  useEffect(() => {
    if (!tip) return;
    // (A line the page has redrawn is gone, so its tooltip closes rather than jumping to the corner.)
    const close = () => setTip(t => (t && t.keep && (!t.el || t.el.isConnected) ? { ...t, rect: t.place() } : null));
    const key = e => { if (e.key === "Escape") setTip(null); };
    const tap = e => { if (!e.target.closest || !e.target.closest("[data-tip]")) setTip(null); };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", tap);
    return () => {
      window.removeEventListener("scroll", close, true); window.removeEventListener("resize", close);
      document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", tap);
    };
  }, [tip]);

  return (
    <TipContext.Provider value={api}>
      {children}
      {tip && (
        <div ref={box} id="code-tip" className={"code-tip" + (pos && !pos.below ? " above" : "")} role="tooltip"
          style={pos ? { left: pos.left, top: pos.top, "--arrow": pos.arrow + "px" } : { left: -9999, top: 0 }}>
          {tip.line && <span className="code-tip-line">Line {tip.line}</span>}
          {tip.text}
        </div>
      )}
    </TipContext.Provider>
  );
}

/* Props for the lines of one block of code: hover, tap or focus a line to see its tooltip.
   Keyboard: the block is a single Tab stop; ↑ ↓ move between lines, Home / End jump to the
   first / last, and the focused line's tooltip is read out as its description.
   options: keyboard (false inside a button, which can't hold focusable lines) · number (show
   "Line N" in the tooltip) · skip(i) (no tooltip or focus, e.g. a fill-in-the-blank line).
   lineProps(i, { onKeyDown, label }) adds a line's own key handler (Enter to pick, say).
   lineProps.show(i, element) shows line i's tooltip at another element (a dropdown for that line, say). */
export function useCodeLines(lines, isPs, { keyboard = true, number = true, skip } = {}) {
  const tip = useTip();
  const key = lines.join("\n");
  const texts = useMemo(() => lines.map((_, i) => (skip && skip(i) ? null : (isPs ? explainPs : explainPy)(lines, i))), [key, isPs]);
  const stops = lines.map((l, i) => keyboard && !!l.trim() && !(skip && skip(i)));
  const [active, setActive] = useState(-1);
  const refs = useRef([]);
  const first = stops.indexOf(true), last = stops.lastIndexOf(true);
  const cur = stops[active] ? active : first;
  const step = (i, d) => { for (let j = i + d; j >= 0 && j < lines.length; j += d) if (stops[j]) return j; return i; };

  const lineProps = (i, extra = {}) => {
    const text = texts[i], p = {};
    const show = (el, keep) => { if (text) tip.show(text, el, number ? i + 1 : null, keep); };
    if (text) Object.assign(p, {
      "data-tip": "",
      onPointerEnter: e => { if (e.pointerType === "mouse") show(e.currentTarget); },
      onPointerLeave: e => { if (e.pointerType === "mouse") tip.hide(); },
      onPointerUp: e => { if (e.pointerType !== "mouse") show(e.currentTarget); }
    });
    if (stops[i]) Object.assign(p, {
      ref: el => { refs.current[i] = el; },
      tabIndex: i === cur ? 0 : -1,
      "aria-label": extra.label || `Line ${i + 1}: ${lines[i].trim()}`,
      onFocus: e => {
        setActive(i);
        if (text) { e.currentTarget.setAttribute("aria-describedby", "code-tip"); show(e.currentTarget, true); }
      },
      onBlur: e => { e.currentTarget.removeAttribute("aria-describedby"); tip.hide(); },
      onKeyDown: e => {
        const to = e.key === "ArrowDown" ? step(i, 1) : e.key === "ArrowUp" ? step(i, -1) : e.key === "Home" ? first : e.key === "End" ? last : null;
        if (to !== null) { e.preventDefault(); if (refs.current[to]) refs.current[to].focus(); return; }
        if (extra.onKeyDown) extra.onKeyDown(e);
      }
    });
    return p;
  };
  lineProps.show = (i, el) => { if (texts[i]) { tip.show(texts[i], el, number ? i + 1 : null, true); return true; } return false; };
  return lineProps;
}

// The hint screen readers hear when they reach a block of code
export const CODE_HINT = "Code. Use the up and down arrow keys to move between lines; each line's explanation is read out.";

// A <pre> of code (quiz questions, code options, challenge cards) where every line has a tooltip.
// keyboard={false} inside a button, where the lines can't take focus.
export function CodeBlock({ code, ps, keyboard = true }) {
  const lines = Array.isArray(code) ? code : code.split("\n");
  const lineProps = useCodeLines(lines, ps, { keyboard, number: false });
  const colour = ps ? psHl : hl;
  return (
    <pre {...(keyboard ? { role: "group", "aria-label": CODE_HINT } : {})}><code>
      {lines.map((l, i) => (
        <span key={i} className="tip-line" {...lineProps(i)} dangerouslySetInnerHTML={{ __html: colour(l) || " " }} />
      ))}
    </code></pre>
  );
}
