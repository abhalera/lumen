// Class 12 Physics, Chapter 8 (leph108) — simulation labs.
// One lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

function waveLen(lam){
  var n = window.LAB.num;
  if(lam >= 1) return n(lam, 2) + " m";
  if(lam >= 1e-3) return n(lam * 1e3, 2) + " mm";
  if(lam >= 1e-6) return n(lam * 1e6, 2) + " μm";
  return n(lam * 1e9, 2) + " nm";
}

// -------------------------------------------------------------------------
// Lab 1 — Maxwell's link bench (NCERT §8.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "faraday", rate: 5};
  var INFO = {
    faraday: {src: "magnetic flux ΦB", ind: "circulating electric field E", color: "#60a5fa",
      note: "Faraday: a magnetic flux changing with time drives an electric field around the loop. This is the law behind every generator."},
    maxwell: {src: "electric flux ΦE", ind: "circulating magnetic field B", color: "#f59e0b",
      note: "Maxwell: a changing electric flux (displacement current) drives a magnetic field around the loop — the missing half of Faraday's symmetry."},
    steady: {src: "constant fields", ind: "no induced field", color: "#94a3b8",
      note: "With nothing changing there is no induced field at all. Uniform motion and static charge never radiate."}
  };

  function draw(){
    var info = INFO[st.preset];
    var r = (st.preset === "steady") ? 0 : (st.rate / 10);
    var m = "";
    m += L.text(360, 34, "MAXWELL'S TWO-WAY LINK", {size: 18, weight: 700, color: C.text});
    m += L.rect(60, 70, 250, 170, "#132033", ' rx="14" stroke="#334155" stroke-width="2"');
    m += L.rect(410, 70, 250, 170, "#132033", ' rx="14" stroke="#334155" stroke-width="2"');
    m += L.text(185, 96, info.src.toUpperCase(), {size: 14, color: info.color, weight: 700});
    m += L.text(535, 96, "INDUCED FIELD", {size: 14, color: C.text, weight: 700});
    var i;
    for(i = 0; i < 6; i += 1){
      var y = 130 + i * 16;
      m += L.arrow(90, y, 280, y, info.color, 2 + 3 * r);
    }
    var val = 20 + 90 * r;
    if(r > 0.01){
      m += L.circle(535, 168, 44, "rgba(52,211,153,.08)", ' stroke="' + C.ok + '" stroke-width="2" stroke-dasharray="6 5"');
      m += L.arrow(491, 138, 579, 138, C.ok, 2 + 3 * r);
      m += L.arrow(579, 198, 491, 198, C.ok, 2 + 3 * r);
      m += L.arrow(491, 138, 491, 198, C.ok, 2);
      m += L.text(535, 172, "E·dl ≠ 0", {size: 15, color: C.ok, weight: 700});
    } else {
      m += L.text(535, 172, "no change → no field", {size: 15, color: C.muted});
    }
    m += L.arrow(325, 155, 395, 155, C.muted, 3);
    m += L.text(360, 145, "rate", {size: 13, color: C.muted});
    m += L.text(360, 268, "induced magnitude ∝ rate of change of the source flux", {size: 14, color: C.muted});
    L.svg(m, "Two panels: changing " + info.src + " producing " + info.ind + ".", 300);
    L.readout([
      ["Source", info.src, info.color],
      ["Change rate", L.num(st.rate, 0) + " / 10", info.color],
      ["Induced", info.ind, C.ok],
      ["Induced strength", r > 0.01 ? L.num(val, 0) + " (rel.)" : "0"]
    ]);
    L.verdict("<b>" + (st.preset === "faraday" ? "Changing B → E." : st.preset === "maxwell" ? "Changing E → B." : "Steady fields.") + "</b> " + info.note);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["faraday", "Changing B → E"], ["maxwell", "Changing E → B"], ["steady", "No change"]], st.preset, select);
    L.controls(L.slider("t1-rate", "Rate of change of the flux", 0, 10, 1, st.rate, L.num(st.rate, 0) + " / 10"));
    L.onInput("t1-rate", function(v){ st.rate = v; L.setVal("t1-rate", L.num(v, 0) + " / 10"); draw(); });
    L.legend([[C.danger, "source field"], [C.ok, "induced field"]]);
    L.watch("Switch between the two directions of Maxwell's link and vary the rate. Zero rate gives no induced field.");
    draw();
  }

  window.SIMS.maxwelllink = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Displacement current in a charging capacitor (NCERT §8.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "wire", I: 0.15};

  function draw(){
    var gap = st.preset === "gap";
    var ic = gap ? 0 : st.I;
    var id = gap ? st.I : 0;
    var m = "";
    m += L.text(360, 32, "SURFACE THROUGH " + (gap ? "THE GAP" : "THE WIRE"), {size: 17, weight: 700});
    // wire and plates
    m += L.line(60, 170, 300, 170, "#94a3b8", 5);
    m += L.line(420, 170, 660, 170, "#94a3b8", 5);
    m += '<ellipse cx="320" cy="170" rx="16" ry="58" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>';
    m += '<ellipse cx="400" cy="170" rx="16" ry="58" fill="#7f1d1d" stroke="#f87171" stroke-width="3"/>';
    m += L.text(320, 92, "+Q", {size: 15, color: C.danger});
    m += L.text(400, 92, "−Q", {size: 15, color: "#60a5fa"});
    var i;
    if(!gap){
      m += L.arrow(120, 148, 240, 148, C.ok, 4);
      m += L.text(180, 134, "conduction current i_c", {size: 13, color: C.ok});
      m += '<circle cx="180" cy="170" r="66" fill="none" stroke="' + C.ok + '" stroke-width="2" stroke-dasharray="6 5"/>';
      m += L.text(180, 250, "loop encircles the wire", {size: 13, color: C.ok});
    } else {
      m += L.arrow(330, 110, 390, 110, "#f59e0b", 4);
      m += L.text(360, 96, "displacement current i_d", {size: 13, color: "#f59e0b"});
      m += '<circle cx="360" cy="170" r="66" fill="none" stroke="' + "#f59e0b" + '" stroke-width="2" stroke-dasharray="6 5"/>';
      m += L.text(360, 250, "no charge crosses; the changing E field does", {size: 13, color: "#f59e0b"});
      for(i = 0; i < 5; i += 1){
        m += L.arrow(312, 130 + i * 20, 408, 130 + i * 20, "rgba(96,165,250,.35)", 2);
      }
    }
    L.svg(m, "A charging capacitor with the Ampère loop placed around the wire or through the gap.", 300);
    L.readout([
      ["Surface", gap ? "through the capacitor gap" : "through the wire"],
      ["Conduction i_c", L.num(ic, 2) + " A", gap ? C.muted : C.ok],
      ["Displacement i_d", L.num(id, 2) + " A", gap ? "#f59e0b" : C.muted],
      ["Total current", L.num(ic + id, 2) + " A", C.text]
    ]);
    L.verdict(gap
      ? "<b>Inside the gap:</b> no charge flows, but the electric field is growing. The changing flux gives i_d = i, so the magnetic field is exactly the same as at the wire."
      : "<b>At the wire:</b> the current is ordinary conduction current and i_d = 0. The total current is i either way — that is Maxwell's fix.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["wire", "Surface through wire"], ["gap", "Surface through gap"]], st.preset, select);
    L.controls(L.slider("t2-I", "Charging current i", 0.05, 0.50, 0.05, st.I, L.num(st.I, 2) + " A"));
    L.onInput("t2-I", function(v){ st.I = v; L.setVal("t2-I", L.num(v, 2) + " A"); draw(); });
    L.legend([["#94a3b8", "wire"], ["#60a5fa", "electric field"], [C.ok, "conduction"], ["#f59e0b", "displacement"]]);
    L.watch("Change the charging current. The surface through the gap always reports the same total current as the surface through the wire.");
    draw();
  }

  window.SIMS.displace = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Ampère–Maxwell: the total current is continuous (NCERT §8.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {frac: 0.5, I: 0.20};

  function draw(){
    var ic = (1 - st.frac) * st.I;
    var id = st.frac * st.I;
    var m = "";
    m += L.text(360, 30, "TOTAL CURRENT = CONDUCTION + DISPLACEMENT", {size: 16, weight: 700});
    m += L.line(60, 175, 290, 175, "#94a3b8", 5);
    m += L.line(430, 175, 660, 175, "#94a3b8", 5);
    m += '<ellipse cx="320" cy="175" rx="15" ry="55" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>';
    m += '<ellipse cx="400" cy="175" rx="15" ry="55" fill="#7f1d1d" stroke="#f87171" stroke-width="3"/>';
    // loop with surface tilted according to frac
    var cx = 360, tilt = (st.frac - 0.5) * 130;
    m += '<circle cx="' + cx + '" cy="175" r="72" fill="none" stroke="#34d399" stroke-width="2" stroke-dasharray="6 5"/>';
    m += '<path d="M ' + (cx - 72) + ' 175 Q ' + (cx + tilt) + ' 120, ' + (cx + 72) + ' 175" fill="none" stroke="#f8fafc" stroke-width="3"/>';
    m += L.arrow(150, 152, 240, 152, C.ok, 4);
    m += L.text(195, 138, "i_c = " + L.num(ic, 2) + " A", {size: 14, color: C.ok});
    m += L.text(360, 262, "surface: " + L.num(st.frac * 100, 0) + "% through the gap", {size: 14, color: C.muted});
    if(id > 0.005){
      m += L.text(540, 152, "i_d = " + L.num(id, 2) + " A", {size: 14, color: "#f59e0b", anchor: "start"});
      m += L.arrow(500, 152, 590, 152, "#f59e0b", 4);
    }
    L.svg(m, "A loop whose surface passes partly through the wire and partly through the capacitor gap.", 300);
    L.readout([
      ["Conduction current", L.num(ic, 2) + " A", C.ok],
      ["Displacement current", L.num(id, 2) + " A", "#f59e0b"],
      ["Total current", L.num(ic + id, 2) + " A", C.text],
      ["Magnetic field on loop", L.num(ic + id, 2) + " A worth", C.text]
    ]);
    L.verdict("<b>Slide the surface:</b> as more of it passes through the gap, the conduction current falls and the displacement current rises in exact step. Their sum — the current that creates B — never changes.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t3-f", "Fraction of surface through the gap", 0, 1, 0.05, st.frac, L.num(st.frac * 100, 0) + "%") +
      L.slider("t3-I", "Wire current i", 0.05, 0.50, 0.05, st.I, L.num(st.I, 2) + " A")
    );
    L.onInput("t3-f", function(v){ st.frac = v; L.setVal("t3-f", L.num(v * 100, 0) + "%"); draw(); });
    L.onInput("t3-I", function(v){ st.I = v; L.setVal("t3-I", L.num(v, 2) + " A"); draw(); });
    L.legend([[C.ok, "conduction current"], ["#f59e0b", "displacement current"], [C.text, "total current"]]);
    L.watch("Sweep the surface fraction. The total current stays equal to the wire current for every surface shape.");
    draw();
  }

  window.SIMS.ampmax = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Sources: accelerated charges radiate (NCERT §8.3.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "osc", f: 5};

  function draw(){
    var m = "";
    m += L.text(360, 30, "WHEN DOES A CHARGE RADIATE?", {size: 17, weight: 700});
    m += L.line(80, 170, 640, 170, C.faint, 2);
    var cx = 200;
    if(st.preset === "static"){
      m += L.circle(cx, 170, 14, C.danger);
      m += L.text(cx, 176, "+", {size: 22, color: "#fff", weight: 700});
      m += L.text(cx, 120, "charge at rest", {size: 14, color: C.muted});
      m += L.text(430, 160, "static field only — no wave", {size: 17, color: C.muted, weight: 700});
    } else if(st.preset === "uniform"){
      m += L.circle(cx, 170, 14, C.danger);
      m += L.text(cx, 176, "+", {size: 22, color: "#fff", weight: 700});
      m += L.arrow(cx + 30, 170, cx + 90, 170, C.ok, 4);
      m += L.text(cx, 120, "steady velocity", {size: 14, color: C.muted});
      m += L.text(430, 160, "steady fields — no wave", {size: 17, color: C.muted, weight: 700});
    } else {
      var i;
      for(i = 0; i < 4; i += 1){
        var x = 120 + i * 60;
        m += '<circle cx="' + x + '" cy="170" r="' + (8 + i * 2) + '" fill="none" stroke="' + C.danger + '" stroke-width="2" opacity="' + (0.6 - i * 0.12) + '"/>';
      }
      m += L.circle(360, 170, 14, C.danger);
      m += L.text(360, 176, "+", {size: 22, color: "#fff", weight: 700});
      m += L.arrow(330, 140, 390, 140, C.ok, 3);
      m += L.arrow(390, 200, 330, 200, C.ok, 3);
      m += L.text(360, 120, "oscillating charge", {size: 14, color: C.muted});
      for(i = 0; i < 7; i += 1){
        var xw = 430 + i * 30;
        var amp = 12 + Math.abs(Math.sin(i * (st.f / 5)));
        m += L.line(xw, 170 - amp, xw, 170 + amp, "rgba(56,189,248,.8)", 3);
      }
      m += L.arrow(620, 170, 650, 170, "#38bdf8", 3);
      m += L.text(535, 130, "wave at the same frequency", {size: 14, color: "#38bdf8"});
    }
    L.svg(m, "Three cases: a charge at rest, a charge in uniform motion, and an oscillating charge.", 300);
    var freq = st.f * 2;
    L.readout([
      ["Source", st.preset === "static" ? "charge at rest" : st.preset === "uniform" ? "uniform motion" : "oscillating charge"],
      ["Radiates?", st.preset === "osc" ? "yes — accelerating" : "no", st.preset === "osc" ? C.ok : C.danger],
      ["Frequency (scaled)", st.preset === "osc" ? freq + " units" : "—", "#38bdf8"],
      ["Wave frequency", "= oscillator frequency", "#38bdf8"]
    ]);
    L.verdict(st.preset === "osc"
      ? "<b>Acceleration is the key.</b> The shaking charge continuously changes its velocity, so the fields around it change and detach as a travelling wave."
      : "<b>" + (st.preset === "static" ? "Static charge" : "Uniform motion") + ":</b> the fields are time-independent (or steady), so no electromagnetic wave is produced. Acceleration is essential.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["static", "Charge at rest"], ["uniform", "Uniform motion"], ["osc", "Oscillating (radiates)"]], st.preset, select);
    L.controls(L.slider("t4-f", "Oscillation frequency (scaled)", 1, 10, 1, st.f, String(st.f)));
    L.onInput("t4-f", function(v){ st.f = v; L.setVal("t4-f", String(v)); draw(); });
    L.legend([[C.danger, "charge"], [C.ok, "motion"], ["#38bdf8", "emitted wave"]]);
    L.watch("Compare the three motions. Only the oscillating charge sends a wave away.");
    draw();
  }

  window.SIMS.emsource = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Anatomy of a plane EM wave (NCERT §8.3.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "xy", phase: 90};

  function draw(){
    var ph = st.phase * Math.PI / 180;
    var m = "";
    var z0 = 70, z1 = 650, cy = 160;
    m += L.arrow(z0, cy, z1, cy, C.muted, 2);
    m += L.text(z1 + 18, cy + 5, "z", {size: 18, color: C.muted, weight: 700});
    var i;
    var ptsE = "", ptsB = "";
    for(i = 0; i <= 40; i += 1){
      var z = z0 + (z1 - z0) * i / 40;
      var s = Math.sin((i / 40) * 4 * Math.PI + ph);
      var ye = cy - 55 * s;
      var yb = cy + 45 * s;
      ptsE += (i ? " L" : "M") + z + " " + ye;
      ptsB += (i ? " L" : "M") + z + " " + yb;
      if(i % 4 === 0){
        m += L.line(z, cy, z, ye, "rgba(96,165,250,.45)", 1.5);
      }
    }
    m += '<path d="' + ptsE + '" fill="none" stroke="#60a5fa" stroke-width="3"/>';
    m += '<path d="' + ptsB + '" fill="none" stroke="#f59e0b" stroke-width="3"/>';
    m += L.text(120, 50, "E (blue) ⊥ B (amber) ⊥ z", {size: 17, color: C.text, weight: 700});
    m += L.text(120, 74, st.preset === "xy" ? "E along x, B along y" : "E along y, B along −x", {size: 14, color: C.muted});
    m += L.text(560, 250, "propagation →", {size: 15, color: C.ok});
    L.svg(m, "Sinusoidal electric and magnetic fields of a plane wave travelling along z.", 300);
    L.readout([
      ["Wave type", "plane, transverse", C.text],
      ["E direction", st.preset === "xy" ? "+x" : "+y", "#60a5fa"],
      ["B direction", st.preset === "xy" ? "+y" : "−x", "#f59e0b"],
      ["E₀/B₀", "c = 3 × 10⁸ m/s", C.ok]
    ]);
    L.verdict("<b>Both fields are transverse.</b> E and B are perpendicular to each other and to the direction of travel, and they oscillate in phase. The phase slider slides the whole pattern along z.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["xy", "E along x, B along y"], ["yx", "E along y, B along −x"]], st.preset, select);
    L.controls(L.slider("t5-ph", "Phase (snapshot position)", 0, 360, 15, st.phase, L.num(st.phase, 0) + "°"));
    L.onInput("t5-ph", function(v){ st.phase = v; L.setVal("t5-ph", L.num(v, 0) + "°"); draw(); });
    L.legend([["#60a5fa", "electric field E"], ["#f59e0b", "magnetic field B"], [C.muted, "axis z"]]);
    L.watch("Slide the phase to move the snapshot; switch presets to rotate the pair of fields while keeping E × B along +z.");
    draw();
  }

  window.SIMS.emwave = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Speed of light from ε and μ (NCERT §8.3.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "vacuum", er: 1};

  function info(){
    if(st.preset === "vacuum") return {name: "vacuum", er: 1};
    if(st.preset === "water") return {name: "water", er: 1.78};
    if(st.preset === "glass") return {name: "glass", er: 2.25};
    if(st.preset === "custom") return {name: "medium", er: st.er};
    return {name: "diamond", er: 5.86};
  }

  function draw(){
    var f = info();
    var er = st.preset === "custom" ? st.er : f.er;
    var n = Math.sqrt(er);
    var v = 3e8 / n;
    var m = "";
    m += L.text(360, 30, "v = 1/√(με) = c/n", {size: 20, color: C.text, weight: 700, mono: true});
    // vacuum region
    m += L.rect(60, 80, 220, 160, "rgba(15,23,42,.6)", ' rx="12" stroke="#334155" stroke-width="2"');
    m += L.text(170, 104, "VACUUM", {size: 15, color: C.muted, weight: 700});
    var i;
    for(i = 0; i < 5; i += 1){
      var yv = 125 + i * 24;
      m += '<path d="M 80 ' + yv + ' Q 120 ' + (yv - 16) + ', 160 ' + yv + ' T 240 ' + yv + ' T 260 ' + yv + '" fill="none" stroke="#38bdf8" stroke-width="2.4" opacity="0.9"/>';
    }
    // medium region
    var x0 = 300, x1 = 640;
    m += L.rect(x0, 80, x1 - x0, 160, "rgba(56,189,248,.08)", ' rx="12" stroke="#38bdf8" stroke-width="2"');
    m += L.text((x0 + x1) / 2, 104, f.name.toUpperCase() + (st.preset === "custom" ? " (custom)" : ""), {size: 15, color: "#38bdf8", weight: 700});
    var packed = Math.max(1.6, 4.6 / n);
    for(i = 0; i < 10; i += 1){
      var xs = x0 + 14 + i * 32;
      m += '<path d="M ' + xs + ' 180 q 8 -20, 16 0" fill="none" stroke="#f59e0b" stroke-width="2.2"/>';
    }
    m += L.text((x0 + x1) / 2, 262, "wavelength squeezes to λ/n = " + L.num(500 / n, 0) + " nm (for 500 nm light)", {size: 13, color: C.muted});
    L.svg(m, "A wave travelling from vacuum into a medium of refractive index " + L.num(n, 2) + ".", 300);
    L.readout([
      ["Medium", f.name, "#38bdf8"],
      ["√ε_r = n", L.num(n, 3)],
      ["Speed v = c/n", L.num(v / 1e8, 3) + " × 10⁸ m/s", C.ok],
      ["Index n", L.num(n, 3), n > 1.01 ? C.danger : C.muted]
    ]);
    L.verdict("<b>Slow down, stay same colour.</b> The frequency is fixed by the source, so as v drops the wavelength shrinks: λ_medium = λ_vacuum/n. That is why glass bends light.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["vacuum", "Vacuum n = 1"], ["water", "Water n = 1.33"], ["glass", "Glass n = 1.50"], ["custom", "Custom ε_r"]], st.preset, select);
    L.controls(L.slider("t6-er", "Relative permittivity ε_r", 1, 6, 0.05, st.er, L.num(st.er, 2)));
    L.onInput("t6-er", function(v){ st.er = v; L.setVal("t6-er", L.num(v, 2)); if(st.preset === "custom") draw(); });
    L.legend([["#38bdf8", "vacuum wave"], ["#f59e0b", "wave in medium"]]);
    L.watch("Pick a medium or set a custom permittivity. The speed always follows v = c/√(ε_rμ_r).");
    draw();
  }

  window.SIMS.lightspeed = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Energy split between E and B (NCERT §8.3.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {E0: 300, eps: 8.854e-12};

  function draw(){
    var uE = 0.25 * st.eps * st.E0 * st.E0;
    var uB = uE;
    var I = 0.5 * st.eps * st.E0 * st.E0 * 3e8;
    var scale = 0.25 * st.eps * 600 * 600;
    var wE = 60 + 300 * (uE / scale);
    var wB = 60 + 300 * (uB / scale);
    var wI = Math.min(360, 60 + 300 * (I / 480));
    var m = "";
    m += L.text(360, 30, "AVERAGE ENERGY DENSITY OF A PLANE WAVE", {size: 16, weight: 700});
    m += L.text(150, 78, "electric", {size: 15, color: "#60a5fa", weight: 700});
    m += L.rect(60, 90, wE, 34, "#1d4ed8", ' rx="8"');
    m += L.text(70 + wE, 113, L.num(uE * 1e9, 2) + " × 10⁻⁹ J/m³", {size: 14, color: C.text, anchor: "start"});
    m += L.text(150, 158, "magnetic", {size: 15, color: "#f59e0b", weight: 700});
    m += L.rect(60, 170, wB, 34, "#b45309", ' rx="8"');
    m += L.text(70 + wB, 193, L.num(uB * 1e9, 2) + " × 10⁻⁹ J/m³", {size: 14, color: C.text, anchor: "start"});
    m += L.text(150, 244, "intensity", {size: 15, color: C.ok, weight: 700});
    m += L.rect(60, 256, wI, 26, "#065f46", ' rx="8"');
    m += L.text(70 + wI, 275, L.num(I, 1) + " W/m²", {size: 13, color: C.text, anchor: "start"});
    L.svg(m, "Bar chart comparing electric energy density, magnetic energy density and intensity.", 300);
    L.readout([
      ["E₀", L.num(st.E0, 0) + " V/m", "#60a5fa"],
      ["⟨u_E⟩", L.num(uE * 1e9, 2) + " × 10⁻⁹ J/m³", "#60a5fa"],
      ["⟨u_B⟩", L.num(uB * 1e9, 2) + " × 10⁻⁹ J/m³", "#f59e0b"],
      ["Intensity I = ⟨u⟩c", L.num(I, 1) + " W/m²", C.ok]
    ]);
    L.verdict("<b>The two bars never separate.</b> In vacuum u_B = u_E at every instant, so each field carries half the wave's energy. Double E₀ and the energy densities — and the intensity — all grow fourfold.");
  }

  function mount(){
    labNoTimeline();
    L.controls(L.slider("t7-E0", "Electric-field amplitude E₀", 50, 600, 10, st.E0, L.num(st.E0, 0) + " V/m"));
    L.onInput("t7-E0", function(v){ st.E0 = v; L.setVal("t7-E0", L.num(v, 0) + " V/m"); draw(); });
    L.legend([["#1d4ed8", "electric energy"], ["#b45309", "magnetic energy"], ["#065f46", "intensity"]]);
    L.watch("Vary the amplitude. The electric and magnetic bars stay exactly equal; both scale as E₀².");
    draw();
  }

  window.SIMS.emenergy = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Electromagnetic spectrum slider (NCERT §8.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {exp: -7}; // wavelength = 10^exp metres

  var BANDS = [
    {name: "gamma rays", lo: -13, hi: -10, color: "#a78bfa"},
    {name: "X-rays", lo: -10, hi: -8, color: "#818cf8"},
    {name: "ultraviolet", lo: -8, hi: -6.4, color: "#c084fc"},
    {name: "visible", lo: -6.4, hi: -6.15, color: "#4ade80"},
    {name: "infrared", lo: -6.15, hi: -3, color: "#fb923c"},
    {name: "microwaves", lo: -3, hi: -1, color: "#facc15"},
    {name: "radio waves", lo: -1, hi: 7, color: "#38bdf8"}
  ];

  function bandOf(e){
    for(var i = 0; i < BANDS.length; i += 1){
      if(e < BANDS[i].hi || i === BANDS.length - 1) return BANDS[i];
    }
    return BANDS[0];
  }

  function draw(){
    var b = bandOf(st.exp);
    var lam = Math.pow(10, st.exp);
    var freq = 3e8 / lam;
    var ev = 1240 / (lam * 1e9);
    var m = "";
    m += L.text(360, 30, "THE ELECTROMAGNETIC SPECTRUM (log scale)", {size: 16, weight: 700});
    var x0 = 70, w = 580;
    var i;
    for(i = 0; i < BANDS.length; i += 1){
      var bx = x0 + w * (BANDS[i].lo + 13) / 20;
      var bw = w * (BANDS[i].hi - BANDS[i].lo) / 20;
      m += L.rect(bx, 90, bw, 60, BANDS[i].color, ' opacity="0.45" rx="4"');
      m += L.text(bx + bw / 2, 126, BANDS[i].name, {size: 9, color: "#0f172a", weight: 700});
    }
    var mx = x0 + w * (st.exp + 13) / 20;
    m += L.arrow(mx, 168, mx, 74, C.danger, 3);
    m += L.text(mx, 190, "10^" + st.exp + " m", {size: 14, color: C.danger, weight: 700});
    m += L.text(90, 230, "wavelength increases →", {size: 13, color: C.muted, anchor: "start"});
    m += L.text(630, 230, "← frequency and photon energy increase", {size: 13, color: C.muted, anchor: "end"});
    L.svg(m, "A logarithmic spectrum bar with a marker at wavelength 10 to the " + st.exp + " metres.", 300);
    L.readout([
      ["Band", b.name, b.color],
      ["Wavelength", "10^" + st.exp + " m"],
      ["Frequency", L.num(freq, 2) + " Hz"],
      ["Photon energy", ev >= 0.001 ? L.num(ev, 2) + " eV" : L.num(ev * 1e6, 1) + " × 10⁻⁶ eV"]
    ]);
    L.verdict("<b>Every band still travels at c.</b> Slide from gamma to radio: wavelength changes by 19 orders of magnitude, photon energy changes with it, but the vacuum speed stays 3 × 10⁸ m/s for all of them.");
  }

  function mount(){
    labNoTimeline();
    L.controls(L.slider("t8-exp", "log₁₀(λ / 1 m)", -12, 6, 1, st.exp, "10^" + st.exp + " m"));
    L.onInput("t8-exp", function(v){ st.exp = v; L.setVal("t8-exp", "10^" + v + " m"); draw(); });
    L.legend([["#a78bfa", "gamma"], ["#818cf8", "X-ray"], ["#4ade80", "visible"], ["#fb923c", "infrared"], ["#38bdf8", "radio"]]);
    L.watch("Sweep the logarithm of the wavelength and watch which band lights up, along with the photon energy.");
    draw();
  }

  window.SIMS.emspectrum = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Low-frequency bands: radio, microwave, infrared (NCERT §8.4.1–3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "radio", exp: 1};
  var INFO = {
    radio: {src: "accelerated electrons in an aerial", det: "receiver aerial", uses: "broadcast, TV, mobile phones",
      range: "λ > 0.1 m", color: "#38bdf8", exp0: 1, exp1: 5},
    microwave: {src: "klystron / magnetron / Gunn diode", det: "point-contact diode", uses: "radar, speed guns, microwave oven",
      range: "0.1 m to 1 mm", color: "#facc15", exp0: -3, exp1: -1},
    infrared: {src: "vibrating atoms and molecules", det: "thermopile, bolometer, IR film", uses: "remotes, night vision, therapy, greenhouse effect",
      range: "1 mm to 700 nm", color: "#fb923c", exp0: -6.1, exp1: -3}
  };

  function draw(){
    var f = INFO[st.preset];
    var lam = Math.pow(10, st.exp);
    var m = "";
    m += L.text(360, 30, f.range.toUpperCase(), {size: 17, weight: 700, color: f.color});
    // source
    m += L.circle(120, 165, 42, "#132033", ' stroke="' + f.color + '" stroke-width="2"');
    m += L.text(120, 160, st.preset === "radio" ? "aerial" : st.preset === "microwave" ? "tube" : "molecule", {size: 12, color: f.color, weight: 700});
    m += L.text(120, 178, "source", {size: 11, color: C.muted});
    var i;
    for(i = 0; i < 8; i += 1){
      var x = 190 + i * 42;
      var amp = 30 * Math.sin(i * 1.1) * (1 - i / 12);
      m += L.arrow(x, 165, x + 42, 165 - amp * 0.4, f.color, 3);
    }
    m += L.circle(600, 165, 42, "#132033", ' stroke="' + f.color + '" stroke-width="2"');
    m += L.text(600, 160, st.preset === "radio" ? "aerial" : st.preset === "microwave" ? "diode" : "detector", {size: 12, color: f.color, weight: 700});
    m += L.text(600, 178, "detector", {size: 11, color: C.muted});
    m += L.text(360, 248, "λ = " + waveLen(lam) + "   ·   ν = " + L.num(3e8 / lam, 2) + " Hz", {size: 15, color: C.text});
    L.svg(m, "A " + st.preset + " wave emitted by its source and picked up by its detector.", 300);
    L.readout([
      ["Band", st.preset, f.color],
      ["Production", f.src],
      ["Detection", f.det],
      ["Typical uses", f.uses, C.ok]
    ]);
    L.verdict("<b>" + st.preset.toUpperCase() + ":</b> produced by " + f.src + ", detected by " + f.det + ". " + (st.preset === "infrared" ? "Absorption raises molecular motion — this is why infrared feels like heat." : "The short wavelength keeps the beam narrow, ideal for communication and radar."));
  }

  function select(id){
    st.preset = id;
    st.exp = (INFO[id].exp0 + INFO[id].exp1) / 2;
    L.markPreset(id);
    L.setVal("t9-exp", "10^" + L.num(st.exp, 1) + " m");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["radio", "Radio"], ["microwave", "Microwave"], ["infrared", "Infrared"]], st.preset, select);
    L.controls(L.slider("t9-exp", "log₁₀(λ / 1 m)", -6.5, 5, 0.5, st.exp, "10^" + L.num(st.exp, 1) + " m"));
    L.onInput("t9-exp", function(v){ st.exp = v; L.setVal("t9-exp", "10^" + L.num(v, 1) + " m"); draw(); });
    L.legend([[f_color_for("radio"), "radio"], [f_color_for("microwave"), "microwave"], [f_color_for("infrared"), "infrared"]]);
    L.watch("Switch bands to compare sources and detectors, then tune the wavelength inside the selected band.");
    draw();
  }

  function f_color_for(k){ return INFO[k].color; }

  window.SIMS.lowbands = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 10 — High-frequency bands: visible, UV, X-ray, gamma (NCERT §8.4.4–7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "visible", exp: -6.6};
  var INFO = {
    visible: {range: "700 nm to 400 nm", prod: "electron transitions in atoms", use: "vision, photography, illumination",
      hazard: "none at ordinary intensity", color: "#4ade80", lo: -6.85, hi: -6.6},
    uv: {range: "400 nm to 0.6 nm", prod: "special lamps, very hot bodies, the Sun", use: "LASIK surgery, sterilising water",
      hazard: "sunburn, skin and eye damage", color: "#c084fc", lo: -8, hi: -6.6},
    xray: {range: "10 nm to 10⁻³ nm", prod: "fast electrons hitting a metal target", use: "medical imaging, cancer therapy",
      hazard: "ionises tissue; avoid overexposure", color: "#818cf8", lo: -10, hi: -8},
    gamma: {range: "below 10⁻¹⁰ m", prod: "radioactive nuclei, nuclear reactions", use: "cancer treatment, sterilising equipment",
      hazard: "highly penetrating ionising radiation", color: "#a78bfa", lo: -13, hi: -10}
  };

  function draw(){
    var f = INFO[st.preset];
    var lam = Math.pow(10, st.exp);
    var ev = 1240 / (lam * 1e9);
    var m = "";
    m += L.text(360, 30, f.range.toUpperCase(), {size: 16, weight: 700, color: f.color});
    // energy bar
    var frac = Math.max(0, Math.min(1, (st.exp + 12) / 6));
    m += L.rect(80, 70, 560, 22, "#132033", ' rx="10" stroke="#334155" stroke-width="1.5"');
    m += L.rect(80, 70, 560 * frac, 22, f.color, ' rx="10"');
    m += L.text(80, 112, "longer λ, lower energy", {size: 12, color: C.muted, anchor: "start"});
    m += L.text(640, 112, "shorter λ, higher energy", {size: 12, color: C.muted, anchor: "end"});
    var i;
    for(i = 0; i < 5; i += 1){
      var x = 180 + i * 90;
      m += L.line(x, 140, x, 200, f.color, 2 + (4 - i) * 0.6);
    }
    m += L.text(360, 225, "λ = " + waveLen(lam) + "   ·   photon E ≈ " + L.num(ev, 2) + " eV", {size: 15, color: C.text});
    m += L.text(360, 258, st.preset === "visible" || st.preset === "uv" ? "electronic transitions" : "nuclear / inner-shell processes", {size: 13, color: C.muted});
    L.svg(m, "Energy scale and production source for " + st.preset + " radiation.", 300);
    L.readout([
      ["Band", st.preset, f.color],
      ["Production", f.prod],
      ["Use", f.use, C.ok],
      ["Hazard", f.hazard, st.preset === "visible" ? C.muted : C.danger]
    ]);
    L.verdict("<b>" + st.preset.toUpperCase() + ":</b> produced by " + f.prod + ". " + (st.preset === "visible" ? "Its photons are gentle enough for the eye to detect safely." : "High photon energy means ionising risk — respect shielding and exposure limits."));
  }

  function select(id){
    st.preset = id;
    st.exp = (INFO[id].lo + INFO[id].hi) / 2;
    L.markPreset(id);
    L.setVal("t10-exp", "10^" + L.num(st.exp, 1) + " m");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["visible", "Visible"], ["uv", "Ultraviolet"], ["xray", "X-rays"], ["gamma", "Gamma rays"]], st.preset, select);
    L.controls(L.slider("t10-exp", "log₁₀(λ / 1 m)", -12.5, -6.5, 0.25, st.exp, "10^" + L.num(st.exp, 1) + " m"));
    L.onInput("t10-exp", function(v){ st.exp = v; L.setVal("t10-exp", "10^" + L.num(v, 1) + " m"); draw(); });
    L.legend([["#4ade80", "visible"], ["#c084fc", "UV"], ["#818cf8", "X-ray"], ["#a78bfa", "gamma"]]);
    L.watch("Switch bands and tune the wavelength. Notice how the photon energy climbs as the source becomes more microscopic.");
    draw();
  }

  window.SIMS.highbands = {mount: mount, draw: draw, select: select, state: st};
})();
