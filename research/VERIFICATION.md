# Verification and limits

Checked 2026-10-15. Public desk research is complete at the depth described in each domain. This is not a live competitor benchmark, customer discovery study, legal audit or proof of Whiteboard production readiness.

## Data and evidence checks

- Exact shared CSV headers and row widths; IDs and canonical supplier joins; coverage/delivery/availability/confidence values; source-ID/URL pairs; access dates and local source-file links.
- 93 domain/product entries across 74 canonical operating suppliers, 549 feature rows, 73 coded pain findings and 33 ranked adjacent categories. Repeated suppliers and evidence are retained with context; counts are not prevalence or independent respondents.
- 311 source-register records across domains; URLs can repeat. The HTML displays 278 distinct source IDs cited by the machine-readable tables, and embeds the complete domain registers as well.
- Targeted Astra review corrected ownership, unsupported feature coverage, source/date formatting and ranking metadata. Unknown and unverified evidence remains explicitly labeled. No claim that every external source was independently reopened twice.
- Original `Pellwin-Showcase.html` remains 396,815 bytes with SHA256 `090136bffdcdbdc4b7d0a8b1a650cb9e1a6a3750eabb35cd28b1ec13ba29d2dd`.

## Report checks

The strict generator validates all six input domains and synthesis, rejects external runtime scripts/styles/fetch, duplicate HTML IDs, broken internal anchors and draft inputs. All local HTML links resolve. Tables have captions; data is readable without JavaScript. The report has no network dependency or build step for reading it.

The actual inline JavaScript controller is executed against a small Node DOM fixture: local and global filtering, combined zero-result state, clear/reset, ascending/descending sort, theme cycling and unavailable local storage. Generated feature/pain tables are checked for product and owner search aliases. Source-link schemes are restricted; display/search escaping is checked separately.

Browser visual inspection, responsive viewport execution, real keyboard/screen-reader interaction and mobile-device behavior remain **unverified**. Earlier local-file browser navigation was blocked by URL policy; no workaround was attempted. The CSS includes responsive navigation, visible focus, reduced motion and light/dark styles, but static/controller checks do not establish complete accessibility or visual quality.

## Reproduce

From the repository root, using installed Python 3 and Node:

```sh
python3 research/tools/validate_research.py
python3 research/tools/build_report.py --strict
node research/tools/check_report.cjs
```

No dependencies, paid services, publication or Git push are required. The remaining delivery check is a permitted manual browser review of `report/index.html`; institutional/product validation and interviews are future work, not completed research actions.
