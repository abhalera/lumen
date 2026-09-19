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
function rng(id){ var n = document.getElementById(id); return n ? Number(n.value) : 0; }
function setTxt(id, t){ var n = document.getElementById(id); if(n) n.textContent = t; }

function axes(ox, oy, scale){
  var m = '<rect width="720" height="300" fill="#09131d"/>';
  m += '<line x1="20" y1="'+oy+'" x2="700" y2="'+oy+'" stroke="#334155" stroke-width="1.5"/>';
  m += '<line x1="'+ox+'" y1="20" x2="'+ox+'" y2="280" stroke="#334155" stroke-width="1.5"/>';
  m += '<polygon points="700,'+oy+' 688,'+(oy-5)+' 688,'+(oy+5)+'" fill="#64748b"/>';
  m += '<polygon points="'+ox+',20 '+(ox-5)+',32 '+(ox+5)+',32" fill="#64748b"/>';
  m += '<text x="688" y="'+(oy+16)+'" fill="#94a3b8" font-size="11">x</text>';
  m += '<text x="'+(ox+8)+'" y="28" fill="#94a3b8" font-size="11">y</text>';
  var k, X, Y;
  for(k = -12; k <= 12; k++){
    if(k===0) continue;
    X = ox + k*scale; Y = oy - k*scale;
    if(X>28 && X<692){
      m += '<line x1="'+X+'" y1="'+(oy-3)+'" x2="'+X+'" y2="'+(oy+3)+'" stroke="#475569"/>';
    }
    if(Y>28 && Y<272){
      m += '<line x1="'+(ox-3)+'" y1="'+Y+'" x2="'+(ox+3)+'" y2="'+Y+'" stroke="#475569"/>';
    }
  }
  m += '<circle cx="'+ox+'" cy="'+oy+'" r="2.5" fill="#94a3b8"/>';
  return m;
}
function toX(ox, scale, x){ return ox + x*scale; }
function toY(oy, scale, y){ return oy - y*scale; }

