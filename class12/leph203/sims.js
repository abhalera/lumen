// Class 12 Physics, Chapter 11 (leph203) — simulation labs.
// One lab per lesson, built on the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

var H_PLANCK = 6.63e-34, Q_E = 1.6e-19, M_E = 9.11e-31, C_LIGHT = 3e8, HC_EVNM = 1240;

function sci(x, d){
  if(x === 0) return "0";
  var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10);
  var m = x / Math.pow(10, e);
  return m.toFixed(d || 2) + " × 10" + (e < 0 ? "⁻" : "") + String(Math.abs(e)).replace(/[0-9]/g, function(c){
    return "⁰¹²³⁴⁵⁶⁷⁸⁹".charAt(Number(c));
  });
}

// -------------------------------------------------------------------------
// Lab 1 — Cathode-ray tube and e/m (NCERT §11.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "none", V: 2.0};

  function draw(){
    var v = Math.sqrt(2 * Q_E * st.V * 1000 / M_E);
    var frac = v / C_LIGHT;
    var m = "";
    m += L.rect(60, 95, 600, 120, "rgba(148,163,184,.08)", ' rx="34" stroke="#475569" stroke-width="2"');
    m += L.rect(96, 130, 14, 50, "#f59e0b", ' rx="3"');
    m += L.text(103, 200, "cathode", {size: 13, color: "#f59e0b"});
    m += L.rect(210, 105, 12, 100, "#93c5fd", ' rx="3"');
    m += L.rect(210, 138, 12, 34, "#09131d");
    m += L.text(216, 90, "anode with slit", {size: 13, color: "#93c5fd"});
    m += L.rect(600, 75, 16, 160, "#1e293b", ' rx="4" stroke="#94a3b8"');
    m += L.text(608, 64, "screen", {size: 13, color: C.muted});
    var yEnd = 155;
    if(st.preset === "electric") yEnd = 95;
    if(st.preset === "magnetic") yEnd = 215;
    var x0 = 120, y0 = 155;
    var track = "M" + x0 + " " + y0 + " L" + 600 + " " + yEnd;
    if(st.preset !== "none") track += " Q" + 380 + " " + y0 + " " + 600 + " " + yEnd;
    m += '<path d="' + track + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';
    m += L.circle(608, yEnd, 9, "rgba(56,189,248,.35)");
    if(st.preset === "electric"){
      m += L.text(370, 42, "electric field between plates bends the beam", {size: 14, color: "#f59e0b"});
      m += L.rect(330, 120, 90, 8, "#7f1d1d", ' rx="2"');
      m += L.rect(330, 182, 90, 8, "#1e3a8a", ' rx="2"');
    } else if(st.preset === "magnetic"){
      m += L.text(370, 42, "magnetic field bends the beam the other way", {size: 14, color: "#f59e0b"});
      m += L.circle(375, 155, 26, "none", ' stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 4"');
      m += L.text(375, 160, "B", {size: 16, color: "#f59e0b", weight: 700});
    } else {
      m += L.text(370, 42, "no fields: the beam travels straight", {size: 14, color: C.muted});
    }
    m += L.text(103, 232, "electrons", {size: 13, color: "#38bdf8"});
    m += L.arrow(160, 232, 260, 232, "#38bdf8", 2.4);
    L.svg(m, "Cathode-ray tube with " + st.preset + " deflection.", 300);

    L.readout([
      ["Accelerating voltage", L.num(st.V, 1) + " kV"],
      ["Electron speed", sci(v, 2) + " m/s", "#38bdf8"],
      ["Speed / c", L.num(frac * 100, 1) + " %"],
      ["Specific charge e/m", "1.76 × 10¹¹ C/kg", C.ok]
    ]);
    L.verdict("<b>V = " + L.num(st.V, 1) + " kV:</b> each electron gains eV = " + L.num(st.V, 1) + " keV and reaches " + sci(v, 2) + " m/s. Whichever gas or cathode is used, e/m stays 1.76 × 10¹¹ C/kg — the beam is always made of electrons.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["none", "No fields"], ["electric", "Electric deflection"], ["magnetic", "Magnetic deflection"]], st.preset, select);
    L.controls(L.slider("c1-v", "Accelerating voltage", 0.5, 5.0, 0.1, st.V, L.num(st.V, 1) + " kV"));
    L.onInput("c1-v", function(v){ st.V = v; L.setVal("c1-v", L.num(v, 1) + " kV"); draw(); });
    L.legend([["#f59e0b", "cathode"], ["#93c5fd", "anode"], ["#38bdf8", "electron beam"]]);
    L.watch("Deflect the beam with electric and magnetic fields, then change the voltage. The e/m readout never changes.");
    draw();
  }

  window.SIMS.cathode = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Work function and emission (NCERT §11.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {metal: "cs", E: 3.0};
  var METALS = {
    cs: {name: "Caesium", phi: 2.14},
    k: {name: "Potassium", phi: 2.30},
    na: {name: "Sodium", phi: 2.75},
    zn: {name: "Zinc", phi: 4.30},
    cu: {name: "Copper", phi: 4.70}
  };

  function draw(){
    var me = METALS[st.metal];
    var emit = st.E > me.phi;
    var k = Math.max(0, st.E - me.phi);
    var m = "";
    m += L.line(80, 235, 660, 235, C.muted, 2);
    m += L.text(370, 262, "energy of the electron →", {size: 14, color: C.muted});
    var px = function(e){ return 110 + Math.min(e, 6.5) / 6.5 * 520; };
    m += L.rect(80, 218, px(me.phi) - 80, 17, "rgba(248,113,113,.4)");
    m += L.line(px(me.phi), 90, px(me.phi), 235, C.danger, 2.5, "6 5");
    m += L.text(px(me.phi), 80, "work function φ₀ = " + L.num(me.phi, 2) + " eV", {size: 14, color: C.danger});
    m += L.arrow(90, 140, px(st.E), 140, "#f59e0b", 3);
    m += L.text(px(st.E) - 20, 128, "photon energy hν = " + L.num(st.E, 2) + " eV", {size: 14, color: "#f59e0b", anchor: "end"});
    if(emit){
      m += L.circle(px(st.E) + 22, 150, 12, "#34d399");
      m += L.text(px(st.E) + 22, 155, "e", {size: 14, color: "#04111a", weight: 700});
      m += L.arrow(px(st.E) + 40, 150, 660, 150, "#34d399", 3);
      m += L.text(620, 128, "K_max = " + L.num(k, 2) + " eV", {size: 15, color: "#34d399", weight: 700});
    } else {
      m += L.circle(px(st.E) + 22, 150, 12, C.danger);
      m += L.text(px(st.E) + 22, 155, "e", {size: 14, color: "#fff", weight: 700});
      m += L.text(560, 128, "no escape: hν < φ₀", {size: 15, color: C.danger, weight: 700});
    }
    L.svg(m, "Energy bar for the " + me.name + " work function.", 300);

    L.readout([
      ["Metal", me.name, C.text],
      ["Work function φ₀", L.num(me.phi, 2) + " eV", C.danger],
      ["Photon energy hν", L.num(st.E, 2) + " eV", "#f59e0b"],
      ["Maximum kinetic energy", emit ? L.num(k, 2) + " eV" : "0 (no emission)", emit ? C.ok : C.danger]
    ]);
    if(emit){
      L.verdict("<b>Emission:</b> the photon carries " + L.num(st.E, 2) + " eV, pays the " + L.num(me.phi, 2) + " eV work function, and leaves " + L.num(k, 2) + " eV of kinetic energy. This is Einstein's equation, K_max = hν − φ₀.");
    } else {
      L.verdict("<b>No emission:</b> hν = " + L.num(st.E, 2) + " eV is below the work function " + L.num(me.phi, 2) + " eV, so the electron cannot climb out — no matter how intense the light is.");
    }
  }

  function select(id){
    st.metal = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["cs", "Caesium 2.14 eV"], ["k", "Potassium 2.30 eV"], ["na", "Sodium 2.75 eV"], ["zn", "Zinc 4.30 eV"], ["cu", "Copper 4.70 eV"]], st.metal, select);
    L.controls(L.slider("c2-e", "Photon energy hν", 1.0, 6.0, 0.05, st.E, L.num(st.E, 2) + " eV"));
    L.onInput("c2-e", function(v){ st.E = v; L.setVal("c2-e", L.num(v, 2) + " eV"); draw(); });
    L.legend([[C.danger, "work function barrier"], ["#f59e0b", "photon energy"], ["#34d399", "emitted electron"]]);
    L.watch("Slide the photon energy past the red barrier. Emission begins the moment hν exceeds φ₀, and the surplus becomes kinetic energy.");
    draw();
  }

  window.SIMS.workfunction = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Hallwachs' electroscope (NCERT §11.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {case: "neg-dark"};
  var CASES = {
    "neg-dark": {charge: -1, light: "none", label: "Negative plate, no light"},
    "neg-uv": {charge: -1, light: "uv", label: "Negative plate + ultraviolet"},
    "pos-uv": {charge: 1, light: "uv", label: "Positive plate + ultraviolet"},
    "neu-uv": {charge: 0, light: "uv", label: "Neutral plate + ultraviolet"},
    "neg-red": {charge: -1, light: "red", label: "Negative plate + red light"}
  };

  function draw(){
    var cs = CASES[st.case];
    // UV ejects electrons from a negative or a neutral plate. A positive plate
    // pulls the emitted electrons straight back, so its charge does not change.
    var emitted = cs.light === "uv" && cs.charge <= 0;
    var finalCharge = emitted ? (cs.charge < 0 ? 0 : 1) : cs.charge;
    var m = "";
    m += L.line(170, 200, 520, 200, "#94a3b8", 4);
    m += L.rect(300, 90, 80, 24, "#cbd5e1", ' rx="4"');
    m += L.text(340, 74, "zinc plate", {size: 14, color: "#e2e8f0"});
    m += L.line(340, 114, 245, 200, "#cbd5e1", 3);
    m += L.line(340, 114, 435, 200, "#cbd5e1", 3);
    var spread = finalCharge === 0 ? 8 : 42 + Math.abs(finalCharge) * 30;
    m += L.line(245, 200, 245 + spread, 240, "#e2e8f0", 3);
    m += L.line(435, 200, 435 - spread, 240, "#e2e8f0", 3);
    m += L.circle(340, 205, 5, "#94a3b8");
    m += L.text(340, 278, "electroscope leaves " + (Math.abs(finalCharge) === 0 ? "collapse (discharged)" : (spread > 50 ? "apart (charged)" : "slightly apart")), {size: 13, color: C.muted});
    if(cs.light === "uv"){
      for(var i = 0; i < 5; i += 1){
        m += L.arrow(100 + i * 26, 40, 160 + i * 26, 84, "#a78bfa", 2.2);
      }
      m += L.text(165, 26, "ultraviolet light", {size: 14, color: "#a78bfa"});
    } else if(cs.light === "red"){
      for(var j = 0; j < 5; j += 1){
        m += L.arrow(100 + j * 26, 40, 160 + j * 26, 84, C.danger, 2.2);
      }
      m += L.text(165, 26, "red light", {size: 14, color: C.danger});
    } else {
      m += L.text(165, 26, "light off", {size: 14, color: C.muted});
    }
    var sign = finalCharge > 0 ? "+" : (finalCharge < 0 ? "−" : "0");
    m += L.text(430, 80, "plate charge: " + sign, {size: 15, color: finalCharge > 0 ? C.danger : (finalCharge < 0 ? "#60a5fa" : C.muted)});
    if(emitted) m += L.text(560, 140, "e⁻ ejected", {size: 14, color: "#34d399"});
    L.svg(m, "Hallwachs electroscope: " + cs.label + ".", 300);

    L.readout([
      ["Plate charge", cs.charge < 0 ? "negative" : (cs.charge > 0 ? "positive" : "neutral"), cs.charge < 0 ? "#60a5fa" : (cs.charge > 0 ? C.danger : C.muted)],
      ["Light", cs.light === "uv" ? "ultraviolet" : (cs.light === "red" ? "red" : "none"), cs.light === "uv" ? "#a78bfa" : C.muted],
      ["Electrons emitted?", emitted ? "yes" : "no", emitted ? C.ok : C.danger],
      ["Leaves after light", Math.abs(finalCharge) === 0 ? "collapse" : "stay apart", C.text]
    ]);
    if(emitted){
      if(cs.charge === 0){
        L.verdict("<b>Ultraviolet light ejects electrons</b> from the neutral zinc surface, so the plate loses electrons and becomes positive. Its leaves stay apart, now carrying the opposite charge.");
      } else {
        L.verdict("<b>Ultraviolet light ejects electrons</b> from the zinc surface, so a negative plate loses its charge and the leaves collapse. A neutral plate becomes positive because it loses electrons.");
      }
    } else if(cs.light === "red"){
      L.verdict("<b>Red light does nothing:</b> red photons are below zinc's threshold frequency, so no electrons are emitted however long the light shines.");
    } else if(cs.charge > 0){
      L.verdict("The positive plate already lacks electrons. Emitting more electrons would make it more positive, but electron emission is suppressed; the observed positive charge does not decrease.");
    } else {
      L.verdict("No light means no emission — the electroscope keeps whatever charge it was given.");
    }
  }

  function select(id){
    st.case = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([
      ["neg-dark", "Neg, dark"],
      ["neg-uv", "Neg + UV"],
      ["pos-uv", "Pos + UV"],
      ["neu-uv", "Neutral + UV"],
      ["neg-red", "Neg + red"]
    ], st.case, select);
    L.legend([["#a78bfa", "ultraviolet photons"], [C.danger, "red photons"], ["#34d399", "emitted electron"]]);
    L.watch("Compare ultraviolet with red light, and a negatively charged plate with a positively charged one.");
    draw();
  }

  window.SIMS.hallwachs = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Photocurrent vs collector potential (NCERT §11.4.1–11.4.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {I: 1.0};
  var V0 = 1.0;
  var X0 = 130, Y0 = 240, W = 480, Hh = 170;

  function current(V){
    if(V <= -V0) return 0;
    return st.I * (1 - Math.exp(-(V + V0) / 0.35));
  }

  function draw(){
    var m = "";
    m += L.line(X0, Y0, X0 + W, Y0, C.muted, 2);
    m += L.line(X0, Y0, X0, Y0 - Hh - 10, C.muted, 2);
    m += L.text(X0 + W, Y0 + 24, "collector potential V (V) →", {size: 13, color: C.muted, anchor: "end"});
    m += L.text(X0 - 6, Y0 - Hh - 16, "photocurrent", {size: 13, color: C.muted, anchor: "start"});
    var vx = function(V){ return X0 + (V + 2) / 5 * W; };
    var iy = function(i){ return Y0 - i / 3.2 * Hh; };
    var j;
    for(j = -2; j <= 3; j += 1){
      m += L.line(vx(j), Y0, vx(j), Y0 - Hh, C.grid, 1);
      m += L.text(vx(j), Y0 + 18, String(j), {size: 12, color: C.muted});
    }
    var pts = [];
    var k;
    for(k = 0; k <= 120; k += 1){
      var V = -2 + 5 * k / 120;
      pts.push(vx(V).toFixed(1) + "," + iy(current(V)).toFixed(1));
    }
    m += '<polyline fill="none" stroke="#38bdf8" stroke-width="3" points="' + pts.join(" ") + '"/>';
    m += L.line(vx(-V0), Y0, vx(-V0), Y0 - Hh, C.danger, 1.6, "5 4");
    m += L.circle(vx(-V0), Y0, 5, C.danger);
    m += L.text(vx(-V0), Y0 - Hh - 4, "stopping potential V₀ = 1.0 V", {size: 13, color: C.danger});
    m += L.line(X0, iy(st.I), X0 + W, iy(st.I), "rgba(52,211,153,.6)", 1.6, "6 5");
    m += L.text(X0 + W - 6, iy(st.I) - 6, "saturation current", {size: 13, color: C.ok, anchor: "end"});
    L.svg(m, "Photocurrent against collector potential for intensity " + L.num(st.I, 1) + ".", 300);

    L.readout([
      ["Light intensity", L.num(st.I, 1) + " × I₁", "#38bdf8"],
      ["Saturation current", L.num(st.I, 1) + " × I_sat", C.ok],
      ["Stopping potential", "1.0 V", C.danger],
      ["Maximum kinetic energy", "1.0 eV", "#f59e0b"]
    ]);
    L.verdict("<b>Change the intensity:</b> the curve grows taller but its cut-off stays at the same −1.0 V. Intensity controls how many electrons are emitted, not how much energy each one carries.");
  }

  function mount(){
    labNoTimeline();
    L.controls(L.slider("c4-i", "Light intensity", 0.4, 3.0, 0.05, st.I, L.num(st.I, 1) + " × I₁"));
    L.onInput("c4-i", function(v){ st.I = v; L.setVal("c4-i", L.num(v, 1) + " × I₁"); draw(); });
    L.legend([["#38bdf8", "I–V curve"], [C.danger, "stopping potential"], [C.ok, "saturation current"]]);
    L.watch("All intensities with the same frequency cut off at the same stopping potential. Only the saturation current changes.");
    draw();
  }

  window.SIMS.photocurrent = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Stopping potential vs frequency (NCERT §11.4.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {metal: "cs", nu: 10.0};
  var METALS = {
    cs: {name: "Caesium", phi: 2.14},
    na: {name: "Sodium", phi: 2.75},
    zn: {name: "Zinc", phi: 4.30}
  };
  var X0 = 120, Y0 = 250, W = 500, Hh = 190;
  var NUMAX = 16, VMAX = 4;

  function draw(){
    var me = METALS[st.metal];
    var nu0 = me.phi / (H_PLANCK / Q_E) / 1e14;
    var V0 = (H_PLANCK / Q_E) * (st.nu - nu0) * 1e14;
    var vx = function(nu){ return X0 + nu / NUMAX * W; };
    var vy = function(v){ return Y0 - Math.max(0, v) / VMAX * Hh; };
    var m = "";
    m += L.line(X0, Y0, X0 + W, Y0, C.muted, 2);
    m += L.line(X0, Y0, X0, Y0 - Hh - 10, C.muted, 2);
    m += L.text(X0 + W, Y0 + 24, "frequency ν (10¹⁴ Hz) →", {size: 13, color: C.muted, anchor: "end"});
    m += L.text(X0 - 8, Y0 - Hh - 18, "stopping potential V₀ (V)", {size: 13, color: C.muted, anchor: "start"});
    var i;
    for(i = 0; i <= 4; i += 1){
      m += L.line(X0, vy(i), X0 + W, vy(i), C.grid, 1);
      m += L.text(X0 - 10, vy(i) + 4, String(i), {size: 12, color: C.muted, anchor: "end"});
    }
    for(i = 0; i <= 4; i += 1){
      var nv = i * 4;
      m += L.line(vx(nv), Y0, vx(nv), Y0 - Hh, C.grid, 1);
      m += L.text(vx(nv), Y0 + 18, String(nv), {size: 12, color: C.muted});
    }
    var x1 = vx(nu0), y1 = Y0, x2 = vx(NUMAX), y2 = vy((H_PLANCK / Q_E) * (NUMAX - nu0) * 1e14);
    m += L.line(x1, y1, x2, y2, "#38bdf8", 3);
    m += L.circle(vx(st.nu), vy(Math.max(0, V0)), 7, V0 >= 0 ? C.ok : C.danger);
    m += L.line(vx(st.nu), Y0, vx(st.nu), vy(Math.max(0, V0)), "rgba(226,232,240,.5)", 1.4, "5 4");
    m += L.circle(x1, y1, 5, C.danger);
    m += L.text(x1, Y0 + 38, "ν₀ = " + L.num(nu0, 2) + " × 10¹⁴ Hz", {size: 13, color: C.danger});
    m += L.text(X0 + W - 8, vy(0.4), "slope = h/e (same for every metal)", {size: 13, color: C.muted, anchor: "end"});
    L.svg(m, "Stopping potential against frequency for " + me.name + ".", 300);

    L.readout([
      ["Metal", me.name, C.text],
      ["Threshold frequency ν₀", L.num(nu0, 2) + " × 10¹⁴ Hz", C.danger],
      ["Incident frequency ν", L.num(st.nu, 1) + " × 10¹⁴ Hz", "#38bdf8"],
      ["Stopping potential V₀", V0 >= 0 ? L.num(V0, 2) + " V" : "no emission", V0 >= 0 ? C.ok : C.danger]
    ]);
    if(V0 >= 0){
      L.verdict("<b>ν = " + L.num(st.nu, 1) + " × 10¹⁴ Hz is above threshold.</b> V₀ = (h/e)(ν − ν₀) = " + L.num(V0, 2) + " V, so the electrons emerge with K_max = " + L.num(V0, 2) + " eV.");
    } else {
      L.verdict("<b>Below threshold:</b> ν = " + L.num(st.nu, 1) + " × 10¹⁴ Hz < ν₀, so no electrons are emitted at all. The V₀–ν line starts only at the threshold frequency.");
    }
  }

  function select(id){
    st.metal = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["cs", "Caesium"], ["na", "Sodium"], ["zn", "Zinc"]], st.metal, select);
    L.controls(L.slider("c5-nu", "Frequency ν", 3.0, 16.0, 0.1, st.nu, L.num(st.nu, 1) + " × 10¹⁴ Hz"));
    L.onInput("c5-nu", function(v){ st.nu = v; L.setVal("c5-nu", L.num(v, 1) + " × 10¹⁴ Hz"); draw(); });
    L.legend([["#38bdf8", "V₀–ν line"], [C.danger, "threshold"], [C.ok, "current operating point"]]);
    L.watch("Switch metals: the line stays parallel — the slope h/e is universal — but its intercept on the frequency axis shifts.");
    draw();
  }

  window.SIMS.stopv = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Wave theory vs observation (NCERT §11.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {test: "intensity"};
  var TESTS = {
    intensity: {name: "Intensity test", wave: "K_max should grow with intensity", obs: "K_max stays the same; only the current grows", verdict: "A stronger wave should pump more energy into each electron, but the stopping potential is unchanged. The wave picture fails."},
    threshold: {name: "Threshold test", wave: "Any frequency should work if the light is intense enough", obs: "Below ν₀ nothing happens, however intense the light", verdict: "A continuous wave has no reason to possess a sharp threshold frequency. The photon picture explains it: hν must exceed φ₀."},
    timing: {name: "Timing test", wave: "Dim light should take minutes to hours to eject electrons", obs: "Emission starts within 10⁻⁹ s, with no measurable delay", verdict: "Wave theory spreads the energy over the whole wavefront, so each electron receives only a trickle. Single-photon absorption removes the delay."}
  };

  function draw(){
    var t = TESTS[st.test];
    var m = "";
    m += L.rect(40, 60, 310, 200, "rgba(248,113,113,.07)", ' rx="12" stroke="#7f1d1d" stroke-width="2"');
    m += L.rect(375, 60, 310, 200, "rgba(52,211,153,.07)", ' rx="12" stroke="#14532d" stroke-width="2"');
    m += L.text(195, 42, "WAVE THEORY PREDICTS", {size: 15, color: C.danger, weight: 700});
    m += L.text(530, 42, "EXPERIMENT SHOWS", {size: 15, color: C.ok, weight: 700});
    var wrap = function(s, x, y, color){
      var words = s.split(" ");
      var line = "";
      var out = "";
      var ln = 0;
      for(var i = 0; i < words.length; i += 1){
        var test = line ? line + " " + words[i] : words[i];
        if(test.length > 26){
          out += L.text(x, y + ln * 22, line, {size: 14, color: color});
          line = words[i];
          ln += 1;
        } else {
          line = test;
        }
      }
      out += L.text(x, y + ln * 22, line, {size: 14, color: color});
      return out;
    };
    m += wrap(t.wave, 195, 110, "#fca5a5");
    m += wrap(t.obs, 530, 110, "#6ee7b7");
    m += L.text(360, 190, "vs", {size: 22, color: C.muted, weight: 700});
    m += L.text(360, 284, t.name, {size: 15, color: C.text, weight: 700});
    L.svg(m, "Comparison of wave-theory prediction and observation for the " + t.name + ".", 300);

    L.readout([
      ["Test", t.name, C.text],
      ["Wave theory predicts", "classical expectation", C.danger],
      ["Observation", "quantum result", C.ok],
      ["Status of wave theory", "cannot explain it", C.danger]
    ]);
    L.verdict("<b>" + t.name + ":</b> " + t.verdict);
  }

  function select(id){
    st.test = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["intensity", "Intensity test"], ["threshold", "Threshold test"], ["timing", "Timing test"]], st.test, select);
    L.legend([[C.danger, "classical expectation"], [C.ok, "measured behaviour"]]);
    L.watch("Pick each test and compare the classical prediction with what the experiment actually measures.");
    draw();
  }

  window.SIMS.wavefail = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Einstein's photoelectric equation (NCERT §11.6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {metal: "cs", lam: 400};
  var METALS = {
    cs: {name: "Caesium", phi: 2.14},
    na: {name: "Sodium", phi: 2.75},
    zn: {name: "Zinc", phi: 4.30}
  };

  function draw(){
    var me = METALS[st.metal];
    var E = HC_EVNM / st.lam;
    var k = E - me.phi;
    var emit = k > 0;
    var m = "";
    var total = 400, x0 = 120, y0 = 120;
    var wphi = Math.min(total, total * me.phi / Math.max(E, me.phi));
    var wk = Math.max(0, total - wphi);
    m += L.rect(x0, y0, total, 46, "rgba(148,163,184,.15)", ' rx="8"');
    m += L.rect(x0, y0, wphi, 46, "rgba(248,113,113,.5)", ' rx="8"');
    m += L.rect(x0 + wphi, y0, wk, 46, "rgba(52,211,153,.55)");
    m += L.text(x0 + wphi / 2, y0 + 29, "φ₀ = " + L.num(me.phi, 2) + " eV", {size: 14, color: "#fff"});
    if(wk > 60) m += L.text(x0 + wphi + wk / 2, y0 + 29, "K_max = " + L.num(k, 2) + " eV", {size: 14, color: "#fff"});
    m += L.text(x0, y0 - 18, "photon energy hν = " + L.num(E, 2) + " eV", {size: 15, color: "#f59e0b", anchor: "start"});
    m += L.arrow(x0, y0 - 48, x0 + total, y0 - 48, "#f59e0b", 3);
    if(emit){
      m += L.circle(x0 + total + 40, y0 + 23, 14, "#34d399");
      m += L.text(x0 + total + 40, y0 + 28, "e", {size: 15, color: "#04111a", weight: 700});
      m += L.text(x0 + total + 40, y0 + 58, "escapes", {size: 13, color: C.ok});
    } else {
      m += L.circle(x0 + total + 40, y0 + 23, 14, C.danger);
      m += L.text(x0 + total + 40, y0 + 28, "e", {size: 15, color: "#fff", weight: 700});
      m += L.text(x0 + total + 40, y0 + 58, "trapped", {size: 13, color: C.danger});
    }
    var series = "";
    var i;
    for(i = 0; i < 9; i += 1){
      var x = 120 + i * 6;
      if(x > 420) break;
      series += L.circle(x, 240, 8, "rgba(167,139,250,.75)");
    }
    m += L.text(270, 222, "one photon is absorbed by one electron", {size: 13, color: C.muted});
    L.svg(m, "Energy budget for photon absorption with work function " + L.num(me.phi, 2) + " eV.", 300);

    L.readout([
      ["Wavelength λ", L.num(st.lam, 0) + " nm"],
      ["Photon energy hν", L.num(E, 2) + " eV", "#f59e0b"],
      ["Work function φ₀", L.num(me.phi, 2) + " eV", C.danger],
      ["K_max = hν − φ₀", emit ? L.num(k, 2) + " eV" : "no emission", emit ? C.ok : C.danger],
      ["Stopping potential", emit ? L.num(k, 2) + " V" : "—", emit ? C.ok : C.muted]
    ]);
    if(emit){
      L.verdict("<b>hν = " + L.num(E, 2) + " eV pays the work function and leaves K_max = " + L.num(k, 2) + " eV.</b> The stopping potential is " + L.num(k, 2) + " V. Notice that the intensity of the light does not appear anywhere in this budget.");
    } else {
      L.verdict("<b>Below threshold:</b> a " + L.num(st.lam, 0) + " nm photon has only " + L.num(E, 2) + " eV, below the " + L.num(me.phi, 2) + " eV work function. Longer wavelength means lower photon energy.");
    }
  }

  function select(id){
    st.metal = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["cs", "Caesium"], ["na", "Sodium"], ["zn", "Zinc"]], st.metal, select);
    L.controls(L.slider("c7-lam", "Wavelength λ", 200, 700, 5, st.lam, L.num(st.lam, 0) + " nm"));
    L.onInput("c7-lam", function(v){ st.lam = v; L.setVal("c7-lam", L.num(v, 0) + " nm"); draw(); });
    L.legend([["#f59e0b", "photon energy"], [C.danger, "work function"], [C.ok, "kinetic energy"]]);
    L.watch("Shorten the wavelength to raise hν. The red part of the budget is fixed by the metal; only the green surplus changes.");
    draw();
  }

  window.SIMS.einstein = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Photon energy, momentum and flux (NCERT §11.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {lam: 550, P: 1.0};

  function draw(){
    var lamM = st.lam * 1e-9;
    var E = H_PLANCK * C_LIGHT / lamM;
    var p = H_PLANCK / lamM;
    var N = (st.P * 1e-3) / E;
    var m = "";
    m += L.rect(480, 70, 120, 160, "rgba(148,163,184,.2)", ' rx="10" stroke="#94a3b8"');
    m += L.text(540, 256, "target", {size: 13, color: C.muted});
    var count = Math.max(3, Math.min(22, Math.round(Math.log(N + 1) * 1.6)));
    var i;
    for(i = 0; i < count; i += 1){
      var x = 80 + (i % 8) * 42 + (i > 7 ? 18 : 0) + (i > 15 ? 12 : 0);
      var y = 90 + (i % 3) * 42 + (i > 7 ? 10 : 0);
      var col = st.lam < 470 ? "#60a5fa" : (st.lam < 560 ? "#34d399" : (st.lam < 620 ? "#facc15" : "#f87171"));
      m += L.circle(x, y, 7, col);
      m += L.line(x + 7, y, x + 700 > 470 ? 474 : x + 30, y, "rgba(167,139,250,.35)", 1.6);
    }
    m += L.text(300, 42, "photons in the beam (illustrative count)", {size: 14, color: C.muted});
    L.svg(m, "Photons of wavelength " + L.num(st.lam, 0) + " nanometres striking a target.", 300);

    L.readout([
      ["Wavelength λ", L.num(st.lam, 0) + " nm", C.text],
      ["Beam power", L.num(st.P, 2) + " mW"],
      ["Photon energy E", sci(E, 2) + " J", "#f59e0b"],
      ["Photon energy (eV)", L.num(E / Q_E, 2) + " eV", "#f59e0b"],
      ["Photon momentum p", sci(p, 2) + " kg m/s", "#a78bfa"],
      ["Photons per second", sci(N, 2), C.ok]
    ]);
    L.verdict("<b>E = hc/λ = " + sci(E, 2) + " J and p = h/λ = " + sci(p, 2) + " kg m/s.</b> The 1 mW beam delivers " + sci(N, 2) + " photons each second. Shorten the wavelength and each photon carries more energy, so fewer arrive per second for the same power.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("c8-lam", "Wavelength λ", 400, 700, 5, st.lam, L.num(st.lam, 0) + " nm") +
      L.slider("c8-p", "Beam power", 0.10, 10.0, 0.05, st.P, L.num(st.P, 2) + " mW")
    );
    L.onInput("c8-lam", function(v){ st.lam = v; L.setVal("c8-lam", L.num(v, 0) + " nm"); draw(); });
    L.onInput("c8-p", function(v){ st.P = v; L.setVal("c8-p", L.num(v, 2) + " mW"); draw(); });
    L.legend([["#facc15", "photon"], ["#a78bfa", "direction of travel"]]);
    L.watch("Every photon has the same energy for a given wavelength. Raising the power only increases the number of photons per second.");
    draw();
  }

  window.SIMS.photon = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — de Broglie matter waves (NCERT §11.8)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {particle: "electron", v: 1.0e6};
  var PARTICLES = {
    electron: {name: "Electron", m: 9.11e-31, min: 1e4, max: 1e7, unit: "m/s"},
    proton: {name: "Proton", m: 1.67e-27, min: 1e2, max: 1e6, unit: "m/s"},
    dust: {name: "Dust particle", m: 1.0e-9, min: 1, max: 100, unit: "m/s"},
    ball: {name: "Cricket ball", m: 0.12, min: 1, max: 100, unit: "m/s"}
  };

  function draw(){
    var p = PARTICLES[st.particle];
    var mom = p.m * st.v;
    var lam = H_PLANCK / mom;
    var lg = Math.log(lam) / Math.LN10;
    var wavePx = Math.max(14, Math.min(320, 30 + (lg + 35) * 8));
    var m = "";
    var x0 = 100, x1 = 660;
    var yc = 150;
    m += L.arrow(x0, yc + 70, x1, yc + 70, C.muted, 2);
    m += L.text((x0 + x1) / 2, yc + 96, "direction of motion", {size: 13, color: C.muted});
    var pts = [];
    var i;
    for(i = 0; i <= 240; i += 1){
      var x = x0 + (x1 - x0) * i / 240;
      var y = yc + 42 * Math.sin(2 * Math.PI * (x - x0) / wavePx);
      pts.push(x.toFixed(1) + "," + y.toFixed(1));
    }
    m += '<polyline fill="none" stroke="#38bdf8" stroke-width="2.4" opacity="0.9" points="' + pts.join(" ") + '"/>';
    m += L.circle(160, yc + 70, 10, p.name === "Electron" ? "#60a5fa" : "#f59e0b");
    m += L.text(160, yc + 102, p.name, {size: 13, color: C.text});
    m += L.line(x0, yc - 84, x0 + wavePx, yc - 84, C.ok, 3);
    m += L.text(x0 + wavePx / 2, yc - 94, "λ = " + sci(lam, 2) + " m", {size: 14, color: C.ok});
    m += L.text(390, yc - 130, "p = mv = " + sci(mom, 2) + " kg m/s", {size: 15, color: "#f59e0b", weight: 700});
    L.svg(m, "Matter wave of a " + p.name.toLowerCase() + " moving at " + L.num(st.v, 0) + " metres per second.", 300);

    L.readout([
      ["Particle", p.name, C.text],
      ["Mass m", sci(p.m, 2) + " kg"],
      ["Speed v", (st.v >= 1e5 ? sci(st.v, 2) : L.num(st.v, 2)) + " m/s", "#f59e0b"],
      ["Momentum p = mv", sci(mom, 2) + " kg m/s", "#f59e0b"],
      ["de Broglie λ = h/p", sci(lam, 2) + " m", C.ok]
    ]);
    L.verdict("<b>λ = h/p = " + sci(lam, 2) + " m.</b> For the " + p.name.toLowerCase() + " the wave is " + (lam > 1e-9 ? "comparable to atomic dimensions — measurable by diffraction" : "unimaginably small — no everyday measurement can detect it") + ". Heavier particles have shorter waves.");
  }

  function select(id){
    st.particle = id;
    var p = PARTICLES[id];
    st.v = Math.sqrt(p.min * p.max);
    L.markPreset(id);
    L.controls(L.slider("c9-v", "Speed v (m/s)", 0, 1000, 1, speedToSlider(st.v, p), speedLabel(st.v, p)));
    L.onInput("c9-v", function(val){
      st.v = sliderToSpeed(val, p);
      L.setVal("c9-v", speedLabel(st.v, p));
      draw();
    });
    draw();
  }

  function speedToSlider(v, p){
    return Math.round(1000 * (Math.log(v / p.min) / Math.log(p.max / p.min)));
  }
  function sliderToSpeed(val, p){
    return p.min * Math.pow(p.max / p.min, val / 1000);
  }
  function speedLabel(v, p){
    return (v >= 1e5 ? sci(v, 2) : L.num(v, 2)) + " " + p.unit;
  }

  function mount(){
    labNoTimeline();
    L.presets([["electron", "Electron"], ["proton", "Proton"], ["dust", "Dust particle"], ["ball", "Cricket ball"]], st.particle, select);
    L.legend([["#38bdf8", "matter wave"], [C.ok, "de Broglie wavelength"]]);
    L.watch("Use the speed slider on the log scale. Watch how the wavelength collapses as the mass or the speed grows.");
    select(st.particle);
  }

  window.SIMS.debroglie = {mount: mount, draw: draw, select: select, state: st};
})();
