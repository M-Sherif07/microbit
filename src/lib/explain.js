/* Plain-English explanations of single lines of code, for the hover tooltips.

explainPy(lines, i) and explainPs(lines, i) take the whole program and a 0-based line index,
so they can say which loop or if a line sits inside. They return a string, or null for a
blank line or something they don't recognise (no tooltip then).

They describe what a line does and never say whether it's the bug. A line with a mistake in
it (a missing colon, say) still gets the same explanation as the correct line, so the
tooltips don't give away "Spot the bug" answers.
*/

const indentOf = l => l.match(/^ */)[0].length;
const strip = l => l.replace(/\s+#[^"']*$/, "").trim();
const isConst = n => /^[A-Z][A-Z0-9_]*$/.test(n);
const plural = (n, one, many = one + "s") => `${n} ${n === 1 ? one : many}`;

function listNums(vals) {
  if (!vals.length) return "no numbers at all";
  return vals.length > 8 ? vals.slice(0, 5).join(", ") + ", … " + vals[vals.length - 1] : vals.join(", ");
}
function rangeVals(args) {
  const n = args.map(a => (/^-?\d+$/.test(a.trim()) ? +a : NaN));
  if (n.some(Number.isNaN) || !n.length || n.length > 3) return null;
  const [s, e, st] = n.length === 1 ? [0, n[0], 1] : [n[0], n[1], n[2] ?? 1];
  if (st === 0) return null;
  const out = [];
  for (let v = s; st > 0 ? v < e : v > e; v += st) { out.push(v); if (out.length > 200) break; }
  return out;
}
// Split "a, b, c" at top-level commas
function splitArgs(s) {
  const out = []; let depth = 0, q = null, cur = "";
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if ("([{".includes(ch)) depth++;
    if (")]}".includes(ch)) depth--;
    if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/* ---------- conditions, in words ---------- */
const OPS = {
  "<": "is less than", "<=": "is less than or equal to", ">": "is greater than", ">=": "is greater than or equal to",
  "==": "is equal to", "!=": "is not equal to"
};
const OP_NOTES = {
  "<=": " (<= includes the number itself)",
  ">=": " (>= includes the number itself)",
  "==": " (== compares; a single = would store a value)"
};
const BUTTON = /^button_([ab])\.(is_pressed|was_pressed)\(\)$/;
// Sensor readings, in words, wherever they appear in a condition
const SENSORS = [
  [/display\.read_light_level\(\)/g, "the light level (0 to 255)"],
  [/pin(\d)\.read_analog\(\)/g, "the reading on pin $1 (0 to 1023)"],
  [/\btemperature\(\)/g, "the temperature in °C"],
  [/microphone\.was_event\(SoundEvent\.LOUD\)/g, "a loud sound has happened since the last check"],
  [/microphone\.sound_level\(\)/g, "the sound level (0 to 255)"]
];

function condWords(src, notes) {
  let s = src.trim();
  while (wrapped(s)) s = s.slice(1, -1).trim();
  for (const join of [" or ", " and "]) {
    const parts = topSplit(s, join);
    if (parts.length > 1) return parts.map(p => condWords(p, notes)).join(join);
  }
  if (s.startsWith("not ")) {
    const inner = s.slice(4).trim(), b = inner.match(BUTTON);
    if (b) return `button ${b[1].toUpperCase()} ${b[2] === "is_pressed" ? "is not being pressed" : "has not been pressed"}`;
    const words = condWords(inner, notes);
    if (/^a loud sound has happened/.test(words)) return "no loud sound has happened since the last check";
    return `${words} is not true`;
  }
  const b = s.match(BUTTON);
  if (b) return `button ${b[1].toUpperCase()} ${b[2] === "is_pressed" ? "is being pressed" : "has been pressed since the last check"}`;
  for (const [re, words] of SENSORS) s = s.replace(re, words);
  if (s === "True") return "always True";
  if (s === "False") return "always False";
  if (/^a loud sound/.test(s)) return s;
  const m = s.match(/^(.+?)\s*(<=|>=|==|!=|<|>)\s*(.+)$/);
  if (m) { if (OP_NOTES[m[2]]) notes.add(OP_NOTES[m[2]]); return `${m[1].trim()} ${OPS[m[2]]} ${m[3].trim()}`; }
  return `${s} is True`;
}
// True when one pair of brackets wraps all of s: "(a > b)" yes, "(a > b) and (b > c)" no
function wrapped(s) {
  if (!s.startsWith("(") || !s.endsWith(")")) return false;
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")" && --depth === 0 && i < s.length - 1) return false;
  }
  return true;
}
function topSplit(s, sep) {
  const out = []; let depth = 0, q = null, start = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) { if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; continue; }
    if ("([{".includes(ch)) depth++;
    else if (")]}".includes(ch)) depth--;
    else if (depth === 0 && s.startsWith(sep, i)) { out.push(s.slice(start, i)); start = i + sep.length; i += sep.length - 1; }
  }
  out.push(s.slice(start));
  return out;
}
function cond(src) {
  const notes = new Set();
  const words = condWords(src, notes);
  return { words, note: [...notes].join("") };
}

