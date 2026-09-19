// iemh105 labs: I’m Up and Down, and Round and Round (circles).
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function nM5(v, d){ var L = window.LAB; if(d !== undefined) return L.num(v, d); var a = Math.abs(v); if(Math.abs(a - Math.round(a)) < 1e-6) return L.num(v, 0); if(Math.abs(a * 10 - Math.round(a * 10)) < 1e-6) return L.num(v, 1); return L.num(v, 2); }
function clampM5(x, a, b){ return Math.max(a, Math.min(b, x)); }
var DEG5 = Math.PI / 180;
// Geometry in units; S(o) maps a unit point to pixels with origin (ox, oy) and scale k.
function viewM5(ox, oy, k){ return function(p){ return [ox + p[0] * k, oy - p[1] * k]; }; }
function onM5(r, deg){ return [r * Math.cos(deg * DEG5), r * Math.sin(deg * DEG5)]; }
function segM5(L, V, a, b, col, w, dash){ var A = V(a), B = V(b); return L.line(A[0], A[1], B[0], B[1], col, w || 2, dash); }
function dotM5(L, V, p, col, lab, dx, dy){ var P = V(p); return L.circle(P[0], P[1], 4.5, col) + (lab ? L.text(P[0] + (dx === undefined ? 8 : dx), P[1] + (dy === undefined ? -8 : dy), lab, {size: 13, color: col, weight: 700, anchor: "middle"}) : ""); }
function circM5(L, V, c, r, k, col, fill){ var P = V(c); return L.circle(P[0], P[1], r * k, fill || "none", ' stroke="' + (col || L.C.text) + '" stroke-width="2"'); }
function angM5(v, a, b){ var x1 = a[0] - v[0], y1 = a[1] - v[1], x2 = b[0] - v[0], y2 = b[1] - v[1]; return Math.acos(clampM5((x1 * x2 + y1 * y2) / (Math.hypot(x1, y1) * Math.hypot(x2, y2)), -1, 1)) / DEG5; }
function sliderSetM5(L, st, defs){
  L.controls(defs.map(function(d){ return L.slider(d[0], d[1], d[2], d[3], d[4], st[d[5]], nM5(st[d[5]])); }).join(""));
  defs.forEach(function(d){ L.onInput(d[0], function(v){ st[d[5]] = v; L.setVal(d[0], nM5(v)); App.resetTimeline(); App.play(); }); });
}
function rightMarkM5(L, V, at, u1, u2, s){ var p1 = [at[0] + u1[0] * s, at[1] + u1[1] * s], p2 = [p1[0] + u2[0] * s, p1[1] + u2[1] * s], p3 = [at[0] + u2[0] * s, at[1] + u2[1] * s]; var A = V(p1), B = V(p2), C = V(p3); return '<polyline points="' + A.join(",") + ' ' + B.join(",") + ' ' + C.join(",") + '" fill="none" stroke="' + L.C.muted + '" stroke-width="1.5"/>'; }

