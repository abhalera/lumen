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

window.SIMS.atoms = (function(){
  var mode = "solid";
  var rng = 1;
  function rnd(){ rng = (rng * 16807) % 2147483647; return rng / 2147483647; }
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Atom / molecule</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="a-s">Solid ~2 Å packing</button>' +
      '<button class="preset-btn" id="a-g">Gas: swarm + large free path</button>';
    document.getElementById("a-s").onclick = function(){ setActivePreset(this); mode="solid"; App.resetTimeline(); App.play(); };
    document.getElementById("a-g").onclick = function(){ setActivePreset(this); mode="gas"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    rng = 1234567;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "solid"){
      for(var i=0;i<8;i++) for(var j=0;j<4;j++){
        var x = 120 + i*60 + 4*Math.sin(t*3+i), y = 70 + j*50 + 4*Math.cos(t*3+j);
        m += '<circle cx="'+x+'" cy="'+y+'" r="14" fill="#38bdf8" opacity="0.85"/>';
      }
      readout(cell("spacing","~2 Å") + cell("motion","vibrate about sites") + cell("mean free path","~spacing"));
      verdict("<b>§12.2:</b> solids (and liquids) pack at a few ångströms. Neighbours rattle; they do not fly.");
    } else {
      for(var k=0;k<18;k++){
        var x = 40 + (rnd()*640 + t*80*(rnd()-0.3)*8)%640;
        var y = 40 + (rnd()*220 + t*40*(rnd()-0.5)*8)%220;
        m += '<circle cx="'+x+'" cy="'+y+'" r="5" fill="#f59e0b"/>';
      }
      readout(cell("gap","tens of Å") + cell("mean free path","thousands of Å") + cell("equilibrium","dynamic"));
      verdict("<b>§12.2:</b> a gas looks still. Molecules fly, collide, and reshuffle speeds. Only averages sit still.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.idealgas = (function(){
  var law = "boyle";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ideal PV = μRT</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Real-gas peel-off</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="g-b">Boyle: P vs 1/V</button>' +
      '<button class="preset-btn" id="g-c">Charles: V vs T</button>' +
      '<button class="preset-btn" id="g-s">STP molar volume 22.4 L</button>';
    document.getElementById("g-b").onclick = function(){ setActivePreset(this); law="boyle"; App.resetTimeline(); App.play(); };
    document.getElementById("g-c").onclick = function(){ setActivePreset(this); law="charles"; App.resetTimeline(); App.play(); };
    document.getElementById("g-s").onclick = function(){ setActivePreset(this); law="stp"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var f = Math.min(t/6,1);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="70" y1="250" x2="680" y2="250" stroke="#475569"/><line x1="70" y1="250" x2="70" y2="30" stroke="#475569"/>';
    if(law === "boyle"){
      var d="";
      for(var i=0;i<=30;i++){ var V=1.2+i*0.15; d += (i?"L":"M")+" "+(70+V*80)+" "+(250-180/V); }
      m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      var V = 1.5 + 3*f;
      m += '<circle cx="'+(70+V*80)+'" cy="'+(250-180/V)+'" r="6" fill="#f8fafc"/>';
      readout(cell("law","Boyle") + cell("PV","const at fixed T") + cell("V", V.toFixed(2)));
      verdict("<b>Eq. 12.6:</b> isotherms are rectangular hyperbolas. Real gases (Fig. 12.2) hug this at low P.");
    } else if(law === "charles"){
      m += '<line x1="70" y1="250" x2="620" y2="60" stroke="#38bdf8" stroke-width="3"/>';
      m += '<line x1="70" y1="250" x2="620" y2="90" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 4"/>';
      var x = 70 + 550*f;
      m += '<circle cx="'+x+'" cy="'+(250 - 190*f)+'" r="6" fill="#f8fafc"/>';
      readout(cell("law","Charles") + cell("V","∝ T at fixed P") + cell("dotted","ideal"));
      verdict("<b>Fig. 12.3:</b> CO₂ follows the dotted Charles line far from liquefaction and peels away near it.");
    } else {
      var V = 22.4*f;
      m += '<rect x="120" y="80" width="'+Math.max(8,V*12)+'" height="140" fill="#1e3a5f" stroke="#38bdf8"/>';
      m += '<text x="360" y="50" fill="#94a3b8" font-size="14" text-anchor="middle">1 mol of any ideal gas at 0 °C, 1 atm</text>';
      readout(cell("T","273 K") + cell("P","1 atm") + cell("V","22.4 L","#34d399"));
      verdict("<b>Ex 12.2:</b> V = RT/P = 8.31×273 / 1.013×10⁵ = 0.0224 m³ = 22.4 litres. Universal molar volume.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.pressure = (function(){
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Inbound molecule</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Wall</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="pr1">Fig 12.4 elastic bounce</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var cycle = (t % 1.6);
    var x = cycle < 0.8 ? 80 + cycle/0.8*430 : 510 - (cycle-0.8)/0.8*430;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="540" y="40" width="28" height="220" fill="#38bdf8"/>';
    m += '<text x="554" y="30" fill="#94a3b8" font-size="12" text-anchor="middle">wall</text>';
    m += '<circle cx="'+x+'" cy="150" r="12" fill="#f59e0b"/>';
    m += '<text x="x" y="0"></text>';
    var vx = cycle < 0.8 ? "+v_x" : "−v_x";
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Δp on wall = 2 m v_x per hit</text>';
    svg.innerHTML = m;
    readout(cell("v_x", vx) + cell("P","(1/3) n m ⟨v²⟩","#34d399"));
    verdict("<b>Eq. 12.14:</b> hit rate ∝ n A v_x, momentum per hit 2m v_x, isotropy ⟨v_x²⟩ = ⟨v²⟩/3. Shape of the box drops out.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.maxwell = (function(){
  var gas = "n2";
  function params(){
    if(gas==="he") return {M:4.0, name:"He", T:300};
    if(gas==="ar") return {M:39.9, name:"Ar", T:300};
    if(gas==="hot") return {M:28.0, name:"N₂ at 600 K", T:600};
    return {M:28.0, name:"N₂", T:300};
  }
  function vrms(p){ return Math.sqrt(3*8.314*p.T/(p.M*1e-3)); }
  function f(v, p){
    var a = p.M*1e-3/(2*8.314*p.T);
    return v*v*Math.exp(-a*v*v);
  }
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Speed distribution (shape)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>v_rms</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="m-n2">N₂ 300 K · 516 m/s</button>' +
      '<button class="preset-btn" id="m-he">He 300 K (lighter, faster)</button>' +
      '<button class="preset-btn" id="m-ar">Ar 300 K (heavier, slower)</button>' +
      '<button class="preset-btn" id="m-hot">N₂ 600 K (hotter, faster)</button>';
    document.getElementById("m-n2").onclick = function(){ setActivePreset(this); gas="n2"; App.resetTimeline(); };
    document.getElementById("m-he").onclick = function(){ setActivePreset(this); gas="he"; App.resetTimeline(); };
    document.getElementById("m-ar").onclick = function(){ setActivePreset(this); gas="ar"; App.resetTimeline(); };
    document.getElementById("m-hot").onclick = function(){ setActivePreset(this); gas="hot"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var p = params();
    var vr = vrms(p);
    var vmax = 2000;
    var d="", peak=0, vs=[];
    for(var i=0;i<=80;i++){
      var v = i*vmax/80;
      var y = f(v,p);
      vs.push(y); if(y>peak) peak=y;
    }
    for(var i=0;i<=80;i++){
      var v = i*vmax/80;
      var X = 70 + (v/vmax)*620;
      var Y = 250 - (vs[i]/(peak||1))*200;
      d += (i?"L":"M")+" "+X+" "+Y;
    }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="70" y1="250" x2="700" y2="250" stroke="#475569"/><line x1="70" y1="250" x2="70" y2="30" stroke="#475569"/>';
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="3"/>';
    var xr = 70 + (vr/vmax)*620;
    m += '<line x1="'+xr+'" y1="250" x2="'+xr+'" y2="40" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 4"/>';
    m += '<text x="'+xr+'" y="32" fill="#f59e0b" font-size="12" text-anchor="middle">v_rms</text>';
    m += '<text x="360" y="280" fill="#94a3b8" font-size="12" text-anchor="middle">speed (m/s) — this reprint uses ⟨v²⟩, not a numbered f(v)</text>';
    svg.innerHTML = m;
    readout(cell("gas", p.name) + cell("T", p.T+" K") + cell("v_rms", vr.toFixed(0)+" m/s","#f59e0b"));
    verdict("<b>Eq. 12.19:</b> v_rms = √(3RT/M). N₂ at 300 K is <b>516 m s⁻¹</b> in the text. Lighter or hotter shifts the curve right. Most-probable &lt; mean &lt; rms.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.equipart = (function(){
  var kind = "mono";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Translation</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Rotation</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Vibration (often frozen)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="e-m">Monatomic f = 3</button>' +
      '<button class="preset-btn" id="e-d">Diatomic room T f = 5</button>' +
      '<button class="preset-btn" id="e-v">Diatomic hot f = 7</button>';
    document.getElementById("e-m").onclick = function(){ setActivePreset(this); kind="mono"; App.resetTimeline(); };
    document.getElementById("e-d").onclick = function(){ setActivePreset(this); kind="di"; App.resetTimeline(); };
    document.getElementById("e-v").onclick = function(){ setActivePreset(this); kind="vib"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var f = kind==="mono"?3: kind==="di"?5:7;
    var Cv = f/2, Cp = Cv+1, g = Cp/Cv;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    function chip(x,y,label,color){
      return '<rect x="'+x+'" y="'+y+'" width="90" height="36" rx="6" fill="'+color+'"/><text x="'+(x+45)+'" y="'+(y+23)+'" fill="#0f172a" font-size="12" text-anchor="middle">'+label+'</text>';
    }
    m += chip(40,40,"v_x","#38bdf8")+chip(140,40,"v_y","#38bdf8")+chip(240,40,"v_z","#38bdf8");
    if(f>=5) m += chip(40,100,"ω_1","#f59e0b")+chip(140,100,"ω_2","#f59e0b");
    if(f>=7) m += chip(40,160,"½k q²","#34d399")+chip(140,160,"½μ q̇²","#34d399");
    m += '<text x="500" y="80" fill="#e2e8f0" font-size="16">f = '+f+'</text>';
    m += '<text x="500" y="120" fill="#94a3b8" font-size="14">C_v = '+(Cv)+' R</text>';
    m += '<text x="500" y="150" fill="#94a3b8" font-size="14">γ = '+g.toFixed(3)+'</text>';
    svg.innerHTML = m;
    readout(cell("f", String(f)) + cell("C_v", Cv+" R") + cell("γ", g.toFixed(3)));
    verdict("<b>Equipartition:</b> ½ k_B T per quadratic term. Vibration is two terms and is often frozen at room T — that is why air’s γ is 1.4, not 9/7.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.cvgas = (function(){
  var gas = "he";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Heat in at fixed V</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c-he">Ex 12.8 helium 374 J</button>' +
      '<button class="preset-btn" id="c-n2">Same flask of N₂ (diatomic)</button>';
    document.getElementById("c-he").onclick = function(){ setActivePreset(this); gas="he"; App.resetTimeline(); App.play(); };
    document.getElementById("c-n2").onclick = function(){ setActivePreset(this); gas="n2"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var f = Math.min(t/4,1);
    var Cv = gas==="he" ? 1.5 : 2.5;
    var Q = 2 * Cv * 8.31 * 15 * f;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="240" y="70" width="240" height="140" rx="8" fill="#1e3a5f" stroke="#38bdf8"/>';
    m += '<text x="360" y="140" fill="#e2e8f0" font-size="16" text-anchor="middle">44.8 L · 2 mol · ΔT = 15 K</text>';
    m += '<text x="360" y="50" fill="#94a3b8" font-size="14" text-anchor="middle">'+(gas==="he"?"He · C_v = 3R/2":"N₂ · C_v = 5R/2")+'</text>';
    svg.innerHTML = m;
    readout(cell("Q", Q.toFixed(0)+" J") + cell("full", (2*Cv*8.31*15).toFixed(0)+" J","#34d399"));
    verdict(gas==="he"
      ? "<b>Example 12.8:</b> Q = 2 × (3/2)R × 15 = 45 R = <b>374 J</b> at fixed volume."
      : "<b>Same μ, ΔT, V:</b> diatomic needs 5/3 times more heat (C_v = 5R/2) → 623 J.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.mfp = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Tagged molecule</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Collision cylinder</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="mf1">STP air ℓ ≈ 2.9×10⁻⁷ m</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var x = 80;
    var pts = [[80,150]];
    var rng = 7;
    function rnd(){ rng = (rng*1103515245+12345)%2147483648; return rng/2147483648; }
    var n = Math.floor(t*8)+1;
    for(var i=0;i<n;i++){
      x += 40;
      pts.push([80+40*(i+1), 60+180*rnd()]);
    }
    var d="M "+pts[0][0]+" "+pts[0][1];
    for(var i=1;i<pts.length;i++) d += " L "+pts[i][0]+" "+pts[i][1];
    m += '<path d="'+d+'" fill="none" stroke="#f59e0b" stroke-width="2"/>';
    m += '<circle cx="'+pts[pts.length-1][0]+'" cy="'+pts[pts.length-1][1]+'" r="6" fill="#f8fafc"/>';
    m += '<ellipse cx="200" cy="150" rx="70" ry="18" fill="none" stroke="#38bdf8" stroke-dasharray="4 3"/>';
    svg.innerHTML = m;
    readout(cell("ℓ STP","2.9×10⁻⁷ m") + cell("τ","6.1×10⁻¹⁰ s") + cell("ℓ / d","~1500"));
    verdict("<b>Eq. 12.40–12.41:</b> ℓ = 1/(√2 π n d²). Fast molecules, tiny steps: a smell random-walks across a kitchen.");
  }
  return { mount: mount, draw: draw };
})();
