// Phase 2c: a small, escape-first Markdown renderer for the spec file's Decisions section (team plan Step 7).
// Supports headings, paragraphs, nested "-" and "1." lists, bold, inline code and pipe tables. Every line is
// HTML-escaped before inline markup is applied, and Markdown links become plain text "label (path)", never
// an href, so the output carries no links or URLs as attributes.

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

const LIST_ITEM = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const TABLE_RULE = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;

function inlineText(text) {
  return esc(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => `${label} (${href})`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

// Code spans are split out first so their contents are escaped but never formatted.
export function inline(text) {
  return String(text).split(/(`[^`]*`)/).map((part) => (part.startsWith("`") && part.endsWith("`") && part.length > 1
    ? `<code>${esc(part.slice(1, -1))}</code>`
    : inlineText(part))).join("");
}

const cells = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

function table(lines) {
  const [head, , ...body] = lines;
  const th = cells(head).map((c) => `<th scope="col">${inline(c)}</th>`).join("");
  const rows = body.map((l) => `<tr>${cells(l).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table>`;
}

// items: [{depth, ordered, text}] → nested lists by indentation depth.
function list(items, depth = 0) {
  const out = [];
  let i = 0;
  const tag = items[0].ordered ? "ol" : "ul";
  while (i < items.length) {
    const item = items[i];
    let j = i + 1;
    while (j < items.length && items[j].depth > depth) j += 1;
    const children = items.slice(i + 1, j);
    out.push(`<li>${inline(item.text)}${children.length ? list(children, children[0].depth) : ""}</li>`);
    i = j;
  }
  return `<${tag}>${out.join("")}</${tag}>`;
}

function blocks(lines) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i += 1; continue; }
    const h = HEADING.exec(line);
    if (h) { const level = Math.min(h[1].length + 1, 6); out.push(`<h${level}>${inline(h[2])}</h${level}>`); i += 1; continue; }
    if (line.trim().startsWith("|") && TABLE_RULE.test(lines[i + 1] || "")) {
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith("|")) j += 1;
      out.push(table(lines.slice(i, j)));
      i = j;
      continue;
    }
    if (LIST_ITEM.test(line)) {
      const items = [];
      while (i < lines.length && LIST_ITEM.test(lines[i])) {
        const [, indent, marker, text] = LIST_ITEM.exec(lines[i]);
        items.push({ depth: Math.floor(indent.length / 2), ordered: /\d/.test(marker), text });
        i += 1;
      }
      out.push(list(items, items[0].depth));
      continue;
    }
    const para = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !HEADING.test(lines[i]) && !LIST_ITEM.test(lines[i]) && !lines[i].trim().startsWith("|")) {
      para.push(lines[i].trim());
      i += 1;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return out;
}

// Headings shift down one level (# → h2) because the spec page owns the h1.
export function renderMarkdown(md) {
  return blocks(String(md).replace(/\r\n/g, "\n").split("\n")).join("\n");
}
