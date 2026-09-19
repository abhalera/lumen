// kebo117 interactive simulations: Locomotion and Movement (Ch. 17, print pp. 217-229)
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
// 1. Movement Sorter (movelab) - L1, Introduction + 17.1
// -------------------------------------------------------------------------
window.SIMS.movelab = (function(){
  var view = "types"; // "types", "loco", "cells"
  var mode = 0;
  var MODES = [
    ["AMOEBOID", "macrophages", "leucocytes in blood", "pseudopodia"],
    ["CILIARY", "trachea dust", "ova passage", "ciliated epithelium"],
    ["MUSCULAR", "limbs", "jaws, tongue", "contractile property"]
  ];
  var MCOL = ["#38bdf8", "#22c55e", "#f59e0b"];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Amoeboid</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Ciliary</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Muscular</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-types">3 Types</button>' +
      '<button class="preset-btn" id="p-loco">Locomotion Rule</button>' +
      '<button class="preset-btn" id="p-cells">Cell Crews</button>';
    document.getElementById("p-types").onclick = function(){ setActivePreset(this); setV("types"); };
    document.getElementById("p-loco").onclick = function(){ setActivePreset(this); setV("loco"); };
    document.getElementById("p-cells").onclick = function(){ setActivePreset(this); setV("cells"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "types"){
      c.innerHTML =
        '<div class="control-group"><label>Type:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        MODES.map(function(m, i){ return '<button class="preset-btn" data-md="' + i + '">' + m[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Three main types of human cell movement (PDF p. 1).</div></div>';
      c.querySelectorAll("[data-md]").forEach(function(b){ b.onclick = function(){ mode = Number(b.dataset.md); draw(0); }; });
    } else if(view === "loco"){
      c.innerHTML =
        '<div class="control-group"><label>Test:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Change of place = locomotion (PDF p. 1).</div></div>' +
        '<div class="control-group"><label>Why:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Food, shelter, mate, escape (PDF p. 1).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Blood:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Macrophages, leucocytes crawl (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Tubes:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Ciliated epithelium sweeps (PDF p. 2).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Movements (§17.1)</text>';
    if(view === "types"){
      for(var i = 0; i < 3; i++){
        var on = i === mode;
        var px = 90 + i * 180;
        m += '<rect x="' + px + '" y="100" width="160" height="130" rx="8" fill="#0f172a" stroke="' + (on ? MCOL[i] : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (px + 80) + '" y="128" fill="' + (on ? MCOL[i] : "#475569") + '" font-size="10.5" font-weight="700" text-anchor="middle">' + MODES[i][0] + "</text>";
        for(var j = 1; j <= 3; j++){
          m += '<text x="' + (px + 80) + '" y="' + (128 + j * 26) + '" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="9" text-anchor="middle">' + MODES[i][j] + "</text>";
        }
      }
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">amoeboid, ciliary and muscular (PDF p. 1)</text>';
      readout(cell("Amoeboid", "macrophages and leucocytes", "#38bdf8") + cell("Ciliary", "trachea dust, ova passage", "#22c55e"));
      verdict("Three moves, three cell crews.");
    } else if(view === "loco"){
      m += '<rect x="60" y="100" width="580" height="66" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="127" fill="#f8fafc" font-size="11.5" font-weight="700" text-anchor="middle">all locomotions are movements</text>';
      m += '<text x="350" y="148" fill="#f8fafc" font-size="11.5" font-weight="700" text-anchor="middle">but all movements are not locomotions</text>';
      m += '<rect x="60" y="180" width="280" height="62" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="200" y="206" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">LOCOMOTION (change of place)</text>';
      m += '<text x="200" y="227" fill="#f8fafc" font-size="10" text-anchor="middle">walking, running, flying, swimming</text>';
      m += '<rect x="360" y="180" width="280" height="62" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="500" y="206" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">MOVEMENT ONLY</text>';
      m += '<text x="500" y="227" fill="#f8fafc" font-size="10" text-anchor="middle">protoplasmic streaming, cilia sweep</text>';
      m += '<text x="350" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">Paramoecium cilia and Hydra tentacles do both jobs (PDF p. 1)</text>';
      readout(cell("Locomotion", "walking, flying, swimming", "#22c55e") + cell("Both jobs", "Paramoecium cilia, Hydra tentacles", "#f59e0b"));
      verdict("Change of place decides.");
    } else {
      m += '<rect x="60" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="200" y="130" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">AMOEBOID</text>';
      m += '<text x="200" y="155" fill="#f8fafc" font-size="10.5" text-anchor="middle">macrophages, leucocytes</text>';
      m += '<text x="200" y="176" fill="#f8fafc" font-size="10.5" text-anchor="middle">pseudopodia + microfilaments</text>';
      m += '<text x="200" y="197" fill="#64748b" font-size="10" text-anchor="middle">streaming of protoplasm</text>';
      m += '<rect x="360" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="500" y="130" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">CILIARY</text>';
      m += '<text x="500" y="155" fill="#f8fafc" font-size="10.5" text-anchor="middle">ciliated epithelium tubes</text>';
      m += '<text x="500" y="176" fill="#f8fafc" font-size="10.5" text-anchor="middle">trachea dust, ova passage</text>';
      m += '<text x="500" y="197" fill="#64748b" font-size="10" text-anchor="middle">coordinated cilia</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">muscular: limbs, jaws, tongue need muscle (PDF p. 2)</text>';
      readout(cell("Amoeboid", "pseudopodia + microfilaments", "#38bdf8") + cell("Ciliary", "ciliated epithelium tubes", "#22c55e"));
      verdict("Blood crawls, tubes sweep.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. Muscle Type Sorter (musclelab) - L2, 17.2
// -------------------------------------------------------------------------
window.SIMS.musclelab = (function(){
  var view = "three"; // "three", "props", "control"
  var mode = 0;
  var MODES = [
    ["SKELETAL", "striated", "voluntary", "locomotion + posture"],
    ["VISCERAL", "smooth, nonstriated", "involuntary", "food + gametes"],
    ["CARDIAC", "striated, branching", "involuntary", "muscles of heart"]
  ];
  var MCOL = ["#f59e0b", "#38bdf8", "#ef4444"];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Skeletal</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Visceral</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Cardiac</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-three">3 Types</button>' +
      '<button class="preset-btn" id="p-props">Properties</button>' +
      '<button class="preset-btn" id="p-control">Control Split</button>';
    document.getElementById("p-three").onclick = function(){ setActivePreset(this); setV("three"); };
    document.getElementById("p-props").onclick = function(){ setActivePreset(this); setV("props"); };
    document.getElementById("p-control").onclick = function(){ setActivePreset(this); setV("control"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "three"){
      c.innerHTML =
        '<div class="control-group"><label>Type:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        MODES.map(function(m, i){ return '<button class="preset-btn" data-md="' + i + '">' + m[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>By:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Location, appearance, regulation (PDF p. 2).</div></div>';
      c.querySelectorAll("[data-md]").forEach(function(b){ b.onclick = function(){ mode = Number(b.dataset.md); draw(0); }; });
    } else if(view === "props"){
      c.innerHTML =
        '<div class="control-group"><label>Share:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">About 40-50 per cent of body weight.</div></div>' +
        '<div class="control-group"><label>Origin:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Specialised tissue of mesodermal origin.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Voluntary:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Skeletal only (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Involuntary:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Visceral + cardiac (PDF pp. 2-3).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Muscles (§17.2)</text>';
    if(view === "three"){
      for(var i = 0; i < 3; i++){
        var on = i === mode;
        var px = 90 + i * 180;
        m += '<rect x="' + px + '" y="100" width="160" height="130" rx="8" fill="#0f172a" stroke="' + (on ? MCOL[i] : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (px + 80) + '" y="128" fill="' + (on ? MCOL[i] : "#475569") + '" font-size="10.5" font-weight="700" text-anchor="middle">' + MODES[i][0] + "</text>";
        for(var j = 1; j <= 3; j++){
          m += '<text x="' + (px + 80) + '" y="' + (128 + j * 26) + '" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="8.5" text-anchor="middle">' + MODES[i][j] + "</text>";
        }
      }
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">skeletal, visceral, cardiac (PDF p. 2)</text>';
      readout(cell("Skeletal", "striated + voluntary", "#f59e0b") + cell("Cardiac", "striated + involuntary", "#ef4444"));
      verdict("Stripes and control sort them.");
    } else if(view === "props"){
      var rows = [
        ["40-50 per cent of body weight", "mesodermal tissue", "#f59e0b"],
        ["excitability · contractility", "extensibility · elasticity", "#38bdf8"],
        ["flagella move spermatozoa", "sponges, Euglena too", "#22c55e"]
      ];
      for(var r = 0; r < 3; r++){
        var ry = 96 + r * 58;
        m += '<rect x="150" y="' + ry + '" width="400" height="48" rx="8" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="2"/>';
        m += '<text x="350" y="' + (ry + 29) + '" fill="#f8fafc" font-size="10.5" font-weight="700" text-anchor="middle">' + rows[r][0] + " · " + rows[r][1] + "</text>";
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">four special properties (PDF p. 2)</text>';
      readout(cell("Share", "40-50 per cent of weight", "#f59e0b") + cell("Origin", "mesodermal tissue", "#94a3b8"));
      verdict("Half the body, four powers.");
    } else {
      m += '<rect x="60" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="200" y="130" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">VOLUNTARY</text>';
      m += '<text x="200" y="158" fill="#f8fafc" font-size="11" text-anchor="middle">skeletal muscles</text>';
      m += '<text x="200" y="181" fill="#f8fafc" font-size="10" text-anchor="middle">locomotory actions</text>';
      m += '<text x="200" y="202" fill="#64748b" font-size="10" text-anchor="middle">changes of body postures</text>';
      m += '<rect x="360" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="500" y="130" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">INVOLUNTARY</text>';
      m += '<text x="500" y="158" fill="#f8fafc" font-size="11" text-anchor="middle">visceral + cardiac</text>';
      m += '<text x="500" y="181" fill="#f8fafc" font-size="10" text-anchor="middle">transportation of food</text>';
      m += '<text x="500" y="202" fill="#64748b" font-size="10" text-anchor="middle">branching pattern beats</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">cardiac: striated yet involuntary (PDF p. 3)</text>';
      readout(cell("Visceral job", "transportation of food", "#38bdf8") + cell("Heart", "branching pattern beats", "#ef4444"));
      verdict("Food and gametes move unseen.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 3. Sarcomere Explorer (sarcolab) - L3, 17.2 fibre + sarcomere
// -------------------------------------------------------------------------
window.SIMS.sarcolab = (function(){
  var view = "bands"; // "bands", "sarco", "fibre"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Thin (actin)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Thick (myosin)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Z / M lines</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-bands">Bands</button>' +
      '<button class="preset-btn" id="p-sarco">Sarcomere</button>' +
      '<button class="preset-btn" id="p-fibre">Fibre Zoom</button>';
    document.getElementById("p-bands").onclick = function(){ setActivePreset(this); setV("bands"); };
    document.getElementById("p-sarco").onclick = function(){ setActivePreset(this); setV("sarco"); };
    document.getElementById("p-fibre").onclick = function(){ setActivePreset(this); setV("fibre"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "bands"){
      c.innerHTML =
        '<div class="control-group"><label>Light:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">I-band, Isotropic, actin (PDF p. 3).</div></div>' +
        '<div class="control-group"><label>Dark:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">A band, Anisotropic, myosin.</div></div>';
    } else if(view === "sarco"){
      c.innerHTML =
        '<div class="control-group"><label>Unit:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Between two successive Z lines.</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 17.2 sarcomere.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Chain:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fascicles to myofibrils (PDF p. 3).</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 17.1 bundles.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Sarcomere (§17.2)</text>';
    if(view === "bands"){
      m += '<rect x="60" y="110" width="180" height="110" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="150" y="142" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">I-BAND (light)</text>';
      m += '<text x="150" y="168" fill="#f8fafc" font-size="10.5" text-anchor="middle">Isotropic band</text>';
      m += '<text x="150" y="190" fill="#f8fafc" font-size="10.5" text-anchor="middle">actin, thin filaments</text>';
      m += '<text x="150" y="210" fill="#64748b" font-size="9.5" text-anchor="middle">Z line bisects it</text>';
      m += '<rect x="270" y="110" width="180" height="110" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="360" y="142" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">A BAND (dark)</text>';
      m += '<text x="360" y="168" fill="#f8fafc" font-size="10.5" text-anchor="middle">Anisotropic band</text>';
      m += '<text x="360" y="190" fill="#f8fafc" font-size="10.5" text-anchor="middle">myosin, thick filaments</text>';
      m += '<text x="360" y="210" fill="#64748b" font-size="9.5" text-anchor="middle">M line holds middle</text>';
      m += '<rect x="480" y="110" width="160" height="110" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="560" y="142" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">ROD-LIKE</text>';
      m += '<text x="560" y="168" fill="#f8fafc" font-size="10" text-anchor="middle">parallel to each other</text>';
      m += '<text x="560" y="190" fill="#f8fafc" font-size="10" text-anchor="middle">+ myofibril axis</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">striation = Actin and Myosin pattern (PDF p. 3)</text>';
      readout(cell("I band", "actin, thin, Isotropic", "#38bdf8") + cell("A band", "myosin, thick, Anisotropic", "#ef4444"));
      verdict("Stripes are proteins lined up.");
    } else if(view === "sarco"){
      m += '<rect x="60" y="120" width="120" height="70" rx="6" fill="#1e3a5f" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="120" y="148" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">half I</text>';
      m += '<text x="120" y="166" fill="#94a3b8" font-size="9" text-anchor="middle">actin</text>';
      m += '<rect x="180" y="120" width="260" height="70" rx="6" fill="#5f1e1e" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="310" y="148" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">A band (myosin)</text>';
      m += '<text x="310" y="166" fill="#fca5a5" font-size="9" text-anchor="middle">H zone + M line centre</text>';
      m += '<rect x="440" y="120" width="120" height="70" rx="6" fill="#1e3a5f" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="500" y="148" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">half I</text>';
      m += '<text x="500" y="166" fill="#94a3b8" font-size="9" text-anchor="middle">actin</text>';
      m += '<text x="120" y="110" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">Z</text>';
      m += '<text x="500" y="110" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">Z</text>';
      m += '<text x="310" y="110" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">Z to Z = sarcomere</text>';
      m += '<text x="350" y="232" fill="#94a3b8" font-size="11" text-anchor="middle">functional unit of contraction (PDF p. 4)</text>';
      m += '<text x="350" y="254" fill="#94a3b8" font-size="11" text-anchor="middle">H zone: thick centre free of thin overlap</text>';
      readout(cell("Sarcomere", "functional unit of contraction", "#22c55e") + cell("H zone", "thick centre, no thin overlap", "#ef4444"));
      verdict("Z to Z is one unit.");
    } else {
      var segs = ["fascicles", "fascia", "fibre", "sarcolemma", "myofibrils"];
      for(var i = 0; i < 5; i++){
        var sx = 40 + i * 124;
        m += '<rect x="' + sx + '" y="140" width="116" height="62" rx="8" fill="#0f172a" stroke="' + (i === 4 ? "#22c55e" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (sx + 58) + '" y="176" fill="#f8fafc" font-size="9" font-weight="700" text-anchor="middle">' + segs[i] + "</text>";
        if(i < 4) m += '<text x="' + (sx + 120) + '" y="175" fill="#64748b" font-size="13" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">muscle fibre is a syncitium (many nuclei)</text>';
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">sarcoplasmic reticulum: store house of calcium ions (PDF p. 3)</text>';
      readout(cell("Fibre", "syncitium, many nuclei", "#38bdf8") + cell("Store", "sarcoplasmic reticulum Ca++", "#f59e0b"));
      verdict("Bundles down to fibrils.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Contraction Lab (contractlab) - L4, 17.2.1-17.2.2
// -------------------------------------------------------------------------
window.SIMS.contractlab = (function(){
  var view = "proteins"; // "proteins", "cycle", "fibres"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Actin</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Myosin</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Ca++</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-proteins">Proteins</button>' +
      '<button class="preset-btn" id="p-cycle">Cycle</button>' +
      '<button class="preset-btn" id="p-fibres">Red / White</button>';
    document.getElementById("p-proteins").onclick = function(){ setActivePreset(this); setV("proteins"); };
    document.getElementById("p-cycle").onclick = function(){ setActivePreset(this); setV("cycle"); };
    document.getElementById("p-fibres").onclick = function(){ setActivePreset(this); setV("fibres"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "proteins"){
      c.innerHTML =
        '<div class="control-group"><label>Thin:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">F actin, tropomyosin, Troponin (PDF p. 5).</div></div>' +
        '<div class="control-group"><label>Thick:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Meromyosins, HMM cross arm.</div></div>';
    } else if(view === "cycle"){
      c.innerHTML =
        '<div class="control-group"><label>Theory:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Thin slides over thick (PDF p. 5).</div></div>' +
        '<div class="control-group"><label>Figures:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figures 17.4-17.5 cross bridge.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Red:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Myoglobin-rich aerobic (PDF p. 7).</div></div>' +
        '<div class="control-group"><label>White:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Myoglobin-poor anaerobic.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Contraction (§17.2.1-17.2.2)</text>';
    if(view === "proteins"){
      m += '<rect x="60" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="200" y="130" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">THIN (actin)</text>';
      m += '<text x="200" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">2 F actins, helical</text>';
      m += '<text x="200" y="176" fill="#f8fafc" font-size="10" text-anchor="middle">tropomyosin + Troponin</text>';
      m += '<text x="200" y="197" fill="#64748b" font-size="10" text-anchor="middle">Troponin masks myosin sites</text>';
      m += '<rect x="360" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="500" y="130" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">THICK (myosin)</text>';
      m += '<text x="500" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">Meromyosins polymer</text>';
      m += '<text x="500" y="176" fill="#f8fafc" font-size="10" text-anchor="middle">HMM cross arm + LMM tail</text>';
      m += '<text x="500" y="197" fill="#64748b" font-size="10" text-anchor="middle">head: ATPase, ATP + actin sites</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">Figure 17.3 actin and meromyosin (PDF p. 5)</text>';
      readout(cell("Thin", "F actin + tropomyosin + Troponin", "#38bdf8") + cell("Thick", "Meromyosins, HMM cross arm", "#ef4444"));
      verdict("Two filaments, five proteins.");
    } else if(view === "cycle"){
      var steps = ["Acetyl choline", "Ca++ release", "cross bridge", "pull to A centre", "ATP breaks", "Ca++ back"];
      for(var i = 0; i < 6; i++){
        var sx = 30 + i * 108;
        m += '<rect x="' + sx + '" y="150" width="100" height="56" rx="8" fill="#0f172a" stroke="' + (i === 2 ? "#22c55e" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (sx + 50) + '" y="181" fill="#f8fafc" font-size="8.5" font-weight="700" text-anchor="middle">' + steps[i] + "</text>";
        if(i < 5) m += '<text x="' + (sx + 104) + '" y="180" fill="#64748b" font-size="13" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">thin filaments slide over thick filaments</text>';
      m += '<text x="350" y="132" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">I bands get reduced, A bands retain the length</text>';
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">ADP and P1 out, fresh ATP breaks each bridge (PDF pp. 6-7)</text>';
      readout(cell("Signal", "Acetyl choline fires", "#22c55e") + cell("Result", "I reduced, A kept", "#38bdf8"));
      verdict("Signal in, sliding out.");
    } else {
      m += '<rect x="60" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="200" y="130" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">RED FIBRES</text>';
      m += '<text x="200" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">high myoglobin, reddish</text>';
      m += '<text x="200" y="176" fill="#f8fafc" font-size="10" text-anchor="middle">plenty of mitochondria</text>';
      m += '<text x="200" y="197" fill="#64748b" font-size="10" text-anchor="middle">aerobic muscles</text>';
      m += '<rect x="360" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#e2e8f0" stroke-width="2"/>';
      m += '<text x="500" y="130" fill="#e2e8f0" font-size="12" font-weight="700" text-anchor="middle">WHITE FIBRES</text>';
      m += '<text x="500" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">very less myoglobin, pale</text>';
      m += '<text x="500" y="176" fill="#f8fafc" font-size="10" text-anchor="middle">few mitochondria, high SR</text>';
      m += '<text x="500" y="197" fill="#64748b" font-size="10" text-anchor="middle">anaerobic process</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">lactic acid from glycogen causes fatigue (PDF p. 7)</text>';
      readout(cell("Red", "myoglobin-rich aerobic", "#ef4444") + cell("White", "myoglobin-poor anaerobic", "#e2e8f0"));
      verdict("Red breathes, white sprints.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 5. Axial Skeleton Lab (axialab) - L5, 17.3 axial
// -------------------------------------------------------------------------
window.SIMS.axialab = (function(){
  var view = "skull"; // "skull", "spine", "ribs"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Skull</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Column</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Rib cage</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-skull">Skull</button>' +
      '<button class="preset-btn" id="p-spine">Spine</button>' +
      '<button class="preset-btn" id="p-ribs">Ribs</button>';
    document.getElementById("p-skull").onclick = function(){ setActivePreset(this); setV("skull"); };
    document.getElementById("p-spine").onclick = function(){ setActivePreset(this); setV("spine"); };
    document.getElementById("p-ribs").onclick = function(){ setActivePreset(this); setV("ribs"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "skull"){
      c.innerHTML =
        '<div class="control-group"><label>Census:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">22 = 8 cranial + 14 facial (PDF p. 8).</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 17.6 human skull.</div></div>';
    } else if(view === "spine"){
      c.innerHTML =
        '<div class="control-group"><label>Census:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">26 vertebrae, dorsally placed.</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 17.7 vertebral column.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Census:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">12 pairs: true, false, floating.</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 17.8 ribs and rib cage.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Axial skeleton (§17.3)</text>';
    if(view === "skull"){
      m += '<rect x="60" y="100" width="180" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="150" y="132" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">CRANIAL: 8</text>';
      m += '<text x="150" y="158" fill="#f8fafc" font-size="10" text-anchor="middle">hard protective</text>';
      m += '<text x="150" y="179" fill="#f8fafc" font-size="10" text-anchor="middle">outer covering</text>';
      m += '<text x="150" y="200" fill="#64748b" font-size="10" text-anchor="middle">cranium for brain</text>';
      m += '<rect x="260" y="100" width="180" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="350" y="132" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">FACIAL: 14</text>';
      m += '<text x="350" y="158" fill="#f8fafc" font-size="10" text-anchor="middle">14 skeletal elements</text>';
      m += '<text x="350" y="179" fill="#f8fafc" font-size="10" text-anchor="middle">front part</text>';
      m += '<text x="350" y="200" fill="#64748b" font-size="10" text-anchor="middle">of the skull</text>';
      m += '<rect x="460" y="100" width="180" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="550" y="132" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">PLUS</text>';
      m += '<text x="550" y="158" fill="#f8fafc" font-size="10" text-anchor="middle">hyoid (U-shaped)</text>';
      m += '<text x="550" y="179" fill="#f8fafc" font-size="10" text-anchor="middle">Ear Ossicles × 2</text>';
      m += '<text x="550" y="200" fill="#64748b" font-size="10" text-anchor="middle">dicondylic skull</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">skull totals 22 bones (PDF p. 8)</text>';
      readout(cell("Skull", "8 cranial + 14 facial", "#f59e0b") + cell("Extras", "hyoid + Ear Ossicles", "#38bdf8"));
      verdict("Twenty-two guard the brain.");
    } else if(view === "spine"){
      var regs = [["CERVICAL", "7"], ["THORACIC", "12"], ["LUMBAR", "5"], ["SACRAL", "1-fused"], ["COCCYGEAL", "1-fused"]];
      for(var i = 0; i < 5; i++){
        var nx = 40 + i * 128;
        m += '<rect x="' + nx + '" y="130" width="118" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + (nx + 59) + '" y="163" fill="#f8fafc" font-size="9" font-weight="700" text-anchor="middle">' + regs[i][0] + "</text>";
        m += '<text x="' + (nx + 59) + '" y="186" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">' + regs[i][1] + "</text>";
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">26 serially arranged vertebrae, dorsally placed</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">atlas meets occipital condyles; seven cervical in mammals (PDF p. 9)</text>';
      readout(cell("Column", "7 + 12 + 5 + 1 + 1", "#38bdf8") + cell("First", "atlas meets condyles", "#22c55e"));
      verdict("Twenty-six guard the cord.");
    } else {
      m += '<rect x="60" y="110" width="180" height="110" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="150" y="142" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">TRUE 1-7</text>';
      m += '<text x="150" y="168" fill="#f8fafc" font-size="10" text-anchor="middle">to sternum with</text>';
      m += '<text x="150" y="189" fill="#f8fafc" font-size="10" text-anchor="middle">hyaline cartilage</text>';
      m += '<rect x="260" y="110" width="180" height="110" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="350" y="142" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">FALSE 8-10</text>';
      m += '<text x="350" y="168" fill="#f8fafc" font-size="10" text-anchor="middle">vertebrochondral:</text>';
      m += '<text x="350" y="189" fill="#f8fafc" font-size="10" text-anchor="middle">join seventh rib</text>';
      m += '<rect x="460" y="110" width="180" height="110" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="550" y="142" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">FLOATING</text>';
      m += '<text x="550" y="168" fill="#f8fafc" font-size="10" text-anchor="middle">11th and 12th pairs</text>';
      m += '<text x="550" y="189" fill="#f8fafc" font-size="10" text-anchor="middle">not ventrally joined</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">bicephalic ribs + sternum = rib cage (PDF p. 9)</text>';
      readout(cell("Cage", "12 pairs + sternum", "#22c55e") + cell("Floating", "11th and 12th pairs", "#38bdf8"));
      verdict("True, false, floating.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. Limb and Girdle Lab (appendlab) - L6, 17.3 appendicular
// -------------------------------------------------------------------------
window.SIMS.appendlab = (function(){
  var view = "arm"; // "arm", "leg", "girdle"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fore limb</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Hind limb</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Girdles</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-arm">Fore Limb</button>' +
      '<button class="preset-btn" id="p-leg">Hind Limb</button>' +
      '<button class="preset-btn" id="p-girdle">Girdles</button>';
    document.getElementById("p-arm").onclick = function(){ setActivePreset(this); setV("arm"); };
    document.getElementById("p-leg").onclick = function(){ setActivePreset(this); setV("leg"); };
    document.getElementById("p-girdle").onclick = function(){ setActivePreset(this); setV("girdle"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "arm"){
      c.innerHTML =
        '<div class="control-group"><label>Census:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">3 + 8 + 5 + 14 = 30 (PDF p. 10).</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 17.9 upper arm.</div></div>';
    } else if(view === "leg"){
      c.innerHTML =
        '<div class="control-group"><label>Census:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">3 + 7 + 5 + 14 + patella = 30.</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 17.10 lower limb.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Job:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Articulate limbs with axial skeleton.</div></div>' +
        '<div class="control-group"><label>Halves:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Each girdle of two halves (PDF p. 10).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Limbs and girdles (§17.3)</text>';
    if(view === "arm"){
      var segs = [["humerus", "1"], ["radius+ulna", "2"], ["carpals", "8"], ["metacarpals", "5"], ["phalanges", "14"]];
      for(var i = 0; i < 5; i++){
        var nx = 40 + i * 128;
        m += '<rect x="' + nx + '" y="130" width="118" height="80" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<text x="' + (nx + 59) + '" y="163" fill="#f8fafc" font-size="8.5" font-weight="700" text-anchor="middle">' + segs[i][0] + "</text>";
        m += '<text x="' + (nx + 59) + '" y="186" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">' + segs[i][1] + "</text>";
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">bones of the hand (fore limb): 3 + 8 + 5 + 14 = 30</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">wrist bones, palm bones, digits (PDF p. 10)</text>';
      readout(cell("Hand", "humerus + radius + ulna", "#f59e0b") + cell("Digits", "8 + 5 + 14 below", "#94a3b8"));
      verdict("Thirty bones a hand.");
    } else if(view === "leg"){
      var segs2 = [["femur", "longest"], ["tibia+fibula", "2"], ["tarsals", "7"], ["metatarsals", "5"], ["phalanges", "14"]];
      for(var j = 0; j < 5; j++){
        var jx = 40 + j * 128;
        m += '<rect x="' + jx + '" y="130" width="118" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + (jx + 59) + '" y="163" fill="#f8fafc" font-size="8.5" font-weight="700" text-anchor="middle">' + segs2[j][0] + "</text>";
        m += '<text x="' + (jx + 59) + '" y="186" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">' + segs2[j][1] + "</text>";
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">bones of the legs (hind limb) + patella knee cap = 30</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">femur: thigh bone, the longest bone (PDF p. 10)</text>';
      readout(cell("Thigh", "femur, the longest bone", "#38bdf8") + cell("Cap", "patella covers knee", "#22c55e"));
      verdict("Thirty bones a leg.");
    } else {
      m += '<rect x="60" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="200" y="130" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">PECTORAL</text>';
      m += '<text x="200" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">clavicle (collar bone)</text>';
      m += '<text x="200" y="176" fill="#f8fafc" font-size="10" text-anchor="middle">scapula: spine, acromion</text>';
      m += '<text x="200" y="197" fill="#64748b" font-size="10" text-anchor="middle">glenoid + humerus = shoulder</text>';
      m += '<rect x="360" y="100" width="280" height="120" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="500" y="130" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">PELVIC</text>';
      m += '<text x="500" y="155" fill="#f8fafc" font-size="10" text-anchor="middle">coxal: ilium+ischium+pubis</text>';
      m += '<text x="500" y="176" fill="#f8fafc" font-size="10" text-anchor="middle">acetabulum + thigh bone</text>';
      m += '<text x="500" y="197" fill="#64748b" font-size="10" text-anchor="middle">pubic symphysis ventrally</text>';
      m += '<text x="350" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">upper and lower limbs join the axial skeleton (PDF p. 10)</text>';
      readout(cell("Pectoral", "glenoid + shoulder joint", "#f59e0b") + cell("Pelvic", "acetabulum + symphysis", "#22c55e"));
      verdict("Two halves, two sockets.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 7. Joint and Disorder Lab (jointlab) - L7, 17.4-17.5
// -------------------------------------------------------------------------
window.SIMS.jointlab = (function(){
  var view = "joints"; // "joints", "synovial", "disorders"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fibrous</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cartilaginous</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Synovial</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-joints">3 Joint Types</button>' +
      '<button class="preset-btn" id="p-synovial">Synovial Five</button>' +
      '<button class="preset-btn" id="p-disorders">Disorders</button>';
    document.getElementById("p-joints").onclick = function(){ setActivePreset(this); setV("joints"); };
    document.getElementById("p-synovial").onclick = function(){ setActivePreset(this); setV("synovial"); };
    document.getElementById("p-disorders").onclick = function(){ setActivePreset(this); setV("disorders"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "joints"){
      c.innerHTML =
        '<div class="control-group"><label>Idea:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Joint acts as a fulcrum (PDF p. 11).</div></div>' +
        '<div class="control-group"><label>Forms:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Three major structural forms.</div></div>';
    } else if(view === "synovial"){
      c.innerHTML =
        '<div class="control-group"><label>Mark:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fluid filled synovial cavity.</div></div>' +
        '<div class="control-group"><label>Move:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Considerable movement (PDF p. 11).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Count:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Six disorders of muscle and bone.</div></div>' +
        '<div class="control-group"><label>Section:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">17.5 Disorders (PDF p. 11).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Joints (§17.4-17.5)</text>';
    if(view === "joints"){
      m += '<rect x="60" y="110" width="180" height="110" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="150" y="142" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">FIBROUS</text>';
      m += '<text x="150" y="168" fill="#f8fafc" font-size="10" text-anchor="middle">sutures, cranium</text>';
      m += '<text x="150" y="189" fill="#f8fafc" font-size="10" text-anchor="middle">no movement</text>';
      m += '<rect x="260" y="110" width="180" height="110" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="350" y="142" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">CARTILAGINOUS</text>';
      m += '<text x="350" y="168" fill="#f8fafc" font-size="10" text-anchor="middle">adjacent vertebrae</text>';
      m += '<text x="350" y="189" fill="#f8fafc" font-size="10" text-anchor="middle">limited movements</text>';
      m += '<rect x="460" y="110" width="180" height="110" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="550" y="142" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">SYNOVIAL</text>';
      m += '<text x="550" y="168" fill="#f8fafc" font-size="10" text-anchor="middle">fluid filled cavity</text>';
      m += '<text x="550" y="189" fill="#f8fafc" font-size="10" text-anchor="middle">considerable movement</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">points of contact; joint acts as a fulcrum (PDF p. 11)</text>';
      readout(cell("Fibrous", "sutures, no movement", "#f59e0b") + cell("Synovial", "fluid cavity, considerable", "#22c55e"));
      verdict("Fulcrums with three freedoms.");
    } else if(view === "synovial"){
      var rows = [
        ["ball and socket", "humerus + pectoral girdle", "#22c55e"],
        ["hinge: knee", "pivot: atlas and axis", "#38bdf8"],
        ["gliding: carpals", "saddle: carpal-metacarpal of thumb", "#f59e0b"]
      ];
      for(var r = 0; r < 3; r++){
        var ry = 96 + r * 58;
        m += '<rect x="150" y="' + ry + '" width="400" height="48" rx="8" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="2"/>';
        m += '<text x="350" y="' + (ry + 29) + '" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">' + rows[r][0] + " · " + rows[r][1] + "</text>";
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">five synovial examples (PDF p. 11)</text>';
      readout(cell("Pivot", "between atlas and axis", "#38bdf8") + cell("Saddle", "carpal-metacarpal of thumb", "#f59e0b"));
      verdict("Five joints, five places.");
    } else {
      var dis = [
        ["Myasthenia gravis", "Auto immune, junction"],
        ["Muscular dystrophy", "genetic degeneration"],
        ["Tetany", "wild contractions, low Ca++"],
        ["Arthritis", "inflammation of joints"],
        ["Osteoporosis", "low bone mass, estrogen"],
        ["Gout", "uric acid crystals"]
      ];
      for(var d = 0; d < 6; d++){
        var dx = 40 + (d % 3) * 210;
        var dy = 100 + Math.floor(d / 3) * 92;
        m += '<rect x="' + dx + '" y="' + dy + '" width="200" height="80" rx="8" fill="#0f172a" stroke="' + (d < 3 ? "#ef4444" : "#f59e0b") + '" stroke-width="2"/>';
        m += '<text x="' + (dx + 100) + '" y="' + (dy + 32) + '" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">' + dis[d][0] + "</text>";
        m += '<text x="' + (dx + 100) + '" y="' + (dy + 54) + '" fill="#94a3b8" font-size="9.5" text-anchor="middle">' + dis[d][1] + "</text>";
      }
      m += '<text x="350" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">six disorders of muscle and bone (PDF p. 11)</text>';
      readout(cell("Tetany", "wild contractions, low Ca++", "#ef4444") + cell("Gout", "uric acid crystals", "#f59e0b"));
      verdict("Six names, six causes.");
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
