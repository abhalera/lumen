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

window.SIMS.coupled = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Oscillator</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Disturbance</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="c1" id="c1">Fig 14.1 coupled springs / buffers</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var n=8;
    for(var i=0;i<n;i++){
      var delay=i*0.35, u=Math.max(0,t-delay);
      var y=150-40*Math.exp(-0.5*u)*Math.sin(3*u);
      var x=70+i*80;
      if(i<n-1) m += '<line x1="'+x+'" y1="'+y+'" x2="'+(x+80)+'" y2="150" stroke="#f59e0b" stroke-width="2"/>';
      m += '<circle cx="'+x+'" cy="'+y+'" r="12" fill="#38bdf8"/>';
    }
    svg.innerHTML = m;
    readout(cell("medium","chain of oscillators") + cell("net transport of matter","none"));
    verdict("<b>Fig. 14.1:</b> each bogie / spring barely leaves home. The pattern walks down the rake. That is a mechanical wave.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.wavepulse = (function(){
  var kind = "trans";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pulse</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>A tagged element</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="w-t" id="w-t">Fig 14.2 transverse pulse</button>' +
      '<button class="preset-btn" data-preset="w-l" id="w-l">Fig 14.4 longitudinal pulse</button>';
    document.getElementById("w-t").onclick = function(){ setActivePreset(this); kind="trans"; App.resetTimeline(); App.play(); };
    document.getElementById("w-l").onclick = function(){ setActivePreset(this); kind="long"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function pulse(s){ return 70*Math.exp(-s*s/0.12); }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var v=1.0, xc=0.4+t*0.35;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(kind==="trans"){
      var d="";
      for(var i=0;i<=80;i++){
        var x=i/80, X=40+x*640, Y=160-pulse(x-xc);
        d += (i?"L":"M")+" "+X+" "+Y;
      }
      m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      var tag=0.55, Yt=160-pulse(tag-xc);
      m += '<circle cx="'+(40+tag*640)+'" cy="'+Yt+'" r="6" fill="#f59e0b"/>';
      readout(cell("type","transverse") + cell("element","moves ⊥ to v") + cell("net drift","none"));
      verdict("<b>Fig. 14.2:</b> a single up-down jerk. The orange bead only bobs; the pulse travels.");
    } else {
      for(var i=0;i<24;i++){
        var x=i/23, dx=0.04*pulse(x-xc)*(x-xc>0?-1:1);
        var X=50+(x+dx)*640;
        m += '<rect x="'+X+'" y="110" width="10" height="80" fill="#38bdf8" opacity="0.85"/>';
      }
      readout(cell("type","longitudinal") + cell("element","moves ∥ to v") + cell("pattern","compression / rarefaction"));
      verdict("<b>Fig. 14.4:</b> a piston shove. Spacing of the slabs is the wave; the slabs go home.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.progressive = (function(){
  var dir = 1;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>y = a sin(kx − ωt)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="pr" id="pr">+x  (kx − ωt)  Example 14.2</button>' +
      '<button class="preset-btn" data-preset="pl" id="pl">−x  (kx + ωt)  Ex 14.8</button>';
    document.getElementById("pr").onclick = function(){ setActivePreset(this); dir=1; App.resetTimeline(); App.play(); };
    document.getElementById("pl").onclick = function(){ setActivePreset(this); dir=-1; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var k=0.04, w=3, a=70;
    var d="";
    for(var i=0;i<=90;i++){
      var x=i*8;
      var y=150 - a*Math.sin(k*x - dir*w*t);
      d += (i?"L":"M")+" "+x+" "+y;
    }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="200" cy="'+(150-a*Math.sin(k*200-dir*w*t))+'" r="6" fill="#f59e0b"/>';
    svg.innerHTML = m;
    var v = w/k;
    readout(cell("direction", dir>0?"+x":"−x") + cell("v = ω/k", v.toFixed(1)+" px/s") + cell("a, T same","all x"));
    verdict(dir>0
      ? "<b>Eq. 14.2 / Example 14.2:</b> a crest of constant phase slides at v = ω/k. Every element has the same a and T; phase is kx."
      : "<b>Ex 14.8:</b> the form sin(ωt + kx) travels to the left at 20 m s⁻¹.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.wavespeed = (function(){
  var mode = "string";
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Wavefront</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="vs" id="vs">Example 14.3 string 93 m/s</button>' +
      '<button class="preset-btn" data-preset="vn" id="vn">Newton 280 vs Laplace 331</button>';
    document.getElementById("vs").onclick = function(){ setActivePreset(this); mode="string"; App.resetTimeline(); App.play(); };
    document.getElementById("vn").onclick = function(){ setActivePreset(this); mode="sound"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="string"){
      var v=93, x=40+Math.min(t*v*1.2, 640);
      m += '<line x1="40" y1="160" x2="680" y2="160" stroke="#334155" stroke-width="4"/>';
      m += '<path d="M '+(x-40)+' 160 Q '+x+' 90 '+(x+40)+' 160" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      readout(cell("μ","6.9×10⁻³ kg/m") + cell("T","60 N") + cell("v","93 m/s","#34d399"));
      verdict("<b>Example 14.3 / Eq. 14.14:</b> v = √(T/μ) = √(60 / 6.9×10⁻³) ≈ <b>93 m s⁻¹</b>.");
    } else {
      var xn=40+t*280*0.4, xl=40+t*331*0.4;
      m += '<circle cx="'+Math.min(xn,680)+'" cy="120" r="18" fill="none" stroke="#f59e0b" stroke-width="3"/>';
      m += '<circle cx="'+Math.min(xl,680)+'" cy="200" r="18" fill="none" stroke="#34d399" stroke-width="3"/>';
      m += '<text x="500" y="124" fill="#f59e0b">Newton 280</text>';
      m += '<text x="500" y="204" fill="#34d399">Laplace 331</text>';
      readout(cell("Newton √(P/ρ)","280 m/s") + cell("Laplace √(γP/ρ)","331 m/s","#34d399") + cell("γ","7/5"));
      verdict("<b>Example 14.4:</b> sound is too fast to be isothermal. B = γP restores the 15 % that Newton missed.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.superposition = (function(){
  var mode = "pulses";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Wave 1</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Wave 2</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Sum</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="su1" id="su1">Fig 14.9 opposite pulses</button>' +
      '<button class="preset-btn" data-preset="su2" id="su2">Fig 14.10 φ = 0 constructive</button>' +
      '<button class="preset-btn" data-preset="su3" id="su3">φ = π destructive</button>';
    document.getElementById("su1").onclick = function(){ setActivePreset(this); mode="pulses"; App.resetTimeline(); App.play(); };
    document.getElementById("su2").onclick = function(){ setActivePreset(this); mode="con"; App.resetTimeline(); App.play(); };
    document.getElementById("su3").onclick = function(){ setActivePreset(this); mode="des"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function gpulse(s){ return Math.exp(-s*s/0.02); }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    function path(fn, color, width){
      var d="";
      for(var i=0;i<=90;i++){
        var x=i/90, X=40+x*640, Y=150-70*fn(x);
        d += (i?"L":"M")+" "+X+" "+Y;
      }
      return '<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="'+(width||2)+'"/>';
    }
    if(mode==="pulses"){
      var c1=0.15+t*0.12, c2=0.85-t*0.12;
      m += path(function(x){ return gpulse(x-c1); }, "#38bdf8");
      m += path(function(x){ return -gpulse(x-c2); }, "#f59e0b");
      m += path(function(x){ return gpulse(x-c1)-gpulse(x-c2); }, "#34d399", 3);
      readout(cell("rule","y = y₁ + y₂") + cell("overlap", Math.abs(c1-c2)<0.08?"flat instant":"apart"));
      verdict("<b>Fig. 14.9:</b> opposite pulses pass through. The flat moment is superposition, not annihilation.");
    } else {
      var phi = mode==="con"?0:Math.PI;
      m += path(function(x){ return Math.sin(12*x - 3*t); }, "#38bdf8");
      m += path(function(x){ return Math.sin(12*x - 3*t + phi); }, "#f59e0b");
      m += path(function(x){ return Math.sin(12*x - 3*t)+Math.sin(12*x - 3*t + phi); }, "#34d399", 3);
      var A = 2*Math.abs(Math.cos(phi/2));
      readout(cell("φ", mode==="con"?"0":"π") + cell("amplitude", A.toFixed(2)+" a","#34d399"));
      verdict(mode==="con"
        ? "<b>Fig. 14.10 constructive:</b> A = 2a."
        : "<b>Destructive:</b> A = 0. Energy is not gone — it is elsewhere in a real 3-D pattern, or in KE at the flat instant.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.standing = (function(){
  var n = 1, pipe = "string";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Standing wave</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Node</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="st1" id="st1">String n = 1</button>' +
      '<button class="preset-btn" data-preset="st2" id="st2">String n = 2</button>' +
      '<button class="preset-btn" data-preset="st3" id="st3">Closed pipe (odd only)</button>' +
      '<button class="preset-btn" data-preset="st4" id="st4">Open pipe n = 2 (Ex 14.5)</button>';
    document.getElementById("st1").onclick = function(){ setActivePreset(this); pipe="string"; n=1; App.resetTimeline(); App.play(); };
    document.getElementById("st2").onclick = function(){ setActivePreset(this); pipe="string"; n=2; App.resetTimeline(); App.play(); };
    document.getElementById("st3").onclick = function(){ setActivePreset(this); pipe="closed"; n=1; App.resetTimeline(); App.play(); };
    document.getElementById("st4").onclick = function(){ setActivePreset(this); pipe="open"; n=2; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var Lpx=640, x0=40;
    var d="", env="";
    for(var i=0;i<=80;i++){
      var z=i/80;
      var shape, amp;
      if(pipe==="string"){ shape=Math.sin(n*Math.PI*z); amp=shape*Math.cos(2*Math.PI*t); }
      else if(pipe==="closed"){ shape=Math.cos((n-0.5)*Math.PI*z); amp=shape*Math.cos(2*Math.PI*t); }
      else { shape=Math.sin(n*Math.PI*z); amp=shape*Math.cos(2*Math.PI*t); }
      var X=x0+z*Lpx, Y=150-80*amp, Ye=150-80*shape;
      d += (i?"L":"M")+" "+X+" "+Y;
      env += (i?"L":"M")+" "+X+" "+Ye;
    }
    m += '<path d="'+env+'" fill="none" stroke="#334155" stroke-dasharray="4 3"/>';
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="3"/>';
    if(pipe==="string"){
      for(var k=0;k<=n;k++) m += '<circle cx="'+(x0+k*Lpx/n)+'" cy="150" r="5" fill="#f87171"/>';
    }
    svg.innerHTML = m;
    var msg = pipe==="string"
      ? "<b>Eq. 14.42:</b> ν_n = n v/(2L). Nodes at the walls and every λ/2."
      : pipe==="closed"
      ? "<b>Closed pipe:</b> node at the closed end, antinode at the open. Only odd harmonics. Example 14.5: 275 Hz fundamental."
      : "<b>Example 14.5 open:</b> ν₂ = 2×550 = 1100 Hz matches the 1.1 kHz source. Closing the end kills that even harmonic.";
    readout(cell("mode", pipe+" n="+n) + cell("nodes", pipe==="string"? String(n+1): "see ends"));
    verdict(msg);
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.beats = (function(){
  var f1=11, f2=9;
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>ν₁</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>ν₂</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>sum / envelope</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="b1" id="b1">Fig 14.16 · 11 Hz + 9 Hz</button>' +
      '<button class="preset-btn" data-preset="b2" id="b2">Example 14.6 · 427 and 422</button>';
    document.getElementById("b1").onclick = function(){ setActivePreset(this); f1=11; f2=9; App.resetTimeline(); App.play(); };
    document.getElementById("b2").onclick = function(){ setActivePreset(this); f1=12; f2=10; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var beat=Math.abs(f1-f2);
    var d="", e1="", e2="";
    for(var i=0;i<=160;i++){
      var tt=i*4/160, X=40+tt*160;
      var y1=Math.sin(2*Math.PI*f1*tt), y2=Math.sin(2*Math.PI*f2*tt), s=y1+y2;
      var env=2*Math.cos(2*Math.PI*(beat/2)*tt);
      d += (i?"L":"M")+" "+X+" "+(150-30*s);
      e1 += (i?"L":"M")+" "+X+" "+(150-30*env);
      e2 += (i?"L":"M")+" "+X+" "+(150+30*env);
    }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<path d="'+e1+'" fill="none" stroke="#f87171" stroke-dasharray="5 4"/>';
    m += '<path d="'+e2+'" fill="none" stroke="#f87171" stroke-dasharray="5 4"/>';
    m += '<path d="'+d+'" fill="none" stroke="#34d399" stroke-width="2"/>';
    svg.innerHTML = m;
    readout(cell("ν₁", f1+" Hz") + cell("ν₂", f2+" Hz") + cell("ν_beat", beat+" Hz","#f87171"));
    verdict("<b>Eq. 14.48 / Fig. 14.16:</b> you hear the average pitch, and the loudness wows at |ν₁−ν₂|. Example 14.6: 5 Hz beats, B flat at 422 Hz.");
  }
  return { mount: mount, draw: draw };
})();
