/* Batch 03 kit extension: statuses, icons and fictional data for the quiz attempt, discussion,
   calendar, updates (S10–S13) and grading/release (S17–S20). Loaded after batch02/kit2.js. */
(function () {
  "use strict";
  const K = window.K;
  const { ic, esc } = K;

  const P = {
    send: '<path d="M4 12l16-7.5-6 15.5-2.5-6.5z"/><path d="M11.5 13.5L20 4.5"/>',
    reply: '<path d="M10 7L5 12l5 5"/><path d="M5 12h9a5 5 0 0 1 5 5v1.5"/>',
    flag: '<path d="M5.5 21V4.5M5.5 5h11l-2 4 2 4h-11"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    calc: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8 7.5h8M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>',
    stack: '<path d="M12 4l8.5 4.5L12 13 3.5 8.5z"/><path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5"/>',
  };
  K.sprite = K.sprite.replace("</defs>", Object.entries(P).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("") + "</defs>");
  K.icons.push(...Object.keys(P));

  // Status additions. Graded (staff) and Released (learner-visible) never share a colour/icon (D9, D25).
  Object.assign(K.STATUS, {
    inProgress: ["info", "pencil", "In progress"],
    answersSaved: ["neutral", "check", "Answers saved"],
    deviceOnly: ["warning", "offline", "Saved on this device · not sent"],
    submitted: ["success", "check-circle", "Submitted"],
    resultsHeld: ["neutral", "eye-off", "Results not released"],
    notReviewed: ["neutral", "clock", "Not reviewed"],
    reviewing: ["info", "pencil", "In review"],
    graded: ["accent", "check", "Graded · staff only"],
    missing: ["error", "alert", "Missing"],
    accessEnded: ["error", "lock", "Grading access ended"],
    override: ["accent", "pencil", "Manual score · kept"],
    recalculated: ["info", "calc", "Recalculated"],
    noImpact: ["neutral", "check", "No answers affected"],
    approval: ["warning", "hourglass", "Needs instructor approval"],
    eligible: ["success", "check", "Eligible"],
    heldBack: ["warning", "hourglass", "Held · review incomplete"],
    stale: ["warning", "retry", "Preview out of date"],
    newDraft: ["warning", "pencil", "Changed · not released"],
    posted: ["success", "check", "Posted"],
    replyDraft: ["warning", "pencil", "Draft · not posted"],
    unread: ["info", "bell", "Unread"],
    changedTime: ["info", "history", "Changed"],
    confirmed: ["success", "check-circle", "Confirmed"],
    prefSaved: ["success", "check", "Saved · applies to future updates"],
  });

  const D3 = (K.D3 = {
    // Quiz 3 as the learner sees it (S16 authored items; learner answers are fictional).
    quiz: {
      ref: "AH-PHYS110-Q3-0412", at: "Thu, Oct 15, 2026 · 10:31 am ET", started: "10:14 am ET",
      base: 20, mine: 30, allowance: "1.5× quiz time",
      answers: { Q1: 1, Q2: "0.61", Q3: 1, Q4: "Both balls start with zero vertical velocity and have the same downward acceleration g, so their vertical positions match at every instant. The horizontal launch speed only changes how far the ball travels." },
    },
    // Discussion (Module 3). Roles are labelled on every contribution.
    thread: {
      title: "Why do the two balls land together?",
      prompt: "In the launch lab, the dropped ball and the horizontally launched ball hit the floor together. In your own words, explain why — then reply to one classmate with a question.",
      posts: [
        { who: "Daniel Kim", ini: "DK", role: "Student", at: "Tue, Oct 13 · 7:48 pm", text: "The horizontal push doesn’t add anything downward, so both balls fall the same way. I wasn’t sure if air resistance changes this for the faster ball." },
        { who: "Maya Chen", ini: "MC", role: "Teaching assistant", staff: true, reply: true, at: "Wed, Oct 14 · 9:12 am", text: "Good question, Daniel. In our lab, drag is small at 4 m/s, so we model it as zero. Try estimating the drag force to check that assumption." },
        { who: "Grace Liu", ini: "GL", role: "Student", at: "Wed, Oct 14 · 3:20 pm", text: "Same vertical acceleration and same starting vertical velocity (zero) → same fall time. The launched ball just moves sideways while it falls." },
      ],
      mine: "Vertical and horizontal motion are independent. Both balls start with zero vertical velocity and accelerate down at g, so they fall the same 1.8 m in the same 0.61 s. Grace — would this still hold on a slope?",
    },
    // PS4 grading roster (44 enrolled; a representative slice is drawn). Scenario: Mon, Oct 19.
    roster: [
      { name: "Aisha Rahman", ini: "AR", st: "reviewing", total: 27 },
      { name: "Ben Okafor", ini: "BO", st: "notReviewed" },
      { name: "Carmen Díaz", ini: "CD", st: "graded", total: 29 },
      { name: "Daniel Kim", ini: "DK", st: "graded", total: 25 },
      { name: "Elena Petrova", ini: "EP", st: "graded", total: 30 },
      { name: "Farid Haddad", ini: "FH", st: "graded", total: 22 },
      { name: "Grace Liu", ini: "GL", st: "graded", total: 28 },
      { name: "Jae-won Park", ini: "JP", st: "graded", total: 24 },
      { name: "Noah Fischer", ini: "NF", st: "missing" },
      { name: "Priya Nair", ini: "PN", st: "notReviewed" },
      { name: "Sam Whitaker", ini: "SW", st: "excused" },
      { name: "Tomás Rivera", ini: "TR", st: "missing" },
    ],
    counts: { enrolled: 44, received: 41, graded: 38, missing: 2, excused: 1 },
    // S18: sign-convention rule in “Kinematics problem-solving” v2, criterion C2.
    rule: {
      crit: "C2 · Substitutes with the correct sign for g",
      now: "Wrong sign for g → Partial, 2 of 3 points",
      next: "Wrong sign for g, carried consistently to the answer → 2.5 of 3 points",
      rows: [
        ["Ben Okafor", "—", "Not reviewed", "—", "not"],
        ["Carmen Díaz", "Partial", "7", "7.5", "calc"],
        ["Daniel Kim", "Partial", "6", "6.5", "calc"],
        ["Farid Haddad", "Partial", "5", "5.5", "calc"],
        ["Hannah Moore", "Partial", "7", "7.5", "calc"],
        ["Isaac Brown", "Partial", "6", "6.5", "calc"],
        ["Kofi Mensah", "Partial", "7", "7.5", "calc"],
        ["Lucía Torres", "Partial", "4", "4.5", "calc"],
        ["Aisha Rahman", "Partial", "7", "7", "override", "Manual score by Dr. Diane Reyes, Oct 19 · comment points to page 3, line 4"],
        ["Jae-won Park", "Partial", "6", "6", "override", "Manual score by Maya Chen, Oct 19 · partial credit for a labelled diagram"],
      ],
    },
    // S19 gradebook slice. Cells: [display, status key, visibility]
    cats: [["Assignments", 40], ["Quizzes", 20], ["Lab reports", 15], ["Exams", 25]],
    gb: [
      { name: "Aisha Rahman", ps3: ["24/30", "released"], q2: ["9/10", "released"], ps4: ["27/30", "graded"], q3: ["—", "resultsHeld"], cat: "88.3%", learner: "87.8%" },
      { name: "Ben Okafor", ps3: ["26/30", "released"], q2: ["8/10", "released"], ps4: ["Received", "notReviewed"], q3: ["—", "resultsHeld"], cat: "86.7%", learner: "86.7%" },
      { name: "Carmen Díaz", ps3: ["29/30", "released"], q2: ["10/10", "released"], ps4: ["29/30", "graded"], q3: ["—", "resultsHeld"], cat: "96.7%", learner: "96.7%" },
      { name: "Noah Fischer", ps3: ["21/30", "released"], q2: ["7/10", "released"], ps4: ["Missing", "missing"], q3: ["—", "resultsHeld"], cat: "55.0%", learner: "73.3%" },
      { name: "Sam Whitaker", ps3: ["25/30", "released"], q2: ["9/10", "released"], ps4: ["Excused", "excused"], q3: ["—", "resultsHeld"], cat: "84.4%", learner: "84.4%" },
      { name: "Tomás Rivera", ps3: ["23/30", "released"], q2: ["6/10", "released"], ps4: ["Missing", "missing"], q3: ["—", "resultsHeld"], cat: "54.2%", learner: "72.2%" },
    ],
    // S12 calendar: week of Oct 12–18 (today Thu, Oct 15).
    week: [
      ["Mon", "12", [["9:00", "PHYS 110 lecture", "Hollis Hall 104", "c-phys"], ["1:00", "WRIT 140 seminar", "Emery Hall 203", "c-writ"]]],
      ["Tue", "13", [["10:30", "MATH 220 lecture", "Keene Center 212", "c-math"], ["2:00", "PHYS 110 office hours", "Hollis Hall 116", "c-phys"]]],
      ["Wed", "14", [["9:00", "PHYS 110 lecture", "Hollis Hall 104", "c-phys"], ["1:00", "WRIT 140 seminar", "Emery Hall 203", "c-writ"]]],
      ["Thu", "15", [["10:30", "MATH 220 lecture", "Keene Center 212", "c-math", "chg"]]],
      ["Fri", "16", [["9:00", "PHYS 110 lecture", "Hollis Hall 104", "c-phys"], ["6:00", "Physics Society launch night", "Hollis Hall courtyard", "campus", "ev"], ["11:59", "Problem Set 4 due", "PHYS 110", "c-phys", "due"]]],
      ["Sat", "17", []],
      ["Sun", "18", []],
    ],
    // S13 updates feed. Feedback updates never show a score (D9).
    updates: [
      { k: "feedback", icon: "check-circle", title: "Feedback released for Problem Set 3", src: "PHYS 110 · Dr. Diane Reyes", at: "Fri, Oct 9", go: "S09:released" },
      { k: "work", icon: "pencil", title: "Problem Set 4: Question 3 wording clarified", src: "PHYS 110 · instructions updated, your receipt is unchanged", at: "Wed, Oct 14", go: "S05:open" },
      { k: "schedule", icon: "history", title: "MATH 220 moved to Keene Center 105 today", src: "MATH 220 · room change, 10:30 am", at: "Thu, Oct 15 · 7:40 am", go: "S12:changed" },
      { k: "campus", icon: "users", title: "Launch night moved indoors if it rains", src: "Physics Society · event you joined", at: "Wed, Oct 14", go: "S28:confirmed" },
      { k: "support", icon: "support", title: "Your support request has a reply", src: "Learning Commons · request LC-2291", at: "Tue, Oct 13", go: "S36:student" },
    ],
  });

  // Small shared renderers.
  K.av = (ini, staff) => `<span class="av${staff ? " staff" : ""}" aria-hidden="true">${ini}</span>`;
  K.role = (r, staff) => `<span class="w-role${staff ? " staff" : ""}">${esc(r)}</span>`;
  // Student→staff handoff: explained in words, never a link (Batch 01 rule). data-handoff satisfies the route check.
  K.handoff = (target, text) => `<p class="meta" data-handoff="${target}">${ic("users")} ${text}</p>`;
  K.qsel = (items, cur, label, mk) => `<div class="w-qsel" role="group" aria-label="${esc(label)}">${items.map((q) => `<button type="button" aria-pressed="${q === cur}" data-note="Selects ${esc(String(q))}">${mk ? mk(q) : ""}${esc(String(q))}</button>`).join("")}</div>`;
  K.STUDENTTABS = [["today", "Today", "today", "S01:usual"], ["courses", "Courses", "book", "S02:current"], ["calendar", "Calendar", "calendar", "S12:current"], ["updates", "Updates", "bell", "S13:unread"], ["campus", "Campus", "ticket", "S28:published"]];
})();
