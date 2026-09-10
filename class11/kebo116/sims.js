// kebo116 interactive simulations: Excretory Products and their Elimination
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
// 1. SIMULATION 1: Comparative Excretion & Renal Anatomy (nephronarchitecturesim)
// -------------------------------------------------------------------------
window.SIMS.nephronarchitecturesim = (function(){
  var view = "nitrogenous"; // "nitrogenous", "gross_anatomy", "nephron_types"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ammonotelic (Aquatic / High Water)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Ureotelic (Mammals / Urea Cycle)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Uricotelic (Paste/Pellet / Water Conservation)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Juxtamedullary vs Cortical Nephrons</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.nephronarchitecturesim.setView(\'nitrogenous\')">1. Nitrogenous Wastes: Toxicity &amp; Osmotic Cost</button>' +
        '<button class="preset-btn" onclick="SIMS.nephronarchitecturesim.setView(\'gross_anatomy\')">2. Kidney Morpho-Anatomy &amp; Zonation</button>' +
        '<button class="preset-btn" onclick="SIMS.nephronarchitecturesim.setView(\'nephron_types\')">3. Cortical (85%) vs Juxtamedullary (15%) Nephrons</button>';
    }
    render(0);
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

    if (view === "nitrogenous") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">COMPARATIVE NITROGENOUS EXCRETION: TOXICITY, ENERGETICS &amp; WATER CONSERVATION</text>';

      // Card 1: Ammonotelism
      svg += '<g transform="translate(20, 60)">';
      svg += '<rect x="0" y="0" width="225" height="290" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<rect x="0" y="0" width="225" height="36" fill="#0284c7" rx="8"/>';
      svg += '<text x="112" y="24" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">1. Ammonotelism (NH3)</text>';
      svg += '<text x="15" y="65" fill="#38bdf8" font-size="11" font-weight="bold">Primary Excretory Form:</text>';
      svg += '<text x="15" y="85" fill="#f8fafc" font-size="11">• Ammonia (NH3)</text>';
      svg += '<text x="15" y="115" fill="#ef4444" font-size="11" font-weight="bold">Toxicity Index: EXTREME</text>';
      svg += '<text x="15" y="135" fill="#94a3b8" font-size="10">• Highly toxic, must be excreted rapidly</text>';
      svg += '<text x="15" y="165" fill="#38bdf8" font-size="11" font-weight="bold">Water Required / Gram:</text>';
      svg += '<text x="15" y="185" fill="#f8fafc" font-size="12" font-weight="bold">~ 300 – 500 mL H2O / g N</text>';
      svg += '<text x="15" y="215" fill="#fbbf24" font-size="11" font-weight="bold">Metabolic Energy Cost:</text>';
      svg += '<text x="15" y="235" fill="#f8fafc" font-size="10">• LOWEST (direct deamination product)</text>';
      svg += '<text x="15" y="260" fill="#38bdf8" font-size="11" font-weight="bold">Representative Taxa:</text>';
      svg += '<text x="15" y="278" fill="#e2e8f0" font-size="10">Aquatic bony fishes, amphibians, insects</text>';
      svg += '</g>';

      // Card 2: Ureotelism
      svg += '<g transform="translate(265, 60)">';
      svg += '<rect x="0" y="0" width="225" height="290" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<rect x="0" y="0" width="225" height="36" fill="#d97706" rx="8"/>';
      svg += '<text x="112" y="24" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">2. Ureotelism (Urea)</text>';
      svg += '<text x="15" y="65" fill="#fbbf24" font-size="11" font-weight="bold">Primary Excretory Form:</text>';
      svg += '<text x="15" y="85" fill="#f8fafc" font-size="11">• Urea (CO(NH2)2)</text>';
      svg += '<text x="15" y="115" fill="#f59e0b" font-size="11" font-weight="bold">Toxicity Index: MODERATE</text>';
      svg += '<text x="15" y="135" fill="#94a3b8" font-size="10">• 100,000× less toxic than ammonia</text>';
      svg += '<text x="15" y="165" fill="#fbbf24" font-size="11" font-weight="bold">Water Required / Gram:</text>';
      svg += '<text x="15" y="185" fill="#f8fafc" font-size="12" font-weight="bold">~ 50 mL H2O / g N</text>';
      svg += '<text x="15" y="215" fill="#fbbf24" font-size="11" font-weight="bold">Synthesis Location:</text>';
      svg += '<text x="15" y="235" fill="#f8fafc" font-size="10">• Liver (Krebs-Henseleit Ornithine Cycle)</text>';
      svg += '<text x="15" y="260" fill="#fbbf24" font-size="11" font-weight="bold">Representative Taxa:</text>';
      svg += '<text x="15" y="278" fill="#e2e8f0" font-size="10">Mammals, terrestrial amphibians, sharks</text>';
      svg += '</g>';

      // Card 3: Uricotelism
      svg += '<g transform="translate(510, 60)">';
      svg += '<rect x="0" y="0" width="230" height="290" fill="#1e293b" rx="8" stroke="#34d399" stroke-width="2"/>';
      svg += '<rect x="0" y="0" width="230" height="36" fill="#059669" rx="8"/>';
      svg += '<text x="115" y="24" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">3. Uricotelism (Uric Acid)</text>';
      svg += '<text x="15" y="65" fill="#34d399" font-size="11" font-weight="bold">Primary Excretory Form:</text>';
      svg += '<text x="15" y="85" fill="#f8fafc" font-size="11">• Uric Acid (C5H4N4O3)</text>';
      svg += '<text x="15" y="115" fill="#10b981" font-size="11" font-weight="bold">Toxicity Index: LOWEST</text>';
      svg += '<text x="15" y="135" fill="#94a3b8" font-size="10">• Insoluble paste / white crystalline pellet</text>';
      svg += '<text x="15" y="165" fill="#34d399" font-size="11" font-weight="bold">Water Required / Gram:</text>';
      svg += '<text x="15" y="185" fill="#f8fafc" font-size="12" font-weight="bold">~ 5 – 10 mL H2O / g N</text>';
      svg += '<text x="15" y="215" fill="#fbbf24" font-size="11" font-weight="bold">Metabolic Energy Cost:</text>';
      svg += '<text x="15" y="235" fill="#f8fafc" font-size="10">• HIGHEST (complex multi-step purine path)</text>';
      svg += '<text x="15" y="260" fill="#34d399" font-size="11" font-weight="bold">Representative Taxa:</text>';
      svg += '<text x="15" y="278" fill="#e2e8f0" font-size="10">Reptiles, birds, land snails, insects</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Ammonotelic Taxa', 'Aquatic Bony Fishes &amp; Amphibians', '#38bdf8') +
              cell('Ureotelic Taxa', 'Mammals &amp; Terrestrial Amphibians', '#fbbf24') +
              cell('Uricotelic Form', 'Pellet / Paste (5-10 mL H2O)', '#34d399') +
              cell('Urea Synthesis', 'Liver Ornithine Cycle', '#f59e0b');

      vHtml = '<strong>Evolutionary Adaptation in Nitrogenous Excretion:</strong> Animals eliminate nitrogen produced by protein and nucleic acid catabolism via three principal pathways. <em>Ammonia</em> is highly water-soluble but intensely toxic; aquatic organisms diffuse it directly into ambient water with zero energy investment. Terrestrial vertebrates convert toxic ammonia to <em>urea</em> in hepatocytes via the ornithine cycle, expending ATP to achieve a 100,000-fold reduction in toxicity. Uricotelic organisms (birds, arid reptiles, insects) expend maximal ATP to precipitate insoluble <em>uric acid</em>, conserving critical water stores in hyper-arid habitats.';
    } else if (view === "gross_anatomy") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HUMAN RENAL MORPHO-ANATOMY: LONGITUDINAL SECTION &amp; HISTOLOGICAL ZONATION</text>';

      // Left: Kidney LS Diagram
      svg += '<g transform="translate(60, 55)">';
      // Outer capsule
      svg += '<path d="M 120 20 C 220 20, 270 90, 270 170 C 270 250, 220 310, 120 310 C 70 310, 30 250, 60 170 C 30 90, 70 20, 120 20 Z" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>';
      // Cortex ring
      svg += '<path d="M 120 32 C 210 32, 255 95, 255 170 C 255 245, 210 298, 120 298 C 80 298, 48 245, 75 170 C 48 95, 80 32, 120 32 Z" fill="#991b1b" opacity="0.85"/>';

      // Renal Pelvis & Calyces
      svg += '<path d="M 75 170 L 130 140 L 130 200 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>';
      svg += '<path d="M 60 170 L 10 185 L 10 240" fill="none" stroke="#eab308" stroke-width="6"/>'; // Ureter

      // Medullary Pyramids (striated cones)
      var pyramids = [
        { x1: 140, y1: 65, x2: 210, y2: 80, x3: 175, y3: 130 },
        { x1: 175, y1: 110, x2: 235, y2: 145, x3: 165, y3: 170 },
        { x1: 165, y1: 175, x2: 235, y2: 200, x3: 165, y3: 235 },
        { x1: 140, y1: 275, x2: 210, y2: 260, x3: 175, y3: 210 }
      ];
      for (var p = 0; p < pyramids.length; p++) {
        var pyr = pyramids[p];
        svg += '<polygon points="' + pyr.x1 + ',' + pyr.y1 + ' ' + pyr.x2 + ',' + pyr.y2 + ' ' + pyr.x3 + ',' + pyr.y3 + '" fill="#b91c1c" stroke="#f87171" stroke-width="1.5"/>';
      }

      // Column of Bertin
      svg += '<line x1="175" y1="130" x2="230" y2="125" stroke="#fca5a5" stroke-width="2" stroke-dasharray="3,3"/>';

      // Labels on Kidney
      svg += '<text x="10" y="260" fill="#facc15" font-size="11" font-weight="bold">Ureter</text>';
      svg += '<text x="280" y="55" fill="#f87171" font-size="11">Renal Capsule</text>';
      svg += '<text x="280" y="100" fill="#fca5a5" font-size="11">Renal Cortex</text>';
      svg += '<text x="280" y="130" fill="#cbd5e1" font-size="10">Column of Bertin</text>';
      svg += '<text x="280" y="175" fill="#f87171" font-size="11">Medullary Pyramid</text>';
      svg += '<text x="280" y="215" fill="#fef08a" font-size="11">Renal Pelvis / Calyx</text>';
      svg += '<text x="5" y="150" fill="#94a3b8" font-size="11">Hilum (Notch)</text>';
      svg += '</g>';

      // Right: Structural Anatomy Specs
      svg += '<g transform="translate(420, 60)">';
      svg += '<rect x="0" y="0" width="310" height="290" fill="#1e293b" rx="8" stroke="#334155"/>';
      svg += '<text x="20" y="28" fill="#38bdf8" font-size="13" font-weight="bold">Morphometric Dimensions:</text>';
      svg += '<text x="20" y="52" fill="#f8fafc" font-size="11">• Length: 10 – 12 cm</text>';
      svg += '<text x="20" y="72" fill="#f8fafc" font-size="11">• Width: 5 – 7 cm | Thickness: 2 – 3 cm</text>';
      svg += '<text x="20" y="92" fill="#f8fafc" font-size="11">• Average Mass: 120 – 170 g</text>';
      svg += '<text x="20" y="112" fill="#f8fafc" font-size="11">• Position: T12 to L3 retroperitoneal</text>';

      svg += '<line x1="20" y1="126" x2="290" y2="126" stroke="#334155"/>';
      svg += '<text x="20" y="148" fill="#fbbf24" font-size="13" font-weight="bold">Internal Zonal Architecture:</text>';
      svg += '<text x="20" y="172" fill="#fca5a5" font-size="11">• Outer Cortex: Malpighian corpuscles, PCT, DCT</text>';
      svg += '<text x="20" y="194" fill="#f87171" font-size="11">• Inner Medulla: Conical pyramids (8-18)</text>';
      svg += '<text x="20" y="216" fill="#cbd5e1" font-size="11">• Columns of Bertin: Cortical extensions into medulla</text>';
      svg += '<text x="20" y="238" fill="#fef08a" font-size="11">• Hilum: Entry point for renal artery, renal vein, ureter</text>';
      svg += '<text x="20" y="260" fill="#34d399" font-size="11">• Functional Units: ~ 1 Million Nephrons / kidney</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Kidney Dimensions', '10-12 cm x 5-7 cm x 2-3 cm', '#38bdf8') +
              cell('Average Weight', '120 – 170 grams', '#fbbf24') +
              cell('Nephron Density', '~ 1 Million / Kidney', '#34d399') +
              cell('Anatomical Position', 'T12 – L3 Retroperitoneal', '#a78bfa');

      vHtml = '<strong>Gross Renal Architecture:</strong> Each human kidney is a bean-shaped, reddish-brown retroperitoneal organ extending between the 12th thoracic and 3rd lumbar vertebrae. Centrally situated on the concave medial border is the <em>hilum</em>, leading to the funnel-shaped <em>renal pelvis</em> with projecting calyces. Histologically, the parenchyma comprises an outer granular <em>cortex</em> and an inner striated <em>medulla</em> subdivided into conical renal pyramids. Cortical tissue extending between adjacent medullary pyramids forms the <em>Columns of Bertin</em>.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">CORTICAL NEPHRONS (85%) VS JUXTAMEDULLARY NEPHRONS (15%)</text>';

      // Left Panel: Cortical Nephron
      svg += '<g transform="translate(30, 55)">';
      svg += '<rect x="0" y="0" width="335" height="300" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="167" y="26" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Cortical Nephron (80 – 85%)</text>';

      // Boundary line Cortex/Medulla
      svg += '<line x1="15" y1="120" x2="320" y2="120" stroke="#64748b" stroke-dasharray="4,4"/>';
      svg += '<text x="20" y="114" fill="#94a3b8" font-size="10">CORTEX</text>';
      svg += '<text x="20" y="136" fill="#94a3b8" font-size="10">MEDULLA</text>';

      // Malpighian body high in cortex
      svg += '<circle cx="120" cy="65" r="16" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>';
      svg += '<text x="145" y="70" fill="#f8fafc" font-size="10">Bowman Capsule</text>';

      // Short Loop of Henle barely dipping into medulla
      svg += '<path d="M 120 81 C 120 110, 110 145, 125 155 C 140 145, 135 110, 145 81" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      svg += '<text x="150" y="155" fill="#38bdf8" font-size="10" font-weight="bold">Short Loop of Henle</text>';

      // Features
      svg += '<text x="20" y="200" fill="#f8fafc" font-size="11">• Corpuscle in outer renal cortex</text>';
      svg += '<text x="20" y="222" fill="#f8fafc" font-size="11">• Loop of Henle is short &amp; extends minimally into medulla</text>';
      svg += '<text x="20" y="244" fill="#fbbf24" font-size="11">• Capillaries: Peritubular capillary network</text>';
      svg += '<text x="20" y="266" fill="#ef4444" font-size="11">• Vasa recta: Absent or highly reduced</text>';
      svg += '<text x="20" y="288" fill="#34d399" font-size="11">• Primary Role: Routine solute &amp; water clearance</text>';
      svg += '</g>';

      // Right Panel: Juxtamedullary Nephron
      svg += '<g transform="translate(395, 55)">';
      svg += '<rect x="0" y="0" width="335" height="300" fill="#1e293b" rx="8" stroke="#ec4899" stroke-width="2"/>';
      svg += '<text x="167" y="26" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">Juxtamedullary Nephron (15 – 20%)</text>';

      // Boundary line Cortex/Medulla
      svg += '<line x1="15" y1="120" x2="320" y2="120" stroke="#64748b" stroke-dasharray="4,4"/>';
      svg += '<text x="20" y="114" fill="#94a3b8" font-size="10">CORTEX</text>';
      svg += '<text x="20" y="136" fill="#94a3b8" font-size="10">MEDULLA</text>';

      // Malpighian body near corticomedullary junction
      svg += '<circle cx="120" cy="100" r="16" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>';
      svg += '<text x="145" y="105" fill="#f8fafc" font-size="10">Deep Juxta-Cortex</text>';

      // Very long Loop of Henle deep into inner medulla
      svg += '<path d="M 120 116 C 120 170, 95 240, 125 260 C 155 240, 140 170, 145 116" fill="none" stroke="#ec4899" stroke-width="3"/>';
      svg += '<text x="150" y="240" fill="#f472b6" font-size="10" font-weight="bold">Long Loop of Henle</text>';

      // Vasa recta hairpin parallel
      svg += '<path d="M 160 125 C 160 175, 175 235, 165 255" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2"/>';
      svg += '<text x="175" y="220" fill="#fca5a5" font-size="9">Vasa Recta</text>';

      // Features
      svg += '<text x="20" y="200" fill="#f8fafc" font-size="11">• Corpuscle at corticomedullary boundary</text>';
      svg += '<text x="20" y="222" fill="#f8fafc" font-size="11">• Loop of Henle is long &amp; plunges into inner medulla</text>';
      svg += '<text x="20" y="244" fill="#fbbf24" font-size="11">• Capillaries: Well-developed hairpin Vasa Recta</text>';
      svg += '<text x="20" y="266" fill="#34d399" font-size="11">• Primary Role: Medullary hyperosmotic gradient</text>';
      svg += '<text x="20" y="288" fill="#f472b6" font-size="11">• Crucial for concentrating hypertonic urine</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Cortical Nephron Fraction', '80 – 85% of total', '#38bdf8') +
              cell('Juxtamedullary Fraction', '15 – 20% of total', '#ec4899') +
              cell('Vasa Recta Presence', 'Exclusive to Juxtamedullary', '#f43f5e') +
              cell('Osmotic Gradient Generator', 'Juxtamedullary Nephrons', '#10b981');

      vHtml = '<strong>Cortical vs Juxtamedullary Nephron Specialization:</strong> Human kidneys house two distinct nephron populations. In <em>cortical nephrons</em> (85%), the Malpighian corpuscle sits in the outer cortex and the loop of Henle is exceedingly short, dipping only superficially into the outer medulla, served by peritubular capillaries. In <em>juxtamedullary nephrons</em> (15%), corpuscles reside adjacent to the corticomedullary junction, and their exceptionally elongated loops of Henle penetrate deep into the renal papilla alongside specialized hairpin capillary loops termed <em>vasa recta</em>. This architecture enables the countercurrent multiplier engine to concentrate urine up to 1200 mOsm/L.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Glomerular Ultrafiltration (glomerularfiltrationsim)
