# Continue Whiteboard on another device

Transfer reviewed 4 November 2026. Repository: https://github.com/Wasif-Karim03/whiteboard.
GitHub reported **public** visibility on that date; earlier “private” descriptions were incorrect. No visibility setting was changed during this transfer.

## Clone and resume

Install Git, Node.js and Python 3 to edit, rebuild and check the project. Verification used Node 24.21.0 and Python 3.15.0 on macOS. The transfer checker needs Python 3.9 or newer. No npm/pip packages, API keys, paid services, backend or database are required for the documented builds/checks. Opening the generated HTML requires only a browser that permits local files.

```sh
git clone --branch main https://github.com/Wasif-Karim03/whiteboard.git
cd whiteboard
python3 tools/transfer_manifest.py
git status --short --branch
```

On Windows, use `py -3` in place of `python3` if needed. Commands below run individually in a terminal from the repository root. Windows/device behavior has not been tested. `.gitattributes` preserves the exact file bytes, including existing CRLF in the design tracker.

`main` and `showcase/v2` receive the same transfer commit. A normal clone starts on `main`; to continue on the existing working branch, run `git switch showcase/v2`. `research/market` is the older research branch, not the complete continuation point. A normal clone preserves reachable Git history and remote branches; GitHub's Download ZIP provides the files without history.

Read `NOTES.md`, then `CLAUDE.md`, `design/SESSION_NOTES.md` and the relevant workspace README before editing. `HANDOFF.md` is an explicitly historical handoff. All 100 design targets were owner-accepted; structured browser/accessibility and native device acceptance remain unverified. Product implementation remains a separate, unauthorized scope.

## What is included

- Editable showcase, atlas, design-system, six design-batch and prototype sources, with build/check tools.
- Generated showcase (`Claude outputs/Pellwin-Showcase.html`), prototype (`design/prototype/Whiteboard-Prototype.html`), atlas (`showcase/app_map/index.html`), six previews and owner-review packet (`design/preview/index.html`).
- Research narrative, evidence registers, CSV/JSON data and offline report (`research/report/index.html`).
- Original archived HTML versions, historical audits, design tracker, decisions, handoffs and the interview-template workbook (`Claude outputs/Whiteboard-Interview-Tracker.xlsx`).
- A SHA-256 manifest of every tracked project file except the manifest itself. Run the integrity check immediately after cloning, before builds/checks intentionally update generated files.

The original project had 181 tracked files; none were missing from GitHub at audit time. No project file needs Git LFS, submodules or an external asset download. The largest tracked file was the 1.91 MB research report.

## Deliberate exclusions and browser data

These stay on the old device and are not required to rebuild or continue the project:

- `.sites/`: a local hosting workspace with a nested Git repository. Its 59 research/docs files were byte-identical to tracked originals. Its only additional rendered file was a redirect to `research/report/index.html`; deployment project metadata is specific to the old hosting setup. To read the report, open the tracked report directly. Recreating hosting is a separate task.
- `.claude/`: per-machine agent/session locks and harness state. Agent accounts, installed plugins, global skills, keychains and conversation histories are outside this project's Git transfer. Project instructions and decisions are included in the repository.
- `.DS_Store`, Python bytecode and `showcase/.tool-cache/`: OS metadata and disposable development caches. Optional Prettier tooling can be recreated using `showcase/README.md`; it is not required for builds.

**Before leaving the old browser:** if you entered review feedback in `design/preview/index.html`, use **Copy as Markdown** or **Download** and transfer that export separately. Unexported feedback lives only in that browser's local storage (`wb-review-v1`) and cannot be recovered by cloning Git. Theme/prototype preferences are also browser-local. Fictional interactive session changes are not a production data store.

No environment/credential files or credential-pattern matches were found in the file audit; this was a heuristic check. The tracked workbook contains a labeled example and blank interview input rows, not completed customer interviews. Keep future real interview records and secrets out of this public repository.

## Rebuild and verify

Run the integrity check first. The builds and validators below can overwrite generated HTML and verification records; timestamp-only changes are expected. Edit sources before rebuilding and review `git diff` afterward.

```sh
node showcase/build.mjs --stage B8
node showcase/tools/check_student.cjs
node showcase/tools/check_revision_student.cjs
node showcase/tools/check_readiness_regressions.cjs
node showcase/tools/check_teaching.cjs
node showcase/tools/check_revision_teaching.cjs
node showcase/tools/check_campus.cjs
node showcase/tools/check_institution.cjs
node showcase/tools/check_integrated.cjs
node showcase/tools/check_controller_logic.cjs
python3 showcase/tools/check_html.py
node showcase/app_map/build.mjs
node showcase/app_map/validate.mjs
node design/build.mjs
node design/tools/check_batch.mjs
python3 research/tools/validate_research.py
python3 research/tools/build_report.py --strict
node research/tools/check_report.cjs
```

Run `check_integrated.cjs` before `check_html.py`: the former writes fresh rendered-screen data to the OS temporary directory for the latter to inspect. The research validator checks the preserved original archive's hash, rather than comparing the intentionally revised showcase with the original. Do not run `build_lms.py` or `build_landscape.py` indiscriminately: they can overwrite reviewed domain corrections.

These checks validate source behavior, structure, research traceability and archive integrity. They do not establish browser, keyboard, screen-reader, native iOS or device acceptance. Preserve the existing documented browser-policy restrictions; do not bypass them for transfer verification.

After future intentional file edits/additions, stage the intended files, then refresh and stage the manifest:

```sh
git add <specific-files-you-intend-to-commit>
python3 tools/transfer_manifest.py --write
python3 tools/transfer_manifest.py
git add docs/transfer-manifest.json
```

The manifest verifies file presence and exact contents, not authorship or malicious changes. Git commit IDs and remote verification identify the delivered revision.

## Transfer verification record — 4 November 2026

All 19 integrity/build/source-validation commands (manifest check plus the 18 commands above) passed in an isolated export of the staged project without ignored folders, using Node 24.21.0 and Python 3.15.0 on macOS. The manifest checker also correctly rejected a deliberately changed file and a missing file in that disposable copy. Astra reviewed the staged transfer changes and verified that the manifest matched every indexed file and staged blob. Archive checks passed. Generated design verification timestamps and the review-page build date change on rebuild; those disposable timestamp changes were not copied over the preserved project artifacts. No browser/device acceptance was performed.
