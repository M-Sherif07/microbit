import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { IMAGES, FONT } from "../lib/microbit.js";

const BLANK = ["00000", "00000", "00000", "00000", "00000"];

// The simulated 5×5 LED display. Activities drive it through a ref:
// board.current.show("HEART"), .showChar("7"), .clear(), .toggle(index), await .scroll(text, s)
// .setPixel(x, y, v), .getPixel(x, y) and .lit() (how many LEDs are on) read and write single LEDs.
// Optional: onLed(index) makes the LEDs clickable; onA / onB add the two buttons as plain clicks,
// or onButton(key, down) adds them as buttons you can hold down (for is_pressed()).
const Board = forwardRef(function Board({ onLed, onA, onB, onButton, held = {} }, ref) {
  const [rows, setRowsState] = useState(BLANK);
  const now = useRef(BLANK); // the rows as they are right now, before React re-renders
  const setRows = r => { now.current = r; setRowsState(r); };
  const setLed = (i, v) => setRows(now.current.map((row, r) => (r !== Math.floor(i / 5) ? row : [...row].map((d, c) => (c === i % 5 ? String(v) : d)).join(""))));
  const api = useRef(null);
  api.current = {
    setRows,
    clear: () => setRows(BLANK),
    toggle: i => setLed(i, now.current[Math.floor(i / 5)][i % 5] === "0" ? 9 : 0),
    setPixel: (x, y, v) => setLed(y * 5 + x, v),
    getPixel: (x, y) => +now.current[y][x],
    lit: () => now.current.join("").replace(/0/g, "").length,
    show: name => setRows(IMAGES[name].split(":")),
    showChar(ch) {
      const g = FONT[String(ch).toUpperCase()] || FONT["?"], w = g[0].length, left = Math.floor((5 - w) / 2);
      setRows(g.map(row => [0, 1, 2, 3, 4].map(c => (row[c - left] === "#" ? "9" : "0")).join("")));
    },
    async scroll(text, s, delay = 90) {
      const blank = [0, 0, 0, 0, 0];
      const cols = [blank, blank, blank, blank, blank];
      for (const ch of String(text).toUpperCase()) {
        const g = FONT[ch] || FONT["?"];
        for (let c = 0; c < g[0].length; c++) cols.push(g.map(r => (r[c] === "#" ? 9 : 0)));
        cols.push(blank);
      }
      for (let i = 0; i < 4; i++) cols.push(blank);
      for (let start = 0; start <= cols.length - 5; start++) {
        setRows([0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4].map(c => cols[start + c][r]).join("")));
        await s.sleep(delay);
      }
      setRows(BLANK);
    }
  };
  useImperativeHandle(ref, () => ({
    setRows: r => api.current.setRows(r),
    clear: () => api.current.clear(),
    toggle: i => api.current.toggle(i),
    setPixel: (x, y, v) => api.current.setPixel(x, y, v),
    getPixel: (x, y) => api.current.getPixel(x, y),
    lit: () => api.current.lit(),
    show: n => api.current.show(n),
    showChar: c => api.current.showChar(c),
    scroll: (t, s, d) => api.current.scroll(t, s, d)
  }), []);
  const btn = (label, fn) => {
    const k = label.toLowerCase();
    if (onButton) {
      const down = e => { e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } onButton(k, true); };
      const up = () => onButton(k, false); // always release: a quick tap can come before `held` updates
      return (
        <button type="button" className={"mb-btn" + (held[k] ? " held" : "")} aria-label={"Button " + label}
          onPointerDown={down} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up}
          onKeyDown={e => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); onButton(k, true); } }}
          onKeyUp={e => { if (e.key === " " || e.key === "Enter") onButton(k, false); }}>{label}</button>
      );
    }
    return fn && <button type="button" className="mb-btn" aria-label={"Button " + label} onClick={fn}>{label}</button>;
  };
  return (
    <div className="board">
      {btn("A", onA)}
      <div className="leds" role={onLed ? "group" : "img"} aria-label="micro:bit LED display">
        {rows.flatMap((row, r) => [...row].map((d, c) => {
          const v = +d, i = r * 5 + c, cls = "led" + (v > 0 ? " on" : "");
          const style = { "--b": (0.35 + 0.65 * v / 9).toFixed(2) };
          return onLed
            ? <button key={i} type="button" className={cls + " led-btn"} style={style} aria-label={`LED ${c + 1}, ${r + 1}`} aria-pressed={v > 0} onClick={() => onLed(i)} />
            : <span key={i} className={cls} style={style} />;
        }))}
      </div>
      {btn("B", onB)}
    </div>
  );
});

export default Board;

// Play an activity's "out" list after it's solved: strings scroll, {img, ms} flash an image, {tone, ms} beeps.
export async function playOut(board, out, s, tone) {
  for (const o of out || []) {
    if (typeof o === "string") await board.scroll(o, s);
    else if (o.tone) { tone(o.tone, o.ms); await s.sleep(o.ms + 150); }
    else { board.show(o.img); await s.sleep(o.ms); board.clear(); await s.sleep(300); }
  }
}
