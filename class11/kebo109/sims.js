// kebo109 interactive simulations: Biomolecules (Ch. 9, print pp. 104-119)
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
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

// -------------------------------------------------------------------------
// 1. Tissue Fractionation & Ash Analysis Bench (fractionlab) - L1, 9.1
// -------------------------------------------------------------------------
window.SIMS.fractionlab = (function(){
  var view = "grind"; // "grind", "ash", "elements"
  var stage = 0, ashStage = 0, elIdx = 0;
  var ELEMENTS = [
    ["Carbon (C)", "0.03", "18.5"],
    ["Hydrogen (H)", "0.14", "9.5"],
    ["Oxygen (O)", "46.6", "65.0"],
    ["Nitrogen (N)", "very little", "3.3"],
    ["Silicon (Si)", "27.7", "negligible"]
  ];

  function setV(v){ view = v; stage = 0; ashStage = 0; mountControls(); draw(0); }
  function bar(h){ return Math.max(2, Math.min(150, h)); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Acid-soluble pool (filtrate)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Acid-insoluble fraction (retentate)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Ash (inorganic residue)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-grind">Grind &amp; Strain</button>' +
      '<button class="preset-btn" id="p-ash">Wet-Dry-Ash</button>' +
      '<button class="preset-btn" id="p-elements">Table 9.1 Bars</button>';
    document.getElementById("p-grind").onclick = function(){ setActivePreset(this); setV("grind"); };
    document.getElementById("p-ash").onclick = function(){ setActivePreset(this); setV("ash"); };
    document.getElementById("p-elements").onclick = function(){ setActivePreset(this); setV("elements"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "grind"){
      c.innerHTML =
        '<div class="control-group"><label>Protocol step:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-g0">1 Tissue</button>' +
        '<button class="preset-btn" id="c-g1">2 Grind in TCA</button>' +
        '<button class="preset-btn" id="c-g2">3 Strain</button></div></div>' +
        '<div class="control-group"><label>Acid:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Trichloroacetic acid (Cl3CCOOH), mortar &amp; pestle, cheesecloth.</div></div>';
      document.getElementById("c-g0").onclick = function(){ stage = 0; draw(0); };
      document.getElementById("c-g1").onclick = function(){ stage = 1; draw(0); };
      document.getElementById("c-g2").onclick = function(){ stage = 2; draw(0); };
    } else if(view === "ash"){
      c.innerHTML =
        '<div class="control-group"><label>Ash sequence:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-a0">1 Wet weight</button>' +
        '<button class="preset-btn" id="c-a1">2 Dry</button>' +
        '<button class="preset-btn" id="c-a2">3 Burn to ash</button></div></div>' +
        '<div class="control-group"><label>Leaves as gas:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">CO2 + water vapour; ash keeps Ca, Mg, ...</div></div>';
      document.getElementById("c-a0").onclick = function(){ ashStage = 0; draw(0); };
      document.getElementById("c-a1").onclick = function(){ ashStage = 1; draw(0); };
      document.getElementById("c-a2").onclick = function(){ ashStage = 2; draw(0); };
    } else {
      var btns = ELEMENTS.map(function(e, i){
        return '<button class="preset-btn' + (i === elIdx ? " active" : "") + '" data-el="' + i + '">' + esc(e[0]) + "</button>";
      }).join("");
      c.innerHTML =
        '<div class="control-group"><label>Element (% weight):</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' + btns + "</div></div>" +
        '<div class="control-group"><label>Reading:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Same elements both lists; abundance differs.</div></div>';
      c.querySelectorAll("[data-el]").forEach(function(b){
        b.onclick = function(){ elIdx = Number(b.dataset.el); mountControls(); draw(0); };
      });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Chemical Analysis (\u00A79.1)</text>';
    if(view === "grind"){
      var boxes = [
        ["Tissue", "vegetable / liver", "#22c55e"],
        ["Slurry", "TCA + mortar", "#eab308"],
        ["Filtrate", "acid-soluble pool", "#38bdf8"],
        ["Retentate", "acid-insoluble", "#f59e0b"]
      ];
      var upto = [1, 2, 4][stage];
      for(var i = 0; i < 4; i++){
        var x = 40 + i * 160;
        var on = i < upto;
        m += '<rect x="' + x + '" y="110" width="140" height="110" rx="8" fill="#0f172a" stroke="' + (on ? boxes[i][2] : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 70) + '" y="145" fill="' + (on ? boxes[i][2] : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">' + boxes[i][0] + "</text>";
        m += '<text x="' + (x + 70) + '" y="168" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="10" text-anchor="middle">' + boxes[i][1] + "</text>";
        if(i < 3) m += '<text x="' + (x + 150) + '" y="170" fill="#64748b" font-size="16" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Strain through cheesecloth / cotton \u2192 two fractions</text>';
      readout(cell("Stage", ["TISSUE", "SLURRY", "STRAINED"][stage], "#38bdf8") +
        cell("Filtrate", stage === 2 ? "soluble pool" : "\u2014", "#38bdf8") +
        cell("Retentate", stage === 2 ? "insoluble" : "\u2014", "#f59e0b"));
      verdict(stage === 2 ? "Filtrate = acid-soluble pool; retentate = acid-insoluble fraction." : "Grind the tissue in trichloroacetic acid first.");
    } else if(view === "ash"){
      var masses = [150, 60, 14];
      var labels = ["Wet weight", "Dry weight", "Ash"];
      var notes = ["living tissue", "water evaporated", "Ca, Mg, ... remain"];
      for(var j = 0; j < 3; j++){
        var jx = 90 + j * 190;
        var h = masses[j];
        var lit = j <= ashStage;
        m += '<rect x="' + jx + '" y="' + (250 - h) + '" width="110" height="' + h + '" rx="6" fill="' + (lit ? "#0f172a" : "#0b1726") + '" stroke="' + (lit ? "#94a3b8" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (jx + 55) + '" y="272" fill="' + (lit ? "#cbd5e1" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">' + labels[j] + "</text>";
        m += '<text x="' + (jx + 55) + '" y="288" fill="#64748b" font-size="10" text-anchor="middle">' + notes[j] + "</text>";
      }
      m += '<text x="350" y="80" fill="#94a3b8" font-size="11" text-anchor="middle">Burning: organics \u2192 CO2 + vapour (leave); inorganics stay</text>';
      readout(cell("Step", ["WET", "DRY", "ASH"][ashStage], "#94a3b8") +
        cell("Lost", ["\u2014", "water", "CO2 + vapour"][ashStage], "#38bdf8") +
        cell("Kept", ashStage === 2 ? "ash: Ca, Mg..." : "\u2014", "#f59e0b"));
      verdict(ashStage === 2 ? "Ash = inorganic elements (calcium, magnesium, ...)." : "Dry it, then burn it fully.");
    } else {
      var e = ELEMENTS[elIdx];
      var cv = parseFloat(e[1]), bv = parseFloat(e[2]);
      var ch = isNaN(cv) ? 4 : bar(cv * 2.2), bh = isNaN(bv) ? 4 : bar(bv * 2.2);
      m += '<text x="350" y="80" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">' + esc(e[0]) + " \u2014 % weight</text>";
      m += '<rect x="200" y="' + (250 - ch) + '" width="110" height="' + ch + '" rx="6" fill="#0f172a" stroke="#a16207" stroke-width="2"/>';
      m += '<text x="255" y="' + (240 - ch) + '" fill="#fbbf24" font-size="12" font-weight="700" text-anchor="middle">' + esc(e[1]) + "</text>";
      m += '<text x="255" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">Earth\u2019s crust</text>';
      m += '<rect x="390" y="' + (250 - bh) + '" width="110" height="' + bh + '" rx="6" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="445" y="' + (240 - bh) + '" fill="#4ade80" font-size="12" font-weight="700" text-anchor="middle">' + esc(e[2]) + "</text>";
      m += '<text x="445" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">Human body</text>';
      readout(cell("Element", esc(e[0]), "#38bdf8") + cell("Crust %", esc(e[1]), "#fbbf24") + cell("Body %", esc(e[2]), "#4ade80"));
      verdict("Table 9.1: same elements, different relative abundance.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. Small-Molecule Builder (moleculelab) - L2, 9.1 + Fig. 9.1
// -------------------------------------------------------------------------
window.SIMS.moleculelab = (function(){
  var view = "amino"; // "amino", "fatty", "nuc"
  var rIdx = 1, fatIdx = 0, phos = false;
  var RS = [
    ["Glycine", "R = hydrogen (\u2013H)"],
    ["Alanine", "R = methyl (\u2013CH3)"],
    ["Serine", "R = hydroxy methyl"]
  ];
  var FATS = [
    ["Palmitic acid", "16 carbons", "saturated"],
    ["Arachidonic acid", "20 carbons", "unsaturated (C=C)"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Fixed frame</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Variable part (R / chain / phosphate)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Named molecule</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-amino">R-Group Picker</button>' +
      '<button class="preset-btn" id="p-fatty">Fatty Acids</button>' +
      '<button class="preset-btn" id="p-nucleoside">Nucleoside Builder</button>';
    document.getElementById("p-amino").onclick = function(){ setActivePreset(this); setV("amino"); };
    document.getElementById("p-fatty").onclick = function(){ setActivePreset(this); setV("fatty"); };
    document.getElementById("p-nucleoside").onclick = function(){ setActivePreset(this); setV("nuc"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "amino"){
      c.innerHTML =
        '<div class="control-group"><label>R group:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" data-r="0">H (glycine)</button>' +
        '<button class="preset-btn" data-r="1">CH3 (alanine)</button>' +
        '<button class="preset-btn" data-r="2">CH2OH (serine)</button></div></div>' +
        '<div class="control-group"><label>Frame:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">\u03B1-carbon + \u2013NH2 + \u2013COOH + \u2013H; only R changes.</div></div>';
      c.querySelectorAll("[data-r]").forEach(function(b){ b.onclick = function(){ rIdx = Number(b.dataset.r); draw(0); }; });
    } else if(view === "fatty"){
      c.innerHTML =
        '<div class="control-group"><label>Fatty acid:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" data-f="0">Palmitic (16 C)</button>' +
        '<button class="preset-btn" data-f="1">Arachidonic (20 C)</button></div></div>' +
        '<div class="control-group"><label>Counts:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Carbons include the carboxyl carbon (PDF p. 3).</div></div>';
      c.querySelectorAll("[data-f]").forEach(function(b){ b.onclick = function(){ fatIdx = Number(b.dataset.f); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Phosphate:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-n0">Base + sugar</button>' +
        '<button class="preset-btn" id="c-n1">+ phosphate</button></div></div>' +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Base+sugar = nucleoside; +phosphate ester = nucleotide.</div></div>';
      document.getElementById("c-n0").onclick = function(){ phos = false; draw(0); };
      document.getElementById("c-n1").onclick = function(){ phos = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Small Biomolecules (Fig. 9.1)</text>';
    if(view === "amino"){
      m += '<circle cx="350" cy="170" r="34" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="350" y="178" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">\u03B1-C</text>';
      m += '<line x1="350" y1="136" x2="350" y2="100" stroke="#cbd5e1" stroke-width="2.5"/>';
      m += '<line x1="350" y1="204" x2="350" y2="240" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<line x1="316" y1="170" x2="262" y2="170" stroke="#cbd5e1" stroke-width="2.5"/>';
      m += '<line x1="384" y1="170" x2="438" y2="170" stroke="#cbd5e1" stroke-width="2.5"/>';
      m += '<text x="350" y="90" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">\u2013H</text>';
      m += '<text x="350" y="262" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">' + ["\u2013H", "\u2013CH3", "\u2013CH2OH"][rIdx] + "</text>";
      m += '<text x="222" y="175" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">\u2013NH2</text>';
      m += '<text x="478" y="175" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">\u2013COOH</text>';
      m += '<text x="350" y="292" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">' + RS[rIdx][0] + " \u2014 " + RS[rIdx][1] + "</text>";
      readout(cell("Amino acid", RS[rIdx][0], "#22c55e") + cell("R group", RS[rIdx][1], "#f59e0b") + cell("Frame", "substituted methane", "#38bdf8"));
      verdict("Same \u03B1-carbon frame; only R changes the amino acid.");
    } else if(view === "fatty"){
      var f = FATS[fatIdx];
      var n = fatIdx === 0 ? 16 : 20;
      m += '<text x="350" y="80" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">' + f[0] + " \u2014 " + f[1] + " (" + f[2] + ")</text>";
      for(var i = 0; i < n; i++){
        var cx = 60 + i * 30;
        var isCooh = i === n - 1;
        m += '<circle cx="' + cx + '" cy="170" r="12" fill="#0f172a" stroke="' + (isCooh ? "#38bdf8" : "#f59e0b") + '" stroke-width="2"/>';
        if(isCooh) m += '<text x="' + cx + '" y="174" fill="#38bdf8" font-size="8" font-weight="700" text-anchor="middle">COOH</text>';
        if(i < n - 1) m += '<line x1="' + (cx + 12) + '" y1="170" x2="' + (cx + 18) + '" y2="170" stroke="#64748b" stroke-width="2"/>';
      }
      if(fatIdx === 1) m += '<text x="350" y="230" fill="#f59e0b" font-size="11" text-anchor="middle">One or more C=C double bonds along the chain</text>';
      else m += '<text x="350" y="230" fill="#94a3b8" font-size="11" text-anchor="middle">No double bonds (saturated)</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Carboxyl carbon counted (blue dot, right end)</text>';
      readout(cell("Fatty acid", f[0], "#22c55e") + cell("Carbons", f[1], "#f59e0b") + cell("Type", f[2], "#38bdf8"));
      verdict("Saturated = no C=C; unsaturated = one or more C=C.");
    } else {
      m += '<rect x="90" y="140" width="150" height="70" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="165" y="170" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">Uracil</text>';
      m += '<text x="165" y="190" fill="#94a3b8" font-size="10" text-anchor="middle">nitrogen base</text>';
      m += '<text x="260" y="180" fill="#64748b" font-size="16" text-anchor="middle">+</text>';
      m += '<rect x="280" y="140" width="150" height="70" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="355" y="170" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">Sugar</text>';
      m += '<text x="355" y="190" fill="#94a3b8" font-size="10" text-anchor="middle">ribose</text>';
      if(phos){
        m += '<text x="450" y="180" fill="#64748b" font-size="16" text-anchor="middle">+</text>';
        m += '<rect x="470" y="140" width="150" height="70" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<text x="545" y="170" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">Phosphate</text>';
        m += '<text x="545" y="190" fill="#94a3b8" font-size="10" text-anchor="middle">esterified</text>';
      }
      m += '<text x="350" y="262" fill="#22c55e" font-size="14" font-weight="700" text-anchor="middle">' + (phos ? "Uridylic acid (nucleotide)" : "Uridine (nucleoside)") + "</text>";
      readout(cell("Base", "uracil", "#38bdf8") + cell("Sugar", "ribose", "#38bdf8") + cell("Phosphate", phos ? "added" : "absent", phos ? "#f59e0b" : "#475569"));
      verdict(phos ? "Nucleotide: base + sugar + esterified phosphate." : "Nucleoside: base + sugar, no phosphate.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 3. Metabolite Sorter & Macromolecule Scales (metabolab) - L3, 9.2-9.3
// -------------------------------------------------------------------------
window.SIMS.metabolab = (function(){
  var view = "primary"; // "primary", "table93", "lipid"
  var pick = 0, catIdx = 0, ves = false;
  var ITEMS = [
    ["Amino acids", "primary"], ["Sugars", "primary"], ["Morphine", "secondary"],
    ["Concanavalin A", "secondary"], ["Nucleotides", "primary"], ["Rubber", "secondary"]
  ];
  var CATS = [
    ["Pigments", "Carotenoids, Anthocyanins"],
    ["Alkaloids", "Morphine, Codeine"],
    ["Terpenoides", "Monoterpenes, Diterpenes"],
    ["Essential oils", "Lemon grass oil"],
    ["Toxins", "Abrin, Ricin"],
    ["Lectins", "Concanavalin A"],
    ["Drugs", "Vinblastin, curcumin"],
    ["Polymeric substances", "Rubber, gums, cellulose"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Primary metabolites</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Secondary metabolites</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Lipids (\u2264800 Da, ride vesicles)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-primary">Primary vs Secondary</button>' +
      '<button class="preset-btn" id="p-table93">Table 9.3 Match</button>' +
      '<button class="preset-btn" id="p-lipid">Lipid Paradox</button>';
    document.getElementById("p-primary").onclick = function(){ setActivePreset(this); setV("primary"); };
    document.getElementById("p-table93").onclick = function(){ setActivePreset(this); setV("table93"); };
    document.getElementById("p-lipid").onclick = function(){ setActivePreset(this); setV("lipid"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "primary"){
      c.innerHTML =
        '<div class="control-group"><label>Compound:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        ITEMS.map(function(it, i){ return '<button class="preset-btn" data-it="' + i + '">' + it[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fig. 9.1 categories in animals = primary; plant/fungal/microbial extras = secondary.</div></div>';
      c.querySelectorAll("[data-it]").forEach(function(b){ b.onclick = function(){ pick = Number(b.dataset.it); draw(0); }; });
    } else if(view === "table93"){
      c.innerHTML =
        '<div class="control-group"><label>Category:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        CATS.map(function(ct, i){ return '<button class="preset-btn" data-ct="' + i + '">' + ct[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Spelling:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Print spellings kept: Terpenoides, Vinblastin.</div></div>';
      c.querySelectorAll("[data-ct]").forEach(function(b){ b.onclick = function(){ catIdx = Number(b.dataset.ct); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Membranes:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-v0">Intact</button>' +
        '<button class="preset-btn" id="c-v1">Ground \u2192 vesicles</button></div></div>' +
        '<div class="control-group"><label>Mass scale:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Soluble 18\u2013800 Da; insoluble \u226510,000 Da.</div></div>';
      document.getElementById("c-v0").onclick = function(){ ves = false; draw(0); };
      document.getElementById("c-v1").onclick = function(){ ves = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Metabolites &amp; Macromolecules (\u00A79.2\u2013\u00A79.3)</text>';
    if(view === "primary"){
      var it = ITEMS[pick];
      var isPrim = it[1] === "primary";
      m += '<rect x="60" y="120" width="270" height="110" rx="8" fill="#0f172a" stroke="' + (isPrim ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="195" y="160" fill="' + (isPrim ? "#22c55e" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">Primary</text>';
      m += '<text x="195" y="182" fill="#64748b" font-size="10" text-anchor="middle">known physiologial roles</text>';
      m += '<rect x="370" y="120" width="270" height="110" rx="8" fill="#0f172a" stroke="' + (!isPrim ? "#a855f7" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="505" y="160" fill="' + (!isPrim ? "#a855f7" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">Secondary</text>';
      m += '<text x="505" y="182" fill="#64748b" font-size="10" text-anchor="middle">welfare + ecological value</text>';
      m += '<text x="350" y="90" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + it[0] + " \u2192 " + it[1] + "</text>";
      readout(cell("Compound", it[0], "#38bdf8") + cell("Class", it[1], isPrim ? "#22c55e" : "#a855f7"));
      verdict(isPrim ? "Primary: Fig. 9.1 categories in animal tissues." : "Secondary: plant/fungal/microbial extras (Table 9.3).");
    } else if(view === "table93"){
      var ct = CATS[catIdx];
      m += '<rect x="60" y="110" width="280" height="90" rx="8" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>';
      m += '<text x="200" y="150" fill="#a855f7" font-size="13" font-weight="700" text-anchor="middle">' + ct[0] + "</text>";
      m += '<text x="200" y="172" fill="#64748b" font-size="10" text-anchor="middle">Table 9.3 category</text>';
      m += '<text x="360" y="160" fill="#64748b" font-size="18" text-anchor="middle">\u2192</text>';
      m += '<rect x="380" y="110" width="260" height="90" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="510" y="150" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">' + ct[1] + "</text>";
      m += '<text x="510" y="172" fill="#64748b" font-size="10" text-anchor="middle">printed examples</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Roles in hosts not fully understood; many serve human welfare</text>';
      readout(cell("Category", ct[0], "#a855f7") + cell("Examples", ct[1], "#22c55e"));
      verdict("Table 9.3, PDF p. 5 \u2014 print spellings kept verbatim.");
    } else {
      m += '<text x="350" y="80" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Lipids: \u2264800 Da monomers \u2192 ' + (ves ? "insoluble vesicles (retained!)" : "intact membranes") + "</text>";
      if(!ves){
        m += '<rect x="150" y="120" width="400" height="60" rx="30" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="350" y="155" fill="#38bdf8" font-size="12" text-anchor="middle">cell membrane (lipids arranged in structure)</text>';
      } else {
        var xs = [150, 260, 370, 480];
        for(var i = 0; i < 4; i++){
          m += '<circle cx="' + xs[i] + '" cy="150" r="34" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
          m += '<text x="' + xs[i] + '" y="155" fill="#f59e0b" font-size="10" text-anchor="middle">vesicle</text>';
        }
        m += '<text x="350" y="215" fill="#f59e0b" font-size="11" text-anchor="middle">not water soluble \u2192 separate with acid-insoluble pool</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Soluble pool 18\u2013800 Da \u00B7 insoluble \u226510,000 Da \u00B7 lipids not strictly macromolecules</text>';
      readout(cell("Lipid mass", "\u2264800 Da", "#38bdf8") + cell("State", ves ? "vesicles" : "membranes", "#f59e0b") + cell("Fraction", ves ? "insoluble" : "\u2014", "#f59e0b"));
      verdict(ves ? "Grinding breaks membranes into retained vesicles." : "Grind the tissue to shatter membranes.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Protein Hierarchy Lab (proteinlab) - L4, 9.4 + 9.7 + Fig. 9.3
// -------------------------------------------------------------------------
window.SIMS.proteinlab = (function(){
  var view = "levels"; // "levels", "globin", "functions"
  var lvl = 0, aswap = false, jobIdx = 0;
  var LEVELS = [
    ["Primary", "sequence N\u2192C (Fig. 9.3 a)"],
    ["Secondary", "right-handed helices (Fig. 9.3 b)"],
    ["Tertiary", "woolen ball 3D (Fig. 9.3 c)"],
    ["Quaternary", "subunit architecture (Fig. 9.3 d)"]
  ];
  var JOBS = [
    ["Collagen", "Intercellular ground substance"],
    ["Trypsin", "Enzyme"],
    ["Insulin", "Hormone"],
    ["Antibody", "Fights infectious agents"],
    ["Receptor", "Sensory reception (smell, taste, hormone, etc.)"],
    ["GLUT-4", "Enables glucose transport into cells"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Chain / subunit A</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fold / subunit B</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Functional level</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-levels">Four Levels</button>' +
      '<button class="preset-btn" id="p-globin">Haemoglobin 2+2</button>' +
      '<button class="preset-btn" id="p-functions">Table 9.5 Jobs</button>';
    document.getElementById("p-levels").onclick = function(){ setActivePreset(this); setV("levels"); };
    document.getElementById("p-globin").onclick = function(){ setActivePreset(this); setV("globin"); };
    document.getElementById("p-functions").onclick = function(){ setActivePreset(this); setV("functions"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "levels"){
      c.innerHTML =
        '<div class="control-group"><label>Level:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        LEVELS.map(function(l, i){ return '<button class="preset-btn" data-lv="' + i + '">' + l[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Note:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Tertiary is absolutely necessary for biological activity.</div></div>';
      c.querySelectorAll("[data-lv]").forEach(function(b){ b.onclick = function(){ lvl = Number(b.dataset.lv); draw(0); }; });
    } else if(view === "globin"){
      c.innerHTML =
        '<div class="control-group"><label>Assembly:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-s0">2\u03B1 + 2\u03B2 (normal)</button>' +
        '<button class="preset-btn" id="c-s1">4\u03B2 (mutant)</button></div></div>' +
        '<div class="control-group"><label>Level:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Subunit composition = quaternary structure.</div></div>';
      document.getElementById("c-s0").onclick = function(){ aswap = false; draw(0); };
      document.getElementById("c-s1").onclick = function(){ aswap = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Protein:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        JOBS.map(function(j, i){ return '<button class="preset-btn" data-jb="' + i + '">' + j[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Source:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Table 9.5, PDF p. 6.</div></div>';
      c.querySelectorAll("[data-jb]").forEach(function(b){ b.onclick = function(){ jobIdx = Number(b.dataset.jb); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Proteins (\u00A79.4, \u00A79.7)</text>';
    if(view === "levels"){
      var L = LEVELS[lvl];
      for(var i = 0; i < 4; i++){
        var x = 45 + i * 160;
        var on = i <= lvl;
        m += '<rect x="' + x + '" y="120" width="140" height="90" rx="8" fill="#0f172a" stroke="' + (on ? (i === 2 ? "#22c55e" : "#38bdf8") : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 70) + '" y="155" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">' + LEVELS[i][0] + "</text>";
        m += '<text x="' + (x + 70) + '" y="175" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="9" text-anchor="middle">' + LEVELS[i][1] + "</text>";
        if(i < 3) m += '<text x="' + (x + 150) + '" y="168" fill="#64748b" font-size="16" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Now viewing: ' + L[0] + " \u2014 " + L[1] + "</text>";
      readout(cell("Level", L[0], lvl === 2 ? "#22c55e" : "#38bdf8") + cell("Detail", L[1], "#94a3b8"));
      verdict(lvl === 2 ? "Tertiary: absolutely necessary for biological activity." : "Fold the same chain one level at a time.");
    } else if(view === "globin"){
      var subs = aswap ? ["\u03B2", "\u03B2", "\u03B2", "\u03B2"] : ["\u03B1", "\u03B1", "\u03B2", "\u03B2"];
      m += '<text x="350" y="90" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">Adult human haemoglobin \u2014 ' + (aswap ? "4 identical \u03B2 subunits (mutant)" : "2\u03B1 + 2\u03B2 subunits") + "</text>";
      for(var j = 0; j < 4; j++){
        var jx = 150 + j * 100;
        var isA = subs[j] === "\u03B1";
        m += '<circle cx="' + jx + '" cy="170" r="36" fill="#0f172a" stroke="' + (isA ? "#38bdf8" : "#f59e0b") + '" stroke-width="2.5"/>';
        m += '<text x="' + jx + '" y="180" fill="' + (isA ? "#38bdf8" : "#f59e0b") + '" font-size="20" font-weight="700" text-anchor="middle">' + subs[j] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Two \u03B1 identical to each other; two \u03B2 identical to each other (PDF p. 9)</text>';
      readout(cell("Subunits", aswap ? "4\u03B2" : "2\u03B1+2\u03B2", aswap ? "#f59e0b" : "#22c55e") + cell("Level", "quaternary", "#38bdf8"));
      verdict(aswap ? "Mutant: quaternary composition changed." : "Normal: quaternary architecture 2\u03B1 + 2\u03B2.");
    } else {
      var jb = JOBS[jobIdx];
      m += '<rect x="60" y="120" width="250" height="90" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="185" y="160" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">' + jb[0] + "</text>";
      m += '<text x="360" y="168" fill="#64748b" font-size="18" text-anchor="middle">\u2192</text>';
      m += '<rect x="390" y="120" width="250" height="90" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="515" y="160" fill="#22c55e" font-size="10" font-weight="700" text-anchor="middle">' + jb[1] + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Collagen most abundant in animals \u00B7 RuBisCO most abundant in biosphere</text>';
      readout(cell("Protein", jb[0], "#38bdf8") + cell("Function", jb[1], "#22c55e"));
      verdict("Table 9.5: one protein, one job.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 5. Polysaccharide & Nucleotide Bench (sugarlab) - L5, 9.5-9.6
// -------------------------------------------------------------------------
window.SIMS.sugarlab = (function(){
  var view = "glyco"; // "glyco", "iodine", "bases"
  var polyIdx = 0, iod = 0, baseIdx = 0;
  var POLYS = [
    ["Cellulose", "glucose homopolymer \u00B7 walls/paper/cotton"],
    ["Starch", "plant store \u00B7 helical \u00B7 I2 blue"],
    ["Glycogen", "animal store \u00B7 branched (Fig. 9.2)"],
    ["Inulin", "polymer of fructose"],
    ["Chitin", "arthropod exoskeletons"]
  ];
  var BASES = [
    ["Adenine", "substituted purine"],
    ["Guanine", "substituted purine"],
    ["Cytosine", "substituted pyrimidine"],
    ["Uracil", "substituted pyrimidine"],
    ["Thymine", "substituted pyrimidine"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Glucose polymers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#1d4ed8;"></span><span>Starch\u2013I2 blue</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Purines vs pyrimidines</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-glyco">Polymer Match</button>' +
      '<button class="preset-btn" id="p-iodine">Iodine Test</button>' +
      '<button class="preset-btn" id="p-bases">Base Sort</button>';
    document.getElementById("p-glyco").onclick = function(){ setActivePreset(this); setV("glyco"); };
    document.getElementById("p-iodine").onclick = function(){ setActivePreset(this); setV("iodine"); };
    document.getElementById("p-bases").onclick = function(){ setActivePreset(this); setV("bases"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "glyco"){
      c.innerHTML =
        '<div class="control-group"><label>Polysaccharide:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        POLYS.map(function(p, i){ return '<button class="preset-btn" data-pl="' + i + '">' + p[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Ends:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Right end reducing, left end non-reducing (glycogen).</div></div>';
      c.querySelectorAll("[data-pl]").forEach(function(b){ b.onclick = function(){ polyIdx = Number(b.dataset.pl); draw(0); }; });
    } else if(view === "iodine"){
      c.innerHTML =
        '<div class="control-group"><label>Powder + I2:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-i0">Starch</button>' +
        '<button class="preset-btn" id="c-i1">Cellulose</button></div></div>' +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Helices hold I2 (blue); no helices, no colour.</div></div>';
      document.getElementById("c-i0").onclick = function(){ iod = 0; draw(0); };
      document.getElementById("c-i1").onclick = function(){ iod = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Nitrogen base:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        BASES.map(function(b, i){ return '<button class="preset-btn" data-bs="' + i + '">' + b[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Sugars:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Ribose \u2192 RNA; 2\u2019 deoxyribose \u2192 DNA.</div></div>';
      c.querySelectorAll("[data-bs]").forEach(function(b){ b.onclick = function(){ baseIdx = Number(b.dataset.bs); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Polysaccharides &amp; Nucleotides (\u00A79.5\u2013\u00A79.6)</text>';
    if(view === "glyco"){
      var p = POLYS[polyIdx];
      m += '<rect x="60" y="120" width="250" height="90" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="185" y="160" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">' + p[0] + "</text>";
      m += '<text x="360" y="168" fill="#64748b" font-size="18" text-anchor="middle">\u2192</text>';
      m += '<rect x="390" y="120" width="250" height="90" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="515" y="160" fill="#22c55e" font-size="10" font-weight="700" text-anchor="middle">' + p[1] + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Threads of sugars \u00B7 complex ones mostly homopolymers</text>';
      readout(cell("Polymer", p[0], "#38bdf8") + cell("Identity", p[1], "#22c55e"));
      verdict("\u00A79.5: same glucose, different architecture, different job.");
    } else if(view === "iodine"){
      var isStarch = iod === 0;
      m += '<rect x="150" y="120" width="160" height="90" rx="8" fill="' + (isStarch ? "#1e3a8a" : "#0f172a") + '" stroke="' + (isStarch ? "#60a5fa" : "#94a3b8") + '" stroke-width="2"/>';
      m += '<text x="230" y="160" fill="' + (isStarch ? "#bfdbfe" : "#cbd5e1") + '" font-size="13" font-weight="700" text-anchor="middle">' + (isStarch ? "BLUE" : "no colour") + "</text>";
      m += '<text x="230" y="182" fill="#64748b" font-size="10" text-anchor="middle">' + (isStarch ? "starch\u2013I2" : "cellulose + I2") + "</text>";
      m += '<rect x="390" y="120" width="160" height="90" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>';
      m += '<text x="470" y="155" fill="#94a3b8" font-size="11" text-anchor="middle">' + (isStarch ? "helical coils" : "no complex") + "</text>";
      m += '<text x="470" y="172" fill="#94a3b8" font-size="11" text-anchor="middle">' + (isStarch ? "hold I2" : "helices") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Starch forms helical secondary structures; cellulose does not (PDF p. 7)</text>';
      readout(cell("Powder", isStarch ? "starch" : "cellulose", "#38bdf8") + cell("Result", isStarch ? "blue" : "no colour", isStarch ? "#60a5fa" : "#94a3b8"));
      verdict(isStarch ? "Starch\u2013I2 is blue: helices trap iodine." : "Cellulose cannot hold I2: no helices.");
    } else {
      var b = BASES[baseIdx];
      var isPur = baseIdx < 2;
      m += '<rect x="60" y="120" width="270" height="100" rx="8" fill="#0f172a" stroke="' + (isPur ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="195" y="160" fill="' + (isPur ? "#22c55e" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">Purines</text>';
      m += '<text x="195" y="182" fill="#64748b" font-size="10" text-anchor="middle">adenine, guanine</text>';
      m += '<rect x="370" y="120" width="270" height="100" rx="8" fill="#0f172a" stroke="' + (!isPur ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="505" y="160" fill="' + (!isPur ? "#38bdf8" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">Pyrimidines</text>';
      m += '<text x="505" y="182" fill="#64748b" font-size="10" text-anchor="middle">cytosine, uracil, thymine</text>';
      m += '<text x="350" y="90" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + b[0] + " \u2014 " + b[1] + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Nucleotide = base + monosaccharide + phosphate (\u00A79.6)</text>';
      readout(cell("Base", b[0], "#f8fafc") + cell("Ring", isPur ? "purine" : "pyrimidine", isPur ? "#22c55e" : "#38bdf8"));
      verdict(isPur ? "Adenine/guanine: substituted purines." : "The rest: substituted pyrimidines.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. Catalytic Cycle & Activation Energy Lab (enzymelab) - L6, 9.8-9.8.3
// -------------------------------------------------------------------------
window.SIMS.enzymelab = (function(){
  var view = "cycle"; // "cycle", "energy", "anhydrase"
  var step = 0, enz = true, cat = true;
  var STEPS = [
    ["E + S", "substrate binds into the active site"],
    ["ES", "binding induces tighter fit"],
    ["EP", "bonds break; product complex forms"],
    ["E + P", "products release; enzyme free again"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Enzyme / ES complex</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Product released</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Transition state (high energy)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cycle">Catalytic Cycle</button>' +
      '<button class="preset-btn" id="p-energy">Activation Energy</button>' +
      '<button class="preset-btn" id="p-anhydrase">Rate Showpiece</button>';
    document.getElementById("p-cycle").onclick = function(){ setActivePreset(this); setV("cycle"); };
    document.getElementById("p-energy").onclick = function(){ setActivePreset(this); setV("energy"); };
    document.getElementById("p-anhydrase").onclick = function(){ setActivePreset(this); setV("anhydrase"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "cycle"){
      c.innerHTML =
        '<div class="control-group"><label>Cycle step:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" data-st="0">1 Bind</button>' +
        '<button class="preset-btn" data-st="1">2 Tighten</button>' +
        '<button class="preset-btn" data-st="2">3 Convert</button>' +
        '<button class="preset-btn" data-st="3">4 Release</button></div></div>' +
        '<div class="control-group"><label>Scheme:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">E + S \u2192 ES \u2192 EP \u2192 E + P.</div></div>';
      c.querySelectorAll("[data-st]").forEach(function(b){ b.onclick = function(){ step = Number(b.dataset.st); draw(0); }; });
    } else if(view === "energy"){
      c.innerHTML =
        '<div class="control-group"><label>Curve:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-e0">Without enzyme</button>' +
        '<button class="preset-btn" id="c-e1">With enzyme</button></div></div>' +
        '<div class="control-group"><label>Axes:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Y = potential energy; X = progress of reaction (Fig. 9.4).</div></div>';
      document.getElementById("c-e0").onclick = function(){ enz = false; draw(0); };
      document.getElementById("c-e1").onclick = function(){ enz = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Reaction:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-r0">Uncatalysed</button>' +
        '<button class="preset-btn" id="c-r1">+ carbonic anhydrase</button></div></div>' +
        '<div class="control-group"><label>Reaction:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">CO2 + H2O \u2192 H2CO3.</div></div>';
      document.getElementById("c-r0").onclick = function(){ cat = false; draw(0); };
      document.getElementById("c-r1").onclick = function(){ cat = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Enzyme Action (\u00A79.8\u2013\u00A79.8.3)</text>';
    if(view === "cycle"){
      for(var i = 0; i < 4; i++){
        var x = 45 + i * 160;
        var on = i <= step;
        var col = i === 3 ? "#22c55e" : "#38bdf8";
        m += '<rect x="' + x + '" y="120" width="140" height="100" rx="8" fill="#0f172a" stroke="' + (on ? col : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 70) + '" y="152" fill="' + (on ? col : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">' + STEPS[i][0] + "</text>";
        m += '<text x="' + (x + 70) + '" y="176" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="9" text-anchor="middle">' + STEPS[i][1] + "</text>";
        if(i < 3) m += '<text x="' + (x + 150) + '" y="172" fill="#64748b" font-size="16" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">ES is obligatory, highly reactive and short-lived (\u00A79.8.3)</text>';
      readout(cell("Step", (step + 1) + "/4", "#38bdf8") + cell("State", STEPS[step][0], step === 3 ? "#22c55e" : "#38bdf8"));
      verdict(step === 3 ? "Free enzyme runs the cycle once again." : "The catalytic cycle, step " + (step + 1) + " of 4.");
    } else if(view === "energy"){
      m += '<line x1="120" y1="250" x2="600" y2="250" stroke="#64748b" stroke-width="1.5"/>';
      m += '<line x1="120" y1="250" x2="120" y2="70" stroke="#64748b" stroke-width="1.5"/>';
      m += '<text x="600" y="268" fill="#94a3b8" font-size="10" text-anchor="middle">progress of reaction</text>';
      m += '<text x="60" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">potential</text>';
      m += '<text x="60" y="174" fill="#94a3b8" font-size="10" text-anchor="middle">energy</text>';
      var peak = enz ? 120 : 70;
      m += '<path d="M140,220 Q260,220 330,' + peak + ' Q400,' + peak + ' 470,235 L560,235" fill="none" stroke="' + (enz ? "#22c55e" : "#f59e0b") + '" stroke-width="3"/>';
      m += '<text x="140" y="240" fill="#38bdf8" font-size="12" font-weight="700">S</text>';
      m += '<text x="560" y="228" fill="#38bdf8" font-size="12" font-weight="700">P</text>';
      m += '<text x="330" y="' + (peak - 12) + '" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">transition state</text>';
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">' + (enz ? "With enzyme: lower hill (Fig. 9.4)" : "Without enzyme: high hill") + " \u00B7 P below S = exothermic</text>";
      readout(cell("Barrier", enz ? "lowered" : "high", enz ? "#22c55e" : "#f59e0b") + cell("S/P levels", "unchanged", "#38bdf8"));
      verdict(enz ? "Enzymes bring down the activation-energy barrier." : "S must still climb through the transition state.");
    } else {
      m += '<text x="350" y="90" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">CO2 + H2O \u2192 H2CO3 ' + (cat ? "with carbonic anhydrase" : "without enzyme") + "</text>";
      m += '<rect x="120" y="130" width="200" height="90" rx="8" fill="#0f172a" stroke="' + (!cat ? "#f59e0b" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="220" y="165" fill="' + (!cat ? "#f59e0b" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">~200 molecules</text>';
      m += '<text x="220" y="185" fill="#64748b" font-size="11" text-anchor="middle">per HOUR</text>';
      m += '<rect x="380" y="130" width="200" height="90" rx="8" fill="#0f172a" stroke="' + (cat ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="480" y="165" fill="' + (cat ? "#22c55e" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">~600,000 molecules</text>';
      m += '<text x="480" y="185" fill="#64748b" font-size="11" text-anchor="middle">per SECOND</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Speed-up: about 10 million times (PDF p. 11)</text>';
      readout(cell("Rate", cat ? "600,000/s" : "200/hr", cat ? "#22c55e" : "#f59e0b") + cell("Speed-up", "~10 million \u00D7", "#38bdf8"));
      verdict("The chapter\u2019s own measure of enzyme power.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 7. Enzyme Factors, Inhibition & Classes Lab (factorlab) - L7, 9.8.4-9.8.6
// -------------------------------------------------------------------------
window.SIMS.factorlab = (function(){
  var view = "optimum"; // "optimum", "vmax", "inhibit"
  var curve = 0, sat = 50, mal = false;
  var CURVES = [["(a) pH", "optimum pH"], ["(b) Temperature", "optimum temperature"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Optimum / Vmax</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Activity curve</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Denatured / inhibited</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-optimum">Optimum Curves</button>' +
      '<button class="preset-btn" id="p-vmax">Vmax Saturation</button>' +
      '<button class="preset-btn" id="p-inhibit">Malonate Block</button>';
    document.getElementById("p-optimum").onclick = function(){ setActivePreset(this); setV("optimum"); };
    document.getElementById("p-vmax").onclick = function(){ setActivePreset(this); setV("vmax"); };
    document.getElementById("p-inhibit").onclick = function(){ setActivePreset(this); setV("inhibit"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "optimum"){
      c.innerHTML =
        '<div class="control-group"><label>Curve (Fig. 9.5):</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-f0">(a) pH</button>' +
        '<button class="preset-btn" id="c-f1">(b) Temperature</button></div></div>' +
        '<div class="control-group"><label>Edges:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Low T preserves (inactive); high T denatures.</div></div>';
      document.getElementById("c-f0").onclick = function(){ curve = 0; draw(0); };
      document.getElementById("c-f1").onclick = function(){ curve = 1; draw(0); };
    } else if(view === "vmax"){
      c.innerHTML =
        '<div class="control-group"><label>Substrate [S]:</label><input id="c-sat" type="range" min="5" max="100" value="' + sat + '" style="width:100%;margin-top:4px;"></div>' +
        '<div class="control-group"><label>Why it plateaus:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Enzymes fewer than substrates; saturation leaves no free enzyme.</div></div>';
      document.getElementById("c-sat").oninput = function(){ sat = Number(this.value); draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Binding site:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-m0">Succinate binds</button>' +
        '<button class="preset-btn" id="c-m1">+ malonate</button></div></div>' +
        '<div class="control-group"><label>Type:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Competitive: lookalike competes for the site (succinic dehydrogenase).</div></div>';
      document.getElementById("c-m0").onclick = function(){ mal = false; draw(0); };
      document.getElementById("c-m1").onclick = function(){ mal = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Factors &amp; Inhibition (\u00A79.8.4\u2013\u00A79.8.6)</text>';
    if(view === "optimum"){
      m += '<line x1="120" y1="250" x2="600" y2="250" stroke="#64748b" stroke-width="1.5"/>';
      m += '<line x1="120" y1="250" x2="120" y2="70" stroke="#64748b" stroke-width="1.5"/>';
      m += '<text x="600" y="268" fill="#94a3b8" font-size="10" text-anchor="middle">' + (curve === 0 ? "pH" : "temperature") + "</text>";
      m += '<text x="60" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">enzyme</text>';
      m += '<text x="60" y="174" fill="#94a3b8" font-size="10" text-anchor="middle">activity</text>';
      m += '<path d="M140,235 Q240,235 350,110 Q460,235 580,235" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<line x1="350" y1="110" x2="350" y2="250" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="5,4"/>';
      m += '<text x="350" y="95" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">' + CURVES[curve][1] + "</text>";
      m += '<text x="180" y="215" fill="#94a3b8" font-size="10" text-anchor="middle">' + (curve === 0 ? "low pH" : "low T: preserved") + "</text>";
      m += '<text x="520" y="215" fill="#ef4444" font-size="10" text-anchor="middle">' + (curve === 0 ? "high pH" : "high T: denatured") + "</text>";
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">Figure 9.5 ' + CURVES[curve][0] + " \u2014 activity declines both sides of optimum</text>";
      readout(cell("Curve", CURVES[curve][0], "#38bdf8") + cell("Peak", CURVES[curve][1], "#22c55e"));
      verdict("Narrow range; optimum in the middle.");
    } else if(view === "vmax"){
      m += '<line x1="120" y1="250" x2="600" y2="250" stroke="#64748b" stroke-width="1.5"/>';
      m += '<line x1="120" y1="250" x2="120" y2="70" stroke="#64748b" stroke-width="1.5"/>';
      m += '<text x="600" y="268" fill="#94a3b8" font-size="10" text-anchor="middle">[S]</text>';
      m += '<text x="60" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">velocity</text>';
      m += '<path d="M130,245 Q200,120 330,105 L560,100" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<line x1="120" y1="100" x2="600" y2="100" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="5,4"/>';
      m += '<text x="590" y="90" fill="#22c55e" font-size="11" font-weight="700">Vmax</text>';
      var px = 130 + sat * 4.3, py = sat < 45 ? 245 - sat * 3.1 : 105;
      m += '<circle cx="' + px + '" cy="' + py + '" r="7" fill="#f59e0b" stroke="#0f172a" stroke-width="2"/>';
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">Figure 9.5 (c) \u00B7 Vmax, Vmax/2, Km, [S] labelled in print</text>';
      readout(cell("[S]", String(sat), "#f59e0b") + cell("Velocity", py <= 110 ? "Vmax (saturated)" : "rising", py <= 110 ? "#22c55e" : "#38bdf8"));
      verdict(py <= 110 ? "Saturated: no free enzyme left for extra substrate." : "Rising: free enzyme still available.");
    } else {
      m += '<rect x="220" y="110" width="260" height="100" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="350" y="140" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">succinic dehydrogenase</text>';
      m += '<rect x="290" y="155" width="120" height="34" rx="8" fill="#020617" stroke="#64748b" stroke-width="1.5"/>';
      m += '<text x="350" y="177" fill="' + (mal ? "#ef4444" : "#22c55e") + '" font-size="12" font-weight="700" text-anchor="middle">' + (mal ? "malonate" : "succinate") + "</text>";
      if(mal) m += '<text x="350" y="230" fill="#ef4444" font-size="11" text-anchor="middle">substrate cannot bind \u2192 action declines</text>';
      else m += '<text x="350" y="230" fill="#22c55e" font-size="11" text-anchor="middle">substrate binds \u2192 reaction proceeds</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Malonate resembles succinate; competes for the same site (PDF p. 14)</text>';
      readout(cell("Site holds", mal ? "malonate" : "succinate", mal ? "#ef4444" : "#22c55e") + cell("Type", "competitive", "#f59e0b"));
      verdict(mal ? "Competitive inhibition: lookalike blocks the site." : "No inhibitor: site free for substrate.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-108 -
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
