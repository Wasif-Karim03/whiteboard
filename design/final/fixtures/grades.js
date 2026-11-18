/* Whiteboard Phase 2b fixtures: PHYS 110 grading policy, released and pending results, the PS4 grade draft
   and the course-total selectors.
   Sources: spec/docs/06-spec-04-workflows-and-records.html:15 (fixture check), spec/docs/11-staff-evidence.html
   :10 (weights 40/25/35), spec/pages/W24.html and W52.html (acceptance checks), decisions.md BD18 (the W53
   preview shows the before and after totals), board-deep-dive-2026-11-15.md:996-1005 (arithmetic re-derived)
   and :1764 (PS4 marks, rubric v2, revision 3). Every displayed percentage is computed here from records;
   the golden numbers are check references only and no page reads them. Fictional, "reconstructed". */
(function (root) {
  "use strict";
  var WB = root.WB;
  var sel = WB.sel;
  var def = function (k, v) { return WB.defineFrozen(sel, k, v); };
  var PHYS = "phys110-f26";
  var MATH = "math220-f26";

  function result(person, item, released, pending) {
    return { id: person + "-" + item, person_id: person, item_id: item, released: released, pending: pending };
  }
  var scored = function (n) { return { status: "scored", score: n }; };
  var NONE = { status: null, score: null };
  function entry(person, outcome, comment) { return { person_id: person, status: outcome.status, score: outcome.score, comment: comment }; }
  function release(id, item, at, entries) { return { id: id, course_id: PHYS, item_id: item, version: 1, released_at: at, actor_id: "reyes", entries: entries }; }

  WB.defineFrozen(WB.data, "grades", {
    meta: { source: "reconstructed", basis: ["spec/docs/06-spec-04-workflows-and-records.html:15", "spec/docs/11-staff-evidence.html:10", "decisions.md BD18", "board-deep-dive-2026-11-15.md:996-1005,1764"] },
    policy: {
      id: "phys110-policy", course_id: PHYS, version: 1, mode: "weighted", method: "proportional",
      categories: [
        { id: "assignments", weight: 40, items: ["ps1", "ps2", "ps3", "ps4"] },
        { id: "labs", weight: 25, items: ["lab1"] },
        { id: "quizzes", weight: 35, items: ["quiz2", "quiz3"] },
      ],
      ungraded: "exclude", excused: "remove", missing: "zero_after_release", empty_categories: "renormalise",
      rounding: { digits: 2, at: "final", mode: "half_up" },
    },
    // Explicit additional policies; the original PHYS policy stays authoritative for compatibility.
    policies: [{
      id: "math220-policy", course_id: MATH, version: 1, mode: "weighted", method: "proportional",
      categories: [{ id: "assignments", weight: 100, items: ["math-assignment"] }],
      ungraded: "exclude", excused: "remove", missing: "zero_after_release", empty_categories: "renormalise",
      rounding: { digits: 2, at: "final", mode: "half_up" },
    }],
    grade_items: [
      { id: "math-assignment", course_id: MATH, category: "assignments", max: 10 },
      { id: "ps1", category: "assignments", max: 30 },
      { id: "ps2", category: "assignments", max: 30 },
      { id: "ps3", category: "assignments", max: 30 },
      { id: "ps4", category: "assignments", max: 30 },
      { id: "lab1", category: "labs", max: 20 },
      { id: "quiz2", category: "quizzes", max: 10 },
    ],
    // released: the learner's released snapshot; pending: a staff value not yet released (null when none).
    results: [
      result("aisha", "math-assignment", NONE, scored(8)),
      result("ben", "math-assignment", NONE, scored(6)),
      result("aisha", "ps1", scored(24), null),
      result("aisha", "ps2", scored(27), null),
      result("aisha", "ps3", { status: "excused", score: null }, null),
      result("aisha", "ps4", NONE, scored(27)),
      result("aisha", "lab1", scored(18), null),
      result("aisha", "quiz2", scored(8), null),
      result("carmen", "ps4", NONE, { status: "missing", score: null }),
      result("ben", "ps1", scored(22), null),
      result("ben", "ps2", scored(25), null),
      result("ben", "ps3", scored(26), null),
      result("ben", "lab1", scored(17), null),
      result("ben", "quiz2", scored(7), null),
      result("carmen", "ps1", scored(20), null),
      result("carmen", "ps2", scored(18), null),
      result("carmen", "ps3", scored(21), null),
      result("carmen", "lab1", scored(15), null),
      result("carmen", "quiz2", scored(6), null),
    ],
    grade_drafts: [
      {
        id: "aisha-ps4", person_id: "aisha", assessment_id: "ps4", receipt_id: "AH-PHYS110-001",
        marks: { "1a": 6, "1b": 4, "2": 5, "3": 7, "4": 5 }, reviewed_questions: ["1a", "1b", "2", "3", "4"],
        review_complete: true, release_state: "held", rubric_version: 2, revision: 3,
        overall_comment: "Clear working throughout; check the sign of vertical acceleration in question 2.",
        reviewer_id: "maya", reviewed_at: "2026-10-19T14:30:00-04:00",
        comments: {
          "2": "Vertical acceleration should be negative with up as positive.",
          "3": "Range is right; state the launch angle you used.",
          "4": "Add units to the final answer.",
        },
      },
      {
        id: "aisha-math-assignment", course_id: MATH, person_id: "aisha", assessment_id: "math-assignment", receipt_id: "AH-MATH220-001",
        marks: { q1: 8 }, reviewed_questions: ["q1"], review_complete: true, release_state: "held",
        rubric_version: 1, revision: 1, reviewer_id: "reyes", reviewed_at: "2026-10-19T15:00:00-04:00",
        overall_comment: "Explain why the column vectors are independent.", comments: { q1: "Check the final row operation." },
      },
    ],
    // Immutable learner snapshots, one per release; a correction adds a new version (W53). Entries equal each
    // result's released value. Chosen by Claude under owner delegation (Phase 2 gate M5, R5).
    releases: [
      release("rel-ps1-1", "ps1", "2026-09-30T09:00:00-04:00", [entry("aisha", scored(24), "Good setup on every problem."), entry("ben", scored(22), "Check units in the last problem."), entry("carmen", scored(20), "Show the free-body diagram first.")]),
      release("rel-ps2-1", "ps2", "2026-10-07T09:00:00-04:00", [entry("aisha", scored(27), "Careful, complete working."), entry("ben", scored(25), "Neat algebra; label the axes."), entry("carmen", scored(18), "Review vector components.")]),
      release("rel-quiz2-1", "quiz2", "2026-10-13T15:00:00-04:00", [entry("aisha", scored(8), "Solid on the graph questions."), entry("ben", scored(7), "Recheck the sign of acceleration."), entry("carmen", scored(6), "Revisit average velocity.")]),
      release("rel-ps3-1", "ps3", "2026-10-14T09:00:00-04:00", [entry("aisha", { status: "excused", score: null }, "Excused with an approved request."), entry("ben", scored(26), "Strong reasoning throughout."), entry("carmen", scored(21), "Good progress on the projectile problem.")]),
      release("rel-lab1-1", "lab1", "2026-10-14T09:30:00-04:00", [entry("aisha", scored(18), "Clear data table and graph."), entry("ben", scored(17), "Add uncertainty to the results."), entry("carmen", scored(15), "Complete the conclusion section.")]),
    ],
    // Check references only (team plan §3 Step 7.3); pages never read these.
    golden: { learner_released: 84.5, staff_draft: 85.17, learner_after_ps4_release: 85.17, labs_empty: 82.67, all_empty: null, equal_vs_proportional: { equal: 75, proportional: 54.55 } },
  });

  function policyFor(view, courseId) {
    var g = view.data.grades;
    if (g.policy && g.policy.course_id === courseId) return g.policy;
    return (g.policies || []).filter(function (p) { return p.course_id === courseId; })[0] || null;
  }
  function itemCourse(view, itemId) {
    var item = sel.assessment(view, itemId);
    if (item) return item.course_id;
    // Historical grade-only items are tied to explicit policy membership, never the viewer's default course.
    var g = view.data.grades, policies = [g.policy].concat(g.policies || []).filter(Boolean);
    var matches = policies.filter(function (p) { return p.categories.some(function (c) { return c.items.indexOf(itemId) >= 0; }); });
    return matches.length === 1 ? matches[0].course_id : null;
  }
  function enrolledLearner(view, courseId, personId) { return sel.enrolled(view, courseId, "student").indexOf(personId) >= 0; }
  function taskScope(view, assessmentId, courseId, who) {
    var access = sel.taTaskAccess(view, assessmentId, who);
    return access.active && access.task.course_id === courseId ? sel.taScope(view, assessmentId, who) : null;
  }
  def("gradingPolicy", function (view, courseId, who) {
    return who && (!who.courseId || who.courseId === courseId) && sel.verifiedRole(view, who, courseId) ? policyFor(view, courseId) : null;
  });

  // Pure core. categories: [{id, weight}]; items: [{category, score, max}] already filtered to counted
  // items. method "proportional" sums points; "equal" averages item fractions. Zero-point items (max 0) never
  // count under either method (R13). Empty categories (no items left) drop out and the remaining weights
  // renormalise; all empty gives value null.
  function weightedTotal(categories, items, method) {
    var represented = 0;
    var sum = 0;
    var scored = items.filter(function (it) { return it.max > 0; });
    categories.forEach(function (cat) {
      var mine = scored.filter(function (it) { return it.category === cat.id; });
      var possible = mine.reduce(function (n, it) { return n + it.max; }, 0);
      if (!mine.length || possible <= 0) return;
      var fraction = method === "equal"
        ? mine.reduce(function (n, it) { return n + it.score / it.max; }, 0) / mine.length
        : mine.reduce(function (n, it) { return n + it.score; }, 0) / possible;
      represented += cat.weight;
      sum += cat.weight * fraction;
    });
    if (represented <= 0) return { value: null, display: null, representedWeight: 0, empty: true };
    var value = (sum / represented) * 100;
    return { value: value, display: sel.pct(value), representedWeight: represented, empty: false };
  }
  def("weightedTotal", weightedTotal);

  // The snapshot an audience may count: the learner reads only released results (or pending ones an
  // instructor assumes released, for the W53 preview); staff read pending before released.
  function snapshot(r, audience, assumeReleased) {
    if (!r) return null;
    if (audience === "staff") return r.pending || r.released;
    if (assumeReleased.indexOf(r.item_id) >= 0 && r.pending) return r.pending;
    return r.released;
  }

  // replace: {itemId, outcome} counts that outcome for one item instead of the audience's snapshot (R9).
  function countedItems(view, courseId, personId, audience, assume, replace) {
    var g = view.data.grades;
    var policy = policyFor(view, courseId);
    if (!policy) return [];
    var out = [];
    policy.categories.forEach(function (cat) {
      cat.items.forEach(function (itemId) {
        var item = gradeItem(view, itemId, courseId);
        var r = g.results.filter(function (x) { return x.person_id === personId && x.item_id === itemId; })[0];
        var s = replace && replace.itemId === itemId ? replace.outcome : snapshot(r, audience, assume);
        if (!item || !s || s.status === null || s.status === "excused") return;
        out.push({ id: itemId, category: cat.id, score: s.status === "missing" ? 0 : s.score, max: item.max });
      });
    });
    return out;
  }

  // M3: the audience comes from the viewer, never from the caller. A verified instructor reads staff values
  // (or the learner view with opts.as "learner"); a verified student reads their own learner view; a TA and
  // everyone else get null. opts.assumeReleased is honoured only for an instructor.
  function audienceFor(view, courseId, personId, who, opts) {
    var o = opts || {};
    if (!who || (who.courseId && who.courseId !== courseId) || !policyFor(view, courseId) || !enrolledLearner(view, courseId, personId)) return null;
    var role = sel.verifiedRole(view, who, courseId);
    if (role === "instructor") return { audience: o.as === "learner" ? "learner" : "staff", assume: o.assumeReleased || [] };
    if (role === "student" && who.personId === personId) return { audience: "learner", assume: [] };
    return null;
  }

  var EMPTY_TOTAL = { value: null, display: null, representedWeight: 0, empty: true };
  function totalFor(view, courseId, personId, audience, assume, replace) {
    var policy = policyFor(view, courseId);
    if (!policy) return EMPTY_TOTAL;
    return weightedTotal(policy.categories, countedItems(view, courseId, personId, audience, assume, replace), policy.method);
  }

  def("categoryPercent", function (view, courseId, personId, catId, who, opts) {
    var a = audienceFor(view, courseId, personId, who, opts);
    if (!a) return null;
    var items = countedItems(view, courseId, personId, a.audience, a.assume).filter(function (it) { return it.category === catId; });
    var t = weightedTotal([{ id: catId, weight: 1 }], items, policyFor(view, courseId).method);
    return t.empty ? null : t.value;
  });

  // {value, display, representedWeight, empty}; display is null (never 0 or NaN) when nothing counts. Null
  // when the viewer may not read this learner's total.
  def("courseTotal", function (view, courseId, personId, who, opts) {
    var a = audienceFor(view, courseId, personId, who, opts);
    return a ? totalFor(view, courseId, personId, a.audience, a.assume) : null;
  });

  // Draft total summed from the marks and the assessment's question maxima (R2): all questions for a verified
  // instructor; for a TA in scope for the learner, only the assigned questions; null otherwise or with no draft.
  def("draftTotal", function (view, personId, assessmentId, who) {
    var d = view.data.grades.grade_drafts.filter(function (x) { return x.person_id === personId && x.assessment_id === assessmentId; })[0];
    var item = sel.assessment(view, assessmentId);
    if (!d || !item || !item.questions) return null;
    if (!who || (who.courseId && who.courseId !== item.course_id) || !enrolledLearner(view, item.course_id, personId)) return null;
    var role = sel.verifiedRole(view, who, item.course_id);
    var scope = role === "ta" ? taskScope(view, assessmentId, item.course_id, who) : null;
    if (role !== "instructor" && !(scope && scope.learnerIds.indexOf(personId) >= 0)) return null;
    var questions = scope ? item.questions.filter(function (q) { return scope.questionIds.indexOf(q.id) >= 0; }) : item.questions;
    return questions.reduce(function (t, q) {
      return { score: t.score + (d.marks[q.id] || 0), max: t.max + q.max };
    }, { score: 0, max: 0 });
  });

  // ---------- Release history and held payloads (Phase 2 gate R4, R5, R6, R9) ----------
  function byVersion(a, b) { return a.version - b.version; }
  // Snapshots of one item in the course that contain the learner, oldest version first.
  function snapshotsWith(view, courseId, personId, itemId) {
    return view.data.grades.releases.filter(function (r) {
      return r.course_id === courseId && r.item_id === itemId && r.entries.some(function (e) { return e.person_id === personId; });
    }).slice().sort(byVersion);
  }
  function entryOf(snap, personId) { return snap.entries.filter(function (e) { return e.person_id === personId; })[0]; }
  function latestEntry(view, courseId, personId, itemId) {
    var list = snapshotsWith(view, courseId, personId, itemId);
    return list.length ? { release: list[list.length - 1], entry: entryOf(list[list.length - 1], personId), count: list.length } : null;
  }
  function draftOf(view, personId, itemId) {
    var courseId = itemCourse(view, itemId);
    return view.data.grades.grade_drafts.filter(function (d) { return d.person_id === personId && d.assessment_id === itemId && (!d.course_id || d.course_id === courseId); })[0] || null;
  }
  // The assessment for a release request, or null unless the assessment, the requested course and the grades
  // policy all name the same course (REV-01: no cross-course draft or payload lookup).
  function releaseItem(view, courseId, itemId) {
    var item = sel.assessment(view, itemId);
    return item && item.course_id === courseId && gradeItem(view, itemId, courseId) ? item : null;
  }
  // R9: the one held payload that feeds candidates, preview arithmetic and the fingerprint. A reviewed grade
  // draft is held when the latest snapshot entry for the learner and item does not carry its revision.
  function heldPayload(view, courseId, personId, itemId) {
    if (!releaseItem(view, courseId, itemId) || !enrolledLearner(view, courseId, personId)) return null;
    var d = draftOf(view, personId, itemId);
    if (!d || !d.review_complete) return null;
    if (d.receipt_id) {
      var found = receiptFor(view, d.receipt_id), receipt = found && found.receipt;
      if (!receipt || receipt.course_id !== courseId || receipt.assessment_id !== itemId ||
          (receipt.owner_id !== personId && (receipt.captured_members || []).indexOf(personId) < 0)) return null;
    }
    var latest = latestEntry(view, courseId, personId, itemId);
    if (latest && latest.entry.draft_revision === d.revision) return null;
    var score = Object.keys(d.marks).reduce(function (n, q) { return n + d.marks[q]; }, 0);
    return { draft: d, score: score, status: "scored", revision: d.revision, revised: !!latest };
  }

  // W53 candidates (BD31, R4), for a viewer who may release; null otherwise. Completion is read from the
  // current grade draft revision, the same record heldPayload uses (REV-03): received work with no draft or a
  // draft whose review is not complete is listed as not ready; a held payload is ready (revised when an earlier
  // snapshot exists); a learner whose latest snapshot already carries the current revision has no row.
  def("releaseReady", function (view, assessmentId, who) {
    var item = sel.assessment(view, assessmentId);
    if (!item || !who || (who.courseId && who.courseId !== item.course_id) || !releaseItem(view, item.course_id, assessmentId) || !sel.canRelease(view, who, item.course_id)) return null;
    var family = sel.receivedFamily();
    return sel.submissionsFor(view, assessmentId).filter(function (s) { return s.course_id === item.course_id && enrolledLearner(view, item.course_id, s.person_id) && family.indexOf(s.state) >= 0; }).map(function (s) {
      var d = draftOf(view, s.person_id, assessmentId);
      if (!d || !d.review_complete) return { personId: s.person_id, included: false, reason: "notReady", revised: false };
      var held = heldPayload(view, item.course_id, s.person_id, assessmentId);
      return held ? { personId: s.person_id, included: true, reason: "ready", revised: held.revised } : null;
    }).filter(Boolean);
  });

  // 32-bit FNV-1a as 8 hex digits. A change detector for a fictional local preview, not a security control.
  function fnv1a(text) {
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ("0000000" + h.toString(16)).slice(-8);
  }
  function receiptFor(view, receiptId) {
    var own = view.data.coursework.receipts.filter(function (r) { return r.id === receiptId; })[0];
    if (own) return { receipt: own, group: false };
    var group = view.data.groups.receipts.filter(function (r) { return r.id === receiptId; })[0];
    return group ? { receipt: group, group: true } : null;
  }
  // R6: every input the preview binds, in a fixed key order.
  function previewInputs(view, courseId, personId, itemId, held) {
    var policy = policyFor(view, courseId);
    var d = held.draft;
    var found = d.receipt_id ? receiptFor(view, d.receipt_id) : null;
    var r = found ? found.receipt : null;
    var released = view.data.grades.releases.filter(function (x) {
      return x.course_id === courseId && x.entries.some(function (e) { return e.person_id === personId; });
    }).map(function (x) { return { id: x.id, version: x.version }; }).sort(function (a, b) { return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; });
    return {
      kind: "reviewed_attempt", courseId: courseId, itemId: itemId, personId: personId,
      policy: { id: policy.id, version: policy.version },
      receipt: r ? { id: r.id, attempt: r.attempt, assessmentVersion: r.assessment_version === undefined ? null : r.assessment_version } : null,
      rubricVersion: d.rubric_version === undefined ? null : d.rubric_version,
      draft: { revision: d.revision, marks: d.marks, comments: d.comments || {}, overallComment: d.overall_comment || null },
      released: released,
      membershipVersion: found && found.group ? found.receipt.membership_version : null,
    };
  }

  // BD18, R6, R9: the W53 preview for a viewer who may release an item of this course; null otherwise. before is the learner-visible
  // released total; after counts the held payload for this item. fingerprint and inputs are null when the
  // learner has no held payload (after then equals before).
  def("releasePreview", function (view, courseId, personId, itemId, who) {
    if (!who || (who.courseId && who.courseId !== courseId) || !enrolledLearner(view, courseId, personId) || !releaseItem(view, courseId, itemId) || !sel.canRelease(view, who, courseId)) return null;
    var held = heldPayload(view, courseId, personId, itemId);
    var before = totalFor(view, courseId, personId, "learner", []).display;
    if (!held) return { before: before, after: before, fingerprint: null, inputs: null };
    var outcome = { status: held.status, score: held.score };
    var inputs = previewInputs(view, courseId, personId, itemId, held);
    return {
      before: before,
      after: totalFor(view, courseId, personId, "learner", [], { itemId: itemId, outcome: outcome }).display,
      fingerprint: "fp-" + fnv1a(JSON.stringify(inputs)),
      inputs: inputs,
    };
  });

  // ---------- Result, draft and gradebook projections (Phase 2 gate M4, R2, R8) ----------
  // Who may read one learner's record for one grade item. A student reads their own (learner view); a
  // verified instructor reads staff values; a TA reads staff values only when the item's task scope includes
  // the learner, and the read is partial when the task does not cover every canonical question (R8). Null
  // for everyone else.
  function accessFor(view, personId, itemId, who) {
    var courseId = itemCourse(view, itemId);
    if (!courseId || !who || (who.courseId && who.courseId !== courseId) || !policyFor(view, courseId) || !enrolledLearner(view, courseId, personId)) return null;
    var role = sel.verifiedRole(view, who, courseId);
    if (role === "student") return who.personId === personId ? { staff: false, partial: false } : null;
    if (role === "instructor") return { staff: true, partial: false };
    if (role !== "ta") return null;
    var scope = taskScope(view, itemId, courseId, who);
    if (!scope || scope.learnerIds.indexOf(personId) < 0) return null;
    return { staff: true, partial: !scope.allQuestions, questionIds: scope.questionIds };
  }
  function gradeItem(view, itemId, courseId) {
    var course = itemCourse(view, itemId), policy = policyFor(view, courseId || course);
    if (!course || course !== (courseId || course) || !policy || !policy.categories.some(function (c) { return c.items.indexOf(itemId) >= 0; })) return null;
    return view.data.grades.grade_items.filter(function (x) { return x.id === itemId && (!x.course_id || x.course_id === course); })[0] || null;
  }
  function resultOf(view, personId, itemId) {
    return view.data.grades.results.filter(function (x) { return x.person_id === personId && x.item_id === itemId; })[0] || null;
  }
  // Keys of obj limited to the listed question ids, as a new object.
  function pick(obj, ids) {
    var out = {};
    Object.keys(obj || {}).forEach(function (k) { if (ids.indexOf(k) >= 0) out[k] = obj[k]; });
    return out;
  }
  // Grade items in policy category order.
  function orderedItems(view, courseId) {
    var policy = policyFor(view, courseId);
    return policy ? policy.categories.reduce(function (acc, cat) {
      return acc.concat(cat.items.map(function (id) { return gradeItem(view, id, courseId); }).filter(Boolean));
    }, []) : [];
  }

  // Builds the projection for a granted access: released value and latest snapshot for everyone; staffOutcome
  // (the result's pending value) and scoreWithheld for staff; a partial TA read drops the whole-assessment score and the overall comment.
  function projectResult(view, personId, item, acc) {
    var courseId = itemCourse(view, item.id);
    var r = resultOf(view, personId, item.id);
    var released = r ? r.released : { status: null, score: null };
    var latest = released.status === null ? null : latestEntry(view, courseId, personId, item.id);
    var out = {
      itemId: item.id, max: item.max, status: released.status, score: released.score,
      releasedAt: latest ? latest.release.released_at : null,
      comment: latest ? latest.entry.comment || null : null,
      questionComments: latest ? pick(latest.entry.question_comments, Object.keys(latest.entry.question_comments || {})) : null,
    };
    if (!acc.staff) return out;
    out.staffOutcome = r && r.pending ? { status: r.pending.status, score: r.pending.score } : null;
    out.scoreWithheld = acc.partial;
    if (acc.partial) {
      out.score = null;
      if (out.staffOutcome) out.staffOutcome.score = null;
      out.comment = null;
      if (out.questionComments) out.questionComments = pick(out.questionComments, acc.questionIds);
    }
    return out;
  }

  def("resultFor", function (view, personId, itemId, who) {
    var item = gradeItem(view, itemId);
    var acc = item ? accessFor(view, personId, itemId, who) : null;
    return acc ? WB.deepFreeze(projectResult(view, personId, item, acc)) : null;
  });

  // One row per grade item the viewer may read, in policy category order. counted says whether the item
  // counts in the viewer's total (released values for a learner, staff values for staff).
  def("gradeRows", function (view, courseId, personId, who) {
    if (!policyFor(view, courseId) || !who || (who.courseId && who.courseId !== courseId)) return null;
    var rows = orderedItems(view, courseId).map(function (item) {
      var acc = accessFor(view, personId, item.id, who);
      if (!acc) return null;
      var res = projectResult(view, personId, item, acc);
      var a = sel.assessment(view, item.id);
      var row = { itemId: item.id, title: a ? a.title : item.id, category: item.category, max: item.max, status: res.status, score: res.score };
      var counting = acc.staff ? res.staffOutcome || res : res;
      row.counted = counting.status !== null && counting.status !== "excused";
      if (acc.staff) { row.staffOutcome = res.staffOutcome; row.scoreWithheld = res.scoreWithheld; }
      return row;
    }).filter(Boolean);
    return rows.length ? WB.deepFreeze(rows) : null;
  });

  // The grade draft for staff: the whole draft for an instructor; for a TA in scope, total and partial, and
  // when partial only the assigned questions' marks, comments and review state (R2). Null otherwise.
  def("gradeDraftFor", function (view, personId, assessmentId, who) {
    var d = draftOf(view, personId, assessmentId);
    var acc = d ? accessFor(view, personId, assessmentId, who) : null;
    if (!acc || !acc.staff) return null;
    var out = JSON.parse(JSON.stringify(d));
    out.total = sel.draftTotal(view, personId, assessmentId, who);
    out.partial = acc.partial;
    if (acc.partial) {
      var ids = acc.questionIds;
      out.marks = pick(d.marks, ids);
      out.comments = pick(d.comments, ids);
      out.reviewed_questions = d.reviewed_questions.filter(function (q) { return ids.indexOf(q) >= 0; });
      out.overall_comment = null;
      out.review_complete = ids.every(function (q) { return d.reviewed_questions.indexOf(q) >= 0; });
    }
    return WB.deepFreeze(out);
  });

  // W52 gradebook. Instructor: every grade item and enrolled student with staff and released totals. Active
  // TA: only task items and task learners, no totals, partial cells withheld. Null otherwise.
  def("gradebook", function (view, courseId, who) {
    if (!policyFor(view, courseId) || !who || (who.courseId && who.courseId !== courseId)) return null;
    var role = sel.verifiedRole(view, who, courseId);
    if (role !== "instructor" && role !== "ta") return null;
    var staff = role === "instructor";
    var items = orderedItems(view, courseId).filter(function (item) { return staff || !!taskScope(view, item.id, courseId, who); });
    var people = sel.enrolled(view, courseId, "student").filter(function (p) {
      return staff || items.some(function (item) { return !!accessFor(view, p, item.id, who); });
    });
    if (!items.length || !people.length) return null;
    var rows = people.map(function (p) {
      var cells = {};
      items.forEach(function (item) {
        var acc = accessFor(view, p, item.id, who);
        if (!acc) { cells[item.id] = null; return; }
        var res = projectResult(view, p, item, acc);
        var value = res.staffOutcome || { status: res.status, score: res.score };
        cells[item.id] = { status: value.status, score: acc.partial ? null : value.score, held: !!res.staffOutcome, scoreWithheld: acc.partial };
      });
      var person = sel.person(view, p);
      return {
        personId: p, name: person ? person.name : p, cells: cells,
        total: staff ? totalFor(view, courseId, p, "staff", []).display : null,
        releasedTotal: staff ? totalFor(view, courseId, p, "learner", []).display : null,
      };
    });
    return WB.deepFreeze({
      items: items.map(function (item) { var a = sel.assessment(view, item.id); return { id: item.id, title: a ? a.title : item.id, category: item.category, max: item.max }; }),
      rows: rows,
    });
  });

  // Release history for an item, oldest version first: every snapshot for an instructor; for a student only
  // the snapshots that contain them, each reduced to their own entry. Null for TAs and everyone else.
  def("releasesFor", function (view, itemId, who) {
    var courseId = itemCourse(view, itemId);
    if (!courseId || !who || (who.courseId && who.courseId !== courseId) || !policyFor(view, courseId)) return null;
    var role = sel.verifiedRole(view, who, courseId);
    var list = view.data.grades.releases.filter(function (r) { return r.course_id === courseId && r.item_id === itemId; }).slice().sort(byVersion);
    if (role === "instructor") return WB.deepFreeze(JSON.parse(JSON.stringify(list)));
    if (role !== "student") return null;
    return WB.deepFreeze(list.filter(function (r) { return !!entryOf(r, who.personId); }).map(function (r) {
      return { id: r.id, course_id: r.course_id, item_id: r.item_id, version: r.version, released_at: r.released_at, entries: [JSON.parse(JSON.stringify(entryOf(r, who.personId)))] };
    }));
  });

  // The latest release time the viewer may know about: any snapshot in the course for an instructor, the
  // student's own snapshots for a student; null otherwise or when none exists.
  def("lastReleaseAt", function (view, courseId, who) {
    if (!who || (who.courseId && who.courseId !== courseId)) return null;
    var role = sel.verifiedRole(view, who, courseId);
    if (role !== "instructor" && role !== "student") return null;
    return view.data.grades.releases.filter(function (r) {
      return r.course_id === courseId && (role === "instructor" || !!entryOf(r, who.personId));
    }).reduce(function (latest, r) { return !latest || sel.isBefore(latest, r.released_at) ? r.released_at : latest; }, null);
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
