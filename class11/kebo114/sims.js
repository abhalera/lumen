// kebo114 interactive simulations: Breathing and Exchange of Gases (Ch. 14, print pp. 181-192)
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
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

// -------------------------------------------------------------------------
// 1. Animal Breathing Organs Bench (organlab) - L1, 14.1
// -------------------------------------------------------------------------
window.SIMS.organlab = (function(){
  var view = "ladder"; // "ladder", "skin", "tubes"
  var grp = 0, moist = 1;
  var GROUPS = [
    ["Sponges, flatworms", "diffusion over entire body surface"],
    ["Earthworm", "moist cuticle"],
    ["Insects", "tracheal tubes"],
    ["Aquatic arthropods, molluscs", "gills (branchial)"],
    ["Fishes", "gills"],
    ["Amphibians to mammals", "lungs (pulmonary)"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Exchange surface</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Air / water medium</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Selected group</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ladder">Organ Ladder</button>' +
      '<button class="preset-btn" id="p-skin">Skin Breathers</button>' +
      '<button class="preset-btn" id="p-tubes">Insect Tubes</button>';
    document.getElementById("p-ladder").onclick = function(){ setActivePreset(this); setV("ladder"); };
    document.getElementById("p-skin").onclick = function(){ setActivePreset(this); setV("skin"); };
    document.getElementById("p-tubes").onclick = function(){ setActivePreset(this); setV("tubes"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "ladder"){
      c.innerHTML =
        '<div class="control-group"><label>Animal group:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        GROUPS.map(function(g, i){ return '<button class="preset-btn" data-gr="' + i + '">' + g[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Habitats + organisation decide (PDF p. 3).</div></div>';
      c.querySelectorAll("[data-gr]").forEach(function(b){ b.onclick = function(){ grp = Number(b.dataset.gr); draw(0); }; });
    } else if(view === "skin"){
      c.innerHTML =
        '<div class="control-group"><label>Skin state:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-s0">Dry</button>' +
        '<button class="preset-btn" id="c-s1">Moist</button></div></div>' +
        '<div class="control-group"><label>Who:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Earthworm cuticle; frog skin (cutaneous).</div></div>';
      document.getElementById("c-s0").onclick = function(){ moist = 0; draw(0); };
      document.getElementById("c-s1").onclick = function(){ moist = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>System:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Network of tubes (tracheal tubes), PDF p. 3.</div></div>' +
        '<div class="control-group"><label>Note:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Air delivered within the body.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Respiratory Organs (\u00A714.1)</text>';
    if(view === "ladder"){
      var g = GROUPS[grp];
      for(var i = 0; i < GROUPS.length; i++){
        var y = 66 + i * 36;
        var on = i === grp;
        m += '<rect x="60" y="' + y + '" width="300" height="30" rx="6" fill="#0f172a" stroke="' + (on ? "#f59e0b" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="75" y="' + (y + 20) + '" fill="' + (on ? "#f59e0b" : "#94a3b8") + '" font-size="11" font-weight="700">' + GROUPS[i][0] + "</text>";
        m += '<text x="380" y="' + (y + 20) + '" fill="' + (on ? "#22c55e" : "#475569") + '" font-size="10">' + GROUPS[i][1] + "</text>";
      }
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">' + g[0] + ": " + g[1] + "</text>";
      readout(cell("Animal", g[0], "#f59e0b") + cell("Breathes", g[1], "#22c55e"));
      verdict("Habitat decides the organ.");
    } else if(view === "skin"){
      m += '<rect x="90" y="110" width="220" height="110" rx="8" fill="#0f172a" stroke="' + (moist ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="200" y="150" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Earthworm</text>';
      m += '<text x="200" y="172" fill="' + (moist ? "#22c55e" : "#475569") + '" font-size="11" text-anchor="middle">moist cuticle</text>';
      m += '<rect x="390" y="110" width="220" height="110" rx="8" fill="#0f172a" stroke="' + (moist ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="500" y="150" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Frog</text>';
      m += '<text x="500" y="172" fill="' + (moist ? "#22c55e" : "#475569") + '" font-size="11" text-anchor="middle">moist skin (cutaneous)</text>';
      if(moist){
        m += '<text x="350" y="250" fill="#22c55e" font-size="11" text-anchor="middle">O2 in \u2194 CO2 out across moist surfaces</text>';
      } else {
        m += '<text x="350" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">dry: no diffusion possible</text>';
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">Frog also uses lungs (pulmonary) — PDF p. 3</text>';
      readout(cell("Surface", moist ? "moist" : "dry", moist ? "#22c55e" : "#94a3b8") + cell("Mode", "cutaneous respiration", "#94a3b8"));
      verdict(moist ? "Moist surfaces breathe." : "Dry skin cannot exchange.");
    } else {
      m += '<line x1="350" y1="90" x2="350" y2="130" stroke="#38bdf8" stroke-width="3"/>';
      m += '<line x1="350" y1="130" x2="250" y2="200" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<line x1="350" y1="130" x2="450" y2="200" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<line x1="250" y1="200" x2="200" y2="250" stroke="#38bdf8" stroke-width="2"/>';
      m += '<line x1="250" y1="200" x2="300" y2="250" stroke="#38bdf8" stroke-width="2"/>';
      m += '<line x1="450" y1="200" x2="400" y2="250" stroke="#38bdf8" stroke-width="2"/>';
      m += '<line x1="450" y1="200" x2="500" y2="250" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="80" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Insect: network of tubes</text>';
      m += '<text x="350" y="282" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">tracheal tubes</text>';
      readout(cell("Animal", "Insect", "#38bdf8") + cell("Site", "tracheal tubes", "#22c55e"));
      verdict("Tubes carry air inward.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. Airway Path & Thorax Lab (tractlab) - L2, 14.1.1
// -------------------------------------------------------------------------
window.SIMS.tractlab = (function(){
  var view = "airway"; // "airway", "parts", "thorax"
  var part = 0;

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Conducting part</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Exchange part</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Thorax wall</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-airway">Airway Path</button>' +
      '<button class="preset-btn" id="p-parts">Two Parts</button>' +
      '<button class="preset-btn" id="p-thorax">Thorax Box</button>';
    document.getElementById("p-airway").onclick = function(){ setActivePreset(this); setV("airway"); };
    document.getElementById("p-parts").onclick = function(){ setActivePreset(this); setV("parts"); };
    document.getElementById("p-thorax").onclick = function(){ setActivePreset(this); setV("thorax"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "airway"){
      c.innerHTML =
        '<div class="control-group"><label>Map:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Nostrils \u2192 alveoli (Fig. 14.1).</div></div>' +
        '<div class="control-group"><label>Landmark:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Split at 5th thoracic vertebra.</div></div>';
    } else if(view === "parts"){
      c.innerHTML =
        '<div class="control-group"><label>Part:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-p0">Conducting</button>' +
        '<button class="preset-btn" id="c-p1">Exchange</button></div></div>' +
        '<div class="control-group"><label>Split:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Terminal bronchioles divide them.</div></div>';
      document.getElementById("c-p0").onclick = function(){ part = 0; draw(0); };
      document.getElementById("c-p1").onclick = function(){ part = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Chamber:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Air-tight; lungs follow the walls.</div></div>' +
        '<div class="control-group"><label>Pleura:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Double layered + fluid (PDF p. 4).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Human Tract (\u00A714.1.1)</text>';
    if(view === "airway"){
      var stops = ["nostrils", "nasal chamber", "pharynx", "larynx (sound box)", "trachea", "bronchi", "bronchioles", "alveoli"];
      for(var i = 0; i < stops.length; i++){
        var x = 48 + i * 76;
        m += '<rect x="' + x + '" y="150" width="68" height="44" rx="6" fill="#0f172a" stroke="' + (i >= 7 ? "#22c55e" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 34) + '" y="168" fill="#f8fafc" font-size="7.5" font-weight="700" text-anchor="middle">' + stops[i] + "</text>";
        m += '<text x="' + (x + 34) + '" y="182" fill="#64748b" font-size="7" text-anchor="middle">' + (i + 1) + "/8</text>";
        if(i < 7) m += '<text x="' + (x + 72) + '" y="177" fill="#64748b" font-size="12" text-anchor="middle">\u203A</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Trachea splits at 5th thoracic vertebra</text>';
      m += '<text x="350" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">epiglottis guards the glottis \u00B7 rings hold airways open</text>';
      readout(cell("Stops", "8 to alveoli", "#38bdf8") + cell("Voice", "sound box", "#94a3b8"));
      verdict("Nine stops to an alveolus.");
    } else if(view === "parts"){
      var cond = part === 0;
      m += '<rect x="90" y="100" width="240" height="130" rx="8" fill="#0f172a" stroke="' + (cond ? "#38bdf8" : "#334155") + '" stroke-width="2.5"/>';
      m += '<text x="210" y="135" fill="' + (cond ? "#38bdf8" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">Conducting</text>';
      m += '<text x="210" y="160" fill="#64748b" font-size="10" text-anchor="middle">transport \u00B7 clear</text>';
      m += '<text x="210" y="178" fill="#64748b" font-size="10" text-anchor="middle">humidify \u00B7 body temperature</text>';
      m += '<rect x="370" y="100" width="240" height="130" rx="8" fill="#0f172a" stroke="' + (!cond ? "#22c55e" : "#334155") + '" stroke-width="2.5"/>';
      m += '<text x="490" y="135" fill="' + (!cond ? "#22c55e" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">Exchange</text>';
      m += '<text x="490" y="160" fill="#64748b" font-size="10" text-anchor="middle">alveoli + ducts</text>';
      m += '<text x="490" y="178" fill="#64748b" font-size="10" text-anchor="middle">actual O2-CO2 diffusion</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + (cond ? "Conducting: clears foreign particles, warms air (PDF p. 5)" : "Exchange: site of actual diffusion (PDF p. 5)") + "</text>";
      readout(cell("Part", cond ? "conducting" : "exchange", cond ? "#38bdf8" : "#22c55e"));
      verdict(cond ? "Conditioning, not exchange." : "Diffusion happens here.");
    } else {
      m += '<rect x="170" y="80" width="360" height="180" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<text x="350" y="72" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">ribs (lateral) \u00B7 sternum (ventral)</text>';
      m += '<text x="120" y="175" fill="#f59e0b" font-size="10" text-anchor="middle">vertebral</text>';
      m += '<text x="580" y="175" fill="#f59e0b" font-size="10" text-anchor="middle">column</text>';
      m += '<ellipse cx="290" cy="170" rx="55" ry="65" fill="#0b1726" stroke="#38bdf8" stroke-width="2"/>';
      m += '<ellipse cx="410" cy="170" rx="55" ry="65" fill="#0b1726" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="175" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">lungs</text>';
      m += '<path d="M170,260 Q350,215 530,260" fill="none" stroke="#22c55e" stroke-width="3"/>';
      m += '<text x="350" y="285" fill="#22c55e" font-size="10" text-anchor="middle">dome-shaped diaphragm (floor)</text>';
      readout(cell("Chamber", "air-tight", "#f59e0b") + cell("Follows", "lungs track thorax", "#94a3b8"));
      verdict("Sealed box, movable walls.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();
// -------------------------------------------------------------------------
// 3. Inspiration-Expiration Pressure Lab (breathlab) - L3, 14.2
// -------------------------------------------------------------------------
window.SIMS.breathlab = (function(){
  var view = "inhale"; // "inhale", "exhale", "rate"
  var rate = 14;

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Volume up</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pressure down</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Resting rate</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-inhale">Inspiration</button>' +
      '<button class="preset-btn" id="p-exhale">Expiration</button>' +
      '<button class="preset-btn" id="p-rate">Rate & Spirometer</button>';
    document.getElementById("p-inhale").onclick = function(){ setActivePreset(this); setV("inhale"); };
    document.getElementById("p-exhale").onclick = function(){ setActivePreset(this); setV("exhale"); };
    document.getElementById("p-rate").onclick = function(){ setActivePreset(this); setV("rate"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "inhale"){
      c.innerHTML =
        '<div class="control-group"><label>Drivers:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Diaphragm (A-P) + external inter-costals (D-V).</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fig. 14.2a (PDF p. 6).</div></div>';
    } else if(view === "exhale"){
      c.innerHTML =
        '<div class="control-group"><label>Drivers:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Relaxation + recoil; abdomen for forced.</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fig. 14.2b (PDF p. 6).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Breaths/min:</label><input id="c-rt" type="range" min="12" max="16" value="' + rate + '" style="width:100%;margin-top:4px;"></div>' +
        '<div class="control-group"><label>Tool:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Spirometer: clinical volumes.</div></div>';
      document.getElementById("c-rt").oninput = function(){ rate = Number(this.value); draw(0); };
    }
  }

  function chest(down, ribsUp){
    var m = "";
    m += '<rect x="220" y="80" width="260" height="160" rx="10" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>';
    var w = ribsUp ? 260 : 220;
    var x0 = 350 - w / 2;
    m += '<rect x="' + x0 + '" y="95" width="' + w + '" height="120" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="2"/>';
    var dy = down ? 225 : 205;
    m += '<path d="M' + x0 + ',' + dy + ' Q350,' + (dy - 35) + ' ' + (x0 + w) + ',' + dy + '" fill="none" stroke="#22c55e" stroke-width="3"/>';
    m += '<text x="350" y="140" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">' + (ribsUp ? "ribs up (D-V up)" : "ribs rest") + "</text>";
    m += '<text x="350" y="252" fill="#22c55e" font-size="10" text-anchor="middle">' + (down ? "diaphragm flat (A-P up)" : "diaphragm domed") + "</text>";
    return m;
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Breathing (\u00A714.2)</text>';
    if(view === "inhale"){
      m += chest(true, true);
      m += '<text x="350" y="72" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">INSPIRATION: air flows in</text>';
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">antero-posterior + dorso-ventral expansion (Fig. 14.2a)</text>';
      readout(cell("Lung pressure", "below atmospheric", "#22c55e") + cell("Flow", "in", "#94a3b8"));
      verdict("Air flows in.");
    } else if(view === "exhale"){
      m += chest(false, false);
      m += '<text x="350" y="72" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">EXPIRATION: air flows out</text>';
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">relaxation + recoil shrinks the box (Fig. 14.2b)</text>';
      readout(cell("Lung pressure", "above atmospheric", "#38bdf8") + cell("Flow", "out", "#94a3b8"));
      verdict("Air flows out.");
    } else {
      m += '<text x="350" y="130" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">' + rate + " breaths/minute</text>";
      m += '<text x="350" y="165" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">healthy band: 12-16 times/minute</text>';
      m += '<rect x="200" y="195" width="300" height="40" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="220" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">spirometer: clinical volumes</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">abdomen strengthens forced breathing (PDF p. 6)</text>';
      readout(cell("Rate", rate + "/min", "#f59e0b") + cell("Tool", "spirometer", "#38bdf8"));
      verdict("Resting rhythm band.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Lung Volumes Adding Bench (volumelab) - L4, 14.2.1
// -------------------------------------------------------------------------
window.SIMS.volumelab = (function(){
  var view = "volumes"; // "volumes", "caps", "add"
  var cap = 3, pick = 2;
  var VOLS = [
    ["TV", "500", "tidal: normal breath"],
    ["IRV", "2500-3000", "forcible inspiration extra"],
    ["ERV", "1000-1100", "forcible expiration extra"],
    ["RV", "1100-1200", "left after forced out"]
  ];
  var CAPS = [
    ["IC", "TV + IRV", "3000-3500", "in after normal out"],
    ["EC", "TV + ERV", "1500-1600", "out after normal in"],
    ["FRC", "ERV + RV", "2100-2300", "left after normal out"],
    ["VC", "ERV + TV + IRV", "4000-4600", "max movable span"],
    ["TLC", "VC + RV", "5100-5800", "everything held"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Measured volume</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Added capacity</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Selected</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-volumes">Four Volumes</button>' +
      '<button class="preset-btn" id="p-caps">Five Capacities</button>' +
      '<button class="preset-btn" id="p-add">Capacity Adder</button>';
    document.getElementById("p-volumes").onclick = function(){ setActivePreset(this); setV("volumes"); };
    document.getElementById("p-caps").onclick = function(){ setActivePreset(this); setV("caps"); };
    document.getElementById("p-add").onclick = function(){ setActivePreset(this); setV("add"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "volumes"){
      c.innerHTML =
        '<div class="control-group"><label>Unit:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">mL; TV approx. 500 mL. (print).</div></div>' +
        '<div class="control-group"><label>Minute:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">6000 to 8000 mL per minute.</div></div>';
    } else if(view === "caps"){
      c.innerHTML =
        '<div class="control-group"><label>Capacity:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        CAPS.map(function(k, i){ return '<button class="preset-btn" data-cp="' + i + '">' + k[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Use:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Clinical diagnosis (PDF p. 7).</div></div>';
      c.querySelectorAll("[data-cp]").forEach(function(b){ b.onclick = function(){ cap = Number(b.dataset.cp); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Add up:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        CAPS.map(function(k, i){ return '<button class="preset-btn" data-ad="' + i + '">' + k[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Math:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Low ends add; high ends add.</div></div>';
      c.querySelectorAll("[data-ad]").forEach(function(b){ b.onclick = function(){ pick = Number(b.dataset.ad); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Volumes (\u00A714.2.1)</text>';
    if(view === "volumes"){
      var h = [40, 150, 70, 75];
      for(var i = 0; i < 4; i++){
        var x = 110 + i * 130;
        m += '<rect x="' + x + '" y="' + (230 - h[i]) + '" width="80" height="' + h[i] + '" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + (x + 40) + '" y="' + (222 - h[i]) + '" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">' + VOLS[i][1] + "</text>";
        m += '<text x="' + (x + 40) + '" y="250" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">' + VOLS[i][0] + "</text>";
        m += '<text x="' + (x + 40) + '" y="266" fill="#64748b" font-size="7.5" text-anchor="middle">' + VOLS[i][2] + "</text>";
      }
      m += '<text x="350" y="90" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">TV approx. 500 mL. \u00B7 all values in mL</text>';
      readout(cell("TV", "approx. 500 mL.", "#38bdf8") + cell("Minute", "6000 to 8000 mL", "#94a3b8"));
      verdict("Four volumes, one spirometer.");
    } else if(view === "caps"){
      var k = CAPS[cap];
      for(var j = 0; j < 5; j++){
        var y = 78 + j * 40;
        var on = j === cap;
        m += '<rect x="80" y="' + y + '" width="250" height="32" rx="6" fill="#0f172a" stroke="' + (on ? "#f59e0b" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="95" y="' + (y + 21) + '" fill="' + (on ? "#f59e0b" : "#94a3b8") + '" font-size="11" font-weight="700">' + CAPS[j][0] + " = " + CAPS[j][1] + "</text>";
        m += '<text x="560" y="' + (y + 21) + '" fill="' + (on ? "#22c55e" : "#475569") + '" font-size="11" text-anchor="middle">' + CAPS[j][2] + " mL</text>";
      }
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">' + k[0] + ": " + k[3] + " \u2014 " + k[2] + " mL</text>";
      readout(cell("Capacity", k[0] + " = " + k[1], "#f59e0b") + cell("Range", k[2] + " mL", "#22c55e"));
      verdict("Sums that diagnose.");
    } else {
      var p = CAPS[pick];
      m += '<text x="350" y="130" fill="#f8fafc" font-size="16" font-weight="700" text-anchor="middle">' + p[0] + " = " + p[1] + "</text>";
      m += '<text x="350" y="175" fill="#22c55e" font-size="15" font-weight="700" text-anchor="middle">' + p[2] + " mL</text>";
      m += '<text x="350" y="215" fill="#94a3b8" font-size="11" text-anchor="middle">' + p[3] + " (PDF p. 7)</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">VC from either end; TLC adds RV</text>';
      readout(cell("Sum", p[0] + " = " + p[1], "#22c55e") + cell("Totals", p[2] + " mL", "#94a3b8"));
      verdict(pick === 2 ? "Left after normal out." : "Added from volumes.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();
// -------------------------------------------------------------------------
// 5. Gradients & Diffusion Membrane Lab (exchangelab) - L5, 14.3
// -------------------------------------------------------------------------
window.SIMS.exchangelab = (function(){
  var view = "table"; // "table", "gradient", "membrane"
  var gas = 0;
  var O2ROW = ["159", "104", "40", "95", "40"];
  var CO2ROW = ["0.3", "40", "45", "40", "45"];
  var COLS = ["Air", "Alveoli", "Blood (deox)", "Blood (ox)", "Tissues"];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Oxygen path</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Carbon dioxide path</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Membrane</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-table">Table 14.1</button>' +
      '<button class="preset-btn" id="p-gradient">Gradients</button>' +
      '<button class="preset-btn" id="p-membrane">Membrane</button>';
    document.getElementById("p-table").onclick = function(){ setActivePreset(this); setV("table"); };
    document.getElementById("p-gradient").onclick = function(){ setActivePreset(this); setV("gradient"); };
    document.getElementById("p-membrane").onclick = function(){ setActivePreset(this); setV("membrane"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "table"){
      c.innerHTML =
        '<div class="control-group"><label>Units:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Partial pressures in mm Hg (PDF p. 7).</div></div>' +
        '<div class="control-group"><label>Map:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fig. 14.3: alveolus + tissues.</div></div>';
    } else if(view === "gradient"){
      c.innerHTML =
        '<div class="control-group"><label>Gas:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-g0">O2</button>' +
        '<button class="preset-btn" id="c-g1">CO2</button></div></div>' +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Diffusion runs down the gradient.</div></div>';
      document.getElementById("c-g0").onclick = function(){ gas = 0; draw(0); };
      document.getElementById("c-g1").onclick = function(){ gas = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Layers:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Epithelium + basement + endothelium.</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fig. 14.4 (PDF p. 8).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Exchange (\u00A714.3)</text>';
    if(view === "table"){
      for(var i = 0; i < 5; i++){
        var x = 110 + i * 100;
        m += '<text x="' + (x + 40) + '" y="100" fill="#94a3b8" font-size="9" font-weight="700" text-anchor="middle">' + COLS[i] + "</text>";
        m += '<rect x="' + x + '" y="115" width="80" height="44" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + (x + 40) + '" y="142" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">' + O2ROW[i] + "</text>";
        m += '<rect x="' + x + '" y="170" width="80" height="44" rx="6" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
        m += '<text x="' + (x + 40) + '" y="197" fill="#22c55e" font-size="14" font-weight="700" text-anchor="middle">' + CO2ROW[i] + "</text>";
      }
      m += '<text x="70" y="142" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">O2</text>';
      m += '<text x="70" y="197" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">CO2</text>';
      m += '<text x="350" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">Table 14.1 \u00B7 mm Hg \u00B7 air 159/0.3 vs alveoli 104/40</text>';
      readout(cell("Air O2", "159 mm Hg", "#38bdf8") + cell("Air CO2", "0.3 mm Hg", "#22c55e"));
      verdict("Read both gases at once.");
    } else if(view === "gradient"){
      var o2 = gas === 0;
      var nodes = o2 ? ["Alveoli 104", "Blood 40", "Tissues 40"] : ["Tissues 45", "Blood 45/40", "Alveoli 40"];
      for(var j = 0; j < 3; j++){
        var nx = 110 + j * 170;
        m += '<rect x="' + nx + '" width="140" y="140" height="60" rx="8" fill="#0f172a" stroke="' + (o2 ? "#38bdf8" : "#22c55e") + '" stroke-width="2"/>';
        m += '<text x="' + (nx + 70) + '" y="165" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">' + nodes[j].split(" ")[0] + "</text>";
        m += '<text x="' + (nx + 70) + '" y="185" fill="' + (o2 ? "#38bdf8" : "#22c55e") + '" font-size="12" font-weight="700" text-anchor="middle">' + nodes[j].split(" ")[1] + "</text>";
        if(j < 2) m += '<text x="' + (nx + 155) + '" y="175" fill="#64748b" font-size="20" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="110" fill="' + (o2 ? "#38bdf8" : "#22c55e") + '" font-size="13" font-weight="700" text-anchor="middle">' + (o2 ? "O2: alveoli to blood to tissues" : "CO2: tissues to blood to alveoli") + "</text>";
      m += '<text x="350" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">' + (o2 ? "104 down to 40 mm Hg (Table 14.1)" : "45 down to 40 mm Hg + 20-25x solubility") + "</text>";
      readout(cell("Gas", o2 ? "O2" : "CO2", o2 ? "#38bdf8" : "#22c55e") + cell("Runs", o2 ? "alveoli to blood" : "tissues to blood", "#94a3b8"));
      verdict("Down the gradient.");
    } else {
      var layers = ["squamous epithelium (alveoli)", "basement substance", "endothelium (capillary)"];
      for(var l = 0; l < 3; l++){
        var ly = 110 + l * 48;
        m += '<rect x="180" y="' + ly + '" width="340" height="40" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<text x="350" y="' + (ly + 25) + '" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">' + layers[l] + "</text>";
      }
      m += '<text x="350" y="90" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Diffusion membrane (Fig. 14.4)</text>';
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">total much less than a millimetre \u00B7 CO2 20-25x soluble</text>';
      readout(cell("Layers", "3", "#f59e0b") + cell("Thickness", "less than a millimetre", "#94a3b8"));
      verdict("Three layers, one crossing.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. O2 Curve & CO2 Ferries Lab (transportlab) - L6, 14.4-14.4.2
// -------------------------------------------------------------------------
window.SIMS.transportlab = (function(){
  var view = "oxygen"; // "oxygen", "curve", "carbon"
  var site = 0, route = 0;
  var SITES = [
    ["Alveoli", "high pO2, low pCO2, lesser H+, cooler", "oxyhaemoglobin forms"],
    ["Tissues", "low pO2, high pCO2, high H+, warmer", "oxygen dissociates"]
  ];
  var ROUTES = [
    ["Bicarbonate", "70%", "carbonic anhydrase both-ways"],
    ["Carbamino-haemoglobin", "20-25%", "follows pCO2, pO2 matters"],
    ["Dissolved in plasma", "7%", "carried dissolved"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Haemoglobin</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Oxygen</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Carbon dioxide</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-oxygen">O2 Loading</button>' +
      '<button class="preset-btn" id="p-curve">Sigmoid Curve</button>' +
      '<button class="preset-btn" id="p-carbon">CO2 Ferries</button>';
    document.getElementById("p-oxygen").onclick = function(){ setActivePreset(this); setV("oxygen"); };
    document.getElementById("p-curve").onclick = function(){ setActivePreset(this); setV("curve"); };
    document.getElementById("p-carbon").onclick = function(){ setActivePreset(this); setV("carbon"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "oxygen"){
      c.innerHTML =
        '<div class="control-group"><label>Site:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-t0">Alveoli</button>' +
        '<button class="preset-btn" id="c-t1">Tissues</button></div></div>' +
        '<div class="control-group"><label>Seats:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Four O2 per haemoglobin; 5 ml/100 ml.</div></div>';
      document.getElementById("c-t0").onclick = function(){ site = 0; draw(0); };
      document.getElementById("c-t1").onclick = function(){ site = 1; draw(0); };
    } else if(view === "curve"){
      c.innerHTML =
        '<div class="control-group"><label>Axes:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">% saturation vs pO2 (Fig. 14.5).</div></div>' +
        '<div class="control-group"><label>Shifts:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">pCO2, H+ studied on this curve.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Route:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        ROUTES.map(function(r, i){ return '<button class="preset-btn" data-rt="' + i + '">' + r[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Delivery:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">~4 ml CO2 per 100 ml blood.</div></div>';
      c.querySelectorAll("[data-rt]").forEach(function(b){ b.onclick = function(){ route = Number(b.dataset.rt); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Transport (\u00A714.4\u2013\u00A714.4.2)</text>';
    if(view === "oxygen"){
      var s = SITES[site];
      m += '<text x="350" y="110" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + s[0] + ": " + s[1] + "</text>";
      for(var i = 0; i < 4; i++){
        var filled = site === 0;
        m += '<rect x="' + (215 + i * 70) + '" y="150" width="56" height="56" rx="8" fill="#0f172a" stroke="' + (filled ? "#38bdf8" : "#334155") + '" stroke-width="2.5"/>';
        m += '<text x="' + (243 + i * 70) + '" y="184" fill="' + (filled ? "#38bdf8" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">O2</text>';
      }
      m += '<text x="350" y="250" fill="' + (site === 0 ? "#38bdf8" : "#f59e0b") + '" font-size="12" font-weight="700" text-anchor="middle">' + s[2] + "</text>";
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">97% by RBCs + 3% dissolved \u00B7 four molecules each</text>';
      readout(cell("Site", s[0], site === 0 ? "#38bdf8" : "#f59e0b") + cell("Result", site === 0 ? "oxyhaemoglobin" : "dissociation", "#94a3b8"));
      verdict(site === 0 ? "Loaded for travel." : "Released at tissues.");
    } else if(view === "curve"){
      m += '<line x1="150" y1="250" x2="580" y2="250" stroke="#64748b" stroke-width="1.5"/>';
      m += '<line x1="150" y1="250" x2="150" y2="80" stroke="#64748b" stroke-width="1.5"/>';
      m += '<text x="580" y="268" fill="#94a3b8" font-size="10" text-anchor="middle">pO2 (mm Hg)</text>';
      m += '<text x="70" y="165" fill="#94a3b8" font-size="10" text-anchor="middle">% saturation</text>';
      m += '<path d="M160,240 Q230,235 300,190 Q370,140 430,115 Q500,100 560,100" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<circle cx="300" cy="190" r="7" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/>';
      m += '<text x="300" y="172" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">tissues: unload</text>';
      m += '<circle cx="500" cy="103" r="7" fill="#22c55e" stroke="#0f172a" stroke-width="2"/>';
      m += '<text x="500" y="88" fill="#22c55e" font-size="10" font-weight="700" text-anchor="middle">alveoli: load</text>';
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">Oxygen dissociation curve: sigmoid (Fig. 14.5)</text>';
      readout(cell("Shape", "sigmoid", "#38bdf8") + cell("Plots", "saturation vs pO2", "#94a3b8"));
      verdict("Load high, release low.");
    } else {
      var r = ROUTES[route];
      for(var j = 0; j < 3; j++){
        var on = j === route;
        var ry = 100 + j * 52;
        m += '<rect x="150" y="' + ry + '" width="400" height="44" rx="8" fill="#0f172a" stroke="' + (on ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="170" y="' + (ry + 27) + '" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="11" font-weight="700">' + ROUTES[j][0] + " \u2014 " + ROUTES[j][1] + "</text>";
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">' + r[0] + ": " + r[2] + " (PDF p. 10)</text>";
      readout(cell("Route", r[0], "#22c55e") + cell("Share", r[1], "#94a3b8"));
      verdict(route === 0 ? "Mostly bicarbonate." : "A smaller ferry.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();
// -------------------------------------------------------------------------
// 7. Rhythm Centres & Disorders Lab (regulab) - L7, 14.5-14.6
// -------------------------------------------------------------------------
window.SIMS.regulab = (function(){
  var view = "rhythm"; // "rhythm", "chemo", "disorders"
  var co2 = 1, dis = 0;
  var DIS = [
    ["Asthma", "wheezing", "bronchi + bronchioles inflamed"],
    ["Emphysema", "surface lost", "alveolar walls damaged; smoking"],
    ["Occupational", "fibrosis", "grinding dust; wear masks"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Brain centre</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>CO2/H+ sensor</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Disorder</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-rhythm">Rhythm Centres</button>' +
      '<button class="preset-btn" id="p-chemo">CO2 Alarm</button>' +
      '<button class="preset-btn" id="p-disorders">Disorders</button>';
    document.getElementById("p-rhythm").onclick = function(){ setActivePreset(this); setV("rhythm"); };
    document.getElementById("p-chemo").onclick = function(){ setActivePreset(this); setV("chemo"); };
    document.getElementById("p-disorders").onclick = function(){ setActivePreset(this); setV("disorders"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "rhythm"){
      c.innerHTML =
        '<div class="control-group"><label>Chain:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Medulla sets; pons moderates (PDF p. 10).</div></div>' +
        '<div class="control-group"><label>O2 note:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Oxygen role: quite insignificant.</div></div>';
    } else if(view === "chemo"){
      c.innerHTML =
        '<div class="control-group"><label>Blood CO2:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-n0">Normal</button>' +
        '<button class="preset-btn" id="c-n1">Raised</button></div></div>' +
        '<div class="control-group"><label>Sensors:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Chemosensitive + aortic/carotid.</div></div>';
      document.getElementById("c-n0").onclick = function(){ co2 = 0; draw(0); };
      document.getElementById("c-n1").onclick = function(){ co2 = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Disorder:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        DIS.map(function(d, i){ return '<button class="preset-btn" data-ds="' + i + '">' + d[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Source:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">\u00A714.6 + Summary (PDF pp. 10-11).</div></div>';
      c.querySelectorAll("[data-ds]").forEach(function(b){ b.onclick = function(){ dis = Number(b.dataset.ds); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Regulation (\u00A714.5\u2013\u00A714.6)</text>';
    if(view === "rhythm"){
      m += '<rect x="120" y="120" width="200" height="90" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="220" y="155" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">medulla</text>';
      m += '<text x="220" y="178" fill="#94a3b8" font-size="10" text-anchor="middle">respiratory rhythm centre</text>';
      m += '<rect x="380" y="120" width="200" height="90" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="480" y="155" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">pons</text>';
      m += '<text x="480" y="178" fill="#94a3b8" font-size="10" text-anchor="middle">pneumotaxic centre</text>';
      m += '<line x1="320" y1="165" x2="380" y2="165" stroke="#64748b" stroke-width="2"/>';
      m += '<text x="350" y="155" fill="#64748b" font-size="9" text-anchor="middle">moderates</text>';
      m += '<text x="350" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">neural system tunes rhythm to tissue demand (PDF p. 10)</text>';
      readout(cell("Sets beat", "respiratory rhythm centre", "#38bdf8") + cell("Moderates", "pneumotaxic centre", "#94a3b8"));
      verdict("Medulla sets the beat.");
    } else if(view === "chemo"){
      m += '<rect x="120" y="110" width="200" height="90" rx="8" fill="#0f172a" stroke="' + (co2 ? "#22c55e" : "#334155") + '" stroke-width="2.5"/>';
      m += '<text x="220" y="148" fill="' + (co2 ? "#22c55e" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">chemosensitive area</text>';
      m += '<text x="220" y="170" fill="#64748b" font-size="10" text-anchor="middle">CO2 + H+ ' + (co2 ? "RAISED" : "normal") + "</text>";
      m += '<rect x="380" y="110" width="200" height="90" rx="8" fill="#0f172a" stroke="' + (co2 ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="480" y="148" fill="' + (co2 ? "#22c55e" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">aortic + carotid</text>';
      m += '<text x="480" y="170" fill="#64748b" font-size="10" text-anchor="middle">receptors ' + (co2 ? "firing" : "quiet") + "</text>";
      m += '<text x="350" y="250" fill="' + (co2 ? "#22c55e" : "#94a3b8") + '" font-size="12" font-weight="700" text-anchor="middle">' + (co2 ? "rhythm centre: breathe harder, clear CO2" : "rhythm steady") + "</text>";
      readout(cell("CO2/H+", co2 ? "raised" : "normal", co2 ? "#22c55e" : "#94a3b8") + cell("O2 role", "quite insignificant", "#94a3b8"));
      verdict(co2 ? "Breathe harder, clear CO2." : "All quiet.");
    } else {
      var d = DIS[dis];
      for(var i = 0; i < 3; i++){
        var on = i === dis;
        var dx = 90 + i * 180;
        m += '<rect x="' + dx + '" y="110" width="160" height="110" rx="8" fill="#0f172a" stroke="' + (on ? "#ef4444" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (dx + 80) + '" y="145" fill="' + (on ? "#ef4444" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">' + DIS[i][0] + "</text>";
        m += '<text x="' + (dx + 80) + '" y="168" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="10" font-weight="700" text-anchor="middle">' + DIS[i][1] + "</text>";
        m += '<text x="' + (dx + 80) + '" y="188" fill="#64748b" font-size="8" text-anchor="middle">' + DIS[i][2] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + d[0] + ": " + d[2] + "</text>";
      readout(cell("Disorder", d[0], "#ef4444") + cell("Marks", d[1], "#94a3b8"));
      verdict(dis === 0 ? "Inflamed airways." : dis === 1 ? "Walls break down." : "Dust scars lungs.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-113 -
// per-chapter only, no shared-script changes).
// -------------------------------------------------------------------------

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

// Keep this chapter's presentation aligned with its data.
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
}
var conceptView = document.getElementById("concept-view");
var revisionView = document.getElementById("revision-view");
if(conceptView) new MutationObserver(normalizeChapterPresentation).observe(conceptView, {childList:true, subtree:true});
if(revisionView) new MutationObserver(normalizeChapterPresentation).observe(revisionView, {childList:true, subtree:true});
normalizeChapterPresentation();
