# Second journey walk of the built prototype

17 Nov 2026. Executed the shipped inline scripts in a Node VM without a document; this is a source walk of the built artifact, not a browser journey walk. Astra independently ran the shipped reducer and integration gates: all 78 tour steps and 26 required same-record page hops passed, with explicit tour role/time handoffs. App SHA-256: `0226665eae4f4339921fc6277fbfccd779ca2d911e6be0b3db12f3f0503f70fb`. See phase4-source-review-2026-11-17.md for details.

| Journey | Exact built tour path (page / role / clock / variant) | Source walk | Browser walk |
|---|---|---|---|
| J01 Arrival | W01 / guest / default → W02 / student / default → W03 / student / default → W04 / student / default → W05 / student / default | Pass | Not run |
| J02 Individual submission | W06 / student / assignment_submission → W14 / student / assignment_submission → W16 / student / assignment_submission → W17 / student / assignment_submission → W18 / student / assignment_submission → W19 / student / assignment_submission → W20 / student / assignment_submission → W21 / student / assignment_submission → W22 / student / default | Pass | Not run |
| J03 Grade and release | W48 / instructor / default → W49 / instructor / default → W50 / instructor / default → W51 / instructor / default → W53 / instructor / default → W23 / student / ps4_released → W24 / student / ps4_released | Pass | Not run |
| J04 Course authoring | W35 / instructor / default → W36 / instructor / default → W37 / instructor / default → W38 / instructor / default → W39 / instructor / default → W40 / instructor / default → W43 / instructor / default → W44 / instructor / default → W14 / instructor / default | Pass | Not run |
| J05 Quiz lifecycle | W41 / instructor / default → W42 / instructor / default → W25 / student / default → W26 / student / quiz_in_progress → W27 / student / quiz_received → W53 / instructor / default → W24 / student / default | Pass | Not run |
| J06 Policy and correction | W52 / instructor / default → W51 / instructor / default → W24 / student / default → W54 / instructor / default → W53 / instructor / default → W23 / student / ps4_released | Pass | Not run |
| J07 Group assignment | W47 / instructor / default → W40 / instructor / default / motion → W33 / student / group_work_in_progress → W34 / student / group_work_in_progress → W19 / student / group_work_in_progress / motion → W20 / student / group_work_in_progress / motion → W21 / student / group_work_in_progress / motion → W22 / student / group_submission / group → W49 / instructor / group_submission / group | Pass | Not run |
| J08 TA workload | W45 / instructor / default → W57 / instructor / default → W05 / ta / default → W07 / ta / default → W48 / ta / default → W49 / ta / default | Pass | Not run |
| J09 Course communication | W55 / instructor / default → W28 / student / default → W29 / student / default → W08 / student / default → W30 / student / default → W31 / student / default → W56 / instructor / default | Pass | Not run |
| J10 Academic planning | W36 / instructor / default → W32 / student / default → W07 / student / default → W08 / student / default | Pass | Not run |
| J11 Exceptions | W46 / instructor / default → W19 / student / default → W25 / student / default → W58 / instructor / default → W54 / instructor / default | Pass | Not run |
| J12 Term continuity | W06 / instructor / default → W59 / instructor / default → W60 / instructor / default → W35 / instructor / default | Pass | Not run |

Actual page destinations were validated from rendered links across 41,175 views and 794,423 internal links. The gallery covers 189/189 targets. Same-role record hops cannot be supplied by a different record variant. Some tour steps are deliberate time/role/editorial changes, not committing UI actions; no unlabelled action result was fabricated.

Source findings resolved in this pass: W49→W50 missing link; per-task progress labelled assessment-wide; unpublished titles on list and direct routes; safe course-removal states; offline Hide; modal isolation; heading ranks. Retained missing-record fallbacks are documented in design/final/kit_requests.md. No open severity 3–4 finding remains from this source walk. Browser visual/focus/usability acceptance still requires the owner; no localhost or alternate access route was used.
