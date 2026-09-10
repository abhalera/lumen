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

window.SIMS.scales = (function(){
  var mode = "CF";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>t_C</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>t_F / T</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cf">Fig. 10.1 °C ↔ °F</button>' +
      '<button class="preset-btn" id="p-gas">Fig. 10.2 gas thermometer</button>';
    document.getElementById("p-cf").onclick = function(){ setActivePreset(this); mode="CF"; App.resetTimeline(); App.play(); };
    document.getElementById("p-gas").onclick = function(){ setActivePreset(this); mode="gas"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>t_C (°C)</span><span class="val" id="ctrl-t">20</span></div>' +
      '<input type="range" id="ctrl-t-range" min="-50" max="120" step="1" value="20"></div>';
    document.getElementById("ctrl-t-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var tC = Number(document.getElementById("ctrl-t-range").value);
    document.getElementById("ctrl-t").textContent = tC.toFixed(0);
    var tF = 1.8*tC + 32;
    var T = tC + 273.15;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="60" y1="250" x2="680" y2="250" stroke="#475569"/><line x1="60" y1="250" x2="60" y2="30" stroke="#475569"/>';
    if(mode==="CF"){
      function X(c){ return 60 + (c+50)*3.2; }
      function Y(f){ return 250 - (f+60)*0.7; }
      m += '<line x1="'+X(-50)+'" y1="'+Y(1.8*(-50)+32)+'" x2="'+X(120)+'" y2="'+Y(1.8*120+32)+'" stroke="#38bdf8" stroke-width="3"/>';
      m += '<circle cx="'+X(0)+'" cy="'+Y(32)+'" r="5" fill="#34d399"/>';
      m += '<circle cx="'+X(100)+'" cy="'+Y(212)+'" r="5" fill="#f87171"/>';
      m += '<circle cx="'+X(tC)+'" cy="'+Y(tF)+'" r="6" fill="#f8fafc"/>';
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Eq. 10.1: (t_F − 32)/180 = t_C/100</text>';
      svg.innerHTML = m;
      readout(cell("t_C", tC.toFixed(0)+" °C") + cell("t_F", tF.toFixed(1)+" °F", "#f59e0b") + cell("T", T.toFixed(2)+" K"));
      verdict("<b>Fig. 10.1:</b> ice point (0 °C, 32 °F), steam (100 °C, 212 °F). A 101 °F fever is 38.3 °C (Ex 10.16).");
    } else {
      function Xc(c){ return 80 + (c+280)*1.3; }
      function Yp(p){ return 250 - p*0.8; }
      m += '<line x1="'+Xc(-273.15)+'" y1="'+Yp(0)+'" x2="'+Xc(100)+'" y2="'+Yp(100*0.4)+'" stroke="#f59e0b" stroke-width="3"/>';
      m += '<circle cx="'+Xc(-273.15)+'" cy="'+Yp(0)+'" r="6" fill="#f87171"/>';
      m += '<text x="'+Xc(-273.15)+'" y="270" fill="#f87171" font-size="11">0 K</text>';
      m += '<circle cx="'+Xc(tC)+'" cy="'+Yp((tC+273.15)*0.12)+'" r="6" fill="#f8fafc"/>';
      svg.innerHTML = m;
      readout(cell("T", T.toFixed(2)+" K") + cell("absolute zero","−273.15 °C","#f87171"));
      verdict("<b>Figs. 10.2–10.4:</b> P ∝ T at constant V. Extrapolate to P = 0 → 0 K. Triple point of water is 273.16 K by choice.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.expansion = (function(){
  var mode = "rail";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Rod / ring</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Δℓ</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="e-rail">Steel rail (gap)</button>' +
      '<button class="preset-btn" id="e-ring">Example 10.2 iron tyre</button>' +
      '<button class="preset-btn" id="e-clamp">Clamped rail — thermal stress</button>';
    document.getElementById("e-rail").onclick = function(){ setActivePreset(this); mode="rail"; App.resetTimeline(); App.play(); };
    document.getElementById("e-ring").onclick = function(){ setActivePreset(this); mode="ring"; App.resetTimeline(); App.play(); };
    document.getElementById("e-clamp").onclick = function(){ setActivePreset(this); mode="clamp"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>ΔT (°C)</span><span class="val" id="ctrl-dT">20</span></div>' +
      '<input type="range" id="ctrl-dT-range" min="0" max="80" step="1" value="20"></div>';
    document.getElementById("ctrl-dT-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var dT = Number(document.getElementById("ctrl-dT-range").value);
    document.getElementById("ctrl-dT").textContent = dT.toFixed(0);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="ring"){
      var a = 1.20e-5;
      var L1 = 5.231, need = 5.243;
      var L = L1*(1+a*dT);
      var ok = L >= need;
      var r = 80 + dT*0.4;
      m += '<circle cx="360" cy="160" r="'+r+'" fill="none" stroke="#f59e0b" stroke-width="10"/>';
      m += '<circle cx="360" cy="160" r="90" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 4"/>';
      m += '<text x="360" y="32" fill="#94a3b8" font-size="14" text-anchor="middle">blacksmith’s iron tyre — Example 10.2</text>';
      svg.innerHTML = m;
      readout(cell("L", L.toFixed(4)+" m") + cell("rim","5.243 m") + cell("fit", ok?"YES at 218 °C":"too small","#34d399"));
      verdict("<b>Example 10.2:</b> 5.231 m → 5.243 m at α = 1.20×10⁻⁵ needs T₂ = 218 °C. A hole expands as if filled with the same material (Ex 10.8).");
    } else {
      var a = 1.2e-5, L = mode==="rail"? 12 : 5;
      var dL = L*a*dT;
      var w = 400 + dL*8000;
      m += '<rect x="80" y="140" width="'+Math.min(560,w)+'" height="28" fill="#38bdf8"/>';
      if(mode==="rail"){
        m += '<rect x="'+(80+Math.min(560,w))+'" y="140" width="'+Math.max(2, 24-dL*4000)+'" height="28" fill="#09131d" stroke="#f59e0b"/>';
      }
      m += '<text x="360" y="32" fill="#94a3b8" font-size="14" text-anchor="middle">Δℓ/ℓ = α ΔT &nbsp; α_steel = 1.2×10⁻⁵ K⁻¹</text>';
      svg.innerHTML = m;
      var F = 40e-4 * 2e11 * a * dT;
      readout(cell("Δℓ", (dL*1000).toFixed(2)+" mm") + (mode==="clamp"? cell("F", (F/1e5).toFixed(2)+" ×10⁵ N","#f87171") : cell("gap needed", (dL*1000).toFixed(2)+" mm")));
      verdict(mode==="clamp"
        ? "<b>Thermal stress:</b> F = AY α ΔT. NCERT’s 5 m, 40 cm² rail at +10 °C already carries ~10⁵ N — enough to bend a track without expansion gaps."
        : "<b>Indian Railway:</b> a 12 m rail over a 40 °C Delhi swing wants 5.8 mm of gap. Leave it, or the track buckles.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.calorimetry = (function(){
  var mode = "ex103";
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Hot</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cold / mix</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c-al">Example 10.3 Al sphere</button>' +
      '<button class="preset-btn" id="c-ice">Example 10.4 ice + water</button>' +
      '<button class="preset-btn" id="c-st">Example 10.5 ice → steam</button>';
    document.getElementById("c-al").onclick = function(){ setActivePreset(this); mode="ex103"; App.resetTimeline(); App.play(); };
    document.getElementById("c-ice").onclick = function(){ setActivePreset(this); mode="ex104"; App.resetTimeline(); App.play(); };
    document.getElementById("c-st").onclick = function(){ setActivePreset(this); mode="ex105"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var u = Math.min(1, t/8);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="ex103"){
      var T = 20 + 3*u;
      m += '<rect x="240" y="80" width="240" height="160" rx="12" fill="#1e3a5f" stroke="#38bdf8"/>';
      m += '<circle cx="360" cy="150" r="24" fill="#f59e0b"/>';
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">heat lost (Al) = heat gained (water + calorimeter)</text>';
      svg.innerHTML = m;
      readout(cell("T_mix", T.toFixed(1)+" °C") + cell("s_Al","0.911 kJ kg⁻¹ K⁻¹","#34d399"));
      verdict("<b>Example 10.3:</b> 0.047 kg Al at 100 °C into 0.25 kg water + 0.14 kg Cu at 20 °C → 23 °C. s_Al = 0.911 kJ kg⁻¹ K⁻¹.");
    } else if(mode==="ex104"){
      var Tf = 6.7*u;
      m += '<rect x="200" y="100" width="140" height="120" fill="#e0f2fe" opacity="0.3"/>';
      m += '<rect x="380" y="100" width="140" height="120" fill="#38bdf8" opacity="0.4"/>';
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">0.15 kg ice at 0 °C + 0.30 kg water at 50 °C</text>';
      svg.innerHTML = m;
      readout(cell("T_f", Tf.toFixed(1)+" °C") + cell("L_f","3.34×10⁵ J kg⁻¹"));
      verdict("<b>Example 10.4:</b> heat lost by water = m L_f + heat to warm the melt. L_f = 3.34×10⁵ J kg⁻¹, matching Table 10.5.");
    } else {
      var stages = ["ice −12→0","melt at 0","water 0→100","boil at 100"];
      var idx = Math.min(3, Math.floor(u*4));
      var Q = [0.076, 1.005, 1.256, 6.768];
      var acc = 0; for(var i=0;i<=idx;i++) acc += Q[i]*Math.min(1, u*4-i);
      m += '<rect x="80" y="200" width="'+(acc/9.1*560)+'" height="24" fill="#f59e0b"/>';
      m += '<text x="360" y="80" fill="#94a3b8" font-size="16" text-anchor="middle">'+stages[idx]+'</text>';
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Example 10.5: 3 kg ice at −12 °C → steam at 100 °C</text>';
      svg.innerHTML = m;
      readout(cell("Q so far", acc.toFixed(2)+" MJ") + cell("Q_total","9.1 MJ") + cell("stage", stages[idx]));
      verdict("<b>Example 10.5:</b> Q₁=76 kJ, Q₂=1.005 MJ, Q₃=1.256 MJ, Q₄=6.768 MJ. Latent heat of steam dominates — steam burns are worse.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.conduction = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Steel 300 °C</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Copper 0 °C</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="k-j">Example 10.6 junction</button>' +
      '<button class="preset-btn" id="k-box">Ex 10.17 thermacole box</button>';
    var mode = "j";
    document.getElementById("k-j").onclick = function(){ setActivePreset(this); mode="j"; App.resetTimeline(); App.play(); };
    document.getElementById("k-box").onclick = function(){ setActivePreset(this); mode="box"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    window.SIMS.conduction._m = function(){ return mode; };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var mode = (window.SIMS.conduction._m && window.SIMS.conduction._m()) || "j";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="j"){
      var T = 44.4 * Math.min(1, t/6) / Math.min(1, t/6 || 1);
      T = 44.4;
      m += '<rect x="80" y="120" width="280" height="60" fill="#b45309"/>';
      m += '<rect x="360" y="130" width="200" height="40" fill="#f59e0b"/>';
      m += '<text x="220" y="100" fill="#f87171">steel 300 °C</text>';
      m += '<text x="460" y="100" fill="#38bdf8">copper → 0 °C</text>';
      m += '<circle cx="360" cy="150" r="8" fill="#f8fafc"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">H = KAΔT/L  same through both rods</text>';
      svg.innerHTML = m;
      readout(cell("T_junction","44.4 °C","#f59e0b") + cell("K_steel","50.2") + cell("K_Cu","385"));
      verdict("<b>Example 10.6:</b> 50.2×2×(300−T)/15 = 385 T/10 → T = 44.4 °C. Almost all the drop lives in the steel.");
    } else {
      m += '<rect x="200" y="70" width="320" height="180" fill="none" stroke="#94a3b8" stroke-width="18"/>';
      m += '<rect x="230" y="100" width="260" height="120" fill="#e0f2fe22"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Ex 10.17: 30 cm thermacole cube, K = 0.01</text>';
      svg.innerHTML = m;
      readout(cell("Q in 6 h","1.05×10⁵ J") + cell("ice left","3.7 kg","#34d399"));
      verdict("<b>Ex 10.17:</b> H = KAΔT/L through six faces. 0.31 kg melts in 6 h at 45 °C outside — a Chennai tiffin box without a fridge.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.radiation = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>λ_m</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>spectrum</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="r-w">Wien: moon / Sun</button>' +
      '<button class="preset-btn" id="r-s">Stefan: tungsten 60 W</button>';
    var mode = "w";
    document.getElementById("r-w").onclick = function(){ setActivePreset(this); mode="w"; App.resetTimeline(); };
    document.getElementById("r-s").onclick = function(){ setActivePreset(this); mode="s"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>T (K)</span><span class="val" id="ctrl-T">3000</span></div>' +
      '<input type="range" id="ctrl-T-range" min="200" max="6000" step="50" value="3000"></div>';
    document.getElementById("ctrl-T-range").oninput = function(){ draw(App.state.t); };
    window.SIMS.radiation._m = function(){ return mode; };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var mode = (window.SIMS.radiation._m && window.SIMS.radiation._m()) || "w";
    var T = Number(document.getElementById("ctrl-T-range").value);
    document.getElementById("ctrl-T").textContent = T.toFixed(0);
    var lam = 2.9e-3 / T;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var peakX = 80 + Math.min(600, (lam*1e6)*40);
    var d = "";
    for(var i=0;i<=60;i++){
      var x = 80 + i*10;
      var l = (i+1)*0.1;
      var y = 250 - 180 * Math.exp(-Math.pow((l - lam*1e6)/Math.max(0.4,lam*1e6),2));
      d += (i===0?"M":"L")+" "+x+" "+y;
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<line x1="'+peakX+'" y1="40" x2="'+peakX+'" y2="250" stroke="#f59e0b" stroke-dasharray="4 3"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">λ_m T = 2.9×10⁻³ m K &nbsp;|&nbsp; H = eσA T⁴</text>';
    svg.innerHTML = m;
    var H = 0.3e-4 * 0.4 * 5.67e-8 * Math.pow(T,4);
    readout(cell("λ_m", (lam*1e6).toFixed(2)+" μm") + cell("T", T+" K") + cell("H (lamp)", H.toFixed(0)+" W"));
    verdict("<b>Eqs. 10.15–10.17:</b> moon 14 μm → ~200 K; Sun 4753 Å → 6060 K. A 0.3 cm² tungsten at 3000 K, e = 0.4, radiates 60 W.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.cooling = (function(){
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>T(t)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>T_s</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="n-pan">Example 10.8 pan</button>' +
      '<button class="preset-btn" id="n-ex">Ex 10.20 80→50 °C</button>';
    var mode = "pan";
    document.getElementById("n-pan").onclick = function(){ setActivePreset(this); mode="pan"; App.resetTimeline(); App.play(); };
    document.getElementById("n-ex").onclick = function(){ setActivePreset(this); mode="ex"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    window.SIMS.cooling._m = function(){ return mode; };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var mode = (window.SIMS.cooling._m && window.SIMS.cooling._m()) || "pan";
    var Ts = 20;
    var T0 = mode==="pan"? 94 : 80;
    var K = mode==="pan"? Math.log(70/62)/2 : Math.log(2)/5; // per minute
    var T = Ts + (T0-Ts)*Math.exp(-K * t);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="60" y1="250" x2="680" y2="250" stroke="#475569"/><line x1="60" y1="250" x2="60" y2="30" stroke="#475569"/>';
    function X(tt){ return 60 + tt*70; }
    function Y(temp){ return 250 - (temp-10)*2.2; }
    m += '<line x1="60" y1="'+Y(Ts)+'" x2="680" y2="'+Y(Ts)+'" stroke="#38bdf8" stroke-dasharray="6 4"/>';
    var d = "";
    for(var i=0;i<=80;i++){
      var tt = i/10;
      var Ti = Ts + (T0-Ts)*Math.exp(-K*tt);
      d += (i===0?"M":"L")+" "+X(tt)+" "+Y(Ti);
    }
    m += '<path d="'+d+'" fill="none" stroke="#f59e0b" stroke-width="3"/>';
    m += '<circle cx="'+X(t)+'" cy="'+Y(T)+'" r="6" fill="#f8fafc"/>';
    svg.innerHTML = m;
    readout(cell("T", T.toFixed(1)+" °C") + cell("T_s","20 °C") + cell("t", t.toFixed(1)+" min"));
    if(mode==="pan") verdict("<b>Example 10.8:</b> 94→86 °C in 2 min (excess 70 °C). 71→69 °C is excess 50 °C → 0.7 min = <b>42 s</b>. T(t) = T_s + C e^{−Kt}.");
    else verdict("<b>Ex 10.20:</b> ln((80−20)/(50−20)) = 5K ⇒ t for 60→30 °C is 10 min (Eq. 10.22). The drop is again 30 °C but the excess is smaller, so it takes longer.");
  }
  return { mount: mount, draw: draw };
})();
