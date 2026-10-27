/* The colour theme button on the original (not yet React) lab pages, to match the React labs.

tools/sync-home.mjs bundles this into public/shared/theme.js and adds it to each copied lab.
The saved theme is already applied by a line in each page's <head>; this adds the button
to the top bar, after the topic tabs. */
import { applyTheme, getTheme, MODE_ICON, MODE_LABEL, nextTheme, setTheme, THEME_KEY, themeTitle } from "../lib/theme.js";

const CSS = `
.theme-btn { font: 600 .8rem var(--f-mono); color: var(--ink); background: var(--surface); border: 1px solid var(--line); border-radius: 999px; padding: 6px 12px; cursor: pointer; white-space: nowrap; }
.theme-btn:hover { border-color: var(--accent); }
@media print { .theme-btn { display: none !important; } }
`;

function start() {
  const bar = document.querySelector(".top-inner");
  if (!bar || bar.querySelector(".theme-btn")) return;
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.append(style);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-btn";
  const show = mode => {
    btn.textContent = `${MODE_ICON[mode]} ${MODE_LABEL[mode]}`;
    btn.title = themeTitle(mode);
    btn.setAttribute("aria-label", themeTitle(mode));
  };
  btn.addEventListener("click", () => { const m = nextTheme(getTheme()); setTheme(m); show(m); });
  window.addEventListener("storage", e => { if (e.key === THEME_KEY || !e.key) { const m = getTheme(); applyTheme(m); show(m); } });
  show(getTheme());
  bar.append(btn);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
else start();
