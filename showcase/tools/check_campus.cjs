const fs = require("fs");
const vm = require("vm");
const path = require("path");

const root = path.resolve(__dirname, "..");
const context = { window: {}, console };
vm.createContext(context);
for (const file of ["src/core.js", "src/campus.js"])
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, {
    filename: file,
  });
const WB = context.window.WB;
const ids = Array.from({ length: 13 }, (_, i) => `S${i + 24}`);
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const dispatch = (name, data = {}) => WB.dispatch(name, data);

assert(
  ids.every((id) => WB.renderers[id]),
  "S24–S36 must all be registered",
);
assert(
  Object.keys(WB.actions)
    .filter((name) => name !== "set")
    .every((name) => name.startsWith("campus-")),
  "Campus action names must be prefixed",
);
assert(
  typeof WB.resetCampusJourney === "function" &&
    typeof WB.personalCampusEvent === "function" &&
    typeof WB.studentSupportStatus === "function",
  "Campus integration helpers must be exported",
);

for (const id of ids) {
  const before = JSON.stringify(WB.state),
    html = WB.render(id);
  assert(
    typeof html === "string" && html.length > 500,
    `${id} should render substantive HTML`,
  );
  assert(JSON.stringify(WB.state) === before, `${id} renderer mutated state`);
}
assert(
  WB.render("S24").includes("44 / 72") &&
    WB.render("S24").includes("<b>99</b>"),
  "Timetable counts should derive PHYS enrollment from active people",
);

WB.reset();
dispatch("campus-select-proposal", { choice: "small-room" });
dispatch("campus-submit-schedule");
assert(
  WB.state.campus.proposal.status === "needs revision",
  "Capacity conflict should block schedule submission",
);
dispatch("campus-select-proposal", { choice: "available" });
dispatch("campus-submit-schedule");
dispatch("campus-approve-schedule");
assert(
  WB.state.campus.proposal.sourceStatus === "queued" &&
    !WB.state.campus.scheduleApplied,
  "Approval must not imply source application",
);
assert(
  dispatch("campus-apply-schedule").go === "S12" &&
    WB.state.campus.meeting.time === "10:00",
  "Applied proposal should update the canonical meeting",
);

WB.reset();
WB.state.campus.roomSearch.endTime = "16:00";
assert(
  dispatch("campus-request-room", { room: "hollis-104" }).message.includes(
    "later",
  ),
  "Room end must follow its start",
);
assert(
  WB.state.campus.roomStatus === "confirmed",
  "Invalid room draft must preserve the confirmed published booking",
);
WB.state.campus.roomSearch.endTime = "19:00";
WB.state.campus.roomSearch.dateKey = "not-a-date";
dispatch("campus-request-room", { room: "hollis-104" });
assert(
  WB.state.campus.validation.room.dateKey,
  "Invalid room dates should produce a recoverable field error",
);
WB.state.campus.roomSearch.dateKey = "2026-11-04";
WB.state.campus.roomSearch.capacity = 73;
dispatch("campus-request-room", { room: "hollis-104" });
assert(
  WB.state.campus.validation.room.capacity,
  "Room capacity above the supported maximum should be rejected",
);
WB.state.campus.roomSearch.capacity = 64;
WB.state.campus.roomSearch.recurrence = "One time";
dispatch("campus-request-room", { room: "hollis-104" });
assert(
  WB.state.campus.roomStatus === "requested" &&
    WB.state.campus.roomRequest.dateKey === "2026-11-04" &&
    WB.state.campus.roomRequest.endTime === "19:00" &&
    WB.state.campus.roomRequest.occurrenceDate ===
      WB.state.campus.roomRequest.date,
  "Reservation should capture structured criteria and the selected one-time occurrence",
);
dispatch("campus-approve-room");
WB.state.campus.roomRequest.capacity = 63;
assert(
  dispatch("campus-confirm-room").message.includes("changed") &&
    WB.state.campus.roomStatus === "returned",
  "Changed approved room fields must return for review",
);

WB.reset();
const originalEvent = JSON.stringify(WB.state.campus.event);
dispatch("campus-start-event-revision");
assert(
  WB.state.campus.eventPublished &&
    JSON.stringify(WB.state.campus.event) === originalEvent &&
    WB.state.campus.draftRoomStatus === "draft",
  "Opening a revision must preserve the published event and reopen draft dependencies",
);
dispatch("campus-request-room", { room: "hollis-104", source: "event-draft" });
dispatch("campus-approve-room");
dispatch("campus-confirm-room");
WB.state.campus.eventDraft.endTime = "23:00";
WB.state.campus.fundingStatus = "approved";
assert(
  dispatch("campus-approve-event").message.includes(
    "complete event interval",
  ) && WB.state.campus.eventReview !== "approved",
  "A confirmed booking that ends before the event must block approval",
);
assert(
  JSON.stringify(WB.state.campus.event) === originalEvent,
  "Blocked overrun must not partially publish event fields",
);

