/* Syntax colouring for Python and pseudocode. Both return HTML built from escaped text. */
export const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export function hl(src) {
  const re = /(#.*$)|("[^"]*"|'[^']*')|\b(def|return|while|if|elif|else|break|for|in|from|import|True|False|None|pass|and|or|not)\b|\b(\d+)\b|\b([A-Za-z_]\w*)(?=\()/gm;
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const cls = m[1] ? "t-com" : m[2] ? "t-str" : m[3] ? "t-kw" : m[4] ? "t-num" : "t-fn";
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}
export const PS_KEYWORDS = new Set(["SET", "TO", "INPUT", "DISPLAY", "SCROLL", "SHOW", "IF", "THEN", "ELSE", "END", "REPEAT", "FOREVER", "WAIT", "CLEAR", "PLAY", "STOP", "REPEATING", "PRINT", "ADD", "SUBTRACT", "FROM", "CALL", "WITH", "AND", "OR", "NOT"]);
export const PS_NONE = "(no Python line: indentation ends the block)";
export function psHl(src) {
  return src.replace(/("[^"]*")|\b(\d+)\b|\b([A-Z]{2,})\b|([^"\dA-Z]+|.)/g, (m, str, num, word) => {
    if (str) return `<span class="t-str">${esc(str)}</span>`;
    if (num) return `<span class="t-num">${num}</span>`;
    if (word) return PS_KEYWORDS.has(word) ? `<span class="t-kw">${word}</span>` : esc(word);
    return esc(m);
  });
}
// Labs add their own pseudocode keywords (WHILE, FOR ...) when they load.
export const addPsKeywords = words => words.forEach(w => PS_KEYWORDS.add(w));
