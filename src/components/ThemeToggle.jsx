import { useEffect, useState } from "react";
import { applyTheme, getTheme, MODE_ICON, MODE_LABEL, nextTheme, setTheme, THEME_KEY, themeTitle } from "../lib/theme.js";

// One button that cycles System → Light → Dark. Another open tab changing the theme updates this one too.
export default function ThemeToggle() {
  const [mode, setMode] = useState(getTheme);
  useEffect(() => {
    const onStorage = e => { if (e.key === THEME_KEY || !e.key) { const m = getTheme(); applyTheme(m); setMode(m); } };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const change = () => { const m = nextTheme(mode); setTheme(m); setMode(m); };
  return (
    <button type="button" className="theme-btn" onClick={change} title={themeTitle(mode)} aria-label={themeTitle(mode)}>
      <span aria-hidden="true">{MODE_ICON[mode]}</span> {MODE_LABEL[mode]}
    </button>
  );
}
