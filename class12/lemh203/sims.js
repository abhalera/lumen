// Class 12 Mathematics, Chapter 9 (lemh203) — Differential Equations labs.
// One tailored lab per lesson, built on the shared Lumen LAB helpers (window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// Shared plotting helpers for the chapter's curve benches (720 x 300 canvas).
function axesFrame(x0, y0, w, h, xmin, xmax, ymin, ymax){
  var L = LAB, C = L.C;
  var sx = w / (xmax - xmin), sy = h / (ymax - ymin);
  return {
    X: function(x){ return x0 + (x - xmin) * sx; },
    Y: function(y){ return y0 - (y - ymin) * sy; },
    x0: x0, y0: y0, w: w, h: h, xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax,
    sx: sx, sy: sy
  };
}
function drawAxes(f, xlabel, ylabel){
  var L = LAB, C = L.C, s = "";
  var i;
  for(i = Math.ceil(f.xmin); i <= Math.floor(f.xmax); i += 1){
    s += L.line(f.X(i), f.Y(f.ymin), f.X(i), f.Y(f.ymax), C.grid, 1);
  }
  for(i = Math.ceil(f.ymin); i <= Math.floor(f.ymax); i += 1){
    s += L.line(f.X(f.xmin), f.Y(i), f.X(f.xmax), f.Y(i), C.grid, 1);
  }
  var yzero = Math.min(Math.max(0, f.ymin), f.ymax);
  var xzero = Math.min(Math.max(0, f.xmin), f.xmax);
  s += L.arrow(f.X(f.xmin), f.Y(yzero), f.X(f.xmax) + 8, f.Y(yzero), C.muted, 1.5);
  s += L.arrow(f.X(xzero), f.Y(f.ymin) - 8, f.X(xzero), f.Y(f.ymax) - 10, C.muted, 1.5);
  s += L.text(f.X(f.xmax) + 6, f.Y(yzero) + 16, xlabel, {size: 13, color: C.muted, anchor: "end"});
  s += L.text(f.X(xzero) + 8, f.Y(f.ymax) - 14, ylabel, {size: 13, color: C.muted, anchor: "start"});
  return s;
}
function plotFunc(f, fn, color, w){
  var L = LAB, pts = [], i, n = 90;
  var prev = null;
  for(i = 0; i <= n; i += 1){
    var x = f.xmin + (f.xmax - f.xmin) * i / n;
    var y = fn(x);
    if(!isFinite(y) || y < f.ymin - 6 || y > f.ymax + 6){
      prev = null;
      continue;
    }
    var X = f.X(x), Y = f.Y(y);
    if(prev) pts.push(prev.x + "," + prev.y + " " + X + "," + Y);
    prev = {x: X, y: Y};
  }
  if(!pts.length) return "";
  var out = "";
  for(i = 0; i < pts.length; i += 1){
    out += '<polyline fill="none" stroke="' + color + '" stroke-width="' + (w || 2.4) + '" stroke-linejoin="round" points="' + pts[i] + '"/>';
  }
  return out;
}

