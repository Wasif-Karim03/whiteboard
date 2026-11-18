// Phase 2c offline check (team plan Step 8; Phase 4 lists it, the build proof needs it now). A built file
// must load nothing: no external elements, src or srcset, resource url(), @import, network APIs or http(s)
// loads, and it must carry a Content-Security-Policy meta. The spec file may cite https:// in plain text
// (counted), never inside an attribute value (double-, single- or un-quoted, entity-decoded). Source checks
// only; Phase 6 confirms file:// in browsers.
// Run: node design/final/tools/check_offline.mjs [distDir]
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DATA_DIR } from "./load_data.mjs";
import { SIZE_BUDGETS } from "./check_size.mjs";

const SPEC = "Whiteboard-Final-Spec.html";
const SVG_NS = new Set(["http://www.w3.org/2000/svg", "http://www.w3.org/1999/xlink"]);
const RULES = [
  [/<(link|iframe|img|audio|video|object)\b/gi, (m) => `<${m[1]}> element`],
  [/\bsrcset=/gi, () => "srcset="],
  [/\bsrc=/gi, () => "src="],
  [/url\((?!\s*["']?#)/gi, () => "url( resource"],
  [/@import\b/gi, () => "@import"],
  [/\b(fetch\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|import\()/g, (m) => `network API ${m[1]}`],
];

const TAG = /<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
const ATTR = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const LOAD_ATTRS = new Set(["src", "srcset"]);
const NAMED = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", colon: ":", sol: "/", period: "." };

function decodeEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);?/gi, (whole, ref) => {
    const key = ref.toLowerCase();
    if (ref[0] !== "#") return Object.prototype.hasOwnProperty.call(NAMED, key) ? NAMED[key] : whole;
    const code = key[1] === "x" ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10);
    return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
  });
}

// Every attribute of every tag: lower-case name and entity-decoded value (double-, single- or un-quoted).
export function tagAttributes(html) {
  const out = [];
  for (const tag of html.matchAll(TAG)) {
    for (const a of tag[2].matchAll(ATTR)) {
      out.push({ tag: tag[1].toLowerCase(), name: a[1].toLowerCase(), value: decodeEntities(a[2] ?? a[3] ?? a[4] ?? "") });
    }
  }
  return out;
}

function attributeErrors(name, html) {
  const attrs = tagAttributes(html);
  const loads = attrs.filter((a) => LOAD_ATTRS.has(a.name));
  const urls = attrs.filter((a) => /https?:\/\//i.test(a.value) && !SVG_NS.has(a.value.trim()));
  const errors = [];
  if (loads.length) errors.push(`offline: ${name}: ${loads[0].name} attribute on <${loads[0].tag}> (${loads.length}×)`);
  if (urls.length) errors.push(`offline: ${name}: http(s):// inside an attribute value (${urls.length}×)`);
  return errors;
}

function httpLoads(html) {
  return [...html.matchAll(/http:\/\/[^\s"'<>)]*/gi)].map((m) => m[0].replace(/[.,;]+$/, "")).filter((u) => !SVG_NS.has(u));
}

// Returns {errors, citations}.
export function offlineReport(name, html) {
  const errors = [];
  for (const [re, describe] of RULES) {
    const hits = [...html.matchAll(re)];
    if (hits.length) errors.push(`offline: ${name}: ${describe(hits[0])} (${hits.length}×)`);
  }
  for (const u of new Set(httpLoads(html))) errors.push(`offline: ${name}: http URL ${u}`);
  const https = (html.match(/https:\/\//gi) || []).length;
  if (name !== SPEC && https) errors.push(`offline: ${name}: ${https} https:// occurrence(s)`);
  errors.push(...attributeErrors(name, html));
  if (!/<meta http-equiv="Content-Security-Policy" content="[^"]+">/.test(html)) errors.push(`offline: ${name}: missing Content-Security-Policy meta`);
  return { errors, citations: name === SPEC ? https : 0 };
}

export function checkOffline(name, html) {
  return offlineReport(name, html).errors;
}

export function checkOfflineDir(distDir = path.join(DATA_DIR, "dist")) {
  return Object.keys(SIZE_BUDGETS).map((name) => {
    const file = path.join(distDir, name);
    if (!fs.existsSync(file)) return { name, errors: [`offline: ${name} is missing`], citations: 0 };
    return { name, ...offlineReport(name, fs.readFileSync(file, "utf8")) };
  });
}

function main() {
  const reports = checkOfflineDir(process.argv[2] ? path.resolve(process.argv[2]) : undefined);
  const errors = reports.flatMap((r) => r.errors);
  for (const e of errors) console.log(e);
  const cites = reports.reduce((n, r) => n + r.citations, 0);
  console.log(`check_offline: ${reports.length} files, ${errors.length} errors, ${cites} plain-text https citations in the spec. Source checks only.`);
  return errors.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
