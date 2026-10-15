// Unit checks of actual controller action routing with test doubles; no browser claim.
const fs = require("fs"),
  vm = require("vm"),
  path = require("path"),
  assert = require("assert/strict");
const source = fs.readFileSync(
  path.join(__dirname, "../src/controller.js"),
  "utf8",
);
const code = source.slice(
  source.indexOf("function run("),
  source.indexOf('document.addEventListener("click"'),
);
const events = [],
  field = {
    dataset: { bind: "assignment.due" },
    id: "field",
    setAttribute: (...x) => events.push(["aria", ...x]),
    focus: () => events.push(["focus"]),
  },
  destination = { dataset: { screen: "S08" } };
let called = 0;
const c = {
  W: {
    fieldErrors: { "assignment.due": "Enter a valid date." },
    ui: {},
    dispatch: () => {
      called++;
      return { go: "S08", message: "Received" };
    },
  },
  all: () => [field],
  actorFor: () => "student",
  notify: (...x) => events.push(["notify", ...x]),
  renderAll: () => events.push(["render"]),
  openScreen: (x) => events.push(["open", x]),
  stageFor: () => destination,
  download: () => {},
  document: { getElementById: () => null },
  console: { error: () => {} },
};
vm.createContext(c);
vm.runInContext(code, c);
const stage = { dataset: { screen: "S07" } };
c.run("student-submit", {}, stage);
assert.equal(called, 0);
assert(events.some((x) => x[0] === "focus"));
c.W.fieldErrors = {};
events.length = 0;
c.run("student-submit", {}, stage);
assert.equal(called, 1);
assert(events.some((x) => x[0] === "open" && x[1] === "S08"));
assert.equal(events.find((x) => x[0] === "notify")[2], destination);
console.log(
  "Controller unit checks passed: visible invalid inputs block actions; successful routing announces at destination. No browser was executed.",
);
