import { useEffect, useMemo, useRef, useState } from "react";
import Board from "../components/Board.jsx";
import { useRunner } from "../components/ui.jsx";
import { ignoreCancel } from "../lib/microbit.js";
import LABS from "./labs.json";

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function doneSet(lab) {
  try { return new Set(JSON.parse(localStorage.getItem(lab.key) || "[]")); } catch (e) { return new Set(); }
}
// The first unfinished activity, so "Continue" can open the right topic.
function nextUp(lab, done) {
  for (const t of lab.topics) for (const a of t.acts) if (!done.has(a.id)) return { topic: t, act: a };
  return null;
}
function readState() {
  return LABS.map((lab, i) => {
    const done = doneSet(lab);
    const n = lab.ids.filter(id => done.has(id)).length, total = lab.ids.length;
    return { lab, i, done, n, total, pct: Math.round(100 * n / total), next: nextUp(lab, done) };
  });
}

export default function Home() {
  const [state, setState] = useState(readState);
  const [current, setCurrent] = useState(null);

  // Progress changes in the labs: re-read it when the browser shows a cached copy of this page
  // (Back button) or another tab saves progress.
  useEffect(() => {
    const onShow = e => { if (e.persisted) setState(readState()); };
    const onStorage = e => { if (!e.key || /^ictprg302-.*-progress$/.test(e.key)) setState(readState()); };
    window.addEventListener("pageshow", onShow);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener("pageshow", onShow); window.removeEventListener("storage", onStorage); };
  }, []);

  // Highlight the lab currently on screen in the sticky nav
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setCurrent(e.target.id); }), { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll(".lab").forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  const all = state.reduce((s, x) => s + x.total, 0), allDone = state.reduce((s, x) => s + x.n, 0);
  const pct = all ? Math.round(100 * allDone / all) : 0;
  const resume = state.find(x => x.next);
  let cont;
  if (!resume) cont = { text: "Course complete. Review any lab", href: "#" + LABS[0].folder };
  else if (allDone === 0) cont = { text: "Start Lab 1 →", href: `${resume.lab.folder}/index.html` };
  else cont = { text: `Continue: ${resume.lab.title}, ${resume.next.act.title} →`, href: `${resume.lab.folder}/index.html#${resume.next.topic.id}` };

  return <>
    <header className="hero wrap" id="top">
      <div>
        <p className="eyebrow">ICTPRG302 · micro:bit · Python</p>
        <h1>Python labs</h1>
        <p className="lead">Six hands-on labs that follow the course slides, from your first variable to saving data in files. Every activity runs in a micro:bit simulator on the page, so you can try code straight away and test it on a real board afterwards.</p>
        <div className="overall">
          <div className="bar" role="progressbar" aria-label="Course progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={pct}><i style={{ width: pct + "%" }} /></div>
          <span>{allDone} of {all} activities done ({pct}%)</span>
          <a className="btn primary" href={cont.href}>{cont.text}</a>
        </div>
      </div>
      <HeroBoard />
    </header>

    <nav className="labnav" aria-label="Labs">
      <ol>
        {state.map(({ lab, i, n, total }) => (
          <li key={lab.folder}>
            <a href={"#" + lab.folder} aria-current={current === lab.folder}>
              {i + 1}. {lab.title.replace(/ Lab$/, "")}<small className={n === total ? "done-txt" : undefined}>{n === total ? "✓" : `${n}/${total}`}</small>
            </a>
          </li>
        ))}
      </ol>
    </nav>

    <main className="wrap">
      <section className="how" aria-labelledby="how-h">
        <h2 id="how-h">How each lab works</h2>
        <ol>
          <li><h3>Learn the idea</h3><p>Each topic opens with a short explanation and a quick reference of the Python you need.</p></li>
          <li><h3>Practise it</h3><p>Predict, trace, build and fix programs. The simulator shows the micro:bit display, variables and output as the code runs.</p></li>
          <li><h3>Check yourself</h3><p>Finish each topic with a quiz and a "Spot the bug" round. Activities are marked Done as you complete them.</p></li>
          <li><h3>Take it to the board</h3><p>Real-board challenges give you starter code to try in the micro:bit Python editor. Print your results to hand in.</p></li>
        </ol>
      </section>
      <Finder state={state} />
      {state.map(s => <LabSection key={s.lab.folder} {...s} />)}
    </main>

    <footer>Progress is saved in the browser you use, so it won't follow you to another computer. Use the "Reset my progress" link at the bottom of a lab to start that lab again.</footer>
  </>;
}

