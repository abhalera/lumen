// Textbook figures used by iemh101 exercises, redrawn as SVG from Figs. 1.3 and 1.5 (PDF pages 5 and 7). 1 unit = 1 ft.
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 11) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') + (o.rotate !== undefined ? ' transform="rotate(' + o.rotate + ' ' + x + ' ' + y + ')"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(x1, y1, x2, y2, c, w){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#111") + '" stroke-width="' + (w || 1.5) + '"/>'; }
  function poly(P, arr, stroke, fill, w){ return '<polygon points="' + arr.map(function(p){ return P.X(p[0]) + "," + P.Y(p[1]); }).join(" ") + '" fill="' + (fill || "none") + '" stroke="' + stroke + '" stroke-width="' + (w || 1.5) + '"/>'; }
  function plan(o){
    var P = {X: function(x){ return o.left + (x - o.xmin) * o.s; }, Y: function(y){ return o.top + (o.ymax - y) * o.s; }}, g = "";
    for(var x = o.xmin; x <= o.xmax; x++) g += ln(P.X(x), P.Y(o.ymin), P.X(x), P.Y(o.ymax), "#f1e3cf", 1);
    for(var y = o.ymin; y <= o.ymax; y++) g += ln(P.X(o.xmin), P.Y(y), P.X(o.xmax), P.Y(y), "#f1e3cf", 1);
    g += ln(P.X(o.xmin), P.Y(0), P.X(o.xmax), P.Y(0), "#6b7280", 1) + ln(P.X(0), P.Y(o.ymin), P.X(0), P.Y(o.ymax), "#6b7280", 1);
    P.grid = g;
    return P;
  }
  function dot(P, x, y, label, dx, dy, anchor){ return '<circle cx="' + P.X(x) + '" cy="' + P.Y(y) + '" r="3.2" fill="#dc2626"/>' + (label ? t(P.X(x) + (dx || 0), P.Y(y) + (dy || 0), label, {size: 11, weight: 700, anchor: anchor}) : ""); }
  function bedroom(P){
    var b = poly(P, [[0, 0], [12, 0], [12, 10], [0, 10]], "#1f2937", "rgba(251,230,200,0.35)", 2.5);
    b += poly(P, [[3, 0], [7, 0], [7, 2], [3, 2]], "#1f2937", "rgba(180,120,60,0.30)", 1.5) + t(P.X(5), P.Y(1) + 4, "Wardrobe");
    b += poly(P, [[0.5, 5], [6.5, 5], [6.5, 8], [0.5, 8]], "#1f2937", "rgba(186,230,253,0.6)", 1.5) + t(P.X(3.5), P.Y(6.5) + 4, "Bed", {size: 12, weight: 700});
    b += t(P.X(12) + 14, P.Y(5), "Right wall", {weight: 700, rotate: 90});
    for(var i = 1; i <= 12; i++) b += t(P.X(i), P.Y(0) + 13, "+" + i, {size: 9, color: "#374151"});
    for(var j = 1; j <= 10; j++) b += t(P.X(0) - 4, P.Y(j) + 3, "+" + j, {size: 9, color: "#374151", anchor: "end"});
    b += ln(P.X(8), P.Y(0), P.X(11.5), P.Y(0), "#dc2626", 4) + ln(P.X(0), P.Y(1.5), P.X(0), P.Y(4), "#dc2626", 4);
    b += dot(P, 0, 0, "O (0, 0)", 0, 30) + dot(P, 12, 0, "A (12, 0)", 24, -8) + dot(P, 12, 10, "B (12, 10)", 0, -8) + dot(P, 0, 10, "C (0, 10)", 26, -8);
    b += dot(P, 3, 0, "W₁", 0, 28) + dot(P, 7, 0, "W₂", -6, 28) + dot(P, 7, 2, "W₃", 12, -6) + dot(P, 3, 2, "W₄", -10, -6);
    b += dot(P, 8, 0, "D₁", 4, 28) + dot(P, 11.5, 0, "R₁ (11.5, 0)", -8, 42);
    b += dot(P, 0, 1.5, "B₁", 14, 4) + dot(P, 0, 4, "B₂", 14, 4) + dot(P, 0, 9, "F", 10, -4);
    b += dot(P, 0.5, 5, "S₁", 12, 14) + dot(P, 6.5, 5, "S₂", 12, 14) + dot(P, 6.5, 8, "S₃", 12, -6) + dot(P, 0.5, 8, "S₄", 14, -6);
    return b;
  }
  var figs = {};
  figs["1.3"] = {caption: "Fig. 1.3: Reiaan’s room on the coordinate axes, with 1 unit = 1 ft (redrawn).", svg: function(){
    var P = plan({xmin: -1, xmax: 13, ymin: -1, ymax: 11, s: 26, left: 40, top: 22});
    var b = P.grid + bedroom(P) + t(P.X(6), P.Y(-1) + 24, "x-axis", {size: 12, weight: 700}) + t(16, P.Y(5), "y-axis", {size: 12, weight: 700, rotate: -90});
    return wrap(440, 370, b, "Fig. 1.3: Reiaan’s room with corners O, A, B and C, doors D₁R₁ and B₁B₂, the wardrobe W₁W₂W₃W₄ and the bed S₁S₂S₃S₄");
  }};
  figs["1.5"] = {caption: "Fig. 1.5: Reiaan’s room and bathroom, with the showering area SHWR; 1 unit = 1 ft (redrawn).", svg: function(){
    var P = plan({xmin: -7, xmax: 13, ymin: -1, ymax: 11, s: 22, left: 30, top: 22});
    var b = P.grid + poly(P, [[-6, 0], [0, 0], [0, 9], [-6, 9]], "#1f2937", "rgba(147,197,253,0.45)", 2.5);
    b += '<polyline points="' + [[-6, 6], [-3, 6], [-2, 9]].map(function(p){ return P.X(p[0]) + "," + P.Y(p[1]); }).join(" ") + '" fill="none" stroke="#1f2937" stroke-width="2.5"/>';
    b += t(P.X(-4.4), P.Y(7.7), "Showering", {size: 10}) + t(P.X(-4.4), P.Y(7.7) + 12, "Area", {size: 10}) + t(P.X(-3), P.Y(3), "Bathroom");
    for(var i = -6; i <= -1; i++) b += t(P.X(i), P.Y(0) + 13, "−" + (-i), {size: 9, color: "#374151"});
    b += bedroom(P);
    b += dot(P, -6, 0, "P", -10, 16) + dot(P, -6, 9, "R", -10, -6) + dot(P, -6, 6, "S", -12, 4) + dot(P, -3, 6, "H", 10, 14) + dot(P, -2, 9, "W", 0, -8);
    b += t(P.X(3), P.Y(-1) + 24, "x-axis", {size: 12, weight: 700});
    return wrap(510, 320, b, "Fig. 1.5: Reiaan’s room and bathroom with corners O, F, R and P, and the showering area SHWR");
  }};
  return figs;
})();
