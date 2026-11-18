# Whiteboard final kit API (Phase 2a, frozen)

2b (fixtures, manifest), 2c (viewer, build) and the Phase 3 page builders build against this file. Any signature change after 2a goes through the coordinator.

## Loading

Plain scripts, no dependencies, no module syntax. Each file is a strict-mode IIFE that registers on `globalThis.WB` (`WB.K` holds the components). Load order (`KIT_FILES` in `design/final/tools/load_kit.mjs`; 2c reuses it for `<script>` order):

`core.js`, `icons.js`, `course-art.js`, `components.js`, `signature.js`, `adaptive.js`, `shell-web.js`, `shell-ipad.js`, `shell-iphone.js`.

`loadKit()` runs them in a fresh, bare `node:vm` context (no `window`, `document` or `console`) and returns `WB`. The viewer injects `WB.icons.sprite()` once per page; `K.icon` refers to its symbols. Styles come from `design/final/system/*.css`.

## Rules every component follows

- Renderers are pure: they return HTML strings, never mutate arguments, and give identical output for identical input.
- Escaped with `WB.esc`: `label`, `title`, `text`, `caption`, `reason`, `value`, `ariaLabel` and other plain-text fields. Trusted HTML from other K calls: `body`, `html`, `list`, `detail`, `cells.*`, `leading`, `trailing`, `footer`, `lastResult`, `dialog`, `toast`, status `detail`.
- Fail fast: unknown platform, role, tone, icon, status, course key, missing required field, unsafe href or missing id throws `Error("WB.K.<fn>: <what>")`. Output never contains `undefined`.
- Classes are all `wb-*`. No colour literals outside `system/tokens.css`.
- Ids are never generated. Any component that emits an id another attribute refers to requires a caller-supplied `id` and derives its inner ids from it (`<id>-reason`, `<id>-help`, `<id>-error`, `<id>-title`, `<id>-sort`, `<id>-list-title`, `<id>-detail-title`). Shells take a required `opts.ns` and prefix every id they emit (`<ns>-main`, `<ns>-menu`, `<ns>-sidebar`, `<ns>-tools`, `<ns>-sections`, `<ns>-account`). Ids inside `body`, `dialog` and `toast` are the caller's.
- Links: `href` allows only a `#` fragment, a scheme-less relative path, `https:` or `mailto:`. Whitespace and control characters are stripped and the scheme compared case-insensitively before matching; anything else (`javascript:`, `data:`, `vbscript:`, `http:`, `//host`) throws.

## Render context

`WB.ctx({platform, role, width?, orientation?, tier?})` returns a frozen `{platform, sizeClass, orientation, role, tier}`.

| platform | input | sizeClass | orientation |
|---|---|---|---|
| `web` | `width: "regular"` (default) / `"narrow"` | regular / compact | null |
| `ipad` | `orientation: "landscape"` (default) / `"portrait"` | regular / compact | as given |
| `iphone` | none | compact | portrait |

`tier` is `full` (default), `review` or `handoff` (BD6, BD11). Every adaptive and shell function takes the ctx first and validates it. `WB.CONTEXTS` lists the five canonical combinations (`web-regular`, `web-compact`, `ipad-regular`, `ipad-compact`, `iphone-compact`) as `WB.ctx` inputs without a role.

Constants (all frozen): `WB.PLATFORMS`, `WB.ROLES` (`student`, `instructor`, `ta`, `guest`), `WB.STAFF`, `WB.ROLE_LABELS`, `WB.TIERS`, `WB.TONES` (`accent`, `success`, `warning`, `error`, `info`, `neutral`), `WB.ACTS`, `WB.COURSE_KEYS` (`phys`, `math`, `chem`, `cs`), `WB.NAV_GLOBAL` (Today, Courses, Calendar, Activity, Tools), `WB.NAV_UTILITY` (Search, Help, Account), `WB.FLAGS`, `WB.SAVE_STATES`.

## Data-attribute contract (behaviour hooks for 2c)

