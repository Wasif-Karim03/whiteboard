(function () {
  "use strict";

  const WB = window.WB;
  const questionIndex = (s, id) =>
    Math.max(
      0,
      s.assignment.questions.findIndex((q) => q.id === id),
    );
  const questionMax = (s, id) =>
    s.assignment.questions[questionIndex(s, id)].max;
  const fallbackMarks = () => [0, 0, 0, 0, 0];
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const submissionFor = (s, id) => WB.submissionFor(s, id);
  const questionComment = (s, id, qid) =>
    (s.assessment.questionComments[id] || {})[qid] || "";
  const reviewed = (s, id) => s.assessment.reviewedQuestions[id] || [];
  const complete = (s, id) =>
    s.assignment.questions.every((q) => reviewed(s, id).includes(q.id));
  const validMarks = (s, id) =>
    marksFor(s, id).length === s.assignment.questions.length &&
    s.assignment.questions.every(
      (q, i) =>
        Number.isFinite(marksFor(s, id)[i]) &&
        marksFor(s, id)[i] >= 0 &&
        marksFor(s, id)[i] <= q.max,
    );
  const actorAllows = (roles) => !WB.ui.actor || roles.includes(WB.ui.actor);
  const editable = (s) => !s.assignment.locked;
  const allowanceFor = (s, id) =>
    s.teaching.allowances.find((a) => a.id === id);
  const policy = (s) => WB.academicPolicy(s);
  const invalidate = (s) => {
    s.teaching.releasePreview = false;
  };
  const marksFor = (s, id) => s.assessment.marks[id] || [];
  const commentFor = (s, id) => s.assessment.comments[id] || "";
  const person = (s, id) => s.people.find((p) => p.id === id);
  WB.defaults.assessment.releaseSnapshots =
    WB.defaults.assessment.releaseSnapshots || {};
  WB.state.assessment.releaseSnapshots =
    WB.state.assessment.releaseSnapshots || {};
  for (const state of [WB.defaults, WB.state]) {
    state.assessment.questionComments = state.assessment.questionComments || {};
    state.assessment.reviewedQuestions =
      state.assessment.reviewedQuestions ||
      Object.fromEntries(
        state.people.map((p) => [
          p.id,
          state.assessment.graded.includes(p.id)
            ? state.assignment.questions.map((q) => q.id)
            : [],
        ]),
      );
  }
  const receivedPeople = (s) =>
    s.people.filter(
      (p) =>
        p.active &&
        !s.teaching.excused.includes(p.id) &&
        submissionFor(s, p.id)?.status === "received",
    );
  const remaining = (s) =>
    receivedPeople(s).filter(
      (p) => !s.assessment.graded.includes(p.id) || !complete(s, p.id),
    );
  const unique = (xs) => Array.from(new Set(xs));
  const isInstructor = (s) =>
    WB.ui.actor
      ? WB.ui.actor === "instructor"
      : s.assessment.role === "instructor";
  const canGrade = (s) =>
    editable(s) &&
    (isInstructor(s) ||
      (s.assessment.role === "ta" &&
        s.institution.taActive &&
        actorAllows(["ta", "instructor"])));
  const gradeable = (s) =>
    canGrade(s) && receivedPeople(s).some((p) => p.id === s.assessment.student);
  const snapshotFor = (s, id) => s.assessment.releaseSnapshots[id];
  const hasCurrentSnapshot = (s, id) => {
    const snapshot = snapshotFor(s, id);
    return !!(
      !s.teaching.excused.includes(id) &&
      s.assessment.released.includes(id) &&
      snapshot &&
      snapshot.attempt === submissionFor(s, id)?.attempt &&
      snapshot.submissionId === submissionFor(s, id)?.id
    );
  };
  const hasReleaseDraft = (s, id) => {
    const snapshot = snapshotFor(s, id);
    return (
      hasCurrentSnapshot(s, id) &&
      (JSON.stringify(snapshot.marks) !== JSON.stringify(marksFor(s, id)) ||
        snapshot.comment !== commentFor(s, id) ||
        snapshot.rubricVersion !== s.teaching.rubricVersion ||
        JSON.stringify(snapshot.questionComments || {}) !==
          JSON.stringify(s.assessment.questionComments[id] || {}) ||
        JSON.stringify(snapshot.reviewedQuestions || []) !==
          JSON.stringify(reviewed(s, id)))
    );
  };
  const pageForQuestion = (s, id) => {
    const sub = submissionFor(s, s.assessment.student);
    return sub?.status === "received"
      ? sub.pages.find((page) =>
          String(page.tag || "")
            .split(",")
            .map((tag) => tag.trim())
            .includes(id),
        )
      : undefined;
  };
  const copyDate = (value, days) => {
    const d = new Date(value + "Z");
    if (
      !String(days).trim() ||
      !Number.isInteger(Number(days)) ||
      Math.abs(Number(days)) > 3650 ||
      Number.isNaN(d.getTime())
    )
      return "";
    d.setUTCDate(d.getUTCDate() + Number(days || 0));
    return d.toISOString().slice(0, 16);
  };
  const prettyDate = (value) => {
    const d = new Date(value + "Z");
    if (Number.isNaN(d.getTime())) return "Enter a valid date and shift";
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let hour = d.getUTCHours(),
      suffix = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} · ${hour}:${String(d.getUTCMinutes()).padStart(2, "0")} ${suffix} ET`;
  };
  const roleNotice = (s, h) =>
    isInstructor(s)
      ? ""
      : s.institution.taActive
        ? h.notice(
            "TA scope",
            "TAs can score and comment. Rubric rules and grade release remain instructor-only.",
            "warning",
          )
        : h.notice(
            "TA access revoked",
            "Maya Chen can no longer score, comment, change permissions, or release work in this course.",
            "error",
          );
  const toggleButton = (h, label, action, data, pressed, kind = "quiet") =>
    h
      .btn(label, action, data, pressed ? "primary" : kind)
      .replace("<button ", '<button aria-pressed="' + String(pressed) + '" ');
  const teacherTabs = (h, current) => {
    const links = [
      ["S14", "Build"],
      ["S15", "Assign"],
      ["S16", "Quiz"],
      ["S21", "People"],
      ["S22", "Copy"],
      ["S23", "Insights"],
    ];
    return `<nav class="segmented" aria-label="Faculty workspace">${links.map(([id, label]) => (id === current ? `<span class="button primary" aria-current="page">${label}</span>` : h.go(label, id, "quiet"))).join("")}</nav>`;
  };
  const gradeStatus = (s, id) => {
    if (s.teaching.excused.includes(id)) return "Excused";
    if (hasReleaseDraft(s, id)) return "New draft after release";
    if (hasCurrentSnapshot(s, id)) return "Released";
    if (s.assessment.graded.includes(id) && complete(s, id)) return "Graded";
    const p = person(s, id);
    return p && submissionFor(s, id)?.status === "received"
      ? "Ungraded"
      : "Missing";
  };
  const releaseCandidates = (s) => {
    const received = new Set(receivedPeople(s).map((p) => p.id));
    if (s.assessment.releaseScope === "selected") {
      const id = s.assessment.student;
      return s.assessment.graded.includes(id) &&
        complete(s, id) &&
        validMarks(s, id) &&
        received.has(id) &&
        (!hasCurrentSnapshot(s, id) || hasReleaseDraft(s, id))
        ? [id]
        : [];
    }
    return s.assessment.graded.filter(
      (id) =>
        complete(s, id) &&
        validMarks(s, id) &&
        received.has(id) &&
        (!hasCurrentSnapshot(s, id) || hasReleaseDraft(s, id)),
    );
  };
  const heldFromScope = (s) => {
    if (s.assessment.releaseScope === "selected") {
      const id = s.assessment.student;
      return receivedPeople(s).some((p) => p.id === id) &&
        (!s.assessment.graded.includes(id) || !complete(s, id))
        ? [id]
        : [];
    }
    return remaining(s).map((p) => p.id);
  };
  const impactRecords = (s) => {
    const idx = questionIndex(s, "3");
    const max = questionMax(s, "3");
    const delta =
      Number(s.teaching.pendingRubricDelta) - Number(s.teaching.rubricDelta);
    return unique(s.teaching.rubricUses)
      .filter(
        (id) =>
          person(s, id) &&
          person(s, id).active &&
          s.assessment.marks[id] &&
          !s.teaching.rubricOverrides.includes(id),
      )
      .map((id) => ({
        id,
        before: Number(s.assessment.marks[id][idx]),
        after: Math.max(
          0,
          Math.min(max, Number(s.assessment.marks[id][idx]) + delta),
        ),
      }))
      .filter((x) => x.before !== x.after);
  };
  const releasePayload = (s, id) => ({
    marks: marksFor(s, id).slice(),
    comment: commentFor(s, id),
    questionComments: clone(s.assessment.questionComments[id] || {}),
    reviewedQuestions: reviewed(s, id).slice(),
    attempt: submissionFor(s, id)?.attempt,
    submissionId: submissionFor(s, id)?.id,
    rubricVersion: s.teaching.rubricVersion,
    excused: false,
  });
  const releasePlan = (s) => ({
    scope: s.assessment.releaseScope,
    selected:
      s.assessment.releaseScope === "selected" ? s.assessment.student : null,
    assignmentId: s.assignment.id || s.assignment.title,
    held: heldFromScope(s),
    records: releaseCandidates(s).map((id) => ({
      id,
      payload: releasePayload(s, id),
    })),
  });
  const moduleProgress = {
    completed: WB.defaults.people.slice(0, 32).map((p) => p.id),
    started: WB.defaults.people.slice(32, 39).map((p) => p.id),
  };

  WB.defineState("teaching", {
    coursePublished: true,
    courseAiPolicy: "Assignment policy",
    newAssignmentTitle: "",
    assignmentSequence: 1,
    attachmentPreview: false,
    copyPlan: null,
    destinationCourse: null,
    studentPreview: false,
    modules: [
      {
        id: "m1",
        title: "Foundations and vectors",
        published: true,
        prerequisite: "None",
        release: "Open now",
      },
      {
        id: "m2",
        title: "Motion in one dimension",
        published: true,
        prerequisite: "Complete module 1",
        release: "Open now",
      },
      {
        id: "m3",
        title: "Projectile motion",
        published: true,
        prerequisite: "Complete module 2",
        release: "12 Oct, 8:00 am",
        releaseAt: "2026-10-12T08:00",
      },
      {
        id: "m4",
        title: "Forces and free-body diagrams",
        published: false,
        prerequisite: "Complete module 3",
        release: "19 Oct, 8:00 am",
        releaseAt: "2026-10-19T08:00",
      },
    ],
    assignmentSection: "All PHYS 110 sections",
    assignmentGroups: "Individual work",
    assignmentSaved: true,
    assignmentSaveRevision: 0,
    quizTitle: "Motion check: projectile reasoning",
    quizAttempts: "2",
    quizMinutes: "25",
    quizFeedback: "After the due date",
    bankSelected: [],
    quizItems: [
      {
        id: "qb-1",
        type: "Multiple choice",
        prompt:
          "At the highest point of a projectile’s flight, what is its vertical acceleration?",
        points: 2,
        options: ["Zero", "9.8 m/s² downward", "9.8 m/s² upward"],
        answer: "9.8 m/s² downward",
      },
    ],
    rubricDelta: -1,
    rubricVersion: 1,
    pendingRubricDelta: -2,
    rubricUses: ["aisha", "ben", "carmen"],
    rubricOverrides: ["carmen"],
    rubricPreviewOpen: false,
    conflictContext: null,
    releasePreview: false,
    releasePreparedIds: [],
    releasePreparedHeld: [],
    releasePreparedScope: "",
    releasePlan: null,
    excused: ["student-3"],
    assignmentCategoryAverage: 86,
    aiDraftStatus: "idle",
    aiDraftFor: "",
    allowances: [],
    copyShiftDays: 364,
    copyInclude: ["modules", "assignments", "quizzes"],
    copyPreview: false,
    copyApplied: false,
    copyExceptionResolved: false,
    attendance: [
      {
        id: "aisha",
        date: "Wed 14 Oct",
        status: "Absent",
        source: "Instructor check-in",
      },
      {
        id: "ben",
        date: "Wed 14 Oct",
        status: "Present",
        source: "Instructor check-in",
      },
      {
        id: "carmen",
        date: "Wed 14 Oct",
        status: "Present",
        source: "Instructor check-in",
      },
    ],
    moduleProgress,
  });

  WB.actions["teach-course-publish"] = (s) => {
    s.teaching.coursePublished = !s.teaching.coursePublished;
    WB.audit(
      s,
      `${s.teaching.coursePublished ? "Published" : "Unpublished"} PHYS 110 course`,
    );
    return {
      message: s.teaching.coursePublished
        ? "Course published to enrolled students."
        : "Course returned to draft.",
    };
  };
  WB.actions["teach-course-preview"] = (s) => {
    s.teaching.studentPreview = true;
    return {
      go: "S02",
      message:
        "Student course preview opened with the current publication and module rules.",
    };
  };
  WB.actions["teach-module-move"] = (s, p) => {
    const i = s.teaching.modules.findIndex((m) => m.id === p.id),
      step = p.direction === "up" ? -1 : 1,
      j = i + step;
    if (i < 0 || j < 0 || j >= s.teaching.modules.length)
      return { message: "That module is already at the edge." };
    const next = s.teaching.modules.slice();
    [next[i], next[j]] = [next[j], next[i]];
    s.teaching.modules = next;
    return { message: "Module order updated." };
  };
  WB.actions["teach-module-toggle"] = (s, p) => {
    const m = s.teaching.modules.find((x) => x.id === p.id);
    if (m) m.published = !m.published;
    return {
      message: m && m.published ? "Module published." : "Module set to draft.",
    };
  };
  WB.actions["teach-bank-toggle"] = (s, p) => {
    s.teaching.bankSelected = s.teaching.bankSelected.includes(p.id)
      ? s.teaching.bankSelected.filter((id) => id !== p.id)
      : s.teaching.bankSelected.concat(p.id);
    return {};
  };
  WB.actions["teach-bank-add"] = (s) => {
    const bank = [
      {
        id: "qb-2",
        type: "Numeric response",
        prompt:
          "A ball launched vertically at 9.8 m/s lands at its launch height. Using g = 9.8 m/s², find its flight time in seconds.",
        points: 3,
        answer: "2",
      },
      {
        id: "qb-3",
        type: "Written response",
        prompt:
          "Explain why horizontal velocity is constant when air resistance is neglected.",
        points: 4,
        answer:
          "There is no horizontal resultant force, so horizontal acceleration is zero.",
      },
      {
        id: "qb-4",
        type: "Multiple choice",
        prompt:
          "Which force acts on a projectile after launch, neglecting air resistance?",
        points: 2,
        options: [
          "Gravity downward only",
          "Gravity and a forward force",
          "No forces",
        ],
        answer: "Gravity downward only",
      },
    ];
    const existing = new Set(s.teaching.quizItems.map((q) => q.id));
    const additions = bank.filter(
      (q) => s.teaching.bankSelected.includes(q.id) && !existing.has(q.id),
    );
    s.teaching.quizItems = s.teaching.quizItems.concat(additions);
    s.teaching.bankSelected = [];
    return {
      message: additions.length
        ? `${additions.length} question${additions.length === 1 ? "" : "s"} added.`
        : "Select a new question first.",
    };
  };
  WB.actions["teach-quiz-publish"] = (s) => {
    if (
      !Number.isFinite(Number(s.teaching.quizMinutes)) ||
      Number(s.teaching.quizMinutes) <= 0 ||
      Number(s.teaching.quizMinutes) > 3650 ||
      !["1", "2", "3", "Unlimited"].includes(String(s.teaching.quizAttempts))
    )
      return {
        message: "Choose a supported attempt count and positive time limit.",
      };
    s.course.quizPublished = !s.course.quizPublished;
    return {
      message: s.course.quizPublished
        ? "Quiz published."
        : "Quiz returned to draft.",
    };
  };
  WB.actions["teach-quiz-release"] = (s) => {
    if (!s.course.quizSubmitted || !s.course.quizAttemptCount)
      return {
        message:
          "A submitted quiz attempt is required before releasing its reference feedback.",
      };
    if (s.teaching.quizFeedback !== "Instructor release")
      return {
        message:
          "This quiz already follows its selected automatic feedback rule.",
      };
    s.course.quizResultReleased = true;
    WB.audit(
      s,
      `Released quiz reference feedback for Aisha, attempt ${s.course.quizAttemptCount}`,
    );
    return {
      message:
        "Reference feedback is available for this submitted quiz attempt.",
    };
  };
  WB.actions["teach-role"] = (s, p) => {
    s.assessment.role = p.role === "ta" ? "ta" : "instructor";
    return {
      message:
        s.assessment.role === "ta"
          ? "TA permissions shown."
          : "Instructor permissions shown.",
    };
  };
  WB.actions["teach-question"] = (s, p) => {
    if (s.assessment.conflict)
      return {
        message: "Resolve the concurrent edit before changing questions.",
      };
    if (s.assignment.questions.some((q) => q.id === p.id)) {
      s.assessment.question = p.id;
      s.assessment.aiDraft = false;
      s.teaching.aiDraftFor = "";
    }
    return {};
  };
  WB.actions["teach-student"] = (s, p) => {
    if (s.assessment.conflict)
      return {
        message: "Resolve the concurrent edit before changing students.",
      };
    if (person(s, p.id)) {
      s.assessment.student = p.id;
      s.assessment.aiDraft = false;
      s.teaching.aiDraftFor = "";
      s.teaching.aiDraftStatus = "idle";
    }
    return {};
  };
  WB.actions["teach-score"] = (s, p) => {
    if (!gradeable(s))
      return {
        message:
          "This TA no longer has grading access, or the selected work is missing, excused, withdrawn, or locked.",
      };
    if (s.assessment.conflict)
      return {
        message: "Resolve the concurrent edit before changing the score.",
      };
    const id = s.assessment.student,
      qid = s.assessment.question,
      idx = questionIndex(s, qid),
      max = questionMax(s, qid);
    if (
      p.score === undefined ||
      p.score === null ||
      !String(p.score).trim() ||
      !Number.isFinite(Number(p.score)) ||
      Number(p.score) < 0 ||
      Number(p.score) > max
    )
      return { message: "Enter a finite score within the question maximum." };
    if (!s.assessment.marks[id]) s.assessment.marks[id] = fallbackMarks();
    s.assessment.marks[id][idx] = Number(p.score);
    invalidate(s);
    return { message: `Question ${qid} score updated.` };
  };
  WB.actions["teach-save-next"] = (s) => {
    if (!gradeable(s))
      return {
        message:
          "This TA no longer has grading access, or this work is not eligible for review.",
      };
    if (s.assessment.conflict)
      return {
        message:
          "Resolve the concurrent edit before saving or moving to another student.",
      };
    const id = s.assessment.student,
      qid = s.assessment.question;
    if (!pageForQuestion(s, qid) || !validMarks(s, id))
      return {
        message:
          "A received, tagged page and valid scores are required before reviewing this answer.",
      };
    s.assessment.reviewedQuestions[id] = unique(reviewed(s, id).concat(qid));
    invalidate(s);
    const next = s.assignment.questions.find(
      (q) => !reviewed(s, id).includes(q.id),
    );
    if (next) s.assessment.question = next.id;
    s.assessment.aiDraft = false;
    s.teaching.aiDraftFor = "";
    return {
      message: next
        ? `Answer saved. Review question ${next.id} next.`
        : "All answers reviewed. Complete the submission review when ready.",
    };
  };
  WB.actions["teach-complete-review"] = (s) => {
    if (!gradeable(s))
      return {
        message:
          "Active grading access and an eligible received submission are required.",
      };
    if (s.assessment.conflict)
      return {
        message: "Resolve the concurrent edit before completing review.",
      };
    const id = s.assessment.student;
    if (!complete(s, id) || !validMarks(s, id))
      return {
        message: "Review every question before completing this submission.",
      };
    s.assessment.graded = unique(s.assessment.graded.concat(id));
    invalidate(s);
    const next = remaining(s)[0];
    s.assessment.aiDraft = false;
    s.teaching.aiDraftFor = "";
    return {
      message: next
        ? `Submission review completed for ${person(s, id).name}. Release this learner’s feedback or choose ${next.name} from the queue.`
        : "Submission review completed. The grading queue is complete.",
    };
  };
  WB.actions["teach-conflict-start"] = (s) => {
    if (!gradeable(s))
      return {
        message:
          "This TA no longer has grading access, or the selected work is missing, excused, withdrawn, or locked.",
      };
    s.assessment.conflict = true;
    s.teaching.conflictContext = {
      student: s.assessment.student,
      question: s.assessment.question,
    };
    return { message: "A concurrent TA edit is ready to review." };
  };
  WB.actions["teach-conflict-resolve"] = (s, p) => {
    if (!gradeable(s))
      return {
        message:
          "This TA no longer has grading access, or the selected work is missing, excused, withdrawn, or locked.",
      };
    if (!s.assessment.conflict)
      return { message: "There is no open conflict." };
    if (!["mine", "theirs"].includes(p.choice))
      return { message: "Choose whose score to keep." };
    if (p.choice === "theirs") {
      const context = s.teaching.conflictContext || {
          student: s.assessment.student,
          question: s.assessment.question,
        },
        id = context.student,
        idx = questionIndex(s, context.question);
      if (!s.assessment.marks[id]) s.assessment.marks[id] = fallbackMarks();
      s.assessment.marks[id][idx] = Math.max(
        0,
        s.assessment.marks[id][idx] - 1,
      );
    }
    s.assessment.conflict = false;
    s.teaching.conflictContext = null;
    invalidate(s);
    return {
      message:
        p.choice === "theirs"
          ? "Kept Maya's recorded score."
          : "Kept your score and resolved the conflict.",
    };
  };
  WB.actions["teach-rubric-preview"] = (s) => {
    if (!isInstructor(s))
      return { message: "Only the instructor can change rubric rules." };
    s.teaching.rubricPreviewOpen = true;
    return { go: "S18", message: "Rubric impact preview prepared." };
  };
  WB.actions["teach-rubric-delta"] = (s, p) => {
    if (!isInstructor(s))
      return { message: "Only the instructor can change rubric rules." };
    if (![-1, -2].includes(Number(p.delta)))
      return { message: "Choose a supported rubric deduction." };
    s.teaching.pendingRubricDelta = Number(p.delta);
    s.teaching.rubricPreviewOpen = true;
    return {};
  };
  WB.actions["teach-rubric-cancel"] = (s) => {
    if (!isInstructor(s))
      return { message: "Only the instructor can change rubric rules." };
    s.teaching.pendingRubricDelta = s.teaching.rubricDelta;
    s.teaching.rubricPreviewOpen = false;
    return { go: "S17", message: "Rubric change canceled." };
  };
  WB.actions["teach-rubric-apply"] = (s) => {
    if (!isInstructor(s))
      return { message: "Only the instructor can change rubric rules." };
    if (
      Number(s.teaching.pendingRubricDelta) === Number(s.teaching.rubricDelta)
    ) {
      s.teaching.rubricPreviewOpen = false;
      return { go: "S17", message: "The rubric rule is unchanged." };
    }
    if (!editable(s) || s.assessment.conflict)
      return {
        message: "Resolve the conflict or reopen the locked assignment first.",
      };
    if (![-1, -2].includes(Number(s.teaching.pendingRubricDelta)))
      return { message: "Choose a supported rubric deduction." };
    const impacts = impactRecords(s),
      idx = questionIndex(s, "3");
    invalidate(s);
    impacts.forEach((x) => {
      s.assessment.marks[x.id][idx] = x.after;
    });
    s.teaching.rubricDelta = Number(s.teaching.pendingRubricDelta);
    s.teaching.rubricVersion += 1;
    s.assessment.rubricAdjusted = true;
    s.teaching.rubricPreviewOpen = false;
    WB.audit(
      s,
      `Updated Q3 rubric; ${impacts.length} score${impacts.length === 1 ? "" : "s"} recalculated`,
    );
    return {
      go: "S17",
      message: `Rubric updated. ${impacts.length} score${impacts.length === 1 ? "" : "s"} changed; overrides were preserved.`,
    };
  };
  WB.actions["teach-ai-start"] = (s) => {
    if (!gradeable(s))
      return {
        message:
          "This TA no longer has grading access, or the selected work is missing, excused, withdrawn, or locked.",
      };
    if (s.assessment.conflict)
      return {
        message: "Resolve the concurrent edit before drafting feedback.",
      };
    if (!s.institution.aiEnabled)
      return { message: "Draft help is disabled by institution policy." };
    const page = pageForQuestion(s, s.assessment.question);
    if (!page)
      return {
        message: "Select a received answer page before opening draft help.",
      };
    s.assessment.aiDraft = `For question ${s.assessment.question}, show the intermediate steps and explain the sign convention used in this answer.`;
    s.teaching.aiDraftContext = {
      student: s.assessment.student,
      question: s.assessment.question,
      attempt: submissionFor(s, s.assessment.student).attempt,
      pageId: page.id,
    };
    s.teaching.aiDraftStatus = "draft";
    s.teaching.aiDraftFor = s.assessment.student;
    return {
      message: "Authored sample draft opened. No model or service was called.",
    };
  };
  WB.actions["teach-ai-accept"] = (s) => {
    if (!gradeable(s))
      return {
        message:
          "This TA no longer has grading access, or the selected work is missing, excused, withdrawn, or locked.",
      };
    if (
      !s.institution.aiEnabled ||
      !s.assessment.aiDraft ||
      s.teaching.aiDraftFor !== s.assessment.student
    )
      return {
        message: "There is no enabled draft for this student to accept.",
      };
    if (s.assessment.conflict)
      return {
        message: "Resolve the concurrent edit before accepting feedback.",
      };
    const ctx = s.teaching.aiDraftContext;
    if (
      !ctx ||
      ctx.question !== s.assessment.question ||
      ctx.attempt !== submissionFor(s, s.assessment.student).attempt ||
      ctx.pageId !== pageForQuestion(s, s.assessment.question)?.id
    )
      return {
        message:
          "The work context changed. Open a fresh draft for this answer.",
      };
    s.assessment.questionComments[s.assessment.student] =
      s.assessment.questionComments[s.assessment.student] || {};
    s.assessment.questionComments[s.assessment.student][s.assessment.question] =
      String(s.assessment.aiDraft);
    invalidate(s);
    s.assessment.aiDraft = false;
    s.teaching.aiDraftStatus = "accepted";
    s.teaching.aiDraftFor = "";
    return { message: "Draft copied into feedback for instructor review." };
  };
  WB.actions["teach-ai-discard"] = (s) => {
    if (!gradeable(s))
      return {
        message:
          "This TA no longer has grading access, or the selected work is missing, excused, withdrawn, or locked.",
      };
    s.assessment.aiDraft = false;
    s.teaching.aiDraftFor = "";
    s.teaching.aiDraftStatus = "discarded";
    return { message: "Draft discarded." };
  };
  WB.actions["teach-sort-grades"] = (s) => {
    s.assessment.sortAsc = !s.assessment.sortAsc;
    return {};
  };
  WB.actions["teach-release-scope"] = (s, p) => {
    s.assessment.releaseScope =
      p.scope === "all-reviewed" ? "all-reviewed" : "selected";
    s.teaching.releasePreview = false;
    s.teaching.releasePreparedIds = [];
    s.teaching.releasePreparedHeld = [];
    s.teaching.releasePreparedScope = "";
    return {};
  };
  WB.actions["teach-release-preview"] = (s) => {
    if (!isInstructor(s)) return { message: "TAs cannot release grades." };
    if (!editable(s) || s.assessment.conflict)
      return {
        message:
          "Resolve the conflict or reopen the locked assignment before previewing.",
      };
    const plan = releasePlan(s);
    s.teaching.releasePlan = clone(plan);
    s.teaching.releasePreparedIds = plan.records.map((r) => r.id);
    s.teaching.releasePreparedHeld = plan.held.slice();
    s.teaching.releasePreparedScope = plan.scope;
    s.teaching.releasePreview = true;
    return {
      message:
        "Exact score, answer feedback, attempt and rubric snapshots are ready to review.",
    };
  };
  WB.actions["teach-release"] = (s) => {
    if (!isInstructor(s)) return { message: "TAs cannot release grades." };
    if (!editable(s) || s.assessment.conflict)
      return {
        message:
          "Resolve the conflict or reopen the locked assignment before releasing.",
      };
    if (!s.teaching.releasePreview || !s.teaching.releasePlan)
      return { message: "Preview this release scope before releasing." };
    const plan = releasePlan(s);
    if (JSON.stringify(plan) !== JSON.stringify(s.teaching.releasePlan)) {
      invalidate(s);
      return {
        message:
          "The prepared release changed. Refresh the preview and review the exact feedback before releasing.",
      };
    }
    const ids = plan.records.map((r) => r.id);
    plan.records.forEach((r) => {
      s.assessment.releaseSnapshots[r.id] = clone(r.payload);
    });
    s.assessment.released = unique(s.assessment.released.concat(ids));
    invalidate(s);
    s.teaching.releasePlan = null;
    s.teaching.releasePreparedIds = [];
    s.teaching.releasePreparedHeld = [];
    s.teaching.releasePreparedScope = "";
    if (ids.length)
      WB.audit(
        s,
        `Released ${ids.length} ${s.assignment.title} grade${ids.length === 1 ? "" : "s"}`,
      );
    return {
      message: ids.length
        ? `${ids.length} prepared grade${ids.length === 1 ? "" : "s"} released. Ungraded and excused work stayed excluded.`
        : "No reviewed work was eligible for release.",
    };
  };
  WB.actions["teach-ta-toggle"] = (s) => {
    if (!isInstructor(s))
      return { message: "Only the instructor can change TA access." };
    s.institution.taActive = !s.institution.taActive;
    WB.audit(
      s,
      `${s.institution.taActive ? "Restored" : "Revoked"} TA course access for Maya Chen`,
    );
    return {
      message: s.institution.taActive
        ? "TA access restored."
        : "TA access revoked for this course.",
    };
  };
  WB.actions["teach-withdraw"] = (s, p) => {
    if (!isInstructor(s))
      return { message: "Only the instructor can change course enrollment." };
    const target = person(s, p.id);
    if (target) {
      target.active = false;
      WB.audit(s, `Marked ${target.name} withdrawn from PHYS 110`);
    }
    return {
      message: target
        ? `${target.name} is no longer counted in the active roster.`
        : "Student not found.",
    };
  };
  WB.actions["teach-allowance"] = (s, p) => {
    if (!isInstructor(s))
      return { message: "Only the instructor can record an allowance." };
    const target = person(s, p.id);
    if (!target || !target.active)
      return { message: "Choose an active learner." };
    s.teaching.allowances = s.teaching.allowances.filter((a) => a.id !== p.id);
    s.teaching.allowances.push({
      id: p.id,
      assignmentId: s.assignment.id,
      extraHours: 24,
      extraMinutes: 6,
    });
    WB.audit(
      s,
      `Recorded a 24-hour assignment allowance and 6-minute quiz allowance for ${target.name}`,
    );
    return {
      message:
        "Learner dates and quiz time updated without private diagnostic information.",
    };
  };
  WB.actions["teach-allowance-remove"] = (s, p) => {
    if (!isInstructor(s))
      return { message: "Only the instructor can remove an allowance." };
    s.teaching.allowances = s.teaching.allowances.filter((a) => a.id !== p.id);
    return { message: "Allowance removed; base dates and quiz time apply." };
  };
  const copySource = (s) => ({
    id: "phys110-next",
    title: "PHYS 110 · Destination preview",
    modules: s.teaching.copyInclude.includes("modules")
      ? s.teaching.modules.map((m) => ({
          ...clone(m),
          ...(m.releaseAt
            ? {
                releaseAt: copyDate(m.releaseAt, s.teaching.copyShiftDays),
                release: prettyDate(
                  copyDate(m.releaseAt, s.teaching.copyShiftDays),
                ),
              }
            : {}),
        }))
      : [],
    assignments: s.teaching.copyInclude.includes("assignments")
      ? [
          {
            ...clone(s.assignment),
            id: "copied-assignment",
            published: false,
            due: copyDate(s.assignment.due, s.teaching.copyShiftDays),
            close: copyDate(s.assignment.close, s.teaching.copyShiftDays),
          },
        ]
      : [],
    quizzes: s.teaching.copyInclude.includes("quizzes")
      ? [
          {
            title: s.teaching.quizTitle,
            published: false,
            items: clone(s.teaching.quizItems),
            attempts: s.teaching.quizAttempts,
            minutes: s.teaching.quizMinutes,
            feedback: s.teaching.quizFeedback,
          },
        ]
      : [],
    toolReview: s.teaching.copyInclude.includes("modules")
      ? {
          title: "Lab simulator · review placeholder",
          published: false,
          status: "Connection review required",
        }
      : null,
  });
  const copySignature = (s) =>
    JSON.stringify({
      days: Number(s.teaching.copyShiftDays),
      include: s.teaching.copyInclude,
      destination: copySource(s),
    });
  WB.actions["teach-copy-toggle"] = (s, p) => {
    if (!["modules", "assignments", "quizzes"].includes(p.id))
      return { message: "Choose a supported content group." };
    s.teaching.copyInclude = s.teaching.copyInclude.includes(p.id)
      ? s.teaching.copyInclude.filter((id) => id !== p.id)
      : s.teaching.copyInclude.concat(p.id);
    s.teaching.copyPreview = false;
    s.teaching.copyApplied = false;
    return {};
  };
  WB.actions["teach-copy-preview"] = (s) => {
    if (
      !copyDate(s.assignment.due, s.teaching.copyShiftDays) ||
      !copyDate(s.assignment.close, s.teaching.copyShiftDays)
    )
      return {
        message:
          "Enter a whole date shift between −3650 and 3650 days and valid source dates.",
      };
    if (!s.teaching.copyInclude.length)
      return { message: "Select at least one content group." };
    s.teaching.copyPlan = copySignature(s);
    s.teaching.copyPreview = true;
    s.teaching.copyApplied = false;
    return {
      message: "Destination content and shifted dates prepared for review.",
    };
  };
  WB.actions["teach-copy-resolve"] = (s) => {
    s.teaching.copyExceptionResolved = true;
    s.teaching.copyApplied = false;
    return {
      message: "External tool mapped to an unpublished review placeholder.",
    };
  };
  WB.actions["teach-copy-apply"] = (s) => {
    if (!s.teaching.copyPreview || s.teaching.copyPlan !== copySignature(s)) {
      s.teaching.copyPreview = false;
      return {
        message:
          "Preview the current content and date shift before applying it.",
      };
    }
    if (
      s.teaching.copyInclude.includes("modules") &&
      !s.teaching.copyExceptionResolved
    )
      return {
        message:
          "Resolve the external-tool exception before applying the copy.",
      };
    s.teaching.destinationCourse = copySource(s);
    s.teaching.copyApplied = true;
    WB.audit(
      s,
      "Created a separate PHYS 110 destination course from the reviewed copy plan",
    );
    return {
      message: "Destination course created. Inspect its records below.",
    };
  };
  const assignmentErrors = (s) => {
    if (!s.assignment.title.trim() || s.assignment.title.length > 160)
      return "Enter an assignment title of 1–160 characters.";
    if (
      !s.assignment.due ||
      !s.assignment.close ||
      !Number.isFinite(Date.parse(s.assignment.due + "Z")) ||
      !Number.isFinite(Date.parse(s.assignment.close + "Z"))
    )
      return "Enter valid due and close dates.";
    if (s.assignment.close < s.assignment.due)
      return "The close date must be at or after the due date.";
    return "";
  };
  WB.actions["teach-assignment-save"] = (s) => {
    const error = assignmentErrors(s);
    if (error) return { message: error };
    s.teaching.assignmentSaved = true;
    s.teaching.assignmentSaveRevision++;
    return { message: "Assignment changes saved in this example." };
  };
  WB.actions["teach-assignment-publish"] = (s) => {
    const error = assignmentErrors(s);
    if (error) return { message: error };
    s.assignment.published = !s.assignment.published;
    s.teaching.assignmentSaved = true;
    WB.audit(
      s,
      `${s.assignment.published ? "Published" : "Unpublished"} ${s.assignment.title}`,
    );
    return {
      message: s.assignment.published
        ? "Assignment published."
        : "Assignment returned to draft.",
    };
  };
  WB.actions["teach-assignment-create"] = (s) => {
    const title = String(s.teaching.newAssignmentTitle || "").trim();
    if (!title || title.length > 160)
      return { message: "Enter a new assignment title of 1–160 characters." };
    s.teaching.previousAssignment = {
      assignment: clone(s.assignment),
      assessment: clone(s.assessment),
      submission: clone(s.submission),
      submissions: clone(s.submissions),
    };
    const id = "assignment-" + ++s.teaching.assignmentSequence;
    s.assignment = {
      id,
      title,
      due: "2026-10-23T23:59",
      close: "2026-10-25T23:59",
      published: false,
      policy: s.assignment.policy,
      questions: clone(s.assignment.questions),
      attachments: [],
    };
    s.assessment.marks = {};
    s.assessment.comments = {};
    s.assessment.questionComments = {};
    s.assessment.reviewedQuestions = {};
    s.assessment.graded = [];
    s.assessment.released = [];
    s.assessment.releaseSnapshots = {};
    s.assessment.student = "aisha";
    s.assessment.question = "1a";
    s.assessment.conflict = false;
    s.assessment.aiDraft = false;
    s.submission = {
      id: id + "-aisha",
      owner: "aisha",
      status: "draft",
      attempt: 1,
      pages: [],
      method: "scan",
      interrupted: false,
      error: "",
      receipt: "",
    };
    s.submissions = Object.fromEntries(
      s.people
        .filter((p) => p.id !== "aisha")
        .map((p) => [
          p.id,
          {
            id: id + "-" + p.id,
            owner: p.id,
            status: "missing",
            attempt: 1,
            pages: [],
            receipt: "",
          },
        ]),
    );
    s.people.forEach((p) => {
      p.submitted = false;
      p.reviewed = false;
    });
    s.teaching.rubricUses = [];
    s.teaching.rubricOverrides = [];
    s.teaching.excused = [];
    s.teaching.allowances = [];
    s.teaching.releasePlan = null;
    s.teaching.releasePreparedIds = [];
    s.teaching.releasePreparedHeld = [];
    s.teaching.releasePreparedScope = "";
    invalidate(s);
    s.teaching.assignmentSaved = false;
    s.teaching.assignmentSaveRevision = 0;
    s.teaching.attachmentPreview = false;
    s.teaching.newAssignmentTitle = "";
    return {
      go: "S15",
      message:
        "New empty assignment created. Add sample instructions, edit dates and publish when ready.",
    };
  };
  WB.actions["teach-attachment-toggle"] = (s) => {
    const attachments = s.assignment.attachments || [];
    s.assignment.attachments = attachments.length
      ? []
      : [
          {
            id: "sample-instructions",
            name: "Motion investigation — instructions.txt",
            description:
              "Readable sample instructions; plain text with labeled questions.",
            accessible: true,
            pages: 1,
            text: "Motion investigation\n1a. Identify known quantities.\n1b. Define the coordinate system.\n2. Write the motion equations.\n3. Explain the sign of acceleration.\n4. Check units and interpret the result.",
          },
        ];
    return {
      message: s.assignment.attachments.length
        ? "Sample instructions attached."
        : "Sample attachment removed.",
    };
  };
  WB.actions["teach-attachment-preview"] = (s) => {
    s.teaching.attachmentPreview = !s.teaching.attachmentPreview;
    return {};
  };
  WB.actions["teach-course-empty"] = (s) => {
    s.teaching.previousModules = clone(s.teaching.modules);
    s.teaching.modules = [];
    s.teaching.coursePublished = false;
    s.course.completedModules = [];
    s.course.activeModule = "";
    s.course.read = false;
    return {
      message:
        "Empty course example opened. Add a module, then publish the course.",
    };
  };
  WB.actions["teach-module-add"] = (s) => {
    s.teaching.modules.push({
      id: "m" + (s.teaching.modules.length + 1),
      title: "Motion investigation",
      published: false,
      prerequisite: "None",
      release: "Open now",
    });
    return { message: "Draft module added. Publish it when ready." };
  };
  WB.actions["teach-attendance-correct"] = (s, p) => {
    const row = s.teaching.attendance.find(
      (x) => x.id === p.id && x.date === p.date,
    );
    if (row) {
      row.status = "Present";
      row.source = "Corrected by Dr. Diane Reyes";
      WB.audit(
        s,
        `Corrected attendance for ${person(s, p.id).name} on ${p.date}`,
      );
    }
    return {
      message: row
        ? "Attendance corrected with an audit entry."
        : "Attendance record not found.",
    };
  };

  WB.reg("S09", "Feedback and grade explanation", "Student", (s, h) => {
    const id = "aisha";
    if (s.teaching.excused.includes(id))
      return (
        h.head("Assignment excused", s.assignment.title) +
        h.notice(
          "No numeric grade",
          "This assignment is excluded from your category denominator. No submission or score is required.",
          "info",
        )
      );
    const received = s.submission.status === "received",
      snapshot = snapshotFor(s, id),
      released =
        received &&
        hasCurrentSnapshot(s, id) &&
        snapshot.attempt === s.submission.attempt;
    const releasedMarks = released ? snapshot.marks : [],
      score = releasedMarks.reduce((sum, value) => sum + Number(value), 0),
      pct = released ? Math.round((score / 30) * 100) : 0,
      category = Number(s.teaching.assignmentCategoryAverage),
      contribution = (category * 0.4).toFixed(1),
      newDraft = released && hasReleaseDraft(s, id);
    const questionRows = s.assignment.questions.map((q, i) => [
      h.e(`Question ${q.id}`),
      released ? `${h.e(releasedMarks[i])} / ${h.e(q.max)}` : "—",
      released
        ? h.e(
            (snapshot.questionComments || {})[q.id] ||
              "No answer-specific comment",
          )
        : "",
    ]);
    return (
      h.head(
        "Feedback and grade explanation",
        s.assignment.title,
        h.go("Back to assignment", "S05", "quiet"),
      ) +
      (released
        ? h.notice(
            "Feedback released",
            `Attempt ${s.submission.attempt} · receipt ${s.submission.receipt}. Your instructor released this result. `,
            "success",
          )
        : received
          ? h.notice(
              "Feedback is not released yet",
              "Your submission is safely received. Scores and comments remain hidden until the instructor releases them.",
              "info",
            )
          : h.notice(
              "Submission is not received",
              "Finish or retry the submission before feedback can be released.",
              "warning",
            )) +
      (newDraft
        ? h.notice(
            "New draft held for review",
            "Your instructor has newer draft changes. The released score and comment below stay unchanged until an explicit re-release.",
            "info",
          )
        : "") +
      `<div class="columns"><div class="stack">${h.card(
        "Submission record",
        h.row(
          `${s.submission.pages.length} pages ${received ? "received" : "prepared"}`,
          received ? `Receipt ${s.submission.receipt}` : "No receipt yet",
          h.pill(s.submission.status, received ? "success" : "warning"),
        ) +
          (released
            ? h.stats([
                [`${score} / 30`, "Released score"],
                [`${pct}%`, "Percent"],
              ])
            : ""),
      )}${released ? h.card("Question scores", h.table("Question scores", ["Question", "Score", "Note"], questionRows)) : ""}</div><div class="stack">${released ? h.card("Instructor feedback", `<p>${h.e(snapshot.comment)}</p><p class="small muted">Released from rubric version ${h.e(snapshot.rubricVersion)} for attempt ${h.e(snapshot.attempt)}.</p>`) : h.card("What happens next", received ? "<p>Dr. Diane Reyes is reviewing submitted work. You will see the question scores, rubric notes, and comment here after release.</p>" : "<p>Return to the assignment submission steps. A receipt confirms when the attempt is received.</p>")}${h.card("How the course total is calculated", released ? `<p>This assignment is ${pct}% (${score} of 30). Your current assignment-category average is ${category}%. Assignments carry 40% of the course total, so that category currently contributes ${contribution} of 40 course points.</p><details><summary>Other category weights</summary><p class="small">Labs 25% · Quizzes 35%. Excused work is removed from the applicable category denominator.</p></details>` : "<p>The gradebook combines assignments at 40%, labs at 25%, and quizzes at 35%. Your category calculations will appear with the released score.</p>")}</div></div>`
    );
  });

  WB.reg("S14", "Course builder", "Instructor", (s, h) => {
    const visibleModules = s.teaching.modules;
    const modules = visibleModules
      .map((m, i) =>
        h.row(
          `${i + 1}. ${m.title}`,
          `${m.prerequisite} · ${m.release}`,
          `${h.pill(m.published ? "Published" : "Draft", m.published ? "success" : "neutral")} ${i ? h.btn("Move up", "teach-module-move", { id: m.id, direction: "up" }, "quiet") : '<button type="button" class="button quiet" disabled>First module</button>'} ${h.btn(m.published ? "Unpublish" : "Publish", "teach-module-toggle", { id: m.id }, "quiet")}`,
        ),
      )
      .join("");
    const preview = s.teaching.studentPreview
      ? h.notice(
          "Authoring view",
          "Student preview opens the learner course workspace with current publication and access rules.",
          "info",
        )
      : "";
    return (
      teacherTabs(h, "S14") +
      h.head(
        "Build PHYS 110",
        "Syllabus, modules, prerequisites, release rules and publication",
        `${h.btn("Open student preview", "teach-course-preview", {}, "secondary")} ${h.btn(s.teaching.coursePublished ? "Unpublish course" : "Publish course", "teach-course-publish", {}, s.teaching.coursePublished ? "secondary" : "primary")}`,
      ) +
      preview +
      `<div class="columns"><div class="stack">${h.card("Course publication", h.row("PHYS 110 · Introductory Mechanics", "Dr. Diane Reyes · Fall 2026", h.pill(s.teaching.coursePublished ? "Published" : "Draft", s.teaching.coursePublished ? "success" : "warning")))}${h.card("Modules", (modules || '<p class="empty">No modules yet. Add your first learning module.</p>') + `<div class="actions">${h.btn("Add sample module", "teach-module-add", {}, "secondary")}${h.btn("Start empty course example", "teach-course-empty", {}, "quiet")}</div>`)}</div><div class="stack">${h.card("Syllabus", `<p><strong>Mechanics through observation, modeling, and clear written reasoning.</strong></p><p class="muted">${h.e(WB.meeting(s).days)} · ${h.e(WB.meeting(s).time)}–${h.e(WB.meeting(s).endTime)} · ${h.e(WB.meeting(s).room)}</p>${h.go("Edit current assignment", "S15", "primary")}`)}${h.card("Release logic", '<p>Modules open in order after the prior module is complete. Scheduled dates use America/New_York.</p><details><summary>Less-used settings</summary><p class="small">Allow completion overrides · require syllabus acknowledgment · retain instructor-only notes during preview.</p></details>')}</div></div>`
    );
  });

  WB.reg("S15", "Assignment editor", "Instructor", (s, h) => {
    const total = s.assignment.questions.reduce(
      (sum, q) => sum + Number(q.max),
      0,
    );
    return (
      teacherTabs(h, "S15") +
      h.head(
        "Edit assignment",
        s.assignment.title,
        `${h.btn("Save changes", "teach-assignment-save", {}, "secondary")} ${h.btn(s.assignment.published ? "Unpublish" : "Publish", "teach-assignment-publish", {}, s.assignment.published ? "secondary" : "primary")}`,
      ) +
      h.notice(
        s.assignment.published ? "Published to students" : "Draft assignment",
        s.assignment.published
          ? "Changes affect the same assignment students submit and instructors grade."
          : "Students cannot open this assignment until it is published.",
        s.assignment.published ? "success" : "warning",
      ) +
      `<div class="columns"><div class="stack">${h.card("Details", `<div class="form-grid">${h.field("Title", "assignment.title", s.assignment.title)}${h.select("Assigned to", "teaching.assignmentSection", s.teaching.assignmentSection, ["All PHYS 110 sections", "Section 01", "Section 02"])}${h.field("Due", "assignment.due", s.assignment.due, "datetime-local")}${h.field("Closes", "assignment.close", s.assignment.close, "datetime-local")}${h.select("Work mode", "teaching.assignmentGroups", s.teaching.assignmentGroups, ["Individual work", "Assigned groups"])}</div>${s.teaching.assignmentSaveRevision ? `<p class="small muted">Example revision ${s.teaching.assignmentSaveRevision} saved.</p>` : ""}`)}${h.card("Questions and points", s.assignment.questions.map((q) => h.row(`Question ${q.id}`, "Written work upload", `${q.max} points`)).join("") + h.row("Total", "Derived from question maxima", `${total} points`))}</div><div class="stack">${h.card("Sample attachments", `${(s.assignment.attachments || []).map((a) => h.row(a.name, a.description, h.pill("Attached", "success"))).join("") || "<p>No sample attachment selected.</p>"}<div class="actions">${h.btn((s.assignment.attachments || []).length ? "Remove sample attachment" : "Attach sample instructions", "teach-attachment-toggle")}${(s.assignment.attachments || []).length ? h.btn("Preview readable attachment", "teach-attachment-preview") : ""}</div>${s.teaching.attachmentPreview ? (s.assignment.attachments || []).map((a) => `<pre class="attachment-text">${h.e(a.text)}</pre>`).join("") : ""}<p class="small muted">Authored sample text only. No local file is uploaded.</p>`)}${h.card("Accommodations summary", "<p>Approved timing and due-date adjustments are summarized for permitted course staff; private documentation is not shown.</p>")}${h.card("Assessment AI-use policy", `${h.area("Assignment AI-use policy", "assignment.policy", s.assignment.policy)}${h.select("Course restriction", "teaching.courseAiPolicy", s.teaching.courseAiPolicy, ["Assignment policy", "Prohibited"])}<p><strong>Effective assignment policy:</strong> ${h.e(policy(s))}</p><p class="small muted">A course prohibition takes precedence. Institution draft-help permission is a separate setting.</p>`)}${h.card("Create another assignment", `${h.field("New assignment title", "teaching.newAssignmentTitle", s.teaching.newAssignmentTitle)}${h.btn("Create empty assignment", "teach-assignment-create", {}, "secondary")}<p class="small">Starts a distinct empty assignment. The current assignment and review records remain in a local previous-assignment snapshot.</p>`)}</div></div>`
    );
  });

  WB.reg("S16", "Quiz builder", "Instructor", (s, h) => {
    const bank = [
      {
        id: "qb-2",
        type: "Numeric response",
        prompt:
          "A ball launched vertically at 9.8 m/s lands at its launch height. Using g = 9.8 m/s², find its flight time in seconds.",
        points: 3,
        answer: "2",
      },
      {
        id: "qb-3",
        type: "Written response",
        prompt:
          "Explain why horizontal velocity is constant when air resistance is neglected.",
        points: 4,
        answer:
          "There is no horizontal resultant force, so horizontal acceleration is zero.",
      },
      {
        id: "qb-4",
        type: "Multiple choice",
        prompt:
          "Which force acts on a projectile after launch, neglecting air resistance?",
        points: 2,
        options: [
          "Gravity downward only",
          "Gravity and a forward force",
          "No forces",
        ],
        answer: "Gravity downward only",
      },
    ];
    const bankRows = bank
      .map((q) =>
        h.row(
          q.prompt,
          `${q.type} · ${q.points} points`,
          toggleButton(
            h,
            s.teaching.bankSelected.includes(q.id) ? "Selected" : "Select",
            "teach-bank-toggle",
            { id: q.id },
            s.teaching.bankSelected.includes(q.id),
          ),
        ),
      )
      .join("");
    return (
      teacherTabs(h, "S16") +
      h.head(
        "Quiz builder",
        s.teaching.quizTitle,
        `${h.btn("Add selected", "teach-bank-add", {}, "secondary")} ${h.btn(s.course.quizPublished ? "Unpublish quiz" : "Publish quiz", "teach-quiz-publish", {}, s.course.quizPublished ? "secondary" : "primary")}`,
      ) +
      `<div class="columns"><div class="stack">${h.card("Quiz questions", s.teaching.quizItems.map((q, i) => h.row(`${i + 1}. ${q.prompt}`, q.type, `${q.points} points`)).join(""))}${h.card("Question bank", bankRows)}</div><div class="stack">${h.card("Attempt settings", `<div class="form-grid">${h.select("Attempts", "teaching.quizAttempts", s.teaching.quizAttempts, ["1", "2", "3", "Unlimited"])}${h.field("Time limit (minutes)", "teaching.quizMinutes", s.teaching.quizMinutes, "number")}${h.select("Release feedback", "teaching.quizFeedback", s.teaching.quizFeedback, ["After each attempt", "After the due date", "Instructor release"])}</div>`)}${s.teaching.quizFeedback === "Instructor release" ? h.card("Release reference feedback", `<p>Applies to Aisha’s submitted attempt ${h.e(s.course.quizAttemptCount || "—")}. Written responses still need instructor review.</p>${s.course.quizResultReleased ? h.pill("Reference feedback released", "success") : h.btn("Release submitted attempt feedback", "teach-quiz-release", {}, "primary")}`) : ""}${h.card("Accommodations", "<p>Approved extra time is applied per student when an attempt starts. The general limit stays visible here; private documentation is not included.</p>")}${h.card("Quiz AI-use policy", `<p>Prohibited during this assessment. Show your own reasoning.</p>`)}</div></div>`
    );
  });

  WB.reg("S17", "Grading workspace", "Instructor / TA", (s, h) => {
    const selected = person(s, s.assessment.student) || s.people[0],
      qid = s.assessment.question,
      idx = questionIndex(s, qid),
      max = questionMax(s, qid),
      mark = marksFor(s, selected.id)[idx],
      left = remaining(s).length,
      page = pageForQuestion(s, qid),
      allowed = gradeable(s),
      submission = submissionFor(s, selected.id);
    const qButtons = s.assignment.questions
      .map((q) =>
        toggleButton(h, q.id, "teach-question", { id: q.id }, q.id === qid),
      )
      .join("");
    const queue =
      remaining(s)
        .slice(0, 4)
        .map((p) =>
          h.btn(
            p.name,
            "teach-student",
            { id: p.id },
            p.id === selected.id ? "primary" : "quiet",
          ),
        )
        .join("") || '<p class="empty">All received work has been graded.</p>';
    const conflict = s.assessment.conflict
      ? h.notice(
          "Concurrent edit to resolve",
          "Maya Chen (TA) saved a different score for this answer. Saving and navigation stay blocked until this is resolved.",
          "warning",
        ) +
        (allowed
          ? `<div class="actions">${h.btn("Keep Maya's score", "teach-conflict-resolve", { choice: "theirs" }, "secondary")}${h.btn("Keep my score", "teach-conflict-resolve", { choice: "mine" }, "primary")}</div>`
          : '<p class="small">An instructor must resolve this conflict because TA access is revoked.</p>')
      : "";
    const ai = !allowed
      ? h.notice(
          "Draft help unavailable",
          "Active grading access is required to create or accept feedback drafts.",
          "error",
        )
      : !s.institution.aiEnabled
        ? h.notice(
            "Draft help is off",
            "Institution policy has not enabled optional draft feedback. Grading and comments remain available.",
            "neutral",
          )
        : s.assessment.aiDraft && s.teaching.aiDraftFor === selected.id
          ? `${h.area("Authored sample draft", "assessment.aiDraft", s.assessment.aiDraft)}<div class="actions">${h.btn("Accept into comment", "teach-ai-accept", {}, "primary")}${h.btn("Discard", "teach-ai-discard", {}, "quiet")}</div><p class="small muted">This is prewritten sample text; no model or external service was called.</p>`
          : `${h.btn("Open authored sample draft", "teach-ai-start", {}, "secondary")}<p class="small muted">A draft can be edited, accepted, or discarded. It cannot change scores or release work.</p>`;
    const work = page
      ? `<p class="small">${h.e(selected.name)} · Attempt ${h.e(submission.attempt)} · Receipt ${h.e(submission.receipt)} · Page ${h.e(page.id)}</p>${h.paper(qid, page.rotation, selected.id, page.workVariant)}`
      : `${h.notice(`No page tagged for question ${qid}`, "The score and comment are preserved. Tag a page before evaluating the written work.", "warning")}${selected.id === "aisha" ? h.go("Organize submission pages", "S07", "secondary") : "<p>Ask this learner to supply the missing answer page.</p>"}`;
    const scoreControls = allowed
      ? `${h.row("Full credit", "Complete and correct", h.btn(`${max} points`, "teach-score", { score: max }, mark === max ? "primary" : "quiet"))}${h.row("Minor reasoning error", "Method is sound; one fix needed", h.btn(`${Math.max(0, max - 1)} points`, "teach-score", { score: Math.max(0, max - 1) }, mark === max - 1 ? "primary" : "quiet"))}${h.row("Sign or setup error", "Core method present", h.btn(`${Math.max(0, max - 2)} points`, "teach-score", { score: Math.max(0, max - 2) }, mark === max - 2 ? "primary" : "quiet"))}`
      : h.notice(
          "Read-only grading view",
          "TA access has been revoked. Scores cannot be changed.",
          "error",
        );
    const commentEditor = allowed
      ? `${h.area("Feedback for this answer", `assessment.questionComments.${selected.id}.${qid}`, questionComment(s, selected.id, qid))}<div class="actions">${s.assessment.conflict ? '<button type="button" class="button primary" disabled>Resolve conflict before saving</button>' : h.btn("Save answer review", "teach-save-next", {}, "primary")}${h.btn("Complete submission review", "teach-complete-review", {}, "secondary")}${s.assessment.conflict ? '<button type="button" class="button quiet" disabled>Concurrent edit open</button>' : h.btn("Simulate concurrent edit", "teach-conflict-start", {}, "quiet")}</div>`
      : `<p>${h.e(questionComment(s, selected.id, qid))}</p><button type="button" class="button secondary" disabled>Comment editing unavailable</button>`;
    return (
      h.head(
        "Grade by question",
        `${s.assignment.title} · ${left} remaining`,
        `${toggleButton(h, "Instructor", "teach-role", { role: "instructor" }, s.assessment.role === "instructor")} ${toggleButton(h, "TA", "teach-role", { role: "ta" }, s.assessment.role === "ta")} ${h.go("Release", "S20", "secondary")}`,
      ) +
      roleNotice(s, h) +
      conflict +
      (hasReleaseDraft(s, selected.id)
        ? h.notice(
            "New draft after release",
            "These score, comment, or rubric changes remain held until the instructor explicitly re-releases this student.",
            "info",
          )
        : "") +
      `<div class="actions" aria-label="Questions">${qButtons}</div><div class="columns wide-left"><div class="stack">${h.card(`${selected.name} · Question ${qid}`, work)}${h.card(
        "Queue",
        queue +
          `<details><summary>Choose another learner</summary><div class="actions">${s.people
            .filter((p) => p.active)
            .map((p) => h.btn(p.name, "teach-student", { id: p.id }, "quiet"))
            .join("")}</div></details>`,
      )}</div><div class="stack">${h.card(`Score · ${mark} / ${max}`, `${scoreControls}<div class="actions">${isInstructor(s) ? h.btn("Preview rubric rule change", "teach-rubric-preview", {}, "secondary") : '<button type="button" class="button secondary" disabled>Rubric editing is instructor-only</button>'}</div>`)}${h.card(`Question ${qid} feedback · ${reviewed(s, selected.id).length}/${s.assignment.questions.length} answers reviewed`, commentEditor)}${h.card("Whole-submission feedback", allowed ? h.area("Overall submission comment", `assessment.comments.${selected.id}`, commentFor(s, selected.id)) : `<p>${h.e(commentFor(s, selected.id))}</p>`)}${h.card("Optional draft help", `<p class="small">Context: ${h.e(selected.name)} · Question ${h.e(qid)} · Attempt ${h.e(submission?.attempt || "—")} · ${page ? "Page " + h.e(page.id) : "No answer page"}</p><p class="small">Academic policy: ${h.e(policy(s))}</p>` + ai)}</div></div>`
    );
  });

  WB.reg("S18", "Rubric-change preview", "Instructor", (s, h) => {
    const impacts = impactRecords(s),
      uses = unique(s.teaching.rubricUses).filter(
        (id) => person(s, id) && person(s, id).active,
      ),
      overrides = uses.filter((id) => s.teaching.rubricOverrides.includes(id));
    const rows = uses.map((id) => {
      const p = person(s, id),
        impact = impacts.find((x) => x.id === id),
        override = s.teaching.rubricOverrides.includes(id);
      return [
        h.e(p ? p.name : id),
        override
          ? h.pill("Manual override preserved", "info")
          : h.pill("Recalculate", "warning"),
        impact
          ? `${impact.before} → ${impact.after}`
          : `${marksFor(s, id)[questionIndex(s, "3")]} unchanged`,
      ];
    });
    return (
      h.head(
        "Preview rubric change",
        "Question 3 · Sign convention error",
        h.go("Back to grader", "S17", "quiet"),
      ) +
      roleNotice(s, h) +
      `<div class="columns"><div class="stack">${h.card("Rule change", `${h.row("Current rule", "Sign convention error", `${s.teaching.rubricDelta} point`)}${h.row("Proposed rule", "Sign convention error", `${s.teaching.pendingRubricDelta} points`)}<div class="actions">${h.btn("Set to −1", "teach-rubric-delta", { delta: -1 }, s.teaching.pendingRubricDelta === -1 ? "primary" : "quiet")}${h.btn("Set to −2", "teach-rubric-delta", { delta: -2 }, s.teaching.pendingRubricDelta === -2 ? "primary" : "quiet")}</div>`)}${h.notice(`${impacts.length} answer${impacts.length === 1 ? " changes" : "s change"}`, `${overrides.length} manual override${overrides.length === 1 ? " is" : "s are"} preserved. The count is derived from answers using this rubric item.`, impacts.length ? "warning" : "info")}</div><div class="stack">${h.card("Affected answers", h.table("Rubric impact preview", ["Student", "Treatment", "Q3 score"], rows))}${h.card("Decision", isInstructor(s) ? `<div class="actions">${h.btn("Cancel", "teach-rubric-cancel", {}, "quiet")}${h.btn("Apply rubric change", "teach-rubric-apply", {}, "primary")}</div>` : "<p>Ask Dr. Diane Reyes to review and apply this rubric change.</p>")}</div></div>`
    );
  });

  WB.reg("S19", "Gradebook", "Instructor", (s, h) => {
    const ids = ["aisha", "ben", "carmen", "student-3", "student-40"].filter(
      (id) => person(s, id),
    );
    ids.sort((a, b) => {
      const av = person(s, a).name,
        bv = person(s, b).name;
      return s.assessment.sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    const rows = ids.map((id) => {
      const status = gradeStatus(s, id),
        score =
          status === "Excused" || status === "Missing" || status === "Ungraded"
            ? "—"
            : `${WB.score(s, id)} / 30`,
        tone =
          status === "Released"
            ? "success"
            : status === "Ungraded" || status === "New draft after release"
              ? "warning"
              : "neutral";
      return [
        h.e(person(s, id).name),
        h.pill(status, tone),
        score,
        status === "Excused"
          ? "Removed from denominator"
          : status === "Missing"
            ? "Counts as missing after close"
            : status === "New draft after release"
              ? "Held until explicit re-release"
              : "Included when released",
      ];
    });
    const activeIds = new Set(
      s.people.filter((p) => p.active).map((p) => p.id),
    );
    const reviewed = s.assessment.graded.filter(
        (id) => activeIds.has(id) && !s.teaching.excused.includes(id),
      ).length,
      released = s.assessment.released.filter(
        (id) => activeIds.has(id) && hasCurrentSnapshot(s, id),
      ).length;
    return (
      h.head(
        "Gradebook",
        s.assignment.title,
        `${h.btn(s.assessment.sortAsc ? "Sort Z–A" : "Sort A–Z", "teach-sort-grades", {}, "quiet")} ${h.go("Release records", "S20", "primary")}`,
      ) +
      h.stats([
        [`${WB.received(s)}`, "Received"],
        [`${reviewed}`, "Reviewed"],
        [`${released}`, "Released"],
      ]) +
      `<div class="stack">${h.card("Student results", h.table(s.assignment.title + " gradebook", [`<span>Student</span>`, "Status", "Score", "Calculation"], rows))}${h.card("Category calculation", `<p><strong>Assignments 40% · Labs 25% · Quizzes 35%</strong></p><p>A student’s assignment category average is multiplied by 0.40. Missing work enters the denominator after the close date; ungraded work does not. Excused work is removed from that category denominator.</p>`)}</div>`
    );
  });

  WB.reg("S20", "Release and records", "Instructor", (s, h) => {
    const candidates = releaseCandidates(s),
      held = heldFromScope(s),
      prepared = s.teaching.releasePreparedIds;
    const activeIds = new Set(
        s.people.filter((p) => p.active).map((p) => p.id),
      ),
      releasedCount = s.assessment.released.filter(
        (id) => activeIds.has(id) && hasCurrentSnapshot(s, id),
      ).length,
      draftCount = s.assessment.released.filter(
        (id) => activeIds.has(id) && hasReleaseDraft(s, id),
      ).length;
    const scopeButtons = `<div class="segmented" role="group" aria-label="Release scope">${toggleButton(h, "Selected student", "teach-release-scope", { scope: "selected" }, s.assessment.releaseScope === "selected")}${toggleButton(h, "All reviewed", "teach-release-scope", { scope: "all-reviewed" }, s.assessment.releaseScope === "all-reviewed")}</div>`;
    const selected = person(s, s.assessment.student);
    const preparedDetails = (s.teaching.releasePlan?.records || [])
      .map(
        (r) =>
          `<details><summary>${h.e(person(s, r.id)?.name || r.id)} · ${r.payload.marks.reduce((a, b) => a + b, 0)} / 30 · Attempt ${r.payload.attempt}</summary><p>${h.e(r.payload.comment)}</p>${h.table(
            "Prepared answer feedback",
            ["Question", "Score", "Feedback"],
            s.assignment.questions.map((q, i) => [
              h.e(q.id),
              `${r.payload.marks[i]} / ${q.max}`,
              h.e(
                r.payload.questionComments[q.id] ||
                  "No answer-specific comment",
              ),
            ]),
          )}<p class="small">Rubric version ${r.payload.rubricVersion} · ${h.e(r.payload.submissionId || "")}</p></details>`,
      )
      .join("");
    const preview = s.teaching.releasePreview
      ? h.card(
          "Prepared release",
          `${h.stats([
            [prepared.length, "Eligible grades"],
            [s.teaching.releasePreparedHeld.length, "Held ungraded"],
          ])}<p>${prepared.length ? prepared.map((id) => h.e(person(s, id).name)).join(", ") : "No graded work is eligible in this scope."}</p>${s.teaching.releasePreparedHeld.length ? `<p class="small muted">Held: ${s.teaching.releasePreparedHeld.map((id) => h.e(person(s, id).name)).join(", ")}</p>` : ""}${preparedDetails}`,
        )
      : "";
    return (
      h.head(
        "Release grades",
        s.assignment.title,
        h.go("View gradebook", "S19", "quiet"),
      ) +
      roleNotice(s, h) +
      `<div class="columns"><div class="stack">${h.card("1. Choose exact scope", `${scopeButtons}<p>${s.assessment.releaseScope === "selected" ? `Selected: ${h.e(selected ? selected.name : "No student")}${selected && hasReleaseDraft(s, selected.id) ? ` · ${h.pill("New draft after release", "warning")}` : ""}` : `${candidates.length} reviewed grade${candidates.length === 1 ? " is" : "s are"} eligible for first release or re-release.`}</p>`)}${h.notice(`${s.teaching.excused.filter((id) => person(s, id)?.active).length} excused records excluded`, "Excused work receives no numeric release and is removed from its category denominator.", "info")}${h.card("2. Check held work", held.length ? h.notice(`${held.length} ungraded submission${held.length === 1 ? "" : "s"} will stay held`, "Ungraded work is never converted to zero or released by this action.", "warning") : h.notice("No ungraded work in this scope", "Only reviewed records can enter the release.", "success"))}</div><div class="stack">${preview}${h.card("3. Preview and release", isInstructor(s) ? `<div class="actions">${h.btn("Refresh preview", "teach-release-preview", {}, "secondary")}${h.btn("Release prepared grades", "teach-release", {}, "primary")}</div><p class="small muted">Only the exact previewed scores, answer comments, submission attempt and rubric version can be released. Any changed record requires a refreshed preview.</p>` : "<p>TAs can prepare scores and comments, but only the instructor can release them.</p>")}${h.card("Release record", releasedCount ? `<p>${releasedCount} feedback record${releasedCount === 1 ? " is" : "s are"} visible to active students.</p>${draftCount ? `<p>${h.pill(`${draftCount} new draft${draftCount === 1 ? "" : "s"} held`, "warning")}</p>` : ""}${h.go("Open student feedback", "S09", "secondary")}` : "<p>No feedback has been released for this assignment.</p>")}</div></div>`
    );
  });

  WB.reg("S21", "People and course permissions", "Instructor", (s, h) => {
    const willa = person(s, "student-22");
    const instructor = isInstructor(s),
      permissionButton = instructor
        ? h.btn(
            s.institution.taActive ? "Revoke" : "Restore",
            "teach-ta-toggle",
            {},
            s.institution.taActive ? "danger" : "secondary",
          )
        : '<button type="button" class="button secondary" disabled>Instructor approval required</button>';
    const rows = [
      [
        "Dr. Diane Reyes",
        "Instructor",
        h.pill("Full course scope", "success"),
        "—",
      ],
      [
        "Maya Chen",
        "Teaching assistant",
        h.pill(
          s.institution.taActive ? "Active" : "Revoked",
          s.institution.taActive ? "success" : "error",
        ),
        permissionButton,
      ],
      [
        "Aisha Rahman",
        "Student",
        h.pill("Active", "success"),
        instructor
          ? allowanceFor(s, "aisha")
            ? h.btn(
                "Remove allowance",
                "teach-allowance-remove",
                { id: "aisha" },
                "quiet",
              )
            : h.btn(
                "Add allowance",
                "teach-allowance",
                { id: "aisha" },
                "quiet",
              )
          : "Instructor approval required",
      ],
      [
        willa ? willa.name : "Willa Brooks",
        "Student",
        h.pill(
          willa && willa.active ? "Active" : "Withdrawn",
          willa && willa.active ? "success" : "neutral",
        ),
        willa && willa.active
          ? instructor
            ? h.btn(
                "Mark withdrawn",
                "teach-withdraw",
                { id: willa.id },
                "danger",
              )
            : "Instructor approval required"
          : "Removed from counts",
      ],
    ];
    return (
      teacherTabs(h, "S21") +
      h.head(
        "People and permissions",
        "PHYS 110 · role scope and operational allowances",
      ) +
      roleNotice(s, h) +
      `<div class="stack">${h.card("Course people", h.table("Course people", ["Person", "Course role", "Status", "Action"], rows))}<div class="columns">${h.card("TA permission boundary", "<ul><li>May grade assigned submissions and write comments while access is active.</li><li>Cannot edit rubric rules.</li><li>Cannot release grades or change course roles.</li></ul>")} ${h.card("Operational allowance", `<details><summary>Record a due-date allowance</summary><p>Add 24 hours for Aisha on the current assignment and 6 minutes on her quiz attempts. The course workspace records the operational change without storing a diagnosis.</p>${!instructor ? '<p class="small">Instructor approval is required.</p>' : allowanceFor(s, "aisha") ? h.notice("24-hour allowance active", "Applies to this assignment and Aisha’s quiz time; other learners keep the base settings.", "success") : h.btn("Record 24-hour allowance", "teach-allowance", { id: "aisha" }, "primary")}</details>`)}</div></div>`
    );
  });

  WB.reg("S22", "Course copy and rollover", "Instructor", (s, h) => {
    const destinationDue = copyDate(s.assignment.due, s.teaching.copyShiftDays);
    const destination = s.teaching.destinationCourse,
      hasTool = s.teaching.copyInclude.includes("modules");
    const choices = [
      ["modules", "Modules and files"],
      ["assignments", "Assignments and rubrics"],
      ["quizzes", "Quizzes and question links"],
    ];
    const options = choices
      .map(([id, label]) =>
        h.row(
          label,
          s.teaching.copyInclude.includes(id)
            ? "Included in preview"
            : "Excluded",
          h.btn(
            s.teaching.copyInclude.includes(id) ? "Included" : "Include",
            "teach-copy-toggle",
            { id },
            s.teaching.copyInclude.includes(id) ? "primary" : "quiet",
          ),
        ),
      )
      .join("");
    const exception = !hasTool
      ? ""
      : s.teaching.copyExceptionResolved
        ? h.notice(
            "External tool mapped",
            "The lab simulator becomes an unpublished review placeholder in the destination course.",
            "success",
          )
        : h.notice(
            "External tool needs review",
            "The source lab simulator has no verified destination connection. Map it before applying the copy.",
            "warning",
          );
    const records = (
      course,
    ) => `<p>${course.modules.length} modules · ${course.assignments.length} assignments · ${course.quizzes.length} quizzes · 0 student records</p>
    ${course.modules.map((m) => h.row(m.title, m.release, h.pill(m.published ? "Published" : "Draft"))).join("")}
    ${course.assignments.map((a) => h.row(a.title, `Due: ${prettyDate(a.due)} · Closes: ${prettyDate(a.close)}`, h.pill("Draft"))).join("")}
    ${course.quizzes.map((q) => h.row(q.title, `${q.items.length} questions · ${q.minutes} minutes`, h.pill("Draft"))).join("")}`;
    const dates = h.card(
      "Date shift",
      `<div class="form-grid">${h.field("Shift dates by days", "teaching.copyShiftDays", s.teaching.copyShiftDays, "number")}</div>
    <p class="small">Source due date: ${h.e(prettyDate(s.assignment.due))}<br>Preview: ${h.e(prettyDate(destinationDue))}</p>${h.btn("Preview copy", "teach-copy-preview", {}, "primary")}`,
    );
    const preview = s.teaching.copyPreview
      ? h.card(
          "Review before apply",
          `${records(copySource(s))}${exception}<div class="actions">
    ${hasTool && !s.teaching.copyExceptionResolved ? h.btn("Map to review placeholder", "teach-copy-resolve", {}, "secondary") : ""}
    ${s.teaching.copyApplied ? '<button type="button" class="button primary" disabled>Copy applied</button>' : h.btn("Apply reviewed copy", "teach-copy-apply", {}, "primary")}</div>`,
        )
      : h.card(
          "Preview required",
          "<p>Choose content and preview every shifted date and exception before applying the copy.</p>",
        );
    const inspection = destination
      ? h.card(
          "Inspect destination course",
          `<p>${h.e(destination.title)}</p>${records(destination)}
    ${destination.toolReview ? h.notice(destination.toolReview.title, destination.toolReview.status, "warning") : ""}`,
        )
      : "";
    return (
      teacherTabs(h, "S22") +
      h.head(
        "Copy a course",
        "Current PHYS 110 → separate destination course",
      ) +
      `<div class="columns"><div class="stack">${h.card("Content selection", options)}${dates}</div><div class="stack">${preview}${inspection}</div></div>`
    );
  });

  WB.reg("S23", "Course insights and attendance", "Instructor", (s, h) => {
    const active = s.people.filter((p) => p.active),
      received = WB.received(s),
      missing = active.filter(
        (p) =>
          !s.teaching.excused.includes(p.id) &&
          submissionFor(s, p.id)?.status !== "received",
      );
    const activeIds = new Set(active.map((p) => p.id));
    const completed = s.teaching.moduleProgress.completed.filter((id) =>
        activeIds.has(id),
      ).length,
      started = s.teaching.moduleProgress.started.filter((id) =>
        activeIds.has(id),
      ).length,
      notStarted = Math.max(0, active.length - completed - started);
    const rows = s.teaching.attendance.map((a) => [
      h.e(person(s, a.id).name),
      h.e(a.date),
      h.pill(a.status, a.status === "Present" ? "success" : "warning"),
      h.e(a.source),
      a.status === "Absent"
        ? h.btn(
            "Correct to present",
            "teach-attendance-correct",
            { id: a.id, date: a.date },
            "secondary",
          )
        : "—",
    ]);
    const reviewed = s.assessment.graded.filter(
      (id) =>
        activeIds.has(id) &&
        !s.teaching.excused.includes(id) &&
        complete(s, id),
    ).length;
    return (
      teacherTabs(h, "S23") +
      h.head(
        "Course insights",
        "Concrete work and attendance signals; no predictive risk score",
      ) +
      h.stats([
        [`${received} / ${active.length}`, s.assignment.title + " received"],
        [`${reviewed}`, "Reviews complete"],
        [`${missing.length}`, "Missing submissions"],
      ]) +
      `<div class="columns"><div class="stack">${h.card("Missed-work signal", missing.length ? `${h.notice(`${missing.length} active student${missing.length === 1 ? " has" : "s have"} not submitted`, `${s.assignment.title} closes ${prettyDate(s.assignment.close)}. This is a factual work-status signal, not a prediction.`, "warning")}<details><summary>Show students</summary><p>${missing.map((p) => h.e(p.name)).join(", ")}</p></details>` : h.notice("All active students submitted", "No missed-work follow-up is needed.", "success"))}${h.card("Module completion", `<p><strong>Module 3: Projectile motion</strong></p><p>${completed} of ${active.length} active students completed all required items; ${started} started; ${notStarted} have not started.</p>`)}</div><div class="stack">${h.card("Attendance correction", h.table("Recent attendance", ["Student", "Meeting", "Status", "Source", "Action"], rows))}${h.card("Interpretation", "<p>Completion, submission, and attendance remain separate records. Staff can correct source errors; this workspace does not combine them into a hidden risk score.</p>")}</div></div>`
    );
  });

  const gradingActions = new Set([
    "teach-score",
    "teach-save-next",
    "teach-complete-review",
    "teach-conflict-start",
    "teach-conflict-resolve",
    "teach-ai-start",
    "teach-ai-accept",
    "teach-ai-discard",
  ]);
  const navigationActions = new Set([
    "teach-role",
    "teach-question",
    "teach-student",
    "teach-sort-grades",
    "teach-attachment-preview",
  ]);
  for (const [name, action] of Object.entries(WB.actions)) {
    if (
      !name.startsWith("teach-") ||
      navigationActions.has(name) ||
      gradingActions.has(name)
    )
      continue;
    WB.actions[name] = (s, p) => {
      if (!isInstructor(s))
        return {
          message: name.startsWith("teach-release")
            ? "TAs cannot release grades."
            : "Only the instructor can change this course record.",
        };
      if (s.assignment.locked && !["teach-course-preview"].includes(name))
        return {
          message:
            "This assignment is locked. Reopen its draft before editing.",
        };
      return action(s, p);
    };
  }
})();
