// Textbook figure used by Exercise 3.7, redrawn as SVG from the vector data in
// books/originals/Class12-Physics-Pt1_leph103.pdf (Figure 3.20).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  // Zig-zag resistor symbol from (x1,y1) to (x2,y2).
  function zig(x1, y1, x2, y2, color){
    var dx = x2 - x1, dy = y2 - y1;
    var L = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    var lead = L * 0.12, amp = 7, n = 6;
    var d = "M" + x1 + " " + y1 + " L" + (x1 + ux * lead) + " " + (y1 + uy * lead);
    for(var i = 0; i < n; i += 1){
      var t = lead + (L - 2 * lead) * (i + 0.5) / n;
      var side = (i % 2 === 0) ? 1 : -1;
      d += " L" + (x1 + ux * t + nx * side * amp) + " " + (y1 + uy * t + ny * side * amp);
    }
    d += " L" + (x2 - ux * lead) + " " + (y2 - uy * lead) + " L" + x2 + " " + y2;
    return '<path d="' + d + '" fill="none" stroke="' + (color || INK) + '" stroke-width="2.2" stroke-linejoin="round"/>';
  }

  var figs = {};

  figs["3.20"] = {
    caption: "Fig. 3.20 — Network of resistors in the bridge arrangement of Exercise 3.7 (redrawn): AB = 10 Ω, BC = 5 Ω, AD = 5 Ω, DC = 10 Ω, BD = 5 Ω, with a 10 Ω resistor and a 10 V battery in the arm AC.",
    svg: function(){
      var s = '<svg viewBox="0 0 420 320" role="img" aria-label="Resistor bridge network with a 10 volt battery">';
      var A = [70, 150], B = [210, 52], C = [350, 150], D = [210, 212];
      s += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="' + B[0] + '" y1="' + B[1] + '" x2="' + C[0] + '" y2="' + C[1] + '" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + D[0] + '" y2="' + D[1] + '" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="' + D[0] + '" y1="' + D[1] + '" x2="' + C[0] + '" y2="' + C[1] + '" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="' + B[0] + '" y1="' + B[1] + '" x2="' + D[0] + '" y2="' + D[1] + '" stroke="' + MUTED + '" stroke-width="2"/>';
      // Battery arm A-C
      s += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + A[0] + '" y2="278" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="' + A[0] + '" y1="278" x2="140" y2="278" stroke="' + MUTED + '" stroke-width="2"/>';
      s += zig(140, 278, 210, 278, INK);
      s += '<line x1="210" y1="278" x2="265" y2="278" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="265" y1="266" x2="265" y2="290" stroke="' + RED + '" stroke-width="3"/>';
      s += '<line x1="281" y1="272" x2="281" y2="284" stroke="' + RED + '" stroke-width="2"/>';
      s += '<line x1="281" y1="278" x2="350" y2="278" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="' + C[0] + '" y1="278" x2="' + C[0] + '" y2="' + C[1] + '" stroke="' + MUTED + '" stroke-width="2"/>';
      // Bridge resistors
      s += zig(A[0] + 34, A[1] - 22, B[0] - 34, B[1] + 22, INK);
      s += zig(B[0] + 34, B[1] + 22, C[0] - 34, C[1] - 22, INK);
      s += zig(A[0] + 34, A[1] + 22, D[0] - 34, D[1] - 22, INK);
      s += zig(D[0] + 34, D[1] - 22, C[0] - 34, C[1] + 22, INK);
      s += zig(B[0], B[1] + 34, D[0], D[1] - 34, INK);
      // Labels
      s += text(A[0] - 14, A[1] + 4, "A", {size: 15, weight: 700});
      s += text(B[0], B[1] - 12, "B", {size: 15, weight: 700});
      s += text(C[0] + 14, C[1] + 4, "C", {size: 15, weight: 700});
      s += text(D[0] + 4, D[1] + 22, "D", {size: 15, weight: 700});
      s += text(120, 128, "10 Ω", {color: BLUE, weight: 700});
      s += text(292, 128, "5 Ω", {color: BLUE, weight: 700});
      s += text(118, 202, "5 Ω", {color: BLUE, weight: 700});
      s += text(298, 202, "10 Ω", {color: BLUE, weight: 700});
      s += text(232, 140, "5 Ω", {color: BLUE, weight: 700});
      s += text(175, 300, "10 Ω", {color: BLUE, weight: 700});
      s += text(316, 272, "10 V", {color: RED, weight: 700, size: 14});
      // Current arrows
      s += '<polygon points="150,96 158,102 149,106" fill="' + INK + '"/>';
      s += '<polygon points="270,96 262,102 271,106" fill="' + INK + '"/>';
      s += '<polygon points="150,192 158,198 149,202" fill="' + INK + '"/>';
      s += '<polygon points="270,198 262,204 271,208" fill="' + INK + '"/>';
      s += '<polygon points="216,120 222,128 214,132" fill="' + INK + '"/>';
      return s + '</svg>';
    }
  };

  return figs;
})();
