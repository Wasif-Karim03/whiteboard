// Canonical UX-rule rows for design/final/tracker/fix_tracker.csv, derived from the journey-walk (JW) rows.
// Rule (journey-walk-2026-11.md: "one per rule and page cited by a severity 2+ finding"): for every JW row with
// severity >= 2, whatever its status (Duplicate-of rows included; checked against the original 139 rows on
// 15 Nov 2026, which need no exception), each UX-Rnn token in rule_ref × each page in pages gives one UX-Rnn-<page> row.
// roles is the union of the citing rows' roles in first-seen order over citing ids sorted ascending.
import { joinList, splitList } from "./csv.mjs";
import { FIX_COLUMNS } from "./schema.mjs";

const JW_ID = /^JW-\d{3}$/;
const MIN_SEVERITY = 2;
export const UX_SOURCE = "journey-walk-2026-11.md";

export const uxRulesOf = (ruleRef) => [...new Set(ruleRef.match(/UX-R\d\d/g) || [])];

// Map "UX-Rnn-Wxx" -> { rule, page, roles: [...], jw: [sorted JW ids] }, keys in sorted order.
export function deriveUxPairs(fixRows) {
  const citing = fixRows.filter((r) => JW_ID.test(r.fix_id) && r.severity.trim() !== "" && Number(r.severity.trim()) >= MIN_SEVERITY).sort((a, b) => a.fix_id.localeCompare(b.fix_id));
  const pairs = new Map();
  for (const r of citing) for (const rule of uxRulesOf(r.rule_ref)) for (const page of splitList(r.pages).map((p) => p.trim()).filter(Boolean)) {
    const id = `${rule}-${page}`;
    const prev = pairs.get(id) || { rule, page, roles: [], jw: [] };
    pairs.set(id, { ...prev, roles: [...new Set([...prev.roles, ...splitList(r.roles)])], jw: [...prev.jw, r.fix_id] });
  }
  return new Map([...pairs.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function buildUxRows(fixRows) {
  const blank = Object.fromEntries(FIX_COLUMNS.map((c) => [c, ""]));
  return [...deriveUxPairs(fixRows).entries()].map(([id, p]) => ({
    ...blank, fix_id: id, source: UX_SOURCE, type: "ux-rule", pages: p.page, roles: joinList(p.roles), rule_ref: p.rule, status: "Open", notes: `Cited by ${joinList(p.jw)}`,
  }));
}
