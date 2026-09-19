// Class 10 Maths, Chapter 9 (jemh109) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function sim(name, preset, watch, presets, map){
  var L = LAB, st = {preset: preset};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch(watch); L.legend([["#22c55e","trig"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets(presets, st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  var obj = {mount: mount, draw: draw, select: select, state: st};
  if (name === "see") window.SIMS.see = obj;
  else if (name === "one") window.SIMS.one = obj;
  else if (name === "eye") window.SIMS.eye = obj;
  else if (name === "two") window.SIMS.two = obj;
  else if (name === "flip") window.SIMS.flip = obj;
  else if (name === "ex") window.SIMS.ex = obj;
}

sim("see", "elev", "Both angles sit at the eye, against the horizontal.",
  [["elev","elevation"],["dep","depression"],["comp","complement"]],
  {
    elev: {t:"Elevation", d:"The angle of elevation is measured between the sight line and the horizontal at the eye."},
    dep: {t:"Depression", d:"A girl on a balcony looks down at a pot. The angle at her eye is depression."},
    comp: {t:"Measure at the eye", d:"A 30° angle at the tower top means the elevation at the eye is 60°."}
  });

sim("one", "ex1", "tan uses the paced baseline and the wanted height.",
  [["ex1","15√3"],["dec","25.98 m"],["why","not sin"]],
  {
    ex1: {t:"Example 1", d:"15 m away, elevation 60°. Height = 15√3 m."},
    dec: {t:"Decimal", d:"15√3 as a decimal, √3 = 1.732, is 25.98 m."},
    why: {t:"Why tan", d:"NCERT picks tan (or cot) for the minar, not sin, because sin needs the unmeasured hypotenuse."}
  });

sim("eye", "chim", "The triangle floats at eye level. Adjust the opposite segment first.",
  [["chim","30 m"],["lad","4.28 m"],["half","half at 60°"]],
  {
    chim: {t:"Chimney", d:"Observer 1.5 m, 28.5 m, 45°. Chimney = 30 m."},
    lad: {t:"Ladder", d:"Ladder length in Example 2 is 4.28 m."},
    half: {t:"60°", d:"Footing 2.14 m is half the 4.28 m ladder because cos 60° = 1/2 here, not a general rule."}
  });

sim("two", "ap", "One tan equation per triangle. Shared side is the hinge.",
  [["ap","10√3"],["flag","7.32 m"],["shad","tower h"]],
  {
    ap: {t:"Example 4", d:"Building 10 m, elevation 30°. AP = 10√3 m."},
    flag: {t:"Flagstaff", d:"Flagstaff length in Example 4 is 7.32 m."},
    shad: {t:"Example 5", d:"In Example 5 the hinge side is the tower h, shared by both triangles."}
  });

sim("flip", "alt", "Depression at the top equals elevation at the bottom.",
  [["alt","alternate"],["riv","8.20 m"],["pd","4(√3+1)"]],
  {
    alt: {t:"Flip", d:"Depression 30° from the top equals elevation 30° (alternate angles)."},
    riv: {t:"River", d:"River width in Example 7, √3=1.732, is about 8.2 m."},
    pd: {t:"Example 6", d:"PD + 8 = PD√3. Exact PD is 4(√3+1) m after rationalising."}
  });

sim("ex", "rope", "Fifteen scenes, two summary points. No Exercise 9.2 of problems.",
  [["rope","10 m"],["canal","10 m"],["car","3 s"]],
  {
    rope: {t:"Q1", d:"20 m rope at 30°. Pole height = 10 m."},
    canal: {t:"Fig. 9.12", d:"Fig. 9.12: canal width is 10 m."},
    car: {t:"Q15", d:"Q15: seconds from the 60° point to the foot is 3 s."}
  });