// Lab 1 — What is a circle? Locus, symmetry and the centre (§5.1–5.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "locus"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend({locus: [[C.path, "points at distance r"], [C.text, "centre"]], rotate: [[C.vel, "wheel"], [C.path, "a marked chord"]], fold: [[C.danger, "fold line"]], centre: [[C.danger, "first crease"], [C.vel, "second crease"]]}[id]);
    L.watch({locus: "§5.1: mark points that are exactly r from the centre, one after another.", rotate: "§5.2: turn a wheel. Can you tell that it has moved?", fold: "§5.2: fold the circle so its edges match. Where do the creases go?", centre: "Think and Reflect: Jamuna finds the centre of a paper circle with two folds."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var V = viewM5(360, 150, 1), R = 115, m = "", msg, id = st.preset, f = clampM5(t / 4, 0, 1);
    if(id === "locus"){
      var n = Math.floor(f * 48 + 1e-9);
      for(var i = 0; i < n; i++){ var p = onM5(R, i * 7.5); m += L.circle(V(p)[0], V(p)[1], 4, C.path); }
      m += L.circle(360, 150, 5, C.text) + L.text(372, 146, "C", {size: 13, color: C.text, weight: 700}) + (n > 0 ? L.line(360, 150, V(onM5(R, (n - 1) * 7.5))[0], V(onM5(R, (n - 1) * 7.5))[1], C.muted, 1.5, "5 4") : "");
      L.svg(m, "Points at a fixed distance from a centre", 300);
      L.readout([["Points marked", String(n), C.path], ["Distance from C", "r for every point"]]);
      msg = t < 4 ? "Marking points…" : "Every point at distance r from C lies on the circle: the circle is the <b>locus</b> of such points.";
    } else if(id === "rotate"){
      var a = 360 * f;
      m += L.circle(360, 150, R, "rgba(56,189,248,0.10)", ' stroke="' + C.vel + '" stroke-width="3"');
      var p1 = onM5(R, 20 + a), p2 = onM5(R, 110 + a);
      m += L.line(V(p1)[0], V(p1)[1], V(p2)[0], V(p2)[1], C.path, 3) + L.line(360, 150, V(p1)[0], V(p1)[1], C.muted, 1) + L.line(360, 150, V(p2)[0], V(p2)[1], C.muted, 1) + L.circle(360, 150, 5, C.text);
      L.svg(m, "A turning wheel", 300);
      L.readout([["Turned through", L.num(a, 0) + "°"], ["Circle", "unchanged"], ["Chord length", "unchanged", C.path]]);
      msg = t < 4 ? "Turning…" : "Turned through any angle, the circle looks exactly the same: it has <b>complete rotational symmetry</b>.";
    } else if(id === "fold"){
      m += L.circle(360, 150, R, "rgba(148,163,184,0.08)", ' stroke="' + C.text + '" stroke-width="2"');
      var k = Math.floor(f * 6 + 1e-9);
      for(var j = 0; j <= k && j < 6; j++){ var q = onM5(R + 15, j * 30); m += L.line(V([-q[0], -q[1]])[0], V([-q[0], -q[1]])[1], V(q)[0], V(q)[1], C.danger, 2, "6 4"); }
      m += L.circle(360, 150, 5, C.text);
      L.svg(m, "Fold lines of a circle", 300);
      L.readout([["Creases drawn", String(Math.min(6, k + 1)), C.danger], ["Each passes through", "the centre"]]);
      msg = t < 4 ? "Folding…" : "Every crease that matches the edges passes through the centre: <b>every diameter is a line of symmetry</b>.";
    } else {
      m += L.circle(360, 150, R, "rgba(251,191,140,0.18)", ' stroke="' + C.text + '" stroke-width="2"');
      var c1 = onM5(R + 10, 25), c2 = onM5(R + 10, 115);
      if(t >= 0.5) m += L.line(V([-c1[0], -c1[1]])[0], V([-c1[0], -c1[1]])[1], V(c1)[0], V(c1)[1], C.danger, 2.5, "6 4");
      if(t >= 2) m += L.line(V([-c2[0], -c2[1]])[0], V([-c2[0], -c2[1]])[1], V(c2)[0], V(c2)[1], C.vel, 2.5, "6 4");
      if(t >= 3) m += L.circle(360, 150, 7, C.ok) + L.text(376, 170, "centre", {size: 13, color: C.ok, weight: 700});
      L.svg(m, "Finding the centre by folding", 300);
      L.readout([["Fold 1", t >= 0.5 ? "a diameter" : "…", C.danger], ["Fold 2", t >= 2 ? "another diameter" : "…", C.vel], ["They meet at", t >= 3 ? "the centre" : "…", C.ok]]);
      msg = t < 4 ? "Folding twice…" : "Two different creases are two diameters, and they cross at the centre.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["locus", "§5.1: the locus"], ["rotate", "Rotational symmetry"], ["fold", "Reflection symmetry"], ["centre", "Jamuna’s centre"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.circle = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Circles through two points; the circumcircle (§5.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "twopts"};
  var T = {acute: [[-3, -2], [3, -2], [0.8, 3]], obtuse: [[-4, -1], [4, -1], [-2.5, 0.8]], right: [[-3, -2], [3, -2], [0, 1]], collinear: [[-4, -2], [0, 0], [4, 2]]};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend(id === "twopts" ? [[C.danger, "perpendicular bisector of AB"], [C.vel, "circles through A and B"]] : [[C.danger, "perpendicular bisectors"], [C.path, "circumcircle"]]);
    L.watch({twopts: "§5.3 and Fig. 5.4: move the centre along the perpendicular bisector of AB (AB = 6 units).", acute: "Fig. 5.5: an acute-angled triangle.", obtuse: "Fig. 5.6: an obtuse-angled triangle.", right: "Fig. 5.7: a right-angled triangle.", collinear: "Think, Draw and Infer 1: three collinear points."}[id]);
    L.controls(""); L.restart(true);
  }
  function cc(a, b, c){ var D = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])); if(Math.abs(D) < 1e-9) return null; var s = function(p){ return p[0] * p[0] + p[1] * p[1]; }; return [(s(a) * (b[1] - c[1]) + s(b) * (c[1] - a[1]) + s(c) * (a[1] - b[1])) / D, (s(a) * (c[0] - b[0]) + s(b) * (a[0] - c[0]) + s(c) * (b[0] - a[0])) / D]; }
  function bis(L, V, p, q, col){ var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy), ux = -dy / len, uy = dx / len; return segM5(L, V, [mx - ux * 9, my - uy * 9], [mx + ux * 9, my + uy * 9], col, 1.5, "6 4"); }
  function draw(t){
    var k = 26, V = viewM5(360, 150, k), m = "", msg, id = st.preset;
    if(id === "twopts"){
      var A = [-3, 0], B = [3, 0], y = -4 + 8 * clampM5(t / 4, 0, 1), O = [0, y], r = Math.hypot(3, y);
      m += segM5(L, V, [0, -5.5], [0, 5.5], C.danger, 1.5, "6 4") + circM5(L, V, O, r, k, C.vel) + segM5(L, V, A, B, C.text, 2) + dotM5(L, V, A, C.text, "A", -12, 4) + dotM5(L, V, B, C.text, "B", 14, 4) + dotM5(L, V, O, C.path, "O", 14, -4) + (Math.abs(y) < 0.2 ? "" : segM5(L, V, O, A, C.muted, 1, "4 3"));
      L.svg(m, "Circles through two points", 300);
      L.readout([["Centre O", "(0, " + nM5(y, 1) + ")", C.path], ["Radius OA", nM5(r, 2) + " units", C.vel], ["Smallest radius", "AB/2 = 3 units"]]);
      msg = t < 4 ? "Moving the centre…" : "Every centre lies on the perpendicular bisector of AB, and the smallest radius is <b>AB/2 = 3 units</b>, with AB as a diameter.";
    } else {
      var P = T[id], O2 = cc(P[0], P[1], P[2]);
      m += segM5(L, V, P[0], P[1], C.text, 2) + segM5(L, V, P[1], P[2], C.text, 2) + segM5(L, V, P[2], P[0], C.text, 2);
      if(t >= 1) m += bis(L, V, P[0], P[1], C.danger);
      if(t >= 2) m += bis(L, V, P[1], P[2], C.danger) + bis(L, V, P[2], P[0], C.danger);
      if(t >= 3 && O2){ var R2 = Math.hypot(P[0][0] - O2[0], P[0][1] - O2[1]); m += circM5(L, V, O2, R2, k, C.path) + dotM5(L, V, O2, C.path, "O", 14, -6); }
      ["A", "B", "C"].forEach(function(nm, i){ m += dotM5(L, V, P[i], C.text, nm, i === 0 ? -12 : i === 1 ? 14 : 0, i === 2 ? -12 : 14); });
      L.svg(m, "Perpendicular bisectors and the circumcircle", 300);
      var R3 = O2 ? Math.hypot(P[0][0] - O2[0], P[0][1] - O2[1]) : 0;
      L.readout([["Circumcentre", O2 && t >= 3 ? "(" + nM5(O2[0], 2) + ", " + nM5(O2[1], 2) + ")" : id === "collinear" && t >= 3 ? "none" : "…", C.path], ["Circumradius", O2 && t >= 3 ? nM5(R3, 2) + " units" : "…"]]);
      msg = t < 4 ? "Drawing the perpendicular bisectors…" : {acute: "The bisectors meet at one point: the circumcentre is <b>inside the triangle</b>.", obtuse: "For this obtuse-angled triangle the circumcentre lies <b>outside the triangle</b>.", right: "For the right-angled triangle the circumcentre is the <b>midpoint of the hypotenuse</b>.", collinear: "For collinear points the bisectors are parallel, so <b>no circle</b> passes through A, B and C."}[id];
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["twopts", "Fig. 5.4: two points"], ["acute", "Fig. 5.5: acute"], ["obtuse", "Fig. 5.6: obtuse"], ["right", "Fig. 5.7: right"], ["collinear", "Collinear points"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.circum = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Chords and central angles (§5.4)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "rotate", ang: 90};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend([[C.path, "chord"], [C.vel, "radii"], [C.ok, "equal chord"]]);
    L.watch({rotate: "Fig. 5.8: a taut thread on a turning wheel (radius 5 cm, central angle 70°).", equal: "Fig. 5.9: equal chords AB and DE give congruent triangles.", angle60: "A chord that subtends 60° at the centre.", explore: "Change the central angle and watch the chord length in a circle of radius 5 cm."}[id]);
    if(id === "explore") sliderSetM5(L, st, [["m5ang", "central angle (°)", 10, 180, 5, "ang"]]);
    else L.controls("");
    L.restart(true);
  }
  function chordAt(L, V, r, start, ang, col){ var a = onM5(r, start), b = onM5(r, start + ang); return segM5(L, V, a, b, col, 3) + segM5(L, V, [0, 0], a, C.vel, 1.5) + segM5(L, V, [0, 0], b, C.vel, 1.5); }
  function draw(t){
    var k = 26, V = viewM5(360, 150, k), r = 5, m = circM5(L, V, [0, 0], r, k, C.text), msg, id = st.preset, f = clampM5(t / 4, 0, 1);
    if(id === "rotate"){
      m += chordAt(L, V, r, 200 + 180 * f, 70, C.path) + L.circle(360, 150, 4, C.text);
      L.svg(m, "A rotating chord", 300);
      L.readout([["Central angle", "70°", C.vel], ["Chord length", nM5(2 * r * Math.sin(35 * DEG5), 2) + " cm", C.path]]);
      msg = t < 4 ? "Rotating…" : "Length and central angle move together: <b>equal chords subtend equal angles</b> at the centre.";
    } else if(id === "equal"){
      m += '<polygon points="' + [V([0, 0]), V(onM5(r, 100)), V(onM5(r, 160))].map(function(p){ return p.join(","); }).join(" ") + '" fill="rgba(245,158,11,0.25)"/>';
      if(t >= 1.5) m += '<polygon points="' + [V([0, 0]), V(onM5(r, -40)), V(onM5(r, 20))].map(function(p){ return p.join(","); }).join(" ") + '" fill="rgba(52,211,153,0.25)"/>';
      m += chordAt(L, V, r, 100, 60, C.path) + (t >= 1.5 ? chordAt(L, V, r, -40, 60, C.ok) : "");
      m += dotM5(L, V, onM5(r, 100), C.text, "A", 0, -12) + dotM5(L, V, onM5(r, 160), C.text, "B", -14, 0) + dotM5(L, V, onM5(r, -40), C.text, "D", 10, 14) + dotM5(L, V, onM5(r, 20), C.text, "E", 14, 0) + dotM5(L, V, [0, 0], C.text, "C", -14, 14);
      L.svg(m, "Congruent triangles from equal chords", 300);
      L.readout([["CA = CD, CB = CE", "radii"], ["AB = DE", "given"], ["Congruence", t >= 3 ? "SSS" : "…", C.ok]]);
      msg = t < 4 ? "Comparing the triangles…" : "ΔCAB ≅ ΔCDE by SSS, so <b>∠ACB = ∠DCE</b>.";
    } else if(id === "angle60"){
      m += '<polygon points="' + [V([0, 0]), V(onM5(r, 60)), V(onM5(r, 120))].map(function(p){ return p.join(","); }).join(" ") + '" fill="rgba(56,189,248,0.2)"/>' + chordAt(L, V, r, 60, 60, C.path);
      L.svg(m, "A 60° chord", 300);
      L.readout([["Central angle", "60°"], ["Base angles", "(180° − 60°) ÷ 2 = 60°"], ["Chord", t >= 2 ? "5 cm" : "…", C.path]]);
      msg = t < 4 ? "Measuring…" : "All three angles are 60°, so the triangle is equilateral: <b>chord = radius = 5 cm</b>.";
    } else {
      var ang = st.ang, len = 2 * r * Math.sin(ang / 2 * DEG5);
      m += chordAt(L, V, r, 90 - ang / 2, ang, C.path);
      L.svg(m, "Chord length and central angle", 300);
      L.readout([["Central angle", nM5(ang) + "°", C.vel], ["Chord length", nM5(len, 2) + " cm", C.path]]);
      msg = "A central angle of " + nM5(ang) + "° gives a chord of <b>" + nM5(len, 2) + " cm</b> in a circle of radius 5 cm; equal angles always give equal chords.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["rotate", "Fig. 5.8: rotating chord"], ["equal", "Fig. 5.9: Theorem 2"], ["angle60", "A 60° chord"], ["explore", "Explore: central angle"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.chordangle = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — The perpendicular from the centre (§5.5)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "mid"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend([[C.path, "chord"], [C.danger, "centre to chord"], [C.ok, "right angle"]]);
    L.watch({mid: "Fig. 5.12 and Theorem 4: join the centre to the midpoint of the chord.", perp: "Theorem 5: drop a perpendicular from the centre to an 8 cm chord (radius 5 cm).", centre: "Draw two chords and their perpendicular bisectors.", worked: "Worked example: how far is an 8 cm chord from the centre of a circle of radius 5 cm?"}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var k = 26, V = viewM5(360, 150, k), r = 5, m = circM5(L, V, [0, 0], r, k, C.text), msg, id = st.preset, f = clampM5(t / 4, 0, 1);
    if(id === "mid" || id === "perp" || id === "worked"){
      var tilt = id === "mid" ? -30 + 60 * f : 0, d = 3, u = [Math.cos((tilt + 90) * DEG5), Math.sin((tilt + 90) * DEG5)], w = [-u[1], u[0]], M = [u[0] * -d, u[1] * -d], A = [M[0] - w[0] * 4, M[1] - w[1] * 4], B = [M[0] + w[0] * 4, M[1] + w[1] * 4];
      m += segM5(L, V, A, B, C.path, 3) + segM5(L, V, [0, 0], M, C.danger, 2.5) + rightMarkM5(L, V, M, [u[0], u[1]], w, 0.45) + dotM5(L, V, A, C.text, "A", -12, 10) + dotM5(L, V, B, C.text, "B", 12, 10) + dotM5(L, V, M, C.ok, "M", 0, 20) + dotM5(L, V, [0, 0], C.text, "C", 0, -12);
      if(id !== "mid") m += segM5(L, V, [0, 0], A, C.vel, 1.5, "4 3");
      L.svg(m, "Centre, midpoint and chord", 300);
      if(id === "mid"){ L.readout([["AM = MB", "4 cm"], ["∠CMA", "90°", C.ok], ["∠CMB", "90°", C.ok]]); msg = t < 4 ? "Turning the chord…" : "Wherever the chord is, ∠CMA = ∠CMB = <b>90°</b> (Theorem 4)."; }
      else if(id === "perp"){ L.readout([["CM ⊥ AB", "yes", C.ok], ["AM", "4 cm"], ["MB", "4 cm"]]); msg = t < 4 ? "Dropping the perpendicular…" : "The perpendicular lands at the midpoint: <b>AM = MB = 4 cm</b> (Theorem 5)."; }
      else { L.readout([["CA (radius)", "5 cm", C.vel], ["AM (half-chord)", "4 cm"], ["CM", t >= 3 ? "3 cm" : "…", C.danger]]); msg = t < 4 ? "Using the right triangle CMA…" : "CM = √(5² − 4²) = √9 = <b>3 cm</b>."; }
    } else {
      var c1a = onM5(r, 150), c1b = onM5(r, 40), c2a = onM5(r, 250), c2b = onM5(r, 340);
      m += segM5(L, V, c1a, c1b, C.path, 3) + segM5(L, V, c2a, c2b, C.vel, 3);
      function bisector(p, q, col, frac){ var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], ln = Math.hypot(dx, dy); var s = [mx + dy / ln * 7, my - dx / ln * 7], e = [mx - dy / ln * 7, my + dx / ln * 7]; return segM5(L, V, s, [s[0] + (e[0] - s[0]) * frac, s[1] + (e[1] - s[1]) * frac], col, 1.8, "6 4"); }
      m += bisector(c1a, c1b, C.danger, clampM5(t / 2, 0, 1)) + (t >= 1.5 ? bisector(c2a, c2b, C.ok, clampM5((t - 1.5) / 2, 0, 1)) : "");
      if(t >= 3.5) m += L.circle(360, 150, 7, C.path) + L.text(378, 142, "centre", {size: 13, color: C.path, weight: 700});
      L.svg(m, "Finding the centre from two chords", 300);
      L.readout([["Bisector of chord 1", "passes through the centre", C.danger], ["Bisector of chord 2", t >= 3.5 ? "passes through the centre" : "…", C.ok]]);
      msg = t < 4 ? "Constructing bisectors…" : "The perpendicular bisectors of two chords cross at the <b>centre</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["mid", "Theorem 4: midpoint"], ["perp", "Theorem 5: perpendicular"], ["centre", "Finding the centre"], ["worked", "Worked example"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.perp = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Chord length and distance from the centre (§5.6)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "table", d: 3};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend([[C.path, "chord"], [C.danger, "distance from the centre"]]);
    L.watch({table: "Table 1 activity: chords at distances 0, 3, 4 and 5 cm in a circle of radius 5 cm.", slide: "Move the chord: its length is 2√(r² − d²).", equal: "Theorem 6: two 8 cm chords in different positions.", compare: "Theorem 8: an 8 cm chord and a 6 cm chord."}[id]);
    if(id === "slide") sliderSetM5(L, st, [["m5d", "distance d (cm)", 0, 5, 0.5, "d"]]);
    else L.controls("");
    L.restart(true);
  }
  function chordAtDist(L, V, r, d, dir, col){ var u = [Math.cos(dir * DEG5), Math.sin(dir * DEG5)], w = [-u[1], u[0]], h = Math.sqrt(Math.max(0, r * r - d * d)), M = [u[0] * d, u[1] * d]; return segM5(L, V, [M[0] - w[0] * h, M[1] - w[1] * h], [M[0] + w[0] * h, M[1] + w[1] * h], col, 3) + segM5(L, V, [0, 0], M, C.danger, 2, "5 4") + L.circle(V(M)[0], V(M)[1], 3.5, C.danger); }
  function draw(t){
    var k = 26, V = viewM5(360, 150, k), r = 5, m = circM5(L, V, [0, 0], r, k, C.text) + L.circle(360, 150, 4, C.text), msg, id = st.preset;
    if(id === "table"){
      var rows = [[0, 90], [3, 30], [4, 200], [5, 290]], n = Math.min(4, Math.floor(t + 1e-9) + 1);
      rows.slice(0, n).forEach(function(rw, i){ m += chordAtDist(L, V, r, rw[0], rw[1], [C.path, C.vel, C.ok, C.acc][i]); m += L.text(40, 60 + i * 30, "d = " + rw[0] + " cm → chord " + nM5(2 * Math.sqrt(r * r - rw[0] * rw[0])) + " cm", {size: 15, color: C.text, anchor: "start", mono: true}); });
      L.svg(m, "Chords at different distances", 300);
      L.readout([["Radius", "5 cm"], ["Rows", n + " of 4"]]);
      msg = t < 4 ? "Filling Table 1…" : "Distances 0, 3, 4, 5 cm give chords 10, 8, 6, 0 cm: <b>the longer the chord, the closer it is to the centre</b>.";
    } else if(id === "slide"){
      var d = st.d, len = 2 * Math.sqrt(r * r - d * d);
      m += chordAtDist(L, V, r, d, 60, C.path);
      L.svg(m, "Chord length from distance", 300);
      L.readout([["Distance d", nM5(d) + " cm", C.danger], ["Half-chord", "√(25 − " + nM5(d * d) + ") = " + nM5(len / 2) + " cm"], ["Chord", nM5(len) + " cm", C.path]]);
      msg = "d = " + nM5(d) + " cm gives L = 2√(25 − " + nM5(d * d) + ") = <b>" + nM5(len) + " cm</b>.";
    } else if(id === "equal"){
      m += chordAtDist(L, V, r, 3, 70, C.path) + (t >= 1.5 ? chordAtDist(L, V, r, 3, 220, C.ok) : "");
      L.svg(m, "Equal chords", 300);
      L.readout([["Chord 1", "8 cm, 3 cm from the centre", C.path], ["Chord 2", t >= 1.5 ? "8 cm, 3 cm from the centre" : "…", C.ok]]);
      msg = t < 4 ? "Comparing…" : "Both 8 cm chords are <b>3 cm from the centre</b> (Theorem 6).";
    } else {
      m += chordAtDist(L, V, r, 3, 60, C.path) + (t >= 1.5 ? chordAtDist(L, V, r, 4, 240, C.vel) : "");
      L.svg(m, "A longer and a shorter chord", 300);
      L.readout([["8 cm chord", "3 cm from the centre", C.path], ["6 cm chord", t >= 1.5 ? "4 cm from the centre" : "…", C.vel]]);
      msg = t < 4 ? "Comparing…" : "The 8 cm chord is 3 cm away and the 6 cm chord is 4 cm away: <b>the longer chord is closer</b> (Theorem 8).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["table", "Table 1 activity"], ["slide", "Explore: move the chord"], ["equal", "Theorem 6: equal chords"], ["compare", "Theorem 8: unequal chords"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.distance = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Angles subtended by an arc (§5.7)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "move"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend([[C.vel, "angle at the centre"], [C.path, "angle on the circle"], [C.danger, "point off the circle"]]);
    L.watch({move: "Theorem 9: the minor arc AB subtends 100° at the centre. Watch ∠ADB as D moves along the rest of the circle.", semicircle: "Corollary: AB is a diameter.", minor: "The major arc seen from a point E on the minor arc.", inout: "Fig. 5.25: points inside and outside the circle see AB at different angles."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var k = 26, V = viewM5(360, 150, k), r = 5, m = circM5(L, V, [0, 0], r, k, C.text), msg, id = st.preset, f = clampM5(t / 4, 0, 1);
    var central = id === "semicircle" ? 180 : 100, A = onM5(r, 270 - central / 2), B = onM5(r, 270 + central / 2), O = [0, 0];
    m += dotM5(L, V, A, C.text, "A", -14, 10) + dotM5(L, V, B, C.text, "B", 14, 10) + L.circle(360, 150, 4, C.text);
    if(id === "move" || id === "semicircle"){
      var start = 270 + central / 2 + 15, end = 270 - central / 2 + 360 - 15, Dp = onM5(r, start + (end - start) * f);
      m += segM5(L, V, O, A, C.vel, 1.5) + segM5(L, V, O, B, C.vel, 1.5) + segM5(L, V, Dp, A, C.path, 2.5) + segM5(L, V, Dp, B, C.path, 2.5) + dotM5(L, V, Dp, C.path, "D", 0, -12);
      var aD = angM5(Dp, A, B);
      L.svg(m, "Angle subtended by an arc", 300);
      L.readout([["∠ACB (centre)", central + "°", C.vel], ["∠ADB", nM5(aD, 1) + "°", C.path]]);
      msg = t < 4 ? "Moving D…" : id === "move" ? "∠ADB stays at <b>50°</b>, half of ∠ACB = 100°, wherever D is on the rest of the circle." : "∠ADB = <b>90°</b> wherever D is on the circle: the angle in a semicircle.";
    } else if(id === "minor"){
      var E = onM5(r, 270 - 15 + 30 * f);
      m += segM5(L, V, E, A, C.path, 2.5) + segM5(L, V, E, B, C.path, 2.5) + dotM5(L, V, E, C.path, "E", 0, 18) + segM5(L, V, O, A, C.vel, 1.5, "4 3") + segM5(L, V, O, B, C.vel, 1.5, "4 3");
      L.svg(m, "Angle subtended by the major arc", 300);
      L.readout([["Reflex ∠ACB", "260°", C.vel], ["∠AEB", nM5(angM5(E, A, B), 1) + "°", C.path]]);
      msg = t < 4 ? "Moving E along the minor arc…" : "The major arc subtends the reflex angle 260° at the centre, so ∠AEB = ½ × 260° = <b>130°</b>.";
    } else {
      var Don = onM5(r, 90), Din = [0, 1.5 + 1.5 * (1 - f)], Dout = [0, 5 + 2 * f];
      m += segM5(L, V, Don, A, C.path, 2) + segM5(L, V, Don, B, C.path, 2) + dotM5(L, V, Don, C.path, "on", 20, -4);
      m += segM5(L, V, Din, A, C.ok, 1.5, "5 4") + segM5(L, V, Din, B, C.ok, 1.5, "5 4") + dotM5(L, V, Din, C.ok, "inside", 34, 4);
      m += segM5(L, V, Dout, A, C.danger, 1.5, "5 4") + segM5(L, V, Dout, B, C.danger, 1.5, "5 4") + dotM5(L, V, Dout, C.danger, "outside", 36, 4);
      L.svg(m, "Points on, inside and outside the circle", 300);
      L.readout([["On the circle", nM5(angM5(Don, A, B), 1) + "°", C.path], ["Inside", nM5(angM5(Din, A, B), 1) + "°", C.ok], ["Outside", nM5(angM5(Dout, A, B), 1) + "°", C.danger]]);
      msg = t < 4 ? "Comparing points…" : "Inside the circle the angle is larger and outside it is smaller; only points <b>on the circle</b> see AB at exactly 50°.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["move", "Theorem 9: moving D"], ["semicircle", "Angle in a semicircle"], ["minor", "The major arc"], ["inout", "Fig. 5.25: on, inside, outside"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.inscribed = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Cyclic quadrilaterals (§5.8)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "move"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend([[C.path, "∠A"], [C.vel, "∠C"], [C.text, "quadrilateral"]]);
    L.watch({move: "Theorem 11: move A along the circle and watch ∠A + ∠C.", off: "Theorem 12’s converse view: pull A off the circle.", fig526: "Exercise Set 5.6 Q3, Fig. 5.26: ∠D = 100°. Find x = ∠B.", check: "In-text exercise: can a cyclic quadrilateral have angles 80°, 110°, 100° and 70°?"}[id]);
    L.controls(""); L.restart(true);
  }
  function quad(L, V, P, names){ var m = '<polygon points="' + P.map(function(p){ return V(p).join(","); }).join(" ") + '" fill="rgba(245,158,11,0.15)" stroke="' + L.C.text + '" stroke-width="2"/>'; P.forEach(function(p, i){ var q = V(p), c = V([0, 0]), dx = q[0] - c[0], dy = q[1] - c[1], ln = Math.hypot(dx, dy) || 1; m += L.circle(q[0], q[1], 4.5, L.C.text) + L.text(q[0] + dx / ln * 16, q[1] + dy / ln * 16 + 4, names[i], {size: 14, color: L.C.text, weight: 700}); }); return m; }
  function draw(t){
    var k = 26, V = viewM5(360, 150, k), r = 5, m = circM5(L, V, [0, 0], r, k, C.muted), msg, id = st.preset, f = clampM5(t / 4, 0, 1);
    if(id === "move" || id === "off"){
      var aA = id === "move" ? 100 + 70 * f : 135, rad = id === "off" ? r * (1 + 0.35 * f) : r;
      var A = onM5(rad, aA), B = onM5(r, 210), Cc = onM5(r, 300), D = onM5(r, 40);
      m += quad(L, V, [A, B, Cc, D], ["A", "B", "C", "D"]);
      var angA = angM5(A, B, D), angC = angM5(Cc, B, D);
      L.svg(m, "A quadrilateral inscribed in a circle", 300);
      L.readout([["∠A", nM5(angA, 1) + "°", C.path], ["∠C", nM5(angC, 1) + "°", C.vel], ["∠A + ∠C", nM5(angA + angC, 1) + "°"]]);
      msg = t < 4 ? (id === "move" ? "Moving A along the circle…" : "Pulling A off the circle…") : id === "move" ? "∠A + ∠C = <b>180°</b> wherever A is on the circle." : "Off the circle, ∠A + ∠C = " + nM5(angA + angC, 1) + "°, not 180°: ABCD is <b>not cyclic</b>.";
    } else if(id === "fig526"){
      var A2 = onM5(r, 180), B2 = onM5(r, 290), C2 = onM5(r, 10), D2 = onM5(r, 90);
      m += quad(L, V, [A2, B2, C2, D2], ["A", "B", "C", "D"]);
      var dAng = angM5(D2, A2, C2), bAng = angM5(B2, A2, C2);
      m += L.text(V(D2)[0], V(D2)[1] + 30, "100°", {size: 13, color: C.vel, weight: 700}) + (t >= 2 ? L.text(V(B2)[0], V(B2)[1] - 22, "x = 80°", {size: 13, color: C.path, weight: 700}) : "");
      L.svg(m, "Fig. 5.26", 300);
      L.readout([["∠D", "100°", C.vel], ["x = ∠B", t >= 2 ? "180° − 100° = 80°" : "…", C.path]]);
      msg = t < 4 ? "Using opposite angles…" : "ABCD is cyclic, so ∠B + ∠D = 180° and x = 180° − 100° = <b>80°</b>.";
    } else {
      var rows = [["∠A + ∠C", "80° + 100° = 180°"], ["∠B + ∠D", "110° + 70° = 180°"], ["All four", "80° + 110° + 100° + 70° = 360°"]];
      rows.forEach(function(rw, i){ if(t >= i) m += L.text(110, 60 + i * 50, rw[0] + ":  " + rw[1] + "  ✓", {size: 18, color: C.text, anchor: "start", mono: true}); });
      if(t >= 3) m = circM5(L, V, [0, 0], r, k, C.muted) + quad(L, V, [onM5(r, 150), onM5(r, 240), onM5(r, 330), onM5(r, 60)], ["A", "B", "C", "D"]).replace(/^/, "") + rows.map(function(rw, i){ return L.text(20, 40 + i * 26, rw[0] + ": " + rw[1], {size: 13, color: C.text, anchor: "start"}); }).join("");
      L.svg(m, "Checking a cyclic quadrilateral", 300);
      L.readout([["Opposite pairs", "180° each", C.ok], ["Can it be drawn?", t >= 3 ? "yes" : "…", C.path]]);
      msg = t < 4 ? "Checking opposite angles…" : "80° + 100° = 180° and 110° + 70° = 180°, so by Theorem 12 <b>it can be drawn</b> as a cyclic quadrilateral.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["move", "Theorem 11: move A"], ["off", "A off the circle"], ["fig526", "Fig. 5.26: find x"], ["check", "80°, 110°, 100°, 70°"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.cyclic = {mount: mount, draw: draw, select: select, state: st};
})();
