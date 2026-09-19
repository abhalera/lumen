// Class 12 Physics, Chapter 6 (leph106) — simulation labs.
// One lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

function coilShape(x, y, w, h, loops, color){
  var s = Lrect(x, y, w, h, "#182535", ' rx="10" stroke="' + color + '" stroke-width="2"');
  var step = loops > 1 ? (w - 16) / (loops - 1) : 0;
  for(var i = 0; i < loops; i += 1){
    var lx = x + 8 + i * step;
    s += '<path d="M' + lx + ' ' + (y + 3) + ' q 9 ' + (h / 2) + ' 0 ' + (h - 6) + '" fill="none" stroke="' + color + '" stroke-width="1.8" opacity="0.9"/>';
  }
  return s;
}
function Lrect(x, y, w, h, fill, extra){
  return LAB.rect(x, y, w, h, fill, extra);
}
function barMagnet(cx, cy, w, h, northRight){
  var hw = w / 2;
  var red = "#b91c1c", blue = "#1d4ed8";
  var leftColor = northRight ? blue : red;
  var rightColor = northRight ? red : blue;
  var s = LAB.rect(cx - hw, cy - h / 2, hw, h, leftColor, ' rx="3"');
  s += LAB.rect(cx, cy - h / 2, hw, h, rightColor, ' rx="3"');
  s += LAB.text(cx - hw / 2, cy + 6, "S", {color: "#f8fafc", size: 16, weight: 700});
  s += LAB.text(cx + hw / 2, cy + 6, "N", {color: "#f8fafc", size: 16, weight: 700});
  return s;
}