// -------------------------------------------------------------------------
window.SIMS.glomerularfiltrationsim = (function(){
  var view = "membrane"; // "membrane", "starling_pressures", "gfr_metrics"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Afferent / Glomerular Capillaries</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Podocytes &amp; Slit Pores</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Net Filtration Pressure (NFP = +10 mmHg)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>GFR = 125 mL/min (180 L/day)</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.glomerularfiltrationsim.setView(\'membrane\')">1. Filtration Membrane: 3 Layers &amp; Slit Pores</button>' +
        '<button class="preset-btn" onclick="SIMS.glomerularfiltrationsim.setView(\'starling_pressures\')">2. Starling Filtration Pressures (NFP Vector)</button>' +
        '<button class="preset-btn" onclick="SIMS.glomerularfiltrationsim.setView(\'gfr_metrics\')">3. GFR Metrics &amp; JGA Autoregulation</button>';
    }
    render(0);
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

    if (view === "membrane") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">THE GLOMERULAR FILTRATION MEMBRANE: THREE CELLULAR &amp; ACELLULAR LAYERS</text>';

      // Layer 1: Fenestrated Glomerular Endothelium
      svg += '<g transform="translate(40, 60)">';
      svg += '<rect x="0" y="0" width="680" height="60" fill="#7f1d1d" rx="6"/>';
      svg += '<text x="15" y="25" fill="#fca5a5" font-size="12" font-weight="bold">1. Endothelium of Glomerular Blood Vessels</text>';
      // Fenestrations (pores 70-100 nm)
      for (var f = 0; f < 12; f++) {
        svg += '<rect x="' + (50 + f * 52) + '" y="35" width="22" height="15" fill="#0f172a" rx="2"/>';
      }
      svg += '<text x="15" y="54" fill="#fecaca" font-size="10">Porous Fenestrations: Retains RBCs, WBCs, and Platelets inside capillary lumen</text>';
      svg += '</g>';

      // Layer 2: Basement Membrane (Acellular Collagen/Proteoglycan Gel)
      svg += '<g transform="translate(40, 135)">';
      svg += '<rect x="0" y="0" width="680" height="40" fill="#1e3a8a" rx="6"/>';
      svg += '<text x="15" y="25" fill="#93c5fd" font-size="12" font-weight="bold">2. Acellular Basement Membrane (Glycoprotein Gel Matrix)</text>';
      svg += '<text x="430" y="25" fill="#60a5fa" font-size="10">Negative Heparan Sulfate: Repels Albumin</text>';
      svg += '</g>';

      // Layer 3: Visceral Epithelium of Bowman Capsule (Podocytes & Slit Pores)
      svg += '<g transform="translate(40, 190)">';
      svg += '<rect x="0" y="0" width="680" height="85" fill="#065f46" rx="6"/>';
      svg += '<text x="15" y="25" fill="#6ee7b7" font-size="12" font-weight="bold">3. Podocyte Epithelium of Bowman&#39;s Capsule (Visceral Layer)</text>';
      // Pedicels (interdigitating foot processes)
      for (var p = 0; p < 14; p++) {
        svg += '<path d="M ' + (50 + p * 44) + ' 35 L ' + (75 + p * 44) + ' 35 L ' + (70 + p * 44) + ' 60 L ' + (55 + p * 44) + ' 60 Z" fill="#059669" stroke="#34d399"/>';
      }
      svg += '<text x="15" y="75" fill="#a7f3d0" font-size="10">Interdigitating Pedicels create Filtration Slits / Slit Pores (~ 25 nm width)</text>';
      svg += '</g>';

      // Bottom: Filtrate Composition
      svg += '<g transform="translate(40, 290)">';
      svg += '<rect x="0" y="0" width="680" height="75" fill="#1e293b" rx="6" stroke="#fbbf24"/>';
      svg += '<text x="20" y="25" fill="#fbbf24" font-size="12" font-weight="bold">Glomerular Ultrafiltrate (Primary Urine) Characteristics:</text>';
      svg += '<text x="20" y="45" fill="#f8fafc" font-size="11">• Protein-free plasma: Water, glucose, amino acids, urea, uric acid, creatinine, Na+, K+, Cl-, HCO3-</text>';
      svg += '<text x="20" y="65" fill="#ef4444" font-size="11">• Excluded: Blood cells (erythrocytes, leucocytes) &amp; plasma proteins (albumin, globulins, fibrinogen)</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Filtration Layers', '3 Layers (Endo + BM + Podocyte)', '#38bdf8') +
              cell('Endothelial Pores', 'Fenestrations (70–100 nm)', '#ef4444') +
              cell('Podocyte Openings', 'Filtration Slits (Slit Pores ~25 nm)', '#34d399') +
              cell('Filtrate Makeup', 'Plasma MINUS Proteins &amp; Cells', '#fbbf24');

      vHtml = '<strong>Tri-Layer Glomerular Ultrafiltration Barrier:</strong> Blood passing through glomerular capillaries undergoes ultrafiltration across three microscopic sieves: (1) <em>fenestrated capillary endothelium</em> containing pores that exclude cellular elements; (2) the acellular <em>basement membrane</em> whose polyanionic proteoglycan mesh repels negatively charged serum albumin; and (3) the visceral layer of <em>Bowman&#39;s capsule</em>, composed of specialized epithelial cells termed <em>podocytes</em>. Podocyte foot processes (pedicels) interdigitate to leave microscopic apertures termed <em>filtration slits</em> or <em>slit pores</em>. Because virtually all fluid components except proteins pass through, this process is termed <strong>ultrafiltration</strong>.';
    } else if (view === "starling_pressures") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">STARLING HEMODYNAMIC PRESSURES: NET FILTRATION PRESSURE (NFP) EQUATION</text>';

      // Pressure Vectors Diagram
      svg += '<g transform="translate(50, 70)">';
      // Bowman capsule outline
      svg += '<path d="M 50 20 C 150 20, 220 80, 220 160 C 220 240, 150 300, 50 300" fill="#0f172a" stroke="#475569" stroke-width="4"/>';
      // Glomerular Capillary Knot
      svg += '<circle cx="100" cy="160" r="65" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>';
      svg += '<text x="100" y="165" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Glomerular</text>';
      svg += '<text x="100" y="180" fill="#fca5a5" font-size="11" text-anchor="middle">Capillaries</text>';

      // Vector 1: GHP (Forward Filtration ->)
      svg += '<line x1="165" y1="130" x2="260" y2="130" stroke="#22c55e" stroke-width="6" marker-end="url(#arrow)"/>';
      svg += '<text x="270" y="135" fill="#4ade80" font-size="12" font-weight="bold">+ PGHP = +60 mmHg (Outward Force)</text>';

      // Vector 2: CHP (Opposing <-)
      svg += '<line x1="240" y1="165" x2="165" y2="165" stroke="#ef4444" stroke-width="4"/>';
      svg += '<text x="250" y="170" fill="#f87171" font-size="12" font-weight="bold">- PCHP = -18 mmHg (Opposing Force)</text>';

      // Vector 3: BCOP (Opposing <-)
      svg += '<line x1="260" y1="200" x2="165" y2="200" stroke="#f59e0b" stroke-width="4"/>';
      svg += '<text x="270" y="205" fill="#fbbf24" font-size="12" font-weight="bold">- πBCOP = -32 mmHg (Opposing Oncotic)</text>';
      svg += '</g>';

      // Equation & Breakdown Panel
      svg += '<g transform="translate(360, 210)">';
      svg += '<rect x="0" y="0" width="360" height="135" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="20" y="30" fill="#38bdf8" font-size="14" font-weight="bold">Net Filtration Pressure Equation:</text>';
      svg += '<text x="20" y="58" fill="#f8fafc" font-size="13">NFP = PGHP - (PCHP + πBCOP)</text>';
      svg += '<text x="20" y="85" fill="#4ade80" font-size="14" font-weight="bold">NFP = 60 - (18 + 32) = +10 mmHg</text>';
      svg += '<text x="20" y="112" fill="#94a3b8" font-size="11">Net driving pressure forcing plasma across filtration barrier</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Glomerular Hydrostatic (PGHP)', '+60 mmHg (Favors Filtration)', '#22c55e') +
              cell('Capsular Hydrostatic (PCHP)', '-18 mmHg (Opposes)', '#ef4444') +
              cell('Colloid Osmotic (πBCOP)', '-32 mmHg (Opposes)', '#fbbf24') +
              cell('Net Filtration (NFP)', '+10 mmHg Net Forward', '#38bdf8');

      vHtml = '<strong>Starling Forces Governing Renal Filtration:</strong> Liquid movement into Bowman&#39;s capsule is dictated by the algebraic sum of opposing hydrostatic and osmotic pressures. <em>Glomerular Blood Hydrostatic Pressure (PGHP)</em> (~60 mmHg) is unusually high because the diameter of the afferent arteriole exceeds that of the efferent arteriole, creating high vascular resistance. This is opposed by two forces: <em>Blood Colloid Osmotic Pressure (πBCOP)</em> (~32 mmHg) exerted by trapped plasma albumins pulling water back, and <em>Capsular Hydrostatic Pressure (PCHP)</em> (~18 mmHg) exerted by existing fluid in Bowman&#39;s space. The resulting <strong>Net Filtration Pressure (NFP)</strong> is 60 - (18 + 32) = <strong>+10 mmHg</strong>.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">GLOMERULAR FILTRATION RATE (GFR) &amp; JUXTAGLOMERULAR AUTOREGULATION</text>';

      // Left: GFR Conversion Box
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="335" height="290" fill="#1e293b" rx="8" stroke="#34d399" stroke-width="2"/>';
      svg += '<text x="167" y="30" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">GFR Volumetric Dynamics</text>';

      svg += '<rect x="20" y="50" width="295" height="50" fill="#065f46" rx="6"/>';
      svg += '<text x="167" y="72" fill="#6ee7b7" font-size="11" text-anchor="middle">Renal Plasma Clearance Rate:</text>';
      svg += '<text x="167" y="92" fill="#fff" font-size="15" font-weight="bold" text-anchor="middle">125 mL/min = 180 Litres / Day</text>';

      svg += '<rect x="20" y="115" width="295" height="50" fill="#854d0e" rx="6"/>';
      svg += '<text x="167" y="137" fill="#fef08a" font-size="11" text-anchor="middle">Tubular Reabsorption Fraction:</text>';
      svg += '<text x="167" y="157" fill="#fff" font-size="15" font-weight="bold" text-anchor="middle">99% (> 178.5 L Reabsorbed)</text>';

      svg += '<rect x="20" y="180" width="295" height="50" fill="#7f1d1d" rx="6"/>';
      svg += '<text x="167" y="202" fill="#fca5a5" font-size="11" text-anchor="middle">Daily Urine Volume Excreted:</text>';
      svg += '<text x="167" y="222" fill="#fff" font-size="15" font-weight="bold" text-anchor="middle">~ 1.5 Litres / Day</text>';

      svg += '<text x="20" y="260" fill="#94a3b8" font-size="10">• Kidneys receive 1100–1200 mL blood/min (~1/5th cardiac output)</text>';
      svg += '<text x="20" y="278" fill="#94a3b8" font-size="10">• Renal plasma flow = ~ 650 mL/min; Filtration fraction = ~ 20%</text>';
      svg += '</g>';

      // Right: JGA Feedback Box
      svg += '<g transform="translate(395, 60)">';
      svg += '<rect x="0" y="0" width="335" height="290" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="167" y="30" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">Juxtaglomerular Apparatus (JGA)</text>';

      svg += '<rect x="20" y="50" width="295" height="65" fill="#0f172a" rx="6" stroke="#0284c7"/>';
      svg += '<text x="30" y="70" fill="#38bdf8" font-size="11" font-weight="bold">1. Macula Densa (in DCT wall):</text>';
      svg += '<text x="30" y="90" fill="#f8fafc" font-size="10">• Chemoreceptors detecting NaCl concentration in tubular fluid</text>';
      svg += '<text x="30" y="105" fill="#cbd5e1" font-size="10">• Signals JG cells via paracrine ATP/adenosine</text>';

      svg += '<rect x="20" y="125" width="295" height="65" fill="#0f172a" rx="6" stroke="#0284c7"/>';
      svg += '<text x="30" y="145" fill="#38bdf8" font-size="11" font-weight="bold">2. Juxtaglomerular (JG) Cells (in Afferent Arteriole):</text>';
      svg += '<text x="30" y="165" fill="#f8fafc" font-size="10">• Modified smooth muscle cells with renin secretory granules</text>';
      svg += '<text x="30" y="180" fill="#cbd5e1" font-size="10">• Act as baroreceptors sensing renal perfusion pressure</text>';

      svg += '<rect x="20" y="200" width="295" height="75" fill="#701a75" rx="6"/>';
      svg += '<text x="30" y="220" fill="#f472b6" font-size="11" font-weight="bold">Autoregulatory Negative Feedback Loop:</text>';
      svg += '<text x="30" y="240" fill="#fdf2f8" font-size="10">GFR Fall -> Macula Densa senses low NaCl -> JG cells release Renin</text>';
      svg += '<text x="30" y="260" fill="#fdf2f8" font-size="10">Renin activates Angiotensin II -> restores GHP and normalizes GFR</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Renal Blood Flow', '1100–1200 mL/min (1/5 Cardiac Output)', '#38bdf8') +
              cell('Standard GFR', '125 mL/min (180 L/day)', '#34d399') +
              cell('Tubular Reabsorption', '99% of total filtrate', '#fbbf24') +
              cell('Autoregulatory Sensor', 'JGA (Macula Densa + JG Cells)', '#a78bfa');

      vHtml = '<strong>Glomerular Filtration Rate (GFR) and Autoregulation:</strong> The volume of filtrate formed by both kidneys per minute is termed the <em>Glomerular Filtration Rate (GFR)</em>, averaging <strong>125 mL/min</strong> (approx. <strong>180 litres per day</strong> in a healthy adult). Since daily urinary excretion is only <strong>1.5 litres</strong>, nearly <strong>99%</strong> of the ultrafiltrate must be reabsorbed along renal tubules. Kidneys possess intrinsic autoregulation via the <em>Juxtaglomerular Apparatus (JGA)</em>: when GFR or blood pressure falls, macula densa cells trigger JG cells of the afferent arteriole to release the enzyme <em>renin</em>, stimulating the RAAS cascade to restore glomerular blood pressure and GFR to normal.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Tubular Reabsorption & Secretion (tubularreabsorptionsim)
