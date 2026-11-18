// Entry shim so the plan's proof command `node --test design/final/tools/` works on Node 24,
// which resolves a directory argument as a module (this file) rather than scanning it for tests.
// It only loads the real test file; there is no package.json and no dependency.
import("./tools.test.mjs");
import("./tokens.test.mjs");
import("./kit.test.mjs");
import("./system.test.mjs");
import("./data.test.mjs");
import("./pages.test.mjs");
import("./viewer.test.mjs");
import("./build.test.mjs");
import("./gate.test.mjs");
import("./spine.test.mjs");
import("./spine-authority.test.mjs");
import("./spine-fixes.test.mjs");
import("./spine-fixes2.test.mjs");
import("./spine-fixes3.test.mjs");
import("./seg1-access.test.mjs");
import("./seg2-course.test.mjs");
import("./seg3-submit.test.mjs");
import("./seg4-community.test.mjs");
import("./seg5-authoring.test.mjs");
import("./seg6-grading.test.mjs");

import("./boundaries.test.mjs");
import("./navigation.test.mjs");
import("./integration-enrollment.test.mjs");
import("./modal.test.mjs");
import("./workspace-pages.test.mjs");
import("./workspace-shell.test.mjs");
import("./simplicity-pages.test.mjs");
import("./simplicity-shell.test.mjs");
import("./calendar-view.test.mjs");
import("./calendar-integration.test.mjs");
import("./role-queue.test.mjs");
import("./role-workspaces.test.mjs");

import("./teaching-data.test.mjs");
import("./teaching-staffing.test.mjs");
import("./teaching-navigation.test.mjs");

import("./whole-student.test.mjs");
import("./whole-context.test.mjs");
