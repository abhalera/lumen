// Class 10 Maths, Chapter 10 (jemh110) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function block(id, preset, watch, presets, map){
  var L = LAB, st = {preset: preset};
  function select(p){
    st.preset = p; L.markPreset(p); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch(watch); L.legend([["#22c55e","circle"]]); L.controls(""); L.restart(true);
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

window.SIMS.line = block("line", "sec", "A line misses, cuts twice, or kisses once.",
  [["sec","secant"],["tan","tangent"],["none","no fourth"]],
  {
    sec: {t:"Secant", d:"A line intersecting a circle in two points is a secant."},
    tan: {t:"Tangent", d:"A tangent intersects a circle in exactly one point."},
    none: {t:"Catalogue", d:"Besides miss / secant / tangent, another position of a line vs a circle is impossible — those three are all."}
  });

window.SIMS.exist = block("exist", "one", "A tangent is a secant whose chord has collapsed.",
  [["one","one at P"],["par","two parallels"],["coinc","coinciding"]],
  {
    one: {t:"At P", d:"At a point of a circle there is exactly one tangent."},
    par: {t:"Parallels", d:"Tangents parallel to a given secant: at most two."},
    coinc: {t:"Collapsed", d:"A tangent is a secant whose corresponding chord has coinciding endpoints."}
  });

window.SIMS.perp = block("perp", "th1", "The shortest join from the centre to the tangent is the radius.",
  [["th1","Theorem 10.1"],["q3","√119"],["many","infinitely many"]],
  {
    th1: {t:"Perpendicular", d:"The tangent at P is perpendicular to the radius through P."},
    q3: {t:"Q3", d:"Radius 5, OQ=12. PQ = √119 cm."},
    many: {t:"Q1", d:"How many tangents can a circle have? infinitely many."}
  });

window.SIMS.count = block("count", "in", "Inside none, on one, outside two.",
  [["in","inside"],["out","outside"],["len","length"]],
  {
    in: {t:"Inside", d:"Through a point inside a circle, the number of tangents is zero."},
    out: {t:"Outside", d:"From an external point the number of tangents is exactly two."},
    len: {t:"Length", d:"The length of the tangent from P is the segment from P to the point of contact."}
  });

window.SIMS.equal = block("equal", "eq", "RHS or Pythagoras: the two tangents from P are equal.",
  [["eq","equal"],["tp","20/3"],["double","2∠OPQ"]],
  {
    eq: {t:"Theorem 10.2", d:"Tangents from an external point are equal."},
    tp: {t:"Example 3", d:"Example 3: TP in cm is 6.67 (that is 20/3)."},
    double: {t:"Example 2", d:"Example 2: ∠PTQ equals 2∠OPQ."}
  });

window.SIMS.ex = block("ex", "r7", "Two right angles leave 180° for ∠POQ and ∠PTQ.",
  [["r7","7 cm"],["ptq","70°"],["tri","15 and 13"]],
  {
    r7: {t:"Q1", d:"Tangent 24 cm, OQ=25 cm. Radius = 7 cm."},
    ptq: {t:"Q2", d:"Fig. 10.11, ∠POQ=110°. ∠PTQ = 70°."},
    tri: {t:"Q12", d:"Q12: AB and AC are 15 cm and 13 cm."}
  });
