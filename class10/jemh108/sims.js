// Class 10 Maths, Chapter 8 (jemh108) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "opp"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Opposite faces the angle. Adjacent is the other leg. Names swap with the angle.");
    L.legend([["#22c55e","sides"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      opp: {t:"Opposite A", d:"In right △ABC right-angled at B, opposite ∠A is BC."},
      sinc: {t:"sin C", d:"AB=5, BC=12, right-angled at B. sin C = 5/13."},
      swap: {t:"Names swap", d:"Opposite and adjacent swap between A and C, so sin A ≠ sin C."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["opp","opposite"],["sinc","sin C"],["swap","swap"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.sides = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "csc"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Six names, three pairs. Reciprocals. tan = sin/cos.");
    L.legend([["#22c55e","ratios"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      csc: {t:"Reciprocal", d:"cosec A is the reciprocal of sin A."},
      sec: {t:"sec A", d:"If cos A = 5/13, then sec A = 2.6."},
      prod: {t:"Not a product", d:"sin A is an abbreviation, not sin × A."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["csc","cosec"],["sec","2.6"],["prod","not ×"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.six = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "same"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("AA similarity: ratios stay put when the triangle scales. Watch the −1 trap.");
    L.legend([["#22c55e","similar"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      same: {t:"Scale cancels", d:"If the triangle doubles, sin A stays the same."},
      sq: {t:"sin²A", d:"sin²A means (sin A)², the square of the ratio."},
      inv: {t:"Reciprocal", d:"(sin A)⁻¹ equals cosec A, not sin⁻¹A."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["same","same sin"],["sq","sin²A"],["inv","≠ inverse"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.similar = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "k"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Assign k, Pythagoras, drop the negative length, read the other five.");
    L.legend([["#22c55e","k-method"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      k: {t:"Scale k", d:"sin A = 1/3 is written with k as opp = k, hyp = 3k."},
      ex1: {t:"Example 1", d:"tan A = 4/3. Then sin A = 4/5."},
      sign: {t:"Positive root", d:"AB = −2√2 k is rejected because a length is non-negative."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["k","k"],["ex1","4/5"],["sign","not minus"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.complete = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "s30"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Half-square for 45°. Half-equilateral for 30° and 60°.");
    L.legend([["#22c55e","table"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      s30: {t:"30°", d:"sin 30° = 1/2."},
      c60: {t:"60°", d:"cos 60° as a decimal is 0.5."},
      swap60: {t:"Complement", d:"sin 60° equals cos 30° because they are complementary: opposite at 60° is adjacent at 30°."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["s30","1/2"],["c60","0.5"],["swap60","complement"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.table = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "s0"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Define 0° and 90° from the limit. Four quotients are not defined.");
    L.legend([["#22c55e","edges"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      s0: {t:"0°", d:"sin 0° and cos 0° are 0 and 1."},
      undef: {t:"Holes", d:"tan 90° and cosec 0° are not defined."},
      ab: {t:"Example 8", d:"Ex 8.2 Q3: A and B are 45° and 15°."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["s0","0°"],["undef","not defined"],["ab","45° 15°"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.limits = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "pyth"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Identity (2) is Pythagoras divided by AC². No Exercise 8.4 in this reprint.");
    L.legend([["#22c55e","identity"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      pyth: {t:"Parent", d:"sin²A + cos²A equals 1."},
      nine: {t:"Q3(i)", d:"9 sec²A − 9 tan²A = 9."},
      ex4: {t:"No 8.4", d:"Exercise 8.4 in this reprint is not a section — the book ends at Ex 8.3 and the summary."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["pyth","= 1"],["nine","= 9"],["ex4","no 8.4"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.ident = {mount: mount, draw: draw, select: select, state: st};
})();
