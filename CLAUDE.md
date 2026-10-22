# Whiteboard — start here

Read [NOTES.md](NOTES.md) for the latest status, then [HANDOFF.md](HANDOFF.md) (the original handoff, dated 15 October 2026) before changing this project. Then read [design/README.md](design/README.md) and the relevant screen/route entries in `showcase/app_map/screens.json` and `routes.json`.

## Current assignment

**Status 16 Oct 2026: design drafting is complete. Read [NOTES.md](NOTES.md) first; it says exactly where to start.** All 100 targets (50 destinations × web / planned iPhone) are drafted in `design/` and committed (`8eba7f2`, branch `showcase/v2`). The owner accepted decisions D1–D58 and the drawn answers to all open questions (`design/decisions.md` › Owner review). Do not restart research or redraft batches.

The owner visually reviewed and accepted all 100 designs (16 Oct 2026), and has delegated further decisions to Claude (record them as “chosen by Claude under owner delegation”). Remaining work, each step needing the owner’s go-ahead: structured browser/accessibility acceptance by user-assisted inspection, partner discovery for the first school (D63), and implementation planning (not authorized). Keep the shared design system and workflow integrity, and make deliberate improvements only.

## Sources of truth

- Research and product boundaries: `research/synthesis.md` and domain `opportunities.md` / evidence files.
- Current showcase implementation: `showcase/src/` and `showcase/src/CONTRACT.md`.
- Generated showcase: `Claude outputs/Pellwin-Showcase.html` (legacy filename, visible brand Whiteboard).
- Complete navigation/design planning baseline: `showcase/app_map/screens.json` and `routes.json`; shareable map `showcase/app_map/index.html`.
- Current old-showcase acceptance: `showcase/05_update_tracker.csv`, with explanations in `.md` and correction evidence in `07_readiness_recheck.md`.
- New design work: `design/screen_tracker.csv`, `design/state_checklist.md`, `design/decisions.md` and `design/SESSION_NOTES.md`.

## Non-negotiable distinctions

40 screens exist as local visual concepts (S01–S40); ten proposed destinations (P41–P50) extend the planning baseline. Fifty destinations across two platforms means 100 design targets, not 100 implemented features. All native iOS presentation is planned. Responsive mobile web and native iOS are different targets. Twelve dense staff destinations recommend web for bulk work; do not imply native parity was decided.

All records/effects are fictional and local. There is no production authentication, authorization, backend, storage, upload service, AI inference or live integration. Preserve authority boundaries, immutable receipts/release snapshots, course/role permissions and truthful pending states. Never invent customers, results, certifications or deployment claims.

Edit sources and rebuild generated HTML. Preserve archives and unrelated files. Do not reset/discard the dirty worktree, stage unrelated files, commit/push, deploy or start paid services without authorization. Since 22 Oct 2026 everything (map, inventories, handoff docs) is committed and pushed to the private repo https://github.com/Wasif-Karim03/whiteboard (`main`); NOTES.md holds the full project review.

Browser visual/keyboard/accessibility acceptance remains unverified under a previously recorded local-file URL-policy restriction. Do not bypass a restriction through localhost or alternate routes. Use an authorized environment or request user-assisted inspection; report what actually ran. Source tests are not browser or device acceptance.

Use free/local tools and existing dependencies. New framework/backend/native implementation is not authorized merely by the design handoff. Track UI design, source checks, browser review and owner review separately. Update the tracker and session notes after each batch. See HANDOFF.md for verified commands and the exact next steps.