window.SIMS.coordrecall = (function(){
  var mode = "dist";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>P, Q</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Segment / triangle</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-dist" id="p-dist">Distance (6,−4)→(3,0)</button>' +
      '<button class="preset-btn" data-preset="p-sec" id="p-sec">Section 1:3 of A(1,−3) B(−3,9)</button>' +
      '<button class="preset-btn" data-preset="p-area" id="p-area">Area (4,4),(3,−2),(−3,16)</button>';
    document.getElementById("p-dist").onclick = function(){ setActivePreset(this); mode="dist"; draw(0); };
    document.getElementById("p-sec").onclick = function(){ setActivePreset(this); mode="sec"; draw(0); };
    document.getElementById("p-area").onclick = function(){ setActivePreset(this); mode="area"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var ox=360, oy=160, sc=12;
    var m = axes(ox, oy, sc);
    if(mode==="dist"){
      var p1=[6,-4], p2=[3,0];
      m += '<line x1="'+toX(ox,sc,p1[0])+'" y1="'+toY(oy,sc,p1[1])+'" x2="'+toX(ox,sc,p2[0])+'" y2="'+toY(oy,sc,p2[1])+'" stroke="#f59e0b" stroke-width="2"/>';
      m += '<circle cx="'+toX(ox,sc,p1[0])+'" cy="'+toY(oy,sc,p1[1])+'" r="5" fill="#38bdf8"/>';
      m += '<circle cx="'+toX(ox,sc,p2[0])+'" cy="'+toY(oy,sc,p2[1])+'" r="5" fill="#34d399"/>';
      m += '<text x="'+toX(ox,sc,p1[0])+'" y="'+(toY(oy,sc,p1[1])+16)+'" fill="#e2e8f0" font-size="11">(6,−4)</text>';
      m += '<text x="'+(toX(ox,sc,p2[0])+6)+'" y="'+(toY(oy,sc,p2[1])-8)+'" fill="#e2e8f0" font-size="11">(3,0)</text>';
      readout(cell("PQ","√[(3−6)²+(0+4)²]","#f59e0b") + cell("Value","5 units","#34d399"));
      verdict("<b>Zoom p.2:</b> PQ = √(9+16) = <b>5</b>. Descartes’ plane turns geometry into algebra.");
    } else if(mode==="sec"){
      var A=[1,-3], B=[-3,9], r=1, n=3;
      var x=(r*B[0]+n*A[0])/(r+n), y=(r*B[1]+n*A[1])/(r+n);
      m += '<line x1="'+toX(ox,sc,A[0])+'" y1="'+toY(oy,sc,A[1])+'" x2="'+toX(ox,sc,B[0])+'" y2="'+toY(oy,sc,B[1])+'" stroke="#f59e0b" stroke-width="2"/>';
      m += '<circle cx="'+toX(ox,sc,A[0])+'" cy="'+toY(oy,sc,A[1])+'" r="5" fill="#38bdf8"/>';
      m += '<circle cx="'+toX(ox,sc,B[0])+'" cy="'+toY(oy,sc,B[1])+'" r="5" fill="#38bdf8"/>';
      m += '<circle cx="'+toX(ox,sc,x)+'" cy="'+toY(oy,sc,y)+'" r="6" fill="#f472b6"/>';
      m += '<text x="'+(toX(ox,sc,x)+8)+'" y="'+(toY(oy,sc,y))+'" fill="#f9a8d4" font-size="12">(0,0)</text>';
      readout(cell("Ratio m:n","1 : 3") + cell("Section point","(0, 0)","#f472b6"));
      verdict("<b>Internal division:</b> ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n)) = (0, 0). Mid-point is the m=n case.");
    } else {
      var A=[4,4], B=[3,-2], C=[-3,16];
      sc=8; ox=380; oy=170;
      m = axes(ox, oy, sc);
      m += '<polygon points="'+toX(ox,sc,A[0])+','+toY(oy,sc,A[1])+' '+toX(ox,sc,B[0])+','+toY(oy,sc,B[1])+' '+toX(ox,sc,C[0])+','+toY(oy,sc,C[1])+'" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" stroke-width="2"/>';
      readout(cell("Shoelace","½ |4(−2−16)+3(16−4)+(−3)(4+2)|") + cell("Area","27","#34d399"));
      verdict("<b>Area = 27.</b> If the shoelace vanishes, A, B, C are collinear — a line in disguise.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.slopeline = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Line ℓ</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Inclination θ</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" data-preset="p-0" id="p-0">θ = 0° (x-axis)</button>' +
      '<button class="preset-btn active" data-preset="p-60" id="p-60">θ = 60° (Ex 1d)</button>' +
      '<button class="preset-btn" data-preset="p-90" id="p-90">θ = 90° (undefined)</button>' +
      '<button class="preset-btn" data-preset="p-135" id="p-135">θ = 135°</button>';
    document.getElementById("p-0").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-th").value=0; draw(0); };
    document.getElementById("p-60").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-th").value=60; draw(0); };
    document.getElementById("p-90").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-th").value=90; draw(0); };
    document.getElementById("p-135").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-th").value=135; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Inclination θ</span><span class="val" id="th-val">60°</span></div>' +
      '<input type="range" id="ctrl-th" min="0" max="180" step="1" value="60"></div>';
    document.getElementById("ctrl-th").oninput = function(){ draw(0); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var th = rng("ctrl-th");
    setTxt("th-val", th+"°");
    var ox=360, oy=160, sc=28;
    var m = axes(ox, oy, sc);
    var rad = th * Math.PI / 180;
    var L = 11;
    if(Math.abs(th-90)>0.5){
      var dx = L * Math.cos(rad), dy = L * Math.sin(rad);
      m += '<line x1="'+toX(ox,sc,-dx)+'" y1="'+toY(oy,sc,-dy)+'" x2="'+toX(ox,sc,dx)+'" y2="'+toY(oy,sc,dy)+'" stroke="#38bdf8" stroke-width="3"/>';
    } else {
      m += '<line x1="'+ox+'" y1="30" x2="'+ox+'" y2="270" stroke="#f87171" stroke-width="3"/>';
    }
    var r = 48;
    m += '<path d="M '+(ox+r)+' '+oy+' A '+r+' '+r+' 0 '+(th>180?1:0)+' 0 '+(ox+r*Math.cos(rad))+' '+(oy-r*Math.sin(rad))+'" fill="none" stroke="#f59e0b" stroke-width="2"/>';
    m += '<text x="'+(ox+56)+'" y="'+(oy-18)+'" fill="#fbbf24" font-size="13">θ = '+th+'°</text>';
    var slopeStr, note;
    if(Math.abs(th-90)<0.5){ slopeStr = "no finite value (vertical)"; note = "Vertical line: tan 90° has no finite value. The slope of the y-axis is not defined."; }
    else {
      var sl = Math.tan(rad);
      slopeStr = (Math.abs(sl)<1e-10 ? "0" : sl.toFixed(3));
      note = "m = tan θ. Horizontal (θ=0°) has m=0. Obtuse θ gives negative slope.";
    }
    readout(cell("θ", th+"°", "#f59e0b") + cell("m = tan θ", slopeStr, "#38bdf8"));
    verdict("<b>Definition 1:</b> "+note);
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.parperp = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>ℓ₁ slope m₁</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>ℓ₂ slope m₂</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" data-preset="pp-par" id="pp-par">Parallel m₁=m₂</button>' +
      '<button class="preset-btn active" data-preset="pp-per" id="pp-per">Perpendicular m₁m₂=−1</button>' +
      '<button class="preset-btn" data-preset="pp-ex2" id="pp-ex2">Ex 2: θ=π/4, m₁=½</button>';
    document.getElementById("pp-par").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-m1").value=1; document.getElementById("ctrl-m2").value=1; draw(0); };
    document.getElementById("pp-per").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-m1").value=0.5; document.getElementById("ctrl-m2").value=-2; draw(0); };
    document.getElementById("pp-ex2").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-m1").value=0.5; document.getElementById("ctrl-m2").value=3; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>m₁</span><span class="val" id="m1-val">0.5</span></div>' +
      '<input type="range" id="ctrl-m1" min="-4" max="4" step="0.1" value="0.5"></div>' +
      '<div class="control-item"><div class="control-label"><span>m₂</span><span class="val" id="m2-val">−2</span></div>' +
      '<input type="range" id="ctrl-m2" min="-4" max="4" step="0.1" value="-2"></div>';
    document.getElementById("ctrl-m1").oninput = function(){ draw(0); };
    document.getElementById("ctrl-m2").oninput = function(){ draw(0); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m1 = rng("ctrl-m1"), m2 = rng("ctrl-m2");
    setTxt("m1-val", m1.toFixed(2)); setTxt("m2-val", m2.toFixed(2));
    var ox=360, oy=160, sc=28;
    var m = axes(ox, oy, sc);
    function line(slope, color){
      var x1=-11, x2=11;
      return '<line x1="'+toX(ox,sc,x1)+'" y1="'+toY(oy,sc,slope*x1)+'" x2="'+toX(ox,sc,x2)+'" y2="'+toY(oy,sc,slope*x2)+'" stroke="'+color+'" stroke-width="2.5"/>';
    }
    m += line(m1,"#38bdf8");
    m += line(m2,"#f472b6");
    var prod = m1*m2;
    var den = 1+prod;
    var ang = "—";
    if(Math.abs(den)>1e-6){
      var t = Math.abs((m2-m1)/den);
      ang = (Math.atan(t)*180/Math.PI).toFixed(1)+"°";
    }
    var rel = Math.abs(m1-m2)<0.05 ? "PARALLEL (m₁=m₂)" : (Math.abs(prod+1)<0.08 ? "PERPENDICULAR (m₁m₂=−1)" : "intersecting");
    readout(cell("m₁m₂", prod.toFixed(2), "#fbbf24") + cell("acute θ", ang, "#34d399") + cell("relation", rel));
    verdict("<b>tan θ = |(m₂−m₁)/(1+m₁m₂)|</b> provided 1+m₁m₂ ≠ 0. Parallel ⇔ equal slopes; perpendicular ⇔ product −1. Example 2: m = 3 or −1/3.");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.pointslope = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Line</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fixed point (x₀,y₀)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="ps-ex5" id="ps-ex5">Ex 5: (−2,3), m=−4</button>' +
      '<button class="preset-btn" data-preset="ps-ex6" id="ps-ex6">Ex 6 two-point (1,−1),(3,5)</button>' +
      '<button class="preset-btn" data-preset="ps-axes" id="ps-axes">Ex 4: axes through (−2,3)</button>';
    document.getElementById("ps-ex5").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-x0").value=-2; document.getElementById("ctrl-y0").value=3; document.getElementById("ctrl-m").value=-4; draw(0); };
    document.getElementById("ps-ex6").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-x0").value=1; document.getElementById("ctrl-y0").value=-1; document.getElementById("ctrl-m").value=3; draw(0); };
    document.getElementById("ps-axes").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-x0").value=-2; document.getElementById("ctrl-y0").value=3; document.getElementById("ctrl-m").value=0; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>x₀</span><span class="val" id="x0-val">−2</span></div><input type="range" id="ctrl-x0" min="-6" max="6" step="0.5" value="-2"></div>' +
      '<div class="control-item"><div class="control-label"><span>y₀</span><span class="val" id="y0-val">3</span></div><input type="range" id="ctrl-y0" min="-6" max="6" step="0.5" value="3"></div>' +
      '<div class="control-item"><div class="control-label"><span>m</span><span class="val" id="m-val">−4</span></div><input type="range" id="ctrl-m" min="-6" max="6" step="0.1" value="-4"></div>';
    ["ctrl-x0","ctrl-y0","ctrl-m"].forEach(function(id){ document.getElementById(id).oninput = function(){ draw(0); }; });
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var x0=rng("ctrl-x0"), y0=rng("ctrl-y0"), mm=rng("ctrl-m");
    setTxt("x0-val", x0.toFixed(1)); setTxt("y0-val", y0.toFixed(1)); setTxt("m-val", mm.toFixed(1));
    var ox=360, oy=160, sc=24;
    var m = axes(ox, oy, sc);
    var x1=-10, x2=10;
    m += '<line x1="'+toX(ox,sc,x1)+'" y1="'+toY(oy,sc,y0+mm*(x1-x0))+'" x2="'+toX(ox,sc,x2)+'" y2="'+toY(oy,sc,y0+mm*(x2-x0))+'" stroke="#38bdf8" stroke-width="2.5"/>';
    m += '<circle cx="'+toX(ox,sc,x0)+'" cy="'+toY(oy,sc,y0)+'" r="6" fill="#f59e0b"/>';
    var A=mm, B=-1, C=y0-mm*x0;
    readout(cell("Point-slope","y − "+y0.toFixed(1)+" = "+mm.toFixed(1)+"(x − "+x0.toFixed(1)+")") +
      cell("General", A.toFixed(1)+"x + ("+B+")y + ("+C.toFixed(1)+") = 0","#34d399"));
    verdict("<b>y − y₀ = m(x − x₀).</b> Two-point form is the same with m = (y₂−y₁)/(x₂−x₁). Horizontal: y=a; vertical: x=b.");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.slopeint = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>y = mx + c</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>y-intercept c</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>x-intercept</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="si-ex7" id="si-ex7">Ex 7: m=½, c=−3/2</button>' +
      '<button class="preset-btn" data-preset="si-int" id="si-int">Intercept form a=−3, b=2</button>' +
      '<button class="preset-btn" data-preset="si-eq" id="si-eq">Equal intercepts through (2,3)</button>';
    document.getElementById("si-ex7").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-m").value=0.5; document.getElementById("ctrl-c").value=-1.5; draw(0); };
    document.getElementById("si-int").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-m").value=2/3; document.getElementById("ctrl-c").value=2; draw(0); };
    document.getElementById("si-eq").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-m").value=-1; document.getElementById("ctrl-c").value=5; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>slope m</span><span class="val" id="m-val">0.5</span></div><input type="range" id="ctrl-m" min="-3" max="3" step="0.05" value="0.5"></div>' +
      '<div class="control-item"><div class="control-label"><span>y-intercept c</span><span class="val" id="c-val">−1.5</span></div><input type="range" id="ctrl-c" min="-6" max="6" step="0.1" value="-1.5"></div>';
    document.getElementById("ctrl-m").oninput = function(){ draw(0); };
    document.getElementById("ctrl-c").oninput = function(){ draw(0); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var mm=rng("ctrl-m"), c=rng("ctrl-c");
    setTxt("m-val", mm.toFixed(2)); setTxt("c-val", c.toFixed(2));
    var ox=360, oy=160, sc=26;
    var m = axes(ox, oy, sc);
    m += '<line x1="'+toX(ox,sc,-12)+'" y1="'+toY(oy,sc,mm*(-12)+c)+'" x2="'+toX(ox,sc,12)+'" y2="'+toY(oy,sc,mm*12+c)+'" stroke="#38bdf8" stroke-width="3"/>';
    m += '<circle cx="'+ox+'" cy="'+toY(oy,sc,c)+'" r="6" fill="#34d399"/>';
    var xint = Math.abs(mm)>1e-6 ? -c/mm : null;
    if(xint!==null && isFinite(xint)){
      m += '<circle cx="'+toX(ox,sc,xint)+'" cy="'+oy+'" r="6" fill="#f59e0b"/>';
    }
    var aStr = xint===null ? "none (horizontal)" : xint.toFixed(2);
    var interceptForm = (xint && Math.abs(xint)>1e-6 && Math.abs(c)>1e-6) ? ("x/("+aStr+") + y/("+c.toFixed(2)+") = 1") : "—";
    readout(cell("y = mx + c", "y = "+mm.toFixed(2)+"x + ("+c.toFixed(2)+")","#38bdf8") +
      cell("x-intercept a", aStr, "#f59e0b") + cell("intercept form", interceptForm));
    verdict("<b>Slope-intercept:</b> y = mx + c. <b>Intercept form:</b> x/a + y/b = 1. Drag m and c — the blue line is every non-vertical straight line.");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.distptline = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Line Ax+By+C=0</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Point P</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Perpendicular d</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="d-ex9" id="d-ex9">Ex 9: (3,−5) from 3x−4y−26=0</button>' +
      '<button class="preset-btn" data-preset="d-ex3" id="d-ex3">Ex 9.3 Q3: (−1,1) from 12x−5y+82=0</button>';
    document.getElementById("d-ex9").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-A").value=3; document.getElementById("ctrl-B").value=-4; document.getElementById("ctrl-C").value=-26; document.getElementById("ctrl-px").value=3; document.getElementById("ctrl-py").value=-5; draw(0); };
    document.getElementById("d-ex3").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-A").value=12; document.getElementById("ctrl-B").value=-5; document.getElementById("ctrl-C").value=82; document.getElementById("ctrl-px").value=-1; document.getElementById("ctrl-py").value=1; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>A</span><span class="val" id="A-val">3</span></div><input type="range" id="ctrl-A" min="-8" max="8" step="1" value="3"></div>' +
      '<div class="control-item"><div class="control-label"><span>B</span><span class="val" id="B-val">−4</span></div><input type="range" id="ctrl-B" min="-8" max="8" step="1" value="-4"></div>' +
      '<div class="control-item"><div class="control-label"><span>C</span><span class="val" id="C-val">−26</span></div><input type="range" id="ctrl-C" min="-40" max="40" step="1" value="-26"></div>' +
      '<div class="control-item"><div class="control-label"><span>x₁</span><span class="val" id="px-val">3</span></div><input type="range" id="ctrl-px" min="-8" max="8" step="0.5" value="3"></div>' +
      '<div class="control-item"><div class="control-label"><span>y₁</span><span class="val" id="py-val">−5</span></div><input type="range" id="ctrl-py" min="-8" max="8" step="0.5" value="-5"></div>';
    ["ctrl-A","ctrl-B","ctrl-C","ctrl-px","ctrl-py"].forEach(function(id){ document.getElementById(id).oninput = function(){ draw(0); }; });
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var A=rng("ctrl-A"), B=rng("ctrl-B"), C=rng("ctrl-C"), px=rng("ctrl-px"), py=rng("ctrl-py");
    setTxt("A-val", A); setTxt("B-val", B); setTxt("C-val", C); setTxt("px-val", px.toFixed(1)); setTxt("py-val", py.toFixed(1));
    var ox=360, oy=150, sc=16;
    var m = axes(ox, oy, sc);
    var pts=[];
    var x, y, i;
    if(Math.abs(B)>1e-8){
      for(i=-20;i<=20;i++){ x=i; y=-(A*x+C)/B; pts.push([x,y]); }
    } else if(Math.abs(A)>1e-8){
      x=-C/A;
      pts.push([x,-12],[x,12]);
    }
    if(pts.length>=2){
      m += '<line x1="'+toX(ox,sc,pts[0][0])+'" y1="'+toY(oy,sc,pts[0][1])+'" x2="'+toX(ox,sc,pts[pts.length-1][0])+'" y2="'+toY(oy,sc,pts[pts.length-1][1])+'" stroke="#38bdf8" stroke-width="2.5"/>';
    }
    var den = Math.sqrt(A*A+B*B) || 1;
    var signed = (A*px+B*py+C)/den;
    var d = Math.abs(signed);
    var fx = px - A*signed/den;
    var fy = py - B*signed/den;
    m += '<line x1="'+toX(ox,sc,px)+'" y1="'+toY(oy,sc,py)+'" x2="'+toX(ox,sc,fx)+'" y2="'+toY(oy,sc,fy)+'" stroke="#34d399" stroke-width="2" stroke-dasharray="5 4"/>';
    m += '<circle cx="'+toX(ox,sc,px)+'" cy="'+toY(oy,sc,py)+'" r="6" fill="#f59e0b"/>';
    m += '<circle cx="'+toX(ox,sc,fx)+'" cy="'+toY(oy,sc,fy)+'" r="4" fill="#34d399"/>';
    readout(cell("d", d.toFixed(3), "#34d399") + cell("|Ax₁+By₁+C|", Math.abs(A*px+B*py+C).toFixed(1)) + cell("√(A²+B²)", den.toFixed(3)));
    verdict("<b>d = |Ax₁+By₁+C|/√(A²+B²)</b> (zoom p.16). Example 9: |9+20−26|/5 = 3/5.");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.parldist = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ax+By+C₁=0</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Ax+By+C₂=0</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="pd-ex10" id="pd-ex10">Ex 10: 3x−4y+7=0 and +5=0</button>' +
      '<button class="preset-btn" data-preset="pd-q5" id="pd-q5">Ex 9.3 Q5: 15x+8y−34, +31</button>';
    document.getElementById("pd-ex10").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-A").value=3; document.getElementById("ctrl-B").value=-4; document.getElementById("ctrl-C1").value=7; document.getElementById("ctrl-C2").value=5; draw(0); };
    document.getElementById("pd-q5").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-A").value=15; document.getElementById("ctrl-B").value=8; document.getElementById("ctrl-C1").value=-34; document.getElementById("ctrl-C2").value=31; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>A</span><span class="val" id="A-val">3</span></div><input type="range" id="ctrl-A" min="-10" max="16" step="1" value="3"></div>' +
      '<div class="control-item"><div class="control-label"><span>B</span><span class="val" id="B-val">−4</span></div><input type="range" id="ctrl-B" min="-10" max="10" step="1" value="-4"></div>' +
      '<div class="control-item"><div class="control-label"><span>C₁</span><span class="val" id="C1-val">7</span></div><input type="range" id="ctrl-C1" min="-40" max="40" step="1" value="7"></div>' +
      '<div class="control-item"><div class="control-label"><span>C₂</span><span class="val" id="C2-val">5</span></div><input type="range" id="ctrl-C2" min="-40" max="40" step="1" value="5"></div>';
    ["ctrl-A","ctrl-B","ctrl-C1","ctrl-C2"].forEach(function(id){ document.getElementById(id).oninput = function(){ draw(0); }; });
    draw(0);
  }
  function strokeLine(A,B,C,ox,oy,sc,color){
    var x1=-18, x2=18, y1, y2;
    if(Math.abs(B)>1e-8){ y1=-(A*x1+C)/B; y2=-(A*x2+C)/B; }
    else { x1=x2= Math.abs(A)>1e-8 ? -C/A : 0; y1=-12; y2=12; }
    return '<line x1="'+toX(ox,sc,x1)+'" y1="'+toY(oy,sc,y1)+'" x2="'+toX(ox,sc,x2)+'" y2="'+toY(oy,sc,y2)+'" stroke="'+color+'" stroke-width="2.5"/>';
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var A=rng("ctrl-A"), B=rng("ctrl-B"), C1=rng("ctrl-C1"), C2=rng("ctrl-C2");
    setTxt("A-val", A); setTxt("B-val", B); setTxt("C1-val", C1); setTxt("C2-val", C2);
    var ox=360, oy=150, sc=14;
    var m = axes(ox, oy, sc);
    m += strokeLine(A,B,C1,ox,oy,sc,"#38bdf8");
    m += strokeLine(A,B,C2,ox,oy,sc,"#f472b6");
    var den = Math.sqrt(A*A+B*B) || 1;
    var d = Math.abs(C1-C2)/den;
    readout(cell("|C₁−C₂|", Math.abs(C1-C2).toFixed(1)) + cell("√(A²+B²)", den.toFixed(3)) + cell("d", d.toFixed(3), "#34d399"));
    verdict("<b>Parallel-line distance:</b> d = |C₁−C₂|/√(A²+B²). Example 10: |7−5|/5 = 2/5. For y=mx+c₁ and y=mx+c₂, d = |c₁−c₂|/√(1+m²).");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