WB.reset();
dispatch("campus-start-event-revision");
WB.state.campus.eventDraft.capacity = 10;
const capacityMessage = dispatch("campus-save-event").message;
assert(
  capacityMessage.includes("58 confirmed") &&
    WB.state.campus.validation.event.capacity,
  "Capacity below existing commitments must be rejected without losing the draft",
);
dispatch("campus-preserve-commitments");
assert(
  WB.state.campus.eventDraft.capacity === 58,
  "Explicit recovery should restore capacity to all confirmed commitments",
);
WB.state.campus.eventDraft.title = "x".repeat(161);
assert(
  dispatch("campus-save-event").message.includes("160"),
  "Long event titles should return a recoverable validation error",
);
WB.state.campus.eventDraft.title = "Physics After Dark: Revised program";
WB.state.campus.eventDraft.dateKey = "bad";
assert(
  dispatch("campus-save-event").message.includes("valid event date"),
  "Invalid event date should not throw or advance the version",
);

WB.reset();
dispatch("campus-start-event-revision");
Object.assign(WB.state.campus.eventDraft, {
  title: "Physics After Dark: Revised program",
  capacity: 61,
});
dispatch("campus-save-event");
dispatch("campus-request-room", { room: "hollis-104", source: "event-draft" });
dispatch("campus-approve-room");
dispatch("campus-confirm-room");
dispatch("campus-request-funding");
dispatch("campus-approve-funding");
dispatch("campus-approve-event");
const approvedFingerprint = WB.state.campus.draft.approvedFingerprint;
WB.state.campus.eventDraft.title = "Changed after approval";
assert(
  dispatch("campus-publish-event").message.includes("changed") &&
    WB.state.campus.eventReview === "draft",
  "Approved event edits must require a fresh review",
);
WB.state.campus.eventDraft.title = "Physics After Dark: Revised program";
WB.state.campus.eventReview = "approved";
WB.state.campus.draft.approvedFingerprint = approvedFingerprint;
const publish = dispatch("campus-publish-event");
assert(
  publish.go === "S28" &&
    !WB.state.campus.draft.revisionOpen &&
    WB.state.campus.event.title === "Physics After Dark: Revised program" &&
    WB.state.campus.event.capacity === 61,
  "Valid matching event should publish atomically",
);

WB.reset();
WB.state.campus.event.title = "Mutated";
WB.state.campus.rsvp = "confirmed";
WB.state.campus.org.primaryContactId = "mateo-rivera";
WB.resetCampusJourney(WB.state, "J4");
const j4 = JSON.stringify(WB.state.campus);
WB.state.campus.event.title = "Mutated again";
WB.resetCampusJourney(WB.state, "J4");
assert(
  JSON.stringify(WB.state.campus) === j4 &&
    WB.state.campus.eventPublished &&
    WB.state.campus.roomStatus === "confirmed" &&
    WB.state.campus.roomRequest.scope === "published",
  "J4 reset should be repeatable and restore a coherent published scenario",
);
WB.state.campus.referral = "resolved";
WB.resetCampusJourney(WB.state, "J5");
const j5 = JSON.stringify({
  support: WB.state.campus.support,
  referral: WB.state.campus.referral,
  referralData: WB.state.campus.referralData,
  supportQueue: WB.state.campus.supportQueue,
});
WB.state.campus.referral = "accepted";
WB.resetCampusJourney(WB.state, "J5");
assert(
  JSON.stringify({
    support: WB.state.campus.support,
    referral: WB.state.campus.referral,
    referralData: WB.state.campus.referralData,
    supportQueue: WB.state.campus.supportQueue,
  }) === j5 && WB.state.campus.referral === "draft",
  "J5 reset should be repeatable and restore referral dependencies",
);

WB.reset();
assert(
  WB.personalCampusEvent(WB.state) === null,
  "Discoverable events should not appear on the personal calendar before RSVP",
);
dispatch("campus-rsvp");
assert(
  WB.personalCampusEvent(WB.state)?.rsvp === "confirmed",
  "An available confirmed RSVP should create the personal calendar record",
);
dispatch("campus-rsvp");
assert(
  WB.personalCampusEvent(WB.state) === null,
  "Cancelling a confirmed RSVP should remove the personal calendar record",
);
WB.reset();
dispatch("campus-fill-event");
dispatch("campus-rsvp");
assert(
  WB.state.campus.rsvp === "waitlisted" &&
    WB.state.campus.participation.waitlist.map((item) => item.id).join(",") ===
      "mateo-rivera,leila-hassan,aisha",
  "Waitlist should preserve explicit arrival order",
);
dispatch("campus-release-seat");
assert(
  WB.state.campus.participation.confirmed.some(
    (item) => item.id === "mateo-rivera",
  ) && WB.state.campus.rsvp === "waitlisted",
  "First release should promote the first eligible person, not skip to Aisha",
);
dispatch("campus-release-seat");
dispatch("campus-release-seat");
assert(
  WB.state.campus.rsvp === "confirmed" &&
    WB.state.campus.participation.pass?.participantId === "aisha" &&
    WB.personalCampusEvent(WB.state)?.title === WB.state.campus.event.title,
  "Aisha should receive a readable pass and personal calendar record when her ordered turn is reached",
);
WB.state.campus.roomRequest.occurrenceDate = WB.state.campus.event.date;
dispatch("campus-toggle-occurrence");
assert(
  WB.personalCampusEvent(WB.state).status === "cancelled",
  "A cancelled matching occurrence should be reflected in the personal event helper",
);

