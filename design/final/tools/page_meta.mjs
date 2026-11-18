// Hand-transcribed page metadata for the 63 board pages, plus the BD11 platform tier rule.
// Every constant names its source as path:line. Board roles (s, i, a, g) come from the board PAGES array.
const DD = "design/reviews/board-deep-dive-2026-11-15.md";

const ids = (prefix, from, to) => Array.from({ length: to - from + 1 }, (_, k) => `${prefix}${String(from + k).padStart(2, "0")}`);
const assign = (groups) => Object.freeze(Object.fromEntries(groups.flatMap(([value, list]) => list.map((id) => [id, value]))));

// Segment membership: DD:75–80.
export const SEGMENTS = assign([
  [1, [...ids("W", 1, 4), ...ids("W", 8, 13)]],
  [2, [...ids("W", 5, 7), ...ids("W", 14, 18), "W32"]],
  [3, ids("W", 19, 27)],
  [4, [...ids("W", 28, 31), "W33", "W34", "W47", "W55", "W56"]],
  [5, [...ids("W", 35, 46), "W59", "W60"]],
  [6, [...ids("W", 48, 54), "W57", "W58", ...ids("O", 1, 3)]],
]);

// Build stage per page (Spec 05), from the page map: DD:88–150.
export const STAGES = assign([
  ["0", ["W01", "W02", "W03", "W04", "W05", "W06", "W10", "W13"]],
  ["1", [...ids("W", 14, 24), ...ids("W", 35, 40), "W43", "W44", "W48", "W49", "W51", "W52", "W53"]],
  ["2", ["W25", "W26", "W27", "W41", "W42", "W45", "W46", "W47", "W50", "W54", "W57"]],
  ["3", ["W07", "W08", "W09", "W11", "W12", ...ids("W", 28, 34), "W55", "W56"]],
  ["4", ["W58", "W59", "W60"]],
  ["opt", ids("O", 1, 3)],
]);

// Journey paths: DD:161–172.
export const JOURNEY_PAGES = Object.freeze({
  J01: ["W01", "W02", "W03", "W04", "W05"],
  J02: ["W06", "W14", "W16", "W17", "W18", "W19", "W20", "W21", "W22"],
  J03: ["W48", "W49", "W50", "W51", "W53", "W23", "W24"],
  J04: ["W35", "W36", "W37", "W38", "W39", "W40", "W43", "W44", "W14"],
  J05: ["W41", "W42", "W25", "W26", "W27", "W53", "W24"],
  J06: ["W52", "W51", "W24", "W54", "W53", "W23"],
  J07: ["W47", "W40", "W33", "W34", "W19", "W20", "W21", "W22", "W49"],
  J08: ["W45", "W57", "W05", "W07", "W48", "W49"],
  J09: ["W55", "W28", "W29", "W08", "W30", "W31", "W56"],
  J10: ["W36", "W32", "W07", "W08"],
  J11: ["W46", "W19", "W25", "W58", "W54"],
  J12: ["W06", "W59", "W60", "W35"],
});

// Handoff tier on iPad and iPhone: final-design-plan-2026-11-15.md:63 (W42, W60, O02).
export const HANDOFF = Object.freeze(["W42", "W60", "O02"]);
// BD6 iPad staff pages: board-decisions-2026-11-15.md:12.
export const IPAD_FULL_STAFF = Object.freeze(["W48", "W49", "W51", "W53", "W57"]);
export const IPAD_TIER_NOTES = Object.freeze({ W51: "single-learner view", W53: "review only" });

// Protective-action text per staff page: Part 5 device table, DD:1491–1504 ("What it contains").
// BD6 wins over this table's iPad editing requests; they are kept here as notes only.
export const PROTECTIVE_NOTES = Object.freeze({
  W35: "iPad: full outline with inspector as drawer. Narrow: outline status, check counts, \"Hide from learners\", learner preview, publish review (read plus confirm).",
  W36: "iPad: edit and publish. Narrow: published text, history, ceiling, access dates; edit and publish only on iPad or desktop.",
  W37: "iPad: move up/down buttons, rule fields. Narrow: rules, cycle and availability check.",
  W38: "iPad: block list, canvas, checks in a drawer. Narrow: accessibility check list with per-issue Fix for alternatives (short text edits).",
  W39: "Library list with status, replace and download; narrow: status, usage, failed and processing retry.",
  W40: "iPad: edit. Narrow: dates, receipts-by-version panel, publish review, \"Hide\".",
  W41: "iPad: edit with key masked. Narrow: settings, active-attempt state, held-results state.",
  W42: "List and usage; desktop for authoring. Narrow shows \"Open on a larger screen\".",
  W43: "List with status, usage; retire; open impact.",
  W44: "Level matrix needs width. Narrow: read the rubric, in-use banner and \"Preview impact\".",
  W45: "Protective: revoke, change end date, pending invites; narrow is the key one (quick revoke from a phone).",
  W46: "iPad: record and end allowance. Narrow: active allowance, decide a pending request, end allowance.",
  W59: "Preview and exceptions on iPad. Narrow: status of a copy in progress or result only.",
  W60: "Import validation tables are dense; narrow shows the last log only.",
});
export const DEFAULT_REVIEW_NOTE = "Read record, status, protective actions; Open on a larger screen";
export const SOURCE_NOTE = `${DD}:75-80,88-150,161-172,1491-1504`;

const isLearnerFacing = (roles) => /[sg]/.test(roles);

// BD11 tier rule (T1–T5), applied in order. Returns { tier, tier_rule, tier_note }.
export function tierFor(roles, pageId, platform) {
  if (!["web", "ipad", "iphone"].includes(platform)) throw new Error(`tierFor: unknown platform ${platform}`);
  if (platform === "web") return { tier: "full", tier_rule: "T1", tier_note: "" };
  if (isLearnerFacing(roles)) return { tier: "full", tier_rule: "T2", tier_note: "" };
  if (HANDOFF.includes(pageId)) return { tier: "handoff", tier_rule: "T3", tier_note: "" };
  if (platform === "ipad" && IPAD_FULL_STAFF.includes(pageId)) return { tier: "full", tier_rule: "T4", tier_note: IPAD_TIER_NOTES[pageId] || "" };
  return { tier: "review", tier_rule: "T5", tier_note: PROTECTIVE_NOTES[pageId] || DEFAULT_REVIEW_NOTE };
}
