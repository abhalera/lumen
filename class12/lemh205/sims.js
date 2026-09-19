// Class 12 Mathematics, Chapter 11 (lemh205) — Three Dimensional Geometry labs.
// One tailored lab per lesson, built on the shared Lumen LAB helpers (window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// Shared isometric projection for the chapter's 3D drawings (720 x 300 canvas).
function iso(x, y, z, sc){
  sc = sc || 30;
  return { x: 330 + (x - y) * sc * 0.80, y: 190 - z * sc * 0.72 + (x + y) * sc * 0.36 };
}
function isoLine(p1, p2, color, w){
  return LAB.line(p1.x, p1.y, p2.x, p2.y, color, w);
}
function deg(rad){ return rad * 180 / Math.PI; }
function safeAcos(v){
  if(v > 1) v = 1;
  if(v < -1) v = -1;
  return Math.acos(v);
}
// Formats a 3-vector as 2i − j + 4k (no coefficient 1, proper minus signs).
function vecStr(p){
  var out = "";
  for(var i = 0; i < 3; i += 1){
    var c = p[i], u = ["i", "j", "k"][i], a = Math.abs(c);
    var t = (a === 1 ? "" : String(a)) + u;
    if(i === 0) out += (c < 0 ? "−" : "") + t;
    else out += (c < 0 ? " − " : " + ") + t;
  }
  return out;
}

