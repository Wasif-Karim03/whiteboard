import test from "node:test";
import assert from "node:assert/strict";
import { loadSite } from "./load_site.mjs";
import { checkLeaks, checkAuthority, checkFictional, fictionalTextErrors, projectedRender } from "./check_boundaries.mjs";
const W = loadSite();
const withRender = (page, extra) => ({ ...W, pageIds: () => [page], pageFor(id) {
  const e = W.pageFor(id);
  return id !== page ? e : { ...e, render(a) { const r = e.render(a); return { ...r, body: r.body + extra(a) }; } };
} });

test("Phase 4 learner noninterference, unpublished lists, authority and fictional checks pass", () => {
  for (const run of [checkLeaks, checkAuthority, checkFictional]) assert.deepEqual(run(W).errors, [], run.name);
});

test("leak checker catches held staff comments and unpublished titles in a student render", () => {
  const bad = withRender("W24", (a) => a.view.data.grades.grade_drafts[0]?.overall_comment || "");
  assert.ok(checkLeaks(bad).errors.some((e) => e.includes("held data changes learner output")));
  const hidden = withRender("W14", (a) => a.view.data.coursework.assessments.map((it) => it.title).join(" "));
  assert.ok(checkLeaks(hidden).errors.some((e) => e.includes("unpublished assessment title")));
});

test("authority checker catches TA release permission, release previews and editable receipts", () => {
  const permission = { ...W, pageIds: () => [], sel: { ...W.sel, canRelease: () => true } };
  assert.ok(checkAuthority(permission).errors.some((e) => e.includes("TA can release")));
  const preview = withRender("W53", () => '<p>fp-forbidden-preview</p>');
  assert.ok(checkAuthority(preview).errors.some((e) => e.includes("TA release/preview")));
  const receipt = withRender("W22", () => '<input aria-label="Edit receipt">');
  assert.ok(checkAuthority(receipt).errors.some((e) => e.includes("receipt has edit controls")));
});

test("fictional lint catches customer/deployment claims, real contact domains and missing notice", () => {
  for (const text of ["Trusted by 200 customers", "Deployed to production", "Contact staff@university.edu"]) assert.ok(fictionalTextErrors(text, "probe").length);
  assert.deepEqual(fictionalTextErrors("Fictional design. help@alderhill.example", "probe"), []);
  const bad = { ...W, pageIds: () => [], data: { ...W.data, world: { ...W.data.world, notice: "" } } };
  assert.ok(checkFictional(bad).errors.some((e) => e.includes("notice missing")));
});


test("unpublished direct routes hide current titles but retain scoped immutable receipts", () => {
  for (const [page, token, scenario] of [["W22", null, "default"], ["W22", "group", "group_submission"], ["W27", null, "quiz_received"], ["W27", "quiz2", "default"]]) {
    const v = JSON.parse(JSON.stringify(W.sel.scenarioView(scenario)));
    const anchor = W.sel.anchorFor(page, token);
    const who = W.sel.viewerFor(v, "student");
    const receipt = W.sel.receiptById(v, anchor.record.id, who);
    assert.ok(receipt);
    const item = v.data.coursework.assessments.find((a) => a.id === receipt.assessment_id);
    item.published = false; item.title = "UNPUBLISHED_DIRECT_ROUTE";
    const original = JSON.stringify(v);
    for (const platform of ["web", "ipad", "iphone"]) {
      const html = projectedRender(W, page, "student", platform, token, v);
      assert.ok(!html.includes(item.title));
      assert.ok(html.includes(receipt.id));
      assert.ok(html.includes(W.sel.fmtDateTime(receipt.accepted_at)));
      assert.ok(!/<(?:input|textarea|select)\b/.test(html));
    }
    assert.equal(JSON.stringify(v), original);
    const foreign = { ...who, personId: W.sel.viewerFor(v, "instructor").personId };
    assert.equal(W.sel.receiptById(v, receipt.id, foreign), null);
  }
});
