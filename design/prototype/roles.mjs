// Click-through prototype: roles, home screens and guided tours.
// Every step is "ScreenID:state" using states that already exist in the approved designs.
// A step's `as` names whose view it is when a tour crosses roles (e.g. the instructor side of a submission).
// Tours are checked at build time: unknown screens/states fail the build; steps not reachable by a
// click from the previous step are reported (the tour's Next button still covers them).

export const ROLES = [
  {
    key: "student", label: "Student", person: "Aisha Rahman", initials: "AR",
    blurb: "Takes PHYS 110 and other courses, submits work from a phone, follows campus events and asks for support.",
    home: "S01:usual",
    tours: ["submission", "quiz-student", "arrival", "calendar", "events-student", "support-student", "search-help", "preferences"],
  },
  {
    key: "instructor", label: "Instructor", person: "Dr. Diane Reyes", initials: "DR",
    blurb: "Teaches PHYS 110: builds lessons, sets work and rubrics, grades, releases feedback and runs the course.",
    home: "S14:published",
    tours: ["content", "assessment", "quiz", "grading", "allowance", "course-ops"],
  },
  {
    key: "ta", label: "Teaching assistant", person: "Maya Chen", initials: "MC",
    blurb: "Grades PHYS 110 work and proposes rubric changes. Can’t release grades or record allowances.",
    home: "S17:received",
    tours: ["ta-grading", "discussion"],
  },
  {
    key: "officer", label: "Student organization officer", person: "Priya Nair", initials: "PN",
    blurb: "Events officer of the Physics Society: plans events, requests rooms, checks people in and hands over the role.",
    home: "S29:officer",
    tours: ["event", "officer"],
  },
  {
    key: "scheduling", label: "Scheduling office", person: "Ruth Adeyemi", initials: "RA",
    blurb: "Office of the Registrar: keeps the academic timetable and reviews proposed meeting changes.",
    home: "S24:current",
    tours: ["schedule"],
  },
  {
    key: "campus", label: "Event Services & Student Activities", person: "Marcus Bell", initials: "MB",
    blurb: "Approves room requests (Event Services) and reviews student events (Student Activities, Hannah Lindqvist).",
    home: "S27:requested",
    tours: ["booking", "event-review"],
  },
  {
    key: "support", label: "Student support staff", person: "Jamal Wright", initials: "JW",
    blurb: "Support coordinator at the Learning Commons: receives referrals and follows through with students.",
    home: "S36:received",
    tours: ["support"],
  },
  {
    key: "admin", label: "Institution IT & administration", person: "Nadia Haddad", initials: "NH",
    blurb: "Sets up Whiteboard for Alder Hill: people and access (Nadia), connections (Owen Park), migration (Theo Lindgren), trust and AI controls.",
    home: "P50:incomplete",
    tours: ["implementation", "trust"],
  },
];

