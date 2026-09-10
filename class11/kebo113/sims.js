// kebo113 interactive simulations: Plant Growth and Development
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
// 1. SIMULATION 1: Growth Phases & Kinetics (growthphasesim)
// -------------------------------------------------------------------------
window.SIMS.growthphasesim = (function(){
  var mode = "phases"; // "phases", "arithmetic", "geometric", "rates"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Meristematic Zone (Mitosis)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Elongation Zone (Vacuolation)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Maturation Zone (Root Hairs)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Mathematical Growth Curves</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.growthphasesim.setMode(\'phases\')">1. Root Apex Growth Zones</button>' +
      '<button class="preset-btn" onclick="SIMS.growthphasesim.setMode(\'arithmetic\')">2. Arithmetic Growth (Lt = L0 + rt)</button>' +
      '<button class="preset-btn" onclick="SIMS.growthphasesim.setMode(\'geometric\')">3. Geometric & Sigmoid Curve</button>' +
      '<button class="preset-btn" onclick="SIMS.growthphasesim.setMode(\'rates\')">4. Absolute vs Relative Rates</button>';
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

    if (mode === "phases") {
      var stretch = 20 + t * 15;
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">ROOT APICAL ANATOMY & ZONES OF CELLULAR GROWTH</text>';

      // Root Cap
      svg += '<path d="M 120 340 C 140 370, 200 370, 220 340 Z" fill="#64748b" opacity="0.8"/>';
      svg += '<text x="170" y="360" fill="#f8fafc" font-size="11" text-anchor="middle">Root Cap (Protection)</text>';

      // Zone 1: Meristematic (active division)
      svg += '<rect x="130" y="280" width="80" height="55" fill="#ef4444" opacity="0.85" rx="4"/>';
      svg += '<text x="170" y="312" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Meristematic Zone</text>';
      svg += '<text x="230" y="305" fill="#fca5a5" font-size="11">Dense protoplasm, conspicuous nuclei, thin cellulosic walls</text>';

      // Zone 2: Elongation
      var elHeight = 60 + stretch;
      var elY = 275 - elHeight;
      svg += '<rect x="130" y="' + elY + '" width="80" height="' + elHeight + '" fill="#38bdf8" opacity="0.85" rx="4"/>';
      svg += '<text x="170" y="' + (elY + elHeight/2 + 4) + '" fill="#0f172a" font-size="11" font-weight="bold" text-anchor="middle">Elongation Zone</text>';
      svg += '<text x="230" y="' + (elY + elHeight/2 + 4) + '" fill="#7dd3fc" font-size="11">Increased vacuolation, cell stretching, wall deposition (t=' + t + ')</text>';

      // Zone 3: Maturation
      var matY = elY - 90;
      svg += '<rect x="130" y="' + matY + '" width="80" height="85" fill="#10b981" opacity="0.85" rx="4"/>';
      svg += '<text x="170" y="' + (matY + 45) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Maturation Zone</text>';
      svg += '<text x="230" y="' + (matY + 45) + '" fill="#6ee7b7" font-size="11">Differentiated tissues (xylem/phloem), root hairs for absorption</text>';

      // Root Hairs
      for (var h = 0; h < 5; h++) {
        var hy = matY + 15 + h * 15;
        svg += '<line x1="130" y1="' + hy + '" x2="80" y2="' + hy + '" stroke="#6ee7b7" stroke-width="2.5"/>';
        svg += '<line x1="210" y1="' + hy + '" x2="260" y2="' + hy + '" stroke="#6ee7b7" stroke-width="2.5"/>';
      }

      // Bracket indicator
      svg += '<path d="M 680 80 L 700 80 L 700 350 L 680 350" fill="none" stroke="#64748b" stroke-width="2"/>';
      svg += '<text x="690" y="215" fill="#e2e8f0" font-size="12" text-anchor="middle" transform="rotate(90 690 215)">Total Root Apex Length: ' + (15 + t*3) + ' mm</text>';
      svg += '</svg>';

      rHtml = cell('Growth Phase', 'Zone of Elongation', '#38bdf8') +
              cell('Root Length', (15 + t*3) + ' mm', '#10b981') +
              cell('Vacuolation Degree', (30 + t*17) + ' %', '#fbbf24') +
              cell('Cell State', 'Active stretching & wall deposition', '#f43f5e');

      vHtml = '<strong>Anatomy of Growth Zones:</strong> Growth at the root tip progresses through three contiguous phases: <em>Meristematic zone</em> (isodiametric cells with dense protoplasm and large nuclei actively dividing), <em>Elongation zone</em> (cells swell by rapid water uptake, vacuolation, and wall matrix deposition, propelling the tip through the soil), and <em>Maturation zone</em> (cells reach maximal size, undergo secondary thickening/lignification, and form epidermal root hairs).';
    }
    else if (mode === "arithmetic") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">ARITHMETIC GROWTH KINETICS: Lt = L0 + rt</text>';

      // Axes
      svg += '<line x1="80" y1="320" x2="700" y2="320" stroke="#475569" stroke-width="2"/>';
      svg += '<line x1="80" y1="320" x2="80" y2="60" stroke="#475569" stroke-width="2"/>';
      svg += '<text x="700" y="345" fill="#94a3b8" font-size="12" text-anchor="end">Time (t) -> Days</text>';
      svg += '<text x="65" y="60" fill="#94a3b8" font-size="12" text-anchor="end">Length (L)</text>';

      // Arithmetic line: L0 = 20, r = 25
      var pts = [];
      for (var day = 0; day <= 6; day++) {
        var x = 80 + day * 90;
        var y = 320 - (20 + day * 38);
        pts.push(x + ',' + y);
        svg += '<circle cx="' + x + '" cy="' + y + '" r="5" fill="#38bdf8"/>';
        svg += '<text x="' + x + '" y="340" fill="#64748b" font-size="11" text-anchor="middle">Day ' + day + '</text>';
      }
      svg += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';

      // Current t highlight
      var curX = 80 + t * 135;
      var curY = 320 - (20 + t * 57);
      svg += '<circle cx="' + curX + '" cy="' + curY + '" r="8" fill="#ef4444"/>';
      svg += '<line x1="' + curX + '" y1="320" x2="' + curX + '" y2="' + curY + '" stroke="#ef4444" stroke-dasharray="4"/>';
      svg += '<text x="' + (curX + 10) + '" y="' + (curY - 10) + '" fill="#fca5a5" font-size="12" font-weight="bold">Lt = ' + (10 + t * 15) + ' cm</text>';

      // Cell division scheme: 1 divides, 1 differentiates
      svg += '<g transform="translate(480, 80)">';
      svg += '<rect x="0" y="0" width="240" height="130" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="12" y="24" fill="#38bdf8" font-size="12" font-weight="bold">Mitotic Cell Fate (Arithmetic):</text>';
      svg += '<circle cx="30" cy="55" r="10" fill="#ef4444"/>';
      svg += '<text x="50" y="60" fill="#f8fafc" font-size="11">Parent Meristem Cell</text>';
      svg += '<path d="M 30 70 L 30 90 L 15 105 M 30 90 L 45 105" fill="none" stroke="#94a3b8" stroke-width="1.5"/>';
      svg += '<circle cx="15" cy="115" r="8" fill="#ef4444"/>';
      svg += '<text x="30" y="119" fill="#fca5a5" font-size="10">Continues to divide (1)</text>';
      svg += '<circle cx="140" cy="115" r="8" fill="#10b981"/>';
      svg += '<text x="155" y="119" fill="#6ee7b7" font-size="10">Differentiates (1)</text>';
      svg += '</g>';
      svg += '</svg>';

      var currL = 10 + t * 15;
      rHtml = cell('Model', 'Arithmetic Growth', '#38bdf8') +
              cell('Formula', 'Lt = L0 + rt', '#fbbf24') +
              cell('Initial L0', '10.0 cm', '#94a3b8') +
              cell('Current Lt', currL.toFixed(1) + ' cm', '#ef4444');

      vHtml = '<strong>Arithmetic Growth Mechanism:</strong> Following mitosis, only one daughter cell continues division while the other differentiates and matures (e.g., in a root elongating at a steady rate). When length is plotted against time, a direct linear graph is obtained with constant growth rate <em>r</em>.';
    }
    else if (mode === "geometric") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">GEOMETRIC & SIGMOID (S-SHAPED) GROWTH CURVE: W1 = W0 * e^(rt)</text>';

      // Axes
      svg += '<line x1="80" y1="320" x2="700" y2="320" stroke="#475569" stroke-width="2"/>';
      svg += '<line x1="80" y1="320" x2="80" y2="60" stroke="#475569" stroke-width="2"/>';
      svg += '<text x="700" y="345" fill="#94a3b8" font-size="12" text-anchor="end">Time (t) -> Phases</text>';
      svg += '<text x="65" y="60" fill="#94a3b8" font-size="12" text-anchor="end">Size / Weight (W)</text>';

      // Sigmoid Curve
      // Lag (x: 80-220), Log/Exp (x: 220-480), Stationary (x: 480-680)
      var sigPath = 'M 80 310 C 180 305, 230 290, 320 200 C 400 110, 470 75, 680 75';
      svg += '<path d="' + sigPath + '" fill="none" stroke="#10b981" stroke-width="3.5"/>';

      // Phase Labels
      svg += '<rect x="90" y="270" width="100" height="25" fill="#334155" rx="4"/>';
      svg += '<text x="140" y="287" fill="#f8fafc" font-size="11" text-anchor="middle">1. Lag Phase</text>';

      svg += '<rect x="300" y="140" width="130" height="25" fill="#ef4444" opacity="0.8" rx="4"/>';
      svg += '<text x="365" y="157" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">2. Log (Exponential)</text>';

      svg += '<rect x="520" y="90" width="120" height="25" fill="#334155" rx="4"/>';
      svg += '<text x="580" y="107" fill="#f8fafc" font-size="11" text-anchor="middle">3. Stationary Phase</text>';

      // Highlight current t point along sigmoid
      var ptsSig = [
        {x: 120, y: 308, phase: "Lag Phase (Initial slow growth)", w: 2.1},
        {x: 260, y: 265, phase: "Early Exponential (Accelerating)", w: 6.8},
        {x: 360, y: 160, phase: "Mid Exponential / Log Phase", w: 18.5},
        {x: 480, y: 92, phase: "Decelerating Growth", w: 28.2},
        {x: 620, y: 75, phase: "Stationary Phase (Limiting resources)", w: 32.0}
      ];
      var cp = ptsSig[Math.min(t, 4)];
      svg += '<circle cx="' + cp.x + '" cy="' + cp.y + '" r="8" fill="#fbbf24"/>';
      svg += '<line x1="' + cp.x + '" y1="320" x2="' + cp.x + '" y2="' + cp.y + '" stroke="#fbbf24" stroke-dasharray="4"/>';
      svg += '<text x="' + cp.x + '" y="' + (cp.y - 14) + '" fill="#fef08a" font-size="12" font-weight="bold" text-anchor="middle">W = ' + cp.w + ' g</text>';

      // Cell division scheme: both divide
      svg += '<g transform="translate(490, 180)">';
      svg += '<rect x="0" y="0" width="220" height="110" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="12" y="24" fill="#10b981" font-size="12" font-weight="bold">Geometric Doubling:</text>';
      svg += '<text x="12" y="48" fill="#f8fafc" font-size="11">1 -> 2 -> 4 -> 8 -> 16 -> 32...</text>';
      svg += '<text x="12" y="70" fill="#94a3b8" font-size="10">Both daughter cells divide</text>';
      svg += '<text x="12" y="92" fill="#fbbf24" font-size="10">Parameter r = Efficiency Index</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Model', 'Sigmoid Curve', '#10b981') +
              cell('Equation', 'W1 = W0 * e^(rt)', '#fbbf24') +
              cell('Current Phase', cp.phase, '#38bdf8') +
              cell('Biomass W1', cp.w + ' g', '#ef4444');

      vHtml = '<strong>Sigmoid (S-shaped) Curve:</strong> Living organs in natural environments follow a classic sigmoid curve. Growth begins with a slow <em>Lag phase</em>, transitions into a dramatic <em>Log or Exponential phase</em> where both daughter cells continuously divide, and eventually levels off into a <em>Stationary phase</em> when limited space, nutrients, or internal genetic programming limit further expansion.';
    }
    else if (mode === "rates") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">QUANTITATIVE COMPARISON: ABSOLUTE VS RELATIVE GROWTH RATE</text>';

      // Leaf A: initial 5 cm2, final 10 cm2 (grows by 5 cm2)
      var growA = t * 1.25;
      svg += '<g transform="translate(100, 70)">';
      svg += '<text x="80" y="20" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">LEAF A (Small Leaf)</text>';
      // Initial Leaf A
      svg += '<ellipse cx="80" cy="90" rx="35" ry="50" fill="#0284c7" opacity="0.6"/>';
      svg += '<text x="80" y="95" fill="#e0f2fe" font-size="11" text-anchor="middle">Initial: 5 cm²</text>';
      // Expanded Leaf A
      var rAx = 35 + growA * 3;
      var rAy = 50 + growA * 4;
      svg += '<ellipse cx="80" cy="220" rx="' + rAx + '" ry="' + rAy + '" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5"/>';
      svg += '<text x="80" y="225" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Final: ' + (5 + growA).toFixed(1) + ' cm²</text>';
      svg += '<text x="80" y="275" fill="#94a3b8" font-size="11" text-anchor="middle">AGR = 5 cm²/day | RGR = 100%</text>';
      svg += '</g>';

      // Leaf B: initial 50 cm2, final 55 cm2 (grows by 5 cm2)
      var growB = t * 1.25;
      svg += '<g transform="translate(420, 70)">';
      svg += '<text x="120" y="20" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">LEAF B (Large Leaf)</text>';
      // Initial Leaf B
      svg += '<ellipse cx="120" cy="90" rx="80" ry="55" fill="#059669" opacity="0.6"/>';
      svg += '<text x="120" y="95" fill="#d1fae5" font-size="11" text-anchor="middle">Initial: 50 cm²</text>';
      // Expanded Leaf B
      var rBx = 80 + growB * 1.5;
      var rBy = 55 + growB * 1.5;
      svg += '<ellipse cx="120" cy="220" rx="' + rBx + '" ry="' + rBy + '" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="5"/>';
      svg += '<text x="120" y="225" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Final: ' + (50 + growB).toFixed(1) + ' cm²</text>';
      svg += '<text x="120" y="275" fill="#94a3b8" font-size="11" text-anchor="middle">AGR = 5 cm²/day | RGR = 10%</text>';
      svg += '</g>';
      svg += '</svg>';

      var currGrowth = (t * 1.25).toFixed(1);
      rHtml = cell('Absolute Growth (Leaf A & B)', currGrowth + ' cm²', '#38bdf8') +
              cell('Leaf A RGR', (t * 25).toFixed(0) + ' %', '#ef4444') +
              cell('Leaf B RGR', (t * 2.5).toFixed(1) + ' %', '#10b981') +
              cell('Relative Efficiency', 'Leaf A has 10x higher RGR', '#fbbf24');

      vHtml = '<strong>Absolute vs Relative Growth Rate:</strong> Absolute growth rate (AGR) is the total growth per unit time (both leaves grow by 5 cm²). Relative growth rate (RGR), however, is normalized to the initial size (growth / initial area). Leaf A starts at 5 cm² and doubles in size (RGR = 5/5 = 100%), whereas Leaf B starts at 50 cm² and increases by only a fraction (RGR = 5/50 = 10%). Leaf A exhibits a 10-fold superior relative growth efficiency!';
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
// 2. SIMULATION 2: Plasticity & Heterophylly (plasticityheterophyllysim)
// -------------------------------------------------------------------------
window.SIMS.plasticityheterophyllysim = (function(){
  var mode = "environmental"; // "environmental", "developmental", "differentiation"

  function mount(){
    App.state.maxT = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Submerged / Aquatic Morphology</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Emergent / Aerial Terrestrial Leaf</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Juvenile vs Adult Ontogeny</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Dedifferentiation & Redifferentiation</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.plasticityheterophyllysim.setMode(\'environmental\')">1. Environmental: Buttercup (Ranunculus)</button>' +
      '<button class="preset-btn" onclick="SIMS.plasticityheterophyllysim.setMode(\'developmental\')">2. Developmental: Coriander & Larkspur</button>' +
      '<button class="preset-btn" onclick="SIMS.plasticityheterophyllysim.setMode(\'differentiation\')">3. Differentiation Sequence</button>';
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

    if (mode === "environmental") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">ENVIRONMENTAL HETEROPHYLLY IN BUTTERCUP (RANUNCULUS FLABELLARIS)</text>';

      // Water surface
      var waterY = 190;
      svg += '<rect x="40" y="' + waterY + '" width="680" height="150" fill="#0284c7" opacity="0.35" rx="4"/>';
      svg += '<line x1="40" y1="' + waterY + '" x2="720" y2="' + waterY + '" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6"/>';
      svg += '<text x="710" y="' + (waterY - 8) + '" fill="#7dd3fc" font-size="12" text-anchor="end">Water Surface (Air-Water Boundary)</text>';

      // Main Stem
      svg += '<line x1="380" y1="340" x2="380" y2="70" stroke="#10b981" stroke-width="6"/>';

      // Submerged leaves (finely dissected / thread-like to resist water currents)
      svg += '<g stroke="#38bdf8" stroke-width="2.5" fill="none">';
      // Left submerged branch
      svg += '<path d="M 380 280 L 300 270 M 300 270 L 260 250 M 300 270 L 250 280 M 300 270 L 270 300 M 260 250 L 230 240 M 260 250 L 240 260"/>';
      svg += '<path d="M 380 230 L 290 220 M 290 220 L 240 205 M 290 220 L 240 230 M 290 220 L 250 245"/>';
      // Right submerged branch
      svg += '<path d="M 380 280 L 460 270 M 460 270 L 500 250 M 460 270 L 510 280 M 460 270 L 490 300 M 500 250 L 530 240 M 500 250 L 520 260"/>';
      svg += '<path d="M 380 230 L 470 220 M 470 220 L 520 205 M 470 220 L 520 230 M 470 220 L 510 245"/>';
      svg += '</g>';
      svg += '<text x="210" y="325" fill="#38bdf8" font-size="12" font-weight="bold">Submerged Leaves: Finely dissected, ribbon/capillary-like</text>';
      svg += '<text x="210" y="342" fill="#94a3b8" font-size="10">Prevents mechanical damage from currents, maximizes dissolved gas absorption</text>';

      // Aerial emergent leaves (broad, lobed for photosynthesis and transpiration)
      svg += '<g fill="#10b981" stroke="#047857" stroke-width="2">';
      // Left aerial leaf
      svg += '<path d="M 380 140 C 330 130, 270 100, 260 120 C 250 140, 290 160, 310 150 C 280 180, 320 190, 380 150 Z"/>';
      // Right aerial leaf
      svg += '<path d="M 380 110 C 430 100, 490 70, 500 90 C 510 110, 470 130, 450 120 C 480 150, 440 160, 380 120 Z"/>';
      svg += '</g>';
      svg += '<text x="430" y="80" fill="#10b981" font-size="12" font-weight="bold">Aerial Leaves: Broad, expanded & lobed</text>';
      svg += '<text x="430" y="98" fill="#94a3b8" font-size="10">Optimized for intercepting sunlight & stomatal transpiration</text>';

      svg += '</svg>';

      rHtml = cell('Plasticity Type', 'Environmental Heterophylly', '#38bdf8') +
              cell('Model Plant', 'Buttercup (Ranunculus)', '#10b981') +
              cell('Submerged Leaves', 'Finely dissected capillary', '#38bdf8') +
              cell('Aerial Leaves', 'Broadly lobed planar', '#10b981');

      vHtml = '<strong>Environmental Plasticity (Ranunculus):</strong> The aquatic buttercup (<em>Ranunculus flabellaris</em>) produces two entirely different leaf types on the identical stem based on environmental cues. Submerged leaves are finely divided into thread-like filaments to minimize resistance to water flow and enhance mineral uptake. Aerial leaves growing above the water line are broad and lobed to capture sunlight and regulate gaseous exchange.';
    }
    else if (mode === "developmental") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">DEVELOPMENTAL HETEROPHYLLY: CORIANDER & LARKSPUR</text>';

      // Coriander Juvenile (left)
      svg += '<g transform="translate(100, 60)">';
      svg += '<rect x="0" y="0" width="240" height="270" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="120" y="28" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">JUVENILE LEAF (Seedling)</text>';
      // Juvenile broad ovate lobed leaf
      svg += '<path d="M 120 220 L 120 160 C 90 140, 70 110, 80 80 C 100 60, 140 60, 160 80 C 170 110, 150 140, 120 160 Z" fill="#10b981" opacity="0.85"/>';
      svg += '<text x="120" y="245" fill="#f8fafc" font-size="11" text-anchor="middle">Broad, ovate, mildly lobed blade</text>';
      svg += '</g>';

      // Coriander Mature (right)
      svg += '<g transform="translate(420, 60)">';
      svg += '<rect x="0" y="0" width="240" height="270" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="120" y="28" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">MATURE LEAF (Flowering Shoot)</text>';
      // Mature linear dissected foliage
      svg += '<g stroke="#38bdf8" stroke-width="3" fill="none">';
      svg += '<path d="M 120 220 L 120 140 M 120 170 L 70 130 M 120 170 L 170 130 M 70 130 L 50 90 M 70 130 L 85 90 M 170 130 L 155 90 M 170 130 L 190 90 M 120 140 L 120 80 M 120 100 L 105 70 M 120 100 L 135 70"/>';
      svg += '</g>';
      svg += '<text x="120" y="245" fill="#f8fafc" font-size="11" text-anchor="middle">Highly segmented, linear leaflets</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Plasticity Type', 'Developmental Heterophylly', '#fbbf24') +
              cell('Examples', 'Coriander, Larkspur, Cotton', '#10b981') +
              cell('Juvenile Foliage', 'Broad & ovate', '#fbbf24') +
              cell('Mature Foliage', 'Finely segmented linear', '#38bdf8');

      vHtml = '<strong>Developmental Heterophylly:</strong> In plants like coriander, larkspur, and cotton, leaf shape changes systematically across different phases of the plant life cycle. Juvenile seedling leaves have a broad, ovate blade, whereas leaves on the mature reproductive stem are finely divided and pinnatisect. This reflects developmental plasticity controlled by internal ontogenetic timing.';
    }
    else if (mode === "differentiation") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">CELLULAR FATE SEQUENCE: DIFFERENTIATION -> DEDIFFERENTIATION -> REDIFFERENTIATION</text>';

      // Step 1: Meristem -> Primary Permanent (Differentiation)
      svg += '<rect x="50" y="90" width="180" height="90" fill="#ef4444" opacity="0.85" rx="6"/>';
      svg += '<text x="140" y="125" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Primary Meristem</text>';
      svg += '<text x="140" y="145" fill="#fecaca" font-size="10" text-anchor="middle">(Apical / Procambium)</text>';

      svg += '<path d="M 230 135 L 280 135" stroke="#fbbf24" stroke-width="3" marker-end="url(#arrow)"/>';
      svg += '<text x="255" y="125" fill="#fbbf24" font-size="10" text-anchor="middle">Diff.</text>';

      // Step 2: Differentiated Permanent Cell (Parenchyma)
      svg += '<rect x="290" y="90" width="180" height="90" fill="#10b981" opacity="0.85" rx="6"/>';
      svg += '<text x="380" y="125" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Differentiated Tissue</text>';
      svg += '<text x="380" y="145" fill="#d1fae5" font-size="10" text-anchor="middle">Cortical Parenchyma Cell</text>';

      svg += '<path d="M 470 135 L 520 135" stroke="#38bdf8" stroke-width="3"/>';
      svg += '<text x="495" y="125" fill="#38bdf8" font-size="10" text-anchor="middle">Dediff.</text>';

      // Step 3: Secondary Meristem (Dedifferentiation)
      svg += '<rect x="530" y="90" width="180" height="90" fill="#0284c7" opacity="0.85" rx="6"/>';
      svg += '<text x="620" y="125" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Secondary Meristem</text>';
      svg += '<text x="620" y="145" fill="#bae6fd" font-size="10" text-anchor="middle">Cork Cambium (Phellogen)</text>';

      // Step 4: Redifferentiated Tissue (Downwards arrow)
      svg += '<path d="M 620 180 L 620 230" stroke="#f43f5e" stroke-width="3"/>';
      svg += '<text x="645" y="210" fill="#f43f5e" font-size="10">Rediff.</text>';

      svg += '<rect x="530" y="240" width="180" height="90" fill="#8b5cf6" opacity="0.85" rx="6"/>';
      svg += '<text x="620" y="275" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Redifferentiated Tissue</text>';
      svg += '<text x="620" y="295" fill="#ede9fe" font-size="10" text-anchor="middle">Cork (Phellem) & Phelloderm</text>';

      // Tracheary Element box (left lower)
      svg += '<rect x="50" y="240" width="420" height="90" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="65" y="265" fill="#38bdf8" font-size="12" font-weight="bold">Tracheary Element Structural Specialization:</text>';
      svg += '<text x="65" y="288" fill="#f8fafc" font-size="11">1. Loss of living protoplasm at maturity (creates a hollow lumen)</text>';
      svg += '<text x="65" y="308" fill="#94a3b8" font-size="11">2. Strong, elastic lignocellulosic secondary cell wall thickening</text>';

      svg += '</svg>';

      rHtml = cell('Step 1', 'Differentiation (Primary)', '#10b981') +
              cell('Step 2', 'Dedifferentiation (Meristematic)', '#38bdf8') +
              cell('Step 3', 'Redifferentiation (Cork/Cortex)', '#8b5cf6') +
              cell('Open Fate', 'Positional & hormonal plasticity', '#fbbf24');

      vHtml = '<strong>Dedifferentiation & Redifferentiation:</strong> Unlike animal cells, mature plant cells retain totipotency and plasticity. Fully differentiated parenchyma cells can <em>dedifferentiate</em> to reform meristematic tissues (such as interfascicular cambium or cork cambium). The dividing products of these secondary meristems then <em>redifferentiate</em> into permanent secondary tissues like cork (phellem) and secondary cortex (phelloderm).';
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
// 3. SIMULATION 3: Auxin Phototropism & Apical Dominance (auxinphototropismsim)
// -------------------------------------------------------------------------
window.SIMS.auxinphototropismsim = (function(){
  var exp = "intact"; // "intact", "decapitated", "opaque", "agar", "apical"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Unilateral Sunlight</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Auxin (IAA) Molecules</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Coleoptile Stem Curvature</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Apical Dominance & Axillary Buds</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.auxinphototropismsim.setExp(\'intact\')">1. Intact Coleoptile (Darwin)</button>' +
      '<button class="preset-btn" onclick="SIMS.auxinphototropismsim.setExp(\'decapitated\')">2. Decapitated Tip Removed</button>' +
      '<button class="preset-btn" onclick="SIMS.auxinphototropismsim.setExp(\'opaque\')">3. Opaque Foil Cap on Tip</button>' +
      '<button class="preset-btn" onclick="SIMS.auxinphototropismsim.setExp(\'agar\')">4. Went Agar Block Curvature</button>' +
      '<button class="preset-btn" onclick="SIMS.auxinphototropismsim.setExp(\'apical\')">5. Apical Dominance & Pruning</button>';
  }

  function setExp(e){
    exp = e;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (exp === "intact") {
      var bend = t * 14;
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">DARWIN CLASSIC EXPERIMENT: INTACT OAT COLEOPTILE BENDING</text>';

      // Unilateral Light on Right
      svg += '<circle cx="700" cy="120" r="30" fill="#fbbf24" opacity="0.9"/>';
      for (var a = 0; a < 8; a++) {
        var ang = a * Math.PI / 4;
        svg += '<line x1="' + (700 + Math.cos(ang)*35) + '" y1="' + (120 + Math.sin(ang)*35) + '" x2="' + (700 + Math.cos(ang)*50) + '" y2="' + (120 + Math.sin(ang)*50) + '" stroke="#fbbf24" stroke-width="2"/>';
      }
      svg += '<text x="700" y="180" fill="#fde047" font-size="12" text-anchor="middle">Unilateral Light</text>';

      // Curving Coleoptile
      // Base: (340, 340) to (380, 340)
      // Tip curves towards (480 + bend, 160)
      var tipX = 360 + bend * 2.5;
      var tipY = 160;
      svg += '<path d="M 340 340 C 340 260, ' + (340 + bend) + ' 200, ' + tipX + ' ' + tipY + ' C ' + (tipX + 15) + ' ' + (tipY - 20) + ', ' + (tipX + 25) + ' ' + (tipY - 20) + ', ' + (tipX + 40) + ' ' + tipY + ' C ' + (380 + bend) + ' 200, 380 260, 380 340 Z" fill="#10b981" opacity="0.85"/>';

      // Auxin dots concentrated on the shaded (left) flank
      svg += '<g fill="#38bdf8">';
      for (var d = 0; d < 12; d++) {
        var dy = 200 + d * 10;
        var dx = 330 + bend * 0.4 + (d % 3) * 6;
        svg += '<circle cx="' + dx + '" cy="' + dy + '" r="3"/>';
      }
      svg += '</g>';
      svg += '<text x="280" y="250" fill="#38bdf8" font-size="11" text-anchor="end">Shaded side: High Auxin -> Cell Elongation</text>';

      svg += '</svg>';

      rHtml = cell('Condition', 'Intact Coleoptile', '#10b981') +
              cell('Light Source', 'Unilateral Right', '#fbbf24') +
              cell('Auxin Flank', 'Migrates to Shaded Flank (Left)', '#38bdf8') +
              cell('Curvature', bend + '° towards light', '#10b981');

      vHtml = '<strong>Positive Phototropism:</strong> Charles and Francis Darwin discovered that coleoptile tips perceive unilateral light. Auxin diffuses laterally to the shaded (dark) side, where it stimulates proton pumping (acid growth) and cellular elongation. Because cells on the shaded flank grow longer than those on the illuminated side, the coleoptile bends directly toward the light source.';
    }
    else if (exp === "decapitated") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">DARWIN EXPERIMENT: DECAPITATED COLEOPTILE (TIP REMOVED)</text>';

      // Unilateral Light on Right
      svg += '<circle cx="700" cy="120" r="30" fill="#fbbf24" opacity="0.9"/>';
      svg += '<text x="700" y="180" fill="#fde047" font-size="12" text-anchor="middle">Unilateral Light</text>';

      // Decapitated Stump (remains straight)
      svg += '<rect x="340" y="210" width="40" height="130" fill="#10b981" opacity="0.85"/>';
      svg += '<line x1="330" y1="210" x2="390" y2="210" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4"/>';
      svg += '<text x="360" y="195" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">Excised Tip (Removed)</text>';

      svg += '<text x="360" y="270" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">No Bending / Zero Growth</text>';
      svg += '</svg>';

      rHtml = cell('Condition', 'Decapitated Stump', '#ef4444') +
              cell('Auxin Source', 'Absent (Excised)', '#ef4444') +
              cell('Perception Site', 'Tip Removed', '#94a3b8') +
              cell('Response', 'Zero Curvature', '#f8fafc');

      vHtml = '<strong>Decapitation Abrogates Response:</strong> When the apical tip of the coleoptile is amputated, neither cell elongation nor phototropic curvature occurs. This proved unequivocally that the transmissible growth signal (auxin) is produced exclusively in the apical tip.';
    }
    else if (exp === "opaque") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">DARWIN EXPERIMENT: OPAQUE FOIL CAP ON COLEOPTILE TIP</text>';

      // Unilateral Light on Right
      svg += '<circle cx="700" cy="120" r="30" fill="#fbbf24" opacity="0.9"/>';
      svg += '<text x="700" y="180" fill="#fde047" font-size="12" text-anchor="middle">Unilateral Light</text>';

      // Straight Coleoptile
      svg += '<rect x="340" y="170" width="40" height="170" fill="#10b981" opacity="0.85"/>';
      // Opaque metal cap
      svg += '<path d="M 335 170 L 335 140 C 335 130, 385 130, 385 140 L 385 170 Z" fill="#64748b" stroke="#cbd5e1" stroke-width="2"/>';
      svg += '<text x="360" y="125" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Opaque Tin Foil Cap</text>';
      svg += '<text x="360" y="250" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Straight Vertical Growth</text>';
      svg += '<text x="360" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">(Tip blinded to unilateral light)</text>';

      svg += '</svg>';

      rHtml = cell('Condition', 'Opaque Cap on Tip', '#64748b') +
              cell('Photoreception', 'Shielded / Blocked', '#ef4444') +
              cell('Auxin Distribution', 'Symmetric (Vertical)', '#38bdf8') +
              cell('Curvature', 'None (0° Bending)', '#f8fafc');

      vHtml = '<strong>Light Perception Localized to Tip:</strong> Covering the tip with an impermeable opaque tin foil cap prevents unilateral photoreception. Even though the lower elongating stem is directly exposed to side light, the plant grows straight up without bending, proving that the tip is the sole sensory organ detecting light direction.';
    }
    else if (exp === "agar") {
      var bendWent = t * 12;
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">F.W. WENT EXPERIMENT: ASYMMETRIC AGAR BLOCK CURVATURE (IN TOTAL DARKNESS)</text>';

      // Total darkness banner
      svg += '<rect x="580" y="20" width="160" height="30" fill="#334155" rx="4"/>';
      svg += '<text x="660" y="40" fill="#94a3b8" font-size="11" text-anchor="middle">Condition: Total Darkness</text>';

      // Curving Stump to the LEFT because block is on the RIGHT
      var curX = 360 - bendWent * 2;
      svg += '<path d="M 340 340 C 340 260, ' + (340 - bendWent) + ' 200, ' + curX + ' 190 L ' + (curX + 40) + ' 190 C ' + (380 - bendWent) + ' 200, 380 260, 380 340 Z" fill="#10b981" opacity="0.85"/>';

      // Agar block on the right half
      svg += '<rect x="' + (curX + 20) + '" y="170" width="20" height="20" fill="#38bdf8" stroke="#bae6fd" stroke-width="2"/>';
      svg += '<text x="' + (curX + 30) + '" y="160" fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle">Agar Block</text>';
      svg += '<text x="' + (curX + 30) + '" y="150" fill="#38bdf8" font-size="10" text-anchor="middle">(Auxin diffuses into right flank)</text>';

      svg += '<text x="200" y="260" fill="#f8fafc" font-size="12" font-weight="bold">Curvature away from agar block: ' + bendWent + '°</text>';
      svg += '</svg>';

      rHtml = cell('Scientist', 'Frits Warmolt Went (1928)', '#38bdf8') +
              cell('Agar Placement', 'Right Flank of Stump', '#38bdf8') +
              cell('Environment', '100% Total Darkness', '#94a3b8') +
              cell('Curvature', bendWent + '° to Left (Negative curvature)', '#10b981');

      vHtml = '<strong>F.W. Went Avena Curvature Test:</strong> Went demonstrated that auxin is a diffusible chemical. Placing an auxin-loaded agar block unilaterally on the right side of a decapitated coleoptile stump in total darkness caused auxin to diffuse into that side only, accelerating right-side elongation and bending the shoot to the left. The angle of curvature is directly proportional to auxin concentration.';
    }
    else if (exp === "apical") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">APICAL DOMINANCE & PRUNING: TEA PLANTATION & HEDGE ARCHITECTURE</text>';

      // Left: Intact Shoot (Apical bud inhibits lateral buds)
      svg += '<g transform="translate(100, 60)">';
      svg += '<text x="80" y="20" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">INTACT SHOOT APEX</text>';
      svg += '<line x1="80" y1="260" x2="80" y2="50" stroke="#10b981" stroke-width="6"/>';
      // Terminal bud producing auxin
      svg += '<ellipse cx="80" cy="45" rx="14" ry="18" fill="#ef4444"/>';
      svg += '<text x="80" y="49" fill="#fff" font-size="10" text-anchor="middle">Auxin</text>';
      // Suppressed dormant axillary buds
      svg += '<circle cx="68" cy="120" r="5" fill="#64748b"/>';
      svg += '<circle cx="92" cy="160" r="5" fill="#64748b"/>';
      svg += '<circle cx="68" cy="200" r="5" fill="#64748b"/>';
      svg += '<text x="80" y="285" fill="#fca5a5" font-size="11" text-anchor="middle">Apical Dominance active (Dormant buds)</text>';
      svg += '</g>';

      // Right: Decapitated Shoot (Pruned tip -> Bushy branching)
      var branchLen = t * 18;
      svg += '<g transform="translate(440, 60)">';
      svg += '<text x="100" y="20" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">DECAPITATED (PRUNED) SHOOT</text>';
      svg += '<line x1="100" y1="260" x2="100" y2="80" stroke="#10b981" stroke-width="6"/>';
      // Cut tip marker
      svg += '<line x1="85" y1="80" x2="115" y2="80" stroke="#ef4444" stroke-width="3" stroke-dasharray="3"/>';
      svg += '<text x="100" y="70" fill="#ef4444" font-size="10" text-anchor="middle">Tip Pruned / Cut</text>';
      // Sprouting bushy lateral branches
      svg += '<path d="M 100 130 L ' + (100 - branchLen) + ' ' + (110 - branchLen*0.3) + '" stroke="#10b981" stroke-width="4"/>';
      svg += '<path d="M 100 170 L ' + (100 + branchLen) + ' ' + (150 - branchLen*0.3) + '" stroke="#10b981" stroke-width="4"/>';
      svg += '<path d="M 100 210 L ' + (100 - branchLen*0.8) + ' ' + (190 - branchLen*0.3) + '" stroke="#10b981" stroke-width="4"/>';
      svg += '<text x="100" y="285" fill="#6ee7b7" font-size="11" text-anchor="middle">Bushy growth & dense foliage</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Physiology', 'Apical Dominance', '#ef4444') +
              cell('Hormone', 'Auxin suppresses lateral buds', '#38bdf8') +
              cell('Agronomy Action', 'Decapitation / Hedge Pruning', '#10b981') +
              cell('Application', 'Tea picking & landscaping', '#fbbf24');

      vHtml = '<strong>Apical Dominance & Practical Pruning:</strong> Auxin synthesized in the terminal apical bud suppresses the outgrowth of axillary buds situated below it. When the apical shoot is excised (decapitation), auxin levels plummet, releasing axillary buds from inhibition so they sprout into dense lateral branches. This principle is exploited globally in tea plucking and ornamental hedge sculpting.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setExp: setExp
  };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Gibberellin Bolting Lab (gibberellinboltinglab)
