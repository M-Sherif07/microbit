/* Hover tooltips for the original (not yet React) lab pages in public/.

tools/sync-home.mjs bundles this file into public/shared/code-tips.js and adds it to each copied
lab. It explains every line of code the page shows, with the same words as the React labs
(src/lib/explain.js), and works with code the page draws later because it listens on the
whole document instead of on each line:
  ol.code li   numbered code and pseudocode (activities, flowchart code, bug hunts)
  pre          quiz questions, code options, challenge cards (the line under the pointer)
  .pline       Parsons puzzle lines
  .ps-line     pseudocode rows in "Translate it"
Fill-in-the-blank lines and the fix options in bug hunts get no tooltip, so answers stay hidden.

Keyboard: each block of code is one Tab stop. In numbered code, ↑ ↓ move between lines (Home /
End for the first and last); in a <pre>, ↑ ↓ step through its lines. The current line's tooltip
shows and is read out by screen readers. Focusing a "Translate it" dropdown explains its row.
*/
import { explainPs, explainPy } from "../lib/explain.js";

const CSS = `
/* Never join characters into one symbol (>= into ≥ and so on) */
* { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }
/* The intro's list of key code lines was removed: the tooltips explain each line instead */
.intro { grid-template-columns: minmax(0, 1fr) !important; }
.keys { display: none !important; }
ol.code li[data-tip-ok]:hover { background: var(--accent-soft); cursor: help; }
ol.code li.cur[data-tip-ok]:hover { background: var(--hl); }
.pickable ol.code li[data-tip-ok]:hover, .pline[data-tip-ok]:hover { cursor: pointer; }
.ct-band { position: fixed; z-index: 49; pointer-events: none; background: var(--accent-soft); opacity: .55; border-radius: 4px; }
.code-tip {
  position: fixed; z-index: 50; max-width: min(360px, calc(100vw - 16px)); pointer-events: none;
  background: var(--ink); color: var(--bg); border-radius: 10px; padding: 9px 12px;
  font: 14px/1.45 var(--f-body); box-shadow: 0 6px 20px rgba(0, 0, 0, .25);
  animation: ct-in 120ms ease-out;
}
.code-tip::before { content: ""; position: absolute; left: var(--arrow, 16px); top: -6px; border: 6px solid transparent; border-top: 0; border-bottom-color: var(--ink); }
.code-tip.above::before { top: auto; bottom: -6px; border: 6px solid transparent; border-bottom: 0; border-top-color: var(--ink); }
.code-tip-line { display: block; font: 600 .7rem var(--f-mono); letter-spacing: .06em; text-transform: uppercase; opacity: .7; margin-bottom: 2px; }
@keyframes ct-in { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .code-tip { animation: none; } }
@media print { .code-tip, .ct-band { display: none !important; } }
`;

const PS_START = /^\s*(SET|IF|ELSE|END|REPEAT|FOR|WHILE|DISPLAY|SHOW|SCROLL|PRINT|WAIT|CLEAR|INPUT|ADD|SUBTRACT|CALL|PLAY|STOP|OPEN|WRITE|FUNCTION|RETURN|REMOVE)\b/;
// Pseudocode if most lines start with a pseudocode keyword
const looksPs = lines => { const real = lines.filter(l => l.trim()); return real.length > 0 && real.filter(l => PS_START.test(l)).length * 2 >= real.length; };
const explain = (lines, i) => (looksPs(lines) ? explainPs : explainPy)(lines, i);

let tipEl = null, band = null, current = null;
// While a tooltip belongs to the focused line, this re-shows it (scrolling moves it with the line)
let kbShow = null;

function hide() {
  current = null;
  kbShow = null;
  if (tipEl) { tipEl.remove(); tipEl = null; }
  if (band) { band.remove(); band = null; }
}

// rect: where the line is on screen · line: its number, or null for one-line code
function show(key, text, rect, line, bandRect) {
  if (current === key) return;
  hide();
  current = key;
  tipEl = document.createElement("div");
  tipEl.className = "code-tip";
  tipEl.setAttribute("role", "tooltip");
  tipEl.id = "code-tip";
  if (line) { const l = document.createElement("span"); l.className = "code-tip-line"; l.textContent = "Line " + line; tipEl.append(l); }
  tipEl.append(text);
  tipEl.style.left = "-9999px"; tipEl.style.top = "0";
  document.body.append(tipEl);
  const w = tipEl.offsetWidth, h = tipEl.offsetHeight, gap = 6;
  const left = Math.max(8, Math.min(rect.left + 24, window.innerWidth - w - 8));
  const below = rect.bottom + gap + h < window.innerHeight - 8;
  tipEl.style.left = left + "px";
  tipEl.style.top = (below ? rect.bottom + gap : rect.top - gap - h) + "px";
  tipEl.style.setProperty("--arrow", Math.max(12, Math.min(rect.left + 40 - left, w - 20)) + "px");
  if (!below) tipEl.classList.add("above");
  if (bandRect) {
    band = document.createElement("div");
    band.className = "ct-band";
    Object.assign(band.style, { left: bandRect.left + "px", top: bandRect.top + "px", width: bandRect.width + "px", height: bandRect.height + "px" });
    document.body.append(band);
  }
}

