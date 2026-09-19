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

window.SIMS.periodic = (function(){
  var mode = "heart";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Repeating trace</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-h" id="p-h">Ex 13.1 heart 1.25 Hz</button>' +
      '<button class="preset-btn" data-preset="p-c" id="p-c">Earth spin: periodic, not oscillatory</button>' +
      '<button class="preset-btn" data-preset="p-s" id="p-s">Park swing: oscillatory</button>';
    document.getElementById("p-h").onclick = function(){ setActivePreset(this); mode="heart"; App.resetTimeline(); App.play(); };
    document.getElementById("p-c").onclick = function(){ setActivePreset(this); mode="circ"; App.resetTimeline(); App.play(); };
    document.getElementById("p-s").onclick = function(){ setActivePreset(this); mode="swing"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="160" x2="700" y2="160" stroke="#475569"/>';
    if(mode==="heart"){
      var d="";
      for(var i=0;i<=200;i++){
        var tt=i*4/200, x=40+tt*165;
        var y=160-40*Math.exp(-8*((tt%0.8)-0.15)*((tt%0.8)-0.15))*Math.sin((tt%0.8)*20);
        d += (i?"L":"M")+" "+x+" "+y;
      }
      m += '<path d="'+d+'" fill="none" stroke="#f87171" stroke-width="2"/>';
      var px=40+t*165;
      m += '<circle cx="'+px+'" cy="160" r="4" fill="#f8fafc"/>';
      readout(cell("ν","1.25 Hz") + cell("T","0.80 s") + cell("beats/min","75"));
      verdict("<b>Example 13.1:</b> 75 min⁻¹ → 1.25 Hz, T = 0.80 s. Periodic, not SHM.");
    } else if(mode==="circ"){
      var ang=t*1.2;
      m += '<circle cx="360" cy="150" r="70" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="'+(360+70*Math.cos(ang))+'" cy="'+(150+70*Math.sin(ang))+'" r="8" fill="#f59e0b"/>';
      readout(cell("motion","UCM") + cell("periodic","YES") + cell("oscillatory","NO","#f87171"));
      verdict("<b>§13.2:</b> Earth’s spin (and UCM) repeats, but it is not to-and-fro about a mean on the path.");
    } else {
      var th=0.5*Math.cos(2*Math.PI*t/2);
      var x=360+120*Math.sin(th), y=60+120*Math.cos(th);
      m += '<line x1="360" y1="40" x2="'+x+'" y2="'+y+'" stroke="#94a3b8" stroke-width="2"/>';
      m += '<circle cx="'+x+'" cy="'+y+'" r="12" fill="#38bdf8"/>';
      readout(cell("motion","oscillatory") + cell("T","~2 s") + cell("about mean","YES","#34d399"));
      verdict("<b>§13.2:</b> a swing is oscillatory and therefore periodic. Every oscillation is periodic; the converse is false.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.shmcos = (function(){
  var A=80, w=2, phi=0;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>x = A cos(ωt + φ)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="s0" id="s0">φ = 0, ω = 2</button>' +
      '<button class="preset-btn" data-preset="s1" id="s1">φ = π/2 (starts at 0)</button>' +
      '<button class="preset-btn" data-preset="s2" id="s2">faster ω = 4 (T halves)</button>';
    document.getElementById("s0").onclick = function(){ setActivePreset(this); w=2; phi=0; App.resetTimeline(); App.play(); };
    document.getElementById("s1").onclick = function(){ setActivePreset(this); w=2; phi=Math.PI/2; App.resetTimeline(); App.play(); };
    document.getElementById("s2").onclick = function(){ setActivePreset(this); w=4; phi=0; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var d="", n=80;
    for(var i=0;i<=n;i++){
      var tt=i*6/n, x=60+tt*100, y=150 - A*Math.cos(w*tt+phi);
      d += (i?"L":"M")+" "+x+" "+y;
    }
    var xNow=60+t*100, yNow=150 - A*Math.cos(w*t+phi);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="60" y1="150" x2="700" y2="150" stroke="#475569"/>';
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="'+xNow+'" cy="'+yNow+'" r="6" fill="#f8fafc"/>';
    svg.innerHTML = m;
    var T=2*Math.PI/w;
    readout(cell("A","80 px") + cell("ω", w.toFixed(1)+" rad/s") + cell("T", T.toFixed(2)+" s") + cell("φ", phi.toFixed(2)+" rad"));
    verdict("<b>Eq. 13.4:</b> changing φ slides the cosine; changing ω changes T. Amplitude does not enter T.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.ucmproj = (function(){
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Reference particle P</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Projection P′ (SHM)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="u1" id="u1">Fig 13.10 anticlockwise</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var A=90, w=Math.PI, phi=Math.PI/4;
    var ang=w*t+phi;
    var cx=220, cy=150;
    var px=cx+A*Math.cos(ang), py=cy-A*Math.sin(ang);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<circle cx="'+cx+'" cy="'+cy+'" r="'+A+'" fill="none" stroke="#475569"/>';
    m += '<line x1="'+(cx-A-20)+'" y1="'+cy+'" x2="'+(cx+A+20)+'" y2="'+cy+'" stroke="#334155"/>';
    m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+px+'" y2="'+py+'" stroke="#94a3b8"/>';
    m += '<circle cx="'+px+'" cy="'+py+'" r="8" fill="#f59e0b"/>';
    m += '<circle cx="'+px+'" cy="'+cy+'" r="8" fill="#38bdf8"/>';
    m += '<line x1="'+px+'" y1="'+py+'" x2="'+px+'" y2="'+cy+'" stroke="#38bdf8" stroke-dasharray="4 3"/>';
    var d="";
    for(var i=0;i<=80;i++){
      var tt=i*4/80, X=430+tt*60, Y=cy - A*Math.cos(w*tt+phi);
      d += (i?"L":"M")+" "+X+" "+Y;
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="'+(430+t*60)+'" cy="'+(cy-A*Math.cos(ang))+'" r="5" fill="#f8fafc"/>';
    svg.innerHTML = m;
    readout(cell("x","A cos(ωt+φ)") + cell("A","radius") + cell("ω","2π/T"));
    verdict("<b>Fig. 13.10:</b> P on the reference circle; P′ on a diameter executes SHM. The centripetal force on P is not the restoring force on P′.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.shmva = (function(){
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>x</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>v</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>a</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="v1" id="v1">Fig 13.13 φ = 0</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var w=Math.PI, A=1;
    function X(tt){ return 50+tt*160; }
    function Yx(val){ return 150 - val*50; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="50" y1="150" x2="700" y2="150" stroke="#475569"/>';
    function path(fn, color){
      var d="";
      for(var i=0;i<=80;i++){ var tt=i*4/80; d += (i?"L":"M")+" "+X(tt)+" "+Yx(fn(tt)); }
      return '<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="2"/>';
    }
    m += path(function(tt){ return Math.cos(w*tt); }, "#38bdf8");
    m += path(function(tt){ return -Math.sin(w*tt); }, "#f59e0b");
    m += path(function(tt){ return -Math.cos(w*tt); }, "#f87171");
    m += '<circle cx="'+X(t)+'" cy="'+Yx(Math.cos(w*t))+'" r="5" fill="#38bdf8"/>';
    svg.innerHTML = m;
    var x=Math.cos(w*t), v=-w*Math.sin(w*t), a=-w*w*x;
    readout(cell("x", x.toFixed(2)+" A") + cell("v", v.toFixed(2)) + cell("a", a.toFixed(2)) + cell("a vs −ω²x", a.toFixed(2)+" vs "+(-w*w*x).toFixed(2)));
    verdict("<b>Fig. 13.13 / Eq. 13.11:</b> v leads x by π/2; a is π out of phase with x. a = −ω²x at every instant.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.massspring = (function(){
  var k=1200, m=3, A=0.02, two=false;
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Mass</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Spring</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="ms1" id="ms1">Ex 13.9 k=1200, m=3, A=2 cm</button>' +
      '<button class="preset-btn" data-preset="ms2" id="ms2">Example 13.6 two springs keff=2k</button>';
    document.getElementById("ms1").onclick = function(){ setActivePreset(this); two=false; k=1200; m=3; A=0.02; App.resetTimeline(); App.play(); };
    document.getElementById("ms2").onclick = function(){ setActivePreset(this); two=true; k=1200; m=3; A=0.02; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var keff = two ? 2*k : k;
    var w = Math.sqrt(keff/m);
    var x = A*Math.cos(w*t); // released from rest at +A
    var xpx = 360 + x*4000;
    var msvg = '<rect width="720" height="300" fill="#09131d"/>';
    msvg += '<rect x="40" y="80" width="24" height="140" fill="#64748b"/>';
    var coils="", n=10;
    for(var i=0;i<=n;i++){
      var sx=64+(xpx-40-24)*i/n, sy=150+((i%2)?18:-18);
      coils += (i?"L":"M")+" "+sx+" "+sy;
    }
    msvg += '<path d="'+coils+'" fill="none" stroke="#f59e0b" stroke-width="3"/>';
    if(two){
      msvg += '<rect x="656" y="80" width="24" height="140" fill="#64748b"/>';
      var coils2="", x2=xpx+50;
      for(var i=0;i<=n;i++){
        var sx=x2+(680-x2)*i/n, sy=150+((i%2)?18:-18);
        coils2 += (i?"L":"M")+" "+sx+" "+sy;
      }
      msvg += '<path d="'+coils2+'" fill="none" stroke="#f59e0b" stroke-width="3"/>';
    }
    msvg += '<rect x="'+(xpx-25)+'" y="125" width="50" height="50" fill="#38bdf8"/>';
    svg.innerHTML = msvg;
    var T=2*Math.PI/w, vmax=w*A, amax=w*w*A;
    readout(cell("T", T.toFixed(2)+" s") + cell("ν", (1/T).toFixed(2)+" Hz") + cell("v_max", vmax.toFixed(2)+" m/s") + cell("a_max", amax.toFixed(2)+" m/s²"));
    verdict(two
      ? "<b>Example 13.6:</b> F = −2kx so T = 2π√(m/2k). Same mass, stiffer effective spring."
      : "<b>Ex 13.9:</b> ν = 3.18 Hz, a_max = 8.0 m s⁻², v_max = 0.40 m s⁻¹. T = 2π√(m/k).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.shmenergy = (function(){
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>K</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>U</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>E</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="e1" id="e1">Example 13.7 · E = 0.25 J</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var k=50, A=0.1, w=Math.sqrt(50);
    var x=A*Math.cos(w*t);
    var U=0.5*k*x*x, E=0.5*k*A*A, K=E-U;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="80" y="'+(230-K/E*160)+'" width="70" height="'+(K/E*160)+'" fill="#38bdf8"/>';
    m += '<rect x="180" y="'+(230-U/E*160)+'" width="70" height="'+(U/E*160)+'" fill="#f59e0b"/>';
    m += '<rect x="280" y="'+(230-160)+'" width="70" height="160" fill="#34d39955" stroke="#34d399"/>';
    m += '<text x="115" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">K</text>';
    m += '<text x="215" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">U</text>';
    m += '<text x="315" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">E</text>';
    var xpx=500+x*1800;
    m += '<line x1="420" y1="150" x2="680" y2="150" stroke="#334155"/>';
    m += '<rect x="'+(xpx-18)+'" y="132" width="36" height="36" fill="#38bdf8"/>';
    svg.innerHTML = m;
    readout(cell("x", (x*100).toFixed(1)+" cm") + cell("K", K.toFixed(3)+" J") + cell("U", U.toFixed(3)+" J") + cell("E", E.toFixed(3)+" J","#34d399"));
    verdict("<b>Example 13.7 / Eq. 13.18:</b> E = ½kA² = 0.25 J always. At 5 cm, U = 0.0625 J and K ≈ 0.19 J.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.pendulum = (function(){
  var g=9.8, L=1.0, small=true;
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Bob</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="pe1" id="pe1">Seconds pendulum Earth, small θ</button>' +
      '<button class="preset-btn" data-preset="pe2" id="pe2">Same L on Moon g=1.7</button>' +
      '<button class="preset-btn" data-preset="pe3" id="pe3">Large angle (not SHM)</button>';
    document.getElementById("pe1").onclick = function(){ setActivePreset(this); g=9.8; L=1; small=true; App.resetTimeline(); App.play(); };
    document.getElementById("pe2").onclick = function(){ setActivePreset(this); g=1.7; L=1; small=true; App.resetTimeline(); App.play(); };
    document.getElementById("pe3").onclick = function(){ setActivePreset(this); g=9.8; L=1; small=false; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var w=Math.sqrt(g/L);
    var th0 = small ? 0.12 : 0.9;
    var th = th0*Math.cos(w*t); // SHM approximation even for large, labelled as such
    var x=360+180*Math.sin(th), y=40+180*Math.cos(th);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="360" y1="40" x2="'+x+'" y2="'+y+'" stroke="#94a3b8" stroke-width="3"/>';
    m += '<circle cx="'+x+'" cy="'+y+'" r="14" fill="#38bdf8"/>';
    m += '<line x1="360" y1="40" x2="360" y2="230" stroke="#334155" stroke-dasharray="4 3"/>';
    svg.innerHTML = m;
    var T=2*Math.PI*Math.sqrt(L/g);
    readout(cell("L", L.toFixed(2)+" m") + cell("g", g.toFixed(1)+" m/s²") + cell("T SHM", T.toFixed(2)+" s") + cell("θ_max", (th0*180/Math.PI).toFixed(0)+"°"));
    verdict(small
      ? "<b>Eq. 13.26:</b> T = 2π√(L/g) = <b>"+T.toFixed(2)+" s</b>. Example 13.8: seconds pendulum L ≈ 1 m on Earth. Moon: T grows as 1/√g."
      : "<b>Table 13.1:</b> sinθ ≈ θ fails at large amplitude. The true equation is θ̈ + (g/L) sinθ = 0 — periodic, not SHM. This lab still plots the SHM cosine to show the approximation’s breakdown.");
  }
  return { mount: mount, draw: draw };
})();
