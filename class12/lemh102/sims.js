// Class 12 Mathematics, Chapter 2 (lemh102) — simulation labs.
// One lab per lesson, built on the shared window.LAB helpers (scripts/templates/lab.js).
// Labs are preset driven, so the legacy timeline toolbar is hidden on mount.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Principal-value bench (NCERT §2.2, principal value branches)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PI = Math.PI;
  var CASES = {
    sin: {
      input: "sin⁻¹(1/2)", theta: PI / 6, branch: "[−π/2, π/2]", rangeMin: -PI / 2, rangeMax: PI / 2,
      verdict: "<b>sin⁻¹(1/2) = π/6.</b> The angle π/6 lies in the principal branch [−π/2, π/2], where sine is one-one. The other solutions 5π/6, 13π/6, … are not returned by the inverse function."
    },
    cos: {
      input: "cos⁻¹(−1/2)", theta: 2 * PI / 3, branch: "[0, π]", rangeMin: 0, rangeMax: PI,
      verdict: "<b>cos⁻¹(−1/2) = 2π/3.</b> Since the branch is [0, π], the inverse must return the second-quadrant angle 2π/3, not the negative angle −2π/3."
    },
    tan: {
      input: "tan⁻¹(1)", theta: PI / 4, branch: "(−π/2, π/2)", rangeMin: -PI / 2, rangeMax: PI / 2,
      verdict: "<b>tan⁻¹(1) = π/4.</b> Tangent is one-one on the open interval (−π/2, π/2), so the principal value is the acute angle π/4."
    },
    cosec: {
      input: "cosec⁻¹(2)", theta: PI / 6, branch: "[−π/2, π/2] − {0}", rangeMin: -PI / 2, rangeMax: PI / 2,
      verdict: "<b>cosec⁻¹(2) = π/6.</b> Because cosec y = 2 means sin y = 1/2, and the branch keeps sine's principal values but removes 0."
    },
    sec: {
      input: "sec⁻¹(2/√3)", theta: PI / 6, branch: "[0, π] − {π/2}", rangeMin: 0, rangeMax: PI,
      verdict: "<b>sec⁻¹(2/√3) = π/6.</b> The branch is cosine's [0, π] with π/2 removed, because secant does not exist where cosine vanishes."
    },
    cot: {
      input: "cot⁻¹(−1/√3)", theta: 2 * PI / 3, branch: "(0, π)", rangeMin: 0, rangeMax: PI,
      verdict: "<b>cot⁻¹(−1/√3) = 2π/3.</b> Cotangent is one-one on (0, π), so the negative value −1/√3 corresponds to the obtuse angle 2π/3."
    }
  };
  var st = {preset: "sin"};

  function draw(){
    var c = CASES[st.preset];
    var cx = 300, cy = 160, R = 105;
    var m = "";
    m += L.rect(20, 30, 660, 270, "#0b1522", ' rx="14" stroke="#1e2d3d" stroke-width="1.5"');
    m += L.line(cx - R - 30, cy, cx + R + 30, cy, C.faint, 1.5);
    m += L.line(cx, cy - R - 30, cx, cy + R + 30, C.faint, 1.5);
    var k;
    // Principal-value arc (thick green) from rangeMin to rangeMax.
    var a0 = c.rangeMin, a1 = c.rangeMax;
    var x0 = cx + R * Math.cos(a0), y0 = cy - R * Math.sin(a0);
    var x1 = cx + R * Math.cos(a1), y1 = cy - R * Math.sin(a1);
    var large = (a1 - a0) > Math.PI ? 1 : 0;
    m += '<path d="M ' + x0 + ' ' + y0 + ' A ' + R + ' ' + R + ' 0 ' + large + ' 0 ' + x1 + ' ' + y1 + '" fill="none" stroke="' + C.ok + '" stroke-width="8" opacity=".35" stroke-linecap="round"/>';
    m += L.circle(cx, cy, 3, C.muted);
    // Ray at the principal value.
    var px = cx + R * Math.cos(c.theta), py = cy - R * Math.sin(c.theta);
    m += L.arrow(cx, cy, px, py, "#38bdf8", 3);
    m += L.circle(px, py, 7, "#38bdf8", ' stroke="#0b1522" stroke-width="2"');
    m += L.text(px + 26, py - 10, "θ = " + L.num(c.theta, 4), {size: 15, color: "#38bdf8", weight: 700});
    m += L.text(cx + 46, cy - R - 14, "unit circle", {size: 13, color: C.muted, anchor: "start"});
    m += L.text(cx, cy + R + 48, "green arc = principal branch", {size: 14, color: C.ok, weight: 700});
    m += L.text(350, 52, c.input, {size: 22, color: C.text, weight: 700});
    m += L.text(350, 268, "range of the principal branch: " + c.branch, {size: 14, color: C.muted});
    L.svg(m, "Unit circle showing the principal value angle for " + c.input + ".", 310);

    var deg = c.theta * 180 / PI;
    L.readout([
      ["Expression", c.input],
      ["Principal value", fraction(c.theta)],
      ["Decimal (radians)", L.num(c.theta, 4)],
      ["Degrees", L.num(deg, 0) + "°"],
      ["Principal branch", c.branch]
    ]);
    L.verdict(c.verdict);
  }

  // Exact-looking fraction for the six canonical angles.
  function fraction(t){
    var known = [
      [PI / 6, "π/6"], [PI / 4, "π/4"], [PI / 3, "π/3"], [PI / 2, "π/2"],
      [2 * PI / 3, "2π/3"], [3 * PI / 4, "3π/4"], [5 * PI / 6, "5π/6"],
      [-PI / 6, "−π/6"], [-PI / 4, "−π/4"], [-PI / 3, "−π/3"], [PI, "π"]
    ];
    for(var i = 0; i < known.length; i++){
      if(Math.abs(t - known[i][0]) < 1e-9) return known[i][1];
    }
    return L.num(t, 4);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["sin", "sin⁻¹(1/2)"], ["cos", "cos⁻¹(−1/2)"], ["tan", "tan⁻¹(1)"], ["cosec", "cosec⁻¹(2)"], ["sec", "sec⁻¹(2/√3)"], ["cot", "cot⁻¹(−1/√3)"]], st.preset, select);
    L.legend([["#38bdf8", "angle ray"], [C.ok, "principal branch arc"], [C.faint, "axes"]]);
    L.watch("The green arc is the set of allowed answers. The blue ray is the one principal value the inverse is allowed to return.");
    draw();
  }

  window.SIMS.principalbranch = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Branch viewer (NCERT §2.2, graphs of inverses)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PI = Math.PI;
  var GRAPHS = {
    sin: {
      name: "y = sin⁻¹ x", domain: "[−1, 1]", range: "[−π/2, π/2]", mono: "increasing",
      point: "(1, π/2)", fn: function(x){ return Math.asin(x); },
      xmin: -1.35, xmax: 1.35,
      verdict: "<b>y = sin⁻¹ x</b> is the reflection of the restricted sine graph. It increases from (−1, −π/2) to (1, π/2); the dashed copies are the branches shifted by whole multiples of π."
    },
    cos: {
      name: "y = cos⁻¹ x", domain: "[−1, 1]", range: "[0, π]", mono: "decreasing",
      point: "(1, 0)", fn: function(x){ return Math.acos(x); },
      xmin: -1.35, xmax: 1.35,
      verdict: "<b>y = cos⁻¹ x</b> decreases from (−1, π) to (1, 0). Unlike sin⁻¹, its principal branch does not cross zero, which is why cos⁻¹ of a negative number is obtuse."
    },
    tan: {
      name: "y = tan⁻¹ x", domain: "R", range: "(−π/2, π/2)", mono: "increasing",
      point: "(1, π/4)", fn: function(x){ return Math.atan(x); },
      xmin: -4.2, xmax: 4.2,
      verdict: "<b>y = tan⁻¹ x</b> rises between the horizontal asymptotes y = −π/2 and y = π/2. The dashed branches repeat every π, separated by vertical asymptotes of the tangent."
    },
    cot: {
      name: "y = cot⁻¹ x", domain: "R", range: "(0, π)", mono: "decreasing",
      point: "(1, π/4)", fn: function(x){ return PI / 2 - Math.atan(x); },
      xmin: -4.2, xmax: 4.2,
      verdict: "<b>y = cot⁻¹ x</b> falls through the principal branch (0, π). As x → +∞ it approaches 0 from above; as x → −∞ it approaches π from below."
    }
  };
  var st = {preset: "sin"};

  function plot(c){
    var x0 = 130, x1 = 660, yc = 165, sx = (x1 - x0) / (c.xmax - c.xmin), sy = 42;
    var m = "";
    m += L.rect(20, 25, 660, 280, "#0b1522", ' rx="14" stroke="#1e2d3d" stroke-width="1.5"');
    m += L.line(x0, yc, x1, yc, C.faint, 1.5);
    m += L.line(360, 35, 360, 290, C.faint, 1.5);
    m += L.text(x1 + 4, yc - 8, "x", {size: 13, color: C.text, anchor: "end"});
    m += L.text(354, 42, "y", {size: 13, color: C.text, anchor: "end"});
    var k;
    for(k = -2; k <= 2; k++){
      var pts = [];
      var step = (c.xmax - c.xmin) / 160;
      var x;
      for(x = c.xmin; x <= c.xmax + 1e-9; x += step){
        var y = c.fn(x) + k * PI;
        if(y >= -3.4 && y <= 3.4) pts.push([x, y]);
      }
      if(pts.length < 2) continue;
      var solid = (k === 0);
      m += '<polyline fill="none" stroke="' + (solid ? "#38bdf8" : "#334f6b") + '" stroke-width="' + (solid ? 3.5 : 2) + '"' +
        (solid ? "" : ' stroke-dasharray="7 6"') + ' points="' + pts.map(function(p){ return (x0 + (p[0] - c.xmin) * sx) + "," + (yc - p[1] * sy); }).join(" ") + '"/>';
    }
    m += L.line(x0, yc - PI * sy / 2, x1, yc - PI * sy / 2, C.muted, 1, "4 5");
    m += L.text(x1 - 6, yc - PI * sy / 2 - 8, "y = π/2", {size: 12, color: C.muted, anchor: "end"});
    L.svg(m, "Graph of " + c.name + " with its principal branch highlighted.", 310);
  }

  function draw(){
    var c = GRAPHS[st.preset];
    plot(c);
    L.readout([
      ["Inverse function", c.name],
      ["Domain", c.domain],
      ["Range (principal branch)", c.range],
      ["Monotonicity", c.mono],
      ["Key end point", c.point]
    ]);
    L.verdict(c.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["sin", "sin⁻¹ x"], ["cos", "cos⁻¹ x"], ["tan", "tan⁻¹ x"], ["cot", "cot⁻¹ x"]], st.preset, select);
    L.legend([["#38bdf8", "principal branch"], ["#334f6b", "other branches"], [C.muted, "asymptote"]]);
    L.watch("The solid curve is the principal branch; dashed curves are the same inverse shifted by multiples of π. The graph is the mirror image of the restricted trig graph in y = x.");
    draw();
  }

  window.SIMS.graphbranches = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Composition checker (NCERT §2.3, sin⁻¹ ∘ sin and friends)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PI = Math.PI;
  var CASES = {
    sinsin: {
      expr: "sin⁻¹(sin(2π/3))", input: 2 * PI / 3, inside: false,
      rewrite: "sin(π − 2π/3) = sin(π/3)", value: "π/3", valueNum: PI / 3, fn: Math.sin, inv: Math.asin,
      verdict: "<b>2π/3 is outside [−π/2, π/2].</b> Replace sin(2π/3) by sin(π/3) using sin(π − x) = sin x, then cancel: sin⁻¹(sin(2π/3)) = π/3."
    },
    coscos: {
      expr: "cos⁻¹(cos(7π/6))", input: 7 * PI / 6, inside: false,
      rewrite: "cos(2π − 7π/6) = cos(5π/6)", value: "5π/6", valueNum: 5 * PI / 6, fn: Math.cos, inv: Math.acos,
      verdict: "<b>7π/6 is outside [0, π].</b> Use cos(2π − x) = cos x to reach 5π/6 inside the branch, so cos⁻¹(cos(7π/6)) = 5π/6."
    },
    tanred: {
      expr: "tan⁻¹(tan(3π/4))", input: 3 * PI / 4, inside: false,
      rewrite: "tan(3π/4 − π) = tan(−π/4)", value: "−π/4", valueNum: -PI / 4, fn: Math.tan, inv: Math.atan,
      verdict: "<b>3π/4 is outside (−π/2, π/2).</b> Tangent has period π, so subtract π: tan(3π/4) = tan(−π/4) and the inverse returns −π/4."
    },
    sinarc: {
      expr: "sin(sin⁻¹(0.8))", input: 0.8, inside: true,
      rewrite: "no rewrite needed — 0.8 is a legal sine value", value: "0.8", valueNum: 0.8, fn: Math.sin, inv: Math.asin,
      verdict: "<b>0.8 is in the domain [−1, 1].</b> The function applied after the inverse cancels immediately: sin(sin⁻¹(0.8)) = 0.8."
    }
  };
  var st = {preset: "sinsin"};

  function draw(){
    var c = CASES[st.preset];
    var cx = 360, cy = 168, R = 108;
    var m = "";
    m += L.rect(20, 25, 660, 280, "#0b1522", ' rx="14" stroke="#1e2d3d" stroke-width="1.5"');
    // Branch window for the relevant inverse function.
    var lo = c.inv === Math.atan ? -PI / 2 : (c.inv === Math.acos ? 0 : -PI / 2);
    var hi = c.inv === Math.atan ? PI / 2 : (c.inv === Math.acos ? PI : PI / 2);
    var color = c.inside ? C.ok : C.danger;
    var a0x = cx + R * Math.cos(lo), a0y = cy - R * Math.sin(lo);
    var a1x = cx + R * Math.cos(hi), a1y = cy - R * Math.sin(hi);
    m += '<path d="M ' + a0x + ' ' + a0y + ' A ' + R + ' ' + R + ' 0 0 0 ' + a1x + ' ' + a1y + '" fill="none" stroke="' + C.ok + '" stroke-width="8" opacity=".3" stroke-linecap="round"/>';
    m += L.line(cx - R - 20, cy, cx + R + 20, cy, C.faint, 1.5);
    m += L.line(cx, cy - R - 20, cx, cy + R + 20, C.faint, 1.5);
    // Input angle (red if outside, green if inside) and reference angle.
    var ix = cx + R * Math.cos(c.input), iy = cy - R * Math.sin(c.input);
    m += L.arrow(cx, cy, ix, iy, color, 3);
    m += L.circle(ix, iy, 7, color, ' stroke="#0b1522" stroke-width="2"');
    m += L.text(ix + 20, iy - 10, "x = " + L.num(c.input, 4), {size: 14, color: color, weight: 700});
    if(!c.inside){
      var vx = cx + R * Math.cos(c.valueNum), vy = cy - R * Math.sin(c.valueNum);
      m += L.arrow(cx, cy, vx, vy, "#f59e0b", 2.5);
      m += L.circle(vx, vy, 6, "#f59e0b");
      m += L.text(vx + 20, vy + 18, "reference = " + c.value, {size: 14, color: "#f59e0b", weight: 700});
    }
    m += L.text(360, 52, c.expr, {size: 21, color: C.text, weight: 700});
    m += L.text(360, 285, c.inside ? "input is inside the principal branch" : "input is outside the principal branch", {size: 14, color: color});
    L.svg(m, "Angle wheel for " + c.expr + " with the principal branch highlighted.", 310);

    L.readout([
      ["Expression", c.expr],
      ["Input", (c.inside ? L.num(c.input, 4) : fraction(c.input) + " ≈ " + L.num(c.input, 4))],
      ["Inside principal branch?", c.inside ? "Yes — cancel directly" : "No — reduce first"],
      ["Rewrite", c.rewrite],
      ["Value", c.value]
    ]);
    L.verdict(c.verdict);
  }

  function fraction(t){
    var known = [
      [PI / 6, "π/6"], [PI / 4, "π/4"], [PI / 3, "π/3"], [PI / 2, "π/2"],
      [2 * PI / 3, "2π/3"], [3 * PI / 4, "3π/4"], [5 * PI / 6, "5π/6"], [7 * PI / 6, "7π/6"],
      [-PI / 6, "−π/6"], [-PI / 4, "−π/4"], [-PI / 3, "−π/3"], [PI, "π"]
    ];
    for(var i = 0; i < known.length; i++){
      if(Math.abs(t - known[i][0]) < 1e-9) return known[i][1];
    }
    return L.num(t, 4);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["sinsin", "sin⁻¹(sin 2π/3)"], ["coscos", "cos⁻¹(cos 7π/6)"], ["tanred", "tan⁻¹(tan 3π/4)"], ["sinarc", "sin(sin⁻¹ 0.8)"]], st.preset, select);
    L.legend([["#38bdf8", "input angle"], [C.ok, "principal branch"], ["#f59e0b", "reference angle"]]);
    L.watch("Red means the angle lies outside the branch of the inverse; amber shows the reference angle that brings it back inside.");
    draw();
  }

  window.SIMS.compositionidentity = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Identity bench (NCERT §2.3 + Miscellaneous, triangle identities)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PI = Math.PI;
  var IDS = {
    triple: {
      title: "2 sin⁻¹(3/5) = tan⁻¹(24/7)",
      lines: ["sin θ = 3/5 from a 3-4-5 triangle", "sin 2θ = 24/25, cos 2θ = 7/25", "tan 2θ = 24/7"],
      side: "24", other: "7", hyp: "25", value: 2 * Math.asin(0.6),
      verdict: "<b>Doubling a 3-4-5 triangle produces the 7-24-25 triple.</b> Since sin 2θ and cos 2θ are both positive, 2sin⁻¹(3/5) = tan⁻¹(24/7) ≈ 1.2870 rad."
    },
    sum: {
      title: "cos⁻¹(4/5) + cos⁻¹(12/13) = cos⁻¹(33/65)",
      lines: ["cos α = 4/5, sin α = 3/5", "cos β = 12/13, sin β = 5/13", "cos(α + β) = (48 − 15)/65 = 33/65"],
      side: "33", other: "56", hyp: "65", value: Math.acos(0.8) + Math.acos(12 / 13),
      verdict: "<b>Add the angles with the cosine addition formula.</b> The minus sign between the products gives 33/65, and both angles acute keeps the sum inside [0, π], so cos⁻¹(33/65) ≈ 1.0383 rad."
    },
    complement: {
      title: "sin⁻¹(3/5) + cos⁻¹(3/5) = π/2",
      lines: ["sin θ = 3/5 gives θ ≈ 0.6435", "cos⁻¹(3/5) = π/2 − θ", "the two angles are complementary"],
      side: "3", other: "4", hyp: "5", value: Math.asin(0.6) + Math.acos(0.6),
      verdict: "<b>Inverse sine and inverse cosine of the same number always add to π/2.</b> The triangle makes it visible: the two acute angles of a right triangle are complementary, so the sum is π/2 ≈ 1.5708 rad."
    },
    solve: {
      title: "2 tan⁻¹(cos x) = tan⁻¹(2 cosec x)",
      lines: ["2 tan⁻¹u = tan⁻¹(2u/(1−u²)), u = cos x", "equate: 2cos x/sin²x = 2/sin x", "tan x = 1 → x = nπ + π/4"],
      side: "1", other: "1", hyp: "√2", value: PI / 4,
      verdict: "<b>x = nπ + π/4, n ∈ Z.</b> The double-angle formula collapses the left side, and equating arguments gives tan x = 1. The smallest positive solution is π/4 (45°)."
    }
  };
  var st = {preset: "triple"};

  function draw(){
    var c = IDS[st.preset];
    var m = "";
    m += L.rect(20, 25, 660, 280, "#0b1522", ' rx="14" stroke="#1e2d3d" stroke-width="1.5"');
    m += L.text(360, 55, c.title, {size: 19, color: C.text, weight: 700});
    // Right triangle: vertical side c.side, horizontal side c.other, hypotenuse c.hyp.
    var tx = 200, ty = 250, h = 130, w = 200;
    m += '<polygon points="' + tx + ',' + ty + ' ' + (tx + w) + ',' + ty + ' ' + tx + ',' + (ty - h) + '" fill="rgba(56,189,248,.12)" stroke="#38bdf8" stroke-width="2.5"/>';
    m += '<polyline points="' + tx + ',' + (ty - 18) + ' ' + (tx + 18) + ',' + (ty - 18) + ' ' + (tx + 18) + ',' + ty + '" fill="none" stroke="' + C.muted + '" stroke-width="1.5"/>';
    m += L.text(tx - 18, ty - h / 2, c.side, {size: 16, color: "#f59e0b", weight: 700});
    m += L.text(tx + w / 2, ty + 22, c.other, {size: 16, color: "#60a5fa", weight: 700});
    m += L.text(tx + w / 2 + 18, ty - h / 2 - 26, c.hyp, {size: 16, color: C.ok, weight: 700});
    m += L.text(500, 115, "work each side numerically:", {size: 15, color: C.text, anchor: "start"});
    var i;
    for(i = 0; i < c.lines.length; i++){
      m += L.text(500, 148 + i * 34, "• " + c.lines[i], {size: 13, color: C.muted, anchor: "start"});
    }
    m += L.text(500, 265, "value ≈ " + L.num(c.value, 4) + " rad", {size: 16, color: "#38bdf8", weight: 700, anchor: "start"});
    L.svg(m, "Triangle and numeric check for " + c.title + ".", 310);

    L.readout([
      ["Identity", c.title],
      ["Triangle sides", c.side + ", " + c.other + ", " + c.hyp],
      ["Numeric value", L.num(c.value, 4) + " rad"],
      ["Degrees", L.num(c.value * 180 / PI, 2) + "°"],
      ["Method", "triangle + tangent addition"]
    ]);
    L.verdict(c.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["triple", "2 sin⁻¹(3/5)"], ["sum", "cos⁻¹(4/5)+cos⁻¹(12/13)"], ["complement", "sin⁻¹(3/5)+cos⁻¹(3/5)"], ["solve", "2tan⁻¹(cos x)"]], st.preset, select);
    L.legend([["#38bdf8", "identity"], ["#f59e0b", "vertical side"], ["#60a5fa", "horizontal side"], [C.ok, "hypotenuse"]]);
    L.watch("Each preset builds the right triangle behind the identity and checks both sides numerically in the readout.");
    draw();
  }

  window.SIMS.itfidentities = {mount: mount, draw: draw, select: select, state: st};
})();
