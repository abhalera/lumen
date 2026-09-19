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

window.SIMS.pressuredepth = (function(){
  var H = 10;
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Swimmer / sensor</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>ρgh</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-lake">Example 9.2: 10 m lake</button>' +
      '<button class="preset-btn" id="p-ocean">Example 9.4: 1000 m ocean</button>' +
      '<button class="preset-btn" id="p-heel">Ex 9.5 high heel</button>';
    document.getElementById("p-lake").onclick = function(){ setActivePreset(this); H=10; App.resetTimeline(); App.play(); };
    document.getElementById("p-ocean").onclick = function(){ setActivePreset(this); H=1000; App.resetTimeline(); App.play(); };
    document.getElementById("p-heel").onclick = function(){ setActivePreset(this); H=-1; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(H < 0){
      var A = Math.PI*0.005*0.005;
      var P = 50*9.8/A;
      m += '<polygon points="340,40 380,40 365,220 355,220" fill="#94a3b8"/>';
      m += '<circle cx="360" cy="230" r="14" fill="#f59e0b"/>';
      m += '<text x="360" y="28" fill="#94a3b8" font-size="14" text-anchor="middle">50 kg on a 1.0 cm heel (Ex 9.5)</text>';
      svg.innerHTML = m;
      readout(cell("A", (A*1e4).toFixed(3)+" cm²") + cell("P", (P/1e6).toFixed(2)+" MPa", "#f87171"));
      verdict("<b>Ex 9.5:</b> P = mg/A = 6.24×10⁶ Pa. A high heel beats an elephant’s foot. Force is not pressure.");
      return;
    }
    var u = Math.min(1, t/8);
    var h = H*u;
    var rho = H>100 ? 1.03e3 : 1.00e3;
    var g = 10;
    var Pa = 1.01e5;
    var P = Pa + rho*g*h;
    m += '<rect x="80" y="40" width="200" height="220" fill="#0c4a6e"/>';
    var y = 40 + (h/H)*220;
    m += '<circle cx="180" cy="'+y+'" r="9" fill="#f8fafc"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14">P = P<sub>a</sub> + ρgh &nbsp; g = 10 m s⁻²</text>';
    svg.innerHTML = m;
    readout(cell("h", h.toFixed(0)+" m") + cell("absolute P", (P/1e5).toFixed(2)+" ×10⁵ Pa") + cell("gauge", ((P-Pa)/1e5).toFixed(2)+" ×10⁵ Pa", "#f59e0b"));
    if(H===10) verdict("<b>Example 9.2:</b> 10 m of lake water ≈ +1 atm. Absolute P ≈ 2.01×10⁵ Pa. Submarines at 1 km see ~100 atm extra.");
    else verdict("<b>Example 9.4:</b> 1000 m of sea water (ρ = 1.03×10³, g = 10) → gauge 1.03×10⁷ Pa ≈ 103 atm. Window force = P_g × 0.04 m² = 4.12×10⁵ N.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.pascal = (function(){
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Small piston</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Large piston / car</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-syr">Example 9.5 syringes 1:3</button>' +
      '<button class="preset-btn" id="p-car">Example 9.6 car lift 1:3</button>';
    var mode = "syr";
    document.getElementById("p-syr").onclick = function(){ setActivePreset(this); mode="syr"; App.resetTimeline(); App.play(); };
    document.getElementById("p-car").onclick = function(){ setActivePreset(this); mode="car"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    window.SIMS.pascal._m = function(){ return mode; };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var mode = (window.SIMS.pascal._m && window.SIMS.pascal._m()) || "syr";
    var u = Math.min(1, t/5);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="80" y="180" width="560" height="40" rx="6" fill="#1e3a5f"/>';
    var y1 = 180 - u*50;
    var y2 = 180 - u*50/9;
    m += '<rect x="140" y="'+y1+'" width="40" height="'+(180-y1)+'" fill="#38bdf8"/>';
    m += '<rect x="480" y="'+y2+'" width="120" height="'+(180-y2)+'" fill="#f59e0b"/>';
    if(mode==="car") m += '<rect x="500" y="'+(y2-28)+'" width="80" height="24" rx="4" fill="#94a3b8"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">F₂/F₁ = A₂/A₁ &nbsp; A₁ L₁ = A₂ L₂</text>';
    svg.innerHTML = m;
    if(mode==="syr"){
      readout(cell("F₁","10 N") + cell("F₂","90 N","#f59e0b") + cell("L₂", (6/9*u).toFixed(2)+" cm"));
      verdict("<b>Example 9.5:</b> diameters 1 cm and 3 cm ⇒ area ratio 9. 10 N becomes 90 N; 6.0 cm in becomes 0.67 cm out.");
    } else {
      readout(cell("m","1350 kg") + cell("F₁","1470 N") + cell("P","1.87×10⁵ Pa","#34d399"));
      verdict("<b>Example 9.6:</b> r₁ = 5 cm, r₂ = 15 cm. F₁ = Mg/9 = 1470 N. Air pressure ≈ 1.9 atm — almost double atmosphere.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.continuity = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Streamlines</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Particle</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pipe">Narrowing pipe Av = const</button>';
    document.getElementById("p-pipe").onclick = function(){ setActivePreset(this); App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<path d="M40,80 L280,80 L440,120 L680,120 L680,180 L440,180 L280,220 L40,220 Z" fill="#0c4a6e" stroke="#38bdf8"/>';
    var u = (t/6)%1;
    var x = 40 + u*640;
    var half = x<280 ? 70 : (x>440 ? 30 : 70 - (x-280)*40/160);
    m += '<circle cx="'+x+'" cy="150" r="6" fill="#f59e0b"/>';
    m += '<text x="360" y="28" fill="#94a3b8" font-size="14" text-anchor="middle">Av = constant — streamlines crowd, speed rises</text>';
    svg.innerHTML = m;
    var Arel = half/70;
    var vrel = 1/Arel;
    readout(cell("A / A₀", Arel.toFixed(2)) + cell("v / v₀", vrel.toFixed(2), "#f59e0b"));
    verdict("<b>Eq. 9.11:</b> incompressible steady flow. Narrow ⇒ fast. Bernoulli will then drop P in the throat (next lesson).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.bernoulli = (function(){
  var mode = "pipe";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>P + ½ρv²</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Manometer</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="b-pipe">Venturi / Fig. 9.9</button>' +
      '<button class="preset-btn" id="b-torr">Torricelli tank</button>' +
      '<button class="preset-btn" id="b-wing">Example 9.7 wing</button>';
    document.getElementById("b-pipe").onclick = function(){ setActivePreset(this); mode="pipe"; App.resetTimeline(); App.play(); };
    document.getElementById("b-torr").onclick = function(){ setActivePreset(this); mode="torr"; App.resetTimeline(); App.play(); };
    document.getElementById("b-wing").onclick = function(){ setActivePreset(this); mode="wing"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var u = Math.min(1, t/6);
    if(mode==="pipe"){
      m += '<path d="M40,90 L260,90 L400,130 L680,130 L680,170 L400,170 L260,210 L40,210 Z" fill="#0c4a6e" stroke="#38bdf8"/>';
      var h1 = 80, h2 = 40;
      m += '<rect x="120" y="'+(90-h1)+'" width="18" height="'+h1+'" fill="#f59e0b88"/>';
      m += '<rect x="500" y="'+(130-h2)+'" width="18" height="'+h2+'" fill="#f59e0b88"/>';
      m += '<text x="360" y="28" fill="#94a3b8" font-size="14" text-anchor="middle">wide: slow, high P &nbsp;|&nbsp; throat: fast, low P</text>';
      svg.innerHTML = m;
      readout(cell("Bernoulli","P + ½ρv² + ρgh") + cell("throat","low P, high v","#f59e0b"));
      verdict("<b>Eq. 9.13:</b> along a streamline the three terms trade. Viscosity would sap the far-side pressure (Points to Ponder 6).");
    } else if(mode==="torr"){
      var h = 120;
      m += '<rect x="120" y="40" width="160" height="200" fill="#0c4a6e"/>';
      var yHole = 40+200-h*u;
      m += '<circle cx="280" cy="'+yHole+'" r="6" fill="#38bdf8"/>';
      var xj = 280 + u*200;
      m += '<circle cx="'+xj+'" cy="'+(yHole+0.5*9.8*(u*0.6)*(u*0.6)*40)+'" r="5" fill="#f8fafc"/>';
      m += '<text x="360" y="28" fill="#94a3b8" font-size="14" text-anchor="middle">Torricelli: v = √(2gh) from an open tank</text>';
      svg.innerHTML = m;
      var v = Math.sqrt(2*9.8*2.0);
      readout(cell("h","open tank") + cell("v = √(2gh)", v.toFixed(2)+" m/s for h = 2 m"));
      verdict("<b>Eq. 9.15:</b> efflux speed equals free-fall speed through h. Rocket nozzles use the pressurised form Eq. (9.14) instead.");
    } else {
      m += '<path d="M80,160 Q 240,80 400,150 T 680,140" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<path d="M80,200 Q 240,210 400,200 T 680,200" fill="none" stroke="#64748b" stroke-width="2"/>';
      m += '<polygon points="200,150 480,130 500,170 220,190" fill="#334155" stroke="#f59e0b"/>';
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Example 9.7: 8% faster above the wing holds a Boeing</text>';
      svg.innerHTML = m;
      readout(cell("ΔP","6.5 kPa") + cell("(v₂−v₁)/v_av","≈ 8%","#34d399"));
      verdict("<b>Example 9.7:</b> ΔP = Mg/A = 6.5×10³ Pa. Dynamic lift, not a vacuum. Magnus on a cricket ball is the same physics.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.stokes = (function(){
  var a = 2e-3;
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sphere</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>v → v_t</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="s-cu">Example 9.9 copper in oil</button>' +
      '<button class="preset-btn" id="s-rain">Raindrop in air</button>';
    var mode = "cu";
    document.getElementById("s-cu").onclick = function(){ setActivePreset(this); mode="cu"; App.resetTimeline(); App.play(); };
    document.getElementById("s-rain").onclick = function(){ setActivePreset(this); mode="rain"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Radius a (mm)</span><span class="val" id="ctrl-a">2.0</span></div>' +
      '<input type="range" id="ctrl-a-range" min="0.4" max="4" step="0.2" value="2"></div>';
    document.getElementById("ctrl-a-range").oninput = function(){ draw(App.state.t); };
    window.SIMS.stokes._m = function(){ return mode; };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var mode = (window.SIMS.stokes._m && window.SIMS.stokes._m()) || "cu";
    var amm = Number(document.getElementById("ctrl-a-range").value);
    document.getElementById("ctrl-a").textContent = amm.toFixed(1);
    a = amm/1000;
    var g = 9.8, eta, rho, sig;
    if(mode==="cu"){ eta=0.99; rho=8.9e3; sig=1.5e3; }
    else { eta=1.8e-5; rho=1.0e3; sig=1.2; }
    var vt = 2*a*a*(rho-sig)*g/(9*eta);
    var tau = (2*rho*a*a)/(9*eta);
    var v = vt * (1 - Math.exp(-Math.max(t,0)/Math.max(tau,1e-3)));
    var y = 40 + Math.min(220, (v/Math.max(vt,1e-6))*t*8);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="280" y="30" width="160" height="240" fill="#0c4a6e55" stroke="#334155"/>';
    m += '<circle cx="360" cy="'+Math.min(250,y)+'" r="'+Math.max(6,amm*4)+'" fill="#38bdf8"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">F = 6πηav &nbsp; v_t = 2a²(ρ−σ)g/(9η)</text>';
    svg.innerHTML = m;
    readout(cell("v_t", vt.toFixed(3)+" m/s", "#34d399") + cell("v(t)", v.toFixed(3)+" m/s") + cell("a", amm.toFixed(1)+" mm"));
    if(mode==="cu") verdict("<b>Example 9.9:</b> a = 2.0 mm, v_t = 6.5 cm s⁻¹ → η_oil = 0.99 Pa s. Drag + buoyancy = weight at terminal speed.");
    else {
      var Re = sig*vt*2*a/eta;
      var flag = Re > 10 ? " Re ≈ " + Re.toExponential(1) + " ≫ 1, so Stokes overestimates here — a real " + amm.toFixed(1) + " mm drop falls only ~6 m/s (it flattens and sheds vortices)." : " Re ≈ " + Re.toFixed(1) + ": Stokes applies.";
      verdict("<b>Rain:</b> v_t ∝ a². A drizzle drop hangs; a cloudburst drop stings. Buoyancy of air is the −σ term in Eq. (9.18)." + flag);
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.capillary = (function(){
  var mode = "water";
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Meniscus</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>h</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c-w">Water in glass (rise)</button>' +
      '<button class="preset-btn" id="c-hg">Mercury (depression)</button>' +
      '<button class="preset-btn" id="c-bub">Example 9.10 bubble</button>';
    document.getElementById("c-w").onclick = function(){ setActivePreset(this); mode="water"; App.resetTimeline(); App.play(); };
    document.getElementById("c-hg").onclick = function(){ setActivePreset(this); mode="hg"; App.resetTimeline(); App.play(); };
    document.getElementById("c-bub").onclick = function(){ setActivePreset(this); mode="bub"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var u = Math.min(1, t/5);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="bub"){
      var r = 40;
      m += '<circle cx="360" cy="150" r="'+r+'" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">gas bubble in liquid: ΔP = 2S/r (one surface)</text>';
      svg.innerHTML = m;
      readout(cell("2S/r","146 Pa") + cell("P_i","1.02×10⁵ Pa"));
      verdict("<b>Example 9.10:</b> r = 1.00 mm, S = 7.30×10⁻², plus 8 cm of water. Soap bubble in air would be 4S/r.");
      return;
    }
    var S = mode==="water"? 0.073 : 0.435;
    var rho = mode==="water"? 1000 : 13600;
    var a = 5e-4;
    var cost = mode==="water"? 1 : -0.5;
    var h = 2*S*cost/(rho*9.8*a);
    var pix = Math.min(80, Math.abs(h)*2000)*u;
    m += '<rect x="80" y="200" width="560" height="40" fill="#1e3a5f"/>';
    m += '<rect x="340" y="40" width="24" height="200" fill="none" stroke="#94a3b8"/>';
    if(h>0){
      m += '<rect x="342" y="'+(200-pix)+'" width="20" height="'+pix+'" fill="#38bdf8"/>';
    } else {
      m += '<rect x="342" y="200" width="20" height="'+pix+'" fill="#64748b"/>';
    }
    m += '<text x="360" y="28" fill="#94a3b8" font-size="14" text-anchor="middle">h = 2S cosθ / (ρ g a)</text>';
    svg.innerHTML = m;
    readout(cell("h", (h*100).toFixed(2)+" cm", h>0?"#34d399":"#f87171") + cell("liquid", mode==="water"?"water":"mercury"));
    verdict(mode==="water"
      ? "<b>Eq. 9.29:</b> a = 0.05 cm of water rises ~3 cm (NCERT’s sample). Acute θ, concave meniscus, P just inside is lower."
      : "<b>Mercury:</b> obtuse θ, convex meniscus, column is depressed. Same formula, negative cos θ.");
  }
  return { mount: mount, draw: draw };
})();

// Browser QA identifies each scenario by data-preset. Keep these identifiers
// local to the chapter so every visible preset has a stable fixture key.
Object.keys(window.SIMS).forEach(function(key){
  var sim = window.SIMS[key];
  if(!sim || sim.mount._qaWrapped) return;
  var originalMount = sim.mount;
  sim.mount = function(lesson){
    var result = originalMount(lesson);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn){
      if(!btn.dataset.preset) btn.dataset.preset = btn.id;
    });
    return result;
  };
  sim.mount._qaWrapped = true;
});
// The shared browser fixture names the revealed prediction states explicitly.
// Add those semantic aliases after the existing chapter runtime evaluates a choice.
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

// Keep this chapter's presentation aligned with its data while the shared
// Class 11 runtime remains backward-compatible with older array connect cards.
function normalizeConceptPresentation(){
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  if(!lesson) return;
  var watch = document.getElementById("what-to-watch");
  var watchText = "What to watch: " + lesson.watch;
  if(watch && lesson.watch && watch.textContent !== watchText) watch.textContent = watchText;
  document.querySelectorAll(".connect-grid").forEach(function(grid){
    var cards = Array.from(grid.querySelectorAll(":scope > .connect-card"));
    var explicitWow = cards.find(function(card){
      var heading = card.querySelector("h3");
      return heading && /^Wow/i.test(heading.textContent.trim());
    });
    if(!explicitWow) return;
    cards.forEach(function(card){
      if(card === explicitWow) return;
      card.classList.remove("wow");
      card.removeAttribute("data-wow");
      card.removeAttribute("data-source");
      var badge = card.querySelector(":scope > .wow-badge");
      if(badge) badge.remove();
    });
  });
}
var conceptView = document.getElementById("concept-view");
if(conceptView){
  new MutationObserver(normalizeConceptPresentation).observe(conceptView, {childList: true, subtree: true});
  normalizeConceptPresentation();
}
