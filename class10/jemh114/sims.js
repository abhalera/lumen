var App=window.App,LAB=window.LAB;window.SIMS={};
function block(preset,watch,presets,map){
  var L=LAB,st={preset:preset};
  function select(p){st.preset=p;L.markPreset(p);L.timeline({maxT:3,step:0.25,speed:0.5});L.watch(watch);L.legend([["#22c55e","chance"]]);L.controls("");L.restart(true);}
  function draw(){var r=map[st.preset];var m=L.text(360,80,r.t,{size:18,weight:700})+L.text(360,160,r.d,{size:15});L.svg(m,r.t,300);L.readout([["Idea",r.t],["Point",r.d]]);L.verdict("<b>"+r.t+"</b> "+r.d);}
  function mount(){L.presets(presets,st.preset,select);select(st.preset);App.pause();App.resetTimeline();}
  return {mount:mount,draw:draw,select:select,state:st};
}
window.SIMS.fair=block("hd","Fair means each listed outcome has the same chance.",
  [["hd","1/2"],["balls","1/3"],["car","not fair"]],
  {hd:{t:"Coin",d:"P(head) on a fair coin is 1/2."},
   balls:{t:"Balls",d:"One red, one blue, one yellow. P(blue) = 1/3."},
   car:{t:"Car",d:"A driver starting a car: starts or not. Equally likely? no — not a fair coin."}});
window.SIMS.ratio=block("gt4","Laplace’s ratio after the outcomes are equal.",
  [["gt4","1/3"],["sum","add to 1"],["eq","equally likely"]],
  {gt4:{t:"Die",d:"P(greater than 4) on a die is 1/3."},
   sum:{t:"Elementary",d:"Elementary events of one experiment add to 1."},
   eq:{t:"Need",d:"P(E)=n(E)/n(S) requires equally likely outcomes."}});
window.SIMS.comp=block("not","What does not happen fills the rest of 1.",
  [["not","0.95"],["imp","−1.5"],["ace","1/13"]],
  {not:{t:"Q5",d:"P(E)=0.05. P(not E) is 0.95."},
   imp:{t:"Q4",d:"Which cannot be a probability? −1.5."},
   ace:{t:"Ace",d:"P(ace) from 52 cards is 1/13."}});
window.SIMS.list=block("hh","List ordered pairs, then count.",
  [["hh","3/4"],["s8","5/36"],["star","starred"]],
  {hh:{t:"Coins",d:"Two different coins, P(at least one head) is 3/4."},
   s8:{t:"Dice",d:"Two dice, P(sum 8) is 5/36."},
   star:{t:"Starred",d:"Examples 10* and 11* in this reprint are starred geometric, not the exam listing method."}});
window.SIMS.ex=block("p95","Fill the bounds, then count.",
  [["p95","0.95"],["red","3/8"],["no2","no 14.2"]],
  {p95:{t:"Q5",d:"P(E)=0.05. P(not E) is 0.95."},
   red:{t:"Q8",d:"3 red + 5 black. P(red) = 3/8."},
   no2:{t:"End",d:"Exercise 14.2 of problems in this reprint is not a section — 14.2 is the summary."}});