/* ---------- where a line sits: inside which block, or after a loop ---------- */
function context(lines, i, isPs) {
  const ind = indentOf(lines[i]);
  let m;
  if (ind > 0) {
    for (let j = i - 1; j >= 0; j--) {
      const t = lines[j].trim();
      if (!t || indentOf(lines[j]) >= ind) continue;
      const n = j + 1;
      if (isPs) {
        if (/^FUNCTION\b/.test(t)) return ` It's indented, so it's part of the function on line ${n} and runs each time the function is called.`;
        if (/^REPEAT\b|^FOR\b|^WHILE\b/.test(t)) return ` It's indented, so it's inside the loop on line ${n} and runs every time round.`;
        if (/^ELSE\b(?! IF)/.test(t)) return ` It's indented under ELSE on line ${n}, so it only runs when the condition above was false.`;
        if (/^(IF|ELSE IF)\b/.test(t)) return ` It's indented under line ${n}, so it only runs when that condition is true.`;
        return "";
      }
      if ((m = t.match(/^def\s+(\w+)/))) return ` It's indented, so it's part of the function ${m[1]} on line ${n} and only runs when ${m[1]}() is called.`;
      if (/^with\b/.test(t)) return ` It's indented under line ${n}, so it runs while the file is open.`;
      if (/^while\b/.test(t)) return ` It's indented, so it's inside the while loop on line ${n} and runs every time round.`;
      if (/^for\b/.test(t)) return ` It's indented, so it's inside the for loop on line ${n} and runs once for each value.`;
      if (/^else\s*:/.test(t)) return ` It's indented under else on line ${n}, so it only runs when every condition above was False.`;
      if (/^else\b/.test(t)) return ` It's indented under line ${n}, so it only runs when that condition is True.`;
      if (/^(if|elif)\b/.test(t)) return ` It's indented under line ${n}, so it only runs when that condition is True.`;
      return "";
    }
    return "";
  }
  // Not indented: does it come after a loop that has just finished?
  for (let j = i - 1; j >= 0; j--) {
    const t = lines[j].trim();
    if (!t) continue;
    if (indentOf(lines[j]) > 0) continue;
    const loop = isPs ? /^(REPEAT|FOR|WHILE)\b/ : /^(while|for)\b/;
    if (isPs && /^END (REPEAT|FOR|WHILE)\b/.test(t)) return " It comes after the loop, so it runs once the loop has finished.";
    if (!isPs && loop.test(t) && j < i - 1) return ` It isn't indented, so it's not part of the loop on line ${j + 1}. It runs once, after the loop has finished.`;
    return "";
  }
  return "";
}

