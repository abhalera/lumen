// Textbook figures used by iemh106 exercises, redrawn as SVG. Proportions of Figs. 6.43, 6.44 and 6.54 follow the PDF’s vector drawing.
window.FIGURES = (function(){
  var INK = "#1f2937", BLUE = "rgba(99,120,200,0.45)", RED = "rgba(220,38,38,0.55)", GREEN = "rgba(34,160,80,0.5)", PEACH = "rgba(251,191,140,0.35)", PINK = "rgba(244,114,182,0.3)";
  function f(v){ return (+v).toFixed(1); }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(a, b, o){ o = o || {}; return '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="' + (o.c || INK) + '" stroke-width="' + (o.w || 1.6) + '"' + (o.dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
  function dot(p){ return '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="3" fill="' + INK + '"/>'; }
  function lab(p, s, dx, dy, o){ o = o || {}; return '<text x="' + f(p[0] + dx) + '" y="' + f(p[1] + dy) + '" font-size="' + (o.size || 13) + '" font-style="' + (o.italic ? 'italic' : 'normal') + '" font-weight="' + (o.bold === false ? 400 : 700) + '" fill="' + (o.c || INK) + '" text-anchor="' + (o.anchor || 'middle') + '">' + s + '</text>'; }
  function poly(P, fill, o){ o = o || {}; return '<polygon points="' + P.map(function(p){ return f(p[0]) + ',' + f(p[1]); }).join(' ') + '" fill="' + fill + '" stroke="' + (o.c || INK) + '" stroke-width="' + (o.w || 1.6) + '"' + (o.dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
  // SVG arc from p to q with radius r; sweep 1 = clockwise on screen
  function arc(p, q, r, sweep, large){ return ' A ' + f(r) + ' ' + f(r) + ' 0 ' + (large ? 1 : 0) + ' ' + sweep + ' ' + f(q[0]) + ' ' + f(q[1]); }
  function path(d, fill, o){ o = o || {}; return '<path d="' + d + '" fill="' + (fill || 'none') + '" stroke="' + (o.c || INK) + '" stroke-width="' + (o.w || 1.8) + '"' + (o.dash ? ' stroke-dasharray="4 3"' : '') + ' stroke-linejoin="round"/>'; }
  function M(p){ return 'M ' + f(p[0]) + ' ' + f(p[1]); }
  function tick(a, b, n){ n = n || 1; var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], w = [-u[1], u[0]], s = ""; for(var i = 0; i < n; i++){ var o = (i - (n - 1) / 2) * 3; var c = [m[0] + u[0] * o, m[1] + u[1] * o]; s += ln([c[0] - w[0] * 4, c[1] - w[1] * 4], [c[0] + w[0] * 4, c[1] + w[1] * 4], {w: 1.1}); } return s; }
  function rightMark(at, t1, t2, s){ var u = [t1[0] - at[0], t1[1] - at[1]], v = [t2[0] - at[0], t2[1] - at[1]], lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]); u = [u[0] / lu * s, u[1] / lu * s]; v = [v[0] / lv * s, v[1] / lv * s]; return '<polyline points="' + f(at[0] + u[0]) + ',' + f(at[1] + u[1]) + ' ' + f(at[0] + u[0] + v[0]) + ',' + f(at[1] + u[1] + v[1]) + ' ' + f(at[0] + v[0]) + ',' + f(at[1] + v[1]) + '" fill="none" stroke="' + INK + '" stroke-width="1.1"/>'; }
  function sub(x, y, s){ return lab([x, y], s, 0, 0, {size: 13, bold: false}); }
  var figs = {};

  figs["6.14"] = {caption: "Fig. 6.14 (i)–(ix): shapes made of straight sides and semicircles or quarter circles; dashed lines are not part of the boundary (redrawn).", svg: function(){
    var b = "", k;
    // (i) track 80 m × 60 m, scale 1.2 px per m
    k = 1.2; var x0 = 42, y0 = 40, w = 80 * k, h = 60 * k;
    b += sub(14, 26, "(i)") + path(M([x0, y0]) + ' L ' + f(x0 + w) + ' ' + f(y0) + arc([x0 + w, y0], [x0 + w, y0 + h], h / 2, 1) + ' L ' + f(x0) + ' ' + f(y0 + h) + arc([x0, y0 + h], [x0, y0], h / 2, 1)) + ln([x0, y0], [x0, y0 + h], {dash: true, w: 1}) + ln([x0 + w, y0], [x0 + w, y0 + h], {dash: true, w: 1}) + lab([x0 + w / 2, y0 + h], "80 m", 0, -8, {size: 12, bold: false}) + lab([x0, y0 + h / 2], "60 m", 18, 4, {size: 12, bold: false});
    // (ii) arch: outer diameter 12, inner 8, 9 px per cm
    k = 9; var cx = 290, by = 100;
    b += sub(200, 26, "(ii)") + path(M([cx - 6 * k, by]) + arc([cx - 6 * k, by], [cx + 6 * k, by], 6 * k, 1) + ' L ' + f(cx + 4 * k) + ' ' + f(by) + arc([cx + 4 * k, by], [cx - 4 * k, by], 4 * k, 0) + ' Z', PEACH) + lab([cx, by], "8 cm", 0, -6, {size: 12, bold: false}) + ln([cx - 6 * k, by + 16], [cx + 6 * k, by + 16], {dash: true, w: 1}) + lab([cx, by + 30], "12 cm", 0, 0, {size: 12, bold: false});
    // (iii) square 10 with four outward semicircles, 5 px per cm
    k = 5; var sx = 480, sy = 40, s = 10 * k, r = 5 * k;
    b += sub(400, 26, "(iii)") + path(M([sx, sy]) + arc([sx, sy], [sx + s, sy], r, 1) + arc([sx + s, sy], [sx + s, sy + s], r, 1) + arc([sx + s, sy + s], [sx, sy + s], r, 1) + arc([sx, sy + s], [sx, sy], r, 1)) + poly([[sx, sy], [sx + s, sy], [sx + s, sy + s], [sx, sy + s]], "none", {dash: true, w: 1}) + lab([sx + s / 2, sy + s / 2], "10 cm", 0, 4, {size: 12, bold: false});
    // (iv) equilateral triangle 12 with outward semicircles, 6 px per cm
    k = 6; var B = [40, 290], Cc = [40 + 12 * k, 290], A = [40 + 6 * k, 290 - 6 * Math.sqrt(3) * k];
    b += sub(14, 176, "(iv)") + path(M(B) + arc(B, A, 6 * k, 1) + arc(A, Cc, 6 * k, 1) + arc(Cc, B, 6 * k, 1)) + poly([A, B, Cc], "none", {dash: true, w: 1}) + tick(A, B) + tick(A, Cc) + tick(B, Cc) + lab([A[0], B[1]], "12 cm", 0, -8, {size: 12, bold: false});
    // (v) 3 × 3 grid of 14 cm squares (only outer shape), 3 px per cm
    k = 3; var g = 14 * k, gx = 230, gy = 200;
    var P = function(i, j){ return [gx + i * g, gy + j * g]; };
    var d5 = M(P(1, 0)) + arc(P(1, 0), P(2, 0), g / 2, 1) + arc(P(2, 0), P(3, 1), g, 1) + arc(P(3, 1), P(3, 2), g / 2, 1) + arc(P(3, 2), P(2, 3), g, 1) + arc(P(2, 3), P(1, 3), g / 2, 1) + arc(P(1, 3), P(0, 2), g, 1) + arc(P(0, 2), P(0, 1), g / 2, 1) + arc(P(0, 1), P(1, 0), g, 1);
    b += sub(200, 176, "(v)") + path(d5);
    for(var i = 0; i <= 3; i++){ b += ln(P(i, i === 0 || i === 3 ? 1 : 0), P(i, i === 0 || i === 3 ? 2 : 3), {dash: true, w: 1}) + ln(P(i === 0 || i === 3 ? 1 : 0, i), P(i === 0 || i === 3 ? 2 : 3, i), {dash: true, w: 1}); }
    b += lab(P(1.5, 0.5), "14 cm", 0, 4, {size: 11, bold: false});
    // (vi) semicircle on 28 with four semicircles of diameter 7 alternately below and above, 5 px per cm
    k = 5; var vx = 420, vy = 280, q = 7 * k;
    var d6 = M([vx, vy]) + arc([vx, vy], [vx + 28 * k, vy], 14 * k, 1) + arc([vx + 28 * k, vy], [vx + 3 * q, vy], q / 2, 0) + arc([vx + 3 * q, vy], [vx + 2 * q, vy], q / 2, 1) + arc([vx + 2 * q, vy], [vx + q, vy], q / 2, 0) + arc([vx + q, vy], [vx, vy], q / 2, 1);
    b += sub(400, 176, "(vi)") + path(d6) + ln([vx, vy], [vx + 28 * k, vy], {dash: true, w: 1}) + lab([vx + 14 * k, vy + 44], "28 cm", 0, 0, {size: 12, bold: false});
    // (vii) right triangle legs 8 and 6 with outward semicircles, 7 px per cm
    k = 10; var R0 = [150, 440], L0 = [150 - 8 * k, 440], T0 = [150, 440 - 6 * k];
    b += sub(14, 350, "(vii)") + path(M(L0) + arc(L0, T0, 5 * k, 1) + arc(T0, R0, 3 * k, 1) + arc(R0, L0, 4 * k, 1)) + poly([L0, R0, T0], "none", {dash: true, w: 1}) + rightMark(R0, L0, T0, 7) + lab([150 - 4 * k, 440], "8 cm", 0, 22, {size: 12, bold: false}) + lab([150, 440 - 3 * k], "6 cm", 17, 4, {size: 12, bold: false});
    // (viii) semicircle on 12 with three inward semicircles of diameter 4, 9 px per cm
    k = 9; var ex = 230, ey = 450;
    b += sub(200, 350, "(viii)") + path(M([ex, ey]) + arc([ex, ey], [ex + 12 * k, ey], 6 * k, 1) + arc([ex + 12 * k, ey], [ex + 8 * k, ey], 2 * k, 0) + arc([ex + 8 * k, ey], [ex + 4 * k, ey], 2 * k, 0) + arc([ex + 4 * k, ey], [ex, ey], 2 * k, 0)) + ln([ex, ey], [ex + 12 * k, ey], {dash: true, w: 1});
    for(var j = 0; j < 3; j++) b += lab([ex + (2 + 4 * j) * k, ey + 18], "4 cm", 0, 0, {size: 11, bold: false});
    // (ix) semicircle on 20 above, semicircle on the right 10 below, semicircle on the left 10 above, 6 px per cm
    k = 6; var nx = 420, ny = 440;
    b += sub(400, 350, "(ix)") + path(M([nx, ny]) + arc([nx, ny], [nx + 20 * k, ny], 10 * k, 1) + arc([nx + 20 * k, ny], [nx + 10 * k, ny], 5 * k, 1) + arc([nx + 10 * k, ny], [nx, ny], 5 * k, 0)) + ln([nx, ny], [nx + 20 * k, ny], {dash: true, w: 1}) + dot([nx + 5 * k, ny]) + dot([nx + 15 * k, ny]) + lab([nx + 5 * k, ny + 48], "10 cm", 0, 0, {size: 11, bold: false}) + lab([nx + 15 * k, ny + 48], "10 cm", 0, 0, {size: 11, bold: false});
    return wrap(580, 510, b, "Nine composite shapes made of straight segments and circular arcs");
  }};

  figs["6.15"] = {caption: "Fig. 6.15A: square of side 14 cm, arcs centred at the midpoints of the sides. Fig. 6.15B: regular hexagon of side 42 cm, arcs centred at the vertices (redrawn).", svg: function(){
    var b = "", s = 150, x0 = 30, y0 = 40, h = s / 2;
    var C = [[x0, y0], [x0 + s, y0], [x0 + s, y0 + s], [x0, y0 + s]], O = [x0 + h, y0 + h];
    b += poly(C, "none", {dash: true, w: 1.2}) + lab([x0 + h, 24], "Fig. 6.15A", 0, 0, {size: 12, italic: true, bold: false});
    for(var i = 0; i < 4; i++){ b += path(M(C[i]) + arc(C[i], O, h, 1) + arc(O, C[i], h, 1), "rgba(255,255,255,0)"); }
    b += tick(C[0], C[1]) + tick(C[1], C[2]) + lab(C[1], "14 cm", 26, h, {size: 12, bold: false});
    var R = 80, H = [335, 115], V = [];
    for(var j = 0; j < 6; j++){ var a = Math.PI / 3 * j; V.push([H[0] + R * Math.cos(a), H[1] + R * Math.sin(a)]); }
    b += poly(V, "none", {dash: true, w: 1.2}) + lab([H[0], 24], "Fig. 6.15B", 0, 0, {size: 12, italic: true, bold: false});
    for(var m = 0; m < 6; m++){ b += path(M(V[m]) + arc(V[m], H, R, 0) + arc(H, V[m], R, 0)); b += dot(V[m]); }
    b += tick(V[0], V[1]) + lab(V[0], "42 cm", 24, 40, {size: 12, bold: false});
    return wrap(470, 215, b, "Four petals in a square and six petals in a regular hexagon");
  }};

  figs["6.31"] = {caption: "Fig. 6.31: Rectangle ABCD with AB = 10 cm and BC = 8 cm; E is a point on BC (redrawn).", svg: function(){
    var A = [40, 30], B = [290, 30], Cc = [290, 230], D = [40, 230], E = [290, 118];
    var b = poly([A, B, Cc, D], "none") + poly([A, D, E], BLUE) + [A, B, Cc, D, E].map(dot).join("");
    b += lab(A, "A", -12, 0) + lab(B, "B", 12, 0) + lab(Cc, "C", 12, 12) + lab(D, "D", -12, 12) + lab(E, "E", -14, -6) + lab([165, 230], "10 cm", 0, 22, {bold: false}) + lab([290, 130], "8 cm", 30, 0, {bold: false});
    return wrap(350, 270, b, "Rectangle ABCD with shaded triangle ADE");
  }};

  figs["6.32"] = {caption: "Fig. 6.32: ΔABC with median AD and a point P on AD (redrawn).", svg: function(){
    var A = [110, 25], B = [30, 230], Cc = [260, 230], D = [145, 230], P = [128, 135];
    var b = poly([A, B, P], GREEN) + poly([A, Cc, P], RED) + poly([A, B, Cc], "none") + ln(A, D) + ln(P, B) + ln(P, Cc) + tick(B, D) + tick(D, Cc) + [A, B, Cc, D, P].map(dot).join("");
    b += lab(A, "A", 0, -8) + lab(B, "B", -10, 14) + lab(Cc, "C", 10, 14) + lab(D, "D", 0, 18) + lab(P, "P", -12, -4);
    return wrap(290, 260, b, "Triangle ABC, median AD, point P on AD with triangles ABP and ACP shaded");
  }};

  figs["6.33"] = {caption: "Fig. 6.33: Square ABCD with a point P inside joined to the vertices; red ΔPAB and ΔPCD, green ΔPBC and ΔPDA (redrawn).", svg: function(){
    var A = [30, 30], D = [230, 30], Cc = [230, 230], B = [30, 230], P = [150, 95];
    var b = poly([P, A, B], RED) + poly([P, Cc, D], RED) + poly([P, B, Cc], GREEN) + poly([P, D, A], GREEN) + [A, B, Cc, D, P].map(dot).join("");
    b += lab(A, "A", -10, -6) + lab(D, "D", 10, -6) + lab(Cc, "C", 10, 16) + lab(B, "B", -10, 16) + lab(P, "P", 0, -10);
    return wrap(260, 260, b, "Square ABCD with inner point P and four coloured triangles");
  }};

  figs["6.34"] = {caption: "Fig. 6.34: ΔABC with D the midpoint of AB, P on BC and Q on AB with CQ ∥ PD (redrawn).", svg: function(){
    var A = [170, 25], B = [30, 235], Cc = [330, 235], D = [100, 130], P = [220, 235];
    var t = 0.28, Q = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
    // choose Q so that CQ ∥ PD
    var dir = [D[0] - P[0], D[1] - P[1]], ab = [B[0] - A[0], B[1] - A[1]], den = dir[0] * ab[1] - dir[1] * ab[0];
    var s = ((A[0] - Cc[0]) * ab[1] - (A[1] - Cc[1]) * ab[0]) / den; Q = [Cc[0] + dir[0] * s, Cc[1] + dir[1] * s];
    var b = poly([A, B, Cc], PEACH) + ln(D, P, {dash: true}) + ln(Q, Cc, {dash: true}) + ln(P, Q, {w: 2}) + tick(A, D) + tick(D, B) + [A, B, Cc, D, P, Q].map(dot).join("");
    b += lab(A, "A", 0, -8) + lab(B, "B", -8, 16) + lab(Cc, "C", 8, 16) + lab(D, "D", -12, 2) + lab(P, "P", 0, 18) + lab(Q, "Q", -12, -2);
    return wrap(360, 260, b, "Triangle ABC with midpoint D, point P on BC, point Q on AB and segments PD, CQ, PQ");
  }};

  figs["6.41"] = {caption: "Fig. 6.41: Area model of (a + b)² = a² + 2ab + b² (redrawn).", svg: function(){
    var a = 120, bb = 70, x = 40, y = 30, fill = ["#fde68a", "#f3e8ff", "#f3e8ff", "#bfdbfe"];
    var b = '<rect x="' + x + '" y="' + y + '" width="' + a + '" height="' + a + '" fill="' + fill[0] + '" stroke="' + INK + '" stroke-width="1.5"/>' + '<rect x="' + (x + a) + '" y="' + y + '" width="' + bb + '" height="' + a + '" fill="' + fill[1] + '" stroke="' + INK + '" stroke-width="1.5"/>' + '<rect x="' + x + '" y="' + (y + a) + '" width="' + a + '" height="' + bb + '" fill="' + fill[2] + '" stroke="' + INK + '" stroke-width="1.5"/>' + '<rect x="' + (x + a) + '" y="' + (y + a) + '" width="' + bb + '" height="' + bb + '" fill="' + fill[3] + '" stroke="' + INK + '" stroke-width="1.5"/>';
    b += lab([x + a / 2, y + a / 2], "a²", 0, 5) + lab([x + a + bb / 2, y + a / 2], "ab", 0, 5) + lab([x + a / 2, y + a + bb / 2], "ab", 0, 5) + lab([x + a + bb / 2, y + a + bb / 2], "b²", 0, 5);
    b += lab([x + a / 2, y], "a", 0, -8, {italic: true}) + lab([x + a + bb / 2, y], "b", 0, -8, {italic: true}) + lab([x, y + a / 2], "a", -12, 5, {italic: true}) + lab([x, y + a + bb / 2], "b", -12, 5, {italic: true});
    return wrap(260, 240, b, "Square of side a plus b split into a squared, two ab rectangles and b squared");
  }};

  figs["6.42"] = {caption: "Fig. 6.42: Trapezium with parallel sides a and b and height h, split into a parallelogram and a triangle (redrawn).", svg: function(){
    var P1 = [30, 190], P2 = [140, 190], P3 = [250, 190], T1 = [85, 45], T2 = [195, 45];
    var b = poly([P1, P2, T2, T1], "rgba(167,139,250,0.35)") + poly([P2, P3, T2], PINK) + [P1, P2, P3, T1, T2].map(dot).join("");
    b += lab([140, 45], "a", 0, -8, {italic: true}) + ln([30, 212], [250, 212], {w: 1.2}) + lab([140, 212], "b", 0, 18, {italic: true}) + ln([280, 45], [280, 190], {w: 1.2}) + lab([280, 118], "h", 12, 4, {italic: true});
    return wrap(310, 240, b, "Trapezium split into a parallelogram with top side a and a triangle, with bottom side b and height h");
  }};

  figs["6.43"] = {caption: "Fig. 6.43: what fraction of the triangle is shaded? (one side bisected, one side trisected). Fig. 6.44: what fraction of the square is shaded? (each vertex joined to the midpoint of an opposite side). Redrawn from the PDF’s vector drawing.", svg: function(){
    var m = function(p){ return [20 + (p[0] - 105) * 1.5, 20 + (p[1] - 172) * 1.5]; };
    var B = m([108.2, 260.2]), T = m([135.8, 177.6]), R = m([259.1, 260.1]);
    var Mi = [(B[0] + T[0]) / 2, (B[1] + T[1]) / 2], P1 = [T[0] + (R[0] - T[0]) / 3, T[1] + (R[1] - T[1]) / 3], P2 = [T[0] + (R[0] - T[0]) * 2 / 3, T[1] + (R[1] - T[1]) * 2 / 3];
    var b = poly([B, Mi, P1, P2], BLUE) + poly([B, T, R], "none") + tick(B, Mi, 3) + tick(Mi, T, 3) + tick(T, P1, 2) + tick(P1, P2, 2) + tick(P2, R, 2) + [B, T, R, Mi, P1, P2].map(dot).join("");
    b += lab([130, 170], "Fig. 6.43", 0, 0, {size: 12, italic: true, bold: false});
    var x0 = 300, y0 = 20, s = 140, sq = function(u, v){ return [x0 + u * s / 2, y0 + v * s / 2]; };
    var lines = [[[0, 0], [1, 2]], [[0, 2], [2, 1]], [[2, 2], [1, 0]], [[2, 0], [0, 1]]];
    function meet(l1, l2){ var p = l1[0], r = [l1[1][0] - p[0], l1[1][1] - p[1]], q = l2[0], t = [l2[1][0] - q[0], l2[1][1] - q[1]]; var den = r[0] * t[1] - r[1] * t[0], u = ((q[0] - p[0]) * t[1] - (q[1] - p[1]) * t[0]) / den; return [p[0] + r[0] * u, p[1] + r[1] * u]; }
    var inner = [meet(lines[0], lines[3]), meet(lines[0], lines[1]), meet(lines[1], lines[2]), meet(lines[2], lines[3])].map(function(p){ return sq(p[0], p[1]); });
    b += poly(inner, BLUE) + poly([sq(0, 0), sq(2, 0), sq(2, 2), sq(0, 2)], "none");
    lines.forEach(function(l){ b += ln(sq(l[0][0], l[0][1]), sq(l[1][0], l[1][1]), {w: 1.2}); });
    b += tick(sq(0, 0), sq(1, 0), 2) + tick(sq(1, 0), sq(2, 0), 2) + tick(sq(0, 2), sq(1, 2), 2) + tick(sq(1, 2), sq(2, 2), 2) + tick(sq(0, 0), sq(0, 1), 2) + tick(sq(0, 1), sq(0, 2), 2) + tick(sq(2, 0), sq(2, 1), 2) + tick(sq(2, 1), sq(2, 2), 2);
    b += lab([x0 + s / 2, 185], "Fig. 6.44", 0, 0, {size: 12, italic: true, bold: false});
    return wrap(470, 200, b, "A triangle with a shaded quadrilateral, and a square with a shaded inner square");
  }};

  figs["6.45"] = {caption: "Fig. 6.45: three equal circles fitted in a rectangle. Fig. 6.46: four equal circles fitted in a rectangle (redrawn).", svg: function(){
    var b = "", d = 64;
    function row(n, x0, y0, fill, stroke){ var s = '<rect x="' + x0 + '" y="' + y0 + '" width="' + n * d + '" height="' + d + '" fill="#fde2cc" stroke="' + INK + '" stroke-width="1.5"/>'; for(var i = 0; i < n; i++) s += '<circle cx="' + (x0 + d / 2 + i * d) + '" cy="' + (y0 + d / 2) + '" r="' + d / 2 + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4"/>'; return s; }
    b += row(3, 20, 20, "rgba(167,139,250,0.55)", "#6d28d9") + lab([20 + 1.5 * d, 20 + d], "Fig. 6.45", 0, 22, {size: 12, italic: true, bold: false});
    b += row(4, 250, 20, "rgba(244,114,94,0.45)", "#dc2626") + lab([250 + 2 * d, 20 + d], "Fig. 6.46", 0, 22, {size: 12, italic: true, bold: false});
    return wrap(530, 120, b, "Three circles in a rectangle and four circles in a rectangle");
  }};

  figs["6.47"] = {caption: "Fig. 6.47: nine identical rectangles, 4 lying flat above 5 standing up, forming a large rectangle (redrawn to the proportions 4L = 5W).", svg: function(){
    var u = 14, L = 5 * u, W = 4 * u, x0 = 20, y0 = 20, b = "";
    for(var i = 0; i < 4; i++) b += '<rect x="' + (x0 + i * L) + '" y="' + y0 + '" width="' + L + '" height="' + W + '" fill="#f5cdbf" stroke="' + INK + '" stroke-width="1.2"/>';
    for(var j = 0; j < 5; j++) b += '<rect x="' + (x0 + j * W) + '" y="' + (y0 + W) + '" width="' + W + '" height="' + L + '" fill="#f5cdbf" stroke="' + INK + '" stroke-width="1.2"/>';
    b += '<rect x="' + x0 + '" y="' + y0 + '" width="' + 4 * L + '" height="' + (L + W) + '" fill="none" stroke="#ea580c" stroke-width="2.5"/>';
    return wrap(4 * L + 40, L + W + 40, b, "Nine identical rectangles in two rows forming a large rectangle");
  }};

  figs["6.48"] = {caption: "Fig. 6.48: lines from a vertex to the points of trisection of the opposite side; the first third is shaded blue and the last third red (redrawn).", svg: function(){
    var A = [70, 20], B = [20, 180], Cc = [320, 180], T1 = [120, 180], T2 = [220, 180];
    var b = poly([A, B, T1], BLUE) + poly([A, T2, Cc], RED) + poly([A, B, Cc], "none") + ln(A, T1) + ln(A, T2) + [B, T1, T2, Cc].map(dot).join("") + tick(B, T1) + tick(T1, T2) + tick(T2, Cc);
    return wrap(340, 200, b, "Triangle with two lines from the apex to the trisection points of the base");
  }};

  figs["6.49"] = {caption: "Fig. 6.49: a quarter circle in a square (centre at the bottom-left vertex) and semicircles on the left and bottom sides; A is orange and B is blue (redrawn).", svg: function(){
    var a = 90, x0 = 20, y0 = 20, TL = [x0, y0], BL = [x0, y0 + 2 * a], BR = [x0 + 2 * a, y0 + 2 * a], mid = [x0 + a, y0 + a];
    var b = poly([TL, [x0 + 2 * a, y0], BR, BL], "none");
    b += path(M(BL) + ' L ' + f(TL[0]) + ' ' + f(TL[1]) + arc(TL, BR, 2 * a, 1) + ' Z', BLUE, {w: 0.1});
    b += path(M(TL) + arc(TL, BL, a, 1) + ' Z', "#fff", {w: 0.1}) + path(M(BL) + arc(BL, BR, a, 1) + ' Z', "#fff", {w: 0.1});
    b += path(M(BL) + arc(BL, mid, a, 1) + arc(mid, BL, a, 1) + ' Z', "rgba(249,115,22,0.85)", {w: 0.1});
    b += path(M(TL) + arc(TL, BR, 2 * a, 1)) + path(M(TL) + arc(TL, BL, a, 1)) + path(M(BL) + arc(BL, BR, a, 1));
    b += lab([x0 + 1.25 * a, y0 + 0.55 * a], "B", 0, 0, {size: 12}) + lab([x0 + 0.42 * a, y0 + 1.58 * a], "A", 0, 5, {size: 12});
    return wrap(2 * a + 40, 2 * a + 40, b, "Square with a quarter circle and two semicircles creating regions A and B");
  }};

  figs["6.50"] = {caption: "Fig. 6.50: four semicircles centred at the midpoints of the sides of a square of side 2 units form a 4-petalled flower (redrawn).", svg: function(){
    var s = 180, x0 = 30, y0 = 25, h = s / 2, C = [[x0, y0], [x0 + s, y0], [x0 + s, y0 + s], [x0, y0 + s]], O = [x0 + h, y0 + h], b = poly(C, "rgba(244,114,182,0.18)");
    for(var i = 0; i < 4; i++) b += path(M(C[i]) + arc(C[i], O, h, 1) + arc(O, C[i], h, 1) + ' Z', "rgba(79,70,229,0.75)", {w: 1});
    b += lab([x0 + h, y0], "2", 0, -8, {size: 12, bold: false}) + lab([x0 + s, y0 + h], "2", 12, 4, {size: 12, bold: false});
    return wrap(s + 60, s + 50, b, "Square of side 2 with four blue petals from the corners to the centre");
  }};

  figs["6.51"] = {caption: "Fig. 6.51: two concentric circles with centre O; the chord BC of the larger circle touches the smaller circle at A, and BC = l (redrawn).", svg: function(){
    var O = [150, 150], r = 70, R = 115, hb = Math.sqrt(R * R - r * r), A = [O[0], O[1] - r], B = [O[0] - hb, O[1] - r], Cc = [O[0] + hb, O[1] - r];
    var b = '<circle cx="' + O[0] + '" cy="' + O[1] + '" r="' + (R + r) / 2 + '" fill="none" stroke="rgba(74,160,90,0.6)" stroke-width="' + (R - r) + '"/>' + '<circle cx="' + O[0] + '" cy="' + O[1] + '" r="' + R + '" fill="none" stroke="' + INK + '" stroke-width="1.6"/>' + '<circle cx="' + O[0] + '" cy="' + O[1] + '" r="' + r + '" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/>';
    b += ln(B, Cc) + ln(O, A, {dash: true, w: 1.1}) + rightMark(A, Cc, O, 7) + [O, A, B, Cc].map(dot).join("") + lab(O, "O", 0, 18) + lab(A, "A", 8, 16) + lab(B, "B", -10, -6) + lab(Cc, "C", 10, -6) + lab([O[0] - 30, O[1] - r], "BC = l", 0, -8, {size: 12, italic: true, bold: false});
    return wrap(300, 290, b, "Ring between two concentric circles with a chord of the outer circle touching the inner circle");
  }};

  figs["6.52"] = {caption: "Fig. 6.52: semicircles on the three sides of a right-angled triangle C; the semicircle on the hypotenuse passes through the right angle, leaving the lunes A and B (redrawn).", svg: function(){
    var RA = [110, 150], T = [110, 50], Rr = [290, 150], hyp = Math.hypot(Rr[0] - T[0], Rr[1] - T[1]);
    var b = '<rect x="10" y="10" width="330" height="250" fill="rgba(244,114,182,0.15)"/>', G = "rgba(74,160,90,0.55)", PK = "#f9e3ee";
    b += path(M(T) + arc(T, RA, 50, 0) + ' Z', G, {w: 0.1}) + path(M(RA) + arc(RA, Rr, 90, 0) + ' Z', G, {w: 0.1});
    b += path(M(T) + arc(T, Rr, hyp / 2, 0) + ' Z', PK, {w: 0.1}) + poly([T, RA, Rr], G, {w: 0.1});
    b += path(M(T) + arc(T, RA, 50, 0)) + path(M(RA) + arc(RA, Rr, 90, 0)) + path(M(T) + arc(T, Rr, hyp / 2, 0), "none", {w: 1.3}) + poly([T, RA, Rr], "none") + rightMark(RA, T, Rr, 8);
    b += lab([72, 104], "A", 0, 0, {size: 12}) + lab([200, 225], "B", 0, 0, {size: 12}) + lab([150, 125], "C", 0, 0, {size: 12});
    return wrap(350, 270, b, "Right triangle C with lunes A and B formed by semicircles on its sides");
  }};

  figs["6.53"] = {caption: "Fig. 6.53: two congruent circles of radius r, each passing through the other’s centre (A and B); the common region CD is shaded (redrawn).", svg: function(){
    var r = 80, A = [130, 110], B = [210, 110], hh = Math.sqrt(3) / 2 * r, Cc = [170, 110 - hh], D = [170, 110 + hh];
    var b = path(M(Cc) + arc(Cc, D, r, 1) + arc(D, Cc, r, 1) + ' Z', "rgba(220,38,38,0.85)", {w: 1});
    b += '<circle cx="' + A[0] + '" cy="' + A[1] + '" r="' + r + '" fill="none" stroke="#dc2626" stroke-width="1.4"/><circle cx="' + B[0] + '" cy="' + B[1] + '" r="' + r + '" fill="none" stroke="#dc2626" stroke-width="1.4"/>';
    b += ln(Cc, D, {w: 1, c: "#fff"}) + [A, B, Cc, D].map(dot).join("") + lab(A, "A", -12, 4) + lab(B, "B", 12, 4) + lab(Cc, "C", 0, -8) + lab(D, "D", 0, 18);
    return wrap(340, 225, b, "Two intersecting circles through each other's centres with the shared region shaded");
  }};

  figs["6.54"] = {caption: "Fig. 6.54: three triangles A, B, C inside a rectangle; C is right-angled, with its apex on the top side and a vertex on the right side (redrawn from the PDF’s vector drawing).", svg: function(){
    var m = function(p){ return [20 + (p[0] - 250.1) * 2, 20 + (p[1] - 317.8) * 2]; };
    var O = m([250.1, 399.7]), P = m([353.1, 317.8]), R = m([353.1, 358.6]), Q = m([414.6, 358.6]), TR = m([414.6, 317.8]), TL = m([250.1, 317.8]), BR = m([414.6, 399.7]);
    var b = poly([TL, TR, BR, O], "#f6ead0") + poly([O, P, R], "rgba(120,140,215,0.8)") + poly([O, R, Q], "rgba(140,200,130,0.85)") + poly([P, R, Q], "rgba(245,180,210,0.9)") + rightMark(R, P, Q, 7);
    b += lab([0.35 * O[0] + 0.45 * P[0] + 0.2 * R[0], 0.35 * O[1] + 0.45 * P[1] + 0.2 * R[1]], "A", 0, 5, {italic: true}) + lab([(O[0] + R[0] + Q[0]) / 3 + 20, (O[1] + R[1] + Q[1]) / 3 + 4], "B", 0, 5, {italic: true}) + lab([(P[0] + R[0] + Q[0]) / 3, (P[1] + R[1] + Q[1]) / 3], "C", 0, 5, {italic: true});
    return wrap(370, 205, b, "Rectangle containing three triangles A, B and C");
  }};

  figs["6.55"] = {caption: "Fig. 6.55: semicircle on AC with centre O, OB ⊥ AC; quarter circle AFB, semicircle AEB on AB (centre D), and ΔAOB. The two shaded regions are the lune AEBF and ΔAOB (redrawn).", svg: function(){
    var r = 130, O = [190, 175], A = [O[0] - r, O[1]], B = [O[0], O[1] - r], Cc = [O[0] + r, O[1]], D = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], ab = Math.hypot(B[0] - A[0], B[1] - A[1]);
    var b = '<defs><pattern id="hatch655" width="6" height="4" patternUnits="userSpaceOnUse"><line x1="0" y1="2" x2="6" y2="2" stroke="#6b7280" stroke-width="0.8"/></pattern></defs>';
    b += path(M(A) + arc(A, B, ab / 2, 1) + arc(B, A, r, 0) + ' Z', "url(#hatch655) #e5e7eb", {w: 1.4}) + poly([A, O, B], "url(#hatch655) #e5e7eb", {w: 1.4});
    b += path(M(A) + arc(A, Cc, r, 1)) + ln(A, Cc, {w: 1.4}) + [A, O, B, Cc, D].map(dot).join("");
    var E = [D[0] - ab / 2 * Math.SQRT1_2, D[1] - ab / 2 * Math.SQRT1_2], Fp = [O[0] - r * Math.SQRT1_2, O[1] - r * Math.SQRT1_2];
    b += lab(A, "A", 0, 18, {italic: true}) + lab(O, "O", 0, 18, {italic: true}) + lab(Cc, "C", 0, 18, {italic: true}) + lab(B, "B", 8, -8, {italic: true}) + lab(D, "D", 14, 12, {italic: true}) + lab(E, "E", -10, -6, {italic: true}) + lab(Fp, "F", 10, 10, {italic: true});
    return wrap(360, 205, b, "Quarter circle, semicircle on the chord AB and the triangle AOB with two hatched regions");
  }};
  return figs;
})();
