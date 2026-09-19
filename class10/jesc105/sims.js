// Class 10 Science, Chapter 5 (jesc105) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, C = L.C, st = {preset: "auto"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Life processes keep molecular order. Autotrophs build food from CO₂ and water; heterotrophs take complex food (and depend on autotrophs).");
    L.legend([["#22c55e","autotroph"],["#f59e0b","heterotroph"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      auto: {t:"Autotrophs (green plants, some bacteria)", d:"CO₂ + water → carbohydrate using sunlight and chlorophyll. Store extra as starch (we store glycogen)."},
      hetero: {t:"Heterotrophs (animals, fungi)", d:"Complex food, broken down with enzymes. Holozoic (Amoeba, humans), saprophytic (fungi), parasitic."},
      amoeba: {t:"Amoeba — holozoic", d:"Food vacuole: ingest, digest with enzymes, absorb, egest. The whole surface meets the environment — no organs needed."}
    };
    var r = map[st.preset];
    var m = L.text(360, 70, r.t, {size: 18, weight: 700}) + L.text(360, 150, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Mode", r.t], ["Key", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d + " Diffusion is enough for unicells; multicells need specialised tissues plus a transport system.");
  }
  function mount(){
    L.presets([["auto","autotrophic"],["hetero","heterotrophic"],["amoeba","Amoeba"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.modes = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "eq"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.6});
    L.watch("Activity 5.1: destarch 3 days, then sunlight; iodine turns only the green parts blue-black. Activity 5.2: KOH absorbs CO₂, less starch.");
    L.legend([["#22c55e","starch / chlorophyll"],["#eab308","iodine"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var m = "";
    if(st.preset === "eq"){
      m += L.text(360, 80, "6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O", {size: 16, weight: 700});
      m += L.text(360, 130, "chlorophyll + sunlight", {size: 16, color: C.ok});
      m += L.text(360, 190, "(i) light absorbed (ii) water split (iii) CO₂ reduced to carbohydrate", {size: 14});
      L.readout([["Equation","6CO₂ + 12H₂O → glucose + 6O₂ + 6H₂O"],["Needs","CO₂, water, sunlight, chlorophyll"],["Store","starch (iodine: blue-black)"]]);
      L.verdict("<b>Photosynthesis</b> as printed: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O with chlorophyll and sunlight. Exercise Q3: all of CO₂, water, chlorophyll, sunlight.");
    } else if(st.preset === "iodine"){
      m += L.text(360, 80, "variegated leaf after destarching + sunlight", {size: 16, weight: 700});
      m += L.rect(180, 120, 120, 80, "#22c55e", ' rx="8"') + L.text(240, 220, "green: starch", {size: 13});
      m += L.rect(400, 120, 120, 80, "#fde68a", ' rx="8"') + L.text(460, 220, "white: no starch", {size: 13});
      L.readout([["Iodine","blue-black only where chlorophyll was"],["Conclusion","chlorophyll is essential"]]);
      L.verdict("<b>Activity 5.1:</b> iodine turns <b>only the green regions</b> blue-black. Starch formed where chlorophyll was present.");
    } else {
      m += L.text(360, 90, "guard cells swell → stoma opens; shrink → closes", {size: 16, weight: 700});
      m += L.text(360, 160, "CO₂ in, O₂ and water vapour out. Close when CO₂ is not needed, to save water.", {size: 14});
      L.readout([["Pores","stomata"],["Open","guard cells turgid"],["Also","gas exchange on stems and roots too"]]);
      L.verdict("<b>Stomata:</b> opening and closing is a function of guard cells. Desert plants take CO₂ at night.");
    }
    L.svg(m, "photosynthesis", 300);
  }
  function mount(){
    L.presets([["eq","the printed equation"],["iodine","Activity 5.1 iodine"],["stomata","guard cells"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.photo = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "mouth"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Food is broken down along the alimentary canal. Villi in the small intestine absorb into blood.");
    L.legend([["#fbbf24","enzyme"],["#38bdf8","bile / acid"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      mouth: {t:"Mouth — saliva", d:"Salivary amylase starts starch → sugar. Teeth chew. (Exercise Q6)"},
      stomach: {t:"Stomach — HCl + pepsin", d:"HCl makes the medium acidic and kills microbes. Pepsin digests proteins. Mucus protects the wall."},
      gut: {t:"Small intestine — bile, pancreas, villi", d:"Bile (liver) emulsifies fats (Q5). Pancreatic enzymes finish carbs, proteins, fats. Villi increase surface area. Large intestine absorbs water."}
    };
    var r = map[st.preset];
    var m = L.text(360, 70, r.t, {size: 18, weight: 700}) + L.text(360, 150, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Region", r.t], ["Job", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["mouth","saliva / Q6"],["stomach","HCl + pepsin"],["gut","bile, villi, Q5"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.digest = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "paths"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.6});
    L.watch("Glucose → pyruvate (3-carbon) in cytoplasm. With O₂, mitochondria: CO₂ + water + energy. Without O₂: ethanol+CO₂ (yeast) or lactic acid (muscle).");
    L.legend([["#22c55e","aerobic"],["#f59e0b","anaerobic"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var m = "";
    if(st.preset === "paths"){
      m += L.text(360, 60, "cytoplasm: glucose → pyruvate (3-C)", {size: 16, weight: 700});
      m += L.text(360, 120, "mitochondria + O₂: CO₂ + H₂O + energy (ATP)", {size: 16, color: C.ok});
      m += L.text(360, 180, "no O₂: yeast ethanol+CO₂; muscle lactic acid", {size: 15});
      L.readout([["Pyruvate made in","cytoplasm"],["Pyruvate + O₂","mitochondria (Q4)"],["Aerobic vs anaerobic","much more ATP with oxygen"]]);
      L.verdict("<b>Q4:</b> breakdown of pyruvate to CO₂, water and energy is in the <b>mitochondria</b>. Aerobic respiration yields more energy than anaerobic.");
    } else {
      m += L.text(360, 80, "alveoli: large surface, thin walls, rich blood supply", {size: 16, weight: 700});
      m += L.text(360, 150, "maximise diffusion of O₂ in, CO₂ out", {size: 16});
      L.readout([["Haemoglobin","carries O₂ in blood"],["Deficiency","less O₂ to cells → fatigue (Q10)"],["Land vs water","air has more O₂ than water"]]);
      L.verdict("<b>Alveoli</b> are designed for exchange: huge surface area, moist thin walls, capillaries. Haemoglobin deficiency means less oxygen reaches tissues.");
    }
    L.svg(m, "respiration", 300);
  }
  function mount(){
    L.presets([["paths","glucose paths / Q4"],["alveoli","alveoli design / Q9"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.respire = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "heart"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.7});
    L.watch("Double circulation: pulmonary (heart–lungs) and systemic (heart–body). Oxygenated and deoxygenated blood stay separate.");
    L.legend([["#ef4444","oxygenated"],["#38bdf8","deoxygenated"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var m = L.text(360, 70, "four chambers: two atria, two ventricles", {size: 16, weight: 700});
    m += L.text(360, 130, "arteries away (thick); veins back (valves); capillaries exchange", {size: 15});
    m += L.text(360, 190, "lymph returns fluid and fats from villi", {size: 15});
    L.svg(m, "circulation", 300);
    L.readout([["Double circulation","keeps O₂-rich and O₂-poor blood apart"],["Why needed","high energy, efficient O₂ for warm-blooded body"],["BP","force of blood on artery wall"]]);
    L.verdict("<b>Double circulation</b> is necessary so that oxygenated blood is not mixed with deoxygenated blood, giving a better oxygen supply.");
  }
  function mount(){
    L.presets([["heart","double circulation"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.heart = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "xylem"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Xylem: water and minerals upward (transpiration pull). Phloem: food both ways, uses ATP (translocation).");
    L.legend([["#38bdf8","xylem water"],["#22c55e","phloem food"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var r = st.preset === "xylem"
      ? {t:"Xylem — water and minerals", d:"Root to leaves, one direction. Transpiration from leaves pulls the column. Exercise Q2."}
      : {t:"Phloem — translocation of food", d:"Sucrose from leaves to other parts, up or down. Energy from ATP. Also amino acids, hormones."};
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Tissue", r.t], ["Job", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["xylem","xylem / Q2"],["phloem","phloem / Q12"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.plantpipe = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "nephron"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.6});
    L.watch("Nephron: glomerulus filters, tubule reabsorbs useful molecules. Urine amount depends on water and ADH. Dialysis when kidneys fail.");
    L.legend([["#e2e8f0","filtrate"],["#38bdf8","reabsorb"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      nephron: {t:"Nephron", d:"Each kidney has about a million. Cluster of capillaries (glomerulus) filters; tubular reabsorption takes back glucose, amino acids, some salts and water."},
      plants: {t:"Plant excretion", d:"O₂ from photosynthesis, CO₂ at night, water by transpiration, vacuoles, falling leaves, resins and gums, some into soil."}
    };
    var r = map[st.preset];
    var m = L.text(360, 70, r.t, {size: 18, weight: 700}) + L.text(360, 150, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Topic", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d + " Exercise Q1: kidneys are part of excretion.");
  }
  function mount(){
    L.presets([["nephron","nephron / Q1"],["plants","plants / in-text"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.excrete = {mount: mount, draw: draw, select: select, state: st};
})();