// What is under the pointer: { key, text, rect, line, bandRect } or null
function findTip(target, x, y) {
  if (!(target instanceof Element)) return null;
  // Numbered code
  const li = target.closest("ol.code > li");
  if (li) {
    if (li.querySelector("select")) return null; // a fill-in-the-blank line
    const ol = li.parentElement, items = [...ol.children];
    const lines = items.map(x => (x.querySelector("code") || x).textContent.replace(/ /g, " "));
    const i = items.indexOf(li), text = explain(lines, i);
    if (!text) return null;
    li.setAttribute("data-tip-ok", "");
    return { key: li, text, rect: li.getBoundingClientRect(), line: i + 1 };
  }
  // Parsons lines: explain each on its own. Their order is the puzzle (shuffled in the bank,
  // half-built in the answer), so "inside the loop on line 3" would point at the wrong line.
  const pl = target.closest(".pline");
  if (pl) {
    const text = explain([pl.textContent.trim()], 0);
    if (!text) return null;
    pl.setAttribute("data-tip-ok", "");
    return { key: pl, text, rect: pl.getBoundingClientRect(), line: null };
  }
  const psl = target.closest(".ps-line");
  if (psl) {
    const rows = [...document.querySelectorAll(".ps-line")].filter(x => x.closest("[data-rows]") === psl.closest("[data-rows]"));
    const text = explainPs(rows.map(x => x.textContent), rows.indexOf(psl));
    return text ? { key: psl, text, rect: psl.getBoundingClientRect(), line: null } : null;
  }
  // A block of code: work out which line the pointer is on
  const pre = codePre(target);
  if (pre) { const g = preGeometry(pre); return preLineTip(pre, Math.floor((y - g.top) / g.lh)); }
  return null;
}

// A <pre> that holds code (not serial output, a file's contents, or code inside a button)
function codePre(el) {
  const pre = el.closest("pre");
  return pre && !pre.matches(".serial, .fbody, [data-serial], [data-symptom], [data-log]") && !pre.closest(".print-sheet, .fixes, button") ? pre : null;
}
function preGeometry(pre) {
  const cs = getComputedStyle(pre), r = pre.getBoundingClientRect();
  const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
  return { r, lh, top: r.top + parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth) - pre.scrollTop, lines: pre.textContent.replace(/\n$/, "").split("\n") };
}
function preLineTip(pre, i) {
  const { r, lh, top, lines } = preGeometry(pre);
  if (i < 0 || i >= lines.length || !lines[i].trim()) return null;
  const text = explain(lines, i);
  if (!text) return null;
  const lineRect = { left: r.left, right: r.right, top: top + i * lh, bottom: top + (i + 1) * lh };
  return { key: pre.dataset.ctId = pre.dataset.ctId || Math.random().toString(36).slice(2), text, rect: lineRect, line: null,
    bandRect: { left: r.left + 2, top: lineRect.top, width: r.width - 4, height: lh }, keyLine: i };
}

function onPoint(e) {
  showTip(findTip(e.target, e.clientX, e.clientY));
}
function showTip(t) {
  if (!t) { hide(); return false; }
  show(t.keyLine === undefined ? t.key : t.key + ":" + t.keyLine, t.text, t.rect, t.line, t.bandRect);
  return true;
}

/* ---------- keyboard ---------- */
const HINT = "Code. Use the up and down arrow keys to move between lines; each line's explanation is read out.";
const isStop = li => !!(li.querySelector("code") || li).textContent.trim() && !li.querySelector("select");

// Give every code block one Tab stop. Runs again whenever the page draws new code.
function prepare() {
  for (const ol of document.querySelectorAll("ol.code")) {
    if (ol.closest(".fixes, button")) continue;
    const items = [...ol.children].filter(li => li.tagName === "LI");
    const stops = items.filter(isStop);
    if (!stops.length) continue;
    if (!ol.hasAttribute("aria-label")) ol.setAttribute("aria-label", HINT + (ol.closest(".pickable") ? " Press Enter to choose a line." : ""));
    const active = stops.find(li => li.hasAttribute("data-ct-active")) || stops[0];
    for (const li of items) {
      li.tabIndex = li === active ? 0 : -1;
      if (!li.hasAttribute("aria-label") && isStop(li)) li.setAttribute("aria-label", `Line ${items.indexOf(li) + 1}: ${(li.querySelector("code") || li).textContent.trim()}`);
    }
  }
  for (const pre of document.querySelectorAll("pre")) {
    if (!codePre(pre) || pre.hasAttribute("tabindex")) continue;
    pre.tabIndex = 0;
    pre.setAttribute("role", "group"); // so screen readers read its label
    pre.setAttribute("aria-label", HINT);
  }
}

