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

window.SIMS.inertia = (function(){
  var mode = "ship";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ship a=100 m s⁻²</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Astronaut</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="i-ship">Example 4.1: leaves the ship</button>' +
      '<button class="preset-btn" id="i-gal">Galileo double incline</button>';
    document.getElementById("i-ship").onclick = function(){ setActivePreset(this); mode="ship"; App.resetTimeline(); App.play(); };
    document.getElementById("i-gal").onclick = function(){ setActivePreset(this); mode="gal"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="ship"){
      var xs = 80 + 0.5*100*(t*0.04)*(t*0.04)*400;
      if(t>1.2) xs = 80 + 0.5*100*(1.2*0.04)*(1.2*0.04)*400 + 100*1.2*0.04*(t-1.2)*80;
      var xa = t<1.2 ? xs+40 : (80+0.5*100*(1.2*0.04)*(1.2*0.04)*400 + 40 + 100*1.2*0.04*(t-1.2)*80);
      // after leaving, astronaut keeps the velocity at t=1.2, a=0
      var vsep = 100*1.2*0.04*80;
      var xship = 80 + 0.5*8*t*t*20;
      var xast = t<1.2 ? xship+50 : (80+0.5*8*1.2*1.2*20 + 50 + (8*1.2*20)*(t-1.2));
      m += '<rect x="'+xship+'" y="130" width="70" height="28" rx="4" fill="#38bdf8"/>';
      m += '<circle cx="'+xast+'" cy="144" r="8" fill="#f59e0b"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Ship keeps a=100 m s⁻²; astronaut’s a → 0 after t_sep</text>';
      readout(cell("a_ship","100 m/s²") + cell("a_astronaut", t<1.2?"with ship":"0","#f59e0b"));
      verdict("<b>Example 4.1:</b> once outside, F_net=0 so a=0. He does not carry the ship’s acceleration. Force is local.");
    } else {
      m += '<polyline points="80,80 280,220 640,220" fill="none" stroke="#64748b" stroke-width="6"/>';
      var f=Math.min(t/4,1);
      var x=80+f*200, y=80+f*140;
      if(f>0.5){ x=280+(f-0.5)*2*360; y=220; }
      m += '<circle cx="'+x+'" cy="'+(y-10)+'" r="10" fill="#38bdf8"/>';
      readout(cell("ideal second slope","horizontal") + cell("result","uniform velocity"));
      verdict("<b>Fig. 4.1b:</b> as the second incline flattens, the ball travels farther to regain height — infinitely far when the slope is zero. Inertia.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.secondlaw = (function(){
  function mount(){
    App.state.maxT = 0.02;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 0.02;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Bullet 0.04 kg</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Wood, 60 cm</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="b42">Example 4.2 stop in 60 cm</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var u=90, smax=0.60, a=-6750;
    var tt=Math.min(t, u/(-a));
    var x=u*tt+0.5*a*tt*tt; if(x>smax) x=smax; if(x<0) x=0;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="200" y="100" width="400" height="80" fill="#78350f"/>';
    m += '<circle cx="'+(200+x/smax*400)+'" cy="140" r="8" fill="#38bdf8"/>';
    svg.innerHTML = m;
    var v=u+a*tt; if(v<0) v=0;
    readout(cell("v", v.toFixed(1)+" m/s") + cell("|a|","6750 m/s²") + cell("F_avg","270 N","#34d399"));
    verdict("<b>Example 4.2 (zoom p.7):</b> a=−u²/(2s)=−6750 m s⁻². F=0.04×6750=<b>270 N</b> (average).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.impulse = (function(){
  var mode="bat";
  function mount(){
    App.state.maxT = 1.2;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 1.2;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ball</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Δp</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="j4">Example 4.4 bat 3.6 N s</button>' +
      '<button class="preset-btn" id="j5">Example 4.5 wall, 30°</button>';
    document.getElementById("j4").onclick = function(){ setActivePreset(this); mode="bat"; App.resetTimeline(); App.play(); };
    document.getElementById("j5").onclick = function(){ setActivePreset(this); mode="wall"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var f=Math.min(t/1.2,1);
    if(mode==="bat"){
      var x = f<0.5 ? 80+f*400 : 280-(f-0.5)*400;
      m += '<rect x="330" y="100" width="18" height="100" fill="#f59e0b"/>';
      m += '<circle cx="'+x+'" cy="150" r="10" fill="#38bdf8"/>';
      readout(cell("m","0.15 kg") + cell("u","12 m/s") + cell("Δp","3.6 N s","#34d399"));
      verdict("<b>Example 4.4:</b> Δp=0.15×12−(−0.15×12)=<b>3.6 N s</b> toward the bowler. F itself is unknown without Δt.");
    } else {
      m += '<rect x="500" y="40" width="16" height="220" fill="#64748b"/>';
      var ang=Math.PI/6;
      var x=120+f*360, y=80+f*120;
      if(f>0.55){ x=120+0.55*360-(f-0.55)*360; y=80+0.55*120+(f-0.55)*120; }
      m += '<circle cx="'+x+'" cy="'+y+'" r="9" fill="#38bdf8"/>';
      readout(cell("Δp_x","−2mu cos 30°") + cell("Δp_y","0") + cell("ratio a:b","2/√3 ≈ 1.2"));
      verdict("<b>Example 4.5:</b> force on the wall is <b>normal in both cases</b>. Impulse ratio head-on : 30° = 2/√3 ≈ 1.2.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.thirdlaw = (function(){
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Force on A by B</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Force on B by A</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="t1">Two skaters push</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var x1=300-t*30, x2=360+t*40;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<circle cx="'+x1+'" cy="150" r="22" fill="#38bdf8"/>';
    m += '<circle cx="'+x2+'" cy="150" r="16" fill="#f59e0b"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">F_AB = − F_BA  — same instant, different bodies</text>';
    svg.innerHTML = m;
    readout(cell("pair","equal and opposite") + cell("cancel on one FBD?","NO","#f87171"));
    verdict("<b>§4.6:</b> the pair never sits on one free-body diagram. Recoil of a gun is III + II, and is why Σp of an isolated pair is conserved.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.momentum = (function(){
  function mount(){
    App.state.maxT = 2;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 2;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>T₁</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>50 N</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>T₂ = 60 N</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="m46">Example 4.6 θ=40°</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var th=40*Math.PI/180;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="200" y1="40" x2="520" y2="40" stroke="#64748b" stroke-width="8"/>';
    m += '<line x1="360" y1="40" x2="'+(360+80*Math.sin(th))+'" y2="'+(40+80*Math.cos(th))+'" stroke="#38bdf8" stroke-width="4"/>';
    m += '<line x1="'+(360+80*Math.sin(th))+'" y1="'+(40+80*Math.cos(th))+'" x2="'+(360+80*Math.sin(th))+'" y2="240" stroke="#34d399" stroke-width="4"/>';
    m += '<circle cx="'+(360+80*Math.sin(th))+'" cy="255" r="14" fill="#f8fafc"/>';
    m += '<line x1="'+(360+80*Math.sin(th))+'" y1="'+(40+80*Math.cos(th))+'" x2="'+(360+80*Math.sin(th)+70)+'" y2="'+(40+80*Math.cos(th))+'" stroke="#f59e0b" stroke-width="3"/>';
    svg.innerHTML = m;
    readout(cell("T₂","60 N") + cell("F_side","50 N") + cell("θ","40°","#34d399"));
    verdict("<b>Example 4.6 (zoom p.11):</b> tan θ=50/60=5/6 ⇒ θ=40°. Independent of the 2 m length (massless rope).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.friction = (function(){
  var mode="static";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Applied F</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Friction</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="f-s">f_s self-adjusts to μ_s N</button>' +
      '<button class="preset-btn" id="f-9">Example 4.9 trolley</button>';
    document.getElementById("f-s").onclick = function(){ setActivePreset(this); mode="static"; App.resetTimeline(); App.play(); };
    document.getElementById("f-9").onclick = function(){ setActivePreset(this); mode="trolley"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="static"){
      var F=t/4*12;
      var fs=Math.min(F, 8);
      var moving = F>8;
      var x=200+(moving? (F-8)*20 : 0);
      m += '<line x1="40" y1="200" x2="680" y2="200" stroke="#334155" stroke-width="6"/>';
      m += '<rect x="'+x+'" y="160" width="70" height="40" fill="#38bdf8"/>';
      readout(cell("F_applied", F.toFixed(1)+" N") + cell("f_s", fs.toFixed(1)+" N","#f59e0b") + cell("limit μ_s N","8 N") + cell("state", moving?"sliding, f_k":"rest"));
      verdict("<b>§4.9:</b> f_s matches F until μ_s N. Then the body slides and friction drops to f_k=μ_k N < μ_s N.");
    } else {
      var a=22/23, T=27.1;
      var x=80+a*t*40;
      m += '<rect x="'+x+'" y="150" width="90" height="40" fill="#38bdf8"/>';
      m += '<text x="'+(x+45)+'" y="175" fill="#09131d" font-size="12" text-anchor="middle">20 kg</text>';
      m += '<line x1="'+(x+90)+'" y1="170" x2="520" y2="170" stroke="#f8fafc"/>';
      m += '<rect x="540" y="'+(80+a*t*20)+'" width="36" height="36" fill="#f59e0b"/>';
      readout(cell("a","0.96 m/s²") + cell("T","27.1 N") + cell("f_k","8 N"));
      verdict("<b>Example 4.9 (zoom p.14):</b> 30−T=3a, T−8=20a ⇒ a=22/23=0.96 m s⁻², T=27.1 N (g=10).");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.banked = (function(){
  var mode="level";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Vehicle</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Friction / N sin θ</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="b10">Ex 4.10 level, slips</button>' +
      '<button class="preset-btn" id="b11">Ex 4.11 banked 15°</button>';
    document.getElementById("b10").onclick = function(){ setActivePreset(this); mode="level"; App.resetTimeline(); App.play(); };
    document.getElementById("b11").onclick = function(){ setActivePreset(this); mode="bank"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var ang=t*1.2;
    if(mode==="level"){
      var R=90, cx=360, cy=160;
      m += '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+R+'" ry="40" fill="none" stroke="#334155" stroke-width="8"/>';
      var x=cx+R*Math.cos(ang), y=cy+40*Math.sin(ang);
      m += '<rect x="'+(x-12)+'" y="'+(y-8)+'" width="24" height="14" fill="#38bdf8"/>';
      readout(cell("v","5 m/s") + cell("μ_s R g","2.94") + cell("v²","25 > 2.94","#f87171"));
      verdict("<b>Example 4.10 (zoom p.16):</b> v²=25 ≰ μ_s Rg=2.94. The cyclist <b>slips</b>. v_max=√(μ_s Rg)≈1.7 m s⁻¹.");
    } else {
      m += '<line x1="80" y1="220" x2="640" y2="140" stroke="#64748b" stroke-width="10"/>';
      var x=120+t*80;
      m += '<rect x="'+x+'" y="'+(210-(x-80)*0.14-18)+'" width="36" height="16" transform="rotate(-8 '+(x+18)+' '+(200)+')" fill="#38bdf8"/>';
      readout(cell("v₀","28.1 m/s","#34d399") + cell("v_max","38.1 m/s") + cell("θ","15°"));
      verdict("<b>Example 4.11 (zoom p.16):</b> v₀=√(Rg tan 15°)=28.1 m s⁻¹ (no tyre wear). v_max=38.1 m s⁻¹ from Eq. (4.21).");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.fbd = (function(){
  var mode="a";
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Block 2 kg</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Cylinder 25 kg</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="f-a">4.12(a) rest, R=20 N</button>' +
      '<button class="preset-btn" id="f-b">4.12(b) yields, R′=267.3 N</button>';
    document.getElementById("f-a").onclick = function(){ setActivePreset(this); mode="a"; App.resetTimeline(); };
    document.getElementById("f-b").onclick = function(){ setActivePreset(this); mode="b"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var y = mode==="a" ? 160 : 160+0.1*t*40;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="80" y="220" width="560" height="24" fill="#334155"/>';
    m += '<rect x="300" y="'+y+'" width="120" height="40" fill="#38bdf8"/>';
    if(mode==="b"){
      m += '<rect x="320" y="'+(y-50)+'" width="80" height="50" fill="#f59e0b"/>';
    }
    svg.innerHTML = m;
    if(mode==="a"){
      readout(cell("W","20 N") + cell("R","20 N") + cell("action on floor","20 N down"));
      verdict("<b>Example 4.12(a):</b> at rest, R=20 N. Action on the floor is 20 N down. Weight and R are not a III-law pair.");
    } else {
      readout(cell("Mg","270 N") + cell("R′","267.3 N","#34d399") + cell("Ma","2.7 N"));
      verdict("<b>Example 4.12(b):</b> 270−R′=27×0.1 ⇒ R′=<b>267.3 N</b>. The floor feels less than the weight because a is downward.");
    }
  }
  return { mount: mount, draw: draw };
})();
