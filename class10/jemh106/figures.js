// Schematic redraws of jemh106 exercise figures (printed pp. 84–97).
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 12) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(x1, y1, x2, y2, c, w){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#111") + '" stroke-width="' + (w || 1.6) + '"/>'; }
  function poly(pts, stroke, fill, w){ return '<polygon points="' + pts + '" fill="' + (fill || "none") + '" stroke="' + (stroke || "#111") + '" stroke-width="' + (w || 1.6) + '"/>'; }
  var figs = {};
  function tri(caption, labels){
    return {caption: caption, svg: function(){
      var b = poly("40,160 200,160 120,40", "#111", "rgba(219,234,254,0.45)", 1.8);
      b += t(40, 178, labels[0] || "B") + t(200, 178, labels[1] || "C") + t(120, 28, labels[2] || "A");
      if(labels[3]) b += ln(80, 100, 160, 100, "#dc2626", 1.8) + t(120, 92, labels[3], {size: 11, color: "#dc2626"});
      return wrap(240, 200, b, caption);
    }};
  }
  figs["6.17"] = {caption: "Fig. 6.17: DE ∥ BC in △ABC (two cases).", svg: function(){
    var b = t(70, 18, "(i)", {weight: 700}) + poly("20,150 140,150 80,30", "#111", "none", 1.6);
    b += ln(50, 90, 110, 90, "#dc2626", 1.8);
    b += t(20, 168, "B") + t(140, 168, "C") + t(80, 20, "A") + t(50, 82, "D", {size: 11}) + t(110, 82, "E", {size: 11});
    b += t(50, 168, "1.5") + t(95, 168, "3") + t(48, 70, "1", {size: 11});
    b += t(210, 18, "(ii)", {weight: 700}) + poly("180,150 300,150 240,30", "#111", "none", 1.6);
    b += ln(210, 90, 270, 90, "#dc2626", 1.8);
    b += t(180, 168, "B") + t(300, 168, "C") + t(240, 20, "A") + t(210, 82, "D") + t(270, 82, "E");
    b += t(220, 168, "7.2") + t(255, 70, "1.8") + t(285, 70, "5.4");
    return wrap(320, 190, b, "Fig. 6.17");
  }};
  figs["6.18"] = tri("Fig. 6.18: LM ∥ CB and LN ∥ CD.", ["B", "C", "A", "LM"]);
  figs["6.19"] = tri("Fig. 6.19: DE ∥ AC and DF ∥ AE.", ["B", "C", "A", "DE"]);
  figs["6.20"] = tri("Fig. 6.20: DE ∥ OQ and DF ∥ OR.", ["Q", "R", "O", "EF"]);
  figs["6.21"] = tri("Fig. 6.21: AB ∥ PQ and AC ∥ PR.", ["Q", "R", "O", "BC"]);
  figs["6.32"] = {caption: "Fig. 6.32: Lamp-post AB and girl CD with shadow DE.", svg: function(){
    var b = ln(40, 160, 280, 160, "#111", 1.5);
    b += ln(60, 160, 60, 40, "#111", 2) + t(48, 36, "A") + t(48, 174, "B");
    b += ln(160, 160, 160, 100, "#111", 2) + t(148, 94, "C") + t(148, 174, "D");
    b += ln(160, 160, 220, 160, "#dc2626", 3) + t(190, 174, "x") + t(228, 174, "E");
    b += t(70, 100, "3.6 m", {size: 11}) + t(110, 174, "4.8 m", {size: 11});
    return wrap(300, 200, b, "Fig. 6.32");
  }};
  figs["6.34"] = {caption: "Fig. 6.34: Six pairs of triangles (judge AA / SSS / SAS on the printed marks).", svg: function(){
    return wrap(320, 80, t(160, 45, "See the six printed pairs in Fig. 6.34.", {size: 13}), "Fig. 6.34");
  }};
  figs["6.35"] = {caption: "Fig. 6.35: △ODC ~ △OBA with ∠BOC = 125° and ∠CDO = 70°.", svg: function(){
    var b = poly("40,150 200,150 120,40", "#111", "none", 1.6);
    b += ln(40, 150, 200, 150) + t(120, 28, "O") + t(30, 168, "C / A") + t(210, 168, "D / B");
    b += t(120, 100, "125°", {size: 12}) + t(70, 130, "70°", {size: 11});
    return wrap(240, 190, b, "Fig. 6.35");
  }};
  ["6.36","6.37","6.38","6.39","6.40","6.41"].forEach(function(id){
    figs[id] = tri("Fig. " + id + " (schematic of the printed figure).", ["B", "C", "A"]);
  });
  return figs;
})();
