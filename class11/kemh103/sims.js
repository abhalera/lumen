var App = window.App;
window.SIMS = {};
function setActivePreset(btn){
  document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
  if(btn) btn.classList.add("active");
}
function svgEl(){ return document.getElementById("diagram"); }
function readout(html){ var n = document.getElementById("lab-readout"); if(n) n.innerHTML = html; }
function verdict(html){ var n = document.getElementById("lab-verdict"); if(n) n.innerHTML = html; }
function cell(label, val, color){
  return '<div class="telemetry-cell"><div class="telemetry-label">' + label + '</div><div class="telemetry-val"' +
    (color ? ' style="color:' + color + '"' : '') + '>' + val + '</div></div>';
}

window.SIMS.degrad = (function(){
  var deg = 30;
  function mount(){
    App.state.maxT = 6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Degree</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Radian (arc)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-30">30° = π/6</button>' +
      '<button class="preset-btn" id="p-90">90° = π/2</button>' +
      '<button class="preset-btn" id="p-240">240° = 4π/3</button>' +
      '<button class="preset-btn" id="p-m47">−47°30′ = −19π/72</button>';
    document.getElementById("p-30").onclick=function(){setActivePreset(this);deg=30;App.resetTimeline();};
    document.getElementById("p-90").onclick=function(){setActivePreset(this);deg=90;App.resetTimeline();};
    document.getElementById("p-240").onclick=function(){setActivePreset(this);deg=240;App.resetTimeline();};
    document.getElementById("p-m47").onclick=function(){setActivePreset(this);deg=-47.5;App.resetTimeline();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(t){
    var svg=svgEl(); if(!svg) return;
    var th = deg * Math.PI/180 * Math.min(1,(t||0)/4 + 0.15);
    var cx=240, cy=160, r=110;
    var m='<rect width="720" height="300" fill="#09131d"/>';
    m += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#334155"/>';
    m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r)+'" y2="'+cy+'" stroke="#64748b"/>';
    m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r*Math.cos(-th))+'" y2="'+(cy+r*Math.sin(-th))+'" stroke="#38bdf8" stroke-width="3"/>';
    var rad = deg * Math.PI/180;
    m += '<text x="520" y="80" fill="#f8fafc" font-size="16">'+deg+'° </text>';
    m += '<text x="520" y="120" fill="#f59e0b" font-size="16">'+(rad<0?"−":"")+(Math.abs(rad)/Math.PI).toFixed(4)+' π rad</text>';
    m += '<text x="520" y="160" fill="#94a3b8" font-size="13">table p.4: 30°=π/6 … 360°=2π</text>';
    svg.innerHTML=m;
    readout(cell("Degrees", deg+"°") + cell("Radians", (rad).toFixed(4), "#f59e0b") + cell("π units", (rad/Math.PI).toFixed(4)+" π"));
    verdict("<b>§3.2.4:</b> π rad = 180°. Anticlockwise positive (Fig 3.1). A number without ° is a radian.");
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.arclen = (function(){
  var mode="pend";
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>radius r</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>arc l</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-p">Pendulum Ex 3.1.7</button>' +
      '<button class="preset-btn" id="p-c">Chord Ex 3.1.5</button>' +
      '<button class="preset-btn" id="p-w">Minute hand Ex 4</button>';
    document.getElementById("p-p").onclick=function(){setActivePreset(this);mode="pend";App.resetTimeline();App.play();};
    document.getElementById("p-c").onclick=function(){setActivePreset(this);mode="chord";App.resetTimeline();App.play();};
    document.getElementById("p-w").onclick=function(){setActivePreset(this);mode="watch";App.resetTimeline();App.play();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(t){
    var svg=svgEl(); if(!svg) return;
    var m='<rect width="720" height="300" fill="#09131d"/>';
    var cx=260, cy=160, r=100, th, l, note;
    if(mode==="pend"){ th=(2/15)*Math.min(1,(t||0)/4); l=75*th; note="Ex 3.1.7(i): r=75 cm, l=10 cm, θ=2/15 rad."; r=90; }
    else if(mode==="chord"){ th=Math.PI/3; l=20*th; note="Ex 3.1.5: r=20, chord=20, equilateral, minor arc 20π/3."; }
    else { th=4*Math.PI/3 * Math.min(1,(t||0)/5); l=1.5*th; note="Example 4: 40 min = 4π/3 rad, l=2π=6.28 cm."; }
    m += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#334155"/>';
    m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r)+'" y2="'+cy+'" stroke="#38bdf8"/>';
    m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r*Math.cos(-th))+'" y2="'+(cy+r*Math.sin(-th))+'" stroke="#38bdf8"/>';
    m += '<text x="500" y="80" fill="#f8fafc" font-size="14">l = r θ</text>';
    m += '<text x="500" y="120" fill="#f59e0b" font-size="14">θ = '+th.toFixed(3)+' rad</text>';
    m += '<text x="500" y="160" fill="#34d399" font-size="14">l ≈ '+ (mode==="pend"? (75*th).toFixed(2): mode==="chord"? (20*Math.PI/3).toFixed(2): (1.5*th).toFixed(2)) +' cm</text>';
    svg.innerHTML=m;
    readout(cell("θ", th.toFixed(3)+" rad") + cell("l = rθ", (mode==="chord"?20*Math.PI/3: (mode==="pend"?75:1.5)*th).toFixed(3)+" cm", "#34d399"));
    verdict("<b>Arc length:</b> "+note);
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.unitcircle = (function(){
  function mount(){
    App.state.maxT=8; var s=document.getElementById("time-scrubber"); if(s) s.max=8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>cos x (adjacent)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>sin x (opposite)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-go">Sweep 0 → 2π</button>' +
      '<button class="preset-btn" id="p-q">Quadrantals</button>';
    document.getElementById("p-go").onclick=function(){setActivePreset(this);App.resetTimeline();App.play();};
    document.getElementById("p-q").onclick=function(){setActivePreset(this);App.state.t=0;App.resetTimeline();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(t){
    var svg=svgEl(); if(!svg) return;
    var x = ((t||0)/8)*2*Math.PI;
    var cx=260, cy=160, r=110;
    var c=Math.cos(x), s=Math.sin(x);
    var m='<rect width="720" height="300" fill="#09131d"/>';
    m += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#334155"/>';
    m += '<line x1="'+(cx-r-10)+'" y1="'+cy+'" x2="'+(cx+r+10)+'" y2="'+cy+'" stroke="#334155"/>';
    m += '<line x1="'+cx+'" y1="'+(cy-r-10)+'" x2="'+cx+'" y2="'+(cy+r+10)+'" stroke="#334155"/>';
    m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r*c)+'" y2="'+(cy-r*s)+'" stroke="#f8fafc" stroke-width="2"/>';
    m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r*c)+'" y2="'+cy+'" stroke="#38bdf8" stroke-width="3"/>';
    m += '<line x1="'+(cx+r*c)+'" y1="'+cy+'" x2="'+(cx+r*c)+'" y2="'+(cy-r*s)+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<circle cx="'+(cx+r*c)+'" cy="'+(cy-r*s)+'" r="6" fill="#34d399"/>';
    m += '<text x="500" y="70" fill="#38bdf8">cos x = '+c.toFixed(3)+'</text>';
    m += '<text x="500" y="110" fill="#f59e0b">sin x = '+s.toFixed(3)+'</text>';
    m += '<text x="500" y="150" fill="#94a3b8">cos²+sin² = '+(c*c+s*s).toFixed(3)+'</text>';
    svg.innerHTML=m;
    readout(cell("x", (x/Math.PI).toFixed(3)+" π") + cell("cos", c.toFixed(3), "#38bdf8") + cell("sin", s.toFixed(3), "#f59e0b"));
    verdict("<b>Fig 3.6:</b> P=(cos x, sin x) on the unit circle. Play to walk one revolution. Identity cos²+sin²=1 is Pythagoras.");
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.astc = (function(){
  var mode="q3";
  function mount(){
    App.state.maxT=4; var s=document.getElementById("time-scrubber"); if(s) s.max=4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Positive</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Negative</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-1">Ex 3.2.1 QIII cos=−1/2</button>' +
      '<button class="preset-btn" id="p-2">Ex 3.2.2 QII sin=3/5</button>' +
      '<button class="preset-btn active" id="p-3">Ex 3.2.4 QIV sec=13/5</button>';
    document.getElementById("p-1").onclick=function(){setActivePreset(this);mode="q3";App.resetTimeline();};
    document.getElementById("p-2").onclick=function(){setActivePreset(this);mode="q2";App.resetTimeline();};
    document.getElementById("p-3").onclick=function(){setActivePreset(this);mode="q4";App.resetTimeline();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(){
    var svg=svgEl(); if(!svg) return;
    var m='<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="40" y="40" width="200" height="110" fill="#34d39922" stroke="#34d399"/><text x="140" y="100" fill="#f8fafc" text-anchor="middle">QI All +</text>';
    m += '<rect x="240" y="40" width="200" height="110" fill="#38bdf822" stroke="#38bdf8"/><text x="340" y="100" fill="#f8fafc" text-anchor="middle">QII Sin +</text>';
    m += '<rect x="40" y="150" width="200" height="110" fill="#f59e0b22" stroke="#f59e0b"/><text x="140" y="210" fill="#f8fafc" text-anchor="middle">QIV Cos +</text>';
    m += '<rect x="240" y="150" width="200" height="110" fill="#f8717122" stroke="#f87171"/><text x="340" y="210" fill="#f8fafc" text-anchor="middle">QIII Tan +</text>';
    var msg, vals;
    if(mode==="q3"){ msg="QIII: cos=−1/2 ⇒ sin=−√3/2, tan=√3"; vals=["sin −√3/2","cos −1/2","tan √3"]; }
    else if(mode==="q2"){ msg="QII: sin=3/5 ⇒ cos=−4/5, tan=−3/4"; vals=["sin 3/5","cos −4/5","tan −3/4"]; }
    else { msg="QIV: sec=13/5 ⇒ cos=5/13, sin=−12/13"; vals=["sin −12/13","cos 5/13","tan −12/5"]; }
    m += '<text x="560" y="90" fill="#f8fafc" font-size="13" text-anchor="middle">'+vals[0]+'</text>';
    m += '<text x="560" y="130" fill="#f8fafc" font-size="13" text-anchor="middle">'+vals[1]+'</text>';
    m += '<text x="560" y="170" fill="#f8fafc" font-size="13" text-anchor="middle">'+vals[2]+'</text>';
    svg.innerHTML=m;
    readout(cell("Case", mode.toUpperCase()) + cell("ASTC", msg));
    verdict("<b>Ex 3.2.1–5 (zoom p.15):</b> Pythagoras gives the absolute values; ASTC paints the signs. "+msg);
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.sumdiff = (function(){
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>x</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>y</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>x+y</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-75">75° = 45°+30°</button>' +
      '<button class="preset-btn" id="p-15">15° = 45°−30°</button>';
    var self=this;
    document.getElementById("p-75").onclick=function(){setActivePreset(this); window._sd = "plus"; App.resetTimeline();};
    document.getElementById("p-15").onclick=function(){setActivePreset(this); window._sd = "minus"; App.resetTimeline();};
    window._sd="plus";
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(){
    var svg=svgEl(); if(!svg) return;
    var plus = (window._sd!=="minus");
    var x=Math.PI/4, y=Math.PI/6, s = plus ? x+y : x-y;
    var m='<rect width="720" height="300" fill="#09131d"/>';
    var cx=240, cy=160, r=110;
    m += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#334155"/>';
    function ray(ang,col){ return '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r*Math.cos(-ang))+'" y2="'+(cy+r*Math.sin(-ang))+'" stroke="'+col+'" stroke-width="3"/>'; }
    m += ray(x,"#38bdf8")+ray(y,"#f59e0b")+ray(s,"#34d399");
    var val = plus ? (Math.sqrt(6)+Math.sqrt(2))/4 : (Math.sqrt(6)-Math.sqrt(2))/4;
    var tval = plus ? 2+Math.sqrt(3) : 2-Math.sqrt(3);
    m += '<text x="500" y="80" fill="#f8fafc" font-size="14">'+(plus?"sin 75°":"sin 15°")+' = '+val.toFixed(4)+'</text>';
    m += '<text x="500" y="120" fill="#f59e0b" font-size="14">'+(plus?"tan 75°":"tan 15°")+' = '+tval.toFixed(4)+'</text>';
    svg.innerHTML=m;
    readout(cell("x","45°") + cell("y","30°") + cell(plus?"sin(x+y)":"sin(x−y)", val.toFixed(4), "#34d399"));
    verdict("<b>Ex 3.3.5 / Fig 3.14:</b> "+(plus?"sin(45+30)=(√6+√2)/4":"tan(45−30)=2−√3")+". One chord identity (cos(x+y)) generates the family.");
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.double = (function(){
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>sin x</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>sin 2x = 2 sin x cos x</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-d">Sweep x, watch 2x</button>';
    document.getElementById("p-d").onclick=function(){setActivePreset(this);App.resetTimeline();App.play();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(t){
    var svg=svgEl(); if(!svg) return;
    var x=((t||0)/6)*Math.PI;
    function X(u){ return 60+u*90; }
    function Y(v){ return 160-v*90; }
    var m='<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="60" y1="160" x2="680" y2="160" stroke="#334155"/>';
    var d1="", d2="";
    for(var u=0;u<=Math.PI+0.02;u+=0.05){
      d1 += (u===0?"M":"L")+" "+X(u)+" "+Y(Math.sin(u));
      d2 += (u===0?"M":"L")+" "+X(u)+" "+Y(Math.sin(2*u));
    }
    m += '<path d="'+d1+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<path d="'+d2+'" fill="none" stroke="#34d399" stroke-width="2"/>';
    m += '<circle cx="'+X(x)+'" cy="'+Y(Math.sin(x))+'" r="5" fill="#38bdf8"/>';
    m += '<circle cx="'+X(x)+'" cy="'+Y(Math.sin(2*x))+'" r="5" fill="#34d399"/>';
    svg.innerHTML=m;
    var two=2*Math.sin(x)*Math.cos(x);
    readout(cell("x", (x*180/Math.PI).toFixed(0)+"°") + cell("sin 2x", Math.sin(2*x).toFixed(3), "#34d399") + cell("2 sin cos", two.toFixed(3)));
    verdict("<b>Double angle:</b> the green curve oscillates twice as fast. Numerically sin 2x = 2 sin x cos x (readout agrees). Ex 3.3.24–25 build 4x and 6x from this.");
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.halfang = (function(){
  var mode="q2";
  function mount(){
    App.state.maxT=4; var s=document.getElementById("time-scrubber"); if(s) s.max=4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>x</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>x/2</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-8">Misc 8: QII → QI</button>' +
      '<button class="preset-btn" id="p-9">Misc 9: QIII → QII</button>' +
      '<button class="preset-btn" id="p-10">Misc 10: QII → QI</button>';
    document.getElementById("p-8").onclick=function(){setActivePreset(this);mode="q2";App.resetTimeline();};
    document.getElementById("p-9").onclick=function(){setActivePreset(this);mode="q3";App.resetTimeline();};
    document.getElementById("p-10").onclick=function(){setActivePreset(this);mode="q2b";App.resetTimeline();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(){
    var svg=svgEl(); if(!svg) return;
    var m='<rect width="720" height="300" fill="#09131d"/>';
    var cx=240, cy=160, r=110;
    m += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#334155"/>';
    var ang, half, note, vals;
    if(mode==="q2"){ ang=Math.PI*0.7; half=ang/2; note="Misc 8: tan x=−4/3 in QII. x/2 in QI. tan(x/2)=2."; vals="sin(x/2)=2/√5, cos=1/√5, tan=2"; }
    else if(mode==="q3"){ ang=Math.PI*1.2; half=ang/2; note="Misc 9: cos x=−1/3 in QIII. x/2 in QII. tan(x/2)=−√2."; vals="sin=√(2/3), cos=−√(1/3), tan=−√2"; }
    else { ang=Math.PI*0.8; half=ang/2; note="Misc 10: sin x=1/4 in QII. x/2 in QI."; vals="√((4±√15)/8)"; }
    function ray(a,col){ return '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r*Math.cos(-a))+'" y2="'+(cy+r*Math.sin(-a))+'" stroke="'+col+'" stroke-width="3"/>'; }
    m += ray(ang,"#38bdf8")+ray(half,"#34d399");
    m += '<text x="500" y="80" fill="#f8fafc" font-size="13">'+vals+'</text>';
    svg.innerHTML=m;
    readout(cell("x quadrant", mode==="q3"?"III":"II") + cell("x/2 quadrant", mode==="q3"?"II":"I", "#34d399"));
    verdict("<b>Half-angle signs:</b> "+note+" Formulae give ±; the halved interval picks the sign.");
  }
  return {mount:mount,draw:draw};
})();
