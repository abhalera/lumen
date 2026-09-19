// Schematic redraws of jemh109 exercise figures (printed pp. 141–142).
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 12) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(x1, y1, x2, y2, c, w){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#111") + '" stroke-width="' + (w || 1.6) + '"/>'; }
  var figs = {};
  figs["9.11"] = {caption: "Fig. 9.11: 20 m rope from pole top to ground at 30°.", svg: function(){
    var b = ln(40, 180, 40, 40, "#111", 2) + ln(40, 180, 200, 180, "#111", 1.5) + ln(40, 40, 200, 180, "#dc2626", 2);
    b += t(28, 36, "A") + t(28, 196, "B") + t(214, 196, "C") + t(130, 100, "20 m", {size: 11, color: "#dc2626"}) + t(90, 174, "30°", {size: 11});
    return wrap(240, 220, b, "Fig. 9.11");
  }};
  figs["9.12"] = {caption: "Fig. 9.12: TV tower on a canal; elevations 60° then 30°, 20 m apart.", svg: function(){
    var b = ln(40, 180, 40, 40, "#111", 2) + ln(40, 180, 220, 180, "#111", 1.5);
    b += ln(40, 40, 120, 180, "#2563eb", 1.6) + ln(40, 40, 180, 180, "#dc2626", 1.6);
    b += t(28, 36, "T") + t(120, 196, "60°") + t(180, 196, "30°") + t(150, 174, "20 m", {size: 11});
    return wrap(240, 220, b, "Fig. 9.12");
  }};
  figs["9.13"] = {caption: "Fig. 9.13: balloon at 88.2 m; elevations 60° then 30° from a 1.2 m girl.", svg: function(){
    var b = ln(30, 190, 250, 190, "#111", 1.4) + ln(50, 190, 50, 170, "#111", 2);
    b += ln(80, 40, 220, 40, "#93c5fd", 1.5);
    b += ln(50, 170, 80, 40, "#16a34a", 1.6) + ln(50, 170, 220, 40, "#dc2626", 1.6);
    b += t(70, 36, "60°", {size: 11}) + t(200, 36, "30°", {size: 11}) + t(40, 160, "girl", {size: 11});
    return wrap(270, 220, b, "Fig. 9.13");
  }};
  return figs;
})();
