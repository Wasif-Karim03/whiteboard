/* W29 Announcement detail (Phase 3 seg4). Anchor: the Quiz 3 announcement; variant office-hours. Shows the latest
   revision at the clock, its attachments and earlier versions. A withdrawn record shows a notice in place of its
   text; staff keep the version history. No reply or private message control. Rules: pages/seg4-community/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "offline", "permissionUnavailable", "notYetAvailable"];
  var SHOWN = ["published", "withdrawn"];

  function record(a) {
    var id = a.sel.anchorFor("W29", P.recordVariant(a)).record.id;
    return a.view.data.comms.announcements.filter(function (x) {
      return x.id === id && x.course_id === a.who.courseId && SHOWN.indexOf(x.state) >= 0;
    })[0] || null;
  }
  function latest(x) { return x.revisions[x.revisions.length - 1]; }

  function facts(a, x) {
    var l = latest(x);
    var rows = [{ label: "Posted by", value: P.personName(a, x.author_id) }, { label: "Published", value: P.when(a, x.published_at) }, { label: "Version", value: String(l.rev) }];
    if (l.rev > 1) rows.push({ label: "Updated", value: P.when(a, l.at) });
    return a.K.kv(rows);
  }

  function pagesText(n) { return n ? n + (n === 1 ? " page" : " pages") : ""; }
  function files(a, x) {
    if (!x.attachments.length) return "";
    return a.K.list({
      label: "Attachments",
      items: x.attachments.map(function (f) {
        var meta = [pagesText(f.pages), f.accessible_version ? "Accessible version available" : ""].filter(Boolean).join(" · ");
        return { title: f.name, meta: meta, trailing: a.K.button({ label: "Download", kind: "quiet", note: "Preview only: nothing is downloaded in this prototype" }) };
      }),
    });
  }

  // Earlier versions with their text; withText false keeps only version and time (a withdrawn record, staff only).
  function history(a, x, withText) {
    var earlier = withText ? x.revisions.slice(0, -1) : x.revisions.slice();
    if (!earlier.length || (withText && x.revisions.length < 2)) return "";
    var items = earlier.reverse().map(function (r) { return { title: "Version " + r.rev + " · " + P.when(a, r.at), meta: withText ? r.body : "" }; });
    return a.K.disclosure({ id: P.id(a, "history"), summary: withText ? "Earlier versions" : "Version history", body: a.K.list({ label: "Versions", items: items }) });
  }

  function markUnread(a, x) {
    if (a.role !== "student" || x.state === "withdrawn") return "";
    if (a.state === "offline") return a.K.button({ label: "Mark as unread", disabled: true, reason: "You're offline", id: P.id(a, "unread") });
    return a.K.button({ label: "Mark as unread", note: "Preview only: read markers are not saved in this prototype" });
  }

  function links(a) {
    var list = [{ label: "Back to announcements", go: "W28" }, { label: "Notification settings", go: "W08" }];
    if (a.role === "instructor") list.push({ label: "Manage announcements", go: "W55" });
    return P.links(a, list);
  }

  function content(a, x) {
    if (x.state === "withdrawn") {
      var notice = a.K.notice({ tone: "info", title: "Withdrawn", body: P.p("The instructor withdrew this announcement. Its text is no longer shown.") });
      return P.stack(a, [notice, a.role === "student" ? "" : history(a, x, false), links(a)]);
    }
    return P.stack(a, [facts(a, x), P.p(latest(x).body), files(a, x), history(a, x, true), markUnread(a, x), links(a)]);
  }

  function body(a, x) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "This announcement is not available for your course role");
    if (a.state === "loading") return P.loading(a, "the announcement");
    if (a.state === "notYetAvailable") return P.stack(a, [a.K.notice({ tone: "info", title: "This announcement is not available yet" }), links(a)]);
    if (!x) return P.stack(a, [P.offHome(a, "This announcement is not published at this point"), links(a)]);
    var top = [P.taEnded(a) ? P.taEndedNotice(a) : "", a.state === "offline" ? P.offlineNotice(a) + a.K.flag("lastKnown") : ""];
    return P.stack(a, top.concat([content(a, x)]));
  }

  WB.definePage("W29", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "This page shows one announcement; an empty course is drawn on the announcement list" }),
    variants: { "office-hours": WB.manifest.anchors.W29.variants["office-hours"].label },
    render: function (a) {
      var x = record(a);
      var open = x && ["loading", "notYetAvailable", "permissionUnavailable"].indexOf(a.state) < 0;
      return P.shell(a, { title: open ? latest(x).title : "Announcement", body: body(a, x), crumbs: [{ label: "Announcements", go: "W28" }] }, { section: "announcements" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
