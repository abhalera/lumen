// Class 12 Physics, Chapter 5 (leph105) — simulation labs.
// One lab per lesson, built on the shared Lumen lab helpers (window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Bar magnet field lines and a compass (NCERT §5.1–5.2.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {angle: 40, orient: 0};

  function fieldDir(ax, ay, mx, my){
    var x = ax - mx, y = ay - my;
    var r2 = x * x + y * y, r = Math.sqrt(r2);
    if(r < 1) r = 1;
    var ur = st.orient;                       // moment direction in radians
    var ux = Math.cos(ur), uy = Math.sin(ur);
    var udotr = (ux * x + uy * y) / r;
    var bx = 3 * udotr * (x / r) - ux;
    var by = 3 * udotr * (y / r) - uy;
    return Math.atan2(by, bx);
  }

  function draw(){
    var cx = 360, cy = 150;
    var ur = st.orient;
    var ux = Math.cos(ur), uy = Math.sin(ur);
    var nx = cx + 70 * ux, ny = cy + 70 * uy;
    var sx = cx - 70 * ux, sy = cy - 70 * uy;
    var m = "";
    m += '<line x1="' + sx + '" y1="' + sy + '" x2="' + nx + '" y2="' + ny + '" stroke="#94a3b8" stroke-width="18" stroke-linecap="round"/>';
    m += L.rect(Math.min(sx, nx) - 0, Math.min(sy, ny) - 0, 0, 0, "none", '');
    m += L.text(nx, ny + (uy > 0 ? 36 : -28), "N", {size: 18, color: C.danger, weight: 700});
    m += L.text(sx, sy + (uy > 0 ? 36 : -28), "S", {size: 18, color: "#60a5fa", weight: 700});
    var i;
    for(i = -2; i <= 2; i += 1){
      if(i === 0) continue;
      var off = i * 34;
      var q1 = "M" + nx + " " + ny + " Q " + (cx + 55 * ux - uy * (110 + off)) + " " + (cy + 55 * uy + ux * (110 + off)) + ", " + sx + " " + sy;
      var q2 = "M" + nx + " " + ny + " Q " + (cx + 55 * ux + uy * (110 + off)) + " " + (cy + 55 * uy - ux * (110 + off)) + ", " + sx + " " + sy;
      m += '<path d="' + q1 + '" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<path d="' + q2 + '" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    }
    var a = st.angle * Math.PI / 180;
    var px = cx + 235 * Math.cos(a), py = cy + 235 * Math.sin(a);
    var ang = fieldDir(px, py, cx, cy);
    m += L.circle(px, py, 16, "rgba(248,250,252,.10)", ' stroke="#f8fafc" stroke-width="1.5"');
    m += L.arrow(px - 12 * Math.cos(ang), py - 12 * Math.sin(ang), px + 12 * Math.cos(ang), py + 12 * Math.sin(ang), "#f8fafc", 2.5);
    m += L.text(px, py - 26, "compass", {size: 13, color: C.muted});
    m += L.text(360, 282, "inside the magnet the lines run S → N; outside N → S: every line closes", {size: 13, color: C.muted});
    L.svg(m, "Bar magnet with closed field lines and a compass at " + L.num(st.angle, 0) + " degrees around it.", 300);
    L.readout([
      ["Magnet", st.orient === 0 ? "N pole to the right" : "N pole upward", C.danger],
      ["Compass position", L.num(st.angle, 0) + "°"],
      ["Field lines", "closed loops", C.ok],
      ["Monopoles", "none known", C.muted]
    ]);
    L.verdict("<b>Field-line rules:</b> lines leave the N face, curve through space and re-enter the S face; inside the magnet they run S → N. The compass needle is tangent to the line through its position, and the lines never cross.");
  }

  function select(id){
    st.orient = id === "up" ? Math.PI / 2 : 0;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["right", "N pole → right"], ["up", "N pole ↑ up"]], st.orient === 0 ? "right" : "up", select);
    L.controls(L.slider("t1-a", "Compass angle around magnet", 0, 360, 10, st.angle, L.num(st.angle, 0) + "°"));
    L.onInput("t1-a", function(v){ st.angle = v; L.setVal("t1-a", L.num(v, 0) + "°"); draw(); });
    L.legend([["#38bdf8", "field line"], [C.danger, "N pole"], ["#60a5fa", "S pole"], ["#f8fafc", "compass"]]);
    L.watch("Move the compass around the magnet. It stays tangent to a closed field line, and the field is strongest where the lines crowd near the poles.");
    draw();
  }

  window.SIMS.barmagnet = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Bar magnet versus equivalent solenoid (NCERT §5.2.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {r: 0.20, m: 0.48};
  var K = 1e-7;

  function draw(){
    var B = K * 2 * st.m / Math.pow(st.r, 3);
    var m = "";
    // bar magnet panel
    m += L.text(180, 42, "BAR MAGNET", {size: 16, color: C.text, weight: 700});
    m += L.rect(90, 128, 180, 26, "#94a3b8", ' rx="6"');
    m += L.text(120, 148, "S", {size: 16, color: "#60a5fa", weight: 700});
    m += L.text(240, 148, "N", {size: 16, color: C.danger, weight: 700});
    var i;
    for(i = -1; i <= 1; i += 1){
      m += '<path d="M270 141 Q330 ' + (141 - i * 60) + ' 400 ' + (141 - i * 30) + '" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    }
    // solenoid panel
    m += L.text(540, 42, "SOLENOID (same m)", {size: 16, color: C.text, weight: 700});
    m += L.rect(455, 128, 170, 26, "rgba(148,163,184,.18)", ' rx="6" stroke="#f59e0b" stroke-width="2"');
    for(i = 0; i <= 10; i += 1){
      var x = 459 + i * 16;
      m += L.line(x, 130, x + 12, 152, "#f59e0b", 2);
    }
    m += L.text(470, 148, "S", {size: 14, color: "#60a5fa"});
    m += L.text(608, 148, "N", {size: 14, color: C.danger});
    for(i = -1; i <= 1; i += 1){
      m += '<path d="M630 141 Q690 ' + (141 - i * 60) + ' 760 ' + (141 - i * 30) + '" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    }
    // probe
    var px = 388, py = 141;
    m += L.line(px, 70, px, 250, C.faint, 1, "5 5");
    m += L.circle(px, py, 6, "#f8fafc");
    m += L.text(px, 268, "same r along axis", {size: 13, color: C.muted});
    m += L.text(360, 288, "B = (μ₀/4π)(2m/r³) = " + L.num(B * 1e5, 3) + " × 10⁻⁵ T for both", {size: 15, color: C.ok, weight: 700});
    L.svg(m, "Bar magnet and equivalent solenoid with identical far axial fields.", 300);
    L.readout([
      ["Moment m", L.num(st.m, 2) + " J T⁻¹", "#f59e0b"],
      ["Distance r", L.num(st.r, 2) + " m"],
      ["B (bar magnet)", L.num(B * 1e5, 3) + " × 10⁻⁵ T", C.ok],
      ["B (solenoid)", L.num(B * 1e5, 3) + " × 10⁻⁵ T", C.ok],
      ["Ratio", "1.000 (identical)"]
    ]);
    L.verdict("<b>Ampere's model:</b> a bar magnet behaves exactly like a stack of current loops. Choose a solenoid with the same magnetic moment and the far fields match at every distance - the 1/r³ dipole field.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t2-r", "Probe distance r", 0.08, 0.60, 0.02, st.r, L.num(st.r, 2) + " m") +
      L.slider("t2-m", "Magnetic moment m", 0.10, 1.00, 0.02, st.m, L.num(st.m, 2) + " J T⁻¹")
    );
    L.onInput("t2-r", function(v){ st.r = v; L.setVal("t2-r", L.num(v, 2) + " m"); draw(); });
    L.onInput("t2-m", function(v){ st.m = v; L.setVal("t2-m", L.num(v, 2) + " J T⁻¹"); draw(); });
    L.legend([["#38bdf8", "field line"], ["#f59e0b", "solenoid winding"], [C.ok, "matched axial field"]]);
    L.watch("The two field patterns on the left and right panels are the same shape. Both obey B = (μ₀/4π)(2m/r³), falling as 1/r³.");
    draw();
  }

  window.SIMS.magnetmodel = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Dipole in a uniform field: torque and energy (NCERT §5.2.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {theta: 90};
  var M = 0.32, B = 0.15;

  function apply(){
    var s = document.getElementById("t3-th");
    if(s){ s.value = st.theta; }
    L.setVal("t3-th", L.num(st.theta, 0) + "°");
  }

  function draw(){
    var th = st.theta * Math.PI / 180;
    var tau = M * B * Math.sin(th);
    var U = -M * B * Math.cos(th);
    var cx = 360, cy = 160, half = 105;
    var ux = Math.cos(th), uy = -Math.sin(th);
    var xa = cx - ux * half, ya = cy - uy * half;
    var xb = cx + ux * half, yb = cy + uy * half;
    var m = "";
    var i;
    for(i = 0; i < 6; i += 1){
      var y = 58 + i * 40;
      m += L.arrow(100, y, 650, y, "rgba(148,163,184,.5)", 2);
    }
    m += L.text(662, 52, "B", {size: 18, color: C.muted, weight: 700});
    m += L.line(xa, ya, xb, yb, "#94a3b8", 7);
    m += L.circle(xa, ya, 13, "#1d4ed8") + L.text(xa, ya + 5, "S", {size: 14, color: "#fff", weight: 700});
    m += L.circle(xb, yb, 13, C.danger) + L.text(xb, yb + 5, "N", {size: 14, color: "#fff", weight: 700});
    m += L.arrow(xa, ya, xa, ya - 46, C.danger, 3);
    m += L.arrow(xb, yb, xb, yb + 46, C.danger, 3);
    var R = 52;
    if(st.theta > 4 && st.theta < 176){
      var p0x = cx + R, p0y = cy;
      var p1x = cx + R * Math.cos(th), p1y = cy - R * Math.sin(th);
      m += '<path d="M ' + p0x + ' ' + p0y + ' A ' + R + ' ' + R + ' 0 0 0 ' + p1x + ' ' + p1y + '" fill="none" stroke="' + C.ok + '" stroke-width="3"/>';
    }
    m += L.text(360, 268, "τ = mB sinθ = " + L.num(tau, 3) + " N m   ·   U = −mB cosθ = " + L.num(U, 3) + " J", {size: 16, color: C.text, weight: 700});
    m += L.text(360, 290, "needle moment m = " + L.num(M, 2) + " J T⁻¹, field B = " + L.num(B, 2) + " T", {size: 13, color: C.muted});
    L.svg(m, "Magnetic needle at " + L.num(st.theta, 0) + " degrees to a uniform field.", 300);
    L.readout([
      ["Moment m", L.num(M, 2) + " J T⁻¹"],
      ["Field B", L.num(B, 2) + " T", C.muted],
      ["Angle θ", L.num(st.theta, 0) + "°", C.ok],
      ["Torque τ", L.num(tau, 3) + " N m", tau > 1e-9 ? C.ok : C.muted],
      ["Potential energy U", L.num(U, 3) + " J", C.text]
    ]);
    var msg;
    if(st.theta <= 3) msg = "<b>θ = 0°, stable equilibrium:</b> the needle lies along B, the torque is zero and U = −mB is the minimum energy.";
    else if(st.theta >= 177) msg = "<b>θ = 180°, unstable equilibrium:</b> the torque is zero again, but U = +mB is the maximum; any disturbance flips the needle back.";
    else if(Math.abs(st.theta - 90) <= 3) msg = "<b>θ = 90°:</b> the torque reaches its maximum mB while the energy passes through its zero reference value.";
    else msg = "The field exerts a restoring torque τ = mB sinθ. The needle oscillates about the field direction and loses energy until it settles at θ = 0°.";
    L.verdict(msg);
  }

  function select(id){
    st.theta = id === "stable" ? 0 : (id === "ninety" ? 90 : 180);
    L.markPreset(id);
    apply();
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["stable", "Stable θ = 0°"], ["ninety", "Maximum torque θ = 90°"], ["unstable", "Unstable θ = 180°"]], "ninety", select);
    L.controls(L.slider("t3-th", "Angle θ between m and B", 0, 180, 5, st.theta, L.num(st.theta, 0) + "°"));
    L.onInput("t3-th", function(v){ st.theta = v; L.setVal("t3-th", L.num(v, 0) + "°"); draw(); });
    L.legend([[C.danger, "force on the poles"], ["#94a3b8", "uniform field B"], [C.ok, "torque direction"]]);
    L.watch("Rotate the needle through 180°. Torque peaks at 90° and vanishes at both ends; the energy is lowest at 0° and highest at 180°.");
    draw();
  }

  window.SIMS.dipoleenergy = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Electric and magnetic dipole analogy (NCERT §5.2.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "m-axis", r: 0.20, m: 1.0, p: 1e-9};
  var K = 1e-7;

  function draw(){
    var magnetic = st.preset.charAt(0) === "m";
    var axis = st.preset.indexOf("axis") >= 0;
    var B = 0;
    if(magnetic){
      B = K * (axis ? 2 * st.m : st.m) / Math.pow(st.r, 3);
    } else {
      B = (1 / (4 * Math.PI * 8.854e-12)) * (axis ? 2 * st.p : st.p) / Math.pow(st.r, 3);
    }
    var val = B;
    var m = "";
    var cx = 470, cy = 160;
    if(magnetic){
      m += L.rect(cx - 90, cy - 13, 180, 26, "#94a3b8", ' rx="6"');
      m += L.text(cx - 60, cy + 7, "S", {size: 16, color: "#60a5fa", weight: 700});
      m += L.text(cx + 60, cy + 7, "N", {size: 16, color: C.danger, weight: 700});
      m += L.text(cx, 44, "MAGNETIC DIPOLE m", {size: 16, color: C.text, weight: 700});
    } else {
      m += L.circle(cx - 80, cy, 20, C.danger) + L.text(cx - 80, cy + 7, "+", {size: 22, color: "#fff", weight: 700});
      m += L.circle(cx + 80, cy, 20, "#1d4ed8") + L.text(cx + 80, cy + 7, "−", {size: 22, color: "#fff", weight: 700});
      m += L.text(cx, 44, "ELECTRIC DIPOLE p", {size: 16, color: C.text, weight: 700});
    }
    var dir = axis ? 0 : 1;                    // 0 = probe on axis, 1 = equatorial
    var lx = axis ? cx + 200 : cx;
    var ly = axis ? cy : cy + 120;
    m += L.line(cx, cy, lx, ly, C.faint, 1.5, "5 5");
    m += L.circle(lx, ly, 6, "#f8fafc");
    m += L.text(lx + (axis ? 10 : 12), ly - 8, "probe", {size: 13, color: C.muted, anchor: "start"});
    var formula = magnetic ? (axis ? "B = (μ₀/4π)(2m/r³)" : "B = −(μ₀/4π)(m/r³)") : (axis ? "E = (1/4πε₀)(2p/r³)" : "E = −(1/4πε₀)(p/r³)");
    m += L.text(200, 262, formula, {size: 18, color: C.ok, weight: 700});
    m += L.text(200, 288, (axis ? "axially oriented probe" : "equatorial probe"), {size: 13, color: C.muted});
    L.svg(m, "Comparison of electric and magnetic dipole far fields.", 300);
    L.readout([
      ["Dipole", magnetic ? "magnetic, m = " + L.num(st.m, 2) + " A m²" : "electric, p = " + L.num(st.p * 1e9, 1) + " nC m", magnetic ? "#f59e0b" : C.danger],
      ["Probe", axis ? "on the axis" : "on the equatorial line"],
      ["Distance r", L.num(st.r, 2) + " m"],
      ["Field", magnetic ? "B = " + L.num(val * 1e6, 2) + " µT" : "E = " + L.num(val, 4) + " N/C", C.ok]
    ]);
    L.verdict("<b>The analogy:</b> replace p by m and 1/4πε₀ by μ₀/4π and every electric-dipole formula becomes a magnetic one. The probe on the axis sees twice the equatorial field in both cases, and both fields fall as 1/r³.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["m-axis", "Magnet: on axis"], ["m-eq", "Magnet: equator"], ["e-axis", "Charges: on axis"], ["e-eq", "Charges: equator"]], st.preset, select);
    L.controls(L.slider("t4-r", "Probe distance r", 0.05, 0.50, 0.01, st.r, L.num(st.r, 2) + " m"));
    L.onInput("t4-r", function(v){ st.r = v; L.setVal("t4-r", L.num(v, 2) + " m"); draw(); });
    L.legend([["#f59e0b", "magnetic dipole"], [C.danger, "positive / N"], ["#60a5fa", "negative / S"]]);
    L.watch("Switch between the magnet and the pair of charges and compare the axial and equatorial values. The formulas are structurally identical.");
    draw();
  }

  window.SIMS.dipoleanalogy = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Gauss's law of magnetism: zero net flux (NCERT §5.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "whole", size: 120};

  function draw(){
    var cx = 360, cy = 155;
    var m = "";
    m += L.rect(cx - 90, cy - 13, 180, 26, "#94a3b8", ' rx="6"');
    m += L.text(cx - 60, cy + 7, "S", {size: 16, color: "#60a5fa", weight: 700});
    m += L.text(cx + 60, cy + 7, "N", {size: 16, color: C.danger, weight: 700});
    var rx = st.size + 40, ry = st.size;
    var offset = st.preset === "pole" ? 70 : 0;
    var ex = cx + offset;
    m += '<ellipse cx="' + ex + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="rgba(52,211,153,.06)" stroke="#34d399" stroke-width="2" stroke-dasharray="7 5"/>';
    m += L.text(ex, cy - ry - 12, "closed Gaussian surface", {size: 14, color: "#34d399"});
    var outN = 0, inS = 0;
    var i;
    for(i = 0; i < 8; i += 1){
      var a = i * Math.PI / 4 + 0.2;
      var x1 = cx + 78 * Math.cos(a), y1 = cy + 20 * Math.sin(a);
      var x2 = ex + rx * Math.cos(a), y2 = cy + ry * Math.sin(a);
      if(Math.cos(a) > 0){ outN += 1; } else { inS += 1; }
      m += L.arrow(x1, y1, x2, y2, "#38bdf8", 2);
    }
    m += L.text(360, 28, outN + " lines out = " + inS + " lines in   ⇒   net flux Φ_B = 0", {size: 17, color: C.ok, weight: 700});
    m += L.text(360, 288, "∮ B · dA = 0 for every closed surface: no magnetic sources or sinks", {size: 14, color: C.muted});
    L.svg(m, "Closed surface around a bar magnet showing equal numbers of outgoing and incoming field lines.", 300);
    L.readout([
      ["Surface", st.preset === "whole" ? "encloses the whole magnet" : "encloses the N pole only", "#34d399"],
      ["Lines leaving", String(outN), "#38bdf8"],
      ["Lines entering", String(inS), "#38bdf8"],
      ["Net flux", "0 Wb", C.ok]
    ]);
    L.verdict("<b>Gauss's law of magnetism:</b> whatever the surface does - enclose the whole magnet, just one pole, or cut through the body - the lines that leave are balanced by lines that enter. The net flux is always zero because there are no magnetic monopoles.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["whole", "Around the whole magnet"], ["pole", "Around the N pole only"]], st.preset, select);
    L.controls(L.slider("t5-s", "Gaussian surface size", 80, 150, 5, st.size, String(st.size)));
    L.onInput("t5-s", function(v){ st.size = Number(v); L.setVal("t5-s", String(st.size)); draw(); });
    L.legend([["#34d399", "closed surface"], ["#38bdf8", "field line"]]);
    L.watch("Resize and reposition the surface. The count of outgoing and incoming lines always balances; the net flux meter never moves from zero.");
    draw();
  }

  window.SIMS.magneticflux = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Magnetisation, H, M and B in a core (NCERT §5.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {I: 2, preset: "ferro"};
  var MU0 = 4 * Math.PI * 1e-7;
  var N = 1000;
  var MUR = {vacuum: 1, para: 1.00005, ferro: 400};

  function draw(){
    var mur = MUR[st.preset];
    var H = N * st.I;
    var M = (mur - 1) * H;
    var B = mur * MU0 * H;
    var y1 = 118, y2 = 182;
    var m = "";
    m += L.rect(80, y1 - 8, 560, 8, "#334155", ' rx="4"');
    m += L.rect(80, y2, 560, 8, "#334155", ' rx="4"');
    var i;
    for(i = 0; i <= 22; i += 1){
      var x = 84 + i * 25;
      m += L.line(x, y1 - 6, x + 22, y2 + 6, "#f59e0b", 2.2);
    }
    m += L.rect(110, y1 + 8, 500, y2 - y1 - 16, st.preset === "ferro" ? "rgba(148,163,184,.25)" : (st.preset === "para" ? "rgba(52,211,153,.10)" : "rgba(56,189,248,.05)"), ' rx="4"');
    var arrows = Math.max(3, Math.min(12, Math.round(B / 0.1) + 3));
    for(i = 0; i < arrows; i += 1){
      var xa = 130 + i * (420 / Math.max(1, arrows - 1));
      m += L.arrow(xa, 150, xa + 30, 150, "#38bdf8", 3);
    }
    m += L.text(360, 250, "H = nI = " + L.num(H, 0) + " A/m   ·   M = (μᵣ−1)H = " + L.num(M, 0) + " A/m   ·   B = μᵣμ₀H = " + L.num(B, 4) + " T", {size: 15, color: C.text, weight: 700});
    L.svg(m, "Solenoid with a core of relative permeability " + mur + ", showing H, M and B.", 300);
    L.readout([
      ["Core", st.preset === "vacuum" ? "vacuum, μᵣ = 1" : (st.preset === "para" ? "paramagnet, μᵣ ≈ 1" : "ferromagnet, μᵣ = 400"), st.preset === "ferro" ? "#fcd34d" : C.text],
      ["H = nI", L.num(H, 0) + " A/m"],
      ["M", L.num(M, 0) + " A/m", M > 0 ? C.ok : C.muted],
      ["B = μ₀(H+M)", L.num(B, 4) + " T", C.ok]
    ]);
    L.verdict("<b>Same current, different cores.</b> H is fixed by the winding current. The core contributes M, and B = μ₀(H + M). " + (st.preset === "ferro" ? "With μᵣ = 400 the magnetisation dwarfs H and the field reaches " + L.num(B, 3) + " T." : "For vacuum and the paramagnet, M is negligible and B ≈ μ₀H."));
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["vacuum", "Vacuum core"], ["para", "Paramagnetic core"], ["ferro", "Ferromagnetic core"]], st.preset, select);
    L.controls(L.slider("t6-I", "Solenoid current I", 0.5, 5, 0.5, st.I, L.num(st.I, 1) + " A"));
    L.onInput("t6-I", function(v){ st.I = v; L.setVal("t6-I", L.num(v, 1) + " A"); draw(); });
    L.legend([["#f59e0b", "winding"], ["#38bdf8", "B inside"], ["#fcd34d", "magnetised core"]]);
    L.watch("Change the core without touching the current. H stays the same, but M and B jump by orders of magnitude for the ferromagnet.");
    draw();
  }

  window.SIMS.magneticcore = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Diamagnetic, paramagnetic and ferromagnetic response (NCERT §5.5.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "dia", field: 6};
  var INFO = {
    dia: {name: "Diamagnetic", chi: "−1.6 × 10⁻⁴", mur: "0.99984", pull: "strong → weak field", color: "#60a5fa", spread: -1},
    para: {name: "Paramagnetic", chi: "+2.2 × 10⁻⁵", mur: "1.000022", pull: "weak → strong field", color: "#34d399", spread: 1},
    ferro: {name: "Ferromagnetic", chi: "≫ 1 (≈ 10³)", mur: "≫ 1 (≈ 1500)", pull: "strongly → strong field", color: "#fcd34d", spread: 2}
  };

  function draw(){
    var info = INFO[st.preset];
    var m = "";
    m += L.rect(70, 60, 70, 190, "#7f1d1d", ' rx="6"');
    m += L.rect(580, 60, 70, 190, "#1e3a8a", ' rx="6"');
    m += L.text(105, 52, "N pole", {size: 14, color: C.danger});
    m += L.text(615, 52, "S pole", {size: 14, color: "#93c5fd"});
    m += L.rect(260, 92, 200, 126, info.spread === 0 ? "rgba(148,163,184,.10)" : info.color, ' rx="8" opacity="0.25"');
    m += L.text(360, 80, info.name.toUpperCase() + " SAMPLE", {size: 17, color: info.color, weight: 700});
    var n = st.field;
    var i;
    for(i = 0; i < n; i += 1){
      var y = 100 + i * (110 / Math.max(1, n - 1));
      var bow = info.spread * 16;
      var d = "M140 " + y + " Q 360 " + (y + bow) + " 580 " + y;
      m += '<path d="' + d + '" fill="none" stroke="#38bdf8" stroke-width="2.2"/>';
    }
    m += L.text(360, 250, info.pull, {size: 16, color: info.color, weight: 700});
    m += L.text(360, 276, "χ = " + info.chi + "   ·   μᵣ = " + info.mur, {size: 15, color: C.text});
    L.svg(m, info.name + " sample between magnet poles with " + st.field + " field lines.", 300);
    L.readout([
      ["Material", info.name, info.color],
      ["Susceptibility χ", info.chi],
      ["Relative permeability μᵣ", info.mur],
      ["Field inside", st.preset === "dia" ? "slightly reduced" : (st.preset === "para" ? "slightly enhanced" : "strongly enhanced"), info.color],
      ["Tendency", info.pull, C.ok]
    ]);
    L.verdict("<b>" + info.name + ":</b> " + (st.preset === "dia" ? "induced moments oppose the field (Lenz's law), so the sample is weakly repelled and drifts from strong to weak field." : (st.preset === "para" ? "permanent atomic moments align weakly with the field, so the sample drifts from weak to strong field." : "domains align cooperatively, giving a magnetisation thousands of times stronger, so the sample is pulled strongly into the field.")));
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["dia", "Diamagnetic"], ["para", "Paramagnetic"], ["ferro", "Ferromagnetic"]], st.preset, select);
    L.controls(L.slider("t7-f", "Applied field strength", 3, 10, 1, st.field, String(st.field) + " lines"));
    L.onInput("t7-f", function(v){ st.field = Number(v); L.setVal("t7-f", String(st.field) + " lines"); draw(); });
    L.legend([["#38bdf8", "field line"], ["#60a5fa", "diamagnet"], ["#34d399", "paramagnet"], ["#fcd34d", "ferromagnet"]]);
    L.watch("Compare the line patterns: a diamagnet pushes lines out, a paramagnet draws them in slightly, and a ferromagnet concentrates them strongly.");
    draw();
  }

  window.SIMS.materialresponse = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Paramagnetic alignment versus field and temperature (NCERT §5.5.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {B: 0.5, T: 300};
  var ANGLES = [0.3, 1.2, 2.1, 2.9, 3.8, 4.6, 5.4, 0.9, 1.8, 2.6, 3.4, 4.2, 5.0, 5.8, 0.6, 1.5, 2.4, 3.2, 4.0, 4.9, 5.7, 1.0, 1.9, 2.8];

  function draw(){
    var ratio = st.B / (st.T / 300);              // B in tesla, T in kelvin
    var align = Math.tanh(1.6 * ratio);
    var cx = 360, cy = 150;
    var m = "";
    var i;
    for(i = 0; i < 4; i += 1){
      var y = 70 + i * 55;
      m += L.arrow(80, y, 640, y, "rgba(148,163,184,.45)", 2);
    }
    m += L.text(652, 64, "B", {size: 18, color: C.muted, weight: 700});
    for(i = 0; i < ANGLES.length; i += 1){
      var col = i % 5, row = Math.floor(i / 5);
      var x = 180 + col * 90, y2 = 70 + row * 55;
      var base = ANGLES[i];
      var ang = base * (1 - align);
      var dx = 15 * Math.cos(ang), dy = 13 * Math.sin(ang);
      m += L.circle(x, y2, 12, "rgba(52,211,153,.18)", ' stroke="#34d399" stroke-width="1.4"');
      m += L.arrow(x - dx, y2 - dy, x + dx, y2 + dy, C.ok, 2.4);
    }
    m += L.text(360, 268, "M ∝ B/T:  alignment ≈ " + L.num(align * 100, 1) + "%   (B = " + L.num(st.B, 2) + " T, T = " + L.num(st.T, 0) + " K)", {size: 16, color: C.text, weight: 700});
    L.svg(m, "Paramagnetic atomic moments at " + L.num(st.T, 0) + " kelvin in a field of " + L.num(st.B, 2) + " tesla.", 300);
    L.readout([
      ["Field B", L.num(st.B, 2) + " T", "#38bdf8"],
      ["Temperature T", L.num(st.T, 0) + " K", C.danger],
      ["Ratio B/T", L.num(st.B / st.T * 1000, 3) + " × 10⁻³ T/K"],
      ["Alignment", L.num(align * 100, 1) + "%", C.ok],
      ["Magnetisation M", "∝ B/T ≈ " + L.num(st.B / st.T * 300, 3) + " (relative)", C.ok]
    ]);
    L.verdict("<b>Alignment is a competition:</b> the field tries to line the atomic moments up, thermal motion randomises them. Raise B or lower T and the arrows swing toward the field; the magnetisation grows roughly as B/T until it saturates.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t8-B", "Magnetic field B", 0.05, 2.0, 0.05, st.B, L.num(st.B, 2) + " T") +
      L.slider("t8-T", "Temperature T", 50, 800, 25, st.T, L.num(st.T, 0) + " K")
    );
    L.onInput("t8-B", function(v){ st.B = v; L.setVal("t8-B", L.num(v, 2) + " T"); draw(); });
    L.onInput("t8-T", function(v){ st.T = v; L.setVal("t8-T", L.num(v, 0) + " K"); draw(); });
    L.legend([["#38bdf8", "applied field"], [C.ok, "atomic dipole moment"]]);
    L.watch("Cool the sample or strengthen the field: more arrows point along B and the alignment percentage rises. Heat it and they randomise again.");
    draw();
  }

  window.SIMS.paramagnet = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Ferromagnetic domains and saturation (NCERT §5.5.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {field: 0};
  var SEED = [2.4, 0.4, 3.6, 1.5, 5.2, 2.9, 0.8, 4.4, 3.1, 5.8, 1.9, 0.1, 2.0, 4.9, 1.1, 3.3, 5.5, 0.6, 4.0, 2.6, 0.2, 5.0, 3.8, 1.3];
  var TARGET = 0;                               // field direction: along +x

  function draw(){
    var frac = st.field / 10;
    var cx = 360, cy = 155;
    var m = "";
    m += L.arrow(90, 60, 190, 60, "#38bdf8", 4);
    m += L.text(200, 66, "applied field B₀", {size: 14, color: "#38bdf8", anchor: "start"});
    var i;
    for(i = 0; i < 18; i += 1){
      var col = i % 6, row = Math.floor(i / 6);
      var x = 200 + col * 64, y = 100 + row * 52;
      var base = SEED[i];
      var ang = base * (1 - frac);
      var dx = 20 * Math.cos(ang), dy = 17 * Math.sin(ang);
      m += L.rect(x - 26, y - 20, 52, 40, frac > 0.7 ? "rgba(252,211,77,.16)" : "rgba(148,163,184,.08)", ' rx="6" stroke="' + (frac > 0.7 ? "#fcd34d" : "#64748b") + '" stroke-width="1"');
      m += L.arrow(x - dx, y - dy, x + dx, y + dy, frac > 0.7 ? "#fcd34d" : "#94a3b8", 2.2);
    }
    m += L.text(360, 278, frac <= 0.02 ? "demagnetised: domains random, bulk m ≈ 0" : (frac >= 0.98 ? "saturated: one giant domain, M maximum" : "domain walls move and rotate: partial alignment"), {size: 16, color: C.text, weight: 700});
    L.svg(m, "Ferromagnetic domains with applied field fraction " + L.num(frac, 2) + ".", 300);
    L.readout([
      ["Applied field", L.num(st.field, 1) + " / 10 (relative)", "#38bdf8"],
      ["Domain alignment", L.num(frac * 100, 0) + "%", C.ok],
      ["Bulk magnetisation", frac <= 0.02 ? "≈ 0" : L.num(frac, 2) + " M_sat", C.ok],
      ["Relative permeability", frac <= 0.02 ? "small on average" : "large (μᵣ ≫ 1)", "#fcd34d"]
    ]);
    L.verdict("<b>Domains at work:</b> " + (frac <= 0.02 ? "with no applied field the domains point in random directions and their moments cancel, so the iron is unmagnetised." : (frac >= 0.98 ? "at saturation every domain is aligned with the field; the sample behaves like one giant domain with maximum magnetisation." : "the applied field grows the domains that are already aligned and rotates the moments in the rest, so the bulk magnetisation rises steeply.")));
  }

  function mount(){
    labNoTimeline();
    L.controls(L.slider("t9-B", "Applied field (relative)", 0, 10, 0.5, st.field, L.num(st.field, 1)));
    L.onInput("t9-B", function(v){ st.field = Number(v); L.setVal("t9-B", L.num(st.field, 1)); draw(); });
    L.legend([["#94a3b8", "domain moment (random)"], ["#fcd34d", "aligned domain"], ["#38bdf8", "applied field"]]);
    L.watch("Increase the field from zero to ten. Domains grow and rotate into alignment; at the far right the whole sample is one giant domain.");
    draw();
  }

  window.SIMS.domains = {mount: mount, draw: draw, select: function(){}, state: st};
})();
