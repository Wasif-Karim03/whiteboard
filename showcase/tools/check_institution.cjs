"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {}, console, Date, Intl, Set, Map });
for (const file of ["src/core.js", "src/teaching.js", "src/institution.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, {
    filename: file,
  });
}
const W = context.window.WB;
const ids = ["S37", "S38", "S39", "S40"];

assert.deepEqual(
  Object.keys(W.renderers)
    .filter((id) => ids.includes(id))
    .sort(),
  ids,
  "all institution screens register",
);
assert.ok(
  Object.keys(W.actions)
    .filter((name) => name !== "set" && !name.startsWith("teach-"))
    .every((name) => name.startsWith("it-")),
  "institution actions are namespaced",
);
assert.equal(
  W.state.institution.retention,
  "End of term + 90 days",
  "module preserves root-owned institution defaults",
);
assert.equal(
  W.state.institution.now,
  "2026-10-15T10:42:00Z",
  "module preserves the root fictional clock",
);
for (const id of ids) {
  const before = JSON.stringify(W.state),
    html = W.render(id);
  assert.equal(JSON.stringify(W.state), before, `${id} render stays pure`);
  assert.ok(html.length > 1200, `${id} renders a substantive workspace`);
}

// Raw duplicate rows, field mappings, the selected match, and rejected source row stay inspectable.
W.reset();
const activeBefore = W.state.people.filter((person) => person.active).length;
assert.match(W.render("S38"), /SIS 1042/);
assert.match(W.render("S38"), /preferred_name/);
W.dispatch("it-roster", { id: "sis-8871" });
assert.equal(W.state.institution.reconciliation.chosenSourceId, "sis-8871");
assert.deepEqual(
  Array.from(W.state.institution.reconciliation.rejectedSourceIds),
  ["sis-1042"],
);
assert.equal(
  W.state.people.filter((person) => person.active).length,
  activeBefore,
  "duplicate resolution does not add enrollment",
);
const rosterLogs = W.state.institution.logs.length;
W.dispatch("it-roster", { id: "sis-8871" });
assert.equal(
  W.state.institution.logs.length,
  rosterLogs,
  "repeating the same mapping is idempotent",
);
assert.match(W.render("S38"), /Rejected duplicate/);

// Explicit actor scope rejects cross-workspace mutation while direct Node checks may omit the actor.
W.reset();
W.ui.actor = "student";
const guarded = JSON.stringify(W.state.institution);
assert.match(W.dispatch("it-ai").message, /Institution IT/);
assert.equal(
  JSON.stringify(W.state.institution),
  guarded,
  "student sample actor cannot mutate institution policy",
);
W.ui.actor = undefined;

// Support access derives from timestamps, expires through the fictional clock, and records named ordered actors.
W.dispatch("it-support");
const approvedUntil = W.state.institution.supportUntil;
assert.ok(
  approvedUntil > W.clock(W.state).getTime(),
  "support approval has a future expiry",
);
assert.match(W.render("S37"), /Active until/);
W.dispatch("it-clock-advance");
assert.ok(
  W.clock(W.state).getTime() > approvedUntil,
  "fictional clock advances beyond the approved timestamp",
);
assert.match(W.render("S37"), /Access expired/);
assert.match(W.state.institution.logs[0].action, /Advanced fictional clock/);
assert.equal(
  W.state.institution.logs[0].actor,
  "Avery Morgan · Institution administrator",
);
assert.ok(
  new Date(W.state.institution.logs[0].time) >
    new Date(W.state.institution.logs[1].time),
  "newest named audit event is ordered first",
);

// Required migration exceptions block acceptance; preview retains tool warnings and matches the export.
W.reset();
assert.match(
  W.dispatch("it-accept").message,
  /Resolve 3 required migration decisions/,
);
assert.equal(W.state.institution.migrationAccepted, false);
W.dispatch("it-map");
assert.equal(
  W.state.institution.migrationRows.find((row) => row.id === "scan-asset")
    .decision,
  "Excluded",
);
assert.equal(
  W.state.institution.migrationRows.find((row) => row.id === "external-tool")
    .decision,
  "Review placeholder",
);
assert.equal(W.state.institution.migrationPreview.warnings, 1);
W.dispatch("it-accept");
assert.equal(W.state.institution.migrationAccepted, true);
const migrationDownload = W.dispatch("it-migration-export").download;
const migrationReport = JSON.parse(migrationDownload.text);
assert.deepEqual(
  migrationReport.rows,
  JSON.parse(JSON.stringify(W.state.institution.migrationRows)),
  "exported exception decisions match visible state",
);
assert.equal(migrationReport.summary.warnings, 1);
assert.match(W.render("S39"), /Unsupported-tool warnings remain visible/);
W.dispatch("it-migration-row", { id: "folder-week" });
assert.equal(
  W.state.institution.migrationAccepted,
  false,
  "a row review invalidates prior acceptance",
);

