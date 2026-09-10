// kebo114 interactive simulations: Breathing and Exchange of Gases
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
// 1. SIMULATION 1: Respiratory Tract & Anatomy (respiratorytractsim)
// -------------------------------------------------------------------------
window.SIMS.respiratorytractsim = (function(){
  var view = "tree"; // "tree", "conditioning", "pleura"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Conducting Zone (Trachea & Bronchi)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Respiratory Exchange Zone (Alveoli)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Hyaline Cartilaginous C-Rings</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Pleural Cavity & Sub-Atmospheric Pressure</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.respiratorytractsim.setView(\'tree\')">1. Bronchial Tree & Alveolar Sacs</button>' +
      '<button class="preset-btn" onclick="SIMS.respiratorytractsim.setView(\'conditioning\')">2. Conducting Zone Air Conditioning</button>' +
      '<button class="preset-btn" onclick="SIMS.respiratorytractsim.setView(\'pleura\')">3. Pleural Membranes & Pneumothorax</button>';
  }

  function setView(v){
    view = v;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (view === "tree") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HUMAN RESPIRATORY TRACT: CONDUCTING ZONE VS RESPIRATORY EXCHANGE ZONE</text>';

      // Trachea with C-shaped rings
      svg += '<g transform="translate(380, 50)">';
      svg += '<rect x="-18" y="0" width="36" height="100" fill="#0284c7" opacity="0.8" rx="4"/>';
      for (var r = 0; r < 6; r++) {
        svg += '<line x1="-18" y1="' + (15 + r * 15) + '" x2="18" y2="' + (15 + r * 15) + '" stroke="#fde047" stroke-width="3"/>';
      }
      svg += '<text x="25" y="55" fill="#fde047" font-size="11">C-shaped Hyaline Rings (Non-collapsible)</text>';

      // Bifurcation (Carina at T5)
      // Left and Right Primary Bronchi
      svg += '<path d="M 0 100 L -80 160" stroke="#0284c7" stroke-width="14" stroke-linecap="round"/>';
      svg += '<path d="M 0 100 L 80 160" stroke="#0284c7" stroke-width="14" stroke-linecap="round"/>';

      // Secondary & Tertiary Bronchi
      svg += '<path d="M -80 160 L -140 210 M -80 160 L -60 220" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>';
      svg += '<path d="M 80 160 L 140 210 M 80 160 L 60 220" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>';

      // Terminal Bronchioles
      svg += '<path d="M -140 210 L -180 250 M -140 210 L -120 260 M -60 220 L -80 270 M -60 220 L -30 265" stroke="#7dd3fc" stroke-width="4"/>';
      svg += '<path d="M 140 210 L 180 250 M 140 210 L 120 260 M 60 220 L 80 270 M 60 220 L 30 265" stroke="#7dd3fc" stroke-width="4"/>';

      // Alveolar Sacs (Clusters of Alveoli)
      var sacPts = [[-180, 250], [-120, 260], [-80, 270], [-30, 265], [180, 250], [120, 260], [80, 270], [30, 265]];
      for (var s = 0; s < sacPts.length; s++) {
        var sp = sacPts[s];
        for (var a = 0; a < 5; a++) {
          var ang = a * 2 * Math.PI / 5;
          svg += '<circle cx="' + (sp[0] + Math.cos(ang)*9) + '" cy="' + (sp[1] + Math.sin(ang)*9) + '" r="7" fill="#10b981" opacity="0.85"/>';
        }
      }
      svg += '</g>';

      // Labels on sides
      svg += '<rect x="40" y="70" width="180" height="70" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="50" y="92" fill="#38bdf8" font-size="12" font-weight="bold">Conducting Zone:</text>';
      svg += '<text x="50" y="112" fill="#f8fafc" font-size="11">Nostrils to Terminal Bronchioles</text>';
      svg += '<text x="50" y="128" fill="#94a3b8" font-size="10">Filters, humidifies & warms air</text>';

      svg += '<rect x="540" y="250" width="180" height="70" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="550" y="272" fill="#10b981" font-size="12" font-weight="bold">Respiratory Zone:</text>';
      svg += '<text x="550" y="292" fill="#f8fafc" font-size="11">Alveoli & Alveolar Ducts</text>';
      svg += '<text x="550" y="308" fill="#94a3b8" font-size="10">~300 Million Alveoli (~100 m²)</text>';

      svg += '</svg>';

      rHtml = cell('Trachea Bifurcation', 'Level of 5th Thoracic Vertebra (T5)', '#38bdf8') +
              cell('Cartilage Support', 'Incomplete Hyaline C-Rings', '#fde047') +
              cell('Alveolar Count', 'Approx. 300 Million', '#10b981') +
              cell('Respiratory Area', 'Approx. 100 m² (Tennis court size)', '#fbbf24');

      vHtml = '<strong>Anatomy of the Human Respiratory Tract:</strong> The trachea is a straight tube extending down the mid-thoracic cavity, dividing at the 5th thoracic vertebra into primary bronchi. The conducting zone (nostrils to terminal bronchioles) is lined with ciliated epithelium and fortified with C-shaped cartilaginous rings that prevent mechanical collapse under negative inspiratory pressures. Actual gas exchange occurs in the 300 million microscopic alveoli providing ~100 m² of surface area.';
    }
    else if (view === "conditioning") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">CONDUCTING ZONE: AIR FILTRATION, HUMIDIFICATION & THERMAL REGULATION</text>';

      // Inhaled ambient air (Left)
      svg += '<g transform="translate(100, 80)">';
      svg += '<rect x="0" y="0" width="220" height="230" fill="#1e293b" rx="6" stroke="#ef4444"/>';
      svg += '<text x="110" y="28" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">INHALED AMBIENT AIR</text>';
      svg += '<text x="20" y="70" fill="#f8fafc" font-size="12">• Temperature: 15 °C (Cold)</text>';
      svg += '<text x="20" y="100" fill="#f8fafc" font-size="12">• Relative Humidity: 30% (Dry)</text>';
      svg += '<text x="20" y="130" fill="#f8fafc" font-size="12">• Particulate Dust: High</text>';
      svg += '<text x="20" y="160" fill="#f8fafc" font-size="12">• Pathogens: Suspended in air</text>';
      svg += '<text x="20" y="200" fill="#fca5a5" font-size="11">Raw & potentially damaging to alveoli</text>';
      svg += '</g>';

      // Ciliated Mucociliary Escalator (Center)
      svg += '<g transform="translate(350, 100)">';
      svg += '<path d="M 0 50 L 50 50" stroke="#38bdf8" stroke-width="6" marker-end="url(#arrow)"/>';
      svg += '<text x="25" y="35" fill="#38bdf8" font-size="11" text-anchor="middle">Conducting</text>';
      svg += '<text x="25" y="85" fill="#38bdf8" font-size="11" text-anchor="middle">Passage</text>';
      svg += '</g>';

      // Conditioned Alveolar air (Right)
      svg += '<g transform="translate(440, 80)">';
      svg += '<rect x="0" y="0" width="220" height="230" fill="#1e293b" rx="6" stroke="#10b981"/>';
      svg += '<text x="110" y="28" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">ALVEOLAR CONDITIONED AIR</text>';
      svg += '<text x="20" y="70" fill="#6ee7b7" font-size="12">• Temperature: 37 °C (Core Body)</text>';
      svg += '<text x="20" y="100" fill="#6ee7b7" font-size="12">• Relative Humidity: 100% (Saturated)</text>';
      svg += '<text x="20" y="130" fill="#6ee7b7" font-size="12">• Dust: Trapped in mucus</text>';
      svg += '<text x="20" y="160" fill="#6ee7b7" font-size="12">• pH2O added: 47 mmHg</text>';
      svg += '<text x="20" y="200" fill="#d1fae5" font-size="11">Sterile & moisture-safe for diffusion</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Air Temperature', 'Warmed from 15°C to 37°C', '#10b981') +
              cell('Relative Humidity', 'Saturated to 100% (pH2O = 47 mmHg)', '#38bdf8') +
              cell('Filtration Mechanism', 'Mucociliary escalator sweeps up dust', '#fbbf24') +
              cell('Alveolar Protection', 'Prevents desiccation & epithelial damage', '#22c55e');

      vHtml = '<strong>Conducting Zone Air Conditioning:</strong> As inhaled air passes through the nasal cavity, pharynx, and trachea, extensive capillary beds warm the air to core body temperature (37 °C) and mucous secretions saturate it to 100% relative humidity. Mucus traps inhaled dust and microbes, which are constantly propelled upward by ciliated columnar cells toward the pharynx to be swallowed, shielding the delicate alveoli.';
    }
    else if (view === "pleura") {
      var punctured = (t >= 2);
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">DOUBLE-LAYERED PLEURAL MEMBRANE & PNEUMOTHORAX DYNAMICS</text>';

      // Thoracic Wall (Outer)
      svg += '<rect x="180" y="70" width="400" height="260" fill="#1e293b" stroke="#64748b" stroke-width="4" rx="8"/>';
      svg += '<text x="200" y="95" fill="#94a3b8" font-size="12" font-weight="bold">Thoracic Wall & Ribs</text>';

      // Parietal Pleura (lining thoracic wall)
      svg += '<rect x="195" y="110" width="370" height="205" fill="none" stroke="#38bdf8" stroke-width="3" rx="6"/>';
      svg += '<text x="205" y="128" fill="#38bdf8" font-size="11">Outer Parietal Pleura</text>';

      if (!punctured) {
        // Inflated lung with Visceral Pleura
        svg += '<rect x="220" y="145" width="320" height="150" fill="#047857" stroke="#10b981" stroke-width="3" rx="10"/>';
        svg += '<text x="380" y="210" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">INFLATED LUNG (Visceral Pleura attached)</text>';
        svg += '<text x="380" y="235" fill="#a7f3d0" font-size="12" text-anchor="middle">Intrapleural Pressure: -4 mmHg (Sub-atmospheric)</text>';
        svg += '<text x="380" y="255" fill="#d1fae5" font-size="11" text-anchor="middle">Pleural fluid creates surface tension preventing separation</text>';
      } else {
        // Collapsed lung (Atelectasis / Pneumothorax)
        svg += '<circle cx="380" cy="220" r="45" fill="#ef4444" stroke="#dc2626" stroke-width="3"/>';
        svg += '<text x="380" y="218" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">COLLAPSED</text>';
        svg += '<text x="380" y="232" fill="#fff" font-size="10" text-anchor="middle">LUNG (Atelectasis)</text>';
        // Puncture in chest wall
        svg += '<line x1="580" y1="180" x2="550" y2="180" stroke="#ef4444" stroke-width="6"/>';
        svg += '<text x="590" y="185" fill="#ef4444" font-size="11" font-weight="bold">Puncture Wound</text>';
        svg += '<text x="380" y="145" fill="#f87171" font-size="12" font-weight="bold" text-anchor="middle">Pneumothorax: Air enters pleural space (P = 0 mmHg)</text>';
      }

      svg += '</svg>';

      rHtml = cell('Parietal Pleura', 'Lines thoracic cavity wall', '#38bdf8') +
              cell('Visceral Pleura', 'Firmly adheres to lung surface', '#10b981') +
              cell('Intrapleural Pressure', punctured ? '0 mmHg (Atmospheric - Collapsed)' : '-4 mmHg (Sub-atmospheric - Inflated)', punctured ? '#ef4444' : '#10b981') +
              cell('Pathology', punctured ? 'Pneumothorax & Atelectasis' : 'Normal Healthy Expansion', punctured ? '#ef4444' : '#38bdf8');

      vHtml = '<strong>Pleural Membranes & Negative Pressure:</strong> The lungs are encased in a double-layered serous pleura. The outer parietal pleura contacts the thoracic cage, while the inner visceral pleura adheres to the lung. The thin pleural cavity between them contains pleural fluid, creating high surface tension and a sub-atmospheric intrapleural pressure (~ -4 mmHg). If a puncture wound breaches the chest wall (pneumothorax), air rushes into the pleural space, neutralizing the negative pressure and causing the elastic lung to collapse immediately.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Ventilation Mechanics (ventilationmechanicssim)
// -------------------------------------------------------------------------
window.SIMS.ventilationmechanicssim = (function(){
  var phase = "inspiration"; // "inspiration", "expiration", "forced"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Diaphragm Contraction / Relaxation</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>External Intercostal Muscle Action</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Intrapulmonary Pressure Differential</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Forced Expiration Abdominal Drive</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.ventilationmechanicssim.setPhase(\'inspiration\')">1. Normal Quiet Inspiration (Active)</button>' +
      '<button class="preset-btn" onclick="SIMS.ventilationmechanicssim.setPhase(\'expiration\')">2. Normal Quiet Expiration (Passive)</button>' +
      '<button class="preset-btn" onclick="SIMS.ventilationmechanicssim.setPhase(\'forced\')">3. Forced Expiration (Active Muscular)</button>';
  }

  function setPhase(p){
    phase = p;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (phase === "inspiration") {
      // Thorax expands; diaphragm flattens; Ppul drops to 759 mmHg
      var expand = t * 12;
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">QUIET INSPIRATION: ACTIVE CONTRACTION OF DIAPHRAGM & EXTERNAL INTERCOSTALS</text>';

      // Inflow of air arrows down trachea
      svg += '<g stroke="#38bdf8" stroke-width="3" fill="none">';
      svg += '<path d="M 380 40 L 380 90"/>';
      svg += '<path d="M 380 90 L 370 80 M 380 90 L 390 80"/>';
      svg += '</g>';
      svg += '<text x="400" y="65" fill="#38bdf8" font-size="12" font-weight="bold">Air Inflow (~500 mL)</text>';

      // Expanding Thoracic Ribcage
      var ribW = 220 + expand * 2;
      var ribH = 170 + expand;
      svg += '<rect x="' + (380 - ribW/2) + '" y="100" width="' + ribW + '" height="' + ribH + '" fill="#0284c7" opacity="0.3" stroke="#38bdf8" stroke-width="3" rx="16"/>';
      svg += '<text x="380" y="160" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">Thoracic Cavity Expanded</text>';
      svg += '<text x="380" y="185" fill="#fde047" font-size="13" font-weight="bold" text-anchor="middle">Intrapulmonary Pressure: 759 mmHg (-1 mmHg vs Patm)</text>';
      svg += '<text x="380" y="210" fill="#94a3b8" font-size="11" text-anchor="middle">Boyle&#39;s Law: Volume Up -> Pressure Down</text>';

      // Diaphragm (Flattens downwards)
      var diaY = 100 + ribH;
      svg += '<path d="M ' + (380 - ribW/2) + ' ' + diaY + ' Q 380 ' + (diaY + 10) + ' ' + (380 + ribW/2) + ' ' + diaY + '" stroke="#10b981" stroke-width="8" fill="none"/>';
      svg += '<text x="380" y="' + (diaY + 30) + '" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Diaphragm Contracts (Flattens downward in Antero-posterior axis)</text>';

      // Lateral arrow for external intercostals
      svg += '<text x="' + (380 + ribW/2 + 15) + '" y="160" fill="#38bdf8" font-size="11">External Intercostals pull ribs UP & OUT</text>';
      svg += '</svg>';

      rHtml = cell('Breathing Mode', 'Inspiration (Active)', '#10b981') +
              cell('Diaphragm State', 'Contracted (Flattened)', '#10b981') +
              cell('Intrapulmonary Pressure', '759 mmHg (-1 mmHg)', '#ef4444') +
              cell('Tidal Volume Inflow', (150 + t * 85).toFixed(0) + ' mL / 500 mL', '#38bdf8');

      vHtml = '<strong>Mechanism of Normal Inspiration:</strong> Active contraction of the diaphragm pulls it downward, expanding the thorax in the antero-posterior axis. Concurrently, contraction of external intercostal muscles lifts ribs and sternum, expanding the dorso-ventral axis. The overall increase in thoracic volume drops intrapulmonary pressure below atmospheric level (to ~759 mmHg), drawing ~500 mL of ambient air into the lungs.';
    }
    else if (phase === "expiration") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">QUIET EXPIRATION: PASSIVE ELASTIC RECOIL & DIAPHRAGM RELAXATION</text>';

      // Outflow of air arrows up trachea
      svg += '<g stroke="#ef4444" stroke-width="3" fill="none">';
      svg += '<path d="M 380 90 L 380 40"/>';
      svg += '<path d="M 380 40 L 370 50 M 380 40 L 390 50"/>';
      svg += '</g>';
      svg += '<text x="400" y="65" fill="#ef4444" font-size="12" font-weight="bold">Air Outflow (~500 mL)</text>';

      // Compressed Thoracic Ribcage
      var ribW2 = 210;
      var ribH2 = 160;
      svg += '<rect x="' + (380 - ribW2/2) + '" y="100" width="' + ribW2 + '" height="' + ribH2 + '" fill="#0284c7" opacity="0.2" stroke="#64748b" stroke-width="2.5" rx="14"/>';
      svg += '<text x="380" y="150" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">Thoracic Cavity Decreased</text>';
      svg += '<text x="380" y="175" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">Intrapulmonary Pressure: 761 mmHg (+1 mmHg vs Patm)</text>';
      svg += '<text x="380" y="200" fill="#94a3b8" font-size="11" text-anchor="middle">Passive Elastic Recoil compresses air</text>';

      // Diaphragm (Relaxes into convex dome shape)
      var diaY2 = 100 + ribH2;
      svg += '<path d="M ' + (380 - ribW2/2) + ' ' + diaY2 + ' Q 380 ' + (diaY2 - 35) + ' ' + (380 + ribW2/2) + ' ' + diaY2 + '" stroke="#10b981" stroke-width="8" fill="none"/>';
      svg += '<text x="380" y="' + (diaY2 + 25) + '" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Diaphragm Relaxes (Ascends to Dome Shape)</text>';

      svg += '</svg>';

      rHtml = cell('Breathing Mode', 'Expiration (Passive)', '#94a3b8') +
              cell('Diaphragm State', 'Relaxed (Dome-shaped)', '#10b981') +
              cell('Intrapulmonary Pressure', '761 mmHg (+1 mmHg)', '#ef4444') +
              cell('Air Expelled', '500 mL Tidal Air', '#38bdf8');

      vHtml = '<strong>Mechanism of Normal Expiration:</strong> Quiet expiration is completely passive. Relaxation of the diaphragm causes it to arch upward into its dome shape, while external intercostals relax so the ribs descend. Elastic recoil of the stretched lung tissue decreases thoracic volume, raising intrapulmonary pressure above atmospheric level (to ~761 mmHg) and pushing alveolar air outward.';
    }
    else if (phase === "forced") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">FORCED EXPIRATION: ACTIVE CONTRACTION OF INTERNAL INTERCOSTALS & ABDOMINAL MUSCLES</text>';

      // Strong upward arrows
      svg += '<g stroke="#ef4444" stroke-width="4" fill="none">';
      svg += '<path d="M 380 90 L 380 35"/>';
      svg += '<path d="M 380 35 L 365 50 M 380 35 L 395 50"/>';
      svg += '</g>';
      svg += '<text x="400" y="60" fill="#ef4444" font-size="12" font-weight="bold">Maximal Air Outflow (TV + ERV)</text>';

      // Highly compressed thorax
      svg += '<rect x="295" y="95" width="170" height="145" fill="#ef4444" opacity="0.25" stroke="#ef4444" stroke-width="3" rx="10"/>';
      svg += '<text x="380" y="145" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">Thorax Markedly Compressed</text>';
      svg += '<text x="380" y="170" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">Intrapulmonary Pressure: +3 to +5 mmHg</text>';

      // Diaphragm pushed high by abdominal viscera
      svg += '<path d="M 295 240 Q 380 180 465 240" stroke="#10b981" stroke-width="8" fill="none"/>';
      svg += '<text x="380" y="275" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">Abdominal wall contracts, pushing diaphragm high into chest</text>';
      svg += '<text x="380" y="295" fill="#94a3b8" font-size="11" text-anchor="middle">Internal intercostals pull ribs downward and inward</text>';

      svg += '</svg>';

      rHtml = cell('Breathing Mode', 'Forced Expiration (Active)', '#ef4444') +
              cell('Muscles Recruited', 'Internal Intercostals + Abdominals', '#fbbf24') +
              cell('Extra Volume Expelled', 'ERV: ~1000 - 1100 mL', '#38bdf8') +
              cell('Residual Air Left', 'RV: ~1100 - 1200 mL (Unexpellable)', '#10b981');

      vHtml = '<strong>Active Forced Expiration:</strong> During strenuous physical activity or forced breathing maneuvers, expiration becomes an active muscular effort. Internal intercostal muscles contract forcefully to pull the ribs downward and inward, while abdominal muscles contract to compress the abdominal viscera, shoving the diaphragm upward. This forces out an additional 1000 to 1100 mL of Expiratory Reserve Volume (ERV).';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setPhase: setPhase
  };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Spirometry & Lung Volumes (spirometryvolumesim)
// -------------------------------------------------------------------------
window.SIMS.spirometryvolumesim = (function(){
  var mode = "normal"; // "normal", "capacities", "hourly"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Tidal Volume (TV = 500 mL)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Inspiratory Reserve (IRV = 2500-3000 mL)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Expiratory Reserve (ERV = 1000-1100 mL)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Residual Volume (RV = 1100-1200 mL)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.spirometryvolumesim.setMode(\'normal\')">1. Normal Spirogram Trace</button>' +
      '<button class="preset-btn" onclick="SIMS.spirometryvolumesim.setMode(\'capacities\')">2. Complete Volume & Capacity Map</button>' +
      '<button class="preset-btn" onclick="SIMS.spirometryvolumesim.setMode(\'hourly\')">3. Hourly Tidal Ventilation Calculator</button>';
  }

  function setMode(m){
    mode = m;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (mode === "normal" || mode === "capacities") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">CLINICAL SPIROGRAM: PULMONARY VOLUMES & FUNCTIONAL CAPACITIES (mL)</text>';

      // Y-axis: 0 to 6000 mL (x: 80, y: 330 to 60)
      svg += '<line x1="80" y1="330" x2="680" y2="330" stroke="#475569" stroke-width="2"/>';
      svg += '<line x1="80" y1="330" x2="80" y2="50" stroke="#475569" stroke-width="2"/>';
      svg += '<text x="65" y="55" fill="#94a3b8" font-size="11" text-anchor="end">Volume (mL)</text>';

      var vols = [
        {val: 0, y: 330, label: "0"},
        {val: 1200, y: 280, label: "1200 (RV)"},
        {val: 2300, y: 230, label: "2300 (FRC)"},
        {val: 2800, y: 190, label: "2800 (TV Top)"},
        {val: 5800, y: 70, label: "5800 (TLC)"}
      ];
      for (var v = 0; v < vols.length; v++) {
        svg += '<line x1="75" y1="' + vols[v].y + '" x2="80" y2="' + vols[v].y + '" stroke="#94a3b8"/>';
        svg += '<line x1="80" y1="' + vols[v].y + '" x2="680" y2="' + vols[v].y + '" stroke="#334155" stroke-dasharray="3"/>';
        svg += '<text x="70" y="' + (vols[v].y + 4) + '" fill="#94a3b8" font-size="10" text-anchor="end">' + vols[v].label + '</text>';
      }

      // Spirogram Wave:
      // Normal TV waves (2300 to 2800) -> Max inspiration up to 5800 -> Max expiration down to 1200 -> Return to TV
      var wave = 'M 90 230 Q 110 190 130 230 Q 150 270 170 230 Q 190 190 210 230 ';
      wave += 'L 240 230 L 290 70 L 350 280 L 400 230 Q 420 190 440 230 Q 460 270 480 230';
      svg += '<path d="' + wave + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';

      // Colored volume bands on right side (x: 520 to 670)
      // TLC Bracket
      svg += '<rect x="520" y="70" width="150" height="210" fill="#10b981" opacity="0.15" stroke="#10b981" stroke-width="1.5"/>';
      svg += '<text x="595" y="85" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Vital Capacity (VC: 4600)</text>';

      // IRV band (70 to 190 = 120 px)
      svg += '<rect x="530" y="70" width="130" height="120" fill="#10b981" opacity="0.3"/>';
      svg += '<text x="595" y="130" fill="#6ee7b7" font-size="10" text-anchor="middle">IRV (~3000 mL)</text>';

      // TV band (190 to 230 = 40 px)
      svg += '<rect x="530" y="190" width="130" height="40" fill="#38bdf8" opacity="0.5"/>';
      svg += '<text x="595" y="215" fill="#e0f2fe" font-size="10" font-weight="bold" text-anchor="middle">TV (500 mL)</text>';

      // ERV band (230 to 280 = 50 px)
      svg += '<rect x="530" y="230" width="130" height="50" fill="#fbbf24" opacity="0.3"/>';
      svg += '<text x="595" y="260" fill="#fef08a" font-size="10" text-anchor="middle">ERV (~1100 mL)</text>';

      // RV band (280 to 330 = 50 px)
      svg += '<rect x="520" y="280" width="150" height="50" fill="#ef4444" opacity="0.4" stroke="#ef4444" stroke-width="1.5"/>';
      svg += '<text x="595" y="310" fill="#fca5a5" font-size="11" font-weight="bold" text-anchor="middle">Residual Volume (RV: 1200)</text>';

      svg += '</svg>';

      rHtml = cell('Tidal Volume (TV)', '500 mL', '#38bdf8') +
              cell('Vital Capacity (VC)', '4600 mL (ERV+TV+IRV)', '#10b981') +
              cell('Residual Volume (RV)', '1200 mL (Cannot be exhaled)', '#ef4444') +
              cell('Total Lung Capacity', '5800 mL (VC + RV)', '#fbbf24');

      vHtml = '<strong>Spirometric Volume Compartments:</strong> A spirometer traces lung volume fluctuations. Tidal Volume (TV = 500 mL) is normal breathing. Forced inspiration draws an extra ~3000 mL (IRV), while forced expiration empties an extra ~1100 mL (ERV). Vital Capacity ($VC = ERV + TV + IRV \approx 4600\,\text{mL}$) measures total usable ventilation. Crucially, Residual Volume ($RV \approx 1200\,\text{mL}$) remains permanently trapped in alveoli and cannot be measured by simple water spirometry.';
    }
    else if (mode === "hourly") {
      var rate = 12 + t; // 12 to 16 breaths/min
      var tv = 500;
      var minuteVol = rate * tv;
      var hourlyVol = minuteVol * 60;
      var hourlyLitres = hourlyVol / 1000;

      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HOURLY TIDAL VENTILATION STOICHIOMETRY (EXERCISE 14.14)</text>';

      // Calculation Box
      svg += '<rect x="80" y="70" width="600" height="250" fill="#1e293b" rx="8" stroke="#334155"/>';
      svg += '<text x="110" y="105" fill="#38bdf8" font-size="14" font-weight="bold">Parameters for a Healthy Resting Adult:</text>';
      svg += '<text x="110" y="135" fill="#f8fafc" font-size="13">• Normal Tidal Volume (TV) = 500 mL per breath</text>';
      svg += '<text x="110" y="165" fill="#f8fafc" font-size="13">• Resting Respiratory Rate = ' + rate + ' breaths per minute (Normal range: 12 - 16)</text>';
      svg += '<text x="110" y="195" fill="#fbbf24" font-size="13">• Total Breaths in 1 Hour = ' + rate + ' × 60 = ' + (rate * 60) + ' breaths / hour</text>';

      // Big Result Highlight
      svg += '<rect x="110" y="220" width="540" height="75" fill="#0f172a" rx="6" stroke="#10b981" stroke-width="2"/>';
      svg += '<text x="380" y="250" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">Total Air Inhaled & Exhaled in 1 Hour:</text>';
      svg += '<text x="380" y="280" fill="#6ee7b7" font-size="18" font-weight="bold" text-anchor="middle">' + hourlyVol.toLocaleString() + ' mL = ' + hourlyLitres.toFixed(0) + ' Litres / Hour</text>';

      svg += '</svg>';

      rHtml = cell('Respiratory Rate', rate + ' breaths / min', '#38bdf8') +
              cell('Breaths Per Hour', (rate * 60) + ' breaths', '#fbbf24') +
              cell('Tidal Volume', '500 mL / breath', '#94a3b8') +
              cell('Hourly Ventilation', hourlyLitres.toFixed(0) + ' Litres / Hour', '#10b981');

      vHtml = '<strong>Hourly Ventilation Calculation:</strong> A healthy human takes 12 to 16 breaths per minute at rest. With a Tidal Volume of 500 mL per breath, the minute ventilation is $6000\text{ to }8000\,\text{mL/min}$. Multiplied across 60 minutes, a healthy adult breathes <strong>360,000 to 480,000 mL (360 to 480 Litres) of air every single hour</strong>.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setMode: setMode
  };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Gas Exchange & Diffusion (gasexchangediffusionsim)
// -------------------------------------------------------------------------
window.SIMS.gasexchangediffusionsim = (function(){
  var view = "alveolar_barrier"; // "alveolar_barrier", "partial_pressures", "solubility_law"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Alveolar Air Space</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Pulmonary Capillary Blood</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>3-Layered Diffusion Membrane (<0.5 mm)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>CO2 20-25x High Solubility Advantage</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.gasexchangediffusionsim.setView(\'alveolar_barrier\')">1. Respiratory Diffusion Membrane</button>' +
      '<button class="preset-btn" onclick="SIMS.gasexchangediffusionsim.setView(\'partial_pressures\')">2. Complete Partial Pressure Gradient</button>' +
      '<button class="preset-btn" onclick="SIMS.gasexchangediffusionsim.setView(\'solubility_law\')">3. CO2 Solubility vs O2 Gradient</button>';
  }

  function setView(v){
    view = v;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (view === "alveolar_barrier") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">THE 3-LAYERED RESPIRATORY DIFFUSION MEMBRANE (TOTAL THICKNESS < 0.5 mm)</text>';

      // Left: Alveolar lumen
      svg += '<rect x="60" y="60" width="220" height="260" fill="#0284c7" opacity="0.25" rx="6"/>';
      svg += '<text x="170" y="90" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Alveolar Air Space</text>';
      svg += '<text x="170" y="125" fill="#f8fafc" font-size="12" text-anchor="middle">pO2 = 104 mmHg</text>';
      svg += '<text x="170" y="150" fill="#f8fafc" font-size="12" text-anchor="middle">pCO2 = 40 mmHg</text>';

      // Layer 1: Squamous alveolar epithelium
      svg += '<rect x="280" y="60" width="25" height="260" fill="#38bdf8" opacity="0.8"/>';
      svg += '<text x="292" y="190" fill="#0f172a" font-size="10" font-weight="bold" transform="rotate(-90 292 190)" text-anchor="middle">1. Squamous Alveolar Epithelium</text>';

      // Layer 2: Basement substance
      svg += '<rect x="305" y="60" width="20" height="260" fill="#fbbf24" opacity="0.8"/>';
      svg += '<text x="315" y="190" fill="#0f172a" font-size="10" font-weight="bold" transform="rotate(-90 315 190)" text-anchor="middle">2. Intervening Basement Substance</text>';

      // Layer 3: Capillary Endothelium
      svg += '<rect x="325" y="60" width="25" height="260" fill="#ef4444" opacity="0.8"/>';
      svg += '<text x="337" y="190" fill="#fff" font-size="10" font-weight="bold" transform="rotate(-90 337 190)" text-anchor="middle">3. Capillary Endothelium</text>';

      // Right: Capillary Lumen with RBC
      svg += '<rect x="350" y="60" width="350" height="260" fill="#991b1b" opacity="0.25" rx="6"/>';
      svg += '<text x="525" y="90" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">Pulmonary Capillary Blood</text>';
      svg += '<ellipse cx="480" cy="180" rx="45" ry="30" fill="#dc2626" stroke="#fca5a5" stroke-width="2"/>';
      svg += '<text x="480" y="185" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">RBC</text>';
      svg += '<text x="525" y="240" fill="#fca5a5" font-size="11" text-anchor="middle">Entering: pO2=40, pCO2=45 mmHg</text>';
      svg += '<text x="525" y="260" fill="#86efac" font-size="11" text-anchor="middle">Leaving: pO2=95, pCO2=40 mmHg</text>';

      // Gas diffusion arrows
      svg += '<g stroke="#10b981" stroke-width="3" fill="none">';
      svg += '<path d="M 230 135 L 420 135"/>';
      svg += '<path d="M 410 128 L 425 135 L 410 142"/>';
      svg += '</g>';
      svg += '<text x="325" y="125" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">O2 Inflow (Down 64 mmHg Gradient)</text>';

      svg += '<g stroke="#fbbf24" stroke-width="3" fill="none">';
      svg += '<path d="M 420 220 L 230 220"/>';
      svg += '<path d="M 240 213 L 225 220 L 240 227"/>';
      svg += '</g>';
      svg += '<text x="325" y="235" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">CO2 Outflow (High Solubility)</text>';

      svg += '</svg>';

      rHtml = cell('Membrane Thickness', '< 0.5 mm (Extremely thin)', '#10b981') +
              cell('Layer 1', 'Single-layer Squamous Epithelium', '#38bdf8') +
              cell('Layer 2', 'Basement Substance (Acellular)', '#fbbf24') +
              cell('Layer 3', 'Capillary Endothelium', '#ef4444');

      vHtml = '<strong>The 3-Layered Respiratory Membrane:</strong> Gas diffusion occurs exclusively across an ultra-thin barrier (< 0.5 mm thick) composed of: (1) the one-cell-thick squamous epithelium of alveoli, (2) the single-cell capillary endothelium, and (3) their fused thin basement substance. The combination of minimal diffusion distance and ~100 m² of surface area permits complete blood oxygenation in just ~0.25 seconds.';
    }
    else if (view === "partial_pressures") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">NCERT PARTIAL PRESSURE COMPARISON TABLE (mmHg)</text>';

      var rows = [
        {name: "Atmospheric Air", po2: "159", pco2: "0.3", color: "#38bdf8"},
        {name: "Alveoli", po2: "104", pco2: "40", color: "#10b981"},
        {name: "Deoxygenated Blood", po2: "40", pco2: "45", color: "#ef4444"},
        {name: "Oxygenated Blood", po2: "95", pco2: "40", color: "#f59e0b"},
        {name: "Tissues", po2: "40", pco2: "45", color: "#a855f7"}
      ];

      // Table Header
      svg += '<rect x="60" y="60" width="640" height="35" fill="#1e293b" rx="4"/>';
      svg += '<text x="180" y="83" fill="#f8fafc" font-size="12" font-weight="bold">Respiratory Compartment</text>';
      svg += '<text x="440" y="83" fill="#38bdf8" font-size="12" font-weight="bold">pO2 (mmHg)</text>';
      svg += '<text x="580" y="83" fill="#fca5a5" font-size="12" font-weight="bold">pCO2 (mmHg)</text>';

      for (var rw = 0; rw < rows.length; rw++) {
        var ry = 105 + rw * 45;
        svg += '<rect x="60" y="' + ry + '" width="640" height="40" fill="#0f172a" stroke="#334155" rx="3"/>';
        svg += '<circle cx="85" cy="' + (ry + 20) + '" r="6" fill="' + rows[rw].color + '"/>';
        svg += '<text x="110" y="' + (ry + 25) + '" fill="#f8fafc" font-size="12">' + rows[rw].name + '</text>';
        svg += '<text x="440" y="' + (ry + 25) + '" fill="#38bdf8" font-size="13" font-weight="bold">' + rows[rw].po2 + '</text>';
        svg += '<text x="580" y="' + (ry + 25) + '" fill="#fca5a5" font-size="13" font-weight="bold">' + rows[rw].pco2 + '</text>';
      }

      svg += '</svg>';

      rHtml = cell('Atmospheric pO2 / pCO2', '159 / 0.3 mmHg', '#38bdf8') +
              cell('Alveolar pO2 / pCO2', '104 / 40 mmHg', '#10b981') +
              cell('Deoxygenated Blood', '40 / 45 mmHg', '#ef4444') +
              cell('Oxygenated Blood', '95 / 40 mmHg', '#f59e0b');

      vHtml = '<strong>Partial Pressure Gradients:</strong> Gases diffuse strictly from high to low partial pressure. In the lungs, O2 moves from alveoli (104 mmHg) into deoxygenated capillary blood (40 mmHg) along a steep 64 mmHg gradient. In systemic tissues, O2 diffuses down its gradient (95 to 40 mmHg) into cells, while CO2 produced by cellular metabolism diffuses down its gradient (45 to 40 mmHg) into blood.';
    }
    else if (view === "solubility_law") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">FICK&#39;S LAW & SOLUBILITY RATIO: CO2 IS 20 TO 25x MORE SOLUBLE THAN O2</text>';

      // Oxygen side (Left)
      svg += '<g transform="translate(100, 70)">';
      svg += '<rect x="0" y="0" width="240" height="240" fill="#1e293b" rx="6" stroke="#38bdf8"/>';
      svg += '<text x="120" y="30" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">OXYGEN (O2)</text>';
      svg += '<text x="20" y="70" fill="#f8fafc" font-size="12">• Pressure Gradient (ΔP):</text>';
      svg += '<text x="40" y="95" fill="#38bdf8" font-size="14" font-weight="bold">104 - 40 = 64 mmHg (STEEP)</text>';
      svg += '<text x="20" y="135" fill="#f8fafc" font-size="12">• Solubility in Water/Lipids:</text>';
      svg += '<text x="40" y="160" fill="#ef4444" font-size="13" font-weight="bold">LOW (~0.024 mL/atm)</text>';
      svg += '<text x="20" y="200" fill="#94a3b8" font-size="11">Requires massive ΔP to drive diffusion</text>';
      svg += '</g>';

      // Carbon Dioxide side (Right)
      svg += '<g transform="translate(420, 70)">';
      svg += '<rect x="0" y="0" width="240" height="240" fill="#1e293b" rx="6" stroke="#10b981"/>';
      svg += '<text x="120" y="30" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">CARBON DIOXIDE (CO2)</text>';
      svg += '<text x="20" y="70" fill="#f8fafc" font-size="12">• Pressure Gradient (ΔP):</text>';
      svg += '<text x="40" y="95" fill="#f59e0b" font-size="14" font-weight="bold">45 - 40 = 5 mmHg (GENTLE)</text>';
      svg += '<text x="20" y="135" fill="#f8fafc" font-size="12">• Solubility in Water/Lipids:</text>';
      svg += '<text x="40" y="160" fill="#10b981" font-size="13" font-weight="bold">20 to 25x HIGHER than O2!</text>';
      svg += '<text x="20" y="200" fill="#d1fae5" font-size="11">Diffuses equally fast despite small ΔP</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Oxygen Gradient (ΔP)', '64 mmHg (104 - 40)', '#38bdf8') +
              cell('CO2 Gradient (ΔP)', '5 mmHg (45 - 40)', '#f59e0b') +
              cell('CO2 Solubility Multiplier', '20 to 25 Times Higher', '#10b981') +
              cell('Equilibrium Time', '~0.25 seconds (Equal rates)', '#fbbf24');

      vHtml = '<strong>Why Small CO2 Gradient is Sufficient:</strong> According to Fick’s law of diffusion, the diffusion rate is proportional to $(S \times \Delta P)/d$. While oxygen relies on a massive partial pressure gradient of 64 mmHg, carbon dioxide’s aqueous solubility is 20 to 25 times higher than that of oxygen. Thus, a gentle 5 mmHg gradient moves carbon dioxide across the respiratory membrane just as swiftly as oxygen.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Oxyhemoglobin Dissociation Curve (oxydissociationcurvesim)
// -------------------------------------------------------------------------
window.SIMS.oxydissociationcurvesim = (function(){
  var curveMode = "normal"; // "normal", "bohr_right", "lungs_left"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Standard Sigmoidal ODC (P50 = 26 mmHg)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Right Shift (Bohr Effect: High CO2, Acid, Temp)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Left Shift (Lungs: Low CO2, Alkaline, Cool)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>5 mL O2 Delivered per 100 mL Blood</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.oxydissociationcurvesim.setMode(\'normal\')">1. Standard Sigmoidal Curve</button>' +
      '<button class="preset-btn" onclick="SIMS.oxydissociationcurvesim.setMode(\'bohr_right\')">2. Right Shift: Bohr Effect in Tissues</button>' +
      '<button class="preset-btn" onclick="SIMS.oxydissociationcurvesim.setMode(\'lungs_left\')">3. Left Shift: Pulmonary Loading</button>';
  }

  function setMode(m){
    curveMode = m;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
    svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">OXYHEMOGLOBIN DISSOCIATION CURVE (ODC) & THE BOHR EFFECT</text>';

    // Axes: X: pO2 (0 to 120 mmHg, x: 80 to 680 = 600 px -> 5 px per mmHg)
    // Y: % Saturation (0 to 100%, y: 320 to 70 = 250 px -> 2.5 px per %)
    svg += '<line x1="80" y1="320" x2="680" y2="320" stroke="#475569" stroke-width="2"/>';
    svg += '<line x1="80" y1="320" x2="80" y2="60" stroke="#475569" stroke-width="2"/>';
    svg += '<text x="680" y="345" fill="#94a3b8" font-size="11" text-anchor="end">Partial Pressure of Oxygen pO2 (mmHg)</text>';
    svg += '<text x="65" y="65" fill="#94a3b8" font-size="11" text-anchor="end">% Saturation</text>';

    // Grid marks
    for (var p = 0; p <= 100; p += 20) {
      var gx = 80 + p * 5;
      svg += '<line x1="' + gx + '" y1="320" x2="' + gx + '" y2="325" stroke="#94a3b8"/>';
      svg += '<text x="' + gx + '" y="340" fill="#94a3b8" font-size="10" text-anchor="middle">' + p + '</text>';
    }
    for (var s = 0; s <= 100; s += 20) {
      var gy = 320 - s * 2.5;
      svg += '<line x1="75" y1="' + gy + '" x2="80" y2="' + gy + '" stroke="#94a3b8"/>';
      svg += '<line x1="80" y1="' + gy + '" x2="680" y2="' + gy + '" stroke="#334155" stroke-dasharray="3"/>';
      svg += '<text x="70" y="' + (gy + 4) + '" fill="#94a3b8" font-size="10" text-anchor="end">' + s + '%</text>';
    }

    // Normal Curve path (Green)
    // p=26 -> 50% (x: 210, y: 195); p=40 -> 75% (x: 280, y: 132); p=95 -> 97% (x: 555, y: 77)
    var normPath = 'M 80 320 C 130 315, 170 290, 210 195 C 250 120, 320 85, 555 77 L 680 75';
    svg += '<path d="' + normPath + '" fill="none" stroke="#10b981" stroke-width="3" opacity="' + (curveMode === "normal" ? "1" : "0.4") + '"/>';

    // Right Shift Curve (Red - Bohr effect: P50 moves right to ~36 mmHg)
    var rightPath = 'M 80 320 C 140 318, 200 305, 260 195 C 310 135, 380 95, 600 85 L 680 82';
    svg += '<path d="' + rightPath + '" fill="none" stroke="#ef4444" stroke-width="3" opacity="' + (curveMode === "bohr_right" ? "1" : "0.3") + '"/>';

    // Left Shift Curve (Cyan - Lungs: P50 moves left to ~18 mmHg)
    var leftPath = 'M 80 320 C 110 310, 140 270, 170 195 C 200 110, 260 78, 500 75 L 680 73';
    svg += '<path d="' + leftPath + '" fill="none" stroke="#38bdf8" stroke-width="3" opacity="' + (curveMode === "lungs_left" ? "1" : "0.3") + '"/>';

    // Mark 50% line and P50
    svg += '<line x1="80" y1="195" x2="300" y2="195" stroke="#fbbf24" stroke-dasharray="4"/>';
    svg += '<text x="290" y="190" fill="#fbbf24" font-size="10">50% Saturation Level (P50)</text>';

    // Annotations box
    svg += '<rect x="440" y="140" width="230" height="150" fill="#1e293b" rx="6" stroke="#334155"/>';
    if (curveMode === "normal") {
      svg += '<text x="455" y="165" fill="#10b981" font-size="12" font-weight="bold">Standard Resting ODC:</text>';
      svg += '<text x="455" y="190" fill="#f8fafc" font-size="11">• P50 = 26.6 mmHg</text>';
      svg += '<text x="455" y="210" fill="#f8fafc" font-size="11">• Alveolar pO2 (104) = 97.5% sat</text>';
      svg += '<text x="455" y="230" fill="#f8fafc" font-size="11">• Tissue pO2 (40) = 75% sat</text>';
      svg += '<text x="455" y="255" fill="#fbbf24" font-size="11" font-weight="bold">Delivers 5 mL O2 / 100 mL blood</text>';
    } else if (curveMode === "bohr_right") {
      svg += '<text x="455" y="165" fill="#ef4444" font-size="12" font-weight="bold">RIGHT SHIFT (Bohr Effect):</text>';
      svg += '<text x="455" y="190" fill="#fca5a5" font-size="11">• ↑ pCO2, ↑ H+ (Acidosis), ↑ Temp</text>';
      svg += '<text x="455" y="210" fill="#fca5a5" font-size="11">• P50 increases to ~36 mmHg</text>';
      svg += '<text x="455" y="230" fill="#fca5a5" font-size="11">• Lowers Hb-O2 affinity</text>';
      svg += '<text x="455" y="255" fill="#10b981" font-size="11" font-weight="bold">Unloads extra O2 to active muscle</text>';
    } else if (curveMode === "lungs_left") {
      svg += '<text x="455" y="165" fill="#38bdf8" font-size="12" font-weight="bold">LEFT SHIFT (Lungs):</text>';
      svg += '<text x="455" y="190" fill="#bae6fd" font-size="11">• ↓ pCO2, ↓ H+ (Alkalosis), ↓ Temp</text>';
      svg += '<text x="455" y="210" fill="#bae6fd" font-size="11">• P50 decreases to ~18 mmHg</text>';
      svg += '<text x="455" y="230" fill="#bae6fd" font-size="11">• Increases Hb-O2 affinity</text>';
      svg += '<text x="455" y="255" fill="#38bdf8" font-size="11" font-weight="bold">Promotes rapid O2 loading in lungs</text>';
    }

    svg += '</svg>';

    rHtml = cell('Curve Status', (curveMode === "normal" ? "Normal Sigmoidal" : (curveMode === "bohr_right" ? "Shift to RIGHT (Bohr)" : "Shift to LEFT")), (curveMode === "bohr_right" ? "#ef4444" : (curveMode === "lungs_left" ? "#38bdf8" : "#10b981"))) +
            cell('P50 Value', (curveMode === "bohr_right" ? "36 mmHg (Lower affinity)" : (curveMode === "lungs_left" ? "18 mmHg (High affinity)" : "26.6 mmHg")), '#fbbf24') +
            cell('Alveolar Saturation', '97.5% Saturation', '#10b981') +
            cell('Resting O2 Delivery', '5 mL O2 per 100 mL blood', '#38bdf8');

    vHtml = '<strong>Oxyhemoglobin Dissociation Curve & Cooperativity:</strong> Hemoglobin’s sigmoidal binding curve is governed by positive allosteric cooperativity among its four subunits. In the tissues, elevated $p\text{CO}_2$, hydrogen ions, and temperature shift the curve to the right (the Bohr Effect), decreasing oxygen affinity and facilitating the release of ~5 mL of O2 per 100 mL of blood. In the lungs, low $p\text{CO}_2$ and higher pH shift the curve left, ensuring nearly 100% saturation.';

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setMode: setMode
  };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: CO2 Transport & Chloride Shift (co2transportsystemsim)
// -------------------------------------------------------------------------
window.SIMS.co2transportsystemsim = (function(){
  var transportView = "three_modes"; // "three_modes", "tissue_erythrocyte", "alveolar_unloading"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>70% Bicarbonate Ions (HCO3-)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>20-25% Carbamino-Hemoglobin</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>7% Dissolved in Plasma</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Chloride Shift (Hamburger Influx/Efflux)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.co2transportsystemsim.setView(\'three_modes\')">1. Three Modes of CO2 Transport</button>' +
      '<button class="preset-btn" onclick="SIMS.co2transportsystemsim.setView(\'tissue_erythrocyte\')">2. Tissue Uptake & Chloride Shift</button>' +
      '<button class="preset-btn" onclick="SIMS.co2transportsystemsim.setView(\'alveolar_unloading\')">3. Alveolar Unloading (4 mL / 100 mL)</button>';
  }

  function setView(v){
    transportView = v;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (transportView === "three_modes") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">THREE MODES OF CARBON DIOXIDE TRANSPORT IN HUMAN BLOOD</text>';

      // Pie chart on left
      svg += '<g transform="translate(220, 200)">';
      // 70% Bicarbonate arc (~252 deg)
      svg += '<path d="M 0 0 L 0 -110 A 110 110 0 1 1 -105 34 Z" fill="#38bdf8" opacity="0.9"/>';
      // 23% Carbamino arc (~83 deg)
      svg += '<path d="M 0 0 L -105 34 A 110 110 0 0 1 -34 -105 Z" fill="#ef4444" opacity="0.9"/>';
      // 7% Dissolved arc (~25 deg)
      svg += '<path d="M 0 0 L -34 -105 A 110 110 0 0 1 0 -110 Z" fill="#fbbf24" opacity="0.9"/>';
      svg += '<circle cx="0" cy="0" r="45" fill="#0f172a"/>';
      svg += '<text x="0" y="5" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Total CO2</text>';
      svg += '</g>';

      // Breakdown Cards on Right
      svg += '<g transform="translate(420, 60)">';
      // Mode 1: Bicarbonate
      svg += '<rect x="0" y="0" width="300" height="75" fill="#1e293b" rx="6" stroke="#38bdf8"/>';
      svg += '<text x="15" y="24" fill="#38bdf8" font-size="13" font-weight="bold">1. As Bicarbonate (HCO3-): ~70%</text>';
      svg += '<text x="15" y="44" fill="#f8fafc" font-size="11">CO2 + H2O <-> H2CO3 <-> HCO3- + H+</text>';
      svg += '<text x="15" y="62" fill="#94a3b8" font-size="10">Driven by intra-erythrocytic Carbonic Anhydrase</text>';

      // Mode 2: Carbamino-Hb
      svg += '<rect x="0" y="90" width="300" height="75" fill="#1e293b" rx="6" stroke="#ef4444"/>';
      svg += '<text x="15" y="114" fill="#ef4444" font-size="13" font-weight="bold">2. Carbamino-Hemoglobin: 20-25%</text>';
      svg += '<text x="15" y="134" fill="#f8fafc" font-size="11">Binds amino groups of globin polypeptide chains</text>';
      svg += '<text x="15" y="152" fill="#94a3b8" font-size="10">Hb-NH2 + CO2 <-> Hb-NHCOO- + H+</text>';

      // Mode 3: Dissolved
      svg += '<rect x="0" y="180" width="300" height="75" fill="#1e293b" rx="6" stroke="#fbbf24"/>';
      svg += '<text x="15" y="204" fill="#fbbf24" font-size="13" font-weight="bold">3. Dissolved in Plasma: ~7%</text>';
      svg += '<text x="15" y="224" fill="#f8fafc" font-size="11">Carried physically dissolved in plasma water</text>';
      svg += '<text x="15" y="242" fill="#94a3b8" font-size="10">Enabled by 20-25x higher solubility than O2</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Bicarbonate (HCO3-)', '70% (Primary transport mode)', '#38bdf8') +
              cell('Carbamino-Hemoglobin', '20 - 25% (Globin amine bound)', '#ef4444') +
              cell('Dissolved in Plasma', '7% (Physical solution)', '#fbbf24') +
              cell('Alveolar Delivery', '4 mL CO2 per 100 mL blood', '#10b981');

      vHtml = '<strong>Three Pathways of CO2 Transport:</strong> Approximately 70% of carbon dioxide is carried as bicarbonate ions dissolved in plasma, catalyzed by red blood cell carbonic anhydrase. Between 20% and 25% binds directly to amino groups on hemoglobin protein chains forming carbamino-hemoglobin. The remaining 7% is transported physically dissolved in blood plasma.';
    }
    else if (transportView === "tissue_erythrocyte") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">SYSTEMIC TISSUE UPTAKE & THE CHLORIDE SHIFT (HAMBURGER PHENOMENON)</text>';

      // Tissue Cell on Left
      svg += '<rect x="50" y="70" width="140" height="250" fill="#334155" rx="6"/>';
      svg += '<text x="120" y="100" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Respiring Tissues</text>';
      svg += '<text x="120" y="130" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">pCO2 = 45 mmHg</text>';
      svg += '<text x="120" y="220" fill="#94a3b8" font-size="10" text-anchor="middle">Produces metabolic CO2</text>';

      // Arrow CO2 out to blood
      svg += '<path d="M 190 150 L 250 150" stroke="#ef4444" stroke-width="4" marker-end="url(#arrow)"/>';
      svg += '<text x="220" y="140" fill="#ef4444" font-size="11" text-anchor="middle">CO2</text>';

      // Red Blood Cell (Giant ellipse)
      svg += '<ellipse cx="480" cy="195" rx="210" ry="125" fill="#991b1b" opacity="0.6" stroke="#f87171" stroke-width="3"/>';
      svg += '<text x="480" y="100" fill="#fca5a5" font-size="13" font-weight="bold" text-anchor="middle">Red Blood Cell (Erythrocyte)</text>';

      // Chemical Reaction Inside RBC
      svg += '<text x="360" y="145" fill="#fff" font-size="12" font-weight="bold">CO2 + H2O</text>';
      svg += '<path d="M 430 142 L 460 142" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<text x="445" y="133" fill="#fbbf24" font-size="9" text-anchor="middle">CA</text>';
      svg += '<text x="470" y="145" fill="#fff" font-size="12" font-weight="bold">H2CO3 <-> HCO3- + H+</text>';

      // Chloride Shift: HCO3- out, Cl- in
      svg += '<g stroke="#38bdf8" stroke-width="3" fill="none">';
      svg += '<path d="M 580 160 L 670 160"/>';
      svg += '<path d="M 660 153 L 675 160 L 660 167"/>';
      svg += '</g>';
      svg += '<text x="625" y="150" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">HCO3- Efflux to Plasma</text>';

      svg += '<g stroke="#10b981" stroke-width="3" fill="none">';
      svg += '<path d="M 670 210 L 580 210"/>';
      svg += '<path d="M 590 203 L 575 210 L 590 217"/>';
      svg += '</g>';
      svg += '<text x="625" y="230" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Cl- Influx (Chloride Shift)</text>';

      svg += '<text x="480" y="250" fill="#fde047" font-size="11" text-anchor="middle">Maintains Electrical Neutrality across RBC Membrane</text>';
      svg += '</svg>';

      rHtml = cell('Carbonic Anhydrase (CA)', 'Zinc metalloenzyme accelerates 5000x', '#fbbf24') +
              cell('Bicarbonate Migration', 'Diffuses OUT into plasma', '#38bdf8') +
              cell('Chloride Shift', 'Cl- diffuses IN from plasma', '#10b981') +
              cell('Electrochemical State', 'Preserves neutral RBC membrane potential', '#fca5a5');

      vHtml = '<strong>The Chloride Shift (Hamburger Phenomenon):</strong> Inside RBCs, carbonic anhydrase rapidly combines CO2 with water into carbonic acid, which dissociates into $HCO_3^-$ and $H^+$. The bicarbonate ions diffuse down their concentration gradient into the blood plasma. To preserve electrical neutrality across the erythrocyte membrane, chloride ions ($Cl^-$) immediately shift from plasma into the RBC.';
    }
    else if (transportView === "alveolar_unloading") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">PULMONARY REVERSAL: 4 mL OF CO2 UNLOADED PER 100 mL BLOOD INTO ALVEOLI</text>';

      // Pulmonary Alveolus on Right
      svg += '<rect x="520" y="70" width="180" height="250" fill="#0284c7" opacity="0.3" rx="6" stroke="#38bdf8"/>';
      svg += '<text x="610" y="100" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Pulmonary Alveolus</text>';
      svg += '<text x="610" y="130" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">pCO2 = 40 mmHg</text>';
      svg += '<text x="610" y="170" fill="#7dd3fc" font-size="11" text-anchor="middle">Low pCO2 drives reversal</text>';
      svg += '<text x="610" y="230" fill="#fde047" font-size="12" font-weight="bold" text-anchor="middle">4 mL CO2 Exhaled</text>';

      // RBC Reversing reactions
      svg += '<ellipse cx="280" cy="195" rx="190" ry="120" fill="#991b1b" opacity="0.6" stroke="#f87171" stroke-width="3"/>';
      svg += '<text x="280" y="105" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">Capillary RBC in Alveolus</text>';

      // Reversed chloride shift
      svg += '<g stroke="#38bdf8" stroke-width="2.5" fill="none">';
      svg += '<path d="M 400 150 L 460 150"/>';
      svg += '<path d="M 410 143 L 395 150 L 410 157"/>';
      svg += '</g>';
      svg += '<text x="430" y="140" fill="#38bdf8" font-size="10">HCO3- Enters</text>';

      svg += '<g stroke="#10b981" stroke-width="2.5" fill="none">';
      svg += '<path d="M 460 200 L 400 200"/>';
      svg += '<path d="M 450 193 L 465 200 L 450 207"/>';
      svg += '</g>';
      svg += '<text x="430" y="220" fill="#10b981" font-size="10">Cl- Exits</text>';

      // CO2 exiting to Alveolus
      svg += '<path d="M 420 180 L 515 180" stroke="#fde047" stroke-width="4" marker-end="url(#arrow)"/>';
      svg += '<text x="470" y="170" fill="#fde047" font-size="12" font-weight="bold">CO2 Gas</text>';

      svg += '</svg>';

      rHtml = cell('Alveolar Gradient', '45 mmHg (Blood) -> 40 mmHg (Alveoli)', '#38bdf8') +
              cell('Reverse Reaction', 'HCO3- + H+ -> H2CO3 -> CO2 + H2O', '#fbbf24') +
              cell('Chloride Efflux', 'Cl- leaves RBC into plasma', '#10b981') +
              cell('Exhalation Metric', '4 mL CO2 per 100 mL deoxygenated blood', '#ef4444');

      vHtml = '<strong>Alveolar Unloading of CO2:</strong> In the lungs where alveolar $p\text{CO}_2$ is low (40 mmHg), the entire pathway reverses: bicarbonate ions enter the RBC, chloride ions exit into plasma, and carbonic anhydrase rapidly breaks down carbonic acid into water and carbon dioxide gas. The CO2 diffuses across the respiratory membrane into the alveoli and is exhaled, delivering <strong>4 mL of CO2 for every 100 mL of deoxygenated blood</strong>.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Neural Control & Pathology (neuralregulationsim)
// -------------------------------------------------------------------------
window.SIMS.neuralregulationsim = (function(){
  var mode = "neural_network"; // "neural_network", "altitude_hypoxia", "pathology"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Medullary Respiratory Rhythm Center</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pontine Pneumotaxic Center (Off-Switch)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Central CO2 / H+ Chemosensitive Area</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Altitude Hypoxia & Compensatory EPO</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.neuralregulationsim.setMode(\'neural_network\')">1. Brainstem Respiratory Control Network</button>' +
      '<button class="preset-btn" onclick="SIMS.neuralregulationsim.setMode(\'altitude_hypoxia\')">2. High Altitude Hypobaric Hypoxia Lab</button>' +
      '<button class="preset-btn" onclick="SIMS.neuralregulationsim.setMode(\'pathology\')">3. Respiratory Disorders (Asthma & Emphysema)</button>';
  }

  function setMode(m){
    mode = m;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (mode === "neural_network") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">NEURAL & CHEMICAL REGULATION: MEDULLA, PONS & CHEMOSENSITIVE CENTERS</text>';

      // Brainstem Silhouette
      svg += '<path d="M 280 60 C 280 60, 360 50, 440 60 C 470 120, 480 180, 450 300 L 320 300 C 300 200, 270 130, 280 60 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>';

      // 1. Pneumotaxic Center in Pons (Upper)
      svg += '<rect x="330" y="90" width="140" height="40" fill="#0284c7" rx="4"/>';
      svg += '<text x="400" y="115" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Pneumotaxic Center (Pons)</text>';

      // Inhibitory signal to Rhythm Center
      svg += '<line x1="400" y1="130" x2="400" y2="175" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4"/>';
      svg += '<text x="440" y="155" fill="#38bdf8" font-size="10">Switches OFF inspiration</text>';

      // 2. Respiratory Rhythm Center in Medulla (Lower)
      svg += '<rect x="320" y="180" width="160" height="45" fill="#ef4444" rx="4"/>';
      svg += '<text x="400" y="208" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Rhythm Center (Medulla)</text>';

      // 3. Central Chemosensitive Area
      svg += '<rect x="130" y="180" width="160" height="45" fill="#fbbf24" opacity="0.9" rx="4"/>';
      svg += '<text x="210" y="202" fill="#0f172a" font-size="11" font-weight="bold" text-anchor="middle">Chemosensitive Area</text>';
      svg += '<text x="210" y="217" fill="#78350f" font-size="9" text-anchor="middle">Sensitive to CO2 & H+</text>';
      svg += '<line x1="290" y1="202" x2="320" y2="202" stroke="#fbbf24" stroke-width="3"/>';

      // Peripheral Chemoreceptors (Carotid / Aortic bodies)
      svg += '<rect x="520" y="180" width="180" height="45" fill="#10b981" rx="4"/>';
      svg += '<text x="610" y="202" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Carotid & Aortic Bodies</text>';
      svg += '<text x="610" y="217" fill="#d1fae5" font-size="9" text-anchor="middle">Monitor arterial CO2 & pH</text>';
      svg += '<line x1="520" y1="202" x2="480" y2="202" stroke="#10b981" stroke-width="3"/>';

      // Down to Diaphragm / Intercostals
      svg += '<line x1="400" y1="225" x2="400" y2="320" stroke="#ef4444" stroke-width="4"/>';
      svg += '<text x="400" y="340" fill="#fca5a5" font-size="11" font-weight="bold" text-anchor="middle">Phrenic & Intercostal Motor Output</text>';

      svg += '</svg>';

      rHtml = cell('Rhythm Pacemaker', 'Medulla Oblongata Rhythm Center', '#ef4444') +
              cell('Inspiratory Off-Switch', 'Pons Pneumotaxic Center', '#38bdf8') +
              cell('Primary Chemical Driver', 'Carbon Dioxide (pCO2) and H+ ions', '#fbbf24') +
              cell('Role of Oxygen (pO2)', 'Insignificant in normal pacing', '#94a3b8');

      vHtml = '<strong>Neural Control Architecture:</strong> The basic respiratory cadence is set by the <em>respiratory rhythm center</em> in the medulla. The <em>pneumotaxic center</em> in the pons varolii transmits inhibitory signals to curtail the duration of inspiration, thereby regulating breath rate. Chemical drive is monitored by central chemosensors sensitive exclusively to arterial $p\text{CO}_2$ and $[H^+]$; counter-intuitively, oxygen plays a negligible role in day-to-day respiratory regulation.';
    }
    else if (mode === "altitude_hypoxia") {
      var alt = t * 1000; // 0m to 4000m
      var patm = Math.round(760 * Math.exp(-alt / 8000));
      var po2 = Math.round(patm * 0.209);
      var rbc = (5.0 + t * 0.4).toFixed(1);

      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HIGH ALTITUDE PHYSIOLOGY & ACCLIMATIZATION (EXERCISE 14.9)</text>';

      // Mountain drawing
      svg += '<polygon points="80,320 280,110 480,320" fill="#334155"/>';
      svg += '<polygon points="230,162 280,110 330,162" fill="#f8fafc"/>';
      svg += '<text x="280" y="100" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Altitude: ' + alt + ' m</text>';

      // Climber marker at current altitude
      var cx = 80 + (alt / 4000) * 200;
      var cy = 320 - (alt / 4000) * 210;
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="#ef4444"/>';
      svg += '<text x="' + (cx + 15) + '" y="' + (cy - 5) + '" fill="#fca5a5" font-size="11" font-weight="bold">Climber</text>';

      // Metrics Panel on Right
      svg += '<rect x="440" y="80" width="280" height="230" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="460" y="110" fill="#38bdf8" font-size="13" font-weight="bold">Atmospheric Parameters:</text>';
      svg += '<text x="460" y="135" fill="#f8fafc" font-size="12">• Barometric Pressure: ' + patm + ' mmHg</text>';
      svg += '<text x="460" y="160" fill="#f8fafc" font-size="12">• Ambient pO2: ' + po2 + ' mmHg</text>';
      svg += '<text x="460" y="190" fill="#10b981" font-size="13" font-weight="bold">Physiological Adaptations:</text>';
      svg += '<text x="460" y="215" fill="#a7f3d0" font-size="11">• Arterial hypoxia triggers hyperventilation</text>';
      svg += '<text x="460" y="235" fill="#a7f3d0" font-size="11">• Kidneys secrete Erythropoietin (EPO)</text>';
      svg += '<text x="460" y="255" fill="#a7f3d0" font-size="11">• RBC Count rises to ' + rbc + ' million/mm³</text>';
      svg += '<text x="460" y="275" fill="#fbbf24" font-size="11">• 2,3-BPG increases O2 unloading</text>';

      svg += '</svg>';

      rHtml = cell('Current Altitude', alt + ' meters', '#38bdf8') +
              cell('Atmospheric Pressure', patm + ' mmHg', '#ef4444') +
              cell('Ambient pO2', po2 + ' mmHg (Drops from 159)', '#fbbf24') +
              cell('RBC Acclimatization', rbc + ' million/mm³ (Polycythemia)', '#10b981');

      vHtml = '<strong>High Altitude Acclimatization:</strong> Ascending to high altitudes lowers barometric pressure and atmospheric $p\text{O}_2$. Arterial hypoxia stimulates peripheral chemoreceptors to induce hyperventilation. Over subsequent days and weeks, sustained hypoxia triggers the kidneys to secrete erythropoietin (EPO), stimulating red bone marrow to synthesize more red blood cells (polycythemia) and raising total oxygen transport capacity.';
    }
    else if (mode === "pathology") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">RESPIRATORY PATHOLOGY: ASTHMA, EMPHYSEMA & OCCUPATIONAL DISORDERS</text>';

      // Box 1: Asthma
      svg += '<g transform="translate(60, 70)">';
      svg += '<rect x="0" y="0" width="190" height="240" fill="#1e293b" rx="6" stroke="#f59e0b"/>';
      svg += '<text x="95" y="28" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">ASTHMA</text>';
      svg += '<text x="15" y="65" fill="#f8fafc" font-size="11">• Allergic inflammation</text>';
      svg += '<text x="15" y="90" fill="#f8fafc" font-size="11">• Spasm of bronchioles</text>';
      svg += '<text x="15" y="115" fill="#f8fafc" font-size="11">• Narrowed airways</text>';
      svg += '<text x="15" y="140" fill="#f8fafc" font-size="11">• Symptom: Wheezing</text>';
      svg += '<text x="15" y="165" fill="#f8fafc" font-size="11">• Difficulty in breathing</text>';
      svg += '<text x="15" y="200" fill="#fde047" font-size="10">Bronchodilators relieve spasm</text>';
      svg += '</g>';

      // Box 2: Emphysema
      svg += '<g transform="translate(285, 70)">';
      svg += '<rect x="0" y="0" width="190" height="240" fill="#1e293b" rx="6" stroke="#ef4444"/>';
      svg += '<text x="95" y="28" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">EMPHYSEMA</text>';
      svg += '<text x="15" y="65" fill="#f8fafc" font-size="11">• Chronic lung disease</text>';
      svg += '<text x="15" y="90" fill="#f8fafc" font-size="11">• Alveolar walls damaged</text>';
      svg += '<text x="15" y="115" fill="#f8fafc" font-size="11">• Reduced surface area</text>';
      svg += '<text x="15" y="140" fill="#f8fafc" font-size="11">• Loss of elastic recoil</text>';
      svg += '<text x="15" y="170" fill="#fca5a5" font-size="11" font-weight="bold">• Major Cause: Smoking</text>';
      svg += '<text x="15" y="200" fill="#ef4444" font-size="10">Irreversible alveolar breakdown</text>';
      svg += '</g>';

      // Box 3: Occupational Disorders
      svg += '<g transform="translate(510, 70)">';
      svg += '<rect x="0" y="0" width="190" height="240" fill="#1e293b" rx="6" stroke="#a855f7"/>';
      svg += '<text x="95" y="28" fill="#a855f7" font-size="13" font-weight="bold" text-anchor="middle">OCCUPATIONAL</text>';
      svg += '<text x="15" y="65" fill="#f8fafc" font-size="11">• Silicosis & Asbestosis</text>';
      svg += '<text x="15" y="90" fill="#f8fafc" font-size="11">• Mining & stone-breaking</text>';
      svg += '<text x="15" y="115" fill="#f8fafc" font-size="11">• Chronic dust exposure</text>';
      svg += '<text x="15" y="140" fill="#f8fafc" font-size="11">• Fibrosis (scarring)</text>';
      svg += '<text x="15" y="170" fill="#e9d5ff" font-size="11" font-weight="bold">• Severe lung damage</text>';
      svg += '<text x="15" y="200" fill="#c084fc" font-size="10">Requires protective masks</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Asthma Pathology', 'Allergic inflammation of bronchioles & wheezing', '#f59e0b') +
              cell('Emphysema Pathology', 'Alveolar septa destruction (Cigarette smoking)', '#ef4444') +
              cell('Occupational Disorders', 'Silicosis / Asbestosis with severe fibrosis', '#a855f7') +
              cell('Prevention', 'Protective respiratory gear & smoking cessation', '#10b981');

      vHtml = '<strong>Major Respiratory Disorders:</strong> (1) <em>Asthma</em> is an allergic inflammatory disorder of bronchi and bronchioles that produces wheezing and airway constriction. (2) <em>Emphysema</em> is a chronic, irreversible condition where alveolar septal walls are destroyed—primarily by cigarette smoke—drastically diminishing the respiratory diffusion area. (3) <em>Occupational lung disorders</em> (e.g., silicosis, asbestosis) result from chronic inhalation of mineral dust in quarries, causing progressive fibrosis and permanent lung scarring.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setMode: setMode
  };
})();
