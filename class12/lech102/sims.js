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
function numEl(id, fb){ var n = document.getElementById(id); return n ? Number(n.value) : fb; }

window.SIMS.daniell = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Zn anode (−)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Cu cathode (+)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dan">Daniell E° = 1.1 V</button>' +
      '<button class="preset-btn" id="p-znag">Ex 2.3: Zn | Ag⁺</button>';
    document.getElementById("p-dan").onclick = function(){ setActivePreset(this); mode="dan"; App.resetTimeline(); App.play(); };
    document.getElementById("p-znag").onclick = function(){ setActivePreset(this); mode="znag"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  var mode = "dan";
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="60" y="70" width="220" height="180" rx="8" fill="#1e293b" stroke="#64748b"/>';
    m += '<rect x="360" y="70" width="220" height="180" rx="8" fill="#1e293b" stroke="#64748b"/>';
    m += '<rect x="150" y="90" width="24" height="140" fill="#94a3b8"/>';
    m += '<rect x="470" y="90" width="24" height="140" fill="#f59e0b"/>';
    var e = 80 + (t/6)*200;
    m += '<path d="M 162 80 C 200 20, 440 20, 482 80" fill="none" stroke="#38bdf8" stroke-width="3"/>';
    m += '<circle cx="'+ (162 + (t/6)*320) +'" cy="'+(40 + 10*Math.sin(t*3))+'" r="5" fill="#e2e8f0"/>';
    m += '<text x="170" y="50" fill="#38bdf8" font-size="12">e⁻ →</text>';
    m += '<text x="170" y="270" fill="#94a3b8" font-size="12">Zn → Zn²⁺ + 2e⁻</text>';
    m += '<text x="400" y="270" fill="#f59e0b" font-size="12">'+(mode==="dan"?"Cu²⁺ + 2e⁻ → Cu":"Ag⁺ + e⁻ → Ag")+'</text>';
    svg.innerHTML = m;
    var E = mode==="dan" ? 1.10 : (0.80 - (-0.76));
    readout(cell("E°_cell", E.toFixed(2)+" V", "#34d399") + cell("anode", "Zn (−)") + cell("cathode", mode==="dan"?"Cu (+)":"Ag (+)"));
    if(mode==="dan") verdict("<b>Daniell cell:</b> Zn(s) + Cu²⁺ → Zn²⁺ + Cu(s), E° = 1.1 V. You cannot store CuSO₄ in a zinc pot (Intext 2.2) — this reaction eats the pot.");
    else verdict("<b>Exercise 2.3:</b> Zn | Zn²⁺ || Ag⁺ | Ag. Zinc is negative. Carriers: electrons in the wire, ions in the salt bridge.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.nernst = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>E vs log Q</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ex">Example 2.1 Mg–Ag</button>' +
      '<button class="preset-btn" id="p-in">Intext 2.5 Ni–Ag</button>' +
      '<button class="preset-btn" id="p-ph">Intext 2.4 SHE pH</button>';
    document.getElementById("p-ex").onclick = function(){ setActivePreset(this); kind="ex"; draw(App.state.t); };
    document.getElementById("p-in").onclick = function(){ setActivePreset(this); kind="in"; draw(App.state.t); };
    document.getElementById("p-ph").onclick = function(){ setActivePreset(this); kind="ph"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>log₁₀ Q (or pH)</span><span class="val" id="ctrl-q">7.11</span></div>' +
      '<input type="range" id="ctrl-q-range" min="-3" max="12" step="0.01" value="7.11"></div>';
    document.getElementById("ctrl-q-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  var kind = "ex";
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var lg = numEl("ctrl-q-range", 7.11);
    var el = document.getElementById("ctrl-q"); if(el) el.textContent = lg.toFixed(2);
    var E0, n, E, note;
    if(kind==="ex"){ E0=3.17; n=2; E = E0 - (0.059/n)*lg; note="Example 2.1: Q = 1.30×10⁷, E = 2.96 V"; }
    else if(kind==="in"){ E0=1.05; n=2; E = E0 - (0.059/n)*lg; note="Intext 2.5: Q = 4.00×10⁴, E = 0.91 V"; }
    else { E0=0; n=1; E = -0.059*lg; note="SHE: E = −0.059 pH. At pH 10, E = −0.59 V"; }
    function X(v){ return 80 + (v+3)/15 * 520; }
    function Y(e){ return 200 - e*40; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="200" x2="640" y2="200" stroke="#475569"/><line x1="80" y1="260" x2="80" y2="40" stroke="#475569"/>';
    var d="";
    for(var q=-3;q<=12;q+=0.2){
      var ee = (kind==="ph"?0:E0) - (0.059/(kind==="ph"?1:n))*q;
      d += (q===-3?"M":"L")+" "+X(q)+" "+Y(ee);
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="'+X(lg)+'" cy="'+Y(E)+'" r="6" fill="#f8fafc"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">E = E° − (0.059/n) log Q &nbsp;· 298 K</text>';
    svg.innerHTML = m;
    readout(cell("E°", E0.toFixed(2)+" V") + cell("n", String(n)) + cell("log Q", lg.toFixed(2)) + cell("E", E.toFixed(3)+" V", "#34d399"));
    verdict("<b>Nernst:</b> "+note+". Diluting products (smaller Q) raises E; the 59/n mV decade is the same slope a pH meter uses.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.gibbsk = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>spontaneous E° > 0</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dan">Example 2.3 Daniell</button>' +
      '<button class="preset-btn" id="p-fe">Intext 2.6 Fe³⁺/I⁻</button>';
    document.getElementById("p-dan").onclick = function(){ setActivePreset(this); kind="dan"; draw(); };
    document.getElementById("p-fe").onclick = function(){ setActivePreset(this); kind="fe"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>E° / V</span><span class="val" id="ctrl-e">1.10</span></div>' +
      '<input type="range" id="ctrl-e-range" min="0.05" max="3.2" step="0.01" value="1.10"></div>';
    document.getElementById("ctrl-e-range").oninput = function(){ draw(); };
    draw();
  }
  var kind = "dan";
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var E = numEl("ctrl-e-range", 1.10);
    var el = document.getElementById("ctrl-e"); if(el) el.textContent = E.toFixed(2);
    var n = 2;
    var dG = -n * 96487 * E / 1000;
    var logK = n * E / 0.059;
    var K = Math.pow(10, Math.min(logK, 300));
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="50" fill="#e2e8f0" font-size="18" text-anchor="middle">Δ<sub>r</sub>G° = −nFE° = '+dG.toFixed(2)+' kJ mol⁻¹</text>';
    m += '<text x="360" y="90" fill="#34d399" font-size="16" text-anchor="middle">log K = nE°/0.059 = '+logK.toFixed(2)+'</text>';
    m += '<text x="360" y="130" fill="#f59e0b" font-size="16" text-anchor="middle">K = 10^'+logK.toFixed(1)+'</text>';
    var bar = Math.min(500, Math.abs(dG)*2);
    m += '<rect x="110" y="180" width="'+bar+'" height="40" fill="#34d399" opacity="0.8"/>';
    m += '<text x="360" y="250" fill="#94a3b8" font-size="13" text-anchor="middle">'+(kind==="dan"?"Daniell n=2, book ΔG° = −212.27 kJ mol⁻¹":"Intext 2.6: ΔG° = −45.54 kJ mol⁻¹, K = 9.62×10⁷")+'</text>';
    svg.innerHTML = m;
    readout(cell("n","2") + cell("E°", E.toFixed(2)+" V") + cell("ΔG°", dG.toFixed(2)+" kJ mol⁻¹", "#34d399") + cell("K", logK>12 ? "10^"+logK.toFixed(1) : K.toExponential(2)));
    verdict("<b>Eqs. 2.14–2.15:</b> a 1.1 V cell with n = 2 already has K ~ 10³⁷ — the Daniell reaction goes to completion. 1 V·C = 1 J.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.conduct = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>κ</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Λ_m</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-kcl">Ex 2.8: 0.20 M KCl</button>' +
      '<button class="preset-btn" id="p-cell">Ex 2.9: cell constant</button>';
    document.getElementById("p-kcl").onclick = function(){ setActivePreset(this); kind="kcl"; draw(); };
    document.getElementById("p-cell").onclick = function(){ setActivePreset(this); kind="cell"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>c / mol L⁻¹</span><span class="val" id="ctrl-c">0.20</span></div>' +
      '<input type="range" id="ctrl-c-range" min="0.001" max="0.5" step="0.001" value="0.20"></div>';
    document.getElementById("ctrl-c-range").oninput = function(){ draw(); };
    draw();
  }
  var kind = "kcl";
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var c = numEl("ctrl-c-range", 0.20);
    var el = document.getElementById("ctrl-c"); if(el) el.textContent = c.toFixed(3);
    var kappa = 0.124 * c; // 0.20 M → 0.0248
    var Lm = kappa * 1000 / c;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    function X(cc){ return 80 + Math.sqrt(cc/0.5)*520; }
    var d1="", d2="";
    for(var cc=0.001; cc<=0.5; cc+=0.005){
      var k = 0.124*cc, L = k*1000/cc;
      d1 += (cc===0.001?"M":"L")+" "+X(cc)+" "+(250-k*4000);
      d2 += (cc===0.001?"M":"L")+" "+X(cc)+" "+(250-L*1.2);
    }
    m += '<path d="'+d1+'" fill="none" stroke="#f59e0b" stroke-width="2"/>';
    m += '<path d="'+d2+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="'+X(c)+'" cy="'+(250-kappa*4000)+'" r="5" fill="#f59e0b"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">κ falls on dilution; Λ_m = κ×1000/c rises</text>';
    svg.innerHTML = m;
    readout(cell("c", c.toFixed(3)+" M") + cell("κ", kappa.toFixed(4)+" S cm⁻¹", "#f59e0b") + cell("Λ_m", Lm.toFixed(1)+" S cm² mol⁻¹", "#38bdf8"));
    if(kind==="cell") verdict("<b>Exercise 2.9:</b> G* = κ R = 0.146×10⁻³ × 1500 = <b>0.219 cm⁻¹</b>. Cell constant is a hardware number, independent of the unknown solution.");
    else verdict("<b>Exercise 2.8:</b> 0.20 M KCl, κ = 0.0248 S cm⁻¹ ⇒ Λ_m = <b>124 S cm² mol⁻¹</b>. Intext 2.7: κ decreases with dilution because ions per cm³ fall.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.kohlrausch = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>strong (Kohlrausch line)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>weak acid (Ostwald rise)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-f">Intext 2.9 HCOOH</button>' +
      '<button class="preset-btn" id="p-ac">Ex 2.11 acetic acid</button>';
    document.getElementById("p-f").onclick = function(){ setActivePreset(this); kind="f"; draw(); };
    document.getElementById("p-ac").onclick = function(){ setActivePreset(this); kind="ac"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  var kind = "f";
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var L0, Lm, c, name;
    if(kind==="f"){ L0=404.2; Lm=46.1; c=0.025; name="HCOOH"; }
    else { L0=390.5; Lm=32.76; c=0.00241; name="CH₃COOH"; }
    var a = Lm/L0;
    var Ka = c*a*a/(1-a);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="50" fill="#e2e8f0" font-size="16" text-anchor="middle">'+name+'  Λ_m° = '+L0.toFixed(1)+' S cm² mol⁻¹</text>';
    m += '<text x="360" y="90" fill="#38bdf8" font-size="15" text-anchor="middle">α = Λ_m / Λ_m° = '+a.toFixed(4)+'</text>';
    m += '<text x="360" y="130" fill="#f59e0b" font-size="15" text-anchor="middle">K_a = c α² /(1−α) = '+Ka.toExponential(2)+'</text>';
    m += '<rect x="80" y="180" width="'+Math.min(560,a*2000)+'" height="36" fill="#34d399"/>';
    m += '<text x="360" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">Kohlrausch: Λ_m°(HA) = λ°(H⁺)+λ°(A⁻) from strong electrolytes</text>';
    svg.innerHTML = m;
    readout(cell("Λ_m", Lm.toFixed(2)) + cell("Λ_m°", L0.toFixed(1), "#38bdf8") + cell("α", a.toFixed(4), "#34d399") + cell("K_a", Ka.toExponential(2), "#f59e0b"));
    verdict(kind==="f"
      ? "<b>Intext 2.9:</b> λ°(H⁺)+λ°(HCOO⁻)=404.2; α = 0.114; K_a = 3.67×10⁻⁴."
      : "<b>Exercise 2.11:</b> Λ_m = 32.76; α = 0.0839; K_a = 1.85×10⁻⁵.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.faraday = (function(){
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>metal deposit</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ni">Ex 2.15 Ni 5 A, 20 min</button>' +
      '<button class="preset-btn" id="p-ser">Ex 2.16 series Ag/Cu/Zn</button>' +
      '<button class="preset-btn" id="p-cr">Intext 2.12 Cr₂O₇²⁻</button>';
    document.getElementById("p-ni").onclick = function(){ setActivePreset(this); kind="ni"; App.resetTimeline(); App.play(); };
    document.getElementById("p-ser").onclick = function(){ setActivePreset(this); kind="ser"; App.resetTimeline(); App.play(); };
    document.getElementById("p-cr").onclick = function(){ setActivePreset(this); kind="cr"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  var kind = "ni";
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var F = 96500;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(kind==="ni"){
      var Q = 5 * Math.min(t,6)/6 * 1200;
      var mass = Q / (2*F) * 58.7;
      m += '<rect x="200" y="60" width="80" height="180" fill="#334155"/>';
      m += '<rect x="210" y="'+(220-mass*40)+'" width="60" height="'+(mass*40)+'" fill="#a3e635"/>';
      m += '<text x="360" y="50" fill="#e2e8f0" font-size="14">Ni²⁺ + 2e⁻ → Ni &nbsp; Q = It</text>';
      readout(cell("I","5 A") + cell("t", (Math.min(t,6)/6*20).toFixed(1)+" min") + cell("Q", Q.toFixed(0)+" C") + cell("m(Ni)", mass.toFixed(3)+" g", "#a3e635"));
      verdict("<b>Exercise 2.15:</b> 5 A × 1200 s = 6000 C; n = 6000/(2×96500) = 0.0311 mol; m = <b>1.83 g</b> Ni.");
    } else if(kind==="ser"){
      var frac = Math.min(t,6)/6;
      var nF = 0.01343 * frac;
      m += '<text x="360" y="70" fill="#e2e8f0" font-size="14" text-anchor="middle">same Q through ZnSO₄ | AgNO₃ | CuSO₄</text>';
      m += '<text x="160" y="150" fill="#94a3b8">Ag '+(nF*108).toFixed(2)+' g</text>';
      m += '<text x="320" y="150" fill="#f59e0b">Cu '+((nF/2)*63.5).toFixed(3)+' g</text>';
      m += '<text x="480" y="150" fill="#38bdf8">Zn '+((nF/2)*65.4).toFixed(3)+' g</text>';
      readout(cell("Q", (nF*F).toFixed(0)+" C") + cell("t", (864*frac).toFixed(0)+" s") + cell("Ag", (nF*108).toFixed(2)+" g"));
      verdict("<b>Exercise 2.16:</b> 1.45 g Ag = 0.0134 F at 1.5 A takes 864 s; same Q deposits 0.426 g Cu and 0.439 g Zn.");
    } else {
      m += '<text x="360" y="80" fill="#e2e8f0" font-size="16" text-anchor="middle">Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H₂O</text>';
      m += '<text x="360" y="130" fill="#34d399" font-size="20" text-anchor="middle">Q = 6 F = 5.79 × 10⁵ C</text>';
      readout(cell("n_e","6 mol") + cell("Q", "579000 C", "#34d399"));
      verdict("<b>Intext 2.12:</b> six moles of electrons per mole of dichromate. Charge is conserved: 6 × 96500 C.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.corrosion = (function(){
  var mode = "rust";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>anodic pit (Fe → Fe²⁺)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>cathodic O₂ reduction</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-r">Rust cell E° = 1.67 V</button>' +
      '<button class="preset-btn" id="p-z">Sacrificial zinc</button>' +
      '<button class="preset-btn" id="p-pb">Lead–acid discharge</button>';
    document.getElementById("p-r").onclick = function(){ setActivePreset(this); mode="rust"; App.resetTimeline(); App.play(); };
    document.getElementById("p-z").onclick = function(){ setActivePreset(this); mode="zn"; App.resetTimeline(); App.play(); };
    document.getElementById("p-pb").onclick = function(){ setActivePreset(this); mode="pb"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="pb"){
      m += '<rect x="80" y="70" width="560" height="160" rx="8" fill="#1e293b" stroke="#64748b"/>';
      m += '<text x="360" y="120" fill="#e2e8f0" font-size="14" text-anchor="middle">Pb + PbO₂ + 2 H₂SO₄ → 2 PbSO₄ + 2 H₂O</text>';
      m += '<text x="360" y="160" fill="#34d399" font-size="13" text-anchor="middle">~2 V per cell · recharge is the reverse (Intext 2.13)</text>';
      readout(cell("E°","~2.0 V") + cell("n","2"));
      verdict("<b>Lead storage:</b> discharging consumes H₂SO₄ (density falls). Recharging restores Pb, PbO₂ and acid — Faraday in reverse.");
    } else {
      m += '<rect x="80" y="100" width="560" height="80" fill="#57534e"/>';
      var pit = 120 + t*15;
      m += '<ellipse cx="200" cy="140" rx="'+ (20+t*3) +'" ry="18" fill="#7f1d1d"/>';
      m += '<circle cx="480" cy="110" r="10" fill="#38bdf8" opacity="0.6"/>';
      m += '<text x="200" y="210" fill="#f87171" font-size="12" text-anchor="middle">anode  Fe → Fe²⁺ + 2e⁻</text>';
      m += '<text x="480" y="210" fill="#38bdf8" font-size="12" text-anchor="middle">cathode  O₂ + 4H⁺ + 4e⁻ → 2H₂O</text>';
      if(mode==="zn"){
        m += '<rect x="300" y="80" width="40" height="30" fill="#94a3b8"/>';
        m += '<text x="320" y="70" fill="#e2e8f0" font-size="11" text-anchor="middle">Zn sacrifice</text>';
      }
      readout(cell("E°_Fe","−0.44 V") + cell("E°_O₂","1.23 V") + cell("E°_cell","1.67 V", "#34d399"));
      verdict(mode==="zn"
        ? "<b>Section 2.8:</b> a Zn or Mg block oxidises in preference to iron (more negative E°). Howrah Bridge steel uses this trick."
        : "<b>Rust cell:</b> 2 Fe + O₂ + 4 H⁺ → 2 Fe²⁺ + 2 H₂O, E° = 1.67 V. Thermodynamically eager; kinetically slow — until a salt splash.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
