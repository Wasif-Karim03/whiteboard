// Unit tests for the design/final Phase 0–1 tools. Run: node --test design/final/tools/
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseCsv, toCsv } from "./csv.mjs";
import { tierFor, SEGMENTS, STAGES } from "./page_meta.mjs";
import { slugify } from "./extract_board.mjs";
import { parseDdItem, ddRow, parseDeepDive } from "./seed_trackers.mjs";
import { FIX_COLUMNS, LOCKED_INPUTS, PAGE_INITIAL, PLATFORMS } from "./schema.mjs";
import { deriveUxPairs } from "./ux_rows.mjs";
import { checkFixVocab, checkLock, checkPageInitial, checkPageRows, checkProtectedDuplicates, checkDuplicates, checkMandatoryDecisions, parseDecisionEntries, checkConflictRows, checkDecisionRefs, checkUxRows, checkJourneyWalk, stepPages, parseWalkFindings } from "./check_tracker.mjs";

const fixRow = (over) => ({ ...Object.fromEntries(FIX_COLUMNS.map((c) => [c, ""])), ...over });
const pageRow = (over) => ({ page_id: "W05", platform: "web", ...PAGE_INITIAL, ...over });

test("CSV round-trips commas, quotes and newlines", () => {
  const rows = [{ a: "plain", b: 'say "hi", then\nleave' }, { a: "", b: "x,y;z" }];
  const text = toCsv(rows, ["a", "b"]);
  assert.equal(text, 'a,b\nplain,"say ""hi"", then\nleave"\n,"x,y;z"\n');
  const back = parseCsv(text);
  assert.deepEqual(back.columns, ["a", "b"]);
  assert.deepEqual(back.rows.map((r) => ({ ...r })), rows);
});

test("CSV keeps CRLF inside quoted fields and splits records on CRLF outside quotes", () => {
  const text = 'a,b\r\n1,"first\r\nsecond"\r\n2,x\r\n';
  const back = parseCsv(text);
  assert.deepEqual(back.rows.map((r) => ({ ...r })), [{ a: "1", b: "first\r\nsecond" }, { a: "2", b: "x" }]);
  assert.deepEqual(parseCsv(toCsv(back.rows, back.columns)).rows.map((r) => ({ ...r })), [{ a: "1", b: "first\r\nsecond" }, { a: "2", b: "x" }]);
});

test("CSV keeps a quoted empty final field without a trailing newline as one row", () => {
  const back = parseCsv('a\n""');
  assert.deepEqual(back.rows.map((r) => ({ ...r })), [{ a: "" }]);
  assert.deepEqual(parseCsv("a\n").rows, []);
});

test("CSV rejects a record with the wrong number of fields", () => {
  assert.throws(() => parseCsv("a,b\n1,2,3\n"), /record 2 has 3 fields, expected 2/);
});

test("tierFor follows BD11 (T1–T5) on all three platforms", () => {
  const cases = [
    ["W05", "sia", ["full", "full", "full"], ["T1", "T2", "T2"]],
    ["W23", "si", ["full", "full", "full"], ["T1", "T2", "T2"]],
    ["W42", "ia", ["full", "handoff", "handoff"], ["T1", "T3", "T3"]],
    ["W48", "ia", ["full", "full", "review"], ["T1", "T4", "T5"]],
    ["W53", "ia", ["full", "full", "review"], ["T1", "T4", "T5"]],
    ["W35", "ia", ["full", "review", "review"], ["T1", "T5", "T5"]],
    ["O02", "ia", ["full", "handoff", "handoff"], ["T1", "T3", "T3"]],
  ];
  for (const [id, roles, tiers, rules] of cases) {
    const got = ["web", "ipad", "iphone"].map((p) => tierFor(roles, id, p));
    assert.deepEqual(got.map((g) => g.tier), tiers, `${id} tiers`);
    assert.deepEqual(got.map((g) => g.tier_rule), rules, `${id} rules`);
  }
  assert.equal(tierFor("ia", "W53", "ipad").tier_note, "review only");
  assert.match(tierFor("ia", "W35", "iphone").tier_note, /Hide from learners/);
  assert.equal(tierFor("ia", "W50", "iphone").tier_note, "Read record, status, protective actions; Open on a larger screen");
});

