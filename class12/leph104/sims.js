// Class 12 Physics, Chapter 4 (leph104) — simulation labs.
// One lab per lesson, built on the shared Lumen lab helpers (window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Compass ring around a straight wire (NCERT §4.1–4.2.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {dir: "out", I: 10};
  var MU0 = 4 * Math.PI * 1e-7;

  function needle(x, y, angle, color){
    return L.circle(x, y, 13, "rgba(248,250,252,.10)", ' stroke="' + color + '" stroke-width="1.5"') +
      L.arrow(x - 10 * Math.cos(angle), y - 10 * Math.sin(angle), x + 10 * Math.cos(angle), y + 10 * Math.sin(angle), color, 2.5);
  }

  function draw(){
    var cx = 360, cy = 150, R = 95;
    var out = st.dir === "out";
    var m = "";
    m += L.circle(cx, cy, 9, "#f8fafc");
    if(out){
      m += L.circle(cx, cy, 4, C.danger);
      m += L.text(cx, cy + 4, "", {});
    } else {
      m += L.line(cx - 6, cy - 6, cx + 6, cy + 6, C.danger, 3);
      m += L.line(cx - 6, cy + 6, cx + 6, cy - 6, C.danger, 3);
    }
    m += L.circle(cx, cy, R, "none", ' stroke="' + C.faint + '" stroke-width="1.2" stroke-dasharray="5 5"');
    for(var i = 0; i < 8; i += 1){
      var a = i * Math.PI / 4;
      var px = cx + R * Math.cos(a), py = cy + R * Math.sin(a);
      var ang = out ? (a + Math.PI / 2) : (a - Math.PI / 2);
      m += needle(px, py, ang, i % 2 === 0 ? "#60a5fa" : "#93c5fd");
    }
    m += L.text(cx, 34, "current " + (out ? "OUT of the page (·)" : "INTO the page (×)"), {size: 17, color: C.danger, weight: 700});
    m += L.text(cx, 285, "B = " + L.num(MU0 * st.I / (2 * Math.PI * 0.05) * 1000, 2) + " mT at 5 cm from the wire", {size: 15, color: C.muted});
    L.svg(m, "Compass needles on a circle around a straight wire carrying current " + (out ? "out of" : "into") + " the page.", 300);
    L.readout([
      ["Current I", L.num(st.I, 0) + " A", C.danger],
      ["Direction", out ? "out of the page ·" : "into the page ×", C.text],
      ["Field sense", out ? "anticlockwise" : "clockwise", "#60a5fa"],
      ["B at 5 cm", L.num(MU0 * st.I / (2 * Math.PI * 0.05) * 1000, 2) + " mT", C.ok]
    ]);
    L.verdict("<b>Right-hand grip rule:</b> point the thumb along the current; the curled fingers give the sense of B. " + (out ? "With current out of the page the circles run anticlockwise." : "With current into the page the circles run clockwise.") + " Reversing I reverses every arrow.");
  }

  function select(id){
    st.dir = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["out", "Current out of page ·"], ["in", "Current into page ×"]], st.dir, select);
    L.controls(L.slider("t1-I", "Current I", 2, 20, 1, st.I, L.num(st.I, 0) + " A"));
    L.onInput("t1-I", function(v){ st.I = v; L.setVal("t1-I", L.num(v, 0) + " A"); draw(); });
    L.legend([["#60a5fa", "compass needle"], [C.danger, "current direction"]]);
    L.watch("The needles never point at or away from the wire - they line up with circles around it. Flip the current and every needle reverses.");
    draw();
  }

  window.SIMS.oersted = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Lorentz force bench (NCERT §4.2.2–4.2.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {theta: 60, sign: 1, v: 3, B: 0.5};
  var Q = 1e-6;

  function draw(){
    var th = st.theta * Math.PI / 180;
    var F = st.sign * Q * st.v * 1e6 * st.B * Math.sin(th);
    var cx = 250, cy = 165, len = 150;
    var Bx = 640;
    var m = "";
    var i;
    for(i = 0; i < 5; i += 1){
      var y = 70 + i * 45;
      m += L.arrow(80, y, Bx, y, "rgba(148,163,184,.55)", 2);
    }
    m += L.text(660, 62, "B", {size: 19, color: C.muted, weight: 700});
    var vx = cx + len * Math.cos(th), vy = cy - len * Math.sin(th);
    m += L.arrow(cx, cy, vx, vy, "#38bdf8", 4);
    m += L.text(vx + 12, vy - 4, "v", {size: 19, color: "#38bdf8", weight: 700});
    m += L.circle(cx, cy, 15, st.sign > 0 ? C.danger : "#1d4ed8");
    m += L.text(cx, cy + 6, st.sign > 0 ? "+" : "−", {size: 20, color: "#fff", weight: 700});
    var arc = 42;
    m += '<path d="M ' + (cx + arc) + ' ' + cy + ' A ' + arc + ' ' + arc + ' 0 0 0 ' + (cx + arc * Math.cos(th)) + ' ' + (cy - arc * Math.sin(th)) + '" fill="none" stroke="' + C.ok + '" stroke-width="2"/>';
    m += L.text(cx + 62, cy - 18, "θ", {size: 16, color: C.ok, weight: 700});
    var fdir = Math.sin(th) >= 0 ? "out of the page ⊙" : "into the page ⊗";
    m += L.text(cx, 258, "F = qvB sinθ = " + L.num(Math.abs(F) * 1e3, 2) + " mN  " + (Math.abs(F) < 1e-9 ? "(v ∥ B → no force)" : "(" + fdir + " for +q)"), {size: 16, color: C.text, weight: 700});
    L.svg(m, "A charge moving at " + L.num(st.theta, 0) + " degrees to a magnetic field.", 300);
    L.readout([
      ["Charge", (st.sign > 0 ? "+1.0" : "−1.0") + " μC", st.sign > 0 ? C.danger : "#60a5fa"],
      ["Speed v", L.num(st.v, 1) + " × 10⁶ m/s", "#38bdf8"],
      ["Angle θ", L.num(st.theta, 0) + "°"],
      ["Force F", L.num(Math.abs(F) * 1e3, 2) + " mN", Math.abs(F) > 1e-9 ? C.ok : C.muted]
    ]);
    var msg;
    if(st.theta <= 1 || st.theta >= 179) msg = "<b>v parallel (or antiparallel) to B:</b> sin θ = 0, so the magnetic force vanishes completely.";
    else if(Math.abs(st.theta - 90) <= 1) msg = "<b>v ⊥ B:</b> the force reaches its maximum qvB and points perpendicular to both v and B.";
    else msg = "Only the component of v perpendicular to B produces force: F = qvB sin θ. The force is always perpendicular to v, so it does no work.";
    L.verdict(msg);
  }

  function select(id){
    st.sign = id === "plus" ? 1 : -1;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["plus", "Positive charge +"], ["minus", "Negative charge −"]], st.sign > 0 ? "plus" : "minus", select);
    L.controls(
      L.slider("t2-th", "Angle θ between v and B", 0, 180, 5, st.theta, L.num(st.theta, 0) + "°") +
      L.slider("t2-v", "Speed v", 0.5, 6, 0.5, st.v, L.num(st.v, 1) + " × 10⁶ m/s") +
      L.slider("t2-B", "Field B", 0.1, 1.5, 0.1, st.B, L.num(st.B, 1) + " T")
    );
    L.onInput("t2-th", function(v){ st.theta = v; L.setVal("t2-th", L.num(v, 0) + "°"); draw(); });
    L.onInput("t2-v", function(v){ st.v = v; L.setVal("t2-v", L.num(v, 1) + " × 10⁶ m/s"); draw(); });
    L.onInput("t2-B", function(v){ st.B = v; L.setVal("t2-B", L.num(v, 1) + " T"); draw(); });
    L.legend([["#38bdf8", "velocity v"], [C.danger, "positive charge"], [C.ok, "angle θ"]]);
    L.watch("Slide the angle from 0° to 90°. The force grows from zero to its maximum; the sign of the charge only flips its direction.");
    draw();
  }

  window.SIMS.lorentz = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Circular and helical motion (NCERT §4.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "proton", v: 3, B: 1.0};
  var PARTS = {
    proton: {name: "Proton", q: 1.6e-19, mass: 1.67e-27, color: C.danger},
    electron: {name: "Electron", q: 1.6e-19, mass: 9.1e-31, color: "#60a5fa"},
    alpha: {name: "Alpha (He²⁺)", q: 3.2e-19, mass: 6.64e-27, color: "#f59e0b"}
  };

  function draw(){
    var p = PARTS[st.preset];
    var v = st.v * 1e6, B = st.B;
    var r = p.mass * v / (p.q * B);
    var nu = p.q * B / (2 * Math.PI * p.mass);
    var T = 1 / nu;
    // Keep the radius and period meaningful for light particles (electron: mm and ps).
    var rText = r < 0.01 ? L.num(r * 1000, 3) + " mm" : L.num(r * 100, 2) + " cm";
    var tText = T * 1e9 < 1 ? L.num(T * 1e12, 1) + " ps" : L.num(T * 1e9, 1) + " ns";
    var cx = 280, cy = 150;
    var r0 = p.mass * 4.5e6 / (p.q * 1.0);
    var px = Math.max(14, Math.min(108, r / r0 * 60));
    var m = "";
    var i;
    for(i = 0; i < 5; i += 1){
      var y = 55 + i * 48;
      m += L.arrow(70, y, 660, y, "rgba(148,163,184,.35)", 2);
    }
    m += L.text(672, 54, "B", {size: 17, color: C.muted, weight: 700});
    m += L.circle(cx, cy, px, "rgba(56,189,248,.10)", ' stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 5"');
    var a0 = -Math.PI / 2;
    var x0 = cx + px * Math.cos(a0), y0 = cy + px * Math.sin(a0);
    m += L.circle(x0, y0, 8, p.color);
    m += L.arrow(x0, y0, x0 + 34, y0 + 18, p.color, 3);
    m += L.text(x0 + 44, y0 + 22, "v", {size: 15, color: p.color});
    m += L.line(cx, cy, x0, y0, C.muted, 1.5, "4 4");
    m += L.text(cx + 6, cy - 6, "r", {size: 15, color: C.muted});
    m += L.text(cx, 268, "r = mv/qB = " + rText + "   ·   ν = qB/2πm = " + L.num(nu / 1e6, 2) + " MHz", {size: 16, color: C.text, weight: 700});
    L.svg(m, "Circular orbit of a " + p.name.toLowerCase() + " in a uniform magnetic field.", 300);
    L.readout([
      ["Particle", p.name, p.color],
      ["Speed v", L.num(st.v, 1) + " × 10⁶ m/s", "#38bdf8"],
      ["Field B", L.num(st.B, 2) + " T"],
      ["Radius r", rText, C.ok],
      ["Frequency ν", L.num(nu / 1e6, 2) + " MHz"],
      ["Period T", tText, C.muted]
    ]);
    L.verdict("<b>" + p.name + ":</b> the magnetic force is centripetal, so r = mv/qB. Change the speed and the radius changes, but the frequency ν = qB/2πm stays fixed — the basis of the cyclotron.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["proton", "Proton"], ["electron", "Electron"], ["alpha", "Alpha particle"]], st.preset, select);
    L.controls(
      L.slider("t3-v", "Speed v", 1, 8, 0.5, st.v, L.num(st.v, 1) + " × 10⁶ m/s") +
      L.slider("t3-B", "Field B", 0.2, 2.0, 0.1, st.B, L.num(st.B, 2) + " T")
    );
    L.onInput("t3-v", function(v){ st.v = v; L.setVal("t3-v", L.num(v, 1) + " × 10⁶ m/s"); draw(); });
    L.onInput("t3-B", function(v){ st.B = v; L.setVal("t3-B", L.num(v, 2) + " T"); draw(); });
    L.legend([[C.danger, "proton"], ["#60a5fa", "electron"], ["#f59e0b", "alpha particle"], ["#38bdf8", "orbit"]]);
    L.watch("Change the particle, speed and field. The radius scales with mv/qB; the frequency depends only on qB/m.");
    draw();
  }

  window.SIMS.cyclotron = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Biot-Savart bench (NCERT §4.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {theta: 90, r: 0.25, I: 10};
  var DL = 0.02;

  function draw(){
    var th = st.theta * Math.PI / 180;
    var dB = 1e-7 * st.I * DL * Math.sin(th) / (st.r * st.r);
    var ox = 200, oy = 170;
    var scale = 320;
    var px = ox + scale * Math.cos(th);
    var py = oy - scale * Math.sin(th);
    var m = "";
    m += L.line(90, oy, 600, oy, C.faint, 1.5, "6 5");
    m += L.line(ox, 40, ox, 285, C.faint, 1.5, "6 5");
    m += L.arrow(ox - 46, oy + 46, ox + 46, oy + 46, C.danger, 5);
    m += L.text(ox + 58, oy + 80, "I dl", {size: 16, color: C.danger, weight: 700, anchor: "start"});
    m += L.line(ox, oy, px, py, "#f8fafc", 2);
    m += L.circle(px, py, 7, "#f8fafc");
    m += L.text(px + 16, py + 5, "P", {size: 17, color: "#f8fafc", weight: 700, anchor: "start"});
    var arc = 48;
    m += '<path d="M ' + (ox + arc) + ' ' + oy + ' A ' + arc + ' ' + arc + ' 0 0 0 ' + (ox + arc * Math.cos(th)) + ' ' + (oy - arc * Math.sin(th)) + '" fill="none" stroke="' + C.ok + '" stroke-width="2"/>';
    m += L.text(ox + 66, oy - 22, "θ", {size: 16, color: C.ok, weight: 700});
    var dir = Math.sin(th) >= 0 ? "+z (out of the page)" : "−z (into the page)";
    m += L.text(96, 300 - 18, "dB = 10⁻⁷ I dl sinθ / r²", {size: 16, color: C.text, weight: 700, anchor: "start"});
    L.svg(m, "A current element and a point P at distance r and angle theta.", 300);
    L.readout([
      ["Current I", L.num(st.I, 0) + " A", C.danger],
      ["Element dl", "2.0 cm along +x"],
      ["Distance r", L.num(st.r, 2) + " m"],
      ["Angle θ", L.num(st.theta, 0) + "°", C.ok],
      ["dB", L.num(dB * 1e9, 2) + " nT", dB > 0 ? C.ok : C.muted]
    ]);
    var msg;
    if(st.theta <= 1 || st.theta >= 179) msg = "<b>θ = 0° or 180°:</b> the point lies on the line of the element, sin θ = 0 and the field it produces is exactly zero.";
    else msg = "<b>Biot–Savart law:</b> dB grows with I and dl, falls as 1/r², and follows the sine of the angle. Its direction, " + dir + ", is perpendicular to both dl and r.";
    L.verdict(msg);
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t4-th", "Angle θ between dl and r", 0, 180, 5, st.theta, L.num(st.theta, 0) + "°") +
      L.slider("t4-r", "Distance r", 0.10, 0.60, 0.05, st.r, L.num(st.r, 2) + " m") +
      L.slider("t4-I", "Current I", 2, 20, 1, st.I, L.num(st.I, 0) + " A")
    );
    L.onInput("t4-th", function(v){ st.theta = v; L.setVal("t4-th", L.num(v, 0) + "°"); draw(); });
    L.onInput("t4-r", function(v){ st.r = v; L.setVal("t4-r", L.num(v, 2) + " m"); draw(); });
    L.onInput("t4-I", function(v){ st.I = v; L.setVal("t4-I", L.num(v, 0) + " A"); draw(); });
    L.legend([[C.danger, "current element I dl"], ["#f8fafc", "observation point P"], [C.ok, "angle θ"]]);
    L.watch("Sweep the point P around the element and watch the field die to zero along the line of dl and peak at 90°.");
    draw();
  }

  window.SIMS.biotsavart = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Axial field of a circular loop (NCERT §4.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {x: 0, R: 0.10, N: 1, I: 2};
  var MU0 = 4 * Math.PI * 1e-7;

  function draw(){
    var R = st.R;
    var bx = MU0 * st.N * st.I * R * R / (2 * Math.pow(st.x * st.x + R * R, 1.5));
    var b0 = MU0 * st.N * st.I / (2 * R);
    var frac = bx / b0;
    var cx = 230, cy = 155;
    var scale = 1.6 / R;
    var px = Math.max(cx + 8, Math.min(640, cx + st.x * scale));
    var m = "";
    m += L.line(70, cy, 680, cy, C.faint, 2);
    m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="16" ry="78" fill="none" stroke="#f59e0b" stroke-width="3"/>';
    m += L.circle(cx, cy - 78, 6, "#f59e0b");
    m += L.circle(cx, cy + 78, 6, "#f59e0b");
    var i;
    for(i = 0; i < 4; i += 1){
      m += L.arrow(cx - 30 + i * 20, cy - 100, cx - 30 + i * 20, cy - 128, "#60a5fa", 2);
      m += L.arrow(cx - 30 + i * 20, cy + 100, cx - 30 + i * 20, cy + 128, "#60a5fa", 2);
    }
    m += L.text(cx, cy + 168, "loop, radius R", {size: 14, color: "#f59e0b"});
    m += L.circle(px, cy, 6, "#f8fafc");
    m += L.arrow(px, cy - 12, px, cy - 12 - Math.min(120, 130 * frac), "#38bdf8", 4);
    m += L.text(px, cy - 24 - Math.min(120, 130 * frac), "B", {size: 16, color: "#38bdf8", weight: 700});
    m += L.text(px, cy + 26, "x = " + L.num(st.x, 2) + " m", {size: 14, color: C.muted});
    var far = MU0 * 2 * (st.N * st.I * Math.PI * R * R) / (4 * Math.PI * Math.pow(Math.max(st.x, 0.001), 3));
    m += L.text(360, 40, "B(x) = " + L.num(bx * 1e3, 3) + " mT   ·   B/B₀ = " + L.num(frac, 3), {size: 18, color: C.text, weight: 700});
    if(st.x > 2 * R) m += L.text(360, 68, "far field B ≈ μ₀2m/4πx³ = " + L.num(far * 1e3, 3) + " mT (dipole limit)", {size: 13, color: C.muted});
    L.svg(m, "Magnetic field along the axis of a circular current loop at distance " + L.num(st.x, 2) + " metres.", 300);
    L.readout([
      ["Turns N", String(st.N)],
      ["Current I", L.num(st.I, 1) + " A", "#f59e0b"],
      ["Radius R", L.num(st.R, 2) + " m"],
      ["B at centre", L.num(b0 * 1e3, 3) + " mT", C.ok],
      ["B at x", L.num(bx * 1e3, 3) + " mT", "#38bdf8"],
      ["Ratio B/B₀", L.num(frac, 3)]
    ]);
    var msg;
    if(st.x <= 0.001) msg = "<b>At the centre:</b> B = μ₀NI/2R, the strongest point on the axis. The perpendicular components of every element cancel here.";
    else if(st.x > 2 * R) msg = "<b>Far from the loop:</b> B has fallen to " + L.num(frac * 100, 1) + "% of its central value. The fall approaches 1/x³ — the field of a magnetic dipole of moment m = NIA.";
    else msg = "<b>On the axis:</b> the axial components of all the elements add, while the sideways components cancel in pairs. Move farther out and B drops steeply.";
    L.verdict(msg);
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t5-x", "Axial distance x", 0, 0.60, 0.02, st.x, L.num(st.x, 2) + " m") +
      L.slider("t5-N", "Number of turns N", 1, 20, 1, st.N, String(st.N)) +
      L.slider("t5-I", "Current I", 0.5, 5, 0.5, st.I, L.num(st.I, 1) + " A")
    );
    L.onInput("t5-x", function(v){ st.x = v; L.setVal("t5-x", L.num(v, 2) + " m"); draw(); });
    L.onInput("t5-N", function(v){ st.N = Number(v); L.setVal("t5-N", String(st.N)); draw(); });
    L.onInput("t5-I", function(v){ st.I = v; L.setVal("t5-I", L.num(v, 1) + " A"); draw(); });
    L.legend([["#f59e0b", "current loop (seen edge-on)"], ["#38bdf8", "axial field B(x)"]]);
    L.watch("Start at the centre and slide x outward. The blue arrow shrinks and the field eventually follows the 1/x³ dipole law.");
    draw();
  }

  window.SIMS.loopfield = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Ampere's loop around a thick wire (NCERT §4.6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {r: 0.5, I: 50};
  var A = 2.0, MU0 = 4 * Math.PI * 1e-7;   // wire radius in mm

  function field(r){
    if(r <= A) return MU0 * st.I * (r * 1e-3) / (2 * Math.PI * Math.pow(A * 1e-3, 2));
    return MU0 * st.I / (2 * Math.PI * r * 1e-3);
  }

  function draw(){
    var cx = 320, cy = 150, scale = 55;
    var B = field(st.r);
    var m = "";
    m += L.circle(cx, cy, A * scale, "#25364a", ' stroke="#f59e0b" stroke-width="2"');
    m += L.circle(cx, cy, 4, C.danger);
    var i;
    for(i = 0; i < 5; i += 1){
      var a = i * Math.PI * 2 / 5;
      m += L.text(cx + 22 * Math.cos(a), cy + 22 * Math.sin(a) + 5, "×", {size: 14, color: "#fcd34d"});
    }
    m += L.circle(cx, cy, st.r * scale, "rgba(52,211,153,.08)", ' stroke="#34d399" stroke-width="2" stroke-dasharray="6 5"');
    var tangent = st.r <= A;
    var sign = tangent ? 1 : 1;
    var tx = cx + st.r * scale, ty = cy;
    m += L.arrow(tx, ty, tx, ty - 58 * (B / field(A)), "#38bdf8", 4);
    m += L.text(tx + 14, ty - 30, "B", {size: 15, color: "#38bdf8"});
    m += L.text(cx, 278, (st.r <= A ? "inside the wire: B ∝ r" : "outside the wire: B ∝ 1/r"), {size: 16, color: C.text, weight: 700});
    L.svg(m, "Amperian circle of radius " + L.num(st.r, 2) + " millimetres around a thick wire.", 300);
    L.readout([
      ["Wire radius a", "2.0 mm"],
      ["Current I", L.num(st.I, 0) + " A", C.danger],
      ["Amperian radius r", L.num(st.r, 2) + " mm", C.ok],
      ["Enclosed current", st.r <= A ? L.num(st.I * st.r * st.r / (A * A), 1) + " A" : L.num(st.I, 0) + " A"],
      ["B at r", L.num(B * 1e3, 3) + " mT", "#38bdf8"]
    ]);
    var msg;
    if(st.r < A - 0.05) msg = "<b>Inside the wire:</b> only the fraction r²/a² of the current is enclosed, so B = μ₀Ir/2πa² rises linearly from zero at the centre.";
    else if(st.r > A + 0.05) msg = "<b>Outside the wire:</b> the loop encloses the whole current I, so B = μ₀I/2πr falls as 1/r. The blue arrow tracks the field.";
    else msg = "<b>At the surface:</b> the inside and outside formulas meet at B = μ₀I/2πa — the field is continuous across the surface.";
    L.verdict(msg);
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t6-r", "Amperian radius r", 0.1, 5.0, 0.1, st.r, L.num(st.r, 1) + " mm") +
      L.slider("t6-I", "Current I", 10, 100, 5, st.I, L.num(st.I, 0) + " A")
    );
    L.onInput("t6-r", function(v){ st.r = v; L.setVal("t6-r", L.num(v, 1) + " mm"); draw(); });
    L.onInput("t6-I", function(v){ st.I = v; L.setVal("t6-I", L.num(v, 0) + " A"); draw(); });
    L.legend([["#f59e0b", "current × (out of page)"], ["#34d399", "Amperian circle"], ["#38bdf8", "field B"]]);
    L.watch("Sweep the green circle from the centre outward. Inside the wire B grows linearly; outside it falls as 1/r.");
    draw();
  }

  window.SIMS.ampere = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Solenoid bench (NCERT §4.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {n: 2000, I: 3, core: "air"};
  var MU0 = 4 * Math.PI * 1e-7;
  var MUR = {air: 1, iron: 1000};

  function draw(){
    var B = MU0 * st.n * st.I * MUR[st.core];
    var y1 = 118, y2 = 182;
    var m = "";
    m += L.rect(80, y1 - 8, 560, 8, "#334155", ' rx="4"');
    m += L.rect(80, y2, 560, 8, "#334155", ' rx="4"');
    var i;
    for(i = 0; i <= 22; i += 1){
      var x = 84 + i * 25;
      m += L.line(x, y1 - 6, x + 22, y2 + 6, "#f59e0b", 2.4);
    }
    m += L.rect(100, y1 + 8, 520, y2 - y1 - 16, st.core === "iron" ? "rgba(148,163,184,.18)" : "rgba(56,189,248,.06)", ' rx="4"');
    m += L.text(360, 96, "solenoid: n = " + st.n + " turns/m, I = " + L.num(st.I, 1) + " A", {size: 16, color: C.text});
    var arrows = Math.min(12, Math.max(3, Math.round(B / 0.005) + 3));
    for(i = 0; i < arrows; i += 1){
      var xa = 120 + i * (470 / Math.max(1, arrows - 1));
      m += L.arrow(xa, 150, xa + 34, 150, "#38bdf8", 3);
    }
    m += L.text(360, 240, "B = μ₀μᵣnI = " + L.num(B, 4) + " T inside", {size: 18, color: C.ok, weight: 700});
    m += L.text(360, 266, "outside the ideal solenoid B → 0", {size: 14, color: C.muted});
    L.svg(m, "Long solenoid with " + st.n + " turns per metre and a " + st.core + " core.", 300);
    L.readout([
      ["Turns/m n", String(st.n), "#f59e0b"],
      ["Current I", L.num(st.I, 1) + " A"],
      ["Core", st.core === "iron" ? "soft iron, μᵣ = 1000" : "air, μᵣ = 1", st.core === "iron" ? "#fcd34d" : C.text],
      ["Field B", L.num(B, 4) + " T", C.ok],
      ["Field at end", L.num(B / 2, 4) + " T", C.muted]
    ]);
    L.verdict("<b>Long-solenoid formula:</b> B = μ₀nI is uniform right across the interior and independent of the radius. " + (st.core === "iron" ? "The soft-iron core multiplies it by μᵣ ≈ 1000." : "Insert a soft-iron core and μᵣ = 1000 raises the field by a thousand times."));
  }

  function select(id){
    st.core = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["air", "Air core"], ["iron", "Soft-iron core"]], st.core, select);
    L.controls(
      L.slider("t7-n", "Turns per metre n", 500, 5000, 250, st.n, String(st.n)) +
      L.slider("t7-I", "Current I", 0.5, 10, 0.5, st.I, L.num(st.I, 1) + " A")
    );
    L.onInput("t7-n", function(v){ st.n = Number(v); L.setVal("t7-n", String(st.n)); draw(); });
    L.onInput("t7-I", function(v){ st.I = v; L.setVal("t7-I", L.num(v, 1) + " A"); draw(); });
    L.legend([["#f59e0b", "winding"], ["#38bdf8", "field inside"], ["#fcd34d", "iron core"]]);
    L.watch("Double n or I and B doubles. Swap the air core for iron and the field jumps a thousandfold.");
    draw();
  }

  window.SIMS.solenoidlab = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Force between parallel currents (NCERT §4.8)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {same: true, d: 0.08, I: 10};
  var MU0 = 4 * Math.PI * 1e-7;

  function draw(){
    var f = MU0 * st.I * st.I / (2 * Math.PI * st.d);
    var x1 = 230, x2 = x1 + 120 + st.d * 900;
    var out1 = true, out2 = st.same;
    var m = "";
    m += L.circle(x1, 150, 22, "rgba(248,250,252,.06)", ' stroke="#f59e0b" stroke-width="2"');
    m += L.circle(x2, 150, 22, "rgba(248,250,252,.06)", ' stroke="#f59e0b" stroke-width="2"');
    m += L.circle(x1, 150, 5, C.danger) + L.text(x1, 130, "I", {size: 15, color: C.danger});
    if(out2){
      m += L.circle(x2, 150, 5, C.danger) + L.text(x2, 130, "I", {size: 15, color: C.danger});
    } else {
      m += L.line(x2 - 7, 143, x2 + 7, 157, C.danger, 3);
      m += L.line(x2 - 7, 157, x2 + 7, 143, C.danger, 3);
      m += L.text(x2, 130, "I", {size: 15, color: C.danger});
    }
    m += L.text(360, 250, "force per unit length f = " + L.num(f * 1e3, 4) + " × 10⁻³ N/m", {size: 17, color: C.text, weight: 700});
    m += L.text((x1 + x2) / 2, 215, L.num(st.d, 2) + " m", {size: 15, color: C.muted});
    m += L.line(x1, 195, x2, 195, C.faint, 1, "5 5");
    if(st.same){
      m += L.arrow(x1 - 40, 150, x1 - 76, 150, C.ok, 5);
      m += L.arrow(x2 + 40, 150, x2 + 76, 150, C.ok, 5);
      m += L.text(360, 60, "PARALLEL CURRENTS ATTRACT", {size: 19, color: C.ok, weight: 700});
    } else {
      m += L.arrow(x1 - 40, 150, x1 - 10, 150, C.danger, 5);
      m += L.arrow(x2 + 40, 150, x2 + 10, 150, C.danger, 5);
      m += L.text(360, 60, "ANTIPARALLEL CURRENTS REPEL", {size: 19, color: C.danger, weight: 700});
    }
    L.svg(m, "Two parallel wires carrying " + (st.same ? "same-direction" : "opposite-direction") + " currents.", 300);
    L.readout([
      ["Current", L.num(st.I, 1) + " A each", C.danger],
      ["Separation d", L.num(st.d, 2) + " m"],
      ["Directions", st.same ? "parallel (both out ·)" : "antiparallel (one in ×)", C.text],
      ["Force per length", L.num(f * 1e3, 4) + " × 10⁻³ N/m", st.same ? C.ok : C.danger],
      ["Type", st.same ? "attractive" : "repulsive", st.same ? C.ok : C.danger]
    ]);
    L.verdict(st.same ? "<b>Parallel currents attract.</b> Each wire sits in the circular field of the other, and I l × B pulls them together." : "<b>Antiparallel currents repel.</b> The field directions reverse between the wires, so the force pushes them apart.");
  }

  function select(id){
    st.same = id === "same";
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["same", "Parallel currents →"], ["anti", "Antiparallel currents ⇄"]], st.same ? "same" : "anti", select);
    L.controls(
      L.slider("t8-d", "Separation d", 0.02, 0.20, 0.01, st.d, L.num(st.d, 2) + " m") +
      L.slider("t8-I", "Current I", 2, 20, 1, st.I, L.num(st.I, 0) + " A")
    );
    L.onInput("t8-d", function(v){ st.d = v; L.setVal("t8-d", L.num(v, 2) + " m"); draw(); });
    L.onInput("t8-I", function(v){ st.I = v; L.setVal("t8-I", L.num(v, 0) + " A"); draw(); });
    L.legend([[C.danger, "current out of page ·"], ["#1d4ed8", "current into page ×"], [C.ok, "attraction"]]);
    L.watch("Hover over the geometry: f = μ₀I²/2πd. Halve the separation and the force doubles; reverse one current and the force reverses.");
    draw();
  }

  window.SIMS.parallelwires = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Torque on a current loop (NCERT §4.9)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {theta: 90};
  var N = 100, A = 0.02, B = 0.5;
  var M = N * 100 * A; // N=100 turns, I=1 A scaled display constant

  function apply(){
    var s = document.getElementById("t9-th");
    if(s){ s.value = st.theta; }
    L.setVal("t9-th", L.num(st.theta, 0) + "°");
  }

  function draw(){
    var th = st.theta * Math.PI / 180;
    var I = 1;
    var m = N * I * A;
    var tau = m * B * Math.sin(th);
    var U = -m * B * Math.cos(th);
    var cx = 360, cy = 155, half = 110;
    var ux = Math.cos(th), uy = -Math.sin(th);
    var xa = cx - ux * half, ya = cy - uy * half;
    var xb = cx + ux * half, yb = cy + uy * half;
    var s = "";
    var i;
    for(i = 0; i < 6; i += 1){
      var y = 62 + i * 40;
      s += L.arrow(100, y, 640, y, "rgba(148,163,184,.5)", 2);
    }
    s += L.text(652, 56, "B", {size: 18, color: C.muted, weight: 700});
    s += L.line(xa, ya, xb, yb, "#94a3b8", 5);
    s += L.circle(xa, ya, 12, "#f8fafc") + L.text(xa, ya + 5, "·", {size: 16, color: C.danger, weight: 700});
    s += L.circle(xb, yb, 12, "#f8fafc") + L.text(xb, yb + 5, "×", {size: 16, color: C.danger, weight: 700});
    s += L.arrow(xa, ya, xa, ya - 52, C.danger, 3.5);
    s += L.arrow(xb, yb, xb, yb + 52, C.danger, 3.5);
    s += L.text(cx, 265, "m = NIA = " + L.num(m, 2) + " A m²   ·   τ = mB sinθ = " + L.num(tau, 3) + " N m   ·   U = −mB cosθ = " + L.num(U, 3) + " J", {size: 15, color: C.text, weight: 700});
    L.svg(s, "Current loop at " + L.num(st.theta, 0) + " degrees to a uniform magnetic field.", 300);
    L.readout([
      ["Turns N × I", "100 × 1 A", C.text],
      ["Area A", L.num(A, 2) + " m²"],
      ["Moment m", L.num(m, 2) + " A m²", "#f59e0b"],
      ["Angle θ", L.num(st.theta, 0) + "°", C.ok],
      ["Torque τ", L.num(tau, 3) + " N m", tau > 1e-9 ? C.ok : C.muted],
      ["Energy U", L.num(U, 3) + " J", C.muted]
    ]);
    var msg;
    if(st.theta <= 2) msg = "<b>θ = 0°, stable equilibrium:</b> the normal is along B, the torque is zero, and U = −mB is at its minimum. Any small twist produces a restoring torque.";
    else if(st.theta >= 178) msg = "<b>θ = 180°, unstable equilibrium:</b> the torque is again zero, but U = +mB is maximum. The slightest nudge twists the loop toward alignment.";
    else if(Math.abs(st.theta - 90) <= 2) msg = "<b>θ = 90°:</b> the forces are perpendicular to the loop's axis, giving the maximum torque τ = mB, while the net force remains zero.";
    else msg = "The forces on opposite sides are equal and opposite — zero net force — but their offset lines of action create the torque τ = mB sinθ.";
    L.verdict(msg);
  }

  function select(id){
    if(id === "zero") st.theta = 0;
    else if(id === "ninety") st.theta = 90;
    else st.theta = 180;
    L.markPreset(id);
    apply();
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["zero", "Aligned θ = 0°"], ["ninety", "Perpendicular θ = 90°"], ["flat", "Anti-aligned θ = 180°"]], "ninety", select);
    L.controls(L.slider("t9-th", "Angle θ between m and B", 0, 180, 5, st.theta, L.num(st.theta, 0) + "°"));
    L.onInput("t9-th", function(v){ st.theta = v; L.setVal("t9-th", L.num(v, 0) + "°"); draw(); });
    L.legend([[C.danger, "force on the sides"], ["#94a3b8", "uniform field B"], ["#f8fafc", "current direction · and ×"]]);
    L.watch("Rotate the loop from 0° to 180°. The torque peaks at 90° and vanishes at both ends, but only θ = 0° is stable.");
    draw();
  }

  window.SIMS.torquelab = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 10 — Moving coil galvanometer (NCERT §4.10)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "galvo", I: 0.5};
  var N = 100, A = 2e-3, B = 0.1, K = 2e-5, RG = 60, RS = 0.05, RM = 5000;
  var FULL = "The pointer deflection is linear in the coil current.";

  function coilCurrent(){
    var input = st.I * 1e-3;                // the slider reads milliamperes
    if(st.preset === "ammeter") return input * RS / (RG + RS);
    return input;
  }

  function draw(){
    var ic = coilCurrent();
    var phi = N * A * B * ic / K;
    var deg = phi * 180 / Math.PI;
    var cap = Math.PI;                      // full-scale about 180°
    var show = Math.min(phi, cap);
    var cx = 280, cy = 200, Lc = 130;
    var m = "";
    m += L.line(cx, cy, cx - Lc, cy, C.faint, 2);
    m += L.line(cx, cy, cx + Lc, cy, C.faint, 2);
    var i;
    for(i = -2; i <= 2; i += 1){
      var xxi = cx + i * 45;
      m += L.line(xxi, cy, xxi, cy - 8, C.muted, 1.5);
      if(i !== 0) m += L.text(xxi, cy + 24, String(Math.abs(i) * 30), {size: 12, color: C.muted});
    }
    var ang = -Math.PI / 2 + show;
    var px = cx + Lc * Math.cos(ang - Math.PI / 2) * 0 - 0;
    var tipx = cx + 0.96 * Lc * Math.cos(-Math.PI / 2 - show);
    var tipy = cy + 0.96 * Lc * Math.sin(-Math.PI / 2 - show);
    m += L.line(cx, cy, tipx, tipy, C.ok, 3);
    m += L.circle(cx, cy, 6, "#f8fafc");
    m += L.rect(cx - 52, cy - 92, 104, 40, "rgba(56,189,248,.12)", ' rx="6" stroke="#38bdf8"');
    m += L.text(cx, cy - 68, "N turns in radial B", {size: 13, color: "#93c5fd"});
    var note = st.preset === "ammeter" ? "shunt rₛ = " + RS + " Ω in parallel" : (st.preset === "voltmeter" ? "series R = " + RM + " Ω" : "no shunt, no series resistor");
    m += L.text(560, 70, st.preset === "ammeter" ? "AMMETER" : (st.preset === "voltmeter" ? "VOLTMETER" : "GALVANOMETER"), {size: 18, color: C.text, weight: 700});
    m += L.text(560, 96, note, {size: 13, color: C.muted});
    m += L.text(560, 140, "φ = NABI/k", {size: 20, color: C.text, weight: 700});
    m += L.text(560, 168, "= " + L.num(deg, 3) + "°", {size: 17, color: C.ok});
    m += L.text(560, 200, "coil current " + L.num(ic * 1e6, 3) + " μA", {size: 13, color: C.muted});
    L.svg(m, "Moving coil galvanometer pointer deflected to " + L.num(deg, 3) + " degrees.", 300);
    L.readout([
      ["Preset", st.preset === "ammeter" ? "ammeter (shunt)" : (st.preset === "voltmeter" ? "voltmeter (series)" : "bare galvanometer"), "#f59e0b"],
      ["Input current", L.num(st.I, 2) + " mA"],
      ["Coil current", L.num(ic * 1e6, 3) + " μA"],
      ["Deflection φ", L.num(deg, 3) + "°", C.ok],
      ["Current sensitivity", "NAB/k = " + L.num(N * A * B / K, 1) + " rad/A", C.muted]
    ]);
    L.verdict("<b>" + (st.preset === "ammeter" ? "Ammeter: " : (st.preset === "voltmeter" ? "Voltmeter: " : "Galvanometer: ")) + "</b>" + (st.preset === "ammeter" ? "the tiny shunt carries almost all the current, so the meter deflects only slightly while measuring a large line current." : (st.preset === "voltmeter" ? "the large series resistance keeps the coil current small; the deflection is proportional to the voltage being measured." : FULL)));
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["galvo", "Galvanometer"], ["ammeter", "As ammeter (shunt)"], ["voltmeter", "As voltmeter (series R)"]], st.preset, select);
    L.controls(L.slider("t10-I", "Input current I", 0.05, 2.0, 0.05, st.I, L.num(st.I, 2) + " mA"));
    L.onInput("t10-I", function(v){ st.I = v; L.setVal("t10-I", L.num(v, 2) + " mA"); draw(); });
    L.legend([["#38bdf8", "coil in radial field"], [C.ok, "pointer"], ["#f59e0b", "conversion network"]]);
    L.watch("Compare the three presets. With the shunt the coil current collapses; with the series resistor the same input produces a much smaller deflection.");
    draw();
  }

  window.SIMS.galvanometer = {mount: mount, draw: draw, select: select, state: st};
})();
