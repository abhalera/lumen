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
// 1. Root System and Root-Tip Explorer (rootsystemlab)
// §5.1-§5.1.1 (pp. 57-59): tap / fibrous / adventitious + tip regions.
// -------------------------------------------------------------------------
window.SIMS.rootsystemlab = (function(){
  var sysType = "tap"; // "tap", "fibrous", "adventitious"
  var tipZone = "cap"; // "cap", "meristem", "elongation", "maturation"

  function setSys(t){
    sysType = t;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Primary / Main Root</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Lateral / Stem-base Roots</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Root-tip Zones</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-tap">Tap (Mustard)</button>' +
      '<button class="preset-btn" id="p-fibrous">Fibrous (Wheat)</button>' +
      '<button class="preset-btn" id="p-advent">Adventitious (Banyan)</button>';

    document.getElementById("p-tap").onclick = function(){ setActivePreset(this); setSys("tap"); };
    document.getElementById("p-fibrous").onclick = function(){ setActivePreset(this); setSys("fibrous"); };
    document.getElementById("p-advent").onclick = function(){ setActivePreset(this); setSys("adventitious"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Tip region (Fig. 5.3):</label>' +
        '<select id="tip-select" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;">' +
          '<option value="cap" selected>Root cap (thimble)</option>' +
          '<option value="meristem">Meristematic activity</option>' +
          '<option value="elongation">Elongation</option>' +
          '<option value="maturation">Maturation + root hairs</option>' +
        '</select>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Origin (§5.1): <b style="color:#38bdf8;">radicle vs stem base vs other parts</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Left: whole system. Right: tip zones apex-up.</div>' +
      '</div>';

    document.getElementById("tip-select").onchange = function(e){
      tipZone = e.target.value;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    // LEFT: whole root system
    m += '<rect x="20" y="20" width="320" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Root System</text>';
    m += '<rect x="40" y="60" width="280" height="6" fill="#3f6212"/>';
    m += '<text x="40" y="80" fill="#a3e635" font-size="10">soil surface</text>';

    if(sysType === "tap"){
      m += '<line x1="180" y1="66" x2="180" y2="270" stroke="#f59e0b" stroke-width="7" stroke-linecap="round"/>';
      var taps = [[150,120],[210,140],[155,165],[205,190],[160,215],[200,235]];
      for(var i = 0; i < taps.length; i++){
        var s = taps[i][0] < 180 ? -1 : 1;
        m += '<line x1="180" y1="' + taps[i][1] + '" x2="' + taps[i][0] + '" y2="' + (taps[i][1] + 22) + '" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>';
      }
      m += '<text x="180" y="292" fill="#f59e0b" font-size="11" text-anchor="middle">Primary root + secondary / tertiary laterals</text>';
    } else if(sysType === "fibrous"){
      for(var f = 0; f < 9; f++){
        var fx = 90 + f * 22;
        m += '<line x1="180" y1="66" x2="' + fx + '" y2="' + (200 + (f % 3) * 22) + '" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>';
      }
      m += '<text x="180" y="150" fill="#64748b" font-size="10" text-anchor="middle">primary root short-lived</text>';
      m += '<text x="180" y="292" fill="#38bdf8" font-size="11" text-anchor="middle">Cluster from the stem base (wheat)</text>';
    } else {
      m += '<rect x="150" y="66" width="60" height="120" rx="6" fill="#3f2d14" stroke="#92400e" stroke-width="2"/>';
      m += '<text x="180" y="130" fill="#fbbf24" font-size="10" text-anchor="middle">stem /</text>';
      m += '<text x="180" y="144" fill="#fbbf24" font-size="10" text-anchor="middle">branch</text>';
      var adv = [[140,110],[220,110],[135,150],[225,150],[150,180],[210,180]];
      for(var a = 0; a < adv.length; a++){
        m += '<line x1="' + (adv[a][0] < 180 ? 150 : 210) + '" y1="' + adv[a][1] + '" x2="' + adv[a][0] + '" y2="' + (adv[a][1] + 80) + '" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>';
      }
      m += '<text x="180" y="292" fill="#10b981" font-size="11" text-anchor="middle">From parts other than radicle (banyan)</text>';
    }

    // RIGHT: root-tip zones
    m += '<rect x="360" y="20" width="320" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="380" y="48" fill="#f8fafc" font-size="14" font-weight="700">Root Tip (Fig. 5.3)</text>';
    var zones = [
      ["cap", "Root cap", "thimble shield", "#f59e0b"],
      ["meristem", "Meristematic", "dividing cells", "#38bdf8"],
      ["elongation", "Elongation", "growth in length", "#a78bfa"],
      ["maturation", "Maturation", "root hairs absorb", "#10b981"]
    ];
    for(var z = 0; z < zones.length; z++){
      var zy = 70 + z * 52;
      var on = (tipZone === zones[z][0]);
      m += '<rect x="440" y="' + zy + '" width="120" height="46" rx="6" fill="' + (on ? "#1e293b" : "#0f172a") + '" stroke="' + zones[z][3] + '" stroke-width="' + (on ? 3 : 1.5) + '"/>';
      m += '<text x="500" y="' + (zy + 20) + '" fill="' + zones[z][3] + '" font-size="11" font-weight="700" text-anchor="middle">' + zones[z][1] + '</text>';
      m += '<text x="500" y="' + (zy + 36) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + zones[z][2] + '</text>';
      if(zones[z][0] === "maturation"){
        for(var h = 0; h < 6; h++){
          m += '<line x1="' + (444 + h * 20) + '" y1="' + (zy + 46) + '" x2="' + (438 + h * 20) + '" y2="' + (zy + 60) + '" stroke="#10b981" stroke-width="1.5"/>';
        }
      }
    }
    m += '<text x="400" y="140" fill="#64748b" font-size="11" transform="rotate(-90 400 140)" text-anchor="middle">apex</text>';
    m += '<text x="400" y="250" fill="#64748b" font-size="11" transform="rotate(-90 400 250)" text-anchor="middle">base</text>';
    m += '<text x="520" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">apex at top, base below</text>';

    svg.innerHTML = m;

    var sysName = sysType === "tap" ? "TAP" : (sysType === "fibrous" ? "FIBROUS" : "ADVENTITIOUS");
    var sysOrigin = sysType === "tap" ? "Radicle elongates" : (sysType === "fibrous" ? "Stem base cluster" : "Non-radicle parts");
    var sysEx = sysType === "tap" ? "Mustard" : (sysType === "fibrous" ? "Wheat" : "Grass / Monstera / Banyan");
    var zoneName = tipZone === "cap" ? "ROOT CAP" : (tipZone === "meristem" ? "MERISTEMATIC" : (tipZone === "elongation" ? "ELONGATION" : "MATURATION"));
    readout(
      cell("System", sysName, "#f59e0b") +
      cell("Origin", sysOrigin, "#38bdf8") +
      cell("Example", sysEx, "#10b981") +
      cell("Tip Zone", zoneName, "#a78bfa")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">§5.1 Root:</span> ' +
      (sysType === "tap" ? "Radicle grows into a primary root bearing secondary and tertiary laterals (mustard)." :
       (sysType === "fibrous" ? "Short-lived primary replaced by stem-base roots (wheat)." :
        "Roots from parts other than the radicle (grass, Monstera, banyan).")) +
      ' Tip order apex-up: cap, meristematic, elongation, maturation.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. Leaf Parts Labelling Bench (leafpartslab)
// §5.2-§5.3 (pp. 59-60): nodes, leaf base / petiole / lamina + variants.
// -------------------------------------------------------------------------
window.SIMS.leafpartslab = (function(){
  var viewMode = "parts"; // "parts", "sheath", "pulvinus"

  function setV(v){
    viewMode = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Leaf Base</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Petiole</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a3e635;"></span><span>Lamina + Midrib</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-parts">Three Parts + Stipules</button>' +
      '<button class="preset-btn" id="p-sheath">Monocot Sheath</button>' +
      '<button class="preset-btn" id="p-pulvinus">Legume Pulvinus</button>';

    document.getElementById("p-parts").onclick = function(){ setActivePreset(this); setV("parts"); };
    document.getElementById("p-sheath").onclick = function(){ setActivePreset(this); setV("sheath"); };
    document.getElementById("p-pulvinus").onclick = function(){ setActivePreset(this); setV("pulvinus"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Stem check (§5.2):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Nodes bear leaves; internodes lie between; buds sit in axils.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Petiole job: <b style="color:#38bdf8;">hold blade to light, flutter cools</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Veins stiffen the blade and transport water, minerals, food.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    // Stem with node / internode
    m += '<rect x="20" y="20" width="200" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Stem (§5.2)</text>';
    m += '<rect x="95" y="60" width="24" height="220" rx="6" fill="#14532d" stroke="#22c55e" stroke-width="1.5"/>';
    m += '<rect x="85" y="150" width="44" height="14" rx="7" fill="#f59e0b"/>';
    m += '<text x="150" y="148" fill="#f59e0b" font-size="11">node: leaf born</text>';
    m += '<text x="150" y="230" fill="#94a3b8" font-size="11">internode</text>';
    m += '<circle cx="128" cy="150" r="7" fill="#10b981"/>';
    m += '<text x="150" y="168" fill="#10b981" font-size="11">axillary bud</text>';
    m += '<text x="60" y="295" fill="#94a3b8" font-size="10">plumule origin</text>';

    // Leaf diagram
    m += '<rect x="240" y="20" width="440" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="260" y="48" fill="#f8fafc" font-size="14" font-weight="700">Leaf (Fig. 5.4a)</text>';

    if(viewMode === "parts"){
      m += '<ellipse cx="480" cy="150" rx="110" ry="80" fill="#14532d" stroke="#a3e635" stroke-width="2"/>';
      m += '<line x1="380" y1="150" x2="580" y2="150" stroke="#d9f99d" stroke-width="3"/>';
      for(var v = 0; v < 5; v++){
        var vx = 420 + v * 32;
        m += '<line x1="' + vx + '" y1="150" x2="' + (vx + 14) + '" y2="110" stroke="#4ade80" stroke-width="1.5"/>';
        m += '<line x1="' + vx + '" y1="150" x2="' + (vx + 14) + '" y2="190" stroke="#4ade80" stroke-width="1.5"/>';
      }
      m += '<text x="480" y="146" fill="#d9f99d" font-size="10" text-anchor="middle">midrib</text>';
      m += '<line x1="370" y1="150" x2="300" y2="150" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>';
      m += '<text x="335" y="140" fill="#38bdf8" font-size="11" text-anchor="middle">petiole</text>';
      m += '<rect x="272" y="138" width="30" height="24" rx="6" fill="#10b981"/>';
      m += '<text x="287" y="178" fill="#10b981" font-size="11" text-anchor="middle">base</text>';
      m += '<path d="M278,138 l-14,-22 M296,138 l14,-22" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>';
      m += '<text x="287" y="106" fill="#10b981" font-size="11" text-anchor="middle">stipules</text>';
      m += '<text x="480" y="250" fill="#a3e635" font-size="12" text-anchor="middle">lamina (blade): green, veined</text>';
      m += '<text x="480" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">axillary bud sits where base meets stem</text>';
    } else if(viewMode === "sheath"){
      m += '<rect x="330" y="80" width="40" height="170" rx="8" fill="#14532d" stroke="#22c55e" stroke-width="1.5"/>';
      m += '<text x="350" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">stem</text>';
      m += '<path d="M330,100 C300,120 300,200 330,230 L330,100" fill="none" stroke="#10b981" stroke-width="8"/>';
      m += '<path d="M370,100 C400,120 400,200 370,230 L370,100" fill="none" stroke="#10b981" stroke-width="8"/>';
      m += '<text x="450" y="150" fill="#10b981" font-size="12">sheath clasps</text>';
      m += '<text x="450" y="168" fill="#10b981" font-size="12">the stem</text>';
      m += '<line x1="446" y1="158" x2="392" y2="160" stroke="#64748b" stroke-width="1"/>';
      m += '<ellipse cx="480" cy="90" rx="90" ry="34" fill="#14532d" stroke="#a3e635" stroke-width="2"/>';
      m += '<line x1="400" y1="90" x2="560" y2="90" stroke="#d9f99d" stroke-width="2"/>';
      m += '<text x="480" y="140" fill="#a3e635" font-size="11" text-anchor="middle">lamina above</text>';
      m += '<text x="460" y="230" fill="#f8fafc" font-size="12">Monocot leaf base</text>';
      m += '<text x="460" y="248" fill="#94a3b8" font-size="11">covers stem partly / wholly</text>';
    } else {
      m += '<line x1="330" y1="120" x2="330" y2="260" stroke="#22c55e" stroke-width="10" stroke-linecap="round"/>';
      m += '<text x="330" y="280" fill="#94a3b8" font-size="11" text-anchor="middle">legume stem</text>';
      m += '<ellipse cx="330" cy="170" rx="26" ry="34" fill="#10b981" stroke="#065f46" stroke-width="2"/>';
      m += '<text x="330" y="174" fill="#052e16" font-size="11" font-weight="700" text-anchor="middle">swollen</text>';
      m += '<line x1="356" y1="160" x2="520" y2="130" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>';
      m += '<ellipse cx="560" cy="122" rx="60" ry="40" fill="#14532d" stroke="#a3e635" stroke-width="2"/>';
      m += '<text x="430" y="210" fill="#10b981" font-size="13" font-weight="700">PULVINUS</text>';
      m += '<text x="430" y="230" fill="#94a3b8" font-size="11">swollen leaf base</text>';
      m += '<text x="430" y="110" fill="#38bdf8" font-size="11">petiole → lamina</text>';
    }

    svg.innerHTML = m;

    var partName = viewMode === "parts" ? "BASE+PETIOLE+BLADE" : (viewMode === "sheath" ? "SHEATH (MONOCOT)" : "PULVINUS (LEGUME)");
    readout(
      cell("View", partName, "#10b981") +
      cell("Node Rule", "Leaves at nodes", "#f59e0b") +
      cell("Bud", "In leaf axil", "#38bdf8") +
      cell("Blade Job", "Photosynthesis", "#a3e635")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">§5.3 Leaf:</span> ' +
      (viewMode === "parts" ? "Base (with stipules) + petiole + veined lamina; bud in the axil." :
       (viewMode === "sheath" ? "Monocot base expands into a sheath covering the stem." :
        "Legume base swells into a pulvinus."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. Phyllotaxy and Compound-Leaf Sorter (phyllotaxylab)
// §5.3.1-§5.3.3 (pp. 60-61): venation + leaf division + leaves per node.
// -------------------------------------------------------------------------
window.SIMS.phyllotaxylab = (function(){
  var phyMode = "alternate"; // "alternate", "opposite", "whorled"
  var leafDiv = "pinnate"; // "simple", "pinnate", "palmate"
  var veinMode = "reticulate"; // "reticulate", "parallel"

  function setP(p){
    phyMode = p;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Leaf / Leaflet</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Rachis / Petiole Tip</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Axillary Bud (leaf only)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-alternate">Alternate (china rose)</button>' +
      '<button class="preset-btn" id="p-opposite">Opposite (Guava)</button>' +
      '<button class="preset-btn" id="p-whorled">Whorled (Alstonia)</button>';

    document.getElementById("p-alternate").onclick = function(){ setActivePreset(this); setP("alternate"); };
    document.getElementById("p-opposite").onclick = function(){ setActivePreset(this); setP("opposite"); };
    document.getElementById("p-whorled").onclick = function(){ setActivePreset(this); setP("whorled"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Blade division (§5.3.2):</label>' +
        '<select id="div-select" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;">' +
          '<option value="simple">Simple (entire blade)</option>' +
          '<option value="pinnate" selected>Pinnate (neem, rachis)</option>' +
          '<option value="palmate">Palmate (silk cotton, tip)</option>' +
        '</select>' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Venation (§5.3.1):</label>' +
        '<select id="vein-select" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;">' +
          '<option value="reticulate" selected>Reticulate (dicot)</option>' +
          '<option value="parallel">Parallel (monocot)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("div-select").onchange = function(e){
      leafDiv = e.target.value;
      draw(0);
    };
    document.getElementById("vein-select").onchange = function(e){
      veinMode = e.target.value;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    // LEFT: phyllotaxy stem
    m += '<rect x="20" y="20" width="220" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Phyllotaxy</text>';
    m += '<line x1="130" y1="60" x2="130" y2="270" stroke="#22c55e" stroke-width="8" stroke-linecap="round"/>';
    function leaf(x, y, dir, len){
      return '<ellipse cx="' + (x + dir * len / 2) + '" cy="' + y + '" rx="' + (len / 2) + '" ry="12" fill="#14532d" stroke="#4ade80" stroke-width="1.5"/>';
    }
    var nodes = [90, 140, 190, 240];
    for(var n = 0; n < nodes.length; n++){
      m += '<circle cx="130" cy="' + nodes[n] + '" r="6" fill="#f59e0b"/>';
      if(phyMode === "alternate"){
        var d = (n % 2 === 0) ? 1 : -1;
        m += leaf(130, nodes[n], d, 70);
      } else if(phyMode === "opposite"){
        m += leaf(130, nodes[n], 1, 55);
        m += leaf(130, nodes[n], -1, 55);
      } else {
        m += leaf(130, nodes[n], 1, 45);
        m += leaf(130, nodes[n], -1, 45);
        m += '<ellipse cx="130" cy="' + (nodes[n] - 14) + '" rx="12" ry="20" fill="#14532d" stroke="#4ade80" stroke-width="1.5"/>';
      }
    }
    var perNode = phyMode === "alternate" ? "1 per node" : (phyMode === "opposite" ? "a pair per node" : "3+ per node");
    m += '<text x="130" y="292" fill="#4ade80" font-size="11" text-anchor="middle">' + perNode + '</text>';

    // MIDDLE: blade division
    m += '<rect x="250" y="20" width="220" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="270" y="48" fill="#f8fafc" font-size="14" font-weight="700">Division</text>';
    if(leafDiv === "simple"){
      m += '<ellipse cx="360" cy="160" rx="60" ry="85" fill="#14532d" stroke="#4ade80" stroke-width="2"/>';
      m += '<line x1="360" y1="80" x2="360" y2="240" stroke="#d9f99d" stroke-width="2"/>';
      m += '<line x1="360" y1="240" x2="360" y2="270" stroke="#f59e0b" stroke-width="5"/>';
      m += '<circle cx="372" cy="262" r="6" fill="#38bdf8"/>';
      m += '<text x="360" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">entire blade + bud</text>';
    } else if(leafDiv === "pinnate"){
      m += '<line x1="360" y1="70" x2="360" y2="260" stroke="#f59e0b" stroke-width="4"/>';
      for(var p = 0; p < 4; p++){
        var py = 100 + p * 40;
        m += '<ellipse cx="322" cy="' + py + '" rx="34" ry="13" fill="#14532d" stroke="#4ade80" stroke-width="1.5"/>';
        m += '<ellipse cx="398" cy="' + py + '" rx="34" ry="13" fill="#14532d" stroke="#4ade80" stroke-width="1.5"/>';
      }
      m += '<ellipse cx="360" cy="70" rx="14" ry="24" fill="#14532d" stroke="#4ade80" stroke-width="1.5"/>';
      m += '<circle cx="372" cy="262" r="6" fill="#38bdf8"/>';
      m += '<text x="360" y="292" fill="#f59e0b" font-size="11" text-anchor="middle">rachis = midrib (neem)</text>';
    } else {
      m += '<line x1="360" y1="270" x2="360" y2="170" stroke="#38bdf8" stroke-width="5"/>';
      m += '<circle cx="360" cy="168" r="7" fill="#f59e0b"/>';
      for(var q = 0; q < 5; q++){
        var ang = (-90 + q * 40) * Math.PI / 180;
        var ex = 360 + Math.cos(ang) * 62, ey = 168 + Math.sin(ang) * 62;
        m += '<line x1="360" y1="168" x2="' + ex + '" y2="' + ey + '" stroke="#4ade80" stroke-width="2"/>';
        m += '<ellipse cx="' + ex + '" cy="' + ey + '" rx="26" ry="12" fill="#14532d" stroke="#4ade80" stroke-width="1.5" transform="rotate(' + (-90 + q * 40 + 90) + ' ' + ex + ' ' + ey + ')"/>';
      }
      m += '<circle cx="372" cy="262" r="6" fill="#38bdf8"/>';
      m += '<text x="360" y="292" fill="#f59e0b" font-size="11" text-anchor="middle">one point: petiole tip</text>';
    }
    m += '<text x="360" y="66" fill="#38bdf8" font-size="10" text-anchor="middle">bud: petiole only, never leaflets</text>';

    // RIGHT: venation
    m += '<rect x="480" y="20" width="200" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="500" y="48" fill="#f8fafc" font-size="14" font-weight="700">Venation</text>';
    m += '<ellipse cx="580" cy="160" rx="62" ry="95" fill="#14532d" stroke="#4ade80" stroke-width="2"/>';
    if(veinMode === "reticulate"){
      m += '<line x1="580" y1="70" x2="580" y2="250" stroke="#d9f99d" stroke-width="2.5"/>';
      for(var r = 0; r < 6; r++){
        var ry = 95 + r * 25;
        m += '<line x1="580" y1="' + ry + '" x2="532" y2="' + (ry + 12) + '" stroke="#4ade80" stroke-width="1.2"/>';
        m += '<line x1="580" y1="' + ry + '" x2="628" y2="' + (ry + 12) + '" stroke="#4ade80" stroke-width="1.2"/>';
      }
      m += '<line x1="540" y1="110" x2="540" y2="220" stroke="#4ade80" stroke-width="1" stroke-dasharray="3 3"/>';
      m += '<line x1="620" y1="110" x2="620" y2="220" stroke="#4ade80" stroke-width="1" stroke-dasharray="3 3"/>';
      m += '<text x="580" y="292" fill="#d9f99d" font-size="11" text-anchor="middle">network (dicot)</text>';
    } else {
      for(var s = 0; s < 7; s++){
        var sx = 536 + s * 15;
        m += '<line x1="' + sx + '" y1="78" x2="' + sx + '" y2="242" stroke="#d9f99d" stroke-width="1.6"/>';
      }
      m += '<text x="580" y="292" fill="#d9f99d" font-size="11" text-anchor="middle">parallel (monocot)</text>';
    }

    svg.innerHTML = m;

    var phyName = phyMode === "alternate" ? "ALTERNATE" : (phyMode === "opposite" ? "OPPOSITE" : "WHORLED");
    var phyEx = phyMode === "alternate" ? "china rose / mustard" : (phyMode === "opposite" ? "Calotropis / Guava" : "Alstonia");
    var divName = leafDiv === "simple" ? "SIMPLE" : (leafDiv === "pinnate" ? "PINNATE (NEEM)" : "PALMATE (SILK COTTON)");
    readout(
      cell("Phyllotaxy", phyName, "#4ade80") +
      cell("Example", phyEx, "#f59e0b") +
      cell("Division", divName, "#38bdf8") +
      cell("Venation", veinMode.toUpperCase(), "#d9f99d")
    );

    verdict(
      '<span style="color:#4ade80;font-weight:700;">§5.3 Sorter:</span> ' +
      (phyMode === "alternate" ? "One leaf per node, alternate (china rose, mustard, sun flower)." :
       (phyMode === "opposite" ? "A pair per node, opposite (Calotropis, guava)." :
        "More than two per node in a whorl (Alstonia).")) +
      ' Bud rule: petiole axil only.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. Racemose-Cymose Fate Bench (inflorescencelab)
// §5.4 (pp. 61-62): apex fate decides type + opening order.
// -------------------------------------------------------------------------
window.SIMS.inflorescencelab = (function(){
  var infMode = "racemose"; // "racemose", "cymose", "solitary"

  function setI(v){
    infMode = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Floral Axis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Open Flower</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Bud / Growing Apex</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-racemose">Racemose (Acropetal)</button>' +
      '<button class="preset-btn" id="p-cymose">Cymose (Basipetal)</button>' +
      '<button class="preset-btn" id="p-solitary">Solitary Tip</button>';

    document.getElementById("p-racemose").onclick = function(){ setActivePreset(this); setI("racemose"); };
    document.getElementById("p-cymose").onclick = function(){ setActivePreset(this); setI("cymose"); };
    document.getElementById("p-solitary").onclick = function(){ setActivePreset(this); setI("solitary"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>The one question (§5.4):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Does the apex grow on, or end in a flower?</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Flower = <b style="color:#38bdf8;">modified shoot</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Floral meristem, condensed axis, no internode elongation.</div>' +
      '</div>';

    draw(0);
  }

  function flower(x, y, open){
    var c = open ? "#f472b6" : "#f59e0b";
    var s = '';
    for(var k = 0; k < 5; k++){
      var ang = (-90 + k * 72) * Math.PI / 180;
      s += '<circle cx="' + (x + Math.cos(ang) * 10) + '" cy="' + (y + Math.sin(ang) * 10) + '" r="7" fill="' + c + '" opacity="' + (open ? 1 : 0.75) + '"/>';
    }
    s += '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#831843"/>';
    return s;
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Floral Axis</text>';

    if(infMode === "racemose"){
      m += '<line x1="220" y1="70" x2="220" y2="270" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/>';
      m += '<circle cx="220" cy="62" r="9" fill="#f59e0b"/>';
      m += '<text x="245" y="66" fill="#f59e0b" font-size="11">apex growing</text>';
      var levels = [230, 195, 160, 125];
      for(var i = 0; i < levels.length; i++){
        var open = i < 2;
        m += '<line x1="220" y1="' + levels[i] + '" x2="150" y2="' + levels[i] + '" stroke="#22c55e" stroke-width="3"/>';
        m += '<line x1="220" y1="' + levels[i] + '" x2="290" y2="' + levels[i] + '" stroke="#22c55e" stroke-width="3"/>';
        m += flower(135, levels[i], open);
        m += flower(305, levels[i], open && i < 1);
      }
      m += '<text x="60" y="292" fill="#f472b6" font-size="11">oldest open below → buds above</text>';
      m += '<text x="360" y="292" fill="#94a3b8" font-size="11">Fig. 5.7</text>';
    } else if(infMode === "cymose"){
      m += '<line x1="220" y1="100" x2="220" y2="270" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/>';
      m += flower(220, 82, true);
      m += '<text x="245" y="86" fill="#f472b6" font-size="11">apex = flower (ends growth)</text>';
      var lv2 = [140, 180, 220, 255];
      for(var j = 0; j < lv2.length; j++){
        var op2 = j < 1;
        m += '<line x1="220" y1="' + lv2[j] + '" x2="150" y2="' + lv2[j] + '" stroke="#22c55e" stroke-width="3"/>';
        m += '<line x1="220" y1="' + lv2[j] + '" x2="290" y2="' + lv2[j] + '" stroke="#22c55e" stroke-width="3"/>';
        m += flower(135, lv2[j], op2);
        m += flower(305, lv2[j], false);
      }
      m += '<text x="60" y="292" fill="#f472b6" font-size="11">terminal opens first → order runs down</text>';
      m += '<text x="360" y="292" fill="#94a3b8" font-size="11">Fig. 5.8</text>';
    } else {
      m += '<line x1="220" y1="160" x2="220" y2="270" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/>';
      m += flower(220, 130, true);
      m += '<text x="120" y="200" fill="#94a3b8" font-size="12">whole shoot tip</text>';
      m += '<text x="120" y="218" fill="#94a3b8" font-size="12">spent as one flower</text>';
      m += '<text x="60" y="292" fill="#f472b6" font-size="11">always solitary — no axis left</text>';
    }

    // RIGHT: fate key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Apex-Fate Key</text>';
    var rows = [
      ["racemose", "Racemose", "axis grows · acropetal", "#f472b6"],
      ["cymose", "Cymose", "axis ends · basipetal", "#38bdf8"],
      ["solitary", "Solitary", "tip spent · single", "#f59e0b"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      var on = (infMode === rows[r][0]);
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="' + (on ? "#1e293b" : "#0f172a") + '" stroke="' + rows[r][3] + '" stroke-width="' + (on ? 3 : 1.5) + '"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][3] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][1] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + rows[r][2] + '</text>';
    }

    svg.innerHTML = m;

    var tName = infMode === "racemose" ? "RACEMOSE" : (infMode === "cymose" ? "CYMOSE" : "SOLITARY");
    var fate = infMode === "racemose" ? "Keeps growing" : (infMode === "cymose" ? "Ends in flower" : "Tip transformed");
    var order = infMode === "racemose" ? "ACROPETAL" : (infMode === "cymose" ? "BASIPETAL" : "—");
    readout(
      cell("Type", tName, "#f472b6") +
      cell("Apex Fate", fate, "#f59e0b") +
      cell("Opening Order", order, "#38bdf8") +
      cell("Axis", infMode === "solitary" ? "None left" : "Floral axis", "#10b981")
    );

    verdict(
      '<span style="color:#f472b6;font-weight:700;">§5.4 Inflorescence:</span> ' +
      (infMode === "racemose" ? "Main axis continues to grow; flowers lateral in acropetal succession (Fig. 5.7)." :
       (infMode === "cymose" ? "Main axis terminates in a flower; growth limited; basipetal order (Fig. 5.8)." :
        "Shoot tip transformed into a flower is always solitary."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. Symmetry, Ovary Position and Aestivation Lab (flowerwhorlslab)
// §5.5-§5.5.1.2 (pp. 62-64): slice test + thalamus positions + bud packing.
// -------------------------------------------------------------------------
window.SIMS.flowerwhorlslab = (function(){
  var symMode = "actino"; // "actino", "zygo", "asym"
  var ovPos = "hypo"; // "hypo", "peri", "epi"
  var aestMode = "valvate"; // "valvate", "twisted", "imbricate", "vexillary"

  function setS(s){
    symMode = s;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Symmetry Planes</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Ovary on Thalamus</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Bud Overlap</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-actino">Actinomorphic (Mustard)</button>' +
      '<button class="preset-btn" id="p-zygo">Zygomorphic (Pea)</button>' +
      '<button class="preset-btn" id="p-asym">Asymmetric (Canna)</button>';

    document.getElementById("p-actino").onclick = function(){ setActivePreset(this); setS("actino"); };
    document.getElementById("p-zygo").onclick = function(){ setActivePreset(this); setS("zygo"); };
    document.getElementById("p-asym").onclick = function(){ setActivePreset(this); setS("asym"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Ovary position (Fig. 5.9):</label>' +
        '<select id="ov-select" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;">' +
          '<option value="hypo" selected>Hypogynous — superior</option>' +
          '<option value="peri">Perigynous — half inferior</option>' +
          '<option value="epi">Epigynous — inferior</option>' +
        '</select>' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Aestivation (Fig. 5.11):</label>' +
        '<select id="aest-select" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;">' +
          '<option value="valvate" selected>Valvate (Calotropis)</option>' +
          '<option value="twisted">Twisted (china rose)</option>' +
          '<option value="imbricate">Imbricate (Cassia)</option>' +
          '<option value="vexillary">Vexillary (pea, bean)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("ov-select").onchange = function(e){
      ovPos = e.target.value;
      draw(0);
    };
    document.getElementById("aest-select").onchange = function(e){
      aestMode = e.target.value;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    // LEFT: symmetry slice test
    m += '<rect x="20" y="20" width="220" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Symmetry</text>';
    if(symMode === "actino"){
      m += '<circle cx="130" cy="160" r="65" fill="#0f172a" stroke="#f472b6" stroke-width="2"/>';
      for(var a = 0; a < 6; a++){
        var ang = (a / 6) * Math.PI * 2;
        m += '<line x1="130" y1="160" x2="' + (130 + Math.cos(ang) * 65) + '" y2="' + (160 + Math.sin(ang) * 65) + '" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 3"/>';
      }
      m += '<circle cx="130" cy="160" r="10" fill="#f472b6"/>';
      m += '<text x="130" y="252" fill="#f472b6" font-size="11" text-anchor="middle">any radial plane halves it</text>';
      m += '<text x="130" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">mustard, datura, chilli</text>';
    } else if(symMode === "zygo"){
      m += '<ellipse cx="130" cy="160" rx="50" ry="68" fill="#0f172a" stroke="#f472b6" stroke-width="2"/>';
      m += '<line x1="130" y1="85" x2="130" y2="235" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6 4"/>';
      m += '<line x1="60" y1="160" x2="200" y2="160" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="130" y="252" fill="#f472b6" font-size="11" text-anchor="middle">one vertical plane only</text>';
      m += '<text x="130" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">pea, gulmohur, bean, Cassia</text>';
    } else {
      m += '<path d="M70,190 Q60,110 130,100 Q200,95 195,170 Q190,230 130,225 Q80,222 70,190 Z" fill="#0f172a" stroke="#f472b6" stroke-width="2"/>';
      m += '<line x1="55" y1="90" x2="205" y2="240" stroke="#ef4444" stroke-width="2"/>';
      m += '<line x1="130" y1="85" x2="130" y2="240" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3"/>';
      m += '<text x="130" y="252" fill="#f472b6" font-size="11" text-anchor="middle">no plane halves it</text>';
      m += '<text x="130" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">canna</text>';
    }

    // MIDDLE: ovary position on thalamus
    m += '<rect x="250" y="20" width="220" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="270" y="48" fill="#f8fafc" font-size="14" font-weight="700">Thalamus (Fig. 5.9)</text>';
    m += '<line x1="300" y1="240" x2="300" y2="270" stroke="#22c55e" stroke-width="8"/>';
    m += '<line x1="420" y1="240" x2="420" y2="270" stroke="#22c55e" stroke-width="8"/>';
    if(ovPos === "hypo"){
      m += '<ellipse cx="360" cy="235" rx="80" ry="16" fill="#14532d" stroke="#22c55e" stroke-width="2"/>';
      m += '<ellipse cx="360" cy="150" rx="34" ry="55" fill="#10b981" stroke="#065f46" stroke-width="2"/>';
      m += '<text x="360" y="154" fill="#052e16" font-size="11" font-weight="700" text-anchor="middle">ovary</text>';
      m += '<line x1="300" y1="228" x2="270" y2="190" stroke="#f472b6" stroke-width="3"/>';
      m += '<line x1="420" y1="228" x2="450" y2="190" stroke="#f472b6" stroke-width="3"/>';
      m += '<text x="360" y="120" fill="#10b981" font-size="11" text-anchor="middle">gynoecium topmost</text>';
      m += '<text x="360" y="292" fill="#10b981" font-size="11" text-anchor="middle">superior: mustard, china rose, brinjal</text>';
    } else if(ovPos === "peri"){
      m += '<path d="M290,240 L290,180 Q360,205 430,180 L430,240" fill="none" stroke="#22c55e" stroke-width="5"/>';
      m += '<ellipse cx="360" cy="200" rx="34" ry="40" fill="#10b981" stroke="#065f46" stroke-width="2"/>';
      m += '<text x="360" y="204" fill="#052e16" font-size="11" font-weight="700" text-anchor="middle">ovary</text>';
      m += '<line x1="290" y1="180" x2="272" y2="150" stroke="#f472b6" stroke-width="3"/>';
      m += '<line x1="430" y1="180" x2="448" y2="150" stroke="#f472b6" stroke-width="3"/>';
      m += '<text x="360" y="130" fill="#10b981" font-size="11" text-anchor="middle">parts on rim, level</text>';
      m += '<text x="360" y="292" fill="#10b981" font-size="11" text-anchor="middle">half inferior: plum, rose, peach</text>';
    } else {
      m += '<path d="M290,240 L290,150 Q360,130 430,150 L430,240" fill="none" stroke="#22c55e" stroke-width="5"/>';
      m += '<rect x="310" y="170" width="100" height="60" rx="8" fill="#14532d" stroke="#22c55e" stroke-width="1.5"/>';
      m += '<ellipse cx="360" cy="200" rx="30" ry="24" fill="#10b981" stroke="#065f46" stroke-width="2"/>';
      m += '<text x="360" y="204" fill="#052e16" font-size="10" font-weight="700" text-anchor="middle">ovary</text>';
      m += '<line x1="290" y1="150" x2="272" y2="120" stroke="#f472b6" stroke-width="3"/>';
      m += '<line x1="430" y1="150" x2="448" y2="120" stroke="#f472b6" stroke-width="3"/>';
      m += '<text x="360" y="105" fill="#10b981" font-size="11" text-anchor="middle">parts arise above</text>';
      m += '<text x="360" y="292" fill="#10b981" font-size="11" text-anchor="middle">inferior: guava, cucumber</text>';
    }

    // RIGHT: aestivation bud packing
    m += '<rect x="480" y="20" width="200" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="500" y="48" fill="#f8fafc" font-size="14" font-weight="700">Bud Packing</text>';
    function petal(cx, cy, rx, ry, rot, fill, op){
      return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" opacity="' + (op || 0.85) + '" stroke="#f59e0b" stroke-width="1.5" transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"/>';
    }
    if(aestMode === "valvate"){
      for(var v = 0; v < 5; v++){
        var va = (-90 + v * 72) * Math.PI / 180;
        m += petal(580 + Math.cos(va) * 42, 165 + Math.sin(va) * 42, 20, 13, -90 + v * 72 + 90, "#7c2d12");
      }
      m += '<text x="580" y="252" fill="#f59e0b" font-size="11" text-anchor="middle">edges just touch</text>';
      m += '<text x="580" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">Calotropis</text>';
    } else if(aestMode === "twisted"){
      for(var w = 0; w < 5; w++){
        var wa = (-90 + w * 72) * Math.PI / 180;
        m += petal(580 + Math.cos(wa) * 36, 165 + Math.sin(wa) * 36, 26, 15, -90 + w * 72 + 55, "#7c2d12");
      }
      m += '<text x="580" y="252" fill="#f59e0b" font-size="11" text-anchor="middle">each overlaps next</text>';
      m += '<text x="580" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">china rose, cotton</text>';
    } else if(aestMode === "imbricate"){
      m += petal(545, 150, 28, 16, 20, "#7c2d12");
      m += petal(615, 150, 28, 16, -25, "#7c2d12");
      m += petal(560, 195, 28, 16, -10, "#92400e");
      m += petal(600, 195, 28, 16, 15, "#92400e");
      m += petal(580, 140, 26, 15, 60, "#7c2d12");
      m += '<text x="580" y="252" fill="#f59e0b" font-size="11" text-anchor="middle">overlap, no direction</text>';
      m += '<text x="580" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">Cassia, gulmohur</text>';
    } else {
      m += petal(580, 115, 34, 20, 0, "#92400e");
      m += '<text x="580" y="100" fill="#fcd34d" font-size="10" text-anchor="middle">standard</text>';
      m += petal(545, 165, 26, 16, -30, "#7c2d12");
      m += petal(615, 165, 26, 16, 30, "#7c2d12");
      m += '<text x="580" y="168" fill="#fcd34d" font-size="10" text-anchor="middle">wings</text>';
      m += petal(580, 205, 30, 15, 0, "#451a03");
      m += '<text x="580" y="232" fill="#fcd34d" font-size="10" text-anchor="middle">keel</text>';
      m += '<text x="580" y="252" fill="#f59e0b" font-size="11" text-anchor="middle">standard&gt;wings&gt;keel</text>';
      m += '<text x="580" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">pea, bean</text>';
    }

    svg.innerHTML = m;

    var sName = symMode === "actino" ? "ACTINOMORPHIC" : (symMode === "zygo" ? "ZYGOMORPHIC" : "ASYMMETRIC");
    var oName = ovPos === "hypo" ? "SUPERIOR" : (ovPos === "peri" ? "HALF INFERIOR" : "INFERIOR");
    var aName = aestMode.toUpperCase();
    readout(
      cell("Symmetry", sName, "#f472b6") +
      cell("Ovary", oName, "#10b981") +
      cell("Aestivation", aName, "#f59e0b") +
      cell("Whorls", "K + C + A + G", "#38bdf8")
    );

    verdict(
      '<span style="color:#f472b6;font-weight:700;">§5.5 Flower:</span> ' +
      (symMode === "actino" ? "Any radial plane halves it (mustard, datura, chilli)." :
       (symMode === "zygo" ? "One vertical plane only (pea, gulmohur, bean, Cassia)." :
        "No halving plane (canna).")) +
      (ovPos === "hypo" ? " Ovary superior (hypogynous)." :
       (ovPos === "peri" ? " Ovary half inferior (perigynous)." : " Ovary inferior (epigynous)."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. Placentation Pattern Explorer (placentationlab)
// §5.5.1.4-§5.7 (pp. 65-67): five defined placentations (Fig. 5.12).
// The listed sixth name "central" is undescribed in print — no preset.
// -------------------------------------------------------------------------
window.SIMS.placentationlab = (function(){
  var placMode = "marginal"; // "marginal", "axile", "parietal", "freecentral", "basal"

  function setPl(p){
    placMode = p;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Ovary Wall</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Placenta</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Ovules</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-marginal">Marginal (Pea)</button>' +
      '<button class="preset-btn" id="p-axile">Axile (Tomato)</button>' +
      '<button class="preset-btn" id="p-parietal">Parietal (Mustard)</button>' +
      '<button class="preset-btn" id="p-freecentral">Free Central (Dianthus)</button>' +
      '<button class="preset-btn" id="p-basal">Basal (Sunflower)</button>';

    document.getElementById("p-marginal").onclick = function(){ setActivePreset(this); setPl("marginal"); };
    document.getElementById("p-axile").onclick = function(){ setActivePreset(this); setPl("axile"); };
    document.getElementById("p-parietal").onclick = function(){ setActivePreset(this); setPl("parietal"); };
    document.getElementById("p-freecentral").onclick = function(){ setActivePreset(this); setPl("freecentral"); };
    document.getElementById("p-basal").onclick = function(){ setActivePreset(this); setPl("basal"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Placentation (§5.5.1.4):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Arrangement of ovules within the ovary (Fig. 5.12).</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Print honesty: <b style="color:#f59e0b;">five defined types only</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">The listed name "central" gets no paragraph — no preset invents it.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    // LEFT: ovary cross-section
    m += '<rect x="20" y="20" width="340" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Ovary Section (Fig. 5.12)</text>';
    var cx = 190, cy = 170;

    function ovule(x, y){
      return '<circle cx="' + x + '" cy="' + y + '" r="7" fill="#f472b6" stroke="#831843" stroke-width="1.5"/>';
    }

    if(placMode === "marginal"){
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="90" ry="80" fill="#0f172a" stroke="#10b981" stroke-width="3"/>';
      m += '<line x1="' + cx + '" y1="' + (cy - 80) + '" x2="' + cx + '" y2="' + (cy + 80) + '" stroke="#f59e0b" stroke-width="7"/>';
      m += '<text x="' + (cx + 14) + '" y="' + (cy - 88) + '" fill="#f59e0b" font-size="10">ventral-suture ridge</text>';
      for(var i = 0; i < 4; i++){
        var oy = cy - 48 + i * 32;
        m += ovule(cx - 14, oy);
        m += ovule(cx + 14, oy);
      }
      m += '<text x="' + cx + '" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">two rows on the ridge (pea)</text>';
    } else if(placMode === "axile"){
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="85" fill="#0f172a" stroke="#10b981" stroke-width="3"/>';
      for(var s = 0; s < 3; s++){
        var sa = (-90 + s * 120) * Math.PI / 180;
        m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(sa) * 85) + '" y2="' + (cy + Math.sin(sa) * 85) + '" stroke="#10b981" stroke-width="2.5"/>';
      }
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="#f59e0b"/>';
      m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#451a03" font-size="9" font-weight="700" text-anchor="middle">axis</text>';
      for(var o = 0; o < 6; o++){
        var oa = (-90 + o * 60 + 30) * Math.PI / 180;
        m += ovule(cx + Math.cos(oa) * 32, cy + Math.sin(oa) * 32);
      }
      m += '<text x="' + cx + '" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">multilocular, axial (china rose, tomato, lemon)</text>';
    } else if(placMode === "parietal"){
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="85" fill="#0f172a" stroke="#10b981" stroke-width="3"/>';
      m += '<line x1="' + (cx - 85) + '" y1="' + cy + '" x2="' + (cx + 85) + '" y2="' + cy + '" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="7 4"/>';
      m += '<text x="' + cx + '" y="' + (cy - 8) + '" fill="#f59e0b" font-size="10" text-anchor="middle">false septum</text>';
      var wallA = [[-60, -50], [60, -50], [-75, 10], [75, 10], [-60, 60], [60, 60]];
      for(var w = 0; w < wallA.length; w++){
        m += ovule(cx + wallA[w][0], cy + wallA[w][1]);
      }
      m += '<text x="' + cx + '" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">wall ovules; 1 chamber becomes 2 (mustard)</text>';
    } else if(placMode === "freecentral"){
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="85" fill="#0f172a" stroke="#10b981" stroke-width="3"/>';
      m += '<line x1="' + cx + '" y1="' + (cy - 85) + '" x2="' + cx + '" y2="' + (cy + 85) + '" stroke="#f59e0b" stroke-width="7"/>';
      m += '<text x="' + (cx + 14) + '" y="' + (cy - 88) + '" fill="#f59e0b" font-size="10">central axis, no septa</text>';
      for(var f = 0; f < 5; f++){
        var fa = (-90 + f * 72) * Math.PI / 180;
        m += ovule(cx + Math.cos(fa) * 24, cy + Math.sin(fa) * 24);
      }
      m += '<text x="' + cx + '" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">Dianthus, Primrose</text>';
    } else {
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="85" fill="#0f172a" stroke="#10b981" stroke-width="3"/>';
      m += '<ellipse cx="' + cx + '" cy="' + (cy + 70) + '" rx="40" ry="12" fill="#f59e0b"/>';
      m += '<text x="' + cx + '" y="' + (cy + 74) + '" fill="#451a03" font-size="10" font-weight="700" text-anchor="middle">base</text>';
      m += ovule(cx, cy + 38);
      m += '<text x="' + cx + '" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">single ovule at base (sunflower, marigold)</text>';
    }

    // RIGHT: type key
    m += '<rect x="380" y="20" width="300" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="400" y="48" fill="#f8fafc" font-size="14" font-weight="700">Five Defined Types</text>';
    var rows = [
      ["marginal", "Marginal — pea", "suture ridge, 2 rows"],
      ["axile", "Axile — tomato", "axial, multilocular"],
      ["parietal", "Parietal — mustard", "wall + false septum"],
      ["freecentral", "Free central — Dianthus", "axis, no septa"],
      ["basal", "Basal — sunflower", "base, single ovule"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 62 + r * 46;
      var on = (placMode === rows[r][0]);
      m += '<rect x="400" y="' + ry + '" width="260" height="40" rx="6" fill="' + (on ? "#1e293b" : "#0f172a") + '" stroke="' + (on ? "#f59e0b" : "#334155") + '" stroke-width="' + (on ? 2.5 : 1.5) + '"/>';
      m += '<text x="530" y="' + (ry + 17) + '" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">' + rows[r][1] + '</text>';
      m += '<text x="530" y="' + (ry + 32) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][2] + '</text>';
    }

    svg.innerHTML = m;

    var info = {
      marginal: ["MARGINAL", "Ventral-suture ridge", "Two rows", "Pea"],
      axile: ["AXILE", "Axial", "Multilocular", "china rose / tomato / lemon"],
      parietal: ["PARIETAL", "Inner wall", "1 → 2 (false septum)", "Mustard / Argemone"],
      freecentral: ["FREE CENTRAL", "Central axis", "No septa", "Dianthus / Primrose"],
      basal: ["BASAL", "Ovary base", "Single ovule", "Sunflower / Marigold"]
    }[placMode];
    readout(
      cell("Type", info[0], "#f59e0b") +
      cell("Placenta Site", info[1], "#38bdf8") +
      cell("Chambers", info[2], "#10b981") +
      cell("Example", info[3], "#f472b6")
    );

    var lines = {
      marginal: "Placenta ridges the ventral suture; ovules ride it in two rows (pea).",
      axile: "Axial placenta with ovules in a multilocular ovary (china rose, tomato, lemon).",
      parietal: "Wall ovules; the chamber doubles via a false septum (mustard, Argemone).",
      freecentral: "Ovules on the central axis; septa absent (Dianthus, Primrose).",
      basal: "Placenta at the base; a single ovule (sunflower, marigold)."
    };
    verdict(
      '<span style="color:#f59e0b;font-weight:700;">§5.5.1.4 Placentation:</span> ' + lines[placMode]
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. Floral Formula Builder (floralformulalab)
// §5.8-§5.9 (pp. 67-69): symbol key + mustard + Solanum formulas.
// -------------------------------------------------------------------------
window.SIMS.floralformulalab = (function(){
  var formMode = "solanum"; // "solanum", "mustard", "key"
  var hiWhorl = "all"; // "all", "K", "C", "A", "G"

  function setF(f){
    formMode = f;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Symmetry + Sex</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Whorls K C A G</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fusion ( ) + Arc + G Line</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-solanum">Solanum Formula</button>' +
      '<button class="preset-btn" id="p-mustard">Mustard (Fig. 5.16)</button>' +
      '<button class="preset-btn" id="p-key">Symbol Key</button>';

    document.getElementById("p-solanum").onclick = function(){ setActivePreset(this); setF("solanum"); };
    document.getElementById("p-mustard").onclick = function(){ setActivePreset(this); setF("mustard"); };
    document.getElementById("p-key").onclick = function(){ setActivePreset(this); setF("key"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Highlight whorl:</label>' +
        '<select id="whorl-select" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;">' +
          '<option value="all" selected>Whole formula</option>' +
          '<option value="K">K — calyx</option>' +
          '<option value="C">C — corolla</option>' +
          '<option value="A">A — androecium</option>' +
          '<option value="G">G — gynoecium</option>' +
        '</select>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Grammar (§5.8): <b style="color:#38bdf8;">brackets fuse, arc adheres, G line grades</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Underline G = superior; overline G = inferior.</div>' +
      '</div>';

    document.getElementById("whorl-select").onchange = function(e){
      hiWhorl = e.target.value;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Floral Formula (§5.8)</text>';

    function tok(x, label, sub, color, dim){
      var c = dim ? "#475569" : color;
      var s = '<text x="' + x + '" y="150" fill="' + c + '" font-size="34" font-weight="700" text-anchor="middle">' + label + '</text>';
      if(sub) s += '<text x="' + x + '" y="172" fill="' + c + '" font-size="15" text-anchor="middle">' + sub + '</text>';
      return s;
    }
    function dimmed(k){
      return hiWhorl !== "all" && hiWhorl !== k;
    }

    if(formMode === "solanum"){
      m += '<text x="60" y="100" fill="#f472b6" font-size="30" font-weight="700">⊕</text>';
      m += '<text x="110" y="100" fill="#f472b6" font-size="30" font-weight="700">⚥</text>';
      m += '<text x="60" y="120" fill="#94a3b8" font-size="10">actinomorphic · bisexual</text>';
      m += tok(230, "K", "(5)", "#38bdf8", dimmed("K"));
      m += tok(330, "C", "(5)", "#38bdf8", dimmed("C"));
      m += tok(430, "A", "5", "#38bdf8", dimmed("A"));
      m += tok(530, "G", "(2)", "#10b981", dimmed("G"));
      m += '<path d="M292,112 Q380,92 468,112" fill="none" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<text x="380" y="104" fill="#f59e0b" font-size="10" text-anchor="middle">adhesion arc: epipetalous</text>';
      m += '<line x1="512" y1="180" x2="548" y2="180" stroke="#10b981" stroke-width="2.5"/>';
      m += '<text x="530" y="200" fill="#10b981" font-size="10" text-anchor="middle">underline: superior</text>';
      m += '<text x="230" y="200" fill="#94a3b8" font-size="10" text-anchor="middle">5 united, persistent, valvate</text>';
      m += '<text x="330" y="222" fill="#94a3b8" font-size="10" text-anchor="middle">5 united, valvate</text>';
      m += '<text x="350" y="262" fill="#f8fafc" font-size="12" text-anchor="middle">Solanum: berry or capsule · many endospermous seeds</text>';
    } else if(formMode === "mustard"){
      m += '<text x="60" y="100" fill="#f472b6" font-size="30" font-weight="700">⊕</text>';
      m += '<text x="110" y="100" fill="#f472b6" font-size="30" font-weight="700">⚥</text>';
      m += '<text x="60" y="120" fill="#94a3b8" font-size="10">actinomorphic · bisexual</text>';
      m += tok(230, "K", "2+2", "#38bdf8", dimmed("K"));
      m += tok(330, "C", "4", "#38bdf8", dimmed("C"));
      m += tok(430, "A", "2+4", "#38bdf8", dimmed("A"));
      m += tok(530, "G", "(2)", "#10b981", dimmed("G"));
      m += '<line x1="512" y1="180" x2="548" y2="180" stroke="#10b981" stroke-width="2.5"/>';
      m += '<text x="530" y="200" fill="#10b981" font-size="10" text-anchor="middle">underline: superior</text>';
      m += '<text x="350" y="240" fill="#94a3b8" font-size="11" text-anchor="middle">Fig. 5.16 — mustard (Brassicaceae): no brackets, no arc</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">sepals 2+2 free · petals 4 free · stamens 2+4 free</text>';
    } else {
      var keys = [
        ["Br", "bracteate", "#94a3b8"], ["K", "calyx", "#38bdf8"], ["C", "corolla", "#38bdf8"],
        ["P", "perianth", "#38bdf8"], ["A", "androecium", "#38bdf8"], ["G", "gynoecium", "#10b981"]
      ];
      for(var k = 0; k < keys.length; k++){
        var kx = 90 + k * 95;
        m += '<rect x="' + (kx - 42) + '" y="80" width="84" height="64" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>';
        m += '<text x="' + kx + '" y="108" fill="' + keys[k][2] + '" font-size="22" font-weight="700" text-anchor="middle">' + keys[k][0] + '</text>';
        m += '<text x="' + kx + '" y="130" fill="#94a3b8" font-size="10" text-anchor="middle">' + keys[k][1] + '</text>';
      }
      var syms = [
        ["⊕", "actinomorphic"], ["%", "zygomorphic"], ["( )", "fusion"],
        ["arc", "adhesion"], ["G_", "superior"], ["G¯", "inferior"]
      ];
      for(var s2 = 0; s2 < syms.length; s2++){
        var sx = 90 + s2 * 95;
        m += '<rect x="' + (sx - 42) + '" y="160" width="84" height="64" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>';
        m += '<text x="' + sx + '" y="188" fill="#f59e0b" font-size="20" font-weight="700" text-anchor="middle">' + syms[s2][0] + '</text>';
        m += '<text x="' + sx + '" y="210" fill="#94a3b8" font-size="10" text-anchor="middle">' + syms[s2][1] + '</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Mother-axis dot tops the diagram; whorls run calyx-outermost to gynoecium-centre</text>';
    }

    svg.innerHTML = m;

    var fName = formMode === "solanum" ? "SOLANUM" : (formMode === "mustard" ? "MUSTARD (Fig. 5.16)" : "SYMBOL KEY");
    var form = formMode === "solanum" ? "K(5) C(5)A5 G(2)" : (formMode === "mustard" ? "K2+2 C4 A2+4 G(2)" : "Br K C P A G");
    var adh = formMode === "solanum" ? "Arc: epipetalous" : (formMode === "mustard" ? "None" : "—");
    readout(
      cell("Flower", fName, "#f472b6") +
      cell("Formula", form, "#38bdf8") +
      cell("Adhesion", adh, "#f59e0b") +
      cell("Ovary Line", formMode === "key" ? "—" : "G underlined: superior", "#10b981")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">§5.8 Formula:</span> ' +
      (formMode === "solanum" ? "⊕ ⚥ K(5) C(5)A5 G(2) — united whorls, epipetalous arc, superior bicarpellary ovary (PDF p. 15)." :
       (formMode === "mustard" ? "⊕ ⚥ K2+2 C4 A2+4 G(2) — free parts, superior ovary (Fig. 5.16)." :
        "Br K C P A G · ⊕ actinomorphic · % zygomorphic · brackets fuse · arc adheres."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-104 —
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
