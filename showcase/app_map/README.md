# Whiteboard — Web and iPhone app map

Open or share **`index.html`**. It is one offline HTML file with all content, styles, scripts and data embedded. No server, installation, account or network connection is required. Keep this map separate from the original product showcase and research report.

## Coverage and reading

- 50 logical destinations: 40 existing visual-concept screens (`S01–S40`) and 10 proposed additions (`P41–P50`).
- Each destination is explained separately for web and planned iPhone: 100 platform presentations, not 100 independent features or implemented screens.
- 147 labeled transitions and 15 guided journeys cover access, learning, submission, course/content authoring, grading, schedules, rooms, clubs/events, support and institutional implementation.
- Click a journey step or screen connection to inspect content, actions, presentation, states, inbound/outbound routes, conditions and responsibility handoffs. Search/filter each platform independently.
- Shared navigation covers account, search, technical help and preferences from every signed-in workspace with a role-aware return. These conventions apply across the graph rather than adding repetitive edges from every destination.
- iOS is planned only. Twelve staff destinations recommend web for dense authoring or bulk work. The diagrams and schematic layouts do not claim production functionality.

## Maintain and verify

From the repository root:

```sh
node showcase/app_map/build.mjs
node showcase/app_map/validate.mjs
```

Edit `screens.json`, `routes.json`, `view.js`, `app.js`, `styles.css` or `build.mjs`; rebuild `index.html`. `routes.json` holds shared navigation conventions and named journey edges when a screen pair has several meanings. No dependencies required. `PLAN.md` records the design contract; `verification.json` records actual checks.

Source basis: `../08_screen_inventory.md`, `../09_screen_coverage_gaps.md`, existing showcase and research synthesis. Original showcase remains unchanged.

## Handoff / verification limits — 2026-10-15

Completed data coverage, static links/accessible references, embedded syntax, pure render checks and real controller tests with DOM doubles. A bounded read-only Astra review found quiz-release ambiguity, missing responsibility labels, shared-tool return scope and native printing gaps; these were corrected and covered by checks.

Browser visual, keyboard and responsive acceptance remains **unverified**, because the earlier local-file URL-policy restriction was not bypassed. Source/DOM-double checks do not establish browser accessibility conformance. No native app or device/simulator testing exists. Next permissible acceptance step is to review the delivered HTML in an authorized browser environment at desktop/phone widths, light/dark, keyboard-only, native printing and reduced motion. Do not substitute a localhost/alternate route to evade the recorded restriction.
