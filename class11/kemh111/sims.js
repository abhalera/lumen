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

function iso(x, y, z){
  var ox=360, oy=200;
  var px = ox + (x - y) * 18;
  var py = oy - z * 16 + (x + y) * 8;
  return [px, py];
}
function axes3(){
  var m = '<rect width="720" height="300" fill="#09131d"/>';
  var O=iso(0,0,0), X=iso(8,0,0), Y=iso(0,8,0), Z=iso(0,0,8);
  m += '<line x1="'+O[0]+'" y1="'+O[1]+'" x2="'+X[0]+'" y2="'+X[1]+'" stroke="#f87171" stroke-width="2"/>';
  m += '<line x1="'+O[0]+'" y1="'+O[1]+'" x2="'+Y[0]+'" y2="'+Y[1]+'" stroke="#34d399" stroke-width="2"/>';
  m += '<line x1="'+O[0]+'" y1="'+O[1]+'" x2="'+Z[0]+'" y2="'+Z[1]+'" stroke="#38bdf8" stroke-width="2"/>';
  var Xm=iso(-6,0,0), Ym=iso(0,-6,0), Zm=iso(0,0,-4);
  m += '<line x1="'+O[0]+'" y1="'+O[1]+'" x2="'+Xm[0]+'" y2="'+Xm[1]+'" stroke="#f87171" stroke-width="1" stroke-dasharray="4 3" opacity="0.5"/>';
  m += '<line x1="'+O[0]+'" y1="'+O[1]+'" x2="'+Ym[0]+'" y2="'+Ym[1]+'" stroke="#34d399" stroke-width="1" stroke-dasharray="4 3" opacity="0.5"/>';
  m += '<line x1="'+O[0]+'" y1="'+O[1]+'" x2="'+Zm[0]+'" y2="'+Zm[1]+'" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 3" opacity="0.5"/>';
  m += '<text x="'+X[0]+'" y="'+(X[1]+14)+'" fill="#fca5a5" font-size="12">x</text>';
  m += '<text x="'+(Y[0]-14)+'" y="'+(Y[1]+14)+'" fill="#6ee7b7" font-size="12">y</text>';
  m += '<text x="'+(Z[0]+8)+'" y="'+Z[1]+'" fill="#7dd3fc" font-size="12">z</text>';
  m += '<text x="'+(O[0]-14)+'" y="'+(O[1]+16)+'" fill="#94a3b8" font-size="11">O</text>';
  return m;
}

window.SIMS.axes3d = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>x-axis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>y-axis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>z-axis</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-ax" id="p-ax">Coordinate axes</button>' +
      '<button class="preset-btn" data-preset="p-pl" id="p-pl">Three coordinate planes</button>';
    var mode="ax";
    document.getElementById("p-ax").onclick = function(){ setActivePreset(this); mode="ax"; draw(0); };
    document.getElementById("p-pl").onclick = function(){ setActivePreset(this); mode="pl"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    function draw(){
      var svg = svgEl(); if(!svg) return;
      var m = axes3();
      if(mode==="pl"){
        var a=iso(5,5,0), b=iso(5,0,5), c=iso(0,5,5);
        m += '<polygon points="'+iso(0,0,0).join(',')+' '+iso(5,0,0).join(',')+' '+iso(5,5,0).join(',')+' '+iso(0,5,0).join(',')+'" fill="rgba(56,189,248,0.12)" stroke="#38bdf8"/>';
        m += '<text x="420" y="240" fill="#7dd3fc" font-size="12">XY-plane</text>';
      }
      readout(cell("planes","XY, YZ, ZX") + cell("octants","8"));
      verdict("<b>§11.2:</b> Three mutually perpendicular planes through O meet along the x, y, z-axes. Distances up from XY are +z; right of ZX are +y; in front of YZ are +x.");
      svg.innerHTML = m;
    }
    window.SIMS.axes3d.draw = draw;
    draw();
  }
  return { mount: mount, draw: function(){ if(window.SIMS.axes3d.draw) window.SIMS.axes3d.draw(); } };
})();

