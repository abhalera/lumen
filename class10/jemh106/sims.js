// Class 10 Maths, Chapter 6 (jemh106) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "circ"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Similar figures: same shape. Polygons need equal angles AND proportional sides.");
    L.legend([["#22c55e","similar"],["#ef4444","not"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      circ: {t:"Circles", d:"All circles are similar (same shape, any radius)."},
      two: {t:"Two conditions", d:"Similar n-gons need equal corresponding angles AND proportional sides."},
      pyth: {t:"Missing proof", d:"A Pythagoras-by-similarity proof in this reprint is promised on p. 73 and absent from the summary."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["circ","circles"],["two","both"],["pyth","no Pythagoras"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.shapes = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "bpt"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("DE ∥ BC ⇒ AD/DB = AE/EC. Proof by equal areas.");
    L.legend([["#22c55e","BPT"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      bpt: {t:"Theorem 6.1", d:"BPT says that if DE ∥ BC then AD/DB = AE/EC."},
      area: {t:"Equal areas", d:"ar(BDE) = ar(DEC) because they share base DE between the same parallels."},
      r32: {t:"Activity 2", d:"Activity 2’s common ratio is 3/2."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["bpt","BPT"],["area","areas"],["r32","3/2"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.bpt = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "ec"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Converse: equal ratios force DE ∥ BC. Fig. 6.17: EC=2, AD=2.4.");
    L.legend([["#22c55e","converse"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      ec: {t:"Q1(i)", d:"EC in Fig. 6.17(i) is 2 cm."},
      ad: {t:"Q1(ii)", d:"AD in Fig. 6.17(ii) is 2.4 cm."},
      q2: {t:"Q2(ii)", d:"PE=4, QE=4.5, PF=8, RF=9. EF ∥ QR? Yes — 4/4.5 = 8/9."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["ec","2 cm"],["ad","2.4 cm"],["q2","8/9"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.conv = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "aa"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Two equal angles are enough. Activity 4: scale factor 0.6.");
    L.legend([["#22c55e","AA"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      aa: {t:"AA", d:"AA similarity uses two pairs of equal angles (the third then matches)."},
      s06: {t:"Activity 4", d:"Activity 4’s scale factor is 0.6 (3/5)."},
      corr: {t:"Letters", d:"If △ABC ~ △DEF then AB corresponds to DE."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["aa","AA"],["s06","0.6"],["corr","DE"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.aa = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "sss"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("SSS: three side-pairs in one ratio. SAS: included angle plus two proportional sides.");
    L.legend([["#22c55e","SSS/SAS"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      sss: {t:"SSS", d:"SSS similarity needs three pairs of sides in the same ratio."},
      sas: {t:"SAS", d:"Activity 6’s ratio is 2/3 with included 50°."},
      ex5: {t:"Example 5", d:"Example 5 concludes ∠P equals 40°, because △ABC ~ △RQP."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["sss","SSS"],["sas","2/3"],["ex5","40°"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.sss = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "shad"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Lamp-post: shadow 1.6 m. Tower: 42 m. ∠DOC = 55°.");
    L.legend([["#22c55e","AA"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      shad: {t:"Example 7", d:"Girl’s shadow after 4 s is 1.6 m."},
      tow: {t:"Q15", d:"Height of the tower is 42 m."},
      doc: {t:"Fig. 6.35", d:"∠DOC in Fig. 6.35 is 55°."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["shad","1.6 m"],["tow","42 m"],["doc","55°"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.app = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "sum"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Examined: BPT, AA, SSS, SAS. RHS is a note. No Pythagoras proof.");
    L.legend([["#22c55e","in"],["#ef4444","out"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      sum: {t:"Criteria", d:"This chapter’s similarity criteria are AAA/AA, SSS and SAS."},
      rhs: {t:"RHS note", d:"The RHS note applies to two right triangles (hypotenuse and one side proportional)."},
      miss: {t:"Not here", d:"Areas of similar triangles (ratio k²) in this reprint are not a section."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["sum","AA SSS SAS"],["rhs","RHS"],["miss","no k²"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.note = {mount: mount, draw: draw, select: select, state: st};
})();
