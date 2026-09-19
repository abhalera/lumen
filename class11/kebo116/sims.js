// kebo116 interactive simulations: Excretory Products and their Elimination (Ch. 16, print pp. 205-216)
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
// 1. Waste Mode Sorter (wastelab) - L1, Introduction
// -------------------------------------------------------------------------
window.SIMS.wastelab = (function(){
  var view = "modes"; // "modes", "water", "organs"
  var mode = 2;
  var MODES = [
    ["AMMONOTELIC", "bony fishes", "aquatic amphibians", "aquatic insects"],
    ["UREOTELIC", "mammals", "terrestrial amphibians", "marine fishes"],
    ["URICOTELIC", "reptiles, birds", "land snails", "insects"]
  ];
  var MCOL = ["#ef4444", "#f59e0b", "#22c55e"];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Ammonia</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Urea</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Uric acid</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-modes">Waste Modes</button>' +
      '<button class="preset-btn" id="p-water">Water Ladder</button>' +
      '<button class="preset-btn" id="p-organs">Organ Survey</button>';
    document.getElementById("p-modes").onclick = function(){ setActivePreset(this); setV("modes"); };
    document.getElementById("p-water").onclick = function(){ setActivePreset(this); setV("water"); };
    document.getElementById("p-organs").onclick = function(){ setActivePreset(this); setV("organs"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "modes"){
      c.innerHTML =
        '<div class="control-group"><label>Mode:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        MODES.map(function(m, i){ return '<button class="preset-btn" data-md="' + i + '">' + m[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Water decides the waste (PDF p. 1).</div></div>';
      c.querySelectorAll("[data-md]").forEach(function(b){ b.onclick = function(){ mode = Number(b.dataset.md); draw(0); }; });
    } else if(view === "water"){
      c.innerHTML =
        '<div class="control-group"><label>Ladder:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Ammonia most water, uric acid least.</div></div>' +
        '<div class="control-group"><label>Trade:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Liver conversion saves water (PDF p. 1).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Chain:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Flame cells to kidneys (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Simpler:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Invertebrates: simple tubular forms.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Wastes (Introduction)</text>';
    if(view === "modes"){
      for(var i = 0; i < 3; i++){
        var on = i === mode;
        var px = 90 + i * 180;
        m += '<rect x="' + px + '" y="100" width="160" height="130" rx="8" fill="#0f172a" stroke="' + (on ? MCOL[i] : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (px + 80) + '" y="128" fill="' + (on ? MCOL[i] : "#475569") + '" font-size="10.5" font-weight="700" text-anchor="middle">' + MODES[i][0] + "</text>";
        for(var j = 1; j <= 3; j++){
          m += '<text x="' + (px + 80) + '" y="' + (128 + j * 26) + '" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="9" text-anchor="middle">' + MODES[i][j] + "</text>";
        }
      }
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">Ammonotelism: the process of excreting ammonia (PDF p. 1)</text>';
      readout(cell("Most toxic", "ammonia needs most water", "#ef4444") + cell("Least toxic", "uric acid, minimum water", "#22c55e"));
      verdict("Water decides the waste.");
    } else if(view === "water"){
      var rows = [
        ["ammonia", "most toxic", "large amount of water", "#ef4444"],
        ["urea", "liver-made", "kidneys excrete it out", "#f59e0b"],
        ["uric acid", "least toxic", "pellet or paste, minimum loss", "#22c55e"]
      ];
      for(var r = 0; r < 3; r++){
        var ry = 96 + r * 58;
        m += '<rect x="150" y="' + ry + '" width="400" height="48" rx="8" fill="#0f172a" stroke="' + rows[r][3] + '" stroke-width="2"/>';
        m += '<text x="350" y="' + (ry + 29) + '" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">' + rows[r][0] + " · " + rows[r][1] + " · " + rows[r][2] + "</text>";
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">terrestrial adaptation: conservation of water (PDF p. 1)</text>';
      readout(cell("Ammonia", "large amount of water", "#ef4444") + cell("Uric acid", "pellet or paste, minimum loss", "#22c55e"));
      verdict("Less water, safer waste.");
    } else {
      var nodes = ["flame cells", "nephridia", "Malpighian tubules", "green glands", "kidneys"];
      var subs = ["Planaria, Amphioxus", "earthworm", "cockroach", "prawn", "vertebrates"];
      for(var n = 0; n < 5; n++){
        var nx = 40 + n * 128;
        m += '<rect x="' + nx + '" y="130" width="118" height="80" rx="8" fill="#0f172a" stroke="' + (n === 4 ? "#22c55e" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (nx + 59) + '" y="163" fill="#f8fafc" font-size="8.5" font-weight="700" text-anchor="middle">' + nodes[n] + "</text>";
        m += '<text x="' + (nx + 59) + '" y="185" fill="#64748b" font-size="8" text-anchor="middle">' + subs[n] + "</text>";
        if(n < 4) m += '<text x="' + (nx + 123) + '" y="175" fill="#64748b" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">simple tubular forms to complex tubular organs</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">osmoregulation: ionic and fluid volume regulation (PDF p. 2)</text>';
      readout(cell("Simplest", "flame cells in Planaria", "#38bdf8") + cell("Complex", "kidneys in vertebrates", "#22c55e"));
      verdict("Tubes grow into kidneys.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. Nephron Pathfinder (nephrolab) - L2, 16.1
// -------------------------------------------------------------------------
window.SIMS.nephrolab = (function(){
  var view = "kidney"; // "kidney", "nephron", "types"
  var ntype = 1;

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Kidney</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Glomerulus</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Tubule</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-kidney">Kidney</button>' +
      '<button class="preset-btn" id="p-nephron">Nephron Path</button>' +
      '<button class="preset-btn" id="p-types">Two Types</button>';
    document.getElementById("p-kidney").onclick = function(){ setActivePreset(this); setV("kidney"); };
    document.getElementById("p-nephron").onclick = function(){ setActivePreset(this); setV("nephron"); };
    document.getElementById("p-types").onclick = function(){ setActivePreset(this); setV("types"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "kidney"){
      c.innerHTML =
        '<div class="control-group"><label>Measure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">10-12 cm, 120-170 g (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figures 16.1-16.2 urinary system.</div></div>';
    } else if(view === "nephron"){
      c.innerHTML =
        '<div class="control-group"><label>Units:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Nearly one million per kidney.</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figures 16.3-16.4 nephron.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Type:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-t0">Cortical</button>' +
        '<button class="preset-btn" id="c-t1">Juxta medullary</button></div></div>' +
        '<div class="control-group"><label>Vessel:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Vasa recta follows deep loops.</div></div>';
      document.getElementById("c-t0").onclick = function(){ ntype = 0; draw(0); };
      document.getElementById("c-t1").onclick = function(){ ntype = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Kidney (§16.1)</text>';
    if(view === "kidney"){
      m += '<rect x="80" y="100" width="250" height="130" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="205" y="130" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">reddish brown, bean shaped</text>';
      m += '<text x="205" y="155" fill="#f8fafc" font-size="11" text-anchor="middle">10-12 cm · 5-7 cm · 2-3 cm</text>';
      m += '<text x="205" y="178" fill="#f8fafc" font-size="11" text-anchor="middle">average weight 120-170 g</text>';
      m += '<text x="205" y="201" fill="#94a3b8" font-size="10" text-anchor="middle">last thoracic to third lumbar</text>';
      m += '<rect x="370" y="100" width="250" height="130" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="495" y="130" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">hilum → renal pelvis</text>';
      m += '<text x="495" y="155" fill="#f8fafc" font-size="11" text-anchor="middle">cortex + medullary pyramids</text>';
      m += '<text x="495" y="178" fill="#f8fafc" font-size="11" text-anchor="middle">renal columns: Columns of Bertini</text>';
      m += '<text x="495" y="201" fill="#94a3b8" font-size="10" text-anchor="middle">calyces (sing.: calyx)</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">kidneys, ureters, bladder, urethra (PDF p. 2)</text>';
      readout(cell("Size", "10-12 cm, 120-170 g", "#f59e0b") + cell("Zones", "cortex + medullary pyramids", "#94a3b8"));
      verdict("Bean with a million tubes.");
    } else if(view === "nephron"){
      var segs = ["glomerulus", "Bowman’s capsule", "PCT", "Henle’s loop", "DCT", "collecting duct"];
      for(var i = 0; i < 6; i++){
        var sx = 30 + i * 108;
        m += '<rect x="' + sx + '" y="140" width="100" height="62" rx="8" fill="#0f172a" stroke="' + (i === 0 ? "#ef4444" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (sx + 50) + '" y="176" fill="#f8fafc" font-size="8.5" font-weight="700" text-anchor="middle">' + segs[i] + "</text>";
        if(i < 5) m += '<text x="' + (sx + 104) + '" y="175" fill="#64748b" font-size="13" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">nearly one million functional units per kidney</text>';
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">glomerulus alongwith Bowman’s capsule = malpighian body (PDF p. 3)</text>';
      readout(cell("Start", "malpighian body", "#ef4444") + cell("End", "collecting duct", "#38bdf8"));
      verdict("Capsule to collecting duct.");
    } else {
      var cort = ntype === 0;
      m += '<rect x="80" y="100" width="250" height="130" rx="8" fill="#0f172a" stroke="' + (cort ? "#38bdf8" : "#334155") + '" stroke-width="2.5"/>';
      m += '<text x="205" y="132" fill="' + (cort ? "#38bdf8" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">CORTICAL (majority)</text>';
      m += '<text x="205" y="160" fill="#64748b" font-size="10" text-anchor="middle">loop too short, little medulla</text>';
      m += '<text x="205" y="183" fill="#64748b" font-size="10" text-anchor="middle">vasa recta absent or reduced</text>';
      m += '<text x="205" y="206" fill="#64748b" font-size="10" text-anchor="middle">corpuscle, PCT, DCT cortical</text>';
      m += '<rect x="370" y="100" width="250" height="130" rx="8" fill="#0f172a" stroke="' + (!cort ? "#f59e0b" : "#334155") + '" stroke-width="2.5"/>';
      m += '<text x="495" y="132" fill="' + (!cort ? "#f59e0b" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">JUXTA MEDULLARY</text>';
      m += '<text x="495" y="160" fill="#64748b" font-size="10" text-anchor="middle">loop very long, runs deep</text>';
      m += '<text x="495" y="183" fill="#64748b" font-size="10" text-anchor="middle">‘U’ shaped vasa recta alongside</text>';
      m += '<text x="495" y="206" fill="#64748b" font-size="10" text-anchor="middle">peritubular capillaries + recta</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">loop of Henle dips into the medulla (PDF p. 4)</text>';
      readout(cell("Cortical", "short loop, vasa recta reduced", "#38bdf8") + cell("Juxta medullary", "long loop deep, vasa recta", "#f59e0b"));
      verdict("Deep loops keep the gradient.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 3. Filtration & GFR Bench (filterlab) - L3, 16.2
// -------------------------------------------------------------------------
window.SIMS.filterlab = (function(){
  var view = "layers"; // "layers", "gfr", "jga"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Blood</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Filtrate</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Rescue</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-layers">3 Layers</button>' +
      '<button class="preset-btn" id="p-gfr">GFR Numbers</button>' +
      '<button class="preset-btn" id="p-jga">JGA Rescue</button>';
    document.getElementById("p-layers").onclick = function(){ setActivePreset(this); setV("layers"); };
    document.getElementById("p-gfr").onclick = function(){ setActivePreset(this); setV("gfr"); };
    document.getElementById("p-jga").onclick = function(){ setActivePreset(this); setV("jga"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "layers"){
      c.innerHTML =
        '<div class="control-group"><label>Drive:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Glomerular capillary blood pressure.</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 16.4 malpighian body.</div></div>';
    } else if(view === "gfr"){
      c.innerHTML =
        '<div class="control-group"><label>Rate:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">125 ml every minute, all day.</div></div>' +
        '<div class="control-group"><label>Return:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Nearly 99 per cent reabsorbed.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Spot:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">DCT meets afferent arteriole.</div></div>' +
        '<div class="control-group"><label>Trigger:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">A fall in GFR (PDF p. 5).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Filtration (§16.2)</text>';
    if(view === "layers"){
      var layers = ["1. endothelium of glomerular vessels", "2. basement membrane", "3. Bowman’s epithelium: podocytes, slit pores"];
      for(var i = 0; i < 3; i++){
        var ly = 96 + i * 52;
        m += '<rect x="170" y="' + ly + '" width="360" height="44" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="350" y="' + (ly + 28) + '" fill="#f8fafc" font-size="10.5" font-weight="700" text-anchor="middle">' + layers[i] + "</text>";
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">ultra filtration: almost all except proteins pass (PDF p. 4)</text>';
      readout(cell("Pass", "almost all except proteins", "#22c55e") + cell("Stay", "proteins", "#ef4444"));
      verdict("Proteins stay back.");
    } else if(view === "gfr"){
      var nums = ["1100-1200 ml blood/min", "125 ml/minute GFR", "180 litres per day", "1.5 litres urine"];
      for(var j = 0; j < 4; j++){
        var nx = 50 + j * 155;
        m += '<rect x="' + nx + '" y="130" width="140" height="80" rx="8" fill="#0f172a" stroke="' + (j === 1 ? "#f59e0b" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (nx + 70) + '" y="165" fill="' + (j === 1 ? "#f59e0b" : "#f8fafc") + '" font-size="9.5" font-weight="700" text-anchor="middle">' + nums[j] + "</text>";
        m += '<text x="' + (nx + 70) + '" y="186" fill="#64748b" font-size="8" text-anchor="middle">' + (j === 0 ? "1/5th of ventricle" : j === 1 ? "filtrate per minute" : j === 2 ? "filtered daily" : "released daily") + "</text>";
        if(j < 3) m += '<text x="' + (nx + 147) + '" y="175" fill="#64748b" font-size="15" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">nearly 99 per cent reabsorbed by tubules (PDF p. 5)</text>';
      readout(cell("GFR", "125 ml/minute", "#38bdf8") + cell("Per day", "180 litres per day", "#94a3b8"));
      verdict("180 litres in, 1.5 out.");
    } else {
      var steps = ["fall in GFR", "JG cells", "renin released", "blood flow up", "GFR normal"];
      for(var s = 0; s < 5; s++){
        var sx = 36 + s * 128;
        m += '<rect x="' + sx + '" y="140" width="118" height="64" rx="8" fill="#0f172a" stroke="' + (s === 4 ? "#22c55e" : "#f59e0b") + '" stroke-width="2"/>';
        m += '<text x="' + (sx + 59) + '" y="176" fill="#f8fafc" font-size="9" font-weight="700" text-anchor="middle">' + steps[s] + "</text>";
        if(s < 4) m += '<text x="' + (sx + 123) + '" y="175" fill="#64748b" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">juxta glomerular apparatus: DCT + afferent arteriole</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">built-in regulation of GFR (PDF p. 5)</text>';
      readout(cell("Sensor", "juxta glomerular apparatus", "#f59e0b") + cell("Fix", "renin restores GFR", "#22c55e"));
      verdict("JG cells rescue GFR.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Tubule Segment Bench (tubulelab) - L4, 16.3
// -------------------------------------------------------------------------
window.SIMS.tubulelab = (function(){
  var view = "pct"; // "pct", "henle", "dct"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Reabsorb</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Water</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Electrolytes</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pct">PCT</button>' +
      '<button class="preset-btn" id="p-henle">Henle Split</button>' +
      '<button class="preset-btn" id="p-dct">DCT + Duct</button>';
    document.getElementById("p-pct").onclick = function(){ setActivePreset(this); setV("pct"); };
    document.getElementById("p-henle").onclick = function(){ setActivePreset(this); setV("henle"); };
    document.getElementById("p-dct").onclick = function(){ setActivePreset(this); setV("dct"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "pct"){
      c.innerHTML =
        '<div class="control-group"><label>Lining:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Simple cuboidal brush border.</div></div>' +
        '<div class="control-group"><label>Share:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">70-80 per cent electrolytes + water.</div></div>';
    } else if(view === "henle"){
      c.innerHTML =
        '<div class="control-group"><label>Down:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Water leaves, filtrate thickens.</div></div>' +
        '<div class="control-group"><label>Up:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Electrolytes leave, filtrate dilutes.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Mode:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Conditional, not bulk (PDF p. 5).</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 16.5 segment map.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Tubules (§16.3)</text>';
    if(view === "pct"){
      m += '<rect x="150" y="96" width="400" height="140" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<text x="350" y="128" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">PCT: simple cuboidal brush border</text>';
      m += '<text x="350" y="156" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">nearly all nutrients + 70-80 per cent water, salts</text>';
      m += '<text x="350" y="182" fill="#f8fafc" font-size="11" text-anchor="middle">H+ and ammonia out · HCO3– in (pH balance)</text>';
      m += '<text x="350" y="208" fill="#94a3b8" font-size="10" text-anchor="middle">surface area raised for reabsorption</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">major site of reabsorption (PDF p. 5)</text>';
      readout(cell("Reclaim", "70-80 per cent + nutrients", "#22c55e") + cell("Surface", "brush border epithelium", "#94a3b8"));
      verdict("PCT reclaims the bulk.");
    } else if(view === "henle"){
      m += '<path d="M250,100 L250,210 Q250,240 300,240 Q350,240 350,210 L350,100" fill="none" stroke="#38bdf8" stroke-width="6"/>';
      m += '<rect x="120" y="110" width="110" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="175" y="138" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">DESCENDING</text>';
      m += '<text x="175" y="158" fill="#f8fafc" font-size="9" text-anchor="middle">water out</text>';
      m += '<text x="175" y="174" fill="#64748b" font-size="8.5" text-anchor="middle">filtrate thickens</text>';
      m += '<rect x="370" y="110" width="110" height="80" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="425" y="138" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">ASCENDING</text>';
      m += '<text x="425" y="158" fill="#f8fafc" font-size="9" text-anchor="middle">salt out, water blocked</text>';
      m += '<text x="425" y="174" fill="#64748b" font-size="8.5" text-anchor="middle">filtrate dilutes</text>';
      m += '<text x="520" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">reabsorption minimum</text>';
      m += '<text x="520" y="168" fill="#94a3b8" font-size="10" text-anchor="middle">in ascending limb</text>';
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">hairpin sets medullary osmolarity (PDF p. 5)</text>';
      readout(cell("Descending", "water out, filtrate thickens", "#38bdf8") + cell("Ascending", "salt out, water blocked", "#f59e0b"));
      verdict("Down thick, up thin.");
    } else {
      m += '<rect x="80" y="100" width="250" height="130" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="205" y="130" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">DCT: conditional</text>';
      m += '<text x="205" y="156" fill="#f8fafc" font-size="10.5" text-anchor="middle">Na+ and water as needed</text>';
      m += '<text x="205" y="179" fill="#f8fafc" font-size="10.5" text-anchor="middle">HCO3– in · H+, K+, NH3 out</text>';
      m += '<text x="205" y="202" fill="#94a3b8" font-size="9.5" text-anchor="middle">sodium-potassium balance</text>';
      m += '<rect x="370" y="100" width="250" height="130" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="495" y="130" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">COLLECTING DUCT</text>';
      m += '<text x="495" y="156" fill="#f8fafc" font-size="10.5" text-anchor="middle">large water volumes out</text>';
      m += '<text x="495" y="179" fill="#f8fafc" font-size="10.5" text-anchor="middle">urea passes to interstitium</text>';
      m += '<text x="495" y="202" fill="#94a3b8" font-size="9.5" text-anchor="middle">H+ and K+ secreted</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">cortex to inner medulla (PDF p. 6)</text>';
      readout(cell("DCT", "conditional Na+ and water", "#38bdf8") + cell("Duct", "water + urea + H+/K+", "#22c55e"));
      verdict("Fine-tune at the end.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 5. Counter Current Rig (counterlab) - L5, 16.4
// -------------------------------------------------------------------------
window.SIMS.counterlab = (function(){
  var view = "flows"; // "flows", "gradient", "urea"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Filtrate</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Blood</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Salt + urea</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-flows">Two Currents</button>' +
      '<button class="preset-btn" id="p-gradient">300 to 1200</button>' +
      '<button class="preset-btn" id="p-urea">NaCl + Urea</button>';
    document.getElementById("p-flows").onclick = function(){ setActivePreset(this); setV("flows"); };
    document.getElementById("p-gradient").onclick = function(){ setActivePreset(this); setV("gradient"); };
    document.getElementById("p-urea").onclick = function(){ setActivePreset(this); setV("urea"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "flows"){
      c.innerHTML =
        '<div class="control-group"><label>Pair:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Henle loop + vasa recta (PDF p. 6).</div></div>' +
        '<div class="control-group"><label>Key:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Opposite directions trap solutes.</div></div>';
    } else if(view === "gradient"){
      c.innerHTML =
        '<div class="control-group"><label>Range:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cortex 300, deep medulla 1200.</div></div>' +
        '<div class="control-group"><label>Cause:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Mainly NaCl and urea (PDF p. 7).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Salt:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Ascending limb to vasa recta.</div></div>' +
        '<div class="control-group"><label>Urea:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Thin segment, collecting tubule.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Counter Current (§16.4)</text>';
    if(view === "flows"){
      m += '<rect x="80" y="100" width="250" height="130" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="205" y="132" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">HENLE’S LOOP</text>';
      m += '<text x="205" y="160" fill="#f8fafc" font-size="11" text-anchor="middle">filtrate: down ↓ then up ↑</text>';
      m += '<text x="205" y="184" fill="#94a3b8" font-size="10" text-anchor="middle">opposite limbs = current</text>';
      m += '<rect x="370" y="100" width="250" height="130" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2.5"/>';
      m += '<text x="495" y="132" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">VASA RECTA</text>';
      m += '<text x="495" y="160" fill="#f8fafc" font-size="11" text-anchor="middle">blood: down ↓ then up ↑</text>';
      m += '<text x="495" y="184" fill="#94a3b8" font-size="10" text-anchor="middle">counter current pattern</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">proximity + opposite flows hold the gradient (PDF p. 7)</text>';
      readout(cell("Henle", "filtrate counter current", "#38bdf8") + cell("Vasa recta", "blood counter current", "#ef4444"));
      verdict("Opposite flows trap salt.");
    } else if(view === "gradient"){
      m += '<rect x="260" y="84" width="180" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="350" y="109" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">CORTEX</text>';
      m += '<text x="350" y="130" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">300 mOsmolL–1</text>';
      m += '<text x="350" y="168" fill="#f59e0b" font-size="26" text-anchor="middle">↓</text>';
      m += '<text x="350" y="192" fill="#94a3b8" font-size="10" text-anchor="middle">increasing osmolarity inward</text>';
      m += '<rect x="260" y="204" width="180" height="60" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2.5"/>';
      m += '<text x="350" y="229" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">INNER MEDULLA</text>';
      m += '<text x="350" y="250" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">about 1200 mOsmolL–1</text>';
      m += '<text x="350" y="288" fill="#94a3b8" font-size="11" text-anchor="middle">mainly caused by NaCl and urea (PDF p. 7)</text>';
      readout(cell("Cortex", "300 mOsmolL–1", "#38bdf8") + cell("Inner medulla", "about 1200 mOsmolL–1", "#ef4444"));
      verdict("300 to 1200 by depth.");
    } else {
      m += '<rect x="80" y="100" width="250" height="130" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="205" y="130" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">NaCl CYCLE</text>';
      m += '<text x="205" y="156" fill="#f8fafc" font-size="10" text-anchor="middle">ascending limb transports out</text>';
      m += '<text x="205" y="179" fill="#f8fafc" font-size="10" text-anchor="middle">exchanged with vasa recta</text>';
      m += '<text x="205" y="202" fill="#94a3b8" font-size="9.5" text-anchor="middle">returned to interstitium</text>';
      m += '<rect x="370" y="100" width="250" height="130" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="495" y="130" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">UREA CYCLE</text>';
      m += '<text x="495" y="156" fill="#f8fafc" font-size="10" text-anchor="middle">thin segment of ascending limb</text>';
      m += '<text x="495" y="179" fill="#f8fafc" font-size="10" text-anchor="middle">back via collecting tubule</text>';
      m += '<text x="495" y="202" fill="#94a3b8" font-size="9.5" text-anchor="middle">water follows from tubule</text>';
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">urine nearly four times concentrated (PDF p. 8)</text>';
      readout(cell("Salt", "NaCl cycles via vasa recta", "#f59e0b") + cell("Urea", "back via collecting tubule", "#94a3b8"));
      verdict("Salt and urea stack the gradient.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. Hormone & Bladder Console (reglab) - L6, 16.5-16.6
// -------------------------------------------------------------------------
window.SIMS.reglab = (function(){
  var view = "adh"; // "adh", "renin", "mict"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Save water</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Raise GFR</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Release</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-adh">ADH Loop</button>' +
      '<button class="preset-btn" id="p-renin">Renin Chain</button>' +
      '<button class="preset-btn" id="p-mict">Micturition</button>';
    document.getElementById("p-adh").onclick = function(){ setActivePreset(this); setV("adh"); };
    document.getElementById("p-renin").onclick = function(){ setActivePreset(this); setV("renin"); };
    document.getElementById("p-mict").onclick = function(){ setActivePreset(this); setV("mict"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "adh"){
      c.innerHTML =
        '<div class="control-group"><label>Sense:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Osmoreceptors: volume + ions.</div></div>' +
        '<div class="control-group"><label>Source:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Neurohypophysis (PDF p. 8).</div></div>';
    } else if(view === "renin"){
      c.innerHTML =
        '<div class="control-group"><label>Start:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">JG cells sense the fall.</div></div>' +
        '<div class="control-group"><label>Check:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">ANF from the atria (PDF p. 8).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Store:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Bladder waits for CNS signal.</div></div>' +
        '<div class="control-group"><label>Urine:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">1 to 1.5 litres, pH-6.0.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Regulation (§16.5–§16.6)</text>';
    if(view === "adh"){
      var chain = ["fluid loss", "osmoreceptors", "ADH released", "water saved", "switch off"];
      for(var i = 0; i < 5; i++){
        var nx = 36 + i * 128;
        m += '<rect x="' + nx + '" y="140" width="118" height="64" rx="8" fill="#0f172a" stroke="' + (i === 2 ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (nx + 59) + '" y="176" fill="' + (i === 2 ? "#38bdf8" : "#f8fafc") + '" font-size="9" font-weight="700" text-anchor="middle">' + chain[i] + "</text>";
        if(i < 4) m += '<text x="' + (nx + 123) + '" y="175" fill="#64748b" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">hypothalamus → neurohypophysis → latter tubule parts</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">diuresis prevented · vessels constricted (PDF p. 8)</text>';
      readout(cell("Signal", "antidiuretic hormone", "#38bdf8") + cell("Effect", "water reabsorbed, no diuresis", "#22c55e"));
      verdict("ADH saves water.");
    } else if(view === "renin"){
      var rc = ["JG cells", "renin", "angiotensin I → II", "Aldosterone", "GFR up"];
      for(var j = 0; j < 5; j++){
        var rx = 36 + j * 128;
        m += '<rect x="' + rx + '" y="130" width="118" height="64" rx="8" fill="#0f172a" stroke="' + (j === 4 ? "#22c55e" : "#f59e0b") + '" stroke-width="2"/>';
        m += '<text x="' + (rx + 59) + '" y="166" fill="#f8fafc" font-size="8.5" font-weight="700" text-anchor="middle">' + rc[j] + "</text>";
        if(j < 4) m += '<text x="' + (rx + 123) + '" y="165" fill="#64748b" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">Renin-Angiotensin mechanism</text>';
      m += '<text x="350" y="248" fill="#94a3b8" font-size="11" text-anchor="middle">angiotensin II: vasoconstrictor · ANF from atria checks it (PDF p. 8)</text>';
      readout(cell("Chain", "renin to angiotensin to Aldosterone", "#f59e0b") + cell("Check", "ANF vasodilation", "#22c55e"));
      verdict("Renin pushes, ANF checks.");
    } else {
      var mc = ["bladder stretch", "stretch receptors", "CNS orders", "contract + relax", "urine released"];
      for(var k = 0; k < 5; k++){
        var mx = 36 + k * 128;
        m += '<rect x="' + mx + '" y="130" width="118" height="64" rx="8" fill="#0f172a" stroke="' + (k === 4 ? "#22c55e" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (mx + 59) + '" y="166" fill="#f8fafc" font-size="8.5" font-weight="700" text-anchor="middle">' + mc[k] + "</text>";
        if(k < 4) m += '<text x="' + (mx + 123) + '" y="165" fill="#64748b" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">micturition reflex · 1 to 1.5 litres per day · pH-6.0</text>';
      m += '<text x="350" y="248" fill="#94a3b8" font-size="11" text-anchor="middle">25-30 gm urea per day · characterestic odour (PDF p. 9)</text>';
      readout(cell("Reflex", "micturition reflex", "#38bdf8") + cell("Output", "1 to 1.5 litres per day", "#94a3b8"));
      verdict("Bladder asks, brain orders.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 7. Organs & Dialysis Ward (organlab) - L7, 16.7-16.8
// -------------------------------------------------------------------------
window.SIMS.organlab = (function(){
  var view = "lungs"; // "lungs", "dialysis", "disorders"
  var dis = 0;
  var DIS = [
    ["Uremia", "urea in blood", "hemodialysis"],
    ["Renal calculi", "oxalate stones", "formed in kidney"],
    ["Glomerulonephritis", "glomeruli inflamed", "of kidney"],
    ["Transplant", "ultimate method", "close relative donor"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Helpers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Dialysis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Disorder</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-lungs">Helpers</button>' +
      '<button class="preset-btn" id="p-dialysis">Dialysis</button>' +
      '<button class="preset-btn" id="p-disorders">Disorders</button>';
    document.getElementById("p-lungs").onclick = function(){ setActivePreset(this); setV("lungs"); };
    document.getElementById("p-dialysis").onclick = function(){ setActivePreset(this); setV("dialysis"); };
    document.getElementById("p-disorders").onclick = function(){ setActivePreset(this); setV("disorders"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "lungs"){
      c.innerHTML =
        '<div class="control-group"><label>Helpers:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Lungs, liver, skin (PDF p. 9).</div></div>' +
        '<div class="control-group"><label>Extra:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Saliva carries traces too.</div></div>';
    } else if(view === "dialysis"){
      c.innerHTML =
        '<div class="control-group"><label>Unit:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cellophane coil, artificial kidney.</div></div>' +
        '<div class="control-group"><label>Drive:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Concentration gradient only.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Disorder:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        DIS.map(function(d, i){ return '<button class="preset-btn" data-ds="' + i + '">' + d[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Note:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Uremia to transplant ladder.</div></div>';
      c.querySelectorAll("[data-ds]").forEach(function(b){ b.onclick = function(){ dis = Number(b.dataset.ds); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Helpers (§16.7–§16.8)</text>';
    if(view === "lungs"){
      var helps = [
        ["LUNGS", "CO2 200mL/minute", "water every day"],
        ["LIVER", "bilirubin, biliverdin", "bile wastes out"],
        ["SKIN", "sweat: NaCl, urea", "sebum: waxes coat"]
      ];
      for(var i = 0; i < 3; i++){
        var hx = 90 + i * 180;
        m += '<rect x="' + hx + '" y="110" width="160" height="110" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + (hx + 80) + '" y="140" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">' + helps[i][0] + "</text>";
        m += '<text x="' + (hx + 80) + '" y="164" fill="#f8fafc" font-size="9" text-anchor="middle">' + helps[i][1] + "</text>";
        m += '<text x="' + (hx + 80) + '" y="184" fill="#64748b" font-size="9" text-anchor="middle">' + helps[i][2] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">largest gland: liver · saliva too (PDF p. 9)</text>';
      readout(cell("Lungs", "CO2 at 200mL/minute", "#38bdf8") + cell("Skin", "sweat + sebum", "#f59e0b"));
      verdict("Kidneys share the load.");
    } else if(view === "dialysis"){
      var dc = ["artery + heparin", "cellophane coil", "dialysing fluid", "anti-heparin", "vein back"];
      for(var j = 0; j < 5; j++){
        var dx = 36 + j * 128;
        m += '<rect x="' + dx + '" y="140" width="118" height="64" rx="8" fill="#0f172a" stroke="' + (j === 2 ? "#22c55e" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (dx + 59) + '" y="176" fill="#f8fafc" font-size="8.5" font-weight="700" text-anchor="middle">' + dc[j] + "</text>";
        if(j < 4) m += '<text x="' + (dx + 123) + '" y="175" fill="#64748b" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">haemodialysis: artificial kidney, gradient-driven</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">boon for uremic patients (PDF p. 10)</text>';
      readout(cell("Fluid", "plasma minus nitrogenous wastes", "#22c55e") + cell("Tube", "cellophane membrance gradient", "#94a3b8"));
      verdict("Gradient clears the blood.");
    } else {
      for(var k = 0; k < 4; k++){
        var on = k === dis;
        var kx = 60 + k * 155;
        m += '<rect x="' + kx + '" y="110" width="140" height="110" rx="8" fill="#0f172a" stroke="' + (on ? "#ef4444" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (kx + 70) + '" y="145" fill="' + (on ? "#ef4444" : "#475569") + '" font-size="9.5" font-weight="700" text-anchor="middle">' + DIS[k][0] + "</text>";
        m += '<text x="' + (kx + 70) + '" y="168" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="8.5" font-weight="700" text-anchor="middle">' + DIS[k][1] + "</text>";
        m += '<text x="' + (kx + 70) + '" y="188" fill="#64748b" font-size="8" text-anchor="middle">' + DIS[k][2] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">uremia → hemodialysis → transplantation (PDF pp. 9–10)</text>';
      readout(cell("Blood waste", "uremia = urea in blood", "#ef4444") + cell("Last resort", "transplantation", "#22c55e"));
      verdict("Uremia to transplant.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-115 -
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