test("page metadata covers all 63 pages in six segments", () => {
  assert.equal(Object.keys(SEGMENTS).length, 63);
  assert.equal(Object.keys(STAGES).length, 63);
  assert.deepEqual([1, 2, 3, 4, 5, 6].map((s) => Object.values(SEGMENTS).filter((v) => v === s).length), [10, 9, 9, 9, 14, 12]);
});

test("slugify makes lowercase [a-z0-9-] names", () => {
  assert.equal(slugify("Spec 02 · Navigation & permissions"), "spec-02-navigation-permissions");
  assert.equal(slugify("C01–C16 component contracts"), "c01-c16-component-contracts");
});

test("DD item parser handles tagged, untagged-withdrawn and two-digit items", () => {
  assert.deepEqual(parseDdItem("1. [rule-conflict] W08: remove \"8 of 10\" from W05."), { n: 1, type: "rule-conflict", text: "W08: remove \"8 of 10\" from W05." });
  assert.deepEqual(parseDdItem("7. (Withdrawn on check: W52 is in Stage 1.)"), { n: 7, type: "withdrawn", text: "(Withdrawn on check: W52 is in Stage 1.)" });
  assert.equal(parseDdItem("22. [data] Course identity W14, W06 and W14.").n, 22);
  assert.equal(parseDdItem("Reading the map:"), null);
  const row = ddRow({ part: 6, n: 7, type: "withdrawn", text: "(Withdrawn on check: W52.)", line: 1943 });
  assert.equal(row.fix_id, "DD-6.07");
  assert.equal(row.status, "Withdrawn");
  assert.equal(row.source, "board-deep-dive-2026-11-15.md:1943");
  assert.equal(ddRow({ part: 1, n: 22, type: "data", text: "W14 then W06 and W14", line: 9 }).pages, "W06;W14");
});

test("deep-dive parser reads items after each fix-list heading, skipping one blank line", () => {
  const md = "## Segment fix list\n\n1. [state] a\n2. [copy] b\n\n## Other\n3. [state] no\n## Segment fix list\n1. [link] c\n";
  const items = parseDeepDive(md);
  assert.deepEqual(items.map((i) => [i.part, i.n, i.line]), [[1, 1, 3], [1, 2, 4], [2, 1, 9]]);
});

test("run-scope status limit rejects Implemented and accepts Decided", () => {
  assert.match(checkFixVocab([fixRow({ fix_id: "DD-1.01", type: "state", status: "Implemented" })]).join(), /DD-1\.01 status "Implemented" is not allowed/);
  assert.deepEqual(checkFixVocab([fixRow({ fix_id: "DD-1.01", type: "state", status: "Decided" })]), []);
});

test("page tracker accepts source progress while keeping browser acceptance unrun", () => {
  assert.deepEqual(checkPageInitial([pageRow({})]), []);
  assert.deepEqual(checkPageInitial([pageRow({ html_implemented: "Yes", source_checked: "Pass" })]), []);
  assert.ok(checkPageInitial([pageRow({ html_implemented: "Maybe" })]).length);
  assert.match(checkPageInitial([pageRow({ browser_checked: "Pass" })]).join(), /W05\/web browser_checked expected "Not run"; actual "Pass"/);
});

test("protected Duplicate-of needs a Decided, substantive, referenced target", () => {
  const dup = fixRow({ fix_id: "DD-2.11", type: "rule-conflict", status: "Duplicate-of", resolution: "DD-6.16: same deadline authority" });
  const good = { fix_id: "DD-6.16", type: "rule-conflict", status: "Decided", resolution: "The instructor sets grading deadlines; TAs see them.", decision_ref: "BD17" };
  const bad = [
    ["Open target", { status: "Open" }, /target status expected Decided, actual Open/],
    ["Withdrawn target", { status: "Withdrawn" }, /target status expected Decided, actual Withdrawn/],
    ["empty resolution", { resolution: "" }, /target resolution is not substantive/],
    ["no decision_ref", { decision_ref: "" }, /target has an empty decision_ref/],
  ];
  for (const [label, over, re] of bad) assert.match(checkProtectedDuplicates([dup, fixRow({ ...good, ...over })]).join(), re, label);
  assert.deepEqual(checkProtectedDuplicates([dup, fixRow(good)]), []);
});