- `data-go="<pageId>[:state][~scenario][?tc=course&ta=assessment&tl=learner&tr=receipt]"`: a destination. Optional record fields select authorized records and never role/identity; context-only queries inherit viewer settings. Links render `href="#/<go>"` plus `data-go`.
- `data-nav="today|courses|calendar|activity|tools|search|help|account"`: global and utility nav links.
- `data-act="open-dialog|close-dialog|toggle|sort|back"` with `data-target="<id>"` (required for `open-dialog`, `toggle`, `sort`). Sort controls add `data-key` (header buttons) or option values `<key>:asc|desc` (compact select).
- `data-note`: a preview-only explanation for a control.
- Calendar shared renderer: `data-cal-op="previous|next|today|view|course|event|close|reset|open-course"` and optional `data-cal-value`; course selects read `.value`. These dispatch local calendar state, never fixture mutations.
- `data-return-focus` on dialogs: 2c returns focus to the opener on close and closes on Escape.

Navigation destinations (global and utility nav, course tabs, crumbs, back links, list and row `go` targets, and destinations in action lists) are `<a href>`; buttons are kept for actions. The 2c viewer intercepts only plain, unmodified, primary-button clicks on internal `#/` links and leaves modified clicks, middle clicks and copy-link native. `aria-current="page"` marks the current item.

Global navigation retains five IDs and destinations. Shells present Today/Courses for learners, Teaching/My courses for instructors, and My grading/My courses for TAs. These labels do not change the viewer role or route identity.

## Status vocabulary (ownership)

The kit owns status labels and visibility in `WB.STATUS` (BD39). 2b's `manifest/status.js` maps record states to `WB.STATUS` keys and must not redefine labels. Keys: `notStarted`, `draft` (ownOnly), `queued` (ownOnly), `received`, `receivedNotReleased`, `late` (modifier), `held`, `graded`, `released`, `feedbackUpdated`, `missing`, `notReceivedClosed`, `excused`, `needsAction`. Each entry is `{label, tone, icon, visibleTo, ownOnly?, needsRelease?, modifier?, attention?}`.

`WB.statusVisible(key, role, {released, own}) → boolean`. Guests see no work statuses. `ownOnly` statuses are hidden with `own: false`. `missing` and `excused` reach the student only with `released: true`. `WB.FLAGS` (Locked, Closed, Extension applied, Last known, Read-only, Not open yet, Instructor preview) are context states, not statuses.

## Helpers (`core.js`)

`WB.esc(x)`, `WB.attrs(obj)` (skips null and false; `true` gives a bare attribute), `WB.fail(fn, what)`, `WB.need(fn, obj, keys)`, `WB.oneOf(fn, what, value, list)`, `WB.safeHref(href, fn)`, `WB.goHref(go, fn)` (go is `<page>[:<variant-or-state>][~<scenario>]`, the scenario a lower-case clock id such as `W53~ps4_released`; the href is `"#/" + go`), `WB.checkId(fn, id)`, `WB.ctx(o)`, `WB.checkCtx(fn, ctx)`.

## Icons, art and logo

- `WB.icons.names`, `WB.icons.sprite() → "<svg …><defs>…</defs></svg>"`.
- `K.icon(name, {label?})`: `aria-hidden="true"` unless `label` is given (then `role="img"` with `aria-label`).
- `WB.courseArt(key) → svg` (decorative, strokes `currentColor`).
- `K.logo({size?: "sm"|"md"|"lg", wordmark?: true})`: the Board mark and wordmark only (BD7).

## Components (`components.js`)

