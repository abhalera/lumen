// Class 12 Mathematics, Chapter 5 (lemh105) - simulation labs.
// One tailored lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// A visible reset control inside #lab-controls: the shared app restores every
// range to its mount-time value when this button is clicked.
function clamp(v, lo, hi){
  return Math.max(lo, Math.min(hi, Number(v)));
}

function labReset(id, label){
  return '<div class="control-item"><button type="button" class="toolbar-btn" id="' + id + '">↺ ' + (label || "Reset bench") + '</button></div>';
}

// -------------------------------------------------------------------------
// Lab 1 - Limit and continuity microscope (NCERT 5.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var INFO = {
    hole: {
      name: "f(x) = (x² − 1)/(x − 1)",
      a: 1,
      left: "2.00", right: "2.00", value: "not defined (hole)",
      verdict: "<b>Removable discontinuity at 1:</b> both one-sided limits are 2.00 but f(1) is not defined, so the hole can be filled by setting f(1) = 2."
    },
    jump: {
      name: "f(x) = x for x ≤ 1, f(x) = 5 for x > 1",
      a: 1,
      left: "1.00", right: "5.00", value: "1.00",
      verdict: "<b>Jump discontinuity at 1:</b> the left limit is 1.00 while the right limit is 5.00, so the two-sided limit does not exist."
    },
    continuous: {
      name: "f(x) = x²",
      a: 1,
      left: "1.00", right: "1.00", value: "1.00",
      verdict: "<b>Continuous at 1:</b> left limit, right limit and f(1) all equal 1.00, so lim(x→1) f(x) = f(1)."
    },
    infinite: {
      name: "f(x) = 1/x",
      a: 0,
      left: "→ −∞", right: "→ +∞", value: "not defined at 0",
      verdict: "<b>Infinite discontinuity at 0:</b> as x → 0⁻ the values fall without bound and as x → 0⁺ they rise without bound; there is no real limit."
    }
  };
  var st = {preset: "hole", x: 1.6};
  var SPAN = 1.5;

  function value(fx, x){
    if(fx === "hole") return (Math.abs(x - 1) < 1e-9) ? null : (x * x - 1) / (x - 1);
    if(fx === "jump") return x <= 1 ? x : 5;
    if(fx === "continuous") return x * x;
    if(fx === "infinite") return Math.abs(x) < 1e-9 ? null : 1 / x;
    return 0;
  }

  function draw(){
    var info = INFO[st.preset];
    var a = info.a;
    var m = "";
    var X = function(x){ return 90 + (x - (a - SPAN)) * 180; };
    var Y = function(y){ return 235 - Math.max(-4.4, Math.min(4.4, y)) * 34; };
    m += L.line(90, Y(0), 630, Y(0), C.muted, 1.5);
    m += L.line(X(a), 45, X(a), 260, C.faint, 1.5, "6 5");
    m += L.text(X(a), 38, "x = " + L.num(a, 0), {size: 14, color: C.muted});
    m += L.text(632, Y(0) - 8, "x", {size: 14, color: C.text, anchor: "end"});
    m += L.text(86, 52, "y", {size: 14, color: C.text, anchor: "end"});
    var i, prev = null;
    for(i = 0; i <= 150; i += 1){
      var x = a - SPAN + (3 * SPAN) * i / 150;
      var y = value(st.preset, x);
      if(y === null || Math.abs(x - a) < 0.015){
        prev = null;
        continue;
      }
      var px = X(x), py = Y(y);
      if(prev){
        m += L.line(prev[0], prev[1], px, py, "#38bdf8", 2.6);
      }
      prev = [px, py];
    }
    var probe = value(st.preset, st.x);
    if(probe !== null){
      m += L.circle(X(st.x), Y(probe), 6, C.ok);
      m += L.text(X(st.x), Y(probe) - 14, "(" + L.num(st.x, 2) + ", " + L.num(probe, 2) + ")", {size: 13, color: C.ok});
    } else {
      m += L.circle(X(st.x), Y(0), 6, C.danger);
      m += L.text(X(st.x), Y(0) - 14, "(x = " + L.num(st.x, 2) + ", no value)", {size: 13, color: C.danger});
    }
    m += L.text(360, 285, "probe the point x = " + L.num(st.x, 2) + " and compare limits with the value at " + L.num(a, 0), {size: 14, color: C.muted});
    L.svg(m, "Graph of " + info.name.replace(/<[^>]+>/g, "") + " with the probe point marked.", 300);
    L.readout([
      ["Function", info.name],
      ["Probe point", "x = " + L.num(st.x, 2) + (probe === null ? ", f(x) not defined here" : ", f(x) = " + L.num(probe, 2))],
      ["Left limit at " + L.num(a, 0), info.left],
      ["Right limit at " + L.num(a, 0), info.right],
      ["Value f(" + L.num(a, 0) + ")", info.value]
    ]);
    L.verdict(info.verdict);
  }

  function select(id){
    st.preset = id;
    st.x = INFO[id].a + 0.6;
    L.markPreset(id);
    L.controls(L.slider("t1-x", "Probe point x", INFO[id].a - 1.4, INFO[id].a + 1.4, 0.05, st.x, L.num(st.x, 2)) + labReset("t1-reset"));
    L.onInput("t1-x", function(v){ st.x = v; L.setVal("t1-x", L.num(v, 2)); draw(); });
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["hole", "Removable hole"], ["jump", "Jump"], ["continuous", "Continuous"], ["infinite", "Infinite 1/x"]], st.preset, select);
    L.legend([["#38bdf8", "graph of f"], [C.ok, "probe point"], [C.danger, "point with no value"]]);
    L.watch("Slide the probe point across the marked x-value. The function is continuous there exactly when the left limit, right limit and value agree.");
    select(st.preset);
  }

  window.SIMS.limitlab = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 - Differentiability, chain and implicit bench (NCERT 5.3-5.3.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var INFO = {
    smooth:  {name: "f(x) = x³ − 3x at x = 1", a: 1, kind: "quotient", note: "For a polynomial the two one-sided quotients approach the same number, so f′(1) exists."},
    corner:  {name: "f(x) = |x − 1| at x = 1", a: 1, kind: "quotient", note: "The left quotient is locked at −1 and the right quotient at +1, so the corner has no derivative."},
    floor:   {name: "f(x) = [x] at x = 1", a: 1, kind: "floor", note: "The greatest-integer function jumps at 1: the left quotient grows without bound while the right quotient is 0."},
    implicit:{name: "x² + xy + y² = 100", a: 3, kind: "implicit", note: "Differentiate both sides and solve for dy/dx: the slope depends on both x and y."}
  };
  var st = {preset: "smooth", h: 0.2, x: 3};

  function fScalar(preset, x){
    if(preset === "smooth") return x * x * x - 3 * x;
    if(preset === "corner") return Math.abs(x - 1);
    return 0;
  }

  function drawQuotient(){
    var info = INFO[st.preset];
    var a = info.a, h = st.h;
    var lq, rq;
    if(st.preset === "floor"){
      lq = "→ +∞";
      rq = "0.00";
    } else {
      var fa = fScalar(st.preset, a);
      lq = (fScalar(st.preset, a - h) - fa) / (-h);
      rq = (fScalar(st.preset, a + h) - fa) / h;
    }
    var m = "";
    var X = function(x){ return 120 + (x - (a - 1.2)) * 200; };
    var Y = function(y){ return 220 - y * 26; };
    m += L.line(120, Y(0), 620, Y(0), C.muted, 1.5);
    m += L.line(X(a), 40, X(a), 255, C.faint, 1.5, "6 5");
    var i, prev = null;
    for(i = 0; i <= 120; i += 1){
      var x = a - 1.2 + 2.4 * i / 120;
      var y = fScalar(st.preset, x);
      if(Math.abs(x - a) < 0.012){ prev = null; continue; }
      if(prev) m += L.line(prev[0], prev[1], X(x), Y(y), "#38bdf8", 2.6);
      prev = [X(x), Y(y)];
    }
    if(st.preset !== "floor"){
      m += L.arrow(X(a), Y(fScalar(st.preset, a)), X(a - h), Y(fScalar(st.preset, a - h)), C.danger, 2.5);
      m += L.arrow(X(a), Y(fScalar(st.preset, a)), X(a + h), Y(fScalar(st.preset, a + h)), C.ok, 2.5);
      m += L.text(X(a - h), Y(fScalar(st.preset, a - h)) - 12, "h = −" + L.num(h, 2), {size: 13, color: C.danger});
      m += L.text(X(a + h), Y(fScalar(st.preset, a + h)) - 12, "h = +" + L.num(h, 2), {size: 13, color: C.ok});
    } else {
      m += L.text(360, 120, "staircase: the left side sits one step below the value at 1", {size: 15, color: C.danger});
    }
    L.svg(m, "Secant slopes on the two sides of x = " + L.num(a, 0) + ".", 300);
    L.readout([
      ["Function", info.name],
      ["Step h", L.num(h, 2)],
      ["Left quotient", (typeof lq === "number" ? L.num(lq, 2) : lq), C.danger],
      ["Right quotient", (typeof rq === "number" ? L.num(rq, 2) : rq), C.ok]
    ]);
    if(st.preset === "smooth") L.verdict("<b>Differentiable at 1:</b> both one-sided quotients approach 0 as h → 0, so f′(1) = 0 exists.");
    else if(st.preset === "corner") L.verdict("<b>Not differentiable at 1:</b> the left quotient is −1.00 and the right quotient is +1.00 for every h; the two-sided limit does not exist.");
    else L.verdict("<b>Not differentiable at 1:</b> the left quotient grows without bound as h → 0⁻ while the right quotient stays 0.00 — a jump gives no derivative.");
  }

  function drawImplicit(){
    var x = st.x;
    var y = (-x + Math.sqrt(400 - 3 * x * x)) / 2;
    var slope = -(2 * x + y) / (x + 2 * y);
    var m = "";
    var X = function(v){ return 90 + (v + 12) * 24; };
    var Y = function(v){ return 235 - v * 11; };
    m += L.line(90, Y(0), 660, Y(0), C.muted, 1.5);
    m += L.line(X(0), 40, X(0), 270, C.muted, 1.5);
    var i, upper = [], lower = [];
    for(i = -11; i <= 11; i += 0.25){
      var root = 400 - 3 * i * i;
      if(root < 0) continue;
      upper.push([X(i), Y((-i + Math.sqrt(root)) / 2)]);
      lower.push([X(i), Y((-i - Math.sqrt(root)) / 2)]);
    }
    for(i = 1; i < upper.length; i += 1){
      m += L.line(upper[i - 1][0], upper[i - 1][1], upper[i][0], upper[i][1], "#38bdf8", 2.4);
      m += L.line(lower[i - 1][0], lower[i - 1][1], lower[i][0], lower[i][1], "#93c5fd", 1.4);
    }
    m += L.circle(X(x), Y(y), 6, C.ok);
    m += L.text(X(x), Y(y) - 14, "(" + L.num(x, 2) + ", " + L.num(y, 2) + ")", {size: 13, color: C.ok});
    var dx = 1.6, dy = slope * dx;
    m += L.line(X(x - dx), Y(y - dy), X(x + dx), Y(y + dy), C.danger, 2.6);
    L.svg(m, "Implicit curve x² + xy + y² = 100 with the tangent at the chosen point.", 300);
    L.readout([
      ["Curve", "x² + xy + y² = 100"],
      ["Point", "(" + L.num(x, 2) + ", " + L.num(y, 2) + ")"],
      ["dy/dx = −(2x + y)/(x + 2y)", L.num(slope, 2), C.danger]
    ]);
    L.verdict("<b>Implicit differentiation:</b> differentiate both sides treating y as y(x), collect dy/dx and substitute the point. The tangent at the chosen point has the slope shown.");
  }

  function draw(){
    if(st.preset === "implicit") drawImplicit();
    else drawQuotient();
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    if(id === "implicit"){
      st.x = 3;
      L.controls(L.slider("t2-x", "Point coordinate x", 1, 8, 0.1, st.x, L.num(st.x, 2)) + labReset("t2-reset"));
      L.onInput("t2-x", function(v){ st.x = clamp(v, 1, 8); L.setVal("t2-x", L.num(st.x, 2)); draw(); });
    } else {
      st.h = 0.2;
      L.controls(L.slider("t2-h", "Step size h", 0.02, 0.4, 0.02, st.h, L.num(st.h, 2)) + labReset("t2-reset"));
      L.onInput("t2-h", function(v){ st.h = clamp(v, 0.02, 0.4); L.setVal("t2-h", L.num(st.h, 2)); draw(); });
    }
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["smooth", "Smooth cubic"], ["corner", "Corner |x−1|"], ["floor", "Floor [x]"], ["implicit", "Implicit curve"]], st.preset, select);
    L.legend([["#38bdf8", "curve"], [C.danger, "left secant"], [C.ok, "right secant"]]);
    L.watch("Shrink h and compare the left and right quotients. Equal limits mean differentiability; different limits or blow-up mean no derivative.");
    select(st.preset);
  }

  window.SIMS.derivlab = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 - Exponential and logarithm bench (NCERT 5.4-5.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var INFO = {
    exp:    {name: "eˣ", rule: "(eˣ)′ = eˣ", note: "The exponential curve is its own tangent line at every point: slope equals value."},
    base2:  {name: "2ˣ", rule: "(aˣ)′ = aˣ log a with a = 2", note: "A general base a contributes the constant factor log a; here log 2 ≈ 0.6931."},
    ln:     {name: "log x", rule: "(log x)′ = 1/x", note: "The logarithm's slope is the reciprocal of x, so the tangent is steep near 0 and flat far away."},
    power:  {name: "xˣ", rule: "log-differentiation: y′ = xˣ(1 + log x)", note: "Both base and exponent contain x, so take logarithms before differentiating."}
  };
  var st = {preset: "exp", x: 1};

  function fScalar(preset, x){
    if(preset === "exp") return Math.exp(x);
    if(preset === "base2") return Math.pow(2, x);
    if(preset === "ln") return Math.log(x);
    return Math.pow(x, x);
  }

  function dScalar(preset, x){
    if(preset === "exp") return Math.exp(x);
    if(preset === "base2") return Math.pow(2, x) * Math.LN2;
    if(preset === "ln") return 1 / x;
    return Math.pow(x, x) * (1 + Math.log(x));
  }

  function draw(){
    var info = INFO[st.preset];
    var f = fScalar(st.preset, st.x), d = dScalar(st.preset, st.x);
    var ymax = st.preset === "exp" ? 12 : (st.preset === "base2" ? 8 : 4);
    var X = function(x){ return 90 + x * 160; };
    var Y = function(y){ return 250 - Math.min(y, ymax) / ymax * 190; };
    var m = "";
    m += L.line(90, Y(0), 640, Y(0), C.muted, 1.5);
    m += L.line(90, 40, 90, 260, C.muted, 1.5);
    var i, prev = null;
    for(i = 0; i <= 180; i += 1){
      var x = 0.05 + (3 - 0.05) * i / 180;
      var y = fScalar(st.preset, x);
      if(!isFinite(y)) continue;
      if(prev) m += L.line(prev[0], prev[1], X(x), Y(y), "#38bdf8", 2.6);
      prev = [X(x), Y(y)];
    }
    m += L.circle(X(st.x), Y(f), 6, C.ok);
    var tx = 0.55, ty = f - d * (st.x - tx);
    m += L.line(X(tx), Y(ty), X(st.x + 0.45), Y(f + d * 0.45), C.danger, 2.4);
    m += L.text(X(st.x), Y(f) - 14, "(" + L.num(st.x, 2) + ", " + L.num(f, 3) + ")", {size: 13, color: C.ok});
    L.svg(m, "Graph of " + info.name.replace(/<[^>]+>/g, "") + " with the tangent at the probe point.", 300);
    L.readout([
      ["Function", info.name],
      ["x", L.num(st.x, 2)],
      ["f(x)", L.num(f, 3)],
      ["f′(x)", L.num(d, 3), C.danger],
      ["Rule", info.rule]
    ]);
    L.verdict("<b>" + info.name + ":</b> " + info.note);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["exp", "eˣ"], ["base2", "2ˣ"], ["ln", "log x"], ["power", "xˣ"]], st.preset, select);
    L.controls(L.slider("t3-x", "Probe point x", 0.1, 3, 0.05, st.x, L.num(st.x, 2)) + labReset("t3-reset"));
    L.onInput("t3-x", function(v){ st.x = clamp(v, 0.05, 3); L.setVal("t3-x", L.num(st.x, 2)); draw(); });
    L.legend([["#38bdf8", "curve"], [C.ok, "probe point"], [C.danger, "tangent line"]]);
    L.watch("Slide x and watch whether the slope equals the value. For eˣ they are always identical; for aˣ they differ by the constant factor log a.");
    draw();
  }

  window.SIMS.exploglab = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 - Parametric and second-order bench (NCERT 5.6-5.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var INFO = {
    circle:  {name: "x = cos θ, y = sin θ", kind: "param", note: "The slope is dy/dx = (dy/dθ)/(dx/dθ) = −cot θ."},
    cycloid: {name: "x = θ − sin θ, y = 1 + cos θ", kind: "param", note: "The cycloid of Exercise 5.6 has dy/dx = −sin θ/(1 − cos θ) = −cot(θ/2), so the equation separates into a ratio of rates."},
    cubic:   {name: "y = x³ − 3x", kind: "second", note: "f″(x) = 6x: negative for x < 0 (concave down) and positive for x > 0 (concave up)."},
    sine:    {name: "y = sin x", kind: "second", note: "f″(x) = −sin x = −f(x): the sine curve bends away from the x-axis wherever it rises above it."}
  };
  var st = {preset: "circle", t: 1, x: 1};

  function X(v){ return 90 + (v + 1.6) * 165; }
  function Y(v){ return 200 - v * 70; }

  function drawParam(){
    var info = INFO[st.preset];
    var t = st.t, x, y, dx, dy;
    if(st.preset === "circle"){
      x = Math.cos(t); y = Math.sin(t); dx = -Math.sin(t); dy = Math.cos(t);
    } else {
      x = t - Math.sin(t); y = 1 + Math.cos(t); dx = 1 - Math.cos(t); dy = -Math.sin(t);
    }
    var slope = dy / dx;
    var m = "";
    m += L.line(70, 200, 650, 200, C.muted, 1.5);
    m += L.line(90, 40, 90, 280, C.muted, 1.5);
    var i, prev = null;
    for(i = 0; i <= 180; i += 1){
      var u = 0.05 + (6.2 - 0.05) * i / 180;
      var px, py;
      if(st.preset === "circle"){ px = Math.cos(u); py = Math.sin(u); }
      else { px = u - Math.sin(u); py = 1 + Math.cos(u); }
      if(px < -1.6 || px > 3.4) continue;
      if(prev) m += L.line(prev[0], prev[1], X(px), Y(py), "#38bdf8", 2.6);
      prev = [X(px), Y(py)];
    }
    m += L.circle(X(x), Y(y), 6, C.ok);
    m += L.line(X(x - 0.35 * dx), Y(y - 0.35 * dy), X(x + 0.35 * dx), Y(y + 0.35 * dy), C.danger, 2.4);
    m += L.text(X(x), Y(y) - 14, "t = " + L.num(t, 2), {size: 13, color: C.ok});
    L.svg(m, "Parametric curve " + info.name + " with the tangent at the marked parameter.", 300);
    L.readout([
      ["Curve", info.name],
      ["Parameter t", L.num(t, 2)],
      ["dx/dt", L.num(dx, 3)],
      ["dy/dt", L.num(dy, 3)],
      ["dy/dx = (dy/dt)/(dx/dt)", L.num(slope, 3), C.danger]
    ]);
    L.verdict("<b>" + info.name + ":</b> " + info.note);
  }

  function drawSecond(){
    var info = INFO[st.preset];
    var x = st.x;
    var f, d1, d2;
    if(st.preset === "cubic"){ f = x * x * x - 3 * x; d1 = 3 * x * x - 3; d2 = 6 * x; }
    else { f = Math.sin(x); d1 = Math.cos(x); d2 = -Math.sin(x); }
    var m = "";
    var gx = function(v){ return 90 + v * 90; };
    var gy = function(v){ return 190 - v * 28; };
    m += L.line(90, gy(0), 650, gy(0), C.muted, 1.5);
    m += L.line(gx(0), 40, gx(0), 280, C.muted, 1.5);
    var i, prev = null;
    for(i = 0; i <= 180; i += 1){
      var v = -0.6 + 3.6 * i / 180;
      var y = st.preset === "cubic" ? v * v * v - 3 * v : Math.sin(v);
      if(prev) m += L.line(prev[0], prev[1], gx(v), gy(y), "#38bdf8", 2.6);
      prev = [gx(v), gy(y)];
    }
    m += L.circle(gx(x), gy(f), 6, C.ok);
    m += L.text(gx(x), gy(f) - 14, "x = " + L.num(x, 2), {size: 13, color: C.ok});
    L.svg(m, "Graph of " + info.name + " with the moving point.", 300);
    L.readout([
      ["Function", info.name],
      ["Point x", L.num(x, 2)],
      ["f(x)", L.num(f, 3)],
      ["f′(x)", L.num(d1, 3), C.ok],
      ["f″(x)", L.num(d2, 3), C.danger],
      ["Concavity", d2 > 0 ? "concave up" : (d2 < 0 ? "concave down" : "flat inflection")]
    ]);
    L.verdict("<b>" + info.name + ":</b> " + info.note);
  }

  function draw(){
    if(INFO[st.preset].kind === "param") drawParam();
    else drawSecond();
  }

  function select(id){
    st.preset = id;
    st.t = 1;
    st.x = 1;
    L.markPreset(id);
    if(INFO[id].kind === "param"){
      L.controls(L.slider("t4-t", "Parameter t", 0.2, 6.0, 0.05, st.t, L.num(st.t, 2)) + labReset("t4-reset"));
      L.onInput("t4-t", function(v){ st.t = clamp(v, 0.1, 6); L.setVal("t4-t", L.num(st.t, 2)); draw(); });
    } else {
      L.controls(L.slider("t4-x", "Point x", 0.2, 3.0, 0.05, st.x, L.num(st.x, 2)) + labReset("t4-reset"));
      L.onInput("t4-x", function(v){ st.x = clamp(v, 0.05, 3); L.setVal("t4-x", L.num(st.x, 2)); draw(); });
    }
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["circle", "Circle"], ["cycloid", "Cycloid"], ["cubic", "Cubic f″"], ["sine", "Sine f″"]], st.preset, select);
    L.legend([["#38bdf8", "curve"], [C.ok, "moving point"], [C.danger, "tangent / f″"]]);
    L.watch("For the parametric presets the slope is the ratio of vertical to horizontal rate. For the second-order presets the sign of f″ sets the concavity.");
    select(st.preset);
  }

  window.SIMS.paramsecondlab = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 - Mixed derivative workbench (Miscellaneous Exercise)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var INFO = {
    chain:     {name: "(3x² − 9x + 5)⁹", rule: "Chain rule", kind: "poly"},
    logdiff:   {name: "(5x)<sup>3 cos 2x</sup>", rule: "Logarithmic differentiation", kind: "poly"},
    implicit:  {name: "x² + xy + y² = 100", rule: "Implicit differentiation", kind: "implicit"},
    parametric:{name: "cycloid x = a(θ − sin θ), y = a(1 + cos θ)", rule: "Parametric differentiation: dy/dx = (dy/dt)/(dx/dt)", kind: "param"},
    second:    {name: "y = x³ − 3x", rule: "Second-order derivative", kind: "second"}
  };
  var st = {preset: "chain", x: 1, t: 1};

  function drawPoly(){
    var x = st.x, f, d;
    if(st.preset === "chain"){
      var base = 3 * x * x - 9 * x + 5;
      f = Math.pow(base, 9);
      d = 27 * (2 * x - 3) * Math.pow(base, 8);
    } else {
      f = Math.pow(5 * x, 3 * Math.cos(2 * x));
      d = f * (3 * Math.cos(2 * x) / x - 6 * Math.sin(2 * x) * Math.log(5 * x));
    }
    var m = "";
    m += L.rect(70, 60, 580, 70, "#132033", ' rx="12" stroke="#334155" stroke-width="1.5"');
    m += L.text(360, 90, "f(x) = " + INFO[st.preset].name, {size: 20, weight: 700, color: C.text});
    m += L.text(360, 115, "rule: " + INFO[st.preset].rule, {size: 14, color: C.ok});
    m += L.rect(70, 160, 580, 80, "#132033", ' rx="12" stroke="#334155" stroke-width="1.5"');
    m += L.text(160, 195, "x = " + L.num(x, 2), {size: 17, color: C.muted});
    m += L.text(360, 195, "f(x) = " + L.num(f, 3), {size: 17, color: "#38bdf8"});
    m += L.text(560, 195, "f′(x) = " + L.num(d, 3), {size: 17, color: C.danger});
    m += L.text(360, 225, "classify the function, then apply the matching rule", {size: 14, color: C.muted});
    L.svg(m, "Rule-selection workbench for " + INFO[st.preset].name + ".", 300);
    L.readout([
      ["Function", INFO[st.preset].name],
      ["Rule", INFO[st.preset].rule],
      ["At", "x = " + L.num(x, 2)],
      ["f(x)", L.num(f, 3)],
      ["f′(x)", L.num(d, 3), C.danger]
    ]);
    L.verdict("<b>" + INFO[st.preset].rule + ":</b> identify the structure first — composite, power tower, constrained curve, parameter pair or repeated derivative — then differentiate.");
  }

  function drawImplicit(){
    var x = st.x;
    var y = (-x + Math.sqrt(400 - 3 * x * x)) / 2;
    var slope = -(2 * x + y) / (x + 2 * y);
    var m = "";
    m += L.rect(70, 60, 580, 70, "#132033", ' rx="12" stroke="#334155" stroke-width="1.5"');
    m += L.text(360, 90, "f: x² + xy + y² = 100", {size: 20, weight: 700, color: C.text});
    m += L.text(360, 115, "rule: " + INFO.implicit.rule, {size: 14, color: C.ok});
    m += L.rect(70, 160, 580, 80, "#132033", ' rx="12" stroke="#334155" stroke-width="1.5"');
    m += L.text(180, 195, "point (" + L.num(x, 2) + ", " + L.num(y, 2) + ")", {size: 17, color: "#38bdf8"});
    m += L.text(520, 195, "dy/dx = " + L.num(slope, 3), {size: 17, color: C.danger});
    m += L.text(360, 225, "differentiate both sides, then collect dy/dx", {size: 14, color: C.muted});
    L.svg(m, "Implicit differentiation workbench at the chosen point.", 300);
    L.readout([
      ["Relation", "x² + xy + y² = 100"],
      ["Rule", INFO.implicit.rule],
      ["Point", "(" + L.num(x, 2) + ", " + L.num(y, 2) + ")"],
      ["dy/dx", L.num(slope, 3), C.danger]
    ]);
    L.verdict("<b>Implicit differentiation:</b> differentiate the relation term by term, treat y as y(x), and solve for dy/dx at the chosen point.");
  }

  function drawParam(){
    var t = st.t;
    var dx = 1 - Math.cos(t), dy = -Math.sin(t);
    var slope = dy / dx;
    var m = "";
    m += L.rect(70, 60, 580, 70, "#132033", ' rx="12" stroke="#334155" stroke-width="1.5"');
    m += L.text(360, 90, "cycloid: x = θ − sin θ, y = 1 + cos θ", {size: 19, weight: 700, color: C.text});
    m += L.text(360, 115, "rule: " + INFO.parametric.rule, {size: 14, color: C.ok});
    m += L.rect(70, 160, 580, 80, "#132033", ' rx="12" stroke="#334155" stroke-width="1.5"');
    m += L.text(150, 195, "θ = " + L.num(t, 2), {size: 17, color: C.muted});
    m += L.text(330, 195, "dx/dθ = " + L.num(dx, 3), {size: 17, color: "#38bdf8"});
    m += L.text(510, 195, "dy/dθ = " + L.num(dy, 3), {size: 17, color: "#f59e0b"});
    m += L.text(360, 262, "dy/dx = (dy/dθ)/(dx/dθ) = " + L.num(slope, 3), {size: 19, weight: 700, color: C.danger});
    L.svg(m, "Parametric differentiation workbench on the cycloid.", 300);
    L.readout([
      ["Curve", INFO.parametric.name],
      ["Rule", INFO.parametric.rule],
      ["Parameter θ", L.num(t, 2)],
      ["dx/dθ", L.num(dx, 3)],
      ["dy/dθ", L.num(dy, 3)],
      ["dy/dx", L.num(slope, 3), C.danger]
    ]);
    L.verdict("<b>Parametric differentiation:</b> compute the two rates separately and divide; the slope describes the curve without eliminating the parameter.");
  }

  function drawSecond(){
    var x = st.x;
    var f = x * x * x - 3 * x, d1 = 3 * x * x - 3, d2 = 6 * x;
    var m = "";
    m += L.rect(70, 60, 580, 70, "#132033", ' rx="12" stroke="#334155" stroke-width="1.5"');
    m += L.text(360, 90, "y = x³ − 3x", {size: 20, weight: 700, color: C.text});
    m += L.text(360, 115, "rule: " + INFO.second.rule, {size: 14, color: C.ok});
    m += L.rect(70, 155, 580, 95, "#132033", ' rx="12" stroke="#334155" stroke-width="1.5"');
    m += L.text(150, 190, "x = " + L.num(x, 2), {size: 17, color: C.muted});
    m += L.text(340, 190, "f(x) = " + L.num(f, 3), {size: 17, color: "#38bdf8"});
    m += L.text(540, 190, "f′(x) = " + L.num(d1, 3), {size: 17, color: "#f59e0b"});
    m += L.text(360, 225, "f″(x) = " + L.num(d2, 3) + "  ·  " + (d2 > 0 ? "concave up" : (d2 < 0 ? "concave down" : "flat")), {size: 18, weight: 700, color: C.danger});
    L.svg(m, "Second-order derivative workbench.", 300);
    L.readout([
      ["Function", INFO.second.name],
      ["Rule", INFO.second.rule],
      ["At", "x = " + L.num(x, 2)],
      ["f(x)", L.num(f, 3)],
      ["f′(x)", L.num(d1, 3), "#f59e0b"],
      ["f″(x)", L.num(d2, 3), C.danger]
    ]);
    L.verdict("<b>Second-order derivative:</b> differentiate once for the slope, then again for the concavity; the sign of f″ tells you which way the curve bends.");
  }

  function draw(){
    var kind = INFO[st.preset].kind;
    if(kind === "implicit") drawImplicit();
    else if(kind === "param") drawParam();
    else if(kind === "second") drawSecond();
    else drawPoly();
  }

  function select(id){
    st.preset = id;
    st.x = 1;
    st.t = 1;
    L.markPreset(id);
    var kind = INFO[id].kind;
    if(kind === "implicit"){
      st.x = 3;
      L.controls(L.slider("t5-x", "Point coordinate x", 1, 8, 0.1, st.x, L.num(st.x, 2)) + labReset("t5-reset"));
      L.onInput("t5-x", function(v){ st.x = clamp(v, 0.1, 8); L.setVal("t5-x", L.num(st.x, 2)); draw(); });
    } else if(kind === "param"){
      L.controls(L.slider("t5-t", "Parameter θ", 0.2, 6.0, 0.05, st.t, L.num(st.t, 2)) + labReset("t5-reset"));
      L.onInput("t5-t", function(v){ st.t = clamp(v, 0.1, 6); L.setVal("t5-t", L.num(st.t, 2)); draw(); });
    } else {
      L.controls(L.slider("t5-x", "Probe point x", 0.5, 2.0, 0.1, st.x, L.num(st.x, 2)) + labReset("t5-reset"));
      L.onInput("t5-x", function(v){ st.x = clamp(v, 0.1, 8); L.setVal("t5-x", L.num(st.x, 2)); draw(); });
    }
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["chain", "Chain"], ["logdiff", "Variable power"], ["implicit", "Implicit"], ["parametric", "Parametric"], ["second", "Second order"]], st.preset, select);
    L.legend([["#38bdf8", "function value"], [C.danger, "derivative"], [C.ok, "rule chosen"]]);
    L.watch("Select a structure and slide the probe. The workbench names the rule, then shows the function and its derivative at the chosen point.");
    select(st.preset);
  }

  window.SIMS.mixedlab = {mount: mount, draw: draw, select: select, state: st};
})();
