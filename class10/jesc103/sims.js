// Class 10 Science, Chapter 3 (jesc103) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

var SERIES = ["K","Na","Ca","Mg","Al","Zn","Fe","Pb","H","Cu","Hg","Ag","Au"];
function rank(m){ return SERIES.indexOf(m); }

// Lab 1 — physical properties
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "lustre"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.25, speed: 0.6});
    L.watch({
      lustre: "Activity 3.1. Rub iron, copper, aluminium, magnesium with sandpaper. Pure metals have a shining surface — metallic lustre. Iodine is a lustrous non-metal (exception).",
      hammer: "Activity 3.3. Gold and silver are the most malleable. Alkali metals are so soft they cut with a knife. Mercury is a liquid.",
      goldwire: "Activity 3.4. Gold is the most ductile: about 2 km of wire from 1 g of gold.",
      heat: "Activity 3.5 / Fig. 3.1. Silver and copper are the best conductors of heat; lead and mercury are comparatively poor. Gallium and caesium melt on the palm."
    }[id]);
    L.legend([["#fbbf24","metal"],["#94a3b8","non-metal exception"]]);
    L.controls(""); L.restart(true);
  }
  function draw(){
    var m = "", v, r;
    if(st.preset === "lustre"){
      m += L.rect(80, 80, 120, 80, "#f59e0b", ' rx="8"') + L.text(140, 180, "Cu after sandpaper", {size: 13});
      m += L.rect(280, 80, 120, 80, "#94a3b8", ' rx="8"') + L.text(340, 180, "dull before cleaning", {size: 13});
      m += L.rect(480, 80, 120, 80, "#c4b5fd", ' rx="8"') + L.text(540, 180, "iodine (lustrous non-metal)", {size: 12});
      v = "<b>Metallic lustre</b> after cleaning. Exception: iodine is a non-metal but lustrous.";
      r = [["Property","lustre"],["Exception","iodine"]];
    } else if(st.preset === "hammer"){
      m += L.text(360, 80, "malleable: beaten into thin sheets (Au, Ag most)", {size: 16, weight: 700});
      m += L.text(360, 130, "ductile: drawn into wires", {size: 16, weight: 700});
      m += L.text(360, 180, "Na, K: cut with a knife. Hg: liquid at room temperature.", {size: 15});
      m += L.text(360, 230, "Ga and Cs melt if kept on your palm.", {size: 15, color: C.muted});
      v = "<b>Malleability and hardness vary.</b> Gold and silver are the most malleable. Alkali metals are soft. Mercury is the liquid metal.";
      r = [["Most malleable","gold and silver"],["Liquid metal","mercury"],["Soft (knife)","sodium, potassium"]];
    } else if(st.preset === "goldwire"){
      m += L.line(80, 150, 640, 150, "#fbbf24", 4);
      m += L.text(360, 90, "1 g of gold → about 2 km of wire", {size: 20, weight: 700});
      m += L.text(360, 200, "Gold is the most ductile metal.", {size: 16});
      v = "<b>Ductility:</b> a wire of about <b>2 km</b> can be drawn from <b>1 g</b> of gold.";
      r = [["Mass","1 g gold"],["Length","about 2 km"],["Most ductile","gold"]];
    } else {
      m += L.rect(100, 90, 200, 20, "#f59e0b") + L.circle(310, 100, 8, "#f8fafc");
      m += L.text(200, 140, "Ag, Cu: heat travels; wax drops", {size: 14});
      m += L.text(360, 200, "Best heat conductors: silver and copper. Poor: lead and mercury.", {size: 15, weight: 700});
      m += L.text(360, 240, "Fig. 3.2: metals conduct electricity. Graphite (non-metal) also conducts.", {size: 14, color: C.muted});
      v = "<b>Activity 3.5:</b> metals are good conductors of heat and have high melting points (exceptions Ga, Cs). Best: <b>silver and copper</b>. Poor: lead and mercury.";
      r = [["Best heat","silver, copper"],["Poor heat","lead, mercury"],["Also conducts","graphite"]];
    }
    L.svg(m, "physical properties", 300);
    L.readout(r); L.verdict(v);
  }
  function mount(){
    L.presets([["lustre","Activity 3.1: lustre"],["hammer","malleable / soft / liquid"],["goldwire","1 g gold → 2 km"],["heat","Activity 3.5: heat"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.physical = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — air and water
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "na"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.2, speed: 0.8});
    L.watch({
      na: "Na/K in cold water: hydrogen catches fire. Kept in kerosene. 2Na + 2H₂O → 2NaOH + H₂ + heat.",
      ca: "Calcium: less violent, Ca floats (H₂ bubbles stick). Mg needs hot water and also floats.",
      steam: "Al, Fe, Zn do not react with cold or hot water but do with steam. 3Fe + 4H₂O(g) → Fe₃O₄ + 4H₂. Cu, Ag, Au do not react with water at all.",
      amph: "Al₂O₃ and ZnO are amphoteric: they react with both acids and bases."
    }[id]);
    L.legend([["#fbbf24","H₂ / fire"],["#38bdf8","water"],["#a78bfa","oxide"]]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var p = Math.min(1, t/5), m = "", v, r;
    if(st.preset === "na"){
      m += L.rect(200, 140, 320, 80, "rgba(56,189,248,0.3)", ' rx="8"');
      m += L.circle(280, 150 - 40*p, 14, "#e2e8f0");
      if(p > 0.3) m += L.circle(400, 90, 30*p, "rgba(251,191,36,0.5)") + L.text(400, 90, "H₂ fire", {size: 13});
      m += L.text(360, 250, "2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g) + heat", {size: 15, weight: 700});
      v = "<b>Sodium and potassium</b> react so violently with cold water that the hydrogen catches fire. They are kept immersed in kerosene.";
      r = [["Metals","Na, K"],["With cold water","violent; H₂ burns"],["Stored in","kerosene"]];
    } else if(st.preset === "ca"){
      m += L.rect(200, 140, 320, 80, "rgba(56,189,248,0.3)", ' rx="8"');
      m += L.circle(360, 145, 16, "#cbd5e1");
      for(var i=0;i<6;i++) m += L.circle(340+(i%3)*16, 130-(i%2)*12*p, 5, "#7dd3fc");
      m += L.text(360, 250, "Ca(s) + 2H₂O(l) → Ca(OH)₂(aq) + H₂(g)  —  calcium floats", {size: 14, weight: 700});
      v = "<b>Calcium</b> reacts less violently; heat is not enough to ignite H₂. It <b>floats</b> because hydrogen bubbles stick to it. Magnesium needs hot water and also floats.";
      r = [["Ca + water","less violent; floats"],["Mg","hot water, also floats"]];
    } else if(st.preset === "steam"){
      m += L.text(360, 70, "3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)", {size: 18, weight: 700});
      m += L.text(360, 120, "2Al + 3H₂O(g) → Al₂O₃ + 3H₂", {size: 16});
      m += L.text(360, 180, "Lead, copper, silver, gold: no reaction with water.", {size: 15, color: C.muted});
      v = "<b>Steam</b> on iron, aluminium or zinc gives the oxide and hydrogen. Cu, Ag, Au do not react with water at all.";
      r = [["Iron + steam","Fe₃O₄ + H₂"],["No reaction","Pb, Cu, Ag, Au"]];
    } else {
      m += L.text(360, 80, "Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O", {size: 16, weight: 700});
      m += L.text(360, 130, "Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O", {size: 16, weight: 700});
      m += L.text(360, 200, "Amphoteric oxides react with both acids and bases.", {size: 15});
      v = "<b>Amphoteric oxides</b> (Al₂O₃, ZnO) react with acids and with bases to give salt and water. Most other metal oxides are basic. Na₂O + H₂O → 2NaOH.";
      r = [["Amphoteric","Al₂O₃, ZnO"],["Alkali from oxide","Na₂O, K₂O + water"]];
    }
    L.svg(m, "air and water", 300); L.readout(r); L.verdict(v);
  }
  function mount(){
    L.presets([["na","Na/K + cold water"],["ca","Ca floats"],["steam","iron + steam"],["amph","amphoteric Al₂O₃"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.airwater = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — acids and reactivity series
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "hcl"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.2, speed: 0.7});
    L.watch({
      hcl: "Activity 3.11. Mg > Al > Zn > Fe with dilute HCl. Copper: no bubbles, no temperature rise. Do not use Na or K.",
      disp: "Activity 3.12. Iron nail in CuSO₄: brown copper, blue fades. Copper wire in FeSO₄: no reaction. Iron is more reactive than copper.",
      series: "Table 3.2. K Na Ca Mg Al Zn Fe Pb [H] Cu Hg Ag Au. Metals above hydrogen displace H₂ from dilute acids.",
      aqua: "Aqua regia: freshly mixed conc. HCl : conc. HNO₃ = 3 : 1. Dissolves gold and platinum."
    }[id]);
    L.legend([["#22c55e","more reactive"],["#ef4444","less reactive"]]);
    L.controls(""); L.restart(true);
  }
  function draw(){
    var m = "", v, r;
    if(st.preset === "hcl"){
      m += L.text(360, 70, "Mg > Al > Zn > Fe   with dilute HCl", {size: 18, weight: 700});
      m += L.text(360, 130, "Cu: no bubbles, temperature unchanged", {size: 16, color: C.muted});
      m += L.text(360, 190, "HNO₃ is a strong oxidising agent — H₂ is usually not evolved", {size: 14});
      m += L.text(360, 230, "(exceptions: Mg and Mn with very dilute HNO₃).", {size: 14, color: C.muted});
      v = "<b>Activity 3.11:</b> bubble rate and heat were greatest for magnesium. Reactivity with dilute HCl: <b>Mg > Al > Zn > Fe</b>. Copper does not react. HNO₃ usually gives no H₂.";
      r = [["Order","Mg > Al > Zn > Fe"],["Copper + dil. HCl","no reaction"],["HNO₃","oxidises H₂; except Mg, Mn very dilute"]];
    } else if(st.preset === "disp"){
      m += L.rect(140, 80, 140, 120, "#1d4ed8", ' rx="10"') + L.text(210, 220, "CuSO₄ + Fe nail", {size: 13});
      m += L.rect(210, 90, 12, 80, "#b45309");
      m += L.rect(420, 80, 140, 120, "#86efac", ' rx="10"') + L.text(490, 220, "FeSO₄ + Cu wire", {size: 13});
      m += L.text(360, 260, "Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)", {size: 15, weight: 700});
      v = "<b>Activity 3.12:</b> iron displaces copper. A more reactive metal displaces a less reactive metal from its salt solution.";
      r = [["Reaction","displacement"],["More reactive","iron"],["No reaction","Cu in FeSO₄"]];
    } else if(st.preset === "series"){
      m += L.text(360, 50, "K  Na  Ca  Mg  Al  Zn  Fe  Pb  [H]  Cu  Hg  Ag  Au", {size: 14, weight: 700});
      m += L.text(120, 120, "most reactive", {size: 13, color: "#22c55e"}) + L.text(600, 120, "least reactive", {size: 13, color: "#ef4444"});
      m += L.text(360, 180, "Above H: displace H₂ from dilute acids. Below H: do not.", {size: 15});
      v = "<b>Table 3.2 activity series</b> (decreasing reactivity). Metals above hydrogen displace hydrogen from dilute acids.";
      r = [["Top","K, Na, Ca"],["Above H","Mg, Al, Zn, Fe, Pb"],["Below H","Cu, Hg, Ag, Au"]];
    } else {
      m += L.text(360, 100, "aqua regia = conc. HCl : conc. HNO₃ = 3 : 1", {size: 18, weight: 700});
      m += L.text(360, 160, "Latin ‘royal water’ — dissolves gold and platinum.", {size: 16});
      v = "<b>Aqua regia</b> is a freshly prepared mixture of concentrated hydrochloric acid and concentrated nitric acid in the ratio <b>3 : 1</b>. Neither acid alone dissolves gold.";
      r = [["Ratio","3 : 1"],["Acids","conc. HCl + conc. HNO₃"],["Dissolves","gold, platinum"]];
    }
    L.svg(m, "reactivity", 300); L.readout(r); L.verdict(v);
  }
  function mount(){
    L.presets([["hcl","Activity 3.11: dil. HCl"],["disp","Activity 3.12: Fe/Cu"],["series","Table 3.2 series"],["aqua","aqua regia 3:1"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.series = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — ionic compounds
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "nacl"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch({
      nacl: "Fig. 3.5. Na (2,8,1) loses one electron → Na⁺. Cl (2,8,7) gains it → Cl⁻. Ions attract: NaCl is an aggregate, not a molecule.",
      mgcl: "Fig. 3.6. Mg (2,8,2) loses two electrons; two Cl atoms each gain one → MgCl₂.",
      props: "Activity 3.13 / Table 3.4. NaCl melts at 1074 K, boils at 1686 K. Solids, brittle, soluble in water not kerosene. Conduct when molten or aqueous, not as solids."
    }[id]);
    L.legend([["#38bdf8","cation"],["#f472b6","anion"]]);
    L.controls(""); L.restart(true);
  }
  function draw(){
    var m = "", v, r;
    if(st.preset === "nacl"){
      m += L.circle(200, 140, 40, "#38bdf8") + L.text(200, 145, "Na  2,8,1", {size: 13});
      m += L.arrow(260, 140, 340, 140, C.text, 3) + L.text(300, 120, "e⁻", {size: 14, color: "#fbbf24"});
      m += L.circle(420, 140, 40, "#f472b6") + L.text(420, 145, "Cl  2,8,7", {size: 13});
      m += L.text(360, 230, "Na⁺  2,8    Cl⁻  2,8,8     held by electrostatic attraction", {size: 15, weight: 700});
      v = "<b>Fig. 3.5:</b> sodium loses one electron, chlorine gains it. NaCl is held by strong electrostatic forces; it is an aggregate of ions, not molecules.";
      r = [["Na","2,8,1 → Na⁺ 2,8"],["Cl","2,8,7 → Cl⁻ 2,8,8"],["Bond","ionic / electrovalent"]];
    } else if(st.preset === "mgcl"){
      m += L.text(360, 80, "Mg (2,8,2) → Mg²⁺ + 2e⁻", {size: 18, weight: 700});
      m += L.text(360, 140, "2 Cl + 2e⁻ → 2 Cl⁻", {size: 18, weight: 700});
      m += L.text(360, 200, "cation Mg²⁺, anions 2 Cl⁻", {size: 16});
      v = "<b>Fig. 3.6:</b> magnesium chloride. The cation is Mg²⁺ and the anions are Cl⁻.";
      r = [["Cation","Mg²⁺"],["Anion","Cl⁻"],["Formula","MgCl₂"]];
    } else {
      m += L.text(360, 70, "NaCl melting point 1074 K, boiling point 1686 K", {size: 16, weight: 700});
      m += L.text(360, 130, "solid: no conduction (ions locked). molten / aqueous: ions move.", {size: 15});
      m += L.text(360, 190, "soluble in water; insoluble in kerosene and petrol.", {size: 15});
      v = "<b>Ionic compounds</b> are hard, brittle solids with high melting points (Table 3.4). They conduct in the molten or aqueous state, not as solids.";
      r = [["NaCl mp","1074 K"],["Solid","does not conduct"],["Molten / solution","conducts"]];
    }
    L.svg(m, "ionic compounds", 300); L.readout(r); L.verdict(v);
  }
  function mount(){
    L.presets([["nacl","Fig. 3.5: NaCl"],["mgcl","Fig. 3.6: MgCl₂"],["props","Activity 3.13: properties"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.ionic = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — extraction
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "map"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.25, speed: 0.6});
    L.watch({
      map: "Fig. 3.9. High reactivity (K–Al): electrolysis. Middle (Zn, Fe, Pb): reduction with carbon after roasting/calcination. Low (Cu, Ag, Au): native or heat alone.",
      roast: "Roasting: sulphide + excess air → oxide. Calcination: carbonate, limited air → oxide. Then ZnO + C → Zn + CO.",
      thermit: "Thermit: Fe₂O₃ + 2Al → 2Fe + Al₂O₃ + heat. Used to join railway tracks. 3MnO₂ + 4Al is the manganese example.",
      refine: "Electrolytic refining of copper: impure anode, pure cathode, acidified CuSO₄. Anode mud = insoluble impurities."
    }[id]);
    L.legend([["#22c55e","native / heat"],["#fbbf24","carbon reduction"],["#38bdf8","electrolysis"]]);
    L.controls(""); L.restart(true);
  }
  function draw(){
    var m = "", v, r;
    if(st.preset === "map"){
      m += L.text(360, 60, "K Na Ca Mg Al   →  electrolysis of molten compounds", {size: 15, color: "#38bdf8"});
      m += L.text(360, 110, "Zn Fe Pb         →  roast/calcine, then carbon", {size: 15, color: "#fbbf24"});
      m += L.text(360, 160, "Cu Ag Au         →  native, or heat alone (cinnabar, Cu₂S)", {size: 15, color: "#22c55e"});
      m += L.text(360, 230, "ore = profitable mineral; gangue = sand/soil impurities", {size: 14, color: C.muted});
      v = "<b>Fig. 3.9:</b> the activity series decides the extraction method. Highly reactive metals cannot be reduced by carbon; they need electrolytic reduction.";
      r = [["High","electrolysis"],["Middle","carbon after roasting/calcination"],["Low","native or heat"]];
    } else if(st.preset === "roast"){
      m += L.text(360, 70, "roasting: 2ZnS + 3O₂ → 2ZnO + 2SO₂", {size: 16, weight: 700});
      m += L.text(360, 120, "calcination: ZnCO₃ → ZnO + CO₂", {size: 16, weight: 700});
      m += L.text(360, 180, "then ZnO + C → Zn + CO", {size: 16, weight: 700});
      v = "<b>Roasting</b> (sulphide, excess air) vs <b>calcination</b> (carbonate, limited air). Oxides are then reduced, often with carbon.";
      r = [["Roasting","sulphide + excess air"],["Calcination","carbonate, limited air"],["Reduction","ZnO + C → Zn + CO"]];
    } else if(st.preset === "thermit"){
      m += L.text(360, 90, "Fe₂O₃(s) + 2Al(s) → 2Fe(l) + Al₂O₃(s) + Heat", {size: 17, weight: 700});
      m += L.text(360, 160, "joins railway tracks and cracked machine parts", {size: 15});
      v = "<b>Thermit reaction:</b> iron(III) oxide with aluminium. The heat is enough to produce molten iron. Al is oxidised; Fe₂O₃ is reduced.";
      r = [["Thermit","Fe₂O₃ + 2Al"],["Also","3MnO₂ + 4Al"],["Used for","railway tracks"]];
    } else {
      m += L.rect(160, 80, 30, 120, "#b45309") + L.text(175, 220, "impure anode", {size: 12});
      m += L.rect(520, 80, 30, 120, "#fbbf24") + L.text(535, 220, "pure cathode", {size: 12});
      m += L.rect(220, 140, 280, 50, "rgba(56,189,248,0.3)") + L.text(360, 170, "acidified CuSO₄", {size: 14});
      m += L.text(360, 260, "anode mud settles under the anode", {size: 14, color: C.muted});
      v = "<b>Electrolytic refining:</b> impure metal is the anode, a thin strip of pure metal is the cathode, a salt solution is the electrolyte. Insoluble impurities form <b>anode mud</b>.";
      r = [["Anode","impure metal"],["Cathode","pure metal"],["Mud","insoluble impurities"]];
    }
    L.svg(m, "extraction", 300); L.readout(r); L.verdict(v);
  }
  function mount(){
    L.presets([["map","Fig. 3.9: three bands"],["roast","roast / calcine / C"],["thermit","thermit, rails"],["refine","electrolytic refining"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.extract = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — rust and alloys
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "rust"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.2, speed: 0.7});
    L.watch({
      rust: "Activity 3.14. Tube A: air + water → rust. B: boiled water + oil (no air). C: anhydrous CaCl₂ (dry air). Only A rusts.",
      galv: "Galvanisation coats iron with zinc. The article stays protected even if the zinc is broken, because zinc is more reactive.",
      alloys: "Brass Cu+Zn, bronze Cu+Sn, solder Pb+Sn (low mp), amalgam contains Hg. 22-carat gold = 22 parts gold + 2 parts Cu or Ag. Stainless steel: Fe + Ni + Cr."
    }[id]);
    L.legend([["#7c2d12","rust"],["#a1a1aa","zinc coat"],["#fbbf24","alloy"]]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var p = Math.min(1,t/5), m = "", v, r;
    if(st.preset === "rust"){
      m += L.rect(80, 80, 140, 140, "#0f172a", ' rx="10"') + L.text(150, 240, "A air+water: rusts", {size: 12, color: "#7c2d12"});
      m += L.rect(80+12, 160, 116, 8, "#7c2d12");
      m += L.rect(290, 80, 140, 140, "#0f172a", ' rx="10"') + L.text(360, 240, "B water, no air", {size: 12});
      m += L.rect(500, 80, 140, 140, "#0f172a", ' rx="10"') + L.text(570, 240, "C dry air", {size: 12});
      v = "<b>Activity 3.14:</b> iron rusts only when <b>both air and water</b> are present. Silver blackens (Ag₂S); copper greens (basic copper carbonate).";
      r = [["Tube A","rusts (air + water)"],["B and C","no rust"],["Need","both air and water"]];
    } else if(st.preset === "galv"){
      m += L.rect(200, 110, 320, 40, "#a1a1aa", ' rx="6"') + L.rect(220, 118, 280, 24, "#94a3b8");
      m += L.text(360, 180, "zinc coat on iron / steel", {size: 16, weight: 700});
      m += L.text(360, 220, "protected even if the zinc coating is broken", {size: 14, color: C.muted});
      v = "<b>Galvanisation:</b> a thin zinc coat. Zinc is more reactive than iron, so it is preferentially oxidised even at a scratch. Other methods: paint, oil, grease, chrome plating, anodising, alloys.";
      r = [["Coat","zinc"],["Even if broken","still protected"],["Stainless steel","Fe + Ni + Cr"]];
    } else {
      m += L.text(360, 60, "brass: Cu + Zn     bronze: Cu + Sn", {size: 16, weight: 700});
      m += L.text(360, 110, "solder: Pb + Sn (low melting, welding wires)", {size: 16});
      m += L.text(360, 160, "amalgam: alloy with mercury", {size: 16});
      m += L.text(360, 210, "22-carat gold: 22 parts gold + 2 parts Cu or Ag", {size: 16, weight: 700});
      v = "<b>An alloy</b> is a homogeneous mixture of two or more metals, or a metal and a non-metal. 24-carat gold is too soft; India uses 22-carat for jewellery. Conductivity and melting point of an alloy are less than those of the pure metals.";
      r = [["Brass","Cu + Zn"],["Bronze","Cu + Sn"],["22-carat","22 gold + 2 Cu or Ag"]];
    }
    L.svg(m, "corrosion and alloys", 300); L.readout(r); L.verdict(v);
  }
  function mount(){
    L.presets([["rust","Activity 3.14: three tubes"],["galv","galvanisation"],["alloys","brass / 22-carat"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.corrode = {mount: mount, draw: draw, select: select, state: st};
})();
