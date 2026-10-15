const fs = require("fs"),
  vm = require("vm"),
  path = require("path"),
  assert = require("assert/strict");
const c = { window: {} };
vm.createContext(c);
const root = path.join(__dirname, "..");
for (const f of [
  "core",
  "content",
  "student",
  "teaching",
  "campus",
  "institution",
])
  vm.runInContext(
    fs.readFileSync(path.join(root, "src", f + ".js"), "utf8"),
    c,
  );
const W = c.window.WB;
const controller = fs.readFileSync(
  path.join(root, "src/controller.js"),
  "utf8",
);
c.W = W;
vm.runInContext(
  controller.slice(
    controller.indexOf("function resetJourney("),
    controller.indexOf("function updateStep("),
  ),
  c,
);
W.dispatch("teach-module-toggle", { id: "m3" });
assert.match(W.render("S04"), /This module is an instructor draft/);
W.dispatch("teach-module-toggle", { id: "m3" });
W.dispatch("student-read");
W.dispatch("teach-module-toggle", { id: "m4" });
W.state.institution.now = "2026-10-20T10:00:00Z";
W.dispatch("student-module", { id: "m4" });
assert.equal(W.state.course.activeModule, "m4");
W.reset();
W.state.teaching.bankSelected = ["qb-2", "qb-3"];
W.dispatch("teach-bank-add");
const quiz = W.render("S10");
assert(quiz.includes('type="number"'));
assert(quiz.includes("course.quizAnswers.qb-3"));
W.state.teaching.quizAttempts = "1";
W.state.teaching.quizFeedback = "After each attempt";
W.dispatch("student-quiz-submit");
assert(!W.state.course.quizSubmitted);
for (const q of W.state.teaching.quizItems)
  W.set("course.quizAnswers." + q.id, q.answer || "An explained response");
W.dispatch("student-quiz-review");
W.dispatch("student-quiz-submit");
assert(W.state.course.quizSubmitted);
assert.match(W.render("S10"), /Results are available/);
W.dispatch("student-quiz-submit");
assert.equal(W.state.course.quizAttemptCount, 1);
W.dispatch("student-quiz-reset");
assert(W.state.course.quizSubmitted);
W.reset();
W.state.teaching.quizFeedback = "Instructor release";
W.set("course.quizAnswers.qb-1", "−9.81 m/s²");
W.dispatch("student-quiz-review");
W.dispatch("student-quiz-submit");
assert.match(W.render("S10"), /Feedback is held/);
W.dispatch("teach-quiz-release");
assert.match(W.render("S10"), /Results are available/);
W.dispatch("student-quiz-reset");
assert(!W.state.course.quizResultReleased);
W.reset();
W.dispatch("teach-allowance", { id: "aisha" });
assert.notEqual(W.effectiveDates(W.state).due, W.state.assignment.due);
assert.equal(W.effectiveDates(W.state, "ben").due, W.state.assignment.due);
assert.match(W.render("S05"), /Your approved allowance/);
W.state.campus.meeting = {
  days: "Monday",
  time: "11:00",
  endTime: "11:50",
  room: "Keene Center 212",
};
assert.match(W.render("S02"), /11:00 · Keene/);
W.state.assignment.due = "2026-10-17T20:00";
assert(W.heroHTML(W.state).includes(W.deadline(W.effectiveDates(W.state).due)));
W.reset();
const before = W.render("S12");
W.dispatch("campus-rsvp");
assert.notEqual(W.render("S12"), before);
assert(W.render("S12").includes(W.state.campus.event.title));
W.dispatch("campus-rsvp");
assert.equal(W.render("S12"), before);
W.reset();
W.dispatch("student-day-state", { value: "empty" });
assert(!W.render("S01").includes("Open assignment"));
const oldDue = W.state.assignment.due;
assert.equal(W.set("assignment.due", "2026-02-31T10:00"), false);
assert.equal(W.state.assignment.due, oldDue);
assert.equal(W.set("teaching.quizMinutes", "-1"), false);
assert.equal(W.set("teaching.copyShiftDays", "NaN"), false);
W.reset();
W.ui.actor = "student";
assert.equal(W.set("assessment.comments.aisha", "Unauthorized"), false);
assert.equal(W.set("institution.retention", "Forever"), false);
assert(!W.dispatch("it-ai").message.includes("updated"));
W.ui.actor = undefined;
W.reset();
W.state.submission.pages[0].rotation = 90;
const kept = JSON.stringify(W.state.submission);
c.resetJourney("J2");
assert.equal(JSON.stringify(W.state.submission), kept);
W.state.teaching.newAssignmentTitle = "A separate investigation";
W.dispatch("teach-assignment-create");
const created = W.state.assignment.id;
W.dispatch("teach-assignment-publish");
W.dispatch("student-load-pages");
W.dispatch("student-submit");
assert.equal(W.state.submission.status, "received");
c.resetJourney("J2");
assert.notEqual(W.state.assignment.id, created);
assert.match(W.state.submission.id, /phys-ps4/);
assert.equal(W.received(W.state), 41);
assert.equal(W.submissionFor(W.state, "ben").status, "received");
for (const j of Object.keys(W.journeys)) {
  c.resetJourney(j);
  const a = JSON.stringify(
    j === "J4"
      ? W.state.campus.event
      : j === "J5"
        ? W.state.campus.referral
        : W.state.assignment,
  );
  c.resetJourney(j);
  const b = JSON.stringify(
    j === "J4"
      ? W.state.campus.event
      : j === "J5"
        ? W.state.campus.referral
        : W.state.assignment,
  );
  assert.equal(a, b, j);
}
W.reset();
W.ui.actor = "student";
for (const id of Object.keys(W.renderers))
  assert(W.render(id).length > 100, id);
assert.equal(W.ui.actor, "student");
console.log(
  "Student revision checks passed: authored quiz/attempt/release, module visibility and progression, effective allowance, shared records, personal event calendar, coherent resets, validation and sample role boundaries.",
);

// Institution wall-clock deadlines are not compared to a UTC date string.
W.reset();
W.state.institution.now = "2026-10-19T02:00:00Z"; // Oct 18, 10 pm ET, before close.
W.dispatch("student-new-attempt");
W.dispatch("student-load-pages");
W.dispatch("student-submit");
assert.equal(W.state.submission.status, "received");
W.state.institution.now = "2026-10-19T05:00:00Z"; // Oct 19, 1 am ET, after close.
W.dispatch("student-new-attempt");
W.dispatch("student-load-pages");
W.dispatch("student-submit");
assert.notEqual(W.state.submission.status, "received");
assert.equal(W.set("assignment.title", "x".repeat(500)), false);
console.log("Deadline timezone and long-title validation checks passed.");
