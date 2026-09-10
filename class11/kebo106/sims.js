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
// 1. SIMULATION 1: Stomatal Apparatus & Turgor Gate (stomatalab)
// -------------------------------------------------------------------------
window.SIMS.stomatalab = (function(){
  var gType = "dicot"; // "dicot" (bean), "monocot" (dumb-bell)
  var isOpen = true;

  function setT(t){ gType = t; draw(0); }
  function setO(o){ isOpen = o; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Guard Cells (Chloroplasts)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Subsidiary Cells</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Thickened Inner Wall</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Stomatal Pore</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-d-open">Dicot (Bean-shaped, Open)</button>' +
      '<button class="preset-btn" id="p-d-close">Dicot (Bean-shaped, Closed)</button>' +
      '<button class="preset-btn" id="p-m-open">Monocot / Grass (Dumb-bell, Open)</button>' +
      '<button class="preset-btn" id="p-m-close">Monocot / Grass (Closed)</button>';

    document.getElementById("p-d-open").onclick = function(){ setActivePreset(this); setT("dicot"); setO(true); };
    document.getElementById("p-d-close").onclick = function(){ setActivePreset(this); setT("dicot"); setO(false); };
    document.getElementById("p-m-open").onclick = function(){ setActivePreset(this); setT("monocot"); setO(true); };
    document.getElementById("p-m-close").onclick = function(){ setActivePreset(this); setT("monocot"); setO(false); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>NCERT Fig 6.4: Diagrammatic representation of stomatal apparatus</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Comparing kidney-shaped dicot guard cells with dumb-bell-shaped monocot/grass guard cells during turgid vs flaccid states.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="stomaBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#stomaBg)" rx="10"/>';

    // Left Schematic Box (x: 25 to 355)
    m += '<rect x="25" y="25" width="330" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
    var title = (gType === "dicot" ? "Dicot Stoma (Kidney / Bean Shaped)" : "Monocot Stoma (Dumb-bell Shaped)");
    m += '<text x="190" y="50" fill="#38bdf8" font-size="12.5" font-weight="700" text-anchor="middle">' + title + '</text>';

    var cx = 190, cy = 160;

    if(gType === "dicot"){
      // Subsidiary cells surrounding guard cells
      m += '<ellipse cx="' + (cx - 75) + '" cy="' + cy + '" rx="32" ry="55" fill="#0369a1" opacity="0.3" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<ellipse cx="' + (cx + 75) + '" cy="' + cy + '" rx="32" ry="55" fill="#0369a1" opacity="0.3" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="' + (cx - 75) + '" y="' + cy + '" fill="#94a3b8" font-size="8.5" text-anchor="middle">Subsidiary</text>';
      m += '<text x="' + (cx + 75) + '" y="' + cy + '" fill="#94a3b8" font-size="8.5" text-anchor="middle">Subsidiary</text>';

      if(isOpen){
        // Turgid: outer walls bulge outward, inner walls pulled apart leaving open pore
        // Left Guard Cell
        m += '<path d="M ' + (cx - 12) + ',' + (cy - 60) + ' C ' + (cx - 65) + ',' + (cy - 30) + ' ' + (cx - 65) + ',' + (cy + 30) + ' ' + (cx - 12) + ',' + (cy + 60) + ' C ' + (cx - 30) + ',' + (cy + 25) + ' ' + (cx - 30) + ',' + (cy - 25) + ' ' + (cx - 12) + ',' + (cy - 60) + ' Z" fill="#059669" stroke="#10b981" stroke-width="2"/>';
        // Thick inner wall (orange/amber)
        m += '<path d="M ' + (cx - 12) + ',' + (cy - 60) + ' C ' + (cx - 30) + ',' + (cy - 25) + ' ' + (cx - 30) + ',' + (cy + 25) + ' ' + (cx - 12) + ',' + (cy + 60) + '" fill="none" stroke="#f59e0b" stroke-width="4.5"/>';

        // Right Guard Cell
        m += '<path d="M ' + (cx + 12) + ',' + (cy - 60) + ' C ' + (cx + 65) + ',' + (cy - 30) + ' ' + (cx + 65) + ',' + (cy + 30) + ' ' + (cx + 12) + ',' + (cy + 60) + ' C ' + (cx + 30) + ',' + (cy + 25) + ' ' + (cx + 30) + ',' + (cy - 25) + ' ' + (cx + 12) + ',' + (cy - 60) + ' Z" fill="#059669" stroke="#10b981" stroke-width="2"/>';
        m += '<path d="M ' + (cx + 12) + ',' + (cy - 60) + ' C ' + (cx + 30) + ',' + (cy - 25) + ' ' + (cx + 30) + ',' + (cy + 25) + ' ' + (cx + 12) + ',' + (cy + 60) + '" fill="none" stroke="#f59e0b" stroke-width="4.5"/>';

        // Stomatal Pore in center (pink/magenta)
        m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="11" ry="36" fill="#ec4899" opacity="0.6"/>';
        m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#fdf2f8" font-size="9" font-weight="700" text-anchor="middle">Pore Open</text>';

        // Chloroplasts in guard cells
        var clPos = [[-35, -20], [-40, 10], [-30, 30], [35, -20], [40, 10], [30, 30]];
        for(var ci = 0; ci < clPos.length; ci++){
          m += '<circle cx="' + (cx + clPos[ci][0]) + '" cy="' + (cy + clPos[ci][1]) + '" r="3.5" fill="#86efac"/>';
        }

        m += '<text x="' + cx + '" y="275" fill="#10b981" font-size="10.5" font-weight="700" text-anchor="middle">Turgid State: Outer Wall Bulged Outward</text>';

      } else {
        // Flaccid: guard cells sag inward, inner thick walls meet and seal pore
        m += '<path d="M ' + (cx - 2) + ',' + (cy - 60) + ' C ' + (cx - 45) + ',' + (cy - 30) + ' ' + (cx - 45) + ',' + (cy + 30) + ' ' + (cx - 2) + ',' + (cy + 60) + ' C ' + (cx - 8) + ',' + (cy + 25) + ' ' + (cx - 8) + ',' + (cy - 25) + ' ' + (cx - 2) + ',' + (cy - 60) + ' Z" fill="#047857" stroke="#10b981" stroke-width="2"/>';
        m += '<line x1="' + (cx - 2) + '" y1="' + (cy - 55) + '" x2="' + (cx - 2) + '" y2="' + (cy + 55) + '" stroke="#f59e0b" stroke-width="4"/>';

        m += '<path d="M ' + (cx + 2) + ',' + (cy - 60) + ' C ' + (cx + 45) + ',' + (cy - 30) + ' ' + (cx + 45) + ',' + (cy + 30) + ' ' + (cx + 2) + ',' + (cy + 60) + ' C ' + (cx + 8) + ',' + (cy + 25) + ' ' + (cx + 8) + ',' + (cy - 25) + ' ' + (cx + 2) + ',' + (cy - 60) + ' Z" fill="#047857" stroke="#10b981" stroke-width="2"/>';
        m += '<line x1="' + (cx + 2) + '" y1="' + (cy - 55) + '" x2="' + (cx + 2) + '" y2="' + (cy + 55) + '" stroke="#f59e0b" stroke-width="4"/>';

        m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#ef4444" font-size="9" font-weight="700" text-anchor="middle">Closed</text>';
        m += '<text x="' + cx + '" y="275" fill="#f87171" font-size="10.5" font-weight="700" text-anchor="middle">Flaccid State: Thick Walls Straightened</text>';
      }

    } else {
      // Monocot / Grass: Dumb-bell shaped guard cells
      if(isOpen){
        // Left dumb-bell: bulbous ends at top & bottom, narrow neck in middle
        m += '<circle cx="' + (cx - 18) + '" cy="' + (cy - 42) + '" r="14" fill="#059669" stroke="#10b981" stroke-width="2"/>';
        m += '<circle cx="' + (cx - 18) + '" cy="' + (cy + 42) + '" r="14" fill="#059669" stroke="#10b981" stroke-width="2"/>';
        m += '<rect x="' + (cx - 24) + '" y="' + (cy - 30) + '" width="12" height="60" rx="3" fill="#059669" stroke="#10b981" stroke-width="1.5"/>';
        m += '<line x1="' + (cx - 12) + '" y1="' + (cy - 25) + '" x2="' + (cx - 12) + '" y2="' + (cy + 25) + '" stroke="#f59e0b" stroke-width="4"/>';

        // Right dumb-bell
        m += '<circle cx="' + (cx + 18) + '" cy="' + (cy - 42) + '" r="14" fill="#059669" stroke="#10b981" stroke-width="2"/>';
        m += '<circle cx="' + (cx + 18) + '" cy="' + (cy + 42) + '" r="14" fill="#059669" stroke="#10b981" stroke-width="2"/>';
        m += '<rect x="' + (cx + 12) + '" y="' + (cy - 30) + '" width="12" height="60" rx="3" fill="#059669" stroke="#10b981" stroke-width="1.5"/>';
        m += '<line x1="' + (cx + 12) + '" y1="' + (cy - 25) + '" x2="' + (cx + 12) + '" y2="' + (cy + 25) + '" stroke="#f59e0b" stroke-width="4"/>';

        // Central pore
        m += '<rect x="' + (cx - 8) + '" y="' + (cy - 20) + '" width="16" height="40" rx="4" fill="#ec4899" opacity="0.6"/>';
        m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#fdf2f8" font-size="8.5" font-weight="700" text-anchor="middle">Pore Open</text>';
        m += '<text x="' + cx + '" y="275" fill="#10b981" font-size="10.5" font-weight="700" text-anchor="middle">Bulbous Ends Inflated with Water</text>';

      } else {
        // Closed dumb-bells
        m += '<circle cx="' + (cx - 10) + '" cy="' + (cy - 40) + '" r="11" fill="#047857" stroke="#10b981" stroke-width="2"/>';
        m += '<circle cx="' + (cx - 10) + '" cy="' + (cy + 40) + '" r="11" fill="#047857" stroke="#10b981" stroke-width="2"/>';
        m += '<rect x="' + (cx - 14) + '" y="' + (cy - 30) + '" width="10" height="60" rx="2" fill="#047857" stroke="#10b981" stroke-width="1.5"/>';

        m += '<circle cx="' + (cx + 10) + '" cy="' + (cy - 40) + '" r="11" fill="#047857" stroke="#10b981" stroke-width="2"/>';
        m += '<circle cx="' + (cx + 10) + '" cy="' + (cy + 40) + '" r="11" fill="#047857" stroke="#10b981" stroke-width="2"/>';
        m += '<rect x="' + (cx + 4) + '" y="' + (cy - 30) + '" width="10" height="60" rx="2" fill="#047857" stroke="#10b981" stroke-width="1.5"/>';

        m += '<line x1="' + cx + '" y1="' + (cy - 35) + '" x2="' + cx + '" y2="' + (cy + 35) + '" stroke="#f59e0b" stroke-width="3"/>';
        m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#ef4444" font-size="8.5" font-weight="700" text-anchor="middle">Closed</text>';
        m += '<text x="' + cx + '" y="275" fill="#f87171" font-size="10.5" font-weight="700" text-anchor="middle">Ends Deflated: Central Necks Meet</text>';
      }
    }

    // Right Explanation Card
    m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="395" y="55" fill="#38bdf8" font-size="13" font-weight="700">Stomatal Apparatus Anatomy</text>';
    m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">1. <strong>Stomatal Pore:</strong> Microscopic central aperture</text>';
    m += '<text x="395" y="100" fill="#cbd5e1" font-size="11">   for CO₂/O₂ gas exchange and transpiration.</text>';
    m += '<text x="395" y="125" fill="#cbd5e1" font-size="11">2. <strong>Two Guard Cells:</strong> Living cells containing</text>';
    m += '<text x="395" y="140" fill="#10b981" font-size="11" font-weight="700">   chloroplasts. Differential wall thickness:</text>';
    m += '<text x="395" y="158" fill="#cbd5e1" font-size="10.5">   • Inner wall (bordering pore): Thick &amp; inelastic</text>';
    m += '<text x="395" y="174" fill="#cbd5e1" font-size="10.5">   • Outer wall (facing subsidiary): Thin &amp; elastic</text>';
    m += '<text x="395" y="198" fill="#cbd5e1" font-size="11">3. <strong>Subsidiary Cells:</strong> Specialized epidermal</text>';
    m += '<text x="395" y="213" fill="#cbd5e1" font-size="11">   cells functioning as ion and water reservoirs.</text>';
    m += '<text x="395" y="240" fill="#fcd34d" font-size="10.5">Shape: Bean-shaped (Dicots) | Dumb-bell (Grasses)</text>';

    svg.innerHTML = m;

    readout(
      cell("Plant Class", gType === "dicot" ? "Dicotyledon" : "Monocot (Grass)", "#38bdf8") +
      cell("Guard Cell Shape", gType === "dicot" ? "Bean / Kidney Shaped" : "Dumb-bell Shaped", "#10b981") +
      cell("Pore State", isOpen ? "OPEN (Turgid)" : "CLOSED (Flaccid)", isOpen ? "#ec4899" : "#f43f5e") +
      cell("Chloroplasts", "Present in Guard Cells", "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Stomatal Gate Rule:</span> ' +
      (gType === "dicot" ? "Dicot guard cells are kidney-shaped; turgor pressure bulges their thin outer walls outward, pulling apart the thick inner walls to open the pore." :
       "In grasses and other monocots, guard cells are dumb-bell shaped, with bulbous ends inflating to swing open the central thickened necks.")
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Vascular Bundle Architecture (vascularbundlesim)
// -------------------------------------------------------------------------
window.SIMS.vascularbundlesim = (function(){
  var bType = "conjoint_open"; // "radial", "conjoint_open", "conjoint_closed"

  function setB(b){ bType = b; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Xylem (Water/Minerals)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Phloem (Assimilates)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Intrafascicular Cambium</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-c-open">Conjoint Open (Dicot Stem)</button>' +
      '<button class="preset-btn" id="p-c-close">Conjoint Closed (Monocot Stem)</button>' +
      '<button class="preset-btn" id="p-rad">Radial Arrangement (All Roots)</button>';

    document.getElementById("p-c-open").onclick = function(){ setActivePreset(this); setB("conjoint_open"); };
    document.getElementById("p-c-close").onclick = function(){ setActivePreset(this); setB("conjoint_closed"); };
    document.getElementById("p-rad").onclick = function(){ setActivePreset(this); setB("radial"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>NCERT Fig 6.5: Types of Vascular Bundles</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Radial (alternating radii in roots) vs Conjoint Open (cambium present in dicot stems) vs Conjoint Closed (monocot stems).</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="vbBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#vbBg)" rx="10"/>';

    // Diagram on Left (x: 25 to 355)
    m += '<rect x="25" y="25" width="330" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
    var vbTitle = (bType === "conjoint_open" ? "Conjoint Open (Dicot Stem)" :
                   (bType === "conjoint_closed" ? "Conjoint Closed (Monocot Stem)" : "Radial Arrangement (Roots)"));
    m += '<text x="190" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">' + vbTitle + '</text>';

    var cx = 190, cy = 160;

    if(bType === "conjoint_open"){
      // Wedge-shaped bundle with cambium in middle
      m += '<path d="M 135,100 L 245,100 L 220,230 L 160,230 Z" fill="#0f172a" stroke="#475569" stroke-width="2"/>';

      // Phloem (top / outer, pink)
      m += '<path d="M 135,100 L 245,100 L 235,145 L 145,145 Z" fill="#9d174d" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="' + cx + '" y="128" fill="#fce7f3" font-size="11" font-weight="700" text-anchor="middle">Phloem (Outer)</text>';

      // Cambium stripe (middle, orange/amber)
      m += '<rect x="145" y="145" width="90" height="20" fill="#d97706" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="' + cx + '" y="160" fill="#fef3c7" font-size="10.5" font-weight="700" text-anchor="middle">Intrafascicular Cambium</text>';

      // Xylem (bottom / inner, blue)
      m += '<path d="M 145,165 L 235,165 L 220,230 L 160,230 Z" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="' + cx + '" y="200" fill="#e0f2fe" font-size="11" font-weight="700" text-anchor="middle">Xylem (Endarch)</text>';

      m += '<text x="' + cx + '" y="258" fill="#fcd34d" font-size="10.5" font-weight="700" text-anchor="middle">Competent for Secondary Growth</text>';

    } else if(bType === "conjoint_closed"){
      // Bundle without cambium; sclerenchymatous bundle sheath around it
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="55" ry="70" fill="#0f172a" stroke="#94a3b8" stroke-width="4"/>';
      m += '<text x="' + cx + '" y="80" fill="#94a3b8" font-size="9" font-weight="700" text-anchor="middle">Sclerenchymatous Sheath</text>';

      // Phloem (upper half)
      m += '<path d="M ' + (cx - 45) + ',' + (cy - 10) + ' C ' + (cx - 45) + ',' + (cy - 60) + ' ' + (cx + 45) + ',' + (cy - 60) + ' ' + (cx + 45) + ',' + (cy - 10) + ' Z" fill="#9d174d" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="' + cx + '" y="' + (cy - 25) + '" fill="#fce7f3" font-size="11" font-weight="700" text-anchor="middle">Phloem</text>';
      m += '<text x="' + cx + '" y="' + (cy - 12) + '" fill="#fbcfe8" font-size="8" text-anchor="middle">(No Parenchyma)</text>';

      // Direct junction line (NO cambium)
      m += '<line x1="' + (cx - 45) + '" y1="' + (cy - 10) + '" x2="' + (cx + 45) + '" y2="' + (cy - 10) + '" stroke="#ef4444" stroke-width="2"/>';

      // Xylem (lower half) with water cavity
      m += '<path d="M ' + (cx - 45) + ',' + (cy - 10) + ' C ' + (cx - 45) + ',' + (cy + 60) + ' ' + (cx + 45) + ',' + (cy + 60) + ' ' + (cx + 45) + ',' + (cy - 10) + ' Z" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>';
      // Large vessels (Y-shaped)
      m += '<circle cx="' + (cx - 18) + '" cy="' + (cy + 20) + '" r="10" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<circle cx="' + (cx + 18) + '" cy="' + (cy + 20) + '" r="10" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>';
      // Water-containing cavity at bottom
      m += '<circle cx="' + cx + '" cy="' + (cy + 45) + '" r="8" fill="#38bdf8"/>';
      m += '<text x="' + cx + '" y="' + (cy + 48) + '" fill="#020617" font-size="7" font-weight="700" text-anchor="middle">H2O</text>';

      m += '<text x="' + cx + '" y="258" fill="#ef4444" font-size="10.5" font-weight="700" text-anchor="middle">Closed: No Cambium Present</text>';

    } else {
      // Radial arrangement: Xylem and Phloem on alternating radii (circle)
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="75" fill="#0f172a" stroke="#10b981" stroke-width="2"/>';

      // 4 radial xylem arches (diarch/tetrarch)
      var xAngles = [0, 90, 180, 270];
      for(var xi = 0; xi < 4; xi++){
        var xrad = xAngles[xi] * Math.PI / 180;
        var xx = cx + Math.cos(xrad) * 45;
        var xy = cy + Math.sin(xrad) * 45;
        m += '<ellipse cx="' + xx + '" cy="' + xy + '" rx="12" ry="18" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" transform="rotate(' + xAngles[xi] + ' ' + xx + ' ' + xy + ')"/>';
        m += '<text x="' + xx + '" y="' + (xy + 4) + '" fill="#f8fafc" font-size="9" font-weight="700" text-anchor="middle">X</text>';
      }

      // 4 alternating phloem patches
      var pAngles = [45, 135, 225, 315];
      for(var pi = 0; pi < 4; pi++){
        var prad = pAngles[pi] * Math.PI / 180;
        var px = cx + Math.cos(prad) * 48;
        var py = cy + Math.sin(prad) * 48;
        m += '<circle cx="' + px + '" cy="' + py + '" r="10" fill="#9d174d" stroke="#ec4899" stroke-width="1.5"/>';
        m += '<text x="' + px + '" y="' + (py + 4) + '" fill="#fce7f3" font-size="9" font-weight="700" text-anchor="middle">P</text>';
      }

      m += '<text x="' + cx + '" y="258" fill="#10b981" font-size="10.5" font-weight="700" text-anchor="middle">Alternating Radii: Universal in Roots</text>';
    }

    // Right Explanation Card
    m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="395" y="55" fill="#38bdf8" font-size="13" font-weight="700">Vascular Topology Diagnostic</text>';
    if(bType === "conjoint_open"){
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Configuration:</strong> Xylem and phloem lie on the</text>';
      m += '<text x="395" y="100" fill="#cbd5e1" font-size="11">  same radius (conjoint &amp; collateral).</text>';
      m += '<text x="395" y="125" fill="#cbd5e1" font-size="11">• <strong>Intrafascicular Cambium:</strong> Present as a distinct</text>';
      m += '<text x="395" y="140" fill="#f59e0b" font-size="11" font-weight="700">  meristematic stripe between xylem &amp; phloem.</text>';
      m += '<text x="395" y="165" fill="#cbd5e1" font-size="11">• <strong>Secondary Growth:</strong> Capable of producing secondary</text>';
      m += '<text x="395" y="180" fill="#cbd5e1" font-size="11">  xylem inward and secondary phloem outward.</text>';
      m += '<text x="395" y="205" fill="#10b981" font-size="12" font-weight="700">NCERT Representative:</text>';
      m += '<text x="395" y="225" fill="#f8fafc" font-size="11">Dicotyledonous Stems (e.g. Sunflower)</text>';
    } else if(bType === "conjoint_closed"){
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Configuration:</strong> Xylem and phloem lie on the</text>';
      m += '<text x="395" y="100" fill="#cbd5e1" font-size="11">  same radius; cambium is COMPLETELY ABSENT.</text>';
      m += '<text x="395" y="125" fill="#cbd5e1" font-size="11">• <strong>Bundle Sheath:</strong> Surrounded by a protective</text>';
      m += '<text x="395" y="140" fill="#38bdf8" font-size="11" font-weight="700">  sclerenchymatous bundle sheath.</text>';
      m += '<text x="395" y="165" fill="#ef4444" font-size="11"><strong>Phloem parenchyma is completely absent!</strong></text>';
      m += '<text x="395" y="188" fill="#cbd5e1" font-size="11">• Features internal water-containing cavities.</text>';
      m += '<text x="395" y="215" fill="#10b981" font-size="12" font-weight="700">NCERT Representative:</text>';
      m += '<text x="395" y="235" fill="#f8fafc" font-size="11">Monocotyledonous Stems &amp; Leaves (e.g. Maize)</text>';
    } else {
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Configuration:</strong> Xylem and phloem strands</text>';
      m += '<text x="395" y="100" fill="#cbd5e1" font-size="11">  lie on <strong>alternating radii</strong> separated by parenchyma.</text>';
      m += '<text x="395" y="125" fill="#cbd5e1" font-size="11">• <strong>Primary Xylem Polarity:</strong> Always <strong>exarch</strong></text>';
      m += '<text x="395" y="140" fill="#38bdf8" font-size="11" font-weight="700">  (protoxylem outer, metaxylem inner).</text>';
      m += '<text x="395" y="165" fill="#cbd5e1" font-size="11">• Direct centripetal water absorption channel.</text>';
      m += '<text x="395" y="200" fill="#10b981" font-size="12" font-weight="700">NCERT Representative:</text>';
      m += '<text x="395" y="220" fill="#f8fafc" font-size="11">Roots of all Angiosperms (Dicot &amp; Monocot)</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Bundle Type", bType === "radial" ? "Radial" : (bType === "conjoint_open" ? "Conjoint Open" : "Conjoint Closed"), "#38bdf8") +
      cell("Cambium Status", bType === "conjoint_open" ? "PRESENT (Intrafascicular)" : "ABSENT", bType === "conjoint_open" ? "#10b981" : "#ef4444") +
      cell("Xylem Polarity", bType === "radial" ? "Exarch (Roots)" : "Endarch (Stems)", "#fcd34d") +
      cell("Organ Archetype", bType === "radial" ? "Roots" : (bType === "conjoint_open" ? "Dicot Stem" : "Monocot Stem"), "#10b981")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Vascular Axiom:</span> ' +
      (bType === "radial" ? "Radial vascular bundles have xylem and phloem on alternating radii, an absolute universal diagnostic for roots." :
       (bType === "conjoint_open" ? "Conjoint open vascular bundles possess intrafascicular cambium, conferring competence for secondary growth in dicot stems." :
        "Conjoint closed bundles lack cambium and phloem parenchyma, and are enclosed by sclerenchymatous bundle sheaths in monocots."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Dicot Root Radial Anatomy (dicotrootlab)
// -------------------------------------------------------------------------
window.SIMS.dicotrootlab = (function(){
  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Epiblema &amp; Root Hairs</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cortex Parenchyma</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Casparian Endodermis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fcd34d;"></span><span>Tetrarch Xylem Arches</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dr-anat">Dicot Root Anatomy (Tetrarch Stele)</button>';

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>NCERT Fig 6.6a: T.S. of Dicotyledonous Root (Sunflower / Gram)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Shows epiblema, multi-layered cortex, endodermis with Casparian strips, pericycle, 2–4 exarch xylem arches, and small pith.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="drBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#drBg)" rx="10"/>';

    // Diagram Box on Left
    m += '<rect x="25" y="25" width="340" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="195" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">NCERT Fig 6.6a: Dicot Root Cross-Section</text>';

    var cx = 195, cy = 160;

    // Epiblema outer ring with root hairs
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="85" fill="#0f172a" stroke="#10b981" stroke-width="2.5"/>';
    for(var rh = 0; rh < 12; rh++){
      var rhad = (rh * 30) * Math.PI / 180;
      var hx1 = cx + Math.cos(rhad) * 85;
      var hy1 = cy + Math.sin(rhad) * 85;
      var hx2 = cx + Math.cos(rhad) * 110;
      var hy2 = cy + Math.sin(rhad) * 110;
      m += '<line x1="' + hx1 + '" y1="' + hy1 + '" x2="' + hx2 + '" y2="' + hy2 + '" stroke="#a7f3d0" stroke-width="2"/>';
    }

    // Cortex (broad parenchymatous band)
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="75" fill="#0284c7" opacity="0.2"/>';

    // Endodermis ring with Casparian strips (red ring)
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="45" fill="#0f172a" stroke="#ef4444" stroke-width="3"/>';

    // Pericycle layer (green ring)
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="40" fill="none" stroke="#10b981" stroke-width="1.5"/>';

    // 4 radial xylem arches (Tetrarch, exarch: small protoxylem outer, large metaxylem inner)
    var angles = [0, 90, 180, 270];
    for(var i = 0; i < 4; i++){
      var rad = angles[i] * Math.PI / 180;
      var px1 = cx + Math.cos(rad) * 35; // protoxylem outer
      var py1 = cy + Math.sin(rad) * 35;
      var mx1 = cx + Math.cos(rad) * 18; // metaxylem inner
      var my1 = cy + Math.sin(rad) * 18;
      m += '<circle cx="' + px1 + '" cy="' + py1 + '" r="4" fill="#38bdf8"/>'; // protoxylem
      m += '<circle cx="' + mx1 + '" cy="' + my1 + '" r="7" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>'; // metaxylem
    }

    // 4 alternating phloem patches
    var pAngles = [45, 135, 225, 315];
    for(var pi = 0; pi < 4; pi++){
      var prad = pAngles[pi] * Math.PI / 180;
      var phx = cx + Math.cos(prad) * 26;
      var phy = cy + Math.sin(prad) * 26;
      m += '<circle cx="' + phx + '" cy="' + phy + '" r="6" fill="#ec4899"/>';
    }

    // Tiny inconspicuous pith in center
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#94a3b8"/>';

    m += '<text x="195" y="278" fill="#fcd34d" font-size="10.5" font-weight="700" text-anchor="middle">Tetrarch Exarch Stele + Casparian Band</text>';

    // Right Explanation Card
    m += '<rect x="385" y="25" width="290" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="405" y="55" fill="#10b981" font-size="13" font-weight="700">Dicot Root Anatomical Blueprint</text>';
    m += '<text x="405" y="85" fill="#cbd5e1" font-size="11">1. <strong>Epiblema:</strong> Single layer bearing unicellular</text>';
    m += '<text x="405" y="100" fill="#cbd5e1" font-size="11">   root hairs; cuticle completely absent.</text>';
    m += '<text x="405" y="125" fill="#cbd5e1" font-size="11">2. <strong>Cortex:</strong> Multi-layered thin parenchymatous cells</text>';
    m += '<text x="405" y="140" fill="#cbd5e1" font-size="11">   with conspicuous intercellular spaces.</text>';
    m += '<text x="405" y="165" fill="#cbd5e1" font-size="11">3. <strong>Endodermis:</strong> Barrel cells with suberized</text>';
    m += '<text x="405" y="180" fill="#ef4444" font-size="11" font-weight="700">   Casparian strips (blocks apoplast flux).</text>';
    m += '<text x="405" y="205" fill="#cbd5e1" font-size="11">4. <strong>Pericycle:</strong> Initiates lateral roots &amp; cambium.</text>';
    m += '<text x="405" y="225" fill="#cbd5e1" font-size="11">5. <strong>Xylem &amp; Pith:</strong> 2–4 xylem arches (tetrarch),</text>';
    m += '<text x="405" y="240" fill="#38bdf8" font-size="11" font-weight="700">   exarch polarity; pith small / inconspicuous.</text>';

    svg.innerHTML = m;

    readout(
      cell("Xylem Arches", "2–4 (Diarch–Tetrarch)", "#38bdf8") +
      cell("Xylem Polarity", "Exarch (Protoxylem Outer)", "#10b981") +
      cell("Endodermis", "Casparian Suberin Strips", "#ef4444") +
      cell("Pith Size", "Small / Inconspicuous", "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Dicot Root Diagnosis:</span> ' +
      "Diagnosed by 2 to 4 exarch radial xylem arches, suberized Casparian endodermis, pericycle producing lateral root primordia, and an inconspicuous central pith."
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Comparative Dicot vs Monocot Root (rootcomparisonsim)
// -------------------------------------------------------------------------
window.SIMS.rootcomparisonsim = (function(){
  var rMode = "compare"; // "dicot", "monocot", "compare"

  function setR(r){ rMode = r; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Dicot Root (2–4 Arches)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Monocot Root (&gt;6 Polyarch)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fcd34d;"></span><span>Pith Anatomy</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-rc-comp">Side-by-Side Comparison</button>' +
      '<button class="preset-btn" id="p-rc-d">Dicot Root (Sunflower/Gram)</button>' +
      '<button class="preset-btn" id="p-rc-m">Monocot Root (Maize/Wheat)</button>';

    document.getElementById("p-rc-comp").onclick = function(){ setActivePreset(this); setR("compare"); };
    document.getElementById("p-rc-d").onclick = function(){ setActivePreset(this); setR("dicot"); };
    document.getElementById("p-rc-m").onclick = function(){ setActivePreset(this); setR("monocot"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Exercise 6.1a: Monocot Root vs Dicot Root Anatomy</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Contrasting xylem bundle number (diarch/tetrarch vs polyarch), pith development, and secondary growth competence.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="rcBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#rcBg)" rx="10"/>';

    if(rMode === "compare"){
      // Side-by-side Dicot vs Monocot Root
      // Left: Dicot Root Stele (x: 25 to 335)
      m += '<rect x="25" y="25" width="310" height="270" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="180" y="50" fill="#10b981" font-size="12.5" font-weight="700" text-anchor="middle">Dicot Root (Diarch / Tetrarch)</text>';

      var cx1 = 180, cy1 = 145;
      m += '<circle cx="' + cx1 + '" cy="' + cy1 + '" r="65" fill="#0f172a" stroke="#10b981" stroke-width="2"/>';
      m += '<circle cx="' + cx1 + '" cy="' + cy1 + '" r="35" fill="none" stroke="#ef4444" stroke-width="2"/>'; // endodermis

      // 4 xylem arches
      var dAngles = [0, 90, 180, 270];
      for(var di = 0; di < 4; di++){
        var drad = dAngles[di] * Math.PI / 180;
        m += '<circle cx="' + (cx1 + Math.cos(drad) * 26) + '" cy="' + (cy1 + Math.sin(drad) * 26) + '" r="4" fill="#38bdf8"/>';
        m += '<circle cx="' + (cx1 + Math.cos(drad) * 14) + '" cy="' + (cy1 + Math.sin(drad) * 14) + '" r="6" fill="#0284c7"/>';
      }
      m += '<circle cx="' + cx1 + '" cy="' + cy1 + '" r="4" fill="#94a3b8"/>'; // tiny pith

      m += '<text x="' + cx1 + '" y="235" fill="#cbd5e1" font-size="10.5" text-anchor="middle">2–4 Xylem Bundles</text>';
      m += '<text x="' + cx1 + '" y="255" fill="#fcd34d" font-size="10.5" text-anchor="middle">Pith Small / Inconspicuous</text>';
      m += '<text x="' + cx1 + '" y="275" fill="#10b981" font-size="10.5" font-weight="700" text-anchor="middle">Secondary Growth Present</text>';

      // Right: Monocot Root Stele (x: 365 to 675)
      m += '<rect x="365" y="25" width="310" height="270" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="520" y="50" fill="#38bdf8" font-size="12.5" font-weight="700" text-anchor="middle">Monocot Root (Polyarch &gt; 6)</text>';

      var cx2 = 520, cy2 = 145;
      m += '<circle cx="' + cx2 + '" cy="' + cy2 + '" r="65" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="' + cx2 + '" cy="' + cy2 + '" r="48" fill="none" stroke="#ef4444" stroke-width="2"/>';

      // 10 xylem arches in circle
      for(var mi = 0; mi < 10; mi++){
        var mrad = (mi * 36) * Math.PI / 180;
        m += '<circle cx="' + (cx2 + Math.cos(mrad) * 40) + '" cy="' + (cy2 + Math.sin(mrad) * 40) + '" r="3" fill="#38bdf8"/>';
        m += '<circle cx="' + (cx2 + Math.cos(mrad) * 32) + '" cy="' + (cy2 + Math.sin(mrad) * 32) + '" r="5" fill="#0284c7"/>';
      }
      // Large prominent pith (yellow)
      m += '<circle cx="' + cx2 + '" cy="' + cy2 + '" r="22" fill="#fef08a" opacity="0.4" stroke="#fcd34d" stroke-width="1.5"/>';
      m += '<text x="' + cx2 + '" y="' + (cy2 + 4) + '" fill="#fcd34d" font-size="9" font-weight="700" text-anchor="middle">Large Pith</text>';

      m += '<text x="' + cx2 + '" y="235" fill="#cbd5e1" font-size="10.5" text-anchor="middle">&gt; 6 Xylem Bundles (Polyarch)</text>';
      m += '<text x="' + cx2 + '" y="255" fill="#fcd34d" font-size="10.5" text-anchor="middle">Pith Large &amp; Well-Developed</text>';
      m += '<text x="' + cx2 + '" y="275" fill="#ef4444" font-size="10.5" font-weight="700" text-anchor="middle">Secondary Growth ABSENT</text>';

    } else {
      // Single Focus View with Full Anatomy Matrix
      m += '<rect x="25" y="25" width="650" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="350" y="52" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">Exercise 6.1(a) Master Diagnostic Matrix</text>';

      var rows = [
        { feat: "Xylem Bundle Number", dicot: "2 to 4 (Diarch to Tetrarch)", mono: "More than 6 (Polyarch, 8–20+)" },
        { feat: "Central Pith", dicot: "Small or completely absent", mono: "Large, prominent, well-developed" },
        { feat: "Cortex Extent", dicot: "Narrower parenchymatous zone", mono: "Relatively broader cortex" },
        { feat: "Cambium Formation", dicot: "Forms from pericycle & conjunctive tissue", mono: "Completely absent" },
        { feat: "Secondary Growth", dicot: "Present (Annual rings & periderm)", mono: "Strictly absent" },
        { feat: "NCERT Examples", dicot: "Sunflower, Gram, Pea (Dicots)", mono: "Maize, Wheat, Grasses (Monocots)" }
      ];

      var curY = 82;
      for(var r = 0; r < rows.length; r++){
        var row = rows[r];
        m += '<rect x="45" y="' + (curY - 14) + '" width="610" height="27" rx="4" fill="' + (r % 2 === 0 ? "#0f172a" : "#1e293b") + '"/>';
        m += '<text x="60" y="' + curY + '" fill="#94a3b8" font-size="10.5" font-weight="700">' + row.feat + ':</text>';
        m += '<text x="240" y="' + curY + '" fill="#10b981" font-size="10.5" font-weight="600">' + row.dicot + '</text>';
        m += '<text x="460" y="' + curY + '" fill="#38bdf8" font-size="10.5" font-weight="600">' + row.mono + '</text>';
        curY += 31;
      }
    }

    svg.innerHTML = m;

    readout(
      cell("Dicot Xylem", "2–4 Bundles (Tetrarch)", "#10b981") +
      cell("Monocot Xylem", "> 6 Bundles (Polyarch)", "#38bdf8") +
      cell("Pith Dichotomy", "Small (Dicot) vs Large (Monocot)", "#fcd34d") +
      cell("Secondary Growth", "Dicot: YES | Monocot: NO", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 6.1a Rule:</span> ' +
      "Dicot roots are distinguished by 2 to 4 xylem arches and an inconspicuous pith with secondary growth competence, whereas monocot roots are polyarch (>6 bundles) with a large, well-developed pith and no secondary growth."
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Dicot Stem Anatomy & Sector (dicotstemsim)
// -------------------------------------------------------------------------
window.SIMS.dicotstemsim = (function(){
  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Collenchymatous Hypodermis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Starch Sheath (Endodermis)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Sclerenchyma Pericycle Patch</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Conjoint Open Bundle (Ring)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ds-wedge">Dicot Stem Wedge Sector (NCERT Fig 6.7a)</button>';

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>T.S. of Dicotyledonous Stem (Sunflower)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Diagnostic zonation: Epidermis with trichomes, collenchymatous hypodermis, starch sheath, pericycle patches, ring of open vascular bundles, and large central pith.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="dsBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#dsBg)" rx="10"/>';

    // Wedge diagram on Left (x: 25 to 345)
    m += '<rect x="25" y="25" width="330" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="190" y="48" fill="#38bdf8" font-size="12.5" font-weight="700" text-anchor="middle">NCERT Fig 6.7a: Dicot Stem Sector</text>';

    // Outermost Epidermis with multicellular trichomes (y: 65)
    m += '<rect x="55" y="65" width="270" height="12" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';
    // Trichomes protruding
    m += '<line x1="110" y1="65" x2="105" y2="48" stroke="#34d399" stroke-width="2.5"/>';
    m += '<line x1="200" y1="65" x2="200" y2="45" stroke="#34d399" stroke-width="2.5"/>';
    m += '<line x1="270" y1="65" x2="275" y2="48" stroke="#34d399" stroke-width="2.5"/>';
    m += '<text x="330" y="74" fill="#34d399" font-size="8.5">Cuticle + Epidermis</text>';

    // Hypodermis (Collenchyma, 3-4 layers, y: 77 to 105)
    m += '<rect x="55" y="77" width="270" height="28" fill="#15803d" stroke="#22c55e" stroke-width="1"/>';
    m += '<text x="190" y="95" fill="#f0fdf4" font-size="10" font-weight="700" text-anchor="middle">Collenchymatous Hypodermis</text>';

    // General Cortex (Parenchyma, y: 105 to 138)
    m += '<rect x="55" y="105" width="270" height="33" fill="#0284c7" opacity="0.25" stroke="#38bdf8" stroke-width="1"/>';
    m += '<text x="190" y="125" fill="#bae6fd" font-size="10" font-weight="600" text-anchor="middle">Parenchymatous Cortex</text>';

    // Endodermis / Starch Sheath (y: 138 to 150)
    m += '<rect x="55" y="138" width="270" height="12" fill="#d97706" stroke="#f59e0b" stroke-width="1.5"/>';
    m += '<text x="190" y="147" fill="#fef3c7" font-size="8.5" font-weight="700" text-anchor="middle">Endodermis (Starch Sheath)</text>';

    // Pericycle Semilunar Sclerenchyma Patches (y: 152 to 175)
    m += '<path d="M 120,152 Q 190,180 260,152 Z" fill="#9d174d" stroke="#ec4899" stroke-width="1.5"/>';
    m += '<text x="190" y="166" fill="#fce7f3" font-size="9" font-weight="700" text-anchor="middle">Sclerenchyma Pericycle</text>';

    // Conjoint Open Vascular Bundle (y: 175 to 240)
    // Phloem
    m += '<rect x="145" y="175" width="90" height="18" fill="#ec4899" opacity="0.5"/>';
    m += '<text x="190" y="188" fill="#fce7f3" font-size="9" text-anchor="middle">Phloem</text>';
    // Cambium stripe
    m += '<rect x="145" y="193" width="90" height="10" fill="#f59e0b"/>';
    m += '<text x="190" y="201" fill="#020617" font-size="8" font-weight="700" text-anchor="middle">Cambium</text>';
    // Xylem (endarch: protoxylem bottom)
    m += '<rect x="145" y="203" width="90" height="37" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="190" y="222" fill="#e0f2fe" font-size="9.5" text-anchor="middle">Endarch Xylem</text>';

    // Medullary Rays & Central Pith
    m += '<rect x="55" y="240" width="270" height="40" fill="#334155" opacity="0.4"/>';
    m += '<text x="190" y="265" fill="#fcd34d" font-size="11" font-weight="700" text-anchor="middle">Large Central Pith (Parenchyma)</text>';

    // Right Explanation Card
    m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="395" y="52" fill="#fcd34d" font-size="13" font-weight="700">Dicot Stem Diagnostic Hallmarks</text>';
    m += '<text x="395" y="80" fill="#cbd5e1" font-size="10.5">1. <strong style="color:#22c55e">Hypodermis:</strong> <strong>Collenchymatous</strong> cells</text>';
    m += '<text x="395" y="95" fill="#cbd5e1" font-size="10.5">   providing tensile mechanical flexibility.</text>';
    m += '<text x="395" y="120" fill="#cbd5e1" font-size="10.5">2. <strong style="color:#f59e0b">Endodermis:</strong> Loaded with starch grains;</text>';
    m += '<text x="395" y="135" fill="#cbd5e1" font-size="10.5">   specifically termed the <strong>Starch Sheath</strong>.</text>';
    m += '<text x="395" y="160" fill="#cbd5e1" font-size="10.5">3. <strong style="color:#ec4899">Pericycle:</strong> Characterized by semilunar</text>';
    m += '<text x="395" y="175" fill="#cbd5e1" font-size="10.5">   patches of sclerenchyma capping phloem.</text>';
    m += '<text x="395" y="200" fill="#cbd5e1" font-size="10.5">4. <strong style="color:#38bdf8">Ring of Vascular Bundles:</strong> Conjoint, collateral,</text>';
    m += '<text x="395" y="215" fill="#38bdf8" font-size="10.5" font-weight="700">   OPEN (cambium present); Endarch xylem.</text>';
    m += '<text x="395" y="240" fill="#cbd5e1" font-size="10.5">5. <strong>Pith:</strong> Large central parenchymatous core.</text>';

    svg.innerHTML = m;

    readout(
      cell("Hypodermis", "Collenchyma (Flexible Support)", "#22c55e") +
      cell("Endodermis", "Starch Sheath", "#f59e0b") +
      cell("Bundle Topology", "Ring Arrangement (Open)", "#38bdf8") +
      cell("Xylem Polarity", "Endarch (Protoxylem Inner)", "#10b981")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Dicot Stem Rule:</span> ' +
      "Diagnosed by a collenchymatous hypodermis, a starch sheath endodermis, pericycle semilunar patches, and an orderly ring of conjoint open vascular bundles surrounding a large pith."
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Monocot Stem Anatomy (monocotstemsim)
// -------------------------------------------------------------------------
window.SIMS.monocotstemsim = (function(){
  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Sclerenchymatous Hypodermis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Undifferentiated Ground Tissue</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Scattered Closed Bundles</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Bundle Sheath</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ms-anat">Monocot Stem Cross-Section (Maize)</button>';

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>NCERT Fig 6.7b: T.S. of Monocotyledonous Stem (Maize)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Shows sclerenchymatous hypodermis, uniform ground tissue, scattered closed bundles with bundle sheaths, and lysigenous water cavities.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="msBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#msBg)" rx="10"/>';

    // Diagram Box on Left
    m += '<rect x="25" y="25" width="330" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="190" y="48" fill="#38bdf8" font-size="12.5" font-weight="700" text-anchor="middle">NCERT Fig 6.7b: Monocot Stem (Maize)</text>';

    var cx = 190, cy = 160;

    // Outer Epidermis + Sclerenchymatous Hypodermis (red outer ring)
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="85" fill="#0f172a" stroke="#ef4444" stroke-width="4"/>';
    m += '<text x="' + cx + '" y="68" fill="#ef4444" font-size="8.5" text-anchor="middle">Sclerenchymatous Hypodermis</text>';

    // Undifferentiated Ground Tissue (greenish tint)
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="81" fill="#065f46" opacity="0.15"/>';

    // Scattered vascular bundles: Peripheral (smaller, crowded)
    var pBundles = [
      [35, -55], [-35, -55], [60, -30], [-60, -30], [68, 10], [-68, 10],
      [55, 45], [-55, 45], [25, 65], [-25, 65]
    ];
    for(var pi = 0; pi < pBundles.length; pi++){
      var bx = cx + pBundles[pi][0];
      var by = cy + pBundles[pi][1];
      m += '<circle cx="' + bx + '" cy="' + by + '" r="6" fill="#0284c7" stroke="#ec4899" stroke-width="1.5"/>';
    }

    // Central vascular bundles: Larger, widely spaced
    var cBundles = [[-25, -15], [25, -15], [0, 15], [-25, 35], [25, 35]];
    for(var ci = 0; ci < cBundles.length; ci++){
      var cbx = cx + cBundles[ci][0];
      var cby = cy + cBundles[ci][1];
      m += '<ellipse cx="' + cbx + '" cy="' + cby + '" rx="11" ry="14" fill="#0369a1" stroke="#ec4899" stroke-width="2"/>';
      // Phloem top
      m += '<ellipse cx="' + cbx + '" cy="' + (cby - 5) + '" rx="8" ry="4" fill="#ec4899"/>';
      // Water cavity bottom
      m += '<circle cx="' + cbx + '" cy="' + (cby + 7) + '" r="3" fill="#38bdf8"/>';
    }

    m += '<text x="' + cx + '" y="278" fill="#fcd34d" font-size="10.5" font-weight="700" text-anchor="middle">Scattered Bundles with Sclerenchyma Sheaths</text>';

    // Right Explanation Card
    m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="395" y="52" fill="#38bdf8" font-size="13" font-weight="700">Monocot Stem Diagnostic Hallmarks</text>';
    m += '<text x="395" y="80" fill="#cbd5e1" font-size="10.5">1. <strong style="color:#ef4444">Hypodermis:</strong> Rigid <strong>sclerenchyma</strong>.</text>';
    m += '<text x="395" y="102" fill="#cbd5e1" font-size="10.5">2. <strong style="color:#10b981">Ground Tissue:</strong> Massive &amp; <strong>undifferentiated</strong>;</text>';
    m += '<text x="395" y="117" fill="#cbd5e1" font-size="10.5">   no distinct cortex, endodermis, pericycle, or pith.</text>';
    m += '<text x="395" y="142" fill="#cbd5e1" font-size="10.5">3. <strong style="color:#38bdf8">Vascular Bundles:</strong> <strong>Scattered</strong> throughout;</text>';
    m += '<text x="395" y="157" fill="#cbd5e1" font-size="10.5">   peripheral smaller &amp; denser; central larger.</text>';
    m += '<text x="395" y="182" fill="#cbd5e1" font-size="10.5">4. <strong style="color:#ec4899">Bundle Sheath:</strong> Each bundle enclosed by</text>';
    m += '<text x="395" y="197" fill="#cbd5e1" font-size="10.5">   a tough sclerenchymatous bundle sheath.</text>';
    m += '<text x="395" y="222" fill="#f43f5e" font-size="10.5" font-weight="700">5. Phloem parenchyma is COMPLETELY ABSENT!</text>';
    m += '<text x="395" y="242" fill="#fcd34d" font-size="10.5">Features water-containing lysigenous cavities</text>';

    svg.innerHTML = m;

    readout(
      cell("Hypodermis", "Sclerenchyma (Rigid)", "#ef4444") +
      cell("Ground Tissue", "Undifferentiated (Continuous)", "#10b981") +
      cell("Vascular Bundles", "Scattered, Closed (- Cambium)", "#38bdf8") +
      cell("Phloem Parenchyma", "COMPLETELY ABSENT", "#f43f5e")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Monocot Stem Rule:</span> ' +
      "Diagnosed by a sclerenchymatous hypodermis, undifferentiated ground tissue, scattered closed vascular bundles enclosed in sclerenchymatous sheaths, and complete absence of phloem parenchyma."
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Leaf Anatomy & Bulliform Rolling (leafanatomysim)
// -------------------------------------------------------------------------
window.SIMS.leafanatomysim = (function(){
  var lType = "dorsiventral"; // "dorsiventral", "isobilateral"
  var isStressed = false;

  function setL(l){ lType = l; draw(0); }
  function setS(s){ isStressed = s; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Palisade Mesophyll</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Spongy Mesophyll (Air Cavities)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Vascular Bundle &amp; Sheath</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Bulliform Cells</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-lf-dorsi">Dorsiventral Leaf (Dicot, Sunflower)</button>' +
      '<button class="preset-btn" id="p-lf-iso-t">Isobilateral Grass Leaf (Turgid Flat)</button>' +
      '<button class="preset-btn" id="p-lf-iso-f">Grass Leaf (Water Stress: Curled Inward)</button>';

    document.getElementById("p-lf-dorsi").onclick = function(){ setActivePreset(this); setL("dorsiventral"); setS(false); };
    document.getElementById("p-lf-iso-t").onclick = function(){ setActivePreset(this); setL("isobilateral"); setS(false); };
    document.getElementById("p-lf-iso-f").onclick = function(){ setActivePreset(this); setL("isobilateral"); setS(true); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>NCERT Fig 6.8: Dorsiventral vs Isobilateral Leaf Anatomy</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Contrasting bifacial mesophyll differentiation (palisade vs spongy) with isobilateral leaf bulliform motor cell rolling mechanics.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="lfBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#lfBg)" rx="10"/>';

    // Diagram Box on Left (x: 25 to 345)
    m += '<rect x="25" y="25" width="330" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';

    if(lType === "dorsiventral"){
      m += '<text x="190" y="48" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">NCERT Fig 6.8a: Dorsiventral (Dicot) Leaf</text>';

      // Adaxial (upper) epidermis with thick cuticle (y: 65)
      m += '<rect x="55" y="65" width="270" height="12" fill="#065f46" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="50" y="74" fill="#34d399" font-size="8" text-anchor="end">Adaxial Ep.</text>';

      // Palisade Mesophyll (columnar cells, y: 77 to 140)
      for(var pc = 55; pc <= 305; pc += 20){
        m += '<rect x="' + pc + '" y="77" width="18" height="60" rx="4" fill="#047857" stroke="#10b981" stroke-width="1.5"/>';
        // Chloroplasts inside palisade
        m += '<circle cx="' + (pc + 9) + '" cy="92" r="2.5" fill="#86efac"/>';
        m += '<circle cx="' + (pc + 9) + '" cy="115" r="2.5" fill="#86efac"/>';
      }
      m += '<text x="330" y="105" fill="#10b981" font-size="8.5">Palisade</text>';

      // Spongy Mesophyll with vast air cavities (y: 140 to 220)
      m += '<rect x="55" y="140" width="270" height="78" fill="#0284c7" opacity="0.15"/>';
      // Loose rounded spongy cells
      var sCells = [
        [75, 155], [120, 160], [250, 155], [300, 160],
        [85, 195], [130, 200], [240, 195], [290, 200]
      ];
      for(var sci = 0; sci < sCells.length; sci++){
        m += '<ellipse cx="' + sCells[sci][0] + '" cy="' + sCells[sci][1] + '" rx="16" ry="12" fill="#047857" stroke="#34d399" stroke-width="1.5"/>';
      }
      m += '<text x="190" y="150" fill="#38bdf8" font-size="8.5" text-anchor="middle">Air Cavities</text>';

      // Central Vascular Bundle enclosed in bundle sheath
      m += '<circle cx="190" cy="180" r="24" fill="#0f172a" stroke="#ec4899" stroke-width="2.5"/>';
      m += '<text x="190" y="172" fill="#38bdf8" font-size="8" font-weight="700" text-anchor="middle">Xylem (Adaxial)</text>';
      m += '<text x="190" y="188" fill="#ec4899" font-size="8" font-weight="700" text-anchor="middle">Phloem (Abaxial)</text>';

      // Abaxial (lower) epidermis with stomata (y: 218)
      m += '<rect x="55" y="218" width="95" height="12" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';
      // Stomatal pore opening
      m += '<rect x="150" y="218" width="16" height="12" fill="#ec4899" opacity="0.6"/>';
      m += '<rect x="166" y="218" width="159" height="12" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="50" y="227" fill="#34d399" font-size="8" text-anchor="end">Abaxial Ep.</text>';
      m += '<text x="158" y="242" fill="#ec4899" font-size="8" text-anchor="middle">Stoma</text>';

      m += '<text x="190" y="275" fill="#fcd34d" font-size="10.5" font-weight="700" text-anchor="middle">Bifacial Mesophyll (Palisade + Spongy)</text>';

    } else {
      // Isobilateral Leaf (Monocot / Grass)
      m += '<text x="190" y="48" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">NCERT Fig 6.8b: Isobilateral Grass Leaf</text>';

      if(!isStressed){
        // Flat, turgid leaf
        // Adaxial epidermis with BULLIFORM cells in middle
        m += '<rect x="55" y="65" width="100" height="12" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';
        // 3 large empty bubble-like Bulliform cells
        m += '<circle cx="170" cy="68" r="14" fill="#fef08a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<circle cx="195" cy="68" r="16" fill="#fef08a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<circle cx="220" cy="68" r="14" fill="#fef08a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<text x="195" y="50" fill="#f59e0b" font-size="8.5" font-weight="700" text-anchor="middle">Bulliform Cells (Turgid)</text>';
        m += '<rect x="235" y="65" width="90" height="12" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';

        // Uniform undifferentiated mesophyll (y: 85 to 215)
        for(var rxi = 65; rxi <= 315; rxi += 28){
          for(var ryi = 100; ryi <= 190; ryi += 30){
            m += '<circle cx="' + rxi + '" cy="' + ryi + '" r="11" fill="#047857" stroke="#34d399" stroke-width="1.5"/>';
          }
        }
        // Vascular bundle in center
        m += '<circle cx="140" cy="145" r="18" fill="#0f172a" stroke="#ec4899" stroke-width="2"/>';
        m += '<circle cx="250" cy="145" r="18" fill="#0f172a" stroke="#ec4899" stroke-width="2"/>';

        // Abaxial epidermis with equal stomata
        m += '<rect x="55" y="215" width="270" height="12" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';
        m += '<text x="190" y="275" fill="#10b981" font-size="10.5" font-weight="700" text-anchor="middle">Leaf Blade Flat: Full Sunlight Interception</text>';

      } else {
        // Water stress: Bulliform cells flaccid -> Leaf curled inwards into cylinder
        m += '<path d="M 190,70 C 100,70 90,220 190,220 C 230,220 250,180 230,145 C 210,110 160,110 160,145 C 160,175 190,175 190,155" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>';
        m += '<text x="190" y="140" fill="#fcd34d" font-size="11" font-weight="700" text-anchor="middle">Inward Curled Cylinder</text>';
        m += '<text x="190" y="255" fill="#f87171" font-size="10" text-anchor="middle">Flaccid Bulliform Cells Minimize Surface Transpiration</text>';
      }
    }

    // Right Explanation Card
    m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="395" y="52" fill="#38bdf8" font-size="13" font-weight="700">Dorsiventral vs Isobilateral Diagnostics</text>';
    m += '<text x="395" y="80" fill="#cbd5e1" font-size="10.5">• <strong>Dorsiventral (Dicot) Leaf:</strong></text>';
    m += '<text x="395" y="96" fill="#10b981" font-size="10">  - Bifacial: Palisade (upper) + Spongy (lower)</text>';
    m += '<text x="395" y="112" fill="#10b981" font-size="10">  - Stomata mostly abaxial (hypostomatic)</text>';
    m += '<text x="395" y="128" fill="#10b981" font-size="10">  - Reticulate venation with varying bundle sizes</text>';
    m += '<text x="395" y="152" fill="#cbd5e1" font-size="10.5">• <strong>Isobilateral (Monocot) Leaf:</strong></text>';
    m += '<text x="395" y="168" fill="#38bdf8" font-size="10">  - Mesophyll is not differentiated into palisade/spongy</text>';
    m += '<text x="395" y="184" fill="#38bdf8" font-size="10">  - Stomata roughly equal on both sides (amphistomatic)</text>';
    m += '<text x="395" y="200" fill="#38bdf8" font-size="10">  - Parallel venation with uniform bundle sizes</text>';
    m += '<text x="395" y="224" fill="#f59e0b" font-size="10.5" font-weight="700">• Bulliform Cells in Grasses:</text>';
    m += '<text x="395" y="240" fill="#cbd5e1" font-size="10">  Large empty cells; flaccid during drought &rarr; curl leaf</text>';

    svg.innerHTML = m;

    readout(
      cell("Leaf Type", lType === "dorsiventral" ? "Dorsiventral (Dicot)" : "Isobilateral (Monocot)", "#38bdf8") +
      cell("Mesophyll", lType === "dorsiventral" ? "Bifacial (Palisade + Spongy)" : "Uniform Undifferentiated", "#10b981") +
      cell("Stomatal Ratio", lType === "dorsiventral" ? "Hypostomatic (Abaxial)" : "Amphistomatic (Equal)", "#fcd34d") +
      cell("Bulliform Cells", lType === "isobilateral" ? (isStressed ? "Flaccid (Curled)" : "Turgid (Flat)") : "ABSENT", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Leaf Anatomy Rule:</span> ' +
      (lType === "dorsiventral" ? "Dorsiventral dicot leaves feature bifacial mesophyll differentiation into upper light-capturing palisade parenchyma and lower aerating spongy parenchyma." :
       "Isobilateral grass leaves possess uniform mesophyll and adaxial bulliform motor cells that lose turgor under water deficit to curl the leaf and prevent transpiration.")
    );
  }

  return { mount: mount, draw: draw };
})();
