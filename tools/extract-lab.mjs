/* Pull one lab's content out of the original single-file page and write it as a React data module.

Usage (from this folder):
    node tools/extract-lab.mjs loops-lab
        Reads ../ICTPRG302-Python-Labs/loops-lab/index.html and writes src/labs/loops-lab/content.js.
    node tools/extract-lab.mjs loops-lab --out some/folder
        Writes some/folder/content.js instead (for checking a lab without starting its port).

The activity data (rounds, quizzes, flowcharts, challenges) is copied as written, so it keeps
its helper calls (P_, D_, W_ ...). Topic intros and activity titles come from the page's HTML.
Run it once per lab when porting; after that, edit content.js directly.
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SRC = path.resolve(ROOT, "../ICTPRG302-Python-Labs");

const slug = process.argv[2];
if (!slug) { console.error("Usage: node tools/extract-lab.mjs <lab-folder>"); process.exit(1); }
const html = fs.readFileSync(path.join(SRC, slug, "index.html"), "utf8");

const fail = msg => { console.error(`${slug}: ${msg}`); process.exit(1); };
const unesc = s => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const text = s => unesc((s || "").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
const inner = (src, re) => { const m = src.match(re); return m ? m[1] : null; };

/* ---------- page meta ---------- */
const brand = text(inner(html, /<div class="brand"><h1>([\s\S]*?)<\/h1>/) || fail("no brand"));
const key = inner(html, /const KEY = "([^"]+)"/) || fail("no progress KEY");
const chKey = inner(html, /const CH_KEY = "([^"]+)"/);
const next = html.match(/<a class="next-lab" href="([^"]+)">([\s\S]*?)<\/a>/);
// Some labs write TOPICS with bare keys ({ selection: [...] }), so quote them before parsing (as build_course.py does)
const topicsSrc = inner(html, /const TOPICS = (\{[^\n]+\});/) || fail("no TOPICS");
const topicsOrder = JSON.parse(topicsSrc.replace(/([{,]\s*)([a-z][a-z-]*)(\s*:)/g, '$1"$2"$3'));
const psExtra = inner(html, /\n(\[[^\n]*\])\.forEach\(k => PS_KEYWORDS\.add\(k\)\);/);
const tabLabels = {};
for (const m of html.matchAll(/<button class="tab"[^>]*data-topic="([^"]+)">([^<]+)</g)) tabLabels[m[1]] = m[2].trim();

/* ---------- topics and activity headers ---------- */
const topics = [];
for (const m of html.matchAll(/<section class="topic" id="([^"]+)"[^>]*>([\s\S]*?)\n<\/section>/g)) {
  const [, id, body] = m;
  const intro = inner(body, /<div class="intro">([\s\S]*?)<\/ul>\s*<\/div>/) || fail(`no intro in ${id}`);
  const acts = [...body.matchAll(/<article class="act" data-act="([^"]+)">([\s\S]*?)<\/article>/g)].map(([, aid, a]) => {
    const act = {
      id: aid,
      tag: text(inner(a, /<p class="act-tag">([\s\S]*?)<\/p>/)),
      title: text(inner(a, /<h3>([\s\S]*?)<\/h3>/)),
      brief: text(inner(a, /<p class="brief">([\s\S]*?)<\/p>/))
    };
    const lbl = inner(a, /<span class="lbl">([^<]+)<\/span>/);
    if (lbl) act.roundLabel = lbl;
    const nxt = inner(a, /data-next[^>]*>([^<]+)<\/button>/);
    if (nxt) act.nextLabel = unesc(nxt).trim();
    return act;
  });
  const real = body.match(/<section class="real" aria-labelledby="([^"]+)">([\s\S]*?)<\/section>/);
  const topic = {
    id,
    label: tabLabels[id] || id,
    eyebrow: text(inner(intro, /<p class="eyebrow">([\s\S]*?)<\/p>/)),
    title: text(inner(intro, /<h2>([\s\S]*?)<\/h2>/)),
    lead: text(inner(intro, /<p class="lead">([\s\S]*?)<\/p>/)),
    // The original intro's list of key code lines is left out: the React labs explain every line in a hover tooltip instead
    acts
  };
  if (real) topic.real = {
    key: inner(real[2], /data-challenges="([^"]+)"/),
    title: text(inner(real[2], /<h3[^>]*>([\s\S]*?)<\/h3>/)),
    intro: text(inner(real[2], /<p class="real-intro">([\s\S]*?)<\/p>/))
  };
  const want = topicsOrder[id] || fail(`topic ${id} not in TOPICS`);
  if (want.join() !== acts.map(a => a.id).join()) fail(`activity order in ${id} doesn't match TOPICS`);
  topics.push(topic);
}

