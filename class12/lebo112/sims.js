// Class 12 Biology, Chapter 12 (lebo112) — simulation labs.
// One lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Pond component explorer (NCERT §12.1, Exercise 7 core)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "pond"};

  function wrap(text, width){
    var words = text.split(" "), line = "", lines = [];
    for(var i = 0; i < words.length; i++){
      var test = line ? line + " " + words[i] : words[i];
      if(test.length > width){ lines.push(line); line = words[i]; } else line = test;
    }
    if(line) lines.push(line);
    return lines;
  }

  function draw(){
    var m = "";
    m += L.text(360, 22, "Pond ecosystem: abiotic + autotrophs + consumers + decomposers, energy flowing one way", {size: 13, color: C.muted});
    if(st.preset === "forest"){
      m += L.rect(160, 44, 400, 58, "#14532d", ' rx="6"');
      m += L.text(360, 78, "trees: top vertical stratum", {size: 13, color: C.text});
      m += L.rect(200, 110, 320, 52, "#166534", ' rx="6"');
      m += L.text(360, 141, "shrubs: second layer", {size: 12, color: C.text});
      m += L.rect(240, 170, 240, 52, "#22c55e", ' rx="6"');
      m += L.text(360, 201, "herbs + grasses: bottom layer", {size: 12, color: "#08131d"});
      m += L.text(360, 248, "species composition = identification + enumeration; stratification = vertical layers (§12.1).", {size: 12, color: C.muted});
      m += L.text(360, 270, "four functions: productivity, decomposition, energy flow, nutrient cycling.", {size: 11, color: "#64748b"});
    } else {
      var dead = st.preset === "nodecomp";
      m += L.rect(80, 46, 560, 168, "#0f2537", ' rx="8" stroke="#38bdf8"');
      m += L.rect(80, 214, 560, 36, "#3f2d1c", ' rx="4"');
      m += L.text(360, 66, "abiotic: water + dissolved substances + sun/temperature", {size: 12, color: "#38bdf8"});
      m += L.text(360, 238, "bottom soil deposit (rich in dead matter)", {size: 11, color: "#d6a35c"});
      for(var i = 0; i < 12; i++){
        var px = 110 + (i * 53) % 300, py = 92 + (i * 29) % 44;
        m += L.circle(px, py, 5, C.ok);
      }
      m += L.rect(440, 84, 26, 48, "#166534");
      m += L.rect(478, 96, 22, 36, "#15803d");
      m += L.text(555, 78, "producers", {size: 11, color: C.ok});
      for(var f = 0; f < 3; f++){
        var fx = 170 + f * 110;
        m += L.circle(fx, 158, 12, "#f59e0b");
      }
      m += L.text(300, 186, "zooplankton + swimmers + bottom dwellers (consumers)", {size: 11, color: "#f59e0b"});
      if(!dead){
        for(var d = 0; d < 9; d++) m += L.circle(112 + d * 62, 226, 6, "#a78bfa");
        m += L.text(360, 278, "decomposers at the bottom: fungi, bacteria, flagellates (§12.1)", {size: 11, color: "#a78bfa"});
      } else {
        for(var p = 0; p < 6; p++) m += L.rect(112 + p * 80, 220, 44, 14, "#57534e");
        m += L.text(360, 278, "NO decomposers: dead matter accumulates, mineralisation stops, nutrients stay locked", {size: 11, color: C.danger});
      }
    }
    L.svg(m, "Pond ecosystem components for the " + st.preset + " scenario.", 300);

    L.readout([
      ["abiotic", "water + soil", "#38bdf8"],
      ["producers", "phytoplankton + plants", C.ok],
      ["consumers", "zooplankton + fish", "#f59e0b"],
      ["decomposers", st.preset === "nodecomp" ? "REMOVED" : "bottom-abundant", st.preset === "nodecomp" ? C.danger : "#a78bfa"]
    ]);
    if(st.preset === "forest"){
      L.verdict("<b>Section 12.1:</b> structure = <b>species composition</b> (identify + count) + <b>stratification</b> (trees \u2192 shrubs \u2192 herbs/grasses). The components function through four aspects: <b>productivity, decomposition, energy flow and nutrient cycling</b>.");
    } else if(st.preset === "nodecomp"){
      L.verdict("<b>Section 12.1 prediction:</b> remove the fungi, bacteria and flagellates and <b>dead matter accumulates while mineralisation stops</b> \u2014 the autotrophs run short of recycled nutrients. Every component box must be non-empty (Exercise 7 core).");
    } else {
      L.verdict("<b>Section 12.1 pond (Exercise 7):</b> <b>autotrophs</b> (phytoplankton, algae, marginal plants) convert inorganic into organic matter with sunlight; heterotrophs feed on them; <b>bottom decomposers mineralise</b> dead matter for reuse. Energy moves <b>unidirectionally</b> upward, dissipated as heat.");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["pond", "Pond: full system"], ["forest", "Forest stratification"], ["nodecomp", "Remove decomposers"]], st.preset, select);
    L.legend([["#38bdf8", "abiotic (water + soil)"], [C.ok, "producers"], ["#f59e0b", "consumers"], ["#a78bfa", "decomposers (bottom)"]]);
    draw();
  }

  window.SIMS.pond = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — NPP = GPP − R bench (NCERT §12.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PRESET = {
    patch: {gpp: 52, r: 17, label: "patch: GPP 52, R 17"},
    ocean: {gpp: 30, r: 18, label: "ocean: low per-area NPP"},
    land: {gpp: 70, r: 22, label: "land: high per-area NPP"}
  };
  var st = {preset: "patch", gpp: 52, r: 17};

  function draw(){
    var gpp = st.gpp, r = Math.min(st.r, st.gpp), npp = gpp - r;
    function H(v){ return v / 100 * 168; }
    var m = "";
    m += L.text(360, 22, "NPP = GPP \u2212 R: what photosynthesis fixes minus what the producers respire", {size: 13, color: C.muted});
    m += L.line(120, 240, 600, 240, C.faint, 1.5);
    m += L.rect(150, 240 - H(gpp), 90, H(gpp), "#14532d", ' stroke="' + C.ok + '" stroke-width="2"');
    m += L.rect(150, 240 - H(gpp), 90, H(r), C.danger, ' opacity="0.85"');
    m += L.text(195, 258, "GPP " + L.num(gpp, 0), {size: 12, color: C.muted});
    m += L.rect(330, 240 - H(npp), 90, H(npp), "#38bdf8", ' stroke="#e2e8f0" stroke-width="2"');
    m += L.text(375, 258, "NPP " + L.num(npp, 0), {size: 12, color: "#38bdf8"});
    m += L.text(490, 80, PRESET[st.preset].label, {size: 13, color: C.text});
    m += L.text(490, 112, "NPP = " + L.num(gpp, 0) + " \u2212 " + L.num(r, 0) + " = " + L.num(npp, 0), {size: 18, color: "#38bdf8", weight: 700});
    m += L.text(490, 138, "kcal m\u207b\u00b2 yr\u207b\u00b9", {size: 12, color: C.muted});
    m += L.text(490, 166, "R (red) is respired by", {size: 11, color: C.danger});
    m += L.text(490, 182, "the producers themselves", {size: 11, color: C.danger});
    m += L.text(360, 282, "Biosphere NPP \u2248 170 billion tons dry weight: oceans only 55 despite ~70% of the surface; land 115.", {size: 11, color: "#64748b"});
    L.svg(m, "GPP, respiration and NPP bars for " + PRESET[st.preset].label + ".", 300);

    L.readout([
      ["GPP", L.num(gpp, 0) + " kcal m\u207b\u00b2 yr\u207b\u00b9", C.ok],
      ["R (respiration)", L.num(r, 0) + " kcal m\u207b\u00b2 yr\u207b\u00b9", C.danger],
      ["NPP = GPP \u2212 R", L.num(npp, 0) + " kcal m\u207b\u00b2 yr\u207b\u00b9", "#38bdf8"],
      ["biosphere split", "170 = 55 + 115 billion tons", "#f59e0b"]
    ]);
    L.verdict("<b>Section 12.2 (Exercises 6, 9):</b> <b>NPP = GPP \u2212 R</b>; NPP is the biomass available to heterotrophs, while <b>secondary productivity</b> is the rate at which consumers form new organic matter. Biosphere <b>170 = 55 (ocean) + 115 (land)</b> billion tons dry weight \u2014 ocean productivity is low per area because light attenuates and nutrients are scarce (discuss with your teacher).");
  }

  function select(id){
    st.preset = id;
    st.gpp = PRESET[id].gpp;
    st.r = PRESET[id].r;
    var a = document.getElementById("prod-gpp"), b = document.getElementById("prod-r");
    if(a) a.value = st.gpp;
    if(b) b.value = st.r;
    L.setVal("prod-gpp", L.num(st.gpp, 0));
    L.setVal("prod-r", L.num(st.r, 0));
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["patch", "Patch: GPP 52, R 17"], ["ocean", "Ocean: thin per-area"], ["land", "Land: 115 of 170"]], st.preset, select);
    L.controls(
      L.slider("prod-gpp", "GPP (kcal m\u207b\u00b2 yr\u207b\u00b9)", 10, 100, 1, st.gpp, L.num(st.gpp, 0)) +
      L.slider("prod-r", "R: respiration loss", 0, 60, 1, st.r, L.num(st.r, 0))
    );
    L.onInput("prod-gpp", function(v){ st.gpp = v; L.setVal("prod-gpp", L.num(v, 0)); draw(); });
    L.onInput("prod-r", function(v){ st.r = v; L.setVal("prod-r", L.num(v, 0)); draw(); });
    L.legend([[C.ok, "GPP (gross fixed)"], [C.danger, "R (respired)"], ["#38bdf8", "NPP (left for heterotrophs)"]]);
    draw();
  }

  window.SIMS.productivity = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Decomposition stepper (NCERT §12.3, Figure 12.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PRESET = {
    nitrogen: {litter: "nitrogen/sugar", warm: true, label: "fast litter, warm + moist"},
    lignin: {litter: "lignin/chitin", warm: true, label: "slow litter, warm + moist"},
    cold: {litter: "nitrogen/sugar", warm: false, label: "cold / anaerobic: inhibited"}
  };
  var STEPS = ["fragmentation", "leaching", "catabolism", "humification", "mineralisation"];
  var AGENTS = ["detritivores (earthworm)", "water: soluble salts down", "bacterial + fungal enzymes", "humus: dark, colloidal store", "release inorganic nutrients"];
  var st = {preset: "nitrogen", step: 4};

  function draw(){
    var p = PRESET[st.preset];
    var speed = (p.litter === "nitrogen/sugar" ? 2 : 0.5) * (p.warm ? 1.5 : 0.4);
    var m = "";
    m += L.text(360, 22, "Detritus \u2192 CO\u2082 + water + nutrients: five processes act simultaneously (Fig 12.1)", {size: 13, color: C.muted});
    for(var i = 0; i < 5; i++){
      var bx = 40 + i * 132;
      var on = i === st.step;
      m += L.rect(bx, 48, 120, 76, on ? "#f59e0b" : (i < st.step ? "#134e4a" : "#0f1f2e"), ' rx="8" stroke="' + (on ? "#fff" : "#334155") + '"');
      m += L.text(bx + 60, 74, (i + 1) + ". " + STEPS[i], {size: 10, color: on ? "#08131d" : C.text, weight: on ? 700 : 400});
      m += L.text(bx + 60, 96, AGENTS[i], {size: 9, color: on ? "#08131d" : C.muted});
      if(i < 4) m += L.arrow(bx + 122, 86, bx + 130, 86, C.faint, 2);
    }
    m += L.text(360, 148, "step " + (st.step + 1) + "/5: " + STEPS[st.step] + " \u2014 " + AGENTS[st.step], {size: 13, color: C.text});
    m += L.rect(80, 172, 560, 20, "#0f1f2e", ' rx="6" stroke="#334155"');
    m += L.rect(80, 172, Math.min(560, speed * 130), 20, speed > 1.5 ? C.ok : C.danger, ' rx="6"');
    m += L.text(360, 214, p.label + " \u2014 rate x" + speed.toFixed(1), {size: 12, color: speed > 1.5 ? C.ok : C.danger});
    m += L.text(360, 240, "products: CO\u2082 + water + inorganic nutrients; humus is the slow-turnover nutrient reservoir", {size: 11, color: C.muted});
    m += L.text(360, 262, "decomposition is oxygen-requiring: warm + moist favour it, low temperature + anaerobiosis inhibit it", {size: 11, color: "#64748b"});
    L.svg(m, "Decomposition stepper: " + STEPS[st.step] + " with " + p.label + ".", 300);

    L.readout([
      ["step", (st.step + 1) + "/5 " + STEPS[st.step], "#f59e0b"],
      ["litter", p.litter, p.litter === "nitrogen/sugar" ? C.ok : C.danger],
      ["climate", p.warm ? "warm + moist" : "cold / anaerobic", p.warm ? C.ok : C.danger],
      ["relative rate", "x" + speed.toFixed(1), speed > 1.5 ? C.ok : C.danger]
    ]);
    if(st.preset === "nitrogen"){
      L.verdict("<b>Section 12.3 (Exercise 10):</b> the order is <b>fragmentation \u2192 leaching \u2192 catabolism \u2192 humification \u2192 mineralisation</b> and all steps operate simultaneously. Nitrogen- and sugar-rich detritus decomposes <b>quickly</b> in warm, moist, aerobic soil; the earthworm fragments it first.");
    } else if(st.preset === "lignin"){
      L.verdict("<b>Section 12.3 (Exercise 10):</b> detritus rich in <b>lignin and chitin decomposes slowly</b>, while nitrogen- and water-soluble sugar-rich detritus decomposes quickly. Warm and moist conditions favour the soil microbes that drive the five simultaneous steps.");
    } else {
      L.verdict("<b>Section 12.3:</b> decomposition is largely an oxygen-requiring process; <b>low temperature and anaerobiosis inhibit</b> it, so organic materials build up instead of recycling. Temperature and soil moisture are the key climatic controls acting through soil microbes.");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["nitrogen", "Nitrogen/sugar litter (fast)"], ["lignin", "Lignin/chitin litter (slow)"], ["cold", "Cold / anaerobic"]], st.preset, select);
    L.controls(L.slider("dec-step", "Decomposition step", 0, 4, 1, st.step, String(st.step + 1)));
    L.onInput("dec-step", function(v){ st.step = Math.round(v); L.setVal("dec-step", String(st.step + 1)); draw(); });
    L.legend([["#f59e0b", "current step"], [C.ok, "favoured rate"], [C.danger, "inhibited rate"]]);
    draw();
  }

  window.SIMS.decomposition = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Energy flow and the 10 per cent law (NCERT §12.4, Figures 12.2–12.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PRESET = {
    grass: {labels: ["Grass T1", "Goat T2", "Man T3", "Top T4"], kind: "GFC"},
    lake: {labels: ["Phytoplankton T1", "Zooplankton T2", "Fish T3", "Top fish T4"], kind: "GFC"},
    detritus: {labels: ["Detritus", "Saprotrophs", "Detritivores", "GFC predators"], kind: "DFC"}
  };
  var st = {preset: "grass", pj: 10000};

  function draw(){
    var p = PRESET[st.preset];
    var vals = [st.pj, st.pj * 0.1, st.pj * 0.01, st.pj * 0.001];
    var cols = [C.ok, "#f59e0b", "#38bdf8", "#a78bfa"];
    var m = "";
    m += L.text(360, 22, "10 per cent law (Fig 12.3): only ~10% of the energy crosses to each higher level", {size: 13, color: C.muted});
    for(var i = 0; i < 4; i++){
      var h = Math.max(22, 190 * Math.pow(vals[i] / st.pj, 0.3));
      var bx = 70 + i * 160;
      m += L.rect(bx, 230 - h, 120, h, "#0f1f2e", ' rx="6" stroke="' + cols[i] + '" stroke-width="2"');
      m += L.rect(bx, 230 - Math.min(h, 12 + (3 - i) * 7), 120, Math.min(h, 12 + (3 - i) * 7), cols[i], ' opacity="0.85" rx="6"');
      m += L.text(bx + 60, 44, p.labels[i], {size: 11, color: cols[i]});
      m += L.text(bx + 60, 246, L.num(vals[i], vals[i] < 100 ? 1 : 0) + " J", {size: 12, color: C.text});
      if(i < 3) m += L.text(bx + 140, 100, "90% heat", {size: 10, color: C.danger});
    }
    m += L.text(360, 272, "PAR < 50% of incident solar; plants capture 2\u201310% of PAR; producers convert ~1% of sunlight into NPP (Fig 12.4d).", {size: 11, color: "#64748b"});
    L.svg(m, "Ten per cent law chain for the " + p.kind + " preset.", 300);

    L.readout([
      [p.labels[0], L.num(vals[0], 0) + " J", C.ok],
      [p.labels[1], L.num(vals[1], 0) + " J", "#f59e0b"],
      [p.labels[2], L.num(vals[2], 1) + " J", "#38bdf8"],
      [p.labels[3], L.num(vals[3], 2) + " J", "#a78bfa"]
    ]);
    if(st.preset === "grass"){
      L.verdict("<b>Section 12.4 (Figs 12.2\u201312.3; Exercises 2\u20135):</b> the grazing food chain reads <b>Grass \u2192 Goat \u2192 Man</b>, and each step keeps about <b>10 per cent</b>: " + L.num(st.pj, 0) + " \u2192 " + L.num(vals[1], 0) + " \u2192 " + L.num(vals[2], 0) + " \u2192 " + L.num(vals[3], 1) + " J. Decomposers hold the largest population (Ex 2); a lake's second trophic level is zooplankton (Ex 3); there are no 'secondary producers' (Ex 4); PAR is less than 50% (Ex 5).");
    } else if(st.preset === "lake"){
      L.verdict("<b>Section 12.4:</b> in <b>aquatic</b> ecosystems the grazing food chain is the major conduit: <b>phytoplankton \u2192 zooplankton \u2192 fish</b>. Energy is unidirectional and about 10 per cent crosses each trophic level; the rest is lost as heat.");
    } else {
      L.verdict("<b>Section 12.4:</b> the <b>detritus food chain</b> starts with dead organic matter and runs through <b>saprotrophs (fungi and bacteria)</b>; in <b>terrestrial</b> ecosystems a much larger fraction of energy flows through the DFC than the GFC. The chains interconnect into a food web (omnivores such as cockroaches and crows).");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["grass", "Grass\u2013Goat\u2013Man (GFC)"], ["lake", "Lake: phyto\u2013zoo\u2013fish"], ["detritus", "Detritus chain (DFC)"]], st.preset, select);
    L.controls(L.slider("ef-pj", "Producer energy (J)", 1000, 20000, 500, st.pj, String(st.pj)));
    L.onInput("ef-pj", function(v){ st.pj = v; L.setVal("ef-pj", String(v)); draw(); });
    L.legend([["#34d399", "T1 producers"], ["#f59e0b", "T2 herbivores"], ["#38bdf8", "T3 carnivores"], ["#a78bfa", "T4 top"]]);
    draw();
  }

  window.SIMS.energyflow = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Ecological pyramid builder (NCERT §12.5, Figure 12.4 a–d)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PRESET = {
    numgrass: {type: "numbers", shape: "upright", rows: [100, 62, 34, 12], title: "Numbers: grassland upright", note: "nearly 6 million plants support only 3 top-carnivores (Fig 12.4a)"},
    numtree: {type: "numbers", shape: "inverted", rows: [16, 58, 42, 24], title: "Numbers: tree inverted", note: "one tree \u2192 many insects \u2192 fewer small birds \u2192 fewer large birds"},
    biosea: {type: "biomass", shape: "inverted", rows: [24, 66, 48, 26], title: "Biomass: sea inverted", note: "fish biomass exceeds the small phytoplankton standing crop (Fig 12.4c)"},
    energy: {type: "energy", shape: "upright", rows: [100, 60, 32, 12], title: "Energy: always upright", note: "producers convert ~1% of sunlight into NPP; ~10% crosses each level (Fig 12.4d)"}
  };
  var NAMES = ["producers", "herbivores", "carnivores", "top carnivores"];
  var st = {preset: "numgrass"};

  function draw(){
    var p = PRESET[st.preset];
    var cols = [C.ok, "#f59e0b", "#38bdf8", "#a78bfa"];
    var m = "";
    m += L.text(360, 22, p.title + " (" + p.shape + ")", {size: 14, color: C.muted});
    for(var i = 0; i < 4; i++){
      var w = Math.max(24, p.rows[i] / 100 * 300);
      var bx = 360 - w / 2, by = 48 + i * 50;
      m += L.rect(bx, by, w, 40, cols[i], ' rx="4" opacity="0.9"');
      m += L.text(360, by + 26, p.rows[i], {size: 12, color: "#08131d", weight: 700});
      m += L.text(360 - 170, by + 26, NAMES[i], {size: 11, color: C.muted, anchor: "end"});
    }
    m += L.line(360, 40, 360, 250, C.faint, 1, "4 4");
    m += L.text(360, 268, p.note, {size: 12, color: C.muted});
    m += L.text(360, 288, "base = producers T1, apex = top consumers; limits: no two-level species, no food webs, saprophytes unplaced.", {size: 10, color: "#64748b"});
    L.svg(m, "Pyramid of " + p.type + ", " + p.shape + ".", 300);

    L.readout([
      ["pyramid", p.type, "#38bdf8"],
      ["shape", p.shape.toUpperCase(), p.shape === "upright" ? C.ok : "#f59e0b"],
      ["base (T1)", "producers", C.ok],
      ["apex", "top carnivores", "#a78bfa"]
    ]);
    if(st.preset === "energy"){
      L.verdict("<b>Section 12.5 (Fig 12.4d; Exercise 8):</b> the energy pyramid is <b>always upright and can never be inverted</b> because some energy is lost as heat at each transfer. Primary producers convert only about <b>1 per cent</b> of the sunlight available to them into NPP, and each bar is energy per level per unit time or area.");
    } else if(st.preset === "numtree"){
      L.verdict("<b>Section 12.5 (Exercise 8; Exercise 1b):</b> counting one big tree, its insects, the small birds and then the larger birds gives an <b>inverted</b> pyramid of numbers \u2014 the base is one producer while the levels above hold more individuals. A tree-dominated ecosystem therefore has an inverted number pyramid.");
    } else if(st.preset === "biosea"){
      L.verdict("<b>Section 12.5 (Fig 12.4c; Exercise 8):</b> the sea's biomass pyramid is generally <b>inverted</b> \u2014 the biomass of fishes far exceeds that of the phytoplankton they depend on, because the tiny phytoplankton standing crop turns over rapidly. The energy pyramid above the same water stays upright.");
    } else {
      L.verdict("<b>Section 12.5 (Fig 12.4a\u2013b; Exercise 8):</b> in the grassland number pyramid, nearly <b>6 million plants</b> support only <b>3 top-carnivores</b> \u2014 upright, and biomass also decreases sharply upward. In most ecosystems all three pyramids are upright.");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["numgrass", "Numbers: grassland upright"], ["numtree", "Numbers: tree inverted"], ["biosea", "Biomass: sea inverted"], ["energy", "Energy: always upright"]], st.preset, select);
    L.legend([[C.ok, "producers (base)"], ["#f59e0b", "herbivores"], ["#38bdf8", "carnivores"], ["#a78bfa", "top carnivores (apex)"]]);
    draw();
  }

  window.SIMS.pyramids = {mount: mount, draw: draw, select: select, state: st};
})();