// ---------------------------------------------------------------------------
// Lab 1 — Motion, flux and the galvanometer (NCERT §6.1-6.2)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var MU = 4 * Math.PI * 1e-7, M0 = 1.5, R = 0.02, N = 200, AREA = 2e-4;
  var st = {pole: 1, dir: -1, x: 0.09, v: 1.5};

  function fluxOf(x){
    return st.pole * N * AREA * (MU / (2 * Math.PI)) * M0 / Math.pow(x * x + R * R, 1.5);
  }
  function dfluxDx(x){
    return -st.pole * N * AREA * (MU / (2 * Math.PI)) * M0 * 3 * x / Math.pow(x * x + R * R, 2.5);
  }

  function draw(){
    var phi = fluxOf(st.x);
    var dphidt = dfluxDx(st.x) * (st.dir * st.v);
    var emf = Math.abs(dphidt);
    var mx = 340 + st.x * 1400;
    var m = "";
    m += L.line(60, 150, 620, 150, C.faint, 1, "6 6");
    m += coilShape(120, 96, 210, 108, 9, "#fbbf24");
    m += L.text(225, 78, "COIL  C₁  (200 turns)", {color: "#fbbf24", size: 15, weight: 700});
    m += barMagnet(mx, 150, 92, 34, st.pole > 0);
    m += L.arrow(mx + 55, 100, mx + 55 + st.dir * 65, 100, st.dir < 0 ? C.danger : C.ok, 3);
    m += L.text(mx, 196, "v = " + L.num(st.v, 1) + " m/s " + (st.dir < 0 ? "towards coil" : "away from coil"), {color: C.muted, size: 13});
    var cxG = 590, cyG = 150, ang = Math.max(-1, Math.min(1, dphidt / 0.25)) * 0.9;
    m += L.circle(cxG, cyG, 62, "#0f1b28", ' stroke="#8db0d8" stroke-width="2"');
    m += L.text(cxG, cyG + 92, "GALVANOMETER", {color: C.muted, size: 13, weight: 700});
    var nx = cxG + Math.sin(ang) * 52, ny = cyG - Math.cos(ang) * 52;
    m += L.line(cxG, cyG + 8, nx, ny, emf > 1e-9 ? C.ok : C.muted, 4);
    m += L.circle(cxG, cyG, 6, C.text);
    m += L.text(80, 52, "magnet at " + L.num(st.x, 2) + " m from coil centre", {color: C.text, size: 15, weight: 700});
    L.svg(m, "Bar magnet moving near a coil; galvanometer needle deflects while the flux changes.", 290);
    L.readout([
      ["Flux through coil", L.num(phi * 1e3, 3) + " mWb", "#fbbf24"],
      ["dΦ/dt", L.num(dphidt * 1e3, 3) + " mWb/s"],
      ["Induced emf N|dΦ/dt|", L.num(emf * 1e3, 3) + " mV", emf > 1e-9 ? C.ok : C.muted],
      ["Deflection", emf < 1e-12 ? "none" : (dphidt > 0 ? "right" : "left"), emf < 1e-12 ? C.muted : C.text]
    ]);
    var msg;
    if(emf < 1e-12) msg = "The flux through the coil is <b>not changing</b>. The galvanometer rests at zero — a large static flux induces nothing.";
    else if(st.dir < 0) msg = "The magnet approaches, so the flux grows. The induced emf opposes the increase, and the deflection lasts <b>only while the magnet moves</b>. Push faster and the needle swings further.";
    else msg = "The magnet recedes, so the flux falls and the induced emf reverses its sense — the needle kicks the other way. Induction cares about the <b>rate of change</b> of flux, not its size.";
    L.verdict(msg);
  }

  function select(id){
    if(id === "n-towards"){ st.pole = 1; st.dir = -1; }
    else if(id === "n-away"){ st.pole = 1; st.dir = 1; }
    else if(id === "s-towards"){ st.pole = -1; st.dir = -1; }
    else { st.pole = -1; st.dir = 1; }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["n-towards", "N-pole → coil"], ["n-away", "N-pole ← coil"], ["s-towards", "S-pole → coil"], ["s-away", "S-pole ← coil"]], "n-towards", select);
    L.controls(
      L.slider("t1-x", "Distance of magnet", 0.04, 0.18, 0.01, st.x, L.num(st.x, 2) + " m") +
      L.slider("t1-v", "Speed of motion", 0.5, 4, 0.5, st.v, L.num(st.v, 1) + " m/s")
    );
    L.onInput("t1-x", function(v){ st.x = v; L.setVal("t1-x", L.num(v, 2) + " m"); draw(); });
    L.onInput("t1-v", function(v){ st.v = v; L.setVal("t1-v", L.num(v, 1) + " m/s"); draw(); });
    L.legend([["#fbbf24", "coil C₁"], ["#b91c1c", "magnet N pole"], ["#1d4ed8", "magnet S pole"], [C.ok, "needle deflection"]]);
    L.watch("Notice that a stationary magnet gives zero even when the flux is large; only motion changes the flux.");
    draw();
  }

  window.SIMS.inductionbench = {mount: mount, draw: draw, select: select, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 2 — Magnetic flux bench (NCERT §6.3)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {B: 0.5, A: 0.04, theta: 0, N: 100};

  function draw(){
    var th = st.theta * Math.PI / 180;
    var phi = st.B * st.A * Math.cos(th);
    var cx = 250, cy = 160, hw = 120;
    var dx = hw * Math.cos(th), dy = hw * Math.sin(th);
    var m = "";
    var i;
    for(i = 0; i < 9; i += 1){
      var x = 90 + i * 40;
      var hits = Math.abs(x - cx) <= hw * Math.cos(th) + 1;
      var yEnd = 255;
      if(hits && Math.abs(Math.cos(th)) > 1e-6) yEnd = cy - Math.tan(th) * (x - cx) + 4;
      m += L.line(x, 60, x, yEnd, hits ? "#60a5fa" : "rgba(96,165,250,0.25)", hits ? 2.4 : 1.5);
    }
    m += L.line(cx - dx, cy - dy, cx + dx, cy + dy, "#f8fafc", 6);
    m += L.text(90, 44, "B", {color: "#60a5fa", size: 18, weight: 700});
    m += L.arrow(470, 230, 470, 250, "#94a3b8", 2);
    m += L.line(470, 250, 470 + 110 * Math.cos(th), 250 + 110 * Math.sin(th), "#94a3b8", 2);
    m += L.text(600, 240, "θ = " + L.num(st.theta, 0) + "°", {color: C.muted, size: 14});
    m += L.text(560, 90, "Φ = BA cos θ", {size: 24, color: C.text, weight: 700});
    m += L.text(560, 130, "= " + L.num(st.B, 2) + " × " + L.num(st.A, 2) + " × cos " + L.num(st.theta, 0) + "°", {size: 15, color: C.muted});
    m += L.text(560, 170, "= " + L.num(phi * 1e3, 2) + " mWb", {size: 20, color: C.ok, weight: 700});
    L.svg(m, "Uniform field threading a tilted surface of area " + L.num(st.A, 2) + " square metres.", 290);
    L.readout([
      ["Field B", L.num(st.B, 2) + " T", "#60a5fa"],
      ["Area A", L.num(st.A, 2) + " m²"],
      ["Angle θ (B to normal)", L.num(st.theta, 0) + "°"],
      ["Flux Φ = BA cos θ", L.num(phi * 1e3, 2) + " mWb", phi > 1e-9 ? C.ok : C.muted],
      ["Flux linkage NΦ (N=100)", L.num(phi * st.N, 2) + " Wb"]
    ]);
    var msg;
    if(st.theta >= 89) msg = "<b>θ = 90°:</b> the surface is edge-on to the field. No field lines cross it, so Φ = 0.";
    else if(st.theta <= 1) msg = "<b>θ = 0°:</b> the surface faces the field and catches the maximum flux Φ = BA = " + L.num(st.B * st.A * 1e3, 2) + " mWb.";
    else msg = "Flux counts the field lines that <b>pierce</b> the surface. Tilting the surface by θ reduces those lines in proportion to cos θ, even though B and A are unchanged.";
    L.verdict(msg);
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t2-B", "Magnetic field B", 0.1, 1.0, 0.1, st.B, L.num(st.B, 2) + " T") +
      L.slider("t2-A", "Loop area A", 0.01, 0.10, 0.01, st.A, L.num(st.A, 2) + " m²") +
      L.slider("t2-th", "Tilt angle θ", 0, 90, 5, st.theta, L.num(st.theta, 0) + "°")
    );
    L.onInput("t2-B", function(v){ st.B = v; L.setVal("t2-B", L.num(v, 2) + " T"); draw(); });
    L.onInput("t2-A", function(v){ st.A = v; L.setVal("t2-A", L.num(v, 2) + " m²"); draw(); });
    L.onInput("t2-th", function(v){ st.theta = v; L.setVal("t2-th", L.num(v, 0) + "°"); draw(); });
    L.legend([["#60a5fa", "field line B"], ["#f8fafc", "surface"]]);
    L.watch("Keep B and A fixed and tilt the surface. The crossing lines thin out as cos θ.");
    draw();
  }

  window.SIMS.magflux = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 3 — Faraday's law: slope of the flux graph (NCERT §6.4)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {N: 200, dphi: 4, dt: 0.5, phi0: 6};

  function draw(){
    var emf = st.N * st.dphi * 1e-3 / st.dt;
    var x0 = 80, y0 = 250, w = 560, h = 170;
    var m = "";
    var i;
    for(i = 0; i <= 10; i += 1){
      var x = x0 + i * (w / 10);
      m += L.line(x, y0, x, y0 - h, C.grid, 1);
    }
    for(i = 0; i <= 4; i += 1){
      var y = y0 - i * (h / 4);
      m += L.line(x0, y, x0 + w, y, C.grid, 1);
      m += L.text(x0 - 8, y + 5, L.num(i * 2, 0), {size: 12, color: C.muted, anchor: "end"});
    }
    m += L.line(x0, y0, x0 + w + 10, y0, C.muted, 1.5);
    m += L.line(x0, y0, x0, y0 - h - 8, C.muted, 1.5);
    m += L.text(x0 + w + 6, y0 + 20, "t", {size: 14, color: C.text, anchor: "end"});
    m += L.text(x0 + 4, y0 - h - 12, "Φ (mWb)", {size: 13, color: C.text, anchor: "start"});
    var xa = x0 + 40, xb = x0 + 40 + st.dt * 220;
    if(xb > x0 + w) xb = x0 + w;
    var ya = y0 - (st.phi0 / 8) * h, yb = y0 - Math.max(0, st.phi0 - st.dphi) / 8 * h;
    m += L.line(xa, ya, xb, yb, "#fbbf24", 3.5);
    m += L.line(xb, yb, x0 + w, yb, "#fbbf24", 3.5);
    m += L.text((xa + xb) / 2, (ya + yb) / 2 - 12, "slope = −ΔΦ/Δt", {size: 15, color: "#fbbf24", weight: 700});
    m += L.text(360, 62, "ε = N |ΔΦ/Δt| = " + L.num(st.N, 0) + " × " + L.num(st.dphi, 1) + " mWb / " + L.num(st.dt, 1) + " s", {size: 18, color: C.text, weight: 700});
    m += L.text(360, 92, "= " + L.num(emf, 2) + " V", {size: 22, color: C.ok, weight: 700});
    L.svg(m, "Flux versus time graph with a straight falling section; its slope gives the induced emf.", 290);
    L.readout([
      ["Turns N", String(st.N)],
      ["Flux change ΔΦ", L.num(st.dphi, 1) + " mWb"],
      ["Time interval Δt", L.num(st.dt, 1) + " s"],
      ["Average emf NΔΦ/Δt", L.num(emf, 2) + " V", C.ok]
    ]);
    L.verdict("Faraday's law reads the <b>slope</b> of the flux–time graph. A steeper fall (bigger ΔΦ or smaller Δt) gives a bigger emf, while a flat section gives none. The factor N multiplies the effect of every turn.");
  }
  // helper kept separate so the fall is always exactly dphi mWb

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t3-N", "Turns N", 1, 500, 1, st.N, String(st.N)) +
      L.slider("t3-dphi", "Flux change ΔΦ", 1, 8, 0.5, st.dphi, L.num(st.dphi, 1) + " mWb") +
      L.slider("t3-dt", "Time Δt", 0.2, 2.0, 0.1, st.dt, L.num(st.dt, 1) + " s") +
      L.slider("t3-phi0", "Initial flux Φ₀", 2, 8, 0.5, st.phi0, L.num(st.phi0, 1) + " mWb")
    );
    L.onInput("t3-N", function(v){ st.N = Math.round(v); L.setVal("t3-N", String(st.N)); draw(); });
    L.onInput("t3-dphi", function(v){ st.dphi = v; L.setVal("t3-dphi", L.num(v, 1) + " mWb"); draw(); });
    L.onInput("t3-dt", function(v){ st.dt = v; L.setVal("t3-dt", L.num(v, 1) + " s"); draw(); });
    L.onInput("t3-phi0", function(v){ st.phi0 = v; L.setVal("t3-phi0", L.num(v, 1) + " mWb"); draw(); });
    L.legend([["#fbbf24", "flux through coil"], [C.ok, "induced emf"]]);
    L.watch("Compare the slope of the amber line with the emf readout. Steeper change, larger emf.");
    draw();
  }

  window.SIMS.faradaylaw = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 4 — Lenz's law direction bench (NCERT §6.5)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {pole: 1, dir: -1, x: 0.10};

  function draw(){
    var approaching = st.dir < 0;
    var nearPole = (approaching ? st.pole : -st.pole); // coil face pole that opposes the change
    var face = nearPole > 0 ? "North" : "South";
    var clockwise = nearPole < 0; // current appears clockwise from the magnet side when that face is a South pole
    var mx = 300 + st.x * 1400;
    var m = "";
    m += L.line(60, 150, 430, 150, C.faint, 1, "6 6");
    m += coilShape(150, 94, 200, 112, 8, "#fbbf24");
    m += L.text(250, 74, "CONDUCTING COIL", {color: "#fbbf24", size: 14, weight: 700});
    m += L.text(250, 232, (nearPole > 0 ? "N" : "S") + " face", {color: nearPole > 0 ? C.danger : "#60a5fa", size: 16, weight: 700});
    m += L.arrow(250 + (nearPole > 0 ? -1 : 1) * 0, 255, 250 + (nearPole > 0 ? 30 : -30), 255, nearPole > 0 ? C.danger : "#60a5fa", 3);
    m += barMagnet(mx, 150, 96, 36, st.pole > 0);
    m += L.arrow(mx + 58, 100, mx + 58 + st.dir * 65, 100, approaching ? C.danger : C.ok, 3.5);
    m += L.text(mx, 200, approaching ? "magnet approaching" : "magnet receding", {color: approaching ? C.danger : C.ok, size: 13});
    // current sense marker on the coil
    var cy = 150;
    m += '<path d="M150 ' + (cy - 42) + ' a 62 42 0 1 ' + (clockwise ? 1 : 0) + ' 84 0" fill="none" stroke="' + C.ok + '" stroke-width="3" stroke-dasharray="7 5"/>';
    m += L.text(250, 158, clockwise ? "current ↻" : "current ↺", {color: C.ok, size: 15, weight: 700});
    L.svg(m, "Magnet moving near a coil; the induced current opposes the change in flux.", 290);
    L.readout([
      ["Flux change", approaching ? "increasing" : "decreasing", approaching ? C.danger : C.ok],
      ["Induced field", approaching ? "opposes growth" : "supports fall"],
      ["Coil face nearest magnet", face + " pole", nearPole > 0 ? C.danger : "#60a5fa"],
      ["Current seen from magnet", clockwise ? "clockwise" : "anticlockwise", C.ok]
    ]);
    L.verdict("<b>Lenz's law:</b> the induced current opposes the change in flux. " + (approaching ? "The flux grows, so the coil face turns into a " + face.toLowerCase() + " pole and repels the magnet — the current is " + (clockwise ? "clockwise" : "anticlockwise") + " seen from the magnet side." : "The flux falls, so the coil face turns into a " + face.toLowerCase() + " pole and attracts the magnet back — the current is " + (clockwise ? "clockwise" : "anticlockwise") + " seen from the magnet side."));
  }

  function select(id){
    if(id === "n-in"){ st.pole = 1; st.dir = -1; }
    else if(id === "n-out"){ st.pole = 1; st.dir = 1; }
    else if(id === "s-in"){ st.pole = -1; st.dir = -1; }
    else { st.pole = -1; st.dir = 1; }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["n-in", "N ∈ → coil"], ["n-out", "N ← coil"], ["s-in", "S → coil"], ["s-out", "S ← coil"]], "n-in", select);
    L.controls(L.slider("t4-x", "Magnet distance", 0.04, 0.16, 0.01, st.x, L.num(st.x, 2) + " m"));
    L.onInput("t4-x", function(v){ st.x = v; L.setVal("t4-x", L.num(v, 2) + " m"); draw(); });
    L.legend([["#fbbf24", "coil"], [C.ok, "induced current"], [C.danger, "approaching magnet"], ["#60a5fa", "receding magnet"]]);
    L.watch("Predict the current direction before checking: the coil always makes the face that fights the motion.");
    draw();
  }

  window.SIMS.lenzlab = {mount: mount, draw: draw, select: select, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 5 — Motional emf on rails (NCERT §6.6)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {B: 0.5, l: 0.5, v: 1.0, R: 2.0};

  function draw(){
    var emf = st.B * st.l * st.v;
    var I = emf / st.R;
    var F = st.B * st.B * st.l * st.l * st.v / st.R;
    var m = "";
    var i;
    for(i = 0; i < 9; i += 1){
      for(var j = 0; j < 5; j += 1){
        m += L.circle(120 + i * 55, 70 + j * 42, 3.2, "rgba(96,165,250,0.75)");
      }
    }
    m += L.text(80, 45, "B out of page", {color: "#60a5fa", size: 14, weight: 700});
    m += L.rect(110, 80, 480, 5, "#94a3b8");
    m += L.rect(110, 240, 480, 5, "#94a3b8");
    var rx = 110 + 40 + st.v * 55;
    m += L.rect(rx, 80, 10, 165, "#fbbf24");
    m += L.arrow(rx + 60, 62, rx + 130, 62, C.ok, 3.5);
    m += L.text(rx + 95, 50, "v", {color: C.ok, size: 16, weight: 700});
    m += L.arrow(rx - 55, 160, rx - 125, 160, C.danger, 3.5);
    m += L.text(rx - 90, 148, "F = B²l²v/R", {color: C.danger, size: 13, weight: 700});
    m += L.text(560, 120, "emf = " + L.num(emf, 3) + " V", {size: 17, color: C.text, weight: 700});
    m += L.text(560, 150, "I = " + L.num(I, 3) + " A", {size: 15, color: "#f8fafc"});
    m += L.text(560, 180, "P = I²R = " + L.num(I * I * st.R, 3) + " W", {size: 15, color: C.ok});
    L.svg(m, "Conducting rod sliding on rails through a magnetic field out of the page.", 290);
    L.readout([
      ["Field B", L.num(st.B, 2) + " T"],
      ["Rod length l", L.num(st.l, 2) + " m"],
      ["Speed v", L.num(st.v, 2) + " m/s"],
      ["emf = Blv", L.num(emf, 3) + " V", C.ok],
      ["Current I = Blv/R", L.num(I, 3) + " A", "#fbbf24"],
      ["Retarding F", L.num(F, 3) + " N", C.danger]
    ]);
    L.verdict("Positive carriers in the moving rod feel <b>F = qv × B</b>, which drives a current. The current in the field produces the retarding force B²l²v/R, so the work you do pulling the rod becomes electrical energy. Doubling v quadruples the power needed.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t5-B", "Magnetic field B", 0.1, 1.0, 0.1, st.B, L.num(st.B, 2) + " T") +
      L.slider("t5-l", "Rod length l", 0.2, 1.0, 0.1, st.l, L.num(st.l, 2) + " m") +
      L.slider("t5-v", "Speed v", 0.2, 3.0, 0.2, st.v, L.num(st.v, 2) + " m/s") +
      L.slider("t5-R", "Circuit resistance R", 0.5, 5, 0.5, st.R, L.num(st.R, 1) + " Ω")
    );
    L.onInput("t5-B", function(v){ st.B = v; L.setVal("t5-B", L.num(v, 2) + " T"); draw(); });
    L.onInput("t5-l", function(v){ st.l = v; L.setVal("t5-l", L.num(v, 2) + " m"); draw(); });
    L.onInput("t5-v", function(v){ st.v = v; L.setVal("t5-v", L.num(v, 2) + " m/s"); draw(); });
    L.onInput("t5-R", function(v){ st.R = v; L.setVal("t5-R", L.num(v, 1) + " Ω"); draw(); });
    L.legend([["#fbbf24", "moving rod"], [C.ok, "velocity"], [C.danger, "retarding force"]]);
    draw();
  }

  window.SIMS.motionalemf = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 6 — Mutual inductance bench (NCERT §6.7-6.7.1)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {mode: "coax", n1: 500, n2: 800, r1: 0.02, r2: 0.05, l: 0.30, dIdt: 50};

  function mutual(){
    if(st.mode === "coax") return 4e-7 * Math.PI * st.n1 * st.n2 * Math.PI * st.r1 * st.r1 * st.l;
    return 4e-7 * Math.PI * Math.PI * st.r1 * st.r1 / (2 * st.r2);
  }

  function eng(v, unit, d){
    var a = Math.abs(v);
    if(a >= 1) return L.num(v, d) + " " + unit;
    if(a >= 1e-3) return L.num(v * 1e3, d) + " m" + unit;
    if(a >= 1e-6) return L.num(v * 1e6, d) + " µ" + unit;
    return L.num(v * 1e9, d) + " n" + unit;
  }

  function draw(){
    var M = mutual();
    var emf = M * st.dIdt;
    var m = "";
    if(st.mode === "coax"){
      m += L.rect(130, 90, 460, 120, "#182535", ' rx="14" stroke="#fbbf24" stroke-width="2"');
      var i;
      for(i = 0; i < 10; i += 1){
        var x = 150 + i * 42;
        m += '<path d="M' + x + ' 94 q 10 58 0 112" fill="none" stroke="#fbbf24" stroke-width="1.8"/>';
      }
      var rw = Math.max(70, Math.min(200, st.r1 * 3000 + 60));
      m += L.rect(360 - rw, 118, rw * 2, 64, "rgba(96,165,250,0.08)", ' rx="8" stroke="#60a5fa" stroke-width="2" stroke-dasharray="6 5"');
      m += L.text(360, 78, "outer solenoid S₂: " + st.n2 + " turns/m", {color: "#fbbf24", size: 14, weight: 700});
      m += L.text(360, 235, "inner solenoid S₁: " + st.n1 + " turns/m, r₁ = " + L.num(st.r1 * 100, 1) + " cm", {color: "#60a5fa", size: 14});
      m += L.text(360, 262, "length l = " + L.num(st.l * 100, 0) + " cm", {color: C.muted, size: 13});
    } else {
      var R1 = Math.max(18, Math.min(70, st.r1 * 2000));
      var R2 = Math.max(R1 + 40, Math.min(250, st.r2 * 1000 + 40));
      m += L.circle(360, 155, R2, "rgba(251,191,36,0.08)", ' stroke="#fbbf24" stroke-width="2"');
      m += L.circle(360, 155, R1, "rgba(96,165,250,0.12)", ' stroke="#60a5fa" stroke-width="2"');
      m += L.text(360 + R2, 155 - R2 - 2, "r₂ = " + L.num(st.r2 * 100, 1) + " cm", {color: "#fbbf24", size: 14});
      m += L.text(360, 155, "r₁ = " + L.num(st.r1 * 100, 1) + " cm", {color: "#60a5fa", size: 14, weight: 700});
      m += L.text(360, 285, "r₁ ≪ r₂: field of the outer coil is uniform over the small coil", {color: C.muted, size: 13});
    }
    m += L.text(360, 285, st.mode === "coax" ? "M = μ₀n₁n₂πr₁²l" : "M = μ₀πr₁²/(2r₂)", {color: C.text, size: 17, weight: 700});
    L.svg(m, "Two magnetically coupled coils: coaxial solenoids or concentric circles.", 300);
    L.readout([
      ["Configuration", st.mode === "coax" ? "coaxial solenoids" : "concentric coils"],
      ["M", eng(M, "H", 3), C.ok],
      ["Rate dI₂/dt", L.num(st.dIdt, 0) + " A/s"],
      ["Induced emf M dI/dt", eng(emf, "V", 3), emf > 0 ? "#fbbf24" : C.muted],
      ["Reciprocity", "M₁₂ = M₂₁", C.muted]
    ]);
    L.verdict(st.mode === "coax" ? "The inner solenoid links the entire field of the outer one, giving <b>M = μ₀n₁n₂πr₁²l</b>. Add a soft-iron core and multiply by μᵣ." : "For a tiny coil at the centre of a large one, the field is uniform over the small area, giving <b>M = μ₀πr₁²/(2r₂)</b>. The reciprocity theorem says either coil can be the source.");
  }

  function select(id){
    st.mode = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["coax", "Coaxial solenoids"], ["conc", "Concentric coils"]], st.mode, select);
    L.controls(
      L.slider("t6-n1", "Inner turns/m n₁", 100, 2000, 100, st.n1, String(st.n1)) +
      L.slider("t6-n2", "Outer turns/m n₂", 100, 2000, 100, st.n2, String(st.n2)) +
      L.slider("t6-r1", "Inner radius r₁", 0.01, 0.05, 0.005, st.r1, L.num(st.r1 * 100, 1) + " cm") +
      L.slider("t6-r2", "Outer radius r₂", 0.03, 0.10, 0.01, st.r2, L.num(st.r2 * 100, 0) + " cm") +
      L.slider("t6-l", "Solenoid length l", 0.10, 0.60, 0.05, st.l, L.num(st.l * 100, 0) + " cm") +
      L.slider("t6-dI", "dI₂/dt", 5, 200, 5, st.dIdt, L.num(st.dIdt, 0) + " A/s")
    );
    L.onInput("t6-n1", function(v){ st.n1 = Math.round(v); L.setVal("t6-n1", String(st.n1)); draw(); });
    L.onInput("t6-n2", function(v){ st.n2 = Math.round(v); L.setVal("t6-n2", String(st.n2)); draw(); });
    L.onInput("t6-r1", function(v){ st.r1 = v; L.setVal("t6-r1", L.num(v * 100, 1) + " cm"); draw(); });
    L.onInput("t6-r2", function(v){ st.r2 = v; L.setVal("t6-r2", L.num(v * 100, 0) + " cm"); draw(); });
    L.onInput("t6-l", function(v){ st.l = v; L.setVal("t6-l", L.num(v * 100, 0) + " cm"); draw(); });
    L.onInput("t6-dI", function(v){ st.dIdt = v; L.setVal("t6-dI", L.num(v, 0) + " A/s"); draw(); });
    L.legend([["#fbbf24", "coil 2 (source)"], ["#60a5fa", "coil 1 (induced)"]]);
    L.watch("Change the geometry and watch M move; pass a changing current and the emf in the neighbour follows M dI/dt.");
    draw();
  }

  window.SIMS.mutualind = {mount: mount, draw: draw, select: select, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 7 — Self-inductance and stored energy (NCERT §6.7.2)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {n: 1000, l: 0.30, A: 0.002, I: 3, dIdt: 200};

  function draw(){
    var Lh = 4e-7 * Math.PI * st.n * st.n * st.A * st.l;
    var U = 0.5 * Lh * st.I * st.I;
    var emf = Lh * st.dIdt;
    var Umax = 0.5 * Lh * 100;
    var m = "";
    m += coilShape(90, 100, 330, 110, 12, "#60a5fa");
    m += L.text(255, 84, "SOLENOID   n = " + st.n + " turns/m", {color: "#60a5fa", size: 14, weight: 700});
    var i;
    for(i = 0; i < 5; i += 1){
      var y = 108 + i * 24;
      m += L.arrow(101, y, 409, y, "rgba(251,191,36,0.55)", 1.8);
    }
    m += L.text(255, 242, "current I = " + L.num(st.I, 1) + " A", {color: "#fbbf24", size: 14});
    var bw = 240;
    m += L.rect(470, 140, bw, 26, "#1f2937", ' rx="6"');
    m += L.rect(470, 140, Math.min(bw, bw * U / Math.max(Umax, 1e-12)), 26, C.ok, ' rx="6"');
    m += L.text(590, 125, "stored energy U = ½LI²", {color: C.text, size: 14, weight: 700});
    m += L.text(590, 190, L.num(U, 3) + " J", {color: C.ok, size: 18, weight: 700});
    m += L.text(590, 230, "back emf at " + L.num(st.dIdt, 0) + " A/s", {color: C.muted, size: 13});
    m += L.text(590, 254, "= " + L.num(emf, 2) + " V", {color: "#fbbf24", size: 17, weight: 700});
    L.svg(m, "Solenoid with current, energy bar and back-emf readout.", 290);
    L.readout([
      ["Turns/m n", String(st.n)],
      ["Length l", L.num(st.l * 100, 0) + " cm"],
      ["Area A", L.num(st.A * 1e4, 1) + " cm²"],
      ["Self-inductance L", L.num(Lh * 1e3, 3) + " mH", "#60a5fa"],
      ["Energy U = ½LI²", L.num(U, 3) + " J", C.ok],
      ["Back emf L·dI/dt", L.num(emf, 2) + " V", "#fbbf24"]
    ]);
    L.verdict("The solenoid's self-inductance is <b>L = μ₀n²Al</b> — pure geometry. It stores energy ½LI² in its magnetic field (density B²/2μ₀) and opposes any change of current with a back emf L dI/dt. Increasing n has the strongest effect because L depends on n².");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t7-n", "Turns per metre n", 200, 2000, 100, st.n, String(st.n)) +
      L.slider("t7-l", "Length l", 0.10, 0.60, 0.05, st.l, L.num(st.l * 100, 0) + " cm") +
      L.slider("t7-A", "Cross-section A", 0.0005, 0.010, 0.0005, st.A, L.num(st.A * 1e4, 1) + " cm²") +
      L.slider("t7-I", "Current I", 0.5, 10, 0.5, st.I, L.num(st.I, 1) + " A") +
      L.slider("t7-dI", "Rate dI/dt", 20, 500, 20, st.dIdt, L.num(st.dIdt, 0) + " A/s")
    );
    L.onInput("t7-n", function(v){ st.n = Math.round(v); L.setVal("t7-n", String(st.n)); draw(); });
    L.onInput("t7-l", function(v){ st.l = v; L.setVal("t7-l", L.num(v * 100, 0) + " cm"); draw(); });
    L.onInput("t7-A", function(v){ st.A = v; L.setVal("t7-A", L.num(v * 1e4, 1) + " cm²"); draw(); });
    L.onInput("t7-I", function(v){ st.I = v; L.setVal("t7-I", L.num(v, 1) + " A"); draw(); });
    L.onInput("t7-dI", function(v){ st.dIdt = v; L.setVal("t7-dI", L.num(v, 0) + " A/s"); draw(); });
    L.legend([["#60a5fa", "solenoid"], ["#fbbf24", "current"], [C.ok, "stored energy"]]);
    L.watch("Raise n and watch L jump (it goes as n²). Then raise the current and see the energy grow as I².");
    draw();
  }

  window.SIMS.selfind = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 8 — AC generator (NCERT §6.8)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {N: 100, B: 0.10, A: 0.20, freq: 5, theta: 90};

  function draw(){
    var w = 2 * Math.PI * st.freq;
    var e0 = st.N * st.B * st.A * w;
    var th = st.theta * Math.PI / 180;
    var flux = st.B * st.A * Math.cos(th);
    var e = e0 * Math.sin(th);
    var m = "";
    var cx = 180, cy = 150, rw = 95, rh = 52;
    var ux = Math.cos(th), uy = -Math.sin(th);
    m += L.rect(cx - rw, cy - rh, rw * 2, rh * 2, "rgba(96,165,250,0.06)", ' rx="4" stroke="#475569" stroke-width="1" stroke-dasharray="4 4"');
    var p1x = cx + ux * rw, p1y = cy + uy * rh;
    var p2x = cx - ux * rw, p2y = cy - uy * rh;
    m += L.line(p1x, p1y, p2x, p2y, "#fbbf24", 5);
    m += L.circle(p1x, p1y, 6, "#fbbf24");
    m += L.circle(p2x, p2y, 6, "#fbbf24");
    m += L.text(cx, cy - rh - 22, "rotating coil (θ = " + L.num(st.theta, 0) + "°)", {color: "#fbbf24", size: 13, weight: 700});
    var i;
    for(i = 0; i < 5; i += 1){
      var y = cy - 40 + i * 20;
      m += L.arrow(cx - 150, y, cx + 150, y, "rgba(148,163,184,0.5)", 1.6);
    }
    m += L.text(cx + 160, cy - 42, "B", {color: C.muted, size: 15, weight: 700});
    var gx = 430, gw = 250, gy = 150, gh = 110;
    m += L.line(gx, gy, gx + gw, gy, C.muted, 1.5);
    m += L.line(gx, gy, gx, gy - gh, C.muted, 1.5);
    m += L.text(gx + gw / 2, gy + 22, "ωt", {size: 13, color: C.text});
    m += L.text(gx, gy - gh - 10, "emf", {size: 13, color: C.text, anchor: "start"});
    var pts = "", k;
    for(k = 0; k <= 72; k += 1){
      var t = k / 72 * (4 * Math.PI);
      var px = gx + k / 72 * gw;
      var py = gy - gh / 2 - (gh / 2 - 8) * Math.sin(t);
      pts += px + "," + py + " ";
    }
    m += '<polyline fill="none" stroke="#60a5fa" stroke-width="2.2" points="' + pts + '"/>';
    var mpx = gx + (st.theta / 720) * gw;
    m += L.line(mpx, gy, mpx, gy - gh, C.ok, 2, "4 4");
    m += L.circle(mpx, gy - gh / 2 - (gh / 2 - 8) * Math.sin(th), 5, C.ok);
    m += L.text(430 + 125, 62, "ε₀ = NBAω = " + L.num(e0, 2) + " V", {size: 17, color: C.text, weight: 700});
    L.svg(m, "Coil rotating in a magnetic field with the alternating emf waveform.", 290);
    L.readout([
      ["Peak emf ε₀ = NBAω", L.num(e0, 2) + " V", C.ok],
      ["Instantaneous emf ε₀ sin θ", L.num(e, 2) + " V", Math.abs(e) > 1e-6 ? "#fbbf24" : C.muted],
      ["Flux Φ = BA cos θ", L.num(flux * 1e3, 2) + " mWb", "#60a5fa"],
      ["Frequency ν", L.num(st.freq, 1) + " Hz"]
    ]);
    L.verdict("The flux is maximum when the coil faces the field (θ = 0°), but the emf is <b>zero</b> there because the flux is momentarily unchanging. The emf peaks a quarter turn later, when the coil is edge-on to B. That is why the output is a sine wave.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t8-N", "Turns N", 10, 500, 10, st.N, String(st.N)) +
      L.slider("t8-B", "Field B", 0.02, 0.50, 0.02, st.B, L.num(st.B, 2) + " T") +
      L.slider("t8-A", "Area A", 0.05, 0.50, 0.05, st.A, L.num(st.A, 2) + " m²") +
      L.slider("t8-f", "Frequency ν", 1, 20, 1, st.freq, L.num(st.freq, 0) + " Hz") +
      L.slider("t8-th", "Coil angle θ", 0, 360, 5, st.theta, L.num(st.theta, 0) + "°")
    );
    L.onInput("t8-N", function(v){ st.N = Math.round(v); L.setVal("t8-N", String(st.N)); draw(); });
    L.onInput("t8-B", function(v){ st.B = v; L.setVal("t8-B", L.num(v, 2) + " T"); draw(); });
    L.onInput("t8-A", function(v){ st.A = v; L.setVal("t8-A", L.num(v, 2) + " m²"); draw(); });
    L.onInput("t8-f", function(v){ st.freq = v; L.setVal("t8-f", L.num(v, 0) + " Hz"); draw(); });
    L.onInput("t8-th", function(v){ st.theta = v; L.setVal("t8-th", L.num(v, 0) + "°"); draw(); });
    L.legend([["#fbbf24", "coil"], ["#60a5fa", "emf waveform"], [C.ok, "current instant"]]);
    L.watch("At θ = 0° and 180° the emf is zero although the flux is largest. At 90° and 270° the emf is largest.");
    draw();
  }

  window.SIMS.acgen = {mount: mount, draw: draw, select: function(){}, state: st};
})();
