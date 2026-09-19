// Class 12 Mathematics, Chapter 6 (lemh106) - Application of Derivatives - simulation labs.
// One lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// Sample a function over [xmin, xmax] and return polyline points for LAB.graph.
function plotPts(g, xmin, xmax, f, samples){
  var pts = [], i, n = samples || 160, x, y;
  for(i = 0; i <= n; i += 1){
    x = xmin + (xmax - xmin) * i / n;
    y = f(x);
    if(!isFinite(y)) continue;
    pts.push([x - xmin, y]);
  }
  return pts;
}

function intervalText(a, b){
  return "(" + L.num(a, 2) + ", " + L.num(b, 2) + ")";
}

// -------------------------------------------------------------------------
// Lab 1 - Related-rates bench (NCERT §6.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "circle", s: 5};

  var SCEN = {
    circle: {
      name: "Circle", formula: "A = \u03c0r\u00b2",
      slider: {label: "Radius r", min: 1, max: 20, step: 0.5, def: 5, unit: "cm"},
      given: "dr/dt = 2.0 cm/s",
      run: function(s){
        var rate = 2 * Math.PI * s * 2;
        return {
          size: L.num(s, 1) + " cm",
          rule: "dA/dt = 2\u03c0r (dr/dt) = 4\u03c0r",
          rate: L.num(rate, 2) + " cm\u00b2/s",
          why: "<b>Circle:</b> A = \u03c0r\u00b2 gives dA/dr = 2\u03c0r. With dr/dt = 2 cm/s, dA/dt = 4\u03c0r cm\u00b2/s. At r = " + L.num(s, 1) + " cm the area grows at " + L.num(rate, 2) + " cm\u00b2/s."
        };
      }
    },
    cube: {
      name: "Cube", formula: "V = x\u00b3, S = 6x\u00b2",
      slider: {label: "Edge x", min: 1, max: 20, step: 0.5, def: 10, unit: "cm"},
      given: "dV/dt = 9 cm\u00b3/s",
      run: function(s){
        var rate = 36 / s;
        return {
          size: L.num(s, 1) + " cm",
          rule: "dS/dt = 12x (dx/dt), dx/dt = 3/x\u00b2",
          rate: L.num(rate, 2) + " cm\u00b2/s",
          why: "<b>Cube:</b> V = x\u00b3 gives dV/dt = 3x\u00b2(dx/dt) = 9, so dx/dt = 3/x\u00b2. Then S = 6x\u00b2 gives dS/dt = 12x(3/x\u00b2) = 36/x. At x = " + L.num(s, 1) + " cm the surface grows at " + L.num(rate, 2) + " cm\u00b2/s."
        };
      }
    },
    ladder: {
      name: "Ladder", formula: "x\u00b2 + y\u00b2 = 25",
      slider: {label: "Foot distance x", min: 1, max: 4.8, step: 0.1, def: 3, unit: "m"},
      given: "dx/dt = 2 cm/s",
      run: function(s){
        var y = Math.sqrt(25 - s * s);
        var rate = -s * 2 / y;
        return {
          size: L.num(s, 1) + " m",
          rule: "2x(dx/dt) + 2y(dy/dt) = 0",
          rate: L.num(rate, 2) + " cm/s",
          why: "<b>Ladder:</b> x\u00b2 + y\u00b2 = 25, so 2x(dx/dt) + 2y(dy/dt) = 0. At x = " + L.num(s, 1) + " m, y = " + L.num(y, 2) + " m and dy/dt = \u2212(x/y)(dx/dt) = " + L.num(rate, 2) + " cm/s: the top slides down."
        };
      }
    },
    cone: {
      name: "Sand cone", formula: "V = 12\u03c0h\u00b3",
      slider: {label: "Height h", min: 1, max: 10, step: 0.5, def: 4, unit: "cm"},
      given: "dV/dt = 12 cm\u00b3/s",
      run: function(s){
        var rate = 1 / (3 * Math.PI * s * s);
        return {
          size: L.num(s, 1) + " cm",
          rule: "dV/dt = 36\u03c0h\u00b2 (dh/dt)",
          rate: L.num(rate, 5) + " cm/s",
          why: "<b>Sand cone:</b> h = r/6 means r = 6h, so V = (1/3)\u03c0r\u00b2h = 12\u03c0h\u00b3. Then dV/dt = 36\u03c0h\u00b2(dh/dt) = 12, giving dh/dt = 1/(3\u03c0h\u00b2). At h = " + L.num(s, 1) + " cm, dh/dt = " + L.num(rate, 5) + " cm/s."
        };
      }
    }
  };

  function drawCircle(s){
    var m = "", rp = 15 + s * 5.5;
    m += L.circle(210, 170, rp, "rgba(56,189,248,.12)", ' stroke="#38bdf8" stroke-width="2.5"');
    m += L.line(210, 170, 210 + rp, 170, C.path, 3);
    m += L.circle(210, 170, 4, C.path);
    m += L.text(210 + rp / 2, 160, "r = " + L.num(s, 1), {size: 14, color: C.path});
    m += L.text(210, 170 + rp + 24, "A = \u03c0r\u00b2", {size: 17, color: C.text, weight: 700});
    return m;
  }

  function drawCube(s){
    var m = "", e = 32 + s * 5, ox = 150, oy = 110, dx = e * 0.42, dy = e * 0.30;
    m += '<polygon points="' + ox + ',' + (oy + e) + ' ' + (ox + e) + ',' + (oy + e) + ' ' + (ox + e) + ',' + oy + ' ' + ox + ',' + oy + '" fill="rgba(56,189,248,.10)" stroke="#38bdf8" stroke-width="2"/>';
    m += '<polygon points="' + ox + ',' + oy + ' ' + (ox + dx) + ',' + (oy - dy) + ' ' + (ox + e + dx) + ',' + (oy - dy) + ' ' + (ox + e) + ',' + oy + '" fill="rgba(56,189,248,.22)" stroke="#38bdf8" stroke-width="2"/>';
    m += '<polygon points="' + (ox + e) + ',' + oy + ' ' + (ox + e + dx) + ',' + (oy - dy) + ' ' + (ox + e + dx) + ',' + (oy + e - dy) + ' ' + (ox + e) + ',' + (oy + e) + '" fill="rgba(56,189,248,.16)" stroke="#38bdf8" stroke-width="2"/>';
    m += L.text(ox + e / 2, oy + e + 22, "x = " + L.num(s, 1), {size: 14, color: C.path});
    m += L.text(520, 150, "V = x\u00b3", {size: 19, color: C.text, weight: 700});
    m += L.text(520, 182, "S = 6x\u00b2", {size: 19, color: C.text, weight: 700});
    return m;
  }

  function drawLadder(s){
    var m = "", sc = 58, wall = 560, ground = 262;
    var xp = s * sc, yp = Math.sqrt(25 - s * s) * sc;
    m += L.line(60, ground, 660, ground, C.faint, 3);
    m += L.line(wall, ground, wall, 40, C.faint, 3);
    m += L.line(wall - xp, ground, wall, ground - yp, C.path, 5);
    m += L.circle(wall - xp, ground, 5, C.danger);
    m += L.circle(wall, ground - yp, 5, C.danger);
    m += L.text(wall - xp / 2, ground + 22, "x = " + L.num(s, 1) + " m", {size: 14, color: C.path});
    m += L.text(wall + 40, ground - yp / 2, "y", {size: 15, color: C.text});
    m += L.text(150, 70, "ladder 5 m", {size: 17, color: C.text, weight: 700});
    return m;
  }

  function drawCone(s){
    var m = "", hp = 30 + s * 16, rp = 18 + s * 8, cx = 220, by = 250;
    m += '<polygon points="' + cx + ',' + (by - hp) + ' ' + (cx - rp) + ',' + by + ' ' + (cx + rp) + ',' + by + '" fill="rgba(250,204,21,.16)" stroke="#f59e0b" stroke-width="2.5"/>';
    m += '<ellipse cx="' + cx + '" cy="' + by + '" rx="' + rp + '" ry="' + (rp * 0.28) + '" fill="rgba(250,204,21,.26)" stroke="#f59e0b" stroke-width="2"/>';
    m += L.line(cx, by - hp, cx, by, C.path, 2, "6 5");
    m += L.text(cx - 8, (by - hp + by) / 2, "h = " + L.num(s, 1), {size: 14, color: C.path, anchor: "end"});
    m += L.text(cx + rp + 14, by, "r = 6h", {size: 14, color: C.muted, anchor: "start"});
    m += L.text(480, 130, "dV/dt = 12 cm\u00b3/s", {size: 17, color: C.text, weight: 700});
    return m;
  }

  function controls(){
    var info = SCEN[st.preset].slider;
    L.controls(L.slider("t1-size", info.label, info.min, info.max, info.step, st.s, L.num(st.s, 1) + " " + info.unit));
    L.onInput("t1-size", function(v){ st.s = v; L.setVal("t1-size", L.num(v, 1) + " " + info.unit); draw(); });
  }

  function draw(){
    var info = SCEN[st.preset];
    var r = info.run(st.s);
    var m = "";
    if(st.preset === "circle") m += drawCircle(st.s);
    else if(st.preset === "cube") m += drawCube(st.s);
    else if(st.preset === "ladder") m += drawLadder(st.s);
    else m += drawCone(st.s);
    L.svg(m, info.name + " related-rates bench.", 300);
    L.readout([
      ["Shape", info.name, C.text],
      ["Size", r.size, C.path],
      ["Given rate", info.given, C.muted],
      ["Chain rule", r.rule, C.text],
      ["Rate now", r.rate, C.ok]
    ]);
    L.verdict(r.why);
  }

  function select(id){
    st.preset = id;
    st.s = SCEN[id].slider.def;
    L.markPreset(id);
    controls();
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["circle", "Circle A = \u03c0r\u00b2"], ["cube", "Cube V = x\u00b3"], ["ladder", "Ladder x\u00b2+y\u00b2=25"], ["cone", "Sand cone h = r/6"]], st.preset, select);
    controls();
    L.legend([[C.path, "measured size"], [C.ok, "rate predicted by the chain rule"]]);
    draw();
  }

  window.SIMS.ratebench = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 - Monotonicity bench (NCERT §6.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "quad", x: 0};

  var FUN = {
    quad: {
      label: "f(x) = x\u00b2 \u2212 4x + 6", fp: "f\u2032(x) = 2x \u2212 4",
      f: function(x){ return x * x - 4 * x + 6; },
      df: function(x){ return 2 * x - 4; },
      xmin: -1, xmax: 5, vmin: -2, vmax: 14,
      crit: "x = 2", crits: [2], def: 0,
      mono: "decreasing on (\u2212\u221e, 2), increasing on (2, \u221e)",
      why: "The parabola x\u00b2 \u2212 4x + 6 has vertex at x = 2. To the left f\u2032 = 2x \u2212 4 &lt; 0, so f falls; to the right f\u2032 &gt; 0, so f rises."
    },
    cubic: {
      label: "f(x) = 2x\u00b3 \u2212 3x\u00b2 \u2212 36x + 7", fp: "f\u2032(x) = 6(x \u2212 3)(x + 2)",
      f: function(x){ return 2 * x * x * x - 3 * x * x - 36 * x + 7; },
      df: function(x){ return 6 * x * x - 6 * x - 36; },
      xmin: -3.2, xmax: 5.2, vmin: -60, vmax: 80,
      crit: "x = \u22122 and x = 3", crits: [-2, 3], def: 0,
      mono: "increasing on (\u2212\u221e, \u22122), decreasing on (\u22122, 3), increasing on (3, \u221e)",
      why: "f\u2032 = 6(x \u2212 3)(x + 2). The two roots split \u211d into three intervals. Testing each shows f rises, falls and rises again."
    },
    sine: {
      label: "f(x) = sin x on [0, 2\u03c0]", fp: "f\u2032(x) = cos x",
      f: function(x){ return Math.sin(x); },
      df: function(x){ return Math.cos(x); },
      xmin: 0, xmax: 6.28, vmin: -1.5, vmax: 1.5,
      crit: "x = \u03c0/2 and x = 3\u03c0/2", crits: [Math.PI / 2, 3 * Math.PI / 2], def: Math.PI,
      mono: "increasing on (0, \u03c0/2), decreasing on (\u03c0/2, 3\u03c0/2), increasing on (3\u03c0/2, 2\u03c0)",
      why: "f\u2032 = cos x is positive on (0, \u03c0/2), negative on (\u03c0/2, 3\u03c0/2) and positive again on (3\u03c0/2, 2\u03c0)."
    },
    cube: {
      label: "f(x) = x\u00b3", fp: "f\u2032(x) = 3x\u00b2",
      f: function(x){ return x * x * x; },
      df: function(x){ return 3 * x * x; },
      xmin: -2, xmax: 2, vmin: -8, vmax: 8,
      crit: "x = 0 (f\u2032 = 0 but no sign change)", crits: [0], def: 1,
      mono: "increasing on all of \u211d",
      why: "f\u2032 = 3x\u00b2 \u2265 0 everywhere and only touches zero at x = 0, so f keeps increasing through 0."
    }
  };

  function signText(v){
    if(v > 1e-9) return "positive \u2192 increasing";
    if(v < -1e-9) return "negative \u2192 decreasing";
    return "zero \u2192 flat point";
  }

  function draw(){
    var F = FUN[st.preset];
    var g = L.graph({x0: 80, y0: 258, w: 560, h: 195, tmax: F.xmax - F.xmin, vmin: F.vmin, vmax: F.vmax,
      tStep: (F.xmax - F.xmin) / 6, vStep: (F.vmax - F.vmin) / 4,
      tFmt: function(t){ return L.num(t + F.xmin, 1); }, vFmt: function(v){ return L.num(v, 0); },
      tLabel: "x", vLabel: "y"});
    var m = g.svg;
    m += L.polyline(g, plotPts(g, F.xmin, F.xmax, F.f), C.vel, 3);
    var i, cx, cy;
    for(i = 0; i < F.crits.length; i += 1){
      cx = g.X(F.crits[i] - F.xmin); cy = g.Y(F.f(F.crits[i]));
      m += L.circle(cx, cy, 6, "#f8fafc");
    }
    var tx = st.x, ty = F.f(tx), sx = g.X(tx - F.xmin), sy = g.Y(ty);
    var slope = -F.df(tx) * (195 / (F.vmax - F.vmin)) / (560 / (F.xmax - F.xmin));
    m += L.line(sx - 26, sy - slope * 26, sx + 26, sy + slope * 26, C.acc, 3);
    m += L.circle(sx, sy, 6, C.acc);
    m += L.text(sx, sy - 14, "x = " + L.num(tx, 2), {size: 13, color: C.acc});
    L.svg(m, "Graph of " + F.label + " with a movable slope marker.", 300);
    var dv = F.df(st.x);
    L.readout([
      ["Function", F.label, C.text],
      ["Derivative", F.fp, C.muted],
      ["Critical point(s)", F.crit, C.text],
      ["At x = " + L.num(st.x, 2), L.num(dv, 2) + "  (" + signText(dv) + ")", dv > 1e-9 ? C.ok : (dv < -1e-9 ? C.path : C.muted)],
      ["Monotonicity", F.mono, C.ok]
    ]);
    L.verdict(F.why);
  }

  function controls(){
    var F = FUN[st.preset];
    L.controls(L.slider("t2-x", "Test point x", F.xmin, F.xmax, 0.1, st.x, L.num(st.x, 2)));
    L.onInput("t2-x", function(v){ st.x = v; L.setVal("t2-x", L.num(v, 2)); draw(); });
  }

  function select(id){
    st.preset = id;
    st.x = FUN[id].def;
    L.markPreset(id);
    controls();
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["quad", "x\u00b2 \u2212 4x + 6"], ["cubic", "2x\u00b3 \u2212 3x\u00b2 \u2212 36x + 7"], ["sine", "sin x"], ["cube", "x\u00b3"]], st.preset, select);
    controls();
    L.legend([[C.vel, "y = f(x)"], [C.acc, "slope marker f\u2032(x)"], ["#f8fafc", "critical point"]]);
    draw();
  }

  window.SIMS.monotone = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 - Critical-point finder (NCERT §6.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "cubic", x: 0};

  var FUN = {
    cubic: {
      label: "f(x) = x\u00b3 \u2212 3x + 3", fp: "f\u2032(x) = 3(x \u2212 1)(x + 1)",
      f: function(x){ return x * x * x - 3 * x + 3; },
      df: function(x){ return 3 * x * x - 3; },
      xmin: -2.6, xmax: 2.6, vmin: -6, vmax: 8, def: 0,
      marks: [{x: -1, kind: "local maximum", val: 5}, {x: 1, kind: "local minimum", val: 1}],
      crit: "x = \u22121 and x = 1",
      why: "f\u2032 = 3(x \u2212 1)(x + 1) vanishes at x = \u22121 and x = 1. The sign changes + \u2192 \u2212 at \u22121 (maximum) and \u2212 \u2192 + at 1 (minimum)."
    },
    flex: {
      label: "f(x) = 2x\u00b3 \u2212 6x\u00b2 + 6x + 5", fp: "f\u2032(x) = 6(x \u2212 1)\u00b2",
      f: function(x){ return 2 * x * x * x - 6 * x * x + 6 * x + 5; },
      df: function(x){ return 6 * (x - 1) * (x - 1); },
      xmin: -0.8, xmax: 2.8, vmin: 2, vmax: 12, def: 1,
      marks: [{x: 1, kind: "point of inflexion", val: 7}],
      crit: "x = 1 only",
      why: "f\u2032 = 6(x \u2212 1)\u00b2 \u2265 0 for every x, so f\u2032 does not change sign at x = 1. The critical point is a point of inflexion, not an extremum."
    },
    quartic: {
      label: "f(x) = x\u2074 \u2212 2x\u00b2", fp: "f\u2032(x) = 4x(x \u2212 1)(x + 1)",
      f: function(x){ return x * x * x * x - 2 * x * x; },
      df: function(x){ return 4 * x * (x - 1) * (x + 1); },
      xmin: -1.8, xmax: 1.8, vmin: -2, vmax: 2, def: 0,
      marks: [{x: -1, kind: "local minimum", val: -1}, {x: 0, kind: "local maximum", val: 0}, {x: 1, kind: "local minimum", val: -1}],
      crit: "x = \u22121, x = 0 and x = 1",
      why: "f\u2032 = 4x(x \u2212 1)(x + 1) has three roots. The sign + \u2192 \u2212 at 0 makes it a maximum; the changes \u2212 \u2192 + at \u22121 and 1 make those minima."
    },
    abs: {
      label: "f(x) = 3 + |x|", fp: "f\u2032(x) = \u22121 for x &lt; 0, +1 for x &gt; 0",
      f: function(x){ return 3 + Math.abs(x); },
      df: function(x){ return x < 0 ? -1 : (x > 0 ? 1 : 0); },
      xmin: -3, xmax: 3, vmin: 2, vmax: 6, def: 0,
      marks: [{x: 0, kind: "local minimum (corner)", val: 3}],
      crit: "x = 0, where f is not differentiable",
      why: "f is not differentiable at x = 0, so x = 0 is a critical point by definition. f\u2032 is negative on the left and positive on the right, so the corner is a local minimum with value 3."
    }
  };

  function draw(){
    var F = FUN[st.preset];
    var g = L.graph({x0: 80, y0: 258, w: 560, h: 195, tmax: F.xmax - F.xmin, vmin: F.vmin, vmax: F.vmax,
      tStep: (F.xmax - F.xmin) / 6, vStep: (F.vmax - F.vmin) / 4,
      tFmt: function(t){ return L.num(t + F.xmin, 1); }, vFmt: function(v){ return L.num(v, 0); },
      tLabel: "x", vLabel: "y"});
    var m = g.svg;
    m += L.polyline(g, plotPts(g, F.xmin, F.xmax, F.f), C.vel, 3);
    var i, mk, mx, my;
    for(i = 0; i < F.marks.length; i += 1){
      mk = F.marks[i];
      mx = g.X(mk.x - F.xmin); my = g.Y(mk.val);
      m += L.circle(mx, my, 7, mk.kind.indexOf("minimum") >= 0 ? C.ok : (mk.kind.indexOf("inflexion") >= 0 ? C.acc : C.danger));
      m += L.text(mx, my - 16, mk.kind.replace("local ", ""), {size: 12, color: C.text});
    }
    var px = st.x, py = F.f(px), sx = g.X(px - F.xmin), sy = g.Y(py);
    m += L.circle(sx, sy, 5, "#f8fafc");
    m += L.text(sx, sy + 20, "x = " + L.num(px, 2), {size: 13, color: "#f8fafc"});
    L.svg(m, "Graph of " + F.label + " with its critical points marked.", 300);
    L.readout([
      ["Function", F.label, C.text],
      ["Derivative", F.fp, C.muted],
      ["Critical point(s)", F.crit, C.text],
      ["Probe x = " + L.num(st.x, 2), "f\u2032 = " + L.num(F.df(st.x), 2), F.df(st.x) > 0 ? C.ok : (F.df(st.x) < 0 ? C.path : C.muted)],
      ["Nature", F.marks.map(function(mk){ return mk.x + ": " + mk.kind; }).join("; "), C.ok]
    ]);
    L.verdict(F.why);
  }

  function controls(){
    var F = FUN[st.preset];
    L.controls(L.slider("t3-x", "Probe x", F.xmin, F.xmax, 0.1, st.x, L.num(st.x, 2)));
    L.onInput("t3-x", function(v){ st.x = v; L.setVal("t3-x", L.num(v, 2)); draw(); });
  }

  function select(id){
    st.preset = id;
    st.x = FUN[id].def;
    L.markPreset(id);
    controls();
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["cubic", "x\u00b3 \u2212 3x + 3"], ["flex", "2x\u00b3 \u2212 6x\u00b2 + 6x + 5"], ["quartic", "x\u2074 \u2212 2x\u00b2"], ["abs", "3 + |x|"]], st.preset, select);
    controls();
    L.legend([[C.vel, "y = f(x)"], [C.ok, "local minimum"], [C.danger, "local maximum"], [C.acc, "inflexion / flat"]]);
    draw();
  }

  window.SIMS.critpoints = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 - First and second derivative tests (NCERT §6.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "quartic", x: 0};

  var FUN = {
    quartic: {
      label: "f(x) = 3x\u2074 + 4x\u00b3 \u2212 12x\u00b2 + 12", fp: "f\u2032(x) = 12x(x \u2212 1)(x + 2)",
      d2p: "f\u2033(x) = 36x\u00b2 + 24x \u2212 24",
      f: function(x){ return 3 * x * x * x * x + 4 * x * x * x - 12 * x * x + 12; },
      df: function(x){ return 12 * x * (x - 1) * (x + 2); },
      d2: function(x){ return 36 * x * x + 24 * x - 24; },
      xmin: -3, xmax: 2.2, vmin: -25, vmax: 25, def: 1,
      marks: [
        {x: -2, val: -20, kind: "local minimum", test: "f\u2033(\u22122) = 72 > 0"},
        {x: 0, val: 12, kind: "local maximum", test: "f\u2033(0) = \u221224 &lt; 0"},
        {x: 1, val: 7, kind: "local minimum", test: "f\u2033(1) = 36 > 0"}
      ],
      why: "The second derivative test classifies all three critical points at once: positive \u21d2 valley, negative \u21d2 hill. Values are f(\u22122) = \u221220, f(0) = 12 and f(1) = 7."
    },
    cubic: {
      label: "f(x) = x\u00b3", fp: "f\u2032(x) = 3x\u00b2",
      d2p: "f\u2033(x) = 6x",
      f: function(x){ return x * x * x; },
      df: function(x){ return 3 * x * x; },
      d2: function(x){ return 6 * x; },
      xmin: -2, xmax: 2, vmin: -8, vmax: 8, def: 0,
      marks: [{x: 0, val: 0, kind: "test fails — inflexion", test: "f\u2033(0) = 0"}],
      why: "Here f\u2033(0) = 0, so the second derivative test fails. The first derivative test shows f\u2032 = 3x\u00b2 does not change sign, so x = 0 is a point of inflexion."
    },
    abs: {
      label: "f(x) = 3 + |x|", fp: "f\u2032(x) = \u22121 for x &lt; 0, +1 for x &gt; 0",
      d2p: "f\u2033 not defined at x = 0",
      f: function(x){ return 3 + Math.abs(x); },
      df: function(x){ return x < 0 ? -1 : (x > 0 ? 1 : 0); },
      d2: function(x){ return x === 0 ? NaN : 0; },
      xmin: -3, xmax: 3, vmin: 2, vmax: 6, def: 0,
      marks: [{x: 0, val: 3, kind: "local minimum — first test", test: "no derivative at 0"}],
      why: "The second derivative does not exist at the corner x = 0, so use the first derivative test: f\u2032 changes from \u2212 to +, so the corner is a local minimum with value 3."
    },
    trig: {
      label: "f(x) = sin x + cos x on (0, 2\u03c0)", fp: "f\u2032(x) = cos x \u2212 sin x",
      d2p: "f\u2033(x) = \u2212sin x \u2212 cos x",
      f: function(x){ return Math.sin(x) + Math.cos(x); },
      df: function(x){ return Math.cos(x) - Math.sin(x); },
      d2: function(x){ return -Math.sin(x) - Math.cos(x); },
      xmin: 0, xmax: 6.29, vmin: -1.8, vmax: 1.8, def: Math.PI / 4,
      marks: [
        {x: Math.PI / 4, val: Math.SQRT2, kind: "local maximum", test: "f\u2033(\u03c0/4) = \u2212\u221a2 &lt; 0"},
        {x: 5 * Math.PI / 4, val: -Math.SQRT2, kind: "local minimum", test: "f\u2033(5\u03c0/4) = \u221a2 > 0"}
      ],
      why: "f\u2032 = cos x \u2212 sin x vanishes at \u03c0/4 and 5\u03c0/4. The second derivative is negative at \u03c0/4 (maximum value \u221a2) and positive at 5\u03c0/4 (minimum value \u2212\u221a2)."
    }
  };

  function draw(){
    var F = FUN[st.preset];
    var g = L.graph({x0: 80, y0: 258, w: 560, h: 195, tmax: F.xmax - F.xmin, vmin: F.vmin, vmax: F.vmax,
      tStep: (F.xmax - F.xmin) / 6, vStep: (F.vmax - F.vmin) / 4,
      tFmt: function(t){ return L.num(t + F.xmin, 2); }, vFmt: function(v){ return L.num(v, 0); },
      tLabel: "x", vLabel: "y"});
    var m = g.svg;
    m += L.polyline(g, plotPts(g, F.xmin, F.xmax, F.f), C.vel, 3);
    var i, mk, mx, my;
    for(i = 0; i < F.marks.length; i += 1){
      mk = F.marks[i];
      mx = g.X(mk.x - F.xmin); my = g.Y(mk.val);
      m += L.circle(mx, my, 7, mk.kind.indexOf("minimum") >= 0 ? C.ok : C.danger);
      m += L.text(mx, my + (mk.kind.indexOf("minimum") >= 0 ? 24 : -16), mk.kind.replace("local ", ""), {size: 12, color: C.text});
    }
    var px = st.x, py = F.f(px), sx = g.X(px - F.xmin), sy = g.Y(py);
    m += L.circle(sx, sy, 5, "#f8fafc");
    m += L.text(sx, sy + 18, "x = " + L.num(px, 2), {size: 13, color: "#f8fafc"});
    L.svg(m, "Graph of " + F.label + " with extrema classified.", 300);
    var mk0 = F.marks[0];
    var dv = F.df(st.x), d2v = F.d2(st.x);
    var test = isFinite(d2v) ? (Math.abs(d2v) < 1e-9 ? "second test fails (f\u2033 = 0) — use first test" : (d2v < 0 ? "f\u2033 &lt; 0 \u2192 local maximum" : "f\u2033 > 0 \u2192 local minimum")) : "not differentiable — use first test";
    L.readout([
      ["Function", F.label, C.text],
      ["First derivative", F.fp, C.muted],
      ["Second derivative", F.d2p, C.muted],
      ["Probe x = " + L.num(st.x, 2), "f\u2032 = " + L.num(dv, 2) + ",  f\u2033 = " + (isFinite(d2v) ? L.num(d2v, 2) : "not defined"), C.text],
      ["Test at the extremum", test, C.ok]
    ]);
    L.verdict(F.why);
  }

  function controls(){
    var F = FUN[st.preset];
    L.controls(L.slider("t4-x", "Probe x", F.xmin, F.xmax, 0.1, st.x, L.num(st.x, 2)));
    L.onInput("t4-x", function(v){ st.x = v; L.setVal("t4-x", L.num(v, 2)); draw(); });
  }

  function select(id){
    st.preset = id;
    st.x = FUN[id].def;
    L.markPreset(id);
    controls();
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["quartic", "3x\u2074 + 4x\u00b3 \u2212 12x\u00b2 + 12"], ["cubic", "x\u00b3 (test fails)"], ["abs", "3 + |x| (corner)"], ["trig", "sin x + cos x"]], st.preset, select);
    controls();
    L.legend([[C.vel, "y = f(x)"], [C.danger, "local maximum"], [C.ok, "local minimum"]]);
    draw();
  }

  window.SIMS.extrema = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 - Closed-interval sweep (NCERT §6.4.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "cubic", b: 5};

  var PI = Math.PI;
  var FUN = {
    cubic: {
      label: "f(x) = 2x\u00b3 \u2212 15x\u00b2 + 36x + 1", a: 1, bmin: 3, bmax: 6, bdef: 5, dec: 1,
      vmin: -10, vmax: 80,
      f: function(x){ return 2 * x * x * x - 15 * x * x + 36 * x + 1; },
      crit: [2, 3]
    },
    quartic: {
      label: "f(x) = 3x\u2074 \u2212 8x\u00b3 + 12x\u00b2 \u2212 48x + 25", a: 0, bmin: 1, bmax: 3.5, bdef: 3, dec: 1,
      vmin: -50, vmax: 120,
      f: function(x){ return 3 * x * x * x * x - 8 * x * x * x + 12 * x * x - 48 * x + 25; },
      crit: [2]
    },
    trig: {
      label: "f(x) = x + sin 2x on [0, 2\u03c0]", a: 0, bmin: 1, bmax: 6.3, bdef: 6.283, dec: 2,
      vmin: -2, vmax: 8,
      f: function(x){ return x + Math.sin(2 * x); },
      crit: [PI / 3, 2 * PI / 3, 4 * PI / 3, 5 * PI / 3]
    },
    box: {
      label: "V(x) = x(18 \u2212 2x)\u00b2 (open box)", a: 0, bmin: 3, bmax: 9, bdef: 9, dec: 1,
      vmin: -20, vmax: 450,
      f: function(x){ return x * Math.pow(18 - 2 * x, 2); },
      crit: [3, 9]
    }
  };

  function candidates(F, b){
    var out = [{x: F.a, v: F.f(F.a), tag: "endpoint"}];
    var i;
    for(i = 0; i < F.crit.length; i += 1){
      var c = F.crit[i];
      if(c > F.a + 1e-9 && c < b - 1e-9) out.push({x: c, v: F.f(c), tag: "critical"});
    }
    out.push({x: b, v: F.f(b), tag: "endpoint"});
    return out;
  }

  function draw(){
    var F = FUN[st.preset], b = st.b;
    var g = L.graph({x0: 80, y0: 258, w: 560, h: 195, tmax: F.bmax - F.a, vmin: F.vmin, vmax: F.vmax,
      tStep: (F.bmax - F.a) / 6, vStep: (F.vmax - F.vmin) / 5,
      tFmt: function(t){ return L.num(t + F.a, F.dec); }, vFmt: function(v){ return L.num(v, 0); },
      tLabel: "x", vLabel: "f(x)"});
    var m = g.svg;
    // shade the active interval under the curve
    m += L.rect(g.X(F.a), 63, Math.max(0, g.X(b) - g.X(F.a)), 195, "rgba(56,189,248,.08)");
    m += L.polyline(g, plotPts(g, F.a, F.bmax, F.f, 220), C.vel, 3);
    var cand = candidates(F, b), i, mx, my;
    for(i = 0; i < cand.length; i += 1){
      mx = g.X(cand[i].x - F.a); my = g.Y(cand[i].v);
      m += L.circle(mx, my, 6, cand[i].tag === "critical" ? C.acc : C.danger);
    }
    m += L.line(g.X(b - F.a), 40, g.X(b - F.a), 258, C.danger, 2, "5 5");
    m += L.text(g.X(b - F.a), 32, "b = " + L.num(b, F.dec), {size: 14, color: C.danger});
    L.svg(m, "Graph of " + F.label + " on [" + L.num(F.a, F.dec) + ", " + L.num(b, F.dec) + "].", 300);
    var best = cand[0], worst = cand[0];
    for(i = 0; i < cand.length; i += 1){
      if(cand[i].v > best.v) best = cand[i];
      if(cand[i].v < worst.v) worst = cand[i];
    }
    var candText = cand.map(function(c){ return "f(" + L.num(c.x, F.dec) + ") = " + L.num(c.v, 2); }).join(", ");
    var critText = F.crit.filter(function(c){ return c > F.a && c < b; }).map(function(c){ return L.num(c, F.dec); }).join(", ");
    L.readout([
      ["Function", F.label, C.text],
      ["Interval", "[" + L.num(F.a, F.dec) + ", " + L.num(b, F.dec) + "]", C.danger],
      ["Critical points inside", critText || "none", C.acc],
      ["Candidate values", candText, C.text],
      ["Absolute maximum", L.num(best.v, 2) + " at x = " + L.num(best.x, F.dec), C.ok],
      ["Absolute minimum", L.num(worst.v, 2) + " at x = " + L.num(worst.x, F.dec), C.ok]
    ]);
    L.verdict("<b>Closed-interval rule:</b> compare every critical value inside the interval with the two endpoint values. Here the absolute maximum is " + L.num(best.v, 2) + " at x = " + L.num(best.x, F.dec) + " and the absolute minimum is " + L.num(worst.v, 2) + " at x = " + L.num(worst.x, F.dec) + ". Move the right endpoint to see the winner change.");
  }

  function controls(){
    var F = FUN[st.preset];
    L.controls(L.slider("t5-b", "Right endpoint b", F.bmin, F.bmax, 0.1, st.b, L.num(st.b, F.dec)));
    L.onInput("t5-b", function(v){ st.b = v; L.setVal("t5-b", L.num(v, F.dec)); draw(); });
  }

  function select(id){
    st.preset = id;
    st.b = FUN[id].bdef;
    L.markPreset(id);
    controls();
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["cubic", "2x\u00b3 \u2212 15x\u00b2 + 36x + 1"], ["quartic", "3x\u2074 \u2212 8x\u00b3 + 12x\u00b2 \u2212 48x + 25"], ["trig", "x + sin 2x"], ["box", "V = x(18 \u2212 2x)\u00b2"]], st.preset, select);
    controls();
    L.legend([[C.vel, "y = f(x)"], [C.acc, "critical point"], [C.danger, "endpoint"]]);
    draw();
  }

  window.SIMS.closedopt = {mount: mount, draw: draw, select: select, state: st};
})();
