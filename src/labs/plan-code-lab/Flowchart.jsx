/* Draws a student's flowchart from the builder's tree: { k, t, yes, no, body }.
   Every shape is keyed by its node id, so a new shape pops in and the others stay put.
   Each layout returns its width either side of the centre line (L, R), its height (h)
   and draw(cx, y), which returns the SVG elements with (cx, y) as the entry point. */
import { useMemo } from "react";

const GAP = 26, LH = 16, CW = 7;

function wrapText(t, n) {
  const words = String(t || "").split(/\s+/).filter(Boolean), lines = [];
  let cur = "";
  for (const w of words) { if (cur && (cur + " " + w).length > n) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; }
  if (cur) lines.push(cur);
  return lines.length ? lines : ["…"];
}
const P = pts => pts.map(p => p.join(",")).join(" ");
const texts = (lines, cx, cy, k) => lines.map((l, i) => (
  <text key={k + "t" + i} x={cx} y={cy - (lines.length - 1) * LH / 2 + i * LH} className="pcf-t" textAnchor="middle" dominantBaseline="central">{l}</text>
));
const ln = (key, pts, o = {}) => <polyline key={key} points={P(pts)} className={"pcf-l" + (o.dash ? " dash" : "")} markerEnd={o.arrow ? `url(#${o.id})` : undefined} />;
const lab = (key, x, y, t, anchor = "middle") => <text key={key} x={x} y={y} className="pcf-lab" textAnchor={anchor}>{t}</text>;
const shape = (k, cx, cy, el, words) => <g key={"g" + k} className="pcf-node" style={{ transformOrigin: `${cx}px ${cy}px` }}>{el}{words}</g>;

function diamondDims(t) {
  const lines = wrapText(t, 18), tw = Math.max(...lines.map(l => l.length)) * CW;
  return { lines, w: Math.max(130, tw * 1.55 + 46), h: lines.length * LH + 40 };
}
const diamond = (cx, y, d, cls) => <polygon points={P([[cx, y], [cx + d.w / 2, y + d.h / 2], [cx, y + d.h], [cx - d.w / 2, y + d.h / 2]])} className={"pcf-s " + cls} />;

