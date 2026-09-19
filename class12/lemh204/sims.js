// Class 12 Mathematics, Chapter 10 (lemh204) — simulation labs.
// One lab per lesson, built on the shared Lumen lab helpers (window.LAB).
(function(){
  var L = window.LAB, C = L.C;
  window.SIMS = window.SIMS || {};

  function noTimeline(){
    var tb = document.getElementById("legacy-lab-toolbar");
    if(tb) tb.style.display = "none";
  }

  // Coordinate plane fitted to a data window, with a light grid and labelled axes.
  function plane(x0, x1, y0, y1, step){
    step = step || 2;
    var px0 = 54, px1 = 690, py0 = 250, py1 = 28;
    var sx = (px1 - px0) / (x1 - x0), sy = (py0 - py1) / (y1 - y0);
    var X = function(x){ return px0 + (x - x0) * sx; };
    var Y = function(y){ return py0 - (y - y0) * sy; };
    var s = "";
    var x, y;
    for(x = Math.ceil(x0 / step) * step; x <= x1 + 1e-9; x += step) s += L.line(X(x), Y(y0), X(x), Y(y1), C.grid, 1);
    for(y = Math.ceil(y0 / step) * step; y <= y1 + 1e-9; y += step) s += L.line(X(x0), Y(y), X(x1), Y(y), C.grid, 1);
    s += L.arrow(X(x0), Y(0), X(x1) + 6, Y(0), C.faint, 1.6);
    s += L.arrow(X(0), Y(y0), X(0), Y(y1) - 6, C.faint, 1.6);
    s += L.text(X(x1) + 6, Y(0) + 16, "x", {size: 12, color: C.muted});
    s += L.text(X(0) - 10, Y(y1) - 2, "y", {size: 12, color: C.muted});
    return {X: X, Y: Y, svg: s};
  }
  function vec(g, a, color, w){
    return L.arrow(g.X(0), g.Y(0), g.X(a[0]), g.Y(a[1]), color, w || 3);
  }
  function tipText(g, a, label, color, dx, dy){
    return L.text(g.X(a[0]) + (dx || 8), g.Y(a[1]) + (dy === undefined ? -8 : dy), label, {size: 14, color: color, weight: 700, anchor: dx && dx < 0 ? "end" : "start"});
  }
  function ptText(g, p, label, color, dx, dy){
    return L.text(g.X(p[0]) + (dx || 0), g.Y(p[1]) + (dy === undefined ? -8 : dy), label, {size: 12, color: color, weight: 700});
  }
  function dot(g, p, color){
    return L.circle(g.X(p[0]), g.Y(p[1]), 4.5, color);
  }
  function comps(v){ return "(" + L.num(v[0], 2) + ", " + L.num(v[1], 2) + ")"; }

  // -----------------------------------------------------------------------
  // Lesson 1 — vecbasics: magnitude, unit vectors and the types of vectors
  // (NCERT §10.2-10.3).
  // -----------------------------------------------------------------------
  (function(){
    var REL = {
      equal:       {a: [3, 4], b: [3, 4],  note: "b\u20d7 is a copy of a\u20d7, drawn elsewhere: same length, same direction, so b\u20d7 = a\u20d7."},
      negative:    {a: [3, 4], b: [-3, -4], note: "b\u20d7 has the same length as a\u20d7 but the opposite direction, so b\u20d7 = \u2212a\u20d7."},
      collinear:   {a: [3, 4], b: [6, 8],  note: "b\u20d7 is twice a\u20d7: the arrows are parallel, so the vectors are collinear (but not equal)."},
      zero:        {a: [3, 4], b: [0, 0],  note: "b\u20d7 has zero length, so it is the zero vector. It can be given any direction and is collinear with every vector."}
    };
    var st = {preset: "equal", a: REL.equal.a.slice(), b: REL.equal.b.slice()};

    function relation(){
      var a = st.a, b = st.b;
      var mb = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
      if(mb < 1e-9) return "zero vector";
      if(a[0] === b[0] && a[1] === b[1]) return "equal vectors";
      if(a[0] === -b[0] && a[1] === -b[1]) return "negative vectors";
      if(Math.abs(a[0] * b[1] - a[1] * b[0]) < 1e-9) return "collinear vectors";
      return "unrelated directions";
    }
    function draw(){
      var g = plane(-6, 10, -6, 8, 2);
      var a = st.a, b = st.b;
      var ma = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
      var mb = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
      var s = g.svg;
      s += vec(g, a, C.vel, 3.4);
      s += tipText(g, a, "a\u20d7", C.vel, 8, -8);
      // Draw b from a small displacement so overlapping copies stay visible.
      var off = [0.55, -0.55];
      s += L.arrow(g.X(off[0]), g.Y(off[1]), g.X(off[0] + b[0]), g.Y(off[1] + b[1]), C.area2 ? "#f59e0b" : "#f59e0b", 3.4);
      s += tipText(g, [off[0] + b[0], off[1] + b[1]], "b\u20d7", "#f59e0b", 8, -8);
      if(mb < 1e-9){
        s += dot(g, [off[0], off[1]], "#f59e0b");
        s += L.text(g.X(off[0]) + 10, g.Y(off[1]) + 16, "b\u20d7 = 0\u20d7", {size: 12, color: "#f59e0b", anchor: "start"});
      }
      s += L.text(360, 18, "\u00e2 = a\u20d7/|a\u20d7| points along a\u20d7", {size: 13, color: C.muted});
      if(ma > 1e-9) s += L.arrow(g.X(0), g.Y(0), g.X(a[0] / ma), g.Y(a[1] / ma), C.ok, 5);
      L.svg(s, "Vector a and vector b in the plane with their magnitudes", 290);
      L.readout([
        ["a\u20d7", comps(a) + " , |a\u20d7| = " + L.num(ma, 2), C.vel],
        ["b\u20d7", comps(b) + " , |b\u20d7| = " + L.num(mb, 2), "#f59e0b"],
        ["Relationship", relation(), C.ok],
        ["Unit vector \u00e2", ma > 1e-9 ? "(" + L.num(a[0] / ma, 2) + ", " + L.num(a[1] / ma, 2) + ")" : "\u2014 (zero vector has no direction)", C.ok]
      ]);
      L.verdict("<b>" + relation() + ".</b> " + REL[st.preset].note + " The green arrow is \u00e2, the unit vector in the direction of a\u20d7; it always ends on the unit circle.");
    }
    function apply(){
      var a = REL[st.preset].a, b = REL[st.preset].b;
      st.a = a.slice(); st.b = b.slice();
      setSlider("vb-ax", a[0]); setSlider("vb-ay", a[1]);
      setSlider("vb-bx", b[0]); setSlider("vb-by", b[1]);
      draw();
    }
    function setSlider(id, v){
      var el = document.getElementById(id);
      if(el) el.value = v;
      L.setVal(id, L.num(v, 0));
    }
    function select(id){
      st.preset = id;
      L.markPreset(id);
      L.watch(REL[id].note + " Change the sliders afterwards and the relationship is recomputed.");
      apply();
    }
    function syncFromSliders(){
      st.a = [st.ax, st.ay];
      if(st.preset === "equal") st.b = st.a.slice();
      else if(st.preset === "negative") st.b = [-st.ax, -st.ay];
      else if(st.preset === "collinear") st.b = [2 * st.ax, 2 * st.ay];
      else st.b = [0, 0];
      setSlider("vb-bx", st.b[0]); setSlider("vb-by", st.b[1]);
      st.bx = st.b[0]; st.by = st.b[1];
      draw();
    }
    function mount(){
      noTimeline();
      L.presets([["equal", "Equal vectors"], ["negative", "Negative vector"], ["collinear", "Collinear vectors"], ["zero", "Zero vector"]], st.preset, select);
      L.controls(
        L.slider("vb-ax", "a\u20d7 x-component", -6, 8, 1, st.a[0], L.num(st.a[0], 0)) +
        L.slider("vb-ay", "a\u20d7 y-component", -6, 8, 1, st.a[1], L.num(st.a[1], 0)) +
        L.slider("vb-bx", "b\u20d7 x-component", -8, 10, 1, st.b[0], L.num(st.b[0], 0)) +
        L.slider("vb-by", "b\u20d7 y-component", -8, 10, 1, st.b[1], L.num(st.b[1], 0))
      );
      st.ax = st.a[0]; st.ay = st.a[1]; st.bx = st.b[0]; st.by = st.b[1];
      L.onInput("vb-ax", function(v){ st.ax = v; L.setVal("vb-ax", L.num(v, 0)); syncFromSliders(); });
      L.onInput("vb-ay", function(v){ st.ay = v; L.setVal("vb-ay", L.num(v, 0)); syncFromSliders(); });
      L.onInput("vb-bx", function(v){ st.bx = v; st.b = [v, st.by]; st.preset = "custom"; L.markPreset(""); L.setVal("vb-bx", L.num(v, 0)); draw(); });
      L.onInput("vb-by", function(v){ st.by = v; st.b = [st.bx, v]; st.preset = "custom"; L.markPreset(""); L.setVal("vb-by", L.num(v, 0)); draw(); });
      L.legend([[C.vel, "vector a\u20d7"], ["#f59e0b", "vector b\u20d7"], [C.ok, "unit vector \u00e2"]]);
      L.watch("Select a relationship and change the components. The readout recomputes the magnitudes and classifies the pair.");
      draw();
    }
    window.SIMS.vecbasics = {mount: mount, draw: draw, select: select, state: st};
  })();

  // -----------------------------------------------------------------------
  // Lesson 2 — vecadd: triangle law, parallelogram law, subtraction and
  // scalar multiplication (NCERT §10.4-10.5.1).
  // -----------------------------------------------------------------------
  (function(){
    var CASES = {
      triangle:      {a: [3, 1], b: [1, 2], lam: 2, note: "Triangle law: place the tail of b\u20d7 on the head of a\u20d7; the resultant a\u20d7 + b\u20d7 closes the triangle."},
      parallelogram: {a: [4, 0], b: [1, 3], lam: 2, note: "Parallelogram law: a\u20d7 and b\u20d7 from a common point are adjacent sides; their sum is the diagonal."},
      subtract:      {a: [3, 1], b: [1, 2], lam: 2, note: "Subtraction adds the negative vector: a\u20d7 \u2212 b\u20d7 = a\u20d7 + (\u2212b\u20d7), so the tail of \u2212b\u20d7 sits on the head of a\u20d7."},
      scalar:        {a: [2, 1], b: [0, 0], lam: 2, note: "Multiplying by a scalar changes the length by |\u03bb| and reverses the direction when \u03bb < 0."}
    };
    var st = {preset: "triangle", a: [3, 1], b: [1, 2], lam: 2};

    function result(){
      var a = st.a, b = st.b;
      if(st.preset === "subtract") return [a[0] - b[0], a[1] - b[1]];
      if(st.preset === "scalar") return [st.lam * a[0], st.lam * a[1]];
      return [a[0] + b[0], a[1] + b[1]];
    }
    function draw(){
      var g = plane(-4, 9, -4, 7, 2);
      var a = st.a, b = st.b, r = result();
      var s = g.svg;
      var head = [a[0], a[1]];
      var tail = [a[0], a[1]];
      s += vec(g, a, C.vel, 3.4);
      s += tipText(g, a, "a\u20d7", C.vel, 8, -8);
      if(st.preset === "triangle"){
        s += L.arrow(g.X(head[0]), g.Y(head[1]), g.X(head[0] + b[0]), g.Y(head[1] + b[1]), "#f59e0b", 3.4);
        s += tipText(g, [head[0] + b[0], head[1] + b[1]], "b\u20d7", "#f59e0b", 8, -8);
      } else if(st.preset === "parallelogram"){
        s += vec(g, b, "#f59e0b", 3.4);
        s += tipText(g, b, "b\u20d7", "#f59e0b", 8, -8);
        s += L.line(g.X(b[0]), g.Y(b[1]), g.X(a[0] + b[0]), g.Y(a[1] + b[1]), C.faint, 1.6, "5 4");
        s += L.line(g.X(a[0]), g.Y(a[1]), g.X(a[0] + b[0]), g.Y(a[1] + b[1]), C.faint, 1.6, "5 4");
      } else if(st.preset === "subtract"){
        s += L.arrow(g.X(head[0]), g.Y(head[1]), g.X(head[0] - b[0]), g.Y(head[1] - b[1]), "#f59e0b", 3.4);
        s += tipText(g, [head[0] - b[0], head[1] - b[1]], "\u2212b\u20d7", "#f59e0b", 8, 18);
      } else {
        s += vec(g, r, "#f59e0b", 3.4);
        s += tipText(g, r, "\u03bba = " + L.num(st.lam, 1), "#f59e0b", 8, -8);
      }
      s += L.arrow(g.X(0), g.Y(0), g.X(r[0]), g.Y(r[1]), C.ok, 4.5);
      s += tipText(g, r, st.preset === "subtract" ? "a\u20d7 \u2212 b\u20d7" : (st.preset === "scalar" ? "\u03bba a\u20d7" : "a\u20d7 + b\u20d7"), C.ok, 10, 20);
      L.svg(s, "Vector addition diagram for the selected law, resultant in green", 290);
      var mag = Math.sqrt(r[0] * r[0] + r[1] * r[1]);
      L.readout([
        ["a\u20d7", comps(a), C.vel],
        [st.preset === "scalar" ? "\u03bb" : "b\u20d7", st.preset === "scalar" ? L.num(st.lam, 1) : comps(b), "#f59e0b"],
        ["Resultant", comps(r), C.ok],
        ["|Resultant|", L.num(mag, 2), C.ok],
        ["Rule", st.preset === "subtract" ? "a\u20d7 + (\u2212b\u20d7)" : (st.preset === "scalar" ? "scale every component by \u03bb" : (st.preset === "triangle" ? "triangle (head to tail)" : "parallelogram (common tail)")), C.muted]
      ]);
      L.verdict("<b>" + CASES[st.preset].note + "</b> The components add directly: " + comps(a) + " and " + (st.preset === "scalar" ? L.num(st.lam, 1) + "\u00b7" + comps(a) : comps(b)) + " give " + comps(r) + ".");
    }
    function setSlider(id, v){ var el = document.getElementById(id); if(el) el.value = v; L.setVal(id, L.num(v, 0)); }
    function select(id){
      st.preset = id;
      var c = CASES[id];
      st.a = c.a.slice(); st.b = c.b.slice(); st.lam = c.lam;
      st.ax = st.a[0]; st.ay = st.a[1]; st.bx = st.b[0]; st.by = st.b[1];
      setSlider("va-ax", st.a[0]); setSlider("va-ay", st.a[1]);
      setSlider("va-bx", st.b[0]); setSlider("va-by", st.b[1]);
      setSlider("va-lam", st.lam);
      L.markPreset(id);
      L.watch(c.note + " Drag the component sliders to build your own example.");
      draw();
    }
    function mount(){
      noTimeline();
      L.presets([["triangle", "Triangle rule"], ["parallelogram", "Parallelogram rule"], ["subtract", "Subtraction a\u20d7 \u2212 b\u20d7"], ["scalar", "Scalar multiple"]], st.preset, select);
      L.controls(
        L.slider("va-ax", "a\u20d7 x-component", -4, 6, 1, st.a[0], L.num(st.a[0], 0)) +
        L.slider("va-ay", "a\u20d7 y-component", -4, 6, 1, st.a[1], L.num(st.a[1], 0)) +
        L.slider("va-bx", "b\u20d7 x-component", -4, 6, 1, st.b[0], L.num(st.b[0], 0)) +
        L.slider("va-by", "b\u20d7 y-component", -4, 6, 1, st.b[1], L.num(st.b[1], 0)) +
        L.slider("va-lam", "Scalar \u03bb", -2, 3, 0.5, st.lam, L.num(st.lam, 1))
      );
      st.ax = st.a[0]; st.ay = st.a[1]; st.bx = st.b[0]; st.by = st.b[1];
      L.onInput("va-ax", function(v){ st.ax = v; st.a = [v, st.ay]; L.setVal("va-ax", L.num(v, 0)); draw(); });
      L.onInput("va-ay", function(v){ st.ay = v; st.a = [st.ax, v]; L.setVal("va-ay", L.num(v, 0)); draw(); });
      L.onInput("va-bx", function(v){ st.bx = v; st.b = [v, st.by]; L.setVal("va-bx", L.num(v, 0)); draw(); });
      L.onInput("va-by", function(v){ st.by = v; st.b = [st.bx, v]; L.setVal("va-by", L.num(v, 0)); draw(); });
      L.onInput("va-lam", function(v){ st.lam = v; L.setVal("va-lam", L.num(v, 1)); draw(); });
      L.legend([[C.vel, "a\u20d7"], ["#f59e0b", "b\u20d7 or \u03bba\u20d7"], [C.ok, "resultant"]]);
      L.watch("Switch between the addition laws. The green resultant is always the vector from the first tail to the last head.");
      draw();
    }
    window.SIMS.vecadd = {mount: mount, draw: draw, select: select, state: st};
  })();

  // -----------------------------------------------------------------------
  // Lesson 3 — vecsection: position vectors and the section formula
  // (NCERT §10.5.2-10.5.3).
  // -----------------------------------------------------------------------
  (function(){
    var CASES = {
      internal: {A: [0, 0], B: [6, 3], m: 2, n: 1, note: "Internal division: R lies between A and B, so the ratio AR : RB equals m : n."},
      external: {A: [0, 0], B: [6, 3], m: 2, n: 1, note: "External division: R lies beyond B, and the same formula with a difference replaces the sum."},
      midpoint: {A: [0, 0], B: [6, 3], m: 1, n: 1, note: "The midpoint is the section formula with m = n = 1: average the position vectors."}
    };
    var st = {preset: "internal", A: [0, 0], B: [6, 3], m: 2, n: 1};

    function R(){
      if(st.preset === "midpoint") return [(st.A[0] + st.B[0]) / 2, (st.A[1] + st.B[1]) / 2];
      var den = st.preset === "external" ? st.m - st.n : st.m + st.n;
      if(Math.abs(den) < 1e-9) return null;
      var sgn = st.preset === "external" ? -1 : 1;
      return [
        (st.m * st.B[0] + sgn * st.n * st.A[0]) / den,
        (st.m * st.B[1] + sgn * st.n * st.A[1]) / den
      ];
    }
    function draw(){
      var g = plane(-3, 14, -3, 9, 2);
      var a = st.A, b = st.B, r = R();
      var s = g.svg;
      s += L.line(g.X(a[0]), g.Y(a[1]), g.X(b[0]), g.Y(b[1]), C.faint, 2, "6 5");
      s += L.arrow(g.X(0), g.Y(0), g.X(a[0]), g.Y(a[1]), C.vel, 2.6);
      s += L.arrow(g.X(0), g.Y(0), g.X(b[0]), g.Y(b[1]), "#f59e0b", 2.6);
      s += dot(g, a, C.vel) + ptText(g, a, "A" + comps(a), C.vel, 8, 20);
      s += dot(g, b, "#f59e0b") + ptText(g, b, "B" + comps(b), "#f59e0b", 8, -6);
      if(r){
        s += L.arrow(g.X(0), g.Y(0), g.X(r[0]), g.Y(r[1]), C.ok, 4);
        s += dot(g, r, C.ok);
        s += ptText(g, r, "R" + comps(r), C.ok, 8, -8);
      }
      L.svg(s, "Position vectors of A, B and the dividing point R", 290);
      L.readout([
        ["A", comps(a)],
        ["B", comps(b)],
        ["Ratio m : n", st.preset === "midpoint" ? "1 : 1" : st.m + " : " + st.n],
        ["R", r ? comps(r) : "\u2014 (m = n gives no finite external point)", C.ok],
        ["Where R sits", st.preset === "midpoint" ? "midpoint of AB" : (st.preset === "external" ? "beyond B on line AB" : "between A and B"), C.muted]
      ]);
      L.verdict("<b>" + CASES[st.preset].note + "</b> " + (r ? "With m = " + (st.preset === "midpoint" ? 1 : st.m) + " and n = " + (st.preset === "midpoint" ? 1 : st.n) + ", R has position vector (" + L.num(r[0], 2) + ", " + L.num(r[1], 2) + ")." : "Because m = n the external point does not exist."));
    }
    function setSlider(id, v){ var el = document.getElementById(id); if(el) el.value = v; L.setVal(id, L.num(v, 0)); }
    function select(id){
      st.preset = id;
      var c = CASES[id];
      st.A = c.A.slice(); st.B = c.B.slice(); st.m = c.m; st.n = c.n;
      setSlider("vs-m", st.m); setSlider("vs-n", st.n);
      L.markPreset(id);
      L.watch(c.note + " Move the ratio sliders to divide the segment differently.");
      draw();
    }
    function mount(){
      noTimeline();
      L.presets([["internal", "Internal division"], ["external", "External division"], ["midpoint", "Midpoint"]], st.preset, select);
      L.controls(
        L.slider("vs-m", "Ratio m", 1, 5, 1, st.m, L.num(st.m, 0)) +
        L.slider("vs-n", "Ratio n", 1, 5, 1, st.n, L.num(st.n, 0))
      );
      L.onInput("vs-m", function(v){ st.m = v; L.setVal("vs-m", L.num(v, 0)); draw(); });
      L.onInput("vs-n", function(v){ st.n = v; L.setVal("vs-n", L.num(v, 0)); draw(); });
      L.legend([[C.vel, "OA\u20d7"], ["#f59e0b", "OB\u20d7"], [C.ok, "OR\u20d7"]]);
      L.watch("Switch between internal, external and midpoint division, then change m and n to see how R slides along the line.");
      draw();
    }
    window.SIMS.vecsection = {mount: mount, draw: draw, select: select, state: st};
  })();

  // -----------------------------------------------------------------------
  // Lesson 4 — vecdot: scalar product, angle and projection (NCERT §10.6.1-10.6.2).
  // -----------------------------------------------------------------------
  (function(){
    var CASES = {parallel: 0, perpendicular: 90, obtuse: 120};
    var st = {preset: "parallel", theta: 0, mb: 2};
    var A = [3, 0];

    function components(){
      var th = st.theta * Math.PI / 180;
      return [st.mb * Math.cos(th), st.mb * Math.sin(th)];
    }
    function draw(){
      var g = plane(-5, 5, -3.5, 3.5, 1);
      var b = components();
      var s = g.svg;
      s += vec(g, A, C.vel, 3.4);
      s += tipText(g, A, "a\u20d7", C.vel, 8, -8);
      s += vec(g, b, "#f59e0b", 3.4);
      s += tipText(g, b, "b\u20d7", "#f59e0b", 8, -8);
      var dot = A[0] * b[0] + A[1] * b[1];
      var mb = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
      var proj = mb > 1e-9 ? dot / mb : 0;
      if(mb > 1e-9 && Math.abs(proj) > 1e-9){
        var ux = b[0] / mb, uy = b[1] / mb;
        s += L.arrow(g.X(0), g.Y(0), g.X(proj * ux), g.Y(proj * uy), C.ok, 5);
        s += L.text(g.X(proj * ux) + (proj >= 0 ? 8 : -8), g.Y(proj * uy) + 16, "projection " + L.num(proj, 2), {size: 12, color: C.ok, anchor: proj >= 0 ? "start" : "end"});
      }
      L.svg(s, "Dot product of a with b and the projection of a on b", 290);
      L.readout([
        ["a\u20d7", comps(A) + " , |a\u20d7| = " + L.num(3, 0), C.vel],
        ["b\u20d7", comps(b) + " , |b\u20d7| = " + L.num(mb, 2), "#f59e0b"],
        ["Angle \u03b8", L.num(st.theta, 0) + "\u00b0" + (st.theta < 89 ? " (acute)" : (st.theta > 91 ? " (obtuse)" : " (right angle)")), C.muted],
        ["a\u20d7\u00b7b\u20d7 = |a\u20d7||b\u20d7|cos \u03b8", L.num(dot, 2), dot > 0.001 ? C.ok : (dot < -0.001 ? C.danger : C.muted)],
        ["Projection of a\u20d7 on b\u20d7", L.num(proj, 2), C.ok]
      ]);
      var msg;
      if(Math.abs(dot) < 1e-9) msg = "<b>Perpendicular vectors:</b> \u03b8 = 90\u00b0, cos \u03b8 = 0, so the dot product and the projection both vanish.";
      else if(dot > 0) msg = "<b>Acute angle:</b> a\u20d7 leans along b\u20d7, so the dot product and projection are positive. Drag the angle past 90\u00b0 to change the sign.";
      else msg = "<b>Obtuse angle:</b> a\u20d7 leans against b\u20d7, so the dot product and projection are negative.";
      L.verdict(msg);
    }
    function setSlider(id, v){ var el = document.getElementById(id); if(el) el.value = v; L.setVal(id, L.num(v, 0)); }
    function select(id){
      st.preset = id;
      st.theta = CASES[id];
      setSlider("vd-th", st.theta);
      L.markPreset(id);
      L.watch("Rotate b\u20d7 with the angle slider. Watch the dot product cross zero at 90\u00b0 and the projection change sign.");
      draw();
    }
    function mount(){
      noTimeline();
      L.presets([["parallel", "\u03b8 = 0\u00b0 (parallel)"], ["perpendicular", "\u03b8 = 90\u00b0 (perpendicular)"], ["obtuse", "\u03b8 = 120\u00b0 (obtuse)"]], st.preset, select);
      L.controls(L.slider("vd-th", "Angle \u03b8 between a\u20d7 and b\u20d7", 0, 180, 5, st.theta, L.num(st.theta, 0) + "\u00b0"));
      L.onInput("vd-th", function(v){ st.theta = v; L.setVal("vd-th", L.num(v, 0) + "\u00b0"); st.preset = "custom"; draw(); });
      L.legend([[C.vel, "a\u20d7"], ["#f59e0b", "b\u20d7"], [C.ok, "projection of a\u20d7 on b\u20d7"]]);
      L.watch("Rotate b\u20d7 with the angle slider. Watch the dot product cross zero at 90\u00b0 and the projection change sign.");
      draw();
    }
    window.SIMS.vecdot = {mount: mount, draw: draw, select: select, state: st};
  })();

  // -----------------------------------------------------------------------
  // Lesson 5 — veccross: vector product, right-hand rule and area
  // (NCERT §10.6.3).
  // -----------------------------------------------------------------------
  (function(){
    var CASES = {area: 90, parallel: 0, angle30: 30};
    var st = {preset: "area", theta: 90, LA: 4, LB: 3};

    function bvec(){
      var th = st.theta * Math.PI / 180;
      return [st.LB * Math.cos(th), st.LB * Math.sin(th)];
    }
    function draw(){
      var g = plane(-3, 8, -3, 5, 1);
      var a = [st.LA, 0], b = bvec();
      var z = a[0] * b[1] - a[1] * b[0];
      var s = g.svg;
      s += '<path d="M' + g.X(0) + ' ' + g.Y(0) + ' L' + g.X(a[0]) + ' ' + g.Y(a[1]) + ' L' + g.X(a[0] + b[0]) + ' ' + g.Y(a[1] + b[1]) + ' L' + g.X(b[0]) + ' ' + g.Y(b[1]) + ' Z" fill="rgba(52,211,153,.18)" stroke="' + C.ok + '" stroke-width="1.6"/>';
      s += vec(g, a, C.vel, 3.4);
      s += tipText(g, a, "a\u20d7", C.vel, 8, -8);
      s += vec(g, b, "#f59e0b", 3.4);
      s += tipText(g, b, "b\u20d7", "#f59e0b", 8, -8);
      s += dot(g, [0, 0], C.text);
      var dirText = Math.abs(z) < 1e-9 ? "a\u20d7 \u00d7 b\u20d7 = 0\u20d7 (parallel vectors)" : (z >= 0 ? "a\u20d7 \u00d7 b\u20d7 points out of the page (+k\u0302)" : "a\u20d7 \u00d7 b\u20d7 points into the page (\u2212k\u0302)");
      s += L.text(360, 18, dirText, {size: 13, color: C.muted});
      L.svg(s, "Parallelogram spanned by a and b; its area is the magnitude of a cross b", 290);
      var mag = Math.abs(z);
      L.readout([
        ["a\u20d7", comps(a) + " , |a\u20d7| = " + L.num(st.LA, 0), C.vel],
        ["b\u20d7", comps(b) + " , |b\u20d7| = " + L.num(st.LB, 0), "#f59e0b"],
        ["Angle \u03b8", L.num(st.theta, 0) + "\u00b0"],
        ["|a\u20d7 \u00d7 b\u20d7| = |a\u20d7||b\u20d7|sin \u03b8", L.num(mag, 2), C.ok],
        ["Parallelogram area", L.num(mag, 2), C.ok],
        ["Triangle area", L.num(mag / 2, 2), C.muted]
      ]);
      var msg;
      if(mag < 1e-9) msg = "<b>Parallel vectors:</b> sin 0\u00b0 = 0, so the cross product is the zero vector and the parallelogram collapses to a line segment.";
      else if(Math.abs(st.theta - 90) < 1e-9) msg = "<b>Perpendicular vectors:</b> sin 90\u00b0 = 1, so the magnitude is the full product |a\u20d7||b\u20d7| = " + L.num(st.LA * st.LB, 0) + " and the parallelogram is a rectangle.";
      else msg = "<b>Turning bench:</b> the area grows and shrinks with sin \u03b8. Rotate b\u20d7 towards a\u20d7 and the parallelogram flattens towards zero area.";
      L.verdict(msg);
    }
    function setSlider(id, v){ var el = document.getElementById(id); if(el) el.value = v; L.setVal(id, L.num(v, 0)); }
    function select(id){
      st.preset = id;
      st.theta = CASES[id];
      setSlider("vc-th", st.theta);
      L.markPreset(id);
      L.watch("The shaded parallelogram has area |a\u20d7 \u00d7 b\u20d7|. Rotate b\u20d7 and watch the area follow sin \u03b8.");
      draw();
    }
    function mount(){
      noTimeline();
      L.presets([["area", "Right angle (max area)"], ["parallel", "Parallel (zero)"], ["angle30", "\u03b8 = 30\u00b0"]], st.preset, select);
      L.controls(L.slider("vc-th", "Angle \u03b8 between a\u20d7 and b\u20d7", 0, 180, 5, st.theta, L.num(st.theta, 0) + "\u00b0"));
      L.onInput("vc-th", function(v){ st.theta = v; L.setVal("vc-th", L.num(v, 0) + "\u00b0"); st.preset = "custom"; draw(); });
      L.legend([[C.vel, "a\u20d7"], ["#f59e0b", "b\u20d7"], [C.ok, "area = |a\u20d7 \u00d7 b\u20d7|"]]);
      L.watch("The shaded parallelogram has area |a\u20d7 \u00d7 b\u20d7|. Rotate b\u20d7 and watch the area follow sin \u03b8.");
      draw();
    }
    window.SIMS.veccross = {mount: mount, draw: draw, select: select, state: st};
  })();
})();
