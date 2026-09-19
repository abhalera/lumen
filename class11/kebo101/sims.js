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
// 1. Biodiversity & Habitats Explorer (biodiversitymap)
// NCERT §1.1 (pp. 3-4): six named habitats, 1.7-1.8M described species,
// new organisms continuously identified.
// -------------------------------------------------------------------------
window.SIMS.biodiversitymap = (function(){
  var view = "habitats"; // "habitats" | "described" | "new"

  var HABITATS = ["cold mountains", "deciduous forests", "oceans",
    "fresh water lakes", "deserts", "hot springs"];

  function setView(v){
    view = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Habitats named in §1.1</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Described species total</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Newly identified organisms</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-habitats">Habitats (§1.1)</button>' +
      '<button class="preset-btn" id="p-described">1.7–1.8M Described</button>' +
      '<button class="preset-btn" id="p-new">Newly Identified</button>';

    document.getElementById("p-habitats").onclick = function(){ setActivePreset(this); setView("habitats"); };
    document.getElementById("p-described").onclick = function(){ setActivePreset(this); setView("described"); };
    document.getElementById("p-new").onclick = function(){ setActivePreset(this); setView("new"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Biodiversity views: <b>three panels, all from §1.1 (pp. 3–4)</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Habitats the chapter names, the described-species total, and the steady identification of new organisms.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(view === "habitats"){
      m += '<text x="360" y="34" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">Six habitats named in §1.1 (p. 3)</text>';
      for(var i = 0; i < HABITATS.length; i++){
        var hx = 40 + (i % 3) * 220, hy = 55 + Math.floor(i / 3) * 105;
        m += '<rect x="' + hx + '" y="' + hy + '" width="200" height="88" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
        m += '<text x="' + (hx + 100) + '" y="' + (hy + 38) + '" fill="#10b981" font-size="14" font-weight="700" text-anchor="middle">' + HABITATS[i] + '</text>';
        m += '<text x="' + (hx + 100) + '" y="' + (hy + 62) + '" fill="#64748b" font-size="11" text-anchor="middle">living organisms found here</text>';
      }
      m += '<text x="360" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">Awe examples: galloping horse · migrating birds · valley of flowers · attacking shark</text>';
      readout(
        cell("Habitats named", "6 (§1.1)", "#10b981") +
        cell("Described species", "1.7–1.8 million", "#38bdf8") +
        cell("New organisms", "Continuously identified", "#f59e0b") +
        cell("One kind seen", "= one species", "#a855f7")
      );
      verdict(
        '<span style="color:#10b981;font-weight:700;">Diversity in the living world:</span> ' +
        'From cold mountains to hot springs, each different kind of organism represents a species — and widening the area observed widens the variety seen.'
      );
    } else if(view === "described"){
      m += '<text x="360" y="60" fill="#94a3b8" font-size="13" text-anchor="middle">SPECIES KNOWN AND DESCRIBED (§1.1)</text>';
      m += '<text x="360" y="130" fill="#38bdf8" font-size="52" font-weight="800" text-anchor="middle">1.7–1.8 million</text>';
      m += '<rect x="110" y="165" width="500" height="60" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
      m += '<text x="360" y="190" fill="#e2e8f0" font-size="13" text-anchor="middle">Biodiversity = the number and types of organisms present on earth</text>';
      m += '<text x="360" y="210" fill="#64748b" font-size="11" text-anchor="middle">a range, because cataloguing is still ongoing</text>';
      m += '<text x="360" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Millions identified and described — yet a large number still remains unknown (Summary, p. 9)</text>';
      readout(
        cell("Described range", "1.7–1.8 million", "#38bdf8") +
        cell("Biodiversity", "Number + types on earth", "#10b981") +
        cell("Still unknown", "A large number", "#f59e0b") +
        cell("Source", "§1.1 + Summary", "#a855f7")
      );
      verdict(
        '<span style="color:#38bdf8;font-weight:700;">The count and its qualifier:</span> ' +
        '1.7–1.8 million species known and described — while a large number still remains unknown.'
      );
    } else {
      m += '<text x="360" y="40" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">New organisms, continuously identified (p. 4)</text>';
      m += '<rect x="60" y="70" width="270" height="120" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="195" y="105" fill="#f59e0b" font-size="14" font-weight="700" text-anchor="middle">exploring new areas</text>';
      m += '<text x="195" y="130" fill="#cbd5e1" font-size="12" text-anchor="middle">→ new organisms found</text>';
      m += '<text x="195" y="152" fill="#64748b" font-size="11" text-anchor="middle">dense forests hold more kinds</text>';
      m += '<rect x="390" y="70" width="270" height="120" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="525" y="105" fill="#f59e0b" font-size="14" font-weight="700" text-anchor="middle">revisiting old areas</text>';
      m += '<text x="525" y="130" fill="#cbd5e1" font-size="12" text-anchor="middle">→ still new organisms</text>';
      m += '<text x="525" y="152" fill="#64748b" font-size="11" text-anchor="middle">even familiar ground surprises</text>';
      m += '<text x="360" y="235" fill="#e2e8f0" font-size="13" text-anchor="middle">Every newcomer needs describing, identifying — then one world-wide name.</text>';
      m += '<text x="360" y="260" fill="#64748b" font-size="11" text-anchor="middle">Local names vary place to place: nomenclature standardises them (§1.1, p. 4)</text>';
      readout(
        cell("New areas", "New organisms", "#f59e0b") +
        cell("Old areas", "Still new organisms", "#f59e0b") +
        cell("Next step", "Describe + identify", "#10b981") +
        cell("Then", "One standard name", "#38bdf8")
      );
      verdict(
        '<span style="color:#f59e0b;font-weight:700;">Never finished:</span> ' +
        'As we explore new areas, and even old ones, new organisms are continuously being identified — each needing identification before it can be named.'
      );
    }

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. Linnaean Binomial Nomenclature Validator (binomialnamer)
// NCERT rules 1-4 + author citation (pp. 4-5). Chapter examples only:
// mango (with Linn.), lion, potato.
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
    document.getElementById("p-potato").onclick = function(){ setActivePreset(this); setPreset("Solanum", "tuberosum", "", false); };
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
      '<span style="color:#10b981;font-weight:700;">Valid Binomial Name:</span> Genus capitalised, epithet lowercase, formatting per Rules 1–4 (ICBN/ICZN). The author citation records the first describer.' :
      '<span style="color:#ef4444;font-weight:700;">Rule Violation Detected:</span> NCERT Rule 4 mandates that the genus starts with a capital letter and the specific epithet starts with a small letter.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. Nested Taxa Explorer (taxasorter)
// Taxa at different levels (p. 5) + Table 1.1 lineages (p. 8). Every taxon
// and every rank gloss below is stated in the chapter.
// -------------------------------------------------------------------------
window.SIMS.taxasorter = (function(){
  var selectedLineage = "human"; // "human", "fly", "mango", "wheat"

  var GLOSS = {
    Kingdom: "highest category (§1.2.7)",
    Phylum: "body-plan grouping (§1.2.6)",
    Division: "plant phylum-equivalent (§1.2.6)",
    Class: "related orders (§1.2.5)",
    Order: "related families (§1.2.4)",
    Family: "related genera (§1.2.3)",
    Genus: "related species (§1.2.2)",
    Species: "lowest category (§1.2.1)"
  };

  var lineages = {
    human: [
      { rank: "Kingdom", taxon: "Animalia" },
      { rank: "Phylum", taxon: "Chordata" },
      { rank: "Class", taxon: "Mammalia" },
      { rank: "Order", taxon: "Primata" },
      { rank: "Family", taxon: "Hominidae" },
      { rank: "Genus", taxon: "Homo" },
      { rank: "Species", taxon: "Homo sapiens" }
    ],
    fly: [
      { rank: "Kingdom", taxon: "Animalia" },
      { rank: "Phylum", taxon: "Arthropoda" },
      { rank: "Class", taxon: "Insecta" },
      { rank: "Order", taxon: "Diptera" },
      { rank: "Family", taxon: "Muscidae" },
      { rank: "Genus", taxon: "Musca" },
      { rank: "Species", taxon: "Musca domestica" }
    ],
    mango: [
      { rank: "Kingdom", taxon: "Plantae" },
      { rank: "Division", taxon: "Angiospermae" },
      { rank: "Class", taxon: "Dicotyledonae" },
      { rank: "Order", taxon: "Sapindales" },
      { rank: "Family", taxon: "Anacardiaceae" },
      { rank: "Genus", taxon: "Mangifera" },
      { rank: "Species", taxon: "Mangifera indica" }
    ],
    wheat: [
      { rank: "Kingdom", taxon: "Plantae" },
      { rank: "Division", taxon: "Angiospermae" },
      { rank: "Class", taxon: "Monocotyledonae" },
      { rank: "Order", taxon: "Poales" },
      { rank: "Family", taxon: "Poaceae" },
      { rank: "Genus", taxon: "Triticum" },
      { rank: "Species", taxon: "Triticum aestivum" }
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
      '<button class="preset-btn active" id="p-txhuman">Human (Homo sapiens)</button>' +
      '<button class="preset-btn" id="p-txfly">Housefly (Musca domestica)</button>' +
      '<button class="preset-btn" id="p-txmango">Mango (Mangifera indica)</button>' +
      '<button class="preset-btn" id="p-txwheat">Wheat (Triticum aestivum)</button>';

    document.getElementById("p-txhuman").onclick = function(){ setActivePreset(this); setLineage("human"); };
    document.getElementById("p-txfly").onclick = function(){ setActivePreset(this); setLineage("fly"); };
    document.getElementById("p-txmango").onclick = function(){ setActivePreset(this); setLineage("mango"); };
    document.getElementById("p-txwheat").onclick = function(){ setActivePreset(this); setLineage("wheat"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Nested taxon rings: <b>every ring is a real taxon (Table 1.1, p. 8)</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">A taxon indicates categories at very different levels: each inner ring sits entirely within the one above it.</div>' +
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
      m += '<text x="350" y="' + (y + 13) + '" fill="#64748b" font-size="10">' + GLOSS[item.rank] + '</text>';
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
      'Each ring is a real biological taxon. Lower taxa nest entirely within higher taxa — species inside genus inside family, all the way to the kingdom (pp. 5–6).'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. Species & Isolation Explorer (speciesconcept)
// Mayr's biological species concept (p. 2 box) + §1.2.1. The divergence
// index is the lab's own illustrative model, labelled as such.
// -------------------------------------------------------------------------
window.SIMS.speciesconcept = (function(){
  var isolationYears = 50000; // model clock, not a textbook figure
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
      '<button class="preset-btn active" id="p-symp">Interbreeding (no barrier)</button>' +
      '<button class="preset-btn" id="p-mid">Diverging (barrier up)</button>' +
      '<button class="preset-btn" id="p-spec">Isolated (long split)</button>';

    document.getElementById("p-symp").onclick = function(){ setActivePreset(this); setParams(0, false); };
    document.getElementById("p-mid").onclick = function(){ setActivePreset(this); setParams(50000, true); };
    document.getElementById("p-spec").onclick = function(){ setActivePreset(this); setParams(200000, true); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Model isolation clock: <b id="years-val" style="color:#38bdf8;">50k years</b></label>' +
        '<input type="range" id="years-slider" min="0" max="250000" value="50000" step="5000">' +
      '</div>' +
      '<div class="control-group" style="display:flex;align-items:center;gap:8px;margin-top:20px;">' +
        '<input type="checkbox" id="barrier-toggle" checked style="width:18px;height:18px;">' +
        '<label for="barrier-toggle" style="margin:0;cursor:pointer;">Geographic Mountain/River Barrier</label>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 2;color:#94a3b8;font-size:12px;">Illustrative model: the years and the divergence index are the lab\u2019s own dials for exploring Mayr\u2019s concept, not textbook figures.</div>';

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

    // Illustrative divergence index 0 to 1 (lab model, not a textbook value)
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
      cell("Model Clock", (isolationYears / 1000) + " kyr", "#38bdf8") +
      cell("Gene Flow", hasBarrier ? "Zero (Blocked)" : "Continuous", hasBarrier ? "#ef4444" : "#10b981") +
      cell("Divergence Index", (divergence * 100).toFixed(0) + "% (model)", "#f59e0b") +
      cell("Taxonomic Status", isSpeciated ? "2 Distinct Species" : "Single Interbreeding Species", isSpeciated ? "#10b981" : "#38bdf8")
    );

    verdict(
      isSpeciated ?
      '<span style="color:#10b981;font-weight:700;">Reproductively Isolated (Mayr):</span> With gene flow blocked long enough, the model populations become distinct species — groups no longer interbreeding with each other. Mayr pioneered this biological species definition (p. 2).' :
      '<span style="color:#38bdf8;font-weight:700;">Single Biological Species:</span> Gene flow — or too short a split — keeps both populations within one interbreeding gene pool (Mayr, p. 2).'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. Family & Order Comparator (familyorderlab)
// NCERT §1.2.3-1.2.4 (p. 7). Only the chapter's groupings and characters.
// NOTE: the order name keeps the PDF's printed spelling "Polymoniales".
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
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>First Family</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Second Family</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Shared Order Characters</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-poly">Order Polymoniales (Plants)</button>' +
      '<button class="preset-btn" id="p-carn">Order Carnivora (Animals)</button>';

    document.getElementById("p-poly").onclick = function(){ setActivePreset(this); setOrder("polymoniales"); };
    document.getElementById("p-carn").onclick = function(){ setActivePreset(this); setOrder("carnivora"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Trait aggregation: <b>orders unite families on shared character aggregates (§1.2.4)</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">In plants (Polymoniales), floral characters predominate. In animals (Carnivora), a few similar characters unite Felidae and Canidae.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(currentOrder === "polymoniales"){
      // Order Polymoniales: Solanaceae + Convolvulaceae (book spelling)
      m += '<rect x="40" y="30" width="640" height="240" rx="10" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="60" y="60" fill="#f59e0b" font-size="16" font-weight="700">ORDER: Polymoniales (book spelling, §1.2.4)</text>';
      m += '<text x="60" y="80" fill="#94a3b8" font-size="12">Shared: floral characters (mainly)</text>';

      // Box 1: Solanaceae
      m += '<rect x="60" y="100" width="280" height="150" rx="8" fill="#031f17" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="80" y="125" fill="#10b981" font-size="14" font-weight="700">Family Solanaceae</text>';
      m += '<text x="80" y="148" fill="#cbd5e1" font-size="11">• Genera: Solanum, Petunia, Datura</text>';
      m += '<text x="80" y="168" fill="#cbd5e1" font-size="11">• Basis: vegetative + reproductive features</text>';
      m += '<text x="80" y="188" fill="#cbd5e1" font-size="11">• Example: potato &amp; brinjal in Solanum</text>';
      m += '<text x="80" y="208" fill="#64748b" font-size="11">• a family of related genera (§1.2.3)</text>';

      // Box 2: Convolvulaceae
      m += '<rect x="380" y="100" width="280" height="150" rx="8" fill="#0c1f36" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="400" y="125" fill="#38bdf8" font-size="14" font-weight="700">Family Convolvulaceae</text>';
      m += '<text x="400" y="148" fill="#cbd5e1" font-size="11">• Grouped with Solanaceae (§1.2.4)</text>';
      m += '<text x="400" y="168" fill="#cbd5e1" font-size="11">• Union mainly on floral characters</text>';
      m += '<text x="400" y="188" fill="#cbd5e1" font-size="11">• A related plant family</text>';
      m += '<text x="400" y="208" fill="#64748b" font-size="11">• fewer shared characters than a genus</text>';
    } else {
      // Order Carnivora: Felidae + Canidae
      m += '<rect x="40" y="30" width="640" height="240" rx="10" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="60" y="60" fill="#f59e0b" font-size="16" font-weight="700">ORDER: Carnivora (assemblage of families)</text>';
      m += '<text x="60" y="80" fill="#94a3b8" font-size="12">Shared: a few similar characters (§1.2.4)</text>';

      // Box 1: Felidae
      m += '<rect x="60" y="100" width="280" height="150" rx="8" fill="#1f1003" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="80" y="125" fill="#f59e0b" font-size="14" font-weight="700">Family Felidae (Cats)</text>';
      m += '<text x="80" y="148" fill="#cbd5e1" font-size="11">• Genera: Panthera + Felis</text>';
      m += '<text x="80" y="168" fill="#cbd5e1" font-size="11">• Panthera: lion, tiger, leopard</text>';
      m += '<text x="80" y="188" fill="#cbd5e1" font-size="11">• Felis: the cats</text>';
      m += '<text x="80" y="208" fill="#64748b" font-size="11">• related genera, one family (§1.2.3)</text>';

      // Box 2: Canidae
      m += '<rect x="380" y="100" width="280" height="150" rx="8" fill="#07232e" stroke="#06b6d4" stroke-width="1.5"/>';
      m += '<text x="400" y="125" fill="#06b6d4" font-size="14" font-weight="700">Family Canidae (Dogs)</text>';
      m += '<text x="400" y="148" fill="#cbd5e1" font-size="11">• Dogs — split from cats at family</text>';
      m += '<text x="400" y="168" fill="#cbd5e1" font-size="11">• Cat vs dog: similarities + differences</text>';
      m += '<text x="400" y="188" fill="#cbd5e1" font-size="11">• Reunited with Felidae in Carnivora</text>';
      m += '<text x="400" y="208" fill="#64748b" font-size="11">• families share few characters (§1.2.4)</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Taxonomic Order", currentOrder.toUpperCase(), "#f59e0b") +
      cell("Unifying Character", currentOrder === "polymoniales" ? "Floral characters (mainly)" : "Few similar characters", "#10b981") +
      cell("Included Families", "2 Named Families", "#38bdf8") +
      cell("Diagnostic Basis", "Aggregates of Characters", "#a855f7")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Character Aggregation:</span> ' +
      'An order unites families sharing a few character aggregates — floral characters for Polymoniales — even as each family keeps its own genera distinct.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. Seven-Rank Hierarchy Explorer (taxonomichierarchy)
// Figure 1.1 + the shared-character rule (§1.2, p. 8). Qualitative trend
// only — the chapter gives no percentages or counts, so the lab shows none.
// -------------------------------------------------------------------------
window.SIMS.taxonomichierarchy = (function(){
  var currentRankIdx = 0; // 0 = Species, 6 = Kingdom

  var ranks = [
    { rank: "Species", shared: "Maximum", complexity: "Lowest — compare look-alikes" },
    { rank: "Genus", shared: "Very high", complexity: "Low — closely related species" },
    { rank: "Family", shared: "High", complexity: "Moderate — related genera" },
    { rank: "Order", shared: "Moderate", complexity: "Elevated — character aggregates" },
    { rank: "Class", shared: "Low", complexity: "High — broad blueprints" },
    { rank: "Phylum / Division", shared: "Very low", complexity: "Very high — one body plan" },
    { rank: "Kingdom", shared: "Minimum", complexity: "Highest — relating taxa hardest" }
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

    m += '<text x="380" y="145" fill="#94a3b8" font-size="12">Rank Position:</text>';
    m += '<text x="380" y="165" fill="#f59e0b" font-size="15" font-weight="600">' + (currentRankIdx + 1) + ' of 7 (Figure 1.1)</text>';

    m += '<text x="380" y="195" fill="#94a3b8" font-size="12">Classification Difficulty:</text>';
    m += '<text x="380" y="215" fill="#e2e8f0" font-size="11">' + cur.complexity + '</text>';

    svg.innerHTML = m;

    readout(
      cell("Selected Category", cur.rank, "#38bdf8") +
      cell("Common Characters", cur.shared, "#10b981") +
      cell("Rank", (currentRankIdx + 1) + " / 7", "#f59e0b") +
      cell("Difficulty", currentRankIdx > 3 ? "HIGH" : "LOW", currentRankIdx > 3 ? "#ec4899" : "#10b981")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">NCERT Rule (§1.2):</span> ' +
      'As we go higher from species to kingdom, the number of common characteristics goes on decreasing. Lower the taxa, more are the characteristics that members share; higher the category, greater the difficulty of relating it to other taxa.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. Table 1.1 Lineage Comparator (tableexplorer)
// Table 1.1 (p. 8) verbatim. Descriptions use only chapter facts.
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
      desc: "Table 1.1 animal lineage; a mammal — think external ears and body hair (§1.1)."
    },
    housefly: {
      common: "Housefly",
      sci: "Musca domestica",
      genus: "Musca",
      family: "Muscidae",
      order: "Diptera",
      classT: "Insecta",
      phylum: "Arthropoda",
      desc: "Table 1.1 animal lineage; class Insecta — three pairs of jointed legs (§1.2)."
    },
    mango: {
      common: "Mango",
      sci: "Mangifera indica",
      genus: "Mangifera",
      family: "Anacardiaceae",
      order: "Sapindales",
      classT: "Dicotyledonae",
      phylum: "Angiospermae (Division)",
      desc: "Table 1.1 plant lineage; the book's worked example of binomial naming (§1.1)."
    },
    wheat: {
      common: "Wheat",
      sci: "Triticum aestivum",
      genus: "Triticum",
      family: "Poaceae",
      order: "Poales",
      classT: "Monocotyledonae",
      phylum: "Angiospermae (Division)",
      desc: "Table 1.1 plant lineage; 'Wheat' is the chapter's own example of a taxon (§1.1)."
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
        '<label>NCERT Table 1.1 Lineage Comparator</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">The four reference lineages from reprint 2026-27, p. 8, shown verbatim.</div>' +
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
    m += '<text x="80" y="238" fill="#cbd5e1" font-size="12">NCERT Table 1.1 (p. 8): values taken straight from the printed table</text>';

    svg.innerHTML = m;

    readout(
      cell("Common Name", d.common, "#f8fafc") +
      cell("Family", d.family, "#10b981") +
      cell("Order", d.order, "#f59e0b") +
      cell("Phylum / Division", d.phylum.split(" ")[0], "#8b5cf6")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">NCERT Table 1.1 Lineage:</span> ' +
      d.common + ' sits in genus ' + d.genus + ', family ' + d.family + ', order ' + d.order + ', class ' + d.classT + ', and ' + d.phylum + '.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kech101/keph102 —
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

// Keep this chapter's presentation aligned with its data: the shared
// Class 11 runtime marks the first connect card wow by position, so strip
// that marker from every card except the one explicitly titled "Wow".
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
