/* Bring the home page data and the not-yet-ported labs over from the original course.

Usage (from this folder):
    node tools/sync-home.mjs

1. Copies the lab list (titles, outcomes, slides, topics, activities) that build_course.py
   embedded in ../ICTPRG302-Python-Labs/index.html into src/home/labs.json.
2. Copies every original lab that has no React version yet (no src/labs/<folder>) into
   public/<folder>/, so the home page links work and Vite ships them in dist/. Each copy is
   changed to match the React labs: the same code font (no ligatures), no list of key code
   lines in the topic intros, hover tooltips on every line of code (src/original/code-tips.js),
   and the same ways forward as the React labs: Next on every round but the last, and a
   "Next topic" bar at the end of each topic (src/original/lab-nav.js). Both are built into
   public/shared/.
   A lab that has been ported is removed from public/.

Run it again after rebuilding the original course, or after porting another lab.
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.resolve(ROOT, "../ICTPRG302-Python-Labs");

const home = fs.readFileSync(path.join(SRC, "index.html"), "utf8");
const m = home.match(/\n\s*const LABS = (\[.*\]);\n/);
if (!m) { console.error("Couldn't find `const LABS = [...]` in the original index.html. Run build_course.py there first."); process.exit(1); }
const labs = JSON.parse(m[1]);

fs.mkdirSync(path.join(ROOT, "src", "home"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src", "home", "labs.json"), JSON.stringify(labs, null, 2) + "\n");
console.log(`Wrote src/home/labs.json: ${labs.length} labs`);

// Make an original page match the React labs (see 2. above)
function matchReact(html) {
  if (!/<\/body>/.test(html)) throw new Error("no </body> to add the tooltip script before");
  return html
    .replace(/JetBrains\+Mono/g, "IBM+Plex+Mono").replace(/"JetBrains Mono"/g, '"IBM Plex Mono"')
    .replace("</style>", '* { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }\n</style>')
    .replace(/\n?\s*<ul class="keys">[\s\S]*?<\/ul>/g, "")
    .replace("</body>", '<script src="../shared/code-tips.js" defer></script>\n<script src="../shared/lab-nav.js" defer></script>\n</body>');
}

await build({
  entryPoints: { "code-tips": path.join(ROOT, "src", "original", "code-tips.js"), "lab-nav": path.join(ROOT, "src", "original", "lab-nav.js") },
  outdir: path.join(ROOT, "public", "shared"),
  bundle: true, format: "iife", target: "es2019", minify: true, legalComments: "none",
  banner: { js: "/* Built by tools/sync-home.mjs from src/original/. Don't edit this file. */" },
  logLevel: "warning"
});
console.log("Built public/shared/code-tips.js and lab-nav.js (tooltips and Next buttons for the original labs)");

for (const lab of labs) {
  const dest = path.join(ROOT, "public", lab.folder);
  if (fs.existsSync(path.join(ROOT, "src", "labs", lab.folder))) {
    if (fs.existsSync(dest)) { fs.rmSync(dest, { recursive: true }); console.log(`react   ${lab.folder} (removed the old copy from public/)`); }
    else console.log(`react   ${lab.folder}`);
    continue;
  }
  fs.mkdirSync(dest, { recursive: true });
  const html = fs.readFileSync(path.join(SRC, lab.folder, "index.html"), "utf8");
  const removed = (html.match(/<ul class="keys">/g) || []).length;
  fs.writeFileSync(path.join(dest, "index.html"), matchReact(html));
  console.log(`copied  ${lab.folder} (original page, not ported yet; ${removed} key lists removed, tooltips added)`);
}
