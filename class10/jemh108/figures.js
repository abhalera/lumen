// Schematic redraw of jemh108 Fig. 8.13 (printed p. 121).
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 12) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(x1, y1, x2, y2, c, w){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#111") + '" stroke-width="' + (w || 1.6) + '"/>'; }
  var figs = {};
  figs["8.13"] = {caption: "Fig. 8.13: △PQR, right-angled at Q, PQ = 12 cm, PR = 13 cm.", svg: function(){
    var b = ln(40, 200, 160, 200, "#111", 2) + ln(40, 200, 40, 40, "#111", 2) + ln(40, 40, 160, 200, "#111", 2);
    b += ln(40, 200, 52, 188, "#111", 1.2) + ln(52, 188, 52, 200, "#111", 1.2);
    b += t(28, 36, "P", {weight: 700}) + t(28, 214, "Q", {weight: 700}) + t(172, 214, "R", {weight: 700});
    b += t(18, 120, "12 cm", {size: 12}) + t(110, 110, "13 cm", {size: 12});
    return wrap(200, 230, b, "Fig. 8.13");
  }};
  return figs;
})();
