// kebo115 interactive simulations: Body Fluids and Circulation (Ch. 15, print pp. 193-204)
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
// 1. Plasma Composition Bench (plasmalab) - L1, 15.1-15.1.1
// -------------------------------------------------------------------------
window.SIMS.plasmalab = (function(){
  var view = "plasma"; // "plasma", "proteins", "serum"
  var prot = 0;
  var PROTS = [
    ["Fibrinogen", "clotting or coagulation"],
    ["Globulins", "defense mechanisms"],
    ["Albumins", "osmotic balance"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#eab308;"></span><span>Plasma</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Formed elements</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Proteins</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-plasma">Blood Split</button>' +
      '<button class="preset-btn" id="p-proteins">Proteins</button>' +
      '<button class="preset-btn" id="p-serum">Serum Rule</button>';
    document.getElementById("p-plasma").onclick = function(){ setActivePreset(this); setV("plasma"); };
    document.getElementById("p-proteins").onclick = function(){ setActivePreset(this); setV("proteins"); };
    document.getElementById("p-serum").onclick = function(){ setActivePreset(this); setV("serum"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "plasma"){
      c.innerHTML =
        '<div class="control-group"><label>Split:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Plasma ~55, cells ~45 (PDF pp. 1-2).</div></div>' +
        '<div class="control-group"><label>Matrix:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fluid matrix + formed elements.</div></div>';
    } else if(view === "proteins"){
      c.innerHTML =
        '<div class="control-group"><label>Protein:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        PROTS.map(function(p, i){ return '<button class="preset-btn" data-pr="' + i + '">' + p[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Share:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Proteins 6-8% of plasma.</div></div>';
      c.querySelectorAll("[data-pr]").forEach(function(b){ b.onclick = function(){ prot = Number(b.dataset.pr); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Serum = plasma minus clotting factors.</div></div>' +
        '<div class="control-group"><label>Factors:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Present inactive in plasma.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Blood (§15.1–§15.1.1)</text>';
    if(view === "plasma"){
      m += '<rect x="120" y="120" width="247" height="90" rx="8" fill="#0f172a" stroke="#eab308" stroke-width="2.5"/>';
      m += '<text x="243" y="158" fill="#eab308" font-size="13" font-weight="700" text-anchor="middle">plasma: straw coloured</text>';
      m += '<text x="243" y="182" fill="#eab308" font-size="12" font-weight="700" text-anchor="middle">nearly 55 per cent</text>';
      m += '<rect x="387" y="120" width="193" height="90" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2.5"/>';
      m += '<text x="483" y="158" fill="#ef4444" font-size="13" font-weight="700" text-anchor="middle">formed elements</text>';
      m += '<text x="483" y="182" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">nearly 45 per cent</text>';
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">special connective tissue: fluid matrix + cells (PDF p. 1)</text>';
      readout(cell("Plasma", "nearly 55 per cent", "#eab308") + cell("Formed elements", "nearly 45 per cent", "#ef4444"));
      verdict("Just over half is plasma.");
    } else if(view === "proteins"){
      var p = PROTS[prot];
      for(var i = 0; i < 3; i++){
        var on = i === prot;
        var px = 90 + i * 180;
        m += '<rect x="' + px + '" y="110" width="160" height="110" rx="8" fill="#0f172a" stroke="' + (on ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (px + 80) + '" y="148" fill="' + (on ? "#38bdf8" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">' + PROTS[i][0] + "</text>";
        m += '<text x="' + (px + 80) + '" y="172" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="9" text-anchor="middle">' + PROTS[i][1] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + p[0] + ": " + p[1] + " · 6-8% of plasma, water 90-92%</text>";
      readout(cell("Proteins", "6-8 per cent", "#38bdf8") + cell("Water", "90-92 per cent", "#94a3b8"));
      verdict("Three proteins, three jobs.");
    } else {
      m += '<rect x="120" y="110" width="200" height="100" rx="8" fill="#0f172a" stroke="#eab308" stroke-width="2.5"/>';
      m += '<text x="220" y="150" fill="#eab308" font-size="13" font-weight="700" text-anchor="middle">plasma</text>';
      m += '<text x="220" y="172" fill="#94a3b8" font-size="10" text-anchor="middle">+ inactive clotting factors</text>';
      m += '<text x="350" y="165" fill="#64748b" font-size="22" text-anchor="middle">→</text>';
      m += '<rect x="380" y="110" width="200" height="100" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<text x="480" y="150" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">serum</text>';
      m += '<text x="480" y="172" fill="#94a3b8" font-size="10" text-anchor="middle">without the clotting factors</text>';
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">minerals + glucose + amino acids stay in transit (PDF p. 2)</text>';
      readout(cell("Serum", "plasma minus clotting factors", "#22c55e") + cell("Factors", "inactive in plasma", "#94a3b8"));
      verdict("Serum leaves the factors out.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. Blood Cell Counter (celllab) - L2, 15.1.2
// -------------------------------------------------------------------------
window.SIMS.celllab = (function(){
  var view = "rbc"; // "rbc", "wbc", "platelets"
  var WBC = [
    ["Neutrophils", "60-65%", "phagocytic", "granulocyte"],
    ["Eosinophils", "2-3%", "resist infections", "granulocyte"],
    ["Basophils", "0.5-1%", "histamine etc.", "granulocyte"],
    ["Lymphocytes", "20-25%", "immune responses", "agranulocyte"],
    ["Monocytes", "6-8%", "phagocytic", "agranulocyte"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Red cells</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f8fafc;"></span><span>White cells</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Platelets</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-rbc">RBC Census</button>' +
      '<button class="preset-btn" id="p-wbc">WBC Families</button>' +
      '<button class="preset-btn" id="p-platelets">Platelets</button>';
    document.getElementById("p-rbc").onclick = function(){ setActivePreset(this); setV("rbc"); };
    document.getElementById("p-wbc").onclick = function(){ setActivePreset(this); setV("wbc"); };
    document.getElementById("p-platelets").onclick = function(){ setActivePreset(this); setV("platelets"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "rbc"){
      c.innerHTML =
        '<div class="control-group"><label>Build:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">No nucleus, biconcave, haemoglobin.</div></div>' +
        '<div class="control-group"><label>Span:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">120 days, then the spleen.</div></div>';
    } else if(view === "wbc"){
      c.innerHTML =
        '<div class="control-group"><label>Families:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Granulocytes vs agranulocytes (PDF p. 2).</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 15.1 formed elements.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Source:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Megakaryocyte fragments.</div></div>' +
        '<div class="control-group"><label>Warning:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Low count: clotting disorders.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Formed Elements (§15.1.2)</text>';
    if(view === "rbc"){
      for(var i = 0; i < 5; i++){
        var cx = 140 + i * 105;
        m += '<ellipse cx="' + cx + '" cy="160" rx="42" ry="30" fill="#0f172a" stroke="#ef4444" stroke-width="2.5"/>';
        m += '<ellipse cx="' + cx + '" cy="160" rx="16" ry="10" fill="#09131d" stroke="#ef4444" stroke-width="1.5"/>';
      }
      m += '<text x="350" y="110" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">5 millions to 5.5 millions mm–3 · biconcave · no nucleus</text>';
      m += '<text x="350" y="230" fill="#94a3b8" font-size="11" text-anchor="middle">12-16 gms haemoglobin per 100 ml · 120 days · graveyard of RBCs (spleen)</text>';
      readout(cell("RBC", "5 millions to 5.5 millions mm–3", "#ef4444") + cell("Haemoglobin", "12-16 gms per 100 ml", "#94a3b8"));
      verdict("Red, many, short-lived.");
    } else if(view === "wbc"){
      for(var j = 0; j < 5; j++){
        var y = 76 + j * 40;
        var gran = j < 3;
        m += '<rect x="90" y="' + y + '" width="220" height="32" rx="6" fill="#0f172a" stroke="' + (gran ? "#38bdf8" : "#22c55e") + '" stroke-width="2"/>';
        m += '<text x="105" y="' + (y + 21) + '" fill="#f8fafc" font-size="11" font-weight="700">' + WBC[j][0] + "</text>";
        m += '<text x="430" y="' + (y + 21) + '" fill="' + (gran ? "#38bdf8" : "#22c55e") + '" font-size="11" text-anchor="middle">' + WBC[j][1] + "</text>";
        m += '<text x="560" y="' + (y + 21) + '" fill="#64748b" font-size="9" text-anchor="middle">' + WBC[j][2] + "</text>";
      }
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">6000-8000 mm–3 · granulocytes vs agranulocytes (PDF p. 2)</text>';
      readout(cell("WBC", "6000-8000 mm–3", "#f8fafc") + cell("Most", "neutrophils 60-65 per cent", "#38bdf8"));
      verdict("Five kinds, two families.");
    } else {
      m += '<text x="350" y="120" fill="#f59e0b" font-size="14" font-weight="700" text-anchor="middle">1,500,00-3,500,00 mm–3</text>';
      m += '<text x="350" y="150" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">thrombocytes from megakaryocytes</text>';
      for(var k = 0; k < 6; k++){
        var px2 = 170 + k * 62;
        m += '<rect x="' + px2 + '" y="180" width="44" height="26" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      }
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">release coagulation substances · low count → clotting disorders (PDF p. 3)</text>';
      readout(cell("Platelets", "1,500,00-3,500,00 mm–3", "#f59e0b") + cell("Source", "megakaryocyte fragments", "#94a3b8"));
      verdict("Fragments that clot.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 3. Grouping & Clotting Lab (grouplab) - L3, 15.1.3-15.1.4
// -------------------------------------------------------------------------
window.SIMS.grouplab = (function(){
  var view = "abo"; // "abo", "rh", "clot"
  var grp = 2;
  var GROUPS = [
    ["A", "A", "anti-B", "A, O"],
    ["B", "B", "anti-A", "B, O"],
    ["AB", "A, B", "nil", "AB, A, B, O"],
    ["O", "nil", "anti-A, B", "O"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Antigens on RBCs</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Antibodies in plasma</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Compatible donors</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-abo">ABO Table</button>' +
      '<button class="preset-btn" id="p-rh">Rh Story</button>' +
      '<button class="preset-btn" id="p-clot">Clot Chain</button>';
    document.getElementById("p-abo").onclick = function(){ setActivePreset(this); setV("abo"); };
    document.getElementById("p-rh").onclick = function(){ setActivePreset(this); setV("rh"); };
    document.getElementById("p-clot").onclick = function(){ setActivePreset(this); setV("clot"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "abo"){
      c.innerHTML =
        '<div class="control-group"><label>Recipient:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        GROUPS.map(function(g, i){ return '<button class="preset-btn" data-gp="' + i + '">' + g[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Table:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Table 15.1 donor compatibility.</div></div>';
      c.querySelectorAll("[data-gp]").forEach(function(b){ b.onclick = function(){ grp = Number(b.dataset.gp); draw(0); }; });
    } else if(view === "rh"){
      c.innerHTML =
        '<div class="control-group"><label>Antigen:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Like Rhesus monkeys; 80% Rh+ve.</div></div>' +
        '<div class="control-group"><label>Fix:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Anti-Rh antibodies after first delivery.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Trigger:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Platelet + tissue factors (PDF p. 4).</div></div>' +
        '<div class="control-group"><label>Helper:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Calcium ions: very important role.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Grouping (§15.1.3–§15.1.4)</text>';
    if(view === "abo"){
      var g = GROUPS[grp];
      for(var i = 0; i < 4; i++){
        var y = 82 + i * 44;
        var on = i === grp;
        m += '<rect x="60" y="' + y + '" width="200" height="36" rx="6" fill="#0f172a" stroke="' + (on ? "#f59e0b" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="75" y="' + (y + 23) + '" fill="' + (on ? "#f59e0b" : "#94a3b8") + '" font-size="11" font-weight="700">Group ' + GROUPS[i][0] + " · anti: " + GROUPS[i][2] + "</text>";
        m += '<text x="480" y="' + (y + 23) + '" fill="' + (on ? "#22c55e" : "#475569") + '" font-size="11" text-anchor="middle">donors: ' + GROUPS[i][3] + "</text>";
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">O: universal donors · AB: universal recipients (PDF p. 3)</text>';
      readout(cell("Group", g[0] + " (antigens " + g[1] + ")", "#f59e0b") + cell("Receives from", g[3], "#22c55e"));
      verdict(grp === 2 ? "AB receives from all." : "Match before transfusion.");
    } else if(view === "rh"){
      m += '<rect x="80" y="100" width="240" height="110" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="200" y="135" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">1st pregnancy: safe</text>';
      m += '<text x="200" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">placenta separates bloods</text>';
      m += '<text x="200" y="180" fill="#94a3b8" font-size="10" text-anchor="middle">delivery exposes mother</text>';
      m += '<rect x="380" y="100" width="240" height="110" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="500" y="135" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">later: antibodies cross</text>';
      m += '<text x="500" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">foetal RBCs destroyed</text>';
      m += '<text x="500" y="180" fill="#94a3b8" font-size="10" text-anchor="middle">erythroblastosis foetalis</text>';
      m += '<text x="350" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">Rh-ve mother × Rh+ve foetus · anti-Rh after 1st delivery (PDF p. 4)</text>';
      readout(cell("Rh+ve", "nearly 80 per cent", "#38bdf8") + cell("Risk", "second Rh+ve foetus", "#ef4444"));
      verdict("Second baby at risk.");
    } else {
      var steps = ["prothrombin", "thrombin", "fibrinogens", "fibrins → clot"];
      for(var s = 0; s < 4; s++){
        var sx = 60 + s * 155;
        m += '<rect x="' + sx + '" y="140" width="135" height="60" rx="8" fill="#0f172a" stroke="' + (s === 3 ? "#22c55e" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (sx + 67) + '" y="166" fill="#f8fafc" font-size="9.5" font-weight="700" text-anchor="middle">' + steps[s] + "</text>";
        m += '<text x="' + (sx + 67) + '" y="185" fill="#64748b" font-size="8" text-anchor="middle">' + (s === 0 ? "inactive" : s === 3 ? "coagulam" : "enzyme") + "</text>";
        if(s < 3) m += '<text x="' + (sx + 145) + '" y="175" fill="#64748b" font-size="16" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">thrombokinase cascade · calcium ions very important</text>';
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">fibrin threads trap dead and damaged cells (PDF p. 4)</text>';
      readout(cell("Threads", "fibrins trap formed elements", "#22c55e") + cell("Helper", "calcium ions", "#94a3b8"));
      verdict("Threads trap the cells.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Pathways Evolution Bench (pathlab) - L4, 15.2-15.3
// -------------------------------------------------------------------------
window.SIMS.pathlab = (function(){
  var view = "lymph"; // "lymph", "vessels", "hearts"
  var sys = 1, heart = 2;
  var HEARTS = [
    ["Fishes", "2-chambered", "single circulation"],
    ["Amphibians, reptiles", "3-chambered", "incomplete double"],
    ["Crocodiles, birds, mammals", "4-chambered", "double circulation"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Lymph</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Closed vessels</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Open sinuses</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-lymph">Lymph Chain</button>' +
      '<button class="preset-btn" id="p-vessels">Open vs Closed</button>' +
      '<button class="preset-btn" id="p-hearts">Heart Ladder</button>';
    document.getElementById("p-lymph").onclick = function(){ setActivePreset(this); setV("lymph"); };
    document.getElementById("p-vessels").onclick = function(){ setActivePreset(this); setV("vessels"); };
    document.getElementById("p-hearts").onclick = function(){ setActivePreset(this); setV("hearts"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "lymph"){
      c.innerHTML =
        '<div class="control-group"><label>Chain:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Blood to veins via tissue fluid.</div></div>' +
        '<div class="control-group"><label>Fats:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Lacteals in intestinal villi.</div></div>';
    } else if(view === "vessels"){
      c.innerHTML =
        '<div class="control-group"><label>System:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-o">Open</button>' +
        '<button class="preset-btn" id="c-c">Closed</button></div></div>' +
        '<div class="control-group"><label>Edge:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Closed: precisely regulated.</div></div>';
      document.getElementById("c-o").onclick = function(){ sys = 0; draw(0); };
      document.getElementById("c-c").onclick = function(){ sys = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Group:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        HEARTS.map(function(h, i){ return '<button class="preset-btn" data-ht="' + i + '">' + h[1] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Note:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Crocodiles excepted (PDF p. 5).</div></div>';
      c.querySelectorAll("[data-ht]").forEach(function(b){ b.onclick = function(){ heart = Number(b.dataset.ht); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Pathways (§15.2–§15.3)</text>';
    if(view === "lymph"){
      var nodes = ["blood", "tissue fluid", "lymph", "major veins"];
      for(var i = 0; i < 4; i++){
        var nx = 60 + i * 155;
        m += '<rect x="' + nx + '" y="140" width="135" height="60" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
        m += '<text x="' + (nx + 67) + '" y="175" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">' + nodes[i] + "</text>";
        if(i < 3) m += '<text x="' + (nx + 145) + '" y="175" fill="#64748b" font-size="16" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">colourless lymph · specialised lymphocytes · lacteals absorb fats</text>';
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">exchange with cells always through tissue fluid (PDF p. 5)</text>';
      readout(cell("Fluid", "tissue fluid to lymph to veins", "#22c55e") + cell("Fats", "lacteals in villi", "#94a3b8"));
      verdict("Drainage returns to veins.");
    } else if(view === "vessels"){
      var open = sys === 0;
      m += '<rect x="120" y="100" width="220" height="120" rx="8" fill="#0f172a" stroke="' + (open ? "#f59e0b" : "#334155") + '" stroke-width="2.5"/>';
      m += '<text x="230" y="135" fill="' + (open ? "#f59e0b" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">OPEN: sinuses</text>';
      m += '<text x="230" y="160" fill="#64748b" font-size="10" text-anchor="middle">arthropods, molluscs</text>';
      m += '<text x="230" y="182" fill="#64748b" font-size="10" text-anchor="middle">blood pools in cavities</text>';
      m += '<rect x="360" y="100" width="220" height="120" rx="8" fill="#0f172a" stroke="' + (!open ? "#38bdf8" : "#334155") + '" stroke-width="2.5"/>';
      m += '<text x="470" y="135" fill="' + (!open ? "#38bdf8" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">CLOSED: vessels</text>';
      m += '<text x="470" y="160" fill="#64748b" font-size="10" text-anchor="middle">annelids, chordates</text>';
      m += '<text x="470" y="182" fill="#64748b" font-size="10" text-anchor="middle">flow precisely regulated</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">closed pattern more advantageous (PDF p. 5)</text>';
      readout(cell("Closed", "annelids and chordates", "#38bdf8") + cell("Open", "arthropods and molluscs", "#f59e0b"));
      verdict(open ? "Open pools in sinuses." : "Closed means control.");
    } else {
      var h = HEARTS[heart];
      for(var j = 0; j < 3; j++){
        var on = j === heart;
        var hx = 90 + j * 180;
        m += '<rect x="' + hx + '" y="110" width="160" height="110" rx="8" fill="#0f172a" stroke="' + (on ? "#ef4444" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (hx + 80) + '" y="145" fill="' + (on ? "#ef4444" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">' + HEARTS[j][1] + "</text>";
        m += '<text x="' + (hx + 80) + '" y="168" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="9" text-anchor="middle">' + HEARTS[j][0] + "</text>";
        m += '<text x="' + (hx + 80) + '" y="188" fill="#64748b" font-size="8" text-anchor="middle">' + HEARTS[j][2] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + h[0] + ": " + h[1] + ", " + h[2] + " (PDF p. 5)</text>";
      readout(cell("Hearts", "2, 3 then 4 chambers", "#ef4444") + cell("Top", "crocodiles, birds, mammals", "#94a3b8"));
      verdict("Chambers climb upward.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 5. Heart & Cardiac Cycle Lab (heartlab) - L5, 15.3.1-15.3.2
// -------------------------------------------------------------------------
window.SIMS.heartlab = (function(){
  var view = "valves"; // "valves", "nodal", "cycle"

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Chambers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Nodal tissue</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>One-way valves</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-valves">Valves</button>' +
      '<button class="preset-btn" id="p-nodal">Nodal Wiring</button>' +
      '<button class="preset-btn" id="p-cycle">Cardiac Cycle</button>';
    document.getElementById("p-valves").onclick = function(){ setActivePreset(this); setV("valves"); };
    document.getElementById("p-nodal").onclick = function(){ setActivePreset(this); setV("nodal"); };
    document.getElementById("p-cycle").onclick = function(){ setActivePreset(this); setV("cycle"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "valves"){
      c.innerHTML =
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Flow one way; no backward flow.</div></div>' +
        '<div class="control-group"><label>Figure:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Figure 15.2 heart section.</div></div>';
    } else if(view === "nodal"){
      c.innerHTML =
        '<div class="control-group"><label>Chain:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">SAN to AVN to bundle to purkinje.</div></div>' +
        '<div class="control-group"><label>Pace:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">SAN 70-75 min–1 (PDF p. 7).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Timing:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">0.8 s per cycle at 72/min.</div></div>' +
        '<div class="control-group"><label>Sounds:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Lub (AV) then dub (semilunar).</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Heart (§15.3.1–§15.3.2)</text>';
    if(view === "valves"){
      m += '<rect x="120" y="100" width="200" height="70" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="220" y="128" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">right atrium</text>';
      m += '<text x="220" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">↓ tricuspid ↓</text>';
      m += '<rect x="120" y="180" width="200" height="70" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="220" y="208" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">right ventricle</text>';
      m += '<text x="220" y="230" fill="#94a3b8" font-size="10" text-anchor="middle">→ semilunar → lungs</text>';
      m += '<rect x="380" y="100" width="200" height="70" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="480" y="128" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">left atrium</text>';
      m += '<text x="480" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">↓ bicuspid/mitral ↓</text>';
      m += '<rect x="380" y="180" width="200" height="70" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="480" y="208" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">left ventricle</text>';
      m += '<text x="480" y="230" fill="#94a3b8" font-size="10" text-anchor="middle">→ semilunar → aorta</text>';
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">atria → ventricles → arteries; valves prevent backward flow (PDF p. 7)</text>';
      readout(cell("Right", "tricuspid (3 cusps)", "#ef4444") + cell("Left", "bicuspid or mitral", "#38bdf8"));
      verdict("One way only.");
    } else if(view === "nodal"){
      var chain = ["SAN", "AVN", "AV bundle", "purkinje fibres"];
      for(var i = 0; i < 4; i++){
        var nx = 60 + i * 155;
        m += '<rect x="' + nx + '" y="140" width="135" height="60" rx="8" fill="#0f172a" stroke="' + (i === 0 ? "#f59e0b" : "#22c55e") + '" stroke-width="2"/>';
        m += '<text x="' + (nx + 67) + '" y="175" fill="' + (i === 0 ? "#f59e0b" : "#f8fafc") + '" font-size="10" font-weight="700" text-anchor="middle">' + chain[i] + "</text>";
        if(i < 3) m += '<text x="' + (nx + 145) + '" y="175" fill="#64748b" font-size="16" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="110" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">SAN: 70-75 min–1 · autoexcitable · pacemaker</text>';
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">bundle of His through ventricles · Figure 15.2 (PDF p. 7)</text>';
      readout(cell("Pace", "SAN 70-75 min–1", "#f59e0b") + cell("Relay", "AVN to purkinje fibres", "#22c55e"));
      verdict("SAN sets the pace.");
    } else {
      m += '<text x="350" y="110" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">joint diastole → atrial systole → ventricular systole → diastole</text>';
      m += '<text x="350" y="155" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">0.8 seconds · 70 mL stroke · 5000 mL output</text>';
      m += '<text x="350" y="195" fill="#94a3b8" font-size="11" text-anchor="middle">lub: tricuspid + bicuspid shut · dub: semilunar shut</text>';
      m += '<text x="350" y="235" fill="#94a3b8" font-size="11" text-anchor="middle">atrial systole adds ~30% filling · stethoscope sounds (PDF p. 8)</text>';
      readout(cell("Cycle", "0.8 seconds", "#38bdf8") + cell("Output", "5000 mL per minute", "#94a3b8"));
      verdict("72 cycles a minute.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. ECG & Circulation Loops Lab (ecglab) - L6, 15.3.3-15.4
// -------------------------------------------------------------------------
window.SIMS.ecglab = (function(){
  var view = "ecg"; // "ecg", "loops", "tunica"
  var wave = 1;
  var WAVES = [
    ["P-wave", "atria depolarise + contract"],
    ["QRS complex", "ventricles depolarise, systole begins"],
    ["T-wave", "ventricles repolarise, systole ends"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>ECG trace</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pulmonary loop</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Systemic loop</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ecg">ECG Waves</button>' +
      '<button class="preset-btn" id="p-loops">Two Loops</button>' +
      '<button class="preset-btn" id="p-tunica">Vessel Walls</button>';
    document.getElementById("p-ecg").onclick = function(){ setActivePreset(this); setV("ecg"); };
    document.getElementById("p-loops").onclick = function(){ setActivePreset(this); setV("loops"); };
    document.getElementById("p-tunica").onclick = function(){ setActivePreset(this); setV("tunica"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "ecg"){
      c.innerHTML =
        '<div class="control-group"><label>Wave:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        WAVES.map(function(w, i){ return '<button class="preset-btn" data-wv="' + i + '">' + w[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Leads:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Two wrists + left ankle (PDF p. 9).</div></div>';
      c.querySelectorAll("[data-wv]").forEach(function(b){ b.onclick = function(){ wave = Number(b.dataset.wv); draw(0); }; });
    } else if(view === "loops"){
      c.innerHTML =
        '<div class="control-group"><label>Pump:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Right: lungs. Left: body.</div></div>' +
        '<div class="control-group"><label>Extras:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Hepatic portal + coronary (PDF p. 10).</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Layers:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Intima + media + externa.</div></div>' +
        '<div class="control-group"><label>Veins:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Media comparatively thin.</div></div>';
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">ECG (§15.3.3–§15.4)</text>';
    if(view === "ecg"){
      var w = WAVES[wave];
      m += '<line x1="100" y1="200" x2="600" y2="200" stroke="#334155" stroke-width="1.5"/>';
      m += '<path d="M100,200 L170,200 Q190,200 195,175 Q200,150 205,175 Q210,200 230,200 L280,200 L295,200 L285,230 L315,120 L345,230 L335,200 L380,200 Q420,200 440,170 Q460,140 480,170 Q500,200 540,200 L600,200" fill="none" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<text x="200" y="140" fill="' + (wave === 0 ? "#f59e0b" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">P</text>';
      m += '<text x="315" y="100" fill="' + (wave === 1 ? "#f59e0b" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">QRS</text>';
      m += '<text x="460" y="130" fill="' + (wave === 2 ? "#f59e0b" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">T</text>';
      m += '<text x="350" y="250" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">' + w[0] + ": " + w[1] + "</text>";
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">count QRS for heart beat rate · Figure 15.3 (PDF p. 9)</text>';
      readout(cell("P-wave", "atria depolarise", "#22c55e") + cell("QRS", "ventricles depolarise", "#22c55e"));
      verdict("P fires, QRS fires, T resets.");
    } else if(view === "loops"){
      m += '<rect x="90" y="100" width="240" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="210" y="135" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">PULMONARY</text>';
      m += '<text x="210" y="160" fill="#f8fafc" font-size="10" text-anchor="middle">right ventricle → lungs</text>';
      m += '<text x="210" y="180" fill="#f8fafc" font-size="10" text-anchor="middle">→ pulmonary veins → LA</text>';
      m += '<rect x="370" y="100" width="240" height="120" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2.5"/>';
      m += '<text x="490" y="135" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle">SYSTEMIC</text>';
      m += '<text x="490" y="160" fill="#f8fafc" font-size="10" text-anchor="middle">left ventricle → aorta</text>';
      m += '<text x="490" y="180" fill="#f8fafc" font-size="10" text-anchor="middle">→ vena cava → RA</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">no mixing up · Figure 15.4 (PDF pp. 9–10)</text>';
      readout(cell("Pulmonary", "right ventricle to lungs", "#38bdf8") + cell("Systemic", "left ventricle to body", "#ef4444"));
      verdict("Two loops, no mixing.");
    } else {
      var layers = ["tunica intima: squamous endothelium", "tunica media: smooth muscle + elastic", "tunica externa: fibrous + collagen"];
      for(var l = 0; l < 3; l++){
        var ly = 100 + l * 52;
        m += '<rect x="150" y="' + ly + '" width="400" height="44" rx="8" fill="#0f172a" stroke="' + (l === 1 ? "#f59e0b" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="350" y="' + (ly + 28) + '" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">' + layers[l] + "</text>";
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">media comparatively thin in the veins (PDF p. 9)</text>';
      readout(cell("Layers", "intima, media, externa", "#38bdf8") + cell("Veins", "media comparatively thin", "#f59e0b"));
      verdict("Veins run thinner.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 7. Cardiac Control & Disorders Lab (regulab) - L7, 15.5-15.6
// -------------------------------------------------------------------------
window.SIMS.regulab = (function(){
  var view = "nerve"; // "nerve", "pressure", "disorders"
  var branch = 0, dis = 0;
  var DIS = [
    ["Hypertension", "140/90 or higher", "brain and kidney at risk"],
    ["CAD", "narrower lumen", "calcium, fat, cholesterol"],
    ["Angina", "acute chest pain", "heart muscle lacks oxygen"],
    ["Heart failure", "weak pumping", "lung congestion"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Speed up</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Slow down</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Disorder</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-nerve">ANS Tuning</button>' +
      '<button class="preset-btn" id="p-pressure">Blood Pressure</button>' +
      '<button class="preset-btn" id="p-disorders">Disorders</button>';
    document.getElementById("p-nerve").onclick = function(){ setActivePreset(this); setV("nerve"); };
    document.getElementById("p-pressure").onclick = function(){ setActivePreset(this); setV("pressure"); };
    document.getElementById("p-disorders").onclick = function(){ setActivePreset(this); setV("disorders"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "nerve"){
      c.innerHTML =
        '<div class="control-group"><label>Branch:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-b0">Sympathetic</button>' +
        '<button class="preset-btn" id="c-b1">Parasympathetic</button></div></div>' +
        '<div class="control-group"><label>Backup:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Adrenal medullary hormones up output.</div></div>';
      document.getElementById("c-b0").onclick = function(){ branch = 0; draw(0); };
      document.getElementById("c-b1").onclick = function(){ branch = 1; draw(0); };
    } else if(view === "pressure"){
      c.innerHTML =
        '<div class="control-group"><label>Units:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">mm Hg, systolic over diastolic.</div></div>' +
        '<div class="control-group"><label>Risk:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Heart diseases + brain, kidney.</div></div>';
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Disorder:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        DIS.map(function(d, i){ return '<button class="preset-btn" data-ds="' + i + '">' + d[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Note:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Failure ≠ arrest ≠ attack.</div></div>';
      c.querySelectorAll("[data-ds]").forEach(function(b){ b.onclick = function(){ dis = Number(b.dataset.ds); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Control (§15.5–§15.6)</text>';
    if(view === "nerve"){
      var sym = branch === 0;
      m += '<rect x="120" y="110" width="200" height="100" rx="8" fill="#0f172a" stroke="' + (sym ? "#22c55e" : "#334155") + '" stroke-width="2.5"/>';
      m += '<text x="220" y="148" fill="' + (sym ? "#22c55e" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">sympathetic</text>';
      m += '<text x="220" y="172" fill="#64748b" font-size="10" text-anchor="middle">rate up, output up</text>';
      m += '<rect x="380" y="110" width="200" height="100" rx="8" fill="#0f172a" stroke="' + (!sym ? "#38bdf8" : "#334155") + '" stroke-width="2.5"/>';
      m += '<text x="480" y="148" fill="' + (!sym ? "#38bdf8" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">parasympathetic</text>';
      m += '<text x="480" y="172" fill="#64748b" font-size="10" text-anchor="middle">rate down, output down</text>';
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">medulla oblangata centre · myogenic idle (PDF p. 10)</text>';
      readout(cell("Centre", "medulla oblangata", "#94a3b8") + cell(sym ? "Sympathetic" : "Parasympathetic", sym ? "rate up, output up" : "rate down, output down", sym ? "#22c55e" : "#38bdf8"));
      verdict(sym ? "ANS tunes the idle." : "Rest and slow down.");
    } else if(view === "pressure"){
      m += '<rect x="120" y="110" width="200" height="100" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<text x="220" y="150" fill="#22c55e" font-size="16" font-weight="700" text-anchor="middle">120/80</text>';
      m += '<text x="220" y="175" fill="#64748b" font-size="10" text-anchor="middle">normal mm Hg</text>';
      m += '<rect x="380" y="110" width="200" height="100" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2.5"/>';
      m += '<text x="480" y="150" fill="#ef4444" font-size="16" font-weight="700" text-anchor="middle">140/90</text>';
      m += '<text x="480" y="175" fill="#64748b" font-size="10" text-anchor="middle">or higher: hypertension</text>';
      m += '<text x="350" y="252" fill="#94a3b8" font-size="11" text-anchor="middle">systolic pumping over diastolic resting (PDF p. 10)</text>';
      readout(cell("Normal", "120/80 mm Hg", "#22c55e") + cell("High", "140/90 or higher", "#ef4444"));
      verdict("140/90 is the line.");
    } else {
      var d = DIS[dis];
      for(var i = 0; i < 4; i++){
        var on = i === dis;
        var dx = 60 + i * 155;
        m += '<rect x="' + dx + '" y="110" width="140" height="110" rx="8" fill="#0f172a" stroke="' + (on ? "#ef4444" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (dx + 70) + '" y="145" fill="' + (on ? "#ef4444" : "#475569") + '" font-size="10" font-weight="700" text-anchor="middle">' + DIS[i][0] + "</text>";
        m += '<text x="' + (dx + 70) + '" y="168" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="9" font-weight="700" text-anchor="middle">' + DIS[i][1] + "</text>";
        m += '<text x="' + (dx + 70) + '" y="188" fill="#64748b" font-size="7.5" text-anchor="middle">' + DIS[i][2] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + d[0] + ": " + d[2] + " (PDF p. 11)</text>";
      readout(cell("Disorder", d[0], "#ef4444") + cell("Marks", d[1], "#94a3b8"));
      verdict(dis === 0 ? "Pressure over the line." : dis === 1 ? "Pipes narrow down." : dis === 2 ? "Muscle starved of oxygen." : "Pump too weak.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-114 -
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
