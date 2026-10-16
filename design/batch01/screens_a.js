/* Batch 01 screens S01–S05. Each state key maps to a map state (index into screens.json states)
   or is marked as an added design state with a reason. Fictional data only. */
(function () {
  "use strict";
  const { D, ic, badge, btn, link, notice, card, web, webHead, ios, group, row, courseTabs, iAvatar, sheet } = window.K;
  const reg = window.K.reg;
  const dot = (c) => `<span class="course-dot ${c}" aria-hidden="true"></span>`;

  /* ============ S01 TODAY ============ */
  reg("S01", {
    states: [
      ["usual", "Usual day", 0],
      ["quiet", "Quiet day", 1],
      ["delayed", "Source delayed", 2],
      ["released", "Feedback released", 3],
    ],
    url: () => "app.whiteboard.example/today",
    web(st) {
      const quiet = st === "quiet", delayed = st === "delayed", rel = st === "released";
      const next = quiet
        ? `<div class="w-drop" style="border-style:solid">${ic("check-circle")}<div><b style="color:var(--wb-text)">You’re caught up</b><p class="meta">No coursework is due in the next 7 days.</p></div></div>`
        : `<ul class="w-list inset">
            <li>${dot("c-phys")}<div class="grow"><a href="#S05" class="title" data-go="S05:open">${D.a.title}</a><div class="meta">PHYS 110 · Due tomorrow, ${D.a.due}</div></div>${rel ? badge("released") : badge("notStarted")}${btn(rel ? "Read feedback" : "Open assignment", { cls: "btn primary", go: rel ? "S09:released" : "S05:open" })}</li>
            <li>${dot("c-phys")}<div class="grow"><span class="title">Quiz 3: Projectile motion</span><div class="meta">PHYS 110 · Open until Mon, Oct 19 · 20 minutes</div></div>${badge("available")}${btn("Open quiz", { go: "S10:available" })}</li>
          </ul>`;
      const sched = quiet
        ? `<p class="meta">No classes today. Next: PHYS 110 on Friday, 9:00 am.</p>`
        : `${delayed ? notice("warning", "clock", "Schedule may be out of date", "The registrar timetable hasn’t updated since Wed, Oct 14, 9:12 pm. These are the last-known times; check with your instructor if something looks wrong.") + '<div style="height:10px"></div>' : ""}
          <ul class="w-list inset">
            <li>${dot("c-math")}<div class="grow"><span class="title">MATH 220 · Linear Algebra</span><div class="meta">Today · 10:30–11:45 am · Keene Center 212</div></div>${delayed ? badge("lastKnown") : ""}</li>
            <li>${dot("c-phys")}<div class="grow"><span class="title">PHYS 110 · Introductory Mechanics</span><div class="meta">Tomorrow · 9:00–9:50 am · Hollis Hall 104</div></div>${delayed ? badge("lastKnown") : ""}</li>
          </ul>
          <p class="meta" style="margin-top:8px">Source: registrar timetable · ${delayed ? "last updated Wed, Oct 14, 9:12 pm" : "updated today, 6:05 am"}</p>`;
      const updates = `<ul class="w-list inset">
          ${rel ? `<li>${ic("check-circle")}<div class="grow"><a href="#S09" class="title" data-go="S09:released">Feedback released: Problem Set 4</a><div class="meta">PHYS 110 · Dr. Diane Reyes · 4:10 pm</div></div></li>` : ""}
          ${quiet ? `<li><div class="grow meta">No new course updates.</div></li>` : `<li>${ic("clock")}<div class="grow"><span class="title">Quiz 3 is open</span><div class="meta">PHYS 110 · yesterday</div></div></li>`}
        </ul>${link("All updates", { cls: "btn plain", go: "S13:unread" })}`;
      const campus = quiet
        ? `<p class="meta">No published campus events this week.</p>`
        : `<p><b>Physics After Dark: Motion in the Movies</b></p><p class="meta">Wed, Oct 21 · 5:30–7:00 pm · Hollis Hall 104</p><div style="margin-top:10px">${btn("Explore events", { go: "S28:published" })}</div>`;
      return web({
        nav: "today", crumbs: [["Today"]], url: this.url(),
        body: webHead(rel ? "Good afternoon, Aisha" : "Good morning, Aisha", D.today + " · " + D.term) +
          `<div class="w-grid"><div class="w-stack">${card("Next up", next)}${card("Schedule", sched + `<div style="margin-top:10px">${btn("View calendar", { go: "S12:current" })}</div>`)}</div>
           <div class="w-stack">${card("Course updates", updates)}${card("Campus", campus)}${card("Support", `<p class="meta">Tutoring, advising and wellbeing services.</p><div style="margin-top:10px">${btn("Find support", { icon: "support", go: "S34:browsing" })}</div>`)}</div></div>`,
      });
    },
    ios(st) {
      const quiet = st === "quiet", delayed = st === "delayed", rel = st === "released";
      const next = quiet
        ? `<div class="i-card" style="text-align:center;justify-items:center">${ic("check-circle")}<div class="t">You’re caught up</div><p class="meta">No coursework is due in the next 7 days.</p></div>`
        : `<div class="i-card"><div style="display:flex;gap:8px;align-items:center">${dot("c-phys")}<span class="meta">PHYS 110 · Due tomorrow</span><span style="margin-left:auto">${rel ? badge("released") : badge("notStarted")}</span></div><div class="t">${D.a.title}</div><p class="meta">${D.a.due}</p>${btn(rel ? "Read feedback" : "Open", { cls: "i-btn tinted", go: rel ? "S09:released" : "S05:open" })}</div>`;
      const sched = quiet
        ? group([row("No classes today", "Next: PHYS 110 Friday, 9:00 am")], { h: "Schedule" })
        : (delayed ? `<h2 class="i-h">Schedule</h2><div style="margin-bottom:8px">${notice("warning", "clock", "May be out of date", "Last updated Wed 9:12 pm. Showing last-known times.")}</div>` : "") +
          group([row("MATH 220 · 10:30 am", "Keene Center 212" + (delayed ? " · last known" : ""), { lead: dot("c-math") }), row("PHYS 110 · Tomorrow 9:00 am", "Hollis Hall 104" + (delayed ? " · last known" : ""), { lead: dot("c-phys") })], { h: delayed ? "" : "Schedule", foot: "From the registrar timetable." });
      const upd = group(
        [
          ...(rel ? [row("Feedback released", "Problem Set 4 · PHYS 110", { bold: true, go: "S09:released", lead: `<span style="color:var(--wb-success)">${ic("check-circle")}</span>` })] : []),
          quiet ? row("No new course updates") : row("Quiz 3 is open", "PHYS 110 · yesterday", { go: "S10:available" }),
        ],
        { h: "Updates" },
      );
      return ios({
        tab: "today", large: "Today", sub: D.today, trail: iAvatar,
        body: `<h2 class="i-h">Next up</h2>${next}${sched}${upd}` +
          group([quiet ? row("No campus events this week") : row("Physics After Dark", "Wed, Oct 21 · 5:30 pm · Hollis Hall 104", { go: "S28:published" }), row("Find support", "Tutoring, advising, wellbeing", { go: "S34:browsing", lead: `<span style="color:var(--wb-accent-text)">${ic("support")}</span>` })], { h: "Campus & support" }),
      });
    },
    notes: {
      usual: { web: "Two-column day summary. Coursework is LMS-owned and always current; meetings name their source.", ios: "Single column. ‘Next up’ is a card with one tinted action; secondary sections are grouped lists." },
      quiet: { web: "Honest empty states per card — never filler content. Next class is still offered.", ios: "Caught-up card replaces Next up. Section order is stable so the layout doesn’t jump." },
      delayed: { web: "Only the timetable is marked ‘Last known’. Coursework rows are not, because their source isn’t delayed.", ios: "Inline notice above the schedule group; badges become text suffixes to save width." },
      released: { web: "Today announces that feedback exists but never shows the score — the learner opens it deliberately (privacy on a shared screen).", ios: "Update row and Next-up card both route to S09." },
    },
    a11y: ["One h1 per page; each card is a titled section (h2).", "Status always uses icon + text badges.", "Greeting changes with time of day but the page title stays ‘Today’ for assistive tech and history."],
  });

  /* ============ S02 COURSES ============ */
  reg("S02", {
    states: [
      ["current", "Current term", 0],
      ["past", "Past term", 1],
      ["unpublished", "Course unpublished", 2],
      ["preview", "Instructor preview", 3],
    ],
    url: () => "app.whiteboard.example/courses",
    web(st) {
      const seg = `<div class="w-seg" role="group" aria-label="Term">${["Fall 2026", "Past terms"].map((t, i) => `<button type="button" aria-pressed="${(st === "past") === (i === 1)}" data-go="S02:${i ? "past" : "current"}">${t}</button>`).join("")}</div>`;
      let list;
      if (st === "past") {
        list = `<ul class="w-list"><li>${dot("c-arch")}<div class="grow"><span class="title">MATH 120 · Calculus II</span><div class="meta">Spring 2026 · Prof. Lena Foster · no open work</div></div>${badge("readOnly")}${btn("View archive", { cls: "btn outline", note: "Opens the archived course read-only; no submission routes" })}</li></ul>`;
      } else {
        const cs = st === "preview" ? D.courses.slice(0, 1) : D.courses;
        list = `<ul class="w-list">${cs
          .map((c, i) => {
            const closed = st === "unpublished" && i === 2;
            return `<li style="align-items:flex-start">${dot(c.dot)}<div class="grow"><span class="title">${c.code} · ${c.title}</span><div class="meta">${c.who} · ${c.meets} · ${c.room}</div><div style="margin-top:6px">${closed ? `<span class="meta">${c.who} is still preparing this course. You’ll get an update when it opens.</span>` : `<span class="meta">Next:</span> ${c.next}`}</div></div>${closed ? badge("notOpen") : btn("Open course", { cls: i === 0 ? "btn primary" : "btn", go: i === 0 ? "S03:published" : null, note: i === 0 ? null : "Other courses follow the same S03 pattern" })}</li>`;
          })
          .join("")}</ul>`;
      }
      const banner = st === "preview" ? `<div class="w-banner" role="status">${ic("eye")}<span><b>Instructor preview.</b> Dr. Diane Reyes is viewing PHYS 110 as a student would see it. Nothing here is submitted or saved.</span>${btn("Return to course builder", { cls: "btn", go: "S14:preview", note: "Returns to S14 Course builder with the same course selected" })}</div>` : "";
      return web({ nav: "courses", crumbs: [["Courses"]], url: this.url(), banner, body: webHead("Courses", st === "past" ? "Archived courses are read-only." : "3 courses this term", seg) + card("", list, { flush: true, label: "Course list" }) });
    },
    ios(st) {
      const seg = `<div class="i-seg" role="group" aria-label="Term">${["Fall 2026", "Past"].map((t, i) => `<button type="button" aria-pressed="${(st === "past") === (i === 1)}" data-go="S02:${i ? "past" : "current"}">${t}</button>`).join("")}</div>`;
      let body;
      if (st === "past") body = group([row("MATH 120 · Calculus II", "Spring 2026 · Read-only", { lead: dot("c-arch"), note: "Opens archived course read-only" })], { foot: "Archived courses keep your work and feedback. You can’t submit to them." });
      else {
        const cs = st === "preview" ? D.courses.slice(0, 1) : D.courses;
        body = group(cs.map((c, i) => (st === "unpublished" && i === 2 ? row(`${c.code} · ${c.title}`, "Not open yet — your instructor is preparing it", { lead: dot(c.dot), trail: ic("eye-off") }) : row(`${c.code} · ${c.title}`, `${c.meets} · ${c.room}<br>Next: ${c.next}`, { lead: dot(c.dot), bold: true, go: i === 0 ? "S03:published" : null, note: i === 0 ? null : "Same S03 pattern" }))));
      }
      const banner = st === "preview" ? notice("warning", "eye", "Instructor preview", "Viewing as a student. Nothing is submitted.", btn("Return to builder", { cls: "btn", go: "S14:preview" })) + '<div style="height:12px"></div>' : "";
      return ios({ tab: "courses", large: "Courses", trail: iAvatar, body: banner + seg + body });
    },
    notes: {
      current: { web: "Each row carries instructor, meeting, room and next work so students rarely need to open a course to know what’s next.", ios: "Two-line subtitles keep schedule and next task visible before navigation." },
      past: { web: "Term switch is a segmented control; archived courses get a Read-only badge and no submission actions.", ios: "Same segmented control; footer explains what read-only means." },
      unpublished: { web: "Unpublished course is listed (the student is enrolled) but has no entry; message names who controls opening.", ios: "Row is not tappable; trailing eye-slash plus text, never colour alone." },
      preview: { web: "Preview banner persists across every learner page and offers the single way back to the builder.", ios: "Preview is a web-first instructor task; iOS shows the same banner if a preview link is opened." },
    },
    a11y: ["Term control exposes pressed state.", "Course list is one list; a non-openable row has no focus stop."],
  });

  /* ============ S03 COURSE HOME ============ */
  reg("S03", {
    states: [
      ["published", "Published course", 0],
      ["unpublished", "Unpublished course", 1],
      ["draft", "Assignment draft", 2],
      ["released", "Feedback released", 3],
    ],
    url: () => "app.whiteboard.example/courses/phys-110",
    web(st) {
      const crumbs = [["Courses", "S02:current"], ["PHYS 110"]];
      if (st === "unpublished")
        return web({ nav: "courses", crumbs, url: this.url(), body: `<div class="w-drop" style="margin-top:40px;border-style:solid;background:var(--wb-surface)">${ic("eye-off")}<div><h1 style="font-size:20px;color:var(--wb-text)">PHYS 110 isn’t open yet</h1><p class="meta" style="max-width:46ch;margin:6px auto 12px">Dr. Diane Reyes is preparing the course. You’ll get an update when materials and work are published.</p>${btn("Back to courses", { cls: "btn", go: "S02:current" })}</div></div>` });
      const due = st === "draft"
        ? `<div class="grow"><a href="#S05" class="title" data-go="S05:open">${D.a.title}</a><div class="meta">Due ${D.a.due} · 2 pages saved on this device</div></div>${badge("draft")}${btn("Continue draft", { cls: "btn primary", go: "S07:none" })}`
        : st === "released"
          ? `<div class="grow"><a href="#S05" class="title" data-go="S05:received">${D.a.title}</a><div class="meta">Attempt 1 received Oct 15</div></div>${badge("released")}${btn("View feedback", { cls: "btn primary", go: "S09:released" })}`
          : `<div class="grow"><a href="#S05" class="title" data-go="S05:open">${D.a.title}</a><div class="meta">Due ${D.a.due} · 30 points</div></div>${badge("notStarted")}${btn("Open assignment", { cls: "btn primary", go: "S05:open" })}`;
      return web({
        nav: "courses", crumbs, url: this.url(),
        body: webHead(D.course.title, `${D.course.code} · ${D.term} · ${D.course.instructor}`) + courseTabs("overview", st === "released") +
          `<div class="w-grid"><div class="w-stack">
            ${card("This week · Module 3: Projectile motion", `<p>Describe projectile motion by treating horizontal and vertical motion separately, linked by the same time.</p><div style="display:flex;align-items:center;gap:12px;margin-top:12px"><div class="bar" style="flex:1" role="img" aria-label="2 of 4 modules complete"><span style="width:50%"></span></div><span class="meta">2 of 4 modules complete</span></div><div style="margin-top:12px">${btn("Continue module", { cls: "btn", go: "S04:available" })}</div>`)}
            ${card("Coursework", `<ul class="w-list inset"><li>${due}</li></ul>`)}
            ${card("Announcement", `<p class="meta">Dr. Diane Reyes · Mon, Oct 12</p><p style="margin-top:6px">Problem Set 4 is posted. Tag each page with the questions it answers — it makes your feedback more precise.</p><div style="margin-top:8px">${btn("Read discussion", { cls: "btn plain", icon: "chat", go: "S11:open" })}</div>`)}
          </div><div class="w-stack">
            ${st === "released" ? notice("success", "check-circle", "Feedback is ready", "Problem Set 4 feedback was released on Tue, Oct 20.", btn("View feedback", { cls: "btn", go: "S09:released" })) : ""}
            ${card("Course details", `<dl class="facts"><dt>Meets</dt><dd>${D.course.meets}</dd><dt>Room</dt><dd>${D.course.room}</dd><dt>Instructor</dt><dd>${D.course.instructor}</dd><dt>Office hours</dt><dd>${D.course.office}</dd><dt>TA</dt><dd>${D.course.ta}</dd></dl>`)}
            ${card("Syllabus summary", `<dl class="facts"><dt>Assignments</dt><dd>40%</dd><dt>Labs</dt><dd>25%</dd><dt>Quizzes</dt><dd>35%</dd></dl><p class="meta" style="margin-top:8px">Totals use released work only. Excused work isn’t counted.</p>${link("Full syllabus", { cls: "btn plain", go: "S04:syllabus" })}`)}
          </div></div>`,
      });
    },
    ios(st) {
      if (st === "unpublished") return ios({ tab: "courses", back: ["Courses", "S02:current"], title: "PHYS 110", body: `<div class="i-card" style="margin-top:60px;text-align:center;justify-items:center">${ic("eye-off")}<div class="t">PHYS 110 isn’t open yet</div><p class="meta">Dr. Diane Reyes is preparing the course. You’ll get an update when it opens.</p></div>` });
      const chips = `<nav class="i-chips" aria-label="Course sections">${[["Overview", "S03:published", 1], ["Modules", "S04:available"], ["Work", "S05:open"], ["Quizzes", null], ["Discussion", null], ["Feedback", st === "released" ? "S09:released" : "S09:held"]].map(([t, go, cur]) => link(t, { go, current: !!cur, note: go ? null : t + " — not a mapped destination" })).join("")}</nav>`;
      const work = st === "draft" ? row(D.a.title, "Draft · 2 pages saved on this iPhone", { bold: true, go: "S07:none", trail: badge("draft", "Draft") }) : st === "released" ? row(D.a.title, "Feedback released Oct 20", { bold: true, go: "S09:released", trail: badge("released", "Released") }) : row(D.a.title, "Due " + D.a.due, { bold: true, go: "S05:open" });
      return ios({
        tab: "courses", back: ["Courses", "S02:current"], title: "PHYS 110",
        body: `<h1 class="i-large" style="font-size:calc(28px*var(--wb-scale))">${D.course.title}</h1><p class="i-sub">PHYS 110 · ${D.course.instructor}</p>${chips}` +
          (st === "released" ? notice("success", "check-circle", "Feedback is ready", "Problem Set 4", btn("View", { cls: "btn", go: "S09:released" })) : "") +
          group([row("Module 3: Projectile motion", "2 of 4 modules complete", { bold: true, go: "S04:available" })], { h: "This week" }) +
          group([work], { h: "Coursework" }) +
          group([row("Problem Set 4 is posted", "Dr. Diane Reyes · Mon", { note: "Opens announcement" })], { h: "Announcement" }) +
          group([row("Mon / Wed / Fri · 9:00 am", D.course.room), row("Office hours", D.course.office)], { h: "Details" }),
      });
    },
    notes: {
      published: { web: "Course identity stays in the header; section tabs are links (not ARIA tabs) because each section is its own deep-linkable page.", ios: "Horizontally scrolling section chips under a large title; back returns to Courses." },
      unpublished: { web: "Entire workspace withheld with a single recovery action; no partial content leaks.", ios: "Same message; back button remains." },
      draft: { web: "A saved draft says where it lives (this device) and that it isn’t submitted.", ios: "Draft row resumes S07 review directly." },
      released: { web: "Feedback notice appears only after release; the Feedback tab exists always but shows a held state before release.", ios: "Notice + coursework row both route to S09." },
    },
    a11y: ["Breadcrumb is a labelled nav with aria-current on the course.", "Progress bar has an explicit text label next to it, not just a fill."],
  });

  /* ============ S04 MODULES & MATERIALS ============ */
  const MODS = [["m1", "Foundations and vectors", "complete"], ["m2", "Motion in one dimension", "complete"], ["m3", "Projectile motion", "available"], ["m4", "Forces and free-body diagrams", "locked"]];
  const reading = `<p>Without air resistance, a projectile’s <b>horizontal velocity is constant</b>. Its <b>vertical acceleration is downward</b>, with magnitude g = 9.8 m/s². Connect the two directions through the same time variable, t.</p>
    <p style="margin:10px 0;font-family:ui-serif,Georgia,serif;font-size:1.05em">x = v<sub>0x</sub>t &nbsp;&nbsp;&nbsp; y = v<sub>0y</sub>t − ½gt²</p>
    <figure style="margin:12px 0"><svg viewBox="0 0 320 120" role="img" aria-label="Diagram: projectile path. Full description in Text alternative." style="width:100%;max-width:420px;height:auto"><path d="M10 110H310" stroke="currentColor" stroke-width="1.2" opacity=".5"/><path d="M20 110 Q 150 -40 290 110" fill="none" stroke="var(--wb-accent)" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M20 110l40-48" stroke="currentColor" stroke-width="2"/><text x="64" y="58" font-size="11" fill="currentColor">v₀</text><text x="150" y="20" font-size="11" fill="currentColor">max height: vᵧ = 0</text></svg><figcaption class="meta">Figure 3.1 · ${link("Read text alternative", { cls: "", go: "S04:alt" })}</figcaption></figure>`;
  reg("S04", {
    states: [
      ["available", "Available", 0],
      ["locked", "Locked", 1],
      ["unpublished", "Unpublished", 2],
      ["complete", "Complete", 3],
      ["alt", "Text alternative", 4],
      ["syllabus", "Syllabus view", null, "Added: material-view variant named in map content"],
    ],
    url: (st) => "app.whiteboard.example/courses/phys-110/modules/" + (st === "locked" ? "m4" : "m3"),
    web(st) {
      const sel = st === "locked" ? "m4" : "m3";
      const index = `<ol class="w-list">${MODS.map(([id, t, s], i) => {
        const state = id === "m3" && st === "complete" ? "complete" : s;
        return `<li style="${id === sel ? "background:var(--wb-accent-tint)" : ""}"><span class="meta" style="width:16px">${i + 1}</span><div class="grow">${state === "locked" ? `<span class="title" style="color:var(--wb-text-2)">${t}</span><div class="meta">Opens Mon, Oct 19 · after module 3</div>` : `<a href="#S04" class="title" data-go="S04:${id === "m3" ? (st === "complete" ? "complete" : "available") : "available"}"${id === sel ? ' aria-current="true"' : ""}>${t}</a>`}</div>${badge(state, state === "available" ? "Open" : null)}</li>`;
      }).join("")}</ol><p class="meta" style="padding:10px 20px">Draft modules aren’t listed until published.</p>`;
      const tabs = `<nav class="w-tabs" aria-label="Material views" style="margin-bottom:16px">${[["Reading", "available"], ["Syllabus", "syllabus"], ["Text alternative", "alt"]].map(([t, k]) => link(t, { go: "S04:" + k, current: (k === st) || (k === "available" && (st === "available" || st === "complete")) })).join("")}</nav>`;
      let main;
      if (st === "locked") main = card("Forces and free-body diagrams", notice("neutral", "lock", "This module isn’t available yet", "It opens Mon, Oct 19 at 8:00 am ET, after you complete Module 3: Projectile motion.", btn("Go to Module 3", { cls: "btn", go: "S04:available" })));
      else if (st === "unpublished") main = card("", notice("neutral", "eye-off", "This material isn’t available", "The link may point to a module your instructor hasn’t published. Nothing about its contents is shown.", btn("Back to modules", { cls: "btn", go: "S04:available" })));
      else if (st === "syllabus") main = card("PHYS 110 syllabus", tabs + `<dl class="facts"><dt>Instructor</dt><dd>${D.course.instructor}</dd><dt>Office hours</dt><dd>${D.course.office}</dd><dt>Assignments</dt><dd>40% of course grade</dd><dt>Labs</dt><dd>25%</dd><dt>Quizzes</dt><dd>35%</dd></dl><p style="margin-top:12px">Missing, ungraded and excused work are tracked separately. Totals use released work only. Request accommodations through Accessibility Services; approved extensions appear on each assignment.</p>`);
      else if (st === "alt") main = card("Projectile motion", tabs + `<h3 style="font-size:15px;margin-bottom:6px">Text alternative · Figure 3.1</h3><p>A ball is launched from ground level up and to the right. Its path is a symmetric arc. An arrow at the start labelled v₀ shows the launch velocity at an angle above horizontal. At the top of the arc, a label notes that vertical velocity is zero at maximum height. The ball lands at the same height it started.</p>`);
      else main = card("Projectile motion", tabs + reading + `<div style="display:flex;align-items:center;gap:12px;margin-top:14px;flex-wrap:wrap">${st === "complete" ? badge("complete", "Reading complete · recorded Oct 15") + btn("Mark as not complete", { cls: "btn plain", note: "Undo for this module only — other modules keep their own completion" }) : btn("Mark reading complete", { cls: "btn", icon: "check", go: "S04:complete" })}<span style="margin-left:auto;display:flex;gap:8px">${btn("Try Quiz 3", { cls: "btn", go: "S10:available" })}${btn("Begin Problem Set 4", { cls: "btn primary", go: "S05:open" })}</span></div>`);
      return web({ nav: "courses", crumbs: [["Courses", "S02:current"], ["PHYS 110", "S03:published"], ["Modules"]], url: this.url(st), body: webHead("Modules", "PHYS 110 · Published modules and when they open") + courseTabs("modules") + `<div class="w-grid split">${card("", index, { flush: true, label: "Module list" })}<div class="w-stack">${main}</div></div>` });
    },
    ios(st) {
      if (st === "locked" || st === "unpublished") {
        const rows = MODS.map(([id, t, s], i) => (s === "locked" ? row(`${i + 1}. ${t}`, "Opens Mon, Oct 19 · after module 3", { trail: badge("locked") }) : row(`${i + 1}. ${t}`, s === "complete" ? "Complete" : "Open", { go: "S04:available", trail: s === "complete" ? `<span style="color:var(--wb-success)">${ic("check")}</span>` : "" })));
        return ios({ tab: "courses", back: ["PHYS 110", "S03:published"], title: "Modules", large: "Modules", body: (st === "unpublished" ? notice("neutral", "eye-off", "That material isn’t available", "It may not be published yet.") + '<div style="height:10px"></div>' : "") + group(rows, { foot: st === "locked" ? "Locked modules say what they’re waiting for. Tap an open module to read." : "" }) });
      }
      const menu = `<button type="button" class="i-iconbtn" aria-label="Material view: ${st === "alt" ? "Text alternative" : st === "syllabus" ? "Syllabus" : "Reading"}" data-note="Pull-down menu: Reading · Syllabus · Text alternative · Download for offline">${ic("list")}</button>`;
      let body;
      if (st === "syllabus") body = `<h1 class="i-large" style="font-size:28px">Syllabus</h1>` + group([row("Assignments", "40%"), row("Labs", "25%"), row("Quizzes", "35%")], { foot: "Totals use released work only. Excused work isn’t counted." });
      else if (st === "alt") body = `<h1 class="i-large" style="font-size:28px">Figure 3.1</h1><p class="i-sub">Text alternative</p><div class="i-card"><p>A ball is launched from ground level up and to the right along a symmetric arc. An arrow labelled v₀ shows the launch velocity. At the top, vertical velocity is zero. It lands at its starting height.</p></div>`;
      else body = `<p class="eyebrow" style="margin:4px 4px 0">Module 3</p><h1 class="i-large" style="font-size:28px">Projectile motion</h1><div class="i-card" style="margin-top:10px">${reading}</div><div style="height:12px"></div>${st === "complete" ? `<div style="text-align:center">${badge("complete", "Reading complete")}</div>` : ""}`;
      return ios({ tab: "courses", back: ["Modules", "S04:locked"], title: "", trail: menu, body, bottom: st === "available" ? btn("Mark reading complete", { cls: "i-btn tinted", go: "S04:complete" }) : st === "complete" ? btn("Begin Problem Set 4", { cls: "i-btn", go: "S05:open" }) : "" });
    },
    notes: {
      available: { web: "Index and reading side by side; each module shows its release rule before you select it.", ios: "Pushed reading screen; view menu in the nav bar holds Reading / Syllabus / Text alternative / Download." },
      locked: { web: "Locked module names both conditions (time and prerequisite) and offers the route that unlocks it.", ios: "Module list shows lock badge plus the condition as subtitle; locked rows aren’t tappable." },
      unpublished: { web: "Deep link to a draft reveals nothing about its contents.", ios: "Same message above the list." },
      complete: { web: "Completion is per module and reversible; recorded time shown.", ios: "Bottom action advances to the problem set." },
      alt: { web: "Text alternative is a first-class view, not a hidden tooltip.", ios: "Same content as its own screen." },
      syllabus: { web: "Syllabus is a material view so it can be linked from course home.", ios: "Same data as grouped list." },
    },
    a11y: ["Figure has a short accessible name and a linked full description.", "Material-view links use aria-current; module index is an ordered list.", "Equations are real text (sub/sup), not images."],
  });

  /* ============ S05 ASSIGNMENT ============ */
  reg("S05", {
    states: [
      ["open", "Published · open", 0],
      ["sheet", "Choose method", null, "Added: iOS action sheet from the primary action"],
      ["allowance", "Allowance applied", 1],
      ["received", "Received", 2],
      ["closed", "Closed", 3],
    ],
    url: () => "app.whiteboard.example/courses/phys-110/assignments/ps4",
    web(st) {
      const x = st === "allowance", rec = st === "received", closed = st === "closed";
      const dates = `<dl class="facts">${x ? `<dt>Your due date</dt><dd>${D.a.dueX}</dd><dt>Course due date</dt><dd class="meta" style="font-weight:400">${D.a.due}</dd><dt>Closes for you</dt><dd>${D.a.closeX}</dd>` : `<dt>Due</dt><dd>${D.a.due}</dd><dt>Closes</dt><dd>${D.a.close}</dd>`}<dt>Format</dt><dd>Handwritten pages or PDF</dd><dt>Status</dt><dd>${rec ? badge("received") : closed ? badge("closed") : badge("notStarted")}</dd></dl>`;
      const panel = closed
        ? notice("neutral", "lock", "Submissions are closed", "This assignment closed Sun, Oct 18 at 11:59 pm ET. If you have a reason for late work, contact Dr. Diane Reyes — only course staff can reopen it.", btn("Message instructor", { cls: "btn", note: "Communication scope is undecided (coverage area 8); route TBD" }))
        : rec
          ? `${notice("success", "check-circle", "Attempt 1 received", `Receipt ${D.receipt.ref} · ${D.receipt.at}`)}<div style="display:grid;gap:8px;margin-top:12px">${btn("View receipt", { cls: "btn primary", go: "S08:received" })}${btn("Check feedback status", { cls: "btn", go: "S09:held" })}${btn("Start a new attempt", { cls: "btn outline", go: "S07:copy", describedby: "s05-newattempt" })}<p class="meta" id="s05-newattempt">Your received attempt stays on record. A new attempt is a separate draft until you submit it.</p></div>`
          : `<div style="display:grid;gap:8px;margin-top:14px">${btn("Scan pages", { cls: "btn primary lg", icon: "camera", go: "S06:ready" })}${btn("Upload PDF or images", { cls: "btn lg", icon: "upload", go: "S07:ready" })}${btn("Use sample PDF", { cls: "btn plain", go: "S07:ready", note: "Showcase sample: a fictional 4-page PDF" })}</div><p class="meta" style="margin-top:10px">You’ll review page order and question tags before anything is sent.</p>`;
      const qs = `<ol class="w-list inset">${D.questions.map((q) => `<li style="align-items:flex-start"><b style="width:28px">${q.id}</b><div class="grow">${q.text}</div><span class="meta">${q.max} pts</span></li>`).join("")}</ol>`;
      return web({
        nav: "courses", crumbs: [["Courses", "S02:current"], ["PHYS 110", "S03:published"], ["Problem Set 4"]], url: this.url(),
        body: webHead(D.a.title, `PHYS 110 · ${D.a.points} points · ${x ? "Due for you " + D.a.dueX : "Due " + D.a.due}`, x ? badge("extension") : "") + courseTabs("work") +
          `<div class="w-grid"><div class="w-stack">
            ${card("Instructions", `<p>Show all working. Write one question per page where you can, and tag each page with the questions it answers when you review your submission.</p><div style="margin-top:12px">${notice("info", "info", "Course AI rule · Limited", "Use AI to clarify concepts only. Show your own working and disclose any assistance.")}</div>`)}
            ${card("Questions", qs)}
            ${card("Files", `<ul class="w-list inset"><li>${ic("doc")}<div class="grow"><span class="title">PS4-questions.pdf</span><div class="meta">2 pages · tagged PDF · text version available</div></div>${btn("Download", { cls: "btn", icon: "download", note: "Sample attachment (fictional)" })}</li><li>${ic("doc")}<div class="grow"><span class="title">Kinematics formula sheet</span><div class="meta">Web page · screen-reader friendly</div></div>${btn("Open", { cls: "btn", note: "Sample attachment (fictional)" })}</li></ul>`)}
          </div><div class="w-stack w-sticky">${card("Your submission", (x ? notice("info", "clock", "An extension applies to you", "Approved by your instructor: +24 hours on due and close dates.") + '<div style="height:12px"></div>' : "") + dates + panel)}</div></div>`,
      });
    },
    ios(st) {
      const x = st === "allowance", rec = st === "received", closed = st === "closed";
      const body = `<p class="eyebrow" style="margin:4px 4px 0">PHYS 110 · ${D.a.points} points</p><h1 class="i-large" style="font-size:calc(28px*var(--wb-scale))">${D.a.title}</h1><div style="margin:4px 4px 0">${rec ? badge("received") : closed ? badge("closed") : x ? badge("extension") : badge("notStarted")}</div>` +
        group(x ? [row("Your due date", D.a.dueX, { bold: true }), row("Course due date", D.a.due), row("Closes for you", D.a.closeX)] : [row("Due", D.a.due, { bold: true }), row("Closes", D.a.close)], { h: "Dates", foot: x ? "Your instructor approved a 24-hour extension." : "" }) +
        (rec ? group([row("Attempt 1 received", `${D.receipt.ref} · Oct 15, 6:30 am`, { go: "S08:received", lead: `<span style="color:var(--wb-success)">${ic("check-circle")}</span>` }), row("Feedback", "Not released yet", { go: "S09:held" })], { h: "Your work" }) : "") +
        group([row("Course AI rule · Limited", "Clarify concepts only; show your own working and disclose assistance.")], { h: "Rules" }) +
        group(D.questions.map((q) => row(`${q.id}. ${q.text}`, `${q.max} points`)), { h: "Questions" }) +
        group([row("PS4-questions.pdf", "Tagged PDF · text version", { lead: ic("doc"), note: "Opens Quick Look preview" })], { h: "Files" });
      const bottom = closed ? `<p class="meta">Closed Sun, Oct 18. Contact Dr. Reyes about late work.</p>` : rec ? btn("Start a new attempt", { cls: "i-btn secondary", go: "S07:copy" }) + `<p class="meta">Attempt 1 stays on record.</p>` : btn("Submit work", { cls: "i-btn", go: "S05:sheet" }) + `<p class="meta">${x ? "Due for you " + D.a.dueX : "Due " + D.a.due}</p>`;
      const sh = st === "sheet" ? sheet("Add your work", "You’ll review pages and tags before submitting.", `<ul class="i-group">${[["camera", "Scan with Camera", "S06:ready"], ["photo", "Choose from Photos", "S07:ready"], ["folder", "Choose from Files", "S07:ready"]].map(([i, t, go]) => `<li>${row(t, "", { lead: `<span style="color:var(--wb-accent-text)">${ic(i)}</span>`, go })}</li>`).join("")}</ul>`) : "";
      return ios({ tab: "courses", back: ["PHYS 110", "S03:published"], title: "Problem Set 4", body, bottom, sheet: sh });
    },
    notes: {
      open: { web: "Instructions left, a sticky submission panel right. The panel states that review happens before sending — scanning can’t accidentally submit.", ios: "Sticky ‘Submit work’ bar shows the governing due date under the button." },
      sheet: { web: "Web shows the three methods inline in the panel (no sheet needed).", ios: "Action sheet: Camera, Photos, Files. ‘Continue draft’ is added when a draft exists. Camera is offered even if denied — S06 handles recovery." },
      allowance: { web: "Personal dates lead; the course date is shown secondary so the student can reconcile with classmates. Who approved it is stated.", ios: "Personal date row is bold; footer explains the extension." },
      received: { web: "Receipt summary first; starting a new attempt is the least prominent action and says the original remains on record.", ios: "Bottom bar switches to a secondary ‘Start a new attempt’." },
      closed: { web: "No submit controls at all. Message names who can reopen it; messaging route is an open decision.", ios: "Bottom bar becomes explanatory text." },
    },
    a11y: ["New-attempt button is described by its consequence text.", "Dates use a description list so label/value pairs are announced together.", "Questions list is ordered with the point value in text."],
  });
})();
