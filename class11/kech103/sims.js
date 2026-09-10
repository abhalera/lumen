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

// -------------------------------------------------------------------------
// 1. SIMULATION 1: Early Periodic Tables & Mendeleev&#39;s Predictions (mendeleev)
// -------------------------------------------------------------------------
window.SIMS.mendeleev = (function(){
  var selectedGap = "eka-al"; // "eka-al", "eka-si", "triad-cl"

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Mendeleev Prediction (1869)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Experimental Discovery</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Döbereiner Triad Mean</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-eka-al">Eka-Aluminium (Gallium, 1875)</button>' +
      '<button class="preset-btn" id="p-eka-si">Eka-Silicon (Germanium, 1886)</button>' +
      '<button class="preset-btn" id="p-triad">Döbereiner Triad (Li-Na-K)</button>';

    document.getElementById("p-eka-al").onclick = function(){ setActivePreset(this); selectedGap = "eka-al"; draw(0); };
    document.getElementById("p-eka-si").onclick = function(){ setActivePreset(this); selectedGap = "eka-si"; draw(0); };
    document.getElementById("p-triad").onclick = function(){ setActivePreset(this); selectedGap = "triad-cl"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Select Historical Prediction / Triad:</label>' +
        '<select id="gap-select" style="padding:8px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;font-size:14px;">' +
          '<option value="eka-al" selected>Eka-Aluminium → Gallium (Discovered by Lecoq de Boisbaudran)</option>' +
          '<option value="eka-si">Eka-Silicon → Germanium (Discovered by Clemens Winkler)</option>' +
          '<option value="triad-cl">Döbereiner Alkali Triad (Lithium, Sodium, Potassium)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("gap-select").onchange = function(e){
      selectedGap = e.target.value;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var cx = W / 2, cy = H / 2;

    var h = '<rect width="100%" height="100%" fill="#0a121e"/>';

    if(selectedGap === "eka-al"){
      h += '<text x="' + cx + '" y="50" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Mendeleev&#39;s Eka-Aluminium (1869) vs Gallium (1875)</text>';

      // Card 1: Prediction
      h += '<rect x="' + (cx - 300) + '" y="80" width="280" height="220" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>';
      h += '<text x="' + (cx - 160) + '" y="110" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="middle">Predicted: Eka-Aluminium (Ea)</text>';
      h += '<text x="' + (cx - 280) + '" y="145" fill="#cbd5e1" font-size="12">• Atomic Weight: ~68</text>';
      h += '<text x="' + (cx - 280) + '" y="175" fill="#cbd5e1" font-size="12">• Density: 5.9 g/cm³</text>';
      h += '<text x="' + (cx - 280) + '" y="205" fill="#cbd5e1" font-size="12">• Melting Point: Low</text>';
      h += '<text x="' + (cx - 280) + '" y="235" fill="#cbd5e1" font-size="12">• Oxide Formula: Ea₂O₃</text>';
      h += '<text x="' + (cx - 280) + '" y="265" fill="#cbd5e1" font-size="12">• Chloride: EaCl₃</text>';

      // Card 2: Discovery
      h += '<rect x="' + (cx + 20) + '" y="80" width="280" height="220" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
      h += '<text x="' + (cx + 160) + '" y="110" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">Discovered: Gallium (Ga, Z = 31)</text>';
      h += '<text x="' + (cx + 40) + '" y="145" fill="#cbd5e1" font-size="12">• Atomic Weight: 69.7</text>';
      h += '<text x="' + (cx + 40) + '" y="175" fill="#cbd5e1" font-size="12">• Density: 5.94 g/cm³</text>';
      h += '<text x="' + (cx + 40) + '" y="205" fill="#cbd5e1" font-size="12">• Melting Point: 30.0 °C (Melts in hand!)</text>';
      h += '<text x="' + (cx + 40) + '" y="235" fill="#cbd5e1" font-size="12">• Oxide Formula: Ga₂O₃</text>';
      h += '<text x="' + (cx + 40) + '" y="265" fill="#cbd5e1" font-size="12">• Chloride: GaCl₃</text>';

      readout(
        cell("Element", "Eka-Aluminium → Gallium", "#f59e0b") +
        cell("Atomic Mass", "Pred: 68 | Found: 69.7", "#10b981") +
        cell("Density", "Pred: 5.9 | Found: 5.94 g/cm³", "#38bdf8") +
        cell("Melting Point", "302.9 K (30 °C)", "#e2e8f0")
      );
      verdict('<b>Historic Confirmation:</b> Lecoq de Boisbaudran discovered Gallium in 1875. The astonishing agreement with Mendeleev\'s 1869 predictions convinced the world\'s chemical establishment of the predictive reality of the Periodic Law.');
    }
    else if(selectedGap === "eka-si"){
      h += '<text x="' + cx + '" y="50" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Mendeleev&#39;s Eka-Silicon (1869) vs Germanium (1886)</text>';

      h += '<rect x="' + (cx - 300) + '" y="80" width="280" height="220" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>';
      h += '<text x="' + (cx - 160) + '" y="110" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="middle">Predicted: Eka-Silicon (Es)</text>';
      h += '<text x="' + (cx - 280) + '" y="145" fill="#cbd5e1" font-size="12">• Atomic Weight: ~72</text>';
      h += '<text x="' + (cx - 280) + '" y="175" fill="#cbd5e1" font-size="12">• Density: 5.5 g/cm³</text>';
      h += '<text x="' + (cx - 280) + '" y="205" fill="#cbd5e1" font-size="12">• Melting Point: High</text>';
      h += '<text x="' + (cx - 280) + '" y="235" fill="#cbd5e1" font-size="12">• Oxide Formula: EsO₂</text>';
      h += '<text x="' + (cx - 280) + '" y="265" fill="#cbd5e1" font-size="12">• Chloride: EsCl₄ (bp ~100 °C)</text>';

      h += '<rect x="' + (cx + 20) + '" y="80" width="280" height="220" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
      h += '<text x="' + (cx + 160) + '" y="110" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">Discovered: Germanium (Ge, Z = 32)</text>';
      h += '<text x="' + (cx + 40) + '" y="145" fill="#cbd5e1" font-size="12">• Atomic Weight: 72.6</text>';
      h += '<text x="' + (cx + 40) + '" y="175" fill="#cbd5e1" font-size="12">• Density: 5.35 g/cm³</text>';
      h += '<text x="' + (cx + 40) + '" y="205" fill="#cbd5e1" font-size="12">• Melting Point: 947 °C (1210 K)</text>';
      h += '<text x="' + (cx + 40) + '" y="235" fill="#cbd5e1" font-size="12">• Oxide Formula: GeO₂</text>';
      h += '<text x="' + (cx + 40) + '" y="265" fill="#cbd5e1" font-size="12">• Chloride: GeCl₄ (bp 84 °C)</text>';

      readout(
        cell("Element", "Eka-Silicon → Germanium", "#f59e0b") +
        cell("Atomic Mass", "Pred: 72 | Found: 72.6", "#10b981") +
        cell("Density", "Pred: 5.5 | Found: 5.35 g/cm³", "#38bdf8") +
        cell("Chloride bp", "Pred: <100 °C | Found: 84 °C", "#e2e8f0")
      );
      verdict('<b>Clemens Winkler (1886):</b> Isolated Germanium from the mineral argyrodite. Its properties matched Mendeleev\'s predictions so closely that Germanium became the defining triumph of periodic classification.');
    }
    else {
      h += '<text x="' + cx + '" y="50" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Döbereiner&#39;s Triads (1829): Arithmetic Mean Law</text>';

      h += '<g transform="translate(' + (cx - 240) + ', 100)">';
      // Li
      h += '<rect x="0" y="0" width="140" height="100" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
      h += '<text x="70" y="35" fill="#38bdf8" font-size="20" font-weight="bold" text-anchor="middle">Lithium (Li)</text>';
      h += '<text x="70" y="70" fill="#94a3b8" font-size="14" text-anchor="middle">Mass = 7.0</text>';

      // Na
      h += '<rect x="170" y="0" width="140" height="100" rx="8" fill="#0f2942" stroke="#10b981" stroke-width="3"/>';
      h += '<text x="240" y="35" fill="#10b981" font-size="20" font-weight="bold" text-anchor="middle">Sodium (Na)</text>';
      h += '<text x="240" y="65" fill="#facc15" font-size="13" font-weight="bold" text-anchor="middle">Mean = (7+39)/2 = 23</text>';
      h += '<text x="240" y="85" fill="#94a3b8" font-size="12" text-anchor="middle">Actual Mass = 23.0</text>';

      // K
      h += '<rect x="340" y="0" width="140" height="100" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
      h += '<text x="410" y="35" fill="#38bdf8" font-size="20" font-weight="bold" text-anchor="middle">Potassium (K)</text>';
      h += '<text x="410" y="70" fill="#94a3b8" font-size="14" text-anchor="middle">Mass = 39.0</text>';
      h += '</g>';

      readout(
        cell("First Element", "Li (Mass = 7.0)", "#38bdf8") +
        cell("Third Element", "K (Mass = 39.0)", "#38bdf8") +
        cell("Arithmetic Mean", "(7 + 39)/2 = 23.0", "#facc15") +
        cell("Middle Element", "Na (Mass = 23.0)", "#10b981")
      );
      verdict('<b>Döbereiner Triads:</b> The atomic mass of the middle element is approximately the arithmetic mean of the other two. Other triads: Ca (40) - Sr (88) - Ba (137); Cl (35.5) - Br (80) - I (127).');
    }

    svg.innerHTML = h;
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Moseley&#39;s Law & X-Ray Frequency Spectrometer (moseleylab)
// -------------------------------------------------------------------------
window.SIMS.moseleylab = (function(){
  var selectedZ = 29; // Copper (Z = 29)

  var elementData = [
    { Z: 13, sym: "Al", name: "Aluminium", nu: 3.58 },
    { Z: 20, sym: "Ca", name: "Calcium", nu: 8.95 },
    { Z: 26, sym: "Fe", name: "Iron", nu: 15.48 },
    { Z: 29, sym: "Cu", name: "Copper", nu: 19.43 },
    { Z: 30, sym: "Zn", name: "Zinc", nu: 20.85 },
    { Z: 47, sym: "Ag", name: "Silver", nu: 53.60 }
  ];

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cathode Ray Electron Beam</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Target Anode (Z)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Characteristic K_α X-Ray</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cu-m">Copper Target (Z = 29)</button>' +
      '<button class="preset-btn" id="p-fe-m">Iron Target (Z = 26)</button>' +
      '<button class="preset-btn" id="p-al-m">Aluminium Target (Z = 13)</button>';

    document.getElementById("p-cu-m").onclick = function(){ setActivePreset(this); setZ(29); };
    document.getElementById("p-fe-m").onclick = function(){ setActivePreset(this); setZ(26); };
    document.getElementById("p-al-m").onclick = function(){ setActivePreset(this); setZ(13); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Target Anode Element: <b id="mz-label" style="color:#f43f5e;">Copper (Z = 29)</b></label>' +
        '<select id="mz-select" style="padding:8px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;font-size:14px;">' +
          '<option value="13">Aluminium (Z = 13)</option>' +
          '<option value="20">Calcium (Z = 20)</option>' +
          '<option value="26">Iron (Z = 26)</option>' +
          '<option value="29" selected>Copper (Z = 29)</option>' +
          '<option value="30">Zinc (Z = 30)</option>' +
          '<option value="47">Silver (Z = 47)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("mz-select").onchange = function(e){
      setZ(parseInt(e.target.value));
    };

    draw(0);
  }

  function setZ(z){
    selectedZ = z;
    var el = document.getElementById("mz-select"); if(el) el.value = z;
    var match = elementData.find(function(d){ return d.Z === z; });
    var lbl = document.getElementById("mz-label"); if(lbl && match) lbl.textContent = match.name + " (Z = " + z + ")";
    draw(App.state.t);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var cx = W / 2, cy = H / 2;

    var cur = elementData.find(function(d){ return d.Z === selectedZ; }) || elementData[3];
    // Moseley relation: sqrt(nu) = a*(Z - b)
    // a ≈ 4.97e7 Hz^0.5, b ≈ 1.0
    var sqrtNu = (cur.Z - 1.0) * 1.52; // scaled
    var nuFreq = (cur.Z - 1.0) * (cur.Z - 1.0) * 2.47e15; // Hz

    var h = '<rect width="100%" height="100%" fill="#070e1a"/>';

    // LEFT PANEL: X-ray Tube Apparatus
    var tx = W * 0.28;
    h += '<text x="' + tx + '" y="40" fill="#94a3b8" font-size="13" font-weight="bold" text-anchor="middle">Moseley X-Ray Tube</text>';
    // Glass bulb
    h += '<circle cx="' + tx + '" cy="' + cy + '" r="90" fill="#0d1b2a" stroke="#254ad7" stroke-width="2"/>';

    // Filament cathode
    h += '<line x1="' + (tx - 70) + '" y1="' + cy + '" x2="' + (tx - 40) + '" y2="' + cy + '" stroke="#cbd5e1" stroke-width="4"/>';
    h += '<text x="' + (tx - 70) + '" y="' + (cy + 20) + '" fill="#94a3b8" font-size="10">Cathode</text>';

    // Target Anode (beveled metal block)
    h += '<polygon points="' + (tx + 30) + ',' + (cy - 30) + ' ' + (tx + 55) + ',' + (cy - 5) + ' ' + (tx + 30) + ',' + (cy + 20) + '" fill="#f43f5e"/>';
    h += '<text x="' + (tx + 45) + '" y="' + (cy + 40) + '" fill="#f43f5e" font-size="11" font-weight="bold" text-anchor="middle">' + cur.sym + ' (+' + cur.Z + ')</text>';

    // Accelerated electron beam pulses
    var bOffset = (t * 120) % 70;
    h += '<line x1="' + (tx - 40) + '" y1="' + cy + '" x2="' + (tx + 35) + '" y2="' + cy + '" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4"/>';
    h += '<circle cx="' + (tx - 40 + bOffset) + '" cy="' + cy + '" r="4" fill="#38bdf8"/>';

    // Characteristic X-rays emerging downwards
    var xRayOffset = (t * 140) % 90;
    h += '<line x1="' + (tx + 35) + '" y1="' + cy + '" x2="' + (tx + 35) + '" y2="' + (cy + 120) + '" stroke="#10b981" stroke-width="3" stroke-dasharray="6,4"/>';
    h += '<circle cx="' + (tx + 35) + '" cy="' + (cy + xRayOffset) + '" r="5" fill="#10b981" filter="drop-shadow(0 0 8px #10b981)"/>';
    h += '<text x="' + (tx + 45) + '" y="' + (cy + 135) + '" fill="#10b981" font-size="11" font-weight="bold">K_α X-Ray</text>';

    // RIGHT PANEL: Linear Moseley Plot (√ν vs Z)
    var gx = W * 0.58, gy = 60, gw = 280, gh = 260;
    h += '<rect x="' + gx + '" y="' + gy + '" width="' + gw + '" height="' + gh + '" fill="#0f172a" stroke="#334155" rx="8"/>';
    h += '<text x="' + (gx + gw/2) + '" y="' + (gy + 25) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Moseley Plot: √ν = a(Z − b)</text>';

    // Axes
    h += '<line x1="' + (gx + 40) + '" y1="' + (gy + gh - 40) + '" x2="' + (gx + gw - 20) + '" y2="' + (gy + gh - 40) + '" stroke="#64748b" stroke-width="1.5"/>';
    h += '<text x="' + (gx + gw - 15) + '" y="' + (gy + gh - 35) + '" fill="#64748b" font-size="11">Z</text>';

    h += '<line x1="' + (gx + 40) + '" y1="' + (gy + gh - 40) + '" x2="' + (gx + 40) + '" y2="' + (gy + 40) + '" stroke="#64748b" stroke-width="1.5"/>';
    h += '<text x="' + (gx + 25) + '" y="' + (gy + 45) + '" fill="#64748b" font-size="11">√ν</text>';

    // Linear regression line
    h += '<line x1="' + (gx + 40) + '" y1="' + (gy + gh - 40) + '" x2="' + (gx + gw - 40) + '" y2="' + (gy + 55) + '" stroke="#38bdf8" stroke-width="2"/>';

    // Plot points for elements
    elementData.forEach(function(d){
      var px = gx + 40 + (d.Z / 50) * (gw - 80);
      var py = (gy + gh - 40) - ((d.Z - 1) / 49) * (gh - 95);
      var isCur = (d.Z === selectedZ);
      h += '<circle cx="' + px + '" cy="' + py + '" r="' + (isCur ? '7' : '4') + '" fill="' + (isCur ? '#f43f5e' : '#10b981') + '" filter="' + (isCur ? 'drop-shadow(0 0 6px #f43f5e)' : 'none') + '"/>';
      h += '<text x="' + px + '" y="' + (py - 10) + '" fill="' + (isCur ? '#f43f5e' : '#94a3b8') + '" font-size="10" font-weight="bold" text-anchor="middle">' + d.sym + '</text>';
    });

    svg.innerHTML = h;

    readout(
      cell("Target Element", cur.sym + " (" + cur.name + ")", "#f43f5e") +
      cell("Atomic Number Z", cur.Z, "#38bdf8") +
      cell("K_α X-Ray Freq ν", (nuFreq / 1e18).toFixed(2) + " × 10¹⁸ Hz", "#10b981") +
      cell("Moseley Parameter √ν", (Math.sqrt(nuFreq) / 1e8).toFixed(2) + " × 10⁸", "#e2e8f0")
    );

    verdict('<b>Moseley&#39;s Breakthrough (1913):</b> Plotting √ν against atomic number Z yields a perfect straight line. Moseley proved that <b>atomic number Z (nuclear charge)</b>, not atomic mass, is the fundamental property governing elemental identity, cementing the Modern Periodic Law.');
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Periodic Blocks Architecture (blockexplorer)
// -------------------------------------------------------------------------
window.SIMS.blockexplorer = (function(){
  var activeBlock = "s"; // s, p, d, f

  var blockInfo = {
    s: { name: "s-Block (Groups 1 & 2)", cfg: "ns¹⁻²", chars: "Alkali & alkaline earth metals; highly electropositive, low Δ_i H, basic oxides.", color: "#38bdf8" },
    p: { name: "p-Block (Groups 13 to 18)", cfg: "ns² np¹⁻⁶", chars: "Includes metals, metalloids, halogens, noble gases; high electronegativity, acidic/amphoteric oxides.", color: "#10b981" },
    d: { name: "d-Block (Groups 3 to 12)", cfg: "(n−1)d¹⁻¹⁰ ns⁰⁻²", chars: "Transition metals; variable oxidation states, coloured ions, paramagnetic complexes, catalytic activity.", color: "#f59e0b" },
    f: { name: "f-Block (Lanthanoids & Actinoids)", cfg: "(n−2)f¹⁻¹⁴ (n−1)d⁰⁻¹ ns²", chars: "Inner transition metals; high density, actinoids radioactive (transuranics), lanthanoid contraction.", color: "#a855f7" }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>s-Block</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>d-Block</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>p-Block</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>f-Block</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-blk-s">s-Block (Reactive Metals)</button>' +
      '<button class="preset-btn" id="p-blk-p">p-Block (Representative)</button>' +
      '<button class="preset-btn" id="p-blk-d">d-Block (Transition Metals)</button>' +
      '<button class="preset-btn" id="p-blk-f">f-Block (Inner Transition)</button>';

    document.getElementById("p-blk-s").onclick = function(){ setActivePreset(this); setBlock("s"); };
    document.getElementById("p-blk-p").onclick = function(){ setActivePreset(this); setBlock("p"); };
    document.getElementById("p-blk-d").onclick = function(){ setActivePreset(this); setBlock("d"); };
    document.getElementById("p-blk-f").onclick = function(){ setActivePreset(this); setBlock("f"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Select Periodic Block: <b id="blk-label" style="color:#38bdf8;">s-Block</b></label>' +
        '<select id="blk-select" style="padding:8px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;font-size:14px;">' +
          '<option value="s" selected>s-Block (Groups 1–2: ns¹⁻²)</option>' +
          '<option value="p">p-Block (Groups 13–18: ns² np¹⁻⁶)</option>' +
          '<option value="d">d-Block (Groups 3–12: (n−1)d¹⁻¹⁰ ns⁰⁻²)</option>' +
          '<option value="f">f-Block (Lanthanoids & Actinoids: (n−2)f¹⁻¹⁴)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("blk-select").onchange = function(e){
      setBlock(e.target.value);
    };

    draw(0);
  }

  function setBlock(b){
    activeBlock = b;
    var bs = document.getElementById("blk-select"); if(bs) bs.value = b;
    var bl = document.getElementById("blk-label"); if(bl) bl.textContent = b + "-Block";
    draw(App.state.t);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var info = blockInfo[activeBlock];

    var h = '<rect width="100%" height="100%" fill="#080f1a"/>';

    h += '<text x="' + (W/2) + '" y="40" fill="#f8fafc" font-size="16" font-weight="bold" text-anchor="middle">Long Form Periodic Table: Architecture of Blocks</text>';

    // Schematic Periodic Table Grid Layout
    var startX = 60, startY = 80;
    var colW = 36, rowH = 26;

    // Groups 1-2 (s-block)
    var isS = (activeBlock === "s");
    h += '<rect x="' + startX + '" y="' + startY + '" width="' + (colW*2) + '" height="' + (rowH*7) + '" fill="' + (isS ? '#38bdf8' : '#1e293b') + '" stroke="#0f172a" stroke-width="2" rx="4" opacity="' + (isS ? '0.95' : '0.4') + '"/>';
    h += '<text x="' + (startX + colW) + '" y="' + (startY + rowH*3.5) + '" fill="' + (isS ? '#070e1a' : '#64748b') + '" font-size="14" font-weight="bold" text-anchor="middle">s-block</text>';

    // Groups 3-12 (d-block, starts row 4)
    var isD = (activeBlock === "d");
    var dX = startX + colW*2 + 8;
    var dY = startY + rowH*3;
    h += '<rect x="' + dX + '" y="' + dY + '" width="' + (colW*10) + '" height="' + (rowH*4) + '" fill="' + (isD ? '#f59e0b' : '#1e293b') + '" stroke="#0f172a" stroke-width="2" rx="4" opacity="' + (isD ? '0.95' : '0.4') + '"/>';
    h += '<text x="' + (dX + colW*5) + '" y="' + (dY + rowH*2) + '" fill="' + (isD ? '#070e1a' : '#64748b') + '" font-size="14" font-weight="bold" text-anchor="middle">d-block (Transition)</text>';

    // Groups 13-18 (p-block, starts row 2)
    var isP = (activeBlock === "p");
    var pX = dX + colW*10 + 8;
    var pY = startY + rowH*1;
    h += '<rect x="' + pX + '" y="' + pY + '" width="' + (colW*6) + '" height="' + (rowH*6) + '" fill="' + (isP ? '#10b981' : '#1e293b') + '" stroke="#0f172a" stroke-width="2" rx="4" opacity="' + (isP ? '0.95' : '0.4') + '"/>';
    h += '<text x="' + (pX + colW*3) + '" y="' + (pY + rowH*3) + '" fill="' + (isP ? '#070e1a' : '#64748b') + '" font-size="14" font-weight="bold" text-anchor="middle">p-block</text>';

    // f-block below main body
    var isF = (activeBlock === "f");
    var fX = dX;
    var fY = startY + rowH*7 + 25;
    h += '<rect x="' + fX + '" y="' + fY + '" width="' + (colW*14) + '" height="' + (rowH*2) + '" fill="' + (isF ? '#a855f7' : '#1e293b') + '" stroke="#0f172a" stroke-width="2" rx="4" opacity="' + (isF ? '0.95' : '0.4') + '"/>';
    h += '<text x="' + (fX + colW*7) + '" y="' + (fY + rowH*1.2) + '" fill="' + (isF ? '#ffffff' : '#64748b') + '" font-size="13" font-weight="bold" text-anchor="middle">f-block (Lanthanoids 4f & Actinoids 5f)</text>';

    svg.innerHTML = h;

    readout(
      cell("Block", info.name, info.color) +
      cell("Valence Configuration", info.cfg, "#facc15") +
      cell("Classification", activeBlock === "d" ? "Transition Metals" : (activeBlock === "f" ? "Inner Transition" : "Main Group Representative"), "#e2e8f0")
    );

    verdict('<b>' + info.name + ':</b> ' + info.chars);
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Atomic, Ionic & Isoelectronic Radii (radiitrends)
// -------------------------------------------------------------------------
window.SIMS.radiitrends = (function(){
  var mode = "isoelectronic"; // "isoelectronic", "period2", "group1"

  var isoelectronicData = [
    { ion: "N³⁻", z: 7, r: 171, color: "#f43f5e" },
    { ion: "O²⁻", z: 8, r: 140, color: "#fb7185" },
    { ion: "F⁻", z: 9, r: 136, color: "#f59e0b" },
    { ion: "Na⁺", z: 11, r: 102, color: "#38bdf8" },
    { ion: "Mg²⁺", z: 12, r: 72, color: "#2563eb" },
    { ion: "Al³⁺", z: 13, r: 53, color: "#1d4ed8" }
  ];

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Anions (Expanded Cloud)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cations (Contracted Cloud)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ffffff;"></span><span>Nucleus (+Ze)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-iso">Isoelectronic Series (10 e⁻: N³⁻ → Al³⁺)</button>' +
      '<button class="preset-btn" id="p-per2">Period 2 Contraction (Li → F)</button>' +
      '<button class="preset-btn" id="p-grp1">Group 1 Expansion (Li → Cs)</button>';

    document.getElementById("p-iso").onclick = function(){ setActivePreset(this); mode = "isoelectronic"; draw(0); };
    document.getElementById("p-per2").onclick = function(){ setActivePreset(this); mode = "period2"; draw(0); };
    document.getElementById("p-grp1").onclick = function(){ setActivePreset(this); mode = "group1"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Select Trend Scenario:</label>' +
        '<select id="rad-select" style="padding:8px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;font-size:14px;">' +
          '<option value="isoelectronic" selected>Isoelectronic 10 e⁻ Series (N³⁻ > O²⁻ > F⁻ > Na⁺ > Mg²⁺ > Al³⁺)</option>' +
          '<option value="period2">Period 2 Atomic Contraction (Li 152 pm → F 72 pm)</option>' +
          '<option value="group1">Group 1 Alkali Size Expansion (Li 152 pm → Cs 262 pm)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("rad-select").onchange = function(e){
      mode = e.target.value;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var cy = H / 2;

    var h = '<rect width="100%" height="100%" fill="#080f1a"/>';

    if(mode === "isoelectronic"){
      h += '<text x="' + (W/2) + '" y="45" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Isoelectronic Series (All 10 Electrons): Radius Scales as 1 / Z</text>';

      var stepX = W / (isoelectronicData.length + 1);
      isoelectronicData.forEach(function(d, i){
        var ix = (i + 1) * stepX;
        var rScaled = d.r * 0.45;

        // Electron cloud circle
        h += '<circle cx="' + ix + '" cy="' + cy + '" r="' + rScaled + '" fill="' + d.color + '" opacity="0.35" stroke="' + d.color + '" stroke-width="2"/>';
        // Central nucleus
        h += '<circle cx="' + ix + '" cy="' + cy + '" r="8" fill="#ffffff"/>';
        h += '<text x="' + ix + '" y="' + (cy + 4) + '" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">+' + d.z + '</text>';

        // Labels
        h += '<text x="' + ix + '" y="' + (cy - rScaled - 14) + '" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">' + d.ion + '</text>';
        h += '<text x="' + ix + '" y="' + (cy + rScaled + 24) + '" fill="' + d.color + '" font-size="12" font-weight="bold" text-anchor="middle">' + d.r + ' pm</text>';
      });

      readout(
        cell("Largest Ion", "N³⁻ (171 pm, Z = 7)", "#f43f5e") +
        cell("Smallest Ion", "Al³⁺ (53 pm, Z = 13)", "#38bdf8") +
        cell("Electron Count", "10 e⁻ (Isoelectronic with Neon)", "#facc15") +
        cell("Trend Rule", "r ∝ 1 / Z", "#10b981")
      );
      verdict('<b>Isoelectronic Shrinkage:</b> As atomic number Z increases from 7 (N) to 13 (Al), 13 protons pull the same 10 electrons much more strongly than 7 protons do, compressing the radius from 171 pm down to 53 pm.');
    }
    else if(mode === "period2"){
      h += '<text x="' + (W/2) + '" y="45" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Period 2 Atomic Radii Contraction (Li to F)</text>';
      var p2Data = [
        { sym: "Li", z: 3, r: 152 }, { sym: "Be", z: 4, r: 111 }, { sym: "B", z: 5, r: 88 },
        { sym: "C", z: 6, r: 77 }, { sym: "N", z: 7, r: 74 }, { sym: "O", z: 8, r: 66 }, { sym: "F", z: 9, r: 64 }
      ];
      var step = W / (p2Data.length + 1);
      p2Data.forEach(function(d, i){
        var px = (i + 1) * step;
        var rPix = d.r * 0.42;
        h += '<circle cx="' + px + '" cy="' + cy + '" r="' + rPix + '" fill="#38bdf8" opacity="0.35" stroke="#38bdf8" stroke-width="2"/>';
        h += '<circle cx="' + px + '" cy="' + cy + '" r="6" fill="#fff"/>';
        h += '<text x="' + px + '" y="' + (cy - rPix - 12) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">' + d.sym + '</text>';
        h += '<text x="' + px + '" y="' + (cy + rPix + 22) + '" fill="#38bdf8" font-size="12" text-anchor="middle">' + d.r + ' pm</text>';
      });

      readout(
        cell("Lithium (Group 1)", "152 pm", "#38bdf8") +
        cell("Fluorine (Group 17)", "64 pm", "#f43f5e") +
        cell("Driving Force", "Increasing Z_eff (n=2)", "#facc15")
      );
      verdict('<b>Period 2 Size Contraction:</b> Across the period, electrons enter the same shell (n=2) while nuclear charge increases from +3 to +9. The growing effective nuclear charge pulls the electron cloud progressively closer.');
    }
    else {
      h += '<text x="' + (W/2) + '" y="45" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Group 1 Alkali Metals: Atomic Radii Expansion</text>';
      var g1Data = [
        { sym: "Li", n: 2, r: 152 }, { sym: "Na", n: 3, r: 186 }, { sym: "K", n: 4, r: 227 },
        { sym: "Rb", n: 5, r: 248 }, { sym: "Cs", n: 6, r: 262 }
      ];
      var gStep = W / (g1Data.length + 1);
      g1Data.forEach(function(d, i){
        var gx = (i + 1) * gStep;
        var gr = d.r * 0.32;
        h += '<circle cx="' + gx + '" cy="' + cy + '" r="' + gr + '" fill="#10b981" opacity="0.35" stroke="#10b981" stroke-width="2"/>';
        h += '<circle cx="' + gx + '" cy="' + cy + '" r="6" fill="#fff"/>';
        h += '<text x="' + gx + '" y="' + (cy - gr - 12) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">' + d.sym + '</text>';
        h += '<text x="' + gx + '" y="' + (cy + gr + 22) + '" fill="#10b981" font-size="12" text-anchor="middle">' + d.r + ' pm (n=' + d.n + ')</text>';
      });

      readout(
        cell("Li (Period 2)", "152 pm", "#10b981") +
        cell("Cs (Period 6)", "262 pm", "#f59e0b") +
        cell("Mechanism", "Addition of principal quantum shells", "#e2e8f0")
      );
      verdict('<b>Group 1 Expansion:</b> Down Group 1, adding successive electron shells (n=2 to n=6) and core shielding outweigh the increased nuclear charge, causing atomic radius to expand nearly twofold.');
    }

    svg.innerHTML = h;
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Ionization Enthalpy & Subshell Anomalies (ionizationlab)
// -------------------------------------------------------------------------
window.SIMS.ionizationlab = (function(){
  var focusAnomaly = "be-b"; // "be-b" or "n-o"

  var p2IE = [
    { sym: "Li", z: 3, ie: 520, cfg: "2s¹" },
    { sym: "Be", z: 4, ie: 899, cfg: "2s² (Full subshell)", highlight: true },
    { sym: "B", z: 5, ie: 801, cfg: "2s² 2p¹ (Shielded 2p)", anomaly: true },
    { sym: "C", z: 6, ie: 1086, cfg: "2p²" },
    { sym: "N", z: 7, ie: 1402, cfg: "2p³ (Half-filled stable)", highlight: true },
    { sym: "O", z: 8, ie: 1314, cfg: "2p⁴ (Paired repulsion)", anomaly: true },
    { sym: "F", z: 9, ie: 1681, cfg: "2p⁵" },
    { sym: "Ne", z: 10, ie: 2080, cfg: "2s² 2p⁶ (Closed octet)" }
  ];

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Stable Subshell Peak (Full 2s², Half 2p³)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Anomalous Drop (Shielded 2p¹, Paired 2p⁴)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>General Upward Trend (Increasing Z)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-beb">Beryllium vs Boron Anomaly (Be > B)</button>' +
      '<button class="preset-btn" id="p-no">Nitrogen vs Oxygen Anomaly (N > O)</button>' +
      '<button class="preset-btn" id="p-full">Full Period 2 Curve</button>';

    document.getElementById("p-beb").onclick = function(){ setActivePreset(this); focusAnomaly = "be-b"; draw(0); };
    document.getElementById("p-no").onclick = function(){ setActivePreset(this); focusAnomaly = "n-o"; draw(0); };
    document.getElementById("p-full").onclick = function(){ setActivePreset(this); focusAnomaly = "full"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Select Anomaly Focus:</label>' +
        '<select id="ie-select" style="padding:8px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;font-size:14px;">' +
          '<option value="be-b" selected>Be (899 kJ/mol) > B (801 kJ/mol) — 2s² penetration vs 2p¹ shielding</option>' +
          '<option value="n-o">N (1402 kJ/mol) > O (1314 kJ/mol) — 2p³ exchange stability vs 2p⁴ pair repulsion</option>' +
          '<option value="full">Complete Period 2 Curve (Li to Ne)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("ie-select").onchange = function(e){
      focusAnomaly = e.target.value;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var gx = 80, gy = 70, gw = W - 160, gh = H - 150;

    var h = '<rect width="100%" height="100%" fill="#080f1a"/>';
    h += '<text x="' + (W/2) + '" y="40" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Period 2 First Ionization Enthalpy (Δ_i H₁ in kJ/mol)</text>';

    // Grid axes
    h += '<line x1="' + gx + '" y1="' + (gy + gh) + '" x2="' + (gx + gw) + '" y2="' + (gy + gh) + '" stroke="#334155" stroke-width="2"/>';
    h += '<line x1="' + gx + '" y1="' + (gy + gh) + '" x2="' + gx + '" y2="' + gy + '" stroke="#334155" stroke-width="2"/>';

    // Plot line
    var points = [];
    var step = gw / (p2IE.length - 1);
    p2IE.forEach(function(d, i){
      var px = gx + i * step;
      var py = (gy + gh) - ((d.ie - 400) / 1800) * gh;
      points.push(px + ',' + py);
    });

    h += '<path d="M ' + points.join(' L ') + '" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';

    // Draw points and labels
    p2IE.forEach(function(d, i){
      var px = gx + i * step;
      var py = (gy + gh) - ((d.ie - 400) / 1800) * gh;
      var isTarget = (focusAnomaly === "be-b" && (d.sym === "Be" || d.sym === "B")) ||
                     (focusAnomaly === "n-o" && (d.sym === "N" || d.sym === "O"));

      var pCol = isTarget ? "#f43f5e" : (d.highlight ? "#f59e0b" : "#38bdf8");
      h += '<circle cx="' + px + '" cy="' + py + '" r="' + (isTarget ? '8' : '5') + '" fill="' + pCol + '" filter="' + (isTarget ? 'drop-shadow(0 0 8px ' + pCol + ')' : 'none') + '"/>';
      h += '<text x="' + px + '" y="' + (py - 12) + '" fill="' + (isTarget ? '#f43f5e' : '#cbd5e1') + '" font-size="' + (isTarget ? '13' : '11') + '" font-weight="bold" text-anchor="middle">' + d.sym + ' (' + d.ie + ')</text>';
      h += '<text x="' + px + '" y="' + (gy + gh + 20) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + d.cfg.split(" ")[0] + '</text>';
    });

    svg.innerHTML = h;

    if(focusAnomaly === "be-b"){
      readout(
        cell("Beryllium (Z=4)", "899 kJ/mol (2s²)", "#f59e0b") +
        cell("Boron (Z=5)", "801 kJ/mol (2s² 2p¹)", "#f43f5e") +
        cell("Reason", "2s penetrative stability vs 2p shielding", "#e2e8f0")
      );
      verdict('<b>Be > B Anomaly:</b> Beryllium has a completely filled, penetrating 2s subshell. In Boron, the outermost electron is in a higher-energy 2p orbital, well shielded by the inner 2s² pair, making it easier to ionize despite higher Z.');
    }
    else if(focusAnomaly === "n-o"){
      readout(
        cell("Nitrogen (Z=7)", "1402 kJ/mol (2p³)", "#f59e0b") +
        cell("Oxygen (Z=8)", "1314 kJ/mol (2p⁴)", "#f43f5e") +
        cell("Reason", "Half-filled 2p³ exchange vs 2p⁴ pair repulsion", "#e2e8f0")
      );
      verdict('<b>N > O Anomaly:</b> Nitrogen has a symmetrical half-filled 2p³ subshell with maximum exchange energy. In Oxygen, two electrons share the same 2p_x orbital, experiencing mutual Coulombic repulsion that lowers the energy required for electron removal.');
    }
    else {
      readout(
        cell("Lowest in P2", "Lithium (520 kJ/mol)", "#38bdf8") +
        cell("Highest in P2", "Neon (2080 kJ/mol)", "#facc15") +
        cell("Overall Trend", "General increase interrupted by subshell stability", "#10b981")
      );
      verdict('<b>General Period 2 Trend:</b> Ionization enthalpy increases nearly fourfold from Lithium to Neon due to increasing effective nuclear charge, punctuated by subshell stability dips at Boron and Oxygen.');
    }
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Electron Gain Enthalpy & Electronegativity (electronaffinity)
// -------------------------------------------------------------------------
window.SIMS.electronaffinity = (function(){
  var pair = "cl-f"; // "cl-f" or "s-o"

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Chlorine (3p: Low Repulsion, −349 kJ/mol)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Fluorine (2p: High Repulsion, −328 kJ/mol)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-clf">Halogen Anomaly: Cl vs F</button>' +
      '<button class="preset-btn" id="p-so">Chalcogen Anomaly: S vs O</button>';

    document.getElementById("p-clf").onclick = function(){ setActivePreset(this); pair = "cl-f"; draw(0); };
    document.getElementById("p-so").onclick = function(){ setActivePreset(this); pair = "s-o"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Select Comparison Pair:</label>' +
        '<select id="ea-select" style="padding:8px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;font-size:14px;">' +
          '<option value="cl-f" selected>Halogens: Chlorine (−349 kJ/mol) vs Fluorine (−328 kJ/mol)</option>' +
          '<option value="s-o">Chalcogens: Sulfur (−200 kJ/mol) vs Oxygen (−141 kJ/mol)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("ea-select").onchange = function(e){
      pair = e.target.value;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var cx = W / 2, cy = H / 2;

    var h = '<rect width="100%" height="100%" fill="#080f1a"/>';

    if(pair === "cl-f"){
      h += '<text x="' + cx + '" y="45" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Halogen Electron Gain Enthalpy Anomaly: Why Cl > F</text>';

      // Left: Fluorine (compact 2p)
      var fx = cx - 180;
      h += '<rect x="' + (fx - 130) + '" y="70" width="260" height="250" rx="10" fill="#1e293b" stroke="#f43f5e" stroke-width="2"/>';
      h += '<text x="' + fx + '" y="100" fill="#f43f5e" font-size="15" font-weight="bold" text-anchor="middle">Fluorine (F, n = 2)</text>';
      h += '<circle cx="' + fx + '" cy="' + (cy + 10) + '" r="40" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" stroke-width="2"/>';
      h += '<circle cx="' + fx + '" cy="' + (cy + 10) + '" r="8" fill="#ffffff"/>';
      h += '<text x="' + fx + '" y="' + (cy + 14) + '" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">+9</text>';

      // Dense electrons packed in small space
      for(var k = 0; k < 7; k++){
        var ang = k * (2 * Math.PI / 7);
        h += '<circle cx="' + (fx + 30 * Math.cos(ang)) + '" cy="' + (cy + 10 + 30 * Math.sin(ang)) + '" r="4" fill="#fb7185"/>';
      }
      h += '<text x="' + fx + '" y="270" fill="#f43f5e" font-size="13" font-weight="bold" text-anchor="middle">Δ_eg H = −328 kJ/mol</text>';
      h += '<text x="' + fx + '" y="295" fill="#cbd5e1" font-size="11" text-anchor="middle">High Inter-Electronic Repulsion!</text>';

      // Right: Chlorine (diffuse 3p)
      var clx = cx + 180;
      h += '<rect x="' + (clx - 130) + '" y="70" width="260" height="250" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
      h += '<text x="' + clx + '" y="100" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">Chlorine (Cl, n = 3)</text>';
      h += '<circle cx="' + clx + '" cy="' + (cy + 10) + '" r="75" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="2"/>';
      h += '<circle cx="' + clx + '" cy="' + (cy + 10) + '" r="8" fill="#ffffff"/>';
      h += '<text x="' + clx + '" y="' + (cy + 14) + '" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">+17</text>';

      for(var j = 0; j < 7; j++){
        var ang2 = j * (2 * Math.PI / 7);
        h += '<circle cx="' + (clx + 60 * Math.cos(ang2)) + '" cy="' + (cy + 10 + 60 * Math.sin(ang2)) + '" r="4" fill="#34d399"/>';
      }
      h += '<text x="' + clx + '" y="270" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">Δ_eg H = −349 kJ/mol (Champion!)</text>';
      h += '<text x="' + clx + '" y="295" fill="#cbd5e1" font-size="11" text-anchor="middle">Roomy 3p shell accommodates e⁻</text>';

      readout(
        cell("Chlorine Δ_eg H", "−349 kJ/mol (Most negative in table)", "#10b981") +
        cell("Fluorine Δ_eg H", "−328 kJ/mol", "#f43f5e") +
        cell("Pauling EN", "F = 4.0 | Cl = 3.0", "#facc15")
      );
      verdict('<b>Why Chlorine Beats Fluorine:</b> Although Fluorine has higher electronegativity, its 2p valence shell is extremely compact. Adding an 8th electron creates intense inter-electronic Coulomb repulsion that partially offsets nuclear attraction. Chlorine\'s larger 3p shell minimizes repulsion, releasing more energy.');
    }
    else {
      h += '<text x="' + cx + '" y="45" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Chalcogen Anomaly: Sulfur (−200 kJ/mol) vs Oxygen (−141 kJ/mol)</text>';
      readout(
        cell("Sulfur Δ_eg H", "−200 kJ/mol (3p shell)", "#10b981") +
        cell("Oxygen Δ_eg H", "−141 kJ/mol (Compact 2p)", "#f43f5e") +
        cell("Second Δ_eg H (O²⁻)", "+780 kJ/mol (Endothermic)", "#facc15")
      );
      verdict('<b>Chalcogen Trend:</b> Exactly like the halogen pair, Oxygen has an extraordinarily compact 2p subshell with high electron density. Sulfur\'s 3p subshell readily accepts the added electron with lower repulsion, releasing significantly more energy.');
    }

    svg.innerHTML = h;
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Diagonal Relationships & Covalency Ceiling (diagonalrel)
// -------------------------------------------------------------------------
window.SIMS.diagonalrel = (function(){
  var pairMode = "li-mg"; // "li-mg", "be-al", "ceiling"

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Second Period (No d-orbitals, Max Covalency 4)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Third Period (Vacant 3d, Expanded Octet)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Diagonal Vector (Charge / Radius²)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-limg">Li – Mg Diagonal Pair</button>' +
      '<button class="preset-btn" id="p-beal">Be – Al Diagonal Pair</button>' +
      '<button class="preset-btn" id="p-ceil">Octet Covalency Ceiling (BF₄⁻ vs AlF₆³⁻)</button>';

    document.getElementById("p-limg").onclick = function(){ setActivePreset(this); pairMode = "li-mg"; draw(0); };
    document.getElementById("p-beal").onclick = function(){ setActivePreset(this); pairMode = "be-al"; draw(0); };
    document.getElementById("p-ceil").onclick = function(){ setActivePreset(this); pairMode = "ceiling"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Select Diagonal Pair / Covalency Feature:</label>' +
        '<select id="diag-select" style="padding:8px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;font-size:14px;">' +
          '<option value="li-mg" selected>Lithium & Magnesium (Ionic size, carbonate decomposition, organometallics)</option>' +
          '<option value="be-al">Beryllium & Aluminium (Amphoteric oxides, polymeric chlorides, passive to HNO₃)</option>' +
          '<option value="ceiling">Covalency Ceiling: BF₄⁻ (Max 4, no d-orbitals) vs AlF₆³⁻ (Expanded octet 6)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("diag-select").onchange = function(e){
      pairMode = e.target.value;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var cx = W / 2, cy = H / 2;

    var h = '<rect width="100%" height="100%" fill="#080f1a"/>';

    if(pairMode === "li-mg"){
      h += '<text x="' + cx + '" y="45" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Diagonal Relationship: Lithium (Li⁺) and Magnesium (Mg²⁺)</text>';

      h += '<g transform="translate(' + (cx - 250) + ', 80)">';
      h += '<rect x="0" y="0" width="220" height="180" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
      h += '<text x="110" y="35" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Lithium (Li⁺)</text>';
      h += '<text x="20" y="70" fill="#cbd5e1" font-size="12">• Ionic Radius: 76 pm</text>';
      h += '<text x="20" y="100" fill="#cbd5e1" font-size="12">• Charge: +1</text>';
      h += '<text x="20" y="130" fill="#facc15" font-size="12">• Polarizing Power: ~0.013</text>';
      h += '<text x="20" y="160" fill="#cbd5e1" font-size="12">• Carbonate decomposes to Li₂O</text>';

      // Diagonal arrow
      h += '<path d="M 230 90 L 270 120" stroke="#f59e0b" stroke-width="3" marker-end="url(#arrow)"/>';

      h += '<rect x="280" y="30" width="220" height="180" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
      h += '<text x="390" y="65" fill="#10b981" font-size="16" font-weight="bold" text-anchor="middle">Magnesium (Mg²⁺)</text>';
      h += '<text x="300" y="100" fill="#cbd5e1" font-size="12">• Ionic Radius: 72 pm</text>';
      h += '<text x="300" y="130" fill="#cbd5e1" font-size="12">• Charge: +2</text>';
      h += '<text x="300" y="160" fill="#facc15" font-size="12">• Polarizing Power: ~0.027</text>';
      h += '</g>';

      readout(
        cell("Li⁺ Ionic Radius", "76 pm", "#38bdf8") +
        cell("Mg²⁺ Ionic Radius", "72 pm", "#10b981") +
        cell("Chemical Parallels", "Both form normal oxides (Li₂O, MgO) & nitrides (Li₃N, Mg₃N₂)", "#e2e8f0")
      );
      verdict('<b>Diagonal Similarity:</b> Moving across decreases atomic size and increases electronegativity, while moving down increases size and decreases electronegativity. Along the diagonal, these effects counterbalance, giving Li⁺ and Mg²⁺ remarkably similar polarizing powers.');
    }
    else if(pairMode === "be-al"){
      h += '<text x="' + cx + '" y="45" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Diagonal Relationship: Beryllium (Be²⁺) and Aluminium (Al³⁺)</text>';

      h += '<g transform="translate(' + (cx - 250) + ', 80)">';
      h += '<rect x="0" y="0" width="220" height="190" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
      h += '<text x="110" y="35" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Beryllium (Be²⁺)</text>';
      h += '<text x="20" y="70" fill="#cbd5e1" font-size="12">• Ionic Radius: 31 pm</text>';
      h += '<text x="20" y="100" fill="#cbd5e1" font-size="12">• Oxide BeO: Amphoteric</text>';
      h += '<text x="20" y="130" fill="#cbd5e1" font-size="12">• Chloride: Covalent [BeCl₂]ₙ</text>';
      h += '<text x="20" y="160" fill="#cbd5e1" font-size="12">• Passive to conc. HNO₃</text>';

      h += '<rect x="280" y="30" width="220" height="190" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
      h += '<text x="390" y="65" fill="#10b981" font-size="16" font-weight="bold" text-anchor="middle">Aluminium (Al³⁺)</text>';
      h += '<text x="300" y="100" fill="#cbd5e1" font-size="12">• Ionic Radius: 53.5 pm</text>';
      h += '<text x="300" y="130" fill="#cbd5e1" font-size="12">• Oxide Al₂O₃: Amphoteric</text>';
      h += '<text x="300" y="160" fill="#cbd5e1" font-size="12">• Chloride: Covalent dimer Al₂Cl₆</text>';
      h += '</g>';

      readout(
        cell("Be–Al Oxides", "Both Amphoteric (react with acid & base)", "#facc15") +
        cell("Chlorides", "Both Covalent Lewis Acids in organic solvents", "#38bdf8") +
        cell("Passivity", "Both form inert oxide skin with HNO₃", "#10b981")
      );
      verdict('<b>Be – Al Parallels:</b> Both metals resist nitric acid attack through oxide passivation, both form amphoteric hydroxides dissolving in NaOH to yield beryllates [Be(OH)₄]²⁻ and aluminates [Al(OH)₄]⁻, and both form bridged covalent chlorides.');
    }
    else {
      h += '<text x="' + cx + '" y="45" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">The Covalency Ceiling: Period 2 (Max 4) vs Period 3 (Expanded Octet 6)</text>';

      h += '<g transform="translate(' + (cx - 260) + ', 90)">';
      h += '<rect x="0" y="0" width="240" height="200" rx="10" fill="#1e293b" stroke="#f43f5e" stroke-width="2"/>';
      h += '<text x="120" y="35" fill="#f43f5e" font-size="15" font-weight="bold" text-anchor="middle">Boron: BF₄⁻ (Covalency = 4)</text>';
      h += '<text x="20" y="75" fill="#cbd5e1" font-size="12">• Shell n = 2: 2s (1) + 2p (3) = 4 orbitals</text>';
      h += '<text x="20" y="105" fill="#cbd5e1" font-size="12">• ZERO vacant d-orbitals in shell 2</text>';
      h += '<text x="20" y="135" fill="#f43f5e" font-size="12" font-weight="bold">• BF₆³⁻ is physically IMPOSSIBLE</text>';
      h += '<text x="20" y="165" fill="#cbd5e1" font-size="12">• Strict octet ceiling (8 e⁻ max)</text>';

      h += '<rect x="280" y="0" width="240" height="200" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
      h += '<text x="400" y="35" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">Aluminium: AlF₆³⁻ (Covalency = 6)</text>';
      h += '<text x="300" y="75" fill="#cbd5e1" font-size="12">• Shell n = 3: 3s + 3p + vacant 3d</text>';
      h += '<text x="300" y="105" fill="#cbd5e1" font-size="12">• Uses 3d orbitals (sp³d² hybrid)</text>';
      h += '<text x="300" y="135" fill="#10b981" font-size="12" font-weight="bold">• Readily expands octet to 12 e⁻</text>';
      h += '<text x="300" y="165" fill="#cbd5e1" font-size="12">• Stable octahedral complex</text>';
      h += '</g>';

      readout(
        cell("Period 2 Max Covalency", "4 (2s + three 2p orbitals)", "#f43f5e") +
        cell("Period 3 Max Covalency", "6 (accessible vacant 3d orbitals)", "#10b981") +
        cell("Octet Expansion", "Forbidden for N, O, F; Allowed for P, S, Cl", "#facc15")
      );
      verdict('<b>Anomalous Second Period:</b> Elements of Period 2 (Li to F) have only 2s and 2p valence orbitals and zero d-orbitals, capping their maximum covalency at 4. Elements of Period 3 possess vacant 3d orbitals, freely expanding their coordination shell to 6.');
    }

    svg.innerHTML = h;
  }

  return { mount: mount, update: draw };
})();

// Route timeline tick from App
App.updateSim = function(t){
  var s = App.currentConcept && App.currentConcept.sim;
  if(s && window.SIMS[s] && window.SIMS[s].update){
    window.SIMS[s].update(t);
  }
};
App.mountSim = function(id){
  if(window.SIMS[id] && window.SIMS[id].mount){
    window.SIMS[id].mount();
  }
};

// Initial hash route
window.addEventListener("DOMContentLoaded", function(){
  if(window.App && window.App.routeFromHash){
    window.App.routeFromHash();
  }
});
