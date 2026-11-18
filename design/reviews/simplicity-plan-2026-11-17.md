# Simplifying the Whiteboard prototype

Chosen by Codex under owner delegation on 17 November 2026. The owner asked for less text, clearer navigation and the ease of use associated with Apple's software. This refines the existing prototype; no backend, service, purchase or deployment is added.

## Observed problem and direction

Read-only inspection of the owner's open Chrome Course Home showed repeated Whiteboard/course identity, eight equal course tabs, repeated next-due coursework and oversized statistics competing with the task. A style refresh had left the information hierarchy too busy.

Use clear hierarchy, familiar controls and progressive disclosure. Keep frequent destinations and decisions visible. Hide secondary breakdowns, policies and prototype controls behind descriptive summaries. Do not hide errors, deadlines, grade basis, access expiry or missing submission coverage.

Apple references checked 17 November 2026:
- [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles/): purposeful, familiar, clear and concise interfaces.
- [Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls/): frequent controls visible, advanced details available on demand, descriptive summaries.
- [Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables/): consistent, scannable collections.

These inform the decisions; they are not a claim of Apple endorsement or measured user performance.

## Implementation and acceptance criteria

- Regular web/iPad course navigation: three core destinations per role, secondary sections under More. A current secondary section names itself on the closed summary. Keep all authorized links; compact navigation remains flat.
- Course menus close on selection (including the current route), Escape, focus leaving the menu or an outside pointer click. Escape returns focus to the summary. Preserve modal isolation.
- Preview bar: one Fictional demo label and Preview settings. Keep all controls and live announcements; routine route metadata is visually quiet, while blocked/preview/error messages remain visible.
- Today: next task once, due/status and one primary record action; other upcoming work visible. Progress and calendar/activity are optional summaries. Preserve scoped TA progress and access warnings.
- Courses: current/past remain visible. Preview-only search/term controls are grouped under Find a course; their limitations remain explicit.
- Course Home: actual course title, next due first, module rows without the repeated next item, course progress closed. No duplicate Coursework/Grades links.
- Assignment: due/points and own next action before secondary details. File review: files and review action first; completed tags optional, errors and gaps visible. Grades: released-only total and item rows first; category breakdown optional.
- Retain light/dark semantic tokens, focus, target sizes, reduced motion, permissions and record matching. Keep the static spec stylesheet and byte budget unchanged.

## Verification boundary

Add source/mock regressions for default visible content, complete secondary navigation, current context, menu lifecycle and critical warnings. Run the full required proof and static detector. A native screenshot established the earlier clutter; it does not verify the rebuilt layout. Isolated Playwright previously rejected file URLs. No alternate hosting or restriction bypass is authorized. Browser/reflow/keyboard/screen-reader/device checks and formal owner acceptance remain unrun.
