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
// 1. SIMULATION 1: Whittaker Five Kingdom Matrix (fivekingdoms)
// -------------------------------------------------------------------------
window.SIMS.fivekingdoms = (function(){
  var kIdx = 0; // 0: Monera, 1: Protista, 2: Fungi, 3: Plantae, 4: Animalia

  var kData = [
    { name: "Monera", cell: "Prokaryotic", wall: "Noncellulosic (Polysaccharide + Amino Acid)", nuc: "Absent", body: "Cellular", nut: "Autotrophic (chemo/photo) & Heterotrophic", col: "#38bdf8" },
    { name: "Protista", cell: "Eukaryotic", wall: "Present in some (Silica/Cellulose)", nuc: "Present", body: "Cellular", nut: "Autotrophic (photosynthetic) & Heterotrophic", col: "#10b981" },
    { name: "Fungi", cell: "Eukaryotic", wall: "Present (Chitin & Glucans)", nuc: "Present", body: "Multicellular / Loose Tissue", nut: "Heterotrophic (Absorptive / Saprophytic / Parasitic)", col: "#f59e0b" },
    { name: "Plantae", cell: "Eukaryotic", wall: "Present (Cellulose)", nuc: "Present", body: "Tissue / Organ", nut: "Autotrophic (Photosynthetic)", col: "#84cc16" },
    { name: "Animalia", cell: "Eukaryotic", wall: "Absent", nuc: "Present", body: "Tissue / Organ / Organ System", nut: "Heterotrophic (Holozoic / Ingestive)", col: "#ec4899" }
  ];

  function setK(idx){
    kIdx = idx;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Monera</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Protista</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fungi</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#84cc16;"></span><span>Plantae</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Animalia</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-mon">Monera</button>' +
      '<button class="preset-btn" id="p-pro">Protista</button>' +
      '<button class="preset-btn" id="p-fun">Fungi</button>' +
      '<button class="preset-btn" id="p-pla">Plantae</button>' +
      '<button class="preset-btn" id="p-ani">Animalia</button>';

    document.getElementById("p-mon").onclick = function(){ setActivePreset(this); setK(0); };
    document.getElementById("p-pro").onclick = function(){ setActivePreset(this); setK(1); };
    document.getElementById("p-fun").onclick = function(){ setActivePreset(this); setK(2); };
    document.getElementById("p-pla").onclick = function(){ setActivePreset(this); setK(3); };
    document.getElementById("p-ani").onclick = function(){ setActivePreset(this); setK(4); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>NCERT Table 2.1: Characteristics of the Five Kingdoms (R.H. Whittaker 1969)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Click kingdoms above to inspect Whittaker five diagnostic criteria.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var d = kData[kIdx];

    var m = '<rect width="720" height="300" fill="#09131d"/>';
    // Kingdom cards row on top
    for(var i = 0; i < 5; i++){
      var k = kData[i];
      var isSel = (i === kIdx);
      var bx = 40 + i * 128;
      m += '<rect x="' + bx + '" y="30" width="120" height="46" rx="6" fill="' + (isSel ? k.col : '#0f172a') + '" fill-opacity="' + (isSel ? '0.25' : '1') + '" stroke="' + k.col + '" stroke-width="' + (isSel ? '2.5' : '1') + '"/>';
      m += '<text x="' + (bx + 60) + '" y="58" fill="' + (isSel ? '#ffffff' : k.col) + '" font-size="13" font-weight="700" text-anchor="middle">' + k.name + '</text>';
    }

    // Detailed Table 2.1 Matrix Card
    m += '<rect x="40" y="90" width="640" height="185" rx="8" fill="#0b1726" stroke="' + d.col + '" stroke-width="1.5"/>';
    m += '<text x="65" y="118" fill="' + d.col + '" font-size="16" font-weight="700">Kingdom ' + d.name + ' · Diagnostic Profile (Table 2.1)</text>';

    var rows = [
      { label: "Cell Type", val: d.cell, icon: "🔬" },
      { label: "Cell Wall", val: d.wall, icon: "🛡️" },
      { label: "Nuclear Membrane", val: d.nuc, icon: "🧬" },
      { label: "Body Organisation", val: d.body, icon: "🧫" },
      { label: "Mode of Nutrition", val: d.nut, icon: "🍃" }
    ];

    for(var r = 0; r < rows.length; r++){
      var item = rows[r];
      var ry = 142 + r * 25;
      m += '<text x="65" y="' + ry + '" fill="#94a3b8" font-size="11" font-weight="600">' + item.label + ':</text>';
      m += '<text x="210" y="' + ry + '" fill="#f8fafc" font-size="12" font-weight="600">' + item.val + '</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Kingdom", d.name, d.col) +
      cell("Cell Nature", d.cell, "#38bdf8") +
      cell("Cell Wall", d.wall.split(" ")[0], "#f59e0b") +
      cell("Nutrition", d.nut.split(" ")[0], "#10b981")
    );

    verdict(
      '<span style="color:' + d.col + ';font-weight:700;">Whittaker 1969 Five Kingdom Criterion:</span> ' +
      'Kingdom ' + d.name + ' is classified by its ' + d.cell.toLowerCase() + ' cell structure, ' + d.body.toLowerCase() + ' body organization, and ' + d.nut.toLowerCase() + ' mode of nutrition.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Bacterial Shapes, Archaea & Heterocyst (bacterialmorphology)
// -------------------------------------------------------------------------
window.SIMS.bacterialmorphology = (function(){
  var bMode = "shapes"; // "shapes", "nostoc", "mycoplasma"

  function setMode(m){
    bMode = m;
    draw(0);
  }

  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Bacterial Body</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Heterocyst (N₂ Fixation)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Flagella / Sheath</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-sh">Four Bacterial Shapes</button>' +
      '<button class="preset-btn" id="p-nos">Nostoc Filament &amp; Heterocyst</button>' +
      '<button class="preset-btn" id="p-myc">Mycoplasma (Smallest Living Cell)</button>';

    document.getElementById("p-sh").onclick = function(){ setActivePreset(this); setMode("shapes"); };
    document.getElementById("p-nos").onclick = function(){ setActivePreset(this); setMode("nostoc"); };
    document.getElementById("p-myc").onclick = function(){ setActivePreset(this); setMode("mycoplasma"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Kingdom Monera Structural Architecture</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Examine the four morphological shapes (Coccus, Bacillus, Spirillum, Vibrio), cyanobacterial heterocysts, and wall-less Mycoplasma.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(bMode === "shapes"){
      // Four shapes
      m += '<text x="50" y="45" fill="#f8fafc" font-size="14" font-weight="700">Four Fundamental Bacterial Morphologies (NCERT Fig 2.1)</text>';
      var shapes = [
        { name: "Cocci (Spherical)", x: 100, y: 150 },
        { name: "Bacilli (Rod)", x: 260, y: 150 },
        { name: "Spirilla (Spiral)", x: 430, y: 150 },
        { name: "Vibrio (Comma)", x: 600, y: 150 }
      ];

      // Cocci
      m += '<circle cx="100" cy="140" r="16" fill="#38bdf8"/>';
      m += '<circle cx="125" cy="150" r="16" fill="#38bdf8"/>';
      m += '<circle cx="85" cy="165" r="16" fill="#38bdf8"/>';
      m += '<circle cx="115" cy="175" r="16" fill="#38bdf8"/>';
      m += '<text x="100" y="225" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">Coccus (pl. Cocci)</text>';

      // Bacilli
      m += '<rect x="230" y="130" width="55" height="24" rx="12" fill="#10b981"/>';
      m += '<rect x="250" y="165" width="55" height="24" rx="12" fill="#10b981"/>';
      m += '<text x="260" y="225" fill="#10b981" font-size="12" font-weight="700" text-anchor="middle">Bacillus (pl. Bacilli)</text>';

      // Spirilla with flagella
      m += '<path d="M 400,160 Q 415,130 430,160 T 460,160" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>';
      m += '<path d="M 460,160 Q 475,150 490,140" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="430" y="225" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">Spirillum (pl. Spirilla)</text>';

      // Vibrio
      m += '<path d="M 585,140 Q 615,145 605,175" fill="none" stroke="#ec4899" stroke-width="12" stroke-linecap="round"/>';
      m += '<text x="600" y="225" fill="#ec4899" font-size="12" font-weight="700" text-anchor="middle">Vibrium (Comma-shaped)</text>';

    } else if(bMode === "nostoc"){
      // Nostoc filament with heterocyst
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Nostoc Filament: Nitrogen-Fixing Cyanobacterium (Fig 2.2)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Surrounded by mucilaginous gelatinous sheath; specialized anaerobic Heterocyst</text>';

      // Cyanobacterial cells chain
      var cx0 = 75, cy0 = 150;
      for(var c = 0; c < 15; c++){
        var cx = cx0 + c * 38;
        var cy = cy0 + Math.sin(c * 0.8 + t) * 12;
        var isHet = (c === 7);
        if(isHet){
          // Large thick-walled heterocyst
          m += '<circle cx="' + cx + '" cy="' + cy + '" r="22" fill="#047857" stroke="#f59e0b" stroke-width="4"/>';
          m += '<text x="' + cx + '" y="' + (cy - 30) + '" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">HETEROCYST</text>';
          m += '<text x="' + cx + '" y="' + (cy + 34) + '" fill="#fcd34d" font-size="9" text-anchor="middle">[Anaerobic N₂-Fixation]</text>';
        } else {
          m += '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="#10b981" stroke="#065f46" stroke-width="2"/>';
        }
      }
      m += '<text x="360" y="240" fill="#94a3b8" font-size="11" text-anchor="middle">Gelatinous / Mucilaginous Sheath Enveloping Colony</text>';

    } else {
      // Mycoplasma
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ec4899" font-size="15" font-weight="700">Mycoplasma (PPLO): Smallest Living Cells (0.1–0.3 µm)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Completely lack cell wall · Penicillin-resistant · Anaerobic survival</text>';

      // Pleomorphic amoeboid-like bacterial membrane
      m += '<path d="M 260,150 Q 300,100 370,120 T 430,160 T 380,210 T 290,190 Z" fill="#831843" fill-opacity="0.4" stroke="#ec4899" stroke-width="3"/>';
      m += '<circle cx="340" cy="160" r="15" fill="#f43f5e"/>'; // Nucleoid
      m += '<text x="340" y="164" fill="#ffffff" font-size="9" text-anchor="middle">DNA</text>';
      m += '<text x="350" y="245" fill="#fbcfe8" font-size="12" font-weight="600" text-anchor="middle">Pleomorphic Membrane (Sterol-Stabilized Triple Layer)</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Category", "Kingdom Monera", "#38bdf8") +
      cell("Focus Taxon", bMode === "shapes" ? "Eubacteria (4 Shapes)" : (bMode === "nostoc" ? "Nostoc (Cyanobacteria)" : "Mycoplasma"), "#10b981") +
      cell("Cell Wall", bMode === "mycoplasma" ? "ABSOLUTELY ABSENT" : "Peptidoglycan", bMode === "mycoplasma" ? "#ef4444" : "#f59e0b") +
      cell("Dimension", bMode === "mycoplasma" ? "0.1–0.3 µm" : "1–10 µm", "#a855f7")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Moneran Hallmarks:</span> ' +
      (bMode === "shapes" ? "Bacteria occur in four typical morphological forms: spherical cocci, rod bacilli, spiral spirilla, and comma vibrio." :
       (bMode === "nostoc" ? "Cyanobacteria Nostoc fix atmospheric nitrogen inside thick-walled anaerobic heterocysts." :
        "Mycoplasma are the smallest living cells known (0.3 µm) and survive without oxygen, completely lacking a cell wall."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Protistan Frustules, Red Tides & Euglena (protistalab)
// -------------------------------------------------------------------------
window.SIMS.protistalab = (function(){
  var pGroup = "diatom"; // "diatom", "dinoflagellate", "euglena"

  function setP(g){
    pGroup = g;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Diatom (Silica Frustule)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Dinoflagellate (Red Tide)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Euglenoid (Mixotrophic)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dia">Diatom (Chrysophyte)</button>' +
      '<button class="preset-btn" id="p-dino">Dinoflagellate (Gonyaulax)</button>' +
      '<button class="preset-btn" id="p-eug">Euglena (Mixotroph)</button>';

    document.getElementById("p-dia").onclick = function(){ setActivePreset(this); setP("diatom"); };
    document.getElementById("p-dino").onclick = function(){ setActivePreset(this); setP("dinoflagellate"); };
    document.getElementById("p-eug").onclick = function(){ setActivePreset(this); setP("euglena"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Kingdom Protista: Photosynthetic &amp; Mixotrophic Lineages</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Explore indestructible diatom silica walls, toxic dinoflagellate red tides, and flexible Euglena pellicles.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(pGroup === "diatom"){
      // Diatom soap-box
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Diatom Frustule: Overlapping Silica Shells (Soap-Box Architecture)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Indestructible biogenic amorphous silica · Chief producers in the oceans · Diatomaceous earth</text>';

      // Epitheca (lid)
      m += '<rect x="220" y="115" width="280" height="35" rx="6" fill="#0284c7" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="360" y="137" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Epitheca (Upper Shell / Lid)</text>';

      // Hypotheca (base)
      m += '<rect x="235" y="145" width="250" height="35" rx="4" fill="#0369a1" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="360" y="167" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Hypotheca (Lower Shell / Base)</text>';

      m += '<text x="360" y="215" fill="#fcd34d" font-size="12" text-anchor="middle">Amorphous SiO₂ · Resists decay → Millions of years of Diatomaceous Earth</text>';

    } else if(pGroup === "dinoflagellate"){
      // Dinoflagellate with two flagella
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ef4444" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ef4444" font-size="15" font-weight="700">Dinoflagellate (Gonyaulax) &amp; Red Tides</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Stiff cellulosic armor plates · Two flagella (longitudinal &amp; transverse in furrow) · Toxin release</text>';

      // Armored body
      m += '<polygon points="360,95 410,135 395,190 325,190 310,135" fill="#991b1b" stroke="#f87171" stroke-width="2"/>';
      // Transverse furrow
      m += '<line x1="310" y1="140" x2="410" y2="140" stroke="#fca5a5" stroke-width="3"/>';
      // Flagella
      m += '<path d="M 360,190 Q 350,225 365,250" fill="none" stroke="#fca5a5" stroke-width="2.5"/>';
      m += '<text x="375" y="235" fill="#fca5a5" font-size="10">Longitudinal flagellum</text>';
      m += '<text x="430" y="145" fill="#fca5a5" font-size="10">Transverse flagellum</text>';
      m += '<text x="360" y="215" fill="#ef4444" font-size="11" font-weight="700" text-anchor="middle">Saxitoxin Secreting Bloom → Fish Mortality</text>';

    } else {
      // Euglena
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Euglena viridis: Mixotrophic Protist with Pellicle</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Flexible proteinaceous pellicle · Two flagella (one long, one short) · Identical pigments to plants</text>';

      // Spindle shape
      m += '<path d="M 260,150 C 310,110 410,110 460,150 C 410,190 310,190 260,150 Z" fill="#065f46" stroke="#10b981" stroke-width="2.5"/>';
      // Long whip flagellum
      m += '<path d="M 260,150 Q 220,120 200,100 Q 180,140 160,120" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
      // Stigma / eyespot
      m += '<circle cx="280" cy="145" r="5" fill="#ef4444"/>';
      m += '<text x="280" y="135" fill="#ef4444" font-size="9" text-anchor="middle">Eyespot</text>';
      // Chloroplasts
      m += '<ellipse cx="360" cy="140" rx="14" ry="7" fill="#84cc16"/>';
      m += '<ellipse cx="390" cy="155" rx="14" ry="7" fill="#84cc16"/>';
      m += '<ellipse cx="330" cy="160" rx="14" ry="7" fill="#84cc16"/>';

      m += '<text x="360" y="230" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">Mixotrophic: Photosynthesis in Sun ⇄ Predatory in Darkness</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Protist Group", pGroup === "diatom" ? "Chrysophytes (Diatom)" : (pGroup === "dinoflagellate" ? "Dinoflagellates" : "Euglenoids"), "#38bdf8") +
      cell("Outer Envelope", pGroup === "diatom" ? "Silica Frustule" : (pGroup === "dinoflagellate" ? "Cellulose Plates" : "Protein Pellicle"), "#10b981") +
      cell("Ecological Role", pGroup === "diatom" ? "Chief Ocean Producer" : (pGroup === "dinoflagellate" ? "Red Tide Producer" : "Mixotrophic Switch"), "#f59e0b") +
      cell("Mobility", pGroup === "diatom" ? "Passive Floater" : "2 Flagella", "#ec4899")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Protistan Diversity:</span> ' +
      (pGroup === "diatom" ? "Diatoms have overlapping indestructible silica walls and are the chief producers in the oceans." :
       (pGroup === "dinoflagellate" ? "Dinoflagellates possess two flagella in grooves; rapid proliferation of red forms like Gonyaulax causes destructive red tides." :
        "Euglenoids have a flexible pellicle and are mixotrophic, switching between plant-like autotrophy and animal-like heterotrophy."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Protozoan Motility & Phagocytosis (protozoanlab)
// -------------------------------------------------------------------------
window.SIMS.protozoanlab = (function(){
  var pType = "amoeba"; // "amoeba", "paramoecium", "trypanosoma", "plasmodium"

  function setType(t){
    pType = t;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Amoeboid (Pseudopodia)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Ciliated (Gullet)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Flagellated</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Sporozoan</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-am">Amoeba (Pseudopodia)</button>' +
      '<button class="preset-btn" id="p-par">Paramoecium (Cilia &amp; Gullet)</button>' +
      '<button class="preset-btn" id="p-try">Trypanosoma (Sleeping Sickness)</button>' +
      '<button class="preset-btn" id="p-pla">Plasmodium (Malarial Sporozoite)</button>';

    document.getElementById("p-am").onclick = function(){ setActivePreset(this); setType("amoeba"); };
    document.getElementById("p-par").onclick = function(){ setActivePreset(this); setType("paramoecium"); };
    document.getElementById("p-try").onclick = function(){ setActivePreset(this); setMode("trypanosoma"); };
    document.getElementById("p-pla").onclick = function(){ setActivePreset(this); setType("plasmodium"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>The Four Major Groups of Protozoa (NCERT 2.2.5)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Compare locomotory organelle adaptations: pseudopodia, ciliary gullet currents, flagella, and parasitic sporozoites.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(pType === "amoeba"){
      // Amoeba phagocytosis
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Amoeboid Protozoan (Amoeba proteus / Entamoeba histolytica)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Pseudopodia (false feet) for locomotion and phagocytic food capture</text>';

      // Lobose pseudopodia encircling food
      m += '<path d="M 280,140 Q 320,100 370,120 Q 420,105 450,140 Q 480,180 430,200 Q 370,220 320,195 Q 260,180 280,140 Z" fill="#0369a1" fill-opacity="0.5" stroke="#38bdf8" stroke-width="2"/>';
      // Food particle engulfed
      m += '<circle cx="390" cy="155" r="8" fill="#10b981"/>';
      m += '<text x="390" y="142" fill="#10b981" font-size="9" text-anchor="middle">Food Vacuole</text>';
      m += '<text x="360" y="240" fill="#cbd5e1" font-size="11" text-anchor="middle">Marine forms possess silica shells; Entamoeba causes amoebic dysentery</text>';

    } else if(pType === "paramoecium"){
      // Paramoecium slipper shape with cilia and gullet
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Ciliated Protozoan (Paramoecium caudatum)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Thousands of beating cilia · Permanent oral groove &amp; gullet (cytostome)</text>';

      // Slipper body
      m += '<path d="M 270,150 C 310,110 400,110 450,135 C 470,150 460,185 430,195 C 380,205 310,195 270,150 Z" fill="#065f46" fill-opacity="0.5" stroke="#10b981" stroke-width="2"/>';
      // Oral groove / gullet
      m += '<path d="M 360,135 Q 380,155 365,175" fill="none" stroke="#f59e0b" stroke-width="3"/>';
      m += '<text x="410" y="160" fill="#f59e0b" font-size="10">Gullet (Cytostome)</text>';
      // Tiny cilia rim
      for(var ci = 0; ci < 24; ci++){
        var ang = (ci / 24) * Math.PI * 2;
        var cx = 360 + Math.cos(ang) * 90;
        var cy = 155 + Math.sin(ang) * 35;
        m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(ang)*8) + '" y2="' + (cy + Math.sin(ang)*8) + '" stroke="#6ee7b7" stroke-width="1.5"/>';
      }
      m += '<text x="360" y="240" fill="#cbd5e1" font-size="11" text-anchor="middle">Coordinated ciliary rows drive water laden with food directly into the gullet</text>';

    } else if(pType === "trypanosoma"){
      // Trypanosoma
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Flagellated Protozoan (Trypanosoma brucei)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Free-living or parasitic · Whip-like flagellum · Causes Sleeping Sickness</text>';

      // Undulating spindle body
      m += '<path d="M 260,160 Q 320,120 380,170 T 460,140" fill="none" stroke="#d97706" stroke-width="14" stroke-linecap="round"/>';
      m += '<path d="M 260,160 Q 320,105 380,155 T 460,125 L 485,115" fill="none" stroke="#fcd34d" stroke-width="2.5"/>';
      m += '<text x="525" y="120" fill="#fcd34d" font-size="10">Free Flagellum</text>';
      m += '<text x="360" y="240" fill="#cbd5e1" font-size="11" text-anchor="middle">Parasitic flagellates transmitted by insect vectors like the tsetse fly</text>';

    } else {
      // Plasmodium sporozoite
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ec4899" font-size="15" font-weight="700">Sporozoan (Plasmodium vivax / falciparum)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Endoparasites · Infectious spore-like stage · Causative agent of Malaria</text>';

      // Crescent sickle sporozoite
      m += '<path d="M 270,160 Q 350,110 450,155 Q 360,140 270,160 Z" fill="#be185d" stroke="#f472b6" stroke-width="2"/>';
      m += '<circle cx="360" cy="143" r="6" fill="#fbcfe8"/>';
      m += '<text x="360" y="132" fill="#fbcfe8" font-size="9" text-anchor="middle">Apical Complex</text>';
      m += '<text x="360" y="240" fill="#cbd5e1" font-size="11" text-anchor="middle">Lacks locomotory organelles in adult; possesses infectious sporozoite stage</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Protozoan Group", pType.toUpperCase(), "#38bdf8") +
      cell("Locomotion", pType === "amoeba" ? "Pseudopodia" : (pType === "paramoecium" ? "Cilia" : (pType === "trypanosoma" ? "Flagella" : "None (Gliding)")), "#10b981") +
      cell("Representative", pType === "amoeba" ? "Amoeba / Entamoeba" : (pType === "paramoecium" ? "Paramoecium" : (pType === "trypanosoma" ? "Trypanosoma" : "Plasmodium")), "#f59e0b") +
      cell("Pathology", pType === "trypanosoma" ? "Sleeping Sickness" : (pType === "plasmodium" ? "Malaria" : (pType === "amoeba" ? "Dysentery" : "Free-living")), "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Protozoan Classification:</span> ' +
      'Divided into four major classes based on locomotory organelles: Amoeboids (pseudopodia), Flagellates (flagella), Ciliates (thousands of cilia & gullet), and Sporozoans (infectious spore stage, no adult locomotory organs).'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Fungal Classes & Spore Cycle (fungallifecycle)
// -------------------------------------------------------------------------
window.SIMS.fungallifecycle = (function(){
  var fClass = "ascomycetes"; // "phycomycetes", "ascomycetes", "basidiomycetes", "deuteromycetes"

  function setFC(c){
    fClass = c;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Phycomycetes</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Ascomycetes</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Basidiomycetes</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Deuteromycetes</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-phy">Phycomycetes (Mucor)</button>' +
      '<button class="preset-btn active" id="p-asc">Ascomycetes (Sac Fungi)</button>' +
      '<button class="preset-btn" id="p-bas">Basidiomycetes (Club Fungi)</button>' +
      '<button class="preset-btn" id="p-deu">Deuteromycetes (Imperfect)</button>';

    document.getElementById("p-phy").onclick = function(){ setActivePreset(this); setFC("phycomycetes"); };
    document.getElementById("p-asc").onclick = function(){ setActivePreset(this); setFC("ascomycetes"); };
    document.getElementById("p-bas").onclick = function(){ setActivePreset(this); setFC("basidiomycetes"); };
    document.getElementById("p-deu").onclick = function(){ setActivePreset(this); setFC("deuteromycetes"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Kingdom Fungi: Mycelial &amp; Spore Architecture</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Compare endogenous ascospores in asci vs exogenous basidiospores on basidia, coenocytic hyphae, and asexual conidia.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(fClass === "ascomycetes"){
      // Ascus with 8 ascospores
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Ascomycetes (Sac Fungi): 8 Endogenous Ascospores in an Ascus</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Septate branched mycelium · Conidia (asexual, exogenous) · Penicillium, Aspergillus, Neurospora</text>';

      // Sac-like ascus
      m += '<path d="M 280,210 C 260,180 260,110 310,95 C 360,110 360,180 340,210 Z" fill="#065f46" stroke="#10b981" stroke-width="2.5"/>';
      // 8 linear ascospores inside
      for(var s = 0; s < 8; s++){
        var sy = 112 + s * 11;
        m += '<ellipse cx="305" cy="' + sy + '" rx="8" ry="4" fill="#a7f3d0" stroke="#047857"/>';
      }
      m += '<text x="420" y="130" fill="#a7f3d0" font-size="12" font-weight="700">Ascus (Sac)</text>';
      m += '<text x="420" y="150" fill="#94a3b8" font-size="11">Contains 8 haploid ascospores</text>';
      m += '<text x="420" y="168" fill="#94a3b8" font-size="11">Produced endogenously via meiosis</text>';
      m += '<text x="420" y="186" fill="#94a3b8" font-size="11">Ascocarps (fruiting bodies)</text>';

    } else if(fClass === "basidiomycetes"){
      // Basidium with 4 exogenous basidiospores
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Basidiomycetes (Club Fungi): 4 Exogenous Basidiospores on a Basidium</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Dikaryotic mycelium · Agaricus (mushroom), Ustilago (smut), Puccinia (rust)</text>';

      // Club-shaped basidium
      m += '<path d="M 290,210 L 290,140 C 280,120 330,120 320,140 L 320,210 Z" fill="#78350f" stroke="#f59e0b" stroke-width="2.5"/>';
      // 4 sterigmata and basidiospores on top
      var bx = [285, 298, 312, 325];
      for(var b = 0; b < 4; b++){
        m += '<line x1="' + (bx[b] - 2) + '" y1="125" x2="' + bx[b] + '" y2="110" stroke="#f59e0b" stroke-width="2"/>';
        m += '<circle cx="' + bx[b] + '" cy="104" r="6" fill="#fde68a" stroke="#d97706" stroke-width="1.5"/>';
      }
      m += '<text x="420" y="130" fill="#fde68a" font-size="12" font-weight="700">Basidium (Club)</text>';
      m += '<text x="420" y="150" fill="#94a3b8" font-size="11">Bears 4 haploid basidiospores</text>';
      m += '<text x="420" y="168" fill="#94a3b8" font-size="11">Produced strictly EXOGENOUSLY</text>';
      m += '<text x="420" y="186" fill="#94a3b8" font-size="11">Basidiocarps (mushrooms/bracket fungi)</text>';

    } else if(fClass === "phycomycetes"){
      // Phycomycetes: Aseptate coenocytic
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Phycomycetes: Aseptate Coenocytic Mycelium &amp; Sporangium</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Aquatic habitats / decaying moist wood · Mucor, Rhizopus, Albugo (parasitic on mustard)</text>';

      // Sporangiophore and globular sporangium
      m += '<line x1="305" y1="210" x2="305" y2="135" stroke="#38bdf8" stroke-width="3"/>';
      m += '<circle cx="305" cy="115" r="25" fill="#0369a1" stroke="#38bdf8" stroke-width="2.5"/>';
      // Spores inside
      for(var sp = 0; sp < 12; sp++){
        var sx = 295 + (sp % 4) * 7;
        var sy = 105 + Math.floor(sp / 4) * 7;
        m += '<circle cx="' + sx + '" cy="' + sy + '" r="2" fill="#bae6fd"/>';
      }
      m += '<text x="420" y="130" fill="#bae6fd" font-size="12" font-weight="700">Sporangium</text>';
      m += '<text x="420" y="150" fill="#94a3b8" font-size="11">Asexual spores endogenously produced</text>';
      m += '<text x="420" y="168" fill="#94a3b8" font-size="11">Zygospore formed by gametic fusion</text>';
      m += '<text x="420" y="186" fill="#94a3b8" font-size="11">Hyphae: Coenocytic, aseptate</text>';

    } else {
      // Deuteromycetes
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ec4899" font-size="15" font-weight="700">Deuteromycetes: The Imperfect Fungi (Only Asexual Stage Known)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Septate mycelium · Conidiophore with conidia · Alternaria, Colletotrichum, Trichoderma</text>';

      // Conidiophore with chained conidia
      m += '<line x1="305" y1="210" x2="305" y2="140" stroke="#ec4899" stroke-width="3"/>';
      for(var cn = 0; cn < 5; cn++){
        var cy = 130 - cn * 10;
        m += '<circle cx="305" cy="' + cy + '" r="5" fill="#fbcfe8" stroke="#be185d"/>';
      }
      m += '<text x="420" y="130" fill="#fbcfe8" font-size="12" font-weight="700">Conidia (Asexual Spores)</text>';
      m += '<text x="420" y="150" fill="#94a3b8" font-size="11">Produced exogenously on conidiophores</text>';
      m += '<text x="420" y="168" fill="#94a3b8" font-size="11">Sexual reproduction unknown / absent</text>';
      m += '<text x="420" y="186" fill="#94a3b8" font-size="11">Major decomposers of litter &amp; mineral cyclers</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Fungal Class", fClass.toUpperCase(), "#f59e0b") +
      cell("Mycelium", fClass === "phycomycetes" ? "Aseptate, Coenocytic" : "Septate & Branched", "#38bdf8") +
      cell("Sexual Spores", fClass === "ascomycetes" ? "8 Ascospores (Endogenous)" : (fClass === "basidiomycetes" ? "4 Basidiospores (Exogenous)" : (fClass === "phycomycetes" ? "Zygospores" : "None Known")), "#10b981") +
      cell("Key Genera", fClass === "ascomycetes" ? "Penicillium / Neurospora" : (fClass === "basidiomycetes" ? "Agaricus / Puccinia" : (fClass === "phycomycetes" ? "Mucor / Rhizopus" : "Alternaria")), "#ec4899")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Fungal Spore Diagnostic:</span> ' +
      (fClass === "ascomycetes" ? "Ascomycetes produce 8 ascospores endogenously inside sac-like asci." :
       (fClass === "basidiomycetes" ? "Basidiomycetes produce 4 basidiospores exogenously on club-shaped basidia." :
        (fClass === "phycomycetes" ? "Phycomycetes have coenocytic aseptate hyphae and produce endogenous sporangiospores." :
         "Deuteromycetes reproduce only via asexual conidia; when sexual stages are found, they are reclassified into Ascomycetes or Basidiomycetes.")))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Alternation of Generations (alternationofgen)
// -------------------------------------------------------------------------
window.SIMS.alternationofgen = (function(){
  var dominantPhase = "haplodiplontic"; // "gametophyte", "haplodiplontic", "sporophyte"

  function setPhase(p){
    dominantPhase = p;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Gametophyte Phase (n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sporophyte Phase (2n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Meiosis / Syngamy</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-bryo">Bryophyte (Gametophyte Dominant)</button>' +
      '<button class="preset-btn" id="p-angio">Angiosperm (Sporophyte Dominant)</button>';

    document.getElementById("p-bryo").onclick = function(){ setActivePreset(this); setPhase("gametophyte"); };
    document.getElementById("p-angio").onclick = function(){ setActivePreset(this); setPhase("sporophyte"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Plant Kingdom: Alternation of Generations Life Cycle Wheel (NCERT 2.4)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Trace the cyclic alternation between the haploid gametophyte (n) and diploid sporophyte (2n).</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var isG = (dominantPhase === "gametophyte");

    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="50" y="45" fill="#f8fafc" font-size="14" font-weight="700">Alternation of Generations (' + (isG ? 'Bryophytes: Gametophyte Dominant' : 'Angiosperms: Sporophyte Dominant') + ')</text>';

    var cx = 360, cy = 160, r = 85;

    // Top half: Haploid Gametophyte (n) in Green
    m += '<path d="M ' + (cx - r) + ',' + cy + ' A ' + r + ',' + r + ' 0 0,1 ' + (cx + r) + ',' + cy + '" fill="none" stroke="#10b981" stroke-width="12"/>';
    // Bottom half: Diploid Sporophyte (2n) in Blue
    m += '<path d="M ' + (cx + r) + ',' + cy + ' A ' + r + ',' + r + ' 0 0,1 ' + (cx - r) + ',' + cy + '" fill="none" stroke="#38bdf8" stroke-width="12"/>';

    // Key transition nodes
    // Left: Meiosis (2n -> n)
    m += '<circle cx="' + (cx - r) + '" cy="' + cy + '" r="10" fill="#ef4444"/>';
    m += '<text x="' + (cx - r - 15) + '" y="' + (cy + 4) + '" fill="#ef4444" font-size="11" font-weight="700" text-anchor="end">MEIOSIS (R!)</text>';

    // Right: Syngamy / Fertilization (n + n -> 2n)
    m += '<circle cx="' + (cx + r) + '" cy="' + cy + '" r="10" fill="#f59e0b"/>';
    m += '<text x="' + (cx + r + 15) + '" y="' + (cy + 4) + '" fill="#f59e0b" font-size="11" font-weight="700">SYNGAMY</text>';

    // Top label: Gametophyte (n)
    m += '<text x="' + cx + '" y="' + (cy - 45) + '" fill="#10b981" font-size="14" font-weight="700" text-anchor="middle">HAPLOID GAMETOPHYTE (n)</text>';
    m += '<text x="' + cx + '" y="' + (cy - 25) + '" fill="#94a3b8" font-size="10" text-anchor="middle">Produces Gametes via Mitosis</text>';

    // Bottom label: Sporophyte (2n)
    m += '<text x="' + cx + '" y="' + (cy + 40) + '" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">DIPLOID SPOROPHYTE (2n)</text>';
    m += '<text x="' + cx + '" y="' + (cy + 60) + '" fill="#94a3b8" font-size="10" text-anchor="middle">Produces Haploid Spores via Meiosis</text>';

    svg.innerHTML = m;

    readout(
      cell("Pattern", isG ? "Haplodiplontic (Bryophyte)" : "Diplontic (Angiosperm)", "#38bdf8") +
      cell("Dominant Phase", isG ? "Gametophyte (n, green)" : "Sporophyte (2n, plant body)", "#10b981") +
      cell("Spore Formation", "Meiosis in Sporangium", "#ef4444") +
      cell("Gamete Fusion", "Syngamy → Zygote (2n)", "#f59e0b")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Alternation of Generations:</span> ' +
      'All embryophytes alternate between a haploid gamete-producing gametophyte (n) and a diploid spore-producing sporophyte (2n). The relative length and independence of these phases shift from gametophyte-dominant mosses to sporophyte-dominant flowering plants.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Acellular Entities Dissection (virallab)
// -------------------------------------------------------------------------
window.SIMS.virallab = (function(){
  var aType = "phage"; // "phage", "viroid", "prion", "lichen"

  function setA(t){
    aType = t;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Bacteriophage</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Viroid (Free RNA)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Prion (Misfolded Protein)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Lichen (Symbiont)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ph">Bacteriophage T4</button>' +
      '<button class="preset-btn" id="p-vio">Viroid (PSTVd)</button>' +
      '<button class="preset-btn" id="p-pri">Prion (Mad Cow Agent)</button>' +
      '<button class="preset-btn" id="p-lic">Lichen Thallus</button>';

    document.getElementById("p-ph").onclick = function(){ setActivePreset(this); setA("phage"); };
    document.getElementById("p-vio").onclick = function(){ setActivePreset(this); setA("viroid"); };
    document.getElementById("p-pri").onclick = function(){ setActivePreset(this); setA("prion"); };
    document.getElementById("p-lic").onclick = function(){ setActivePreset(this); setA("lichen"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Acellular Entities &amp; Symbionts (NCERT 2.6)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Dissect nucleoprotein viruses, naked RNA viroids, proteinaceous prions, and dual-organism lichens.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(aType === "phage"){
      // Bacteriophage T4
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Bacteriophage T4 Anatomy (NCERT Fig 2.6b)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Icosahedral protein head enclosing double-stranded DNA · Contractile tail sheath &amp; pins</text>';

      // Head (Icosahedral)
      m += '<polygon points="260,110 300,85 340,110 340,145 300,165 260,145" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="300" y="130" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">dsDNA</text>';
      // Collar
      m += '<rect x="290" y="165" width="20" height="6" fill="#f59e0b"/>';
      // Sheath
      m += '<rect x="293" y="171" width="14" height="40" fill="#334155" stroke="#94a3b8"/>';
      // Base plate & tail fibres
      m += '<line x1="280" y1="211" x2="320" y2="211" stroke="#38bdf8" stroke-width="3"/>';
      m += '<line x1="285" y1="211" x2="265" y2="235" stroke="#38bdf8" stroke-width="2"/>';
      m += '<line x1="315" y1="211" x2="335" y2="235" stroke="#38bdf8" stroke-width="2"/>';

      m += '<text x="420" y="120" fill="#38bdf8" font-size="12" font-weight="700">Head (Protein Capsid)</text>';
      m += '<text x="420" y="140" fill="#94a3b8" font-size="11">Protects double-stranded DNA</text>';
      m += '<text x="420" y="175" fill="#f59e0b" font-size="12" font-weight="700">Sheath &amp; Collar</text>';
      m += '<text x="420" y="215" fill="#38bdf8" font-size="12" font-weight="700">Tail Fibres</text>';
      m += '<text x="420" y="235" fill="#94a3b8" font-size="11">Attach to bacterial cell wall</text>';

    } else if(aType === "viroid"){
      // Viroid (naked circular RNA)
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Viroid (Discovered by T.O. Diener, 1971)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Free, naked, low-molecular-weight single-stranded RNA · Zero protein coat · Causes potato spindle tuber</text>';

      // Circular single-stranded hairpin RNA
      m += '<path d="M 220,160 Q 300,120 380,160 Q 300,200 220,160 Z" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="3 2"/>';
      m += '<text x="300" y="165" fill="#10b981" font-size="12" font-weight="700" text-anchor="middle">Naked ssRNA</text>';

      m += '<text x="440" y="130" fill="#10b981" font-size="13" font-weight="700">Key Distinctions:</text>';
      m += '<text x="440" y="152" fill="#cbd5e1" font-size="11">• Smaller than viruses</text>';
      m += '<text x="440" y="172" fill="#cbd5e1" font-size="11">• No protein capsid</text>';
      m += '<text x="440" y="192" fill="#cbd5e1" font-size="11">• Susceptible to RNase</text>';
      m += '<text x="440" y="212" fill="#cbd5e1" font-size="11">• Potato spindle tuber disease</text>';

    } else if(aType === "prion"){
      // Prion
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Prion: Abnormally Folded Infectious Protein</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">No nucleic acid · Causes BSE (Mad Cow Disease) &amp; Cr-Jacob Disease (CJD)</text>';

      // Normal alpha helix vs misfolded beta sheet
      m += '<path d="M 240,160 Q 255,130 270,160 T 300,160" fill="none" stroke="#38bdf8" stroke-width="6"/>';
      m += '<text x="270" y="190" fill="#38bdf8" font-size="10" text-anchor="middle">Normal PrPᶜ (Helix)</text>';

      m += '<text x="320" y="165" fill="#f59e0b" font-size="16" font-weight="700">→</text>';

      m += '<path d="M 345,140 L 385,140 L 375,180 L 345,180 Z" fill="#b45309" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="365" y="205" fill="#f59e0b" font-size="10" text-anchor="middle">Infectious PrPˢᶜ (Sheet)</text>';

      m += '<text x="440" y="135" fill="#f59e0b" font-size="12" font-weight="700">Pathology:</text>';
      m += '<text x="440" y="157" fill="#cbd5e1" font-size="11">• Bovine Spongiform Encephalopathy</text>';
      m += '<text x="440" y="177" fill="#cbd5e1" font-size="11">• Cr-Jacob Disease in humans</text>';
      m += '<text x="440" y="197" fill="#cbd5e1" font-size="11">• Extremely heat &amp; radiation resistant</text>';

    } else {
      // Lichen thallus cross section
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ec4899" font-size="15" font-weight="700">Lichen Thallus Symbiosis: Phycobiont + Mycobiont</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Algae prepares food · Fungus provides shelter and absorbs water · Pollution indicator (SO₂ sensitive)</text>';

      // Thallus strata
      m += '<rect x="220" y="105" width="200" height="20" fill="#334155"/>'; // Upper cortex
      m += '<rect x="220" y="125" width="200" height="25" fill="#047857"/>'; // Algal layer
      m += '<rect x="220" y="150" width="200" height="40" fill="#1e293b"/>'; // Medulla
      m += '<rect x="220" y="190" width="200" height="15" fill="#334155"/>'; // Lower cortex

      // Callout labels
      m += '<text x="440" y="120" fill="#94a3b8" font-size="11">Upper Fungal Cortex</text>';
      m += '<text x="440" y="142" fill="#10b981" font-size="12" font-weight="700">Phycobiont (Algal Layer)</text>';
      m += '<text x="440" y="170" fill="#f59e0b" font-size="12" font-weight="700">Mycobiont (Fungal Medulla)</text>';
      m += '<text x="440" y="202" fill="#94a3b8" font-size="11">Lower Cortex &amp; Rhizines</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Entity", aType.toUpperCase(), "#38bdf8") +
      cell("Composition", aType === "phage" ? "dsDNA + Capsid" : (aType === "viroid" ? "Free ssRNA" : (aType === "prion" ? "Protein Only" : "Alga + Fungus")), "#10b981") +
      cell("Disease / Role", aType === "viroid" ? "Potato Spindle Tuber" : (aType === "prion" ? "BSE / CJD" : (aType === "lichen" ? "SO₂ Bioindicator" : "Bacterial Lysis")), "#f59e0b") +
      cell("Living Status", aType === "lichen" ? "Symbiotic Mutualism" : "Acellular / Inert", "#ec4899")
    );

    verdict(
      '<span style="color:#ec4899;font-weight:700;">Acellular &amp; Symbiont Status:</span> ' +
      (aType === "phage" ? "Viruses are obligate intracellular nucleoprotein complexes (genetic material + protein coat)." :
       (aType === "viroid" ? "Viroids consist strictly of low-molecular-weight free RNA without any protein capsid (T.O. Diener 1971)." :
        (aType === "prion" ? "Prions are infectious abnormally folded proteins that cause fatal neurodegenerative spongiform encephalopathies." :
         "Lichens are mutualistic associations between an alga (phycobiont) and a fungus (mycobiont); they do not grow in polluted areas.")))
    );
  }

  return { mount: mount, draw: draw };
})();