test("a non-protected Duplicate-of an Open row passes; a chain fails for every type", () => {
  const open = fixRow({ fix_id: "DD-1.04", type: "state", status: "Open" });
  const state = fixRow({ fix_id: "DD-2.09", type: "state", status: "Duplicate-of", resolution: "DD-1.04 covers it" });
  assert.deepEqual([...checkDuplicates([open, state]), ...checkProtectedDuplicates([open, state])], []);
  const chain = fixRow({ fix_id: "DD-3.05", type: "state", status: "Duplicate-of", resolution: "DD-2.09 again" });
  assert.match(checkDuplicates([open, state, chain]).join(), /DD-3\.05 is Duplicate-of DD-2\.09, which is itself Duplicate-of/);
});

test("mandatory decision rows: dropping BD17 fails; a tracker BD30 without a decisions.md entry fails", () => {
  const bd = (n) => fixRow({ fix_id: `BD${n}`, type: "decision", status: "Decided", decision_ref: `BD${n}`, resolution: "x".repeat(30) });
  const all = Array.from({ length: 24 }, (_, i) => bd(i + 1));
  const md = Array.from({ length: 16 }, (_, i) => `## BD${i + 9} · Q\nchosen by Claude under owner delegation\n`).join("\n");
  const entries = parseDecisionEntries(md);
  assert.deepEqual(checkMandatoryDecisions(all, entries), []);
  assert.match(checkMandatoryDecisions(all.filter((r) => r.fix_id !== "BD17"), entries).join(), /required row BD17 is missing/);
  assert.match(checkMandatoryDecisions([...all, bd(30)], entries).join(), /tracker row BD30 has no entry/);
  assert.match(checkMandatoryDecisions(all, parseDecisionEntries(`${md}\n## BD31 · Q\n`)).join(), /has BD31 but the tracker has no/);
});

test("page rows must be exactly the manifest pages × platforms: renaming W11 to W61 fails", () => {
  const ids = [...Array.from({ length: 60 }, (_, i) => `W${String(i + 1).padStart(2, "0")}`), "O01", "O02", "O03"];
  const rows = ids.flatMap((id) => PLATFORMS.map((platform) => ({ page_id: id, platform, tier: "full", tier_rule: "T1" })));
  const expected = { page_rows: 189, tiers: { web: [63, 0, 0], ipad: [63, 0, 0], iphone: [63, 0, 0] } };
  assert.deepEqual(checkPageRows(rows, expected, ids), []);
  const renamed = rows.map((r) => (r.page_id === "W11" ? { ...r, page_id: "W61" } : r));
  const errors = checkPageRows(renamed, expected, ids).join("\n");
  assert.match(errors, /missing \(page_id, platform\) W11\/web,W11\/ipad,W11\/iphone/);
  assert.match(errors, /unexpected \(page_id, platform\) W61\/web,W61\/ipad,W61\/iphone/);
});

test("inputs lock must list exactly LOCKED_INPUTS: empty, missing and duplicate entries fail", () => {
  const buf = Buffer.from("locked");
  const sha = "8e1b5e8ab3c5a4e5b3ae5b7c8bd0fb27fbfba1c5ec36bc6c7c2cc0fb0c7f2d3a";
  const readFile = () => buf;
  const real = createHash("sha256").update(buf).digest("hex");
  const lock = LOCKED_INPUTS.map((path) => ({ path, bytes: buf.length, sha256: real }));
  assert.notEqual(sha, real);
  assert.deepEqual(checkLock(lock, readFile), []);
  assert.match(checkLock([], readFile).join(), /required entry NOTES\.md is omitted/);
  assert.match(checkLock(lock.slice(1), readFile).join(), new RegExp(`required entry ${LOCKED_INPUTS[0]} is omitted`));
  assert.match(checkLock([...lock, lock[2]], readFile).join(), new RegExp(`duplicate entry ${LOCKED_INPUTS[2]}`));
  assert.match(checkLock([...lock, { ...lock[0], path: "extra.md" }], readFile).join(), /unexpected entry extra\.md/);
  assert.match(checkLock(lock.map((f, i) => (i ? f : { ...f, sha256: sha })), readFile).join(), /input changed/);
  assert.match(checkLock(lock.map((f, i) => (i ? f : { ...f, bytes: "6" })), readFile).join(), /bytes expected a non-negative integer/);
});

// R2: UX-rule rows (rule_ref and the derived UX-Rnn-Wxx set).
const jwRow = (over) => fixRow({ fix_id: "JW-160", type: "journey", severity: "2", pages: "W23;W27", roles: "Student", journey: "J06", rule_ref: "NH3;UX-R04", source: "journey-walk-2026-11.md#JW-160", ...over });
const uxRow = (id, over) => fixRow({ fix_id: id, source: "journey-walk-2026-11.md", type: "ux-rule", pages: id.slice(7), rule_ref: id.slice(0, 6), status: "Open", ...over });
const UX_PAGES = ["W23", "W27", "W31"];

