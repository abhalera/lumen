// Feasible-region diagrams for the NCERT Exercise 12.1 questions, redrawn as SVG
// from the constraints printed in books/originals/Class12-Maths-Pt2_lemh206.pdf
// (Exercise 12.1, printed pp. 403-404).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", GRID = "#22303f";
  var AMBER = "#f59e0b", GREEN = "#34d399", BLUE = "#38bdf8", RED = "#f87171";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 11) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function line(x1, y1, x2, y2, color, w, dash){
    return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + color + '" stroke-width="' + (w || 1.6) + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
  }

  // Build a small labelled coordinate panel with an optional shaded polygon.
  function panel(o){
    var W = 360, H = 240, L = 42, R = 348, T = 22, B = 196;
    var X = function(x){ return L + (x / o.xmax) * (R - L); };
    var Y = function(y){ return B - (y / o.ymax) * (B - T); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + o.aria + '">';
    s += '<rect width="' + W + '" height="' + H + '" rx="10" fill="#0b1220" stroke="#1e2d3d"/>';
    var i, v;
    for(i = 0; i <= o.xmax + 1e-9; i += o.xt){
      s += line(X(i), T, X(i), B, GRID, 1);
      s += text(X(i), B + 15, String(Math.round(i * 100) / 100), {size: 9, color: MUTED});
    }
    for(v = 0; v <= o.ymax + 1e-9; v += o.yt){
      s += line(L, Y(v), R, Y(v), GRID, 1);
      s += text(L - 5, Y(v) + 3, String(Math.round(v * 100) / 100), {size: 9, color: MUTED, anchor: "end"});
    }
    s += line(L, B, R + 6, B, MUTED, 1.4) + line(L, B, L, T - 6, MUTED, 1.4);
    s += text(R + 4, B + 2, "x", {size: 12, color: INK, anchor: "start"});
    s += text(L - 2, T - 10, "y", {size: 12, color: INK, anchor: "end"});
    if(o.poly && o.poly.length){
      s += '<path d="M' + o.poly.map(function(p){ return X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); }).join(' L') + ' Z" fill="rgba(52,211,153,.22)" stroke="' + GREEN + '" stroke-width="1.8"/>';
    }
    (o.lines || []).forEach(function(a, k){
      s += line(X(a[0][0]), Y(a[0][1]), X(a[1][0]), Y(a[1][1]), k % 2 ? AMBER : "#fbbf24", 1.8, a[2] || null);
    });
    (o.points || []).forEach(function(p){
      var col = p[3] || GREEN;
      s += '<circle cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="3.6" fill="' + col + '"/>';
      if(p[2]){
        var ax = X(p[0]) + (p[4] === undefined ? 6 : p[4]);
        var ay = Y(p[1]) + (p[5] === undefined ? -6 : p[5]);
        s += text(ax, ay, p[2], {size: 10, color: col, anchor: p[4] !== undefined && p[4] < 0 ? "end" : "start", weight: 700});
      }
    });
    if(o.note) s += text(W / 2, 224, o.note, {size: 11, color: MUTED});
    return s + '</svg>';
  }

  var figs = {};

  figs["12.1.1"] = {
    caption: "Exercise 12.1 Q1: x + y \u2264 4 gives the triangle O(0, 0), (4, 0), (0, 4); the maximum Z = 16 is at (0, 4).",
    svg: function(){
      return panel({
        xmax: 5, ymax: 5, xt: 1, yt: 1, aria: "Triangle x plus y less than or equal to 4",
        poly: [[0, 0], [4, 0], [0, 4]], lines: [[[0, 4], [4, 0]]],
        points: [[0, 0, "O", MUTED, -6, 12], [4, 0, "(4, 0)", MUTED, -2, 14], [0, 4, "(0, 4)", GREEN, 6, -4]],
        note: "max Z = 3x + 4y = 16 at (0, 4)"
      });
    }
  };

  figs["12.1.2"] = {
    caption: "Exercise 12.1 Q2: x + 2y \u2264 8 and 3x + 2y \u2264 12 meet at (2, 3); minimum Z = \u221212 at (4, 0).",
    svg: function(){
      return panel({
        xmax: 5, ymax: 5, xt: 1, yt: 1, aria: "Quadrilateral for exercise 12.1 question 2",
        poly: [[0, 0], [4, 0], [2, 3], [0, 4]],
        lines: [[[0, 4], [4, 0]], [[0, 6], [4, 0]]],
        points: [[0, 0, "O", MUTED, -6, 12], [4, 0, "(4, 0)", GREEN, -2, 14], [2, 3, "(2, 3)", MUTED, 6, -4], [0, 4, "(0, 4)", MUTED, 6, -4]],
        note: "min Z = \u22123x + 4y = \u221212 at (4, 0)"
      });
    }
  };

  figs["12.1.3"] = {
    caption: "Exercise 12.1 Q3: the two constraints meet at (20/19, 45/19); maximum Z = 235/19 there.",
    svg: function(){
      return panel({
        xmax: 4, ymax: 4, xt: 1, yt: 1, aria: "Quadrilateral for exercise 12.1 question 3",
        poly: [[0, 0], [2, 0], [20 / 19, 45 / 19], [0, 3]],
        lines: [[[0, 3], [5, 0]], [[0, 5], [4, 0]]],
        points: [[0, 0, "O", MUTED, -6, 12], [2, 0, "(2, 0)", MUTED, -2, 14], [20 / 19, 45 / 19, "(20/19, 45/19)", GREEN, 6, -4], [0, 3, "(0, 3)", MUTED, 6, -4]],
        note: "max Z = 5x + 3y = 235/19 at (20/19, 45/19)"
      });
    }
  };

  figs["12.1.4"] = {
    caption: "Exercise 12.1 Q4: the unbounded region has corners (1.5, 0.5), (3, 0) and (0, 2); minimum Z = 7 at (1.5, 0.5).",
    svg: function(){
      return panel({
        xmax: 4, ymax: 4, xt: 1, yt: 1, aria: "Unbounded region for exercise 12.1 question 4",
        poly: [[0, 2], [1.5, 0.5], [3, 0], [4, 0], [4, 4], [0, 4]],
        lines: [[[0, 1], [3, 0]], [[0, 2], [2, 0]]],
        points: [[0, 2, "(0, 2)", MUTED, 6, -4], [1.5, 0.5, "(1.5, 0.5)", GREEN, -6, 12], [3, 0, "(3, 0)", MUTED, -2, 14]],
        note: "min Z = 3x + 5y = 7 at (1.5, 0.5); region unbounded"
      });
    }
  };

  figs["12.1.5"] = {
    caption: "Exercise 12.1 Q5: x + 2y \u2264 10 and 3x + y \u2264 15 meet at (4, 3); maximum Z = 18 there.",
    svg: function(){
      return panel({
        xmax: 6, ymax: 6, xt: 1, yt: 1, aria: "Quadrilateral for exercise 12.1 question 5",
        poly: [[0, 0], [5, 0], [4, 3], [0, 5]],
        lines: [[[0, 5], [10, 0]], [[0, 15], [5, 0]]],
        points: [[0, 0, "O", MUTED, -6, 12], [5, 0, "(5, 0)", MUTED, -2, 14], [4, 3, "(4, 3)", GREEN, 6, -4], [0, 5, "(0, 5)", MUTED, 6, -4]],
        note: "max Z = 3x + 2y = 18 at (4, 3)"
      });
    }
  };

  figs["12.1.6"] = {
    caption: "Exercise 12.1 Q6: x + 2y \u2265 6 gives the optimal edge from (6, 0) to (0, 3), where Z = 6 throughout.",
    svg: function(){
      return panel({
        xmax: 7, ymax: 4, xt: 1, yt: 1, aria: "Unbounded region for exercise 12.1 question 6",
        poly: [[0, 3], [6, 0], [7, 0], [7, 4], [0, 4]],
        lines: [[[0, 3], [6, 0]], [[0, 1.5], [3, 0]]],
        points: [[0, 3, "(0, 3)", BLUE, 6, -4], [6, 0, "(6, 0)", BLUE, -2, 14], [1.5, 0, "(1.5, 0)", MUTED, 0, 14]],
        note: "min Z = x + 2y = 6 on the edge (6, 0)-(0, 3)"
      });
    }
  };

  figs["12.1.7"] = {
    caption: "Exercise 12.1 Q7: corners (60, 0), (40, 20), (60, 30), (120, 0); minimum 300 at (60, 0), maximum 600 on the edge to (120, 0).",
    svg: function(){
      return panel({
        xmax: 130, ymax: 70, xt: 30, yt: 10, aria: "Bounded quadrilateral for exercise 12.1 question 7",
        poly: [[60, 0], [40, 20], [60, 30], [120, 0]],
        lines: [[[0, 60], [60, 0]], [[0, 0], [70, 35]], [[0, 60], [120, 0]]],
        points: [[60, 0, "(60, 0)", GREEN, -4, 14], [40, 20, "(40, 20)", MUTED, 6, -4], [60, 30, "(60, 30)", BLUE, 6, -4], [120, 0, "(120, 0)", BLUE, -8, 14]],
        note: "min 300 at (60, 0); max 600 on edge (60, 30)-(120, 0)"
      });
    }
  };

  figs["12.1.8"] = {
    caption: "Exercise 12.1 Q8: corners (0, 50), (20, 40), (50, 100), (0, 200); minimum 100 on the edge to (20, 40), maximum 400 at (0, 200).",
    svg: function(){
      return panel({
        xmax: 60, ymax: 210, xt: 10, yt: 30, aria: "Bounded quadrilateral for exercise 12.1 question 8",
        poly: [[0, 50], [20, 40], [50, 100], [0, 200]],
        lines: [[[0, 50], [50, 0]], [[0, 0], [100, 200]], [[100, 0], [0, 200]]],
        points: [[0, 50, "(0, 50)", BLUE, 6, -4], [20, 40, "(20, 40)", BLUE, 6, -4], [50, 100, "(50, 100)", MUTED, -6, -4], [0, 200, "(0, 200)", GREEN, 6, -4]],
        note: "min 100 on edge (0, 50)-(20, 40); max 400 at (0, 200)"
      });
    }
  };

  figs["12.1.9"] = {
    caption: "Exercise 12.1 Q9: corners (4, 1) and (3, 2) give Z = \u22122 and 1, but the unbounded region has no maximum.",
    svg: function(){
      return panel({
        xmax: 7, ymax: 6, xt: 1, yt: 1, aria: "Unbounded region for exercise 12.1 question 9",
        poly: [[3, 2], [4, 1], [6, 0], [7, 0], [7, 6], [3, 6]],
        lines: [[[3, 0], [8, 5]], [[4, 0], [0, 3]]],
        points: [[3, 2, "(3, 2)", MUTED, -6, -4], [4, 1, "(4, 1)", MUTED, -6, -4]],
        note: "no maximum: Z = \u2212x + 2y grows without bound"
      });
    }
  };

  figs["12.1.10"] = {
    caption: "Exercise 12.1 Q10: y \u2265 x + 1 and y \u2264 x cannot both hold, so the feasible region is empty.",
    svg: function(){
      return panel({
        xmax: 4, ymax: 4, xt: 1, yt: 1, aria: "Inconsistent constraints for exercise 12.1 question 10",
        lines: [[[0, 0], [4, 4]], [[0, 1], [3, 4]]],
        points: [],
        note: "no common point: the feasible region is empty"
      });
    }
  };

  return figs;
})();
