// Class 10 Maths, Chapter 2 (jemh102) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "lin"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Degree 1 linear, 2 quadratic, 3 cubic. 1/(x − 1) is not a polynomial.");
    L.legend([["#22c55e","polynomial"],["#ef4444","not"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      lin: {t:"Linear", d:"Degree 1. Examples: 2x − 3, 3z + 4. General form is not needed; the highest power is 1."},
      quad: {t:"Quadratic", d:"Degree 2, from ‘quadrate’ = square. General form ax² + bx + c, a ≠ 0."},
      notpoly: {t:"Not a polynomial", d:"1/(x − 1) and √x + 2 are not polynomials. 2x + 5 − x² is quadratic, not linear."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["lin","linear"],["quad","quadratic"],["notpoly","not a polynomial"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.degree = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "p2"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("p(x) = x² − 3x − 4. p(2) = −6. Zeroes when p(k) = 0.");
    L.legend([["#22c55e","zero"],["#f59e0b","value"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      p2: {t:"A value", d:"p(2) = 2² − 6 − 4 = −6. p(0) = −4. Those are values, not zeroes."},
      zeros: {t:"Zeroes", d:"p(−1) = 0 and p(4) = 0, so the zeroes of x² − 3x − 4 are −1 and 4."},
      linz: {t:"Linear zero", d:"The zero of ax + b is −b/a. For 2x + 3 that is −3/2."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["p2","p(2)"],["zeros","zeroes"],["linz","−b/a"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.value = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "pts"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("y = 2x + 3 through (−2, −1) and (2, 7). Zero −3/2.");
    L.legend([["#22c55e","line"],["#ef4444","intercept"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      pts: {t:"Two points", d:"y = 2x + 3 passes through (−2, −1) and (2, 7)."},
      zero: {t:"The intercept", d:"The graph meets the x-axis at (−3/2, 0). That x-coordinate is the zero."},
      one: {t:"Exactly one", d:"y = ax + b, a ≠ 0, intersects the x-axis at exactly one point, (−b/a, 0)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["pts","points"],["zero","−3/2"],["one","exactly one"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.line = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "table"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Table 2.1: y = 0 at x = −1 and 4. A quadratic has 2, 1 or 0 zeroes.");
    L.legend([["#22c55e","intercept"],["#f59e0b","vertex"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      table: {t:"Table 2.1", d:"For y = x² − 3x − 4 the y-values are 6, 0, −4, −6, −6, −4, 0, 6. Zeroes at −1 and 4."},
      open: {t:"Opening", d:"The parabola opens upwards when a > 0 and downwards when a < 0."},
      miss: {t:"Three cases", d:"Cuts twice, touches once, or never meets the x-axis — no zero in case (iii)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["table","table"],["open","a > 0"],["miss","no zero"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.parabola = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "x3"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("x³ − 4x zeroes −2, 0, 2. Fig. 2.10: 0, 1, 3, 2, 4, 3.");
    L.legend([["#22c55e","zero"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      x3: {t:"x³ − 4x", d:"Zeroes −2, 0 and 2. A cubic has at most three zeroes."},
      ex1vi: {t:"Example 1 (vi)", d:"Fig. 2.9 (vi) has 4 zeroes — so that graph is not a cubic."},
      f10: {t:"Fig. 2.10 (iv)", d:"The left-hand parabola crosses twice, so 2 zeroes. (vi) has 3 (one crossing, two touches)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["x3","x³ − 4x"],["ex1vi","four zeroes"],["f10","Fig. 2.10"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.cubic = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "ex2"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("α + β = −b/a and αβ = c/a. Example 2: −2 and −5.");
    L.legend([["#22c55e","sum"],["#f59e0b","product"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      ex2: {t:"Example 2", d:"x² + 7x + 10 = (x + 2)(x + 5). Zeroes −2 and −5."},
      sum: {t:"Sum", d:"For ax² + bx + c, α + β = −b/a. Product αβ = c/a."},
      ex4: {t:"Example 4", d:"Sum −3, product 2. One polynomial is x² + 3x + 2, or any non-zero multiple."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["ex2","−2, −5"],["sum","−b/a"],["ex4","x² + 3x + 2"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.vieta2 = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "zs"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("2x³ − 5x² − 14x + 8 zeroes 4, −2, 1/2. Product αβγ = −d/a.");
    L.legend([["#22c55e","zero"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      zs: {t:"The triple", d:"Zeroes of 2x³ − 5x² − 14x + 8 are 4, −2 and 1/2."},
      prod: {t:"Product", d:"αβγ = −d/a. Here 4 × (−2) × 1/2 = −4 = −8/2."},
      ex5sum: {t:"Example 5", d:"Zeroes 3, −1, −1/3. Sum 5/3 ≈ 1.67 = −(−5)/3."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["zs","4, −2, 1/2"],["prod","−d/a"],["ex5sum","1.67"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.vieta3 = {mount: mount, draw: draw, select: select, state: st};
})();
