// kebo111 interactive simulations: Photosynthesis in Higher Plants (Ch. 11, print pp. 131-152)
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
// 1. Starch Tests & CO2 Requirement Bench (knowlab) - L1, 11.1
// -------------------------------------------------------------------------
window.SIMS.knowlab = (function(){
  var view = "starch"; // "starch", "koh", "troph"
  var patch = 0, air = false, who = 0;
  var PATCHES = [["Green + light", "starch positive"], ["White + light", "starch negative"], ["Green + covered", "starch negative"]];
  var WHOS = [["Green plants", "autotrophs: synthesise food"], ["Animals", "heterotrophs: depend on plants"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Starch positive</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#64748b;"></span><span>Starch negative</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>CO2 present</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-starch">Leaf Patches</button>' +
      '<button class="preset-btn" id="p-koh">KOH Tube</button>' +
      '<button class="preset-btn" id="p-troph">Who Feeds Whom</button>';
    document.getElementById("p-starch").onclick = function(){ setActivePreset(this); setV("starch"); };
    document.getElementById("p-koh").onclick = function(){ setActivePreset(this); setV("koh"); };
    document.getElementById("p-troph").onclick = function(){ setActivePreset(this); setV("troph"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "starch"){
      c.innerHTML =
        '<div class="control-group"><label>Patch:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        PATCHES.map(function(p, i){ return '<button class="preset-btn" data-pc="' + i + '">' + p[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Needs:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Chlorophyll + light + CO2.</div></div>';
      c.querySelectorAll("[data-pc]").forEach(function(b){ b.onclick = function(){ patch = Number(b.dataset.pc); draw(0); }; });
    } else if(view === "koh"){
      c.innerHTML =
        '<div class="control-group"><label>Half:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-k0">In tube (KOH)</button>' +
        '<button class="preset-btn" id="c-k1">In air</button></div></div>' +
        '<div class="control-group"><label>KOH:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Soaked cotton absorbs CO2.</div></div>';
      document.getElementById("c-k0").onclick = function(){ air = false; draw(0); };
      document.getElementById("c-k1").onclick = function(){ air = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Organism:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-w0">Green plants</button>' +
        '<button class="preset-btn" id="c-w1">Animals</button></div></div>' +
        '<div class="control-group"><label>Base:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">All life depends on sunlight.</div></div>';
      document.getElementById("c-w0").onclick = function(){ who = 0; draw(0); };
      document.getElementById("c-w1").onclick = function(){ who = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">First Tests (\u00A711.1)</text>';
    if(view === "starch"){
      var p = PATCHES[patch];
      var pos = patch === 0;
      m += '<rect x="200" y="110" width="300" height="110" rx="40" fill="' + (patch === 1 ? "#0f172a" : "#14532d") + '" stroke="' + (pos ? "#22c55e" : "#64748b") + '" stroke-width="2.5"/>';
      if(patch === 2){
        m += '<rect x="200" y="110" width="300" height="110" rx="40" fill="#020617" opacity="0.75"/>';
        m += '<text x="350" y="168" fill="#94a3b8" font-size="12" text-anchor="middle">black paper cover</text>';
      }
      m += '<text x="350" y="90" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">' + p[0] + " \u2192 " + p[1] + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Starch only in green parts in the presence of light (PDF p. 3)</text>';
      readout(cell("Patch", p[0], "#38bdf8") + cell("Starch", pos ? "positive" : "negative", pos ? "#22c55e" : "#94a3b8"));
      verdict(pos ? "Green + light: photosynthesis confirmed." : "Missing chlorophyll or light: no starch.");
    } else if(view === "koh"){
      m += '<rect x="140" y="110" width="180" height="110" rx="8" fill="#0f172a" stroke="' + (!air ? "#f59e0b" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="230" y="150" fill="' + (!air ? "#f59e0b" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">Tube half</text>';
      m += '<text x="230" y="172" fill="#64748b" font-size="10" text-anchor="middle">KOH: no CO2</text>';
      m += '<text x="230" y="190" fill="' + (!air ? "#94a3b8" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">' + (!air ? "starch negative" : "") + "</text>";
      m += '<rect x="380" y="110" width="180" height="110" rx="8" fill="#0f172a" stroke="' + (air ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="470" y="150" fill="' + (air ? "#38bdf8" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">Air half</text>';
      m += '<text x="470" y="172" fill="#64748b" font-size="10" text-anchor="middle">CO2 present</text>';
      m += '<text x="470" y="190" fill="' + (air ? "#22c55e" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">' + (air ? "starch positive" : "") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Single variable CO2 \u2192 required for photosynthesis (PDF p. 4)</text>';
      readout(cell("Half", air ? "air" : "tube", air ? "#38bdf8" : "#f59e0b") + cell("Starch", air ? "positive" : "negative", air ? "#22c55e" : "#94a3b8"));
      verdict(air ? "CO2 present: starch forms." : "CO2 absorbed by KOH: no starch.");
    } else {
      var w = WHOS[who];
      m += '<text x="350" y="130" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">' + w[0] + "</text>";
      m += '<text x="350" y="170" fill="' + (who === 0 ? "#22c55e" : "#f59e0b") + '" font-size="13" font-weight="700" text-anchor="middle">' + w[1] + "</text>";
      m += '<text x="350" y="215" fill="#94a3b8" font-size="11" text-anchor="middle">' + (who === 0 ? "Primary source of all food + oxygen" : "Depend on green plants for food") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Photosynthesis: physico-chemical use of light for organics</text>';
      readout(cell("Group", w[0], "#38bdf8") + cell("Role", w[1], who === 0 ? "#22c55e" : "#f59e0b"));
      verdict(who === 0 ? "Autotrophs: food makers." : "Heterotrophs: food takers.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. Bell Jar, Prism & Bacteria History Lab (historylab) - L2, 11.2
// -------------------------------------------------------------------------
window.SIMS.historylab = (function(){
  var view = "priestley"; // "priestley", "engelmann", "vanniel"
  var mint = false, band = 1, donor = 0;
  var BANDS = [["Blue", "bacteria crowd"], ["Red", "bacteria crowd"], ["Green", "few bacteria"]];
  var DONORS = [["H2O (plants)", "O2 released"], ["H2S (sulphur bacteria)", "sulphur/sulphate, no O2"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fouled air</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Restored / O2 sites</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Hydrogen donor</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-priestley">Bell Jar</button>' +
      '<button class="preset-btn" id="p-engelmann">Prism + Bacteria</button>' +
      '<button class="preset-btn" id="p-vanniel">Donor Rule</button>';
    document.getElementById("p-priestley").onclick = function(){ setActivePreset(this); setV("priestley"); };
    document.getElementById("p-engelmann").onclick = function(){ setActivePreset(this); setV("engelmann"); };
    document.getElementById("p-vanniel").onclick = function(){ setActivePreset(this); setV("vanniel"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "priestley"){
      c.innerHTML =
        '<div class="control-group"><label>Jar holds:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-j0">Mouse + candle</button>' +
        '<button class="preset-btn" id="c-j1">+ mint plant</button></div></div>' +
        '<div class="control-group"><label>1770:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Priestley; oxygen found 1774.</div></div>';
      document.getElementById("c-j0").onclick = function(){ mint = false; draw(0); };
      document.getElementById("c-j1").onclick = function(){ mint = true; draw(0); };
    } else if(view === "engelmann"){
      c.innerHTML =
        '<div class="control-group"><label>Spectrum band:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        BANDS.map(function(b, i){ return '<button class="preset-btn" data-bd="' + i + '">' + b[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Setup:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cladophora + aerobic bacteria.</div></div>';
      c.querySelectorAll("[data-bd]").forEach(function(b){ b.onclick = function(){ band = Number(b.dataset.bd); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Donor H2A:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-n0">H2O</button>' +
        '<button class="preset-btn" id="c-n1">H2S</button></div></div>' +
        '<div class="control-group"><label>Equation:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">2H2A + CO2 \u2192 2A + CH2O + H2O.</div></div>';
      document.getElementById("c-n0").onclick = function(){ donor = 0; draw(0); };
      document.getElementById("c-n1").onclick = function(){ donor = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Early Experiments (\u00A711.2)</text>';
    if(view === "priestley"){
      m += '<rect x="220" y="90" width="260" height="140" rx="40" fill="#0f172a" stroke="' + (mint ? "#22c55e" : "#f59e0b") + '" stroke-width="2.5"/>';
      m += '<text x="350" y="140" fill="#94a3b8" font-size="11" text-anchor="middle">mouse + candle</text>';
      if(mint) m += '<text x="350" y="165" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">+ mint plant (sunlight)</text>';
      else m += '<text x="350" y="165" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">air fouled: out + suffocated</text>';
      m += '<text x="350" y="195" fill="#94a3b8" font-size="11" text-anchor="middle">' + (mint ? "mouse lives, candle burns" : "candle dies, mouse suffocates") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Fig. 11.1 \u00B7 Ingenhousz adds: sunlight essential</text>';
      readout(cell("Jar", mint ? "restored" : "fouled", mint ? "#22c55e" : "#f59e0b"));
      verdict(mint ? "Plants restore what breathers/burners remove." : "Burning and breathing damage the air.");
    } else if(view === "engelmann"){
      var b = BANDS[band];
      var cols = ["#3b82f6", "#ef4444", "#22c55e"];
      for(var i = 0; i < 3; i++){
        var x = 130 + i * 150;
        var on = i === band;
        m += '<rect x="' + x + '" y="120" width="130" height="90" rx="8" fill="#0f172a" stroke="' + (on ? cols[i] : "#334155") + '" stroke-width="2.5"/>';
        m += '<text x="' + (x + 65) + '" y="158" fill="' + (on ? cols[i] : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">' + BANDS[i][0] + "</text>";
        m += '<text x="' + (x + 65) + '" y="180" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="9" text-anchor="middle">' + BANDS[i][1] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">First action spectrum \u2248 chl a/b absorption (PDF p. 5)</text>';
      readout(cell("Band", b[0], cols[band]) + cell("Bacteria", b[1], "#94a3b8"));
      verdict(band === 2 ? "Green: little O2 evolved." : b[0] + ": O2 evolution peak.");
    } else {
      var d = DONORS[donor];
      m += '<text x="350" y="120" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">' + d[0] + "</text>";
      m += '<text x="350" y="165" fill="#64748b" font-size="18" text-anchor="middle">\u2192</text>';
      m += '<text x="350" y="205" fill="' + (donor === 0 ? "#22c55e" : "#f59e0b") + '" font-size="14" font-weight="700" text-anchor="middle">' + d[1] + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Byproduct tracks the donor \u2192 O2 comes from H2O (isotopes proved)</text>';
      readout(cell("Donor", d[0], "#38bdf8") + cell("Product", d[1], donor === 0 ? "#22c55e" : "#f59e0b"));
      verdict("van Niel: donor decides the oxidation product.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 3. Chloroplast Labour & Pigment Spectra Lab (pigmentlab) - L3, 11.3-11.4
// -------------------------------------------------------------------------
window.SIMS.pigmentlab = (function(){
  var view = "labour"; // "labour", "spectra", "accessory"
  var site = 0, fig = 2, acc = 0;
  var SITES = [["Membranes", "trap light + ATP/NADPH"], ["Stroma", "enzymatic sugar \u2192 starch"]];
  var FIGS = [["Fig. 11.3a", "chl a absorbs blue + red"], ["Fig. 11.3b", "photosynthesis peaks blue + red"], ["Fig. 11.3c", "overlap NOT one-to-one"]];
  var ACCS = [["Chlorophyll b", "yellow green"], ["Xanthophylls", "yellow"], ["Carotenoids", "yellow-orange"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Membranes / chl a</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Stroma / sugar</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Accessory pigments</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-labour">Labour Split</button>' +
      '<button class="preset-btn" id="p-spectra">Spectra 11.3</button>' +
      '<button class="preset-btn" id="p-accessory">Accessories</button>';
    document.getElementById("p-labour").onclick = function(){ setActivePreset(this); setV("labour"); };
    document.getElementById("p-spectra").onclick = function(){ setActivePreset(this); setV("spectra"); };
    document.getElementById("p-accessory").onclick = function(){ setActivePreset(this); setV("accessory"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "labour"){
      c.innerHTML =
        '<div class="control-group"><label>Site:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-s0">Membranes</button>' +
        '<button class="preset-btn" id="c-s1">Stroma</button></div></div>' +
        '<div class="control-group"><label>Note:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Dark reactions \u2260 darkness.</div></div>';
      document.getElementById("c-s0").onclick = function(){ site = 0; draw(0); };
      document.getElementById("c-s1").onclick = function(){ site = 1; draw(0); };
    } else if(view === "spectra"){
      c.innerHTML =
        '<div class="control-group"><label>Graph:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        FIGS.map(function(f, i){ return '<button class="preset-btn" data-fg="' + i + '">' + f[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Chief:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Chlorophyll a leads.</div></div>';
      c.querySelectorAll("[data-fg]").forEach(function(b){ b.onclick = function(){ fig = Number(b.dataset.fg); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Pigment:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        ACCS.map(function(a, i){ return '<button class="preset-btn" data-ac="' + i + '">' + a[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Jobs:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Transfer energy to chl a; shield it.</div></div>';
      c.querySelectorAll("[data-ac]").forEach(function(b){ b.onclick = function(){ acc = Number(b.dataset.ac); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Site &amp; Pigments (\u00A711.3\u2013\u00A711.4)</text>';
    if(view === "labour"){
      var s = SITES[site];
      m += '<rect x="120" y="110" width="200" height="100" rx="8" fill="#0f172a" stroke="' + (site === 0 ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="220" y="150" fill="' + (site === 0 ? "#38bdf8" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">Membranes</text>';
      m += '<text x="220" y="172" fill="#64748b" font-size="9" text-anchor="middle">trap light + ATP/NADPH</text>';
      m += '<rect x="380" y="110" width="200" height="100" rx="8" fill="#0f172a" stroke="' + (site === 1 ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="480" y="150" fill="' + (site === 1 ? "#22c55e" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">Stroma</text>';
      m += '<text x="480" y="172" fill="#64748b" font-size="9" text-anchor="middle">sugar \u2192 starch</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Grana, stroma lamellae, matrix stroma (Fig. 11.2)</text>';
      readout(cell("Site", s[0], site === 0 ? "#38bdf8" : "#22c55e") + cell("Job", s[1], "#94a3b8"));
      verdict(site === 0 ? "Light reactions: photochemical." : "Carbon reactions: by convention \u2018dark\u2019.");
    } else if(view === "spectra"){
      var f = FIGS[fig];
      m += '<text x="350" y="120" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + f[0] + "</text>";
      m += '<text x="350" y="165" fill="' + (fig === 2 ? "#f59e0b" : "#38bdf8") + '" font-size="13" font-weight="700" text-anchor="middle">' + f[1] + "</text>";
      if(fig === 2) m += '<text x="350" y="205" fill="#94a3b8" font-size="11" text-anchor="middle">accessory pigments fill the gaps</text>';
      else m += '<text x="350" y="205" fill="#94a3b8" font-size="11" text-anchor="middle">chl a chief pigment</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Blue + red lead; some photosynthesis at other wavelengths</text>';
      readout(cell("Graph", f[0], "#38bdf8") + cell("Shows", f[1], fig === 2 ? "#f59e0b" : "#22c55e"));
      verdict(fig === 2 ? "Incomplete overlap = teamwork." : "Peaks coincide at blue and red.");
    } else {
      var a = ACCS[acc];
      m += '<rect x="90" y="130" width="200" height="80" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="190" y="163" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">' + a[0] + "</text>";
      m += '<text x="190" y="183" fill="#64748b" font-size="9" text-anchor="middle">' + a[1] + "</text>";
      m += '<text x="330" y="172" fill="#64748b" font-size="18" text-anchor="middle">\u2192</text>';
      m += '<rect x="370" y="130" width="200" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="470" y="163" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">Chlorophyll a</text>';
      m += '<text x="470" y="183" fill="#64748b" font-size="9" text-anchor="middle">energy + protection</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Wider range (print: photosyntesis) + anti photo-oxidation (PDF p. 8)</text>';
      readout(cell("Accessory", a[0], "#f59e0b") + cell("Colour", a[1], "#94a3b8"));
      verdict("Harvest elsewhere, deliver to chl a.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Z Scheme, Water Splitting & ATP Lab (lightlab) - L4, 11.5-11.6
// -------------------------------------------------------------------------
window.SIMS.lightlab = (function(){
  var view = "z"; // "z", "split", "cyclic"
  var hop = 0, split = false, cyc = false;
  var HOPS = [["PS II + 680 nm", "excite"], ["Acceptor + ETS", "downhill"], ["PS I + 700 nm", "re-excite"], ["NADP+", "NADPH + H+"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Photosystems</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Electron carriers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>NADPH / ATP out</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-z">Z Ride</button>' +
      '<button class="preset-btn" id="p-split">Split Water</button>' +
      '<button class="preset-btn" id="p-cyclic">Cyclic vs Line</button>';
    document.getElementById("p-z").onclick = function(){ setActivePreset(this); setV("z"); };
    document.getElementById("p-split").onclick = function(){ setActivePreset(this); setV("split"); };
    document.getElementById("p-cyclic").onclick = function(){ setActivePreset(this); setV("cyclic"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "z"){
      c.innerHTML =
        '<div class="control-group"><label>Hop:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        HOPS.map(function(h, i){ return '<button class="preset-btn" data-hp="' + i + '">' + h[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Shape:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Characterstic Z on redox scale (print).</div></div>';
      c.querySelectorAll("[data-hp]").forEach(function(b){ b.onclick = function(){ hop = Number(b.dataset.hp); draw(0); }; });
    } else if(view === "split"){
      c.innerHTML =
        '<div class="control-group"><label>Water:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-w0">Whole (lumen side)</button>' +
        '<button class="preset-btn" id="c-w1">Split it</button></div></div>' +
        '<div class="control-group"><label>Equation:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">2H2O \u2192 4H+ + O2 + 4e\u2212.</div></div>';
      document.getElementById("c-w0").onclick = function(){ split = false; draw(0); };
      document.getElementById("c-w1").onclick = function(){ split = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Flow:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-c0">Non-cyclic (II+I)</button>' +
        '<button class="preset-btn" id="c-c1">Cyclic (I only)</button></div></div>' +
        '<div class="control-group"><label>Site:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Stroma lamellae lack PS II.</div></div>';
      document.getElementById("c-c0").onclick = function(){ cyc = false; draw(0); };
      document.getElementById("c-c1").onclick = function(){ cyc = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Light Reaction (\u00A711.5\u2013\u00A711.6)</text>';
    if(view === "z"){
      for(var i = 0; i < 4; i++){
        var x = 45 + i * 160;
        var on = i <= hop;
        m += '<rect x="' + x + '" y="120" width="140" height="95" rx="8" fill="#0f172a" stroke="' + (on ? (i === 3 ? "#22c55e" : "#38bdf8") : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 70) + '" y="155" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="10" font-weight="700" text-anchor="middle">' + HOPS[i][0] + "</text>";
        m += '<text x="' + (x + 70) + '" y="178" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="9" text-anchor="middle">' + HOPS[i][1] + "</text>";
        if(i < 3) m += '<text x="' + (x + 150) + '" y="170" fill="#64748b" font-size="16" text-anchor="middle">' + (i % 2 === 0 ? "\u2197" : "\u2198") + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Electrons not used up en route \u00B7 P680 then P700 (Fig. 11.5)</text>';
      readout(cell("Hop", (hop + 1) + "/4", "#38bdf8") + cell("At", HOPS[hop][0], hop === 3 ? "#22c55e" : "#38bdf8"));
      verdict(hop === 3 ? "NADP+ reduced to NADPH + H+." : "Ride the Z downhill (twice).");
    } else if(view === "split"){
      if(!split){
        m += '<text x="350" y="150" fill="#38bdf8" font-size="16" font-weight="700" text-anchor="middle">2H2O (inner side)</text>';
        m += '<text x="350" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">water splitting complex, PS II</text>';
      } else {
        m += '<text x="200" y="150" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">4H+ (lumen)</text>';
        m += '<text x="350" y="150" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">O2 (net product)</text>';
        m += '<text x="500" y="150" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">4e\u2212 (to PS II)</text>';
        m += '<text x="350" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">protons stay lumen-side \u2192 gradient begins</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">PS I replacements come from PS II (PDF p. 9)</text>';
      readout(cell("Water", split ? "split" : "whole", split ? "#22c55e" : "#38bdf8"));
      verdict(split ? "O2 out; electrons in; protons banked." : "Split water to feed PS II.");
    } else {
      m += '<text x="350" y="110" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + (cyc ? "Cyclic: PS I loops back" : "Non-cyclic: II \u2192 I \u2192 NADP+") + "</text>";
      m += '<text x="350" y="160" fill="' + (cyc ? "#f59e0b" : "#22c55e") + '" font-size="13" font-weight="700" text-anchor="middle">' + (cyc ? "ATP only, no NADPH" : "ATP + NADPH + H+") + "</text>";
      m += '<text x="350" y="200" fill="#94a3b8" font-size="11" text-anchor="middle">' + (cyc ? "Stroma lamellae; also >680 nm light alone" : "Z scheme in series (Fig. 11.5)") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Photophosphorylation: ADP + iP \u2192 ATP in light</text>';
      readout(cell("Flow", cyc ? "cyclic" : "non-cyclic", cyc ? "#f59e0b" : "#22c55e") + cell("Makes", cyc ? "ATP only" : "ATP+NADPH", "#94a3b8"));
      verdict(cyc ? "Loop pays the ATP gap." : "Line mints both currencies.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 5. Calvin Stages & Energy Ledger Lab (calvinlab) - L5, 11.7
// -------------------------------------------------------------------------
window.SIMS.calvinlab = (function(){
  var view = "stages"; // "stages", "bill", "acceptor"
  var stg = 0, per = 0, guess = 0;
  var STGS = [
    ["Carboxylation", "RuBP + CO2 \u2192 2 PGA", "most crucial"],
    ["Reduction", "2 ATP + 2 NADPH", "toward glucose"],
    ["Regeneration", "1 ATP \u2192 RuBP", "uninterrupted"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Calvin stages</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>ATP spent</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Sugar out</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-stages">Three Stages</button>' +
      '<button class="preset-btn" id="p-bill">Glucose Bill</button>' +
      '<button class="preset-btn" id="p-acceptor">Acceptor Hunt</button>';
    document.getElementById("p-stages").onclick = function(){ setActivePreset(this); setV("stages"); };
    document.getElementById("p-bill").onclick = function(){ setActivePreset(this); setV("bill"); };
    document.getElementById("p-acceptor").onclick = function(){ setActivePreset(this); setV("acceptor"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "stages"){
      c.innerHTML =
        '<div class="control-group"><label>Stage:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        STGS.map(function(s, i){ return '<button class="preset-btn" data-sg="' + i + '">' + s[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Cycle:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">RuBP regenerated; all plants.</div></div>';
      c.querySelectorAll("[data-sg]").forEach(function(b){ b.onclick = function(){ stg = Number(b.dataset.sg); draw(0); }; });
    } else if(view === "bill"){
      c.innerHTML =
        '<div class="control-group"><label>Bill for:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-b0">One CO2</button>' +
        '<button class="preset-btn" id="c-b1">One glucose</button></div></div>' +
        '<div class="control-group"><label>Gap:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">3 ATP vs 2 NADPH \u2192 cyclic top-up.</div></div>';
      document.getElementById("c-b0").onclick = function(){ per = 0; draw(0); };
      document.getElementById("c-b1").onclick = function(){ per = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Hypothesis:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-g0">2-carbon (years lost)</button>' +
        '<button class="preset-btn" id="c-g1">5-carbon RuBP (answer)</button></div></div>' +
        '<div class="control-group"><label>Type:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">RuBP: 5-carbon ketose sugar.</div></div>';
      document.getElementById("c-g0").onclick = function(){ guess = 0; draw(0); };
      document.getElementById("c-g1").onclick = function(){ guess = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Calvin Cycle (\u00A711.7)</text>';
    if(view === "stages"){
      var s = STGS[stg];
      for(var i = 0; i < 3; i++){
        var x = 70 + i * 190;
        var on = i === stg;
        m += '<rect x="' + x + '" y="110" width="170" height="100" rx="8" fill="#0f172a" stroke="' + (on ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 85) + '" y="145" fill="' + (on ? "#38bdf8" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">' + STGS[i][0] + "</text>";
        m += '<text x="' + (x + 85) + '" y="168" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="9" text-anchor="middle">' + STGS[i][1] + "</text>";
        m += '<text x="' + (x + 85) + '" y="186" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="9" text-anchor="middle">' + STGS[i][2] + "</text>";
        if(i < 2) m += '<text x="' + (x + 180) + '" y="162" fill="#64748b" font-size="16" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Fig. 11.8 \u00B7 carboxylation most crucial (PDF pp. 13–14)</text>';
      readout(cell("Stage", s[0], "#38bdf8") + cell("Costs", s[1], "#f59e0b"));
      verdict(s[0] + ": " + s[2] + ".");
    } else if(view === "bill"){
      var atp = per === 0 ? "3 ATP" : "18 ATP", nad = per === 0 ? "2 NADPH" : "12 NADPH";
      m += '<text x="350" y="100" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + (per === 0 ? "Per CO2 fixed" : "Per glucose (6 turns)") + "</text>";
      m += '<rect x="170" y="130" width="150" height="80" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<text x="245" y="172" fill="#f59e0b" font-size="16" font-weight="700" text-anchor="middle">' + atp + "</text>";
      m += '<rect x="380" y="130" width="150" height="80" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<text x="455" y="172" fill="#22c55e" font-size="16" font-weight="700" text-anchor="middle">' + nad + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">In/Out table, PDF p. 15 \u00B7 out: glucose + ADP + NADP</text>';
      readout(cell("ATP", atp, "#f59e0b") + cell("NADPH", nad, "#22c55e"));
      verdict(per === 0 ? "The per-CO2 price." : "Six turns, one glucose.");
    } else {
      m += '<text x="350" y="120" fill="' + (guess === 0 ? "#ef4444" : "#22c55e") + '" font-size="15" font-weight="700" text-anchor="middle">' + (guess === 0 ? "2-carbon compound?" : "RuBP: 5-carbon ketose") + "</text>";
      m += '<text x="350" y="165" fill="#94a3b8" font-size="12" text-anchor="middle">' + (guess === 0 ? "C3 \u2212 C1 looked like C2 \u2014 years hunting" : "Unexpected answer \u2014 C5 + C1 \u2192 split to 2\u00D7C3") + "</text>";
      m += '<text x="350" y="205" fill="#94a3b8" font-size="11" text-anchor="middle">' + (guess === 0 ? "Never found: wrong arithmetic" : "Primary CO2 acceptor (PDF p. 13)") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Scientists took long + many experiments (\u00A711.7.1)</text>';
      readout(cell("Guess", guess === 0 ? "C2 (wrong)" : "RuBP C5 (right)", guess === 0 ? "#ef4444" : "#22c55e"));
      verdict(guess === 0 ? "Neat subtraction misled decades." : "The surprising 5-carbon acceptor.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. Kranz Anatomy & CO2 Pump Lab (c4lab) - L6, 11.8-11.9
// -------------------------------------------------------------------------
window.SIMS.c4lab = (function(){
  var view = "kranz"; // "kranz", "hatch", "mode"
  var pick = 1, step = 0, ratio = 0;
  var CELLS = [["Mesophyll", "PEPcase, no RuBisCO"], ["Bundle sheath", "RuBisCO-rich, no PEPcase"]];
  var STEPS = [
    ["Mesophyll fix", "PEP + CO2 \u2192 OAA \u2192 C4 acids"],
    ["Shuttle", "C4 acids \u2192 bundle sheath"],
    ["Release + Calvin", "CO2 out \u2192 Calvin; 3C back \u2192 PEP"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Mesophyll cells</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Bundle sheath (Kranz)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>CO2 pool</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-kranz">Wreath Tour</button>' +
      '<button class="preset-btn" id="p-hatch">Hatch-Slack</button>' +
      '<button class="preset-btn" id="p-mode">RuBisCO Mode</button>';
    document.getElementById("p-kranz").onclick = function(){ setActivePreset(this); setV("kranz"); };
    document.getElementById("p-hatch").onclick = function(){ setActivePreset(this); setV("hatch"); };
    document.getElementById("p-mode").onclick = function(){ setActivePreset(this); setV("mode"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "kranz"){
      c.innerHTML =
        '<div class="control-group"><label>Cell:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-x0">Mesophyll</button>' +
        '<button class="preset-btn" id="c-x1">Bundle sheath</button></div></div>' +
        '<div class="control-group"><label>Section:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cut maize/sorghum; look for the wreath.</div></div>';
      document.getElementById("c-x0").onclick = function(){ pick = 0; draw(0); };
      document.getElementById("c-x1").onclick = function(){ pick = 1; draw(0); };
    } else if(view === "hatch"){
      c.innerHTML =
        '<div class="control-group"><label>Step:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        STEPS.map(function(s, i){ return '<button class="preset-btn" data-hs="' + i + '">' + s[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Loop:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cyclic: 3C returns as PEP.</div></div>';
      c.querySelectorAll("[data-hs]").forEach(function(b){ b.onclick = function(){ step = Number(b.dataset.hs); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>CO2:O2 at enzyme:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-m0">Nearly equal</button>' +
        '<button class="preset-btn" id="c-m1">CO2 loaded (C4)</button></div></div>' +
        '<div class="control-group"><label>Binding:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Competitive; concentration decides.</div></div>';
      document.getElementById("c-m0").onclick = function(){ ratio = 0; draw(0); };
      document.getElementById("c-m1").onclick = function(){ ratio = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">C4 &amp; Photorespiration (\u00A711.8\u2013\u00A711.9)</text>';
    if(view === "kranz"){
      var cl = CELLS[pick];
      m += '<circle cx="350" cy="165" r="26" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>';
      m += '<text x="350" y="169" fill="#94a3b8" font-size="9" text-anchor="middle">vein</text>';
      for(var i = 0; i < 8; i++){
        var ang = i * Math.PI / 4;
        var wx = 350 + 62 * Math.cos(ang), wy = 165 + 62 * Math.sin(ang);
        m += '<circle cx="' + wx + '" cy="' + wy + '" r="24" fill="#0f172a" stroke="' + (pick === 1 ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
      }
      if(pick === 0){
        for(var j = 0; j < 6; j++){
          var mx = 150 + j * 80;
          m += '<rect x="' + mx + '" y="70" width="60" height="30" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        }
        m += '<text x="350" y="90" fill="#38bdf8" font-size="10" text-anchor="middle">mesophyll ring</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + cl[0] + ": " + cl[1] + " \u00B7 \u2018Kranz\u2019 = \u2018wreath\u2019 (PDF p. 15)</text>";
      readout(cell("Cell", cl[0], pick === 1 ? "#22c55e" : "#38bdf8") + cell("Enzymes", cl[1], "#94a3b8"));
      verdict(pick === 1 ? "Sheath: layered, chloroplast-rich, sealed." : "Mesophyll: first fixation, no RuBisCO.");
    } else if(view === "hatch"){
      var sp = STEPS[step];
      for(var k = 0; k < 3; k++){
        var kx = 70 + k * 190;
        var on = k === step;
        m += '<rect x="' + kx + '" y="110" width="170" height="100" rx="8" fill="#0f172a" stroke="' + (on ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (kx + 85) + '" y="145" fill="' + (on ? "#22c55e" : "#475569") + '" font-size="10" font-weight="700" text-anchor="middle">' + STEPS[k][0] + "</text>";
        m += '<text x="' + (kx + 85) + '" y="170" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="8" text-anchor="middle">' + STEPS[k][1] + "</text>";
        if(k < 2) m += '<text x="' + (kx + 180) + '" y="162" fill="#64748b" font-size="16" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Hatch and Slack Pathway, cyclic (Fig. 11.9)</text>';
      readout(cell("Step", sp[0], "#22c55e") + cell("Moves", sp[1], "#94a3b8"));
      verdict("Pump CO2 to the sheltered Calvin.");
    } else {
      m += '<text x="350" y="120" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">RuBisCO active site: CO2 vs O2</text>';
      m += '<text x="350" y="165" fill="' + (ratio === 0 ? "#f59e0b" : "#22c55e") + '" font-size="14" font-weight="700" text-anchor="middle">' + (ratio === 0 ? "Some O2 binds \u2192 photorespiration" : "CO2 floods site \u2192 carboxylase wins") + "</text>";
      m += '<text x="350" y="205" fill="#94a3b8" font-size="11" text-anchor="middle">' + (ratio === 0 ? "RuBP + O2 \u2192 PGA + phosphoglycolate (waste)" : "Minimal oxygenase \u2192 yields up, heat tolerated") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Most abundant enzyme in the world (\u00A711.9)</text>';
      readout(cell("Ratio", ratio === 0 ? "near equal" : "CO2 loaded", ratio === 0 ? "#f59e0b" : "#22c55e") + cell("Mode", ratio === 0 ? "mixed" : "carboxylase", "#94a3b8"));
      verdict(ratio === 0 ? "C3: wasteful oxygenase leaks in." : "C4: pump rigs the competition.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 7. Limiting Factors & Rate Curves Lab (factorlab) - L7, 11.10 + Summary
// -------------------------------------------------------------------------
window.SIMS.factorlab = (function(){
  var view = "curve"; // "curve", "co2", "blackman"
  var pt = 0, high = false, warm = false;
  var PTS = [
    ["A", "linear: light limits"],
    ["B", "linear: light limits"],
    ["C", "saturation point"],
    ["D", "plateau: others limit"],
    ["E", "chlorophyll breakdown"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Light limits</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Saturated / plateau</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Breakdown</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-curve">Fig 11.10 Curve</button>' +
      '<button class="preset-btn" id="p-co2">CO2 Saturation</button>' +
      '<button class="preset-btn" id="p-blackman">Blackman Demo</button>';
    document.getElementById("p-curve").onclick = function(){ setActivePreset(this); setV("curve"); };
    document.getElementById("p-co2").onclick = function(){ setActivePreset(this); setV("co2"); };
    document.getElementById("p-blackman").onclick = function(){ setActivePreset(this); setV("blackman"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "curve"){
      c.innerHTML =
        '<div class="control-group"><label>Point:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        PTS.map(function(p, i){ return '<button class="preset-btn" data-pt="' + i + '">' + p[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Saturation:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">10 per cent of full sunlight.</div></div>';
      c.querySelectorAll("[data-pt]").forEach(function(b){ b.onclick = function(){ pt = Number(b.dataset.pt); draw(0); }; });
    } else if(view === "co2"){
      c.innerHTML =
        '<div class="control-group"><label>Light:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-l0">Low light</button>' +
        '<button class="preset-btn" id="c-l1">High light</button></div></div>' +
        '<div class="control-group"><label>Air:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">0.03\u20130.04%; C4 ~360, C3 >450.</div></div>';
      document.getElementById("c-l0").onclick = function(){ high = false; draw(0); };
      document.getElementById("c-l1").onclick = function(){ high = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Temperature:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-t0">Very low</button>' +
        '<button class="preset-btn" id="c-t1">Optimal</button></div></div>' +
        '<div class="control-group"><label>Others:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Green leaf + light + CO2 optimal.</div></div>';
      document.getElementById("c-t0").onclick = function(){ warm = false; draw(0); };
      document.getElementById("c-t1").onclick = function(){ warm = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Factors (\u00A711.10 + Summary)</text>';
    if(view === "curve"){
      var p = PTS[pt];
      m += '<line x1="120" y1="250" x2="600" y2="250" stroke="#64748b" stroke-width="1.5"/>';
      m += '<line x1="120" y1="250" x2="120" y2="70" stroke="#64748b" stroke-width="1.5"/>';
      m += '<text x="600" y="268" fill="#94a3b8" font-size="10" text-anchor="middle">light intensity</text>';
      m += '<text x="60" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">rate</text>';
      m += '<path d="M130,245 L250,170 L350,120 L480,115 L570,160" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      var cols = ["#22c55e", "#22c55e", "#f59e0b", "#f59e0b", "#ef4444"];
      var px = [180, 290, 350, 480, 570], py = [210, 145, 120, 115, 160];
      var pl = ["A", "B", "C", "D", "E"];
      for(var i = 0; i < 5; i++){
        var on = i === pt;
        m += '<circle cx="' + px[i] + '" cy="' + py[i] + '" r="' + (on ? 9 : 5) + '" fill="' + cols[i] + '" stroke="#0f172a" stroke-width="2"/>';
        m += '<text x="' + px[i] + '" y="' + (py[i] - 14) + '" fill="' + cols[i] + '" font-size="' + (on ? 13 : 10) + '" font-weight="700" text-anchor="middle">' + pl[i] + "</text>";
      }
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">Figure 11.10 \u00B7 now at ' + p[0] + ": " + p[1] + "</text>";
      readout(cell("Point", p[0], cols[pt]) + cell("Means", p[1], "#94a3b8"));
      verdict(pt <= 1 ? "Light is the limiting factor." : pt <= 3 ? "Light saturated; others limit." : "Excess light destroys chlorophyll.");
    } else if(view === "co2"){
      m += '<text x="350" y="100" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">' + (high ? "High light: both respond to CO2" : "Low light: neither responds to CO2") + "</text>";
      m += '<rect x="140" y="130" width="180" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="230" y="163" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">C4 saturates</text>';
      m += '<text x="230" y="185" fill="#94a3b8" font-size="11" text-anchor="middle">~360 \u00B5lL-1</text>';
      m += '<rect x="380" y="130" width="180" height="80" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="470" y="163" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">C3 saturates</text>';
      m += '<text x="470" y="185" fill="#94a3b8" font-size="11" text-anchor="middle">beyond 450 \u00B5lL-1</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + (high ? "Current air limits C3 \u00B7 greenhouses enrich (tomatoes, bell pepper)" : "Light holds the brake for both groups") + "</text>";
      readout(cell("Light", high ? "high" : "low", high ? "#22c55e" : "#94a3b8") + cell("C4/C3", "360 / >450", "#38bdf8"));
      verdict(high ? "C4 done at 360; C3 hungry past 450." : "CO2 cannot help in dim light.");
    } else {
      m += '<circle cx="350" cy="160" r="55" fill="#0f172a" stroke="' + (warm ? "#22c55e" : "#64748b") + '" stroke-width="2.5"/>';
      m += '<text x="350" y="155" fill="' + (warm ? "#22c55e" : "#64748b") + '" font-size="12" font-weight="700" text-anchor="middle">' + (warm ? "fixing CO2" : "stalled") + "</text>";
      m += '<text x="350" y="175" fill="#64748b" font-size="10" text-anchor="middle">' + (warm ? "optimal T" : "very low T") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Blackman 1905: nearest-minimum factor sets the rate</text>';
      readout(cell("Temperature", warm ? "optimal" : "very low", warm ? "#22c55e" : "#94a3b8") + cell("Rate", warm ? "runs" : "zero", warm ? "#22c55e" : "#ef4444"));
      verdict(warm ? "Warmed leaf photosynthesises." : "Cold leaf stalls despite light + CO2.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-110 -
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
