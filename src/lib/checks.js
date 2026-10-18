/* Helpers for checking a student's program after it runs in the code editor.

A challenge's check(run) gets a record of the run and returns null when it passes,
or a short hint (plain text) saying what's still missing. The run record:
  texts   every display.scroll() / display.show() of text or a number, as strings, in order
  images  every display.show(Image.X), as names ("HEART")
  prints  every print() line
  clears  how many times display.clear() ran
  inputs  every answer typed for input()
  pressed { a, b }: how many times each button was pressed
  lit     how many LEDs are on at the end
  source  the code itself
*/

// The numbers from `from` towards `to` (not included), as strings: nums(10, -1, -1) → "10" … "0"
export function nums(from, to, step = 1) {
  const out = [];
  for (let v = from; step > 0 ? v < to : v > to; v += step) out.push(String(v));
  return out;
}

// What the program showed: the display if it used it, otherwise what it printed
export const shown = run => (run.texts.length ? run.texts : run.prints);

export function listText(a) {
  if (!a.length) return "nothing";
  const s = a.length > 12 ? [...a.slice(0, 10), "…", a[a.length - 1]] : a;
  return s.join(", ");
}

const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// null when the program showed exactly `want`, otherwise a hint comparing the two
export function expectShown(run, want, what = "Your program") {
  const got = shown(run);
  if (same(got, want)) return null;
  return `${what} should show ${listText(want)}. Yours showed ${listText(got)}.`;
}

// The code uses a for loop over range(), and (optionally) no while loop
export const usesFor = run => /^\s*for\s+\w+\s+in\s+range\(/m.test(run.source);
export const usesWhile = run => /^\s*while\b/m.test(run.source);
export const countFor = run => (run.source.match(/^\s*for\s+\w+\s+in\s+/gm) || []).length;
