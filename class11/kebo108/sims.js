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
// 1. Discovery Timeline Bench (cellhistorylab)
// §8.1-§8.2 (pp. 87-88): discoverers + cell theory clauses.
// -------------------------------------------------------------------------
window.SIMS.cellhistorylab = (function(){
  var hisView = "timeline"; // "timeline", "theory", "credit"

  function setV(v){
    hisView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Discoverers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Theory Clauses</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Correct Credit</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-timeline">Discovery Timeline</button>' +
      '<button class="preset-btn" id="p-theory">Theory Clauses</button>' +
      '<button class="preset-btn" id="p-credit">Who Found What</button>';

    document.getElementById("p-timeline").onclick = function(){ setActivePreset(this); setV("timeline"); };
    document.getElementById("p-theory").onclick = function(){ setActivePreset(this); setV("theory"); };
    document.getElementById("p-credit").onclick = function(){ setActivePreset(this); setV("credit"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Unit of life (§8.1):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Nothing less than a complete cell lives alone.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Final clause: <b style="color:#38bdf8;">Omnis cellula-e cellula</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Virchow (1855) closed the gap.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Cell Theory (§8.1–§8.2)</text>';

    if(hisView === "timeline"){
      var stops = [
        ["Leeuwenhoek", "first live cell", "#38bdf8"],
        ["Brown", "nucleus", "#38bdf8"],
        ["Schleiden 1838", "plants = cells", "#22c55e"],
        ["Schwann 1839", "animals = cells", "#22c55e"],
        ["Virchow 1855", "cells ← cells", "#f59e0b"]
      ];
      for(var i = 0; i < stops.length; i++){
        var x = 45 + i * 128;
        m += '<rect x="' + x + '" y="100" width="112" height="120" rx="8" fill="#0f172a" stroke="' + stops[i][2] + '" stroke-width="2"/>';
        m += '<text x="' + (x + 56) + '" y="130" fill="' + stops[i][2] + '" font-size="11" font-weight="700" text-anchor="middle">' + stops[i][0] + '</text>';
        m += '<text x="' + (x + 56) + '" y="152" fill="#94a3b8" font-size="10" text-anchor="middle">' + stops[i][1] + '</text>';
        m += '<text x="' + (x + 56) + '" y="196" fill="#64748b" font-size="10" text-anchor="middle">' + (i + 1) + '/5</text>';
        if(i < 4) m += '<text x="' + (x + 120) + '" y="165" fill="#64748b" font-size="18" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">botanist + zoologist formulate · pathologist completes</text>';
    } else if(hisView === "theory"){
      m += '<rect x="60" y="80" width="560" height="80" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="350" y="110" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">(i) All living organisms are composed of cells and products of cells.</text>';
      m += '<text x="350" y="136" fill="#94a3b8" font-size="11" text-anchor="middle">Schleiden + Schwann: bodies are cells and products of cells</text>';
      m += '<rect x="60" y="175" width="560" height="80" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="350" y="205" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">(ii) All cells arise from pre-existing cells.</text>';
      m += '<text x="350" y="231" fill="#94a3b8" font-size="11" text-anchor="middle">Virchow (1855): Omnis cellula-e cellula</text>';
    } else {
      var pairs = [
        ["Live cell", "Leeuwenhoek", "#38bdf8"],
        ["Nucleus", "Brown", "#38bdf8"],
        ["Plant tissues", "Schleiden", "#22c55e"],
        ["Animal cells + membrane", "Schwann", "#22c55e"],
        ["Pre-existing cells", "Virchow", "#f59e0b"]
      ];
      for(var j = 0; j < pairs.length; j++){
        var jy = 66 + j * 46;
        m += '<rect x="60" y="' + jy + '" width="280" height="38" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>';
        m += '<text x="200" y="' + (jy + 24) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">' + pairs[j][0] + '</text>';
        m += '<text x="360" y="' + (jy + 24) + '" fill="#64748b" font-size="14" text-anchor="middle">→</text>';
        m += '<rect x="380" y="' + jy + '" width="240" height="38" rx="6" fill="#0f172a" stroke="' + pairs[j][2] + '" stroke-width="1.5"/>';
        m += '<text x="500" y="' + (jy + 24) + '" fill="' + pairs[j][2] + '" font-size="11" font-weight="700" text-anchor="middle">' + pairs[j][1] + '</text>';
      }
    }

    svg.innerHTML = m;

    var vName = hisView === "timeline" ? "TIMELINE" : (hisView === "theory" ? "CLAUSES" : "CREDIT");
    readout(
      cell("View", vName, "#38bdf8") +
      cell("Cell", "Leeuwenhoek saw first", "#38bdf8") +
      cell("Theory", "Schleiden + Schwann", "#22c55e") +
      cell("Completion", "Virchow 1855", "#f59e0b")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">§8.1–§8.2 History:</span> ' +
      (hisView === "timeline" ? "Five signed steps from first cell to final clause." :
       (hisView === "theory" ? "Two clauses: cells + products compose life; cells beget cells." :
        "Leeuwenhoek the cell, Brown the nucleus — credit split exactly."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. Prokaryote Inspector (prokaryotelab)
// §8.3-§8.4 (pp. 88-91): eu/pro split, sizes, bacterial plan.
// -------------------------------------------------------------------------
window.SIMS.prokaryotelab = (function(){
  var proView = "split"; // "split", "sizes", "bacterium"

  function setP(v){
    proView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Eukaryotic</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Prokaryotic</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Shared (cytoplasm, ribosomes)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-split">Nucleus Test</button>' +
      '<button class="preset-btn" id="p-sizes">Size Ladder</button>' +
      '<button class="preset-btn" id="p-bacterium">Bacterial Plan</button>';

    document.getElementById("p-split").onclick = function(){ setActivePreset(this); setP("split"); };
    document.getElementById("p-sizes").onclick = function(){ setActivePreset(this); setP("sizes"); };
    document.getElementById("p-bacterium").onclick = function(){ setActivePreset(this); setP("bacterium"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>The one test (§8.3):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Membrane-bound nucleus? Yes = eu, no = pro.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Universal: <b style="color:#38bdf8;">cytoplasm + ribosomes</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Living arena + makers in all cells.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Overview + Prokaryotes (§8.3–§8.4)</text>';

    if(proView === "split"){
      m += '<rect x="60" y="80" width="270" height="160" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="195" y="110" fill="#22c55e" font-size="14" font-weight="700" text-anchor="middle">EUKARYOTIC</text>';
      m += '<circle cx="195" cy="160" r="30" fill="none" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<text x="195" y="164" fill="#22c55e" font-size="9" text-anchor="middle">nucleus</text>';
      m += '<circle cx="130" cy="200" r="10" fill="none" stroke="#22c55e" stroke-width="1.5"/>';
      m += '<circle cx="260" cy="200" r="10" fill="none" stroke="#22c55e" stroke-width="1.5"/>';
      m += '<text x="195" y="228" fill="#94a3b8" font-size="10" text-anchor="middle">ER · Golgi · mito · chloro ...</text>';
      m += '<rect x="370" y="80" width="270" height="160" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="505" y="110" fill="#f59e0b" font-size="14" font-weight="700" text-anchor="middle">PROKARYOTIC</text>';
      m += '<path d="M455,160 C480,145 530,145 555,160 C530,175 480,175 455,160 Z" fill="none" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<text x="505" y="164" fill="#f59e0b" font-size="9" text-anchor="middle">naked DNA</text>';
      m += '<circle cx="470" cy="205" r="5" fill="#38bdf8"/><circle cx="540" cy="205" r="5" fill="#38bdf8"/>';
      m += '<text x="505" y="228" fill="#94a3b8" font-size="10" text-anchor="middle">70S only · mesosome · inclusions</text>';
      m += '<text x="350" y="272" fill="#38bdf8" font-size="11" text-anchor="middle">both: cytoplasm arena + ribosomes</text>';
    } else if(proView === "sizes"){
      var ladder = [
        ["Viruses", "0.02–0.2 µm", 6],
        ["PPLO", "~0.1 µm", 10],
        ["Mycoplasma", "0.3 µm", 16],
        ["Bacteria", "1–2 µm (3–5)", 30],
        ["RBC", "7.0 µm", 52],
        ["Eukaryotic cell", "10–20 µm", 80]
      ];
      for(var i = 0; i < ladder.length; i++){
        var x = 60 + i * 103;
        var r = ladder[i][2];
        m += '<circle cx="' + (x + 40) + '" cy="' + (225 - r) + '" r="' + r + '" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + (x + 40) + '" y="252" fill="#cbd5e1" font-size="10" font-weight="700" text-anchor="middle">' + ladder[i][0] + '</text>';
        m += '<text x="' + (x + 40) + '" y="268" fill="#94a3b8" font-size="9" text-anchor="middle">' + ladder[i][1] + '</text>';
      }
      m += '<text x="350" y="86" fill="#94a3b8" font-size="10" text-anchor="middle">Fig. 8.2 ladder · ostrich egg = largest isolated cell · nerve cells longest</text>';
    } else {
      var parts = [
        ["Envelope ×3", "glycocalyx + wall + membrane", "#f59e0b"],
        ["Naked DNA", "circular + plasmids", "#38bdf8"],
        ["Mesosome", "vesicles · tubules · lamellae", "#22c55e"],
        ["70S ribosomes", "50S + 30S · polysome", "#f472b6"],
        ["Surface", "flagella move · pili/fimbriae stick", "#a78bfa"],
        ["Storage", "granules + gas vacuoles", "#94a3b8"]
      ];
      for(var j = 0; j < parts.length; j++){
        var jx = 60 + (j % 3) * 203;
        var jy = 80 + Math.floor(j / 3) * 105;
        m += '<rect x="' + jx + '" y="' + jy + '" width="190" height="90" rx="8" fill="#0f172a" stroke="' + parts[j][2] + '" stroke-width="1.5"/>';
        m += '<text x="' + (jx + 95) + '" y="' + (jy + 30) + '" fill="' + parts[j][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + parts[j][0] + '</text>';
        m += '<text x="' + (jx + 95) + '" y="' + (jy + 54) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + parts[j][1] + '</text>';
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="10" text-anchor="middle">bacillus · coccus · vibrio · spirillum — wall except mycoplasma</text>';
    }

    svg.innerHTML = m;

    var vName = proView === "split" ? "SPLIT" : (proView === "sizes" ? "SIZES" : "BACTERIUM");
    readout(
      cell("View", vName, "#38bdf8") +
      cell("Eukaryotic", "Nucleus + organelles", "#22c55e") +
      cell("Prokaryotic", "Naked DNA + 70S", "#f59e0b") +
      cell("Range", "0.3 µm → ostrich egg", "#f472b6")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">§8.3–§8.4 Cells:</span> ' +
      (proView === "split" ? "One test — membrane-bound nucleus — splits all cells in two." :
       (proView === "sizes" ? "Fig. 8.2 ladders viruses to eukaryotic cells; shape follows function." :
        "Envelope, naked DNA, mesosome, 70S, granules — the bacterial kit."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. Membrane Gate Bench (membranelab)
// §8.5-§8.5.2 (pp. 91-94): plant/animal plan + membrane + wall.
// -------------------------------------------------------------------------
window.SIMS.membranelab = (function(){
  var memView = "plan"; // "plan", "traffic", "wall"

  function setM(v){
    memView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Plant Extras</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Membrane Traffic</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a16207;"></span><span>Wall Layers</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-plan">Plant vs Animal</button>' +
      '<button class="preset-btn" id="p-traffic">Traffic Rules</button>' +
      '<button class="preset-btn" id="p-wall">Wall Layers</button>';

    document.getElementById("p-plan").onclick = function(){ setActivePreset(this); setM("plan"); };
    document.getElementById("p-traffic").onclick = function(){ setActivePreset(this); setM("traffic"); };
    document.getElementById("p-wall").onclick = function(){ setActivePreset(this); setM("wall"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Membrane (§8.5.1):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Bilayer + 52/40 · Singer–Nicolson 1972 · fluidity.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Wall (§8.5.2): <b style="color:#38bdf8;">plants + fungi only</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Shape · protection · interaction · barrier.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Plan + Membrane (§8.5–§8.5.2)</text>';

    if(memView === "plan"){
      m += '<rect x="60" y="80" width="155" height="170" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="137" y="108" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">PLANT (a)</text>';
      var pe = ["cell wall", "plastids", "big vacuole"];
      for(var p = 0; p < 3; p++){
        m += '<text x="137" y="' + (140 + p * 26) + '" fill="#cbd5e1" font-size="11" text-anchor="middle">+' + pe[p] + '</text>';
      }
      m += '<text x="137" y="232" fill="#64748b" font-size="9" text-anchor="middle">no centrioles</text>';
      m += '<rect x="245" y="80" width="155" height="170" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="322" y="108" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">ANIMAL (b)</text>';
      m += '<text x="322" y="140" fill="#cbd5e1" font-size="11" text-anchor="middle">+centrioles</text>';
      m += '<text x="322" y="170" fill="#64748b" font-size="9" text-anchor="middle">no wall / plastids /</text>';
      m += '<text x="322" y="186" fill="#64748b" font-size="9" text-anchor="middle">big vacuole</text>';
      m += '<text x="322" y="232" fill="#64748b" font-size="9" text-anchor="middle">+ microvilli (Fig. 8.3b)</text>';
      m += '<text x="230" y="272" fill="#94a3b8" font-size="10" text-anchor="middle">Fig. 8.3 · Peroxisome (a) vs Peroxiome (b)</text>';
    } else if(memView === "traffic"){
      // bilayer
      m += '<rect x="60" y="100" width="340" height="110" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>';
      for(var l = 0; l < 12; l++){
        var lx = 80 + l * 27;
        m += '<circle cx="' + lx + '" cy="120" r="7" fill="#38bdf8"/>';
        m += '<line x1="' + lx + '" y1="127" x2="' + lx + '" y2="150" stroke="#f59e0b" stroke-width="3"/>';
        m += '<circle cx="' + lx + '" cy="190" r="7" fill="#38bdf8"/>';
        m += '<line x1="' + lx + '" y1="183" x2="' + lx + '" y2="160" stroke="#f59e0b" stroke-width="3"/>';
      }
      m += '<text x="70" y="95" fill="#38bdf8" font-size="9">polar heads out</text>';
      m += '<text x="300" y="170" fill="#f59e0b" font-size="9">hydrophobic tails in</text>';
      m += '<rect x="200" y="105" width="26" height="100" rx="10" fill="#22c55e" opacity="0.8"/>';
      m += '<text x="213" y="230" fill="#22c55e" font-size="9" text-anchor="middle">carrier</text>';
      m += '<text x="120" y="250" fill="#cbd5e1" font-size="10" text-anchor="middle">neutral ↓ free</text>';
      m += '<text x="230" y="250" fill="#cbd5e1" font-size="10" text-anchor="middle">polar via carrier</text>';
      m += '<text x="345" y="250" fill="#cbd5e1" font-size="10" text-anchor="middle">uphill via ATP</text>';
      m += '<text x="230" y="272" fill="#94a3b8" font-size="10" text-anchor="middle">osmosis · facilitated · Na+/K+ Pump</text>';
    } else {
      var layers = [
        ["Middle lamella", "calcium pectate glue", "#a16207"],
        ["Primary wall", "young · growing", "#22c55e"],
        ["Secondary wall", "mature · inner side", "#15803d"],
        ["Plasma membrane", "within the wall", "#38bdf8"]
      ];
      for(var w = 0; w < layers.length; w++){
        var wy = 70 + w * 50;
        m += '<rect x="60" y="' + wy + '" width="340" height="42" rx="6" fill="#0f172a" stroke="' + layers[w][2] + '" stroke-width="1.5"/>';
        m += '<text x="80" y="' + (wy + 26) + '" fill="' + layers[w][2] + '" font-size="11" font-weight="700">' + layers[w][0] + '</text>';
        m += '<text x="390" y="' + (wy + 26) + '" fill="#94a3b8" font-size="10" text-anchor="end">' + layers[w][1] + '</text>';
      }
      m += '<line x1="230" y1="70" x2="230" y2="262" stroke="#f472b6" stroke-width="2" stroke-dasharray="5 4"/>';
      m += '<text x="230" y="280" fill="#f472b6" font-size="9" text-anchor="middle">plasmodesmata thread through</text>';
    }

    // RIGHT: chemistry key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Membrane Facts</text>';
    var rows = [
      ["52 / 40", "protein / lipid (RBC)", "#38bdf8"],
      ["1972", "Singer–Nicolson", "#22c55e"],
      ["FLUIDITY", "lateral movement", "#f59e0b"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = memView === "plan" ? "PLAN" : (memView === "traffic" ? "TRAFFIC" : "WALL");
    readout(
      cell("View", vName, "#38bdf8") +
      cell("Plant +", "Wall · plastids · vacuole", "#22c55e") +
      cell("Animal +", "Centrioles", "#38bdf8") +
      cell("Model", "Fluid mosaic 1972", "#f59e0b")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">§8.5 Membrane:</span> ' +
      (memView === "plan" ? "Plant and animal cells differ by wall, plastids, vacuole vs centrioles." :
       (memView === "traffic" ? "Neutral diffuses, polar rides carriers, uphill burns ATP." :
        "Primary grows, secondary lines inside, lamella glues, plasmodesmata join."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. Endomembrane Flow Bench (endomembranelab)
// §8.5.3 (pp. 94-96): ER + Golgi + lysosomes + vacuoles.
// -------------------------------------------------------------------------
window.SIMS.endomembranelab = (function(){
  var endoView = "members"; // "members", "golgi", "ends"

  function setE(v){
    endoView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Members (4)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Excluded (3)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Cis → Trans Flow</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-members">Members In/Out</button>' +
      '<button class="preset-btn" id="p-golgi">Golgi Flow</button>' +
      '<button class="preset-btn" id="p-ends">Lysosome vs Vacuole</button>';

    document.getElementById("p-members").onclick = function(){ setActivePreset(this); setE("members"); };
    document.getElementById("p-golgi").onclick = function(){ setActivePreset(this); setE("golgi"); };
    document.getElementById("p-ends").onclick = function(){ setActivePreset(this); setE("ends"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>System rule (§8.5.3):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Coordination decides membership.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>ER split: <b style="color:#38bdf8;">RER protein / SER lipid</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Ribosomes on = rough.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Endomembrane (§8.5.3)</text>';

    if(endoView === "members"){
      var ins = ["ER", "Golgi", "Lysosomes", "Vacuoles"];
      for(var i = 0; i < 4; i++){
        m += '<rect x="' + (60 + i * 90) + '" y="90" width="80" height="90" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
        m += '<text x="' + (100 + i * 90) + '" y="130" fill="#22c55e" font-size="10" font-weight="700" text-anchor="middle">' + ins[i] + '</text>';
        m += '<text x="' + (100 + i * 90) + '" y="158" fill="#22c55e" font-size="18" text-anchor="middle">✓</text>';
      }
      m += '<text x="220" y="215" fill="#22c55e" font-size="11" text-anchor="middle">IN: coordinated functions</text>';
      var outs = ["Mito", "Chloro", "Peroxisome"];
      for(var o = 0; o < 3; o++){
        m += '<rect x="' + (95 + o * 90) + '" y="225" width="80" height="40" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>';
        m += '<text x="' + (135 + o * 90) + '" y="250" fill="#ef4444" font-size="10" text-anchor="middle">' + outs[o] + ' ✗</text>';
      }
      m += '<text x="220" y="290" fill="#94a3b8" font-size="10" text-anchor="middle">OUT: uncoordinated with the four</text>';
    } else if(endoView === "golgi"){
      m += '<rect x="60" y="110" width="80" height="90" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="100" y="145" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">ER</text>';
      m += '<text x="100" y="163" fill="#94a3b8" font-size="9" text-anchor="middle">vesicles</text>';
      m += '<text x="152" y="160" fill="#64748b" font-size="16" text-anchor="middle">→</text>';
      for(var c = 0; c < 4; c++){
        m += '<ellipse cx="230" cy="' + (115 + c * 24) + '" rx="55" ry="11" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      }
      m += '<text x="300" y="125" fill="#f59e0b" font-size="10" text-anchor="middle">cis (forming)</text>';
      m += '<text x="300" y="195" fill="#f59e0b" font-size="10" text-anchor="middle">trans (maturing)</text>';
      m += '<text x="152" y="245" fill="#94a3b8" font-size="10" text-anchor="middle">cisternae 0.5–1.0µm · modify + pack</text>';
      m += '<text x="300" y="245" fill="#94a3b8" font-size="10" text-anchor="middle">→ targets / secretion</text>';
      m += '<text x="230" y="272" fill="#94a3b8" font-size="10" text-anchor="middle">glycoproteins + glycolipids made here</text>';
    } else {
      m += '<rect x="60" y="80" width="160" height="170" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="140" y="108" fill="#ef4444" font-size="13" font-weight="700" text-anchor="middle">LYSOSOME</text>';
      m += '<text x="140" y="134" fill="#cbd5e1" font-size="10" text-anchor="middle">Golgi packaging</text>';
      m += '<text x="140" y="154" fill="#cbd5e1" font-size="10" text-anchor="middle">acid hydrolases</text>';
      m += '<text x="140" y="174" fill="#cbd5e1" font-size="10" text-anchor="middle">digests all four</text>';
      m += '<text x="140" y="194" fill="#cbd5e1" font-size="10" text-anchor="middle">macromolecules</text>';
      m += '<text x="140" y="230" fill="#64748b" font-size="10" text-anchor="middle">DIGESTER</text>';
      m += '<rect x="240" y="80" width="160" height="170" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="320" y="108" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">VACUOLE</text>';
      m += '<text x="320" y="134" fill="#cbd5e1" font-size="10" text-anchor="middle">tonoplast bound</text>';
      m += '<text x="320" y="154" fill="#cbd5e1" font-size="10" text-anchor="middle">water · sap · waste</text>';
      m += '<text x="320" y="174" fill="#cbd5e1" font-size="10" text-anchor="middle">90% of plant cell</text>';
      m += '<text x="320" y="194" fill="#cbd5e1" font-size="10" text-anchor="middle">ions uphill</text>';
      m += '<text x="320" y="230" fill="#64748b" font-size="10" text-anchor="middle">WAREHOUSE</text>';
      m += '<text x="230" y="272" fill="#94a3b8" font-size="10" text-anchor="middle">contractile (Amoeba) · food (protists)</text>';
    }

    // RIGHT: ER key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">ER Split</text>';
    var rows = [
      ["RER", "ribosomes · protein", "#38bdf8"],
      ["SER", "smooth · lipid", "#f59e0b"],
      ["SPACE", "luminal vs extra", "#22c55e"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = endoView === "members" ? "MEMBERS" : (endoView === "golgi" ? "GOLGI" : "ENDS");
    readout(
      cell("View", vName, "#22c55e") +
      cell("Members", "ER · Golgi · lyso · vac", "#22c55e") +
      cell("Flow", "ER → cis → trans", "#f59e0b") +
      cell("Ends", "Digest vs store", "#38bdf8")
    );

    verdict(
      '<span style="color:#22c55e;font-weight:700;">§8.5.3 Endomembrane:</span> ' +
      (endoView === "members" ? "Four coordinated members; mito, chloro and peroxisomes excluded." :
       (endoView === "golgi" ? "Vesicles fuse at cis, modify across cisternae, ship from trans." :
        "Lysosomes digest all four; vacuoles store, concentrate, regulate."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. Power and Plastid Bench (powerhouselab)
// §8.5.4-§8.5.6 (pp. 96-98): mitochondria, plastids, ribosomes.
// -------------------------------------------------------------------------
window.SIMS.powerhouselab = (function(){
  var powView = "mito"; // "mito", "chloro", "ribo"

  function setW(v){
    powView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#dc2626;"></span><span>Mitochondrion (ATP)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Chloroplast (light)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Ribosomes (70S/80S)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-mito">Mitochondrion</button>' +
      '<button class="preset-btn" id="p-chloro">Chloroplast</button>' +
      '<button class="preset-btn" id="p-ribo">Ribosomes</button>';

    document.getElementById("p-mito").onclick = function(){ setActivePreset(this); setW("mito"); };
    document.getElementById("p-chloro").onclick = function(){ setActivePreset(this); setW("chloro"); };
    document.getElementById("p-ribo").onclick = function(){ setActivePreset(this); setW("ribo"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Shared rhyme (§8.5.4–8.5.5):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Double membrane + circular DNA + 70S.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Trades: <b style="color:#38bdf8;">ATP vs light</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Respiration vs photosynthesis.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Power + Plastids (§8.5.4–§8.5.6)</text>';

    if(powView === "mito"){
      m += '<ellipse cx="220" cy="160" rx="150" ry="80" fill="#0f172a" stroke="#dc2626" stroke-width="2.5"/>';
      m += '<ellipse cx="220" cy="160" rx="135" ry="68" fill="none" stroke="#7f1d1d" stroke-width="1.5"/>';
      for(var c = 0; c < 5; c++){
        var fx = 120 + c * 50;
        m += '<path d="M' + fx + ',100 C' + (fx + 18) + ',135 ' + (fx + 18) + ',185 ' + fx + ',220" fill="none" stroke="#dc2626" stroke-width="3"/>';
      }
      m += '<text x="220" y="130" fill="#fca5a5" font-size="10" text-anchor="middle">cristae (area up)</text>';
      m += '<text x="220" y="200" fill="#94a3b8" font-size="10" text-anchor="middle">matrix: circular DNA + 70S</text>';
      m += '<text x="220" y="262" fill="#fca5a5" font-size="11" text-anchor="middle">0.2–1.0µm × 1.0–4.1µm · ATP · fission</text>';
      m += '<text x="220" y="282" fill="#64748b" font-size="10" text-anchor="middle">sausage/cylindrical · numbers vary with activity</text>';
    } else if(powView === "chloro"){
      m += '<ellipse cx="220" cy="160" rx="150" ry="80" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
      for(var g = 0; g < 3; g++){
        var gx = 140 + g * 80;
        for(var s = 0; s < 4; s++){
          m += '<ellipse cx="' + gx + '" cy="' + (130 + s * 16) + '" rx="28" ry="7" fill="#14532d" stroke="#22c55e" stroke-width="1.5"/>';
        }
        m += '<text x="' + gx + '" y="212" fill="#4ade80" font-size="9" text-anchor="middle">granum</text>';
      }
      m += '<line x1="168" y1="150" x2="192" y2="150" stroke="#4ade80" stroke-width="2"/>';
      m += '<line x1="248" y1="150" x2="272" y2="150" stroke="#4ade80" stroke-width="2"/>';
      m += '<text x="220" y="105" fill="#4ade80" font-size="9" text-anchor="middle">stroma lamellae link grana</text>';
      m += '<text x="220" y="262" fill="#4ade80" font-size="11" text-anchor="middle">5–10µm × 2–4µm · chlorophyll · 70S < 80S</text>';
      m += '<text x="220" y="282" fill="#64748b" font-size="10" text-anchor="middle">1 in Chlamydomonas · 20–40 in mesophyll</text>';
    } else {
      m += '<rect x="60" y="90" width="160" height="140" rx="8" fill="#0f172a" stroke="#a78bfa" stroke-width="2"/>';
      m += '<text x="140" y="120" fill="#a78bfa" font-size="14" font-weight="700" text-anchor="middle">70S</text>';
      m += '<text x="140" y="145" fill="#cbd5e1" font-size="11" text-anchor="middle">50S + 30S</text>';
      m += '<text x="140" y="165" fill="#94a3b8" font-size="10" text-anchor="middle">prokaryotes</text>';
      m += '<text x="140" y="185" fill="#94a3b8" font-size="10" text-anchor="middle">mito + chloro</text>';
      m += '<rect x="240" y="90" width="160" height="140" rx="8" fill="#0f172a" stroke="#a78bfa" stroke-width="2"/>';
      m += '<text x="320" y="120" fill="#a78bfa" font-size="14" font-weight="700" text-anchor="middle">80S</text>';
      m += '<text x="320" y="145" fill="#cbd5e1" font-size="11" text-anchor="middle">60S + 40S</text>';
      m += '<text x="320" y="165" fill="#94a3b8" font-size="10" text-anchor="middle">eukaryotic</text>';
      m += '<text x="320" y="185" fill="#94a3b8" font-size="10" text-anchor="middle">cytoplasm</text>';
      m += '<text x="230" y="262" fill="#94a3b8" font-size="10" text-anchor="middle">Palade 1953 · RNA + protein · membrane-free · S = Svedberg</text>';
    }

    // RIGHT: plastid kinds
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Plastid Kinds</text>';
    var rows = [
      ["CHLORO", "chlorophyll · light", "#22c55e"],
      ["CHROMO", "carotene · colour", "#f59e0b"],
      ["LEUCO", "amylo · elaio · aleuro", "#94a3b8"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = powView === "mito" ? "MITO" : (powView === "chloro" ? "CHLORO" : "RIBO");
    readout(
      cell("View", vName, "#dc2626") +
      cell("Mito", "Cristae · ATP · fission", "#dc2626") +
      cell("Chloro", "Grana · light · 70S", "#22c55e") +
      cell("Ribo", "70S / 80S · Palade", "#a78bfa")
    );

    verdict(
      '<span style="color:#dc2626;font-weight:700;">§8.5.4–§8.5.6 Power:</span> ' +
      (powView === "mito" ? "Double membrane, cristae, DNA-bearing matrix — ATP power houses dividing by fission." :
       (powView === "chloro" ? "Double membrane, grana stacks, DNA-bearing stroma — light-trapping plastids." :
        "Membrane-free RNA + protein: 70S (50S + 30S) vs 80S (60S + 40S)."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. Nucleus Gate Bench (nucleuslab)
// §8.5.7-§8.5.10 (pp. 98-100): cytoskeleton, 9+2, centrosome, nucleus.
// -------------------------------------------------------------------------
window.SIMS.nucleuslab = (function(){
  var nucView = "array"; // "array", "cartwheel", "nucleus"

  function setN(v){
    nucView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Axoneme 9+2</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#1d4ed8;"></span><span>Centriole Triplets</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#4338ca;"></span><span>Nuclear Envelope</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-array">9+2 Array</button>' +
      '<button class="preset-btn" id="p-cartwheel">Cartwheel</button>' +
      '<button class="preset-btn" id="p-nucleus">Nucleus Gates</button>';

    document.getElementById("p-array").onclick = function(){ setActivePreset(this); setN("array"); };
    document.getElementById("p-cartwheel").onclick = function(){ setActivePreset(this); setN("cartwheel"); };
    document.getElementById("p-nucleus").onclick = function(){ setActivePreset(this); setN("nucleus"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Scaffold (§8.5.7):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Microtubules + microfilaments + intermediate.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Emergence: <b style="color:#38bdf8;">basal bodies</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Centriole-like roots of cilia.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    var cx = 220, cy = 165;

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Skeleton + Nucleus (§8.5.7–§8.5.10)</text>';

    if(nucView === "array"){
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="95" fill="#0f172a" stroke="#a78bfa" stroke-width="2"/>';
      for(var i = 0; i < 9; i++){
        var a = (-90 + i * 40) * Math.PI / 180;
        var dx = cx + Math.cos(a) * 68, dy = cy + Math.sin(a) * 68;
        m += '<circle cx="' + dx + '" cy="' + dy + '" r="11" fill="none" stroke="#a78bfa" stroke-width="2.5"/>';
        m += '<circle cx="' + (cx + Math.cos(a) * 50) + '" cy="' + (cy + Math.sin(a) * 50) + '" r="2.5" fill="#a78bfa"/>';
        m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + dx + '" y2="' + dy + '" stroke="#475569" stroke-width="1"/>';
      }
      m += '<circle cx="' + (cx - 12) + '" cy="' + cy + '" r="10" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<circle cx="' + (cx + 12) + '" cy="' + cy + '" r="10" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="30" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 3"/>';
      m += '<text x="' + cx + '" y="282" fill="#a78bfa" font-size="11" text-anchor="middle">9 doublets + central pair · sheath + spokes + linkers</text>';
    } else if(nucView === "cartwheel"){
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="95" fill="#0f172a" stroke="#1d4ed8" stroke-width="2"/>';
      for(var j = 0; j < 9; j++){
        var a2 = (-90 + j * 40) * Math.PI / 180;
        var tx = cx + Math.cos(a2) * 68, ty = cy + Math.sin(a2) * 68;
        m += '<g transform="rotate(' + (-90 + j * 40 + 90) + ' ' + tx + ' ' + ty + ')">';
        m += '<circle cx="' + (tx - 8) + '" cy="' + ty + '" r="7" fill="none" stroke="#1d4ed8" stroke-width="2"/>';
        m += '<circle cx="' + tx + '" cy="' + ty + '" r="7" fill="none" stroke="#1d4ed8" stroke-width="2"/>';
        m += '<circle cx="' + (tx + 8) + '" cy="' + ty + '" r="7" fill="none" stroke="#1d4ed8" stroke-width="2"/>';
        m += '</g>';
        m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + tx + '" y2="' + ty + '" stroke="#f59e0b" stroke-width="1.5"/>';
      }
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="#f59e0b" opacity="0.7"/>';
      m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#451a03" font-size="9" font-weight="700" text-anchor="middle">hub</text>';
      m += '<text x="' + cx + '" y="282" fill="#1d4ed8" font-size="11" text-anchor="middle">9 tubulin triplets + protein hub + spokes</text>';
    } else {
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="140" ry="90" fill="#0f172a" stroke="#4338ca" stroke-width="2.5"/>';
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="126" ry="78" fill="none" stroke="#4338ca" stroke-width="1.5"/>';
      m += '<text x="' + cx + '" y="' + (cy - 58) + '" fill="#a5b4fc" font-size="9" text-anchor="middle">perinuclear 10–50nm</text>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="26" fill="#4338ca" opacity="0.5"/>';
      m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#e0e7ff" font-size="10" font-weight="700" text-anchor="middle">nucleolus</text>';
      var pores = [[-100, -50], [100, -50], [-130, 20], [130, 20], [-60, 62], [60, 62]];
      for(var p = 0; p < pores.length; p++){
        m += '<circle cx="' + (cx + pores[p][0]) + '" cy="' + (cy + pores[p][1]) + '" r="8" fill="#22c55e"/>';
      }
      m += '<text x="' + cx + '" y="252" fill="#22c55e" font-size="10" text-anchor="middle">fusion pores: RNA + protein both ways</text>';
      m += '<text x="' + cx + '" y="282" fill="#94a3b8" font-size="10" text-anchor="middle">Brown 1831 · Flemming chromatin · ER-continuous + ribosomes</text>';
    }

    // RIGHT: parts key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Parts Key</text>';
    var rows = [
      ["9+2", "doublets + pair", "#a78bfa"],
      ["CARTWHEEL", "triplets + hub", "#1d4ed8"],
      ["NUCLEUS", "envelope + pores", "#4338ca"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = nucView === "array" ? "9+2 ARRAY" : (nucView === "cartwheel" ? "CARTWHEEL" : "NUCLEUS");
    readout(
      cell("View", vName, "#a78bfa") +
      cell("Axoneme", "9 doublets + pair", "#a78bfa") +
      cell("Centriole", "9 triplets + hub", "#1d4ed8") +
      cell("Pores", "RNA + protein ×2", "#22c55e")
    );

    verdict(
      '<span style="color:#a78bfa;font-weight:700;">§8.5.7–§8.5.10 Core:</span> ' +
      (nucView === "array" ? "Nine doublets + central pair, sheathed, spoked, linked — the 9+2 axoneme." :
       (nucView === "cartwheel" ? "Nine tubulin triplets + protein hub — the centriole cartwheel." :
        "Double envelope + fusion pores gate RNA and protein both ways."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. Chromosome Sorter (chromosomelab)
// §8.5.10-§8.5.11 (pp. 100-102): centromere types + satellite + microbodies.
// -------------------------------------------------------------------------
window.SIMS.chromosomelab = (function(){
  var chrView = "types"; // "types", "satellite", "recap"

  function setC(v){
    chrView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Centromere</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Kinetochores</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#1d4ed8;"></span><span>Chromatids ×2</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-types">Four Types</button>' +
      '<button class="preset-btn" id="p-satellite">Satellite + Kinetochore</button>' +
      '<button class="preset-btn" id="p-recap">Chapter Recap</button>';

    document.getElementById("p-types").onclick = function(){ setActivePreset(this); setC("types"); };
    document.getElementById("p-satellite").onclick = function(){ setActivePreset(this); setC("satellite"); };
    document.getElementById("p-recap").onclick = function(){ setActivePreset(this); setC("recap"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Sort rule (§8.5.10):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Centromere middle → terminal.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Human pack: <b style="color:#38bdf8;">two metre · 46 · 23 pairs</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Packaging in class XII.</div>' +
      '</div>';

    draw(0);
  }

  function chromo(x, y, cenOff, label){
    var s = '<path d="M' + (x - 12) + ',' + (y - 60) + ' L' + (x - 8) + ',' + (y + cenOff) + ' L' + (x - 12) + ',' + (y + 60) +
      ' M' + (x + 12) + ',' + (y - 60) + ' L' + (x + 8) + ',' + (y + cenOff) + ' L' + (x + 12) + ',' + (y + 60) + '" stroke="#1d4ed8" stroke-width="6" fill="none" stroke-linecap="round"/>';
    s += '<circle cx="' + x + '" cy="' + (y + cenOff) + '" r="9" fill="#f59e0b" stroke="#92400e" stroke-width="1.5"/>';
    s += '<text x="' + x + '" y="' + (y + 82) + '" fill="#cbd5e1" font-size="10" font-weight="700" text-anchor="middle">' + label + '</text>';
    return s;
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Chromosomes (§8.5.10–§8.5.11)</text>';

    if(chrView === "types"){
      m += chromo(95, 155, 0, "metacentric");
      m += chromo(180, 155, -12, "sub-metacentric");
      m += chromo(265, 155, -35, "acrocentric");
      m += chromo(350, 155, -58, "telocentric");
      m += '<text x="220" y="100" fill="#f59e0b" font-size="10" text-anchor="middle">centromere slides middle → end</text>';
      m += '<text x="220" y="272" fill="#94a3b8" font-size="10" text-anchor="middle">equal · short+long · tiny+very long · terminal</text>';
    } else if(chrView === "satellite"){
      m += '<path d="M150,80 L146,140 L150,240 M190,80 L194,140 L190,240" stroke="#1d4ed8" stroke-width="7" fill="none" stroke-linecap="round"/>';
      m += '<circle cx="170" cy="140" r="10" fill="#f59e0b" stroke="#92400e" stroke-width="1.5"/>';
      m += '<ellipse cx="152" cy="140" rx="6" ry="14" fill="#22c55e"/>';
      m += '<ellipse cx="188" cy="140" rx="6" ry="14" fill="#22c55e"/>';
      m += '<text x="230" y="136" fill="#22c55e" font-size="10">kinetochore discs</text>';
      m += '<text x="230" y="152" fill="#94a3b8" font-size="10">flank centromere</text>';
      m += '<circle cx="170" cy="80" r="9" fill="#f472b6"/>';
      m += '<line x1="170" y1="89" x2="170" y2="100" stroke="#f472b6" stroke-width="2" stroke-dasharray="3 3"/>';
      m += '<text x="230" y="80" fill="#f472b6" font-size="10">satellite</text>';
      m += '<text x="230" y="96" fill="#94a3b8" font-size="10">past 2nd constriction</text>';
      m += '<text x="220" y="272" fill="#94a3b8" font-size="10" text-anchor="middle">dividing cells only · interphase = chromatin</text>';
    } else {
      var cards = [
        ["Theory", "(i) cells + products · (ii) cells ← cells", "#38bdf8"],
        ["Split", "nucleus? eu : pro · 70S / 80S", "#22c55e"],
        ["Systems", "endomembrane 4 · power 2 · gates 1", "#f59e0b"],
        ["Pack", "two metre · 46 · 23 pairs · XII", "#f472b6"]
      ];
      for(var c = 0; c < cards.length; c++){
        var cy = 66 + c * 58;
        m += '<rect x="60" y="' + cy + '" width="320" height="50" rx="6" fill="#0f172a" stroke="' + cards[c][2] + '" stroke-width="1.5"/>';
        m += '<text x="76" y="' + (cy + 21) + '" fill="' + cards[c][2] + '" font-size="12" font-weight="700">' + cards[c][0] + '</text>';
        m += '<text x="76" y="' + (cy + 40) + '" fill="#cbd5e1" font-size="11">' + cards[c][1] + '</text>';
      }
    }

    // RIGHT: arm key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Arm Key</text>';
    var rows = [
      ["META", "equal arms", "#38bdf8"],
      ["SUB/ACRO", "short + long", "#f59e0b"],
      ["TELO", "terminal", "#22c55e"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = chrView === "types" ? "TYPES" : (chrView === "satellite" ? "SATELLITE" : "RECAP");
    readout(
      cell("View", vName, "#f59e0b") +
      cell("Types", "Meta · sub · acro · telo", "#38bdf8") +
      cell("Extras", "Satellite · microbodies", "#f472b6") +
      cell("Human", "46 · 23 pairs", "#22c55e")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">§8.5.10 Chromosomes:</span> ' +
      (chrView === "types" ? "Centromere middle → terminal sorts meta, sub-meta, acro, telo." :
       (chrView === "satellite" ? "Kinetochore discs flank the centromere; satellites dangle past second constrictions." :
        "Two metres over 46 chromosomes — plus microbodies and the summary extras."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-107 —
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
