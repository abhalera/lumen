// Class 10 Maths, Chapter 5 (jemh105) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "taxi"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("An AP adds a fixed d. Subtract in list order, even when the list decreases.");
    L.legend([["#22c55e","AP"],["#ef4444","not AP"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      taxi: {t:"Taxi", d:"Taxi ₹15 then +₹8 each km is an AP with d = 8."},
      dec: {t:"Decreasing", d:"For 6, 3, 0, −3, d is −3 (subtract in list order)."},
      geom: {t:"Not AP", d:"Compound interest at 8% per year is not an AP."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["taxi","taxi"],["dec","d = −3"],["geom","CI"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.spot = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "gen"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("a and d write every AP. d = 0 is a constant list, still an AP.");
    L.legend([["#22c55e","a, d"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      gen: {t:"General form", d:"The general form of an AP is a, a+d, a+2d, …"},
      four: {t:"Four terms", d:"a = 10, d = 10. First four terms: 10, 20, 30, 40."},
      d0: {t:"Zero step", d:"a = 3.5, d = 0, a₁₀₅ stays 3.5."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["gen","form"],["four","10, 20"],["d0","d = 0"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.form = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "a10"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("aₙ = a + (n − 1)d. n must be a positive integer.");
    L.legend([["#22c55e","term"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      a10: {t:"Example 3", d:"10th term of 2, 7, 12, … is 47."},
      n35: {t:"Example 4", d:"−81 is the 35th term of 21, 18, 15, …"},
      t301: {t:"Example 6", d:"301 is not a term of 5, 11, 17, … — n = 151/3 is not an integer."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["a10","47"],["n35","35"],["t301","not a term"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.nth = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "mcq"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Turn aₙ around. The sign of d is the whole of the −77 trap.");
    L.legend([["#22c55e","n"],["#ef4444","trap"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      mcq: {t:"Ex 5.2 Q2", d:"30th term of 10, 7, 4, … is −77 (not 77)."},
      n78: {t:"Which term", d:"78 is the 16th term of 3, 8, 13, …"},
      year: {t:"Subba Rao", d:"Calendar year Subba Rao reaches ₹7000 is 2005."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["mcq","−77"],["n78","16"],["year","2005"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.which = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "gauss"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Write the list backwards, add, divide by 2. Sₙ = n/2 [2a+(n−1)d].");
    L.legend([["#22c55e","pairs"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      gauss: {t:"Gauss", d:"1 + 2 + … + 100 = 5050, because 100 pairs of 101."},
      s22: {t:"Example 11", d:"Sum of first 22 terms of 8, 3, −2, … is −979."},
      a20: {t:"Example 12", d:"If S₁₄ = 1050 and a = 10, then a₂₀ = 200."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["gauss","5050"],["s22","−979"],["a20","200"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.sum = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "two"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("A quadratic for n can have two counting-number roots.");
    L.legend([["#22c55e","both n"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      two: {t:"Example 13", d:"S = 78 for 24, 21, 18, … at both n = 4 and n = 13."},
      n12: {t:"Ex 5.3 Q4", d:"12 terms of 9, 17, 25, … sum to 636."},
      nsq: {t:"Ex 5.3 Q9", d:"If S₇=49 and S₁₇=289, then Sₙ is n²."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["two","4 or 13"],["n12","12"],["nsq","n²"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.cases = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "trees"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Logs: n=16 (reject 25). Trees 234. Potato race 370 m.");
    L.legend([["#22c55e","keep"],["#ef4444","reject"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      trees: {t:"Trees", d:"Trees planted (3 sections × classes I–XII) total 234."},
      logs: {t:"Logs", d:"200 logs occupy 16 rows with 5 on top. n=25 needs a negative row."},
      race: {t:"Potato race", d:"The competitor runs 370 m (twice the AP 5, 8, …, 32)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["trees","234"],["logs","16 rows"],["race","370 m"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.apply = {mount: mount, draw: draw, select: select, state: st};
})();
