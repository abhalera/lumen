// Textbook exercises redrawn as SVG from the schemes printed in
// books/originals/Class12-Chemistry-Pt2_lech204.pdf (Exercise 9.9 and Exercise 9.11).
window.FIGURES = (function(){
  var INK = "#0f172a", MUTED = "#475569", RED = "#b91c1c", BLUE = "#1d4ed8", GREEN = "#047857", AMBER = "#b45309";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function node(x, y, s, o){
    o = o || {};
    var w = o.w || Math.max(64, s.length * 8 + 18);
    return '<rect x="' + (x - w / 2) + '" y="' + (y - 15) + '" width="' + w + '" height="30" rx="6" fill="#f8fafc" stroke="' + (o.stroke || "#94a3b8") + '" stroke-width="1.6"/>' +
      text(x, y + 4, s, {color: o.color || INK, size: o.size || 12.5});
  }
  function arrow(x1, x2, y, label){
    var s = '<line x1="' + x1 + '" y1="' + y + '" x2="' + (x2 - 6) + '" y2="' + y + '" stroke="' + MUTED + '" stroke-width="1.6" marker-end="url(#figarr)"/>';
    if(label) s += text((x1 + x2) / 2, y - 7, label, {color: RED, size: 10});
    return s;
  }

  var defs = '<defs><marker id="figarr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="' + MUTED + '"/></marker></defs>';

  var figs = {};

  figs["9.9"] = {
    caption: "Exercise 9.9 — the six A → B → C sequences (redrawn from the textbook).",
    svg: function(){
      var rows = [
        ["(i)", "CH₃CH₂I", "NaCN", "OH⁻ / partial hydrolysis", "NaOH + Br₂"],
        ["(ii)", "C₆H₅N₂Cl", "CuCN", "H₂O / H⁺, Δ", "NH₃, Δ"],
        ["(iii)", "CH₃CH₂Br", "KCN", "LiAlH₄", "HNO₂, 0 °C"],
        ["(iv)", "C₆H₅NO₂", "Fe / HCl", "NaNO₂ + HCl, 273 K", "H₂O / H⁺, Δ"],
        ["(v)", "CH₃COOH", "NH₃, Δ", "NaOBr", "NaNO₂ / HCl"],
        ["(vi)", "C₆H₅NO₂", "Fe / HCl", "HNO₂, 273 K", "C₆H₅OH"]
      ];
      var s = '<svg viewBox="0 0 720 372" role="img" aria-label="Six reaction sequences for Exercise 9.9">';
      s += defs;
      var xs = [95, 275, 455, 635];
      rows.forEach(function(r, i){
        var y = 46 + i * 54;
        s += text(22, y + 4, r[0], {size: 13, weight: 700, color: MUTED, anchor: "start"});
        s += node(xs[0], y, r[1]);
        s += node(xs[1], y, "A", {color: BLUE, stroke: BLUE});
        s += node(xs[2], y, "B", {color: BLUE, stroke: BLUE});
        s += node(xs[3], y, "C", {color: BLUE, stroke: BLUE});
        s += arrow(xs[0] + 60, xs[1] - 18, y, r[2]);
        s += arrow(xs[1] + 18, xs[2] - 18, y, r[3]);
        s += arrow(xs[2] + 18, xs[3] - 18, y, r[4]);
      });
      return s + '</svg>';
    }
  };

  figs["9.11"] = {
    caption: "Exercise 9.11 — complete the seven reactions (redrawn from the textbook).",
    svg: function(){
      var rows = [
        "(i) C₆H₅NH₂ + CHCl₃ + alc. KOH",
        "(ii) C₆H₅N₂Cl + H₃PO₂ + H₂O",
        "(iii) C₆H₅NH₂ + H₂SO₄ (conc.), heat",
        "(iv) C₆H₅N₂Cl + C₂H₅OH",
        "(v) C₆H₅NH₂ + Br₂ (aq)",
        "(vi) C₆H₅NH₂ + (CH₃CO)₂O",
        "(vii) C₆H₅N₂Cl  --(i) HBF₄ (ii) NaNO₂/Cu, Δ→"
      ];
      var s = '<svg viewBox="0 0 720 330" role="img" aria-label="Seven reactions to complete for Exercise 9.11">';
      s += defs;
      rows.forEach(function(r, i){
        var y = 38 + i * 41;
        s += text(18, y + 4, r, {size: 12.5, anchor: "start"});
        s += text(590, y + 4, "→", {size: 16, color: MUTED});
        s += node(650, y, "?", {w: 56, color: RED, stroke: RED, size: 16});
      });
      return s + '</svg>';
    }
  };

  return figs;
})();
