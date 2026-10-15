# Whiteboard market and product research

Research scope: US higher education; full LMS core plus campus operations. Prepared 15 October 2026.

**Complete: six domains, synthesis and offline report. Research date: 2026-10-15.**

Open [the HTML report](report/index.html) directly in a browser. Read [the synthesis](synthesis.md) for the product decision and roadmap, or [verification](VERIFICATION.md) for checks and limits.

## Start here

- [Current build baseline](00_baseline/current_build.md): what exists, its maturity and domain coverage.
- [Research plan](00_baseline/research_plan.md): order, questions, evidence rules, CSV schemas and final-report contract.
- [Progress tracker](PROGRESS.md): domain status, open questions and resumption instructions.
- Existing [functional audit](../docs/Pellwin-Functional-Audit.md) and [state/control inventory](../docs/Pellwin-State-and-Control-Inventory.md).

## Domain index

| Domain | Planned folder | Status |
| --- | --- | --- |
| Baseline and plan | `00_baseline/` | Complete; approved |
| LMS core | [01_lms](01_lms/notes.md) | Complete: desk research |
| Scheduling and rooms | [02_scheduling_rooms](02_scheduling_rooms/notes.md) | Complete: desk research |
| Events and clubs | [03_events_clubs](03_events_clubs/notes.md) | Complete: desk research |
| Integration, compliance, buying and AI | [04_cross_cutting](04_cross_cutting/notes.md) | Complete: desk research |
| Missing campus landscape | [05_landscape_missing](05_landscape_missing/notes.md) | Complete: 33-category scan |
| Student success and advising | [06_student_success_advising](06_student_success_advising/notes.md) | Complete: promoted full domain |
| Merged data and synthesis | [data](data/all_competitors.csv), [synthesis](synthesis.md) | Complete |
| Offline HTML report | [report/index.html](report/index.html) | Built; static/controller checks passed |

The domain files and final report are saved locally. Research findings will be dated, cited and separated from vendor claims, user reports and analyst judgment. Product feature coverage will distinguish confirmed support, partial support, confirmed absence and unknown evidence.

The current prototype's narrower Moodle-grading strategy is historical baseline evidence. The present research evaluates the user's broader Whiteboard university-platform vision without presuming the outcome.

## Data and reproducibility

The merged tables contain 93 domain/product entries across 74 canonical operating suppliers, 549 feature rows and 73 coded pain findings. The same supplier may appear in several domains; [vendor coverage](data/vendor_coverage.csv) exposes those joins. Source registers have 311 records, including repeated URLs across domains; these are not 311 unique independent sources. Pain findings can draw on the same source and are not independent respondents or prevalence estimates. Market, price, feature and ownership unknowns remain explicit.

Local tools require Python 3 and Node for the controller check; no dependencies or network calls:

```sh
python3 research/tools/validate_research.py
python3 research/tools/build_report.py --strict
node research/tools/check_report.cjs
```

Run from the repository root. The validator merges CSVs after successful validation; the report embeds data and narrative and opens without a server. Links to source files need the accompanying research folder. `build_lms.py` and `build_landscape.py` serialize their domain datasets; subsequent reviewed corrections are preserved in the checked-in CSVs. Do not regenerate a domain blindly over reviewed data.
