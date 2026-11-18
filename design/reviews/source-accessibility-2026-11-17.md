# Source accessibility review

17 Nov 2026. **Source/static review only.** No browser, keyboard, focus, screen-reader, zoom/reflow or device acceptance has run. These observations and decisions were chosen by Codex under owner delegation, with bounded independent Astra review.

Reviewed shared kit components, adaptive tables, receipt semantics, shell/navigation, viewer modal/menu lifecycle, CSS focus/motion/tokens, generated spec outline and dynamic page frames. The render proof exercises 5,079 frames, all 189 targets; html_check validates control names, label targets, IDs and applicable semantic structure. Token checks cover 48 contrast pairs in both themes. These checks do not measure computed colors or physical hit areas in a browser.

| Area | Source result | Remaining owner check |
|---|---|---|
| Control names/fields | Kit labels use for/id; help/error descriptions are associated; disabled buttons retain a visible reason. Source render and kit regressions pass. | Real announcements and focusability |
| Modal | Tab trap and focus restoration retained. Added inert isolation of sibling branches up to body, preserving existing inertness on close/switch/rerender; mock DOM and lifecycle tests cover it. | Pointer, VoiceOver, native inert and actual focus behavior |
| Headings | Repaired card/course-card defaults, compact row names, page section ranks and exported reference headings. frameProblems now rejects skipped ranks throughout every dynamic source render; build test checks the spec. | Screen-reader outline and usefulness of grouping |
| Navigation/gallery | Skip link/focus CSS present; inert/aria-hidden gallery pictures have named normal prototype links. Role-changing page links are rejected. | Actual skip behavior, tab order and route focus |
| Contrast | 48 text/control pairs pass both source palettes. | Computed contrast in all real rendered states |
| Motion | prefers-reduced-motion CSS present; focus is not animated. | OS preference behavior |
| Size/reflow | Width classes, row-card adaptation and larger-text tokens exist. No viewport measurement was made. | 320px, 200% zoom, larger text, iPad orientations and iPhone |
| Receipts/history | Read-only metadata; withdrawn assessment title hidden while own receipt evidence retained. Source mutation tests cover four receipt anchors. | Selectability, wrapping and understandable reading order |

The 189 tracker rows record `Source reviewed`; browser and owner acceptance stay `Not run`. This records the shared source review and render matrix, not accessibility conformance. No open severity 3–4 source finding remains from this review. Use design/final/acceptance/checklist.md for owner execution.
