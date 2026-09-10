// kebo118 interactive simulations: Neural Control and Coordination
window.SIMS = window.SIMS || {};

function cell(title, val, color) {
  return '<div class="readout-cell">' +
    '<div class="readout-label">' + title + '</div>' +
    '<div class="readout-val" style="color:' + (color || 'var(--primary)') + ';">' + val + '</div>' +
    '</div>';
}

function readout(html) {
  var r = document.getElementById("lab-readouts");
  if (r) r.innerHTML = html;
}

function verdict(html) {
  var n = document.getElementById("lab-verdict");
  if (n) n.innerHTML = html;
}

// -------------------------------------------------------------------------
// 1. SIMULATION 1: Neural Organization & Autonomic Reflex Highway (neuronstructuresim)
// -------------------------------------------------------------------------
window.SIMS.neuronstructuresim = (function(){
  var mode = "divisions"; // "divisions", "reflex", "autonomic"
  var stateType = "exercise"; // "rest", "exercise"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#2563eb;"></span><span>CNS (Brain & Spinal Cord)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Afferent / Sensory (Receptors -> CNS)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Somatic Efferent (CNS -> Skeletal)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Autonomic Efferent (CNS -> Viscera)</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" id="btn-org-div" onclick="window.SIMS.neuronstructuresim.setMode(\'divisions\')">Neural Hierarchy</button>' +
        '<button class="lab-btn" id="btn-org-aut" onclick="window.SIMS.neuronstructuresim.setMode(\'autonomic\')">Sympathetic vs Parasympathetic</button>' +
        '<button class="lab-btn" id="btn-org-ref" onclick="window.SIMS.neuronstructuresim.setMode(\'reflex\')">Physical Exercise Stress Loop</button>' +
        '<span style="border-left:1px solid var(--border);height:24px;margin:0 4px;"></span>' +
        '<button class="lab-btn" id="btn-state-toggle" onclick="window.SIMS.neuronstructuresim.toggleState()">Toggle State: ' + (stateType === 'exercise' ? 'High Exercise' : 'Resting Basal') + '</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function setMode(m){
    mode = m;
    render(App.state.t || 0);
  }

  function toggleState(){
    stateType = (stateType === "exercise" ? "rest" : "exercise");
    var btn = document.getElementById("btn-state-toggle");
    if (btn) btn.textContent = "Toggle State: " + (stateType === "exercise" ? "High Exercise" : "Resting Basal");
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;
    var step = Math.min(Math.max(t || 0, 0), 4);

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    if (mode === "divisions") {
      // Tree schematic of Central and Peripheral Nervous System
      h += '<text x="400" y="32" fill="#f8fafc" font-size="18" font-weight="700" text-anchor="middle">HUMAN NEURAL SYSTEM ARCHITECTURE (NCERT SEC 18.2)</text>';

      // Root
      h += '<rect x="300" y="55" width="200" height="40" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
      h += '<text x="400" y="80" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">Human Neural System</text>';

      // Branch to CNS and PNS
      h += '<path d="M 350 95 L 350 120 L 200 120 L 200 145" fill="none" stroke="#64748b" stroke-width="2"/>';
      h += '<path d="M 450 95 L 450 120 L 600 120 L 600 145" fill="none" stroke="#64748b" stroke-width="2"/>';

      // CNS Box
      h += '<rect x="100" y="145" width="200" height="60" rx="8" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>';
      h += '<text x="200" y="170" fill="#93c5fd" font-size="14" font-weight="700" text-anchor="middle">CNS (Central System)</text>';
      h += '<text x="200" y="190" fill="#e0f2fe" font-size="12" text-anchor="middle">Brain + Spinal Cord (Info Processing)</text>';

      // PNS Box
      h += '<rect x="500" y="145" width="200" height="60" rx="8" fill="#14532d" stroke="#4ade80" stroke-width="2"/>';
      h += '<text x="600" y="170" fill="#86efac" font-size="14" font-weight="700" text-anchor="middle">PNS (Peripheral System)</text>';
      h += '<text x="600" y="190" fill="#dcfce7" font-size="12" text-anchor="middle">Cranial &amp; Spinal Nerves</text>';

      // PNS Branches: Afferent vs Efferent
      h += '<path d="M 550 205 L 550 230 L 440 230 L 440 255" fill="none" stroke="#4ade80" stroke-width="2"/>';
      h += '<path d="M 650 205 L 650 230 L 710 230 L 710 255" fill="none" stroke="#4ade80" stroke-width="2"/>';

      // Afferent
      h += '<rect x="360" y="255" width="160" height="50" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>';
      h += '<text x="440" y="275" fill="#6ee7b7" font-size="13" font-weight="700" text-anchor="middle">Afferent Fibres</text>';
      h += '<text x="440" y="293" fill="#a7f3d0" font-size="11" text-anchor="middle">Sensory Receptors &#8594; CNS</text>';

      // Efferent
      h += '<rect x="630" y="255" width="160" height="50" rx="6" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>';
      h += '<text x="710" y="275" fill="#fcd34d" font-size="13" font-weight="700" text-anchor="middle">Efferent Fibres</text>';
      h += '<text x="710" y="293" fill="#fef3c7" font-size="11" text-anchor="middle">CNS &#8594; Regulatory Effectors</text>';

      // Efferent sub-branches: Somatic vs Autonomic
      h += '<path d="M 710 305 L 710 330 L 590 330 L 590 355" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      h += '<path d="M 710 305 L 710 330 L 730 330 L 730 355" fill="none" stroke="#f59e0b" stroke-width="2"/>';

      // Somatic
      h += '<rect x="510" y="355" width="160" height="55" rx="6" fill="#312e81" stroke="#818cf8" stroke-width="1.5"/>';
      h += '<text x="590" y="377" fill="#c7d2fe" font-size="12" font-weight="700" text-anchor="middle">Somatic Neural System</text>';
      h += '<text x="590" y="396" fill="#e0e7ff" font-size="11" text-anchor="middle">CNS &#8594; Skeletal Muscle (Voluntary)</text>';

      // Autonomic
      h += '<rect x="680" y="355" width="115" height="55" rx="6" fill="#831843" stroke="#f472b6" stroke-width="1.5"/>';
      h += '<text x="737" y="375" fill="#fbcfe8" font-size="12" font-weight="700" text-anchor="middle">Autonomic (ANS)</text>';
      h += '<text x="737" y="392" fill="#fdf2f8" font-size="10" text-anchor="middle">CNS &#8594; Visceral Organs</text>';
      h += '<text x="737" y="404" fill="#f9a8d4" font-size="9" text-anchor="middle">Sympathetic + Parasymp.</text>';

      // Visceral Nervous System Banner
      h += '<rect x="100" y="360" width="380" height="60" rx="8" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="4"/>';
      h += '<text x="290" y="385" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">Visceral Nervous System (PNS Sub-complex)</text>';
      h += '<text x="290" y="405" fill="#94a3b8" font-size="11" text-anchor="middle">Entire complex of nerves, fibres, ganglia, &amp; plexuses connecting CNS &#8596; Viscera</text>';

    } else if (mode === "autonomic") {
      // Comparison of Sympathetic vs Parasympathetic
      h += '<text x="400" y="32" fill="#f8fafc" font-size="18" font-weight="700" text-anchor="middle">AUTONOMIC DUAL INNERVATION: SYMPATHETIC VS PARASYMPATHETIC</text>';

      // Sympathetic Column
      h += '<rect x="50" y="60" width="330" height="390" rx="10" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>';
      h += '<text x="215" y="90" fill="#a5b4fc" font-size="16" font-weight="700" text-anchor="middle">Sympathetic System (Fight / Flight)</text>';
      h += '<text x="215" y="110" fill="#c7d2fe" font-size="12" text-anchor="middle">Thoracolumbar Outflow &#8226; Noradrenaline</text>';

      var symRows = [
        { organ: "Eye / Pupil", eff: "Mydriasis (Dilates pupil)", icon: "&#128065;" },
        { organ: "Heart Rate", eff: "Accelerates heart rate &amp; force", icon: "&#9829;" },
        { organ: "Bronchioles", eff: "Bronchodilation (increases O2)", icon: "&#129707;" },
        { organ: "Alimentary Canal", eff: "Inhibits peristalsis &amp; secretions", icon: "&#127829;" },
        { organ: "Urinary Bladder", eff: "Relaxes detrusor (retains urine)", icon: "&#128167;" },
        { organ: "Adrenal Medulla", eff: "Stimulates adrenaline secretion", icon: "&#9889;" }
      ];
      for (var i = 0; i < symRows.length; i++) {
        var y = 135 + i * 50;
        h += '<rect x="65" y="' + (y - 12) + '" width="300" height="42" rx="6" fill="#312e81"/>';
        h += '<text x="80" y="' + (y + 14) + '" fill="#f8fafc" font-size="13" font-weight="600">' + symRows[i].organ + '</text>';
        h += '<text x="350" y="' + (y + 14) + '" fill="#fca5a5" font-size="12" text-anchor="end">' + symRows[i].eff + '</text>';
      }

      // Parasympathetic Column
      h += '<rect x="420" y="60" width="330" height="390" rx="10" fill="#064e3b" stroke="#34d399" stroke-width="2"/>';
      h += '<text x="585" y="90" fill="#6ee7b7" font-size="16" font-weight="700" text-anchor="middle">Parasympathetic (Rest / Digest)</text>';
      h += '<text x="585" y="110" fill="#a7f3d0" font-size="12" text-anchor="middle">Craniosacral Outflow &#8226; Acetylcholine</text>';

      var paraRows = [
        { organ: "Eye / Pupil", eff: "Miosis (Constricts pupil)", icon: "&#128065;" },
        { organ: "Heart Rate", eff: "Slows heart rate (vagal tone)", icon: "&#9829;" },
        { organ: "Bronchioles", eff: "Bronchoconstriction to baseline", icon: "&#129707;" },
        { organ: "Alimentary Canal", eff: "Stimulates peristalsis &amp; digestive juices", icon: "&#127829;" },
        { organ: "Urinary Bladder", eff: "Contracts detrusor (micturition)", icon: "&#128167;" },
        { organ: "Salivary Glands", eff: "Stimulates copious watery saliva", icon: "&#128167;" }
      ];
      for (var j = 0; j < paraRows.length; j++) {
        var py = 135 + j * 50;
        h += '<rect x="435" y="' + (py - 12) + '" width="300" height="42" rx="6" fill="#047857"/>';
        h += '<text x="450" y="' + (py + 14) + '" fill="#f8fafc" font-size="13" font-weight="600">' + paraRows[j].organ + '</text>';
        h += '<text x="720" y="' + (py + 14) + '" fill="#a7f3d0" font-size="12" text-anchor="end">' + paraRows[j].eff + '</text>';
      }

    } else {
      // Physical Exercise Stress Loop
      h += '<text x="400" y="32" fill="#f8fafc" font-size="18" font-weight="700" text-anchor="middle">HOMEODYNAMIC COORDINATION DURING STRENUOUS EXERCISE</text>';

      var isEx = (stateType === "exercise");
      var hr = isEx ? 155 : 72;
      var rr = isEx ? 28 : 14;
      var bp = isEx ? "150 / 85 mmHg" : "120 / 80 mmHg";
      var o2 = isEx ? "1800 mL/min (Surge)" : "250 mL/min (Basal)";

      // Schematic human body with organs
      h += '<circle cx="160" cy="110" r="35" fill="#334155" stroke="#64748b" stroke-width="2"/>'; // Head
      h += '<text x="160" y="115" fill="#f8fafc" font-size="12" text-anchor="middle">Brain (CNS)</text>';

      // Heart
      var heartColor = isEx ? "#ef4444" : "#ec4899";
      h += '<circle cx="160" cy="210" r="30" fill="' + heartColor + '" stroke="#fca5a5" stroke-width="2"/>';
      h += '<text x="160" y="215" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Heart</text>';

      // Lungs
      h += '<ellipse cx="100" cy="205" rx="20" ry="30" fill="#0284c7" stroke="#38bdf8"/>';
      h += '<ellipse cx="220" cy="205" rx="20" ry="30" fill="#0284c7" stroke="#38bdf8"/>';
      h += '<text x="100" y="210" fill="#ffffff" font-size="10" text-anchor="middle">Lung L</text>';
      h += '<text x="220" y="210" fill="#ffffff" font-size="10" text-anchor="middle">Lung R</text>';

      // Active Muscles
      var muscFill = isEx ? "#dc2626" : "#475569";
      h += '<rect x="90" y="300" width="140" height="60" rx="8" fill="' + muscFill + '" stroke="#f87171" stroke-width="2"/>';
      h += '<text x="160" y="325" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Skeletal Muscles</text>';
      h += '<text x="160" y="345" fill="#fee2e2" font-size="11" text-anchor="middle">' + (isEx ? "High Workload & O2 Demand" : "Resting Basal State") + '</text>';

      // Dynamic Connecting pathways
      h += '<path d="M 160 145 L 160 180" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4"/>';
      h += '<path d="M 160 240 L 160 300" stroke="#ef4444" stroke-width="3" stroke-dasharray="4"/>';

      // Telemetry Cards on Right
      h += '<rect x="320" y="70" width="440" height="350" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';
      h += '<text x="540" y="105" fill="#38bdf8" font-size="16" font-weight="700" text-anchor="middle">Physiological Telemetry Monitor</text>';

      var metrics = [
        { label: "Cardiac Output & Rate", val: hr + " bpm", state: isEx ? "Tachycardia / Sympathetic" : "Normal Sinus Rhythm", c: isEx ? "#f87171" : "#4ade80" },
        { label: "Respiratory Ventilation Rate", val: rr + " breaths/min", state: isEx ? "Hyperpnea / Increased tidal vol" : "Eupnea (Normal)", c: isEx ? "#38bdf8" : "#4ade80" },
        { label: "Arterial Blood Pressure", val: bp, state: isEx ? "Elevated systolic perfusion" : "Normotensive", c: isEx ? "#fbbf24" : "#4ade80" },
        { label: "Muscle O2 Consumption Rate", val: o2, state: isEx ? "Accelerated oxidative phosphorylation" : "Basal mitochondrial rate", c: isEx ? "#f43f5e" : "#4ade80" }
      ];

      for (var k = 0; k < metrics.length; k++) {
        var my = 135 + k * 65;
        h += '<rect x="340" y="' + my + '" width="400" height="52" rx="6" fill="#0f172a" stroke="#334155"/>';
        h += '<text x="355" y="' + (my + 22) + '" fill="#94a3b8" font-size="12">' + metrics[k].label + '</text>';
        h += '<text x="355" y="' + (my + 42) + '" fill="' + metrics[k].c + '" font-size="14" font-weight="700">' + metrics[k].val + '</text>';
        h += '<text x="725" y="' + (my + 32) + '" fill="#cbd5e1" font-size="11" text-anchor="end">' + metrics[k].state + '</text>';
      }
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Subsystem Mode", mode.toUpperCase(), "#38bdf8") +
      cell("Current State", stateType.toUpperCase(), stateType === "exercise" ? "#ef4444" : "#10b981") +
      cell("Primary Controller", "CNS (Medulla + Hypothalamus)", "#a855f7") +
      cell("Integration", "Neural + Endocrine Dual Axis", "#f59e0b")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Pedagogical Insight (NCERT Section 18.1):</strong> Homeostasis during exercise requires instant multi-organ coordination. Sympathetic outflow accelerates heart rate and respiration while dilating muscular arterioles. When exercise ceases, parasympathetic vagal tone restores basal cardiovascular and pulmonary equilibrium.' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setMode: setMode,
    toggleState: toggleState,
    setView: setMode
  };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Neuron Morphology & Myelination Architecture (neurontypologysim)
// -------------------------------------------------------------------------
window.SIMS.neurontypologysim = (function(){
  var neuronType = "multipolar"; // "multipolar", "bipolar", "unipolar"
  var showNissl = true;
  var myelinated = true;

  function mount(){
    App.state.maxT = 3;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Cyton / Soma (Cell Body)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Dendrites (Afferent)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Axon &amp; Axon Hillock</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Myelin Sheath (Schwann Cell)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Nissl&#39;s Granules (RER / Ribosomes)</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" id="btn-type-multi" onclick="window.SIMS.neurontypologysim.setType(\'multipolar\')">Multipolar (Cerebral Cortex)</button>' +
        '<button class="lab-btn" id="btn-type-bi" onclick="window.SIMS.neurontypologysim.setType(\'bipolar\')">Bipolar (Retina)</button>' +
        '<button class="lab-btn" id="btn-type-uni" onclick="window.SIMS.neurontypologysim.setType(\'unipolar\')">Unipolar (Embryo)</button>' +
        '<span style="border-left:1px solid var(--border);height:24px;margin:0 4px;"></span>' +
        '<button class="lab-btn" id="btn-toggle-myelin" onclick="window.SIMS.neurontypologysim.toggleMyelin()">Myelin Sheath: ' + (myelinated ? 'Present' : 'Absent') + '</button>' +
        '<button class="lab-btn" id="btn-toggle-nissl" onclick="window.SIMS.neurontypologysim.toggleNissl()">Nissl Granules: ' + (showNissl ? 'ON' : 'OFF') + '</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function setType(t){
    neuronType = t;
    render(App.state.t || 0);
  }

  function toggleMyelin(){
    myelinated = !myelinated;
    var btn = document.getElementById("btn-toggle-myelin");
    if (btn) btn.textContent = "Myelin Sheath: " + (myelinated ? "Present" : "Absent");
    render(App.state.t || 0);
  }

  function toggleNissl(){
    showNissl = !showNissl;
    var btn = document.getElementById("btn-toggle-nissl");
    if (btn) btn.textContent = "Nissl Granules: " + (showNissl ? "ON" : "OFF");
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    var titles = {
      multipolar: "MULTIPOLAR NEURON (1 Axon + 2+ Dendrites) - Cerebral Cortex",
      bipolar: "BIPOLAR NEURON (1 Axon + 1 Dendrite) - Retina of Eye",
      unipolar: "UNIPOLAR NEURON (1 Axon only, No Dendrites) - Embryonic Stage"
    };

    h += '<text x="400" y="32" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">' + titles[neuronType] + '</text>';

    // Main layout
    if (neuronType === "multipolar") {
      // Cyton in left-center
      var cx = 200, cy = 240;

      // Dendrites branching from cyton
      var dendrites = [
        { x1: cx, y1: cy - 40, x2: 130, y2: 120, x3: 90, y3: 80, x4: 150, y4: 60 },
        { x1: cx - 40, y1: cy - 20, x2: 70, y2: 180, x3: 30, y3: 160, x4: 50, y4: 220 },
        { x1: cx - 45, y1: cy + 15, x2: 80, y2: 290, x3: 40, y3: 330, x4: 100, y4: 360 },
        { x1: cx - 15, y1: cy + 45, x2: 140, y2: 380, x3: 120, y3: 430, x4: 180, y4: 430 }
      ];

      for (var d = 0; d < dendrites.length; d++) {
        var dn = dendrites[d];
        h += '<path d="M ' + dn.x1 + ' ' + dn.y1 + ' Q ' + dn.x2 + ' ' + dn.y2 + ' ' + dn.x3 + ' ' + dn.y3 + '" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>';
        h += '<path d="M ' + dn.x2 + ' ' + dn.y2 + ' L ' + dn.x4 + ' ' + dn.y4 + '" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>';
      }

      // Soma Body (Cyton)
      h += '<polygon points="' + (cx) + ',' + (cy - 45) + ' ' + (cx + 40) + ',' + (cy - 20) + ' ' + (cx + 45) + ',' + (cy + 10) + ' ' + (cx) + ',' + (cy + 45) + ' ' + (cx - 40) + ',' + (cy + 25) + ' ' + (cx - 45) + ',' + (cy - 20) + '" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>';

      // Nucleus & Nucleolus
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="18" fill="#3b82f6" stroke="#93c5fd" stroke-width="2"/>';
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#1e1b4b"/>';

      // Nissl Granules inside soma and dendrites
      if (showNissl) {
        var npts = [
          [cx - 20, cy - 10], [cx - 15, cy - 25], [cx + 15, cy - 25], [cx + 25, cy - 5],
          [cx - 25, cy + 15], [cx - 10, cy + 30], [cx + 20, cy + 20], [cx + 5, cy - 30],
          [140, 140], [120, 160], [100, 240], [130, 340], [150, 360]
        ];
        for (var p = 0; p < npts.length; p++) {
          h += '<circle cx="' + npts[p][0] + '" cy="' + npts[p][1] + '" r="3" fill="#c084fc"/>';
        }
      }

      // Axon Hillock (Trigger zone)
      h += '<polygon points="' + (cx + 45) + ',' + (cy - 10) + ' ' + (cx + 70) + ',' + (cy - 5) + ' ' + (cx + 70) + ',' + (cy + 5) + ' ' + (cx + 45) + ',' + (cy + 10) + '" fill="#b45309"/>';
      h += '<text x="' + (cx + 58) + '" y="' + (cy - 16) + '" fill="#fcd34d" font-size="11" text-anchor="middle">Axon Hillock</text>';

      // Axon shaft
      var axonStartX = cx + 70;
      var axonEndX = 660;
      h += '<line x1="' + axonStartX + '" y1="' + cy + '" x2="' + axonEndX + '" y2="' + cy + '" stroke="#f59e0b" stroke-width="6"/>';

      // Myelin sheaths & Nodes of Ranvier
      if (myelinated) {
        var nSegments = 4;
        var segWidth = 90;
        var gap = 20;
        for (var s = 0; s < nSegments; s++) {
          var sx = axonStartX + 10 + s * (segWidth + gap);
          h += '<rect x="' + sx + '" y="' + (cy - 16) + '" width="' + segWidth + '" height="32" rx="8" fill="#ec4899" stroke="#f472b6" stroke-width="2"/>';
          h += '<circle cx="' + (sx + segWidth / 2) + '" cy="' + (cy - 8) + '" r="3" fill="#ffffff"/>'; // Schwann cell nucleus
          h += '<text x="' + (sx + segWidth / 2) + '" y="' + (cy + 8) + '" fill="#ffffff" font-size="10" text-anchor="middle">Schwann Cell</text>';

          // Node of Ranvier indicator
          if (s < nSegments - 1) {
            var nx = sx + segWidth + gap / 2;
            h += '<line x1="' + nx + '" y1="' + (cy - 25) + '" x2="' + nx + '" y2="' + (cy + 25) + '" stroke="#38bdf8" stroke-width="2" stroke-dasharray="2"/>';
            if (s === 1) {
              h += '<text x="' + nx + '" y="' + (cy - 30) + '" fill="#38bdf8" font-size="11" text-anchor="middle">Node of Ranvier</text>';
            }
          }
        }
      } else {
        h += '<text x="400" y="' + (cy - 25) + '" fill="#94a3b8" font-size="12" text-anchor="middle">Unmyelinated Axon (Continuous Axolemma exposed to ECF)</text>';
      }

      // Telodendria & Synaptic Knobs
      var knobs = [
        { x: 740, y: cy - 70 },
        { x: 760, y: cy - 25 },
        { x: 760, y: cy + 25 },
        { x: 740, y: cy + 70 }
      ];
      for (var k = 0; k < knobs.length; k++) {
        h += '<path d="M ' + axonEndX + ' ' + cy + ' Q 700 ' + knobs[k].y + ' ' + (knobs[k].x - 8) + ' ' + knobs[k].y + '" fill="none" stroke="#f59e0b" stroke-width="3"/>';
        h += '<circle cx="' + knobs[k].x + '" cy="' + knobs[k].y + '" r="8" fill="#dc2626" stroke="#f87171" stroke-width="2"/>';
      }
      h += '<text x="730" y="' + (cy + 95) + '" fill="#f87171" font-size="11" text-anchor="middle">Synaptic Knobs</text>';

    } else if (neuronType === "bipolar") {
      // Bipolar neuron: Cyton in center, 1 dendritic branch left, 1 axon branch right
      var cx = 400, cy = 240;

      // Dendrite Left
      h += '<line x1="180" y1="' + cy + '" x2="' + (cx - 30) + '" y2="' + cy + '" stroke="#10b981" stroke-width="5"/>';
      h += '<path d="M 180 ' + cy + ' L 100 ' + (cy - 50) + '" stroke="#10b981" stroke-width="3"/>';
      h += '<path d="M 180 ' + cy + ' L 90 ' + cy + '" stroke="#10b981" stroke-width="3"/>';
      h += '<path d="M 180 ' + cy + ' L 100 ' + (cy + 50) + '" stroke="#10b981" stroke-width="3"/>';
      h += '<text x="120" y="' + (cy - 65) + '" fill="#6ee7b7" font-size="13" font-weight="700">Single Dendrite (Retinal Receptor Input)</text>';

      // Soma
      h += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="32" ry="24" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>';
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="#3b82f6"/>';
      h += '<text x="' + cx + '" y="' + (cy + 42) + '" fill="#93c5fd" font-size="12" font-weight="700" text-anchor="middle">Soma</text>';

      if (showNissl) {
        h += '<circle cx="' + (cx - 15) + '" cy="' + (cy - 8) + '" r="3" fill="#c084fc"/>';
        h += '<circle cx="' + (cx + 15) + '" cy="' + (cy + 8) + '" r="3" fill="#c084fc"/>';
        h += '<circle cx="' + (cx - 10) + '" cy="' + (cy + 10) + '" r="3" fill="#c084fc"/>';
        h += '<circle cx="250" cy="' + cy + '" r="3" fill="#c084fc"/>';
      }

      // Axon Right
      h += '<line x1="' + (cx + 32) + '" y1="' + cy + '" x2="680" y2="' + cy + '" stroke="#f59e0b" stroke-width="5"/>';
      h += '<circle cx="710" cy="' + (cy - 20) + '" r="7" fill="#dc2626"/>';
      h += '<circle cx="710" cy="' + (cy + 20) + '" r="7" fill="#dc2626"/>';
      h += '<path d="M 680 ' + cy + ' L 703 ' + (cy - 20) + '" stroke="#f59e0b" stroke-width="2"/>';
      h += '<path d="M 680 ' + cy + ' L 703 ' + (cy + 20) + '" stroke="#f59e0b" stroke-width="2"/>';
      h += '<text x="560" y="' + (cy - 15) + '" fill="#fcd34d" font-size="13" font-weight="700">Single Axon (To Optic Nerve)</text>';

    } else {
      // Unipolar neuron: Cyton with single emerging process
      var cx = 250, cy = 180;

      // Soma
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="35" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>';
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="#3b82f6"/>';
      h += '<text x="' + cx + '" y="' + (cy - 45) + '" fill="#93c5fd" font-size="13" font-weight="700" text-anchor="middle">Embryonic Soma (No Dendrites)</text>';

      if (showNissl) {
        h += '<circle cx="' + (cx - 15) + '" cy="' + (cy - 10) + '" r="3" fill="#c084fc"/>';
        h += '<circle cx="' + (cx + 15) + '" cy="' + (cy + 10) + '" r="3" fill="#c084fc"/>';
        h += '<circle cx="' + cx + '" cy="' + (cy + 15) + '" r="3" fill="#c084fc"/>';
      }

      // Single emerging axon stem that branches
      h += '<path d="M ' + cx + ' ' + (cy + 35) + ' L ' + cx + ' 290 L 680 290" fill="none" stroke="#f59e0b" stroke-width="5"/>';
      h += '<text x="460" y="275" fill="#fcd34d" font-size="13" font-weight="700">Single Axonal Process</text>';

      // Terminal arborization
      h += '<circle cx="710" cy="270" r="7" fill="#dc2626"/>';
      h += '<circle cx="710" cy="310" r="7" fill="#dc2626"/>';
      h += '<path d="M 680 290 L 703 270" stroke="#f59e0b" stroke-width="2"/>';
      h += '<path d="M 680 290 L 703 310" stroke="#f59e0b" stroke-width="2"/>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Neuron Morphology", neuronType.toUpperCase(), "#38bdf8") +
      cell("Anatomical Location", neuronType === "multipolar" ? "Cerebral Cortex" : neuronType === "bipolar" ? "Retina of Eye" : "Embryonic Stage", "#10b981") +
      cell("Nissl&#39;s Granules", showNissl ? "Soma &amp; Dendrites Only" : "Hidden", "#c084fc") +
      cell("Myelination", myelinated ? "Schwann (Nodes of Ranvier)" : "Unmyelinated", "#ec4899")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>High-Yield NCERT Fact:</strong> Nissl&#39;s granules are dense basophilic ribonucleoprotein bodies (RER + ribosomes) present in the cell body and dendrites, but <em>strictly absent</em> from the axon hillock and axon cylinder.' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setType: setType,
    toggleMyelin: toggleMyelin,
    toggleNissl: toggleNissl,
    setView: setType
  };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Resting Membrane Potential & Electrogenic Na+/K+ Lab (restingpotentialsim)
// -------------------------------------------------------------------------
window.SIMS.restingpotentialsim = (function(){
  var pumpRate = 100; // 0 to 100%
  var kPerm = 1.0; // 0.1 to 2.0x
  var isOuabain = false;

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Na+ (High Extracellular: ~142 mM)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>K+ (High Intracellular: ~140 mM)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Impermeant Protein Anions (A-)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Na+/K+ ATPase Pump (3 Na+ out : 2 K+ in)</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">' +
        '<label style="color:#cbd5e1;font-size:13px;">Na+/K+ Pump Rate: <span id="val-pump" style="color:#f59e0b;font-weight:700;">' + pumpRate + '%</span></label>' +
        '<input type="range" min="0" max="100" value="' + pumpRate + '" oninput="window.SIMS.restingpotentialsim.setPump(this.value)" style="width:110px;">' +
        '<label style="color:#cbd5e1;font-size:13px;">K+ Leak Permeability: <span id="val-kperm" style="color:#38bdf8;font-weight:700;">' + kPerm.toFixed(1) + 'x</span></label>' +
        '<input type="range" min="1" max="20" value="' + (kPerm * 10) + '" oninput="window.SIMS.restingpotentialsim.setKPerm(this.value / 10)" style="width:110px;">' +
        '<span style="border-left:1px solid var(--border);height:24px;margin:0 4px;"></span>' +
        '<button class="lab-btn" id="btn-ouabain" onclick="window.SIMS.restingpotentialsim.toggleOuabain()">Ouabain (Pump Inhibitor): ' + (isOuabain ? 'ACTIVE' : 'OFF') + '</button>' +
        '<button class="lab-btn" onclick="window.SIMS.restingpotentialsim.reset()">Reset to -70 mV</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function setPump(v){
    pumpRate = parseInt(v, 10);
    var el = document.getElementById("val-pump");
    if (el) el.textContent = pumpRate + "%";
    render(App.state.t || 0);
  }

  function setKPerm(v){
    kPerm = parseFloat(v);
    var el = document.getElementById("val-kperm");
    if (el) el.textContent = kPerm.toFixed(1) + "x";
    render(App.state.t || 0);
  }

  function toggleOuabain(){
    isOuabain = !isOuabain;
    if (isOuabain) pumpRate = 0;
    else pumpRate = 100;
    var btn = document.getElementById("btn-ouabain");
    if (btn) btn.textContent = "Ouabain (Pump Inhibitor): " + (isOuabain ? "ACTIVE" : "OFF");
    var pel = document.getElementById("val-pump");
    if (pel) pel.textContent = pumpRate + "%";
    render(App.state.t || 0);
  }

  function reset(){
    pumpRate = 100;
    kPerm = 1.0;
    isOuabain = false;
    var btn = document.getElementById("btn-ouabain");
    if (btn) btn.textContent = "Ouabain (Pump Inhibitor): OFF";
    var pel = document.getElementById("val-pump");
    if (pel) pel.textContent = "100%";
    var kel = document.getElementById("val-kperm");
    if (kel) kel.textContent = "1.0x";
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    // Calculate simulated membrane potential Vm
    // Baseline -70 mV. As pump drops, decays towards 0 mV. Higher K perm hyperpolarizes towards -85 mV.
    var effectivePump = isOuabain ? 0 : pumpRate;
    var vm = -15 - (55 * (effectivePump / 100)) * (kPerm / 1.0);
    vm = Math.min(-5, Math.max(-90, Math.round(vm)));

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">RESTING MEMBRANE POTENTIAL &amp; ELECTROGENIC IONIC GRADIENTS</text>';

    // ECF Compartment (Top)
    h += '<rect x="40" y="45" width="530" height="135" fill="#1e293b" rx="8"/>';
    h += '<text x="50" y="65" fill="#94a3b8" font-size="12" font-weight="700">EXTRACELLULAR FLUID (ECF) - Outer Electropositive Charge (+)</text>';
    h += '<text x="50" y="85" fill="#fca5a5" font-size="11">[Na+] = 142 mM (High) &#8226; [K+] = 4.5 mM (Low)</text>';

    // ECF Ion dots
    for (var ni = 0; ni < 18; ni++) {
      var nx = 60 + (ni * 28) % 500;
      var ny = 100 + Math.sin(ni) * 20;
      h += '<circle cx="' + nx + '" cy="' + ny + '" r="5" fill="#ef4444"/>';
      h += '<text x="' + nx + '" y="' + (ny + 3) + '" fill="#ffffff" font-size="7" font-weight="700" text-anchor="middle">+</text>';
    }
    for (var ki = 0; ki < 4; ki++) {
      var kx = 100 + ki * 110;
      h += '<circle cx="' + kx + '" cy="140" r="5" fill="#3b82f6"/>';
      h += '<text x="' + kx + '" y="143" fill="#ffffff" font-size="7" font-weight="700" text-anchor="middle">+</text>';
    }

    // Outer surface positive charge symbols
    for (var c = 0; c < 15; c++) {
      h += '<text x="' + (60 + c * 34) + '" y="176" fill="#4ade80" font-size="16" font-weight="700">+</text>';
    }

    // Lipid Bilayer (Axolemma)
    h += '<rect x="40" y="185" width="530" height="40" fill="#334155" rx="4"/>';
    h += '<line x1="40" y1="185" x2="570" y2="185" stroke="#64748b" stroke-width="2"/>';
    h += '<line x1="40" y1="225" x2="570" y2="225" stroke="#64748b" stroke-width="2"/>';
    h += '<text x="70" y="210" fill="#f8fafc" font-size="12" font-weight="700">Axonal Plasma Membrane (Axolemma)</text>';

    // Na+/K+ Pump Channel
    h += '<rect x="350" y="180" width="70" height="50" rx="6" fill="#d97706" stroke="#fcd34d" stroke-width="2"/>';
    h += '<text x="385" y="202" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">Na+/K+ Pump</text>';
    h += '<text x="385" y="218" fill="#fef3c7" font-size="8" text-anchor="middle">' + (effectivePump > 0 ? 'Active (ATP)' : 'INHIBITED') + '</text>';

    // Arrow 3 Na+ out
    h += '<path d="M 370 240 L 370 170" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arr)"/>';
    h += '<text x="360" y="165" fill="#ef4444" font-size="10" font-weight="700">3 Na+ &#8593;</text>';

    // Arrow 2 K+ in
    h += '<path d="M 400 170 L 400 240" stroke="#3b82f6" stroke-width="2.5"/>';
    h += '<text x="410" y="248" fill="#3b82f6" font-size="10" font-weight="700">2 K+ &#8595;</text>';

    // Non-gated K+ Leak Channel
    h += '<rect x="200" y="180" width="45" height="50" rx="6" fill="#1d4ed8" stroke="#93c5fd" stroke-width="2"/>';
    h += '<text x="222" y="202" fill="#ffffff" font-size="9" font-weight="700" text-anchor="middle">K+ Leak</text>';
    h += '<text x="222" y="218" fill="#bfdbfe" font-size="8" text-anchor="middle">Passive</text>';
    h += '<path d="M 222 235 L 222 170" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3"/>';
    h += '<text x="222" y="165" fill="#3b82f6" font-size="10" font-weight="700" text-anchor="middle">K+ Efflux &#8593;</text>';

    // Inner surface negative charge symbols
    for (var cn = 0; cn < 15; cn++) {
      h += '<text x="' + (60 + cn * 34) + '" y="242" fill="#f87171" font-size="20" font-weight="700">-</text>';
    }

    // Axoplasm Compartment (Bottom)
    h += '<rect x="40" y="245" width="530" height="190" fill="#0f172a" stroke="#334155" rx="8"/>';
    h += '<text x="50" y="265" fill="#94a3b8" font-size="12" font-weight="700">INTRACELLULAR AXOPLASM - Inner Electronegative Charge (-)</text>';
    h += '<text x="50" y="285" fill="#93c5fd" font-size="11">[K+] = 140 mM (High) &#8226; [Na+] = 12 mM (Low) &#8226; Trapped Anionic Proteins (A-)</text>';

    // Axoplasm Ion dots
    for (var ki2 = 0; ki2 < 18; ki2++) {
      var kx2 = 60 + (ki2 * 28) % 500;
      var ky2 = 310 + Math.sin(ki2 * 1.5) * 20;
      h += '<circle cx="' + kx2 + '" cy="' + ky2 + '" r="5" fill="#3b82f6"/>';
      h += '<text x="' + kx2 + '" y="' + (ky2 + 3) + '" fill="#ffffff" font-size="7" font-weight="700" text-anchor="middle">+</text>';
    }
    // Trapped Large Proteins A-
    for (var ai = 0; ai < 6; ai++) {
      var ax = 80 + ai * 80;
      h += '<rect x="' + ax + '" y="370" width="36" height="22" rx="4" fill="#6b21a8" stroke="#d8b4fe"/>';
      h += '<text x="' + (ax + 18) + '" y="385" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">A -</text>';
    }

    // Voltmeter on Right
    h += '<rect x="590" y="45" width="180" height="390" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
    h += '<text x="680" y="75" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">DIGITAL VOLTMETER</text>';

    // Voltmeter readout screen
    var voltColor = vm <= -65 ? "#4ade80" : (vm < -30 ? "#facc15" : "#ef4444");
    h += '<rect x="605" y="95" width="150" height="70" rx="8" fill="#020617" stroke="#334155"/>';
    h += '<text x="680" y="142" fill="' + voltColor + '" font-size="32" font-weight="800" text-anchor="middle">' + vm + ' mV</text>';
    h += '<text x="680" y="185" fill="#94a3b8" font-size="12" text-anchor="middle">Resting Vm</text>';

    // Gauge bar
    h += '<rect x="615" y="210" width="130" height="16" rx="4" fill="#0f172a" stroke="#475569"/>';
    var barW = Math.max(0, Math.min(130, Math.round(((vm + 90) / 90) * 130)));
    h += '<rect x="615" y="210" width="' + barW + '" height="16" rx="4" fill="' + voltColor + '"/>';
    h += '<text x="620" y="240" fill="#64748b" font-size="10">-90 mV</text>';
    h += '<text x="735" y="240" fill="#64748b" font-size="10" text-anchor="end">0 mV</text>';

    // Status diagnostics
    h += '<text x="680" y="275" fill="#e2e8f0" font-size="12" font-weight="700" text-anchor="middle">Membrane Status:</text>';
    var statusText = vm <= -65 ? "POLARIZED (RESTING)" : (vm < -30 ? "PARTIALLY DEPOLARIZED" : "COLLAPSED GRADIENT");
    h += '<text x="680" y="295" fill="' + voltColor + '" font-size="11" font-weight="700" text-anchor="middle">' + statusText + '</text>';

    h += '<text x="680" y="335" fill="#94a3b8" font-size="11" text-anchor="middle">Na+/K+ Pump Stoichiometry:</text>';
    h += '<text x="680" y="355" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">3 Na+ out / 2 K+ in</text>';
    h += '<text x="680" y="375" fill="#38bdf8" font-size="11" text-anchor="middle">consumes 1 ATP / cycle</text>';

    if (isOuabain) {
      h += '<rect x="605" y="395" width="150" height="28" rx="4" fill="#7f1d1d" stroke="#f87171"/>';
      h += '<text x="680" y="413" fill="#fee2e2" font-size="10" font-weight="700" text-anchor="middle">OUABAIN POISONED</text>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Membrane Potential", vm + " mV", voltColor) +
      cell("Na+/K+ ATPase", effectivePump + "%", effectivePump > 0 ? "#10b981" : "#ef4444") +
      cell("K+ Permeability", kPerm.toFixed(1) + "x (Dominant)", "#38bdf8") +
      cell("Polarization State", vm <= -65 ? "Normal (-70 mV)" : "Decaying", voltColor)
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Electrophysiological Principle:</strong> The resting potential of -70 mV is primarily set by high resting K+ permeability (K+ leaks out down its chemical gradient leaving negative protein anions behind) and maintained continuously against passive leaks by the electrogenic Na+/K+ ATPase pump (3 Na+ out : 2 K+ in).' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setPump: setPump,
    setKPerm: setKPerm,
    toggleOuabain: toggleOuabain,
    reset: reset,
    setView: setPump
  };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Action Potential Spike & Local Circuit Conduction Engine (actionpotentialsim)
// -------------------------------------------------------------------------
window.SIMS.actionpotentialsim = (function(){
  var simPhase = "resting"; // "resting", "depol", "peak", "repol", "hyperpol"
  var conductionMode = "saltatory"; // "continuous", "saltatory"
  var drug = "none"; // "none", "ttx", "tea"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Depolarization (+30 mV Na+ Influx)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Repolarization (-70 mV K+ Efflux)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Local Circuit Current Loop (A -> B)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Saltatory Conduction at Nodes</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" id="btn-fire-stim" onclick="window.SIMS.actionpotentialsim.stimulate()">Fire Threshold Stimulus</button>' +
        '<button class="lab-btn" id="btn-toggle-cond" onclick="window.SIMS.actionpotentialsim.toggleConduction()">Mode: ' + (conductionMode === 'saltatory' ? 'Saltatory (Myelinated)' : 'Continuous (Unmyelinated)') + '</button>' +
        '<span style="border-left:1px solid var(--border);height:24px;margin:0 4px;"></span>' +
        '<button class="lab-btn" id="btn-drug-ttx" onclick="window.SIMS.actionpotentialsim.setDrug(\'ttx\')">Apply TTX (Block Na+)</button>' +
        '<button class="lab-btn" id="btn-drug-tea" onclick="window.SIMS.actionpotentialsim.setDrug(\'tea\')">Apply TEA (Block K+)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.actionpotentialsim.reset()">Reset</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function stimulate(){
    if (drug === "ttx") {
      simPhase = "resting";
      render(0);
      alert("TTX Blocks Voltage-Gated Na+ Channels! No action potential can be triggered.");
      return;
    }
    // Animate through phases
    simPhase = "depol";
    render(1);
    setTimeout(function(){
      simPhase = "peak";
      render(2);
      setTimeout(function(){
        simPhase = (drug === "tea" ? "peak" : "repol");
        render(3);
        setTimeout(function(){
          simPhase = (drug === "tea" ? "peak" : "hyperpol");
          render(4);
          setTimeout(function(){
            simPhase = "resting";
            render(0);
          }, 1200);
        }, 900);
      }, 700);
    }, 500);
  }

  function toggleConduction(){
    conductionMode = (conductionMode === "saltatory" ? "continuous" : "saltatory");
    var btn = document.getElementById("btn-toggle-cond");
    if (btn) btn.textContent = "Mode: " + (conductionMode === "saltatory" ? "Saltatory (Myelinated)" : "Continuous (Unmyelinated)");
    render(App.state.t || 0);
  }

  function setDrug(d){
    drug = (drug === d ? "none" : d);
    render(App.state.t || 0);
  }

  function reset(){
    simPhase = "resting";
    drug = "none";
    render(0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    var voltages = {
      resting: -70,
      depol: -20,
      peak: +30,
      repol: -60,
      hyperpol: -80
    };
    var currentVm = voltages[simPhase] || -70;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">ACTION POTENTIAL GENERATION &amp; AXONAL CONDUCTION LOOPS</text>';

    // Left Half: Real-time Oscilloscope Membrane Potential Graph
    h += '<rect x="40" y="50" width="350" height="240" rx="8" fill="#020617" stroke="#334155" stroke-width="1.5"/>';
    h += '<text x="55" y="72" fill="#38bdf8" font-size="13" font-weight="700">OSCILLOSCOPE: Vm (mV) vs Time (ms)</text>';

    // Grid lines
    var yVals = [
      { v: "+40", y: 90 },
      { v: "+30 (Peak)", y: 105 },
      { v: "0", y: 145 },
      { v: "-55 (Threshold)", y: 215 },
      { v: "-70 (RMP)", y: 235 },
      { v: "-85", y: 255 }
    ];
    for (var gy = 0; gy < yVals.length; gy++) {
      h += '<line x1="120" y1="' + yVals[gy].y + '" x2="380" y2="' + yVals[gy].y + '" stroke="#1e293b" stroke-width="1"/>';
      h += '<text x="110" y="' + (yVals[gy].y + 4) + '" fill="#64748b" font-size="9" text-anchor="end">' + yVals[gy].v + '</text>';
    }

    // Baseline Curve
    // Resting: -70 (y=235), Threshold: -55 (y=215), Peak: +30 (y=105), Repol: y=235, Hyper: y=250, Return: y=235
    var pathD = 'M 130 235 L 180 235 Q 200 215 220 105 Q 240 235 260 250 Q 280 235 370 235';
    h += '<path d="' + pathD + '" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="3"/>';

    // Highlight current point on curve
    var phaseCoords = {
      resting: { x: 160, y: 235 },
      depol: { x: 210, y: 160 },
      peak: { x: 220, y: 105 },
      repol: { x: 245, y: 210 },
      hyperpol: { x: 260, y: 250 }
    };
    var pt = phaseCoords[simPhase] || phaseCoords.resting;
    h += '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>';

    // Current Vm banner
    h += '<rect x="270" y="60" width="110" height="32" rx="6" fill="#1e293b" stroke="#38bdf8"/>';
    h += '<text x="325" y="81" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">' + currentVm + ' mV</text>';

    // Right Half: Molecular Channel State (Na+ & K+ gates)
    h += '<rect x="410" y="50" width="350" height="240" rx="8" fill="#1e293b" stroke="#334155"/>';
    h += '<text x="585" y="75" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">Axolemmal Voltage-Gated Ion Channels</text>';

    // VGSC (Na+ Channel)
    h += '<rect x="430" y="100" width="140" height="120" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
    h += '<text x="500" y="125" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">VG Na+ Channel</text>';
    var naStatus = (simPhase === "depol" || simPhase === "peak") ? "OPEN (Na+ Influx)" : (simPhase === "repol" ? "INACTIVATED (h-gate shut)" : "CLOSED (Resting)");
    var naColor = (simPhase === "depol" || simPhase === "peak") ? "#4ade80" : (simPhase === "repol" ? "#f59e0b" : "#94a3b8");
    h += '<text x="500" y="150" fill="' + naColor + '" font-size="10" font-weight="600" text-anchor="middle">' + naStatus + '</text>';
    if (drug === "ttx") {
      h += '<text x="500" y="180" fill="#dc2626" font-size="11" font-weight="700" text-anchor="middle">[BLOCKED BY TTX]</text>';
    }

    // VGKC (K+ Channel)
    h += '<rect x="600" y="100" width="140" height="120" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>';
    h += '<text x="670" y="125" fill="#3b82f6" font-size="12" font-weight="700" text-anchor="middle">VG K+ Channel</text>';
    var kStatus = (simPhase === "repol" || simPhase === "hyperpol") ? "OPEN (K+ Efflux)" : "CLOSED";
    var kColor = (simPhase === "repol" || simPhase === "hyperpol") ? "#4ade80" : "#94a3b8";
    h += '<text x="670" y="150" fill="' + kColor + '" font-size="10" font-weight="600" text-anchor="middle">' + kStatus + '</text>';
    if (drug === "tea") {
      h += '<text x="670" y="180" fill="#dc2626" font-size="11" font-weight="700" text-anchor="middle">[BLOCKED BY TEA]</text>';
    }

    // Bottom Half: Spatial Axon Longitudinal Cross-Section (Site A -> Site B)
    h += '<rect x="40" y="305" width="720" height="160" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>';
    h += '<text x="60" y="328" fill="#38bdf8" font-size="13" font-weight="700">SPATIAL IMPULSE CONDUCTION &amp; LOCAL CURRENT CIRCUITS (NCERT FIG 18.2)</text>';

    // Axon Cylinder
    var axY = 375;
    h += '<rect x="60" y="' + (axY - 25) + '" width="680" height="50" fill="#1e293b" stroke="#64748b" stroke-width="2"/>';

    // Myelination blocks or continuous
    if (conductionMode === "saltatory") {
      // Myelin segments
      h += '<rect x="60" y="' + (axY - 35) + '" width="140" height="70" rx="8" fill="#ec4899" fill-opacity="0.3" stroke="#ec4899" stroke-width="2"/>';
      h += '<rect x="240" y="' + (axY - 35) + '" width="140" height="70" rx="8" fill="#ec4899" fill-opacity="0.3" stroke="#ec4899" stroke-width="2"/>';
      h += '<rect x="420" y="' + (axY - 35) + '" width="140" height="70" rx="8" fill="#ec4899" fill-opacity="0.3" stroke="#ec4899" stroke-width="2"/>';
      h += '<rect x="600" y="' + (axY - 35) + '" width="140" height="70" rx="8" fill="#ec4899" fill-opacity="0.3" stroke="#ec4899" stroke-width="2"/>';

      // Node A (210) and Node B (390)
      h += '<text x="220" y="' + (axY - 40) + '" fill="#facc15" font-size="12" font-weight="700" text-anchor="middle">Node A</text>';
      h += '<text x="400" y="' + (axY - 40) + '" fill="#facc15" font-size="12" font-weight="700" text-anchor="middle">Node B</text>';

      // Jumping arc
      h += '<path d="M 220 ' + (axY - 35) + ' Q 310 ' + (axY - 70) + ' 400 ' + (axY - 35) + '" fill="none" stroke="#facc15" stroke-width="3" stroke-dasharray="4"/>';
      h += '<text x="310" y="' + (axY - 55) + '" fill="#facc15" font-size="11" font-weight="700" text-anchor="middle">Saltatory Jump (~100 m/s)</text>';

    } else {
      // Continuous Conduction: Point A vs Point B with charges
      h += '<text x="200" y="' + (axY - 30) + '" fill="#ef4444" font-size="13" font-weight="700" text-anchor="middle">Site A (Excited)</text>';
      h += '<text x="380" y="' + (axY - 30) + '" fill="#60a5fa" font-size="13" font-weight="700" text-anchor="middle">Site B (Resting)</text>';

      // Site A: Outer negative (-), Inner positive (+)
      h += '<text x="180" y="' + (axY - 10) + '" fill="#f87171" font-size="18" font-weight="700">-  -  -</text>';
      h += '<text x="180" y="' + (axY + 15) + '" fill="#4ade80" font-size="18" font-weight="700">+  +  +</text>';

      // Site B: Outer positive (+), Inner negative (-)
      h += '<text x="360" y="' + (axY - 10) + '" fill="#4ade80" font-size="18" font-weight="700">+  +  +</text>';
      h += '<text x="360" y="' + (axY + 15) + '" fill="#f87171" font-size="18" font-weight="700">-  -  -</text>';

      // Local current loops
      // Inside: A to B
      h += '<path d="M 230 ' + (axY + 10) + ' L 350 ' + (axY + 10) + '" stroke="#facc15" stroke-width="2.5" marker-end="url(#arr)"/>';
      h += '<text x="290" y="' + (axY + 22) + '" fill="#facc15" font-size="9" text-anchor="middle">Inner Current: A &#8594; B</text>';

      // Outside: B to A
      h += '<path d="M 350 ' + (axY - 15) + ' L 230 ' + (axY - 15) + '" stroke="#facc15" stroke-width="2.5"/>';
      h += '<text x="290" y="' + (axY - 18) + '" fill="#facc15" font-size="9" text-anchor="middle">Outer Current: B &#8594; A</text>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Phase", simPhase.toUpperCase(), "#f87171") +
      cell("Voltage", currentVm + " mV", "#38bdf8") +
      cell("Conduction Mode", conductionMode.toUpperCase(), "#f59e0b") +
      cell("Velocity", conductionMode === "saltatory" ? "100-120 m/s" : "0.5-2.0 m/s", "#10b981")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>NCERT Figure 18.2 Conduction Law:</strong> Depolarization at Site A reverses polarity. Current flows on the inner surface from Site A &#8594; Site B and on the outer surface from Site B &#8594; Site A, completing a local closed circuit that depolarizes Site B to threshold.' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    stimulate: stimulate,
    toggleConduction: toggleConduction,
    setDrug: setDrug,
    reset: reset,
    setView: toggleConduction
  };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Chemical Synapse Neurotransmitter Exocytosis Lab (synaptictransmissionsim)
// -------------------------------------------------------------------------
window.SIMS.synaptictransmissionsim = (function(){
  var stepIndex = 0; // 0: Resting, 1: Ca2+ Influx, 2: Vesicle Exocytosis, 3: Cleft Diffusion & Binding, 4: EPSP / IPSP
  var ntType = "ACh"; // "ACh" (Excitatory EPSP) or "GABA" (Inhibitory IPSP)
  var hasAChEInhibitor = false;

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Pre-synaptic Terminal (Synaptic Knob)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Synaptic Vesicles with Neurotransmitter</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Ca2+ Influx through Voltage-gated Channels</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Post-synaptic Receptors &amp; Ion Channels</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" onclick="window.SIMS.synaptictransmissionsim.triggerAP()">Trigger Action Potential</button>' +
        '<button class="lab-btn" onclick="window.SIMS.synaptictransmissionsim.nextStep()">Step Forward (' + stepIndex + '/4)</button>' +
        '<span style="border-left:1px solid var(--border);height:24px;margin:0 4px;"></span>' +
        '<button class="lab-btn" id="btn-nt-type" onclick="window.SIMS.synaptictransmissionsim.toggleNT()">Neurotransmitter: ' + ntType + ' (' + (ntType === 'ACh' ? 'EPSP Depolarization' : 'IPSP Hyperpolarization') + ')</button>' +
        '<button class="lab-btn" id="btn-ache-inh" onclick="window.SIMS.synaptictransmissionsim.toggleAChE()">AChE Inhibitor (Organophosphate): ' + (hasAChEInhibitor ? 'ON' : 'OFF') + '</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function triggerAP(){
    stepIndex = 1;
    render(1);
    setTimeout(function(){
      stepIndex = 2;
      render(2);
      setTimeout(function(){
        stepIndex = 3;
        render(3);
        setTimeout(function(){
          stepIndex = 4;
          render(4);
          if (!hasAChEInhibitor) {
            setTimeout(function(){
              stepIndex = 0;
              render(0);
            }, 1800);
          }
        }, 800);
      }, 800);
    }, 800);
  }

  function nextStep(){
    stepIndex = (stepIndex + 1) % 5;
    render(stepIndex);
  }

  function toggleNT(){
    ntType = (ntType === "ACh" ? "GABA" : "ACh");
    var btn = document.getElementById("btn-nt-type");
    if (btn) btn.textContent = "Neurotransmitter: " + ntType + " (" + (ntType === "ACh" ? "EPSP Depolarization" : "IPSP Hyperpolarization") + ")";
    render(stepIndex);
  }

  function toggleAChE(){
    hasAChEInhibitor = !hasAChEInhibitor;
    var btn = document.getElementById("btn-ache-inh");
    if (btn) btn.textContent = "AChE Inhibitor (Organophosphate): " + (hasAChEInhibitor ? "ON" : "OFF");
    render(stepIndex);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;
    var s = (t !== undefined && typeof t === "number") ? t : stepIndex;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">CHEMICAL SYNAPSE ULTRASTRUCTURE &amp; TRANSMISSION CASCADE</text>';

    // Pre-synaptic Axon Terminal Bulb (Top Half)
    h += '<path d="M 320 40 L 320 120 C 320 200 240 230 240 250 L 560 250 C 560 230 480 200 480 120 L 480 40 Z" fill="#1e293b" stroke="#64748b" stroke-width="2"/>';
    h += '<text x="400" y="100" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">Pre-Synaptic Axon Terminal (Synaptic Knob)</text>';

    // Mitochondria inside knob
    h += '<ellipse cx="360" cy="140" rx="25" ry="12" fill="#831843" stroke="#f472b6"/>';
    h += '<text x="360" y="144" fill="#fdf2f8" font-size="8" text-anchor="middle">Mito</text>';

    // Voltage-Gated Ca2+ channels on pre-synaptic membrane flanks
    h += '<rect x="245" y="210" width="16" height="30" rx="3" fill="#2563eb" stroke="#93c5fd"/>';
    h += '<rect x="539" y="210" width="16" height="30" rx="3" fill="#2563eb" stroke="#93c5fd"/>';
    h += '<text x="210" y="228" fill="#93c5fd" font-size="10" font-weight="700">VG Ca2+</text>';

    // Influx of Ca2+ during step >= 1
    if (s >= 1) {
      h += '<circle cx="270" cy="225" r="5" fill="#38bdf8"/>';
      h += '<text x="270" y="228" fill="#0f172a" font-size="7" font-weight="700" text-anchor="middle">Ca2+</text>';
      h += '<circle cx="530" cy="225" r="5" fill="#38bdf8"/>';
      h += '<text x="530" y="228" fill="#0f172a" font-size="7" font-weight="700" text-anchor="middle">Ca2+</text>';
    }

    // Synaptic Vesicles
    var vPositions = [
      { x: 340, y: 180 }, { x: 380, y: 175 }, { x: 420, y: 180 }, { x: 450, y: 185 },
      { x: 360, y: 210 }, { x: 400, y: 215 }, { x: 440, y: 210 }
    ];
    for (var vi = 0; vi < vPositions.length; vi++) {
      var vy = vPositions[vi].y;
      if (s >= 2 && vi >= 4) {
        vy = 245; // Docked at active zone
      }
      h += '<circle cx="' + vPositions[vi].x + '" cy="' + vy + '" r="10" fill="#f59e0b" stroke="#fef08a" stroke-width="1.5"/>';
      h += '<circle cx="' + vPositions[vi].x + '" cy="' + vy + '" r="3" fill="#dc2626"/>';
    }

    // Synaptic Cleft (20-40 nm space)
    h += '<rect x="220" y="252" width="360" height="40" fill="#020617" stroke="#38bdf8" stroke-dasharray="2"/>';
    h += '<text x="140" y="275" fill="#38bdf8" font-size="12" font-weight="700">Synaptic Cleft (~20-40 nm)</text>';

    // Released Neurotransmitters in cleft (steps >= 2)
    if (s >= 2) {
      var ntColor = (ntType === "ACh" ? "#facc15" : "#c084fc");
      for (var nti = 0; nti < 16; nti++) {
        var ntx = 260 + (nti * 18);
        var nty = 265 + (nti % 3) * 6;
        h += '<circle cx="' + ntx + '" cy="' + nty + '" r="3.5" fill="' + ntColor + '"/>';
      }
    }

    // Post-Synaptic Membrane (Bottom Half)
    h += '<rect x="220" y="295" width="360" height="120" rx="8" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>';
    h += '<text x="400" y="345" fill="#c7d2fe" font-size="14" font-weight="700" text-anchor="middle">Post-Synaptic Membrane (Dendrite / Effector)</text>';

    // Post-Synaptic Ligand-Gated Receptors
    var rPos = [260, 310, 360, 410, 460, 510];
    for (var ri = 0; ri < rPos.length; ri++) {
      var rx = rPos[ri];
      var isBound = (s >= 3);
      h += '<rect x="' + rx + '" y="290" width="22" height="15" rx="3" fill="' + (isBound ? '#10b981' : '#475569') + '" stroke="#94a3b8"/>';
      if (isBound) {
        h += '<circle cx="' + (rx + 11) + '" cy="290" r="3" fill="#facc15"/>'; // Bound NT
        // Downward ion influx arrows
        h += '<path d="M ' + (rx + 11) + ' 305 L ' + (rx + 11) + ' 325" stroke="' + (ntType === 'ACh' ? '#4ade80' : '#f43f5e') + '" stroke-width="2"/>';
      }
    }

    // Readout panel on right
    h += '<rect x="600" y="50" width="180" height="380" rx="8" fill="#1e293b" stroke="#334155"/>';
    h += '<text x="690" y="80" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">TRANSMISSION STAGES</text>';

    var stages = [
      { id: 0, text: "0. Resting Terminal" },
      { id: 1, text: "1. AP Arrival & Ca2+ Influx" },
      { id: 2, text: "2. Vesicle Docking & Exocytosis" },
      { id: 3, text: "3. Cleft Diffusion & Binding" },
      { id: 4, text: "4. Post-Synaptic Potential" }
    ];
    for (var st = 0; st < stages.length; st++) {
      var sy = 110 + st * 48;
      var active = (s === stages[st].id);
      h += '<rect x="610" y="' + sy + '" width="160" height="36" rx="6" fill="' + (active ? '#2563eb' : '#0f172a') + '" stroke="' + (active ? '#60a5fa' : '#334155') + '"/>';
      h += '<text x="620" y="' + (sy + 22) + '" fill="' + (active ? '#ffffff' : '#94a3b8') + '" font-size="10" font-weight="600">' + stages[st].text + '</text>';
    }

    // Post-synaptic effect readout
    var effText = (ntType === "ACh") ? "EPSP (+15 mV Depolarization)" : "IPSP (-10 mV Hyperpolarization)";
    var effColor = (ntType === "ACh") ? "#4ade80" : "#f43f5e";
    h += '<text x="690" y="375" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Generated Potential:</text>';
    h += '<text x="690" y="398" fill="' + effColor + '" font-size="12" font-weight="800" text-anchor="middle">' + effText + '</text>';

    if (hasAChEInhibitor) {
      h += '<text x="400" y="445" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">&#9888; AChE Inhibited: Persistent Transmitter Accumulation &#8594; Tetanic Spasm</text>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Cascade Step", "Stage " + s + " / 4", "#38bdf8") +
      cell("Neurotransmitter", ntType + " (" + (ntType === "ACh" ? "Cholinergic" : "GABAergic") + ")", "#f59e0b") +
      cell("Post-Synaptic Effect", ntType === "ACh" ? "EPSP (Excitatory)" : "IPSP (Inhibitory)", effColor) +
      cell("AChE Enzyme", hasAChEInhibitor ? "BLOCKED" : "Active Clearance", hasAChEInhibitor ? "#ef4444" : "#10b981")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Synaptic Transmission Law (NCERT Sec 18.3.2):</strong> Action potential depolarizes the knob &#8594; voltage-gated Ca2+ influx &#8594; synaptic vesicles fuse with pre-synaptic membrane &#8594; neurotransmitter discharges into cleft &#8594; binds post-synaptic receptors &#8594; opens ion channels to generate an EPSP or IPSP.' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    triggerAP: triggerAP,
    nextStep: nextStep,
    toggleNT: toggleNT,
    toggleAChE: toggleAChE,
    setView: nextStep
  };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Cranial Meninges & Forebrain Functional Cartography (brainforebrainsim)
// -------------------------------------------------------------------------
window.SIMS.brainforebrainsim = (function(){
  var activeRegion = "cortex"; // "meninges", "cortex", "callosum", "thalamus", "hypothalamus", "limbic"

  function mount(){
    App.state.maxT = 5;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Cerebral Cortex (Grey Matter / Gyri &amp; Sulci)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Corpus Callosum (Interhemispheric Tract)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Thalamus (Sensory/Motor Relay Station)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Hypothalamus (Thermostat &amp; Neuroendocrine)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Limbic Lobe (Amygdala &amp; Hippocampus)</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" onclick="window.SIMS.brainforebrainsim.selectRegion(\'meninges\')">Cranial Meninges</button>' +
        '<button class="lab-btn" onclick="window.SIMS.brainforebrainsim.selectRegion(\'cortex\')">Cerebral Cortex &amp; Association Areas</button>' +
        '<button class="lab-btn" onclick="window.SIMS.brainforebrainsim.selectRegion(\'callosum\')">Corpus Callosum</button>' +
        '<button class="lab-btn" onclick="window.SIMS.brainforebrainsim.selectRegion(\'thalamus\')">Thalamus</button>' +
        '<button class="lab-btn" onclick="window.SIMS.brainforebrainsim.selectRegion(\'hypothalamus\')">Hypothalamus</button>' +
        '<button class="lab-btn" onclick="window.SIMS.brainforebrainsim.selectRegion(\'limbic\')">Limbic System</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function selectRegion(r){
    activeRegion = r;
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">HUMAN BRAIN SAGITTAL SECTION &amp; FOREBRAIN CARTOGRAPHY (FIG 18.4)</text>';

    // Left Half: Sagittal Brain Schematic
    // Cranial Bone Outline
    h += '<path d="M 80 260 C 80 120 180 60 360 60 C 480 60 540 140 540 260" fill="none" stroke="#e2e8f0" stroke-width="8"/>';
    h += '<text x="180" y="80" fill="#94a3b8" font-size="11">Cranium (Skull Bone)</text>';

    // Cranial Meninges layers (Dura, Arachnoid, Pia)
    var menColor = (activeRegion === "meninges") ? "#38bdf8" : "#475569";
    h += '<path d="M 88 260 C 88 130 184 72 360 72 C 472 72 532 146 532 260" fill="none" stroke="' + menColor + '" stroke-width="3"/>';
    h += '<path d="M 94 260 C 94 138 188 82 360 82 C 466 82 524 152 524 260" fill="none" stroke="' + menColor + '" stroke-width="2" stroke-dasharray="3"/>';

    // Cerebral Hemisphere Outer Contour (Grey Matter Cortex with Gyri and Sulci)
    var ctxColor = (activeRegion === "cortex") ? "#3b82f6" : "#1e293b";
    var ctxStroke = (activeRegion === "cortex") ? "#60a5fa" : "#334155";
    h += '<path d="M 105 260 C 105 150 195 95 360 95 C 455 95 515 160 515 260 C 470 280 430 260 380 260 C 320 260 250 290 180 290 C 130 290 105 270 105 260 Z" fill="' + ctxColor + '" stroke="' + ctxStroke + '" stroke-width="3"/>';

    // Gyri & Sulci folds
    h += '<path d="M 180 120 Q 200 160 230 140 Q 260 120 290 150 Q 320 180 360 140 Q 400 110 430 150 Q 460 190 490 220" fill="none" stroke="#60a5fa" stroke-width="1.5" opacity="0.6"/>';

    // Corpus Callosum (C-shaped arch)
    var ccColor = (activeRegion === "callosum") ? "#10b981" : "#065f46";
    h += '<path d="M 230 230 C 230 170 310 160 410 175 C 440 180 450 200 450 220 C 430 205 380 190 320 190 C 260 190 240 215 230 230 Z" fill="' + ccColor + '" stroke="#34d399" stroke-width="2"/>';
    h += '<text x="330" y="180" fill="#a7f3d0" font-size="11" font-weight="700">Corpus Callosum</text>';

    // Thalamus (Egg-shaped mass wrapped by cerebrum)
    var thColor = (activeRegion === "thalamus") ? "#f59e0b" : "#78350f";
    h += '<ellipse cx="350" cy="225" rx="35" ry="22" fill="' + thColor + '" stroke="#fcd34d" stroke-width="2"/>';
    h += '<text x="350" y="230" fill="#fef3c7" font-size="12" font-weight="700" text-anchor="middle">Thalamus</text>';

    // Hypothalamus (Floor below thalamus)
    var hypColor = (activeRegion === "hypothalamus") ? "#ef4444" : "#991b1b";
    h += '<polygon points="320,247 380,247 370,285 330,285" fill="' + hypColor + '" stroke="#f87171" stroke-width="2"/>';
    h += '<text x="350" y="270" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">Hypothalamus</text>';

    // Pituitary Gland attached via infundibulum
    h += '<line x1="345" y1="285" x2="340" y2="305" stroke="#f87171" stroke-width="2"/>';
    h += '<circle cx="340" cy="312" r="8" fill="#fda4af" stroke="#e11d48"/>';
    h += '<text x="335" y="335" fill="#f43f5e" font-size="9" text-anchor="middle">Pituitary</text>';

    // Limbic Lobe (Hippocampus & Amygdala)
    var limColor = (activeRegion === "limbic") ? "#c084fc" : "#581c87";
    h += '<path d="M 280 240 C 270 270 300 290 320 270" fill="none" stroke="' + limColor + '" stroke-width="5"/>';
    h += '<circle cx="280" cy="245" r="7" fill="' + limColor + '" stroke="#e9d5ff"/>'; // Amygdala
    h += '<text x="250" y="250" fill="#d8b4fe" font-size="9" font-weight="700">Amygdala</text>';
    h += '<text x="270" y="295" fill="#d8b4fe" font-size="9" font-weight="700">Hippocampus</text>';

    // Hindbrain elements in background for context
    h += '<ellipse cx="460" cy="320" rx="45" ry="35" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>';
    h += '<text x="460" y="325" fill="#94a3b8" font-size="11" text-anchor="middle">Cerebellum</text>';
    h += '<rect x="360" y="310" width="35" height="50" fill="#1e293b" stroke="#475569"/>';
    h += '<text x="377" y="335" fill="#94a3b8" font-size="9" text-anchor="middle">Pons</text>';
    h += '<rect x="362" y="360" width="31" height="55" fill="#1e293b" stroke="#475569"/>';
    h += '<text x="377" y="390" fill="#94a3b8" font-size="9" text-anchor="middle">Medulla</text>';

    // Right Half: High-Yield Pedagogical Dossier Card
    h += '<rect x="560" y="50" width="220" height="400" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';

    var dossiers = {
      meninges: {
        title: "Cranial Meninges",
        bullets: [
          "1. Dura Mater: Outermost, thick, tough collagenous layer.",
          "2. Arachnoid Mater: Very thin middle vascular web.",
          "3. Pia Mater: Innermost delicate membrane adhering to brain gyri.",
          "Subarachnoid Space: Filled with CSF (shock-absorber)."
        ],
        c: "#38bdf8"
      },
      cortex: {
        title: "Cerebral Cortex",
        bullets: [
          "Grey Matter: Dense neuron cell bodies.",
          "Motor Areas: Voluntary muscle control.",
          "Sensory Areas: Somatosensory perception.",
          "Association Areas: Memory, intersensory associations & communication."
        ],
        c: "#60a5fa"
      },
      callosum: {
        title: "Corpus Callosum",
        bullets: [
          "Major Commissure: Connects left and right cerebral hemispheres.",
          "White Matter Tract: Millions of transverse myelinated axons.",
          "Function: Interhemispheric communication and unified perception."
        ],
        c: "#34d399"
      },
      thalamus: {
        title: "Thalamus",
        bullets: [
          "Sensory Relay Station: Routes all sensory inputs (except smell) to cortex.",
          "Motor Coordination: Integrates cerebellar and basal ganglia loops.",
          "Wrapping: Cerebrum wraps entirely around it."
        ],
        c: "#fcd34d"
      },
      hypothalamus: {
        title: "Hypothalamus",
        bullets: [
          "Thermostat: Core body temperature regulation.",
          "Appetite & Thirst: Centers for hunger and drinking urges.",
          "Neurosecretion: Secrete hypothalamic releasing/inhibiting hormones.",
          "Master Clock: Suprachiasmatic nucleus drives 24-hr circadian cycles."
        ],
        c: "#f87171"
      },
      limbic: {
        title: "Limbic System",
        bullets: [
          "Composition: Amygdala + Hippocampus + Hypothalamus.",
          "Emotional Expression: Rage, fear, pleasure, and sexual drive.",
          "Memory Consolidation: Hippocampus converts short-term to long-term memory."
        ],
        c: "#c084fc"
      }
    };

    var d = dossiers[activeRegion] || dossiers.cortex;
    h += '<text x="670" y="85" fill="' + d.c + '" font-size="15" font-weight="700" text-anchor="middle">' + d.title + '</text>';

    for (var bi = 0; bi < d.bullets.length; bi++) {
      var by = 125 + bi * 65;
      h += '<rect x="575" y="' + by + '" width="190" height="55" rx="6" fill="#0f172a" stroke="#334155"/>';
      h += '<foreignObject x="580" y="' + by + '" width="180" height="55">';
      h += '<div xmlns="http://www.w3.org/1999/xhtml" style="color:#cbd5e1;font-size:11px;line-height:1.3;padding:4px;">' + d.bullets[bi] + '</div>';
      h += '</foreignObject>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Inspected Structure", d.title, d.c) +
      cell("Primary Function", activeRegion === "hypothalamus" ? "Homeostasis & Thermoregulation" : activeRegion === "cortex" ? "Cognition & Sensation" : "Relay & Connectivity", "#10b981") +
      cell("Tissue Composition", activeRegion === "callosum" ? "White Matter (Axon Tracts)" : "Grey Matter (Soma)", "#f59e0b") +
      cell("Clinical Implication", activeRegion === "hypothalamus" ? "Hyperthermia / Diabetes Insipidus" : "Sensory Agnosia / Stroke", "#f43f5e")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Forebrain Architecture (NCERT Sec 18.4.1):</strong> The cerebrum is divided into hemispheres by the corpus callosum. The cerebral cortex houses sensory, motor, and association areas. Wrapped within lies the thalamus (sensory relay) and hypothalamus (thermoregulation, hunger, thirst, and limbic emotional integration).' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    selectRegion: selectRegion,
    setView: selectRegion
  };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Midbrain, Hindbrain & Medullary Autonomic Control Lab (brainstemhindbrainsim)
// -------------------------------------------------------------------------
window.SIMS.brainstemhindbrainsim = (function(){
  var focusArea = "brainstem"; // "brainstem", "cerebellum", "medulla"
  var co2Level = 40; // 30 to 70 mmHg (normal 40)
  var alcoholLevel = 0; // 0 to 100%

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Midbrain (Corpora Quadrigemina &amp; Aqueduct)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Pons (Fibre Tracts Bridge &amp; Pneumotaxic)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Medulla Oblongata (Respiratory &amp; Cardiac Centres)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Cerebellum (Arbor Vitae &amp; Motor Equilibrium)</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" onclick="window.SIMS.brainstemhindbrainsim.setFocus(\'brainstem\')">Brain Stem (Midbrain + Pons + Medulla)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.brainstemhindbrainsim.setFocus(\'cerebellum\')">Cerebellum &amp; Ataxia Test</button>' +
        '<button class="lab-btn" onclick="window.SIMS.brainstemhindbrainsim.setFocus(\'medulla\')">Medulla Vital Control</button>' +
        '<span style="border-left:1px solid var(--border);height:24px;margin:0 4px;"></span>' +
        '<label style="color:#cbd5e1;font-size:12px;">Arterial PCO2: <span id="val-co2" style="color:#ef4444;font-weight:700;">' + co2Level + ' mmHg</span></label>' +
        '<input type="range" min="30" max="70" value="' + co2Level + '" oninput="window.SIMS.brainstemhindbrainsim.setCO2(this.value)" style="width:90px;">' +
        '<label style="color:#cbd5e1;font-size:12px;">Alcohol / Ataxia: <span id="val-alc" style="color:#10b981;font-weight:700;">' + alcoholLevel + '%</span></label>' +
        '<input type="range" min="0" max="100" value="' + alcoholLevel + '" oninput="window.SIMS.brainstemhindbrainsim.setAlc(this.value)" style="width:90px;">' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function setFocus(f){
    focusArea = f;
    render(App.state.t || 0);
  }

  function setCO2(v){
    co2Level = parseInt(v, 10);
    var el = document.getElementById("val-co2");
    if (el) el.textContent = co2Level + " mmHg";
    render(App.state.t || 0);
  }

  function setAlc(v){
    alcoholLevel = parseInt(v, 10);
    var el = document.getElementById("val-alc");
    if (el) el.textContent = alcoholLevel + "%";
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    // Calculate ventilation rate from CO2
    // Normal 40 mmHg -> 12-14 bpm. High 70 mmHg -> 32 bpm (hyperventilation)
    var respRate = Math.round(14 + (co2Level - 40) * 0.6);
    respRate = Math.max(8, Math.min(36, respRate));

    // Motor coordination score from alcohol
    var coordScore = Math.max(0, 100 - alcoholLevel);

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">MIDBRAIN, HINDBRAIN &amp; MEDULLARY HOMEOSTATIC ARCHITECTURE</text>';

    // Left Half: Anatomical Brainstem & Cerebellum Isolation View
    h += '<rect x="40" y="50" width="370" height="400" rx="10" fill="#1e293b" stroke="#334155"/>';
    h += '<text x="225" y="75" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">BRAIN STEM &amp; CEREBELLAR CONDUIT</text>';

    // Midbrain (Top of stalk)
    var midColor = (focusArea === "brainstem" ? "#d97706" : "#78350f");
    h += '<rect x="180" y="100" width="90" height="55" rx="6" fill="' + midColor + '" stroke="#fcd34d" stroke-width="2"/>';
    h += '<text x="225" y="125" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">MIDBRAIN</text>';
    h += '<text x="225" y="142" fill="#fef3c7" font-size="9" text-anchor="middle">Corpora Quadrigemina</text>';

    // Cerebral Aqueduct through Midbrain
    h += '<line x1="225" y1="90" x2="225" y2="160" stroke="#38bdf8" stroke-width="4"/>';
    h += '<text x="290" y="120" fill="#38bdf8" font-size="10">Cerebral Aqueduct</text>';

    // Pons (Middle bulge)
    var ponsColor = (focusArea === "brainstem" ? "#2563eb" : "#1e3a8a");
    h += '<path d="M 170 160 C 130 185 130 225 170 245 L 280 245 C 280 245 280 160 280 160 Z" fill="' + ponsColor + '" stroke="#60a5fa" stroke-width="2"/>';
    h += '<text x="210" y="200" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">PONS</text>';
    h += '<text x="210" y="218" fill="#dbeafe" font-size="9" text-anchor="middle">Interconnecting Tracts</text>';

    // Medulla Oblongata (Lower segment tapering to cord)
    var medColor = (focusArea === "medulla" || focusArea === "brainstem" ? "#dc2626" : "#7f1d1d");
    h += '<polygon points="175,247 275,247 255,340 195,340" fill="' + medColor + '" stroke="#f87171" stroke-width="2"/>';
    h += '<text x="225" y="285" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">MEDULLA</text>';
    h += '<text x="225" y="302" fill="#fee2e2" font-size="10" text-anchor="middle">OBLONGATA</text>';

    // Spinal cord below medulla
    h += '<rect x="205" y="342" width="40" height="70" fill="#475569" stroke="#94a3b8"/>';
    h += '<text x="225" y="380" fill="#f8fafc" font-size="10" text-anchor="middle">Spinal Cord</text>';

    // Cerebellum (Dorsal to pons and medulla)
    var cerColor = (focusArea === "cerebellum" ? "#059669" : "#064e3b");
    h += '<ellipse cx="330" cy="235" rx="55" ry="50" fill="' + cerColor + '" stroke="#34d399" stroke-width="2.5"/>';
    h += '<text x="330" y="235" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">CEREBELLUM</text>';
    h += '<text x="330" y="252" fill="#a7f3d0" font-size="9" text-anchor="middle">Convoluted Cortex</text>';
    h += '<text x="330" y="265" fill="#a7f3d0" font-size="8" text-anchor="middle">Arbor Vitae</text>';

    // Right Half: Physiological Telemetry & Interactive Testing Card
    h += '<rect x="430" y="50" width="340" height="400" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';

    if (focusArea === "cerebellum") {
      // Cerebellum & Balance Test
      h += '<text x="600" y="80" fill="#34d399" font-size="15" font-weight="700" text-anchor="middle">CEREBELLAR MOTOR &amp; EQUILIBRIUM TEST</text>';

      h += '<rect x="450" y="105" width="300" height="80" rx="6" fill="#0f172a" stroke="#334155"/>';
      h += '<text x="465" y="130" fill="#94a3b8" font-size="11">Motor Coordination Index:</text>';
      var cCol = coordScore > 75 ? "#4ade80" : (coordScore > 40 ? "#facc15" : "#ef4444");
      h += '<text x="465" y="165" fill="' + cCol + '" font-size="28" font-weight="800">' + coordScore + ' / 100</text>';

      // Sway balance meter
      h += '<rect x="450" y="205" width="300" height="120" rx="6" fill="#0f172a" stroke="#334155"/>';
      h += '<text x="600" y="228" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Postural Romberg Sway Meter</text>';

      var swayW = Math.round((alcoholLevel / 100) * 120);
      h += '<circle cx="600" cy="275" r="35" fill="#1e293b" stroke="#475569"/>';
      h += '<circle cx="' + (600 + Math.sin(alcoholLevel * 0.2) * swayW * 0.3) + '" cy="' + (275 + Math.cos(alcoholLevel * 0.2) * swayW * 0.2) + '" r="8" fill="' + cCol + '"/>';

      h += '<foreignObject x="450" y="340" width="300" height="90">';
      h += '<div xmlns="http://www.w3.org/1999/xhtml" style="color:#cbd5e1;font-size:11px;line-height:1.4;background:#020617;padding:8px;border-radius:6px;border:1px solid #334155;">' +
        '<strong>NCERT Insight:</strong> The cerebellum possesses a deeply convoluted surface providing extra room for billions of neurons. It coordinates voluntary motor commands, fine motor control, gait, and equilibrium. Alcohol suppresses cerebellar processing, causing acute ataxia and slurred speech.' +
        '</div>';
      h += '</foreignObject>';

    } else if (focusArea === "medulla") {
      // Medulla Oblongata Homeostatic Centres
      h += '<text x="600" y="80" fill="#f87171" font-size="15" font-weight="700" text-anchor="middle">MEDULLA VITAL CONTROL CENTRES</text>';

      // Respiratory rhythmicity
      h += '<rect x="450" y="105" width="300" height="75" rx="6" fill="#0f172a" stroke="#334155"/>';
      h += '<text x="465" y="128" fill="#94a3b8" font-size="11">Respiratory Rhythmicity Centre:</text>';
      h += '<text x="465" y="155" fill="#38bdf8" font-size="20" font-weight="700">' + respRate + ' breaths/min</text>';
      h += '<text x="735" y="155" fill="#cbd5e1" font-size="11" text-anchor="end">' + (co2Level > 45 ? "Hypercapnia Drive" : "Normocapnia") + '</text>';

      // Cardiovascular Centre
      h += '<rect x="450" y="190" width="300" height="75" rx="6" fill="#0f172a" stroke="#334155"/>';
      h += '<text x="465" y="213" fill="#94a3b8" font-size="11">Cardiovascular &amp; Vasomotor Centre:</text>';
      var hrVal = Math.round(72 + (co2Level - 40) * 0.8);
      h += '<text x="465" y="240" fill="#f43f5e" font-size="20" font-weight="700">' + hrVal + ' bpm</text>';
      h += '<text x="735" y="240" fill="#cbd5e1" font-size="11" text-anchor="end">Autonomic Baro-coupling</text>';

      // Gastric secretions and reflexes
      h += '<rect x="450" y="275" width="300" height="60" rx="6" fill="#0f172a" stroke="#334155"/>';
      h += '<text x="465" y="298" fill="#94a3b8" font-size="11">Autonomic Reflex Nuclei:</text>';
      h += '<text x="465" y="320" fill="#fcd34d" font-size="12" font-weight="700">Gastric Secretions, Vomiting, Swallowing, Coughing</text>';

      h += '<foreignObject x="450" y="345" width="300" height="85">';
      h += '<div xmlns="http://www.w3.org/1999/xhtml" style="color:#cbd5e1;font-size:11px;line-height:1.4;background:#020617;padding:8px;border-radius:6px;border:1px solid #334155;">' +
        '<strong>Clinical Criticality:</strong> The medulla oblongata houses life-sustaining reflex centres controlling breathing rhythm and heart rate. Severe trauma to the brainstem/medulla induces instantaneous cardiopulmonary arrest.' +
        '</div>';
      h += '</foreignObject>';

    } else {
      // Brainstem Definition
      h += '<text x="600" y="80" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">BRAIN STEM DEFINITION (NCERT 18.4.3)</text>';

      h += '<rect x="450" y="105" width="300" height="110" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>';
      h += '<text x="600" y="130" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">Three Constituent Regions:</text>';
      h += '<text x="470" y="155" fill="#fcd34d" font-size="12" font-weight="600">1. Midbrain (Mesencephalon)</text>';
      h += '<text x="470" y="175" fill="#60a5fa" font-size="12" font-weight="600">2. Pons (Bridge of fibre tracts)</text>';
      h += '<text x="470" y="195" fill="#f87171" font-size="12" font-weight="600">3. Medulla Oblongata (Vital bulb)</text>';

      h += '<rect x="450" y="225" width="300" height="80" rx="6" fill="#450a0a" stroke="#f87171"/>';
      h += '<text x="600" y="250" fill="#fecaca" font-size="13" font-weight="700" text-anchor="middle">Crucial NCERT Exclusion:</text>';
      h += '<text x="600" y="275" fill="#ffffff" font-size="12" text-anchor="middle">CEREBELLUM IS STRICTLY EXCLUDED</text>';
      h += '<text x="600" y="292" fill="#fca5a5" font-size="11" text-anchor="middle">from the anatomical brain stem.</text>';

      h += '<foreignObject x="450" y="320" width="300" height="110">';
      h += '<div xmlns="http://www.w3.org/1999/xhtml" style="color:#cbd5e1;font-size:11px;line-height:1.4;background:#020617;padding:8px;border-radius:6px;border:1px solid #334155;">' +
        '<strong>Conduit Highway:</strong> Brain stem forms the anatomical connection between forebrain and spinal cord. It houses the reticular activating system, cranial nerve nuclei III through XII, and central respiratory rhythm generators.' +
        '</div>';
      h += '</foreignObject>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Focused Region", focusArea.toUpperCase(), "#38bdf8") +
      cell("Ventilation Rate", respRate + " /min", "#f87171") +
      cell("Cerebellar Motor Score", coordScore + " %", coordScore > 70 ? "#10b981" : "#f59e0b") +
      cell("Brain Stem Scope", "Midbrain + Pons + Medulla", "#a855f7")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Hindbrain &amp; Brainstem Essentials:</strong> Midbrain (corpora quadrigemina, aqueduct) + Pons (bridges tracts) + Medulla (cardiovascular &amp; respiratory rhythmicity) form the Brainstem. Cerebellum integrates semicircular inner-ear signals to coordinate smooth muscular equilibrium.' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setFocus: setFocus,
    setCO2: setCO2,
    setAlc: setAlc,
    setView: setFocus
  };
})();
