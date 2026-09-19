// Textbook figures used by jemh102 exercises, redrawn as SVG from Fig. 2.10 (PDF p. 9 / printed p. 18).
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 11) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(x1, y1, x2, y2, c, w){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#111") + '" stroke-width="' + (w || 1.5) + '"/>'; }
  function poly(pts, stroke, fill, w){ return '<polyline points="' + pts + '" fill="' + (fill || "none") + '" stroke="' + stroke + '" stroke-width="' + (w || 2.2) + '" stroke-linejoin="round" stroke-linecap="round"/>'; }
  function panel(ox, oy, s, path, label){
    var g = '<rect x="' + ox + '" y="' + oy + '" width="' + s + '" height="' + s + '" fill="#dbeafe" stroke="#93c5fd"/>';
    var cx = ox + s/2, cy = oy + s/2;
    g += ln(ox + 8, cy, ox + s - 8, cy, "#111", 1.4) + ln(cx, oy + 8, cx, oy + s - 8, "#111", 1.4);
    g += t(ox + s - 10, cy - 6, "X", {size: 9, weight: 700}) + t(cx + 8, oy + 14, "Y", {size: 9, weight: 700});
    g += t(cx - 10, cy + 12, "O", {size: 8});
    g += '<g transform="translate(' + ox + ',' + oy + ')">' + path + '</g>';
    g += t(cx, oy + s + 16, label, {size: 12, weight: 700});
    return g;
  }
  var figs = {};
  figs["2.10"] = {caption: "Fig. 2.10: Graphs of y = p(x) for Exercise 2.1 (redrawn).", svg: function(){
    var s = 150, gap = 24, top = 10, left = 16;
    var p = "";
    // (i) horizontal line y > 0
    p += panel(left, top, s, poly("20,55 130,55", "#111", "none", 2.4), "(i)");
    // (ii) below, one crossing on +x
    p += panel(left + s + gap, top, s, poly("25,110 50,85 75,95 100,100 125,30", "#111", "none", 2.4), "(ii)");
    // (iii) three crossings
    p += panel(left + 2*(s + gap), top, s, poly("20,120 45,30 75,40 100,85 130,20", "#111", "none", 2.4), "(iii)");
    // (iv) parabola left of y-axis, two crossings
    p += panel(left, top + s + 36, s, poly("25,40 45,90 70,90 90,40", "#111", "none", 2.4), "(iv)");
    // (v) four crossings
    p += panel(left + s + gap, top + s + 36, s, poly("20,110 40,40 60,90 80,35 110,45 130,110", "#111", "none", 2.4), "(v)");
    // (vi) one crossing + two touches
    p += panel(left + 2*(s + gap), top + s + 36, s, poly("20,120 40,45 55,75 75,40 100,75 125,30", "#111", "none", 2.4), "(vi)");
    var w = left + 3*(s + gap) - gap + 16, h = top + 2*s + 70;
    return wrap(w, h, p, "Fig. 2.10: six graphs of y = p(x)");
  }};
  return figs;
})();
