// Textbook figures used by iemh105 exercises, redrawn as SVG. Figs. 5.15 and 5.19 use point positions read from the PDF’s vector drawing.
window.FIGURES = (function(){
  var INK = "#1f2937";
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(a, b, o){ o = o || {}; return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="' + (o.c || INK) + '" stroke-width="' + (o.w || 1.6) + '"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + '/>'; }
  function dot(p){ return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.2" fill="' + INK + '"/>'; }
  function lab(p, s, dx, dy, o){ o = o || {}; return '<text x="' + (p[0] + dx).toFixed(1) + '" y="' + (p[1] + dy).toFixed(1) + '" font-size="' + (o.size || 14) + '" font-style="' + (o.italic ? 'italic' : 'normal') + '" font-weight="700" fill="' + (o.c || INK) + '" text-anchor="middle">' + s + '</text>'; }
  function circle(c, r){ return '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="' + r.toFixed(1) + '" fill="none" stroke="' + INK + '" stroke-width="1.8"/>'; }
  function rightMark(at, toward1, toward2, s){
    var u = norm([toward1[0] - at[0], toward1[1] - at[1]]), v = norm([toward2[0] - at[0], toward2[1] - at[1]]);
    var p1 = [at[0] + u[0] * s, at[1] + u[1] * s], p2 = [p1[0] + v[0] * s, p1[1] + v[1] * s], p3 = [at[0] + v[0] * s, at[1] + v[1] * s];
    return '<polyline points="' + [p1, p2, p3].map(function(p){ return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="none" stroke="' + INK + '" stroke-width="1.2"/>';
  }
  function norm(v){ var l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; }
  function tick(a, b){ var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], u = norm([b[0] - a[0], b[1] - a[1]]), n = [-u[1], u[0]], s = ""; [-2.5, 2.5].forEach(function(o){ var c = [m[0] + u[0] * o, m[1] + u[1] * o]; s += ln([c[0] - n[0] * 5, c[1] - n[1] * 5], [c[0] + n[0] * 5, c[1] + n[1] * 5], {w: 1.2}); }); return s; }
  function arcMark(at, p, q, r){ var a1 = Math.atan2(p[1] - at[1], p[0] - at[0]), a2 = Math.atan2(q[1] - at[1], q[0] - at[0]); var d = a2 - a1; while(d > Math.PI) d -= 2 * Math.PI; while(d < -Math.PI) d += 2 * Math.PI; var s = [at[0] + r * Math.cos(a1), at[1] + r * Math.sin(a1)], e = [at[0] + r * Math.cos(a1 + d), at[1] + r * Math.sin(a1 + d)]; return '<path d="M ' + s[0].toFixed(1) + ' ' + s[1].toFixed(1) + ' A ' + r + ' ' + r + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1) + '" fill="none" stroke="' + INK + '" stroke-width="1.2"/>'; }
  // Map PDF coordinates (centre cx, cy) to an SVG canvas of size W × H with scale k.
  function mapper(cx, cy, k, W, H){ return function(x, y){ return [W / 2 + (x - cx) * k, H / 2 + (y - cy) * k]; }; }
  function onCircle(c, r, deg){ return [c[0] + r * Math.cos(deg * Math.PI / 180), c[1] - r * Math.sin(deg * Math.PI / 180)]; }
  var figs = {};
  figs["5.12"] = {caption: "Fig. 5.12: Circle with centre C, chord AB and its midpoint M (redrawn).", svg: function(){
    var W = 280, H = 260, c = [140, 120], r = 100, A = onCircle(c, r, 205), B = onCircle(c, r, 335), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    var b = circle(c, r) + ln(A, B) + ln(c, M) + ln(c, A, {dash: true}) + ln(c, B, {dash: true}) + rightMark(M, B, c, 9) + [A, B, M, c].map(dot).join("");
    b += lab(A, "A", -12, 10) + lab(B, "B", 12, 10) + lab(M, "M", 0, 20) + lab(c, "C", 0, -10);
    return wrap(W, H, b, "Circle with centre C, chord AB and midpoint M joined to C");
  }};
  figs["5.15"] = {caption: "Fig. 5.15: Chords AB and FG of a circle with centre C; CE ⊥ AB and CH ⊥ FG (redrawn).", svg: function(){
    var W = 320, H = 320, M = mapper(368.2, 324.2, 2.35, W, H), Cc = M(368.2, 324.2), r = 58.6 * 2.35;
    var A = M(405.1, 279.0), B = M(328.6, 281.2), G = M(314.4, 302.0), F = M(353.4, 380.6), E = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], Hh = [(G[0] + F[0]) / 2, (G[1] + F[1]) / 2];
    var b = circle(Cc, r) + ln(A, B) + ln(G, F) + ln(Cc, E) + ln(Cc, Hh) + ln(Cc, A, {dash: true}) + ln(Cc, F, {dash: true});
    b += rightMark(E, A, Cc, 9) + rightMark(Hh, G, Cc, 9);
    [A, B, G, F, E, Hh, Cc].forEach(function(p){ b += dot(p); });
    b += lab(A, "A", 12, -6) + lab(B, "B", -12, -6) + lab(E, "E", 0, -10) + lab(G, "G", -13, 2) + lab(F, "F", -4, 18) + lab(Hh, "H", -14, 8) + lab(Cc, "C", 14, 4);
    return wrap(W, H, b, "Circle with centre C, chords AB and FG, perpendiculars CE and CH");
  }};
  figs["5.19"] = {caption: "Fig. 5.19: Points A, K, B, C, L and D on a circle with centre O (redrawn to the book’s positions).", svg: function(){
    var W = 320, H = 320, M = mapper(342.0, 156.2, 2.05, W, H), O = M(342.0, 156.2), r = 67.9 * 2.05;
    var P = {A: M(303.5, 212.3), K: M(274.2, 157.1), B: M(293.6, 108.4), C: M(314.6, 94.0), L: M(401.7, 123.9), D: M(343.3, 224.5)};
    var b = circle(O, r) + ln(O, P.A) + ln(O, P.B) + ln(O, P.C) + ln(O, P.D) + dot(O) + lab(O, "O", 13, 5);
    var off = {A: [-10, 16], K: [-14, 4], B: [-12, -8], C: [-4, -12], L: [12, -6], D: [4, 18]};
    Object.keys(P).forEach(function(k){ b += dot(P[k]) + lab(P[k], k, off[k][0], off[k][1]); });
    return wrap(W, H, b, "Circle with centre O and points A, K, B, C, L, D; radii to A, B, C and D");
  }};
  figs["5.26"] = {caption: "Fig. 5.26: Cyclic quadrilateral ABCD with ∠D = 100° and ∠B = x (redrawn).", svg: function(){
    var W = 300, H = 280, c = [150, 140], r = 110, A = onCircle(c, r, 170), D = onCircle(c, r, 80), Cc = onCircle(c, r, 10), B = onCircle(c, r, 280);
    var b = circle(c, r) + ln(A, D) + ln(D, Cc) + ln(Cc, B) + ln(B, A) + [A, B, Cc, D].map(dot).join("");
    b += arcMark(D, A, Cc, 18) + arcMark(B, A, Cc, 16) + lab(D, "100°", 0, 34, {size: 12}) + lab(B, "x", 0, -24, {size: 13, italic: true});
    b += lab(A, "A", -14, 4) + lab(D, "D", 0, -10) + lab(Cc, "C", 14, 4) + lab(B, "B", 0, 20);
    return wrap(W, H, b, "Cyclic quadrilateral ABCD; angle D is 100 degrees and angle B is x");
  }};
  figs["5.30"] = {caption: "Fig. 5.30: A semicircle with centre O; A is on the arc, with the base angles a and b (redrawn).", svg: function(){
    var W = 340, H = 210, O = [170, 180], R = 150, P = [O[0] - R, O[1]], Q = [O[0] + R, O[1]], A = onCircle(O, R, 58);
    var b = '<path d="M ' + P[0] + ' ' + P[1] + ' A ' + R + ' ' + R + ' 0 0 1 ' + Q[0] + ' ' + Q[1] + '" fill="none" stroke="' + INK + '" stroke-width="1.8"/>';
    b += '<polygon points="' + [P, A, Q].map(function(p){ return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="rgba(251,191,140,0.35)" stroke="' + INK + '" stroke-width="1.6"/>';
    b += ln(O, A, {dash: true}) + tick(P, O) + tick(O, Q) + tick(O, A) + [P, Q, A, O].map(dot).join("");
    b += arcMark(P, Q, A, 26) + arcMark(Q, A, P, 26) + lab(P, "a", 34, -6, {size: 13, italic: true}) + lab(Q, "b", -34, -6, {size: 13, italic: true}) + lab(A, "A", 6, -10) + lab(O, "O", 0, 20);
    return wrap(W, H, b, "Semicircle with diameter endpoints, centre O, point A on the arc and angles a and b");
  }};
  figs["5.31"] = {caption: "Fig. 5.31: Cyclic quadrilateral ABCD with centre O joined to the vertices; p, q, u and v mark base angles of the isosceles triangles (redrawn).", svg: function(){
    var W = 300, H = 300, O = [150, 150], R = 120, A = onCircle(O, R, 112), D = onCircle(O, R, 22), Cc = onCircle(O, R, -24), B = onCircle(O, R, 205);
    var b = circle(O, R) + '<polygon points="' + [A, D, Cc, B].map(function(p){ return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="rgba(251,191,140,0.35)" stroke="' + INK + '" stroke-width="1.6"/>';
    b += ln(O, A) + ln(O, B) + ln(O, Cc) + ln(O, D) + tick(O, A) + tick(O, B) + tick(O, Cc) + tick(O, D) + [A, B, Cc, D, O].map(dot).join("");
    b += arcMark(A, B, O, 20) + arcMark(B, O, Cc, 20) + arcMark(Cc, O, D, 20) + arcMark(D, A, O, 20);
    function inside(v, p, q){ var u1 = norm([p[0] - v[0], p[1] - v[1]]), u2 = norm([q[0] - v[0], q[1] - v[1]]), m = norm([u1[0] + u2[0], u1[1] + u2[1]]); return [v[0] + m[0] * 32, v[1] + m[1] * 32]; }
    var pp = inside(A, B, O), qq = inside(B, O, Cc), uu = inside(Cc, O, D), vv = inside(D, A, O);
    b += lab(pp, "p", 0, 5, {size: 13, italic: true}) + lab(qq, "q", 0, 5, {size: 13, italic: true}) + lab(uu, "u", 0, 5, {size: 13, italic: true}) + lab(vv, "v", 0, 5, {size: 13, italic: true});
    b += lab(A, "A", -6, -10) + lab(D, "D", 14, -4) + lab(Cc, "C", 12, 14) + lab(B, "B", -14, 8) + lab(O, "O", 0, 20);
    return wrap(W, H, b, "Cyclic quadrilateral ABCD with centre O and radii to the four vertices");
  }};
  return figs;
})();
