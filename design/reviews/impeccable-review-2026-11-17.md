# Impeccable static review

17 Nov 2026. Source reviewed before execution: npm `impeccable@4.9.2`, Apache-2.0; its Node launcher, exact engine tag `engine-v0.1.25`, detect CLI/engine seam, account dispatch and health upload gating. Sources: https://github.com/pbakaus/impeccable/tree/engine-v0.1.25 and https://registry.npmjs.org/impeccable/4.9.2 . The launcher verifies a pinned engine checksum. Local HTML arguments use static HTML/CSS analysis, not the URL/browser engine.

Execution used a project-local npm/cache directory, install scripts disabled, `IMPECCABLE_PRO=off`, `CI=1`, `DO_NOT_TRACK=1`, `IMPECCABLE_NO_TELEMETRY=1` and an isolated `IMPECCABLE_HOME`. No paid rule pack, sign-in, health upload, local-file browser workaround or global tool setting was used. The only tool network operations were public package/source/binary downloads.

Command (under those process-local variables): `npx --yes impeccable@4.9.2 detect --json design/final/dist`; baseline: `... detect --json design/board`. Findings exit status is 2; that means findings, not an execution failure. Baseline board copy: 0 findings, exit 0. Initial final build: 6 warnings. Current final build: 4 warnings, all dismissed below. Raw results are in impeccable-final-2026-11-17.json and impeccable-board-2026-11-17.json beside this file.

| Finding | Count | Disposition |
|---|---:|---|
| skipped-heading | 2 initially, 0 final | Fixed in tools/build_spec.mjs: extracted document headings are nested beneath the export's h2 sections. The locked extracted HTML remains byte-identical. A build regression checks the complete exported outline. |
| monotonous-spacing | 3 final, one per output | Dismissed. The static detector reports 4px 12/12, but the shared CSS uses token-based spacing with distinct grouping/section gaps (`--wb-space-1` through `--wb-space-4`). It does not resolve this dynamic token/compiled document context reliably. No visual rhythm conclusion can be drawn from this finding; owner view remains unrun. |
| aphoristic-cadence | 1 final, spec | Dismissed. These are requirements and boundary statements in the immutable design reference, not repeated promotional copy. Rewriting them for cadence would change the source requirements without a product benefit. |

The built app and board generate their page DOM at runtime. Static Impeccable analysis therefore cannot review all their layouts or interactions. A separate source render sweep fixed skipped heading ranks in shared cards/course cards, compact rows and eight page families; frameProblems now rejects skipped ranks for all 5,079 source frames. Source review also fixed modal background isolation. Nothing in this report is browser, screen-reader or device acceptance. All dispositions were chosen by Codex under owner delegation. No severity 3–4 finding remains open from this review.
