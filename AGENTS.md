# Whiteboard: operating guide for Codex

When the owner says **"keep working"** or **"continue"**, follow this guide from step 1 without asking first. The owner has delegated decisions. Record each one as "chosen by Codex under owner delegation" in the relevant NOTES.md. Stop to ask only for the items under §5.

## 1. Read first, in this order

1. `NOTES.md` **section 0**: the live state, next tasks, commands and rules. Sections 1–9 are history.
2. `CLAUDE.md`: its project rules apply to you too.
3. `design/reviews/final-design-plan-2026-11-15.md` **§4 Phases** (the table near line 143). It defines Phases 4–6 and what counts as done for each.
4. `docs/codex-handoff/`, a copy of the current run:
   - `plan.md`: the approved Phase 3 plan. Its amendments A1–A10 at the end override the earlier sections.
   - `common-brief.md`: the page-writing rules.
   - `fixes-1.md`: done. `fixes-2.md`: **open**.
   - `log.md`
5. For the pages you touch: `design/final/pages/PAGES.md` (the page contract), `pages/SPINE.md`, the segment's `pages/<seg>/NOTES.md` and `pages/shared.js` (the `WB.P` helpers).

## 2. Work queue (in order; update NOTES.md section 0 after each step)

1. **Finish Phase 3.**
   - Fix INSP2-01…05 in `docs/codex-handoff/fixes-2.md`.
   - Add a regression test for each in `design/final/tools/<segment>.test.mjs`.
   - Run the full proof (§3).
   - If `~/.claude/skills/team/scripts/active_run.py` exists, run `python3 ~/.claude/skills/team/scripts/active_run.py done "$PWD"`.
   - Mark Phase 3 done.
2. **Phase 4: integration.** Replace the 5 `todo` stubs in `design/final/tools/check_all.mjs` with real checks:
   - links: all 12 journeys can be walked;
   - reach: 189/189 page×platform targets;
   - leaks: no staff or unpublished data for students;
   - authority: a TA cannot release, and Graded ≠ Released;
   - fictional: no real customers, results or deployment claims.

   Also:
   - add the W49→W50 link (journey J03);
   - add tracker rows for all 189 targets;
   - work through the open `design/final/kit_requests.md` items;
   - fix the pages that throw when the instructor's enrollment is removed (listed in NOTES.md).
3. **Phase 5: lint and review.**
   - Read Impeccable's source first, then run `npx impeccable detect design/final/dist` and fix the real findings.
   - Do a second journey walk on the built prototype, saved in `design/reviews/`.
   - Do a source review of accessibility.
4. **Phase 6: prepare only.** Write `design/final/acceptance/checklist.md` for the owner's own check: double-click open, keyboard, focus, screen reader, and each platform view. Mark every row "Not run".

## 3. Proof (run before calling anything done, and report the real output)

```
node --test design/final/tools/*.test.mjs
node design/final/tools/check_all.mjs
bash design/final/tools/legacy_check.sh
node design/final/build.mjs && node design/final/tools/check_size.mjs
```

- **Size caps:** app and board ≤ 921,600 B each; spec ≤ 1,012,975 B. The spec is now 1,010,113 B, so keep its growth near zero.
- **NOTES.md lock:** NOTES.md is a locked input. After every edit, refresh its `bytes` and `sha256` in `design/final/tracker/inputs.lock.json`, then rerun `check_all`.
- **macOS file permission:** the check `extract_board_verify` reads `~/Downloads/Whiteboard-Design-Board (1).html`. If it fails with `EPERM`, the terminal or app running Codex needs access to the Downloads folder, under System Settings › Privacy & Security › Files and Folders, or Full Disk Access. That failure is a permission problem, not a code bug. Don't move or edit the file.
- **Never run** `design/build.mjs` (the old build) or `design/tools/check_batch.mjs`.
- **Source checks only:** these are not browser checks. Say so plainly.

## 4. Rules that must hold

**Product truths**
- Graded ≠ Released.
- A TA cannot release or preview a release.
- Receipts and release snapshots are immutable.
- Permissions are explicit.
- Request ≠ approval ≠ confirmation; offline ≠ synced.

**Page code**
- Plain-JS IIFEs on `WB`.
- Data only through `WB.sel`, never `view.data`.
- Use the kit `K.*` and the `WB.P` helpers.
- No `style=`. No typed dates, scores, ids or names. Files stay under 800 lines.

**Links**
- No link changes the viewer's role or identity (A1).
- Learners see published items only (A4).
- Record links use `P.recordGo` and open the record their label names (A10).
- TA access is checked per task (A6).

**Content**
- Everything is fictional and local.
- No invented customers or results. No claims of a backend, authentication or deployment.

**Git**
- No commit, push, deploy, reset, stash or discard. The worktree is deliberately dirty, and `design/final/` is untracked.

## 5. Owner-only (stop and ask)

- Running the Phase 6 browser acceptance.
- Commit or push.
- Paid services.
- Anything that bypasses a browser restriction, such as serving over localhost.

## 6. When you finish a step or stop

1. Rewrite NOTES.md section 0 so it is true: what's done, the proof output, what's open, and the next step.
2. Refresh the lock entry (see §3).

The next session (Codex or Claude) starts from there.
