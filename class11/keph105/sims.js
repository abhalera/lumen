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

window.SIMS.dotwork = (function(){
  var theta = 0;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Force F</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Displacement d</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="w0">θ = 0° (max +W)</button>' +
      '<button class="preset-btn" id="w90">θ = 90° (W=0)</button>' +
      '<button class="preset-btn" id="w180">θ = 180° (Ex 5.3)</button>';
    document.getElementById("w0").onclick = function(){ setActivePreset(this); theta=0; App.resetTimeline(); App.play(); };
    document.getElementById("w90").onclick = function(){ setActivePreset(this); theta=90; App.resetTimeline(); App.play(); };
    document.getElementById("w180").onclick = function(){ setActivePreset(this); theta=180; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var F = 200, d = 10 * (t/6);
    var rad = theta * Math.PI/180;
    var W = F * d * Math.cos(rad);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="200" x2="640" y2="200" stroke="#334155" stroke-width="4"/>';
    var x = 120 + d*40;
    m += '<rect x="'+(x-18)+'" y="168" width="36" height="28" rx="4" fill="#38bdf8"/>';
    m += '<line x1="'+x+'" y1="182" x2="'+(x+70*Math.cos(rad))+'" y2="'+(182-70*Math.sin(rad))+'" stroke="#f59e0b" stroke-width="3" marker-end="url(#a)"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">W = Fd cos θ · Example 5.3 uses θ = 180°</text>';
    svg.innerHTML = m;
    readout(cell("θ", theta+"°") + cell("|F|","200 N") + cell("d", d.toFixed(2)+" m") + cell("W", W.toFixed(0)+" J", W<0?"#f87171":"#34d399"));
    verdict(theta===180
      ? "<b>Example 5.3:</b> road on cycle W = 200×10×cos 180° = <b>−2000 J</b>. Cycle on road = 0 (road does not move)."
      : (theta===90
        ? "<b>θ=90°:</b> gravity on a horizontal table, or Earth on a circular Moon — W = 0 even though F is large."
        : "<b>θ=0°:</b> maximum positive work. Sign of W is the sign of cos θ."));
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.wetheorem = (function(){
  var mode = "drop";
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Body</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Forces</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="r-drop">Ex 5.2 raindrop</button>' +
      '<button class="preset-btn" id="r-bullet">Ex 5.4 bullet 10% K</button>';
    document.getElementById("r-drop").onclick = function(){ setActivePreset(this); mode="drop"; App.state.maxT=5; document.getElementById("time-scrubber").max=5; App.resetTimeline(); App.play(); };
    document.getElementById("r-bullet").onclick = function(){ setActivePreset(this); mode="bullet"; App.state.maxT=2; document.getElementById("time-scrubber").max=2; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="drop"){
      var y = 40 + (t/5)*200;
      m += '<line x1="200" y1="40" x2="200" y2="260" stroke="#334155" stroke-dasharray="4 4"/>';
      m += '<circle cx="200" cy="'+y+'" r="8" fill="#38bdf8"/>';
      m += '<text x="420" y="80" fill="#94a3b8" font-size="13">m=1.00 g, h=1.00 km, v=50 m/s, g=10</text>';
      svg.innerHTML = m;
      readout(cell("W_g","10.0 J","#34d399") + cell("ΔK","1.25 J") + cell("W_r","−8.75 J","#f87171"));
      verdict("<b>Example 5.2:</b> WE theorem recovers the unknown viscous work: W_r = ΔK − W_g = 1.25 − 10 = <b>−8.75 J</b>.");
    } else {
      var x = 80 + Math.min(t/0.4, 1)*200;
      var x2 = 280 + Math.max(t-0.4,0)/1.6 * 300;
      var v = t<0.4 ? 200 : 63.2;
      m += '<rect x="260" y="120" width="24" height="80" fill="#64748b"/>';
      m += '<circle cx="'+(t<0.4?x:x2)+'" cy="160" r="7" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("K_i","1000 J") + cell("K_f","100 J") + cell("v_f","63.2 m/s","#34d399"));
      verdict("<b>Example 5.4:</b> 10% of K remains ⇒ v_f = 200√0.10 = <b>63.2 m s⁻¹</b>. Speed falls ~68%, not 90%.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.varforce = (function(){
  var mode = "trunk";
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Applied F</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Friction</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="v-tr">Ex 5.5 trunk 20 m</button>' +
      '<button class="preset-btn" id="v-ln">Ex 5.6 F = −k/x</button>';
    document.getElementById("v-tr").onclick = function(){ setActivePreset(this); mode="trunk"; App.resetTimeline(); App.play(); };
    document.getElementById("v-ln").onclick = function(){ setActivePreset(this); mode="log"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function Fapp(x){ return x<=10 ? 100 : 100 - 5*(x-10); }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    function X(x){ return 80 + x*28; }
    function Y(F){ return 180 - F*0.9; }
    if(mode==="trunk"){
      var x = Math.min(20, t*2.5);
      m += '<line x1="80" y1="180" x2="680" y2="180" stroke="#475569"/>';
      m += '<rect x="80" y="'+Y(100)+'" width="'+(X(Math.min(x,10))-80)+'" height="'+(180-Y(100))+'" fill="#38bdf844"/>';
      m += '<path d="M '+X(0)+' '+Y(100)+' L '+X(10)+' '+Y(100)+' L '+X(20)+' '+Y(50)+'" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<line x1="80" y1="'+Y(-50)+'" x2="'+X(20)+'" y2="'+Y(-50)+'" stroke="#f87171" stroke-width="2"/>';
      m += '<circle cx="'+X(x)+'" cy="'+Y(Fapp(x))+'" r="5" fill="#f8fafc"/>';
      svg.innerHTML = m;
      readout(cell("x", x.toFixed(1)+" m") + cell("W_F","1750 J","#34d399") + cell("W_f","−1000 J","#f87171"));
      verdict("<b>Example 5.5:</b> rectangle 1000 J + trapezium 750 J = <b>1750 J</b>. Friction rectangle (−50)×20 = <b>−1000 J</b>.");
    } else {
      var xi=0.10, xf=2.01, xx = xi + (xf-xi)*(t/8);
      var K = 2 - 0.5*Math.log(xx/xi);
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">F = −k/x on 0.10 &lt; x &lt; 2.01 m, k = 0.5 J</text>';
      m += '<line x1="80" y1="220" x2="660" y2="220" stroke="#475569"/>';
      var d="";
      for(var u=xi;u<=xf;u+=0.02){
        var px=80+(u/xf)*560, py=220-80/u;
        d += (u===xi?"M":"L")+" "+px+" "+py;
      }
      m += '<path d="'+d+'" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      svg.innerHTML = m;
      readout(cell("x", xx.toFixed(2)+" m") + cell("K", K.toFixed(2)+" J") + cell("K_f","0.50 J","#34d399"));
      verdict("<b>Example 5.6:</b> K_f = 2 − 0.5 ln(20.1) = <b>0.50 J</b>, v_f = 1 m s⁻¹. ln is log_e.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.mechE = (function(){
  var mode = "cliff";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>K</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>V</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>E=K+V</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="m-c">Fig 5.5 cliff drop</button>' +
      '<button class="preset-btn" id="m-v">Ex 5.7 vertical circle</button>';
    document.getElementById("m-c").onclick = function(){ setActivePreset(this); mode="cliff"; App.state.maxT=4; document.getElementById("time-scrubber").max=4; App.resetTimeline(); App.play(); };
    document.getElementById("m-v").onclick = function(){ setActivePreset(this); mode="circ"; App.state.maxT=6; document.getElementById("time-scrubber").max=6; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="cliff"){
      var H=80, h=Math.max(0, H - 0.5*10*(t*0.6)*(t*0.6)*2);
      if(h<0) h=0;
      var py=40+(80-h)*2.4;
      m += '<rect x="120" y="40" width="40" height="200" fill="#1e293b"/>';
      m += '<circle cx="200" cy="'+py+'" r="10" fill="#38bdf8"/>';
      var K=80-h, V=h, E=80;
      svg.innerHTML = m;
      readout(cell("V ~ h", V.toFixed(1)) + cell("K ~ (H−h)", K.toFixed(1)) + cell("E", E.toFixed(1), "#34d399"));
      verdict("<b>Fig. 5.5:</b> E_H = mgH = E_h = E_0. At the ground the energy is purely kinetic: v_f = √(2gH).");
    } else {
      var ang = Math.PI/2 + (t/6)*Math.PI;
      var L=90, cx=360, cy=140;
      var x=cx+L*Math.sin(ang-Math.PI), y=cy-L*Math.cos(ang-Math.PI);
      // A at bottom: start ang=0 at bottom
      var phi = (t/6)*Math.PI; // 0 bottom → π top
      x = cx + L*Math.sin(phi);
      y = cy + L*Math.cos(phi);
      m += '<circle cx="'+cx+'" cy="'+cy+'" r="'+L+'" fill="none" stroke="#334155"/>';
      m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'" stroke="#94a3b8"/>';
      m += '<circle cx="'+x+'" cy="'+y+'" r="10" fill="#f59e0b"/>';
      m += '<text x="80" y="40" fill="#94a3b8" font-size="13">A bottom → C top, string slacks at C</text>';
      svg.innerHTML = m;
      readout(cell("v₀","√(5gL)") + cell("v_B","√(3gL)") + cell("v_C","√(gL)") + cell("K_B/K_C","3","#34d399"));
      verdict("<b>Example 5.7:</b> T_C=0 ⇒ v_C=√(gL). Energy (5/2)mgL at A ⇒ v₀=√(5gL). After C the bob is a horizontal projectile if the string is cut.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.spring = (function(){
  var mu = 0;
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Car</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Spring</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="s0">Ex 5.8 μ=0</button>' +
      '<button class="preset-btn" id="s1">Ex 5.9 μ=0.5</button>';
    document.getElementById("s0").onclick = function(){ setActivePreset(this); mu=0; App.resetTimeline(); App.play(); };
    document.getElementById("s1").onclick = function(){ setActivePreset(this); mu=0.5; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var k=5.25e3, m=1000, v=5, K=0.5*m*v*v;
    var xm = mu===0 ? Math.sqrt(2*K/k) : (-mu*m*10 + Math.sqrt(Math.pow(mu*m*10,2)+m*k*v*v))/k;
    var x = Math.min(xm, (t/4)*xm);
    var msvg = '<rect width="720" height="300" fill="#09131d"/>';
    msvg += '<rect x="40" y="80" width="24" height="140" fill="#475569"/>';
    var coils = "";
    var x0=64, x1=120+x*180;
    for(var i=0;i<10;i++){
      var px=x0+(x1-x0)*i/10, py=150+(i%2?16:-16);
      coils += (i?"L":"M")+" "+px+" "+py;
    }
    msvg += '<path d="'+coils+'" fill="none" stroke="#f59e0b" stroke-width="3"/>';
    msvg += '<rect x="'+x1+'" y="130" width="70" height="40" rx="4" fill="#38bdf8"/>';
    svg.innerHTML = msvg;
    readout(cell("K_i","1.25×10⁴ J") + cell("μ", String(mu)) + cell("x_m", xm.toFixed(2)+" m","#34d399"));
    verdict(mu===0
      ? "<b>Example 5.8 (independent):</b> x_m = √(2K/k) = <b>2.18 m</b>. Reprint prints 2.00 m, which would need k=6.25×10³ not 5.25×10³."
      : "<b>Example 5.9 (independent, g=10):</b> ½kx² + μmg x = K ⇒ x_m = <b>1.43 m</b>. Reprint prints 1.35 m. Friction shortens the crush.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.power = (function(){
  var mode = "lift";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Elevator / body</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-el">Ex 5.10 elevator 59 hp</button>' +
      '<button class="preset-btn" id="p-c">Ex 5.10 constant power x∝t^{3/2}</button>';
    document.getElementById("p-el").onclick = function(){ setActivePreset(this); mode="lift"; App.resetTimeline(); App.play(); };
    document.getElementById("p-c").onclick = function(){ setActivePreset(this); mode="constP"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="lift"){
      var y=240 - (t/6)*160;
      m += '<rect x="300" y="'+y+'" width="80" height="50" fill="#38bdf8"/>';
      m += '<line x1="340" y1="40" x2="340" y2="'+y+'" stroke="#94a3b8"/>';
      svg.innerHTML = m;
      readout(cell("F","22000 N") + cell("v","2 m/s") + cell("P","44000 W = 59 hp","#34d399"));
      verdict("<b>Example 5.10:</b> P = F·v = 22000×2 = <b>44000 W = 59 hp</b>. 1 hp = 746 W. kWh on the bill is energy, not power.");
    } else {
      var x = 40*Math.pow(t,1.5);
      m += '<line x1="40" y1="200" x2="680" y2="200" stroke="#334155" stroke-width="4"/>';
      m += '<circle cx="'+(80+Math.min(x,560))+'" cy="188" r="12" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("P","constant") + cell("v","∝ t^{1/2}") + cell("x","∝ t^{3/2}","#34d399"));
      verdict("<b>Ex 5.10:</b> constant power ⇒ v dv ∝ dt ⇒ v∝t^{1/2} ⇒ displacement ∝ t^{3/2}. Contrast Ex 5.9 (constant a ⇒ P∝t).");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.collide = (function(){
  var mode = "elastic";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>m₁ (cue)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>m₂ (target at rest)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c-e">1-D elastic equal m</button>' +
      '<button class="preset-btn" id="c-i">completely inelastic</button>' +
      '<button class="preset-btn" id="c-g">Ex 5.12 glance 37°/53°</button>';
    document.getElementById("c-e").onclick = function(){ setActivePreset(this); mode="elastic"; App.resetTimeline(); App.play(); };
    document.getElementById("c-i").onclick = function(){ setActivePreset(this); mode="inelastic"; App.resetTimeline(); App.play(); };
    document.getElementById("c-g").onclick = function(){ setActivePreset(this); mode="glance"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="180" x2="680" y2="180" stroke="#334155" stroke-width="4"/>';
    var tc=1.2;
    if(mode==="elastic"){
      var x1 = t<tc ? 80+t*160 : 80+tc*160;
      var x2 = t<tc ? 320 : 320+(t-tc)*160;
      m += '<circle cx="'+x1+'" cy="168" r="14" fill="#38bdf8"/>';
      m += '<circle cx="'+x2+'" cy="168" r="14" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("m₁=m₂","equal") + cell("v_{1f}","0") + cell("v_{2f}","v_{1i}","#34d399"));
      verdict("<b>Equal-mass 1-D elastic:</b> the cue stops, the target takes v_{1i}. Carrom / Newton’s cradle (Ex 5.16 panel ii).");
    } else if(mode==="inelastic"){
      var x1 = t<tc ? 80+t*160 : 80+tc*160+(t-tc)*80;
      var x2 = t<tc ? 320 : 320+(t-tc)*80;
      m += '<circle cx="'+x1+'" cy="168" r="14" fill="#38bdf8"/>';
      m += '<circle cx="'+x2+'" cy="168" r="14" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("stick","yes") + cell("v_f","v_{1i}/2") + cell("ΔK","−¼ m v²","#f87171"));
      verdict("<b>Completely inelastic:</b> v_f = m1 v_{1i}/(m1+m2). K is not conserved; momentum is.");
    } else {
      var x1=200+(t)*40, y1=180-(t)*30;
      var x2=200+(t)*50, y2=180+(t)*38;
      if(t<0.4){ x1=80+t*300; y1=180; x2=200; y2=180; }
      m += '<circle cx="'+x1+'" cy="'+y1+'" r="12" fill="#38bdf8"/>';
      m += '<circle cx="'+x2+'" cy="'+y2+'" r="12" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("θ₂","37°") + cell("θ₁","53°","#34d399") + cell("θ₁+θ₂","90°"));
      verdict("<b>Example 5.12:</b> equal masses, elastic, target at rest ⇒ outgoing velocities are perpendicular. θ1=53°.");
    }
  }
  return { mount: mount, draw: draw };
})();

Object.keys(window.SIMS).forEach(function(key){
  var sim=window.SIMS[key]; if(!sim || typeof sim.mount!=="function") return;
  var originalMount=sim.mount;
  sim.mount=function(lesson){ originalMount.call(sim,lesson); document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn,index){ if(!btn.dataset.preset) btn.dataset.preset=btn.id || (key+"-"+index); }); };
});
document.addEventListener("click",function(event){
  if(!event.target.closest("#btn-check-prediction")) return;
  var lesson=window.CHAPTER.lessons[App.state.conceptIndex], chosen=document.querySelector('input[name="predict_ans"]:checked'); if(!lesson||!chosen) return;
  document.querySelectorAll("#predict-options .predict-option").forEach(function(option,index){ option.classList.toggle("is-answer",index===lesson.prediction.answer); option.classList.toggle("is-wrong",index===Number(chosen.value)&&index!==lesson.prediction.answer); });
});
