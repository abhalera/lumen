// Class 10 Science, Chapter 4 (jesc104) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, C = L.C, st = {preset: "h2"};
  var RX = {
    h2: {title:"H₂ — single covalent bond (Figs. 4.1–4.2)", eq:"H–H  (one shared pair)", note:"Each H attains helium’s 2 electrons in the K shell."},
    o2: {title:"O₂ — double bond (Fig. 4.3)", eq:"O=O  (two shared pairs)", note:"Oxygen atomic number 8; six electrons in L; needs two more."},
    n2: {title:"N₂ — triple bond (Fig. 4.4)", eq:"N≡N  (three shared pairs)", note:"Nitrogen atomic number 7; five valence electrons; needs three more."},
    ch4: {title:"CH₄ — four single bonds (Fig. 4.5)", eq:"C with four H, all single bonds", note:"Carbon atomic number 6; four valence electrons; tetravalent."},
    ch3cl: {title:"CH₃Cl — covalent, not ionic", eq:"three C–H and one C–Cl, all shared pairs", note:"Exercise Q4: no ions; poor conductor; low mp compared with NaCl."}
  };
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 2, step: 0.5, speed: 0.4});
    L.watch("Shared pairs belong to both atoms. No ions, so these compounds are generally poor conductors and have low melting/boiling points (Table 4.1: methane 90 K / 111 K).");
    L.legend([["#38bdf8","shared pair"],["#fbbf24","carbon"]]); L.controls(""); L.restart(false);
  }
  function draw(){
    var r = RX[st.preset];
    var m = L.text(360, 60, r.title, {size: 16, weight: 700}) + L.text(360, 120, r.eq, {size: 20, weight: 700}) + L.text(360, 180, r.note, {size: 14, color: C.muted});
    L.svg(m, r.title, 300);
    L.readout([["Bond", r.eq], ["Ions?", "none — electrons are shared"], ["Table 4.1 CH₄", "mp 90 K, bp 111 K"]]);
    L.verdict("<b>Covalent bond:</b> " + r.note + " Carbon does not form C⁴⁺ or C⁴⁻; it shares. Diamond: each C bonded to four others. Graphite: three in a plane (one double bond). C-60 fullerene is football-shaped.");
  }
  function mount(){
    L.presets([["h2","H₂ single"],["o2","O₂ double"],["n2","N₂ triple"],["ch4","CH₄"],["ch3cl","CH₃Cl"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.covalent = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "ethane"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 2, step: 0.5, speed: 0.4});
    L.watch("Saturated: only C–C single bonds. Unsaturated: C=C or C≡C. Catenation + tetravalency give millions of compounds. Crust has only 0.02% C; air 0.03% CO₂.");
    L.legend([["#22c55e","single"],["#f59e0b","double"],["#ef4444","triple"]]); L.controls(""); L.restart(false);
  }
  function draw(){
    var map = {
      ethane: {n:"ethane C₂H₆", b:"7 covalent bonds (1 C–C + 6 C–H)", k:"saturated"},
      ethene: {n:"ethene C₂H₄", b:"1 C=C + 4 C–H", k:"unsaturated (double)"},
      ethyne: {n:"ethyne C₂H₂", b:"1 C≡C + 2 C–H", k:"unsaturated (triple)"},
      pentane: {n:"pentane C₅H₁₂", b:"three isomers: n-pentane; 2-methylbutane; 2,2-dimethylpropane", k:"saturated, branched chains"}
    };
    var r = map[st.preset];
    var m = L.text(360, 70, r.n, {size: 20, weight: 700}) + L.text(360, 130, r.b, {size: 16}) + L.text(360, 190, r.k, {size: 16, color: C.ok});
    L.svg(m, r.n, 300);
    L.readout([["Compound", r.n], ["Bonds / isomers", r.b], ["Class", r.k]]);
    L.verdict("<b>" + r.n + "</b> is " + r.k + ". " + r.b + ". Exercise Q1: ethane has <b>7 covalent bonds</b>.");
  }
  function mount(){
    L.presets([["ethane","ethane C₂H₆ — 7 bonds"],["ethene","ethene C=C"],["ethyne","ethyne C≡C"],["pentane","3 pentane isomers"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.satunsat = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "alkanes"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 2, step: 0.5, speed: 0.4});
    L.watch("A homologous series differs by CH₂ (mass 14 u) and has the same functional group and general formula.");
    L.legend([["#38bdf8","CH₂ step"]]); L.controls(""); L.restart(false);
  }
  function draw(){
    var map = {
      alkanes: {g:"CₙH₂ₙ₊₂", e:"CH₄, C₂H₆, C₃H₈ …", d:"+ CH₂, +14 u"},
      alcohols: {g:"CₙH₂ₙ₊₁OH", e:"CH₃OH, C₂H₅OH …", d:"–OH functional group"},
      ketones: {g:"R–CO–R′", e:"propanone, butanone", d:"butanone is a four-carbon ketone (Q2)"}
    };
    var r = map[st.preset];
    var m = L.text(360, 70, r.g, {size: 22, weight: 700}) + L.text(360, 130, r.e, {size: 16}) + L.text(360, 190, r.d, {size: 16, color: C.muted});
    L.svg(m, r.g, 300);
    L.readout([["General formula", r.g], ["Examples", r.e], ["Step", "CH₂ , 14 u"]]);
    L.verdict("<b>Homologous series:</b> same functional group, successive members differ by <b>CH₂ (14 u)</b>. " + r.d);
  }
  function mount(){
    L.presets([["alkanes","alkanes CₙH₂ₙ₊₂"],["alcohols","alcohols –OH"],["ketones","ketones (butanone)"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.homolog = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "butanone"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 2, step: 0.5, speed: 0.4});
    L.watch("Table 4.4: longest chain, functional suffix, substituents numbered from the end nearer the group.");
    L.legend([["#fbbf24","functional group"]]); L.controls(""); L.restart(false);
  }
  function draw(){
    var map = {
      butanone: {name:"butanone", group:"ketone (–CO–)", note:"four-carbon ketone; Exercise Q2 (c)"},
      ethanol: {name:"ethanol", group:"alcohol (–OH)", note:"C₂H₅OH; Table 4.1 bp 351 K"},
      ethanoic: {name:"ethanoic acid", group:"carboxylic acid (–COOH)", note:"glacial acetic acid; Table 4.1 mp 290 K"}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.name, {size: 22, weight: 700}) + L.text(360, 140, r.group, {size: 18}) + L.text(360, 200, r.note, {size: 15, color: C.muted});
    L.svg(m, r.name, 300);
    L.readout([["Name", r.name], ["Functional group", r.group], ["Note", r.note]]);
    L.verdict("<b>" + r.name + "</b> has the " + r.group + " group. " + r.note);
  }
  function mount(){
    L.presets([["butanone","butanone = ketone"],["ethanol","ethanol = alcohol"],["ethanoic","ethanoic acid"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.names = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "complete"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.7});
    L.watch("Complete combustion: blue flame, CO₂ + H₂O. Incomplete: yellow sooty flame, carbon — blackened vessel (Q3). Unsaturated compounds often give a sooty flame.");
    L.legend([["#38bdf8","complete"],["#78716c","soot"]]); L.controls(""); L.restart(true);
  }
  function draw(t){
    var p = Math.min(1, t/4), m = "";
    if(st.preset === "complete"){
      m += L.circle(360, 120, 40+10*p, "rgba(56,189,248,0.5)");
      m += L.text(360, 200, "CH₄ + 2O₂ → CO₂ + 2H₂O + heat", {size: 16, weight: 700});
      L.readout([["Flame","clean / blue"],["Products","CO₂ and water"],["Vessel","not blackened"]]);
      L.verdict("<b>Complete combustion</b> in plenty of air: carbon dioxide and water. Carbon compounds are major fuels.");
    } else if(st.preset === "soot"){
      m += L.rect(260, 80, 200, 80, "#1e293b", ' rx="8"');
      m += L.text(360, 200, "yellow sooty flame — fuel is not burning completely", {size: 15, weight: 700});
      L.readout([["Observation","bottom of the vessel blackened"],["Meaning","incomplete combustion"],["Q3","(b) the fuel is not burning completely"]]);
      L.verdict("<b>Exercise Q3:</b> a blackened cooking vessel means the fuel is <b>not burning completely</b> (soot/carbon).");
    } else {
      m += L.text(360, 80, "hydrogenation: C=C + H₂ → C–C  (Ni catalyst)", {size: 16, weight: 700});
      m += L.text(360, 140, "vegetable oils → vanaspati / saturated fats", {size: 16});
      m += L.text(360, 200, "unsaturated C₂H₄, C₃H₆, C₃H₄ add; C₂H₆ and CH₄ do not", {size: 14, color: C.muted});
      L.readout([["Addition","unsaturated hydrocarbons"],["Industrial","hydrogenation of oils"],["Saturated","C₂H₆, CH₄ — no addition"]]);
      L.verdict("<b>Hydrogenation</b> is addition of hydrogen to unsaturated compounds (Ni catalyst). Industrial: vegetable oil to vanaspati. Q13: C₂H₄, C₃H₆, C₃H₄ undergo addition; methane and ethane do not.");
    }
    L.svg(m, "chemical properties", 300);
  }
  function mount(){
    L.presets([["complete","complete combustion"],["soot","Q3 blackened vessel"],["hydro","hydrogenation"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.chemprop = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "fizz"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.7});
    L.watch("Ethanol vs ethanoic acid: NaHCO₃ fizzes only with the acid. Ethanol bp 351 K; conc. H₂SO₄ at 443 K gives ethene. Alkaline KMnO₄ oxidises ethanol to ethanoic acid.");
    L.legend([["#e2e8f0","CO₂"],["#fbbf24","ethanol"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var m = "";
    if(st.preset === "fizz"){
      m += L.text(360, 70, "ethanoic acid + NaHCO₃ → salt + water + CO₂", {size: 16, weight: 700});
      m += L.text(360, 130, "ethanol + NaHCO₃ → no fizz", {size: 16});
      m += L.text(360, 200, "litmus: acid turns blue litmus red; ethanol does not", {size: 14, color: C.muted});
      L.readout([["Acid test","effervescence with NaHCO₃"],["Ethanol","no CO₂"],["Also","smell; mp of glacial acetic acid 290 K"]]);
      L.verdict("<b>Distinguish alcohol and carboxylic acid:</b> sodium hydrogencarbonate fizzes with the acid (CO₂, lime water milky). Ethanol does not. That is Exercise Q7 / in-text p. 74.");
    } else if(st.preset === "ethene"){
      m += L.text(360, 90, "C₂H₅OH  —conc. H₂SO₄, 443 K→  C₂H₄ + H₂O", {size: 16, weight: 700});
      m += L.text(360, 160, "dehydration of ethanol to ethene", {size: 16});
      L.readout([["Reagent","concentrated H₂SO₄"],["Temperature","443 K"],["Product","ethene"]]);
      L.verdict("<b>Hot concentrated sulphuric acid</b> dehydrates ethanol at <b>443 K</b> to ethene.");
    } else {
      m += L.text(360, 90, "ethanol  —alk. KMnO₄ / acidified K₂Cr₂O₇→  ethanoic acid", {size: 15, weight: 700});
      m += L.text(360, 160, "oxidising agents add oxygen / remove hydrogen", {size: 15});
      L.readout([["Oxidising agents","alkaline KMnO₄, acidified K₂Cr₂O₇"],["Product","ethanoic acid"]]);
      L.verdict("<b>Oxidation of ethanol</b> with alkaline KMnO₄ or acidified K₂Cr₂O₇ gives ethanoic acid. Those reagents are oxidising agents (in-text p. 74).");
    }
    L.svg(m, "ethanol and acid", 300);
  }
  function mount(){
    L.presets([["fizz","NaHCO₃ fizz test"],["ethene","443 K dehydration"],["ox","KMnO₄ oxidation"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.ethacid = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "micelle"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.7});
    L.watch("Soap: hydrophobic tail in oil, hydrophilic ionic head in water → micelle. Hard water: Ca/Mg make scum. Detergents still foam. Agitation helps dirt into the micelle.");
    L.legend([["#38bdf8","ionic head"],["#fbbf24","hydrocarbon tail"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var m = "";
    if(st.preset === "micelle"){
      m += L.circle(360, 140, 50, "rgba(251,191,36,0.35)");
      m += L.circle(360, 140, 18, "#fbbf24");
      m += L.text(360, 220, "tails in, ionic heads out — micelle", {size: 16, weight: 700});
      L.readout([["Interior","hydrophobic tails + oily dirt"],["Surface","hydrophilic ionic heads"],["Looks","cloudy (micelles scatter light)"]]);
      L.verdict("<b>Micelle:</b> hydrophobic tails collect oily dirt inside; ionic heads face water. Soap solution is cloudy because micelles scatter light. In ethanol the same clustering is not favoured the same way (Q8).");
    } else if(st.preset === "hard"){
      m += L.text(360, 80, "soap + Ca²⁺/Mg²⁺ → scum (curdy ppt)", {size: 16, weight: 700});
      m += L.text(360, 140, "detergents: charged ends do not make that ppt", {size: 16});
      m += L.text(360, 200, "so a detergent cannot tell you if water is hard (in-text)", {size: 14, color: C.muted});
      L.readout([["Hard water","Ca and Mg salts"],["Soap","scum, less foam"],["Detergent","still foams"]]);
      L.verdict("<b>Scum</b> is the insoluble salt of soap with calcium or magnesium. Detergents remain effective in hard water. You would <b>not</b> check hardness with a detergent.");
    } else {
      m += L.text(360, 100, "agitation / beating / machine", {size: 18, weight: 700});
      m += L.text(360, 160, "helps oily dirt move into the micelle interior", {size: 16});
      L.readout([["Why beat clothes","to get dirt into micelles"],["Then","rinse — ion repulsion keeps dirt suspended"]]);
      L.verdict("<b>Agitation</b> is necessary so that oily dirt is collected in the centre of the soap micelles and can be rinsed away.");
    }
    L.svg(m, "soap", 300);
  }
  function mount(){
    L.presets([["micelle","Fig. 4.12 micelle"],["hard","hard water / scum"],["agitate","why we beat clothes"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.soap = {mount: mount, draw: draw, select: select, state: st};
})();
