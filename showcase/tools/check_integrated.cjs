const fs = require("fs"),
  vm = require("vm"),
  assert = require("assert/strict"),
  path = require("path");
const root = path.join(__dirname, ".."),
  c = { window: {} };
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
    fs.readFileSync(path.join(root, "src", f + ".js"), "utf8"),
    c,
  );
const W = c.window.WB;
assert.equal(Object.keys(W.renderers).length, 40);
const ids = new Set(),
  screens = [];
for (const id of Object.keys(W.renderers).sort()) {
  const html = W.render(id);
  screens.push({ id, html });
  for (const m of html.matchAll(/data-action="([^"]+)"/g))
    assert(m[1] === "go" || W.actions[m[1]], id + " unknown action " + m[1]);
  for (const m of html.matchAll(/data-(?:open-)?screen="([^"]+)"/g))
    assert(W.renderers[m[1]], "missing destination " + m[1]);
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) {
    assert(!ids.has(m[1]), "duplicate id " + m[1]);
    ids.add(m[1]);
  }
}
assert.equal(Object.keys(W.journeys).length, 6);
for (const j of Object.values(W.journeys))
  for (const [id] of j.steps) assert(W.renderers[id]);
W.dispatch("it-accept");
assert(!W.state.institution.migrationAccepted);
W.dispatch("it-grades");
assert(!W.state.institution.gradeSynced);
W.state.assessment.graded.push("aisha");
W.state.assessment.reviewedQuestions.aisha = ["1a", "1b", "2", "3", "4"];
W.dispatch("teach-release-preview");
W.dispatch("teach-release");
W.dispatch("it-grades");
assert(W.state.institution.gradeSynced);
const snap = JSON.stringify(W.state.assessment.releaseSnapshots.aisha);
W.state.assessment.marks.aisha[0] = 0;
assert.equal(JSON.stringify(W.state.assessment.releaseSnapshots.aisha), snap);
W.dispatch("student-new-attempt");
W.state.institution.gradeSynced = false;
W.dispatch("it-grades");
assert(!W.state.institution.gradeSynced);
W.dispatch("it-ai");
assert(W.state.institution.aiEnabled);
W.dispatch("it-ai");
assert(!W.state.institution.aiEnabled);
W.dispatch("it-ta");
assert(!W.state.institution.taActive);
const out = W.dispatch("it-export");
assert(JSON.parse(out.download.text).fictional);
assert(out.download.name.endsWith(".json"));
fs.writeFileSync(
  "/tmp/whiteboard-rendered-screens.json",
  JSON.stringify(screens),
);
console.log(
  "Integrated checks passed: 40 pure screens, unique control IDs, registered actions, six journey routes, migration/grade prerequisites, immutable feedback, local audit and AI toggles.",
);

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
W.reset();
W.state.submission.pages[0].rotation = 90;
const original = JSON.stringify(W.state.submission);
c.resetJourney("J2");
assert.equal(JSON.stringify(W.state.submission), original);
W.state.institution.taActive = false;
W.state.institution.supportAccess = true;
W.state.teaching.copyApplied = true;
c.resetJourney("J6");
assert(!W.state.institution.taActive);
assert(W.state.institution.supportAccess);
assert(!W.state.teaching.copyApplied);
W.state.campus.roomSearch.time = "15:30";
c.resetJourney("J4");
assert.equal(W.state.campus.roomSearch.time, W.defaults.campus.roomSearch.time);
W.state.assignment.published = false;
W.state.submission.status = "draft";
W.dispatch("student-submit");
assert.equal(W.state.submission.status, "draft");
assert(W.render("S05").includes("Assignment not published"));
console.log(
  "Controller/reset regressions passed: preserve organized submission and unrelated access, reset room search, block unpublished submission.",
);

W.reset();
W.state.course.quizPublished = false;
W.state.course.quizAnswer = "0 m/s²";
W.dispatch("student-quiz-submit");
assert(!W.state.course.quizSubmitted);
assert(W.render("S10").includes("Quiz not published"));
W.state.course.quizPublished = true;
W.state.teaching.quizMinutes = "35";
assert(W.render("S10").includes("35 minutes"));
W.state.teaching.coursePublished = false;
for (const id of ["S03", "S04"])
  assert(W.render(id).includes("Course not published"));
console.log("Shared publication and quiz-duration checks passed.");
