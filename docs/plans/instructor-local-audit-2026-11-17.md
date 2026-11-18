# Instructor workspace local audit

17 November 2026. This source audit used fictional fixtures and rendered HTML. Browser acceptance and backend persistence were outside its scope.

## Instructor access with and without TA staffing

The comparison started with the default PHYS110 fixture, which has an enrolled TA with a PS4 allocation. Two independently cloned fixtures removed all grading tasks. One retained the TA’s course membership. The other also removed that course from the TA’s enrollment.

| Instructor projection | Staffed default | Enrolled TA with no tasks | No TA enrolled in course |
| --- | --- | --- | --- |
| PS4 receipts | AH-PHYS110-001 and AH-PHYS110-002 | Identical | Identical |
| PS4 handed in | 2 of 3 learners | Identical | Identical |
| PS4 reviewed | 1 of 2 received submissions | Identical | Identical |
| PS4 release readiness | Aisha included, Ben held back | Identical | Identical |
| Course gradebook | 3 learners × 6 grade items, including working and released totals | Identical | Identical |
| Instructor source renders without structural findings | Baseline for projection comparison | 27 of 27 | 27 of 27 |

The comparisons covered the complete serialized selector returns. The 54 renders covered W05, W18, W35, W45, W48, W49, W51, W53 and W57 on web, iPad and iPhone. Both variants passed the structural checks while still exposing two presentation errors. W45 offered to revoke Maya’s access and change her end date with no task to manage. When her course enrollment was removed, the web roster correctly omitted her but the grading-access heading still named her. W57 showed an empty plan on all three platforms, while iPhone also offered to flag a nonexistent task for follow-up.

## Capability inventory

| Capability | What the prototype models or displays | Current limit |
| --- | --- | --- |
| Find and manage coursework | W18 lists eight PHYS assessments. PS4, Motion and Quiz 3 have editor routes. Instructor projections include unpublished planning records when present. | Dedicated W48 queue and W53 release routes cover PS4. Other assessments need record-specific destinations before claiming end-to-end coverage. |
| Inspect submissions and grades | W48 separates PS4 receipts and Motion group submissions. W49 draws individual PS4 and group-receipt grader variants. W51 web shows the whole course gradebook, with working and released totals. | The web gradebook links directly to the grader from Aisha’s PS4 cell. Its six grade items exclude Motion and Quiz 3. Eight assessments do not imply eight grade items. |
| Find one learner’s course records | W45 web lists enrolled people by name and role. Compact W51 shows a single learner’s grade items. | W45 roster rows have no learner-record destination. The compact roster is omitted and the compact gradebook has no learner picker. |
| Delegate grading | Task records carry course, assessment, TA, learner IDs, question IDs, grading deadline, access end and a false release permission. Partial scopes limit marks and comments. Release authority belongs to the instructor. | Reassignment and revocation are preview controls. The model has no section assignment field, configured co-instructor policy or persisted handover audit. |
| Teach multiple courses | Reyes has instructor membership in PHYS110 and MATH220. W06 offers per-course calendars. | Only the anchored course opens its builder. The gradebook selector returns null for MATH220 because the fixture supplies a PHYS110 grading policy only. |
| Manage exceptions | W52 previews working and released calculations. W54 shows correction context with no request and disabled decision controls. W58 distinguishes unrecorded attendance from absence. | These pages demonstrate read-only projections and preview states. They do not establish saved corrections, attendance or real notifications. |

The source of truth for instructor and TA access is in [staff selectors](../../design/final/fixtures/staff.js), [grade projections](../../design/final/fixtures/grades.js) and [coursework selectors](../../design/final/fixtures/coursework.js). Route coverage is defined by the [record anchors](../../design/final/manifest/anchors.js). Relevant page implementations include [course entry](../../design/final/pages/seg2-course/W06.js), [assessments](../../design/final/pages/seg2-course/W18.js), [roster](../../design/final/pages/seg5-authoring/W45.js), [submission queue](../../design/final/pages/seg6-grading/W48.js), [gradebook](../../design/final/pages/seg6-grading/W51.js) and [grading planner](../../design/final/pages/seg6-grading/W57.js).

## Reproduce the comparison

Run this from the repository root. It uses the existing source-render helper and changes only cloned data in memory.

```sh
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { WB, S, copy, direct, view } from './design/final/tools/spine_helpers.mjs';

const base = view();
const teacher = S.viewerFor(base, 'instructor');
const assessment = S.anchorFor('W19').record.id;
const pages = ['W05', 'W18', 'W35', 'W45', 'W48', 'W49', 'W51', 'W53', 'W57'];

for (const removeMembership of [false, true]) {
  const data = copy(WB.data);
  data.staff.grading_tasks = [];
  if (removeMembership) {
    for (const enrollment of data.world.enrollments.filter(e => e.role === 'ta')) {
      enrollment.course_ids = enrollment.course_ids.filter(id => id !== teacher.courseId);
    }
  }
  const changed = S.buildView(data, 'default');
  const current = S.viewerFor(changed, 'instructor');
  for (const key of ['receiptsFor', 'receivedProgress', 'reviewProgress', 'releaseReady', 'gradebook']) {
    const id = key === 'gradebook' ? teacher.courseId : assessment;
    assert.equal(JSON.stringify(S[key](changed, id, current)), JSON.stringify(S[key](base, id, teacher)));
  }
  let renders = 0;
  for (const page of pages) {
    for (const platform of ['web', 'ipad', 'iphone']) {
      assert.equal(direct(page, {role: 'instructor', platform, data}).problems.length, 0);
      renders++;
    }
  }
  console.log({ enrolledTAs: S.enrolled(changed, teacher.courseId, 'ta').length, renders });
}
JS
```

## Acceptance cases for a future implementation

Trace roster → learner → assessment → receipt → held review → released version for at least two learners and two assessments. Verify learner selection on compact screens and isolation across courses. Repeat for a course with no TA, an enrolled but unassigned TA, an active partial assignment, and an expired or reassigned task. Instructor records should remain accessible throughout. Former assignees should lose access to the reassigned work, while saved attribution, receipts and prior release snapshots remain intact.
