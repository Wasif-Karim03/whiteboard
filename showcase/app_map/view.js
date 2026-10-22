(function () {
  "use strict";
  const A = window.Atlas,
    D = A.data;
  const esc = (A.esc = (x) =>
    String(x ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    ));
  const domains = (A.domains = {
    access: "Access & everyday tools",
    learning: "Student learning",
    teaching: "Teaching & assessment",
    spaces: "Scheduling & rooms",
    life: "Events & organizations",
    support: "Student support",
    institution: "Institution & IT",
  });
  const by = (A.byId = Object.fromEntries(D.screens.map((n) => [n.id, n])));
  A.incoming = (id) => D.edges.filter((e) => e.target === id);
  A.outgoing = (id) => D.edges.filter((e) => e.source === id);
  A.link = (p, id, label) =>
    `<a href="#${p}-${id}" data-node="${id}" data-platform="${p}">${esc(label || by[id].title)}</a>`;
  const pill = (n, p) =>
    `<span class="pill${n.status === "proposed" ? " proposed" : ""}">${n.status === "proposed" ? "Proposed addition" : p === "ios" ? "Concept scope · iOS planned" : "In visual concept"}</span>`;
  const list = (items) =>
    `<ul class="clean-list">${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  function edgeLink(p, edge, incoming = false) {
    const n = by[incoming ? edge.source : edge.target];
    return `<a class="path-link" href="#${p}-${n.id}" data-platform="${p}" data-node="${n.id}"><strong>${esc(n.id)} · ${esc(n.title)}</strong><span>${esc(edge.label)}</span>${edge.condition ? `<span>When: ${esc(edge.condition)}</span>` : ""}${edge.handoff ? '<span class="handoff-label">Role / responsibility handoff</span>' : ""}${edge.authority ? `<span>Authority: ${esc(edge.authority)}</span>` : ""}</a>`;
  }
  A.mock = (n, p) =>
    p === "web"
      ? `<figure class="mini-web" aria-label="Schematic web layout for ${esc(n.title)}"><div class="mini-bar">Whiteboard · ${esc(n.role)}</div><div class="mini-web-inner"><div class="mini-sidebar" aria-hidden="true">Today<br>Courses<br>Calendar<br>Campus<br>Account</div><div class="mini-content"><strong>${esc(n.title)}</strong>${n.content
          .slice(0, 3)
          .map((x) => `<div class="mini-row">${esc(x)}</div>`)
          .join(
            "",
          )}</div></div><figcaption class="mini-caption">Layout schematic. The links in the map describe actions and navigation.</figcaption></figure>`
      : `<figure class="phone" aria-label="Planned iPhone layout schematic for ${esc(n.title)}"><div class="phone-top" aria-hidden="true"><span>9:41</span><span class="phone-island"></span><span>•••</span></div><div class="phone-header">Whiteboard · ${esc(n.role)}</div><div class="phone-content"><strong>${esc(n.title)}</strong>${n.content
          .slice(0, 3)
          .map((x) => `<div class="mini-row">${esc(x)}</div>`)
          .join(
            "",
          )}</div><div class="phone-tabs" aria-hidden="true"><span>Today</span><span>Courses</span><span>Calendar</span><span>Campus</span><span>Account</span></div><div class="phone-home" aria-hidden="true"></div><figcaption class="sr-only">Planned structure only, not a native application screenshot.</figcaption></figure>`;
  A.inspector = (n, p) =>
    `<div class="inspector-title"><div>${pill(n, p)}<h3 id="${p}-selected-title" tabindex="-1">${esc(n.id)} · ${esc(n.title)}</h3><p class="small">${esc(n.role)} · ${esc(domains[n.domain])}</p></div><a class="button" href="#${p === "web" ? "ios" : "web"}-${n.id}" data-node="${n.id}" data-platform="${p === "web" ? "ios" : "web"}">See ${p === "web" ? "iPhone" : "web"} version</a></div><p class="inspector-purpose">${esc(n.purpose)}</p><div class="detail-grid"><div><h4>What is on this screen</h4>${list(n.content)}<h4>What the person does</h4>${list(n.actions)}<div class="platform-specific"><strong>${esc(n[p].presentation)}</strong><p>Entry: ${esc(n[p].entry)}</p>${list(n[p].notes)}${p === "ios" && n.ios.desktopRecommended ? "<p><strong>Desktop recommended:</strong> the iPhone destination keeps context, status and next steps available; dense staff authoring or bulk work should open the web workspace. Native feature parity is a design decision, not a current capability.</p>" : ""}</div><h4>States and recovery</h4>${list(n.states)}</div><div class="mock">${A.mock(n, p)}<p class="schema-caption">A structural guide for this map. ${p === "ios" ? "All iPhone presentation is planned; no native build is represented." : "The current product artifact is a visual concept, not a deployed service."}</p></div></div><div class="paths"><div><h4>Comes from</h4>${
      A.incoming(n.id)
        .map((e) => edgeLink(p, e, true))
        .join("") ||
      '<p class="small">External invitation or first institution entry.</p>'
    }</div><div><h4>Goes to</h4>${A.outgoing(n.id)
      .map((e) => edgeLink(p, e))
      .join("")}</div></div>`;
  A.card = (n, p) =>
    `<details class="screen-card" id="${p}-${n.id}" data-screen="${n.id}" data-domain="${n.domain}" data-status="${n.status}" data-search="${esc([n.id, n.title, n.role, n.purpose, ...n.actions].join(" ").toLowerCase())}"><summary><span class="screen-id">${n.id}</span><span><strong>${esc(n.title)}</strong><br>${pill(n, p)}</span></summary><div class="card-body"><p><strong>${esc(n.role)}</strong></p><p>${esc(n.purpose)}</p><a class="button" href="#${p}-${n.id}" data-node="${n.id}" data-platform="${p}">Map this screen</a><h5>On screen</h5>${list(n.content)}<h5>Actions</h5>${list(n.actions)}<h5>${p === "web" ? "Web" : "Planned iPhone"} presentation</h5><p>${esc(n[p].presentation)}</p><p>Entry: ${esc(n[p].entry)}</p>${list(n[p].notes)}${p === "ios" && n.ios.desktopRecommended ? "<p><strong>Desktop recommended for dense authoring/bulk work.</strong> Phone review and handoff remain mapped.</p>" : ""}<h5>State variants</h5>${list(n.states)}<h5>Comes from</h5><div class="card-paths">${A.incoming(
      n.id,
    )
      .map((e) =>
        A.link(
          p,
          e.source,
          `${e.source} · ${by[e.source].title} — ${e.label}${e.handoff ? " [role handoff]" : ""}`,
        ),
      )
      .join("")}</div><h5>Goes to</h5><div class="card-paths">${A.outgoing(n.id)
      .map(
        (e) =>
          `<p>${A.link(p, e.target, `${e.target} · ${by[e.target].title} — ${e.label}`)}${e.condition ? `<span class="small">When: ${esc(e.condition)}</span>` : ""}${e.handoff ? '<span class="pill neutral">Role handoff</span>' : ""}${e.authority ? `<span class="small">Authority: ${esc(e.authority)}</span>` : ""}</p>`,
      )
      .join("")}</div></div></details>`;
  A.journey = (j, p) => {
    const transitions = j.steps
      .slice(0, -1)
      .map((id, i) =>
        D.edges.find(
          (e) =>
            e.source === id &&
            e.target === j.steps[i + 1] &&
            (!j.edgeLabels?.[i] || e.label === j.edgeLabels[i]),
        ),
      );
    return `<p class="journey-summary">${esc(j.summary)}</p><div class="journey-map" tabindex="0" role="region" aria-label="${esc(j.title)} mapped steps"><ol class="steps">${j.steps
      .map((id, i) => {
        const n = by[id],
          edge = transitions[i];
        return `<li><button class="step-node" data-node="${id}" data-platform="${p}"><span class="step-num">${i + 1} / ${j.steps.length} · ${id}</span><strong>${esc(n.title)}</strong><small>${esc(n.role)}</small></button>${edge ? `<div class="step-connector${edge.handoff ? " handoff" : ""}"><span class="arrow" aria-hidden="true">→</span><span>${esc(edge.label)}${edge.handoff ? "<br><b>Role handoff</b>" : ""}</span></div>` : ""}</li>`;
      })
      .join(
        "",
      )}</ol></div><details><summary>Read the steps and conditions</summary><ol class="step-transitions">${transitions.map((edge, i) => `<li><strong>${esc(by[edge.source].title)} → ${esc(by[edge.target].title)}</strong><br>${esc(edge.label)}.${edge.condition ? " " + esc(edge.condition) + "." : ""}${edge.handoff ? " Responsibility changes; the next person uses their own authorized view." : ""}${edge.authority ? " Authority: " + esc(edge.authority) + "." : ""}</li>`).join("")}</ol></details>`;
  };
  A.platform = (p) => {
    const web = p === "web";
    return `<section class="platform" id="${p}" aria-labelledby="${p}-title"><div class="platform-heading"><div><p class="platform-number">${web ? "01 / Desktop and browser" : "02 / iPhone and iOS"}</p><h2 id="${p}-title">${web ? "Web. The whole workspace." : "iPhone. A clear next step."}</h2></div><p>${web ? "Sidebars, split views and room to inspect complex work. Follow a journey, select a screen, then read every incoming and outgoing connection." : "A planned phone interpretation of the same product. Tabs, stacked views and sheets keep tasks readable. Complex staff work is marked desktop-recommended."}</p></div>${web ? '<div class="note"><strong>Read this as a navigation plan.</strong> Forty screens are present as visual concepts and ten are proposed additions. Arrows describe the intended final-product flow; they do not claim every connection is implemented.</div>' : '<div class="note"><strong>Planned iOS experience, not a released native app.</strong> All 50 destinations are mapped here for completeness. Twelve complex staff destinations recommend the web for dense work; native implementation and parity still require design and validation.</div>'}<div class="note"><strong>Shared navigation from every signed-in workspace.</strong> ${esc(D.sharedNavigation.rule)}<div class="actions">${D.sharedNavigation.destinations.map((id) => A.link(p, id)).join(" · ")}</div></div><div class="atlas-layout"><nav class="atlas-rail" aria-label="${web ? "Web" : "iPhone"} map areas"><h3>Screen directory</h3>${Object.entries(
      domains,
    )
      .map(
        ([key, label]) =>
          `<a href="#${p}-domain-${key}"><span>${esc(label)}</span><span class="domain-tally">${D.screens.filter((n) => n.domain === key).length}</span></a>`,
      )
      .join(
        "",
      )}<p class="small">50 destinations<br>40 concept scope<br>10 proposed additions<br>Each link explains an action.</p><a href="#${web ? "ios" : "web"}"><span>Go to ${web ? "iPhone" : "web"} map</span><span aria-hidden="true">↓</span></a></nav><div class="atlas-main"><div class="journey"><label for="${p}-journey">Walk through a complete task</label><select id="${p}-journey" data-journey="${p}">${D.journeys.map((j) => `<option value="${j.id}"${j.id === "submission" ? " selected" : ""}>${esc(j.title)}</option>`).join("")}</select><div data-journey-view="${p}">${A.journey(
      D.journeys.find((j) => j.id === "submission"),
      p,
    )}</div></div><section class="inspector" id="${p}-inspector" aria-labelledby="${p}-selected-title" data-inspector="${p}">${A.inspector(by[web ? "S01" : "S06"], p)}</section><div class="directory-head"><h3>Every ${web ? "web" : "iPhone"} destination</h3><button class="button" data-expand="${p}" aria-expanded="false">Expand all descriptions</button></div><div class="filters" aria-label="${web ? "Web" : "iPhone"} directory filters"><label for="${p}-search">Search screen, role or task<input id="${p}-search" type="search" name="${p}-search" autocomplete="off" placeholder="Try gradebook, student or P41" data-filter="${p}"></label><label for="${p}-domain">Area<select id="${p}-domain" data-filter="${p}"><option value="">All areas</option>${Object.entries(
      domains,
    )
      .map(([key, label]) => `<option value="${key}">${esc(label)}</option>`)
      .join(
        "",
      )}</select></label><label for="${p}-status">Scope<select id="${p}-status" data-filter="${p}"><option value="">All 50 destinations</option><option value="concept">40 concept screens</option><option value="proposed">10 proposed additions</option></select></label></div><p class="result-count" id="${p}-result-count" role="status" aria-live="polite">50 of 50 destinations</p><div class="empty" id="${p}-empty" hidden>No screens match. Clear the search or choose another area.</div>${Object.entries(
      domains,
    )
      .map(
        ([key, label]) =>
          `<section class="screen-group" id="${p}-domain-${key}" data-group="${p}"><h4>${esc(label)} <span class="domain-tally">/ ${D.screens.filter((n) => n.domain === key).length}</span></h4><div class="screen-grid">${D.screens
            .filter((n) => n.domain === key)
            .map((n) => A.card(n, p))
            .join("")}</div></section>`,
      )
      .join("")}</div></div></section>`;
  };
})();
