// Class 12 Mathematics, Chapter 7 (lemh201) — simulation labs.
// One lab per lesson, built on the shared Lumen LAB helpers (window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Local helpers shared by this chapter's labs
// -------------------------------------------------------------------------
var SUP = {"0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"};
function sup(n){ return String(n).split("").map(function(c){ return SUP[c] || c; }).join(""); }
function mkFrame(x0, y0, w, h, xmin, xmax, ymin, ymax){
  var sx = w / (xmax - xmin), sy = h / (ymax - ymin);
  return {
    x0: x0, y0: y0, w: w, h: h,
    xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax,
    X: function(x){ return x0 + (x - xmin) * sx; },
    Y: function(y){ return y0 - (y - ymin) * sy; }
  };
}
function axisLine(fr, tLabel, vLabel){
  var C = LAB.C;
  var m = LAB.line(fr.x0, fr.Y(0), fr.x0 + fr.w, fr.Y(0), C.muted, 1.5);
  m += LAB.line(fr.X(0), fr.y0, fr.X(0), fr.y0 - fr.h, C.muted, 1.5);
  m += LAB.text(fr.x0 + fr.w, fr.Y(0) + 18, tLabel || "x", {size: 13, color: C.muted, anchor: "end"});
  m += LAB.text(fr.X(0) + 10, fr.y0 - fr.h - 4, vLabel || "y", {size: 13, color: C.muted, anchor: "start"});
  return m;
}
function fnPts(fr, f, a, b, n){
  var pts = [], i, x;
  for(i = 0; i <= n; i += 1){ x = a + (b - a) * i / n; pts.push([fr.X(x), fr.Y(f(x))]); }
  return pts;
}
function svgPath(pts){
  return "M" + pts.map(function(p){ return p[0] + " " + p[1]; }).join(" L");
}
function simpson(f, a, b, n){
  n = n || 200;
  if(n % 2) n += 1;
  var h = (b - a) / n, s = f(a) + f(b), i;
  for(i = 1; i < n; i += 1) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
}

