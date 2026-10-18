/* Activities where you click a line of code: LinePick (track / check / update),
   BugHunt (Python bug, then the fix) and PseudoBug (the same for a pseudocode plan). */
import { useMemo, useRef, useState } from "react";
import Board, { playOut } from "../components/Board.jsx";
import { CodeBox, CodeView, Feedback, NextButton, OptionRow, Panel, RoundPills, Serial, shuffle, useRounds, useRunner } from "../components/ui.jsx";
import { esc, psHl } from "../lib/highlight.js";
import { tone, ignoreCancel } from "../lib/microbit.js";
import { MB_HEAD } from "../lib/python.js";

/* ---------- Track, check, update ---------- */
const ROLES = [["track", "the tracking variable (set before the loop)"], ["check", "the condition (checked each time round)"], ["update", "the line that updates the variable"]];

export function LinePick({ act, data, onDone }) {
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState({});
  const [fb, setFb] = useState(null);
  const rd = data[r];

  function load(k) { setR(k); setStep(0); setTags({}); setFb(null); }
  function pick(n) {
    if (step >= 3) return;
    const role = ROLES[step][0], want = rd[role] + MB_HEAD.length;
    if (n !== want) {
      setFb({ kind: "bad", html: `<strong>Not line ${n}.</strong> ${esc((rd.hints && rd.hints[role]) || "Look for " + ROLES[step][1] + ".")}` });
      return;
    }
    setTags(t => ({ ...t, [n]: [...(t[n] || []), { cls: "role-" + role, text: role }] }));
    setStep(step + 1);
    if (step + 1 < 3) setFb({ kind: "ok", html: `<strong>Yes, line ${n}.</strong> Now find the next part.` });
    else {
      setFb({ kind: "ok", html: "<strong>All three parts found.</strong> " + rd.why });
      solve(r);
    }
  }

  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={r} solved={solved} onPick={load} />
    <div className="split">
      <CodeBox lines={MB_HEAD.concat(rd.lines)} tags={tags} onPick={pick} pickable />
      <div className="side">
        <Panel title="Find">
          <p>{step < 3 ? <>Click the line that is <strong>{ROLES[step][1]}</strong>.</> : "All three parts found."}</p>
        </Panel>
        <Panel title="The three parts">
          <ul className="goals">
            {ROLES.map(([key, txt], i) => <li key={key} className={i < step ? "met" : ""}><strong>{key[0].toUpperCase() + key.slice(1)}</strong>: {txt}</li>)}
          </ul>
        </Panel>
      </div>
    </div>
    <div className="controls"><NextButton show={!last} label={act.nextLabel} onClick={() => load(r + 1)} /></div>
    <Feedback fb={fb} />
  </>;
}

/* ---------- Spot the bug / Find the error: shared state ---------- */
// lines: the round's code · fixes[0] is the right fix · bug: a line number or the buggy line's text
function useBugRound(data, onDone, linesOf) {
  const { r, setR, solved, solve, last } = useRounds(data.length, onDone);
  const [found, setFound] = useState(false);
  const [wrongLine, setWrongLine] = useState(0);
  const [fixed, setFixed] = useState(false);
  const [marks, setMarks] = useState({});
  const [fb, setFb] = useState(null);
  const [flashKey, setFlashKey] = useState(0);
  const rd = data[r];
  const lines = linesOf(rd);
  const bug = typeof rd.bug === "string" ? lines.indexOf(rd.bug) + 1 : rd.bug;
  // the fixes in a random order, new each time the round loads
  const order = useMemo(() => shuffle(rd.fixes.map((f, i) => i)), [r, found]);

  function reset(k) { setR(k); setFound(false); setWrongLine(0); setFixed(false); setMarks({}); setFb(null); }
  const shown = fixed ? lines.map((l, i) => (i === bug - 1 ? rd.fixes[0] : l)) : lines;
  return { r, solved, solve, last, rd, bug, shown, found, setFound, wrongLine, setWrongLine, fixed, setFixed, marks, setMarks, fb, setFb, flashKey, setFlashKey, order, reset };
}

function FixOptions({ B, html, onChoose }) {
  if (!B.found) return null;
  return (
    <div className="fixes">
      <p className="panel-title">Replace line {B.bug} with:</p>
      <OptionRow className="q-opts" opts={B.order.map(i => B.rd.fixes[i])} html={html}
        marks={Object.fromEntries(Object.entries(B.marks).map(([i, m]) => [B.order.indexOf(+i), m]))}
        disabled={j => B.fixed && B.marks[B.order[j]] !== "right"}
        onPick={j => onChoose(B.order[j])} />
    </div>
  );
}

