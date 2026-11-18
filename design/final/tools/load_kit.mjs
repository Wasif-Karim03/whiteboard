// Loads the design/final/kit plain scripts into a fresh, bare node:vm context and returns its WB object.
// The context has no window, document or console, so any browser or Node dependency fails loudly.
// 2c reuses KIT_FILES for <script> order.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const KIT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "kit");
export const KIT_FILES = Object.freeze([
  "core.js",
  "icons.js",
  "course-art.js",
  "components.js",
  "signature.js",
  "adaptive.js",
  "shell-web.js",
  "shell-ipad.js",
  "shell-iphone.js",
]);

export function loadKit({ files = KIT_FILES } = {}) {
  const ctx = vm.createContext({});
  for (const file of files) {
    const filename = path.isAbsolute(file) ? file : path.join(KIT_DIR, file);
    vm.runInContext(fs.readFileSync(filename, "utf8"), ctx, { filename });
  }
  if (!ctx.WB) throw new Error("loadKit: kit did not register WB");
  return ctx.WB;
}

// ---------- Sample render matrix (generic sample arguments, no fictional records) ----------
// Shared by kit.test.mjs and system.test.mjs; 2c may reuse it for a kit gallery.
export const ROLES_ALL = Object.freeze(["student", "instructor", "ta", "guest"]);

export function deepFreeze(x) {
  if (x && typeof x === "object" && !Object.isFrozen(x)) {
    Object.freeze(x);
    for (const v of Object.values(x)) deepFreeze(v);
  }
  return x;
}

const HREFS = { today: "#/W01", courses: "#/W02", calendar: "#/W03", activity: "#/W04", tools: "#/W06", search: "#/W07", help: "#/W08", account: "#/W09" };

export function shellOpts(ns, over = {}) {
  return {
    ns,
    title: "Sample page",
    body: "<p>Sample text</p>",
    navActive: "today",
    hrefs: { ...HREFS },
    course: {
      key: "phys",
      code: "Sample code",
      title: "Sample course",
      tabs: [{ id: "overview", label: "Overview", go: "W10" }, { id: "work", label: "Work", go: "W11", current: true }],
      tools: [{ label: "Sample tool", go: "W40" }],
    },
    crumbs: [{ label: "Courses", go: "W02" }, { label: "Sample page" }],
    back: { label: "Courses", go: "W02" },
    actions: [{ label: "Main action", kind: "primary" }, { label: "Second action" }, { label: "Third action", kind: "quiet" }],
    ...over,
  };
}