test("UX rows: a correct rule_ref and the exact derived set pass", () => {
  const rows = [jwRow({}), uxRow("UX-R04-W23"), uxRow("UX-R04-W27")];
  assert.deepEqual(checkUxRows(rows, UX_PAGES), []);
});

test("UX rows: rule_ref R01-W is reported", () => {
  const rows = [jwRow({ rule_ref: "UX-R01", pages: "W23" }), uxRow("UX-R01-W23", { rule_ref: "R01-W" })];
  assert.match(checkUxRows(rows, UX_PAGES).join("\n"), /UX-R01-W23 rule_ref expected UX-R01, actual "R01-W"/);
});

test("UX rows: a sev-2 JW row on W23;W27 with only UX-R04-W23 present reports UX-R04-W27 missing", () => {
  const errors = checkUxRows([jwRow({}), uxRow("UX-R04-W23")], UX_PAGES);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /UX row UX-R04-W27 is missing \(cited by JW-160\)/);
});

test("UX rows: an extra id with no citing severity 2+ JW row is reported", () => {
  const rows = [jwRow({}), uxRow("UX-R04-W23"), uxRow("UX-R04-W27"), uxRow("UX-R04-W31"), jwRow({ fix_id: "JW-170", severity: "1", pages: "W31" })];
  assert.match(checkUxRows(rows, UX_PAGES).join("\n"), /UX row UX-R04-W31 is not cited by any severity 2\+ JW row/);
});

// IR-02 / IR-03: md finding rows must match the CSV JW rows.
const walkMd = (step, rules) => [
  ...Array.from({ length: 12 }, (_, i) => `## J${String(i + 1).padStart(2, "0")} · x`),
  "## Coverage", ...Array.from({ length: 12 }, (_, i) => ["Student", "Instructor", "TA", "Guest"].map((r) => `| J${String(i + 1).padStart(2, "0")} | ${r} | walked | R1 | 1 |`)).flat(),
  "| id | step | role | platforms | sev | rule refs | evidence | finding | proposed resolution | DD overlap | status · decision |",
  `| JW-160 | ${step} | Student | web | 3 | ${rules} | SP/W27.html:2 "x" | f | p | none | Decided · BD36: r |`,
].join("\n");

test("walk md step cell with +W27 extra scope parses to the same page set as CSV W24;W27;W54", () => {
  assert.equal(stepPages("W24→W54 (+W27 per BD36)"), "W24;W27;W54");
  assert.deepEqual(parseWalkFindings(walkMd("W24→W54 (+W27 per BD36)", "NH3;UX-R04")).map((f) => f.pages), ["W24;W27;W54"]);
  const csv = jwRow({ severity: "3", pages: "W24;W27;W54", rule_ref: "NH3;03#14;UX-R04" });
  assert.deepEqual(checkJourneyWalk(walkMd("W24→W54 (+W27 per BD36)", "NH3;03#14;UX-R04"), [csv]), []);
});

test("walk check ignores whitespace around CSV page tokens and severity", () => {
  const md = walkMd("W24→W54 (+W27 per BD36)", "NH3;UX-R04");
  assert.deepEqual(checkJourneyWalk(md, [jwRow({ severity: " 3", pages: "W24; W27;W54", rule_ref: "NH3;UX-R04" })]), []);
});

test("deriveUxPairs trims page tokens: W23; W27 yields UX-R04-W27 and no id contains a space", () => {
  const ids = [...deriveUxPairs([jwRow({ pages: "W23; W27" })]).keys()];
  assert.ok(ids.includes("UX-R04-W27"));
  assert.ok(ids.every((id) => !/\s/.test(id)));
});

