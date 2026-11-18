// Shared paths, column lists and vocabularies for the design/final Phase 0–1 tools.
// Column and status lists follow design/reviews/final-design-plan-2026-11-15.md lines 89–102.
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const rel = (...p) => path.join(REPO, ...p);

export const BOARD_COPY = "design/board/Whiteboard-Design-Board-2026-11-04.html";
export const BOARD_BYTES = 1097772;
export const BOARD_ORIGINAL_NAME = "Whiteboard-Design-Board (1).html";
export const SPEC_DIR = "design/final/spec";
export const TRACKER_DIR = "design/final/tracker";
export const FIX_TRACKER = `${TRACKER_DIR}/fix_tracker.csv`;
export const PAGE_TRACKER = `${TRACKER_DIR}/page_tracker.csv`;
export const EXPECTED_COUNTS = `${TRACKER_DIR}/expected_counts.json`;
export const INPUTS_LOCK = `${TRACKER_DIR}/inputs.lock.json`;
export const DECISIONS_MD = "design/final/decisions.md";
export const JOURNEY_WALK_MD = "design/reviews/journey-walk-2026-11.md";
export const DEEP_DIVE = "design/reviews/board-deep-dive-2026-11-15.md";
export const BOARD_DECISIONS = "design/reviews/board-decisions-2026-11-15.md";
export const SYNTHESIS = "research/ux/00_synthesis.md";

export const LOCKED_INPUTS = Object.freeze([
  DEEP_DIVE,
  BOARD_DECISIONS,
  "design/reviews/final-design-plan-2026-11-15.md",
  SYNTHESIS,
  "research/ux/01_students.md",
  "research/ux/02_instructors.md",
  "research/ux/03_tas_grading.md",
  "research/ux/04_assessment_psychology.md",
  "research/ux/05_accessibility_inclusion.md",
  "NOTES.md",
]);

export const FIX_COLUMNS = Object.freeze(["fix_id", "source", "type", "severity", "pages", "platforms", "roles", "journey", "rule_ref", "decision_ref", "resolution", "owner_file", "check", "status", "notes"]);
export const PAGE_COLUMNS = Object.freeze(["page_id", "page_name", "segment", "stage", "roles", "platform", "tier", "tier_rule", "tier_note", "specified", "html_implemented", "source_checked", "browser_checked", "accessibility_reviewed", "owner_accepted"]);
export const PAGE_INITIAL = Object.freeze({ specified: "Yes", html_implemented: "No", source_checked: "Not run", browser_checked: "Not run", accessibility_reviewed: "Not run", owner_accepted: "Not run" });

export const STATUSES = Object.freeze(["Open", "Decided", "Implemented", "Source-checked", "Browser-checked", "Owner-accepted", "Withdrawn", "Duplicate-of"]);
// Phase 0–1 builds nothing, so these stay in the vocabulary but are refused in this run.
export const OUT_OF_RUN_STATUSES = Object.freeze(["Implemented", "Source-checked", "Browser-checked", "Owner-accepted"]);
export const TYPES = Object.freeze(["rule-conflict", "state", "link", "data", "copy", "device", "withdrawn", "decision", "conflict", "journey", "ux-rule"]);
export const PLATFORMS = Object.freeze(["web", "ipad", "iphone"]);

// A fix id at the start of a Duplicate-of resolution ("DD-1.03: same as …").
export const FIX_ID_PREFIX = /^(DD-\d\.\d\d|BD\d+|C\d+|JW-\d{3}|UX-R\d\d-[WO]\d\d)(?![\w.-]*\w)/;
export const DELEGATION_PHRASE = "chosen by Claude under owner delegation";
