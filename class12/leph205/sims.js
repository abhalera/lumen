// Class 12 Physics, Chapter 13 (leph205) — simulation labs.
// One lab per lesson, in the Lumen class-9 lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}
function supDigits(n){
  return String(n).split("").map(function(ch){
    if(ch === "-") return "⁻";
    return "⁰¹²³⁴⁵⁶⁷⁸⁹"["0123456789".indexOf(ch)];
  }).join("");
}
function sci(x, d){
  if(!isFinite(x) || x === 0) return LAB.num(x, d);
  var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10);
  return LAB.num(x / Math.pow(10, e), d) + " × 10" + supDigits(e);
}

// -------------------------------------------------------------------------
// Lab 1 — Atom vs nucleus scale (NCERT §13.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {ratio: 10000};

  function draw(){
    var m = "";
    var rx = 70, ry = 95, rw = 330, rh = 170;
    m += L.rect(rx, ry, rw, rh, "rgba(96,165,250,.06)", ' stroke="#60a5fa" stroke-width="2" rx="10"');
    m += L.text(rx + rw / 2, ry - 12, "ATOM (scaled to a 10 m classroom)", {size: 15, color: "#93c5fd", weight: 700});
    m += L.circle(rx + rw / 2, ry + rh / 2, 130, "none", ' stroke="#475569" stroke-width="1.5" stroke-dasharray="6 5"');
    var npx = Math.max(2, 130 / st.ratio * 400);
    m += L.circle(rx + rw / 2, ry + rh / 2, npx, C.danger);
    m += L.text(rx + rw / 2, ry + rh - 14, "nucleus: " + L.num(5 / st.ratio * 1000, 3) + " mm radius (not to scale)", {size: 12, color: C.muted});
    var zx = 470, zy = 180;
    m += L.line(rx + rw - 30, ry + rh / 2, zx - 6, zy, C.muted, 1.5, "4 4");
    m += L.circle(zx, zy, 60, "rgba(239,68,68,.15)", ' stroke="' + C.danger + '" stroke-width="2"');
    m += L.text(zx, zy + 5, "nucleus", {size: 14, color: C.danger, weight: 700});
    m += L.text(zx, zy + 92, "magnified view", {size: 13, color: C.muted});
    m += L.text(zx, zy + 112, "Z protons + N neutrons", {size: 12, color: C.muted});
    L.svg(m, "An atom scaled to a classroom with its nucleus as a pinhead.", 290);
    L.readout([
      ["Radius ratio R_atom/R_nucleus", L.num(Math.round(st.ratio), 0), "#93c5fd"],
      ["If atom is 10 m across", "nucleus radius " + L.num(5 / st.ratio * 1000, 3) + " mm", C.danger],
      ["Volume fraction", "1 / " + L.num(st.ratio, 0) + "³ ≈ 10⁻¹²", C.muted],
      ["Mass in the nucleus", "more than 99.9%", C.ok]
    ]);
    L.verdict("<b>Mostly empty:</b> the nucleus occupies about 10⁻¹² of the atom's volume, yet carries more than 99.9% of its mass. Making the atom bigger does not change the ratio — every atom is built the same way.");
  }

  function select(id){
    st.ratio = Number(id);
    var el = document.getElementById("t1-r");
    if(el){
      el.value = st.ratio;
      L.setVal("t1-r", L.num(st.ratio, 0));
    }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["10000", "Ratio 10⁴"], ["30000", "Ratio 3 × 10⁴"], ["100000", "Ratio 10⁵"]], "10000", select);
    L.controls('<div class="control-item"><label class="control-label" for="t1-r"><span>Radius ratio atom : nucleus</span><span class="val" id="t1-r-val">10000</span></label>' +
      '<input type="range" id="t1-r" min="2000" max="100000" step="1000" value="10000"></div>');
    L.onInput("t1-r", function(v){ st.ratio = Number(v); L.setVal("t1-r", L.num(st.ratio, 0)); draw(); });
    L.legend([["#475569", "atom boundary"], [C.danger, "nucleus"], ["#60a5fa", "classroom wall"]]);
    L.watch("Change the ratio. The nuclear dot is drawn as a minimum-size marker because it would be invisible at true scale.");
    draw();
  }

  window.SIMS.scale = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Isotopes and weighted average mass (NCERT §13.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PRESETS = {
    cl: {n1: "³⁵Cl", m1: 34.98, n2: "³⁷Cl", m2: 36.98, a1: 75.4},
    cu: {n1: "⁶³Cu", m1: 62.92960, n2: "⁶⁵Cu", m2: 64.92779, a1: 69.15},
    h:  {n1: "¹H", m1: 1.0078, n2: "²H", m2: 2.0141, a1: 99.99}
  };
  var st = {key: "cl", a1: 75.4};

  function p(){ return PRESETS[st.key]; }

  function draw(){
    var d = p();
    var a2 = 100 - st.a1;
    var avg = (st.a1 * d.m1 + a2 * d.m2) / 100;
    var m = "";
    var maxM = Math.max(d.m1, d.m2);
    var y0 = 225, hMax = 150;
    var h1 = d.m1 / maxM * hMax, h2 = d.m2 / maxM * hMax;
    m += L.rect(150, y0 - h1, 95, h1, "#60a5fa", ' rx="6"');
    m += L.rect(340, y0 - h2, 95, h2, "#f59e0b", ' rx="6"');
    m += L.text(197, y0 - h1 - 10, d.m1 + " u", {size: 14, color: "#93c5fd"});
    m += L.text(387, y0 - h2 - 10, d.m2 + " u", {size: 14, color: "#fcd34d"});
    m += L.text(197, y0 + 20, d.n1 + " · " + L.num(st.a1, 2) + "%", {size: 13, color: "#93c5fd"});
    m += L.text(387, y0 + 20, d.n2 + " · " + L.num(a2, 2) + "%", {size: 13, color: "#fcd34d"});
    var avgX = 540;
    var avgY = y0 - avg / maxM * hMax;
    m += L.line(500, y0, 500, y0 - hMax - 10, C.faint, 1.5);
    m += L.line(500, avgY, 560, avgY, C.ok, 3);
    m += L.text(avgX, avgY - 14, "average", {size: 13, color: C.ok, weight: 700});
    m += L.text(avgX, avgY + 6, L.num(avg, 3) + " u", {size: 16, color: C.ok, weight: 700});
    m += L.line(245, y0, 340, y0, C.muted, 2);
    m += L.text(292, y0 - 10, "mix", {size: 13, color: C.muted});
    L.svg(m, "Isotope masses with the weighted average for " + st.key + ".", 280);
    L.readout([
      ["Isotope 1", d.n1 + " = " + d.m1 + " u at " + L.num(st.a1, 2) + "%", "#93c5fd"],
      ["Isotope 2", d.n2 + " = " + d.m2 + " u at " + L.num(a2, 2) + "%", "#fcd34d"],
      ["Weighted average", L.num(avg, 3) + " u", C.ok],
      ["Chemistry", "identical for both isotopes", C.muted]
    ]);
    L.verdict("<b>Weighted average:</b> the measured atomic mass always lies between the isotope masses, pulled toward the more abundant one. At natural abundances, " + d.n1 + " and " + d.n2 + " average to " + L.num(avg, 3) + " u.");
  }

  function select(id){
    st.key = id;
    st.a1 = PRESETS[id].a1;
    var el = document.getElementById("t2-a");
    if(el){ el.value = st.a1; L.setVal("t2-a", L.num(st.a1, 2) + "%"); }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["cl", "Chlorine"], ["cu", "Copper"], ["h", "Hydrogen"]], "cl", select);
    L.controls('<div class="control-item"><label class="control-label" for="t2-a"><span>Abundance of isotope 1</span><span class="val" id="t2-a-val">75.40%</span></label>' +
      '<input type="range" id="t2-a" min="0" max="100" step="0.01" value="75.4"></div>');
    L.onInput("t2-a", function(v){ st.a1 = Number(v); L.setVal("t2-a", L.num(st.a1, 2) + "%"); draw(); });
    L.legend([["#60a5fa", "isotope 1"], ["#f59e0b", "isotope 2"], [C.ok, "average"]]);
    L.watch("Slide the abundance from 0 to 100% and watch the average mass sweep between the two isotope masses.");
    draw();
  }

  window.SIMS.massunit = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Nuclide builder (NCERT §13.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var NAMES = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca"];
  var REF = {Z: 6, N: 6, label: "C-12"};
  var st = {Z: 6, N: 8};

  function relation(){
    if(st.Z === REF.Z && st.N === REF.N) return "the reference nuclide itself";
    if(st.Z === REF.Z) return "isotope of " + REF.label + " (same Z)";
    if(st.Z + st.N === REF.Z + REF.N) return "isobar of " + REF.label + " (same A)";
    if(st.N === REF.N) return "isotone of " + REF.label + " (same N)";
    return "different nuclide from " + REF.label;
  }

  function draw(){
    var A = st.Z + st.N;
    var sym = NAMES[st.Z - 1] || "X";
    var cx = 250, cy = 160, R = 105;
    var m = "";
    m += L.circle(cx, cy, R, "rgba(96,165,250,.07)", ' stroke="#475569" stroke-width="1.5" stroke-dasharray="5 5"');
    var total = st.Z + st.N;
    for(var i = 0; i < total; i += 1){
      var a = i * 2.39996;
      var rr = 22 + 62 * Math.sqrt(i / Math.max(total, 1));
      var x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
      var isP = i < st.Z;
      m += L.circle(x, y, 8, isP ? C.danger : "#1d4ed8");
      m += L.text(x, y + 4, isP ? "+" : "", {size: 11, color: "#fff", weight: 700});
    }
    m += L.text(300, 60, sym + "-" + A, {size: 30, color: C.text, weight: 700, anchor: "start"});
    m += L.text(300, 92, "A = " + A + " = Z + N", {size: 16, color: C.muted, anchor: "start"});
    m += L.text(300, 124, "Z = " + st.Z + " protons", {size: 14, color: C.danger, anchor: "start"});
    m += L.text(300, 148, "N = " + st.N + " neutrons", {size: 14, color: "#93c5fd", anchor: "start"});
    m += L.text(300, 172, "electrons = " + st.Z, {size: 14, color: "#60a5fa", anchor: "start"});
    m += L.text(300, 196, "nuclear charge = +" + st.Z + "e", {size: 14, color: C.text, anchor: "start"});
    var rel = relation();
    m += L.text(60, 275, rel.charAt(0).toUpperCase() + rel.slice(1), {size: 13, color: C.ok, anchor: "start"});
    L.svg(m, "Nucleus of " + sym + "-" + A + " with " + st.Z + " protons and " + st.N + " neutrons.", 290);
    L.readout([
      ["Nuclide notation", "<sup>" + A + "</sup><sub>" + st.Z + "</sub>" + sym, C.ok],
      ["Protons Z", String(st.Z), C.danger],
      ["Neutrons N", String(st.N), "#93c5fd"],
      ["Mass number A", String(A)],
      ["Relation to " + REF.label, rel]
    ]);
    L.verdict("<b>" + sym + "-" + A + ":</b> " + st.Z + " protons and " + st.N + " neutrons. Isotopes share Z, isobars share A and isotones share N — this nuclide is " + rel + ".");
  }

  function readSliders(){
    st.Z = Number(document.getElementById("t3-z").value);
    st.N = Number(document.getElementById("t3-n").value);
    L.setVal("t3-z", String(st.Z));
    L.setVal("t3-n", String(st.N));
  }

  function select(id){
    var parts = id.split("-");
    st.Z = Number(parts[0]);
    st.N = Number(parts[1]);
    var ez = document.getElementById("t3-z"), en = document.getElementById("t3-n");
    if(ez){ ez.value = st.Z; }
    if(en){ en.value = st.N; }
    L.setVal("t3-z", String(st.Z));
    L.setVal("t3-n", String(st.N));
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["6-6", "C-12"], ["6-8", "C-14"], ["7-7", "N-14"], ["8-8", "O-16"], ["17-18", "Cl-35"], ["20-20", "Ca-40"]], "6-8", select);
    L.controls(
      '<div class="control-item"><label class="control-label" for="t3-z"><span>Proton number Z</span><span class="val" id="t3-z-val">6</span></label>' +
      '<input type="range" id="t3-z" min="1" max="20" step="1" value="6"></div>' +
      '<div class="control-item"><label class="control-label" for="t3-n"><span>Neutron number N</span><span class="val" id="t3-n-val">8</span></label>' +
      '<input type="range" id="t3-n" min="0" max="25" step="1" value="8"></div>'
    );
    L.onInput("t3-z", function(){ readSliders(); draw(); });
    L.onInput("t3-n", function(){ readSliders(); draw(); });
    L.legend([[C.danger, "proton"], ["#1d4ed8", "neutron"]]);
    L.watch("Build a nuclide: change Z to switch element, N to switch isotope. Compare with C-12 to see isotope, isobar and isotone relationships.");
    draw();
  }

  window.SIMS.nuclide = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Nuclear radius and density (NCERT §13.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {A: 56};

  function draw(){
    var A = st.A;
    var R = 1.2 * Math.pow(A, 1 / 3);
    var V = (4 / 3) * Math.PI * Math.pow(R * 1e-15, 3);
    var mass = A * 1.6605e-27;
    var rho = mass / V;
    var m = "";
    var cx = 220, cy = 155;
    var rpx = 10 + R * 4.5;
    m += L.circle(cx, cy, rpx, "rgba(239,68,68,.35)", ' stroke="' + C.danger + '" stroke-width="2"');
    m += L.text(cx, cy + 5, "A=" + A, {size: 16, color: "#fff", weight: 700});
    m += L.line(cx + rpx + 6, cy, cx + rpx + 60, cy, "#f59e0b", 1.5, "4 3");
    m += L.text(cx + rpx + 66, cy + 5, "R = " + L.num(R, 2) + " fm", {size: 14, color: "#f59e0b", anchor: "start"});
    var bx = 430, by = 90, bw = 230, bh = 26;
    m += L.text(bx, by - 12, "MASS ∝ A", {size: 13, color: C.muted, anchor: "start"});
    m += L.rect(bx, by, bw, bh, "#1e293b", ' rx="4"');
    m += L.rect(bx, by, Math.min(bw, A / 250 * bw), bh, "#60a5fa", ' rx="4"');
    m += L.text(bx, by + 44, "VOLUME ∝ A (since R ∝ A^⅓)", {size: 13, color: C.muted, anchor: "start"});
    m += L.rect(bx, by + 56, bw, bh, "#1e293b", ' rx="4"');
    m += L.rect(bx, by + 56, Math.min(bw, A / 250 * bw), bh, "#34d399", ' rx="4"');
    m += L.text(bx, by + 108, "DENSITY = mass/volume = constant", {size: 14, color: C.ok, anchor: "start", weight: 700});
    m += L.text(bx, by + 132, "ρ ≈ " + L.num(rho / 1e17, 2) + " × 10¹⁷ kg/m³", {size: 15, color: C.ok, anchor: "start"});
    L.svg(m, "Nucleus of mass number " + A + " with radius " + L.num(R, 2) + " femtometres.", 290);
    L.readout([
      ["Mass number A", String(A)],
      ["Radius R = 1.2A^⅓", L.num(R, 2) + " fm", "#f59e0b"],
      ["Volume", L.num(V * 1e45, 2) + " × 10⁻⁴⁵ m³"],
      ["Mass", L.num(mass * 1e27, 2) + " × 10⁻²⁷ kg"],
      ["Density", L.num(rho / 1e17, 2) + " × 10¹⁷ kg/m³", C.ok]
    ]);
    L.verdict("<b>Constant density:</b> whether A is 4 or 238, the density stays at about 2.3 × 10¹⁷ kg/m³. Nucleons are packed at the same spacing in every nucleus — nuclear matter behaves like an incompressible liquid.");
  }

  function select(id){
    st.A = Number(id);
    var el = document.getElementById("t4-a");
    if(el){ el.value = st.A; L.setVal("t4-a", String(st.A)); }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["1", "H-1"], ["4", "He-4"], ["12", "C-12"], ["56", "Fe-56"], ["197", "Au-197"], ["238", "U-238"]], "56", select);
    L.controls('<div class="control-item"><label class="control-label" for="t4-a"><span>Mass number A</span><span class="val" id="t4-a-val">56</span></label>' +
      '<input type="range" id="t4-a" min="1" max="250" step="1" value="56"></div>');
    L.onInput("t4-a", function(v){ st.A = Number(v); L.setVal("t4-a", String(st.A)); draw(); });
    L.legend([["#ef4444", "nucleus"], ["#60a5fa", "mass"], ["#34d399", "volume"]]);
    L.watch("Slide A. The radius grows as the cube root, so mass and volume grow together and density stays fixed.");
    draw();
  }

  window.SIMS.nuclearsize = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Mass–energy equivalence (NCERT §13.4.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {logm: 0};

  function draw(){
    var massG = Math.pow(10, st.logm);
    var massKg = massG / 1000;
    var E = massKg * 9e16;
    var meV = E / 1.6e-13;
    var tnt = E / 4.184e9;
    var tntMt = tnt / 1e6;
    var m = "";
    var cx = 210, cy = 160;
    var r = 26 + st.logm * 7;
    m += L.circle(cx, cy, r, "rgba(251,191,36,.25)", ' stroke="#fbbf24" stroke-width="2"');
    m += L.text(cx, cy + 5, "m", {size: 20, color: "#fde68a", weight: 700});
    for(var i = 0; i < 8; i += 1){
      var a = i * Math.PI / 4;
      m += L.arrow(cx + (r + 6) * Math.cos(a), cy + (r + 6) * Math.sin(a), cx + (r + 46) * Math.cos(a), cy + (r + 46) * Math.sin(a), "#f59e0b", 2);
    }
    m += L.text(cx, cy + 78, "E = mc²", {size: 20, color: C.text, weight: 700});
    var bx = 400, by = 100, bw = 270, bh = 28;
    m += L.text(bx, by - 12, "ENERGY SCALE (log10 E in joules)", {size: 12, color: C.muted, anchor: "start"});
    [0, 5, 10, 15, 20].forEach(function(e){
      var x = bx + e / 20 * bw;
      m += L.line(x, by, x, by + 10, C.muted, 1);
      m += L.text(x, by + 24, "10^" + e, {size: 10, color: C.muted});
    });
    var lx = bx + Math.max(0, Math.min(20, Math.log(E) / Math.LN10)) / 20 * bw;
    m += L.line(lx, by - 6, lx, by + 12, C.ok, 3);
    m += L.text(lx, by - 16, L.num(Math.log(E) / Math.LN10, 1), {size: 13, color: C.ok});
    m += L.text(bx, by + 80, "1 g of matter = " + L.num(9e13, 0) + " J", {size: 15, color: "#fbbf24", anchor: "start"});
    m += L.text(bx, by + 104, "= 25 million kWh of electricity", {size: 13, color: C.muted, anchor: "start"});
    m += L.text(bx, by + 128, "= " + L.num(tntMt, 1) + " million tonnes of TNT", {size: 13, color: C.muted, anchor: "start"});
    L.svg(m, "Mass " + L.num(massG, 3) + " grams converting to " + L.num(E, 2) + " joules.", 290);
    L.readout([
      ["Mass", L.num(massG, 3) + " g"],
      ["Energy E = mc²", L.num(E, 3) + " J", C.ok],
      ["In MeV", L.num(meV, 3) + " MeV"],
      ["In kWh", L.num(E / 3.6e6, 3) + " kWh"],
      ["TNT equivalent", L.num(tntMt, 3) + " million tonnes", C.danger]
    ]);
    L.verdict("<b>c² is huge:</b> even a milligram of matter corresponds to 9 × 10¹⁰ J. In nuclear reactions only a tiny fraction of the mass converts, yet the energy released still dwarfs anything chemistry can do.");
  }

  function select(id){
    st.logm = Number(id);
    var el = document.getElementById("t5-m");
    if(el){ el.value = st.logm; L.setVal("t5-m", "10^" + st.logm + " g"); }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["-3", "1 mg"], ["0", "1 g"], ["3", "1 kg"]], "0", select);
    L.controls('<div class="control-item"><label class="control-label" for="t5-m"><span>Mass (log scale)</span><span class="val" id="t5-m-val">10^0 g</span></label>' +
      '<input type="range" id="t5-m" min="-3" max="3" step="0.1" value="0"></div>');
    L.onInput("t5-m", function(v){ st.logm = Number(v); L.setVal("t5-m", "10^" + L.num(st.logm, 1) + " g"); draw(); });
    L.legend([["#fbbf24", "mass"], ["#f59e0b", "energy"], [C.ok, "energy scale"]]);
    L.watch("Move the mass slider across six orders of magnitude. The energy readout grows just as fast, multiplied by 9 × 10¹⁶.");
    draw();
  }

  window.SIMS.emc2 = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Mass defect and binding energy (NCERT §13.4.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var DATA = {
    he:  {label: "He-4", Z: 2, A: 4, M: 4.002603},
    c12: {label: "C-12", Z: 6, A: 12, M: 12.000000},
    o16: {label: "O-16", Z: 8, A: 16, M: 15.994915},
    fe:  {label: "Fe-56", Z: 26, A: 56, M: 55.934939},
    u:   {label: "U-235", Z: 92, A: 235, M: 235.043930}
  };
  var st = {key: "o16"};

  function draw(){
    var d = DATA[st.key];
    var N = d.A - d.Z;
    var constituent = d.Z * 1.007825 + N * 1.008665;
    var dm = constituent - d.M;
    var be = dm * 931.5;
    var m = "";
    var px = 70, py = 80;
    m += L.text(px, 46, "CONSTITUENTS: " + d.Z + " p + " + N + " n", {size: 14, color: C.muted, anchor: "start"});
    var x = px;
    for(var i = 0; i < d.A; i += 1){
      var col = i < d.Z ? C.danger : "#1d4ed8";
      m += L.rect(x, py, 9, 30, col, ' rx="2"');
      x += 11;
      if(i === 27){
        x = px;
        py += 34;
      }
    }
    var tx = px + 330;
    m += L.text(tx, 46, "ACTUAL NUCLEUS", {size: 14, color: C.muted, anchor: "start"});
    m += L.rect(tx, 80, 130, 52, "rgba(52,211,153,.25)", ' stroke="' + C.ok + '" stroke-width="2" rx="8"');
    m += L.text(tx + 65, 112, d.label, {size: 18, color: C.ok, weight: 700});
    m += L.text(px, 235, "Constituent mass = " + L.num(constituent, 6) + " u", {size: 15, color: C.text, anchor: "start"});
    m += L.text(px, 258, "Nuclear mass     = " + L.num(d.M, 6) + " u", {size: 15, color: C.text, anchor: "start"});
    m += L.text(px, 281, "Mass defect ΔM  = " + L.num(dm, 6) + " u  →  E_b = " + L.num(be, 2) + " MeV", {size: 15, color: C.ok, anchor: "start", weight: 700});
    L.svg(m, "Mass defect of " + d.label + ": constituents versus actual nucleus.", 300);
    L.readout([
      ["Nucleus", d.label + " (Z=" + d.Z + ", N=" + N + ")"],
      ["Constituent mass", L.num(constituent, 5) + " u"],
      ["Actual mass", L.num(d.M, 5) + " u"],
      ["Mass defect ΔM", L.num(dm, 5) + " u", "#f59e0b"],
      ["Binding energy", L.num(be, 2) + " MeV (" + L.num(be / d.A, 2) + " MeV/nucleon)", C.ok]
    ]);
    L.verdict("<b>" + d.label + ":</b> the assembled nucleus is " + L.num(dm, 5) + " u lighter than its parts. That missing mass is the binding energy " + L.num(be, 1) + " MeV — it would have to be supplied to pull the nucleus apart.");
  }

  function select(id){ st.key = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["he", "He-4"], ["c12", "C-12"], ["o16", "O-16"], ["fe", "Fe-56"], ["u", "U-235"]], "o16", select);
    L.legend([[C.danger, "proton"], ["#1d4ed8", "neutron"], [C.ok, "bound nucleus"]]);
    L.watch("Compare each nucleus with the sum of its free protons and neutrons. The heavier the binding, the bigger the missing mass.");
    draw();
  }

  window.SIMS.massdefect = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Binding energy per nucleon curve (NCERT §13.4.2–13.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PTS = [[2, 1.11], [4, 7.07], [12, 7.68], [16, 7.98], [24, 8.06], [56, 8.79], [89, 8.71], [120, 8.50], [170, 8.00], [238, 7.57]];
  var st = {A: 56};

  function interp(A){
    if(A <= PTS[0][0]) return PTS[0][1];
    for(var i = 1; i < PTS.length; i += 1){
      if(A <= PTS[i][0]){
        var a = PTS[i - 1], b = PTS[i];
        return a[1] + (b[1] - a[1]) * (A - a[0]) / (b[0] - a[0]);
      }
    }
    return PTS[PTS.length - 1][1];
  }

  function X(a){ return 60 + a / 250 * 590; }
  function Y(e){ return 250 - e / 9 * 200; }

  function draw(){
    var m = "";
    m += L.rect(60, 50, 590, 200, "rgba(148,163,184,.04)");
    m += L.rect(60, 50, X(30) - 60, 200, "rgba(96,165,250,.08)");
    m += L.rect(X(170), 50, 60 + 590 - X(170), 200, "rgba(239,68,68,.08)");
    m += L.text(X(15), 70, "FUSION", {size: 14, color: "#93c5fd", weight: 700});
    m += L.text(X(205), 70, "FISSION", {size: 14, color: "#fca5a5", weight: 700});
    m += L.line(60, Y(8), 650, Y(8), C.faint, 1.5, "6 5");
    m += L.text(56, Y(8) - 6, "8 MeV", {size: 12, color: C.muted, anchor: "end"});
    var path = "M" + X(PTS[0][0]) + " " + Y(PTS[0][1]);
    PTS.forEach(function(p){ path += " L" + X(p[0]) + " " + Y(p[1]); });
    m += '<path d="' + path + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';
    PTS.forEach(function(p){ m += L.circle(X(p[0]), Y(p[1]), 4, "#38bdf8"); });
    m += L.circle(X(56), Y(8.79), 7, C.ok);
    m += L.text(X(56), Y(8.79) - 16, "Fe-56 peak", {size: 12, color: C.ok, weight: 700});
    m += L.line(X(0), 262, X(250), 262, C.muted, 1.5);
    m += L.text(355, 284, "mass number A", {size: 13, color: C.muted});
    m += L.line(42, Y(0), 42, Y(9), C.muted, 1.5);
    m += L.text(20, Y(4.5), "E_bn", {size: 13, color: C.text});
    var px = X(st.A), py = Y(interp(st.A));
    m += L.line(px, 50, px, 250, "#f59e0b", 1.5, "4 4");
    m += L.circle(px, py, 6, "#f59e0b");
    L.svg(m, "Binding energy per nucleon curve with a marker at A = " + st.A + ".", 300);
    var e = interp(st.A);
    var region = st.A < 30 ? "light — fusion moves it up" : (st.A > 170 ? "heavy — fission moves it up" : "middle — already tightly bound");
    L.readout([
      ["Mass number A", String(st.A)],
      ["E_bn (curve)", L.num(e, 2) + " MeV/nucleon", "#38bdf8"],
      ["Region", region, C.ok],
      ["Energy-releasing path", st.A < 30 ? "fusion" : (st.A > 170 ? "fission" : "none (at the peak)" ), "#f59e0b"]
    ]);
    if(st.A < 30){
      L.verdict("<b>Light nucleus (A = " + st.A + "):</b> fusing it with another light nucleus climbs the steep part of the curve and releases energy — the process that powers stars.");
    } else if(st.A > 170){
      L.verdict("<b>Heavy nucleus (A = " + st.A + "):</b> splitting it into mid-mass fragments moves nucleons toward the peak and releases energy — the basis of fission reactors.");
    } else {
      L.verdict("<b>Mid-mass nucleus (A = " + st.A + "):</b> it already sits on the flat plateau near the peak. Neither fission nor fusion would release much energy; iron-56 is the endpoint of stellar fusion.");
    }
  }

  function select(id){ st.A = Number(id); L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["4", "He-4"], ["56", "Fe-56"], ["120", "A = 120"], ["238", "U-238"]], "56", select);
    L.controls('<div class="control-item"><label class="control-label" for="t7-a"><span>Mass number A</span><span class="val" id="t7-a-val">56</span></label>' +
      '<input type="range" id="t7-a" min="2" max="250" step="1" value="56"></div>');
    L.onInput("t7-a", function(v){ st.A = Number(v); L.setVal("t7-a", String(st.A)); draw(); });
    L.legend([["#38bdf8", "binding curve"], [C.ok, "iron peak"], ["#f59e0b", "current nucleus"]]);
    L.watch("Compare the three regions. Fusion is uphill for light nuclei, fission is downhill for heavy ones, and the middle is the flat plateau.");
    draw();
  }

  window.SIMS.bencurve = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Radioactive decay bench (NCERT §13.6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var MODES = {
    alpha: {name: "Alpha decay (α)", parent: {Z: 92, A: 238, X: "U"}, d: {Z: 90, A: 234, X: "Th"}, e: {Z: 2, A: 4, X: "He"}, power: "low (paper stops it)", note: "A decreases by 4 and Z by 2."},
    beta: {name: "Beta-minus decay (β⁻)", parent: {Z: 6, A: 14, X: "C"}, d: {Z: 7, A: 14, X: "N"}, e: {Z: -1, A: 0, X: "e⁻"}, power: "medium (few mm Al)", note: "Z increases by 1; A is unchanged."},
    positron: {name: "Beta-plus decay (β⁺)", parent: {Z: 11, A: 22, X: "Na"}, d: {Z: 10, A: 22, X: "Ne"}, e: {Z: 1, A: 0, X: "e⁺"}, power: "medium (annihilates)", note: "Z decreases by 1; A is unchanged."},
    gamma: {name: "Gamma decay (γ)", parent: {Z: 43, A: 99, X: "Tc*"}, d: {Z: 43, A: 99, X: "Tc"}, e: {Z: 0, A: 0, X: "γ"}, power: "high (needs lead)", note: "A and Z are unchanged; the nucleus loses energy."}
  };
  var st = {mode: "alpha"};

  function draw(){
    var d = MODES[st.mode];
    var m = "";
    function nucleus(x, y, nuc, col){
      var s = "";
      s += L.rect(x, y, 120, 90, "rgba(148,163,184,.08)", ' stroke="' + col + '" stroke-width="2" rx="10"');
      s += L.text(x + 60, y + 30, "<" + nuc.A + ">" + nuc.X, {size: 20, color: col, weight: 700});
      s += L.text(x + 60, y + 60, "Z = " + (nuc.Z < 0 ? "−1" : nuc.Z) + ", A = " + nuc.A, {size: 13, color: C.muted});
      return s;
    }
    m += nucleus(70, 120, d.parent, C.danger);
    m += L.arrow(205, 165, 285, 165, C.ok, 3);
    m += nucleus(300, 120, d.d, "#93c5fd");
    m += L.text(360, 240, "emitted: " + d.e.X + " (Z=" + (d.e.Z < 0 ? "−1" : d.e.Z) + ", A=" + d.e.A + ")", {size: 15, color: "#f59e0b", weight: 700});
    m += L.arrow(230, 220, 280, 220, "#f59e0b", 2.5);
    m += L.text(140, 70, d.name, {size: 19, color: C.text, weight: 700});
    m += L.text(480, 130, "A: " + d.parent.A + " = " + d.d.A + " + " + d.e.A, {size: 14, color: C.text, anchor: "start"});
    m += L.text(480, 155, "Z: " + d.parent.Z + " = " + d.d.Z + " + " + (d.e.Z < 0 ? "(−1)" : d.e.Z), {size: 14, color: C.text, anchor: "start"});
    m += L.text(480, 180, "Penetration: " + d.power, {size: 13, color: C.muted, anchor: "start"});
    L.svg(m, "Radioactive decay: " + d.name + ".", 290);
    L.readout([
      ["Decay type", d.name, C.ok],
      ["Parent", d.parent.X + "-" + d.parent.A + " (Z=" + d.parent.Z + ")"],
      ["Emitted", d.e.X + " (Z=" + (d.e.Z < 0 ? "−1" : d.e.Z) + ", A=" + d.e.A + ")", "#f59e0b"],
      ["Daughter", d.d.X + "-" + d.d.A + " (Z=" + d.d.Z + ")", "#93c5fd"],
      ["Rule", d.note]
    ]);
    L.verdict("<b>" + d.name + ":</b> " + d.note + " The emitted particle carries off the excess energy and charge, while A and Z balance on both sides of the equation.");
  }

  function select(id){ st.mode = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["alpha", "Alpha (α)"], ["beta", "Beta-minus (β⁻)"], ["positron", "Beta-plus (β⁺)"], ["gamma", "Gamma (γ)"]], "alpha", select);
    L.legend([[C.danger, "parent"], ["#93c5fd", "daughter"], ["#f59e0b", "emitted particle"]]);
    L.watch("Switch decay modes and check the conservation lines: A on the left equals A on the right, and the same for Z.");
    draw();
  }

  window.SIMS.decay = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Nuclear fission bench (NCERT §13.7.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CHANNELS = {
    ba: {name: "Ba-144 + Kr-89 + 3n", A1: 144, Z1: 56, A2: 89, Z2: 36, n: 3, Q: 200},
    sb: {name: "Sb-133 + Nb-99 + 4n", A1: 133, Z1: 51, A2: 99, Z2: 41, n: 4, Q: 200},
    xe: {name: "Xe-140 + Sr-94 + 2n", A1: 140, Z1: 54, A2: 94, Z2: 38, n: 2, Q: 200},
    fe: {name: "Fe-56 → 2 Al-28", A1: 28, Z1: 13, A2: 28, Z2: 13, n: 0, Q: -26.9, impossible: true}
  };
  var st = {key: "ba", mass: 1};

  function draw(){
    var d = CHANNELS[st.key];
    var m = "";
    m += L.circle(150, 150, 42, "rgba(239,68,68,.25)", ' stroke="' + C.danger + '" stroke-width="2"');
    m += L.text(150, 146, d.impossible ? "Fe-56" : "U-235", {size: 15, color: C.danger, weight: 700});
    m += L.text(150, 166, "+ n", {size: 13, color: C.muted});
    m += L.arrow(205, 150, 265, 150, C.ok, 3);
    m += L.circle(320, 115, 30, "rgba(96,165,250,.25)", ' stroke="#60a5fa" stroke-width="2"');
    m += L.text(320, 120, "A=" + d.A1, {size: 13, color: "#93c5fd", weight: 700});
    m += L.circle(320, 195, 24, "rgba(251,191,36,.25)", ' stroke="#fbbf24" stroke-width="2"');
    m += L.text(320, 200, "A=" + d.A2, {size: 13, color: "#fcd34d", weight: 700});
    for(var i = 0; i < d.n; i += 1){
      var a = -0.6 + i * 0.5;
      m += L.circle(400 + i * 26, 150 + (i % 2 ? -18 : 18), 8, "#34d399");
      m += L.text(400 + i * 26, 154 + (i % 2 ? -18 : 18), "n", {size: 11, color: "#052e16"});
    }
    m += L.text(360, 60, d.name, {size: 19, color: C.text, weight: 700});
    var checkA = d.impossible ? "A: 56 ≠ 28 + 28 + 0" : "A: 235 + 1 = " + d.A1 + " + " + d.A2 + " + " + d.n + " ✓";
    var checkZ = d.impossible ? "Z: 26 ≠ 13 + 13" : "Z: 92 = " + d.Z1 + " + " + d.Z2 + " ✓";
    m += L.text(360, 88, checkA, {size: 13, color: C.ok, weight: 700});
    m += L.text(360, 108, checkZ, {size: 13, color: C.ok, weight: 700});
    m += L.text(500, 150, "Q = " + L.num(d.Q, 1) + " MeV", {size: 20, color: d.Q > 0 ? C.ok : C.danger, weight: 700, anchor: "start"});
    m += L.text(500, 178, d.Q > 0 ? "exothermic" : "endothermic", {size: 14, color: d.Q > 0 ? C.ok : C.danger, anchor: "start"});
    L.svg(m, "Fission channel " + d.name + ".", 280);
    var atoms = st.mass / (d.impossible ? 56 : 235) * 6.023e23;
    var eMeV = atoms * Math.max(d.Q, 0);
    L.readout([
      ["Channel", d.name],
      ["Energy per fission", L.num(d.Q, 1) + " MeV", d.Q > 0 ? C.ok : C.danger],
      ["Fuel mass", L.num(st.mass, 1) + " g"],
      ["Fissions", sci(atoms, 2), C.muted],
      ["Total energy", d.Q > 0 ? sci(eMeV, 2) + " MeV (" + sci(eMeV * 1.6e-13, 2) + " J)" : "0 MeV", d.Q > 0 ? C.ok : C.danger]
    ]);
    if(d.impossible){
      L.verdict("<b>Not energetically possible:</b> Q is negative for Fe-56 → 2 Al-28. Splitting iron costs energy instead of releasing it, because the fragments are less tightly bound than the original nucleus.");
    } else {
      L.verdict("<b>Energy from fission:</b> " + L.num(d.Q, 0) + " MeV per nucleus, mostly carried as kinetic energy by the two fragments. The released neutrons can trigger further fissions — a chain reaction.");
    }
  }

  function select(id){ st.key = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["ba", "U-235 → Ba + Kr + 3n"], ["sb", "U-235 → Sb + Nb + 4n"], ["xe", "U-235 → Xe + Sr + 2n"], ["fe", "Fe-56 → 2 Al-28"]], "ba", select);
    L.controls('<div class="control-item"><label class="control-label" for="t9-m"><span>Mass of fuel</span><span class="val" id="t9-m-val">1.0 g</span></label>' +
      '<input type="range" id="t9-m" min="0.1" max="1000" step="0.1" value="1"></div>');
    L.onInput("t9-m", function(v){ st.mass = Number(v); L.setVal("t9-m", L.num(st.mass, 1) + " g"); draw(); });
    L.legend([[C.danger, "heavy nucleus"], ["#60a5fa", "fragment 1"], ["#fbbf24", "fragment 2"], ["#34d399", "neutrons"]]);
    L.watch("Choose a channel, verify the balance, then scale up the fuel mass to see macroscopic energy.");
    draw();
  }

  window.SIMS.fission = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 10 — Fusion bench (NCERT §13.7.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var REACTIONS = {
    pp: {eq: "¹H + ¹H → ²H + e⁺ + ν", Q: 0.42, name: "First p-p step"},
    dd1: {eq: "²H + ²H → ³He + n", Q: 3.27, name: "Deuterium fusion (helium-3)"},
    dd2: {eq: "²H + ²H → ³H + ¹H", Q: 4.03, name: "Deuterium fusion (tritium)"},
    net: {eq: "4 ¹H → ⁴He + 2e⁺ + 2ν", Q: 26.7, name: "Net p-p chain (the Sun)"}
  };
  var st = {key: "net", reactions: 3.0}; // in units of 1e23

  function draw(){
    var d = REACTIONS[st.key];
    var n = st.reactions * 1e23;
    var eMeV = n * d.Q;
    var m = "";
    var cx = 200, cy = 165;
    m += L.circle(cx, cy, 58, "rgba(251,191,36,.20)", ' stroke="#fbbf24" stroke-width="2"');
    m += L.circle(cx, cy, 40, "rgba(251,191,36,.25)");
    m += L.text(cx, cy + 6, "fuse", {size: 20, color: "#fde68a", weight: 700});
    for(var i = 0; i < 8; i += 1){
      var a = i * Math.PI / 4;
      m += L.arrow(cx + 70 * Math.cos(a), cy + 70 * Math.sin(a), cx + 100 * Math.cos(a), cy + 100 * Math.sin(a), "#f59e0b", 2);
    }
    m += L.text(400, 80, d.name, {size: 17, color: C.text, weight: 700, anchor: "start"});
    m += L.text(400, 112, d.eq, {size: 19, color: C.ok, anchor: "start", weight: 700});
    m += L.text(400, 146, "Q = " + L.num(d.Q, 2) + " MeV per reaction", {size: 15, color: "#fbbf24", anchor: "start"});
    var bx = 400, by = 175, bw = 260, bh = 24;
    var frac = Math.min(1, Math.log(eMeV) / Math.log(1e25));
    m += L.rect(bx, by, bw, bh, "#1e293b", ' rx="4"');
    m += L.rect(bx, by, Math.max(4, frac * bw), bh, C.ok, ' rx="4"');
    m += L.text(bx, by + 48, "Energy: " + L.num(eMeV, 2) + " MeV", {size: 15, color: C.ok, anchor: "start"});
    m += L.text(bx, by + 72, "= " + L.num(eMeV * 1.6e-13, 2) + " J", {size: 13, color: C.muted, anchor: "start"});
    L.svg(m, "Fusion reaction " + d.name + " releasing " + L.num(eMeV, 2) + " MeV.", 290);
    L.readout([
      ["Reaction", d.name, C.ok],
      ["Equation", d.eq],
      ["Q per reaction", L.num(d.Q, 2) + " MeV", "#fbbf24"],
      ["Number of reactions", sci(n, 2), C.muted],
      ["Total energy", sci(eMeV, 2) + " MeV (" + sci(eMeV * 1.6e-13, 2) + " J)", C.ok]
    ]);
    if(st.key === "net"){
      L.verdict("<b>The Sun's engine:</b> four protons become one helium nucleus and release 26.7 MeV. The Sun completes about 10³⁸ of these reactions every second, converting roughly 600 million tonnes of hydrogen into helium.");
    } else if(st.key === "pp"){
      L.verdict("<b>First step:</b> two protons fuse into a deuteron, emitting a positron and a neutrino. This weak-interaction step is so slow that it sets the pace of the Sun's entire energy output.");
    } else {
      L.verdict("<b>Deuterium fusion:</b> two deuterons fuse by the strong force, releasing " + L.num(d.Q, 2) + " MeV. This reaction is the easiest to achieve in the laboratory because the Coulomb barrier is relatively low.");
    }
  }

  function select(id){ st.key = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["pp", "p-p first step (0.42 MeV)"], ["dd1", "D + D → ³He + n (3.27 MeV)"], ["dd2", "D + D → ³H + p (4.03 MeV)"], ["net", "Net p-p chain (26.7 MeV)"]], "net", select);
    L.controls('<div class="control-item"><label class="control-label" for="t10-n"><span>Number of reactions (×10²³)</span><span class="val" id="t10-n-val">3.0</span></label>' +
      '<input type="range" id="t10-n" min="0.1" max="10" step="0.1" value="3"></div>');
    L.onInput("t10-n", function(v){ st.reactions = Number(v); L.setVal("t10-n", L.num(st.reactions, 1)); draw(); });
    L.legend([["#fbbf24", "fusing nuclei"], ["#f59e0b", "energy released"], [C.ok, "products"]]);
    L.watch("Pick a reaction and scale the number of events. Compare the tiny Q of the first p-p step with the 26.7 MeV of the full chain.");
    draw();
  }

  window.SIMS.fusion = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 11 — Controlled thermonuclear fusion (NCERT §13.7.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {logT: 8};
  var BARRIER = 400; // keV for two protons

  function draw(){
    var T = Math.pow(10, st.logT);
    var kev = 1.5 * 8.617e-8 * T; // average kinetic energy in keV
    var ratio = kev / BARRIER;
    var m = "";
    var cx = 220, cy = 165;
    var glow = Math.max(0.06, Math.min(0.85, st.logT / 12));
    m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="140" ry="80" fill="none" stroke="#475569" stroke-width="6"/>';
    m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="118" ry="62" fill="none" stroke="#334155" stroke-width="2"/>';
    m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="96" ry="46" fill="rgba(244,114,182,' + glow.toFixed(2) + ')"/>';
    m += L.text(cx, cy + 5, "PLASMA", {size: 18, color: "#fbcfe8", weight: 700});
    m += L.text(cx, cy + 108, "confined by magnetic field", {size: 13, color: C.muted});
    var bx = 420, by = 110, bw = 250;
    m += L.text(bx, by - 16, "AVERAGE KINETIC ENERGY", {size: 12, color: C.muted, anchor: "start"});
    m += L.rect(bx, by, bw, 20, "#1e293b", ' rx="4"');
    var frac = Math.max(0, Math.min(1, ratio));
    m += L.rect(bx, by, frac * bw, 20, ratio >= 1 ? C.ok : "#f59e0b", ' rx="4"');
    m += L.line(bx + bw, by - 6, bx + bw, by + 26, C.danger, 2);
    m += L.text(bx, by + 42, "Barrier: " + BARRIER + " keV", {size: 13, color: C.danger, anchor: "start"});
    m += L.text(bx, by + 66, "Average KE: " + L.num(kev, 1) + " keV", {size: 14, color: ratio >= 1 ? C.ok : "#fbbf24", anchor: "start"});
    m += L.text(bx, by + 94, "Temperature: " + L.num(st.logT, 1) + " on the log scale", {size: 13, color: C.muted, anchor: "start"});
    m += L.text(bx, by + 118, ratio >= 1 ? "Classically able to fuse" : "Only the high-energy tail fuses", {size: 14, color: ratio >= 1 ? C.ok : C.muted, anchor: "start"});
    L.svg(m, "Tokamak plasma at 10^" + L.num(st.logT, 1) + " kelvin.", 300);
    L.readout([
      ["Temperature T", L.num(T, 2) + " K", "#fbcfe8"],
      ["Average KE (3/2)kT", L.num(kev, 1) + " keV", ratio >= 1 ? C.ok : "#fbbf24"],
      ["Coulomb barrier", BARRIER + " keV", C.danger],
      ["Ratio KE/barrier", L.num(ratio, 2), ratio >= 1 ? C.ok : C.muted],
      ["Reactor state", st.logT < 7 ? "too cold" : (st.logT < 8.6 ? "reactor regime (tunnelling)" : (ratio >= 1 ? "classical ignition" : "approaching ignition")), st.logT < 7 ? C.muted : C.ok]
    ]);
    if(st.logT < 7){
      L.verdict("<b>Too cold:</b> the ions have too little energy to tunnel through the Coulomb barrier. The Sun's core (1.5 × 10⁷ K) sits in this regime too, but its enormous gravity keeps the plasma together long enough for the rare high-energy protons to fuse.");
    } else if(ratio < 1){
      L.verdict("<b>Reactor regime:</b> at 10⁸ K the average energy is still below the 400 keV barrier, but the high-energy tail of the distribution tunnels through. This is the operating regime of tokamaks such as ITER.");
    } else {
      L.verdict("<b>Classical ignition:</b> the average proton can now climb the 400 keV Coulomb barrier directly. Such temperatures exceed even the Sun's core, which is why fusion devices must rely on magnetic confinement rather than gravity.");
    }
  }

  function select(id){
    st.logT = Number(id);
    var el = document.getElementById("t11-t");
    if(el){ el.value = st.logT; L.setVal("t11-t", "10^" + L.num(st.logT, 1) + " K"); }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["7.18", "Sun's core (1.5 × 10⁷ K)"], ["8", "Tokamak (10⁸ K)"], ["9.5", "Classical threshold (3 × 10⁹ K)"]], "8", select);
    L.controls('<div class="control-item"><label class="control-label" for="t11-t"><span>Temperature (log scale)</span><span class="val" id="t11-t-val">10^8.0 K</span></label>' +
      '<input type="range" id="t11-t" min="6" max="10" step="0.1" value="8"></div>');
    L.onInput("t11-t", function(v){ st.logT = Number(v); L.setVal("t11-t", "10^" + L.num(st.logT, 1) + " K"); draw(); });
    L.legend([["#f472b6", "plasma"], [C.danger, "Coulomb barrier"], [C.ok, "fusion-ready"]]);
    L.watch("Slide the temperature from 10⁶ K to 10¹⁰ K. Watch when the average kinetic energy approaches the 400 keV barrier.");
    draw();
  }

  window.SIMS.plasma = {mount: mount, draw: draw, select: select, state: st};
})();
