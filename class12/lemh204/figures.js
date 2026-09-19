// Textbook figures cited by the exercises, redrawn as SVG from the diagrams printed in
// books/originals/Class12-Maths-Pt2_lemh204.pdf (Fig 10.6, PDF p. 5; Fig 10.18, PDF p. 18).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", BLUE = "#38bdf8", AMBER = "#f59e0b";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function arrow(x1, y1, x2, y2, color, w){
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / L, uy = dy / L, hl = 9, hw = 5;
    var bx = x2 - ux * hl, by = y2 - uy * hl;
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + bx + '" y2="' + by + '" stroke="' + color + '" stroke-width="' + (w || 2) + '" stroke-linecap="round"/>' +
      '<polygon points="' + x2 + ',' + y2 + ' ' + (bx - uy * hw) + ',' + (by + ux * hw) + ' ' + (bx + uy * hw) + ',' + (by - ux * hw) + '" fill="' + color + '"/>';
  }

  var figs = {};

  figs["10.6"] = {
    caption: "Fig. 10.6 \u2014 A square ABCD with side vectors a\u20d7, b\u20d7, c\u20d7, d\u20d7 drawn on its four sides (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 360 300" role="img" aria-label="Square ABCD with vectors on its sides">';
      s += '<rect width="360" height="300" rx="10" fill="#0b1220" stroke="#1e2d3d"/>';
      var x0 = 100, y0 = 80, S = 150;
      s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + S + '" height="' + S + '" fill="rgba(56,189,248,.06)" stroke="#334155" stroke-width="1.6"/>';
      s += arrow(x0, y0, x0 + S, y0, BLUE, 3);
      s += arrow(x0 + S, y0, x0 + S, y0 + S, AMBER, 3);
      s += arrow(x0 + S, y0 + S, x0, y0 + S, BLUE, 3);
      s += arrow(x0, y0, x0, y0 + S, AMBER, 3);
      s += text(x0 + S / 2, y0 - 12, "a\u20d7", {size: 17, weight: 700, color: BLUE});
      s += text(x0 + S + 20, y0 + S / 2 + 6, "b\u20d7", {size: 17, weight: 700, color: AMBER});
      s += text(x0 + S / 2, y0 + S + 26, "c\u20d7", {size: 17, weight: 700, color: BLUE});
      s += text(x0 - 20, y0 + S / 2 + 6, "d\u20d7", {size: 17, weight: 700, color: AMBER});
      s += text(x0 - 12, y0 - 12, "A", {size: 14, color: INK, weight: 700});
      s += text(x0 + S + 12, y0 - 12, "B", {size: 14, color: INK, weight: 700});
      s += text(x0 + S + 12, y0 + S + 20, "C", {size: 14, color: INK, weight: 700});
      s += text(x0 - 12, y0 + S + 20, "D", {size: 14, color: INK, weight: 700});
      s += text(180, 285, "a\u20d7 and d\u20d7 start at A; b\u20d7 and d\u20d7 are equal", {size: 12, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["10.18"] = {
    caption: "Fig. 10.18 \u2014 Triangle ABC with the side vectors AB\u20d7, BC\u20d7 and CA\u20d7 taken in order (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 360 300" role="img" aria-label="Triangle ABC with its sides directed">';
      s += '<rect width="360" height="300" rx="10" fill="#0b1220" stroke="#1e2d3d"/>';
      var ax = 70, ay = 230, bx = 250, by = 210, cx = 320, cy = 70;
      s += '<polygon points="' + ax + ',' + ay + ' ' + bx + ',' + by + ' ' + cx + ',' + cy + '" fill="rgba(56,189,248,.07)" stroke="#334155" stroke-width="1.2"/>';
      s += arrow(ax, ay, bx, by, BLUE, 3);
      s += arrow(bx, by, cx, cy, BLUE, 3);
      s += arrow(cx, cy, ax, ay, BLUE, 3);
      s += text(ax - 14, ay + 8, "A", {size: 15, color: INK, weight: 700});
      s += text(bx + 12, by + 16, "B", {size: 15, color: INK, weight: 700});
      s += text(cx + 10, cy - 6, "C", {size: 15, color: INK, weight: 700});
      s += text((ax + bx) / 2 - 8, (ay + by) / 2 + 20, "AB\u20d7", {size: 14, color: BLUE, weight: 700});
      s += text((bx + cx) / 2 + 18, (by + cy) / 2, "BC\u20d7", {size: 14, color: BLUE, weight: 700});
      s += text((cx + ax) / 2 - 16, (cy + ay) / 2, "CA\u20d7", {size: 14, color: BLUE, weight: 700});
      s += text(180, 285, "AB\u20d7 + BC\u20d7 + CA\u20d7 = 0\u20d7 in this order", {size: 12, color: MUTED});
      return s + '</svg>';
    }
  };

  return figs;
})();
