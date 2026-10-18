import { memo, useCallback, useEffect, useRef, useState } from "react";
import * as KINDS from "./activities/index.js";
import Challenges from "./components/Challenges.jsx";
import CodeLab from "./components/CodeLab.jsx";
import { TipProvider } from "./components/Tooltip.jsx";
import { Activity } from "./components/ui.jsx";

const NAME_KEY = "ictprg302-student-name";

// Activities only re-render when their own props change, not on every keystroke in the code editor
const MEMO = Object.fromEntries(Object.entries(KINDS).map(([k, C]) => [k, memo(C)]));

// A Set kept in localStorage under the same keys as the original pages, so progress carries over.
function useStoredSet(key) {
  const [set, setSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); } catch (e) { return new Set(); }
  });
  const update = useCallback(fn => setSet(prev => {
    const next = fn(new Set(prev));
    try { localStorage.setItem(key, JSON.stringify([...next])); } catch (e) { /* storage unavailable */ }
    return next;
  }), [key]);
  return [set, update];
}

// Code typed in the editor, per challenge, and which challenges passed there: { code: {id: src}, passed: [ids] }
function useCodeStore(key) {
  const [data, setData] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(key) || "{}"); return { code: d.code || {}, passed: new Set(d.passed || []) }; }
    catch (e) { return { code: {}, passed: new Set() }; }
  });
  const save = d => { try { localStorage.setItem(key, JSON.stringify({ code: d.code, passed: [...d.passed] })); } catch (e) { /* storage unavailable */ } return d; };
  return {
    ...data,
    setCode: (id, src) => setData(d => save({ ...d, code: { ...d.code, [id]: src } })),
    pass: id => setData(d => (d.passed.has(id) ? d : save({ ...d, passed: new Set(d.passed).add(id) })))
  };
}

function topicFromHash(topics) {
  try { const h = location.hash.replace("#", ""); if (topics.some(t => t.id === h)) return h; } catch (e) { /* ignore */ }
  return topics[0].id;
}

