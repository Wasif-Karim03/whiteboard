const fs = require("fs"),
  vm = require("vm"),
  path = require("path"),
  assert = require("assert/strict");
const c = { window: {} };
vm.createContext(c);
for (const f of [
  "core",
  "content",
  "student",
  "teaching",
  "campus",
  "institution",
])
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, "../src", f + ".js"), "utf8"),
    c,
  );
const W = c.window.WB;
function submit() {
  for (const q of W.state.teaching.quizItems)
    W.set("course.quizAnswers." + q.id, q.answer || "A reasoned answer");
  W.dispatch("student-quiz-review");
  W.dispatch("student-quiz-submit");
  assert(W.state.course.quizSubmitted);
}
W.state.teaching.quizFeedback = "After each attempt";
submit();
const snapshot = JSON.stringify(W.state.course.quizSubmission),
  html = W.render("S10");
W.state.teaching.bankSelected = ["qb-2"];
W.dispatch("teach-bank-add");
W.state.teaching.quizTitle = "A revised future quiz";
W.state.teaching.quizMinutes = "40";
W.state.teaching.quizItems[0].answer = "Changed reference";
W.state.course.quizAnswers["qb-1"] = "Changed live answer";
assert.equal(JSON.stringify(W.state.course.quizSubmission), snapshot);
assert.equal(W.render("S10"), html);
W.dispatch("student-quiz-reset");
assert.equal(W.state.course.quizHistory.length, 1);
assert.equal(JSON.stringify(W.state.course.quizHistory[0]), snapshot);
assert.equal(W.state.course.quizSubmission, null);
assert(!W.state.course.quizResultReleased);
assert(W.render("S10").includes("A revised future quiz"));
assert(W.render("S10").includes('type="number"'));
W.reset();
W.state.institution.now = "2026-10-21T14:00:00Z";
submit();
assert(W.render("S10").includes("Results are available"));
const due = W.state.course.quizSubmission.due;
W.state.teaching.newAssignmentTitle = "Unrelated investigation";
W.dispatch("teach-assignment-create");
assert(W.render("S10").includes("Results are available"));
assert.equal(W.state.course.quizSubmission.due, due);
assert.notEqual(W.state.teaching.quizDue, W.state.assignment.due);
W.reset();
W.state.teaching.quizFeedback = "Instructor release";
submit();
W.state.teaching.quizFeedback = "After each attempt";
assert(W.render("S10").includes("Feedback is held"));
assert(W.render("S16").includes("Release submitted attempt feedback"));
W.state.assignment.locked = true;
W.dispatch("teach-quiz-release");
assert(W.state.course.quizResultReleased);
assert(W.render("S10").includes("Results are available"));
W.state.assignment.locked = false;
W.dispatch("teach-quiz-publish");
assert(W.render("S10").includes("Attempt submitted"));
W.dispatch("student-quiz-reset");
assert(W.state.course.quizSubmitted);
W.dispatch("teach-quiz-publish");
W.dispatch("student-quiz-reset");
assert(!W.state.course.quizSubmitted);
W.reset();
W.dispatch("teach-allowance", { id: "aisha" });
assert.equal(W.quizExtraMinutes(W.state), 6);
submit();
W.state.teaching.newAssignmentTitle = "New unrelated work";
W.dispatch("teach-assignment-create");
assert.equal(W.quizExtraMinutes(W.state), 6);
assert.equal(W.state.course.quizSubmission.extraMinutes, 6);
W.dispatch("student-quiz-reset");
assert(W.render("S10").includes("6 approved extra minutes"));
W.dispatch("teach-allowance-remove", { id: "aisha" });
assert.equal(W.quizExtraMinutes(W.state), 0);
W.reset();
W.dispatch("student-read");
assert(W.state.course.completedModules.includes("m3"));
W.dispatch("teach-module-toggle", { id: "m4" });
W.state.institution.now = "2026-10-22T14:00:00Z";
W.dispatch("student-module", { id: "m4" });
assert(W.render("S04").includes("Mark reading complete"));
W.dispatch("student-read");
assert(W.state.course.completedModules.includes("m4"));
assert(W.state.course.completedModules.includes("m3"));
W.dispatch("student-read");
assert(!W.state.course.completedModules.includes("m4"));
assert(W.state.course.completedModules.includes("m3"));
W.dispatch("student-module", { id: "m3" });
assert(W.render("S04").includes("Mark reading incomplete"));
assert.equal(W.set("teaching.quizDue", "not-a-date"), false);
const code = fs.readFileSync(
  path.join(__dirname, "../src/controller.js"),
  "utf8",
);
let handler,
  opened = 0,
  prevented = 0;
const d = {
  document: { addEventListener: (_, h) => (handler = h) },
  openScreen: () => opened++,
};
vm.createContext(d);
vm.runInContext(
  code.slice(
    code.indexOf('document.addEventListener("click"'),
    code.indexOf("function bind("),
  ),
  d,
);
const anchor = { dataset: { openScreen: "S04" }, closest: () => null };
for (const flags of [
  { ctrlKey: true },
  { metaKey: true },
  { shiftKey: true },
  { altKey: true },
  { button: 1 },
  { defaultPrevented: true },
])
  handler({
    button: 0,
    ...flags,
    target: { closest: () => anchor },
    preventDefault: () => prevented++,
  });
assert.equal(prevented, 0);
assert.equal(opened, 0);
handler({
  button: 0,
  target: { closest: () => anchor },
  preventDefault: () => prevented++,
});
assert.equal(prevented, 1);
assert.equal(opened, 1);
console.log(
  "Readiness regressions passed: immutable submitted quiz/version/settings, independent deadline/release/accommodation, module-specific completion, and native modified-link clicks. Controller checks use event doubles, not a browser.",
);
