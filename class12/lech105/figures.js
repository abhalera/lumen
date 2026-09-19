// Textbook figures used by the exercises, redrawn as SVG from the vector data in
// books/originals/Class12-Chemistry-Pt1_lech105.pdf (Fig. 5.8 and the structures the
// exercises ask the student to work with).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa",
      AMBER = "#f59e0b", GREEN = "#34d399", VIOLET = "#c4b5fd", LINE = "#475569";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + (o.mono ? ' font-family="ui-monospace,monospace"' : '') + '>' + s + '</text>';
  }
  function line(x1, y1, x2, y2, col, w, dash){
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (col || LINE) + '" stroke-width="' + (w || 2) + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/>';
  }
  function arrow(x1, y1, x2, y2, col, w){
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / L, uy = dy / L, hl = 11, hw = 5.5;
    var bx = x2 - ux * hl, by = y2 - uy * hl;
    return line(x1, y1, bx, by, col, w || 2) +
      '<polygon points="' + x2 + ',' + y2 + ' ' + (bx - uy * hw) + ',' + (by + ux * hw) + ' ' + (bx + uy * hw) + ',' + (by - ux * hw) + '" fill="' + col + '"/>';
  }
  function circle(cx, cy, r, fill, extra){
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' + (extra || '') + '/>';
  }

  var figs = {};

  // ---- Fig. 5.8: splitting of d orbitals in an octahedral crystal field ----
  figs["5.8"] = {
    caption: "Fig. 5.8 — Splitting of d orbitals in an octahedral crystal field: eg at +0.6 \u0394\u2092, t\u2082g at \u22120.4 \u0394\u2092 (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 330" role="img" aria-label="Octahedral crystal field splitting of d orbitals">';
      s += text(120, 30, "d orbitals, free ion", {color: MUTED, size: 14});
      s += text(360, 30, "spherical field", {color: MUTED, size: 14});
      s += text(590, 30, "octahedral field", {color: INK, size: 14, weight: 700});
      for(var i = 0; i < 5; i++){
        s += line(70, 120 + i * 22, 170, 120 + i * 22, BLUE, 3);
      }
      s += text(120, 245, "5 degenerate d orbitals", {color: MUTED, size: 12});
      for(var j = 0; j < 5; j++){
        s += line(310, 120 + j * 22, 410, 120 + j * 22, MUTED, 3);
      }
      s += text(360, 245, "still degenerate", {color: MUTED, size: 12});
      s += line(490, 132, 700, 132, MUTED, 1, "5 5");
      s += text(610, 124, "barycentre", {color: MUTED, size: 11});
      s += line(510, 78, 570, 78, RED, 3);
      s += line(630, 78, 690, 78, RED, 3);
      s += text(600, 64, "eg (+0.6 \u0394\u2092)", {color: RED, size: 13, weight: 700});
      s += line(510, 198, 550, 198, BLUE, 3);
      s += line(565, 198, 605, 198, BLUE, 3);
      s += line(620, 198, 660, 198, BLUE, 3);
      s += text(600, 228, "t\u2082g (\u22120.4 \u0394\u2092)", {color: BLUE, size: 13, weight: 700});
      s += text(600, 248, "dxy, dyz, dxz", {color: BLUE, size: 11});
      s += text(600, 96, "dx\u00b2\u2212y\u00b2, dz\u00b2", {color: RED, size: 11});
      s += arrow(465, 132, 465, 84, RED, 2);
      s += text(448, 112, "+0.6 \u0394\u2092", {color: RED, size: 12, anchor: "end"});
      s += arrow(465, 132, 465, 192, BLUE, 2);
      s += text(448, 170, "\u22120.4 \u0394\u2092", {color: BLUE, size: 12, anchor: "end"});
      s += text(360, 305, "\u0394\u2092 = t\u2082g\u2013eg gap; 3 \u00d7 0.4 = 2 \u00d7 0.6 keeps the barycentre fixed", {color: MUTED, size: 12});
      return s + '</svg>';
    }
  };

  // ---- Exercise 5.10: optical isomers ----
  figs["5.10"] = {
    caption: "Exercise 5.10 — Optical isomers of (i) [Cr(C\u2082O\u2084)\u2083]\u00b3\u207b, (ii) [PtCl\u2082(en)\u2082]\u00b2\u207a and (iii) [Cr(NH\u2083)\u2082Cl\u2082(en)]\u207a (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 330" role="img" aria-label="Optical isomers of three coordination compounds">';
      s += line(20, 46, 700, 46, LINE, 1);
      s += text(150, 30, "(i) [Cr(C\u2082O\u2084)\u2083]\u00b3\u207b", {color: AMBER, size: 14, weight: 700});
      s += text(420, 30, "(ii) [PtCl\u2082(en)\u2082]\u00b2\u207a", {color: BLUE, size: 13, weight: 700});
      s += circle(150, 150, 16, AMBER) + text(150, 155, "Cr", {color: "#0f172a", size: 12, weight: 700});
      var angles = [-90, 30, 150];
      angles.forEach(function(a){
        var rad = a * Math.PI / 180;
        var x = 150 + 70 * Math.cos(rad), y = 150 + 70 * Math.sin(rad);
        s += line(150, 150, x, y, LINE, 2);
        s += circle(x, y, 14, GREEN) + text(x, y + 4, "ox", {color: "#0f172a", size: 10, weight: 700});
      });
      s += text(150, 250, "\u0394 and \u039b helices", {color: INK, size: 12});
      s += text(150, 268, "(three chelate rings)", {color: MUTED, size: 11});
      s += circle(420, 170, 18, BLUE) + text(420, 175, "Pt", {color: "#0f172a", size: 12, weight: 700});
      s += text(420, 120, "NH\u2082", {color: GREEN, size: 11});
      s += text(420, 235, "NH\u2082", {color: GREEN, size: 11});
      s += line(420, 152, 420, 128, GREEN, 2) + line(420, 188, 420, 218, GREEN, 2);
      s += circle(360, 150, 13, AMBER) + text(360, 154, "Cl", {color: "#0f172a", size: 10});
      s += circle(480, 190, 13, AMBER) + text(480, 194, "Cl", {color: "#0f172a", size: 10});
      s += line(420, 170, 373, 156, LINE, 2) + line(420, 170, 467, 184, LINE, 2);
      s += text(420, 275, "cis form: two enantiomers", {color: INK, size: 12});
      s += text(420, 293, "trans form is achiral", {color: MUTED, size: 11});
      s += text(620, 30, "(iii) [Cr(NH\u2083)\u2082Cl\u2082(en)]\u207a", {color: VIOLET, size: 13, weight: 700});
      s += circle(620, 165, 16, VIOLET) + text(620, 170, "Cr", {color: "#0f172a", size: 12, weight: 700});
      s += text(620, 110, "NH\u2083", {color: BLUE, size: 11});
      s += text(620, 228, "NH\u2083", {color: BLUE, size: 11});
      s += text(560, 118, "Cl", {color: AMBER, size: 11});
      s += text(680, 220, "Cl", {color: AMBER, size: 11});
      s += text(620, 275, "cis-type arrangements pair up:", {color: INK, size: 12});
      s += text(620, 293, "each has a D/L mirror pair", {color: MUTED, size: 11});
      return s + '</svg>';
    }
  };

  // ---- Exercise 5.11: all geometrical and optical isomers ----
  figs["5.11"] = {
    caption: "Exercise 5.11 — All isomers of (i) [CoCl\u2082(en)\u2082]\u207a, (ii) [Co(NH\u2083)Cl(en)\u2082]\u00b2\u207a and (iii) [Co(NH\u2083)\u2082Cl\u2082(en)]\u207a (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 340" role="img" aria-label="Geometrical and optical isomers of three cobalt complexes">';
      function octa(cx, cy, labels, caption){
        var pos = [[0,-62],[62,0],[0,62],[-62,0],[-42,-42],[42,42]];
        var m = circle(cx, cy, 12, AMBER) + text(cx, cy + 4, "Co", {color: "#0f172a", size: 10, weight: 700});
        pos.forEach(function(p, i){
          var col = labels[i] === "Cl" ? AMBER : (labels[i] === "en" ? GREEN : BLUE);
          m += line(cx, cy, cx + p[0], cy + p[1], LINE, 2);
          m += circle(cx + p[0], cy + p[1], 13, col);
          m += text(cx + p[0], cy + p[1] + 4, labels[i], {color: "#0f172a", size: 9, weight: 700});
        });
        m += text(cx, cy + 104, caption, {color: MUTED, size: 11});
        return m;
      }
      s += text(120, 26, "(i) [CoCl\u2082(en)\u2082]\u207a", {color: AMBER, size: 13, weight: 700});
      s += octa(120, 120, ["Cl", "en", "Cl", "en", "en", "en"], "trans \u2014 achiral");
      s += octa(320, 120, ["Cl", "Cl", "en", "en", "en", "en"], "cis \u2014 D / L pair");
      s += text(500, 26, "(ii) [Co(NH\u2083)Cl(en)\u2082]\u00b2\u207a", {color: BLUE, size: 13, weight: 700});
      s += octa(480, 120, ["NH\u2083", "en", "Cl", "en", "en", "en"], "trans + cis D / L");
      s += octa(645, 120, ["NH\u2083", "Cl", "en", "en", "en", "en"], "same pattern");
      s += line(20, 240, 700, 240, LINE, 1);
      s += text(360, 268, "(iii) [Co(NH\u2083)\u2082Cl\u2082(en)]\u207a: arrange the two NH\u2083 and two Cl around the en backbone;", {color: INK, size: 13});
      s += text(360, 290, "the cis-type, unsymmetric arrangements have no mirror plane and form optical pairs.", {color: MUTED, size: 12});
      s += text(360, 318, "(i) trans + two cis enantiomers = 3 stereoisomers; (ii) the same pattern; (iii) geometrical set + optical pairs.", {color: MUTED, size: 12});
      return s + '</svg>';
    }
  };

  // ---- Exercise 5.12: geometrical isomers of square planar MABCD ----
  figs["5.12"] = {
    caption: "Exercise 5.12 — The three geometrical isomers of square planar [Pt(NH\u2083)(Br)(Cl)(py)] (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 300" role="img" aria-label="Three geometrical isomers of a square planar platinum complex">';
      function square(cx, cy, order, note){
        var m = '';
        var cols = { "NH\u2083": BLUE, "Br": RED, "Cl": AMBER, "py": VIOLET };
        var pos = [[0,-64],[64,0],[0,64],[-64,0]];
        m += '<polygon points="' + cx + ',' + (cy - 64) + ' ' + (cx + 64) + ',' + cy + ' ' + cx + ',' + (cy + 64) + ' ' + (cx - 64) + ',' + cy + '" fill="none" stroke="' + LINE + '" stroke-width="1.5"/>';
        m += circle(cx, cy, 16, "#94a3b8") + text(cx, cy + 4, "Pt", {color: "#0f172a", size: 12, weight: 700});
        order.forEach(function(L, i){
          var p = pos[i];
          m += line(cx, cy, cx + p[0] * 0.8, cy + p[1] * 0.8, LINE, 2);
          m += circle(cx + p[0], cy + p[1], 17, cols[L]);
          m += text(cx + p[0], cy + p[1] + 4, L, {color: "#0f172a", size: 11, weight: 700});
        });
        m += text(cx, cy + 108, note, {color: MUTED, size: 12});
        return m;
      }
      s += square(130, 130, ["NH\u2083", "Br", "Cl", "py"], "NH\u2083 trans to Br");
      s += square(370, 130, ["NH\u2083", "Cl", "Br", "py"], "NH\u2083 trans to Cl");
      s += square(610, 130, ["NH\u2083", "py", "Br", "Cl"], "NH\u2083 trans to py");
      s += text(360, 40, "Three geometrical isomers of MABCD; every one has a molecular plane \u2192 none is optically active.", {color: INK, size: 13});
      return s + '</svg>';
    }
  };

  return figs;
})();