// -------------------------------------------------------------------------
// Lab 1 — Direction cosines and ratios (NCERT §11.2, Example 3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "pos"};
  var EQ = {
    pos:   {a: 2,  b: 3,  c: 6,  note: "A line in the first octant. All three direction cosines are positive."},
    neg:   {a: -2, b: -3, c: -6, note: "The same line taken in the opposite direction: every direction cosine changes sign."},
    axes:  {a: 1,  b: 0,  c: 0,  note: "The x-axis itself. Its direction cosines are (1, 0, 0) — a useful check on zero ratios."},
    equal: {a: 1,  b: 1,  c: 1,  note: "Equal ratios give equal direction cosines 1/√3, the line that makes equal angles with all three axes."}
  };

  function draw(){
    var p = EQ[st.preset];
    var len = Math.sqrt(p.a * p.a + p.b * p.b + p.c * p.c);
    var l = p.a / len, m = p.b / len, n = p.c / len;
    var unit = l * l + m * m + n * n;
    var ox = 230, oy = 235, sc = 30;
    var O = { x: ox, y: oy };
    var m2 = "";
    // axes
    m2 += L.arrow(ox, oy, ox + 190, oy + 76, C.faint, 2) + L.text(ox + 202, oy + 84, "x", {size: 15, color: C.muted});
    m2 += L.arrow(ox, oy, ox - 40, oy - 120, C.faint, 2) + L.text(ox - 52, oy - 128, "z", {size: 15, color: C.muted});
    m2 += L.arrow(ox, oy, ox + 40, oy - 96, C.faint, 2) + L.text(ox + 52, oy - 108, "y", {size: 15, color: C.muted});
    // the directed line through the origin, extended both ways
    var tip = { x: ox + l * 118, y: oy - n * 92 + m * 46 };
    var back = { x: ox - l * 60, y: oy + n * 46 - m * 23 };
    m2 += L.line(back.x, back.y, tip.x, tip.y, "#38bdf8", 3);
    m2 += L.arrow(ox + l * 70, oy - n * 55 + m * 27, tip.x, tip.y, "#38bdf8", 3);
    m2 += L.circle(ox, oy, 5, C.text);
    m2 += L.text(tip.x, tip.y - 10, "(" + p.a + ", " + p.b + ", " + p.c + ")", {size: 13, color: "#38bdf8", weight: 700});
    m2 += L.text(360, 34, "direction angles α, β, γ", {size: 16, color: C.text, weight: 700});
    m2 += L.text(360, 58, "α = " + L.num(deg(safeAcos(l)), 1) + "°   β = " + L.num(deg(safeAcos(m)), 1) + "°   γ = " + L.num(deg(safeAcos(n)), 1) + "°", {size: 15, color: C.muted});
    L.svg(m2, "A directed line through the origin with angles to the three coordinate axes.", 290);
    L.readout([
      ["Ratios (a, b, c)", "(" + p.a + ", " + p.b + ", " + p.c + ")"],
      ["Length √(a²+b²+c²)", L.num(len, 3)],
      ["l = a/length", L.num(l, 3), "#38bdf8"],
      ["m = b/length", L.num(m, 3), "#38bdf8"],
      ["n = c/length", L.num(n, 3), "#38bdf8"],
      ["l² + m² + n²", L.num(unit, 3), C.ok]
    ]);
    L.verdict("<b>" + p.note + "</b> No matter which ratios you choose, dividing by the length gives direction cosines with l² + m² + n² = " + L.num(unit, 3) + ". Direction ratios are not unique, but the direction cosines (up to an overall sign) are.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["pos", "First octant (2, 3, 6)"], ["neg", "Opposite direction"], ["axes", "Along the x-axis"], ["equal", "Equal angles (1, 1, 1)"]], st.preset, select);
    L.legend([["#38bdf8", "directed line"], [C.faint, "coordinate axes"], [C.ok, "unit check"]]);
    L.watch("Select a direction and compare the three cosines. The length used for division is √(a²+b²+c²).");
    draw();
  }

  window.SIMS.dircos = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Equation of a line in space (NCERT §11.3, Example 6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "ex6", lam: 1};
  var LINES = {
    ex6: {p: [5, 2, -4], d: [3, 2, -8], note: "NCERT Example 6: the classic point-plus-direction line, with one negative direction ratio."},
    ex4: {p: [1, 2, 3], d: [3, 2, -2], note: "NCERT Exercise 11.2, Q4: the line through (1, 2, 3) parallel to 3i + 2j − 2k."},
    axis: {p: [2, -1, 4], d: [1, 2, -1], note: "NCERT Exercise 11.2, Q5: through 2i − j + 4k in the direction i + 2j − k."}
  };

  function fmtPoint(p){
    return "(" + p[0] + ", " + p[1] + ", " + p[2] + ")";
  }

  function draw(){
    var line = LINES[st.preset];
    var p = line.p, d = line.d;
    var lam = st.lam;
    var P = [p[0] + lam * d[0], p[1] + lam * d[1], p[2] + lam * d[2]];
    var A1 = { x: 250, y: 220 };
    var sc = 26;
    var m = "";
    m += L.line(A1.x - 80, A1.y + 96, A1.x + 330, A1.y - 96, C.faint, 1.5, "6 5");
    // direction vector at the point
    var q0 = { x: 210, y: 175 };
    var q1 = { x: 210 + d[0] * sc * 0.9, y: 175 - d[2] * sc * 0.8 + d[1] * sc * 0.5 };
    m += L.arrow(q0.x, q0.y, q1.x, q1.y, "#f59e0b", 4);
    m += L.text(q1.x + 6, q1.y - 8, "b = (" + d[0] + ", " + d[1] + ", " + d[2] + ")", {size: 13, color: "#f59e0b", anchor: "start"});
    m += L.circle(q0.x, q0.y, 6, C.danger);
    m += L.text(q0.x - 12, q0.y + 22, "A" + fmtPoint(p), {size: 13, color: C.danger, anchor: "start"});
    // the moving point at parameter lam
    var px = 250 + (P[0] * 36 - P[1] * 22);
    var py = 210 - P[2] * 18 + (P[0] * 12 + P[1] * 12);
    m += L.line(90, 80, 650, 80, "rgba(148,163,184,.25)", 1);
    m += L.circle(px, py, 8, "#38bdf8");
    m += L.text(px, py - 14, "P at λ = " + L.num(lam, 1), {size: 14, color: "#38bdf8"});
    var t0 = -1.4, t1 = 1.6;
    var B0 = { x: 250 + ((p[0] + t0 * d[0]) * 36 - (p[1] + t0 * d[1]) * 22), y: 210 - (p[2] + t0 * d[2]) * 18 + ((p[0] + t0 * d[0]) * 12 + (p[1] + t0 * d[1]) * 12) };
    var B1 = { x: 250 + ((p[0] + t1 * d[0]) * 36 - (p[1] + t1 * d[1]) * 22), y: 210 - (p[2] + t1 * d[2]) * 18 + ((p[0] + t1 * d[0]) * 12 + (p[1] + t1 * d[1]) * 12) };
    m += L.line(B0.x, B0.y, B1.x, B1.y, "#38bdf8", 2.5);
    L.svg(m, "Line through a fixed point in a fixed direction, with a second point at parameter lambda.", 290);
    L.readout([
      ["Point (x₁, y₁, z₁)", fmtPoint(p)],
      ["Direction (a, b, c)", fmtPoint(d)],
      ["Vector form", "r = (" + vecStr(p) + ") + λ(" + vecStr(d) + ")", "#38bdf8"],
      ["Cartesian form", "(x " + (p[0] < 0 ? "+ " + Math.abs(p[0]) : "− " + p[0]) + ")/" + d[0] + " = (y " + (p[1] < 0 ? "+ " + Math.abs(p[1]) : "− " + p[1]) + ")/" + d[1] + " = (z " + (p[2] < 0 ? "+ " + Math.abs(p[2]) : "− " + p[2]) + ")/" + d[2]],
      ["Point at λ = " + L.num(lam, 1), fmtPoint(P), C.ok]
    ]);
    L.verdict("<b>" + line.note + "</b> Sliding λ moves the marker along the same straight line; λ = 0 returns to the known point A. The vector and Cartesian forms both encode the same point and direction.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["ex6", "Example 6 line"], ["ex4", "Through (1, 2, 3)"], ["axis", "Through 2i − j + 4k"]], st.preset, select);
    L.controls(L.slider("le-lam", "Parameter λ", -2, 2, 0.5, st.lam, "λ = " + L.num(st.lam, 1)));
    L.onInput("le-lam", function(v){ st.lam = v; L.setVal("le-lam", "λ = " + L.num(v, 1)); draw(); });
    L.legend([["#f59e0b", "direction b"], [C.danger, "known point A"], ["#38bdf8", "the line / point at λ"]]);
    L.watch("Switch lines and slide λ. The readout shows the vector and Cartesian equations side by side.");
    draw();
  }

  window.SIMS.lineeq = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Angle between two lines (NCERT §11.4, Example 8)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "acute"};
  var PAIRS = {
    perp:     {d1: [1, 1, 2],  d2: [2, -2, 0], note: "Perpendicular directions: the dot product is exactly zero, so the angle is 90°."},
    acute:    {d1: [2, 2, 1],  d2: [4, 1, 8],  note: "NCERT Exercise 11.2, Q9(ii): cos θ = 2/3, an acute angle of about 48.2°."},
    parallel: {d1: [1, 2, 3],  d2: [2, 4, 6],  note: "Parallel directions: one vector is a multiple of the other, so cos θ = 1 and θ = 0°."}
  };

  function draw(){
    var pr = PAIRS[st.preset];
    var d1 = pr.d1, d2 = pr.d2;
    var dot = d1[0] * d2[0] + d1[1] * d2[1] + d1[2] * d2[2];
    var n1 = Math.sqrt(d1[0] * d1[0] + d1[1] * d1[1] + d1[2] * d1[2]);
    var n2 = Math.sqrt(d2[0] * d2[0] + d2[1] * d2[1] + d2[2] * d2[2]);
    var cosT = Math.abs(dot) / (n1 * n2);
    var theta = deg(safeAcos(cosT));
    var ox = 300, oy = 225, sc = 52;
    var m = "";
    var A = { x: ox + d1[0] * sc, y: oy - d1[1] * sc };
    var B = { x: ox + d2[0] * sc * 0.9, y: oy - d2[1] * sc * 0.9 };
    m += L.line(80, 250, 660, 250, C.faint, 1, "5 5");
    m += L.arrow(ox, oy, A.x, A.y, "#38bdf8", 4);
    m += L.arrow(ox, oy, B.x, B.y, "#f59e0b", 4);
    m += L.circle(ox, oy, 5, C.text);
    m += L.text(A.x, A.y - 12, "b₁", {size: 15, color: "#38bdf8", weight: 700});
    m += L.text(B.x, B.y - 12, "b₂", {size: 15, color: "#f59e0b", weight: 700});
    var arcR = 46;
    var a1 = Math.atan2(A.y - oy, A.x - ox);
    var a2 = Math.atan2(B.y - oy, B.x - ox);
    var big = (Math.abs(a1 - a2) > Math.PI) ? 1 : 0;
    var sx = ox + arcR * Math.cos(a1), sy = oy + arcR * Math.sin(a1);
    var ex = ox + arcR * Math.cos(a2), ey = oy + arcR * Math.sin(a2);
    m += '<path d="M ' + sx + ' ' + sy + ' A ' + arcR + ' ' + arcR + ' 0 ' + big + ' 0 ' + ex + ' ' + ey + '" fill="none" stroke="' + C.ok + '" stroke-width="3"/>';
    m += L.text(ox + 4, oy - 58, "θ = " + L.num(theta, 1) + "°", {size: 18, color: C.ok, weight: 700});
    m += L.text(360, 40, "cos θ = |b₁·b₂| / (|b₁||b₂|)", {size: 18, color: C.text, weight: 700});
    L.svg(m, "Two direction vectors from a common point with the angle between them marked.", 290);
    L.readout([
      ["d₁", "(" + d1.join(", ") + ")", "#38bdf8"],
      ["d₂", "(" + d2.join(", ") + ")", "#f59e0b"],
      ["d₁ · d₂", L.num(dot, 3)],
      ["|d₁| · |d₂|", L.num(n1 * n2, 3)],
      ["cos θ = |dot| / product", L.num(cosT, 3), C.ok],
      ["θ", L.num(theta, 1) + "°", C.ok]
    ]);
    L.verdict("<b>" + pr.note + "</b> The angle uses the absolute value of the dot product, so it is always the acute angle between the two lines.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["acute", "Acute angle"], ["perp", "Perpendicular"], ["parallel", "Parallel"]], st.preset, select);
    L.legend([["#38bdf8", "direction b₁"], ["#f59e0b", "direction b₂"], [C.ok, "angle θ"]]);
    L.watch("Select a pair of directions. Compare the dot product with the product of the lengths to read off cos θ.");
    draw();
  }

  window.SIMS.anglelines = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Shortest distance between lines (NCERT §11.5, Examples 9 and 10)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "skew"};
  var CASES = {
    skew:     {a1: [1, 1, 0], b1: [2, -1, 1], a2: [2, 1, -1], b2: [3, -5, 2], note: "NCERT Example 9: the lines are skew, so the common perpendicular gives a positive distance."},
    parallel: {a1: [1, 2, -4], b1: [2, 3, 6], a2: [3, 3, -5], b2: [2, 3, 6], note: "NCERT Example 10: the directions are equal, so the parallel-line formula applies."},
    meet:     {a1: [0, 0, 0], b1: [1, 1, 0], a2: [0, 0, 0], b2: [1, 0, 1], note: "The two lines share the origin, so they intersect and the shortest distance collapses to zero."}
  };

  function cross(u, v){
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  }
  function sub(u, v){ return [u[0] - v[0], u[1] - v[1], u[2] - v[2]]; }
  function dot(u, v){ return u[0] * v[0] + u[1] * v[1] + u[2] * v[2]; }
  function mag(u){ return Math.sqrt(dot(u, u)); }

  function draw(){
    var cs = CASES[st.preset];
    var w = sub(cs.a2, cs.a1);
    var cr = cross(cs.b1, cs.b2);
    var parallel = (mag(cr) < 1e-9);
    var num, den, dist, formula, crossLabel, dispCross;
    if(parallel){
      var pcross = cross(cs.b1, w);
      num = mag(pcross); den = mag(cs.b1); dist = num / den; formula = "d = |b × (a₂ − a₁)| / |b|"; crossLabel = "b × (a₂ − a₁)"; dispCross = pcross;
    } else {
      num = Math.abs(dot(w, cr)); den = mag(cr); dist = num / den; formula = "d = |(a₂ − a₁)·(b₁ × b₂)| / |b₁ × b₂|"; crossLabel = "b₁ × b₂"; dispCross = cr;
    }
    var m = "";
    var O = iso(0, 0, 0);
    m += isoLine(iso(-3, 0, 0), iso(3, 0, 0), C.faint, 1.5);
    m += isoLine(iso(0, -3, 0), iso(0, 3, 0), C.faint, 1.5);
    m += isoLine(iso(0, 0, -3), iso(0, 0, 3), C.faint, 1.5);
    m += L.text(O.x + 170, O.y + 48, "x", {size: 13, color: C.muted}) + L.text(O.x - 52, O.y - 12, "y", {size: 13, color: C.muted}) + L.text(O.x - 6, O.y - 128, "z", {size: 13, color: C.muted});
    var p1 = iso(cs.a1[0] + cs.b1[0] * -1.2, cs.a1[1] + cs.b1[1] * -1.2, cs.a1[2] + cs.b1[2] * -1.2);
    var p2 = iso(cs.a1[0] + cs.b1[0] * 1.2, cs.a1[1] + cs.b1[1] * 1.2, cs.a1[2] + cs.b1[2] * 1.2);
    var q1 = iso(cs.a2[0] + cs.b2[0] * -1.2, cs.a2[1] + cs.b2[1] * -1.2, cs.a2[2] + cs.b2[2] * -1.2);
    var q2 = iso(cs.a2[0] + cs.b2[0] * 1.2, cs.a2[1] + cs.b2[1] * 1.2, cs.a2[2] + cs.b2[2] * 1.2);
    m += L.line(p1.x, p1.y, p2.x, p2.y, "#38bdf8", 3);
    m += L.line(q1.x, q1.y, q2.x, q2.y, "#f59e0b", 3);
    var A1 = iso(cs.a1[0], cs.a1[1], cs.a1[2]);
    var A2 = iso(cs.a2[0], cs.a2[1], cs.a2[2]);
    m += L.circle(A1.x, A1.y, 6, "#38bdf8") + L.circle(A2.x, A2.y, 6, "#f59e0b");
    if(st.preset !== "meet"){
      m += L.line(A1.x, A1.y, A2.x, A2.y, C.ok, 3, "6 4");
      var mx = (A1.x + A2.x) / 2, my = (A1.y + A2.y) / 2;
      m += L.text(mx + 14, my - 8, "d = " + L.num(dist, 3), {size: 15, color: C.ok, weight: 700});
    } else {
      m += L.text(A1.x + 20, A1.y - 14, "d = 0 (they meet)", {size: 15, color: C.ok, weight: 700});
    }
    m += L.text(360, 30, formula, {size: 16, color: C.text, weight: 700});
    L.svg(m, "Two lines in space with the shortest-distance segment drawn between them.", 290);
    L.readout([
      [crossLabel, "(" + L.num(dispCross[0], 3) + ", " + L.num(dispCross[1], 3) + ", " + L.num(dispCross[2], 3) + ")"],
      ["a₂ − a₁", "(" + w[0] + ", " + w[1] + ", " + w[2] + ")"],
      ["Numerator", L.num(num, 3)],
      ["Denominator", L.num(den, 3)],
      ["Shortest distance d", L.num(dist, 3), C.ok]
    ]);
    L.verdict("<b>" + cs.note + "</b> " + (parallel ? "Because the directions are parallel, b₁ × b₂ = 0; the parallel-line formula is used instead." : "The numerator is the absolute scalar triple product; dividing by |b₁ × b₂| leaves the perpendicular separation."));
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["skew", "Skew lines (Example 9)"], ["parallel", "Parallel lines (Example 10)"], ["meet", "Intersecting lines"]], st.preset, select);
    L.legend([["#38bdf8", "line 1"], ["#f59e0b", "line 2"], [C.ok, "shortest segment"]]);
    L.watch("Switch cases. The cross product of the directions, the triple product and the final distance all update in the readout.");
    draw();
  }

  window.SIMS.shortdist = {mount: mount, draw: draw, select: select, state: st};
})();