window.SIMS.octant = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Point P(x,y,z)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="o1" id="o1">Ex 2: (−3,1,2) octant II</button>' +
      '<button class="preset-btn" data-preset="o2" id="o2">(−3,1,−2) octant VI</button>' +
      '<button class="preset-btn" data-preset="o3" id="o3">P(2,4,5) and F(2,0,5)</button>';
    document.getElementById("o1").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-x").value=-3; document.getElementById("ctrl-y").value=1; document.getElementById("ctrl-z").value=2; draw(0); };
    document.getElementById("o2").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-x").value=-3; document.getElementById("ctrl-y").value=1; document.getElementById("ctrl-z").value=-2; draw(0); };
    document.getElementById("o3").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-x").value=2; document.getElementById("ctrl-y").value=4; document.getElementById("ctrl-z").value=5; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>x</span><span class="val" id="x-val">−3</span></div><input type="range" id="ctrl-x" min="-5" max="5" step="1" value="-3"></div>' +
      '<div class="control-item"><div class="control-label"><span>y</span><span class="val" id="y-val">1</span></div><input type="range" id="ctrl-y" min="-5" max="5" step="1" value="1"></div>' +
      '<div class="control-item"><div class="control-label"><span>z</span><span class="val" id="z-val">2</span></div><input type="range" id="ctrl-z" min="-5" max="5" step="1" value="2"></div>';
    ["ctrl-x","ctrl-y","ctrl-z"].forEach(function(id){ document.getElementById(id).oninput = function(){ draw(0); }; });
    draw(0);
  }
  function octName(x,y,z){
    var names=["I XOYZ","II X′OYZ","III X′OY′Z","IV XOY′Z","V XOYZ′","VI X′OYZ′","VII X′OY′Z′","VIII XOY′Z′"];
    var i=0;
    if(x>=0 && y>=0 && z>=0) i=0;
    else if(x<0 && y>=0 && z>=0) i=1;
    else if(x<0 && y<0 && z>=0) i=2;
    else if(x>=0 && y<0 && z>=0) i=3;
    else if(x>=0 && y>=0 && z<0) i=4;
    else if(x<0 && y>=0 && z<0) i=5;
    else if(x<0 && y<0 && z<0) i=6;
    else i=7;
    return names[i];
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var x=rng("ctrl-x"), y=rng("ctrl-y"), z=rng("ctrl-z");
    setTxt("x-val", x); setTxt("y-val", y); setTxt("z-val", z);
    var m = axes3();
    var P=iso(x,y,z), M=iso(x,y,0), L=iso(x,0,0);
    m += '<line x1="'+P[0]+'" y1="'+P[1]+'" x2="'+M[0]+'" y2="'+M[1]+'" stroke="#f59e0b" stroke-dasharray="4 3"/>';
    m += '<line x1="'+M[0]+'" y1="'+M[1]+'" x2="'+L[0]+'" y2="'+L[1]+'" stroke="#94a3b8" stroke-dasharray="4 3"/>';
    m += '<circle cx="'+P[0]+'" cy="'+P[1]+'" r="6" fill="#f59e0b"/>';
    m += '<text x="'+(P[0]+8)+'" y="'+P[1]+'" fill="#fde68a" font-size="12">P('+x+','+y+','+z+')</text>';
    readout(cell("P","("+x+", "+y+", "+z+")","#f59e0b") + cell("octant", octName(x,y,z), "#34d399"));
    verdict("<b>Table 11.1:</b> signs of (x,y,z) name the octant. Example 1: F in Fig 11.3 with P(2,4,5) is (2,0,5) — zero y-coordinate, in the ZX-plane.");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.dist3d = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>P</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Q</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>PQ</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="d-ex3" id="d-ex3">Ex 3: P(1,−3,4) Q(−4,1,2)</button>' +
      '<button class="preset-btn" data-preset="d-o" id="d-o">Distance from origin</button>';
    document.getElementById("d-ex3").onclick = function(){ setActivePreset(this); document.getElementById("qx").value=-4; document.getElementById("qy").value=1; document.getElementById("qz").value=2; draw(0); };
    document.getElementById("d-o").onclick = function(){ setActivePreset(this); document.getElementById("qx").value=0; document.getElementById("qy").value=0; document.getElementById("qz").value=0; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Qₓ</span><span class="val" id="qx-val">−4</span></div><input type="range" id="qx" min="-6" max="6" step="1" value="-4"></div>' +
      '<div class="control-item"><div class="control-label"><span>Qᵧ</span><span class="val" id="qy-val">1</span></div><input type="range" id="qy" min="-6" max="6" step="1" value="1"></div>' +
      '<div class="control-item"><div class="control-label"><span>Q_z</span><span class="val" id="qz-val">2</span></div><input type="range" id="qz" min="-6" max="6" step="1" value="2"></div>';
    ["qx","qy","qz"].forEach(function(id){ document.getElementById(id).oninput = function(){ draw(0); }; });
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var P=[1,-3,4], Q=[rng("qx"), rng("qy"), rng("qz")];
    setTxt("qx-val", Q[0]); setTxt("qy-val", Q[1]); setTxt("qz-val", Q[2]);
    var m = axes3();
    var p=iso(P[0],P[1],P[2]), q=iso(Q[0],Q[1],Q[2]);
    m += '<line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+q[0]+'" y2="'+q[1]+'" stroke="#f59e0b" stroke-width="2.5"/>';
    m += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="#38bdf8"/>';
    m += '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="5" fill="#f472b6"/>';
    var d = Math.hypot(Q[0]-P[0], Q[1]-P[1], Q[2]-P[2]);
    readout(cell("PQ", "√[(Δx)²+(Δy)²+(Δz)²]") + cell("value", d.toFixed(3), "#f59e0b"));
    verdict("<b>Zoom p.5:</b> PQ=√[(x₂−x₁)²+(y₂−y₁)²+(z₂−z₁)²]. Example 3: √(25+16+4)=√45=3√5. From the origin, OQ=√(x²+y²+z²).");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.collinear3d = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>P, Q, R</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="c-yes" id="c-yes">Ex 4: collinear √14 + 2√14 = 3√14</button>' +
      '<button class="preset-btn" data-preset="c-no" id="c-no">Ex 5: not right-angled</button>';
    var mode="yes";
    document.getElementById("c-yes").onclick = function(){ setActivePreset(this); mode="yes"; draw(0); };
    document.getElementById("c-no").onclick = function(){ setActivePreset(this); mode="no"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    function draw(){
      var svg = svgEl(); if(!svg) return;
      var m = axes3();
      var A,B,C, note;
      if(mode==="yes"){
        A=[-2,3,5]; B=[1,2,3]; C=[7,0,-1];
        note = "PQ=√14, QR=2√14, PR=3√14. PQ+QR=PR ⇒ collinear (Example 4).";
      } else {
        A=[3,6,9]; B=[10,20,30]; C=[25,-41,5];
        note = "AB²=686, BC²=4571, CA²=2709. CA²+AB² ≠ BC² ⇒ not right-angled (Example 5).";
      }
      function pt(P, col, lab){
        var s=iso(P[0]/4, P[1]/4, P[2]/4);
        m += '<circle cx="'+s[0]+'" cy="'+s[1]+'" r="5" fill="'+col+'"/>';
        m += '<text x="'+(s[0]+6)+'" y="'+s[1]+'" fill="#e2e8f0" font-size="11">'+lab+'</text>';
        return s;
      }
      var a=pt(A,"#38bdf8","A"), b=pt(B,"#f59e0b","B"), c=pt(C,"#f472b6","C");
      m += '<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="#94a3b8"/>';
      m += '<line x1="'+b[0]+'" y1="'+b[1]+'" x2="'+c[0]+'" y2="'+c[1]+'" stroke="#94a3b8"/>';
      readout(cell("test", mode==="yes"?"PQ+QR=PR":"Pythagoras fails"));
      verdict("<b>"+note+"</b>");
      svg.innerHTML = m;
    }
    window.SIMS.collinear3d.draw = draw;
    draw();
  }
  return { mount: mount, draw: function(){ if(window.SIMS.collinear3d.draw) window.SIMS.collinear3d.draw(); } };
})();