// -------------------------------------------------------------------------
window.SIMS.gibberellinboltinglab = (function(){
  var crop = "rosette"; // "rosette", "sugarcane", "grapes", "dwarf"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Vegetative Rosette (No GA)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>GA3 Application & Bolting</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sugarcane Internode Elongation</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Biomass Multiplier</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.gibberellinboltinglab.setCrop(\'rosette\')">1. Rosette Bolting (Cabbage/Beet)</button>' +
      '<button class="preset-btn" onclick="SIMS.gibberellinboltinglab.setCrop(\'sugarcane\')">2. Sugarcane (+20 Tonnes/Acre)</button>' +
      '<button class="preset-btn" onclick="SIMS.gibberellinboltinglab.setCrop(\'grapes\')">3. Grape Stalk & Brewing Malting</button>' +
      '<button class="preset-btn" onclick="SIMS.gibberellinboltinglab.setCrop(\'dwarf\')">4. Reversal of Genetic Dwarfism</button>';
  }

  function setCrop(c){
    crop = c;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (crop === "rosette") {
      var stalkHeight = t * 45;
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">GIBBERELLIC ACID (GA3) INDUCED BOLTING IN ROSETTE PLANTS (CABBAGE/BEET)</text>';

      // Soil line
      svg += '<line x1="80" y1="330" x2="680" y2="330" stroke="#78350f" stroke-width="4"/>';
      svg += '<text x="680" y="350" fill="#92400e" font-size="11" text-anchor="end">Soil Surface</text>';

      // Left: Control Rosette (t=0, compact internodes)
      svg += '<g transform="translate(180, 240)">';
      svg += '<text x="0" y="-120" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Control (Untreated Rosette)</text>';
      // Compact leaves resting near ground
      for (var i = 0; i < 6; i++) {
        var ang = i * Math.PI / 3;
        svg += '<ellipse cx="' + (Math.cos(ang)*30) + '" cy="' + (60 + Math.sin(ang)*15) + '" rx="35" ry="18" fill="#10b981" opacity="0.8"/>';
      }
      svg += '<circle cx="0" cy="60" r="12" fill="#047857"/>';
      svg += '<text x="0" y="110" fill="#6ee7b7" font-size="11" text-anchor="middle">Compressed Internodes (~0 cm)</text>';
      svg += '</g>';

      // Right: Treated with GA3 (rapid bolting & flowering axis)
      svg += '<g transform="translate(520, 330)">';
      svg += '<text x="0" y="-210" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Treated with GA3 (Bolting Active)</text>';
      // Elongated stem
      svg += '<line x1="0" y1="0" x2="0" y2="' + (-stalkHeight) + '" stroke="#10b981" stroke-width="7"/>';
      // Leaves at base
      for (var j = 0; j < 6; j++) {
        var ang2 = j * Math.PI / 3;
        svg += '<ellipse cx="' + (Math.cos(ang2)*28) + '" cy="' + (-15 + Math.sin(ang2)*10) + '" rx="30" ry="14" fill="#059669" opacity="0.8"/>';
      }
      // Top flower head if stalk is high
      if (t >= 2) {
        svg += '<circle cx="0" cy="' + (-stalkHeight - 12) + '" r="15" fill="#facc15"/>';
        for (var fl = 0; fl < 5; fl++) {
          var fa = fl * 2 * Math.PI / 5;
          svg += '<circle cx="' + (Math.cos(fa)*20) + '" cy="' + (-stalkHeight - 12 + Math.sin(fa)*20) + '" r="8" fill="#fde047"/>';
        }
        svg += '<text x="0" y="' + (-stalkHeight - 35) + '" fill="#fef08a" font-size="11" font-weight="bold" text-anchor="middle">Flower Primordia</text>';
      }
      svg += '<text x="0" y="20" fill="#fbbf24" font-size="11" text-anchor="middle">Stem Height: ' + (stalkHeight * 0.4).toFixed(0) + ' cm</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('PGR Applied', 'Gibberellic Acid (GA3)', '#fbbf24') +
              cell('Physiological Event', 'Bolting (Internodal Elongation)', '#10b981') +
              cell('Rosette Internode Length', (stalkHeight * 0.4).toFixed(0) + ' cm', '#38bdf8') +
              cell('Chilling Requirement', 'Replaced / Overcome by GA3', '#ef4444');

      vHtml = '<strong>Bolting in Rosette Plants:</strong> Rosette plants like cabbage and sugar beet normally keep their internodes tightly compressed near the ground during vegetative growth. Application of gibberellins triggers <em>bolting</em>—sudden and massive internode elongation just prior to flowering—without needing the prolonged cold winter exposure (vernalisation) normally required.';
    }
    else if (crop === "sugarcane") {
      var extraTons = t * 5;
      var stemL = 120 + t * 40;
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">SUGARCANE INTERNODE ELONGATION: UP TO +20 TONNES / ACRE GAIN</text>';

      // Left: Untreated Cane
      svg += '<g transform="translate(180, 70)">';
      svg += '<text x="60" y="20" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Standard Untreated Cane</text>';
      svg += '<rect x="40" y="40" width="40" height="200" fill="#15803d" rx="4"/>';
      // Nodes
      for (var n = 0; n < 6; n++) {
        svg += '<line x1="40" y1="' + (40 + n * 33) + '" x2="80" y2="' + (40 + n * 33) + '" stroke="#fef08a" stroke-width="3"/>';
      }
      svg += '<text x="60" y="260" fill="#f8fafc" font-size="11" text-anchor="middle">Biomass: 50 Tonnes/Acre</text>';
      svg += '</g>';

      // Right: GA-Sprayed Cane
      svg += '<g transform="translate(460, 70)">';
      svg += '<text x="60" y="20" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">GA3-Sprayed Cane (+20 Tonnes)</text>';
      var treatedY = 240 - stemL;
      svg += '<rect x="40" y="' + treatedY + '" width="40" height="' + stemL + '" fill="#22c55e" rx="4"/>';
      // Nodes further apart
      var segCount = 6;
      var segLen = stemL / segCount;
      for (var n2 = 0; n2 < segCount; n2++) {
        svg += '<line x1="40" y1="' + (treatedY + n2 * segLen) + '" x2="80" y2="' + (treatedY + n2 * segLen) + '" stroke="#fef08a" stroke-width="3"/>';
      }
      svg += '<text x="60" y="260" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">Biomass: ' + (50 + extraTons) + ' Tonnes/Acre</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Crop Target', 'Sugarcane (Saccharum)', '#10b981') +
              cell('Internode Length', (stemL / 6).toFixed(1) + ' cm', '#38bdf8') +
              cell('Acre Yield Gain', '+' + extraTons + ' Tonnes / Acre', '#fbbf24') +
              cell('Max NCERT Potential', '20 Tonnes / Acre Increase', '#ef4444');

      vHtml = '<strong>Sugarcane Agronomic Yield Multiplier:</strong> Sugarcane stores carbohydrates as sucrose inside its stem internodes. Exogenous spraying of gibberellins elongates each individual internode by up to 50%, generating massive additional storage volume and increasing total cane biomass yield by as much as <strong>20 tonnes per acre</strong>.';
    }
    else if (crop === "grapes") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">VITICULTURE & BREWING: GRAPE STALK LENGTH & MALTING ENZYMES</text>';

      // Grape Bunch (Left: compact without GA, Right: loose large with GA)
      svg += '<g transform="translate(160, 80)">';
      svg += '<text x="80" y="20" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Untreated Grape Cluster</text>';
      svg += '<line x1="80" y1="30" x2="80" y2="70" stroke="#78350f" stroke-width="3"/>';
      for (var g1 = 0; g1 < 15; g1++) {
        var gx = 60 + (g1 % 4) * 12;
        var gy = 70 + Math.floor(g1 / 4) * 16;
        svg += '<circle cx="' + gx + '" cy="' + gy + '" r="8" fill="#7c3aed"/>';
      }
      svg += '<text x="80" y="160" fill="#cbd5e1" font-size="10" text-anchor="middle">Tightly packed, small berries</text>';
      svg += '</g>';

      svg += '<g transform="translate(440, 80)">';
      svg += '<text x="100" y="20" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">GA3-Treated Cluster (Elongated Stalk)</text>';
      svg += '<line x1="100" y1="30" x2="100" y2="100" stroke="#78350f" stroke-width="3"/>';
      for (var g2 = 0; g2 < 15; g2++) {
        var gx2 = 60 + (g2 % 4) * 22;
        var gy2 = 90 + Math.floor(g2 / 4) * 24;
        svg += '<circle cx="' + gx2 + '" cy="' + gy2 + '" r="12" fill="#a855f7"/>';
      }
      svg += '<text x="100" y="200" fill="#e9d5ff" font-size="10" text-anchor="middle">Loose bunch, well-aerated, large berries</text>';
      svg += '</g>';

      // Malting process box
      svg += '<g transform="translate(80, 240)">';
      svg += '<rect x="0" y="0" width="600" height="90" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="15" y="28" fill="#38bdf8" font-size="12" font-weight="bold">Brewing Industry Application: Malting Acceleration</text>';
      svg += '<text x="15" y="52" fill="#f8fafc" font-size="11">GA triggers aleurone layer in barley grains to synthesize hydrolytic enzymes (alpha-amylase).</text>';
      svg += '<text x="15" y="72" fill="#94a3b8" font-size="11">Breaks down endosperm starch into maltose sugars, drastically shortening the malting cycle.</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Grape Application', 'Lengthens bunch axis / stalk', '#a855f7') +
              cell('Fruit Quality', 'Larger berries & prevents fungal rot', '#10b981') +
              cell('Brewing Role', 'Induces alpha-amylase synthesis', '#38bdf8') +
              cell('Industry Impact', 'Speeds up commercial malting', '#fbbf24');

      vHtml = '<strong>Grapes & Industrial Malting:</strong> Spraying gibberellins on grapevines elongates the stalk of grape bunches, preventing dense berry crowding and fungal infections while allowing individual berries to grow larger. In the brewing industry, GA3 application to germinating barley accelerates $\alpha$-amylase production in the aleurone layer, speeding up the malting process.';
    }
    else if (crop === "dwarf") {
      var heightD = 80 + t * 45;
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">REVERSAL OF GENETIC DWARFISM: MENDELIAN DWARF PEA + GA3</text>';

      // Left: Untreated Dwarf Pea (le/le mutant)
      svg += '<g transform="translate(180, 90)">';
      svg += '<text x="60" y="20" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Genetic Dwarf Pea (le le)</text>';
      svg += '<rect x="50" y="160" width="20" height="70" fill="#15803d" rx="3"/>';
      svg += '<text x="60" y="255" fill="#fca5a5" font-size="11" text-anchor="middle">Deficient in GA 20-oxidase</text>';
      svg += '<text x="60" y="275" fill="#94a3b8" font-size="10" text-anchor="middle">Genetically & Phenotypically Dwarf</text>';
      svg += '</g>';

      // Right: Treated Dwarf Pea with GA3
      svg += '<g transform="translate(460, 90)">';
      svg += '<text x="60" y="20" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Dwarf Pea + GA3 (Phenocopy of Tall)</text>';
      var dwarfY = 230 - heightD;
      svg += '<rect x="50" y="' + dwarfY + '" width="20" height="' + heightD + '" fill="#22c55e" rx="3"/>';
      svg += '<text x="60" y="255" fill="#6ee7b7" font-size="11" font-weight="bold" text-anchor="middle">Phenotypically Tall (' + (heightD * 0.5).toFixed(0) + ' cm)</text>';
      svg += '<text x="60" y="275" fill="#fbbf24" font-size="10" text-anchor="middle">Genotype remains le le (Not hereditary)</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Mutant Allele', 'le (Gibberellin deficient)', '#ef4444') +
              cell('Exogenous Rescue', 'GA3 restores internode elongation', '#10b981') +
              cell('Phenotypic Height', (heightD * 0.5).toFixed(0) + ' cm', '#38bdf8') +
              cell('Genetic Identity', 'Remains homozygous dwarf (le le)', '#fbbf24');

      vHtml = '<strong>Overcoming Genetic Dwarfism:</strong> Single-gene dwarf mutants (such as Mendel’s dwarf pea or dwarf maize) are dwarfed because they lack functional enzymes in the gibberellin biosynthetic pathway. Supplying external GA3 completely overcomes the genetic defect, causing internodes to elongate normally into a tall phenotype (phenocopy), though the progeny will still inherit the mutant dwarf allele.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setCrop: setCrop
  };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Cytokinin Organogenesis Lab (cytokinincellculturelab)
