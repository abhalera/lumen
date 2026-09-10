// kebo110 interactive simulations: Cell Cycle and Cell Division
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
// 1. SIMULATION 1: 24-Hour Cell Cycle Clock & G0 Phase (cellcyclerotator)
// -------------------------------------------------------------------------
window.SIMS.cellcyclerotator = (function(){
  var currentPhase = "G1"; // "G1", "S", "G2", "M", "G0"

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>G1 Phase (~10h)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#818cf8;"></span><span>S Phase (~8h, DNA 2C->4C)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>G2 Phase (~4h, Tubulin)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>M Phase (~1h, Division)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>G0 Quiescent Stage</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.cellcyclerotator.setPhase(\'G1\')">1. G1 Phase (Growth)</button>' +
      '<button class="preset-btn" onclick="SIMS.cellcyclerotator.setPhase(\'S\')">2. S Phase (Replication)</button>' +
      '<button class="preset-btn" onclick="SIMS.cellcyclerotator.setPhase(\'G2\')">3. G2 Phase (Mitosis Prep)</button>' +
      '<button class="preset-btn" onclick="SIMS.cellcyclerotator.setPhase(\'M\')">4. M Phase (~1h Mitosis)</button>' +
      '<button class="preset-btn" onclick="SIMS.cellcyclerotator.setPhase(\'G0\')">5. G0 Quiescent Stage</button>';
  }

  function setPhase(p){
    currentPhase = p;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">HUMAN 24-HOUR CELL CYCLE CLOCK & G0 CHECKPOINT</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;
    var R = 110;
    var r = 60;

    // Outer donut clock
    // G1: 0 to 150 deg (10 hours)
    // S: 150 to 270 deg (8 hours)
    // G2: 270 to 330 deg (4 hours)
    // M: 330 to 360 deg (1 hour)
    function arcD(startA, endA, ro, ri) {
      var sRad = (startA - 90) * Math.PI / 180;
      var eRad = (endA - 90) * Math.PI / 180;
      var x1 = cx + ro * Math.cos(sRad), y1 = cy + ro * Math.sin(sRad);
      var x2 = cx + ro * Math.cos(eRad), y2 = cy + ro * Math.sin(eRad);
      var x3 = cx + ri * Math.cos(eRad), y3 = cy + ri * Math.sin(eRad);
      var x4 = cx + ri * Math.cos(sRad), y4 = cy + ri * Math.sin(sRad);
      var large = (endA - startA) > 180 ? 1 : 0;
      return 'M ' + x1 + ' ' + y1 + ' A ' + ro + ' ' + ro + ' 0 ' + large + ' 1 ' + x2 + ' ' + y2 +
             ' L ' + x3 + ' ' + y3 + ' A ' + ri + ' ' + ri + ' 0 ' + large + ' 0 ' + x4 + ' ' + y4 + ' Z';
    }

    var colG1 = (currentPhase === "G1") ? "#38bdf8" : "#0284c7";
    var colS  = (currentPhase === "S")  ? "#a5b4fc" : "#4f46e5";
    var colG2 = (currentPhase === "G2") ? "#fcd34d" : "#d97706";
    var colM  = (currentPhase === "M")  ? "#f472b6" : "#db2777";

    m += '<path d="' + arcD(0, 150, R, r) + '" fill="' + colG1 + '" stroke="#0f172a" stroke-width="2" style="cursor:pointer;" onclick="SIMS.cellcyclerotator.setPhase(\'G1\')"/>';
    m += '<path d="' + arcD(150, 270, R, r) + '" fill="' + colS + '" stroke="#0f172a" stroke-width="2" style="cursor:pointer;" onclick="SIMS.cellcyclerotator.setPhase(\'S\')"/>';
    m += '<path d="' + arcD(270, 330, R, r) + '" fill="' + colG2 + '" stroke="#0f172a" stroke-width="2" style="cursor:pointer;" onclick="SIMS.cellcyclerotator.setPhase(\'G2\')"/>';
    m += '<path d="' + arcD(330, 360, R, r) + '" fill="' + colM + '" stroke="#0f172a" stroke-width="2" style="cursor:pointer;" onclick="SIMS.cellcyclerotator.setPhase(\'M\')"/>';

    // Phase labels on arcs
    m += '<text x="' + (cx + 80) + '" y="' + (cy + 25) + '" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">G1 (Gap 1)</text>';
    m += '<text x="' + (cx - 70) + '" y="' + (cy + 45) + '" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">S (Synthesis)</text>';
    m += '<text x="' + (cx - 60) + '" y="' + (cy - 65) + '" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">G2</text>';
    m += '<text x="' + (cx + 10) + '" y="' + (cy - 120) + '" fill="#ec4899" font-size="12" font-weight="bold" text-anchor="middle">M Phase</text>';

    // Center circle
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 8) + '" fill="#1e293b" stroke="#334155" stroke-width="2"/>';
    m += '<text x="' + cx + '" y="' + (cy - 10) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">INTERPHASE</text>';
    m += '<text x="' + cx + '" y="' + (cy + 8) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">&gt; 95% Duration</text>';
    m += '<text x="' + cx + '" y="' + (cy + 24) + '" fill="#94a3b8" font-size="10" text-anchor="middle">(23 of 24 hrs)</text>';

    // G0 Exit branch
    var g0Fill = (currentPhase === "G0") ? "#10b981" : "#047857";
    m += '<path d="M ' + (cx + 100) + ' ' + (cy + 60) + ' Q ' + (cx + 140) + ' ' + (cy + 100) + ' ' + (cx + 180) + ' ' + (cy + 100) + '" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="4,2"/>';
    m += '<rect x="' + (cx + 180) + '" y="' + (cy + 75) + '" width="110" height="50" rx="8" fill="' + g0Fill + '" stroke="#fff" stroke-width="1.5" style="cursor:pointer;" onclick="SIMS.cellcyclerotator.setPhase(\'G0\')"/>';
    m += '<text x="' + (cx + 235) + '" y="' + (cy + 96) + '" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">G0 PHASE</text>';
    m += '<text x="' + (cx + 235) + '" y="' + (cy + 112) + '" fill="#d1fae5" font-size="9" text-anchor="middle">(Quiescent Exit)</text>';

    // Right details panel
    var px = W - 185, py = 50;
    m += '<rect x="' + px + '" y="' + py + '" width="175" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (px + 87) + '" y="' + (py + 24) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">PHASE PROFILE</text>';

    if (currentPhase === "G1") {
      m += '<text x="' + (px + 12) + '" y="' + (py + 55) + '" fill="#fcd34d" font-size="11" font-weight="bold">Phase: Gap 1 (G1)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 75) + '" fill="#cbd5e1" font-size="10">Duration: ~8-10 Hours</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 100) + '" fill="#38bdf8" font-size="10" font-weight="bold">Key Events:</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 118) + '" fill="#e2e8f0" font-size="9.5">• Metabolically active</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 135) + '" fill="#e2e8f0" font-size="9.5">• Continuous cell growth</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 152) + '" fill="#e2e8f0" font-size="9.5">• Synthesizes RNA & proteins</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 175) + '" fill="#fcd34d" font-size="10" font-weight="bold">Genomic Status:</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 195) + '" fill="#86efac" font-size="10">• Ploidy: 2n (46 chr)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 215) + '" fill="#86efac" font-size="10">• DNA Amount: 2C</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 240) + '" fill="#94a3b8" font-size="9.5">• Centrosomes: 1 pair</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 265) + '" fill="#38bdf8" font-size="9.5">• Checkpoint: G1/S restriction</text>';
    } else if (currentPhase === "S") {
      m += '<text x="' + (px + 12) + '" y="' + (py + 55) + '" fill="#818cf8" font-size="11" font-weight="bold">Phase: Synthesis (S)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 75) + '" fill="#cbd5e1" font-size="10">Duration: ~6-8 Hours</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 100) + '" fill="#38bdf8" font-size="10" font-weight="bold">Key Events:</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 118) + '" fill="#e2e8f0" font-size="9.5">• DNA replication in nucleus</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 135) + '" fill="#e2e8f0" font-size="9.5">• Centrosome duplicates in cyto</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 152) + '" fill="#e2e8f0" font-size="9.5">• Histone protein synthesis</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 175) + '" fill="#fcd34d" font-size="10" font-weight="bold">Genomic Status:</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 195) + '" fill="#f87171" font-size="10" font-weight="bold">• Ploidy: STILL 2n (46!)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 215) + '" fill="#4ade80" font-size="10" font-weight="bold">• DNA Doubles: 2C -> 4C</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 240) + '" fill="#94a3b8" font-size="9.5">• Centrosomes: 2 pairs</text>';
    } else if (currentPhase === "G2") {
      m += '<text x="' + (px + 12) + '" y="' + (py + 55) + '" fill="#f59e0b" font-size="11" font-weight="bold">Phase: Gap 2 (G2)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 75) + '" fill="#cbd5e1" font-size="10">Duration: ~4 Hours</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 100) + '" fill="#38bdf8" font-size="10" font-weight="bold">Key Events:</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 118) + '" fill="#e2e8f0" font-size="9.5">• Tubulin protein synthesis</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 135) + '" fill="#e2e8f0" font-size="9.5">• Preparation for mitosis</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 152) + '" fill="#e2e8f0" font-size="9.5">• ATP stockpiling & growth</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 175) + '" fill="#fcd34d" font-size="10" font-weight="bold">Genomic Status:</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 195) + '" fill="#86efac" font-size="10">• Ploidy: 2n (46 chr)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 215) + '" fill="#86efac" font-size="10">• DNA Amount: 4C</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 240) + '" fill="#94a3b8" font-size="9.5">• Checkpoint: G2/M DNA check</text>';
    } else if (currentPhase === "M") {
      m += '<text x="' + (px + 12) + '" y="' + (py + 55) + '" fill="#ec4899" font-size="11" font-weight="bold">Phase: Mitotic (M)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 75) + '" fill="#cbd5e1" font-size="10">Duration: ~1 Hour (<5%)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 100) + '" fill="#38bdf8" font-size="10" font-weight="bold">Key Events:</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 118) + '" fill="#e2e8f0" font-size="9.5">• Karyokinesis (P-M-A-T)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 135) + '" fill="#e2e8f0" font-size="9.5">• Spindle chromosome pull</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 152) + '" fill="#e2e8f0" font-size="9.5">• Cytokinesis (division)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 175) + '" fill="#fcd34d" font-size="10" font-weight="bold">Genomic Status:</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 195) + '" fill="#86efac" font-size="10">• Anaphase transient 4n</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 215) + '" fill="#86efac" font-size="10">• Daughters: 2n, 2C each</text>';
    } else if (currentPhase === "G0") {
      m += '<text x="' + (px + 12) + '" y="' + (py + 55) + '" fill="#10b981" font-size="11" font-weight="bold">Phase: Quiescent (G0)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 75) + '" fill="#cbd5e1" font-size="10">State: Suspended cycle</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 100) + '" fill="#38bdf8" font-size="10" font-weight="bold">Key Events:</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 118) + '" fill="#e2e8f0" font-size="9.5">• Exit from G1 phase</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 135) + '" fill="#4ade80" font-size="9.5">• METABOLICALLY ACTIVE</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 152) + '" fill="#f87171" font-size="9.5">• No proliferation</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 175) + '" fill="#fcd34d" font-size="10" font-weight="bold">Examples (NCERT):</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 195) + '" fill="#cbd5e1" font-size="9.5">• Heart muscle cells</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 215) + '" fill="#cbd5e1" font-size="9.5">• Nerve cells (neurons)</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 235) + '" fill="#cbd5e1" font-size="9.5">• Cells divide only to</text>';
      m += '<text x="' + (px + 12) + '" y="' + (py + 250) + '" fill="#cbd5e1" font-size="9.5">  replace injury/loss</text>';
    }

    svg.innerHTML = m;

    var dnaAmt = (currentPhase === "S" ? "2C -> 4C (Doubling)" : (currentPhase === "G2" || currentPhase === "M" ? "4C" : "2C"));
    var chrNum = "2n = 46 (Constant)";
    var centros = (currentPhase === "G1" || currentPhase === "G0") ? "1 Centrosome" : "2 Centrosomes (Duplicated)";

    readout(
      cell("Selected Phase", currentPhase === "G0" ? "G0 Quiescent" : currentPhase + " Phase", currentPhase === "G0" ? "#10b981" : "#38bdf8") +
      cell("Duration in 24h", currentPhase === "M" ? "~1 Hour (~4%)" : (currentPhase === "G0" ? "Indefinite" : "> 95% total Interphase"), "#fcd34d") +
      cell("DNA Content", dnaAmt, currentPhase === "S" ? "#818cf8" : "#38bdf8") +
      cell("Chromosome Count", chrNum, "#10b981") +
      cell("Centrosome State", centros, "#ec4899")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">NCERT 10.1 & 10.2 Concept Rule:</span> ' +
      (currentPhase === "G0" ?
       "Cells in the G0 quiescent stage exit the G1 phase and do not proliferate, yet they remain fully metabolically active, performing specialized tissue functions (e.g. heart cells) unless stimulated to replace lost or injured cells." :
       (currentPhase === "S" ?
        "In the S phase, DNA replication doubles the genomic content from 2C to 4C, but the chromosome number remains strictly 2n! Centrioles also duplicate in the cytoplasm." :
        "Human cells divide once every 24 hours, of which the actual M phase lasts barely ~1 hour (<5%), while interphase occupies over 95% of the entire cycle."))
    );
  }

  return { mount: mount, setPhase: setPhase, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: 4-Stage Mitotic Karyokinesis (mitosisstagesim)
// -------------------------------------------------------------------------
window.SIMS.mitosisstagesim = (function(){
  var stage = "metaphase"; // "prophase", "metaphase", "anaphase", "telophase"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Centrosome / Aster</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Spindle Fibres</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Chromosomes (Centromere + Kinetochore)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Equatorial Metaphase Plate</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.mitosisstagesim.setStage(\'prophase\')">1. Prophase (Condensation)</button>' +
      '<button class="preset-btn" onclick="SIMS.mitosisstagesim.setStage(\'metaphase\')">2. Metaphase (Equator Align)</button>' +
      '<button class="preset-btn" onclick="SIMS.mitosisstagesim.setStage(\'anaphase\')">3. Anaphase (Centromere Split)</button>' +
      '<button class="preset-btn" onclick="SIMS.mitosisstagesim.setStage(\'telophase\')">4. Telophase (Reconstruction)</button>';
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
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">MITOTIC KARYOKINESIS: 4 MORPHOLOGICAL STAGES</text>';

    var cx = W / 2 - 60;
    var cy = H / 2 + 15;
    var cellW = 320, cellH = 220;

    // Cell boundary
    if (stage === "telophase") {
      // Pinched dumbbell shape
      m += '<path d="M ' + (cx - 150) + ' ' + (cy - 90) + ' C ' + (cx - 40) + ' ' + (cy - 90) + ', ' + (cx - 20) + ' ' + (cy - 30) + ', ' + cx + ' ' + (cy - 25) +
           ' C ' + (cx + 20) + ' ' + (cy - 30) + ', ' + (cx + 40) + ' ' + (cy - 90) + ', ' + (cx + 150) + ' ' + (cy - 90) +
           ' C ' + (cx + 180) + ' ' + (cy - 40) + ', ' + (cx + 180) + ' ' + (cy + 40) + ', ' + (cx + 150) + ' ' + (cy + 90) +
           ' C ' + (cx + 40) + ' ' + (cy + 90) + ', ' + (cx + 20) + ' ' + (cy + 30) + ', ' + cx + ' ' + (cy + 25) +
           ' C ' + (cx - 20) + ' ' + (cy + 30) + ', ' + (cx - 40) + ' ' + (cy + 90) + ', ' + (cx - 150) + ' ' + (cy + 90) +
           ' C ' + (cx - 180) + ' ' + (cy + 40) + ', ' + (cx - 180) + ' ' + (cy - 40) + ', ' + (cx - 150) + ' ' + (cy - 90) + ' Z" ' +
           ' fill="rgba(30,41,59,0.5)" stroke="#38bdf8" stroke-width="2.5"/>';
    } else {
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (cellW/2) + '" ry="' + (cellH/2) + '" fill="rgba(30,41,59,0.4)" stroke="#38bdf8" stroke-width="2"/>';
    }

    // Poles
    var leftPoleX = cx - 120, rightPoleX = cx + 120;
    var poleY = cy;

    if (stage === "prophase") {
      // Nuclear membrane fragmenting
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="65" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8,6"/>';
      m += '<text x="' + cx + '" y="' + (cy - 75) + '" fill="#94a3b8" font-size="11" text-anchor="middle">Disintegrating Nuclear Envelope</text>';

      // Centrosomes moving to opposite poles
      m += '<circle cx="' + (cx - 80) + '" cy="' + (cy - 50) + '" r="6" fill="#38bdf8"/>';
      m += '<circle cx="' + (cx + 80) + '" cy="' + (cy + 50) + '" r="6" fill="#38bdf8"/>';
      m += '<text x="' + (cx - 80) + '" y="' + (cy - 62) + '" fill="#38bdf8" font-size="10" text-anchor="middle">Aster</text>';

      // Chromosomes condensing into sister chromatids attached at centromere
      function drawChr(x, y, rot, col) {
        m += '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ')">';
        m += '<line x1="-16" y1="-16" x2="16" y2="16" stroke="' + col + '" stroke-width="5" stroke-linecap="round"/>';
        m += '<line x1="-16" y1="16" x2="16" y2="-16" stroke="' + col + '" stroke-width="5" stroke-linecap="round"/>';
        m += '<circle cx="0" cy="0" r="4" fill="#fbbf24"/>';
        m += '</g>';
      }
      drawChr(cx - 30, cy - 20, 25, "#ec4899");
      drawChr(cx + 25, cy - 15, -30, "#38bdf8");
      drawChr(cx - 15, cy + 30, 45, "#10b981");
      drawChr(cx + 35, cy + 25, -15, "#f59e0b");

    } else if (stage === "metaphase") {
      // Centrosomes at poles with asters
      m += '<circle cx="' + leftPoleX + '" cy="' + poleY + '" r="6" fill="#38bdf8"/>';
      m += '<circle cx="' + rightPoleX + '" cy="' + poleY + '" r="6" fill="#38bdf8"/>';

      // Spindle fibers converging to equatorial plate
      m += '<line x1="' + leftPoleX + '" y1="' + poleY + '" x2="' + cx + '" y2="' + (cy - 60) + '" stroke="rgba(236,72,153,0.6)" stroke-width="1.5"/>';
      m += '<line x1="' + leftPoleX + '" y1="' + poleY + '" x2="' + cx + '" y2="' + (cy - 20) + '" stroke="rgba(236,72,153,0.6)" stroke-width="1.5"/>';
      m += '<line x1="' + leftPoleX + '" y1="' + poleY + '" x2="' + cx + '" y2="' + (cy + 20) + '" stroke="rgba(236,72,153,0.6)" stroke-width="1.5"/>';
      m += '<line x1="' + leftPoleX + '" y1="' + poleY + '" x2="' + cx + '" y2="' + (cy + 60) + '" stroke="rgba(236,72,153,0.6)" stroke-width="1.5"/>';

      m += '<line x1="' + rightPoleX + '" y1="' + poleY + '" x2="' + cx + '" y2="' + (cy - 60) + '" stroke="rgba(236,72,153,0.6)" stroke-width="1.5"/>';
      m += '<line x1="' + rightPoleX + '" y1="' + poleY + '" x2="' + cx + '" y2="' + (cy - 20) + '" stroke="rgba(236,72,153,0.6)" stroke-width="1.5"/>';
      m += '<line x1="' + rightPoleX + '" y1="' + poleY + '" x2="' + cx + '" y2="' + (cy + 20) + '" stroke="rgba(236,72,153,0.6)" stroke-width="1.5"/>';
      m += '<line x1="' + rightPoleX + '" y1="' + poleY + '" x2="' + cx + '" y2="' + (cy + 60) + '" stroke="rgba(236,72,153,0.6)" stroke-width="1.5"/>';

      // Equatorial Metaphase Plate line
      m += '<line x1="' + cx + '" y1="' + (cy - 85) + '" x2="' + cx + '" y2="' + (cy + 85) + '" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4"/>';
      m += '<text x="' + cx + '" y="' + (cy - 92) + '" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Metaphase Plate (Equator)</text>';

      // Chromosomes aligned vertically along plate
      var chrYs = [cy - 60, cy - 20, cy + 20, cy + 60];
      var cols = ["#ec4899", "#38bdf8", "#f59e0b", "#a855f7"];
      for (var i = 0; i < chrYs.length; i++) {
        var y = chrYs[i];
        m += '<rect x="' + (cx - 14) + '" y="' + (y - 12) + '" width="28" height="24" rx="4" fill="none"/>';
        // 2 chromatids vertical, disc kinetochore facing poles
        m += '<path d="M ' + (cx - 10) + ' ' + (y - 14) + ' Q ' + (cx - 3) + ' ' + y + ' ' + (cx - 10) + ' ' + (y + 14) + '" stroke="' + cols[i] + '" stroke-width="4.5" stroke-linecap="round" fill="none"/>';
        m += '<path d="M ' + (cx + 10) + ' ' + (y - 14) + ' Q ' + (cx + 3) + ' ' + y + ' ' + (cx + 10) + ' ' + (y + 14) + '" stroke="' + cols[i] + '" stroke-width="4.5" stroke-linecap="round" fill="none"/>';
        m += '<circle cx="' + cx + '" cy="' + y + '" r="4" fill="#fbbf24"/>'; // Centromere
        m += '<rect x="' + (cx - 5) + '" y="' + (y - 3) + '" width="2.5" height="6" rx="1" fill="#ef4444"/>'; // kinetochore left
        m += '<rect x="' + (cx + 2.5) + '" y="' + (y - 3) + '" width="2.5" height="6" rx="1" fill="#ef4444"/>'; // kinetochore right
      }

    } else if (stage === "anaphase") {
      // Centrosomes at poles
      m += '<circle cx="' + leftPoleX + '" cy="' + poleY + '" r="6" fill="#38bdf8"/>';
      m += '<circle cx="' + rightPoleX + '" cy="' + poleY + '" r="6" fill="#38bdf8"/>';

      // Chromosomes split! Centromere leading toward poles, arms trailing in V/J shapes
      var anaphaseYs = [cy - 50, cy - 16, cy + 16, cy + 50];
      var colsA = ["#ec4899", "#38bdf8", "#f59e0b", "#a855f7"];
      for (var j = 0; j < anaphaseYs.length; j++) {
        var yA = anaphaseYs[j];
        // Left daughter chromosome pulled left
        var xL = cx - 55;
        m += '<line x1="' + leftPoleX + '" y1="' + poleY + '" x2="' + (xL - 8) + '" y2="' + yA + '" stroke="rgba(236,72,153,0.5)" stroke-width="1.5"/>';
        m += '<path d="M ' + (xL + 12) + ' ' + (yA - 10) + ' L ' + (xL - 8) + ' ' + yA + ' L ' + (xL + 12) + ' ' + (yA + 10) + '" fill="none" stroke="' + colsA[j] + '" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>';
        m += '<circle cx="' + (xL - 8) + '" cy="' + yA + '" r="3.5" fill="#fbbf24"/>';

        // Right daughter chromosome pulled right
        var xR = cx + 55;
        m += '<line x1="' + rightPoleX + '" y1="' + poleY + '" x2="' + (xR + 8) + '" y2="' + yA + '" stroke="rgba(236,72,153,0.5)" stroke-width="1.5"/>';
        m += '<path d="M ' + (xR - 12) + ' ' + (yA - 10) + ' L ' + (xR + 8) + ' ' + yA + ' L ' + (xR - 12) + ' ' + (yA + 10) + '" fill="none" stroke="' + colsA[j] + '" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>';
        m += '<circle cx="' + (xR + 8) + '" cy="' + yA + '" r="3.5" fill="#fbbf24"/>';
      }
      m += '<text x="' + cx + '" y="' + (cy - 75) + '" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Centromeres Split Simultaneously</text>';
      m += '<text x="' + cx + '" y="' + (cy - 58) + '" fill="#cbd5e1" font-size="10" text-anchor="middle">Centromere leads poleward; arms trail</text>';

    } else if (stage === "telophase") {
      // Nuclear envelopes reforming at both poles
      m += '<circle cx="' + (cx - 80) + '" cy="' + cy + '" r="48" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="6,3"/>';
      m += '<circle cx="' + (cx + 80) + '" cy="' + cy + '" r="48" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="6,3"/>';

      // Decondensing chromatin clusters inside nuclei
      m += '<circle cx="' + (cx - 95) + '" cy="' + (cy - 10) + '" r="6" fill="#f43f5e"/>'; // Nucleolus reforming
      m += '<text x="' + (cx - 95) + '" y="' + (cy + 3) + '" fill="#cbd5e1" font-size="8" text-anchor="middle">Nucl</text>';
      m += '<path d="M ' + (cx - 85) + ' ' + (cy - 20) + ' Q ' + (cx - 65) + ' ' + cy + ' ' + (cx - 80) + ' ' + (cy + 25) + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<path d="M ' + (cx - 70) + ' ' + (cy - 15) + ' Q ' + (cx - 85) + ' ' + cy + ' ' + (cx - 65) + ' ' + (cy + 20) + '" fill="none" stroke="#ec4899" stroke-width="3"/>';

      m += '<circle cx="' + (cx + 65) + '" cy="' + (cy - 10) + '" r="6" fill="#f43f5e"/>';
      m += '<text x="' + (cx + 65) + '" y="' + (cy + 3) + '" fill="#cbd5e1" font-size="8" text-anchor="middle">Nucl</text>';
      m += '<path d="M ' + (cx + 75) + ' ' + (cy - 20) + ' Q ' + (cx + 95) + ' ' + cy + ' ' + (cx + 80) + ' ' + (cy + 25) + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<path d="M ' + (cx + 90) + ' ' + (cy - 15) + ' Q ' + (cx + 75) + ' ' + cy + ' ' + (cx + 95) + ' ' + (cy + 20) + '" fill="none" stroke="#ec4899" stroke-width="3"/>';

      m += '<text x="' + cx + '" y="' + (cy - 60) + '" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Telophase: Nuclear Envelope Reassembles</text>';
      m += '<text x="' + cx + '" y="' + (cy + 75) + '" fill="#fcd34d" font-size="11" text-anchor="middle">Nucleolus, Golgi & ER Reappear</text>';
    }

    // Right metrics panel
    var mx = W - 180, my = 50;
    m += '<rect x="' + mx + '" y="' + my + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (mx + 85) + '" y="' + (my + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">STAGE DETAILS</text>';

    if (stage === "prophase") {
      m += '<text x="' + (mx + 10) + '" y="' + (my + 50) + '" fill="#fcd34d" font-size="11" font-weight="bold">Stage 1: Prophase</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 75) + '" fill="#cbd5e1" font-size="10">• Chromatin condenses</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 95) + '" fill="#cbd5e1" font-size="10">• 2 chromatids / centromere</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 115) + '" fill="#cbd5e1" font-size="10">• Asters radiate microtubules</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 135) + '" fill="#cbd5e1" font-size="10">• Mitotic apparatus forms</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 160) + '" fill="#f87171" font-size="10" font-weight="bold">Disappearing Organelles:</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 180) + '" fill="#fca5a5" font-size="9.5">• Nucleolus disappears</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 198) + '" fill="#fca5a5" font-size="9.5">• Golgi complex dissolves</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 216) + '" fill="#fca5a5" font-size="9.5">• Endoplasmic reticulum dissolves</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 234) + '" fill="#fca5a5" font-size="9.5">• Nuclear envelope fragments</text>';
    } else if (stage === "metaphase") {
      m += '<text x="' + (mx + 10) + '" y="' + (my + 50) + '" fill="#10b981" font-size="11" font-weight="bold">Stage 2: Metaphase</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 75) + '" fill="#cbd5e1" font-size="10">• Envelope fully dissolved</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 95) + '" fill="#4ade80" font-size="10" font-weight="bold">• BEST stage to study</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 110) + '" fill="#4ade80" font-size="10" font-weight="bold">  chromosome morphology!</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 135) + '" fill="#cbd5e1" font-size="10">• Disc-shaped kinetochores</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 155) + '" fill="#cbd5e1" font-size="10">• Spindle attach kinetochore</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 175) + '" fill="#cbd5e1" font-size="10">• Chromosomes align at</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 192) + '" fill="#fcd34d" font-size="10">  equator (Metaphase Plate)</text>';
    } else if (stage === "anaphase") {
      m += '<text x="' + (mx + 10) + '" y="' + (my + 50) + '" fill="#f59e0b" font-size="11" font-weight="bold">Stage 3: Anaphase</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 75) + '" fill="#ef4444" font-size="10" font-weight="bold">• CENTROMERE SPLITS!</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 95) + '" fill="#cbd5e1" font-size="10">• Chromatids separate</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 115) + '" fill="#cbd5e1" font-size="10">• Daughter chromosomes</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 130) + '" fill="#cbd5e1" font-size="10">  migrate to opposite poles</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 155) + '" fill="#4ade80" font-size="10" font-weight="bold">• BEST stage to study</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 170) + '" fill="#4ade80" font-size="10" font-weight="bold">  chromosome shapes:</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 188) + '" fill="#e2e8f0" font-size="9.5">  - V shape (Metacentric)</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 204) + '" fill="#e2e8f0" font-size="9.5">  - L shape (Submetacentric)</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 220) + '" fill="#e2e8f0" font-size="9.5">  - J shape (Acrocentric)</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 236) + '" fill="#e2e8f0" font-size="9.5">  - I shape (Telocentric)</text>';
    } else if (stage === "telophase") {
      m += '<text x="' + (mx + 10) + '" y="' + (my + 50) + '" fill="#ec4899" font-size="11" font-weight="bold">Stage 4: Telophase</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 75) + '" fill="#cbd5e1" font-size="10">• Chromosomes at poles</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 95) + '" fill="#cbd5e1" font-size="10">• Decondensation to chromatin</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 115) + '" fill="#cbd5e1" font-size="10">• Nuclear envelope reforms</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 140) + '" fill="#10b981" font-size="10" font-weight="bold">Organelles Reappearing:</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 160) + '" fill="#86efac" font-size="9.5">• Nucleolus reassembles</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 178) + '" fill="#86efac" font-size="9.5">• Golgi complex reforms</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 196) + '" fill="#86efac" font-size="9.5">• Endoplasmic reticulum reforms</text>';
      m += '<text x="' + (mx + 10) + '" y="' + (my + 220) + '" fill="#fcd34d" font-size="10">• Cytokinesis initiated</text>';
    }

    svg.innerHTML = m;

    var cState = (stage === "anaphase" || stage === "telophase") ? "Split (Sister Chromatids Disjoined)" : "Intact (Joined at Centromere)";
    var nucEnv = (stage === "prophase") ? "Disintegrating" : (stage === "telophase" ? "Reforming" : "Absent / Dissolved");
    var bestFor = (stage === "metaphase") ? "Chromosome Morphology & Size" : (stage === "anaphase" ? "Chromosome Shape (V, L, J, I)" : "Nuclear Transition");

    readout(
      cell("Active Stage", stage.toUpperCase(), "#38bdf8") +
      cell("Centromere State", cState, stage === "anaphase" ? "#ef4444" : "#10b981") +
      cell("Nuclear Membrane", nucEnv, stage === "telophase" ? "#10b981" : "#f59e0b") +
      cell("Microscopic Value", bestFor, "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 10.2 Karyokinesis Rule:</span> ' +
      (stage === "metaphase" ?
       "Metaphase is the clearest stage to count and study the morphology of chromosomes because condensation is complete and chromosomes lie neatly aligned along the equatorial plane (metaphase plate) with kinetochores attached to spindle microtubules." :
       (stage === "anaphase" ?
        "In anaphase, the centromere splits simultaneously and sister chromatids separate into daughter chromosomes, migrating to opposite poles. The centromere leads towards the pole with the arms trailing behind, revealing characteristic V, L, J, or I shapes." :
        (stage === "telophase" ?
         "Telophase is effectively the reverse of prophase: chromosomes reach opposite poles, decondense back into diffuse chromatin, the nuclear envelope reforms around each group, and the nucleolus, Golgi complex, and ER reappear." :
         "In prophase, chromatin undergoes condensation to form compact chromosomes, centrosomes radiate asters as they migrate to opposite poles, and the nucleolus, Golgi complex, and ER disappear.")))
    );
  }

  return { mount: mount, setStage: setStage, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Cleavage Furrow vs Cell Plate (cytokinesiscomparatorsim)
// -------------------------------------------------------------------------
window.SIMS.cytokinesiscomparatorsim = (function(){
  var mode = "furrow"; // "furrow", "cellplate", "syncytium"
  var progress = 0.6; // 0.0 to 1.0

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Cleavage Furrow (Centripetal, Outside -> In)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Cell Plate / Phragmoplast (Centrifugal, Inside -> Out)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Middle Lamella (Calcium Pectate)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Syncytium (Coconut Liquid Endosperm)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.cytokinesiscomparatorsim.setMode(\'furrow\')">1. Animal: Cleavage Furrow</button>' +
      '<button class="preset-btn" onclick="SIMS.cytokinesiscomparatorsim.setMode(\'cellplate\')">2. Plant: Cell Plate</button>' +
      '<button class="preset-btn" onclick="SIMS.cytokinesiscomparatorsim.setMode(\'syncytium\')">3. Syncytium (Coconut Endosperm)</button>';

    var s = document.getElementById("lab-slider");
    if (s) {
      s.min = "10";
      s.max = "100";
      s.value = "60";
      s.oninput = function(e){
        progress = parseFloat(e.target.value) / 100.0;
        draw();
      };
    }
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
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">CYTOKINESIS: CLEAVAGE FURROW vs CELL PLATE vs SYNCYTIUM</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    if (mode === "furrow") {
      // Animal Cell: Cleavage furrow constricting centripetally
      var furrowDepth = progress * 75; // max 75 pinches close together
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#ec4899" font-size="14" font-weight="bold" text-anchor="middle">ANIMAL CELL: CENTRIPETAL CLEAVAGE FURROW (Outside-In)</text>';

      // Draw top and bottom lobes with furrow indentation
      m += '<path d="M ' + (cx - 150) + ' ' + (cy - 80) +
           ' C ' + (cx - 60) + ' ' + (cy - 80) + ', ' + (cx - 20) + ' ' + (cy - 80 + furrowDepth) + ', ' + cx + ' ' + (cy - 80 + furrowDepth) +
           ' C ' + (cx + 20) + ' ' + (cy - 80 + furrowDepth) + ', ' + (cx + 60) + ' ' + (cy - 80) + ', ' + (cx + 150) + ' ' + (cy - 80) +
           ' C ' + (cx + 180) + ' ' + (cy - 30) + ', ' + (cx + 180) + ' ' + (cy + 30) + ', ' + (cx + 150) + ' ' + (cy + 80) +
           ' C ' + (cx + 60) + ' ' + (cy + 80) + ', ' + (cx + 20) + ' ' + (cy + 80 - furrowDepth) + ', ' + cx + ' ' + (cy + 80 - furrowDepth) +
           ' C ' + (cx - 20) + ' ' + (cy + 80 - furrowDepth) + ', ' + (cx - 60) + ' ' + (cy + 80) + ', ' + (cx - 150) + ' ' + (cy + 80) +
           ' C ' + (cx - 180) + ' ' + (cy + 30) + ', ' + (cx - 180) + ' ' + (cy - 30) + ', ' + (cx - 150) + ' ' + (cy - 80) + ' Z" ' +
           ' fill="rgba(236,72,153,0.15)" stroke="#ec4899" stroke-width="3"/>';

      // Reconstituted daughter nuclei
      m += '<circle cx="' + (cx - 80) + '" cy="' + cy + '" r="35" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="' + (cx + 80) + '" cy="' + cy + '" r="35" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx - 80) + '" y="' + cy + '" fill="#38bdf8" font-size="11" text-anchor="middle">Daughter Nucleus 1</text>';
      m += '<text x="' + (cx + 80) + '" y="' + cy + '" fill="#38bdf8" font-size="11" text-anchor="middle">Daughter Nucleus 2</text>';

      // Outside-in arrows
      m += '<line x1="' + cx + '" y1="' + (cy - 100) + '" x2="' + cx + '" y2="' + (cy - 70 + furrowDepth) + '" stroke="#fcd34d" stroke-width="2.5" marker-end="url(#arrow)"/>';
      m += '<line x1="' + cx + '" y1="' + (cy + 100) + '" x2="' + cx + '" y2="' + (cy + 70 - furrowDepth) + '" stroke="#fcd34d" stroke-width="2.5" marker-end="url(#arrow)"/>';
      m += '<text x="' + (cx + 15) + '" y="' + (cy - 75) + '" fill="#fcd34d" font-size="11" font-weight="bold">Furrow deepens centripetally</text>';

    } else if (mode === "cellplate") {
      // Plant Cell: Cell plate growing centrifugally (inside-out)
      var plateSpan = progress * 170; // expands from center out to walls (170 max)
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">PLANT CELL: CENTRIFUGAL CELL PLATE (Inside-Out)</text>';

      // Rigid rectangular cell wall
      m += '<rect x="' + (cx - 150) + '" y="' + (cy - 85) + '" width="300" height="170" rx="8" fill="rgba(16,185,129,0.1)" stroke="#10b981" stroke-width="4"/>';
      m += '<text x="' + (cx - 140) + '" y="' + (cy - 92) + '" fill="#86efac" font-size="10">Inextensible Cell Wall</text>';

      // Daughter nuclei
      m += '<circle cx="' + (cx - 80) + '" cy="' + cy + '" r="35" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="' + (cx + 80) + '" cy="' + cy + '" r="35" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx - 80) + '" y="' + cy + '" fill="#38bdf8" font-size="11" text-anchor="middle">Daughter Nucleus 1</text>';
      m += '<text x="' + (cx + 80) + '" y="' + cy + '" fill="#38bdf8" font-size="11" text-anchor="middle">Daughter Nucleus 2</text>';

      // Cell plate vesicles coalescing at center and expanding outward
      var halfH = plateSpan / 2;
      m += '<line x1="' + cx + '" y1="' + (cy - halfH) + '" x2="' + cx + '" y2="' + (cy + halfH) + '" stroke="#fbbf24" stroke-width="6" stroke-linecap="round"/>';
      m += '<text x="' + (cx + 10) + '" y="' + (cy - 20) + '" fill="#fbbf24" font-size="11" font-weight="bold">Phragmoplast / Cell Plate</text>';
      m += '<text x="' + (cx + 10) + '" y="' + (cy - 5) + '" fill="#cbd5e1" font-size="9.5">(Precursor to Middle Lamella)</text>';
      m += '<text x="' + (cx + 10) + '" y="' + (cy + 10) + '" fill="#86efac" font-size="9.5">[Rich in Calcium Pectate]</text>';

      // Centrifugal arrows pointing outward towards walls
      m += '<line x1="' + cx + '" y1="' + (cy - 10) + '" x2="' + cx + '" y2="' + (cy - halfH - 10) + '" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,2"/>';
      m += '<line x1="' + cx + '" y1="' + (cy + 10) + '" x2="' + cx + '" y2="' + (cy + halfH + 10) + '" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,2"/>';
      m += '<text x="' + (cx - 110) + '" y="' + (cy + 65) + '" fill="#38bdf8" font-size="10">Direction: Center -> Periphery</text>';

    } else if (mode === "syncytium") {
      // Syncytium / Coconut Liquid Endosperm
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">SYNCYTIUM: MULTINUCLEATE CONDITION (Coconut Endosperm)</text>';

      // Coconut cavity
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="150" ry="85" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="3"/>';
      m += '<text x="' + cx + '" y="' + (cy + 105) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Liquid Endosperm: Free Nuclear Karyokinesis WITHOUT Cytokinesis</text>';

      // Multiple free floating nuclei
      var nCoords = [
        [-90, -40], [-40, -45], [20, -50], [80, -35],
        [-110, 0], [-60, 5], [0, -10], [60, 10], [100, -5],
        [-80, 45], [-25, 40], [35, 45], [85, 40]
      ];
      for (var k = 0; k < nCoords.length; k++) {
        var nx = cx + nCoords[k][0];
        var ny = cy + nCoords[k][1];
        m += '<circle cx="' + nx + '" cy="' + ny + '" r="14" fill="#fbbf24" stroke="#fff" stroke-width="1.5"/>';
        m += '<circle cx="' + nx + '" cy="' + ny + '" r="5" fill="#d97706"/>';
      }
      m += '<text x="' + cx + '" y="' + (cy - 15) + '" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">Thousands of Free Nuclei</text>';
    }

    // Right comparison panel
    var px = W - 180, py = 50;
    m += '<rect x="' + px + '" y="' + py + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (px + 85) + '" y="' + (py + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">CYTOKINESIS RULE</text>';

    if (mode === "furrow") {
      m += '<text x="' + (px + 10) + '" y="' + (py + 50) + '" fill="#ec4899" font-size="11" font-weight="bold">Animal Furrow</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 75) + '" fill="#cbd5e1" font-size="10">• Plasma membrane</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 95) + '" fill="#fcd34d" font-size="10" font-weight="bold">• CENTRIPETAL flow:</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 110) + '" fill="#cbd5e1" font-size="9.5">  Outside towards center</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 135) + '" fill="#cbd5e1" font-size="10">• Actin-myosin ring</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 155) + '" fill="#cbd5e1" font-size="10">• Furrow deepens until</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 170) + '" fill="#cbd5e1" font-size="10">  it joins in middle</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 195) + '" fill="#86efac" font-size="10">• Completes cleavage</text>';
    } else if (mode === "cellplate") {
      m += '<text x="' + (px + 10) + '" y="' + (py + 50) + '" fill="#10b981" font-size="11" font-weight="bold">Plant Cell Plate</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 75) + '" fill="#cbd5e1" font-size="10">• Rigid inextensible wall</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 90) + '" fill="#cbd5e1" font-size="10">  prevents furrowing</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 115) + '" fill="#4ade80" font-size="10" font-weight="bold">• CENTRIFUGAL flow:</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 130) + '" fill="#cbd5e1" font-size="9.5">  Center towards outside</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 155) + '" fill="#cbd5e1" font-size="10">• Precursor: Cell Plate</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 175) + '" fill="#fcd34d" font-size="10">• Becomes Middle Lamella</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 195) + '" fill="#86efac" font-size="9.5">  (Calcium Pectate glue)</text>';
    } else if (mode === "syncytium") {
      m += '<text x="' + (px + 10) + '" y="' + (py + 50) + '" fill="#38bdf8" font-size="11" font-weight="bold">Syncytium State</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 75) + '" fill="#ef4444" font-size="10" font-weight="bold">• NO Cytokinesis!</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 95) + '" fill="#cbd5e1" font-size="10">• Repeated karyokinesis</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 115) + '" fill="#fcd34d" font-size="10">• Multinucleate state</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 140) + '" fill="#86efac" font-size="10" font-weight="bold">NCERT Example:</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 160) + '" fill="#cbd5e1" font-size="10">• Liquid endosperm in</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 175) + '" fill="#cbd5e1" font-size="10">  coconut (water)</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 195) + '" fill="#cbd5e1" font-size="10">• White kernel is the</text>';
      m += '<text x="' + (px + 10) + '" y="' + (py + 210) + '" fill="#cbd5e1" font-size="10">  cellular endosperm</text>';
    }

    svg.innerHTML = m;

    var dir = (mode === "furrow") ? "Centripetal (Periphery to Center)" : (mode === "cellplate" ? "Centrifugal (Center to Periphery)" : "N/A (No Division)");
    var endState = (mode === "furrow") ? "2 Distinct Animal Cells" : (mode === "cellplate" ? "2 Plant Cells with Middle Lamella" : "Multinucleate Syncytium");

    readout(
      cell("Cytokinesis Mode", mode.toUpperCase(), mode === "cellplate" ? "#10b981" : "#ec4899") +
      cell("Formation Direction", dir, "#fcd34d") +
      cell("Progress", Math.round(progress * 100) + "%", "#38bdf8") +
      cell("Resulting Structure", endState, "#86efac")
    );

    verdict(
      '<span style="color:#fcd34d;font-weight:700;">NCERT 10.2 Cytokinesis Rule:</span> ' +
      (mode === "furrow" ?
       "Animal cytokinesis occurs via a cleavage furrow in the plasma membrane that deepens centripetally (from outside to inside) until it meets at the center." :
       (mode === "cellplate" ?
        "Plant cells have a rigid, inextensible cell wall, so cytokinesis begins in the center with the cell plate (phragmoplast) and grows centrifugally (outwards) until it joins lateral walls, forming the middle lamella." :
        "When karyokinesis is not followed by cytokinesis, a multinucleate condition called syncytium arises, as seen in the liquid endosperm of coconut."))
    );
  }

  return { mount: mount, setMode: setMode, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: 5-Substage Prophase I & Chiasmata (prophase1zoomer)
// -------------------------------------------------------------------------
window.SIMS.prophase1zoomer = (function(){
  var substage = "pachytene"; // "leptotene", "zygotene", "pachytene", "diplotene", "diakinesis"

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Maternal Homologue</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Paternal Homologue</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Synaptonemal Complex / Recombination Nodule</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>X-Shaped Chiasma</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.prophase1zoomer.setSubstage(\'leptotene\')">1. Leptotene (Condensation)</button>' +
      '<button class="preset-btn" onclick="SIMS.prophase1zoomer.setSubstage(\'zygotene\')">2. Zygotene (Synapsis)</button>' +
      '<button class="preset-btn" onclick="SIMS.prophase1zoomer.setSubstage(\'pachytene\')">3. Pachytene (Crossing Over)</button>' +
      '<button class="preset-btn" onclick="SIMS.prophase1zoomer.setSubstage(\'diplotene\')">4. Diplotene (Chiasmata)</button>' +
      '<button class="preset-btn" onclick="SIMS.prophase1zoomer.setSubstage(\'diakinesis\')">5. Diakinesis (Terminalisation)</button>';
  }

  function setSubstage(s){
    substage = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">PROPHASE I: 5 SEQUENTIAL MEIOTIC SUBSTAGES</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    // Outer meiotic cell nucleus
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="120" fill="rgba(30,41,59,0.35)" stroke="#64748b" stroke-width="2" ' + (substage === "diakinesis" ? 'stroke-dasharray="6,4"' : '') + '/>';

    if (substage === "leptotene") {
      m += '<text x="' + cx + '" y="' + (cy - 95) + '" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">LEPTOTENE: Progressive Compaction</text>';
      // Long, slender chromatin threads
      m += '<path d="M ' + (cx - 70) + ' ' + (cy - 60) + ' Q ' + (cx - 20) + ' ' + cy + ' ' + (cx - 50) + ' ' + (cy + 70) + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<path d="M ' + (cx + 60) + ' ' + (cy - 60) + ' Q ' + (cx + 10) + ' ' + cy + ' ' + (cx + 40) + ' ' + (cy + 70) + '" fill="none" stroke="#ec4899" stroke-width="3"/>';
      m += '<text x="' + cx + '" y="' + (cy + 95) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Chromosomes become gradually visible under light microscope</text>';

    } else if (substage === "zygotene") {
      m += '<text x="' + cx + '" y="' + (cy - 95) + '" fill="#818cf8" font-size="14" font-weight="bold" text-anchor="middle">ZYGOTENE: Synapsis & Synaptonemal Complex</text>';
      // Two homologous chromosomes pairing closely side by side
      m += '<line x1="' + (cx - 22) + '" y1="' + (cy - 70) + '" x2="' + (cx - 22) + '" y2="' + (cy + 70) + '" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>';
      m += '<line x1="' + (cx + 22) + '" y1="' + (cy - 70) + '" x2="' + (cx + 22) + '" y2="' + (cy + 70) + '" stroke="#ec4899" stroke-width="6" stroke-linecap="round"/>';

      // Synaptonemal complex ladder between them
      for (var yl = cy - 55; yl <= cy + 55; yl += 15) {
        m += '<line x1="' + (cx - 18) + '" y1="' + yl + '" x2="' + (cx + 18) + '" y2="' + yl + '" stroke="#fbbf24" stroke-width="2.5"/>';
      }
      m += '<text x="' + (cx + 60) + '" y="' + cy + '" fill="#fbbf24" font-size="11" font-weight="bold">Synaptonemal Complex</text>';
      m += '<text x="' + cx + '" y="' + (cy + 95) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Forms Bivalent or Tetrad (Pair of Homologues)</text>';

    } else if (substage === "pachytene") {
      m += '<text x="' + cx + '" y="' + (cy - 95) + '" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">PACHYTENE: Crossing Over at Recombination Nodules</text>';
      // Bivalent clearly visible as 4 chromatids (tetrad)
      // Maternal homologue (blue): 2 sister chromatids
      m += '<path d="M ' + (cx - 30) + ' ' + (cy - 70) + ' L ' + (cx - 30) + ' ' + (cy + 70) + '" stroke="#38bdf8" stroke-width="4.5"/>';
      m += '<path d="M ' + (cx - 15) + ' ' + (cy - 70) + ' L ' + cx + ' ' + cy + ' L ' + (cx + 15) + ' ' + (cy + 70) + '" stroke="#38bdf8" stroke-width="4.5"/>';

      // Paternal homologue (pink): 2 sister chromatids
      m += '<path d="M ' + (cx + 30) + ' ' + (cy - 70) + ' L ' + (cx + 30) + ' ' + (cy + 70) + '" stroke="#ec4899" stroke-width="4.5"/>';
      m += '<path d="M ' + (cx + 15) + ' ' + (cy - 70) + ' L ' + cx + ' ' + cy + ' L ' + (cx - 15) + ' ' + (cy + 70) + '" stroke="#ec4899" stroke-width="4.5"/>';

      // Recombination nodule at crossing point
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="#fbbf24" stroke="#fff" stroke-width="2"/>';
      m += '<text x="' + (cx + 45) + '" y="' + (cy - 12) + '" fill="#fbbf24" font-size="11" font-weight="bold">Recombination Nodule</text>';
      m += '<text x="' + (cx + 45) + '" y="' + (cy + 4) + '" fill="#86efac" font-size="10">Enzyme: RECOMBINASE</text>';
      m += '<text x="' + (cx + 45) + '" y="' + (cy + 18) + '" fill="#cbd5e1" font-size="9.5">Non-sister chromatid exchange</text>';
      m += '<text x="' + cx + '" y="' + (cy + 95) + '" fill="#10b981" font-size="11" text-anchor="middle">Genetic Recombination & Crossing Over Completed</text>';

    } else if (substage === "diplotene") {
      m += '<text x="' + cx + '" y="' + (cy - 95) + '" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="middle">DIPLOTENE: Dissolution of Complex & X-Shaped CHIASMATA</text>';
      // Dissolution of synaptonemal complex; homologues push apart except at chiasmata
      // Left arm pushed out, crosses at chiasma
      m += '<path d="M ' + (cx - 50) + ' ' + (cy - 70) + ' Q ' + (cx - 20) + ' ' + (cy - 20) + ' ' + cx + ' ' + cy +
           ' Q ' + (cx - 20) + ' ' + (cy + 20) + ' ' + (cx - 50) + ' ' + (cy + 70) + '" fill="none" stroke="#38bdf8" stroke-width="5"/>';
      // Right arm pushed out, crosses at chiasma
      m += '<path d="M ' + (cx + 50) + ' ' + (cy - 70) + ' Q ' + (cx + 20) + ' ' + (cy - 20) + ' ' + cx + ' ' + cy +
           ' Q ' + (cx + 20) + ' ' + (cy + 20) + ' ' + (cx + 50) + ' ' + (cy + 70) + '" fill="none" stroke="#ec4899" stroke-width="5"/>';

      // Recombined segments visible after crossing over
      m += '<line x1="' + (cx - 25) + '" y1="' + (cy + 35) + '" x2="' + (cx - 50) + '" y2="' + (cy + 70) + '" stroke="#ec4899" stroke-width="5"/>';
      m += '<line x1="' + (cx + 25) + '" y1="' + (cy + 35) + '" x2="' + (cx + 50) + '" y2="' + (cy + 70) + '" stroke="#38bdf8" stroke-width="5"/>';

      m += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#10b981"/>';
      m += '<text x="' + (cx + 25) + '" y="' + cy + '" fill="#10b981" font-size="12" font-weight="bold">X-Shaped Chiasma</text>';
      m += '<text x="' + cx + '" y="' + (cy + 95) + '" fill="#fcd34d" font-size="10.5" text-anchor="middle">Synaptonemal complex dissolves; held only at chiasmata</text>';

    } else if (substage === "diakinesis") {
      m += '<text x="' + cx + '" y="' + (cy - 95) + '" fill="#ec4899" font-size="14" font-weight="bold" text-anchor="middle">DIAKINESIS: Terminalisation of Chiasmata</text>';
      // Chiasmata shifted completely to the tips (terminalised)
      m += '<path d="M ' + (cx - 35) + ' ' + (cy - 60) + ' L ' + (cx + 35) + ' ' + (cy - 60) + '" stroke="#fbbf24" stroke-width="4"/>';
      m += '<path d="M ' + (cx - 40) + ' ' + (cy - 60) + ' L ' + (cx - 40) + ' ' + (cy + 60) + '" stroke="#38bdf8" stroke-width="5"/>';
      m += '<path d="M ' + (cx + 40) + ' ' + (cy - 60) + ' L ' + (cx + 40) + ' ' + (cy + 60) + '" stroke="#ec4899" stroke-width="5"/>';
      m += '<path d="M ' + (cx - 35) + ' ' + (cy + 60) + ' L ' + (cx + 35) + ' ' + (cy + 60) + '" stroke="#fbbf24" stroke-width="4"/>';

      m += '<text x="' + cx + '" y="' + (cy - 70) + '" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">Terminalised Chiasma (Tips)</text>';
      m += '<text x="' + cx + '" y="' + cy + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Nuclear envelope & nucleolus break down</text>';
      m += '<text x="' + cx + '" y="' + (cy + 95) + '" fill="#f87171" font-size="10.5" text-anchor="middle">Meiotic spindle assembled; transition to Metaphase I</text>';
    }

    // Right info panel
    var ix = W - 180, iy = 50;
    m += '<rect x="' + ix + '" y="' + iy + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (ix + 85) + '" y="' + (iy + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">SUBSTAGE PROFILE</text>';

    if (substage === "leptotene") {
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 50) + '" fill="#38bdf8" font-size="11" font-weight="bold">1. Leptotene</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 75) + '" fill="#cbd5e1" font-size="10">• Compaction continues</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 95) + '" fill="#cbd5e1" font-size="10">• Thin thread stage</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 115) + '" fill="#cbd5e1" font-size="10">• Chromatin becomes</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 130) + '" fill="#cbd5e1" font-size="10">  distinctly visible</text>';
    } else if (substage === "zygotene") {
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 50) + '" fill="#818cf8" font-size="11" font-weight="bold">2. Zygotene</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 75) + '" fill="#fcd34d" font-size="10" font-weight="bold">• SYNAPSIS begins</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 95) + '" fill="#cbd5e1" font-size="10">• Homologous pairing</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 120) + '" fill="#86efac" font-size="10" font-weight="bold">• Synaptonemal</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 135) + '" fill="#86efac" font-size="10" font-weight="bold">  Complex forms</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 160) + '" fill="#cbd5e1" font-size="10">• Pair = Bivalent</text>';
    } else if (substage === "pachytene") {
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 50) + '" fill="#10b981" font-size="11" font-weight="bold">3. Pachytene</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 75) + '" fill="#4ade80" font-size="10" font-weight="bold">• CROSSING OVER</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 95) + '" fill="#cbd5e1" font-size="10">• 4 chromatids distinct</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 115) + '" fill="#cbd5e1" font-size="10">• Recombination nodules</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 140) + '" fill="#fcd34d" font-size="10" font-weight="bold">• Enzyme: RECOMBINASE</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 165) + '" fill="#cbd5e1" font-size="10">• Exchange of genetic</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 180) + '" fill="#cbd5e1" font-size="10">  material between</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 195) + '" fill="#f87171" font-size="10">  non-sister chromatids</text>';
    } else if (substage === "diplotene") {
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 50) + '" fill="#f59e0b" font-size="11" font-weight="bold">4. Diplotene</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 75) + '" fill="#ef4444" font-size="10" font-weight="bold">• Synaptonemal complex</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 90) + '" fill="#ef4444" font-size="10" font-weight="bold">  DISSOLVES</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 115) + '" fill="#4ade80" font-size="10" font-weight="bold">• X-shaped CHIASMATA</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 130) + '" fill="#cbd5e1" font-size="10">  become visible</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 155) + '" fill="#cbd5e1" font-size="10">• Oocytes can arrest</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 170) + '" fill="#cbd5e1" font-size="10">  for months/years</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 185) + '" fill="#cbd5e1" font-size="10">  (dictyotene stage)</text>';
    } else if (substage === "diakinesis") {
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 50) + '" fill="#ec4899" font-size="11" font-weight="bold">5. Diakinesis</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 75) + '" fill="#fcd34d" font-size="10" font-weight="bold">• TERMINALISATION</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 90) + '" fill="#cbd5e1" font-size="10">  of chiasmata (to tips)</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 115) + '" fill="#cbd5e1" font-size="10">• Meiotic spindle forms</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 140) + '" fill="#f87171" font-size="10">• Nucleolus disappears</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 160) + '" fill="#f87171" font-size="10">• Nuclear envelope</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 175) + '" fill="#f87171" font-size="10">  breaks down</text>';
      m += '<text x="' + (ix + 10) + '" y="' + (iy + 200) + '" fill="#86efac" font-size="10">• Enters Metaphase I</text>';
    }

    svg.innerHTML = m;

    var synComp = (substage === "zygotene" || substage === "pachytene") ? "Active / Intact" : "Dissolved / Absent";
    var chiasState = (substage === "diplotene") ? "Visible X-Shaped" : (substage === "diakinesis" ? "Terminalised to Tips" : "Not yet formed");
    var recStatus = (substage === "pachytene") ? "Active (Recombinase)" : (substage === "diplotene" || substage === "diakinesis" ? "Completed" : "Inactive");

    readout(
      cell("Prophase I Stage", substage.toUpperCase(), "#38bdf8") +
      cell("Synaptonemal Complex", synComp, synComp === "Active / Intact" ? "#10b981" : "#94a3b8") +
      cell("Chiasmata Status", chiasState, "#f59e0b") +
      cell("Crossing Over", recStatus, "#ec4899")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">NCERT 10.3 Prophase I Rule:</span> ' +
      (substage === "zygotene" ?
       "In Zygotene, homologous chromosomes begin pairing together in a process called synapsis, accompanied by the formation of the complex nucleoprotein structure called the synaptonemal complex (forming a bivalent)." :
       (substage === "pachytene" ?
        "In Pachytene, crossing over occurs between non-sister chromatids of homologous chromosomes at recombination nodules, catalyzed by the enzyme recombinase, resulting in mutual genetic exchange." :
        (substage === "diplotene" ?
         "In Diplotene, the synaptonemal complex dissolves and the homologous chromosomes separate from each other except at the points of crossing over, forming the characteristic X-shaped chiasmata." :
         (substage === "diakinesis" ?
          "Diakinesis is marked by the terminalisation of chiasmata (shifting to the chromosome tips), assembly of the meiotic spindle, and the breakdown of the nucleolus and nuclear envelope." :
          "In Leptotene, chromosomes undergo progressive condensation and compaction, gradually becoming visible as long, thin threads under the light microscope."))))
    );
  }

  return { mount: mount, setSubstage: setSubstage, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Anaphase I vs Mitotic Anaphase (meiosis1segregationsim)
// -------------------------------------------------------------------------
window.SIMS.meiosis1segregationsim = (function(){
  var divType = "anaphase1"; // "mitosis", "anaphase1", "compare"

  function mount(){
    App.state.maxT = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Centromere Splits (Mitotic Anaphase)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Centromere INTACT (Meiotic Anaphase I)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Homologous Chromosomes Segregate</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Reduction to Haploid (2n -> n)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.meiosis1segregationsim.setType(\'anaphase1\')">1. Meiotic Anaphase I (Centromere INTACT)</button>' +
      '<button class="preset-btn" onclick="SIMS.meiosis1segregationsim.setType(\'mitosis\')">2. Mitotic Anaphase (Centromere SPLITS)</button>' +
      '<button class="preset-btn" onclick="SIMS.meiosis1segregationsim.setType(\'compare\')">3. Side-by-Side Comparison</button>';
  }

  function setType(t){
    divType = t;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">CRUCIAL DISTINCTION: ANAPHASE I (MEIOSIS) vs ANAPHASE (MITOSIS)</text>';

    if (divType === "anaphase1") {
      var cx = W / 2 - 80;
      var cy = H / 2 + 15;
      m += '<text x="' + cx + '" y="' + (cy - 100) + '" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">ANAPHASE I OF MEIOSIS: Homologue Disjunction, Centromeres Intact</text>';

      // Cell boundary
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="150" ry="90" fill="rgba(16,185,129,0.1)" stroke="#10b981" stroke-width="2.5"/>';

      // Left and right poles
      var pL = cx - 130, pR = cx + 130;
      m += '<circle cx="' + pL + '" cy="' + cy + '" r="5" fill="#38bdf8"/>';
      m += '<circle cx="' + pR + '" cy="' + cy + '" r="5" fill="#38bdf8"/>';

      // Chromosomes migrating poleward: Homologues separate, but EACH CHROMOSOME STILL HAS 2 CHROMATIDS ATTACHED AT CENTROMERE!
      function drawIntactChr(x, y, col, isLeft) {
        var dx = isLeft ? 8 : -8;
        m += '<g transform="translate(' + x + ',' + y + ')">';
        m += '<line x1="0" y1="0" x2="' + (isLeft ? -35 : 35) + '" y2="0" stroke="rgba(236,72,153,0.5)" stroke-width="1.5"/>';
        // V-shaped trailing arms (2 chromatids)
        m += '<line x1="0" y1="0" x2="' + dx + '" y2="-15" stroke="' + col + '" stroke-width="4.5" stroke-linecap="round"/>';
        m += '<line x1="0" y1="0" x2="' + (dx + 6) + '" y2="-12" stroke="' + col + '" stroke-width="4.5" stroke-linecap="round"/>';
        m += '<line x1="0" y1="0" x2="' + dx + '" y2="15" stroke="' + col + '" stroke-width="4.5" stroke-linecap="round"/>';
        m += '<line x1="0" y1="0" x2="' + (dx + 6) + '" y2="12" stroke="' + col + '" stroke-width="4.5" stroke-linecap="round"/>';
        m += '<circle cx="0" cy="0" r="4.5" fill="#fbbf24"/>'; // Centromere intact!
        m += '</g>';
      }

      drawIntactChr(cx - 65, cy - 35, "#38bdf8", true);
      drawIntactChr(cx - 65, cy + 35, "#818cf8", true);
      drawIntactChr(cx + 65, cy - 35, "#ec4899", false);
      drawIntactChr(cx + 65, cy + 35, "#f43f5e", false);

      m += '<text x="' + cx + '" y="' + (cy - 20) + '" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">CENTROMERES DO NOT SPLIT!</text>';
      m += '<text x="' + cx + '" y="' + cy + '" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Sister chromatids remain attached at their centromere</text>';
      m += '<text x="' + cx + '" y="' + (cy + 20) + '" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Homologous Chromosomes Segregate to Opposite Poles</text>';

    } else if (divType === "mitosis") {
      var cxM = W / 2 - 80;
      var cyM = H / 2 + 15;
      m += '<text x="' + cxM + '" y="' + (cyM - 100) + '" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">MITOTIC ANAPHASE: Centromeres SPLIT Simultaneously</text>';

      // Cell boundary
      m += '<ellipse cx="' + cxM + '" cy="' + cyM + '" rx="150" ry="90" fill="rgba(239,68,68,0.1)" stroke="#ef4444" stroke-width="2.5"/>';

      var pLM = cxM - 130, pRM = cxM + 130;
      m += '<circle cx="' + pLM + '" cy="' + cyM + '" r="5" fill="#38bdf8"/>';
      m += '<circle cx="' + pRM + '" cy="' + cyM + '" r="5" fill="#38bdf8"/>';

      // Centromere split! Single sister chromatids migrating poleward
      function drawSplitChr(x, y, col, isLeft) {
        var dx = isLeft ? 10 : -10;
        m += '<g transform="translate(' + x + ',' + y + ')">';
        m += '<line x1="0" y1="0" x2="' + (isLeft ? -45 : 45) + '" y2="0" stroke="rgba(236,72,153,0.5)" stroke-width="1.5"/>';
        m += '<path d="M ' + dx + ' -12 L 0 0 L ' + dx + ' 12" fill="none" stroke="' + col + '" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>';
        m += '<circle cx="0" cy="0" r="3.5" fill="#fbbf24"/>'; // Split centromere
        m += '</g>';
      }

      drawSplitChr(cxM - 65, cyM - 45, "#38bdf8", true);
      drawSplitChr(cxM - 65, cyM - 15, "#ec4899", true);
      drawSplitChr(cxM - 65, cyM + 15, "#818cf8", true);
      drawSplitChr(cxM - 65, cyM + 45, "#f59e0b", true);

      drawSplitChr(cxM + 65, cyM - 45, "#38bdf8", false);
      drawSplitChr(cxM + 65, cyM - 15, "#ec4899", false);
      drawSplitChr(cxM + 65, cyM + 15, "#818cf8", false);
      drawSplitChr(cxM + 65, cyM + 45, "#f59e0b", false);

      m += '<text x="' + cxM + '" y="' + (cyM - 20) + '" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">CENTROMERES SPLIT SIMULTANEOUSLY!</text>';
      m += '<text x="' + cxM + '" y="' + cyM + '" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Sister chromatids become independent daughter chromosomes</text>';
      m += '<text x="' + cxM + '" y="' + (cyM + 20) + '" fill="#86efac" font-size="11" font-weight="bold" text-anchor="middle">Ploidy Remains Equational (2n at each pole)</text>';

    } else if (divType === "compare") {
      // Comparison split screen
      m += '<line x1="280" y1="50" x2="280" y2="340" stroke="#475569" stroke-width="2" stroke-dasharray="6,4"/>';

      // Left: Meiosis Anaphase I
      m += '<text x="140" y="60" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">MEIOSIS: ANAPHASE I</text>';
      m += '<ellipse cx="140" cy="180" rx="110" ry="70" fill="rgba(16,185,129,0.1)" stroke="#10b981" stroke-width="2"/>';
      m += '<circle cx="60" cy="180" r="4" fill="#38bdf8"/>';
      m += '<circle cx="220" cy="180" r="4" fill="#38bdf8"/>';
      m += '<circle cx="100" cy="160" r="4" fill="#fbbf24"/>'; // intact centromere left
      m += '<line x1="100" y1="160" x2="108" y2="148" stroke="#38bdf8" stroke-width="4"/>';
      m += '<line x1="100" y1="160" x2="108" y2="172" stroke="#38bdf8" stroke-width="4"/>';
      m += '<circle cx="180" cy="160" r="4" fill="#fbbf24"/>'; // intact centromere right
      m += '<line x1="180" y1="160" x2="172" y2="148" stroke="#ec4899" stroke-width="4"/>';
      m += '<line x1="180" y1="160" x2="172" y2="172" stroke="#ec4899" stroke-width="4"/>';
      m += '<text x="140" y="275" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">• Centromere INTACT</text>';
      m += '<text x="140" y="295" fill="#cbd5e1" font-size="10" text-anchor="middle">• Homologues segregate</text>';
      m += '<text x="140" y="315" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">• Reductional: 2n -> n</text>';

      // Right: Mitotic Anaphase
      m += '<text x="420" y="60" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">MITOSIS: ANAPHASE</text>';
      m += '<ellipse cx="420" cy="180" rx="110" ry="70" fill="rgba(239,68,68,0.1)" stroke="#ef4444" stroke-width="2"/>';
      m += '<circle cx="340" cy="180" r="4" fill="#38bdf8"/>';
      m += '<circle cx="500" cy="180" r="4" fill="#38bdf8"/>';
      m += '<circle cx="380" cy="160" r="3.5" fill="#fbbf24"/>'; // split centromere left
      m += '<path d="M 388 150 L 380 160 L 388 170" fill="none" stroke="#38bdf8" stroke-width="4"/>';
      m += '<circle cx="460" cy="160" r="3.5" fill="#fbbf24"/>'; // split centromere right
      m += '<path d="M 452 150 L 460 160 L 452 170" fill="none" stroke="#38bdf8" stroke-width="4"/>';
      m += '<text x="420" y="275" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">• Centromere SPLITS</text>';
      m += '<text x="420" y="295" fill="#cbd5e1" font-size="10" text-anchor="middle">• Sister chromatids disjoin</text>';
      m += '<text x="420" y="315" fill="#86efac" font-size="10" font-weight="bold" text-anchor="middle">• Equational: 2n -> 2n</text>';
    }

    // Right details panel
    var rx = W - 180, ry = 50;
    m += '<rect x="' + rx + '" y="' + ry + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (rx + 85) + '" y="' + (ry + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">COMPARISON TABLE</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 50) + '" fill="#10b981" font-size="11" font-weight="bold">Meiotic Anaphase I:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 70) + '" fill="#86efac" font-size="10">• Centromere: INTACT</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 90) + '" fill="#cbd5e1" font-size="10">• Separates: Homologues</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 110) + '" fill="#cbd5e1" font-size="10">• Chromatids/Chr: 2</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 130) + '" fill="#fbbf24" font-size="10" font-weight="bold">• Result: HAPLOID (n)</text>';

    m += '<text x="' + (rx + 10) + '" y="' + (ry + 165) + '" fill="#ef4444" font-size="11" font-weight="bold">Mitotic Anaphase:</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 185) + '" fill="#fca5a5" font-size="10">• Centromere: SPLITS</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 205) + '" fill="#cbd5e1" font-size="10">• Separates: Sister Chr</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 225) + '" fill="#cbd5e1" font-size="10">• Chromatids/Chr: 1</text>';
    m += '<text x="' + (rx + 10) + '" y="' + (ry + 245) + '" fill="#86efac" font-size="10" font-weight="bold">• Result: DIPLOID (2n)</text>';

    svg.innerHTML = m;

    var cStateText = (divType === "anaphase1") ? "INTACT (No splitting)" : (divType === "mitosis" ? "SPLIT (Simultaneous)" : "Intact in Ana I vs Split in Mitosis");
    var ploidyText = (divType === "anaphase1") ? "Haploid (n) daughter cells" : (divType === "mitosis" ? "Diploid (2n) daughter cells" : "n vs 2n");

    readout(
      cell("Anaphase Type", divType === "anaphase1" ? "Meiosis I Anaphase" : (divType === "mitosis" ? "Mitosis Anaphase" : "Comparative Lab"), "#38bdf8") +
      cell("Centromere State", cStateText, divType === "anaphase1" ? "#10b981" : "#ef4444") +
      cell("Disjoining Unit", divType === "anaphase1" ? "Homologous Chromosomes" : "Sister Chromatids", "#fcd34d") +
      cell("Resulting Ploidy", ploidyText, "#86efac")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT 10.3 Core Distinction:</span> ' +
      (divType === "anaphase1" ?
       "In Anaphase I of Meiosis, homologous chromosomes separate and migrate to opposite poles while sister chromatids remain firmly attached at their centromeres. Centromeres DO NOT split in Anaphase I; this results in reduction of chromosome number to haploid (n)." :
       "In Mitotic Anaphase, centromeres split simultaneously, allowing sister chromatids to separate and move to opposite poles as individual daughter chromosomes, ensuring identical diploid (2n) genetic transmission.")
    );
  }

  return { mount: mount, setType: setType, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Meiosis II & Tetrad Generator (meiosis2tetradsim)
// -------------------------------------------------------------------------
window.SIMS.meiosis2tetradsim = (function(){
  var stageM2 = "anaphase2"; // "prophase2", "metaphase2", "anaphase2", "tetrad"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Daughter Cell 1</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Daughter Cell 2</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Centromere Cleavage (Ana II)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>4 Haploid Gametes (Tetrad)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.meiosis2tetradsim.setStage(\'prophase2\')">1. Prophase II & Metaphase II</button>' +
      '<button class="preset-btn" onclick="SIMS.meiosis2tetradsim.setStage(\'anaphase2\')">2. Anaphase II (Centromere Cleaves)</button>' +
      '<button class="preset-btn" onclick="SIMS.meiosis2tetradsim.setStage(\'tetrad\')">3. Telophase II: 4 Gamete Tetrad</button>';
  }

  function setStage(s){
    stageM2 = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">MEIOSIS II: EQUATIONAL CENTROMERE CLEAVAGE & TETRAD FORMATION</text>';

    var cx = W / 2 - 80;
    var cy = H / 2 + 15;

    if (stageM2 === "prophase2" || stageM2 === "metaphase2") {
      m += '<text x="' + cx + '" y="' + (cy - 100) + '" fill="#818cf8" font-size="14" font-weight="bold" text-anchor="middle">METAPHASE II: Chromosomes Align at Two Separate Equators</text>';

      // Two haploid cells from Meiosis I
      m += '<ellipse cx="' + (cx - 75) + '" cy="' + cy + '" rx="65" ry="80" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<ellipse cx="' + (cx + 75) + '" cy="' + cy + '" rx="65" ry="80" fill="rgba(236,72,153,0.12)" stroke="#ec4899" stroke-width="2"/>';

      // Plate lines
      m += '<line x1="' + (cx - 75) + '" y1="' + (cy - 60) + '" x2="' + (cx - 75) + '" y2="' + (cy + 60) + '" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,2"/>';
      m += '<line x1="' + (cx + 75) + '" y1="' + (cy - 60) + '" x2="' + (cx + 75) + '" y2="' + (cy + 60) + '" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,2"/>';

      // Chromosomes aligned with recombined chromatids
      function drawM2Chr(x, y, c1, c2) {
        m += '<line x1="' + (x - 7) + '" y1="' + (y - 12) + '" x2="' + (x - 7) + '" y2="' + (y + 12) + '" stroke="' + c1 + '" stroke-width="3.5" stroke-linecap="round"/>';
        m += '<line x1="' + (x + 7) + '" y1="' + (y - 12) + '" x2="' + (x + 7) + '" y2="' + (y + 12) + '" stroke="' + c2 + '" stroke-width="3.5" stroke-linecap="round"/>';
        m += '<circle cx="' + x + '" cy="' + y + '" r="3.5" fill="#fbbf24"/>';
      }

      drawM2Chr(cx - 75, cy - 25, "#38bdf8", "#ec4899");
      drawM2Chr(cx - 75, cy + 25, "#38bdf8", "#38bdf8");

      drawM2Chr(cx + 75, cy - 25, "#ec4899", "#38bdf8");
      drawM2Chr(cx + 75, cy + 25, "#ec4899", "#ec4899");

      m += '<text x="' + cx + '" y="' + (cy + 95) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Interkinesis has NO DNA replication! 2 haploid cells enter Meiosis II.</text>';

    } else if (stageM2 === "anaphase2") {
      m += '<text x="' + cx + '" y="' + (cy - 100) + '" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">ANAPHASE II: Centromeres Split Simultaneously</text>';

      // Two cells showing sister chromatid disjunction
      m += '<ellipse cx="' + (cx - 75) + '" cy="' + cy + '" rx="65" ry="80" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<ellipse cx="' + (cx + 75) + '" cy="' + cy + '" rx="65" ry="80" fill="rgba(236,72,153,0.12)" stroke="#ec4899" stroke-width="2"/>';

      // Disjoining chromatids
      function drawDisjoin(xL, xR, y, col) {
        m += '<path d="M ' + (xL - 6) + ' ' + (y - 8) + ' L ' + (xL - 14) + ' ' + y + ' L ' + (xL - 6) + ' ' + (y + 8) + '" fill="none" stroke="' + col + '" stroke-width="3.5"/>';
        m += '<circle cx="' + (xL - 14) + '" cy="' + y + '" r="3" fill="#fbbf24"/>';

        m += '<path d="M ' + (xR + 6) + ' ' + (y - 8) + ' L ' + (xR + 14) + ' ' + y + ' L ' + (xR + 6) + ' ' + (y + 8) + '" fill="none" stroke="' + col + '" stroke-width="3.5"/>';
        m += '<circle cx="' + (xR + 14) + '" cy="' + y + '" r="3" fill="#fbbf24"/>';
      }

      drawDisjoin(cx - 85, cx - 65, cy - 25, "#38bdf8");
      drawDisjoin(cx - 85, cx - 65, cy + 25, "#38bdf8");

      drawDisjoin(cx + 65, cx + 85, cy - 25, "#ec4899");
      drawDisjoin(cx + 65, cx + 85, cy + 25, "#ec4899");

      m += '<text x="' + cx + '" y="' + (cy + 95) + '" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">Centromeres split now, allowing non-identical sister chromatids to separate!</text>';

    } else if (stageM2 === "tetrad") {
      m += '<text x="' + cx + '" y="' + (cy - 100) + '" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">TELOPHASE II: 4 Genetically Unique Haploid Gametes (Tetrad)</text>';

      // 4 distinct daughter cells (Tetrad of cells)
      var tetradCoords = [
        [cx - 80, cy - 45, "#38bdf8", "Gamete 1 (n, 1C)"],
        [cx + 80, cy - 45, "#ec4899", "Gamete 2 (n, 1C)"],
        [cx - 80, cy + 50, "#818cf8", "Gamete 3 (n, 1C)"],
        [cx + 80, cy + 50, "#f59e0b", "Gamete 4 (n, 1C)"]
      ];

      for (var t = 0; t < tetradCoords.length; t++) {
        var tc = tetradCoords[t];
        m += '<ellipse cx="' + tc[0] + '" cy="' + tc[1] + '" rx="55" ry="38" fill="rgba(30,41,59,0.7)" stroke="' + tc[2] + '" stroke-width="2"/>';
        m += '<circle cx="' + tc[0] + '" cy="' + tc[1] + '" r="16" fill="none" stroke="' + tc[2] + '" stroke-width="1.5" stroke-dasharray="3,2"/>';
        m += '<text x="' + tc[0] + '" y="' + (tc[1] + 4) + '" fill="' + tc[2] + '" font-size="10" font-weight="bold" text-anchor="middle">n = 23</text>';
        m += '<text x="' + tc[0] + '" y="' + (tc[1] + 28) + '" fill="#cbd5e1" font-size="9" text-anchor="middle">' + tc[3] + '</text>';
      }

      m += '<text x="' + cx + '" y="' + (cy + 105) + '" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">All 4 gametes are genetically distinct due to crossing over in Pachytene!</text>';
    }

    // Right details panel
    var mx = W - 180, my = 50;
    m += '<rect x="' + mx + '" y="' + my + '" width="170" height="300" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (mx + 85) + '" y="' + (my + 22) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">MEIOSIS II RULES</text>';

    m += '<text x="' + (mx + 10) + '" y="' + (my + 50) + '" fill="#fcd34d" font-size="11" font-weight="bold">• Equational Division:</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 70) + '" fill="#cbd5e1" font-size="10">  Resembles standard</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 85) + '" fill="#cbd5e1" font-size="10">  mitotic division</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 110) + '" fill="#10b981" font-size="11" font-weight="bold">• Interkinesis:</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 130) + '" fill="#cbd5e1" font-size="10">  Short gap between</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 145) + '" fill="#ef4444" font-size="10" font-weight="bold">  Meiosis I & II; NO</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 160) + '" fill="#ef4444" font-size="10" font-weight="bold">  DNA replication!</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 185) + '" fill="#ec4899" font-size="11" font-weight="bold">• Centromere Cleavage:</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 205) + '" fill="#cbd5e1" font-size="10">  Occurs at Anaphase II</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 225) + '" fill="#86efac" font-size="11" font-weight="bold">• Final Harvest:</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 245) + '" fill="#cbd5e1" font-size="10">  4 Haploid Daughter</text>';
    m += '<text x="' + (mx + 10) + '" y="' + (my + 260) + '" fill="#cbd5e1" font-size="10">  Cells (Tetrad of cells)</text>';

    svg.innerHTML = m;

    var cCount = (stageM2 === "tetrad") ? "4 Haploid Cells" : "2 Haploid Mother Cells";
    var cStateVal = (stageM2 === "anaphase2" || stageM2 === "tetrad") ? "Cleaved / Split" : "Joined at Centromere";

    readout(
      cell("Stage of Meiosis II", stageM2.toUpperCase(), "#38bdf8") +
      cell("Cell Number", cCount, "#10b981") +
      cell("Centromere State", cStateVal, stageM2 === "anaphase2" ? "#fbbf24" : "#ec4899") +
      cell("End Ploidy & DNA", "n Chromosomes, 1C DNA", "#86efac")
    );

    verdict(
      '<span style="color:#fcd34d;font-weight:700;">NCERT 10.3 Meiosis II Rule:</span> ' +
      (stageM2 === "tetrad" ?
       "Meiosis ends with Telophase II and cytokinesis, yielding a tetrad of four haploid daughter cells (gametes or spores), each containing half the chromosome number (n) and 1C DNA, genetically distinct due to crossing over." :
       (stageM2 === "anaphase2" ?
        "In Anaphase II, the centromeres of each chromosome split simultaneously, allowing non-identical sister chromatids (modified by recombination in Pachytene) to migrate to opposite poles." :
        "Meiosis II is initiated immediately after cytokinesis of Meiosis I, usually before chromosomes have fully elongated, without any intervening DNA replication during interkinesis."))
    );
  }

  return { mount: mount, setStage: setStage, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: N vs C Genomic Calculator (cytogeneticscalculator)
// -------------------------------------------------------------------------
window.SIMS.cytogeneticscalculator = (function(){
  var species = "human"; // "human" (2n=46), "onion" (2n=16), "drosophila" (2n=8)
  var selectedStage = "g1"; // "g1", "s", "g2", "metaphase", "anaphase", "gamete"

  var speciesData = {
    human: { name: "Human (Homo sapiens)", n: 23, baseC: 3.3 },
    onion: { name: "Onion (Allium cepa)", n: 8, baseC: 16.7 },
    drosophila: { name: "Fruit Fly (Drosophila)", n: 4, baseC: 0.18 }
  };

  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Chromosome Number (2n or n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#818cf8;"></span><span>DNA Content (C, 2C, 4C in picograms)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Chromatid Number</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Centromere Count</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.cytogeneticscalculator.setSpecies(\'human\')">Human (2n=46)</button>' +
      '<button class="preset-btn" onclick="SIMS.cytogeneticscalculator.setSpecies(\'onion\')">Onion (2n=16)</button>' +
      '<button class="preset-btn" onclick="SIMS.cytogeneticscalculator.setSpecies(\'drosophila\')">Drosophila (2n=8)</button>';
  }

  function setSpecies(sp){
    species = sp;
    draw();
  }

  function setStage(st){
    selectedStage = st;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var dat = speciesData[species];
    var n = dat.n;
    var twoN = n * 2;
    var baseC = dat.baseC; // 1C in pg

    // Calculate stage properties
    var curChr = twoN, curPloidy = "2n", curC = baseC * 2, cLevel = "2C", curChromatids = twoN, curCentromeres = twoN;

    if (selectedStage === "g1") {
      curChr = twoN; curPloidy = "2n"; curC = baseC * 2; cLevel = "2C"; curChromatids = twoN; curCentromeres = twoN;
    } else if (selectedStage === "s") {
      curChr = twoN; curPloidy = "2n"; curC = baseC * 4; cLevel = "2C -> 4C (Doubling)"; curChromatids = twoN * 2; curCentromeres = twoN;
    } else if (selectedStage === "g2" || selectedStage === "metaphase") {
      curChr = twoN; curPloidy = "2n"; curC = baseC * 4; cLevel = "4C"; curChromatids = twoN * 2; curCentromeres = twoN;
    } else if (selectedStage === "anaphase") {
      // Mitotic anaphase: centromere split! Transient 4n chromosomes inside cell!
      curChr = twoN * 2; curPloidy = "4n (Transiently)"; curC = baseC * 4; cLevel = "4C"; curChromatids = twoN * 2; curCentromeres = twoN * 2;
    } else if (selectedStage === "gamete") {
      curChr = n; curPloidy = "n"; curC = baseC; cLevel = "1C"; curChromatids = n; curCentromeres = n;
    }

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">NCERT N vs C GENOMIC CALCULATOR: CHROMOSOMES vs DNA</text>';

    // Stage Selection Buttons inside Canvas
    var stages = [
      { id: "g1", label: "G1 Stage" },
      { id: "s", label: "S Stage" },
      { id: "g2", label: "G2 Stage" },
      { id: "metaphase", label: "Metaphase" },
      { id: "anaphase", label: "Anaphase" },
      { id: "gamete", label: "Gamete (Meiosis End)" }
    ];

    var btnStartX = 30;
    for (var b = 0; b < stages.length; b++) {
      var st = stages[b];
      var bx = btnStartX + b * 110;
      var isActive = (selectedStage === st.id);
      m += '<rect x="' + bx + '" y="50" width="102" height="28" rx="6" fill="' + (isActive ? '#0284c7' : '#1e293b') + '" stroke="' + (isActive ? '#38bdf8' : '#475569') + '" stroke-width="1.5" style="cursor:pointer;" onclick="SIMS.cytogeneticscalculator.setStage(\'' + st.id + '\')"/>';
      m += '<text x="' + (bx + 51) + '" y="68" fill="' + (isActive ? '#ffffff' : '#94a3b8') + '" font-size="10.5" font-weight="bold" text-anchor="middle" style="cursor:pointer;" onclick="SIMS.cytogeneticscalculator.setStage(\'' + st.id + '\')">' + st.label + '</text>';
    }

    // Central display board
    var cx = W / 2 - 80;
    var cy = H / 2 + 30;

    m += '<rect x="' + (cx - 180) + '" y="' + (cy - 75) + '" width="360" height="180" rx="12" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="2"/>';
    m += '<text x="' + cx + '" y="' + (cy - 50) + '" fill="#fcd34d" font-size="15" font-weight="bold" text-anchor="middle">' + dat.name.toUpperCase() + '</text>';

    m += '<text x="' + (cx - 150) + '" y="' + (cy - 20) + '" fill="#cbd5e1" font-size="12">Selected Cellular Stage:</text>';
    m += '<text x="' + (cx + 150) + '" y="' + (cy - 20) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="end">' + selectedStage.toUpperCase() + '</text>';

    m += '<line x1="' + (cx - 150) + '" y1="' + (cy - 8) + '" x2="' + (cx + 150) + '" y2="' + (cy - 8) + '" stroke="#475569" stroke-width="1"/>';

    m += '<text x="' + (cx - 150) + '" y="' + (cy + 14) + '" fill="#cbd5e1" font-size="12">Chromosome Number (Ploidy):</text>';
    m += '<text x="' + (cx + 150) + '" y="' + (cy + 14) + '" fill="#10b981" font-size="14" font-weight="bold" text-anchor="end">' + curChr + ' (' + curPloidy + ')</text>';

    m += '<text x="' + (cx - 150) + '" y="' + (cy + 38) + '" fill="#cbd5e1" font-size="12">Total Chromatid Count:</text>';
    m += '<text x="' + (cx + 150) + '" y="' + (cy + 38) + '" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="end">' + curChromatids + ' Chromatids</text>';

    m += '<text x="' + (cx - 150) + '" y="' + (cy + 62) + '" fill="#cbd5e1" font-size="12">Centromere Count:</text>';
    m += '<text x="' + (cx + 150) + '" y="' + (cy + 62) + '" fill="#a855f7" font-size="14" font-weight="bold" text-anchor="end">' + curCentromeres + ' Centromeres</text>';

    m += '<text x="' + (cx - 150) + '" y="' + (cy + 86) + '" fill="#cbd5e1" font-size="12">DNA Content Level & Mass:</text>';
    m += '<text x="' + (cx + 150) + '" y="' + (cy + 86) + '" fill="#ec4899" font-size="13" font-weight="bold" text-anchor="end">' + cLevel + ' ≈ ' + (Math.round(curC * 100) / 100) + ' pg</text>';

    // Right guide panel
    var gx = W - 180, gy = 95;
    m += '<rect x="' + gx + '" y="' + gy + '" width="170" height="255" rx="8" fill="rgba(30,41,59,0.9)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (gx + 85) + '" y="' + (gy + 22) + '" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">NCERT EXERCISE KEY</text>';

    m += '<text x="' + (gx + 10) + '" y="' + (gy + 48) + '" fill="#fcd34d" font-size="10" font-weight="bold">Question 2 & 4 Solved:</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 65) + '" fill="#cbd5e1" font-size="9.5">• In S phase, DNA content</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 78) + '" fill="#86efac" font-size="9.5">  doubles: 2C -> 4C</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 95) + '" fill="#cbd5e1" font-size="9.5">• Chromosome number</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 108) + '" fill="#f87171" font-size="9.5">  remains strictly 2n!</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 128) + '" fill="#cbd5e1" font-size="9.5">• Because chromatids</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 141) + '" fill="#cbd5e1" font-size="9.5">  remain attached at a</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 154) + '" fill="#cbd5e1" font-size="9.5">  SINGLE centromere.</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 175) + '" fill="#fcd34d" font-size="10" font-weight="bold">Question 11 Solved:</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 192) + '" fill="#cbd5e1" font-size="9.5">• Centromere splits only</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 205) + '" fill="#cbd5e1" font-size="9.5">  in Mitotic Anaphase</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 218) + '" fill="#cbd5e1" font-size="9.5">  and Meiotic Anaphase II.</text>';
    m += '<text x="' + (gx + 10) + '" y="' + (gy + 238) + '" fill="#86efac" font-size="9.5">Gamete has n chr, 1C DNA.</text>';

    svg.innerHTML = m;

    readout(
      cell("Model Organism", dat.name.split(" ")[0] + " (2n=" + twoN + ")", "#38bdf8") +
      cell("Stage", selectedStage.toUpperCase(), "#fcd34d") +
      cell("Chromosome Count", curChr + " (" + curPloidy + ")", "#10b981") +
      cell("Chromatids", curChromatids, "#f59e0b") +
      cell("DNA Mass", (Math.round(curC * 100) / 100) + " pg (" + cLevel + ")", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT Quantitative Rule:</span> ' +
      (selectedStage === "s" ?
       "During S phase, DNA content doubles from 2C to 4C, but the chromosome number remains strictly 2n because the replicated sister chromatids stay conjoined at the original centromere until anaphase." :
       (selectedStage === "gamete" ?
        "Meiotic division is reductional: each resultant gamete receives exactly half the somatic chromosome complement (haploid n) and half the baseline somatic DNA content (1C)." :
        "Chromosome number corresponds precisely to the number of functional centromeres present inside the nucleus or cell."))
    );
  }

  return { mount: mount, setSpecies: setSpecies, setStage: setStage, draw: draw };
})();