export default function LabPage({ lab }) {
  const { meta, topics, activities, challenges } = lab;
  const [done, updateDone] = useStoredSet(meta.key);
  const [chDone, updateCh] = useStoredSet(meta.chKey || meta.key + "-challenges");
  const code = useCodeStore(meta.key.replace(/-progress$/, "") + "-code");
  const labs = useRef({});
  const [topic, setTopic] = useState(() => topicFromHash(topics));
  const [name, setName] = useState(() => { try { return localStorage.getItem(NAME_KEY) || ""; } catch (e) { return ""; } });

  useEffect(() => {
    const onHash = () => setTopic(topicFromHash(topics));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [topics]);

  // One stable callback per activity, so finishing one doesn't re-render the others
  const [onDone] = useState(() => Object.fromEntries(topics.flatMap(t => t.acts).map(a => [a.id, () => updateDone(s => s.add(a.id))])));

  function showTopic(id) {
    setTopic(id);
    try { history.replaceState(null, "", "#" + id); } catch (e) { /* ignore */ }
    window.scrollTo({ top: 0 });
  }
  function resetProgress() {
    try { localStorage.setItem(meta.key, "[]"); if (meta.chKey) localStorage.setItem(meta.chKey, "[]"); } catch (e) { /* ignore */ }
    try { // clear what passed in the code editor but keep the code itself
      const k = meta.key.replace(/-progress$/, "") + "-code", d = JSON.parse(localStorage.getItem(k) || "{}");
      localStorage.setItem(k, JSON.stringify({ code: d.code || {}, passed: [] }));
    } catch (e) { /* ignore */ }
    location.reload();
  }

  return <TipProvider>
    <header className="top">
      <div className="top-inner">
        <a className="home-link" href="../index.html">← All labs</a>
        <div className="brand"><h1>{meta.brand}</h1><span>micro:bit · Python</span></div>
        <nav className="tabs" role="tablist" aria-label="Topics">
          {topics.map(t => (
            <button key={t.id} className="tab" role="tab" id={"tab-" + t.id} aria-controls={t.id} aria-selected={t.id === topic} onClick={() => showTopic(t.id)}>
              {t.label} <span className="count">{t.acts.filter(a => done.has(a.id)).length}/{t.acts.length}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>

    <main>
      {topics.map((t, ti) => (
        // Every topic stays mounted, as in the original pages, so switching tabs keeps your place
        <section key={t.id} className="topic" id={t.id} role="tabpanel" aria-labelledby={"tab-" + t.id} hidden={t.id !== topic}>
          <div className="intro">
            <div>
              <p className="eyebrow">{t.eyebrow}</p>
              <h2>{t.title}</h2>
              <p className="lead">{t.lead}</p>
            </div>
          </div>
          {t.acts.map(a => {
            const { kind, data } = activities[a.id];
            const Comp = MEMO[kind];
            if (!Comp) throw new Error(`No activity component called ${kind} (activity ${a.id})`);
            return (
              <Activity key={a.id} act={a} done={done.has(a.id)}>
                <Comp act={a} data={data} onDone={onDone[a.id]} visible={t.id === topic} />
              </Activity>
            );
          })}
          {t.real && challenges[t.real.key] && (
            <Challenges real={t.real} list={challenges[t.real.key]} done={chDone}
              onToggle={(id, on) => updateCh(s => { if (on) s.add(id); else s.delete(id); return s; })}
              passed={code.passed} onTry={i => labs.current[t.id].open(i)}>
              <CodeLab ref={el => { labs.current[t.id] = el; }} title={"Code it here: " + t.title.toLowerCase()} challenges={challenges[t.real.key]}
                ids={challenges[t.real.key].map((_, i) => `${t.real.key}-${i}`)} store={code} visible={t.id === topic} />
            </Challenges>
          )}
          <TopicEnd topic={t} next={topics[ti + 1]} lab={meta.next} done={t.acts.filter(a => done.has(a.id)).length} onNext={showTopic} />
        </section>
      ))}
    </main>

    <footer>
      <span>Code runs in a simulator on this page. Test it on a real board in the micro:bit Python editor.</span>
      <button type="button" onClick={resetProgress}>Reset my progress</button>
      <label>Your name <input type="text" autoComplete="name" value={name}
        onChange={e => { setName(e.target.value); try { localStorage.setItem(NAME_KEY, e.target.value.trim()); } catch (err) { /* ignore */ } }} /></label>
      <button type="button" onClick={() => window.print()}>Print my results</button>
      {meta.next && <a className="next-lab" href={meta.next.href}>{meta.next.label}</a>}
    </footer>

    <PrintSheet meta={meta} topics={topics} done={done} name={name} passed={code.passed} challenges={challenges} />
  </TipProvider>;
}

// The end of a topic: how much of it is done, and a button on to the next topic (or the next lab)
function TopicEnd({ topic, next, lab, done, onNext }) {
  const total = topic.acts.length;
  return (
    <nav className="topic-end" aria-label={"End of " + topic.title}>
      <p><strong>End of {topic.title}.</strong> {done === total ? "Every activity is done." : `${done} of ${total} activities done.`}</p>
      {next
        ? <button className="btn primary" type="button" onClick={() => onNext(next.id)}>Next topic: {next.title} →</button>
        : lab && <a className="btn primary" href={lab.href}>{lab.label}</a>}
    </nav>
  );
}

// Only visible when printing: every activity with its Done / Not done status.
function PrintSheet({ meta, topics, done, name, passed, challenges }) {
  const all = topics.flatMap(t => t.acts);
  const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="print-sheet" aria-hidden="true">
      <h1>{meta.brand}: results</h1>
      <dl>
        <dt>Student</dt><dd>{name.trim() || "____________________"}</dd>
        <dt>Date</dt><dd>{date}</dd>
        <dt>Completed</dt><dd>{all.filter(a => done.has(a.id)).length} of {all.length} activities</dd>
        <dt>Code challenges</dt><dd>{passed.size} of {Object.values(challenges).flat().length} passed in the simulator</dd>
      </dl>
      {topics.map(t => (
        <div key={t.id}>
          <h2>{t.title}</h2>
          <table>
            <thead><tr><th>Activity</th><th>Title</th><th>Status</th></tr></thead>
            <tbody>{t.acts.map(a => <tr key={a.id}><td>{a.tag}</td><td>{a.title}</td><td>{done.has(a.id) ? "Done" : "Not done"}</td></tr>)}</tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
