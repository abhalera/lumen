// Schematic redraws of jemh110 exercise figures.
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 12) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(x1, y1, x2, y2, c, w){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#111") + '" stroke-width="' + (w || 1.6) + '"/>'; }
  function circ(x, y, r){ return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="#111" stroke-width="1.6"/>'; }
  var figs = {};
  figs["10.11"] = {caption: "Fig. 10.11: tangents TP, TQ with ∠POQ = 110°.", svg: function(){
    var b = circ(120, 110, 50) + t(120, 110, "O");
    b += ln(120, 110, 120, 40, "#111", 1.4) + ln(120, 110, 180, 140, "#111", 1.4);
    b += ln(70, 200, 120, 40, "#dc2626", 1.6) + ln(70, 200, 180, 140, "#dc2626", 1.6);
    b += t(70, 214, "T") + t(120, 28, "P") + t(196, 148, "Q") + t(140, 90, "110°", {size: 11});
    return wrap(240, 230, b, "Fig. 10.11");
  }};
  figs["10.12"] = {caption: "Fig. 10.12: quadrilateral ABCD circumscribing a circle.", svg: function(){
    var b = circ(120, 110, 40);
    b += ln(40, 40, 200, 40, "#111", 1.6) + ln(200, 40, 200, 180, "#111", 1.6);
    b += ln(200, 180, 40, 180, "#111", 1.6) + ln(40, 180, 40, 40, "#111", 1.6);
    b += t(40, 28, "A") + t(200, 28, "B") + t(200, 196, "C") + t(40, 196, "D");
    return wrap(240, 220, b, "Fig. 10.12");
  }};
  figs["10.14"] = {caption: "Fig. 10.14: incircle radius 4 cm, BD = 8 cm, DC = 6 cm.", svg: function(){
    var b = ln(40, 180, 200, 180, "#111", 1.6) + ln(200, 180, 140, 40, "#111", 1.6) + ln(140, 40, 40, 180, "#111", 1.6);
    b += circ(130, 140, 40);
    b += t(40, 196, "B") + t(200, 196, "C") + t(140, 28, "A") + t(90, 174, "8") + t(170, 174, "6");
    return wrap(240, 220, b, "Fig. 10.14");
  }};
  return figs;
})();