// -------------------------------------------------------------------------
window.SIMS.tubularreabsorptionsim = (function(){
  var view = "pct"; // "pct", "henle", "dct_cd"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Active Reabsorption (ATP Driven: Na+, Glucose)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Passive Osmosis / Diffusion (H2O, Urea, Cl-)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Tubular Secretion (H+, NH3, K+)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Simple Cuboidal Brush Border Epithelium</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.tubularreabsorptionsim.setView(\'pct\')">1. PCT: 70–80% Bulk Reabsorption &amp; Brush Border</button>' +
        '<button class="preset-btn" onclick="SIMS.tubularreabsorptionsim.setView(\'henle\')">2. Loop of Henle: Differential Permeability Limbs</button>' +
        '<button class="preset-btn" onclick="SIMS.tubularreabsorptionsim.setView(\'dct_cd\')">3. DCT &amp; Collecting Duct: Hormone-Controlled Tuning</button>';
    }
    render(0);
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

    if (view === "pct") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">PROXIMAL CONVOLUTED TUBULE (PCT): BULK REABSORPTION &amp; BRUSH BORDER EPITHELIUM</text>';

      // Tubule Cross-Section / Longitudinal Cut
      svg += '<g transform="translate(40, 60)">';
      // Epithelial Cells with Brush Border (microvilli)
      for (var c = 0; c < 6; c++) {
        var cx = c * 110;
        svg += '<rect x="' + cx + '" y="0" width="105" height="120" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>';
        // Microvilli brush border facing lumen
        for (var mv = 0; mv < 9; mv++) {
          svg += '<line x1="' + (cx + 8 + mv * 11) + '" y1="0" x2="' + (cx + 8 + mv * 11) + '" y2="-18" stroke="#38bdf8" stroke-width="3"/>';
        }
        // Cell Nucleus
        svg += '<circle cx="' + (cx + 52) + '" cy="60" r="18" fill="#3b82f6" opacity="0.6"/>';
        svg += '<text x="' + (cx + 52) + '" y="64" fill="#fff" font-size="9" text-anchor="middle">PCT Cell</text>';
      }
      svg += '<text x="10" y="-26" fill="#38bdf8" font-size="12" font-weight="bold">Brush Border Microvilli: Expands Reabsorptive Surface Area ~ 20-Fold</text>';
      svg += '</g>';

      // Arrows indicating active vs passive transport
      svg += '<g transform="translate(40, 210)">';
      svg += '<rect x="0" y="0" width="670" height="145" fill="#1e293b" rx="8" stroke="#475569"/>';

      // 1. Bulk Reabsorption
      svg += '<rect x="15" y="15" width="310" height="115" fill="#064e3b" rx="6" stroke="#10b981"/>';
      svg += '<text x="25" y="38" fill="#34d399" font-size="13" font-weight="bold">Bulk Reabsorption (~70-80%):</text>';
      svg += '<text x="25" y="60" fill="#f8fafc" font-size="11">• 100% of Glucose &amp; Amino Acids (Active Na+ symport)</text>';
      svg += '<text x="25" y="80" fill="#f8fafc" font-size="11">• 70–80% of Electrolytes (Na+, K+, Cl-, Ca2+, Mg2+)</text>';
      svg += '<text x="25" y="100" fill="#f8fafc" font-size="11">• 70–80% of Water (Obligatory osmosis via aquaporin-1)</text>';
      svg += '<text x="25" y="120" fill="#f8fafc" font-size="11">• ~ 90% of Bicarbonate (HCO3-) for acid-base buffer</text>';

      // 2. Tubular Secretion
      svg += '<rect x="340" y="15" width="315" height="115" fill="#7f1d1d" rx="6" stroke="#ef4444"/>';
      svg += '<text x="350" y="38" fill="#fca5a5" font-size="13" font-weight="bold">Active Tubular Secretion:</text>';
      svg += '<text x="350" y="60" fill="#f8fafc" font-size="11">• Secretion of Hydrogen Ions (H+) into tubule lumen</text>';
      svg += '<text x="350" y="80" fill="#f8fafc" font-size="11">• Secretion of Ammonia (NH3) &amp; Potassium (K+)</text>';
      svg += '<text x="350" y="100" fill="#f8fafc" font-size="11">• Excretion of drugs, creatinine, hippurates, toxins</text>';
      svg += '<text x="350" y="120" fill="#fef08a" font-size="11">Maintains physiological blood pH (7.35–7.45) &amp; ionic balance</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('PCT Epithelium', 'Simple Cuboidal Brush Border', '#38bdf8') +
              cell('Bulk Reabsorption', '70 – 80% Water &amp; Electrolytes', '#22c55e') +
              cell('Nutrient Reabsorption', '100% Glucose &amp; Amino Acids', '#34d399') +
              cell('Tubular Secretion', 'H+, NH3, K+ (pH balance)', '#ef4444');

      vHtml = '<strong>Proximal Convoluted Tubule (PCT) Transport Mechanics:</strong> The PCT is lined by <em>simple cuboidal brush border epithelium</em> whose millions of dense microvilli vastly increase surface area for transport. Approximately <strong>70–80% of electrolytes and water</strong> are reabsorbed here. Essential nutrients including <strong>100% of filtered glucose and amino acids</strong> are recovered via secondary active sodium co-transporters ($Na^+$-symporters). Simultaneously, active tubular secretion of $H^+$, ammonia ($NH_3$), and $K^+$ into the lumen purges metabolic acids and toxins, maintaining systemic acid-base and ionic homeostasis.';
    } else if (view === "henle") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">LOOP OF HENLE: ASYMMETRIC PERMEABILITY &amp; DILUTION-CONCENTRATION GRADIENT</text>';

      // Hairpin Loop Graphic
      svg += '<g transform="translate(100, 60)">';
      // Descending limb (left)
      svg += '<path d="M 120 20 L 120 230 C 120 260, 200 260, 200 230 L 200 20" fill="none" stroke="#64748b" stroke-width="26"/>';
      svg += '<path d="M 120 20 L 120 230 C 120 260, 200 260, 200 230 L 200 20" fill="none" stroke="#0f172a" stroke-width="18"/>';

      // Descending limb: Water out
      svg += '<text x="50" y="70" fill="#38bdf8" font-size="12" font-weight="bold">H2O Out</text>';
      svg += '<line x1="110" y1="65" x2="60" y2="65" stroke="#38bdf8" stroke-width="4"/>';
      svg += '<text x="50" y="140" fill="#38bdf8" font-size="12" font-weight="bold">H2O Out</text>';
      svg += '<line x1="110" y1="135" x2="60" y2="135" stroke="#38bdf8" stroke-width="4"/>';

      // Hairpin turn (concentrated 1200 mOsm/L)
      svg += '<circle cx="160" cy="250" r="18" fill="#7f1d1d"/>';
      svg += '<text x="160" y="254" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">1200</text>';

      // Ascending limb: NaCl out
      svg += '<text x="250" y="140" fill="#fbbf24" font-size="12" font-weight="bold">NaCl Out</text>';
      svg += '<line x1="210" y1="135" x2="260" y2="135" stroke="#fbbf24" stroke-width="4"/>';
      svg += '<text x="250" y="70" fill="#fbbf24" font-size="12" font-weight="bold">Active NaCl Out</text>';
      svg += '<line x1="210" y1="65" x2="260" y2="65" stroke="#fbbf24" stroke-width="4"/>';
      svg += '</g>';

      // Comparison Panels on Right
      svg += '<g transform="translate(420, 60)">';
      // Descending Limb Card
      svg += '<rect x="0" y="0" width="310" height="135" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="15" y="26" fill="#38bdf8" font-size="13" font-weight="bold">1. Descending Limb of Henle:</text>';
      svg += '<text x="15" y="48" fill="#34d399" font-size="11" font-weight="bold">PERMEABLE to Water (aquaporin-rich)</text>';
      svg += '<text x="15" y="68" fill="#ef4444" font-size="11" font-weight="bold">IMPERMEABLE to Electrolytes (NaCl)</text>';
      svg += '<text x="15" y="90" fill="#f8fafc" font-size="10">• Water leaves tubule into hypertonic medullary interstitium</text>';
      svg += '<text x="15" y="110" fill="#fca5a5" font-size="11" font-weight="bold">Result: Tubular filtrate concentrates (300 -> 1200 mOsm/L)</text>';

      // Ascending Limb Card
      svg += '<rect x="0" y="150" width="310" height="135" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<text x="15" y="176" fill="#fbbf24" font-size="13" font-weight="bold">2. Ascending Limb of Henle:</text>';
      svg += '<text x="15" y="198" fill="#ef4444" font-size="11" font-weight="bold">IMPERMEABLE to Water (zero aquaporins)</text>';
      svg += '<text x="15" y="218" fill="#34d399" font-size="11" font-weight="bold">PERMEABLE to Electrolytes (Active/Passive NaCl efflux)</text>';
      svg += '<text x="15" y="240" fill="#f8fafc" font-size="10">• Thin segment: passive NaCl; Thick segment: active Na+/K+/2Cl-</text>';
      svg += '<text x="15" y="262" fill="#93c5fa" font-size="11" font-weight="bold">Result: Tubular filtrate dilutes (1200 -> 200 mOsm/L)</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Descending Limb Permeability', 'Permeable to H2O; Impermeable to Salts', '#38bdf8') +
              cell('Ascending Limb Permeability', 'Impermeable to H2O; Permeable to Salts', '#fbbf24') +
              cell('Hairpin Osmolarity', '1200 mOsmol / L (Max Concentration)', '#ef4444') +
              cell('Ascending Fluid Destination', 'Hypotonic (~200 mOsmol / L)', '#34d399');

      vHtml = '<strong>Opposing Functional Permeability of Henle&#39;s Loop:</strong> The hairpin loop exhibits stark functional asymmetry. The <em>descending limb</em> is highly permeable to water but virtually impermeable to electrolytes; as it plunges into the hyperosmotic medulla, water is continuously drawn out by osmosis, concentrating tubular fluid up to <strong>1200 mOsmol/L</strong> at the hairpin tip. Conversely, the <em>ascending limb</em> is completely impermeable to water but transports electrolytes ($Na^+$ and $Cl^-$) actively into the interstitium. Consequently, as fluid ascends, it becomes progressively <strong>diluted</strong>, entering the distal tubule hypotonic (~200 mOsmol/L).';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">DISTAL CONVOLUTED TUBULE (DCT) &amp; COLLECTING DUCT: CONDITIONAL REGULATION</text>';

      // Left: DCT Regulation Panel
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="335" height="290" fill="#1e293b" rx="8" stroke="#a855f7" stroke-width="2"/>';
      svg += '<text x="167" y="28" fill="#c084fc" font-size="13" font-weight="bold" text-anchor="middle">Distal Convoluted Tubule (DCT)</text>';

      svg += '<rect x="15" y="45" width="305" height="70" fill="#581c87" rx="6"/>';
      svg += '<text x="25" y="68" fill="#e9d5ff" font-size="12" font-weight="bold">1. Conditional Na+ &amp; H2O Reabsorption:</text>';
      svg += '<text x="25" y="88" fill="#f8fafc" font-size="10">• Regulated by ALDOSTERONE from adrenal cortex</text>';
      svg += '<text x="25" y="104" fill="#f8fafc" font-size="10">• Stimulates basolateral Na+/K+ ATPase pumps</text>';

      svg += '<rect x="15" y="125" width="305" height="70" fill="#0f172a" rx="6" stroke="#9333ea"/>';
      svg += '<text x="25" y="148" fill="#c084fc" font-size="12" font-weight="bold">2. Bicarbonate (HCO3-) Reabsorption:</text>';
      svg += '<text x="25" y="168" fill="#f8fafc" font-size="10">• Recovers systemic alkaline reserve</text>';
      svg += '<text x="25" y="184" fill="#f8fafc" font-size="10">• Buffers metabolic non-volatile fixed acids</text>';

      svg += '<rect x="15" y="205" width="305" height="70" fill="#7f1d1d" rx="6"/>';
      svg += '<text x="25" y="228" fill="#fca5a5" font-size="12" font-weight="bold">3. Selective Tubular Secretion:</text>';
      svg += '<text x="25" y="248" fill="#f8fafc" font-size="10">• Secretion of Potassium (K+) and Hydrogen (H+)</text>';
      svg += '<text x="25" y="264" fill="#f8fafc" font-size="10">• Prevents hyperkalemia and systemic acidosis</text>';
      svg += '</g>';

      // Right: Collecting Duct Panel
      svg += '<g transform="translate(395, 60)">';
      svg += '<rect x="0" y="0" width="335" height="290" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="167" y="28" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Collecting Duct (CD) &amp; Medulla</text>';

      svg += '<rect x="15" y="45" width="305" height="70" fill="#0c4a6e" rx="6"/>';
      svg += '<text x="25" y="68" fill="#7dd3fc" font-size="12" font-weight="bold">1. Massive Facultative H2O Reabsorption:</text>';
      svg += '<text x="25" y="88" fill="#f8fafc" font-size="10">• Governed strictly by ADH (Vasopressin)</text>';
      svg += '<text x="25" y="104" fill="#f8fafc" font-size="10">• Translocates Aquaporin-2 channels into luminal membrane</text>';

      svg += '<rect x="15" y="125" width="305" height="70" fill="#0f172a" rx="6" stroke="#0284c7"/>';
      svg += '<text x="25" y="148" fill="#38bdf8" font-size="12" font-weight="bold">2. Medullary Urea Recycling:</text>';
      svg += '<text x="25" y="168" fill="#f8fafc" font-size="10">• Small amounts of urea diffuse out into medullary interstitium</text>';
      svg += '<text x="25" y="184" fill="#f8fafc" font-size="10">• Maintains high medullary osmolarity gradient</text>';

      svg += '<rect x="15" y="205" width="305" height="70" fill="#064e3b" rx="6"/>';
      svg += '<text x="25" y="228" fill="#6ee7b7" font-size="12" font-weight="bold">3. Final Concentrated Hypertonic Urine:</text>';
      svg += '<text x="25" y="248" fill="#f8fafc" font-size="10">• Empties into renal calyces and renal pelvis</text>';
      svg += '<text x="25" y="264" fill="#f8fafc" font-size="10">• Osmolarity reaches 1200 mOsmol/L (4x concentrated)</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('DCT Na+ Reabsorption', 'Conditional (Aldosterone Driven)', '#a855f7') +
              cell('Collecting Duct H2O', 'Facultative (ADH / Aquaporin-2)', '#38bdf8') +
              cell('Urea Permeability', 'Medullary CD Urea Efflux', '#fbbf24') +
              cell('Final Urine Osmolarity', 'Up to 1200 mOsmol / L', '#10b981');

      vHtml = '<strong>Hormone-Mediated Distal Fine-Tuning:</strong> In the <em>Distal Convoluted Tubule (DCT)</em>, reabsorption of $Na^+$ and water is conditional, orchestrated by <em>aldosterone</em> to regulate vascular volume and systemic blood pressure. The DCT also reabsorbs $HCO_3^-$ and selectively secretes $K^+$ and $H^+$ to stabilize blood pH. The <em>Collecting Duct</em> extends from the cortex deep into the inner medulla; under the influence of <em>ADH</em>, massive amounts of water are reabsorbed through aquaporin channels, and urea is recycled into the medullary interstitium, producing concentrated hypertonic urine.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Countercurrent Multiplier (countercurrentmechanismsim)
