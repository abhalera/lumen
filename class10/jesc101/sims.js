// Class 10 Science, Chapter 1 (jesc101) — simulation labs.
// Every scenario uses the NCERT textbook reaction unless the label says otherwise.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function parseFormula(f){
  var counts = {};
  function add(el, n){ counts[el] = (counts[el] || 0) + n; }
  function walk(str, mul){
    var re = /([A-Z][a-z]?)(\d*)|\(([^)]+)\)(\d*)/g, m;
    while((m = re.exec(str))){
      if(m[1]) add(m[1], mul * (m[2] ? +m[2] : 1));
      else walk(m[3], mul * (m[4] ? +m[4] : 1));
    }
  }
  walk(String(f).replace(/\s/g, ""), 1);
  return counts;
}
function scaleCounts(c, n){
  var o = {};
  Object.keys(c).forEach(function(k){ o[k] = c[k] * n; });
  return o;
}
function addCounts(a, b){
  var o = {};
  Object.keys(a).concat(Object.keys(b)).forEach(function(k){ o[k] = (a[k] || 0) + (b[k] || 0); });
  return o;
}
function sideCounts(terms){
  return terms.reduce(function(acc, t){ return addCounts(acc, scaleCounts(parseFormula(t.f), t.n)); }, {});
}
function fmtSub(s){ return String(s).replace(/(\d+)/g, "<tspan font-size='12' dy='4'>$1</tspan><tspan dy='-4'></tspan>"); }
function eqText(terms){
  return terms.map(function(t){ return (t.n === 1 ? "" : t.n) + t.f; }).join(" + ");
}

function atomTable(lhs, rhs){
  var L = sideCounts(lhs), R = sideCounts(rhs);
  var els = Object.keys(L).concat(Object.keys(R)).filter(function(e, i, a){ return a.indexOf(e) === i; }).sort();
  var ok = els.every(function(e){ return (L[e] || 0) === (R[e] || 0); });
  var rows = els.map(function(e){
    var a = L[e] || 0, b = R[e] || 0, match = a === b;
    return "<tr" + (match ? "" : ' class="pending"') + "><td>" + e + "</td><td>" + a + "</td><td>" + b + "</td></tr>";
  }).join("");
  return {
    ok: ok,
    html: '<table class="lab-table"><caption>Atoms on each side</caption><thead><tr><th>Element</th><th>LHS</th><th>RHS</th></tr></thead><tbody>' + rows + "</tbody></table>"
  };
}

function drawBeaker(x, y, fill, label, extra){
  var L = LAB;
  extra = extra || "";
  return L.rect(x, y, 90, 110, fill, ' rx="8"') +
    L.rect(x + 6, y - 14, 78, 18, "#1e293b", ' rx="4"') +
    L.text(x + 45, y + 128, label, {size: 13, color: L.C.muted}) + extra;
}

