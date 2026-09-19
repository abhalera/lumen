// Textbook figures redrawn as SVG for the exercises of lemh202 (Application of Integrals).
// The region sketches are generated from the equations in books/originals/Class12-Maths-Pt2_lemh202.pdf.
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa", AMBER = "#fbbf24";

  function T(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function frame(x0, y0, w, h, xmin, xmax, ymin, ymax){
    var sx = w / (xmax - xmin), sy = h / (ymax - ymin);
    return {
      xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax,
      X: function(x){ return x0 + (x - xmin) * sx; },
      Y: function(y){ return y0 - (y - ymin) * sy; }
    };
  }
  function axes(f, xmaxLabel, ymaxLabel){
    var s = '';
    s += '<line x1="' + f.X(f.xmin) + '" y1="' + f.Y(0) + '" x2="' + f.X(f.xmax) + '" y2="' + f.Y(0) + '" stroke="' + MUTED + '" stroke-width="1.4"/>';
    s += '<line x1="' + f.X(0) + '" y1="' + f.Y(f.ymin) + '" x2="' + f.X(0) + '" y2="' + f.Y(f.ymax) + '" stroke="' + MUTED + '" stroke-width="1.4"/>';
    s += '<polygon points="' + f.X(f.xmax) + ',' + f.Y(0) + ' ' + (f.X(f.xmax) - 8) + ',' + (f.Y(0) - 4) + ' ' + (f.X(f.xmax) - 8) + ',' + (f.Y(0) + 4) + '" fill="' + MUTED + '"/>';
    s += '<polygon points="' + f.X(0) + ',' + f.Y(f.ymax) + ' ' + (f.X(0) - 4) + ',' + (f.Y(f.ymax) + 8) + ' ' + (f.X(0) + 4) + ',' + (f.Y(f.ymax) + 8) + '" fill="' + MUTED + '"/>';
    s += T(f.X(f.xmax) - 4, f.Y(0) + 18, xmaxLabel || "x", {color: MUTED});
    s += T(f.X(0) + 14, f.Y(f.ymax) + 4, ymaxLabel || "y", {color: MUTED, anchor: "start"});
    return s;
  }
  function plot(f, fn, a, b, n, color){
    var pts = [], i, x;
    for(i = 0; i <= (n || 80); i += 1){ x = a + (b - a) * i / (n || 80); pts.push(f.X(x) + "," + f.Y(fn(x))); }
    return '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + color + '" stroke-width="2.6" stroke-linejoin="round"/>';
  }
  function region(f, fn, a, b, n, fill){
    var pts = ["M" + f.X(a) + " " + f.Y(0)], i, x;
    for(i = 0; i <= (n || 80); i += 1){ x = a + (b - a) * i / (n || 80); pts.push("L" + f.X(x) + " " + f.Y(fn(x))); }
    pts.push("L" + f.X(b) + " " + f.Y(0) + " Z");
    return '<path d="' + pts.join(" ") + '" fill="' + fill + '"/>';
  }
  function ticks(f, xs, ys){
    var s = '', i;
    for(i = 0; i < xs.length; i += 1){
      if(f.Y(0) < f.Y(f.ymin) && f.Y(0) > f.Y(f.ymax)) s += '<line x1="' + f.X(xs[i]) + '" y1="' + (f.Y(0) - 3) + '" x2="' + f.X(xs[i]) + '" y2="' + (f.Y(0) + 3) + '" stroke="' + MUTED + '" stroke-width="1"/>';
      s += T(f.X(xs[i]), f.Y(0) + 16, String(xs[i]), {color: MUTED, size: 11});
    }
    for(i = 0; i < ys.length; i += 1){
      s += T(f.X(0) - 8, f.Y(ys[i]) + 4, String(ys[i]), {color: MUTED, size: 11, anchor: "end"});
    }
    return s;
  }

  var figs = {};

  figs["8.1.1"] = {
    caption: "Fig. 8.1.1 — The ellipse x²/16 + y²/9 = 1; the full region has area 12π ≈ 37.70 (redrawn).",
    svg: function(){
      var f = frame(40, 190, 300, 140, -5, 5, -4, 4);
      var s = '<svg viewBox="0 0 380 220" role="img" aria-label="Ellipse with semi-axes 4 and 3">';
      s += region(f, function(x){ return 3 * Math.sqrt(Math.max(0, 1 - x * x / 16)); }, -4, 4, 120, "rgba(56,189,248,0.20)");
      s += region(f, function(x){ return -3 * Math.sqrt(Math.max(0, 1 - x * x / 16)); }, -4, 4, 120, "rgba(56,189,248,0.20)");
      s += axes(f, "x", "y") + ticks(f, [-4, 4], [3, -3]);
      s += plot(f, function(x){ return 3 * Math.sqrt(Math.max(0, 1 - x * x / 16)); }, -4, 4, 120, BLUE);
      s += plot(f, function(x){ return -3 * Math.sqrt(Math.max(0, 1 - x * x / 16)); }, -4, 4, 120, BLUE);
      s += T(190, 20, "a = 4, b = 3, area = πab = 12π", {color: AMBER, size: 14, weight: 700});
      return s + '</svg>';
    }
  };

  figs["8.1.2"] = {
    caption: "Fig. 8.1.2 — The ellipse x²/4 + y²/9 = 1; the full region has area 6π ≈ 18.85 (redrawn).",
    svg: function(){
      var f = frame(40, 190, 300, 140, -3.5, 3.5, -4, 4);
      var s = '<svg viewBox="0 0 380 220" role="img" aria-label="Ellipse with semi-axes 2 and 3">';
      s += region(f, function(x){ return 3 * Math.sqrt(Math.max(0, 1 - x * x / 4)); }, -2, 2, 120, "rgba(250,204,21,0.20)");
      s += region(f, function(x){ return -3 * Math.sqrt(Math.max(0, 1 - x * x / 4)); }, -2, 2, 120, "rgba(250,204,21,0.20)");
      s += axes(f, "x", "y") + ticks(f, [-2, 2], [3, -3]);
      s += plot(f, function(x){ return 3 * Math.sqrt(Math.max(0, 1 - x * x / 4)); }, -2, 2, 120, AMBER);
      s += plot(f, function(x){ return -3 * Math.sqrt(Math.max(0, 1 - x * x / 4)); }, -2, 2, 120, AMBER);
      s += T(190, 20, "a = 2, b = 3, area = πab = 6π", {color: AMBER, size: 14, weight: 700});
      return s + '</svg>';
    }
  };

  figs["8.1.3"] = {
    caption: "Fig. 8.1.3 — Quarter circle x² + y² = 4 in the first quadrant; area = π ≈ 3.14 (redrawn).",
    svg: function(){
      var f = frame(50, 195, 260, 150, -0.5, 2.8, -0.5, 2.8);
      var s = '<svg viewBox="0 0 380 230" role="img" aria-label="Quarter circle of radius 2">';
      s += region(f, function(x){ return Math.sqrt(Math.max(0, 4 - x * x)); }, 0, 2, 100, "rgba(52,211,153,0.22)");
      s += axes(f, "x", "y") + ticks(f, [2], [2]);
      s += plot(f, function(x){ return Math.sqrt(Math.max(0, 4 - x * x)); }, 0, 2, 100, "#34d399");
      s += '<line x1="' + f.X(0) + '" y1="' + f.Y(0) + '" x2="' + f.X(0) + '" y2="' + f.Y(2) + '" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="' + f.X(0) + '" y1="' + f.Y(0) + '" x2="' + f.X(2) + '" y2="' + f.Y(0) + '" stroke="' + INK + '" stroke-width="2"/>';
      s += T(f.X(1) + 6, f.Y(1) - 6, "x² + y² = 4", {color: "#34d399", size: 13});
      s += T(190, 18, "quarter of π(2)² = π ≈ 3.14", {color: AMBER, size: 14, weight: 700});
      return s + '</svg>';
    }
  };

  figs["8.1.4"] = {
    caption: "Fig. 8.1.4 — Region bounded by y² = 4x, the y-axis and y = 3; area = 9/4 = 2.25 (redrawn).",
    svg: function(){
      var f = frame(70, 80, 250, 150, -0.4, 3, -0.4, 3.4);
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Region bounded by y squared equals 4x and y equals 3">';
      var pts = ['M' + f.X(0) + ' ' + f.Y(0)], i, x;
      for(i = 0; i <= 60; i += 1){ x = 3 * i / 60; pts.push('L' + f.X(x * x / 4) + ' ' + f.Y(x)); }
      pts.push('L' + f.X(0) + ' ' + f.Y(3) + ' Z');
      s += '<path d="' + pts.join(' ') + '" fill="rgba(96,165,250,0.22)"/>';
      s += axes(f, "x", "y") + ticks(f, [1, 2], [1, 2, 3]);
      s += plot(f, function(t){ return Math.sqrt(4 * t); }, 0, 2.25, 60, BLUE);
      s += '<line x1="' + f.X(0) + '" y1="' + f.Y(3) + '" x2="' + f.X(2.4) + '" y2="' + f.Y(3) + '" stroke="' + INK + '" stroke-width="2" stroke-dasharray="5 4"/>';
      s += T(f.X(1.2), f.Y(3.25), "y = 3", {color: INK, size: 12});
      s += T(190, 18, "horizontal strips: ∫₀³ y²/4 dy = 9/4 = 2.25", {color: AMBER, size: 13.5, weight: 700});
      return s + '</svg>';
    }
  };

  figs["8.m1"] = {
    caption: "Fig. 8.M1 — Areas under y = x² from x = 1 to 2 (7/3) and y = x⁴ from x = 1 to 5 (3124/5) (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 400 210" role="img" aria-label="Areas under x squared and x to the fourth">';
      var f1 = frame(40, 175, 130, 110, 0, 2.3, 0, 4.6);
      s += region(f1, function(x){ return x * x; }, 1, 2, 60, "rgba(56,189,248,0.22)");
      s += axes(f1, "x", "y") + ticks(f1, [1, 2], [4]);
      s += plot(f1, function(x){ return x * x; }, 0, 2.15, 60, BLUE);
      s += T(105, 20, "y = x²: 7/3 ≈ 2.33", {color: BLUE, size: 13, weight: 700});
      var f2 = frame(240, 175, 130, 110, 0, 5.5, 0, 700);
      s += region(f2, function(x){ return x * x * x * x; }, 1, 5, 60, "rgba(250,204,21,0.22)");
      s += axes(f2, "x", "y") + ticks(f2, [1, 5], []);
      s += plot(f2, function(x){ return x * x * x * x; }, 0, 5.3, 60, AMBER);
      s += T(305, 20, "y = x⁴: 3124/5 = 624.8", {color: AMBER, size: 13, weight: 700});
      return s + '</svg>';
    }
  };

  figs["8.m2"] = {
    caption: "Fig. 8.M2 — y = |x + 3| between x = −6 and x = 0; the area is 9 (redrawn).",
    svg: function(){
      var f = frame(45, 180, 300, 120, -6.5, 1, -0.5, 4);
      var s = '<svg viewBox="0 0 380 220" role="img" aria-label="V shaped graph of absolute x plus 3">';
      s += region(f, function(x){ return Math.abs(x + 3); }, -6, 0, 100, "rgba(52,211,153,0.22)");
      s += axes(f, "x", "y") + ticks(f, [-6, -3], [3]);
      s += plot(f, function(x){ return Math.abs(x + 3); }, -6, 0, 100, "#34d399");
      s += '<circle cx="' + f.X(-3) + '" cy="' + f.Y(0) + '" r="3" fill="' + RED + '"/>';
      s += T(f.X(-4.5), 20, "two triangles: 9/2 + 9/2 = 9", {color: AMBER, size: 13.5, weight: 700});
      return s + '</svg>';
    }
  };

  figs["8.m3"] = {
    caption: "Fig. 8.M3 — y = sin x from 0 to 2π; total geometric area = 2 + 2 = 4 (redrawn).",
    svg: function(){
      var f = frame(40, 150, 310, 90, -0.3, 2 * Math.PI + 0.3, -1.4, 1.4);
      var s = '<svg viewBox="0 0 380 220" role="img" aria-label="Sine curve from zero to two pi">';
      s += region(f, Math.sin, 0, Math.PI, 80, "rgba(56,189,248,0.24)");
      s += region(f, Math.sin, Math.PI, 2 * Math.PI, 80, "rgba(239,68,68,0.26)");
      s += axes(f, "x", "y") + ticks(f, [0, 1, 2, 3, 4, 5, 6], [1, -1]);
      s += plot(f, Math.sin, 0, 2 * Math.PI, 120, BLUE);
      s += T(190, 20, "above π: 2, below π: |−2|, total 4", {color: AMBER, size: 13.5, weight: 700});
      return s + '</svg>';
    }
  };

  figs["8.m4"] = {
    caption: "Fig. 8.M4 — y = x³ between x = −2 and x = 1; geometric area = 4 + 1/4 = 17/4 (redrawn).",
    svg: function(){
      var f = frame(75, 155, 230, 120, -2.3, 1.3, -8.5, 1.6);
      var s = '<svg viewBox="0 0 380 230" role="img" aria-label="Cubic curve from minus two to one">';
      s += region(f, function(x){ return x * x * x; }, -2, 0, 60, "rgba(239,68,68,0.28)");
      s += region(f, function(x){ return x * x * x; }, 0, 1, 60, "rgba(56,189,248,0.26)");
      s += axes(f, "x", "y") + ticks(f, [-2, 1], []);
      s += plot(f, function(x){ return x * x * x; }, -2, 1, 120, BLUE);
      s += T(190, 20, "|−4| + 1/4 = 17/4 = 4.25", {color: AMBER, size: 13.5, weight: 700});
      return s + '</svg>';
    }
  };

  figs["8.m5"] = {
    caption: "Fig. 8.M5 — y = x|x| between x = −1 and x = 1; geometric area = 1/3 + 1/3 = 2/3 (redrawn).",
    svg: function(){
      var f = frame(115, 155, 150, 120, -1.3, 1.3, -1.3, 1.3);
      var s = '<svg viewBox="0 0 380 230" role="img" aria-label="Graph of x times absolute x">';
      s += region(f, function(x){ return x * Math.abs(x); }, -1, 0, 60, "rgba(239,68,68,0.28)");
      s += region(f, function(x){ return x * Math.abs(x); }, 0, 1, 60, "rgba(56,189,248,0.26)");
      s += axes(f, "x", "y") + ticks(f, [-1, 1], [1, -1]);
      s += plot(f, function(x){ return x * Math.abs(x); }, -1, 1, 120, BLUE);
      s += T(190, 20, "signed integral 0, geometric area 2/3", {color: AMBER, size: 13.5, weight: 700});
      return s + '</svg>';
    }
  };

  return figs;
})();
