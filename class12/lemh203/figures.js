// Exercise graphs for lemh203 (Differential Equations), redrawn as SVG.
// Chapter 9 of the NCERT PDF has no printed figures; these are the solution graphs
// requested by the curve questions (Exercises 9.3 Q15 and 9.5 Q16).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", BLUE = "#38bdf8", AMBER = "#f59e0b", GREEN = "#34d399", FAINT = "#475569";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function line(x1, y1, x2, y2, c, w, dash){
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + (w || 2) + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/>';
  }
  function frame(x0, y0, w, h, xmin, xmax, ymin, ymax){
    return {
      X: function(x){ return x0 + (x - xmin) * w / (xmax - xmin); },
      Y: function(y){ return y0 - (y - ymin) * h / (ymax - ymin); },
      xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax
    };
  }
  function grid(f){
    var s = "", i;
    for(i = Math.ceil(f.xmin); i <= Math.floor(f.xmax); i += 1) s += line(f.X(i), f.Y(f.ymin), f.X(i), f.Y(f.ymax), "#1e2d3d", 1);
    for(i = Math.ceil(f.ymin); i <= Math.floor(f.ymax); i += 1) s += line(f.X(f.xmin), f.Y(i), f.X(f.xmax), f.Y(i), "#1e2d3d", 1);
    var yz = Math.min(Math.max(0, f.ymin), f.ymax), xz = Math.min(Math.max(0, f.xmin), f.xmax);
    s += line(f.X(f.xmin), f.Y(yz), f.X(f.xmax) + 8, f.Y(yz), MUTED, 1.5);
    s += line(f.X(xz), f.Y(f.ymin) - 8, f.X(xz), f.Y(f.ymax) - 8, MUTED, 1.5);
    s += text(f.X(f.xmax) + 6, f.Y(yz) + 16, "x", { color: MUTED, anchor: "end" });
    s += text(f.X(xz) + 8, f.Y(f.ymax) - 12, "y", { color: MUTED, anchor: "start" });
    return s;
  }
  function curve(f, fn, color, w){
    var pts = [], i, prev = null;
    for(i = 0; i <= 120; i += 1){
      var x = f.xmin + (f.xmax - f.xmin) * i / 120;
      var y = fn(x);
      if(!isFinite(y) || y < f.ymin - 4 || y > f.ymax + 4){ prev = null; continue; }
      var X = f.X(x), Y = f.Y(y);
      if(prev) pts.push(prev.x + "," + prev.y + " " + X + "," + Y);
      prev = { x: X, y: Y };
    }
    var out = "";
    for(i = 0; i < pts.length; i += 1) out += '<polyline fill="none" stroke="' + color + '" stroke-width="' + (w || 3) + '" stroke-linejoin="round" points="' + pts[i] + '"/>';
    return out;
  }

  var figs = {};

  figs["9.3Q15"] = {
    caption: "Graph for Exercise 9.3, Q15 — the curve y = [eˣ(sin x − cos x) + 1]/2 through (0, 0) (redrawn).",
    svg: function(){
      var f = frame(60, 230, 280, 180, -1.5, 3, -1.2, 2.4);
      var s = '<svg viewBox="0 0 380 260" role="img" aria-label="Solution curve through the origin">';
      s += grid(f);
      s += curve(f, function(x){ return (Math.exp(x) * (Math.sin(x) - Math.cos(x)) + 1) / 2; }, BLUE, 3);
      s += '<circle cx="' + f.X(0) + '" cy="' + f.Y(0) + '" r="5" fill="' + GREEN + '"/>';
      s += text(f.X(0) + 10, f.Y(0) + 18, "(0, 0)", { color: GREEN, anchor: "start" });
      s += text(190, 26, "y′ = eˣ sin x,  y(0) = 0", { size: 14, color: INK, weight: 700 });
      return s + '</svg>';
    }
  };

  figs["9.5Q16"] = {
    caption: "Graph for Exercise 9.5, Q16 — slope field of y′ = x + y and the solution curve x + y + 1 = eˣ through the origin (redrawn).",
    svg: function(){
      var f = frame(60, 230, 280, 180, -2, 2, -2.5, 2.5);
      var s = '<svg viewBox="0 0 380 260" role="img" aria-label="Slope field and solution curve">';
      s += grid(f);
      var i, j;
      for(i = -2; i <= 2; i += 0.5){
        for(j = -2.5; j <= 2.5; j += 0.5){
          var slope = i + j, len = 9, X = f.X(i), Y = f.Y(j);
          var dx = len / Math.sqrt(1 + slope * slope), dy = -slope * dx;
          s += line(X - dx, Y - dy, X + dx, Y + dy, FAINT, 1.4);
        }
      }
      s += curve(f, function(x){ return Math.exp(x) - x - 1; }, AMBER, 3);
      s += '<circle cx="' + f.X(0) + '" cy="' + f.Y(0) + '" r="5" fill="' + GREEN + '"/>';
      s += text(190, 26, "y′ = x + y,  x + y + 1 = eˣ", { size: 14, color: INK, weight: 700 });
      return s + '</svg>';
    }
  };

  return figs;
})();
