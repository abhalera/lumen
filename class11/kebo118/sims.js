// kebo118 interactive simulations: Neural Control and Coordination (Ch. 18, print pp. 230-238)
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
// 1. Coordination Explorer (coordlab) - L1, Introduction + 18.1
// -------------------------------------------------------------------------
window.SIMS.coordlab = (function(){
  var view = "coord"; // "coord", "point", "evol"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Neural</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Coordination</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Organs</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-coord">Exercise Chain</button>' +
      '<button class="preset-btn" id="p-point">Two Coordinators</button>' +
      '<button class="preset-btn" id="p-evol">Neural Evolution</button>';
    document.getElementById("p-coord").onclick = function(){ setActivePreset(this); setV("coord"); };
    document.getElementById("p-point").onclick = function(){ setActivePreset(this); setV("point"); };
    document.getElementById("p-evol").onclick = function(){ setActivePreset(this); setV("evol"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "coord"){
      c.innerHTML =
        '<div class="control-group"><label>Demand:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Exercise raises energy and oxygen demand (PDF p. 1).</div></div>' +
        '<div class="control-group"><label>Rest:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Nerves, lungs, heart, kidney return to normal (PDF p. 1).</div></div>';
    } else if(view === "point"){
      c.innerHTML =
        '<div class="control-group"><label>Neural:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Point-to-point network, quick coordination (PDF p. 1).</div></div>' +
        '<div class="control-group"><label>Endocrine:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Chemical integration through hormones (PDF p. 1).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Simple:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Hydra: a network of neurons (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Developed:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Vertebrates: more developed neural system (PDF p. 2).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Coordination (§18.1)</text>';
    if(view === "coord"){
      var organs = ["muscles", "lungs", "heart", "vessels", "kidney"];
      for(var i = 0; i < 5; i++){
        var px = 50 + i * 122;
        m += '<rect x="' + px + '" y="100" width="110" height="110" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<text x="' + (px + 55) + '" y="140" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">' + organs[i] + "</text>";
        m += '<text x="' + (px + 55) + '" y="162" fill="#f8fafc" font-size="9" text-anchor="middle">' + (i === 0 ? "energy demand" : i === 1 ? "respiration up" : i === 2 ? "heart beat up" : i === 3 ? "blood flow up" : "returns normal") + "</text>";
        if(i < 4) m += '<text x="' + (px + 116) + '" y="160" fill="#38bdf8" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">two or more organs interact and complement (PDF p. 1)</text>';
      readout(cell("Energy demand", "muscular activity rises", "#f59e0b") + cell("Oxygen supply", "respiration, heart beat up", "#38bdf8"));
      verdict("Organs rise and rest together.");
    } else if(view === "point"){
      m += '<rect x="60" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="200" y="130" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">NEURAL SYSTEM</text>';
      m += '<text x="200" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">organised network of</text>';
      m += '<text x="200" y="174" fill="#f8fafc" font-size="10" text-anchor="middle">point-to-point connections</text>';
      m += '<text x="200" y="196" fill="#94a3b8" font-size="9.5" text-anchor="middle">quick coordination</text>';
      m += '<rect x="360" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="500" y="130" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">ENDOCRINE SYSTEM</text>';
      m += '<text x="500" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">chemical integration</text>';
      m += '<text x="500" y="174" fill="#f8fafc" font-size="10" text-anchor="middle">through hormones</text>';
      m += '<text x="500" y="196" fill="#94a3b8" font-size="9.5" text-anchor="middle">jointly coordinate</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">jointly coordinate and integrate, synchronised fashion (PDF p. 1)</text>';
      readout(cell("Neural", "point-to-point connections", "#38bdf8") + cell("Endocrine", "chemical integration, hormones", "#22c55e"));
      verdict("Wires for speed, hormones for chemistry.");
    } else {
      var rows = [
        ["HYDRA", "network of neurons", "very simple", "#38bdf8"],
        ["INSECTS", "brain + ganglia + neural tissues", "better organised", "#22c55e"],
        ["VERTEBRATES", "more developed neural system", "most developed", "#f59e0b"]
      ];
      for(var r = 0; r < 3; r++){
        var ry = 76 + r * 68;
        m += '<rect x="120" y="' + ry + '" width="460" height="58" rx="8" fill="#0f172a" stroke="' + rows[r][3] + '" stroke-width="2"/>';
        m += '<text x="350" y="' + (ry + 23) + '" fill="' + rows[r][3] + '" font-size="11" font-weight="700" text-anchor="middle">' + rows[r][0] + "</text>";
        m += '<text x="350" y="' + (ry + 43) + '" fill="#f8fafc" font-size="10" text-anchor="middle">' + rows[r][1] + " · " + rows[r][2] + "</text>";
      }
      m += '<text x="350" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">detect, receive and transmit stimuli (PDF p. 2)</text>';
      readout(cell("Hydra", "network of neurons", "#38bdf8") + cell("Insects", "brain with ganglia", "#22c55e"));
      verdict("Simple net to developed system.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. Human Neural System (hnslab) - L2, 18.2
// -------------------------------------------------------------------------
window.SIMS.hnslab = (function(){
  var view = "cns"; // "cns", "affer", "auto"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>CNS</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>PNS</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Divisions</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cns">CNS vs PNS</button>' +
      '<button class="preset-btn" id="p-affer">Two Fibres</button>' +
      '<button class="preset-btn" id="p-auto">Somatic vs Autonomic</button>';
    document.getElementById("p-cns").onclick = function(){ setActivePreset(this); setV("cns"); };
    document.getElementById("p-affer").onclick = function(){ setActivePreset(this); setV("affer"); };
    document.getElementById("p-auto").onclick = function(){ setActivePreset(this); setV("auto"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "cns"){
      c.innerHTML =
        '<div class="control-group"><label>CNS:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Brain + spinal cord: processing and control (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>PNS:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">All nerves associated with the CNS (PDF p. 2).</div></div>';
    } else if(view === "affer"){
      c.innerHTML =
        '<div class="control-group"><label>Afferent:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Tissues/organs to the CNS (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Efferent:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">CNS to peripheral tissues/organs (PDF p. 2).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Somatic:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">CNS to skeletal muscles (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Autonomic:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Sympathetic + parasympathetic (PDF p. 2).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Human Neural System (§18.2)</text>';
    if(view === "cns"){
      m += '<rect x="60" y="100" width="280" height="130" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="200" y="130" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">CENTRAL (CNS)</text>';
      m += '<text x="200" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">brain and spinal cord</text>';
      m += '<text x="200" y="178" fill="#f8fafc" font-size="10" text-anchor="middle">information processing</text>';
      m += '<text x="200" y="198" fill="#94a3b8" font-size="9.5" text-anchor="middle">and control</text>';
      m += '<rect x="360" y="100" width="280" height="130" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="500" y="130" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">PERIPHERAL (PNS)</text>';
      m += '<text x="500" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">all the nerves of the body</text>';
      m += '<text x="500" y="178" fill="#f8fafc" font-size="10" text-anchor="middle">associated with the CNS</text>';
      m += '<text x="500" y="198" fill="#94a3b8" font-size="9.5" text-anchor="middle">afferent + efferent fibres</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">divided into two parts: CNS and PNS (PDF p. 2)</text>';
      readout(cell("CNS", "brain and spinal cord", "#38bdf8") + cell("PNS", "all nerves with CNS", "#22c55e"));
      verdict("Centre processes, nerves connect.");
    } else if(view === "affer"){
      m += '<rect x="220" y="70" width="260" height="52" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="101" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">CNS (brain + spinal cord)</text>';
      m += '<text x="350" y="150" fill="#22c55e" font-size="16" text-anchor="middle">↑ afferent fibres ↑</text>';
      m += '<text x="350" y="172" fill="#f8fafc" font-size="10" text-anchor="middle">impulses from tissues/organs to the CNS</text>';
      m += '<text x="350" y="215" fill="#f59e0b" font-size="16" text-anchor="middle">↓ efferent fibres ↓</text>';
      m += '<text x="350" y="237" fill="#f8fafc" font-size="10" text-anchor="middle">regulatory impulses from CNS to tissues/organs</text>';
      m += '<rect x="220" y="252" width="260" height="40" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>';
      m += '<text x="350" y="277" fill="#94a3b8" font-size="10" text-anchor="middle">peripheral tissues/organs</text>';
      readout(cell("Afferent", "organs to the CNS", "#22c55e") + cell("Efferent", "CNS to the organs", "#f59e0b"));
      verdict("In to the CNS, out to the organs.");
    } else {
      m += '<rect x="150" y="66" width="400" height="46" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>';
      m += '<text x="350" y="94" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">PNS: two divisions</text>';
      m += '<rect x="60" y="128" width="280" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="200" y="156" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">SOMATIC</text>';
      m += '<text x="200" y="180" fill="#f8fafc" font-size="10" text-anchor="middle">relays impulses CNS</text>';
      m += '<text x="200" y="200" fill="#f8fafc" font-size="10" text-anchor="middle">to skeletal muscles</text>';
      m += '<rect x="360" y="128" width="280" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="500" y="156" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">AUTONOMIC</text>';
      m += '<text x="500" y="180" fill="#f8fafc" font-size="10" text-anchor="middle">involuntary organs and</text>';
      m += '<text x="500" y="200" fill="#f8fafc" font-size="10" text-anchor="middle">smooth muscles</text>';
      m += '<text x="500" y="222" fill="#94a3b8" font-size="9.5" text-anchor="middle">sympathetic + parasympathetic</text>';
      m += '<text x="350" y="278" fill="#94a3b8" font-size="11" text-anchor="middle">visceral nervous system: viscera both ways (PDF p. 2)</text>';
      readout(cell("Somatic", "CNS to skeletal muscles", "#22c55e") + cell("Autonomic", "sympathetic, parasympathetic", "#f59e0b"));
      verdict("Voluntary muscle, involuntary organs.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 3. Neuron Lab (neuronlab) - L3, 18.3
// -------------------------------------------------------------------------
window.SIMS.neuronlab = (function(){
  var view = "parts"; // "parts", "types", "myelin"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Dendrites</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Cell body</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Axon</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-parts">Three Parts</button>' +
      '<button class="preset-btn" id="p-types">Three Shapes</button>' +
      '<button class="preset-btn" id="p-myelin">Myelin Wrap</button>';
    document.getElementById("p-parts").onclick = function(){ setActivePreset(this); setV("parts"); };
    document.getElementById("p-types").onclick = function(){ setActivePreset(this); setV("types"); };
    document.getElementById("p-myelin").onclick = function(){ setActivePreset(this); setV("myelin"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "parts"){
      c.innerHTML =
        '<div class="control-group"><label>Body:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cytoplasm, organelles, Nissl’s granules (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Knob:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Synaptic knob, vesicles, neurotransmitters (PDF p. 3).</div></div>';
    } else if(view === "types"){
      c.innerHTML =
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Number of axon and dendrites (PDF p. 3).</div></div>' +
        '<div class="control-group"><label>Sites:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cortex, retina, embryonic stage (PDF p. 3).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Myelinated:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Spinal and cranial nerves (PDF p. 3).</div></div>' +
        '<div class="control-group"><label>Unmyelinated:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Autonomous and somatic systems (PDF p. 3).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Neuron (§18.3, Figure 18.1)</text>';
    if(view === "parts"){
      m += '<text x="120" y="120" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">dendrites</text>';
      m += '<text x="120" y="138" fill="#94a3b8" font-size="9" text-anchor="middle">towards cell body</text>';
      m += '<circle cx="120" cy="180" r="34" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="120" y="184" fill="#f8fafc" font-size="8.5" text-anchor="middle">branches +</text>';
      m += '<text x="120" y="196" fill="#f8fafc" font-size="8.5" text-anchor="middle">Nissl’s granules</text>';
      m += '<circle cx="300" cy="180" r="40" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="300" y="172" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">cell body</text>';
      m += '<text x="300" y="190" fill="#f8fafc" font-size="8.5" text-anchor="middle">cytoplasm, organelles</text>';
      m += '<text x="300" y="202" fill="#f8fafc" font-size="8.5" text-anchor="middle">Nissl’s granules</text>';
      m += '<rect x="350" y="172" width="180" height="16" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="440" y="162" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">axon (long fibre)</text>';
      m += '<circle cx="560" cy="180" r="22" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="560" y="176" fill="#f8fafc" font-size="8.5" text-anchor="middle">synaptic</text>';
      m += '<text x="560" y="188" fill="#f8fafc" font-size="8.5" text-anchor="middle">knob</text>';
      m += '<text x="560" y="216" fill="#94a3b8" font-size="9" text-anchor="middle">vesicles + neurotransmitters</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">axon to synapse or neuro-muscular junction (PDF p. 3)</text>';
      readout(cell("Dendrites", "impulses towards cell body", "#38bdf8") + cell("Axon", "impulses away from cell body", "#f59e0b"));
      verdict("Dendrites in, axon out.");
    } else if(view === "types"){
      var rows = [
        ["MULTIPOLAR", "one axon, two or more dendrites", "cerebral cortex", "#38bdf8"],
        ["BIPOLAR", "one axon and one dendrite", "retina of eye", "#22c55e"],
        ["UNIPOLAR", "cell body with one axon only", "embryonic stage", "#f59e0b"]
      ];
      for(var r = 0; r < 3; r++){
        var ry = 76 + r * 68;
        m += '<rect x="120" y="' + ry + '" width="460" height="58" rx="8" fill="#0f172a" stroke="' + rows[r][3] + '" stroke-width="2"/>';
        m += '<text x="350" y="' + (ry + 23) + '" fill="' + rows[r][3] + '" font-size="11" font-weight="700" text-anchor="middle">' + rows[r][0] + "</text>";
        m += '<text x="350" y="' + (ry + 43) + '" fill="#f8fafc" font-size="10" text-anchor="middle">' + rows[r][1] + " · " + rows[r][2] + "</text>";
      }
      m += '<text x="350" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">based on axon and dendrite count (PDF p. 3)</text>';
      readout(cell("Multipolar", "cerebral cortex neurons", "#38bdf8") + cell("Bipolar", "retina of eye", "#22c55e"));
      verdict("One axon, dendrites decide.");
    } else {
      m += '<rect x="60" y="90" width="280" height="140" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="200" y="118" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">MYELINATED</text>';
      m += '<rect x="90" y="140" width="220" height="18" rx="9" fill="#1e293b" stroke="#f8fafc" stroke-width="1"/>';
      m += '<text x="200" y="153" fill="#f8fafc" font-size="8.5" text-anchor="middle">myelin sheath (Schwann cells)</text>';
      m += '<text x="200" y="182" fill="#f8fafc" font-size="10" text-anchor="middle">nodes of Ranvier = gaps</text>';
      m += '<text x="200" y="204" fill="#94a3b8" font-size="9.5" text-anchor="middle">spinal and cranial nerves</text>';
      m += '<rect x="360" y="90" width="280" height="140" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="500" y="118" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">NON-MYELINATED</text>';
      m += '<rect x="390" y="140" width="220" height="18" rx="9" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="500" y="153" fill="#f59e0b" font-size="8.5" text-anchor="middle">Schwann cell, no sheath</text>';
      m += '<text x="500" y="182" fill="#f8fafc" font-size="10" text-anchor="middle">enclosed, no myelin sheath</text>';
      m += '<text x="500" y="204" fill="#94a3b8" font-size="9.5" text-anchor="middle">autonomous, somatic systems</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">two types of axons (PDF p. 3)</text>';
      readout(cell("Nodes", "nodes of Ranvier gaps", "#38bdf8") + cell("Sheath", "Schwann cells wrap axon", "#f59e0b"));
      verdict("Schwann wraps, gaps are nodes.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Impulse Lab (impulselab) - L4, 18.3.1
// -------------------------------------------------------------------------
window.SIMS.impulselab = (function(){
  var view = "rest"; // "rest", "action", "restore"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Na+</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>K+</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Charge</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-rest">Resting Potential</button>' +
      '<button class="preset-btn" id="p-action">Action Potential</button>' +
      '<button class="preset-btn" id="p-restore">Recovery</button>';
    document.getElementById("p-rest").onclick = function(){ setActivePreset(this); setV("rest"); };
    document.getElementById("p-action").onclick = function(){ setActivePreset(this); setV("action"); };
    document.getElementById("p-restore").onclick = function(){ setActivePreset(this); setV("restore"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "rest"){
      c.innerHTML =
        '<div class="control-group"><label>Pump:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">3 Na+ out for 2 K+ in (PDF p. 3).</div></div>' +
        '<div class="control-group"><label>Gate:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">K+ permeable, Na+ nearly shut (PDF p. 3).</div></div>';
    } else if(view === "action"){
      c.innerHTML =
        '<div class="control-group"><label>Trigger:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Site A freely permeable to Na+ (PDF p. 4).</div></div>' +
        '<div class="control-group"><label>Travel:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Current A to B inside, B to A outside (PDF p. 4).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Exit:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">K+ diffuses outside in a fraction of a second (PDF p. 4).</div></div>' +
        '<div class="control-group"><label>Ready:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fibre responsive to further stimulation (PDF p. 4).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Nerve Impulse (§18.3.1, Figure 18.2)</text>';
    if(view === "rest"){
      m += '<text x="350" y="90" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">OUTSIDE: low K+, high Na+ · positive charge</text>';
      m += '<rect x="80" y="104" width="540" height="60" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>';
      m += '<text x="350" y="128" fill="#f8fafc" font-size="10" text-anchor="middle">axonal membrane: K+ permeable, Na+ nearly shut</text>';
      m += '<text x="350" y="150" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">sodium-potassium pump: 3 Na+ out, 2 K+ in</text>';
      m += '<text x="350" y="196" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">INSIDE: high K+, proteins, low Na+ · negative charge</text>';
      m += '<text x="350" y="232" fill="#f8fafc" font-size="11" text-anchor="middle">potential difference = resting potential</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">polarised: outer positive, inner negative (PDF p. 3)</text>';
      readout(cell("Outside", "high Na+, positive charge", "#38bdf8") + cell("Inside", "high K+, negative charge", "#22c55e"));
      verdict("Positive outside, negative inside.");
    } else if(view === "action"){
      m += '<rect x="140" y="90" width="180" height="120" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="230" y="118" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">SITE A: DEPOLARISED</text>';
      m += '<text x="230" y="142" fill="#f8fafc" font-size="10" text-anchor="middle">Na+ influx, polarity</text>';
      m += '<text x="230" y="160" fill="#f8fafc" font-size="10" text-anchor="middle">reversed: outside −,</text>';
      m += '<text x="230" y="178" fill="#f8fafc" font-size="10" text-anchor="middle">inside + (action potential)</text>';
      m += '<rect x="380" y="90" width="180" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="470" y="118" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">SITE B: RESTING</text>';
      m += '<text x="470" y="142" fill="#f8fafc" font-size="10" text-anchor="middle">outside +, inside −;</text>';
      m += '<text x="470" y="160" fill="#f8fafc" font-size="10" text-anchor="middle">current flows A→B</text>';
      m += '<text x="470" y="178" fill="#f8fafc" font-size="10" text-anchor="middle">inside, B→A outside</text>';
      m += '<text x="350" y="248" fill="#f8fafc" font-size="11" text-anchor="middle">impulse generated at A arrives at B, repeated along axon</text>';
      m += '<text x="350" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">action potential = nerve impulse (PDF p. 4)</text>';
      readout(cell("Site A", "Na+ influx, depolarised", "#ef4444") + cell("Site B", "polarity flips next", "#38bdf8"));
      verdict("Polarity flips, impulse travels.");
    } else {
      m += '<rect x="120" y="80" width="460" height="52" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="350" y="102" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">Na+ rise is short-lived → K+ permeability rises</text>';
      m += '<text x="350" y="122" fill="#f8fafc" font-size="10" text-anchor="middle">K+ diffuses outside the membrane</text>';
      m += '<rect x="120" y="150" width="460" height="52" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="172" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">resting potential restored at site of excitation</text>';
      m += '<text x="350" y="192" fill="#f8fafc" font-size="10" text-anchor="middle">within a fraction of a second</text>';
      m += '<rect x="120" y="220" width="460" height="44" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>';
      m += '<text x="350" y="247" fill="#94a3b8" font-size="10" text-anchor="middle">fibre once more responsive to further stimulation</text>';
      m += '<text x="350" y="278" fill="#94a3b8" font-size="11" text-anchor="middle">wave of depolarisation and repolarisation (PDF p. 4)</text>';
      readout(cell("Recovery", "K+ diffuses outside", "#22c55e") + cell("Result", "resting potential restored", "#38bdf8"));
      verdict("Potassium out, ready again.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 5. Synapse Lab (synapselab) - L5, 18.3.2
// -------------------------------------------------------------------------
window.SIMS.synapselab = (function(){
  var view = "elec"; // "elec", "chem", "fate"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pre-synaptic</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Synaptic cleft</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Post-synaptic</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-elec">Electrical Synapse</button>' +
      '<button class="preset-btn" id="p-chem">Chemical Synapse</button>' +
      '<button class="preset-btn" id="p-fate">New Potential</button>';
    document.getElementById("p-elec").onclick = function(){ setActivePreset(this); setV("elec"); };
    document.getElementById("p-chem").onclick = function(){ setActivePreset(this); setV("chem"); };
    document.getElementById("p-fate").onclick = function(){ setActivePreset(this); setV("fate"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "elec"){
      c.innerHTML =
        '<div class="control-group"><label>Gap:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Membranes in very close proximity (PDF p. 5).</div></div>' +
        '<div class="control-group"><label>Speed:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Always faster; rare in our system (PDF p. 5).</div></div>';
    } else if(view === "chem"){
      c.innerHTML =
        '<div class="control-group"><label>Cleft:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fluid-filled synaptic cleft (PDF p. 5).</div></div>' +
        '<div class="control-group"><label>Carrier:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Neurotransmitters in vesicles (PDF p. 5).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Receptors:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Specific receptors on post-synaptic membrane (PDF p. 6).</div></div>' +
        '<div class="control-group"><label>Outcome:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Excitatory or inhibitory (PDF p. 6).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Synapse (§18.3.2, Figure 18.3)</text>';
    if(view === "elec"){
      m += '<rect x="140" y="100" width="170" height="110" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="225" y="140" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">PRE-SYNAPTIC</text>';
      m += '<text x="225" y="165" fill="#f8fafc" font-size="10" text-anchor="middle">electrical current</text>';
      m += '<text x="225" y="185" fill="#f8fafc" font-size="10" text-anchor="middle">flows directly</text>';
      m += '<text x="350" y="165" fill="#f59e0b" font-size="20" text-anchor="middle">⇄</text>';
      m += '<text x="350" y="190" fill="#94a3b8" font-size="9" text-anchor="middle">very close</text>';
      m += '<rect x="390" y="100" width="170" height="110" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="475" y="140" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">POST-SYNAPTIC</text>';
      m += '<text x="475" y="165" fill="#f8fafc" font-size="10" text-anchor="middle">like conduction</text>';
      m += '<text x="475" y="185" fill="#f8fafc" font-size="10" text-anchor="middle">along one axon</text>';
      m += '<text x="350" y="252" fill="#f8fafc" font-size="11" text-anchor="middle">always faster than chemical · rare in our system</text>';
      m += '<text x="350" y="276" fill="#94a3b8" font-size="11" text-anchor="middle">two types of synapses (PDF p. 5)</text>';
      readout(cell("Contact", "membranes in close proximity", "#38bdf8") + cell("Speed", "always faster, rare", "#f59e0b"));
      verdict("Current flows straight through.");
    } else if(view === "chem"){
      var steps = [
        "impulse arrives at axon terminal",
        "vesicles fuse, release neurotransmitters",
        "receptors bind, ion channels open"
      ];
      for(var i = 0; i < 3; i++){
        var px = 60 + i * 200;
        m += '<rect x="' + px + '" y="100" width="185" height="110" rx="8" fill="#0f172a" stroke="' + (i === 1 ? "#22c55e" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (px + 92) + '" y="130" fill="' + (i === 1 ? "#22c55e" : "#38bdf8") + '" font-size="11" font-weight="700" text-anchor="middle">STEP ' + (i + 1) + "</text>";
        m += '<text x="' + (px + 92) + '" y="158" fill="#f8fafc" font-size="9.5" text-anchor="middle">' + steps[i] + "</text>";
        if(i === 1) m += '<text x="' + (px + 92) + '" y="182" fill="#94a3b8" font-size="9" text-anchor="middle">fluid-filled synaptic cleft</text>';
        if(i < 2) m += '<text x="' + (px + 192) + '" y="160" fill="#38bdf8" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="252" fill="#f8fafc" font-size="11" text-anchor="middle">axon terminals contain vesicles of neurotransmitters</text>';
      m += '<text x="350" y="276" fill="#94a3b8" font-size="11" text-anchor="middle">chemical synapse (PDF pp. 5-6)</text>';
      readout(cell("Release", "vesicles fuse with membrane", "#22c55e") + cell("Bind", "specific receptors open channels", "#f59e0b"));
      verdict("Vesicles fuse, receptors open.");
    } else {
      m += '<rect x="80" y="100" width="250" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="205" y="130" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">EXCITATORY</text>';
      m += '<text x="205" y="158" fill="#f8fafc" font-size="10" text-anchor="middle">entry of ions generates</text>';
      m += '<text x="205" y="178" fill="#f8fafc" font-size="10" text-anchor="middle">a new excitatory potential</text>';
      m += '<text x="205" y="198" fill="#94a3b8" font-size="9" text-anchor="middle">in post-synaptic neuron</text>';
      m += '<rect x="370" y="100" width="250" height="120" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="495" y="130" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">INHIBITORY</text>';
      m += '<text x="495" y="158" fill="#f8fafc" font-size="10" text-anchor="middle">entry of ions generates</text>';
      m += '<text x="495" y="178" fill="#f8fafc" font-size="10" text-anchor="middle">a new inhibitory potential</text>';
      m += '<text x="495" y="198" fill="#94a3b8" font-size="9" text-anchor="middle">in post-synaptic neuron</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">either excitatory or inhibitory (PDF p. 6)</text>';
      readout(cell("Excitatory", "new excitatory potential", "#22c55e") + cell("Inhibitory", "new inhibitory potential", "#ef4444"));
      verdict("Excite or inhibit, the cleft decides.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. Forebrain Lab (forelab) - L6, 18.4 + 18.4.1
// -------------------------------------------------------------------------
window.SIMS.forelab = (function(){
  var view = "protect"; // "protect", "cortex", "thal"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Protection</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Cerebrum</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Deep parts</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-protect">Command Centre</button>' +
      '<button class="preset-btn" id="p-cortex">Cerebrum</button>' +
      '<button class="preset-btn" id="p-thal">Deeper Forebrain</button>';
    document.getElementById("p-protect").onclick = function(){ setActivePreset(this); setV("protect"); };
    document.getElementById("p-cortex").onclick = function(){ setActivePreset(this); setV("cortex"); };
    document.getElementById("p-thal").onclick = function(){ setActivePreset(this); setV("thal"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "protect"){
      c.innerHTML =
        '<div class="control-group"><label>Command:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Central information processing organ (PDF p. 6).</div></div>' +
        '<div class="control-group"><label>Cover:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Skull + cranial meninges (PDF p. 6).</div></div>';
    } else if(view === "cortex"){
      c.innerHTML =
        '<div class="control-group"><label>Halves:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Left/right hemispheres, corpus callosum (PDF p. 7).</div></div>' +
        '<div class="control-group"><label>Matter:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Grey cortex outside, white tracts inside (PDF p. 7).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Relay:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Thalamus coordinates sensory/motor (PDF p. 7).</div></div>' +
        '<div class="control-group"><label>Feel:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Limbic lobe: emotion, motivation (PDF p. 7).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Brain + Forebrain (§18.4, Figure 18.4)</text>';
    if(view === "protect"){
      m += '<rect x="60" y="76" width="580" height="52" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="98" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">command and control system</text>';
      m += '<text x="350" y="118" fill="#f8fafc" font-size="10" text-anchor="middle">voluntary, balance, vitals, circadian (24-hour) rhythms</text>';
      var layers = ["skull", "dura mater (outer)", "arachnoid (thin middle)", "pia mater (inner)"];
      for(var i = 0; i < 4; i++){
        var ly = 144 + i * 34;
        m += '<rect x="150" y="' + ly + '" width="400" height="28" rx="6" fill="#0f172a" stroke="#22c55e" stroke-width="1.5"/>';
        m += '<text x="350" y="' + (ly + 19) + '" fill="#f8fafc" font-size="10" text-anchor="middle">' + layers[i] + "</text>";
      }
      m += '<text x="350" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">three parts: forebrain, midbrain, hindbrain (PDF p. 6)</text>';
      readout(cell("Role", "command and control system", "#38bdf8") + cell("Cover", "dura, arachnoid, pia", "#22c55e"));
      verdict("Skull guards, meninges wrap.");
    } else if(view === "cortex"){
      m += '<rect x="60" y="80" width="280" height="150" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="200" y="108" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">CEREBRUM (major part)</text>';
      m += '<text x="200" y="132" fill="#f8fafc" font-size="10" text-anchor="middle">deep cleft: left + right</text>';
      m += '<text x="200" y="150" fill="#f8fafc" font-size="10" text-anchor="middle">cerebral hemispheres</text>';
      m += '<text x="200" y="172" fill="#f8fafc" font-size="10" text-anchor="middle">corpus callosum joins them</text>';
      m += '<text x="200" y="198" fill="#94a3b8" font-size="9" text-anchor="middle">motor, sensory, association areas</text>';
      m += '<rect x="360" y="80" width="280" height="150" rx="8" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>';
      m += '<text x="500" y="108" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">GREY vs WHITE</text>';
      m += '<text x="500" y="132" fill="#94a3b8" font-size="10" text-anchor="middle">grey matter: cerebral cortex,</text>';
      m += '<text x="500" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">cell bodies, folds</text>';
      m += '<text x="500" y="172" fill="#f8fafc" font-size="10" text-anchor="middle">white matter: myelin sheath</text>';
      m += '<text x="500" y="190" fill="#f8fafc" font-size="10" text-anchor="middle">tracts inside</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">association areas: memory, communication (PDF p. 7)</text>';
      readout(cell("Join", "corpus callosum tract", "#22c55e") + cell("Grey", "cortex cell bodies", "#94a3b8"));
      verdict("Grey outside, white within.");
    } else {
      var rows = [
        ["THALAMUS", "coordinating centre, sensory + motor", "#38bdf8"],
        ["HYPOTHALAMUS", "temperature, eating, drinking, hormones", "#f59e0b"],
        ["LIMBIC LOBE", "amygdala, hippocampus: emotion, motivation", "#22c55e"]
      ];
      for(var r = 0; r < 3; r++){
        var ry = 76 + r * 68;
        m += '<rect x="120" y="' + ry + '" width="460" height="58" rx="8" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="2"/>';
        m += '<text x="350" y="' + (ry + 23) + '" fill="' + rows[r][2] + '" font-size="11" font-weight="700" text-anchor="middle">' + rows[r][0] + "</text>";
        m += '<text x="350" y="' + (ry + 43) + '" fill="#f8fafc" font-size="10" text-anchor="middle">' + rows[r][1] + "</text>";
      }
      m += '<text x="350" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">cerebrum wraps thalamus; hypothalamus at its base (PDF p. 7)</text>';
      readout(cell("Thalamus", "sensory and motor relay", "#38bdf8") + cell("Hypothalamus", "hypothalamic hormones", "#f59e0b"));
      verdict("Relay, regulate, feel.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 7. Hindbrain Lab (hindlab) - L7, 18.4.2 + 18.4.3 + Summary
// -------------------------------------------------------------------------
window.SIMS.hindlab = (function(){
  var view = "mid"; // "mid", "hind", "stem"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Midbrain</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Hindbrain</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Brain stem</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-mid">Midbrain</button>' +
      '<button class="preset-btn" id="p-hind">Hindbrain Trio</button>' +
      '<button class="preset-btn" id="p-stem">Brain Stem</button>';
    document.getElementById("p-mid").onclick = function(){ setActivePreset(this); setV("mid"); };
    document.getElementById("p-hind").onclick = function(){ setActivePreset(this); setV("hind"); };
    document.getElementById("p-stem").onclick = function(){ setActivePreset(this); setV("stem"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "mid"){
      c.innerHTML =
        '<div class="control-group"><label>Place:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Between thalamus/hypothalamus and pons (PDF p. 7).</div></div>' +
        '<div class="control-group"><label>Dorsal:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Corpora quadrigemina: four lobes (PDF p. 7).</div></div>';
    } else if(view === "hind"){
      c.innerHTML =
        '<div class="control-group"><label>Bridge:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Pons: fibre tracts interconnect (PDF p. 7).</div></div>' +
        '<div class="control-group"><label>Vitals:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Medulla: respiration, reflexes, secretions (PDF p. 7).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Trio:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Mid brain, pons, medulla oblongata (PDF p. 7).</div></div>' +
        '<div class="control-group"><label>Link:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Connections between brain and spinal cord (PDF p. 7).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Midbrain + Hindbrain (§18.4.2-18.4.3)</text>';
    if(view === "mid"){
      m += '<rect x="120" y="80" width="460" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="104" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">MIDBRAIN: thalamus/hypothalamus ↔ pons</text>';
      m += '<text x="350" y="126" fill="#f8fafc" font-size="10" text-anchor="middle">cerebral aqueduct canal through the midbrain</text>';
      m += '<rect x="120" y="156" width="460" height="60" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="350" y="180" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">corpora quadrigemina: four round swellings</text>';
      m += '<text x="350" y="202" fill="#f8fafc" font-size="10" text-anchor="middle">dorsal portion of the midbrain</text>';
      m += '<text x="350" y="248" fill="#f8fafc" font-size="11" text-anchor="middle">receives visual, tactile and auditory inputs</text>';
      m += '<text x="350" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">midbrain + Summary (PDF pp. 7-8)</text>';
      readout(cell("Canal", "cerebral aqueduct passage", "#38bdf8") + cell("Dorsal", "corpora quadrigemina lobes", "#22c55e"));
      verdict("Four lobes between fore and hind.");
    } else if(view === "hind"){
      var rows = [
        ["PONS", "fibre tracts interconnect regions", "#38bdf8"],
        ["CEREBELLUM", "convoluted surface, space for neurons", "#22c55e"],
        ["MEDULLA", "respiration, cardiovascular, gastric", "#f59e0b"]
      ];
      for(var r = 0; r < 3; r++){
        var ry = 76 + r * 68;
        m += '<rect x="120" y="' + ry + '" width="460" height="58" rx="8" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="2"/>';
        m += '<text x="350" y="' + (ry + 23) + '" fill="' + rows[r][2] + '" font-size="11" font-weight="700" text-anchor="middle">' + rows[r][0] + "</text>";
        m += '<text x="350" y="' + (ry + 43) + '" fill="#f8fafc" font-size="10" text-anchor="middle">' + rows[r][1] + "</text>";
      }
      m += '<text x="350" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">cerebellum: semicircular canals + auditory (PDF p. 8)</text>';
      readout(cell("Pons", "fibre tracts interconnect", "#38bdf8") + cell("Medulla", "respiration, reflexes", "#f59e0b"));
      verdict("Bridge, balance, vital centres.");
    } else {
      m += '<rect x="200" y="76" width="300" height="46" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="350" y="104" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">BRAIN STEM: three regions</text>';
      var trio = ["mid brain", "pons", "medulla oblongata"];
      for(var i = 0; i < 3; i++){
        var ty = 134 + i * 44;
        m += '<rect x="230" y="' + ty + '" width="240" height="36" rx="6" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>';
        m += '<text x="350" y="' + (ty + 23) + '" fill="#f8fafc" font-size="11" text-anchor="middle">' + trio[i] + "</text>";
      }
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">forms brain–spinal cord connections (PDF p. 7)</text>';
      readout(cell("Stem", "mid brain, pons, medulla", "#f59e0b") + cell("Link", "brain to spinal cord", "#38bdf8"));
      verdict("Brain meets spinal cord.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-117 -
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
