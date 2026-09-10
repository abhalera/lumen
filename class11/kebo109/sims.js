// kebo109 interactive simulations: Biomolecules
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
// 1. SIMULATION 1: Chemical Fractionation & Metabolites (metaboliteseparator - Ex 9.1)
// -------------------------------------------------------------------------
window.SIMS.metaboliteseparator = (function(){
  var step = "retentate"; // "grinding", "filtration", "filtrate", "retentate", "secondary"

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Acid-Soluble Filtrate (<800 Da)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Acid-Insoluble Retentate (>=10,000 Da)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Membrane Lipid Vesicles</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Secondary Metabolites</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.metaboliteseparator.setStep(\'grinding\')">1. Mortar Grinding</button>' +
      '<button class="preset-btn" onclick="SIMS.metaboliteseparator.setStep(\'filtration\')">2. Cheesecloth</button>' +
      '<button class="preset-btn" onclick="SIMS.metaboliteseparator.setStep(\'filtrate\')">3. Acid-Soluble Pool</button>' +
      '<button class="preset-btn" onclick="SIMS.metaboliteseparator.setStep(\'retentate\')">4. Macromolecules</button>' +
      '<button class="preset-btn" onclick="SIMS.metaboliteseparator.setStep(\'secondary\')">5. Secondary Metabolites</button>';
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
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 9.1: CHEMICAL ANALYSIS & BIOMACROMOLECULE FRACTIONATION</text>';

    var cx = W / 2 - 40;
    var cy = H / 2 + 10;

    if (step === "grinding" || step === "filtration") {
      // Mortar and Pestle
      m += '<path d="M ' + (cx - 80) + ' ' + (cy + 20) + ' Q ' + cx + ' ' + (cy + 100) + ' ' + (cx + 80) + ' ' + (cy + 20) + ' Z" fill="#1e293b" stroke="#475569" stroke-width="3"/>';
      m += '<text x="' + cx + '" y="' + (cy + 60) + '" fill="#cbd5e1" font-size="12" text-anchor="middle">Mortar & Slurry</text>';
      // Pestle
      m += '<rect x="' + (cx - 10) + '" y="' + (cy - 70) + '" width="20" height="95" rx="8" fill="#64748b" stroke="#94a3b8" stroke-width="2" transform="rotate(15 ' + cx + ' ' + (cy - 20) + ')"/>';
      m += '<text x="' + (cx - 110) + '" y="' + (cy - 30) + '" fill="#fcd34d" font-size="12">Living Tissue (Liver/Spinach)</text>';
      m += '<text x="' + (cx - 110) + '" y="' + (cy - 12) + '" fill="#38bdf8" font-size="11">+ Trichloroacetic Acid (Cl3CCOOH)</text>';

      if (step === "filtration") {
        // Cheesecloth funnel
        m += '<polygon points="' + (cx + 120) + ',' + (cy - 20) + ' ' + (cx + 200) + ',' + (cy - 20) + ' ' + (cx + 160) + ',' + (cy + 30) + '" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="4,2"/>';
        m += '<line x1="' + (cx + 160) + '" y1="' + (cy + 30) + '" x2="' + (cx + 160) + '" y2="' + (cy + 60) + '" stroke="#e2e8f0" stroke-width="4"/>';
        m += '<text x="' + (cx + 160) + '" y="' + (cy - 30) + '" fill="#e2e8f0" font-size="11" text-anchor="middle">Cheesecloth / Cotton</text>';
        // Beaker below
        m += '<rect x="' + (cx + 130) + '" y="' + (cy + 60) + '" width="60" height="70" rx="4" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + (cx + 160) + '" y="' + (cy + 100) + '" fill="#7dd3fc" font-size="10" text-anchor="middle">Filtrate Pool</text>';
      }
    } else if (step === "filtrate") {
      // Acid-soluble pool
      m += '<rect x="80" y="80" width="340" height="230" rx="10" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="250" y="110" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">ACID-SOLUBLE POOL (Filtrate)</text>';
      m += '<text x="100" y="145" fill="#fcd34d" font-size="12" font-weight="bold">• Molecular Weight: 18 to 800 Daltons (Da)</text>';
      m += '<text x="100" y="170" fill="#cbd5e1" font-size="12">• Represents the Cytoplasmic Pool</text>';
      m += '<text x="100" y="195" fill="#cbd5e1" font-size="12">• Thousands of small organic compounds:</text>';
      m += '<text x="120" y="220" fill="#a5f3fc" font-size="11">- Monosaccharides (Glucose, Ribose)</text>';
      m += '<text x="120" y="240" fill="#a5f3fc" font-size="11">- Amino acids (Glycine, Alanine, Serine)</text>';
      m += '<text x="120" y="260" fill="#a5f3fc" font-size="11">- Nucleotides (Adenylic acid, ATP) & Nucleosides</text>';
      m += '<text x="120" y="280" fill="#a5f3fc" font-size="11">- Inorganic mineral ions (SO4 2-, PO4 3-)</text>';
    } else if (step === "retentate") {
      // Acid-insoluble pool
      m += '<rect x="80" y="80" width="340" height="230" rx="10" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="250" y="110" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">ACID-INSOLUBLE FRACTION (Retentate)</text>';
      m += '<text x="100" y="145" fill="#fcd34d" font-size="12" font-weight="bold">• Molecular Weight: >= 10,000 Daltons (Da)</text>';
      m += '<text x="100" y="170" fill="#cbd5e1" font-size="12">• True Biomacromolecules (Polymers):</text>';
      m += '<text x="120" y="195" fill="#fed7aa" font-size="11">1. Proteins (Polypeptides of amino acids)</text>';
      m += '<text x="120" y="215" fill="#fed7aa" font-size="11">2. Polysaccharides (Cellulose, Starch, Glycogen)</text>';
      m += '<text x="120" y="235" fill="#fed7aa" font-size="11">3. Nucleic Acids (DNA & RNA polymers)</text>';
      m += '<text x="100" y="265" fill="#ec4899" font-size="11" font-weight="bold">• Lipids Paradox: MW < 800 Da (Not polymers!)</text>';
      m += '<text x="120" y="285" fill="#f472b6" font-size="10">Retained as water-insoluble membrane vesicles!</text>';
    } else { // secondary
      // Secondary metabolites table
      m += '<rect x="60" y="70" width="380" height="250" rx="8" fill="rgba(16,185,129,0.1)" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="250" y="95" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">SECONDARY METABOLITES (Ecological & Commercial)</text>';
      m += '<text x="75" y="125" fill="#fcd34d" font-size="11">Pigments: Carotenoids, Anthocyanins</text>';
      m += '<text x="75" y="150" fill="#fcd34d" font-size="11">Alkaloids: Morphine, Codeine</text>';
      m += '<text x="75" y="175" fill="#fcd34d" font-size="11">Terpenoids: Monoterpenes, Diterpenes</text>';
      m += '<text x="75" y="200" fill="#fcd34d" font-size="11">Toxins: Abrin, Ricin</text>';
      m += '<text x="75" y="225" fill="#fcd34d" font-size="11">Lectins: Concanavalin A</text>';
      m += '<text x="75" y="250" fill="#fcd34d" font-size="11">Drugs: Vinblastine, Curcumin</text>';
      m += '<text x="75" y="275" fill="#fcd34d" font-size="11">Polymeric: Rubber, Gums, Cellulose</text>';
    }

    // Side Balance Panel
    m += '<rect x="' + (W - 220) + '" y="80" width="200" height="230" rx="8" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (W - 120) + '" y="105" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">TISSUE ANALYSIS</text>';
    m += '<text x="' + (W - 205) + '" y="135" fill="#fcd34d" font-size="11">Extracting Acid:</text>';
    m += '<text x="' + (W - 205) + '" y="155" fill="#cbd5e1" font-size="11">Cl3CCOOH (Trichloroacetic)</text>';
    m += '<text x="' + (W - 205) + '" y="185" fill="#fcd34d" font-size="11">Filtrate (Acid-Soluble):</text>';
    m += '<text x="' + (W - 205) + '" y="205" fill="#38bdf8" font-size="11">18 to 800 Da (Micromolecules)</text>';
    m += '<text x="' + (W - 205) + '" y="235" fill="#fcd34d" font-size="11">Retentate (Insoluble):</text>';
    m += '<text x="' + (W - 205) + '" y="255" fill="#f59e0b" font-size="11">>= 10,000 Da (Macromolecules)</text>';
    m += '<text x="' + (W - 205) + '" y="285" fill="#ec4899" font-size="10">Lipids < 800 Da (Membranes)</text>';

    svg.innerHTML = m;

    readout(
      cell("Inspected Stage", step.toUpperCase(), "#38bdf8") +
      cell("Acid Reagent", "Trichloroacetic Acid (Cl3CCOOH)", "#10b981") +
      cell("Macromolecule MW", ">= 10,000 Daltons", "#f59e0b") +
      cell("Lipid Status", "Non-polymeric (<800 Da) in Retentate", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 9.1 Solution:</span> ' +
      "Biomacromolecules are large polymers found in the acid-insoluble retentate with molecular weights >= 10,000 Da (proteins, polysaccharides, nucleic acids). Lipids separate with them as disrupted membrane vesicles despite low molecular weights (<800 Da)."
    );
  }

  return { mount: mount, setStep: setStep, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Protein 4-Tier Hierarchy & Alanine (proteinfoldinglab - Ex 9.2 & 9.7)
// -------------------------------------------------------------------------
window.SIMS.proteinfoldinglab = (function(){
  var tier = "tertiary"; // "primary", "secondary", "tertiary", "quaternary", "alanine"

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Primary (Sequence & Peptide)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Secondary (Alpha-helix / Beta-sheet)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Tertiary (3D Active Pocket)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Quaternary (Hb Tetramer)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.proteinfoldinglab.setTier(\'tertiary\')">Tertiary (Exercise 9.2)</button>' +
      '<button class="preset-btn" onclick="SIMS.proteinfoldinglab.setTier(\'alanine\')">Alanine (Exercise 9.7)</button>' +
      '<button class="preset-btn" onclick="SIMS.proteinfoldinglab.setTier(\'primary\')">Primary Sequence</button>' +
      '<button class="preset-btn" onclick="SIMS.proteinfoldinglab.setTier(\'secondary\')">Secondary Structure</button>' +
      '<button class="preset-btn" onclick="SIMS.proteinfoldinglab.setTier(\'quaternary\')">Quaternary Tetramer</button>';
  }

  function setTier(t){
    tier = t;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 9.2 & 9.7: PROTEIN STRUCTURAL HIERARCHY & AMINO ACID ARCHITECTURE</text>';

    var cx = W / 2 - 50;
    var cy = H / 2 + 10;

    if (tier === "tertiary") {
      // Tertiary 3D folded conformation (Exercise 9.2 core)
      m += '<text x="' + cx + '" y="' + (cy - 125) + '" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">TERTIARY STRUCTURE (Hollow Woollen Ball 3D Fold)</text>';
      // Globular looping woollen ball path
      m += '<path d="M ' + (cx - 120) + ' ' + (cy + 40) + ' C ' + (cx - 140) + ' ' + (cy - 80) + ' ' + (cx - 40) + ' ' + (cy - 110) + ' ' + cx + ' ' + (cy - 60) + ' ' +
           'C ' + (cx + 40) + ' ' + (cy - 10) + ' ' + (cx + 120) + ' ' + (cy - 90) + ' ' + (cx + 130) + ' ' + cy + ' ' +
           'C ' + (cx + 140) + ' ' + (cy + 80) + ' ' + (cx + 40) + ' ' + (cy + 110) + ' ' + (cx - 20) + ' ' + (cy + 70) + ' ' +
           'C ' + (cx - 80) + ' ' + (cy + 30) + ' ' + (cx - 30) + ' ' + (cy - 20) + ' ' + (cx + 30) + ' ' + cy + ' ' +
           'C ' + (cx + 80) + ' ' + (cy + 20) + ' ' + (cx + 40) + ' ' + (cy - 50) + ' ' + (cx - 40) + ' ' + (cy - 30) + ' Z" ' +
           'fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="12" stroke-linejoin="round"/>';

      // Active site cleft
      m += '<circle cx="' + (cx + 35) + '" cy="' + (cy - 5) + '" r="22" fill="rgba(239,68,68,0.3)" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2"/>';
      m += '<text x="' + (cx + 35) + '" y="' + cy + '" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">ACTIVE SITE</text>';

      // Disulfide bridge
      m += '<line x1="' + (cx - 70) + '" y1="' + (cy - 30) + '" x2="' + (cx - 30) + '" y2="' + (cy + 30) + '" stroke="#eab308" stroke-width="4"/>';
      m += '<text x="' + (cx - 60) + '" y="' + (cy + 5) + '" fill="#eab308" font-size="10">Disulfide Bond (-S-S-)</text>';

      // Hydrogen bonds / Hydrophobic
      m += '<text x="' + cx + '" y="' + (cy + 130) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Stabilized by Disulfide, Hydrogen, Ionic & Hydrophobic interactions</text>';
      m += '<text x="' + cx + '" y="' + (cy + 148) + '" fill="#fcd34d" font-size="11" font-weight="bold" text-anchor="middle">ABSOLUTELY ESSENTIAL FOR ENZYMATIC ACTIVITY</text>';
    } else if (tier === "alanine") {
      // Alanine structure (Exercise 9.7)
      m += '<text x="' + cx + '" y="' + (cy - 120) + '" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">EXERCISE 9.7: ALANINE CHEMICAL STRUCTURE</text>';
      // Central alpha carbon
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="24" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/>';
      m += '<text x="' + cx + '" y="' + (cy + 6) + '" fill="#fff" font-size="15" font-weight="bold" text-anchor="middle">C-alpha</text>';

      // Top: Hydrogen (-H)
      m += '<line x1="' + cx + '" y1="' + (cy - 24) + '" x2="' + cx + '" y2="' + (cy - 75) + '" stroke="#94a3b8" stroke-width="4"/>';
      m += '<circle cx="' + cx + '" cy="' + (cy - 85) + '" r="16" fill="#475569"/>';
      m += '<text x="' + cx + '" y="' + (cy - 80) + '" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">H</text>';

      // Bottom: Methyl group (-CH3) - Variable R-group
      m += '<line x1="' + cx + '" y1="' + (cy + 24) + '" x2="' + cx + '" y2="' + (cy + 75) + '" stroke="#f59e0b" stroke-width="4"/>';
      m += '<rect x="' + (cx - 35) + '" y="' + (cy + 75) + '" width="70" height="34" rx="8" fill="#d97706" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="' + cx + '" y="' + (cy + 97) + '" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">CH3 (R-Group)</text>';

      // Left: Amino group (-NH2)
      m += '<line x1="' + (cx - 24) + '" y1="' + cy + '" x2="' + (cx - 85) + '" y2="' + cy + '" stroke="#10b981" stroke-width="4"/>';
      m += '<rect x="' + (cx - 145) + '" y="' + (cy - 17) + '" width="60" height="34" rx="8" fill="#047857" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="' + (cx - 115) + '" y="' + (cy + 5) + '" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">H2N</text>';

      // Right: Carboxyl group (-COOH)
      m += '<line x1="' + (cx + 24) + '" y1="' + cy + '" x2="' + (cx + 85) + '" y2="' + cy + '" stroke="#ef4444" stroke-width="4"/>';
      m += '<rect x="' + (cx + 85) + '" y="' + (cy - 17) + '" width="70" height="34" rx="8" fill="#b91c1c" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="' + (cx + 120) + '" y="' + (cy + 5) + '" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">COOH</text>';

      m += '<text x="' + cx + '" y="' + (cy + 135) + '" fill="#cbd5e1" font-size="12" text-anchor="middle">Substituted Methane with Methyl (R = -CH3) Side Chain</text>';
    } else if (tier === "primary") {
      // Primary linear sequence
      m += '<text x="' + cx + '" y="' + (cy - 80) + '" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">PRIMARY STRUCTURE: Linear Sequence & Peptide Bonds</text>';
      var aas = ["N-Term (Gly)", "Ala", "Val", "Leu", "Ile", "C-Term (Ser)"];
      for (var a = 0; a < aas.length; a++) {
        var ax = cx - 180 + a * 72;
        m += '<circle cx="' + ax + '" cy="' + cy + '" r="22" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + ax + '" y="' + (cy + 4) + '" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">' + aas[a] + '</text>';
        if (a < aas.length - 1) {
          m += '<line x1="' + (ax + 22) + '" y1="' + cy + '" x2="' + (ax + 50) + '" y2="' + cy + '" stroke="#f59e0b" stroke-width="5"/>';
          m += '<text x="' + (ax + 36) + '" y="' + (cy - 8) + '" fill="#fcd34d" font-size="8" text-anchor="middle">-CO-NH-</text>';
        }
      }
      m += '<text x="' + cx + '" y="' + (cy + 60) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">First amino acid is N-terminal; last amino acid is C-terminal</text>';
    } else if (tier === "secondary") {
      // Secondary alpha-helix
      m += '<text x="' + cx + '" y="' + (cy - 90) + '" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">SECONDARY STRUCTURE: Right-Handed Alpha-Helix</text>';
      m += '<path d="M ' + (cx - 150) + ' ' + cy + ' Q ' + (cx - 100) + ' ' + (cy - 60) + ' ' + (cx - 50) + ' ' + cy + ' Q ' + cx + ' ' + (cy + 60) + ' ' + (cx + 50) + ' ' + cy + ' Q ' + (cx + 100) + ' ' + (cy - 60) + ' ' + (cx + 150) + ' ' + cy + '" fill="none" stroke="#10b981" stroke-width="8"/>';
      // Hydrogen bonds across turns
      m += '<line x1="' + (cx - 100) + '" y1="' + (cy - 20) + '" x2="' + (cx - 50) + '" y2="' + (cy + 20) + '" stroke="#ec4899" stroke-width="2" stroke-dasharray="3,3"/>';
      m += '<line x1="' + cx + '" y1="' + (cy - 20) + '" x2="' + (cx + 50) + '" y2="' + (cy + 20) + '" stroke="#ec4899" stroke-width="2" stroke-dasharray="3,3"/>';
      m += '<text x="' + cx + '" y="' + (cy + 85) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Intra-chain hydrogen bonds between C=O and N-H stabilize right-handed spiral</text>';
    } else { // quaternary
      // Quaternary hemoglobin tetramer (2 alpha + 2 beta)
      m += '<text x="' + cx + '" y="' + (cy - 100) + '" fill="#ec4899" font-size="15" font-weight="bold" text-anchor="middle">QUATERNARY STRUCTURE: Adult Hemoglobin Tetramer (alpha2 beta2)</text>';
      // 4 subunits
      m += '<circle cx="' + (cx - 45) + '" cy="' + (cy - 30) + '" r="38" fill="rgba(56,189,248,0.4)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx - 45) + '" y="' + (cy - 25) + '" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">alpha 1</text>';
      m += '<circle cx="' + (cx + 45) + '" cy="' + (cy - 30) + '" r="38" fill="rgba(56,189,248,0.4)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx + 45) + '" y="' + (cy - 25) + '" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">alpha 2</text>';
      m += '<circle cx="' + (cx - 45) + '" cy="' + (cy + 50) + '" r="38" fill="rgba(236,72,153,0.4)" stroke="#ec4899" stroke-width="2"/>';
      m += '<text x="' + (cx - 45) + '" y="' + (cy + 55) + '" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">beta 1</text>';
      m += '<circle cx="' + (cx + 45) + '" cy="' + (cy + 50) + '" r="38" fill="rgba(236,72,153,0.4)" stroke="#ec4899" stroke-width="2"/>';
      m += '<text x="' + (cx + 45) + '" y="' + (cy + 55) + '" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">beta 2</text>';
      m += '<text x="' + cx + '" y="' + (cy + 115) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Assembly of 4 independent polypeptide chains into functional allosteric complex</text>';
    }

    // Side Info Panel
    m += '<rect x="' + (W - 200) + '" y="80" width="180" height="220" rx="8" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (W - 110) + '" y="105" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">' + tier.toUpperCase() + '</text>';
    m += '<text x="' + (W - 190) + '" y="135" fill="#fcd34d" font-size="11">Bond Types:</text>';
    m += '<text x="' + (W - 190) + '" y="155" fill="#cbd5e1" font-size="11">' + (tier === "primary" ? "Peptide (-CO-NH-)" : (tier === "secondary" ? "Hydrogen bonds" : (tier === "tertiary" ? "-S-S-, Ionic, Hydrophobic" : (tier === "alanine" ? "Covalent C-C, C-N" : "Non-covalent subunit")))) + '</text>';
    m += '<text x="' + (W - 190) + '" y="185" fill="#fcd34d" font-size="11">Enzymatic Power:</text>';
    m += '<text x="' + (W - 190) + '" y="205" fill="#10b981" font-size="11">' + (tier === "tertiary" ? "ACTIVE (Active Sites)" : "Inactive in isolation") + '</text>';
    m += '<text x="' + (W - 190) + '" y="235" fill="#fcd34d" font-size="11">Key Example:</text>';
    m += '<text x="' + (W - 190) + '" y="255" fill="#ec4899" font-size="11">' + (tier === "alanine" ? "Alanine (R=-CH3)" : (tier === "quaternary" ? "Hb (alpha2 beta2)" : (tier === "tertiary" ? "Myoglobin/Enzymes" : "Keratin/Silk"))) + '</text>';

    svg.innerHTML = m;

    readout(
      cell("Focused Architecture", tier.toUpperCase(), "#38bdf8") +
      cell("3D Active Site", tier === "tertiary" ? "FORMED (Hollow Woollen Fold)" : (tier === "alanine" ? "Substituted Methane" : "Backbone conformation"), "#10b981") +
      cell("Alanine R-Group", "-CH3 (Methyl Group)", "#f59e0b") +
      cell("Biospheric Champion", "RuBisCO (Plants) / Collagen (Animals)", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 9.2 & 9.7 Solution:</span> ' +
      (tier === "alanine" ? "Alanine is a substituted methane consisting of central alpha-carbon bonded to -NH2, -COOH, -H, and a methyl group (-CH3)." :
       "Tertiary structure is the 3D folding of a polypeptide upon itself like a hollow woollen ball; it forms the catalytic active sites essential for biological enzymatic function.")
    );
  }

  return { mount: mount, setTier: setTier, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Triglyceride Assembler & Lipids (lipidtriglyceridelab - Ex 9.5)
// -------------------------------------------------------------------------
window.SIMS.lipidtriglyceridelab = (function(){
  var lipidType = "triglyceride"; // "triglyceride", "palmitic", "phospholipid"

  function mount(){
    App.state.maxT = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Glycerol Backbone</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fatty Acid Hydrocarbon Tails</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Ester Linkages (-O-CO-)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Polar Phosphorylated Head</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.lipidtriglyceridelab.setLipid(\'triglyceride\')">Triglyceride (Exercise 9.5)</button>' +
      '<button class="preset-btn" onclick="SIMS.lipidtriglyceridelab.setLipid(\'palmitic\')">Palmitic Acid (16C)</button>' +
      '<button class="preset-btn" onclick="SIMS.lipidtriglyceridelab.setLipid(\'phospholipid\')">Lecithin Phospholipid</button>';
  }

  function setLipid(l){
    lipidType = l;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 9.5: TRIGLYCERIDE COMPOSITION & LIPID BIOCHEMISTRY</text>';

    var cx = W / 2 - 50;
    var cy = H / 2 + 10;

    if (lipidType === "triglyceride") {
      // Glycerol vertical backbone (CH2 - CH - CH2)
      m += '<text x="' + cx + '" y="' + (cy - 120) + '" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">TRIGLYCERIDE: 1 Glycerol + 3 Fatty Acids via 3 Ester Bonds</text>';
      m += '<rect x="' + (cx - 140) + '" y="' + (cy - 70) + '" width="75" height="150" rx="8" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx - 102) + '" y="' + (cy - 40) + '" fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle">CH2</text>';
      m += '<text x="' + (cx - 102) + '" y="' + cy + '" fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle">CH</text>';
      m += '<text x="' + (cx - 102) + '" y="' + (cy + 45) + '" fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle">CH2</text>';
      m += '<text x="' + (cx - 102) + '" y="' + (cy + 100) + '" fill="#38bdf8" font-size="11" text-anchor="middle">Glycerol</text>';

      // 3 Ester bonds (-O-CO-) and fatty acid tails
      var offsets = [-40, 0, 45];
      for (var f = 0; f < 3; f++) {
        var fy = cy + offsets[f];
        // Ester bond
        m += '<rect x="' + (cx - 55) + '" y="' + (fy - 12) + '" width="60" height="24" rx="4" fill="#b91c1c" stroke="#ef4444" stroke-width="1.5"/>';
        m += '<text x="' + (cx - 25) + '" y="' + (fy + 4) + '" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">O-CO-</text>';
        // Hydrocarbon zigzag tail
        m += '<path d="M ' + (cx + 5) + ' ' + fy + ' L ' + (cx + 35) + ' ' + (fy - 8) + ' L ' + (cx + 65) + ' ' + (fy + 8) + ' L ' + (cx + 95) + ' ' + (fy - 8) + ' L ' + (cx + 125) + ' ' + (fy + 8) + ' L ' + (cx + 155) + ' ' + fy + '" fill="none" stroke="#f59e0b" stroke-width="4"/>';
        m += '<text x="' + (cx + 180) + '" y="' + (fy + 4) + '" fill="#fcd34d" font-size="11">R' + (f + 1) + ' Tail</text>';
      }
      m += '<text x="' + cx + '" y="' + (cy + 130) + '" fill="#cbd5e1" font-size="12" text-anchor="middle">Elimination of 3 H2O molecules yields triacylglycerol neutral storage fat</text>';
    } else if (lipidType === "palmitic") {
      // Palmitic acid: 16 carbons
      m += '<text x="' + cx + '" y="' + (cy - 100) + '" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">PALMITIC ACID: 16-Carbon Saturated Fatty Acid</text>';
      m += '<text x="' + cx + '" y="' + (cy - 60) + '" fill="#fcd34d" font-size="13" font-weight="bold" text-anchor="middle">CH3-(CH2)14-COOH (16 Carbons Total)</text>';
      // Carboxyl head
      m += '<rect x="' + (cx - 180) + '" y="' + (cy - 20) + '" width="60" height="40" rx="8" fill="#b91c1c" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="' + (cx - 150) + '" y="' + (cy + 5) + '" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">COOH</text>';
      // Long hydrocarbon chain
      var px = cx - 120;
      var py = cy;
      var dStr = 'M ' + px + ' ' + py;
      for (var c = 1; c <= 15; c++) {
        var npx = px + c * 18;
        var npy = py + ((c % 2 === 1) ? -16 : 16);
        dStr += ' L ' + npx + ' ' + npy;
      }
      m += '<path d="' + dStr + '" fill="none" stroke="#f59e0b" stroke-width="4"/>';
      m += '<text x="' + cx + '" y="' + (cy + 60) + '" fill="#cbd5e1" font-size="12" text-anchor="middle">Zero double bonds (Saturated) -> Solid fat at room temperature</text>';
      m += '<text x="' + cx + '" y="' + (cy + 85) + '" fill="#a5f3fc" font-size="11" text-anchor="middle">Compare with Arachidonic Acid: 20 Carbons & 4 Double Bonds (Polyunsaturated)</text>';
    } else { // phospholipid
      // Lecithin
      m += '<text x="' + cx + '" y="' + (cy - 100) + '" fill="#ec4899" font-size="15" font-weight="bold" text-anchor="middle">LECITHIN (Phosphatidylcholine): Membrane Phospholipid</text>';
      // Polar head
      m += '<circle cx="' + (cx - 100) + '" cy="' + cy + '" r="35" fill="rgba(56,189,248,0.4)" stroke="#38bdf8" stroke-width="3"/>';
      m += '<text x="' + (cx - 100) + '" y="' + (cy - 5) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Choline +</text>';
      m += '<text x="' + (cx - 100) + '" y="' + (cy + 12) + '" fill="#fcd34d" font-size="10" font-weight="bold" text-anchor="middle">Phosphate</text>';
      m += '<text x="' + (cx - 100) + '" y="' + (cy + 55) + '" fill="#38bdf8" font-size="11" text-anchor="middle">Hydrophilic Head</text>';

      // Two fatty acid tails
      m += '<path d="M ' + (cx - 65) + ' ' + (cy - 12) + ' Q ' + cx + ' ' + (cy - 30) + ' ' + (cx + 80) + ' ' + (cy - 15) + ' T ' + (cx + 160) + ' ' + (cy - 20) + '" fill="none" stroke="#f59e0b" stroke-width="5"/>';
      m += '<path d="M ' + (cx - 65) + ' ' + (cy + 12) + ' Q ' + cx + ' ' + (cy + 30) + ' ' + (cx + 80) + ' ' + (cy + 15) + ' T ' + (cx + 160) + ' ' + (cy + 35) + '" fill="none" stroke="#f59e0b" stroke-width="5"/>';
      m += '<text x="' + (cx + 100) + '" y="' + (cy + 75) + '" fill="#f59e0b" font-size="11">Two Hydrophobic Fatty Acid Tails</text>';
      m += '<text x="' + cx + '" y="' + (cy + 125) + '" fill="#cbd5e1" font-size="12" text-anchor="middle">Amphipathic nature drives spontaneous assembly into lipid bilayers</text>';
    }

    // Side Info Panel
    m += '<rect x="' + (W - 200) + '" y="80" width="180" height="220" rx="8" fill="rgba(30,41,59,0.85)" stroke="#f59e0b" stroke-width="1.5"/>';
    m += '<text x="' + (W - 110) + '" y="105" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">LIPID METRICS</text>';
    m += '<text x="' + (W - 190) + '" y="135" fill="#fcd34d" font-size="11">Glycerol Type:</text>';
    m += '<text x="' + (W - 190) + '" y="155" fill="#cbd5e1" font-size="11">Trihydroxy propane</text>';
    m += '<text x="' + (W - 190) + '" y="180" fill="#fcd34d" font-size="11">Linkage:</text>';
    m += '<text x="' + (W - 190) + '" y="200" fill="#ef4444" font-size="11">Ester Bond (-O-CO-)</text>';
    m += '<text x="' + (W - 190) + '" y="225" fill="#fcd34d" font-size="11">Carbon Rules:</text>';
    m += '<text x="' + (W - 190) + '" y="245" fill="#38bdf8" font-size="10">Palmitic = 16 Carbons</text>';
    m += '<text x="' + (W - 190) + '" y="265" fill="#ec4899" font-size="10">Arachidonic = 20 Carbons</text>';

    svg.innerHTML = m;

    readout(
      cell("Lipid Molecule", lipidType.toUpperCase(), "#38bdf8") +
      cell("Ester Bonds", lipidType === "triglyceride" ? "3 Ester Linkages" : (lipidType === "phospholipid" ? "2 Ester + 1 Phosphoester" : "Carboxyl Group"), "#10b981") +
      cell("Water Solubility", "INSOLUBLE (Non-polar)", "#ef4444") +
      cell("Cellular Role", lipidType === "triglyceride" ? "Storage Fat (Adipose)" : (lipidType === "phospholipid" ? "Membrane Bilayer" : "Fatty Acid Precursor"), "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 9.5 Solution:</span> ' +
      "A triglyceride is composed of one molecule of glycerol (trihydroxy propane) esterified with three fatty acid molecules through three ester linkages, releasing three water molecules."
    );
  }

  return { mount: mount, setLipid: setLipid, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Polysaccharide Architecture (polysaccharidelab - Ex 9.8)
// -------------------------------------------------------------------------
window.SIMS.polysaccharidelab = (function(){
  var pType = "starch"; // "starch", "cellulose", "glycogen", "gum_fevicol"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Starch (Helical Iodine Trap)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Cellulose (Linear Ribbon)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Glycogen (Branched Reserve)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Gum vs Fevicol (Ex 9.8)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.polysaccharidelab.setPType(\'starch\')">Starch (Iodine Blue)</button>' +
      '<button class="preset-btn" onclick="SIMS.polysaccharidelab.setPType(\'cellulose\')">Cellulose (Linear)</button>' +
      '<button class="preset-btn" onclick="SIMS.polysaccharidelab.setPType(\'glycogen\')">Glycogen (Branched)</button>' +
      '<button class="preset-btn" onclick="SIMS.polysaccharidelab.setPType(\'gum_fevicol\')">Gum vs Fevicol (Ex 9.8)</button>';
  }

  function setPType(p){
    pType = p;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 9.8: POLYSACCHARIDE CONFORMATION & GUM VS FEVICOL</text>';

    var cx = W / 2 - 50;
    var cy = H / 2 + 10;

    if (pType === "starch") {
      // Starch: Helical secondary coil with trapped Iodine
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">STARCH: Helical Secondary Structure Trapping Iodine (I2)</text>';
      // Helical spring path
      m += '<path d="M ' + (cx - 160) + ' ' + (cy + 20) + ' ' +
           'C ' + (cx - 140) + ' ' + (cy - 60) + ' ' + (cx - 100) + ' ' + (cy - 60) + ' ' + (cx - 80) + ' ' + (cy + 20) + ' ' +
           'C ' + (cx - 60) + ' ' + (cy + 80) + ' ' + (cx - 20) + ' ' + (cy + 80) + ' ' + cx + ' ' + (cy + 20) + ' ' +
           'C ' + (cx + 20) + ' ' + (cy - 60) + ' ' + (cx + 60) + ' ' + (cy - 60) + ' ' + (cx + 80) + ' ' + (cy + 20) + ' ' +
           'C ' + (cx + 100) + ' ' + (cy + 80) + ' ' + (cx + 140) + ' ' + (cy + 80) + ' ' + (cx + 160) + ' ' + (cy + 20) + '" ' +
           'fill="none" stroke="#2563eb" stroke-width="14"/>';

      // Trapped Iodine molecules inside the helical coil
      m += '<circle cx="' + (cx - 90) + '" cy="' + cy + '" r="12" fill="#1e1b4b" stroke="#60a5fa" stroke-width="3"/>';
      m += '<text x="' + (cx - 90) + '" y="' + (cy + 4) + '" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">I2</text>';
      m += '<circle cx="' + (cx + 70) + '" cy="' + cy + '" r="12" fill="#1e1b4b" stroke="#60a5fa" stroke-width="3"/>';
      m += '<text x="' + (cx + 70) + '" y="' + (cy + 4) + '" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">I2</text>';

      m += '<text x="' + cx + '" y="' + (cy + 115) + '" fill="#60a5fa" font-size="13" font-weight="bold" text-anchor="middle">DEEP BLUE COMPLEX FORMED</text>';
      m += '<text x="' + cx + '" y="' + (cy + 135) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">alpha-1,4 glycosidic linkages coil into helical tunnels that accommodate polyiodide</text>';
    } else if (pType === "cellulose") {
      // Cellulose: Linear straight ribbon, no helices
      m += '<text x="' + cx + '" y="' + (cy - 100) + '" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">CELLULOSE: Linear Rigid Ribbon (beta-1,4 Glucan)</text>';
      for (var b = 0; b < 3; b++) {
        var by = cy - 35 + b * 35;
        m += '<line x1="' + (cx - 160) + '" y1="' + by + '" x2="' + (cx + 160) + '" y2="' + by + '" stroke="#10b981" stroke-width="8"/>';
      }
      m += '<text x="' + cx + '" y="' + (cy + 95) + '" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">NO COLOR WITH IODINE</text>';
      m += '<text x="' + cx + '" y="' + (cy + 120) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Linear beta-1,4 ribbons lack helical coils; cannot physically trap I2 molecules</text>';
    } else if (pType === "glycogen") {
      // Glycogen: Highly branched tree
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">GLYCOGEN: Branched Animal Storage Polysaccharide</text>';
      // Main trunk
      m += '<line x1="' + (cx - 160) + '" y1="' + cy + '" x2="' + (cx + 160) + '" y2="' + cy + '" stroke="#f59e0b" stroke-width="8"/>';
      m += '<text x="' + (cx - 175) + '" y="' + (cy + 4) + '" fill="#fcd34d" font-size="10">Non-reducing</text>';
      m += '<text x="' + (cx + 175) + '" y="' + (cy + 4) + '" fill="#fcd34d" font-size="10">Reducing</text>';
      // Branches (alpha-1,6)
      m += '<line x1="' + (cx - 60) + '" y1="' + cy + '" x2="' + (cx - 20) + '" y2="' + (cy - 50) + '" stroke="#d97706" stroke-width="6"/>';
      m += '<line x1="' + (cx + 40) + '" y1="' + cy + '" x2="' + (cx + 80) + '" y2="' + (cy - 50) + '" stroke="#d97706" stroke-width="6"/>';
      m += '<line x1="' + (cx - 20) + '" y1="' + cy + '" x2="' + (cx + 20) + '" y2="' + (cy + 50) + '" stroke="#d97706" stroke-width="6"/>';
      m += '<text x="' + cx + '" y="' + (cy + 115) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">alpha-1,4 linear chains + alpha-1,6 branch points every 8–12 residues; stains red-brown with iodine</text>';
    } else { // gum_fevicol (Exercise 9.8)
      m += '<text x="' + cx + '" y="' + (cy - 110) + '" fill="#ec4899" font-size="15" font-weight="bold" text-anchor="middle">EXERCISE 9.8: NATURAL GUM VS SYNTHETIC FEVICOL</text>';
      // Left box: Natural Gum
      m += '<rect x="' + (cx - 170) + '" y="' + (cy - 70) + '" width="150" height="150" rx="8" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="' + (cx - 95) + '" y="' + (cy - 40) + '" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">NATURAL GUM</text>';
      m += '<text x="' + (cx - 160) + '" y="' + (cy - 10) + '" fill="#a7f3d0" font-size="11">• Complex heteropolysaccharide</text>';
      m += '<text x="' + (cx - 160) + '" y="' + (cy + 10) + '" fill="#a7f3d0" font-size="11">• Plant origin (Wound exudate)</text>';
      m += '<text x="' + (cx - 160) + '" y="' + (cy + 30) + '" fill="#a7f3d0" font-size="11">• Galactose, Arabinose, Uronic</text>';
      m += '<text x="' + (cx - 160) + '" y="' + (cy + 55) + '" fill="#fcd34d" font-size="10">Biodegradable carbohydrate</text>';

      // Right box: Fevicol
      m += '<rect x="' + (cx + 20) + '" y="' + (cy - 70) + '" width="150" height="150" rx="8" fill="rgba(236,72,153,0.15)" stroke="#ec4899" stroke-width="2"/>';
      m += '<text x="' + (cx + 95) + '" y="' + (cy - 40) + '" fill="#ec4899" font-size="13" font-weight="bold" text-anchor="middle">FEVICOL</text>';
      m += '<text x="' + (cx + 30) + '" y="' + (cy - 10) + '" fill="#fbcfe8" font-size="11">• Synthetic polyvinyl resin</text>';
      m += '<text x="' + (cx + 30) + '" y="' + (cy + 10) + '" fill="#fbcfe8" font-size="11">• Petrochemical synthetic polymer</text>';
      m += '<text x="' + (cx + 30) + '" y="' + (cy + 30) + '" fill="#fbcfe8" font-size="11">• Polyvinyl Alcohol / Acetate</text>';
      m += '<text x="' + (cx + 30) + '" y="' + (cy + 55) + '" fill="#fcd34d" font-size="10">Zero carbohydrate content</text>';

      m += '<text x="' + cx + '" y="' + (cy + 120) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">Fevicol is completely different: synthetic petroleum resin vs natural carbohydrate gum</text>';
    }

    // Side Info Panel
    m += '<rect x="' + (W - 200) + '" y="80" width="180" height="220" rx="8" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (W - 110) + '" y="105" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">CARBOHYDRATE</text>';
    m += '<text x="' + (W - 190) + '" y="135" fill="#fcd34d" font-size="11">Bond Linkage:</text>';
    m += '<text x="' + (W - 190) + '" y="155" fill="#cbd5e1" font-size="11">Glycosidic Linkage</text>';
    m += '<text x="' + (W - 190) + '" y="180" fill="#fcd34d" font-size="11">Iodine Reaction:</text>';
    m += '<text x="' + (W - 190) + '" y="200" fill="#38bdf8" font-size="11">' + (pType === "starch" ? "DEEP BLUE (Helical)" : "NO COLOR (Linear)") + '</text>';
    m += '<text x="' + (W - 190) + '" y="225" fill="#fcd34d" font-size="11">Arthropod Exoskeleton:</text>';
    m += '<text x="' + (W - 190) + '" y="245" fill="#10b981" font-size="11">Chitin (NAG Polymer)</text>';
    m += '<text x="' + (W - 190) + '" y="270" fill="#ec4899" font-size="10">Inulin = Fructose Polymer</text>';

    svg.innerHTML = m;

    readout(
      cell("Polysaccharide", pType.toUpperCase(), "#38bdf8") +
      cell("Iodine Coloration", pType === "starch" ? "DEEP BLUE (Helical Trap)" : "NEGATIVE (No color)", pType === "starch" ? "#38bdf8" : "#94a3b8") +
      cell("Gums Nature", "Plant Heteropolysaccharide", "#10b981") +
      cell("Fevicol Nature", "Synthetic Polyvinyl Resin (PVAc)", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 9.8 Solution:</span> ' +
      (pType === "gum_fevicol" ? "Natural plant gums are complex bio-organic heteropolysaccharides of galactose/arabinose; Fevicol is a synthetic petrochemical adhesive based on polyvinyl alcohol/acetate with zero carbohydrate units." :
       (pType === "starch" ? "Starch forms helical secondary coils trapping iodine molecules into a deep blue complex." :
        "Cellulose forms rigid linear ribbons that lack helical coils and cannot trap iodine molecules."))
    );
  }

  return { mount: mount, setPType: setPType, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Watson-Crick B-DNA Double Helix (dnadoublehelixsim)
// -------------------------------------------------------------------------
window.SIMS.dnadoublehelixsim = (function(){
  var pairFocus = "both"; // "both", "at", "gc"

  function mount(){
    App.state.maxT = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sugar-Phosphate Antiparallel Backbone</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Adenine = Thymine (2 H-Bonds)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Guanine ≡ Cytosine (3 H-Bonds)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Pitch = 3.4 nm (10 bp/turn)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.dnadoublehelixsim.setFocus(\'both\')">Complete B-DNA Turn</button>' +
      '<button class="preset-btn" onclick="SIMS.dnadoublehelixsim.setFocus(\'at\')">A = T (2 H-Bonds)</button>' +
      '<button class="preset-btn" onclick="SIMS.dnadoublehelixsim.setFocus(\'gc\')">G ≡ C (3 H-Bonds)</button>';
  }

  function setFocus(f){
    pairFocus = f;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">WATSON-CRICK B-DNA DOUBLE HELIX & BASE-PAIRING ARCHITECTURE</text>';

    var cx = W / 2 - 50;
    var startY = 75;
    var endY = 325;
    var pitchHeight = endY - startY; // 250 px = 1 complete 3.4 nm turn

    // Draw the 10 Base Pairs of 1 Helical Turn
    var basePairs = [
      { type: "AT", label: "A = T" },
      { type: "GC", label: "G ≡ C" },
      { type: "AT", label: "T = A" },
      { type: "GC", label: "C ≡ G" },
      { type: "GC", label: "G ≡ C" },
      { type: "AT", label: "A = T" },
      { type: "GC", label: "C ≡ G" },
      { type: "AT", label: "T = A" },
      { type: "AT", label: "A = T" },
      { type: "GC", label: "G ≡ C" }
    ];

    var n = basePairs.length; // 10 bp
    for (var i = 0; i < n; i++) {
      var angle = (i / n) * 2 * Math.PI;
      var y = startY + (i / (n - 1)) * pitchHeight;
      var span = 100 * Math.sin(angle);
      var x1 = cx - span;
      var x2 = cx + span;

      var bp = basePairs[i];
      var isAT = bp.type === "AT";
      var color = isAT ? "#ec4899" : "#10b981";
      var strokeW = (pairFocus === "both" || (pairFocus === "at" && isAT) || (pairFocus === "gc" && !isAT)) ? 4 : 1.5;
      var opacity = (pairFocus === "both" || (pairFocus === "at" && isAT) || (pairFocus === "gc" && !isAT)) ? 1.0 : 0.25;

      // Base pair rung
      m += '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" stroke="' + color + '" stroke-width="' + strokeW + '" opacity="' + opacity + '"/>';

      // Hydrogen bonds markers
      if (Math.abs(span) > 25) {
        var hCount = isAT ? 2 : 3;
        m += '<text x="' + cx + '" y="' + (y - 4) + '" fill="' + color + '" font-size="9" opacity="' + opacity + '" text-anchor="middle">' + bp.label + '</text>';
      }

      // Sugar-phosphate backbone nodes
      m += '<circle cx="' + x1 + '" cy="' + y + '" r="5" fill="#38bdf8" opacity="' + opacity + '"/>';
      m += '<circle cx="' + x2 + '" cy="' + y + '" r="5" fill="#0284c7" opacity="' + opacity + '"/>';
    }

    // Antiparallel Strand Polarity Labels
    m += '<text x="' + (cx - 120) + '" y="' + (startY - 10) + '" fill="#38bdf8" font-size="12" font-weight="bold">5\' End</text>';
    m += '<text x="' + (cx + 110) + '" y="' + (startY - 10) + '" fill="#0284c7" font-size="12" font-weight="bold">3\' End</text>';
    m += '<text x="' + (cx - 120) + '" y="' + (endY + 20) + '" fill="#38bdf8" font-size="12" font-weight="bold">3\' End</text>';
    m += '<text x="' + (cx + 110) + '" y="' + (endY + 20) + '" fill="#0284c7" font-size="12" font-weight="bold">5\' End</text>';

    // Metric brackets
    m += '<line x1="' + (cx - 150) + '" y1="' + startY + '" x2="' + (cx - 150) + '" y2="' + endY + '" stroke="#fcd34d" stroke-width="2"/>';
    m += '<text x="' + (cx - 165) + '" y="' + (cy - 10) + '" fill="#fcd34d" font-size="12" font-weight="bold" transform="rotate(-90 ' + (cx - 165) + ' ' + (cy - 10) + ')" text-anchor="middle">1 Turn = 3.4 nm (Pitch)</text>';

    // Side Info Panel
    m += '<rect x="' + (W - 200) + '" y="80" width="180" height="220" rx="8" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (W - 110) + '" y="105" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">B-DNA METRICS</text>';
    m += '<text x="' + (W - 190) + '" y="135" fill="#fcd34d" font-size="11">Helical Pitch:</text>';
    m += '<text x="' + (W - 190) + '" y="155" fill="#cbd5e1" font-size="11">3.4 nm (34 Å) per turn</text>';
    m += '<text x="' + (W - 190) + '" y="180" fill="#fcd34d" font-size="11">Base Pairs / Turn:</text>';
    m += '<text x="' + (W - 190) + '" y="200" fill="#cbd5e1" font-size="11">10 base pairs</text>';
    m += '<text x="' + (W - 190) + '" y="225" fill="#fcd34d" font-size="11">Rise per Pair:</text>';
    m += '<text x="' + (W - 190) + '" y="245" fill="#10b981" font-size="11">0.34 nm (3.4 Å)</text>';
    m += '<text x="' + (W - 190) + '" y="270" fill="#ec4899" font-size="10">A=T (2 H) | G≡C (3 H)</text>';

    svg.innerHTML = m;

    readout(
      cell("B-DNA Pitch", "3.4 nm (34 Å)", "#38bdf8") +
      cell("Base Pairs per Turn", "10 Base Pairs", "#10b981") +
      cell("Rise per Base Pair", "0.34 nm (3.4 Å)", "#f59e0b") +
      cell("Strand Polarity", "Antiparallel (5'->3' / 3'->5')", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Watson-Crick B-DNA Axiom:</span> ' +
      "B-DNA is a right-handed antiparallel double helix with pitch of 3.4 nm, 10 bp per turn (0.34 nm rise), stabilized by complementary base pairs (A=T via 2 H-bonds, G≡C via 3 H-bonds) and hydrophobic base-stacking."
    );
  }

  return { mount: mount, setFocus: setFocus, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Activation Energy & Transition State (activationenergylab - Ex 9.11)
// -------------------------------------------------------------------------
window.SIMS.activationenergylab = (function(){
  var cat = "with_enzyme"; // "without_enzyme", "with_enzyme"

  function mount(){
    App.state.maxT = 2;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Uncatalyzed Activation Energy (High Barrier)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Enzyme-Catalyzed Activation Energy (Low Barrier)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Substrate (S) & Product (P) Levels</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.activationenergylab.setCat(\'with_enzyme\')">With Enzyme (Low Ea)</button>' +
      '<button class="preset-btn" onclick="SIMS.activationenergylab.setCat(\'without_enzyme\')">Without Enzyme (High Ea)</button>';
  }

  function setCat(c){
    cat = c;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 9.11: ENZYME CATALYSIS & ACTIVATION ENERGY REDUCTION</text>';

    var ox = 100;
    var oy = 310;

    // Axes
    m += '<line x1="' + ox + '" y1="' + oy + '" x2="' + (W - 180) + '" y2="' + oy + '" stroke="#64748b" stroke-width="2"/>';
    m += '<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="70" stroke="#64748b" stroke-width="2"/>';
    m += '<text x="' + (W - 200) + '" y="' + (oy + 25) + '" fill="#cbd5e1" font-size="11">Progress of Reaction</text>';
    m += '<text x="' + (ox - 40) + '" y="85" fill="#cbd5e1" font-size="11" transform="rotate(-90 ' + (ox - 40) + ' 85)" text-anchor="middle">Potential Energy</text>';

    // Substrate level (S)
    var sY = 220;
    m += '<line x1="' + ox + '" y1="' + sY + '" x2="' + (ox + 60) + '" y2="' + sY + '" stroke="#38bdf8" stroke-width="4"/>';
    m += '<text x="' + (ox + 30) + '" y="' + (sY - 8) + '" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Substrate (S)</text>';

    // Product level (P)
    var pY = 270;
    m += '<line x1="' + (W - 250) + '" y1="' + pY + '" x2="' + (W - 190) + '" y2="' + pY + '" stroke="#38bdf8" stroke-width="4"/>';
    m += '<text x="' + (W - 220) + '" y="' + (pY - 8) + '" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Product (P)</text>';

    // Net Delta G (Exothermic)
    m += '<line x1="' + (W - 220) + '" y1="' + sY + '" x2="' + (W - 220) + '" y2="' + pY + '" stroke="#fcd34d" stroke-width="2" stroke-dasharray="3,3"/>';
    m += '<text x="' + (W - 210) + '" y="' + (sY + 25) + '" fill="#fcd34d" font-size="10">Delta G (Constant)</text>';

    // Uncatalyzed curve (High peak)
    var uncathY = 90;
    m += '<path d="M ' + (ox + 60) + ' ' + sY + ' Q ' + (ox + 160) + ' ' + uncathY + ' ' + (W - 250) + ' ' + pY + '" fill="none" stroke="#ef4444" stroke-width="' + (cat === "without_enzyme" ? 4 : 2) + '" stroke-dasharray="' + (cat === "with_enzyme" ? "4,4" : "none") + '"/>';
    m += '<text x="' + (ox + 170) + '" y="' + (uncathY - 10) + '" fill="#f87171" font-size="11" font-weight="bold">Transition State (Without Enzyme)</text>';

    // Catalyzed curve (Low peak)
    var cathY = 150;
    m += '<path d="M ' + (ox + 60) + ' ' + sY + ' Q ' + (ox + 160) + ' ' + cathY + ' ' + (W - 250) + ' ' + pY + '" fill="none" stroke="#10b981" stroke-width="' + (cat === "with_enzyme" ? 4 : 2) + '"/>';
    m += '<text x="' + (ox + 170) + '" y="' + (cathY - 8) + '" fill="#34d399" font-size="11" font-weight="bold">Transition State (With Enzyme)</text>';

    // Arrow showing reduction in Ea
    m += '<line x1="' + (ox + 160) + '" y1="' + uncathY + '" x2="' + (ox + 160) + '" y2="' + cathY + '" stroke="#fcd34d" stroke-width="3"/><polygon points="' + (ox + 155) + ',' + cathY + ' ' + (ox + 165) + ',' + cathY + ' ' + (ox + 160) + ',' + (cathY + 8) + '" fill="#fcd34d"/>';
    m += '<text x="' + (ox + 165) + '" y="' + (cathY - 25) + '" fill="#fcd34d" font-size="10">Ea Reduced!</text>';

    // Side Info Panel
    m += '<rect x="' + (W - 170) + '" y="80" width="160" height="220" rx="8" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (W - 90) + '" y="105" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">CATALYTIC POWER</text>';
    m += '<text x="' + (W - 160) + '" y="135" fill="#fcd34d" font-size="10">Carbonic Anhydrase:</text>';
    m += '<text x="' + (W - 160) + '" y="155" fill="#f87171" font-size="10">Uncat: 200 molec/hr</text>';
    m += '<text x="' + (W - 160) + '" y="175" fill="#10b981" font-size="10">Cat: 600,000 / sec!</text>';
    m += '<text x="' + (W - 160) + '" y="200" fill="#fcd34d" font-size="10">Acceleration:</text>';
    m += '<text x="' + (W - 160) + '" y="220" fill="#38bdf8" font-size="11" font-weight="bold">10 Million Times</text>';
    m += '<text x="' + (W - 160) + '" y="250" fill="#cbd5e1" font-size="10">Delta G: Unchanged</text>';
    m += '<text x="' + (W - 160) + '" y="270" fill="#cbd5e1" font-size="10">Keq: Unchanged</text>';

    svg.innerHTML = m;

    readout(
      cell("Catalyst State", cat === "with_enzyme" ? "WITH ENZYME" : "WITHOUT ENZYME", cat === "with_enzyme" ? "#10b981" : "#ef4444") +
      cell("Activation Energy (Ea)", cat === "with_enzyme" ? "DRAMATICALLY LOWERED" : "HIGH BARRIER", cat === "with_enzyme" ? "#10b981" : "#ef4444") +
      cell("Net Reaction Delta G", "UNCHANGED (Thermodynamic Invariant)", "#fcd34d") +
      cell("Rate Enhancement", cat === "with_enzyme" ? "10^6 to 10^12 fold" : "Basal / Slow", "#38bdf8")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 9.11 Activation Energy Axiom:</span> ' +
      (cat === "with_enzyme" ? "Enzymes do not alter overall delta G or equilibrium constant; they bind substrates to stabilize the transition state, drastically lowering the activation energy barrier." :
       "Without enzymes, high activation energy limits the number of reactant molecules possessing sufficient kinetic energy to react at physiological temperatures.")
    );
  }

  return { mount: mount, setCat: setCat, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Michaelis-Menten Kinetics & Malonate (enzymekineticslab - Ex 9.11)
// -------------------------------------------------------------------------
window.SIMS.enzymekineticslab = (function(){
  var inhibitor = "none"; // "none", "malonate"
  var sConc = 5; // 1..10

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Normal Velocity Curve (No Inhibitor)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Competitive Inhibition (Malonate)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Vmax (Max Velocity)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Km (Michaelis Constant)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.enzymekineticslab.setInhibitor(\'none\')">Normal Kinetics</button>' +
      '<button class="preset-btn" onclick="SIMS.enzymekineticslab.setInhibitor(\'malonate\')">Add Malonate (Competitive)</button>' +
      '<button class="preset-btn" onclick="SIMS.enzymekineticslab.adjustS(2)">Low [S]</button>' +
      '<button class="preset-btn" onclick="SIMS.enzymekineticslab.adjustS(9)">Saturating [S]</button>';
  }

  function setInhibitor(i){
    inhibitor = i;
    draw();
  }

  function adjustS(s){
    sConc = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 9.11: MICHAELIS-MENTEN KINETICS & COMPETITIVE MALONATE INHIBITION</text>';

    var ox = 90;
    var oy = 300;

    // Axes
    m += '<line x1="' + ox + '" y1="' + oy + '" x2="' + (W - 180) + '" y2="' + oy + '" stroke="#64748b" stroke-width="2"/>';
    m += '<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="70" stroke="#64748b" stroke-width="2"/>';
    m += '<text x="' + (W - 200) + '" y="' + (oy + 25) + '" fill="#cbd5e1" font-size="11">Substrate Concentration [S]</text>';
    m += '<text x="' + (ox - 35) + '" y="90" fill="#cbd5e1" font-size="11" transform="rotate(-90 ' + (ox - 35) + ' 90)" text-anchor="middle">Velocity (v)</text>';

    // Vmax dashed line
    var vmaxY = 110;
    m += '<line x1="' + ox + '" y1="' + vmaxY + '" x2="' + (W - 180) + '" y2="' + vmaxY + '" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,4"/>';
    m += '<text x="' + (W - 170) + '" y="' + (vmaxY + 4) + '" fill="#f59e0b" font-size="11" font-weight="bold">Vmax</text>';

    // Vmax / 2 line
    var halfVmaxY = oy - (oy - vmaxY) / 2; // 205
    m += '<line x1="' + ox + '" y1="' + halfVmaxY + '" x2="' + (W - 180) + '" y2="' + halfVmaxY + '" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>';
    m += '<text x="' + (ox - 10) + '" y="' + (halfVmaxY + 4) + '" fill="#94a3b8" font-size="10" text-anchor="end">Vmax/2</text>';

    // Kinetic hyperbola curve
    // Normal curve (Km = 2.0)
    var normalD = 'M ' + ox + ' ' + oy;
    for (var s = 0; s <= 20; s += 0.5) {
      var x = ox + s * 20;
      var v = (190 * s) / (2.5 + s);
      var y = oy - v;
      normalD += ' L ' + x + ' ' + y;
    }
    m += '<path d="' + normalD + '" fill="none" stroke="#10b981" stroke-width="3.5"/>';

    // Competitive inhibitor curve (Malonate: apparent Km = 6.0, Vmax identical!)
    if (inhibitor === "malonate") {
      var malD = 'M ' + ox + ' ' + oy;
      for (var s2 = 0; s2 <= 20; s2 += 0.5) {
        var x2 = ox + s2 * 20;
        var v2 = (190 * s2) / (7.0 + s2);
        var y2 = oy - v2;
        malD += ' L ' + x2 + ' ' + y2;
      }
      m += '<path d="' + malD + '" fill="none" stroke="#ef4444" stroke-width="3.5"/>';
      m += '<text x="' + (ox + 180) + '" y="235" fill="#f87171" font-size="11" font-weight="bold">+ MALONATE (Km Increased)</text>';
    }

    // Operating point based on sConc
    var curKm = (inhibitor === "malonate") ? 7.0 : 2.5;
    var curV = (190 * sConc) / (curKm + sConc);
    var curX = ox + sConc * 20;
    var curY = oy - curV;

    m += '<circle cx="' + curX + '" cy="' + curY + '" r="7" fill="#fcd34d" stroke="#fff" stroke-width="2"/>';
    m += '<line x1="' + curX + '" y1="' + oy + '" x2="' + curX + '" y2="' + curY + '" stroke="#fcd34d" stroke-width="1.5" stroke-dasharray="4,2"/>';
    m += '<text x="' + curX + '" y="' + (oy + 16) + '" fill="#fcd34d" font-size="10" text-anchor="middle">[S]=' + sConc + '</text>';

    // Side Info Panel
    m += '<rect x="' + (W - 170) + '" y="80" width="160" height="230" rx="8" fill="rgba(30,41,59,0.85)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (W - 90) + '" y="105" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">INHIBITION METRICS</text>';
    m += '<text x="' + (W - 160) + '" y="130" fill="#fcd34d" font-size="10">Target Enzyme:</text>';
    m += '<text x="' + (W - 160) + '" y="145" fill="#cbd5e1" font-size="10">Succinate Dehydrogenase</text>';
    m += '<text x="' + (W - 160) + '" y="170" fill="#fcd34d" font-size="10">Competitive Inhibitor:</text>';
    m += '<text x="' + (W - 160) + '" y="185" fill="#f87171" font-size="10">Malonate (Mimics succinate)</text>';
    m += '<text x="' + (W - 160) + '" y="210" fill="#fcd34d" font-size="10">Vmax Behavior:</text>';
    m += '<text x="' + (W - 160) + '" y="225" fill="#10b981" font-size="10">UNCHANGED at high [S]</text>';
    m += '<text x="' + (W - 160) + '" y="250" fill="#fcd34d" font-size="10">Km Behavior:</text>';
    m += '<text x="' + (W - 160) + '" y="265" fill="#ef4444" font-size="10">Apparent Km INCREASES</text>';
    m += '<text x="' + (W - 160) + '" y="290" fill="#38bdf8" font-size="9">Cofactor: NAD (Niacin) / Zn2+</text>';

    svg.innerHTML = m;

    readout(
      cell("Inhibitor Status", inhibitor === "malonate" ? "MALONATE PRESENT" : "NONE (Standard)", inhibitor === "malonate" ? "#ef4444" : "#10b981") +
      cell("Vmax Velocity", "CONSTANT (Can be reached at high [S])", "#10b981") +
      cell("Apparent Km", inhibitor === "malonate" ? "INCREASED (Lower Affinity)" : "Normal Km", inhibitor === "malonate" ? "#ef4444" : "#38bdf8") +
      cell("Operating Velocity", Math.round(curV) + " / 190 max", "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 9.11 Competitive Inhibition Rule:</span> ' +
      (inhibitor === "malonate" ? "Malonate closely resembles succinate and competes for the active site of succinate dehydrogenase. Vmax remains unchanged because excess substrate outcompetes the inhibitor, but the apparent Km increases." :
       "In Michaelis-Menten kinetics, velocity increases hyperbolically with substrate concentration until active sites become saturated at Vmax; Km reflects the substrate concentration at half Vmax.")
    );
  }

  return { mount: mount, setInhibitor: setInhibitor, adjustS: adjustS, draw: draw };
})();