// -------------------------------------------------------------------------
window.SIMS.countercurrentmechanismsim = (function(){
  var view = "architecture"; // "architecture", "osmotic_gradient", "urine_concentration"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Descending Limb: Water Out / Fluid Concentrates</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Ascending Limb: NaCl Out / Medullary Interstitium Hypertonic</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Vasa Recta: Countercurrent Exchanger</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Collecting Duct: Final Hypertonic Urine (1200 mOsm/L)</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.countercurrentmechanismsim.setView(\'architecture\')">1. Countercurrent Geometry: Henle &amp; Vasa Recta Hairpins</button>' +
        '<button class="preset-btn" onclick="SIMS.countercurrentmechanismsim.setView(\'osmotic_gradient\')">2. Medullary Hyperosmotic Gradient (300 to 1200 mOsm/L)</button>' +
        '<button class="preset-btn" onclick="SIMS.countercurrentmechanismsim.setView(\'urine_concentration\')">3. 4x Urine Concentration Engine &amp; Urea Cycle</button>';
    }
    render(0);
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

    if (view === "architecture") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">COUNTERCURRENT ARCHITECTURE: DUAL HAIRPIN LOOPS IN RENAL MEDULLA</text>';

      // Left: Henle Hairpin (Multiplier)
      svg += '<g transform="translate(60, 55)">';
      svg += '<rect x="0" y="0" width="290" height="300" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="145" y="26" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">1. Henle Loop: Countercurrent Multiplier</text>';

      // Flow arrows descending vs ascending
      svg += '<path d="M 90 60 L 90 230 C 90 250, 190 250, 190 230 L 190 60" fill="none" stroke="#64748b" stroke-width="14"/>';
      // Flow indicators
      svg += '<text x="70" y="140" fill="#38bdf8" font-size="16" font-weight="bold">↓</text>';
      svg += '<text x="205" y="140" fill="#fbbf24" font-size="16" font-weight="bold">↑</text>';
      svg += '<text x="50" y="100" fill="#94a3b8" font-size="10">Descending</text>';
      svg += '<text x="205" y="100" fill="#94a3b8" font-size="10">Ascending</text>';

      svg += '<text x="20" y="275" fill="#f8fafc" font-size="11">Opposite flow generates hyperosmotic medullary gradient</text>';
      svg += '</g>';

      // Right: Vasa Recta Hairpin (Exchanger)
      svg += '<g transform="translate(410, 55)">';
      svg += '<rect x="0" y="0" width="290" height="300" fill="#1e293b" rx="8" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="145" y="26" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">2. Vasa Recta: Countercurrent Exchanger</text>';

      // Flow arrows descending vs ascending in vasa recta
      svg += '<path d="M 90 60 L 90 230 C 90 250, 190 250, 190 230 L 190 60" fill="none" stroke="#7f1d1d" stroke-width="14"/>';
      // Flow indicators
      svg += '<text x="70" y="140" fill="#ef4444" font-size="16" font-weight="bold">↓</text>';
      svg += '<text x="205" y="140" fill="#38bdf8" font-size="16" font-weight="bold">↑</text>';
      svg += '<text x="45" y="100" fill="#fca5a5" font-size="10">Desc. Capillary</text>';
      svg += '<text x="205" y="100" fill="#fca5a5" font-size="10">Asc. Capillary</text>';

      svg += '<text x="20" y="275" fill="#f8fafc" font-size="11">Passive exchange preserves gradient without washing it out</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Loop of Henle Role', 'Countercurrent Multiplier (Active)', '#38bdf8') +
              cell('Vasa Recta Role', 'Countercurrent Exchanger (Passive)', '#ef4444') +
              cell('Flow Pattern', 'Opposite directions in parallel limbs', '#fbbf24') +
              cell('Preservation Mechanism', 'Prevents medullary solute washout', '#10b981');

      vHtml = '<strong>Countercurrent Multiplier and Exchanger Principles:</strong> The flow of tubular filtrate in the two limbs of Henle&#39;s loop is in <em>opposite directions</em>, forming a countercurrent pattern. Similarly, the flow of blood through the two limbs of the hairpin <em>vasa recta</em> is also countercurrent. Henle&#39;s loop acts as a <strong>countercurrent multiplier</strong>: active pumping of $NaCl$ from the thick ascending limb continuously multiplies the single-effect osmotic gradient between tubular fluid and interstitium. The vasa recta functions as a <strong>countercurrent exchanger</strong>: sluggish, passive capillary blood flow allows solutes to enter descending vessels and exit ascending vessels, delivering oxygen to the medulla while strictly preventing the medullary osmotic gradient from being washed away.';
    } else if (view === "osmotic_gradient") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">MEDULLARY HYPEROSMOLAR GRADIENT: 300 TO 1200 mOsmol / L</text>';

      // Depth Gradient Diagram
      var depths = [
        { y: 65, h: 55, osm: "300 mOsmol/L", label: "Renal Cortex (Isotonic to Plasma)", bg: "#1e293b", c: "#94a3b8" },
        { y: 125, h: 55, osm: "600 mOsmol/L", label: "Outer Medulla (Intermediate Gradient)", bg: "#312e81", c: "#818cf8" },
        { y: 185, h: 55, osm: "900 mOsmol/L", label: "Inner Medulla (High Solute Density)", bg: "#4c1d95", c: "#c084fc" },
        { y: 245, h: 65, osm: "1200 mOsmol/L", label: "Papillary Tip / Deep Medulla (Maximum Hyperosmolarity)", bg: "#831843", c: "#f472b6" }
      ];

      for (var d = 0; d < depths.length; d++) {
        var dp = depths[d];
        svg += '<rect x="40" y="' + dp.y + '" width="680" height="' + dp.h + '" fill="' + dp.bg + '" rx="6" opacity="0.9"/>';
        svg += '<text x="60" y="' + (dp.y + 32) + '" fill="#fff" font-size="15" font-weight="bold">' + dp.osm + '</text>';
        svg += '<text x="240" y="' + (dp.y + 32) + '" fill="' + dp.c + '" font-size="12">' + dp.label + '</text>';
      }

      // Solute contributors box at bottom
      svg += '<g transform="translate(40, 320)">';
      svg += '<text x="10" y="16" fill="#fbbf24" font-size="12" font-weight="bold">Primary Osmolytes Generating Gradient:</text>';
      svg += '<text x="290" y="16" fill="#f8fafc" font-size="11">1. Sodium Chloride (NaCl) actively transported by ascending limb</text>';
      svg += '<text x="290" y="32" fill="#f8fafc" font-size="11">2. Urea recycled from inner medullary collecting duct into thin Henle limb</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Cortical Osmolarity', '300 mOsmol / L (Isotonic)', '#94a3b8') +
              cell('Outer Medulla', '600 – 900 mOsmol / L', '#818cf8') +
              cell('Inner Papillary Medulla', '1200 mOsmol / L (4x Hypertonic)', '#f472b6') +
              cell('Major Solutes Responsible', 'NaCl (Asc. Limb) + Urea (CD)', '#fbbf24');

      vHtml = '<strong>The Interstitial Osmotic Stratification:</strong> An increasing osmolarity gradient is maintained from the outer renal cortex towards the inner medullary interstitium. Osmolarity begins at <strong>300 mOsmol/L</strong> in the cortex, increasing steadily through <strong>600 mOsmol/L</strong> in the outer medulla, <strong>900 mOsmol/L</strong> in the mid-medulla, reaching a peak of <strong>1200 mOsmol/L</strong> in the inner medullary papilla. This gradient is established by two key solutes: $NaCl$ pumped actively out of the thick ascending limb of Henle&#39;s loop, and <em>urea</em> diffusing out of the distal collecting duct into the medullary interstitium before recycling back into the thin ascending limb.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">URINE CONCENTRATION ENGINE: SAVING 178.5 LITRES OF WATER DAILY</text>';

      // Left: 4x Concentration Diagram
      svg += '<g transform="translate(40, 60)">';
      svg += '<rect x="0" y="0" width="320" height="290" fill="#1e293b" rx="8" stroke="#10b981" stroke-width="2"/>';
      svg += '<text x="160" y="30" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">4x Concentration Multiplier</text>';

      svg += '<rect x="20" y="60" width="280" height="50" fill="#065f46" rx="6"/>';
      svg += '<text x="30" y="82" fill="#a7f3d0" font-size="11">Bowman Capsule Filtrate:</text>';
      svg += '<text x="30" y="100" fill="#fff" font-size="14" font-weight="bold">300 mOsmol/L (Isotonic)</text>';

      svg += '<text x="160" y="145" fill="#38bdf8" font-size="20" text-anchor="middle">↓ Water Reabsorbed (99%)</text>';

      svg += '<rect x="20" y="170" width="280" height="50" fill="#831843" rx="6"/>';
      svg += '<text x="30" y="192" fill="#fbcfe8" font-size="11">Final Papillary Urine:</text>';
      svg += '<text x="30" y="210" fill="#fff" font-size="14" font-weight="bold">1200 mOsmol/L (Hypertonic, 4x)</text>';

      svg += '<text x="20" y="250" fill="#fbbf24" font-size="11" font-weight="bold">• Terrestrial Conservation Dividend:</text>';
      svg += '<text x="20" y="270" fill="#f8fafc" font-size="10">Without this engine, humans would need to drink 180 L water daily!</text>';
      svg += '</g>';

      // Right: Urea Recycling Circuit
      svg += '<g transform="translate(390, 60)">';
      svg += '<rect x="0" y="0" width="330" height="290" fill="#1e293b" rx="8" stroke="#f59e0b" stroke-width="2"/>';
      svg += '<text x="165" y="30" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">Medullary Urea Recycling Circuit</text>';

      svg += '<rect x="20" y="55" width="290" height="60" fill="#0f172a" rx="6" stroke="#d97706"/>';
      svg += '<text x="30" y="76" fill="#fde68a" font-size="11" font-weight="bold">Step 1: Collecting Duct Efflux</text>';
      svg += '<text x="30" y="95" fill="#f8fafc" font-size="10">Urea diffuses into deep medullary interstitium</text>';

      svg += '<rect x="20" y="125" width="290" height="60" fill="#0f172a" rx="6" stroke="#d97706"/>';
      svg += '<text x="30" y="146" fill="#fde68a" font-size="11" font-weight="bold">Step 2: Thin Ascending Limb Influx</text>';
      svg += '<text x="30" y="165" fill="#f8fafc" font-size="10">Urea enters thin segment of Henle&#39;s ascending limb</text>';

      svg += '<rect x="20" y="195" width="290" height="60" fill="#0f172a" rx="6" stroke="#d97706"/>';
      svg += '<text x="30" y="216" fill="#fde68a" font-size="11" font-weight="bold">Step 3: Recirculation to Distal Tubules</text>';
      svg += '<text x="30" y="235" fill="#f8fafc" font-size="10">Urea travels up to DCT and back down collecting duct</text>';

      svg += '<text x="20" y="275" fill="#34d399" font-size="10">• Maintains interstitial hypertonicity indefinitely</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Initial Filtrate Osmolarity', '300 mOsmol / L', '#38bdf8') +
              cell('Final Urine Osmolarity', '1200 mOsmol / L', '#10b981') +
              cell('Concentration Factor', '4-Fold (4x Plasma Filtrate)', '#f59e0b') +
              cell('Water Conserved Daily', '178.5 Litres / Day', '#ec4899');

      vHtml = '<strong>Physiological Impact of the Urine Concentration Engine:</strong> Human kidneys produce urine that is approximately <strong>four times more concentrated</strong> (1200 mOsmol/L) than the initial glomerular filtrate (300 mOsmol/L). By coupling the active transport of $NaCl$ in the ascending limb with the medullary recycling of <em>urea</em> from the collecting duct, the interstitium pulls water out of the collecting duct via osmosis whenever ADH is present. This physiological marvel recovers 178.5 litres of water each day, allowing humans to maintain perfect hydration on modest fluid intake (~1.5–2.5 L/day).';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Neuroendocrine Osmoregulation (raasneuroendocrinesim)
