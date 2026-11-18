/* Whiteboard final kit: course art and the Board logo (BD7: one logo, no switcher).
   Art is ported from the design board's ART table; strokes and fills use currentColor so the banner's
   --wb-on-course colour draws them. */
(function (root) {
  "use strict";
  var WB = (root.WB = root.WB || {});
  var K = (WB.K = WB.K || {});

  WB.COURSE_KEYS = Object.freeze(["phys", "math", "chem", "cs"]);

  var SER = 'font-family="Georgia,\'Times New Roman\',serif" font-style="italic"';
  var MONO = 'font-family="ui-monospace,Menlo,monospace"';
  var LBL = 'fill="currentColor" stroke="none"';
  var GRID =
    '<g stroke-width=".6" opacity=".16">' +
    [190, 220, 250, 280, 310].map(function (x) { return '<path d="M' + x + ' 10V130"/>'; }).join("") +
    [30, 55, 80, 105].map(function (y) { return '<path d="M176 ' + y + 'H334"/>'; }).join("") +
    "</g>";

  var ART = {
    phys:
      GRID +
      '<path d="M186 118H330M186 118V16" stroke-width="1" opacity=".6"/>' +
      '<g stroke-width=".8" opacity=".5">' +
      [216, 246, 276, 306].map(function (x) { return '<path d="M' + x + ' 118v4"/>'; }).join("") +
      [88, 58].map(function (y) { return '<path d="M186 ' + y + 'h-4"/>'; }).join("") +
      "</g>" +
      '<path d="M190 118Q256 -6 322 118" stroke-width="1.3" opacity=".9"/>' +
      '<path d="M190 118L222 74" stroke-width="1.1" opacity=".85"/><path d="M222 74l-9 2.5M222 74l-2 9" stroke-width="1.1" opacity=".85"/>' +
      '<path d="M256 118V56" stroke-width=".7" stroke-dasharray="2 3" opacity=".5"/>' +
      '<g stroke-width="1.1"><circle cx="190" cy="118" r="3" fill="none"/><circle cx="256" cy="56" r="3.2" fill="currentColor" stroke="none" opacity=".95"/><circle cx="322" cy="118" r="3" fill="none"/></g>' +
      '<text x="222" y="62" ' + LBL + ' font-size="11" opacity=".6" ' + SER + ">v₀</text>" +
      '<text x="262" y="50" ' + LBL + ' font-size="10.5" opacity=".55" ' + SER + ">h</text>" +
      '<text x="272" y="108" ' + LBL + ' font-size="10.5" opacity=".55" ' + SER + ">R = v₀² sin2θ / g</text>",
    math:
      GRID +
      '<path d="M176 70H336M256 12V128" stroke-width="1" opacity=".6"/>' +
      '<circle cx="256" cy="70" r="22" stroke-width=".9" stroke-dasharray="2 3" opacity=".55"/>' +
      '<ellipse cx="256" cy="70" rx="56" ry="24" transform="rotate(-24 256 70)" stroke-width="1.3" opacity=".9"/>' +
      '<path d="M256 70L304 49M256 70L222 85" stroke-width="1.1" opacity=".85"/><path d="M304 49l-9 1.2M304 49l-3.5 8" stroke-width="1.1" opacity=".85"/>' +
      '<path d="M256 70L244 44" stroke-width=".9" opacity=".55"/>' +
      '<g fill="currentColor" stroke="none"><circle cx="256" cy="70" r="2.6" opacity=".95"/></g>' +
      '<text x="302" y="38" ' + LBL + ' font-size="11" opacity=".65" ' + SER + ">λv</text>" +
      '<text x="180" y="30" ' + LBL + ' font-size="11" opacity=".55" ' + SER + ">Av = λv</text>" +
      '<text x="300" y="114" ' + LBL + ' font-size="10.5" opacity=".5" ' + SER + ">det(A − λI) = 0</text>",
    chem:
      GRID +
      '<path d="M226 38l26 15v30l-26 15-26-15V53z" stroke-width="1.3" opacity=".9"/><circle cx="226" cy="68" r="11" stroke-width=".9" opacity=".55"/>' +
      '<path d="M252 53l26-15 26 15v30l-26 15-26-15" stroke-width="1.3" opacity=".7"/>' +
      '<path d="M304 68h18M322 68l7-6M322 68l7 6" stroke-width="1.1" opacity=".7"/>' +
      '<g fill="none" stroke-width="1"><circle cx="226" cy="38" r="2.8" opacity=".9"/><circle cx="200" cy="53" r="2.4" opacity=".6"/></g>' +
      '<text x="180" y="120" ' + LBL + ' font-size="11" opacity=".55" ' + SER + ">C₁₀H₈</text>" +
      '<text x="262" y="124" ' + LBL + ' font-size="10.5" opacity=".5" ' + SER + ">ΔG = ΔH − TΔS</text>",
    cs:
      GRID +
      '<path d="M270 30L236 66M270 30L304 66M236 66L218 102M236 66L254 102M304 66L286 102M304 66L322 102" stroke-width="1.1" opacity=".75"/>' +
      '<g class="wb-art__node" stroke-width="1.2"><circle cx="270" cy="30" r="6"/><circle cx="236" cy="66" r="5.5"/><circle cx="304" cy="66" r="5.5"/><circle cx="218" cy="102" r="5"/><circle cx="254" cy="102" r="5"/><circle cx="286" cy="102" r="5"/><circle cx="322" cy="102" r="5"/></g>' +
      '<text x="180" y="30" ' + LBL + ' font-size="10.5" opacity=".55" ' + MONO + ">O(log n)</text>" +
      '<text x="180" y="120" ' + LBL + ' font-size="10.5" opacity=".45" ' + MONO + ">T(n)=2T(n/2)+n</text>",
  };

  WB.checkCourse = function (fn, key) {
    return WB.oneOf(fn, "course key", key, WB.COURSE_KEYS);
  };

  WB.courseArt = function (key) {
    WB.checkCourse("courseArt", key);
    return (
      '<svg class="wb-art" viewBox="0 0 340 140" preserveAspectRatio="xMaxYMid meet" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      ART[key] +
      "</svg>"
    );
  };

  // The Board mark: a whiteboard with its marker shelf and one written line (the board's default mark).
  var MARK =
    '<rect x="12" y="14" width="76" height="56" rx="11" fill="none" stroke="currentColor" stroke-width="10"/>' +
    '<path d="M12 86h76" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>' +
    '<path d="M30 44h26" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>';
  var BRAND = "Whiteboard";

  K.logo = function (opts) {
    var o = opts || {};
    var size = o.size === undefined ? "md" : WB.oneOf("logo", "size", o.size, ["sm", "md", "lg"]);
    var withWord = o.wordmark !== false;
    var svg = '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' + MARK + "</svg>";
    var mark = withWord
      ? '<span class="wb-logo__mark">' + svg + "</span>"
      : '<span class="wb-logo__mark" role="img" aria-label="' + BRAND + '">' + svg + "</span>";
    return '<span class="wb-logo wb-logo--' + size + '">' + mark + (withWord ? '<span class="wb-logo__word">' + BRAND + "</span>" : "") + "</span>";
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
