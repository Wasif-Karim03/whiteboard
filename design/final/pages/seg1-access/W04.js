/* W04 Onboarding (Phase 3 seg1). Three steps chosen by variant: confirm managed details, preferences, first
   task. Invalid forces step 1; saving, save failure and offline force step 2, where saving happens. Institution
   facts are read-only text; no control changes a role. A TA after access ends gets the notice, no queue link. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "invalid", "saving", "saveFailed", "offline"];
  var MAX_NAME = 80;
  var STEPS = ["Confirm details", "Preferences", "First task"];

  function inst(a) { return a.view.data.world.institution; }
  function stepOf(a) {
    if (a.state === "invalid") return 0;
    if (["saving", "saveFailed", "offline"].indexOf(a.state) >= 0) return 1;
    return a.variant === "preferences" ? 1 : a.variant === "first-task" ? 2 : 0;
  }
  function trail(a, step) {
    return a.K.trail({ label: "Setup steps", steps: STEPS.map(function (s, i) { return { label: s, state: i < step ? "done" : i === step ? "current" : "todo" }; }) });
  }
  function ownCourses(a) {
    var row = a.view.data.world.enrollments.filter(function (e) { return e.person_id === a.who.personId; })[0];
    return (row ? row.course_ids : []).map(function (id) { return a.sel.course(a.view, id); }).filter(Boolean);
  }

  function details(a) {
    var me = a.sel.person(a.view, a.who.personId);
    var c = a.sel.course(a.view, a.who.courseId);
    var kv = a.K.kv([
      { label: "Name", value: me.name }, { label: "Email", value: me.email },
      { label: "Role", value: WB.ROLE_LABELS[a.role] }, { label: "Course", value: c.code + " " + c.title },
    ]);
    var err = a.state === "invalid" ? "Use " + MAX_NAME + " characters or fewer" : undefined;
    return P.stack(a, [
      a.K.section({ title: "Managed by " + inst(a).name, body: kv, level: 2 }),
      a.K.field({ id: P.id(a, "name"), label: "Preferred name", error: err }),
      P.links(a, [{ label: "Continue", go: "W04:preferences" }, { label: "Something is wrong with these details", go: "W12" }]),
    ]);
  }

  function saveControls(a) {
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.button({ label: "Save preferences", kind: "primary", disabled: true, reason: "You're offline. Nothing has been saved", id: P.id(a, "save") })]);
    var save = a.K.button({ label: "Save preferences", kind: "primary", note: "Preview only: preferences are not stored in this prototype" });
    if (a.state === "saving") return P.stack(a, [a.K.saveStatus("saving"), save]);
    if (a.state === "saveFailed") {
      return P.stack(a, [
        a.K.saveStatus("failed"),
        a.K.notice({ tone: "error", title: "Preferences were not saved. Your choices are kept here" }),
        a.K.button({ label: "Retry", note: "Preview only: nothing is sent in this prototype" }),
      ]);
    }
    return save;
  }

  function preferences(a) {
    var zone = inst(a).timezone;
    var courses = ownCourses(a).map(function (c) { return { value: c.id || c.code, label: c.code }; });
    var next = a.role === "student" ? a.sel.nextDue(a.view, a.who.courseId, a.who) : null;
    return P.stack(a, [
      a.K.field({ id: P.id(a, "zone"), type: "select", label: "Time zone", options: [{ value: zone, label: zone }] }),
      a.K.field({ id: P.id(a, "landing"), type: "select", label: "Landing course", options: courses }),
      a.K.field({ id: P.id(a, "email"), type: "checkbox", label: "Optional email delivery" }),
      next ? P.p("Next deadline in this zone: " + P.when(a, next.due)) : "",
      saveControls(a),
      P.links(a, [{ label: "Back", go: "W04" }, { label: "Continue", go: "W04:first-task" }]),
    ]);
  }

  function firstTask(a) {
    if (P.taEnded(a)) return P.taEndedNotice(a);
    var task = a.role === "ta" ? a.sel.gradingTaskFor(a.view, a.who.personId) : null;
    var link = a.role === "student" ? { label: "Open your course", go: P.recordGo("W14", "course", a.who.courseId) }
      : a.role === "instructor" ? { label: "Open the course builder", go: "W35" }
        : { label: "Open your grading queue", go: task ? P.recordGo("W48", "assessment", task.assessment_id) : null };
    return P.links(a, [link.go ? link : null, { label: "Open Home", go: "W05" }]);
  }

  function skipDialog(a, step) {
    var left = STEPS.slice(step).join(", ");
    return a.K.dialog(a.ctx, {
      id: P.id(a, "skip"), title: "Skip setup for now", open: a.variant === "skip",
      body: P.p("Still to do: " + left + ". You can finish setup later from Account."),
      actions: [{ label: "Open Home", go: "W05", kind: "primary", id: P.id(a, "skip-home") }],
    });
  }

  function render(a) {
    var out = { title: a.page.title, navActive: null, body: "" };
    if (a.state === "loading") return Object.assign(out, { body: P.loading(a, "your setup") });
    if (!a.who.courseId || a.state === "firstUseEmpty") {
      return Object.assign(out, { body: a.K.empty({ title: "No course is assigned to this account yet", body: P.p("Your institution assigns courses."), action: { label: "Open Home", go: "W05" } }) });
    }
    var step = stepOf(a);
    var views = [details, preferences, firstTask];
    var skip = a.K.button({ label: "Skip for now", kind: "quiet", act: "open-dialog", target: P.id(a, "skip") });
    return Object.assign(out, { body: P.stack(a, [trail(a, step), views[step](a), skip]), dialog: skipDialog(a, step) });
  }

  WB.definePage("W04", {
    states: STATES,
    na: P.na(STATES, {
      conflict: "Preferences belong to one account and are edited by one person",
      sessionExpired: "Session expiry is drawn on Auth return and System states",
    }),
    variants: { preferences: "Step 2: preferences", "first-task": "Step 3: first task", skip: "Skip dialog open" },
    render: render,
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
