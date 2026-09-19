var App=window.App,LAB=window.LAB;window.SIMS={};
function block(preset,watch,presets,map){
  var L=LAB,st={preset:preset};
  function select(p){st.preset=p;L.markPreset(p);L.timeline({maxT:3,step:0.25,speed:0.5});L.watch(watch);L.legend([["#22c55e","data"]]);L.controls("");L.restart(true);}
  function draw(){var r=map[st.preset];var m=L.text(360,80,r.t,{size:18,weight:700})+L.text(360,160,r.d,{size:15});L.svg(m,r.t,300);L.readout([["Idea",r.t],["Point",r.d]]);L.verdict("<b>"+r.t+"</b> "+r.d);}
  function mount(){L.presets(presets,st.preset,select);select(st.preset);App.pause();App.resetTimeline();}
  return {mount:mount,draw:draw,select:select,state:st};
}
window.SIMS.direct=block("g62","The mid-point stands in for the whole class.",
  [["g62","62"],["u59","59.3"],["why","mid-point"]],
  {g62:{t:"Grouped",d:"Table 13.3 grouped mean is 62."},
   u59:{t:"List",d:"Ungrouped mean of the same 30 marks (1 dp) is 59.3."},
   why:{t:"Gap",d:"62 differs from 59.3 because each class is replaced by its mid-point."}});
window.SIMS.assumed=block("a62","a is a shift, not a guess.",
  [["a62","62"],["inv","invariant"],["di","di"]],
  {a62:{t:"Table 13.4",d:"47.5 + 435/30 equals 62."},
   inv:{t:"Activity 1",d:"Changing a in Activity 1 leaves the mean at 62."},
   di:{t:"Deviation",d:"di equals xi − a."}});
window.SIMS.step=block("e2","The three methods are the same Σfixi in disguise.",
  [["e2","39.71"],["e3","152.89"],["same","agree"]],
  {e2:{t:"Example 2",d:"Example 2 mean (2 dp) is 39.71."},
   e3:{t:"Example 3",d:"Example 3 mean (2 dp) is 152.89."},
   same:{t:"Identity",d:"Direct, assumed, step-deviation on one table must agree."}});
window.SIMS.mode=block("e4","Tallest bar, then interpolate.",
  [["e4","2"],["e5","3.286"],["e6","52"]],
  {e4:{t:"Example 4",d:"Example 4 ungrouped mode is 2."},
   e5:{t:"Example 5",d:"Example 5 mode (3 dp) is 3.286."},
   e6:{t:"Example 6",d:"Example 6 grouped mode is 52."}});
window.SIMS.med=block("m66","cf is the class before the median class.",
  [["m66","66.4"],["h149","149.03"],["xy","9 and 15"]],
  {m66:{t:"Worked",d:"Worked median 60+45/7, 1 dp, is 66.4."},
   h149:{t:"Example 7",d:"Example 7 median, cm (2 dp), is 149.03."},
   xy:{t:"Example 8",d:"Example 8: x and y are 9 and 15."}});
window.SIMS.ex=block("pl","n=20 and tiny xi: use the direct method.",
  [["pl","8.1"],["no4","no 13.4"],["cmp","skew"]],
  {pl:{t:"Q1",d:"Ex 13.1 Q1 mean plants (1 dp) is 8.1."},
   no4:{t:"End",d:"Exercise 13.4 in this reprint is not a section."},
   cmp:{t:"Skew",d:"On Table 13.3, mode 52 vs mean 62 means a few high scores pull the mean up."}});