function LabSection({ lab, i, done, n, total, pct, next }) {
  const href = `${lab.folder}/index.html`;
  const prev = i > 0 ? LABS[i - 1] : null;
  const hid = lab.folder + "-h";
  return (
    <section className="lab" id={lab.folder} aria-labelledby={hid}>
      <div className="lab-head"><img src={lab.icon} alt="" /><p className="step">Lab {i + 1} of {LABS.length}</p><h2 id={hid}>{lab.title}</h2></div>
      <p className="lab-blurb">{lab.blurb}</p>
      <div className="lab-progress">
        <div className="bar" aria-hidden="true"><i style={{ width: pct + "%" }} /></div>
        <span>{n === total ? <span className="done-txt">Complete</span> : `${n} of ${total} activities done`}</span>
      </div>
      <div className="lab-actions">
        <a className="btn primary" href={href}>Open {lab.title} →</a>
        {n > 0 && next && <a className="btn" href={`${href}#${next.topic.id}`}>Continue: {next.act.title}</a>}
      </div>
      <div className="lab-body">
        <div className="side">
          <div><h3>By the end you can</h3><ul className="outcomes">{lab.outcomes.map((o, k) => <li key={k}>{o}</li>)}</ul></div>
          <div><h3>Matching slides</h3><div className="chips">{lab.slides.map(s => <span key={s}>{s}</span>)}</div></div>
          <div><h3>Before you start</h3><p className="note">{prev ? `This lab builds on the ${prev.title}. Finish that first if you're new to these ideas.` : "No experience needed. This is the place to start."}</p></div>
        </div>
        <div className="topics">
          <h3>What's inside: {plural(lab.topics.length, "topic", "topics")}, {plural(total, "activity", "activities")}</h3>
          {lab.topics.map((t, ti) => (
            <article className="topic" key={t.id}>
              <div className="topic-head">
                <p className="step">Topic {ti + 1}</p>
                <h4><a href={`${href}#${t.id}`}>{t.title}</a></h4>
                <span className="count">{t.acts.filter(a => done.has(a.id)).length} / {t.acts.length} done</span>
              </div>
              {/* leads come from the lab pages and can contain <code> */}
              <p className="lead" dangerouslySetInnerHTML={{ __html: t.lead }} />
              <details>
                <summary>Show the {plural(t.acts.length, "activity", "activities")}</summary>
                <ol className="acts">
                  {t.acts.map(a => {
                    const d = done.has(a.id);
                    return (
                      <li key={a.id} className={d ? "is-done" : ""}>
                        <span className="dot" aria-hidden="true" />
                        <a className="t" href={`${href}#${t.id}`}><small>{a.tag}</small>{a.title}</a>
                        <span className="s">{d ? "Done" : "To do"}</span>
                        <span className="b">{a.brief}</span>
                      </li>
                    );
                  })}
                </ol>
              </details>
            </article>
          ))}
        </div>
      </div>
      <a className="top-link" href="#top">↑ Back to top</a>
    </section>
  );
}

/* ---------- a micro:bit to play with ---------- */
const PICTURES = ["HEART", "HAPPY", "SURPRISED", "DIAMOND", "ARROW_E", "SAD"];
const MESSAGES = ["Hi!", "Python", "micro:bit"];

