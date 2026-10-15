(function () {
  "use strict";
  const WB = window.WB;
  const h = WB.h;
  const physicsSocietyRoster = [
    ["priya-nair", "Priya Nair", "President"],
    ["mateo-rivera", "Mateo Rivera", "Treasurer"],
    ["sofia-chen", "Sofia Chen", "Event coordinator"],
    ["ben-kowalski", "Ben Kowalski", "Member"],
    ["carmen-ortiz", "Carmen Ortiz", "Member"],
    ["daniel-park", "Daniel Park", "Member"],
    ["emily-nguyen", "Emily Nguyen", "Member"],
    ["faisal-haddad", "Faisal Haddad", "Member"],
    ["grace-liu", "Grace Liu", "Member"],
    ["hugo-silva", "Hugo Silva", "Member"],
    ["isabel-torres", "Isabel Torres", "Member"],
    ["jamal-carter", "Jamal Carter", "Member"],
    ["kai-williams", "Kai Williams", "Member"],
    ["leila-hassan", "Leila Hassan", "Member"],
    ["nora-johnson", "Nora Johnson", "Member"],
    ["olivia-bennett", "Olivia Bennett", "Member"],
    ["quinn-delgado", "Quinn Delgado", "Member"],
    ["ravi-shah", "Ravi Shah", "Member"],
    ["theo-martin", "Theo Martin", "Member"],
    ["uma-desai", "Uma Desai", "Member"],
    ["victor-santos", "Victor Santos", "Member"],
    ["willa-brooks", "Willa Brooks", "Member"],
    ["xavier-reed", "Xavier Reed", "Member"],
    ["yara-ali", "Yara Ali", "Member"],
  ].map(([id, name, role]) => ({ id, name, role, active: true }));
  const initialSyncedCheckins = Array.from(
    { length: 34 },
    (_, i) => `attendee-${i + 1}`,
  );
  const initialParticipation = {
    confirmed: [
      {
        id: "faisal-haddad",
        name: "Faisal Haddad",
        kind: "student",
        eligible: true,
      },
      { id: "grace-liu", name: "Grace Liu", kind: "student", eligible: true },
      {
        id: "guest-jules",
        name: "Jules Mercer",
        kind: "guest",
        eligible: true,
        sponsor: "Grace Liu",
      },
    ],
    otherConfirmed: 55,
    waitlist: [],
    nextOrder: 1,
    pass: null,
    lastOutcome: "No participation change yet",
  };

  WB.defineState("campus", {
    scheduleView: "timetable",
    scheduleApplied: false,
    meeting: {
      days: "Monday / Wednesday / Friday",
      time: "09:00",
      endTime: "09:50",
      room: "Hollis Hall 104",
    },
    proposal: {
      choice: "small-room",
      status: "draft",
      decision: "not reviewed",
      sourceStatus: "not sent",
      selectedTime: "09:00",
      selectedRoom: "Emery Hall 203",
      note: "Move PHYS 110 while Hollis Hall ventilation work is reviewed.",
    },
    roomSearch: {
      date: "Wednesday, 21 October 2026",
      dateKey: "2026-10-21",
      time: "17:30",
      endTime: "19:00",
      recurrence: "Weekly through 11 Nov",
      capacity: 60,
      selected: "hollis-104",
      attempt: "ready",
    },
    roomStatus: "confirmed",
    draftRoomStatus: "confirmed",
    roomRequest: {
      date: "Wednesday, 21 October 2026",
      dateKey: "2026-10-21",
      time: "17:30",
      endTime: "19:00",
      recurrence: "Weekly through 11 Nov",
      capacity: 60,
      room: "Hollis Hall 104",
      scope: "published",
      approval: "approved",
      confirmation: "confirmed",
      occurrence: "scheduled",
      occurrenceDate: "Wednesday, 28 October 2026",
      requestId: "AH-SP-2048",
      approvedFingerprint: "",
    },
    event: {
      title: "Physics After Dark: Motion in the Movies",
      date: "Wednesday, 21 October 2026",
      dateKey: "2026-10-21",
      startTime: "17:30",
      endTime: "19:00",
      time: "17:30–19:00",
      room: "Hollis Hall 104",
      capacity: 60,
      rsvps: 58,
      waitlist: 0,
      checkedIn: 34,
      version: 3,
      summary:
        "A student-led evening of demonstrations and scene analysis with Dr. Diane Reyes.",
    },
    eventPublished: true,
    eventReview: "approved",
    fundingStatus: "approved",
    eventDraft: {
      title: "Physics After Dark: Motion in the Movies",
      date: "Wednesday, 21 October 2026",
      dateKey: "2026-10-21",
      startTime: "17:30",
      endTime: "19:00",
      time: "17:30–19:00",
      room: "Hollis Hall 104",
      capacity: 60,
      summary:
        "A student-led evening of demonstrations and scene analysis with Dr. Diane Reyes.",
    },
    rsvp: "none",
    participation: initialParticipation,
    membership: "none",
    org: {
      recertified: true,
      rosterView: "summary",
      primaryContactId: "priya-nair",
      members: physicsSocietyRoster,
      tasks: [
        {
          id: "event-plan",
          title: "Physics After Dark event plan",
          assigneeId: "priya-nair",
          status: "open",
        },
      ],
      directory: [
        {
          id: "physics-society",
          name: "Physics Society",
          status: "current",
          contact: "Priya Nair",
          contactReachable: true,
        },
        {
          id: "robotics-collective",
          name: "Robotics Collective",
          status: "expired",
          contact: "Former officers",
          contactReachable: false,
          expiredOn: "30 Sep 2026",
          consequence:
            "Hidden from default discovery; room and funding requests are unavailable until recertified.",
          override:
            "Student Affairs may record a time-limited review exception with a reason.",
        },
      ],
    },
    draft: {
      lastEditor: "Priya Nair",
      saved: "15 Oct, 2:18 pm",
      revisionOpen: false,
      version: 3,
    },
    checkin: {
      syncedIds: initialSyncedCheckins,
      offlineIds: ["offline-ben", "offline-carmen"],
      duplicateId: "",
      lastEntry: "No new local entry",
    },
    transition: {
      incomingAssigned: false,
      checklistAccepted: false,
      complete: false,
      outgoingId: "priya-nair",
      incomingId: "nora-johnson",
      effectiveDate: "1 Nov 2026",
    },
    support: {
      selected: "Physics learning support",
      minimalShare: true,
      appointmentStatus: "not requested",
      appointmentShare: "",
      appointmentHistory: [],
    },
    referral: "draft",
    referralData: {
      service: "Learning Support Center",
      owner: "Unassigned",
      note: "Aisha asked for more practice applying vector components after the 12 Oct diagnostic quiz.",
      queueAge: "New",
      corrected: false,
      lastSavedNote:
        "Aisha asked for more practice applying vector components after the 12 Oct diagnostic quiz.",
      history: [],
    },
    validation: { room: {}, event: {}, referral: {} },
    supportCapacity: { learningCoordinators: 4, advisingSameDay: 0 },
    supportQueue: [
      {
        id: "ref-101",
        service: "Learning Support Center",
        status: "accepted",
        owner: "Marisol Vega",
      },
      {
        id: "ref-102",
        service: "Learning Support Center",
        status: "received",
        owner: "Unassigned",
      },
      {
        id: "ref-103",
        service: "Academic Advising",
        status: "in progress",
        owner: "Jordan Ellis",
      },
      {
        id: "ref-104",
        service: "Learning Support Center",
        status: "in progress",
        owner: "Devon Cole",
      },
    ],
  });

  const statusTone = (value) =>
    ({
      confirmed: "success",
      approved: "success",
      applied: "success",
      published: "success",
      accepted: "success",
      resolved: "success",
      member: "success",
      requested: "warning",
      submitted: "warning",
      pending: "warning",
      redirected: "warning",
      "in progress": "info",
      "needs revision": "error",
      returned: "error",
      cancelled: "neutral",
      draft: "neutral",
      waitlisted: "warning",
    })[String(value).toLowerCase()] || "neutral";
  const status = (value, label = value) => h.pill(label, statusTone(value));
  const fact = (title, sub, tail = "") => h.row(title, sub, tail);
  const safe = (v) => h.e(v);
  const capacityLabel = (used, total) => `${Number(used)} of ${Number(total)}`;
  const activeReferral = (campus) =>
    campus.supportQueue.find((item) => item.id === "ref-aisha");
  const activeRoomStatus = (campus) =>
    campus.roomRequest.scope === "revision"
      ? campus.draftRoomStatus
      : campus.roomStatus;
  const setActiveRoomStatus = (campus, value) => {
    if (campus.roomRequest.scope === "revision") campus.draftRoomStatus = value;
    else campus.roomStatus = value;
  };
  const actor = () => String(WB.ui?.actor || "").toLowerCase();
  const actorAllowed = (roles) =>
    !actor() ||
    roles.includes(actor()) ||
    roles.includes("any") ||
    (roles.includes("admin") && actor() === "it");
  const denied = (roles) =>
    actorAllowed(roles)
      ? null
      : {
          message:
            "This sample actor cannot make that change. Open the workspace for the named responsible role.",
        };
  const minutes = (value) => {
    const match = /^(\d{2}):(\d{2})$/.exec(String(value || ""));
    if (!match) return NaN;
    const hour = Number(match[1]),
      minute = Number(match[2]);
    return hour < 24 && minute < 60 ? hour * 60 + minute : NaN;
  };
  const validDate = (value) => {
    const text = String(value || "");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(text) ||
      text < "2026-08-01" ||
      text > "2027-07-31"
    )
      return false;
    const date = new Date(`${text}T12:00:00Z`);
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === text
    );
  };
  const displayDate = (value) =>
    validDate(value)
      ? new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", {
          timeZone: "UTC",
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : String(value || "");
  const fingerprint = (value) => JSON.stringify(value);
  const roomFingerprint = (room) =>
    fingerprint([
      room.dateKey,
      room.time,
      room.endTime,
      Number(room.capacity),
      room.room,
      room.recurrence,
    ]);
  const draftFingerprint = (draft) =>
    fingerprint([
      draft.title,
      draft.dateKey,
      draft.startTime,
      draft.endTime,
      draft.room,
      Number(draft.capacity),
      draft.summary,
    ]);
  const confirmedCount = (campus) =>
    Number(campus.participation.otherConfirmed || 0) +
    campus.participation.confirmed.length;
  const syncParticipation = (campus) => {
    campus.event.rsvps = confirmedCount(campus);
    campus.event.waitlist = campus.participation.waitlist.length;
  };
  const issuePass = (campus, person) => {
    if (person.id === "aisha")
      campus.participation.pass = {
        id: "AH-EVENT-021-AISHA",
        participantId: "aisha",
        status: "active",
      };
  };
  const promoteNext = (campus) => {
    const index = campus.participation.waitlist.findIndex(
      (item) => item.eligible,
    );
    if (index < 0) return null;
    const [person] = campus.participation.waitlist.splice(index, 1);
    campus.participation.confirmed.push({ ...person, order: undefined });
    if (person.id === "aisha") campus.rsvp = "confirmed";
    issuePass(campus, person);
    syncParticipation(campus);
    return person;
  };
  const fieldError = (label, path, value, type, error) => {
    const id = `${WB.prefix}-${path.replace(/\W/g, "-")}`,
      described = error
        ? ` aria-describedby="${id}-error" aria-invalid="true"`
        : "";
    return `<label class="field" for="${id}"><span>${safe(label)}</span><input id="${id}" name="${safe(path)}" autocomplete="off" type="${safe(type || "text")}" data-bind="${safe(path)}" value="${safe(value)}"${described}>${error ? `<span class="field-error" id="${id}-error">${safe(error)}</span>` : ""}</label>`;
  };
  const eventErrors = (campus, draft = campus.eventDraft) => {
    const errors = {},
      start = minutes(draft.startTime),
      end = minutes(draft.endTime),
      capacity = Number(draft.capacity);
    if (!String(draft.title || "").trim())
      errors.title = "Enter an event title.";
    else if (String(draft.title).length > 160)
      errors.title = "Use 160 characters or fewer.";
    if (!validDate(draft.dateKey)) errors.dateKey = "Enter a valid event date.";
    if (!Number.isFinite(start)) errors.startTime = "Enter a valid start time.";
    if (!Number.isFinite(end) || (Number.isFinite(start) && end <= start))
      errors.endTime = "End time must be later than start time.";
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 72)
      errors.capacity = "Choose a whole-number capacity from 1 to 72.";
    else if (capacity < confirmedCount(campus))
      errors.capacity = `Capacity cannot be below ${confirmedCount(campus)} confirmed attendees.`;
    if (!String(draft.summary || "").trim())
      errors.summary = "Enter a student-facing description.";
    else if (String(draft.summary).length > 500)
      errors.summary = "Use 500 characters or fewer.";
    return errors;
  };
  const roomErrors = (search) => {
    const errors = {},
      start = minutes(search.time),
      end = minutes(search.endTime),
      capacity = Number(search.capacity);
    if (!validDate(search.dateKey)) errors.dateKey = "Enter a valid date.";
    if (!Number.isFinite(start)) errors.time = "Enter a valid start time.";
    if (!Number.isFinite(end) || (Number.isFinite(start) && end <= start))
      errors.endTime = "End time must be later than start time.";
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 72)
      errors.capacity = "Choose a whole-number capacity from 1 to 72.";
    return errors;
  };
  const draftMatchesRoom = (campus) => {
    const draft = campus.eventDraft,
      room = campus.roomRequest;
    return (
      room.scope === "revision" &&
      String(draft.dateKey) === String(room.dateKey) &&
      minutes(draft.startTime) >= minutes(room.time) &&
      minutes(draft.endTime) <= minutes(room.endTime) &&
      Number(draft.capacity) <= Number(room.capacity) &&
      String(draft.room) === String(room.room)
    );
  };
  const addReferralHistory = (state, statusText, actorName, detail) => {
    const campus = state.campus;
    campus.referralData.history.push({
      status: statusText,
      service: campus.referralData.service,
      owner: campus.referralData.owner,
      actor: actorName,
      detail,
      time: WB.clock(state).toISOString(),
    });
    WB.audit(state, "Referral " + statusText + " · " + detail, actorName);
  };
  const syncReferralRecord = (campus) => {
    let record = activeReferral(campus);
    if (!record) {
      record = {
        id: "ref-aisha",
        service: campus.referralData.service,
        status: campus.referral,
        owner: campus.referralData.owner,
      };
      campus.supportQueue.push(record);
    }
    Object.assign(record, {
      service: campus.referralData.service,
      status: campus.referral,
      owner: campus.referralData.owner,
    });
  };

  WB.personalCampusEvent = (s) => {
    const c = s.campus;
    if (!c?.eventPublished || c.rsvp !== "confirmed") return null;
    return {
      id: "physics-after-dark",
      title: c.event.title,
      date: c.event.date,
      dateKey: c.event.dateKey,
      time: c.event.time,
      room: c.event.room,
      rsvp: c.rsvp,
      roomStatus: c.roomStatus,
      occurrence: c.roomRequest.occurrence,
      occurrenceDate: c.roomRequest.occurrenceDate,
      status:
        c.roomRequest.occurrence === "cancelled" &&
        c.roomRequest.occurrenceDate === c.event.date
          ? "cancelled"
          : c.roomStatus === "confirmed"
            ? "confirmed"
            : "room pending",
    };
  };
  WB.studentSupportStatus = (s) => {
    const c = s.campus;
    if (!c || c.referral === "draft") return null;
    const next =
      {
        received: "Waiting for a coordinator to accept the request.",
        redirected: `Waiting for ${c.referralData.service} to assign an owner.`,
        accepted: `${c.referralData.owner} will follow up.`,
        unassigned: "Waiting for an available coordinator.",
        resolved: "The request is complete; contact the service to reopen it.",
      }[c.referral] || "The request is being reviewed.";
    return {
      service: c.referralData.service,
      status: c.referral,
      owner: c.referralData.owner === "Unassigned" ? "" : c.referralData.owner,
      nextStep: next,
      note: c.referralData.lastSavedNote,
    };
  };
  WB.resetCampusJourney = (s, id) => {
    if (!s.campus || !WB.defaults.campus) return false;
    const d = WB.defaults.campus;
    if (id === "J4") {
      for (const key of [
        "roomSearch",
        "roomStatus",
        "draftRoomStatus",
        "roomRequest",
        "event",
        "eventPublished",
        "eventReview",
        "fundingStatus",
        "eventDraft",
        "rsvp",
        "participation",
        "membership",
        "org",
        "draft",
        "checkin",
        "transition",
        "validation",
      ])
        s.campus[key] = WB.clone(d[key]);
      return true;
    }
    if (id === "J5") {
      for (const key of [
        "support",
        "referral",
        "referralData",
        "supportCapacity",
        "supportQueue",
        "validation",
      ])
        s.campus[key] = WB.clone(d[key]);
      return true;
    }
    return false;
  };

  function timetable(s) {
    const c = s.campus;
    const physicsEnrollment = s.people.filter((person) => person.active).length;
    const totalEnrollment = physicsEnrollment + 31 + 24;
    const rows = [
      [
        "PHYS 110",
        "Introductory Mechanics",
        "Dr. Diane Reyes",
        `Mon / Wed / Fri · ${c.meeting.time}–${c.meeting.endTime}`,
        c.meeting.room,
        `${physicsEnrollment} / 72`,
        "Projector · demo bench · step-free route",
      ],
      [
        "MATH 220",
        "Linear Algebra",
        "Prof. Lena Foster",
        "Tue / Thu · 10:30–11:45",
        "Keene Center 212",
        "31 / 36",
        "Document camera · step-free route",
      ],
      [
        "WRIT 140",
        "Academic Writing",
        "Prof. Jonah Brooks",
        "Mon / Wed · 13:00–14:15",
        "Emery Hall 203",
        "24 / 30",
        "Movable tables · hearing loop nearby",
      ],
    ];
    const table = h.table(
      "Fall 2026 academic sections",
      [
        "Section",
        "Course",
        "Faculty",
        "Meeting",
        "Room",
        "Enrolled / seats",
        "Operational criteria",
      ],
      rows.map((row) => row.map(safe)),
    );
    const list = rows
      .map((row) =>
        h.card(
          `${row[0]} · ${row[1]}`,
          `${fact(row[3], `${row[2]} · ${row[4]}`, status(row[5].split(" / ")[0] === row[5].split(" / ")[1] ? "full" : "available", row[5]))}<p class="muted small">${safe(row[6])}</p>`,
          "room-card",
        ),
      )
      .join("");
    return (
      h.head(
        "Academic timetable",
        "Registrar workspace · authoritative snapshot received 15 Oct, 8:05 am",
        h.btn(
          c.scheduleView === "timetable"
            ? "Show readable list"
            : "Show timetable",
          "campus-timetable-view",
          { view: c.scheduleView === "timetable" ? "list" : "timetable" },
        ),
      ) +
      h.notice(
        "Draft workspace",
        "Edits here remain proposals until reviewed and applied to the scheduling source.",
        "info",
      ) +
      h.stats([
        ["3", "sections"],
        [totalEnrollment, "enrolled seats"],
        [c.proposal.status === "applied" ? "0" : "1", "open change"],
      ]) +
      (c.scheduleView === "timetable"
        ? table
        : `<div class="stack">${list}</div>`) +
      h.card(
        "Open change",
        fact(
          "PHYS 110 room review",
          `${safe(c.proposal.selectedRoom)} · ${safe(c.proposal.selectedTime)} · ${safe(c.proposal.status)}`,
          h.go("Review change", "S25", "primary"),
        ) +
          `<p class="muted small">Source: registrar schedule snapshot. Accessibility criteria describe the route and room, not a person.</p>`,
      )
    );
  }

  function scheduleReview(s) {
    const p = s.campus.proposal;
    const meeting = s.campus.meeting;
    const physicsEnrollment = s.people.filter((person) => person.active).length;
    const small = p.choice === "small-room";
    const proposed = small
      ? "Emery Hall 203 · M/W/F 9:00"
      : "Hollis Hall 104 · M/W/F 10:00";
    const conflict = small
      ? `Hard conflict: ${physicsEnrollment} enrolled students exceed 30 seats.`
      : `No hard conflicts in the 15 Oct snapshot. Dr. Reyes and all ${physicsEnrollment} enrolled students are free.`;
    const canSubmit =
      !small && (p.status === "draft" || p.status === "needs revision");
    return (
      h.head(
        "Review schedule change",
        "PHYS 110 · registrar decision workspace",
        h.go("Back to timetable", "S24"),
      ) +
      `<div class="columns"><div class="stack">` +
      h.card(
        "Current authoritative meeting",
        fact(
          meeting.room,
          `${meeting.days} · ${meeting.time}–${meeting.endTime}`,
          status("confirmed"),
        ) +
          `<p class="muted small">Registrar schedule · received 15 Oct, 8:05 am</p>`,
      ) +
      h.card(
        "Proposed meeting",
        fact(proposed, p.note, status(p.status)) +
          `<div class="actions">${h.btn("Try smaller room", "campus-select-proposal", { choice: "small-room" })}${h.btn("Use feasible 10:00 option", "campus-select-proposal", { choice: "available" }, "primary")}</div>`,
      ) +
      h.notice(
        small ? "Change blocked" : "Feasible option",
        conflict,
        small ? "error" : "success",
      ) +
      `</div><div class="stack">` +
      h.card(
        "Decision and authority",
        fact("Department request", p.status, status(p.status)) +
          fact("Registrar approval", p.decision, status(p.decision)) +
          fact("Scheduling source", p.sourceStatus, status(p.sourceStatus)) +
          `<div class="actions">${canSubmit ? h.btn("Submit feasible change", "campus-submit-schedule", {}, "primary") : ""}${p.status === "submitted" && p.decision !== "approved" ? h.btn("Approve change", "campus-approve-schedule", {}, "primary") : ""}${p.decision === "approved" && p.sourceStatus !== "applied" ? h.btn("Apply to source copy", "campus-apply-schedule", {}, "primary") : ""}</div>`,
      ) +
      h.card(
        "Affected work",
        fact(
          `${physicsEnrollment} students`,
          "Calendar moves only after source application.",
        ) +
          fact(
            "Dr. Diane Reyes",
            "Faculty availability checked against the same snapshot.",
          ) +
          fact(
            meeting.room,
            `Existing ${meeting.time} occurrence releases only after source application.`,
          ),
      ) +
      `</div></div>`
    );
  }

  function roomFinder(s) {
    const c = s.campus;
    const search = c.roomSearch;
    const errors = c.validation.room || {};
    const conflict = search.time === "15:30";
    const requestedCapacity = Number(search.capacity) || 0;
    const rooms = [
      [
        "Hollis Hall 104",
        "72",
        "Projector, demo bench, assisted listening",
        "Step-free north entrance",
        conflict
          ? "Conflict · PHYS 110 lab until 16:20"
          : requestedCapacity > 72
            ? `Too small for ${requestedCapacity}`
            : "Available",
      ],
      [
        "Kendall Hall 210",
        "40",
        "Projector",
        "Step-free west entrance",
        requestedCapacity > 40
          ? `Too small for ${requestedCapacity}`
          : "Equipment mismatch",
      ],
      [
        "Emery Hall 203",
        "55",
        "Projector, movable tables",
        "Step-free main entrance",
        requestedCapacity > 55
          ? `Too small for ${requestedCapacity}`
          : "Equipment mismatch",
      ],
    ];
    return (
      h.head(
        "Find a room",
        "Permitted requester · Physics Society",
        h.go("Open request", "S27"),
      ) +
      h.card(
        "Event requirements",
        `<div class="form-grid">${fieldError("Date", "campus.roomSearch.dateKey", search.dateKey, "date", errors.dateKey)}${h.select(
          "Start time",
          "campus.roomSearch.time",
          search.time,
          [
            ["17:30", "5:30 pm · preferred"],
            ["15:30", "3:30 pm · conflict"],
          ],
        )}${fieldError("End time", "campus.roomSearch.endTime", search.endTime, "time", errors.endTime)}${fieldError("Seats", "campus.roomSearch.capacity", search.capacity, "number", errors.capacity)}${h.select("Recurrence", "campus.roomSearch.recurrence", search.recurrence, ["One time", "Weekly through 11 Nov"])}</div>` +
          `<p class="muted small">Required: projector, demonstration bench, assisted listening, and a step-free route.</p><div class="actions">${h.btn("Check selected time", "campus-check-room-time")}${h.btn("Request Hollis 104", "campus-request-room", { room: "hollis-104" }, "primary")}</div>`,
      ) +
      (Object.keys(errors).length
        ? h.notice("Fix the room request", Object.values(errors)[0], "error")
        : "") +
      (conflict
        ? h.notice(
            "3:30 pm is unavailable",
            "PHYS 110 lab occupies Hollis Hall 104 until 4:20 pm. Choose 5:30 pm to continue.",
            "error",
          )
        : requestedCapacity > 72
          ? h.notice(
              "Capacity requirement is too large",
              `Hollis Hall 104 seats 72; the request asks for ${requestedCapacity}.`,
              "error",
            )
          : h.notice(
              "5:30 pm is available",
              "No conflicting reservation appears in the room snapshot.",
              "success",
            )) +
      h.table(
        "Room availability from the facilities schedule, refreshed 15 Oct at 2:10 pm",
        ["Room", "Seats", "Equipment", "Accessible route", "Result"],
        rooms.map((r) =>
          r.map((v, i) =>
            i === 4
              ? status(v.includes("Available") ? "available" : "blocked", v)
              : safe(v),
          ),
        ),
      ) +
      `<p class="muted small">Availability is scheduled use from the facilities source; it is not measured occupancy.</p>`
    );
  }

  function reservation(s) {
    const c = s.campus;
    const rr = c.roomRequest;
    const roomState = activeRoomStatus(c);
    return (
      h.head(
        "Room request",
        "Physics Society · AH-SP-2048",
        h.go("Find another room", "S26"),
      ) +
      h.notice(
        "Authority is explicit",
        "A submitted request, campus approval, and facilities confirmation are separate states.",
        "info",
      ) +
      `<div class="columns"><div class="stack">` +
      h.card(
        "Requested series",
        fact(
          rr.room,
          `${rr.date} · ${rr.time}–${rr.endTime} · ${rr.recurrence}`,
          status(roomState),
        ) +
          fact(
            "Capacity and access",
            `${rr.capacity} attendees · projector · assisted listening · step-free route`,
          ) +
          `<div class="actions">${roomState === "draft" || roomState === "returned" ? h.btn("Submit room request", "campus-request-room", { room: "hollis-104", source: rr.scope === "revision" ? "event-draft" : "" }, "primary") : ""}${roomState === "requested" ? h.btn("Return for revision", "campus-return-room", {}, "danger") : ""}</div>`,
      ) +
      h.card(
        rr.occurrenceDate,
        fact(
          rr.occurrence === "cancelled"
            ? "Cancelled"
            : `${rr.time}–${rr.endTime}`,
          rr.occurrence === "cancelled"
            ? "Only this occurrence is cancelled; the series remains confirmed."
            : "Part of the confirmed weekly series.",
          status(rr.occurrence),
        ) +
          `<div class="actions">${roomState === "confirmed" ? h.btn(rr.occurrence === "cancelled" ? "Restore occurrence" : "Cancel this occurrence", "campus-toggle-occurrence", {}, rr.occurrence === "cancelled" ? "secondary" : "danger") : ""}</div>`,
      ) +
      `</div><div class="stack">` +
      h.card(
        "Confirmation timeline",
        fact(
          "1 · Requester submitted",
          roomState === "draft" ? "Not submitted" : "15 Oct · Priya Nair",
          status(roomState === "draft" ? "draft" : "submitted"),
        ) +
          fact("2 · Campus space approval", rr.approval, status(rr.approval)) +
          fact(
            "3 · Facilities source acknowledgment",
            rr.confirmation,
            status(rr.confirmation),
          ) +
          `<div class="actions">${roomState === "requested" ? h.btn("Approve request", "campus-approve-room", {}, "primary") : ""}${roomState === "approved" ? h.btn("Record source confirmation", "campus-confirm-room", {}, "primary") : ""}</div>`,
      ) +
      h.card(
        "Source record",
        fact(
          rr.requestId,
          "Facilities scheduling copy · refreshed 15 Oct, 2:10 pm",
        ) +
          `<p class="muted small">The showcase records a local scenario transition; it does not contact a room system.</p>`,
      ) +
      `</div></div>`
    );
  }

  function eventDiscovery(s) {
    const c = s.campus;
    const e = c.event;
    const spots = Math.max(0, Number(e.capacity) - confirmedCount(c));
    const waitlist = c.participation.waitlist;
    const rsvpLabel =
      c.rsvp === "confirmed"
        ? "Cancel RSVP"
        : c.rsvp === "waitlisted"
          ? "Leave waitlist"
          : "RSVP";
    return (
      h.head(
        "Campus events",
        "Student discovery · Wednesday, 21 October",
        h.go("Physics Society profile", "S29"),
      ) +
      (!c.eventPublished
        ? h.notice(
            "This revision is not published",
            "Students cannot RSVP until the revised dependencies are complete; this staff preview remains visible for review.",
            "warning",
          )
        : "") +
      `<div class="columns wide-left"><div class="stack">` +
      h.card(
        e.title,
        `<p>${safe(e.summary)}</p>${fact(`${e.date} · ${e.time}`, e.room, status(c.eventPublished ? "published" : "draft"))}${fact("Physics Society", `Current Fall 2026 organization · contact ${c.org.directory[0].contact}`)}${fact(`${spots} places remaining`, `${capacityLabel(confirmedCount(c), e.capacity)} RSVPs · ${waitlist.length} on waitlist`, status(spots ? "available" : "waitlisted"))}` +
          `<div class="actions">${c.eventPublished ? h.btn(rsvpLabel, "campus-rsvp", {}, c.rsvp === "confirmed" ? "secondary" : "primary") : h.go("Review dependencies", "S31", "primary")}${spots ? h.btn("Preview full capacity", "campus-fill-event") : ""}</div>`,
        "event-card",
      ) +
      h.card(
        "Access information",
        fact(
          "Step-free route",
          "Use the north entrance; lift access to level 1.",
        ) +
          fact(
            "Listening support",
            "Assisted-listening receivers available at the welcome table.",
          ) +
          fact(
            "Questions",
            "Contact the Physics Society event team through this sample workspace.",
          ),
      ) +
      `</div><div class="stack">` +
      h.card(
        "Your event status",
        c.rsvp === "none"
          ? h.notice(
              "No RSVP yet",
              "Reserve a place to add this event to the sample calendar.",
              "info",
            )
          : fact(
              c.rsvp === "confirmed"
                ? "Place reserved"
                : `Waitlist position ${waitlist.findIndex((item) => item.id === "aisha") + 1}`,
              c.rsvp === "confirmed"
                ? "A local sample pass is available in attendance; it is not a secure credential."
                : "Promotion follows the displayed eligible order.",
              status(c.rsvp),
            ) +
              (c.rsvp === "waitlisted"
                ? `<div class="actions">${h.btn("Simulate next cancellation", "campus-release-seat", {}, "primary")}</div>`
                : ""),
      ) +
      h.card(
        "Waitlist order",
        waitlist.length
          ? waitlist
              .map((item, index) =>
                fact(
                  `${index + 1} · ${item.name}`,
                  item.eligible
                    ? `${item.kind} · eligible for the next place`
                    : `${item.kind} · eligibility needs review`,
                  status(item.eligible ? "confirmed" : "warning"),
                ),
              )
              .join("")
          : h.notice(
              "No one is waiting",
              "The ordered waitlist is empty.",
              "info",
            ),
      ) +
      h.card(
        "Also this week",
        fact(
          "Community telescope night",
          "Thu 22 Oct · 7:00 pm · Alder Quad",
          status("available"),
        ) +
          fact(
            "Study skills workshop",
            "Fri 23 Oct · 1:00 pm · Learning Commons",
            status("available"),
          ),
      ) +
      `</div></div>`
    );
  }

  function organization(s) {
    const c = s.campus;
    const activeMembers = c.org.members.filter((member) => member.active);
    const contact = c.org.members.find(
      (member) => member.id === c.org.primaryContactId,
    );
    const inactive = c.org.directory.find((item) => item.status === "expired");
    return (
      h.head(
        "Physics Society",
        "Current organization profile · Fall 2026",
        h.go("Plan an event", "S30", "primary"),
      ) +
      `<div class="columns"><div class="stack">` +
      h.card(
        "Verified profile",
        fact(
          "Recertified 28 Aug 2026",
          "Current through Fall 2026",
          status(c.org.recertified ? "confirmed" : "expired"),
        ) +
          fact(
            "Primary contact",
            `${contact?.name || "Unassigned"} · ${contact?.role || "No current role"}`,
          ) +
          fact("Faculty adviser", "Dr. Diane Reyes") +
          `<p>Weekly demonstrations, study sessions, and conversations about physics in everyday life.</p>`,
      ) +
      h.card(
        "Membership",
        fact(
          c.membership === "none"
            ? "Not a member"
            : c.membership === "requested"
              ? "Request awaiting officer review"
              : "Active member",
          "Organization membership is separate from event RSVPs.",
          status(c.membership),
        ) +
          `<div class="actions">${c.membership === "none" ? h.btn("Request membership", "campus-request-membership", {}, "primary") : ""}</div>`,
      ) +
      `</div><div class="stack">` +
      h.card(
        "Roster and roles",
        c.org.members
          .filter((member) => member.role !== "Member")
          .map((member) =>
            fact(
              member.name,
              `${member.role}${member.roleEnded ? ` · ended ${member.roleEnded}` : " · current"}`,
            ),
          )
          .join("") +
          fact(
            `${activeMembers.length} current members`,
            "Members see the term roster; student contact details stay private.",
          ),
      ) +
      h.card(
        "Activity",
        fact(
          c.event.title,
          `${c.event.date} · ${c.event.time}`,
          h.go("View event", "S28"),
        ) +
          fact(
            inactive.name,
            `No current reachable contact. ${inactive.consequence} ${inactive.override}`,
            status("inactive"),
          ),
      ) +
      `</div></div>`
    );
  }

  function eventComposer(s) {
    const c = s.campus;
    const published = c.event;
    const draft = c.eventDraft;
    const editable = c.draft.revisionOpen && c.eventReview !== "approved";
    const errors = c.validation.event || {};
    const capacityShortfall = Number(draft.capacity) < confirmedCount(c);
    const responsible = c.org.members.find(
      (member) => member.id === c.org.primaryContactId,
    );
    return (
      h.head(
        "Collaborative event draft",
        "Owned by Physics Society · editors work from the same organization record",
        h.go("Approval workspace", "S31"),
      ) +
      h.notice(
        c.draft.revisionOpen ? "Revision in progress" : "Published version",
        c.draft.revisionOpen
          ? "Draft changes stay separate while students continue to see the approved event."
          : "Start a revision before changing published details.",
        c.draft.revisionOpen ? "warning" : "success",
      ) +
      `<div class="columns wide-left"><div class="stack">` +
      h.card(
        "Program details",
        editable
          ? `<div class="form-grid">${fieldError("Event title", "campus.eventDraft.title", draft.title, "text", errors.title)}${fieldError("Date", "campus.eventDraft.dateKey", draft.dateKey, "date", errors.dateKey)}${fieldError("Start time", "campus.eventDraft.startTime", draft.startTime, "time", errors.startTime)}${fieldError("End time", "campus.eventDraft.endTime", draft.endTime, "time", errors.endTime)}${fieldError("Capacity", "campus.eventDraft.capacity", draft.capacity, "number", errors.capacity)}</div>${h.area("Student-facing description", "campus.eventDraft.summary", draft.summary)}${errors.summary ? h.notice("Description needs attention", errors.summary, "error") : ""}${capacityShortfall ? h.notice("Confirmed places must be honored", `${confirmedCount(c)} people already hold places. Keep at least that capacity or resolve commitments in the responsible attendance workflow.`, "error") : ""}<div class="actions">${h.btn("Save organization draft", "campus-save-event", {}, "primary")}${capacityShortfall ? h.btn(`Keep ${confirmedCount(c)} confirmed places`, "campus-preserve-commitments") : ""}</div>`
          : c.draft.revisionOpen
            ? `${fact(draft.title, `${draft.date} · ${draft.time}`, status("approved"))}<p>${safe(draft.summary)}</p><p class="muted small">This approved revision is read-only until publication.</p>`
            : `${fact(published.title, `${published.date} · ${published.time}`, status("published"))}<p>${safe(published.summary)}</p><div class="actions">${h.btn("Start a revision", "campus-start-event-revision", {}, "primary")}</div>`,
      ) +
      h.card(
        "Shared ownership",
        fact(
          "Physics Society",
          "The organization owns this draft; it does not depend on one creator account.",
        ) +
          fact(
            responsible?.name || "Unassigned",
            "Responsible officer · primary contact",
          ) +
          fact(c.draft.lastEditor, "Last saved by") +
          fact(
            c.draft.revisionOpen ? "Draft version" : "Published version",
            `${c.draft.revisionOpen ? c.draft.version : published.version} · saved ${c.draft.saved}`,
          ),
      ) +
      `</div><div class="stack">` +
      h.card(
        "Dependencies",
        fact("Room", c.draftRoomStatus, status(c.draftRoomStatus)) +
          fact("Funding request", c.fundingStatus, status(c.fundingStatus)) +
          fact("Event review", c.eventReview, status(c.eventReview)) +
          `<div class="actions">${c.draft.revisionOpen && c.draftRoomStatus === "draft" ? h.btn("Create room request", "campus-request-room", { room: "hollis-104", source: "event-draft" }) : ""}${c.draft.revisionOpen && c.fundingStatus === "draft" ? h.btn("Request $180 program funds", "campus-request-funding") : ""}</div>`,
      ) +
      h.card(
        "Responsibility",
        fact("Room confirmation", "Campus Space Management") +
          fact("Program funds", "Student Affairs budget reviewer") +
          fact("Publication", "Student Affairs event reviewer") +
          `<p class="muted small">Funding here is a request status. No payment or finance ledger is represented.</p>`,
      ) +
      `</div></div>`
    );
  }

  function approval(s) {
    const c = s.campus;
    const depsReady =
      c.draftRoomStatus === "confirmed" && c.fundingStatus === "approved";
    const errors = eventErrors(c);
    return (
      h.head(
        "Event approval",
        "Student Affairs · Physics After Dark",
        h.go("Edit draft", "S30"),
      ) +
      h.notice(
        depsReady && !Object.keys(errors).length
          ? "Dependencies complete"
          : "Publication blocked",
        depsReady && !Object.keys(errors).length
          ? "Room authority and funding reviewer have each confirmed their part."
          : Object.values(errors)[0] ||
              "The room and funding requests keep their own authority and status.",
        depsReady && !Object.keys(errors).length ? "success" : "warning",
      ) +
      `<div class="columns"><div class="stack">` +
      h.card(
        "Dependency owners",
        fact(
          "Room · Campus Space Management",
          c.draftRoomStatus,
          status(c.draftRoomStatus),
        ) +
          fact(
            "Funds · Elena Torres, Student Affairs",
            c.fundingStatus,
            status(c.fundingStatus),
          ) +
          fact(
            "Event · Marcus Lee, Student Affairs",
            c.eventReview,
            status(c.eventReview),
          ) +
          `<div class="actions">${c.draftRoomStatus === "requested" ? h.btn("Approve room", "campus-approve-room") : ""}${c.draftRoomStatus === "approved" ? h.btn("Record room confirmation", "campus-confirm-room") : ""}${c.fundingStatus === "requested" ? h.btn("Approve funding request", "campus-approve-funding") : ""}</div>`,
      ) +
      h.card(
        "Reviewer note",
        fact(
          c.eventReview === "returned"
            ? "Returned: clarify demonstration supervision"
            : "Program plan",
          "Demonstrations are supervised by Dr. Reyes; step-free access and listening support are listed.",
        ) +
          `<div class="actions">${c.draft.revisionOpen ? (c.eventReview !== "returned" ? h.btn("Return with reason", "campus-return-event", {}, "danger") : h.btn("Submit clarified plan", "campus-resubmit-event")) : ""}</div>`,
      ) +
      `</div><div class="stack">` +
      h.card(
        "Publication",
        fact(
          c.eventPublished
            ? "Approved event is published"
            : "No published event",
          c.draft.revisionOpen
            ? "Students still see the approved version; the revision is not published."
            : "Students can discover and RSVP to this version.",
          status(c.eventPublished ? "published" : "draft"),
        ) +
          `<div class="actions">${c.draft.revisionOpen && depsReady && c.eventReview !== "approved" ? h.btn("Approve event", "campus-approve-event", {}, "primary") : ""}${c.draft.revisionOpen && depsReady && c.eventReview === "approved" ? h.btn("Publish approved revision", "campus-publish-event", {}, "primary") : ""}</div>`,
      ) +
      h.card(
        "Decision history",
        fact("14 Oct · program submitted", "Priya Nair, Physics Society") +
          fact(
            "15 Oct · room response",
            c.draftRoomStatus === "confirmed"
              ? "Facilities source acknowledged AH-SP-2048."
              : "Awaiting authoritative acknowledgment.",
          ) +
          fact(
            "15 Oct · funding response",
            c.fundingStatus === "approved"
              ? "Approved request for up to $180."
              : "Awaiting Student Affairs reviewer.",
          ),
      ) +
      `</div></div>`
    );
  }

  function attendance(s) {
    const c = s.campus;
    const ci = c.checkin;
    const synced = ci.syncedIds.length;
    const pending = ci.offlineIds.length;
    const total = synced + pending;
    const pass = c.participation.pass;
    const attendee = c.participation.confirmed.find(
      (item) => item.id === "aisha",
    );
    const guest = c.participation.confirmed.find(
      (item) => item.kind === "guest" && item.eligible,
    );
    return (
      h.head(
        "Event attendance",
        "Operator view · Physics After Dark",
        h.go("Event listing", "S28"),
      ) +
      h.stats([
        [total, "recorded check-ins"],
        [pending, "on this device"],
        [ci.duplicateId ? "1" : "0", "duplicate flagged"],
      ]) +
      `<div class="columns"><div class="stack">` +
      h.card(
        "Student pass",
        c.rsvp === "confirmed" && pass
          ? fact(
              "Aisha Rahman",
              `${pass.id} · ${pass.status} · ${c.event.date}`,
              status(pass.status),
            ) +
              `<p class="muted small">This readable local sample identifies the participant record; it is not a secure or signed credential.</p>`
          : h.notice(
              "No active pass",
              "A confirmed RSVP creates the local sample pass.",
              "warning",
            ),
      ) +
      h.card(
        "Operator entry",
        fact(
          "Last local result",
          ci.lastEntry,
          status(ci.duplicateId ? "duplicate" : "recorded"),
        ) +
          `<div class="actions">${h.btn(ci.syncedIds.includes("aisha") || ci.offlineIds.includes("aisha") ? "Try duplicate" : "Record Aisha locally", "campus-checkin", { person: "aisha" }, ci.syncedIds.includes("aisha") || ci.offlineIds.includes("aisha") ? "secondary" : "primary")}${guest ? h.btn(`Record guest · ${guest.name}`, "campus-checkin", { person: guest.id }) : ""}${h.btn("Try ineligible walk-in", "campus-checkin", { person: "walk-in-riley" }, "quiet")}</div>`,
      ) +
      `</div><div class="stack">` +
      h.card(
        "Offline queue",
        fact(
          `${pending} pending records`,
          "Stored in this local scenario until the operator reconciles.",
          status(pending ? "pending" : "resolved"),
        ) +
          `<div class="actions">${pending ? h.btn("Reconcile local queue", "campus-sync-checkins", {}, "primary") : ""}</div>`,
      ) +
      h.card(
        "Count integrity",
        fact(
          "Confirmed attendance",
          `${synced} reconciled + ${pending} pending`,
        ) +
          fact(
            "Eligibility",
            attendee
              ? "Aisha has a confirmed student record."
              : "Aisha needs a confirmed RSVP before check-in.",
          ) +
          fact(
            "Duplicate handling",
            ci.duplicateId
              ? "A repeated stable participant ID was held out of the count."
              : "No unresolved duplicate.",
          ) +
          `<p class="muted small">Attendance is visible only to the scoped event operator in this concept.</p>`,
      ) +
      `</div></div>`
    );
  }

  function transition(s) {
    const c = s.campus;
    const t = c.transition;
    const activeMembers = c.org.members.filter(
      (member) => member.active,
    ).length;
    const eventTitle = c.draft.revisionOpen
      ? c.eventDraft.title
      : c.event.title;
    const eventVersion = c.draft.revisionOpen
      ? c.draft.version
      : c.event.version;
    const outgoing = c.org.members.find((member) => member.id === t.outgoingId);
    const incoming = c.org.members.find((member) => member.id === t.incomingId);
    const task = c.org.tasks[0];
    return (
      h.head("Officer transition", "Physics Society · Fall 2026 handoff") +
      h.notice(
        t.complete ? "Handoff complete" : "Handoff in progress",
        t.complete
          ? "The role, open work, and shared files now belong to the incoming officer scope."
          : "Outstanding work remains owned by the organization throughout the transition.",
        t.complete ? "success" : "warning",
      ) +
      `<div class="columns"><div class="stack">` +
      h.card(
        "Role change",
        fact(
          "Outgoing president",
          `${outgoing?.name || "Priya Nair"} · role ends ${t.effectiveDate}`,
        ) +
          fact(
            "Incoming president",
            `${incoming?.name || "Nora Johnson"} · ${t.incomingAssigned ? "assigned" : "awaiting assignment"}`,
            status(t.incomingAssigned ? "confirmed" : "pending"),
          ) +
          `<div class="actions">${!t.incomingAssigned ? h.btn("Assign incoming role", "campus-assign-officer", {}, "primary") : ""}</div>`,
      ) +
      h.card(
        "Term recertification",
        fact(
          "Profile contact",
          t.complete ? "Updated for the new term" : "Review by 1 Nov",
          status(c.org.recertified ? "confirmed" : "pending"),
        ) +
          fact("Faculty adviser", "Dr. Diane Reyes · confirmed") +
          fact(
            "Roster",
            `${activeMembers} active · ${c.org.members.filter((member) => member.role !== "Member").length} officer roles`,
          ),
      ) +
      `</div><div class="stack">` +
      h.card(
        "Open work",
        fact(
          eventTitle,
          `Organization ${c.draft.revisionOpen ? "draft" : "event"} version ${eventVersion}`,
        ) +
          fact(
            task.title,
            `Assigned to ${c.org.members.find((member) => member.id === task.assigneeId)?.name || "Unassigned"}`,
          ) +
          fact(
            "Room record",
            `${c.roomRequest.requestId} · ${c.draft.revisionOpen ? c.draftRoomStatus : c.roomStatus}`,
          ) +
          fact("Funding request", c.fundingStatus, status(c.fundingStatus)),
      ) +
      h.card(
        "Shared materials",
        fact("Event runbook", "Updated 14 Oct · organization file") +
          fact(
            "Demonstration safety checklist",
            "Updated 12 Oct · organization file",
          ) +
          `<div class="actions">${t.incomingAssigned && !t.checklistAccepted ? h.btn("Accept transition checklist", "campus-accept-transition", {}, "primary") : ""}${t.checklistAccepted && !t.complete ? h.btn("Complete handoff", "campus-complete-transition", {}, "primary") : ""}</div>`,
      ) +
      `</div></div>`
    );
  }

  function supportDirectory(s) {
    const c = s.campus;
    const sup = c.support;
    const selected = sup.selected;
    const choosing = sup.appointmentStatus === "not requested";
    const referral = WB.studentSupportStatus(s);
    return (
      h.head(
        "Get support",
        "Student directory · configured for Alder Hill College",
        h.go("View follow-through", "S36"),
      ) +
      `<div class="columns wide-left"><div class="stack">` +
      h.card(
        "Available services",
        fact(
          "Physics learning support",
          "Current PHYS 110 students · appointments and drop-in",
          selected === "Physics learning support"
            ? status("selected")
            : choosing
              ? h.btn("Choose", "campus-select-support", {
                  service: "Physics learning support",
                })
              : "",
        ) +
          fact(
            "Academic advising",
            "Assigned students · appointment request",
            selected === "Academic advising"
              ? status("selected")
              : choosing
                ? h.btn("Choose", "campus-select-support", {
                    service: "Academic advising",
                  })
                : "",
          ) +
          fact(
            "Writing center",
            "All enrolled students · appointments and drop-in",
            selected === "Writing center"
              ? status("selected")
              : choosing
                ? h.btn("Choose", "campus-select-support", {
                    service: "Writing center",
                  })
                : "",
          ),
      ) +
      h.card(
        "Appointment request",
        fact(
          selected,
          selected === "Physics learning support"
            ? "Requested time: Tue 20 Oct · 3:00 pm · Learning Commons 214"
            : "Requested time: Thu 22 Oct · 11:00 am · Student Center 118",
          status(sup.appointmentStatus),
        ) +
          (sup.appointmentStatus === "requested"
            ? `<p class="muted small">Captured sharing: ${safe(sup.appointmentShare)}</p>`
            : "") +
          `<div class="actions">${sup.appointmentStatus === "not requested" ? h.btn("Request this appointment", "campus-request-appointment", {}, "primary") : h.btn("Cancel request", "campus-cancel-appointment", {}, "danger")}</div>`,
      ) +
      h.card(
        "Your referral",
        referral
          ? fact(
              referral.service,
              `${referral.status}${referral.owner ? ` · ${referral.owner}` : ""}`,
              status(referral.status),
            ) +
              h.notice(
                "Next step",
                referral.nextStep,
                referral.status === "resolved" ? "success" : "info",
              ) +
              fact("Saved context", referral.note)
          : h.notice(
              "No referral sent",
              "A faculty member or adviser can create a contextual referral with student-visible notes.",
              "info",
            ),
      ) +
      `</div><div class="stack">` +
      h.card(
        "What will be shared",
        fact(
          "Your name and college email",
          "So the service can identify the request.",
        ) +
          fact("Requested service and time", selected) +
          (sup.minimalShare
            ? fact(
                "Course context",
                "Not included in this request.",
                status("neutral"),
              )
            : fact(
                "Course context",
                "PHYS 110 only; no grades or private advising notes.",
                status("info"),
              )) +
          `<div class="actions">${choosing ? h.btn(sup.minimalShare ? "Include PHYS 110 context" : "Use request details only", "campus-toggle-sharing") : ""}</div>`,
      ) +
      h.card(
        "What happens next",
        fact("1 · Request recorded", "You can cancel or correct it here.") +
          fact("2 · Service reviews", "Expected response: one college day.") +
          fact(
            "3 · Appointment status",
            "Only confirmed after the service accepts the request.",
          ),
      ) +
      `</div></div>`
    );
  }

  function referralWorkspace(s) {
    const c = s.campus;
    const rd = c.referralData;
    return (
      h.head(
        "Advising context and referral",
        "Authorized faculty / adviser view · Aisha Rahman",
        h.go("Follow-through queue", "S36"),
      ) +
      h.notice(
        "Observable context only",
        "This handoff describes a student request and course event. It does not assign a risk score or infer a diagnosis.",
        "info",
      ) +
      `<div class="columns wide-left"><div class="stack">` +
      h.card(
        "Faculty referral",
        fact(
          "Observable source",
          "12 Oct PHYS 110 diagnostic quiz · student requested more practice",
        ) +
          fact("Receiving service", rd.service, status(c.referral)) +
          h.area(
            "Student-visible context",
            "campus.referralData.note",
            rd.note,
          ) +
          (c.validation.referral.note
            ? h.notice(
                "Context needs attention",
                c.validation.referral.note,
                "error",
              )
            : "") +
          `<div class="actions">${c.referral === "draft" ? h.btn("Create referral", "campus-create-referral", {}, "primary") : h.btn("Save corrected context", "campus-correct-referral")}</div>`,
      ) +
      h.card(
        "Minimum shared context",
        fact("Student", "Aisha Rahman") +
          fact("Course", "PHYS 110 · Dr. Diane Reyes") +
          fact(
            "Shared event",
            "Student request after the 12 Oct diagnostic quiz",
          ) +
          fact(
            "Not shared",
            "Private faculty notes, other course grades, or inferred traits",
          ),
      ) +
      `</div><div class="stack">` +
      h.card(
        "Adviser preparation",
        fact(
          "Current enrollment",
          "PHYS 110 · Fall 2026 · LMS snapshot 15 Oct, 8:10 am",
        ) +
          fact(
            "Upcoming appointment",
            c.support.appointmentStatus === "requested"
              ? `${c.support.selected} · requested · ${c.support.appointmentShare}`
              : "No accepted appointment yet",
          ) +
          fact("Referral", `${rd.service} · ${c.referral}`, status(c.referral)),
      ) +
      h.card(
        "Linked degree authority",
        fact(
          "Physics BS · 2025–26 catalog",
          "Student information system · version AH-SIS-2026.10.15",
        ) +
          fact(
            "Degree audit",
            "Updated 15 Oct, 7:40 am · 2 unresolved questions",
          ) +
          h.notice(
            "Reference, not clearance",
            "Whiteboard links to the authoritative degree-plan version; this view does not decide requirements or graduation.",
            "warning",
          ),
      ) +
      `</div></div>`
    );
  }

  function supportFollowThrough(s) {
    const c = s.campus;
    const rd = c.referralData;
    const open = c.supportQueue.filter((item) => item.status !== "resolved");
    const unassigned = open.filter((item) => item.owner === "Unassigned");
    const learningOpen = open.filter(
      (item) => item.service === "Learning Support Center",
    );
    const learningAssigned = new Set(
      learningOpen
        .filter((item) => item.owner !== "Unassigned")
        .map((item) => item.owner),
    );
    const available = Math.max(
      0,
      Number(c.supportCapacity.learningCoordinators) - learningAssigned.size,
    );
    const advisingOpen = open.filter(
      (item) => item.service === "Academic Advising",
    );
    const studentCopy =
      {
        draft: "No referral has been sent.",
        received: "Learning Support Center received the request.",
        redirected: `The request is being routed to ${rd.service}.`,
        accepted: `${rd.owner} accepted the request and will follow up.`,
        resolved: "The support request is complete.",
        unassigned: "The request is waiting for an available coordinator.",
      }[c.referral] || "The request is being reviewed.";
    return (
      h.head(
        "Support follow-through",
        "Coordinator queue and student-safe update",
        h.go("Support directory", "S34"),
      ) +
      h.stats([
        [open.length, "open referrals"],
        [available, "available coordinators"],
        [unassigned.length, "unassigned"],
      ]) +
      `<div class="columns"><div class="stack">` +
      h.card(
        "Aisha Rahman · PHYS 110",
        fact(rd.service, studentCopy, status(c.referral)) +
          fact(
            "Owner",
            rd.owner,
            status(rd.owner === "Unassigned" ? "unassigned" : "accepted"),
          ) +
          fact("Queue age", rd.queueAge) +
          `<div class="actions">${c.referral === "received" || c.referral === "redirected" || c.referral === "unassigned" ? h.btn("Accept referral", "campus-accept-referral", {}, "primary") : ""}${!["draft", "resolved"].includes(c.referral) ? h.btn("Redirect service", "campus-redirect-referral") : ""}${c.referral === "accepted" ? h.btn("Resolve referral", "campus-resolve-referral", {}, "primary") : ""}${c.referral === "accepted" ? h.btn("Return to queue", "campus-unassign-referral", {}, "danger") : ""}</div>`,
      ) +
      h.card(
        "Queue capacity",
        fact(
          "Learning Support Center",
          `${available} coordinators available · ${learningOpen.length} open`,
        ) +
          fact(
            "Academic Advising",
            `${c.supportCapacity.advisingSameDay ? "Same-day capacity available" : "No same-day capacity"} · ${advisingOpen.length} open`,
            status(c.supportCapacity.advisingSameDay ? "available" : "warning"),
          ) +
          `<p class="muted small">Queue volume describes service capacity. It is not a student risk measure.</p>`,
      ) +
      `</div><div class="stack">` +
      h.card(
        "Student-visible status",
        h.notice(
          c.referral === "resolved" ? "Request complete" : "Next step",
          studentCopy,
          c.referral === "resolved" ? "success" : "info",
        ) +
          fact(
            "Shared with the student",
            `Service name, owner when assigned, and current status${rd.corrected ? " · context corrected" : ""}.`,
          ) +
          fact(
            "Kept within staff scope",
            "Routing reason and internal workload notes.",
          ),
      ) +
      h.card(
        "Status history",
        rd.history.length
          ? rd.history
              .map((item) =>
                fact(
                  `${item.time} · ${item.status}`,
                  `${item.actor} · ${item.service}${item.owner !== "Unassigned" ? ` · ${item.owner}` : ""}${item.detail ? ` · ${item.detail}` : ""}`,
                ),
              )
              .join("")
          : h.notice(
              "No referral history yet",
              "Create a referral to begin the ordered record.",
              "info",
            ),
      ) +
      `</div></div>`
    );
  }

  WB.reg("S24", "Academic timetable", "Registrar / department", timetable);
  WB.reg("S25", "Schedule-change review", "Registrar", scheduleReview);
  WB.reg("S26", "Find a room", "Permitted requester", roomFinder);
  WB.reg(
    "S27",
    "Reservation request",
    "Requester / space approver",
    reservation,
  );
  WB.reg("S28", "Campus event discovery", "Student", eventDiscovery);
  WB.reg("S29", "Organization home", "Student / officer", organization);
  WB.reg(
    "S30",
    "Collaborative event composer",
    "Organization officer",
    eventComposer,
  );
  WB.reg("S31", "Event approval workspace", "Student affairs", approval);
  WB.reg("S32", "Event attendance", "Operator / student", attendance);
  WB.reg(
    "S33",
    "Organization transition",
    "Outgoing / incoming officer",
    transition,
  );
  WB.reg("S34", "Get support", "Student", supportDirectory);
  WB.reg(
    "S35",
    "Advising context and referral",
    "Adviser / faculty",
    referralWorkspace,
  );
  WB.reg(
    "S36",
    "Support follow-through",
    "Coordinator / student",
    supportFollowThrough,
  );

  WB.actions["campus-timetable-view"] = (s, p) => {
    s.campus.scheduleView = p.view === "list" ? "list" : "timetable";
    return { message: `Showing ${s.campus.scheduleView} view.` };
  };
  WB.actions["campus-select-proposal"] = (s, p) => {
    const block = denied(["registrar", "department"]);
    if (block) return block;
    const available = p.choice === "available";
    Object.assign(s.campus.proposal, {
      choice: available ? "available" : "small-room",
      status: "draft",
      decision: "not reviewed",
      sourceStatus: "not sent",
      selectedTime: available ? "10:00" : "09:00",
      selectedRoom: available ? "Hollis Hall 104" : "Emery Hall 203",
    });
    return {
      message: available
        ? "Feasible 10:00 option selected."
        : "Capacity conflict selected for review.",
    };
  };
  WB.actions["campus-submit-schedule"] = (s) => {
    const block = denied(["registrar", "department"]);
    if (block) return block;
    const p = s.campus.proposal;
    if (p.choice !== "available") {
      p.status = "needs revision";
      return { message: "Resolve the capacity conflict before submission." };
    }
    p.status = "submitted";
    p.decision = "pending";
    p.sourceStatus = "not sent";
    return { message: "Change submitted for registrar review." };
  };
  WB.actions["campus-approve-schedule"] = (s) => {
    const block = denied(["registrar", "admin"]);
    if (block) return block;
    const p = s.campus.proposal;
    if (p.status !== "submitted")
      return { message: "Submit the feasible change first." };
    p.decision = "approved";
    p.sourceStatus = "queued";
    return {
      message:
        "Registrar approval recorded; source application remains pending.",
    };
  };
  WB.actions["campus-apply-schedule"] = (s) => {
    const block = denied(["registrar", "admin"]);
    if (block) return block;
    const c = s.campus,
      p = c.proposal;
    if (p.decision !== "approved")
      return { message: "Registrar approval is required before application." };
    p.sourceStatus = "applied";
    p.status = "applied";
    c.meeting.time = p.selectedTime;
    c.meeting.endTime = p.selectedTime === "10:00" ? "10:50" : "09:50";
    c.meeting.room = p.selectedRoom;
    c.scheduleApplied = true;
    return { message: "Applied to the sample scheduling source.", go: "S12" };
  };
  WB.actions["campus-check-room-time"] = (s) => {
    const search = s.campus.roomSearch,
      errors = roomErrors(search);
    s.campus.validation.room = errors;
    if (Object.keys(errors).length) {
      search.attempt = "blocked";
      return { message: Object.values(errors)[0] };
    }
    search.attempt = search.time === "15:30" ? "conflict" : "available";
    return {
      message:
        search.attempt === "available"
          ? "Hollis 104 is available for the complete interval."
          : "Hollis 104 has a 3:30 pm conflict.",
    };
  };
  WB.actions["campus-request-room"] = (s, p) => {
    const block = denied(["officer", "requester", "department", "registrar"]);
    if (block) return block;
    const c = s.campus,
      search = c.roomSearch,
      fromDraft = p.source === "event-draft",
      revision = fromDraft || c.draft.revisionOpen;
    if (fromDraft && !c.draft.revisionOpen)
      return { message: "Start an event revision before requesting its room." };
    if (fromDraft)
      Object.assign(search, {
        date: c.eventDraft.date,
        dateKey: c.eventDraft.dateKey,
        capacity: c.eventDraft.capacity,
        time: c.eventDraft.startTime,
        endTime: c.eventDraft.endTime,
      });
    const errors = roomErrors(search);
    c.validation.room = errors;
    if (Object.keys(errors).length) {
      search.attempt = "blocked";
      return { message: Object.values(errors)[0] };
    }
    if (search.time === "15:30") {
      search.attempt = "blocked";
      return { message: "The 3:30 pm conflict blocks this request." };
    }
    search.date = displayDate(search.dateKey);
    search.selected = p.room || "hollis-104";
    search.attempt = "requested";
    c.roomRequest.scope = revision ? "revision" : "published";
    setActiveRoomStatus(c, "requested");
    Object.assign(c.roomRequest, {
      date: search.date,
      dateKey: search.dateKey,
      time: search.time,
      endTime: search.endTime,
      recurrence: search.recurrence,
      capacity: Number(search.capacity),
      room: "Hollis Hall 104",
      approval: "pending",
      confirmation: "not requested",
      occurrence: "scheduled",
      occurrenceDate:
        search.recurrence === "One time"
          ? search.date
          : c.roomRequest.occurrenceDate,
      approvedFingerprint: "",
    });
    if (revision && !fromDraft)
      Object.assign(c.eventDraft, {
        date: search.date,
        dateKey: search.dateKey,
        startTime: search.time,
        endTime: search.endTime,
        time: `${search.time}–${search.endTime}`,
        room: "Hollis Hall 104",
        capacity: Number(search.capacity),
      });
    return {
      message: "Room request submitted; confirmation is still pending.",
      go: "S27",
    };
  };
  WB.actions["campus-return-room"] = (s) => {
    const block = denied(["spaceapprover", "eventapprover", "admin"]);
    if (block) return block;
    const c = s.campus;
    if (activeRoomStatus(c) !== "requested")
      return { message: "Only a submitted request can be returned." };
    setActiveRoomStatus(c, "returned");
    c.roomRequest.approval = "returned";
    c.roomRequest.confirmation = "not requested";
    return { message: "Room request returned for revision." };
  };
  WB.actions["campus-approve-room"] = (s) => {
    const block = denied(["spaceapprover", "eventapprover", "admin"]);
    if (block) return block;
    const c = s.campus;
    if (activeRoomStatus(c) !== "requested")
      return { message: "A submitted room request is required." };
    if (Object.keys(roomErrors(c.roomRequest)).length)
      return { message: Object.values(roomErrors(c.roomRequest))[0] };
    setActiveRoomStatus(c, "approved");
    c.roomRequest.approval = "approved";
    c.roomRequest.confirmation = "pending";
    c.roomRequest.approvedFingerprint = roomFingerprint(c.roomRequest);
    return {
      message:
        "Campus approval recorded; facilities confirmation remains pending.",
    };
  };
  WB.actions["campus-confirm-room"] = (s) => {
    const block = denied([
      "facilities",
      "spaceapprover",
      "eventapprover",
      "admin",
    ]);
    if (block) return block;
    const c = s.campus;
    if (activeRoomStatus(c) !== "approved")
      return { message: "Campus approval is required first." };
    if (c.roomRequest.approvedFingerprint !== roomFingerprint(c.roomRequest)) {
      setActiveRoomStatus(c, "returned");
      c.roomRequest.approval = "returned";
      c.roomRequest.confirmation = "not requested";
      return {
        message: "The approved room details changed; return them for review.",
      };
    }
    setActiveRoomStatus(c, "confirmed");
    c.roomRequest.confirmation = "confirmed";
    if (c.roomRequest.scope === "revision")
      c.eventDraft.room = c.roomRequest.room;
    return { message: "Facilities source confirmation recorded." };
  };
  WB.actions["campus-toggle-occurrence"] = (s) => {
    const block = denied(["officer", "facilities", "spaceapprover"]);
    if (block) return block;
    if (activeRoomStatus(s.campus) !== "confirmed")
      return { message: "Only a confirmed series can change an occurrence." };
    s.campus.roomRequest.occurrence =
      s.campus.roomRequest.occurrence === "cancelled"
        ? "scheduled"
        : "cancelled";
    return {
      message:
        s.campus.roomRequest.occurrence === "cancelled"
          ? `Only the ${s.campus.roomRequest.occurrenceDate} occurrence was cancelled.`
          : `The ${s.campus.roomRequest.occurrenceDate} occurrence was restored.`,
    };
  };
  WB.actions["campus-rsvp"] = (s) => {
    const block = denied(["student"]);
    if (block) return block;
    const c = s.campus,
      p = c.participation;
    if (!c.eventPublished)
      return { message: "This revision is not published." };
    if (c.rsvp === "confirmed") {
      const index = p.confirmed.findIndex((item) => item.id === "aisha");
      if (index >= 0) p.confirmed.splice(index, 1);
      c.rsvp = "none";
      if (p.pass) p.pass.status = "cancelled";
      const promoted = promoteNext(c);
      syncParticipation(c);
      return {
        message: promoted
          ? `RSVP cancelled; ${promoted.name}, first eligible on the waitlist, was promoted.`
          : "RSVP cancelled and one place released.",
      };
    }
    if (c.rsvp === "waitlisted") {
      p.waitlist = p.waitlist.filter((item) => item.id !== "aisha");
      c.rsvp = "none";
      syncParticipation(c);
      return { message: "Removed from the ordered waitlist." };
    }
    const person = {
      id: "aisha",
      name: "Aisha Rahman",
      kind: "student",
      eligible: true,
    };
    if (confirmedCount(c) >= Number(c.event.capacity)) {
      p.waitlist.push({ ...person, order: p.nextOrder++ });
      c.rsvp = "waitlisted";
      syncParticipation(c);
      return {
        message: `Event is full; joined at waitlist position ${p.waitlist.length}.`,
      };
    }
    p.confirmed.push(person);
    c.rsvp = "confirmed";
    issuePass(c, person);
    syncParticipation(c);
    return { message: "Place reserved and personal calendar entry created." };
  };
  WB.actions["campus-fill-event"] = (s) => {
    const c = s.campus,
      p = c.participation;
    p.otherConfirmed = Math.max(
      0,
      Number(c.event.capacity) - p.confirmed.length,
    );
    if (!p.waitlist.length) {
      p.waitlist = [
        {
          id: "mateo-rivera",
          name: "Mateo Rivera",
          kind: "student",
          eligible: true,
          order: 1,
        },
        {
          id: "leila-hassan",
          name: "Leila Hassan",
          kind: "student",
          eligible: true,
          order: 2,
        },
      ];
      p.nextOrder = 3;
    }
    syncParticipation(c);
    return {
      message:
        "Full-capacity example with an ordered sample waitlist is ready.",
    };
  };
  WB.actions["campus-release-seat"] = (s) => {
    const c = s.campus,
      p = c.participation;
    if (p.otherConfirmed > 0) p.otherConfirmed--;
    else if (p.confirmed.length) p.confirmed.shift();
    else return { message: "There is no confirmed place to release." };
    const promoted = promoteNext(c);
    syncParticipation(c);
    p.lastOutcome = promoted
      ? `${promoted.name} promoted from the ordered waitlist.`
      : "One place released; no eligible person is waiting.";
    return { message: p.lastOutcome };
  };
  WB.actions["campus-request-membership"] = (s) => {
    const block = denied(["student"]);
    if (block) return block;
    if (s.campus.membership !== "none")
      return { message: "Membership already has a status." };
    s.campus.membership = "requested";
    return { message: "Membership request recorded for officer review." };
  };
  WB.actions["campus-approve-membership"] = (s) => {
    const block = denied(["officer"]);
    if (block) return block;
    const c = s.campus;
    if (c.membership !== "requested")
      return { message: "A membership request is required first." };
    c.membership = "member";
    if (!c.org.members.some((member) => member.id === "aisha"))
      c.org.members.push({
        id: "aisha",
        name: "Aisha Rahman",
        role: "Member",
        active: true,
      });
    return { message: "Membership approved in the sample roster." };
  };
  WB.actions["campus-start-event-revision"] = (s) => {
    const block = denied(["officer"]);
    if (block) return block;
    const c = s.campus;
    if (c.draft.revisionOpen) return { message: "A revision is already open." };
    c.eventDraft = {
      title: c.event.title,
      date: c.event.date,
      dateKey: c.event.dateKey,
      startTime: c.event.startTime,
      endTime: c.event.endTime,
      time: c.event.time,
      room: c.event.room,
      capacity: c.event.capacity,
      summary: c.event.summary,
    };
    c.draft.version = Number(c.event.version) + 1;
    c.draft.revisionOpen = true;
    c.eventReview = "draft";
    c.draftRoomStatus = "draft";
    c.roomRequest.scope = "revision";
    c.roomRequest.approval = "not reviewed";
    c.roomRequest.confirmation = "not requested";
    c.roomRequest.approvedFingerprint = "";
    c.fundingStatus = "draft";
    c.validation.event = {};
    return {
      message:
        "Organization-owned revision opened; the published event is unchanged.",
    };
  };
  WB.actions["campus-preserve-commitments"] = (s) => {
    const block = denied(["officer"]);
    if (block) return block;
    const c = s.campus;
    if (!c.draft.revisionOpen) return { message: "Start a revision first." };
    c.eventDraft.capacity = confirmedCount(c);
    delete c.validation.event.capacity;
    return {
      message: `Draft capacity restored to ${confirmedCount(c)} so every confirmed place is honored.`,
    };
  };
  WB.actions["campus-save-event"] = (s) => {
    const block = denied(["officer"]);
    if (block) return block;
    const c = s.campus;
    if (!c.draft.revisionOpen)
      return { message: "Start a revision before editing event details." };
    if (c.eventReview === "approved")
      return {
        message: "The approved revision is read-only until publication.",
      };
    const errors = eventErrors(c);
    c.validation.event = errors;
    if (Object.keys(errors).length)
      return { message: Object.values(errors)[0] };
    c.eventDraft.date = displayDate(c.eventDraft.dateKey);
    c.eventDraft.time = `${c.eventDraft.startTime}–${c.eventDraft.endTime}`;
    c.eventDraft.capacity = Number(c.eventDraft.capacity);
    c.draft.version = Number(c.draft.version) + 1;
    c.draft.saved = "15 Oct, 3:06 pm";
    c.draft.lastEditor =
      c.org.members.find((member) => member.id === c.org.primaryContactId)
        ?.name || "Sofia Chen";
    c.eventReview = "draft";
    if (c.roomRequest.scope === "revision" && !draftMatchesRoom(c)) {
      c.draftRoomStatus = "draft";
      c.roomRequest.approval = "not reviewed";
      c.roomRequest.confirmation = "not requested";
      c.roomRequest.approvedFingerprint = "";
      return {
        message: `Draft version ${c.draft.version} saved; changed room requirements need a new request.`,
      };
    }
    return { message: `Organization draft version ${c.draft.version} saved.` };
  };
  WB.actions["campus-request-funding"] = (s) => {
    const block = denied(["officer"]);
    if (block) return block;
    if (!s.campus.draft.revisionOpen)
      return { message: "Start an event revision before requesting funds." };
    if (s.campus.fundingStatus !== "draft")
      return { message: "Funding request already has a status." };
    s.campus.fundingStatus = "requested";
    return { message: "Funding request submitted to Student Affairs." };
  };
  WB.actions["campus-approve-funding"] = (s) => {
    const block = denied(["eventapprover", "admin"]);
    if (block) return block;
    if (!s.campus.draft.revisionOpen || s.campus.fundingStatus !== "requested")
      return { message: "Submit the revision funding request first." };
    s.campus.fundingStatus = "approved";
    return { message: "Student Affairs approved the program-funds request." };
  };
  WB.actions["campus-return-event"] = (s) => {
    const block = denied(["eventapprover", "admin"]);
    if (block) return block;
    if (!s.campus.draft.revisionOpen)
      return { message: "There is no open revision to return." };
    s.campus.eventReview = "returned";
    return {
      message: "Event plan returned with a specific supervision question.",
    };
  };
  WB.actions["campus-resubmit-event"] = (s) => {
    const block = denied(["officer"]);
    if (block) return block;
    if (s.campus.eventReview !== "returned")
      return { message: "Only a returned plan can be resubmitted." };
    s.campus.eventReview = "pending";
    return { message: "Clarified event plan resubmitted." };
  };
  WB.actions["campus-approve-event"] = (s) => {
    const block = denied(["eventapprover", "admin"]);
    if (block) return block;
    const c = s.campus;
    if (!c.draft.revisionOpen)
      return { message: "There is no open revision to approve." };
    const errors = eventErrors(c);
    c.validation.event = errors;
    if (Object.keys(errors).length)
      return { message: Object.values(errors)[0] };
    if (c.roomRequest.approvedFingerprint !== roomFingerprint(c.roomRequest)) {
      c.draftRoomStatus = "returned";
      return {
        message:
          "The confirmed room details changed after approval; review the room request again.",
      };
    }
    if (!draftMatchesRoom(c)) {
      c.draftRoomStatus = "draft";
      c.roomRequest.approval = "not reviewed";
      c.roomRequest.confirmation = "not requested";
      return {
        message:
          "The complete event interval, room, and capacity need a matching confirmed request.",
      };
    }
    if (c.draftRoomStatus !== "confirmed" || c.fundingStatus !== "approved")
      return { message: "Room and funding dependencies must be complete." };
    c.eventReview = "approved";
    c.draft.approvedFingerprint = draftFingerprint(c.eventDraft);
    return { message: "Event review approved; publication is now available." };
  };
  WB.actions["campus-publish-event"] = (s) => {
    const block = denied(["eventapprover", "admin"]);
    if (block) return block;
    const c = s.campus;
    if (!c.draft.revisionOpen)
      return { message: "There is no open revision to publish." };
    const errors = eventErrors(c);
    c.validation.event = errors;
    if (Object.keys(errors).length)
      return { message: Object.values(errors)[0] };
    if (c.draft.approvedFingerprint !== draftFingerprint(c.eventDraft)) {
      c.eventReview = "draft";
      return {
        message:
          "The approved event fields changed; review the current draft again.",
      };
    }
    if (c.roomRequest.approvedFingerprint !== roomFingerprint(c.roomRequest)) {
      c.draftRoomStatus = "returned";
      return {
        message:
          "The approved room fields changed; review the room request again.",
      };
    }
    if (
      c.draftRoomStatus !== "confirmed" ||
      c.fundingStatus !== "approved" ||
      c.eventReview !== "approved" ||
      !draftMatchesRoom(c)
    )
      return {
        message: "Complete every matching dependency before publication.",
      };
    const next = {
      ...c.eventDraft,
      capacity: Number(c.eventDraft.capacity),
      version: Number(c.draft.version),
    };
    Object.assign(c.event, next);
    c.eventPublished = true;
    c.roomStatus = "confirmed";
    c.roomRequest.scope = "published";
    c.draft.revisionOpen = false;
    syncParticipation(c);
    return {
      message: "Approved event revision published to discovery.",
      go: "S28",
    };
  };
  WB.actions["campus-checkin"] = (s, p) => {
    const block = denied(["operator"]);
    if (block) return block;
    const c = s.campus,
      ci = c.checkin,
      id = String(p.person || "");
    const person = c.participation.confirmed.find((item) => item.id === id);
    if (!person || !person.eligible) {
      ci.duplicateId = "";
      ci.lastEntry = `${id || "Unknown entry"} · not eligible`;
      return {
        message:
          "No eligible confirmed attendee or sponsored guest matches that entry.",
      };
    }
    if (ci.syncedIds.includes(id) || ci.offlineIds.includes(id)) {
      ci.duplicateId = id;
      ci.lastEntry = `${person.name} · duplicate held`;
      return { message: "Duplicate detected and held out of the count." };
    }
    ci.offlineIds.push(id);
    ci.duplicateId = "";
    ci.lastEntry = `${person.name} · pending sync`;
    return { message: "Eligible check-in stored in the local operator queue." };
  };
  WB.actions["campus-sync-checkins"] = (s) => {
    const block = denied(["operator"]);
    if (block) return block;
    const ci = s.campus.checkin;
    ci.syncedIds = [...new Set([...ci.syncedIds, ...ci.offlineIds])];
    ci.offlineIds = [];
    ci.duplicateId = "";
    ci.lastEntry = "Local queue reconciled";
    s.campus.event.checkedIn = ci.syncedIds.length;
    return {
      message: "Local check-ins reconciled; duplicate remains excluded.",
    };
  };
  WB.actions["campus-assign-officer"] = (s) => {
    const block = denied(["officer"]);
    if (block) return block;
    const c = s.campus,
      t = c.transition,
      incoming = c.org.members.find((member) => member.id === t.incomingId);
    if (t.complete)
      return { message: "This officer handoff is already complete." };
    t.incomingAssigned = true;
    c.org.recertified = false;
    if (incoming) incoming.pendingRole = "President";
    return {
      message: `${incoming?.name || "Incoming officer"} was assigned the incoming president role; the updated contact is pending recertification.`,
    };
  };
  WB.actions["campus-accept-transition"] = (s) => {
    const block = denied(["officer", "incoming-officer"]);
    if (block) return block;
    if (!s.campus.transition.incomingAssigned)
      return { message: "Assign the incoming role first." };
    s.campus.transition.checklistAccepted = true;
    return { message: "Incoming officer accepted the transition checklist." };
  };
  WB.actions["campus-complete-transition"] = (s) => {
    const block = denied(["officer", "incoming-officer"]);
    if (block) return block;
    const c = s.campus,
      t = c.transition;
    if (!t.checklistAccepted) return { message: "Accept the checklist first." };
    if (t.complete) return { message: "This handoff is already complete." };
    const outgoing = c.org.members.find((member) => member.id === t.outgoingId),
      incoming = c.org.members.find((member) => member.id === t.incomingId);
    if (outgoing) {
      outgoing.role = "Past president";
      outgoing.roleEnded = t.effectiveDate;
    }
    if (incoming) {
      incoming.role = "President";
      delete incoming.pendingRole;
      incoming.roleStarted = t.effectiveDate;
    }
    c.org.primaryContactId = t.incomingId;
    c.org.directory[0].contact = incoming?.name || "Nora Johnson";
    c.org.tasks.forEach((task) => {
      if (task.assigneeId === t.outgoingId) task.assigneeId = t.incomingId;
    });
    c.draft.lastEditor = incoming?.name || c.draft.lastEditor;
    t.complete = true;
    c.org.recertified = true;
    return {
      message:
        "Organization handoff completed; roster, primary contact, and open work now name the incoming president.",
    };
  };
  WB.actions["campus-select-support"] = (s, p) => {
    const block = denied(["student"]);
    if (block) return block;
    const support = s.campus.support;
    if (support.appointmentStatus !== "not requested")
      return {
        message:
          "Cancel the current appointment request before choosing another service.",
      };
    support.selected = String(p.service || "Physics learning support");
    support.appointmentShare = "";
    return { message: `${support.selected} selected.` };
  };
  WB.actions["campus-request-appointment"] = (s) => {
    const block = denied(["student"]);
    if (block) return block;
    const support = s.campus.support;
    if (support.appointmentStatus !== "not requested")
      return { message: "This appointment already has a request." };
    support.appointmentStatus = "requested";
    support.appointmentShare = support.minimalShare
      ? "Name, email, service, and requested time"
      : "Name, email, service, requested time, and PHYS 110 context";
    support.appointmentHistory.push({
      service: support.selected,
      status: "requested",
      share: support.appointmentShare,
    });
    return {
      message:
        "Appointment request recorded; no booking exists until the service accepts it.",
    };
  };
  WB.actions["campus-cancel-appointment"] = (s) => {
    const block = denied(["student"]);
    if (block) return block;
    if (s.campus.support.appointmentStatus !== "requested")
      return { message: "There is no appointment request to cancel." };
    s.campus.support.appointmentHistory.push({
      service: s.campus.support.selected,
      status: "cancelled",
      share: s.campus.support.appointmentShare,
    });
    s.campus.support.appointmentStatus = "not requested";
    s.campus.support.appointmentShare = "";
    return { message: "Appointment request cancelled." };
  };
  WB.actions["campus-toggle-sharing"] = (s) => {
    const block = denied(["student"]);
    if (block) return block;
    s.campus.support.minimalShare = !s.campus.support.minimalShare;
    return {
      message: s.campus.support.minimalShare
        ? "Sharing reduced to request details only."
        : "PHYS 110 course context will be included.",
    };
  };
  WB.actions["campus-create-referral"] = (s) => {
    const block = denied(["faculty", "adviser", "instructor", "coordinator"]);
    if (block) return block;
    const c = s.campus,
      note = String(c.referralData.note || "").trim();
    if (!note || note.length > 500) {
      c.validation.referral.note = !note
        ? "Enter student-visible context."
        : "Use 500 characters or fewer.";
      return { message: c.validation.referral.note };
    }
    if (c.referral !== "draft")
      return { message: "This referral already has a queue status." };
    c.validation.referral = {};
    c.referral = "received";
    c.referralData.owner = "Unassigned";
    c.referralData.queueAge = "Just received";
    c.referralData.note = note;
    c.referralData.lastSavedNote = note;
    addReferralHistory(
      s,
      "received",
      "Dr. Diane Reyes",
      "Student-visible context saved",
    );
    syncReferralRecord(c);
    return {
      message: "Referral received by the Learning Support Center queue.",
      go: "S36",
    };
  };
  WB.actions["campus-correct-referral"] = (s) => {
    const block = denied(["faculty", "adviser", "instructor", "coordinator"]);
    if (block) return block;
    const c = s.campus,
      note = String(c.referralData.note || "").trim();
    if (c.referral === "draft")
      return {
        message: "Create the referral before correcting its recorded context.",
      };
    if (!note || note.length > 500) {
      c.validation.referral.note = !note
        ? "Enter student-visible context."
        : "Use 500 characters or fewer.";
      return { message: c.validation.referral.note };
    }
    if (note === c.referralData.lastSavedNote)
      return {
        message: "The saved student-visible context is already current.",
      };
    c.validation.referral = {};
    c.referralData.corrected = true;
    c.referralData.note = note;
    c.referralData.lastSavedNote = note;
    addReferralHistory(
      s,
      "context corrected",
      "Dr. Diane Reyes",
      "Entered correction saved",
    );
    return {
      message: "Entered student-visible context saved with its history.",
    };
  };
  WB.actions["campus-accept-referral"] = (s) => {
    const block = denied(["coordinator", "adviser"]);
    if (block) return block;
    const c = s.campus;
    if (!["received", "redirected", "unassigned"].includes(c.referral))
      return { message: "Only an open unowned referral can be accepted." };
    c.referral = "accepted";
    c.referralData.owner =
      c.referralData.service === "Academic Advising"
        ? "Jordan Ellis"
        : "Marisol Vega";
    c.referralData.queueAge = "Accepted today";
    addReferralHistory(
      s,
      "accepted",
      c.referralData.owner,
      "Owner accepted next step",
    );
    syncReferralRecord(c);
    return { message: `${c.referralData.owner} accepted the referral.` };
  };
  WB.actions["campus-redirect-referral"] = (s) => {
    const block = denied(["coordinator", "adviser"]);
    if (block) return block;
    const c = s.campus;
    if (["draft", "resolved"].includes(c.referral))
      return { message: "Only an open referral can be redirected." };
    c.referral = "redirected";
    c.referralData.service = "Academic Advising";
    c.referralData.owner = "Unassigned";
    c.referralData.queueAge = "Redirected today";
    addReferralHistory(
      s,
      "redirected",
      "Marisol Vega",
      "Receiving service changed",
    );
    syncReferralRecord(c);
    return {
      message: "Referral redirected to Academic Advising; it is unassigned.",
    };
  };
  WB.actions["campus-resolve-referral"] = (s) => {
    const block = denied(["coordinator", "adviser"]);
    if (block) return block;
    const c = s.campus;
    if (c.referral !== "accepted")
      return {
        message: "An owner must accept the referral before resolution.",
      };
    c.referral = "resolved";
    c.referralData.queueAge = "Resolved today";
    addReferralHistory(
      s,
      "resolved",
      c.referralData.owner,
      "Student-safe completion recorded",
    );
    syncReferralRecord(c);
    return {
      message: "Referral resolved with a student-visible completion status.",
    };
  };
  WB.actions["campus-unassign-referral"] = (s) => {
    const block = denied(["coordinator", "adviser"]);
    if (block) return block;
    const c = s.campus;
    if (c.referral !== "accepted")
      return { message: "Only an accepted referral can return to the queue." };
    const previous = c.referralData.owner;
    c.referral = "unassigned";
    c.referralData.owner = "Unassigned";
    c.referralData.queueAge = "Waiting today";
    addReferralHistory(
      s,
      "unassigned",
      previous,
      "Returned to the service queue",
    );
    syncReferralRecord(c);
    return { message: "Referral returned to the unassigned queue." };
  };
})();