// -------------------------------------------------------------------------
// Lab 1 — Signs of a chemical reaction (Activities 1.1, 1.2, 1.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "mg"};

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 4, step: 0.2, speed: 0.8});
    var w = {
      mg: "Activity 1.1. The magnesium ribbon burns with a dazzling white flame. Collect the white ash in the watch-glass.",
      ki: "Activity 1.2. Mix lead nitrate and potassium iodide. Watch the colour of the mixture.",
      zn: "Activity 1.3. Zinc granules in dilute sulphuric acid. Watch for bubbles, then touch the flask (in a real lab)."
    };
    L.watch(w[id]);
    L.legend([[ "#fbbf24", "heat / flame" ], [ "#38bdf8", "gas" ], [ "#facc15", "precipitate" ], [ "#e2e8f0", "solid product" ]]);
    L.controls("");
    L.restart(true);
  }

  function draw(t){
    var p = Math.min(1, t / 4), m = "";
    if(st.preset === "mg"){
      m += L.rect(40, 220, 280, 18, "#78716c");
      m += L.rect(200, 200, 140, 12, "#cbd5e1") + L.text(270, 194, "watch-glass", {size: 12, color: C.muted});
      m += L.rect(80, 80, 18, 140, "#475569") + L.text(70, 240, "tongs", {size: 12, color: C.muted, anchor: "end"});
      var flame = 20 + 50 * p;
      m += L.circle(160, 90, flame, "rgba(253,224,71,0.45)");
      m += L.rect(148, 70, 24, 90, "#a8a29e") + L.text(160, 60, "Mg ribbon", {size: 13, color: C.text});
      if(p > 0.3) m += L.circle(270, 196, 6 + 10 * p, "#f8fafc") + L.text(270, 176, "white MgO ash", {size: 13, color: C.text});
      L.readout([["Observation", "dazzling white flame"], ["Product", "white powder, MgO"], ["Signs", "light, heat, new solid"]]);
      L.verdict(p >= 1
        ? "<b>Activity 1.1:</b> magnesium burns in air with a <b>dazzling white flame</b> and forms a <b>white powder</b>, magnesium oxide. Signs: change of colour/state and a large change in temperature."
        : "The ribbon is burning. Heat and light are given out.");
    } else if(st.preset === "ki"){
      m += drawBeaker(160, 90, "#e0f2fe", "Pb(NO₃)₂(aq)");
      m += drawBeaker(360, 90, "#fef9c3", "KI(aq)");
      m += L.arrow(260, 145, 350, 145, C.ok, 3);
      var mix = "rgb(" + Math.round(250 - 40 * p) + "," + Math.round(234 - 80 * p) + "," + Math.round(80 + 20 * p) + ")";
      m += L.rect(520, 90, 90, 110, mix, ' rx="8"');
      if(p > 0.2) m += L.circle(565, 175, 8 + 18 * p, "#eab308");
      m += L.text(565, 218, "mixture", {size: 13, color: C.muted});
      L.readout([["Precipitate", "yellow"], ["Compound", "lead iodide, PbI₂"], ["Sign", "change in colour"]]);
      L.verdict(p >= 1
        ? "<b>Activity 1.2:</b> a <b>yellow precipitate</b> of lead iodide forms. That colour change is evidence of a chemical reaction (and of double displacement, which you meet later)."
        : "The two solutions are mixing. Watch for a yellow solid.");
    } else {
      m += L.rect(240, 70, 160, 180, "#1e293b", ' rx="18" stroke="#64748b" stroke-width="4"');
      m += L.rect(255, 140, 130, 95, "rgba(56,189,248,0.25)", ' rx="8"');
      m += L.rect(300, 200, 40, 18, "#94a3b8") + L.text(320, 228, "Zn granules", {size: 13, color: C.text});
      for(var i = 0; i < 8; i++){
        var by = 190 - p * (40 + (i % 3) * 18) - (i * 7);
        m += L.circle(280 + (i % 4) * 22, by, 5, "#7dd3fc");
      }
      L.readout([["Gas", "hydrogen, H₂"], ["Flask", "becomes warm"], ["Signs", "evolution of a gas; change in temperature"]]);
      L.verdict(p >= 1
        ? "<b>Activity 1.3:</b> bubbles of <b>hydrogen</b> form around the zinc, and the flask <b>becomes warm</b>. Signs: evolution of a gas and a change in temperature. Zn + H₂SO₄ → ZnSO₄ + H₂."
        : "Bubbles are forming around the zinc granules.");
    }
    L.svg(m, "NCERT Activity " + st.preset, 300);
  }

  function mount(){
    L.presets([["mg", "Activity 1.1: Mg ribbon"], ["ki", "Activity 1.2: yellow ppt"], ["zn", "Activity 1.3: Zn + acid"]], st.preset, select);
    select(st.preset);
    App.pause();
    App.resetTimeline();
  }
  window.SIMS.signs = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Word-equations and skeletal equations (Eq. 1.1–1.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "mgword"};
  var RX = {
    mgword: {
      word: "Magnesium + Oxygen → Magnesium oxide",
      chem: "Mg + O₂ → MgO",
      note: "Eq. (1.1) then (1.2). This formula equation is skeletal: Mg atoms 1 vs 1, O atoms 1 vs 1? Count them.",
      lhs: [{n:1,f:"Mg"},{n:1,f:"O2"}], rhs: [{n:1,f:"MgO"}],
      tag: "skeletal"
    },
    skeletal: {
      word: "Same reaction, atom count of Eq. (1.2)",
      chem: "Mg + O₂ → MgO",
      note: "LHS has 2 oxygen atoms (O₂), RHS has 1 (MgO). Mass is not conserved, so the equation is unbalanced.",
      lhs: [{n:1,f:"Mg"},{n:1,f:"O2"}], rhs: [{n:1,f:"MgO"}],
      tag: "skeletal"
    },
    znword: {
      word: "Zinc + Sulphuric acid → Zinc sulphate + Hydrogen",
      chem: "Zn + H₂SO₄ → ZnSO₄ + H₂",
      note: "Eq. (1.3). Atom counts already match, so this one is balanced.",
      lhs: [{n:1,f:"Zn"},{n:1,f:"H2SO4"}], rhs: [{n:1,f:"ZnSO4"},{n:1,f:"H2"}],
      tag: "balanced"
    }
  };

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 3, step: 0.25, speed: 0.6});
    L.watch("The word-equation is a sentence. Replacing names with formulae gives a chemical equation. Then count atoms.");
    L.legend([[C.ok, "balanced"], [C.danger, "unbalanced / skeletal"]]);
    L.controls("");
    L.restart(true);
  }

  function draw(t){
    var r = RX[st.preset];
    var tab = atomTable(r.lhs, r.rhs);
    var m = L.text(360, 50, r.word, {size: 16, weight: 700}) +
      L.text(360, 88, r.chem, {size: 22, weight: 700, color: tab.ok ? C.ok : C.danger, mono: true}) +
      L.text(360, 130, tab.ok ? "This chemical equation is balanced." : "This chemical equation is skeletal (unbalanced).", {size: 16, color: tab.ok ? C.ok : C.danger}) +
      L.text(360, 170, "Reactants on the LHS; products on the RHS; the arrow points to the products.", {size: 14, color: C.muted});
    L.svg(m, r.chem, 300);
    L.readoutHTML(tab.html);
    L.verdict("<b>" + r.chem + "</b> is <b>" + r.tag + "</b>. " + r.note);
  }

  function mount(){
    L.presets([["mgword", "Eq. 1.1: word-equation"], ["skeletal", "Eq. 1.2: skeletal Mg + O₂"], ["znword", "Eq. 1.3: Zn + H₂SO₄"]], st.preset, select);
    select(st.preset);
    App.pause(); App.resetTimeline();
  }
  window.SIMS.wordeq = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Hit-and-trial balancing (Eq. 1.4–1.10)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "steam", n: [3,4,1,4]};
  var RX = {
    steam: {lhs:["Fe","H2O"], rhs:["Fe3O4","H2"], target:[3,4,1,4], label:"3Fe + 4H₂O → Fe₃O₄ + 4H₂", note:"Eq. (1.9). Water is steam, so H₂O(g) in Eq. (1.10)."},
    skeletalFe: {lhs:["Fe","H2O"], rhs:["Fe3O4","H2"], target:[1,1,1,1], label:"Fe + H₂O → Fe₃O₄ + H₂", note:"Eq. (1.4), the unbalanced starting point. Do not change anything inside a formula."},
    hcl: {lhs:["H2","Cl2"], rhs:["HCl"], target:[1,1,2,1], label:"H₂ + Cl₂ → 2HCl", note:"In-text Q2(i). Two HCl molecules put two H and two Cl on the RHS."},
    na: {lhs:["Na","H2O"], rhs:["NaOH","H2"], target:[2,2,2,1], label:"2Na + 2H₂O → 2NaOH + H₂", note:"In-text Q2(iii). Sodium + water."}
  };

  function terms(id, n){
    var r = RX[id];
    return {
      lhs: r.lhs.map(function(f,i){ return {n: n[i], f: f}; }),
      rhs: r.rhs.map(function(f,i){ return {n: n[r.lhs.length + i], f: f}; })
    };
  }
  function applyTarget(id){
    var t = RX[id].target.slice();
    while(t.length < 4) t.push(1);
    st.n = t;
  }

  function select(id){
    st.preset = id;
    applyTarget(id);
    L.markPreset(id);
    L.timeline({maxT: 2, step: 0.5, speed: 0.4});
    L.watch("Coefficients multiply a whole formula. Never write H₂O₄ to balance oxygen — write 4 H₂O.");
    L.legend([[C.ok, "atom counts match"], [C.danger, "still unbalanced"]]);
    renderControls();
    L.restart(false);
  }

  function renderControls(){
    var r = RX[st.preset];
    var labels = r.lhs.concat(r.rhs);
    var html = labels.map(function(f, i){
      return L.slider("bal-" + i, "Coefficient of " + f, 1, 9, 1, st.n[i], String(st.n[i]));
    }).join("");
    L.controls(html);
    labels.forEach(function(_, i){
      L.onInput("bal-" + i, function(v){
        st.n[i] = v;
        L.setVal("bal-" + i, String(v));
        st.preset = st.preset;
        L.markPreset(st.preset);
        App.resetTimeline();
      });
    });
  }

  function draw(){
    var t = terms(st.preset, st.n);
    var tab = atomTable(t.lhs, t.rhs);
    var chem = eqText(t.lhs) + " → " + eqText(t.rhs);
    var m = L.text(360, 70, chem.replace(/(\d+)/g, function(d){ return d; }), {size: 22, weight: 700, color: tab.ok ? C.ok : C.danger, mono: true}) +
      L.text(360, 120, tab.ok ? "Balanced — same number of each atom on both sides." : "Unbalanced — change a coefficient, not a formula.", {size: 16, color: tab.ok ? C.ok : C.danger}) +
      L.text(360, 160, RX[st.preset].note, {size: 14, color: C.muted});
    L.svg(m, chem, 300);
    L.readoutHTML(tab.html);
    L.verdict(tab.ok
      ? "<b>Balanced:</b> " + RX[st.preset].label + ". " + RX[st.preset].note
      : "<b>Not yet balanced.</b> Target for this scenario: " + RX[st.preset].label);
  }

  function mount(){
    L.presets([
      ["steam", "Eq. 1.9: 3Fe + 4H₂O"],
      ["skeletalFe", "Eq. 1.4: skeletal Fe + H₂O"],
      ["hcl", "H₂ + Cl₂ → 2HCl"],
      ["na", "2Na + 2H₂O"]
    ], st.preset, select);
    select(st.preset);
    App.pause(); App.resetTimeline();
  }
  window.SIMS.balancer = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Combination and decomposition
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "slake"};
  var RX = {
    slake: {title:"Activity 1.4 — slaking of lime", eq:"CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat", kind:"combination, exothermic", extra:"The beaker feels warm. Quick lime + water → slaked lime."},
    coal: {title:"Burning of coal, Eq. (1.15)", eq:"C(s) + O₂(g) → CO₂(g)", kind:"combination, exothermic", extra:"Two reactants, one product."},
    water: {title:"Formation of water, Eq. (1.16)", eq:"2H₂(g) + O₂(g) → 2H₂O(l)", kind:"combination, exothermic", extra:"Two elements combine to one compound."},
    feso4: {title:"Activity 1.5 — ferrous sulphate", eq:"2FeSO₄(s) → Fe₂O₃(s) + SO₂(g) + SO₃(g)", kind:"thermal decomposition", extra:"Green crystals lose water, then decompose. Odour of burning sulphur."},
    lime: {title:"Limestone, Eq. (1.20)", eq:"CaCO₃(s) → CaO(s) + CO₂(g)", kind:"thermal decomposition", extra:"Used to make quick lime for cement."},
    electro: {title:"Activity 1.7 — electrolysis of water", eq:"2H₂O(l) → 2H₂(g) + O₂(g)", kind:"decomposition (electricity), endothermic", extra:"The volume of hydrogen is double the volume of oxygen. Ratio 2 : 1."}
  };

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 4, step: 0.2, speed: 0.7});
    L.watch(RX[id].extra);
    L.legend([[C.ok, "combination (one product)"], [C.danger, "decomposition (one reactant splits)"], ["#fbbf24", "heat"]]);
    L.controls("");
    L.restart(true);
  }

  function draw(t){
    var r = RX[st.preset], p = Math.min(1, t / 4);
    var combo = /combination/.test(r.kind);
    var m = L.text(360, 36, r.title, {size: 16, weight: 700});
    if(combo){
      m += L.circle(180, 140, 36, "#38bdf8") + L.circle(300, 140, 36, "#a78bfa");
      m += L.arrow(340, 140, 430, 140, C.text, 4);
      m += L.circle(510, 140, 28 + 20 * p, C.ok);
      m += L.text(180, 196, "reactant", {size: 13, color: C.muted}) + L.text(300, 196, "reactant", {size: 13, color: C.muted}) + L.text(510, 196, "one product", {size: 13, color: C.ok});
      if(/Heat/.test(r.eq) || /exothermic/.test(r.kind)) m += L.text(360, 240, "heat is released — exothermic", {size: 16, color: "#fbbf24", weight: 700});
    } else {
      m += L.circle(220, 140, 48, "#f472b6");
      m += L.arrow(280, 140, 370, 140, C.text, 4);
      m += L.circle(430, 110, 28 + 8 * p, "#38bdf8") + L.circle(520, 160, 24 + 10 * p, "#fbbf24") + L.circle(430, 180, 20 + 8 * p, "#a78bfa");
      m += L.text(220, 210, "one reactant", {size: 13, color: C.muted}) + L.text(480, 230, "simpler products", {size: 13, color: C.danger});
    }
    m += L.text(360, 270, r.eq, {size: 15, weight: 700, mono: true});
    if(st.preset === "electro"){
      m += L.text(360, 240, "volume of H₂ : volume of O₂ = 2 : 1", {size: 16, color: C.ok, weight: 700});
    }
    L.svg(m, r.eq, 300);
    var heat = /exothermic/.test(r.kind) ? "released" : (/endothermic/.test(r.kind) || /thermal/.test(r.kind) ? "absorbed (endothermic)" : "—");
    var cells = [["Equation", r.eq], ["Type", r.kind], ["Heat", heat]];
    if(st.preset === "electro") cells.push(["Ratio H₂/O₂", "2"]);
    L.readout(cells);
    L.verdict("<b>" + r.kind + ".</b> " + r.eq + " " + r.extra);
  }

  function mount(){
    L.presets([
      ["slake", "Activity 1.4: slaked lime"],
      ["coal", "Eq. 1.15: coal"],
      ["water", "Eq. 1.16: 2H₂ + O₂"],
      ["feso4", "Activity 1.5: FeSO₄"],
      ["lime", "Eq. 1.20: limestone"],
      ["electro", "Activity 1.7: electrolysis 2:1"]
    ], st.preset, select);
    select(st.preset);
    App.pause(); App.resetTimeline();
  }
  window.SIMS.combo = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — More decomposition: electrolysis, light (Activities 1.6–1.8)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "water"};

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 6, step: 0.25, speed: 1});
    var w = {
      water: "Activity 1.7. Two test tubes invert over carbon electrodes in acidified water. The gas volumes are not equal.",
      pbno3: "Activity 1.6. Heat lead nitrate. Brown fumes of NO₂ are given off.",
      agcl: "Activity 1.8. White silver chloride in sunlight turns grey as silver metal forms."
    };
    L.watch(w[id]);
    L.legend([[ "#7dd3fc", "hydrogen" ], [ "#fb923c", "oxygen / NO₂" ], [ "#cbd5e1", "silver" ]]);
    L.controls("");
    L.restart(true);
  }

  function draw(t){
    var p = Math.min(1, t / 6), m = "";
    if(st.preset === "water"){
      m += L.rect(180, 80, 360, 180, "#0f172a", ' rx="16" stroke="#334155" stroke-width="3"');
      m += L.rect(200, 150, 320, 90, "rgba(56,189,248,0.2)");
      var h = 20 + 90 * p, o = 20 + 45 * p;
      m += L.rect(250, 150 - h, 70, h, "rgba(125,211,252,0.7)") + L.text(285, 150 - h - 10, "H₂", {size: 14, color: "#7dd3fc", weight: 700});
      m += L.rect(400, 150 - o, 70, o, "rgba(251,146,60,0.7)") + L.text(435, 150 - o - 10, "O₂", {size: 14, color: "#fb923c", weight: 700});
      m += L.rect(270, 200, 12, 40, "#94a3b8") + L.rect(420, 200, 12, 40, "#94a3b8");
      m += L.text(360, 270, "2H₂O(l) → 2H₂(g) + O₂(g)   volume ratio 2 : 1", {size: 15, weight: 700});
      L.readout([["H₂ volume", "2 parts"], ["O₂ volume", "1 part"], ["Ratio H₂/O₂", "2"], ["Energy", "electricity (endothermic)"]]);
      L.verdict("<b>Activity 1.7:</b> the gas in the tube with twice the volume is <b>hydrogen</b>. 2H₂O → 2H₂ + O₂, so the amount of H₂ is double the amount of O₂. Ratio <b>2 : 1</b>.");
    } else if(st.preset === "pbno3"){
      m += L.rect(300, 80, 50, 140, "#e2e8f0", ' rx="8"');
      m += L.rect(308, 160, 34, 50, "#7c2d12");
      for(var i = 0; i < 10; i++) m += L.circle(290 + (i % 5) * 22, 70 - p * 40 - (i % 3) * 8, 8, "rgba(180,83,9,0.55)");
      m += L.text(360, 250, "2Pb(NO₃)₂(s) → 2PbO(s) + 4NO₂(g) + O₂(g)", {size: 15, weight: 700});
      L.readout([["Fumes", "brown nitrogen dioxide, NO₂"], ["Type", "thermal decomposition"], ["Eq.", "(1.21)"]]);
      L.verdict("<b>Activity 1.6:</b> brown fumes of <b>nitrogen dioxide (NO₂)</b> are emitted. 2Pb(NO₃)₂ → 2PbO + 4NO₂ + O₂.");
    } else {
      var grey = Math.round(255 - 140 * p);
      m += L.rect(260, 90, 200, 80, "rgb(" + grey + "," + grey + "," + grey + ")", ' rx="8"');
      m += L.text(360, 70, "sunlight", {size: 14, color: "#fde68a"});
      m += L.text(360, 210, "2AgCl(s) → 2Ag(s) + Cl₂(g)", {size: 16, weight: 700});
      m += L.text(360, 240, p > 0.7 ? "grey silver metal" : "white silver chloride", {size: 14, color: C.muted});
      L.readout([["Start", "white AgCl"], ["After sunlight", "grey silver"], ["Energy", "light (endothermic)"], ["Also", "AgBr, used in black-and-white photography"]]);
      L.verdict("<b>Activity 1.8:</b> white silver chloride turns <b>grey</b> in sunlight. 2AgCl → 2Ag + Cl₂. Light supplies the energy; the reaction is endothermic.");
    }
    L.svg(m, "decomposition lab", 300);
  }

  function mount(){
    L.presets([["water", "Activity 1.7: electrolysis 2:1"], ["pbno3", "Activity 1.6: Pb(NO₃)₂"], ["agcl", "Activity 1.8: AgCl"]], st.preset, select);
    select(st.preset);
    App.pause(); App.resetTimeline();
  }
  window.SIMS.decomp = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Displacement and double displacement
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "nail"};

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 5, step: 0.2, speed: 0.8});
    var w = {
      nail: "Activity 1.9. Iron nails in copper sulphate. Compare with the nail kept aside and with tube A (no nail).",
      zncu: "Eq. (1.25). Zinc is more reactive than copper, so it displaces copper.",
      ppt: "Activity 1.10. Sodium sulphate + barium chloride. A white insoluble salt appears."
    };
    L.watch(w[id]);
    L.legend([[ "#2563eb", "CuSO₄ blue" ], [ "#7c2d12", "copper / FeSO₄" ], [ "#f8fafc", "BaSO₄ precipitate" ]]);
    L.controls("");
    L.restart(true);
  }

  function draw(t){
    var p = Math.min(1, t / 5), m = "";
    if(st.preset === "nail" || st.preset === "zncu"){
      var blue = Math.round(37 + (180 - 37) * (1 - p));
      var fill = "rgb(" + Math.round(37 + 80 * p) + "," + Math.round(99 + 40 * p) + "," + blue + ")";
      m += L.rect(200, 70, 120, 160, fill, ' rx="10"') + L.text(260, 250, "tube B (with Fe)", {size: 13, color: C.muted});
      m += L.rect(400, 70, 120, 160, "#1d4ed8", ' rx="10"') + L.text(460, 250, "tube A (no Fe)", {size: 13, color: C.muted});
      m += L.rect(245, 90, 16, 110, p > 0.4 ? "#b45309" : "#94a3b8");
      m += L.text(360, 40, st.preset === "nail" ? "Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)" : "Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s)", {size: 15, weight: 700});
      L.readout([["Nail / metal", p > 0.5 ? "brownish copper deposit" : "grey iron"], ["Solution B", p > 0.5 ? "blue fades" : "blue CuSO₄"], ["Solution A", "still blue"], ["Type", "displacement"]]);
      L.verdict(st.preset === "nail"
        ? "<b>Activity 1.9:</b> iron displaces copper. The nail becomes <b>brownish</b> and the blue colour of copper sulphate <b>fades</b>. Fe + CuSO₄ → FeSO₄ + Cu."
        : "<b>Eq. (1.25):</b> zinc is more reactive than copper, so Zn + CuSO₄ → ZnSO₄ + Cu.");
    } else {
      m += drawBeaker(150, 90, "#e0f2fe", "Na₂SO₄(aq)");
      m += drawBeaker(300, 90, "#e0f2fe", "BaCl₂(aq)");
      m += L.arrow(250, 145, 290, 145, C.ok, 3);
      m += L.rect(470, 90, 90, 110, "#e2e8f0", ' rx="8"');
      if(p > 0.15) m += L.circle(515, 175, 10 + 22 * p, "#f8fafc") + L.circle(500, 160, 8 + 10 * p, "#e5e7eb");
      m += L.text(515, 230, "BaSO₄ ppt", {size: 13, color: C.text});
      m += L.text(360, 40, "Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s) + 2NaCl(aq)", {size: 15, weight: 700});
      L.readout([["Precipitate", "white barium sulphate, BaSO₄"], ["Other product", "NaCl(aq), stays dissolved"], ["Type", "double displacement / precipitation"]]);
      L.verdict("<b>Activity 1.10:</b> a <b>white precipitate</b> of BaSO₄ forms by exchange of ions (SO₄²⁻ and Ba²⁺). That is a double displacement reaction, and also a precipitation reaction.");
    }
    L.svg(m, "displacement lab", 300);
  }

  function mount(){
    L.presets([["nail", "Activity 1.9: Fe + CuSO₄"], ["zncu", "Eq. 1.25: Zn + CuSO₄"], ["ppt", "Activity 1.10: BaSO₄ ppt"]], st.preset, select);
    select(st.preset);
    App.pause(); App.resetTimeline();
  }
  window.SIMS.displace = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Redox, corrosion, rancidity
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "cuo"};

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 5, step: 0.2, speed: 0.8});
    var w = {
      cuo: "Activity 1.11. Heat copper powder in a china dish. The surface turns black as oxygen is added.",
      reduce: "Eq. (1.29). Pass hydrogen over the heated black CuO and the coating turns brown: oxygen is removed.",
      rust: "Iron left in moist air is coated with reddish-brown rust. That is corrosion.",
      chips: "Fats and oils oxidise and become rancid. Manufacturers flush chip bags with nitrogen."
    };
    L.watch(w[id]);
    L.legend([[ "#b45309", "copper" ], [ "#0f172a", "CuO black" ], [ "#7c2d12", "rust" ], [ "#38bdf8", "nitrogen blanket" ]]);
    L.controls("");
    L.restart(true);
  }

  function draw(t){
    var p = Math.min(1, t / 5), m = "";
    if(st.preset === "cuo"){
      var k = Math.round(180 - 140 * p);
      m += L.rect(260, 110, 200, 50, "rgb(" + k + "," + Math.round(k * 0.45) + ",20)", ' rx="8"');
      m += L.text(360, 80, "china dish + heat", {size: 14, color: "#fbbf24"});
      m += L.text(360, 200, "2Cu + O₂ → 2CuO", {size: 20, weight: 700});
      m += L.text(360, 232, p > 0.6 ? "black copper(II) oxide — Cu is oxidised" : "shiny brown copper powder", {size: 14});
      L.readout([["Copper", p > 0.6 ? "oxidised (gains oxygen)" : "element X, shiny brown"], ["Product", "black CuO"], ["Eq.", "(1.28)"]]);
      L.verdict("<b>Activity 1.11:</b> shiny brown copper becomes <b>black copper(II) oxide</b>. 2Cu + O₂ → 2CuO. Copper is oxidised (gains oxygen).");
    } else if(st.preset === "reduce"){
      m += L.rect(260, 110, 200, 50, p > 0.6 ? "#b45309" : "#0f172a", ' rx="8"');
      m += L.arrow(80, 130, 240, 130, "#38bdf8", 4) + L.text(140, 110, "H₂", {size: 16, color: "#38bdf8"});
      m += L.text(360, 200, "CuO + H₂ → Cu + H₂O", {size: 20, weight: 700});
      m += L.text(360, 232, "CuO is reduced (loses oxygen); H₂ is oxidised (gains oxygen).", {size: 14});
      L.readout([["CuO", "reduced"], ["H₂", "oxidised"], ["Type", "redox"], ["Eq.", "(1.29)"]]);
      L.verdict("<b>Redox, Eq. (1.29):</b> CuO loses oxygen and is <b>reduced</b>; H₂ gains oxygen and is <b>oxidised</b>. One reactant oxidised, the other reduced.");
    } else if(st.preset === "rust"){
      m += L.rect(200, 90, 320, 40, p > 0.5 ? "#7c2d12" : "#cbd5e1", ' rx="6"');
      m += L.text(360, 160, "iron + moist air → rust (reddish brown)", {size: 16, weight: 700});
      m += L.text(360, 200, "Silver: black coating. Copper: green coating. That is corrosion.", {size: 14, color: C.muted});
      L.readout([["Iron", "reddish-brown rust"], ["Silver", "black coating"], ["Copper", "green coating"], ["Prevention", "paint, so air and moisture cannot reach the metal"]]);
      L.verdict("<b>Corrosion:</b> a metal is attacked by moisture, acids, etc. Iron rusts (reddish brown); silver blackens; copper greens. Paint on iron keeps air and moisture off the metal.");
    } else {
      m += L.rect(240, 80, 240, 140, "#fef3c7", ' rx="16" stroke="#f59e0b" stroke-width="3"');
      m += L.rect(250, 90, 220, 50, "rgba(56,189,248,0.35)") + L.text(360, 122, "N₂ flush", {size: 16, color: "#38bdf8", weight: 700});
      m += L.text(360, 180, "chips / oil-rich food", {size: 14});
      m += L.text(360, 250, "Nitrogen is unreactive, so it slows oxidation of the oil.", {size: 14, color: C.muted});
      L.readout([["Problem", "rancidity — fats/oils oxidise, smell and taste change"], ["Fix 1", "antioxidants"], ["Fix 2", "airtight containers"], ["Fix 3", "flush bags with nitrogen"]]);
      L.verdict("<b>Rancidity:</b> oxidation of fats and oils changes smell and taste. Antioxidants, airtight containers, and <b>nitrogen flushing</b> of chips slow that oxidation.");
    }
    L.svg(m, "redox lab", 300);
  }

  function mount(){
    L.presets([["cuo", "Activity 1.11: 2Cu + O₂"], ["reduce", "Eq. 1.29: CuO + H₂"], ["rust", "Corrosion of iron"], ["chips", "Rancidity: N₂ flush"]], st.preset, select);
    select(st.preset);
    App.pause(); App.resetTimeline();
  }
  function mountCorrosion(){
    st.preset = "rust";
    L.presets([["rust", "Corrosion of iron"], ["chips", "Rancidity: N₂ flush"]], st.preset, select);
    select(st.preset);
    App.pause(); App.resetTimeline();
  }
  window.SIMS.redox = {mount: mount, draw: draw, select: select, state: st};
  window.SIMS.corrosion = {mount: mountCorrosion, draw: draw, select: select, state: st};
})();
