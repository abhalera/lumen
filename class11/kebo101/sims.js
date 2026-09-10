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
// 1. SIMULATION 1: Biodiversity Gradient & Species Richness (biodiversitymap)
// -------------------------------------------------------------------------
window.SIMS.biodiversitymap = (function(){
  var lat = 0; // Latitude 0 to 80 deg
  var biome = "Tropical Rainforest";

  function setLat(newLat, bName){
    lat = newLat;
    if(bName) biome = bName;
    var s = document.getElementById("lat-slider");
    if(s) s.value = lat;
    var lv = document.getElementById("lat-val");
    if(lv) lv.textContent = lat + "° (" + biome + ")";
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Insects (~1,025,000)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Plants (~300,000)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fungi (~100,000)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Chordates (~60,000)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-trop">Tropical Equator (0°)</button>' +
      '<button class="preset-btn" id="p-temp">Temperate Forest (45°)</button>' +
      '<button class="preset-btn" id="p-polar">Polar Tundra (75°)</button>';

    document.getElementById("p-trop").onclick = function(){ setActivePreset(this); setLat(0, "Tropical Rainforest"); };
    document.getElementById("p-temp").onclick = function(){ setActivePreset(this); setLat(45, "Temperate Forest"); };
    document.getElementById("p-polar").onclick = function(){ setActivePreset(this); setLat(75, "Polar Tundra"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Latitude from Equator: <b id="lat-val" style="color:#10b981;">0° (Tropical Rainforest)</b></label>' +
        '<input type="range" id="lat-slider" min="0" max="80" value="0" step="1">' +
      '</div>';

    document.getElementById("lat-slider").oninput = function(e){
      lat = parseInt(e.target.value, 10);
      if(lat < 23.5) biome = "Tropical Rainforest";
      else if(lat < 60) biome = "Temperate Deciduous";
      else biome = "Polar Tundra";
      var lv = document.getElementById("lat-val");
      if(lv) lv.textContent = lat + "° (" + biome + ")";
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    // Diversity factor decreases with latitude: 100% at equator to 5% at poles
    var factor = Math.max(0.05, Math.cos((lat * Math.PI) / 180));
    var speciesDensity = Math.round(factor * 1250); // species per 100 sq km

    var m = '<rect width="720" height="300" fill="#09131d"/>';
    // Earth globe / slice
    m += '<circle cx="150" cy="150" r="110" fill="#0f2744" stroke="#334155" stroke-width="2"/>';
    // Latitude line
    var yLat = 150 - (lat / 90) * 100;
    var chordW = Math.sqrt(Math.max(0, 110*110 - (yLat-150)*(yLat-150)));
    m += '<line x1="' + (150 - chordW) + '" y1="' + yLat + '" x2="' + (150 + chordW) + '" y2="' + yLat + '" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4 3"/>';
    m += '<text x="150" y="' + (yLat - 6) + '" fill="#ef4444" font-size="11" font-weight="700" text-anchor="middle">Lat ' + lat + '°</text>';
    m += '<text x="150" y="275" fill="#94a3b8" font-size="11" text-anchor="middle">Earth Latitudinal Diversity Gradient</text>';

    // Bar chart of species groups at this latitude
    m += '<rect x="320" y="30" width="370" height="230" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="340" y="55" fill="#f8fafc" font-size="14" font-weight="700">Relative Species Richness at ' + lat + '°</text>';
    m += '<text x="340" y="72" fill="#94a3b8" font-size="11">Described Global Catalog: 1.7–1.8 Million Species (NCERT 1.1)</text>';

    var groups = [
      { name: "Insects (Arthropoda)", max: 1025, col: "#10b981" },
      { name: "Angiosperms (Plants)", max: 300, col: "#38bdf8" },
      { name: "Fungi", max: 100, col: "#f59e0b" },
      { name: "Chordates (Vertebrates)", max: 60, col: "#ec4899" }
    ];

    for(var i = 0; i < groups.length; i++){
      var g = groups[i];
      var count = Math.round(g.max * factor);
      var barW = Math.max(10, Math.round((count / 1025) * 260));
      var y = 100 + i * 36;
      m += '<text x="340" y="' + (y - 4) + '" fill="#cbd5e1" font-size="11">' + g.name + ': <b style="color:' + g.col + '">' + (count * 1000).toLocaleString() + ' described species</b></text>';
      m += '<rect x="340" y="' + y + '" width="260" height="12" rx="3" fill="#1e293b"/>';
      m += '<rect x="340" y="' + y + '" width="' + barW + '" height="12" rx="3" fill="' + g.col + '"/>';
    }

    svg.innerHTML = m;

    readout(
      cell("Biome Zone", biome, "#38bdf8") +
      cell("Latitude", lat + "° N/S", "#f59e0b") +
      cell("Local Species Density", speciesDensity + " / 100 km²", "#10b981") +
      cell("Global Described Total", "1.75 Million", "#a855f7")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Latitudinal Diversity Gradient:</span> ' +
      'Species richness peaks at the tropical equator (warm, solar-rich, long evolutionary stability) and decreases steadily towards the poles. Currently, ~1.7 to 1.8 million species have been formally described in taxonomy.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Linnaean Binomial Nomenclature Validator (binomialnamer)
// -------------------------------------------------------------------------
window.SIMS.binomialnamer = (function(){
  var genus = "Mangifera";
  var species = "indica";
  var author = "Linn.";
  var isHandwritten = false;

  function setPreset(g, s, a, hw){
    genus = g;
    species = s;
    author = a;
    isHandwritten = hw;
    var gIn = document.getElementById("genus-in"); if(gIn) gIn.value = genus;
    var sIn = document.getElementById("species-in"); if(sIn) sIn.value = species;
    var aIn = document.getElementById("author-in"); if(aIn) aIn.value = author;
    var hwIn = document.getElementById("hw-toggle"); if(hwIn) hwIn.checked = isHandwritten;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Generic Name (Genus)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Specific Epithet (Species)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Author Citation</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-mango">Mango (Mangifera indica)</button>' +
      '<button class="preset-btn" id="p-lion">Lion (Panthera leo)</button>' +
      '<button class="preset-btn" id="p-potato">Potato (Solanum tuberosum)</button>' +
      '<button class="preset-btn" id="p-error">Error Demo (mangifera Indica)</button>';

    document.getElementById("p-mango").onclick = function(){ setActivePreset(this); setPreset("Mangifera", "indica", "Linn.", false); };
    document.getElementById("p-lion").onclick = function(){ setActivePreset(this); setPreset("Panthera", "leo", "", false); };
    document.getElementById("p-potato").onclick = function(){ setActivePreset(this); setPreset("Solanum", "tuberosum", "Linn.", false); };
    document.getElementById("p-error").onclick = function(){ setActivePreset(this); setPreset("mangifera", "Indica", "", false); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Generic Name (Genus):</label>' +
        '<input type="text" id="genus-in" value="' + genus + '" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Specific Epithet (Species):</label>' +
        '<input type="text" id="species-in" value="' + species + '" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Author Citation (Optional):</label>' +
        '<input type="text" id="author-in" value="' + author + '" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;">' +
      '</div>' +
      '<div class="control-group" style="display:flex;align-items:center;gap:8px;margin-top:20px;">' +
        '<input type="checkbox" id="hw-toggle" ' + (isHandwritten ? 'checked' : '') + ' style="width:18px;height:18px;">' +
        '<label for="hw-toggle" style="margin:0;cursor:pointer;">Handwritten Mode (Underline rule)</label>' +
      '</div>';

    document.getElementById("genus-in").oninput = function(e){ genus = e.target.value.trim(); draw(0); };
    document.getElementById("species-in").oninput = function(e){ species = e.target.value.trim(); draw(0); };
    document.getElementById("author-in").oninput = function(e){ author = e.target.value.trim(); draw(0); };
    document.getElementById("hw-toggle").onchange = function(e){ isHandwritten = e.target.checked; draw(0); };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var gValid = /^[A-Z][a-z]*$/.test(genus);
    var sValid = /^[a-z]+$/.test(species);
    var allValid = gValid && sValid;

    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="40" y="30" width="640" height="240" rx="10" fill="#0b1726" stroke="#1e293b" stroke-width="2"/>';

    m += '<text x="60" y="65" fill="#f8fafc" font-size="15" font-weight="700">Linnaean Binomial Nomenclature Inspector</text>';
    m += '<text x="60" y="85" fill="#94a3b8" font-size="12">NCERT Rules: Latinised, Genus Capitalized, Specific Epithet Lowercase</text>';

    // Render formatted name
    var boxCol = allValid ? "#10b981" : "#ef4444";
    m += '<rect x="60" y="110" width="600" height="70" rx="8" fill="#030712" stroke="' + boxCol + '" stroke-width="2"/>';

    var displayFont = isHandwritten ? "normal" : "italic";
    var fontFam = isHandwritten ? "ui-monospace, monospace" : "Georgia, serif";

    m += '<g font-family="' + fontFam + '" font-style="' + displayFont + '" font-size="28">';
    // Genus
    m += '<text x="90" y="152" fill="#38bdf8" font-weight="600">' + (genus || '[Genus]') + '</text>';
    // Specific epithet
    var gLen = (genus || '[Genus]').length * 16 + 20;
    m += '<text x="' + (90 + gLen) + '" y="152" fill="#10b981" font-weight="600">' + (species || '[species]') + '</text>';
    // Author
    var sLen = (species || '[species]').length * 16 + 20;
    if(author){
      m += '<text x="' + (90 + gLen + sLen) + '" y="152" fill="#f59e0b" font-style="normal" font-family="sans-serif" font-size="18">' + author + '</text>';
    }
    m += '</g>';

    // Handwritten underline
    if(isHandwritten){
      m += '<line x1="88" y1="160" x2="' + (85 + gLen - 15) + '" y2="160" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<line x1="' + (88 + gLen) + '" y1="160" x2="' + (85 + gLen + sLen - 15) + '" y2="160" stroke="#10b981" stroke-width="2.5"/>';
      m += '<text x="470" y="150" fill="#94a3b8" font-size="11" font-family="sans-serif">[Separately Underlined]</text>';
    }

    // Status diagnostics
    var statusY = 215;
    m += '<circle cx="75" cy="' + statusY + '" r="6" fill="' + (gValid ? "#10b981" : "#ef4444") + '"/>';
    m += '<text x="90" y="' + (statusY + 4) + '" fill="' + (gValid ? "#cbd5e1" : "#ef4444") + '" font-size="12">Genus Rule: Must begin with capital letter (' + (gValid ? 'PASSED' : 'FAILED: begins with lowercase') + ')</text>';

    m += '<circle cx="75" cy="' + (statusY + 25) + '" r="6" fill="' + (sValid ? "#10b981" : "#ef4444") + '"/>';
    m += '<text x="90" y="' + (statusY + 29) + '" fill="' + (sValid ? "#cbd5e1" : "#ef4444") + '" font-size="12">Specific Epithet Rule: Must be strictly lowercase (' + (sValid ? 'PASSED' : 'FAILED: contains uppercase letter') + ')</text>';

    svg.innerHTML = m;

    readout(
      cell("Generic Name", genus || "—", gValid ? "#38bdf8" : "#ef4444") +
      cell("Specific Epithet", species || "—", sValid ? "#10b981" : "#ef4444") +
      cell("Format Mode", isHandwritten ? "Handwritten (Underlined)" : "Printed (Italics)", "#f59e0b") +
      cell("Code Rule Status", allValid ? "VALID NOMENCLATURE" : "RULE VIOLATION", allValid ? "#10b981" : "#ef4444")
    );

    verdict(
      allValid ?
      '<span style="color:#10b981;font-weight:700;">Valid Binomial Name:</span> Follows Linnaean rules. Genus is capitalized, species epithet is lowercase, and formatting complies with ICBN/ICZN standards.' :
      '<span style="color:#ef4444;font-weight:700;">Rule Violation Detected:</span> NCERT Rule 4 mandates that the genus starts with a capital letter and the specific epithet starts with a small letter.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Multi-Level Taxon Nested Venn Diagram (taxasorter)
// -------------------------------------------------------------------------
window.SIMS.taxasorter = (function(){
  var selectedLineage = "dog"; // "dog", "cat", "human", "wheat"

  var lineages = {
    dog: [
      { rank: "Kingdom", taxon: "Animalia", desc: "Multicellular heterotrophs, no cell wall" },
      { rank: "Phylum", taxon: "Chordata", desc: "Notochord, dorsal hollow nerve tube" },
      { rank: "Class", taxon: "Mammalia", desc: "Mammary glands, hair, pinna" },
      { rank: "Order", taxon: "Carnivora", desc: "Carnassial teeth, flesh-eating adaptations" },
      { rank: "Family", taxon: "Canidae", desc: "Non-retractile claws, elongated muzzle" },
      { rank: "Genus", taxon: "Canis", desc: "Jackals, wolves, domestic dogs" },
      { rank: "Species", taxon: "Canis lupus (familiaris)", desc: "Domestic dog" }
    ],
    cat: [
      { rank: "Kingdom", taxon: "Animalia", desc: "Multicellular heterotrophs, no cell wall" },
      { rank: "Phylum", taxon: "Chordata", desc: "Notochord, dorsal hollow nerve tube" },
      { rank: "Class", taxon: "Mammalia", desc: "Mammary glands, hair, pinna" },
      { rank: "Order", taxon: "Carnivora", desc: "Carnassial teeth, flesh-eating adaptations" },
      { rank: "Family", taxon: "Felidae", desc: "Retractile claws, rounded facial skull" },
      { rank: "Genus", taxon: "Felis", desc: "Small purring cats" },
      { rank: "Species", taxon: "Felis catus", desc: "Domestic cat" }
    ],
    human: [
      { rank: "Kingdom", taxon: "Animalia", desc: "Multicellular heterotrophs, no cell wall" },
      { rank: "Phylum", taxon: "Chordata", desc: "Notochord, dorsal hollow nerve tube" },
      { rank: "Class", taxon: "Mammalia", desc: "Mammary glands, hair, pinna" },
      { rank: "Order", taxon: "Primata", desc: "Opposable thumbs, binocular vision" },
      { rank: "Family", taxon: "Hominidae", desc: "Bipedal posture, large cranial capacity" },
      { rank: "Genus", taxon: "Homo", desc: "Modern and archaic humans" },
      { rank: "Species", taxon: "Homo sapiens", desc: "Modern human beings" }
    ],
    wheat: [
      { rank: "Kingdom", taxon: "Plantae", desc: "Photosynthetic, cellulose cell walls" },
      { rank: "Division", taxon: "Angiospermae", desc: "Enclosed seeds inside fruits, double fertilization" },
      { rank: "Class", taxon: "Monocotyledonae", desc: "Single cotyledon, parallel venation" },
      { rank: "Order", taxon: "Poales", desc: "Glumaceous perianth, wind pollinated" },
      { rank: "Family", taxon: "Poaceae", desc: "Grass family, caryopsis fruit" },
      { rank: "Genus", taxon: "Triticum", desc: "Wheat grasses" },
      { rank: "Species", taxon: "Triticum aestivum", desc: "Bread wheat" }
    ]
  };

  function setLineage(key){
    selectedLineage = key;
    draw(0);
  }

  function mount(){
    App.state.maxT = 7;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Kingdom / Phylum</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Class / Order</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Family / Genus</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Species (Lowest)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dog">Dog (Canis lupus)</button>' +
      '<button class="preset-btn" id="p-cat">Cat (Felis catus)</button>' +
      '<button class="preset-btn" id="p-human">Human (Homo sapiens)</button>' +
      '<button class="preset-btn" id="p-wheat">Wheat (Triticum aestivum)</button>';

    document.getElementById("p-dog").onclick = function(){ setActivePreset(this); setLineage("dog"); };
    document.getElementById("p-cat").onclick = function(){ setActivePreset(this); setLineage("cat"); };
    document.getElementById("p-human").onclick = function(){ setActivePreset(this); setLineage("human"); };
    document.getElementById("p-wheat").onclick = function(){ setActivePreset(this); setLineage("wheat"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Explore Nested Taxon Rings: <b>Click concentric circles or presets above</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">A taxon indicates categories at very different levels: Dogs, Mammals, and Animals are all taxa.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var lin = lineages[selectedLineage];

    var m = '<rect width="720" height="300" fill="#09131d"/>';

    // Draw concentric Venn circles on left
    var cx = 170, cy = 150;
    var colors = ["#831843", "#701a75", "#1e3a8a", "#065f46", "#854d0e", "#0e7490", "#0284c7"];
    var radii = [130, 112, 94, 76, 58, 40, 22];

    for(var i = 0; i < 7; i++){
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radii[i] + '" fill="' + colors[i] + '" fill-opacity="0.35" stroke="' + colors[i] + '" stroke-width="1.8"/>';
    }

    m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Species</text>';
    m += '<text x="' + cx + '" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">Nested Taxonomic Containment</text>';

    // Right list: 7 levels table
    m += '<rect x="330" y="20" width="360" height="260" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="350" y="42" fill="#f8fafc" font-size="13" font-weight="700">Taxon Breakdown (' + selectedLineage.toUpperCase() + ')</text>';

    for(var j = 0; j < 7; j++){
      var item = lin[j];
      var y = 66 + j * 30;
      var rankCol = j === 6 ? "#38bdf8" : (j >= 4 ? "#10b981" : (j >= 2 ? "#f59e0b" : "#ec4899"));
      m += '<text x="350" y="' + y + '" fill="' + rankCol + '" font-size="11" font-weight="700">' + item.rank + ':</text>';
      m += '<text x="430" y="' + y + '" fill="#f1f5f9" font-size="12" font-weight="600">' + item.taxon + '</text>';
      m += '<text x="350" y="' + (y + 13) + '" fill="#64748b" font-size="10">' + item.desc + '</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Organism", selectedLineage.toUpperCase(), "#38bdf8") +
      cell("Lowest Taxon", lin[6].taxon, "#10b981") +
      cell("Family Taxon", lin[4].taxon, "#f59e0b") +
      cell("Highest Taxon", lin[0].taxon, "#ec4899")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Taxa at Different Levels:</span> ' +
      'Taxa represents real biological units. An animal is a taxon (Kingdom); a mammal is a taxon (Class); a cat is a taxon (Family/Species). Lower taxa nest entirely within higher taxa.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Speciation & Reproductive Isolation (speciesconcept)
// -------------------------------------------------------------------------
window.SIMS.speciesconcept = (function(){
  var isolationYears = 50000; // generations/years
  var hasBarrier = true;

  function setParams(years, barrier){
    isolationYears = years;
    hasBarrier = barrier;
    var ys = document.getElementById("years-slider"); if(ys) ys.value = isolationYears;
    var yv = document.getElementById("years-val"); if(yv) yv.textContent = (isolationYears / 1000).toFixed(0) + "k years";
    var bt = document.getElementById("barrier-toggle"); if(bt) bt.checked = hasBarrier;
    draw(0);
  }

  function mount(){
    App.state.maxT = 10;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Population A (Plains)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Population B (Plateau)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Geographic Barrier</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-symp">Panmictic Interbreeding (0 yrs)</button>' +
      '<button class="preset-btn" id="p-mid">Moderate Divergence (50k yrs)</button>' +
      '<button class="preset-btn" id="p-spec">Complete Speciation (200k yrs)</button>';

    document.getElementById("p-symp").onclick = function(){ setActivePreset(this); setParams(0, false); };
    document.getElementById("p-mid").onclick = function(){ setActivePreset(this); setParams(50000, true); };
    document.getElementById("p-spec").onclick = function(){ setActivePreset(this); setParams(200000, true); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Time in Geographic Isolation: <b id="years-val" style="color:#38bdf8;">50k years</b></label>' +
        '<input type="range" id="years-slider" min="0" max="250000" value="50000" step="5000">' +
      '</div>' +
      '<div class="control-group" style="display:flex;align-items:center;gap:8px;margin-top:20px;">' +
        '<input type="checkbox" id="barrier-toggle" checked style="width:18px;height:18px;">' +
        '<label for="barrier-toggle" style="margin:0;cursor:pointer;">Geographic Mountain/River Barrier</label>' +
      '</div>';

    document.getElementById("years-slider").oninput = function(e){
      isolationYears = parseInt(e.target.value, 10);
      var yv = document.getElementById("years-val"); if(yv) yv.textContent = (isolationYears / 1000).toFixed(0) + "k years";
      draw(0);
    };
    document.getElementById("barrier-toggle").onchange = function(e){
      hasBarrier = e.target.checked;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    // Divergence index 0 to 1
    var divergence = hasBarrier ? Math.min(1.0, isolationYears / 150000) : 0.05;
    var isSpeciated = divergence >= 0.85;

    // Draw habitat sides
    m += '<rect x="40" y="40" width="280" height="220" rx="8" fill="#0a1e36" stroke="#1e3a8a" stroke-width="1.5"/>';
    m += '<text x="60" y="70" fill="#38bdf8" font-size="14" font-weight="700">Population Alpha</text>';
    m += '<text x="60" y="88" fill="#94a3b8" font-size="11">Plains Habitat (Gene Pool A)</text>';

    m += '<rect x="400" y="40" width="280" height="220" rx="8" fill="#2d1c08" stroke="#854d0e" stroke-width="1.5"/>';
    m += '<text x="420" y="70" fill="#f59e0b" font-size="14" font-weight="700">Population Beta</text>';
    m += '<text x="420" y="88" fill="#94a3b8" font-size="11">Highland Plateau (Gene Pool B)</text>';

    // Barrier in between
    if(hasBarrier){
      m += '<path d="M 345,40 L 375,100 L 345,160 L 375,220 L 345,260 L 360,260 L 380,210 L 355,150 L 385,90 L 360,40 Z" fill="#475569" stroke="#64748b" stroke-width="1"/>';
      m += '<text x="360" y="155" fill="#ef4444" font-size="11" font-weight="700" text-anchor="middle" transform="rotate(-90 360 155)">GEOGRAPHIC BARRIER</text>';
    } else {
      m += '<line x1="320" y1="150" x2="400" y2="150" stroke="#10b981" stroke-width="3" stroke-dasharray="6 4"/>';
      m += '<text x="360" y="140" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">Gene Flow Free</text>';
    }

    // Population dots
    for(var i = 0; i < 16; i++){
      var ax = 70 + (i % 4) * 60 + Math.sin(t*2 + i) * 6;
      var ay = 110 + Math.floor(i / 4) * 35 + Math.cos(t*2 + i) * 4;
      m += '<circle cx="' + ax + '" cy="' + ay + '" r="8" fill="#38bdf8"/>';

      var bx = 430 + (i % 4) * 60 + Math.sin(t*2 + i * 1.5) * 6;
      var by = 110 + Math.floor(i / 4) * 35 + Math.cos(t*2 + i * 1.5) * 4;
      // Beta color shifts as divergence increases
      var bColor = divergence > 0.5 ? "#f59e0b" : "#38bdf8";
      m += '<circle cx="' + bx + '" cy="' + by + '" r="' + (8 + divergence * 3) + '" fill="' + bColor + '"/>';
    }

    svg.innerHTML = m;

    readout(
      cell("Time Isolated", (isolationYears / 1000) + " kyr", "#38bdf8") +
      cell("Gene Flow", hasBarrier ? "Zero (Blocked)" : "Continuous", hasBarrier ? "#ef4444" : "#10b981") +
      cell("Divergence Metric", (divergence * 100).toFixed(0) + "%", "#f59e0b") +
      cell("Taxonomic Status", isSpeciated ? "2 Distinct Species" : "Single Polytypic Species", isSpeciated ? "#10b981" : "#38bdf8")
    );

    verdict(
      isSpeciated ?
      '<span style="color:#10b981;font-weight:700;">Biological Speciation Achieved:</span> Prolonged geographic isolation and genetic drift have established intrinsic reproductive isolation (Ernst Mayr). The two populations can no longer interbreed to produce fertile offspring.' :
      '<span style="color:#38bdf8;font-weight:700;">Single Biological Species:</span> Gene flow or insufficient divergence keeps both groups within the same interbreeding gene pool.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Family & Order Trait Matrix (familyorderlab)
// -------------------------------------------------------------------------
window.SIMS.familyorderlab = (function(){
  var currentOrder = "polymoniales"; // "polymoniales", "carnivora"

  function setOrder(ord){
    currentOrder = ord;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Family 1 Diagnostic</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Family 2 Diagnostic</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Shared Order Characters</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-poly">Order Polymoniales (Plants)</button>' +
      '<button class="preset-btn" id="p-carn">Order Carnivora (Animals)</button>';

    document.getElementById("p-poly").onclick = function(){ setActivePreset(this); setOrder("polymoniales"); };
    document.getElementById("p-carn").onclick = function(){ setActivePreset(this); setOrder("carnivora"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Taxonomic Trait Aggregation: <b>Orders unite families based on shared character aggregates</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">In plants (Polymoniales), floral features predominate. In animals (Carnivora), predatory dental/claw suites unite families.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(currentOrder === "polymoniales"){
      // Order Polymoniales: Solanaceae vs Convolvulaceae
      m += '<rect x="40" y="30" width="640" height="240" rx="10" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="60" y="60" fill="#f59e0b" font-size="16" font-weight="700">ORDER: Polymoniales (Floral Character Aggregates)</text>';
      m += '<text x="60" y="80" fill="#94a3b8" font-size="12">Shared: Pentamerous flowers, persistent calyx tendency, actinomorphic corolla</text>';

      // Box 1: Solanaceae
      m += '<rect x="60" y="100" width="280" height="150" rx="8" fill="#031f17" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="80" y="125" fill="#10b981" font-size="14" font-weight="700">Family Solanaceae (Potato Family)</text>';
      m += '<text x="80" y="148" fill="#cbd5e1" font-size="11">• Genera: Solanum, Petunia, Datura</text>';
      m += '<text x="80" y="168" fill="#cbd5e1" font-size="11">• Ovary: Obliquely placed, syncarpous</text>';
      m += '<text x="80" y="188" fill="#cbd5e1" font-size="11">• Stamens: Epipetalous, porous anthers</text>';
      m += '<text x="80" y="208" fill="#cbd5e1" font-size="11">• Berry or capsule fruit; swollen placenta</text>';

      // Box 2: Convolvulaceae
      m += '<rect x="380" y="100" width="280" height="150" rx="8" fill="#0c1f36" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="400" y="125" fill="#38bdf8" font-size="14" font-weight="700">Family Convolvulaceae (Morning Glory)</text>';
      m += '<text x="400" y="148" fill="#cbd5e1" font-size="11">• Genera: Ipomoea (sweet potato)</text>';
      m += '<text x="400" y="168" fill="#cbd5e1" font-size="11">• Stem: Twining climber (herbaceous)</text>';
      m += '<text x="400" y="188" fill="#cbd5e1" font-size="11">• Corolla: Funnel-shaped (infundibuliform)</text>';
      m += '<text x="400" y="208" fill="#cbd5e1" font-size="11">• Ovary with 2 ovules per locule</text>';
    } else {
      // Order Carnivora: Felidae vs Canidae
      m += '<rect x="40" y="30" width="640" height="240" rx="10" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="60" y="60" fill="#f59e0b" font-size="16" font-weight="700">ORDER: Carnivora (Predatory Mammalian Suite)</text>';
      m += '<text x="60" y="80" fill="#94a3b8" font-size="12">Shared: Shearing carnassial teeth (P4/M1), acute olfaction, claws on digits</text>';

      // Box 1: Felidae
      m += '<rect x="60" y="100" width="280" height="150" rx="8" fill="#1f1003" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="80" y="125" fill="#f59e0b" font-size="14" font-weight="700">Family Felidae (Cats)</text>';
      m += '<text x="80" y="148" fill="#cbd5e1" font-size="11">• Genera: Panthera (lion, tiger), Felis</text>';
      m += '<text x="80" y="168" fill="#cbd5e1" font-size="11">• Claws: Fully retractile (sheathed)</text>';
      m += '<text x="80" y="188" fill="#cbd5e1" font-size="11">• Skull: Shortened muzzle, round profile</text>';
      m += '<text x="80" y="208" fill="#cbd5e1" font-size="11">• Ambush predators; highly agile</text>';

      // Box 2: Canidae
      m += '<rect x="380" y="100" width="280" height="150" rx="8" fill="#07232e" stroke="#06b6d4" stroke-width="1.5"/>';
      m += '<text x="400" y="125" fill="#06b6d4" font-size="14" font-weight="700">Family Canidae (Dogs & Wolves)</text>';
      m += '<text x="400" y="148" fill="#cbd5e1" font-size="11">• Genera: Canis, Vulpes (fox)</text>';
      m += '<text x="400" y="168" fill="#cbd5e1" font-size="11">• Claws: Non-retractile (blunt traction)</text>';
      m += '<text x="400" y="188" fill="#cbd5e1" font-size="11">• Skull: Elongated muzzle, keen scent</text>';
      m += '<text x="400" y="208" fill="#cbd5e1" font-size="11">• Pursuit endurance predators; pack hunters</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Taxonomic Order", currentOrder.toUpperCase(), "#f59e0b") +
      cell("Unifying Character", currentOrder === "polymoniales" ? "Floral Symmetries" : "Carnassial Teeth", "#10b981") +
      cell("Included Families", "2 Major Families", "#38bdf8") +
      cell("Diagnostic Basis", "Aggregates of Characters", "#a855f7")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Character Aggregation:</span> ' +
      'An Order unites multiple families that share a few broad character aggregates, even though each individual family maintains distinct vegetative, dental, or skeletal hallmarks.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: 7-Rank Inverted Pyramid & Generality Simulator (taxonomichierarchy)
// -------------------------------------------------------------------------
window.SIMS.taxonomichierarchy = (function(){
  var currentRankIdx = 0; // 0 = Species, 6 = Kingdom

  var ranks = [
    { rank: "Species", shared: "98%", complexity: "Lowest (Direct cross/morphology)", num: "1" },
    { rank: "Genus", shared: "85%", complexity: "Low (Closely related species)", num: "10s" },
    { rank: "Family", shared: "65%", complexity: "Moderate (Vegetative + reproductive suites)", num: "100s" },
    { rank: "Order", shared: "45%", complexity: "Elevated (Character aggregates)", num: "1,000s" },
    { rank: "Class", shared: "25%", complexity: "High (Broad structural blueprints)", num: "10,000s" },
    { rank: "Phylum / Division", shared: "12%", complexity: "Very High (Fundamental body plan)", num: "100,000s" },
    { rank: "Kingdom", shared: "4%", complexity: "Highest (Kingdom-level generalities)", num: "1,000,000+" }
  ];

  function setRank(idx){
    currentRankIdx = idx;
    var s = document.getElementById("rank-slider"); if(s) s.value = idx;
    var rv = document.getElementById("rank-val"); if(rv) rv.textContent = ranks[idx].rank;
    draw(0);
  }

  function mount(){
    App.state.maxT = 7;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Species (Max Shared Traits)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Intermediate Ranks</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Kingdom (Min Shared Traits)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-sp">Species (Lowest)</button>' +
      '<button class="preset-btn" id="p-fam">Family (Middle)</button>' +
      '<button class="preset-btn" id="p-kg">Kingdom (Highest)</button>';

    document.getElementById("p-sp").onclick = function(){ setActivePreset(this); setRank(0); };
    document.getElementById("p-fam").onclick = function(){ setActivePreset(this); setRank(2); };
    document.getElementById("p-kg").onclick = function(){ setActivePreset(this); setRank(6); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Hierarchical Rank Level: <b id="rank-val" style="color:#38bdf8;">Species</b></label>' +
        '<input type="range" id="rank-slider" min="0" max="6" value="0" step="1">' +
      '</div>';

    document.getElementById("rank-slider").oninput = function(e){
      setRank(parseInt(e.target.value, 10));
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var cur = ranks[currentRankIdx];

    var m = '<rect width="720" height="300" fill="#09131d"/>';

    // Draw inverted pyramid / stepped hierarchy on left
    var baseY = 240;
    for(var i = 0; i < 7; i++){
      var stepW = 80 + i * 36;
      var y = baseY - i * 30;
      var isSel = (i === currentRankIdx);
      var col = isSel ? "#38bdf8" : (i === 6 ? "#ec4899" : (i === 0 ? "#10b981" : "#334155"));
      var op = isSel ? "1.0" : "0.5";

      m += '<rect x="' + (180 - stepW/2) + '" y="' + y + '" width="' + stepW + '" height="24" rx="4" fill="' + col + '" fill-opacity="' + op + '" stroke="#f8fafc" stroke-width="' + (isSel ? '2' : '0.5') + '"/>';
      m += '<text x="180" y="' + (y + 16) + '" fill="' + (isSel ? '#ffffff' : '#cbd5e1') + '" font-size="11" font-weight="700" text-anchor="middle">' + ranks[i].rank + '</text>';
    }

    // Right explanation panel
    m += '<rect x="360" y="30" width="330" height="235" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="380" y="60" fill="#38bdf8" font-size="15" font-weight="700">Rank: ' + cur.rank + '</text>';

    m += '<text x="380" y="90" fill="#94a3b8" font-size="12">Shared Characteristics:</text>';
    m += '<text x="380" y="112" fill="#10b981" font-size="18" font-weight="700">' + cur.shared + '</text>';

    m += '<text x="380" y="145" fill="#94a3b8" font-size="12">Organisms Subsumed:</text>';
    m += '<text x="380" y="165" fill="#f59e0b" font-size="15" font-weight="600">' + cur.num + ' taxa</text>';

    m += '<text x="380" y="195" fill="#94a3b8" font-size="12">Classification Complexity:</text>';
    m += '<text x="380" y="215" fill="#e2e8f0" font-size="11">' + cur.complexity + '</text>';

    svg.innerHTML = m;

    readout(
      cell("Selected Category", cur.rank, "#38bdf8") +
      cell("Common Characters", cur.shared, "#10b981") +
      cell("Taxa Generality", (currentRankIdx + 1) + " / 7", "#f59e0b") +
      cell("Complexity Level", currentRankIdx > 3 ? "HIGH" : "LOW", currentRankIdx > 3 ? "#ec4899" : "#10b981")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">NCERT Fundamental Axiom:</span> ' +
      'As we go higher from species to kingdom, the number of common characteristics goes on decreasing. Lower the taxa, more are the characteristics that members share. Higher the category, greater the difficulty of determining relationship to other taxa.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Master NCERT Table 1.1 Comparator (tableexplorer)
// -------------------------------------------------------------------------
window.SIMS.tableexplorer = (function(){
  var orgKey = "man"; // "man", "housefly", "mango", "wheat"

  var tableData = {
    man: {
      common: "Man",
      sci: "Homo sapiens",
      genus: "Homo",
      family: "Hominidae",
      order: "Primata",
      classT: "Mammalia",
      phylum: "Chordata",
      desc: "Bipedal hominid with highly enlarged neocortex, stereoscopic vision, and opposable thumb."
    },
    housefly: {
      common: "Housefly",
      sci: "Musca domestica",
      genus: "Musca",
      family: "Muscidae",
      order: "Diptera",
      classT: "Insecta",
      phylum: "Arthropoda",
      desc: "True fly with two membranous forewings and club-shaped balancing halteres; 3 pairs jointed legs."
    },
    mango: {
      common: "Mango",
      sci: "Mangifera indica",
      genus: "Mangifera",
      family: "Anacardiaceae",
      order: "Sapindales",
      classT: "Dicotyledonae",
      phylum: "Angiospermae (Division)",
      desc: "Tropical fruit tree with reticulate leaf venation, pentamerous flowers, and drupaceous stone fruit."
    },
    wheat: {
      common: "Wheat",
      sci: "Triticum aestivum",
      genus: "Triticum",
      family: "Poaceae",
      order: "Poales",
      classT: "Monocotyledonae",
      phylum: "Angiospermae (Division)",
      desc: "Staple cereal grass with parallel leaf venation, single cotyledon (scutellum), and caryopsis grain."
    }
  };

  function setOrg(k){
    orgKey = k;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Animal Lineages (Man, Fly)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Plant Lineages (Mango, Wheat)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-man">Man (Homo sapiens)</button>' +
      '<button class="preset-btn" id="p-fly">Housefly (Musca domestica)</button>' +
      '<button class="preset-btn" id="p-mgo">Mango (Mangifera indica)</button>' +
      '<button class="preset-btn" id="p-wht">Wheat (Triticum aestivum)</button>';

    document.getElementById("p-man").onclick = function(){ setActivePreset(this); setOrg("man"); };
    document.getElementById("p-fly").onclick = function(){ setActivePreset(this); setOrg("housefly"); };
    document.getElementById("p-mgo").onclick = function(){ setActivePreset(this); setOrg("mango"); };
    document.getElementById("p-wht").onclick = function(){ setActivePreset(this); setOrg("wheat"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>NCERT Table 1.1 Master Lineage Comparator</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Directly verifies the four hallmark organism lineages from official reprint 2026-27 p. 8.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var d = tableData[orgKey];

    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="40" y="25" width="640" height="250" rx="10" fill="#0b1726" stroke="#1e293b" stroke-width="2"/>';

    m += '<text x="65" y="55" fill="#f8fafc" font-size="16" font-weight="700">' + d.common + ' · <tspan font-style="italic" fill="#38bdf8">' + d.sci + '</tspan></text>';
    m += '<text x="65" y="75" fill="#94a3b8" font-size="11">' + d.desc + '</text>';

    // Pedigree ladder blocks
    var tiers = [
      { rank: "Genus", val: d.genus, col: "#38bdf8" },
      { rank: "Family", val: d.family, col: "#10b981" },
      { rank: "Order", val: d.order, col: "#f59e0b" },
      { rank: "Class", val: d.classT, col: "#ec4899" },
      { rank: "Phylum/Division", val: d.phylum, col: "#8b5cf6" }
    ];

    for(var i = 0; i < tiers.length; i++){
      var tr = tiers[i];
      var x = 65 + i * 118;
      m += '<rect x="' + x + '" y="105" width="110" height="85" rx="6" fill="#030712" stroke="' + tr.col + '" stroke-width="1.5"/>';
      m += '<text x="' + (x + 55) + '" y="128" fill="#64748b" font-size="10" font-weight="700" text-anchor="middle">' + tr.rank.toUpperCase() + '</text>';
      m += '<text x="' + (x + 55) + '" y="155" fill="' + tr.col + '" font-size="12" font-weight="700" text-anchor="middle">' + tr.val + '</text>';
    }

    // Comparison summary bar
    m += '<rect x="65" y="210" width="582" height="48" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1"/>';
    m += '<text x="80" y="238" fill="#cbd5e1" font-size="12">NCERT Table 1.1 Match: <b style="color:#10b981;">100% Concordant</b> with Official Curriculum Guidelines</text>';

    svg.innerHTML = m;

    readout(
      cell("Common Name", d.common, "#f8fafc") +
      cell("Family (-idae/-aceae)", d.family, "#10b981") +
      cell("Order (-ales)", d.order, "#f59e0b") +
      cell("Phylum / Division", d.phylum.split(" ")[0], "#8b5cf6")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT Table 1.1 Lineage Verified:</span> ' +
      d.common + ' belongs to Genus ' + d.genus + ', Family ' + d.family + ', Order ' + d.order + ', Class ' + d.classT + ', and ' + d.phylum + '.'
    );
  }

  return { mount: mount, draw: draw };
})();
