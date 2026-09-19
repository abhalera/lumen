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
// 1. Stomatal Apparatus Bench (stomatalab)
// §6.1.1 (pp. 71-72): guard cells, pore, subsidiary cells (Fig. 6.1).
// -------------------------------------------------------------------------
window.SIMS.stomatalab = (function(){
  var stomMode = "open"; // "open", "closed", "grass"

  function setS(v){
    stomMode = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Guard Cells (chloroplasts)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#e2e8f0;"></span><span>Subsidiary + Epidermal Cells</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Stomatal Pore</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-open">Open (Bean)</button>' +
      '<button class="preset-btn" id="p-closed">Closed (Bean)</button>' +
      '<button class="preset-btn" id="p-grass">Grass (Dumb-bell)</button>';

    document.getElementById("p-open").onclick = function(){ setActivePreset(this); setS("open"); };
    document.getElementById("p-closed").onclick = function(){ setActivePreset(this); setS("closed"); };
    document.getElementById("p-grass").onclick = function(){ setActivePreset(this); setS("grass"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Apparatus (§6.1.1):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Aperture + 2 guard cells + subsidiary cells.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Wall rule: <b style="color:#38bdf8;">outer thin, inner thick</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Regulates transpiration + gaseous exchange.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Stomatal Apparatus (Fig. 6.1)</text>';

    // epidermal background cells
    var bx = [50, 130, 310, 360];
    for(var e = 0; e < 4; e++){
      m += '<rect x="' + bx[e] + '" y="70" width="60" height="44" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>';
      m += '<rect x="' + bx[e] + '" y="206" width="60" height="44" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>';
    }
    m += '<text x="80" y="95" fill="#64748b" font-size="10">epidermal</text>';
    // subsidiary cells flanking
    m += '<rect x="130" y="125" width="60" height="70" rx="10" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>';
    m += '<rect x="280" y="125" width="60" height="70" rx="10" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>';
    m += '<text x="140" y="145" fill="#cbd5e1" font-size="9">subsidiary</text>';
    m += '<text x="290" y="145" fill="#cbd5e1" font-size="9">subsidiary</text>';

    if(stomMode === "grass"){
      m += '<rect x="195" y="132" width="80" height="14" rx="7" fill="#14532d" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<rect x="195" y="174" width="80" height="14" rx="7" fill="#14532d" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<circle cx="195" cy="139" r="13" fill="#14532d" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<circle cx="275" cy="139" r="13" fill="#14532d" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<circle cx="195" cy="181" r="13" fill="#14532d" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<circle cx="275" cy="181" r="13" fill="#14532d" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<rect x="208" y="148" width="54" height="24" rx="4" fill="#38bdf8"/>';
      m += '<circle cx="195" cy="139" r="3" fill="#4ade80"/><circle cx="275" cy="181" r="3" fill="#4ade80"/>';
      m += '<text x="235" y="166" fill="#082f49" font-size="10" font-weight="700" text-anchor="middle">pore</text>';
      m += '<text x="235" y="270" fill="#4ade80" font-size="11" text-anchor="middle">dumb-bell guard cells (grasses)</text>';
    } else {
      var poreW = stomMode === "open" ? 26 : 6;
      var gl = 235 - poreW / 2 - 24, gr = 235 + poreW / 2 + 24;
      m += '<ellipse cx="' + gl + '" cy="160" rx="24" ry="52" fill="#14532d" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<ellipse cx="' + gr + '" cy="160" rx="24" ry="52" fill="#14532d" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<ellipse cx="235" cy="160" rx="' + (poreW / 2) + '" ry="38" fill="' + (stomMode === "open" ? "#38bdf8" : "#164e63") + '"/>';
      m += '<path d="M' + (235 - poreW / 2) + ',122 C' + (235 - poreW / 2 - 4) + ',145 ' + (235 - poreW / 2 - 4) + ',175 ' + (235 - poreW / 2) + ',198" fill="none" stroke="#052e16" stroke-width="5"/>';
      m += '<path d="M' + (235 + poreW / 2) + ',122 C' + (235 + poreW / 2 + 4) + ',145 ' + (235 + poreW / 2 + 4) + ',175 ' + (235 + poreW / 2) + ',198" fill="none" stroke="#052e16" stroke-width="5"/>';
      m += '<circle cx="' + (gl - 8) + '" cy="140" r="3.5" fill="#4ade80"/><circle cx="' + (gl - 8) + '" cy="180" r="3.5" fill="#4ade80"/>';
      m += '<circle cx="' + (gr + 8) + '" cy="140" r="3.5" fill="#4ade80"/><circle cx="' + (gr + 8) + '" cy="180" r="3.5" fill="#4ade80"/>';
      m += '<text x="235" y="270" fill="' + (stomMode === "open" ? "#38bdf8" : "#64748b") + '" font-size="11" text-anchor="middle">' +
        (stomMode === "open" ? "pore open: exchange running" : "pore closed: exchange paused") + '</text>';
      m += '<text x="60" y="270" fill="#94a3b8" font-size="10">green dots = chloroplasts</text>';
    }
    m += '<text x="380" y="292" fill="#64748b" font-size="10">dark rims = thick inner walls</text>';

    // RIGHT: parts key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Three Parts</text>';
    var rows = [
      ["Aperture", "the pore itself", "#38bdf8"],
      ["2 guard cells", stomMode === "grass" ? "dumb-bell (grasses)" : "bean-shaped + chloroplasts", "#22c55e"],
      ["Subsidiary cells", "specialised neighbours", "#94a3b8"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var shape = stomMode === "grass" ? "DUMB-BELL" : "BEAN-SHAPED";
    var pore = stomMode === "closed" ? "CLOSED" : "OPEN";
    readout(
      cell("Guard Cells", shape, "#22c55e") +
      cell("Pore", pore, "#38bdf8") +
      cell("Walls", "Outer thin / inner thick", "#f59e0b") +
      cell("Job", "Transpiration + exchange", "#10b981")
    );

    verdict(
      '<span style="color:#22c55e;font-weight:700;">§6.1.1 Apparatus:</span> ' +
      (stomMode === "grass" ? "Grasses use dumb-bell guard cells around the pore." :
       "Two bean-shaped chloroplast guard cells enclose the pore.") +
      ' Aperture + guard + subsidiary cells form the apparatus.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. Vascular Bundle Sorter (bundletypelab)
// §6.1.3 (p. 73): open / closed × radial / conjoint (Fig. 6.2).
// -------------------------------------------------------------------------
window.SIMS.bundletypelab = (function(){
  var bunMode = "radial"; // "radial", "closed", "open"

  function setB(v){
    bunMode = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#dc2626;"></span><span>Xylem</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#1d4ed8;"></span><span>Phloem</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Cambium (open only)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-radial">Radial (Roots)</button>' +
      '<button class="preset-btn" id="p-closed">Conjoint Closed (Monocot)</button>' +
      '<button class="preset-btn" id="p-open">Conjoint Open (Dicot Stem)</button>';

    document.getElementById("p-radial").onclick = function(){ setActivePreset(this); setB("radial"); };
    document.getElementById("p-closed").onclick = function(){ setActivePreset(this); setB("closed"); };
    document.getElementById("p-open").onclick = function(){ setActivePreset(this); setB("open"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Two questions (§6.1.3):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cambium? (open/closed) Layout? (radial/conjoint)</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Conjoint rule: <b style="color:#38bdf8;">phloem outside xylem</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Same radius, outer side only.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Bundle Layout (Fig. 6.2)</text>';

    if(bunMode === "radial"){
      m += '<circle cx="220" cy="170" r="95" fill="#0f172a" stroke="#475569" stroke-width="2"/>';
      for(var i = 0; i < 4; i++){
        var a1 = (-90 + i * 90) * Math.PI / 180, a2 = (-90 + i * 90 + 45) * Math.PI / 180;
        m += '<line x1="220" y1="170" x2="' + (220 + Math.cos(a1) * 60) + '" y2="' + (170 + Math.sin(a1) * 60) + '" stroke="#dc2626" stroke-width="14" stroke-linecap="round"/>';
        m += '<circle cx="' + (220 + Math.cos(a2) * 62) + '" cy="' + (170 + Math.sin(a2) * 62) + '" r="14" fill="#1d4ed8"/>';
      }
      m += '<text x="220" y="180" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">stele</text>';
      m += '<text x="220" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">alternate radii: X — P — X — P (roots)</text>';
    } else {
      var hasCambium = (bunMode === "open");
      m += '<circle cx="220" cy="170" r="95" fill="#0f172a" stroke="#475569" stroke-width="2"/>';
      m += '<rect x="170" y="80" width="100" height="180" rx="14" fill="#0b1726" stroke="#334155" stroke-width="1.5"/>';
      m += '<ellipse cx="220" cy="115" rx="38" ry="28" fill="#1d4ed8"/>';
      m += '<text x="220" y="119" fill="#dbeafe" font-size="11" font-weight="700" text-anchor="middle">Phloem</text>';
      if(hasCambium){
        m += '<rect x="182" y="148" width="76" height="16" fill="#f59e0b"/>';
        m += '<text x="220" y="161" fill="#451a03" font-size="10" font-weight="700" text-anchor="middle">cambium</text>';
      } else {
        m += '<line x1="182" y1="156" x2="258" y2="156" stroke="#475569" stroke-width="2" stroke-dasharray="5 4"/>';
        m += '<text x="220" y="150" fill="#64748b" font-size="10" text-anchor="middle">no cambium</text>';
      }
      m += '<ellipse cx="220" cy="205" rx="38" ry="34" fill="#7f1d1d" stroke="#dc2626" stroke-width="2"/>';
      m += '<text x="220" y="209" fill="#fecaca" font-size="11" font-weight="700" text-anchor="middle">Xylem</text>';
      m += '<text x="220" y="66" fill="#94a3b8" font-size="10" text-anchor="middle">outside ↑</text>';
      m += '<text x="220" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">' +
        (hasCambium ? "same radius + cambium: open (dicot stems)" : "same radius, no cambium: closed (monocots)") + '</text>';
    }

    // RIGHT: sorter key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Fig. 6.2 Key</text>';
    var rows = [
      ["radial", "(a) Radial", "alternate radii · roots", "#dc2626"],
      ["closed", "(b) Conjoint closed", "same radius · monocots", "#38bdf8"],
      ["open", "(c) Conjoint open", "same radius + cambium", "#f59e0b"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      var on = (bunMode === rows[r][0]);
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="' + (on ? "#1e293b" : "#0f172a") + '" stroke="' + rows[r][3] + '" stroke-width="' + (on ? 3 : 1.5) + '"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][3] + '" font-size="11" font-weight="700" text-anchor="middle">' + rows[r][1] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][2] + '</text>';
    }

    svg.innerHTML = m;

    var lay = bunMode === "radial" ? "RADIAL" : "CONJOINT";
    var cam = bunMode === "open" ? "PRESENT (OPEN)" : (bunMode === "closed" ? "ABSENT (CLOSED)" : "ring later (dicot)");
    var where = bunMode === "radial" ? "Roots" : (bunMode === "closed" ? "Monocot stems" : "Dicot stems");
    readout(
      cell("Layout", lay, "#dc2626") +
      cell("Cambium", cam, "#f59e0b") +
      cell("Found In", where, "#38bdf8") +
      cell("Phloem", bunMode === "radial" ? "Alternating patches" : "Outside xylem", "#1d4ed8")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">§6.1.3 Bundles:</span> ' +
      (bunMode === "radial" ? "Xylem and phloem alternate on different radii (roots)." :
       (bunMode === "closed" ? "Jointly on one radius, no cambium — closed (monocots)." :
        "Jointly on one radius with cambium — open, secondary tissues possible."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. Root Section Comparator (rootcomparelab)
// §6.2-§6.2.2 (pp. 73-74): dicot vs monocot root (Fig. 6.3).
// -------------------------------------------------------------------------
window.SIMS.rootcomparelab = (function(){
  var rootMode = "dicot"; // "dicot", "monocot"

  function setR(v){
    rootMode = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#4ade80;"></span><span>Cortex + Layers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#dc2626;"></span><span>Xylem Patches</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#1d4ed8;"></span><span>Phloem Patches</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dicot">Dicot Root (Sunflower)</button>' +
      '<button class="preset-btn" id="p-monocot">Monocot Root (Polyarch)</button>';

    document.getElementById("p-dicot").onclick = function(){ setActivePreset(this); setR("dicot"); };
    document.getElementById("p-monocot").onclick = function(){ setActivePreset(this); setR("monocot"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Layer order (§6.2.1):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Epiblema → cortex → endodermis → pericycle → stele.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Print words: <b style="color:#38bdf8;">casparian · conjuctive</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Quoted exactly as the book prints them.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    var cx = 190, cy = 165;

    m += '<rect x="20" y="20" width="340" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Root T.S. (Fig. 6.3)</text>';

    var isDicot = (rootMode === "dicot");
    var steleR = isDicot ? 62 : 72;
    var pithR = isDicot ? 10 : 30;
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="120" fill="#0f172a" stroke="#4ade80" stroke-width="2.5"/>';
    // root hairs
    for(var h = 0; h < 8; h++){
      var ha = (-160 + h * 14) * Math.PI / 180;
      m += '<line x1="' + (cx + Math.cos(ha) * 120) + '" y1="' + (cy + Math.sin(ha) * 120) + '" x2="' + (cx + Math.cos(ha) * 138) + '" y2="' + (cy + Math.sin(ha) * 138) + '" stroke="#4ade80" stroke-width="2"/>';
    }
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="108" fill="none" stroke="#4ade80" stroke-width="1.5"/>';
    m += '<text x="' + cx + '" y="' + (cy - 128) + '" fill="#4ade80" font-size="10" text-anchor="middle">' + (isDicot ? "epiblema + root hairs" : "epidermis + root hairs") + '</text>';
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="86" fill="none" stroke="#a16207" stroke-width="2.5"/>';
    m += '<text x="' + (cx + 92) + '" y="' + (cy - 40) + '" fill="#4ade80" font-size="10">cortex</text>';
    m += '<text x="' + (cx + 92) + '" y="' + (cy - 26) + '" fill="#a16207" font-size="10">endodermis</text>';
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + steleR + '" fill="#172554" stroke="#38bdf8" stroke-width="2.5"/>';
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + pithR + '" fill="#fef9c3" stroke="#854d0e" stroke-width="1.5"/>';
    var nX = isDicot ? 4 : 8;
    for(var x = 0; x < nX; x++){
      var xa = (-90 + x * (360 / nX)) * Math.PI / 180;
      var xr = (steleR + pithR) / 2;
      m += '<circle cx="' + (cx + Math.cos(xa) * xr) + '" cy="' + (cy + Math.sin(xa) * xr) + '" r="' + (isDicot ? 11 : 8) + '" fill="#dc2626"/>';
      var pa = (-90 + x * (360 / nX) + 180 / nX) * Math.PI / 180;
      m += '<circle cx="' + (cx + Math.cos(pa) * xr) + '" cy="' + (cy + Math.sin(pa) * xr) + '" r="' + (isDicot ? 9 : 7) + '" fill="#1d4ed8"/>';
    }
    m += '<text x="' + cx + '" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">' +
      (isDicot ? "4 xylem patches · pith small · cambium ring later" : "8 xylem bundles (polyarch) · pith large · no 2nd growth") + '</text>';

    // RIGHT: compare table
    m += '<rect x="380" y="20" width="300" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="400" y="48" fill="#f8fafc" font-size="14" font-weight="700">Dicot vs Monocot</text>';
    var rows = [
      ["Xylem patches", isDicot ? "2–4" : ">6 (polyarch)"],
      ["Pith", isDicot ? "small / inconspicuous" : "large, well developed"],
      ["2nd growth", isDicot ? "cambium ring later" : "never"],
      ["Outer layers", "same plan both"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 66 + r * 56;
      m += '<rect x="400" y="' + ry + '" width="260" height="48" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="410" y="' + (ry + 20) + '" fill="#64748b" font-size="10">' + rows[r][0] + '</text>';
      m += '<text x="410" y="' + (ry + 38) + '" fill="#f8fafc" font-size="12" font-weight="700">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Root", isDicot ? "DICOT (SUNFLOWER)" : "MONOCOT", "#4ade80") +
      cell("Xylem", isDicot ? "2–4 patches" : ">6 (polyarch)", "#dc2626") +
      cell("Pith", isDicot ? "Small" : "Large", "#f59e0b") +
      cell("2nd Growth", isDicot ? "Cambium ring later" : "Never", "#38bdf8")
    );

    verdict(
      '<span style="color:#4ade80;font-weight:700;">§6.2 Roots:</span> ' +
      (isDicot ? "Two to four xylem–phloem patches, small pith, and a cambium ring develops later." :
        "Polyarch xylem, large pith, and no secondary growth ever.")
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. Dicot Stem Ring Builder (dicotstemlab)
// §6.2.3 (pp. 74-76): zoned cortex, ring of open bundles, pith (Fig. 6.4a).
// -------------------------------------------------------------------------
window.SIMS.dicotstemlab = (function(){
  var stemView = "ring"; // "ring", "sector", "cortex"

  function setV(v){
    stemView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#4ade80;"></span><span>Cortex Zones</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Cambium (open)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fef9c3;"></span><span>Pith + Rays</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ring">Full Ring</button>' +
      '<button class="preset-btn" id="p-sector">Bundle Sector</button>' +
      '<button class="preset-btn" id="p-cortex">Cortex Zones</button>';

    document.getElementById("p-ring").onclick = function(){ setActivePreset(this); setV("ring"); };
    document.getElementById("p-sector").onclick = function(){ setActivePreset(this); setV("sector"); };
    document.getElementById("p-cortex").onclick = function(){ setActivePreset(this); setV("cortex"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Dicot signature (§6.2.3):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Ring + open + endarch + rays + pith.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Pericycle: <b style="color:#38bdf8;">semi-lunar sclerenchyma</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Inside endodermis, above phloem.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    var cx = 220, cy = 165;

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Dicot Stem (Fig. 6.4a)</text>';

    if(stemView === "sector"){
      m += '<rect x="120" y="60" width="200" height="220" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>';
      var layers = [
        ["Epidermis + cuticle", "#4ade80"],
        ["Collenchyma (hypodermis)", "#22c55e"],
        ["Parenchyma layers", "#86efac"],
        ["Endodermis (starch sheath)", "#a16207"],
        ["Pericycle (sclerenchyma)", "#f59e0b"],
        ["Phloem", "#1d4ed8"],
        ["Cambium", "#fbbf24"],
        ["Metaxylem", "#dc2626"],
        ["Protoxylem (endarch)", "#7f1d1d"],
        ["Pith", "#fef9c3"]
      ];
      for(var l = 0; l < layers.length; l++){
        var ly = 70 + l * 20;
        m += '<rect x="130" y="' + ly + '" width="180" height="18" fill="' + layers[l][1] + '" opacity="0.85"/>';
        m += '<text x="140" y="' + (ly + 13) + '" fill="#0f172a" font-size="10" font-weight="700">' + layers[l][0] + '</text>';
      }
      m += '<text x="220" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">outside → centre: the open endarch stack</text>';
    } else if(stemView === "cortex"){
      var zones = [
        ["Hypodermis", "collenchymatous", "strength", "#22c55e"],
        ["Cortical parenchyma", "rounded, thin-walled", "spaces", "#86efac"],
        ["Endodermis", "starch sheath", "starch grains", "#a16207"]
      ];
      for(var z = 0; z < zones.length; z++){
        var zy = 66 + z * 72;
        m += '<rect x="60" y="' + zy + '" width="320" height="62" rx="8" fill="#0f172a" stroke="' + zones[z][3] + '" stroke-width="2"/>';
        m += '<text x="220" y="' + (zy + 24) + '" fill="' + zones[z][3] + '" font-size="13" font-weight="700" text-anchor="middle">' + zones[z][0] + '</text>';
        m += '<text x="220" y="' + (zy + 44) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + zones[z][1] + ' · ' + zones[z][2] + '</text>';
      }
      m += '<text x="220" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">three sub-zones: epidermis → pericycle</text>';
    } else {
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="120" fill="#0f172a" stroke="#4ade80" stroke-width="2.5"/>';
      for(var h = 0; h < 10; h++){
        var ha = (-170 + h * 13) * Math.PI / 180;
        m += '<line x1="' + (cx + Math.cos(ha) * 120) + '" y1="' + (cy + Math.sin(ha) * 120) + '" x2="' + (cx + Math.cos(ha) * 134) + '" y2="' + (cy + Math.sin(ha) * 134) + '" stroke="#4ade80" stroke-width="2"/>';
      }
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="108" fill="none" stroke="#22c55e" stroke-width="5"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="94" fill="none" stroke="#a16207" stroke-width="2"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="50" fill="#fef9c3" opacity="0.25"/>';
      for(var b = 0; b < 8; b++){
        var ba = (-90 + b * 45) * Math.PI / 180;
        var bxr = 72;
        var px = cx + Math.cos(ba) * bxr, py = cy + Math.sin(ba) * bxr;
        m += '<ellipse cx="' + px + '" cy="' + py + '" rx="13" ry="17" fill="#1d4ed8" transform="rotate(' + (-90 + b * 45 + 90) + ' ' + px + ' ' + py + ')"/>';
        m += '<rect x="' + (px - 8) + '" y="' + (py - 4) + '" width="16" height="5" fill="#f59e0b" transform="rotate(' + (-90 + b * 45 + 90) + ' ' + px + ' ' + py + ')"/>';
        m += '<circle cx="' + (cx + Math.cos(ba) * 60) + '" cy="' + (cy + Math.sin(ba) * 60) + '" r="6" fill="#dc2626"/>';
      }
      for(var r2 = 0; r2 < 8; r2++){
        var ra = (-90 + r2 * 45 + 22.5) * Math.PI / 180;
        m += '<line x1="' + (cx + Math.cos(ra) * 50) + '" y1="' + (cy + Math.sin(ra) * 50) + '" x2="' + (cx + Math.cos(ra) * 92) + '" y2="' + (cy + Math.sin(ra) * 92) + '" stroke="#fef9c3" stroke-width="2" stroke-dasharray="4 3"/>';
      }
      m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#fef9c3" font-size="11" font-weight="700" text-anchor="middle">pith</text>';
      m += '<text x="' + cx + '" y="292" fill="#f59e0b" font-size="11" text-anchor="middle">ring of 8 open bundles · dashed rays · central pith</text>';
    }

    // RIGHT: checklist
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Checklist</text>';
    var rows = [
      ["Cortex", "3 sub-zones", stemView === "cortex"],
      ["Bundles", "ring · open · endarch", stemView === "ring"],
      ["Sector", "phloem→protoxylem", stemView === "sector"],
      ["Centre", "rays + pith", stemView === "ring"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 66 + r * 56;
      m += '<rect x="460" y="' + ry + '" width="200" height="48" rx="6" fill="' + (rows[r][2] ? "#1e293b" : "#0f172a") + '" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="470" y="' + (ry + 20) + '" fill="#64748b" font-size="10">' + rows[r][0] + '</text>';
      m += '<text x="470" y="' + (ry + 38) + '" fill="#f8fafc" font-size="11" font-weight="700">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = stemView === "ring" ? "FULL RING" : (stemView === "sector" ? "BUNDLE SECTOR" : "CORTEX ZONES");
    readout(
      cell("View", vName, "#4ade80") +
      cell("Bundles", "Ring · open · endarch", "#f59e0b") +
      cell("Pericycle", "Semi-lunar sclerenchyma", "#38bdf8") +
      cell("Centre", "Rays + pith", "#fef9c3")
    );

    verdict(
      '<span style="color:#4ade80;font-weight:700;">§6.2.3 Dicot Stem:</span> ' +
      (stemView === "ring" ? "Bundles ringed, each conjoint open with endarch protoxylem; rays and pith within." :
       (stemView === "sector" ? "Outside-in: phloem, cambium, metaxylem, protoxylem — the open endarch stack." :
        "Hypodermis, parenchyma layers, starch-sheath endodermis — three sub-zones."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. Scattered Bundle Explorer (monocotstemlab)
// §6.2.4 (pp. 75-76): scattered closed sheathed bundles (Fig. 6.4b).
// -------------------------------------------------------------------------
window.SIMS.monocotstemlab = (function(){
  var monoView = "scatter"; // "scatter", "bundle", "gradient"

  function setM(v){
    monoView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#3f6212;"></span><span>Bundle Sheath</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#1d4ed8;"></span><span>Phloem (no parenchyma)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Water Cavities</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-scatter">Full Scatter</button>' +
      '<button class="preset-btn" id="p-bundle">One Closed Bundle</button>' +
      '<button class="preset-btn" id="p-gradient">Size Gradient</button>';

    document.getElementById("p-scatter").onclick = function(){ setActivePreset(this); setM("scatter"); };
    document.getElementById("p-bundle").onclick = function(){ setActivePreset(this); setM("bundle"); };
    document.getElementById("p-gradient").onclick = function(){ setActivePreset(this); setM("gradient"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Monocot signature (§6.2.4):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Scattered + closed + sheathed + ground tissue.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Missing: <b style="color:#38bdf8;">cambium + phloem parenchyma</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Present instead: water cavities.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    var cx = 220, cy = 165;

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Monocot Stem (Fig. 6.4b)</text>';

    function bundle(x, y, s){
      var s2 = '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (16 * s) + '" ry="' + (19 * s) + '" fill="none" stroke="#3f6212" stroke-width="2"/>';
      s2 += '<ellipse cx="' + x + '" cy="' + (y - 6 * s) + '" rx="' + (9 * s) + '" ry="' + (7 * s) + '" fill="#1d4ed8"/>';
      s2 += '<circle cx="' + (x - 5 * s) + '" cy="' + (y + 6 * s) + '" r="' + (5 * s) + '" fill="#dc2626"/>';
      s2 += '<circle cx="' + (x + 5 * s) + '" cy="' + (y + 6 * s) + '" r="' + (5 * s) + '" fill="#dc2626"/>';
      s2 += '<circle cx="' + x + '" cy="' + (y + 1 * s) + '" r="' + (3.5 * s) + '" fill="#38bdf8"/>';
      return s2;
    }

    if(monoView === "bundle"){
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="100" fill="#0f172a" stroke="#3f6212" stroke-width="4"/>';
      m += '<text x="' + cx + '" y="' + (cy - 104) + '" fill="#a3e635" font-size="10" text-anchor="middle">sclerenchymatous bundle sheath</text>';
      m += '<ellipse cx="' + cx + '" cy="' + (cy - 40) + '" rx="45" ry="30" fill="#1d4ed8"/>';
      m += '<text x="' + cx + '" y="' + (cy - 36) + '" fill="#dbeafe" font-size="11" font-weight="700" text-anchor="middle">Phloem</text>';
      m += '<text x="' + cx + '" y="' + (cy - 4) + '" fill="#ef4444" font-size="10" text-anchor="middle">no cambium · no phloem parenchyma</text>';
      m += '<circle cx="' + (cx - 28) + '" cy="' + (cy + 40) + '" r="22" fill="#7f1d1d" stroke="#dc2626" stroke-width="2"/>';
      m += '<circle cx="' + (cx + 28) + '" cy="' + (cy + 40) + '" r="22" fill="#7f1d1d" stroke="#dc2626" stroke-width="2"/>';
      m += '<text x="' + cx + '" y="' + (cy + 44) + '" fill="#fecaca" font-size="11" font-weight="700" text-anchor="middle">Xylem</text>';
      m += '<circle cx="' + cx + '" cy="' + (cy + 12) + '" r="12" fill="#38bdf8"/>';
      m += '<text x="' + cx + '" y="' + (cy + 78) + '" fill="#38bdf8" font-size="10" text-anchor="middle">water-containing cavity</text>';
      m += '<text x="' + cx + '" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">conjoint + closed: sheath outside, cavity within</text>';
    } else if(monoView === "gradient"){
      m += bundle(140, 165, 0.7);
      m += bundle(220, 165, 1.0);
      m += bundle(310, 165, 1.35);
      m += '<text x="140" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">peripheral</text>';
      m += '<text x="140" y="266" fill="#94a3b8" font-size="11" text-anchor="middle">smaller</text>';
      m += '<text x="310" y="250" fill="#a3e635" font-size="11" text-anchor="middle">central</text>';
      m += '<text x="310" y="266" fill="#a3e635" font-size="11" text-anchor="middle">larger</text>';
      m += '<line x1="170" y1="165" x2="280" y2="165" stroke="#64748b" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#arr)"/>';
      m += '<defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="none" stroke="#64748b" stroke-width="1.5"/></marker></defs>';
      m += '<text x="220" y="120" fill="#f8fafc" font-size="11" text-anchor="middle">edge → centre grows</text>';
      m += '<text x="' + cx + '" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">peripheral generally smaller than central</text>';
    } else {
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="120" fill="#1a2e05" opacity="0.6" stroke="#4ade80" stroke-width="2.5"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="110" fill="none" stroke="#3f6212" stroke-width="5"/>';
      m += '<text x="' + cx + '" y="' + (cy - 124) + '" fill="#a3e635" font-size="10" text-anchor="middle">sclerenchymatous hypodermis</text>';
      var spots = [[-60, -50, 1.1], [10, -62, 0.8], [70, -40, 0.8], [-85, 5, 0.7], [-30, -10, 1.2], [40, 0, 1.1], [90, 25, 0.7], [-55, 45, 1.0], [15, 40, 1.2], [70, 65, 0.8], [-15, 80, 0.7], [-90, -45, 0.65], [95, -60, 0.65]];
      for(var s = 0; s < spots.length; s++){
        m += bundle(cx + spots[s][0], cy + spots[s][1], spots[s][2]);
      }
      m += '<text x="' + cx + '" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">parenchymatous ground tissue throughout</text>';
    }

    // RIGHT: absent / present
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Absent / Present</text>';
    var rows = [
      ["ABSENT", "cambium · phloem parenchyma", "#ef4444"],
      ["PRESENT", "sheath · water cavities", "#22c55e"],
      ["LAYOUT", "scattered · gradient", "#38bdf8"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = monoView === "scatter" ? "FULL SCATTER" : (monoView === "bundle" ? "ONE BUNDLE" : "SIZE GRADIENT");
    readout(
      cell("View", vName, "#a3e635") +
      cell("Bundles", "Scattered · closed", "#38bdf8") +
      cell("Sheath", "Sclerenchymatous", "#22c55e") +
      cell("Matrix", "Ground tissue", "#f59e0b")
    );

    verdict(
      '<span style="color:#a3e635;font-weight:700;">§6.2.4 Monocot Stem:</span> ' +
      (monoView === "scatter" ? "Many scattered conjoint closed bundles in parenchymatous ground tissue." :
       (monoView === "bundle" ? "One bundle: sheath outside; no cambium, no phloem parenchyma; water cavity within." :
        "Peripheral bundles run smaller than the centrally located ones."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. Leaf Section Builder (leafsectionlab)
// §6.2.5 (pp. 76-77): dorsiventral vs isobilateral (Fig. 6.5).
// -------------------------------------------------------------------------
window.SIMS.leafsectionlab = (function(){
  var leafMode = "dorsi"; // "dorsi", "iso"

  function setL(v){
    leafMode = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f9a8d4;"></span><span>Adaxial / Abaxial Epidermis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#4ade80;"></span><span>Mesophyll</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#1d4ed8;"></span><span>Vein Bundle (xylem adaxial)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dorsi">Dorsiventral (Dicot)</button>' +
      '<button class="preset-btn" id="p-iso">Isobilateral (Monocot)</button>';

    document.getElementById("p-dorsi").onclick = function(){ setActivePreset(this); setL("dorsi"); };
    document.getElementById("p-iso").onclick = function(){ setActivePreset(this); setL("iso"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Three parts (§6.2.5):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Epidermis + mesophyll + vascular system.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Xylem spot: <b style="color:#38bdf8;">adaxial (Fig. 6.5a)</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Above the phloem, toward upper skin.</div>' +
      '</div>';

    draw(0);
  }

  function stoma(x, y){
    return '<ellipse cx="' + (x - 9) + '" cy="' + y + '" rx="9" ry="11" fill="#14532d" stroke="#22c55e" stroke-width="2"/>' +
      '<ellipse cx="' + (x + 9) + '" cy="' + y + '" rx="9" ry="11" fill="#14532d" stroke="#22c55e" stroke-width="2"/>' +
      '<ellipse cx="' + x + '" cy="' + y + '" rx="3.5" ry="7" fill="#38bdf8"/>';
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    var isDorsi = (leafMode === "dorsi");

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Leaf V.S. (Fig. 6.5)</text>';

    // adaxial epidermis + cuticle
    m += '<rect x="60" y="60" width="320" height="16" rx="4" fill="#9d174d" opacity="0.85"/>';
    m += '<rect x="60" y="76" width="320" height="5" fill="#fde68a" opacity="0.8"/>';
    m += '<text x="386" y="72" fill="#f9a8d4" font-size="10">adaxial + cuticle</text>';
    if(!isDorsi){
      m += stoma(150, 68);
      m += stoma(300, 68);
    } else {
      m += '<text x="220" y="72" fill="#64748b" font-size="9" text-anchor="middle">few / no stomata</text>';
    }

    // mesophyll
    if(isDorsi){
      for(var p = 0; p < 9; p++){
        m += '<rect x="' + (66 + p * 34) + '" y="86" width="26" height="80" rx="3" fill="#14532d" stroke="#22c55e" stroke-width="1"/>';
      }
      m += '<text x="386" y="130" fill="#4ade80" font-size="10">palisade</text>';
      var sp = [[90, 200], [140, 215], [200, 200], [260, 215], [320, 200], [170, 235], [290, 235]];
      for(var s = 0; s < sp.length; s++){
        m += '<circle cx="' + sp[s][0] + '" cy="' + sp[s][1] + '" r="17" fill="#14532d" stroke="#4ade80" stroke-width="1"/>';
      }
      m += '<ellipse cx="230" cy="228" rx="22" ry="12" fill="#0b1726" stroke="#64748b" stroke-width="1" stroke-dasharray="4 3"/>';
      m += '<text x="386" y="215" fill="#4ade80" font-size="10">spongy + air</text>';
    } else {
      var iso = [[90, 110], [150, 100], [210, 110], [270, 100], [330, 110], [120, 160], [180, 170], [240, 160], [300, 170], [150, 220], [230, 225], [310, 220]];
      for(var q = 0; q < iso.length; q++){
        m += '<circle cx="' + iso[q][0] + '" cy="' + iso[q][1] + '" r="20" fill="#14532d" stroke="#4ade80" stroke-width="1"/>';
      }
      m += '<text x="386" y="160" fill="#4ade80" font-size="10">uniform</text>';
      m += '<text x="386" y="174" fill="#4ade80" font-size="10">mesophyll</text>';
    }

    // vein bundle
    var vbx = isDorsi ? 220 : 220, vby = isDorsi ? 150 : 165;
    if(isDorsi){
      m += '<ellipse cx="352" cy="150" rx="34" ry="52" fill="#172554" stroke="#1d4ed8" stroke-width="2"/>';
      m += '<ellipse cx="352" cy="128" rx="20" ry="16" fill="#7f1d1d" stroke="#dc2626" stroke-width="1.5"/>';
      m += '<text x="352" y="132" fill="#fecaca" font-size="9" font-weight="700" text-anchor="middle">Xy</text>';
      m += '<ellipse cx="352" cy="172" rx="20" ry="16" fill="#1d4ed8"/>';
      m += '<text x="352" y="176" fill="#dbeafe" font-size="9" font-weight="700" text-anchor="middle">Ph</text>';
      m += '<text x="352" y="100" fill="#38bdf8" font-size="9" text-anchor="middle">xylem adaxial ↑</text>';
    } else {
      m += '<ellipse cx="352" cy="160" rx="30" ry="46" fill="#172554" stroke="#1d4ed8" stroke-width="2"/>';
      m += '<ellipse cx="352" cy="142" rx="17" ry="14" fill="#7f1d1d" stroke="#dc2626" stroke-width="1.5"/>';
      m += '<ellipse cx="352" cy="180" rx="17" ry="14" fill="#1d4ed8"/>';
      m += '<text x="352" y="100" fill="#94a3b8" font-size="9" text-anchor="middle">near-equal size</text>';
    }

    // abaxial epidermis + stomata
    m += '<rect x="60" y="254" width="130" height="16" rx="4" fill="#9d174d" opacity="0.85"/>';
    m += '<rect x="250" y="254" width="130" height="16" rx="4" fill="#9d174d" opacity="0.85"/>';
    m += stoma(220, 262);
    m += stoma(110, 262);
    m += stoma(330, 262);
    m += '<text x="386" y="266" fill="#f9a8d4" font-size="10">abaxial: most</text>';

    m += '<text x="220" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">' +
      (isDorsi ? "palisade over sponge · stomata below · graded veins" : "uniform mesh · stomata both faces · equal bundles") + '</text>';

    // RIGHT: compare
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Two Faces?</text>';
    var rows = [
      ["Mesophyll", isDorsi ? "palisade + spongy" : "undifferentiated"],
      ["Stomata", isDorsi ? "mostly abaxial" : "both faces"],
      ["Bundles", isDorsi ? "graded (reticulate)" : "near-equal (parallel)"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="470" y="' + (ry + 22) + '" fill="#64748b" font-size="10">' + rows[r][0] + '</text>';
      m += '<text x="470" y="' + (ry + 42) + '" fill="#f8fafc" font-size="12" font-weight="700">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Leaf", isDorsi ? "DORSIVENTRAL (DICOT)" : "ISOBILATERAL (MONOCOT)", "#4ade80") +
      cell("Mesophyll", isDorsi ? "Palisade + spongy" : "Uniform", "#22c55e") +
      cell("Stomata", isDorsi ? "Mostly abaxial" : "Both faces", "#38bdf8") +
      cell("Veins", isDorsi ? "Graded bundles" : "Near-equal", "#f59e0b")
    );

    verdict(
      '<span style="color:#4ade80;font-weight:700;">§6.2.5–6.2.6 Leaves:</span> ' +
      (isDorsi ? "Adaxial palisade over spongy air spaces; stomata below; xylem adaxial in sheathed veins." :
        "Uniform mesophyll, stomata on both faces, near-equal bundles (except main veins).")
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. Bulliform Curl Lab (bulliformlab)
// §6.2.6 + Summary (pp. 77-78): bulliform switch + tissue recap.
// -------------------------------------------------------------------------
window.SIMS.bulliformlab = (function(){
  var waterMode = "turgid"; // "turgid", "flaccid"
  var showSummary = false;

  function setW(v){
    waterMode = v;
    showSummary = false;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Bulliform Cells (adaxial veins)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#4ade80;"></span><span>Mesophyll</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Leaf Surface Exposure</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-turgid">Turgid (Flat)</button>' +
      '<button class="preset-btn" id="p-flaccid">Flaccid (Curled)</button>' +
      '<button class="preset-btn" id="p-summary">Summary Board</button>';

    document.getElementById("p-turgid").onclick = function(){ setActivePreset(this); setW("turgid"); };
    document.getElementById("p-flaccid").onclick = function(){ setActivePreset(this); setW("flaccid"); };
    document.getElementById("p-summary").onclick = function(){
      setActivePreset(this);
      showSummary = true;
      draw(0);
    };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Bulliform switch (§6.2.6):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Turgid → flat, exposed · flaccid → curled in.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Where: <b style="color:#38bdf8;">grasses, adaxial, along veins</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Large, empty, colourless cells.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    if(showSummary){
      m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
      m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Chapter Summary (PDF p. 7)</text>';
      var cards = [
        ["Tissue classes", "meristematic (apical, lateral, intercalary) · permanent (simple, complex)", "#38bdf8"],
        ["Tissue jobs", "assimilation + storage · transport water/minerals/photosynthates · support", "#22c55e"],
        ["Three systems", "epidermal · ground (cortex, pericycle, pith) · vascular (conducting)", "#f59e0b"],
        ["Growth rules", "bundles vary by group · 2nd growth in most dicot roots + stems", "#f472b6"]
      ];
      for(var c = 0; c < cards.length; c++){
        var cy = 62 + c * 58;
        m += '<rect x="40" y="' + cy + '" width="620" height="50" rx="6" fill="#0f172a" stroke="' + cards[c][2] + '" stroke-width="1.5"/>';
        m += '<text x="56" y="' + (cy + 21) + '" fill="' + cards[c][2] + '" font-size="12" font-weight="700">' + cards[c][0] + '</text>';
        m += '<text x="56" y="' + (cy + 40) + '" fill="#cbd5e1" font-size="11">' + cards[c][1] + '</text>';
      }
    } else {
      var turgid = (waterMode === "turgid");
      m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
      m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Grass Leaf Section</text>';
      // leaf blade
      if(turgid){
        m += '<rect x="70" y="130" width="300" height="46" rx="20" fill="#14532d" stroke="#22c55e" stroke-width="2"/>';
        for(var i = 0; i < 5; i++){
          m += '<circle cx="' + (110 + i * 58) + '" cy="138" r="14" fill="#38bdf8" opacity="0.85" stroke="#0c4a6e" stroke-width="1.5"/>';
        }
        m += '<text x="220" y="120" fill="#38bdf8" font-size="11" text-anchor="middle">bulliform turgid (water absorbed)</text>';
        m += '<text x="220" y="215" fill="#4ade80" font-size="12" text-anchor="middle">blade flat — surface exposed</text>';
        m += '<line x1="90" y1="250" x2="350" y2="250" stroke="#f59e0b" stroke-width="3"/>';
        m += '<text x="220" y="270" fill="#f59e0b" font-size="11" text-anchor="middle">full exposure</text>';
      } else {
        m += '<path d="M90,240 Q100,150 170,140 Q240,132 310,140 Q370,148 350,230" fill="none" stroke="#22c55e" stroke-width="10" stroke-linecap="round"/>';
        m += '<path d="M90,240 Q100,150 170,140 Q240,132 310,140 Q370,148 350,230" fill="none" stroke="#14532d" stroke-width="6" stroke-linecap="round"/>';
        for(var j = 0; j < 4; j++){
          m += '<ellipse cx="' + (150 + j * 55) + '" cy="148" rx="12" ry="7" fill="#164e63" stroke="#0c4a6e" stroke-width="1.5"/>';
        }
        m += '<text x="220" y="120" fill="#38bdf8" font-size="11" text-anchor="middle">bulliform flaccid (water stress)</text>';
        m += '<text x="220" y="270" fill="#4ade80" font-size="12" text-anchor="middle">curled inwards — water loss minimised</text>';
      }
      // RIGHT: switch
      m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
      m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Water Switch</text>';
      var rows = [
        ["turgid", "TURGID", "flat · exposed", "#38bdf8"],
        ["flaccid", "FLACCID", "curled · saving water", "#f59e0b"]
      ];
      for(var r = 0; r < rows.length; r++){
        var ry = 80 + r * 90;
        var on = (waterMode === rows[r][0]);
        m += '<rect x="460" y="' + ry + '" width="200" height="70" rx="6" fill="' + (on ? "#1e293b" : "#0f172a") + '" stroke="' + rows[r][3] + '" stroke-width="' + (on ? 3 : 1.5) + '"/>';
        m += '<text x="560" y="' + (ry + 28) + '" fill="' + rows[r][3] + '" font-size="13" font-weight="700" text-anchor="middle">' + rows[r][1] + '</text>';
        m += '<text x="560" y="' + (ry + 50) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + rows[r][2] + '</text>';
      }
    }

    svg.innerHTML = m;

    if(showSummary){
      readout(
        cell("Classes", "Meristematic / permanent", "#38bdf8") +
        cell("Jobs", "Assimilate · transport · support", "#22c55e") +
        cell("Systems", "Epi · ground · vascular", "#f59e0b") +
        cell("2nd Growth", "Most dicot roots + stems", "#f472b6")
      );
      verdict(
        '<span style="color:#f472b6;font-weight:700;">Summary:</span> ' +
        'Tissues classed, jobs listed, systems zoned — and secondary growth in most dicot roots and stems.'
      );
    } else {
      var isT = (waterMode === "turgid");
      readout(
        cell("Bulliform", isT ? "TURGID" : "FLACCID", "#38bdf8") +
        cell("Blade", isT ? "Flat, exposed" : "Curled inwards", "#4ade80") +
        cell("Water", isT ? "Absorbed" : "Stressed", "#f59e0b") +
        cell("Loss", isT ? "Normal" : "Minimised", "#10b981")
      );
      verdict(
        '<span style="color:#38bdf8;font-weight:700;">§6.2.6 Bulliform:</span> ' +
        (isT ? "Water absorbed, cells turgid — the leaf surface stays exposed." :
          "Water stress, cells flaccid — leaves curl inwards to minimise water loss.")
      );
    }
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-105 —
// per-chapter only, no shared-script changes).
// -------------------------------------------------------------------------

// Stable browser-fixture identifiers for every visible lab scenario.
Object.keys(window.SIMS).forEach(function(key){
  var sim = window.SIMS[key];
  if(!sim || typeof sim.mount !== "function") return;
  var originalMount = sim.mount;
  sim.mount = function(lesson){
    originalMount.call(sim, lesson);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn, index){
      if(!btn.dataset.preset) btn.dataset.preset = btn.id || (key + "-" + index);
    });
  };
});

// Semantic prediction aliases expected by the shared browser QA.
document.addEventListener("click", function(event){
  if(!event.target.closest("#btn-check-prediction")) return;
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  var chosen = document.querySelector('input[name="predict_ans"]:checked');
  if(!lesson || !chosen) return;
  document.querySelectorAll("#predict-options .predict-option").forEach(function(option, index){
    option.classList.toggle("is-answer", index === lesson.prediction.answer);
    option.classList.toggle("is-wrong", index === Number(chosen.value) && index !== lesson.prediction.answer);
  });
});

// Keep this chapter's presentation aligned with its data.
function normalizeChapterPresentation(){
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  var watch = document.getElementById("what-to-watch");
  if(lesson && watch && lesson.watch){
    var text = "What to watch: " + lesson.watch;
    if(watch.textContent !== text) watch.textContent = text;
  }
  document.querySelectorAll(".connect-grid").forEach(function(grid){
    var cards = Array.from(grid.querySelectorAll(":scope > .connect-card"));
    var explicitWow = cards.find(function(card){ var h = card.querySelector("h3"); return h && /^Wow/i.test(h.textContent.trim()); });
    if(!explicitWow) return;
    cards.forEach(function(card){
      if(card === explicitWow) return;
      card.classList.remove("wow"); card.removeAttribute("data-wow"); card.removeAttribute("data-source");
      var badge = card.querySelector(":scope > .wow-badge"); if(badge) badge.remove();
    });
  });
}
var conceptView = document.getElementById("concept-view");
var revisionView = document.getElementById("revision-view");
if(conceptView) new MutationObserver(normalizeChapterPresentation).observe(conceptView, {childList:true, subtree:true});
if(revisionView) new MutationObserver(normalizeChapterPresentation).observe(revisionView, {childList:true, subtree:true});
normalizeChapterPresentation();
