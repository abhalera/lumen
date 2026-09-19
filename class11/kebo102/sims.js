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
// 1. Five Kingdoms Table Explorer (fivekingdoms)
// Table 2.1 verbatim (p. 11). NOTE: the book prints the fungi body entry as
// "Multiceullar/ loose tissue" — kept verbatim, flagged with (*).
// -------------------------------------------------------------------------
window.SIMS.fivekingdoms = (function(){
  var kIdx = 0; // 0: Monera, 1: Protista, 2: Fungi, 3: Plantae, 4: Animalia

  var kData = [
    { name: "Monera", cell: "Prokaryotic", wall: "Noncellulosic (Polysaccharide + amino acid)", nuc: "Absent", body: "Cellular", nut: "Autotrophic (chemosynthetic and photosynthetic) and Heterotrophic (saprophytic/parasitic)", col: "#38bdf8" },
    { name: "Protista", cell: "Eukaryotic", wall: "Present in some", nuc: "Present", body: "Cellular", nut: "Autotrophic (Photosynthetic) and Heterotrophic", col: "#10b981" },
    { name: "Fungi", cell: "Eukaryotic", wall: "Present with chitin", nuc: "Present", body: "Multiceullar/ loose tissue (*)", nut: "Heterotrophic (Saprophytic/Parasitic)", col: "#f59e0b" },
    { name: "Plantae", cell: "Eukaryotic", wall: "Present (cellulose)", nuc: "Present", body: "Tissue/ organ", nut: "Autotrophic (Photosynthetic)", col: "#84cc16" },
    { name: "Animalia", cell: "Eukaryotic", wall: "Absent", nuc: "Present", body: "Tissue/organ/ organ system", nut: "Heterotrophic (Holozoic/ Saprophytic etc.)", col: "#ec4899" }
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
        '<label>NCERT Table 2.1: Characteristics of the Five Kingdoms (Whittaker, 1969)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Click kingdoms above to inspect each Table 2.1 row. (*) = the book\u2019s own spelling.</div>' +
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

    // Detailed Table 2.1 card
    m += '<rect x="40" y="90" width="640" height="185" rx="8" fill="#0b1726" stroke="' + d.col + '" stroke-width="1.5"/>';
    m += '<text x="65" y="118" fill="' + d.col + '" font-size="16" font-weight="700">Kingdom ' + d.name + ' · Table 2.1 row (p. 11)</text>';

    var rows = [
      { label: "Cell Type", val: d.cell },
      { label: "Cell Wall", val: d.wall },
      { label: "Nuclear Membrane", val: d.nuc },
      { label: "Body Organisation", val: d.body },
      { label: "Mode of Nutrition", val: d.nut }
    ];

    for(var r = 0; r < rows.length; r++){
      var item = rows[r];
      var ry = 142 + r * 25;
      m += '<text x="65" y="' + ry + '" fill="#94a3b8" font-size="11" font-weight="600">' + item.label + ':</text>';
      m += '<text x="210" y="' + ry + '" fill="#f8fafc" font-size="11" font-weight="600">' + item.val.slice(0, 72) + '</text>';
    }
    if(kIdx === 2){
      m += '<text x="65" y="268" fill="#64748b" font-size="10">(*) The book prints “Multiceullar/ loose tissue” — kept verbatim.</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Kingdom", d.name, d.col) +
      cell("Cell Nature", d.cell, "#38bdf8") +
      cell("Cell Wall", d.wall.split(" ")[0] + (d.wall.indexOf(" ") > 0 ? " …" : ""), "#f59e0b") +
      cell("Nutrition", d.nut.split(" ")[0], "#10b981")
    );

    verdict(
      '<span style="color:' + d.col + ';font-weight:700;">Table 2.1 (Whittaker 1969):</span> ' +
      'Kingdom ' + d.name + ': ' + d.cell.toLowerCase() + ' cells, ' +
      (kIdx === 2 ? 'Multiceullar/loose tissue body organisation (book spelling)' : d.body.toLowerCase() + ' body organisation') + ', ' +
      d.nut.split("(")[0].trim().toLowerCase() + ' nutrition.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. Bacterial Shapes & Groups Explorer (bacterialmorphology)
// Fig. 2.1 + §2.1.1-2.1.2 + Mycoplasma (pp. 12-14). NOTE: the book prints
// the comma shape as "Vibrium (pl.: vibrio)" — kept verbatim.
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
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Heterocyst (nitrogen fixation)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Sheath</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-sh">Four Bacterial Shapes</button>' +
      '<button class="preset-btn" id="p-nos">Nostoc Filament &amp; Heterocyst</button>' +
      '<button class="preset-btn" id="p-myc">Mycoplasma (Smallest Living Cell)</button>';

    document.getElementById("p-sh").onclick = function(){ setActivePreset(this); setMode("shapes"); };
    document.getElementById("p-nos").onclick = function(){ setActivePreset(this); setMode("nostoc"); };
    document.getElementById("p-myc").onclick = function(){ setActivePreset(this); setMode("mycoplasma"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Kingdom Monera shapes and groups (Fig. 2.1–2.2, pp. 12–14)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Four shapes (Coccus, Bacillus, Spirillum, Vibrium), the Nostoc filament with heterocyst, and wall-less Mycoplasma. Names follow the book\u2019s spelling.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(bMode === "shapes"){
      // Four shapes
      m += '<text x="50" y="45" fill="#f8fafc" font-size="14" font-weight="700">Four Bacterial Shapes (Fig. 2.1, p. 12)</text>';

      // Cocci
      m += '<circle cx="100" cy="140" r="16" fill="#38bdf8"/>';
      m += '<circle cx="125" cy="150" r="16" fill="#38bdf8"/>';
      m += '<circle cx="85" cy="165" r="16" fill="#38bdf8"/>';
      m += '<circle cx="115" cy="175" r="16" fill="#38bdf8"/>';
      m += '<text x="100" y="225" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">Coccus (pl.: cocci)</text>';
      m += '<text x="100" y="242" fill="#64748b" font-size="10" text-anchor="middle">spherical</text>';

      // Bacilli
      m += '<rect x="230" y="130" width="55" height="24" rx="12" fill="#10b981"/>';
      m += '<rect x="250" y="165" width="55" height="24" rx="12" fill="#10b981"/>';
      m += '<text x="260" y="225" fill="#10b981" font-size="12" font-weight="700" text-anchor="middle">Bacillus (pl.: bacilli)</text>';
      m += '<text x="260" y="242" fill="#64748b" font-size="10" text-anchor="middle">rod-shaped</text>';

      // Spirilla
      m += '<path d="M 400,160 Q 415,130 430,160 T 460,160" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>';
      m += '<path d="M 460,160 Q 475,150 490,140" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="430" y="225" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">Spirillum (pl.: spirilla)</text>';
      m += '<text x="430" y="242" fill="#64748b" font-size="10" text-anchor="middle">spiral</text>';

      // Vibrium (book spelling)
      m += '<path d="M 585,140 Q 615,145 605,175" fill="none" stroke="#ec4899" stroke-width="12" stroke-linecap="round"/>';
      m += '<text x="600" y="225" fill="#ec4899" font-size="12" font-weight="700" text-anchor="middle">Vibrium (pl.: vibrio)</text>';
      m += '<text x="600" y="242" fill="#64748b" font-size="10" text-anchor="middle">comma-shaped · book spelling</text>';

    } else if(bMode === "nostoc"){
      // Nostoc filament with heterocyst
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Nostoc Filament with Heterocyst (Fig. 2.2, p. 13)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Colonies surrounded by gelatinous sheath · Chlorophyll a · Fixes atmospheric nitrogen</text>';

      // Cyanobacterial cells chain
      var cx0 = 75, cy0 = 150;
      for(var c = 0; c < 15; c++){
        var cx = cx0 + c * 38;
        var cy = cy0 + Math.sin(c * 0.8 + t) * 12;
        var isHet = (c === 7);
        if(isHet){
          // Large specialised heterocyst
          m += '<circle cx="' + cx + '" cy="' + cy + '" r="22" fill="#047857" stroke="#f59e0b" stroke-width="4"/>';
          m += '<text x="' + cx + '" y="' + (cy - 30) + '" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">HETEROCYST</text>';
          m += '<text x="' + cx + '" y="' + (cy + 34) + '" fill="#fcd34d" font-size="9" text-anchor="middle">[fixes atmospheric nitrogen]</text>';
        } else {
          m += '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="#10b981" stroke="#065f46" stroke-width="2"/>';
        }
      }
      m += '<text x="360" y="240" fill="#94a3b8" font-size="11" text-anchor="middle">Gelatinous sheath enveloping the colony · Nostoc and Anabaena fix nitrogen in heterocysts</text>';

    } else {
      // Mycoplasma
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ec4899" font-size="15" font-weight="700">Mycoplasma: Smallest Living Cells Known (p. 14)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Completely lack a cell wall · Survive without oxygen · Many pathogenic in animals and plants</text>';

      // Wall-less cell
      m += '<path d="M 260,150 Q 300,100 370,120 T 430,160 T 380,210 T 290,190 Z" fill="#831843" fill-opacity="0.4" stroke="#ec4899" stroke-width="3"/>';
      m += '<circle cx="340" cy="160" r="15" fill="#f43f5e"/>';
      m += '<text x="340" y="164" fill="#ffffff" font-size="9" text-anchor="middle">DNA</text>';
      m += '<text x="350" y="245" fill="#fbcfe8" font-size="12" font-weight="600" text-anchor="middle">No cell wall at all — the chapter\u2019s whole diagnosis</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Category", "Kingdom Monera", "#38bdf8") +
      cell("Focus", bMode === "shapes" ? "Four printed shapes" : (bMode === "nostoc" ? "Nostoc (cyanobacteria)" : "Mycoplasma"), "#10b981") +
      cell("Cell Wall", bMode === "mycoplasma" ? "ABSENT (no wall)" : "Rigid cell wall", bMode === "mycoplasma" ? "#ef4444" : "#f59e0b") +
      cell("Note", bMode === "shapes" ? "Vibrium = book spelling" : (bMode === "nostoc" ? "Heterocysts fix nitrogen" : "Smallest living cells"), "#a855f7")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Moneran Hallmarks:</span> ' +
      (bMode === "shapes" ? "Four shapes as printed: spherical Coccus, rod Bacillus, comma Vibrium (pl.: vibrio), spiral Spirillum (Fig. 2.1)." :
       (bMode === "nostoc" ? "Nostoc carries chlorophyll a in a gelatinous sheath and fixes atmospheric nitrogen in specialised heterocysts." :
        "Mycoplasma completely lack a cell wall — the smallest living cells known, surviving without oxygen."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. Protistan Groups Explorer (protistalab)
// §2.2.1-2.2.3 (pp. 14-15): diatom shells, Gonyaulax tides, Euglena pellicle.
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
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Diatom (Silica Shells)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Dinoflagellate (Red Tide)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Euglenoid (Pellicle)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dia">Diatom (Chrysophyte)</button>' +
      '<button class="preset-btn" id="p-dino">Dinoflagellate (Gonyaulax)</button>' +
      '<button class="preset-btn" id="p-eug">Euglena (Pellicle)</button>';

    document.getElementById("p-dia").onclick = function(){ setActivePreset(this); setP("diatom"); };
    document.getElementById("p-dino").onclick = function(){ setActivePreset(this); setP("dinoflagellate"); };
    document.getElementById("p-eug").onclick = function(){ setActivePreset(this); setP("euglena"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Kingdom Protista: three printed groups (§2.2.1–2.2.3)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Indestructible diatom silica walls, Gonyaulax red tides, and the flexible Euglena pellicle.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(pGroup === "diatom"){
      // Diatom soap-box
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Diatom: Overlapping Silica Shells (Soap-Box Walls)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Indestructible silica · Chief producers in the oceans · Diatomaceous earth</text>';

      // Upper shell (lid)
      m += '<rect x="220" y="115" width="280" height="35" rx="6" fill="#0284c7" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="360" y="137" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Upper Shell (lid)</text>';

      // Lower shell (base)
      m += '<rect x="235" y="145" width="250" height="35" rx="4" fill="#0369a1" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="360" y="167" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Lower Shell (base)</text>';

      m += '<text x="360" y="215" fill="#fcd34d" font-size="12" text-anchor="middle">Silica · Indestructible → Billions of years of Diatomaceous Earth</text>';

    } else if(pGroup === "dinoflagellate"){
      // Dinoflagellate with two flagella
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ef4444" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ef4444" font-size="15" font-weight="700">Dinoflagellate (Gonyaulax) &amp; Red Tides</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Stiff cellulose plates · Two flagella (longitudinal &amp; transverse in furrow) · Toxins kill fishes</text>';

      // Plated body
      m += '<polygon points="360,95 410,135 395,190 325,190 310,135" fill="#991b1b" stroke="#f87171" stroke-width="2"/>';
      // Transverse furrow
      m += '<line x1="310" y1="140" x2="410" y2="140" stroke="#fca5a5" stroke-width="3"/>';
      // Flagella
      m += '<path d="M 360,190 Q 350,225 365,250" fill="none" stroke="#fca5a5" stroke-width="2.5"/>';
      m += '<text x="375" y="235" fill="#fca5a5" font-size="10">Longitudinal flagellum</text>';
      m += '<text x="430" y="145" fill="#fca5a5" font-size="10">Transverse flagellum (furrow)</text>';
      m += '<text x="360" y="215" fill="#ef4444" font-size="11" font-weight="700" text-anchor="middle">Rapid bloom → Sea appears red → Toxins kill fishes</text>';

    } else {
      // Euglena
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Euglena: Flexible Pellicle, Two Flagella</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Protein-rich pellicle, no wall · Two flagella (one long, one short) · Plant-identical pigments</text>';

      // Spindle shape
      m += '<path d="M 260,150 C 310,110 410,110 460,150 C 410,190 310,190 260,150 Z" fill="#065f46" stroke="#10b981" stroke-width="2.5"/>';
      // Long flagellum
      m += '<path d="M 260,150 Q 220,120 200,100 Q 180,140 160,120" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="150" y="105" fill="#38bdf8" font-size="10">Long flagellum</text>';
      // Short flagellum stub
      m += '<line x1="268" y1="142" x2="248" y2="128" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="360" y="230" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">Photosynthetic in sunlight ⇄ Predatory heterotroph when deprived of sunlight</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Protist Group", pGroup === "diatom" ? "Chrysophytes (Diatom)" : (pGroup === "dinoflagellate" ? "Dinoflagellates" : "Euglenoids"), "#38bdf8") +
      cell("Outer Envelope", pGroup === "diatom" ? "Silica Shells" : (pGroup === "dinoflagellate" ? "Cellulose Plates" : "Protein Pellicle"), "#10b981") +
      cell("Ecological Role", pGroup === "diatom" ? "Chief Ocean Producer" : (pGroup === "dinoflagellate" ? "Red Tide Producer" : "Light/Dark Switch"), "#f59e0b") +
      cell("Mobility", pGroup === "diatom" ? "Passive Floater" : "2 Flagella", "#ec4899")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Protistan Diversity:</span> ' +
      (pGroup === "diatom" ? "Diatoms carry overlapping indestructible silica shells and are the chief producers in the oceans." :
       (pGroup === "dinoflagellate" ? "Dinoflagellates bear two flagella — longitudinal plus transverse in a furrow; red Gonyaulax blooms make red tides." :
        "Euglenoids flex on a protein pellicle: photosynthetic in sunlight, predatory heterotrophs without it."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. Protozoan Groups Explorer (protozoanlab)
// §2.2.5 (pp. 15-16). Genus names only — the chapter gives no species
// epithets. (Fixes a crash bug: Trypanosoma handler called setMode.)
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
      '<button class="preset-btn" id="p-plas">Plasmodium (Malaria)</button>';

    document.getElementById("p-am").onclick = function(){ setActivePreset(this); setType("amoeba"); };
    document.getElementById("p-par").onclick = function(){ setActivePreset(this); setType("paramoecium"); };
    document.getElementById("p-try").onclick = function(){ setActivePreset(this); setType("trypanosoma"); };
    document.getElementById("p-plas").onclick = function(){ setActivePreset(this); setType("plasmodium"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>The Four Major Groups of Protozoa (§2.2.5)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Pseudopodia, flagella, ciliary gullet currents, and the infectious spore-like stage.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(pType === "amoeba"){
      // Amoeba with pseudopodia
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Amoeboid Protozoan (Amoeba · Entamoeba)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Pseudopodia (false feet) for movement and capturing prey</text>';

      // Lobose body with pseudopod lobes
      m += '<path d="M 280,140 Q 320,100 370,120 Q 420,105 450,140 Q 480,180 430,200 Q 370,220 320,195 Q 260,180 280,140 Z" fill="#0369a1" fill-opacity="0.5" stroke="#38bdf8" stroke-width="2"/>';
      // Captured prey
      m += '<circle cx="390" cy="155" r="8" fill="#10b981"/>';
      m += '<text x="390" y="142" fill="#10b981" font-size="9" text-anchor="middle">captured prey</text>';
      m += '<text x="360" y="240" fill="#cbd5e1" font-size="11" text-anchor="middle">Fresh/sea water or moist soil · Marine forms: silica shells · Entamoeba: parasites</text>';

    } else if(pType === "paramoecium"){
      // Paramoecium slipper shape with cilia and gullet
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Ciliated Protozoan (Paramoecium)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Thousands of cilia · Gullet (cavity) opening to the outside</text>';

      // Slipper body
      m += '<path d="M 270,150 C 310,110 400,110 450,135 C 470,150 460,185 430,195 C 380,205 310,195 270,150 Z" fill="#065f46" fill-opacity="0.5" stroke="#10b981" stroke-width="2"/>';
      // Gullet
      m += '<path d="M 360,135 Q 380,155 365,175" fill="none" stroke="#f59e0b" stroke-width="3"/>';
      m += '<text x="410" y="160" fill="#f59e0b" font-size="10">Gullet</text>';
      // Cilia rim
      for(var ci = 0; ci < 24; ci++){
        var ang = (ci / 24) * Math.PI * 2;
        var cx = 360 + Math.cos(ang) * 90;
        var cy = 155 + Math.sin(ang) * 35;
        m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(ang)*8) + '" y2="' + (cy + Math.sin(ang)*8) + '" stroke="#6ee7b7" stroke-width="1.5"/>';
      }
      m += '<text x="360" y="240" fill="#cbd5e1" font-size="11" text-anchor="middle">Coordinated ciliary rows steer food-laden water into the gullet</text>';

    } else if(pType === "trypanosoma"){
      // Trypanosoma
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Flagellated Protozoan (Trypanosoma)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Free-living or parasitic · Flagella · Parasites cause sleeping sickness</text>';

      // Undulating spindle body
      m += '<path d="M 260,160 Q 320,120 380,170 T 460,140" fill="none" stroke="#d97706" stroke-width="14" stroke-linecap="round"/>';
      m += '<path d="M 260,160 Q 320,105 380,155 T 460,125 L 485,115" fill="none" stroke="#fcd34d" stroke-width="2.5"/>';
      m += '<text x="525" y="120" fill="#fcd34d" font-size="10">Flagellum</text>';
      m += '<text x="360" y="240" fill="#cbd5e1" font-size="11" text-anchor="middle">Trypanosoma: the chapter\u2019s sleeping-sickness example</text>';

    } else {
      // Plasmodium sporozoan
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ec4899" font-size="15" font-weight="700">Sporozoan (Plasmodium, malarial parasite)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Infectious spore-like stage in the life cycle · Causes malaria</text>';

      // Crescent sporozoite
      m += '<path d="M 270,160 Q 350,110 450,155 Q 360,140 270,160 Z" fill="#be185d" stroke="#f472b6" stroke-width="2"/>';
      m += '<circle cx="360" cy="143" r="6" fill="#fbcfe8"/>';
      m += '<text x="360" y="205" fill="#fbcfe8" font-size="10" text-anchor="middle">spore-like stage</text>';
      m += '<text x="360" y="240" fill="#cbd5e1" font-size="11" text-anchor="middle">Malaria: a staggering effect on human population</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Protozoan Group", pType.toUpperCase(), "#38bdf8") +
      cell("Locomotion", pType === "amoeba" ? "Pseudopodia" : (pType === "paramoecium" ? "Cilia" : (pType === "trypanosoma" ? "Flagella" : "Spore-like stage")), "#10b981") +
      cell("Representative", pType === "amoeba" ? "Amoeba / Entamoeba" : (pType === "paramoecium" ? "Paramoecium" : (pType === "trypanosoma" ? "Trypanosoma" : "Plasmodium")), "#f59e0b") +
      cell("Note", pType === "trypanosoma" ? "Sleeping sickness" : (pType === "plasmodium" ? "Malaria" : (pType === "amoeba" ? "Some parasitic" : "Aquatic mover")), "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Four Major Groups (§2.2.5):</span> ' +
      'Amoeboids (pseudopodia), flagellates (flagella), ciliates (thousands of cilia and a gullet), sporozoans (infectious spore-like stage) — all heterotrophs, predators or parasites.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. Fungal Classes Explorer (fungallifecycle)
// §2.3.1-2.3.4 (pp. 17-18). The chapter counts only basidiospores (four);
// ascospore counts are not stated and not shown.
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
      '<button class="preset-btn" id="p-bas">Basidiomycetes (Mushrooms)</button>' +
      '<button class="preset-btn" id="p-deu">Deuteromycetes (Imperfect)</button>';

    document.getElementById("p-phy").onclick = function(){ setActivePreset(this); setFC("phycomycetes"); };
    document.getElementById("p-asc").onclick = function(){ setActivePreset(this); setFC("ascomycetes"); };
    document.getElementById("p-bas").onclick = function(){ setActivePreset(this); setFC("basidiomycetes"); };
    document.getElementById("p-deu").onclick = function(){ setActivePreset(this); setFC("deuteromycetes"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Kingdom Fungi: mycelium, spores and fruiting bodies (§2.3)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Endogenous ascospores in asci vs exogenous basidiospores on basidia — plus coenocytic hyphae and conidia-only imperfects.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(fClass === "ascomycetes"){
      // Ascus with ascospores (count unstated in chapter)
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Ascomycetes (Sac Fungi): Ascospores in an Ascus</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Septate branched mycelium · Conidia (asexual, exogenous) · Penicillium, Aspergillus, Neurospora</text>';

      // Sac-like ascus
      m += '<path d="M 280,210 C 260,180 260,110 310,95 C 360,110 360,180 340,210 Z" fill="#065f46" stroke="#10b981" stroke-width="2.5"/>';
      // Ascospores inside (illustrative cluster; chapter states no count)
      for(var s = 0; s < 6; s++){
        var sy = 118 + s * 14;
        m += '<ellipse cx="305" cy="' + sy + '" rx="8" ry="4" fill="#a7f3d0" stroke="#047857"/>';
      }
      m += '<text x="420" y="130" fill="#a7f3d0" font-size="12" font-weight="700">Ascus (Sac)</text>';
      m += '<text x="420" y="150" fill="#94a3b8" font-size="11">Ascospores inside (endogenous)</text>';
      m += '<text x="420" y="168" fill="#94a3b8" font-size="11">Ascocarps (fruiting bodies)</text>';
      m += '<text x="420" y="186" fill="#94a3b8" font-size="11">Morels &amp; truffles edible</text>';

    } else if(fClass === "basidiomycetes"){
      // Basidium with 4 exogenous basidiospores (chapter counts four)
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Basidiomycetes: 4 Exogenous Basidiospores on a Basidium</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Mushrooms, brackets, puffballs · Agaricus, Ustilago (smut), Puccinia (rust)</text>';

      // Basidium
      m += '<path d="M 290,210 L 290,140 C 280,120 330,120 320,140 L 320,210 Z" fill="#78350f" stroke="#f59e0b" stroke-width="2.5"/>';
      // 4 basidiospores on top
      var bx = [285, 298, 312, 325];
      for(var b = 0; b < 4; b++){
        m += '<line x1="' + (bx[b] - 2) + '" y1="125" x2="' + bx[b] + '" y2="110" stroke="#f59e0b" stroke-width="2"/>';
        m += '<circle cx="' + bx[b] + '" cy="104" r="6" fill="#fde68a" stroke="#d97706" stroke-width="1.5"/>';
      }
      m += '<text x="420" y="130" fill="#fde68a" font-size="12" font-weight="700">Basidium</text>';
      m += '<text x="420" y="150" fill="#94a3b8" font-size="11">Bears 4 basidiospores (exogenous)</text>';
      m += '<text x="420" y="168" fill="#94a3b8" font-size="11">Karyogamy + meiosis in basidium</text>';
      m += '<text x="420" y="186" fill="#94a3b8" font-size="11">Basidiocarps (fruiting bodies)</text>';

    } else if(fClass === "phycomycetes"){
      // Phycomycetes: Aseptate coenocytic
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Phycomycetes: Aseptate Coenocytic Mycelium &amp; Sporangium</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Aquatic / decaying moist wood / obligate parasites · Mucor, Rhizopus, Albugo (mustard)</text>';

      // Sporangiophore and globular sporangium
      m += '<line x1="305" y1="210" x2="305" y2="135" stroke="#38bdf8" stroke-width="3"/>';
      m += '<circle cx="305" cy="115" r="25" fill="#0369a1" stroke="#38bdf8" stroke-width="2.5"/>';
      // Spores inside
      for(var sp = 0; sp < 12; sp++){
        var sx = 295 + (sp % 4) * 7;
        var syy = 105 + Math.floor(sp / 4) * 7;
        m += '<circle cx="' + sx + '" cy="' + syy + '" r="2" fill="#bae6fd"/>';
      }
      m += '<text x="420" y="130" fill="#bae6fd" font-size="12" font-weight="700">Sporangium</text>';
      m += '<text x="420" y="150" fill="#94a3b8" font-size="11">Zoospores/aplanospores (endogenous)</text>';
      m += '<text x="420" y="168" fill="#94a3b8" font-size="11">Zygospore by gametic fusion</text>';
      m += '<text x="420" y="186" fill="#94a3b8" font-size="11">Hyphae: coenocytic, aseptate</text>';

    } else {
      // Deuteromycetes
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ec4899" font-size="15" font-weight="700">Deuteromycetes: The Imperfect Fungi (Asexual Only)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Septate mycelium · Conidia on conidiophores · Alternaria, Colletotrichum, Trichoderma</text>';

      // Conidiophore with chained conidia
      m += '<line x1="305" y1="210" x2="305" y2="140" stroke="#ec4899" stroke-width="3"/>';
      for(var cn = 0; cn < 5; cn++){
        var cyy = 130 - cn * 10;
        m += '<circle cx="305" cy="' + cyy + '" r="5" fill="#fbcfe8" stroke="#be185d"/>';
      }
      m += '<text x="420" y="130" fill="#fbcfe8" font-size="12" font-weight="700">Conidia (Asexual Spores)</text>';
      m += '<text x="420" y="150" fill="#94a3b8" font-size="11">Reproduce only by conidia</text>';
      m += '<text x="420" y="168" fill="#94a3b8" font-size="11">Moved out once sexual stage found</text>';
      m += '<text x="420" y="186" fill="#94a3b8" font-size="11">Litter decomposers · mineral cycling</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Fungal Class", fClass.toUpperCase(), "#f59e0b") +
      cell("Mycelium", fClass === "phycomycetes" ? "Aseptate, Coenocytic" : "Septate & Branched", "#38bdf8") +
      cell("Sexual Spores", fClass === "ascomycetes" ? "Ascospores (Endogenous)" : (fClass === "basidiomycetes" ? "4 Basidiospores (Exogenous)" : (fClass === "phycomycetes" ? "Zygospores" : "None Known")), "#10b981") +
      cell("Key Genera", fClass === "ascomycetes" ? "Penicillium / Neurospora" : (fClass === "basidiomycetes" ? "Agaricus / Puccinia" : (fClass === "phycomycetes" ? "Mucor / Rhizopus" : "Alternaria")), "#ec4899")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Fungal Spore Diagnostic:</span> ' +
      (fClass === "ascomycetes" ? "Ascomycetes form ascospores endogenously inside sac-like asci, grouped in ascocarps." :
       (fClass === "basidiomycetes" ? "Basidiomycetes form four basidiospores exogenously on each basidium, grouped in basidiocarps." :
        (fClass === "phycomycetes" ? "Phycomycetes form zoospores or aplanospores endogenously in the sporangium, plus zygospores by fusion." :
         "Deuteromycetes reproduce only by conidia; sexual stages move them to ascomycetes or basidiomycetes.")))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. Plantae & Animalia Comparator (alternationofgen)
// §2.4-2.5 (pp. 19) only: two kingdom profiles + the one-paragraph
// alternation of generations. Group-level dominance patterns belong to
// Chapters 3-4 and are not shown here.
// -------------------------------------------------------------------------
window.SIMS.alternationofgen = (function(){
  var view = "plantae"; // "plantae", "animalia", "alternation"

  function setView(v){
    view = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Kingdom Plantae</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Kingdom Animalia</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Alternation of Generations</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-plant">Plantae Hallmarks</button>' +
      '<button class="preset-btn" id="p-anim">Animalia Hallmarks</button>' +
      '<button class="preset-btn" id="p-altern">Alternation of Generations</button>';

    document.getElementById("p-plant").onclick = function(){ setActivePreset(this); setView("plantae"); };
    document.getElementById("p-anim").onclick = function(){ setActivePreset(this); setView("animalia"); };
    document.getElementById("p-altern").onclick = function(){ setActivePreset(this); setView("alternation"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Kingdoms Plantae &amp; Animalia (§2.4–2.5, p. 19)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Two hallmark profiles plus the alternation paragraph. Details live in Chapters 3–4.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(view === "plantae"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Kingdom Plantae (§2.4)</text>';
      m += '<text x="65" y="82" fill="#e2e8f0" font-size="12">All eukaryotic chlorophyll-containing organisms</text>';
      var rows = [
        "Eukaryotic cells · Prominent chloroplasts · Cellulose walls",
        "Algae, bryophytes, pteridophytes, gymnosperms, angiosperms",
        "Partial heterotrophs: Bladderwort, Venus flytrap (insectivorous)",
        "Parasite: Cuscuta",
        "Details in Chapter 3"
      ];
      for(var i = 0; i < rows.length; i++){
        m += '<text x="65" y="' + (112 + i * 28) + '" fill="#cbd5e1" font-size="12">• ' + rows[i] + '</text>';
      }
      readout(
        cell("Kingdom", "PLANTAE", "#10b981") +
        cell("Cell", "Chlorophyll + cellulose", "#38bdf8") +
        cell("Exceptions", "Bladderwort, Venus flytrap, Cuscuta", "#f59e0b") +
        cell("Details", "Chapter 3", "#a855f7")
      );
      verdict(
        '<span style="color:#10b981;font-weight:700;">Plantae (§2.4):</span> ' +
        'Eukaryotic chlorophyll-containing organisms with cellulose walls — except insectivorous Bladderwort and Venus flytrap, and parasitic Cuscuta.'
      );
    } else if(view === "animalia"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Kingdom Animalia (§2.5)</text>';
      m += '<text x="65" y="82" fill="#e2e8f0" font-size="12">Heterotrophic eukaryotic multicellular organisms, no cell walls</text>';
      var rows2 = [
        "Depend on plants directly or indirectly · Internal digestion",
        "Store glycogen or fat · Holozoic nutrition (ingestion)",
        "Definite growth → definite shape and size",
        "Sensory + neuromotor systems · Most show locomotion",
        "Sexual reproduction: copulation + embryological development"
      ];
      for(var j = 0; j < rows2.length; j++){
        m += '<text x="65" y="' + (112 + j * 28) + '" fill="#cbd5e1" font-size="12">• ' + rows2[j] + '</text>';
      }
      readout(
        cell("Kingdom", "ANIMALIA", "#38bdf8") +
        cell("Cell", "No walls, heterotrophic", "#10b981") +
        cell("Nutrition", "Holozoic · glycogen/fat", "#f59e0b") +
        cell("Reproduction", "Copulation + development", "#a855f7")
      );
      verdict(
        '<span style="color:#38bdf8;font-weight:700;">Animalia (§2.5):</span> ' +
        'Wall-less heterotrophs with internal digestion, glycogen/fat stores, holozoic nutrition, locomotion, and copulation plus development.'
      );
    } else {
      m += '<text x="360" y="45" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">Alternation of Generations (§2.4)</text>';
      m += '<rect x="90" y="70" width="230" height="120" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="205" y="105" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">Diploid sporophytic</text>';
      m += '<text x="205" y="128" fill="#cbd5e1" font-size="12" text-anchor="middle">phase (2n)</text>';
      m += '<text x="205" y="155" fill="#64748b" font-size="11" text-anchor="middle">length varies by group</text>';
      m += '<text x="360" y="135" fill="#f59e0b" font-size="22" font-weight="700" text-anchor="middle">⇄</text>';
      m += '<rect x="400" y="70" width="230" height="120" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="515" y="105" fill="#10b981" font-size="15" font-weight="700" text-anchor="middle">Haploid gametophytic</text>';
      m += '<text x="515" y="128" fill="#cbd5e1" font-size="12" text-anchor="middle">phase (n)</text>';
      m += '<text x="515" y="155" fill="#64748b" font-size="11" text-anchor="middle">free-living or dependent</text>';
      m += '<text x="360" y="235" fill="#e2e8f0" font-size="12" text-anchor="middle">The two phases alternate with each other — this phenomenon is called alternation of generations.</text>';
      m += '<text x="360" y="258" fill="#64748b" font-size="11" text-anchor="middle">Phase lengths and independence vary among plant groups (details in Chapter 3).</text>';
      readout(
        cell("Phase A", "Diploid sporophytic", "#38bdf8") +
        cell("Phase B", "Haploid gametophytic", "#10b981") +
        cell("Pattern", "Alternate (§2.4)", "#f59e0b") +
        cell("Varies", "Length + independence", "#a855f7")
      );
      verdict(
        '<span style="color:#f59e0b;font-weight:700;">Alternation of Generations:</span> ' +
        'Diploid sporophytic and haploid gametophytic phases alternate; their lengths and free-living/dependent status vary by group.'
      );
    }

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. Acellular Entities Explorer (virallab)
// §2.6 (pp. 19-21). Figure labels follow Fig. 2.6 exactly (Head, Sheath,
// Collar, Tail fibres; RNA, Capsid). No strain names, no anatomy beyond
// the two printed partners for lichens.
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
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Prion (Folded Protein)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Lichen (Alga + Fungus)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ph">Bacteriophage</button>' +
      '<button class="preset-btn" id="p-vio">Viroid (Diener 1971)</button>' +
      '<button class="preset-btn" id="p-pri">Prion (BSE / CJD)</button>' +
      '<button class="preset-btn" id="p-lic">Lichen (Alga + Fungus)</button>';

    document.getElementById("p-ph").onclick = function(){ setActivePreset(this); setA("phage"); };
    document.getElementById("p-vio").onclick = function(){ setActivePreset(this); setA("viroid"); };
    document.getElementById("p-pri").onclick = function(){ setActivePreset(this); setA("prion"); };
    document.getElementById("p-lic").onclick = function(){ setActivePreset(this); setA("lichen"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Acellular entities &amp; lichens (§2.6, Fig. 2.6)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Nucleoprotein phage, coat-less viroid, folded-protein prion, and the two lichen partners.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(aType === "phage"){
      // Bacteriophage (Fig. 2.6b labels)
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Bacteriophage (Fig. 2.6b)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Usually double stranded DNA · Protein capsid head · Infects bacteria</text>';

      // Head
      m += '<polygon points="260,110 300,85 340,110 340,145 300,165 260,145" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="300" y="130" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">DNA</text>';
      // Collar
      m += '<rect x="290" y="165" width="20" height="6" fill="#f59e0b"/>';
      // Sheath
      m += '<rect x="293" y="171" width="14" height="40" fill="#334155" stroke="#94a3b8"/>';
      // Tail fibres
      m += '<line x1="280" y1="211" x2="320" y2="211" stroke="#38bdf8" stroke-width="3"/>';
      m += '<line x1="285" y1="211" x2="265" y2="235" stroke="#38bdf8" stroke-width="2"/>';
      m += '<line x1="315" y1="211" x2="335" y2="235" stroke="#38bdf8" stroke-width="2"/>';

      m += '<text x="420" y="120" fill="#38bdf8" font-size="12" font-weight="700">Head (capsid)</text>';
      m += '<text x="420" y="140" fill="#94a3b8" font-size="11">Protects double stranded DNA</text>';
      m += '<text x="420" y="175" fill="#f59e0b" font-size="12" font-weight="700">Sheath + Collar</text>';
      m += '<text x="420" y="215" fill="#38bdf8" font-size="12" font-weight="700">Tail fibres</text>';
      m += '<text x="420" y="235" fill="#94a3b8" font-size="11">Labels as in Fig. 2.6b</text>';

    } else if(aType === "viroid"){
      // Viroid (free RNA, no coat)
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Viroid (T.O. Diener, 1971)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Free low-molecular-weight RNA · No protein coat · Potato spindle tuber disease</text>';

      // Free RNA loop (no coat)
      m += '<path d="M 220,160 Q 300,120 380,160 Q 300,200 220,160 Z" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="3 2"/>';
      m += '<text x="300" y="165" fill="#10b981" font-size="12" font-weight="700" text-anchor="middle">Free RNA</text>';

      m += '<text x="440" y="130" fill="#10b981" font-size="13" font-weight="700">Key Distinctions:</text>';
      m += '<text x="440" y="152" fill="#cbd5e1" font-size="11">• Smaller than viruses</text>';
      m += '<text x="440" y="172" fill="#cbd5e1" font-size="11">• No protein coat</text>';
      m += '<text x="440" y="192" fill="#cbd5e1" font-size="11">• RNA of low molecular weight</text>';
      m += '<text x="440" y="212" fill="#cbd5e1" font-size="11">• Potato spindle tuber disease</text>';

    } else if(aType === "prion"){
      // Prion (abnormally folded protein)
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Prion: Abnormally Folded Protein</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Virus-sized agent · Infectious neurological diseases · BSE + Creutzfeldt–Jacob (CJD)</text>';

      // Normal protein shape
      m += '<circle cx="250" cy="160" r="28" fill="none" stroke="#38bdf8" stroke-width="5"/>';
      m += '<text x="250" y="205" fill="#38bdf8" font-size="10" text-anchor="middle">Normal protein</text>';

      m += '<text x="320" y="168" fill="#f59e0b" font-size="18" font-weight="700">→</text>';
      m += '<text x="320" y="188" fill="#64748b" font-size="9" text-anchor="middle">misfolds</text>';

      // Abnormally folded protein
      m += '<path d="M 355,140 L 395,140 L 385,180 L 355,180 Z" fill="#b45309" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="375" y="205" fill="#f59e0b" font-size="10" text-anchor="middle">Abnormally folded</text>';

      m += '<text x="450" y="135" fill="#f59e0b" font-size="12" font-weight="700">Diseases:</text>';
      m += '<text x="450" y="157" fill="#cbd5e1" font-size="11">• BSE (mad cow), cattle</text>';
      m += '<text x="450" y="177" fill="#cbd5e1" font-size="11">• Creutzfeldt–Jacob, humans</text>';
      m += '<text x="450" y="197" fill="#cbd5e1" font-size="11">• Similar in size to viruses</text>';

    } else {
      // Lichen: two partners + exchange
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ec4899" font-size="15" font-weight="700">Lichen: Alga + Fungus Symbiosis</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Mutually useful association · Absent from polluted areas (pollution indicator)</text>';

      // Phycobiont (alga)
      m += '<circle cx="220" cy="160" r="48" fill="#065f46" stroke="#10b981" stroke-width="2.5"/>';
      m += '<text x="220" y="152" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Phycobiont</text>';
      m += '<text x="220" y="170" fill="#a7f3d0" font-size="10" text-anchor="middle">alga · autotrophic</text>';
      m += '<text x="220" y="225" fill="#10b981" font-size="10" text-anchor="middle">prepares food</text>';

      // Exchange arrows
      m += '<text x="330" y="145" fill="#f59e0b" font-size="16" font-weight="700">⇄</text>';
      m += '<text x="330" y="185" fill="#64748b" font-size="9" text-anchor="middle">food ⇄ shelter</text>';

      // Mycobiont (fungus)
      m += '<path d="M 400,130 Q 440,110 480,130 Q 500,160 480,190 Q 440,210 400,190 Q 380,160 400,130 Z" fill="#831843" fill-opacity="0.5" stroke="#ec4899" stroke-width="2.5"/>';
      m += '<text x="442" y="162" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Mycobiont</text>';
      m += '<text x="442" y="225" fill="#ec4899" font-size="10" text-anchor="middle">shelter + water + minerals</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Entity", aType.toUpperCase(), "#38bdf8") +
      cell("Composition", aType === "phage" ? "dsDNA + Capsid" : (aType === "viroid" ? "Free RNA" : (aType === "prion" ? "Protein Only" : "Alga + Fungus")), "#10b981") +
      cell("Disease / Role", aType === "viroid" ? "Potato Spindle Tuber" : (aType === "prion" ? "BSE / CJD" : (aType === "lichen" ? "Pollution Indicator" : "Infects Bacteria")), "#f59e0b") +
      cell("Status", aType === "lichen" ? "Symbiotic Mutualism" : "Acellular / Inert", "#ec4899")
    );

    verdict(
      '<span style="color:#ec4899;font-weight:700;">Beyond Kingdoms (§2.6):</span> ' +
      (aType === "phage" ? "Bacteriophages are usually double stranded DNA viruses — nucleoprotein obligate parasites of bacteria." :
       (aType === "viroid" ? "Viroids are free low-molecular-weight RNA without any protein coat (Diener, 1971)." :
        (aType === "prion" ? "Prions are abnormally folded proteins causing infectious neurological disease: BSE in cattle, CJD in humans." :
         "Lichens pair an alga (phycobiont) with a fungus (mycobiont); they do not grow in polluted areas.")))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101/kech101/keph102 —
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