function moveInList(li, key) {
  const stops = [...li.parentElement.children].filter(x => x.tagName === "LI" && isStop(x));
  const i = stops.indexOf(li);
  const to = key === "ArrowDown" ? stops[Math.min(i + 1, stops.length - 1)] : key === "ArrowUp" ? stops[Math.max(i - 1, 0)]
    : key === "Home" ? stops[0] : stops[stops.length - 1];
  if (to && to !== li) to.focus();
}

function preStep(pre, dir) {
  const { lines } = preGeometry(pre);
  let i = pre.dataset.ctLine === undefined ? -1 : +pre.dataset.ctLine;
  if (dir === 0) { i = i < 0 ? 0 : i; dir = 1; i -= 1; } // on focus: the current line, or the first
  for (let j = i + dir; j >= 0 && j < lines.length; j += dir) {
    if (lines[j].trim() && preLineTip(pre, j)) { pre.dataset.ctLine = j; return showTip(preLineTip(pre, j)); }
  }
  return false;
}

function start() {
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.append(style);
  document.querySelectorAll(".keys").forEach(k => k.remove());
  document.addEventListener("pointermove", e => { if (e.pointerType === "mouse") onPoint(e); }, { passive: true });
  document.addEventListener("pointerleave", hide);
  // Touch: tap a line to see its tooltip, tap anywhere else to close it
  document.addEventListener("pointerup", e => { if (e.pointerType !== "mouse") onPoint(e); });
  // Keyboard: a focused line (or the current line of a focused block) shows its tooltip,
  // which screen readers read as its description
  // describe(el, again): link the tooltip for screen readers, and remember how to re-show it after a scroll
  const describe = (el, again) => { if (tipEl) { el.setAttribute("aria-describedby", "code-tip"); kbShow = again; } };
  document.addEventListener("focusin", e => {
    if (!e.target.closest) return;
    const li = e.target.closest("ol.code > li, .pline");
    if (li) {
      if (li.matches("ol.code > li")) {
        for (const x of li.parentElement.children) { x.removeAttribute("data-ct-active"); x.tabIndex = -1; }
        li.setAttribute("data-ct-active", ""); li.tabIndex = 0;
      }
      const again = () => { const r = li.getBoundingClientRect(); onPoint({ target: li, clientX: r.left + 4, clientY: r.top + r.height / 2 }); };
      again();
      describe(li, again);
      return;
    }
    const pre = codePre(e.target);
    const again = () => showTip(preLineTip(pre, +pre.dataset.ctLine));
    if (pre && e.target === pre) { preStep(pre, 0); describe(pre, again); return; }
    const row = e.target.closest(".ps-row");
    if (row && e.target.matches("select") && row.querySelector(".ps-line")) {
      const lab = row.querySelector(".ps-line");
      const again = () => { const r = lab.getBoundingClientRect(); onPoint({ target: lab, clientX: r.left + 4, clientY: r.top + r.height / 2 }); };
      again();
      describe(e.target, again);
    }
  });
  document.addEventListener("keydown", e => {
    if (!/^(ArrowUp|ArrowDown|Home|End)$/.test(e.key) || !e.target.closest) return;
    if (e.target.matches("ol.code > li")) { e.preventDefault(); moveInList(e.target, e.key); return; }
    const pre = codePre(e.target);
    if (pre && e.target === pre && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      preStep(pre, e.key === "ArrowDown" ? 1 : -1);
      describe(pre, () => showTip(preLineTip(pre, +pre.dataset.ctLine)));
    }
  });
  prepare();
  // Prepare new code as soon as it's drawn. (Not on the next animation frame: those pause in a
  // background tab. prepare() only changes attributes, which this observer doesn't watch.)
  new MutationObserver(prepare).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("focusout", e => { if (e.target.removeAttribute) e.target.removeAttribute("aria-describedby"); hide(); });
  // Scrolling: a mouse tooltip closes; a keyboard one moves with its line
  // (If the page has redrawn the code and the focused line is gone, close instead.)
  const moved = () => {
    const again = kbShow, el = document.activeElement;
    if (!again || !el || el === document.body || !el.isConnected) { hide(); return; }
    current = null; again(); kbShow = again;
  };
  window.addEventListener("scroll", moved, true);
  window.addEventListener("resize", moved);
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
else start();
