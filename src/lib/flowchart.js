/* Flowchart helpers and layout. Content files build charts with T_, P_, D_, W_ ...; Flowchart.jsx draws them. */
export const FC_SIZE = { rect: [184, 44], sub: [184, 44], io: [184, 44], dec: [204, 78], term: [116, 38], join: [14, 14] };
export const T_ = t => ({ type: "term", text: t });
export const P_ = (t, out) => ({ type: "rect", text: t, out });
export const S_ = (t, out) => ({ type: "sub", text: t, out });
export const IO_ = (t, out) => ({ type: "io", text: t, out });
export const D_ = t => ({ type: "dec", text: t });
export const J_ = () => ({ type: "join", text: "" });
export const BRK = "BREAK", EXIT_NO = "EXIT_NO";
// a while/for condition: Yes runs the body, No leaves the loop
export const W_ = d => ({ chain: { branches: [{ dec: d, out: EXIT_NO }], els: null } });
export const CH_ = (branches, els) => ({ chain: { branches: branches.map(([dec, out]) => ({ dec, out })), els } });

// Top-to-bottom layout: decisions in the middle, "Yes" outputs on the right, merge lines on a
// right-hand rail, a loop-back line on the left, and break arrows that leave the loop.
export function fcLayout(spec) {
  const cx = 250, rx = 500, rail = 652, lx = 36, gap = 46;
  const nodes = [], edges = [], count = { dec: 0, io: 0, rect: 0, sub: 0, join: 0 };
  const prefix = { dec: "d", io: "o", rect: "p", sub: "s", join: "j" };
  let bottom = 0, down = [], rails = [];
  const breaks = [];
  function make(sp, x, y) {
    const [w, h] = FC_SIZE[sp.type];
    const id = sp.type === "term" ? sp.text.toLowerCase() : prefix[sp.type] + (++count[sp.type]);
    const n = Object.assign({ id, x, y, w, h }, sp);
    nodes.push(n);
    return n;
  }
  function put(sp, extraGap = 0) {
    const h = FC_SIZE[sp.type][1];
    const n = make(sp, cx, bottom + (nodes.length ? gap + extraGap : 26) + h / 2);
    const top = n.y - h / 2;
    for (const p of down) edges.push({ from: p.src.id, to: n.id, label: p.label, pts: [[cx, p.src.y + p.src.h / 2], [cx, top]], arrow: true });
    const jy = top - 22;
    for (const o of rails) edges.push({ from: o.id, to: n.id, pts: [[o.x + o.w / 2, o.y], [rail, o.y], [rail, jy], [cx, jy]], arrow: false });
    down = [{ src: n, label: null }]; rails = [];
    bottom = n.y + h / 2;
    return n;
  }
  function segment(seg) {
    if (!seg.chain) return put(seg);
    const chainRails = [];
    let first = null;
    seg.chain.branches.forEach(br => {
      const d = put(br.dec);
      if (!first) first = d;
      if (br.out === BRK || br.out === EXIT_NO) breaks.push({ d, label: br.out === EXIT_NO ? "No" : "Yes", exit: br.out === EXIT_NO });
      else {
        const o = make(br.out, rx, d.y);
        edges.push({ from: d.id, to: o.id, label: "Yes", pts: [[d.x + d.w / 2, d.y], [o.x - o.w / 2 + 8, d.y]], arrow: true });
        chainRails.push(o);
      }
      down = [{ src: d, label: br.out === EXIT_NO ? "Yes" : "No" }];
    });
    if (seg.chain.els) put(seg.chain.els);
    rails = chainRails;
    return first;
  }
  put(T_("Start"));
  (spec.pre || []).forEach(segment);
  let loopTarget = null;
  spec.body.forEach((seg, i) => { const n = segment(seg); if (i === 0) loopTarget = n; });
  if (!spec.loop) { put(T_("End")); return { nodes, edges, width: 690, height: bottom + 30, loop: false, lx }; }
  if (rails.length) put(J_());
  const last = down[0].src, b = last.y + last.h / 2;
  edges.push({ from: last.id, to: loopTarget.id, label: down[0].label, pts: [[cx, b], [cx, b + 24], [lx, b + 24], [lx, loopTarget.y], [loopTarget.x - loopTarget.w / 2, loopTarget.y]], arrow: true, loop: true });
  bottom = b + 24;
  if (breaks.length || spec.post) {
    down = []; rails = [];
    const posts = spec.post || [];
    posts.forEach((sp, i) => {
      const n = put(sp, i === 0 ? 34 : 0);
      if (i === 0) {
        const top = n.y - n.h / 2, jy = top - 22;
        const exitRail = rail + 26; // its own rail, so it never overlaps the merge lines
        breaks.forEach(({ d, label, exit }) => edges.push({ from: d.id, to: n.id, label: label + (exit ? " – loop ends" : " – break"), pts: [[d.x + d.w / 2, d.y], [exitRail, d.y], [exitRail, jy], [cx, jy], [cx, top]], arrow: true }));
      }
    });
    put(T_("End"), posts.length ? 0 : 34);
  }
  return { nodes, edges, width: 700, height: bottom + 30, loop: true, lx, loopLabel: spec.loopLabel };
}

export const fcNorm = s => String(s).replace(/\s+/g, " ").trim();