// -------------------------------------------------------------------------
window.SIMS.raasneuroendocrinesim = (function(){
  var view = "adh"; // "adh", "raas", "anf"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Hypothalamic Osmoreceptors &amp; ADH</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Renin-Angiotensin-Aldosterone System (RAAS)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Atrial Natriuretic Factor (ANF Antagonist)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Blood Pressure &amp; GFR Normalization</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.raasneuroendocrinesim.setView(\'adh\')">1. Hypothalamus-ADH Axis: Osmoreceptor Feedback</button>' +
        '<button class="preset-btn" onclick="SIMS.raasneuroendocrinesim.setView(\'raas\')">2. RAAS Triad: Renin -> Angiotensin II -> Aldosterone</button>' +
        '<button class="preset-btn" onclick="SIMS.raasneuroendocrinesim.setView(\'anf\')">3. Atrial Natriuretic Factor (ANF): Negative Check</button>';
    }
    render(0);
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

    if (view === "adh") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HYPOTHALAMIC OSMORECEPTOR - NEUROHYPOPHYSIS - ADH FEEDBACK AXIS</text>';

      // Circuit flowchart
      svg += '<g transform="translate(40, 60)">';
      // Step 1: Trigger
      svg += '<rect x="0" y="0" width="190" height="85" fill="#7f1d1d" rx="6" stroke="#ef4444"/>';
      svg += '<text x="15" y="24" fill="#fca5a5" font-size="11" font-weight="bold">1. Osmotic Trigger:</text>';
      svg += '<text x="15" y="44" fill="#fff" font-size="10">• Excessive fluid loss / dehydration</text>';
      svg += '<text x="15" y="60" fill="#fff" font-size="10">• Rise in plasma osmolarity (>300)</text>';
      svg += '<text x="15" y="76" fill="#fff" font-size="10">• Drop in blood volume / BP</text>';

      svg += '<text x="205" y="48" fill="#ef4444" font-size="20">➔</text>';

      // Step 2: Hypothalamus
      svg += '<rect x="235" y="0" width="205" height="85" fill="#1e3a8a" rx="6" stroke="#3b82f6"/>';
      svg += '<text x="15" y="24" transform="translate(235,0)" fill="#93c5fd" font-size="11" font-weight="bold">2. Hypothalamic Osmoreceptors:</text>';
      svg += '<text x="15" y="44" transform="translate(235,0)" fill="#fff" font-size="10">• Detect cellular shrinkage</text>';
      svg += '<text x="15" y="60" transform="translate(235,0)" fill="#fff" font-size="10">• Supraoptic / paraventricular nuclei</text>';
      svg += '<text x="15" y="76" transform="translate(235,0)" fill="#fff" font-size="10">• Stimulate Neurohypophysis</text>';

      svg += '<text x="455" y="48" fill="#3b82f6" font-size="20">➔</text>';

      // Step 3: ADH Release
      svg += '<rect x="485" y="0" width="195" height="85" fill="#065f46" rx="6" stroke="#10b981"/>';
      svg += '<text x="15" y="24" transform="translate(485,0)" fill="#6ee7b7" font-size="11" font-weight="bold">3. ADH (Vasopressin) Release:</text>';
      svg += '<text x="15" y="44" transform="translate(485,0)" fill="#fff" font-size="10">• Secreted into systemic blood</text>';
      svg += '<text x="15" y="60" transform="translate(485,0)" fill="#fff" font-size="10">• Acts on DCT &amp; Collecting Duct</text>';
      svg += '<text x="15" y="76" transform="translate(485,0)" fill="#fff" font-size="10">• Mobilizes Aquaporin-2 channels</text>';
      svg += '</g>';

      // Dual Physiological Actions of ADH
      svg += '<g transform="translate(40, 175)">';
      // Action A: Antidiuresis
      svg += '<rect x="0" y="0" width="325" height="150" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="20" y="28" fill="#38bdf8" font-size="13" font-weight="bold">Action A: Renal Antidiuresis</text>';
      svg += '<text x="20" y="52" fill="#f8fafc" font-size="11">• Massive facultative water reabsorption from CD</text>';
      svg += '<text x="20" y="74" fill="#f8fafc" font-size="11">• Eliminates excess water loss (prevents diuresis)</text>';
      svg += '<text x="20" y="96" fill="#34d399" font-size="11">• Normalizes blood volume &amp; body fluid osmolarity</text>';
      svg += '<text x="20" y="118" fill="#fca5a5" font-size="11">• Negative Feedback: Swelling osmoreceptors switches off ADH</text>';
      svg += '<text x="20" y="136" fill="#94a3b8" font-size="10">• Deficiency -> Diabetes Insipidus (polyuria 10-20 L/day)</text>';

      // Action B: Vasoconstriction
      svg += '<rect x="355" y="0" width="325" height="150" fill="#1e293b" rx="8" stroke="#f59e0b" stroke-width="2"/>';
      svg += '<text x="20" y="28" transform="translate(355,0)" fill="#fbbf24" font-size="13" font-weight="bold">Action B: Arteriolar Vasoconstriction</text>';
      svg += '<text x="20" y="52" transform="translate(355,0)" fill="#f8fafc" font-size="11">• ADH binds V1 receptors on vascular smooth muscle</text>';
      svg += '<text x="20" y="74" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Induces potent peripheral vasoconstriction</text>';
      svg += '<text x="20" y="96" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Increases total peripheral resistance (TPR)</text>';
      svg += '<text x="20" y="118" transform="translate(355,0)" fill="#4ade80" font-size="11" font-weight="bold">• Elevates systemic arterial Blood Pressure &amp; GFR</text>';
      svg += '<text x="20" y="136" transform="translate(355,0)" fill="#94a3b8" font-size="10">• Earns ADH its alternate name: Vasopressin</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Osmoreceptor Location', 'Hypothalamus (Sensing Osmolarity)', '#38bdf8') +
              cell('Endocrine Source', 'Neurohypophysis (Posterior Pituitary)', '#fbbf24') +
              cell('Renal Target', 'DCT &amp; Collecting Duct (Aquaporin-2)', '#34d399') +
              cell('Vascular Effect', 'Systemic Vasoconstriction (Vasopressin)', '#ef4444');

      vHtml = '<strong>Hypothalamus-ADH Osmoregulatory Circuit:</strong> Osmoreceptors in the hypothalamus are stimulated by changes in blood volume, body fluid volume, and solute concentration. An excessive loss of fluid from the body activates these receptors, stimulating the release of <em>antidiuretic hormone (ADH)</em> or <em>vasopressin</em> from the neurohypophysis. ADH facilitates water reabsorption from the distal tubules and collecting ducts, preventing diuresis. An increase in fluid volume switches off osmoreceptors and suppresses ADH release via negative feedback. Furthermore, ADH constricts peripheral arterioles, increasing arterial blood pressure and restoring GFR.';
    } else if (view === "raas") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">RENIN - ANGIOTENSIN - ALDOSTERONE SYSTEM (RAAS) MULTI-ORGAN CASCADE</text>';

      // Multi-organ cascade diagram
      svg += '<g transform="translate(30, 60)">';
      // JG Cells
      svg += '<rect x="0" y="0" width="150" height="70" fill="#7f1d1d" rx="6"/>';
      svg += '<text x="15" y="24" fill="#fca5a5" font-size="11" font-weight="bold">Renal JG Cells</text>';
      svg += '<text x="15" y="44" fill="#fff" font-size="10">Low BP / low GFR</text>';
      svg += '<text x="15" y="60" fill="#fbbf24" font-size="11" font-weight="bold">Releases RENIN</text>';

      svg += '<line x1="150" y1="35" x2="190" y2="35" stroke="#fbbf24" stroke-width="3"/>';

      // Liver Substrate
      svg += '<rect x="190" y="0" width="160" height="70" fill="#1e3a8a" rx="6"/>';
      svg += '<text x="15" y="24" transform="translate(190,0)" fill="#93c5fd" font-size="11" font-weight="bold">Liver Substrate</text>';
      svg += '<text x="15" y="44" transform="translate(190,0)" fill="#fff" font-size="10">Angiotensinogen</text>';
      svg += '<text x="15" y="60" transform="translate(190,0)" fill="#38bdf8" font-size="10">-> Angiotensin-I</text>';

      svg += '<line x1="350" y1="35" x2="390" y2="35" stroke="#38bdf8" stroke-width="3"/>';

      // Pulmonary ACE
      svg += '<rect x="390" y="0" width="160" height="70" fill="#065f46" rx="6"/>';
      svg += '<text x="15" y="24" transform="translate(390,0)" fill="#6ee7b7" font-size="11" font-weight="bold">Lungs (ACE)</text>';
      svg += '<text x="15" y="44" transform="translate(390,0)" fill="#fff" font-size="10">Angiotensin Conv. Enzyme</text>';
      svg += '<text x="15" y="60" transform="translate(390,0)" fill="#34d399" font-size="11" font-weight="bold">Angiotensin-II</text>';

      svg += '<line x1="550" y1="35" x2="590" y2="35" stroke="#34d399" stroke-width="3"/>';

      // Adrenal Cortex
      svg += '<rect x="590" y="0" width="140" height="70" fill="#701a75" rx="6"/>';
      svg += '<text x="15" y="24" transform="translate(590,0)" fill="#f472b6" font-size="11" font-weight="bold">Adrenal Cortex</text>';
      svg += '<text x="15" y="44" transform="translate(590,0)" fill="#fff" font-size="10">Zona glomerulosa</text>';
      svg += '<text x="15" y="60" transform="translate(590,0)" fill="#fbcfe8" font-size="11" font-weight="bold">ALDOSTERONE</text>';
      svg += '</g>';

      // Dual Physiological Effects of Angiotensin II and Aldosterone
      svg += '<g transform="translate(40, 160)">';
      svg += '<rect x="0" y="0" width="325" height="170" fill="#1e293b" rx="8" stroke="#34d399" stroke-width="2"/>';
      svg += '<text x="20" y="28" fill="#34d399" font-size="13" font-weight="bold">1. Angiotensin II Direct Actions:</text>';
      svg += '<text x="20" y="52" fill="#f8fafc" font-size="11">• Potent systemic arterial vasoconstrictor</text>';
      svg += '<text x="20" y="74" fill="#f8fafc" font-size="11">• Constricts efferent arterioles preferentially</text>';
      svg += '<text x="20" y="96" fill="#f8fafc" font-size="11">• Directly increases glomerular hydrostatic pressure</text>';
      svg += '<text x="20" y="118" fill="#f8fafc" font-size="11">• Stimulates hypothalamic thirst center</text>';
      svg += '<text x="20" y="140" fill="#f8fafc" font-size="11">• Triggers Aldosterone secretion from adrenal cortex</text>';
      svg += '<text x="20" y="158" fill="#4ade80" font-size="11" font-weight="bold">Result: Rapid elevation of systemic arterial BP &amp; GFR</text>';

      svg += '<rect x="355" y="0" width="325" height="170" fill="#1e293b" rx="8" stroke="#ec4899" stroke-width="2"/>';
      svg += '<text x="20" y="28" transform="translate(355,0)" fill="#f472b6" font-size="13" font-weight="bold">2. Aldosterone Renal Actions:</text>';
      svg += '<text x="20" y="52" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Mineralocorticoid hormone from adrenal cortex</text>';
      svg += '<text x="20" y="74" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Stimulates principal cells of DCT &amp; collecting duct</text>';
      svg += '<text x="20" y="96" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Upregulates basolateral Na+/K+ ATPase pumps</text>';
      svg += '<text x="20" y="118" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Causes active reabsorption of Na+ and water</text>';
      svg += '<text x="20" y="140" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Concomitant secretion of K+ and H+ into tubule</text>';
      svg += '<text x="20" y="158" transform="translate(355,0)" fill="#fbcfe8" font-size="11" font-weight="bold">Result: Expands blood volume &amp; normalizes pressure</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Enzyme Trigger', 'Renin (JG Cells of Afferent Arteriole)', '#fbbf24') +
              cell('Hepatic Substrate', 'Angiotensinogen (Liver Protein)', '#38bdf8') +
              cell('Active Vasoconstrictor', 'Angiotensin II (via Pulmonary ACE)', '#34d399') +
              cell('Mineralocorticoid', 'Aldosterone (Adrenal Cortex: Na+ uptake)', '#ec4899');

      vHtml = '<strong>The Renin-Angiotensin-Aldosterone System (RAAS):</strong> A fall in glomerular blood flow, glomerular blood pressure, or GFR stimulates juxtaglomerular (JG) cells to release the proteolytic enzyme <em>renin</em> into circulation. Renin cleaves hepatically synthesized <em>angiotensinogen</em> to form decapeptide <em>angiotensin-I</em>. Angiotensin-converting enzyme (ACE) on pulmonary capillary endothelial surfaces rapidly converts it into octapeptide <strong>angiotensin-II</strong>. Angiotensin-II acts as a powerful vasoconstrictor that immediately raises glomerular hydrostatic pressure and GFR. Furthermore, it stimulates the adrenal cortex to release <strong>aldosterone</strong>, driving active reabsorption of $Na^+$ and water from distal tubules, restoring intravascular volume and blood pressure.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">ATRIAL NATRIURETIC FACTOR (ANF): THE CARDIAC RAAS-ANTAGONIST CHECK</text>';

      // Atrial Stretch Loop
      svg += '<g transform="translate(40, 60)">';
      svg += '<rect x="0" y="0" width="680" height="85" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="20" y="28" fill="#38bdf8" font-size="13" font-weight="bold">1. The Cardiac Sensor &amp; Peptide Secretion:</text>';
      svg += '<text x="20" y="50" fill="#f8fafc" font-size="11">• An increase in blood volume or venous return causes excessive stretching of the atrial walls of the heart.</text>';
      svg += '<text x="20" y="70" fill="#34d399" font-size="12" font-weight="bold">• In response, specialized atrial myocytes secrete a 28-amino-acid peptide: Atrial Natriuretic Factor (ANF).</text>';
      svg += '</g>';

      // Direct actions of ANF
      svg += '<g transform="translate(40, 165)">';
      svg += '<rect x="0" y="0" width="325" height="175" fill="#1e293b" rx="8" stroke="#10b981" stroke-width="2"/>';
      svg += '<text x="20" y="28" fill="#34d399" font-size="13" font-weight="bold">ANF Physiological Actions:</text>';
      svg += '<text x="20" y="52" fill="#f8fafc" font-size="11">• Potent systemic VASODILATION of vascular beds</text>';
      svg += '<text x="20" y="74" fill="#f8fafc" font-size="11">• Decreases total peripheral vascular resistance (TPR)</text>';
      svg += '<text x="20" y="96" fill="#f8fafc" font-size="11">• Promotes NATRIURESIS (excretion of Na+ in urine)</text>';
      svg += '<text x="20" y="118" fill="#f8fafc" font-size="11">• Drives water loss through osmotic diuresis</text>';
      svg += '<text x="20" y="142" fill="#4ade80" font-size="12" font-weight="bold">• Lowers intravascular blood volume &amp; blood pressure</text>';

      svg += '<rect x="355" y="0" width="325" height="175" fill="#1e293b" rx="8" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="20" y="28" transform="translate(355,0)" fill="#f87171" font-size="13" font-weight="bold">ANF Antagonism of RAAS Cascade:</text>';
      svg += '<text x="20" y="52" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Directly INHIBITS Renin secretion from JG cells</text>';
      svg += '<text x="20" y="74" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Inhibits Aldosterone release from adrenal cortex</text>';
      svg += '<text x="20" y="96" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Inhibits ADH release from posterior pituitary</text>';
      svg += '<text x="20" y="118" transform="translate(355,0)" fill="#f8fafc" font-size="11">• Dilates afferent arteriole to elevate GFR</text>';
      svg += '<text x="20" y="142" transform="translate(355,0)" fill="#fca5a5" font-size="12" font-weight="bold">• Operates as an essential physiological check on RAAS</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Endocrine Organ', 'Heart (Atrial Cardiomyocytes)', '#ef4444') +
              cell('Secretory Peptide', 'Atrial Natriuretic Factor (ANF)', '#34d399') +
              cell('Primary Hemodynamic Action', 'Systemic Vasodilation (Lowers BP)', '#38bdf8') +
              cell('Renal Target Action', 'Natriuresis &amp; RAAS Inhibition', '#fbbf24');

      vHtml = '<strong>Atrial Natriuretic Factor (ANF) Counter-Regulation:</strong> An increase in venous return or blood volume causes mechanical distension of the atrial muscle fibers of the heart. These atrial myocytes synthesize and release <em>Atrial Natriuretic Factor (ANF)</em> into systemic circulation. ANF causes widespread vasodilation of peripheral arterioles, significantly decreasing systemic blood pressure. Concurrently, ANF suppresses renin release from renal JG cells and aldosterone secretion from the adrenal cortex, promoting <em>natriuresis</em> (renal excretion of $Na^+$) and osmotic diuresis. Thus, ANF functions as an indispensable intrinsic cardiac <strong>negative check on the renin-angiotensin mechanism</strong>.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Micturition & Accessory Organs (micturitionreflexsim)
