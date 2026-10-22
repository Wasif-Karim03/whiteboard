# Whiteboard app atlas

Deliverable: `showcase/app_map/index.html`, standalone offline HTML with inline CSS/JS/data. Separate from the product showcase and research report. Audience: founders, school partners and advisors who need to understand the whole product and transitions.

## Design contract

One visual idea: a campus route atlas. White/paper background #FAFEFE, ink #141B1D, teal #007176, pale teal #DEF6F7, border #D6DFE2 and restrained amber for proposed nodes. System type; no remote fonts/images/libraries. Clear numbered journeys, labeled arrows and readable lists instead of a 50-node hairball. Large whitespace for the story, compact readable rows for the atlas. Light/Dark, print, narrow viewport, native controls and reduced motion. No generic gradient/emoji decoration.

## Story

1. Orientation/counting legend: 50 planned logical destinations; 40 in the existing visual concept, 10 proposed. iOS is a planning interpretation, not a built native app. A map describes intended navigation, not proof every transition is implemented.
2. Shared lifecycle/role handoffs: access → learn → submit → review → release → support; independent campus/IT branches.
3. Web segment: domain overview, selected journey map with numbered steps/conditions, searchable/filterable 50-screen directory, detailed per-screen content/action/inbound/outbound/state notes and desktop presentation.
4. iPhone/iOS segment: same coverage with phone navigation/presentation, camera/permission/offline/deep-link states, staff workflows labeled desktop-recommended where appropriate.
5. Cross-role responsibility and authoritative-system boundaries; state/recovery matrix; scope and handoff.

## Build and acceptance

A bounded worker writes node content only; root owns edges/journeys/build/UI/validation/integration. Keep model JSON editable and generated HTML self-contained. Every ID unique; 40 S IDs +10 P IDs exactly; every edge and journey references existing nodes; all nodes reachable from an appropriate role start and have a meaningful exit; conditional/handoff edges labeled; 100 platform cards and all detailed content remain readable without JS. Filters/flows enhance the static content. No outbound services or publishing. Existing showcase unchanged.

Browser acceptance remains subject to the existing recorded local-file policy restriction: do not route around it; record actual source/Node/static checks separately. A bounded Astra review checks integrated model/UX logic after implementation.
