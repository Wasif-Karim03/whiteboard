/* Whiteboard Phase 2b fixtures: announcements, read markers and discussions for PHYS 110.
   Sources: board-deep-dive-2026-11-15.md:1182 (W28 rows: Quiz 3 opens Wednesday, New; Office hours move this
   week, Updated; a third row, Read), :1195 (W29: Dr. Diane Reyes, published 9:00 AM, quiz3-practice.pdf),
   :1208 (W30 topics), :1221 (W31 posts: Aisha 8:40 AM, Maya 9:12 AM); decisions.md BD29 (one discussion
   fixture; the opening post is Aisha's; W30 shows the real reply count). The third announcement is retitled
   "Problem Set 4 is due Friday" because the drawn "Problem Set 4 is graded" contradicts PS4 being held (chosen
   by Claude under owner delegation). A weekday in free text must match the record's aboutAt.
   Fictional, "reconstructed". */
(function (root) {
  "use strict";
  var WB = root.WB;
  var sel = WB.sel;
  var def = function (k, v) { return WB.defineFrozen(sel, k, v); };
  var PHYS = "phys110-f26";
  var quiz3 = WB.data.quiz.quizzes.filter(function (q) { return q.id === "quiz3"; })[0];
  var ps4 = WB.data.coursework.assessments.filter(function (x) { return x.id === "ps4"; })[0];

  function post(id, author, at, parent, body) { return { id: id, author_id: author, at: at, parent_id: parent, body: body }; }

  WB.defineFrozen(WB.data, "comms", {
    meta: { source: "reconstructed", basis: ["board-deep-dive-2026-11-15.md:1182,1195,1208,1221", "decisions.md BD29"] },
    announcements: [
      {
        id: "ann-quiz3", course_id: PHYS, author_id: "reyes", published_at: "2026-10-19T09:00:00-04:00", aboutAt: quiz3.opens, pinned: true, state: "published",
        attachments: [{ name: "quiz3-practice.pdf", pages: 2, accessible_version: true }],
        revisions: [{ rev: 1, at: "2026-10-19T09:00:00-04:00", title: "Quiz 3 opens Wednesday", body: "Quiz 3 on projectile motion opens Wednesday morning. AI tools are not permitted during the quiz. A practice sheet is attached." }],
      },
      {
        id: "ann-office-hours", course_id: PHYS, author_id: "reyes", published_at: "2026-10-14T12:00:00-04:00", pinned: false, state: "published",
        attachments: [],
        revisions: [
          { rev: 1, at: "2026-10-14T12:00:00-04:00", title: "Office hours move this week", body: "Office hours move to the physics lab this week, same time." },
          { rev: 2, at: "2026-10-16T08:30:00-04:00", title: "Office hours move this week", body: "Office hours move to the physics lab this week. The start time is now one hour later." },
        ],
      },
      {
        id: "ann-ps4-due", course_id: PHYS, author_id: "reyes", published_at: "2026-10-15T08:00:00-04:00", aboutAt: ps4.due, pinned: false, state: "published",
        attachments: [],
        revisions: [{ rev: 1, at: "2026-10-15T08:00:00-04:00", title: "Problem Set 4 is due Friday", body: "Problem Set 4 is due Friday at the end of the day. Tag every page to its question before you submit." }],
      },
    ],
    // The latest revision each person has read.
    readMarkers: [
      { id: "aisha-ann-office-hours", person_id: "aisha", announcement_id: "ann-office-hours", rev: 1, read_at: "2026-10-14T18:20:00-04:00" },
      { id: "aisha-ann-ps4-due", person_id: "aisha", announcement_id: "ann-ps4-due", rev: 1, read_at: "2026-10-15T09:05:00-04:00" },
    ],
    discussions: [
      {
        id: "projectile", course_id: PHYS, title: "Projectile motion: where do I start?", audience: "course", group_id: null, replies_closed: false,
        posts: [
          post("projectile-1", "aisha", "2026-10-20T08:40:00-04:00", null, "I am stuck on where to begin with the launch-angle questions. Should I split the velocity into components first?"),
          post("projectile-2", "maya", "2026-10-20T09:12:00-04:00", "projectile-1", "Yes. Split the launch velocity into horizontal and vertical parts, then treat each direction on its own."),
        ],
      },
      {
        id: "ps4-q3", course_id: PHYS, title: "Problem Set 4, question 3 setup", audience: "course", group_id: null, replies_closed: false,
        posts: [
          post("ps4-q3-1", "ben", "2026-10-19T19:30:00-04:00", null, "For question 3, do we take up as positive or down as positive?"),
          post("ps4-q3-2", "carmen", "2026-10-19T19:55:00-04:00", "ps4-q3-1", "I took up as positive and kept the sign on g."),
          post("ps4-q3-3", "maya", "2026-10-19T20:40:00-04:00", "ps4-q3-1", "Either works if you state it and stay consistent."),
          post("ps4-q3-4", "ben", "2026-10-19T21:05:00-04:00", "ps4-q3-3", "Thanks, that clears it up."),
        ],
      },
      {
        id: "team-orbit-planning", course_id: PHYS, title: "Team Orbit planning", audience: "group", group_id: "team-orbit", replies_closed: false,
        posts: [
          post("orbit-1", "aisha", "2026-10-18T15:00:00-04:00", null, "I can film the ramp trials. Can you take the data table?"),
          post("orbit-2", "ben", "2026-10-18T16:10:00-04:00", "orbit-1", "Sure, I will set up the table and share it."),
        ],
      },
      {
        id: "welcome", course_id: PHYS, title: "Welcome and course norms", audience: "course", group_id: null, replies_closed: true,
        posts: [post("welcome-1", "reyes", "2026-09-01T09:00:00-04:00", null, "Welcome to Introductory Mechanics. Please keep questions about graded work general and kind.")],
      },
    ],
  });

  function topic(view, topicId) {
    return view.data.comms.discussions.filter(function (t) { return t.id === topicId; })[0] || null;
  }
  def("replyCount", function (view, topicId) {
    var t = topic(view, topicId);
    return t ? Math.max(0, t.posts.length - 1) : null;
  });
  def("lastActivity", function (view, topicId) {
    var t = topic(view, topicId);
    if (!t || !t.posts.length) return null;
    return t.posts.reduce(function (latest, p) { return sel.isBefore(latest, p.at) ? p.at : latest; }, t.posts[0].at);
  });
  def("topicAuthor", function (view, topicId) {
    var t = topic(view, topicId);
    return t && t.posts.length ? t.posts[0].author_id : null;
  });

  // Published announcements the person has not read at their latest revision: [{id, reason: new|updated}].
  def("unreadAnnouncements", function (view, courseId, personId) {
    var c = view.data.comms;
    return c.announcements
      .filter(function (a) { return a.course_id === courseId && a.state === "published"; })
      .map(function (a) {
        var latest = a.revisions[a.revisions.length - 1].rev;
        var mark = c.readMarkers.filter(function (m) { return m.person_id === personId && m.announcement_id === a.id; })[0];
        if (!mark) return { id: a.id, reason: "new" };
        return mark.rev < latest ? { id: a.id, reason: "updated" } : null;
      })
      .filter(Boolean);
  });

  // Course topics, plus group-only topics for members of that group.
  def("visibleTopics", function (view, courseId, personId) {
    return view.data.comms.discussions.filter(function (t) {
      if (t.course_id !== courseId) return false;
      if (t.audience !== "group") return true;
      return view.data.groups.group_sets.some(function (s) {
        return s.groups.some(function (g) { return g.id === t.group_id && g.members.indexOf(personId) >= 0; });
      });
    });
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
