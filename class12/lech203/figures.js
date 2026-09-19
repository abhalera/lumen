// Textbook structures used by the lech203 exercises, redrawn as SVG from the printed
// structures in books/originals/Class12-Chemistry-Pt2_lech203.pdf (exercise pp. 255–257).
// Figure 8.4 is the cyclopentanecarbaldehyde ring of Ex 8.4(v); Fig. 8.17 is the eleven-scheme
// synthesis puzzle of Ex 8.17.
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", GOLD = "#fbbf24", GREEN = "#34d399";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 15) + '" ' +
      'text-anchor="' + (o.anchor || "middle") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') +
      (o.mono ? ' font-family="ui-monospace,monospace"' : '') + '>' + s + '</text>';
  }
  function line(x1, y1, x2, y2, color, w){
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (color || INK) +
      '" stroke-width="' + (w || 2) + '" stroke-linecap="round"/>';
  }
  function arrow(x1, y, x2, color){
    return line(x1, y, x2, y, color || GOLD, 2) +
      '<polygon points="' + x2 + ',' + y + ' ' + (x2 - 11) + ',' + (y - 5) + ' ' + (x2 - 11) + ',' + (y + 5) + '" fill="' + (color || GOLD) + '"/>';
  }
  function pts(cx, cy, r, rot){
    var out = [];
    for(var k = 0; k < 6; k++){
      var a = Math.PI / 180 * (60 * k - 90 + (rot || 0));
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return out;
  }
  function cyclo(cx, cy, r, rot){
    var p = pts(cx, cy, r, rot), s = "";
    for(var k = 0; k < 6; k++){
      var q = p[(k + 1) % 6];
      s += line(p[k][0], p[k][1], q[0], q[1], INK, 2);
    }
    return s;
  }
  // One row of the Fig. 8.17 scheme: (label) left + reagent/arrow + right.
  function row(y, label, left, reagent, right){
    var s = text(24, y + 5, "(" + label + ")", {anchor: "start", size: 14, color: MUTED});
    s += text(80, y + 5, left, {anchor: "start", size: 13});
    s += arrow(560, y, 640, GOLD);
    s += text(600, y - 10, reagent, {size: 12, color: GOLD});
    s += text(660, y + 5, right, {anchor: "start", size: 13, color: GREEN});
    return s;
  }

  var figs = {};

  figs["8.4"] = {
    caption: "Fig. 8.4 — Exercise 8.4(v): cyclopentanecarbaldehyde (redrawn skeletal ring with –CHO).",
    svg: function(){
      var s = '<svg viewBox="0 0 360 260" role="img" aria-label="Cyclopentanecarbaldehyde ring of Exercise 8.4(v)">';
      s += '<rect width="360" height="260" fill="#09131d"/>';
      var cx = 170, cy = 140, r = 52;
      var p = [];
      for (var k = 0; k < 5; k++){
        var a = Math.PI / 180 * (72 * k - 90);
        p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
      for (var k2 = 0; k2 < 5; k2++){
        var q = p[(k2 + 1) % 5];
        s += line(p[k2][0], p[k2][1], q[0], q[1], INK, 2);
      }
      var top = p[0];
      s += line(top[0], top[1], top[0] + 42, top[1] - 30, INK, 2);
      s += text(top[0] + 52, top[1] - 40, "CHO", {anchor: "middle", size: 16, color: GOLD});
      s += text(180, 240, "cyclopentanecarbaldehyde · (v) of Exercise 8.4", {size: 12, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["8.17"] = {
    caption: "Fig. 8.17 — Exercise 8.17: the eleven synthesis schemes (i)–(xi) with missing reagents/products redrawn.",
    svg: function(){
      var s = '<svg viewBox="0 0 900 720" role="img" aria-label="Eleven synthesis schemes of Exercise 8.17">';
      s += '<rect width="900" height="720" fill="#09131d"/>';
      s += text(450, 34, "Complete each synthesis — schemes (i)–(xi), redrawn from p. 257", {size: 14, color: MUTED});
      var rows = [
        ["i",   "C₆H₅CH₂CH₃",                              "KMnO₄ / KOH, heat",        "C₆H₅COOK (benzoate)"],
        ["ii",  "benzene-1,2-dicarboxylic acid",            "SOCl₂, heat",              "carbons both → COCl"],
        ["iii", "C₆H₅CHO + H₂NCONHNH₂",                     "—",                        "C₆H₅CH=NNHCONH₂"],
        ["iv",  "C₆H₆ → C₆H₅COC₆H₅",                        "C₆H₅COCl / AlCl₃",         "benzophenone"],
        ["v",   "4-oxocyclohexanecarbaldehyde",             "[Ag(NH₃)₂]⁺",              "COO⁻ (ketone kept)"],
        ["vi",  "2-formylbenzoic acid",                     "NaCN / HCl",               "cyanohydrin"],
        ["vii", "C₆H₅CHO + CH₃CH₂CHO",                      "dil. NaOH, Δ",             "C₆H₅CH=C(CH₃)CHO"],
        ["viii","CH₃COCH₂COOC₂H₅",                          "NaBH₄ then H⁺",            "CH₃CH(OH)CH₂COOC₂H₅"],
        ["ix",  "cyclohexanol",                             "CrO₃",                     "cyclohexanone"],
        ["x",   "methylenecyclohexane",                     "BH₃; H₂O₂/OH⁻; PCC",       "cyclohexanecarbaldehyde"],
        ["xi",  "missing alkene + O₃ then Zn/H₂O",          "—",                        "2 × cyclohexanone"],
      ];
      var y = 80;
      rows.forEach(function(r){ s += row(y, r[0], r[1], r[2], r[3]); y += 56; });
      s += text(450, 706, "Left column: given/starting material · middle: missing reagent or method · right: product or answer", {size: 11, color: MUTED});
      return s + '</svg>';
    }
  };

  return figs;
})();
