var App = window.App, LAB = window.LAB; window.SIMS = {};
function block(preset, watch, presets, map){
  var L = LAB, st = {preset: preset};
  function select(p){ st.preset=p; L.markPreset(p); L.timeline({maxT:3,step:0.25,speed:0.5}); L.watch(watch); L.legend([["#22c55e","solid"]]); L.controls(""); L.restart(true); }
  function draw(){ var r=map[st.preset]; var m=L.text(360,80,r.t,{size:18,weight:700})+L.text(360,160,r.d,{size:15}); L.svg(m,r.t,300); L.readout([["Idea",r.t],["Point",r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d); }
  function mount(){ L.presets(presets, st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  return {mount:mount,draw:draw,select:select,state:st};
}
window.SIMS.hide = block("tsa","Paint only the skins that remain after joining.",
  [["tsa","tanker"],["toy","toy"],["fru","no frustum"]],
  {tsa:{t:"Tanker",d:"A tanker TSA is CSA hemi + CSA cyl + CSA hemi."},
   toy:{t:"Toy",d:"Cone-on-hemisphere toy, equal radii. TSA = CSA hemi + CSA cone."},
   fru:{t:"Missing",d:"A frustum section in this reprint is not a section."}});
window.SIMS.lattu = block("lat","Do not add the two total surface areas.",
  [["lat","39.6"],["blk","163.86"],["net","+πr²"]],
  {lat:{t:"Lattu",d:"Example 1 lattu TSA, in cm² (1 dp), is 39.6."},
   blk:{t:"Block",d:"Example 2 block TSA, in cm² (2 dp), is 163.86."},
   net:{t:"Net",d:"Cube + hemisphere on one face. Net change vs the cube is +πr²."}});
window.SIMS.rocket = block("bath","Convert 1.45 m to 145 cm before mixing with r = 30 cm.",
  [["bath","3.3"],["org","63.585"],["ring","ring"]],
  {bath:{t:"Bath",d:"Example 4 TSA in m² (1 dp) is 3.3."},
   org:{t:"Orange",d:"Example 3 orange area, in cm² (3 dp), is 63.585."},
   ring:{t:"Ring",d:"Orange includes πr² − π(r′)² because the cone’s leftover ring is still visible."}});
window.SIMS.vol = block("shed","Volumes add. Occupied space is subtracted afterwards.",
  [["shed","1128.75"],["air","827.15"],["glass","163.54"]],
  {shed:{t:"Shed",d:"Empty shed volume, in m³ (2 dp), is 1128.75."},
   air:{t:"Air",d:"Air with machinery and workers, in m³ (2 dp), is 827.15."},
   glass:{t:"Glass",d:"Example 6 actual capacity, in cm³ (2 dp), is 163.54."}});
window.SIMS.ex = block("cap","Hemisphere plus cone, then the exercise bank.",
  [["cap","220"],["shots","100"],["fru","no frustum"]],
  {cap:{t:"Capsule",d:"Capsule surface area, in mm², is 220."},
   shots:{t:"Shots",d:"Ex 12.2 Q5 number of lead shots is 100."},
   fru:{t:"Missing",d:"A frustum formula in this reprint is not a section."}});
