import { useId } from "react";
import { cx } from "./ui.jsx";

// Draws a layout from fcLayout(). active: node id · activeEdge: one of layout.edges · states: { id: "right" | "wrong" } · blanks: { id: "A" }
export default function Flowchart({ layout: L, label = "Flowchart", active, activeEdge, states = {}, blanks = {} }) {
  const uid = useId().replace(/:/g, "");
  const loopEdge = L.loop ? L.edges.find(e => e.loop) : null;
  return (
    <svg viewBox={`0 0 ${L.width} ${L.height}`} className="fc" role="img" aria-label={label}>
      <defs>
        <marker id={uid + "-a"} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="fc-arrowhead" />
        </marker>
      </defs>
      {L.edges.map((e, i) => {
        const [a, b] = e.pts, horiz = a[1] === b[1], long = e.label && e.label.length > 3;
        return (
          <g key={i}>
            <polyline points={e.pts.map(p => p.join(",")).join(" ")} className={cx("fc-edge", e === activeEdge && "active")} markerEnd={e.arrow ? `url(#${uid}-a)` : undefined} />
            {e.label && (
              <text x={horiz ? (long ? a[0] + 8 : a[0] + 22) : a[0] + 8} y={horiz ? a[1] - 8 : a[1] + 16} className="fc-label" textAnchor={horiz && !long ? "middle" : "start"}>{e.label}</text>
            )}
          </g>
        );
      })}
      {loopEdge && (() => {
        const my = (loopEdge.pts[1][1] + loopEdge.pts[3][1]) / 2;
        return <text x={L.lx - 6} y={my} className="fc-label" transform={`rotate(-90 ${L.lx - 6} ${my})`} textAnchor="middle">{L.loopLabel || "while True: repeat"}</text>;
      })()}
      {L.nodes.map(n => {
        const x0 = n.x - n.w / 2, y0 = n.y - n.h / 2, lines = n.text ? n.text.split("\n") : [];
        return (
          <g key={n.id} className={cx("fc-node", "fc-" + n.type, blanks[n.id] && "blank", n.id === active && "active", states[n.id])} data-id={n.id}>
            {(n.type === "rect" || n.type === "sub") && <rect x={x0} y={y0} width={n.w} height={n.h} rx={4} />}
            {n.type === "sub" && <>
              <line x1={x0 + 12} y1={y0} x2={x0 + 12} y2={y0 + n.h} className="fc-subline" />
              <line x1={x0 + n.w - 12} y1={y0} x2={x0 + n.w - 12} y2={y0 + n.h} className="fc-subline" />
            </>}
            {n.type === "term" && <rect x={x0} y={y0} width={n.w} height={n.h} rx={n.h / 2} />}
            {n.type === "io" && <polygon points={`${x0 + 14},${y0} ${x0 + n.w},${y0} ${x0 + n.w - 14},${y0 + n.h} ${x0},${y0 + n.h}`} />}
            {n.type === "dec" && <polygon points={`${n.x},${y0} ${x0 + n.w},${n.y} ${n.x},${y0 + n.h} ${x0},${n.y}`} />}
            {n.type === "join" && <circle cx={n.x} cy={n.y} r={7} />}
            {blanks[n.id]
              ? <text x={n.x} y={n.y + 1} className="fc-blanktext" textAnchor="middle" dominantBaseline="middle">{blanks[n.id]}</text>
              : lines.length > 0 && (
                <text x={n.x} y={n.y - (lines.length - 1) * 8 + 1} className="fc-text" textAnchor="middle" dominantBaseline="middle">
                  {lines.map((ln, i) => <tspan key={i} x={n.x} dy={i ? 16 : 0}>{ln}</tspan>)}
                </text>
              )}
          </g>
        );
      })}
    </svg>
  );
}

export function FlowLegend() {
  return (
    <div className="fc-legend">
      <span><svg viewBox="0 0 60 26" aria-hidden="true"><rect x="2" y="3" width="56" height="20" rx="10" /></svg>Start / End</span>
      <span><svg viewBox="0 0 60 26" aria-hidden="true"><rect x="2" y="3" width="56" height="20" rx="3" /></svg>Process</span>
      <span><svg viewBox="0 0 60 26" aria-hidden="true"><rect x="2" y="3" width="56" height="20" rx="3" /><line x1="9" y1="3" x2="9" y2="23" /><line x1="51" y1="3" x2="51" y2="23" /></svg>Call a function</span>
      <span><svg viewBox="0 0 60 26" aria-hidden="true"><polygon points="10,3 58,3 50,23 2,23" /></svg>Input / output</span>
      <span><svg viewBox="0 0 60 26" aria-hidden="true"><polygon points="30,1 58,13 30,25 2,13" /></svg>Decision (Yes / No)</span>
    </div>
  );
}
