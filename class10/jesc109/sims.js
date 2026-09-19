// Class 10 Science, Chapter 9 (jesc109) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "laws"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Laws of reflection hold for plane and spherical surfaces. Plane-mirror m = +1: virtual, erect, same size.");
    L.legend([["#38bdf8","incident"],["#f59e0b","reflected"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      laws: {t:"i = r, coplanar", d:"Angle of incidence equals angle of reflection. Incident ray, normal and reflected ray lie in the same plane."},
      plane: {t:"Plane-mirror image", d:"Always virtual and erect, same size, as far behind as the object is in front, laterally inverted. Magnification +1."},
      spoon: {t:"Activity 9.1 spoon", d:"Inner surface ≈ concave; bulged back ≈ convex. The ray model is this chapter’s tool; diffraction is later."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["laws","two laws"],["plane","plane image"],["spoon","spoon"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.plane = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "terms"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("R = 2f for small apertures. Table 9.1: between P and F is the virtual enlarged (shaving) case.");
    L.legend([["#22c55e","real"],["#f472b6","virtual"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      terms: {t:"P, C, F and R = 2f", d:"Pole on the surface. C in front for concave. F midway between P and C when the aperture is small."},
      table: {t:"Table 9.1 between P and F", d:"Object between pole and focus: image behind the mirror, enlarged, virtual and erect. That is Exercise Q2 (d) and Q7."},
      uses: {t:"Torches, dentist, furnace", d:"Headlights and solar furnaces use concave mirrors. Shaving and dentist mirrors use the enlarged virtual case."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Topic", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["terms","R = 2f"],["table","Table 9.1"],["uses","uses"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.conc = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "tab2"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Convex: always virtual, erect, diminished. Rear-view because of the wider field of view.");
    L.legend([["#f59e0b","virtual erect"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      tab2: {t:"Table 9.2", d:"Object anywhere in front: image between P and F behind the mirror, diminished, virtual and erect."},
      rear: {t:"Rear-view / wing mirror", d:"Always erect, though diminished, and a wider field of view than a plane mirror. Exercise Q8 (b)."},
      agra: {t:"Agra Fort", d:"A convex mirror on a wall facing the Taj Mahal can show a full image of a large building."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Topic", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["tab2","Table 9.2"],["rear","rear-view"],["agra","Agra Fort"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.conv = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "ex1"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.6});
    L.watch("Mirror formula 1/v + 1/u = 1/f. m = −v/u. Example 9.1 v = +1.15 m; Example 9.2 v = −37.5 cm.");
    L.legend([["#22c55e","convex +"],["#ef4444","concave −"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      ex1: {t:"Example 9.1 rear-view", d:"R = +3.00 m, u = −5.00 m, f = +1.50 m. v = +1.15 m behind the mirror, m = +0.23. Virtual, erect, smaller."},
      ex2: {t:"Example 9.2 screen", d:"h = +4.0 cm, u = −25.0 cm, f = −15.0 cm. v = −37.5 cm, h′ = −6.0 cm. Real, inverted, enlarged."},
      three: {t:"In-text 3× real", d:"Object at 10 cm, m = −3. Then v = −30 cm. Image 30 cm in front of the concave mirror."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Case", r.t], ["Numbers", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["ex1","Example 9.1"],["ex2","Example 9.2"],["three","3× real"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.mform = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "slab"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Snell: sin i / sin r = constant. n = c/v with c = 3×10⁸ m s⁻¹. Water 1.33; diamond 2.42.");
    L.legend([["#38bdf8","air"],["#a78bfa","glass"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      slab: {t:"Glass slab", d:"Towards the normal into glass, away coming out. Emergent ray parallel to the incident ray, shifted sideward."},
      table: {t:"Table 9.3", d:"Air 1.0003, water 1.33, kerosene 1.44, crown glass 1.52, diamond 2.42. Kerosene is optically denser than water."},
      snell: {t:"n = c/v", d:"c = 3×10⁸ m s⁻¹ in vacuum. Diamond 2.42 means light is that many times slower than in air."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["slab","slab"],["table","Table 9.3"],["snell","n = c/v"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.refr = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "tab4"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Table 9.4: object at 2F₁ → same-size real image at 2F₂. Needle at 50 cm ⇒ P = +4 D. Dictionary: 5 cm convex.");
    L.legend([["#22c55e","real"],["#f472b6","virtual"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      tab4: {t:"At 2F₁", d:"Object at twice the focal length: real, inverted, same size, at 2F₂. Exercise Q3 (b)."},
      mag: {t:"Between F and O", d:"Virtual, erect, enlarged — magnifying glass. Exercise Q6: convex 5 cm, not 50 cm, not concave."},
      half: {t:"Half covered (Q9)", d:"The image is still complete, only dimmer. Every object point still has rays through the open half."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Case", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["tab4","2F same size"],["mag","magnifier"],["half","Q9 half lens"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.clens = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "always"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Concave lens: always virtual, erect, diminished. Example 9.3 / Q11: u = −30 cm, m = +1/3.");
    L.legend([["#f472b6","virtual"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      always: {t:"Always virtual", d:"Table 9.5: whatever the object position, the image is virtual, erect and diminished. You cannot catch it on a screen."},
      ex3: {t:"Example 9.3 / Q11", d:"f = −15 cm, v = −10 cm → u = −30 cm. m = +0.33, one-third the object, erect."},
      both: {t:"f = −15 cm both (Q4)", d:"Negative focal length: both concave (mirror and lens). Convex of either kind would be positive."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Case", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["always","always virtual"],["ex3","Example 9.3"],["both","Q4 both concave"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.dlens = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "ex4"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.6});
    L.watch("Lens: 1/v − 1/u = 1/f and m = v/u. P = 1/f in metres. 1 D = 1 m⁻¹.");
    L.legend([["#22c55e","convex +"],["#ef4444","concave −"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      ex4: {t:"Example 9.4", d:"h = +2.0 cm, f = +10 cm, u = −15 cm. v = +30 cm, h′ = −4.0 cm, m = −2. Real, inverted, twice enlarged."},
      dioptre: {t:"1 dioptre", d:"Power of a lens with f = 1 metre. +2.0 D → f = +0.50 m (convex). −2.5 D → f = −0.40 m (concave)."},
      add: {t:"Powers add", d:"Lenses in contact: P = P₁ + P₂ + … Example: +2.0 D and +0.25 D give +2.25 D. Q16: −2.0 D → f = −0.50 m."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Topic", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["ex4","Example 9.4"],["dioptre","1 dioptre"],["add","powers add"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.pow = {mount: mount, draw: draw, select: select, state: st};
})();
