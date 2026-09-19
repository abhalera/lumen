// Class 10 Science, Chapter 11 (jesc111) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "def"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("I = Q/t. 1 A = 1 C s⁻¹. Ammeter in series. Example 11.1: 300 C.");
    L.legend([["#38bdf8","current + to −"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      def: {t:"I = Q/t", d:"Net charge Q through a section in time t. 1 A = 1 C per second. 1 mA = 10⁻³ A."},
      ex1: {t:"Example 11.1", d:"0.5 A for 10 minutes (600 s) carries Q = It = 300 C."},
      e: {t:"One coulomb", d:"e = 1.6 × 10⁻¹⁹ C, so 1 C is nearly 6 × 10¹⁸ electrons (1/1.6×10⁻¹⁹ = 6.25 × 10¹⁸)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["def","I = Q/t"],["ex1","Example 11.1"],["e","1 C"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.curr = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "volt"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("V = W/Q. Voltmeter in parallel. Example 11.2: 24 J.");
    L.legend([["#f59e0b","potential"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      volt: {t:"1 V = 1 J C⁻¹", d:"Work to move 1 C between two points. A cell maintains this even on open circuit."},
      ex2: {t:"Example 11.2", d:"2 C across 12 V: W = VQ = 24 J. A 6 V battery gives 6 J to each coulomb."},
      meter: {t:"Voltmeter in parallel", d:"Always across the two points. Ammeter stays in series. Table 11.1 lists the circuit symbols."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["volt","1 volt"],["ex2","Example 11.2"],["meter","voltmeter"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.pot = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "line"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Ohm’s law: V = IR at constant temperature. Straight V–I through the origin.");
    L.legend([["#22c55e","V"],["#38bdf8","I"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      line: {t:"Fig. 11.3", d:"V–I for nichrome is a straight line through the origin. V/I is constant = R."},
      ohm: {t:"V = IR", d:"1 Ω if 1 V produces 1 A. I = V/R: double R, current halves. Temperature must stay the same."},
      ex4: {t:"Example 11.4", d:"4 A at 60 V ⇒ R = 15 Ω. At 120 V the current is 8 A."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["line","V–I graph"],["ohm","Ohm’s law"],["ex4","Example 11.4"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.ohm = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "rho"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("R = ρl/A. Silver 1.60 × 10⁻⁸ Ω m. Example 11.5 is manganese.");
    L.legend([["#eab308","conductor"],["#ef4444","insulator"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      rho: {t:"R = ρ l / A", d:"Longer → more R; thicker → less R. ρ in Ω m is a material property. Both R and ρ depend on temperature."},
      tab: {t:"Table 11.2", d:"Silver 1.60 × 10⁻⁸ is the best conductor listed. Iron beats mercury. Nichrome 100 × 10⁻⁶ for heaters. Tungsten for filaments."},
      ex5: {t:"Example 11.5", d:"1 m, 0.3 mm, 26 Ω → ρ = 1.84 × 10⁻⁶ Ω m → manganese. Example 11.6: l/2 and 2A turn 4 Ω into 1 Ω."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["rho","ρ formula"],["tab","Table 11.2"],["ex5","Example 11.5"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.rho = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "ser"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Series adds R. Parallel adds 1/R. Example 11.8: Rp = 3 Ω, I = 4 A.");
    L.legend([["#38bdf8","series"],["#22c55e","parallel"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      ser: {t:"Example 11.7 series", d:"20 Ω + 4 Ω on 6 V: Rs = 24 Ω, I = 0.25 A, 5 V on the lamp, 1 V on the 4 Ω."},
      par: {t:"Example 11.8 parallel", d:"5, 10, 30 Ω on 12 V: 2.4 A, 1.2 A, 0.4 A. Total 4 A. Rp = 3 Ω."},
      mix: {t:"Example 11.9 mix", d:"R′ = 8 Ω, R″ = 10 Ω, R = 18 Ω, I = 0.67 A. Homes are parallel so one fuse does not darken the rest."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Circuit", r.t], ["Numbers", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["ser","series"],["par","parallel"],["mix","mixed"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.comb = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "joule"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("H = I²Rt. Tungsten 3380 °C. 1 kW iron at 220 V needs a 5 A fuse.");
    L.legend([["#ef4444","heat"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      joule: {t:"H = I²Rt", d:"Joule’s law: heat ∝ I², ∝ R, ∝ t. Same I: the high-R element glows; the cord does not."},
      fuse: {t:"5 A fuse", d:"1 kW at 220 V draws 4.54 A, so a 5 A fuse. Tungsten filament melting point 3380 °C; bulbs filled with nitrogen and argon."},
      ex11: {t:"Example 11.11", d:"100 J each second in 4 Ω → I = 5 A, V = 20 V. Example 11.10: 840 W → 3.82 A, 57.60 Ω."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["joule","Joule"],["fuse","fuse"],["ex11","Example 11.11"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.heat = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "watt"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("P = VI = I²R = V²/R. 1 kW h = 3.6 × 10⁶ J. Fridge example: Rs 288.");
    L.legend([["#eab308","watt"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      watt: {t:"P = VI", d:"Also I²R and V²/R. 1 W = 1 V A. Example 11.12: 220 V × 0.50 A = 110 W."},
      unit: {t:"1 kW h = 3.6 × 10⁶ J", d:"Commercial unit. Example 11.13: 400 W × 8 h × 30 d = 96 kW h × Rs 3 = Rs 288."},
      q16: {t:"TV vs toaster (Q16)", d:"250 W for 1 h = 250 Wh. 1200 W for 10 min = 200 Wh. The TV uses more energy."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["watt","watt"],["unit","kW h"],["q16","Q16"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.pow = {mount: mount, draw: draw, select: select, state: st};
})();
