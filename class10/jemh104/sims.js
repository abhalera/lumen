// Class 10 Maths, Chapter 4 (jemh104) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "std"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Standard form ax² + bx + c = 0, a ≠ 0. Simplify before you name the degree.");
    L.legend([["#22c55e","quadratic"],["#ef4444","not"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      std: {t:"Standard form", d:"The standard form of a quadratic equation is ax² + bx + c = 0 with a ≠ 0."},
      trap: {t:"Example 2 (ii)", d:"Example 2 (ii) is not quadratic because the x² terms cancel, leaving x + 12 = 0."},
      iv: {t:"Cubes cancel", d:"(x + 2)³ = x³ − 4 is quadratic after the cubes cancel."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["std","standard"],["trap","not quadratic"],["iv","cubes"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.form = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "one"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("A root is a number that makes the equation 0. Same as a zero of the polynomial.");
    L.legend([["#22c55e","root"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      one: {t:"x = 1", d:"1 is a root of 2x² − 3x + 1 = 0 because substituting x = 1 gives 0."},
      same: {t:"Same numbers", d:"Zeroes of ax² + bx + c and roots of ax² + bx + c = 0 are the same numbers."},
      two: {t:"Ceiling", d:"A quadratic equation has at most two roots."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["one","x = 1"],["same","zeroes"],["two","at most two"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.root = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "ex3"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Split the middle term so the pieces multiply to ac x².");
    L.legend([["#22c55e","factors"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      ex3: {t:"Example 3", d:"Roots of 2x² − 5x + 3 = 0 are 1 and 3/2."},
      ex4: {t:"Example 4", d:"Roots of 6x² − x − 2 = 0 are 2/3 and −1/2."},
      hall: {t:"Prayer hall", d:"Usable root x = 12. Breadth 12 m, length 25 m."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["ex3","1, 3/2"],["ex4","2/3"],["hall","12 m"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.factor = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "need"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("x = (−b ± √D) / (2a) when D ≥ 0. Pole: D = 289, x = 5 m.");
    L.legend([["#22c55e","formula"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      need: {t:"Need D ≥ 0", d:"The quadratic formula needs b² − 4ac ≥ 0 for real roots."},
      Dpole: {t:"Pole discriminant", d:"Discriminant of x² + 7x − 60 is 289 = 17²."},
      pole: {t:"Placement", d:"Distance from gate B is 5 m (ignore −12). Then 12 m from A."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["need","D ≥ 0"],["Dpole","289"],["pole","5 m"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.formula = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "ex7"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("D > 0 two distinct; D = 0 two equal; D < 0 none real.");
    L.legend([["#22c55e","D ≥ 0"],["#ef4444","D < 0"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      ex7: {t:"Example 7", d:"2x² − 4x + 3 = 0 has no real roots (D = −8)."},
      ex9: {t:"Example 9", d:"3x² − 2x + 1/3 = 0 has two equal roots 1/3, 1/3."},
      k: {t:"Equal-root k", d:"2x² + kx + 3 = 0 has equal roots when k = ±2√6."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["ex7","D = −8"],["ex9","1/3"],["k","±2√6"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.disc = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "marbles"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Model, solve, keep the root a count or a length can be.");
    L.legend([["#22c55e","keep"],["#ef4444","reject"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      marbles: {t:"Marbles", d:"John’s starting marbles (with Jivanti making 45) are 9 or 36."},
      ages: {t:"Friends’ ages", d:"The two-friends age story (Ex 4.3 Q4) is impossible (D = −48)."},
      rohan: {t:"Rohan", d:"Rohan’s present age is 7 years (reject −39)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["marbles","9 or 36"],["ages","impossible"],["rohan","7"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.word = {mount: mount, draw: draw, select: select, state: st};
})();
