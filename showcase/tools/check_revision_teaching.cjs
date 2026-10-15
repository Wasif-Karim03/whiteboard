"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const context = vm.createContext({ window: {}, console, Date, Set, Map, Intl });
for (const file of ["core", "teaching"])
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, "../src", file + ".js"), "utf8"),
    context,
    { filename: file + ".js" },
  );
const WB = context.window.WB;
const act = (name, p) => WB.dispatch("teach-" + name, p);
const reset = () => {
  WB.ui.actor = undefined;
  WB.reset();
};
const finish = (id) => {
  act("student", { id });
  for (const q of WB.state.assignment.questions) {
    act("question", { id: q.id });
    act("save-next");
  }
  act("complete-review");
  act("student", { id });
};
const plan = (id) => {
  act("student", { id });
  act("release-preview");
};
const frozen = () => JSON.stringify(WB.state);

// REV-02: records, rotations, attempts and receipts belong to the chosen learner.
reset();
WB.state.submission.pages.find((p) => p.tag === "3").rotation = 180;
WB.state.submissions.ben.pages.find((p) => p.tag === "3").rotation = 90;
WB.state.submissions.ben.attempt = 2;
act("student", { id: "ben" });
let html = WB.render("S17");
assert.match(html, /rotate\(90deg\)/);
assert.doesNotMatch(html, /rotate\(180deg\)/);
assert.match(html, /Attempt 2/);
assert.match(html, /AH-PHYS110-BEN-001/);
act("student", { id: "carmen" });
assert.match(WB.render("S17"), /AH-PHYS110-CARMEN-001/);
act("student", { id: "student-42" });
assert.match(WB.render("S17"), /No page tagged/);
assert.doesNotMatch(WB.render("S17"), /class="work-paper/);
const missing = frozen();
act("score", { score: 2 });
act("save-next");
assert.equal(frozen(), missing);

// REV-35: answer review and answer feedback never certify a whole submission.
reset();
WB.set("assessment.questionComments.aisha.3", "Q3 sign convention only.");
act("save-next");
assert.equal(WB.state.assessment.graded.includes("aisha"), false);
assert.deepEqual(Array.from(WB.state.assessment.reviewedQuestions.aisha), [
  "3",
]);
assert.match(act("complete-review").message, /every question/);
act("question", { id: "1a" });
assert.doesNotMatch(WB.render("S17"), />Q3 sign convention only\.<\/textarea>/);
finish("aisha");
assert.equal(WB.state.assessment.graded.includes("aisha"), true);
plan("aisha");
act("release");
assert.equal(
  WB.state.assessment.releaseSnapshots.aisha.questionComments["3"],
  "Q3 sign convention only.",
);
assert.match(WB.render("S09"), /Q3 sign convention only/);
WB.beginDraft(WB.state);
assert.equal(WB.state.assessment.reviewedQuestions.aisha.length, 0);
assert.doesNotMatch(WB.render("S09"), /Feedback released/);

// REV-03: every changed release input requires a refreshed exact preview.
const mutations = [
  (s) => {
    s.assessment.marks.ben[3] = 4;
  },
  (s) => {
    s.assessment.comments.ben = "Changed overall feedback";
  },
  (s) => {
    s.assessment.questionComments.ben = { 3: "Changed answer feedback" };
  },
  (s) => {
    s.teaching.rubricVersion++;
  },
  (s) => {
    s.submissions.ben.attempt++;
  },
  (s) => {
    s.assessment.student = "carmen";
  },
  (s) => {
    s.people.find((p) => p.id === "ben").active = false;
  },
  (s) => {
    s.teaching.excused.push("ben");
  },
  (s) => {
    s.assessment.reviewedQuestions.ben = [];
  },
];
for (const mutate of mutations) {
  reset();
  plan("ben");
  const prepared = JSON.stringify(WB.state.teaching.releasePlan);
  mutate(WB.state);
  assert.equal(JSON.stringify(WB.state.teaching.releasePlan), prepared);
  assert.match(act("release").message, /changed|Preview|preview/);
  assert.equal(WB.state.assessment.released.length, 0);
}
reset();
plan("ben");
const exact = JSON.stringify(WB.state.teaching.releasePlan.records[0].payload);
act("release");
assert.equal(JSON.stringify(WB.state.assessment.releaseSnapshots.ben), exact);
WB.state.assessment.questionComments.ben = { 3: "Held newer answer comment" };
assert.match(WB.render("S19"), /New draft after release/);
assert.notEqual(
  WB.state.assessment.releaseSnapshots.ben.questionComments["3"],
  "Held newer answer comment",
);

// REV-04: excused work is excluded from release in both scopes and explained.
reset();
act("release-scope", { scope: "all-reviewed" });
act("release-preview");
assert.ok(!WB.state.teaching.releasePreparedIds.includes("student-3"));
assert.match(WB.render("S20"), /excused records excluded/);
act("release");
assert.ok(!WB.state.assessment.released.includes("student-3"));
assert.equal(WB.state.assessment.releaseSnapshots["student-3"], undefined);
reset();
WB.state.teaching.excused.push("aisha");
assert.match(WB.render("S09"), /excluded from your category denominator/);
assert.doesNotMatch(WB.render("S09"), /Released score/);

// REV-10: allowances alter one learner's derived dates/time, not shared dates.
reset();
const base = WB.state.assignment.due;
act("allowance", { id: "aisha" });
assert.equal(WB.effectiveDates(WB.state, "aisha").due, "2026-10-17T23:59");
assert.equal(WB.effectiveDates(WB.state, "aisha").close, "2026-10-19T23:59");
assert.equal(WB.effectiveDates(WB.state, "aisha").extraMinutes, 6);
assert.equal(WB.effectiveDates(WB.state, "ben").due, base);
assert.equal(WB.state.assignment.due, base);
act("allowance-remove", { id: "aisha" });
assert.equal(WB.effectiveDates(WB.state, "aisha").due, base);
assert.doesNotThrow(() => act("allowance", { id: "unknown" }));

// REV-14: genuinely empty new assignment, sample text preview, validated publication.
reset();
const oldTitle = WB.state.assignment.title;
WB.state.teaching.newAssignmentTitle = "Motion investigation";
act("assignment-create");
assert.equal(WB.state.assignment.title, "Motion investigation");
assert.equal(WB.state.assignment.published, false);
assert.equal(WB.state.assignment.attachments.length, 0);
assert.equal(WB.state.submission.pages.length, 0);
assert.equal(WB.state.assessment.graded.length, 0);
assert.equal(Object.keys(WB.state.assessment.marks).length, 0);
assert.equal(WB.state.teaching.previousAssignment.assignment.title, oldTitle);
assert.ok(
  Object.values(WB.state.submissions).every(
    (x) => x.status === "missing" && x.pages.length === 0,
  ),
);
act("attachment-toggle");
act("attachment-preview");
assert.match(WB.render("S15"), /Identify known quantities/);
act("assignment-publish");
assert.equal(WB.state.assignment.published, true);
act("course-empty");
assert.equal(WB.state.teaching.modules.length, 0);
assert.equal(WB.state.teaching.coursePublished, false);
act("module-add");
act("module-toggle", { id: WB.state.teaching.modules[0].id });
act("course-publish");
assert.equal(WB.state.teaching.modules[0].published, true);
assert.equal(WB.state.teaching.coursePublished, true);

// REV-28/36: academic policy is canonical; sample draft is scoped to one answer.
reset();
WB.state.assignment.policy = "Disclose conceptual assistance.";
assert.match(WB.render("S15"), /Disclose conceptual assistance/);
WB.state.teaching.courseAiPolicy = "Prohibited";
assert.match(WB.academicPolicy(WB.state), /^Prohibited/);
assert.match(act("ai-start").message, /disabled/);
WB.state.institution.aiEnabled = true;
const protectedState = JSON.stringify({
  marks: WB.state.assessment.marks,
  released: WB.state.assessment.released,
});
act("ai-start");
assert.equal(WB.state.teaching.aiDraftContext.question, "3");
WB.state.assessment.aiDraft = "Edited Q3 sample feedback";
act("ai-accept");
assert.equal(
  WB.state.assessment.questionComments.aisha["3"],
  "Edited Q3 sample feedback",
);
assert.equal(
  JSON.stringify({
    marks: WB.state.assessment.marks,
    released: WB.state.assessment.released,
  }),
  protectedState,
);
act("ai-start");
WB.state.submission.attempt++;
assert.match(act("ai-accept").message, /context changed/);

// Instructor-release feedback has a real bounded release action.
reset();
WB.state.teaching.quizFeedback = "Instructor release";
assert.match(act("quiz-release").message, /submitted quiz attempt/);
WB.state.course.quizSubmitted = true;
WB.state.course.quizAttemptCount = 1;
WB.state.course.quizSubmission = { attempt: 1, feedback: "Instructor release" };
act("quiz-release");
assert.equal(WB.state.course.quizResultReleased, true);
WB.ui.actor = "student";
WB.state.course.quizResultReleased = false;
act("quiz-release");
assert.equal(WB.state.course.quizResultReleased, false);

// REV-37: frozen copy plan produces selected, independent destination records.
reset();
WB.state.teaching.copyShiftDays = 400;
WB.state.teaching.copyInclude = ["assignments", "quizzes"];
const source = JSON.stringify({
  assignment: WB.state.assignment,
  modules: WB.state.teaching.modules,
  quiz: WB.state.teaching.quizItems,
});
act("copy-preview");
act("copy-apply");
const dest = WB.state.teaching.destinationCourse;
assert.equal(dest.assignments[0].due, "2027-11-20T23:59");
assert.equal(dest.assignments[0].close, "2027-11-22T23:59");
assert.equal(dest.modules.length, 0);
assert.equal(dest.toolReview, null);
assert.equal(dest.people, undefined);
assert.equal(
  JSON.stringify({
    assignment: WB.state.assignment,
    modules: WB.state.teaching.modules,
    quiz: WB.state.teaching.quizItems,
  }),
  source,
);
assert.match(WB.render("S22"), /Inspect destination course/);
dest.assignments[0].title = "Destination edit";
assert.notEqual(WB.state.assignment.title, "Destination edit");
act("copy-preview");
WB.state.teaching.copyShiftDays = 401;
assert.match(act("copy-apply").message, /Preview/);
WB.state.teaching.copyShiftDays = "invalid";
assert.doesNotThrow(() => WB.render("S22"));
assert.match(act("copy-preview").message, /whole date shift/);

// Invalid state and current sample actor are guarded at mutation boundaries.
reset();
for (const bad of ["NaN", Infinity, -2, 9]) {
  const marks = JSON.stringify(WB.state.assessment.marks);
  act("score", { score: bad });
  assert.equal(JSON.stringify(WB.state.assessment.marks), marks);
}
for (const actor of ["student", "officer", "admin", "ta"]) {
  reset();
  WB.ui.actor = actor;
  const before = frozen();
  act("assignment-publish");
  act("copy-preview");
  act("course-empty");
  act("score", { score: 2 });
  assert.equal(frozen(), before);
}
reset();
WB.state.assessment.role = "ta";
WB.ui.actor = "instructor";
act("assignment-publish");
assert.equal(
  WB.state.assignment.published,
  false,
  "explicit instructor workspace is independent of the last grading role",
);
reset();
WB.state.assignment.locked = true;
const locked = frozen();
act("assignment-publish");
act("score", { score: 2 });
act("release-preview");
assert.equal(frozen(), locked);
reset();
WB.state.assignment.title = "x".repeat(500);
assert.match(act("assignment-publish").message, /1–160/);
WB.state.assignment.title = "Valid";
WB.state.assignment.close = "";
assert.match(act("assignment-publish").message, /valid due/);
WB.state.teaching.quizMinutes = -1;
const published = WB.state.course.quizPublished;
act("quiz-publish");
assert.equal(WB.state.course.quizPublished, published);

// Every revised screen remains a pure renderer across representative changed states.
for (const screen of [
  "S09",
  "S14",
  "S15",
  "S16",
  "S17",
  "S18",
  "S19",
  "S20",
  "S21",
  "S22",
  "S23",
]) {
  reset();
  const before = frozen();
  assert.ok(WB.render(screen).length > 700);
  assert.equal(frozen(), before);
}
console.log(
  "Teaching revision checks passed: learner isolation, exact release payloads, excused/review semantics, allowances, authoring, policy, destination copy and guarded validation.",
);
