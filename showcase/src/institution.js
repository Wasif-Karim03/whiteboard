(function () {
  "use strict";

  const W = window.WB,
    h = W.h,
    e = W.e;
  const clone = (value) =>
    W.clone ? W.clone(value) : JSON.parse(JSON.stringify(value));
  const mergeDefaults = (current, defaults) => {
    if (Array.isArray(current)) return clone(current);
    if (!current || typeof current !== "object")
      return current === undefined ? clone(defaults) : current;
    const result = clone(defaults);
    for (const [key, value] of Object.entries(current)) {
      result[key] =
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        result[key] &&
        typeof result[key] === "object" &&
        !Array.isArray(result[key])
          ? mergeDefaults(value, result[key])
          : clone(value);
    }
    return result;
  };

  const moduleDefaults = {
    now: "2026-10-15T10:42:00Z",
    supportUntil: null,
    reconciliation: {
      sourceRows: [
        {
          id: "sis-1042",
          source: "SIS",
          sourceKey: "1042",
          name: "Ben Kowalski",
          email: "ben.kowalski@example.edu",
          course: "PHYS 110",
          state: "candidate",
        },
        {
          id: "sis-8871",
          source: "SIS",
          sourceKey: "8871",
          name: "Benjamin Kowalski",
          email: "ben.kowalski@example.edu",
          course: "PHYS 110",
          state: "candidate",
        },
      ],
      fieldMappings: [
        {
          source: "student_number",
          destination: "Person source key",
          state: "Mapped",
        },
        {
          source: "preferred_name",
          destination: "Display name",
          state: "Review difference",
        },
        {
          source: "email",
          destination: "Institution email",
          state: "Exact match",
        },
        {
          source: "course_code",
          destination: "Course membership",
          state: "Exact match",
        },
      ],
      matchedPersonId: null,
      chosenSourceId: null,
      rejectedSourceIds: [],
      lastSuccessful: "2026-10-15T09:30:00Z",
    },
    gradeExport: {
      accepted: {},
      rows: [],
      attempts: [],
      rejectOnce: true,
      lastSuccessful: null,
    },
    migrationRows: [
      {
        id: "course-title",
        source: "Course title",
        destination: "Course name",
        severity: "Required",
        decision: "Mapped",
        detail: "Text field",
      },
      {
        id: "folder-week",
        source: "Folder / week",
        destination: "Module",
        severity: "Required",
        decision: "Unresolved",
        detail: "Structure mapping",
      },
      {
        id: "assignment-points",
        source: "Assignment points",
        destination: "Assignment / total",
        severity: "Required",
        decision: "Unresolved",
        detail: "Numeric field",
      },
      {
        id: "external-tool",
        source: "Publisher launch",
        destination: "Review placeholder",
        severity: "Warning",
        decision: "Unresolved",
        detail: "Unsupported external tool",
      },
      {
        id: "scan-asset",
        source: "Week 3 scan.pdf",
        destination: "Exclude; request accessible replacement",
        severity: "Error",
        decision: "Unresolved",
        detail: "Inaccessible asset",
      },
    ],
    migrationPreviewFingerprint: null,
    migrationPreview: null,
    migrationReportExported: false,
    courseAiPolicy:
      "Course permits assistance only where the assignment terms allow it",
    exitPreview: false,
    portableExportedAt: null,
  };

  // WB.defineState replaces one top-level key, so merge the root-owned institution
  // fields first and retain every shared property while adding this module's records.
  W.defineState(
    "institution",
    mergeDefaults(W.defaults.institution || {}, moduleDefaults),
  );

  W.resetInstitutionJourney = (s) => {
    const defaults = W.defaults.institution;
    for (const key of [
      "reconciliation",
      "gradeExport",
      "migrationRows",
      "migrationPreviewFingerprint",
      "migrationPreview",
      "migrationReportExported",
      "exitPreview",
      "portableExportedAt",
      "rosterResolved",
      "gradeSynced",
      "migrationMapped",
      "migrationAccepted",
    ]) {
      s.institution[key] = clone(defaults[key]);
    }
    delete s.institution.gradeExportFingerprint;
  };

  const ACTORS = {
    admin: "Avery Morgan · Institution administrator",
    it: "Jordan Lee · Institution IT",
    implementation: "Priya Nair · Implementation administrator",
  };
  const actorText = () => {
    const actor = W.ui && W.ui.actor;
    if (!actor) return "";
    if (typeof actor === "string") return actor;
    return [actor.role, actor.label, actor.name, actor.id]
      .filter(Boolean)
      .join(" ");
  };
  const canAct = (roles) => {
    const current = actorText()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ");
    if (!current) return true;
    return roles.some((role) => {
      const expected = role.toLowerCase().replace(/[^a-z0-9]+/g, " ");
      return current.includes(expected) || expected.includes(current);
    });
  };
  const guard = (roles, label) =>
    canAct(roles)
      ? null
      : { message: `Open the ${label} sample workspace to make this change.` };
  const audit = (s, action, actor) => W.audit(s, action, ACTORS[actor]);
  const record = (s, action, message, actor) => {
    audit(s, action, actor);
    return { message };
  };
  const clock = (s) => (W.clock ? W.clock(s) : new Date(s.institution.now));
  const iso = (s) => clock(s).toISOString();
  const pretty = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not recorded";
    return (
      date.toLocaleString("en-US", {
        timeZone: "UTC",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }) + " UTC"
    );
  };
  const supportState = (s) => {
    const until = s.institution.supportUntil;
    if (until === null || until === undefined)
      return { status: "closed", label: "Closed", tone: "neutral" };
    if (clock(s).getTime() >= Number(until))
      return { status: "expired", label: "Expired", tone: "warning" };
    return {
      status: "active",
      label: `Active until ${pretty(Number(until))}`,
      tone: "success",
    };
  };
  const submissionFor = (s, id) =>
    W.submissionFor
      ? W.submissionFor(s, id)
      : id === "aisha"
        ? s.submission
        : {
            status: s.people.find((person) => person.id === id)?.submitted
              ? "received"
              : "missing",
            attempt: 1,
          };
  const isExcused = (s, id) =>
    Array.isArray(s.teaching?.excused)
      ? s.teaching.excused.includes(id)
      : Boolean(s.teaching?.excused && s.teaching.excused[id]);
  const snapshotFingerprint = (s, id, snapshot) =>
    JSON.stringify({
      personId: id,
      assignmentId: s.assignment.id,
      snapshot,
    });
  const releasedValidation = (s, id) => {
    const snapshot =
      s.assessment.releaseSnapshots && s.assessment.releaseSnapshots[id];
    const submission = submissionFor(s, id);
    if (isExcused(s, id) || snapshot?.excused === true)
      return {
        ok: false,
        excluded: true,
        reason: "Excused work is excluded from numeric export.",
      };
    if (!s.assessment.released.includes(id) || !snapshot)
      return { ok: false, reason: "No released snapshot." };
    if (
      !submission ||
      submission.status !== "received" ||
      Number(snapshot.attempt) !== Number(submission.attempt)
    )
      return {
        ok: false,
        reason: "Released snapshot is not for the current received attempt.",
      };
    if (snapshot.submissionId !== submission.id)
      return {
        ok: false,
        reason:
          "Released snapshot does not identify the current submission record.",
      };
    if (
      !Array.isArray(snapshot.marks) ||
      snapshot.marks.length !== s.assignment.questions.length
    )
      return { ok: false, reason: "Released snapshot is incomplete." };
    return {
      ok: true,
      snapshot,
      submission,
      fingerprint: snapshotFingerprint(s, id, snapshot),
    };
  };
  const exportIds = (s) =>
    Array.from(new Set(["aisha"].concat(s.assessment.released || []))).filter(
      (id) => s.people.some((person) => person.id === id),
    );
  const updateGradeSynced = (s) => {
    const considered = exportIds(s)
      .map((id) => [id, releasedValidation(s, id)])
      .filter(([, result]) => !result.excluded);
    s.institution.gradeSynced =
      considered.length > 0 &&
      considered.every(
        ([id, result]) =>
          result.ok &&
          s.institution.gradeExport.accepted[id]?.fingerprint ===
            result.fingerprint,
      );
    const aisha = releasedValidation(s, "aisha");
    if (
      aisha.ok &&
      s.institution.gradeExport.accepted.aisha?.fingerprint ===
        aisha.fingerprint
    )
      s.institution.gradeExportFingerprint = JSON.stringify(aisha.snapshot);
    else delete s.institution.gradeExportFingerprint;
  };
  const gradeReport = (s) => ({
    fictional: true,
    generatedAt: iso(s),
    authority:
      "Released Whiteboard grade snapshots; illustrative local handoff only",
    rows: clone(s.institution.gradeExport.rows),
    accepted: Object.entries(s.institution.gradeExport.accepted).map(
      ([personId, value]) => ({
        personId,
        attempt: value.attempt,
        score: value.score,
        acceptedAt: value.acceptedAt,
        receipt: value.receipt,
      }),
    ),
    attempts: clone(s.institution.gradeExport.attempts),
  });
  const migrationFingerprint = (s) =>
    JSON.stringify(
      s.institution.migrationRows.map((row) => ({
        id: row.id,
        destination: row.destination,
        severity: row.severity,
        decision: row.decision,
      })),
    );
  const blockingMigrationRows = (s) =>
    s.institution.migrationRows.filter(
      (row) =>
        ["Required", "Error"].includes(row.severity) &&
        row.decision === "Unresolved",
    );
  const migrationSummary = (s) => ({
    mapped: s.institution.migrationRows.filter(
      (row) => row.decision === "Mapped",
    ).length,
    excluded: s.institution.migrationRows.filter(
      (row) => row.decision === "Excluded",
    ).length,
    placeholders: s.institution.migrationRows.filter(
      (row) => row.decision === "Review placeholder",
    ).length,
    warnings: s.institution.migrationRows.filter(
      (row) => row.severity === "Warning",
    ).length,
    blocking: blockingMigrationRows(s).length,
  });
  const migrationReport = (s) => ({
    fictional: true,
    generatedAt: iso(s),
    scope: "One sample PHYS 110 course; no course was imported",
    accepted: Boolean(s.institution.migrationAccepted),
    summary: migrationSummary(s),
    rows: clone(s.institution.migrationRows),
  });
  const academicPolicy = (s) => {
    const policy = W.academicPolicy ? W.academicPolicy(s) : s.assignment.policy;
    if (typeof policy === "string") return policy;
    return (
      policy?.text || policy?.policy || policy?.label || s.assignment.policy
    );
  };
  const portableRecord = (s) => ({
    fictional: true,
    generatedAt: iso(s),
    format: "Whiteboard portable learning-record example v1",
    authority: {
      people: "Institution SIS",
      course: "Institution catalog and course staff",
      learningRecords: "Whiteboard released records",
      migrationAcceptance: "Institution implementation administrator",
    },
    course: {
      code: "PHYS 110",
      title: "Introductory Mechanics",
      term: "Fall 2026",
    },
    people: s.people.slice(0, 3).map((person) => ({
      id: person.id,
      name: person.name,
      active: person.active,
    })),
    assignment: {
      title: s.assignment.title,
      due: s.assignment.due,
      close: s.assignment.close,
      questions: s.assignment.questions.map((question) => ({
        id: question.id,
        max: question.max,
      })),
    },
    releasedRecords: Object.entries(s.assessment.releaseSnapshots || {})
      .filter(([id]) => s.assessment.released.includes(id))
      .map(([id, snapshot]) => ({ personId: id, snapshot: clone(snapshot) })),
    reconciliation: {
      chosenSourceId: s.institution.reconciliation.chosenSourceId,
      rejectedSourceIds: clone(s.institution.reconciliation.rejectedSourceIds),
    },
    migration: {
      accepted: s.institution.migrationAccepted,
      decisions: s.institution.migrationRows.map((row) => ({
        id: row.id,
        decision: row.decision,
      })),
    },
  });

  const renderLogs = (s) =>
    s.institution.logs.length
      ? h.table(
          "Local example actions",
          ["When", "Actor", "Action"],
          s.institution.logs
            .slice(0, 10)
            .map((item) => [e(item.time), e(item.actor), e(item.action)]),
        )
      : h.notice(
          "No actions recorded yet",
          "Change a role, access window, mapping, or policy to create a named local event.",
        );

  W.reg("S37", "People, access & records", "Institution administrator", (s) => {
    const support = supportState(s);
    const retentionOptions = [
      "End of term + 90 days",
      "End of term + 1 year",
      "Institution policy pending",
    ];
    return (
      h.head(
        "Access with a clear boundary",
        "Institution-wide policy, scoped course roles and a named local record of changes.",
      ) +
      h.stats([
        [
          s.people.filter((person) => person.active).length,
          "Active PHYS 110 learners",
        ],
        [s.institution.taActive ? "Active" : "Revoked", "TA course access"],
        [support.label, "Illustrative support access"],
      ]) +
      h.card(
        "Course access",
        h.table(
          "PHYS 110 role assignments",
          ["Person", "Scope", "Authority"],
          [
            [
              e("Dr. Diane Reyes"),
              "PHYS 110",
              "Instructor · publish and release",
            ],
            [
              e("Maya Chen"),
              "PHYS 110",
              s.institution.taActive
                ? "TA · grade drafts only"
                : "Access revoked",
            ],
            [e("Marisol Vega"), "Learning support", "Assigned referrals only"],
          ],
        ) +
          h.btn(
            s.institution.taActive ? "Revoke TA access" : "Restore TA access",
            "it-ta",
          ),
      ) +
      h.card(
        "Records policy",
        h.row(
          "Submission retention",
          s.institution.retention,
          h.pill("Policy choice", "info"),
        ) +
          `<div class="actions">${retentionOptions.map((value) => h.btn(value, "it-retention", { value }, s.institution.retention === value ? "primary" : "quiet")).join("")}</div>` +
          h.notice(
            "A policy choice, not a completed deletion",
            "Legal holds, institutional records policy and signed agreements must be resolved before production retention can run.",
          ) +
          h.btn("Export fictional audit record", "it-export"),
      ) +
      h.card(
        "Support access",
        h.row(
          "Time-limited, approved access",
          `Fictional clock: ${pretty(iso(s))}. No outside person can connect.`,
          h.pill(support.label, support.tone),
        ) +
          `<div class="actions">${h.btn(support.status === "active" ? "Close support access" : "Approve 18-minute sample access", "it-support")}${support.status === "active" ? h.btn("Advance clock past expiry", "it-clock-advance", {}, "quiet") : ""}</div>` +
          (support.status === "expired"
            ? h.notice(
                "Access expired",
                "The fictional clock passed the approved timestamp. The next action requires a new approval.",
                "warning",
              )
            : ""),
      ) +
      h.card("Ordered local history", renderLogs(s))
    );
  });

  W.reg("S38", "Connections & reconciliation", "Institution IT", (s) => {
    const reconciliation = s.institution.reconciliation;
    const sourceRows = reconciliation.sourceRows.map((row) => [
      e(`${row.source} ${row.sourceKey}`),
      e(row.name),
      e(row.email),
      e(row.course),
      reconciliation.chosenSourceId === row.id
        ? h.pill("Matched to Ben", "success")
        : reconciliation.rejectedSourceIds.includes(row.id)
          ? h.pill("Rejected duplicate", "neutral")
          : h.btn("Use as canonical row", "it-roster", { id: row.id }, "quiet"),
    ]);
    const mappingRows = reconciliation.fieldMappings.map((row) => [
      e(row.source),
      e(row.destination),
      e(row.state),
    ]);
    const gradeRows = s.institution.gradeExport.rows.length
      ? s.institution.gradeExport.rows.map((row) => [
          e(row.person),
          e(row.attempt ?? "—"),
          e(row.state),
          e(row.detail),
        ])
      : [
          [
            e("Aisha Rahman"),
            "—",
            "Not prepared",
            "Release the current received attempt before export.",
          ],
        ];
    return (
      h.head(
        "Know what came across",
        "Inspectable local exchange examples. No external service is connected.",
      ) +
      h.table(
        "Authoritative systems and directions",
        ["Record", "Authority → destination", "Freshness / state"],
        [
          [
            "Enrollment",
            "SIS → Whiteboard",
            reconciliation.chosenSourceId
              ? "Duplicate reviewed locally"
              : "Duplicate needs review",
          ],
          [
            "Final grades",
            "Whiteboard → SIS",
            s.institution.gradeSynced
              ? "Eligible released snapshots accepted locally"
              : "Awaiting validation or retry",
          ],
          [
            "Class meetings",
            "Scheduling authority → Whiteboard",
            s.campus?.scheduleApplied
              ? "Local source change applied"
              : "Illustrative current timetable",
          ],
          [
            "Identity",
            "Institution identity provider → Whiteboard",
            "SAML / OIDC design target · not connected",
          ],
        ],
      ) +
      h.card(
        "Roster exception",
        h.notice(
          reconciliation.chosenSourceId
            ? "Resolution recorded"
            : "Two source rows share one institutional email",
          reconciliation.chosenSourceId
            ? "One row maps to Ben Kowalski; the other is retained as a rejected duplicate decision."
            : "Compare the raw values and select the authoritative source row. Active enrollment does not change.",
          reconciliation.chosenSourceId ? "success" : "warning",
        ) +
          h.table(
            "Raw fictional source rows",
            ["Source key", "Name", "Email", "Course", "Decision"],
            sourceRows,
          ) +
          h.table(
            "Field mapping",
            ["Source field", "Whiteboard field", "State"],
            mappingRows,
          ) +
          `<p class="small muted">Last successful roster exchange: ${e(pretty(reconciliation.lastSuccessful))}.</p>`,
      ) +
      h.card(
        "Final grade handoff",
        h.notice(
          "Released snapshots only",
          "The local validator excludes excused work and requires the released snapshot for each current received attempt.",
        ) +
          h.table(
            "Local grade transfer results",
            ["Person", "Attempt", "State", "Detail"],
            gradeRows,
          ) +
          `<div class="actions">${h.btn("Validate and send local sample", "it-grades")}${s.institution.gradeExport.rows.some((row) => row.state === "Rejected") ? h.btn("Retry rejected rows", "it-grade-retry", {}, "primary") : ""}${h.btn("Export transfer report", "it-grade-report", {}, "quiet")}${h.go("Review feedback release", "S20", "quiet")}</div>` +
          (s.institution.gradeExport.lastSuccessful
            ? `<p class="small muted">Last successful local exchange: ${e(pretty(s.institution.gradeExport.lastSuccessful))}.</p>`
            : ""),
      ) +
      h.card(
        "Planned standards",
        h.row(
          "LTI 1.3 / LTI Advantage",
          "Course tools and grade services remain subject to implementation and conformance testing.",
        ) +
          h.row(
            "SIS adapters, SAML / OIDC and InCommon federation",
            "Institution-specific mapping, testing and agreements are required.",
          ) +
          h.row(
            "Caliper / xAPI",
            "Event contracts, minimization and ownership require review before any implementation claim.",
          ),
      )
    );
  });

  W.reg("S39", "Migration rehearsal", "Implementation administrator", (s) => {
    const summary = migrationSummary(s);
    const rows = s.institution.migrationRows.map((row) => [
      e(row.source),
      e(row.destination),
      h.pill(
        row.severity,
        row.severity === "Error"
          ? "error"
          : row.severity === "Warning"
            ? "warning"
            : "neutral",
      ),
      e(row.decision),
      row.decision === "Unresolved"
        ? h.btn(
            row.id === "scan-asset"
              ? "Exclude sample asset"
              : row.id === "external-tool"
                ? "Use review placeholder"
                : "Map row",
            "it-migration-row",
            { id: row.id },
            "quiet",
          )
        : h.pill("Reviewed", "success"),
    ]);
    return (
      h.head(
        "Rehearse before changing a term",
        "A bounded local preview with row-level exceptions and explicit acceptance. The existing SIS remains authoritative.",
      ) +
      h.stats([
        ["1", "Sample course"],
        [s.institution.migrationRows.length, "Mapping and exception rows"],
        [
          s.institution.migrationAccepted ? "Accepted" : "Not accepted",
          "Rehearsal status",
        ],
      ]) +
      h.table(
        "Sample migration decisions",
        ["Source", "Whiteboard destination", "Severity", "Decision", "Review"],
        rows,
      ) +
      h.card(
        "Preview and acceptance",
        h.notice(
          summary.blocking
            ? `${summary.blocking} required decision${summary.blocking === 1 ? "" : "s"} unresolved`
            : "Required decisions resolved",
          summary.blocking
            ? "Acceptance remains blocked until each required or error row has an explicit decision."
            : "Unsupported-tool warnings remain visible in the preview and report.",
          summary.blocking ? "warning" : "success",
        ) +
          (s.institution.migrationPreview
            ? h.stats([
                [s.institution.migrationPreview.mapped, "Mapped"],
                [s.institution.migrationPreview.excluded, "Excluded"],
                [
                  s.institution.migrationPreview.placeholders,
                  "Review placeholders",
                ],
                [s.institution.migrationPreview.warnings, "Warnings retained"],
              ])
            : "") +
          `<div class="actions">${h.btn("Prepare current preview", "it-map")}${h.btn("Accept reviewed preview", "it-accept", {}, s.institution.migrationAccepted ? "secondary" : "primary")}${h.btn("Export local exception report", "it-migration-export", {}, "quiet")}</div>` +
          h.notice(
            s.institution.migrationAccepted
              ? "Preview accepted locally"
              : "Acceptance required",
            s.institution.migrationAccepted
              ? "The accepted fingerprint matches the visible decisions. No course was imported."
              : "Any mapping change invalidates the prior preview and acceptance.",
            s.institution.migrationAccepted ? "success" : "info",
          ),
      ) +
      h.card(
        "Start the next term",
        h.row(
          "Copy reusable course structure",
          "Reuse reviewed modules and assignments; exclude student submissions and grades.",
          h.go("Open course rollover", "S22"),
        ),
      )
    );
  });

  W.reg("S40", "Trust & AI controls", "Institution IT", (s) => {
    const coursePolicy =
      s.teaching?.courseAiPolicy ||
      s.course?.aiPolicy ||
      s.institution.courseAiPolicy;
    const effective = s.institution.aiEnabled
      ? `Institution assistance is enabled; ${coursePolicy}. Assignment terms still govern academic use.`
      : "Institution assistance is disabled, so course and assignment layers cannot enable authored draft help.";
    return (
      h.head(
        "Trust is work we must demonstrate",
        "Designed requirements, policy precedence and planned operational ownership. No certification or service guarantee is claimed.",
      ) +
      h.card(
        "Policy precedence",
        h.table(
          "AI and academic-use layers",
          ["Layer", "Current fictional decision", "Effect"],
          [
            [
              "1 · Institution assistance",
              s.institution.aiEnabled
                ? "Enabled for reviewed local examples"
                : "Disabled",
              s.institution.aiEnabled
                ? "Courses may restrict it"
                : "Blocks authored draft help",
            ],
            [
              "2 · PHYS 110 course",
              e(coursePolicy),
              "Cannot override an institution restriction",
            ],
            [
              "3 · Assignment terms",
              e(academicPolicy(s)),
              "Governs learner academic use within higher-level restrictions",
            ],
          ],
        ) +
          h.notice(
            "Effective result",
            effective,
            s.institution.aiEnabled ? "info" : "warning",
          ) +
          h.row(
            "Authored grading example",
            "Question 3 · Aisha Rahman · the instructor may edit, accept or discard a fixed sample feedback draft. Accepting it never scores or releases work.",
            h.go("Review exact question context", "S17"),
          ) +
          h.btn(
            s.institution.aiEnabled
              ? "Disable sample assistance"
              : "Enable sample assistance",
            "it-ai",
          ),
      ) +
      h.card(
        "Operational responsibilities",
        h.table(
          "Planned operating model",
          [
            "Responsibility",
            "Record authority / owner",
            "Evidence needed before operation",
          ],
          [
            [
              "Implementation and migration acceptance",
              "Institution implementation lead",
              "Signed scope, exception report and acceptance record",
            ],
            [
              "Support triage",
              "Campus help desk; role-scoped escalation",
              "Runbook, staffing path and tested handoff",
            ],
            [
              "Incident response",
              "Institution security lead and contracted service owner",
              "Notification path, exercised response and retained decisions",
            ],
            [
              "Backup and restore",
              "Service operator; institution verifies recovery",
              "Documented schedule plus a witnessed restore test",
            ],
            [
              "Exit and record return",
              "Registrar / records owner",
              "Portable export, checksum, transfer receipt and deletion decision",
            ],
          ],
        ),
      ) +
      h.card(
        "Portable-record exit preview",
        h.notice(
          "Local, fictional record package",
          "The preview shows which authorities and learning records would be returned. Contract terms, transfer method, verification and deletion remain planned.",
        ) +
          (s.institution.exitPreview
            ? h.table(
                "Preview contents",
                ["Section", "Included sample"],
                [
                  [
                    "Authority map",
                    "People, course, learning records and migration acceptance",
                  ],
                  [
                    "Course structure",
                    "PHYS 110, assignment, questions and dates",
                  ],
                  [
                    "Learning records",
                    `${Object.keys(s.assessment.releaseSnapshots || {}).filter((id) => s.assessment.released.includes(id)).length} released snapshot(s)`,
                  ],
                  [
                    "Decision records",
                    "Reconciliation choice and migration decisions",
                  ],
                ],
              )
            : h.notice(
                "Preview not prepared",
                "Prepare the package summary before exporting the local JSON file.",
              )) +
          `<div class="actions">${h.btn("Prepare exit preview", "it-portable-preview")}${h.btn("Export portable sample", "it-portable-export", {}, "primary")}</div>`,
      ) +
      h.table(
        "Readiness requirements",
        ["Area", "What must be demonstrated", "Current claim"],
        [
          [
            "Privacy",
            "Institution agreement, permitted use, role access, retention and incident response",
            "Requirements only",
          ],
          [
            "Accessibility",
            "WCAG evaluation, assistive-technology testing and an accurate conformance report",
            "No completed report",
          ],
          [
            "Security review",
            "Questionnaire evidence, independent testing and operating controls",
            "No completed assurance report",
          ],
          [
            "Interoperability",
            "Test actual SIS, identity and learning-tool contracts",
            "No connected integration",
          ],
          [
            "Availability and recovery",
            "Measured operation, tested restore and contracted support terms",
            "No production SLA",
          ],
        ],
      ) +
      h.card("Illustrative audit trail", renderLogs(s))
    );
  });

  W.actions["it-ta"] = (s) => {
    const denied = guard(
      ["Institution administrator"],
      "Institution administrator",
    );
    if (denied) return denied;
    s.institution.taActive = !s.institution.taActive;
    return record(
      s,
      `${s.institution.taActive ? "Restored" : "Revoked"} TA course access for Maya Chen`,
      "Course TA access updated across the fictional example.",
      "admin",
    );
  };
  W.actions["it-retention"] = (s, p) => {
    const denied = guard(
      ["Institution administrator"],
      "Institution administrator",
    );
    if (denied) return denied;
    const allowed = [
      "End of term + 90 days",
      "End of term + 1 year",
      "Institution policy pending",
    ];
    if (!allowed.includes(p.value))
      return { message: "Choose one of the sample retention policies." };
    if (s.institution.retention === p.value)
      return { message: "That sample retention policy is already selected." };
    s.institution.retention = p.value;
    return record(
      s,
      `Changed the fictional retention choice to ${p.value}`,
      "Sample retention choice updated; no records were deleted.",
      "admin",
    );
  };
  W.actions["it-support"] = (s) => {
    const denied = guard(
      ["Institution administrator"],
      "Institution administrator",
    );
    if (denied) return denied;
    const support = supportState(s);
    if (support.status === "active") {
      s.institution.supportUntil = null;
      s.institution.supportAccess = false;
      return record(
        s,
        "Revoked fictional support access",
        "Illustrative support access closed.",
        "admin",
      );
    }
    s.institution.supportUntil = clock(s).getTime() + 18 * 60 * 1000;
    s.institution.supportAccess = true;
    return record(
      s,
      `Approved fictional support access until ${pretty(s.institution.supportUntil)}`,
      "Illustrative support access approved for 18 fictional minutes.",
      "admin",
    );
  };
  W.actions["it-clock-advance"] = (s) => {
    const denied = guard(
      ["Institution administrator"],
      "Institution administrator",
    );
    if (denied) return denied;
    const until = Number(s.institution.supportUntil);
    if (!Number.isFinite(until) || s.institution.supportUntil === null)
      return {
        message: "Approve sample support access before advancing its clock.",
      };
    s.institution.now = new Date(until + 60 * 1000).toISOString();
    s.institution.supportAccess = false;
    return record(
      s,
      "Advanced fictional clock past support-access expiry",
      "The sample access window expired and is closed.",
      "admin",
    );
  };
  W.actions["it-roster"] = (s, p = {}) => {
    const denied = guard(["Institution IT"], "Institution IT");
    if (denied) return denied;
    const reconciliation = s.institution.reconciliation;
    const chosen = reconciliation.sourceRows.find(
      (row) => row.id === (p.id || "sis-1042"),
    );
    if (!chosen)
      return { message: "That fictional source row is unavailable." };
    if (
      reconciliation.chosenSourceId === chosen.id &&
      reconciliation.matchedPersonId === "ben"
    )
      return {
        message:
          "That source row is already matched; no enrollment was duplicated.",
      };
    reconciliation.chosenSourceId = chosen.id;
    reconciliation.matchedPersonId = "ben";
    reconciliation.rejectedSourceIds = reconciliation.sourceRows
      .filter((row) => row.id !== chosen.id)
      .map((row) => row.id);
    reconciliation.sourceRows.forEach((row) => {
      row.state = row.id === chosen.id ? "matched" : "rejected duplicate";
    });
    s.institution.rosterResolved = true;
    return record(
      s,
      `Matched ${chosen.source} row ${chosen.sourceKey} to Ben Kowalski and rejected the duplicate`,
      "Example duplicate resolved. Active enrollment is unchanged.",
      "it",
    );
  };
  W.actions["it-grades"] = (s) => {
    const denied = guard(["Institution IT"], "Institution IT");
    if (denied) return denied;
    const rows = [],
      eligible = [];
    for (const id of exportIds(s)) {
      const person = s.people.find((item) => item.id === id);
      const result = releasedValidation(s, id);
      if (!result.ok) {
        rows.push({
          id,
          person: person.name,
          attempt: submissionFor(s, id)?.attempt,
          state: result.excluded ? "Excluded" : "Blocked",
          detail: result.reason,
        });
        continue;
      }
      const accepted = s.institution.gradeExport.accepted[id];
      if (accepted?.fingerprint === result.fingerprint) {
        rows.push({
          id,
          person: person.name,
          attempt: result.snapshot.attempt,
          state: "Already accepted",
          detail: `Receipt ${accepted.receipt}; no duplicate row sent.`,
        });
        continue;
      }
      eligible.push({ id, person, result });
    }
    const shouldReject =
      s.institution.gradeExport.rejectOnce && eligible.length > 1;
    eligible.forEach((item, index) => {
      const score = item.result.snapshot.marks.reduce(
        (sum, value) => sum + Number(value),
        0,
      );
      if (shouldReject && index === eligible.length - 1) {
        rows.push({
          id: item.id,
          person: item.person.name,
          attempt: item.result.snapshot.attempt,
          state: "Rejected",
          detail:
            "Simulated destination validation rejection; eligible for retry.",
        });
        return;
      }
      const receipt = `LOCAL-GRADE-${item.id.toUpperCase()}-${item.result.snapshot.attempt}`;
      s.institution.gradeExport.accepted[item.id] = {
        fingerprint: item.result.fingerprint,
        attempt: item.result.snapshot.attempt,
        score,
        acceptedAt: iso(s),
        receipt,
      };
      rows.push({
        id: item.id,
        person: item.person.name,
        attempt: item.result.snapshot.attempt,
        state: "Accepted",
        detail: `Released snapshot accepted locally · ${receipt}`,
      });
    });
    if (eligible.length) s.institution.gradeExport.rejectOnce = false;
    s.institution.gradeExport.rows = rows;
    s.institution.gradeExport.attempts.push({
      at: iso(s),
      kind: "initial",
      accepted: rows.filter((row) => row.state === "Accepted").length,
      rejected: rows.filter((row) => row.state === "Rejected").length,
      blocked: rows.filter((row) => row.state === "Blocked").length,
    });
    if (rows.some((row) => row.state === "Accepted"))
      s.institution.gradeExport.lastSuccessful = iso(s);
    updateGradeSynced(s);
    const acceptedCount = rows.filter((row) =>
        ["Accepted", "Already accepted"].includes(row.state),
      ).length,
      rejectedCount = rows.filter((row) => row.state === "Rejected").length;
    audit(
      s,
      `Validated grade handoff: ${acceptedCount} accepted, ${rejectedCount} rejected`,
      "it",
    );
    if (!eligible.length && !acceptedCount)
      return {
        message:
          "Release a current, received, non-excused snapshot before exporting a numeric grade.",
      };
    return {
      message: rejectedCount
        ? "The local handoff was partial. Retry only the rejected row."
        : "Eligible released snapshots were accepted locally without duplicate records.",
    };
  };
  W.actions["it-grade-retry"] = (s) => {
    const denied = guard(["Institution IT"], "Institution IT");
    if (denied) return denied;
    const retryIds = s.institution.gradeExport.rows
      .filter((row) => row.state === "Rejected")
      .map((row) => row.id);
    if (!retryIds.length)
      return { message: "There are no rejected grade rows to retry." };
    let acceptedCount = 0;
    const nextRows = s.institution.gradeExport.rows.map((row) => {
      if (!retryIds.includes(row.id)) return row;
      const result = releasedValidation(s, row.id);
      if (!result.ok)
        return {
          ...row,
          state: result.excluded ? "Excluded" : "Blocked",
          detail: result.reason,
        };
      const accepted = s.institution.gradeExport.accepted[row.id];
      if (accepted?.fingerprint === result.fingerprint)
        return {
          ...row,
          state: "Already accepted",
          detail: `Receipt ${accepted.receipt}; no duplicate row sent.`,
        };
      const score = result.snapshot.marks.reduce(
          (sum, value) => sum + Number(value),
          0,
        ),
        receipt = `LOCAL-GRADE-${row.id.toUpperCase()}-${result.snapshot.attempt}`;
      s.institution.gradeExport.accepted[row.id] = {
        fingerprint: result.fingerprint,
        attempt: result.snapshot.attempt,
        score,
        acceptedAt: iso(s),
        receipt,
      };
      acceptedCount++;
      return {
        ...row,
        attempt: result.snapshot.attempt,
        state: "Accepted",
        detail: `Retry accepted locally · ${receipt}`,
      };
    });
    s.institution.gradeExport.rows = nextRows;
    s.institution.gradeExport.attempts.push({
      at: iso(s),
      kind: "retry",
      accepted: acceptedCount,
      rejected: 0,
      blocked: nextRows.filter((row) => row.state === "Blocked").length,
    });
    if (acceptedCount) s.institution.gradeExport.lastSuccessful = iso(s);
    updateGradeSynced(s);
    audit(
      s,
      `Retried ${retryIds.length} rejected grade row${retryIds.length === 1 ? "" : "s"}; ${acceptedCount} accepted`,
      "it",
    );
    return {
      message: acceptedCount
        ? "Rejected rows were accepted on retry; previously accepted rows were not sent again."
        : "The rejected rows no longer pass local validation.",
    };
  };
  W.actions["it-grade-report"] = (s) => {
    const denied = guard(["Institution IT"], "Institution IT");
    if (denied) return denied;
    return {
      message: "Fictional grade-transfer report prepared for local download.",
      download: {
        name: "whiteboard-fictional-grade-transfer.json",
        text: JSON.stringify(gradeReport(s), null, 2),
      },
    };
  };
  W.actions["it-migration-row"] = (s, p) => {
    const denied = guard(
      ["Implementation administrator", "Institution IT"],
      "Implementation administrator",
    );
    if (denied) return denied;
    const row = s.institution.migrationRows.find((item) => item.id === p.id);
    if (!row) return { message: "That sample migration row is unavailable." };
    row.decision =
      row.id === "scan-asset"
        ? "Excluded"
        : row.id === "external-tool"
          ? "Review placeholder"
          : "Mapped";
    s.institution.migrationMapped = false;
    s.institution.migrationAccepted = false;
    s.institution.migrationPreview = null;
    s.institution.migrationPreviewFingerprint = null;
    return record(
      s,
      `Reviewed migration row ${row.source}: ${row.decision}`,
      "Row decision saved. Prepare a new preview before acceptance.",
      "implementation",
    );
  };
  W.actions["it-map"] = (s) => {
    const denied = guard(
      ["Implementation administrator", "Institution IT"],
      "Implementation administrator",
    );
    if (denied) return denied;
    s.institution.migrationRows.forEach((row) => {
      if (row.decision === "Unresolved")
        row.decision =
          row.id === "scan-asset"
            ? "Excluded"
            : row.id === "external-tool"
              ? "Review placeholder"
              : "Mapped";
    });
    s.institution.migrationMapped = blockingMigrationRows(s).length === 0;
    s.institution.migrationAccepted = false;
    s.institution.migrationPreview = migrationSummary(s);
    s.institution.migrationPreviewFingerprint = migrationFingerprint(s);
    return record(
      s,
      "Prepared migration preview with mapped fields, an excluded inaccessible asset, and a retained tool warning",
      "Current local preview prepared for acceptance.",
      "implementation",
    );
  };
  W.actions["it-accept"] = (s) => {
    const denied = guard(
      ["Implementation administrator", "Institution IT"],
      "Implementation administrator",
    );
    if (denied) return denied;
    const blocking = blockingMigrationRows(s);
    if (blocking.length)
      return {
        message: `Resolve ${blocking.length} required migration decision${blocking.length === 1 ? "" : "s"} before acceptance.`,
      };
    if (
      !s.institution.migrationPreviewFingerprint ||
      s.institution.migrationPreviewFingerprint !== migrationFingerprint(s)
    )
      return {
        message: "Prepare a current preview before accepting the rehearsal.",
      };
    if (s.institution.migrationAccepted)
      return { message: "This exact local preview is already accepted." };
    s.institution.migrationAccepted = true;
    return record(
      s,
      "Accepted the fictional migration preview and retained its exception decisions",
      "Local rehearsal accepted. No course was imported.",
      "implementation",
    );
  };
  W.actions["it-migration-export"] = (s) => {
    const denied = guard(
      ["Implementation administrator", "Institution IT"],
      "Implementation administrator",
    );
    if (denied) return denied;
    s.institution.migrationReportExported = true;
    audit(s, "Prepared fictional migration exception report", "implementation");
    return {
      message:
        "Fictional migration exception report prepared for local download.",
      download: {
        name: "whiteboard-fictional-migration-report.json",
        text: JSON.stringify(migrationReport(s), null, 2),
      },
    };
  };
  W.actions["it-ai"] = (s) => {
    const denied = guard(["Institution IT"], "Institution IT");
    if (denied) return denied;
    s.institution.aiEnabled = !s.institution.aiEnabled;
    return record(
      s,
      `Set institution AI assistance to ${s.institution.aiEnabled ? "enabled" : "disabled"}`,
      "Local institution policy updated. No model or API was called.",
      "it",
    );
  };
  W.actions["it-portable-preview"] = (s) => {
    const denied = guard(
      ["Institution IT", "Implementation administrator"],
      "Institution IT",
    );
    if (denied) return denied;
    s.institution.exitPreview = true;
    return record(
      s,
      "Prepared fictional portable-record exit preview",
      "Local exit preview prepared; no records were transferred.",
      "it",
    );
  };
  W.actions["it-portable-export"] = (s) => {
    const denied = guard(
      ["Institution IT", "Implementation administrator"],
      "Institution IT",
    );
    if (denied) return denied;
    if (!s.institution.exitPreview)
      return {
        message:
          "Prepare the exit preview before exporting the portable sample.",
      };
    s.institution.portableExportedAt = iso(s);
    s.institution.exported = true;
    audit(s, "Prepared fictional portable learning-record export", "it");
    return {
      message: "Fictional portable record prepared for local download.",
      download: {
        name: "whiteboard-fictional-portable-record.json",
        text: JSON.stringify(portableRecord(s), null, 2),
      },
    };
  };
  W.actions["it-export"] = (s) => {
    const denied = guard(
      ["Institution administrator"],
      "Institution administrator",
    );
    if (denied) return denied;
    s.institution.exported = true;
    audit(s, "Prepared fictional audit export", "admin");
    return {
      message: "Fictional audit JSON prepared for local download.",
      download: {
        name: "whiteboard-fictional-audit.json",
        text: JSON.stringify(
          {
            fictional: true,
            generatedAt: iso(s),
            retention: s.institution.retention,
            actions: s.institution.logs,
          },
          null,
          2,
        ),
      },
    };
  };
})();
