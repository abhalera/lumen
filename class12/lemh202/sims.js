// Class 12 Mathematics, Chapter 8 (lemh202) — simulation labs.
// One lab per lesson, built on the shared Lumen LAB helpers (window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Local SVG helpers shared by this chapter's labs
// -------------------------------------------------------------------------
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
// Lab 1 — Riemann strips (NCERT §8.2, area under a curve)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var SET = {
    square: {label: "y = x²", f: function(x){ return x * x; }, a: 0, b: 2, vmax: 4.6, area: 8 / 3},
    sqrt:   {label: "y = √x", f: function(x){ return Math.sqrt(x); }, a: 0, b: 4, vmax: 2.4, area: 16 / 3},
    line:   {label: "y = x",  f: function(x){ return x; }, a: 0, b: 2, vmax: 2.4, area: 2}
  };
  var st = {preset: "square", n: 8};

  function draw(){
    var s = SET[st.preset], n = Math.max(1, Math.round(st.n));
    var fr = mkFrame(80, 255, 570, 195, s.a, s.b, 0, s.vmax);
    var m = axisLine(fr, "x", "y"), i, x0, h = (s.b - s.a) / n, sum = 0, fx;
    for(i = 0; i < n; i += 1){
      x0 = s.a + i * h;
      fx = s.f(x0 + h);
      sum += fx * h;
      m += L.rect(fr.X(x0), fr.Y(fx), fr.X(x0 + h) - fr.X(x0), fr.Y(0) - fr.Y(fx),
        "rgba(56,189,248,0.18)", ' stroke="' + C.vel + '" stroke-width="1"');
    }
    m += '<path d="' + svgPath(fnPts(fr, s.f, s.a, s.b, 90)) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
    m += L.text(fr.X((s.a + s.b) / 2), fr.Y(s.vmax) - 6, "n = " + n + " strips", {size: 18, color: C.text, weight: 700});
    m += L.text(fr.X(s.b) - 10, fr.Y(s.f(s.b)) - 12, s.label, {size: 18, color: C.path, weight: 700});
    L.svg(m, n + " rectangles approximating the area under " + s.label + ".", 290);
    L.readout([
      ["Curve", s.label],
      ["Interval", "x = " + L.num(s.a, 0) + " to " + L.num(s.b, 0)],
      ["Strips n", String(n)],
      ["Exact area", L.num(s.area, 3), C.ok],
      ["Right-strip sum", L.num(sum, 3), C.vel]
    ]);
    L.verdict("<b>" + s.label + ":</b> the strips total " + L.num(sum, 3) +
      " while the exact integral is " + L.num(s.area, 3) + ". As n grows the staircase hugs the curve and the sum tends to the area.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch("Compare the strip sum with the exact integral for " + SET[id].label + ". Increasing the number of strips improves the approximation.");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["square", "y = x² on [0, 2]"], ["sqrt", "y = √x on [0, 4]"], ["line", "y = x on [0, 2]"]], st.preset, select);
    L.controls(L.slider("s1-n", "Number of strips", 1, 40, 1, st.n, String(st.n)));
    L.onInput("s1-n", function(v){ st.n = v; L.setVal("s1-n", String(Math.round(v))); draw(); });
    L.legend([[C.path, "curve y = f(x)"], [C.vel, "elementary strips y dx"], [C.ok, "exact area"]]);
    L.watch("Move the strip-count slider. Each rectangle has area y dx; the readout compares the strip sum with the exact integral.");
    draw();
  }

  window.SIMS.strips = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Signed integral vs geometric area (NCERT §8.2, regions with x-axis)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var SET = {
    cubic: {
      label: "y = x³", f: function(x){ return x * x * x; }, a: -1, b: 1, vmax: 1.4,
      zeros: [0], note: "The two signed pieces cancel: ∫₋₁¹ x³ dx = 0, but the geometric area is 2 × 1/4 = 1/2."
    },
    line: {
      label: "y = 3x + 2", f: function(x){ return 3 * x + 2; }, a: -1, b: 1, vmax: 5.4,
      zeros: [-2 / 3], note: "The line dips below the axis before x = −2/3, so the signed integral 4 is less than the geometric area 13/3 ≈ 4.333."
    },
    sine: {
      label: "y = sin x", f: Math.sin, a: 0, b: 2 * Math.PI, vmax: 1.4,
      zeros: [Math.PI], note: "One hump is above and one below; the signed integral is 0 and the geometric area is 4."
    }
  };
  var st = {preset: "cubic"};

  function draw(){
    var s = SET[st.preset];
    var fr = mkFrame(80, 165, 570, 130, s.a - 0.2, s.b + 0.2, -s.vmax, s.vmax);
    var m = axisLine(fr, "x", "y"), i;
    for(i = 0; i < s.zeros.length; i += 1){
      m += L.line(fr.X(s.zeros[i]), fr.Y(-s.vmax), fr.X(s.zeros[i]), fr.Y(s.vmax), C.faint, 1, "4 4");
    }
    var edges = [s.a].concat(s.zeros).concat([s.b]);
    for(i = 0; i < edges.length - 1; i += 1){
      var f0 = s.f((edges[i] + edges[i + 1]) / 2);
      var top = fnPts(fr, s.f, edges[i], edges[i + 1], 40);
      var pts = top.concat([[fr.X(edges[i + 1]), fr.Y(0)], [fr.X(edges[i]), fr.Y(0)]]);
      m += '<path d="' + svgPath(pts) + ' Z" fill="' + (f0 >= 0 ? C.area : "rgba(239,68,68,0.35)") + '"/>';
    }
    m += '<path d="' + svgPath(fnPts(fr, s.f, s.a, s.b, 120)) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
    m += L.text(fr.X(s.a) + 30, fr.Y(0) - s.vmax * 0.35, s.label, {size: 18, color: C.path, weight: 700});
    L.svg(m, "Region between " + s.label + " and the x-axis from x = " + L.num(s.a, 1) + " to x = " + L.num(s.b, 1) + ".", 290);
    var signed = simpson(s.f, s.a, s.b, 400);
    var geometric = simpson(function(x){ return Math.abs(s.f(x)); }, s.a, s.b, 400);
    L.readout([
      ["Curve", s.label],
      ["Signed integral", L.num(signed, 3), signed < 0 ? C.danger : C.vel],
      ["Geometric area", L.num(geometric, 3), C.ok],
      ["Zero crossing" + (s.zeros.length > 1 ? "s" : ""), s.zeros.map(function(z){ return "x = " + L.num(z, 2); }).join(", ")]
    ]);
    L.verdict("<b>" + s.label + ":</b> " + s.note);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch(SET[id].note);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["cubic", "y = x³ on [−1, 1]"], ["line", "y = 3x + 2 on [−1, 1]"], ["sine", "y = sin x on [0, 2π]"]], st.preset, select);
    L.legend([[C.area, "area above the axis"], ["rgba(239,68,68,0.55)", "area below the axis"], [C.path, "curve"]]);
    L.watch("Blue strips count positive and red strips count negative. The signed integral can be far smaller than the geometric area.");
    draw();
  }

  window.SIMS.signed = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Area between two curves (NCERT §8.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var SET = {
    lineparab: {
      label: "y = x and y = x²", upper: function(x){ return x; }, lower: function(x){ return x * x; },
      a: 0, b: 1, vmax: 1.15, area: 1 / 6, meet: "x = 0 and x = 1"
    },
    parab4: {
      label: "y = 4 and y = x²", upper: function(x){ return 4; }, lower: function(x){ return x * x; },
      a: -2, b: 2, vmax: 4.6, area: 32 / 3, meet: "x = −2 and x = 2"
    },
    sqrtline: {
      label: "y = √x and y = x", upper: Math.sqrt, lower: function(x){ return x; },
      a: 0, b: 1, vmax: 1.15, area: 1 / 6, meet: "x = 0 and x = 1"
    }
  };
  var st = {preset: "lineparab"};

  function draw(){
    var s = SET[st.preset];
    var fr = mkFrame(80, 255, 570, 195, s.a - 0.15, s.b + 0.15, 0, s.vmax);
    var m = axisLine(fr, "x", "y"), i;
    var top = fnPts(fr, s.upper, s.a, s.b, 80);
    var bot = fnPts(fr, s.lower, s.a, s.b, 80);
    var band = top.concat(bot.slice().reverse());
    m += '<path d="' + svgPath(band) + ' Z" fill="' + C.area + '"/>';
    m += '<path d="' + svgPath(top) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
    m += '<path d="' + svgPath(bot) + '" fill="none" stroke="' + C.vel + '" stroke-width="3"/>';
    for(i = 0; i < 10; i += 1){
      var x = s.a + (s.b - s.a) * (i + 0.5) / 10;
      m += L.line(fr.X(x), fr.Y(s.lower(x)), fr.X(x), fr.Y(s.upper(x)), "rgba(226,232,240,0.35)", 1.5);
    }
    m += L.text(fr.X((s.a + s.b) / 2), fr.Y(s.vmax) - 8, "height = upper − lower", {size: 16, color: C.text, weight: 700});
    L.svg(m, "Shaded region between " + s.label + ".", 290);
    var area = simpson(function(x){ return s.upper(x) - s.lower(x); }, s.a, s.b, 400);
    L.readout([
      ["Curves", s.label],
      ["Intersections", s.meet],
      ["Integrand", "upper − lower"],
      ["Area", L.num(area, 3), C.ok]
    ]);
    L.verdict("<b>" + s.label + ":</b> the curves meet at " + s.meet +
      ". The shaded band has area ∫ (upper − lower) dx = " + L.num(area, 3) + " square units.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch("Find the intersections first, then subtract the lower curve from the upper one on each subinterval.");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["lineparab", "y = x above y = x²"], ["parab4", "y = 4 above y = x²"], ["sqrtline", "y = √x above y = x"]], st.preset, select);
    L.legend([[C.path, "upper curve"], [C.vel, "lower curve"], [C.area, "area between"]]);
    L.watch("The shaded band is made of vertical strips of height upper − lower. Move between the presets to see how the intersection points set the limits.");
    draw();
  }

  window.SIMS.between = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Vertical or horizontal strips (NCERT §8.2, sketch & bounds)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var SET = {
    parabola: {
      label: "y² = 4x, y-axis, y = 3",
      right: function(y){ return y * y / 4; }, left: function(){ return 0; },
      ylo: 0, yhi: 3, xmax: 2.8, area: 9 / 4, strip: "x = y²/4"
    },
    quarter: {
      label: "x² + y² = 4, first quadrant",
      right: function(y){ return Math.sqrt(Math.max(0, 4 - y * y)); }, left: function(){ return 0; },
      ylo: 0, yhi: 2, xmax: 2.4, area: Math.PI, strip: "x = √(4 − y²)"
    },
    sideways: {
      label: "y² = x between x = y² and x = 1",
      right: function(){ return 1; }, left: function(y){ return y * y; },
      ylo: -1, yhi: 1, xmax: 1.35, area: 4 / 3, strip: "right − left in y"
    }
  };
  var st = {preset: "parabola"};

  function draw(){
    var s = SET[st.preset];
    var fr = mkFrame(120, 255, 500, 185, -0.25, s.xmax, s.ylo - 0.35, s.yhi + 0.35);
    var m = axisLine(fr, "x", "y"), i, n = 12;
    var h = (s.yhi - s.ylo) / n;
    for(i = 0; i < n; i += 1){
      var y = s.ylo + i * h;
      var xr = s.right(y + h / 2), xl = s.left(y + h / 2);
      m += L.rect(fr.X(Math.max(0, xl)), fr.Y(y + h), Math.max(0.5, fr.X(xr) - fr.X(Math.max(0, xl))), Math.max(0, fr.Y(y) - fr.Y(y + h)),
        "rgba(56,189,248,0.20)", ' stroke="' + C.vel + '" stroke-width="0.8"');
    }
    var pts = [], k;
    for(k = 0; k <= 90; k += 1){
      var yy = s.ylo + (s.yhi - s.ylo) * k / 90;
      pts.push([fr.X(s.right(yy)), fr.Y(yy)]);
    }
    m += '<path d="' + svgPath(pts) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
    var leftPts = [];
    for(k = 0; k <= 90; k += 1){
      var yl = s.ylo + (s.yhi - s.ylo) * k / 90;
      leftPts.push([fr.X(Math.max(0, s.left(yl))), fr.Y(yl)]);
    }
    if(st.preset === "sideways") m += '<path d="' + svgPath(leftPts) + '" fill="none" stroke="' + C.vel + '" stroke-width="3"/>';
    m += L.text(fr.X(s.xmax / 2), fr.Y(s.yhi + 0.2), s.label, {size: 16, color: C.text, weight: 700});
    L.svg(m, "Horizontal strips for the region " + s.label + ".", 290);
    var area = simpson(function(y){ return s.right(y) - s.left(y); }, s.ylo, s.yhi, 400);
    L.readout([
      ["Strip type", "horizontal (dy)"],
      ["Bounds", "y = " + L.num(s.ylo, 0) + " to " + L.num(s.yhi, 0)],
      ["Strip length", s.strip],
      ["Area", L.num(area, 3), C.ok]
    ]);
    L.verdict("<b>" + s.label + ":</b> a horizontal strip at height y has length " + s.strip +
      ", so A = ∫ (right − left) dy = " + L.num(area, 3) + " square units.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch("Horizontal strips are natural here because the left and right boundaries are functions of y.");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["parabola", "y² = 4x with y = 3"], ["quarter", "Quarter circle x² + y² = 4"], ["sideways", "Between x = y² and x = 1"]], st.preset, select);
    L.legend([[C.path, "right boundary"], [C.vel, "left boundary / strips"], [C.ok, "exact area"]]);
    L.watch("Switch the region and note how every horizontal strip runs from the left boundary to the right boundary at a fixed y.");
    draw();
  }

  window.SIMS.horizontal = {mount: mount, draw: draw, select: select, state: st};
})();
