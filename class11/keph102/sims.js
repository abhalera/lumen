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

window.SIMS.pointobj = (function(){
  var mode = "train";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Centre of mass</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Finite size / spin</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-train">Vande Bharat 759 km (point object YES)</button>' +
      '<button class="preset-btn" id="p-ball">Spinning cricket ball (NO)</button>';
    document.getElementById("p-train").onclick = function(){ setActivePreset(this); mode="train"; App.resetTimeline(); App.play(); };
    document.getElementById("p-ball").onclick = function(){ setActivePreset(this); mode="ball"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "train"){
      var x = 80 + (t/6)*520;
      m += '<line x1="40" y1="180" x2="680" y2="180" stroke="#334155" stroke-width="6"/>';
      m += '<rect x="' + (x-18) + '" y="150" width="36" height="22" rx="4" fill="#38bdf8"/>';
      m += '<circle cx="' + x + '" cy="180" r="6" fill="#f8fafc"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Length 0.38 km ≪ 759 km — one moving dot on the route</text>';
      readout(cell("Journey fraction", (t/6*100).toFixed(0)+"%") + cell("Point-object test","PASS","#34d399"));
      verdict("<b>YES:</b> coach length is negligible compared with Delhi–Varanasi. Kinematics tracks the centre of mass.");
    } else {
      var ang = t * 4;
      var cx = 360, cy = 150;
      m += '<circle cx="'+cx+'" cy="'+cy+'" r="40" fill="none" stroke="#f59e0b" stroke-width="3"/>';
      m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+40*Math.cos(ang))+'" y2="'+(cy+40*Math.sin(ang))+'" stroke="#f8fafc" stroke-width="3"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Spin + sharp turn: orientation is the motion of interest</text>';
      readout(cell("Spin","visible") + cell("Point-object test","FAIL","#f87171"));
      verdict("<b>NO (Ex 2.1c):</b> a spinning cricket ball that turns on the ground is not a point object — radius and rotation matter.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.instvel = (function(){
  var dt = 2.0;
  function xOf(t){ return 0.08 * t * t * t; }
  function vExact(t){ return 0.24 * t * t; }
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>x = 0.08 t³</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Chord Δx/Δt</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Tangent dx/dt</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dt2">Table 2.1: Δt = 2.0 s</button>' +
      '<button class="preset-btn" id="p-dt05">Δt = 0.5 s</button>' +
      '<button class="preset-btn" id="p-dt01">Δt = 0.01 s → 3.84</button>';
    document.getElementById("p-dt2").onclick = function(){ setActivePreset(this); dt=2; App.resetTimeline(); };
    document.getElementById("p-dt05").onclick = function(){ setActivePreset(this); dt=0.5; App.resetTimeline(); };
    document.getElementById("p-dt01").onclick = function(){ setActivePreset(this); dt=0.01; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Centre time t</span><span class="val" id="ctrl-t">4.0 s</span></div>' +
      '<input type="range" id="ctrl-t-range" min="1" max="5.5" step="0.1" value="4"></div>';
    document.getElementById("ctrl-t-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var t0 = Number(document.getElementById("ctrl-t-range").value);
    document.getElementById("ctrl-t").textContent = t0.toFixed(1)+" s";
    var t1 = Math.max(0, t0 - dt/2), t2 = t0 + dt/2;
    var chord = (xOf(t2) - xOf(t1)) / (t2 - t1);
    var exact = vExact(t0);
    function X(t){ return 60 + t * 100; }
    function Y(x){ return 250 - x * 10; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="60" y1="250" x2="680" y2="250" stroke="#475569"/><line x1="60" y1="250" x2="60" y2="30" stroke="#475569"/>';
    var d = "";
    for(var t=0;t<=6.05;t+=0.1){
      d += (t===0?"M":"L") + " " + X(t) + " " + Y(xOf(t));
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<line x1="'+X(t1)+'" y1="'+Y(xOf(t1))+'" x2="'+X(t2)+'" y2="'+Y(xOf(t2))+'" stroke="#f59e0b" stroke-width="3"/>';
    var slope = exact * 10 / 100;
    m += '<line x1="'+X(t0-0.8)+'" y1="'+(Y(xOf(t0))+slope*80)+'" x2="'+X(t0+0.8)+'" y2="'+(Y(xOf(t0))-slope*80)+'" stroke="#34d399" stroke-width="2" stroke-dasharray="6 4"/>';
    m += '<circle cx="'+X(t0)+'" cy="'+Y(xOf(t0))+'" r="5" fill="#f8fafc"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 2.1 style: chord → tangent as Δt → 0</text>';
    svg.innerHTML = m;
    readout(cell("Δt", dt.toFixed(2)+" s") + cell("Δx/Δt (chord)", chord.toFixed(4)+" m/s", "#f59e0b") + cell("dx/dt exact", exact.toFixed(4)+" m/s", "#34d399"));
    verdict("<b>Table 2.1:</b> at t = 4 s the exact slope is 0.24×16 = <b>3.84 m s⁻¹</b>. Smaller Δt makes the orange chord hug the green tangent.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.accel = (function(){
  var caseId = "a";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>v(t)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c-a">Fig 2.3a +v +a</button>' +
      '<button class="preset-btn" id="c-b">2.3b +v −a</button>' +
      '<button class="preset-btn" id="c-c">2.3c −v −a</button>' +
      '<button class="preset-btn" id="c-d">2.3d turns back</button>';
    ["a","b","c","d"].forEach(function(k){
      document.getElementById("c-"+k).onclick = function(){ setActivePreset(this); caseId=k; App.resetTimeline(); App.play(); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function params(){
    if(caseId==="a") return {v0:4, a:2, note:"+ direction, +a: speeding up to the right"};
    if(caseId==="b") return {v0:12, a:-2, note:"+ direction, −a: slowing, may stop"};
    if(caseId==="c") return {v0:-4, a:-2, note:"− direction, −a: speeding up to the left"};
    return {v0:8, a:-3, note:"starts +x, a negative: reverses after v=0"};
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var p = params();
    var v = p.v0 + p.a * t;
    function X(tt){ return 80 + tt*90; }
    function Y(vv){ return 160 - vv*6; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="160" x2="680" y2="160" stroke="#475569"/><line x1="80" y1="260" x2="80" y2="40" stroke="#475569"/>';
    m += '<line x1="'+X(0)+'" y1="'+Y(p.v0)+'" x2="'+X(6)+'" y2="'+Y(p.v0+p.a*6)+'" stroke="#38bdf8" stroke-width="3"/>';
    m += '<circle cx="'+X(t)+'" cy="'+Y(v)+'" r="6" fill="#f8fafc"/>';
    svg.innerHTML = m;
    readout(cell("v₀", p.v0+" m/s") + cell("a", p.a+" m/s²") + cell("v(t)", v.toFixed(2)+" m/s"));
    verdict("<b>Fig. 2.3 "+caseId+":</b> "+p.note+". Slope of this line is a. Speed is increasing iff v and a have the same sign.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.vtarea = (function(){
  var u = 15;
  function mount(){
    App.state.maxT = 10;
    var s = document.getElementById("time-scrubber"); if(s){ s.max = 10; }
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>v = constant</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d39988;"></span><span>Area = displacement</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="u15">u = +15 m/s (Fig. 2.4)</button>' +
      '<button class="preset-btn" id="u-10">u = −10 m/s (negative area)</button>';
    document.getElementById("u15").onclick = function(){ setActivePreset(this); u=15; App.resetTimeline(); App.play(); };
    document.getElementById("u-10").onclick = function(){ setActivePreset(this); u=-10; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var T = Math.min(t, 10);
    var area = u * T;
    function X(tt){ return 80 + tt*55; }
    function Y(vv){ return 160 - vv*5; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="160" x2="680" y2="160" stroke="#475569"/><line x1="80" y1="40" x2="80" y2="280" stroke="#475569"/>';
    var yU = Y(u);
    m += '<rect x="80" y="'+(u>=0?yU:160)+'" width="'+(X(T)-80)+'" height="'+Math.abs(160-yU)+'" fill="#34d39944"/>';
    m += '<line x1="80" y1="'+yU+'" x2="'+X(10)+'" y2="'+yU+'" stroke="#38bdf8" stroke-width="3"/>';
    m += '<circle cx="'+X(T)+'" cy="'+yU+'" r="5" fill="#f8fafc"/>';
    svg.innerHTML = m;
    readout(cell("u", u+" m/s") + cell("t", T.toFixed(1)+" s") + cell("area u·t", area.toFixed(1)+" m", "#34d399"));
    verdict("<b>Fig. 2.4:</b> rectangle of height u and width T. Signed area is displacement. Negative u paints the rectangle below the t-axis.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.kin = (function(){
  var u = 0, a = 2;
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>x(t)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>v(t)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="k1">u=0, a=2 (x=½at²)</button>' +
      '<button class="preset-btn" id="k2">Brake: u=10, a=−2</button>' +
      '<button class="preset-btn" id="k3">Example 2.3 launch a=−10</button>';
    document.getElementById("k1").onclick = function(){ setActivePreset(this); u=0; a=2; App.resetTimeline(); App.play(); };
    document.getElementById("k2").onclick = function(){ setActivePreset(this); u=10; a=-2; App.resetTimeline(); App.play(); };
    document.getElementById("k3").onclick = function(){ setActivePreset(this); u=20; a=-10; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var v = u + a*t;
    var x = u*t + 0.5*a*t*t;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="220" x2="680" y2="220" stroke="#334155" stroke-width="4"/>';
    var px = 80 + x * 4;
    if(px < 40) px = 40; if(px > 680) px = 680;
    m += '<circle cx="'+px+'" cy="210" r="12" fill="#38bdf8"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">v = u+at &nbsp; x = ut + ½at² &nbsp; v² = u² + 2ax</text>';
    svg.innerHTML = m;
    var check = u*u + 2*a*x;
    readout(cell("v", v.toFixed(2)+" m/s") + cell("x", x.toFixed(2)+" m") + cell("v² vs u²+2ax", v*v.toFixed(2)+" vs "+check.toFixed(2)));
    verdict("<b>Eq. 2.9 check:</b> the two sides of v² = u²+2ax agree while a is constant. They fail if you change a mid-run.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.falling = (function(){
  var mode = "roof";
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ball / ruler</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Ground / fingers</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="f-roof">Ex 2.3 roof (g=10, 5 s)</button>' +
      '<button class="preset-btn" id="f-ruler">Ex 2.7 ruler d=21 cm</button>';
    document.getElementById("f-roof").onclick = function(){ setActivePreset(this); mode="roof"; App.state.maxT=5; document.getElementById("time-scrubber").max=5; App.resetTimeline(); App.play(); };
    document.getElementById("f-ruler").onclick = function(){ setActivePreset(this); mode="ruler"; App.state.maxT=0.25; document.getElementById("time-scrubber").max=0.25; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="roof"){
      var y0=25, u=20, g=10;
      var y = y0 + u*t - 0.5*g*t*t;
      if(y<0) y=0;
      var py = 260 - y*4;
      m += '<rect x="200" y="40" width="18" height="220" fill="#1e293b"/>';
      m += '<line x1="160" y1="260" x2="560" y2="260" stroke="#f59e0b" stroke-width="4"/>';
      m += '<circle cx="280" cy="'+py+'" r="10" fill="#38bdf8"/>';
      m += '<text x="500" y="80" fill="#94a3b8" font-size="13">roof 25 m</text>';
      svg.innerHTML = m;
      readout(cell("t", t.toFixed(2)+" s") + cell("y (from ground)", y.toFixed(2)+" m") + cell("peak", "45 m at t=2 s"));
      verdict("<b>Example 2.3:</b> rises 20 m above the 25 m roof (peak 45 m), hits the ground at <b>5 s</b>. Quadratic 5t² − 20t − 25 = 0.");
    } else {
      var g=9.8, d=0.21, tr=Math.sqrt(2*d/g);
      var y = Math.min(0.5*g*t*t, d);
      var py = 60 + (y/d)*180;
      m += '<rect x="340" y="50" width="16" height="200" fill="#64748b"/>';
      m += '<rect x="340" y="'+py+'" width="16" height="24" fill="#38bdf8"/>';
      m += '<text x="400" y="80" fill="#94a3b8" font-size="13">catch gap</text>';
      svg.innerHTML = m;
      readout(cell("d", "0.21 m") + cell("t", t.toFixed(3)+" s") + cell("t_r = √(2d/g)", tr.toFixed(3)+" s ≈ 0.2 s"));
      verdict("<b>Example 2.7 (zoom p.9):</b> t_r = √(2×0.21/9.8) ≈ <b>0.207 s ≈ 0.2 s</b>.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.relvel = (function(){
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Police van 8.33 m/s</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f8fafc;"></span><span>Bullet 158.3 m/s ground</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Thief 53.3 m/s</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="r1">Ex 2.14 same direction</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var vVan=25/3, vTh=160/3, vB=150+25/3;
    var xVan=80+vVan*t*8, xTh=220+vTh*t*8, xB=80+vB*t*8;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="180" x2="700" y2="180" stroke="#334155" stroke-width="6"/>';
    m += '<rect x="'+xVan+'" y="150" width="50" height="22" fill="#38bdf8"/>';
    m += '<rect x="'+xTh+'" y="150" width="40" height="22" fill="#f59e0b"/>';
    m += '<circle cx="'+xB+'" cy="161" r="5" fill="#f8fafc"/>';
    svg.innerHTML = m;
    readout(cell("v_bullet,ground", vB.toFixed(2)+" m/s") + cell("v_thief", vTh.toFixed(2)+" m/s") + cell("v_rel", (vB-vTh).toFixed(2)+" m/s","#34d399"));
    verdict("<b>Ex 2.14:</b> muzzle 150 is relative to the van. Ground speed 150+8.33. Closing on the thief: 158.33−53.33 = <b>105 m s⁻¹</b>.");
  }
  return { mount: mount, draw: draw };
})();

// Source-faithful redraws of the exercise figures on NCERT PDF pp. 12–14.
window.FIGURES = {
  "2.9": '<svg viewBox="0 0 560 260" role="img" aria-label="Figure 2.9: position-time graphs for children A and B"><defs><marker id="a29" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#334155"/></marker></defs><path d="M90 220V28M90 220H500" stroke="#334155" stroke-width="2" marker-end="url(#a29)"/><path d="M90 220L450 80" stroke="#2563eb" stroke-width="4"/><path d="M235 220L355 42" stroke="#111827" stroke-width="4"/><path d="M80 150H100M80 95H100" stroke="#64748b" stroke-width="2"/><text x="62" y="154">P</text><text x="62" y="99">Q</text><text x="505" y="228">t</text><text x="76" y="25">x</text><text x="214" y="165" fill="#2563eb">A</text><text x="258" y="184">B</text><text x="84" y="239">O</text></svg>',
  "2.10": '<svg viewBox="0 0 700 360" role="img" aria-label="Figure 2.10: four impossible motion graphs"><g transform="translate(20 10)"><path d="M100 145V20M40 85H185" stroke="#334155" stroke-width="2"/><path d="M65 118C40 145 40 73 85 72C130 72 142 32 118 32C80 32 76 105 55 105" fill="none" stroke="#0ea5e9" stroke-width="4"/><text x="92" y="18">x</text><text x="188" y="90">t</text><text x="105" y="170">(a)</text></g><g transform="translate(340 10)"><path d="M100 145V20M40 85H185" stroke="#334155" stroke-width="2"/><circle cx="100" cy="85" r="44" fill="none" stroke="#0ea5e9" stroke-width="4"/><text x="90" y="18">v</text><text x="188" y="90">t</text><text x="105" y="170">(b)</text></g><g transform="translate(20 190)"><path d="M100 145V20M40 85H185" stroke="#334155" stroke-width="2"/><path d="M42 60C70 18 93 150 120 120S155 38 182 84" fill="none" stroke="#0ea5e9" stroke-width="4"/><text x="72" y="18">Speed</text><text x="188" y="90">t</text><text x="105" y="170">(c)</text></g><g transform="translate(340 190)"><path d="M100 145V20M40 145H185" stroke="#334155" stroke-width="2"/><path d="M42 145L95 55L145 145L185 95" fill="none" stroke="#0ea5e9" stroke-width="4"/><text x="67" y="18">Total path length</text><text x="188" y="150">t</text><text x="105" y="170">(d)</text></g></svg>',
  "2.11": '<svg viewBox="0 0 560 260" role="img" aria-label="Figure 2.11: rest for negative time followed by parabolic x-t motion"><path d="M255 225V30M80 185H500" stroke="#334155" stroke-width="2"/><path d="M80 185H255C330 185 405 142 438 55" fill="none" stroke="#0ea5e9" stroke-width="5"/><text x="240" y="250">0</text><text x="505" y="192">t</text><text x="240" y="28">x</text></svg>',
  "2.12": '<svg viewBox="0 0 780 270" role="img" aria-label="Figure 2.12: example position, velocity and acceleration graphs"><g transform="translate(10 5)"><path d="M125 220V30M20 150H240" stroke="#334155" stroke-width="2"/><path d="M22 150H92L125 120L180 165H235" fill="none" stroke="#0ea5e9" stroke-width="4"/><text x="102" y="114">A</text><text x="132" y="145">B</text><text x="112" y="28">x</text><text x="243" y="155">t</text><text x="125" y="250">(a)</text></g><g transform="translate(270 5)"><path d="M125 220V30M20 150H240" stroke="#334155" stroke-width="2"/><path d="M92 55L142 172M130 75L170 168M165 102L194 165M194 132L208 160" fill="none" stroke="#0ea5e9" stroke-width="4"/><text x="112" y="28">v</text><text x="243" y="155">t</text><text x="125" y="250">(b)</text></g><g transform="translate(530 5)"><path d="M125 220V30M20 150H240" stroke="#334155" stroke-width="2"/><path d="M22 150H86C101 150 104 55 125 55S149 150 165 150H235" fill="none" stroke="#0ea5e9" stroke-width="4"/><text x="112" y="28">a</text><text x="243" y="155">t</text><text x="125" y="250">(c)</text></g></svg>',
  "2.13": '<svg viewBox="0 0 640 260" role="img" aria-label="Figure 2.13: sinusoidal position-time graph"><path d="M282 225V25M55 130H590" stroke="#334155" stroke-width="2"/><path d="M90 130C105 164 118 185 138 185S171 151 186 130S215 75 234 75S267 109 282 130S311 185 330 185S363 151 378 130S407 75 426 75S459 109 474 130S503 185 522 185S555 151 570 130" fill="none" stroke="#0ea5e9" stroke-width="4"/><g fill="#475569"><text x="79" y="151">−2</text><text x="175" y="151">−1</text><text x="273" y="151">0</text><text x="371" y="151">1</text><text x="467" y="151">2</text><text x="563" y="151">3</text><text x="596" y="136">t</text><text x="267" y="23">x</text></g></svg>',
  "2.14": '<svg viewBox="0 0 560 300" role="img" aria-label="Figure 2.14: position-time curve across three equal intervals"><path d="M95 245V25M95 185H500" stroke="#334155" stroke-width="2"/><path d="M95 105C170 85 245 48 300 30C335 40 315 170 350 238C385 285 425 215 450 180" fill="none" stroke="#0ea5e9" stroke-width="5"/><path d="M185 88V185M280 37V185M375 248V185" stroke="#64748b" stroke-dasharray="5 5"/><text x="178" y="205">1</text><text x="273" y="205">2</text><text x="368" y="205">3</text><text x="505" y="192">t</text><text x="80" y="24">x</text></svg>',
  "2.15": '<svg viewBox="0 0 600 300" role="img" aria-label="Figure 2.15: smooth speed-time curve with points A B C and D"><path d="M85 250V25M85 250H545" stroke="#334155" stroke-width="2"/><path d="M88 225C170 225 220 190 260 95C285 45 315 65 335 150C350 215 390 220 420 125C450 28 485 38 505 95" fill="none" stroke="#0ea5e9" stroke-width="5"/><path d="M220 250V185M330 250V145M465 250V48" stroke="#64748b" stroke-dasharray="5 5"/><g fill="#334155"><text x="95" y="217">A</text><text x="272" y="72">B</text><text x="370" y="220">C</text><text x="466" y="35">D</text><text x="212" y="270">1</text><text x="322" y="270">2</text><text x="457" y="270">3</text><text x="550" y="258">t</text><text x="45" y="145" transform="rotate(-90 45 145)">Speed</text></g></svg>'
};

// Stable browser-fixture identifiers for every visible lab scenario.
Object.keys(window.SIMS).forEach(function(key){
  var sim = window.SIMS[key];
  if(!sim || typeof sim.mount !== "function") return;
  var originalMount = sim.mount;
  sim.mount = function(lesson){
    originalMount.call(sim, lesson);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn, index){
      if(!btn.dataset.preset) btn.dataset.preset = btn.id || (key + "-" + index);
    });
  };
});

// Semantic prediction aliases expected by the shared browser QA.
document.addEventListener("click", function(event){
  if(!event.target.closest("#btn-check-prediction")) return;
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  var chosen = document.querySelector('input[name="predict_ans"]:checked');
  if(!lesson || !chosen) return;
  document.querySelectorAll("#predict-options .predict-option").forEach(function(option, index){
    option.classList.toggle("is-answer", index === lesson.prediction.answer);
    option.classList.toggle("is-wrong", index === Number(chosen.value) && index !== lesson.prediction.answer);
  });
});

function normalizeChapterPresentation(){
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  var watch = document.getElementById("what-to-watch");
  if(lesson && watch && lesson.watch){
    var text = "What to watch: " + lesson.watch;
    if(watch.textContent !== text) watch.textContent = text;
  }
  document.querySelectorAll(".connect-grid").forEach(function(grid){
    var cards = Array.from(grid.querySelectorAll(":scope > .connect-card"));
    var explicitWow = cards.find(function(card){ var h = card.querySelector("h3"); return h && /^Wow/i.test(h.textContent.trim()); });
    if(!explicitWow) return;
    cards.forEach(function(card){
      if(card === explicitWow) return;
      card.classList.remove("wow"); card.removeAttribute("data-wow"); card.removeAttribute("data-source");
      var badge = card.querySelector(":scope > .wow-badge"); if(badge) badge.remove();
    });
  });
  window.CHAPTER.exercises.filter(function(ex){ return ex.figure; }).forEach(function(ex){
    var card = document.getElementById("exercise-q" + ex.number);
    if(!card || card.querySelector(".ex-figure") || !window.FIGURES[ex.figure]) return;
    if(ex.q !== undefined) card.id = "exercise-q" + ex.q;
    var question = card.querySelector(".exercise-question-text");
    var figure = document.createElement("div"); figure.className = "ex-figure";
    figure.innerHTML = window.FIGURES[ex.figure] + '<div style="font-size:12px;color:#64748b;text-align:center">Redrawn from NCERT Fig. ' + ex.figure + ' · PDF p.' + ex.page + '</div>';
    question.insertAdjacentElement("afterend", figure);
  });
}
var conceptView = document.getElementById("concept-view");
var revisionView = document.getElementById("revision-view");
if(conceptView) new MutationObserver(normalizeChapterPresentation).observe(conceptView, {childList:true, subtree:true});
if(revisionView) new MutationObserver(normalizeChapterPresentation).observe(revisionView, {childList:true, subtree:true});
normalizeChapterPresentation();
