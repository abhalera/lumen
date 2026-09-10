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
// 1. SIMULATION 1: Algal Classes & Pigments (algaepigmentlab)
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
      habitat: "Primarily marine (cold seas)",
      col: "#b45309",
      example: "Ectocarpus, Dictyota, Laminaria, Sargassum, Fucus"
    },
    rhodophyceae: {
      name: "Rhodophyceae (Red Algae)",
      pigments: "Chlorophyll a, d, r-Phycoerythrin",
      food: "Floridean Starch (like amylopectin)",
      wall: "Cellulose, Pectin & Polysulphate Esters",
      flagella: "COMPLETELY ABSENT at all stages",
      habitat: "Marine (deep oceans & warm surface)",
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
        '<label>NCERT Table 3.1: Divisions of Algae and their Main Characteristics</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Directly compares pigments, food storage, cell walls, and flagella of the three algal classes.</div>' +
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
      // Chlamydomonas with 2 apical equal flagella
      m += '<ellipse cx="170" cy="160" rx="45" ry="55" fill="#065f46" stroke="#10b981" stroke-width="2.5"/>';
      m += '<circle cx="170" cy="180" r="14" fill="#047857" stroke="#34d399"/>'; // Pyrenoid
      m += '<text x="170" y="184" fill="#a7f3d0" font-size="9" text-anchor="middle">Pyrenoid</text>';
      // 2 apical equal flagella
      m += '<path d="M 160,105 Q 140,70 120,65" fill="none" stroke="#6ee7b7" stroke-width="2.5"/>';
      m += '<path d="M 180,105 Q 200,70 220,65" fill="none" stroke="#6ee7b7" stroke-width="2.5"/>';
      m += '<text x="170" y="245" fill="#a7f3d0" font-size="11" text-anchor="middle">2 Equal Apical Flagella</text>';

    } else if(aClass === "phaeophyceae"){
      // Pear-shaped zoospore with 2 lateral unequal flagella
      m += '<path d="M 170,110 C 210,130 215,190 170,210 C 125,190 130,130 170,110 Z" fill="#78350f" stroke="#b45309" stroke-width="2.5"/>';
      // Lateral unequal flagella
      m += '<path d="M 135,150 Q 80,120 70,170" fill="none" stroke="#fcd34d" stroke-width="2.5"/>'; // Long whiplash
      m += '<path d="M 135,165 Q 100,180 95,200" fill="none" stroke="#fcd34d" stroke-width="2"/>'; // Short tinsel
      m += '<text x="170" y="245" fill="#fde68a" font-size="11" text-anchor="middle">2 Unequal Lateral Flagella</text>';

    } else {
      // Polysiphonia non-motile thallus
      m += '<line x1="170" y1="210" x2="170" y2="105" stroke="#ef4444" stroke-width="6"/>';
      m += '<line x1="170" y1="180" x2="135" y2="140" stroke="#ef4444" stroke-width="4"/>';
      m += '<line x1="170" y1="150" x2="205" y2="120" stroke="#ef4444" stroke-width="4"/>';
      m += '<line x1="170" y1="120" x2="140" y2="90" stroke="#ef4444" stroke-width="3"/>';
      m += '<text x="170" y="245" fill="#fca5a5" font-size="11" font-weight="700" text-anchor="middle">FLAGELLA STRICTLY ABSENT</text>';
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
      '<span style="color:' + d.col + ';font-weight:700;">NCERT Table 3.1 Match:</span> ' +
      d.name + ' contains ' + d.pigments + ', stores ' + d.food + ', and features ' + d.flagella.toLowerCase() + '.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Bryophyte Life Cycle & Gemma Cup (bryophytelifecycle)
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
        '<label>Bryophytes: Amphibians of the Plant Kingdom (NCERT 3.2)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Inspect Marchantia dorsiventral thallus with gemma cups and Funaria dependent diploid sporophyte.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(bView === "marchantia"){
      // Marchantia thallus with gemma cups & archegoniophore
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Marchantia (Liverwort): Thallus, Gemma Cups &amp; Archegoniophore</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Dorsiventral prostrate thallus · Unicellular rhizoids · Asexual gemmae buds in cups</text>';

      // Flat thallus lobes
      m += '<path d="M 160,210 Q 180,160 220,170 Q 250,150 280,175 Q 310,160 340,210 Z" fill="#047857" stroke="#10b981" stroke-width="2.5"/>';
      // Rhizoids below
      m += '<line x1="200" y1="210" x2="190" y2="235" stroke="#94a3b8" stroke-width="1.5"/>';
      m += '<line x1="240" y1="210" x2="235" y2="240" stroke="#94a3b8" stroke-width="1.5"/>';
      m += '<line x1="280" y1="210" x2="290" y2="235" stroke="#94a3b8" stroke-width="1.5"/>';
      m += '<text x="240" y="255" fill="#94a3b8" font-size="10" text-anchor="middle">Rhizoids</text>';

      // Gemma cups on dorsal surface
      m += '<ellipse cx="230" cy="180" rx="14" ry="7" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="227" cy="180" r="3" fill="#34d399"/>';
      m += '<circle cx="233" cy="180" r="3" fill="#34d399"/>';
      m += '<text x="230" y="165" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Gemma Cup</text>';

      // Female archegoniophore umbrella
      m += '<line x1="290" y1="175" x2="290" y2="95" stroke="#10b981" stroke-width="3"/>';
      m += '<path d="M 270,95 Q 290,75 310,95 L 305,105 Q 290,90 275,105 Z" fill="#059669" stroke="#34d399" stroke-width="1.5"/>';
      m += '<text x="290" y="70" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">Archegoniophore</text>';

      // Right explanation
      m += '<text x="420" y="120" fill="#38bdf8" font-size="13" font-weight="700">Gemmae Reproduction:</text>';
      m += '<text x="420" y="142" fill="#cbd5e1" font-size="11">• Green, multicellular asexual buds</text>';
      m += '<text x="420" y="162" fill="#cbd5e1" font-size="11">• Detach by raindrop splash cup action</text>';
      m += '<text x="420" y="182" fill="#cbd5e1" font-size="11">• Germinate into new haploid thalli</text>';
      m += '<text x="420" y="202" fill="#cbd5e1" font-size="11">• Requires liquid water film for antherozoids</text>';

    } else {
      // Funaria moss gametophore + sporophyte
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Funaria (Moss): Dependent Diploid Sporophyte on Leafy Gametophyte</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Gametophyte (n): Leafy shoot · Sporophyte (2n): Foot, Seta &amp; Capsule with peristome</text>';

      // Lower Gametophyte leafy shoot
      m += '<line x1="260" y1="230" x2="260" y2="150" stroke="#10b981" stroke-width="4"/>';
      for(var l = 0; l < 6; l++){
        var ly = 210 - l * 10;
        m += '<line x1="260" y1="' + ly + '" x2="245" y2="' + (ly - 6) + '" stroke="#34d399" stroke-width="2.5"/>';
        m += '<line x1="260" y1="' + ly + '" x2="275" y2="' + (ly - 6) + '" stroke="#34d399" stroke-width="2.5"/>';
      }
      m += '<text x="210" y="185" fill="#10b981" font-size="11" font-weight="700">Gametophyte (n)</text>';

      // Upper Sporophyte (Seta and Capsule)
      m += '<path d="M 260,150 Q 250,110 270,75" fill="none" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<ellipse cx="272" cy="70" rx="10" ry="16" fill="#b45309" stroke="#f59e0b" stroke-width="2"/>';
      m += '<polygon points="267,54 272,46 277,54" fill="#fde68a"/>'; // Operculum/Calyptra
      m += '<text x="310" y="70" fill="#f59e0b" font-size="11" font-weight="700">Sporophyte (2n)</text>';
      m += '<text x="310" y="86" fill="#94a3b8" font-size="10">Capsule with peristome teeth</text>';

      // Right explanation
      m += '<text x="440" y="125" fill="#f59e0b" font-size="13" font-weight="700">Key Moss Biology:</text>';
      m += '<text x="440" y="147" fill="#cbd5e1" font-size="11">• Sporophyte is nutritionally dependent</text>';
      m += '<text x="440" y="167" fill="#cbd5e1" font-size="11">• Meiosis occurs in capsule</text>';
      m += '<text x="440" y="187" fill="#cbd5e1" font-size="11">• Spores germinate into Protonema</text>';
      m += '<text x="440" y="207" fill="#cbd5e1" font-size="11">• Sphagnum provides commercial peat</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Group", bView === "marchantia" ? "Liverwort (Marchantia)" : "Moss (Funaria)", "#10b981") +
      cell("Dominant Phase", "Gametophyte (Haploid, n)", "#38bdf8") +
      cell("Water Dependency", "Absolute (Amphibians of Plants)", "#f59e0b") +
      cell("Sporophyte Nature", "Nutritionally Dependent (2n)", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Bryophyte Hallmarks:</span> ' +
      'Gametophyte is the dominant, photosynthetic phase. Water is mandatory for flagellated antherozoids to swim to archegonia. The sporophyte is attached to and nourished by the gametophyte.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Pteridophyte Prothallus & Vascular Stele (pteridophytestele)
// -------------------------------------------------------------------------
window.SIMS.pteridophytestele = (function(){
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
      '<button class="preset-btn active" id="p-pro">Heart-Shaped Prothallus</button>' +
      '<button class="preset-btn" id="p-fro">Fern Frond &amp; Sori (Sporophyte)</button>';

    document.getElementById("p-pro").onclick = function(){ setActivePreset(this); setM("prothallus"); };
    document.getElementById("p-fro").onclick = function(){ setActivePreset(this); setM("frond"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Pteridophytes: First Terrestrial Vascular Plants (NCERT 3.3)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Examine the free-living photosynthetic prothallus and dominant vascular sporophyte with sori.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(pMode === "prothallus"){
      // Heart-shaped prothallus
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Fern Prothallus: Inconspicuous Free-Living Gametophyte (n)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Heart-shaped · Photosynthetic · Requires cool, damp, shady habitats &amp; water for fertilization</text>';

      // Heart-shaped thallus
      m += '<path d="M 230,120 C 190,70 140,110 140,150 C 140,200 230,240 230,240 C 230,240 320,200 320,150 C 320,110 270,70 230,120 Z" fill="#047857" stroke="#10b981" stroke-width="2.5"/>';
      // Archegonia near apical notch
      m += '<circle cx="225" cy="140" r="4" fill="#f59e0b"/>';
      m += '<circle cx="235" cy="140" r="4" fill="#f59e0b"/>';
      m += '<circle cx="230" cy="150" r="4" fill="#f59e0b"/>';
      m += '<text x="230" y="115" fill="#fde68a" font-size="10" font-weight="700" text-anchor="middle">Archegonia (Notch)</text>';

      // Antheridia near base with rhizoids
      m += '<circle cx="220" cy="205" r="3" fill="#38bdf8"/>';
      m += '<circle cx="230" cy="210" r="3" fill="#38bdf8"/>';
      m += '<circle cx="240" cy="205" r="3" fill="#38bdf8"/>';
      m += '<text x="230" y="225" fill="#bae6fd" font-size="10" font-weight="700" text-anchor="middle">Antheridia</text>';

      // Right explanation
      m += '<text x="380" y="125" fill="#38bdf8" font-size="13" font-weight="700">Evolutionary Consequence:</text>';
      m += '<text x="380" y="147" fill="#cbd5e1" font-size="11">• Prothallus lacks vascular tissue</text>';
      m += '<text x="380" y="167" fill="#cbd5e1" font-size="11">• Antherozoids require water to swim</text>';
      m += '<text x="380" y="187" fill="#cbd5e1" font-size="11">• Restricts living ferns to narrow, moist</text>';
      m += '<text x="380" y="207" fill="#cbd5e1" font-size="11">  geographical zones across Earth</text>';

    } else {
      // Fern frond with sori
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Fern Sporophyte (2n): Macrophylls with Sori</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Dominant plant body differentiated into true roots, stem (rhizome), and leaves with xylem and phloem</text>';

      // Frond axis
      m += '<path d="M 180,240 Q 230,160 280,75" fill="none" stroke="#10b981" stroke-width="3.5"/>';
      // Pinnae with circular brown sori
      for(var p = 0; p < 7; p++){
        var py = 210 - p * 18;
        var px = 195 + p * 12;
        m += '<line x1="' + px + '" y1="' + py + '" x2="' + (px - 35) + '" y2="' + (py - 12) + '" stroke="#047857" stroke-width="2"/>';
        m += '<line x1="' + px + '" y1="' + py + '" x2="' + (px + 35) + '" y2="' + (py - 12) + '" stroke="#047857" stroke-width="2"/>';
        // Sori dots
        m += '<circle cx="' + (px - 20) + '" cy="' + (py - 8) + '" r="3" fill="#b45309"/>';
        m += '<circle cx="' + (px + 20) + '" cy="' + (py - 8) + '" r="3" fill="#b45309"/>';
      }
      m += '<text x="280" y="65" fill="#fde68a" font-size="11" font-weight="700">Sori (Clusters of Sporangia)</text>';

      // Right explanation
      m += '<text x="410" y="125" fill="#10b981" font-size="13" font-weight="700">Vascular Anatomy:</text>';
      m += '<text x="410" y="147" fill="#cbd5e1" font-size="11">• Xylem has tracheids (conducts water)</text>';
      m += '<text x="410" y="167" fill="#cbd5e1" font-size="11">• Phloem has sieve cells (conducts sap)</text>';
      m += '<text x="410" y="187" fill="#cbd5e1" font-size="11">• True roots bind soil effectively</text>';
      m += '<text x="410" y="207" fill="#cbd5e1" font-size="11">• Sporangia undergo meiosis → Spores (n)</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Plant Group", "Pteridophyta", "#38bdf8") +
      cell("Main Body", "Diploid Sporophyte (2n)", "#10b981") +
      cell("Vascular Tissue", "Xylem & Phloem Present", "#f59e0b") +
      cell("Gametophyte", "Free-living Prothallus (n)", "#ec4899")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Vascular Cryptogams:</span> ' +
      'Pteridophytes are the first vascular land plants with dominant independent sporophytes, but their geographic range remains limited because the free-living prothallus requires water for fertilization.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Heterospory & Seed Habit Precursor (heterosporylab)
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
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Seed Habit Retention</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-homo">Homosporous Fern (Single Spore)</button>' +
      '<button class="preset-btn active" id="p-hetero">Heterosporous Selaginella (2 Spores)</button>';

    document.getElementById("p-homo").onclick = function(){ setActivePreset(this); setS("homospory"); };
    document.getElementById("p-hetero").onclick = function(){ setActivePreset(this); setS("heterospory"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Heterospory &amp; The Seed Habit Precursor Milestone (NCERT 3.3)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Compare identical homospores vs Selaginella microspores and retained megaspores.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(sporyType === "homospory"){
      // Homospory
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Homosporous Pteridophyte (Dryopteris / Equisetum)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Produces single kind of uniform spores · Germinate outside parent into bisexual prothallus</text>';

      // Uniform spores
      for(var i = 0; i < 20; i++){
        var sx = 100 + (i % 5) * 35;
        var sy = 120 + Math.floor(i / 5) * 30;
        m += '<circle cx="' + sx + '" cy="' + sy + '" r="8" fill="#38bdf8" stroke="#0284c7"/>';
      }
      m += '<text x="170" y="245" fill="#bae6fd" font-size="11" font-weight="700" text-anchor="middle">Uniform Identical Spores (n)</text>';

      // Arrow -> Bisexual Prothallus
      m += '<line x1="280" y1="165" x2="340" y2="165" stroke="#f8fafc" stroke-width="2"/>';
      m += '<polygon points="340,160 355,165 340,170" fill="#f8fafc"/>';

      m += '<text x="440" y="130" fill="#38bdf8" font-size="13" font-weight="700">Bisexual Gametophyte:</text>';
      m += '<text x="440" y="152" fill="#cbd5e1" font-size="11">• Free-living outside maternal plant</text>';
      m += '<text x="440" y="172" fill="#cbd5e1" font-size="11">• Vulnerable to environmental drought</text>';
      m += '<text x="440" y="192" fill="#cbd5e1" font-size="11">• High spore mortality rate</text>';

    } else {
      // Heterospory (Selaginella / Salvinia)
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Heterosporous Plant (Selaginella / Salvinia): Precursor to Seed Habit</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Microspores (male) + Megaspores (female) · Megaspore retained on parent sporophyte</text>';

      // Left: Microspores (small, numerous)
      m += '<rect x="80" y="110" width="100" height="90" rx="6" fill="#0c1f36" stroke="#38bdf8"/>';
      for(var ms = 0; ms < 16; ms++){
        var mx = 95 + (ms % 4) * 22;
        var my = 125 + Math.floor(ms / 4) * 18;
        m += '<circle cx="' + mx + '" cy="' + my + '" r="4" fill="#38bdf8"/>';
      }
      m += '<text x="130" y="220" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">Microspores (♂)</text>';

      // Middle: Megaspores (huge, 4 per sporangium)
      m += '<rect x="210" y="110" width="100" height="90" rx="6" fill="#260b1c" stroke="#ec4899"/>';
      m += '<circle cx="240" cy="138" r="14" fill="#ec4899"/>';
      m += '<circle cx="280" cy="138" r="14" fill="#ec4899"/>';
      m += '<circle cx="240" cy="172" r="14" fill="#ec4899"/>';
      m += '<circle cx="280" cy="172" r="14" fill="#ec4899"/>';
      m += '<text x="260" y="220" fill="#ec4899" font-size="11" font-weight="700" text-anchor="middle">Megaspores (♀)</text>';

      // Right: Evolutionary Significance Card
      m += '<rect x="340" y="105" width="310" height="135" rx="6" fill="#031f17" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="360" y="130" fill="#10b981" font-size="13" font-weight="700">Precursor to Seed Habit:</text>';
      m += '<text x="360" y="152" fill="#cbd5e1" font-size="11">• Female gametophyte retained on parent</text>';
      m += '<text x="360" y="172" fill="#cbd5e1" font-size="11">• Zygote develops into embryo inside it</text>';
      m += '<text x="360" y="192" fill="#cbd5e1" font-size="11">• Direct evolutionary ancestor of gymnosperm</text>';
      m += '<text x="360" y="212" fill="#cbd5e1" font-size="11">  and angiosperm ovules and seeds</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Pattern", sporyType.toUpperCase(), sporyType === "heterospory" ? "#10b981" : "#38bdf8") +
      cell("Genera", sporyType === "heterospory" ? "Selaginella, Salvinia" : "Dryopteris, Equisetum", "#f59e0b") +
      cell("Gametophyte Sex", sporyType === "heterospory" ? "Dioecious (Male / Female)" : "Monoecious (Bisexual)", "#ec4899") +
      cell("Evolutionary Value", sporyType === "heterospory" ? "Seed Habit Foundation" : "Primitive Basal", "#a855f7")
    );

    verdict(
      sporyType === "heterospory" ?
      '<span style="color:#10b981;font-weight:700;">Milestone of Seed Evolution:</span> In heterosporous pteridophytes (Selaginella and Salvinia), female gametophytes and developing embryos are retained on the parent sporophyte, establishing the evolutionary basis of the seed habit.' :
      '<span style="color:#38bdf8;font-weight:700;">Homosporous Ancestral Condition:</span> All spores are identical in size and germinate externally into free-living bisexual prothalli.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Gymnosperm Cones & Naked Ovules (gymnospermcone)
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
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Megasporophyll Scale</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Winged Pollen Grain</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ov">Pinus Naked Ovule &amp; Wind Pollination</button>' +
      '<button class="preset-btn" id="p-ne">Pinus Needle Xerophytic Adaptations</button>';

    document.getElementById("p-ov").onclick = function(){ setActivePreset(this); setG("ovule"); };
    document.getElementById("p-ne").onclick = function(){ setActivePreset(this); setG("needle"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Gymnosperms: Naked Seeds &amp; Conifer Adaptations (NCERT 3.4)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Ovules remain exposed on megasporophyll scales; winged pollen carried by wind directly to micropyle.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(gType === "ovule"){
      // Naked ovule on megasporophyll scale
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Gymnosperm Naked Ovule on Megasporophyll (No Ovary Wall)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Ovule sits exposed on woody scale · Micropyle open to windblown pollen · Single fertilization</text>';

      // Megasporophyll scale
      m += '<path d="M 120,200 L 280,180 L 320,130 L 290,135 L 140,185 Z" fill="#78350f" stroke="#b45309" stroke-width="2"/>';
      m += '<text x="210" y="215" fill="#fcd34d" font-size="10">Megasporophyll Scale</text>';

      // Exposed ovule sitting on top
      m += '<ellipse cx="230" cy="155" rx="28" ry="18" fill="#d97706" stroke="#f59e0b" stroke-width="2"/>';
      m += '<circle cx="240" cy="155" r="10" fill="#fef08a"/>'; // Female gametophyte/archegonia
      m += '<line x1="258" y1="155" x2="265" y2="155" stroke="#f59e0b" stroke-width="3"/>'; // Micropyle
      m += '<text x="230" y="130" fill="#fef08a" font-size="11" font-weight="700">Naked Ovule</text>';

      // Winged pollen grain blowing in
      m += '<circle cx="360" cy="145" r="7" fill="#fde047"/>';
      m += '<ellipse cx="352" cy="145" rx="5" ry="8" fill="#fef08a" opacity="0.6"/>'; // Wing 1
      m += '<ellipse cx="368" cy="145" rx="5" ry="8" fill="#fef08a" opacity="0.6"/>'; // Wing 2
      m += '<path d="M 400,135 Q 380,140 375,145" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 2"/>';
      m += '<text x="360" y="125" fill="#fde047" font-size="10" font-weight="700" text-anchor="middle">Winged Pollen</text>';

      // Right callouts
      m += '<text x="440" y="125" fill="#f59e0b" font-size="13" font-weight="700">Gymnosperm Hallmarks:</text>';
      m += '<text x="440" y="147" fill="#cbd5e1" font-size="11">• Seeds are naked (no fruit / pericarp)</text>';
      m += '<text x="440" y="167" fill="#cbd5e1" font-size="11">• Anemophilous (wind) pollination</text>';
      m += '<text x="440" y="187" fill="#cbd5e1" font-size="11">• Pinus roots possess mycorrhiza</text>';
      m += '<text x="440" y="207" fill="#cbd5e1" font-size="11">• Cycas has coralloid roots with cyanobacteria</text>';

    } else {
      // Pinus needle xerophytic cross-section
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Pinus Needle (Conifer Leaf) Xerophytic Adaptations</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Needle-like shape (low surface area) · Heavy waxy cuticle · Sunken stomata in pits · Resin canals</text>';

      // Semicircular needle cross section
      m += '<path d="M 140,190 A 90,90 0 0,1 320,190 Z" fill="#064e3b" stroke="#10b981" stroke-width="3"/>';
      // Cuticle outline
      m += '<path d="M 136,192 A 94,94 0 0,1 324,192" fill="none" stroke="#fef08a" stroke-width="4"/>';
      m += '<text x="230" y="85" fill="#fef08a" font-size="10" font-weight="700" text-anchor="middle">Thick Waxy Cuticle</text>';

      // Sunken stomata pits
      m += '<circle cx="180" cy="140" r="4" fill="#022c22" stroke="#34d399"/>';
      m += '<circle cx="280" cy="140" r="4" fill="#022c22" stroke="#34d399"/>';
      m += '<text x="140" y="130" fill="#34d399" font-size="9">Sunken Stoma</text>';

      // Resin canal
      m += '<circle cx="230" cy="165" r="8" fill="#d97706" stroke="#fde047"/>';
      m += '<text x="230" y="168" fill="#ffffff" font-size="8" text-anchor="middle">Resin</text>';

      // Right explanation
      m += '<text x="420" y="125" fill="#10b981" font-size="13" font-weight="700">Alpine Survival Suite:</text>';
      m += '<text x="420" y="147" fill="#cbd5e1" font-size="11">• Needle form sloughs heavy snow</text>';
      m += '<text x="420" y="167" fill="#cbd5e1" font-size="11">• Drastically reduces transpiration</text>';
      m += '<text x="420" y="187" fill="#cbd5e1" font-size="11">• Sunken stomata trap humid micro-air</text>';
      m += '<text x="420" y="207" fill="#cbd5e1" font-size="11">• Resin deters herbivores &amp; seals wounds</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Plant Group", "Gymnospermae", "#f59e0b") +
      cell("Seed Status", "NAKED (Unenclosed)", "#ef4444") +
      cell("Pollination", "Anemophily (Wind)", "#38bdf8") +
      cell("Root Symbionts", "Mycorrhiza / Coralloid", "#10b981")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Gymnosperm Hallmarks:</span> ' +
      'Ovules are borne exposed on megasporophyll scales without an ovary wall, developing into naked seeds. Conifers endure harsh alpine winters via needle-like foliage, thick cuticles, and sunken stomata.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Double Fertilization in Angiosperms (angiospermdoublefert)
// -------------------------------------------------------------------------
window.SIMS.angiospermdoublefert = (function(){
  var stage = "embryosac"; // "embryosac", "fertilized"

  function setStage(st){
    stage = st;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Syngamy → Zygote (2n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Triple Fusion → PEN (3n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Antipodals (n)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-es">Mature 7-Celled Embryo Sac</button>' +
      '<button class="preset-btn" id="p-df">Double Fertilization Event</button>';

    document.getElementById("p-es").onclick = function(){ setActivePreset(this); setStage("embryosac"); };
    document.getElementById("p-df").onclick = function(){ setActivePreset(this); setStage("fertilized"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Angiosperms: The Hallmark of Double Fertilization (NCERT 3.5)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Dissect the 7-celled 8-nucleate female gametophyte, Syngamy (zygote 2n) and Triple Fusion (PEN 3n).</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var isFert = (stage === "fertilized");

    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="50" y="45" fill="#f8fafc" font-size="14" font-weight="700">Angiosperm Embryo Sac: ' + (isFert ? 'Double Fertilization Accomplished' : 'Mature 7-Celled 8-Nucleate Architecture') + '</text>';

    // Embryo sac oval container
    m += '<ellipse cx="230" cy="160" rx="80" ry="105" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';

    // 3 Antipodal cells (Chalazal end - top)
    m += '<circle cx="205" cy="90" r="12" fill="#831843" stroke="#ec4899"/>';
    m += '<circle cx="230" cy="80" r="12" fill="#831843" stroke="#ec4899"/>';
    m += '<circle cx="255" cy="90" r="12" fill="#831843" stroke="#ec4899"/>';
    m += '<text x="230" y="65" fill="#ec4899" font-size="10" font-weight="700" text-anchor="middle">3 Antipodals (Chalazal)</text>';

    // Large central cell with 2 polar nuclei OR 3n PEN
    if(isFert){
      m += '<circle cx="230" cy="155" r="24" fill="#b45309" stroke="#f59e0b" stroke-width="3"/>';
      m += '<text x="230" y="152" fill="#fde68a" font-size="10" font-weight="700" text-anchor="middle">PEN (3n)</text>';
      m += '<text x="230" y="165" fill="#fde68a" font-size="8" text-anchor="middle">[Triple Fusion]</text>';
    } else {
      m += '<circle cx="220" cy="155" r="9" fill="#0284c7" stroke="#38bdf8"/>';
      m += '<circle cx="240" cy="155" r="9" fill="#0284c7" stroke="#38bdf8"/>';
      m += '<text x="230" y="138" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">2 Polar Nuclei (Central Cell)</text>';
    }

    // Egg apparatus (Micropylar end - bottom): 1 Egg + 2 Synergids OR 2n Zygote
    if(isFert){
      m += '<circle cx="230" cy="225" r="16" fill="#047857" stroke="#10b981" stroke-width="3"/>';
      m += '<text x="230" y="228" fill="#a7f3d0" font-size="10" font-weight="700" text-anchor="middle">Zygote (2n)</text>';
      m += '<text x="230" y="255" fill="#10b981" font-size="10" font-weight="700" text-anchor="middle">[Syngamy Product]</text>';
    } else {
      m += '<circle cx="230" cy="220" r="13" fill="#047857" stroke="#10b981"/>'; // Egg
      m += '<circle cx="205" cy="232" r="11" fill="#065f46" stroke="#34d399"/>'; // Synergid 1
      m += '<circle cx="255" cy="232" r="11" fill="#065f46" stroke="#34d399"/>'; // Synergid 2
      m += '<text x="230" y="255" fill="#10b981" font-size="10" font-weight="700" text-anchor="middle">Egg Apparatus (1 Egg + 2 Synergids)</text>';
    }

    // Right explanation panel
    m += '<rect x="360" y="60" width="320" height="205" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="380" y="88" fill="#38bdf8" font-size="14" font-weight="700">The Two Fusions in Double Fertilization:</text>';

    m += '<text x="380" y="118" fill="#10b981" font-size="12" font-weight="700">1. Syngamy (Generative Fertilization):</text>';
    m += '<text x="380" y="136" fill="#cbd5e1" font-size="11">Male gamete (n) + Egg (n) → Zygote (2n)</text>';
    m += '<text x="380" y="152" fill="#94a3b8" font-size="10">Develops into the future embryonic plant</text>';

    m += '<text x="380" y="180" fill="#f59e0b" font-size="12" font-weight="700">2. Triple Fusion (Vegetative):</text>';
    m += '<text x="380" y="198" fill="#cbd5e1" font-size="11">Male gamete (n) + 2 Polar nuclei (n+n) → PEN (3n)</text>';
    m += '<text x="380" y="214" fill="#94a3b8" font-size="10">Develops into triploid nutritive endosperm</text>';

    svg.innerHTML = m;

    readout(
      cell("Cellular State", isFert ? "Double Fertilized" : "7-Celled 8-Nucleate", "#38bdf8") +
      cell("Zygote Ploidy", isFert ? "Diploid (2n)" : "Egg (n)", "#10b981") +
      cell("Endosperm Ploidy", isFert ? "Triploid (3n PEN)" : "2 Polar Nuclei", "#f59e0b") +
      cell("Uniqueness", "Strictly Angiosperms Only", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Double Fertilization:</span> ' +
      'An event strictly unique to angiosperms. Two male gametes execute two fusions simultaneously: Syngamy produces the diploid zygote (2n), while Triple Fusion produces the triploid Primary Endosperm Nucleus (3n PEN).'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Life Cycle Patterns (lifecyclesim)
// -------------------------------------------------------------------------
window.SIMS.lifecyclesim = (function(){
  var cPattern = "haplodiplontic"; // "haplontic", "diplontic", "haplodiplontic"

  function setP(p){
    cPattern = p;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Haploid Generation (n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Diploid Generation (2n)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-hap">Haplontic (Volvox / Spirogyra)</button>' +
      '<button class="preset-btn" id="p-dip">Diplontic (Fucus / Seed Plants)</button>' +
      '<button class="preset-btn active" id="p-hd">Haplodiplontic (Bryo / Pterido)</button>';

    document.getElementById("p-hap").onclick = function(){ setActivePreset(this); setP("haplontic"); };
    document.getElementById("p-dip").onclick = function(){ setActivePreset(this); setP("diplontic"); };
    document.getElementById("p-hd").onclick = function(){ setActivePreset(this); setP("haplodiplontic"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Plant Life Cycles &amp; Alternation of Generations (NCERT 3.6)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Dynamic proportion of haploid gametophyte (n, green) vs diploid sporophyte (2n, blue) generations.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    var cx = 200, cy = 150, r = 85;

    if(cPattern === "haplontic"){
      // 90% Green (n), tiny 10% Blue (2n zygote)
      m += '<text x="50" y="45" fill="#10b981" font-size="14" font-weight="700">Haplontic Life Cycle (Volvox, Spirogyra, Chlamydomonas)</text>';
      // Almost complete circle green
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#10b981" stroke-width="16"/>';
      // Tiny blue slice for 1-celled zygote
      m += '<circle cx="' + (cx + r) + '" cy="' + cy + '" r="12" fill="#38bdf8"/>';
      m += '<text x="' + (cx + r + 15) + '" y="' + (cy + 4) + '" fill="#38bdf8" font-size="10" font-weight="700">Zygote (2n)</text>';
      m += '<text x="' + cx + '" y="' + cy + '" fill="#10b981" font-size="14" font-weight="700" text-anchor="middle">Gametophyte (n)</text>';

      // Right explanation
      m += '<rect x="360" y="60" width="320" height="205" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="380" y="88" fill="#10b981" font-size="14" font-weight="700">Haplontic Characteristics:</text>';
      m += '<text x="380" y="115" fill="#cbd5e1" font-size="11">• Sporophyte is ONLY the one-celled zygote</text>';
      m += '<text x="380" y="135" fill="#cbd5e1" font-size="11">• No free-living sporophytes exist</text>';
      m += '<text x="380" y="155" fill="#cbd5e1" font-size="11">• Zygote undergoes immediate MEIOSIS</text>';
      m += '<text x="380" y="175" fill="#cbd5e1" font-size="11">• Produces haploid spores → Gametophyte</text>';
      m += '<text x="380" y="195" fill="#cbd5e1" font-size="11">• Typical of most green algae</text>';

    } else if(cPattern === "diplontic"){
      // 90% Blue (2n), tiny 10% Green (gametes)
      m += '<text x="50" y="45" fill="#38bdf8" font-size="14" font-weight="700">Diplontic Life Cycle (Fucus, Gymnosperms, Angiosperms)</text>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#38bdf8" stroke-width="16"/>';
      m += '<circle cx="' + (cx + r) + '" cy="' + cy + '" r="12" fill="#10b981"/>';
      m += '<text x="' + (cx + r + 15) + '" y="' + (cy + 4) + '" fill="#10b981" font-size="10" font-weight="700">Gametes (n)</text>';
      m += '<text x="' + cx + '" y="' + cy + '" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">Sporophyte (2n)</text>';

      // Right explanation
      m += '<rect x="360" y="60" width="320" height="205" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="380" y="88" fill="#38bdf8" font-size="14" font-weight="700">Diplontic Characteristics:</text>';
      m += '<text x="380" y="115" fill="#cbd5e1" font-size="11">• Sporophyte (2n) is dominant &amp; photosynthetic</text>';
      m += '<text x="380" y="135" fill="#cbd5e1" font-size="11">• Gametophyte reduced to single/few cells</text>';
      m += '<text x="380" y="155" fill="#cbd5e1" font-size="11">• Meiosis occurs during gamete formation</text>';
      m += '<text x="380" y="175" fill="#cbd5e1" font-size="11">• Universal in seed plants (Gymno &amp; Angio)</text>';
      m += '<text x="380" y="195" fill="#cbd5e1" font-size="11">• Prominent algal exception: Fucus</text>';

    } else {
      // 50% Green, 50% Blue
      m += '<text x="50" y="45" fill="#f59e0b" font-size="14" font-weight="700">Haplodiplontic Life Cycle (Bryophytes, Pteridophytes, Kelps)</text>';
      m += '<path d="M ' + (cx - r) + ',' + cy + ' A ' + r + ',' + r + ' 0 0,1 ' + (cx + r) + ',' + cy + '" fill="none" stroke="#10b981" stroke-width="16"/>';
      m += '<path d="M ' + (cx + r) + ',' + cy + ' A ' + r + ',' + r + ' 0 0,1 ' + (cx - r) + ',' + cy + '" fill="none" stroke="#38bdf8" stroke-width="16"/>';
      m += '<text x="' + cx + '" y="' + (cy - 20) + '" fill="#10b981" font-size="12" font-weight="700" text-anchor="middle">Gametophyte (n)</text>';
      m += '<text x="' + cx + '" y="' + (cy + 30) + '" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">Sporophyte (2n)</text>';

      // Right explanation
      m += '<rect x="360" y="60" width="320" height="205" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="380" y="88" fill="#f59e0b" font-size="14" font-weight="700">Haplodiplontic Characteristics:</text>';
      m += '<text x="380" y="115" fill="#cbd5e1" font-size="11">• Both phases are multicellular &amp; prominent</text>';
      m += '<text x="380" y="135" fill="#cbd5e1" font-size="11">• Bryophytes: Gametophyte dominant</text>';
      m += '<text x="380" y="155" fill="#cbd5e1" font-size="11">• Pteridophytes: Vascular sporophyte dominant</text>';
      m += '<text x="380" y="175" fill="#cbd5e1" font-size="11">• Spores formed by sporic meiosis</text>';
      m += '<text x="380" y="195" fill="#cbd5e1" font-size="11">• Algae: Ectocarpus, Polysiphonia, Kelps</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Pattern", cPattern.toUpperCase(), "#f59e0b") +
      cell("Meiosis Timing", cPattern === "haplontic" ? "Zygotic (2n → n)" : (cPattern === "diplontic" ? "Gametic (2n → n)" : "Sporic in Sporangia"), "#38bdf8") +
      cell("Gametophyte", cPattern === "diplontic" ? "Microscopic (Pollen/Sac)" : "Multicellular (n)", "#10b981") +
      cell("Algal Example", cPattern === "haplontic" ? "Spirogyra" : (cPattern === "diplontic" ? "Fucus" : "Ectocarpus"), "#ec4899")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Life Cycle Mastery:</span> ' +
      (cPattern === "haplontic" ? "Haplontic life cycles feature a dominant multicellular gametophyte; only the zygote is diploid." :
       (cPattern === "diplontic" ? "Diplontic life cycles feature a dominant multicellular diploid sporophyte; gametes are the only haploid stage." :
        "Haplodiplontic life cycles exhibit alternation between multicellular haploid and diploid generations."))
    );
  }

  return { mount: mount, draw: draw };
})();