function layNode(n, id, k) {
  if (n.k === "decision") return layDecision(n, id, k);
  if (n.k === "loop") return layLoop(n, id, k);
  const term = n.k === "start" || n.k === "end", io = n.k === "input" || n.k === "output";
  const lines = term ? [n.t] : wrapText(n.t || (n.k === "break" ? "Stop repeating" : ""), 22);
  const tw = Math.max(...lines.map(l => l.length)) * CW;
  const w = term ? 90 : Math.max(io ? 130 : 116, tw + (io ? 46 : 28)), hh = term ? 34 : lines.length * LH + 18;
  return {
    k, L: w / 2, R: w / 2, h: hh, brk: n.k === "break",
    draw(cx, y) {
      const x0 = cx - w / 2, x1 = cx + w / 2;
      const el = term || n.k === "break"
        ? <rect x={x0} y={y} width={w} height={hh} rx={hh / 2} className={"pcf-s " + (n.k === "break" ? "pcf-brk" : "pcf-term")} />
        : io ? <polygon points={P([[x0 + 12, y], [x1, y], [x1 - 12, y + hh], [x0, y + hh]])} className="pcf-s pcf-io" />
        : <rect x={x0} y={y} width={w} height={hh} rx={3} className="pcf-s pcf-proc" />;
      return [shape(k, cx, y + hh / 2, el, texts(lines, cx, y + hh / 2, k))];
    }
  };
}
function laySeq(list, id, pk) {
  const items = list.map((n, i) => layNode(n, id, n.id || `${pk}.${i}`));
  return {
    L: Math.max(0, ...items.map(i => i.L)), R: Math.max(0, ...items.map(i => i.R)),
    h: items.reduce((a, i) => a + i.h, 0) + GAP * Math.max(0, items.length - 1),
    endsInBreak: items.length > 0 && items[items.length - 1].brk,
    draw(cx, y) {
      const out = [];
      let yy = y;
      items.forEach((it, i) => {
        out.push(...it.draw(cx, yy));
        yy += it.h;
        if (i < items.length - 1) { if (!it.brk) out.push(ln("a" + it.k, [[cx, yy], [cx, yy + GAP]], { arrow: true, id })); yy += GAP; }
      });
      return out;
    }
  };
}
// Yes on the left, No on the right; both branches meet again below
function layDecision(n, id, k) {
  const d = diamondDims(n.t || "?"), yes = laySeq(n.yes || [], id, k + "y"), no = laySeq(n.no || [], id, k + "n");
  const offL = Math.max(d.w / 2, yes.R + 10), offR = Math.max(d.w / 2, no.L + 10);
  const top = d.h + 20, bh = Math.max(yes.h, no.h), merge = top + bh + (bh ? 18 : 0) + 4;
  return {
    k, L: Math.max(d.w / 2, offL + yes.L), R: Math.max(d.w / 2, offR + no.R), h: merge,
    draw(cx, y) {
      const vy = y + d.h / 2;
      const out = [shape(k, cx, vy, diamond(cx, y, d, "pcf-dec"), texts(d.lines, cx, vy, k)),
        lab("ly" + k, cx - d.w / 2 - 4, vy - 6, "Yes", "end"), lab("ln" + k, cx + d.w / 2 + 4, vy - 6, "No", "start")];
      for (const [br, x, vx, tag] of [[yes, cx - offL, cx - d.w / 2, "y"], [no, cx + offR, cx + d.w / 2, "n"]]) {
        if (br.h) {
          out.push(ln("b1" + tag + k, [[vx, vy], [x, vy], [x, y + top]], { arrow: true, id }), ...br.draw(x, y + top));
          if (!br.endsInBreak) out.push(ln("b2" + tag + k, [[x, y + top + br.h], [x, y + merge], [cx, y + merge]]));
        } else out.push(ln("b3" + tag + k, [[vx, vy], [x, vy], [x, y + merge], [cx, y + merge]]));
      }
      return out;
    }
  };
}
// The body runs down the middle, the loop-back arrow goes up the left, the exit leaves on the right
function layLoop(n, id, k) {
  const d = diamondDims(n.t || "Repeat forever"), b = laySeq(n.body || [], id, k + "b");
  const forever = /forever|^\s*true\b/i.test(n.t || "") || !n.t;
  const loopX = Math.max(d.w / 2, b.L) + 22, exitX = Math.max(d.w / 2, b.R) + 22;
  const top = 16, by = top + d.h + 24, bottom = by + b.h + 14, hh = bottom + 18;
  return {
    k, L: loopX + 4, R: exitX + 4, h: hh,
    draw(cx, y) {
      const vy = y + top + d.h / 2;
      return [
        ln("e" + k, [[cx, y], [cx, y + top]], { arrow: true, id }),
        shape(k, cx, vy, diamond(cx, y + top, d, "pcf-loop"), texts(d.lines, cx, vy, k)),
        lab("ly" + k, cx + 6, y + top + d.h + 14, forever ? "" : "Yes", "start"),
        ln("d" + k, [[cx, y + top + d.h], [cx, y + by]], { arrow: true, id }),
        ...b.draw(cx, y + by),
        ln("r" + k, [[cx, y + by + b.h], [cx, y + bottom], [cx - loopX, y + bottom], [cx - loopX, y + top / 2], [cx - 2, y + top / 2]], { arrow: true, id }),
        lab("lr" + k, cx - loopX + 4, y + bottom - 5, "repeat", "start"),
        ln("x" + k, [[cx + d.w / 2, vy], [cx + exitX, vy], [cx + exitX, y + hh], [cx, y + hh]], { dash: forever }),
        lab("lx" + k, cx + d.w / 2 + 4, vy - 6, forever ? "break" : "No", "start")
      ];
    }
  };
}

let svgSeq = 0;
export default function FlowSvg({ list, label = "Flowchart" }) {
  const id = useMemo(() => "pc-ah" + (++svgSeq), []);
  const seq = laySeq([{ k: "start", t: "Start", id: "start" }, ...list, { k: "end", t: "End", id: "end" }], id, "r");
  const pad = 16, W = Math.ceil(seq.L + seq.R + pad * 2 + 30), H = Math.ceil(seq.h + pad * 2);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="pcf-ah" />
        </marker>
      </defs>
      {seq.draw(seq.L + pad + 15, pad)}
    </svg>
  );
}
