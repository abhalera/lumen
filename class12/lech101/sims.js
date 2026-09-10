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
function numEl(id, fallback){
  var n = document.getElementById(id);
  return n ? Number(n.value) : fallback;
}

window.SIMS.concunits = (function(){
  var preset = "glycol";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Solute particles</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Solvent</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-gly">Ex 1.1: 20% glycol</button>' +
      '<button class="preset-btn" id="p-naoh">Ex 1.2: 5 g NaOH / 450 mL</button>' +
      '<button class="preset-btn" id="p-hoac">Ex 1.3: 2.5 g HOAc / 75 g benzene</button>';
    document.getElementById("p-gly").onclick = function(){ setActivePreset(this); preset="glycol"; draw(App.state.t); };
    document.getElementById("p-naoh").onclick = function(){ setActivePreset(this); preset="naoh"; draw(App.state.t); };
    document.getElementById("p-hoac").onclick = function(){ setActivePreset(this); preset="hoac"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Mass % solute (glycol preset)</span><span class="val" id="ctrl-pct">20</span></div>' +
      '<input type="range" id="ctrl-pct-range" min="5" max="50" step="1" value="20"></div>';
    document.getElementById("ctrl-pct-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var pct = numEl("ctrl-pct-range", 20);
    var el = document.getElementById("ctrl-pct"); if(el) el.textContent = pct;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var nSol, nSolv, Msol, Msolv, label, Vlitre, massSolvKg;
    if(preset === "glycol"){
      Msol = 62; Msolv = 18;
      var wSol = pct, wSolv = 100 - pct;
      nSol = wSol / Msol; nSolv = wSolv / Msolv;
      massSolvKg = wSolv / 1000;
      Vlitre = 0.100;
      label = pct + "% w/w ethylene glycol in water (100 g batch)";
    } else if(preset === "naoh"){
      nSol = 5 / 40; nSolv = 0; Msol = 40; Vlitre = 0.450; massSolvKg = 0.445;
      label = "5 g NaOH in 450 mL solution — molarity (Example 1.2)";
    } else {
      nSol = 2.5 / 60; nSolv = 75 / 78; Vlitre = 0.086; massSolvKg = 0.075;
      label = "2.5 g CH₃COOH in 75 g benzene — molality (Example 1.3)";
    }
    var x = nSolv > 0 ? nSol / (nSol + nSolv) : 0;
    var molality = nSol / (massSolvKg || 1e-9);
    var molarity = nSol / Vlitre;
    var fill = 80 + Math.min(500, nSol * 80);
    m += '<rect x="80" y="70" width="200" height="180" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<rect x="90" y="' + (240 - fill * 0.25) + '" width="180" height="' + (fill * 0.25) + '" fill="#1e3a5f"/>';
    var nDots = Math.min(40, 6 + Math.floor(nSol * 30));
    for(var i=0;i<nDots;i++){
      var px = 110 + (i * 37 + t * 17) % 150;
      var py = 100 + (i * 19 + t * 11) % 130;
      m += '<circle cx="'+px+'" cy="'+py+'" r="4" fill="#38bdf8"/>';
    }
    m += '<text x="180" y="60" fill="#94a3b8" font-size="12" text-anchor="middle">Beaker</text>';
    m += '<text x="430" y="80" fill="#e2e8f0" font-size="14">' + label + '</text>';
    m += '<text x="430" y="110" fill="#38bdf8" font-size="13">n(solute) = ' + nSol.toFixed(3) + ' mol</text>';
    m += '<text x="430" y="132" fill="#94a3b8" font-size="13">x(solute) = ' + (preset==="naoh" ? "—" : x.toFixed(3)) + '</text>';
    m += '<text x="430" y="154" fill="#f59e0b" font-size="13">Molarity M = ' + molarity.toFixed(3) + ' mol L⁻¹</text>';
    m += '<text x="430" y="176" fill="#34d399" font-size="13">Molality m = ' + molality.toFixed(3) + ' mol kg⁻¹</text>';
    svg.innerHTML = m;
    readout(cell("x₂", preset==="naoh" ? "n/a" : x.toFixed(3), "#38bdf8") +
            cell("M", molarity.toFixed(3)+" M", "#f59e0b") +
            cell("m", molality.toFixed(3)+" mol kg⁻¹", "#34d399"));
    if(preset==="glycol") verdict("<b>Example 1.1:</b> at 20% w/w, x_glycol = 0.068 (not 0.20 — mole fraction is not mass %). Molarity changes if this flask is heated; molality does not.");
    else if(preset==="naoh") verdict("<b>Example 1.2:</b> 0.125 mol / 0.450 L = <b>0.278 M</b>. Volume (hence M) is T-dependent.");
    else verdict("<b>Example 1.3:</b> 0.0417 mol / 0.075 kg benzene = <b>0.556 mol kg⁻¹</b>. Molality is the colligative concentration.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.henrylaw = (function(){
  var gas = "N2";
  var KH = {N2: 76.48, O2: 34.86, He: 144.97, CO2: 1.67};
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Dissolved gas</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Headspace pressure</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-n2">Ex 1.4: N₂ in water</button>' +
      '<button class="preset-btn" id="p-soda">Intext 1.7: soda CO₂</button>' +
      '<button class="preset-btn" id="p-o2">Table 1.2: O₂ cold vs warm</button>';
    document.getElementById("p-n2").onclick = function(){ setActivePreset(this); gas="N2"; draw(App.state.t); };
    document.getElementById("p-soda").onclick = function(){ setActivePreset(this); gas="CO2"; var p=document.getElementById("ctrl-p-range"); if(p) p.value=2.5; draw(App.state.t); };
    document.getElementById("p-o2").onclick = function(){ setActivePreset(this); gas="O2"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>p / atm</span><span class="val" id="ctrl-p">0.99</span></div>' +
      '<input type="range" id="ctrl-p-range" min="0.2" max="10" step="0.1" value="0.99"></div>' +
      '<div class="control-item"><div class="control-label"><span>T / K</span><span class="val" id="ctrl-T">293</span></div>' +
      '<input type="range" id="ctrl-T-range" min="280" max="320" step="1" value="293"></div>';
    document.getElementById("ctrl-p-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-T-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var pAtm = numEl("ctrl-p-range", 0.99);
    var T = numEl("ctrl-T-range", 293);
    var pe = document.getElementById("ctrl-p"); if(pe) pe.textContent = pAtm.toFixed(2);
    var Te = document.getElementById("ctrl-T"); if(Te) Te.textContent = T.toFixed(0);
    var kh;
    if(gas==="CO2"){ kh = 1.67e3; } // kbar equivalent of 1.67e8 Pa ≈ 1.67 kbar
    else if(gas==="O2"){ kh = 34.86 * (1 + 0.03*(T-293)/10); }
    else if(gas==="He"){ kh = 144.97; }
    else { kh = 76.48 * (1 + 0.16*(T-293)/10); } // N2 76.48 → 88.84 from 293 to 303
    var pBar = pAtm * 1.013;
    var x = pBar / (kh * 1000);
    var n = x * 55.5;
    var mmol = n * 1000;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="80" y="120" width="220" height="140" rx="6" fill="#0f1f2e" stroke="#334155"/>';
    var h = Math.min(120, 20 + mmol * 40);
    m += '<rect x="90" y="'+(250-h)+'" width="200" height="'+h+'" fill="#164e63"/>';
    var bubbles = Math.min(18, 2 + Math.floor(pAtm * 2));
    for(var i=0;i<bubbles;i++){
      var bx = 110 + (i*23)%180;
      var by = 140 - (t*30 + i*17)%90;
      m += '<circle cx="'+bx+'" cy="'+by+'" r="'+(3+pAtm*0.4)+'" fill="none" stroke="#38bdf8"/>';
    }
    m += '<text x="190" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">p = K_H x   ·  Table 1.2 / Example 1.4</text>';
    m += '<text x="430" y="90" fill="#e2e8f0" font-size="14">Gas: '+gas+'</text>';
    m += '<text x="430" y="114" fill="#f59e0b" font-size="13">K_H ≈ '+kh.toFixed(2)+' kbar</text>';
    m += '<text x="430" y="138" fill="#38bdf8" font-size="13">x = p/K_H = '+x.toExponential(2)+'</text>';
    m += '<text x="430" y="162" fill="#34d399" font-size="13">n in 1 L water = '+mmol.toFixed(3)+' mmol</text>';
    svg.innerHTML = m;
    readout(cell("p", pBar.toFixed(3)+" bar") + cell("K_H", kh.toFixed(2)+" kbar", "#f59e0b") + cell("x", x.toExponential(2), "#38bdf8") + cell("n (1 L)", mmol.toFixed(3)+" mmol", "#34d399"));
    if(gas==="N2") verdict("<b>Example 1.4:</b> at 0.987 bar, K_H = 76.48 kbar, x = 1.29×10⁻⁵ and n = <b>0.716 mmol</b> in 1 L water. Higher K_H ⇒ lower solubility.");
    else if(gas==="CO2") verdict("<b>Intext 1.7:</b> soda at ~2.5 atm. x ≈ 1.5×10⁻³; 500 mL water holds ~1.85 g CO₂. Opening the cap drops p, so x must fall — fizz.");
    else verdict("<b>Table 1.2:</b> K_H(O₂) rises 34.86 → 46.82 kbar from 293 to 303 K. Fish are more comfortable in cold water because x = p/K_H falls as the lake warms.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.raoult = (function(){
  var mode = "AB";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>p_A = x_A p_A°</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>p_B = x_B p_B°</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>p_total</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ab">Intext 1.8: A + B</button>' +
      '<button class="preset-btn" id="p-hep">Ex 1.16: heptane + octane</button>';
    document.getElementById("p-ab").onclick = function(){ setActivePreset(this); mode="AB"; draw(App.state.t); };
    document.getElementById("p-hep").onclick = function(){ setActivePreset(this); mode="hep"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>x₂ (more volatile)</span><span class="val" id="ctrl-x">0.60</span></div>' +
      '<input type="range" id="ctrl-x-range" min="0" max="1" step="0.01" value="0.60"></div>';
    document.getElementById("ctrl-x-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var x2 = numEl("ctrl-x-range", 0.60);
    var el = document.getElementById("ctrl-x"); if(el) el.textContent = x2.toFixed(2);
    var p1s, p2s, unit, name1, name2;
    if(mode==="AB"){ p1s=450; p2s=700; unit="mm Hg"; name1="A"; name2="B"; }
    else { p1s=105.2; p2s=46.8; unit="kPa"; name1="heptane"; name2="octane"; }
    var x1 = 1 - x2;
    var p1 = x1 * p1s, p2 = x2 * p2s, pt = p1 + p2;
    var y1 = pt > 0 ? p1 / pt : 0;
    function X(x){ return 80 + x * 520; }
    function Y(p){ var pmax = Math.max(p1s, p2s) * 1.15; return 250 - (p / pmax) * 200; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="250" x2="640" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="40" stroke="#475569"/>';
    m += '<line x1="'+X(0)+'" y1="'+Y(p1s)+'" x2="'+X(1)+'" y2="'+Y(0)+'" stroke="#38bdf8" stroke-width="2"/>';
    m += '<line x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(1)+'" y2="'+Y(p2s)+'" stroke="#f59e0b" stroke-width="2"/>';
    m += '<line x1="'+X(0)+'" y1="'+Y(p1s)+'" x2="'+X(1)+'" y2="'+Y(p2s)+'" stroke="#34d399" stroke-width="3"/>';
    m += '<circle cx="'+X(x2)+'" cy="'+Y(pt)+'" r="6" fill="#f8fafc"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Raoult p–x · p_total = p₁° + (p₂° − p₁°) x₂  (Eq. 1.16)</text>';
    svg.innerHTML = m;
    readout(cell("x₂", x2.toFixed(2)) + cell("p₁", p1.toFixed(1)+" "+unit, "#38bdf8") + cell("p₂", p2.toFixed(1)+" "+unit, "#f59e0b") + cell("p_total", pt.toFixed(1)+" "+unit, "#34d399") + cell("y₁", y1.toFixed(2)));
    if(mode==="AB") verdict("<b>Intext 1.8:</b> at x_A = 0.40 (x_B = 0.60) p_total = 600 mm Hg. y_A = 0.30 — vapour is richer in more-volatile B. Drag x₂ to walk the green line.");
    else verdict("<b>Exercise 1.16:</b> 26 g heptane + 35 g octane → x_H = 0.459, p = 73.6 kPa at 373 K. Ideal: the green line is the whole law.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.deviation = (function(){
  var showExp = true;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Ideal p_total</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Ex 1.37 experimental</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-neg">Acetone–CHCl₃ (−)</button>' +
      '<button class="preset-btn" id="p-hide">Ideal line only</button>';
    document.getElementById("p-neg").onclick = function(){ setActivePreset(this); showExp=true; draw(App.state.t); };
    document.getElementById("p-hide").onclick = function(){ setActivePreset(this); showExp=false; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var xa = [0, 0.118, 0.234, 0.360, 0.508, 0.582, 0.645, 0.721, 1];
    var pa = [0, 54.9, 110.1, 202.4, 322.7, 405.9, 454.1, 521.1, 741.8];
    var pc = [632.8, 548.1, 469.4, 359.7, 257.7, 193.6, 161.2, 120.7, 0];
    function X(x){ return 80 + x * 520; }
    function Y(p){ return 260 - p / 800 * 210; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="260" x2="640" y2="260" stroke="#475569"/><line x1="80" y1="260" x2="80" y2="40" stroke="#475569"/>';
    m += '<line x1="'+X(0)+'" y1="'+Y(632.8)+'" x2="'+X(1)+'" y2="'+Y(741.8)+'" stroke="#34d399" stroke-width="2" stroke-dasharray="6 4"/>';
    if(showExp){
      var d = "";
      for(var i=0;i<xa.length;i++){
        d += (i===0?"M":"L") + " " + X(xa[i]) + " " + Y(pa[i]+pc[i]);
        m += '<circle cx="'+X(xa[i])+'" cy="'+Y(pa[i]+pc[i])+'" r="4" fill="#f87171"/>';
      }
      m += '<path d="'+d+'" fill="none" stroke="#f87171" stroke-width="2"/>';
    }
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Exercise 1.37 · 328 K · acetone–chloroform</text>';
    svg.innerHTML = m;
    var pId = 632.8 + (741.8-632.8)*0.508;
    var pEx = 322.7 + 257.7;
    readout(cell("x_acetone", "0.508") + cell("p_ideal", pId.toFixed(1)+" mm Hg", "#34d399") + cell("p_exp", pEx.toFixed(1)+" mm Hg", "#f87171"));
    verdict("<b>Negative deviation:</b> experimental p_total lies below the Raoult line because acetone carbonyl H-bonds to CHCl₃. Δ_mix H < 0 (Exercise 1.14).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.deltatb = (function(){
  var solute = "glucose";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pure water p–T</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Solution p–T</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-glu">Ex 1.7: 18 g glucose / 1 kg</button>' +
      '<button class="preset-btn" id="p-suc">Intext 1.10: sucrose → 100 °C</button>';
    document.getElementById("p-glu").onclick = function(){ setActivePreset(this); solute="glucose"; draw(App.state.t); };
    document.getElementById("p-suc").onclick = function(){ setActivePreset(this); solute="sucrose"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Mass of solute / g</span><span class="val" id="ctrl-w">18</span></div>' +
      '<input type="range" id="ctrl-w-range" min="0" max="200" step="1" value="18"></div>';
    document.getElementById("ctrl-w-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var w = numEl("ctrl-w-range", 18);
    var el = document.getElementById("ctrl-w"); if(el) el.textContent = w.toFixed(0);
    var M = solute === "glucose" ? 180 : 342;
    var Kb = 0.52;
    var m = (w / M) / 1.0;
    var dTb = Kb * m;
    var Tb = 373.15 + dTb;
    var fig = '<rect width="720" height="300" fill="#09131d"/>';
    fig += '<line x1="80" y1="250" x2="640" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="40" stroke="#475569"/>';
    fig += '<line x1="80" y1="80" x2="640" y2="80" stroke="#64748b" stroke-dasharray="4 4"/>';
    fig += '<text x="650" y="84" fill="#94a3b8" font-size="11">1.013 bar</text>';
    fig += '<path d="M 100 240 Q 280 200 400 80" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    var shift = Math.min(80, dTb * 200);
    fig += '<path d="M 100 240 Q 280 200 '+(400+shift)+' 80" fill="none" stroke="#f59e0b" stroke-width="2"/>';
    fig += '<circle cx="'+(400+shift)+'" cy="80" r="5" fill="#f8fafc"/>';
    fig += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 1.7 style · ΔT_b = K_b m · K_b(water) = 0.52 K kg mol⁻¹</text>';
    svg.innerHTML = fig;
    readout(cell("m", m.toFixed(3)+" mol kg⁻¹") + cell("ΔT_b", dTb.toFixed(3)+" K", "#f59e0b") + cell("T_b", Tb.toFixed(3)+" K", "#34d399"));
    if(solute==="glucose") verdict("<b>Example 1.7:</b> 18 g glucose in 1 kg water is 0.10 molal; ΔT_b = 0.52 × 0.10 = <b>0.052 K</b>. Water boils at 373.20 K, not 373.15 K.");
    else verdict("<b>Intext 1.10:</b> to raise T_b by 0.37 K (99.63 → 100 °C) need m = 0.712 mol kg⁻¹ sucrose in 500 g water = <b>121.67 g</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.osmosis = (function(){
  var mode = "fwd";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Solvent</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Solution</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-os">Osmosis (mango in brine)</button>' +
      '<button class="preset-btn" id="p-ro">Reverse osmosis (desalination)</button>' +
      '<button class="preset-btn" id="p-pi">Intext 1.12: polymer π</button>';
    document.getElementById("p-os").onclick = function(){ setActivePreset(this); mode="fwd"; App.resetTimeline(); App.play(); };
    document.getElementById("p-ro").onclick = function(){ setActivePreset(this); mode="ro"; App.resetTimeline(); App.play(); };
    document.getElementById("p-pi").onclick = function(){ setActivePreset(this); mode="pi"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>C / mol L⁻¹</span><span class="val" id="ctrl-c">0.20</span></div>' +
      '<input type="range" id="ctrl-c-range" min="0.01" max="1" step="0.01" value="0.20"></div>';
    document.getElementById("ctrl-c-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var C = numEl("ctrl-c-range", 0.20);
    var el = document.getElementById("ctrl-c"); if(el) el.textContent = C.toFixed(2);
    var pi = C * 0.083 * 298; // bar
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="80" y="60" width="240" height="180" fill="#0f1f2e" stroke="#334155"/>';
    m += '<rect x="320" y="60" width="240" height="180" fill="#1e293b" stroke="#334155"/>';
    m += '<rect x="312" y="60" width="16" height="180" fill="#475569"/>';
    var hL = mode==="ro" ? 90 + t*8 : 110 - t*6;
    var hR = mode==="ro" ? 150 - t*8 : 130 + t*6;
    m += '<rect x="90" y="'+(230-hL)+'" width="220" height="'+hL+'" fill="#164e63"/>';
    m += '<rect x="330" y="'+(230-hR)+'" width="220" height="'+hR+'" fill="#7c2d12"/>';
    var dir = mode==="ro" ? -1 : 1;
    m += '<polygon points="'+(360-dir*20)+',140 '+(360+dir*20)+',130 '+(360+dir*20)+',150" fill="#f8fafc"/>';
    m += '<text x="200" y="50" fill="#94a3b8" font-size="12" text-anchor="middle">solvent</text>';
    m += '<text x="440" y="50" fill="#f59e0b" font-size="12" text-anchor="middle">solution</text>';
    svg.innerHTML = m;
    readout(cell("C", C.toFixed(2)+" M") + cell("π (298 K)", pi.toFixed(2)+" bar", "#f59e0b") + cell("mode", mode==="ro"?"P > π":"osmosis"));
    if(mode==="pi") verdict("<b>Intext 1.12:</b> 1.0 g of M = 185000 g mol⁻¹ in 450 mL at 37 °C gives π = <b>30.96 Pa</b>. Osmotic pressure is the colligative of choice for polymers.");
    else if(mode==="ro") verdict("<b>Section 1.6.5:</b> apply P > π on the solution side and solvent is forced out through cellulose acetate — desalination. Seawater π ~ 30 bar.");
    else verdict("<b>Osmosis:</b> solvent flows into the solution until the hydrostatic head equals π = CRT. Raw mangoes shrivel in brine because water leaves the fruit.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.vanthoff = (function(){
  var kind = "kcl";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Formula units</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Free particles</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-kcl">KCl (n = 2)</button>' +
      '<button class="preset-btn" id="p-fa">Ex 1.33: CH₂FCOOH</button>' +
      '<button class="preset-btn" id="p-ca">Ex 1.40: CaCl₂ i = 2.47</button>';
    document.getElementById("p-kcl").onclick = function(){ setActivePreset(this); kind="kcl"; draw(App.state.t); };
    document.getElementById("p-fa").onclick = function(){ setActivePreset(this); kind="fa"; draw(App.state.t); };
    document.getElementById("p-ca").onclick = function(){ setActivePreset(this); kind="ca"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>α (degree of dissociation)</span><span class="val" id="ctrl-a">1.00</span></div>' +
      '<input type="range" id="ctrl-a-range" min="0" max="1" step="0.01" value="1"></div>';
    document.getElementById("ctrl-a-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var a = numEl("ctrl-a-range", 1);
    var el = document.getElementById("ctrl-a"); if(el) el.textContent = a.toFixed(2);
    var n = kind==="ca" ? 3 : 2;
    var i = 1 + (n - 1) * a;
    if(kind==="ca") i = 2.47;
    if(kind==="fa") { a = 0.075; i = 1.075; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var particles = Math.round(8 * i);
    for(var k=0;k<particles;k++){
      var px = 80 + (k % 8) * 70;
      var py = 80 + Math.floor(k / 8) * 70;
      m += '<circle cx="'+px+'" cy="'+py+'" r="16" fill="'+(k%2?"#38bdf8":"#f59e0b")+'" opacity="0.85"/>';
    }
    m += '<text x="500" y="80" fill="#e2e8f0" font-size="16">i = 1 + (n − 1)α</text>';
    m += '<text x="500" y="110" fill="#34d399" font-size="20">i = '+i.toFixed(3)+'</text>';
    m += '<text x="500" y="140" fill="#94a3b8" font-size="13">n = '+n+' ions / formula</text>';
    svg.innerHTML = m;
    var dTf = i * 1.86 * 0.50;
    readout(cell("α", (kind==="fa"?0.075:a).toFixed(3)) + cell("i", i.toFixed(3), "#34d399") + cell("ΔT_f (0.50 m water)", dTf.toFixed(3)+" K"));
    if(kind==="kcl") verdict("<b>Section 1.7:</b> 1 mol KCl in 1 kg water would raise T_b by 2 × 0.52 = <b>1.04 K</b> if fully ionised and interionic drag is ignored. Real i is a little less than 2.");
    else if(kind==="fa") verdict("<b>Exercise 1.33:</b> 19.5 g CH₂FCOOH in 500 g water, ΔT_f = 1.00 °C ⇒ i = 1.075, α = 0.075, K_a = 3.07 × 10⁻³.");
    else verdict("<b>Exercise 1.40:</b> CaCl₂ with measured i = 2.47 (not 3 — ion pairing). 3.42 g in 2.5 L gives π = 0.75 atm at 27 °C.");
  }
  return { mount: mount, draw: draw };
})();
