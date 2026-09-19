// Class 10 Maths, Chapter 7 (jemh107) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "xaxis"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Abscissa from the y-axis, ordinate from the x-axis. On one axis, subtract.");
    L.legend([["#22c55e","axis"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      xaxis: {t:"x-axis", d:"A point on the x-axis is (x, 0)."},
      ab: {t:"AB = 2", d:"A(4, 0) and B(6, 0): AB = 2."},
      bd: {t:"BD = 10", d:"B(6, 0) and D(0, 8): BD = 10."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["xaxis","(x, 0)"],["ab","AB = 2"],["bd","BD = 10"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.axes = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "town"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Hidden right triangle: PT copies Δx, QT copies Δy.");
    L.legend([["#22c55e","distance"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      town: {t:"Town", d:"Town B is 36 km east and 15 km north: 39 km."},
      pq: {t:"Fig. 7.3", d:"P(4, 6) to Q(6, 8): PQ = 2√2."},
      cross: {t:"Fig. 7.4", d:"P(6, 4) to Q(−5, −3): PQ = √170."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["town","39 km"],["pq","2√2"],["cross","√170"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.first = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "form"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Distance is Pythagoras on the two coordinate gaps. Positive root only.");
    L.legend([["#22c55e","formula"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      form: {t:"Formula", d:"PQ = √((x₂−x₁)² + (y₂−y₁)²) is Pythagoras on the two gaps."},
      origin: {t:"Origin", d:"From the origin, OP = √(x² + y²). (0, 0) to (36, 15) is 39 km."},
      twin: {t:"Twin", d:"Order of subtraction does not change the distance."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["form","formula"],["origin","origin"],["twin","twin"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.general = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "right"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Three lengths convict a triangle type; four sides plus diagonals convict a square.");
    L.legend([["#22c55e","shape"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      right: {t:"Example 1", d:"Example 1: ∠P = 90° because 50 + 2 = 52."},
      square: {t:"Example 2", d:"Example 2: four sides √34 and diagonals √68."},
      rhomb: {t:"Impostor", d:"Equal sides alone can be a rhombus, not a square."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["right","right at P"],["square","square"],["rhomb","rhombus"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.shapes = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "seats"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Collinear when the two shorter distances sum to the longest.");
    L.legend([["#22c55e","collinear"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      seats: {t:"Desks", d:"Ashima, Bharti, Camella: 3√2 + 2√2 = 5√2, collinear."},
      q3: {t:"Q3", d:"Points (1, 5), (2, 3), (−2, −11) are not collinear."},
      test: {t:"Test", d:"Collinear when the two shorter distances sum to the longest."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["seats","desks"],["q3","not collinear"],["test","sum test"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.collinear = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "rel"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Equidistance from two points is a perpendicular bisector — a line.");
    L.legend([["#22c55e","locus"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      rel: {t:"Example 4", d:"Equidistant from (7, 1) and (3, 5) means x − y = 2."},
      y9: {t:"Example 5", d:"On the y-axis the fair point is (0, 9)."},
      line: {t:"Why a line", d:"x² and y² cancel, so the locus is a line."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["rel","x − y = 2"],["y9","(0, 9)"],["line","a line"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.locus = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "aa"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("The tower is earned by AA similarity, before the section formula.");
    L.legend([["#22c55e","1 : 2"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      aa: {t:"AA", d:"ΔPOD ~ ΔBPC by AA."},
      xy: {t:"P(12, 5)", d:"The tower is at (12, 5)."},
      back: {t:"Backwards", d:"(24, 10) is the 2:1 split, not 1:2."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["aa","AA"],["xy","(12, 5)"],["back","2 : 1"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.tower = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "far"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("m₁ multiplies the far end. Midpoint is 1 : 1. Internal division only.");
    L.legend([["#22c55e","section"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      far: {t:"Far weight", d:"m₁ multiplies the far end B."},
      ex6: {t:"Example 6", d:"3:1 of (4, −3) and (8, 5) is (7, 3)."},
      p7: {t:"Example 10", d:"Parallelogram diagonals give p = 7."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["far","far end"],["ex6","(7, 3)"],["p7","p = 7"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.section = {mount: mount, draw: draw, select: select, state: st};
})();
