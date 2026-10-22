/* Batch 01 screens S06–S09: capture, review, receipt, feedback. Fictional data only. */
(function () {
  "use strict";
  const { D, ic, badge, btn, link, notice, card, web, webHead, ios, group, row, courseTabs, qchips, page, sheet } = window.K;
  const reg = window.K.reg;
  const crumbsA = [["Courses", "S02:current"], ["PHYS 110", "S03:published"], ["Problem Set 4", "S05:open"]];
  const pagesTray = (n, warnAt = 0) => `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${D.pages.slice(0, n).map(([p, q], i) => `<div>${page(p, q, { warn: warnAt === i + 1, blur: warnAt === i + 1 })}<p class="meta" style="margin-top:4px">Page ${p}${warnAt === i + 1 ? " · may be blurry" : ""}</p></div>`).join("")}</div>`;

  /* ============ S06 SCAN PAGES ============ */
  const guides = `<ul style="display:grid;gap:6px;padding-left:18px;list-style:disc" class="meta"><li>Fit all four corners inside the frame.</li><li>Use even light; avoid shadows across the page.</li><li>Hold still until the edge outline turns solid.</li></ul>`;
  const viewfinder = (label, o = {}) => `<div class="w-camera" role="img" aria-label="${label}"><div style="width:58%;aspect-ratio:8.5/11;position:relative">${page("3", "3", { noLabel: true })}<div style="position:absolute;inset:-6px;border:2.5px solid ${o.warn ? "#f2b252" : "#5cc8c8"};border-radius:8px"></div></div><span class="i-pill${o.warn ? " warn" : ""}" style="position:absolute;top:12px;left:50%;transform:translateX(-50%)">${o.warn ? ic("alert") + "Move closer — edges cut off" : ic("check") + "Page edges found"}</span></div>`;
  reg("S06", {
    states: [
      ["ready", "Camera ready", 0],
      ["undecided", "Permission undecided", 1],
      ["denied", "Camera denied", 2],
      ["offline", "Offline draft", 3],
      ["selected", "Pages selected", 4],
    ],
    url: () => "app.whiteboard.example/courses/phys-110/assignments/ps4/scan",
    web(st) {
      const count = st === "selected" ? 4 : st === "ready" || st === "offline" ? 2 : 0;
      let left;
      if (st === "undecided") left = card("Use your camera to scan", `<p>Your browser will ask for permission to use the camera. Whiteboard uses it only while this page is open, to photograph the pages you choose.</p><div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">${btn("Continue to camera", { cls: "btn primary", icon: "camera", go: "S06:ready", note: "Next: the browser’s own permission prompt appears" })}${btn("Upload files instead", { cls: "btn", icon: "upload", go: "S07:ready" })}</div>`);
      else if (st === "denied") left = card("", notice("warning", "camera", "Camera access is blocked for this site", "You can still submit: upload a PDF or photos of your pages. To scan here instead, allow the camera in your browser’s site settings and reload.", btn("Upload PDF or images", { cls: "btn primary", icon: "upload", go: "S07:ready" }) + btn("How to allow the camera", { cls: "btn", go: "P46:selfservice", note: "P46 Technical help opens at camera permissions; returns here" })) + `<div class="w-drop" style="margin-top:16px">${ic("upload")}<div><b style="color:var(--wb-text)">Drop files here</b><p class="meta">PDF, JPG, PNG or HEIC · up to 25 MB each</p></div></div>`);
      else left = card("", (st === "offline" ? notice("warning", "offline", "You’re offline", "Pages you capture stay in this browser tab until you close it. Nothing is sent until you’re back online and submit.") + '<div style="height:12px"></div>' : "") + viewfinder("Camera preview showing page 3 with edges detected") + `<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-top:14px">${btn("Capture page " + (count + 1), { cls: "btn primary lg", icon: "camera", note: "Captures the framed page; it joins the tray below", go: st === "ready" ? "S06:selected" : undefined })}${btn("Upload instead", { cls: "btn lg", icon: "upload", go: "S07:ready" })}</div>`);
      const right = card(`Pages <span class="meta">${count} captured</span>`, (count ? pagesTray(count, st === "selected" ? 3 : 0) : `<p class="meta">No pages yet.</p>`) +
        (st === "selected" ? `<div style="margin-top:12px">${notice("warning", "alert", "Page 3 may be hard to read", "Retake it, or keep it if the writing is clear.", btn("Retake page 3", { cls: "btn", note: "Replaces page 3 only" }) + btn("Keep", { cls: "btn plain", note: "Keeps page 3 as captured" }))}</div>` : "") +
        `<div style="margin-top:14px">${btn(count ? `Review ${count} pages` : "Review pages", { cls: "btn primary block", go: count ? "S07:ready" : null, disabled: !count, note: count ? null : "Capture or upload at least one page first" })}</div>`) +
        card("Tips", guides);
      return web({ nav: "courses", crumbs: [...crumbsA, ["Scan pages"]], url: this.url(), body: webHead("Scan pages", "Problem Set 4 · Attempt 1 · 5 questions to cover") + `<div class="w-grid"><div class="w-stack">${left}</div><div class="w-stack">${right}</div></div>` });
    },
    ios(st) {
      if (st === "undecided" || st === "denied") {
        const denied = st === "denied";
        const content = `<div style="text-align:center;padding:30px 8px 10px;display:grid;justify-items:center;gap:10px"><span style="color:var(--wb-accent-text)">${ic("camera")}</span><h1 class="i-large" style="font-size:28px">${denied ? "Camera access is off" : "Scan your pages"}</h1><p class="i-sub" style="margin:0">${denied ? "You can still submit from Photos or Files. To scan here, turn on Camera for Whiteboard in Settings." : "Whiteboard uses the camera only while you scan pages you choose to submit."}</p></div>` +
          group(denied ? [row("Choose from Photos", "", { lead: ic("photo"), go: "S07:ready" }), row("Choose from Files", "", { lead: ic("folder"), go: "S07:ready" }), row("Open Settings", "Turn on Camera for Whiteboard", { lead: ic("camera"), note: "Opens iOS Settings → Whiteboard; returns to this screen" })] : [row("Choose from Photos instead", "", { lead: ic("photo"), go: "S07:ready" }), row("Choose from Files instead", "", { lead: ic("folder"), go: "S07:ready" })]);
        const alert = st === "undecided" ? `<div class="i-alert-wrap" role="alertdialog" aria-modal="true" aria-labelledby="s06-alert"><div class="i-alert"><div class="body"><p class="sysnote">iOS system prompt</p><h2 id="s06-alert">“Whiteboard” Would Like to Access the Camera</h2><p>Scan handwritten pages for assignments you choose to submit.</p></div><div class="btns"><button type="button" data-go="S06:denied">Don’t Allow</button><button type="button" data-go="S06:ready">Allow</button></div></div></div>` : "";
        return ios({ back: ["Cancel", "S05:open"], title: "Scan", tabs: false, body: content, alert });
      }
      const n = st === "selected" ? 4 : 2;
      const raw = `<div class="i-camera"><div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px">${btn("Cancel", { cls: "i-iconbtn", go: "S05:open" })}<span style="font-weight:600">Page ${n + 1}</span>${btn(ic("flash"), { cls: "i-iconbtn", label: "Flash: auto", note: "Flash auto / on / off" })}</div>
        ${st === "offline" ? `<div style="margin:0 12px 6px">${notice("warning", "offline", "Offline", "Pages are saved on this iPhone. Nothing is submitted yet.")}</div>` : ""}
        <div class="viewfinder" role="img" aria-label="Camera viewfinder; page edges detected"><div style="width:72%;aspect-ratio:8.5/11;position:relative">${page("3", "3", { noLabel: true })}<div style="position:absolute;inset:-6px;border:2.5px solid #5cc8c8;border-radius:8px"></div></div><span class="i-pill" style="position:absolute;bottom:12px">${ic("check")}Hold still</span></div>
        <div class="i-tray" aria-label="${n} pages captured">${D.pages.slice(0, n).map(([p, q], i) => page(p, q, { warn: st === "selected" && i === 2 })).join("")}</div>
        ${st === "selected" ? `<div style="margin:0 12px 6px">${notice("warning", "alert", "Page 3 may be blurry", "Tap it to retake, or continue.")}</div>` : ""}
        <div class="controls">${btn(ic("photo"), { cls: "i-iconbtn", label: "Add from Photos", go: "S07:ready" })}<button type="button" class="i-shutter" aria-label="Capture page ${n + 1}"${st === "ready" ? ' data-go="S06:selected"' : ""} data-note="Captures the framed page"></button>${btn(`Done (${n})`, { cls: "i-iconbtn", go: "S07:ready" })}</div><div class="i-home" aria-hidden="true" style="background:#0b0d0e"></div></div>`;
      return ios({ raw, dark: true });
    },
    notes: {
      ready: { web: "Viewfinder with live edge feedback; capture and ‘Upload instead’ sit together so the alternative is never hidden.", ios: "Full-screen dark capture. Tray shows captured pages; Done (n) goes to review; Photos is one tap away." },
      undecided: { web: "Pre-permission explainer sets expectations before the browser prompt; upload path offered at the same level.", ios: "App explains, then iOS shows the system alert with the purpose string. ‘Don’t Allow’ leads to the recovery screen, not a dead end." },
      denied: { web: "Blocked camera is a warning, not an error: upload becomes the primary action, settings help is secondary.", ios: "Photos and Files first; Settings deep link last. Students are never trapped." },
      offline: { web: "Web is honest about tab-only storage — it doesn’t promise background queueing.", ios: "Captures persist on device; banner says nothing is submitted." },
      selected: { web: "Quality check flags one page with a reason and lets the student keep or retake it.", ios: "Flagged page outlined in the tray, with text notice." },
    },
    a11y: ["Viewfinder has a text label; edge-detection status is spoken text, not only the outline colour.", "Shutter is a labelled button (‘Capture page n’).", "Every camera state offers a non-camera route at equal or higher prominence."],
  });

  /* ============ S07 REVIEW SUBMISSION ============ */
  const tagsFor = (st) => (st === "incomplete" ? [["1", "1a, 1b"], ["2", "2"], ["3", "3"], ["4", ""]] : D.pages);
  reg("S07", {
    states: [
      ["ready", "Ready", 0],
      ["confirm", "Confirm submit", null, "Added: consequential-action confirmation"],
      ["incomplete", "Incomplete", 1],
      ["none", "No pages", 2],
      ["interrupted", "Interrupted", 3],
      ["copy", "Received copy", 4],
      ["queued", "Queued offline", null, "Added from iOS brief: queued ≠ received"],
    ],
    url: () => "app.whiteboard.example/courses/phys-110/assignments/ps4/review",
    web(st) {
      const pages = tagsFor(st);
      const attempt = st === "copy" ? 2 : 1;
      const missing = st === "incomplete" ? ["4"] : [];
      const banner = st === "copy" ? `<div class="w-banner" role="status">${ic("info")}<span>You’re editing a copy. <b>Attempt 1</b> (received Oct 15, 6:30 am) stays on record. Submitting creates <b>Attempt 2</b>.</span></div>` : "";
      let grid;
      if (st === "none") grid = card("", `<div class="w-drop">${ic("doc")}<div><b style="color:var(--wb-text)">No pages yet</b><p class="meta">Scan or upload your work to review it here.</p></div><div style="display:flex;gap:8px">${btn("Scan pages", { cls: "btn primary", icon: "camera", go: "S06:ready" })}${btn("Upload PDF or images", { cls: "btn", icon: "upload", note: "Opens the file picker" })}</div></div>`);
      else grid = card(`Pages in submission order <span class="meta">${pages.length} pages</span>`, `<ol class="w-pages">${pages.map(([p, q], i) => {
        const bad = !q;
        const id = `s07-tag-${p}`;
        return `<li class="w-page">${page(p, q || "?")}<div class="w-field${bad ? " invalid" : ""}"><label for="${id}">Page ${p} answers</label><select id="${id}"${bad ? ` aria-invalid="true" aria-describedby="${id}-err"` : ""}><option>${q || "Choose questions"}</option></select>${bad ? `<span class="err" id="${id}-err">Tag the question this page answers.</span>` : ""}</div><div class="tools">${btn(ic("rotate"), { cls: "w-iconbtn", label: `Rotate page ${p}`, note: "Rotates 90°" })}${btn(ic("up"), { cls: "w-iconbtn", label: `Move page ${p} earlier`, disabled: i === 0 })}${btn(ic("down"), { cls: "w-iconbtn", label: `Move page ${p} later`, disabled: i === pages.length - 1 })}${btn(ic("trash"), { cls: "w-iconbtn", label: `Remove page ${p}`, note: "Removes with Undo available for 10 seconds" })}</div></li>`;
      }).join("")}<li class="w-page">${btn(ic("plus") + "Add page", { cls: "btn outline block", go: "S06:ready" })}</li></ol>`);
      const canSubmit = st === "ready" || st === "copy" || st === "confirm";
      const summary = card("Summary", `<dl class="facts"><dt>Attempt</dt><dd>${attempt}</dd><dt>Pages</dt><dd>${st === "none" ? 0 : pages.length}</dd><dt>Due</dt><dd>${D.a.due}</dd></dl><h3 class="eyebrow" style="margin:14px 0 6px">Questions covered</h3>${st === "none" ? qchips(false) : qchips(true, missing)}` +
        (st === "incomplete" ? `<div style="margin-top:12px">${notice("error", "alert", "Question 4 has no page", "Tag a page for question 4, or add a page that answers it.")}</div>` : "") +
        (st === "interrupted" ? `<div style="margin-top:12px">${notice("error", "alert", "Upload stopped at page 3 of 4", "Nothing has been received yet. Your pages and tags are saved here.", btn("Retry upload", { cls: "btn primary", icon: "retry", go: "S08:received" }))}</div>` : "") +
        (st === "queued" ? `<div style="margin-top:12px">${notice("warning", "offline", "You’re offline", "Web submissions need a connection. Keep this tab open and submit when you’re back online — nothing has been sent.")}</div>` : "") +
        `<div style="margin-top:14px">${btn(`Submit attempt ${attempt}`, { cls: "btn primary lg block", go: canSubmit ? "S07:confirm" : null, disabled: !canSubmit, describedby: "s07-why" })}</div><p class="meta" id="s07-why" style="margin-top:8px">${canSubmit ? "After you submit, these pages are locked. Editing later creates a new attempt." : st === "incomplete" ? "Tag question 4 to submit." : st === "none" ? "Add at least one page to submit." : st === "interrupted" ? "Retry the upload to finish submitting." : "Connect to the internet to submit."}</p>`);
      const overlay = st === "confirm" ? `<div class="w-dialog" role="dialog" aria-modal="true" aria-labelledby="s07-dlg"><div><h2 id="s07-dlg">Submit attempt ${attempt}?</h2><p>4 pages covering all 5 questions will be sent to PHYS 110. You’ll get a receipt with the time and page list.</p><p class="meta">Due ${D.a.due}.</p><div class="row">${btn("Keep reviewing", { cls: "btn", go: "S07:ready" })}${btn("Submit", { cls: "btn primary", go: "S08:received" })}</div></div></div>` : "";
      return web({ nav: "courses", crumbs: [...crumbsA, ["Review"]], url: this.url(), banner, overlay, body: webHead("Review your submission", "Check order and tags. Nothing is sent until you submit.") + `<div class="w-grid"><div class="w-stack">${grid}</div><div class="w-stack w-sticky">${summary}</div></div>` });
    },
    ios(st) {
      const pages = tagsFor(st);
      const attempt = st === "copy" ? 2 : 1;
      const top = st === "copy" ? notice("info", "info", "Editing a copy", "Attempt 1 stays on record. Submitting creates Attempt 2.") : st === "interrupted" ? notice("error", "alert", "Upload stopped at page 3 of 4", "Nothing received yet. Pages and tags are saved.", btn("Retry", { cls: "btn primary", go: "S08:received" })) : st === "queued" ? notice("warning", "hourglass", "Queued · not received", "Attempt 1 will upload when you’re online. You’ll get a receipt only after Whiteboard confirms it.", btn("Cancel queued upload", { cls: "btn", note: "Returns the attempt to draft; nothing was sent" })) : st === "incomplete" ? notice("error", "alert", "Question 4 has no page", "Tag a page to continue.") : "";
      const list = st === "none" ? `<div class="i-card" style="text-align:center;justify-items:center;margin-top:40px">${ic("doc")}<div class="t">No pages yet</div><p class="meta">Scan or choose your work to review it here.</p>${btn("Scan pages", { cls: "i-btn", go: "S06:ready" })}${btn("Choose from Files", { cls: "i-btn secondary", note: "Opens the Files picker" })}</div>`
        : group(pages.map(([p, q]) => `<div style="width:54px">${page(p, q || "?")}</div><div class="grow"><div class="t b">Page ${p}</div><button type="button" class="rowbtn s" style="color:${q ? "var(--wb-accent-text)" : "var(--wb-error)"}" data-note="Opens a question picker (multi-select)">${q ? "Answers " + q : ic("alert") + " Choose questions"}</button></div><span style="color:var(--wb-text-2)" aria-label="Reorder page ${p}" role="img">${ic("grip")}</span>`), { h: "Pages · drag to reorder", foot: "Swipe left on a page to remove it." });
      const can = st === "ready" || st === "copy" || st === "confirm";
      const bottom = st === "none" ? "" : `<div style="display:flex;justify-content:center">${qchips(true, st === "incomplete" ? ["4"] : [])}</div>` + btn(st === "queued" ? "Waiting for connection…" : `Submit attempt ${attempt}`, { cls: "i-btn", go: can ? "S07:confirm" : null, disabled: !can, note: can ? null : "Unavailable until the issue above is fixed" });
      const sh = st === "confirm" ? sheet(`Submit attempt ${attempt}?`, "4 pages · all 5 questions · PHYS 110", btn("Submit", { cls: "i-btn", go: "S08:received" }), "Keep reviewing") : "";
      return ios({ back: ["Cancel", "S05:open"], title: "Review", tabs: false, trail: btn("Add", { cls: "i-iconbtn", go: "S06:ready" }), body: (top ? top + '<div style="height:6px"></div>' : "") + list, bottom, sheet: sh });
    },
    notes: {
      ready: { web: "Readable thumbnails in order; each has a labelled tag control and rotate/move/remove buttons. Summary repeats exactly what will be sent.", ios: "Vertical list with drag handles; tag line is a button opening a multi-select picker. Coverage chips sit above Submit." },
      confirm: { web: "Modal confirmation restates attempt, pages and coverage; ‘Keep reviewing’ is the default focus.", ios: "Half sheet with the same facts; Cancel is labelled ‘Keep reviewing’." },
      incomplete: { web: "Missing tag shown at the field (aria-invalid + message) and in the summary; Submit disabled with a stated reason.", ios: "Untagged row turns red with icon + text; notice at top." },
      none: { web: "Empty state with both capture routes.", ios: "Same; Add in nav bar also works." },
      interrupted: { web: "Interruption is an error with the critical fact first: nothing received. Retry keeps pages and tags.", ios: "Same notice at top; pages remain below." },
      copy: { web: "Persistent banner explains the new-attempt consequence before any edit.", ios: "Info notice at top; title shows Attempt 2." },
      queued: { web: "Web does not background-queue; it says so plainly.", ios: "iOS may queue with a background upload. ‘Queued · not received’ wording is used everywhere until acknowledgment." },
    },
    a11y: ["Each tag select has a visible label and error association.", "Reorder has button alternatives on web; on iOS, drag also needs VoiceOver ‘Move up/down’ custom actions (spec).", "Disabled Submit remains focusable and is described by its reason."],
  });

  /* ============ S08 SUBMISSION RECEIPT ============ */
  const receiptFacts = (ref, at, attempt, n = 4) => `<dl class="facts"><dt>Receipt</dt><dd><code>${ref}</code></dd><dt>Received</dt><dd>${at}</dd><dt>Assignment</dt><dd>${D.a.title}</dd><dt>Attempt</dt><dd>${attempt}</dd><dt>Pages</dt><dd>${n}</dd><dt>Tags</dt><dd>${D.pages.map(([p, q]) => `p${p}: ${q}`).join(" · ")}${n > 4 ? " · p5: 3" : ""}</dd></dl>`;
  reg("S08", {
    states: [
      ["received", "Received", 0],
      ["interrupted", "Interrupted", 1],
      ["pending", "Pending retry", 2],
      ["earlier", "Earlier attempt", 3],
    ],
    url: () => "app.whiteboard.example/courses/phys-110/assignments/ps4/receipt",
    web(st) {
      const next = card("What happens next", `<ol style="display:grid;gap:10px;list-style:decimal;padding-left:18px"><li data-handoff="S17">Course staff (${D.course.instructor} and TA ${D.course.ta}) grade received work in their own workspace.</li><li>Your instructor releases feedback for the course.</li><li>You’ll get an update when it’s released.</li></ol><div style="margin-top:12px;display:flex;align-items:center;gap:8px">${badge("held")}${btn("Check feedback status", { cls: "btn plain", go: "S09:held" })}</div>`);
      let main;
      if (st === "interrupted") main = card("", `<div style="display:flex;gap:12px;align-items:flex-start"><span style="color:var(--wb-error)">${ic("alert")}</span><div><h2 style="font-size:20px">Not submitted</h2><p style="margin-top:4px">No receipt was issued. Your work hasn’t been received.</p></div></div><div style="margin-top:14px">${notice("neutral", "doc", "Your 4 pages and tags are saved", "You have until " + D.a.due + ".")}</div><div style="display:flex;gap:8px;margin-top:14px">${btn("Retry submission", { cls: "btn primary", icon: "retry", go: "S08:received" })}${btn("Review pages", { cls: "btn", go: "S07:interrupted" })}</div>`);
      else if (st === "pending") main = card("", `<div style="display:flex;gap:12px;align-items:flex-start"><span style="color:var(--wb-warning)">${ic("hourglass")}</span><div><h2 style="font-size:20px">Waiting to send</h2><p style="margin-top:4px">Attempt 1 is saved and will retry automatically. <b>This is not a receipt.</b></p></div></div><div style="display:flex;gap:8px;margin-top:14px">${btn("Retry now", { cls: "btn primary", icon: "retry", go: "S08:received" })}${btn("Review pages", { cls: "btn", go: "S07:queued" })}</div>`);
      else {
        const cur = st === "earlier" ? [D.receipt.ref2, D.receipt.at2, 2, 5] : [D.receipt.ref, D.receipt.at, 1, 4];
        main = card("", `<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px"><span style="color:var(--wb-success)">${ic("check-circle")}</span><div><h2 style="font-size:20px">Submission received</h2><p class="meta">Keep this receipt. It records exactly what PHYS 110 received.</p></div></div>${receiptFacts(...cur)}<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">${btn("Review received pages", { cls: "btn", go: "S07:copy", note: "Read-only view; editing starts a new attempt" })}${btn("Download receipt", { cls: "btn", icon: "download", note: "Downloads a text receipt (fictional)" })}${btn("Back to assignment", { cls: "btn plain", go: "S05:received" })}</div>`) +
          (st === "earlier" ? card("Earlier attempts", `<ul class="w-list inset"><li><div class="grow"><span class="title">Attempt 1 · <code>${D.receipt.ref}</code></span><div class="meta">${D.receipt.at} · 4 pages · kept on record</div></div>${btn("View", { cls: "btn", note: "Opens the preserved Attempt 1 receipt snapshot" })}</li></ul><p class="meta" style="margin-top:8px">Attempt 2 is the current attempt sent for grading.</p>`) : "");
      }
      return web({ nav: "courses", crumbs: [...crumbsA, ["Receipt"]], url: this.url(), body: webHead(st === "interrupted" || st === "pending" ? "Submission status" : "Receipt", D.a.title) + `<div class="w-grid"><div class="w-stack">${main}</div><div class="w-stack">${st === "received" || st === "earlier" ? next : card("Need help?", `<p class="meta">If retrying doesn’t work, technical help can check your connection and files. Your deadline doesn’t change automatically.</p>${btn("Get technical help", { cls: "btn plain", icon: "help", go: "P46:selfservice" })}`)}</div></div>` });
    },
    ios(st) {
      if (st === "interrupted" || st === "pending") {
        const intr = st === "interrupted";
        return ios({ back: ["Problem Set 4", "S05:open"], title: "Status", tabs: false,
          body: `<div style="text-align:center;padding:28px 8px 6px;display:grid;justify-items:center;gap:8px"><span style="color:var(--wb-${intr ? "error" : "warning"})">${ic(intr ? "alert" : "hourglass")}</span><h1 class="i-large" style="font-size:28px">${intr ? "Not submitted" : "Waiting to send"}</h1><p class="i-sub" style="margin:0">${intr ? "No receipt was issued. Your work hasn’t been received." : "Queued · not received. It uploads when you’re online; this is not a receipt."}</p></div>` +
            group([row("4 pages and tags", "Saved on this iPhone", { lead: ic("doc"), go: intr ? "S07:interrupted" : "S07:queued" }), row("Due", D.a.due)]),
          bottom: btn(intr ? "Retry submission" : "Retry now", { cls: "i-btn", go: "S08:received" }) });
      }
      const e = st === "earlier";
      return ios({ back: ["Problem Set 4", "S05:received"], title: "Receipt", tabs: false,
        body: `<div style="text-align:center;padding:20px 8px 6px;display:grid;justify-items:center;gap:6px"><span style="color:var(--wb-success);font-size:30px">${ic("check-circle")}</span><h1 class="i-large" style="font-size:28px">Received</h1><p class="i-sub" style="margin:0">${e ? D.receipt.at2 : D.receipt.at}</p></div>` +
          group([row("Receipt", `<code>${e ? D.receipt.ref2 : D.receipt.ref}</code>`), row("Attempt", e ? "2 · current" : "1"), row("Pages", e ? "5 · all questions tagged" : "4 · all questions tagged", { go: "S07:copy" })], { h: "Details" }) +
          group([row("Feedback", "Not released yet", { go: "S09:held", trail: badge("held", "Held") })], { h: "Next", foot: "Course staff grade received work; your instructor releases feedback." }) +
          (e ? group([row("Attempt 1", `${D.receipt.ref} · Oct 15 · 4 pages`, { note: "Preserved receipt snapshot" })], { h: "Earlier attempts" }) : ""),
        bottom: btn("Done", { cls: "i-btn secondary", go: "S05:received" }) });
    },
    notes: {
      received: { web: "Receipt reads like a document: reference, time, attempt, pages and tags. ‘What happens next’ names who grades and that release is separate. The S08→S17 staff handoff is explained, never shown as a link.", ios: "Confirmation header, grouped facts, feedback status row. Reached only after server acknowledgment." },
      interrupted: { web: "Different heading (‘Not submitted’), different icon and colour, and no reference number — the absence of a receipt is the message.", ios: "Same; Retry is the single primary action." },
      pending: { web: "Pending uses the queued vocabulary and says ‘This is not a receipt.’", ios: "Queued uploads from iOS land here until acknowledged." },
      earlier: { web: "Current receipt on top; earlier receipts are preserved snapshots, listed separately.", ios: "Earlier attempts section below Next." },
    },
    a11y: ["Receipt reference in code style but plain text (copyable, readable).", "Success/failure headings differ in words, not only icon and colour.", "Focus lands on the heading after submission."],
  });

  /* ============ S09 FEEDBACK ============ */
  const total = (re) => (re ? 28 : 27);
  const qNav = (re, cur = "3") => `<ol class="w-list">${D.questions.map((q) => { const m = q.id === "3" && re ? 8 : D.marks[q.id]; return `<li style="${q.id === cur ? "background:var(--wb-accent-tint)" : ""}"><b style="width:28px">${q.id}</b><a href="#S09" class="title grow" data-note="Selects question ${q.id}; the page and comment update"${q.id === cur ? ' aria-current="true"' : ""}>Question ${q.id}</a><span>${m}/${q.max}</span></li>`; }).join("")}</ol>`;
  reg("S09", {
    states: [
      ["held", "Not released", 0],
      ["released", "Released", 1],
      ["rereleased", "Re-released", 2],
      ["excused", "Excused", 3],
      ["ack", "Record pending", 4],
    ],
    url: () => "app.whiteboard.example/courses/phys-110/assignments/ps4/feedback",
    web(st) {
      const crumbs = [["Courses", "S02:current"], ["PHYS 110", "S03:published"], ["Feedback"]];
      if (st === "held" || st === "excused") {
        const ex = st === "excused";
        return web({ nav: "courses", crumbs, url: this.url(), body: webHead(D.a.title, "PHYS 110 · Feedback") + courseTabs("feedback") + `<div class="w-grid"><div class="w-stack">${card("", `<div style="display:flex;gap:12px;align-items:flex-start"><span style="color:var(--wb-neutral)">${ic(ex ? "info" : "eye-off")}</span><div><h2 style="font-size:19px">${ex ? "Excused" : "Feedback hasn’t been released"}</h2><p style="margin-top:4px">${ex ? "This assignment doesn’t count toward your course grade. No score is shown, and it isn’t treated as missing." : "No scores or comments are shown until your instructor releases them for the course."}</p></div></div>`)}</div><div class="w-stack">${card("Your submission", `<dl class="facts"><dt>Attempt</dt><dd>1</dd><dt>Receipt</dt><dd><code>${D.receipt.ref}</code></dd><dt>Received</dt><dd>${D.receipt.at}</dd></dl><div style="margin-top:10px">${btn("View receipt", { cls: "btn", go: "S08:received" })}</div>`)}</div></div>` });
      }
      const re = st === "rereleased";
      const banner = re ? `<div class="w-banner" role="status" style="background:var(--wb-info-bg)">${ic("retry")}<span><b>Feedback updated Thu, Oct 22.</b> Question 3 was regraded (7 → 8). Your total is now 28/30. The Oct 20 release is kept in history.</span>${btn("View history", { cls: "btn", note: "Shows each released snapshot; earlier versions are read-only" })}</div>` : "";
      const r3 = re ? [["Sets up vertical motion with the same time variable", 3, 3], ["Substitutes with the correct sign for g", 3, 3], ["Final answer with units", 2, 2]] : D.rubric3;
      const explain = card(`Question 3 <span>${re ? 8 : 7}/8</span>`, `<p class="meta">${D.questions[3].text}</p><table class="pv-table" style="margin-top:10px"><caption class="sr">Rubric for question 3</caption><thead><tr><th scope="col">Criterion</th><th scope="col">Points</th></tr></thead><tbody>${r3.map(([c, g, m]) => `<tr><td>${c}</td><td>${g}/${m}</td></tr>`).join("")}</tbody></table><h3 class="eyebrow" style="margin:14px 0 6px">Comment · ${D.course.instructor}</h3><p>${re ? "Regraded: your sign for g on page 3 is correct — the error was in my reading of line 4. Full marks." : D.comments["3"]}</p><p class="meta" style="margin-top:8px">${ic("eye")} Marker 1 on page 3, line 4</p>`);
      const evidence = card("Page 3 · Attempt 1", `<div style="max-width:340px;margin:0 auto">${page("3", "3", { mark: [70, 148] })}</div><div style="display:flex;justify-content:center;gap:8px;margin-top:10px">${btn("Read page text", { cls: "btn plain", note: "Full transcription of the page (text alternative)" })}${btn("Enlarge", { cls: "btn plain", note: "Opens the page at full size" })}</div>`);
      const head = `<div class="w-head"><div><h1>${D.a.title}</h1><p class="meta">PHYS 110 · From Attempt 1 · receipt <code>${D.receipt.ref}</code> · ${link("Return to the assignment", { go: "S05:received" })}</p></div><div style="text-align:right"><div style="font-size:30px;font-weight:700;line-height:1">${total(re)}<span class="meta" style="font-size:16px"> / 30</span></div><p class="meta">${re ? D.rerelease : D.release}</p></div></div>`;
      return web({ nav: "courses", crumbs, url: this.url(), banner, body: head + courseTabs("feedback", true) +
        (st === "ack" ? notice("neutral", "hourglass", "Institution record not yet confirmed", "This released feedback is final for the course. Sending the score to the institution’s record system hasn’t been acknowledged yet — that doesn’t change what you see here.") + '<div style="height:16px"></div>' : "") +
        `<div class="w-grid tri">${card("Questions", qNav(re), { flush: true })}<div class="w-stack">${evidence}${card("Overall comment", `<p>${D.overall}</p>`)}</div><div class="w-stack">${explain}${card("How this counts", `<p>${total(re)} of 30 points (${re ? "93" : "90"}%). Counts toward Assignments, 40% of the course grade.</p><div style="margin-top:8px">${btn("Gradebook explanation", { cls: "btn plain", note: "Explains how assignments count toward the course grade; the staff gradebook (S19) is not shown to students" })}</div>${btn("Ask for learning support", { cls: "btn plain", icon: "support", go: "S34:selected" })}`)}</div></div>` });
    },
    ios(st) {
      if (st === "held" || st === "excused") {
        const ex = st === "excused";
        return ios({ tab: "courses", back: ["PHYS 110", "S03:published"], title: "Feedback",
          body: `<div style="text-align:center;padding:30px 8px 6px;display:grid;justify-items:center;gap:8px"><span style="color:var(--wb-neutral)">${ic(ex ? "info" : "eye-off")}</span><h1 class="i-large" style="font-size:26px">${ex ? "Excused" : "Not released yet"}</h1><p class="i-sub" style="margin:0">${ex ? "Doesn’t count toward your grade. No score is shown." : "Scores and comments appear when your instructor releases them."}</p></div>` + group([row("Attempt 1 receipt", D.receipt.ref, { go: "S08:received" })], { h: "Your submission" }) });
      }
      const re = st === "rereleased";
      const picker = `<div class="i-seg" role="group" aria-label="Question">${D.questions.map((q) => `<button type="button" aria-pressed="${q.id === "3"}" data-note="Selects question ${q.id}">${q.id}</button>`).join("")}</div>`;
      return ios({ tab: "courses", back: ["PHYS 110", "S03:published"], title: "Problem Set 4",
        body: (re ? notice("info", "retry", "Updated Oct 22", "Q3 regraded 7 → 8. Earlier release kept in history.") + '<div style="height:10px"></div>' : "") +
          (st === "ack" ? notice("neutral", "hourglass", "Institution record pending", "Your feedback here is final for the course.") + '<div style="height:10px"></div>' : "") +
          `<div class="i-card" style="text-align:center"><div style="font-size:40px;font-weight:700;line-height:1">${total(re)}<span class="meta" style="font-size:18px"> / 30</span></div><p class="meta">${re ? "Updated Oct 22" : "Released Oct 20"} · Attempt 1</p></div><h2 class="i-h">Question</h2>${picker}` +
          `<div class="i-card"><div style="display:flex;justify-content:space-between"><span class="t">Question 3</span><b>${re ? 8 : 7}/8</b></div><div>${page("3", "3", { mark: [70, 148] })}</div><p class="meta" style="text-align:center">Pinch to zoom · ${link("Read page text", { note: "Text alternative" })}</p><p>${re ? "Regraded: your sign for g is correct. Full marks." : D.comments["3"]}</p></div>` +
          group((re ? [["Same time variable", 3, 3], ["Correct sign for g", 3, 3], ["Units", 2, 2]] : [["Same time variable", 3, 3], ["Correct sign for g", 2, 3], ["Units", 2, 2]]).map(([c, g, m]) => row(c, "", { trail: `<span>${g}/${m}</span>` })), { h: "Rubric" }) +
          group([row("Overall comment", D.overall), row("Return to the assignment", "", { go: "S05:received" }), row("How this counts", "Assignments · 40% of course grade", { note: "Explains how assignments count toward the course grade" })], { h: "More" }) });
    },
    notes: {
      held: { web: "Held state shows the receipt facts but nothing about grading progress, drafts or staff comments.", ios: "Same; links to the receipt only." },
      released: { web: "Three panes: question list with marks, the student’s own page with markers, and the rubric/comment for the selected question. Release record (who, when) in the header.", ios: "Score card, then a question segmented control; page, comment and rubric follow for the chosen question." },
      rereleased: { web: "An info banner names the change, old → new values and keeps the prior snapshot in history.", ios: "Inline notice; values update everywhere." },
      excused: { web: "Excused is a distinct outcome, not zero and not missing.", ios: "Same wording." },
      ack: { web: "Downstream record acknowledgment is separate and neutral — it never makes released feedback look provisional.", ios: "Short neutral notice." },
    },
    a11y: ["Rubric is a real table with caption and column headers.", "Annotation markers are numbered and referenced in the comment text.", "Score is text, not an image; percentage is spelled out in ‘How this counts’."],
  });
})();
