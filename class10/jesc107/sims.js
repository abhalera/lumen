// Class 10 Science, Chapter 7 (jesc107) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "copy"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("DNA copying is the basic event. Copies are similar, not identical. Variation helps the species if the niche changes.");
    L.legend([["#38bdf8","DNA"],["#f59e0b","variation"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      copy: {t:"DNA copy + cell apparatus", d:"The blueprint for proteins must travel with a cell. A naked DNA dump would not maintain life processes."},
      vary: {t:"Copying is not perfect", d:"Drastic errors die. Milder variants survive. That inbuilt tendency is the basis for evolution."},
      niche: {t:"Stability of a niche (Q10)", d:"Consistent DNA copying maintains body designs that fit a niche, so populations stay stable. Heat-resistant bacteria could survive warming."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Idea", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["copy","DNA copy"],["vary","variation"],["niche","niche / Q10"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.dna = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "amoeba"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Unicells: fission is reproduction. Exercise Q1: budding is yeast, not these three.");
    L.legend([["#22c55e","binary"],["#f59e0b","multiple"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      amoeba: {t:"Amoeba — binary fission", d:"Splits into two equal halves. The plane can be any plane. Fig. 7.1(a)."},
      leish: {t:"Leishmania — oriented binary", d:"Whip-like structure (kala-azar parasite). Binary fission has a definite orientation. Fig. 7.1(b)."},
      plasma: {t:"Plasmodium — multiple fission", d:"Malarial parasite. Many daughter cells at once. Fig. 7.2. Yeast instead buds (Q1)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Organism", r.t], ["Mode", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["amoeba","Amoeba"],["leish","Leishmania"],["plasma","Plasmodium"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.fission = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "spiro"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Simple bodies can fragment. Regeneration is not the same as everyday reproduction. Hydra and yeast bud.");
    L.legend([["#22c55e","piece / bud"],["#a78bfa","development"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      spiro: {t:"Spirogyra — fragmentation", d:"A simple filament breaks into pieces; each grows. Activity 7.4: not a stack of organs."},
      planaria: {t:"Planaria — regeneration", d:"Pieces grow into complete organisms via specialised cells, then development. Not the usual reproductive method."},
      hydra: {t:"Hydra / yeast — budding", d:"Outgrowth at one site; matures and detaches. Exercise Q1: yeast buds."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Example", r.t], ["How", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["spiro","Spirogyra"],["planaria","Planaria"],["hydra","Hydra / yeast"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.frag = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "potato"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Vegetative: parent traits, earlier fruit, seedless crops. Spores wait in thick walls. All of this is asexual.");
    L.legend([["#22c55e","vegetative"],["#f59e0b","spore"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      potato: {t:"Potato eyes / Bryophyllum", d:"Activity 7.5: pieces with a bud grow. Fig. 7.5: buds in leaf-margin notches. Money-plant cuttings need a leaf (Activity 7.6)."},
      culture: {t:"Tissue culture and grafting", d:"Tip cells → callus → hormones → plantlets. Layering/grafting: sugarcane, roses, grapes. Banana, orange, rose, jasmine may lack seeds."},
      spore: {t:"Rhizopus spores", d:"Hyphae are not the reproductive part. Sporangia hold thick-walled spores until a moist surface. Asexual: one parent."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Method", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["potato","potato / leaf buds"],["culture","tissue culture"],["spore","Rhizopus spores"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.veg = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "parts"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Meiosis halves DNA in germ-cells so fusion does not double it. Anther contains pollen grains (Q3).");
    L.legend([["#fbbf24","pollen / stamen"],["#f472b6","pistil"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      parts: {t:"Flower parts (Fig. 7.7)", d:"Sepals, petals, stamens (anther contains pollen grains), pistil: stigma, style, ovary with ovules."},
      sexes: {t:"Unisexual vs bisexual", d:"Unisexual: papaya, watermelon (stamens or pistil). Bisexual: Hibiscus, mustard (both)."},
      meiosis: {t:"Why germ-cells are haploid", d:"Two parents would double DNA each generation. Meiosis makes germ-cells with half the DNA; fusion restores the number."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Topic", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["parts","LS flower / Q3"],["sexes","unisexual / bisexual"],["meiosis","meiosis accounting"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.flower = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "poll"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Pollination is pollen to stigma. Fertilisation is fusion of germ-cells. Then ovule → seed, ovary → fruit.");
    L.legend([["#fbbf24","pollen"],["#22c55e","seed / fruit"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      poll: {t:"Pollination", d:"Pollen from anther to stigma. Self: same flower. Cross: another flower, via wind, water or animals. Then a pollen tube down the style."},
      fuse: {t:"Fertilisation → zygote", d:"Male germ-cell fuses with the egg in the ovule. That fusion is fertilisation. Zygote divides to an embryo."},
      fruit: {t:"Seed and fruit", d:"Ovule gets a tough coat → seed. Ovary ripens → fruit. Germination: embryo becomes a seedling (Activity 7.7)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Step", r.t], ["What happens", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["poll","pollination"],["fuse","fertilisation"],["fruit","seed / fruit"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.seed = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "puberty"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Clinical, as printed. Placenta exchanges glucose and oxygen. Copper-T prevents pregnancy, not STDs.");
    L.legend([["#f472b6","female / placenta"],["#38bdf8","male / barrier"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      puberty: {t:"Puberty", d:"Reproductive tissues mature as general growth slows. Shared: new hair, oily skin. Girls: breasts, menstruation. Boys: facial hair, voice, erections."},
      male: {t:"Testis and ducts", d:"Testes in the scrotum (lower temperature). Sperms + testosterone. Vas deferens; prostate and seminal vesicles add fluid. Q2: vas deferens is not female."},
      placenta: {t:"Placenta nourishes", d:"Disc in the uterine wall. Villi: glucose and oxygen from mother to embryo; wastes the other way. About nine months."},
      menses: {t:"Menstruation", d:"If the egg is not fertilised (lives about one day), the thick lining is shed as blood and mucous, roughly monthly, usually 2–8 days."},
      contra: {t:"Contraception and STDs", d:"Barriers (condom), pills, copper-T, surgery. Copper-T does not protect from STDs (Q5). Gonorrhoea, syphilis, warts, HIV-AIDS."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Topic", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["puberty","puberty"],["male","testis / Q2"],["placenta","placenta / Q4"],["menses","menstruation"],["contra","copper-T / STDs"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.human = {mount: mount, draw: draw, select: select, state: st};
})();
