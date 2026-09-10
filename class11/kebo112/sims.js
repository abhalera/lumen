// kebo112 interactive simulations: Respiration in Plants
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
// 1. SIMULATION 1: Plant Gas Exchange & Lenticels (plantgaseoussim)
// -------------------------------------------------------------------------
window.SIMS.plantgaseoussim = (function(){
  var view = "lenticel"; // "lenticel", "stomata", "combustion"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Lenticel Gas Diffusion (Woody Bark)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Stomatal Transpiration & Exchange</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Loose Parenchyma Air Network</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Stepwise Respiration vs Combustion</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.plantgaseoussim.setView(\'lenticel\')">1. Lenticel in Woody Bark</button>' +
      '<button class="preset-btn" onclick="SIMS.plantgaseoussim.setView(\'stomata\')">2. Stomata & Mesophyll Air Spaces</button>' +
      '<button class="preset-btn" onclick="SIMS.plantgaseoussim.setView(\'combustion\')">3. Respiration vs Sudden Combustion</button>';
  }

  function setView(v){
    view = v;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">PLANT GASEOUS EXCHANGE: LENTICELS, STOMATA & STEP-WISE OXIDATION</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    if (view === "lenticel") {
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">LENTICEL: AERATING PORE IN WOODY STEM BARK</text>';

      // Cork layer (periderm)
      m += '<rect x="' + (cx - 150) + '" y="' + (cy - 50) + '" width="300" height="40" fill="#78350f" stroke="#92400e" stroke-width="2"/>';
      m += '<text x="' + (cx - 140) + '" y="' + (cy - 30) + '" fill="#fef3c7" font-size="11">Suberized Impermeable Cork</text>';

      // Lenticel opening in middle with loose complementary cells
      m += '<path d="M ' + (cx - 50) + ' ' + (cy - 50) + ' Q ' + cx + ' ' + (cy - 75) + ' ' + (cx + 50) + ' ' + (cy - 50) + ' Z" fill="#b45309" stroke="#d97706" stroke-width="2"/>';
      m += '<text x="' + cx + '" y="' + (cy - 60) + '" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Lenticel Pore</text>';

      // Complementary cells (rounded, loose cells)
      for (var c = -35; c <= 35; c += 14) {
        m += '<circle cx="' + (cx + c) + '" cy="' + (cy - 45) + '" r="5" fill="#fde047" stroke="#ca8a04"/>';
        m += '<circle cx="' + (cx + c + 7) + '" cy="' + (cy - 35) + '" r="5" fill="#fde047" stroke="#ca8a04"/>';
      }

      // Living tissue layer beneath cork (cambium, secondary phloem)
      m += '<rect x="' + (cx - 150) + '" y="' + (cy - 10) + '" width="300" height="45" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="' + cx + '" y="' + (cy + 15) + '" fill="#86efac" font-size="11" font-weight="bold" text-anchor="middle">Living Tissue Mantle (Cambium / Ray Parenchyma)</text>';

      // Dead interior wood (heartwood/sapwood)
      m += '<rect x="' + (cx - 150) + '" y="' + (cy + 35) + '" width="300" height="55" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="' + cx + '" y="' + (cy + 65) + '" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Dead Interior Wood (Requires ZERO O2)</text>';

      // Gas diffusion arrows through pore
      m += '<line x1="' + cx + '" y1="' + (cy - 95) + '" x2="' + cx + '" y2="' + (cy - 65) + '" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow)"/>';
      m += '<text x="' + (cx + 10) + '" y="' + (cy - 85) + '" fill="#38bdf8" font-size="10">O2 in</text>';
      m += '<line x1="' + (cx - 20) + '" y1="' + (cy - 65) + '" x2="' + (cx - 20) + '" y2="' + (cy - 95) + '" stroke="#fcd34d" stroke-width="2.5" marker-end="url(#arrow)"/>';
      m += '<text x="' + (cx - 50) + '" y="' + (cy - 85) + '" fill="#fcd34d" font-size="10">CO2 out</text>';

    } else if (view === "stomata") {
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">LEAF STOMATA & INTERCONNECTED AIR SPACE MESH</text>';

      // Upper epidermis
      m += '<rect x="' + (cx - 150) + '" y="' + (cy - 70) + '" width="300" height="20" fill="#15803d" stroke="#16a34a"/>';
      m += '<text x="' + (cx - 140) + '" y="' + (cy - 56) + '" fill="#dcfce7" font-size="10">Upper Cuticle & Epidermis</text>';

      // Palisade mesophyll
      for (var p = -140; p <= 120; p += 22) {
        m += '<rect x="' + (cx + p) + '" y="' + (cy - 48) + '" width="18" height="40" rx="3" fill="#16a34a" stroke="#22c55e"/>';
      }

      // Spongy mesophyll with large interconnected air spaces
      var airNodes = [
        [-120, 10], [-60, 15], [0, 8], [60, 12], [110, 15],
        [-90, 35], [-30, 30], [30, 35], [90, 30]
      ];
      for (var a = 0; a < airNodes.length; a++) {
        m += '<ellipse cx="' + (cx + airNodes[a][0]) + '" cy="' + (cy + airNodes[a][1]) + '" rx="16" ry="12" fill="#15803d" stroke="#22c55e"/>';
      }
      m += '<text x="' + cx + '" y="' + (cy + 25) + '" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">Interconnected Air Cavities</text>';

      // Lower epidermis with Stomatal pore
      m += '<rect x="' + (cx - 150) + '" y="' + (cy + 55) + '" width="115" height="18" fill="#15803d"/>';
      m += '<rect x="' + (cx + 35) + '" y="' + (cy + 55) + '" width="115" height="18" fill="#15803d"/>';

      // Guard cells
      m += '<ellipse cx="' + (cx - 15) + '" cy="' + (cy + 64) + '" rx="12" ry="7" fill="#4ade80" stroke="#16a34a"/>';
      m += '<ellipse cx="' + (cx + 15) + '" cy="' + (cy + 64) + '" rx="12" ry="7" fill="#4ade80" stroke="#16a34a"/>';
      m += '<text x="' + cx + '" y="' + (cy + 92) + '" fill="#86efac" font-size="11" font-weight="bold" text-anchor="middle">Stomatal Pore (Diffusion Gateway)</text>';

    } else if (view === "combustion") {
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">CONTROLLED RESPIRATION vs UNCONTROLLED COMBUSTION</text>';

      // Left Box: Respiration
      m += '<rect x="' + (cx - 150) + '" y="' + (cy - 60) + '" width="140" height="150" rx="8" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy - 35) + '" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">RESPIRATION</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy - 10) + '" fill="#cbd5e1" font-size="10" text-anchor="middle">• Slow stepwise release</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy + 10) + '" fill="#86efac" font-size="10" font-weight="bold" text-anchor="middle">• Trapped as ATP</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy + 30) + '" fill="#cbd5e1" font-size="10" text-anchor="middle">• Physiological temp</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy + 50) + '" fill="#38bdf8" font-size="10" text-anchor="middle">• Enzyme-controlled</text>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy + 70) + '" fill="#fcd34d" font-size="9.5" text-anchor="middle">• Biosynthetic precursors</text>';

      // Right Box: Combustion
      m += '<rect x="' + (cx + 10) + '" y="' + (cy - 60) + '" width="140" height="150" rx="8" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy - 35) + '" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">COMBUSTION</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy - 10) + '" fill="#cbd5e1" font-size="10" text-anchor="middle">• Single sudden explosion</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy + 10) + '" fill="#f87171" font-size="10" font-weight="bold" text-anchor="middle">• Wasted as Heat/Flame</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy + 30) + '" fill="#cbd5e1" font-size="10" text-anchor="middle">• High ignition temp</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy + 50) + '" fill="#cbd5e1" font-size="10" text-anchor="middle">• Non-enzymatic</text>';
      m += '<text x="' + (cx + 80) + '" y="' + (cy + 70) + '" fill="#ef4444" font-size="9.5" text-anchor="middle">• Destroys all cells!</text>';
    }

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">GAS EXCHANGE</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#fcd34d" font-size="11" font-weight="bold">Why No Organs?</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#cbd5e1" font-size="9.5">1. Low metabolic rate</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 85) + '" fill="#cbd5e1" font-size="9.5">   compared to animals</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 105) + '" fill="#cbd5e1" font-size="9.5">2. Each plant organ</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 120) + '" fill="#cbd5e1" font-size="9.5">   cares for itself</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 140) + '" fill="#cbd5e1" font-size="9.5">3. Diffusion distance</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 155) + '" fill="#cbd5e1" font-size="9.5">   is very short</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 175) + '" fill="#86efac" font-size="9.5">4. Photosynthesis</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 190) + '" fill="#86efac" font-size="9.5">   supplies O2 inside!</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 220) + '" fill="#38bdf8" font-size="11" font-weight="bold">Structures:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 240) + '" fill="#cbd5e1" font-size="9.5">• Stomata (Leaves)</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 258) + '" fill="#cbd5e1" font-size="9.5">• Lenticels (Bark)</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 276) + '" fill="#cbd5e1" font-size="9.5">• Parenchyma spaces</text>';

    svg.innerHTML = m;

    readout(
      cell("View Mode", view.toUpperCase(), "#38bdf8") +
      cell("Gas Exchange Device", view === "lenticel" ? "Lenticels (Bark)" : (view === "stomata" ? "Stomata (Leaf)" : "Biological Respiration"), "#10b981") +
      cell("Diffusion Distance", "Extremely Short (< few mm)", "#fcd34d") +
      cell("Energy Coupling", view === "combustion" ? "Respiration = 40% ATP" : "ATP Energy Currency", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 12.1 Plant Gas Exchange Rule:</span> ' +
      (view === "combustion" ?
       "Respiration differs fundamentally from combustion: respiration proceeds via sequential enzyme-catalyzed steps that trap energy into ATP at body temperature, whereas combustion releases all energy at once as destructive heat." :
       "Plants can survive without specialized respiratory organs because each plant part satisfies its own gas needs, living cells reside in thin superficial layers near the surface, and daytime photosynthesis provides abundant internal oxygen."
    ));
  }

  return { mount: mount, setView: setView, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Glycolysis EMP Pathway (glycolysispathwaysim)
// -------------------------------------------------------------------------
window.SIMS.glycolysispathwaysim = (function(){
  var step = "all"; // "prep", "cleavage", "payoff", "all"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Energy Investment (-2 ATP)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Oxidation & NADH (+2 NADH)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Substrate Phosphorylation (+4 ATP)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Net Dividend (+2 ATP, +2 Pyruvate)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.glycolysispathwaysim.setStep(\'all\')">1. Full 10-Step EMP Overview</button>' +
      '<button class="preset-btn" onclick="SIMS.glycolysispathwaysim.setStep(\'prep\')">2. Preparatory Phase (-2 ATP)</button>' +
      '<button class="preset-btn" onclick="SIMS.glycolysispathwaysim.setStep(\'cleavage\')">3. Aldolase Cleavage (PGAL + DHAP)</button>' +
      '<button class="preset-btn" onclick="SIMS.glycolysispathwaysim.setStep(\'payoff\')">4. Payoff Phase (+4 ATP, +2 NADH)</button>';
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
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EMBDEN-MEYERHOF-PARNAS (EMP) 10-STEP GLYCOLYSIS PATHWAY</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    // Pathway Nodes (Top to Bottom Flow)
    // 1. Glucose (6C)
    var gY = cy - 100;
    m += '<rect x="' + (cx - 70) + '" y="' + gY + '" width="140" height="28" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + cx + '" y="' + (gY + 18) + '" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">GLUCOSE (6C)</text>';

    // ATP 1 consumed (Hexokinase)
    m += '<path d="M ' + (cx + 70) + ' ' + (gY + 14) + ' Q ' + (cx + 105) + ' ' + (gY + 30) + ' ' + (cx + 70) + ' ' + (gY + 45) + '" fill="none" stroke="#ef4444" stroke-width="2"/>';
    m += '<text x="' + (cx + 115) + '" y="' + (gY + 33) + '" fill="#f87171" font-size="9.5">ATP -> ADP (Hexokinase)</text>';

    // 2. Fructose-1,6-bisphosphate (6C)
    var fbpY = cy - 40;
    m += '<rect x="' + (cx - 90) + '" y="' + fbpY + '" width="180" height="28" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="1.5"/>';
    m += '<text x="' + cx + '" y="' + (fbpY + 18) + '" fill="#fca5a5" font-size="11" font-weight="bold" text-anchor="middle">Fructose-1,6-bisphosphate (6C)</text>';
    m += '<text x="' + (cx - 100) + '" y="' + (fbpY - 5) + '" fill="#ef4444" font-size="9">ATP -> ADP (PFK)</text>';

    // 3. Aldolase Cleavage split into PGAL & DHAP
    var triY = cy + 20;
    m += '<line x1="' + (cx - 40) + '" y1="' + (fbpY + 28) + '" x2="' + (cx - 80) + '" y2="' + triY + '" stroke="#94a3b8" stroke-width="2"/>';
    m += '<line x1="' + (cx + 40) + '" y1="' + (fbpY + 28) + '" x2="' + (cx + 80) + '" y2="' + triY + '" stroke="#94a3b8" stroke-width="2"/>';

    m += '<rect x="' + (cx - 140) + '" y="' + triY + '" width="115" height="26" rx="5" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';
    m += '<text x="' + (cx - 82) + '" y="' + (triY + 17) + '" fill="#86efac" font-size="10.5" font-weight="bold" text-anchor="middle">PGAL (G3P, 3C)</text>';

    m += '<rect x="' + (cx + 25) + '" y="' + triY + '" width="115" height="26" rx="5" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/>';
    m += '<text x="' + (cx + 82) + '" y="' + (triY + 17) + '" fill="#d8b4fe" font-size="10.5" font-weight="bold" text-anchor="middle">DHAP (3C)</text>';

    // Isomerization arrow between PGAL and DHAP
    m += '<line x1="' + (cx - 20) + '" y1="' + (triY + 13) + '" x2="' + (cx + 20) + '" y2="' + (triY + 13) + '" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,2"/>';

    // 4. Payoff Phase (2x PGAL -> 2x Pyruvate)
    var pyrY = cy + 85;
    m += '<line x1="' + (cx - 82) + '" y1="' + (triY + 26) + '" x2="' + cx + '" y2="' + pyrY + '" stroke="#10b981" stroke-width="2.5"/>';

    // Yield banners on sides
    m += '<rect x="' + (cx - 150) + '" y="' + (cy + 55) + '" width="95" height="24" rx="4" fill="#0369a1"/>';
    m += '<text x="' + (cx - 102) + '" y="' + (cy + 71) + '" fill="#bae6fd" font-size="9.5" font-weight="bold" text-anchor="middle">+ 2 NADH (GAPDH)</text>';

    m += '<rect x="' + (cx + 55) + '" y="' + (cy + 55) + '" width="95" height="24" rx="4" fill="#047857"/>';
    m += '<text x="' + (cx + 102) + '" y="' + (cy + 71) + '" fill="#a7f3d0" font-size="9.5" font-weight="bold" text-anchor="middle">+ 4 ATP (Substrate)</text>';

    // End Product: 2 Pyruvic acid
    m += '<rect x="' + (cx - 85) + '" y="' + pyrY + '" width="170" height="32" rx="8" fill="#15803d" stroke="#4ade80" stroke-width="2"/>';
    m += '<text x="' + cx + '" y="' + (pyrY + 20) + '" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">2 x PYRUVIC ACID (3C)</text>';

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">GLYCOLYSIS LEDGER</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#ef4444" font-size="11" font-weight="bold">Energy Investment:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 68) + '" fill="#fca5a5" font-size="10">• -1 ATP at Hexokinase</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 85) + '" fill="#fca5a5" font-size="10">• -1 ATP at PFK</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 102) + '" fill="#cbd5e1" font-size="10">Total Invested = -2 ATP</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 130) + '" fill="#10b981" font-size="11" font-weight="bold">Energy Generation:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 148) + '" fill="#86efac" font-size="10">• +2 ATP at PGK</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 165) + '" fill="#86efac" font-size="10">• +2 ATP at Pyruvate Kinase</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 182) + '" fill="#cbd5e1" font-size="10">Total Formed = +4 ATP</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 210) + '" fill="#fbbf24" font-size="11" font-weight="bold">NET HARVEST:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 230) + '" fill="#fbbf24" font-size="11" font-weight="bold">• NET +2 ATP</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 248) + '" fill="#38bdf8" font-size="10" font-weight="bold">• +2 NADH + 2 H+</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 266) + '" fill="#10b981" font-size="10" font-weight="bold">• 2 Pyruvate (3C)</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 282) + '" fill="#cbd5e1" font-size="9">Site: Cytoplasm (Anaerobic)</text>';

    svg.innerHTML = m;

    readout(
      cell("Pathway Stage", step.toUpperCase(), "#38bdf8") +
      cell("ATP Invested", "-2 ATP (Steps 1 & 3)", "#ef4444") +
      cell("Substrate ATP Made", "+4 ATP (Steps 7 & 10)", "#10b981") +
      cell("Net Dividend", "+2 ATP & +2 NADH", "#fbbf24")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 12.2 Glycolysis Rule:</span> ' +
      "Glycolysis converts one molecule of glucose (6C) into two molecules of pyruvic acid (3C) in the cytoplasm without oxygen; after investing 2 ATP in the preparatory phase, it produces 4 ATP via substrate-level phosphorylation, yielding net +2 ATP and 2 NADH."
    );
  }

  return { mount: mount, setStep: setStep, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Fermentation & Anaerobic Fates (fermentationsim)
// -------------------------------------------------------------------------
window.SIMS.fermentationsim = (function(){
  var type = "alcohol"; // "alcohol", "lactic", "compare"

  function mount(){
    App.state.maxT = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Alcoholic Fermentation (Yeast)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Lactic Acid Fermentation (Muscle)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>13% Alcohol Toxicity</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>< 7% Energy Harvest</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.fermentationsim.setType(\'alcohol\')">1. Alcoholic Fermentation (Yeast)</button>' +
      '<button class="preset-btn" onclick="SIMS.fermentationsim.setType(\'lactic\')">2. Lactic Acid (Fatigued Muscle)</button>' +
      '<button class="preset-btn" onclick="SIMS.fermentationsim.setType(\'compare\')">3. Side-by-Side Comparison</button>';
  }

  function setType(t){
    type = t;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">FERMENTATION: ALCOHOLIC vs LACTIC ACID ANAEROBIC PATHWAYS</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    if (type === "alcohol") {
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">ALCOHOLIC FERMENTATION IN YEAST (SACCHAROMYCES)</text>';

      // Pyruvate
      m += '<rect x="' + (cx - 140) + '" y="' + (cy - 20) + '" width="100" height="40" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx - 90) + '" y="' + (cy + 5) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Pyruvate (3C)</text>';

      // Decarboxylation step
      m += '<line x1="' + (cx - 40) + '" y1="' + cy + '" x2="' + (cx + 10) + '" y2="' + cy + '" stroke="#fbbf24" stroke-width="2.5" marker-end="url(#arrow)"/>';
      m += '<path d="M ' + (cx - 15) + ' ' + cy + ' Q ' + (cx - 15) + ' ' + (cy - 40) + ' ' + cx + ' ' + (cy - 50) + '" fill="none" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="' + (cx + 10) + '" y="' + (cy - 52) + '" fill="#10b981" font-size="11" font-weight="bold">+ CO2 Evolved!</text>';
      m += '<text x="' + (cx - 15) + '" y="' + (cy + 22) + '" fill="#fbbf24" font-size="8.5" text-anchor="middle">Pyruvate Decarboxylase</text>';

      // Acetaldehyde
      m += '<rect x="' + (cx + 15) + '" y="' + (cy - 20) + '" width="115" height="40" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>';
      m += '<text x="' + (cx + 72) + '" y="' + (cy + 5) + '" fill="#fef08a" font-size="11" font-weight="bold" text-anchor="middle">Acetaldehyde (2C)</text>';

      // Reduction to Ethanol
      m += '<line x1="' + (cx + 72) + '" y1="' + (cy + 20) + '" x2="' + (cx + 72) + '" y2="' + (cy + 60) + '" stroke="#a855f7" stroke-width="2.5" marker-end="url(#arrow)"/>';
      m += '<text x="' + (cx + 135) + '" y="' + (cy + 42) + '" fill="#38bdf8" font-size="9.5">NADH -> NAD+</text>';
      m += '<text x="' + (cx - 5) + '" y="' + (cy + 42) + '" fill="#c084fc" font-size="8.5">Alcohol DH</text>';

      // Ethanol End Product
      m += '<rect x="' + (cx + 15) + '" y="' + (cy + 60) + '" width="115" height="35" rx="6" fill="#78350f" stroke="#d97706" stroke-width="2"/>';
      m += '<text x="' + (cx + 72) + '" y="' + (cy + 82) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">ETHANOL (2C)</text>';

      // 13% Toxicity alert
      m += '<rect x="' + (cx - 140) + '" y="' + (cy + 55) + '" width="135" height="45" rx="6" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1.5"/>';
      m += '<text x="' + (cx - 72) + '" y="' + (cy + 72) + '" fill="#f87171" font-size="10" font-weight="bold" text-anchor="middle">Toxicity Warning:</text>';
      m += '<text x="' + (cx - 72) + '" y="' + (cy + 88) + '" fill="#cbd5e1" font-size="9" text-anchor="middle">Yeast die at ~13% alcohol</text>';

    } else if (type === "lactic") {
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#ec4899" font-size="14" font-weight="bold" text-anchor="middle">LACTIC ACID FERMENTATION IN FATIGUED SKELETAL MUSCLE</text>';

      // Pyruvate
      m += '<rect x="' + (cx - 120) + '" y="' + (cy - 10) + '" width="110" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx - 65) + '" y="' + (cy + 17) + '" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Pyruvate (3C)</text>';

      // Single Reduction step directly to Lactic Acid
      m += '<line x1="' + (cx - 10) + '" y1="' + (cy + 12) + '" x2="' + (cx + 50) + '" y2="' + (cy + 12) + '" stroke="#ec4899" stroke-width="3" marker-end="url(#arrow)"/>';
      m += '<text x="' + (cx + 20) + '" y="' + (cy - 12) + '" fill="#ec4899" font-size="10" font-weight="bold" text-anchor="middle">Lactate Dehydrogenase</text>';
      m += '<text x="' + (cx + 20) + '" y="' + (cy + 34) + '" fill="#38bdf8" font-size="10" text-anchor="middle">NADH + H+ -> NAD+</text>';

      // Lactic Acid End Product
      m += '<rect x="' + (cx + 55) + '" y="' + (cy - 10) + '" width="125" height="45" rx="6" fill="#831843" stroke="#f472b6" stroke-width="2"/>';
      m += '<text x="' + (cx + 117) + '" y="' + (cy + 17) + '" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">LACTIC ACID (3C)</text>';

      m += '<text x="' + cx + '" y="' + (cy + 85) + '" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">NO CO2 IS PRODUCED IN LACTIC ACID FERMENTATION!</text>';
      m += '<text x="' + cx + '" y="' + (cy + 105) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Accumulates in muscle during strenuous exercise, causing muscle fatigue & cramps.</text>';

    } else if (type === "compare") {
      m += '<line x1="280" y1="50" x2="280" y2="340" stroke="#475569" stroke-width="2" stroke-dasharray="6,4"/>';

      // Left: Yeast
      m += '<text x="140" y="65" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Yeast Alcoholic</text>';
      m += '<text x="140" y="95" fill="#cbd5e1" font-size="10" text-anchor="middle">Pyruvate (3C) -> Ethanol (2C)</text>';
      m += '<text x="140" y="125" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">• CO2 EVOLVED</text>';
      m += '<text x="140" y="155" fill="#fcd34d" font-size="10" text-anchor="middle">• Pyruvate Decarboxylase</text>';
      m += '<text x="140" y="175" fill="#fcd34d" font-size="10" text-anchor="middle">• Alcohol Dehydrogenase</text>';
      m += '<text x="140" y="210" fill="#f87171" font-size="10" font-weight="bold" text-anchor="middle">• Toxic at ~13% alcohol</text>';

      // Right: Muscle
      m += '<text x="420" y="65" fill="#ec4899" font-size="13" font-weight="bold" text-anchor="middle">Muscle Lactic Acid</text>';
      m += '<text x="420" y="95" fill="#cbd5e1" font-size="10" text-anchor="middle">Pyruvate (3C) -> Lactic Acid (3C)</text>';
      m += '<text x="420" y="125" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">• ZERO CO2 EVOLVED</text>';
      m += '<text x="420" y="155" fill="#f472b6" font-size="10" text-anchor="middle">• Lactate Dehydrogenase</text>';
      m += '<text x="420" y="175" fill="#cbd5e1" font-size="10" text-anchor="middle">• Direct 1-step reduction</text>';
      m += '<text x="420" y="210" fill="#f87171" font-size="10" font-weight="bold" text-anchor="middle">• Causes fatigue & cramp</text>';
    }

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">FERMENTATION</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#ef4444" font-size="11" font-weight="bold">Energy Efficiency:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#f87171" font-size="10" font-weight="bold">• LESS THAN 7%</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 88) + '" fill="#cbd5e1" font-size="9.5">  energy of glucose</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 102) + '" fill="#cbd5e1" font-size="9.5">  is liberated!</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 130) + '" fill="#10b981" font-size="11" font-weight="bold">Primary Purpose:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 150) + '" fill="#86efac" font-size="10">• REGENERATES NAD+</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 168) + '" fill="#cbd5e1" font-size="9.5">  from NADH so that</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 182) + '" fill="#cbd5e1" font-size="9.5">  glycolysis step 6</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 196) + '" fill="#cbd5e1" font-size="9.5">  can continue.</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 225) + '" fill="#fbbf24" font-size="11" font-weight="bold">Net ATP Output:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 245) + '" fill="#fbbf24" font-size="10" font-weight="bold">• Only 2 ATP</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 260) + '" fill="#cbd5e1" font-size="9.5">  (from glycolysis;</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 275) + '" fill="#cbd5e1" font-size="9.5">  fermentation adds 0)</text>';

    svg.innerHTML = m;

    var co2Status = (type === "alcohol" ? "YES (CO2 evolved)" : (type === "lactic" ? "ZERO (No CO2)" : "Alcohol = Yes; Lactic = No"));
    readout(
      cell("Fermentation Type", type.toUpperCase(), "#38bdf8") +
      cell("CO2 Release", co2Status, type === "lactic" ? "#ef4444" : "#10b981") +
      cell("Energy Captured", "< 7% of Glucose (2 ATP)", "#fcd34d") +
      cell("Role of Pathway", "Regenerate NAD+ pool", "#ec4899")
    );

    verdict(
      '<span style="color:#fbbf24;font-weight:700;">NCERT 12.3 Fermentation Rule:</span> ' +
      (type === "lactic" ?
       "In lactic acid fermentation, pyruvate is reduced directly to 3-carbon lactic acid by lactate dehydrogenase without releasing CO2; less than 7% of glucose energy is released, and no additional ATP is made." :
       "In alcoholic fermentation, pyruvate undergoes decarboxylation to acetaldehyde (releasing CO2) followed by reduction to ethanol by alcohol dehydrogenase, re-oxidizing NADH to NAD+; yeast succumb to alcohol toxicity at ~13% concentration."
    ));
  }

  return { mount: mount, setType: setType, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Krebs Cycle Rotary Engine (krebscyclesim)
// -------------------------------------------------------------------------
window.SIMS.krebscyclesim = (function(){
  var curStage = "all"; // "condensation", "decarb1", "decarb2", "substrate_atp", "all"

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Acetyl-CoA (2C) + OAA (4C) -> Citrate (6C)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>2 Decarboxylations (2 CO2 Released)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Reducing Power (3 NADH + 1 FADH2)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Substrate GTP / ATP Synthesis</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.krebscyclesim.setStage(\'all\')">1. Full Krebs Cycle (2 CO2 + 3 NADH + 1 FADH2)</button>' +
      '<button class="preset-btn" onclick="SIMS.krebscyclesim.setStage(\'condensation\')">2. Step 1: Citrate Condensation</button>' +
      '<button class="preset-btn" onclick="SIMS.krebscyclesim.setStage(\'decarb1\')">3. Isocitrate -> alpha-Ketoglutarate (5C)</button>' +
      '<button class="preset-btn" onclick="SIMS.krebscyclesim.setStage(\'substrate_atp\')">4. Succinyl-CoA -> Succinate (GTP/ATP)</button>';
  }

  function setStage(s){
    curStage = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">HANS KREBS TRICARBOXYLIC ACID (TCA) MITOCHONDRIAL MATRIX ENGINE</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 20;
    var R = 95;

    // Outer wheel
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#334155" stroke-width="4"/>';

    // 1. Top: Citrate (6C)
    var cX = cx, cY = cy - R;
    m += '<rect x="' + (cX - 50) + '" y="' + (cY - 18) + '" width="100" height="34" rx="6" fill="#065f46" stroke="#10b981" stroke-width="2"/>';
    m += '<text x="' + cX + '" y="' + (cY + 3) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">CITRIC ACID (6C)</text>';

    // Acetyl-CoA + OAA entrance
    m += '<path d="M ' + (cX - 90) + ' ' + (cY - 35) + ' L ' + (cX - 45) + ' ' + (cY - 12) + '" stroke="#fbbf24" stroke-width="2.5" marker-end="url(#arrow)"/>';
    m += '<text x="' + (cX - 95) + '" y="' + (cY - 42) + '" fill="#fbbf24" font-size="10" font-weight="bold">Acetyl-CoA (2C)</text>';
    m += '<text x="' + (cX - 95) + '" y="' + (cY - 28) + '" fill="#94a3b8" font-size="9">+ OAA (4C)</text>';

    // 2. Right: alpha-Ketoglutarate (5C)
    var aX = cx + R * Math.cos(30 * Math.PI / 180);
    var aY = cy + R * Math.sin(30 * Math.PI / 180);
    m += '<rect x="' + (aX - 55) + '" y="' + (aY - 18) + '" width="115" height="34" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + aX + '" y="' + (aY + 3) + '" fill="#bae6fd" font-size="10.5" font-weight="bold" text-anchor="middle">alpha-KG (5C)</text>';

    // Decarboxylation 1
    m += '<text x="' + (cx + 105) + '" y="' + (cy - 30) + '" fill="#ef4444" font-size="10" font-weight="bold">+ CO2 (Decarb 1)</text>';
    m += '<text x="' + (cx + 105) + '" y="' + (cy - 15) + '" fill="#38bdf8" font-size="10">+ NADH (1)</text>';

    // 3. Bottom: Succinate (4C)
    var sX = cx, sY = cy + R;
    m += '<rect x="' + (sX - 55) + '" y="' + (sY - 15) + '" width="110" height="34" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>';
    m += '<text x="' + sX + '" y="' + (sY + 4) + '" fill="#fef08a" font-size="11" font-weight="bold" text-anchor="middle">SUCCINATE (4C)</text>';

    // Decarboxylation 2 + GTP/ATP
    m += '<text x="' + (cx + 100) + '" y="' + (cy + 55) + '" fill="#ef4444" font-size="10" font-weight="bold">+ CO2 (Decarb 2)</text>';
    m += '<text x="' + (cx + 100) + '" y="' + (cy + 70) + '" fill="#38bdf8" font-size="10">+ NADH (2)</text>';
    m += '<text x="' + (cx + 40) + '" y="' + (sY + 35) + '" fill="#fbbf24" font-size="10" font-weight="bold">+ GTP / ATP (Substrate)</text>';

    // 4. Left: Malate & OAA Regeneration (4C)
    var mX = cx - R * Math.cos(30 * Math.PI / 180);
    var mY = cy + R * Math.sin(30 * Math.PI / 180);
    m += '<rect x="' + (mX - 55) + '" y="' + (mY - 18) + '" width="110" height="34" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/>';
    m += '<text x="' + mX + '" y="' + (mY + 3) + '" fill="#d8b4fe" font-size="11" font-weight="bold" text-anchor="middle">MALATE (4C)</text>';

    // FADH2 & NADH 3
    m += '<text x="' + (cx - 145) + '" y="' + (cy + 75) + '" fill="#f59e0b" font-size="10" font-weight="bold">+ FADH2 (Succinate DH)</text>';
    m += '<text x="' + (cx - 140) + '" y="' + (cy - 10) + '" fill="#38bdf8" font-size="10" font-weight="bold">+ NADH (3)</text>';

    // Center Hub Label
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="35" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>';
    m += '<text x="' + cx + '" y="' + (cy - 5) + '" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">TCA</text>';
    m += '<text x="' + cx + '" y="' + (cy + 12) + '" fill="#cbd5e1" font-size="9" text-anchor="middle">Matrix</text>';

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">KREBS YIELD</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 48) + '" fill="#fbbf24" font-size="11" font-weight="bold">Per Turn (1 Acetyl):</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 68) + '" fill="#ef4444" font-size="10">• 2 CO2 released</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 86) + '" fill="#38bdf8" font-size="10">• 3 NADH + 3 H+</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 104) + '" fill="#f59e0b" font-size="10">• 1 FADH2</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 122) + '" fill="#10b981" font-size="10">• 1 GTP / ATP</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 155) + '" fill="#10b981" font-size="11" font-weight="bold">Per Glucose (2 Turns):</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 175) + '" fill="#ef4444" font-size="10">• 4 CO2 released</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 193) + '" fill="#38bdf8" font-size="10">• 6 NADH</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 211) + '" fill="#f59e0b" font-size="10">• 2 FADH2</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 229) + '" fill="#10b981" font-size="10">• 2 GTP / ATP</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 258) + '" fill="#cbd5e1" font-size="9.5">+ Link Reaction: 2 CO2</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 273) + '" fill="#cbd5e1" font-size="9.5">  & 2 NADH per glucose</text>';

    svg.innerHTML = m;

    readout(
      cell("Active Stage", curStage.toUpperCase(), "#38bdf8") +
      cell("Decarboxylations", "2 CO2 evolved per turn (4 / glucose)", "#ef4444") +
      cell("High-Energy Carriers", "3 NADH + 1 FADH2 per turn", "#fcd34d") +
      cell("Substrate Phosphorylation", "1 GTP (ATP) per turn", "#10b981")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 12.4 Krebs Cycle Rule:</span> ' +
      "The citric acid cycle in the mitochondrial matrix oxidizes each 2-carbon Acetyl-CoA into 2 CO2, generating 3 NADH, 1 FADH2, and 1 GTP (ATP) via substrate-level phosphorylation; oxaloacetate (4C) is regenerated at step 8 to sustain the cycle."
    );
  }

  return { mount: mount, setStage: setStage, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Mitochondrial ETS & Cristae Motor (mitochondrialetssim)
// -------------------------------------------------------------------------
window.SIMS.mitochondrialetssim = (function(){
  var poison = "none"; // "none", "cyanide", "dnp"

  function mount(){
    App.state.maxT = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Complex I, III, IV (H+ Proton Pumps)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Complex II (Succinate DH - No H+ Pump)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Complex V (F0-F1 ATP Synthase)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Terminal O2 Acceptor -> H2O</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.mitochondrialetssim.setPoison(\'none\')">1. Normal ETS & Oxidative Phosphorylation</button>' +
      '<button class="preset-btn" onclick="SIMS.mitochondrialetssim.setPoison(\'cyanide\')">2. Cyanide / CO Poisoning (Blocks Complex IV)</button>' +
      '<button class="preset-btn" onclick="SIMS.mitochondrialetssim.setPoison(\'dnp\')">3. DNP Uncoupler (Leaky Inner Membrane)</button>';
  }

  function setPoison(p){
    poison = p;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">MITOCHONDRIAL ETS: 5-COMPLEX CRISTAE ARCHITECTURE & O2 TERMINAL SINK</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    // Intermembrane Space (Top - Acidic, high H+)
    m += '<rect x="40" y="50" width="' + (W - 240) + '" height="100" fill="' + (poison === "dnp" ? 'rgba(56,189,248,0.06)' : 'rgba(239,68,68,0.15)') + '"/>';
    m += '<text x="60" y="75" fill="#f87171" font-size="11" font-weight="bold">INTERMEMBRANE SPACE (Acidic, High [H+], Positive charge)</text>';

    // Inner Mitochondrial Membrane (Cristae Bilayer)
    m += '<rect x="40" y="150" width="' + (W - 240) + '" height="35" fill="#334155" stroke="#64748b" stroke-width="2"/>';
    m += '<text x="60" y="172" fill="#cbd5e1" font-size="10">Inner Mitochondrial Membrane (Cristae)</text>';

    // Mitochondrial Matrix (Bottom - Alkaline, low H+)
    m += '<rect x="40" y="185" width="' + (W - 240) + '" height="145" fill="rgba(56,189,248,0.08)"/>';
    m += '<text x="60" y="210" fill="#38bdf8" font-size="11" font-weight="bold">MITOCHONDRIAL MATRIX (Alkaline, Low [H+], Site of TCA & beta-Oxidation)</text>';

    // The 5 Complexes aligned in membrane
    var compX = [cx - 150, cx - 85, cx - 20, cx + 45, cx + 115];

    // Complex I (NADH DH)
    m += '<rect x="' + (compX[0] - 22) + '" y="145" width="44" height="45" rx="5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + compX[0] + '" y="172" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Comp I</text>';
    m += '<text x="' + compX[0] + '" y="235" fill="#38bdf8" font-size="9" text-anchor="middle">NADH -> NAD+</text>';
    if (poison === "none") {
      m += '<line x1="' + compX[0] + '" y1="145" x2="' + compX[0] + '" y2="105" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow)"/>';
      m += '<text x="' + compX[0] + '" y="95" fill="#ef4444" font-size="9.5" font-weight="bold" text-anchor="middle">4 H+</text>';
    }

    // Complex II (Succinate DH)
    m += '<rect x="' + (compX[1] - 20) + '" y="155" width="40" height="35" rx="5" fill="#b45309" stroke="#f59e0b" stroke-width="1.5"/>';
    m += '<text x="' + compX[1] + '" y="177" fill="#fff" font-size="9.5" font-weight="bold" text-anchor="middle">Comp II</text>';
    m += '<text x="' + compX[1] + '" y="235" fill="#f59e0b" font-size="9" text-anchor="middle">FADH2 -> FAD</text>';
    m += '<text x="' + compX[1] + '" y="130" fill="#94a3b8" font-size="8.5" text-anchor="middle">(0 H+ pumped)</text>';

    // Ubiquinone (UQ) mobile carrier between I/II and III
    m += '<circle cx="' + (compX[1] + 32) + '" cy="167" r="10" fill="#fbbf24"/>';
    m += '<text x="' + (compX[1] + 32) + '" y="171" fill="#000" font-size="8" font-weight="bold" text-anchor="middle">UQ</text>';

    // Complex III (Cytochrome bc1)
    m += '<rect x="' + (compX[2] - 22) + '" y="145" width="44" height="45" rx="5" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + compX[2] + '" y="172" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Comp III</text>';
    if (poison === "none") {
      m += '<line x1="' + compX[2] + '" y1="145" x2="' + compX[2] + '" y2="105" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow)"/>';
      m += '<text x="' + compX[2] + '" y="95" fill="#ef4444" font-size="9.5" font-weight="bold" text-anchor="middle">4 H+</text>';
    }

    // Cytochrome c mobile carrier
    m += '<circle cx="' + (compX[2] + 32) + '" cy="138" r="9" fill="#ec4899"/>';
    m += '<text x="' + (compX[2] + 32) + '" y="141" fill="#fff" font-size="7.5" font-weight="bold" text-anchor="middle">Cyt c</text>';

    // Complex IV (Cytochrome c oxidase)
    var c4Fill = (poison === "cyanide") ? "#ef4444" : "#047857";
    m += '<rect x="' + (compX[3] - 22) + '" y="145" width="44" height="45" rx="5" fill="' + c4Fill + '" stroke="#fff" stroke-width="1.5"/>';
    m += '<text x="' + compX[3] + '" y="172" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Comp IV</text>';

    if (poison === "cyanide") {
      m += '<text x="' + compX[3] + '" y="200" fill="#f87171" font-size="10" font-weight="bold" text-anchor="middle">BLOCKED!</text>';
      m += '<text x="' + compX[3] + '" y="215" fill="#ef4444" font-size="8.5" text-anchor="middle">(Cyanide / CO)</text>';
    } else {
      // Oxygen reduction
      m += '<text x="' + compX[3] + '" y="235" fill="#10b981" font-size="9.5" font-weight="bold" text-anchor="middle">O2 + 4H+ -> 2H2O</text>';
      m += '<line x1="' + compX[3] + '" y1="145" x2="' + compX[3] + '" y2="115" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow)"/>';
      m += '<text x="' + compX[3] + '" y="105" fill="#ef4444" font-size="9.5" font-weight="bold" text-anchor="middle">2 H+</text>';
    }

    // Complex V (ATP Synthase: F0 in membrane, F1 in matrix)
    m += '<rect x="' + (compX[4] - 14) + '" y="150" width="28" height="35" rx="3" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>';
    m += '<text x="' + compX[4] + '" y="172" fill="#78350f" font-size="9" font-weight="bold" text-anchor="middle">F0</text>';

    m += '<circle cx="' + compX[4] + '" cy="225" r="22" fill="#10b981" stroke="#fff" stroke-width="2"/>';
    m += '<text x="' + compX[4] + '" y="229" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">F1</text>';

    if (poison === "none") {
      m += '<line x1="' + compX[4] + '" y1="105" x2="' + compX[4] + '" y2="150" stroke="#fbbf24" stroke-width="2.5" marker-end="url(#arrow)"/>';
      m += '<text x="' + (compX[4] + 40) + '" y="225" fill="#fcd34d" font-size="10" font-weight="bold">ADP + Pi -> ATP</text>';
      m += '<text x="' + compX[4] + '" y="95" fill="#fbbf24" font-size="9.5" text-anchor="middle">H+ efflux</text>';
    } else if (poison === "cyanide") {
      m += '<text x="' + (compX[4] + 40) + '" y="225" fill="#ef4444" font-size="10" font-weight="bold">ATP Halted!</text>';
    } else if (poison === "dnp") {
      m += '<text x="' + (compX[4] + 40) + '" y="225" fill="#ef4444" font-size="10" font-weight="bold">Gradient Leaked!</text>';
    }

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">ETS COMPLEXES</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 48) + '" fill="#38bdf8" font-size="10">• I: NADH DH (pumps 4H+)</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 66) + '" fill="#f59e0b" font-size="10">• II: Succinate DH (0H+)</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 84) + '" fill="#38bdf8" font-size="10">• III: Cyt bc1 (pumps 4H+)</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 102) + '" fill="#10b981" font-size="10">• IV: Cyt c Oxidase (2H+)</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 120) + '" fill="#fbbf24" font-size="10">• V: ATP Synthase (F0-F1)</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 150) + '" fill="#ef4444" font-size="11" font-weight="bold">Terminal Acceptor:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 168) + '" fill="#86efac" font-size="10" font-weight="bold">• Molecular O2</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 184) + '" fill="#cbd5e1" font-size="9.5">  Pulls electrons down</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 198) + '" fill="#cbd5e1" font-size="9.5">  the entire chain</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 228) + '" fill="#fcd34d" font-size="11" font-weight="bold">Equivalents:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 246) + '" fill="#38bdf8" font-size="10">• 1 NADH -> 3 ATP</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 264) + '" fill="#f59e0b" font-size="10">• 1 FADH2 -> 2 ATP</text>';

    svg.innerHTML = m;

    var etsState = (poison === "cyanide" ? "BLOCKED (Complex IV Cyanide)" : (poison === "dnp" ? "UNCOUPLED (DNP Gradient Leak)" : "ACTIVE (Full Phosphorylation)"));
    readout(
      cell("ETS Status", etsState, poison === "none" ? "#10b981" : "#ef4444") +
      cell("Terminal Acceptor", "Molecular Oxygen (O2 -> H2O)", "#38bdf8") +
      cell("Proton Gradient", poison === "dnp" ? "COLLAPSED" : (poison === "cyanide" ? "DISSIPATING" : "HIGH PMF across cristae"), poison === "none" ? "#10b981" : "#ef4444") +
      cell("ATP Synthase Activity", poison === "none" ? "MAXIMAL" : "ZERO", poison === "none" ? "#10b981" : "#ef4444")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 12.4.2 Oxidative Phosphorylation Rule:</span> ' +
      (poison === "cyanide" ?
       "Cyanide binds to Cytochrome a3 in Complex IV, preventing electron transfer to molecular oxygen. The entire respiratory chain backs up, proton pumping halts, and aerobic ATP synthesis ceases immediately." :
       (poison === "dnp" ?
        "Uncouplers like DNP increase inner membrane permeability to protons, dissipating the proton motive force through F0 and halting ATP synthesis, even while electron transport continues." :
        "Electrons from NADH and FADH2 cascade down Complexes I, III, and IV to molecular oxygen (the terminal acceptor), pumping protons from matrix to intermembrane space; proton return through F0 drives F1 ATP synthesis."))
    );
  }

  return { mount: mount, setPoison: setPoison, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Respiratory Balance Sheet (atpbalancesheetsim)
// -------------------------------------------------------------------------
window.SIMS.atpbalancesheetsim = (function(){
  var shuttle = "malate"; // "malate" (38 ATP), "glycerol" (36 ATP)

  function mount(){
    App.state.maxT = 2;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Glycolysis (Net 8 or 6 ATP)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Link Reaction (6 ATP)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Krebs Cycle (24 ATP)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Total Net Yield (38 or 36 ATP)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.atpbalancesheetsim.setShuttle(\'malate\')">1. Malate-Aspartate Shuttle (38 ATP Total)</button>' +
      '<button class="preset-btn" onclick="SIMS.atpbalancesheetsim.setShuttle(\'glycerol\')">2. Glycerol-Phosphate Shuttle (36 ATP Total)</button>';
  }

  function setShuttle(s){
    shuttle = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">COMPLETE GLUCOSE OXIDATION: RESPIRATORY BALANCE SHEET LEDGER</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    // Table of ATP Harvest
    var totalATP = (shuttle === "malate") ? 38 : 36;
    var glyNadhATP = (shuttle === "malate") ? 6 : 4;

    m += '<rect x="' + (cx - 160) + '" y="' + (cy - 90) + '" width="320" height="205" rx="10" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="2"/>';
    m += '<text x="' + cx + '" y="' + (cy - 68) + '" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">STAGE-BY-STAGE ATP AUDIT (1 GLUCOSE)</text>';

    // Row 1: Glycolysis
    m += '<text x="' + (cx - 145) + '" y="' + (cy - 42) + '" fill="#cbd5e1" font-size="11">1. Glycolysis (Cytosol):</text>';
    m += '<text x="' + (cx + 145) + '" y="' + (cy - 42) + '" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="end">2 ATP (Substrate) + ' + glyNadhATP + ' ATP (2 NADH)</text>';

    // Row 2: Link Reaction
    m += '<text x="' + (cx - 145) + '" y="' + (cy - 16) + '" fill="#cbd5e1" font-size="11">2. Link Reaction (Matrix):</text>';
    m += '<text x="' + (cx + 145) + '" y="' + (cy - 16) + '" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="end">6 ATP (2 NADH x 3)</text>';

    // Row 3: Krebs Cycle
    m += '<text x="' + (cx - 145) + '" y="' + (cy + 10) + '" fill="#cbd5e1" font-size="11">3. Krebs Cycle (Matrix):</text>';
    m += '<text x="' + (cx + 145) + '" y="' + (cy + 10) + '" fill="#10b981" font-size="11" font-weight="bold" text-anchor="end">2 GTP + 18 ATP (6 NADH) + 4 ATP (2 FADH2)</text>';

    m += '<line x1="' + (cx - 145) + '" y1="' + (cy + 25) + '" x2="' + (cx + 145) + '" y2="' + (cy + 25) + '" stroke="#475569" stroke-width="1.5"/>';

    // Total Net Gain Banner
    m += '<rect x="' + (cx - 145) + '" y="' + (cy + 38) + '" width="290" height="40" rx="6" fill="#15803d" stroke="#4ade80" stroke-width="2"/>';
    m += '<text x="' + cx + '" y="' + (cy + 63) + '" fill="#ffffff" font-size="15" font-weight="bold" text-anchor="middle">TOTAL NET GAIN = ' + totalATP + ' ATP / GLUCOSE</text>';

    m += '<text x="' + cx + '" y="' + (cy + 98) + '" fill="#cbd5e1" font-size="10" text-anchor="middle">Active Shuttle: ' + (shuttle === "malate" ? "Malate-Aspartate (Liver, Kidney, Heart - 38 ATP)" : "Glycerol-Phosphate (Skeletal Muscle, Brain - 36 ATP)") + '</text>';

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">4 ASSUMPTIONS</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 48) + '" fill="#fcd34d" font-size="10" font-weight="bold">NCERT Ex 12.8 Rules:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 68) + '" fill="#cbd5e1" font-size="9.5">1. Sequential orderly</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 82) + '" fill="#cbd5e1" font-size="9.5">   pathway without gaps</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 105) + '" fill="#cbd5e1" font-size="9.5">2. Cytosolic NADH is</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 120) + '" fill="#cbd5e1" font-size="9.5">   transported into</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 135) + '" fill="#cbd5e1" font-size="9.5">   mitochondria</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 160) + '" fill="#cbd5e1" font-size="9.5">3. NO intermediates</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 175) + '" fill="#ef4444" font-size="9.5">   siphoned for</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 188) + '" fill="#ef4444" font-size="9.5">   anabolic synthesis</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 215) + '" fill="#cbd5e1" font-size="9.5">4. Glucose is the sole</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 230) + '" fill="#cbd5e1" font-size="9.5">   respiratory substrate</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 258) + '" fill="#86efac" font-size="9.5">Real cell: ~30-32 ATP</text>';

    svg.innerHTML = m;

    readout(
      cell("Shuttle System", shuttle.toUpperCase(), "#38bdf8") +
      cell("Substrate ATP", "4 ATP (2 Glycolysis + 2 Krebs)", "#10b981") +
      cell("Oxidative ATP", (totalATP - 4) + " ATP (via ETS)", "#fbbf24") +
      cell("Net Balance", totalATP + " ATP / Glucose", "#86efac")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 12.5 Balance Sheet Rule:</span> ' +
      "The theoretical calculation of 36 to 38 ATP per glucose assumes a sequential, unbranched pathway where glucose is the sole substrate, no intermediates are withdrawn for biosyntheses, and cytosolic NADH is fully phosphorylated."
    );
  }

  return { mount: mount, setShuttle: setShuttle, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Amphibolic Shunt & RQ Calculator (amphibolicrqsim)
// -------------------------------------------------------------------------
window.SIMS.amphibolicrqsim = (function(){
  var substrate = "glucose"; // "glucose", "tripalmitin", "protein", "malic", "anaerobic"

  var subData = {
    glucose: { name: "Glucose (Carbohydrate)", co2: 6, o2: 6, rq: 1.0, col: "#10b981" },
    tripalmitin: { name: "Tripalmitin (Fat)", co2: 102, o2: 145, rq: 0.7, col: "#f59e0b" },
    protein: { name: "Proteins", co2: 9, o2: 10, rq: 0.9, col: "#38bdf8" },
    malic: { name: "Malic Acid (Organic Acid)", co2: 4, o2: 3, rq: 1.33, col: "#a855f7" },
    anaerobic: { name: "Anaerobic (Yeast)", co2: 2, o2: 0, rq: Infinity, col: "#ef4444" }
  };

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Carbohydrate (RQ = 1.0)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Tripalmitin Fat (RQ = 0.7)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Proteins (RQ = 0.9)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Organic Acid (RQ > 1.0)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.amphibolicrqsim.setSub(\'glucose\')">1. Glucose (RQ = 1.0)</button>' +
      '<button class="preset-btn" onclick="SIMS.amphibolicrqsim.setSub(\'tripalmitin\')">2. Tripalmitin Fat (RQ = 0.7)</button>' +
      '<button class="preset-btn" onclick="SIMS.amphibolicrqsim.setSub(\'protein\')">3. Proteins (RQ = 0.9)</button>' +
      '<button class="preset-btn" onclick="SIMS.amphibolicrqsim.setSub(\'malic\')">4. Malic Acid (RQ = 1.33)</button>' +
      '<button class="preset-btn" onclick="SIMS.amphibolicrqsim.setSub(\'anaerobic\')">5. Anaerobic (RQ = Infinity)</button>';
  }

  function setSub(s){
    substrate = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var dat = subData[substrate];
    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">AMPHIBOLIC PATHWAY & DYNAMIC RESPIROMETER RQ CALCULATOR</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    // Respirometer representation on left
    m += '<rect x="' + (cx - 150) + '" y="' + (cy - 60) + '" width="120" height="150" rx="8" fill="rgba(30,41,59,0.7)" stroke="#64748b" stroke-width="2"/>';
    m += '<text x="' + (cx - 90) + '" y="' + (cy - 40) + '" fill="#cbd5e1" font-size="10" font-weight="bold" text-anchor="middle">Ganong Respirometer</text>';

    // Respiring tissue (e.g. germinating seeds)
    m += '<ellipse cx="' + (cx - 90) + '" cy="' + (cy + 10) + '" rx="25" ry="15" fill="#ca8a04"/>';
    m += '<text x="' + (cx - 90) + '" y="' + (cy + 14) + '" fill="#000" font-size="9" font-weight="bold" text-anchor="middle">Seeds</text>';

    // Manometer U-tube
    m += '<path d="M ' + (cx - 60) + ' ' + (cy - 10) + ' L ' + (cx - 40) + ' ' + (cy - 10) + ' L ' + (cx - 40) + ' ' + (cy + 65) + ' L ' + (cx - 20) + ' ' + (cy + 65) + ' L ' + (cx - 20) + ' ' + (cy - 10) + '" fill="none" stroke="#94a3b8" stroke-width="5"/>';

    // Manometer fluid level (shifts up when O2 consumed > CO2 evolved, e.g. for fats!)
    var fluidShift = (substrate === "tripalmitin") ? 18 : (substrate === "glucose" ? 0 : -10);
    m += '<line x1="' + (cx - 40) + '" y1="' + (cy + 55 - fluidShift) + '" x2="' + (cx - 40) + '" y2="' + (cy + 65) + '" stroke="#ef4444" stroke-width="5"/>';
    m += '<line x1="' + (cx - 20) + '" y1="' + (cy + 55 + fluidShift) + '" x2="' + (cx - 20) + '" y2="' + (cy + 65) + '" stroke="#ef4444" stroke-width="5"/>';

    // Central Display Board for Active Substrate
    m += '<rect x="' + (cx - 10) + '" y="' + (cy - 75) + '" width="170" height="175" rx="10" fill="rgba(30,41,59,0.9)" stroke="' + dat.col + '" stroke-width="2"/>';
    m += '<text x="' + (cx + 75) + '" y="' + (cy - 50) + '" fill="' + dat.col + '" font-size="12" font-weight="bold" text-anchor="middle">' + dat.name.toUpperCase() + '</text>';

    m += '<text x="' + (cx + 10) + '" y="' + (cy - 20) + '" fill="#cbd5e1" font-size="11">CO2 Evolved:</text>';
    m += '<text x="' + (cx + 140) + '" y="' + (cy - 20) + '" fill="#10b981" font-size="12" font-weight="bold" text-anchor="end">' + dat.co2 + ' Vol</text>';

    m += '<text x="' + (cx + 10) + '" y="' + cy + '" fill="#cbd5e1" font-size="11">O2 Consumed:</text>';
    m += '<text x="' + (cx + 140) + '" y="' + cy + '" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="end">' + dat.o2 + ' Vol</text>';

    m += '<line x1="' + (cx + 10) + '" y1="' + (cy + 12) + '" x2="' + (cx + 140) + '" y2="' + (cy + 12) + '" stroke="#475569" stroke-width="1"/>';

    m += '<text x="' + (cx + 10) + '" y="' + (cy + 34) + '" fill="#cbd5e1" font-size="12" font-weight="bold">RQ Value:</text>';
    m += '<text x="' + (cx + 140) + '" y="' + (cy + 34) + '" fill="' + dat.col + '" font-size="15" font-weight="bold" text-anchor="end">' + (dat.rq === Infinity ? "Infinity" : dat.rq) + '</text>';

    m += '<text x="' + (cx + 75) + '" y="' + (cy + 70) + '" fill="#cbd5e1" font-size="9.5" text-anchor="middle">RQ = Vol CO2 / Vol O2</text>';

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">AMPHIBOLIC HUB</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#fcd34d" font-size="10.5" font-weight="bold">Anabolic Siphons:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 68) + '" fill="#cbd5e1" font-size="9">• Acetyl-CoA -> Fatty</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 80) + '" fill="#cbd5e1" font-size="9">  acids, steroids, cutin</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 100) + '" fill="#cbd5e1" font-size="9">• DHAP -> Glycerol for</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 112) + '" fill="#cbd5e1" font-size="9">  phospholipid membrane</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 132) + '" fill="#cbd5e1" font-size="9">• alpha-KG -> Glutamate</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 144) + '" fill="#cbd5e1" font-size="9">  & other amino acids</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 164) + '" fill="#cbd5e1" font-size="9">• OAA -> Aspartate &</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 176) + '" fill="#cbd5e1" font-size="9">  pyrimidine bases</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 196) + '" fill="#cbd5e1" font-size="9">• Succinyl-CoA -> Heme,</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 208) + '" fill="#cbd5e1" font-size="9">  chlorophyll, cytochromes</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 235) + '" fill="#10b981" font-size="10.5" font-weight="bold">RQ Quick Reference:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 252) + '" fill="#cbd5e1" font-size="9">• Carbohydrate = 1.0</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 266) + '" fill="#cbd5e1" font-size="9">• Fats = 0.7 (Tripalmitin)</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 280) + '" fill="#cbd5e1" font-size="9">• Proteins = 0.9</text>';

    svg.innerHTML = m;

    readout(
      cell("Substrate Selected", dat.name.split(" ")[0], dat.col) +
      cell("Calculated RQ", (dat.rq === Infinity ? "Infinity (No O2)" : String(dat.rq)), dat.col) +
      cell("CO2 : O2 Ratio", dat.co2 + " CO2 / " + dat.o2 + " O2", "#38bdf8") +
      cell("Pathway Nature", "Amphibolic (Catabolic + Anabolic)", "#10b981")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">NCERT 12.6 & 12.7 Amphibolic & RQ Rule:</span> ' +
      (substrate === "tripalmitin" ?
       "Fats like tripalmitin have an RQ of ~0.7 because fatty acid molecules are poor in internal oxygen, requiring more external O2 for complete combustion than the volume of CO2 released: 2(C51H98O6) + 145 O2 -> 102 CO2 + 98 H2O." :
       (substrate === "glucose" ?
        "When carbohydrates like glucose are utilized as the respiratory substrate, RQ equals 1.0 because equal volumes of CO2 and O2 are evolved and consumed: C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O." :
        "The respiratory pathway is amphibolic: it catabolizes food for ATP and simultaneously provides intermediate carbon skeletons (Acetyl-CoA, alpha-ketoglutarate, OAA) for anabolic biosyntheses."
    )));
  }

  return { mount: mount, setSub: setSub, draw: draw };
})();