// -------------------------------------------------------------------------
window.SIMS.micturitionreflexsim = (function(){
  var view = "reflex"; // "reflex", "urinalysis", "accessory"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Detrusor Smooth Muscle &amp; Bladder Stretch Receptors</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Internal &amp; External Urethral Sphincters</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Parasympathetic Motor Outflow</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Accessory Organs: Lungs, Liver, Skin</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.micturitionreflexsim.setView(\'reflex\')">1. Neural Arc of the Micturition Reflex</button>' +
        '<button class="preset-btn" onclick="SIMS.micturitionreflexsim.setView(\'urinalysis\')">2. Urinalysis: Normal Profile vs Diabetic Pathology</button>' +
        '<button class="preset-btn" onclick="SIMS.micturitionreflexsim.setView(\'accessory\')">3. Accessory Excretory Organs: Lungs, Liver &amp; Skin</button>';
    }
    render(0);
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

    if (view === "reflex") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">NEURAL ARCTECTURE OF THE MICTURITION REFLEX: DETRUSOR &amp; SPHINCTER COORDINATION</text>';

      // Urinary Bladder Graphic
      svg += '<g transform="translate(60, 60)">';
      // Bladder Detrusor Muscle Bag
      svg += '<path d="M 80 40 C 20 60, 20 180, 100 230 L 100 280 L 140 280 L 140 230 C 220 180, 220 60, 160 40 Z" fill="#450a0a" stroke="#ef4444" stroke-width="4"/>';
      // Urine filling inside
      svg += '<path d="M 50 140 C 40 180, 70 215, 120 220 C 170 215, 200 180, 190 140 Z" fill="#eab308" opacity="0.6"/>';
      svg += '<text x="120" y="180" fill="#fef08a" font-size="13" font-weight="bold" text-anchor="middle">Urine (300-400 mL)</text>';

      // Internal Sphincter (Smooth muscle / Involuntary)
      svg += '<rect x="95" y="235" width="50" height="12" fill="#3b82f6" rx="3"/>';
      svg += '<text x="155" y="244" fill="#93c5fd" font-size="10">Internal Sphincter (Involuntary)</text>';

      // External Sphincter (Skeletal muscle / Voluntary)
      svg += '<rect x="95" y="260" width="50" height="14" fill="#22c55e" rx="3"/>';
      svg += '<text x="155" y="271" fill="#86efac" font-size="10">External Sphincter (Voluntary)</text>';
      svg += '</g>';

      // Reflex Steps Panel
      svg += '<g transform="translate(390, 60)">';
      svg += '<rect x="0" y="0" width="340" height="295" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="20" y="26" fill="#38bdf8" font-size="13" font-weight="bold">Step-by-Step Reflex Arc Mechanics:</text>';

      svg += '<rect x="15" y="42" width="310" height="50" fill="#0f172a" rx="4"/>';
      svg += '<text x="25" y="60" fill="#fbbf24" font-size="11" font-weight="bold">1. Progressive Bladder Distension:</text>';
      svg += '<text x="25" y="78" fill="#f8fafc" font-size="10">Stretch receptors in muscular detrusor wall send afferent impulses to CNS</text>';

      svg += '<rect x="15" y="102" width="310" height="50" fill="#0f172a" rx="4"/>';
      svg += '<text x="25" y="120" fill="#38bdf8" font-size="11" font-weight="bold">2. CNS Integration &amp; Processing:</text>';
      svg += '<text x="25" y="138" fill="#f8fafc" font-size="10">Pontine micturition center &amp; sacral spinal cord initiate motor command</text>';

      svg += '<rect x="15" y="162" width="310" height="60" fill="#0f172a" rx="4"/>';
      svg += '<text x="25" y="180" fill="#ef4444" font-size="11" font-weight="bold">3. Parasympathetic Motor Outflow:</text>';
      svg += '<text x="25" y="198" fill="#f8fafc" font-size="10">• Detrusor smooth muscle contracts rhythmically</text>';
      svg += '<text x="25" y="214" fill="#f8fafc" font-size="10">• Internal urethral sphincter involuntarily relaxes</text>';

      svg += '<rect x="15" y="232" width="310" height="50" fill="#0f172a" rx="4"/>';
      svg += '<text x="25" y="250" fill="#34d399" font-size="11" font-weight="bold">4. Voluntary Somatic Control:</text>';
      svg += '<text x="25" y="268" fill="#f8fafc" font-size="10">Somatic motor signals relax external urethral sphincter -> MICTURITION</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Bladder Muscle', 'Detrusor (Smooth muscle, Parasympathetic)', '#ef4444') +
              cell('Internal Sphincter', 'Smooth Muscle (Involuntary Autonomic)', '#38bdf8') +
              cell('External Sphincter', 'Skeletal Muscle (Voluntary Somatic)', '#34d399') +
              cell('Process Term', 'Micturition (Voiding Reflex)', '#fbbf24');

      vHtml = '<strong>Neural Mechanics of Micturition:</strong> Urine formed by nephrons is conveyed via peristalsis through the ureters into the urinary bladder, where it is temporarily stored until sensory signals are initiated. As the bladder fills with urine, the <em>stretch receptors</em> embedded in the muscular detrusor wall are stretched, generating afferent sensory signals to the Central Nervous System (sacral cord and pons). The CNS transmits efferent motor impulses via parasympathetic fibers to initiate rhythmic contraction of the detrusor smooth muscle and simultaneous relaxation of the involuntary internal urethral sphincter. Conscious cortical relaxation of the voluntary external urethral sphincter releases urine, a coordinated neural process termed <strong>micturition</strong>.';
    } else if (view === "urinalysis") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">CLINICAL URINALYSIS: PHYSIOLOGICAL NORMS VS DIABETIC PATHOLOGY</text>';

      // Left Panel: Normal Urinalysis
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="335" height="290" fill="#1e293b" rx="8" stroke="#10b981" stroke-width="2"/>';
      svg += '<text x="167" y="28" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">Normal Adult Physiological Profile</text>';

      svg += '<text x="20" y="58" fill="#f8fafc" font-size="11">• Daily Volume: 1.0 – 1.5 Litres / 24 hours</text>';
      svg += '<text x="20" y="80" fill="#f8fafc" font-size="11">• Color: Clear light yellow (pigment: Urochrome)</text>';
      svg += '<text x="20" y="102" fill="#f8fafc" font-size="11">• Reaction / pH: Slightly acidic (average pH ~ 6.0)</text>';
      svg += '<text x="20" y="124" fill="#f8fafc" font-size="11">• Specific Gravity: 1.010 – 1.025</text>';
      svg += '<text x="20" y="146" fill="#f8fafc" font-size="11">• Odour: Characteristic faint aromatic</text>';
      svg += '<text x="20" y="168" fill="#fbbf24" font-size="11" font-weight="bold">• Urea Excretion: 25 – 30 grams / day</text>';
      svg += '<text x="20" y="190" fill="#f8fafc" font-size="11">• Inorganic Solutes: Na+, K+, Cl-, PO4(3-), SO4(2-)</text>';
      svg += '<text x="20" y="212" fill="#f8fafc" font-size="11">• Creatinine: 1.0 – 1.5 g / day</text>';
      svg += '<text x="20" y="234" fill="#f8fafc" font-size="11">• Protein (Albumin): ZERO / trace only</text>';
      svg += '<text x="20" y="256" fill="#f8fafc" font-size="11">• Glucose &amp; Ketone Bodies: ABSENT (Negative)</text>';
      svg += '<text x="20" y="278" fill="#34d399" font-size="11">• Blood (RBCs) &amp; Bile Salts: ABSENT (Negative)</text>';
      svg += '</g>';

      // Right Panel: Pathological Urinalysis
      svg += '<g transform="translate(395, 60)">';
      svg += '<rect x="0" y="0" width="335" height="290" fill="#1e293b" rx="8" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="167" y="28" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">Clinical Pathology &amp; Diagnostic Biomarkers</text>';

      // Biomarker 1: Glycosuria
      svg += '<rect x="15" y="45" width="305" height="70" fill="#7f1d1d" rx="6"/>';
      svg += '<text x="25" y="68" fill="#fca5a5" font-size="12" font-weight="bold">1. Glycosuria (Glucose in Urine):</text>';
      svg += '<text x="25" y="88" fill="#f8fafc" font-size="10">• Blood glucose exceeds renal threshold (>180 mg/dL)</text>';
      svg += '<text x="25" y="104" fill="#fef08a" font-size="10" font-weight="bold">• Primary hallmark of Diabetes Mellitus</text>';

      // Biomarker 2: Ketonuria
      svg += '<rect x="15" y="125" width="305" height="70" fill="#701a75" rx="6"/>';
      svg += '<text x="25" y="148" fill="#f472b6" font-size="12" font-weight="bold">2. Ketonuria (Ketone Bodies in Urine):</text>';
      svg += '<text x="25" y="168" fill="#f8fafc" font-size="10">• Acetoacetic acid, β-hydroxybutyrate, acetone</text>';
      svg += '<text x="25" y="184" fill="#fbcfe8" font-size="10" font-weight="bold">• Indicates severe Diabetes Mellitus / starvation ketosis</text>';

      // Other indicators
      svg += '<rect x="15" y="205" width="305" height="70" fill="#0f172a" rx="6" stroke="#475569"/>';
      svg += '<text x="25" y="226" fill="#fbbf24" font-size="11" font-weight="bold">3. Additional Clinical Conditions:</text>';
      svg += '<text x="25" y="244" fill="#f8fafc" font-size="10">• Proteinuria (Albuminuria): Glomerulonephritis, renal leak</text>';
      svg += '<text x="25" y="260" fill="#f8fafc" font-size="10">• Hematuria: Trauma, stones, calculi, bladder malignancies</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Daily Urine Output', '1.0 – 1.5 L / day', '#38bdf8') +
              cell('Urine Reaction (pH)', 'Slightly Acidic (Average pH 6.0)', '#fbbf24') +
              cell('Daily Urea Excretion', '25 – 30 grams / day', '#34d399') +
              cell('Diabetes Hallmarks', 'Glycosuria + Ketonuria', '#ef4444');

      vHtml = '<strong>Diagnostic Value of Urinalysis:</strong> An adult human excretes, on average, <strong>1 to 1.5 litres of urine per day</strong>. Normal urine is a transparent, light yellow watery fluid containing the pigment <em>urochrome</em>, with a slightly acidic pH (average <strong>pH 6.0</strong>) and a daily excretion of <strong>25 to 30 grams of urea</strong>. Clinical examination of urine provides vital diagnostic insight into metabolic function: the presence of glucose (<strong>Glycosuria</strong>) and ketone bodies (<strong>Ketonuria</strong>) in urine is indicative of uncontrolled <em>Diabetes Mellitus</em> and diabetic ketoacidosis.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">ACCESSORY EXCRETORY ORGANS: LUNGS, LIVER &amp; SKIN GLANDS</text>';

      // Card 1: Lungs
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="220" height="290" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="110" y="26" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">1. Lungs (Respiratory)</text>';
      svg += '<rect x="15" y="45" width="190" height="50" fill="#0c4a6e" rx="6"/>';
      svg += '<text x="105" y="66" fill="#7dd3fc" font-size="10" text-anchor="middle">CO2 Excretion Rate:</text>';
      svg += '<text x="105" y="85" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">~ 200 mL CO2 / min</text>';
      svg += '<text x="15" y="120" fill="#f8fafc" font-size="11">• Excretes massive carbon dioxide (~18,000 mmol/day)</text>';
      svg += '<text x="15" y="145" fill="#f8fafc" font-size="11">• Eliminates significant water (~ 400 mL/day as vapor)</text>';
      svg += '<text x="15" y="170" fill="#f8fafc" font-size="11">• Volatile anesthetic agents and alcohol vapors</text>';
      svg += '<text x="15" y="210" fill="#38bdf8" font-size="11" font-weight="bold">Primary Function:</text>';
      svg += '<text x="15" y="230" fill="#cbd5e1" font-size="10">Volatile acid-base balance via alveolar ventilation</text>';
      svg += '</g>';

      // Card 2: Liver
      svg += '<g transform="translate(270, 60)">';
      svg += '<rect x="0" y="0" width="220" height="290" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<text x="110" y="26" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">2. Liver (Hepatobiliary)</text>';
      svg += '<rect x="15" y="45" width="190" height="50" fill="#78350f" rx="6"/>';
      svg += '<text x="105" y="66" fill="#fde68a" font-size="10" text-anchor="middle">Bile Excretory Load:</text>';
      svg += '<text x="105" y="85" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">Bile Pigments &amp; Sterols</text>';
      svg += '<text x="15" y="120" fill="#f8fafc" font-size="11">• Bilirubin &amp; Biliverdin (heme breakdown products)</text>';
      svg += '<text x="15" y="145" fill="#f8fafc" font-size="11">• Degraded steroid hormones, cholesterol</text>';
      svg += '<text x="15" y="170" fill="#f8fafc" font-size="11">• Inactivated drugs, toxins, heavy metals, vitamins</text>';
      svg += '<text x="15" y="210" fill="#fbbf24" font-size="11" font-weight="bold">Primary Destination:</text>';
      svg += '<text x="15" y="230" fill="#cbd5e1" font-size="10">Discharged into duodenum and expelled with feces</text>';
      svg += '</g>';

      // Card 3: Skin
      svg += '<g transform="translate(510, 60)">';
      svg += '<rect x="0" y="0" width="220" height="290" fill="#1e293b" rx="8" stroke="#34d399" stroke-width="2"/>';
      svg += '<text x="110" y="26" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">3. Skin (Integument)</text>';
      svg += '<rect x="15" y="45" width="190" height="50" fill="#064e3b" rx="6"/>';
      svg += '<text x="105" y="66" fill="#a7f3d0" font-size="10" text-anchor="middle">Cutaneous Glands:</text>';
      svg += '<text x="105" y="85" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">Sweat &amp; Sebaceous</text>';
      svg += '<text x="15" y="115" fill="#34d399" font-size="11" font-weight="bold">A. Sweat Glands:</text>';
      svg += '<text x="15" y="132" fill="#f8fafc" font-size="10">• Thermoregulation (cooling)</text>';
      svg += '<text x="15" y="148" fill="#f8fafc" font-size="10">• Excretes NaCl, urea, lactic acid</text>';
      svg += '<text x="15" y="175" fill="#34d399" font-size="11" font-weight="bold">B. Sebaceous Glands:</text>';
      svg += '<text x="15" y="192" fill="#f8fafc" font-size="10">• Sebum: sterols, hydrocarbons, waxes</text>';
      svg += '<text x="15" y="208" fill="#f8fafc" font-size="10">• Protective oily skin mantle</text>';
      svg += '<text x="15" y="240" fill="#cbd5e1" font-size="10">• Minor excretory capacity</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Pulmonary CO2 Output', '200 mL CO2 / min', '#38bdf8') +
              cell('Hepatic Bile Pigments', 'Bilirubin &amp; Biliverdin', '#fbbf24') +
              cell('Sweat Constituents', 'Water, NaCl, Urea, Lactic Acid', '#34d399') +
              cell('Sebum Constituents', 'Sterols, Hydrocarbons, Waxes', '#ec4899');

      vHtml = '<strong>Accessory Non-Renal Excretory Organs:</strong> Other organs participate critically in nitrogenous and metabolic waste elimination: (1) <strong>Lungs</strong> eliminate massive amounts of $CO_2$ (approximately <strong>200 mL/min</strong> or ~18,000 mmol/day) and significant water vapor; (2) <strong>Liver</strong>, the largest gland, synthesizes bile containing breakdown products of hemoglobin (<em>bilirubin</em> and <em>biliverdin</em>), cholesterol, degraded steroid hormones, vitamins, and drugs, which are eliminated with digestive feces; (3) <strong>Skin</strong> houses <em>sweat glands</em> that facilitate evaporative cooling while excreting aqueous $NaCl$, small quantities of urea, and lactic acid, alongside <em>sebaceous glands</em> that eliminate sterols, fatty hydrocarbons, and waxes via sebum.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Hemodialysis & Renal Pathology (hemodialysispathologysim)
