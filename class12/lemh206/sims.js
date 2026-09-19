// Class 12 Mathematics, Chapter 12 (lemh206) — simulation labs.
// One lab per lesson, built on the shared Lumen lab helpers (window.LAB).
(function(){
  var L = window.LAB, C = L.C;
  window.SIMS = window.SIMS || {};

  function noTimeline(){
    var tb = document.getElementById("legacy-lab-toolbar");
    if(tb) tb.style.display = "none";
  }

  // Shared coordinate frame for the two-variable graphical labs.
  function frame(xmax, ymax, xt, yt, x0, y0){
    return L.graph({
      x0: x0 || 64, y0: y0 || 246, w: 610, h: 205,
      tmax: xmax, vmin: 0, vmax: ymax, tStep: xt, vStep: yt,
      tLabel: "x", vLabel: "y"
    });
  }
  function poly(g, pts, fill, stroke, w){
    var d = "M" + pts.map(function(p){ return g.X(p[0]).toFixed(1) + " " + g.Y(p[1]).toFixed(1); }).join(" L") + " Z";
    return '<path d="' + d + '" fill="' + (fill || "none") + '" stroke="' + (stroke || "none") + '" stroke-width="' + (w || 2) + '"/>';
  }
  function dot(g, p, color, label, dx, dy){
    var s = L.circle(g.X(p[0]), g.Y(p[1]), 4.5, color);
    if(label) s += L.text(g.X(p[0]) + (dx || 8), g.Y(p[1]) + (dy === undefined ? -8 : dy), label, {size: 12, color: color, weight: 700, anchor: dx && dx < 0 ? "end" : "start"});
    return s;
  }
  function linePath(g, a, b, color, w, dash){
    return L.line(g.X(a[0]), g.Y(a[1]), g.X(b[0]), g.Y(b[1]), color, w || 2, dash);
  }

  // -----------------------------------------------------------------------
  // Lesson 1 — lppform: turn a word problem into variables, constraints and
  // an objective function (NCERT §12.2.1).
  // -----------------------------------------------------------------------
  (function(){
    var MODELS = {
      furniture: {
        word: "Tables (x) and chairs (y)",
        vars: "x = tables, y = chairs",
        cons: ["5x + y \u2264 100 (money)", "x + y \u2264 60 (storage)", "x \u2265 0, y \u2265 0"],
        obj: "Maximise Z = 250x + 75y",
        kind: "maximise profit",
        note: "Each table earns Rs 250 and each chair Rs 75, so profit is linear in x and y."
      },
      diet: {
        word: "Bags of mix A (x) and mix B (y)",
        vars: "x = bags of mix A, y = bags of mix B",
        cons: ["4x + 3y \u2265 24 (protein)", "2x + 5y \u2264 30 (budget)", "x \u2265 0, y \u2265 0"],
        obj: "Minimise Z = 3x + 2y",
        kind: "minimise cost",
        note: "A minimum requirement gives a \u2265 constraint; a budget gives a \u2264 constraint."
      },
      transport: {
        word: "Trucks (x) and tempos (y)",
        vars: "x = trucks, y = tempos",
        cons: ["5x + 3y \u2265 40 (load)", "x + y \u2264 12 (fleet)", "x \u2265 0, y \u2265 0"],
        obj: "Minimise Z = 8000x + 4000y",
        kind: "minimise running cost",
        note: "The load must be at least 40 units, and the fleet holds at most 12 vehicles."
      }
    };
    var st = {preset: "furniture"};
    var W = 720;

    function draw(){
      var m = MODELS[st.preset];
      var y0 = 34, h = 56;
      var s = "";
      s += L.rect(20, 12, 680, 276, "#0d1a27", ' rx="14" stroke="#1e2d3d"');
      s += L.text(40, y0 + 6, "DECISION VARIABLES", {size: 13, color: "#38bdf8", weight: 700, anchor: "start"});
      s += L.rect(40, y0 + 16, 640, h - 14, "rgba(56,189,248,.10)", ' rx="8"');
      s += L.text(56, y0 + 46, m.vars, {size: 16, color: C.text, anchor: "start"});
      s += L.text(40, y0 + 96, "CONSTRAINTS", {size: 13, color: "#f59e0b", weight: 700, anchor: "start"});
      s += L.rect(40, y0 + 106, 640, 96, "rgba(245,158,11,.08)", ' rx="8"');
      s += L.text(56, y0 + 134, "\u2022 " + m.cons[0], {size: 15, color: C.text, anchor: "start"});
      s += L.text(56, y0 + 160, "\u2022 " + m.cons[1], {size: 15, color: C.text, anchor: "start"});
      s += L.text(56, y0 + 186, "\u2022 " + m.cons[2], {size: 15, color: C.text, anchor: "start"});
      s += L.text(40, y0 + 232, "OBJECTIVE FUNCTION", {size: 13, color: C.ok, weight: 700, anchor: "start"});
      s += L.rect(40, y0 + 242, 640, 38, "rgba(52,211,153,.10)", ' rx="8"');
      s += L.text(56, y0 + 268, m.obj, {size: 17, color: C.ok, weight: 700, anchor: "start"});
      L.svg(s, "Linear programme for the " + m.word + " problem", 290);
      L.readout([
        ["Model", m.word],
        ["Decision variables", m.vars],
        ["Constraints", m.cons.join("  ·  ")],
        ["Objective", m.obj, C.ok],
        ["Optimise", m.kind, "#f59e0b"]
      ]);
      L.verdict("<b>" + m.kind.replace(/^./, function(c){ return c.toUpperCase(); }) + ":</b> " + m.note + " Notice how the words 'at least' and 'at most' fix the direction of each inequality.");
    }
    function select(id){
      st.preset = id;
      L.markPreset(id);
      L.watch("Model: " + MODELS[id].word + ". Read the left-hand side of each constraint as a resource use, and the right-hand side as what is available.");
      draw();
    }
    function mount(){
      noTimeline();
      L.presets([["furniture", "Furniture dealer"], ["diet", "Diet mix"], ["transport", "Fleet dispatch"]], st.preset, select);
      L.legend([["#38bdf8", "decision variables"], ["#f59e0b", "constraints"], [C.ok, "objective"]]);
      L.watch("Model: " + MODELS[st.preset].word + ". Read the left-hand side of each constraint as a resource use, and the right-hand side as what is available.");
      draw();
    }
    window.SIMS.lppform = {mount: mount, draw: draw, select: select, state: st};
  })();

  // -----------------------------------------------------------------------
  // Lesson 2 — lppfeasible: shade the intersection of the constraint
  // half-planes and probe a test point (NCERT §12.2.2).
  // -----------------------------------------------------------------------
  (function(){
    var CASES = {
      furniture: {
        cons: ["5x + y \u2264 100", "x + y \u2264 60", "x \u2265 0, y \u2265 0"],
        corners: [[0, 0], [20, 0], [10, 50], [0, 60]],
        xmax: 110, ymax: 110, xt: 20, yt: 20,
        probe: [10, 20],
        kind: "bounded",
        verdict: "The four half-planes overlap in the closed polygon O(0, 0), A(20, 0), B(10, 50), C(0, 60). Points like (10, 20) pass every test, while (25, 40) fails x + y \u2264 60."
      },
      example1: {
        cons: ["x + y \u2264 50", "3x + y \u2264 90", "x \u2265 0, y \u2265 0"],
        corners: [[0, 0], [30, 0], [20, 30], [0, 50]],
        xmax: 95, ymax: 95, xt: 15, yt: 15,
        probe: [15, 15],
        kind: "bounded",
        verdict: "Two sloping constraints and the axes give the quadrilateral O(0, 0), A(30, 0), B(20, 30), C(0, 50). Its corners are the only candidates that will matter for the objective."
      },
      example5: {
        cons: ["x + y \u2265 8", "3x + 5y \u2264 15", "x \u2265 0, y \u2265 0"],
        corners: [],
        xmax: 10, ymax: 10, xt: 2, yt: 2,
        probe: [2, 2],
        kind: "empty",
        verdict: "The half-planes point away from each other: x + y \u2265 8 needs points above one line, while 3x + 5y \u2264 15 keeps points below the other, and the two never overlap. The feasible region is empty, so the problem has no feasible solution."
      }
    };
    var st = {preset: "furniture", px: 10, py: 20};

    function feasible(c, p){
      if(p[0] < 0 || p[1] < 0) return false;
      if(c === "furniture") return 5 * p[0] + p[1] <= 100.0001 && p[0] + p[1] <= 60.0001;
      if(c === "example1") return p[0] + p[1] <= 50.0001 && 3 * p[0] + p[1] <= 90.0001;
      return p[0] + p[1] >= 8 - 0.0001 && 3 * p[0] + 5 * p[1] <= 15.0001;
    }

    function drawRegion(g, c){
      var m = "";
      if(c === "furniture"){
        m += linePath(g, [0, 100], [20, 0], "#f59e0b", 2.4);
        m += linePath(g, [0, 60], [60, 0], "#fabd5b", 2.4);
        m += poly(g, [[0, 0], [20, 0], [10, 50], [0, 60]], "rgba(52,211,153,.22)", C.ok, 2);
        m += dot(g, [0, 0], C.ok, "O(0, 0)", 4);
        m += dot(g, [20, 0], C.ok, "A(20, 0)", 6, 18);
        m += dot(g, [10, 50], C.ok, "B(10, 50)", 8, -8);
        m += dot(g, [0, 60], C.ok, "C(0, 60)", 8, -8);
      } else if(c === "example1"){
        m += linePath(g, [0, 50], [50, 0], "#f59e0b", 2.4);
        m += linePath(g, [0, 90], [30, 0], "#fabd5b", 2.4);
        m += poly(g, [[0, 0], [30, 0], [20, 30], [0, 50]], "rgba(52,211,153,.22)", C.ok, 2);
        m += dot(g, [0, 0], C.ok, "O(0, 0)", 4);
        m += dot(g, [30, 0], C.ok, "A(30, 0)", 6, 18);
        m += dot(g, [20, 30], C.ok, "B(20, 30)", 8, -8);
        m += dot(g, [0, 50], C.ok, "C(0, 50)", 8, -8);
      } else {
        m += linePath(g, [0, 8], [8, 0], "#f59e0b", 2.4);
        m += linePath(g, [0, 3], [5, 0], "#fabd5b", 2.4);
        m += L.text(g.X(5), g.Y(7), "no common points", {size: 15, color: C.danger, weight: 700});
      }
      return m;
    }

    function draw(){
      var c = CASES[st.preset];
      var g = frame(c.xmax, c.ymax, c.xt, c.yt);
      var s = g.svg + drawRegion(g, st.preset);
      var ok = feasible(st.preset, [st.px, st.py]);
      s += L.circle(g.X(st.px), g.Y(st.py), 6, ok ? "#38bdf8" : C.danger);
      s += L.text(g.X(st.px) + 9, g.Y(st.py) - 9, "(" + L.num(st.px, 0) + ", " + L.num(st.py, 0) + ")", {size: 13, color: ok ? "#38bdf8" : C.danger, anchor: "start"});
      L.svg(s, "Feasible region for " + c.cons.join(", "), 290);
      L.readout([
        ["Constraints", c.cons.join("  ·  ")],
        ["Region", c.corners.length ? c.corners.map(function(p){ return "(" + p[0] + ", " + p[1] + ")"; }).join("  ") : "empty", c.corners.length ? C.ok : C.danger],
        ["Probe point", "(" + L.num(st.px, 0) + ", " + L.num(st.py, 0) + ")"],
        ["Probe feasible?", ok ? "yes \u2014 every constraint holds" : "no \u2014 a constraint fails", ok ? C.ok : C.danger],
        ["Region type", c.kind, c.kind === "bounded" ? C.ok : C.danger]
      ]);
      L.verdict(c.verdict);
    }
    function syncSliders(){
      L.setVal("feas-px", L.num(st.px, 0));
      L.setVal("feas-py", L.num(st.py, 0));
      var a = document.getElementById("feas-px"), b = document.getElementById("feas-py");
      if(a) a.value = st.px;
      if(b) b.value = st.py;
      draw();
    }
    function select(id){
      st.preset = id;
      st.px = CASES[id].probe[0];
      st.py = CASES[id].probe[1];
      L.markPreset(id);
      L.watch("Shaded points satisfy all constraints. Drag the probe across the plane and watch the verdict change as it leaves the region.");
      syncSliders();
    }
    function mount(){
      noTimeline();
      L.presets([["furniture", "5x + y \u2264 100, x + y \u2264 60"], ["example1", "x + y \u2264 50, 3x + y \u2264 90"], ["example5", "Empty region example"]], st.preset, select);
      L.controls(
        L.slider("feas-px", "Probe x", 0, 110, 1, st.px, L.num(st.px, 0)) +
        L.slider("feas-py", "Probe y", 0, 110, 1, st.py, L.num(st.py, 0))
      );
      L.onInput("feas-px", function(v){ st.px = v; L.setVal("feas-px", L.num(v, 0)); draw(); });
      L.onInput("feas-py", function(v){ st.py = v; L.setVal("feas-py", L.num(v, 0)); draw(); });
      L.legend([["#f59e0b", "constraint lines"], [C.ok, "feasible region"], ["#38bdf8", "feasible probe"], [C.danger, "infeasible probe"]]);
      L.watch("Shaded points satisfy all constraints. Drag the probe across the plane and watch the verdict change as it leaves the region.");
      draw();
    }
    window.SIMS.lppfeasible = {mount: mount, draw: draw, select: select, state: st};
  })();

  // -----------------------------------------------------------------------
  // Lesson 3 — lppcorner: evaluate the objective at each corner and compare
  // (NCERT §12.2.2, Examples 1 and 2).
  // -----------------------------------------------------------------------
  (function(){
    var CASES = {
      furniture: {
        cons: ["5x + y \u2264 100", "x + y \u2264 60"],
        obj: "Z = 250x + 75y",
        Z: function(x, y){ return 250 * x + 75 * y; },
        corners: [[0, 0], [20, 0], [10, 50], [0, 60]],
        region: [[0, 0], [20, 0], [10, 50], [0, 60]],
        xmax: 110, ymax: 110, xt: 20, yt: 20,
        best: "maximum", bestAt: 2,
        verdict: "The corner table does all the work: Z rises from 0 at the origin to 6250 at B(10, 50). Because the region is bounded, no interior point can beat the largest corner value."
      },
      example1: {
        cons: ["x + y \u2264 50", "3x + y \u2264 90"],
        obj: "Z = 4x + y",
        Z: function(x, y){ return 4 * x + y; },
        corners: [[0, 0], [30, 0], [20, 30], [0, 50]],
        region: [[0, 0], [30, 0], [20, 30], [0, 50]],
        xmax: 95, ymax: 95, xt: 15, yt: 15,
        best: "maximum", bestAt: 1,
        verdict: "Evaluating Z = 4x + y at the four corners gives 0, 120, 110 and 50. The maximum 120 at A(30, 0) beats every other corner, and Theorem 2 guarantees the optimum is at a corner."
      },
      example2: {
        cons: ["x + 2y \u2265 10", "3x + 4y \u2264 24"],
        obj: "Z = 200x + 500y",
        Z: function(x, y){ return 200 * x + 500 * y; },
        corners: [[0, 5], [4, 3], [0, 6]],
        region: [[0, 5], [4, 3], [0, 6]],
        xmax: 10, ymax: 10, xt: 2, yt: 2,
        best: "minimum", bestAt: 1,
        verdict: "Corners (0, 5), (4, 3) and (0, 6) give Z = 2500, 2300 and 3000. The smallest value is 2300 at B(4, 3), the minimum cost."
      }
    };
    var st = {preset: "furniture"};

    function draw(){
      var c = CASES[st.preset];
      var g = frame(c.xmax, c.ymax, c.xt, c.yt);
      var s = g.svg;
      s += poly(g, c.region, "rgba(52,211,153,.20)", C.ok, 2);
      var bestVal = c.Z(c.corners[c.bestAt][0], c.corners[c.bestAt][1]);
      var cells = [["Objective", c.obj, C.ok]];
      for(var i = 0; i < c.corners.length; i++){
        var p = c.corners[i], z = c.Z(p[0], p[1]);
        var isBest = (c.best === "maximum" ? z === bestVal : z === bestVal);
        var col = isBest ? C.ok : C.text;
        s += dot(g, p, isBest ? C.ok : "#94a3b8", "(" + p[0] + ", " + p[1] + ")", 8, -8);
        s += L.text(g.X(p[0]), g.Y(p[1]) + 22, "Z = " + L.num(z, 0), {size: 12, color: col, weight: isBest ? 700 : 400});
        cells.push(["(" + p[0] + ", " + p[1] + ")", "Z = " + L.num(z, 0), col]);
      }
      cells.push([c.best === "maximum" ? "Maximum" : "Minimum", c.best.charAt(0).toUpperCase() + c.best.slice(1) + " Z = " + L.num(bestVal, 0) + " at (" + c.corners[c.bestAt][0] + ", " + c.corners[c.bestAt][1] + ")", C.ok]);
      L.svg(s, "Corner-point evaluation of " + c.obj, 290);
      L.readout(cells);
      L.verdict(c.verdict);
    }
    function select(id){
      st.preset = id;
      L.markPreset(id);
      L.watch("Compare the Z value printed at every corner. The objective line Z = k is parallel to the direction of these values, so it last touches the polygon at the winning corner.");
      draw();
    }
    function mount(){
      noTimeline();
      L.presets([["furniture", "Dealer: Z = 250x + 75y"], ["example1", "Example 1: Z = 4x + y"], ["example2", "Example 2: Z = 200x + 500y"]], st.preset, select);
      L.legend([[C.ok, "feasible polygon"], [C.ok, "winning corner"], ["#94a3b8", "other corners"]]);
      L.watch("Compare the Z value printed at every corner. The objective line Z = k is parallel to the direction of these values, so it last touches the polygon at the winning corner.");
      draw();
    }
    window.SIMS.lppcorner = {mount: mount, draw: draw, select: select, state: st};
  })();

  // -----------------------------------------------------------------------
  // Lesson 4 — lppcases: multiple optima, unbounded regions and an empty
  // feasible region (NCERT §12.2.2, Examples 3, 4 and 5).
  // -----------------------------------------------------------------------
  (function(){
    var CASES = {
      multiple: {
        obj: "Z = 3x + 9y",
        corners: [[0, 10], [5, 5], [15, 15], [0, 20]],
        zv: [90, 60, 180, 180],
        region: [[0, 10], [5, 5], [15, 15], [0, 20]],
        xmax: 30, ymax: 30, xt: 5, yt: 5,
        type: "Bounded, alternate optima",
        outcome: "min Z = 60 at (5, 5); max Z = 180 on the edge from (15, 15) to (0, 20)",
        detail: "Two corners tie at 180, so the whole edge CD is optimal: the problem has multiple optimal solutions.",
        color: C.ok
      },
      "unbounded-min": {
        obj: "Z = \u2013 50x + 20y",
        corners: [[0, 5], [0, 3], [1, 0], [6, 0]],
        zv: [100, 60, -50, -300],
        region: [[0, 5], [1.5, 8], [8, 8], [8, 1.33], [6, 0], [1, 0], [0, 3]],
        xmax: 8, ymax: 8, xt: 1, yt: 1,
        type: "Unbounded, no minimum",
        outcome: "corner values fall to \u2212300 at (6, 0), but Z has no minimum",
        detail: "Corner (6, 0) gives the smallest corner value \u2212300, yet the open half-plane \u221250x + 20y < \u2212300 meets the feasible region, so Z decreases without bound.",
        color: C.danger
      },
      "unbounded-max": {
        obj: "Z = \u2013 x + 2y",
        corners: [[3, 2], [4, 1]],
        zv: [1, -2],
        region: [[3, 2], [4, 1], [6, 0], [10, 0], [10, 10], [3, 10]],
        xmax: 10, ymax: 10, xt: 2, yt: 2,
        type: "Unbounded, no maximum",
        outcome: "largest corner value is 1 at (3, 2), but Z has no maximum",
        detail: "On the ray x = 3, y \u2265 2 the feasible values Z = \u22123 + 2y grow without bound, so the open half-plane \u2212x + 2y > 1 meets the region.",
        color: C.danger
      },
      infeasible: {
        obj: "Z = 3x + 2y",
        corners: [],
        zv: [],
        region: [],
        xmax: 10, ymax: 10, xt: 2, yt: 2,
        type: "Empty feasible region",
        outcome: "no feasible solution, so no optimum exists",
        detail: "x + y \u2265 8 and 3x + 5y \u2264 15 point away from each other: no pair (x, y) satisfies both. The model itself must be reformulated.",
        color: C.danger
      }
    };
    var st = {preset: "multiple"};

    function draw(){
      var c = CASES[st.preset];
      var g = frame(c.xmax, c.ymax, c.xt, c.yt);
      var s = g.svg;
      if(c.region.length) s += poly(g, c.region, "rgba(52,211,153,.18)", C.ok, 2);
      if(st.preset === "infeasible"){
        s += linePath(g, [0, 8], [8, 0], "#f59e0b", 2.4);
        s += linePath(g, [0, 3], [5, 0], "#fabd5b", 2.4);
        s += L.text(g.X(5.2), g.Y(7.6), "no common point", {size: 15, color: C.danger, weight: 700});
      }
      var cells = [["Case", c.type, c.color], ["Objective", c.obj, C.ok]];
      for(var i = 0; i < c.corners.length; i++){
        var p = c.corners[i];
        s += dot(g, p, c.color, "(" + p[0] + ", " + p[1] + ")", 8, -8);
        s += L.text(g.X(p[0]), g.Y(p[1]) + 22, "Z = " + L.num(c.zv[i], 0), {size: 12, color: c.color, weight: 700});
        cells.push(["(" + p[0] + ", " + p[1] + ")", "Z = " + L.num(c.zv[i], 0), c.color]);
      }
      if(!c.corners.length) cells.push(["Feasible points", "none", C.danger]);
      cells.push(["Outcome", c.outcome, c.color]);
      L.svg(s, "Special case: " + c.type, 290);
      L.readout(cells);
      L.verdict("<b>" + c.type + ".</b> " + c.detail);
    }
    function select(id){
      st.preset = id;
      L.markPreset(id);
      L.watch(CASES[id].type + ". Watch the corner values, then read the extra check that decides the outcome.");
      draw();
    }
    function mount(){
      noTimeline();
      L.presets([["multiple", "Multiple optima"], ["unbounded-min", "Unbounded (no minimum)"], ["unbounded-max", "Unbounded (no maximum)"], ["infeasible", "Empty region"]], st.preset, select);
      L.legend([[C.ok, "feasible region"], [C.danger, "no optimum / empty"]]);
      L.watch(CASES[st.preset].type + ". Watch the corner values, then read the extra check that decides the outcome.");
      draw();
    }
    window.SIMS.lppcases = {mount: mount, draw: draw, select: select, state: st};
  })();
})();
