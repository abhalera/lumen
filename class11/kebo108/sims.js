// kebo108 interactive simulations: Cell - The Unit of Life
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
// 1. SIMULATION 1: Cell Discovery Timeline & Scale Comparator (celltheorylab)
// -------------------------------------------------------------------------
window.SIMS.celltheorylab = (function(){
  var scaleTier = "rbc"; // "mycoplasma", "bacteria", "rbc", "eukaryote"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Mycoplasma (0.3 µm)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Bacterium (1–2 µm)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Human RBC (7.0 µm)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Typical Eukaryote (10–20 µm)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.celltheorylab.setScale(\'mycoplasma\')">Mycoplasma (0.3 µm)</button>' +
      '<button class="preset-btn" onclick="SIMS.celltheorylab.setScale(\'bacteria\')">Bacterium (1–2 µm)</button>' +
      '<button class="preset-btn" onclick="SIMS.celltheorylab.setScale(\'rbc\')">Human RBC (7.0 µm)</button>' +
      '<button class="preset-btn" onclick="SIMS.celltheorylab.setScale(\'eukaryote\')">Eukaryote (15 µm)</button>';
  }

  function setScale(s){
    scaleTier = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">CELL SIZE SPECTRUM & VIRCHOW\'S CELL THEORY</text>';

    // Comparative diagram
    var cx = W / 2;
    var cy = H / 2 + 10;

    // Outer Eukaryotic cell reference (15 um)
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="150" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4"/>';
    m += '<text x="' + cx + '" y="' + (cy - 120) + '" fill="#38bdf8" font-size="12" text-anchor="middle">Typical Eukaryotic Cell (~15 µm)</text>';

    // Human RBC reference (7 um)
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="70" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/>';
    m += '<text x="' + cx + '" y="' + (cy - 45) + '" fill="#10b981" font-size="11" text-anchor="middle">Human RBC (7.0 µm)</text>';

    // Bacterium reference (1-2 um)
    m += '<rect x="' + (cx - 20) + '" y="' + (cy + 10) + '" width="40" height="20" rx="10" fill="rgba(245,158,11,0.3)" stroke="#f59e0b" stroke-width="2"/>';
    m += '<text x="' + cx + '" y="' + (cy + 25) + '" fill="#fbbf24" font-size="10" text-anchor="middle">Bacterium</text>';

    // Mycoplasma (0.3 um)
    m += '<circle cx="' + cx + '" cy="' + (cy + 45) + '" r="4" fill="#f43f5e" stroke="#fff" stroke-width="1"/>';
    m += '<text x="' + (cx + 25) + '" y="' + (cy + 49) + '" fill="#f43f5e" font-size="10">Mycoplasma (0.3 µm)</text>';

    // Highlight target
    if (scaleTier === "mycoplasma") {
      m += '<circle cx="' + cx + '" cy="' + (cy + 45) + '" r="14" fill="none" stroke="#f43f5e" stroke-width="2.5"/>';
    } else if (scaleTier === "bacteria") {
      m += '<rect x="' + (cx - 24) + '" y="' + (cy + 6) + '" width="48" height="28" rx="14" fill="none" stroke="#f59e0b" stroke-width="2.5"/>';
    } else if (scaleTier === "rbc") {
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="74" fill="none" stroke="#10b981" stroke-width="2.5"/>';
    } else {
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="154" fill="none" stroke="#38bdf8" stroke-width="3"/>';
    }

    // Historical banner
    m += '<rect x="60" y="325" width="' + (W - 120) + '" height="55" rx="8" fill="rgba(30,41,59,0.7)" stroke="#64748b" stroke-width="1"/>';
    m += '<text x="' + (W/2) + '" y="345" fill="#fcd34d" font-size="12" font-weight="bold" text-anchor="middle">RUDOLF VIRCHOW (1855): Omnis cellula-e cellula</text>';
    m += '<text x="' + (W/2) + '" y="365" fill="#cbd5e1" font-size="11" text-anchor="middle">All living organisms are made of cells, and all new cells arise by division of pre-existing cells.</text>';

    svg.innerHTML = m;

    readout(
      cell("Focused Specimen", scaleTier.toUpperCase(), scaleTier === "mycoplasma" ? "#f43f5e" : (scaleTier === "bacteria" ? "#f59e0b" : (scaleTier === "rbc" ? "#10b981" : "#38bdf8"))) +
      cell("Physical Size", scaleTier === "mycoplasma" ? "0.3 µm (Smallest Cell)" : (scaleTier === "bacteria" ? "1 to 2 µm" : (scaleTier === "rbc" ? "7.0 µm" : "10 to 20 µm")), "#38bdf8") +
      cell("Nucleus Status", scaleTier === "mycoplasma" || scaleTier === "bacteria" ? "ABSENT (Prokaryotic)" : (scaleTier === "rbc" ? "ENUCLEATED (Mature Human)" : "PRESENT (Membrane-bound)"), "#10b981") +
      cell("Biogenesis", "Omnis cellula-e cellula", "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Cell Theory Axiom:</span> ' +
      "Schleiden (botanist) and Schwann (zoologist) founded cell theory; Rudolf Virchow completed it in 1855 with 'Omnis cellula-e cellula'—all cells arise from pre-existing cells by division."
    );
  }

  return { mount: mount, setScale: setScale, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Bacterial Envelope & Mesosome (prokaryotearchitect - Exercise 8.5)
// -------------------------------------------------------------------------
window.SIMS.prokaryotearchitect = (function(){
  var part = "mesosome"; // "glycocalyx", "wall", "membrane", "mesosome", "plasmid"

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Glycocalyx (Capsule)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Peptidoglycan Cell Wall</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Plasma Membrane & Mesosome</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Nucleoid & Plasmid DNA</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.prokaryotearchitect.setPart(\'mesosome\')">Mesosome Infoldings</button>' +
      '<button class="preset-btn" onclick="SIMS.prokaryotearchitect.setPart(\'wall\')">Peptidoglycan Wall</button>' +
      '<button class="preset-btn" onclick="SIMS.prokaryotearchitect.setPart(\'glycocalyx\')">Glycocalyx Capsule</button>' +
      '<button class="preset-btn" onclick="SIMS.prokaryotearchitect.setPart(\'plasmid\')">Plasmids & Genophore</button>';
  }

  function setPart(p){
    part = p;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 8.5: BACTERIAL ENVELOPE ARCHITECTURE & MESOSOME ROLES</text>';

    var bx = W / 2 - 40;
    var by = H / 2 + 5;

    // 1. Outermost Glycocalyx (Capsule)
    var glyStroke = (part === "glycocalyx") ? "#f43f5e" : "#ec4899";
    var glyWidth = (part === "glycocalyx") ? 8 : 4;
    m += '<rect x="' + (bx - 190) + '" y="' + (by - 95) + '" width="380" height="190" rx="95" fill="rgba(236,72,153,0.12)" stroke="' + glyStroke + '" stroke-width="' + glyWidth + '"/>';
    m += '<text x="' + (bx - 140) + '" y="' + (by - 105) + '" fill="#f472b6" font-size="11">Glycocalyx (Capsule / Slime Layer)</text>';

    // 2. Middle Peptidoglycan Cell Wall
    var wallStroke = (part === "wall") ? "#f59e0b" : "#b45309";
    var wallWidth = (part === "wall") ? 8 : 4;
    m += '<rect x="' + (bx - 170) + '" y="' + (by - 75) + '" width="340" height="150" rx="75" fill="rgba(245,158,11,0.15)" stroke="' + wallStroke + '" stroke-width="' + wallWidth + '"/>';
    m += '<text x="' + (bx - 120) + '" y="' + (by - 82) + '" fill="#fbbf24" font-size="11">Peptidoglycan Cell Wall (Shape & Protection)</text>';

    // 3. Inner Plasma Membrane
    m += '<rect x="' + (bx - 150) + '" y="' + (by - 55) + '" width="300" height="110" rx="55" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="3"/>';

    // 4. Mesosome Infoldings (Vesicles, tubules, lamellae)
    var mesoColor = (part === "mesosome") ? "#38bdf8" : "#0284c7";
    var mesoWidth = (part === "mesosome") ? 5 : 3;
    // Invagination path
    m += '<path d="M ' + (bx - 50) + ' ' + (by + 55) + ' C ' + (bx - 40) + ' ' + (by + 20) + ' ' + (bx - 10) + ' ' + (by + 10) + ' ' + (bx - 30) + ' ' + (by - 10) + ' S ' + (bx - 10) + ' ' + (by - 30) + ' ' + (bx - 40) + ' ' + (by - 55) + '" fill="none" stroke="' + mesoColor + '" stroke-width="' + mesoWidth + '"/>';
    // Mesosome vesicles
    m += '<circle cx="' + (bx - 20) + '" cy="' + (by + 15) + '" r="9" fill="rgba(56,189,248,0.4)" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="' + (bx - 25) + '" cy="' + (by - 15) + '" r="8" fill="rgba(56,189,248,0.4)" stroke="#38bdf8" stroke-width="2"/>';
    m += '<text x="' + (bx - 20) + '" y="' + (by + 40) + '" fill="#38bdf8" font-size="12" font-weight="bold">MESOSOME</text>';

    // 5. Naked Nucleoid DNA (Genophore)
    m += '<path d="M ' + (bx + 30) + ' ' + (by - 20) + ' Q ' + (bx + 70) + ' ' + (by - 40) + ' ' + (bx + 90) + ' ' + (by - 10) + ' T ' + (bx + 50) + ' ' + (by + 25) + ' T ' + (bx + 20) + ' ' + (by - 10) + '" fill="none" stroke="#10b981" stroke-width="3.5"/>';
    m += '<text x="' + (bx + 40) + '" y="' + by + '" fill="#10b981" font-size="11" font-weight="bold">Nucleoid DNA</text>';

    // 6. Plasmids
    var plColor = (part === "plasmid") ? "#fbbf24" : "#10b981";
    m += '<circle cx="' + (bx + 95) + '" cy="' + (by + 25) + '" r="8" fill="none" stroke="' + plColor + '" stroke-width="3"/>';
    m += '<circle cx="' + (bx + 115) + '" cy="' + (by + 10) + '" r="6" fill="none" stroke="' + plColor + '" stroke-width="2.5"/>';
    m += '<text x="' + (bx + 85) + '" y="' + (by + 45) + '" fill="#fbbf24" font-size="10">Plasmids (R-factors)</text>';

    // 7. Flagellum (Flagellin protein)
    m += '<path d="M ' + (bx - 190) + ' ' + by + ' Q ' + (bx - 240) + ' ' + (by - 30) + ' ' + (bx - 280) + ' ' + by + ' T ' + (bx - 340) + ' ' + by + '" fill="none" stroke="#e2e8f0" stroke-width="4"/>';
    m += '<text x="' + (bx - 280) + '" y="' + (by - 20) + '" fill="#cbd5e1" font-size="10">Flagellum</text>';

    // Info panel for Mesosome Functions
    m += '<rect x="490" y="65" width="215" height="240" rx="8" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="597" y="90" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">MESOSOME FUNCTIONS</text>';
    m += '<text x="502" y="115" fill="#fcd34d" font-size="11" font-weight="bold">1. Cell Wall Synthesis</text>';
    m += '<text x="502" y="140" fill="#fcd34d" font-size="11" font-weight="bold">2. DNA Replication</text>';
    m += '<text x="502" y="155" fill="#cbd5e1" font-size="10">   & Segregation to daughters</text>';
    m += '<text x="502" y="180" fill="#fcd34d" font-size="11" font-weight="bold">3. Cellular Respiration</text>';
    m += '<text x="502" y="195" fill="#cbd5e1" font-size="10">   (Mitochondria equivalent)</text>';
    m += '<text x="502" y="220" fill="#fcd34d" font-size="11" font-weight="bold">4. Secretion Processes</text>';
    m += '<text x="502" y="245" fill="#fcd34d" font-size="11" font-weight="bold">5. Surface Area Boost</text>';
    m += '<text x="502" y="260" fill="#cbd5e1" font-size="10">   Expands enzyme capacity</text>';

    svg.innerHTML = m;

    readout(
      cell("Inspected Domain", part.toUpperCase(), "#38bdf8") +
      cell("Mesosome Form", "Vesicles, Tubules & Lamellae", "#10b981") +
      cell("Wall Composition", "Peptidoglycan Polymer", "#f59e0b") +
      cell("Genetic Storage", "Genophore (dsDNA) + Plasmids", "#ec4899")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Exercise 8.5 Solution:</span> ' +
      "Mesosomes are invaginations of the bacterial plasma membrane performing 5 vital functions: cell wall synthesis, DNA replication and daughter distribution, cellular respiration, enzyme secretion, and surface area amplification."
    );
  }

  return { mount: mount, setPart: setPart, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Fluid Mosaic & Transport Mechanics (fluidmosaiclab - Exercise 8.6)
// -------------------------------------------------------------------------
window.SIMS.fluidmosaiclab = (function(){
  var mode = "neutral_simple"; // "neutral_simple", "polar_facilitated", "active_pump"

  function mount(){
    App.state.maxT = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Hydrophilic Polar Heads</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Hydrophobic Fatty Acid Tails</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Integral Channel / Carrier</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Active Na+/K+ ATP Pump</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.fluidmosaiclab.setMode(\'neutral_simple\')">Neutral Solute (Simple Diffusion)</button>' +
      '<button class="preset-btn" onclick="SIMS.fluidmosaiclab.setMode(\'polar_facilitated\')">Polar Solute (Facilitated)</button>' +
      '<button class="preset-btn" onclick="SIMS.fluidmosaiclab.setMode(\'active_pump\')">Active Ion Pump (ATP)</button>';
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

    var m = '<rect width="' + W + '" height="' + H + '" fill="#090d16"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 8.6: FLUID MOSAIC BILAYER & MEMBRANE TRANSPORT MODES</text>';

    var topY = 150;
    var botY = 250;

    // Phospholipid Bilayer
    // Upper leaflet
    for (var x = 60; x < W - 60; x += 22) {
      if ((mode === "polar_facilitated" || mode === "active_pump") && x > W/2 - 45 && x < W/2 + 45) continue;
      m += '<circle cx="' + x + '" cy="' + topY + '" r="9" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>';
      m += '<line x1="' + (x - 3) + '" y1="' + (topY + 9) + '" x2="' + (x - 4) + '" y2="' + (topY + 35) + '" stroke="#f59e0b" stroke-width="2"/>';
      m += '<line x1="' + (x + 3) + '" y1="' + (topY + 9) + '" x2="' + (x + 4) + '" y2="' + (topY + 35) + '" stroke="#f59e0b" stroke-width="2"/>';
    }
    // Lower leaflet
    for (var x2 = 60; x2 < W - 60; x2 += 22) {
      if ((mode === "polar_facilitated" || mode === "active_pump") && x2 > W/2 - 45 && x2 < W/2 + 45) continue;
      m += '<circle cx="' + x2 + '" cy="' + botY + '" r="9" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>';
      m += '<line x1="' + (x2 - 3) + '" y1="' + (botY - 9) + '" x2="' + (x2 - 4) + '" y2="' + (botY - 35) + '" stroke="#f59e0b" stroke-width="2"/>';
      m += '<line x1="' + (x2 + 3) + '" y1="' + (botY - 9) + '" x2="' + (x2 + 4) + '" y2="' + (botY - 35) + '" stroke="#f59e0b" stroke-width="2"/>';
    }

    m += '<text x="70" y="110" fill="#38bdf8" font-size="12">Extracellular Fluid (High Solute [C])</text>';
    m += '<text x="70" y="295" fill="#bae6fd" font-size="12">Intracellular Cytosol (Low Solute [C])</text>';

    var cx = W / 2;

    if (mode === "neutral_simple") {
      // Neutral solute passing directly through fatty acid core
      m += '<text x="' + cx + '" y="90" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">SIMPLE PASSIVE DIFFUSION (Neutral / Lipid-Soluble O2, CO2)</text>';
      for (var s = 0; s < 5; s++) {
        var sx = cx - 80 + s * 40;
        m += '<circle cx="' + sx + '" cy="100" r="7" fill="#10b981"/>';
        m += '<line x1="' + sx + '" y1="115" x2="' + sx + '" y2="280" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,4"/>';
        m += '<polygon points="' + (sx - 4) + ',280 ' + (sx + 4) + ',280 ' + sx + ',290" fill="#10b981"/>';
      }
      m += '<text x="' + cx + '" y="330" fill="#cbd5e1" font-size="12" text-anchor="middle">Moves down concentration gradient directly across hydrophobic lipid core without carriers or ATP</text>';
    } else if (mode === "polar_facilitated") {
      // Transmembrane carrier / channel protein
      m += '<text x="' + cx + '" y="90" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">FACILITATED DIFFUSION (Polar Molecules: Glucose, Amino Acids)</text>';
      // Channel protein halves
      m += '<rect x="' + (cx - 45) + '" y="130" width="35" height="140" rx="8" fill="#10b981" stroke="#059669" stroke-width="2"/>';
      m += '<rect x="' + (cx + 10) + '" y="130" width="35" height="140" rx="8" fill="#10b981" stroke="#059669" stroke-width="2"/>';
      m += '<text x="' + cx + '" y="205" fill="#fff" font-size="10" text-anchor="middle">Pore</text>';
      // Polar molecule traversing channel
      m += '<circle cx="' + cx + '" cy="110" r="9" fill="#ec4899" stroke="#fff" stroke-width="1.5"/>';
      m += '<line x1="' + cx + '" y1="125" x2="' + cx + '" y2="275" stroke="#ec4899" stroke-width="3" stroke-dasharray="6,3"/>';
      m += '<polygon points="' + (cx - 4) + ',275 ' + (cx + 4) + ',275 ' + cx + ',286" fill="#ec4899"/>';
      m += '<text x="' + cx + '" y="330" fill="#cbd5e1" font-size="12" text-anchor="middle">Requires transmembrane channel/carrier protein; moves downhill without consuming ATP</text>';
    } else { // active_pump
      m += '<text x="' + cx + '" y="90" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">ACTIVE TRANSPORT (Against Gradient: Na+/K+ ATPase Pump)</text>';
      // Pump protein
      m += '<rect x="' + (cx - 40) + '" y="130" width="80" height="140" rx="12" fill="#ef4444" stroke="#b91c1c" stroke-width="2.5"/>';
      m += '<text x="' + cx + '" y="195" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Na+/K+ PUMP</text>';
      // ATP consumption
      m += '<circle cx="' + (cx - 70) + '" cy="240" r="14" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>';
      m += '<text x="' + (cx - 70) + '" y="244" fill="#000" font-size="9" font-weight="bold" text-anchor="middle">ATP</text>';
      m += '<path d="M ' + (cx - 55) + ' 240 L ' + (cx - 40) + ' 230" stroke="#eab308" stroke-width="3"/>';
      m += '<text x="' + (cx + 85) + '" y="170" fill="#38bdf8" font-size="11" font-weight="bold">3 Na+ PUMPED OUT</text>';
      m += '<text x="' + (cx + 85) + '" y="235" fill="#fcd34d" font-size="11" font-weight="bold">2 K+ PUMPED IN</text>';
      m += '<text x="' + cx + '" y="330" fill="#cbd5e1" font-size="12" text-anchor="middle">Uphill transport against concentration gradient powered by direct ATP hydrolysis</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Active Modality", mode.replace("_", " ").toUpperCase(), mode === "neutral_simple" ? "#10b981" : (mode === "polar_facilitated" ? "#ec4899" : "#ef4444")) +
      cell("Lipid Bilayer Permeability", mode === "neutral_simple" ? "PERMEABLE (Direct Dissolution)" : "IMPERMEABLE (Requires Protein)", "#38bdf8") +
      cell("Protein Required", mode === "neutral_simple" ? "NO" : "YES (Carrier/Channel/Pump)", mode === "neutral_simple" ? "#94a3b8" : "#10b981") +
      cell("Energy Source", mode === "active_pump" ? "ATP Hydrolysis" : "None (Passive Downhill)", mode === "active_pump" ? "#ef4444" : "#10b981")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 8.6 Answer:</span> ' +
      (mode === "neutral_simple" ? "Neutral solutes cross easily by simple passive diffusion down concentration gradient across the hydrophobic lipid core." :
       (mode === "polar_facilitated" ? "Polar molecules cannot dissolve in hydrophobic tails and cross downhill via facilitated diffusion using channel/carrier proteins." :
        "Polar ions moving against their concentration gradient require energy-dependent active transport pumps utilizing ATP (e.g., Na+/K+ pump)."))
    );
  }

  return { mount: mount, setMode: setMode, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Endomembrane System Flow (endomembraneflow - Exercise 8.12)
// -------------------------------------------------------------------------
window.SIMS.endomembraneflow = (function(){
  var dest = "lysosome"; // "secretory", "lysosome", "vacuole"

  function mount(){
    App.state.maxT = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Rough ER (Synthesis)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Golgi Cisternae (Sorting)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Lysosome (Acid Hydrolases)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Tonoplast Vacuole (Turgor)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.endomembraneflow.setDest(\'lysosome\')">Lysosome Digestion</button>' +
      '<button class="preset-btn" onclick="SIMS.endomembraneflow.setDest(\'vacuole\')">Vacuolar Turgor Storage</button>' +
      '<button class="preset-btn" onclick="SIMS.endomembraneflow.setDest(\'secretory\')">Secretory Exocytosis</button>';
  }

  function setDest(d){
    dest = d;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 8.12: ENDOMEMBRANE SYSTEM & LYSOSOME VS VACUOLE DICHOTOMY</text>';

    // 1. RER
    m += '<path d="M 80 120 C 120 100 120 220 80 200" fill="none" stroke="#38bdf8" stroke-width="18" stroke-linecap="round"/>';
    m += '<path d="M 110 130 C 150 110 150 230 110 210" fill="none" stroke="#38bdf8" stroke-width="18" stroke-linecap="round"/>';
    // Ribosome studs
    for (var rb = 125; rb <= 195; rb += 14) {
      m += '<circle cx="95" cy="' + rb + '" r="3" fill="#fff"/>';
      m += '<circle cx="125" cy="' + rb + '" r="3" fill="#fff"/>';
    }
    m += '<text x="95" y="245" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Rough ER</text>';
    m += '<text x="95" y="260" fill="#bae6fd" font-size="10" text-anchor="middle">Protein Synthesis</text>';

    // Transport Vesicles
    m += '<circle cx="170" cy="165" r="9" fill="rgba(56,189,248,0.5)" stroke="#38bdf8" stroke-width="2"/>';
    m += '<line x1="135" y1="165" x2="200" y2="165" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,3"/>';

    // 2. Golgi Apparatus (Cisternae stack with cis and trans polarity)
    var gx = 250;
    // Cis face (convex)
    m += '<path d="M ' + (gx - 20) + ' 110 Q ' + (gx + 10) + ' 165 ' + (gx - 20) + ' 220" fill="none" stroke="#f59e0b" stroke-width="14" stroke-linecap="round"/>';
    m += '<path d="M ' + gx + ' 105 Q ' + (gx + 30) + ' 165 ' + gx + ' 225" fill="none" stroke="#f59e0b" stroke-width="14" stroke-linecap="round"/>';
    // Trans face (concave)
    m += '<path d="M ' + (gx + 20) + ' 100 Q ' + (gx + 50) + ' 165 ' + (gx + 20) + ' 230" fill="none" stroke="#f59e0b" stroke-width="14" stroke-linecap="round"/>';
    m += '<text x="' + (gx - 25) + '" y="95" fill="#fbbf24" font-size="11">Cis (Forming)</text>';
    m += '<text x="' + (gx + 30) + '" y="95" fill="#f59e0b" font-size="11">Trans (Maturing)</text>';
    m += '<text x="' + gx + '" y="255" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">Golgi Apparatus</text>';
    m += '<text x="' + gx + '" y="270" fill="#fde68a" font-size="10" text-anchor="middle">Glycosylation & Packaging</text>';

    // Arrow to destination
    m += '<line x1="320" y1="165" x2="390" y2="165" stroke="#f59e0b" stroke-width="3"/><polygon points="390,159 390,171 402,165" fill="#f59e0b"/>';

    // 3. Destination Organelle
    var dx = 520;
    var dy = 165;

    if (dest === "lysosome") {
      // Lysosome
      m += '<circle cx="' + dx + '" cy="' + dy + '" r="55" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="3"/>';
      // Hydrolytic enzymes inside
      for (var e = 0; e < 7; e++) {
        var ex = dx - 25 + (e % 3) * 25;
        var ey = dy - 20 + Math.floor(e / 3) * 20;
        m += '<circle cx="' + ex + '" cy="' + ey + '" r="5" fill="#ef4444"/>';
      }
      m += '<text x="' + dx + '" y="' + (dy - 65) + '" fill="#f87171" font-size="14" font-weight="bold" text-anchor="middle">LYSOSOME (Acidic pH ~ 5.0)</text>';
      m += '<text x="' + dx + '" y="' + (dy + 75) + '" fill="#fca5a5" font-size="11" text-anchor="middle">Acid Hydrolases: Proteases, Lipases, Nucleases</text>';
      m += '<text x="' + dx + '" y="' + (dy + 92) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Role: Intracellular Macromolecular Digestion & Autophagy</text>';
    } else if (dest === "vacuole") {
      // Plant Vacuole
      m += '<ellipse cx="' + dx + '" cy="' + dy + '" rx="85" ry="60" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="3.5"/>';
      m += '<text x="' + dx + '" y="' + (dy - 70) + '" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">PLANT CENTRAL VACUOLE</text>';
      m += '<text x="' + dx + '" y="' + (dy - 10) + '" fill="#6ee7b7" font-size="12" font-weight="bold" text-anchor="middle">TONOPLAST MEMBRANE</text>';
      m += '<text x="' + dx + '" y="' + (dy + 15) + '" fill="#a7f3d0" font-size="11" text-anchor="middle">Cell Sap, Ions, Water & Pigments</text>';
      m += '<text x="' + dx + '" y="' + (dy + 80) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Role: Maintains Turgidity & Osmoregulation (Up to 90% Cell Vol)</text>';
    } else {
      // Secretory Exocytosis
      m += '<path d="M 460 70 L 460 260" stroke="#38bdf8" stroke-width="4"/>';
      m += '<circle cx="460" cy="' + dy + '" r="25" fill="rgba(56,189,248,0.4)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="540" y="' + (dy - 30) + '" fill="#38bdf8" font-size="13" font-weight="bold">Secretory Exocytosis</text>';
      m += '<text x="540" y="' + (dy - 10) + '" fill="#bae6fd" font-size="11">Vesicle fuses with Plasma Membrane</text>';
      m += '<text x="540" y="' + (dy + 10) + '" fill="#cbd5e1" font-size="11">Extracellular export of hormones/enzymes</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Vesicle Route", dest === "lysosome" ? "Golgi -> Lysosome" : (dest === "vacuole" ? "Golgi -> Vacuole" : "Golgi -> Exocytosis"), "#38bdf8") +
      cell("Digestive Enzymes", dest === "lysosome" ? "PRESENT (Acid Hydrolases)" : "ABSENT (Sap/Ions)", dest === "lysosome" ? "#ef4444" : "#10b981") +
      cell("Bounding Membrane", dest === "vacuole" ? "TONOPLAST" : "Single Phospholipid Membrane", "#f59e0b") +
      cell("Primary Function", dest === "lysosome" ? "Digestion & Autophagy" : (dest === "vacuole" ? "Turgor & Storage" : "Extracellular Secretion"), "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 8.12 Contrast:</span> ' +
      (dest === "lysosome" ? "Lysosomes are endomembrane digestive compartments packed with acid hydrolases active at pH 5 for enzymatic macromolecular lysis." :
       (dest === "vacuole" ? "Vacuoles are tonoplast-bound non-enzymatic compartments maintaining plant cell turgor and storing sap, water, and metabolic waste." :
        "Secretory vesicles bud from the trans-Golgi to discharge processed glycoproteins and lipids via exocytic fusion."))
    );
  }

  return { mount: mount, setDest: setDest, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Semiautonomous Energy Engines (energytransducersim - Ex 8.3 & 8.7)
// -------------------------------------------------------------------------
window.SIMS.energytransducersim = (function(){
  var org = "mitochondria"; // "mitochondria", "chloroplast"

  function mount(){
    App.state.maxT = 2;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Mitochondria (Cristae & ATP)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Chloroplast (Grana & Stroma)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Circular dsDNA & 70S Ribosomes</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.energytransducersim.setOrganelle(\'mitochondria\')">Mitochondrion (Aerobic ATP)</button>' +
      '<button class="preset-btn" onclick="SIMS.energytransducersim.setOrganelle(\'chloroplast\')">Chloroplast (Photosynthesis)</button>';
  }

  function setOrganelle(o){
    org = o;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 8.7: DOUBLE-MEMBRANE SEMIAUTONOMOUS ENERGY TRANSDUCERS</text>';

    var cx = W / 2 - 50;
    var cy = H / 2 + 5;

    if (org === "mitochondria") {
      // Sausage-shaped Mitochondrion
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="180" ry="100" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="3"/>';
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">Smooth Outer Membrane</text>';

      // Inner membrane with Cristae
      m += '<path d="M ' + (cx - 150) + ' ' + cy + ' ' +
           'C ' + (cx - 120) + ' ' + (cy - 60) + ' ' + (cx - 100) + ' ' + (cy - 20) + ' ' + (cx - 80) + ' ' + (cy - 60) + ' ' +
           'C ' + (cx - 60) + ' ' + cy + ' ' + (cx - 40) + ' ' + (cy - 60) + ' ' + (cx - 20) + ' ' + cy + ' ' +
           'C ' + cx + ' ' + (cy - 60) + ' ' + (cx + 20) + ' ' + (cy - 20) + ' ' + (cx + 40) + ' ' + (cy - 60) + ' ' +
           'C ' + (cx + 60) + ' ' + cy + ' ' + (cx + 80) + ' ' + (cy - 60) + ' ' + (cx + 120) + ' ' + cy + ' ' +
           'C ' + (cx + 80) + ' ' + (cy + 60) + ' ' + (cx + 60) + ' ' + cy + ' ' + (cx + 40) + ' ' + (cy + 60) + ' ' +
           'C ' + (cx + 20) + ' ' + (cy + 20) + ' ' + cx + ' ' + (cy + 60) + ' ' + (cx - 20) + ' ' + cy + ' ' +
           'C ' + (cx - 40) + ' ' + (cy + 60) + ' ' + (cx - 60) + ' ' + cy + ' ' + (cx - 80) + ' ' + (cy + 60) + ' Z" ' +
           'fill="rgba(245,158,11,0.2)" stroke="#d97706" stroke-width="2.5"/>';

      m += '<text x="' + cx + '" y="' + (cy - 20) + '" fill="#fcd34d" font-size="12" font-weight="bold" text-anchor="middle">CRISTAE (Infoldings)</text>';
      m += '<text x="' + cx + '" y="' + cy + '" fill="#cbd5e1" font-size="10" text-anchor="middle">Oxidative Phosphorylation & ATP Synthase</text>';

      // Circular DNA in Matrix
      m += '<circle cx="' + (cx - 70) + '" cy="' + (cy + 20) + '" r="12" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx - 70) + '" y="' + (cy + 42) + '" fill="#38bdf8" font-size="10" text-anchor="middle">Circular dsDNA</text>';

      // 70S Ribosomes
      m += '<circle cx="' + (cx + 60) + '" cy="' + (cy + 20) + '" r="4" fill="#38bdf8"/><circle cx="' + (cx + 72) + '" cy="' + (cy + 16) + '" r="4" fill="#38bdf8"/>';
      m += '<text x="' + (cx + 70) + '" y="' + (cy + 38) + '" fill="#38bdf8" font-size="10" text-anchor="middle">70S Ribosomes</text>';

      // Side Info Panel
      m += '<rect x="' + (W - 200) + '" y="80" width="180" height="220" rx="8" fill="rgba(30,41,59,0.85)" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="' + (W - 110) + '" y="105" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">MITOCHONDRION</text>';
      m += '<text x="' + (W - 190) + '" y="135" fill="#fcd34d" font-size="11">Form: Sausage / Cylinder</text>';
      m += '<text x="' + (W - 190) + '" y="155" fill="#cbd5e1" font-size="11">Diameter: 0.2–1.0 µm</text>';
      m += '<text x="' + (W - 190) + '" y="175" fill="#cbd5e1" font-size="11">Length: 1.0–4.1 µm</text>';
      m += '<text x="' + (W - 190) + '" y="200" fill="#fcd34d" font-size="11">Function: Cellular Respiration</text>';
      m += '<text x="' + (W - 190) + '" y="220" fill="#cbd5e1" font-size="11">Krebs Cycle in Matrix</text>';
      m += '<text x="' + (W - 190) + '" y="240" fill="#cbd5e1" font-size="11">ATP Generation on Cristae</text>';
      m += '<text x="' + (W - 190) + '" y="265" fill="#38bdf8" font-size="11">Binary Fission Division</text>';
    } else {
      // Chloroplast
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="180" ry="100" fill="rgba(16,185,129,0.12)" stroke="#10b981" stroke-width="3"/>';
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Chloroplast Double Envelope</text>';

      // Grana stacks of Thylakoids
      for (var g = -1; g <= 1; g++) {
        var gx2 = cx + g * 85;
        for (var t = 0; t < 5; t++) {
          var ty = cy - 40 + t * 18;
          m += '<ellipse cx="' + gx2 + '" cy="' + ty + '" rx="26" ry="6" fill="#047857" stroke="#10b981" stroke-width="1.5"/>';
        }
        m += '<text x="' + gx2 + '" y="' + (cy + 65) + '" fill="#6ee7b7" font-size="11" font-weight="bold" text-anchor="middle">Granum</text>';
      }
      // Stroma lamellae interconnecting grana
      m += '<line x1="' + (cx - 60) + '" y1="' + cy + '" x2="' + (cx + 60) + '" y2="' + cy + '" stroke="#10b981" stroke-width="3"/>';
      m += '<text x="' + cx + '" y="' + (cy - 10) + '" fill="#a7f3d0" font-size="10" text-anchor="middle">Stroma Lamella</text>';

      // Stroma label
      m += '<text x="' + (cx - 110) + '" y="' + (cy - 60) + '" fill="#a7f3d0" font-size="12">Stroma (Calvin Cycle / RuBisCO)</text>';

      // Circular DNA in Stroma
      m += '<circle cx="' + (cx + 90) + '" cy="' + (cy - 60) + '" r="11" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx + 90) + '" y="' + (cy - 40) + '" fill="#38bdf8" font-size="10" text-anchor="middle">Circular DNA</text>';

      // Side Info Panel
      m += '<rect x="' + (W - 200) + '" y="80" width="180" height="220" rx="8" fill="rgba(30,41,59,0.85)" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="' + (W - 110) + '" y="105" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">CHLOROPLAST</text>';
      m += '<text x="' + (W - 190) + '" y="135" fill="#6ee7b7" font-size="11">Form: Lens / Discoid</text>';
      m += '<text x="' + (W - 190) + '" y="155" fill="#cbd5e1" font-size="11">Length: 5–10 µm</text>';
      m += '<text x="' + (W - 190) + '" y="175" fill="#cbd5e1" font-size="11">Width: 2–4 µm</text>';
      m += '<text x="' + (W - 190) + '" y="200" fill="#6ee7b7" font-size="11">Function: Photosynthesis</text>';
      m += '<text x="' + (W - 190) + '" y="220" fill="#cbd5e1" font-size="11">Light Rxns in Thylakoids</text>';
      m += '<text x="' + (W - 190) + '" y="240" fill="#cbd5e1" font-size="11">Dark Rxns in Stroma</text>';
      m += '<text x="' + (W - 190) + '" y="265" fill="#38bdf8" font-size="11">Chlorophyll Pigments</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Energy Organelle", org.toUpperCase(), org === "mitochondria" ? "#f59e0b" : "#10b981") +
      cell("Inner Membrane Specialization", org === "mitochondria" ? "CRISTAE Infoldings (Exercise 8.3a)" : "THYLAKOIDS / GRANA (Exercise 8.3c)", "#38bdf8") +
      cell("Autonomous Genome", "Circular dsDNA + 70S Ribosomes", "#10b981") +
      cell("Reproduction Mode", "Binary Fission", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 8.7 Solution:</span> ' +
      (org === "mitochondria" ? "Mitochondria are double-membrane powerhouses whose cristae carry out oxidative phosphorylation and ATP generation." :
       "Chloroplasts are double-membrane transducers whose thylakoid grana trap light and whose stroma fixes carbon dioxide into carbohydrates.")
    );
  }

  return { mount: mount, setOrganelle: setOrganelle, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: 9+2 Axoneme vs 9+0 Centriolar Cartwheel (axonemecentriolesim - Ex 8.13)
// -------------------------------------------------------------------------
window.SIMS.axonemecentriolesim = (function(){
  var view = "axoneme"; // "axoneme", "centriole"

  function mount(){
    App.state.maxT = 2;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>9 Peripheral Doublets / Triplets</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Radial Spokes</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Central Sheath / Hub</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Dynein Arms / A-C Linkers</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.axonemecentriolesim.setView(\'axoneme\')">9 + 2 Ciliary Axoneme</button>' +
      '<button class="preset-btn" onclick="SIMS.axonemecentriolesim.setView(\'centriole\')">9 + 0 Centriolar Cartwheel</button>';
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
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 8.13: 9+2 AXONEME (CILIA/FLAGELLA) VS 9+0 CARTWHEEL (CENTRIOLE)</text>';

    var cx = W / 2 - 40;
    var cy = H / 2 + 10;
    var radius = 120;

    if (view === "axoneme") {
      // 9+2 pattern
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="145" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4"/>';
      m += '<text x="' + cx + '" y="' + (cy - 150) + '" fill="#38bdf8" font-size="11" text-anchor="middle">Plasma Membrane Covering</text>';

      // Central Sheath & 2 Central Singlets
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="28" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="2"/>';
      m += '<circle cx="' + (cx - 9) + '" cy="' + cy + '" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1"/>';
      m += '<circle cx="' + (cx + 9) + '" cy="' + cy + '" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1"/>';
      m += '<line x1="' + (cx - 2) + '" y1="' + cy + '" x2="' + (cx + 2) + '" y2="' + cy + '" stroke="#fff" stroke-width="1.5"/>';
      m += '<text x="' + cx + '" y="' + (cy + 42) + '" fill="#fcd34d" font-size="11" text-anchor="middle">Central Sheath + 2 Singlets</text>';

      // 9 Peripheral Doublets
      for (var i = 0; i < 9; i++) {
        var angle = (i * 40 - 90) * Math.PI / 180;
        var dx = cx + radius * Math.cos(angle);
        var dy = cy + radius * Math.sin(angle);

        // Radial spoke to central sheath
        var sx = cx + 28 * Math.cos(angle);
        var sy = cy + 28 * Math.sin(angle);
        m += '<line x1="' + sx + '" y1="' + sy + '" x2="' + dx + '" y2="' + dy + '" stroke="#ec4899" stroke-width="2"/>';

        // Doublet (A tubule and B tubule)
        m += '<circle cx="' + (dx - 4) + '" cy="' + (dy - 4) + '" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>';
        m += '<circle cx="' + (dx + 4) + '" cy="' + (dy + 4) + '" r="7" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>';

        // Dynein arms
        m += '<line x1="' + (dx - 4) + '" y1="' + (dy - 4) + '" x2="' + (dx - 12) + '" y2="' + (dy - 10) + '" stroke="#10b981" stroke-width="2.5"/>';
      }

      // Side Info Panel
      m += '<rect x="' + (W - 200) + '" y="80" width="180" height="220" rx="8" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="' + (W - 110) + '" y="105" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">9 + 2 AXONEME</text>';
      m += '<text x="' + (W - 190) + '" y="135" fill="#7dd3fc" font-size="11">Location: Cilia & Flagella</text>';
      m += '<text x="' + (W - 190) + '" y="155" fill="#cbd5e1" font-size="11">9 Peripheral Doublets</text>';
      m += '<text x="' + (W - 190) + '" y="175" fill="#fcd34d" font-size="11">2 Central Singlets</text>';
      m += '<text x="' + (W - 190) + '" y="195" fill="#ec4899" font-size="11">9 Radial Spokes</text>';
      m += '<text x="' + (W - 190) + '" y="215" fill="#10b981" font-size="11">Dynein Motor Arms</text>';
      m += '<text x="' + (W - 190) + '" y="240" fill="#cbd5e1" font-size="11">Sliding doublet bending</text>';
      m += '<text x="' + (W - 190) + '" y="265" fill="#fcd34d" font-size="11">Arises from Basal Body</text>';
    } else {
      // 9+0 Centriolar Cartwheel pattern
      // Central Hub (proteinaceous rod, 0 microtubules)
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="16" fill="#f59e0b" stroke="#fff" stroke-width="2"/>';
      m += '<text x="' + cx + '" y="' + (cy + 30) + '" fill="#fcd34d" font-size="11" font-weight="bold" text-anchor="middle">Central Hub (0 MTs)</text>';

      // 9 Peripheral Triplets
      for (var j = 0; j < 9; j++) {
        var angle2 = (j * 40 - 90) * Math.PI / 180;
        var tx = cx + radius * Math.cos(angle2);
        var ty = cy + radius * Math.sin(angle2);

        // Radial spoke from hub to A tubule
        var hx = cx + 16 * Math.cos(angle2);
        var hy = cy + 16 * Math.sin(angle2);
        m += '<line x1="' + hx + '" y1="' + hy + '" x2="' + tx + '" y2="' + ty + '" stroke="#ec4899" stroke-width="2.5"/>';

        // Triplet (A, B, C tubules at 40 deg tilt)
        m += '<circle cx="' + tx + '" cy="' + ty + '" r="6" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>';
        m += '<circle cx="' + (tx + 9 * Math.cos(angle2 + 0.5)) + '" cy="' + (ty + 9 * Math.sin(angle2 + 0.5)) + '" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>';
        m += '<circle cx="' + (tx + 18 * Math.cos(angle2 + 0.5)) + '" cy="' + (ty + 18 * Math.sin(angle2 + 0.5)) + '" r="6" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>';
      }

      // Side Info Panel
      m += '<rect x="' + (W - 200) + '" y="80" width="180" height="220" rx="8" fill="rgba(30,41,59,0.85)" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="' + (W - 110) + '" y="105" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">9 + 0 CENTRIOLE</text>';
      m += '<text x="' + (W - 190) + '" y="135" fill="#6ee7b7" font-size="11">Location: Centrosome</text>';
      m += '<text x="' + (W - 190) + '" y="155" fill="#cbd5e1" font-size="11">9 Peripheral Triplets</text>';
      m += '<text x="' + (W - 190) + '" y="175" fill="#fcd34d" font-size="11">0 Central Tubules (Hub)</text>';
      m += '<text x="' + (W - 190) + '" y="195" fill="#ec4899" font-size="11">9 Radial Spokes</text>';
      m += '<text x="' + (W - 190) + '" y="215" fill="#cbd5e1" font-size="11">A-C Linkers connecting</text>';
      m += '<text x="' + (W - 190) + '" y="240" fill="#fcd34d" font-size="11">Cartwheel appearance</text>';
      m += '<text x="' + (W - 190) + '" y="265" fill="#38bdf8" font-size="11">Forms Spindle Apparatus</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Ultrastructure", view === "axoneme" ? "9 + 2 AXONEME (Cilia/Flagella)" : "9 + 0 CARTWHEEL (Centriole)", view === "axoneme" ? "#38bdf8" : "#10b981") +
      cell("Peripheral Subunit", view === "axoneme" ? "9 Doublets" : "9 Triplets (A, B, C)", "#f59e0b") +
      cell("Central Architecture", view === "axoneme" ? "2 Singlets in Sheath" : "Proteinaceous Hub (0 MTs)", "#ec4899") +
      cell("Cell Division Role", view === "centriole" ? "Spindle MTOC in Animals" : "Ciliary Locomotion", "#10b981")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 8.13 Solution:</span> ' +
      (view === "axoneme" ? "The ciliary/flagellar axoneme exhibits a 9+2 doublet array with dynein arms generating bending locomotion." :
       "The centriole exhibits a 9+0 triplet cartwheel pattern that nucleates mitotic spindle fibers and basal bodies.")
    );
  }

  return { mount: mount, setView: setView, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Chromosome Centromere Classifier (chromosomekaryosim - Ex 8.14)
// -------------------------------------------------------------------------
window.SIMS.chromosomekaryosim = (function(){
  var cType = "metacentric"; // "metacentric", "submetacentric", "acrocentric", "telocentric"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Metacentric (V-shape)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Sub-metacentric (L-shape)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Acrocentric (J-shape)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Telocentric (I-shape)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.chromosomekaryosim.setType(\'metacentric\')">1. Metacentric</button>' +
      '<button class="preset-btn" onclick="SIMS.chromosomekaryosim.setType(\'submetacentric\')">2. Sub-metacentric</button>' +
      '<button class="preset-btn" onclick="SIMS.chromosomekaryosim.setType(\'acrocentric\')">3. Acrocentric (Satellite)</button>' +
      '<button class="preset-btn" onclick="SIMS.chromosomekaryosim.setType(\'telocentric\')">4. Telocentric</button>';
  }

  function setType(t){
    cType = t;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 8.14: CHROMOSOME TAXONOMY BY CENTROMERE POSITION</text>';

    var cx = W / 2 - 50;
    var topY = 80;
    var botY = 320;
    var totalLen = botY - topY; // 240 px

    var centY;
    var anaphaseShape;
    var ratio;

    if (cType === "metacentric") {
      centY = topY + totalLen / 2; // middle: 200
      anaphaseShape = "V-Shaped";
      ratio = "1.0 (Equal Arms: p = q)";
    } else if (cType === "submetacentric") {
      centY = topY + totalLen * 0.35; // sub-median: ~164
      anaphaseShape = "L-Shaped";
      ratio = "1.8 (Slightly unequal arms)";
    } else if (cType === "acrocentric") {
      centY = topY + totalLen * 0.15; // near end: ~116
      anaphaseShape = "J-Shaped";
      ratio = "5.6 (One tiny, one very long arm)";
    } else { // telocentric
      centY = topY; // terminal: 80
      anaphaseShape = "I-Shaped (Rod-like)";
      ratio = "Infinite (Terminal Centromere)";
    }

    // Draw Sister Chromatids
    // Left Chromatid
    if (centY > topY) {
      m += '<line x1="' + (cx - 15) + '" y1="' + topY + '" x2="' + (cx - 15) + '" y2="' + (centY - 10) + '" stroke="#38bdf8" stroke-width="12" stroke-linecap="round"/>';
    }
    m += '<line x1="' + (cx - 15) + '" y1="' + (centY + 10) + '" x2="' + (cx - 15) + '" y2="' + botY + '" stroke="#38bdf8" stroke-width="12" stroke-linecap="round"/>';

    // Right Chromatid
    if (centY > topY) {
      m += '<line x1="' + (cx + 15) + '" y1="' + topY + '" x2="' + (cx + 15) + '" y2="' + (centY - 10) + '" stroke="#0284c7" stroke-width="12" stroke-linecap="round"/>';
    }
    m += '<line x1="' + (cx + 15) + '" y1="' + (centY + 10) + '" x2="' + (cx + 15) + '" y2="' + botY + '" stroke="#0284c7" stroke-width="12" stroke-linecap="round"/>';

    // Centromere (Primary Constriction)
    m += '<circle cx="' + cx + '" cy="' + centY + '" r="12" fill="#ef4444" stroke="#fff" stroke-width="2"/>';
    m += '<text x="' + (cx - 85) + '" y="' + (centY + 4) + '" fill="#ef4444" font-size="11" font-weight="bold">Centromere</text>';

    // Disc-shaped Kinetochores
    m += '<rect x="' + (cx - 28) + '" y="' + (centY - 8) + '" width="6" height="16" rx="3" fill="#f59e0b"/>';
    m += '<rect x="' + (cx + 22) + '" y="' + (centY - 8) + '" width="6" height="16" rx="3" fill="#f59e0b"/>';
    m += '<text x="' + (cx + 35) + '" y="' + (centY + 4) + '" fill="#fbbf24" font-size="11">Kinetochore</text>';

    // Satellite (if acrocentric)
    if (cType === "acrocentric") {
      m += '<circle cx="' + cx + '" cy="' + (topY - 18) + '" r="8" fill="#ec4899" stroke="#fff" stroke-width="1.5"/>';
      m += '<line x1="' + cx + '" y1="' + (topY - 10) + '" x2="' + cx + '" y2="' + topY + '" stroke="#94a3b8" stroke-width="2" stroke-dasharray="2,2"/>';
      m += '<text x="' + (cx + 25) + '" y="' + (topY - 14) + '" fill="#ec4899" font-size="11" font-weight="bold">Satellite (SAT)</text>';
      m += '<text x="' + (cx + 25) + '" y="' + (topY - 2) + '" fill="#94a3b8" font-size="10">Secondary Constriction</text>';
    }

    // Side Info Panel
    m += '<rect x="' + (W - 220) + '" y="80" width="200" height="230" rx="8" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (W - 120) + '" y="105" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">' + cType.toUpperCase() + '</text>';
    m += '<text x="' + (W - 205) + '" y="135" fill="#fcd34d" font-size="11">Centromere Location:</text>';
    m += '<text x="' + (W - 205) + '" y="155" fill="#cbd5e1" font-size="11">' + (cType === "metacentric" ? "Median (Middle)" : (cType === "submetacentric" ? "Sub-median (Off-center)" : (cType === "acrocentric" ? "Sub-terminal (Near end)" : "Terminal (At the tip)"))) + '</text>';
    m += '<text x="' + (W - 205) + '" y="180" fill="#fcd34d" font-size="11">Arm Ratio:</text>';
    m += '<text x="' + (W - 205) + '" y="200" fill="#cbd5e1" font-size="11">' + ratio + '</text>';
    m += '<text x="' + (W - 205) + '" y="225" fill="#fcd34d" font-size="11">Anaphase Shape:</text>';
    m += '<text x="' + (W - 205) + '" y="245" fill="#10b981" font-size="12" font-weight="bold">' + anaphaseShape + '</text>';
    m += '<text x="' + (W - 205) + '" y="275" fill="#ec4899" font-size="11">' + (cType === "acrocentric" ? "Possesses Satellite Knob" : (cType === "telocentric" ? "Not found in humans" : "Standard morphology")) + '</text>';

    svg.innerHTML = m;

    readout(
      cell("Chromosome Type", cType.toUpperCase(), "#38bdf8") +
      cell("Centromere Position", cType === "metacentric" ? "MEDIAN" : (cType === "submetacentric" ? "SUB-MEDIAN" : (cType === "acrocentric" ? "SUB-TERMINAL" : "TERMINAL")), "#10b981") +
      cell("Anaphase Profile", anaphaseShape, "#ec4899") +
      cell("Arm Proportion", ratio, "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 8.14 Taxonomy Rule:</span> ' +
      (cType === "metacentric" ? "Metacentric chromosomes have a middle centromere forming two equal arms, appearing V-shaped in anaphase." :
       (cType === "submetacentric" ? "Sub-metacentric chromosomes have centromeres slightly off-center, producing one short and one long arm (L-shaped)." :
        (cType === "acrocentric" ? "Acrocentric chromosomes have centromeres close to the end forming one tiny stubby arm (often bearing a satellite) and one long arm (J-shaped)." :
         "Telocentric chromosomes have a terminal centromere with a single long arm (I-shaped; absent in humans).")))
    );
  }

  return { mount: mount, setType: setType, draw: draw };
})();