window.SIMS.locus3d = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A, B</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Perpendicular-bisector plane</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="l-eq" id="l-eq">Ex 8: PA=PB ⇒ 10x+6y−18z−29=0</button>' +
      '<button class="preset-btn" data-preset="l-sum" id="l-sum">Ex 11.2 Q5: PA+PB=10 (ellipsoid)</button>';
    var mode="eq";
    document.getElementById("l-eq").onclick = function(){ setActivePreset(this); mode="eq"; draw(0); };
    document.getElementById("l-sum").onclick = function(){ setActivePreset(this); mode="sum"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    function draw(){
      var svg = svgEl(); if(!svg) return;
      var m = axes3();
      if(mode==="eq"){
        var A=iso(3,2,-2), B=iso(-2,0.5,2);
        m += '<circle cx="'+A[0]+'" cy="'+A[1]+'" r="5" fill="#38bdf8"/>';
        m += '<circle cx="'+B[0]+'" cy="'+B[1]+'" r="5" fill="#f472b6"/>';
        m += '<line x1="320" y1="80" x2="500" y2="240" stroke="#f59e0b" stroke-width="2"/>';
        readout(cell("PA=PB","perpendicular-bisector plane") + cell("equation","10x+6y−18z=29"));
        verdict("<b>Example 8:</b> A(3,4,−5), B(−2,1,4). Squaring PA=PB cancels quadratics and leaves the plane 10x+6y−18z−29=0.");
      } else {
        m += '<ellipse cx="360" cy="160" rx="90" ry="40" fill="none" stroke="#38bdf8" stroke-width="2"/>';
        m += '<ellipse cx="360" cy="160" rx="50" ry="40" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.5"/>';
        readout(cell("PA+PB","10") + cell("2c","8") + cell("ellipsoid","x²/25 + (y²+z²)/9 = 1"));
        verdict("<b>Ex 11.2 Q5:</b> sum of distances to (±4,0,0) is 10. In a plane that is an ellipse; in space it is a prolate spheroid — NCERT writes the Cartesian equation of that set.");
      }
      svg.innerHTML = m;
    }
    window.SIMS.locus3d.draw = draw;
    draw();
  }
  return { mount: mount, draw: function(){ if(window.SIMS.locus3d.draw) window.SIMS.locus3d.draw(); } };
})();