test("walk check fails when the CSV JW row drops UX-R04 or a page that the md row still cites", () => {
  const md = walkMd("W24→W54 (+W27 per BD36)", "NH3;UX-R04");
  const noRule = checkJourneyWalk(md, [jwRow({ severity: "3", pages: "W24;W27;W54", rule_ref: "NH3" })]).join("\n");
  assert.match(noRule, /JW-160 UX-Rnn tokens md "UX-R04" does not match fix_tracker\.csv ""/);
  const noPage = checkJourneyWalk(md, [jwRow({ severity: "3", pages: "W24;W54", rule_ref: "NH3;UX-R04" })]).join("\n");
  assert.match(noPage, /JW-160 pages md "W24;W27;W54" does not match fix_tracker\.csv "W24;W54"/);
  const sevOff = checkJourneyWalk(md, [jwRow({ severity: "2", pages: "W24;W27;W54", rule_ref: "UX-R04" })]).join("\n");
  assert.match(sevOff, /JW-160 severity md "3" does not match fix_tracker\.csv "2"/);
});

// IR-04: finding rows are parsed strictly; outer pipes are optional.
test("walk check reports a JW finding row with the wrong cell count", () => {
  const md = walkMd("W24→W54 (+W27 per BD36)", "NH3;UX-R04").replace("| none | Decided", "| Decided");
  const csv = jwRow({ severity: "3", pages: "W24;W27;W54", rule_ref: "NH3;UX-R04" });
  const out = checkJourneyWalk(md, [csv]).join("\n");
  assert.match(out, /JW-160 row has 10 cells, expected 11/);
  assert.match(out, /JW-160 has no parsed finding row in design\/reviews\/journey-walk-2026-11\.md/);
});

test("walk row without a trailing pipe still parses and is compared with the CSV", () => {
  const md = walkMd("W24→W54 (+W27 per BD36)", "NH3;UX-R04").replace(/ \|$/, "");
  assert.deepEqual(parseWalkFindings(md).map((f) => [f.id, f.pages, f.severity, f.ux]), [["JW-160", "W24;W27;W54", "3", "UX-R04"]]);
  const ok = jwRow({ severity: "3", pages: "W24;W27;W54", rule_ref: "NH3;UX-R04" });
  assert.deepEqual(checkJourneyWalk(md, [ok]), []);
  const off = checkJourneyWalk(md, [jwRow({ severity: "2", pages: "W24;W27;W54", rule_ref: "NH3;UX-R04" })]).join("\n");
  assert.match(off, /JW-160 severity md "3" does not match fix_tracker\.csv "2"/);
});

// R4: decision_ref tokens.
const conflict = (ref) => fixRow({ fix_id: "DD-1.13", type: "rule-conflict", status: "Decided", resolution: "One status table with who sees each word.", decision_ref: ref });
const refEntries = parseDecisionEntries("## BD9 · Q\nchosen by Claude under owner delegation\n\n## BD38 · Q\nchosen by Claude under owner delegation\n");

test("decision_ref \";\" on a conflict row is reported", () => {
  assert.match(checkConflictRows([conflict(";")]).join(), /DD-1\.13 decision_ref ";" has an empty token/);
  assert.match(checkDecisionRefs([conflict(";")], "", refEntries).join(), /DD-1\.13 decision_ref ";" has an empty token/);
});

test("decision_ref \"BD9;\" is reported", () => {
  assert.match(checkConflictRows([conflict("BD9;")]).join(), /decision_ref "BD9;" has an empty token/);
  assert.match(checkDecisionRefs([conflict("BD9;")], "", refEntries).join(), /decision_ref "BD9;" has an empty token/);
});

test("decision_ref \";\" on a protected-duplicate target is reported", () => {
  const dup = fixRow({ fix_id: "DD-2.11", type: "rule-conflict", status: "Duplicate-of", resolution: "DD-6.16: same deadline authority" });
  const target = fixRow({ fix_id: "DD-6.16", type: "rule-conflict", status: "Decided", resolution: "The instructor sets grading deadlines; TAs see them.", decision_ref: ";" });
  assert.match(checkProtectedDuplicates([dup, target]).join(), /DD-6\.16 decision_ref ";" has an empty token \(protected duplicate DD-2\.11 -> DD-6\.16\)/);
});

test("a valid decision_ref \"BD9;BD38\" passes", () => {
  assert.deepEqual(checkConflictRows([conflict("BD9;BD38")]), []);
  assert.deepEqual(checkDecisionRefs([conflict("BD9;BD38")], "", refEntries), []);
});

test("a blank decision_ref on a conflict row still gives the empty decision_ref message", () => {
  assert.match(checkConflictRows([conflict("")]).join(), /rule-conflict row DD-1\.13 has an empty decision_ref/);
  assert.match(checkConflictRows([conflict("  ")]).join(), /has an empty decision_ref/);
});
