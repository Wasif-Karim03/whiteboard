/* Whiteboard final kit: line icons (24-unit grid, stroke = currentColor). Ported from design/batch01/kit.js
   with nav and status additions. The viewer injects WB.icons.sprite() once per page. */
(function (root) {
  "use strict";
  var WB = (root.WB = root.WB || {});
  var K = (WB.K = WB.K || {});

  var P = {
    today: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    book: '<path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17.2v.1"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/>',
    "chev-r": '<path d="M9 5l7 7-7 7"/>',
    "chev-l": '<path d="M15 5l-7 7 7 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8 5.5-5.6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    camera: '<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/>',
    doc: '<path d="M7.5 3H14l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    photo: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 3.5 3 3-2.5L20 17"/>',
    folder: '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    offline: '<path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0M12 19h.01M3 3l18 18"/>',
    alert: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.3v.1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.1"/>',
    retry: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4.5V11h-6.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    rotate: '<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4.5V10h5.5"/>',
    grip: '<path d="M5 9h14M5 15h14"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7.5M18 14.8c1.8.8 3 2.6 3.5 5.2"/>',
    support: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    hourglass: '<path d="M7 3h10M7 21h10M8 3v2.5a4 4 0 0 0 1.6 3.2L12 10.5l2.4-1.8A4 4 0 0 0 16 5.5V3M8 21v-2.5a4 4 0 0 1 1.6-3.2L12 13.5l2.4 1.8a4 4 0 0 1 1.6 3.2V21"/>',
    "eye-off": '<path d="M3 3l18 18M10.6 6.1A9.6 9.6 0 0 1 12 6c5 0 8.5 4.5 9.5 6a17 17 0 0 1-2.9 3.4M6.6 7.6C4.4 9 3 11 2.5 12c1 1.5 4.5 6 9.5 6 1.4 0 2.7-.3 3.8-.9"/><path d="M9.9 10a3 3 0 0 0 4.1 4.1"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/>',
    chat: '<path d="M4 5.5h16v10H10l-4 3.5v-3.5H4z"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    eye: '<path d="M2.5 12C3.5 10.5 7 6 12 6s8.5 4.5 9.5 6c-1 1.5-4.5 6-9.5 6s-8.5-4.5-9.5-6z"/><circle cx="12" cy="12" r="3"/>',
    flash: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    ticket: '<path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4z"/><path d="M14.5 6.5v2M14.5 11v2M14.5 15.5v2"/>',
    org: '<path d="M6 21V4.5M6 5h11l-2 4 2 4H6"/><path d="M3.5 21h7"/>',
    home: '<path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
    tool: '<path d="M14.5 4.5a4.5 4.5 0 0 0-5.6 5.8L3.5 15.7l2.8 2.8 5.4-5.4a4.5 4.5 0 0 0 5.8-5.6l-2.7 2.7-2.6-.5-.5-2.6z"/>',
    sort: '<path d="M8 4v16M4.5 7.5L8 4l3.5 3.5M16 20V4M12.5 16.5L16 20l3.5-3.5"/>',
    more: '<path d="M6 12h.01M12 12h.01M18 12h.01"/>',
    sidebar: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M9.5 4.5v15"/>',
    "chev-d": '<path d="M5 9l7 7 7-7"/>',
    screen: '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/>',
  };
  var NAMES = Object.freeze(Object.keys(P));

  WB.icons = Object.freeze({
    names: NAMES,
    sprite: function () {
      return (
        '<svg class="wb-sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs>' +
        NAMES.map(function (k) { return '<symbol id="wb-i-' + k + '" viewBox="0 0 24 24">' + P[k] + "</symbol>"; }).join("") +
        "</defs></svg>"
      );
    },
  });

  // Decorative (aria-hidden) unless a label is given, in which case it is a named image.
  K.icon = function (name, opts) {
    if (!Object.prototype.hasOwnProperty.call(P, name)) WB.fail("icon", "unknown icon '" + name + "'");
    var o = opts || {};
    var a = o.label ? WB.attrs({ role: "img", "aria-label": o.label }) : ' aria-hidden="true"';
    return '<svg class="wb-icon"' + a + ' focusable="false"><use href="#wb-i-' + name + '"/></svg>';
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
