# Whiteboard product showcase

Shareable artifact: `../Claude outputs/Pellwin-Showcase.html` (legacy filename; the visible product is Whiteboard). One offline HTML file; no runtime dependencies or build step for recipients. All records and effects are fictional. No production service, authentication, upload, AI inference or integration is connected.

- [Current update tracker](05_update_tracker.md) / [CSV](05_update_tracker.csv)
- [Revision plan](06_revision_plan.md)
- [Progress and handoff](03_progress.md)
- [Original review](04_revision_audit.md)
- [Current verification record](review/verification_2026-10-15.json)

## Build and check

From the repository root:

```sh
node showcase/build.mjs --stage B8
node showcase/tools/check_student.cjs
node showcase/tools/check_revision_student.cjs
node showcase/tools/check_teaching.cjs
node showcase/tools/check_revision_teaching.cjs
node showcase/tools/check_campus.cjs
node showcase/tools/check_institution.cjs
node showcase/tools/check_integrated.cjs
node showcase/tools/check_controller_logic.cjs
python3 showcase/tools/check_html.py
```

Edit `src/`; rebuild the deliverable instead of hand-editing it. `src/CONTRACT.md` explains shared data and helpers. Checks exercise local state, actual render functions and controller units with test doubles. They do not execute a browser or establish accessibility conformance.

Formatting uses MIT-licensed Prettier 3.6.2, with installation scripts disabled and a project-local ignored tool cache. It is development tooling, not a runtime dependency:

```sh
npm exec --ignore-scripts --cache ./showcase/.tool-cache --yes --package=prettier@3.6.2 -- prettier --write 'showcase/src/*.js' showcase/src/styles.css showcase/build.mjs 'showcase/tools/*.cjs'
```

## Preservation and verification limits

`archive/showcase_v1_2026-10-15.html` preserves the original product review. `archive/showcase_v2_2026-10-15.html` preserves the pre-revision showcase. Static checks enforce both hashes. Historical defect probes read the v2 archive; current regression tests exercise revised sources.

Browser visual/keyboard/phone acceptance remains unverified because of the recorded local-file URL-policy restriction. Do not bypass it with another route or mark browser work passed from Node checks. The tracker separates verified state work from implemented/unverified UI work and blocked visual gates. Public source-link checks are recorded separately; two EDUCAUSE endpoints returned HTTP 403 and remain unverified by that check.