const initialCheckins =
  WB.state.campus.checkin.syncedIds.length +
  WB.state.campus.checkin.offlineIds.length;
dispatch("campus-checkin", { person: "walk-in-riley" });
assert(
  WB.state.campus.checkin.syncedIds.length +
    WB.state.campus.checkin.offlineIds.length ===
    initialCheckins &&
    WB.state.campus.checkin.lastEntry.includes("not eligible"),
  "Ineligible manual entries must not increment attendance",
);
dispatch("campus-checkin", { person: "aisha" });
const afterEligible =
  WB.state.campus.checkin.syncedIds.length +
  WB.state.campus.checkin.offlineIds.length;
dispatch("campus-checkin", { person: "aisha" });
assert(
  afterEligible === initialCheckins + 1 &&
    WB.state.campus.checkin.duplicateId === "aisha",
  "Eligible stable IDs should be accepted once and duplicate-protected",
);

WB.reset();
dispatch("campus-assign-officer");
assert(
  !WB.state.campus.org.recertified,
  "Assigning a new primary role should make recertification freshness visibly pending",
);
dispatch("campus-accept-transition");
dispatch("campus-complete-transition");
const priya = WB.state.campus.org.members.find(
    (member) => member.id === "priya-nair",
  ),
  nora = WB.state.campus.org.members.find(
    (member) => member.id === "nora-johnson",
  );
assert(
  priya.role === "Past president" &&
    priya.roleEnded &&
    nora.role === "President" &&
    WB.state.campus.org.primaryContactId === "nora-johnson",
  "Completed handoff should update real roster roles and primary contact",
);
assert(
  WB.state.campus.org.tasks.every((task) => task.assigneeId !== "priya-nair") &&
    WB.state.campus.org.directory[0].contact === "Nora Johnson" &&
    WB.state.campus.org.recertified,
  "Completed handoff should transfer open work, refresh the directory contact, and complete recertification",
);
assert(
  WB.render("S29").includes("Hidden from default discovery") &&
    WB.render("S29").includes("time-limited review exception"),
  "Expired unreachable organization case should expose consequences and override context",
);

WB.reset();
dispatch("campus-create-referral");
const correction =
  "Aisha asked for a diagram-first review of vector components and confirmed that this wording can be shared.";
WB.state.campus.referralData.note = correction;
dispatch("campus-correct-referral");
dispatch("campus-redirect-referral");
dispatch("campus-accept-referral");
dispatch("campus-resolve-referral");
const support = WB.studentSupportStatus(WB.state);
assert(
  WB.state.campus.referralData.note === correction &&
    WB.state.campus.referralData.lastSavedNote === correction,
  "Entered correction must remain the saved referral context",
);
assert(
  WB.state.campus.referralData.history.map((item) => item.status).join(",") ===
    "received,context corrected,redirected,accepted,resolved",
  "Referral history should preserve actual ordered transitions",
);
assert(
  support.service === "Academic Advising" &&
    support.owner === "Jordan Ellis" &&
    support.status === "resolved" &&
    support.note === correction,
  "Student-safe status should follow the actual service, owner, status, and saved context",
);
assert(
  WB.render("S34").includes("Jordan Ellis") &&
    WB.render("S34").includes("request is complete"),
  "S34 should show the final student-safe follow-through",
);

WB.reset();
WB.ui.actor = "student";
WB.state.campus.roomStatus = "requested";
assert(
  dispatch("campus-approve-room").message.includes("cannot make") &&
    WB.state.campus.roomStatus === "requested",
  "Student sample actor must not approve room records",
);
WB.ui.actor = "officer";
dispatch("campus-start-event-revision");
WB.state.campus.eventReview = "approved";
assert(
  dispatch("campus-publish-event").message.includes("cannot make"),
  "Officer sample actor must not publish as the event approver",
);
WB.ui.actor = "";

WB.reset();
WB.state.campus.event.title = "<script>unsafe()</script>";
WB.state.campus.referralData.note = "<img src=x onerror=unsafe()> & detail";
assert(
  !WB.render("S28").includes("<script>unsafe()") &&
    WB.render("S28").includes("&lt;script&gt;"),
  "Event values must be escaped",
);
assert(
  !WB.render("S35").includes("<img src=x") &&
    WB.render("S35").includes("&lt;img"),
  "Referral values must be escaped",
);

console.log(
  `campus checks passed: ${ids.length} renderers, ${Object.keys(WB.actions).filter((name) => name.startsWith("campus-")).length} actions`,
);
