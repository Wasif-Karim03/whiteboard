/* Whiteboard Phase 2c: loads after every page file (team plan Step 2). Fills a placeholder for each manifest
   page with no registration, then freezes the registry so WB.pageFor works and WB.definePage refuses. */
(function (root) {
  "use strict";
  root.WB.sealPages();
})(typeof globalThis !== "undefined" ? globalThis : this);
