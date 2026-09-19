// kebo112 interactive simulations: Respiration in Plants (Ch. 12, print pp. 153-165)
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
// 1. Gas Exchange & Stepwise Strategy Bench (breathlab) - L1, 12.1
// -------------------------------------------------------------------------
window.SIMS.breathlab = (function(){
  var view = "reasons"; // "reasons", "strategy", "currency"
  var why = 0, step = false, spent = false;
  var WHYS = [
    ["Self-sufficient parts", "little inter-part transport"],
    ["Low demand", "far below animals; own O2 in light"],
    ["Short paths", "surface cells + lenticels + air spaces"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Stomata / lenticels</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Heat lost</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>ATP banked</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-reasons">Why No Lungs</button>' +
      '<button class="preset-btn" id="p-strategy">Heat vs Steps</button>' +
      '<button class="preset-btn" id="p-currency">ATP Currency</button>';
    document.getElementById("p-reasons").onclick = function(){ setActivePreset(this); setV("reasons"); };
    document.getElementById("p-strategy").onclick = function(){ setActivePreset(this); setV("strategy"); };
    document.getElementById("p-currency").onclick = function(){ setActivePreset(this); setV("currency"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "reasons"){
      c.innerHTML =
        '<div class="control-group"><label>Reason:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        WHYS.map(function(w, i){ return '<button class="preset-btn" data-wy="' + i + '">' + (i + 1) + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Organs:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Stomata + lenticels only.</div></div>';
      c.querySelectorAll("[data-wy]").forEach(function(b){ b.onclick = function(){ why = Number(b.dataset.wy); draw(0); }; });
    } else if(view === "strategy"){
      c.innerHTML =
        '<div class="control-group"><label>Glucose fate:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-f0">Combustion (1 step)</button>' +
        '<button class="preset-btn" id="c-f1">Respiration (steps)</button></div></div>' +
        '<div class="control-group"><label>Equation:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">C6H12O6 + 6O2 \u2192 6CO2 + 6H2O + Energy.</div></div>';
      document.getElementById("c-f0").onclick = function(){ step = false; draw(0); };
      document.getElementById("c-f1").onclick = function(){ step = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>ATP:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-a0">Earn (oxidation)</button>' +
        '<button class="preset-btn" id="c-a1">Spend (anywhere)</button></div></div>' +
        '<div class="control-group"><label>Plus:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Carbon skeletons \u2192 biosynthesis.</div></div>';
      document.getElementById("c-a0").onclick = function(){ spent = false; draw(0); };
      document.getElementById("c-a1").onclick = function(){ spent = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Do Plants Breathe? (\u00A712.1)</text>';
    if(view === "reasons"){
      var w = WHYS[why];
      for(var i = 0; i < 3; i++){
        var x = 70 + i * 190;
        var on = i === why;
        m += '<rect x="' + x + '" y="110" width="170" height="100" rx="8" fill="#0f172a" stroke="' + (on ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 85) + '" y="145" fill="' + (on ? "#22c55e" : "#475569") + '" font-size="10" font-weight="700" text-anchor="middle">' + WHYS[i][0] + "</text>";
        m += '<text x="' + (x + 85) + '" y="170" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="8" text-anchor="middle">' + WHYS[i][1] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Stems: thin living rind + lenticels; dead core supports (PDF p. 3)</text>';
      readout(cell("Reason", (why + 1) + "/3", "#22c55e") + cell("Says", w[0], "#94a3b8"));
      verdict("No specialised organs needed.");
    } else if(view === "strategy"){
      if(!step){
        m += '<rect x="150" y="130" width="170" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="235" y="170" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">Glucose</text>';
        m += '<text x="350" y="172" fill="#64748b" font-size="18" text-anchor="middle">\u2192</text>';
        m += '<rect x="380" y="130" width="170" height="80" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        m += '<text x="465" y="163" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">CO2 + H2O</text>';
        m += '<text x="465" y="183" fill="#f59e0b" font-size="10" text-anchor="middle">mostly heat</text>';
      } else {
        for(var j = 0; j < 4; j++){
          var jx = 90 + j * 135;
          m += '<rect x="' + jx + '" y="130" width="115" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
          m += '<text x="' + (jx + 57) + '" y="166" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">step ' + (j + 1) + "</text>";
          m += '<text x="' + (jx + 57) + '" y="184" fill="#94a3b8" font-size="9" text-anchor="middle">' + (j % 2 === 0 ? "some \u2192 ATP" : "small heat") + "</text>";
          if(j < 3) m += '<text x="' + (jx + 125) + '" y="172" fill="#64748b" font-size="14" text-anchor="middle">\u2192</text>';
        }
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + (step ? "Steps sized to couple with ATP synthesis (PDF p. 3)" : "One-step burn wastes energy as heat") + "</text>";
      readout(cell("Mode", step ? "respiration" : "combustion", step ? "#38bdf8" : "#f59e0b") + cell("Energy", step ? "ATP-coupled" : "heat", "#94a3b8"));
      verdict(step ? "The strategy that IS respiration." : "Useful to cells? No.");
    } else {
      m += '<circle cx="' + (spent ? 470 : 230) + '" cy="170" r="45" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="' + (spent ? 470 : 230) + '" y="178" fill="#38bdf8" font-size="16" font-weight="700" text-anchor="middle">ATP</text>';
      m += '<text x="230" y="240" fill="#94a3b8" font-size="10" text-anchor="middle">made at oxidation</text>';
      m += '<text x="470" y="240" fill="#94a3b8" font-size="10" text-anchor="middle">spent whenever/wherever</text>';
      m += '<text x="350" y="120" fill="' + (spent ? "#f59e0b" : "#22c55e") + '" font-size="12" font-weight="700" text-anchor="middle">' + (spent ? "Broken down for work" : "Trapped from oxidation") + "</text>";
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">Energy currency of the cell (PDF p. 2)</text>';
      readout(cell("ATP", spent ? "spent" : "banked", spent ? "#f59e0b" : "#22c55e"));
      verdict(spent ? "Spent on energy-requiring processes." : "Banked from stepwise oxidation.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. EMP Chain & ATP Ledger Lab (glycolab) - L2, 12.2
// -------------------------------------------------------------------------
window.SIMS.glycolab = (function(){
  var view = "chain"; // "chain", "ledger", "fates"
  var node = 0, show = 0, fate = 0;
  var NODES = [
    ["Glucose", "6C in"],
    ["Primed sugars", "2 ATP spent"],
    ["Split trioses", "DHAP + PGAL"],
    ["Pay windows", "ATP + NADH out"],
    ["2 Pyruvate", "3C each"]
  ];
  var FATES = [
    ["Lactic fermentation", "muscle/bacteria, no O2"],
    ["Alcoholic fermentation", "yeast, no O2"],
    ["Aerobic respiration", "mitochondria, O2"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sugar chain (6C\u21923C)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>ATP tolls</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>ATP/NADH payback</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-chain">EMP Chain</button>' +
      '<button class="preset-btn" id="p-ledger">Tolls &amp; Pay</button>' +
      '<button class="preset-btn" id="p-fates">Pyruvate Fates</button>';
    document.getElementById("p-chain").onclick = function(){ setActivePreset(this); setV("chain"); };
    document.getElementById("p-ledger").onclick = function(){ setActivePreset(this); setV("ledger"); };
    document.getElementById("p-fates").onclick = function(){ setActivePreset(this); setV("fates"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "chain"){
      c.innerHTML =
        '<div class="control-group"><label>Node:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        NODES.map(function(nd, i){ return '<button class="preset-btn" data-nd="' + i + '">' + nd[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Venue:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cytoplasm, all organisms, 10 reactions.</div></div>';
      c.querySelectorAll("[data-nd]").forEach(function(b){ b.onclick = function(){ node = Number(b.dataset.nd); draw(0); }; });
    } else if(view === "ledger"){
      c.innerHTML =
        '<div class="control-group"><label>Show:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-g0">Tolls (2 spent)</button>' +
        '<button class="preset-btn" id="c-g1">Payback (4 made)</button></div></div>' +
        '<div class="control-group"><label>Net:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">4 \u2212 2 = 2 ATP per glucose.</div></div>';
      document.getElementById("c-g0").onclick = function(){ show = 0; draw(0); };
      document.getElementById("c-g1").onclick = function(){ show = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Fate:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        FATES.map(function(f, i){ return '<button class="preset-btn" data-ft="' + i + '">' + f[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Decides:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cellular need.</div></div>';
      c.querySelectorAll("[data-ft]").forEach(function(b){ b.onclick = function(){ fate = Number(b.dataset.ft); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Glycolysis (\u00A712.2)</text>';
    if(view === "chain"){
      var nd = NODES[node];
      for(var i = 0; i < 5; i++){
        var x = 30 + i * 130;
        var on = i === node;
        m += '<rect x="' + x + '" y="120" width="118" height="95" rx="8" fill="#0f172a" stroke="' + (on ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 59) + '" y="155" fill="' + (on ? "#38bdf8" : "#475569") + '" font-size="9" font-weight="700" text-anchor="middle">' + NODES[i][0] + "</text>";
        m += '<text x="' + (x + 59) + '" y="178" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="8" text-anchor="middle">' + NODES[i][1] + "</text>";
        if(i < 4) m += '<text x="' + (x + 124) + '" y="170" fill="#64748b" font-size="14" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">EMP: Embden + Meyerhof + Parnas \u00B7 Fig. 12.1 (PDF p. 4)</text>';
      readout(cell("Node", nd[0], "#38bdf8") + cell("Marks", nd[1], "#94a3b8"));
      verdict("Ten reactions, one chain.");
    } else if(view === "ledger"){
      if(show === 0){
        m += '<text x="250" y="165" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">Glucose \u2192 G6P (1 ATP)</text>';
        m += '<text x="250" y="195" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">F6P \u2192 F1,6BP (1 ATP)</text>';
        m += '<text x="470" y="180" fill="#f59e0b" font-size="16" font-weight="700" text-anchor="middle">\u22122</text>';
      } else {
        m += '<text x="250" y="150" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">BPGA \u2192 PGA (\u00D72 trioses)</text>';
        m += '<text x="250" y="180" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">PEP \u2192 pyruvate (\u00D72 trioses)</text>';
        m += '<text x="470" y="165" fill="#22c55e" font-size="16" font-weight="700" text-anchor="middle">+4</text>';
        m += '<text x="250" y="215" fill="#38bdf8" font-size="11" text-anchor="middle">+ 2 NADH at PGAL \u2192 BPGA</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Net per glucose: 2 ATP (+ 2 NADH for later)</text>';
      readout(cell("Side", show === 0 ? "tolls" : "payback", show === 0 ? "#f59e0b" : "#22c55e") + cell("ATP", show === 0 ? "\u22122" : "+4", "#94a3b8"));
      verdict(show === 0 ? "Priming costs two." : "Pay windows return four.");
    } else {
      var f = FATES[fate];
      m += '<circle cx="350" cy="120" r="34" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="350" y="125" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">pyruvate</text>';
      for(var k = 0; k < 3; k++){
        var kx = 130 + k * 180;
        var on = k === fate;
        m += '<line x1="350" y1="154" x2="' + (kx + 75) + '" y2="190" stroke="#64748b" stroke-width="1.5"/>';
        m += '<rect x="' + kx + '" y="190" width="150" height="60" rx="8" fill="#0f172a" stroke="' + (on ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (kx + 75) + '" y="214" fill="' + (on ? "#22c55e" : "#475569") + '" font-size="9" font-weight="700" text-anchor="middle">' + FATES[k][0] + "</text>";
        m += '<text x="' + (kx + 75) + '" y="232" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="8" text-anchor="middle">' + FATES[k][1] + "</text>";
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">Key product; fate follows cellular need (PDF p. 4)</text>';
      readout(cell("Fate", f[0], "#22c55e") + cell("Needs", f[1], "#94a3b8"));
      verdict("One pyruvate, three doors.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 3. Anaerobic Fates & Yield Bench (fermentlab) - L3, 12.3
// -------------------------------------------------------------------------
window.SIMS.fermentlab = (function(){
  var view = "yeast"; // "yeast", "muscle", "yield"
  var stepY = 0, stepM = 0, pct = 5;
  var YS = [["Pyruvate", "from glycolysis"], ["Decarboxylate", "CO2 out (decarboxylase)"], ["Ethanol", "alcohol dehydrogenase"]];
  var MS = [["Pyruvate", "exercise, low O2"], ["Reduce", "lactate dehydrogenase"], ["Lactic acid", "NAD+ back"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pyruvate in</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Acid / alcohol out</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>NAD+ recycled</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-yeast">Yeast Route</button>' +
      '<button class="preset-btn" id="p-muscle">Muscle Route</button>' +
      '<button class="preset-btn" id="p-yield">Yield + Ceiling</button>';
    document.getElementById("p-yeast").onclick = function(){ setActivePreset(this); setV("yeast"); };
    document.getElementById("p-muscle").onclick = function(){ setActivePreset(this); setV("muscle"); };
    document.getElementById("p-yield").onclick = function(){ setActivePreset(this); setV("yield"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "yeast"){
      c.innerHTML =
        '<div class="control-group"><label>Step:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        YS.map(function(s, i){ return '<button class="preset-btn" data-ys="' + i + '">' + s[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Enzymes:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Decarboxylase + alcohol dehydrogenase.</div></div>';
      c.querySelectorAll("[data-ys]").forEach(function(b){ b.onclick = function(){ stepY = Number(b.dataset.ys); draw(0); }; });
    } else if(view === "muscle"){
      c.innerHTML =
        '<div class="control-group"><label>Step:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        MS.map(function(s, i){ return '<button class="preset-btn" data-ms="' + i + '">' + s[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Same in:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Some lactic bacteria.</div></div>';
      c.querySelectorAll("[data-ms]").forEach(function(b){ b.onclick = function(){ stepM = Number(b.dataset.ms); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Alcohol %:</label><input id="c-alc" type="range" min="0" max="15" value="' + pct + '" style="width:100%;margin-top:4px;"></div>' +
        '<div class="control-group"><label>Yield:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Under 7% energy; net 2 ATP.</div></div>';
      document.getElementById("c-alc").oninput = function(){ pct = Number(this.value); draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Fermentation (\u00A712.3)</text>';
    if(view === "yeast" || view === "muscle"){
      var arr = view === "yeast" ? YS : MS;
      var cur = view === "yeast" ? stepY : stepM;
      for(var i = 0; i < 3; i++){
        var x = 70 + i * 190;
        var on = i <= cur;
        m += '<rect x="' + x + '" y="120" width="170" height="95" rx="8" fill="#0f172a" stroke="' + (on ? (i === 2 ? "#f59e0b" : "#38bdf8") : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 85) + '" y="155" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="10" font-weight="700" text-anchor="middle">' + arr[i][0] + "</text>";
        m += '<text x="' + (x + 85) + '" y="178" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="8" text-anchor="middle">' + arr[i][1] + "</text>";
        if(i < 2) m += '<text x="' + (x + 180) + '" y="168" fill="#64748b" font-size="16" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">NADH + H+ reoxidised to NAD+ (Fig. 12.2)</text>';
      readout(cell("Step", arr[cur][0], "#38bdf8") + cell("NAD+", cur === 2 ? "recycled" : "used", cur === 2 ? "#22c55e" : "#94a3b8"));
      verdict(cur === 2 ? (view === "yeast" ? "Ethanol + CO2 brewed." : "Lactic acid formed.") : "Anaerobic, incomplete oxidation.");
    } else {
      var dead = pct >= 13;
      m += '<rect x="200" y="110" width="300" height="40" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>';
      m += '<rect x="200" y="110" width="' + Math.min(300, pct * 20) + '" height="40" rx="8" fill="' + (dead ? "#7f1d1d" : "#f59e0b") + '" opacity="0.7"/>';
      m += '<line x1="' + (200 + 13 * 20) + '" y1="100" x2="' + (200 + 13 * 20) + '" y2="160" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,3"/>';
      m += '<text x="' + (200 + 13 * 20) + '" y="92" fill="#ef4444" font-size="10" font-weight="700" text-anchor="middle">13% death line</text>';
      m += '<text x="350" y="185" fill="' + (dead ? "#ef4444" : "#f8fafc") + '" font-size="14" font-weight="700" text-anchor="middle">' + pct + "% alcohol \u2014 " + (dead ? "yeast dead" : "yeast alive") + "</text>";
      m += '<text x="350" y="230" fill="#94a3b8" font-size="11" text-anchor="middle">Energy out: &lt;7% of glucose \u00B7 net 2 ATP \u00B7 hazardous</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Natural beverages cannot exceed ~13% (PDF p. 5)</text>';
      readout(cell("Alcohol", pct + "%", dead ? "#ef4444" : "#f59e0b") + cell("Yeast", dead ? "dead" : "alive", dead ? "#ef4444" : "#22c55e"));
      verdict(dead ? "Poisoned by its own product." : "Fermenting within the ceiling.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Link Reaction & TCA Wheel Lab (tcalab) - L4, 12.4-12.4.1
// -------------------------------------------------------------------------
window.SIMS.tcalab = (function(){
  var view = "link"; // "link", "wheel", "tally"
  var linked = false, turn = 0, show = 0;
  var WHEEL = [
    ["Acetyl + OAA", "citrate synthase"],
    ["Citrate \u2192 isocitrate", "isomerise"],
    ["\u03B1-KG", "CO2 + NADH out"],
    ["Succinyl-CoA", "CO2 + NADH out"],
    ["Succinate", "GTP made"],
    ["Malate \u2192 OAA", "FADH2 + NADH out"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Carbon acids</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>CO2 out</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>NADH / FADH2 / GTP</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-link">Link Reaction</button>' +
      '<button class="preset-btn" id="p-wheel">TCA Wheel</button>' +
      '<button class="preset-btn" id="p-tally">Redox Tally</button>';
    document.getElementById("p-link").onclick = function(){ setActivePreset(this); setV("link"); };
    document.getElementById("p-wheel").onclick = function(){ setActivePreset(this); setV("wheel"); };
    document.getElementById("p-tally").onclick = function(){ setActivePreset(this); setV("tally"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "link"){
      c.innerHTML =
        '<div class="control-group"><label>Pyruvate:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-l0">Arrives (matrix)</button>' +
        '<button class="preset-btn" id="c-l1">Decarboxylate</button></div></div>' +
        '<div class="control-group"><label>Needs:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Pyruvic dehydrogenase + NAD+ + CoA + Mg2+.</div></div>';
      document.getElementById("c-l0").onclick = function(){ linked = false; draw(0); };
      document.getElementById("c-l1").onclick = function(){ linked = true; draw(0); };
    } else if(view === "wheel"){
      c.innerHTML =
        '<div class="control-group"><label>Arc:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        WHEEL.map(function(w, i){ return '<button class="preset-btn" data-wh="' + i + '">' + w[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>After:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Hans Krebs; Fig. 12.3.</div></div>';
      c.querySelectorAll("[data-wh]").forEach(function(b){ b.onclick = function(){ turn = Number(b.dataset.wh); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Count:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-t0">Per turn</button>' +
        '<button class="preset-btn" id="c-t1">Per glucose</button></div></div>' +
        '<div class="control-group"><label>Print:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">FAD+ (not FAD); 8 NADH + 2 FADH2.</div></div>';
      document.getElementById("c-t0").onclick = function(){ show = 0; draw(0); };
      document.getElementById("c-t1").onclick = function(){ show = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Krebs Cycle (\u00A712.4\u2013\u00A712.4.1)</text>';
    if(view === "link"){
      if(!linked){
        m += '<text x="350" y="160" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">Pyruvic acid + CoA + NAD+ (Mg2+)</text>';
        m += '<text x="350" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">transported cytoplasm \u2192 matrix</text>';
      } else {
        m += '<text x="200" y="160" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">Acetyl CoA</text>';
        m += '<text x="350" y="160" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">CO2</text>';
        m += '<text x="500" y="160" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">NADH + H+</text>';
        m += '<text x="350" y="200" fill="#94a3b8" font-size="11" text-anchor="middle">oxidative decarboxylation (2\u00D7 per glucose)</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Text: pyruvic dehydrogenase; equation: Pyruvate dehydrogenase (PDF p. 6)</text>';
      readout(cell("Link", linked ? "done" : "waiting", linked ? "#22c55e" : "#38bdf8"));
      verdict(linked ? "Acetyl CoA enters the wheel." : "Decarboxylate pyruvate first.");
    } else if(view === "wheel"){
      var w = WHEEL[turn];
      m += '<circle cx="350" cy="170" r="70" fill="none" stroke="#1e293b" stroke-width="2"/>';
      for(var i = 0; i < 6; i++){
        var ang = -Math.PI / 2 + i * Math.PI / 3;
        var dx = 350 + 70 * Math.cos(ang), dy = 170 + 70 * Math.sin(ang);
        m += '<circle cx="' + dx + '" cy="' + dy + '" r="' + (i === turn ? 12 : 7) + '" fill="' + (i === turn ? "#38bdf8" : "#0f172a") + '" stroke="#38bdf8" stroke-width="2"/>';
      }
      m += '<text x="350" y="163" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">' + w[0] + "</text>";
      m += '<text x="350" y="181" fill="#94a3b8" font-size="9" text-anchor="middle">' + w[1] + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">OAA in = OAA out \u00B7 citrate \u2192 \u03B1-KG \u2192 succinyl \u2192 succinate \u2192 malate (PDF p. 7)</text>';
      readout(cell("Arc", w[0], "#38bdf8") + cell("Marks", w[1], "#94a3b8"));
      verdict("One turn per acetyl.");
    } else {
      var vals = show === 0 ? ["3 NADH", "1 FADH2", "1 GTP"] : ["8 NADH", "2 FADH2", "2 ATP"];
      m += '<text x="350" y="100" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + (show === 0 ? "Per TCA turn" : "Per glucose (link + 2 turns)") + "</text>";
      vals.forEach(function(v, i){
        var vx = 150 + i * 140;
        m += '<rect x="' + vx + '" y="130" width="120" height="70" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
        m += '<text x="' + (vx + 60) + '" y="172" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">' + v + "</text>";
      });
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + (show === 0 ? "Substrate-level GTP \u2192 GDP + ATP (PDF p. 7)" : "O2 still unused; harvest comes via ETS") + "</text>";
      readout(cell("NADH", vals[0], "#22c55e") + cell("FADH2", vals[1], "#22c55e") + cell("P", vals[2], "#f59e0b"));
      verdict(show === 0 ? "Turn tally: 3 + 1 + 1." : "Glucose tally: 8 + 2 + 2.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 5. Electron Chain & ATP Synthase Lab (etslab) - L5, 12.4.2
// -------------------------------------------------------------------------
window.SIMS.etslab = (function(){
  var view = "chain"; // "chain", "payout", "synthase"
  var cx = 0, donor = 0, protons = 0;
  var CXS = [
    ["Complex I", "NADH dehydrogenase"],
    ["Complex II", "FADH2 from succinate"],
    ["Ubiquinone", "mobile pool"],
    ["Complex III", "cytochrome bc1"],
    ["Cytochrome c", "mobile carrier"],
    ["Complex IV", "a + a3 + copper"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Complexes I\u2013IV</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Mobile carriers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>ATP synthase (V)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-chain">Chain Walk</button>' +
      '<button class="preset-btn" id="p-payout">3 vs 2</button>' +
      '<button class="preset-btn" id="p-synthase">F0/F1 Fall</button>';
    document.getElementById("p-chain").onclick = function(){ setActivePreset(this); setV("chain"); };
    document.getElementById("p-payout").onclick = function(){ setActivePreset(this); setV("payout"); };
    document.getElementById("p-synthase").onclick = function(){ setActivePreset(this); setV("synthase"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "chain"){
      c.innerHTML =
        '<div class="control-group"><label>Carrier:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        CXS.map(function(x, i){ return '<button class="preset-btn" data-cx="' + i + '">' + x[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>End:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">O2 \u2192 H2O (final H acceptor).</div></div>';
      c.querySelectorAll("[data-cx]").forEach(function(b){ b.onclick = function(){ cx = Number(b.dataset.cx); draw(0); }; });
    } else if(view === "payout"){
      c.innerHTML =
        '<div class="control-group"><label>Donor:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-d0">NADH (3 ATP)</button>' +
        '<button class="preset-btn" id="c-d1">FADH2 (2 ATP)</button></div></div>' +
        '<div class="control-group"><label>Why:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Number depends on donor (entry point).</div></div>';
      document.getElementById("c-d0").onclick = function(){ donor = 0; draw(0); };
      document.getElementById("c-d1").onclick = function(){ donor = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Protons fallen:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-h0">0 (no ATP)</button>' +
        '<button class="preset-btn" id="c-h1">4 (one ATP)</button></div></div>' +
        '<div class="control-group"><label>Parts:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">F1 head (catalytic) + F0 channel.</div></div>';
      document.getElementById("c-h0").onclick = function(){ protons = 0; draw(0); };
      document.getElementById("c-h1").onclick = function(){ protons = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">ETS (\u00A712.4.2)</text>';
    if(view === "chain"){
      var c = CXS[cx];
      for(var i = 0; i < 6; i++){
        var x = 30 + i * 108;
        var on = i === cx;
        var mob = i === 2 || i === 4;
        m += '<rect x="' + x + '" y="120" width="100" height="95" rx="8" fill="#0f172a" stroke="' + (on ? (mob ? "#f59e0b" : "#38bdf8") : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 50) + '" y="155" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="9" font-weight="700" text-anchor="middle">' + CXS[i][0] + "</text>";
        m += '<text x="' + (x + 50) + '" y="178" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="7" text-anchor="middle">' + CXS[i][1] + "</text>";
        if(i < 5) m += '<text x="' + (x + 104) + '" y="170" fill="#64748b" font-size="12" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Inner mitochondrial membrane \u00B7 cyt c on outer surface (Fig. 12.4)</text>';
      readout(cell("Carrier", c[0], "#38bdf8") + cell("Marks", c[1], "#94a3b8"));
      verdict("Electrons fall carrier to carrier.");
    } else if(view === "payout"){
      m += '<text x="350" y="120" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + (donor === 0 ? "NADH boards at complex I" : "FADH2 boards at complex II") + "</text>";
      m += '<text x="350" y="170" fill="' + (donor === 0 ? "#22c55e" : "#38bdf8") + '" font-size="20" font-weight="700" text-anchor="middle">' + (donor === 0 ? "3 ATP" : "2 ATP") + "</text>";
      m += '<text x="350" y="205" fill="#94a3b8" font-size="11" text-anchor="middle">' + (donor === 0 ? "Full fall through every coupling site" : "Shorter fall, smaller wage") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Depends on the nature of the electron donor (PDF p. 8)</text>';
      readout(cell("Donor", donor === 0 ? "NADH" : "FADH2", "#38bdf8") + cell("Pays", donor === 0 ? "3 ATP" : "2 ATP", "#22c55e"));
      verdict(donor === 0 ? "Top entry, full payout." : "Late entry, reduced payout.");
    } else {
      var dots = protons === 0 ? 0 : 4;
      m += '<rect x="150" y="90" width="400" height="50" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="350" y="119" fill="#94a3b8" font-size="11" text-anchor="middle">intermembrane space (protons banked)</text>';
      m += '<rect x="310" y="140" width="80" height="70" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<text x="350" y="172" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">F0</text>';
      m += '<rect x="290" y="210" width="120" height="40" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<text x="350" y="235" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">F1 \u2192 ATP</text>';
      for(var d = 0; d < dots; d++) m += '<circle cx="' + (330 + d * 14) + '" cy="190" r="5" fill="#f59e0b"/>';
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">4H+ fall \u2192 one ATP (Fig. 12.5, PDF p. 9)</text>';
      readout(cell("Protons", protons === 0 ? "0" : "4", protons === 0 ? "#94a3b8" : "#f59e0b") + cell("ATP", protons === 0 ? "0" : "1", protons === 0 ? "#94a3b8" : "#22c55e"));
      verdict(protons === 0 ? "No fall, no coin." : "Gradient cashed at F1.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. ATP Assumptions & Fermentation Contrast Lab (balancelab) - L6, 12.5
// -------------------------------------------------------------------------
window.SIMS.balancelab = (function(){
  var view = "assume"; // "assume", "build", "contrast"
  var asm = 0, block = 0, side = 0;
  var ASMS = [
    ["Orderly series", "glycolysis \u2192 TCA \u2192 ETS"],
    ["NADH in", "glycolytic NADH phosphorylated"],
    ["No diversions", "intermediates stay in lane"],
    ["Glucose only", "nothing else enters"]
  ];
  var BLOCKS = [["Direct ATP", "2 + 2 = 4"], ["NADH share", "10 \u00D7 3 = 30"], ["FADH2 share", "2 \u00D7 2 = 4"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Assumptions</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>ATP blocks</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fermentation side</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-assume">Four Terms</button>' +
      '<button class="preset-btn" id="p-build">Build 38</button>' +
      '<button class="preset-btn" id="p-contrast">Aerobic vs Ferm</button>';
    document.getElementById("p-assume").onclick = function(){ setActivePreset(this); setV("assume"); };
    document.getElementById("p-build").onclick = function(){ setActivePreset(this); setV("build"); };
    document.getElementById("p-contrast").onclick = function(){ setActivePreset(this); setV("contrast"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "assume"){
      c.innerHTML =
        '<div class="control-group"><label>Assumption:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        ASMS.map(function(a, i){ return '<button class="preset-btn" data-am="' + i + '">' + (i + 1) + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Truth:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Living systems break all four.</div></div>';
      c.querySelectorAll("[data-am]").forEach(function(b){ b.onclick = function(){ asm = Number(b.dataset.am); draw(0); }; });
    } else if(view === "build"){
      c.innerHTML =
        '<div class="control-group"><label>Block:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        BLOCKS.map(function(b, i){ return '<button class="preset-btn" data-bl="' + i + '">' + b[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Total:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">4 + 30 + 4 = 38 ATP.</div></div>';
      c.querySelectorAll("[data-bl]").forEach(function(b){ b.onclick = function(){ block = Number(b.dataset.bl); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Side:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-s0">Fermentation</button>' +
        '<button class="preset-btn" id="c-s1">Aerobic</button></div></div>' +
        '<div class="control-group"><label>Recycling:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Slow vs vigorous NAD+ return.</div></div>';
      document.getElementById("c-s0").onclick = function(){ side = 0; draw(0); };
      document.getElementById("c-s1").onclick = function(){ side = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Balance Sheet (\u00A712.5)</text>';
    if(view === "assume"){
      var a = ASMS[asm];
      for(var i = 0; i < 4; i++){
        var x = 45 + i * 160;
        var on = i === asm;
        m += '<rect x="' + x + '" y="120" width="140" height="95" rx="8" fill="#0f172a" stroke="' + (on ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 70) + '" y="152" fill="' + (on ? "#38bdf8" : "#475569") + '" font-size="10" font-weight="700" text-anchor="middle">' + (i + 1) + ". " + ASMS[i][0] + "</text>";
        m += '<text x="' + (x + 70) + '" y="175" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="8" text-anchor="middle">' + ASMS[i][1] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Theoretical exercise \u00B7 beauty and efficiency (PDF p. 9)</text>';
      readout(cell("Term", (asm + 1) + "/4", "#38bdf8") + cell("Says", a[0], "#94a3b8"));
      verdict("Four terms buy the 38.");
    } else if(view === "build"){
      var b = BLOCKS[block];
      var hs = [40, 150, 40];
      for(var j = 0; j < 3; j++){
        var jx = 130 + j * 150;
        var on = j === block;
        m += '<rect x="' + jx + '" y="' + (230 - hs[j]) + '" width="110" height="' + hs[j] + '" rx="6" fill="#0f172a" stroke="' + (on ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (jx + 55) + '" y="' + (222 - hs[j]) + '" fill="' + (on ? "#22c55e" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">' + BLOCKS[j][1] + "</text>";
        m += '<text x="' + (jx + 55) + '" y="252" fill="#64748b" font-size="9" text-anchor="middle">' + BLOCKS[j][0] + "</text>";
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">Stack: 4 direct + 34 oxidative = 38 ATP</text>';
      readout(cell("Block", b[0], "#22c55e") + cell("Pays", b[1], "#94a3b8"));
      verdict("The theoretical jackpot, stacked.");
    } else {
      m += '<rect x="100" y="120" width="220" height="110" rx="8" fill="#0f172a" stroke="' + (side === 0 ? "#f59e0b" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="210" y="155" fill="' + (side === 0 ? "#f59e0b" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">Fermentation</text>';
      m += '<text x="210" y="178" fill="#64748b" font-size="9" text-anchor="middle">partial \u00B7 net 2 \u00B7 slow</text>';
      m += '<rect x="380" y="120" width="220" height="110" rx="8" fill="#0f172a" stroke="' + (side === 1 ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="490" y="155" fill="' + (side === 1 ? "#22c55e" : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">Aerobic</text>';
      m += '<text x="490" y="178" fill="#64748b" font-size="9" text-anchor="middle">complete \u00B7 many \u00B7 vigorous</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Three contrasts, PDF p. 10</text>';
      readout(cell("Side", side === 0 ? "fermentation" : "aerobic", side === 0 ? "#f59e0b" : "#22c55e"));
      verdict(side === 0 ? "Partial, poor, slow." : "Complete, rich, vigorous.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 7. Entry Ramps & RQ Calculator Lab (amprqlab) - L7, 12.6-12.7 + Summary
// -------------------------------------------------------------------------
window.SIMS.amprqlab = (function(){
  var view = "ramps"; // "ramps", "rq", "twoway"
  var fuel = 0, pick = 0, dir = 0;
  var FUELS = [
    ["Carbohydrates", "glucose first, then all"],
    ["Fats", "acetyl CoA + PGAL ramps"],
    ["Proteins", "deaminated into Krebs/pyruvate"]
  ];
  var RQS = [["Carbohydrates", "6/6", "1.0"], ["Tripalmitin (fat)", "102/145", "0.7"], ["Proteins", "~", "0.9"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Respiratory road</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Entry ramps</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>RQ readout</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ramps">Entry Ramps</button>' +
      '<button class="preset-btn" id="p-rq">RQ Calculator</button>' +
      '<button class="preset-btn" id="p-twoway">Two-Way Road</button>';
    document.getElementById("p-ramps").onclick = function(){ setActivePreset(this); setV("ramps"); };
    document.getElementById("p-rq").onclick = function(){ setActivePreset(this); setV("rq"); };
    document.getElementById("p-twoway").onclick = function(){ setActivePreset(this); setV("twoway"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "ramps"){
      c.innerHTML =
        '<div class="control-group"><label>Fuel:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        FUELS.map(function(f, i){ return '<button class="preset-btn" data-fl="' + i + '">' + f[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Map:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fig. 12.6 interrelationship.</div></div>';
      c.querySelectorAll("[data-fl]").forEach(function(b){ b.onclick = function(){ fuel = Number(b.dataset.fl); draw(0); }; });
    } else if(view === "rq"){
      c.innerHTML =
        '<div class="control-group"><label>Substrate:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        RQS.map(function(r, i){ return '<button class="preset-btn" data-rq="' + i + '">' + r[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">RQ = CO2 evolved / O2 consumed.</div></div>';
      c.querySelectorAll("[data-rq]").forEach(function(b){ b.onclick = function(){ pick = Number(b.dataset.rq); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Direction:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-w0">Breakdown (catabolic)</button>' +
        '<button class="preset-btn" id="c-w1">Synthesis (anabolic)</button></div></div>' +
        '<div class="control-group"><label>Example:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Acetyl CoA \u2194 fatty acids.</div></div>';
      document.getElementById("c-w0").onclick = function(){ dir = 0; draw(0); };
      document.getElementById("c-w1").onclick = function(){ dir = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Amphibolic &amp; RQ (\u00A712.6\u2013\u00A712.7)</text>';
    if(view === "ramps"){
      var f = FUELS[fuel];
      m += '<line x1="80" y1="170" x2="620" y2="170" stroke="#38bdf8" stroke-width="4"/>';
      m += '<text x="350" y="150" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">respiratory pathway \u2192 CO2 + H2O</text>';
      var rx = [180, 350, 520][fuel];
      m += '<line x1="' + rx + '" y1="100" x2="' + rx + '" y2="170" stroke="#22c55e" stroke-width="3"/>';
      m += '<text x="' + rx + '" y="88" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">' + f[0] + "</text>";
      m += '<text x="350" y="225" fill="#94a3b8" font-size="11" text-anchor="middle">' + f[1] + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Glucose favoured; others merge later (PDF p. 10)</text>';
      readout(cell("Fuel", f[0], "#22c55e") + cell("Ramp", f[1], "#94a3b8"));
      verdict("Each fuel joins at its own ramp.");
    } else if(view === "rq"){
      var r = RQS[pick];
      m += '<text x="350" y="110" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + r[0] + "</text>";
      m += '<text x="350" y="160" fill="#38bdf8" font-size="13" text-anchor="middle">CO2 / O2 = ' + r[1] + "</text>";
      m += '<text x="350" y="205" fill="#f59e0b" font-size="20" font-weight="700" text-anchor="middle">RQ = ' + r[2] + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Mixed substrates in life; never pure fats/proteins (PDF p. 12)</text>';
      readout(cell("Substrate", r[0], "#38bdf8") + cell("RQ", r[2], "#f59e0b"));
      verdict("The ratio names the fuel.");
    } else {
      m += '<rect x="140" y="130" width="180" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="230" y="165" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">Intermediates</text>';
      m += '<text x="350" y="172" fill="#64748b" font-size="18" text-anchor="middle">' + (dir === 0 ? "\u2192" : "\u2190") + "</text>";
      m += '<rect x="380" y="130" width="180" height="80" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="470" y="158" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">' + (dir === 0 ? "Energy (ATP)" : "Fatty acids etc.") + "</text>";
      m += '<text x="470" y="178" fill="#64748b" font-size="9" text-anchor="middle">' + (dir === 0 ? "catabolism" : "anabolism") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Same road, both directions \u2192 amphibolic (PDF p. 10)</text>';
      readout(cell("Traffic", dir === 0 ? "breakdown" : "synthesis", dir === 0 ? "#38bdf8" : "#22c55e"));
      verdict(dir === 0 ? "Catabolic: burn for ATP." : "Anabolic: build from intermediates.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-111 -
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
