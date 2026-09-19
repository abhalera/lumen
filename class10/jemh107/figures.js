// Schematic redraws of jemh107 exercise figures (printed pp. 105, 111).
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 12) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(x1, y1, x2, y2, c, w){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#111") + '" stroke-width="' + (w || 1.6) + '"/>'; }
  function circ(x, y, r, fill, stroke){ return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 4) + '" fill="' + (fill || "#111") + '" stroke="' + (stroke || "none") + '"/>'; }
  var figs = {};
  figs["7.8"] = {caption: "Fig. 7.8: classroom seats A(3, 4), B(6, 7), C(9, 4), D(6, 1).", svg: function(){
    var b = "", i, j, x, y;
    for (i = 0; i <= 10; i++) {
      x = 40 + i * 24;
      b += ln(x, 20, x, 260, "#e5e7eb", 1);
      b += t(x, 276, String(i), {size: 10});
    }
    for (j = 0; j <= 10; j++) {
      y = 260 - j * 24;
      b += ln(40, y, 280, y, "#e5e7eb", 1);
      b += t(28, y + 4, String(j), {size: 10});
    }
    function pt(c, r, name){
      var px = 40 + c * 24, py = 260 - r * 24;
      b += circ(px, py, 5, "#2563eb");
      b += t(px + 12, py - 8, name, {size: 12, weight: 700, color: "#1d4ed8"});
    }
    pt(3, 4, "A"); pt(6, 7, "B"); pt(9, 4, "C"); pt(6, 1, "D");
    b += t(160, 294, "Columns", {size: 11}) + t(14, 20, "Rows", {size: 11});
    return wrap(320, 310, b, "Fig. 7.8");
  }};
  figs["7.12"] = {caption: "Fig. 7.12: sports-day ground. Green flag (2, 25), red flag (8, 20).", svg: function(){
    var b = ln(40, 260, 300, 260, "#111", 1.6) + ln(40, 260, 40, 20, "#111", 1.6);
    b += ln(300, 260, 300, 20, "#111", 1.2) + ln(40, 20, 300, 20, "#111", 1.2);
    var i;
    for (i = 1; i <= 10; i++) {
      var x = 40 + i * 24;
      b += ln(x, 20, x, 260, "#93c5fd", 1);
      b += t(x, 276, String(i), {size: 10});
    }
    b += t(36, 274, "A", {size: 12, weight: 700}) + t(312, 274, "B", {size: 12, weight: 700});
    b += t(36, 16, "D", {size: 12, weight: 700}) + t(312, 16, "C", {size: 12, weight: 700});
    var g = {x: 40 + 2 * 24, y: 260 - 0.25 * 240};
    var r = {x: 40 + 8 * 24, y: 260 - 0.20 * 240};
    b += circ(g.x, g.y, 6, "#16a34a") + t(g.x, g.y - 12, "green", {size: 11, color: "#16a34a"});
    b += circ(r.x, r.y, 6, "#dc2626") + t(r.x, r.y - 12, "red", {size: 11, color: "#dc2626"});
    b += ln(g.x, g.y, r.x, r.y, "#7c3aed", 1.6);
    return wrap(340, 300, b, "Fig. 7.12");
  }};
  return figs;
})();