export const TOURS = {
  // ---- Student ----
  submission: {
    title: "Learn, submit and get feedback",
    intro: "Follow one Problem Set from the course page to released feedback, including the instructor’s side in the middle.",
    steps: [
      ["S01:usual", "Today shows what’s due and what’s new."],
      ["S02:current", "Courses lists this term’s classes."],
      ["S03:published", "The PHYS 110 course home."],
      ["S04:available", "Modules: the lesson and the assignment."],
      ["S05:open", "The assignment: dates, instructions and what to hand in."],
      ["S05:sheet", "Choose how to submit."],
      ["S06:ready", "Scan pages with the phone camera."],
      ["S06:selected", "Pages captured and ready to review."],
      ["S07:ready", "Review the submission before sending it."],
      ["S07:confirm", "Confirm the exact facts of what’s being submitted."],
      ["S08:received", "A receipt: proof of what was received and when."],
      ["S17:received", "Instructor’s side: the submission arrives for grading.", "instructor"],
      ["S17:graded", "Graded, but not yet visible to the student.", "instructor"],
      ["S20:preview", "Preview exactly what the class will see.", "instructor"],
      ["S20:released", "Feedback released.", "instructor"],
      ["S09:released", "Back to the student: feedback and score."],
    ],
  },
  "quiz-student": {
    title: "Take a quiz",
    intro: "Start a timed quiz, lose connection, recover, and submit.",
    steps: [["S10:available", "The quiz before starting."], ["S10:progress", "Answering, with saved progress."], ["S10:offline", "Connection lost: answers are kept on the device."], ["S10:submitted", "Submitted with a receipt."], ["S10:held", "Results held until the instructor releases them."]],
  },
  arrival: {
    title: "First visit and sign-in",
    intro: "Accept an invitation, sign in with the school, set preferences and land on Today.",
    steps: [["P42:valid", "An invitation to join."], ["P41:need", "Sign in through Alder Hill."], ["P43:ready", "First-run welcome."], ["P43:prefs", "Choose how updates arrive."], ["P44:editable", "Account and profile."], ["S01:usual", "Today."]],
  },
  calendar: {
    title: "Calendar, updates and discussion",
    intro: "See what changed, why, and talk it through in the course.",
    steps: [["S12:current", "This week across courses and campus."], ["S12:changed", "A class moved: old → new, and who changed it."], ["S13:unread", "Updates link to the changed record."], ["S11:open", "Course discussion."], ["S11:draft", "Write a reply."], ["S11:posted", "Posted, with author and time."]],
  },
  "events-student": {
    title: "Find and attend an event",
    intro: "RSVP to a campus event and check in with a pass.",
    steps: [["S28:published", "Discover campus events."], ["S28:confirmed", "Place confirmed."], ["S32:pass", "The event pass at the door."]],
  },
  "support-student": {
    title: "Ask for support",
    intro: "Find the right human service and follow a referral.",
    steps: [["S34:browsing", "Browse support services."], ["S34:selected", "What this service does and how to reach it."], ["S34:requested", "Request sent, with who acts next."], ["S36:student", "What the student sees of their request."]],
  },
  "search-help": {
    title: "Search and technical help",
    intro: "Search only what you’re allowed to see, then ask IT for help.",
    steps: [["S01:usual", "Start from Today."], ["P45:noquery", "Search."], ["P45:results", "Results you can access."], ["P46:selfservice", "Technical help."], ["P46:draft", "Describe the problem; diagnostics are editable."], ["P46:submitted", "Request sent to the IT Service Desk."]],
  },
  preferences: {
    title: "Profile and updates",
    intro: "Manage your profile and how updates reach you.",
    steps: [["S01:usual", "Today."], ["P44:editable", "Account and profile."], ["S13:unread", "Updates."], ["S13:saved", "Saved updates."]],
  },

  // ---- Instructor ----
  content: {
    title: "Build an accessible lesson",
    intro: "Edit a lesson, add media with captions and descriptions, and publish.",
    steps: [["S14:draft", "Course management."], ["P47:draft", "The lesson editor."], ["P47:issues", "Accessibility gaps are named before publishing."], ["P48:uploading", "Add a video."], ["P48:ready", "Captions and transcript ready."], ["P47:preview", "Preview as a student."], ["P47:published", "Published."], ["S04:available", "What students see.", "student"]],
  },
  assessment: {
    title: "Create an assignment and rubric",
    intro: "Set up Problem Set 4 with a rubric and publish it to students.",
    steps: [["S14:draft", "Course management."], ["S15:draft", "Create the assignment."], ["S15:invalid", "Missing details are explained."], ["P49:draft", "Build the rubric."], ["P49:ready", "Rubric ready."], ["S15:ready", "Assignment ready to publish."], ["S15:published", "Published."], ["S05:open", "What students see.", "student"]],
  },
  quiz: {
    title: "Author a quiz and release results",
    intro: "Write a quiz, see a student attempt it, then release results.",
    steps: [["S16:draft", "Write the quiz."], ["S16:ready", "Ready to publish."], ["S16:published", "Published."], ["S10:progress", "A student taking it.", "student"], ["S16:attempt", "Review attempts."], ["S10:held", "Results held for the student until release.", "student"]],
  },
  grading: {
    title: "Grade, change a rubric and release",
    intro: "Grade submissions, preview a rubric change’s impact, check the gradebook, release.",
    steps: [["S17:received", "Submissions to grade."], ["S17:progress", "Grading with the rubric."], ["S18:none", "Propose a rubric change."], ["S18:impact", "See exactly whose scores would change."], ["S18:applied", "Applied, with the rubric versioned."], ["S19:ungraded", "The gradebook."], ["S19:graded", "Everything graded."], ["S20:preview", "Preview the release."], ["S20:released", "Released."]],
  },
  allowance: {
    title: "Apply an approved allowance",
    intro: "Record an accessibility allowance and see it reach the student’s dates.",
    steps: [["S21:active", "People and permissions."], ["S21:allowance", "Record the allowance."], ["S15:changed", "The assignment shows personal dates."], ["S05:allowance", "The student sees their own due date.", "student"]],
  },
  "course-ops": {
    title: "Run the course",
    intro: "People, next term’s copy, and course insights.",
    steps: [["S21:active", "People and roles."], ["S21:invited", "An invitation is not access."], ["S22:incomplete", "Copy the course to next term."], ["S22:exception", "Problems are named before copying."], ["S22:applied", "Copied."], ["S23:followup", "Insights: who may need a follow-up."], ["S23:corrected", "An attendance correction, with history kept."]],
  },

  // ---- Teaching assistant ----
  "ta-grading": {
    title: "Grade as a teaching assistant",
    intro: "Grade work and propose a rubric change. Applying and releasing are the instructor’s.",
    steps: [["S17:received", "Submissions to grade."], ["S17:progress", "Grading."], ["S17:graded", "Graded."], ["S18:approval", "A proposed rubric change waits for the instructor."], ["S19:graded", "The gradebook."]],
  },
  discussion: {
    title: "Course discussion",
    intro: "Read and reply in PHYS 110.",
    steps: [["S11:open", "Discussion."], ["S11:draft", "Reply."], ["S11:posted", "Posted."], ["S11:locked", "A locked thread can be read, not answered."]],
  },

  // ---- Organization officer ----
  event: {
    title: "Plan an event and welcome students",
    intro: "From the organization’s page to a room, approval and check-in at the door.",
    steps: [["S29:officer", "The Physics Society."], ["S30:draft", "Draft the event."], ["S26:available", "Find a room."], ["S26:selected", "Room chosen — not yet requested."], ["S27:draft", "Request the room."], ["S27:requested", "Requested, not booked."], ["S31:pending", "Student Activities reviews the event.", "campus"], ["S31:approved", "Approved.", "campus"], ["S28:published", "Students can find it.", "student"], ["S32:eligible", "Check-in at the door."], ["S32:offline", "Offline check-ins wait to sync."], ["S32:synced", "Synced."]],
  },
  officer: {
    title: "Hand over an officer role",
    intro: "Transfer the events role without losing work.",
    steps: [["S29:transition", "A handover in progress."], ["S33:unassigned", "Start the handover."], ["S33:assigned", "Incoming officer assigned."], ["S33:accepted", "Checklist accepted."], ["S33:complete", "Handover complete."], ["S29:officer", "The organization afterwards."]],
  },

  // ---- Scheduling office ----
  schedule: {
    title: "Resolve a class meeting change",
    intro: "Find a conflict, review a proposal, apply it in the source and see students notified.",
    steps: [["S24:current", "The academic timetable."], ["S24:conflict", "A conflict."], ["S24:proposal", "A proposed change."], ["S25:submitted", "Review the change."], ["S25:approved", "Approved — not yet applied."], ["S25:applied", "Applied in the scheduling source."], ["S24:applied", "The timetable after the refresh."], ["S12:changed", "Students see the change in Calendar.", "student"]],
  },

  // ---- Campus operations ----
  booking: {
    title: "Review a room request",
    intro: "A request is not a booking; approval is not confirmation.",
    steps: [["S26:available", "Rooms that fit."], ["S27:requested", "A request to review."], ["S27:returned", "Returned with what to fix."], ["S27:approved", "Approved."], ["S27:confirmed", "Confirmed in the reservation system."], ["S12:personal", "It appears in Calendar.", "student"]],
  },
  "event-review": {
    title: "Review a student event",
    intro: "Student Activities checks an event before it’s published.",
    steps: [["S31:pending", "Waiting for review."], ["S31:blocked", "Blocked by an unmet dependency."], ["S31:returned", "Returned to the organizers."], ["S31:approved", "Approved."], ["S31:published", "Published to students."]],
  },

  // ---- Support ----
  support: {
    title: "Connect a student to a human service",
    intro: "An instructor refers a student; support staff take it from there; the student sees a safe status.",
    steps: [["S35:draft", "An instructor writes a referral.", "instructor"], ["S35:received", "Sent: course, one observed fact and a student-visible note.", "instructor"], ["S36:received", "The support queue."], ["S36:accepted", "Accepted, with the next step owner named."], ["S36:resolved", "Resolved."], ["S36:student", "What the student sees.", "student"]],
  },

  // ---- Institution IT & administration ----
  implementation: {
    title: "Set up, migrate and accept a course",
    intro: "Set up the institution, reconcile records, rehearse a migration and accept it.",
    steps: [["P50:incomplete", "Initial setup."], ["P50:mapping", "Map roles and sources."], ["P50:ready", "Ready for a rehearsal — not live."], ["S38:collision", "Two records may be the same person."], ["S38:retried", "Resolved by an explicit choice."], ["S39:unmapped", "Migration rehearsal."], ["S39:exceptions", "What didn’t map."], ["S39:accepted", "Accepted — still a rehearsal."], ["S37:active", "People, access and records."]],
  },
  trust: {
    title: "Trust, access and AI controls",
    intro: "Vendor support access, AI controls and a portable exit.",
    steps: [["S37:supportactive", "Temporary vendor support access."], ["S37:supportclosed", "Closed early."], ["S40:allowed", "Trust and AI controls."], ["S40:disabled", "A control turned off."], ["S40:exitpreview", "Preview a portable exit."], ["S40:exported", "Exported (sample)."]],
  },
};

// Which role a screen belongs to when someone opens it outside a tour (for the "Viewing as" label).
export const SCREEN_ROLE = {
  student: ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10", "S12", "S13", "S28", "S34", "P41", "P42", "P43", "P44", "P45", "P46"],
  instructor: ["S14", "S15", "S16", "S18", "S19", "S20", "S21", "S22", "S23", "S35", "P47", "P48", "P49"],
  ta: ["S17", "S11"],
  officer: ["S29", "S30", "S32", "S33"],
  scheduling: ["S24", "S25"],
  campus: ["S26", "S27", "S31"],
  support: ["S36"],
  admin: ["P50", "S37", "S38", "S39", "S40"],
};
