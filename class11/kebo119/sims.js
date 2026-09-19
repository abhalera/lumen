// kebo119 interactive simulations: Chemical Coordination and Integration (Ch. 19, print pp. 239-252)
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
// 1. Hormone Messenger Lab (hormonelab) - L1, Introduction + 19.1-19.2
// -------------------------------------------------------------------------
window.SIMS.hormonelab = (function(){
  var view = "ductless"; // "ductless", "message", "map"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Neural</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Endocrine</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Glands</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ductless">Ductless Rule</button>' +
      '<button class="preset-btn" id="p-message">Trace Messengers</button>' +
      '<button class="preset-btn" id="p-map">Gland Map</button>';
    document.getElementById("p-ductless").onclick = function(){ setActivePreset(this); setV("ductless"); };
    document.getElementById("p-message").onclick = function(){ setActivePreset(this); setV("message"); };
    document.getElementById("p-map").onclick = function(){ setActivePreset(this); setV("map"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "ductless"){
      c.innerHTML =
        '<div class="control-group"><label>Neural:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Point-to-point, fast but short-lived (PDF p. 1).</div></div>' +
        '<div class="control-group"><label>Endocrine:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Ductless glands, hormones into blood (PDF p. 1).</div></div>';
    } else if(view === "message"){
      c.innerHTML =
        '<div class="control-group"><label>Definition:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Non-nutrient, intercellular messengers, trace amounts (PDF p. 1).</div></div>' +
        '<div class="control-group"><label>Reach:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Blood carries them to distantly located targets (PDF p. 1).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Organised:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Eight endocrine bodies, Figure 19.1 (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Others:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">GI tract, liver, kidney, heart also produce hormones (PDF p. 2).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Hormone messengers (§19.1)</text>';
    if(view === "ductless"){
      m += '<rect x="60" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="200" y="130" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">NEURAL SYSTEM</text>';
      m += '<text x="200" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">point-to-point connections</text>';
      m += '<text x="200" y="174" fill="#f8fafc" font-size="10" text-anchor="middle">fast but short-lived</text>';
      m += '<text x="200" y="196" fill="#94a3b8" font-size="9.5" text-anchor="middle">misses some cells</text>';
      m += '<rect x="360" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="500" y="130" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">ENDOCRINE SYSTEM</text>';
      m += '<text x="500" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">lack ducts, called ductless</text>';
      m += '<text x="500" y="174" fill="#f8fafc" font-size="10" text-anchor="middle">hormones into blood</text>';
      m += '<text x="500" y="196" fill="#94a3b8" font-size="9.5" text-anchor="middle">continuous regulation</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">jointly coordinate and regulate (PDF p. 1)</text>';
      readout(cell("Endocrine", "lack ducts, called ductless", "#22c55e") + cell("Neural", "fast but short-lived", "#38bdf8"));
      verdict("Ducts or blood — the gland decides.");
    } else if(view === "message"){
      var steps = ["non-nutrient chemicals", "intercellular messengers", "trace amounts"];
      for(var i = 0; i < 3; i++){
        var px = 60 + i * 200;
        m += '<rect x="' + px + '" y="110" width="180" height="90" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
        m += '<text x="' + (px + 90) + '" y="145" fill="#22c55e" font-size="10" font-weight="700" text-anchor="middle">' + steps[i] + "</text>";
        m += '<text x="' + (px + 90) + '" y="168" fill="#94a3b8" font-size="9" text-anchor="middle">' + (i === 0 ? "not food" : i === 1 ? "between cells" : "tiny quantities") + "</text>";
        if(i < 2) m += '<text x="' + (px + 190) + '" y="160" fill="#38bdf8" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">released into blood, distantly located target organ (PDF p. 1)</text>';
      readout(cell("Hormone", "intercellular messengers", "#22c55e") + cell("Amount", "produced in trace amounts", "#f59e0b"));
      verdict("Trace amounts, body-wide orders.");
    } else {
      var glands = ["pituitary", "pineal", "thyroid", "adrenal", "pancreas", "parathyroid", "thymus", "gonads"];
      for(var g = 0; g < 8; g++){
        var gx = 60 + (g % 4) * 150, gy = 90 + Math.floor(g / 4) * 90;
        m += '<rect x="' + gx + '" y="' + gy + '" width="135" height="70" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<text x="' + (gx + 67) + '" y="' + (gy + 30) + '" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">' + glands[g] + "</text>";
        m += '<text x="' + (gx + 67) + '" y="' + (gy + 50) + '" fill="#94a3b8" font-size="8.5" text-anchor="middle">Figure 19.1 map</text>';
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">plus diffused tissues/cells; GI tract, liver, kidney, heart (PDF p. 2)</text>';
      readout(cell("Organised bodies", "8 glands, Figure 19.1 map", "#f59e0b") + cell("Others", "GI, liver, kidney, heart", "#38bdf8"));
      verdict("Eight bodies, one system.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. Pituitary Command Lab (pitlab) - L2, 19.2.1-19.2.2
// -------------------------------------------------------------------------
window.SIMS.pitlab = (function(){
  var view = "portal"; // "portal", "anterior", "posterior"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Hypothalamus</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Anterior</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Posterior</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-portal">Two Routes</button>' +
      '<button class="preset-btn" id="p-anterior">Anterior Six</button>' +
      '<button class="preset-btn" id="p-posterior">Stored Pair</button>';
    document.getElementById("p-portal").onclick = function(){ setActivePreset(this); setV("portal"); };
    document.getElementById("p-anterior").onclick = function(){ setActivePreset(this); setV("anterior"); };
    document.getElementById("p-posterior").onclick = function(){ setActivePreset(this); setV("posterior"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "portal"){
      c.innerHTML =
        '<div class="control-group"><label>GnRH:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Releasing: stimulates gonadotrophins (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Somatostatin:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Inhibiting: blocks growth hormone (PDF p. 2).</div></div>';
    } else if(view === "anterior"){
      c.innerHTML =
        '<div class="control-group"><label>Pars distalis:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Six trophic hormones (PDF p. 3).</div></div>' +
        '<div class="control-group"><label>Pars intermedia:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">MSH only; merged in humans (PDF p. 3).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Made:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Synthesised by hypothalamus (PDF p. 3).</div></div>' +
        '<div class="control-group"><label>Released:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Transported axonally to pars nervosa (PDF p. 3).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Pituitary command (§19.2.1-19.2.2)</text>';
    if(view === "portal"){
      m += '<rect x="230" y="70" width="240" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="94" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">HYPOTHALAMUS</text>';
      m += '<text x="350" y="114" fill="#f8fafc" font-size="9.5" text-anchor="middle">GnRH (releasing) · somatostatin (inhibiting)</text>';
      m += '<rect x="80" y="170" width="250" height="100" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="205" y="196" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">ANTERIOR PITUITARY</text>';
      m += '<text x="205" y="218" fill="#f8fafc" font-size="10" text-anchor="middle">portal circulatory system</text>';
      m += '<text x="205" y="238" fill="#94a3b8" font-size="9" text-anchor="middle">regulates its functions</text>';
      m += '<rect x="370" y="170" width="250" height="100" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="495" y="196" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">POSTERIOR PITUITARY</text>';
      m += '<text x="495" y="218" fill="#f8fafc" font-size="10" text-anchor="middle">direct neural regulation</text>';
      m += '<text x="495" y="238" fill="#94a3b8" font-size="9" text-anchor="middle">axons from neurons</text>';
      m += '<text x="350" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">sella tursica, stalk, Figure 19.2 (PDF pp. 2-3)</text>';
      readout(cell("Anterior route", "portal circulatory system", "#22c55e") + cell("Posterior route", "direct neural regulation", "#f59e0b"));
      verdict("Portal to the front, nerves to the back.");
    } else if(view === "anterior"){
      var hormones = ["GH", "PRL", "TSH", "ACTH", "LH", "FSH"];
      var notes = ["growth", "milk", "thyroid", "cortex", "gonads", "gonads"];
      for(var i = 0; i < 6; i++){
        var px = 45 + i * 103;
        m += '<rect x="' + px + '" y="110" width="95" height="100" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
        m += '<text x="' + (px + 47) + '" y="145" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">' + hormones[i] + "</text>";
        m += '<text x="' + (px + 47) + '" y="168" fill="#f8fafc" font-size="9" text-anchor="middle">' + notes[i] + "</text>";
      }
      m += '<text x="350" y="248" fill="#f8fafc" font-size="10" text-anchor="middle">GH, PRL, TSH, ACTH, LH, FSH + MSH (pars intermedia)</text>';
      m += '<text x="350" y="270" fill="#94a3b8" font-size="10" text-anchor="middle">gigantism · dwarfism · Acromegaly (PDF p. 3)</text>';
      readout(cell("Pars distalis", "GH, PRL, TSH, ACTH, LH, FSH", "#22c55e") + cell("Intermedia", "MSH only", "#f59e0b"));
      verdict("Six trophic orders from pars distalis.");
    } else {
      m += '<rect x="80" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="205" y="140" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">OXYTOCIN</text>';
      m += '<text x="205" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">uterus at child birth</text>';
      m += '<text x="205" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">milk ejection</text>';
      m += '<text x="205" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">smooth muscles</text>';
      m += '<rect x="370" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="495" y="140" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">VASOPRESSIN (ADH)</text>';
      m += '<text x="495" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">resorption, distal tubules</text>';
      m += '<text x="495" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">less diuresis</text>';
      m += '<text x="495" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">anti-diuretic hormone</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">synthesised by hypothalamus, transported axonally (PDF p. 3)</text>';
      readout(cell("Oxytocin", "child birth, milk ejection", "#f59e0b") + cell("Vasopressin", "transported axonally, ADH", "#38bdf8"));
      verdict("Made upstairs, released downstairs.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 3. Metabolism and Calcium Lab (thyroidlab) - L3, 19.2.3-19.2.5
// -------------------------------------------------------------------------
window.SIMS.thyroidlab = (function(){
  var view = "pineal"; // "pineal", "thyroid", "calcium"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pineal</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Thyroid</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Parathyroid</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pineal">Pineal Clock</button>' +
      '<button class="preset-btn" id="p-thyroid">Thyroid & Iodine</button>' +
      '<button class="preset-btn" id="p-calcium">Calcium Pair</button>';
    document.getElementById("p-pineal").onclick = function(){ setActivePreset(this); setV("pineal"); };
    document.getElementById("p-thyroid").onclick = function(){ setActivePreset(this); setV("thyroid"); };
    document.getElementById("p-calcium").onclick = function(){ setActivePreset(this); setV("calcium"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "pineal"){
      c.innerHTML =
        '<div class="control-group"><label>Site:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Dorsal side of forebrain (PDF p. 4).</div></div>' +
        '<div class="control-group"><label>Hormone:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Melatonin, 24-hour rhythm (PDF p. 4).</div></div>';
    } else if(view === "thyroid"){
      c.innerHTML =
        '<div class="control-group"><label>Low iodine:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Hypothyroidism, goitre, cretinism (PDF p. 5).</div></div>' +
        '<div class="control-group"><label>High output:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Exopthalmic goitre, Graves disease (PDF p. 5).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>PTH:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Hypercalcemic: bone, kidney, food (PDF p. 5).</div></div>' +
        '<div class="control-group"><label>TCT:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Thyroid protein hormone, calcium balance (PDF p. 5).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Metabolism and calcium (§19.2.3-19.2.5)</text>';
    if(view === "pineal"){
      m += '<circle cx="350" cy="165" r="70" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="155" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">MELATONIN</text>';
      m += '<text x="350" y="178" fill="#f8fafc" font-size="10" text-anchor="middle">24-hour (diurnal) rhythm</text>';
      m += '<text x="150" y="120" fill="#f8fafc" font-size="10" text-anchor="middle">sleep-wake cycle</text>';
      m += '<text x="150" y="220" fill="#f8fafc" font-size="10" text-anchor="middle">body temperature</text>';
      m += '<text x="550" y="120" fill="#f8fafc" font-size="10" text-anchor="middle">metabolism</text>';
      m += '<text x="550" y="220" fill="#f8fafc" font-size="10" text-anchor="middle">defense capability</text>';
      m += '<text x="350" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">dorsal forebrain; menstrual cycle, pigmentation (PDF p. 4)</text>';
      readout(cell("Hormone", "melatonin, pineal", "#38bdf8") + cell("Rhythm", "sleep-wake cycle, 24-hour", "#22c55e"));
      verdict("Melatonin keeps the 24-hour rhythm.");
    } else if(view === "thyroid"){
      m += '<rect x="60" y="100" width="180" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="150" y="130" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">LOW IODINE</text>';
      m += '<text x="150" y="154" fill="#f8fafc" font-size="10" text-anchor="middle">hypothyroidism</text>';
      m += '<text x="150" y="174" fill="#f8fafc" font-size="10" text-anchor="middle">goitre</text>';
      m += '<text x="150" y="196" fill="#94a3b8" font-size="9" text-anchor="middle">cretinism in pregnancy</text>';
      m += '<rect x="260" y="100" width="180" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="350" y="130" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">NORMAL</text>';
      m += '<text x="350" y="154" fill="#f8fafc" font-size="10" text-anchor="middle">T4 + T3, basal metabolic</text>';
      m += '<text x="350" y="174" fill="#f8fafc" font-size="10" text-anchor="middle">rate, isthmus lobes</text>';
      m += '<text x="350" y="196" fill="#94a3b8" font-size="9" text-anchor="middle">follicles, trachea</text>';
      m += '<rect x="460" y="100" width="180" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="550" y="130" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">HIGH OUTPUT</text>';
      m += '<text x="550" y="154" fill="#f8fafc" font-size="10" text-anchor="middle">Exopthalmic goitre</text>';
      m += '<text x="550" y="174" fill="#f8fafc" font-size="10" text-anchor="middle">eyeballs protrude</text>';
      m += '<text x="550" y="196" fill="#94a3b8" font-size="9" text-anchor="middle">weight loss, Graves</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">iodine essential; Figure 19.3 (PDF pp. 4-5)</text>';
      readout(cell("Low iodine", "goitre, cretinism", "#38bdf8") + cell("High output", "Exopthalmic goitre", "#f59e0b"));
      verdict("Too little iodine swells, too much hormone races.");
    } else {
      m += '<rect x="80" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="205" y="140" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">PTH RAISES Ca2+</text>';
      m += '<text x="205" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">bone resorption</text>';
      m += '<text x="205" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">renal reabsorption</text>';
      m += '<text x="205" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">hypercalcemic hormone</text>';
      m += '<rect x="370" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="495" y="140" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">TCT STEADIES</text>';
      m += '<text x="495" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">thyrocalcitonin (TCT)</text>';
      m += '<text x="495" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">protein hormone</text>';
      m += '<text x="495" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">calcium balance</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">four parathyroids, back of thyroid (PDF p. 5)</text>';
      readout(cell("PTH", "hypercalcemic hormone", "#f59e0b") + cell("TCT", "calcium balance", "#22c55e"));
      verdict("PTH lifts calcium, TCT steadies it.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Stress and Immunity Lab (adrenalab) - L4, 19.2.6-19.2.7
// -------------------------------------------------------------------------
window.SIMS.adrenalab = (function(){
  var view = "thymus"; // "thymus", "medulla", "cortex"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Thymus</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Medulla</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Cortex</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-thymus">Thymus Trainer</button>' +
      '<button class="preset-btn" id="p-medulla">Emergency Surge</button>' +
      '<button class="preset-btn" id="p-cortex">Cortex Zones</button>';
    document.getElementById("p-thymus").onclick = function(){ setActivePreset(this); setV("thymus"); };
    document.getElementById("p-medulla").onclick = function(){ setActivePreset(this); setV("medulla"); };
    document.getElementById("p-cortex").onclick = function(){ setActivePreset(this); setV("cortex"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "thymus"){
      c.innerHTML =
        '<div class="control-group"><label>Young:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Thymosins differentiate T-lymphocytes (PDF p. 5).</div></div>' +
        '<div class="control-group"><label>Old:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Degenerated, immune responses weak (PDF p. 5).</div></div>';
    } else if(view === "medulla"){
      c.innerHTML =
        '<div class="control-group"><label>Trigger:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Stress of any kind, emergency (PDF p. 6).</div></div>' +
        '<div class="control-group"><label>Pair:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Adrenaline + noradrenaline, catecholamines (PDF p. 6).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Zones:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Reticularis, fasciculata, glomerulosa (PDF p. 7).</div></div>' +
        '<div class="control-group"><label>Low output:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Addison disease, weakness (PDF p. 6).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Stress and immunity (§19.2.6-19.2.7)</text>';
    if(view === "thymus"){
      m += '<rect x="80" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="205" y="140" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">YOUNG THYMUS</text>';
      m += '<text x="205" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">thymosins high</text>';
      m += '<text x="205" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">T-lymphocytes differentiated</text>';
      m += '<text x="205" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">cell-mediated immunity</text>';
      m += '<rect x="370" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#64748b" stroke-width="2"/>';
      m += '<text x="495" y="140" fill="#94a3b8" font-size="12" font-weight="700" text-anchor="middle">OLD THYMUS</text>';
      m += '<text x="495" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">degenerated, thymosins low</text>';
      m += '<text x="495" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">antibodies fewer</text>';
      m += '<text x="495" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">immune responses weak</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">lobular, behind sternum, ventral aorta (PDF p. 5)</text>';
      readout(cell("Thymosins", "cell-mediated immunity", "#22c55e") + cell("Old age", "immune responses weak", "#94a3b8"));
      verdict("Thymosins train T-cells, then fade.");
    } else if(view === "medulla"){
      var fx = ["alertness up", "pupilary dilation", "piloerection", "heart beat up", "respiration up", "glycogen broken"];
      for(var i = 0; i < 6; i++){
        var px = 45 + (i % 3) * 205, py = 100 + Math.floor(i / 3) * 90;
        m += '<rect x="' + px + '" y="' + py + '" width="195" height="70" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
        m += '<text x="' + (px + 97) + '" y="' + (py + 42) + '" fill="#f8fafc" font-size="10" text-anchor="middle">' + fx[i] + "</text>";
      }
      m += '<text x="350" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">catecholamines, Fight or Flight (PDF p. 6)</text>';
      readout(cell("Hormones", "adrenaline, noradrenaline", "#22c55e") + cell("Signs", "pupilary dilation, sweating", "#f59e0b"));
      verdict("Catecholamines fire Fight or Flight.");
    } else {
      var zones = [["reticularis", "inner"], ["fasciculata", "middle"], ["glomerulosa", "outer"]];
      for(var z = 0; z < 3; z++){
        var zx = 60 + z * 200;
        m += '<rect x="' + zx + '" y="100" width="180" height="110" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<text x="' + (zx + 90) + '" y="130" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">' + zones[z][0] + "</text>";
        m += '<text x="' + (zx + 90) + '" y="152" fill="#94a3b8" font-size="9" text-anchor="middle">' + zones[z][1] + " layer</text>";
        m += '<text x="' + (zx + 90) + '" y="176" fill="#f8fafc" font-size="9.5" text-anchor="middle">' + (z === 0 ? "androgenic steroids" : z === 1 ? "cortisol (gluco)" : "aldosterone (mineral)") + "</text>";
      }
      m += '<text x="350" y="252" fill="#f8fafc" font-size="10" text-anchor="middle">zona glomerulosa outer · cortisol + aldosterone corticoids</text>';
      m += '<text x="350" y="274" fill="#94a3b8" font-size="10" text-anchor="middle">underproduction: Addison disease (PDF pp. 6-7)</text>';
      readout(cell("Gluco", "cortisol, fuel + immune", "#f59e0b") + cell("Mineral", "aldosterone, Na+ in K+ out", "#38bdf8"));
      verdict("Cortex zones: fuel, salt and hair.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 5. Sugar and Sex Hormone Lab (sugarlab) - L5, 19.2.8-19.2.10
// -------------------------------------------------------------------------
window.SIMS.sugarlab = (function(){
  var view = "pancreas"; // "pancreas", "testis", "ovary"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pancreas</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Testis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#e879f9;"></span><span>Ovary</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pancreas">Sugar Seesaw</button>' +
      '<button class="preset-btn" id="p-testis">Testis Line</button>' +
      '<button class="preset-btn" id="p-ovary">Ovary Line</button>';
    document.getElementById("p-pancreas").onclick = function(){ setActivePreset(this); setV("pancreas"); };
    document.getElementById("p-testis").onclick = function(){ setActivePreset(this); setV("testis"); };
    document.getElementById("p-ovary").onclick = function(){ setActivePreset(this); setV("ovary"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "pancreas"){
      c.innerHTML =
        '<div class="control-group"><label>Alpha:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Glucagon, hyperglycemic (PDF p. 7).</div></div>' +
        '<div class="control-group"><label>Beta:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Insulin, glycogenesis (PDF p. 8).</div></div>';
    } else if(view === "testis"){
      c.innerHTML =
        '<div class="control-group"><label>Site:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Scrotal sac, outside abdomen (PDF p. 8).</div></div>' +
        '<div class="control-group"><label>Cells:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Leydig, intertubular spaces (PDF p. 8).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Before:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Growing follicles make estrogen (PDF p. 8).</div></div>' +
        '<div class="control-group"><label>After:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Corpus luteum makes progesterone (PDF p. 8).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Sugar and gonads (§19.2.8-19.2.10)</text>';
    if(view === "pancreas"){
      m += '<rect x="80" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="205" y="140" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">GLUCAGON UP</text>';
      m += '<text x="205" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">alpha cells, hepatocytes</text>';
      m += '<text x="205" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">glycogenolysis + new sugar</text>';
      m += '<text x="205" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">hyperglycemic hormone</text>';
      m += '<rect x="370" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="495" y="140" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">INSULIN DOWN</text>';
      m += '<text x="495" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">beta cells, uptake rises</text>';
      m += '<text x="495" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">glycogenesis in targets</text>';
      m += '<text x="495" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">hypoglycemia follows</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">composite gland, 1 to 2 per cent islets (PDF pp. 7-8)</text>';
      readout(cell("Glucagon", "hyperglycemic hormone", "#f59e0b") + cell("Insulin", "glycogenesis, hypoglycemia", "#38bdf8"));
      verdict("Insulin and glucagon hold sugar jointly.");
    } else if(view === "testis"){
      m += '<rect x="120" y="100" width="460" height="70" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="350" y="128" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">LEYDIG CELLS → ANDROGENS (TESTOSTERONE)</text>';
      m += '<text x="350" y="150" fill="#94a3b8" font-size="9.5" text-anchor="middle">scrotal sac (outside abdomen) · intertubular spaces</text>';
      var eff = ["accessory organs", "facial + axillary hair", "low pitch of voice", "spermatogenesis", "libido", "anabolic effects"];
      for(var i = 0; i < 6; i++){
        var ex = 45 + (i % 3) * 205, ey = 185 + Math.floor(i / 3) * 55;
        m += '<rect x="' + ex + '" y="' + ey + '" width="195" height="44" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="1.5"/>';
        m += '<text x="' + (ex + 97) + '" y="' + (ey + 27) + '" fill="#f8fafc" font-size="9.5" text-anchor="middle">' + eff[i] + "</text>";
      }
      readout(cell("Source", "scrotal sac (outside abdomen)", "#22c55e") + cell("Product", "androgens, testosterone", "#f59e0b"));
      verdict("Leydig cells sound the male note.");
    } else {
      m += '<rect x="80" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#e879f9" stroke-width="2"/>';
      m += '<text x="205" y="140" fill="#e879f9" font-size="12" font-weight="700" text-anchor="middle">GROWING FOLLICLE</text>';
      m += '<text x="205" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">estrogen secreted</text>';
      m += '<text x="205" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">high pitch of voice</text>';
      m += '<text x="205" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">mammary development</text>';
      m += '<rect x="370" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="495" y="140" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">CORPUS LUTEUM</text>';
      m += '<text x="495" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">progesterone secreted</text>';
      m += '<text x="495" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">supports pregnancy</text>';
      m += '<text x="495" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">sac-like structures which store milk</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">one ovum each menstrual cycle (PDF pp. 8-9)</text>';
      readout(cell("Follicle", "estrogen, high pitch voice", "#e879f9") + cell("Luteum", "sac-like structures which store milk", "#f59e0b"));
      verdict("Follicle then luteum: estrogen then progesterone.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. Non-Gland Hormone Lab (organlab) - L6, 19.3
// -------------------------------------------------------------------------
window.SIMS.organlab = (function(){
  var view = "heart"; // "heart", "kidney", "gut"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Heart</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Kidney</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Gut</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-heart">Heart Brake</button>' +
      '<button class="preset-btn" id="p-kidney">Kidney Signal</button>' +
      '<button class="preset-btn" id="p-gut">Gut Quartet</button>';
    document.getElementById("p-heart").onclick = function(){ setActivePreset(this); setV("heart"); };
    document.getElementById("p-kidney").onclick = function(){ setActivePreset(this); setV("kidney"); };
    document.getElementById("p-gut").onclick = function(){ setActivePreset(this); setV("gut"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "heart"){
      c.innerHTML =
        '<div class="control-group"><label>Trigger:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Blood pressure increased (PDF p. 9).</div></div>' +
        '<div class="control-group"><label>Action:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Dilation of blood vessels (PDF p. 9).</div></div>';
    } else if(view === "kidney"){
      c.innerHTML =
        '<div class="control-group"><label>Cells:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Juxtaglomerular cells (PDF p. 9).</div></div>' +
        '<div class="control-group"><label>Effect:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Erythropoiesis, formation of RBC (PDF p. 9).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Four:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Gastrin, secretin, CCK, GIP (PDF p. 9).</div></div>' +
        '<div class="control-group"><label>Others:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Growth factors repair tissues (PDF p. 9).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Hormones beyond glands (§19.3)</text>';
    if(view === "heart"){
      var chain = ["pressure up", "ANF secreted", "vessels dilate", "pressure down"];
      for(var i = 0; i < 4; i++){
        var px = 45 + i * 155;
        m += '<rect x="' + px + '" y="120" width="145" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + (px + 72) + '" y="166" fill="#f8fafc" font-size="10" text-anchor="middle">' + chain[i] + "</text>";
        if(i < 3) m += '<text x="' + (px + 150) + '" y="165" fill="#38bdf8" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="252" fill="#f8fafc" font-size="10" text-anchor="middle">atrial natriuretic factor from the atrial wall</text>';
      m += '<text x="350" y="274" fill="#94a3b8" font-size="10" text-anchor="middle">peptide hormone, decreases blood pressure (PDF p. 9)</text>';
      readout(cell("Hormone", "atrial natriuretic factor", "#38bdf8") + cell("Action", "dilation of the blood vessels", "#22c55e"));
      verdict("ANF dilates vessels, pressure falls.");
    } else if(view === "kidney"){
      m += '<rect x="120" y="110" width="210" height="110" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="225" y="140" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">JUXTAGLOMERULAR</text>';
      m += '<text x="225" y="162" fill="#f8fafc" font-size="10" text-anchor="middle">erythropoietin</text>';
      m += '<text x="225" y="184" fill="#94a3b8" font-size="9" text-anchor="middle">peptide hormone</text>';
      m += '<text x="350" y="170" fill="#38bdf8" font-size="16" text-anchor="middle">→</text>';
      m += '<rect x="370" y="110" width="210" height="110" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="475" y="140" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">RED CELLS</text>';
      m += '<text x="475" y="162" fill="#f8fafc" font-size="10" text-anchor="middle">erythropoiesis</text>';
      m += '<text x="475" y="184" fill="#94a3b8" font-size="9" text-anchor="middle">formation of RBC</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">erythropoiesis (formation of RBC) (PDF p. 9)</text>';
      readout(cell("Source", "juxtaglomerular cells", "#22c55e") + cell("Effect", "erythropoiesis (formation of RBC)", "#f59e0b"));
      verdict("Kidney orders red cells.");
    } else {
      var gut = [["gastrin", "HCl + pepsinogen"], ["secretin", "water + bicarbonate"], ["CCK", "enzymes + bile"], ["GIP", "inhibits stomach"]];
      for(var g = 0; g < 4; g++){
        var gx = 45 + g * 155;
        m += '<rect x="' + gx + '" y="110" width="145" height="110" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<text x="' + (gx + 72) + '" y="142" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">' + gut[g][0] + "</text>";
        m += '<text x="' + (gx + 72) + '" y="168" fill="#f8fafc" font-size="9.5" text-anchor="middle">' + gut[g][1] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">gastric inhibitory peptide; growth factors repair (PDF p. 9)</text>';
      readout(cell("Stimulate", "gastrin, secretin, CCK", "#f59e0b") + cell("Inhibit", "gastric inhibitory peptide", "#38bdf8"));
      verdict("Four gut peptides run digestion.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 7. Receptor Mechanism Lab (receptorlab) - L7, 19.4 + Summary
// -------------------------------------------------------------------------
window.SIMS.receptorlab = (function(){
  var view = "classes"; // "classes", "membrane", "nuclear"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Membrane</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Nuclear</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Groups</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-classes">Four Groups</button>' +
      '<button class="preset-btn" id="p-membrane">Membrane Route</button>' +
      '<button class="preset-btn" id="p-nuclear">Nuclear Route</button>';
    document.getElementById("p-classes").onclick = function(){ setActivePreset(this); setV("classes"); };
    document.getElementById("p-membrane").onclick = function(){ setActivePreset(this); setV("membrane"); };
    document.getElementById("p-nuclear").onclick = function(){ setActivePreset(this); setV("nuclear"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "classes"){
      c.innerHTML =
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Each receptor specific to one hormone only (PDF p. 9).</div></div>' +
        '<div class="control-group"><label>Site:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Receptors in target tissues only (PDF p. 9).</div></div>';
    } else if(view === "membrane"){
      c.innerHTML =
        '<div class="control-group"><label>Stays out:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Normally do not enter the cell (PDF p. 10).</div></div>' +
        '<div class="control-group"><label>Inside:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Second messengers regulate metabolism (PDF p. 10).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Goes in:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Steroids, iodothyronines (PDF p. 10).</div></div>' +
        '<div class="control-group"><label>Result:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cumulative, developmental effects (PDF p. 10).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Two routes into the cell (§19.4)</text>';
    if(view === "classes"){
      var groups = [["(i) peptides", "insulin, glucagon"], ["(ii) steroids", "cortisol, estradiol"], ["(iii) iodothyronines", "thyroid hormones"], ["(iv) amino-acid", "epinephrine"]];
      for(var i = 0; i < 4; i++){
        var px = 45 + i * 155;
        m += '<rect x="' + px + '" y="110" width="145" height="110" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<text x="' + (px + 72) + '" y="142" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">' + groups[i][0] + "</text>";
        m += '<text x="' + (px + 72) + '" y="168" fill="#f8fafc" font-size="9.5" text-anchor="middle">' + groups[i][1] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">chemical nature decides the route (PDF p. 10)</text>';
      readout(cell("Groups", "peptides, steroids, iodothyronines", "#f59e0b") + cell("Fourth", "amino-acid derivatives", "#38bdf8"));
      verdict("Four chemical families of hormones.");
    } else if(view === "membrane"){
      m += '<rect x="80" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="205" y="140" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">OUTSIDE THE CELL</text>';
      m += '<text x="205" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">peptide binds receptor</text>';
      m += '<text x="205" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">does not enter</text>';
      m += '<text x="205" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">hormone-receptor complex</text>';
      m += '<rect x="370" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="495" y="140" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">INSIDE THE CELL</text>';
      m += '<text x="495" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">cyclic AMP, IP3, Ca++</text>';
      m += '<text x="495" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">second messengers</text>';
      m += '<text x="495" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">cellular metabolism</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Figure 19.5a, protein hormone (PDF p. 10)</text>';
      readout(cell("Outside", "membrane-bound receptors", "#38bdf8") + cell("Inside", "cyclic AMP, IP3, Ca++", "#22c55e"));
      verdict("Surface knock, messengers within.");
    } else {
      m += '<rect x="80" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="205" y="140" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">COMPLEX + GENOME</text>';
      m += '<text x="205" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">steroids, iodothyronines</text>';
      m += '<text x="205" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">intracellular receptors</text>';
      m += '<text x="205" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">mostly nuclear</text>';
      m += '<rect x="370" y="110" width="250" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="495" y="140" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">GENE EFFECTS</text>';
      m += '<text x="495" y="164" fill="#f8fafc" font-size="10" text-anchor="middle">gene expression or</text>';
      m += '<text x="495" y="184" fill="#f8fafc" font-size="10" text-anchor="middle">chromosome function</text>';
      m += '<text x="495" y="206" fill="#94a3b8" font-size="9" text-anchor="middle">cumulative, developmental</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Figure 19.5b, steroid hormone (PDF p. 10)</text>';
      readout(cell("Route", "intracellular receptors", "#22c55e") + cell("Result", "gene expression or chromosome function", "#f59e0b"));
      verdict("Steroids talk to the genome.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-118 -
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
