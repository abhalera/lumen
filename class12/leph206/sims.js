// Class 12 Physics, Chapter 14 (leph206) — simulation labs.
// One bespoke lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
// ES5 only; every displayed value is computed from the formula the lesson teaches.
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// Scientific notation with a true unicode exponent, e.g. 4.5 × 10⁹.
function supDigits(n){
  var map = {"-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"};
  var s = String(n), out = "", i;
  for(i = 0; i < s.length; i += 1) out += map[s.charAt(i)] || s.charAt(i);
  return out;
}
function sci(x, d){
  var L = LAB;
  if(!isFinite(x)) return "—";
  if(x === 0) return "0";
  var sign = x < 0 ? "−" : "";
  x = Math.abs(x);
  var e = Math.floor(Math.log(x) / Math.LN10);
  var m = x / Math.pow(10, e);
  if(m >= 10){ m /= 10; e += 1; }
  if(m < 1){ m *= 10; e -= 1; }
  return sign + L.num(m, d === undefined ? 1 : d) + " × 10" + supDigits(e);
}

// -------------------------------------------------------------------------
// Lab 1 — Valve vs chip: controlled electron flow (NCERT §14.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {device: "tube", drive: 30};
  var INFO = {
    tube: {name: "Vacuum tube (valve)", V: 100, maxI: 0.020, source: "heated cathode in vacuum", note: "bulky, hot, needs ~100 V and a heated cathode"},
    chip: {name: "Solid-state transistor", V: 5, maxI: 0.020, source: "carriers inside the crystal", note: "small, cool, works at a few volts with no heater"}
  };

  function draw(){
    var info = INFO[st.device];
    var I = info.maxI * st.drive / 100;
    var P = info.V * I;
    var m = "";
    if(st.device === "tube"){
      m += L.rect(60, 58, 240, 196, "rgba(96,165,250,.07)", ' rx="16" stroke="#8db0d8" stroke-width="2"');
      m += L.text(180, 44, "GLASS ENVELOPE (VACUUM)", {size: 13, color: "#93c5fd", weight: 700});
      m += L.rect(120, 96, 16, 118, "#7f1d1d", ' rx="5"');
      m += L.text(128, 90, "anode +", {size: 12, color: C.danger});
      m += L.rect(224, 96, 16, 118, "#b45309", ' rx="5"');
      m += L.text(232, 90, "cathode −", {size: 12, color: "#fcd34d"});
      var i, n = Math.round(st.drive / 10);
      for(i = 0; i < n; i += 1) m += L.circle(180, 118 + i * 13, 5, "#60a5fa");
      m += L.text(180, 232, "electrons boiled out of the hot cathode", {size: 12, color: C.muted});
    } else {
      m += L.rect(120, 108, 120, 92, "#1e3a8a", ' rx="10" stroke="#60a5fa" stroke-width="2"');
      m += L.text(180, 96, "SILICON CHIP", {size: 13, color: "#93c5fd", weight: 700});
      var p;
      for(p = 0; p < 4; p += 1) m += L.rect(128 + p * 30, 200, 10, 22, "#94a3b8");
      var j, n2 = Math.round(st.drive / 10);
      for(j = 0; j < n2; j += 1){
        var x2 = 138 + (j % 5) * 25, y2 = 124 + Math.floor(j / 5) * 22;
        m += L.circle(x2, y2, 5, "#60a5fa");
      }
      m += L.text(180, 244, "carriers supplied from inside the crystal", {size: 12, color: C.muted});
    }
    m += L.text(500, 70, "CONTROL INPUT " + L.num(st.drive, 0) + " %", {size: 15, color: C.text, weight: 700});
    var barW = 260 * Math.min(1, P / 2);
    m += L.rect(400, 100, 260, 22, "#1e2d3d", ' rx="6"');
    m += L.rect(400, 100, barW, 22, P > 0.5 ? C.danger : C.ok, ' rx="6"');
    m += L.text(400, 145, "power P = V I = " + L.num(P, 2) + " W", {size: 16, color: P > 0.5 ? C.danger : C.ok, anchor: "start", weight: 700});
    m += L.text(400, 178, "supply voltage: " + info.V + " V", {size: 14, color: C.muted, anchor: "start"});
    m += L.text(400, 204, "current: " + L.num(I * 1000, 1) + " mA", {size: 14, color: C.muted, anchor: "start"});
    m += L.text(400, 250, info.source, {size: 13, color: "#93c5fd", anchor: "start"});
    L.svg(m, info.name + " controlling " + L.num(I * 1000, 1) + " milliamperes.", 290);
    L.readout([
      ["Device", info.name],
      ["Supply voltage", info.V + " V", info.V > 50 ? C.danger : C.ok],
      ["Current", L.num(I * 1000, 1) + " mA"],
      ["Power P = V I", L.num(P, 2) + " W", P > 0.5 ? C.danger : C.ok]
    ]);
    L.verdict("<b>" + info.name + ":</b> the control input sets the current, but the device is " + info.note + ".");
  }

  function select(id){
    st.device = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["tube", "Vacuum tube"], ["chip", "Transistor"]], st.device, select);
    L.controls(L.slider("t1-drive", "Control input", 0, 100, 5, st.drive, L.num(st.drive, 0) + " %"));
    L.onInput("t1-drive", function(v){ st.drive = v; L.setVal("t1-drive", L.num(v, 0) + " %"); draw(); });
    L.legend([["#60a5fa", "electron"], [C.danger, "high power"], [C.ok, "low power"]]);
    L.watch("Both devices throttle the same electron stream. Compare the supply voltage and the power each one burns at the same current.");
    draw();
  }

  window.SIMS.valvechip = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Energy-band explorer (NCERT §14.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {mat: "si", T: 300};
  var K = 8.617e-5; // eV per kelvin
  var MAT = {
    cu: {name: "Copper (metal)", Eg: 0, cls: "metal"},
    ge: {name: "Germanium", Eg: 0.7, cls: "semiconductor"},
    si: {name: "Silicon", Eg: 1.1, cls: "semiconductor"},
    gaas: {name: "Gallium arsenide", Eg: 1.43, cls: "semiconductor"},
    diamond: {name: "Diamond (carbon)", Eg: 5.4, cls: "insulator"}
  };

  function frac(m){
    if(m.Eg <= 0) return 1;
    return Math.exp(-m.Eg / (2 * K * st.T));
  }

  function draw(){
    var m = MAT[st.mat];
    var f = frac(m);
    var s = "";
    // left: band diagram
    if(m.Eg <= 0){
      s += L.rect(70, 110, 250, 70, "#1d4ed8", ' rx="6"');
      s += L.rect(70, 180, 250, 70, "#1d4ed8", ' rx="6"');
      s += L.text(195, 100, "CONDUCTION BAND (partly filled)", {size: 12, color: "#93c5fd"});
      s += L.text(195, 200, "VALENCE BAND", {size: 12, color: "#93c5fd"});
      s += L.text(195, 152, "bands overlap", {size: 15, color: C.ok, weight: 700});
      s += L.text(195, 275, "no gap: electrons move freely", {size: 13, color: C.muted});
    } else {
      s += L.rect(70, 75, 250, 55, "#1d4ed8", ' rx="6"');
      s += L.rect(70, 190, 250, 70, "#1d4ed8", ' rx="6"');
      s += L.text(195, 66, "CONDUCTION BAND (E > E_C)", {size: 12, color: "#93c5fd"});
      s += L.text(195, 210, "VALENCE BAND (E < E_V)", {size: 12, color: "#93c5fd"});
      s += L.arrow(195, 190, 195, 130, C.ok, 2);
      s += L.text(240, 162, "E_g = " + L.num(m.Eg, 2) + " eV", {size: 15, color: C.ok, weight: 700, anchor: "start"});
      var excited = f > 1e-12;
      if(excited){
        s += L.circle(120, 103, 8, "#38bdf8");
        s += L.text(120, 108, "−", {size: 12, color: "#fff"});
        s += L.circle(130, 225, 8, "rgba(248,113,113,.3)", ' stroke="' + C.danger + '" stroke-width="1.5"');
        s += L.text(130, 230, "+", {size: 12, color: C.danger});
        s += L.text(195, 275, "thermal excitation creates electron–hole pairs", {size: 12, color: C.muted});
      } else {
        s += L.text(195, 275, "thermal excitation is negligible at this temperature", {size: 12, color: C.muted});
      }
    }
    // right: temperature and carrier readout
    s += L.text(500, 70, "TEMPERATURE " + L.num(st.T, 0) + " K", {size: 15, color: C.text, weight: 700});
    s += L.rect(400, 90, 260, 14, "#1e2d3d", ' rx="5"');
    s += L.rect(400, 90, 260 * (st.T - 100) / 500, 14, C.ok, ' rx="5"');
    s += L.text(400, 135, "relative carrier number", {size: 13, color: C.muted, anchor: "start"});
    s += L.text(400, 165, "n_i ∝ e^(−E_g/2kT)", {size: 15, color: C.text, anchor: "start"});
    s += L.text(400, 205, sci(f, 2), {size: 24, color: f > 1e-6 ? C.ok : C.muted, anchor: "start", weight: 700});
    s += L.text(400, 245, "class: " + m.cls, {size: 15, color: "#93c5fd", anchor: "start"});
    L.svg(s, m.name + " energy bands with a gap of " + L.num(m.Eg, 2) + " electronvolts.", 300);
    L.readout([
      ["Material", m.name],
      ["Band gap E_g", m.Eg > 0 ? L.num(m.Eg, 2) + " eV" : "≈ 0 eV", m.Eg === 0 ? C.ok : C.text],
      ["Class", m.cls],
      ["Relative carriers", sci(f, 2), f > 1e-6 ? C.ok : C.muted],
      ["Temperature", L.num(st.T, 0) + " K"]
    ]);
    var msg;
    if(m.cls === "metal") msg = "<b>" + m.name + ":</b> the bands overlap, so electrons always have empty states. Conduction is easy at every temperature.";
    else if(m.cls === "insulator") msg = "<b>" + m.name + ":</b> the gap is wider than 3 eV. Even at " + L.num(st.T, 0) + " K the thermal excitation is negligible, so it stays an insulator.";
    else msg = "<b>" + m.name + ":</b> a small gap (E_g = " + L.num(m.Eg, 2) + " eV). Heating breaks more bonds, so the relative carrier number rises sharply with temperature.";
    L.verdict(msg);
  }

  function select(id){
    st.mat = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["cu", "Copper"], ["ge", "Germanium"], ["si", "Silicon"], ["gaas", "GaAs"], ["diamond", "Diamond"]], st.mat, select);
    L.controls(L.slider("t2-T", "Temperature", 100, 600, 10, st.T, L.num(st.T, 0) + " K"));
    L.onInput("t2-T", function(v){ st.T = v; L.setVal("t2-T", L.num(v, 0) + " K"); draw(); });
    L.legend([["#1d4ed8", "band"], [C.ok, "band gap"], ["#38bdf8", "electron"], [C.danger, "hole"]]);
    L.watch("Pick a material and raise the temperature. The gap is fixed; the number of thermally excited carriers changes with exp(−E_g/2kT).");
    draw();
  }

  window.SIMS.bandgap = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Intrinsic semiconductor: thermal generation (NCERT §14.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {T: 300, field: 0};
  var K = 8.617e-5, EG = 1.1;

  function ratio(){
    return Math.exp(-(EG / (2 * K)) * (1 / st.T - 1 / 300));
  }
  function pairCount(){
    var p = Math.round(2 * ratio());
    if(p < 0) p = 0;
    if(p > 6) p = 6;
    return p;
  }

  function draw(){
    var n = pairCount(), r = ratio();
    var m = "";
    var row, col, idx = 0;
    for(row = 0; row < 3; row += 1){
      for(col = 0; col < 4; col += 1){
        var x = 90 + col * 110, y = 80 + row * 62;
        m += L.circle(x, y, 14, "#334155");
        m += L.line(x + 14, y, x + 96, y, C.faint, 2);
        m += L.line(x, y + 14, x, y + 48, C.faint, 2);
        if(idx < n){
          m += L.circle(x + 26, y - 20, 6, "#38bdf8");
          m += L.circle(x - 20, y + 20, 8, "rgba(248,113,113,.25)", ' stroke="' + C.danger + '" stroke-width="1.5"');
          m += L.text(x - 20, y + 25, "+", {size: 12, color: C.danger, weight: 700});
          if(st.field){
            m += L.arrow(x + 30, y - 34, x + 58, y - 34, "#38bdf8", 2);
            m += L.arrow(x - 24, y + 34, x - 52, y + 34, C.danger, 2);
          }
        }
        idx += 1;
      }
    }
    m += L.text(360, 268, "broken bonds: " + n + "   ·   field: " + (st.field ? "on (I = I_e + I_h)" : "off"), {size: 14, color: C.muted});
    L.svg(m, "Lattice with " + n + " broken bonds creating electron-hole pairs.", 290);
    L.readout([
      ["Temperature", L.num(st.T, 0) + " K"],
      ["Pairs shown", String(n)],
      ["Electrons n_e", "equal to n_h", "#38bdf8"],
      ["Holes n_h", "equal to n_e", C.danger],
      ["Relative n_i", sci(r, 2), r > 1 ? C.ok : C.muted],
      ["Current", st.field ? "I_e + I_h" : "zero (no field)"]
    ]);
    L.verdict("<b>Thermal generation:</b> every broken bond gives exactly one free electron and one hole, so n<sub>e</sub> = n<sub>h</sub> = n<sub>i</sub>. " + (st.field ? "With the field on, electrons and holes drift in opposite directions and their currents add." : "With no field the carriers move randomly, so there is no net current."));
  }

  function select(id){
    st.field = Number(id);
    L.markPreset(String(st.field));
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["0", "No field"], ["1", "Field on"]], String(st.field), select);
    L.controls(L.slider("t3-T", "Temperature", 100, 500, 10, st.T, L.num(st.T, 0) + " K"));
    L.onInput("t3-T", function(v){ st.T = v; L.setVal("t3-T", L.num(v, 0) + " K"); draw(); });
    L.legend([["#38bdf8", "free electron"], [C.danger, "hole (missing bond electron)"], [C.faint, "covalent bond"]]);
    L.watch("Raise the temperature: more bonds break, creating pairs. Switch the field on to see both carrier types drift and add their currents.");
    draw();
  }

  window.SIMS.intrinsic = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Doping bench: donors, acceptors, carrier counts (NCERT §14.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {type: "intrinsic", ppm: 1};
  var HOST = 5e28, NI = 1.5e16;

  function counts(){
    var nd = HOST * st.ppm * 1e-6;
    if(st.type === "n" && st.ppm > 0){
      var ne = nd, nh = NI * NI / ne;
      return {ne: ne, nh: nh, maj: "electrons", worth: nd};
    }
    if(st.type === "p" && st.ppm > 0){
      var nhn = nd, nen = NI * NI / nhn;
      return {ne: nen, nh: nhn, maj: "holes", worth: nd};
    }
    return {ne: NI, nh: NI, maj: "balanced", worth: 0};
  }

  function draw(){
    var c = counts();
    var m = "";
    m += L.rect(90, 90, 540, 120, "#132033", ' rx="14" stroke="#475569" stroke-width="2"');
    var col, row, idx = 0;
    for(row = 0; row < 2; row += 1){
      for(col = 0; col < 6; col += 1){
        var x = 125 + col * 88, y = 120 + row * 62;
        var isDopant = (idx === 3 && st.type !== "intrinsic" && st.ppm > 0);
        m += L.circle(x, y, isDopant ? 15 : 11, isDopant ? (st.type === "n" ? "#b45309" : "#7c3aed") : "#334155");
        if(isDopant){
          m += L.text(x, y + 5, st.type === "n" ? "D" : "A", {size: 13, color: "#fff", weight: 700});
        }
        idx += 1;
      }
    }
    var i;
    var majColor = st.type === "p" ? C.danger : "#38bdf8";
    if(st.type === "intrinsic" || st.ppm === 0){
      for(i = 0; i < 4; i += 1){
        m += L.circle(150 + i * 130, 245, 7, "#38bdf8");
        m += L.text(150 + i * 130, 250, "−", {size: 12, color: "#fff", weight: 700});
        m += L.circle(215 + i * 130, 245, 7, C.danger);
        m += L.text(215 + i * 130, 250, "+", {size: 12, color: "#fff", weight: 700});
      }
    } else {
      var shown = Math.min(10, Math.max(1, Math.round(st.ppm * 2)));
      for(i = 0; i < shown; i += 1){
        m += L.circle(120 + i * 30, 245, 7, majColor);
        m += L.text(120 + i * 30, 250, st.type === "p" ? "+" : "−", {size: 12, color: "#fff", weight: 700});
      }
      m += L.circle(500, 245, 7, st.type === "p" ? "#38bdf8" : C.danger);
      m += L.text(500, 250, st.type === "p" ? "−" : "+", {size: 12, color: "#fff", weight: 700});
      m += L.text(516, 250, "minority", {size: 11, color: C.muted, anchor: "start"});
    }
    m += L.text(120, 75, st.type === "n" ? "DONOR ATOM (pentavalent)" : (st.type === "p" ? "ACCEPTOR ATOM (trivalent)" : "PURE CRYSTAL"), {size: 13, color: majColor, anchor: "start", weight: 700});
    L.svg(m, "Doped crystal with majority carriers.", 290);
    L.readout([
      ["Type", st.type === "n" ? "n-type" : (st.type === "p" ? "p-type" : "intrinsic"), st.type === "n" ? "#38bdf8" : (st.type === "p" ? C.danger : C.muted)],
      ["Dopant density", c.worth > 0 ? sci(c.worth, 1) + " m⁻³" : "0"],
      ["Electrons n_e", sci(c.ne, 1) + " m⁻³", c.maj === "electrons" ? "#38bdf8" : C.muted],
      ["Holes n_h", sci(c.nh, 1) + " m⁻³", c.maj === "holes" ? C.danger : C.muted],
      ["Majority carriers", c.maj, majColor]
    ]);
    var msg;
    if(c.maj === "balanced") msg = "<b>Intrinsic crystal:</b> no dopant, so n<sub>e</sub> = n<sub>h</sub> = n<sub>i</sub>. Add donors or acceptors with the slider.";
    else if(c.maj === "electrons") msg = "<b>n-type:</b> donor atoms supply electrons, so n<sub>e</sub> ≫ n<sub>h</sub>. The product n<sub>e</sub>n<sub>h</sub> = n<sub>i</sub>² is unchanged; the holes become the minority carriers.";
    else msg = "<b>p-type:</b> acceptor atoms leave holes, so n<sub>h</sub> ≫ n<sub>e</sub>. Again n<sub>e</sub>n<sub>h</sub> = n<sub>i</sub>², so the minority electron count falls as doping rises.";
    L.verdict(msg);
  }

  function select(id){
    st.type = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["intrinsic", "Intrinsic"], ["n", "n-type (donor)"], ["p", "p-type (acceptor)"]], st.type, select);
    L.controls(L.slider("t4-ppm", "Doping level", 0, 10, 0.5, st.ppm, L.num(st.ppm, 1) + " ppm"));
    L.onInput("t4-ppm", function(v){ st.ppm = v; L.setVal("t4-ppm", L.num(v, 1) + " ppm"); draw(); });
    L.legend([["#38bdf8", "free electron"], [C.danger, "hole"], ["#7c3aed", "acceptor"], ["#b45309", "donor"]]);
    L.watch("Switch between n-type and p-type and raise the doping level. One carrier grows with the dopant while the other falls as n_i²/dopant.");
    draw();
  }

  window.SIMS.doping = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — p-n junction formation: diffusion against drift (NCERT §14.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {progress: 100};

  function setProgress(v){
    st.progress = v;
    var el = document.getElementById("t5-p");
    if(el) el.value = v;
    L.setVal("t5-p", L.num(v, 0) + " %");
    draw();
  }

  function draw(){
    var p = st.progress;
    var barrier = 0.7 * p / 100;
    var depW = 20 + 110 * p / 100;
    var drift = 0.5 * p / 100, diff = 1 - drift;
    var m = "";
    m += L.rect(60, 70, 600, 190, "rgba(15,23,42,.4)", ' rx="12" stroke="#475569" stroke-width="1.5"');
    m += L.rect(60, 70, 270, 190, "rgba(248,113,113,.06)");
    m += L.rect(390, 70, 270, 190, "rgba(56,189,248,.06)");
    m += L.text(140, 55, "p-REGION (acceptor-doped)", {size: 14, color: C.danger, weight: 700});
    m += L.text(580, 55, "n-REGION (donor-doped)", {size: 14, color: "#38bdf8", weight: 700});
    m += L.rect(330 - depW / 2, 70, depW, 190, "rgba(148,163,184,.16)", ' stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 5"');
    m += L.text(330, 285, "depletion region ≈ " + L.num(0.10 * p / 100, 2) + " µm", {size: 13, color: C.muted});
    var i, k;
    for(i = 0; i < 4; i += 1){
      var xh = 120 + i * 40;
      m += L.circle(xh, 170, 8, C.danger);
      m += L.text(xh, 175, "+", {size: 12, color: "#fff", weight: 700});
    }
    for(i = 0; i < 4; i += 1){
      var xe = 540 + i * 40;
      m += L.circle(xe, 170, 8, "#1d4ed8");
      m += L.text(xe, 175, "−", {size: 12, color: "#fff"});
    }
    var ion;
    for(ion = 0; ion < Math.round(3 * p / 100); ion += 1){
      m += L.circle(330 - 18 - ion * 16, 150, 7, "rgba(248,113,113,.35)", ' stroke="' + C.danger + '" stroke-width="1.5"');
      m += L.text(330 - 18 - ion * 16, 155, "−", {size: 11, color: C.danger});
      m += L.circle(330 + 18 + ion * 16, 150, 7, "rgba(56,189,248,.35)", ' stroke="#38bdf8" stroke-width="1.5"');
      m += L.text(330 + 18 + ion * 16, 155, "+", {size: 11, color: "#38bdf8"});
    }
    if(diff > 0.02){
      m += L.arrow(300, 210, 300 + 50 * diff, 210, C.danger, 3);
      m += L.arrow(360, 210, 360 - 50 * diff, 210, "#38bdf8", 3);
      m += L.text(330, 232, "diffusion", {size: 12, color: C.muted});
    }
    if(drift > 0.02){
      m += L.arrow(300, 240, 300 + 50 * drift, 240, "#38bdf8", 3);
      m += L.arrow(360, 240, 360 - 50 * drift, 240, C.danger, 3);
      m += L.text(330, 262, "drift (junction field)", {size: 12, color: C.muted});
    }
    L.svg(m, "p-n junction at " + L.num(p, 0) + " percent formation.", 300);
    L.readout([
      ["Formation", L.num(p, 0) + " %"],
      ["Barrier V₀", L.num(barrier, 2) + " V", C.ok],
      ["Diffusion current", L.num(diff, 2) + " (relative)"],
      ["Drift current", L.num(drift, 2) + " (relative)"],
      ["Net current", L.num(diff - drift, 2) + " (relative)", Math.abs(diff - drift) < 0.01 ? C.ok : C.muted]
    ]);
    if(p >= 99) L.verdict("<b>Equilibrium:</b> diffusion and drift are equal, so the net current is zero. The depletion region and barrier potential are steady.");
    else if(p <= 1) L.verdict("<b>Just touching:</b> concentration gradients are large, so diffusion dominates and carriers pour across. The depletion region has not yet formed.");
    else L.verdict("<b>Forming:</b> as carriers diffuse, immobile ions build up, the field strengthens and drift grows. Equilibrium arrives when drift catches diffusion.");
  }

  function select(id){
    L.markPreset(id);
    setProgress(Number(id));
  }

  function mount(){
    labNoTimeline();
    L.presets([["0", "Just touching"], ["50", "Diffusing"], ["100", "Equilibrium"]], "100", select);
    L.controls(L.slider("t5-p", "Junction formation", 0, 100, 5, st.progress, L.num(st.progress, 0) + " %"));
    L.onInput("t5-p", function(v){ st.progress = v; L.setVal("t5-p", L.num(v, 0) + " %"); draw(); });
    L.legend([["#94a3b8", "depletion region"], [C.danger, "p-side / hole"], ["#38bdf8", "n-side / electron"]]);
    L.watch("Move the formation slider. Diffusion arrows shrink while the ion layers, field and drift current grow, until the junction reaches equilibrium.");
    draw();
  }

  window.SIMS.junction = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Forward-bias bench (NCERT §14.6.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {V: 0.5};
  var V0 = 0.7, VT = 0.05, IS = 1e-9;

  function setBias(v){
    st.V = v;
    var el = document.getElementById("t6-V");
    if(el) el.value = v;
    L.setVal("t6-V", L.num(v, 2) + " V");
    draw();
  }

  function draw(){
    var I = IS * (Math.exp(st.V / VT) - 1);
    var barrier = Math.max(V0 - st.V, 0);
    var rd = I > 1e-8 ? VT / I : null;
    var depW = 12 + 60 * barrier / V0;
    var m = "";
    m += L.rect(60, 60, 280, 200, "rgba(248,113,113,.06)", ' rx="12" stroke="#475569" stroke-width="1.5"');
    m += L.rect(380, 60, 280, 200, "rgba(56,189,248,.06)", ' rx="12" stroke="#475569" stroke-width="1.5"');
    m += L.text(200, 45, "p-SIDE → battery +", {size: 14, color: C.danger, weight: 700});
    m += L.text(520, 45, "n-SIDE → battery −", {size: 14, color: "#38bdf8", weight: 700});
    m += L.rect(340 - depW / 2, 80, depW + 40, 160, "rgba(148,163,184,.18)", ' stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 5"');
    m += L.text(360, 275, "depletion width shrinks as V rises", {size: 12, color: C.muted});
    var i;
    for(i = 0; i < 6; i += 1) m += L.circle(120 + i * 28, 150, 7, C.danger);
    for(i = 0; i < 6; i += 1) m += L.circle(450 + i * 28, 150, 7, "#1d4ed8");
    var frac = Math.min(1, I / 1.2e-3);
    m += L.arrow(300, 235, 300 + 30 + 120 * frac, 235, C.ok, 4);
    m += L.text(360, 258, "forward current " + (I >= 1e-3 ? L.num(I * 1000, 2) + " mA" : L.num(I * 1e6, 1) + " µA"), {size: 13, color: C.ok});
    L.svg(m, "Forward-biased junction at " + L.num(st.V, 2) + " volts.", 300);
    L.readout([
      ["Forward bias V", L.num(st.V, 2) + " V", C.ok],
      ["Barrier V₀ − V", L.num(barrier, 2) + " V", barrier > 0.2 ? C.muted : C.ok],
      ["Current (model)", I >= 1e-3 ? L.num(I * 1000, 2) + " mA" : L.num(I * 1e6, 1) + " µA", C.ok],
      ["Dynamic resistance", rd === null ? "—" : L.num(rd, 1) + " Ω"],
      ["State", st.V < 0.55 ? "below threshold" : "conducting", st.V < 0.55 ? C.muted : C.ok]
    ]);
    if(st.V < 0.55) L.verdict("<b>Below threshold:</b> the barrier is only slightly lowered, so few carriers have the energy to cross and the current is tiny — microamperes or less.");
    else if(st.V < 0.75) L.verdict("<b>At threshold:</b> the barrier is thin and low enough for a large flow. The current climbs exponentially and the dynamic resistance drops quickly.");
    else L.verdict("<b>Well past threshold:</b> the current is limited mainly by the external circuit. The small dynamic resistance means a small voltage change causes a large current change.");
  }

  function select(id){
    L.markPreset(id);
    setBias(Number(id));
  }

  function mount(){
    labNoTimeline();
    L.presets([["0.3", "0.30 V · below"], ["0.7", "0.70 V · threshold"], ["0.85", "0.85 V · strong"]], "0.5", select);
    L.controls(L.slider("t6-V", "Forward bias V", 0, 0.9, 0.05, st.V, L.num(st.V, 2) + " V"));
    L.onInput("t6-V", function(v){ st.V = v; L.setVal("t6-V", L.num(v, 2) + " V"); draw(); });
    L.legend([[C.danger, "p-side / hole"], ["#38bdf8", "n-side / electron"], [C.ok, "forward current"]]);
    L.watch("Raise the bias. The barrier V₀ − V and the depletion width fall, and the current rockets upward once the threshold near 0.7 V is passed.");
    draw();
  }

  window.SIMS.forwardbias = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — V-I tracer: forward knee, reverse saturation, breakdown (§14.6.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {V: 0.6};

  function current(V){
    if(V >= 0) return 1e-9 * (Math.exp(V / 0.05) - 1);
    if(V > -9.0) return -1e-6;
    return -1e-6 * Math.exp((-V - 9.0) / 0.5) * 200;
  }

  function setBias(v){
    st.V = v;
    var el = document.getElementById("t7-V");
    if(el) el.value = v;
    L.setVal("t7-V", L.num(v, 2) + " V");
    draw();
  }

  function yFor(I){
    var s = I < 0 ? -1 : 1;
    var mag = Math.min(1, Math.abs(I) / 1e-3);
    return 150 - s * 100 * Math.sqrt(mag);
  }

  function draw(){
    var I = current(st.V);
    var m = "";
    m += L.line(80, 150, 660, 150, C.muted, 1.5);
    m += L.line(360, 40, 360, 275, C.muted, 1.5);
    m += L.text(660, 140, "V", {size: 14, color: C.text, anchor: "end"});
    m += L.text(372, 50, "I", {size: 14, color: C.text, anchor: "start"});
    var step, x, y;
    var pts = "";
    for(step = -10; step <= 0.9; step += 0.05){
      x = 360 + step * 26;
      y = yFor(current(step));
      pts += (pts ? " " : "") + x + "," + y;
    }
    m += '<polyline points="' + pts + '" fill="none" stroke="#38bdf8" stroke-width="2.6"/>';
    m += L.text(500, 90, "forward knee ≈ 0.7 V", {size: 12, color: C.muted});
    m += L.text(180, 180, "reverse saturation ≈ 1 µA", {size: 12, color: C.muted});
    m += L.text(100, 240, "breakdown", {size: 12, color: C.danger});
    x = 360 + st.V * 26;
    y = yFor(I);
    m += L.circle(x, y, 7, C.ok);
    m += L.text(360 + st.V * 26, 285, "V = " + L.num(st.V, 2) + " V", {size: 13, color: C.ok});
    L.svg(m, "Diode V-I characteristic with operating point at " + L.num(st.V, 2) + " volts.", 300);
    var state = st.V >= 0.55 ? "forward conduction" : (st.V > -9 ? "reverse saturation" : "breakdown");
    var iText = Math.abs(I) >= 1e-3 ? L.num(I * 1000, 2) + " mA" : (Math.abs(I) >= 1e-6 ? L.num(I * 1e6, 2) + " µA" : L.num(I * 1e9, 1) + " nA");
    L.readout([
      ["Bias V", L.num(st.V, 2) + " V", st.V < 0 ? C.muted : C.ok],
      ["Current I", iText, st.V >= 0.55 ? C.ok : (st.V > -9 ? C.muted : C.danger)],
      ["State", state, state === "forward conduction" ? C.ok : (state === "breakdown" ? C.danger : C.muted)],
      ["Forward drop", "≈ 0.7 V (Si)", C.muted],
      ["Reverse current", "≈ 1 µA (flat)", C.muted]
    ]);
    if(state === "forward conduction") L.verdict("<b>Forward bias:</b> past the knee the current is exponential in voltage. The diode conducts strongly and its dynamic resistance ΔV/ΔI is small.");
    else if(state === "reverse saturation") L.verdict("<b>Reverse bias:</b> only minority carriers drift across, so the current is a tiny, nearly constant 1 µA — almost independent of the applied voltage.");
    else L.verdict("<b>Breakdown:</b> below the critical reverse voltage the field rips carriers loose and the current rises sharply. Ordinary diodes are not operated here without a current-limiting resistor.");
  }

  function select(id){
    L.markPreset(id);
    setBias(Number(id));
  }

  function mount(){
    labNoTimeline();
    L.presets([["-7", "Reverse −7 V"], ["0.6", "Forward 0.6 V"], ["-10", "Breakdown −10 V"]], "0.6", select);
    L.controls(L.slider("t7-V", "Bias V", -10, 0.9, 0.05, st.V, L.num(st.V, 2) + " V"));
    L.onInput("t7-V", function(v){ st.V = v; L.setVal("t7-V", L.num(v, 2) + " V"); draw(); });
    L.legend([["#38bdf8", "V–I curve"], [C.ok, "operating point"], [C.danger, "breakdown"]]);
    L.watch("Sweep the bias across the whole range. Compare the flat microampere reverse branch with the steep forward knee near 0.7 V.");
    draw();
  }

  window.SIMS.vitrace = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Half-wave rectifier bench (NCERT §14.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {Vm: 10, drop: 0.7};
  var F = 50, SPAN = 0.04, X0 = 70, X1 = 660, YC = 170, PP = 105;

  function draw(){
    var m = "";
    var i, t, vin, vout;
    m += L.line(X0, YC, X1, YC, C.faint, 1.5);
    m += L.line(X0, YC - PP, X0, YC + PP, C.faint, 1.5);
    var vscale = 13;
    var inPts = "", outPts = "", prevIn = false, prevOut = false;
    for(i = 0; i <= 240; i += 1){
      t = SPAN * i / 240;
      vin = st.Vm * Math.sin(2 * Math.PI * F * t);
      vout = Math.max(vin - st.drop, 0);
      var x = X0 + (X1 - X0) * i / 240;
      inPts += (i ? " " : "") + x + "," + (YC - vin / vscale * PP);
      outPts += (i ? " " : "") + x + "," + (YC - vout / vscale * PP);
      prevIn = true; prevOut = true;
    }
    m += '<polyline points="' + inPts + '" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 4"/>';
    m += '<polyline points="' + outPts + '" fill="none" stroke="#38bdf8" stroke-width="2.8"/>';
    m += L.text(X0, YC - PP - 12, "input (dashed) and half-wave output (solid)", {size: 12, color: C.muted, anchor: "start"});
    m += L.rect(80, 250, 560, 26, "rgba(30,45,61,.9)", ' rx="6"');
    m += L.text(360, 268, "negative half-cycle: diode reverse biased → no output", {size: 13, color: C.danger});
    L.svg(m, "Half-wave rectifier input and output waveforms.", 300);
    var peak = Math.max(st.Vm - st.drop, 0);
    L.readout([
      ["Input frequency", "50 Hz"],
      ["Output frequency", "50 Hz", C.ok],
      ["Peak output", L.num(peak, 2) + " V", peak > 0 ? C.ok : C.muted],
      ["Average output", L.num(peak / Math.PI, 2) + " V"],
      ["Diode drop", L.num(st.drop, 2) + " V"]
    ]);
    L.verdict("Only the half-cycles that forward bias the diode reach the load, so one pulse appears per input cycle: f<sub>out</sub> = f<sub>in</sub> = 50 Hz, but half the input is lost.");
  }

  function select(id){
    st.drop = Number(id);
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["0.7", "Silicon diode (0.7 V)"], ["0", "Ideal diode (0 V)"], ["0.3", "Germanium (0.3 V)"]], "0.7", select);
    L.controls(L.slider("t8-Vm", "Input peak voltage", 2, 12, 0.5, st.Vm, L.num(st.Vm, 1) + " V"));
    L.onInput("t8-Vm", function(v){ st.Vm = v; L.setVal("t8-Vm", L.num(v, 1) + " V"); draw(); });
    L.legend([["#94a3b8", "input a.c."], ["#38bdf8", "rectified output"]]);
    L.watch("The output follows the input only while the diode conducts. Lowering the diode drop raises the peak and average output.");
    draw();
  }

  window.SIMS.halfwave = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Full-wave rectifier with capacitor filter (NCERT §14.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {C: 1000, R: 1000}; // µF, Ω
  var VM = 12, F = 50, SPAN = 0.06, X0 = 70, X1 = 660, Y0 = 265, PP = 190;

  function samples(){
    var Cf = st.C * 1e-6, tau = st.R * Cf;
    var N = 600, dt = SPAN / N, out = [];
    var vcap = VM, i, t, vin, vout;
    for(i = 0; i <= N; i += 1){
      t = SPAN * i / N;
      vin = Math.abs(VM * Math.sin(2 * Math.PI * F * t));
      if(vin > vcap) vcap = vin; else vcap = vcap * Math.exp(-dt / tau);
      vout = vcap;
      out.push({t: t, vin: VM * Math.sin(2 * Math.PI * F * t), vout: vout});
    }
    return out;
  }

  function draw(){
    var s = samples();
    var m = "";
    m += L.line(X0, Y0, X1, Y0, C.faint, 1.5);
    m += L.line(X0, Y0 - PP, X0, Y0, C.faint, 1.5);
    var pos = "", rec = "";
    var vmax = 0, vmin = VM, i;
    var start = Math.floor(s.length * 2 / 3);
    for(i = 0; i < s.length; i += 1){
      var x = X0 + (X1 - X0) * i / (s.length - 1);
      pos += (i ? " " : "") + x + "," + (Y0 - s[i].vin / 14 * PP);
      rec += (i ? " " : "") + x + "," + (Y0 - s[i].vout / 14 * PP);
      if(i >= start){
        if(s[i].vout > vmax) vmax = s[i].vout;
        if(s[i].vout < vmin) vmin = s[i].vout;
      }
    }
    m += '<polyline points="' + pos + '" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4"/>';
    m += '<polyline points="' + rec + '" fill="none" stroke="#38bdf8" stroke-width="2.8"/>';
    m += L.text(X0, Y0 - PP - 12, "input (dashed) and filtered full-wave output (solid)", {size: 12, color: C.muted, anchor: "start"});
    L.svg(m, "Full-wave rectifier output with capacitor filter.", 300);
    var tau = st.R * st.C * 1e-6;
    var est = VM / (2 * F * st.R * st.C * 1e-6);
    L.readout([
      ["Ripple frequency", "100 Hz", C.ok],
      ["Time constant τ = R C", L.num(tau, 3) + " s"],
      ["Estimated ripple", L.num(est, 3) + " V"],
      ["Measured ripple", L.num(vmax - vmin, 3) + " V", (vmax - vmin) < 0.5 ? C.ok : C.muted],
      ["Filter capacitor", L.num(st.C, 0) + " µF"]
    ]);
    if(tau > 0.2) L.verdict("<b>Large time constant:</b> the capacitor barely discharges between peaks, so the output is almost steady d.c. close to the 12 V peak. Ripple ≈ V<sub>m</sub>/(2f R<sub>L</sub>C).");
    else L.verdict("<b>Small time constant:</b> the capacitor discharges quickly and the output looks like rectified humps with a large ripple. Increase C or R<sub>L</sub> to smooth it.");
  }

  function mount(){
    labNoTimeline();
    L.presets([["10", "Small C (10 µF)"], ["1000", "Typical C (1000 µF)"], ["2000", "Large C (2000 µF)"]], "1000", function(id){
      st.C = Number(id);
      var el = document.getElementById("t9-C");
      if(el) el.value = st.C;
      L.setVal("t9-C", L.num(st.C, 0) + " µF");
      L.markPreset(id);
      draw();
    });
    L.controls(
      L.slider("t9-C", "Filter capacitor", 10, 2000, 10, st.C, L.num(st.C, 0) + " µF") +
      L.slider("t9-R", "Load resistance", 100, 5000, 50, st.R, L.num(st.R, 0) + " Ω")
    );
    L.onInput("t9-C", function(v){ st.C = v; L.setVal("t9-C", L.num(v, 0) + " µF"); draw(); });
    L.onInput("t9-R", function(v){ st.R = v; L.setVal("t9-R", L.num(v, 0) + " Ω"); draw(); });
    L.legend([["#94a3b8", "input a.c."], ["#38bdf8", "filtered output"]]);
    L.watch("Both half-cycles are rectified (100 Hz pulses). The capacitor fills the gaps; larger C·R_L means smaller ripple and steadier d.c.");
    draw();
  }

  window.SIMS.fullwave = {mount: mount, draw: draw, select: function(){}, state: st};
})();
