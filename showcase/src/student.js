(function () {
  "use strict";
  const W = window.WB,
    h = W.h,
    e = W.e;
  const dates = (s) => W.effectiveDates(s);
  const status = (s) =>
    !s.assignment.published
      ? "Not published"
      : s.submission.status === "received"
        ? "Received"
        : s.submission.status === "interrupted"
          ? "Retry needed"
          : "Draft · not submitted";
  const available = (s) =>
    s.assignment.published && s.teaching?.coursePublished !== false;
  const tagged = (s) =>
    new Set(
      s.submission.pages
        .flatMap((p) =>
          String(p.tag)
            .split(",")
            .map((x) => x.trim()),
        )
        .filter(Boolean),
    );
  const missing = (s) =>
    s.assignment.questions.filter((q) => !tagged(s).has(q.id)).map((q) => q.id);
  const tabs = () =>
    `<nav class="segmented" aria-label="Student views">${h.go("Today", "S01", "quiet")}${h.go("Courses", "S02", "quiet")}${h.go("Calendar", "S12", "quiet")}${h.go("Updates", "S13", "quiet")}</nav>`;
  const unavailable = (what) =>
    h.head(
      what + " not published",
      "Your instructor is preparing this coursework.",
    ) + h.go("Return to course", "S03");
  const heading = (s) =>
    h.head(
      "Good morning, Aisha.",
      "Thursday, 15 October · your sample campus day",
      h.go("Your calendar", "S12"),
    ) + tabs();
  const eventRow = (s) =>
    s.campus?.eventPublished
      ? h.row(
          s.campus.event.title,
          s.campus.event.date + " · " + s.campus.event.time,
          h.go("Explore event", "S28", "quiet"),
        )
      : h.row(
          "Campus events",
          "No published event in this example",
          h.go("Explore campus life", "S29", "quiet"),
        );
  W.reg(
    "S01",
    "Today",
    "Student",
    (s) =>
      heading(s) +
      (s.course.dayState === "empty"
        ? h.notice(
            "Nothing needs your attention",
            "This quiet-day scenario has no upcoming tasks or meetings. Your courses and support services remain available.",
            "success",
          ) + h.go("Browse courses", "S02")
        : `<div class="columns"><div class="stack"><section class="student-focus"><span class="course-tag">PHYS 110</span><h4>${e(s.assignment.title)}</h4><p>Due ${e(W.deadline(dates(s).due))}</p><div class="actions">${h.pill(status(s), s.submission.status === "received" ? "success" : "warning")}${h.go("Open assignment", "S05", "primary")}</div></section>${h.card("Next class", h.row("MATH 220 · Linear Algebra", "10:30–11:45 am · Keene Center 212", h.pill("Thursday", "info")) + h.row("PHYS 110", W.meeting(s).time + "–" + W.meeting(s).endTime + " · " + W.meeting(s).room, h.go("View schedule", "S12")))}</div><div class="stack">${h.card("Campus, connected", eventRow(s) + h.row("Learning Support Center", "Physics study sessions and individual help", h.go("Find support", "S34")))}${h.card("Course updates", h.row(s.course.quizSubmitted ? "Quiz attempt submitted" : s.course.quizPublished ? "Quiz 3 is available" : "Quiz 3 is being prepared", "PHYS 110 · " + (s.course.quizSubmitted ? "Review the result status" : "Check the course assessment policy"), h.go("Open quiz", "S10")) + (s.assessment.released.includes("aisha") ? h.row("Your feedback is released", s.assignment.title, h.go("Read feedback", "S09")) : ""))}</div></div>`) +
      (s.course.dayState === "delayed"
        ? h.notice(
            "Schedule source delayed",
            "The meeting above is the last known local source snapshot. Last successful refresh: 15 Oct, 8:05 am. Check the source before planning a change.",
            "warning",
          )
        : "") +
      `<details class="scenario-tools"><summary>Explore another day</summary><div class="actions">${h.btn("Quiet day", "student-day-state", { value: "empty" })}${h.btn("Source delayed", "student-day-state", { value: "delayed" })}${h.btn("Usual day", "student-day-state", { value: "normal" })}</div></details>`,
  );
  W.reg(
    "S02",
    "Courses",
    "Student",
    (s) =>
      h.head(
        "Your courses",
        "Fall 2026 · the same structure across subjects",
        s.teaching?.studentPreview
          ? h.go("Return to course builder", "S14")
          : "",
      ) +
      tabs() +
      h.tabs(
        [
          ["current", "Current term"],
          ["past", "Past term"],
        ],
        "course.courseTerm",
        s.course.courseTerm || "current",
      ) +
      (s.course.courseTerm === "past"
        ? h.card(
            "Spring 2026 archive",
            h.row(
              "MATH 120 · Calculus II",
              "Read-only course archive · no open work",
              h.pill("Completed", "success"),
            ),
          )
        : h.card(
            "PHYS 110 · Introductory Mechanics",
            h.row(
              "Dr. Diane Reyes",
              W.meeting(s).days +
                " · " +
                W.meeting(s).time +
                " · " +
                W.meeting(s).room,
              h.go("Open course", "S03", "primary"),
            ) +
              h.row(
                s.assignment.title,
                "Due " + W.deadline(dates(s).due),
                h.pill(status(s)),
              ),
          ) +
          h.card(
            "MATH 220 · Linear Algebra",
            h.row(
              "Prof. Lena Foster",
              "Tue / Thu · 10:30 am · Keene Center 212",
              h.btn("Read next task", "student-course-summary", {
                value: "math",
              }),
            ),
          ) +
          h.card(
            "WRIT 140 · Academic Writing",
            h.row(
              "Prof. Jonah Brooks",
              "Mon / Wed · 1:00 pm · Emery Hall 203",
              h.btn("Read next task", "student-course-summary", {
                value: "writing",
              }),
            ),
          )) +
      (s.course.summary
        ? h.notice(
            "Next course task",
            s.course.summary === "math"
              ? "Read the section on basis and dimension before Tuesday."
              : "Revise the opening paragraph of your argument essay.",
          )
        : ""),
  );
  W.reg("S03", "Course home", "Student", (s) =>
    s.teaching?.coursePublished === false
      ? unavailable("Course")
      : h.head(
          "Introductory Mechanics",
          "PHYS 110 · Dr. Diane Reyes · Fall 2026",
          h.go("All courses", "S02"),
        ) +
        `<nav class="segmented" aria-label="Course navigation">${h.go("Modules", "S04", "primary")}${h.go("Assignment", "S05")}${h.go("Quiz", "S10")}${h.go("Discussion", "S11")}${h.go("Feedback", "S09")}</nav><div class="columns"><div class="stack">${h.card("This week", `<p>Describe motion with a clear coordinate system, solve for time and check the physical meaning of your result.</p>${h.go("Continue the module", "S04", "primary")}`)}${h.card("Course information", h.row("Syllabus and assessment policy", "Goals, office hours and grade categories", h.btn("Read syllabus", "student-syllabus")) + h.row("Class meetings", W.meeting(s).days + " · " + W.meeting(s).time + "–" + W.meeting(s).endTime + " · " + W.meeting(s).room))}</div><div class="stack">${h.card("Your next step", h.row(s.assignment.title, "Due " + W.deadline(dates(s).due), h.pill(status(s))) + h.go("Open assignment", "S05", "primary"))}${h.card("From Dr. Reyes", "<p>Keep your axes visible. State your positive direction before substituting values.</p>" + h.go("Read and discuss", "S11"))}</div></div>`,
  );
  function moduleReady(s, m) {
    if (!m.published) return false;
    if (m.releaseAt && W.localNow(s) < m.releaseAt) return false;
    const prior = /module (\d)/i.exec(m.prerequisite || "");
    return (
      !prior ||
      (s.course.completedModules || ["m1", "m2"]).includes("m" + prior[1])
    );
  }
  W.reg("S04", "Modules & materials", "Student", (s) => {
    if (s.teaching?.coursePublished === false) return unavailable("Course");
    const modules = s.teaching?.modules || [
        { id: "m3", title: "Projectile motion", published: true },
      ],
      m =
        modules.find((x) => x.id === (s.course.activeModule || "m3")) ||
        modules[0];
    const ready = m && moduleReady(s, m);
    return (
      h.head(
        "Your course materials",
        "PHYS 110 · published modules and release conditions",
        h.go("Course home", "S03"),
      ) +
      h.tabs(
        [
          ["reading", "Materials"],
          ["syllabus", "Syllabus"],
          ["alternative", "Text alternative"],
        ],
        "course.material",
        s.course.material,
      ) +
      h.card(
        "Course modules",
        modules
          .map((x) =>
            h.row(
              x.title,
              x.prerequisite +
                " · " +
                (x.published ? x.release : "Instructor draft"),
              moduleReady(s, x)
                ? h.btn("Open module", "student-module", { id: x.id })
                : h.pill(
                    x.published ? "Not yet available" : "Unpublished",
                    "warning",
                  ),
            ),
          )
          .join(""),
      ) +
      (s.course.material === "syllabus"
        ? h.card(
            "Course syllabus",
            "<p>Instructor: Dr. Diane Reyes. Office hours: Tuesday, 2–3 pm, Hollis Hall 116.</p><p>Assessment: assignments 40%, labs 25%, quizzes 35%. Missing, ungraded and excused work are separate. Totals use released work only.</p><p>Request accommodations through the designated office. Course staff see the operational adjustment, not private documentation.</p>",
          )
        : !ready
          ? h.notice(
              "Material is not available",
              m?.published
                ? "Complete the prerequisite and wait for the release date."
                : "This module is an instructor draft.",
              "warning",
            )
          : h.card(
              m.title,
              `<div class="reading"><p>${m.id === "m3" ? "Horizontal velocity is constant without air resistance. Vertical acceleration is downward. Connect the two directions through the same time variable." : m.id === "m1" ? "Resolve vectors into components and state the units of every quantity." : "Use position, velocity and acceleration to describe motion along one axis."}</p><p><strong>Horizontal:</strong> x(t) = v₀ cos(θ) × t</p><p><strong>Vertical:</strong> y(t) = h + v₀ sin(θ) × t − ½gt²</p>${s.course.material === "alternative" ? "<p>Diagram description: a projectile leaves a raised platform. Its path curves downward. The x-axis points right, the y-axis points up, and gravity acts downward at all times.</p>" : ""}</div><div class="actions">${h.btn((s.course.completedModules || ["m1", "m2"]).includes(m.id) ? "Mark reading incomplete" : "Mark reading complete", "student-read")}${h.go("Try the quiz", "S10")}</div>`,
            ))
    );
  });
  W.reg("S05", "Assignment", "Student", (s) =>
    !available(s)
      ? unavailable("Assignment")
      : h.head(
          s.assignment.title,
          "PHYS 110 · " +
            s.assignment.questions.reduce((a, q) => a + q.max, 0) +
            " points",
          h.go("Course home", "S03"),
        ) +
        h.stats([
          [W.deadline(dates(s).due), "Your due date"],
          [W.deadline(dates(s).close), "Your close date"],
          [status(s), "Current attempt"],
        ]) +
        (dates(s).due !== s.assignment.due
          ? h.notice(
              "Your approved allowance",
              "General deadline: " +
                W.deadline(s.assignment.due) +
                ". Your operational allowance is applied above.",
              "info",
            )
          : "") +
        `<div class="columns"><div class="stack">${h.card("What to submit", "<p>Show your coordinate system, intermediate steps and units. Review all pages and question tags before sending your work.</p>" + `<div class="actions">${h.go(s.submission.status === "received" ? "Review received work" : "Scan sample pages", "S06", "primary")}${h.btn("Use a sample PDF", "student-pdf")}${h.btn("Start a new sample attempt", "student-new-attempt", {}, "quiet")}</div>`)}${h.notice("AI use for this assignment", W.academicPolicy(s))}${h.card("Assignment files", (s.assignment.attachments || []).map((a) => `<details><summary>${e(a.name)}</summary><p>${a.pages || 2} sample pages · ${a.accessible ? "Accessible text version available" : "Accessibility review required"}</p><p>${e(a.text || a.description || "Solve each listed question and explain the assumptions.")}</p></details>`).join("") || "<p>No attachment; instructions above are complete.</p>")}</div><div class="stack">${h.card("Questions and rubric", s.assignment.questions.map((q) => h.row("Question " + q.id, "Reasoning, method and units", h.pill(q.max + " points"))).join(""))}${h.card("Submission record", h.row("Attempt " + s.submission.attempt, s.submission.pages.length + " pages · " + status(s), s.submission.status === "received" ? h.go("View receipt", "S08") : h.pill("Draft", "warning")))}</div></div>`,
  );
  W.reg(
    "S06",
    "Scan pages",
    "Student · mobile web",
    (s) =>
      h.head(
        "A clear page, then the next.",
        "Sample capture only. No camera or private file access is requested.",
        h.go("Review pages", "S07"),
      ) +
      `<div class="columns"><div>${h.paper(s.submission.pages.at(-1)?.tag || "3")}</div><div class="stack">${h.card(
        "Your pages",
        h.stats([
          [s.submission.pages.length, "Selected pages"],
          [missing(s).length, "Questions to tag"],
        ]) +
          `<div class="actions">${h.btn("Add sample page", "student-capture", {}, "primary")}${h.btn("Load four sample pages", "student-load-pages")}${h.btn("Use sample PDF", "student-pdf")}</div>`,
      )}${h.card("A route for every device", "<p>Keep all four corners visible. Check focus and lighting. A PDF or existing page route stays available without a camera.</p>" + h.btn("Try no-camera state", "student-no-camera") + h.go("Organize and review", "S07", "primary"))}${s.course.noCamera ? h.notice("Camera is unavailable", "Continue with the sample PDF or existing sample pages.", "warning") : ""}</div></div>`,
  );
  W.reg(
    "S07",
    "Review submission",
    "Student",
    (s) =>
      h.head(
        "Your pages, in your order.",
        "Editing received work starts a new draft attempt. Earlier receipt history stays separate.",
        h.go("Add pages", "S06"),
      ) +
      (s.submission.error
        ? h.notice("Check your submission", s.submission.error, "error")
        : "") +
      (s.submission.pages.length
        ? `<div class="page-collection">${s.submission.pages.map((p, i) => `<section class="page-tile"><h4>Page ${i + 1}</h4>${h.paper(p.tag || "?", p.rotation, p.owner || "aisha", p.workVariant)}${h.field("Questions on page " + (i + 1), "submission.pages." + i + ".tag", p.tag)}<div class="actions">${h.btn("Rotate page " + (i + 1), "student-rotate", { id: p.id })}${h.btn("Move page " + (i + 1) + " earlier", "student-move", { id: p.id })}${h.btn("Remove page " + (i + 1), "student-remove", { id: p.id }, "quiet")}</div></section>`).join("")}</div>`
        : h.notice(
            "No pages selected",
            "Add sample pages or use the sample PDF.",
            "warning",
          )) +
      h.stats([
        [s.submission.pages.length, "Pages to send"],
        [
          missing(s).length ? missing(s).join(", ") : "All covered",
          "Questions missing",
        ],
      ]) +
      h.notice(
        "Review this exact attempt",
        "Only the selected sample pages and tags belong to this attempt. This offline preview sends nothing.",
      ) +
      `<div class="actions">${h.btn("Submit sample work", "student-submit", {}, "primary")}${h.btn("Try interrupted submission", "student-interrupt")}${h.btn("Use sample PDF", "student-pdf")}</div>`,
  );
  W.reg(
    "S08",
    "Submission receipt",
    "Student",
    (s) =>
      h.head(
        s.submission.status === "received"
          ? "Your work is received."
          : "Your submission is not received yet.",
        "PHYS 110 · " + s.assignment.title,
      ) +
      (s.submission.status === "received"
        ? `<div class="columns">${h.card("Submission receipt", h.row("Reference", s.submission.receipt, h.pill("Received", "success")) + h.row("Attempt", String(s.submission.attempt)) + h.row("Pages received", String(s.submission.pages.length)) + h.row("Question tags", [...tagged(s)].join(", ")) + h.row("Received in sample", s.submission.receivedAt || "15 Oct 2026 · 10:42 am ET"))}${h.card("What happens next", '<p>The course team reviews the work. Feedback appears only after release.</p><div class="actions">' + h.go("See feedback status", "S09", "primary") + h.go("Review these pages", "S07") + "</div><p>No real file or email was sent.</p>")}</div>`
        : h.notice(
            s.submission.status === "interrupted"
              ? "Connection interrupted"
              : "Review is needed",
            s.submission.error ||
              "No receipt has been issued. Your pages and tags remain here; review or retry.",
            "warning",
          ) +
          h.btn("Retry sample submission", "student-submit", {}, "primary") +
          h.go("Review pages", "S07")) +
      (s.submission.history?.length
        ? h.card(
            "Earlier attempt history",
            s.submission.history
              .map((x) =>
                h.row(
                  "Attempt " + x.attempt,
                  x.receipt + " · " + x.pages.length + " received pages",
                ),
              )
              .join(""),
          )
        : ""),
  );
  function quizItems(s) {
    return (
      s.teaching?.quizItems || [
        {
          id: "qb-1",
          type: "Multiple choice",
          prompt: "At the highest point, what is the vertical acceleration?",
          options: ["0 m/s²", "−9.81 m/s²", "+9.81 m/s²"],
          points: 2,
        },
      ]
    );
  }
  function resultsAvailable(s, record = s.course.quizSubmission) {
    if (!record) return false;
    return (
      s.course.quizReleasedAttempts?.includes(record.attempt) ||
      (record === s.course.quizSubmission && s.course.quizResultReleased) ||
      record.feedback === "After each attempt" ||
      (record.feedback === "After the due date" && W.localNow(s) > record.due)
    );
  }
  function quizHistory(s) {
    return (s.course.quizHistory || []).length
      ? h.card(
          "Earlier quiz attempts",
          s.course.quizHistory
            .map(
              (record) =>
                `<details><summary>Attempt ${e(record.attempt)} · ${e(record.title)}</summary>${record.items.map((q) => h.row(q.prompt, record.answers[q.id] || "No answer")).join("")}<p>${resultsAvailable(s, record) ? "Reference feedback is available under this attempt’s release rule." : "Reference feedback is held under this attempt’s release rule."}</p><p>Submitted ${e(W.deadline(record.submittedAt))} · ${record.items.length} questions · ${e(record.minutes)} + ${e(record.extraMinutes)} minutes</p></details>`,
            )
            .join(""),
        )
      : "";
  }
  W.reg("S10", "Quiz attempt", "Student", (s) => {
    if (
      (!s.course.quizPublished && !s.course.quizSubmitted) ||
      s.teaching?.coursePublished === false
    )
      return unavailable("Quiz");
    const record = s.course.quizSubmitted ? s.course.quizSubmission : null;
    const items = record?.items || quizItems(s),
      count = s.course.quizAttemptCount || 0,
      limit = s.teaching?.quizAttempts || "2",
      done = s.course.quizSubmitted;
    return (
      h.head(
        record?.title ||
          s.teaching?.quizTitle ||
          "Motion check: projectile reasoning",
        "Attempt " +
          (done ? count : count + 1) +
          " · " +
          (record?.minutes || s.teaching?.quizMinutes || 25) +
          " minutes + " +
          (record?.extraMinutes ?? W.quizExtraMinutes(s)) +
          " approved extra minutes",
        h.go("Course home", "S03"),
      ) +
      h.notice(
        "Assessment AI policy",
        "Prohibited during this quiz. This local demonstration has no running exam timer or remote autosave.",
      ) +
      h.stats([
        [items.length, "Authored questions"],
        [record?.attemptLimit || limit, "Allowed attempts at submission"],
        [
          record?.feedback || s.teaching?.quizFeedback || "Instructor release",
          "Result policy",
        ],
        [
          W.deadline(record?.due || s.teaching?.quizDue || "2026-10-16T23:59"),
          "Quiz due date",
        ],
      ]) +
      (done
        ? h.card(
            "Attempt submitted",
            items
              .map((q) =>
                h.row(
                  q.prompt,
                  (record?.answers[q.id] || "No answer") +
                    (resultsAvailable(s) && q.answer
                      ? " · Instructor reference: " + q.answer
                      : ""),
                ),
              )
              .join("") +
              h.notice(
                resultsAvailable(s)
                  ? "Results are available"
                  : "Feedback is held",
                resultsAvailable(s)
                  ? "Your response record is available for review. Written/numeric responses require instructor review; no automatic final grade is implied."
                  : "Release follows the policy shown above.",
                resultsAvailable(s) ? "success" : "info",
              ) +
              (s.course.quizPublished &&
              (limit === "Unlimited" || count < Number(limit))
                ? h.btn("Start another allowed attempt", "student-quiz-reset")
                : "<p>You have used all allowed attempts.</p>"),
          )
        : h.card(
            s.course.quizReview
              ? "Review before submitting"
              : "Your quiz questions",
            items
              .map((q, i) => {
                const path = "course.quizAnswers." + q.id,
                  value = s.course.quizAnswers?.[q.id] || "";
                return `<section class="quiz-question"><h4>${i + 1}. ${e(q.prompt)}</h4><p class="small muted">${e(q.points)} points · ${e(q.type)}</p>${s.course.quizReview ? `<p>${e(value || "No answer yet")}</p>` : q.type === "Multiple choice" ? `<fieldset><legend class="sr-only">${e(q.prompt)}</legend>${(q.options || ["0 m/s²", "−9.81 m/s²", "+9.81 m/s²"]).map((x, j) => `<label class="quiz-option"><input id="S10-${e(q.id)}-${j}" name="quiz-${e(q.id)}" type="radio" data-bind="${e(path)}" value="${e(x)}"${value === x ? " checked" : ""}>${e(x)}</label>`).join("")}</fieldset>` : q.type === "Numeric response" ? h.field("Your numeric response", path, value, "number") : h.area("Your explanation", path, value)}</section>`;
              })
              .join("") +
              `<div class="actions">${h.btn(s.course.quizFlag ? "Remove review flag" : "Flag for review", "student-quiz-flag")}${s.course.quizReview ? h.btn("Return to answers", "student-quiz-edit") + h.btn("Confirm and submit attempt", "student-quiz-submit", {}, "primary") : h.btn("Review answers", "student-quiz-review", {}, "primary")}</div><p class="status-line">Answers stay in this page while you navigate. Reload resets the sample.</p>`,
          )) +
      quizHistory(s)
    );
  });
  W.reg(
    "S11",
    "Course conversation",
    "Student / instructor",
    (s) =>
      h.head(
        "Course conversation",
        "PHYS 110 · a shared place for announcements and discussion",
        h.go("Course home", "S03"),
      ) +
      h.tabs(
        [
          ["discussion", "Discussion"],
          ["announcements", "Announcements"],
        ],
        "course.conversation",
        s.course.conversation || "discussion",
      ) +
      (s.course.conversation === "announcements"
        ? h.card(
            "Keep your axes visible",
            "<p>Dr. Diane Reyes · published 14 Oct, 3:10 pm</p><p>State your positive direction before substituting values. Check that every term has consistent units.</p>" +
              h.go("Open assignment", "S05"),
          )
        : h.card(
            "Why is acceleration nonzero at the top?",
            "<p>Ben Kowalski: If vertical velocity is zero at the highest point, why does gravity still count?</p><p>Dr. Reyes: Velocity describes motion now; acceleration describes how it changes. Gravity acts throughout the flight.</p>" +
              (s.course.replies || [])
                .map((x) => h.row("Aisha Rahman", x))
                .join("") +
              h.area("Your reply", "course.reply", s.course.reply) +
              h.btn("Post reply", "student-reply", {}, "primary"),
          )),
  );
  W.reg("S12", "Calendar", "Student / faculty", (s) => {
    const m = W.meeting(s),
      c = s.campus,
      rows = [
        ["Mon / Wed / Fri", m.time + "–" + m.endTime + " · PHYS 110", m.room],
        ["Tue / Thu", "10:30–11:45 · MATH 220", "Keene Center 212"],
        ["Mon / Wed", "13:00–14:15 · WRIT 140", "Emery Hall 203"],
        [
          W.deadline(dates(s).due),
          s.assignment.title,
          status(s) + " · coursework deadline",
        ],
      ];
    const personal = W.personalCampusEvent ? W.personalCampusEvent(s) : null;
    if (personal)
      rows.push([
        personal.date,
        personal.time + " · " + personal.title,
        personal.room +
          " · " +
          (personal.status === "cancelled"
            ? "This occurrence is cancelled"
            : personal.roomStatus === "confirmed"
              ? "Room confirmed"
              : "Room confirmation pending"),
      ]);
    const filtered = rows.filter(
      (x) => !s.course.hidePhysics || !x[1].includes("PHYS 110"),
    );
    return (
      h.head(
        "Your calendar",
        "Personal schedule · all sample times in America/New_York",
        h.go("Find a room", "S26"),
      ) +
      h.tabs(
        [
          ["list", "Agenda"],
          ["week", "Week overview"],
        ],
        "course.calendarView",
        s.course.calendarView || "list",
      ) +
      `<label class="check-row"><input id="S12-hide-physics" type="checkbox" data-bind="course.hidePhysics"${s.course.hidePhysics ? " checked" : ""}> Hide PHYS 110 meetings</label>` +
      (s.course.calendarView === "week"
        ? h.table(
            "Weekly academic rhythm",
            ["When", "Work / meeting", "Place / state"],
            filtered.map((row) => row.map(e)),
          )
        : `<div class="calendar-list">${filtered.map((row) => `<div class="calendar-entry"><time>${e(row[0])}</time><div><strong>${e(row[1])}</strong><p>${e(row[2])}</p></div></div>`).join("")}</div>`) +
      h.notice(
        "Personal events follow participation",
        "Confirmed RSVPs appear here. Discovery still lists other published campus events; waitlisted events do not reserve a place.",
      ) +
      h.go("Find campus events", "S28")
    );
  });
  W.reg(
    "S13",
    "Updates & preferences",
    "Student",
    (s) =>
      h.head(
        "Updates that lead somewhere",
        "Coursework, feedback and campus changes, with a clear destination.",
      ) +
      h.card(
        "Current updates",
        h.row(
          s.assignment.title,
          status(s) + " · due " + W.deadline(dates(s).due),
          h.go("Open work", "S05"),
        ) +
          (s.assessment.released.includes("aisha")
            ? h.row(
                "Feedback released",
                "PHYS 110 · review before your next problem set",
                h.go("Read feedback", "S09"),
              )
            : "") +
          (s.campus?.rsvp === "confirmed"
            ? h.row(
                s.campus.event.title,
                "Your place is confirmed",
                h.go("View event", "S28"),
              )
            : "") +
          h.row(
            "Read state",
            s.course.updatesRead
              ? "All current updates marked read"
              : "Unread updates",
            h.btn("Mark current updates read", "student-updates-read"),
          ),
      ) +
      h.card(
        "Delivery preferences",
        h.select("Frequency", "course.prefs", s.course.prefs, [
          "Daily digest",
          "Each update",
          "Weekly summary",
        ]) +
          h.select(
            "Preferred channel",
            "course.channel",
            s.course.channel || "In app",
            ["In app", "Email digest"],
          ) +
          `<label class="check-row"><input id="S13-quiet" type="checkbox" data-bind="course.quiet"${s.course.quiet ? " checked" : ""}> Quiet period: 10 pm–7 am</label>` +
          h.notice(
            "Preference preview only",
            "This page does not send email or push notifications. Important policy exceptions would be defined with the institution.",
          ),
      ),
  );
  const act = W.actions;
  act["student-day-state"] = (s, p) => {
    s.course.dayState = p.value;
  };
  act["student-course-summary"] = (s, p) => {
    s.course.summary = p.value;
  };
  act["student-syllabus"] = (s) => {
    s.course.material = "syllabus";
    return { go: "S04" };
  };
  act["student-module"] = (s, p) => {
    const m = s.teaching?.modules.find((x) => x.id === p.id);
    if (!m || !moduleReady(s, m))
      return { message: "This module is not available." };
    s.course.activeModule = m.id;
    s.course.material = "reading";
    return { go: "S04" };
  };
  act["student-read"] = (s) => {
    const id = s.course.activeModule || "m3",
      done = new Set(s.course.completedModules || ["m1", "m2"]);
    s.course.read = !done.has(id);
    if (s.course.read) done.add(id);
    else done.delete(id);
    s.course.completedModules = [...done];
    return {
      message: s.course.read
        ? "Module reading completed; the prerequisite record is updated."
        : "Module reading marked incomplete.",
    };
  };
  act["student-new-attempt"] = (s) => {
    if (s.submission.status === "received") W.beginDraft(s);
    else s.submission.attempt++;
    s.submission.status = "draft";
    s.submission.pages = [];
    s.submission.error = "";
    return {
      go: "S06",
      message: "New sample attempt ready. Earlier receipt history is separate.",
    };
  };
  act["student-load-pages"] = (s) => {
    W.beginDraft(s);
    s.submission.pages = W.clone(W.defaults.submission.pages);
    s.submission.error = "";
    return { message: "Four sample pages added. Review their tags." };
  };
  act["student-capture"] = (s) => {
    W.beginDraft(s);
    s.submission.pages.push({
      id: Math.max(0, ...s.submission.pages.map((p) => p.id)) + 1,
      tag: "",
      rotation: 0,
      owner: "aisha",
    });
    return { message: "Page added. Tag the question before submitting." };
  };
  act["student-pdf"] = (s) => {
    W.beginDraft(s);
    s.submission.pages = W.clone(W.defaults.submission.pages);
    s.submission.method = "PDF";
    s.submission.error = "";
    return {
      go: "S07",
      message: "Sample PDF ready. No personal file was opened.",
    };
  };
  act["student-no-camera"] = (s) => {
    s.course.noCamera = !s.course.noCamera;
  };
  act["student-rotate"] = (s, p) => {
    W.beginDraft(s);
    const page = s.submission.pages.find((x) => x.id === Number(p.id));
    if (page) page.rotation = (page.rotation + 90) % 360;
  };
  act["student-move"] = (s, p) => {
    const i = s.submission.pages.findIndex((x) => x.id === Number(p.id));
    if (i <= 0) return { message: "This page is already first." };
    W.beginDraft(s);
    [s.submission.pages[i - 1], s.submission.pages[i]] = [
      s.submission.pages[i],
      s.submission.pages[i - 1],
    ];
  };
  act["student-remove"] = (s, p) => {
    W.beginDraft(s);
    s.submission.pages = s.submission.pages.filter(
      (x) => x.id !== Number(p.id),
    );
  };
  act["student-interrupt"] = (s) => {
    if (s.submission.status === "received") W.beginDraft(s);
    s.submission.status = "interrupted";
    return {
      go: "S08",
      message: "Interrupted: no receipt issued; pages and tags preserved.",
    };
  };
  act["student-submit"] = (s) => {
    if (!available(s))
      return { go: "S05", message: "This assignment is not published." };
    if (W.localNow(s) > dates(s).close) {
      s.submission.error =
        "This attempt is closed. Contact your instructor about an allowance.";
      return { go: "S08", message: s.submission.error };
    }
    const invalid = [...tagged(s)].some(
      (q) => !s.assignment.questions.some((x) => x.id === q),
    );
    if (!s.submission.pages.length || missing(s).length || invalid) {
      s.submission.error = !s.submission.pages.length
        ? "Add at least one page."
        : invalid
          ? "Use listed question identifiers only."
          : "Tag all required questions: " + missing(s).join(", ");
      return {
        go: "S07",
        message: s.submission.error,
        errorPath: s.submission.pages.length ? "submission.pages.0.tag" : null,
      };
    }
    s.submission.status = "received";
    s.submission.error = "";
    s.submission.receipt =
      "AH-PHYS110-" + String(s.submission.attempt).padStart(3, "0");
    s.submission.receivedAt = W.deadline(W.localNow(s));
    return {
      go: "S08",
      message: "Sample work received. These pages and tags match this receipt.",
    };
  };
  act["student-quiz-flag"] = (s) => {
    s.course.quizFlag = !s.course.quizFlag;
  };
  act["student-quiz-review"] = (s) => {
    s.course.quizReview = true;
    return { message: "Review your answers before confirming submission." };
  };
  act["student-quiz-edit"] = (s) => {
    s.course.quizReview = false;
  };
  act["student-quiz-submit"] = (s) => {
    if (s.course.quizSubmitted)
      return { message: "This attempt is already submitted." };
    if (!s.course.quizPublished || s.teaching?.coursePublished === false)
      return { go: "S10", message: "Quiz is not published." };
    if (!s.course.quizReview) return { message: "Review your answers first." };
    if (
      quizItems(s).some(
        (q) =>
          !String(s.course.quizAnswers?.[q.id] || "").trim() ||
          (q.type === "Numeric response" &&
            !Number.isFinite(Number(s.course.quizAnswers?.[q.id]))),
      )
    )
      return { message: "Answer every authored question before submitting." };
    const limit = s.teaching?.quizAttempts || "2";
    if (
      limit !== "Unlimited" &&
      (s.course.quizAttemptCount || 0) >= Number(limit)
    )
      return { message: "All allowed attempts have been used." };
    s.course.quizAttemptCount = (s.course.quizAttemptCount || 0) + 1;
    s.course.quizSubmission = W.clone({
      quizId: s.teaching?.quizId || "phys-quiz3",
      attempt: s.course.quizAttemptCount,
      title: s.teaching?.quizTitle || "Motion check: projectile reasoning",
      items: quizItems(s),
      answers: s.course.quizAnswers,
      minutes: s.teaching?.quizMinutes || 25,
      extraMinutes: W.quizExtraMinutes(s),
      feedback: s.teaching?.quizFeedback || "Instructor release",
      due: s.teaching?.quizDue || "2026-10-16T23:59",
      attemptLimit: limit,
      submittedAt: W.localNow(s),
    });
    s.course.quizSubmitted = true;
    return {
      message:
        "Attempt submitted. Result visibility follows the course policy.",
    };
  };
  act["student-quiz-reset"] = (s) => {
    if (!s.course.quizPublished || s.teaching?.coursePublished === false)
      return {
        message: "The quiz must be published before starting another attempt.",
      };
    const limit = s.teaching?.quizAttempts || "2";
    if (
      limit !== "Unlimited" &&
      (s.course.quizAttemptCount || 0) >= Number(limit)
    )
      return { message: "All allowed attempts have been used." };
    if (s.course.quizSubmitted && s.course.quizSubmission) {
      s.course.quizHistory = [
        ...(s.course.quizHistory || []),
        W.clone(s.course.quizSubmission),
      ];
    }
    s.course.quizSubmission = null;
    s.course.quizSubmitted = false;
    s.course.quizResultReleased = false;
    s.course.quizReview = false;
    s.course.quizAnswers = {};
    s.course.quizFlag = false;
  };
  act["student-reply"] = (s) => {
    if (!s.course.reply.trim())
      return { message: "Write a reply before posting." };
    s.course.replies.push(s.course.reply.trim());
    s.course.reply = "";
    return { message: "Reply posted in the sample course." };
  };
  act["student-updates-read"] = (s) => {
    s.course.updatesRead = true;
    return { message: "Current updates marked read." };
  };
})();
