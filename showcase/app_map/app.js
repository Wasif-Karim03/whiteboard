(function () {
  "use strict";
  const A = window.Atlas;
  const $ = (id) => document.getElementById(id);
  const status = $("map-status");
  A.matches = (node, query, domain, scope) =>
    (!domain || node.domain === domain) &&
    (!scope || node.status === scope) &&
    [node.id, node.title, node.role, node.purpose, ...node.actions]
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase());
  function filter(p) {
    const query = $(p + "-search").value,
      domain = $(p + "-domain").value,
      scope = $(p + "-status").value;
    let count = 0;
    document.querySelectorAll("#" + p + " .screen-card").forEach((card) => {
      card.hidden = !A.matches(
        A.byId[card.dataset.screen],
        query,
        domain,
        scope,
      );
      if (!card.hidden) count++;
    });
    document.querySelectorAll("#" + p + " .screen-group").forEach((group) => {
      group.hidden = ![...group.querySelectorAll(".screen-card")].some(
        (card) => !card.hidden,
      );
    });
    $(p + "-result-count").textContent = count + " of 50 destinations";
    $(p + "-empty").hidden = count !== 0;
  }
  function select(p, id, focus = true, changeHash = true) {
    if (!["web", "ios"].includes(p) || !A.byId[id]) return;
    const card = $(p + "-" + id);
    if (card.hidden) {
      ["search", "domain", "status"].forEach(
        (key) => ($(p + "-" + key).value = ""),
      );
      filter(p);
    }
    $(p + "-inspector").innerHTML = A.inspector(A.byId[id], p);
    card.open = true;
    if (changeHash) history.pushState(null, "", "#" + p + "-" + id);
    if (focus) {
      $(p + "-selected-title").focus({ preventScroll: true });
      $(p + "-inspector").scrollIntoView({ block: "start" });
    }
    status.textContent =
      (p === "web" ? "Web" : "Planned iPhone") +
      " screen selected: " +
      A.byId[id].title;
  }
  function restore() {
    const m = location.hash.match(/^#(web|ios)-([SP]\d{2})$/);
    if (m) select(m[1], m[2], true, false);
  }
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-node]");
    if (
      link &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      event.button === 0
    ) {
      event.preventDefault();
      select(link.dataset.platform, link.dataset.node);
    }
    const expand = event.target.closest("[data-expand]");
    if (expand) {
      const open = expand.getAttribute("aria-expanded") !== "true";
      document
        .querySelectorAll("#" + expand.dataset.expand + " .screen-card")
        .forEach((c) => (c.open = open));
      expand.setAttribute("aria-expanded", String(open));
      expand.textContent = open
        ? "Collapse all descriptions"
        : "Expand all descriptions";
    }
  });
  document
    .querySelectorAll("[data-filter]")
    .forEach((control) =>
      control.addEventListener(
        control.tagName === "INPUT" ? "input" : "change",
        () => filter(control.dataset.filter),
      ),
    );
  document.querySelectorAll("[data-journey]").forEach((control) =>
    control.addEventListener("change", () => {
      const p = control.dataset.journey,
        j = A.data.journeys.find((item) => item.id === control.value);
      document.querySelector('[data-journey-view="' + p + '"]').innerHTML =
        A.journey(j, p);
      select(p, j.steps[0], false, false);
      status.textContent = "Journey selected: " + j.title;
    }),
  );
  const themeButton = $("theme-button"),
    system = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = "system";
  try {
    preference = localStorage.getItem("whiteboard-atlas-theme") || "system";
  } catch (e) {}
  if (!["system", "light", "dark"].includes(preference)) preference = "system";
  function theme() {
    document.documentElement.dataset.theme =
      preference === "system"
        ? system.matches
          ? "dark"
          : "light"
        : preference;
    themeButton.textContent = "Theme: " + preference;
    themeButton.setAttribute(
      "aria-label",
      "Color theme " + preference + ". Activate to change.",
    );
  }
  themeButton.addEventListener("click", () => {
    preference = { system: "light", light: "dark", dark: "system" }[preference];
    try {
      localStorage.setItem("whiteboard-atlas-theme", preference);
    } catch (e) {}
    theme();
  });
  system.addEventListener("change", theme);
  theme();
  let printState;
  function preparePrint() {
    if (printState) return;
    printState = [
      ...document.querySelectorAll(".screen-card,.screen-group"),
    ].map((node) => ({ node, open: node.open, hidden: node.hidden }));
    printState.forEach(({ node }) => {
      node.hidden = false;
      if (node.matches("details")) node.open = true;
    });
  }
  $("print-button").addEventListener("click", () => {
    preparePrint();
    window.print();
  });
  window.addEventListener("beforeprint", preparePrint);
  window.addEventListener("afterprint", () => {
    if (printState) {
      printState.forEach(({ node, open, hidden }) => {
        node.hidden = hidden;
        if (node.matches("details")) node.open = open;
      });
      printState = null;
    }
  });
  window.addEventListener("hashchange", restore);
  window.addEventListener("popstate", restore);
  restore();
})();