- `K.button({label, kind="secondary"|"primary"|"quiet"|"danger", icon?, act?, target?, note?, disabled?, reason?, id?, ariaLabel?, iconOnly?, expanded?, controls?})`: `<button type="button" class="wb-btn wb-btn--<kind>">`, for actions only. `go` or `href` throws (use `K.link`). `iconOnly` needs `icon` and `ariaLabel`. `disabled` needs `reason` and `id`; renders `aria-disabled="true"`, `aria-describedby="<id>-reason"` and a visible reason (rule 8).
- Action lists (`actions` of `K.notice`, `K.section`, `K.dialog`, `K.actions`, `K.handoff` `protectiveActions`, shell `actions`): each item is either an action (`K.button` options, no `go`/`href`) or a destination (`{label, go?|href?, kind?, icon?, id?, ariaLabel?, iconOnly?, note?}`). A destination renders `<a class="wb-btn wb-btn--<kind>" href>` (`go` gives `href="#/<go>"` plus `data-go`; `href` must be safe), so copy-link and modified clicks stay native; it cannot be `disabled` or carry `act`.
- `K.link({label, go?|href?, current?, icon?})`.
- `K.status(key, ctx, {released?, own?, late?, detail?})`: icon plus text plus tone. Throws when not visible to `ctx.role`. `late: true` adds a Late chip, allowed only on `received` and `receivedNotReleased`; `K.status("late", …)` throws.
- `K.flag(key)`, `K.badge({label, tone, icon?})`.
- `K.notice({tone, title, body?, actions?, icon?})`: `role="alert"` for error, otherwise `role="status"`. `actions` is an action list (see above).
- `K.card({title?, body, footer?, go?, level=2})`, `K.section({title, body, actions?, level=2})`.
- `K.list({label, items: [{title, meta?, leading?, trailing?, go?|href?}]})`.
- `K.kv([{label, value}])` renders a `<dl>`.
- `K.tabs({label, items: [{id, label, go?|href?, current?}]})`: `<nav aria-label>` of links. Each item needs `go` or `href`.
- `K.segmented({label, name, options: [{value, label, selected?}]})`: buttons with `aria-pressed`.
- `K.chips({label, items: [{label, tone?, icon?}]})`, `K.avatar({name})`, `K.empty({title, body?, action?, icon?})`, `K.progress({label, value, max})`, `K.stat({label, value, note?})`.
- `K.disclosure({id, summary, body, open?})`, `K.toast({text, action?})`, `K.lockedNote({owner, reason, requestGo?})`.
- `K.field({id, label, type="text", name?, value?, help?, error?, required?, options?, checked?, disabled?, reason?, min?, max?, step?})`. For `number`, `min`, `max` and `step` accept finite numbers, `min` must not exceed `max`, and `step` must be positive; these options throw on other field types. For `select`, `value` marks the matching option `selected` (it takes precedence over `option.selected`; a value matching no option throws). For `checkbox` and `toggle`, `value` is emitted as the `value` attribute (omitted, the browser default applies). Types: text, email, password, number, date, time, textarea, select, checkbox, toggle. `radio` throws (use `K.choiceGroup`). Always a real `<label for>`; `aria-describedby` covers help, reason and error; an error sets `aria-invalid`. Password fields never block paste (rule 12).
- `K.choiceGroup({id, legend, name, type: "radio"|"checkbox", options: [{id, value, label, checked?}], help?, error?, required?})`: `<fieldset><legend>` with one shared `name`; throws on duplicate option ids or values, and on an option id equal to the group `id`, `<id>-help` or `<id>-error`.

## Signature (`signature.js`)

- `K.receipt({ref, item, course, acceptedAt, timeZone, attempt?, files?, late?})`: plain selectable text, no spinner (rule 2).
- `K.trail({steps: [{label, state: "done"|"current"|"todo", meta?}], label?})` renders an `<ol>`.
- `K.contextLine({institution, course?, term?, role, crumbs?: [{label, go?|href?}]})`.
- `K.saveStatus(state, {time?})`: `dirty` "Unsaved changes" (edited, no save started), `saving` "Saving…", `saved` "Saved", `savedLocal` "Saved locally" (on this device, not yet synced), `failed` "Save failed", `conflict` "Conflict" (C12). Never a work status.
- `K.figure({label, value, basis})`: an honest number that always shows its basis.
- `K.timer({label, remaining, endsAt})`: static text, no animation, no live region (rule 6).
- `K.courseBanner(ctx, {key, code, title, who?, term?})`, `K.courseCard(ctx, {key, code, title, meta?, go?})`.

## Adaptive (`adaptive.js`)

- `K.dialog(ctx, {id, title, body, actions?, kind="confirm"|"form"|"destructive"|"capture", presentation?: "popover", open=false, cancelLabel?})`: scrim plus `<div role="dialog" aria-modal="true" aria-labelledby="<id>-title" data-return-focus>`, `hidden` unless `open`. Variant: web `wb-dialog--modal`; iPad `--formsheet` or `--popover`; iPhone `--sheet` (with grabber) or `--fullscreen` for `capture`. Always a Cancel (Close for capture) button, optionally renamed with a non-empty `cancelLabel`, with `data-act="close-dialog" data-target="<id>"`. `actions` is an action list, each item with an `id`; `destructive` renders primary items as `danger`. The dialog fits its frame (max-height) and only its body scrolls.
- Layout primitives (Phase 2 gate M6). Pages lay out with these; `checkHtml` reports any `style` attribute except the `wb-progress__bar` width. Items are trusted HTML strings; empty strings are dropped and any other non-string throws.
  - `K.stack(ctx, {items, gap="md"})`: `<div class="wb-stack wb-stack--sm|md|lg">`.
  - `K.grid(ctx, {items, cols=3, compactCols=1})`: `cols` 2–4, `compactCols` 1–2; `<div class="wb-grid wb-grid--c<n>">` with each item in `<div class="wb-grid__cell">`, where `n` is `cols` when `ctx.sizeClass` is regular, else `compactCols`.
  - `K.rail(ctx, {main, rail, railLabel, railFirst=false})`: `<div class="wb-rail wb-rail--side">` (regular; main then `<aside class="wb-rail__aside" aria-label="<railLabel>">`) or `wb-rail--stacked` (compact; the aside first when `railFirst`). `railLabel` is required.
