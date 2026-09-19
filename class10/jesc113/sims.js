// Class 10 Science, Chapter 13 (jesc113) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "parts"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Ecosystem = biotic + abiotic. Producers, consumers, decomposers.");
    L.legend([["#22c55e","producer"],["#f59e0b","consumer"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      parts: {t:"Biotic and abiotic", d:"Living organisms plus temperature, rainfall, wind, soil, minerals. A garden is an ecosystem."},
      roles: {t:"Three roles", d:"Producers photosynthesise. Consumers eat (herbivore, carnivore, omnivore, parasite). Decomposers return minerals to the soil."},
      aqua: {t:"Aquarium vs pond", d:"A jar needs cleaning; a pond is large enough for decomposers to keep it going. Gardens and crop-fields are human-made."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["parts","biotic/abiotic"],["roles","three roles"],["aqua","aquarium"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.eco = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "chain"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("About 1% of sunlight on leaves becomes food. About 10% of food eaten reaches the next level.");
    L.legend([["#22c55e","1%"],["#eab308","10%"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      chain: {t:"Trophic levels", d:"Producers → herbivores → small carnivores → large carnivores. Example chain: grass, goat and human (Q2)."},
      ten: {t:"1% then 10%", d:"Plants capture about 1% of sunlight on their leaves. An average of 10% of food eaten becomes the next body. Chains stay 3–4 steps."},
      web: {t:"Web and one-way energy", d:"Branching food web. Energy is unidirectional and diminishes — it does not flow back to the Sun or to plants."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["chain","chain"],["ten","10% rule"],["web","web"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.troph = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "enter"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Non-degradable pesticides climb the chain. Highest in humans.");
    L.legend([["#ef4444","chemical"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      enter: {t:"How they enter", d:"Washed to soil and water, taken up by plants and aquatic organisms, then eaten."},
      top: {t:"Highest at the top", d:"Not degradable, so they accumulate at each trophic level. Maximum in top consumers — humans. Washing does not always remove residues."},
      q4: {t:"Remove a level (Q4–Q5)", d:"Next level starves; previous may overgrow. Impact differs by which level you remove; none is free to delete."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["enter","entry"],["top","magnification"],["q4","kill a level"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.mag = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "form"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("O3 shields UV. CFCs; UNEP 1987 freeze at 1986 levels.");
    L.legend([["#38bdf8","O3"],["#ef4444","UV"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      form: {t:"O2 to O3", d:"UV splits O2 into O atoms; O + O2 → O3. High up it is a UV shield; near the ground it is a poison."},
      uv: {t:"Why we care", d:"UV can cause skin cancer. Less ozone, more UV at the surface."},
      unep: {t:"UNEP 1987", d:"Freeze CFC production at 1986 levels. CFC-free refrigerators are now mandatory worldwide."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["form","formation"],["uv","UV"],["unep","UNEP 1987"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.o3 = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "bio"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Plastic persists. Q3: cloth bags, switch off extras, walk — all of the above.");
    L.legend([["#22c55e","biodegradable"],["#64748b","plastic"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      bio: {t:"Bio vs non-bio", d:"Enzymes are specific — plastics are not lunch. Grass, wood, leather, peels rot; plastic in Q1 (b) does not."},
      cups: {t:"Kulhad vs paper", d:"Plastic cups → clay kulhads (lose top-soil) → paper cups. Hygiene vs soil vs persist."},
      q3: {t:"Q3 all of the above", d:"Cloth bags, switching off extra lights and fans, walking to school. All-biodegradable waste can still harm if we dump too much (Q8)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["bio","bio vs plastic"],["cups","cups"],["q3","Q3"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.waste = {mount: mount, draw: draw, select: select, state: st};
})();