// -------------------------------------------------------------------------
// Lab 1 — Order and degree sorter (NCERT §9.2, Example 1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "poly"};
  var CASES = {
    poly:    {eq: "(dy/dx)³ − 4(dy/dx)² + 7y = sin x", highest: "dy/dx", order: 1, poly: true,  degree: 3, note: "Only the first derivative appears, so the order is 1; its highest power is 3."},
    second:  {eq: "(d²y/dx²)³ + (dy/dx)² + y = 0", highest: "d²y/dx²", order: 2, poly: true,  degree: 3, note: "The second derivative leads, so the order is 2 and its cube gives degree 3."},
    mixed:   {eq: "(ds/dt)⁴ + 3s(d²s/dt²) = 0", highest: "d²s/dt²", order: 2, poly: true,  degree: 1, note: "The fourth power sits on the lower-order term; the leading derivative d²s/dt² has power 1."},
    nonpoly: {eq: "y‴ + y² + eʸ′ = 0", highest: "y‴", order: 3, poly: false, degree: null, note: "eʸ′ is not polynomial in y′, so the degree cannot be defined even though the order is 3."}
  };

  function draw(){
    var c = CASES[st.preset];
    var m = "";
    m += L.text(360, 40, c.eq, {size: 22, color: C.text, weight: 700});
    m += L.text(360, 68, "highest derivative: " + c.highest, {size: 15, color: C.muted});
    var chips = ["y", "y′", "y″", "y‴"];
    var i;
    for(i = 0; i < 4; i += 1){
      var x = 150 + i * 140;
      var active = (i + 1) === c.order;
      m += L.rect(x - 50, 120, 100, 62, active ? "rgba(56,189,248,.18)" : "#0f1c29", ' rx="10" stroke="' + (active ? "#38bdf8" : C.faint) + '" stroke-width="' + (active ? 3 : 1.5) + '"');
      m += L.text(x, 158, chips[i], {size: 20, color: active ? "#38bdf8" : C.muted, weight: active ? 700 : 400});
    }
    m += L.text(360, 218, "order = " + c.order + "    ·    degree = " + (c.poly ? String(c.degree) : "not defined"), {size: 20, color: C.ok, weight: 700});
    L.svg(m, "Derivative ladder with the highest derivative highlighted.", 270);
    L.readout([
      ["Equation", c.eq],
      ["Highest derivative", c.highest],
      ["Order", String(c.order), "#38bdf8"],
      ["Polynomial in derivatives?", c.poly ? "yes" : "no", c.poly ? C.ok : C.danger],
      ["Degree", c.poly ? String(c.degree) : "not defined", c.poly ? C.ok : C.danger]
    ]);
    L.verdict("<b>" + c.note + "</b> Order comes from the highest derivative itself; degree is its power only when the equation is polynomial in the derivatives.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["poly", "First derivative cubed"], ["second", "Second derivative cubed"], ["mixed", "Fourth power on ds/dt"], ["nonpoly", "Exponential of y′"]], st.preset, select);
    L.legend([["#38bdf8", "highest derivative"], [C.danger, "no degree"]]);
    L.watch("Switch equations. The ladder highlights the derivative that sets the order, and the readout decides whether a degree exists.");
    draw();
  }

  window.SIMS.deorder = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — General and particular solutions (NCERT §9.3, Example 6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "quad"};
  var CASES = {
    quad:  {family: "y = x² + C",       fn: function(x, C){ return x * x + C; },              x0: 1,   y0: 3,   C: 2,    note: "A parabola family; the point (1, 3) selects the member with C = 2."},
    exp:   {family: "y = C eˣ",        fn: function(x, C){ return C * Math.exp(x); },        x0: 0,   y0: 2,   C: 2,    note: "Exponential family; y(0) = 2 fixes C = 2 and the particular solution y = 2eˣ."},
    sine:  {family: "y = cos x + C",    fn: function(x, C){ return Math.cos(x) + C; },        x0: 0,   y0: 0.8, C: -0.2, note: "Cosine family; y(0) = 0.8 gives C = −0.2, so the particular solution is y = cos x − 0.2."},
    cubic: {family: "y = x³/3 + C",     fn: function(x, C){ return x * x * x / 3 + C; },     x0: 1,   y0: 2,   C: 5 / 3, note: "Cubic family; the point (1, 2) gives C = 5/3."}
  };

  function familyWithC(family, C){
    var v = L.num(Math.abs(C), 2);
    if(Math.abs(C) < 0.005) return family.replace("C", "0");
    if(C < 0) return family.replace("+ C", "− " + v).replace("C", "−" + v);
    return family.replace("C", v);
  }

  function draw(){
    var c = CASES[st.preset];
    var f = axesFrame(90, 250, 540, 210, -3, 3, -2, 8);
    var m = drawAxes(f, "x", "y");
    var k;
    for(k = -2; k <= 2; k += 1){
      if(k === c.C) continue;
      m += plotFunc(f, function(x){ return CASES[st.preset].fn(x, k); }, "rgba(148,163,184,.45)", 1.8);
    }
    m += plotFunc(f, function(x){ return CASES[st.preset].fn(x, c.C); }, "#38bdf8", 3.2);
    var px = f.X(c.x0), py = f.Y(c.y0);
    m += L.circle(px, py, 7, C.ok);
    m += L.text(px + 10, py - 10, "(" + c.x0 + ", " + c.y0 + ")", {size: 14, color: C.ok, anchor: "start"});
    m += L.text(360, 40, c.family + "   ·   through (" + c.x0 + ", " + c.y0 + ")", {size: 18, color: C.text, weight: 700});
    L.svg(m, "A family of solution curves with the particular member through the marked point.", 290);
    L.readout([
      ["General solution", c.family, "#38bdf8"],
      ["Order of the equation", "1", C.muted],
      ["Initial condition", "y(" + c.x0 + ") = " + L.num(c.y0, 1)],
      ["Arbitrary constant C", L.num(c.C, 3), C.ok],
      ["Particular solution", familyWithC(c.family, c.C), C.ok]
    ]);
    L.verdict("<b>" + c.note + "</b> Every curve in grey is a solution; the single blue member is the particular solution selected by the initial condition.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["quad", "Parabolas y = x² + C"], ["exp", "Exponentials y = C eˣ"], ["sine", "Cosines y = cos x + C"], ["cubic", "Cubics y = x³/3 + C"]], st.preset, select);
    L.legend([["#94a3b8", "family members"], ["#38bdf8", "particular solution"], [C.ok, "initial point"]]);
    L.watch("Each preset shows one differential equation's whole family. The green dot is the initial condition that chooses the particular curve.");
    draw();
  }

  window.SIMS.desolution = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Variables separable (NCERT §9.4.1, Example 8)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "growth"};
  var CASES = {
    growth: {de: "dy/dx = y",         sep: "dy/y = dx",          integ: "log|y| = x + C",              fn: function(x, Cc){ return Cc * Math.exp(x); },          x0: 0, y0: 2, C: 2,    sol: "y = 2eˣ",              note: "Growth proportional to y: separating gives dy/y = dx and the exponential family."},
    decay:  {de: "dy/dx = −0.5y",     sep: "dy/y = −0.5 dx",     integ: "log|y| = −0.5x + C",          fn: function(x, Cc){ return Cc * Math.exp(-0.5 * x); },   x0: 0, y0: 4, C: 4,    sol: "y = 4e⁻⁰·⁵ˣ",        note: "Negative rate: the same separation produces exponential decay from the initial value."},
    square: {de: "dy/dx = 3x²",       sep: "dy = 3x² dx",        integ: "y = x³ + C",                  fn: function(x, Cc){ return x * x * x + Cc; },            x0: 1, y0: 2, C: 1,    sol: "y = x³ + 1",            note: "Pure x on the right: integrate directly and use y(1) = 2 to get C = 1."},
    prod:   {de: "dy/dx = (1 + x²)(1 + y²)", sep: "dy/(1 + y²) = (1 + x²)dx", integ: "tan⁻¹y = x + x³/3 + C", fn: function(x, Cc){ return Math.tan(x + x * x * x / 3 + Cc); }, x0: 0, y0: 0, C: 0, sol: "tan⁻¹y = x + x³/3", note: "Both sides integrate with standard antiderivatives, giving an implicit answer."}
  };

  function draw(){
    var c = CASES[st.preset];
    var f = axesFrame(90, 250, 540, 210, -3, 3, -2, 8);
    var m = drawAxes(f, "x", "y");
    var k;
    for(k = -2; k <= 2; k += 1){
      if(Math.abs(k - c.C) < 1e-9) continue;
      m += plotFunc(f, function(x){ return CASES[st.preset].fn(x, k); }, "rgba(148,163,184,.45)", 1.8);
    }
    m += plotFunc(f, function(x){ return CASES[st.preset].fn(x, c.C); }, "#38bdf8", 3.2);
    m += L.circle(f.X(c.x0), f.Y(c.y0), 7, C.ok);
    m += L.text(f.X(c.x0) + 10, f.Y(c.y0) - 10, "(" + c.x0 + ", " + c.y0 + ")", {size: 14, color: C.ok, anchor: "start"});
    m += L.text(360, 36, "Separate: " + c.sep, {size: 17, color: C.text, weight: 700});
    L.svg(m, "Solution family with the curve through the chosen initial point.", 290);
    L.readout([
      ["Differential equation", c.de, "#f59e0b"],
      ["Separated form", c.sep],
      ["After integrating", c.integ],
      ["Initial point", "(" + c.x0 + ", " + c.y0 + ")"],
      ["Constant C", L.num(c.C, 2), C.ok],
      ["Particular solution", c.sol, C.ok]
    ]);
    L.verdict("<b>" + c.note + "</b> The constant is fixed last: integrate first, then substitute the initial values.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["growth", "Growth dy/dx = y"], ["decay", "Decay dy/dx = −0.5y"], ["square", "Polynomial dy/dx = 3x²"], ["prod", "Product (1+x²)(1+y²)"]], st.preset, select);
    L.legend([["#94a3b8", "family members"], ["#38bdf8", "particular solution"], [C.ok, "initial point"]]);
    L.watch("Read the separated form first, then see the family it produces. The initial point picks the blue curve.");
    draw();
  }

  window.SIMS.deseparable = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Homogeneous equations and the scaling test (NCERT §9.4.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "ex13", lam: 2};
  var CASES = {
    ex13:  {f: "(x² + y²)/(2xy)", fv: function(x, y){ return (x * x + y * y) / (2 * x * y); }, n: 0, hom: true,  subst: "y = vx", bx: 1, by: 1, note: "NCERT Example 13: degree-0 function, so the equation is homogeneous and y = vx separates it."},
    ex10:  {f: "(x + 2y)/(x − y)", fv: function(x, y){ return (x + 2 * y) / (x - y); }, n: 0, hom: true,  subst: "y = vx", bx: 1, by: 2, note: "NCERT Example 10: scaling x and y by λ leaves the ratio unchanged — degree 0."},
    square:{f: "x² + xy", fv: function(x, y){ return x * x + x * y; }, n: 2, hom: true,  subst: "not needed (it is a function, not an ODE)", bx: 1, by: 1, note: "A polynomial with every term of total degree 2 is homogeneous of degree 2, but its ratio is not a degree-0 ODE."},
    nothom:{f: "sin x + cos y", fv: function(x, y){ return Math.sin(x) + Math.cos(y); }, n: null, hom: false, subst: "none — not homogeneous", bx: 1, by: 1, note: "Scaling by λ does not produce λⁿ times the original value, so this function is not homogeneous."}
  };

  function draw(){
    var c = CASES[st.preset];
    var lam = st.lam;
    var x = c.bx, y = c.by;
    var f1 = c.fv(x, y), f2 = c.fv(lam * x, lam * y);
    var m = "";
    var f = axesFrame(90, 250, 540, 210, -3, 3, -2, 8);
    m += drawAxes(f, "x", "y");
    m += L.circle(f.X(x), f.Y(y), 6, C.ok);
    m += L.text(f.X(x) + 8, f.Y(y) - 8, "P(" + x + ", " + y + ")", {size: 13, color: C.ok, anchor: "start"});
    if(lam * y > -2 && lam * y < 8.4){
      m += L.circle(f.X(lam * x), f.Y(lam * y), 6, "#38bdf8");
      m += L.text(f.X(lam * x) + 8, f.Y(lam * y) - 8, "P(" + L.num(lam * x, 1) + ", " + L.num(lam * y, 1) + ")", {size: 13, color: "#38bdf8", anchor: "start"});
      m += L.line(f.X(x), f.Y(y), f.X(lam * x), f.Y(lam * y), C.faint, 1.5, "6 4");
    }
    m += L.text(360, 38, "F(x, y) = " + c.f + "    ·    λ = " + L.num(lam, 1), {size: 17, color: C.text, weight: 700});
    L.svg(m, "Scaling a point and comparing F at the scaled point with lambda to the power n times F.", 290);
    L.readout([
      ["F(x, y) at (" + x + ", " + y + ")", L.num(f1, 3), C.ok],
      ["F at (λx, λy)", L.num(f2, 3), "#38bdf8"],
      ["λⁿ F(x, y)", c.hom ? L.num(Math.pow(lam, c.n) * f1, 3) : "not equal in general", c.hom ? C.ok : C.danger],
      ["Homogeneous?", c.hom ? ("yes, degree " + c.n) : "no", c.hom ? C.ok : C.danger],
      ["Substitution for the ODE", c.subst]
    ]);
    L.verdict("<b>" + c.note + "</b> The scaling test is exact: for a homogeneous function the two readout values agree at every λ.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["ex13", "(x²+y²)/(2xy)"], ["ex10", "(x+2y)/(x−y)"], ["square", "x² + xy (degree 2)"], ["nothom", "sin x + cos y"]], st.preset, select);
    L.controls(L.slider("hom-lam", "Scaling factor λ", 1, 3, 0.5, st.lam, "λ = " + L.num(st.lam, 1)));
    L.onInput("hom-lam", function(v){ st.lam = v; L.setVal("hom-lam", "λ = " + L.num(v, 1)); draw(); });
    L.legend([["#38bdf8", "scaled point"], [C.ok, "base point"], [C.danger, "not homogeneous"]]);
    L.watch("Slide λ and compare F(λ, λ) with λⁿF(1, 1). They agree exactly for homogeneous functions.");
    draw();
  }

  window.SIMS.dehomogeneous = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Linear equations and integrating factors (NCERT §9.4.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "lin1", x: 2};
  var CASES = {
    lin1: {p: "2", q: "sin x", pint: "2x", ifx: function(x){ return Math.exp(2 * x); }, ifs: "e²ˣ", note: "NCERT Exercise 9.5 Q1: P is the constant 2, so the integrating factor is e²ˣ."},
    lin2: {p: "3", q: "e⁻²ˣ", pint: "3x", ifx: function(x){ return Math.exp(3 * x); }, ifs: "e³ˣ", note: "NCERT Exercise 9.5 Q2: the free exponential cancels against the IF, leaving ∫eˣ dx."},
    lin3: {p: "1/x", q: "x²", pint: "log x (x > 0)", ifx: function(x){ return x; }, ifs: "x", note: "NCERT Exercise 9.5 Q3: ∫(1/x)dx = log x, so the integrating factor is x."},
    lin7: {p: "1/(x log x)", q: "2/x²", pint: "log(log x) (x > 1)", ifx: function(x){ return Math.log(x); }, ifs: "log x", note: "NCERT Exercise 9.5 Q7: the nested logarithm collapses to IF = log x."}
  };

  function draw(){
    var c = CASES[st.preset];
    var x = st.x;
    if(x < 1.1) x = 1.1;
    var ifv = c.ifx(x);
    var m = "";
    var f = axesFrame(90, 250, 540, 210, 0, 4, 0, 12);
    m += drawAxes(f, "x", "y");
    m += plotFunc(f, c.ifx, "#38bdf8", 3);
    if(x <= 4 && ifv <= 12){
      m += L.circle(f.X(x), f.Y(ifv), 7, C.ok);
      m += L.text(f.X(x) + 10, f.Y(ifv) - 8, "IF(" + L.num(x, 1) + ") = " + L.num(ifv, 2), {size: 13, color: C.ok, anchor: "start"});
    }
    m += L.text(360, 38, "y′ + P(x)y = Q(x)   with P = " + c.p + ", Q = " + c.q, {size: 17, color: C.text, weight: 700});
    L.svg(m, "Graph of the integrating factor as a function of x with the current x marked.", 290);
    L.readout([
      ["P(x)", c.p, "#f59e0b"],
      ["Q(x)", c.q, "#f59e0b"],
      ["∫P dx", c.pint],
      ["Integrating factor", c.ifs, "#38bdf8"],
      ["IF at x = " + L.num(x, 1), L.num(ifv, 3), C.ok],
      ["Solution", "y·IF = ∫Q·IF dx + C"]
    ]);
    L.verdict("<b>" + c.note + "</b> The graph is the integrating factor itself; at every x the formula y·IF = ∫Q·IF dx + C turns the left side into one product derivative.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["lin1", "y′ + 2y = sin x"], ["lin2", "y′ + 3y = e⁻²ˣ"], ["lin3", "y′ + y/x = x²"], ["lin7", "x log x y′ + y = 2log x"]], st.preset, select);
    L.controls(L.slider("lin-x", "Evaluation point x", 1.1, 4, 0.1, st.x, "x = " + L.num(st.x, 1)));
    L.onInput("lin-x", function(v){ st.x = v; L.setVal("lin-x", "x = " + L.num(v, 1)); draw(); });
    L.legend([[C.ok, "IF at x"], ["#38bdf8", "integrating factor"]]);
    L.watch("Choose an equation, then move x. The readout shows P, Q, ∫P dx and the integrating factor at the chosen point.");
    draw();
  }

  window.SIMS.delinear = {mount: mount, draw: draw, select: select, state: st};
})();