/* ---------- activity data: every make<Kind>($('[data-act="id"]'), DATA, "id"); ---------- */
const lines = html.split("\n");
const startIdx = lines.findIndex(l => /^make\w+\(\$\('\[data-act=/.test(l));
const chIdx = lines.findIndex(l => l.startsWith("const CHALLENGES = {"));
if (startIdx < 0) fail("no activity calls found");
const actEnd = chIdx > -1 ? chIdx : lines.findIndex((l, i) => i > startIdx && /^\/\* -+ start -+ \*\//.test(l));
let body = lines.slice(startIdx, actEnd).join("\n").replace(/\n\/\* -+ ON A REAL MICRO:BIT -+ \*\/\s*$/, "");
const kinds = {};
body = body
  .replace(/^make(\w+)\(\$\('\[data-act="([^"]+)"\]'\), (\[|\{)/gm, (m, kind, id, open) => { kinds[id] = kind; return `  ${id}: { kind: "${kind}", data: ${open}`; })
  .replace(/^(\]|\}), "([^"]+)"\);$/gm, (m, close, id) => { if (!kinds[id]) fail(`unmatched close for ${id}`); return `${close} },`; })
  .replace(/^\/\* -+ ([A-Z :.!]+?) -+ \*\/$/gm, "  // $1");
const allIds = topics.flatMap(t => t.acts.map(a => a.id));
for (const id of allIds) if (!kinds[id]) fail(`no data for activity ${id}`);
body = body.split("\n").map(l => (/^  (\w+: \{ kind|\/\/)/.test(l) || !l ? l : "  " + l)).join("\n");

let challenges = "{}";
if (chIdx > -1) {
  const end = lines.findIndex((l, i) => i > chIdx && l === "};");
  challenges = lines.slice(chIdx, end + 1).join("\n").replace(/^const CHALLENGES = /, "").replace(/;$/, "");
}

const helpers = ["T_", "P_", "S_", "IO_", "D_", "J_", "W_", "CH_", "BRK", "EXIT_NO"].filter(h => new RegExp(`\\b${h}\\b`).test(body));
const usesHead = /\bMB_HEAD\b/.test(body);
const meta = {
  slug,
  brand,
  title: brand.replace(/^ICTPRG302 /, ""),
  key,
  chKey,
  next: next ? { href: next[1], label: text(next[2]) } : null,
  psKeywords: psExtra ? JSON.parse(psExtra) : []
};

const out = `// Content for the ${meta.title}.
// First generated from ${slug}/index.html by tools/extract-lab.mjs; edit this file directly from now on.
// Each activity is { kind, data }: kind picks the component in src/activities, data is its rounds or questions.
${helpers.length ? `import { ${helpers.join(", ")} } from "../../lib/flowchart.js";\n` : ""}${usesHead ? `import { MB_HEAD } from "../../lib/python.js";\n` : ""}
export const meta = ${JSON.stringify(meta, null, 2)};

export const topics = ${JSON.stringify(topics, null, 2)};

export const activities = {
${body.replace(/,\s*$/, "")}
};

export const challenges = ${challenges};
`;
const outAt = process.argv.indexOf("--out");
const dest = outAt > -1 ? path.resolve(process.argv[outAt + 1]) : path.join(ROOT, "src", "labs", slug);
fs.mkdirSync(dest, { recursive: true });
fs.writeFileSync(path.join(dest, "content.js"), out);
console.log(`Wrote ${path.relative(ROOT, path.join(dest, "content.js"))}: ${topics.length} topics, ${allIds.length} activities (${[...new Set(Object.values(kinds))].join(", ")})`);