// Returns [label, render] pairs for every component in one ctx. All arguments are deep-frozen.
export function renderMatrix(K, WB, ctx) {
  const f = deepFreeze;
  const cases = [];
  const add = (label, render) => cases.push([label, render]);
  for (const kind of ["primary", "secondary", "quiet", "danger"]) add(`button ${kind}`, () => K.button(f({ label: "Sample item", kind, icon: "plus", note: "Preview note" })));
  add("button icon-only", () => K.button(f({ icon: "x", iconOnly: true, ariaLabel: "Close sample" })));
  add("button disabled", () => K.button(f({ id: "m-dis", label: "Sample item", disabled: true, reason: "Sample reason" })));
  add("button opens dialog", () => K.button(f({ label: "Open", act: "open-dialog", target: "m-dlg" })) + K.dialog(ctx, f({ id: "m-dlg", title: "Sample item", body: "<p>Body</p>" })));
  add("link go", () => K.link(f({ label: "Sample item", go: "W05", icon: "chev-r", current: true })));
  add("link href", () => K.link(f({ label: "Sample item", href: "https://example.org/help" })));
  for (const key of Object.keys(WB.STATUS)) {
    if (WB.STATUS[key].modifier || !WB.statusVisible(key, ctx.role, { released: true })) continue;
    add(`status ${key}`, () => K.status(key, ctx, f({ released: true, detail: "<span>Sample detail</span>" })));
  }
  if (WB.statusVisible("received", ctx.role)) add("status received late", () => K.status("received", ctx, f({ late: true })));
  for (const key of Object.keys(WB.FLAGS)) add(`flag ${key}`, () => K.flag(key));
  for (const tone of WB.TONES) {
    add(`badge ${tone}`, () => K.badge(f({ label: "3 new", tone, icon: "bell" })));
    add(`notice ${tone}`, () => K.notice(f({ tone, title: "Sample item", body: "<p>Sample text</p>", actions: [{ label: "Retry", icon: "retry" }, { label: "Open item", go: "W05:open" }] })));
  }
  add("card", () => K.card(f({ title: "Sample item", body: "<p>Sample text</p>", footer: "<p>Footer</p>", go: "W05" })));
  add("section", () => K.section(f({ title: "Sample item", body: "<p>Sample text</p>", actions: [{ label: "Add", icon: "plus" }] })));
  add("list", () => K.list(f({ label: "Sample list", items: [{ title: "Sample item", meta: "Meta", go: "W05", leading: K.icon("doc"), trailing: "<span>2</span>" }, { title: "Plain item" }] })));
  add("kv", () => K.kv(f([{ label: "Label", value: "Sample value" }, { label: "Count", value: 3 }])));
  add("tabs", () => K.tabs(f({ label: "Sample tabs", items: [{ id: "a", label: "First", go: "W05", current: true }, { id: "b", label: "Second", go: "W05:b" }] })));
  add("segmented", () => K.segmented(f({ label: "View", name: "view", options: [{ value: "list", label: "List", selected: true }, { value: "grid", label: "Grid" }] })));
  add("chips", () => K.chips(f({ label: "Filters", items: [{ label: "Open" }, { label: "Due soon", tone: "warning", icon: "clock" }] })));
  add("avatar", () => K.avatar(f({ name: "Sample Person" })));
  add("empty", () => K.empty(f({ title: "Nothing here yet", body: "<p>Sample text</p>", action: { label: "Add item", kind: "primary" } })));
  add("progress", () => K.progress(f({ label: "Sample progress", value: 3, max: 8 })));
  add("stat", () => K.stat(f({ label: "Sample stat", value: "12", note: "Of 20 items" })));
  add("disclosure", () => K.disclosure(f({ id: "m-disc", summary: "More detail", body: "<p>Sample text</p>", open: true })));
  add("toast", () => K.toast(f({ text: "Sample saved", action: { label: "Undo" } })));
  add("lockedNote", () => K.lockedNote(f({ owner: "Sample owner", reason: "Set by the course", requestGo: "W30" })));
  const FIELD_VALUES = { number: 2, select: "b", checkbox: "yes", toggle: "on-site" };
  for (const type of ["text", "email", "password", "number", "date", "time", "textarea", "select", "checkbox", "toggle"])
    add(`field ${type}`, () => K.field(f({ id: `m-f-${type}`, label: "Sample field", type, value: FIELD_VALUES[type], help: "Help text", error: "Error text", required: true, options: type === "select" ? [{ value: "a", label: "Option A", selected: true }, { value: "b", label: "Option B" }] : undefined })));
  add("field disabled", () => K.field(f({ id: "m-f-dis", label: "Sample field", disabled: true, reason: "Set by the course" })));
  for (const type of ["radio", "checkbox"])
    add(`choiceGroup ${type}`, () => K.choiceGroup(f({ id: `m-cg-${type}`, legend: "Sample question", name: `m-cg-${type}`, type, help: "Pick one", error: "Required", required: true, options: [{ id: `m-cg-${type}-a`, value: "a", label: "Option A", checked: true }, { id: `m-cg-${type}-b`, value: "b", label: "Option B" }] })));
  add("receipt", () => K.receipt(f({ ref: "R-0001", item: "Sample item", course: "Sample course", acceptedAt: "Mon 4:02 PM", timeZone: "Local time", attempt: 2, files: ["sample.pdf"], late: true })));
  add("trail", () => K.trail(f({ steps: [{ label: "Started", state: "done", meta: "Mon" }, { label: "Review", state: "current" }, { label: "Release", state: "todo" }] })));
  add("contextLine", () => K.contextLine(f({ institution: "Sample institution", course: "Sample course", term: "Sample term", role: ctx.role, crumbs: [{ label: "Courses", go: "W02" }, { label: "Here" }] })));
  for (const s of Object.keys(WB.SAVE_STATES)) add(`saveStatus ${s}`, () => K.saveStatus(s, f({ time: "4:02 PM" })));
  add("figure", () => K.figure(f({ label: "Sample figure", value: "7 of 9", basis: "Released items only" })));
  add("timer", () => K.timer(f({ label: "Time left", remaining: "12 min", endsAt: "4:30 PM" })));
  for (const key of WB.COURSE_KEYS) {
    add(`courseBanner ${key}`, () => K.courseBanner(ctx, f({ key, code: "Sample code", title: "Sample course", who: "Sample section", term: "Sample term" })));
    add(`courseCard ${key}`, () => K.courseCard(ctx, f({ key, code: "Sample code", title: "Sample course", meta: "Meta", go: "W10" })));
  }
  add("logo", () => K.logo() + K.logo(f({ size: "lg", wordmark: false })));
  add("icon labelled", () => K.icon("info", f({ label: "Information" })));
  add("sprite", () => WB.icons.sprite());
  for (const kind of ["confirm", "form", "destructive", "capture"])
    add(`dialog ${kind}`, () => K.dialog(ctx, f({ id: `m-dlg-${kind}`, title: "Sample item", body: "<p>Body</p>", kind, open: kind === "form", actions: [{ id: `m-dlg-${kind}-ok`, label: "Confirm", kind: "primary" }, { id: `m-dlg-${kind}-go`, label: "View details", go: "W05" }] })));
  add("dialog popover", () => K.dialog(ctx, f({ id: "m-pop", title: "Sample item", body: "<p>Body</p>", presentation: "popover" })));
  for (const selected of [false, true]) add(`split selected=${selected}`, () => K.split(ctx, f({ id: "m-split", listLabel: "Items", detailLabel: "Detail", list: "<p>List</p>", detail: "<p>Detail</p>", selected })));
  const table = { id: "m-table", caption: "Sample table", columns: [{ key: "a", label: "Item", primary: true, sortable: true }, { key: "b", label: "Count", numeric: true }], rows: [{ id: "r1", cells: { a: "Sample item", b: "2" }, go: "W05" }], sort: { key: "a", dir: "asc" }, selectedId: "r1", empty: { title: "No items" } };
  add("stack", () => K.stack(ctx, f({ items: ["<p>One</p>", "", "<p>Two</p>"], gap: "sm" })));
  add("grid", () => K.grid(ctx, f({ items: ["<p>One</p>", "<p>Two</p>", "<p>Three</p>"], cols: 3, compactCols: 2 })));
  add("rail", () => K.rail(ctx, f({ main: "<p>Main</p>", rail: "<p>Rail</p>", railLabel: "Details" })));
  add("rail railFirst", () => K.rail(ctx, f({ main: "<p>Main</p>", rail: "<p>Rail</p>", railLabel: "Details", railFirst: true })));
  add("table", () => K.table(ctx, f({ ...table })));
  add("table empty", () => K.table(ctx, f({ ...table, rows: [] })));
  add("actions", () => K.actions(ctx, f([{ label: "Main", kind: "primary" }, { label: "Two", go: "W05" }, { label: "Three" }, { label: "Four", href: "https://example.org/help", kind: "quiet" }])));
  if (ctx.tier !== "full") add("handoff", () => K.handoff(ctx, f({ title: "Open on a larger screen", lastResult: "<p>Last result</p>", note: "Editing needs more room", protectiveActions: [{ label: "Hold release" }] })));
  add("shell app", () => K.shell(ctx, f(shellOpts("m-shell", { dialog: K.dialog(ctx, { id: "m-shell-dlg", title: "Sample item", body: "<p>Body</p>" }), toast: K.toast({ text: "Sample saved" }) }))));
  add("shell access", () => K.shell(ctx, f({ ns: "m-acc", mode: "access", title: "Sign in", body: "<p>Sample text</p>", links: [{ label: "Help", go: "W08" }] })));
  return cases;
}
