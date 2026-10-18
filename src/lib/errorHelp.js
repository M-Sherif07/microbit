/* Plain-English help for a Python error in a student's own code ("Code it here").

errorHelp(err, lines) takes the error the simulator reported (a PyErr: type, msg, line) and the
program's lines, and returns HTML (code parts escaped, in <code>) that says what probably went
wrong, where, and how to fix it, without writing the fix for them. It always returns something:
when it can't tell more, it says how to read the message.
*/
import { esc } from "./highlight.js";
import { IMAGES } from "./microbit.js";

const c = s => `<code>${esc(s)}</code>`;
const KEYWORDS = ["while", "for", "if", "elif", "else", "def", "return", "import", "from", "break", "pass", "in", "not", "and", "or", "True", "False", "None"];
const FUNCTIONS = ["print", "sleep", "input", "int", "str", "float", "len", "range", "temperature"];
const DOTTED = [
  "display.scroll", "display.show", "display.clear", "display.set_pixel", "display.get_pixel", "display.read_light_level",
  "button_a.is_pressed", "button_a.was_pressed", "button_b.is_pressed", "button_b.was_pressed",
  "music.pitch", "pin1.read_analog", "microphone.set_threshold", "microphone.was_event", "random.randint"
];
// Things the simulator doesn't run yet: an error on these lines may not be the student's fault
const UNSUPPORTED = [
  [/^\s*(def|return)\b/, "functions (def and return)"],
  [/\[/, "lists"],
  [/^\s*(try|except|with|class)\b|\blambda\b/, "this part of Python"],
  [/\bf["']/, "f-strings"],
  [/^\s*import\s+(?!random|music)|^\s*from\s+(?!microbit\b)/, "this import"]
];

// How many single-letter changes turn a into b
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
// The closest name in `names` to `word`, if it's close enough to be a typo
function closest(word, names) {
  let best = null, bestD = Infinity;
  for (const n of names) {
    const dd = distance(word.toLowerCase(), n.toLowerCase());
    if (dd < bestD) { best = n; bestD = dd; }
  }
  const limit = word.length <= 3 ? 1 : word.length <= 6 ? 2 : 3;
  return bestD <= limit && best !== word ? best : null;
}
// Variables the program creates, with the line each is first set on
function variables(lines) {
  const vars = new Map();
  lines.forEach((l, i) => {
    const m = l.match(/^\s*([A-Za-z_]\w*)\s*(?:[+\-*/]?=)(?!=)/) || l.match(/^\s*for\s+([A-Za-z_]\w*)\s+in\b/);
    if (m && !vars.has(m[1])) vars.set(m[1], i + 1);
  });
  return vars;
}
// Real Python the simulator doesn't run yet: built-in functions and text / list / file methods
const NOT_SIMULATED_FN = ["len", "float", "abs", "round", "max", "min", "sum", "open", "listdir", "list", "bool", "type", "chr", "ord", "sorted"];
const NOT_SIMULATED_METHOD = ["upper", "lower", "replace", "strip", "split", "join", "append", "insert", "remove", "pop", "sort", "count", "index", "read", "write", "close", "startswith", "endswith", "isdigit"];
const notSimulated = what => `The simulator on this page doesn't run ${what} yet, so your code may still be fine. Try it in the micro:bit Python editor.`;
const indentOf = l => l.match(/^ */)[0].length;
const prevLine = (lines, n) => { for (let j = n - 2; j >= 0; j--) if (lines[j].trim() && !lines[j].trim().startsWith("#")) return j + 1; return 0; };
const isHeader = t => /^(while|for|if|elif|else|def|with)\b/.test(t);

/* ---------- each kind of error ---------- */
function syntax(t, n) {
  let m;
  if (/[“”‘’]/.test(t)) return `Line ${n} has curly quotes (“ ” or ‘ ’), which often come from copying out of a document. Python needs straight ones: ${c('"')} or ${c("'")}.`;
  const dq = (t.match(/"/g) || []).length, sq = (t.replace(/"[^"]*"/g, "").match(/'/g) || []).length;
  if (dq % 2 || sq % 2) return `A piece of text on line ${n} has no closing quote. Every ${c('"')} that starts some text needs another ${c('"')} to end it.`;
  const open = (t.match(/\(/g) || []).length, close = (t.match(/\)/g) || []).length;
  if (open > close) return `Line ${n} has ${open - close === 1 ? "a (" : `${open - close} (`} without a matching ${c(")")}. Count the brackets: every ${c("(")} needs a ${c(")")}.`;
  if (close > open) return `Line ${n} has ${close - open === 1 ? "an extra" : `${close - open} extra`} ${c(")")}. Count the brackets: every ${c(")")} needs a ${c("(")} before it.`;
  if ((m = t.match(/^(If|While|For|Elif|Else|Def|Print|Return)\b/))) return `Python is case-sensitive, so ${c(m[1])} isn't a word it knows. Write it in lower case: ${c(m[1].toLowerCase())}.`;
  if (/^else\s+if\b/.test(t)) return `Python spells "else if" as one word: ${c("elif")}.`;
  if (/^else\b\s*[^\s:]/.test(t)) return `${c("else")} never has a condition: it catches everything the if didn't. To check another condition, use ${c("elif")} instead.`;
  if (/^(elif|else)\b/.test(t)) return `${c(t.split(/\b/)[0])} has to come straight after an ${c("if")} block (or an ${c("elif")}), lined up exactly with the ${c("if")}. Check the indentation of line ${n} and the lines just above it.`;
  if (/^for\s+\w+\s*=/.test(t)) return `In Python a counting loop is written ${c("for i in range(5):")}, not with = and "to".`;
  if (isHeader(t) && !/:\s*(#.*)?$/.test(t)) return `Lines that start with ${c(t.split(/\b/)[0])} need a colon ${c(":")} at the end.`;
  if (/^(if|elif|while)\b.*[^=!<>]=[^=]/.test(t)) return `Line ${n} uses a single ${c("=")} in a condition. To compare, use ${c("==")}; a single ${c("=")} stores a value.`;
  if (/\+\+|--\s*$/.test(t)) return `Python has no ${c("++")} or ${c("--")}. To add 1, write it out: ${c("count = count + 1")}.`;
  if ((m = t.match(/^([A-Za-z_]\w*)\b/)) && !KEYWORDS.includes(m[1])) {
    const near = closest(m[1], KEYWORDS.concat(FUNCTIONS));
    if (near && /\s/.test(t.slice(m[1].length, m[1].length + 1))) return `Python doesn't know the word ${c(m[1])}. Did you mean ${c(near)}?`;
  }
  return `Python couldn't read line ${n}. Check its spelling, brackets, quotes and colon against an example that works.`;
}

function indentation(msg, lines, n) {
  const t = (lines[n - 1] || "").trim();
  if (/expected an indented block/.test(msg)) {
    if (/:\s*(#.*)?$/.test(t)) return `Line ${n} ends with a colon, but nothing under it is indented. Add the lines that belong to it, indented by 4 spaces (press Tab). If it should do nothing yet, put ${c("pass")} there.`;
    const p = prevLine(lines, n);
    return `Line ${p} ends with a colon, so line ${n} has to be indented to belong to it. Put 4 spaces (or press Tab) at the start of line ${n}.`;
  }
  if (/unexpected indent/.test(msg)) {
    const p = prevLine(lines, n), pt = p ? lines[p - 1].trim() : "";
    if (p && isHeader(pt) && !/:\s*(#.*)?$/.test(pt)) return `Line ${n} is indented as if it belongs to line ${p}, but line ${p} is missing its colon ${c(":")} at the end.`;
    return `Line ${n} is indented, but the line above it doesn't end with a colon, so nothing can go inside it. Line it up with line ${p || n - 1} by removing the extra spaces at the start.`;
  }
  // unindent does not match any outer indentation level
  const used = [...new Set(lines.slice(0, n - 1).filter(l => l.trim()).map(indentOf))].sort((a, b) => a - b);
  return `Line ${n} starts with ${indentOf(lines[n - 1] || "")} spaces, which doesn't line up with any block above it (they use ${used.join(", ")}). Indents go in steps of 4: line it up exactly with the block it belongs to.`;
}

function nameError(name, lines, n) {
  const vars = variables(lines);
  if (NOT_SIMULATED_FN.includes(name)) return notSimulated(c(name + "()"));
  if (/^(true|false|none)$/.test(name)) return `${c(name)} needs a capital letter: ${c(name[0].toUpperCase() + name.slice(1))}.`;
  if (/^[A-Z]/.test(name) && [...KEYWORDS, ...FUNCTIONS].includes(name.toLowerCase())) return `Python is case-sensitive: write ${c(name.toLowerCase())}, not ${c(name)}.`;
  if (vars.has(name) && vars.get(name) > n) return `${c(name)} is only created on line ${vars.get(name)}, but line ${n} runs first and needs it already. Set ${c(name)} on a line above line ${n}.`;
  const near = closest(name, [...vars.keys(), ...FUNCTIONS, ...KEYWORDS]);
  if (near) return `Python doesn't know ${c(name)}. Did you mean ${c(near)}${vars.has(near) ? ` (set on line ${vars.get(near)})` : ""}? Names have to match exactly.`;
  const t = (lines[n - 1] || "").trim();
  if (new RegExp(`(print|scroll|show)\\(\\s*${name}\\s*\\)`).test(t)) return `Python doesn't know a variable called ${c(name)}. If you meant the word itself, put it in quotes: ${c(`"${name}"`)}.`;
  return `Python doesn't know ${c(name)} yet. Create it first on a line above (for example ${c(`${name} = 0`)}), or check the spelling.`;
}

function attributeError(msg, lines, n) {
  let m;
  if ((m = msg.match(/type object 'Image' has no attribute '(\w+)'/))) {
    const near = closest(m[1], Object.keys(IMAGES));
    return `There's no picture called ${c("Image." + m[1])}.${near ? ` Did you mean ${c("Image." + near)}?` : ""} Pictures you can use include ${Object.keys(IMAGES).slice(0, 7).map(k => c("Image." + k)).join(", ")}.`;
  }
  const attr = (msg.match(/attribute '(\w+)'/) || [])[1];
  const t = lines[n - 1] || "";
  const full = (t.match(new RegExp(`([A-Za-z_]\\w*(?:\\.[A-Za-z_]\\w*)*)\\.${attr}\\b`)) || [])[0];
  if (full) {
    if (NOT_SIMULATED_METHOD.includes(attr)) return notSimulated(c("." + attr + "()"));
    const near = closest(full, DOTTED);
    if (near) return `Python doesn't know ${c(full)}. Did you mean ${c(near)}?`;
    return `The simulator doesn't know ${c(full)}. Check the spelling. If it's right, it may be something only a real micro:bit can do, so test it in the micro:bit Python editor.`;
  }
  return "Python doesn't know one of the names with a dot on this line. Check its spelling.";
}

function typeError(msg, lines, n) {
  let m;
  const t = (lines[n - 1] || "").trim();
  if (/can't convert '(int|float)' object to str implicitly/.test(msg)) {
    // Use the student's own variable in the example when we can see it next to the +
    const v = (t.match(/["']\s*\+\s*([A-Za-z_]\w*)\b(?!\s*\()/) || [])[1];
    return `You're joining text and a number with ${c("+")}. Turn the number into text first with ${c("str()")}: ${v ? `write ${c(`str(${v})`)} instead of ${c(v)}` : `for example ${c('"Score: " + str(score)')}`}.`;
  }
  if ((m = msg.match(/unsupported types for __add__: '(int|float)', 'str'/))) return `You're adding a number and some text. If the text holds a number (from ${c("input()")}, say), turn it into a number with ${c("int()")}; to join them as text, use ${c("str()")} on the number.`;
  if ((m = msg.match(/unsupported types for __(lt|gt|le|ge)__: '(\w+)', '(\w+)'/))) {
    const hasStr = m[2] === "str" || m[3] === "str";
    return hasStr ? `You're comparing text with a number. ${c("input()")} always gives text, so use ${c("int(input(...))")} to get a number you can compare.`
      : `Python can't compare a ${m[2]} with a ${m[3]}. Check what each side of the comparison holds (print them on the line before).`;
  }
  if ((m = msg.match(/unsupported types for __(sub|mul|truediv|mod)__: '(\w+)', '(\w+)'/))) return `You can only do ${{ sub: "-", mul: "*", truediv: "/", mod: "%" }[m[1]]} with numbers, but one side here is ${m[2] === "str" || m[3] === "str" ? "text. If it came from input(), wrap it in int()" : `a ${m[2] === "int" || m[2] === "float" ? m[3] : m[2]}`}.`;
  if ((m = msg.match(/^'(\w+)' object isn't callable/))) {
    const name = (t.match(/([A-Za-z_]\w*)\s*\(/) || [])[1];
    const what = { int: "a number", float: "a decimal number", str: "text", bool: "True or False", NoneType: "None" }[m[1]] || "a value";
    return `${name ? c(name) : "That name"} holds ${what}, not a function, so you can't run it with ${c("()")}. Did you give a variable the same name as a function?`;
  }
  if (/object isn't callable/.test(msg)) return "Something on this line has () after it but isn't a function. Check the spelling of the name before the brackets.";
  if (/range expected 1 to 3 arguments/.test(msg)) return `${c("range()")} needs 1 to 3 numbers: ${c("range(stop)")}, ${c("range(start, stop)")} or ${c("range(start, stop, step)")}.`;
  if (/can't convert float to int/.test(msg)) return `${c("range()")} only takes whole numbers. Use ${c("//")} instead of ${c("/")} to divide, or ${c("int()")} to make a whole number.`;
  if ((m = msg.match(/can't convert (\w+) to int/))) return m[1] === "str" ? `${c("range()")} needs numbers, not text. If the number came from ${c("input()")}, wrap it in ${c("int()")}.` : `This needs a whole number, but got a ${m[1]}.`;
  if (/can't convert to int/.test(msg)) return `${c("display.set_pixel()")} needs whole numbers: no decimals.`;
  if ((m = msg.match(/'(\w+)' object isn't iterable/))) return m[1] === "int" ? `A for loop can't go through a single number. To count, use ${c("range()")}: ${c("for i in range(5):")}.` : `A for loop can't go through a ${m[1]}. Use ${c("range()")} to count.`;
  if (/function takes 3 positional arguments/.test(msg)) return `${c("display.set_pixel()")} needs three numbers: column, row and brightness, for example ${c("display.set_pixel(2, 2, 9)")}.`;
  if (/__neg__/.test(msg)) return `A minus sign in front only works with a number.`;
  return "Two values on this line don't work together. Check what each one holds by printing it on the line before.";
}

function valueError(msg) {
  let m;
  if ((m = msg.match(/invalid syntax for integer with base 10: (.*)$/))) {
    const v = m[1];
    if (/^["']\s*-?\d+\.\d+\s*["']$/.test(v)) return `${c("int()")} can't read the decimal ${c(v)}. Use ${c("float()")} for decimals, or type a whole number.`;
    if (/^["']\s*["']$/.test(v)) return `${c("int()")} was given empty text. When ${c("input()")} asks, type a whole number before pressing Enter.`;
    return `${c("int()")} can only turn text that's a whole number (like ${c('"7"')}) into a number. It was given ${c(v)}. When ${c("input()")} asks, type digits only.`;
  }
  if (/zero step/.test(msg)) return `The step in ${c("range()")} can't be 0, or the count would never move. Use 1 to count up or -1 to count down.`;
  if (/index out of bounds/.test(msg)) return "The display is 5 × 5 LEDs, numbered 0 to 4 across and down. Both the column and the row must be 0 to 4.";
  if (/brightness out of bounds/.test(msg)) return "Brightness goes from 0 (off) to 9 (brightest).";
  return "A value on this line is the right type but not allowed here. Print it on the line before to see what it is.";
}

export function errorHelp(err, lines) {
  const n = err.line || 1, t = (lines[n - 1] || "").trim();
  let help;
  const hit = /SyntaxError|NameError|AttributeError/.test(err.type) && UNSUPPORTED.find(([re]) => re.test(t));
  if (hit) return `<strong>${esc(err.type)} on line ${n}.</strong> ${notSimulated(hit[1])}`;
  switch (err.type) {
    case "SyntaxError": help = syntax(t, n); break;
    case "IndentationError": help = indentation(err.msg, lines, n); break;
    case "NameError": help = nameError((err.msg.match(/name '(\w+)'/) || [])[1] || "", lines, n); break;
    case "AttributeError": help = attributeError(err.msg, lines, n); break;
    case "TypeError": help = typeError(err.msg, lines, n); break;
    case "ValueError": help = valueError(err.msg); break;
    case "ZeroDivisionError": help = `Line ${n} divides by zero, which isn't possible. Check the number after ${c("/")} or ${c("%")}: print it on the line before to see its value.`; break;
    default: help = "Read the message in the Serial pane, fix that line and run it again.";
  }
  return `<strong>${esc(err.type)} on line ${n}.</strong> ${help}`;
}
