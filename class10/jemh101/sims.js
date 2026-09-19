// Class 10 Maths, Chapter 1 (jemh101) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "tree"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Every composite has one prime list, apart from order. 32760 = 2³ × 3² × 5 × 7 × 13.");
    L.legend([["#22c55e","prime"],["#f59e0b","composite"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      tree: {t:"Factor tree for 32760", d:"32760 = 2 × 2 × 2 × 3 × 3 × 5 × 7 × 13 = 2³ × 3² × 5 × 7 × 13."},
      unique: {t:"Unique apart from order", d:"2 × 3 × 5 × 7 is the same unique list as 3 × 5 × 7 × 2. Theorem 1.1."},
      check: {t:"123456789", d:"123456789 = 3² × 3803 × 3607. Both 3803 and 3607 are prime."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["tree","32760"],["unique","order"],["check","3803"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.factor = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "four"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("A trailing zero needs prime 5. 4ⁿ = 2²ⁿ has only prime 2.");
    L.legend([["#22c55e","prime 2"],["#ef4444","missing 5"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      four: {t:"Example 1", d:"4ⁿ = 2²ⁿ has only prime 2. No natural n makes 4ⁿ end in 0."},
      six: {t:"Exercise Q5", d:"6ⁿ = 2ⁿ × 3ⁿ still has no 5, so 6ⁿ cannot end in 0 either."},
      ten: {t:"Why 10", d:"A trailing zero means divisible by 10 = 2 × 5, so you need both 2 and 5."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["four","4ⁿ"],["six","6ⁿ"],["ten","2 and 5"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.zeroend = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "pair"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("HCF takes smallest common powers. LCM takes greatest powers of every prime.");
    L.legend([["#22c55e","HCF"],["#f59e0b","LCM"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      pair: {t:"Example 2", d:"6 = 2¹ × 3, 20 = 2² × 5. HCF 2, LCM 60."},
      min: {t:"HCF rule", d:"HCF uses the smallest power of each common prime. For 6 and 20 that is 2¹."},
      max: {t:"LCM rule", d:"LCM uses the greatest power of each prime involved: 2² × 3 × 5 = 60."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["pair","6 and 20"],["min","smallest"],["max","greatest"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.hcflcm = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "ex3"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Two numbers: HCF × LCM = a × b. Three numbers: the product identity breaks.");
    L.legend([["#22c55e","two numbers"],["#ef4444","three numbers"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      ex3: {t:"Example 3", d:"96 = 2⁵ × 3, 404 = 2² × 101, HCF = 4, LCM = 96 × 404 / 4 = 9696."},
      three: {t:"Example 4", d:"6, 72, 120: HCF = 6, LCM = 2³ × 3² × 5 = 360."},
      brk: {t:"The break", d:"6 × 72 × 120 = 51840, but HCF × LCM = 6 × 360 = 2160. Not equal."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["ex3","9696"],["three","360"],["brk","51840"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.product = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "statement"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("If prime p divides a², then p divides a. Squaring doubles exponents; it does not invent primes.");
    L.legend([["#38bdf8","a"],["#f59e0b","a²"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      statement: {t:"Theorem 1.2", d:"p prime and p | a² ⇒ p divides a."},
      square: {t:"What squaring does", d:"a = p₁…pₙ ⇒ a² has the same primes with exponents doubled."},
      use: {t:"Why uniqueness", d:"The only primes in a² are a’s primes, so p was already on a’s list — uniqueness."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["statement","lemma"],["square","exponents doubled"],["use","uniqueness"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.lemma = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "assume"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Assume √2 = a/b coprime. Then both a and b are even. Contradiction.");
    L.legend([["#ef4444","assumption"],["#22c55e","lemma"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      assume: {t:"Assume rational", d:"√2 = a/b in lowest terms, so a and b are coprime and b ≠ 0."},
      even: {t:"Both even", d:"2b² = a² ⇒ 2 divides a, then 2 divides b. Both even, not coprime."},
      sqrt3: {t:"Example 5", d:"The same chain with prime 3 proves √3 is irrational."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["assume","coprime"],["even","both even"],["sqrt3","prime 3"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.contradict = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "diff"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Assume the combination is rational, isolate √3 or √2, contradict.");
    L.legend([["#22c55e","known irrational"],["#f59e0b","assumed rational"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      diff: {t:"Example 6", d:"If 5 − √3 were rational, then √3 = 5 − a/b would be rational."},
      prod: {t:"Example 7", d:"If 3√2 were rational, then √2 = a/(3b) would be rational."},
      ex12: {t:"Exercise 1.2", d:"√5, 3 + 2√5, 1/√2, 7√5, 6 + √2 — isolate the known square root each time."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["diff","5 − √3"],["prod","3√2"],["ex12","√5"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.isolate = {mount: mount, draw: draw, select: select, state: st};
})();