// -------------------------------------------------------------------------
// Lab 1 — Primitive builder (NCERT §7.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {n: 2, k: 1};

  function F(x, n, k){ return Math.pow(x, n + 1) / (n + 1) + k; }

  function draw(){
    var n = Math.round(st.n), k = Math.round(st.k);
    var fr = mkFrame(80, 235, 560, 180, -2.2, 2.2, -10, 10);
    var m = axisLine(fr, "x", "F(x)"), i, x;
    for(i = -3; i <= 3; i += 1){
      var pts = [];
      for(x = -2.2; x <= 2.21; x += 0.1) pts.push([fr.X(x), fr.Y(F(x, n, i))]);
      m += '<path d="' + svgPath(pts) + '" fill="none" stroke="' + (i === k ? C.path : "rgba(148,163,184,0.35)") + '" stroke-width="' + (i === k ? 3.4 : 1.4) + '"/>';
    }
    m += L.text(fr.X(0) + 20, fr.Y(9.2), "F(x) = x" + sup(n + 1) + "/" + (n + 1) + " + C", {size: 19, color: C.path, weight: 700, anchor: "start"});
    m += L.text(fr.X(0) + 20, fr.Y(7.2), "C = " + k + " highlighted", {size: 14, color: C.text, anchor: "start"});
    m += L.text(fr.X(0) + 20, fr.Y(5.4), "dF/dx = x" + sup(n) + " at every height", {size: 14, color: C.muted, anchor: "start"});
    L.svg(m, "Family of antiderivatives of x" + sup(n) + " with the constant C chosen.", 290);
    L.readout([
      ["f(x)", "x" + sup(n), C.vel],
      ["Antiderivative family", "x" + sup(n + 1) + "/" + (n + 1) + " + C"],
      ["Chosen constant C", String(k)],
      ["F(x)", "x" + sup(n + 1) + "/" + (n + 1) + " + " + k, C.ok],
      ["Check F′(x)", "x" + sup(n), C.muted]
    ]);
    L.verdict("<b>Every member of the family has the same slope.</b> Shifting C slides the curve vertically: F′(x) = x" + sup(n) +
      " no matter which C is chosen. Differentiate x" + sup(n + 1) + "/" + (n + 1) + " + " + k + " to confirm.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("p-n", "Exponent n in f(x) = xⁿ", 0, 4, 1, st.n, String(st.n)) +
      L.slider("p-k", "Constant C", -3, 3, 1, st.k, String(st.k))
    );
    L.onInput("p-n", function(v){ st.n = v; L.setVal("p-n", String(Math.round(v))); draw(); });
    L.onInput("p-k", function(v){ st.k = v; L.setVal("p-k", String(Math.round(v))); draw(); });
    L.legend([[C.path, "chosen antiderivative"], ["rgba(148,163,184,0.6)", "other members (different C)"], [C.ok, "check by differentiating"]]);
    L.watch("Change n to see the power rule, and C to slide the curve. The slope is unchanged by C.");
    draw();
  }

  window.SIMS.primitive = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Substitution bench (NCERT §7.3.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var SET = {
    xcos: {
      label: "∫ 2x cos(x²) dx",
      u: "u = x²", du: "du = 2x dx",
      transformed: "∫ cos u du", result: "sin u + C = sin(x²) + C"
    },
    lin: {
      label: "∫ (2x + 3)⁵ dx",
      u: "u = 2x + 3", du: "du = 2 dx, so dx = du/2",
      transformed: "½ ∫ u⁵ du", result: "u⁶/12 + C = (2x + 3)⁶/12 + C"
    },
    exp: {
      label: "∫ x eˣ² dx",
      u: "u = x²", du: "du = 2x dx, so x dx = du/2",
      transformed: "½ ∫ eᵘ du", result: "½eᵘ + C = ½eˣ² + C"
    },
    def: {
      label: "∫₀¹ x/(x² + 1) dx",
      u: "u = x² + 1", du: "du = 2x dx; limits x = 0 → u = 1, x = 1 → u = 2",
      transformed: "½ ∫₁² du/u", result: "½ log 2 ≈ 0.347"
    }
  };
  var st = {preset: "xcos"};

  function draw(){
    var s = SET[st.preset];
    var m = "";
    m += L.rect(40, 60, 190, 150, "#132033", ' rx="14" stroke="' + C.vel + '" stroke-width="2"');
    m += L.text(135, 92, "INTEGRAND", {size: 13, color: C.muted, weight: 700});
    m += L.text(135, 132, s.label, {size: 16, color: C.text, weight: 700});
    m += L.arrow(238, 135, 278, 135, C.path, 3);
    m += L.rect(285, 60, 160, 150, "#132033", ' rx="14" stroke="' + C.path + '" stroke-width="2"');
    m += L.text(365, 92, "SUBSTITUTION", {size: 13, color: C.muted, weight: 700});
    m += L.text(365, 124, s.u, {size: 15, color: C.path, weight: 700});
    m += L.text(365, 150, s.du, {size: 13, color: C.text});
    m += L.text(365, 182, s.transformed, {size: 14, color: C.ok, weight: 700});
    m += L.arrow(453, 135, 493, 135, C.ok, 3);
    m += L.rect(500, 60, 185, 150, "#0f2a24", ' rx="14" stroke="' + C.ok + '" stroke-width="2"');
    m += L.text(592, 92, "RESULT", {size: 13, color: C.muted, weight: 700});
    m += L.text(592, 140, s.result, {size: 14, color: C.ok, weight: 700});
    m += L.text(360, 250, "Differentiate the result to check it returns the integrand", {size: 14, color: C.muted});
    L.svg(m, "Substitution flow for " + s.label + ".", 290);
    L.readout([
      ["Integrand", s.label],
      ["Choose", s.u],
      ["Differential", s.du],
      ["Transformed integral", s.transformed, C.ok],
      ["Result", s.result, C.ok]
    ]);
    L.verdict("<b>" + s.u + " turns the composite integrand into a standard one.</b> " +
      (st.preset === "def"
        ? "The limits moved with the variable: x = 0 became u = 1 and x = 1 became u = 2."
        : "After integrating in u, substitute back to return to x."));
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch("Follow the three stages: choose u, replace the differential, integrate. " + SET[id].u + ".");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["xcos", "2x cos(x²)"], ["lin", "(2x + 3)⁵"], ["exp", "x eˣ²"], ["def", "Definite x/(x² + 1)"]], st.preset, select);
    L.legend([[C.vel, "original integrand"], [C.path, "substitution"], [C.ok, "standard integral"]]);
    L.watch("Each preset contains an inside function together with its derivative; the bench shows the replacement.");
    draw();
  }

  window.SIMS.substitute = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Trig reduction bench (NCERT §7.3.2–7.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var SET = {
    sin2: {
      label: "sin²x", identity: "sin²x = (1 − cos 2x)/2",
      reduced: "(1 − cos 2x)/2", anti: "x/2 − sin 2x/4 + C",
      f: function(x){ return Math.sin(x) * Math.sin(x); },
      F: function(x){ return x / 2 - Math.sin(2 * x) / 4; }
    },
    cos2: {
      label: "cos²x", identity: "cos²x = (1 + cos 2x)/2",
      reduced: "(1 + cos 2x)/2", anti: "x/2 + sin 2x/4 + C",
      f: function(x){ return Math.cos(x) * Math.cos(x); },
      F: function(x){ return x / 2 + Math.sin(2 * x) / 4; }
    },
    sin4: {
      label: "sin⁴x", identity: "sin⁴x = (3 − 4cos 2x + cos 4x)/8",
      reduced: "(3 − 4cos 2x + cos 4x)/8", anti: "3x/8 − sin 2x/4 + sin 4x/32 + C",
      f: function(x){ return Math.pow(Math.sin(x), 4); },
      F: function(x){ return 3 * x / 8 - Math.sin(2 * x) / 4 + Math.sin(4 * x) / 32; }
    },
    prod: {
      label: "sin 3x cos 4x", identity: "sin 3x cos 4x = ½(sin 7x − sin x)",
      reduced: "½(sin 7x − sin x)", anti: "−cos 7x/14 + cos x/2 + C",
      f: function(x){ return Math.sin(3 * x) * Math.cos(4 * x); },
      F: function(x){ return -Math.cos(7 * x) / 14 + Math.cos(x) / 2; }
    }
  };
  var st = {preset: "sin2"};

  function draw(){
    var s = SET[st.preset];
    var fr = mkFrame(70, 240, 570, 165, -1, 7, -1.3, 1.3);
    var m = axisLine(fr, "x", "y"), i, x;
    m += '<path d="' + svgPath(fnPts(fr, s.f, -1, 7, 160)) + '" fill="none" stroke="' + C.path + '" stroke-width="4" opacity="0.65"/>';
    m += '<path d="' + svgPath(fnPts(fr, s.f, -1, 7, 160)) + '" fill="none" stroke="' + C.vel + '" stroke-width="1.6" stroke-dasharray="6 5"/>';
    for(i = 0; i <= 8; i += 1){
      x = -1 + i;
      m += L.line(fr.X(x), fr.Y(-1.25), fr.X(x), fr.Y(1.25), C.grid, 1);
    }
    m += L.text(fr.X(3), fr.Y(1.2), s.label, {size: 18, color: C.path, weight: 700});
    L.svg(m, "Graph of " + s.label + " with its reduced form overlaid; the curves coincide.", 290);
    L.readout([
      ["Integrand", s.label],
      ["Identity used", s.identity, C.path],
      ["Reduced integrand", s.reduced, C.vel],
      ["Antiderivative", s.anti, C.ok],
      ["Check at x = 1", "F′ = " + L.num(s.f(1), 3)]
    ]);
    L.verdict("<b>" + s.identity + "</b> The reduced form equals the original at every x, so the reduced integral is exact. Integrating gives " + s.anti + ".");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch("The solid amber curve is the integrand, the dashed blue curve is the derivative of the stated antiderivative. They must coincide.");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["sin2", "sin²x"], ["cos2", "cos²x"], ["sin4", "sin⁴x"], ["prod", "sin 3x cos 4x"]], st.preset, select);
    L.legend([[C.path, "integrand"], [C.vel, "reduced form / derivative of answer"], [C.ok, "antiderivative"]]);
    L.watch("The identity and the antiderivative are checked against the graph: the reduced form never parts from the original.");
    draw();
  }

  window.SIMS.trigreduction = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Method bench: partial fractions and by parts (NCERT §7.5–7.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var SET = {
    split: {
      kind: "PARTIAL FRACTIONS",
      start: "∫ x/[(x + 1)(x + 2)] dx",
      setup: "x/[(x + 1)(x + 2)] = −1/(x + 1) + 2/(x + 2)",
      result: "−log|x + 1| + 2log|x + 2| + C",
      note: "Distinct linear factors A/(x + 1) + B/(x + 2); solving gives A = −1, B = 2."
    },
    xsin: {
      kind: "INTEGRATION BY PARTS",
      start: "∫ x sin x dx",
      setup: "u = x, dv = sin x dx, v = −cos x",
      result: "−x cos x + sin x + C",
      note: "u · v − ∫ v du = −x cos x − ∫ (−cos x) dx = −x cos x + sin x + C."
    },
    xexp: {
      kind: "INTEGRATION BY PARTS",
      start: "∫ x eˣ dx",
      setup: "u = x, dv = eˣ dx, v = eˣ",
      result: "eˣ(x − 1) + C",
      note: "x eˣ − ∫ eˣ dx = x eˣ − eˣ + C = eˣ(x − 1) + C."
    },
    log: {
      kind: "INTEGRATION BY PARTS",
      start: "∫ log x dx",
      setup: "u = log x, dv = dx, v = x",
      result: "x log x − x + C",
      note: "x log x − ∫ x · (1/x) dx = x log x − x + C."
    }
  };
  var st = {preset: "split"};

  function draw(){
    var s = SET[st.preset];
    var m = "";
    m += L.rect(40, 55, 640, 55, "#132033", ' rx="12" stroke="' + C.vel + '" stroke-width="2"');
    m += L.text(360, 90, s.start, {size: 20, color: C.text, weight: 700});
    m += L.arrow(360, 112, 360, 140, C.path, 3);
    m += L.rect(40, 142, 640, 52, "#132033", ' rx="12" stroke="' + C.path + '" stroke-width="2"');
    m += L.text(360, 174, s.setup, {size: 16, color: C.path, weight: 700});
    m += L.arrow(360, 196, 360, 224, C.ok, 3);
    m += L.rect(40, 226, 640, 50, "#0f2a24", ' rx="12" stroke="' + C.ok + '" stroke-width="2"');
    m += L.text(360, 257, s.result, {size: 18, color: C.ok, weight: 700});
    L.svg(m, s.kind + " flow for " + s.start + ".", 300);
    L.readout([
      ["Method", s.kind, C.vel],
      ["Problem", s.start],
      ["Setup", s.setup, C.path],
      ["Result", s.result, C.ok]
    ]);
    L.verdict("<b>" + s.kind.toLowerCase() + ":</b> " + s.note);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch("Choose the method that matches the shape of the integrand: a rational function is split, a product is exchanged.");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["split", "Rational x/[(x+1)(x+2)]"], ["xsin", "x sin x"], ["xexp", "x eˣ"], ["log", "log x"]], st.preset, select);
    L.legend([[C.vel, "problem"], [C.path, "method setup"], [C.ok, "antiderivative"]]);
    L.watch("Partial fractions split a rational integrand; by parts exchanges a product. The bench shows the setup and the result.");
    draw();
  }

  window.SIMS.methodbench = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — FTC bench for definite integrals (NCERT §7.8–7.10)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var SET = {
    poly: {
      label: "∫₁² (4x³ − 5x² + 6x + 9) dx",
      Fstr: "x⁴ − 5x³/3 + 3x² + 9x",
      f: function(x){ return 4 * x * x * x - 5 * x * x + 6 * x + 9; },
      F: function(x){ return x * x * x * x - 5 * x * x * x / 3 + 3 * x * x + 9 * x; },
      a: 1, b: 2, vmin: 0, vmax: 40, exact: "64/3 ≈ 21.333"
    },
    trig: {
      label: "∫₀<sup>π/2</sup> cos²x dx",
      Fstr: "x/2 + sin 2x/4",
      f: function(x){ return Math.cos(x) * Math.cos(x); },
      F: function(x){ return x / 2 + Math.sin(2 * x) / 4; },
      a: 0, b: Math.PI / 2, vmin: 0, vmax: 1.15, exact: "π/4 ≈ 0.785"
    },
    sub: {
      label: "∫₀¹ x/(x² + 1) dx",
      Fstr: "½ log(x² + 1)",
      f: function(x){ return x / (x * x + 1); },
      F: function(x){ return 0.5 * Math.log(x * x + 1); },
      a: 0, b: 1, vmin: 0, vmax: 0.6, exact: "½ log 2 ≈ 0.347"
    },
    sym: {
      label: "∫₋₁¹ x³ dx",
      Fstr: "x⁴/4",
      f: function(x){ return x * x * x; },
      F: function(x){ return x * x * x * x / 4; },
      a: -1, b: 1, vmin: -1.2, vmax: 1.2, exact: "0 (odd symmetry)"
    }
  };
  var st = {preset: "poly"};

  function draw(){
    var s = SET[st.preset];
    var span = s.b - s.a;
    var fr = mkFrame(80, 235, 570, 180, s.a - 0.12 * span, s.b + 0.12 * span, s.vmin, s.vmax);
    var m = axisLine(fr, "x", "y"), i, x;
    if(s.vmin < 0){
      for(i = 0; i < 8; i += 1){
        x = s.a + span * (i + 0.5) / 8;
        var top = fnPts(fr, s.f, Math.max(s.a, x - span / 16), Math.min(s.b, x + span / 16), 6);
        var pts = top.concat([[fr.X(Math.min(s.b, x + span / 16)), fr.Y(0)], [fr.X(Math.max(s.a, x - span / 16)), fr.Y(0)]]);
        m += '<path d="' + svgPath(pts) + ' Z" fill="' + (s.f(x) >= 0 ? C.area : "rgba(239,68,68,0.35)") + '"/>';
      }
    } else {
      var topPts = fnPts(fr, s.f, s.a, s.b, 100);
      var fillPts = topPts.concat([[fr.X(s.b), fr.Y(0)], [fr.X(s.a), fr.Y(0)]]);
      m += '<path d="' + svgPath(fillPts) + ' Z" fill="' + C.area + '"/>';
    }
    m += '<path d="' + svgPath(fnPts(fr, s.f, s.a, s.b, 160)) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
    m += L.text(fr.X((s.a + s.b) / 2), fr.Y(s.vmax) - 8, s.label.replace(/<sup>/g, "<tspan baseline-shift='super' font-size='11'>").replace(/<\/sup>/g, "</tspan>"), {size: 16, color: C.text, weight: 700});
    L.svg(m, "Shaded region for " + s.label.replace(/<[^>]+>/g, "") + ".", 290);
    var Fb = s.F(s.b), Fa = s.F(s.a);
    L.readout([
      ["Limits", "a = " + L.num(s.a, 2) + ", b = " + L.num(s.b, 2)],
      ["F(x)", s.Fstr],
      ["F(b)", L.num(Fb, 3), C.vel],
      ["F(a)", L.num(Fa, 3), C.vel],
      ["F(b) − F(a)", L.num(Fb - Fa, 3), C.ok]
    ]);
    L.verdict("<b>Fundamental Theorem:</b> " + s.label.replace("∫", "∫") + " = [F(x)] = F(b) − F(a) = " +
      L.num(Fb, 3) + " − " + L.num(Fa, 3) + " = " + L.num(Fb - Fa, 3) + ", that is " + s.exact + ".");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch("The shaded area is evaluated by the antiderivative at the two limits, not by counting rectangles.");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["poly", "Polynomial on [1, 2]"], ["trig", "cos²x on [0, π/2]"], ["sub", "x/(x²+1) on [0, 1]"], ["sym", "x³ on [−1, 1]"]], st.preset, select);
    L.legend([[C.path, "integrand y = f(x)"], [C.area, "positive area"], ["rgba(239,68,68,0.55)", "negative signed area"]]);
    L.watch("Choose an integral. The readout lists F(x), F(b), F(a) and their difference; the sym preset shows the signed pieces cancelling.");
    draw();
  }

  window.SIMS.definite = {mount: mount, draw: draw, select: select, state: st};
})();
