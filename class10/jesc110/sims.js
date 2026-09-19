// Class 10 Science, Chapter 10 (jesc110) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "parts"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Cornea does most of the bending. Lens fine-tunes. Near point about 25 cm; far point infinity. Image on the retina.");
    L.legend([["#38bdf8","cornea"],["#f59e0b","lens"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      parts: {t:"Eye as a camera", d:"Cornea, iris, pupil, crystalline lens, retina. Eyeball about 2.3 cm. Real inverted image on the retina; the brain interprets it."},
      acc: {t:"Accommodation", d:"Ciliary muscles: relax → thin lens, large f, distant. Contract → thick lens, small f, near. That ability is accommodation."},
      near: {t:"Near point 25 cm", d:"Least distance of distinct vision for a young adult with normal vision is about 25 cm. Far point of a normal eye is infinity. Closer than 25 cm: strain."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Topic", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["parts","parts"],["acc","accommodation"],["near","25 cm"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.eye = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "myo"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Myopia: image in front of the retina, concave lens. Hypermetropia: behind the retina, convex. Q6 −1.25 D; Q7 +3.0 D.");
    L.legend([["#ef4444","myopia −"],["#22c55e","hyper +"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      myo: {t:"Myopia", d:"Distant image in front of the retina. Far point nearer than infinity. Correct with a concave lens. Q6: far point 80 cm → −1.25 D."},
      hyp: {t:"Hypermetropia", d:"Nearby image behind the retina. Near point farther than 25 cm. Correct with a convex lens. Q7: near point 1 m → +3.0 D."},
      bif: {t:"Presbyopia / bifocals", d:"Accommodation falls with age. Bifocals: upper concave (distant), lower convex (near). Q5: −5.5 D → f ≈ −18.2 cm; +1.5 D → f ≈ +66.7 cm."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Defect", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["myo","myopia"],["hyp","hypermetropia"],["bif","bifocals"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.defects = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "shape"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Prism faces are inclined. Emergent ray is not parallel to the incident ray — that leftover turn is D.");
    L.legend([["#38bdf8","incident"],["#f59e0b","emergent"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      shape: {t:"Angle of the prism A", d:"Two triangular bases, three rectangular lateral faces. A is the angle between two lateral faces."},
      bend: {t:"Two faces, two bends", d:"Air→glass: towards the normal. Glass→air: away from the normal. Same kind of bending as a slab."},
      D: {t:"Angle of deviation D", d:"Because the faces are not parallel, the emergent ray is bent at an angle D to the incident direction. A slab only side-steps."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["shape","angle A"],["bend","two bends"],["D","deviation D"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.prism = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "band"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("VIBGYOR. Red least deviation, violet most. Rainbow opposite the Sun.");
    L.legend([["#ef4444","red"],["#7c3aed","violet"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      band: {t:"VIBGYOR", d:"White sunlight through a prism becomes Violet, Indigo, Blue, Green, Yellow, Orange, Red. That splitting is dispersion."},
      bend: {t:"Red least, violet most", d:"Different colours emerge along different paths. A second inverted prism recombines them to white (Newton)."},
      bow: {t:"Rainbow", d:"Natural spectrum after rain, opposite the Sun. Droplets refract, disperse, internally reflect, refract out. Sun behind you."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Topic", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["band","VIBGYOR"],["bend","red vs violet"],["bow","rainbow"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.disp = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "star"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Stars twinkle; planets do not. Sun about 2 minutes early and 2 minutes late.");
    L.legend([["#eab308","star"],["#38bdf8","planet"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      star: {t:"Twinkling", d:"Atmospheric refraction in changing air. A point-sized star flickers in position and brightness. Apparent position is slightly higher."},
      planet: {t:"Planets do not twinkle", d:"Closer, extended sources. Variations from many point-like bits average out."},
      sun: {t:"2-minute Sun", d:"Visible about 2 minutes before actual sunrise and 2 minutes after actual sunset. Flattening of the disc is the same effect."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Effect", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["star","stars"],["planet","planets"],["sun","2 minutes"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.atmo = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "blue"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Fine particles scatter shorter wavelengths more. Red is least scattered. No atmosphere, no blue.");
    L.legend([["#3b82f6","blue scatter"],["#ef4444","red signal"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      blue: {t:"Why the sky is blue", d:"Air molecules scatter shorter wavelengths more. Red is about 1.8 times longer than blue (rough comparison in the reprint — still visible red)."},
      red: {t:"Danger signals", d:"Red is least scattered by fog or smoke, so it can be seen in the same colour at a distance."},
      dark: {t:"Astronaut’s sky (Q12)", d:"Little atmosphere, little scattering, so the sky appears dark instead of blue. Tyndall: a beam in a smoky room or forest mist."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Topic", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["blue","blue sky"],["red","red signals"],["dark","astronaut"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.sky = {mount: mount, draw: draw, select: select, state: st};
})();
