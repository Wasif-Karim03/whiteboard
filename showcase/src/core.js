(function () {
  "use strict";
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const e = (x) =>
    String(x ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const names = [
    "Aisha Rahman",
    "Ben Kowalski",
    "Carmen Ortiz",
    "Daniel Park",
    "Emily Nguyen",
    "Faisal Haddad",
    "Grace Liu",
    "Hugo Silva",
    "Isabel Torres",
    "Jamal Carter",
    "Kai Williams",
    "Leila Hassan",
    "Mateo Rivera",
    "Nora Johnson",
    "Olivia Bennett",
    "Priya Raman",
    "Quinn Delgado",
    "Ravi Shah",
    "Sofia Chen",
    "Theo Martin",
    "Uma Desai",
    "Victor Santos",
    "Willa Brooks",
    "Xavier Reed",
    "Yara Ali",
    "Zoe James",
    "Amir Khan",
    "Bella Moore",
    "Caleb Green",
    "Dina Ahmed",
    "Eli Turner",
    "Freya Scott",
    "Gabe Nelson",
    "Hana Kim",
    "Ian Foster",
    "Jade Wilson",
    "Kiran Patel",
    "Lena Fischer",
    "Miles Adams",
    "Nadia Saleh",
    "Owen Wright",
    "Pia Costa",
    "Rosa Diaz",
    "Sean Murphy",
  ];
  const people = names.map((name, i) => ({
    id:
      i === 0 ? "aisha" : i === 1 ? "ben" : i === 2 ? "carmen" : "student-" + i,
    name,
    active: true,
    submitted: i < 41,
    reviewed: i > 0 && i < 40,
  }));
  const defaults = {
    people,
    assignment: {
      id: "phys-ps4",
      title: "Problem Set 4: Kinematics",
      due: "2026-10-16T23:59",
      close: "2026-10-18T23:59",
      published: true,
      policy:
        "Limited: use AI to clarify concepts; show your own working and disclose assistance.",
      questions: [
        { id: "1a", max: 6 },
        { id: "1b", max: 4 },
        { id: "2", max: 6 },
        { id: "3", max: 8 },
        { id: "4", max: 6 },
      ],
    },
    submission: {
      id: "phys-ps4-aisha-1",
      status: "received",
      attempt: 1,
      pages: [
        { id: 1, tag: "1a, 1b", rotation: 0 },
        { id: 2, tag: "2", rotation: 0 },
        { id: 3, tag: "3", rotation: 0 },
        { id: 4, tag: "4", rotation: 0 },
      ],
      method: "scan",
      interrupted: false,
      error: "",
      receipt: "AH-PHYS110-001",
    },
    assessment: {
      student: "aisha",
      question: "3",
      role: "instructor",
      marks: {
        aisha: [6, 4, 5, 7, 5],
        ben: [5, 4, 4, 6, 5],
        carmen: [6, 4, 6, 8, 6],
      },
      graded: people.filter((x) => x.reviewed).map((x) => x.id),
      released: [],
      comment:
        "Your setup is clear. Check the sign of the vertical acceleration in the final substitution.",
      releaseScope: "selected",
      rubricAdjusted: false,
      conflict: false,
      aiDraft: false,
      sortAsc: true,
    },
    course: {
      moduleOpen: true,
      material: "reading",
      reply: "",
      replies: [],
      quizAnswer: "",
      quizSubmitted: false,
      quizFlag: false,
      quizPublished: true,
      read: false,
      prefs: "Daily digest",
      quiet: true,
    },
    institution: {
      now: "2026-10-15T10:42:00Z",
      supportUntil: null,
      aiEnabled: false,
      taActive: true,
      rosterResolved: false,
      gradeSynced: false,
      migrationMapped: false,
      migrationAccepted: false,
      retention: "End of term + 90 days",
      supportAccess: false,
      exported: false,
      logs: [],
    },
  };
  const WB = (window.WB = {
    defaults,
    state: clone(defaults),
    renderers: {},
    actions: {},
    ui: {},
    e,
    clone,
  });
  for (const [i, person] of defaults.people.entries())
    if (!defaults.assessment.marks[person.id])
      defaults.assessment.marks[person.id] = [
        6,
        4,
        Math.max(3, 6 - (i % 4)),
        Math.max(5, 8 - (i % 4)),
        Math.max(4, 6 - (i % 3)),
      ];
  defaults.assessment.comments = Object.fromEntries(
    defaults.people.map((p) => [
      p.id,
      p.id === "aisha"
        ? defaults.assessment.comment
        : "Review your units and show the intermediate steps.",
    ]),
  );
  defaults.submissions = Object.fromEntries(
    defaults.people
      .filter((p) => p.id !== "aisha")
      .map((p, i) => [
        p.id,
        {
          ...clone(defaults.submission),
          id: "phys-ps4-" + p.id + "-1",
          owner: p.id,
          status: p.submitted ? "received" : "draft",
          receipt: "AH-PHYS110-" + p.id.toUpperCase() + "-001",
          pages: p.submitted
            ? defaults.submission.pages.map((page) => ({
                ...page,
                owner: p.id,
                workVariant: (i % 3) + 1,
              }))
            : [],
        },
      ]),
  );
  defaults.submission.owner = "aisha";
  defaults.submission.receivedAt = "Oct 15, 6:30 am ET";
  defaults.course.quizAnswers = {};
  defaults.course.quizAttemptCount = 0;
  defaults.course.quizReview = false;
  defaults.course.quizResultReleased = false;
  defaults.assignment.attachments = [
    {
      id: "kinematics-guide",
      name: "Kinematics problem set.pdf",
      pages: 2,
      accessible: true,
      description: "Accessible sample problem-set handout",
      text: "Resolve a 12 m/s launch at 35 degrees into horizontal and vertical components. Explain acceleration at the highest point, calculate flight time at equal starting and ending height, then state your model assumptions.",
    },
  ];
  WB.state = clone(defaults);
  WB.submissionFor = (s, id = "aisha") =>
    id === "aisha" ? s.submission : s.submissions[id];
  WB.clock = (s) => new Date(s.institution.now || "2026-10-15T10:42:00Z");
  WB.localNow = (s) =>
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .format(WB.clock(s))
      .replace(" ", "T");
  WB.effectiveDates = (s, id = "aisha") => {
    const a = (s.teaching?.allowances || []).find(
        (x) =>
          (x.id || x.student) === id &&
          (!x.assignmentId || x.assignmentId === s.assignment.id),
      ),
      hours = Number(a?.extraHours ?? a?.hours ?? (a ? 24 : 0));
    const shift = (value) => {
      const d = new Date(value + "Z");
      return Number.isFinite(d.getTime())
        ? new Date(d.getTime() + hours * 3600000).toISOString().slice(0, 16)
        : "";
    };
    return {
      due: shift(s.assignment.due),
      close: shift(s.assignment.close),
      extraMinutes: Number(a?.extraMinutes || 0),
    };
  };
  WB.academicPolicy = (s) =>
    s.teaching?.courseAiPolicy === "Prohibited"
      ? "Prohibited: complete this work without AI assistance."
      : s.assignment.policy;
  WB.meeting = (s) =>
    s.campus?.meeting || {
      days: "Monday / Wednesday / Friday",
      time: "09:00",
      endTime: "09:50",
      room: "Hollis Hall 104",
    };
  WB.validate = (path, value, s = WB.state) => {
    const text = String(value ?? "");
    if (
      /(?:assignment.title|teaching.newAssignmentTitle)$/.test(path) &&
      text.length > 160
    )
      return "Use a title of 160 characters or fewer.";
    if (
      /(?:title|note|comment|summary|reply)/i.test(path) &&
      text.length > 2000
    )
      return "Use 2,000 characters or fewer.";
    if (/(?:title)$/.test(path) && !text.trim()) return "Enter a title.";
    if (/assignment\.(due|close)$/.test(path)) {
      if (
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text) ||
        !Number.isFinite(new Date(text + "Z").getTime()) ||
        new Date(text + "Z").toISOString().slice(0, 16) !== text
      )
        return "Enter a valid date and time.";
      if (path.endsWith("close") && text < s.assignment.due)
        return "Close date must follow the due date.";
      if (path.endsWith("due") && text > s.assignment.close)
        return "Due date must precede the close date.";
    }
    if (/(?:quizMinutes|capacity|copyShiftDays)$/.test(path)) {
      const n = Number(value);
      if (
        !text ||
        !Number.isFinite(n) ||
        (!path.endsWith("copyShiftDays") && n <= 0) ||
        Math.abs(n) > 3650
      )
        return "Enter a valid number within the supported range.";
    }
    return "";
  };
  WB.fieldErrors = {};
  WB.defineState = (key, value) => {
    WB.defaults[key] = clone(value);
    WB.state[key] = clone(value);
  };
  WB.reg = (id, title, role, render) => {
    WB.renderers[id] = { id, title, role, render };
  };
  WB.reset = () => {
    WB.state = clone(WB.defaults);
    WB.fieldErrors = {};
    WB.ui.actor = undefined;
  };
  WB.beginDraft = (s) => {
    if (s.submission.status === "received") {
      const old = clone(s.submission);
      delete old.history;
      s.submission.history = [...(s.submission.history || []), old];
      s.submission.attempt++;
    }
    s.submission.id =
      (s.assignment.id || "assignment") + "-aisha-" + s.submission.attempt;
    s.submission.status = "draft";
    s.assessment.graded = s.assessment.graded.filter((id) => id !== "aisha");
    if (s.assessment.reviewedQuestions)
      s.assessment.reviewedQuestions.aisha = [];
    if (s.teaching) s.teaching.releasePreview = false;
    s.assessment.released = s.assessment.released.filter(
      (id) => id !== "aisha",
    );
    if (s.assessment.releaseSnapshots)
      delete s.assessment.releaseSnapshots.aisha;
  };
  WB.set = (path, value) => {
    const keys = path.split(".");
    if (keys.some((x) => ["__proto__", "constructor", "prototype"].includes(x)))
      throw Error("Invalid field");
    if (
      (path.startsWith("assessment.comments.") ||
        path.startsWith("assessment.questionComments.") ||
        path === "assessment.aiDraft") &&
      WB.state.assessment.role === "ta" &&
      !WB.state.institution.taActive
    )
      return false;
    const actor = WB.ui.actor;
    if (
      path.startsWith("assessment.") &&
      actor &&
      !["instructor", "ta"].includes(actor)
    )
      return false;
    if (
      path.startsWith("assessment.") &&
      WB.state.assessment.conflict &&
      !path.endsWith("role")
    )
      return false;
    if (path.startsWith("assignment.") && WB.state.assignment.locked)
      return false;
    if (
      path.includes("releaseSnapshots") ||
      path.startsWith("assessment.marks") ||
      path.startsWith("institution.logs")
    )
      return false;
    if (
      actor &&
      ((path.startsWith("institution.") && !["admin", "it"].includes(actor)) ||
        ((path.startsWith("teaching.") || path.startsWith("assignment.")) &&
          !["instructor"].includes(actor)))
    )
      return false;
    if (
      path.startsWith("campus.eventDraft.") &&
      (!WB.state.campus?.draft.revisionOpen ||
        WB.state.campus.eventReview === "approved")
    )
      return false;
    const error = WB.validate(path, value);
    if (error) {
      WB.fieldErrors[path] = error;
      return false;
    }
    delete WB.fieldErrors[path];
    if (path.startsWith("submission.pages.")) WB.beginDraft(WB.state);
    let o = WB.state;
    for (const k of keys.slice(0, -1)) {
      if (!o[k] || typeof o[k] !== "object") o[k] = {};
      o = o[k];
    }
    o[keys.at(-1)] = value;
    if (
      path.startsWith("assessment.") &&
      WB.state.teaching &&
      !path.includes("releaseScope")
    )
      WB.state.teaching.releasePreview = false;
    if (WB.onFieldChange) WB.onFieldChange(WB.state, path, value);
    return true;
  };
  WB.score = (s, id = "aisha") =>
    (s.assessment.marks[id] || []).reduce((a, b) => a + Number(b), 0);
  WB.deadline = (value) => {
    const d = new Date(value + "Z");
    return Number.isNaN(d.getTime())
      ? "Date not set"
      : d.toLocaleString("en-US", {
          timeZone: "UTC",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }) + " ET";
  };
  WB.received = (s) =>
    s.people.filter(
      (p) => p.active && WB.submissionFor(s, p.id)?.status === "received",
    ).length;
  WB.audit = (s, action, actor) => {
    const d = WB.clock(s);
    s.institution.logs.unshift({
      action,
      time: d.toISOString(),
      actor:
        actor ||
        {
          instructor: "Dr. Diane Reyes",
          ta: "Maya Chen",
          student: "Aisha Rahman",
          admin: "Robin Bell · administrator",
          it: "Morgan Lee · institution IT",
          officer: "Priya Nair",
          registrar: "Avery Brooks",
          coordinator: "Marisol Vega",
        }[WB.ui.actor] ||
        "Dr. Diane Reyes",
    });
    s.institution.now = new Date(d.getTime() + 60000).toISOString();
  };
  WB.dispatch = (name, p = {}) => {
    if (!WB.actions[name]) throw Error("Unknown action: " + name);
    return WB.actions[name](WB.state, p) || {};
  };
  const attrs = (o) =>
    Object.entries(o)
      .map(
        ([k, v]) =>
          ` data-${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}="${e(v)}"`,
      )
      .join("");
  const paths = {
    book: "M4 4h6c2 0 2 2 2 2s0-2 2-2h6v16h-6c-2 0-2 1-2 1s0-1-2-1H4V4Zm8 2v15",
    check: "m5 12 4 4L19 6",
    arrow: "M4 12h16m-6-6 6 6-6 6",
    calendar: "M5 5h14v15H5zM8 3v4m8-4v4M5 10h14",
    grid: "M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z",
    clock: "M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
    people:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 3a4 4 0 0 1 0 8m7 10v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    shield: "m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6l8-3Zm-4 9 3 3 5-6",
    sun: "M12 3v2m0 14v2M3 12h2m14 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    menu: "M4 6h16M4 12h16M4 18h16",
    upload: "M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6",
    bell: "M6 9a6 6 0 0 1 12 0v6l2 2H4l2-2V9m4 12h4",
    pin: "M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 0 1 14 0Zm-5 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
    file: "M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6m-6 4h6",
  };
  const h = (WB.h = { e });
  h.icon = (name = "book") =>
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.book}"/></svg>`;
  h.btn = (label, action, data = {}, kind = "secondary") =>
    `<button id="${e(WB.prefix || "global")}-action-${++WB.controlCount}" type="button" class="button ${kind}" data-action="${e(action)}"${attrs(data)}>${e(label)}</button>`;
  h.go = (label, id, kind = "secondary") =>
    `<a class="button ${e(kind)}" href="#${e(id)}" data-open-screen="${e(id)}">${e(label)}</a>`;
  h.pill = (text, tone = "neutral") =>
    `<span class="pill ${e(tone)}">${e(text)}</span>`;
  h.head = (title, sub = "", tools = "") =>
    `<div class="screen-head"><div><p class="screen-crumb">Alder Hill College <span aria-hidden="true">/</span> Fall 2026</p><h3>${e(title)}</h3>${sub ? `<p>${e(sub)}</p>` : ""}</div>${tools ? `<div class="actions">${tools}</div>` : ""}</div>`;
  h.card = (title, body, cls = "") =>
    `<section class="card ${e(cls)}"><h4>${e(title)}</h4>${body}</section>`;
  h.row = (title, sub = "", tail = "") =>
    `<div class="item-row"><div><strong>${e(title)}</strong>${sub ? `<p>${e(sub)}</p>` : ""}</div>${tail ? `<div class="item-tail">${tail}</div>` : ""}</div>`;
  h.notice = (title, body = "", tone = "info") =>
    `<div class="notice ${e(tone)}"><strong>${e(title)}</strong>${body ? `<p>${e(body)}</p>` : ""}</div>`;
  h.stats = (items) =>
    `<div class="stats">${items.map(([value, label]) => `<div><b>${e(value)}</b><span>${e(label)}</span></div>`).join("")}</div>`;
  h.field = (label, path, value, type = "text") => {
    const id = WB.prefix + "-" + path.replace(/\W/g, "-");
    return `<label class="field" for="${id}"><span>${e(label)}</span><input id="${id}" name="${e(path)}" autocomplete="off" aria-describedby="${id}-error" type="${e(type)}" data-bind="${e(path)}" value="${e(value)}"><span class="field-error" id="${id}-error">${e(WB.fieldErrors[path] || "")}</span></label>`;
  };
  h.area = (label, path, value) => {
    const id = WB.prefix + "-" + path.replace(/\W/g, "-");
    return `<label class="field" for="${id}"><span>${e(label)}</span><textarea name="${e(path)}" autocomplete="off" id="${id}" aria-describedby="${id}-error" data-bind="${e(path)}" rows="3">${e(value)}</textarea><span class="field-error" id="${id}-error">${e(WB.fieldErrors[path] || "")}</span></label>`;
  };
  h.select = (label, path, value, options) => {
    const id = WB.prefix + "-" + path.replace(/\W/g, "-");
    return `<label class="field" for="${id}"><span>${e(label)}</span><select name="${e(path)}" id="${id}" data-bind="${e(path)}">${options
      .map((x) => {
        const [v, l] = Array.isArray(x) ? x : [x, x];
        return `<option value="${e(v)}"${String(v) === String(value) ? " selected" : ""}>${e(l)}</option>`;
      })
      .join("")}</select></label>`;
  };
  h.table = (caption, headers, rows) =>
    `<div class="table-scroll" role="region" aria-label="${e(caption)}" tabindex="0"><table><caption>${e(caption)}</caption><thead><tr>${headers.map((x) => `<th scope="col">${x}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((x) => `<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  h.tabs = (items, path, current) =>
    `<div class="segmented" role="group" aria-label="View">${items.map(([value, label]) => `<button type="button" data-action="set" data-path="${e(path)}" data-value="${e(value)}" aria-pressed="${String(current) === String(value)}">${e(label)}</button>`).join("")}</div>`;
  h.paper = (question = "3", rotation = 0, owner = "aisha", variant = 0) => {
    const q = String(question).split(",")[0].trim(),
      name =
        WB.state.people.find((p) => p.id === owner)?.name || "Aisha Rahman";
    const lines =
      q === "1a"
        ? [
            "Resolve the launch velocity.",
            "vx = 12 cos(35°) = 9.83 m/s",
            "vy = 12 sin(35°) = 6.88 m/s",
          ]
        : q === "1b"
          ? [
              "At the highest point: vy = 0.",
              "Acceleration remains −9.81 m/s².",
              "Gravity continues to act downward.",
            ]
          : q === "2"
            ? [
                "At equal starting and ending height:",
                "t = 2vy / g = 1.40 s",
                "Range = vx × t = 13.8 m",
              ]
            : q === "4"
              ? [
                  "Check the model and units.",
                  "No air resistance; g is constant.",
                  "x and y are measured in metres.",
                ]
              : [
                  "Choose upward as positive.",
                  "y(t) = h + v₀ sin(θ)t − ½gt²",
                  "Substitute the initial height, then solve.",
                ];
    const detail = variant ? "Work variant " + variant + " · " + name : name;
    return `<div class="paper-wrap"><div class="paper-stage"><svg class="work-paper" viewBox="0 0 480 390" role="img" aria-label="Sample work for ${e(name)}, question ${e(question)}; full transcription follows" style="transform:rotate(${Number(rotation) || 0}deg)"><rect width="480" height="390" rx="4" fill="#fff"/><g stroke="#d9e5ee">${Array.from({ length: 11 }, (_, i) => `<path d="M24 ${56 + i * 28}H456"/>`).join("")}</g><g fill="#283b67" font-family="cursive" font-size="18"><text x="45" y="42">${e(detail)}</text><text x="45" y="88">Question ${e(question)} · Kinematics</text>${lines.map((line, i) => `<text x="45" y="${150 + i * 65}">${e(line)}</text>`).join("")}</g></svg></div><details class="paper-text"><summary>Read full page text</summary><p>${e(name)} · Question ${e(question)}</p>${lines.map((x) => `<p>${e(x)}</p>`).join("")}</details><details class="paper-enlarge"><summary>Enlarge readable page</summary><div class="reading">${lines.map((x) => `<p>${e(x)}</p>`).join("")}</div></details></div>`;
  };
  WB.actorFor = (id, s = WB.state) => {
    const n = Number(id.slice(1));
    return n <= 13
      ? "student"
      : n <= 23
        ? id === "S17" && s.assessment.role === "ta"
          ? "ta"
          : "instructor"
        : n <= 25
          ? "registrar"
          : n === 26
            ? "requester"
            : n === 27
              ? "spaceapprover"
              : n <= 29
                ? "student"
                : n === 31
                  ? "eventapprover"
                  : n === 32
                    ? "operator"
                    : n <= 33
                      ? "officer"
                      : n === 34
                        ? "student"
                        : n <= 36
                          ? "coordinator"
                          : n === 37
                            ? "admin"
                            : "it";
  };
  WB.render = (id, state = WB.state) => {
    const entry = WB.renderers[id];
    if (!entry)
      return h.head("Workspace unavailable", "Choose another workspace.");
    const before = JSON.stringify(state),
      actor = WB.ui.actor;
    WB.ui.actor = WB.actorFor(id, state);
    WB.prefix = id;
    WB.controlCount = 0;
    try {
      const html = entry.render(state, h);
      if (JSON.stringify(state) !== before)
        throw Error("Renderer mutated state: " + id);
      return html;
    } finally {
      WB.ui.actor = actor;
    }
  };
  WB.actions.set = (s, p) => {
    WB.set(p.path, p.value);
    return {};
  };
})();
