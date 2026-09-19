// Class 12 Physics, Chapter 2 (leph102) — simulation labs.
// One lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Electric potential landscape (NCERT §2.1–2.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "pos", Q: 2, r: 0.5};
  var K = 9e9;

  function draw(){
    var sgn = st.preset === "pos" ? 1 : -1;
    var Q = sgn * st.Q * 1e-6;
    var V = K * Q / st.r;
    var Vref = Math.abs(K * st.Q * 1e-6 / 0.1);
    var x0 = 90, x1 = 650, y0 = 245, y1 = 55;
    var ymid = (y0 + y1) / 2, half = (y0 - y1) / 2 - 12;
    var m = "";
    m += L.line(x0, y0, x1 + 8, y0, C.muted, 2);
    m += L.line(x0, y0, x0, y1, C.muted, 2);
    m += L.text(x1 + 8, y0 + 22, "r (m)", {size: 13, color: C.muted});
    m += L.text(x0 - 4, y1 - 6, "V (V)", {size: 13, color: C.muted, anchor: "start"});
    m += L.line(x0, ymid, x1, ymid, C.faint, 1, "4 6");
    var i, px = x0, py = ymid;
    for(i = 1; i <= 140; i += 1){
      var rr = 0.05 + (2.0 - 0.05) * i / 140;
      var vv = K * Q / rr;
      var x = x0 + (rr / 2.0) * (x1 - x0);
      var y = ymid - (vv / Vref) * half;
      if(y < y1 + 2) y = y1 + 2;
      if(y > y0 - 2) y = y0 - 2;
      m += L.line(px, py, x, y, sgn > 0 ? "#60a5fa" : "#f59e0b", 2.4);
      px = x; py = y;
    }
    var xr = x0 + (st.r / 2.0) * (x1 - x0);
    var yv = ymid - (V / Vref) * half;
    if(yv < y1 + 2) yv = y1 + 2;
    if(yv > y0 - 2) yv = y0 - 2;
    m += L.circle(xr, yv, 6, "#f8fafc");
    m += L.text(xr + 12, yv - 10, "V = " + L.num(V / 1000, 1) + " kV", {size: 14, color: "#f8fafc", anchor: "start"});
    m += L.circle(120, 100, 20, sgn > 0 ? C.danger : "#1d4ed8");
    m += L.text(120, 107, sgn > 0 ? "+" : "−", {size: 24, color: "#fff", weight: 700});
    m += L.text(120, 140, "source Q", {size: 13, color: C.muted});
    m += L.text(640, 120, "V = kQ / r", {size: 20, color: C.text, weight: 700, anchor: "end"});
    L.svg(m, "Potential as a function of distance from a point charge.", 280);
    L.readout([
      ["Source charge", (sgn > 0 ? "+" : "−") + st.Q + " μC", sgn > 0 ? C.danger : "#60a5fa"],
      ["Distance r", L.num(st.r, 2) + " m"],
      ["Potential V = kQ/r", L.num(V / 1000, 1) + " kV", sgn > 0 ? C.danger : "#60a5fa"],
      ["Work per μC", L.num(V, 0) + " μJ", C.muted]
    ]);
    var msg = sgn > 0 ? "<b>Positive source:</b> V falls as 1/r but never reaches zero until infinity." : "<b>Negative source:</b> V is negative everywhere and rises toward zero as r grows.";
    msg += " Halving the distance doubles the potential — the red curve of 1/r.";
    L.verdict(msg);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["pos", "Positive source"], ["neg", "Negative source"]], st.preset, select);
    L.controls(
      L.slider("t1-q", "Source charge Q", 1, 10, 1, st.Q, st.Q + " μC") +
      L.slider("t1-r", "Test distance r", 0.05, 2.0, 0.05, st.r, L.num(st.r, 2) + " m")
    );
    L.onInput("t1-q", function(v){ st.Q = v; L.setVal("t1-q", v + " μC"); draw(); });
    L.onInput("t1-r", function(v){ st.r = v; L.setVal("t1-r", L.num(v, 2) + " m"); draw(); });
    L.legend([[C.danger, "positive source"], ["#60a5fa", "positive potential"], ["#f59e0b", "negative potential"]]);
    L.watch("Move the test distance and change the source charge. V is the work per unit charge needed to bring a 1 C test charge from infinity.");
    draw();
  }

  window.SIMS.potential = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Point charge versus dipole potential (NCERT §2.3–2.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "point", Q: 2, r: 0.30, theta: 60};
  var K = 9e9, P = 4e-9;

  function drawPoint(){
    var Q = st.Q * 1e-6;
    var V = K * Q / st.r;
    var scale = 260; // pixels per metre at the probe
    var cx = 300, cy = 160;
    var px = cx + st.r * scale;
    if(px > 640) px = 640;
    var m = "";
    for(var i = 1; i <= 3; i += 1){
      var rr = st.r * i / 3 * scale;
      m += L.circle(cx, cy, Math.min(rr, 250), "none", ' stroke="rgba(148,163,184,.35)" stroke-width="1.5" stroke-dasharray="5 5"');
    }
    m += L.circle(cx, cy, 18, st.Q >= 0 ? C.danger : "#1d4ed8");
    m += L.text(cx, cy + 7, st.Q >= 0 ? "+" : "−", {size: 22, color: "#fff", weight: 700});
    m += L.circle(px, cy, 7, "#f8fafc");
    m += L.line(cx, cy + 40, px, cy + 40, C.muted, 2, "5 5");
    m += L.text((cx + px) / 2, cy + 60, "r = " + L.num(st.r, 2) + " m", {size: 14, color: C.text});
    m += L.text(620, 70, "V = kQ/r", {size: 20, color: C.text, weight: 700, anchor: "end"});
    L.svg(m, "Potential of a point charge probed at distance r.", 300);
    L.readout([
      ["Source", (st.Q >= 0 ? "+" : "−") + st.Q + " μC", st.Q >= 0 ? C.danger : "#60a5fa"],
      ["Distance r", L.num(st.r, 2) + " m"],
      ["Potential V", L.num(V / 1000, 1) + " kV", st.Q >= 0 ? C.danger : "#60a5fa"],
      ["Surface shape", "concentric spheres", C.muted]
    ]);
    L.verdict("<b>Point charge:</b> V = kQ/r. Every point on a sphere of radius r has the same potential — the equipotentials are concentric spheres.");
  }

  function drawDipole(){
    var th = st.theta * Math.PI / 180;
    var V = K * P * Math.cos(th) / (st.r * st.r);
    var cx = 320, cy = 160, a = 60;
    var scale = 420;
    var px = cx + st.r * scale * Math.cos(th);
    var py = cy - st.r * scale * Math.sin(th);
    var m = "";
    m += L.line(cx - a, cy, cx + a, cy, "#94a3b8", 4);
    m += L.circle(cx + a, cy, 14, C.danger) + L.text(cx + a, cy + 5, "+", {size: 18, color: "#fff", weight: 700});
    m += L.circle(cx - a, cy, 14, "#1d4ed8") + L.text(cx - a, cy + 5, "−", {size: 18, color: "#fff", weight: 700});
    m += L.arrow(cx - a + 20, cy - 26, cx + a - 20, cy - 26, C.ok, 3);
    m += L.text(cx, cy - 36, "p", {size: 16, color: C.ok, weight: 700});
    m += L.line(cx, 20, cx, 280, "rgba(148,163,184,.4)", 1.5, "6 5");
    m += L.line(cx, py, px, py, C.faint, 1, "4 4");
    m += L.line(px, py, px, cy, C.faint, 1, "4 4");
    m += L.circle(px, py, 7, "#f8fafc");
    m += L.text(px + 10, py - 10, "V = " + L.num(V, 0) + " V", {size: 14, color: "#f8fafc", anchor: "start"});
    L.svg(m, "Potential of a short dipole at angle theta and distance r.", 300);
    L.readout([
      ["Dipole moment p", "4 × 10⁻⁹ C m", C.ok],
      ["Distance r", L.num(st.r, 2) + " m"],
      ["Angle θ", L.num(st.theta, 0) + "°"],
      ["V = kp cosθ/r²", L.num(V, 0) + " V", Math.abs(V) < 1 ? C.muted : C.ok]
    ]);
    var msg;
    if(Math.abs(st.theta - 90) <= 3) msg = "<b>θ = 90° (equatorial line):</b> cos θ = 0, so V = 0 all along the perpendicular bisector, even though the field is strongest in that direction.";
    else if(st.theta <= 3) msg = "<b>θ = 0° (axis):</b> the positive end is nearest, so V is maximum and positive.";
    else if(st.theta >= 177) msg = "<b>θ = 180° (axis):</b> the negative end is nearest and V is at its most negative.";
    else msg = "V = kp cos θ/r²: the dipole potential falls as 1/r², faster than a point charge, and changes sign with the angle.";
    L.verdict(msg);
  }

  function draw(){
    if(st.preset === "point") drawPoint(); else drawDipole();
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    if(id === "point"){
      L.controls(
        L.slider("t2-q", "Charge Q", 1, 5, 1, st.Q, st.Q + " μC") +
        L.slider("t2-r", "Distance r", 0.10, 0.60, 0.05, st.r, L.num(st.r, 2) + " m")
      );
      L.onInput("t2-q", function(v){ st.Q = v; L.setVal("t2-q", v + " μC"); draw(); });
    } else {
      L.controls(
        L.slider("t2-th", "Angle θ from p", 0, 180, 5, st.theta, L.num(st.theta, 0) + "°") +
        L.slider("t2-r", "Distance r", 0.10, 0.40, 0.05, st.r, L.num(st.r, 2) + " m")
      );
      L.onInput("t2-th", function(v){ st.theta = v; L.setVal("t2-th", L.num(v, 0) + "°"); draw(); });
    }
    L.onInput("t2-r", function(v){ st.r = v; L.setVal("t2-r", L.num(v, 2) + " m"); draw(); });
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["point", "Point charge"], ["dipole", "Short dipole"]], st.preset, select);
    L.legend([[C.danger, "positive charge"], ["#1d4ed8", "negative charge"], [C.ok, "dipole moment p"]]);
    L.watch("Switch between the point charge and the dipole. Track how V changes with distance and, for the dipole, with angle.");
    select(st.preset);
  }

  window.SIMS.pointdipole = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Scalar superposition of potentials (NCERT §2.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "mixed", x: 0.5};
  var K = 9e9, X0 = 140, X1 = 620;

  function charges(){
    if(st.preset === "like") return [2e-6, 3e-6, 1e-6];
    return [2e-6, -3e-6, 1e-6];
  }
  function Vat(x){
    var q = charges();
    var tot = 0;
    tot += K * q[0] / Math.max(Math.abs(x - 0.0), 0.01);
    tot += K * q[1] / Math.max(Math.abs(x - 0.5), 0.01);
    tot += K * q[2] / Math.max(Math.abs(x - 1.0), 0.01);
    return tot;
  }
  function px(x){ return X0 + x * (X1 - X0); }

  function draw(){
    var q = charges();
    var V = Vat(st.x);
    var v1 = K * q[0] / Math.max(Math.abs(st.x - 0), 0.01);
    var v2 = K * q[1] / Math.max(Math.abs(st.x - 0.5), 0.01);
    var v3 = K * q[2] / Math.max(Math.abs(st.x - 1), 0.01);
    var m = "";
    var ymid = 150, scale = 60;
    var maxV = Math.max(Math.abs(Vat(0.03)), Math.abs(Vat(0.97)));
    if(maxV > 4e5) maxV = 4e5;
    scale = 70 / maxV;
    m += L.line(X0, ymid, X1, ymid, C.faint, 1.5, "4 5");
    m += L.line(X0, 40, X0, 260, C.muted, 1.5);
    var pts = [];
    for(var i = 0; i <= 160; i += 1){
      var x = 0.02 + 0.96 * i / 160;
      var vv = Vat(x);
      var y = ymid - vv * scale;
      if(y < 30) y = 30;
      if(y > 272) y = 272;
      pts.push([px(x), y]);
    }
    for(i = 1; i < pts.length; i += 1){
      m += L.line(pts[i-1][0], pts[i-1][1], pts[i][0], pts[i][1], "#38bdf8", 2);
    }
    var col = [C.danger, "#f59e0b", "#a78bfa"];
    for(i = 0; i < 3; i += 1){
      var cx = px(i === 0 ? 0 : (i === 1 ? 0.5 : 1));
      var pos = q[i] >= 0;
      m += L.circle(cx, 265, 11, pos ? C.danger : "#1d4ed8");
      m += L.text(cx, 270, pos ? "+" : "−", {size: 14, color: "#fff", weight: 700});
      m += L.text(cx, 292, (pos ? "+" : "−") + Math.abs(q[i] * 1e6) + " μC", {size: 12, color: col[i]});
    }
    var xprobe = px(st.x);
    var yprobe = ymid - V * scale;
    if(yprobe < 30) yprobe = 30;
    if(yprobe > 272) yprobe = 272;
    m += L.line(xprobe, 40, xprobe, 285, C.faint, 1, "3 4");
    m += L.circle(xprobe, yprobe, 6, "#f8fafc");
    m += L.text(360, 22, "V(x) = kΣqᵢ/rᵢ  —  scalar sum", {size: 17, color: C.text, weight: 700});
    L.svg(m, "Total potential along the line of three charges.", 310);
    L.readout([
      ["V from q₁", L.num(v1 / 1000, 0) + " kV", C.danger],
      ["V from q₂", L.num(v2 / 1000, 0) + " kV", "#f59e0b"],
      ["V from q₃", L.num(v3 / 1000, 0) + " kV", "#a78bfa"],
      ["Total V", L.num(V / 1000, 0) + " kV", "#38bdf8"]
    ]);
    var msg = "The three contributions add as ordinary numbers — signs included. ";
    if(st.preset === "mixed") msg += "Where the positive and negative terms cancel, the blue curve crosses zero even though the field there is not zero.";
    else msg += "With all charges positive the potential is positive everywhere and has no zero crossing.";
    L.verdict(msg);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["mixed", "Charges + − +"], ["like", "Charges + + +"]], st.preset, select);
    L.controls(L.slider("t3-x", "Probe position x", 0.05, 0.95, 0.05, st.x, L.num(st.x, 2) + " m"));
    L.onInput("t3-x", function(v){ st.x = v; L.setVal("t3-x", L.num(v, 2) + " m"); draw(); });
    L.legend([["#38bdf8", "total potential V(x)"], [C.danger, "positive charge"], ["#1d4ed8", "negative charge"]]);
    L.watch("Slide the probe. The readout shows each kq/r term separately and their algebraic sum.");
    draw();
  }

  window.SIMS.superpose = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Equipotential surfaces and E = −dV/dr (NCERT §2.6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "point", n: 5, E: 100};
  var K = 9e9, Q = 2e-6;

  function point(){
    var m = "";
    var cx = 360, cy = 160;
    var ref = K * Q / 0.15; // V at 0.15 m
    for(var i = st.n; i >= 1; i -= 1){
      var Vc = i * ref / st.n;
      var rm = K * Q / Vc;
      var rp = Math.min(260, rm * 900);
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rp + '" ry="' + rp + '" fill="none" stroke="rgba(52,211,153,.55)" stroke-width="1.8" stroke-dasharray="7 5"/>';
    }
    for(i = 0; i < 12; i += 1){
      var a = i * Math.PI / 6;
      m += L.arrow(cx + 30 * Math.cos(a), cy + 30 * Math.sin(a), cx + 120 * Math.cos(a), cy + 120 * Math.sin(a), "#60a5fa", 2);
    }
    m += L.circle(cx, cy, 15, C.danger) + L.text(cx, cy + 6, "+", {size: 20, color: "#fff", weight: 700});
    m += L.text(360, 26, "field lines (solid) cross equipotentials (dashed) at 90°", {size: 15, color: C.muted});
    L.svg(m, "Equipotential circles and radial field lines of a point charge.", 310);
    L.readout([
      ["Source", "+2 μC", C.danger],
      ["Equipotentials", "concentric spheres", C.ok],
      ["ΔV between rings", L.num(ref / st.n / 1000, 0) + " kV", C.ok],
      ["E at 0.15 m", L.num(K * Q / (0.15 * 0.15) / 1000, 0) + " kN/C"]
    ]);
    L.verdict("<b>Crowded contours mean a strong field.</b> The rings bunch up near the charge because E = kQ/r² grows as r falls; spacing and field are inverse to each other.");
  }

  function dipole(){
    var m = "";
    var xp = 280, xm = 440, cy = 155;
    m += L.line(360, 30, 360, 285, "rgba(52,211,153,.6)", 2, "7 5");
    for(var i = 1; i <= 4; i += 1){
      var rx = 34 * i, ry = 26 * i;
      m += '<ellipse cx="' + xp + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="rgba(52,211,153,.5)" stroke-width="1.6" stroke-dasharray="6 5"/>';
      m += '<ellipse cx="' + xm + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="rgba(52,211,153,.5)" stroke-width="1.6" stroke-dasharray="6 5"/>';
    }
    for(i = 0; i < 6; i += 1){
      var bow = 24 + i * 26;
      m += '<path d="M' + xp + ' ' + (cy - 16) + ' C ' + (xp - 30) + ' ' + (cy - bow) + ', ' + (xm + 30) + ' ' + (cy - bow) + ', ' + xm + ' ' + (cy - 16) + '" fill="none" stroke="#60a5fa" stroke-width="2"/>';
      m += '<path d="M' + xp + ' ' + (cy + 16) + ' C ' + (xp - 30) + ' ' + (cy + bow) + ', ' + (xm + 30) + ' ' + (cy + bow) + ', ' + xm + ' ' + (cy + 16) + '" fill="none" stroke="#60a5fa" stroke-width="2"/>';
    }
    m += L.circle(xp, cy, 15, C.danger) + L.text(xp, cy + 6, "+", {size: 20, color: "#fff", weight: 700});
    m += L.circle(xm, cy, 15, "#1d4ed8") + L.text(xm, cy + 6, "−", {size: 20, color: "#fff", weight: 700});
    m += L.text(360, 26, "the mid-plane is the V = 0 equipotential", {size: 15, color: C.muted});
    L.svg(m, "Equipotential curves of a dipole and the zero-potential mid-plane.", 310);
    L.readout([
      ["Sources", "+q and −q", C.text],
      ["Mid-plane", "V = 0 throughout", C.ok],
      ["Near each charge", "spherical contours", C.ok],
      ["Field direction", "from + to −", "#60a5fa"]
    ]);
    L.verdict("<b>Dipole equipotentials:</b> near each charge they look like spheres; far away the two sides look like mirror images, and the perpendicular bisector plane is V = 0 everywhere.");
  }

  function uniform(){
    var m = "";
    var d = st.E === 0 ? 0.05 : (100 / st.E) * 0.05;
    var Vp = st.E * 0.05;
    m += L.rect(120, 55, 480, 20, "#7f1d1d", ' rx="6"');
    m += L.rect(120, 245, 480, 20, "#1e3a8a", ' rx="6"');
    m += L.text(360, 44, "+ + + + + + + +  positive plate", {size: 15, color: C.danger});
    m += L.text(360, 285, "− − − − − − − −  negative plate", {size: 15, color: "#93c5fd"});
    for(var i = 0; i < 9; i += 1){
      var x = 150 + i * 52;
      m += L.arrow(x, 78, x, 242, "#60a5fa", 2);
    }
    for(i = 1; i <= 4; i += 1){
      var y = 55 + (250 - 55) * i / 5;
      m += L.line(120, y, 600, y, "rgba(52,211,153,.65)", 1.8, "7 5");
      m += L.text(618, y + 5, L.num(Vp * (5 - i) / 5, 0) + " V", {size: 12, color: C.ok, anchor: "end"});
    }
    L.svg(m, "Uniform field between plates with equally spaced equipotential planes.", 310);
    L.readout([
      ["Field E", L.num(st.E, 0) + " V/m", "#60a5fa"],
      ["Plate separation", "5.0 cm"],
      ["V across plates", L.num(Vp, 0) + " V", C.ok],
      ["Equipotentials", "parallel planes, equal spacing", C.ok]
    ]);
    L.verdict("<b>Uniform field:</b> equipotential planes are parallel and equally spaced, E = V/d is constant, and the field points from high to low potential.");
  }

  function draw(){
    if(st.preset === "point") point();
    else if(st.preset === "dipole") dipole();
    else uniform();
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    if(id === "uniform"){
      L.controls(L.slider("t4-E", "Field E", 20, 200, 10, st.E, L.num(st.E, 0) + " V/m"));
      L.onInput("t4-E", function(v){ st.E = v; L.setVal("t4-E", L.num(v, 0) + " V/m"); draw(); });
    } else {
      L.controls(L.slider("t4-n", "Number of contours", 3, 8, 1, st.n, String(st.n)));
      L.onInput("t4-n", function(v){ st.n = Number(v); L.setVal("t4-n", String(st.n)); draw(); });
    }
    L.watch(id === "uniform" ? "A uniform field: equally spaced parallel equipotential planes." : "Add contours and watch them crowd near the charge, where the field is strongest.");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["point", "Point charge"], ["dipole", "Dipole"], ["uniform", "Uniform field"]], st.preset, select);
    L.legend([["#60a5fa", "field line"], [C.ok, "equipotential"], [C.danger, "+ charge"]]);
    L.watch("Equipotential contours are always perpendicular to the field lines. Crowding means a strong field.");
    select(st.preset);
  }

  window.SIMS.equipotentials = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Potential energy of a charge assembly (NCERT §2.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "pair", q: 2, d: 0.30, q2: -2};
  var K = 9e9;

  function pair(){
    var q1 = st.q * 1e-6, q2 = st.q2 * 1e-6;
    var U = K * q1 * q2 / st.d;
    var dpx = 120 + (st.d / 0.60) * 400;
    var m = "";
    m += L.line(110, 210, 660, 210, C.faint, 1.5, "4 5");
    var x1 = 220, x2 = x1 + dpx;
    if(x2 > 640) x2 = 640;
    m += L.circle(x1, 150, 20, q1 >= 0 ? C.danger : "#1d4ed8");
    m += L.text(x1, 157, q1 >= 0 ? "+" : "−", {size: 22, color: "#fff", weight: 700});
    m += L.circle(x2, 150, 20, q2 >= 0 ? C.danger : "#1d4ed8");
    m += L.text(x2, 157, q2 >= 0 ? "+" : "−", {size: 22, color: "#fff", weight: 700});
    m += L.text(x1, 190, (q1 >= 0 ? "+" : "−") + Math.abs(st.q) + " μC", {size: 14, color: C.muted});
    m += L.text(x2, 190, (q2 >= 0 ? "+" : "−") + Math.abs(st.q2) + " μC", {size: 14, color: C.muted});
    m += L.line(x1, 226, x2, 226, C.muted, 2, "5 4");
    m += L.text((x1 + x2) / 2, 248, "r = " + L.num(st.d, 2) + " m", {size: 15, color: C.text});
    m += L.text(360, 55, "U = k q₁q₂ / r", {size: 22, color: C.text, weight: 700});
    L.svg(m, "Two point charges separated by r and their pair potential energy.", 280);
    L.readout([
      ["q₁", (q1 >= 0 ? "+" : "−") + Math.abs(st.q) + " μC", q1 >= 0 ? C.danger : "#60a5fa"],
      ["q₂", (q2 >= 0 ? "+" : "−") + Math.abs(st.q2) + " μC", q2 >= 0 ? C.danger : "#60a5fa"],
      ["Separation", L.num(st.d, 2) + " m"],
      ["U = kq₁q₂/r", L.num(U < 0 ? U : U, 3) + " J", U < 0 ? C.ok : C.danger]
    ]);
    var msg = q1 * q2 > 0 ? "<b>Like charges:</b> U is positive. Energy must be supplied to push them together; releasing them converts that energy into kinetic energy." : "<b>Unlike charges:</b> U is negative. Assembling the pair releases energy, and work is needed to pull them apart.";
    L.verdict(msg);
  }

  function triangle(){
    var q = st.q * 1e-6;
    var U = 3 * K * q * q / st.d;
    var cx = 360, cy = 195, R = 95;
    var pts = [];
    for(var i = 0; i < 3; i += 1){
      var a = -Math.PI / 2 + i * 2 * Math.PI / 3;
      pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
    }
    var m = "";
    for(i = 0; i < 3; i += 1){
      var j = (i + 1) % 3;
      m += L.line(pts[i][0], pts[i][1], pts[j][0], pts[j][1], "#94a3b8", 3);
    }
    for(i = 0; i < 3; i += 1){
      m += L.circle(pts[i][0], pts[i][1], 16, q >= 0 ? C.danger : "#1d4ed8");
      m += L.text(pts[i][0], pts[i][1] + 6, q >= 0 ? "+" : "−", {size: 18, color: "#fff", weight: 700});
    }
    m += L.text(cx, 70, "three equal pairs: U = 3 kq²/a", {size: 20, color: C.text, weight: 700});
    m += L.text(cx, 320, "side a = " + L.num(st.d, 2) + " m", {size: 14, color: C.muted});
    L.svg(m, "Three equal charges at the corners of an equilateral triangle.", 340);
    L.readout([
      ["Charge q", (q >= 0 ? "+" : "−") + Math.abs(st.q) + " μC", q >= 0 ? C.danger : "#60a5fa"],
      ["Pair energy kq²/a", L.num(U / 3, 3) + " J", C.muted],
      ["Number of pairs", "3"],
      ["Total U", L.num(U, 3) + " J", U < 0 ? C.ok : C.danger]
    ]);
    L.verdict("<b>Three charges:</b> every distinct pair contributes. For equal charges at the corners of an equilateral triangle all three pairs have the same energy, so U = 3kq²/a.");
  }

  function draw(){
    if(st.preset === "pair") pair(); else triangle();
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["pair", "Two charges"], ["triangle", "Equilateral triplet"]], st.preset, select);
    L.controls(
      L.slider("t5-q", "Charge magnitude", 1, 5, 1, st.q, st.q + " μC") +
      L.slider("t5-d", "Separation a", 0.10, 0.60, 0.05, st.d, L.num(st.d, 2) + " m")
    );
    L.onInput("t5-q", function(v){ st.q = v; L.setVal("t5-q", v + " μC"); draw(); });
    L.onInput("t5-d", function(v){ st.d = v; L.setVal("t5-d", L.num(v, 2) + " m"); draw(); });
    L.legend([[C.danger, "positive charge"], ["#1d4ed8", "negative charge"], ["#94a3b8", "assembly distance"]]);
    L.watch("The readout computes the work needed to assemble the configuration from infinity. Positive U means energy invested; negative U means energy released.");
    draw();
  }

  window.SIMS.pesystem = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Dipole in a uniform field: energy and torque (NCERT §2.8)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {theta: 90, p: 4, E: 5};

  function draw(){
    var th = st.theta * Math.PI / 180;
    var p = st.p * 1e-9, E = st.E * 1e4;
    var U = -p * E * Math.cos(th);
    var torque = p * E * Math.sin(th);
    var cx = 360, cy = 165, Lp = 85;
    var ux = Math.cos(th), uy = -Math.sin(th);
    var xp = cx + ux * Lp, yp = cy + uy * Lp;
    var xm = cx - ux * Lp, ym = cy - uy * Lp;
    var m = "";
    for(var i = 0; i < 6; i += 1){
      var y = 55 + i * 42;
      m += L.arrow(80, y, 650, y, "rgba(148,163,184,.45)", 2);
    }
    m += L.text(662, 55, "E", {size: 16, color: C.muted, weight: 700});
    m += L.line(xm, ym, xp, yp, "#94a3b8", 4);
    m += L.circle(xp, yp, 15, C.danger) + L.text(xp, yp + 6, "+", {size: 18, color: "#fff", weight: 700});
    m += L.circle(xm, ym, 15, "#1d4ed8") + L.text(xm, ym + 6, "−", {size: 18, color: "#fff", weight: 700});
    m += L.arrow(xp, yp, xp + 50, yp, C.danger, 3);
    m += L.arrow(xm, ym, xm - 50, ym, C.danger, 3);
    var R = 52;
    if(st.theta > 3){
      var p0x = cx + R, p0y = cy;
      var p1x = cx + R * Math.cos(th), p1y = cy - R * Math.sin(th);
      m += '<path d="M ' + p0x + ' ' + p0y + ' A ' + R + ' ' + R + ' 0 0 0 ' + p1x + ' ' + p1y + '" fill="none" stroke="' + C.ok + '" stroke-width="3"/>';
      m += L.text(cx + R + 12, cy - R / 2, "θ", {size: 15, color: C.ok, weight: 700});
    }
    m += L.text(360, 268, "U = −pE cos θ   ·   τ = pE sin θ", {size: 19, color: C.text, weight: 700});
    L.svg(m, "A dipole at angle theta to a uniform electric field.", 300);
    L.readout([
      ["p", st.p + " × 10⁻⁹ C m", C.ok],
      ["E", st.E + " × 10⁴ N/C", C.muted],
      ["θ", L.num(st.theta, 0) + "°"],
      ["U = −pE cosθ", L.num(U * 1e4, 2) + " × 10⁻⁴ J", U < 0 ? C.ok : C.danger],
      ["τ = pE sinθ", L.num(torque * 1e4, 2) + " × 10⁻⁴ N m"]
    ]);
    var msg;
    if(st.theta <= 3) msg = "<b>θ = 0°:</b> p is parallel to E. U is minimum (−pE) and the torque is zero — stable equilibrium.";
    else if(st.theta >= 177) msg = "<b>θ = 180°:</b> U is maximum (+pE) and the torque is again zero, but any nudge flips the dipole: unstable equilibrium.";
    else if(Math.abs(st.theta - 90) <= 3) msg = "<b>θ = 90°:</b> U = 0 and the torque is maximum at pE — the dipole is being twisted hardest.";
    else msg = "The forces on +q and −q are equal and opposite: no net force, but their separation produces a torque that twists p toward E and lowers the energy.";
    L.verdict(msg);
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t6-th", "Angle θ between p and E", 0, 180, 5, st.theta, L.num(st.theta, 0) + "°") +
      L.slider("t6-p", "Dipole moment p", 1, 9, 1, st.p, st.p + " × 10⁻⁹ C m") +
      L.slider("t6-E", "Field E", 1, 9, 1, st.E, st.E + " × 10⁴ N/C")
    );
    L.onInput("t6-th", function(v){ st.theta = v; L.setVal("t6-th", L.num(v, 0) + "°"); draw(); });
    L.onInput("t6-p", function(v){ st.p = v; L.setVal("t6-p", v + " × 10⁻⁹ C m"); draw(); });
    L.onInput("t6-E", function(v){ st.E = v; L.setVal("t6-E", v + " × 10⁴ N/C"); draw(); });
    L.legend([["#94a3b8", "uniform field"], [C.danger, "forces on the charges"], [C.ok, "torque direction"]]);
    L.watch("Rotate the dipole. The energy is minimum when it aligns with the field; the torque is maximum at 90°.");
    draw();
  }

  window.SIMS.dipoleenergy = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Electrostatics of conductors (NCERT §2.9)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "sphere", Q: 5};
  var EPS = 8.854e-12;

  function surfaceMarks(cx, cy, R, n, color){
    var m = "";
    for(var i = 0; i < n; i += 1){
      var a = i * 2 * Math.PI / n;
      m += L.circle(cx + (R + 8) * Math.cos(a), cy + (R + 8) * Math.sin(a), 6, color);
      m += L.text(cx + (R + 8) * Math.cos(a), cy + (R + 8) * Math.sin(a) + 4, "−", {size: 11, color: "#fff"});
    }
    return m;
  }

  function arrowsOut(cx, cy, R, sign){
    var m = "";
    for(var i = 0; i < 10; i += 1){
      var a = i * Math.PI / 5;
      var x1 = cx + (R + 20) * Math.cos(a), y1 = cy + (R + 20) * Math.sin(a);
      var x2 = cx + (R + 70) * Math.cos(a), y2 = cy + (R + 70) * Math.sin(a);
      if(sign > 0) m += L.arrow(x1, y1, x2, y2, "#60a5fa", 2.2);
      else m += L.arrow(x2, y2, x1, y1, "#60a5fa", 2.2);
    }
    return m;
  }

  function surfaceReadout(R){
    var Q = st.Q * 1e-9;
    var sigma = Q / (4 * Math.PI * R * R);
    return [sigma, Math.abs(sigma) / EPS];
  }

  function draw(){
    var m = "";
    var sign = st.Q >= 0 ? 1 : -1;
    var Qc = st.Q >= 0 ? C.danger : "#1d4ed8";
    if(st.preset === "sphere"){
      var R1 = 80;
      m += L.circle(360, 155, R1, "rgba(148,163,184,.12)", ' stroke="#94a3b8" stroke-width="3"');
      m += surfaceMarks(360, 155, R1, 12, Qc);
      m += arrowsOut(360, 155, R1, sign);
      m += L.text(360, 60, "E = 0 everywhere inside", {size: 17, color: C.ok, weight: 700});
      m += L.text(360, 285, "all excess charge sits on the outer surface", {size: 14, color: C.muted});
      var r = surfaceReadout(0.12);
      L.svg(m, "A charged solid conducting sphere with surface charge and external field lines.", 310);
      L.readout([
        ["Region inside", "E = 0", C.ok],
        ["Surface charge", "σ = " + L.num(r[0] * 1e6, 2) + " nC/m²", Qc],
        ["Field just outside", "E = σ/ε₀ = " + L.num(r[1], 0) + " N/C", "#60a5fa"],
        ["Surface shape", "equipotential", C.muted]
      ]);
      L.verdict("<b>Solid conductor:</b> free electrons repel each other to the outer surface, leaving a field-free interior. The surface is one equipotential; E just outside is normal to it.");
    } else if(st.preset === "shell"){
      var R2 = 105, Rin = 78;
      m += L.circle(360, 155, R2, "rgba(148,163,184,.16)", ' stroke="#94a3b8" stroke-width="3"');
      m += L.circle(360, 155, Rin, "#09131d", ' stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 5"');
      m += surfaceMarks(360, 155, R2, 12, Qc);
      m += arrowsOut(360, 155, R2, sign);
      m += L.text(360, 60, "cavity field-free: E = 0", {size: 17, color: C.ok, weight: 700});
      m += L.text(360, 292, "shielding works from outside in", {size: 14, color: C.muted});
      L.svg(m, "A hollow conducting shell with charge on the outer surface.", 310);
      L.readout([
        ["Region in cavity", "E = 0", C.ok],
        ["Charge on inner surface", "0", C.ok],
        ["Charge on outer surface", L.signed(st.Q, 0) + " nC", Qc],
        ["Shielding", "yes (outside field blocked)", C.ok]
      ]);
      L.verdict("<b>Hollow shell:</b> a Gaussian surface inside the conductor encloses zero flux, so no charge appears on the inner surface and the cavity is completely shielded.");
    } else {
      var R3 = 110;
      m += L.circle(360, 155, R3, "rgba(148,163,184,.16)", ' stroke="#94a3b8" stroke-width="3"');
      m += L.circle(360, 155, 48, "#09131d", ' stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 5"');
      m += L.circle(360, 155, 12, C.danger) + L.text(360, 161, "+", {size: 15, color: "#fff", weight: 700});
      for(var i = 0; i < 8; i += 1){
        var a = i * Math.PI / 4;
        m += L.arrow(360 + 20 * Math.cos(a), 155 + 20 * Math.sin(a), 360 + 42 * Math.cos(a), 155 + 42 * Math.sin(a), C.danger, 2);
      }
      m += surfaceMarks(360, 155, R3, 12, Qc);
      m += arrowsOut(360, 155, R3, sign);
      m += L.text(360, 60, "charge inside the cavity", {size: 17, color: C.danger, weight: 700});
      m += L.text(360, 295, "inside charges are NOT shielded from the outside", {size: 14, color: "#f59e0b"});
      L.svg(m, "A conductor with a charge inside its cavity.", 320);
      L.readout([
        ["Field in cavity", "non-zero", C.danger],
        ["Induced inner charge", "−q", "#f59e0b"],
        ["Outer surface charge", "+q", C.danger],
        ["Shielding", "one-way only", "#f59e0b"]
      ]);
      L.verdict("<b>Cavity with a charge:</b> the inner surface acquires −q and the outer surface +q. The outer field is visible, so shielding does not work from inside out.");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch(id === "sphere" ? "A charged solid conductor: charge on the outside, zero field within." : (id === "shell" ? "A hollow shell: the cavity is shielded from outside fields." : "A charge inside a cavity: the outside is not shielded from it."));
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["sphere", "Solid sphere"], ["shell", "Hollow shell"], ["cavity", "Charge in cavity"]], st.preset, select);
    L.controls(L.slider("t7-q", "Charge on conductor Q", -9, 9, 1, st.Q, L.signed(st.Q, 0) + " nC"));
    L.onInput("t7-q", function(v){
      st.Q = Number(v);
      if(st.Q === 0) st.Q = 1;
      L.setVal("t7-q", L.signed(st.Q, 0) + " nC");
      draw();
    });
    L.legend([[C.danger, "positive charge"], ["#1d4ed8", "negative charge"], ["#60a5fa", "external field"]]);
    L.watch("Flip the charge sign and switch between the three conductor shapes. The interior field stays zero in the first two cases.");
    draw();
  }

  window.SIMS.conductor = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Dielectrics and polarisation (NCERT §2.10)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "polar", K: 3, E0: 4};
  var EPS = 8.854e-12;

  function draw(){
    var E0 = st.E0 * 1e4;
    var E = E0 / st.K;
    var P = EPS * (st.K - 1) * E;
    var m = "";
    m += L.rect(120, 60, 480, 18, "#7f1d1d", ' rx="5"');
    m += L.rect(120, 232, 480, 18, "#1e3a8a", ' rx="5"');
    m += L.text(360, 48, "positive plate", {size: 14, color: C.danger});
    m += L.text(360, 268, "negative plate", {size: 14, color: "#93c5fd"});
    m += L.rect(170, 82, 380, 146, st.preset === "polar" ? "rgba(96,165,250,.10)" : "rgba(52,211,153,.10)", ' stroke="' + (st.preset === "polar" ? "#60a5fa" : "#34d399") + '" stroke-width="2" rx="8"');
    var i;
    for(i = 0; i < 6; i += 1){
      var x = 210 + i * 60;
      if(st.preset === "polar"){
        m += L.circle(x - 12, 150, 8, C.danger) + L.circle(x + 12, 150, 8, "#1d4ed8");
        m += L.line(x - 4, 150, x + 4, 150, "#94a3b8", 2);
      } else {
        m += '<ellipse cx="' + x + '" cy="150" rx="14" ry="9" fill="none" stroke="#94a3b8" stroke-width="2"/>';
        m += L.circle(x, 150, 4, "#f8fafc");
      }
    }
    var bound = st.preset === "polar" ? 9 : 5;
    for(i = 0; i < bound; i += 1){
      var yy = 95 + i * ((132) / Math.max(bound - 1, 1));
      m += L.circle(176, yy, 5, "#f59e0b");
      m += L.circle(544, yy, 5, C.ok);
    }
    var len0 = 95, len = Math.max(18, 95 / st.K);
    for(i = 0; i < 7; i += 1){
      var xa = 200 + i * 58;
      m += L.arrow(xa, 92, xa, 92 + len0, "rgba(148,163,184,.35)", 3);
      m += L.arrow(xa, 92, xa, 92 + len, "#60a5fa", 3);
    }
    m += L.text(360, 300, "pale arrows: E₀   ·   blue arrows: net E = E₀/K", {size: 13, color: C.muted});
    L.svg(m, "A polarised dielectric slab in a capacitor field.", 320);
    L.readout([
      ["External field E₀", L.num(E0 / 1000, 0) + " kV/m", C.muted],
      ["Dielectric constant K", String(st.K)],
      ["Net field E = E₀/K", L.num(E / 1000, 1) + " kV/m", "#60a5fa"],
      ["Polarisation P", L.num(P * 1e6, 2) + " μC/m²", C.ok]
    ]);
    var msg = st.preset === "polar" ? "<b>Polar molecules:</b> the field torques permanent dipoles into partial alignment, producing bound surface charge." : "<b>Non-polar molecules:</b> the field stretches each molecule, separating its electron cloud from its nuclei and creating induced dipoles.";
    msg += " Either way the induced charges weaken the field inside to E₀/K, but never to zero.";
    L.verdict(msg);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch(id === "polar" ? "Permanent dipoles rotate toward the field." : "Non-polar molecules acquire induced dipoles.");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["polar", "Polar molecules"], ["nonpolar", "Non-polar molecules"]], st.preset, select);
    L.controls(
      L.slider("t8-K", "Dielectric constant K", 1, 8, 1, st.K, String(st.K)) +
      L.slider("t8-E", "External field E₀", 1, 8, 1, st.E0, st.E0 + " × 10⁴ V/m")
    );
    L.onInput("t8-K", function(v){ st.K = Number(v); L.setVal("t8-K", String(st.K)); draw(); });
    L.onInput("t8-E", function(v){ st.E0 = Number(v); L.setVal("t8-E", v + " × 10⁴ V/m"); draw(); });
    L.legend([[C.danger, "bound + charge"], [C.ok, "bound − charge"], ["#60a5fa", "net field inside"]]);
    L.watch("Raise K and watch the net field inside the slab shrink: E = E₀/K. The induced surface charges are the reason.");
    draw();
  }

  window.SIMS.dielectric = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Parallel-plate capacitor bench (NCERT §2.11–2.13)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "connected", A: 0.02, d: 2.0, K: 1, qfixed: 0};
  var EPS = 8.854e-12;

  function cap(){ return st.K * EPS * st.A / (st.d * 1e-3); }

  function draw(){
    var Cc = cap();
    var V, Q;
    if(st.preset === "connected"){
      V = 100;
      Q = Cc * V;
    } else {
      Q = st.qfixed;
      V = Q / Cc;
    }
    var Efield = V / (st.d * 1e-3);
    var cx = 360;
    var w = 150 + Math.sqrt((st.A - 0.01) / 0.09) * 360;
    var gap = 28 + ((st.d - 0.5) / 4.5) * 92;
    var ytop = 130, ybot = ytop + gap;
    var m = "";
    m += L.rect(cx - w / 2 - 10, ytop - 14, w + 20, 14, "#7f1d1d", ' rx="4"');
    m += L.rect(cx - w / 2 - 10, ybot, w + 20, 14, "#1e3a8a", ' rx="4"');
    m += L.text(cx, 100, (st.preset === "connected" ? "battery connected: V = 100 V" : "battery removed: Q frozen"), {size: 15, color: st.preset === "connected" ? C.danger : "#f59e0b"});
    if(st.K > 1){
      m += L.rect(cx - w / 2, ytop, w, gap, "rgba(52,211,153,.14)", ' stroke="#34d399" stroke-width="2" rx="4"');
      m += L.text(cx, ytop + gap / 2 + 5, "dielectric K = " + st.K, {size: 15, color: C.ok, weight: 700});
    } else {
      m += L.text(cx, ytop + gap / 2 + 5, "air", {size: 14, color: C.muted});
    }
    var n = Math.max(3, Math.min(9, Math.round(Efield / 1e4) + 3));
    for(var i = 0; i < n; i += 1){
      var x = cx - w / 2 + 10 + i * ((w - 20) / Math.max(n - 1, 1));
      m += L.arrow(x, ytop + 4, x, ybot - 4, "#60a5fa", 2);
    }
    m += L.line(cx - w / 2 - 10, ybot + 40, cx + w / 2 + 10, ybot + 40, C.faint, 1.5, "5 4");
    m += L.text(cx, ybot + 62, "separation d = " + L.num(st.d, 1) + " mm   ·   plate width ∝ √A", {size: 14, color: C.muted});
    m += L.text(60, 60, "C = Kε₀A/d", {size: 20, color: C.text, weight: 700, anchor: "start"});
    L.svg(m, "Parallel-plate capacitor with adjustable area, gap and dielectric.", 330);
    L.readout([
      ["Capacitance C", L.num(Cc * 1e12, 1) + " pF", C.ok],
      ["Voltage V", L.num(V, 1) + " V", st.preset === "connected" ? C.danger : "#f59e0b"],
      ["Charge Q", L.num(Q * 1e9, 2) + " nC", "#60a5fa"],
      ["Field E", L.num(Efield / 1000, 1) + " kV/m", C.muted]
    ]);
    var msg;
    if(st.preset === "connected") msg = "<b>Battery connected:</b> V is held at 100 V. Increasing K or A, or decreasing d, raises C and the battery supplies more charge: Q = CV.";
    else msg = "<b>Battery removed:</b> Q is frozen at " + L.num(st.qfixed * 1e9, 2) + " nC. Changing C changes V = Q/C — a larger capacitance lowers the voltage, and with it the field.";
    L.verdict(msg);
  }

  function select(id){
    if(id === "isolated" && st.preset === "connected") st.qfixed = cap() * 100;
    st.preset = id;
    L.markPreset(id);
    L.watch(id === "connected" ? "The supply fixes V; charge follows C." : "Charge is fixed; voltage follows 1/C.");
    draw();
  }

  function mount(){
    labNoTimeline();
    st.qfixed = cap() * 100;
    L.presets([["connected", "Battery connected"], ["isolated", "Battery disconnected"]], st.preset, select);
    L.controls(
      L.slider("t9-A", "Plate area A", 0.01, 0.10, 0.01, st.A, L.num(st.A, 2) + " m²") +
      L.slider("t9-d", "Separation d", 0.5, 5.0, 0.5, st.d, L.num(st.d, 1) + " mm") +
      L.slider("t9-K", "Dielectric constant K", 1, 6, 1, st.K, String(st.K))
    );
    L.onInput("t9-A", function(v){ st.A = v; L.setVal("t9-A", L.num(v, 2) + " m²"); draw(); });
    L.onInput("t9-d", function(v){ st.d = v; L.setVal("t9-d", L.num(v, 1) + " mm"); draw(); });
    L.onInput("t9-K", function(v){ st.K = Number(v); L.setVal("t9-K", String(st.K)); draw(); });
    L.legend([[C.danger, "positive plate"], ["#1e3a8a", "negative plate"], ["#60a5fa", "field lines"]]);
    L.watch("Change area, gap and dielectric constant. Compare what happens with the battery on (V fixed) and off (Q fixed).");
    draw();
  }

  window.SIMS.capacitor = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 10 — Combinations of capacitors (NCERT §2.14)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "series", C1: 4, C2: 6, V: 100};

  function draw(){
    var V = st.V;
    var Ceq, Q1, Q2, V1, V2;
    if(st.preset === "series"){
      Ceq = st.C1 * st.C2 / (st.C1 + st.C2);
      var Q = Ceq * V;
      Q1 = Q2 = Q;
      V1 = Q / st.C1; V2 = Q / st.C2;
    } else {
      Ceq = st.C1 + st.C2;
      Q1 = st.C1 * V; Q2 = st.C2 * V;
      V1 = V2 = V;
    }
    var m = "";
    if(st.preset === "series"){
      m += L.line(120, 90, 250, 90, "#94a3b8", 3);
      m += L.line(330, 90, 460, 90, "#94a3b8", 3);
      m += L.line(540, 90, 620, 90, "#94a3b8", 3);
      m += L.line(620, 90, 620, 240, "#94a3b8", 3);
      m += L.line(620, 240, 120, 240, "#94a3b8", 3);
      m += L.line(120, 240, 120, 90, "#94a3b8", 3);
      m += L.line(280, 60, 280, 120, C.ok, 5);
      m += L.line(300, 60, 300, 120, C.ok, 5);
      m += L.line(490, 60, 490, 120, C.ok, 5);
      m += L.line(510, 60, 510, 120, C.ok, 5);
      m += L.text(290, 45, "C₁ = " + st.C1 + " μF", {size: 14, color: C.ok});
      m += L.text(500, 45, "C₂ = " + st.C2 + " μF", {size: 14, color: C.ok});
      m += L.text(370, 84, "same charge Q", {size: 14, color: C.text});
      m += L.text(370, 262, "V = " + L.num(V, 0) + " V", {size: 14, color: C.danger});
      m += L.text(360, 300, "1/C = 1/C₁ + 1/C₂   ·   V = V₁ + V₂", {size: 17, color: C.text, weight: 700});
    } else {
      m += L.line(120, 90, 620, 90, "#94a3b8", 3);
      m += L.line(120, 240, 620, 240, "#94a3b8", 3);
      m += L.line(250, 90, 250, 240, "#94a3b8", 3);
      m += L.line(470, 90, 470, 240, "#94a3b8", 3);
      m += L.line(210, 90, 210, 240, "#94a3b8", 3);
      m += L.line(510, 90, 510, 240, "#94a3b8", 3);
      m += L.line(230, 60, 230, 120, C.ok, 5);
      m += L.line(250, 60, 250, 120, C.ok, 5);
      m += L.line(490, 60, 490, 120, C.ok, 5);
      m += L.line(510, 60, 510, 120, C.ok, 5);
      m += L.text(150, 160, "C₁ = " + st.C1 + " μF", {size: 14, color: C.ok});
      m += L.text(400, 160, "C₂ = " + st.C2 + " μF", {size: 14, color: C.ok});
      m += L.text(360, 70, "same voltage V on each", {size: 14, color: C.text});
      m += L.line(120, 280, 120, 60, "#94a3b8", 3);
      m += L.line(120, 280, 560, 280, "#94a3b8", 3);
      m += L.text(360, 302, "C = C₁ + C₂   ·   Q = Q₁ + Q₂", {size: 17, color: C.text, weight: 700});
    }
    L.svg(m, "Two capacitors connected in " + st.preset + ".", 320);
    L.readout([
      ["Connection", st.preset === "series" ? "series" : "parallel", C.muted],
      ["Equivalent C", L.num(Ceq, 2) + " μF", C.ok],
      ["Charge on C₁", L.num(Q1, 1) + " μC", Q1 === Q2 ? C.muted : C.ok],
      ["Voltage across C₁", L.num(V1, 1) + " V", V1 === V2 ? C.muted : C.ok],
      ["Charge on C₂", L.num(Q2, 1) + " μC", Q1 === Q2 ? C.muted : C.ok],
      ["Voltage across C₂", L.num(V2, 1) + " V", V1 === V2 ? C.muted : C.ok]
    ]);
    var msg;
    if(st.preset === "series") msg = "<b>Series:</b> both capacitors store the same charge " + L.num(Q1, 1) + " μC, and the supply voltage divides in inverse proportion to capacitance.";
    else msg = "<b>Parallel:</b> both capacitors sit at the same " + L.num(V, 0) + " V, and the charges add in proportion to capacitance.";
    L.verdict(msg);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch(id === "series" ? "Series: same charge on each, voltages add." : "Parallel: same voltage on each, charges add.");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["series", "In series"], ["parallel", "In parallel"]], st.preset, select);
    L.controls(
      L.slider("t10-c1", "Capacitance C₁", 1, 10, 1, st.C1, st.C1 + " μF") +
      L.slider("t10-c2", "Capacitance C₂", 1, 10, 1, st.C2, st.C2 + " μF") +
      L.slider("t10-v", "Supply voltage", 10, 100, 10, st.V, L.num(st.V, 0) + " V")
    );
    L.onInput("t10-c1", function(v){ st.C1 = Number(v); L.setVal("t10-c1", v + " μF"); draw(); });
    L.onInput("t10-c2", function(v){ st.C2 = Number(v); L.setVal("t10-c2", v + " μF"); draw(); });
    L.onInput("t10-v", function(v){ st.V = Number(v); L.setVal("t10-v", L.num(v, 0) + " V"); draw(); });
    L.legend([[C.ok, "capacitor"], [C.danger, "supply"], ["#94a3b8", "connecting wires"]]);
    L.watch("Compare the two connections. In series the charge is common; in parallel the voltage is common.");
    draw();
  }

  window.SIMS.capcombo = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 11 — Energy stored in a capacitor (NCERT §2.15)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {C: 12, V: 50};

  function draw(){
    var Cc = st.C * 1e-12;
    var Q = Cc * st.V;
    var U = 0.5 * Cc * st.V * st.V;
    var x0 = 110, y0 = 250, x1 = 630, y1 = 60;
    var m = "";
    m += L.line(x0, y0, x1 + 10, y0, C.muted, 2);
    m += L.line(x0, y0, x0, y1, C.muted, 2);
    m += L.text((x0 + x1) / 2, y0 + 30, "charge q (C)", {size: 13, color: C.muted});
    m += L.text(x0 - 6, y1 - 8, "voltage V (V)", {size: 13, color: C.muted, anchor: "start"});
    var Vlin = st.V * 1.15;
    var xx = function(q){ return x0 + (q / Q) * (x1 - x0); };
    var yy = function(v){ return y0 - (v / Vlin) * (y0 - y1); };
    m += '<path d="M' + x0 + ' ' + y0 + ' L' + xx(Q) + ' ' + yy(st.V) + ' L' + x0 + ' ' + yy(st.V) + ' Z" fill="rgba(56,189,248,.28)"/>';
    m += L.line(x0, yy(st.V), xx(Q), yy(st.V), "#38bdf8", 2, "5 5");
    m += L.line(x0, y0, xx(Q), yy(st.V), "#38bdf8", 3);
    m += L.circle(xx(Q), yy(st.V), 6, "#f8fafc");
    m += L.text(xx(Q) - 8, yy(st.V) - 12, "(Q, V)", {size: 13, color: "#f8fafc", anchor: "end"});
    m += L.text((x0 + xx(Q)) / 2, y0 - (y0 - yy(st.V)) / 2 + 5, "area = ½QV = U", {size: 15, color: C.ok, weight: 700});
    L.svg(m, "Voltage versus charge while charging a capacitor; the triangle area is the stored energy.", 300);
    L.readout([
      ["Capacitance C", st.C + " pF", C.ok],
      ["Voltage V", L.num(st.V, 0) + " V", C.danger],
      ["Charge Q = CV", L.num(Q * 1e9, 2) + " nC", "#60a5fa"],
      ["Energy U = ½CV²", L.num(U * 1e9, 2) + " nJ", C.ok],
      ["Energy U = ½QV", L.num(U * 1e9, 2) + " nJ", C.muted]
    ]);
    L.verdict("<b>The work is the area of the triangle.</b> Voltage starts at zero and rises linearly to V, so the average voltage is V/2 and the total work is ½QV. That is why the factor ½ appears.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t11-C", "Capacitance C", 1, 100, 1, st.C, st.C + " pF") +
      L.slider("t11-V", "Charging voltage V", 1, 100, 1, st.V, L.num(st.V, 0) + " V")
    );
    L.onInput("t11-C", function(v){ st.C = Number(v); L.setVal("t11-C", v + " pF"); draw(); });
    L.onInput("t11-V", function(v){ st.V = Number(v); L.setVal("t11-V", L.num(v, 0) + " V"); draw(); });
    L.legend([["#38bdf8", "V–q charging line"], [C.ok, "stored energy (area)"]]);
    L.watch("Change C and V. The shaded triangle is the work done by the battery in charging the capacitor.");
    draw();
  }

  window.SIMS.capenergy = {mount: mount, draw: draw, select: function(){}, state: st};
})();


