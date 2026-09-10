// kebo111 interactive simulations: Photosynthesis in Higher Plants
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
// 1. SIMULATION 1: Early Discovery & Engelmann Spectrum (earlyexpsim)
// -------------------------------------------------------------------------
window.SIMS.earlyexpsim = (function(){
  var exp = "priestley_mint"; // "priestley_dead", "priestley_mint", "ingenhousz", "engelmann", "vanniel"

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Fouled Air (CO2 / Hypoxia)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Restored Air (O2 Evolved)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Engelmann Blue/Red Bacteria Clusters</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Sulfur vs Oxygen (van Niel)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.earlyexpsim.setExp(\'priestley_dead\')">1. Priestley (No Plant: Suffocation)</button>' +
      '<button class="preset-btn" onclick="SIMS.earlyexpsim.setExp(\'priestley_mint\')">2. Priestley (Mint Sprig: Air Restored)</button>' +
      '<button class="preset-btn" onclick="SIMS.earlyexpsim.setExp(\'ingenhousz\')">3. Ingenhousz (Hydrilla O2 Bubbles)</button>' +
      '<button class="preset-btn" onclick="SIMS.earlyexpsim.setExp(\'engelmann\')">4. Engelmann (Split Prism Spectrum)</button>' +
      '<button class="preset-btn" onclick="SIMS.earlyexpsim.setExp(\'vanniel\')">5. van Niel (H2S Sulfur Bacteria)</button>';
  }

  function setExp(e){
    exp = e;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EARLY MILESTONES: PRIESTLEY, INGENHOUSZ, ENGELMANN & VAN NIEL</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    if (exp === "priestley_dead" || exp === "priestley_mint") {
      // Bell Jar experiment
      var hasPlant = (exp === "priestley_mint");
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="' + (hasPlant ? '#10b981' : '#ef4444') + '" font-size="14" font-weight="bold" text-anchor="middle">' +
           (hasPlant ? "JOSEPH PRIESTLEY (1774): MINT SPRIG RESTORES AIR" : "JOSEPH PRIESTLEY (1770): CLOSED BELL JAR SUFFOCATION") + '</text>';

      // Bell jar glass dome
      m += '<path d="M ' + (cx - 120) + ' ' + (cy + 85) + ' L ' + (cx - 120) + ' ' + (cy - 20) + ' A 120 95 0 0 1 ' + (cx + 120) + ' ' + (cy - 20) + ' L ' + (cx + 120) + ' ' + (cy + 85) + ' Z" fill="' + (hasPlant ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)') + '" stroke="#64748b" stroke-width="3"/>';
      m += '<line x1="' + (cx - 140) + '" y1="' + (cy + 85) + '" x2="' + (cx + 140) + '" y2="' + (cy + 85) + '" stroke="#475569" stroke-width="5"/>';

      // Candle
      m += '<rect x="' + (cx - 70) + '" y="' + (cy + 30) + '" width="22" height="55" rx="3" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>';
      if (hasPlant) {
        // Burning flame
        m += '<ellipse cx="' + (cx - 59) + '" cy="' + (cy + 20) + '" rx="6" ry="12" fill="#fbbf24"/>';
        m += '<ellipse cx="' + (cx - 59) + '" cy="' + (cy + 22) + '" rx="3" ry="7" fill="#ef4444"/>';
        m += '<text x="' + (cx - 59) + '" y="' + (cy + 10) + '" fill="#fbbf24" font-size="10" text-anchor="middle">Burning Candle</text>';
      } else {
        // Extinguished candle with smoke
        m += '<line x1="' + (cx - 59) + '" y1="' + (cy + 30) + '" x2="' + (cx - 59) + '" y2="' + (cy + 22) + '" stroke="#000" stroke-width="2"/>';
        m += '<path d="M ' + (cx - 59) + ' ' + (cy + 20) + ' Q ' + (cx - 50) + ' ' + (cy + 5) + ' ' + (cx - 65) + ' ' + (cy - 10) + '" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,2"/>';
        m += '<text x="' + (cx - 59) + '" y="' + (cy + 5) + '" fill="#ef4444" font-size="10" text-anchor="middle">Extinguished!</text>';
      }

      // Mouse
      var mouseX = cx + 50, mouseY = cy + 65;
      if (hasPlant) {
        // Living active mouse
        m += '<ellipse cx="' + mouseX + '" cy="' + mouseY + '" rx="18" ry="12" fill="#94a3b8"/>';
        m += '<circle cx="' + (mouseX + 16) + '" cy="' + (mouseY - 3) + '" r="8" fill="#94a3b8"/>';
        m += '<circle cx="' + (mouseX + 19) + '" cy="' + (mouseY - 5) + '" r="1.5" fill="#000"/>';
        m += '<path d="M ' + (mouseX - 18) + ' ' + mouseY + ' Q ' + (mouseX - 28) + ' ' + (mouseY - 10) + ' ' + (mouseX - 35) + ' ' + (mouseY - 4) + '" fill="none" stroke="#94a3b8" stroke-width="2"/>';
        m += '<text x="' + mouseX + '" y="' + (mouseY + 20) + '" fill="#10b981" font-size="10" text-anchor="middle">Active Mouse (Alive)</text>';
      } else {
        // Dead mouse on back
        m += '<ellipse cx="' + mouseX + '" cy="' + (mouseY + 5) + '" rx="18" ry="10" fill="#64748b"/>';
        m += '<circle cx="' + (mouseX + 16) + '" cy="' + (mouseY + 5) + '" r="7" fill="#64748b"/>';
        m += '<text x="' + (mouseX + 16) + '" y="' + (mouseY + 4) + '" fill="#f87171" font-size="10">X</text>';
        m += '<text x="' + mouseX + '" y="' + (mouseY + 20) + '" fill="#ef4444" font-size="10" text-anchor="middle">Suffocated & Dead</text>';
      }

      // Mint plant
      if (hasPlant) {
        m += '<g transform="translate(' + (cx - 5) + ',' + (cy + 15) + ')">';
        m += '<rect x="-12" y="45" width="24" height="25" fill="#d97706" rx="2"/>';
        m += '<line x1="0" y1="45" x2="0" y2="0" stroke="#10b981" stroke-width="3"/>';
        m += '<ellipse cx="-12" cy="15" rx="14" ry="7" fill="#22c55e" transform="rotate(-30 -12 15)"/>';
        m += '<ellipse cx="12" cy="10" rx="14" ry="7" fill="#22c55e" transform="rotate(30 12 10)"/>';
        m += '<ellipse cx="-10" cy="-5" rx="12" ry="6" fill="#22c55e" transform="rotate(-20 -10 -5)"/>';
        m += '<ellipse cx="10" cy="-10" rx="12" ry="6" fill="#22c55e" transform="rotate(20 10 -10)"/>';
        m += '<circle cx="0" cy="-18" r="7" fill="#4ade80"/>';
        m += '<text x="0" y="-25" fill="#86efac" font-size="11" font-weight="bold" text-anchor="middle">Mint Sprig (Mentha)</text>';
        m += '<text x="0" y="80" fill="#38bdf8" font-size="10" text-anchor="middle">+ Oxygen (O2)</text>';
        m += '</g>';
      }

    } else if (exp === "ingenhousz") {
      // Jan Ingenhousz aquatic Hydrilla experiment
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">JAN INGENHOUSZ (1779): AQUATIC HYDRILLA O2 BUBBLES</text>';

      // Beaker with water
      m += '<rect x="' + (cx - 100) + '" y="' + (cy - 60) + '" width="200" height="150" rx="6" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="' + (cx - 90) + '" y="' + (cy - 45) + '" fill="#7dd3fc" font-size="10">Water Tank</text>';

      // Inverted funnel & test tube over Hydrilla
      m += '<polygon points="' + (cx - 60) + ',' + (cy + 75) + ' ' + (cx + 60) + ',' + (cy + 75) + ' ' + cx + ',' + (cy + 10) + '" fill="none" stroke="#94a3b8" stroke-width="2"/>';
      m += '<rect x="' + (cx - 10) + '" y="' + (cy - 70) + '" width="20" height="80" fill="rgba(255,255,255,0.2)" stroke="#94a3b8" stroke-width="2"/>';

      // Oxygen gas accumulating at top of tube
      m += '<rect x="' + (cx - 9) + '" y="' + (cy - 69) + '" width="18" height="25" fill="#38bdf8" opacity="0.4"/>';
      m += '<text x="' + cx + '" y="' + (cy - 50) + '" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">O2 Gas</text>';

      // Bubbles rising from green twigs
      var bubbleYs = [cy + 2, cy - 12, cy - 25, cy - 38];
      for (var b = 0; b < bubbleYs.length; b++) {
        m += '<circle cx="' + (cx - 2 + (b % 2) * 4) + '" cy="' + bubbleYs[b] + '" r="' + (2.5 + b * 0.5) + '" fill="#bae6fd" stroke="#38bdf8" stroke-width="1"/>';
      }

      // Green Hydrilla plant inside funnel
      m += '<path d="M ' + cx + ' ' + (cy + 75) + ' L ' + cx + ' ' + (cy + 20) + '" stroke="#10b981" stroke-width="4"/>';
      m += '<line x1="' + (cx - 30) + '" y1="' + (cy + 55) + '" x2="' + cx + '" y2="' + (cy + 45) + '" stroke="#22c55e" stroke-width="3"/>';
      m += '<line x1="' + (cx + 30) + '" y1="' + (cy + 55) + '" x2="' + cx + '" y2="' + (cy + 45) + '" stroke="#22c55e" stroke-width="3"/>';
      m += '<line x1="' + (cx - 25) + '" y1="' + (cy + 35) + '" x2="' + cx + '" y2="' + (cy + 30) + '" stroke="#22c55e" stroke-width="3"/>';
      m += '<line x1="' + (cx + 25) + '" y1="' + (cy + 35) + '" x2="' + cx + '" y2="' + (cy + 30) + '" stroke="#22c55e" stroke-width="3"/>';
      m += '<text x="' + cx + '" y="' + (cy + 70) + '" fill="#86efac" font-size="11" font-weight="bold" text-anchor="middle">Hydrilla sprigs</text>';

      // Sunlight rays
      m += '<circle cx="' + (cx - 150) + '" cy="' + (cy - 70) + '" r="22" fill="#fbbf24"/>';
      m += '<line x1="' + (cx - 130) + '" y1="' + (cy - 50) + '" x2="' + (cx - 80) + '" y2="' + (cy - 20) + '" stroke="#fde047" stroke-width="2.5" stroke-dasharray="4,2"/>';
      m += '<text x="' + (cx - 150) + '" y="' + (cy - 35) + '" fill="#fde047" font-size="11" font-weight="bold" text-anchor="middle">Sunlight</text>';

      m += '<text x="' + cx + '" y="' + (cy + 105) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">In dark: NO bubbles. In sunlight: rapid O2 bubble release exclusively from green parts!</text>';

    } else if (exp === "engelmann") {
      // T.W. Engelmann (1888) Action Spectrum Experiment
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">T.W. ENGELMANN (1888): FIRST ACTION SPECTRUM WITH CLADOPHORA</text>';

      // Prism splitting white light
      m += '<polygon points="' + (cx - 160) + ',' + (cy - 20) + ' ' + (cx - 120) + ',' + (cy + 40) + ' ' + (cx - 200) + ',' + (cy + 40) + '" fill="rgba(255,255,255,0.15)" stroke="#fff" stroke-width="2"/>';
      m += '<text x="' + (cx - 160) + '" y="' + (cy + 25) + '" fill="#fff" font-size="10" text-anchor="middle">Prism</text>';

      // White beam entering
      m += '<line x1="' + (cx - 240) + '" y1="' + cy + '" x2="' + (cx - 180) + '" y2="' + (cy + 10) + '" stroke="#fff" stroke-width="3"/>';
      m += '<text x="' + (cx - 225) + '" y="' + (cy - 8) + '" fill="#fff" font-size="10">White Light</text>';

      // Spectrum rainbow spread across filamentous Cladophora
      var spectrumCols = ["#3b82f6", "#06b6d4", "#10b981", "#eab308", "#f97316", "#ef4444"];
      var specW = 45;
      var specStartX = cx - 90;
      for (var s = 0; s < spectrumCols.length; s++) {
        m += '<rect x="' + (specStartX + s * specW) + '" y="' + (cy - 40) + '" width="' + specW + '" height="80" fill="' + spectrumCols[s] + '" opacity="0.25"/>';
      }

      // Cladophora filament horizontal across spectrum
      m += '<line x1="' + (specStartX - 10) + '" y1="' + cy + '" x2="' + (specStartX + 280) + '" y2="' + cy + '" stroke="#15803d" stroke-width="9" stroke-linecap="round"/>';
      m += '<text x="' + (specStartX + 130) + '" y="' + (cy - 48) + '" fill="#86efac" font-size="12" font-weight="bold" text-anchor="middle">Green Alga: Cladophora</text>';

      // Wavelength labels
      m += '<text x="' + specStartX + '" y="' + (cy + 55) + '" fill="#38bdf8" font-size="10">400 nm (Blue)</text>';
      m += '<text x="' + (specStartX + 100) + '" y="' + (cy + 55) + '" fill="#10b981" font-size="10">550 nm (Green)</text>';
      m += '<text x="' + (specStartX + 220) + '" y="' + (cy + 55) + '" fill="#ef4444" font-size="10">680 nm (Red)</text>';

      // Aerobic bacteria dots (Clustered heavily in blue and red zones, scarce in green)
      function drawBacteriaCluster(bx, by, count, col) {
        for (var k = 0; k < count; k++) {
          var rx = bx + (Math.sin(k * 7) * 22);
          var ry = by + (Math.cos(k * 13) * 12);
          m += '<circle cx="' + rx + '" cy="' + ry + '" r="2" fill="' + col + '"/>';
        }
      }

      // Heavy cluster in Blue (400-450 nm)
      drawBacteriaCluster(specStartX + 22, cy, 35, "#38bdf8");
      // Sparse in Green (500-550 nm)
      drawBacteriaCluster(specStartX + 115, cy, 5, "#94a3b8");
      // Heavy cluster in Red (650-680 nm)
      drawBacteriaCluster(specStartX + 245, cy, 40, "#f87171");

      m += '<text x="' + (specStartX + 22) + '" y="' + (cy - 16) + '" fill="#38bdf8" font-size="9.5" font-weight="bold">Dense Bacteria</text>';
      m += '<text x="' + (specStartX + 115) + '" y="' + (cy - 16) + '" fill="#94a3b8" font-size="9.5">Few</text>';
      m += '<text x="' + (specStartX + 245) + '" y="' + (cy - 16) + '" fill="#f87171" font-size="9.5" font-weight="bold">Dense Bacteria</text>';

      m += '<text x="' + cx + '" y="' + (cy + 95) + '" fill="#fbbf24" font-size="11" text-anchor="middle">Aerobic bacteria detect highest O2 evolution in Blue & Red absorption bands!</text>';

    } else if (exp === "vanniel") {
      // Cornelius van Niel sulfur bacteria discovery
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">CORNELIUS VAN NIEL: OXYGEN ORIGINATES FROM WATER (NOT CO2)</text>';

      // Split box: Green Plant vs Purple Sulfur Bacteria
      m += '<rect x="' + (cx - 150) + '" y="' + (cy - 60) + '" width="140" height="135" rx="8" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy - 35) + '" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">GREEN PLANTS</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy - 10) + '" fill="#cbd5e1" font-size="10" text-anchor="middle">Hydrogen Donor: H2O</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy + 15) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">2H2O -> 4H+ + O2</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy + 40) + '" fill="#86efac" font-size="10" text-anchor="middle">Byproduct: OXYGEN (O2)</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy + 58) + '" fill="#94a3b8" font-size="9" text-anchor="middle">(Confirmed via 18O isotope)</text>';

      m += '<rect x="' + (cx + 10) + '" y="' + (cy - 60) + '" width="140" height="135" rx="8" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" stroke-width="2"/>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy - 35) + '" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">SULFUR BACTERIA</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy - 10) + '" fill="#cbd5e1" font-size="10" text-anchor="middle">Hydrogen Donor: H2S</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy + 15) + '" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">2H2S -> 4H+ + 2S</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy + 40) + '" fill="#fcd34d" font-size="10" text-anchor="middle">Byproduct: SULFUR (S)</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy + 58) + '" fill="#ef4444" font-size="9" text-anchor="middle">ZERO Oxygen Released!</text>';

      m += '<text x="' + cx + '" y="' + (cy + 100) + '" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">General Rule: 2H2A + CO2 -> 2A + CH2O + H2O</text>';
    }

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">SCIENTIFIC KEY</text>';

    if (exp === "priestley_dead" || exp === "priestley_mint") {
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#fcd34d" font-size="11" font-weight="bold">Joseph Priestley</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#cbd5e1" font-size="10">• Year: 1770 - 1774</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 90) + '" fill="#cbd5e1" font-size="10">• Discovered Oxygen</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 105) + '" fill="#cbd5e1" font-size="10">  in 1774</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 130) + '" fill="#86efac" font-size="10" font-weight="bold">• Essential Rule:</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 150) + '" fill="#cbd5e1" font-size="9.5">  Plants restore</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 165) + '" fill="#cbd5e1" font-size="9.5">  whatever breathing</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 180) + '" fill="#cbd5e1" font-size="9.5">  animals & candles</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 195) + '" fill="#cbd5e1" font-size="9.5">  remove from air.</text>';
    } else if (exp === "ingenhousz") {
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#10b981" font-size="11" font-weight="bold">Jan Ingenhousz</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#cbd5e1" font-size="10">• Year: 1779</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 90) + '" fill="#cbd5e1" font-size="10">• Aquatic plant: Hydrilla</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 115) + '" fill="#fcd34d" font-size="10" font-weight="bold">• Key Discoveries:</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 135) + '" fill="#cbd5e1" font-size="9.5">  - Sunlight is essential</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 155) + '" fill="#cbd5e1" font-size="9.5">  - Oxygen bubbles</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 170) + '" fill="#cbd5e1" font-size="9.5">    form ONLY on the</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 185) + '" fill="#86efac" font-size="9.5">    GREEN parts of plants.</text>';
    } else if (exp === "engelmann") {
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#38bdf8" font-size="11" font-weight="bold">T.W. Engelmann</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#cbd5e1" font-size="10">• Year: 1888</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 90) + '" fill="#cbd5e1" font-size="10">• Prism split spectrum</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 110) + '" fill="#cbd5e1" font-size="10">• Cladophora green alga</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 130) + '" fill="#cbd5e1" font-size="10">• Motile aerobic bacteria</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 155) + '" fill="#4ade80" font-size="10" font-weight="bold">• First Action Spectrum:</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 175) + '" fill="#cbd5e1" font-size="9.5">  Peaks match Chlorophyll</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 190) + '" fill="#cbd5e1" font-size="9.5">  a absorption in Blue</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 205) + '" fill="#cbd5e1" font-size="9.5">  and Red regions.</text>';
    } else if (exp === "vanniel") {
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#fbbf24" font-size="11" font-weight="bold">Cornelius van Niel</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#cbd5e1" font-size="10">• Purple & green sulfur</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 85) + '" fill="#cbd5e1" font-size="10">  bacteria research</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 110) + '" fill="#ef4444" font-size="10" font-weight="bold">• Milestone Proof:</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 130) + '" fill="#cbd5e1" font-size="9.5">  O2 comes from H2O,</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 145) + '" fill="#cbd5e1" font-size="9.5">  NOT from CO2!</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 170) + '" fill="#cbd5e1" font-size="9.5">• In sulfur bacteria,</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 185) + '" fill="#cbd5e1" font-size="9.5">  H2S yields sulfur (S),</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 200) + '" fill="#cbd5e1" font-size="9.5">  so H-donor determines</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 215) + '" fill="#86efac" font-size="9.5">  the byproduct.</text>';
    }

    svg.innerHTML = m;

    var expTitle = (exp === "priestley_dead" ? "Priestley (Closed Jar)" :
                   (exp === "priestley_mint" ? "Priestley (Mint Plant)" :
                   (exp === "ingenhousz" ? "Ingenhousz (Hydrilla)" :
                   (exp === "engelmann" ? "Engelmann (Action Spectrum)" : "van Niel (H2O Origin of O2)"))));

    var gasEvolved = (exp === "priestley_mint" || exp === "ingenhousz" || exp === "engelmann" ? "Oxygen (O2)" :
                     (exp === "vanniel" ? "Sulfur (S) in bacteria; O2 in plants" : "None (Hypoxia / CO2)"));

    readout(
      cell("Active Milestone", expTitle, "#38bdf8") +
      cell("Gas Byproduct", gasEvolved, "#10b981") +
      cell("Organism Used", exp === "engelmann" ? "Cladophora + Aerobic Bacteria" : (exp === "ingenhousz" ? "Hydrilla" : (exp === "vanniel" ? "Sulfur Bacteria" : "Mint & Mouse")), "#fcd34d") +
      cell("Scientific Contribution", exp === "vanniel" ? "O2 from H2O" : (exp === "engelmann" ? "Blue/Red Action Spectrum" : "Photosynthetic O2 Essentiality"), "#ec4899")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">NCERT 11.2 Historical Discovery Rule:</span> ' +
      (exp === "vanniel" ?
       "Cornelius van Niel correctly deduced that photosynthesis is a light-dependent reaction where hydrogen from an oxidisable compound reduces CO2. Using purple and green sulfur bacteria where H2S is oxidized to sulfur, he proved that the O2 evolved by green plants comes from H2O, not CO2 (later confirmed with 18O isotope)." :
       (exp === "engelmann" ?
        "T.W. Engelmann split light with a prism and illuminated Cladophora alga; aerobic bacteria accumulated predominantly in blue and red light, describing the first action spectrum of photosynthesis, which closely matches chlorophyll a & b absorption." :
        (exp === "ingenhousz" ?
         "Jan Ingenhousz proved that sunlight is essential for plants to purify air; in water, submerged Hydrilla plants release oxygen bubbles from their green parts only when illuminated." :
         "Joseph Priestley demonstrated that a burning candle or mouse fouls the air in a closed bell jar, but a mint plant restores the air, allowing both mouse and candle to survive.")))
    );
  }

  return { mount: mount, setExp: setExp, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Pigments, Chromatography & Spectra (pigmentspectrasim)
// -------------------------------------------------------------------------
window.SIMS.pigmentspectrasim = (function(){
  var viewMode = "chromatogram"; // "chromatogram", "absorption", "overlay", "etiolation"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Chlorophyll a (Bright/Blue-Green)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#84cc16;"></span><span>Chlorophyll b (Yellow-Green)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#eab308;"></span><span>Xanthophylls (Yellow)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f97316;"></span><span>Carotenoids (Yellow-Orange)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.pigmentspectrasim.setView(\'chromatogram\')">1. Paper Chromatogram Strip</button>' +
      '<button class="preset-btn" onclick="SIMS.pigmentspectrasim.setView(\'absorption\')">2. Absorption Spectra (Chl a, b, Car)</button>' +
      '<button class="preset-btn" onclick="SIMS.pigmentspectrasim.setView(\'overlay\')">3. Action Spectrum vs Chl a Overlay</button>' +
      '<button class="preset-btn" onclick="SIMS.pigmentspectrasim.setView(\'etiolation\')">4. Dark Etiolation (Carotenoid Unmasking)</button>';
  }

  function setView(v){
    viewMode = v;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">PHOTOSYNTHETIC PIGMENTS: CHROMATOGRAPHY, SPECTRA & PHOTOPROTECTION</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    if (viewMode === "chromatogram") {
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">PAPER CHROMATOGRAPHY OF LEAF EXTRACT (SPINACH)</text>';

      // Chromatography jar
      m += '<rect x="' + (cx - 100) + '" y="' + (cy - 70) + '" width="200" height="180" rx="8" fill="rgba(30,41,59,0.5)" stroke="#64748b" stroke-width="2.5"/>';
      m += '<rect x="' + (cx - 90) + '" y="' + (cy + 90) + '" width="180" height="15" fill="rgba(56,189,248,0.2)"/>';
      m += '<text x="' + (cx - 85) + '" y="' + (cy + 102) + '" fill="#7dd3fc" font-size="9">Solvent front (Petroleum ether + Acetone)</text>';

      // Chromatography paper strip
      m += '<rect x="' + (cx - 25) + '" y="' + (cy - 60) + '" width="50" height="160" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>';
      // Loading line
      m += '<line x1="' + (cx - 25) + '" y1="' + (cy + 75) + '" x2="' + (cx + 25) + '" y2="' + (cy + 75) + '" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2"/>';
      m += '<text x="' + (cx - 30) + '" y="' + (cy + 78) + '" fill="#94a3b8" font-size="8.5" text-anchor="end">Origin</text>';

      // 4 Pigment Bands on strip
      // 1. Carotenes (Top, highest Rf, yellow-orange)
      m += '<rect x="' + (cx - 23) + '" y="' + (cy - 45) + '" width="46" height="8" rx="2" fill="#f97316"/>';
      m += '<line x1="' + (cx + 25) + '" y1="' + (cy - 41) + '" x2="' + (cx + 70) + '" y2="' + (cy - 41) + '" stroke="#f97316" stroke-width="1.5"/>';
      m += '<text x="' + (cx + 75) + '" y="' + (cy - 37) + '" fill="#f97316" font-size="11" font-weight="bold">Carotenoids (Yellow-Orange)</text>';

      // 2. Xanthophyll (Yellow)
      m += '<rect x="' + (cx - 23) + '" y="' + (cy - 15) + '" width="46" height="8" rx="2" fill="#eab308"/>';
      m += '<line x1="' + (cx + 25) + '" y1="' + (cy - 11) + '" x2="' + (cx + 70) + '" y2="' + (cy - 11) + '" stroke="#eab308" stroke-width="1.5"/>';
      m += '<text x="' + (cx + 75) + '" y="' + (cy - 7) + '" fill="#eab308" font-size="11" font-weight="bold">Xanthophylls (Yellow)</text>';

      // 3. Chlorophyll a (Bright or blue-green)
      m += '<rect x="' + (cx - 23) + '" y="' + (cy + 15) + '" width="46" height="10" rx="2" fill="#10b981"/>';
      m += '<line x1="' + (cx + 25) + '" y1="' + (cy + 20) + '" x2="' + (cx + 70) + '" y2="' + (cy + 20) + '" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="' + (cx + 75) + '" y="' + (cy + 24) + '" fill="#10b981" font-size="11" font-weight="bold">Chlorophyll a (Bright / Blue-Green) [CHIEF]</text>';

      // 4. Chlorophyll b (Yellow-green)
      m += '<rect x="' + (cx - 23) + '" y="' + (cy + 45) + '" width="46" height="10" rx="2" fill="#84cc16"/>';
      m += '<line x1="' + (cx + 25) + '" y1="' + (cy + 50) + '" x2="' + (cx + 70) + '" y2="' + (cy + 50) + '" stroke="#84cc16" stroke-width="1.5"/>';
      m += '<text x="' + (cx + 75) + '" y="' + (cy + 54) + '" fill="#84cc16" font-size="11" font-weight="bold">Chlorophyll b (Yellow-Green)</text>';

    } else if (viewMode === "absorption" || viewMode === "overlay") {
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="' + (viewMode === "overlay" ? "#fbbf24" : "#38bdf8") + '" font-size="14" font-weight="bold" text-anchor="middle">' +
           (viewMode === "overlay" ? "ACTION SPECTRUM OF PHOTOSYNTHESIS OVERLAYING CHL a ABSORPTION" : "ABSORPTION SPECTRA: CHL a, CHL b & CAROTENOIDS") + '</text>';

      // Coordinate axes
      var ox = cx - 140, oy = cy + 60;
      m += '<line x1="' + ox + '" y1="' + oy + '" x2="' + (ox + 290) + '" y2="' + oy + '" stroke="#94a3b8" stroke-width="2"/>';
      m += '<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + (oy - 150) + '" stroke="#94a3b8" stroke-width="2"/>';
      m += '<text x="' + (ox + 140) + '" y="' + (oy + 32) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Wavelength of light in nanometres (nm)</text>';
      m += '<text x="' + (ox - 10) + '" y="' + (oy - 75) + '" fill="#cbd5e1" font-size="10" text-anchor="middle" transform="rotate(-90 ' + (ox - 10) + ' ' + (oy - 75) + ')">Relative Absorption / Rate</text>';

      // Wavelength ticks: 400 (blue), 500 (green), 600 (orange), 700 (red)
      var ticks = [
        { nm: 400, x: ox }, { nm: 450, x: ox + 48 }, { nm: 500, x: ox + 96 },
        { nm: 550, x: ox + 144 }, { nm: 600, x: ox + 192 }, { nm: 650, x: ox + 240 }, { nm: 700, x: ox + 288 }
      ];
      for (var t = 0; t < ticks.length; t++) {
        m += '<line x1="' + ticks[t].x + '" y1="' + oy + '" x2="' + ticks[t].x + '" y2="' + (oy + 5) + '" stroke="#94a3b8" stroke-width="1.5"/>';
        m += '<text x="' + ticks[t].x + '" y="' + (oy + 18) + '" fill="#94a3b8" font-size="9" text-anchor="middle">' + ticks[t].nm + '</text>';
      }

      // Chlorophyll a curve (Peak at 430 nm blue, dip in green 550 nm, second peak at 660 nm red)
      var chlAD = 'M ' + ox + ' ' + (oy - 20) +
                  ' Q ' + (ox + 30) + ' ' + (oy - 145) + ' ' + (ox + 48) + ' ' + (oy - 80) +
                  ' Q ' + (ox + 120) + ' ' + (oy - 10) + ' ' + (ox + 180) + ' ' + (oy - 15) +
                  ' Q ' + (ox + 250) + ' ' + (oy - 110) + ' ' + (ox + 288) + ' ' + (oy - 10);
      m += '<path d="' + chlAD + '" fill="none" stroke="#10b981" stroke-width="3"/>';
      m += '<text x="' + (ox + 45) + '" y="' + (oy - 130) + '" fill="#10b981" font-size="10" font-weight="bold">Chl a (Blue Peak)</text>';
      m += '<text x="' + (ox + 250) + '" y="' + (oy - 115) + '" fill="#10b981" font-size="10" font-weight="bold">Chl a (Red Peak)</text>';

      if (viewMode === "absorption") {
        // Chlorophyll b curve (Peak at 455 nm, secondary peak at 640 nm)
        var chlBD = 'M ' + ox + ' ' + (oy - 10) +
                    ' Q ' + (ox + 55) + ' ' + (oy - 135) + ' ' + (ox + 80) + ' ' + (oy - 40) +
                    ' Q ' + (ox + 140) + ' ' + (oy - 10) + ' ' + (ox + 210) + ' ' + (oy - 30) +
                    ' Q ' + (ox + 235) + ' ' + (oy - 95) + ' ' + (ox + 288) + ' ' + (oy - 5);
        m += '<path d="' + chlBD + '" fill="none" stroke="#84cc16" stroke-width="2.5" stroke-dasharray="4,2"/>';
        m += '<text x="' + (ox + 85) + '" y="' + (oy - 95) + '" fill="#84cc16" font-size="10">Chl b</text>';

        // Carotenoids curve (Absorbs blue-green 440-490 nm, zero in red)
        var carD = 'M ' + ox + ' ' + (oy - 5) +
                   ' Q ' + (ox + 40) + ' ' + (oy - 85) + ' ' + (ox + 70) + ' ' + (oy - 90) +
                   ' Q ' + (ox + 95) + ' ' + (oy - 75) + ' ' + (ox + 120) + ' ' + oy +
                   ' L ' + (ox + 288) + ' ' + oy;
        m += '<path d="' + carD + '" fill="none" stroke="#f97316" stroke-width="2"/>';
        m += '<text x="' + (ox + 95) + '" y="' + (oy - 80) + '" fill="#f97316" font-size="10">Carotenoids</text>';
      } else if (viewMode === "overlay") {
        // Photosynthetic action spectrum (rate of O2 release)
        var actD = 'M ' + ox + ' ' + (oy - 15) +
                   ' Q ' + (ox + 40) + ' ' + (oy - 155) + ' ' + (ox + 70) + ' ' + (oy - 60) +
                   ' Q ' + (ox + 140) + ' ' + (oy - 25) + ' ' + (ox + 200) + ' ' + (oy - 35) +
                   ' Q ' + (ox + 250) + ' ' + (oy - 130) + ' ' + (ox + 288) + ' ' + (oy - 15);
        m += '<path d="' + actD + '" fill="none" stroke="#fbbf24" stroke-width="3.5" stroke-dasharray="6,3"/>';
        m += '<text x="' + (ox + 140) + '" y="' + (oy - 45) + '" fill="#fbbf24" font-size="11" font-weight="bold">Action Spectrum of Photosynthesis</text>';
        m += '<text x="' + cx + '" y="' + (cy + 100) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Action spectrum tracks Chl a absorption, but is broader due to accessory light harvesting!</text>';
      }

    } else if (viewMode === "etiolation") {
      // Dark kept yellow leaf vs sunny green leaf (Exercise 11.6)
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">EXERCISE 11.6: DARK-INDUCED CHLOROSIS & CAROTENOID STABILITY</text>';

      // Normal leaf in light
      m += '<ellipse cx="' + (cx - 80) + '" cy="' + cy + '" rx="55" ry="85" fill="#15803d" stroke="#16a34a" stroke-width="2.5"/>';
      m += '<line x1="' + (cx - 80) + '" y1="' + (cy + 85) + '" x2="' + (cx - 80) + '" y2="' + (cy - 75) + '" stroke="#4ade80" stroke-width="2.5"/>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy + 105) + '" fill="#86efac" font-size="12" font-weight="bold" text-anchor="middle">Light Grown: Green</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy - 10) + '" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Active Chl a & b</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy + 8) + '" fill="#dcfce7" font-size="9.5" text-anchor="middle">biosynthesis</text>';

      // Etiolated leaf kept in dark
      m += '<ellipse cx="' + (cx + 80) + '" cy="' + cy + '" rx="55" ry="85" fill="#facc15" stroke="#eab308" stroke-width="2.5"/>';
      m += '<line x1="' + (cx + 80) + '" y1="' + (cy + 85) + '" x2="' + (cx + 80) + '" y2="' + (cy - 75) + '" stroke="#ca8a04" stroke-width="2.5"/>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy + 105) + '" fill="#fef08a" font-size="12" font-weight="bold" text-anchor="middle">Dark Kept: Yellow (Etiolated)</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy - 15) + '" fill="#000" font-size="11" font-weight="bold" text-anchor="middle">Chlorophyll degraded</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy + 5) + '" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">STABLE CAROTENOIDS</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy + 20) + '" fill="#78350f" font-size="9.5" text-anchor="middle">remain unmasked!</text>';
    }

    // Right details panel
    var px = W - 180, py = 50;
    m += '<rect x="' + px + '" y="' + py + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (px + 85) + '" y="' + (py + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">PIGMENT METRICS</text>';

    m += '<text x="' + (px + 10) + '" y="' + (py + 50) + '" fill="#10b981" font-size="11" font-weight="bold">Chlorophyll a:</text>';
    m += '<text x="' + (px + 10) + '" y="' + (ry + 70) + '" fill="#86efac" font-size="10">• Bright / Blue-Green</text>';
    m += '<text x="' + (px + 10) + '" y="' + (ry + 88) + '" fill="#cbd5e1" font-size="10">• Reaction center core</text>';
    m += '<text x="' + (px + 10) + '" y="' + (ry + 106) + '" fill="#cbd5e1" font-size="10">• Peaks: 430 & 660 nm</text>';

    m += '<text x="' + (px + 10) + '" y="' + (ry + 135) + '" fill="#84cc16" font-size="11" font-weight="bold">Accessory Pigments:</text>';
    m += '<text x="' + (px + 10) + '" y="' + (ry + 155) + '" fill="#cbd5e1" font-size="9.5">• Chl b: Yellow-Green</text>';
    m += '<text x="' + (px + 10) + '" y="' + (ry + 172) + '" fill="#cbd5e1" font-size="9.5">• Xanthophylls: Yellow</text>';
    m += '<text x="' + (px + 10) + '" y="' + (ry + 190) + '" fill="#cbd5e1" font-size="9.5">• Carotenoids: Orange</text>';

    m += '<text x="' + (px + 10) + '" y="' + (ry + 220) + '" fill="#fcd34d" font-size="11" font-weight="bold">Dual Biological Role:</text>';
    m += '<text x="' + (px + 10) + '" y="' + (ry + 240) + '" fill="#cbd5e1" font-size="9.5">1. Broaden light harvest</text>';
    m += '<text x="' + (px + 10) + '" y="' + (ry + 258) + '" fill="#cbd5e1" font-size="9.5">2. Prevent photo-</text>';
    m += '<text x="' + (px + 10) + '" y="' + (ry + 272) + '" fill="#ef4444" font-size="9.5">   oxidation (solarization)</text>';

    svg.innerHTML = m;

    readout(
      cell("View Mode", viewMode.toUpperCase(), "#38bdf8") +
      cell("Reaction Center", "Chlorophyll a exclusively", "#10b981") +
      cell("Dominant Absorption", "Blue (430 nm) & Red (660 nm)", "#fcd34d") +
      cell("Pigment Stability", "Carotenoids > Chlorophyll", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 11.4 Pigment & Spectrum Rule:</span> ' +
      (viewMode === "etiolation" ?
       "Chlorophyll synthesis requires light; when leaves are deprived of light, chlorophyll degrades rapidly, unmasking the more stable yellow-orange carotenoids and xanthophylls (etiolation)." :
       (viewMode === "overlay" ?
        "The action spectrum of photosynthesis shows two major peaks in the blue and red wavelengths, matching the absorption peaks of chlorophyll a, but with wider shoulders because accessory pigments absorb other wavelengths and funnel energy to Chl a." :
        "Paper chromatography resolves leaf pigments into four distinct fractions: chlorophyll a (bright/blue-green), chlorophyll b (yellow-green), xanthophylls (yellow), and carotenoids (yellow-orange)."))
    );
  }

  return { mount: mount, setView: setView, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Z-Scheme & Photolysis (zschemetransportsim)
// -------------------------------------------------------------------------
window.SIMS.zschemetransportsim = (function(){
  var mode = "noncyclic"; // "noncyclic", "photolysis", "cyclic", "farred"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>PS II (P680)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>PS I (P700)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Photolysis of Water (OEC)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>ATP & NADPH Yield</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.zschemetransportsim.setMode(\'noncyclic\')">1. Non-Cyclic Z-Scheme (PS II + PS I)</button>' +
      '<button class="preset-btn" onclick="SIMS.zschemetransportsim.setMode(\'photolysis\')">2. Water Splitting (OEC & Mn2+)</button>' +
      '<button class="preset-btn" onclick="SIMS.zschemetransportsim.setMode(\'cyclic\')">3. Cyclic Photophosphorylation (PS I Only)</button>' +
      '<button class="preset-btn" onclick="SIMS.zschemetransportsim.setMode(\'farred\')">4. Monochromatic 710 nm Far-Red Light</button>';
  }

  function setMode(m){
    mode = m;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Z-SCHEME: NON-CYCLIC vs CYCLIC PHOTOPHOSPHORYLATION</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    // Redox potential scale on left (-0.8 V at top, +0.8 V at bottom)
    m += '<line x1="45" y1="60" x2="45" y2="330" stroke="#475569" stroke-width="2"/>';
    m += '<text x="40" y="70" fill="#f87171" font-size="10" text-anchor="end">-0.8 V (Reducing)</text>';
    m += '<text x="40" y="200" fill="#cbd5e1" font-size="10" text-anchor="end">0.0 V</text>';
    m += '<text x="40" y="325" fill="#86efac" font-size="10" text-anchor="end">+0.8 V (Oxidising)</text>';
    m += '<text x="25" y="195" fill="#94a3b8" font-size="9" text-anchor="middle" transform="rotate(-90 25 195)">Redox Potential (Volts)</text>';

    if (mode === "noncyclic" || mode === "photolysis") {
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">' +
           (mode === "photolysis" ? "OXYGEN EVOLVING COMPLEX (OEC): WATER PHOTOLYSIS AT PS II" : "NON-CYCLIC ELECTRON TRANSPORT: THE COMPLETE Z-SCHEME") + '</text>';

      // PS II (P680) ground state
      var ps2X = cx - 110, ps2Y = cy + 50;
      m += '<rect x="' + (ps2X - 25) + '" y="' + (ps2Y - 20) + '" width="50" height="40" rx="8" fill="#ec4899" stroke="#fff" stroke-width="2"/>';
      m += '<text x="' + ps2X + '" y="' + (ps2Y + 5) + '" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">PS II</text>';
      m += '<text x="' + ps2X + '" y="' + (ps2Y + 30) + '" fill="#fbcfe8" font-size="9" text-anchor="middle">P680</text>';

      // Light hitting PS II
      m += '<line x1="' + (ps2X - 45) + '" y1="' + (ps2Y - 50) + '" x2="' + (ps2X - 15) + '" y2="' + (ps2Y - 15) + '" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="3,2"/>';
      m += '<text x="' + (ps2X - 45) + '" y="' + (ps2Y - 55) + '" fill="#fbbf24" font-size="10">Light (680nm)</text>';

      // Water splitting at PS II base
      m += '<rect x="' + (ps2X - 45) + '" y="' + (ps2Y + 45) + '" width="90" height="35" rx="6" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="' + ps2X + '" y="' + (ps2Y + 60) + '" fill="#86efac" font-size="10" font-weight="bold" text-anchor="middle">2H2O -> 4H+ + O2 + 4e-</text>';
      m += '<text x="' + ps2X + '" y="' + (ps2Y + 74) + '" fill="#cbd5e1" font-size="8.5" text-anchor="middle">OEC (Mn2+, Cl-, Ca2+)</text>';
      m += '<line x1="' + ps2X + '" y1="' + (ps2Y + 45) + '" x2="' + ps2X + '" y2="' + (ps2Y + 20) + '" stroke="#10b981" stroke-width="2"/>';

      // Uphill excitation to PS II Acceptor (Pheophytin)
      var acc2X = ps2X, acc2Y = cy - 70;
      m += '<line x1="' + ps2X + '" y1="' + (ps2Y - 20) + '" x2="' + acc2X + '" y2="' + acc2Y + '" stroke="#ec4899" stroke-width="3" stroke-dasharray="4,2"/>';
      m += '<circle cx="' + acc2X + '" cy="' + acc2Y + '" r="16" fill="#be185d" stroke="#fff" stroke-width="1.5"/>';
      m += '<text x="' + acc2X + '" y="' + (acc2Y + 4) + '" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">Acc</text>';
      m += '<text x="' + acc2X + '" y="' + (acc2Y - 20) + '" fill="#f472b6" font-size="9.5" text-anchor="middle">e- excited</text>';

      // Downhill Electron Transport Chain: PQ -> Cyt b6f -> PC
      var etcX = cx - 10, etcY = cy - 10;
      m += '<line x1="' + acc2X + '" y1="' + acc2Y + '" x2="' + etcX + '" y2="' + etcY + '" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<rect x="' + (etcX - 25) + '" y="' + (etcY - 15) + '" width="50" height="30" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="' + etcX + '" y="' + (etcY + 4) + '" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Cyt b6f</text>';
      m += '<text x="' + etcX + '" y="' + (etcY + 30) + '" fill="#fbbf24" font-size="9.5" font-weight="bold" text-anchor="middle">ADP + Pi -> ATP</text>';

      // PS I (P700)
      var ps1X = cx + 80, ps1Y = cy + 50;
      m += '<line x1="' + etcX + '" y1="' + etcY + '" x2="' + ps1X + '" y2="' + (ps1Y - 20) + '" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<rect x="' + (ps1X - 25) + '" y="' + (ps1Y - 20) + '" width="50" height="40" rx="8" fill="#0284c7" stroke="#fff" stroke-width="2"/>';
      m += '<text x="' + ps1X + '" y="' + (ps1Y + 5) + '" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">PS I</text>';
      m += '<text x="' + ps1X + '" y="' + (ps1Y + 30) + '" fill="#bae6fd" font-size="9" text-anchor="middle">P700</text>';

      // Light hitting PS I
      m += '<line x1="' + (ps1X - 45) + '" y1="' + (ps1Y - 50) + '" x2="' + (ps1X - 15) + '" y2="' + (ps1Y - 15) + '" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="3,2"/>';
      m += '<text x="' + (ps1X - 45) + '" y="' + (ps1Y - 55) + '" fill="#fbbf24" font-size="10">Light (700nm)</text>';

      // Uphill excitation to PS I Acceptor (Ferredoxin)
      var acc1X = ps1X, acc1Y = cy - 70;
      m += '<line x1="' + ps1X + '" y1="' + (ps1Y - 20) + '" x2="' + acc1X + '" y2="' + acc1Y + '" stroke="#0284c7" stroke-width="3" stroke-dasharray="4,2"/>';
      m += '<circle cx="' + acc1X + '" cy="' + acc1Y + '" r="16" fill="#0369a1" stroke="#fff" stroke-width="1.5"/>';
      m += '<text x="' + acc1X + '" y="' + (acc1Y + 4) + '" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">Fd</text>';

      // Downhill to NADP+ reductase (FNR)
      var fnrX = ps1X + 60, fnrY = cy - 20;
      m += '<line x1="' + acc1X + '" y1="' + acc1Y + '" x2="' + fnrX + '" y2="' + fnrY + '" stroke="#10b981" stroke-width="2.5"/>';
      m += '<rect x="' + (fnrX - 10) + '" y="' + (fnrY - 15) + '" width="65" height="30" rx="6" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="' + (fnrX + 22) + '" y="' + (fnrY + 4) + '" fill="#86efac" font-size="9.5" font-weight="bold" text-anchor="middle">NADPH</text>';

    } else if (mode === "cyclic" || mode === "farred") {
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">' +
           (mode === "farred" ? "MONOCHROMATIC 710 nm FAR-RED: CYCLIC PHOTOPHOSPHORYLATION ONLY" : "CYCLIC PHOTOPHOSPHORYLATION (STROMA LAMELLAE)") + '</text>';

      // PS I (P700) alone
      var ps1cX = cx, ps1cY = cy + 40;
      m += '<rect x="' + (ps1cX - 30) + '" y="' + (ps1cY - 20) + '" width="60" height="40" rx="8" fill="#0284c7" stroke="#fff" stroke-width="2"/>';
      m += '<text x="' + ps1cX + '" y="' + (ps1cY + 5) + '" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">PS I (P700)</text>';

      // Light hitting PS I (>680 nm)
      m += '<line x1="' + (ps1cX - 50) + '" y1="' + (ps1cY - 50) + '" x2="' + (ps1cX - 20) + '" y2="' + (ps1cY - 15) + '" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="3,2"/>';
      m += '<text x="' + (ps1cX - 50) + '" y="' + (ps1cY - 55) + '" fill="#fbbf24" font-size="10">Light (&gt;680nm)</text>';

      // Ejection uphill to Primary Acceptor
      var topY = cy - 70;
      m += '<line x1="' + ps1cX + '" y1="' + (ps1cY - 20) + '" x2="' + ps1cX + '" y2="' + topY + '" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4,2"/>';
      m += '<circle cx="' + ps1cX + '" cy="' + topY + '" r="16" fill="#0369a1" stroke="#fff" stroke-width="1.5"/>';
      m += '<text x="' + ps1cX + '" y="' + (topY + 4) + '" fill="#fff" font-size="9.5" font-weight="bold" text-anchor="middle">Acc</text>';

      // Circular loop back via Cyt b6f
      m += '<path d="M ' + (ps1cX + 16) + ' ' + topY + ' Q ' + (ps1cX + 90) + ' ' + (cy - 10) + ' ' + (ps1cX + 40) + ' ' + (cy + 20) +
           ' L ' + (ps1cX + 30) + ' ' + (ps1cY - 5) + '" fill="none" stroke="#fbbf24" stroke-width="3"/>';

      // Intermediate carrier Cytochrome b6f on loop
      m += '<rect x="' + (ps1cX + 55) + '" y="' + (cy - 25) + '" width="55" height="30" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>';
      m += '<text x="' + (ps1cX + 82) + '" y="' + (cy - 6) + '" fill="#fbbf24" font-size="9.5" font-weight="bold" text-anchor="middle">Cyt b6f</text>';
      m += '<text x="' + (ps1cX + 82) + '" y="' + (cy + 25) + '" fill="#10b981" font-size="10" font-weight="bold" text-anchor="middle">+ ATP</text>';

      m += '<text x="' + cx + '" y="' + (cy + 95) + '" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">NO PS II • NO Photolysis • NO Oxygen Evolution • NO NADPH</text>';
      m += '<text x="' + cx + '" y="' + (cy + 115) + '" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Synthesizes auxiliary ATP exclusively to satisfy high Calvin cycle consumption.</text>';
    }

    // Right comparison panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Z-SCHEME RULES</text>';

    if (mode === "noncyclic" || mode === "photolysis") {
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#10b981" font-size="11" font-weight="bold">Non-Cyclic (Z-Scheme):</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#cbd5e1" font-size="10">• Both PS II & PS I</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 90) + '" fill="#cbd5e1" font-size="10">• Water photolysis active</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 110) + '" fill="#86efac" font-size="10" font-weight="bold">• O2 evolved to air</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 130) + '" fill="#cbd5e1" font-size="10">• Generates:</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 148) + '" fill="#fcd34d" font-size="10">  - ATP</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 165) + '" fill="#fcd34d" font-size="10">  - NADPH + H+</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 190) + '" fill="#cbd5e1" font-size="10">• Location: Grana</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 205) + '" fill="#cbd5e1" font-size="10">  thylakoid membranes</text>';
    } else {
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#fbbf24" font-size="11" font-weight="bold">Cyclic Flow:</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#cbd5e1" font-size="10">• PS I (P700) ONLY</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 90) + '" fill="#ef4444" font-size="10" font-weight="bold">• NO Photolysis of H2O</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 110) + '" fill="#ef4444" font-size="10" font-weight="bold">• ZERO O2 evolved</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 130) + '" fill="#ef4444" font-size="10" font-weight="bold">• NO NADPH formed</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 155) + '" fill="#86efac" font-size="10" font-weight="bold">• Yield: ATP ONLY</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 180) + '" fill="#cbd5e1" font-size="10">• Location: Stroma</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 195) + '" fill="#cbd5e1" font-size="10">  lamellae (lacks PS II</text>';
      m += '<text x="' + (rx + 10) + '" y="' + (ry + 210) + '" fill="#cbd5e1" font-size="10">  and NADP reductase)</text>';
    }

    svg.innerHTML = m;

    var isCyclic = (mode === "cyclic" || mode === "farred");
    readout(
      cell("Electron Flow Mode", isCyclic ? "CYCLIC FLOW" : "NON-CYCLIC (Z-SCHEME)", isCyclic ? "#fbbf24" : "#38bdf8") +
      cell("Water Photolysis", isCyclic ? "ABSENT" : "ACTIVE (2H2O -> 4H+ + O2)", isCyclic ? "#ef4444" : "#10b981") +
      cell("Oxygen Evolution", isCyclic ? "NO (Zero O2)" : "YES (Molecular O2 released)", isCyclic ? "#ef4444" : "#10b981") +
      cell("Chemical Products", isCyclic ? "ATP ONLY" : "ATP + NADPH + O2", "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 11.6 Photophosphorylation Rule:</span> ' +
      (isCyclic ?
       "In cyclic photophosphorylation, excited electrons from PS I cycle back via Cyt b6f without splitting water or evolving oxygen; this occurs in stroma lamellae (which lack PS II and NADP reductase) or under wavelengths >680 nm to supply extra ATP." :
       "In the non-cyclic Z-scheme, both PS II and PS I work in series: water photolysis at PS II provides electrons and evolves oxygen, while electron downhill transfer generates ATP and terminal reduction forms NADPH.")
    );
  }

  return { mount: mount, setMode: setMode, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Mitchell Chemiosmosis & ATP Synthase (chemiosmosissim)
// -------------------------------------------------------------------------
window.SIMS.chemiosmosissim = (function(){
  var uncoupler = false;
  var lightOn = true;

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Acidic Lumen (High H+, pH ~4.5)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Alkaline Stroma (Low H+, pH ~8.0)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>CF0 Transmembrane Channel</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>CF1 Catalytic ATP Synthase Head</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.chemiosmosissim.setCond(true, false)">1. Normal Proton Gradient & ATP Synthesis</button>' +
      '<button class="preset-btn" onclick="SIMS.chemiosmosissim.setCond(true, true)">2. Add Uncoupler / DNP (Gradient Dissipated)</button>' +
      '<button class="preset-btn" onclick="SIMS.chemiosmosissim.setCond(false, false)">3. Darkness (No Gradient)</button>';
  }

  function setCond(l, u){
    lightOn = l;
    uncoupler = u;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">CHEMIOSMOTIC HYPOTHESIS: THYLAKOID PROTON GRADIENT & CF0-CF1 MOTOR</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    // Stroma (top) vs Lumen (bottom)
    m += '<rect x="40" y="50" width="' + (W - 240) + '" height="110" fill="rgba(56,189,248,0.08)"/>';
    m += '<text x="60" y="75" fill="#38bdf8" font-size="12" font-weight="bold">STROMA (Alkaline, pH ~8.0, Low [H+])</text>';

    // Thylakoid lipid bilayer membrane
    m += '<rect x="40" y="160" width="' + (W - 240) + '" height="35" fill="#334155" stroke="#64748b" stroke-width="2"/>';
    m += '<text x="60" y="182" fill="#cbd5e1" font-size="10">Thylakoid Membrane Bilayer</text>';

    // Thylakoid Lumen (bottom)
    m += '<rect x="40" y="195" width="' + (W - 240) + '" height="135" fill="' + (uncoupler ? 'rgba(56,189,248,0.08)' : (lightOn ? 'rgba(239,68,68,0.18)' : 'rgba(56,189,248,0.08)')) + '"/>';
    m += '<text x="60" y="220" fill="' + (uncoupler || !lightOn ? '#94a3b8' : '#ef4444') + '" font-size="12" font-weight="bold">' +
         (uncoupler ? "THYLAKOID LUMEN (Gradient Leaked via Uncoupler!)" : (lightOn ? "THYLAKOID LUMEN (Acidic, pH ~4.5, High [H+])" : "THYLAKOID LUMEN (Darkness: Neutralized)")) + '</text>';

    // 1. Water splitting releasing H+ into lumen
    var oecX = cx - 120;
    m += '<rect x="' + (oecX - 25) + '" y="160" width="50" height="35" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';
    m += '<text x="' + oecX + '" y="182" fill="#86efac" font-size="10" font-weight="bold" text-anchor="middle">PS II</text>';
    if (lightOn && !uncoupler) {
      m += '<text x="' + oecX + '" y="240" fill="#f87171" font-size="11" font-weight="bold" text-anchor="middle">4H+ from H2O</text>';
      m += '<line x1="' + oecX + '" y1="195" x2="' + oecX + '" y2="225" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow)"/>';
    }

    // 2. Plastoquinone shuttle pumping H+ from stroma to lumen
    var pqX = cx - 30;
    m += '<circle cx="' + pqX + '" cy="177" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
    m += '<text x="' + pqX + '" y="181" fill="#38bdf8" font-size="9.5" font-weight="bold" text-anchor="middle">PQ</text>';
    if (lightOn && !uncoupler) {
      m += '<path d="M ' + pqX + ' 130 L ' + pqX + ' 225" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="3,2"/>';
      m += '<text x="' + pqX + '" y="120" fill="#38bdf8" font-size="10" text-anchor="middle">H+ uptake</text>';
      m += '<text x="' + pqX + '" y="240" fill="#38bdf8" font-size="10" text-anchor="middle">H+ pumped</text>';
    }

    // 3. ATP Synthase Complex (CF0 in membrane, CF1 in stroma)
    var atpX = cx + 80;
    // CF0 Channel in membrane
    m += '<rect x="' + (atpX - 16) + '" y="160" width="32" height="35" rx="4" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>';
    m += '<text x="' + atpX + '" y="182" fill="#78350f" font-size="10" font-weight="bold" text-anchor="middle">CF0</text>';

    // CF1 Headpiece in stroma
    m += '<circle cx="' + atpX + '" cy="120" r="26" fill="#10b981" stroke="#fff" stroke-width="2"/>';
    m += '<text x="' + atpX + '" y="125" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">CF1</text>';

    // Protons flowing from lumen -> CF0 -> CF1 -> Stroma
    if (lightOn && !uncoupler) {
      m += '<line x1="' + atpX + '" y1="230" x2="' + atpX + '" y2="195" stroke="#fbbf24" stroke-width="3"/>';
      m += '<line x1="' + atpX + '" y1="160" x2="' + atpX + '" y2="146" stroke="#fbbf24" stroke-width="3"/>';
      m += '<text x="' + (atpX + 45) + '" y="115" fill="#fcd34d" font-size="11" font-weight="bold">ADP + Pi</text>';
      m += '<text x="' + (atpX + 45) + '" y="132" fill="#10b981" font-size="12" font-weight="bold">-> ATP</text>';
      m += '<text x="' + atpX + '" y="250" fill="#fbbf24" font-size="10" text-anchor="middle">H+ efflux (down gradient)</text>';
    } else if (uncoupler) {
      m += '<text x="' + (atpX + 50) + '" y="125" fill="#ef4444" font-size="11" font-weight="bold">NO ATP Synthesis!</text>';
      m += '<text x="' + cx + '" y="280" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">Uncoupler leaks protons: Gradient collapsed, ATP synthase halts!</text>';
    }

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">CHEMIOSMOSIS</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#fcd34d" font-size="11" font-weight="bold">3 Gradient Causes:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#cbd5e1" font-size="9.5">1. Water photolysis</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 85) + '" fill="#cbd5e1" font-size="9.5">   releases H+ in lumen</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 105) + '" fill="#cbd5e1" font-size="9.5">2. Plastoquinone (PQ)</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 120) + '" fill="#cbd5e1" font-size="9.5">   pumps H+ stroma->lumen</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 140) + '" fill="#cbd5e1" font-size="9.5">3. NADP+ reductase</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 155) + '" fill="#cbd5e1" font-size="9.5">   consumes stromal H+</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 185) + '" fill="#10b981" font-size="11" font-weight="bold">ATP Synthase:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 205) + '" fill="#cbd5e1" font-size="9.5">• CF0: transmembrane</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 220) + '" fill="#cbd5e1" font-size="9.5">  proton channel</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 240) + '" fill="#cbd5e1" font-size="9.5">• CF1: catalytic head</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 255) + '" fill="#86efac" font-size="9.5">  faces stroma</text>';

    svg.innerHTML = m;

    var atpRate = (lightOn && !uncoupler) ? "MAXIMAL (Active Phosphorylation)" : "ZERO (Halted)";
    var lumenStatus = uncoupler ? "Dissipated (Leaky)" : (lightOn ? "Acidic (pH ~4.5)" : "Equilibrated");

    readout(
      cell("Proton Gradient", uncoupler ? "COLLAPSED" : (lightOn ? "ESTABLISHED (High PMF)" : "INACTIVE"), uncoupler ? "#ef4444" : "#10b981") +
      cell("Lumen pH Status", lumenStatus, lightOn && !uncoupler ? "#ef4444" : "#38bdf8") +
      cell("ATP Synthase Activity", atpRate, lightOn && !uncoupler ? "#10b981" : "#ef4444") +
      cell("Uncoupler State", uncoupler ? "PRESENT (DNP / Ionophore)" : "NONE (Intact Bilayer)", uncoupler ? "#ef4444" : "#10b981")
    );

    verdict(
      '<span style="color:#fcd34d;font-weight:700;">NCERT 11.6.3 Chemiosmosis Rule:</span> ' +
      (uncoupler ?
       "Uncouplers destroy the proton gradient across the thylakoid membrane, abolishing the proton motive force through CF0 and halting ATP synthesis, even while electron transport continues." :
       "Protons accumulate in the thylakoid lumen due to water splitting and plastoquinone pumping, while stromal protons are depleted by NADP+ reduction. As protons flow down this gradient through the CF0 channel into the stroma, CF1 catalytic headpiece synthesizes ATP.")
    );
  }

  return { mount: mount, setCond: setCond, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Calvin Cycle & Stoichiometry (calvincyclesim)
// -------------------------------------------------------------------------
window.SIMS.calvincyclesim = (function(){
  var stage = "all"; // "carboxylation", "reduction", "regeneration", "all", "dark"
  var co2Fixed = 6; // 1 to 6

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Stage 1: Carboxylation (RuBisCO)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Stage 2: Reduction (ATP + NADPH)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Stage 3: Regeneration (ATP -> RuBP)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>1 Hexose Glucose Output</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.calvincyclesim.setStage(\'all\')">1. Full 6-Turn Cycle (1 Glucose)</button>' +
      '<button class="preset-btn" onclick="SIMS.calvincyclesim.setStage(\'carboxylation\')">2. Stage 1: Carboxylation</button>' +
      '<button class="preset-btn" onclick="SIMS.calvincyclesim.setStage(\'reduction\')">3. Stage 2: Reduction</button>' +
      '<button class="preset-btn" onclick="SIMS.calvincyclesim.setStage(\'regeneration\')">4. Stage 3: Regeneration</button>' +
      '<button class="preset-btn" onclick="SIMS.calvincyclesim.setStage(\'dark\')">5. Sudden Darkness (3-PGA Accumulates)</button>';
  }

  function setStage(s){
    stage = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">MELVIN CALVIN C3 CYCLE: 3 STAGES & 18 ATP / 12 NADPH GLUCOSE ACCOUNTING</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 20;
    var R = 95;

    // Calvin cycle circular path
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#334155" stroke-width="4"/>';

    // 1. Top Node: RuBP (Ribulose-1,5-bisphosphate, 5C)
    var rubpX = cx, rubpY = cy - R;
    m += '<rect x="' + (rubpX - 45) + '" y="' + (rubpY - 20) + '" width="90" height="35" rx="6" fill="#4f46e5" stroke="#818cf8" stroke-width="2"/>';
    m += '<text x="' + rubpX + '" y="' + (rubpY) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">RuBP (5C)</text>';
    m += '<text x="' + rubpX + '" y="' + (rubpY + 12) + '" fill="#c7d2fe" font-size="9" text-anchor="middle">Primary Acceptor</text>';

    // CO2 entry at top-right
    m += '<line x1="' + (rubpX + 50) + '" y1="' + (rubpY - 30) + '" x2="' + (rubpX + 30) + '" y2="' + (rubpY - 5) + '" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow)"/>';
    m += '<text x="' + (rubpX + 75) + '" y="' + (rubpY - 30) + '" fill="#10b981" font-size="12" font-weight="bold">+ 6 CO2</text>';
    m += '<rect x="' + (rubpX + 45) + '" y="' + (rubpY - 10) + '" width="70" height="24" rx="4" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';
    m += '<text x="' + (rubpX + 80) + '" y="' + (rubpY + 6) + '" fill="#86efac" font-size="10" font-weight="bold" text-anchor="middle">RuBisCO</text>';

    // 2. Right Node: 3-PGA (3-Phosphoglyceric acid, 3C)
    var pgaX = cx + R * Math.cos(30 * Math.PI / 180);
    var pgaY = cy + R * Math.sin(30 * Math.PI / 180);
    m += '<rect x="' + (pgaX - 45) + '" y="' + (pgaY - 18) + '" width="90" height="35" rx="6" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
    m += '<text x="' + pgaX + '" y="' + (pgaY) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">12 x 3-PGA (3C)</text>';
    m += '<text x="' + pgaX + '" y="' + (pgaY + 12) + '" fill="#bae6fd" font-size="9" text-anchor="middle">First Stable Product</text>';

    // Reduction transition: Consumes 12 ATP + 12 NADPH
    m += '<text x="' + (cx + 105) + '" y="' + (cy + 65) + '" fill="#38bdf8" font-size="10" font-weight="bold">12 ATP -> 12 ADP</text>';
    m += '<text x="' + (cx + 105) + '" y="' + (cy + 80) + '" fill="#38bdf8" font-size="10" font-weight="bold">12 NADPH -> 12 NADP+</text>';

    // 3. Bottom Node: Triose Phosphate (G3P / DHAP, 3C)
    var triX = cx, triY = cy + R;
    m += '<rect x="' + (triX - 55) + '" y="' + (triY - 15) + '" width="110" height="35" rx="6" fill="#0f766e" stroke="#2dd4bf" stroke-width="2"/>';
    m += '<text x="' + triX + '" y="' + (triY + 2) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">12 x Triose-P (3C)</text>';
    m += '<text x="' + triX + '" y="' + (triY + 15) + '" fill="#99f6e4" font-size="8.5" text-anchor="middle">(G3P / DHAP)</text>';

    // Glucose branch out of bottom
    m += '<line x1="' + triX + '" y1="' + (triY + 20) + '" x2="' + triX + '" y2="' + (triY + 50) + '" stroke="#ec4899" stroke-width="3"/>';
    m += '<rect x="' + (triX - 55) + '" y="' + (triY + 50) + '" width="110" height="30" rx="6" fill="#be185d" stroke="#f472b6" stroke-width="2"/>';
    m += '<text x="' + triX + '" y="' + (triY + 69) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">1 GLUCOSE (6C)</text>';
    m += '<text x="' + (triX + 65) + '" y="' + (triY + 67) + '" fill="#fbcfe8" font-size="9">(Net Product)</text>';

    // 4. Regeneration transition back to RuBP: Consumes 6 ATP
    m += '<text x="' + (cx - 130) + '" y="' + cy + '" fill="#fbbf24" font-size="10" font-weight="bold">Regeneration:</text>';
    m += '<text x="' + (cx - 130) + '" y="' + (cy + 16) + '" fill="#fbbf24" font-size="10">6 ATP -> 6 ADP</text>';
    m += '<text x="' + (cx - 130) + '" y="' + (cy + 32) + '" fill="#cbd5e1" font-size="9">(1 ATP per CO2 fixed)</text>';

    // Center Stage Label
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="40" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>';
    if (stage === "dark") {
      m += '<text x="' + cx + '" y="' + (cy - 10) + '" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">DARK SHIFT</text>';
      m += '<text x="' + cx + '" y="' + (cy + 6) + '" fill="#fca5a5" font-size="9" text-anchor="middle">3-PGA Rises</text>';
      m += '<text x="' + cx + '" y="' + (cy + 20) + '" fill="#fca5a5" font-size="9" text-anchor="middle">RuBP Falls</text>';
    } else {
      m += '<text x="' + cx + '" y="' + (cy - 8) + '" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">CALVIN</text>';
      m += '<text x="' + cx + '" y="' + (cy + 8) + '" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">CYCLE</text>';
      m += '<text x="' + cx + '" y="' + (cy + 22) + '" fill="#94a3b8" font-size="9" text-anchor="middle">6 Turns</text>';
    }

    // Right details panel
    var px = W - 180, py = 50;
    m += '<rect x="' + px + '" y="' + py + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (px + 85) + '" y="' + (py + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">1 GLUCOSE BUDGET</text>';

    m += '<text x="' + (px + 10) + '" y="' + (py + 50) + '" fill="#10b981" font-size="11" font-weight="bold">INFLOW (Inputs):</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 70) + '" fill="#cbd5e1" font-size="10">• 6 CO2 molecules</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 90) + '" fill="#fcd34d" font-size="10" font-weight="bold">• 18 ATP</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 105) + '" fill="#cbd5e1" font-size="9">  (12 reduction +</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 118) + '" fill="#cbd5e1" font-size="9">   6 regeneration)</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 138) + '" fill="#38bdf8" font-size="10" font-weight="bold">• 12 NADPH</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 152) + '" fill="#cbd5e1" font-size="9">  (reduction phase)</text>';

    m += '<text x="' + (px + 10) + '" y="' + (py + 180) + '" fill="#ec4899" font-size="11" font-weight="bold">OUTFLOW (Outputs):</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 200) + '" fill="#86efac" font-size="10" font-weight="bold">• 1 Glucose (C6H12O6)</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 220) + '" fill="#cbd5e1" font-size="10">• 18 ADP + 18 Pi</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 240) + '" fill="#cbd5e1" font-size="10">• 12 NADP+</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 265) + '" fill="#fcd34d" font-size="10">• Per 1 CO2: 3 ATP,</text>';
    m += '<text x="' + (px + 10) + '" y="' + (py + 280) + '" fill="#fcd34d" font-size="10">  2 NADPH</text>';

    svg.innerHTML = m;

    readout(
      cell("Cycle Progress", stage === "dark" ? "DARK TRANSITION" : "6 CO2 FIXED (Full Hexose)", "#38bdf8") +
      cell("Total ATP Consumed", "18 ATP (12 Red + 6 Regen)", "#fbbf24") +
      cell("Total NADPH Consumed", "12 NADPH (Reduction)", "#38bdf8") +
      cell("Net Synthesis", "1 Glucose Molecule (C6H12O6)", "#10b981")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 11.7 Calvin Cycle Rule:</span> ' +
      (stage === "dark" ?
       "When light is extinguished, ATP and NADPH supply ceases immediately; 3-PGA can no longer be reduced and accumulates, while existing RuBP is rapidly consumed by reaction with CO2 until exhausted." :
       "Synthesis of one molecule of glucose requires exactly 6 turns of the Calvin cycle, demanding 6 CO2, 18 ATP (2 for reduction + 1 for regeneration per CO2), and 12 NADPH.")
    );
  }

  return { mount: mount, setStage: setStage, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: C4 Kranz Anatomy & PEPcase (c4kranzpathwaysim)
// -------------------------------------------------------------------------
window.SIMS.c4kranzpathwaysim = (function(){
  var step = "all"; // "mesophyll", "transport", "bundlesheath", "all"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Mesophyll Cell (PEPcase Carboxylation)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Bundle Sheath Cell (RuBisCO Decarboxylation)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Thick Gas-Impermeable Kranz Wall</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Zero Photorespiration</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.c4kranzpathwaysim.setStep(\'all\')">1. Complete C4 Hatch-Slack Shuttle</button>' +
      '<button class="preset-btn" onclick="SIMS.c4kranzpathwaysim.setStep(\'mesophyll\')">2. Mesophyll: PEP + CO2 -> OAA</button>' +
      '<button class="preset-btn" onclick="SIMS.c4kranzpathwaysim.setStep(\'transport\')">3. Malate Transport via Plasmodesmata</button>' +
      '<button class="preset-btn" onclick="SIMS.c4kranzpathwaysim.setStep(\'bundlesheath\')">4. Bundle Sheath: CO2 Pump & RuBisCO</button>';
  }

  function setStep(s){
    step = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">C4 HATCH-SLACK PATHWAY: MESOPHYLL vs BUNDLE SHEATH SPATIAL SEPARATION</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    // Two compartments side by side
    var mBoxX = cx - 140, mBoxW = 135;
    var bsBoxX = cx + 15, bsBoxW = 135;
    var boxY = cy - 75, boxH = 180;

    // Mesophyll Cell
    m += '<rect x="' + mBoxX + '" y="' + boxY + '" width="' + mBoxW + '" height="' + boxH + '" rx="10" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="2"/>';
    m += '<text x="' + (mBoxX + mBoxW/2) + '" y="' + (boxY + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">MESOPHYLL CELL</text>';

    // Thick suberized wall between cells (Kranz anatomy feature)
    m += '<rect x="' + (cx - 5) + '" y="' + boxY + '" width="20" height="' + boxH + '" fill="#334155" stroke="#10b981" stroke-width="2.5"/>';
    m += '<text x="' + (cx + 5) + '" y="' + (boxY + 95) + '" fill="#86efac" font-size="9" text-anchor="middle" transform="rotate(-90 ' + (cx + 5) + ' ' + (boxY + 95) + ')">Thick Kranz Wall</text>';

    // Plasmodesmata channels connecting cells
    m += '<rect x="' + (cx - 5) + '" y="' + (cy - 30) + '" width="20" height="12" fill="#0f172a"/>';
    m += '<rect x="' + (cx - 5) + '" y="' + (cy + 30) + '" width="20" height="12" fill="#0f172a"/>';
    m += '<text x="' + (cx + 5) + '" y="' + (cy - 20) + '" fill="#fbbf24" font-size="8" text-anchor="middle">Plasmodesmata</text>';

    // Bundle Sheath Cell
    m += '<rect x="' + bsBoxX + '" y="' + boxY + '" width="' + bsBoxW + '" height="' + boxH + '" rx="10" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" stroke-width="2"/>';
    m += '<text x="' + (bsBoxX + bsBoxW/2) + '" y="' + (boxY + 22) + '" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">BUNDLE SHEATH CELL</text>';

    // Mesophyll reactions
    // Atmospheric CO2 / HCO3- entry
    m += '<text x="' + (mBoxX + 10) + '" y="' + (boxY + 50) + '" fill="#cbd5e1" font-size="10">Atmospheric CO2 -> HCO3-</text>';
    m += '<rect x="' + (mBoxX + 10) + '" y="' + (boxY + 65) + '" width="115" height="32" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (mBoxX + 67) + '" y="' + (boxY + 80) + '" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">PEP (3C) -> OAA (4C)</text>';
    m += '<text x="' + (mBoxX + 67) + '" y="' + (boxY + 92) + '" fill="#86efac" font-size="9" text-anchor="middle">Enzyme: PEPcase</text>';

    // Conversion to Malic acid
    m += '<text x="' + (mBoxX + 67) + '" y="' + (boxY + 125) + '" fill="#fbbf24" font-size="10.5" font-weight="bold" text-anchor="middle">Malic Acid (4C)</text>';
    m += '<line x1="' + (mBoxX + 67) + '" y1="' + (boxY + 97) + '" x2="' + (mBoxX + 67) + '" y2="' + (boxY + 115) + '" stroke="#fbbf24" stroke-width="2"/>';

    // Malate transport through top plasmodesma to Bundle Sheath
    m += '<path d="M ' + (mBoxX + 110) + ' ' + (cy - 24) + ' L ' + (bsBoxX + 15) + ' ' + (cy - 24) + '" stroke="#fbbf24" stroke-width="2.5" marker-end="url(#arrow)"/>';

    // Bundle Sheath reactions
    // Decarboxylation of Malate -> Pyruvate (3C) + CO2
    m += '<rect x="' + (bsBoxX + 15) + '" y="' + (boxY + 50) + '" width="105" height="42" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>';
    m += '<text x="' + (bsBoxX + 67) + '" y="' + (boxY + 68) + '" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">Malate Decarboxylation</text>';
    m += '<text x="' + (bsBoxX + 67) + '" y="' + (boxY + 84) + '" fill="#86efac" font-size="9" text-anchor="middle">Releases HIGH [CO2]</text>';

    // Calvin Cycle inside Bundle Sheath
    m += '<circle cx="' + (bsBoxX + 67) + '" cy="' + (boxY + 125) + '" r="22" fill="#065f46" stroke="#10b981" stroke-width="2"/>';
    m += '<text x="' + (bsBoxX + 67) + '" y="' + (boxY + 123) + '" fill="#fff" font-size="9.5" font-weight="bold" text-anchor="middle">RuBisCO</text>';
    m += '<text x="' + (bsBoxX + 67) + '" y="' + (boxY + 135) + '" fill="#86efac" font-size="8" text-anchor="middle">Calvin Cycle</text>';

    // Pyruvate return to Mesophyll through bottom plasmodesma
    m += '<path d="M ' + (bsBoxX + 20) + ' ' + (cy + 36) + ' L ' + (mBoxX + 90) + ' ' + (cy + 36) + '" stroke="#a855f7" stroke-width="2" stroke-dasharray="3,2"/>';
    m += '<text x="' + (cx + 5) + '" y="' + (cy + 52) + '" fill="#c084fc" font-size="8.5" text-anchor="middle">Pyruvate (3C) Return</text>';
    m += '<text x="' + (mBoxX + 67) + '" y="' + (boxY + 160) + '" fill="#a855f7" font-size="9" text-anchor="middle">Regenerates PEP (-2 ATP)</text>';

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">C4 KRANZ RULES</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#38bdf8" font-size="11" font-weight="bold">Mesophyll Cell:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#cbd5e1" font-size="10">• Primary Acceptor: PEP</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 88) + '" fill="#cbd5e1" font-size="10">• Enzyme: PEPcase</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 106) + '" fill="#ef4444" font-size="9.5" font-weight="bold">• NO RuBisCO in mesophyll!</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 135) + '" fill="#f59e0b" font-size="11" font-weight="bold">Bundle Sheath Cell:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 155) + '" fill="#cbd5e1" font-size="10">• Has RuBisCO & C3</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 172) + '" fill="#cbd5e1" font-size="10">• High [CO2] saturates</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 188) + '" fill="#cbd5e1" font-size="10">  active site</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 208) + '" fill="#10b981" font-size="10" font-weight="bold">• Photorespiration ZERO!</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 235) + '" fill="#fcd34d" font-size="11" font-weight="bold">ATP Cost:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 255) + '" fill="#cbd5e1" font-size="10">• 30 ATP per Glucose</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 270) + '" fill="#cbd5e1" font-size="9.5">  (vs 18 ATP in C3)</text>';

    svg.innerHTML = m;

    readout(
      cell("Primary Carboxylase", "PEPcase (Mesophyll)", "#38bdf8") +
      cell("Calvin Site", "Bundle Sheath (RuBisCO)", "#f59e0b") +
      cell("Photorespiration", "COMPLETELY ABSENT", "#10b981") +
      cell("ATP Cost / Glucose", "30 ATP (Extra 12 for PEP regen)", "#fcd34d")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">NCERT 11.8 C4 Kranz Rule:</span> ' +
      "In C4 plants, initial carbon fixation takes place in mesophyll cells catalyzed by oxygen-insensitive PEPcase to form C4 oxaloacetate; malate is transported to bundle sheath cells where decarboxylation builds up high internal CO2 concentration, completely outcompeting oxygen at RuBisCO and abolishing photorespiration."
    );
  }

  return { mount: mount, setStep: setStep, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Blackman's Limiting Factors (blackmanlimitinglab)
// -------------------------------------------------------------------------
window.SIMS.blackmanlimitinglab = (function(){
  var lightInt = 40; // 0 to 100%
  var co2Level = 380; // 100 to 800 ppm
  var plantType = "C3"; // "C3", "C4"

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Region A: Light Limiting (Linear)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Point C: Light Saturation (~10% Sunlight)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Region D: Maximal Plateau (CO2 Limiting)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Photo-oxidation Breakdown</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.blackmanlimitinglab.setPreset(15, 380, \'C3\')">1. Region A (Light Limiting)</button>' +
      '<button class="preset-btn" onclick="SIMS.blackmanlimitinglab.setPreset(10, 380, \'C3\')">2. Point C (10% Sun Saturation)</button>' +
      '<button class="preset-btn" onclick="SIMS.blackmanlimitinglab.setPreset(70, 380, \'C3\')">3. Region D (Ambient CO2 Plateau)</button>' +
      '<button class="preset-btn" onclick="SIMS.blackmanlimitinglab.setPreset(70, 600, \'C3\')">4. Greenhouse Enrichment (Tomato/Pepper)</button>' +
      '<button class="preset-btn" onclick="SIMS.blackmanlimitinglab.setPreset(70, 380, \'C4\')">5. C4 Plant (Saturates at 360 ppm)</button>';
  }

  function setPreset(l, c, p){
    lightInt = l;
    co2Level = c;
    plantType = p;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">NCERT FIGURE 11.10: BLACKMAN\'S LAW & MULTI-FACTOR LIMITING CURVES</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    // Graph axes
    var ox = cx - 140, oy = cy + 70;
    m += '<line x1="' + ox + '" y1="' + oy + '" x2="' + (ox + 300) + '" y2="' + oy + '" stroke="#94a3b8" stroke-width="2"/>';
    m += '<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + (oy - 170) + '" stroke="#94a3b8" stroke-width="2"/>';

    m += '<text x="' + (ox + 150) + '" y="' + (oy + 30) + '" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle">Light Intensity</text>';
    m += '<text x="' + (ox - 12) + '" y="' + (oy - 85) + '" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle" transform="rotate(-90 ' + (ox - 12) + ' ' + (oy - 85) + ')">Rate of Photosynthesis</text>';

    // Saturation plateau ceiling based on CO2 & plant type
    // C4 saturates at 360 ppm, C3 needs 450+ ppm
    var satLevel = (plantType === "C4") ? Math.min(150, co2Level * 0.38) : Math.min(150, co2Level * 0.28);
    var plateauY = oy - satLevel;

    // Draw Blackman curve (Region A linear, curve at B, flat plateau at C and D)
    var curveD = 'M ' + ox + ' ' + oy +
                 ' L ' + (ox + 50) + ' ' + (plateauY + 15) +
                 ' Q ' + (ox + 75) + ' ' + plateauY + ' ' + (ox + 100) + ' ' + plateauY +
                 ' L ' + (ox + 290) + ' ' + plateauY;
    m += '<path d="' + curveD + '" fill="none" stroke="#38bdf8" stroke-width="3.5"/>';

    // Annotation markers A, B, C, D (Matching NCERT Figure 11.10)
    m += '<text x="' + (ox + 25) + '" y="' + (oy - 40) + '" fill="#10b981" font-size="14" font-weight="bold">A</text>';
    m += '<text x="' + (ox + 70) + '" y="' + (plateauY - 5) + '" fill="#fcd34d" font-size="14" font-weight="bold">B</text>';
    m += '<text x="' + (ox + 100) + '" y="' + (plateauY - 12) + '" fill="#fbbf24" font-size="14" font-weight="bold">C</text>';
    m += '<text x="' + (ox + 220) + '" y="' + (plateauY - 12) + '" fill="#38bdf8" font-size="14" font-weight="bold">D</text>';

    // Operating point based on lightInt
    var curX = ox + (lightInt * 2.8);
    var curY = (lightInt < 25) ? (oy - (lightInt / 25) * (satLevel - 15)) : plateauY;

    m += '<circle cx="' + curX + '" cy="' + curY + '" r="7" fill="#fbbf24" stroke="#fff" stroke-width="2"/>';
    m += '<line x1="' + curX + '" y1="' + oy + '" x2="' + curX + '" y2="' + curY + '" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3,2"/>';
    m += '<text x="' + curX + '" y="' + (oy + 15) + '" fill="#fbbf24" font-size="9.5" text-anchor="middle">' + lightInt + '% Light</text>';

    // 10% sunlight mark
    m += '<line x1="' + (ox + 28) + '" y1="' + (oy - 5) + '" x2="' + (ox + 28) + '" y2="' + (oy + 5) + '" stroke="#f87171" stroke-width="2"/>';
    m += '<text x="' + (ox + 28) + '" y="' + (oy + 16) + '" fill="#f87171" font-size="8.5" text-anchor="middle">10% Sun</text>';

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">NCERT EX 11.8 KEY</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 48) + '" fill="#10b981" font-size="10.5" font-weight="bold">Region A:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 65) + '" fill="#cbd5e1" font-size="9.5">• Linear phase: Rate</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 78) + '" fill="#cbd5e1" font-size="9.5">  directly proportional</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 91) + '" fill="#86efac" font-size="9.5">  to light intensity.</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 105) + '" fill="#86efac" font-size="9.5">• LIGHT is limiting!</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 128) + '" fill="#fbbf24" font-size="10.5" font-weight="bold">Point C & D:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 145) + '" fill="#cbd5e1" font-size="9.5">• C: Light saturation</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 158) + '" fill="#cbd5e1" font-size="9.5">  point (~10% sunlight)</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 175) + '" fill="#cbd5e1" font-size="9.5">• D: Maximal plateau;</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 188) + '" fill="#f87171" font-size="9.5">  CO2 or temperature</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 201) + '" fill="#f87171" font-size="9.5">  now limiting factor.</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 225) + '" fill="#38bdf8" font-size="10.5" font-weight="bold">CO2 Saturation:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 242) + '" fill="#cbd5e1" font-size="9.5">• C4 saturates at 360 ppm</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 256) + '" fill="#cbd5e1" font-size="9.5">• C3 saturates >450 ppm</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 270) + '" fill="#86efac" font-size="9.5">• Greenhouse enrichment</text>';

    svg.innerHTML = m;

    var curLimiting = (lightInt < 25) ? "Light Intensity (Region A)" : "Atmospheric CO2 Concentration (Region D)";

    readout(
      cell("Plant Category", plantType + " Plant", plantType === "C4" ? "#f59e0b" : "#38bdf8") +
      cell("Limiting Factor", curLimiting, lightInt < 25 ? "#10b981" : "#fcd34d") +
      cell("CO2 Concentration", co2Level + " ppm", "#38bdf8") +
      cell("Photosynthetic Rate", Math.round(satLevel) + " units (Max)", "#86efac")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 11.10 Blackman\'s Limiting Factor Rule:</span> ' +
      (lightInt < 25 ?
       "In Region A, light is the limiting factor because the rate increases linearly with increasing irradiance; light saturation is reached at only about 10% of full sunlight." :
       "In Region D, light is saturating and no longer limiting; the maximum rate is constrained by sub-optimal atmospheric CO2 (0.038%), which is why C3 greenhouse crops like tomatoes and peppers thrive under CO2 enrichment.")
    );
  }

  return { mount: mount, setPreset: setPreset, draw: draw };
})();