// -------------------------------------------------------------------------
window.SIMS.cytokinincellculturelab = (function(){
  var ratio = "callus"; // "callus", "root", "shoot", "senescence"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>High Auxin : Low Cytokinin (Roots)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Low Auxin : High Cytokinin (Shoots)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Balanced Ratio (Callus Division)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Richmond-Lang Anti-Senescence</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.cytokinincellculturelab.setRatio(\'callus\')">1. Balanced: Callus Proliferation (1:1)</button>' +
      '<button class="preset-btn" onclick="SIMS.cytokinincellculturelab.setRatio(\'root\')">2. High Auxin : Low Cytokinin (Rhizogenesis)</button>' +
      '<button class="preset-btn" onclick="SIMS.cytokinincellculturelab.setRatio(\'shoot\')">3. Low Auxin : High Cytokinin (Caulogenesis)</button>' +
      '<button class="preset-btn" onclick="SIMS.cytokinincellculturelab.setRatio(\'senescence\')">4. Richmond-Lang Effect (Delay Senescence)</button>';
  }

  function setRatio(r){
    ratio = r;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (ratio === "callus") {
      var cSize = 40 + t * 14;
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">SKOOG-MILLER MODEL: EQUIMOLAR RATIO -> CALLUS PROLIFERATION</text>';

      // Culture Tube Outline
      svg += '<path d="M 330 60 L 330 290 C 330 330, 430 330, 430 290 L 430 60" fill="none" stroke="#94a3b8" stroke-width="4"/>';
      // Agar Medium
      svg += '<path d="M 332 230 L 332 290 C 332 328, 428 328, 428 290 L 428 230 Z" fill="#38bdf8" opacity="0.3"/>';
      svg += '<text x="380" y="260" fill="#7dd3fc" font-size="11" text-anchor="middle">Agar Nutrient Medium</text>';
      svg += '<text x="380" y="275" fill="#bae6fd" font-size="10" text-anchor="middle">[Auxin] : [Cytokinin] = 1 : 1</text>';

      // Growing amorphous Callus clump
      svg += '<g transform="translate(380, 210)">';
      for (var c = 0; c < 12; c++) {
        var ang = c * 2 * Math.PI / 12;
        var r = (c % 2 === 0) ? cSize : cSize * 0.7;
        svg += '<circle cx="' + (Math.cos(ang)*r*0.6) + '" cy="' + (Math.sin(ang)*r*0.4) + '" r="' + (12 + t*2) + '" fill="#fbbf24" opacity="0.85"/>';
      }
      svg += '<text x="0" y="5" fill="#78350f" font-size="12" font-weight="bold" text-anchor="middle">Callus Mass</text>';
      svg += '</g>';

      svg += '<text x="500" y="140" fill="#f8fafc" font-size="12" font-weight="bold">Unorganized Proliferating Cells</text>';
      svg += '<text x="500" y="160" fill="#94a3b8" font-size="11">Rapid mitosis without differentiation</text>';
      svg += '</svg>';

      rHtml = cell('Auxin : Cytokinin', 'Equimolar (1 : 1)', '#fbbf24') +
              cell('Organogenesis', 'None (Unorganized Callus)', '#f8fafc') +
              cell('Cell Division Rate', 'Maximal (Rapid)', '#10b981') +
              cell('Callus Mass', (2.5 + t*1.2).toFixed(1) + ' g', '#38bdf8');

      vHtml = '<strong>Callus Proliferation (Balanced Ratio):</strong> When tobacco pith explants are cultured on nutrient agar containing roughly equal concentrations of auxin and cytokinin, cells divide actively by mitosis without undergoing differentiation. This forms an amorphous, unorganized cellular mass termed <em>callus</em>.';
    }
    else if (ratio === "root") {
      var rootGrowth = t * 25;
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HIGH AUXIN : LOW CYTOKININ -> RHIZOGENESIS (ADVENTITIOUS ROOT INDUCTION)</text>';

      // Culture Tube Outline
      svg += '<path d="M 330 60 L 330 290 C 330 330, 430 330, 430 290 L 430 60" fill="none" stroke="#94a3b8" stroke-width="4"/>';
      svg += '<path d="M 332 200 L 332 290 C 332 328, 428 328, 428 290 L 428 200 Z" fill="#38bdf8" opacity="0.3"/>';

      // Callus in center
      svg += '<circle cx="380" cy="190" r="30" fill="#fbbf24" opacity="0.85"/>';
      svg += '<text x="380" y="194" fill="#78350f" font-size="10" font-weight="bold" text-anchor="middle">Callus</text>';

      // Adventitious Roots growing downwards into medium
      svg += '<g stroke="#f59e0b" stroke-width="3" fill="none">';
      svg += '<path d="M 365 210 Q 355 240 ' + (350 - rootGrowth*0.2) + ' ' + (220 + rootGrowth) + '"/>';
      svg += '<path d="M 380 215 Q 380 245 380 ' + (225 + rootGrowth) + '"/>';
      svg += '<path d="M 395 210 Q 405 240 ' + (410 + rootGrowth*0.2) + ' ' + (220 + rootGrowth) + '"/>';
      svg += '</g>';

      svg += '<text x="500" y="140" fill="#f59e0b" font-size="13" font-weight="bold">Rhizogenesis Triggered</text>';
      svg += '<text x="500" y="160" fill="#94a3b8" font-size="11">Auxin directs root primordia differentiation</text>';
      svg += '<text x="500" y="180" fill="#fca5a5" font-size="11">Shoot formation suppressed</text>';
      svg += '</svg>';

      rHtml = cell('Auxin : Cytokinin', 'High Auxin : Low Cytokinin (10 : 1)', '#f59e0b') +
              cell('Organogenesis', 'Rhizogenesis (Root Induction)', '#10b981') +
              cell('Root Count', '3 Primary Adventitious Roots', '#38bdf8') +
              cell('Shoot Induction', 'Suppressed / Absent', '#ef4444');

      vHtml = '<strong>High Auxin Ratio (Rhizogenesis):</strong> A high auxin-to-cytokinin ratio (e.g. 10:1 or 100:1) triggers the callus to initiate root primordia. Extensive adventitious roots grow downwards into the culture substrate, while shoot bud initiation remains repressed.';
    }
    else if (ratio === "shoot") {
      var shootGrowth = t * 25;
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">LOW AUXIN : HIGH CYTOKININ -> CAULOGENESIS (SHOOT BUD INDUCTION)</text>';

      // Culture Tube Outline
      svg += '<path d="M 330 60 L 330 290 C 330 330, 430 330, 430 290 L 430 60" fill="none" stroke="#94a3b8" stroke-width="4"/>';
      svg += '<path d="M 332 220 L 332 290 C 332 328, 428 328, 428 290 L 428 220 Z" fill="#38bdf8" opacity="0.3"/>';

      // Callus in center
      svg += '<circle cx="380" cy="220" r="30" fill="#fbbf24" opacity="0.85"/>';

      // Shoots and green leaves growing upwards
      svg += '<g stroke="#10b981" stroke-width="4" fill="none">';
      svg += '<path d="M 370 200 L 350 ' + (180 - shootGrowth) + '"/>';
      svg += '<path d="M 380 195 L 380 ' + (170 - shootGrowth) + '"/>';
      svg += '<path d="M 390 200 L 410 ' + (180 - shootGrowth) + '"/>';
      svg += '</g>';
      // Green Leaflets at tip
      if (t >= 1) {
        svg += '<ellipse cx="345" cy="' + (175 - shootGrowth) + '" rx="10" ry="6" fill="#22c55e"/>';
        svg += '<ellipse cx="380" cy="' + (165 - shootGrowth) + '" rx="8" ry="12" fill="#22c55e"/>';
        svg += '<ellipse cx="415" cy="' + (175 - shootGrowth) + '" rx="10" ry="6" fill="#22c55e"/>';
      }

      svg += '<text x="500" y="140" fill="#10b981" font-size="13" font-weight="bold">Caulogenesis Triggered</text>';
      svg += '<text x="500" y="160" fill="#94a3b8" font-size="11">Cytokinin induces apical meristems & leaves</text>';
      svg += '<text x="500" y="180" fill="#6ee7b7" font-size="11">Vigorous green shoot differentiation</text>';
      svg += '</svg>';

      rHtml = cell('Auxin : Cytokinin', 'Low Auxin : High Cytokinin (1 : 10)', '#38bdf8') +
              cell('Organogenesis', 'Caulogenesis (Shoot Induction)', '#10b981') +
              cell('Shoot Height', (shootGrowth * 0.4).toFixed(0) + ' mm', '#fbbf24') +
              cell('Chlorophyll Synthesis', 'Promoted by Cytokinin', '#22c55e');

      vHtml = '<strong>High Cytokinin Ratio (Caulogenesis):</strong> When the culture medium has a high cytokinin-to-auxin ratio (e.g. 1:10), the morphogenetic program switches to shoot formation (caulogenesis). Vegetative shoot apical buds differentiate, synthesize chlorophyll, and sprout into leafy stems.';
    }
    else if (ratio === "senescence") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">RICHMOND-LANG EFFECT: CYTOKININ DELAYS LEAF SENESCENCE</text>';

      // Left: Control detached leaf (no cytokinin -> senesces, yellows)
      var yellowAmt = Math.min(t * 25, 100);
      svg += '<g transform="translate(180, 80)">';
      svg += '<text x="80" y="20" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">Control (Water Only)</text>';
      svg += '<ellipse cx="80" cy="110" rx="55" ry="80" fill="' + (t >= 2 ? '#ca8a04' : '#15803d') + '" opacity="0.9"/>';
      svg += '<text x="80" y="215" fill="#fca5a5" font-size="11" text-anchor="middle">Chlorophyll breakdown: ' + yellowAmt + '%</text>';
      svg += '<text x="80" y="235" fill="#94a3b8" font-size="10" text-anchor="middle">Protein degradation & senescence</text>';
      svg += '</g>';

      // Right: Cytokinin-treated detached leaf (stays bright green)
      svg += '<g transform="translate(460, 80)">';
      svg += '<text x="80" y="20" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Treated with Cytokinin (Kinetin/Zeatin)</text>';
      svg += '<ellipse cx="80" cy="110" rx="55" ry="80" fill="#22c55e" opacity="0.9"/>';
      svg += '<text x="80" y="215" fill="#6ee7b7" font-size="11" font-weight="bold" text-anchor="middle">Chlorophyll Preserved: 95%</text>';
      svg += '<text x="80" y="235" fill="#bae6fd" font-size="10" text-anchor="middle">Nutrient mobilization prevents aging</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Physiology', 'Richmond-Lang Effect', '#10b981') +
              cell('Control Leaf', 'Rapid yellowing & chlorophyll loss', '#ef4444') +
              cell('Cytokinin Leaf', 'Remains green & metabolically active', '#22c55e') +
              cell('Mechanism', 'Active nutrient mobilization into tissue', '#38bdf8');

      vHtml = '<strong>The Richmond-Lang Effect:</strong> Detached leaves normally turn yellow rapidly as chlorophyll and proteins are degraded. Cytokinin application actively mobilizes nutrients into treated tissues and suppresses degradative proteases, keeping the leaf green and delaying senescence. Florists routinely apply cytokinins to extend the shelf-life of cut foliage.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setRatio: setRatio
  };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: ABA Stomatal Regulation & Stress (abastomataclosuresim)
