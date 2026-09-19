// Textbook figures used by the exercises, redrawn as SVG from the vector data in
// books/originals/Class09-Science_iesc104.pdf (pages 22–23).
window.FIGURES = (function(){
  var GRID = "#cfe8cf", GRID_MAJOR = "#9fd39f", AXIS = "#1f2937", A_COL = "#1d74bc", B_COL = "#e0007d";

  function t(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 13) + '" fill="' + (o.color || AXIS) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + (o.rotate ? ' transform="rotate(' + o.rotate + ' ' + x + ' ' + y + ')"' : '') + '>' + s + '</text>';
  }

  // Graph-paper axes. opts: {w,h,x0,y0,pw,ph, xmax,ymax, xMinor,yMinor, xMajor,yMajor, xLabels:[[v,label]], yLabels, xTitle, yTitle}
  function axes(o){
    var s = "";
    var sx = o.pw / o.xmax, sy = o.ph / o.ymax;
    for(var i = 0; i <= Math.round(o.xmax / o.xMinor); i++){
      var xv = i * o.xMinor, X = o.x0 + xv * sx;
      var major = Math.abs(xv / o.xMajor - Math.round(xv / o.xMajor)) < 1e-6;
      s += '<line x1="' + X + '" y1="' + o.y0 + '" x2="' + X + '" y2="' + (o.y0 - o.ph) + '" stroke="' + (major ? GRID_MAJOR : GRID) + '" stroke-width="' + (major ? 1 : 0.6) + '"/>';
    }
    for(var j = 0; j <= Math.round(o.ymax / o.yMinor); j++){
      var yv = j * o.yMinor, Y = o.y0 - yv * sy;
      var majorY = Math.abs(yv / o.yMajor - Math.round(yv / o.yMajor)) < 1e-6;
      s += '<line x1="' + o.x0 + '" y1="' + Y + '" x2="' + (o.x0 + o.pw) + '" y2="' + Y + '" stroke="' + (majorY ? GRID_MAJOR : GRID) + '" stroke-width="' + (majorY ? 1 : 0.6) + '"/>';
    }
    s += '<line x1="' + o.x0 + '" y1="' + o.y0 + '" x2="' + (o.x0 + o.pw + 14) + '" y2="' + o.y0 + '" stroke="' + AXIS + '" stroke-width="1.4"/>';
    s += '<line x1="' + o.x0 + '" y1="' + o.y0 + '" x2="' + o.x0 + '" y2="' + (o.y0 - o.ph - 14) + '" stroke="' + AXIS + '" stroke-width="1.4"/>';
    s += '<path d="M' + (o.x0 + o.pw + 14) + ' ' + o.y0 + ' l-7 -4 v8 z M' + o.x0 + ' ' + (o.y0 - o.ph - 14) + ' l-4 7 h8 z" fill="' + AXIS + '"/>';
    s += t(o.x0 - 8, o.y0 + 18, "0", {anchor: "end"});
    (o.xLabels || []).forEach(function(p){ s += t(o.x0 + p[0] * sx, o.y0 + 18, p[1]); });
    (o.yLabels || []).forEach(function(p){ s += t(o.x0 - 8, o.y0 - p[0] * sy + 4, p[1], {anchor: "end"}); });
    s += t(o.x0 + o.pw / 2, o.y0 + 38, o.xTitle);
    s += t(o.x0 - 40, o.y0 - o.ph / 2, o.yTitle, {rotate: -90});
    return {svg: s, X: function(v){ return o.x0 + v * sx; }, Y: function(v){ return o.y0 - v * sy; }};
  }

  function poly(ax, pts, color, w){
    return '<polyline fill="none" stroke="' + color + '" stroke-width="' + (w || 2.4) + '" stroke-linejoin="round" points="' +
      pts.map(function(p){ return ax.X(p[0]) + "," + ax.Y(p[1]); }).join(" ") + '"/>';
  }

  function wrap(w, h, body, label){
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>';
  }

  var figs = {};

  // Fig. 4.27: two straight position–time lines crossing at t = 5 s (position axis is unnumbered in the book).
  figs["4.27"] = {
    caption: "Fig. 4.27 — Position–time graphs of objects A and B (redrawn; the position axis has no numbers in the textbook).",
    svg: function(){
      var ax = axes({x0: 60, y0: 230, pw: 250, ph: 200, xmax: 7, ymax: 80, xMinor: 0.2, yMinor: 2, xMajor: 1, yMajor: 10,
        xLabels: [[5, "5"]], yLabels: [], xTitle: "Time (s)", yTitle: "Position (m)"});
      var b = ax.svg;
      b += '<line x1="' + ax.X(5) + '" y1="' + ax.Y(0) + '" x2="' + ax.X(5) + '" y2="' + ax.Y(76) + '" stroke="' + AXIS + '" stroke-width="1.6" stroke-dasharray="6 4"/>';
      b += poly(ax, [[0, 0], [6.2, 62]], A_COL);
      b += poly(ax, [[0, 20], [6.2, 57.2]], B_COL);
      b += t(ax.X(6.35), ax.Y(64), "A", {anchor: "start", size: 15});
      b += t(ax.X(6.35), ax.Y(54), "B", {anchor: "start", size: 15});
      return wrap(340, 280, b, "Two straight lines on a position–time graph: A starts at the origin and is steeper; B starts higher and is less steep; they cross at t = 5 seconds.");
    }
  };

  // Fig. 4.28: A straight line; B bends twice; same start and end positions at t = 10 s.
  figs["4.28"] = {
    caption: "Fig. 4.28 — Position–time graphs of A and B from 0 to 10 s (redrawn; the position axis has no numbers in the textbook).",
    svg: function(){
      var ax = axes({x0: 60, y0: 230, pw: 250, ph: 200, xmax: 11, ymax: 110, xMinor: 0.5, yMinor: 2.5, xMajor: 2.5, yMajor: 12.5,
        xLabels: [[10, "10"]], yLabels: [], xTitle: "Time (s)", yTitle: "Position (m)"});
      var b = ax.svg;
      b += '<line x1="' + ax.X(10) + '" y1="' + ax.Y(0) + '" x2="' + ax.X(10) + '" y2="' + ax.Y(104) + '" stroke="' + AXIS + '" stroke-width="1.6" stroke-dasharray="6 4"/>';
      b += poly(ax, [[0, 0], [10, 100]], B_COL);
      b += poly(ax, [[0, 0], [4, 16], [7.5, 53], [10, 100]], A_COL);
      b += t(ax.X(5.3), ax.Y(62), "A", {size: 15});
      b += t(ax.X(8.3), ax.Y(49), "B", {size: 15});
      return wrap(340, 280, b, "Position–time graph: A is a straight line from the origin to a final position at 10 seconds; B starts at the same point, rises slowly, then faster, and reaches the same final position at 10 seconds.");
    }
  };

  // Fig. 4.29: speed limit sign.
  figs["4.29"] = {
    caption: "Fig. 4.29 — Speed limit sign: 50 km h⁻¹ for cars, 40 km h⁻¹ for trucks (redrawn).",
    svg: function(){
      var b = '<rect x="20" y="10" width="160" height="250" rx="6" fill="#1f5fae"/><rect x="26" y="16" width="148" height="238" rx="4" fill="none" stroke="#fff" stroke-width="2"/>';
      [[70, "50", "car"], [160, "40", "truck"]].forEach(function(r){
        var cy = r[0];
        b += '<circle cx="100" cy="' + cy + '" r="40" fill="#fff" stroke="#d61f26" stroke-width="9"/>';
        if(r[2] === "car"){
          b += '<path d="M78 ' + (cy - 10) + ' h44 l-6 -12 h-32 z" fill="#222"/><rect x="76" y="' + (cy - 11) + '" width="48" height="6" rx="2" fill="#222"/>';
        } else {
          b += '<rect x="80" y="' + (cy - 26) + '" width="26" height="15" fill="#222"/><path d="M106 ' + (cy - 21) + ' h10 l5 6 v4 h-15 z" fill="#222"/>';
        }
        b += t(100, cy + 22, r[1], {size: 26, weight: 700, color: "#222"});
      });
      b += t(100, 228, "गति सीमा", {size: 14, color: "#fff", weight: 700});
      b += t(100, 247, "Speed Limit", {size: 14, color: "#fff", weight: 700});
      return wrap(200, 270, b, "Blue road sign showing speed limit 50 kilometres per hour for cars and 40 kilometres per hour for trucks.");
    }
  };

  // Fig. 4.30: cyclist velocity–time graph (exact values from the PDF vector path).
  figs["4.30"] = {
    caption: "Fig. 4.30 — Velocity–time graph of a cyclist, 0 to 120 s (redrawn from the textbook).",
    svg: function(){
      var ax = axes({x0: 60, y0: 230, pw: 270, ph: 196, xmax: 135, ymax: 7, xMinor: 4, yMinor: 0.2, xMajor: 20, yMajor: 1,
        xLabels: [[20, "20"], [40, "40"], [60, "60"], [80, "80"], [100, "100"], [120, "120"]],
        yLabels: [[1, "1"], [2, "2"], [3, "3"], [4, "4"], [5, "5"], [6, "6"]],
        xTitle: "Time (s)", yTitle: "Velocity (m s⁻¹)"});
      return wrap(360, 280, ax.svg + poly(ax, [[0, 0], [20, 3], [100, 3], [120, 2]], A_COL, 2.6),
        "Velocity–time graph: velocity rises from 0 to 3 metres per second in 20 seconds, stays at 3 until 100 seconds, then falls to 2 metres per second at 120 seconds.");
    }
  };

  // Fig. 4.31: smartwatch velocity–time graph (km h⁻¹ against h).
  figs["4.31"] = {
    caption: "Fig. 4.31 — Velocity–time graph from a runner's smartwatch (redrawn from the textbook).",
    svg: function(){
      var pts = [[0, 7.0], [0.6, 7.0], [1.6, 7.5], [3.0, 7.5], [4.6, 7.0], [5.6, 6.5], [6.6, 6.5]];
      var ax = axes({x0: 64, y0: 230, pw: 266, ph: 196, xmax: 7.2, ymax: 8.6, xMinor: 0.2, yMinor: 0.25, xMajor: 1, yMajor: 1.25,
        xLabels: [[2, "2"], [4, "4"], [6, "6"]], yLabels: [[2.5, "2.5"], [5, "5.0"], [7.5, "7.5"]],
        xTitle: "Time (h)", yTitle: "Velocity (km h⁻¹)"});
      var b = ax.svg + poly(ax, pts, A_COL, 2.6);
      pts.forEach(function(p){ b += '<circle cx="' + ax.X(p[0]) + '" cy="' + ax.Y(p[1]) + '" r="3" fill="#111"/>'; });
      return wrap(360, 280, b, "Velocity–time graph over about 6.6 hours: velocity stays between 6.5 and 7.5 kilometres per hour.");
    }
  };

  // Fig. 4.32: wall clock.
  figs["4.32"] = {
    caption: "Fig. 4.32 — Wall clock; the minute hand is 7 cm long (redrawn).",
    svg: function(){
      var cx = 110, cy = 110, b = '<circle cx="' + cx + '" cy="' + cy + '" r="96" fill="#fff" stroke="#b5654a" stroke-width="10"/>';
      for(var m = 0; m < 60; m++){
        var ang = m * 6 * Math.PI / 180, r1 = m % 5 === 0 ? 76 : 82;
        b += '<line x1="' + (cx + Math.sin(ang) * r1) + '" y1="' + (cy - Math.cos(ang) * r1) + '" x2="' + (cx + Math.sin(ang) * 88) + '" y2="' + (cy - Math.cos(ang) * 88) + '" stroke="#333" stroke-width="' + (m % 5 === 0 ? 2 : 1) + '"/>';
      }
      for(var h = 1; h <= 12; h++){
        var a = h * 30 * Math.PI / 180;
        b += t(cx + Math.sin(a) * 62, cy - Math.cos(a) * 62 + 6, String(h), {size: 17, color: "#222"});
      }
      b += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx - 38) + '" y2="' + (cy - 16) + '" stroke="#7a2a1c" stroke-width="5" stroke-linecap="round"/>';
      b += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 56) + '" y2="' + (cy - 30) + '" stroke="#7a2a1c" stroke-width="3.5" stroke-linecap="round"/>';
      b += '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#7a2a1c"/>';
      return wrap(220, 220, b, "Round wall clock with hour and minute hands.");
    }
  };

  return figs;
})();
