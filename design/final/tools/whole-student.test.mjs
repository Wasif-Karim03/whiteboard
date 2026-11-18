import test from "node:test";
import assert from "node:assert/strict";
import { WB, S, copy, direct, frame, view, viewer, mainOf, rowsWith, esc, goLinks } from "./spine_helpers.mjs";

const scenario = "math_released", v = view(scenario), who = viewer(scenario, "student");
const course = S.calendarCourses(v, who).find((c) => c.id !== who.courseId && !c.archived);
const selectedWho = { ...who, courseId: course.id };
const item = S.courseAssessments(v, selectedWho).find((x) => x.grading_intent !== "ungraded");
const release = S.releasesFor(v, item.id, selectedWho).slice(-1)[0];
const entry = release.entries.find((e) => e.person_id === who.personId);
const receipt = S.receiptById(v, entry.receipt_id, selectedWho);
const choice = { courseId: course.id, assessmentId: item.id, learnerId: who.personId };

test("student can enter both enrolled courses and open exact coursework and released feedback", () => {
  for (const platform of ["web", "ipad", "iphone"]) {
    const courses = mainOf(direct("W06", { role: "student", scenario, platform }).html);
    assert.ok(goLinks(courses).some((go) => go.startsWith("W14?") && go.includes(`tc=${course.id}`)));
    for (const page of ["W18", "W24"]) {
      const html = direct(page, { role: "student", scenario, platform, selection: { courseId: course.id } }).html;
      const rows = rowsWith(html, esc(item.title)); assert.equal(rows.length, 1);
      assert.ok(goLinks(rows[0]).some((go) => go.startsWith("W23?") && go.includes(`ta=${item.id}`)));
    }
    const work = mainOf(direct("W18", { role: "student", scenario, platform, selection: { courseId: course.id } }).html);
    const practice = S.courseAssessments(v, selectedWho).find((x) => x.grading_intent === "ungraded");
    assert.ok(goLinks(rowsWith(work, esc(practice.title))[0]).some((go) => go.startsWith("W19?") && go.includes(`ta=${practice.id}`)));
  }
});

test("student feedback identifies snapshot-bound receipt and its files", () => {
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = mainOf(direct("W23", { role: "student", scenario, platform, selection: choice }).html);
    assert.ok(html.includes(esc(receipt.files[0].name)));
    const older = S.receiptsFor(v, item.id, selectedWho).find((r) => r.id !== receipt.id);
    assert.ok(older && !html.includes(esc(older.files[0].name)));
    assert.ok(goLinks(html).some((go) => go.startsWith("W22?") && go.includes(`tr=${receipt.id}`)));
    const slip = mainOf(direct("W22", { role: "student", scenario, platform, selection: { ...choice, receiptId: receipt.id } }).html);
    assert.ok(slip.includes(esc(receipt.id)) && slip.includes(esc(receipt.files[0].name)) && !slip.includes(esc(older.id)));
    assert.equal(S.resolveTeachingSelection(v, "student", { ...choice, receiptId: older.id }, "W23", null).allowed, false);
  }
});

test("W23 renders supported nonnumeric released outcomes without a score figure", () => {
  for (const status of ["excused", "missing"]) {
    const data = copy(WB.data), result = data.scenarios.overrides.math_released.find((o) => o.collection === "results");
    result.record.released = { status, score: null };
    const html = direct("W23", { role: "student", scenario, data, selection: choice }).html;
    assert.ok(html.toLowerCase().includes(status));
    assert.ok(!html.includes("undefined") && !html.includes("NaN"));
  }
});

test("own immutable receipt remains visible when assessment is unpublished, without its title or feedback", () => {
  const data = copy(WB.data), assessment = data.coursework.assessments.find((x) => x.id === item.id);
  assessment.published = false;
  const selection = { ...choice, receiptId: receipt.id };
  const html = mainOf(direct("W22", { role: "student", data, scenario, selection }).html);
  assert.ok(html.includes(esc(receipt.id)) && html.includes("Assessment no longer published"));
  assert.ok(!html.includes(esc(item.title)) && !html.includes(esc(entry.comment)));
  const resolved = S.resolveTeachingSelection(S.buildView(data, scenario), "student", { ...choice }, "W23", null);
  assert.equal(resolved.allowed, false);
});

test("quiz receipt shows only its own acknowledged attempt, not a newer attempt or release", () => {
  const data = copy(WB.data), oldAttempt = data.quiz.attempts[0];
  const oldReceipt = data.coursework.receipts.find((r) => r.id === oldAttempt.receipt_id);
  const newId = `${oldReceipt.id}-new`, newAttempt = copy(oldAttempt);
  oldAttempt.answers[0].value = "Earlier answer";
  newAttempt.id += "-new"; newAttempt.receipt_id = newId; newAttempt.attempt += 1; newAttempt.answers[0].value = "Later answer";
  data.quiz.attempts.unshift(newAttempt);
  data.coursework.receipts.push({ ...oldReceipt, id: newId, attempt: newAttempt.attempt });
  data.coursework.submissions.find((s) => s.person_id === who.personId && s.assessment_id === oldAttempt.quiz_id).receipt_id = newId;
  const selection = { courseId: who.courseId, assessmentId: oldAttempt.quiz_id, receiptId: oldReceipt.id };
  const result = direct("W27", { role: "student", data, selection });
  assert.deepEqual(result.problems, []);
  const html = mainOf(result.html);
  assert.ok(html.includes("Earlier answer") && !html.includes("Later answer"));
  assert.ok(html.includes("No released feedback for this attempt"));
});

test("older submission receipt never offers feedback bound to a later attempt", () => {
  const old = S.receiptsFor(v, item.id, selectedWho).find((r) => r.id !== receipt.id);
  const html = mainOf(direct("W22", { role: "student", scenario, selection: { ...choice, receiptId: old.id } }).html);
  assert.ok(html.includes(esc(old.id)) && !html.includes("View feedback"));
});