// -------------------------------------------------------------------------
window.SIMS.abastomataclosuresim = (function(){
  var state = "drought"; // "drought", "wellwatered", "dormancy"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Abscisic Acid (ABA Stress Surge)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>K+ and Cl- Anion Efflux</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Turgid Open Guard Cells</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#64748b;"></span><span>Flaccid Closed Stoma</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.abastomataclosuresim.setState(\'drought\')">1. Drought Stress: Rapid Stomatal Closure</button>' +
      '<button class="preset-btn" onclick="SIMS.abastomataclosuresim.setState(\'wellwatered\')">2. Well-Watered: Turgid Open Stoma</button>' +
      '<button class="preset-btn" onclick="SIMS.abastomataclosuresim.setState(\'dormancy\')">3. Seed Dormancy: ABA vs GA Antagonism</button>';
  }

  function setState(s){
    state = s;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (state === "drought") {
      // Stomatal pore closes as t increases
      var poreWidth = Math.max(26 - t * 6.5, 0);
      var abaConc = (0.5 + t * 4.5).toFixed(1);
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">DROUGHT STRESS: ABA SYNTHESIS & GUARD CELL OSMOTIC TURGOR LOSS</text>';

      // Guard Cells
      svg += '<g transform="translate(380, 180)">';
      // Left Guard Cell
      var lx = -poreWidth/2 - 35;
      svg += '<ellipse cx="' + lx + '" cy="0" rx="32" ry="75" fill="#15803d" stroke="#166534" stroke-width="4"/>';
      // Right Guard Cell
      var rx = poreWidth/2 + 35;
      svg += '<ellipse cx="' + rx + '" cy="0" rx="32" ry="75" fill="#15803d" stroke="#166534" stroke-width="4"/>';

      // Stomatal Pore
      if (poreWidth > 2) {
        svg += '<ellipse cx="0" cy="0" rx="' + (poreWidth/2) + '" ry="45" fill="#0284c7" opacity="0.8"/>';
        svg += '<text x="0" y="5" fill="#bae6fd" font-size="11" text-anchor="middle">Pore: ' + poreWidth.toFixed(0) + ' µm</text>';
      } else {
        svg += '<line x1="0" y1="-55" x2="0" y2="55" stroke="#0f172a" stroke-width="3"/>';
        svg += '<text x="0" y="5" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">CLOSED</text>';
      }

      // Ion efflux arrows
      if (t > 0 && t < 4) {
        svg += '<g stroke="#ef4444" stroke-width="2" fill="none">';
        svg += '<path d="M -75 -20 L -120 -40" marker-end="url(#arrow)"/>';
        svg += '<text x="-125" y="-45" fill="#fca5a5" font-size="10">K+ Efflux</text>';
        svg += '<path d="M 75 -20 L 120 -40"/>';
        svg += '<text x="125" y="-45" fill="#fca5a5" font-size="10">Cl- Efflux</text>';
        svg += '</g>';
      }
      svg += '</g>';

      // Readouts panel in SVG
      svg += '<rect x="60" y="60" width="220" height="100" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="75" y="85" fill="#ef4444" font-size="12" font-weight="bold">ABA Stress Signal Cascade:</text>';
      svg += '<text x="75" y="108" fill="#f8fafc" font-size="11">1. Roots detect dry soil (low water potential)</text>';
      svg += '<text x="75" y="128" fill="#94a3b8" font-size="11">2. ABA synthesized and carried via transpiration</text>';
      svg += '<text x="75" y="148" fill="#38bdf8" font-size="11">3. Guard cell ion channels open -> Flaccidity</text>';
      svg += '</svg>';

      rHtml = cell('Soil Status', 'Severe Drought Deficit', '#ef4444') +
              cell('ABA Concentration', abaConc + ' µM', '#f59e0b') +
              cell('Stomatal Aperture', poreWidth.toFixed(1) + ' µm', (poreWidth > 0 ? '#10b981' : '#ef4444')) +
              cell('Transpiration Rate', (poreWidth * 3.8).toFixed(1) + ' mmol/m²s', '#38bdf8');

      vHtml = '<strong>ABA Mode of Action (Stress Response):</strong> Under soil drying, plants rapidly elevate ABA production. ABA binds guard cell receptors, initiating calcium influx that stimulates depolarization-activated $\text{K}^+$ and anion ($\text{Cl}^-$, malate) efflux channels. Water leaves the guard cells by osmosis, their turgor collapses, and the stomatal aperture seals shut—stopping transpiration and saving the plant from dehydration.';
    }
    else if (state === "wellwatered") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">WELL-WATERED CONDITION: LOW ABA, FULL TURGOR, MAXIMUM APERTURE</text>';

      // Guard Cells Full Turgor
      svg += '<g transform="translate(380, 180)">';
      svg += '<ellipse cx="-50" cy="0" rx="38" ry="85" fill="#16a34a" stroke="#15803d" stroke-width="4"/>';
      svg += '<ellipse cx="50" cy="0" rx="38" ry="85" fill="#16a34a" stroke="#15803d" stroke-width="4"/>';
      // Wide open pore
      svg += '<ellipse cx="0" cy="0" rx="20" ry="55" fill="#38bdf8" opacity="0.8"/>';
      svg += '<text x="0" y="5" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">Open (25 µm)</text>';
      svg += '</g>';

      svg += '<rect x="60" y="60" width="220" height="90" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="75" y="85" fill="#10b981" font-size="12" font-weight="bold">Turgid Guard Cell Status:</text>';
      svg += '<text x="75" y="108" fill="#f8fafc" font-size="11">Active H+ pumping out</text>';
      svg += '<text x="75" y="128" fill="#38bdf8" font-size="11">K+ accumulates inside vacuole</text>';
      svg += '</svg>';

      rHtml = cell('Hydration Status', 'Well-Watered (Optimal)', '#10b981') +
              cell('ABA Level', 'Basal (< 0.2 µM)', '#94a3b8') +
              cell('Guard Cell Turgor', 'High (+1.2 MPa)', '#10b981') +
              cell('Stomatal Aperture', '25.0 µm (Fully Open)', '#38bdf8');

      vHtml = '<strong>Open Stoma under Ample Hydration:</strong> When soil moisture is abundant, ABA remains at basal levels. Guard cell $\text{H}^+$-ATPases actively pump protons out, driving $\text{K}^+$ influx. Osmotic water influx creates high turgor pressure ($P \approx +1.2\,\text{MPa}$), stretching the elastic thin outer walls and pulling open the thick inner cellulosic walls.';
    }
    else if (state === "dormancy") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">SEED DORMANCY: HORMONAL BALANCE BETWEEN ABA (DORMANCY) AND GA (GERMINATION)</text>';

      // Seed Diagram
      svg += '<g transform="translate(200, 180)">';
      svg += '<ellipse cx="0" cy="0" rx="90" ry="120" fill="#78350f" opacity="0.9"/>';
      svg += '<ellipse cx="0" cy="0" rx="75" ry="105" fill="#fbbf24" opacity="0.85"/>';
      svg += '<ellipse cx="20" cy="30" rx="25" ry="40" fill="#10b981" opacity="0.9"/>';
      svg += '<text x="20" y="35" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Embryo</text>';
      svg += '<text x="0" y="-30" fill="#78350f" font-size="11" font-weight="bold" text-anchor="middle">Starchy Endosperm</text>';
      svg += '</g>';

      // Seesaw comparison
      svg += '<g transform="translate(480, 180)">';
      svg += '<rect x="0" y="0" width="220" height="130" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="110" y="25" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Hormone Antagonism:</text>';
      svg += '<text x="20" y="55" fill="#ef4444" font-size="11" font-weight="bold">ABA (Dormancy Promoter):</text>';
      svg += '<text x="20" y="72" fill="#fca5a5" font-size="10">• Inhibits amylase synthesis</text>';
      svg += '<text x="20" y="87" fill="#fca5a5" font-size="10">• Enforces desiccation tolerance</text>';
      svg += '<text x="20" y="107" fill="#10b981" font-size="11" font-weight="bold">GA (Germination Promoter):</text>';
      svg += '<text x="20" y="122" fill="#6ee7b7" font-size="10">• Induces alpha-amylase</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Hormone 1', 'Abscisic Acid (Enforces Dormancy)', '#ef4444') +
              cell('Hormone 2', 'Gibberellin (Breaks Dormancy)', '#10b981') +
              cell('Biological Role', 'Prevents Vivipary on Mother Plant', '#fbbf24') +
              cell('Target Enzyme', 'Alpha-Amylase in Aleurone', '#38bdf8');

      vHtml = '<strong>ABA vs GA Antagonism in Seeds:</strong> Abscisic acid enforces seed dormancy, preventing precocious germination (vivipary) during seed development on the parent plant and allowing seeds to endure cold winters or dehydration. When favorable conditions return, ABA is catabolized, GA levels surge, and $\alpha$-amylase is synthesized to mobilize nutrients for seedling emergence.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setState: setState
  };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Photoperiodism & Floral Induction (photoperiodismsim)