window.SIMS.centroid3d = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A, B, C</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Centroid G</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="g-ex9" id="g-ex9">Ex 9: G(1,1,1), C=(1,1,2)</button>' +
      '<button class="preset-btn" data-preset="g-par" id="g-par">Ex 7: parallelogram, not a rectangle</button>';
    var mode="g";
    document.getElementById("g-ex9").onclick = function(){ setActivePreset(this); mode="g"; draw(0); };
    document.getElementById("g-par").onclick = function(){ setActivePreset(this); mode="p"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    function draw(){
      var svg = svgEl(); if(!svg) return;
      var m = axes3();
      if(mode==="g"){
        var A=iso(3,-2,3), B=iso(-1,3,-2), C=iso(1,1,2), G=iso(1,1,1);
        m += '<polygon points="'+A.join(',')+' '+B.join(',')+' '+C.join(',')+'" fill="rgba(56,189,248,0.15)" stroke="#38bdf8"/>';
        m += '<circle cx="'+G[0]+'" cy="'+G[1]+'" r="6" fill="#f59e0b"/>';
        readout(cell("G","((x₁+x₂+x₃)/3, …)") + cell("C","(1, 1, 2)","#34d399"));
        verdict("<b>Example 9:</b> G(1,1,1), A(3,−5,7), B(−1,7,−6). Then (3−1+x)/3=1 ⇒ x=1; y=1; (7−6+z)/3=1 ⇒ z=2. C(1,1,2).");
      } else {
        readout(cell("AB=CD","6") + cell("BC=DA","√43") + cell("AC≠BD","not a rectangle"));
        verdict("<b>Example 7:</b> Opposite sides equal ⇒ parallelogram. Diagonals AC=√3, BD=√155 unequal ⇒ not a rectangle. Mid-point of both diagonals is an equivalent test.");
      }
      svg.innerHTML = m;
    }
    window.SIMS.centroid3d.draw = draw;
    draw();
  }
  return { mount: mount, draw: function(){ if(window.SIMS.centroid3d.draw) window.SIMS.centroid3d.draw(); } };
})();
