/* Moving forward on the original (not yet React) lab pages, to match the React labs.

tools/sync-home.mjs bundles this into public/shared/lab-nav.js and adds it to each copied lab.
  - An activity's "Next program →" (or "Next plan →", "Next bug →" …) shows on every round
    except the last, instead of only after the round is answered. The page's own click
    handler loads the next round, exactly as before.
  - The end of each topic gets a bar: how many of its activities are done, and a button on to
    the next topic, or to the next lab after the last topic.
*/
const CSS = `
.topic-end { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 18px; }
.topic-end p { margin: 0; color: var(--muted); }
.topic-end p strong { color: var(--ink); }
.topic-end a.btn { text-decoration: none; }
@media print { .topic-end { display: none !important; } }
`;

// Show each activity's Next button unless it's on its last round
function syncNext() {
  for (const act of document.querySelectorAll(".act")) {
    const next = act.querySelector("[data-next]");
    const pills = act.querySelectorAll("[data-rounds] .pill");
    if (!next || !pills.length) continue; // no numbered rounds: leave the page's own behaviour
    const cur = [...pills].findIndex(p => p.getAttribute("aria-pressed") === "true");
    if (cur > -1 && cur < pills.length - 1 && next.hidden) next.hidden = false;
  }
}

// One bar at the end of each topic
function addTopicEnds() {
  const topics = [...document.querySelectorAll("section.topic")];
  const nextLab = document.querySelector("footer .next-lab");
  topics.forEach((sec, i) => {
    if (sec.querySelector(":scope > .topic-end")) return;
    const title = (sec.querySelector(".intro h2") || {}).textContent || sec.id;
    const bar = document.createElement("nav");
    bar.className = "topic-end";
    bar.setAttribute("aria-label", "End of " + title);
    const p = document.createElement("p");
    bar.append(p);
    const nxt = topics[i + 1];
    if (nxt) {
      const tab = document.querySelector(`.tab[data-topic="${nxt.id}"]`);
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn primary";
      b.textContent = `Next topic: ${(nxt.querySelector(".intro h2") || {}).textContent || nxt.id} →`;
      b.addEventListener("click", () => { if (tab) tab.click(); });
      bar.append(b);
    } else if (nextLab) {
      const a = document.createElement("a");
      a.className = "btn primary"; a.href = nextLab.getAttribute("href"); a.textContent = nextLab.textContent;
      bar.append(a);
    }
    sec.append(bar);
  });
  updateCounts();
}
function updateCounts() {
  for (const sec of document.querySelectorAll("section.topic")) {
    const bar = sec.querySelector(":scope > .topic-end > p");
    if (!bar) continue;
    const acts = sec.querySelectorAll(".act .status"), done = sec.querySelectorAll(".act .status.done").length;
    const title = (sec.querySelector(".intro h2") || {}).textContent || sec.id;
    const text = `End of ${title}. ` + (done === acts.length ? "Every activity is done." : `${done} of ${acts.length} activities done.`);
    if (bar.textContent !== text) { bar.innerHTML = ""; const s = document.createElement("strong"); s.textContent = `End of ${title}.`; bar.append(s, " " + text.slice(s.textContent.length + 1)); }
  }
}

function start() {
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.append(style);
  addTopicEnds();
  syncNext();
  // The page redraws rounds and marks activities done as students work: keep up with it.
  // (Each callback only changes things that differ, so it settles straight away.)
  new MutationObserver(() => { syncNext(); updateCounts(); })
    .observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden", "aria-pressed", "class"] });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
else start();
