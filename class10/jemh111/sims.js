// Class 10 Maths, Chapter 11 (jemh111) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};
function block(preset, watch, presets, map){
  var L = LAB, st = {preset: preset};
  function select(p){
    st.preset = p; L.markPreset(p); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch(watch); L.legend([["#22c55e","area"]]); L.controls(""); L.restart(true);
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
  return {mount: mount, draw: draw, select: select, state: st};
}
window.SIMS.defs = block("sec", "Minor is the default. Major angle is 360° minus the minor.",
  [["sec","sector"],["seg","segment"],["maj","280°"]],
  {
    sec: {t:"Sector", d:"A sector is enclosed by two radii and the corresponding arc."},
    seg: {t:"Segment", d:"A segment is the region between a chord and the corresponding arc."},
    maj: {t:"Major", d:"If ∠AOB = 80°, the major sector’s angle in degrees is 280."}
  });
window.SIMS.frac = block("form", "θ/360 of the disc, or of the circumference.",
  [["form","area"],["arc","arc"],["q14","Q14"]],
  {
    form: {t:"Formula", d:"Sector area is (θ/360) π r²."},
    arc: {t:"Arc", d:"Arc length of angle θ is (θ/360) × 2π r."},
    q14: {t:"Q14", d:"Ex 11.1 Q14: area of a sector of angle p (degrees), radius R, is (p/360) π R²."}
  });
window.SIMS.seg = block("min", "Cut the triangle off the sector.",
  [["min","segment"],["e1","4.19"],["maj","46.1"]],
  {
    min: {t:"Definition", d:"A segment equals sector minus the triangle."},
    e1: {t:"Example 1", d:"Example 1 minor sector, in cm² (2 dp), is 4.19."},
    maj: {t:"Major", d:"Example 1 major sector is about 46.1 cm²."}
  });
window.SIMS.ex2 = block("sec", "Drop OM, then RHS, then subtract.",
  [["sec","462"],["om","21/2"],["seg","surd"]],
  {
    sec: {t:"Sector", d:"Example 2 sector area is 462 cm²."},
    om: {t:"OM", d:"OM equals 21/2 cm."},
    seg: {t:"Segment", d:"The segment is 21(88 − 21√3)/4 cm²."}
  });
window.SIMS.clock = block("hand", "Five minutes is a 30° sector of the clock.",
  [["hand","154/3"],["minr","28.5"],["arc","22"]],
  {
    hand: {t:"Q3", d:"14 cm minute hand, 5 minutes. Area = 154/3 cm²."},
    minr: {t:"Q4", d:"Q4 minor segment, π=3.14, is 28.5 cm²."},
    arc: {t:"Q5", d:"Q5 arc length, r=21, 60°, is 22 cm."}
  });
window.SIMS.horse = block("graze", "A corner peg is a quarter-circle inside the square.",
  [["graze","19.625"],["wire","285"],["optc","(C)"]],
  {
    graze: {t:"Q8", d:"Q8 (i) grazing area, in m² (3 dp), is 19.625."},
    wire: {t:"Q9", d:"Q9 total silver wire, in mm, is 285."},
    optc: {t:"Q14", d:"Q14 correct option is (p/360) π R²."}
  });
