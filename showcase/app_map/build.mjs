import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const read = (file) => fs.readFileSync(path.join(dir, file), "utf8");
const data = {
  screens: JSON.parse(read("screens.json")),
  ...JSON.parse(read("routes.json")),
};
const view = read("view.js"),
  app = read("app.js");
const ctx = { window: { Atlas: { data } } };
vm.runInNewContext(view, ctx);
const A = ctx.window.Atlas;
const recoveries = [
  [
    "Institution sign-in fails",
    "P41",
    "Use the institution’s recovery route or technical help. Whiteboard does not reset an institution password.",
  ],
  [
    "Camera access is denied",
    "S06",
    "Choose an existing file; review it before submitting.",
  ],
  [
    "Pages need correction",
    "S07",
    "Reorder or replace pages and inspect their legibility.",
  ],
  [
    "Submission is interrupted",
    "S08",
    "Check the receipt status before retrying. A local queue is not acceptance.",
  ],
  [
    "Feedback is held",
    "S09",
    "Wait for an authorized instructor release; unpublished feedback stays private.",
  ],
  [
    "Room request is pending",
    "S27",
    "Wait for the room authority’s confirmation before treating the room as booked.",
  ],
  [
    "Event is full",
    "S28",
    "Show a waitlist where enabled; a waitlist is not an admission pass.",
  ],
  [
    "Support case is unassigned",
    "S36",
    "Keep an accountable owner and escalation visible to authorized staff.",
  ],
  [
    "Roster sync fails",
    "S38",
    "Inspect the discrepancy and reconcile against the authoritative system.",
  ],
  [
    "Staff access expires",
    "S37",
    "Restore permissions only through an authorized institution administrator.",
  ],
];
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="description" content="Whiteboard product navigation atlas: every planned web and iPhone destination, workflow, handoff and recovery path."><title>Whiteboard — Web & iPhone App Map</title><style>${read("styles.css")}</style></head><body>
<a class="skip" href="#main">Skip to app map</a><header class="topbar"><div class="wrap"><a class="brand" href="#overview"><span class="mark" aria-hidden="true">W</span>Whiteboard <span class="small">/ App map</span></a><nav aria-label="Main navigation"><a href="#web">Web</a><a href="#ios">iPhone</a><a href="#boundaries">How to read it</a></nav><button class="button" id="theme-button">Theme: system</button><button class="button" id="print-button">Print map</button></div></header>
<main id="main" class="wrap"><section id="overview" aria-labelledby="page-title"><div class="hero"><div><div class="eyebrow">Product navigation atlas · 15 October 2026</div><h1 id="page-title">Every screen.<br>Every next step.</h1><p>A university platform with learning at its core. Explore what students, instructors and campus teams do, where they start, and what happens next.</p><div class="actions"><a class="button primary" href="#web">Explore the web map</a><a class="button" href="#ios">Explore the iPhone map</a></div></div><div class="hero-legend"><h2>The whole product, in two views.</h2><div class="facts"><div><strong>50</strong><span>logical destinations</span></div><div><strong>15</strong><span>guided journeys</span></div><div><strong>${data.edges.length}</strong><span>labeled transitions</span></div></div><p>Each destination appears in the web and iPhone directories: <strong>100 platform presentations of the same 50 destinations.</strong> The count includes 40 visual-concept screens and 10 proposed additions.</p><p><span class="pill">Concept scope</span> Existing product concept. <span class="pill proposed">Proposed addition</span> Scope found in the coverage review. All iOS presentation is planned.</p></div></div><noscript><div class="note">JavaScript is off. All 100 screen descriptions and their links remain available below. Open a screen’s disclosure to read its details. Search, selected-screen previews, journey switching and theme controls require JavaScript.</div></noscript>
<div class="overview"><p class="eyebrow">The campus at a glance</p><h2>One platform. Connected responsibilities.</h2><p>These areas work in parallel. Follow the labeled journeys below for the exact order of a task; an arrow across roles means a handoff, not permission to enter another person’s workspace.</p><div class="overview-flow"><a class="button" href="#web-P41">Access & identity</a><span aria-hidden="true">→</span><a class="button" href="#web-S01">Student learning</a><span aria-hidden="true">↔</span><a class="button" href="#web-S14">Teaching & assessment</a></div><div class="actions"><a class="button" href="#web-S24">Scheduling & rooms</a><a class="button" href="#web-S28">Events & organizations</a><a class="button" href="#web-S34">Student support</a><a class="button" href="#web-P50">Institution & IT</a></div><p class="small">Learning connects to the timetable, campus participation and support. Institution services govern identity, access, records and integrations across every area.</p></div></section>
${A.platform("web")}${A.platform("ios")}
<section class="scope" id="boundaries" aria-labelledby="boundaries-title"><p class="eyebrow">Reading the atlas</p><h2 id="boundaries-title">A map of the intended product.</h2><div class="scope-grid"><div><h3>How to follow a route</h3><p>Choose a journey, select a step, then inspect “Comes from” and “Goes to.” Each connection names the action and any condition. The complete directory includes alternate paths beyond the guided journeys.</p><p>Screen IDs are stable reference labels. A screen is a destination or workspace; dialogs, themes, loading states and role variants do not create extra counted screens.</p></div><div><h3>Responsibilities stay separate</h3><p>Students see their own learning and requests. Instructors and assigned TAs work within course permissions. Registrars, student affairs, advisors and IT receive role-specific workspaces. Following a map link never grants access.</p><p>Identity providers govern sign-in. The SIS governs official enrollment and records. Room authorities confirm bookings. Sensitive support notes stay restricted. Finance and other specialist systems remain integration boundaries.</p></div><div><h3>What exists, what is planned</h3><p>The existing showcase is a visual product concept. Ten additional destinations cover access, onboarding, account tools, search, technical help, content/files, reusable rubrics and institution setup.</p><p>No live institution deployment, native iOS build, production integration, AI inference or security certification is implied. Schematic screen layouts explain structure; they are not finished native UI designs. The map is a proposed navigation contract and needs implementation and usability validation.</p></div><div><h3>iPhone scope</h3><p>All 50 destinations are represented so the whole product can be understood on a phone. Twelve dense staff workspaces recommend web authoring or bulk work. Phone review and handoff are mapped; native parity is still a design decision.</p><p>Dates, people, courses and event examples are fictional. This file runs offline and does not send data or perform the mapped product actions.</p></div></div><h3>Recovery is part of the route</h3><div class="table-scroll" tabindex="0" role="region" aria-label="Recovery paths"><table><thead><tr><th scope="col">Situation</th><th scope="col">Destination</th><th scope="col">Expected behavior</th></tr></thead><tbody>${recoveries.map(([s, id, text]) => `<tr><th scope="row">${A.esc(s)}</th><td>${A.link("web", id, "Web · " + id)}<br>${A.link("ios", id, "iPhone · " + id)}</td><td>${A.esc(text)}</td></tr>`).join("")}</tbody></table></div><p class="small">Basis: the Whiteboard product concept, research synthesis, screen inventory and coverage review dated 15 October 2026. This artifact documents product intent rather than making external market claims. This edition has source and model checks; browser visual and keyboard acceptance remains unverified.</p></section>
</main><footer class="wrap"><p>Whiteboard / Product navigation atlas</p><p>Share this single HTML file. Everything needed to read and explore it is included.</p><a href="#overview">Back to overview ↑</a></footer><div class="sr-only" id="map-status" role="status" aria-live="polite"></div>
<script type="application/json" id="atlas-data">${JSON.stringify(data).replace(/</g, "\\u003c")}</script><script>window.Atlas={data:JSON.parse(document.getElementById('atlas-data').textContent)};</script><script>${view}</script><script>${app}</script></body></html>`;
fs.writeFileSync(path.join(dir, "index.html"), html);
console.log(
  "Built app_map/index.html: " +
    data.screens.length +
    " destinations, " +
    data.edges.length +
    " transitions, " +
    data.journeys.length +
    " journeys.",
);
