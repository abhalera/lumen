// Class 10 Maths, Chapter 3 (jemh103) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "rides"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("y = x/2 and 3x + 4y = 20. Four rides, two games, ₹20.");
    L.legend([["#22c55e","pair"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      rides: {t:"Rides", d:"Akhila’s number of rides is x = 4. y = x/2 then gives 2 games."},
      games: {t:"Hoopla", d:"Number of Hoopla games y = 2. Half the rides."},
      bill: {t:"The bill", d:"3(4) + 4(2) = 20, so the pair is consistent. Unique solution (4, 2)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["rides","x = 4"],["games","y = 2"],["bill","₹20"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.model = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "inter"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Intersect once, run parallel, or lie on top of each other.");
    L.legend([["#22c55e","consistent"],["#ef4444","inconsistent"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      inter: {t:"Intersect", d:"Intersecting lines give a unique solution (consistent). Akhila’s pair is this fate."},
      par: {t:"Parallel", d:"x + 2y − 4 = 0 and 2x + 4y − 12 = 0 are parallel (no solution)."},
      dep: {t:"Dependent", d:"A dependent pair is consistent, with infinitely many solutions."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["inter","intersect"],["par","parallel"],["dep","dependent"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.fates = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "int"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Compare a₁/a₂, b₁/b₂, c₁/c₂. Rewrite as a x + b y + c = 0 first.");
    L.legend([["#22c55e","ratios"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      int: {t:"Intersect", d:"Intersecting means a₁/a₂ ≠ b₁/b₂. You do not need the c-ratio."},
      par: {t:"Parallel", d:"6x − 3y + 10 = 0 and 2x − y + 9 = 0 are parallel (6/2 = −3/−1 ≠ 10/9)."},
      co: {t:"Coincident", d:"9x + 3y + 12 = 0 and 18x + 6y + 24 = 0 are coincident (all ratios 1/2)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["int","≠"],["par","parallel"],["co","1/2"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.ratios = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "ex1"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Example 1 meets at (6, 0). Champa meets at (1, 0).");
    L.legend([["#22c55e","crossing"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      ex1: {t:"Example 1", d:"x + 3y = 6 and 2x − 3y = 12 meet at (6, 0). Consistent."},
      ex2: {t:"Example 2", d:"Multiplying the second equation by 5/3 recovers the first — infinitely many solutions (coincident)."},
      champa: {t:"Champa", d:"y = 2x − 2 and y = 4x − 4 meet at (1, 0): one pant, no skirt."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["ex1","(6, 0)"],["ex2","coincident"],["champa","(1, 0)"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.graph = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "aftab"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Express one variable, substitute. Example 4: 49/29 and 19/29.");
    L.legend([["#22c55e","substitute"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      aftab: {t:"Example 5", d:"Aftab and his daughter are 42 and 12 years old."},
      ex4: {t:"Example 4", d:"x = 3 − 2y into 7x − 15y = 2 gives y = 19/29, x = 49/29."},
      why: {t:"Why algebra", d:"Graphs misread non-integral points such as (√3, 2.7). Substitution does not."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["aftab","42, 12"],["ex4","19/29"],["why","fractions"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.subst = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "e6"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("A leftover with no variable is a verdict: true ⇒ infinitely many; false ⇒ none.");
    L.legend([["#22c55e","true"],["#ef4444","false"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      e6: {t:"Example 6", d:"Pencils and erasers collapse to 18 = 18, infinitely many (no unique costs)."},
      e7: {t:"Example 7", d:"The rails do not cross (−4 = 0), a false leftover."},
      rule: {t:"The rule", d:"A variable-free false statement means the pair is inconsistent."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["e6","18 = 18"],["e7","−4 = 0"],["rule","inconsistent"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.nouniq = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "inc"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Equalise a coefficient, add or subtract. Incomes ₹18,000 and ₹14,000.");
    L.legend([["#22c55e","eliminate"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      inc: {t:"Example 8", d:"The two monthly incomes in Example 8 are ₹18,000 and ₹14,000."},
      ex9: {t:"Example 9", d:"Example 9’s leftover 0 = 9 means no solution."},
      dig: {t:"Example 10", d:"The two-digit numbers in Example 10 are 42 and 24."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["inc","₹18,000"],["ex9","0 = 9"],["dig","42 and 24"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.elim = {mount: mount, draw: draw, select: select, state: st};
})();
