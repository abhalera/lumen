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
// 1. Algal Classes Table Explorer (algaepigmentlab)
// Table 3.1 verbatim (p. 26) + §3.1.1-3.1.3.
// -------------------------------------------------------------------------
window.SIMS.algaepigmentlab = (function(){
  var aClass = "chlorophyceae"; // "chlorophyceae", "phaeophyceae", "rhodophyceae"

  var aData = {
    chlorophyceae: {
      name: "Chlorophyceae (Green Algae)",
      pigments: "Chlorophyll a, b",
      food: "Starch (in pyrenoids)",
      wall: "Cellulose (inner) + Pectose (outer)",
      flagella: "2–8, Equal, Apical",
      habitat: "Fresh water, brackish water, salt water",
      col: "#10b981",
      example: "Chlamydomonas, Volvox, Ulothrix, Spirogyra, Chara"
    },
    phaeophyceae: {
      name: "Phaeophyceae (Brown Algae)",
      pigments: "Chlorophyll a, c, Fucoxanthin",
      food: "Mannitol, Laminarin",
      wall: "Cellulose + Gelatinous Algin",
      flagella: "2, Unequal, Lateral",
      habitat: "Primarily marine; fresh water rare",
      col: "#b45309",
      example: "Ectocarpus, Dictyota, Laminaria, Sargassum, Fucus"
    },
    rhodophyceae: {
      name: "Rhodophyceae (Red Algae)",
      pigments: "Chlorophyll a, d, r-Phycoerythrin",
      food: "Floridean Starch (like amylopectin, glycogen)",
      wall: "Cellulose, Pectin & Polysulphate Esters",
      flagella: "Absent",
      habitat: "Mostly marine (warm areas); some fresh water",
      col: "#ef4444",
      example: "Polysiphonia, Porphyra, Gracilaria, Gelidium"
    }
  };

  function setA(cls){
    aClass = cls;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Chlorophyceae</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#b45309;"></span><span>Phaeophyceae</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Rhodophyceae</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-chlo">Chlorophyceae (Green)</button>' +
      '<button class="preset-btn" id="p-phae">Phaeophyceae (Brown)</button>' +
      '<button class="preset-btn" id="p-rhod">Rhodophyceae (Red)</button>';

    document.getElementById("p-chlo").onclick = function(){ setActivePreset(this); setA("chlorophyceae"); };
    document.getElementById("p-phae").onclick = function(){ setActivePreset(this); setA("phaeophyceae"); };
    document.getElementById("p-rhod").onclick = function(){ setActivePreset(this); setA("rhodophyceae"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Table 3.1: Divisions of Algae and their Main Characteristics</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Pigments, stored food, cell wall and flagella of the three algal classes.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var d = aData[aClass];

    var m = '<rect width="720" height="300" fill="#09131d"/>';

    // Left diagram: Cell / Flagellar morphology
    m += '<rect x="40" y="30" width="260" height="240" rx="8" fill="#0b1726" stroke="' + d.col + '" stroke-width="1.5"/>';
    m += '<text x="170" y="55" fill="' + d.col + '" font-size="13" font-weight="700" text-anchor="middle">Cell &amp; Flagella Architecture</text>';

    if(aClass === "chlorophyceae"){
      // Green cell with 2 apical equal flagella
      m += '<ellipse cx="170" cy="160" rx="45" ry="55" fill="#065f46" stroke="#10b981" stroke-width="2.5"/>';
      m += '<circle cx="170" cy="180" r="14" fill="#047857" stroke="#34d399"/>';
      m += '<text x="170" y="184" fill="#a7f3d0" font-size="9" text-anchor="middle">Pyrenoid</text>';
      m += '<path d="M 160,105 Q 140,70 120,65" fill="none" stroke="#6ee7b7" stroke-width="2.5"/>';
      m += '<path d="M 180,105 Q 200,70 220,65" fill="none" stroke="#6ee7b7" stroke-width="2.5"/>';
      m += '<text x="170" y="245" fill="#a7f3d0" font-size="11" text-anchor="middle">2 Equal Apical Flagella</text>';

    } else if(aClass === "phaeophyceae"){
      // Pear-shaped cell with 2 lateral unequal flagella
      m += '<path d="M 170,110 C 210,130 215,190 170,210 C 125,190 130,130 170,110 Z" fill="#78350f" stroke="#b45309" stroke-width="2.5"/>';
      m += '<path d="M 135,150 Q 80,120 70,170" fill="none" stroke="#fcd34d" stroke-width="2.5"/>';
      m += '<path d="M 135,165 Q 100,180 95,200" fill="none" stroke="#fcd34d" stroke-width="2"/>';
      m += '<text x="170" y="245" fill="#fde68a" font-size="11" text-anchor="middle">2 Unequal Lateral Flagella</text>';

    } else {
      // Red algal branched thallus, no flagella
      m += '<line x1="170" y1="210" x2="170" y2="105" stroke="#ef4444" stroke-width="6"/>';
      m += '<line x1="170" y1="180" x2="135" y2="140" stroke="#ef4444" stroke-width="4"/>';
      m += '<line x1="170" y1="150" x2="205" y2="120" stroke="#ef4444" stroke-width="4"/>';
      m += '<line x1="170" y1="120" x2="140" y2="90" stroke="#ef4444" stroke-width="3"/>';
      m += '<text x="170" y="245" fill="#fca5a5" font-size="11" font-weight="700" text-anchor="middle">Flagella: Absent</text>';
    }

    // Right card: Table 3.1 row breakdown
    m += '<rect x="320" y="30" width="360" height="240" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="340" y="55" fill="' + d.col + '" font-size="14" font-weight="700">' + d.name + '</text>';

    var tRows = [
      { k: "Major Pigments", v: d.pigments },
      { k: "Stored Food", v: d.food },
      { k: "Cell Wall", v: d.wall },
      { k: "Flagellation", v: d.flagella },
      { k: "Habitat", v: d.habitat },
      { k: "Key Genera", v: d.example }
    ];

    for(var r = 0; r < tRows.length; r++){
      var tr = tRows[r];
      var y = 80 + r * 30;
      m += '<text x="340" y="' + y + '" fill="#94a3b8" font-size="11" font-weight="600">' + tr.k + ':</text>';
      m += '<text x="340" y="' + (y + 14) + '" fill="#f8fafc" font-size="11">' + tr.v + '</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Class", aClass.toUpperCase(), d.col) +
      cell("Stored Food", d.food.split(" ")[0], "#38bdf8") +
      cell("Flagellar Plan", d.flagella.split(",")[0], "#f59e0b") +
      cell("Primary Habitat", d.habitat.split(" ")[0], "#a855f7")
    );

    verdict(
      '<span style="color:' + d.col + ';font-weight:700;">Table 3.1 Match:</span> ' +
      d.name + ' contains ' + d.pigments + ', stores ' + d.food + ', and shows ' + d.flagella.toLowerCase() + ' flagellation.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. Bryophyte Life Cycle & Gemma Cup Explorer (bryophytelifecycle)
// §3.2 (pp. 27-29). Archegoniophore/Antheridiophore labels are Fig. 3.2's.
// -------------------------------------------------------------------------
window.SIMS.bryophytelifecycle = (function(){
  var bView = "marchantia"; // "marchantia", "funaria"

  function setV(v){
    bView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Gametophyte (n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Sporophyte (2n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Gemma Cup</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-mar">Marchantia Thallus (Liverwort)</button>' +
      '<button class="preset-btn" id="p-fun">Funaria Gametophyte + Sporophyte (Moss)</button>';

    document.getElementById("p-mar").onclick = function(){ setActivePreset(this); setV("marchantia"); };
    document.getElementById("p-fun").onclick = function(){ setActivePreset(this); setV("funaria"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Bryophytes: Amphibians of the Plant Kingdom (§3.2)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Marchantia dorsiventral thallus with gemma cups and Funaria dependent sporophyte.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(bView === "marchantia"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Marchantia (Liverwort): Thallus, Gemma Cups &amp; Archegoniophore</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Dorsiventral appressed thallus · Rhizoids · Asexual gemmae buds in cups</text>';

      // Flat thallus lobes
      m += '<path d="M 160,210 Q 180,160 220,170 Q 250,150 280,175 Q 310,160 340,210 Z" fill="#047857" stroke="#10b981" stroke-width="2.5"/>';
      // Rhizoids below
      m += '<line x1="200" y1="210" x2="190" y2="235" stroke="#94a3b8" stroke-width="1.5"/>';
      m += '<line x1="240" y1="210" x2="235" y2="240" stroke="#94a3b8" stroke-width="1.5"/>';
      m += '<line x1="280" y1="210" x2="290" y2="235" stroke="#94a3b8" stroke-width="1.5"/>';
      m += '<text x="240" y="255" fill="#94a3b8" font-size="10" text-anchor="middle">Rhizoids</text>';

      // Gemma cup
      m += '<ellipse cx="230" cy="180" rx="14" ry="7" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="227" cy="180" r="3" fill="#34d399"/>';
      m += '<circle cx="233" cy="180" r="3" fill="#34d399"/>';
      m += '<text x="230" y="165" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Gemma Cup</text>';

      // Female archegoniophore (Fig. 3.2 label)
      m += '<line x1="290" y1="175" x2="290" y2="95" stroke="#10b981" stroke-width="3"/>';
      m += '<path d="M 270,95 Q 290,75 310,95 L 305,105 Q 290,90 275,105 Z" fill="#059669" stroke="#34d399" stroke-width="1.5"/>';
      m += '<text x="290" y="70" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">Archegoniophore</text>';

      // Right explanation
      m += '<text x="420" y="120" fill="#38bdf8" font-size="13" font-weight="700">Gemmae Reproduction:</text>';
      m += '<text x="420" y="142" fill="#cbd5e1" font-size="11">• Green, multicellular asexual buds</text>';
      m += '<text x="420" y="162" fill="#cbd5e1" font-size="11">• Detach and germinate into new thalli</text>';
      m += '<text x="420" y="182" fill="#cbd5e1" font-size="11">• Sporophyte: foot, seta, capsule</text>';
      m += '<text x="420" y="202" fill="#cbd5e1" font-size="11">• Water needed for fertilisation</text>';

    } else {
      // Funaria moss gametophyte + sporophyte
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Funaria (Moss): Dependent Sporophyte on Leafy Gametophyte</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Gametophyte (n): Leafy shoot · Sporophyte (2n): Foot, Seta &amp; Capsule</text>';

      // Lower gametophyte leafy shoot
      m += '<line x1="260" y1="230" x2="260" y2="150" stroke="#10b981" stroke-width="4"/>';
      for(var l = 0; l < 6; l++){
        var ly = 210 - l * 10;
        m += '<line x1="260" y1="' + ly + '" x2="245" y2="' + (ly - 6) + '" stroke="#34d399" stroke-width="2.5"/>';
        m += '<line x1="260" y1="' + ly + '" x2="275" y2="' + (ly - 6) + '" stroke="#34d399" stroke-width="2.5"/>';
      }
      m += '<text x="210" y="185" fill="#10b981" font-size="11" font-weight="700">Gametophyte (n)</text>';

      // Upper sporophyte (seta and capsule)
      m += '<path d="M 260,150 Q 250,110 270,75" fill="none" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<ellipse cx="272" cy="70" rx="10" ry="16" fill="#b45309" stroke="#f59e0b" stroke-width="2"/>';
      m += '<polygon points="267,54 272,46 277,54" fill="#fde68a"/>';
      m += '<text x="310" y="70" fill="#f59e0b" font-size="11" font-weight="700">Sporophyte (2n)</text>';
      m += '<text x="310" y="86" fill="#94a3b8" font-size="10">Capsule: elaborate dispersal</text>';

      // Right explanation
      m += '<text x="440" y="125" fill="#f59e0b" font-size="13" font-weight="700">Key Moss Biology:</text>';
      m += '<text x="440" y="147" fill="#cbd5e1" font-size="11">• Sporophyte is nutritionally dependent</text>';
      m += '<text x="440" y="167" fill="#cbd5e1" font-size="11">• Meiosis occurs in capsule</text>';
      m += '<text x="440" y="187" fill="#cbd5e1" font-size="11">• Spores germinate into protonema</text>';
      m += '<text x="440" y="207" fill="#cbd5e1" font-size="11">• Sphagnum provides peat</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Group", bView === "marchantia" ? "Liverwort (Marchantia)" : "Moss (Funaria)", "#10b981") +
      cell("Dominant Phase", "Gametophyte (Haploid, n)", "#38bdf8") +
      cell("Water Dependency", "Absolute (amphibians of plants)", "#f59e0b") +
      cell("Sporophyte Nature", "Nutritionally Dependent (2n)", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Bryophyte Hallmarks:</span> ' +
      'Gametophyte is the dominant phase. Water is mandatory for biflagellate antherozoids to reach archegonia. The sporophyte stays attached to and nourished by the gametophyte.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. Pteridophyte Prothallus & Sporophyte Explorer (pteridophyteexplorer)
// §3.3 (pp. 29-31). Only printed structures: prothallus, sporangia on
// sporophylls, and xylem + phloem.
// -------------------------------------------------------------------------
window.SIMS.pteridophyteexplorer = (function(){
  var pMode = "prothallus"; // "prothallus", "frond"

  function setM(m){
    pMode = m;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Prothallus (Gametophyte, n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sporophyte (2n, Vascular)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pro">Prothallus (Gametophyte)</button>' +
      '<button class="preset-btn" id="p-fro">Fern Sporophyte &amp; Sporangia</button>';

    document.getElementById("p-pro").onclick = function(){ setActivePreset(this); setM("prothallus"); };
    document.getElementById("p-fro").onclick = function(){ setActivePreset(this); setM("frond"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Pteridophytes: First Terrestrial Vascular Plants (§3.3)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Free-living prothallus and dominant vascular sporophyte with sporangia.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(pMode === "prothallus"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Fern Prothallus: Free-Living Gametophyte (n)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Thalloid · Photosynthetic · Cool, damp, shady places · Water for fertilisation</text>';

      // Thalloid prothallus
      m += '<path d="M 230,120 C 190,70 140,110 140,150 C 140,200 230,240 230,240 C 230,240 320,200 320,150 C 320,110 270,70 230,120 Z" fill="#047857" stroke="#10b981" stroke-width="2.5"/>';
      // Archegonia
      m += '<circle cx="225" cy="140" r="4" fill="#f59e0b"/>';
      m += '<circle cx="235" cy="140" r="4" fill="#f59e0b"/>';
      m += '<circle cx="230" cy="150" r="4" fill="#f59e0b"/>';
      m += '<text x="230" y="115" fill="#fde68a" font-size="10" font-weight="700" text-anchor="middle">Archegonia</text>';

      // Antheridia near base
      m += '<circle cx="220" cy="205" r="3" fill="#38bdf8"/>';
      m += '<circle cx="230" cy="210" r="3" fill="#38bdf8"/>';
      m += '<circle cx="240" cy="205" r="3" fill="#38bdf8"/>';
      m += '<text x="230" y="225" fill="#bae6fd" font-size="10" font-weight="700" text-anchor="middle">Antheridia</text>';

      // Right explanation
      m += '<text x="380" y="125" fill="#38bdf8" font-size="13" font-weight="700">Why Water Still Rules:</text>';
      m += '<text x="380" y="147" fill="#cbd5e1" font-size="11">• Prothallus is small and free-living</text>';
      m += '<text x="380" y="167" fill="#cbd5e1" font-size="11">• Antherozoids need water to swim</text>';
      m += '<text x="380" y="187" fill="#cbd5e1" font-size="11">• Cool, damp, shady places required</text>';
      m += '<text x="380" y="207" fill="#cbd5e1" font-size="11">• Zygote grows into the sporophyte</text>';

    } else {
      // Fern sporophyte with sporangia
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Fern Sporophyte (2n): Leaves with Sporangia</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">True roots, stem and leaves · Xylem and phloem · Sporangia on sporophylls</text>';

      // Frond axis
      m += '<path d="M 180,240 Q 230,160 280,75" fill="none" stroke="#10b981" stroke-width="3.5"/>';
      // Pinnae with sporangia dots
      for(var p = 0; p < 7; p++){
        var py = 210 - p * 18;
        var px = 195 + p * 12;
        m += '<line x1="' + px + '" y1="' + py + '" x2="' + (px - 35) + '" y2="' + (py - 12) + '" stroke="#047857" stroke-width="2"/>';
        m += '<line x1="' + px + '" y1="' + py + '" x2="' + (px + 35) + '" y2="' + (py - 12) + '" stroke="#047857" stroke-width="2"/>';
        m += '<circle cx="' + (px - 20) + '" cy="' + (py - 8) + '" r="3" fill="#b45309"/>';
        m += '<circle cx="' + (px + 20) + '" cy="' + (py - 8) + '" r="3" fill="#b45309"/>';
      }
      m += '<text x="280" y="65" fill="#fde68a" font-size="11" font-weight="700">Sporangia on sporophylls</text>';

      // Right explanation
      m += '<text x="410" y="125" fill="#10b981" font-size="13" font-weight="700">First Vascular Plants:</text>';
      m += '<text x="410" y="147" fill="#cbd5e1" font-size="11">• Xylem and phloem present</text>';
      m += '<text x="410" y="167" fill="#cbd5e1" font-size="11">• True root, stem, megaphylls</text>';
      m += '<text x="410" y="187" fill="#cbd5e1" font-size="11">• Meiosis in spore mother cells</text>';
      m += '<text x="410" y="207" fill="#cbd5e1" font-size="11">• Used as soil-binders</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Plant Group", "Pteridophytes", "#38bdf8") +
      cell("Main Body", "Diploid Sporophyte (2n)", "#10b981") +
      cell("Vascular Tissue", "Xylem & Phloem Present", "#f59e0b") +
      cell("Gametophyte", "Free-living Prothallus (n)", "#ec4899")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">First Vascular Plants:</span> ' +
      'Pteridophytes run a dominant independent sporophyte, but the free-living prothallus still requires water for fertilisation.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. Homospory vs Heterospory Explorer (heterosporylab)
// §3.3 (p. 31). Majority homosporous (unnamed); Selaginella + Salvinia
// heterosporous. Sexuality wording stays inside the chapter’s vocabulary.
// -------------------------------------------------------------------------
window.SIMS.heterosporylab = (function(){
  var sporyType = "heterospory"; // "homospory", "heterospory"

  function setS(s){
    sporyType = s;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Microspores (Male)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Megaspores (Female)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Retained on Parent</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-homo">Homosporous Majority (One Spore)</button>' +
      '<button class="preset-btn active" id="p-hetero">Heterosporous Pair (Two Spores)</button>';

    document.getElementById("p-homo").onclick = function(){ setActivePreset(this); setS("homospory"); };
    document.getElementById("p-hetero").onclick = function(){ setActivePreset(this); setS("heterospory"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Heterospory &amp; the Seed Habit Precursor (§3.3)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">One spore kind in most pteridophytes; two kinds in Selaginella and Salvinia.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(sporyType === "homospory"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Homosporous Majority (One Spore Kind)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Single kind of spores · Prothallus with antheridia and archegonia</text>';

      // Uniform spores
      for(var i = 0; i < 20; i++){
        var sx = 100 + (i % 5) * 35;
        var sy = 120 + Math.floor(i / 5) * 30;
        m += '<circle cx="' + sx + '" cy="' + sy + '" r="8" fill="#38bdf8" stroke="#0284c7"/>';
      }
      m += '<text x="170" y="245" fill="#bae6fd" font-size="11" font-weight="700" text-anchor="middle">Uniform Spores (n)</text>';

      // Arrow -> prothallus
      m += '<line x1="280" y1="165" x2="340" y2="165" stroke="#f8fafc" stroke-width="2"/>';
      m += '<polygon points="340,160 355,165 340,170" fill="#f8fafc"/>';

      m += '<text x="440" y="130" fill="#38bdf8" font-size="13" font-weight="700">Shared Prothallus:</text>';
      m += '<text x="440" y="152" fill="#cbd5e1" font-size="11">• Free-living outside parent</text>';
      m += '<text x="440" y="172" fill="#cbd5e1" font-size="11">• Bears antheridia + archegonia</text>';
      m += '<text x="440" y="192" fill="#cbd5e1" font-size="11">• Water needed for fertilisation</text>';

    } else {
      // Heterospory (Selaginella / Salvinia)
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Heterosporous Pair (Selaginella / Salvinia)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Microspores (male) + Megaspores (female) · Females retained on parent</text>';

      // Left: Microspores (small, numerous)
      m += '<rect x="80" y="110" width="100" height="90" rx="6" fill="#0c1f36" stroke="#38bdf8"/>';
      for(var ms = 0; ms < 16; ms++){
        var mx = 95 + (ms % 4) * 22;
        var my = 125 + Math.floor(ms / 4) * 18;
        m += '<circle cx="' + mx + '" cy="' + my + '" r="4" fill="#38bdf8"/>';
      }
      m += '<text x="130" y="220" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">Microspores</text>';

      // Middle: Megaspores (large)
      m += '<rect x="210" y="110" width="100" height="90" rx="6" fill="#260b1c" stroke="#ec4899"/>';
      m += '<circle cx="240" cy="138" r="14" fill="#ec4899"/>';
      m += '<circle cx="280" cy="138" r="14" fill="#ec4899"/>';
      m += '<circle cx="240" cy="172" r="14" fill="#ec4899"/>';
      m += '<circle cx="280" cy="172" r="14" fill="#ec4899"/>';
      m += '<text x="260" y="220" fill="#ec4899" font-size="11" font-weight="700" text-anchor="middle">Megaspores</text>';

      // Right: significance card
      m += '<rect x="340" y="105" width="310" height="135" rx="6" fill="#031f17" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="360" y="130" fill="#10b981" font-size="13" font-weight="700">Precursor to Seed Habit:</text>';
      m += '<text x="360" y="152" fill="#cbd5e1" font-size="11">• Female gametophytes stay on parent</text>';
      m += '<text x="360" y="172" fill="#cbd5e1" font-size="11">• Zygotes become embryos within them</text>';
      m += '<text x="360" y="192" fill="#cbd5e1" font-size="11">• Important step in evolution</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Pattern", sporyType.toUpperCase(), sporyType === "heterospory" ? "#10b981" : "#38bdf8") +
      cell("Members", sporyType === "heterospory" ? "Selaginella, Salvinia" : "Majority of pteridophytes", "#f59e0b") +
      cell("Gametophytes", sporyType === "heterospory" ? "Separate male + female" : "Shared prothallus", "#ec4899") +
      cell("Significance", sporyType === "heterospory" ? "Seed Habit Precursor" : "General pattern", "#a855f7")
    );

    verdict(
      sporyType === "heterospory" ?
      '<span style="color:#10b981;font-weight:700;">Seed Habit Preview:</span> In Selaginella and Salvinia, female gametophytes stay retained on the parent while zygotes develop into embryos within them — the precursor to the seed habit.' :
      '<span style="color:#38bdf8;font-weight:700;">General Pattern:</span> Most pteridophytes make one spore kind; the free-living prothallus bears both antheridia and archegonia.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. Gymnosperm Cones & Needles Explorer (gymnospermcone)
// §3.4 (pp. 31-33). Pollen rides air currents to the ovule opening; only
// printed structures and processes appear below.
// -------------------------------------------------------------------------
window.SIMS.gymnospermcone = (function(){
  var gType = "ovule"; // "ovule", "needle"

  function setG(g){
    gType = g;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Naked Ovule / Seed</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Megasporophyll</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pollen in Air Currents</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ov">Pinus Naked Ovule &amp; Air Pollination</button>' +
      '<button class="preset-btn" id="p-ne">Pinus Needle Adaptations</button>';

    document.getElementById("p-ov").onclick = function(){ setActivePreset(this); setG("ovule"); };
    document.getElementById("p-ne").onclick = function(){ setActivePreset(this); setG("needle"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Gymnosperms: Naked Seeds &amp; Conifer Needles (§3.4)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Ovules exposed on megasporophylls; pollen carried in air currents to the ovule opening.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(gType === "ovule"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Gymnosperm Naked Ovule on Megasporophyll (No Ovary Wall)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Ovule exposed on scale · Opening receives air-current pollen · Pollen tube to archegonia</text>';

      // Megasporophyll scale
      m += '<path d="M 120,200 L 280,180 L 320,130 L 290,135 L 140,185 Z" fill="#78350f" stroke="#b45309" stroke-width="2"/>';
      m += '<text x="210" y="215" fill="#fcd34d" font-size="10">Megasporophyll</text>';

      // Exposed ovule sitting on top
      m += '<ellipse cx="230" cy="155" rx="28" ry="18" fill="#d97706" stroke="#f59e0b" stroke-width="2"/>';
      m += '<circle cx="240" cy="155" r="10" fill="#fef08a"/>';
      m += '<text x="230" y="130" fill="#fef08a" font-size="11" font-weight="700">Naked Ovule</text>';

      // Pollen grain drifting in
      m += '<circle cx="360" cy="145" r="7" fill="#fde047"/>';
      m += '<path d="M 400,135 Q 380,140 375,145" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 2"/>';
      m += '<path d="M 405,155 Q 385,150 375,150" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 2"/>';
      m += '<text x="360" y="125" fill="#fde047" font-size="10" font-weight="700" text-anchor="middle">Pollen (air currents)</text>';

      // Right callouts
      m += '<text x="440" y="125" fill="#f59e0b" font-size="13" font-weight="700">Gymnosperm Hallmarks:</text>';
      m += '<text x="440" y="147" fill="#cbd5e1" font-size="11">• Seeds naked (not covered)</text>';
      m += '<text x="440" y="167" fill="#cbd5e1" font-size="11">• Pollen in air currents</text>';
      m += '<text x="440" y="187" fill="#cbd5e1" font-size="11">• Pinus roots host mycorrhizae</text>';
      m += '<text x="440" y="207" fill="#cbd5e1" font-size="11">• Cycas coralloid + cyanobacteria</text>';

    } else {
      // Pinus needle adaptations
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Pinus Needle: Built for Extremes (§3.4)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Needle shape (small surface) · Thick cuticle · Sunken stomata · Less water loss</text>';

      // Needle cross section
      m += '<path d="M 140,190 A 90,90 0 0,1 320,190 Z" fill="#064e3b" stroke="#10b981" stroke-width="3"/>';
      // Cuticle outline
      m += '<path d="M 136,192 A 94,94 0 0,1 324,192" fill="none" stroke="#fef08a" stroke-width="4"/>';
      m += '<text x="230" y="85" fill="#fef08a" font-size="10" font-weight="700" text-anchor="middle">Thick Cuticle</text>';

      // Sunken stomata
      m += '<circle cx="180" cy="140" r="4" fill="#022c22" stroke="#34d399"/>';
      m += '<circle cx="280" cy="140" r="4" fill="#022c22" stroke="#34d399"/>';
      m += '<text x="140" y="130" fill="#34d399" font-size="9">Sunken Stoma</text>';
      m += '<text x="230" y="165" fill="#a7f3d0" font-size="10" text-anchor="middle">Needle: small surface area</text>';

      // Right explanation
      m += '<text x="420" y="125" fill="#10b981" font-size="13" font-weight="700">Withstands Extremes:</text>';
      m += '<text x="420" y="147" fill="#cbd5e1" font-size="11">• Temperature extremes</text>';
      m += '<text x="420" y="167" fill="#cbd5e1" font-size="11">• Humidity extremes</text>';
      m += '<text x="420" y="187" fill="#cbd5e1" font-size="11">• Wind extremes</text>';
      m += '<text x="420" y="207" fill="#cbd5e1" font-size="11">• All via reduced water loss</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Plant Group", "Gymnosperms", "#f59e0b") +
      cell("Seed Status", "NAKED (Uncovered)", "#ef4444") +
      cell("Pollination", "Air Currents", "#38bdf8") +
      cell("Root Symbionts", "Mycorrhiza / Coralloid", "#10b981")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Gymnosperm Hallmarks:</span> ' +
      'Ovules sit exposed on megasporophylls without an ovary wall, maturing into naked seeds. Needle leaves with thick cuticle and sunken stomata cut water loss under extremes.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. Angiosperm Profile Explorer (angiospermprofile)
// §3.5 ONLY (p. 34): flowers, enclosed seeds, size span, uses, two classes.
// Double fertilization is NOT in this reprint — the lesson carries a flagged
// bridge, and the sim stays strictly inside §3.5.
// -------------------------------------------------------------------------
window.SIMS.angiospermprofile = (function(){
  var view = "flower"; // "flower", "size", "classes"

  function setView(v){
    view = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Flowers &amp; Fruits</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Size &amp; Uses</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Two Classes</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-flower">Flowers &amp; Fruits</button>' +
      '<button class="preset-btn" id="p-size">Size Span &amp; Uses</button>' +
      '<button class="preset-btn" id="p-classes">Dicots &amp; Monocots</button>';

    document.getElementById("p-flower").onclick = function(){ setActivePreset(this); setView("flower"); };
    document.getElementById("p-size").onclick = function(){ setActivePreset(this); setView("size"); };
    document.getElementById("p-classes").onclick = function(){ setActivePreset(this); setView("classes"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Angiosperms (§3.5, p. 34) — the reprint\u2019s whole section</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Flowers, enclosed seeds, size span, uses, two classes. Reproductive detail lives outside this chapter.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(view === "flower"){
      m += '<text x="360" y="45" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">Flowers → Fruits (§3.5)</text>';
      m += '<rect x="90" y="70" width="230" height="120" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="205" y="105" fill="#ec4899" font-size="15" font-weight="700" text-anchor="middle">Flowers</text>';
      m += '<text x="205" y="130" fill="#cbd5e1" font-size="12" text-anchor="middle">pollen grains + ovules</text>';
      m += '<text x="205" y="152" fill="#64748b" font-size="11" text-anchor="middle">specialised structures</text>';
      m += '<text x="360" y="135" fill="#f59e0b" font-size="22" font-weight="700" text-anchor="middle">→</text>';
      m += '<rect x="400" y="70" width="230" height="120" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="515" y="105" fill="#10b981" font-size="15" font-weight="700" text-anchor="middle">Fruits</text>';
      m += '<text x="515" y="130" fill="#cbd5e1" font-size="12" text-anchor="middle">seeds enclosed inside</text>';
      m += '<text x="515" y="152" fill="#64748b" font-size="11" text-anchor="middle">versus naked gymnosperm seeds</text>';
      m += '<text x="360" y="235" fill="#e2e8f0" font-size="12" text-anchor="middle">Unlike gymnosperms with naked ovules, angiosperm pollen and ovules develop in flowers.</text>';
      readout(
        cell("Structures", "Flowers", "#ec4899") +
        cell("Develop In Them", "Pollen + ovules", "#38bdf8") +
        cell("Seeds", "Enclosed in fruits", "#10b981") +
        cell("Contrast", "Naked gymnosperms", "#f59e0b")
      );
      verdict(
        '<span style="color:#ec4899;font-weight:700;">Angiosperm (§3.5):</span> ' +
        'Pollen grains and ovules develop in flowers; seeds mature enclosed in fruits.'
      );
    } else if(view === "size"){
      m += '<text x="360" y="45" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">Size Span &amp; Uses (§3.5)</text>';
      m += '<rect x="90" y="70" width="230" height="120" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="205" y="105" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">Wolffia</text>';
      m += '<text x="205" y="130" fill="#cbd5e1" font-size="12" text-anchor="middle">smallest angiosperm</text>';
      m += '<text x="205" y="152" fill="#64748b" font-size="11" text-anchor="middle">tiny aquatic plant</text>';
      m += '<rect x="400" y="70" width="230" height="120" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="515" y="105" fill="#10b981" font-size="15" font-weight="700" text-anchor="middle">Eucalyptus</text>';
      m += '<text x="515" y="130" fill="#cbd5e1" font-size="12" text-anchor="middle">over 100 metres</text>';
      m += '<text x="515" y="152" fill="#64748b" font-size="11" text-anchor="middle">tall trees</text>';
      m += '<text x="360" y="225" fill="#e2e8f0" font-size="12" text-anchor="middle">Uses: food, fodder, fuel, medicines + other commercial products.</text>';
      m += '<text x="360" y="248" fill="#64748b" font-size="11" text-anchor="middle">Exceptionally large group in a wide range of habitats.</text>';
      readout(
        cell("Smallest", "Wolffia", "#38bdf8") +
        cell("Tallest", "Eucalyptus 100 m+", "#10b981") +
        cell("Uses", "Food, fodder, fuel", "#f59e0b") +
        cell("Plus", "Medicines + more", "#a855f7")
      );
      verdict(
        '<span style="color:#10b981;font-weight:700;">Largest Group:</span> ' +
        'An exceptionally large group across habitats — Wolffia to 100-metre Eucalyptus — giving food, fodder, fuel and medicines.'
      );
    } else {
      m += '<text x="360" y="45" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">Two Classes (Fig. 3.5)</text>';
      m += '<rect x="90" y="70" width="230" height="120" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="205" y="110" fill="#f59e0b" font-size="16" font-weight="700" text-anchor="middle">Dicotyledons</text>';
      m += '<text x="205" y="140" fill="#cbd5e1" font-size="12" text-anchor="middle">Fig. 3.5(a)</text>';
      m += '<text x="205" y="162" fill="#64748b" font-size="11" text-anchor="middle">characters not listed in §3.5</text>';
      m += '<rect x="400" y="70" width="230" height="120" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="515" y="110" fill="#38bdf8" font-size="16" font-weight="700" text-anchor="middle">Monocotyledons</text>';
      m += '<text x="515" y="140" fill="#cbd5e1" font-size="12" text-anchor="middle">Fig. 3.5(b)</text>';
      m += '<text x="515" y="162" fill="#64748b" font-size="11" text-anchor="middle">characters not listed in §3.5</text>';
      m += '<text x="360" y="235" fill="#e2e8f0" font-size="12" text-anchor="middle">The reprint names both classes with a figure — and describes neither.</text>';
      readout(
        cell("Class A", "Dicotyledons", "#f59e0b") +
        cell("Class B", "Monocotyledons", "#38bdf8") +
        cell("Figure", "Fig. 3.5 (a), (b)", "#10b981") +
        cell("Characters", "Not listed (§3.5)", "#a855f7")
      );
      verdict(
        '<span style="color:#38bdf8;font-weight:700;">Two Classes:</span> ' +
        'Dicotyledons and monocotyledons (Fig. 3.5) — named and figured, with distinguishing characters left out of this reprint.'
      );
    }

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. Dominant Phases Explorer (dominantphases)
// Dominance per group from §§3.2-3.4. The old pattern names are flagged in
// the lesson, not taught as chapter content; the sim shows only the patterns.
// -------------------------------------------------------------------------
window.SIMS.dominantphases = (function(){
  var group = "bryophytes"; // "bryophytes", "pteridophytes", "gymnosperms"

  function setG(g){
    group = g;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Gametophyte (n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sporophyte (2n)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-bryo">Bryophytes (Gametophyte Rules)</button>' +
      '<button class="preset-btn" id="p-pteri">Pteridophytes (Sporophyte Rules)</button>' +
      '<button class="preset-btn" id="p-gymno">Gymnosperms (Captive Gametophytes)</button>';

    document.getElementById("p-bryo").onclick = function(){ setActivePreset(this); setG("bryophytes"); };
    document.getElementById("p-pteri").onclick = function(){ setActivePreset(this); setG("pteridophytes"); };
    document.getElementById("p-gymno").onclick = function(){ setActivePreset(this); setG("gymnosperms"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Dominant phases across §§3.2–3.4</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Which generation dominates — and how free the other one is.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    var cx = 200, cy = 150;

    if(group === "bryophytes"){
      m += '<text x="50" y="45" fill="#10b981" font-size="14" font-weight="700">Bryophytes: Gametophyte Dominant (§3.2)</text>';
      // Big green gametophyte, small blue sporophyte attached
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="95" ry="70" fill="#065f46" stroke="#10b981" stroke-width="2.5"/>';
      m += '<text x="' + cx + '" y="' + (cy - 8) + '" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Gametophyte (n)</text>';
      m += '<text x="' + cx + '" y="' + (cy + 12) + '" fill="#a7f3d0" font-size="11" text-anchor="middle">main plant body</text>';
      m += '<ellipse cx="' + (cx + 60) + '" cy="' + (cy - 55) + '" rx="42" ry="26" fill="#0c1f36" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx + 60) + '" y="' + (cy - 51) + '" fill="#bae6fd" font-size="10" font-weight="700" text-anchor="middle">Sporophyte (2n)</text>';
      m += '<text x="' + (cx + 60) + '" y="' + (cy - 38) + '" fill="#64748b" font-size="9" text-anchor="middle">attached + nourished</text>';

      m += '<rect x="360" y="60" width="320" height="205" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="380" y="88" fill="#10b981" font-size="14" font-weight="700">Gametophyte Rules:</text>';
      m += '<text x="380" y="115" fill="#cbd5e1" font-size="11">• Main body haploid, gamete-producing</text>';
      m += '<text x="380" y="135" fill="#cbd5e1" font-size="11">• Sporophyte not free-living</text>';
      m += '<text x="380" y="155" fill="#cbd5e1" font-size="11">• Meiosis in capsule → spores</text>';
      m += '<text x="380" y="175" fill="#cbd5e1" font-size="11">• Water needed for fertilisation</text>';
    } else if(group === "pteridophytes"){
      m += '<text x="50" y="45" fill="#38bdf8" font-size="14" font-weight="700">Pteridophytes: Sporophyte Dominant (§3.3)</text>';
      // Big blue sporophyte, small green prothallus free
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="95" ry="70" fill="#0c1f36" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="' + cx + '" y="' + (cy - 8) + '" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Sporophyte (2n)</text>';
      m += '<text x="' + cx + '" y="' + (cy + 12) + '" fill="#bae6fd" font-size="11" text-anchor="middle">true root/stem/leaves</text>';
      m += '<ellipse cx="' + (cx - 70) + '" cy="' + (cy + 62) + '" rx="52" ry="28" fill="#065f46" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="' + (cx - 70) + '" y="' + (cy + 60) + '" fill="#a7f3d0" font-size="10" font-weight="700" text-anchor="middle">Prothallus (n)</text>';
      m += '<text x="' + (cx - 70) + '" y="' + (cy + 74) + '" fill="#64748b" font-size="9" text-anchor="middle">free-living</text>';

      m += '<rect x="360" y="60" width="320" height="205" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="380" y="88" fill="#38bdf8" font-size="14" font-weight="700">Sporophyte Rules:</text>';
      m += '<text x="380" y="115" fill="#cbd5e1" font-size="11">• Main body diploid, vascular</text>';
      m += '<text x="380" y="135" fill="#cbd5e1" font-size="11">• Prothallus small but free</text>';
      m += '<text x="380" y="155" fill="#cbd5e1" font-size="11">• Meiosis in sporangia → spores</text>';
      m += '<text x="380" y="175" fill="#cbd5e1" font-size="11">• Water still needed for fertilisation</text>';
    } else {
      m += '<text x="50" y="45" fill="#f59e0b" font-size="14" font-weight="700">Gymnosperms: Gametophytes in Captivity (§3.4)</text>';
      // Big blue sporophyte containing tiny green gametophytes
      m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="95" ry="70" fill="#0c1f36" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<text x="' + cx + '" y="' + (cy - 30) + '" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Sporophyte (2n)</text>';
      m += '<circle cx="' + (cx - 35) + '" cy="' + (cy + 15) + '" r="22" fill="#065f46" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="' + (cx - 35) + '" y="' + (cy + 12) + '" fill="#a7f3d0" font-size="9" font-weight="700" text-anchor="middle">pollen</text>';
      m += '<text x="' + (cx - 35) + '" y="' + (cy + 24) + '" fill="#a7f3d0" font-size="9" text-anchor="middle">grain</text>';
      m += '<circle cx="' + (cx + 35) + '" cy="' + (cy + 15) + '" r="22" fill="#065f46" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="' + (cx + 35) + '" y="' + (cy + 12) + '" fill="#a7f3d0" font-size="9" font-weight="700" text-anchor="middle">female</text>';
      m += '<text x="' + (cx + 35) + '" y="' + (cy + 24) + '" fill="#a7f3d0" font-size="9" text-anchor="middle">tissue</text>';
      m += '<text x="' + cx + '" y="' + (cy + 58) + '" fill="#64748b" font-size="9" text-anchor="middle">both retained in sporangia</text>';

      m += '<rect x="360" y="60" width="320" height="205" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="380" y="88" fill="#f59e0b" font-size="14" font-weight="700">Nothing Lives Free:</text>';
      m += '<text x="380" y="115" fill="#cbd5e1" font-size="11">• Male gametophyte = pollen grain</text>';
      m += '<text x="380" y="135" fill="#cbd5e1" font-size="11">• Female = retained archegoniate tissue</text>';
      m += '<text x="380" y="155" fill="#cbd5e1" font-size="11">• Pollen rides air currents</text>';
      m += '<text x="380" y="175" fill="#cbd5e1" font-size="11">• Seeds exposed, never enclosed</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Group", group.toUpperCase(), "#f59e0b") +
      cell("Dominant Phase", group === "bryophytes" ? "Gametophyte (n)" : "Sporophyte (2n)", "#38bdf8") +
      cell("Other Phase", group === "bryophytes" ? "Dependent sporophyte" : (group === "pteridophytes" ? "Free prothallus" : "Captive gametophytes"), "#10b981") +
      cell("Water Need", group === "gymnosperms" ? "None (air currents)" : "For fertilisation", "#ec4899")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Dominance Ladder:</span> ' +
      (group === "bryophytes" ? "Bryophytes run a dominant gametophyte with a nourished, dependent sporophyte." :
       (group === "pteridophytes" ? "Pteridophytes run a dominant sporophyte with a small but free-living prothallus." :
        "Gymnosperms run a dominant sporophyte with gametophytes reduced to a grain and a tissue, never free."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101/kebo102 —
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
