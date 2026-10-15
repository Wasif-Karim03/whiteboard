(function () {
  "use strict";
  const W = window.WB,
    one = (s, r = document) => r.querySelector(s),
    all = (s, r = document) => [...r.querySelectorAll(s)];
  let journey = null,
    step = 0,
    lastTrigger = null;
  const actorFor = (id) => W.actorFor(id);
  const stageFor = (id) =>
    one(
      '[data-stage="' +
        W.sections.find((x) => x.screens.includes(id))?.id +
        '"]',
    );
  const announce = (t) => {
    one("#global-status").textContent = t || "";
  };
  function identity(el) {
    if (!el) return "";
    return JSON.stringify({
      tag: el.tagName,
      action: el.dataset?.action,
      bind: el.dataset?.bind,
      open: el.dataset?.openScreen,
      screen: el.dataset?.screen,
      params: Object.fromEntries(
        Object.entries(el.dataset || {}).filter(
          ([k]) => !["action", "bind", "openScreen", "screen"].includes(k),
        ),
      ),
      value: el.type === "radio" ? el.value : undefined,
    });
  }
  function focusSnapshot() {
    const el = document.activeElement,
      stage = el?.closest("[data-stage]");
    return {
      el,
      id: el?.id,
      key: identity(el),
      stage: stage?.dataset.stage,
      start: el?.selectionStart,
      end: el?.selectionEnd,
    };
  }
  function restoreFocus(a) {
    if (a.el?.isConnected) return;
    const host = a.stage ? one('[data-stage="' + a.stage + '"]') : document;
    let el = all("button,a,input,select,textarea", host).find(
      (x) => identity(x) === a.key,
    );
    if (!el && a.id) el = document.getElementById(a.id);
    if (!el && a.stage) el = one(".screen-head h3", host);
    if (el) {
      if (el.tagName === "H3") el.tabIndex = -1;
      el.focus({ preventScroll: true });
      try {
        if (typeof a.start === "number") el.setSelectionRange(a.start, a.end);
      } catch {}
    }
  }
  const guideHints = {
    J1: "Use the workspace actions to submit; Next only changes the view. Feedback stays held until the instructor reviews and releases it.",
    J2: "Review every question, complete the submission review, then preview and release the exact feedback.",
    J3: "Resolve constraints, approve the proposal and apply the source change before checking the calendar.",
    J4: "Work through the draft, booking, funding and event approval before publishing.",
    J5: "Choose the service, create the referral, then accept and resolve it before returning to the student view.",
    J6: "Inspect exceptions, map required fields, review the copy destination and reconcile the source records.",
  };
  function guideHTML() {
    if (!journey) return "";
    const j = W.journeys[journey];
    return `<div class="local-guide"><div><strong>${W.e(j.title)} · ${step + 1}/${j.steps.length}</strong><p>${W.e(j.steps[step][1])}</p><p class="small muted">${W.e(guideHints[journey])}</p></div><div class="actions"><button class="button" data-journey-back${step === 0 ? " disabled" : ""}>Previous step</button><button class="button" data-journey-next${step === j.steps.length - 1 ? " disabled" : ""}>Next view</button><button class="button quiet" data-reset>Reset this example</button>${journey === "J1" && step === j.steps.length - 1 ? '<button class="button primary" data-start-journey="J2">Continue as instructor</button>' : ""}</div></div>`;
  }
  function renderAll() {
    const a = focusSnapshot();
    all("[data-stage]").forEach((stage) => {
      const id = stage.dataset.screen;
      if (!W.available.includes(id)) return;
      const panel = one("[data-panel]", stage),
        html = W.render(id);
      if (panel.dataset.rendered !== html) {
        panel.innerHTML = html;
        panel.dataset.rendered = html;
      }
      all(".stage-tabs button", stage).forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.screen === id)),
      );
      one(".stage-role", stage).textContent =
        "Sample role: " + W.renderers[id].role;
      let guide = one("[data-local-guide]", stage);
      if (!guide) {
        guide = document.createElement("div");
        guide.dataset.localGuide = "";
        stage.append(guide);
      }
      guide.innerHTML =
        journey && W.journeys[journey].steps[step][0] === id ? guideHTML() : "";
    });
    const hero = one("[data-hero-records]");
    if (hero && W.heroHTML) {
      const html = W.heroHTML(W.state);
      if (hero.dataset.rendered !== html) {
        hero.innerHTML = html;
        hero.dataset.rendered = html;
      }
    }
    restoreFocus(a);
  }
  function notify(message, stage) {
    if (!message) return;
    const host = stage || one("[data-stage]"),
      out = host && one(".stage-feedback", host);
    if (out) out.textContent = message;
    announce(message);
  }
  function openScreen(id, scroll = true, push = true) {
    if (!W.available.includes(id)) return;
    const stage = stageFor(id);
    if (!stage) return;
    stage.dataset.screen = id;
    W.ui.actor = actorFor(id);
    if (journey) {
      const i = W.journeys[journey].steps.findIndex(
        (x, i) => x[0] === id && i >= step,
      );
      if (i >= 0) step = i;
    }
    renderAll();
    if (push && location.hash !== "#" + id) {
      try {
        history.pushState({ screen: id }, "", "#" + id);
      } catch {
        location.hash = id;
      }
    }
    if (scroll) {
      stage.closest(".chapter").scrollIntoView({
        block: "start",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
      const title = one(".screen-head h3", stage);
      if (title) {
        title.tabIndex = -1;
        title.focus({ preventScroll: true });
      }
    }
    updateStep();
  }
  function resetJourney(id) {
    const d = W.defaults,
      s = W.state;
    W.fieldErrors = {};
    if (id === "J1" || id === "J2") {
      const keep =
        id === "J2" &&
        s.assignment.id === d.assignment.id &&
        s.submission.status === "received"
          ? W.clone(s.submission)
          : null;
      const prefs = {
        prefs: s.course.prefs,
        quiet: s.course.quiet,
        channel: s.course.channel,
      };
      for (const key of [
        "assignment",
        "assessment",
        "teaching",
        "submissions",
        "people",
        "course",
      ])
        s[key] = W.clone(d[key]);
      Object.assign(s.course, prefs);
      s.submission = keep || W.clone(d.submission);
      if (id === "J1") {
        s.submission.status = "draft";
        s.submission.pages = [];
        s.assessment.graded = s.assessment.graded.filter((x) => x !== "aisha");
        s.assessment.reviewedQuestions.aisha = [];
      }
    } else if (id === "J3") {
      for (const k of ["proposal", "scheduleApplied", "meeting"])
        s.campus[k] = W.clone(d.campus[k]);
    } else if (id === "J4" || id === "J5") {
      if (W.resetCampusJourney) W.resetCampusJourney(s, id);
    } else if (id === "J6") {
      if (W.resetInstitutionJourney) W.resetInstitutionJourney(s);
      for (const k of Object.keys(d.teaching).filter(
        (k) => k.startsWith("copy") || k === "destinationCourse",
      ))
        s.teaching[k] = W.clone(d.teaching[k]);
    }
  }
  function updateStep() {
    if (!journey) return;
    const j = W.journeys[journey];
    one(".journey-step").textContent =
      step + 1 + " of " + j.steps.length + " · " + j.steps[step][1];
    all("[data-journey-back]").forEach((b) => (b.disabled = step === 0));
    all("[data-journey-next]").forEach(
      (b) => (b.disabled = step === j.steps.length - 1),
    );
  }
  function startJourney(id) {
    journey = id;
    step = 0;
    one("#journey-select").value = id;
    resetJourney(id);
    openScreen(W.journeys[id].steps[0][0]);
    announce("Example ready. Follow the action guidance beside the workspace.");
  }
  function download(data) {
    const url = URL.createObjectURL(
        new Blob([data.text], { type: "text/plain" }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = data.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function run(name, p, stage) {
    const invalid =
      stage &&
      all("[data-bind]", stage).find((el) => W.fieldErrors[el.dataset.bind]);
    if (invalid) {
      const message = W.fieldErrors[invalid.dataset.bind];
      invalid.setAttribute("aria-invalid", "true");
      invalid.focus();
      notify(message, stage);
      return;
    }
    try {
      W.ui.actor = stage ? actorFor(stage.dataset.screen) : undefined;
      const result = W.dispatch(name, p);
      renderAll();
      if (result.download) download(result.download);
      if (result.go) openScreen(result.go);
      const destination = result.go ? stageFor(result.go) : stage;
      notify(result.message, destination);
      if (result.errorPath) {
        const el = all("[data-bind]", destination || document).find(
          (x) => x.dataset.bind === result.errorPath,
        );
        if (el) {
          el.setAttribute("aria-invalid", "true");
          const error = document.getElementById(el.id + "-error");
          if (error) error.textContent = result.message;
          el.focus();
        }
      }
    } catch (err) {
      notify(
        "Check the entered values and try again. Your other sample records remain available.",
        stage,
      );
      console.error(err);
    }
  }
  document.addEventListener("click", (event) => {
    const target = event.target.closest("button,a");
    if (!target) return;
    const stage = target.closest("[data-stage]");
    if (target.dataset.openScreen) {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        (event.button !== undefined && event.button !== 0)
      )
        return;
      event.preventDefault();
      openScreen(target.dataset.openScreen);
      return;
    }
    if (target.dataset.action) {
      if (target.dataset.action === "go") {
        openScreen(target.dataset.screen);
        return;
      }
      run(target.dataset.action, { ...target.dataset }, stage);
      return;
    }
    if (target.dataset.screen) {
      openScreen(target.dataset.screen, false);
      return;
    }
    if (target.dataset.startJourney) {
      startJourney(target.dataset.startJourney);
      return;
    }
    if (target.hasAttribute("data-journey-start"))
      startJourney(one("#journey-select").value);
    else if (target.hasAttribute("data-reset"))
      startJourney(journey || one("#journey-select").value);
    else if (
      journey &&
      (target.hasAttribute("data-journey-next") ||
        target.hasAttribute("data-journey-back"))
    ) {
      step = Math.max(
        0,
        Math.min(
          W.journeys[journey].steps.length - 1,
          step + (target.hasAttribute("data-journey-next") ? 1 : -1),
        ),
      );
      openScreen(W.journeys[journey].steps[step][0]);
    }
  });
  function bind(el, render) {
    const stage = el.closest("[data-stage]");
    W.ui.actor = stage ? actorFor(stage.dataset.screen) : undefined;
    const ok = W.set(
      el.dataset.bind,
      el.type === "checkbox" ? el.checked : el.value,
    );
    const error = W.fieldErrors[el.dataset.bind] || "";
    el.setAttribute("aria-invalid", String(!ok));
    const out = document.getElementById(el.id + "-error");
    if (out) out.textContent = error;
    if (render && ok) renderAll();
    if (error) announce(error);
  }
  document.addEventListener("input", (event) => {
    if (event.target.dataset.bind) bind(event.target, false);
  });
  document.addEventListener("change", (event) => {
    const el = event.target;
    if (el.dataset.bind) bind(el, true);
    else if (el.dataset.action)
      run(
        el.dataset.action,
        { ...el.dataset, value: el.value, checked: el.checked },
        el.closest("[data-stage]"),
      );
  });
  let theme = "system";
  try {
    const v = localStorage.getItem("whiteboard-showcase-theme");
    if (["system", "light", "dark"].includes(v)) theme = v;
  } catch {}
  function applyTheme() {
    if (theme === "system")
      document.documentElement.removeAttribute("data-theme");
    else document.documentElement.dataset.theme = theme;
    all("[data-theme-label]").forEach(
      (x) =>
        (x.textContent =
          theme === "system" ? "Auto" : theme === "light" ? "Light" : "Dark"),
    );
    all("[data-theme-toggle]").forEach((x) =>
      x.setAttribute("aria-label", "Theme: " + theme + ". Activate to change."),
    );
  }
  all("[data-theme-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      theme = ["system", "light", "dark"][
        (["system", "light", "dark"].indexOf(theme) + 1) % 3
      ];
      try {
        localStorage.setItem("whiteboard-showcase-theme", theme);
      } catch {}
      applyTheme();
    }),
  );
  applyTheme();
  all(".mobile-menu a").forEach((a) =>
    a.addEventListener("click", () => (a.closest("details").open = false)),
  );
  const dialog = one("#conversation-dialog");
  all("[data-open-conversation]").forEach((b) =>
    b.addEventListener("click", () => {
      lastTrigger = b;
      dialog.showModal();
      one("#brief-institution").focus();
    }),
  );
  one("[data-close-conversation]").addEventListener("click", () =>
    dialog.close(),
  );
  dialog.addEventListener("close", () => lastTrigger?.focus());
  const brief = () =>
    `Whiteboard — partner conversation\n\nInstitution/program: ${one("#brief-institution").value || "To discuss"}\nWorkflow: ${one("#brief-workflow").value || "To discuss"}\n\nDiscuss existing systems, roles, accessibility, migration, support and a bounded teaching pilot.\nPrepared locally. No message has been sent.`;
  one("[data-copy-brief]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(brief());
      one("#brief-status").textContent =
        "Brief copied. Share it through your usual channel.";
    } catch {
      one("#brief-status").textContent =
        "Clipboard unavailable. Download a local text copy instead.";
    }
  });
  one("[data-download-brief]").addEventListener("click", () => {
    download({ name: "whiteboard-pilot-conversation.txt", text: brief() });
    one("#brief-status").textContent =
      "Text brief prepared for download. No message was sent.";
  });
  function restoreURL() {
    const id = location.hash.slice(1);
    if (W.available.includes(id)) openScreen(id, true, false);
  }
  window.addEventListener("hashchange", restoreURL);
  window.addEventListener("popstate", restoreURL);
  W.controller = { renderAll, openScreen, startJourney, resetJourney };
  renderAll();
  restoreURL();
})();