/* ---------- Spot the bug (Python) ---------- */
export function BugHunt({ act, data, onDone }) {
  const R = useRunner();
  const board = useRef(null);
  const B = useBugRound(data, onDone, rd => rd.lines);

  function load(k) { R.stop(); B.reset(k); board.current.clear(); }
  function pick(n) {
    if (B.found) return;
    if (n !== B.bug) {
      B.setWrongLine(n);
      B.setFb({ kind: "bad", html: `<strong>Line ${n} is fine.</strong> Compare what the program should do with what actually happens, and look again.` });
      return;
    }
    B.setFound(true); B.setWrongLine(0);
    B.setFb({ kind: "info", html: `<strong>Yes, line ${n}.</strong> Now choose the fix.` });
  }
  async function choose(i) {
    if (B.fixed) return;
    if (i !== 0) { B.setMarks(m => ({ ...m, [i]: "wrong" })); B.setFb({ kind: "bad", html: "<strong>That wouldn't fix it.</strong> Try another option." }); return; }
    B.setMarks(m => ({ ...m, 0: "right" }));
    B.setFixed(true); B.setFlashKey(k => k + 1);
    B.setFb({ kind: "ok", html: "<strong>Fixed.</strong> " + esc(B.rd.why) });
    B.solve(B.r);
    const s = R.start();
    try { await playOut(board.current, B.rd.out, s, tone); } catch (e) { ignoreCancel(e); }
  }

  const symptom = B.fixed ? [{ text: "Works as it should now." }] : [{ text: B.rd.symptom, err: /Error/.test(B.rd.symptom) }];
  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={B.r} solved={B.solved} onPick={load} />
    <div className="split">
      <CodeBox note={B.fixed ? "Fixed" : B.found ? "Bug found on line " + B.bug : "Click the line with the bug"} pickable={!B.fixed}>
        <CodeView lines={B.shown} onPick={B.fixed ? null : pick}
          lineClass={{ [B.wrongLine]: "wrongpick", ...(B.found && !B.fixed ? { [B.bug]: "rightpick" } : {}) }}
          flash={B.fixed ? { line: B.bug, key: B.flashKey } : null} />
      </CodeBox>
      <div className="side">
        <Board ref={board} />
        <Panel title="It should"><p>{B.rd.goal}</p></Panel>
        <Panel title="What actually happens"><SymptomText lines={symptom} /></Panel>
      </div>
    </div>
    <FixOptions B={B} onChoose={choose} />
    <div className="controls"><NextButton show={!B.last} label={act.nextLabel} onClick={() => load(B.r + 1)} /></div>
    <Feedback fb={B.fb} />
  </>;
}

// The symptom pane shows text as written; tracebacks in red. Unlike Serial it adds no trailing newline.
function SymptomText({ lines }) {
  return <pre className="serial">{lines.map((l, i) => (l.err ? <span key={i} className="err">{l.text}</span> : <span key={i}>{l.text}</span>))}</pre>;
}

/* ---------- Find the error in the plan (pseudocode) ---------- */
export function PseudoBug({ act, data, onDone }) {
  const B = useBugRound(data, onDone, rd => rd.ps);

  function pick(n) {
    if (B.found) return;
    if (n !== B.bug) {
      B.setWrongLine(n);
      B.setFb({ kind: "bad", html: `<strong>Line ${n} is fine.</strong> Test the plan in your head with the example in "What goes wrong", one line at a time.` });
      return;
    }
    B.setFound(true); B.setWrongLine(0);
    B.setFb({ kind: "info", html: `<strong>Yes, line ${n}.</strong> Now choose the fix.` });
  }
  function choose(i) {
    if (B.fixed) return;
    if (i !== 0) { B.setMarks(m => ({ ...m, [i]: "wrong" })); B.setFb({ kind: "bad", html: "<strong>That wouldn't fix it.</strong> Try another option." }); return; }
    B.setMarks(m => ({ ...m, 0: "right" }));
    B.setFixed(true); B.setFlashKey(k => k + 1);
    B.setFb({ kind: "ok", html: "<strong>Fixed.</strong> " + B.rd.why });
    B.solve(B.r);
  }

  return <>
    <RoundPills label={act.roundLabel} count={data.length} cur={B.r} solved={B.solved} onPick={B.reset} />
    <div className={"split" + (B.fixed ? "" : " pickable")}>
      <CodeBox title="pseudocode" note={B.fixed ? "Fixed" : B.found ? "Error found on line " + B.bug : "Click the line with the error"}>
        <CodeView lines={B.shown} highlight={psHl} onPick={B.fixed ? null : pick}
          lineClass={{ [B.wrongLine]: "wrongpick", ...(B.found && !B.fixed ? { [B.bug]: "rightpick" } : {}) }}
          flash={B.fixed ? { line: B.bug, key: B.flashKey } : null} />
      </CodeBox>
      <div className="side">
        <Panel title="The goal"><p>{B.rd.goal}</p></Panel>
        <Panel title="What goes wrong"><p>{B.fixed ? "The plan now meets the goal." : B.rd.symptom}</p></Panel>
      </div>
    </div>
    <FixOptions B={B} html={psHl} onChoose={choose} />
    <div className="controls"><NextButton show={!B.last} label={act.nextLabel} onClick={() => B.reset(B.r + 1)} /></div>
    <Feedback fb={B.fb} />
  </>;
}
