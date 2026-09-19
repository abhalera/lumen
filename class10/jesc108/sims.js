// Class 10 Science, Chapter 8 (jesc108) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "fig"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Each generation keeps inherited differences and adds new ones. Sexual reproduction maximises diversity. A 60% asexual trait is likely older than a 10% trait.");
    L.legend([["#38bdf8","inherited"],["#f59e0b","new difference"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      fig: {t:"Fig. 8.1 — diversity over generations", d:"The original design is inherited. Each child is similar, with subtle differences. The next row keeps those and adds more."},
      asex: {t:"Asexual: four similar bacteria", d:"One bacterium divides, then those two divide. Only small DNA-copying inaccuracies. A sugarcane field looks almost uniform."},
      survive: {t:"60% vs 10% (in-text Q1)", d:"In an asexual species, the 60% trait is likely to have arisen earlier than the 10% trait. Heat-resistant bacteria survive a heat wave."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Idea", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["fig","Fig. 8.1"],["asex","asexual copies"],["survive","60% vs 10%"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.vary = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "cross"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Both parents contribute practically equal DNA. Tall × short → F1 all tall, no medium-height plants.");
    L.legend([["#22c55e","tall / dominant"],["#f59e0b","short / recessive"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      cross: {t:"F1 is all tall", d:"No halfway characteristics — no medium-height plants. Only one parental trait is seen, not a mixture."},
      equal: {t:"Two versions of each trait", d:"Father and mother contribute practically equal genetic material. Each trait in the child has two versions."},
      ears: {t:"Earlobes (Activity 8.1)", d:"Free and attached earlobes are two human variants (Fig. 8.2). Correlate students with parents; that is a census, not yet a 3:1 law."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Topic", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["cross","F1 all tall"],["equal","equal DNA"],["ears","earlobes"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.f1 = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "quarter"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Self F1 tall plants: one quarter of F2 is short. TT and Tt tall; only tt short. 1:2:1 is the genotype in a large sample.");
    L.legend([["#22c55e","T present"],["#f59e0b","tt short"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      quarter: {t:"One quarter short", d:"F2 of selfed F1 tall plants are not all tall. One quarter are short. Both traits were inherited; only tallness was expressed in F1."},
      copies: {t:"TT and Tt are tall", d:"A single copy of T is enough. Only tt is short. T is dominant; t is recessive."},
      ratio: {t:"1 TT : 2 Tt : 1 tt", d:"Activity 8.2: confirm this genotype ratio. Phenotype in a large F2 is about 3 tall : 1 short."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Result", r.t], ["Meaning", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["quarter","one quarter short"],["copies","TT / Tt / tt"],["ratio","1:2:1"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.f2 = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "f1dy"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Fig. 8.5: 315 round yellow, 108 round green, 101 wrinkled yellow, 32 wrinkled green in 556 seeds ≈ 9:3:3:1.");
    L.legend([["#eab308","yellow"],["#22c55e","green"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      f1dy: {t:"F1 all round yellow", d:"RRyy (round, green) × rrYY (wrinkled, yellow) → RrYy. Round and yellow are dominant."},
      counts: {t:"556 seeds as printed", d:"315 round yellow, 108 round green, 101 wrinkled yellow, 32 wrinkled green. Ideal 9/16 of 556 is 312.75; 3/16 is 104.25; 1/16 is 34.75."},
      indep: {t:"Independently inherited", d:"F2 has new combinations, not only the two grandparent types. Shape and colour recombine. Exercise Q1: tall parent is TtWW."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Step", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["f1dy","F1 round yellow"],["counts","315–32 counts"],["indep","independent"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.dihyb = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "enzyme"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("A gene is a DNA section for one protein. Height can be enzyme efficiency → hormone amount. No invented percentages — qualitative as printed.");
    L.legend([["#22c55e","efficient enzyme"],["#f59e0b","altered gene"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      enzyme: {t:"Enzyme, hormone, height", d:"If the enzyme works efficiently, more hormone, tall plant. An altered gene can make a less efficient enzyme, less hormone, short plant. Qualitative — not a measured %."},
      two: {t:"Two gene sets", d:"Each pea has two sets of all genes, one from each parent. Each germ-cell has only one set."},
      chrom: {t:"Chromosomes are separate pieces", d:"If R and y were on one long thread they could not be independently inherited. Fusion of germ-cells restores two copies of each chromosome."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Idea", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["enzyme","enzyme / height"],["two","two sets"],["chrom","chromosomes"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.gene = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "xy"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Mother always gives X. Father’s X → girl; Y → boy. About half and half in a crowd. Some reptiles use egg temperature; some snails change sex.");
    L.legend([["#f472b6","X"],["#38bdf8","Y"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      xy: {t:"22 pairs plus XX or XY", d:"Women: perfect pair XX. Men: mismatched X and a short Y. Most chromosomes are ordinary pairs — 22 of them."},
      father: {t:"Paternal X or Y", d:"All children inherit an X from the mother. A child who inherits X from the father is a girl; Y from the father is a boy."},
      other: {t:"Not every species uses XY", d:"A few reptiles: temperature of fertilised eggs. Snails: individuals can change sex. Human sex is largely genetically determined."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Rule", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["xy","XX / XY"],["father","father decides"],["other","reptiles / snails"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.sex = {mount: mount, draw: draw, select: select, state: st};
})();
