// Source-level HTML checks for kit renders. A tokenizer, not a full parser: kit markup keeps
// attributes double-quoted and never puts ">" inside an attribute value.
// checkHtml(html) returns a list of problems; [] means clean.

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const TAG_RE = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w:-]*)((?:\s+[^\s=>/"]+(?:="[^"]*")?)*)\s*(\/?)>/g;
const ATTR_RE = /([^\s=>/"]+)(?:="([^"]*)")?/g;
const NO_COLOUR_ATTRS = /^(href|id|for|name|value|aria-.*|data-.*|role|type|class|title|alt|lang|scope|aria)$/;
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" };

const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
  if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENTITIES[e] ?? m;
});
const parseAttrs = (src) => {
  const out = {};
  for (const [, name, value] of src.matchAll(ATTR_RE)) out[name.toLowerCase()] = value === undefined ? "" : decode(value);
  return out;
};
const textOf = (fragment) => decode(fragment.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();

// Allowed: #fragment, a scheme-less relative path, https: and mailto:. Whitespace and control characters
// are stripped and the scheme is compared case-insensitively, so " JaVa\tscript:" is still rejected.
export function isSafeHref(href) {
  const clean = String(href).replace(/[\s\u0000-\u001f\u007f]/g, "").toLowerCase();
  if (clean === "") return false;
  const scheme = /^([a-z][a-z0-9+.-]*):/.exec(clean);
  if (!scheme) return !clean.startsWith("//");
  return scheme[1] === "https" || scheme[1] === "mailto";
}

export function checkHtml(html) {
  const problems = [];
  const add = (p) => problems.push(p);
  for (const bad of ["undefined", "NaN", "[object Object]", ">null<"]) if (html.includes(bad)) add(`contains "${bad}"`);
  if (/<script/i.test(html)) add("contains <script");
  if (/\b(rgb|rgba|hsl|hsla)\(/i.test(html)) add("contains a colour function");

  const ids = new Map();
  const refs = [];
  const stack = [];
  const named = [];
  for (const m of html.matchAll(TAG_RE)) {
    if (m[0].startsWith("<!--")) continue;
    const [whole, closing, rawName, attrSrc, selfClose] = m;
    const tag = rawName.toLowerCase();
    if (closing) {
      const top = stack.pop();
      if (!top || top.tag !== tag) { add(`unbalanced </${tag}> (open: ${top ? top.tag : "none"})`); if (top) stack.push(top); continue; }
      if (top.needsName && !top.attrs["aria-label"]?.trim() && !textOf(html.slice(top.end, m.index))) add(`<${tag}> has no accessible name`);
      continue;
    }
    const attrs = parseAttrs(attrSrc);
    // M6: layout comes from K.stack, K.grid and K.rail; the progress bar width is the one allowed style.
    if ("style" in attrs) {
      const progress = (attrs.class || "").split(/\s+/).includes("wb-progress__bar") && /^width:\d+(\.\d+)?%$/.test(attrs.style);
      if (!progress) add(`<${tag}> has a style attribute (use K.stack, K.grid or K.rail)`);
    }
    for (const [name, value] of Object.entries(attrs)) {
      if (/^on/i.test(name)) add(`<${tag}> has inline handler ${name}`);
      if (!NO_COLOUR_ATTRS.test(name) && /#[0-9a-f]{3,8}\b/i.test(value)) add(`<${tag} ${name}> holds a colour literal`);
    }
    if (attrs.id !== undefined) {
      if (!attrs.id) add(`<${tag}> has an empty id`);
      else if (ids.has(attrs.id)) add(`duplicate id "${attrs.id}"`);
      else ids.set(attrs.id, tag);
    }
    for (const ref of ["for", "aria-labelledby", "aria-describedby", "aria-controls", "data-target"])
      if (attrs[ref] !== undefined) for (const id of attrs[ref].split(/\s+/).filter(Boolean)) refs.push([tag, ref, id]);
    if (attrs.role === "button") add(`<${tag}> uses role="button"`);
    const classes = (attrs.class || "").split(/\s+/);
    // Actions are <button>; destinations in action lists are button-styled <a href> (A-R8).
    const isDestination = tag === "a" && attrs.href !== undefined;
    if (tag !== "button" && !isDestination && classes.some((c) => c === "wb-btn" || c.startsWith("wb-btn--"))) add(`<${tag}> has a wb-btn class but is not a <button> or <a href>`);
    if (tag === "button" && attrs.type !== "button") add(`<button> without type="button"`);
    if (tag === "a") {
      if (attrs.href === undefined) add("<a> without href");
      else if (!isSafeHref(attrs.href)) add(`<a> has unsafe href "${attrs.href}"`);
    }
    if (tag === "img" && attrs.alt === undefined) add("<img> without alt");
    if ((tag === "input" || tag === "select" || tag === "textarea") && !attrs["aria-label"]) named.push([tag, attrs.id]);
    if (VOID.has(tag) || selfClose) continue;
    stack.push({ tag, attrs, end: m.index + whole.length, needsName: tag === "button" || tag === "a" });
  }
  for (const open of stack) add(`unclosed <${open.tag}>`);
  const labelled = new Set(refs.filter(([tag, ref]) => tag === "label" && ref === "for").map(([, , id]) => id));
  for (const [tag, id] of named) if (!id || !labelled.has(id)) add(`<${tag}${id ? ` id="${id}"` : ""}> has no <label for> or aria-label`);
  for (const [tag, ref, id] of refs) if (!ids.has(id)) add(`<${tag} ${ref}="${id}"> does not resolve`);
  return problems;
}