// -------------------------------------------------------------------------
window.SIMS.hemodialysispathologysim = (function(){
  var view = "dialysis"; // "dialysis", "disorders", "transplantation"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Arterial Blood Drawn (Heparinized)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cellophane Dialysis Unit &amp; Dialyzing Fluid</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Purified Venous Blood (Anti-Heparin Added)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Renal Calculi &amp; Glomerulonephritis</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.hemodialysispathologysim.setView(\'dialysis\')">1. Artificial Kidney: Extracorporeal Hemodialysis Circuit</button>' +
        '<button class="preset-btn" onclick="SIMS.hemodialysispathologysim.setView(\'disorders\')">2. Renal Calculi (Stones) &amp; Glomerulonephritis</button>' +
        '<button class="preset-btn" onclick="SIMS.hemodialysispathologysim.setView(\'transplantation\')">3. End-Stage Renal Disease (ESRD) &amp; Transplantation</button>';
    }
    render(0);
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

    if (view === "dialysis") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">EXTRACORPOREAL HEMODIALYSIS CIRCUIT: THE ARTIFICIAL KIDNEY (HEMODIALYSER)</text>';

      // Patient Arm
      svg += '<g transform="translate(30, 80)">';
      svg += '<rect x="0" y="40" width="80" height="140" fill="#334155" rx="8"/>';
      svg += '<text x="40" y="30" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">Patient Arm</text>';

      // Radial Artery Outflow (Red)
      svg += '<circle cx="40" cy="70" r="10" fill="#ef4444"/>';
      svg += '<text x="40" y="100" fill="#fca5a5" font-size="9" text-anchor="middle">Radial Artery</text>';

      // Cephalic Vein Return (Blue)
      svg += '<circle cx="40" cy="140" r="10" fill="#3b82f6"/>';
      svg += '<text x="40" y="170" fill="#93c5fd" font-size="9" text-anchor="middle">Vein Return</text>';
      svg += '</g>';

      // Heparin Pump Box
      svg += '<g transform="translate(130, 90)">';
      svg += '<rect x="0" y="0" width="100" height="50" fill="#7f1d1d" rx="6" stroke="#ef4444"/>';
      svg += '<text x="50" y="22" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">Heparin Infusion</text>';
      svg += '<text x="50" y="38" fill="#fff" font-size="9" text-anchor="middle">(Anticoagulant)</text>';
      svg += '<line x1="-20" y1="25" x2="0" y2="25" stroke="#ef4444" stroke-width="4"/>';
      svg += '<line x1="100" y1="25" x2="130" y2="25" stroke="#ef4444" stroke-width="4"/>';
      svg += '</g>';

      // Dialyser Core Box
      svg += '<g transform="translate(260, 60)">';
      svg += '<rect x="0" y="0" width="220" height="230" fill="#0f172a" rx="8" stroke="#38bdf8" stroke-width="3"/>';
      svg += '<text x="110" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Cellophane Tubing Unit</text>';

      // Coiled Cellophane Tubing
      for (var c = 0; c < 5; c++) {
        svg += '<path d="M 20 ' + (50 + c * 32) + ' L 200 ' + (50 + c * 32) + '" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>';
        svg += '<path d="M 20 ' + (50 + c * 32) + ' L 200 ' + (50 + c * 32) + '" stroke="#fca5a5" stroke-width="2" stroke-dasharray="4,4"/>';
      }

      // Diffusion arrows out of tubes
      svg += '<text x="110" y="110" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">Urea Diffuses Down Gradient</text>';
      svg += '<text x="110" y="180" fill="#60a5fa" font-size="10" text-anchor="middle">Dialysate: Same as plasma MINUS Urea</text>';

      // Dialysate In / Out
      svg += '<text x="20" y="215" fill="#34d399" font-size="10">Fresh Fluid IN</text>';
      svg += '<text x="150" y="215" fill="#f87171" font-size="10">Used Fluid OUT</text>';
      svg += '</g>';

      // Anti-Heparin & Return
      svg += '<g transform="translate(510, 160)">';
      svg += '<rect x="0" y="0" width="110" height="50" fill="#065f46" rx="6" stroke="#10b981"/>';
      svg += '<text x="55" y="22" fill="#a7f3d0" font-size="10" font-weight="bold" text-anchor="middle">Anti-Heparin Added</text>';
      svg += '<text x="55" y="38" fill="#fff" font-size="9" text-anchor="middle">(Restores Clotting)</text>';
      svg += '<line x1="-30" y1="25" x2="0" y2="25" stroke="#3b82f6" stroke-width="4"/>';
      svg += '<line x1="110" y1="25" x2="140" y2="25" stroke="#3b82f6" stroke-width="4"/>';
      svg += '</g>';

      // Bottom Specs
      svg += '<g transform="translate(30, 305)">';
      svg += '<rect x="0" y="0" width="700" height="65" fill="#1e293b" rx="6" stroke="#475569"/>';
      svg += '<text x="20" y="22" fill="#fbbf24" font-size="11" font-weight="bold">Hemodialysis Operating Principle:</text>';
      svg += '<text x="20" y="40" fill="#f8fafc" font-size="10">• Dialyzing fluid contains exact same electrolyte osmolarity as normal plasma, except it has ZERO nitrogenous waste.</text>';
      svg += '<text x="20" y="56" fill="#f8fafc" font-size="10">• Porous cellophane membrane allows urea, creatinine, and uric acid to diffuse outward without losing plasma proteins or cells.</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Blood Source', 'Convenient Artery (e.g., Radial)', '#ef4444') +
              cell('Anticoagulant Added', 'Heparin (Prior to dialyser)', '#fbbf24') +
              cell('Semipermeable Core', 'Coiled Cellophane Membrane Unit', '#38bdf8') +
              cell('Post-Dialysis Reversal', 'Anti-Heparin before venous return', '#34d399');

      vHtml = '<strong>The Hemodialysis Circuit (Artificial Kidney):</strong> In patients with severe uremia resulting from acute renal failure, an artificial kidney is deployed for <em>hemodialysis</em>. Blood drained from a convenient peripheral artery (such as the radial artery) is pumped into a dialyzing unit after the addition of the anticoagulant <strong>heparin</strong>. The unit contains a coiled porous <em>cellophane tube</em> immersed in a dialyzing fluid whose electrolyte composition matches normal plasma exactly, but completely lacks nitrogenous wastes. Wastes (urea, creatinine) freely diffuse outward down concentration gradients into the dialysate. The cleared blood is treated with <strong>anti-heparin</strong> to restore clotting competence and returned safely to the patient through a vein.';
    } else if (view === "disorders") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">CLINICAL NEPHROLOGY: UREMIA, RENAL CALCULI &amp; GLOMERULONEPHRITIS</text>';

      // Disorder 1: Uremia
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="220" height="290" fill="#1e293b" rx="8" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="110" y="28" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">1. Uremia</text>';
      svg += '<rect x="15" y="45" width="190" height="50" fill="#7f1d1d" rx="6"/>';
      svg += '<text x="105" y="66" fill="#fca5a5" font-size="10" text-anchor="middle">Pathological Condition:</text>';
      svg += '<text x="105" y="85" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Accumulation of Urea</text>';
      svg += '<text x="15" y="120" fill="#f8fafc" font-size="11">• Kidney malfunction fails to clear urea</text>';
      svg += '<text x="15" y="145" fill="#f8fafc" font-size="11">• Blood urea nitrogen (BUN) soars</text>';
      svg += '<text x="15" y="170" fill="#f8fafc" font-size="11">• Highly toxic to brain, pericardium &amp; GI tract</text>';
      svg += '<text x="15" y="195" fill="#f8fafc" font-size="11">• Can trigger fatal uremic encephalopathy</text>';
      svg += '<text x="15" y="235" fill="#fca5a5" font-size="11" font-weight="bold">Primary Intervention:</text>';
      svg += '<text x="15" y="255" fill="#f8fafc" font-size="10">Immediate hemodialysis or renal transplant</text>';
      svg += '</g>';

      // Disorder 2: Renal Calculi
      svg += '<g transform="translate(270, 60)">';
      svg += '<rect x="0" y="0" width="220" height="290" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<text x="110" y="28" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">2. Renal Calculi (Stones)</text>';
      svg += '<rect x="15" y="45" width="190" height="50" fill="#78350f" rx="6"/>';
      svg += '<text x="105" y="66" fill="#fde68a" font-size="10" text-anchor="middle">Mineral Precipitates:</text>';
      svg += '<text x="105" y="85" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Calcium Oxalates / Urates</text>';
      svg += '<text x="15" y="120" fill="#f8fafc" font-size="11">• Insoluble crystals precipitate in calyces</text>';
      svg += '<text x="15" y="145" fill="#f8fafc" font-size="11">• Sharp calculi lodge in narrow ureters</text>';
      svg += '<text x="15" y="170" fill="#f8fafc" font-size="11">• Causes severe excruciating renal colic pain</text>';
      svg += '<text x="15" y="195" fill="#f8fafc" font-size="11">• Induces hematuria (blood in urine)</text>';
      svg += '<text x="15" y="235" fill="#fde68a" font-size="11" font-weight="bold">Treatment Options:</text>';
      svg += '<text x="15" y="255" fill="#f8fafc" font-size="10">Lithotripsy shockwaves, hydration, surgery</text>';
      svg += '</g>';

      // Disorder 3: Glomerulonephritis
      svg += '<g transform="translate(510, 60)">';
      svg += '<rect x="0" y="0" width="220" height="290" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="110" y="28" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">3. Glomerulonephritis</text>';
      svg += '<rect x="15" y="45" width="190" height="50" fill="#0c4a6e" rx="6"/>';
      svg += '<text x="105" y="66" fill="#7dd3fc" font-size="10" text-anchor="middle">Inflammatory Condition:</text>';
      svg += '<text x="105" y="85" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Bright&#39;s Disease</text>';
      svg += '<text x="15" y="120" fill="#f8fafc" font-size="11">• Immune-complex inflammation of glomeruli</text>';
      svg += '<text x="15" y="145" fill="#f8fafc" font-size="11">• Often follows streptococcal throat infection</text>';
      svg += '<text x="15" y="170" fill="#f8fafc" font-size="11">• Ruptures podocyte slit membranes</text>';
      svg += '<text x="15" y="195" fill="#f8fafc" font-size="11">• Leads to proteinuria, hematuria, and edema</text>';
      svg += '<text x="15" y="235" fill="#7dd3fc" font-size="11" font-weight="bold">Clinical Manifestations:</text>';
      svg += '<text x="15" y="255" fill="#f8fafc" font-size="10">Hypertension, oliguria, facial puffiness</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Uremia Definition', 'Excess Urea Accumulation in Blood', '#ef4444') +
              cell('Renal Calculi Material', 'Insoluble Calcium Oxalate Crystals', '#fbbf24') +
              cell('Glomerulonephritis', 'Immune Inflammation of Glomeruli', '#38bdf8') +
              cell('Clinical Triad', 'Hematuria, Proteinuria, Edema', '#f472b6');

      vHtml = '<strong>Major Pathologies of the Excretory System:</strong> (1) <strong>Uremia</strong>: When renal clearance falters, urea accumulates dangerously in the bloodstream, exerting severe neurotoxicity and systemic metabolic disruption; (2) <strong>Renal Calculi (Nephrolithiasis)</strong>: Insoluble stones or crystalline masses, primarily composed of precipitated <em>calcium oxalates</em>, calcium phosphates, or uric acid, form within the renal pelvis and calyces, causing intense paroxysmal spasms (renal colic) and hematuria when obstructing urinary outflow; (3) <strong>Glomerulonephritis (Bright&#39;s disease)</strong>: Immune-mediated inflammation of the renal glomeruli leading to disrupted podocyte architecture, marked leakage of serum albumin (proteinuria), presence of red cells (hematuria), hypertension, and peripheral edema.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">END-STAGE RENAL DISEASE (ESRD) &amp; ALLOGRAFT KIDNEY TRANSPLANTATION</text>';

      // Left: ESRD and Transplant Graphic
      svg += '<g transform="translate(40, 60)">';
      svg += '<rect x="0" y="0" width="320" height="290" fill="#1e293b" rx="8" stroke="#34d399" stroke-width="2"/>';
      svg += '<text x="160" y="28" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">Kidney Transplantation: Definitive Cure</text>';

      svg += '<rect x="20" y="48" width="280" height="60" fill="#064e3b" rx="6"/>';
      svg += '<text x="30" y="70" fill="#a7f3d0" font-size="11" font-weight="bold">Surgical Allograft Placement:</text>';
      svg += '<text x="30" y="88" fill="#f8fafc" font-size="10">Donor kidney placed retroperitoneally in iliac fossa</text>';
      svg += '<text x="30" y="102" fill="#f8fafc" font-size="10">Vessels anastomosed to external iliac artery &amp; vein</text>';

      svg += '<rect x="20" y="120" width="280" height="60" fill="#0f172a" rx="6" stroke="#059669"/>';
      svg += '<text x="30" y="142" fill="#34d399" font-size="11" font-weight="bold">Donor Selection Criteria:</text>';
      svg += '<text x="30" y="160" fill="#f8fafc" font-size="10">• Close relative preferred to maximize HLA match</text>';
      svg += '<text x="30" y="174" fill="#f8fafc" font-size="10">• Minimizes cell-mediated immune rejection risk</text>';

      svg += '<rect x="20" y="195" width="280" height="75" fill="#701a75" rx="6"/>';
      svg += '<text x="30" y="218" fill="#f472b6" font-size="11" font-weight="bold">Lifelong Immunosuppressive Therapy:</text>';
      svg += '<text x="30" y="238" fill="#fdf2f8" font-size="10">• Cyclosporine, Tacrolimus, Corticosteroids</text>';
      svg += '<text x="30" y="254" fill="#fdf2f8" font-size="10">• Suppresses host T-cell mediated graft rejection</text>';
      svg += '</g>';

      // Right: Comparison of Hemodialysis vs Transplant
      svg += '<g transform="translate(390, 60)">';
      svg += '<rect x="0" y="0" width="330" height="290" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="165" y="28" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Comparative Therapeutic Modalities</text>';

      // Hemodialysis Box
      svg += '<rect x="15" y="45" width="300" height="105" fill="#0f172a" rx="6" stroke="#64748b"/>';
      svg += '<text x="25" y="68" fill="#f87171" font-size="11" font-weight="bold">A. Maintenance Hemodialysis:</text>';
      svg += '<text x="25" y="88" fill="#f8fafc" font-size="10">• Requires 3-4 hours per session, 3 times weekly</text>';
      svg += '<text x="25" y="104" fill="#f8fafc" font-size="10">• Clears small solutes, but cannot replace endocrine roles</text>';
      svg += '<text x="25" y="120" fill="#f8fafc" font-size="10">• Erythropoietin &amp; Calcitriol must be injected</text>';
      svg += '<text x="25" y="136" fill="#fbbf24" font-size="10">• Substantial dietary potassium &amp; fluid restrictions</text>';

      // Transplant Box
      svg += '<rect x="15" y="165" width="300" height="105" fill="#0f172a" rx="6" stroke="#0284c7"/>';
      svg += '<text x="25" y="188" fill="#38bdf8" font-size="11" font-weight="bold">B. Successful Kidney Allograft:</text>';
      svg += '<text x="25" y="208" fill="#f8fafc" font-size="10">• Restores 100% full physiological clearance</text>';
      svg += '<text x="25" y="224" fill="#f8fafc" font-size="10">• Restores endogenous erythropoietin &amp; calcitriol</text>';
      svg += '<text x="25" y="240" fill="#f8fafc" font-size="10">• Eliminates dietary dialysis restrictions</text>';
      svg += '<text x="25" y="256" fill="#34d399" font-size="10">• Greatly enhances patient survival and quality of life</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('ESRD Definitive Treatment', 'Renal Allograft Transplantation', '#34d399') +
              cell('Optimal Donor Source', 'Close Relative (Matched HLA / MHC)', '#38bdf8') +
              cell('Rejection Prevention', 'Lifelong Immunosuppressants', '#ec4899') +
              cell('Endocrine Recovery', 'Restores EPO &amp; Calcitriol Secretion', '#fbbf24');

      vHtml = '<strong>Renal Failure and Kidney Transplantation:</strong> In irreversible acute renal failure or <em>End-Stage Renal Disease (ESRD)</em>, dialysis serves solely as an extracorporeal maintenance bridge. The ultimate and definitive method for correction is <strong>kidney transplantation</strong>. A functional kidney is surgically grafted into the recipient from a healthy donor—ideally a close living relative to achieve maximal matching of Human Leukocyte Antigens (HLA) and minimize tissue rejection. Even with optimal matching, the recipient must adhere to lifelong immunosuppressive therapy to prevent host cytotoxic T-lymphocytes from rejecting the allograft.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();
