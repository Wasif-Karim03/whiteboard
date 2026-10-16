/* Batch 02 teaching screens P47–P49 (proposed): learning-content editor, course files,
   rubric library/builder. Desktop is recommended for P47 and P49; iOS is a mapped subset. */
(function () {
  "use strict";
  const K = window.K;
  const { D2, ic, esc, badge, btn, link, notice, card, webStaff, webHead, ios, group, row, field, toggle, checks, table, ival, sheet, typeIcon, previewBar, progress, desktopNote } = K;
  const reg = K.reg;
  const iStaff = (o) => ios({ tabs: K.STAFFTABS, tab: "teaching", ...o });
  const crumbsC = [["Teaching", "S14:published"], ["PHYS 110", "S14:published"]];
  const fbtn = (text, id) => `<button type="button" class="btn plain" style="padding:0;min-height:0;text-align:left" data-focus="${id}">${text}</button>`;

  /* ============ P47 LEARNING-CONTENT EDITOR ============ */
  // Blocks of the Module 4 lesson "Drawing free-body diagrams".
  const blocks = (st, p) => {
    const iss = st === "issues";
    const B = [
      ["H1", `<h2 style="font-size:26px" id="${p}-b1">Drawing free-body diagrams</h2>`],
      ["P", `<p>A free-body diagram shows every force acting on one object, drawn as arrows from a single point. It is the first step in applying Newton’s second law.</p>`],
      ["H2", `<h2 id="${p}-b3">What a free-body diagram shows</h2>`],
      ["List", `<ul style="list-style:disc;padding-left:20px;display:grid;gap:4px"><li>The object, reduced to a dot</li><li>Each force as an arrow, pointing in its direction</li><li>A label for each force, such as <i>F</i><sub>g</sub> or <i>N</i></li></ul>`],
      [iss ? "H4" : "H3", iss ? `<h4 id="${p}-b5" style="font-size:15px">Example: a book resting on a table</h4>` : `<h3 id="${p}-b5">Example: a book resting on a table</h3>`, iss ? "warn" : ""],
      ["Image", `<div class="w-media" id="${p}-b6" style="aspect-ratio:16/6"><svg viewBox="0 0 200 80" width="60%" aria-hidden="true"><circle cx="100" cy="40" r="5" fill="#fff"/><path d="M100 35V8M100 45v27" stroke="#fff" stroke-width="2.5"/><path d="M94 14l6-7 6 7M94 66l6 7 6-7" fill="none" stroke="#fff" stroke-width="2.5"/><text x="108" y="16" fill="#fff" font-size="9">N</text><text x="108" y="74" fill="#fff" font-size="9">Fg</text></svg></div><p class="meta" style="margin-top:6px">${iss ? `<span style="color:var(--wb-error);font-weight:600">${ic("alert")} No description</span>` : "Description: Dot with an upward arrow labelled N and an equal downward arrow labelled F g."}</p>`, iss ? "err" : ""],
      ["Equation", `<div class="eq" role="math" aria-label="Sum of forces equals mass times acceleration">ΣF = ma</div>`],
      ["Video", `<div class="w-media" id="${p}-b8">${ic("video")}<span style="margin-left:8px">Free-body diagram walkthrough · 4:12</span></div><p class="meta" style="margin-top:6px">Captions ✓ · ${iss ? `<span style="color:var(--wb-error);font-weight:600">${ic("alert")} Transcript missing</span>` : "Transcript ✓"}</p>`, iss ? "err" : ""],
      ["P", `<p id="${p}-b9">For more practice, ${iss ? `<a href="#" data-note="Link text is not descriptive">click here</a>` : `<a href="#" data-note="Opens the worksheet resource">open the force-diagram worksheet</a>`}.</p>`, iss ? "warn" : ""],
    ];
    return B.map(([tag, html, k], i) => `<div class="w-block${k ? " issue" : ""}${i === 5 && st === "autosaved" ? " sel" : ""}"><span class="tag" aria-hidden="true">${tag}</span>${html}</div>`).join("");
  };
  const docOutline = (st) => `<nav aria-label="Document outline"><ul class="w-outline">${[["H1", "Drawing free-body diagrams", 0], ["H2", "What a free-body diagram shows", 1], [st === "issues" ? "H4" : "H3", "Example: a book resting on a table", 2]].map(([h, t, d]) => `<li><span class="item" style="padding-left:${10 + d * 14}px"><span class="meta" style="width:22px">${h}</span><span class="grow">${t}</span>${st === "issues" && h === "H4" ? badge("attention", "Skips H3") : ""}</span></li>`).join("")}</ul></nav>`;
  const a11yRail = (st) => {
    if (st === "issues") return checks([["err", fbtn("Image has no description", "wp47-b6")], ["err", fbtn("Video has no transcript", "wp47-b8")], ["warn", fbtn("Heading jumps from H2 to H4", "wp47-b5")], ["warn", fbtn("Link text “click here” doesn’t say where it goes", "wp47-b9")], ["ok", "Equation has a spoken description"], ["ok", "Colour contrast meets 4.5:1"]], "Accessibility");
    return checks([["ok", "Headings in order (H1 → H2 → H3)"], ["ok", "Image has a description"], ["ok", "Video has captions and a transcript"], ["ok", "Links describe their destination"], ["ok", "Equation has a spoken description"]], "Accessibility");
  };
  reg("P47", {
    states: [
      ["draft", "Draft", 0],
      ["autosaved", "Autosaved", 1],
      ["issues", "Accessibility issues", 2],
      ["preview", "Preview", 3],
      ["published", "Published", 4],
    ],
    url: (st) => "app.whiteboard.example/teach/phys-110/pages/free-body-diagrams/" + (st === "preview" ? "preview" : "edit"),
    web(st) {
      if (st === "preview") {
        const lesson = (narrow) => `<article style="background:var(--wb-surface);border-radius:12px;box-shadow:var(--wb-shadow-1);padding:${narrow ? "18px 16px" : "26px 32px"};${narrow ? "width:340px;flex:none" : "flex:1;min-width:0"}"><p class="eyebrow">Module 4 · Lesson</p><h2 style="font-size:${narrow ? 22 : 26}px;margin:4px 0 10px">Drawing free-body diagrams</h2><p>A free-body diagram shows every force acting on one object, drawn as arrows from a single point.</p><h3 style="font-size:17px;margin:14px 0 6px">What a free-body diagram shows</h3><div class="w-media" style="aspect-ratio:16/7;margin:8px 0">${ic("image")}</div><p class="meta">Dot with an upward arrow labelled N and an equal downward arrow labelled F g.</p></article>`;
        return webStaff({ tool: "builder", crumbs: [...crumbsC, ["Free-body diagrams", "P47:autosaved"], ["Preview"]], url: this.url(st), banner: previewBar("P47:autosaved"), body: webHead("Learner preview", "Draft version · how students will see it once published in Module 4", `<div class="w-seg" role="group" aria-label="Preview width"><button type="button" aria-pressed="true" data-note="Shows desktop and narrow side by side">Both</button><button type="button" aria-pressed="false" data-note="Desktop width only">Desktop</button><button type="button" aria-pressed="false" data-note="Phone width only">Narrow</button></div>`) + `<div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap">${lesson(false)}${lesson(true)}</div><p style="margin-top:14px">${link("Open in the student module view", { go: "S04:available" })}</p>` });
      }
      const pub = st === "published";
      const status = { draft: badge("staffDraft", "Draft · learners can’t see it"), autosaved: badge("autosaved", "Saved · 10:42 am"), issues: badge("attention", "4 accessibility issues"), published: badge("published", "Version 2 published") }[st];
      const toolbar = `<div role="toolbar" aria-label="Insert block" class="w-addblock">${[["heading", "Heading"], ["text", "Text"], ["list", "List"], ["sigma", "Equation"], ["link", "Link"]].map(([i, t]) => btn(t, { cls: "btn", icon: i, note: `Adds a ${t.toLowerCase()} block below the selection` })).join("")}${btn("Image or video", { cls: "btn", icon: "image", go: "P48:ready" })}</div>`;
      const pubAct = st === "issues" ? btn("Publish page", { cls: "btn primary block", icon: "publish", disabled: true, describedby: "wp47-why", note: "2 issues block publishing" }) + `<p class="meta" id="wp47-why">2 issues block publishing; 2 are warnings you can publish with.</p>` : pub ? btn("Publish changes", { cls: "btn primary block", disabled: true, describedby: "wp47-pw", note: "No unpublished changes" }) + `<p class="meta" id="wp47-pw">No changes since version 2.</p>` : btn("Publish page", { cls: "btn primary block", icon: "publish", go: "P47:published", note: "Publishes into Module 4; learners see it when Module 4 opens Mon, Oct 19" });
      const rail = `<div class="w-rail">${card(`Status ${status}`, `<div style="display:grid;gap:8px">${pubAct}${btn("Preview as learner", { cls: "btn block", icon: "eye", go: "P47:preview" })}${btn("Save and return to builder", { cls: "btn plain block", go: "S14:published" })}</div>${st === "autosaved" ? `<p class="meta" style="margin-top:8px">Every edit saves automatically. If you close this tab, you’ll return to this version.</p>` : ""}${pub ? `<p class="meta" style="margin-top:8px">Published Wed, Oct 14 · 5:05 pm ET. Edits make a new draft; learners keep seeing version 2 until you publish again.</p>` : ""}`)}
${card("Accessibility", st === "draft" ? checks([["todo", "Checks run as you add blocks"]], "Accessibility") : a11yRail(st))}
${card("Placement", `<dl class="facts"><dt>Module</dt><dd>4 · Forces and free-body diagrams</dd><dt>Opens</dt><dd>Mon, Oct 19 · 8:00 am ET</dd></dl>`)}${pub ? card("Versions", `<ul class="w-list inset"><li>${ic("history")}<div class="grow"><span class="title">Version 2</span><div class="meta">Published Oct 14 · current for learners</div></div></li><li>${ic("history")}<div class="grow"><span class="title">Version 1</span><div class="meta">Published Oct 12</div></div>${btn("View", { cls: "btn plain", note: "Read-only view of version 1" })}</li></ul>`) : ""}</div>`;
      const canvas = `<div class="w-canvas">${st === "draft" ? blocks(st, "wp47").split('<div class="w-block').slice(0, 4).join('<div class="w-block') + `<div class="w-block sel"><p class="meta">Type, or choose a block below…</p></div>` : blocks(st, "wp47")}${toolbar}</div>`;
      return webStaff({ tool: "builder", crumbs: [...crumbsC, ["Free-body diagrams"]], url: this.url(st), body: webHead("Lesson page", `Module 4 · ${st === "autosaved" ? "All changes saved · 10:42 am ET" : st === "draft" ? "New page · started 10:31 am ET" : "Last edited Thu, Oct 15"}`, btn("Back to course builder", { cls: "btn", go: "S14:published" })) + `<div class="w-grid edit3">${card("Outline", docOutline(st))}<div style="min-width:0">${canvas}</div>${rail}</div>` });
    },
    ios(st) {
      const iss = st === "issues";
      if (st === "preview") return iStaff({ back: ["Edit", "P47:autosaved"], title: "Preview", body: `<div class="i-previewbar" style="margin:0 -16px 12px">${ic("eye")}<span><b>Learner preview</b> · draft</span><button type="button" data-go="P47:autosaved">Done</button></div><div class="i-card"><p class="eyebrow">Module 4 · Lesson</p><div class="t" style="font-size:22px">Drawing free-body diagrams</div><p>A free-body diagram shows every force acting on one object, drawn as arrows from a single point.</p><div class="w-media">${ic("image")}</div><p class="meta">Dot with an upward arrow labelled N and an equal downward arrow labelled F g.</p></div><p class="i-foot">${link("Open in student module view", { go: "S04:available" })}</p>` });
      const kinds = [["H1", "Drawing free-body diagrams"], ["Text", "A free-body diagram shows every force…"], ["H2", "What a free-body diagram shows"], ["List", "3 items"], [iss ? "H4" : "H3", "Example: a book resting on a table", iss ? "Skips H3" : ""], ["Image", iss ? "No description" : "Described", iss ? "Fix" : ""], ["Equation", "ΣF = ma · spoken description"], ["Video", iss ? "Transcript missing" : "Captions · transcript", iss ? "Fix" : ""]];
      const sh = st === "autosaved" ? sheet("Edit Image", "Block 6 · Image", group([ival("File", "Free-body book.png", { go: "P48:ready" }), `<div class="i-fieldrow" style="width:100%"><div class="i-field"><label for="ip47-alt">Description</label><input id="ip47-alt" value="Dot with an upward arrow labelled N and an equal downward arrow labelled F g."></div></div>`]), "Done") : "";
      return iStaff({ back: ["PHYS 110", "S14:published"], title: "Lesson Page", trail: btn("Preview", { cls: "i-iconbtn", go: "P47:preview" }), body: desktopNote("Structured authoring, media alternatives and side-by-side preview are easier on a computer.", "app.whiteboard.example/teach/phys-110/pages/free-body-diagrams/edit") + `<div style="height:12px"></div>` +
        (iss ? notice("error", "alert", "2 issues block publishing", "Image description and video transcript are missing. 2 warnings.") : st === "published" ? notice("success", "check-circle", "Version 2 published", "Edits make a new draft.") : "") +
        group((st === "draft" ? kinds.slice(0, 4) : kinds).map(([k, t, flag]) => row(`<span class="meta" style="display:inline-block;width:52px">${k}</span>${esc(t)}`, "", { trail: flag ? badge("attention", flag) : "", note: "Opens a focused block-edit sheet" })), { h: `Blocks${st === "autosaved" ? " · Saved 10:42 am" : ""}` }) +
        group([row("Add Block", "", { lead: ic("plus"), note: "Heading, text, list, equation, image or video" })]), bottom: st === "issues" ? btn("Publish", { cls: "i-btn", disabled: true, note: "Fix 2 blocking issues" }) : st === "published" ? "" : btn("Publish", { cls: "i-btn", go: "P47:published" }), sheet: sh });
    },
    notes: {
      draft: { web: "Desktop block editor: document outline, canvas, accessibility rail. New page starts as a staff-only draft with the insertion toolbar.", ios: "Mapped editor: block list with focused sheets; a ‘Best on a computer’ card offers the web link (desktop recommended — no native parity claimed)." },
      autosaved: { web: "Persistent ‘Saved · time’ status; autosave keeps the current edit across closing the tab. Selected block outlined.", ios: "Block-edit sheet (image description) shown; Saved time in the section header." },
      issues: { web: "Each issue is tied to its block (highlighted on canvas, flagged in outline) and the rail button moves focus there. Errors (no image description, no transcript) block; warnings (heading skip, ‘click here’) allow publish.", ios: "Banner + flagged rows; Publish disabled with reason." },
      preview: { web: "Learner rendering at desktop and narrow width side by side under the preview bar; links to the student module view (S04).", ios: "Preview banner with Done." },
      published: { web: "Published version is separate from the draft; version list shows what learners currently see.", ios: "Published banner; edits create a new draft." },
    },
    a11y: ["Canvas blocks keep real heading levels so the outline matches the learner page.", "Issue buttons move focus to the affected block.", "Equation blocks require a spoken description (role=math + label in the preview)."],
  });

  /* ============ P48 COURSE FILES AND LEARNING RESOURCES ============ */
  const folders = (cur = "m4") => `<nav aria-label="Folders"><ul class="w-outline">${[["all", "All course files", 5], ["m3", "Module 3 · Projectile motion", 3], ["m4", "Module 4 · Forces", 1], ["asg", "Assignments", 1], ["shared", "Shared with other courses", 0]].map(([k, t, n]) => `<li><span class="item" style="padding-left:10px"${k === cur ? ' aria-current="true"' : ""}>${ic("folder")}<span class="grow">${t}</span><span class="meta">${n}</span></span></li>`).join("")}</ul></nav>`;
  const fileTable = (st, sel) => table("Course files", ["Name", "Type", "Size", "Version", "Used in", "Accessibility"], D2.files.map((f, i) => ({
    sel: i === sel,
    cells: [`${ic(typeIcon(f.type))}${esc(f.name)}`, f.type, `<span class="num">${f.size}</span>`, `v${i === 3 && st === "failed" ? 1 : f.ver}`, `${f.used} place${f.used > 1 ? "s" : ""}`, f.alt ? badge("complete", f.note || "Accessible") : badge("a11yReview")],
  })));
  const inspector = (st) => {
    const f = D2.files[st === "a11y" || st === "failed" || st === "uploading" ? 3 : st === "processing" ? 3 : 0];
    if (st === "a11y")
      return card(`${esc(f.name)}`, `${notice("warning", "eye", "This PDF is a scanned image", "Screen-reader users can’t read it. Add a text version, or upload a tagged PDF.", btn("Add accessible version", { cls: "btn", icon: "upload", note: "Uploads a tagged PDF or text version linked to this file" }))}<dl class="facts" style="margin-top:12px"><dt>Version</dt><dd>1 · uploaded Wed, Oct 14</dd><dt>Access</dt><dd>PHYS 110 students and staff</dd><dt>Used in</dt><dd>Module 4 · Drawing free-body diagrams</dd></dl><div style="display:grid;gap:8px;margin-top:12px">${btn("Insert with issue flagged", { cls: "btn block", go: "P47:issues", note: "Inserts and keeps the accessibility issue visible in the page’s checks" })}${btn("Return to course builder", { cls: "btn plain block", go: "S14:attention" })}</div>`);
    return card(`${esc(f.name)}`, `<div class="w-media" style="aspect-ratio:4/3;margin-bottom:12px">${ic("doc")}</div><dl class="facts"><dt>Version</dt><dd>3 · Oct 9 (v2 Oct 6, v1 Sep 28)</dd><dt>Access</dt><dd>PHYS 110 students and staff</dd><dt>Accessible</dt><dd>Tagged PDF ✓</dd></dl>
<h3 style="font-size:14px;margin:12px 0 4px">Used in</h3><ul class="w-list inset"><li>${ic("doc")}<div class="grow">Module 3 · Projectile motion page</div></li><li>${ic("pencil")}<div class="grow">Problem Set 4 · instructions</div></li></ul>
<div style="display:grid;gap:8px;margin-top:12px">${btn("Insert into page", { cls: "btn primary block", go: "P47:autosaved" })}${btn("Attach to assignment", { cls: "btn block", go: "S15:published" })}${btn("Replace with new version", { cls: "btn block", icon: "history", go: "P48:uploading", note: "Uploads version 4; versions 1–3 stay in history and both places update" })}${btn("Course access…", { cls: "btn plain block", note: "Course only, shared with chosen courses, or staff only" })}</div>`);
  };
  reg("P48", {
    states: [
      ["uploading", "Uploading", 0],
      ["processing", "Processing", 1],
      ["ready", "Ready", 2],
      ["a11y", "Accessibility review needed", 3],
      ["failed", "Failed", 4],
    ],
    url: () => "app.whiteboard.example/teach/phys-110/files",
    web(st) {
      const up = { uploading: `<div class="w-upload">${ic("doc")}<div><b>Force-diagram worksheet (tagged).pdf</b> <span class="meta">· 1.6 of 2.6 MB · about 20 seconds left</span></div>${btn("Cancel", { cls: "btn plain", go: "P48:ready", note: "Stops the upload; nothing is replaced" })}${progress(62, "Uploading Force-diagram worksheet, 62 percent")}</div>`,
        processing: `<div class="w-upload">${ic("hourglass")}<div><b>Force-diagram worksheet (tagged).pdf</b> ${badge("processing", "Checking text and making a preview")}</div><span></span></div>`,
        failed: `<div class="w-upload">${ic("alert")}<div><b>Force-diagram worksheet (tagged).pdf</b> ${badge("failed")}<div class="meta">Connection lost at 41%. The current version 1 is unchanged.</div></div><span style="display:flex;gap:6px">${btn("Retry", { cls: "btn primary", icon: "retry", go: "P48:uploading" })}${btn("Remove", { cls: "btn plain", go: "P48:a11y", note: "Removes the failed upload from the list only" })}</span></div>` }[st];
      const sel = st === "ready" ? 0 : 3;
      return webStaff({ tool: "files", crumbs: [...crumbsC, ["Files"]], url: this.url(st), body: webHead("Course files", "PHYS 110 · 5 files · 88 MB", `<div style="display:flex;gap:8px">${btn("Upload", { cls: "btn primary", icon: "upload", go: "P48:uploading" })}${btn("Return to course builder", { cls: "btn", go: "S14:published" })}</div>`) +
        (up ? card("Uploads", up, { label: "Uploads" }) + '<div style="height:16px"></div>' : "") +
        `<div class="w-grid edit3">${card("", folders(st === "ready" ? "all" : "m4"))}${card("", fileTable(st, sel), { flush: true })}${inspector(st)}</div>` });
    },
    ios(st) {
      if (st === "ready")
        return iStaff({ back: ["Files", "P48:a11y"], title: "", body: `<div class="i-hero"><span class="glyph">${ic("doc")}</span><h1 style="font-size:20px">Projectile motion lab sheet.pdf</h1><p class="i-sub">PDF · 1.2 MB · version 3</p></div>${group([ival("Access", "PHYS 110"), ival("Accessible", "Tagged PDF")], { h: "Details" })}${group([row("Module 3 · Projectile motion page", "", { lead: ic("doc") }), row("Problem Set 4 · instructions", "", { lead: ic("pencil"), go: "S15:published" })], { h: "Used in" })}${group([row("Version 2", "Oct 6", { lead: ic("history") }), row("Version 1", "Sep 28", { lead: ic("history") })], { h: "History" })}`, bottom: btn("Insert into Page", { cls: "i-btn", go: "P47:autosaved" }) + btn("Replace with New Version", { cls: "i-btn secondary", go: "P48:uploading" }) });
      const q = { uploading: row("Force-diagram worksheet.pdf", `62% · 1.6 of 2.6 MB`, { lead: ic("upload"), trail: `<span style="width:70px">${progress(62, "Uploading, 62 percent")}</span>` }), processing: row("Force-diagram worksheet.pdf", "Processing · making preview", { lead: ic("hourglass") }), failed: row("Force-diagram worksheet.pdf", "Upload failed at 41% · will retry when online", { lead: `<span style="color:var(--wb-error)">${ic("alert")}</span>`, trail: btn("Retry", { cls: "btn", go: "P48:uploading" }) }) }[st];
      return iStaff({ back: ["PHYS 110", "S14:published"], title: "Files", trail: btn("", { cls: "i-iconbtn", icon: "plus", label: "Add file", note: "Opens the document picker", go: "P48:uploading" }), body: (q ? group([q], { h: "Upload queue", foot: st === "failed" ? "The file stays in the queue. Offline uploads wait until you’re connected; nothing is replaced until upload finishes." : "Uploads continue if you leave this screen." }) : "") +
        group(D2.files.map((f, i) => row(esc(f.name), `${f.type} · ${f.size} · v${f.ver}`, { lead: ic(typeIcon(f.type)), trail: f.alt ? "" : badge("a11yReview", "Needs text"), go: i === 0 ? "P48:ready" : i === 3 ? "P48:a11y" : null, note: "Resource detail" })), { h: "Course files" }), sheet: st === "a11y" ? sheet("Force-diagram worksheet.pdf", "Scanned PDF · screen readers can’t read it", group([row("Upload accessible version", "Tagged PDF or text", { lead: ic("upload"), go: "P48:uploading" }), row("Insert with issue flagged", "Page checks will show it", { lead: ic("alert"), go: "P47:issues" })])) : "" });
    },
    notes: {
      uploading: { web: "Upload panel above the manager with name, progress (text + bar), time left and Cancel. The replaced file stays current until upload finishes.", ios: "Resumable upload queue at the top of the list; continues if the screen is left." },
      processing: { web: "Processing is its own neutral status (preview/text extraction pending), never shown as ready.", ios: "Queue row shows Processing." },
      ready: { web: "Folder tree, sortable table and inspector: versions, where it’s used, access scope and accessible status; Insert (P47), Attach (S15), Replace creates a version.", ios: "Resource-detail screen with usage and history; Insert and Replace in the bottom bar." },
      a11y: { web: "Missing alternative is a named status with the reason (scanned image) and fix; inserting is allowed only with the issue flagged into the page’s checks.", ios: "Action sheet with the two routes." },
      failed: { web: "Failure says where it stopped and that the current version is unchanged; Retry keeps the file context.", ios: "Failed row stays in the queue with Retry; offline uploads wait." },
    },
    a11y: ["File table has a caption and row headers; selection is aria-current.", "Progress is a progressbar with a text label and the percentage also in text.", "Accessibility status is a word badge, not a colour."],
  });

  /* ============ P49 RUBRIC LIBRARY AND BUILDER ============ */
  const R = D2.rubric;
  const FB = { title: "Free-body diagram quality", target: "Problem Set 5 · question 2 · 6 points", criteria: [["C1", "All forces drawn and labelled", [3, 2, 0]], ["C2", "Directions and relative sizes correct", [2, 1, 0]], ["C3", "Net force stated", [1, 0, 0]]] };
  const KN = { criteria: R.criteria.map((c, i) => [c.id, ["Sets up vertical motion with the same time variable", "Substitutes with the correct sign for g", "Final answer with units"][i], c.pts]) };
  const library = (cur) => `<nav aria-label="Rubric library"><p class="eyebrow" style="padding:4px 10px">Course · PHYS 110</p><ul class="w-outline">${[["kin", "Kinematics problem-solving", "v2 · in use"], ["fbd", "Free-body diagram quality", "Draft"]].map(([k, t, s]) => `<li>${link(`${ic("table")}<span class="grow">${t}<span class="meta" style="display:block">${s}</span></span>`, { cls: "item", go: k === "kin" ? "P49:inuse" : "P49:ready" }).replace('class="item"', `class="item" style="padding-left:10px"${k === cur ? ' aria-current="true"' : ""}`)}</li>`).join("")}</ul><p class="eyebrow" style="padding:12px 10px 4px">Personal</p><ul class="w-outline"><li><span class="item" style="padding-left:10px">${ic("table")}<span class="grow">Lab report basics<span class="meta" style="display:block">v4</span></span></span></li></ul><div style="margin-top:10px">${btn("New rubric", { cls: "btn block", icon: "plus", go: "P49:draft" })}</div></nav>`;
  const matrix = (crit, o = {}) => {
    const total = crit.reduce((n, [, , p], i) => n + (o.blank && i === 2 ? 0 : p[0]), 0);
    return `<table class="w-matrix"><caption class="sr">Criteria by performance level</caption><thead><tr><th scope="col">Criterion</th>${R.levels.map((l) => `<th scope="col">${l}</th>`).join("")}</tr></thead><tbody>${crit.map(([id, name, pts], i) => `<tr><th scope="row"><span class="meta">${id}</span> ${esc(name)}</th>${pts.map((p, j) => {
      const bad = o.blank && i === 2 && j === 0;
      const chg = o.change && i === 1 && j === 1;
      return `<td>${bad ? `<span class="pts bad">— ${ic("alert")}</span><div class="meta" style="color:var(--wb-error);font-weight:600">Enter points</div>` : chg ? `<span class="w-diff"><span class="pts old">${p}</span>${ic("chev-r")}<span class="pts" style="border-color:var(--wb-info);box-shadow:0 0 0 1px var(--wb-info)">1</span></span>` : `<span class="pts">${p}</span>`}<div class="meta" style="margin-top:4px">${["Fully meets", "Partly meets", "Not shown"][j]}</div></td>`;
    }).join("")}</tr>`).join("")}</tbody><tfoot><tr><th scope="row">Total (highest levels)</th><td colspan="3"${o.blank ? ' style="color:var(--wb-error)"' : ""}>${total} of ${o.target} points${o.blank ? " · must equal the question" : ""}</td></tr></tfoot></table>`;
  };
  reg("P49", {
    states: [
      ["draft", "Draft", 0],
      ["invalid", "Invalid", 1],
      ["ready", "Ready", 2],
      ["inuse", "In use", 3],
      ["change", "Change proposed", 4],
    ],
    url: (st) => "app.whiteboard.example/teach/phys-110/rubrics/" + (st === "inuse" || st === "change" ? R.id : "rub-fbd-1"),
    web(st) {
      const kin = st === "inuse" || st === "change";
      const crit = kin ? KN.criteria : FB.criteria;
      const title = kin ? R.title : FB.title;
      const status = { draft: badge("staffDraft", "Draft"), invalid: badge("attention", "Total doesn’t match"), ready: badge("ready", "Valid · ready to save"), inuse: badge("inUse", "In use · version 2"), change: badge("changed", "Change proposed · v3") }[st];
      const center = card(`${esc(title)} ${status}`, `${kin ? `<p class="meta" style="margin-bottom:10px">Criterion IDs stay the same when wording changes.${st === "inuse" ? " Scoring is locked while in use; propose a change to edit points." : ""}</p>` : ""}<div class="w-tablewrap">${matrix(crit, { blank: st === "invalid", change: st === "change", target: kin ? 8 : 6 })}</div>${kin ? "" : `<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">${btn("Add criterion", { cls: "btn", icon: "plus", note: "Adds C4 with three levels" })}${btn("Add level", { cls: "btn", icon: "plus", note: "Adds a level to every criterion" })}</div>`}`);
      let side;
      if (st === "change")
        side = card("Impact preview · required", `<p>Changing <b>C2 · Partial</b> from 2 to 1 point affects grading on <b>Problem Set 4, question 3</b>.</p><ul style="display:grid;gap:6px;padding-left:18px;list-style:disc;margin-top:8px"><li>39 submissions graded with version 2.</li><li>14 of them scored “Partial” on C2 and would lose 1 point.</li><li>Feedback isn’t released yet, so no student has seen these scores.</li><li>Problem Set 3 keeps its released version 1 snapshot.</li></ul>
<fieldset style="border:0;padding:0;margin:12px 0 0;display:grid;gap:6px"><legend style="font-weight:600;margin-bottom:4px">Apply to</legend><label for="wp49-a1" style="display:flex;gap:8px"><input type="radio" name="wp49-apply" id="wp49-a1" checked> New grading only — 39 graded keep version 2</label><label for="wp49-a2" style="display:flex;gap:8px"><input type="radio" name="wp49-apply" id="wp49-a2"> Re-score the 39 with version 3 — goes to grading review</label></fieldset>
<div style="display:grid;gap:8px;margin-top:12px">${btn("Save as version 3", { cls: "btn primary block", go: "P49:inuse", note: "Creates v3; option chosen above decides existing grades" })}${btn("Cancel change", { cls: "btn plain block", go: "P49:inuse" })}</div>`);
      else if (st === "inuse")
        side = card("Used in", `<ul class="w-list inset">${R.uses.map(([a, q, s]) => `<li>${ic("pencil")}<div class="grow"><span class="title">${a}</span><div class="meta">${q} · ${s}</div></div></li>`).join("")}</ul><div style="display:grid;gap:8px;margin-top:12px">${btn("Propose a change", { cls: "btn primary block", icon: "pencil", go: "P49:change" })}${btn("Use for grading", { cls: "btn block", go: "S17:received", note: "Opens S17 Grading with this published version; requires grading permission" })}${btn("Duplicate as new rubric", { cls: "btn plain block", icon: "copy", note: "Copies into a new draft; no link to existing grades" })}</div>`);
      else
        side = card("Validation", (st === "invalid" ? checks([["err", "C3 · Complete has no points"], ["err", "Highest levels total 5; question 2 is worth 6"], ["ok", "Every criterion has 3 ordered levels"]], "Validation") : st === "draft" ? checks([["todo", "Attach to a question to check its total"], ["ok", "Every criterion has 3 ordered levels"]], "Validation") : checks([["ok", "Highest levels total 6 of 6"], ["ok", "Levels ordered high to low"], ["ok", "Each level has a description"]], "Validation")) +
          `<dl class="facts" style="margin-top:12px"><dt>For</dt><dd>${st === "draft" ? "Not attached yet" : FB.target}</dd></dl><div style="display:grid;gap:8px;margin-top:12px">${st === "ready" ? btn("Save rubric", { cls: "btn primary block", note: "Saves version 1 to the course library" }) + btn("Attach to Problem Set 5", { cls: "btn block", go: "S15:draft" }) : btn("Save rubric", { cls: "btn primary block", disabled: true, describedby: "wp49-why", note: st === "draft" ? "Attach to a question first" : "Fix 2 issues first" }) + `<p class="meta" id="wp49-why">${st === "draft" ? "Attach it to a question to validate the total." : "Fix 2 issues to save."}</p>` + btn(st === "draft" ? "Attach to a question" : "Validate totals", { cls: "btn block", go: st === "draft" ? "P49:invalid" : "P49:ready", note: st === "invalid" ? "Design review: shows the result after fixing" : "Design review: attaches to PS5 question 2 and validates" })}</div>`);
      const preview = card("Learner preview", `<p class="meta" style="margin-bottom:8px">Students see criteria and levels with feedback, after release.</p><ul class="w-list inset">${crit.map(([id, n, p]) => `<li><div class="grow"><span class="title">${esc(n)}</span><div class="meta">Up to ${p[0]} points</div></div></li>`).join("")}</ul>`);
      return webStaff({ tool: "rubrics", crumbs: [...crumbsC, ["Rubrics"]], url: this.url(st), body: webHead("Rubrics", "Reusable criteria with stable IDs and validated totals", btn("Back to assignment", { cls: "btn", go: "S15:published" })) + `<div class="w-grid edit3">${card("", library(kin ? "kin" : "fbd"))}<div style="display:grid;gap:16px;min-width:0">${center}${preview}</div><div class="w-rail">${side}</div></div>` });
    },
    ios(st) {
      const kin = st === "inuse" || st === "change";
      const crit = kin ? KN.criteria : FB.criteria;
      const top = st === "invalid" ? notice("error", "alert", "Total doesn’t match", "C3 has no points; highest levels total 5 of 6.") : st === "change" ? notice("info", "history", "Change proposed", "C2 Partial 2 → 1 affects 14 graded submissions. Review the impact on a computer before saving.") : "";
      return iStaff({ back: ["PHYS 110", "S14:published"], title: "Rubric", body: desktopNote("Editing the full criteria-by-level matrix and comparing totals is easier on a computer.", "app.whiteboard.example/teach/phys-110/rubrics") + '<div style="height:12px"></div>' + top +
        group(crit.map(([id, n, p], i) => row(`<span class="meta">${id}</span> ${esc(n)}`, st === "invalid" && i === 2 ? "Complete level has no points" : `${p.join(" / ")} points`, { note: "Criterion detail: levels, descriptions and points (read-only on iPhone while in use)", trail: st === "invalid" && i === 2 ? badge("attention", "Fix") : "" })), { h: `${esc(kin ? R.title : FB.title)} · ${kin ? "v2 in use" : "draft"}` }) +
        (kin ? group(R.uses.map(([a, q, s]) => row(a, `${q} · ${s}`, { lead: ic("pencil") })), { h: "Used in" }) : "") +
        group([row("Learner Preview", "Read-only", { lead: ic("eye"), note: "Read-only learner preview" }), ...(kin ? [] : [row("Attach to Assignment", "", { lead: ic("link"), go: "S15:draft" })])]) });
    },
    notes: {
      draft: { web: "Library rail (course and personal), criterion × level matrix, validation rail and learner preview. Save waits for the rubric to be attached so its total can be checked.", ios: "Mapped summary with criterion drill-down; desktop recommended for the matrix (card offers the web link)." },
      invalid: { web: "Missing level points flagged in the cell; total vs question points shown in the footer row; rail lists the two blocking issues.", ios: "Error banner and flagged criterion row." },
      ready: { web: "Totals validate (6 of 6); Save and ‘Attach to Problem Set 5’ (S15) become available.", ios: "Summary + attach row." },
      inuse: { web: "In-use rubric is locked for scoring; usage list shows versions per assignment (released work keeps its snapshot). ‘Use for grading’ is the P49→S17 route.", ios: "Usage list; learner preview read-only." },
      change: { web: "Changing an in-use scoring rule shows the old→new value inline and requires an impact preview before saving as a new version; the person chooses future-only or re-score (which goes to grading review).", ios: "Banner states impact and defers the decision to the web — no native parity claimed." },
    },
    a11y: ["Matrix is a real table with row and column headers and a caption.", "Old → new values are announced as text (‘was 2, now 1’) in the spec, not only struck through.", "Apply-to choice is a fieldset with a legend."],
  });
})();
