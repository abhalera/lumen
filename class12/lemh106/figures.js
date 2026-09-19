// Textbook-style figures used by the lemh106 exercises, redrawn as SVG from the functions
// and sketches in books/originals/Class12-Maths-Pt1_lemh106.pdf. Drawn for the white
// revision card, so the palette is dark-on-light.
window.FIGURES = (function(){
  var INK = "#0f172a", MUTED = "#475569", LINE = "#94a3b8";
  var RED = "#dc2626", BLUE = "#2563eb", GREEN = "#059669", AMBER = "#d97706";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 12) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + (o.italic ? ' font-style="italic"' : '') + '>' + s + '</text>';
  }

  // Plot y = f(x) over [xmin, xmax] into the box (x0, y0, w, h), value range [ymin, ymax].
  function plot(f, xmin, xmax, ymin, ymax, x0, y0, w, h, color, width){
    var pts = [], i, n = 140, x, y, X, Y;
    for(i = 0; i <= n; i += 1){
      x = xmin + (xmax - xmin) * i / n;
      y = f(x);
      if(!isFinite(y)) continue;
      X = x0 + (x - xmin) / (xmax - xmin) * w;
      Y = y0 - (y - ymin) / (ymax - ymin) * h;
      pts.push(X.toFixed(1) + "," + Y.toFixed(1));
    }
    return '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + color + '" stroke-width="' + (width || 2.4) + '" stroke-linejoin="round"/>';
  }

  function mapX(x, xmin, xmax, x0, w){ return x0 + (x - xmin) / (xmax - xmin) * w; }
  function mapY(y, ymin, ymax, y0, h){ return y0 - (y - ymin) / (ymax - ymin) * h; }

  var figs = {};

  figs["6.2.8"] = {
    caption: "Fig. 6.2.8 \u2014 y = [x(x \u2212 2)]\u00b2 rises on (0, 1) and (2, \u221e); the critical points are x = 0, 1, 2.",
    svg: function(){
      var x0 = 40, y0 = 225, w = 310, h = 180, xmin = -0.6, xmax = 2.8, ymin = 0, ymax = 5.6;
      var f = function(x){ return Math.pow(x * (x - 2), 2); };
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Graph of y equals x times x minus 2, all squared">';
      s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + w + 10) + '" y2="' + y0 + '" stroke="' + LINE + '"/>';
      s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + (y0 - h - 10) + '" stroke="' + LINE + '"/>';
      s += plot(f, xmin, xmax, ymin, ymax, x0, y0, w, h, BLUE, 3);
      var i, xs = [0, 1, 2], cx, cy;
      for(i = 0; i < xs.length; i += 1){
        cx = mapX(xs[i], xmin, xmax, x0, w); cy = mapY(f(xs[i]), ymin, ymax, y0, h);
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="' + INK + '"/>';
        s += text(cx, y0 + 16, String(xs[i]), {size: 12});
      }
      s += text(x0 + w + 8, y0 + 16, "x", {size: 13, anchor: "start"});
      s += text(x0 - 6, y0 - h - 2, "y", {size: 13, anchor: "end"});
      s += text(mapX(0.5, xmin, xmax, x0, w), y0 + 34, "increasing", {size: 12, color: GREEN, weight: 700});
      s += text(mapX(2.4, xmin, xmax, x0, w), y0 + 34, "increasing", {size: 12, color: GREEN, weight: 700});
      s += text(mapX(1.5, xmin, xmax, x0, w), y0 + 34, "decreasing", {size: 12, color: AMBER, weight: 700});
      return s + '</svg>';
    }
  };

  figs["6.2.19"] = {
    caption: "Fig. 6.2.19 \u2014 y = x\u00b2e\u207b\u02e3 is increasing on (0, 2); its maximum value is 4e\u207b\u00b2 \u2248 0.54 at x = 2.",
    svg: function(){
      var x0 = 40, y0 = 225, w = 310, h = 180, xmin = -0.5, xmax = 6, ymin = 0, ymax = 0.62;
      var f = function(x){ return x * x * Math.exp(-x); };
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Graph of y equals x squared times e to the minus x">';
      s += '<rect x="' + mapX(0, xmin, xmax, x0, w) + '" y="' + (y0 - h) + '" width="' + (mapX(2, xmin, xmax, x0, w) - mapX(0, xmin, xmax, x0, w)) + '" height="' + h + '" fill="rgba(5,150,105,.10)"/>';
      s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + w + 10) + '" y2="' + y0 + '" stroke="' + LINE + '"/>';
      s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + (y0 - h - 10) + '" stroke="' + LINE + '"/>';
      s += plot(f, xmin, xmax, ymin, ymax, x0, y0, w, h, BLUE, 3);
      var cx = mapX(2, xmin, xmax, x0, w), cy = mapY(4 * Math.exp(-2), ymin, ymax, y0, h);
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="' + RED + '"/>';
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + y0 + '" stroke="' + RED + '" stroke-dasharray="4 4"/>';
      s += text(cx, cy - 10, "(2, 0.54)", {size: 12, color: RED, weight: 700});
      s += text(mapX(3, xmin, xmax, x0, w), y0 + 18, "x", {size: 13, anchor: "start"});
      s += text(x0 - 6, y0 - h - 2, "y", {size: 13, anchor: "end"});
      return s + '</svg>';
    }
  };

  figs["6.3.27"] = {
    caption: "Fig. 6.3.27 \u2014 On x\u00b2 = 2y the point nearest to (0, 5) is (2\u221a2, 4), or its mirror (\u22122\u221a2, 4); the distance is 3.",
    svg: function(){
      var x0 = 190, y0 = 200, w = 160, h = 170, xmin = -4, xmax = 4, ymin = -1, ymax = 8;
      var f = function(x){ return x * x / 2; };
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Parabola x squared equals 2y and the point zero five">';
      s += '<line x1="20" y1="' + mapY(0, ymin, ymax, y0, h) + '" x2="360" y2="' + mapY(0, ymin, ymax, y0, h) + '" stroke="' + LINE + '"/>';
      s += '<line x1="' + x0 + '" y1="235" x2="' + x0 + '" y2="25" stroke="' + LINE + '"/>';
      s += plot(f, xmin, xmax, ymin, ymax, x0, y0, w, h, BLUE, 3);
      var qx = mapX(2 * Math.SQRT2, xmin, xmax, x0, w), qy = mapY(4, ymin, ymax, y0, h);
      var px = mapX(0, xmin, xmax, x0, w), py = mapY(5, ymin, ymax, y0, h);
      s += '<circle cx="' + qx + '" cy="' + qy + '" r="4.5" fill="' + GREEN + '"/>';
      s += '<circle cx="' + px + '" cy="' + py + '" r="4.5" fill="' + RED + '"/>';
      s += '<line x1="' + px + '" y1="' + py + '" x2="' + qx + '" y2="' + qy + '" stroke="' + AMBER + '" stroke-width="2" stroke-dasharray="5 4"/>';
      s += text(px + 8, py - 8, "(0, 5)", {size: 12, color: RED, weight: 700, anchor: "start"});
      s += text(qx + 8, qy + 4, "(2\u221a2, 4)", {size: 12, color: GREEN, weight: 700, anchor: "start"});
      s += text(300, 40, "x\u00b2 = 2y", {size: 14, color: BLUE, weight: 700});
      return s + '</svg>';
    }
  };

  figs["6.3.29"] = {
    caption: "Fig. 6.3.29 \u2014 f(x) = [x(x \u2212 1) + 1]\u00b9\u141f\u00b3 on [0, 1]: maximum 1 at x = 0 and x = 1, minimum (3/4)\u00b9\u141f\u00b3 \u2248 0.91 at x = 1/2.",
    svg: function(){
      var x0 = 50, y0 = 220, w = 280, h = 165, xmin = 0, xmax = 1, ymin = 0.84, ymax = 1.06;
      var f = function(x){ return Math.cbrt ? Math.cbrt(x * (x - 1) + 1) : Math.pow(x * (x - 1) + 1, 1 / 3); };
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Graph of the cube root of x squared minus x plus one">';
      s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + w + 10) + '" y2="' + y0 + '" stroke="' + LINE + '"/>';
      s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + (y0 - h - 10) + '" stroke="' + LINE + '"/>';
      s += plot(f, xmin, xmax, ymin, ymax, x0, y0, w, h, BLUE, 3);
      var i, xs = [0, 0.5, 1], cx, cy, vy;
      for(i = 0; i < xs.length; i += 1){
        vy = f(xs[i]); cx = mapX(xs[i], xmin, xmax, x0, w); cy = mapY(vy, ymin, ymax, y0, h);
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="' + (i === 1 ? AMBER : GREEN) + '"/>';
        s += text(cx, cy + (i === 1 ? 18 : -10), (i === 1 ? "0.91" : "1"), {size: 12, weight: 700, color: i === 1 ? AMBER : GREEN});
      }
      s += text(x0 + w + 8, y0 + 16, "x", {size: 13, anchor: "start"});
      s += text(x0 - 6, y0 - h - 2, "f(x)", {size: 13, anchor: "end"});
      return s + '</svg>';
    }
  };

  figs["Misc.5"] = {
    caption: "Fig. Misc.5 \u2014 Largest isosceles triangle inscribed in x\u00b2/a\u00b2 + y\u00b2/b\u00b2 = 1: area (3\u221a3/4)ab \u2248 1.30ab, vertex at (\u2212a, 0).",
    svg: function(){
      var cx = 200, cy = 125, a = 140, b = 90;
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Ellipse with an inscribed isosceles triangle">';
      s += '<line x1="30" y1="' + cy + '" x2="350" y2="' + cy + '" stroke="' + LINE + '"/>';
      s += '<line x1="' + cx + '" y1="20" x2="' + cx + '" y2="230" stroke="' + LINE + '"/>';
      s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + a + '" ry="' + b + '" fill="none" stroke="' + BLUE + '" stroke-width="2.4"/>';
      var ax = cx - a, ay = cy;
      var bx = cx + a / 2, by = cy - b * Math.sqrt(3) / 2;
      var dx2 = cx + a / 2, dy2 = cy + b * Math.sqrt(3) / 2;
      s += '<polygon points="' + ax + ',' + ay + ' ' + bx + ',' + by + ' ' + dx2 + ',' + dy2 + '" fill="rgba(37,99,235,.12)" stroke="' + RED + '" stroke-width="2"/>';
      s += text(ax - 10, ay + 18, "A(\u2212a, 0)", {size: 11.5, color: RED, anchor: "end"});
      s += text(bx + 12, by - 4, "B", {size: 12, color: RED, anchor: "start"});
      s += text(dx2 + 12, dy2 + 12, "C", {size: 12, color: RED, anchor: "start"});
      s += text(cx + 8, cy - 8, "O", {size: 12, color: MUTED, anchor: "start"});
      return s + '</svg>';
    }
  };

  figs["Misc.10"] = {
    caption: "Fig. Misc.10 \u2014 f(x) = (x \u2212 2)\u2074(x + 1)\u00b3: local maximum at x = 2/7 \u2248 0.29 (f \u2248 18.3), local minimum at x = 2, inflexion at x = \u22121.",
    svg: function(){
      var x0 = 45, y0 = 215, w = 295, h = 175, xmin = -1.6, xmax = 2.6, ymin = -40, ymax = 25;
      var f = function(x){ return Math.pow(x - 2, 4) * Math.pow(x + 1, 3); };
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Graph of x minus two to the fourth times x plus one cubed">';
      s += '<line x1="' + x0 + '" y1="' + mapY(0, ymin, ymax, y0, h) + '" x2="' + (x0 + w + 10) + '" y2="' + mapY(0, ymin, ymax, y0, h) + '" stroke="' + LINE + '"/>';
      s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + (y0 - h - 10) + '" stroke="' + LINE + '"/>';
      s += plot(f, xmin, xmax, ymin, ymax, x0, y0, w, h, BLUE, 3);
      var marks = [
        {x: 2 / 7, c: RED, label: "max"},
        {x: 2, c: GREEN, label: "min"},
        {x: -1, c: AMBER, label: "inflexion"}
      ];
      var i, mx, my;
      for(i = 0; i < marks.length; i += 1){
        mx = mapX(marks[i].x, xmin, xmax, x0, w); my = mapY(f(marks[i].x), ymin, ymax, y0, h);
        s += '<circle cx="' + mx + '" cy="' + my + '" r="4.5" fill="' + marks[i].c + '"/>';
        s += text(mx, my - 9, marks[i].label, {size: 11.5, color: marks[i].c, weight: 700});
      }
      s += text(x0 + w + 8, mapY(0, ymin, ymax, y0, h) + 15, "x", {size: 13, anchor: "start"});
      s += text(x0 - 6, y0 - h - 2, "f(x)", {size: 13, anchor: "end"});
      return s + '</svg>';
    }
  };

  return figs;
})();