- `K.split(ctx, {id, listLabel, detailLabel, list, detail, selected=false})`: regular gives two labelled `<section>` panes (`wb-split--columns` on web, `--splitview` on iPad); compact gives `wb-split--push` with one pane (detail plus a "Back to <listLabel>" `data-act="back"` button when `selected`).
- `K.table(ctx, {id, caption, columns: [{key, label, numeric?, primary?, sortable?, sortLabels?: {asc, desc}}], rows: [{id, cells, go?}], sort?: {key, dir}, selectedId?, empty})`. Regular: `<table id>` with `<caption>`, `<th scope="col">`, the primary cell as `<th scope="row">`, sortable headers as buttons with `aria-sort` on the `th`. Compact: a labelled "Sort by" `<select id="<id>-sort" data-act="sort" data-target="<id>">` (one option per sortable column and direction, current selected) above `<ul class="wb-rowcards" id aria-label="<caption>">`. No rows: `K.empty(empty)`.
- `K.actions(ctx, actions, {label="Page actions"})`: web and iPad `role="toolbar"`; iPhone `wb-dock` with the primary and at most one secondary, the rest under a "More actions" `<details>`.
- `K.actionsPlacement(ctx) → "header" | "dock"`.
- `K.handoff(ctx, {title, lastResult?, note?, protectiveActions?})`: review and handoff tiers only (throws on `full`); protective actions show in the review tier.
- `K.shell(ctx, opts)`: dispatches to `WB.shells[ctx.platform]`.

## Shells (`shell-*.js`)

`WB.shells.web|ipad|iphone(ctx, opts) → html` returns the whole device frame (`wb-frame--web` with `data-width`, `wb-frame--ipad` with `data-orientation`, `wb-frame--iphone`).

`opts`: `{ns, mode="app"|"access", title, body, hrefs, navActive?, course?: {key, code, title, tabs?: [{id, label, go, current?}], tools?: [{id?, label, go, current?}]}, crumbs?, back?: {label, go}, actions?, dialog?, toast?, roleLabel?, links?}`.

- App mode: one `<main>`, one `<h1>`, `<nav aria-label="Main">` with the five `WB.NAV_GLOBAL` links (`data-nav`, `href` from `opts.hrefs[id]`, required for all eight nav ids) and the three `WB.NAV_UTILITY` links. Web regular: sidebar, header utility links, header toolbar, course tabs, staff "Course tools". Web compact: five-item bottom bar and a "Menu" disclosure with course sections, staff tools and utility links (BD1). iPad: sidebar (hidden behind a named toggle in portrait) with utility links in its footer, course tabs, staff tools in a "Tools" popover. iPhone: decorative status bar, nav bar with back link, title (a section-menu button when the course has tabs or, for staff, course tools; the menu holds "Course sections" then "Course tools"), Search link and an Account menu holding Account and Help; then content, dock, tab bar and home indicator.
- Access mode (A-R7: guest sign-in, invite, failed handoff, expired session): frame, logo, `<h1>`, body and `links` as "Help and recovery"; no sidebar, tab bar, course nav, account menu or `data-nav` items. `hrefs` is not required.
- Portrait sidebar: opening moves focus to the in-sidebar Hide button. Hide or Escape closes it and returns focus to the header toggle (`<ns>-sidebar-toggle`).
- The 2c viewer implements this behaviour.
- Role filtering: shells render only the nav and tools they are given (staff tools only for instructor and TA). Filtering by the permission matrix (BD26) is the caller's job.

Card and course-card headings start at h2 beneath the page h1. Compact table row names are paragraphs, not heading sections. Section level remains explicit for nested content.