/* ---------- Python ---------- */
const NOTES = [
  [/\bint\(/, "int() turns a value into a whole number."],
  [/\bfloat\(/, "float() turns a value into a decimal number."],
  [/\bstr\(/, "str() turns a value into text."],
  [/\blen\(/, "len() counts the characters in text, or the items in a list."],
  [/\.upper\(\)/, ".upper() gives a copy in CAPITAL letters."],
  [/\.lower\(\)/, ".lower() gives a copy in small letters."],
  [/\.replace\(/, ".replace(a, b) gives a copy with every a swapped for b."],
  [/\.read\(\)/, ".read() gives everything in the file as one piece of text."],
  [/\blistdir\(\)/, "listdir() gives a list of the names of the files saved on the micro:bit."],
  [/\w\[[^\]]+\]/, "[ ] picks one item by its index, counting from 0."],
  [/\s%\s/, "% gives the remainder after dividing."],
  [/\/\//, "// divides and drops anything after the decimal point."],
  [/\brandom\.randint\(/, "random.randint(a, b) picks a random whole number from a to b."],
  [/\bround\(/, "round() rounds to the nearest whole number."]
];
const notesFor = expr => NOTES.filter(([re]) => re.test(expr)).map(([, n]) => " " + n).join("");

// Who is called: a function defined in this program, or a built-in one
function callWords(name, args, lines) {
  const at = lines.findIndex(l => new RegExp(`^\\s*def\\s+${name}\\b`).test(l));
  const given = args.trim() ? `, giving it ${args.trim()}` : "";
  return at > -1
    ? `Calls (runs) the function ${name}, defined on line ${at + 1}${given}. Its indented lines run now, then the program carries on here.`
    : `Calls (runs) the function ${name}${given}.`;
}
const MODES = {
  r: "reading (\"r\"): the program can read what's in the file",
  w: "writing (\"w\"): it starts empty, so anything already in the file is wiped",
  a: "appending (\"a\"): new writing goes on the end, after what's already there",
  x: "creating (\"x\"): it makes a new file, and stops with an error if the file already exists"
};
function describeValue(expr) {
  const e = expr.trim();
  if (/^-?\d+$/.test(e)) return e;
  if (/^-?\d*\.\d+$/.test(e)) return `the decimal number ${e}`;
  if (/^(["']).*\1$/.test(e)) return `the text ${e}`;
  if (e === "True" || e === "False") return e;
  return null;
}

function pyLine(raw, lines, i) {
  let m;
  // Read past small mistakes so a buggy line is explained like the correct one:
  // a missing or extra colon, a stray semicolon, brackets round a loop header.
  let t = raw.replace(/;\s*$/, "");
  if ((m = t.match(/^else\s*:\s*(\S.*)$/))) { const then = pyLine(m[1], lines, i); return "Only when every condition above was False" + (then ? ": " + then[0].toLowerCase() + then.slice(1) : ", it runs " + m[1] + "."); }
  t = t.replace(/^else\s+:/, "else:").replace(/^else if\b/, "elif").replace(/^else\s+(?!if\b)([^:].*?):?$/, "elif $1:");
  if (/^(while|for|if|elif|def|with)\b/.test(t) || /^else\b/.test(t)) t = t.replace(/:?\s*$/, ":");
  else if (!/^#/.test(t)) t = t.replace(/:\s*$/, "");
  t = t.replace(/^(while|if|elif) (\(.+\)):$/, (all, kw, c) => (wrapped(c) ? `${kw} ${c.slice(1, -1)}:` : all)).replace(/^for \((\w+) in (.+)\):$/, "for $1 in $2:");
  if (/^#/.test(t)) return "A comment. Python ignores everything after #. It's a note for people reading the code.";
  if (/^from microbit import \*$/.test(t)) return "Loads the micro:bit tools (display, the buttons, sleep and more) so the program can use them.";
  if ((m = t.match(/^import (\w+)$/))) return `Loads Python's ${m[1]} module so the program can use it.`;

  if (/^while True:$/.test(t)) return "Repeats the indented lines below for ever. Only break (or switching off the micro:bit) stops it.";
  if ((m = t.match(/^while (.+):$/))) {
    const c = cond(m[1]);
    return `A while loop. Before every trip round, Python checks whether ${c.words}${c.note}. If that's True, the indented lines below run; if it's False, the loop ends and the program carries on after it.`;
  }
  if ((m = t.match(/^for (\w+) in range\((.*)\):$/))) {
    const args = splitArgs(m[2]), vals = rangeVals(args);
    if (vals) return `A for loop. ${m[1]} takes each number from range(${args.join(", ")}) in turn: ${listNums(vals)}. The indented lines run once for each number, so ${plural(vals.length, "time")} in all. The stop number is never included.`;
    const [a, b] = args.length === 1 ? ["0", args[0]] : args;
    return `A for loop. ${m[1]} counts from ${a} up to, but not including, ${b}, and the indented lines run once for each number.`;
  }
  if ((m = t.match(/^for (\w+) in (.+):$/))) return `A for loop. ${m[1]} takes each value from ${m[2]} in turn, and the indented lines run once for each one.`;
  if ((m = t.match(/^if (.+):$/))) { const c = cond(m[1]); return `Checks whether ${c.words}${c.note}. If that's True, the indented lines below run. If not, Python skips them.`; }
  if ((m = t.match(/^elif (.+):$/))) { const c = cond(m[1]); return `Only checked if every condition above was False. Then it checks whether ${c.words}${c.note}, and runs its indented lines if that's True.`; }
  if (/^else:$/.test(t)) return "Runs its indented lines only when every condition above was False.";
  if ((m = t.match(/^def\s+(\w+)\s*(?:\((.*)\))?\s*:$/))) {
    const params = (m[2] || "").trim();
    return `Defines (creates) a function called ${m[1]}${params ? ` that takes ${/,/.test(params) ? "the inputs" : "an input"} ${params}` : ""}. The indented lines below are its body: they don't run now, only when the program calls ${m[1]}(${params ? "…" : ""}).`;
  }
  if ((m = t.match(/^return\b\s*(.*)$/))) {
    if (!m[1]) return "Ends the function and goes back to where it was called.";
    const cmp = /(<=|>=|==|!=|<|>)/.test(m[1]) && !/^["']/.test(m[1]);
    return cmp
      ? `Sends back True or False (whether ${cond(m[1]).words}) to where the function was called, and ends the function.${notesFor(m[1])}`
      : `Sends ${m[1]} back to where the function was called, and ends the function.${notesFor(m[1])}`;
  }
  if ((m = t.match(/^with open\((.+?)(?:,\s*(.+?))?\)\s*(?::\s*)?as:?\s*(\w+)\s*:?$/)) || (m = t.match(/^with open\((.+?)(?:,\s*(.+?))?\)\s*:?\s*as\s+(\w+)\s*:?$/))) {
    const mode = (m[2] || "").replace(/^["']|["']$/g, "");
    const how = !m[2] ? "for reading (no mode given, so it reads)" : MODES[mode] ? "for " + MODES[mode] : `with the mode ${m[2]}`;
    return `Opens the file ${m[1]} ${how}. Inside the indented lines below, the open file is called ${m[3]}. When they finish, Python closes the file and saves it.`;
  }
  if ((m = t.match(/^(\w+)\.write\((.*)\)$/))) return `Writes ${m[2] || "nothing"} into the open file. Only what you write goes in: a new line needs \\n.${notesFor(m[2])}`;
  if ((m = t.match(/^(\w+)\.append\((.*)\)$/))) return `Adds ${m[2] || "an item"} to the end of the list ${m[1]}.`;
  if ((m = t.match(/^(\w+)\.insert\((.*)\)$/))) { const [at, x] = splitArgs(m[2]); return `Puts ${x ?? "an item"} into the list ${m[1]} at index ${at ?? "?"}, moving the items after it along one place.`; }
  if ((m = t.match(/^(\w+)\.remove\((.*)\)$/))) return `Removes the first item equal to ${m[2] || "?"} from the list ${m[1]}.`;
  if ((m = t.match(/^(\w+)\.pop\((.*)\)$/))) return m[2] ? `Removes the item at index ${m[2]} from the list ${m[1]}.` : `Removes the last item from the list ${m[1]}.`;
  if ((m = t.match(/^microphone\.set_threshold\((.+)\)$/))) { const [, lvl] = splitArgs(m[1]); return `Sets how loud a sound has to be (0 to 255) to count as LOUD${lvl ? `: here ${lvl}` : ""}.`; }
  if ((m = t.match(/^(\w+)\[(.+?)\]\s*=(?!=)\s*(.+)$/))) return `Changes the item at index ${m[2]} of the list ${m[1]} (counting from 0) to ${m[3]}.${notesFor(m[3])}`;
  if (t === "break") return "Leaves the loop straight away. The program carries on after the loop.";
  if (t === "pass") return "Does nothing. It holds a place where Python needs at least one line.";

  // count = count + 1, count += 1
  if ((m = t.match(/^(\w+)\s*=\s*\1\s*([+\-*/])\s*(.+)$/)) || (m = t.match(/^(\w+)\s*([+\-*/])=\s*(.+)$/))) {
    const [, v, op, n] = m;
    const verb = { "+": `Adds ${n} to ${v}`, "-": `Takes ${n} away from ${v}`, "*": `Multiplies ${v} by ${n}`, "/": `Divides ${v} by ${n}` }[op];
    return `${verb}, then stores the answer back in ${v}.`;
  }
  // count == count + 1 on its own: a comparison, not an assignment
  if ((m = t.match(/^(\w+)\s*==\s*(.+)$/))) return `Compares ${m[1]} with ${m[2]} (True or False) and throws the answer away. It doesn't change ${m[1]}: storing a value needs a single =.`;
  if ((m = t.match(/^(\w+)\s*=(?!=)\s*(.+)$/))) {
    const [, v, expr] = m;
    const before = lines.slice(0, i).some(l => new RegExp(`^\\s*${v}\\s*=(?!=)`).test(l) || new RegExp(`^\\s*for\\s+${v}\\b`).test(l));
    const start = before ? `Changes ${v} to` : `Creates a variable called ${v} and stores`;
    const tail = isConst(v) ? ` The capital letters show it's a constant: a fixed value that doesn't change.` : "";
    if (/^\[\s*\]$/.test(expr)) return `${before ? `Empties the list ${v}` : `Creates an empty list called ${v}`}. Items can be added later with ${v}.append().`;
    if (/^\[.*\]$/.test(expr)) { const items = splitArgs(expr.slice(1, -1)); return `${before ? `Changes ${v} to` : `Creates a list called ${v} holding`} ${plural(items.length, "item")}: ${items.join(", ")}. The first item is at index 0.`; }
    if (/^int\(input\(.*\)\)$/.test(expr)) return `Asks the user to type something, turns the answer into a whole number with int(), and stores it in ${v}.`;
    if (/^input\(.*\)$/.test(expr)) return `Asks the user to type something and stores the answer in ${v}. input() always gives text (a string).`;
    const val = describeValue(expr);
    if (val) return `${start} ${val}${before ? "" : " in it"}.${tail}`;
    if ((m = expr.match(BUTTON))) return `Stores True or False in ${v}: whether button ${m[1].toUpperCase()} ${m[2] === "is_pressed" ? "is being pressed" : "has been pressed"} right now.`;
    if (/^temperature\(\)$/.test(expr)) return `Reads the temperature sensor and stores the reading in ${v}.`;
    for (const [re, words] of SENSORS) if (new RegExp(`^${re.source}$`).test(expr)) return `Reads ${expr.replace(re, words)} and stores it in ${v}.`;
    if ((m = expr.match(/^(\w+)\.pop\((.*)\)$/))) return `Removes ${m[2] ? `the item at index ${m[2]}` : "the last item"} from the list ${m[1]} and stores it in ${v}.`;
    if (/^random\.randint\(/.test(expr)) return `Picks a random whole number and stores it in ${v}.`;
    if (/(<=|>=|==|!=|<|>)/.test(expr) && !/^["'(\[]/.test(expr)) return `Stores True or False in ${v}: whether ${cond(expr).words}.${notesFor(expr)}`;
    return `Works out ${expr} and stores the answer in ${v}.${tail}${notesFor(expr)}`;
  }

  if ((m = t.match(/^print\((.*)\)$/))) return m[1] ? `Prints ${m[1]} in the serial pane, on its own line.` : "Prints an empty line in the serial pane.";
  if ((m = t.match(/^display\.scroll\((.+)\)$/))) return `Scrolls ${m[1]} across the LED display, one character at a time.`;
  if ((m = t.match(/^display\.show\(Image\.(\w+)\)$/))) return `Shows the ${m[1]} picture on the LED display.`;
  if ((m = t.match(/^display\.show\((.+)\)$/))) return `Shows ${m[1]} on the LED display.`;
  if (/^display\.clear\(\)$/.test(t)) return "Turns every LED on the display off.";
  if ((m = t.match(/^display\.set_pixel\((.+)\)$/))) { const [x, y, b] = splitArgs(m[1]); return `Turns on the LED in column ${x}, row ${y} at brightness ${b} (0 is off, 9 is brightest).`; }
  if ((m = t.match(/^sleep\((\d+)\)$/))) return `Waits ${m[1]} milliseconds (${+m[1] / 1000} ${+m[1] === 1000 ? "second" : "seconds"}) before the next line.`;
  if ((m = t.match(/^sleep\((.+)\)$/))) return `Waits ${m[1]} milliseconds before the next line.`;
  if ((m = t.match(/^music\.pitch\((.+)\)$/))) { const [f, ms] = splitArgs(m[1]); return `Plays a ${f} Hz note${ms ? ` for ${ms} milliseconds` : ""}.`; }
  if ((m = t.match(/^from (\w+) import (.+)$/))) return `Loads ${m[2] === "*" ? "everything" : m[2]} from Python's ${m[1]} module so the program can use it.`;
  if ((m = t.match(/^(\w+)\((.*)\)$/)) && !/^(print|sleep|input|int|float|str|len|range)$/.test(m[1])) return callWords(m[1], m[2], lines);
  // A line that starts with a keyword but is too broken to read: say what the keyword is for
  if ((m = t.match(/^(elif|if|while|for|def|return|else|with)\b/))) return {
    elif: "An elif: checked only if every condition above was False.", if: "An if: it checks a condition before running its indented lines.",
    while: "A while loop: it repeats its indented lines while a condition is True.", for: "A for loop: it repeats its indented lines once for each value.",
    def: "Defines (creates) a function.", return: "Sends a value back from a function.", else: "An else: its lines run when every condition above was False.",
    with: "Opens something (usually a file) for the indented lines below."
  }[m[1]];
  // An expression on its own: a comparison, or something worked out
  if (/(<=|>=|==|!=|<|>)/.test(t) && !/^["']/.test(t)) return `Checks whether ${cond(t).words}. That gives True or False.${notesFor(t)}`;
  if (/[\w)\]"']/.test(t) && !/\s(is|are|the|a)\s/.test(t)) return `Works out ${t}.${notesFor(t)}`;
  return null;
}

export function explainPy(lines, i) {
  const raw = (lines[i] || "").trim();
  const t = raw.startsWith("#") ? raw : strip(raw);
  if (!t) return null;
  const what = pyLine(t, lines, i);
  if (!what) return null;
  return /^(#|from |import )/.test(t) ? what : what + context(lines, i, false);
}

/* ---------- pseudocode ---------- */
function psCond(src) {
  const c = cond(src.replace(/ is not pressed$/, " not pressed"));
  return c.words.replace(/ is True$/, "") + c.note;
}

function psLine(t) {
  let m;
  if ((m = t.match(/^FUNCTION (\w+)(?: WITH (.+))?$/))) return `Starts a function called ${m[1]}${m[2] ? ` that takes ${m[2]}` : ""}. Its lines, up to END FUNCTION, only run when the function is called. In Python: def ${m[1]}(${m[2] || ""}):.`;
  if (/^END FUNCTION$/.test(t)) return "Marks the end of the function. Python has no line for this: the indented lines end the function.";
  if ((m = t.match(/^CALL (\w+)(?: WITH (.+))?$/))) return `Runs the function ${m[1]}${m[2] ? `, giving it ${m[2]}` : ""}. In Python: ${m[1]}(${m[2] || ""}).`;
  if ((m = t.match(/^RETURN (.+)$/))) return `Sends ${m[1]} back to where the function was called, and ends the function. In Python: return.`;
  if ((m = t.match(/^ADD (.+) TO THE END OF (\w+)$/))) return `Adds ${m[1]} to the end of the list ${m[2]}. In Python: ${m[2]}.append(${m[1]}).`;
  if ((m = t.match(/^REMOVE (.+) FROM (\w+)$/))) return `Removes ${m[1]} from the list ${m[2]}. In Python: ${m[2]}.remove(${m[1]}).`;
  if ((m = t.match(/^OPEN (\S+) FOR (READING|WRITING|APPENDING)$/))) return `Opens the file ${m[1]} for ${m[2].toLowerCase()}.${m[2] === "WRITING" ? " Writing starts with an empty file." : ""} In Python: with open("${m[1]}", "${m[2][0].toLowerCase()}") as file:.`;
  if ((m = t.match(/^WRITE (.+)$/))) return `Writes ${m[1]} into the open file.${/⏎/.test(m[1]) ? " ⏎ means a new line (\\n in Python)." : ""}${/AS TEXT/.test(m[1]) ? " AS TEXT means turn it into text first: str() in Python." : ""}`;
  if ((m = t.match(/^SET (\w+) TO READ\b(.*)$/))) return `Reads the file and stores what's in it in ${m[1]}. In Python: ${m[1]} = file.read().`;
  if ((m = t.match(/^ELSE (?!IF\b)(SHOW|DISPLAY|SCROLL|PRINT|SET|WAIT|PLAY|CLEAR)\b(.*)$/))) return "When the conditions above were all false: " + (psLine(m[1] + m[2]) || "");
  if ((m = t.match(/^ELSE (?!IF\b)(.+)$/))) t = `ELSE IF ${m[1]}`;
  if ((m = t.match(/^SET (\w+) TO INPUT\b(.*)$/i))) return `Asks the user to type a value and stores it in ${m[1]}. In Python: ${m[1]} = input().`;
  if ((m = t.match(/^SET (\w+) TO (.+)$/))) return `Stores ${m[2]} in ${m[1]}. In Python: ${m[1]} = ${m[2]}.`;
  if ((m = t.match(/^SET (.+?) TO (.+)$/))) return `Sets ${m[1]} to ${m[2]}.`;
  if ((m = t.match(/^ADD (.+) TO (\w+)$/))) return `Adds ${m[1]} to ${m[2]}. In Python: ${m[2]} = ${m[2]} + ${m[1]}.`;
  if ((m = t.match(/^SUBTRACT (.+) FROM (\w+)$/))) return `Takes ${m[1]} away from ${m[2]}. In Python: ${m[2]} = ${m[2]} - ${m[1]}.`;
  if ((m = t.match(/^INPUT (\w+)$/))) return `Asks the user to type a value and stores it in ${m[1]}.`;
  if (/^REPEAT FOREVER$/.test(t)) return "Repeats the lines up to END REPEAT for ever. In Python: while True:.";
  if ((m = t.match(/^REPEAT WHILE (.+)$/))) return `Repeats the lines up to END REPEAT while ${psCond(m[1])}. The check happens before every trip round. In Python: a while loop.`;
  if ((m = t.match(/^REPEAT (\d+) TIMES?$/))) return `Repeats the lines up to END REPEAT ${plural(+m[1], "time")}. In Python: for i in range(${m[1]}):.`;
  if ((m = t.match(/^FOR (\w+) FROM (-?\d+) TO (-?\d+)(?: STEP (-?\d+))?$/))) {
    const [, v, a, b, st = "1"] = m, step = +st, stop = +b + (step > 0 ? 1 : -1);
    const vals = rangeVals([a, String(stop), st]) || [];
    const py = step === 1 ? (+a === 0 ? `range(${stop})` : `range(${a}, ${stop})`) : `range(${a}, ${stop}, ${st})`;
    return `${v} counts from ${a} to ${b}${step !== 1 ? ` in steps of ${st}` : ""}: ${listNums(vals)}. In pseudocode TO includes ${b}, so in Python it's ${py}.`;
  }
  if ((m = t.match(/^FOR (\w+) FROM (.+) TO (.+)$/))) return `${m[1]} counts from ${m[2]} to ${m[3]}, including ${m[3]}. In Python, range() stops one before, so add 1 to the stop number.`;
  if ((m = t.match(/^FOR EACH index (\w+) OF (.+)$/))) return `Goes through the positions of ${m[2]} one at a time: ${m[1]} is 0, then 1, and so on.`;
  if ((m = t.match(/^FOR EACH (\w+) IN (.+)$/))) return `Goes through ${m[2]} one item at a time, calling each one ${m[1]}.`;
  if ((m = t.match(/^END (REPEAT|FOR|WHILE|IF)$/))) return `Marks the end of the ${m[1] === "IF" ? "IF" : "loop"}. Python has no line for this: the indented lines end the block.`;
  if ((m = t.match(/^ELSE IF (.+?)(?: THEN)?$/))) return `Only checked if the condition above was false. Then, if ${psCond(m[1])}, its indented lines run. In Python: elif.`;
  if (/^ELSE$/.test(t)) return "Its indented lines run only when the conditions above were all false. In Python: else:.";
  if ((m = t.match(/^IF (.+?)(?: THEN)?$/))) return `If ${psCond(m[1])}, the indented lines below run. Otherwise they're skipped. In Python: if.`;
  if (/^STOP REPEATING$/.test(t)) return "Leaves the loop straight away. In Python: break.";
  if ((m = t.match(/^(SHOW|DISPLAY) (.+)$/))) return `Shows ${m[2]} on the LED display.`;
  if ((m = t.match(/^SCROLL (.+)$/))) return `Scrolls ${m[1]} across the LED display.`;
  if ((m = t.match(/^PRINT (.+)$/))) return `Prints ${m[1]} in the serial pane. In Python: print().`;
  if ((m = t.match(/^WAIT (.+)$/))) return `Pauses for ${m[1]} before the next line. In Python: sleep().`;
  if (/^CLEAR\b/.test(t)) return "Turns every LED off. In Python: display.clear().";
  if ((m = t.match(/^PLAY (.+)$/))) return `Plays ${m[1]} on the speaker.`;
  return null;
}

export function explainPs(lines, i) {
  const t = (lines[i] || "").trim();
  if (!t || /\{\{/.test(t)) return null; // blank, or a fill-in-the-blank line (that would give the answer away)
  const what = psLine(t);
  return what ? what + (/^END /.test(t) ? "" : context(lines, i, true)) : null;
}