// The grade ledger accepts exact released/current snapshots, rejects one row, retries only it, and excludes excused work.
W.reset();
const snapshot = (id) => ({
  marks: W.state.assessment.marks[id].slice(),
  comment: W.state.assessment.comments[id],
  questionComments: {},
  reviewedQuestions: W.state.assignment.questions.map(
    (question) => question.id,
  ),
  attempt: W.submissionFor(W.state, id).attempt,
  submissionId: W.submissionFor(W.state, id).id,
  rubricVersion: W.state.teaching.rubricVersion,
  excused: false,
});
for (const id of ["aisha", "ben", "student-3"]) {
  W.state.assessment.releaseSnapshots[id] = snapshot(id);
  W.state.assessment.released.push(id);
}
const partial = W.dispatch("it-grades");
assert.match(partial.message, /partial/i);
assert.equal(
  W.state.institution.gradeExport.rows.filter((row) => row.state === "Accepted")
    .length,
  1,
);
assert.equal(
  W.state.institution.gradeExport.rows.filter((row) => row.state === "Rejected")
    .length,
  1,
);
assert.equal(
  W.state.institution.gradeExport.rows.find((row) => row.id === "student-3")
    .state,
  "Excluded",
);
assert.equal(
  W.state.institution.gradeExport.accepted["student-3"],
  undefined,
  "excused record is never exported numerically",
);
assert.equal(W.state.institution.gradeSynced, false);
const acceptedBeforeRetry = JSON.stringify(
  W.state.institution.gradeExport.accepted.aisha,
);
W.dispatch("it-grade-retry");
assert.equal(
  JSON.stringify(W.state.institution.gradeExport.accepted.aisha),
  acceptedBeforeRetry,
  "retry does not duplicate an accepted row",
);
assert.ok(
  W.state.institution.gradeExport.accepted.ben,
  "rejected row is accepted on retry",
);
assert.equal(W.state.institution.gradeSynced, true);
const acceptedLedger = JSON.stringify(W.state.institution.gradeExport.accepted);
W.dispatch("it-grades");
assert.equal(
  JSON.stringify(W.state.institution.gradeExport.accepted),
  acceptedLedger,
  "repeating the handoff preserves accepted receipts",
);
assert.ok(
  W.state.institution.gradeExport.rows.filter(
    (row) => row.state === "Already accepted",
  ).length >= 2,
);
const benFingerprint = W.state.institution.gradeExport.accepted.ben.fingerprint;
W.state.assessment.releaseSnapshots.ben.questionComments["3"] =
  "Clarified released question feedback.";
W.dispatch("it-grades");
assert.notEqual(
  W.state.institution.gradeExport.accepted.ben.fingerprint,
  benFingerprint,
  "a changed released snapshot receives a distinct transfer fingerprint",
);
const gradeReport = JSON.parse(W.dispatch("it-grade-report").download.text);
assert.equal(gradeReport.accepted.length, 2);
W.state.submission.attempt++;
W.state.submission.id = "phys-ps4-aisha-2";
W.dispatch("it-grades");
assert.equal(
  W.state.institution.gradeSynced,
  false,
  "a stale released snapshot cannot validate a newer attempt",
);
assert.equal(
  W.state.institution.gradeExport.rows.find((row) => row.id === "aisha").state,
  "Blocked",
);

// Exit preview gates a portable local file with authorities, structure, learning records, and decisions.
W.reset();
assert.equal(W.dispatch("it-portable-export").download, undefined);
W.dispatch("it-portable-preview");
const portableResult = W.dispatch("it-portable-export");
assert.equal(
  portableResult.download.name,
  "whiteboard-fictional-portable-record.json",
);
const portable = JSON.parse(portableResult.download.text);
assert.equal(portable.fictional, true);
assert.equal(portable.authority.people, "Institution SIS");
assert.ok(
  Array.isArray(portable.people) && Array.isArray(portable.releasedRecords),
);
assert.match(
  W.render("S40"),
  /Contract terms, transfer method, verification and deletion remain planned/,
);
assert.match(W.render("S40"), /Blocks authored draft help/);
W.state.teaching.courseAiPolicy = "Prohibited";
W.dispatch("it-ai");
assert.match(W.render("S40"), /Cannot override an institution restriction/);
assert.match(W.render("S40"), /Question 3 · Aisha Rahman/);

// J6 reset closes the institution dependency set while preserving unrelated access policy and history.
W.state.institution.supportUntil = Date.parse("2026-10-15T13:00:00Z");
W.state.institution.taActive = false;
W.dispatch("it-map");
W.dispatch("it-roster", { id: "sis-1042" });
W.resetInstitutionJourney(W.state);
assert.equal(W.state.institution.migrationAccepted, false);
assert.equal(W.state.institution.reconciliation.chosenSourceId, null);
assert.deepEqual(Object.keys(W.state.institution.gradeExport.accepted), []);
assert.equal(
  W.state.institution.supportUntil,
  Date.parse("2026-10-15T13:00:00Z"),
);
assert.equal(W.state.institution.taActive, false);

console.log(
  "Institution checks passed: 4 pure screens, inspectable reconciliation, safe grade retry, migration exceptions, clock expiry, actor scope, and portable exports.",
);