// -------------------------------------------------------------------------
window.SIMS.photoperiodismsim = (function(){
  var plantType = "sdp"; // "sdp", "ldp", "dnp"
  var nightBreak = false;
  var defoliated = false;

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Light Period (Photoperiod)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#1e293b;"></span><span>Dark Period (Skotoperiod)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Night Break (Red Light Flash)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Florigen Phloem Translocation</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.photoperiodismsim.setPlant(\'sdp\', false, false)">1. Short-Day Plant (SDP: Long Night)</button>' +
      '<button class="preset-btn" onclick="SIMS.photoperiodismsim.setPlant(\'sdp\', true, false)">2. SDP with Night Break Flash</button>' +
      '<button class="preset-btn" onclick="SIMS.photoperiodismsim.setPlant(\'ldp\', false, false)">3. Long-Day Plant (LDP)</button>' +
      '<button class="preset-btn" onclick="SIMS.photoperiodismsim.setPlant(\'sdp\', false, true)">4. Defoliated Plant (Leaves Removed)</button>';
  }

  function setPlant(p, nb, def){
    plantType = p;
    nightBreak = nb;
    defoliated = def;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    // Day length varies from 8h (t=0) to 16h (t=4)
    var dayH = 8 + t * 2;
    var nightH = 24 - dayH;

    // Critical photoperiods:
    // SDP requires night > 10 hours (day < 14 hours) UNINTERRUPTED
    // LDP requires day > 12 hours
    var flowers = false;
    var reason = '';

    if (defoliated) {
      flowers = false;
      reason = 'Leaves missing: Photoperiodic stimulus cannot be perceived, no florigen synthesized';
    } else if (plantType === "sdp") {
      if (nightBreak) {
        flowers = false;
        reason = 'Night break resets phytochrome (Pr/Pfr): uninterrupted dark period requirement broken';
      } else if (nightH > 10) {
        flowers = true;
        reason = 'Dark period (' + nightH + 'h) exceeds critical night threshold (10h) uninterrupted';
      } else {
        flowers = false;
        reason = 'Dark period (' + nightH + 'h) too short (day length ' + dayH + 'h is excessive)';
      }
    } else if (plantType === "ldp") {
      if (dayH >= 12 || nightBreak) {
        flowers = true;
        reason = nightBreak ? 'Night break satisfies long-day requirement by shortening effective night' : 'Day length (' + dayH + 'h) meets or exceeds critical day duration (12h)';
      } else {
        flowers = false;
        reason = 'Day length (' + dayH + 'h) below critical threshold (12h)';
      }
    } else if (plantType === "dnp") {
      flowers = true;
      reason = 'Day-Neutral Plant: Flowers autonomously based on age/nodes, irrespective of photoperiod';
    }

    svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
    svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">PHOTOPERIODIC 24-HOUR CYCLE & FLORAL INDUCTION SIMULATOR</text>';

    // 24-Hour Bar (x: 80 to 680 = 600 px, 25 px per hour)
    var dayWidth = dayH * 25;
    var nightWidth = nightH * 25;

    // Light segment
    svg += '<rect x="80" y="60" width="' + dayWidth + '" height="45" fill="#facc15" opacity="0.9" rx="3"/>';
    svg += '<text x="' + (80 + dayWidth/2) + '" y="88" fill="#713f12" font-size="13" font-weight="bold" text-anchor="middle">Light Period: ' + dayH + ' Hours</text>';

    // Dark segment
    svg += '<rect x="' + (80 + dayWidth) + '" y="60" width="' + nightWidth + '" height="45" fill="#1e293b" rx="3" stroke="#475569"/>';
    svg += '<text x="' + (80 + dayWidth + nightWidth/2) + '" y="88" fill="#94a3b8" font-size="13" font-weight="bold" text-anchor="middle">Dark: ' + nightH + ' Hours</text>';

    // Night break flash in middle of dark period
    if (nightBreak) {
      var nbX = 80 + dayWidth + nightWidth/2;
      svg += '<rect x="' + (nbX - 6) + '" y="55" width="12" height="55" fill="#ef4444" rx="2"/>';
      svg += '<text x="' + nbX + '" y="125" fill="#fca5a5" font-size="11" font-weight="bold" text-anchor="middle">Night Break Flash (Red Light)</text>';
    }

    // Plant Visualizer (Shoot apex with either vegetative foliage or flower)
    svg += '<g transform="translate(380, 260)">';
    svg += '<line x1="0" y1="80" x2="0" y2="-30" stroke="#10b981" stroke-width="6"/>';

    if (!defoliated) {
      // Healthy leaves
      svg += '<ellipse cx="-35" cy="20" rx="30" ry="12" fill="#10b981" transform="rotate(-20 -35 20)"/>';
      svg += '<ellipse cx="35" cy="35" rx="30" ry="12" fill="#10b981" transform="rotate(20 35 35)"/>';
      svg += '<text x="-40" y="60" fill="#6ee7b7" font-size="10">Site of Perception (Leaves)</text>';
    } else {
      svg += '<text x="0" y="60" fill="#ef4444" font-size="10" text-anchor="middle">[Defoliated: No Leaves]</text>';
    }

    // Apex state: Flower or Vegetative Bud
    if (flowers) {
      // Golden / Pink Flower at apex
      svg += '<circle cx="0" cy="-40" r="14" fill="#f59e0b"/>';
      for (var p = 0; p < 6; p++) {
        var pa = p * Math.PI / 3;
        svg += '<circle cx="' + (Math.cos(pa)*20) + '" cy="' + (-40 + Math.sin(pa)*20) + '" r="10" fill="#f43f5e" opacity="0.9"/>';
      }
      svg += '<text x="0" y="-75" fill="#f43f5e" font-size="14" font-weight="bold" text-anchor="middle">FLOWERING INDUCED!</text>';
    } else {
      // Green vegetative apical bud
      svg += '<ellipse cx="0" cy="-35" rx="8" ry="14" fill="#047857"/>';
      svg += '<text x="0" y="-60" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Vegetative Apex (No Flowering)</text>';
    }
    svg += '</g>';

    // Status banner
    svg += '<rect x="80" y="140" width="600" height="40" fill="#1e293b" rx="4" stroke="#334155"/>';
    svg += '<text x="95" y="165" fill="' + (flowers ? '#34d399' : '#f87171') + '" font-size="12" font-weight="bold">Result: ' + (flowers ? 'Flowering Response ON' : 'Flowering Response OFF') + ' — ' + reason + '</text>';

    svg += '</svg>';

    rHtml = cell('Plant Type', plantType.toUpperCase(), '#38bdf8') +
              cell('Photoperiod / Skotoperiod', dayH + 'h Day / ' + nightH + 'h Night', '#fbbf24') +
              cell('Perception Site', defoliated ? 'Missing (Defoliated)' : 'Present (Leaves)', (defoliated ? '#ef4444' : '#10b981')) +
              cell('Flowering Status', (flowers ? 'FLOWERING' : 'VEGETATIVE'), (flowers ? '#10b981' : '#ef4444'));

    vHtml = '<strong>Photoperiodism & Florigen Signaling:</strong> Photoperiodic induction depends critically on uninterrupted darkness. Short-Day Plants (SDPs) are actually <em>long-night plants</em>: if their dark period is interrupted by a brief flash of red light (night break), flowering is abolished because active phytochrome $P_{fr}$ resets the clock. Furthermore, leaves are the exclusive sensory organ perceiving photoperiod and synthesizing mobile florigen; stripping the plant of leaves (defoliation) prevents floral induction completely.';

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setPlant: setPlant
  };
})();
