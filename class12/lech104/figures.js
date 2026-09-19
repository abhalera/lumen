// Textbook structures used by the exercises, redrawn as SVG from
// books/originals/Class12-Chemistry-Pt1_lech104.pdf (Exercises 4.36 and 4.38).
// Drawn for the light revision page.
window.FIGURES = (function(){
  var INK = "#152637", MUTED = "#536678", LINE = "#dce4eb", SOFT = "#f7fafc",
      HEAD = "#edf2ff", ACC = "#254ad7", AMB = "#b45309", RED = "#dc2626";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  function table(x, y, headers, rows, colW, o){
    o = o || {};
    var rh = o.rowH || 25, hh = o.headH || 28;
    var total = colW.reduce(function(a, b){ return a + b; }, 0);
    var s = '<g>';
    s += '<rect x="' + x + '" y="' + y + '" width="' + total + '" height="' + (hh + rh * rows.length) + '" rx="8" fill="#fff" stroke="' + LINE + '"/>';
    var cx = x;
    headers.forEach(function(hd, i){
      s += '<rect x="' + cx + '" y="' + y + '" width="' + colW[i] + '" height="' + hh + '" fill="' + HEAD + '"/>';
      s += text(cx + colW[i] / 2, y + hh - 9, hd, {size: 12.5, weight: 700});
      if(i) s += '<line x1="' + cx + '" y1="' + y + '" x2="' + cx + '" y2="' + (y + hh + rh * rows.length) + '" stroke="' + LINE + '"/>';
      cx += colW[i];
    });
    rows.forEach(function(r, ri){
      var ry = y + hh + ri * rh;
      if(ri % 2) s += '<rect x="' + x + '" y="' + ry + '" width="' + total + '" height="' + rh + '" fill="' + SOFT + '"/>';
      s += '<line x1="' + x + '" y1="' + ry + '" x2="' + (x + total) + '" y2="' + ry + '" stroke="' + LINE + '"/>';
      var rcx = x;
      r.forEach(function(c, ci){
        s += text(rcx + colW[ci] / 2, ry + rh - 7, c, {size: 12.5, weight: ci === 0 ? 700 : 400});
        rcx += colW[ci];
      });
    });
    s += '</g>';
    return s;
  }

  var figs = {};

  figs["ex4.36"] = {
    caption: "Exercise 4.36 — high-spin octahedral occupancy of the 3d orbitals for Ti²⁺ to Cu²⁺ in water (redrawn from the NCERT table of ions).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 330" role="img" aria-label="Table of 3d electron counts and octahedral occupancy">';
      s += table(40, 14, ["Ion", "3dⁿ", "t₂g electrons", "e_g electrons", "Unpaired n"], [
        ["Ti²⁺", "d²", "t₂g²", "e_g⁰", "2"],
        ["V²⁺", "d³", "t₂g³", "e_g⁰", "3"],
        ["Cr³⁺", "d³", "t₂g³", "e_g⁰", "3"],
        ["Mn²⁺", "d⁵", "t₂g³", "e_g²", "5"],
        ["Fe²⁺", "d⁶", "t₂g⁴", "e_g²", "4"],
        ["Fe³⁺", "d⁵", "t₂g³", "e_g²", "5"],
        ["Co²⁺", "d⁷", "t₂g⁵", "e_g²", "3"],
        ["Ni²⁺", "d⁸", "t₂g⁶", "e_g²", "2"],
        ["Cu²⁺", "d⁹", "t₂g⁶", "e_g³", "1"]
      ], [90, 90, 150, 150, 120], {rowH: 25});
      s += text(360, 292, "Water is a weak-field ligand, so Hund's rule fills all five d orbitals before pairing", {size: 12.5, color: MUTED});
      s += text(360, 313, "μ = √[n(n+2)] BM: 1.73 (n = 1), 2.84 (2), 3.87 (3), 4.90 (4), 5.92 (5)", {size: 12.5, color: AMB, weight: 700});
      return s + '</svg>';
    }
  };

  figs["ex4.38"] = {
    caption: "Exercise 4.38 — magnetic moments of K₄[Mn(CN)₆], [Fe(H₂O)₆]²⁺ and K₂[MnCl₄] with the deduced spin state and hybridisation (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 300" role="img" aria-label="Three complexes and their magnetic moments">';
      s += '<rect x="30" y="16" width="200" height="230" rx="10" fill="#fff" stroke="' + LINE + '"/>';
      s += text(130, 46, "K₄[Mn(CN)₆]", {size: 14, weight: 700});
      s += text(130, 76, "Mn²⁺ · 3d⁵", {size: 13});
      s += text(130, 104, "μ = 2.2 BM", {size: 13, color: ACC, weight: 700});
      s += text(130, 132, "n ≈ 1", {size: 13});
      s += text(130, 164, "CN⁻ strong field", {size: 12, color: MUTED});
      s += text(130, 188, "low-spin octahedral", {size: 12.5, color: AMB, weight: 700});
      s += text(130, 210, "d²sp³", {size: 13, weight: 700});
      s += '<rect x="260" y="16" width="200" height="230" rx="10" fill="#fff" stroke="' + LINE + '"/>';
      s += text(360, 46, "[Fe(H₂O)₆]²⁺", {size: 14, weight: 700});
      s += text(360, 76, "Fe²⁺ · 3d⁶", {size: 13});
      s += text(360, 104, "μ = 5.3 BM", {size: 13, color: ACC, weight: 700});
      s += text(360, 132, "n ≈ 4", {size: 13});
      s += text(360, 164, "H₂O weak field", {size: 12, color: MUTED});
      s += text(360, 188, "high-spin octahedral", {size: 12.5, color: AMB, weight: 700});
      s += text(360, 210, "sp³d²", {size: 13, weight: 700});
      s += '<rect x="490" y="16" width="200" height="230" rx="10" fill="#fff" stroke="' + LINE + '"/>';
      s += text(590, 46, "K₂[MnCl₄]", {size: 14, weight: 700});
      s += text(590, 76, "Mn²⁺ · 3d⁵", {size: 13});
      s += text(590, 104, "μ = 5.9 BM", {size: 13, color: ACC, weight: 700});
      s += text(590, 132, "n ≈ 5", {size: 13});
      s += text(590, 164, "Cl⁻ weak field", {size: 12, color: MUTED});
      s += text(590, 188, "four-coordinate, tetrahedral", {size: 12.5, color: AMB, weight: 700});
      s += text(590, 210, "sp³", {size: 13, weight: 700});
      s += text(360, 274, "The observed moment fixes n; the ligand field then picks the spin state and the hybridisation.", {size: 12.5, color: MUTED});
      return s + '</svg>';
    }
  };

  return figs;
})();
