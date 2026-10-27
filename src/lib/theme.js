/* The colour theme, shared by every page: "system" follows the computer's setting, "light" and
   "dark" set data-theme on <html>, which the dark-mode blocks in each stylesheet already read.
   The choice is saved under one key, so it carries across the home page and every lab.
   Each page's <head> also applies the saved theme before the page draws, so it doesn't flash. */
export const THEME_KEY = "ictprg302-theme";
export const MODES = ["system", "light", "dark"];
export const MODE_LABEL = { system: "System", light: "Light", dark: "Dark" };
export const MODE_ICON = { system: "◐", light: "☀", dark: "☾" };

export function getTheme() {
  try { const t = localStorage.getItem(THEME_KEY); return MODES.includes(t) ? t : "system"; } catch (e) { return "system"; }
}
export function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === "light" || mode === "dark") root.dataset.theme = mode;
  else delete root.dataset.theme;
}
export function setTheme(mode) {
  try { if (mode === "system") localStorage.removeItem(THEME_KEY); else localStorage.setItem(THEME_KEY, mode); } catch (e) { /* storage unavailable */ }
  applyTheme(mode);
}
export const nextTheme = mode => MODES[(MODES.indexOf(mode) + 1) % MODES.length];
export const themeTitle = mode => `Colour theme: ${MODE_LABEL[mode]}. Click for ${MODE_LABEL[nextTheme(mode)]}.`;
