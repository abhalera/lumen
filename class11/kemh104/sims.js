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
function plane(m, cx, cy){
  m += '<line x1="40" y1="'+cy+'" x2="680" y2="'+cy+'" stroke="#334155"/>';
  m += '<line x1="'+cx+'" y1="20" x2="'+cx+'" y2="280" stroke="#334155"/>';
  m += '<text x="670" y="'+(cy-8)+'" fill="#94a3b8" font-size="11">Re</text>';
  m += '<text x="'+(cx+6)+'" y="24" fill="#94a3b8" font-size="11">Im</text>';
  return m;
}
function XY(x,y){ return [360 + x*36, 160 - y*36]; }

window.SIMS.introi = (function(){
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>y = x²+1 (never zero)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>±i on the imaginary axis</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-r">Real graph of x²+1</button>' +
      '<button class="preset-btn" id="p-i">Place ±i</button>';
    document.getElementById("p-r").onclick=function(){setActivePreset(this); window._ii="real"; App.resetTimeline();};
    document.getElementById("p-i").onclick=function(){setActivePreset(this); window._ii="cpx"; App.resetTimeline();};
    window._ii="real";
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(){
    var svg=svgEl(); if(!svg) return;
    var m='<rect width="720" height="300" fill="#09131d"/>';
    if(window._ii!=="cpx"){
      m += '<line x1="40" y1="240" x2="680" y2="240" stroke="#334155"/><line x1="360" y1="20" x2="360" y2="280" stroke="#334155"/>';
      var d="";
      for(var x=-4;x<=4.05;x+=0.1){
        var X=360+x*70, Y=240-(x*x+1)*28;
        d += (x===-4?"M":"L")+" "+X+" "+Y;
      }
      m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">y=x²+1 ≥ 1 on the reals — never a root</text>';
      readout(cell("min y","1") + cell("Real roots","none", "#f87171"));
      verdict("<b>§4.1:</b> x²+1=0 has no real solution. That is why we adjoin i with i²=−1.");
    } else {
      m = plane(m,360,160);
      var p = XY(0,1), q = XY(0,-1);
      m += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="#34d399"/>';
      m += '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="7" fill="#f59e0b"/>';
      m += '<text x="'+(p[0]+14)+'" y="'+(p[1]+4)+'" fill="#34d399">i</text>';
      m += '<text x="'+(q[0]+14)+'" y="'+(q[1]+4)+'" fill="#f59e0b">−i</text>';
      readout(cell("i²","−1", "#34d399") + cell("roots of x²+1=0","i and −i"));
      verdict("<b>§4.2:</b> the symbol √(−1) means i, not −i. Both square to −1. Equal complex numbers ⇔ matching parts.");
    }
    svg.innerHTML=m;
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.cpxarith = (function(){
  var mode="add";
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>z₁</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>z₂</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>result</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-a">Add (parallelogram)</button>' +
      '<button class="preset-btn" id="p-m">Multiply (1−i)² = −2i</button>' +
      '<button class="preset-btn" id="p-v">Inverse of 2−3i</button>';
    document.getElementById("p-a").onclick=function(){setActivePreset(this);mode="add";App.resetTimeline();};
    document.getElementById("p-m").onclick=function(){setActivePreset(this);mode="mul";App.resetTimeline();};
    document.getElementById("p-v").onclick=function(){setActivePreset(this);mode="inv";App.resetTimeline();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function dot(m,x,y,col,lab){
    var p=XY(x,y);
    m += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="'+col+'"/>';
    m += '<text x="'+(p[0]+10)+'" y="'+(p[1]-8)+'" fill="'+col+'" font-size="12">'+lab+'</text>';
    return m;
  }
  function draw(){
    var svg=svgEl(); if(!svg) return;
    var m='<rect width="720" height="300" fill="#09131d"/>';
    m = plane(m,360,160);
    if(mode==="add"){
      m = dot(m,2,3,"#38bdf8","2+3i");
      m = dot(m,-6,5,"#f59e0b","−6+5i");
      m = dot(m,-4,8,"#34d399","−4+8i");
      readout(cell("z₁+z₂","−4 + 8i", "#34d399"));
      verdict("<b>§4.3.1:</b> add parts. On the plane this is the parallelogram law.");
    } else if(mode==="mul"){
      m = dot(m,1,-1,"#38bdf8","1−i");
      m = dot(m,0,-2,"#34d399","(1−i)²=−2i");
      readout(cell("(1−i)²","−2i") + cell("(1−i)⁴","−4", "#34d399"));
      verdict("<b>Ex 4.1.8:</b> (1−i)²=−2i, then square again: 4i²=−4. Each multiply-by-i is a 90° turn plus a scale.");
    } else {
      m = dot(m,2,-3,"#38bdf8","2−3i");
      m = dot(m,2/13,3/13,"#34d399","inverse");
      readout(cell("|z|²","13") + cell("z⁻¹","2/13 + 3i/13", "#34d399"));
      verdict("<b>Example 5, zoom p.7:</b> inverse = conjugate / |z|² = (2+3i)/13.");
    }
    svg.innerHTML=m;
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.poweri = (function(){
  function mount(){
    App.state.maxT=8; var s=document.getElementById("time-scrubber"); if(s) s.max=8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>iⁿ on the unit square</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-c">Cycle n = 0,1,2,3,4,…</button>' +
      '<button class="preset-btn" id="p-39">Jump to n = −39</button>';
    document.getElementById("p-c").onclick=function(){setActivePreset(this); window._pw="cyc"; App.resetTimeline(); App.play();};
    document.getElementById("p-39").onclick=function(){setActivePreset(this); window._pw="neg"; App.resetTimeline();};
    window._pw="cyc";
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(t){
    var svg=svgEl(); if(!svg) return;
    var n = window._pw==="neg" ? -39 : Math.floor((t||0)*2);
    var r = ((n%4)+4)%4;
    var pts=[[1,0,"1"],[0,1,"i"],[-1,0,"−1"],[0,-1,"−i"]];
    var m='<rect width="720" height="300" fill="#09131d"/>';
    m = plane(m,360,160);
    pts.forEach(function(p,i){
      var xy=XY(p[0]*2,p[1]*2);
      m += '<circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="'+(i===r?10:6)+'" fill="'+(i===r?"#34d399":"#38bdf8")+'"/>';
      m += '<text x="'+(xy[0]+12)+'" y="'+(xy[1]-8)+'" fill="#f8fafc">'+p[2]+'</text>';
    });
    svg.innerHTML=m;
    readout(cell("n", String(n)) + cell("n mod 4", String(r)) + cell("iⁿ", pts[r][2], "#34d399"));
    verdict("<b>§4.3.5 / Ex 4.1.3:</b> i^{4k}=1, i^{4k+1}=i, i^{4k+2}=−1, i^{4k+3}=−i. i⁻³⁹ has remainder 1 after the sign of the reciprocal of i³, and equals i.");
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.modulus = (function(){
  var mode="mod";
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>z</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>conjugate</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-m">|3+i|=√10</button>' +
      '<button class="preset-btn" id="p-c">Conjugate mirror</button>' +
      '<button class="preset-btn" id="p-i">Inverse of 4−3i</button>';
    document.getElementById("p-m").onclick=function(){setActivePreset(this);mode="mod";App.resetTimeline();};
    document.getElementById("p-c").onclick=function(){setActivePreset(this);mode="conj";App.resetTimeline();};
    document.getElementById("p-i").onclick=function(){setActivePreset(this);mode="inv";App.resetTimeline();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(){
    var svg=svgEl(); if(!svg) return;
    var m='<rect width="720" height="300" fill="#09131d"/>';
    m = plane(m,360,160);
    if(mode==="mod"){
      var p=XY(3,1);
      m += '<line x1="360" y1="160" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#34d399" stroke-width="2"/>';
      m += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#38bdf8"/>';
      readout(cell("|3+i|","√10 ≈ "+Math.sqrt(10).toFixed(3), "#34d399"));
      verdict("<b>§4.4 / Fig 4.2:</b> |z| is the distance OP. √(9+1)=√10.");
    } else if(mode==="conj"){
      var p=XY(2,3), q=XY(2,-3);
      m += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#38bdf8"/>';
      m += '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="6" fill="#f59e0b"/>';
      m += '<line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+q[0]+'" y2="'+q[1]+'" stroke="#64748b" stroke-dasharray="4 3"/>';
      readout(cell("z","2+3i") + cell("z̄","2−3i"));
      verdict("<b>Fig 4.3:</b> conjugate is the mirror image across the real axis.");
    } else {
      var p=XY(4,-3), q=XY(4/5, 3/5);
      m += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#38bdf8"/>';
      m += '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="6" fill="#34d399"/>';
      readout(cell("z","4−3i") + cell("|z|²","25") + cell("z⁻¹","4/25 + 3i/25", "#34d399"));
      verdict("<b>Ex 4.1.11:</b> inverse = conjugate / 25. The green point is scaled toward the origin and reflected.");
    }
    svg.innerHTML=m;
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.argand = (function(){
  var mode="fig";
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Fig 4.1 points</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-f">Fig 4.1 A–F</button>' +
      '<button class="preset-btn" id="p-14">Misc 14: (1+i)/(1−i)=i</button>' +
      '<button class="preset-btn" id="p-12">Misc 12: |1−i|^x=2^x</button>';
    document.getElementById("p-f").onclick=function(){setActivePreset(this);mode="fig";App.resetTimeline();};
    document.getElementById("p-14").onclick=function(){setActivePreset(this);mode="m14";App.resetTimeline();};
    document.getElementById("p-12").onclick=function(){setActivePreset(this);mode="m12";App.resetTimeline();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(){
    var svg=svgEl(); if(!svg) return;
    var m='<rect width="720" height="300" fill="#09131d"/>';
    m = plane(m,360,160);
    if(mode==="fig"){
      var pts=[[2,4,"A 2+4i"],[-2,3,"B −2+3i"],[0,1,"C i"],[2,0,"D 2"],[-5,-2,"E −5−2i"],[1,-2,"F 1−2i"]];
      pts.forEach(function(p){
        var xy=XY(p[0],p[1]);
        m += '<circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="5" fill="#38bdf8"/>';
        m += '<text x="'+(xy[0]+8)+'" y="'+(xy[1]-6)+'" fill="#94a3b8" font-size="11">'+p[2]+'</text>';
      });
      readout(cell("Map","x+iy ↔ (x,y)") + cell("Polar form","not in this reprint", "#f59e0b"));
      verdict("<b>Fig 4.1, zoom p.8:</b> six named points. §4.5’s heading promises polar form; the body after Fig 4.3 is miscellaneous examples. Not invented.");
    } else if(mode==="m14"){
      var p=XY(1,1), q=XY(1,-1), r=XY(0,2);
      m += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#38bdf8"/>';
      m += '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="6" fill="#f59e0b"/>';
      m += '<circle cx="'+r[0]+'" cy="'+r[1]+'" r="7" fill="#34d399"/>';
      readout(cell("(1+i)/(1−i)","i") + cell("least m with i^m=1","4", "#34d399"));
      verdict("<b>Misc. Ex 14:</b> the quotient is i (a quarter-turn). i⁴=1 is the first positive return to 1.");
    } else {
      readout(cell("|1−i|","√2") + cell("(√2)^x = 2^x","x=0 only") + cell("non-zero integral","none", "#f87171"));
      verdict("<b>Misc. Ex 12:</b> 2^{x/2}=2^x forces x=0, which is integral but excluded by the word non-zero. Count = 0.");
    }
    svg.innerHTML=m;
  }
  return {mount:mount,draw:draw};
})();