function HeroBoard() {
  const R = useRunner();
  const board = useRef(null);
  const [code, setCode] = useState('display.scroll("PY")');
  const pic = useRef(-1), msg = useRef(-1), drawing = useRef(new Set());

  async function play(fn) {
    R.stop();
    const s = R.start();
    try { await fn(s); } catch (e) { ignoreCancel(e); }
  }
  useEffect(() => {
    play(async s => {
      await board.current.scroll("PY", s, 110);
      if (!s.live) return;
      board.current.show("HAPPY"); setCode("display.show(Image.HAPPY)");
    });
  }, []); // run once, on the first visit to the page

  function showNext() {
    R.stop(); drawing.current.clear();
    pic.current = (pic.current + 1) % PICTURES.length;
    board.current.show(PICTURES[pic.current]);
    setCode(`display.show(Image.${PICTURES[pic.current]})`);
  }
  function scrollNext() {
    drawing.current.clear();
    msg.current = (msg.current + 1) % MESSAGES.length;
    const text = MESSAGES[msg.current];
    setCode(`display.scroll("${text}")`);
    play(s => board.current.scroll(text, s));
  }
  function draw(i) {
    if (!drawing.current.size) { R.stop(); board.current.clear(); }
    const d = drawing.current;
    if (d.has(i)) d.delete(i); else d.add(i);
    board.current.toggle(i);
    const x = i % 5, y = Math.floor(i / 5);
    setCode(`display.set_pixel(${x}, ${y}, ${d.has(i) ? 9 : 0})`);
  }
  function clear() { R.stop(); drawing.current.clear(); board.current.clear(); setCode("display.clear()"); }

  return (
    <aside className="play" aria-label="Try the micro:bit">
      <Board ref={board} onLed={draw} onA={showNext} onB={scrollNext} />
      <pre className="play-code" aria-live="polite"><code>{code}</code></pre>
      <p className="play-help">
        <b>Try it:</b> press <kbd>A</kbd> for a picture, <kbd>B</kbd> to scroll a message, or click the LEDs to draw.
        {" "}<button type="button" className="linkish" onClick={clear}>Clear</button>
      </p>
    </aside>
  );
}

/* ---------- find any activity in the course ---------- */
const FILTERS = [["all", "All"], ["todo", "To do"], ["done", "Done"]];
const SHOW = 8;

function Finder({ state }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [more, setMore] = useState(false);
  const input = useRef(null);

  const rows = useMemo(() => state.flatMap(({ lab, i, done }) => lab.topics.flatMap(t => t.acts.map(a => ({
    lab, i, topic: t, act: a, done: done.has(a.id),
    text: [a.title, a.brief, t.title, lab.title, a.tag].join(" ").toLowerCase()
  })))), [state]);

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = rows.filter(r => (filter === "all" || (filter === "done") === r.done) && words.every(w => r.text.includes(w)));
  const counts = { all: rows.length, todo: rows.filter(r => !r.done).length, done: rows.filter(r => r.done).length };
  const shown = more ? hits : hits.slice(0, SHOW);

  // Press / anywhere to jump to the search box
  useEffect(() => {
    const onKey = e => {
      if (e.key !== "/" || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      e.preventDefault(); input.current.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="finder" aria-labelledby="find-h">
      <div className="finder-head">
        <h2 id="find-h">Find an activity</h2>
        <p className="note">Search all {rows.length} activities by topic or idea, for example <button type="button" className="linkish" onClick={() => setQuery("range")}>range</button>,{" "}
          <button type="button" className="linkish" onClick={() => setQuery("bug")}>bug</button> or <button type="button" className="linkish" onClick={() => setQuery("flowchart")}>flowchart</button>.</p>
      </div>
      <div className="finder-controls">
        <label className="search">
          <span className="sr-only">Search activities</span>
          <input ref={input} type="search" placeholder="Search activities…  ( / )" value={query} onChange={e => { setQuery(e.target.value); setMore(false); }} />
        </label>
        <div className="seg" role="group" aria-label="Show">
          {FILTERS.map(([k, label]) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => { setFilter(k); setMore(false); }}>{label} <small>{counts[k]}</small></button>
          ))}
        </div>
      </div>
      <p className="finder-count" aria-live="polite">{hits.length ? `${hits.length} ${hits.length === 1 ? "activity" : "activities"}`
        : filter === "done" && !counts.done ? "Nothing is marked Done yet. Finish an activity in any lab and it shows up here."
        : filter === "todo" && !counts.todo ? "Nothing left to do. Every activity is Done!"
        : "No activities match. Try another word."}</p>
      <ol className="hits">
        {shown.map(r => (
          <li key={r.lab.folder + r.act.id} className={r.done ? "is-done" : ""}>
            <a href={`${r.lab.folder}/index.html#${r.topic.id}`}>
              <span className="dot" aria-hidden="true" />
              <span className="hit-main">
                <span className="hit-title">{r.act.title}</span>
                <span className="hit-where">Lab {r.i + 1} · {r.lab.title.replace(/ Lab$/, "")} · {r.topic.title}</span>
                <span className="hit-brief">{r.act.brief}</span>
              </span>
              <span className="hit-status">{r.done ? "Done" : "To do"}</span>
            </a>
          </li>
        ))}
      </ol>
      {hits.length > SHOW && <button type="button" className="btn" onClick={() => setMore(!more)}>{more ? "Show fewer" : `Show all ${hits.length}`}</button>}
    </section>
  );
}
