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

window.SIMS.cmfind = (function(){
  var mode = "tri";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Masses</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>CM</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c-t">Ex 6.1 equilateral</button>' +
      '<button class="preset-btn" id="c-l">Ex 6.3 L-lamina</button>';
    document.getElementById("c-t").onclick = function(){ setActivePreset(this); mode="tri"; App.resetTimeline(); };
    document.getElementById("c-l").onclick = function(){ setActivePreset(this); mode="L"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="tri"){
      var O=[160,240], A=[560,240], B=[360,240-0.5*400*Math.sqrt(3)/2];
      B=[360, 70];
      m += '<polygon points="'+O[0]+','+O[1]+' '+A[0]+','+A[1]+' '+B[0]+','+B[1]+'" fill="none" stroke="#475569"/>';
      m += '<circle cx="'+O[0]+'" cy="'+O[1]+'" r="10" fill="#38bdf8"/>';
      m += '<circle cx="'+A[0]+'" cy="'+A[1]+'" r="12" fill="#38bdf8"/>';
      m += '<circle cx="'+B[0]+'" cy="'+B[1]+'" r="14" fill="#38bdf8"/>';
      var Cx=160+(5/18)*400, Cy=240-(Math.sqrt(3)/9)*400*0.866*1.15;
      Cx = 160 + (5/18)*400; Cy = 240 - (Math.sqrt(3)/9)*(240-70)/(0.25*Math.sqrt(3))*0.25*Math.sqrt(3);
      // Y = √3/9 m, side 0.5 m maps 400 px; height 0.5*√3/2=0.433 m maps 170 px
      Cy = 240 - (Math.sqrt(3)/9)/0.433 * 170;
      m += '<circle cx="'+Cx+'" cy="'+Cy+'" r="7" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("X","5/18 m = 0.278 m") + cell("Y","√3/9 m = 0.192 m","#f59e0b"));
      verdict("<b>Example 6.1:</b> unequal masses — the CM is <em>not</em> the centroid. X=5/18 m, Y=√3/9 m.");
    } else {
      m += '<rect x="140" y="160" width="200" height="100" fill="#1e3a5f"/>';
      m += '<rect x="140" y="60" width="100" height="100" fill="#1e3a5f"/>';
      var cx=140+(5/6)*100*2, cy=260-(5/6)*100*2;
      // squares 1 m → 100 px; origin bottom-left of L at (140,260)
      cx = 140 + (5/6)*100; cy = 260 - (5/6)*100;
      m += '<circle cx="'+cx+'" cy="'+cy+'" r="7" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("X","5/6 m") + cell("Y","5/6 m") + cell("on","bisector of the L"));
      verdict("<b>Example 6.3:</b> three 1 kg squares at (½,½), (3/2,½), (½,3/2) average to <b>(5/6, 5/6) m</b>.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.cmmotion = (function(){
  var mode = "burst";
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>CM</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Fragments / child</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="b1">Firework burst</button>' +
      '<button class="preset-btn" id="b2">Ex 6.3 trolley + child</button>';
    document.getElementById("b1").onclick = function(){ setActivePreset(this); mode="burst"; App.resetTimeline(); App.play(); };
    document.getElementById("b2").onclick = function(){ setActivePreset(this); mode="trolley"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="burst"){
      var u=50, g=10, T=t;
      var x=80+u*T*0.7, y=260-(u*T-0.5*g*T*T)*1.2;
      if(y>260) y=260;
      m += '<path d="M 80 260 Q 280 40 560 260" fill="none" stroke="#334155" stroke-dasharray="6 4"/>';
      m += '<circle cx="'+x+'" cy="'+y+'" r="6" fill="#f59e0b"/>';
      if(t>2){
        var dt=t-2;
        m += '<circle cx="'+(x+40*dt)+'" cy="'+(y-20*dt)+'" r="4" fill="#38bdf8"/>';
        m += '<circle cx="'+(x-30*dt)+'" cy="'+(y-10*dt)+'" r="4" fill="#38bdf8"/>';
        m += '<circle cx="'+x+'" cy="'+(y+25*dt)+'" r="4" fill="#38bdf8"/>';
      }
      svg.innerHTML = m;
      readout(cell("F_ext","Mg down") + cell("CM path","original parabola","#f59e0b"));
      verdict("<b>§6.3:</b> explosion forces are internal. The CM continues on the parabola the unexploded shell would have followed.");
    } else {
      var xT=80+40*t, xC=xT+30+20*Math.sin(t*3);
      m += '<rect x="'+xT+'" y="160" width="160" height="40" fill="#1e3a5f"/>';
      m += '<circle cx="'+xC+'" cy="150" r="10" fill="#38bdf8"/>';
      m += '<circle cx="'+(xT+80)+'" cy="210" r="6" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("V_cm","V (unchanged)") + cell("floor","smooth ⇒ F_ext=0"));
      verdict("<b>Ex 6.3:</b> the child can run anywhere on the trolley; the (trolley+child) CM keeps speed V.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.sysP = (function(){
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Trolley + remaining sand</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Leaked sand</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p1">Sand leak (no thrust)</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var v=27; // km/h, shown as uniform
    var x=60+t*40;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="200" x2="680" y2="200" stroke="#334155" stroke-width="6"/>';
    m += '<rect x="'+x+'" y="150" width="120" height="40" fill="#38bdf8"/>';
    for(var i=0;i<Math.min(6, Math.floor(t));i++){
      m += '<circle cx="'+(x-20-i*18)+'" cy="210" r="4" fill="#f59e0b"/>';
    }
    svg.innerHTML = m;
    readout(cell("v_trolley","27 km/h","#34d399") + cell("P","M(t) V, V const") + cell("thrust","0"));
    verdict("<b>Leaking sand</b> already had the trolley’s velocity — no relative kick, unlike a rocket. Speed stays 27 km h⁻¹ (Ch. 5 Ex 5.19 / this chapter’s P law).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.crossprod = (function(){
  var mode = "screw";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>ω along axis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>v = ω × r</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="x1">Fan: v = ω × r</button>' +
      '<button class="preset-btn" id="x2">Ex 6.4 a × b</button>';
    document.getElementById("x1").onclick = function(){ setActivePreset(this); mode="screw"; App.resetTimeline(); App.play(); };
    document.getElementById("x2").onclick = function(){ setActivePreset(this); mode="ex"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="screw"){
      var ang=t*1.2, cx=360, cy=160, R=90;
      m += '<line x1="360" y1="40" x2="360" y2="260" stroke="#f59e0b" stroke-width="3"/>';
      m += '<ellipse cx="360" cy="160" rx="90" ry="28" fill="none" stroke="#334155"/>';
      var x=cx+R*Math.cos(ang), y=cy+28*Math.sin(ang);
      m += '<circle cx="'+x+'" cy="'+y+'" r="8" fill="#38bdf8"/>';
      svg.innerHTML = m;
      readout(cell("ω","along axle") + cell("v","tangential") + cell("v","ω r_⊥"));
      verdict("<b>Fig. 6.17:</b> ω along the fixed axis (right-hand screw). v = ω × r is tangent to the particle’s circle. Same ω for every particle.");
    } else {
      m += '<text x="360" y="80" fill="#e2e8f0" font-size="16" text-anchor="middle">a = 3î − 4ĵ + 5k̂,  b = −2î + ĵ − 3k̂</text>';
      m += '<text x="360" y="140" fill="#34d399" font-size="18" text-anchor="middle">a · b = −25</text>';
      m += '<text x="360" y="190" fill="#38bdf8" font-size="18" text-anchor="middle">a × b = 7î − ĵ − 5k̂</text>';
      m += '<text x="360" y="240" fill="#94a3b8" font-size="14" text-anchor="middle">b × a = − (a × b)  (anticommutative)</text>';
      svg.innerHTML = m;
      readout(cell("a·b","−25") + cell("a×b","(7, −1, −5)"));
      verdict("<b>Example 6.4 (zoom p.12):</b> determinant |î ĵ k̂ ; 3 −4 5 ; −2 1 −3| = 7î − ĵ − 5k̂.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.torque = (function(){
  var mode = "wrench";
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>r</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>F or v</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="t1">Ex 6.5 r × F</button>' +
      '<button class="preset-btn" id="t2">Ex 6.6 free particle ℓ</button>';
    document.getElementById("t1").onclick = function(){ setActivePreset(this); mode="wrench"; App.resetTimeline(); };
    document.getElementById("t2").onclick = function(){ setActivePreset(this); mode="free"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="wrench"){
      m += '<text x="360" y="50" fill="#e2e8f0" font-size="15" text-anchor="middle">r = î − ĵ + k̂,  F = 7î + 3ĵ − 5k̂</text>';
      m += '<text x="360" y="120" fill="#34d399" font-size="18" text-anchor="middle">τ = r × F = 2î + 12ĵ + 10k̂</text>';
      m += '<line x1="200" y1="200" x2="400" y2="140" stroke="#f59e0b" stroke-width="3"/>';
      m += '<line x1="400" y1="140" x2="520" y2="100" stroke="#38bdf8" stroke-width="3"/>';
      svg.innerHTML = m;
      readout(cell("τ_x","2") + cell("τ_y","12") + cell("τ_z","10"));
      verdict("<b>Example 6.5 (zoom p.17):</b> determinant |î ĵ k̂ ; 1 −1 1 ; 7 3 −5| = 2î + 12ĵ + 10k̂.");
    } else {
      var x=80+t*80, y=80+40;
      m += '<line x1="80" y1="120" x2="640" y2="120" stroke="#38bdf8" stroke-dasharray="4 4"/>';
      m += '<circle cx="200" cy="220" r="5" fill="#f8fafc"/>';
      m += '<text x="210" y="250" fill="#94a3b8" font-size="12">O</text>';
      m += '<line x1="200" y1="220" x2="'+x+'" y2="120" stroke="#f59e0b"/>';
      m += '<circle cx="'+x+'" cy="120" r="8" fill="#38bdf8"/>';
      m += '<line x1="200" y1="220" x2="200" y2="120" stroke="#34d399" stroke-dasharray="3 3"/>';
      svg.innerHTML = m;
      readout(cell("b = r sinθ","constant") + cell("ℓ","m v b constant","#34d399"));
      verdict("<b>Example 6.6:</b> free particle, impact parameter OM = r sinθ is constant, so ℓ = mvr sinθ is constant about any point. τ=0.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.ladder = (function(){
  var mode = "bar";
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Supports</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Loads</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="l1">Ex 6.8 knife-edges</button>' +
      '<button class="preset-btn" id="l2">Ex 6.9 ladder</button>';
    document.getElementById("l1").onclick = function(){ setActivePreset(this); mode="bar"; App.resetTimeline(); };
    document.getElementById("l2").onclick = function(){ setActivePreset(this); mode="lad"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="bar"){
      m += '<line x1="80" y1="160" x2="640" y2="160" stroke="#94a3b8" stroke-width="8"/>';
      m += '<rect x="150" y="160" width="12" height="40" fill="#38bdf8"/>';
      m += '<rect x="540" y="160" width="12" height="40" fill="#38bdf8"/>';
      m += '<circle cx="280" cy="150" r="10" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("R1","54.88 N") + cell("R2","43.12 N") + cell("R1+R2","98 N"));
      verdict("<b>Example 6.8:</b> ΣF=0 ⇒ R1+R2=10g=98 N. Moments about G ⇒ R1−R2=11.76 N. R1=54.88 N, R2=43.12 N.");
    } else {
      m += '<line x1="140" y1="260" x2="140" y2="60" stroke="#475569" stroke-width="6"/>';
      m += '<line x1="140" y1="60" x2="280" y2="260" stroke="#f59e0b" stroke-width="8"/>';
      m += '<line x1="120" y1="260" x2="500" y2="260" stroke="#334155" stroke-width="6"/>';
      svg.innerHTML = m;
      readout(cell("N","196 N") + cell("F_wall","34.6 N") + cell("|F2|","199 N") + cell("α","≈80°"));
      verdict("<b>Example 6.9:</b> frictionless wall ⇒ F1 horizontal. Moments about A: F1=W/(4√2)=34.6 N. Floor reaction 199 N at tan⁻¹(4√2)≈80°.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.flywheel = (function(){
  var mode = "cyl";
  function mount(){
    App.state.maxT = 16;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 16;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Rotor</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="f1">Ex 6.11 cylinder K, L</button>' +
      '<button class="preset-btn" id="f2">Ex 6.11 motor 576 rev</button>';
    document.getElementById("f1").onclick = function(){ setActivePreset(this); mode="cyl"; App.state.maxT=4; document.getElementById("time-scrubber").max=4; App.resetTimeline(); App.play(); };
    document.getElementById("f2").onclick = function(){ setActivePreset(this); mode="motor"; App.state.maxT=16; document.getElementById("time-scrubber").max=16; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var ang = t * (mode==="cyl"?10: 40*Math.PI/16 * 0.3);
    var cx=360, cy=150;
    m += '<ellipse cx="'+cx+'" cy="'+cy+'" rx="90" ry="90" fill="none" stroke="#38bdf8" stroke-width="6"/>';
    m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+80*Math.cos(ang))+'" y2="'+(cy+80*Math.sin(ang))+'" stroke="#f8fafc" stroke-width="3"/>';
    svg.innerHTML = m;
    if(mode==="cyl"){
      readout(cell("I","0.625 kg m²") + cell("K","3125 J","#34d399") + cell("L","62.5 kg m²/s"));
      verdict("<b>Ex 6.11:</b> solid cylinder I=½MR²=0.625 kg m². K=½Iω²=<b>3125 J</b>, L=Iω=<b>62.5</b> kg m² s⁻¹.");
    } else {
      var w0=40*Math.PI, w=w0+4*Math.PI*t, th=w0*t+0.5*4*Math.PI*t*t;
      readout(cell("α","4π rad/s²") + cell("θ", (th/Math.PI).toFixed(0)+" π rad") + cell("rev", (th/(2*Math.PI)).toFixed(0)));
      verdict("<b>Example 6.11:</b> 1200→3120 rpm in 16 s. α=4π rad s⁻². θ=1152π rad = <b>576 revolutions</b>.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.icechair = (function(){
  var mode = "cord";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Rotor / skater</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="i1">Ex 6.12 flywheel cord</button>' +
      '<button class="preset-btn" id="i2">Arms in: Iω conserved</button>';
    document.getElementById("i1").onclick = function(){ setActivePreset(this); mode="cord"; App.resetTimeline(); App.play(); };
    document.getElementById("i2").onclick = function(){ setActivePreset(this); mode="chair"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="cord"){
      var th=t*3, R=70;
      m += '<circle cx="400" cy="150" r="'+R+'" fill="none" stroke="#38bdf8" stroke-width="8"/>';
      var x=400-R-t*40;
      m += '<line x1="400" y1="150" x2="'+x+'" y2="150" stroke="#f59e0b" stroke-width="3"/>';
      svg.innerHTML = m;
      readout(cell("τ","5.0 N m") + cell("I","0.40 kg m²") + cell("α","12.5 rad/s²") + cell("W=ΔK","50 J","#34d399"));
      verdict("<b>Example 6.12:</b> τ=Iα ⇒ α=12.5 s⁻². 2 m of cord: W=50 J = ½Iω². Frictionless bearing: work–energy holds.");
    } else {
      var arms = 80 - t*12;
      var om = 1 + t*0.8;
      var ang = t*om*3;
      m += '<circle cx="360" cy="160" r="18" fill="#38bdf8"/>';
      m += '<line x1="'+(360-arms*Math.cos(ang))+'" y1="'+(160-arms*Math.sin(ang))+'" x2="'+(360+arms*Math.cos(ang))+'" y2="'+(160+arms*Math.sin(ang))+'" stroke="#f59e0b" stroke-width="6"/>';
      svg.innerHTML = m;
      readout(cell("I","decreases") + cell("ω","increases") + cell("Iω","constant") + cell("K","rises ×2.5 at 2/5 I"));
      verdict("<b>Ex 6.12 / Fig. 6.32:</b> τ_ext=0 ⇒ Iω constant. 40 rev/min → 100 rev/min when I→(2/5)I. Extra K is the work of pulling the arms in.");
    }
  }
  return { mount: mount, draw: draw };
})();
Object.keys(window.SIMS).forEach(function(key){var sim=window.SIMS[key];if(!sim||typeof sim.mount!=="function")return;var originalMount=sim.mount;sim.mount=function(lesson){originalMount.call(sim,lesson);document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn,index){if(!btn.dataset.preset)btn.dataset.preset=btn.id||(key+"-"+index);});};});
document.addEventListener("click",function(event){if(!event.target.closest("#btn-check-prediction"))return;var lesson=window.CHAPTER.lessons[App.state.conceptIndex],chosen=document.querySelector('input[name="predict_ans"]:checked');if(!lesson||!chosen)return;document.querySelectorAll("#predict-options .predict-option").forEach(function(option,index){option.classList.toggle("is-answer",index===lesson.prediction.answer);option.classList.toggle("is-wrong",index===Number(chosen.value)&&index!==lesson.prediction.answer);});});
