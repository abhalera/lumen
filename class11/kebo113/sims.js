// kebo113 interactive simulations: Plant Growth and Development (Ch. 13, print pp. 166-180)
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
// 1. Meristems & Open Growth Bench (growthlab) - L1, 13.1-13.1.1
// -------------------------------------------------------------------------
window.SIMS.growthlab = (function(){
  var view = "open"; // "open", "meristem", "germ"
  var closed = false, which = 0, cond = false;
  var WHICH = [["Apical meristems", "primary: elongation"], ["Lateral meristems", "secondary: girth (dicots/gymnos)"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Meristems dividing</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Mature body</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Suspended / closed</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-open">Open vs Closed</button>' +
      '<button class="preset-btn" id="p-meristem">Meristem Map</button>' +
      '<button class="preset-btn" id="p-germ">Germination</button>';
    document.getElementById("p-open").onclick = function(){ setActivePreset(this); setV("open"); };
    document.getElementById("p-meristem").onclick = function(){ setActivePreset(this); setV("meristem"); };
    document.getElementById("p-germ").onclick = function(){ setActivePreset(this); setV("germ"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "open"){
      c.innerHTML =
        '<div class="control-group"><label>Growth form:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-o0">Open (indeterminate)</button>' +
        '<button class="preset-btn" id="c-o1">Closed (determinate)</button></div></div>' +
        '<div class="control-group"><label>Meristems:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Divide + self-perpetuate.</div></div>';
      document.getElementById("c-o0").onclick = function(){ closed = false; draw(0); };
      document.getElementById("c-o1").onclick = function(){ closed = true; draw(0); };
    } else if(view === "meristem"){
      c.innerHTML =
        '<div class="control-group"><label>Meristem:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-m0">Apical</button>' +
        '<button class="preset-btn" id="c-m1">Lateral</button></div></div>' +
        '<div class="control-group"><label>Caption:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Fig. 13.2 (shoot aplical, print).</div></div>';
      document.getElementById("c-m0").onclick = function(){ which = 0; draw(0); };
      document.getElementById("c-m1").onclick = function(){ which = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Conditions:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-g0">Unfavourable</button>' +
        '<button class="preset-btn" id="c-g1">Favourable</button></div></div>' +
        '<div class="control-group"><label>Seed:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Suspended growth, resumes metabolism.</div></div>';
      document.getElementById("c-g0").onclick = function(){ cond = false; draw(0); };
      document.getElementById("c-g1").onclick = function(){ cond = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Growth (\u00A713.1\u2013\u00A713.1.1)</text>';
    if(view === "open"){
      if(!closed){
        for(var i = 0; i < 5; i++){
          m += '<rect x="' + (130 + i * 90) + '" y="140" width="70" height="70" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        }
        m += '<rect x="' + (130 + 5 * 90) + '" y="140" width="70" height="70" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2.5" stroke-dasharray="5,4"/>';
        m += '<text x="350" y="250" fill="#22c55e" font-size="11" text-anchor="middle">meristem adds cells indefinitely</text>';
      } else {
        for(var j = 0; j < 4; j++){
          m += '<rect x="' + (175 + j * 90) + '" y="140" width="70" height="70" rx="8" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>';
        }
        m += '<text x="350" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">fixed number: growth stops (leaves, flowers)</text>';
      }
      m += '<text x="350" y="90" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">' + (closed ? "Determinate (closed)" : "Indeterminate (open)") + "</text>";
      readout(cell("Form", closed ? "closed" : "open", closed ? "#94a3b8" : "#22c55e"));
      verdict(closed ? "Limited dimensions, then stop." : "Ever-adding meristem activity.");
    } else if(view === "meristem"){
      var w = WHICH[which];
      m += '<rect x="250" y="90" width="200" height="120" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="350" cy="100" r="10" fill="' + (which === 0 ? "#22c55e" : "#334155") + '"/>';
      m += '<text x="350" y="80" fill="' + (which === 0 ? "#22c55e" : "#475569") + '" font-size="10" text-anchor="middle">apical (tip)</text>';
      m += '<rect x="330" y="130" width="40" height="60" rx="6" fill="none" stroke="' + (which === 1 ? "#22c55e" : "#334155") + '" stroke-width="2.5"/>';
      m += '<text x="350" y="228" fill="' + (which === 1 ? "#22c55e" : "#475569") + '" font-size="10" text-anchor="middle">lateral (cambium)</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + w[0] + ": " + w[1] + "</text>";
      readout(cell("Meristem", w[0], "#22c55e") + cell("Gives", w[1], "#94a3b8"));
      verdict(which === 0 ? "Primary growth: longer axes." : "Secondary growth: thicker girths.");
    } else {
      m += '<ellipse cx="350" cy="170" rx="70" ry="45" fill="#0f172a" stroke="' + (cond ? "#22c55e" : "#94a3b8") + '" stroke-width="2.5"/>';
      m += '<text x="350" y="175" fill="' + (cond ? "#22c55e" : "#94a3b8") + '" font-size="12" font-weight="700" text-anchor="middle">' + (cond ? "germinating" : "resting seed") + "</text>";
      if(cond){
        m += '<line x1="350" y1="125" x2="350" y2="95" stroke="#22c55e" stroke-width="3"/>';
        m += '<line x1="350" y1="215" x2="350" y2="245" stroke="#38bdf8" stroke-width="3"/>';
        m += '<text x="350" y="85" fill="#22c55e" font-size="10" text-anchor="middle">shoot</text>';
        m += '<text x="350" y="262" fill="#38bdf8" font-size="10" text-anchor="middle">root</text>';
      } else {
        m += '<text x="350" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">suspended growth; metabolism paused</text>';
      }
      m += '<text x="350" y="70" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">' + (cond ? "Favourable: grow" : "Unfavourable: wait") + "</text>";
      readout(cell("Seed", cond ? "germinating" : "resting", cond ? "#22c55e" : "#94a3b8"));
      verdict(cond ? "First step of growth begins." : "Suspended until conditions return.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. Growth Proxies & Root Zones Lab (measurelab) - L2, 13.1.2-13.1.3
// -------------------------------------------------------------------------
window.SIMS.measurelab = (function(){
  var view = "proxy"; // "proxy", "zones", "lines"
  var org = 0, zone = 0, spread = false;
  var ORGS = [
    ["Maize root tip", "cell number: >17,500/hour"],
    ["Watermelon", "cell size: up to 3,50,000x"],
    ["Pollen tube", "length"],
    ["Dorsiventral leaf", "surface area"]
  ];
  var ZONES = [
    ["Meristematic", "divide: protoplasm-rich"],
    ["Elongation", "vacuolate + enlarge"],
    ["Maturation", "thicken + modify"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Measure by proxy</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Division zone</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Elongation zone</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-proxy">Proxy Picker</button>' +
      '<button class="preset-btn" id="p-zones">Tip Zones</button>' +
      '<button class="preset-btn" id="p-lines">Painted Lines</button>';
    document.getElementById("p-proxy").onclick = function(){ setActivePreset(this); setV("proxy"); };
    document.getElementById("p-zones").onclick = function(){ setActivePreset(this); setV("zones"); };
    document.getElementById("p-lines").onclick = function(){ setActivePreset(this); setV("lines"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "proxy"){
      c.innerHTML =
        '<div class="control-group"><label>Organ:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        ORGS.map(function(o, i){ return '<button class="preset-btn" data-og="' + i + '">' + o[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Match proxy to growth mode.</div></div>';
      c.querySelectorAll("[data-og]").forEach(function(b){ b.onclick = function(){ org = Number(b.dataset.og); draw(0); }; });
    } else if(view === "zones"){
      c.innerHTML =
        '<div class="control-group"><label>Zone:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        ZONES.map(function(z, i){ return '<button class="preset-btn" data-zn="' + i + '">' + z[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Cells:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Thin walls \u2192 vacuolate \u2192 thicken.</div></div>';
      c.querySelectorAll("[data-zn]").forEach(function(b){ b.onclick = function(){ zone = Number(b.dataset.zn); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Lines:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-l0">Fresh marks</button>' +
        '<button class="preset-btn" id="c-l1">After growth</button></div></div>' +
        '<div class="control-group"><label>Read:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Widest spread = elongation (A-D).</div></div>';
      document.getElementById("c-l0").onclick = function(){ spread = false; draw(0); };
      document.getElementById("c-l1").onclick = function(){ spread = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Measurement &amp; Phases (\u00A713.1.2\u2013\u00A713.1.3)</text>';
    if(view === "proxy"){
      var o = ORGS[org];
      m += '<text x="350" y="130" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">' + o[0] + "</text>";
      m += '<text x="350" y="175" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">' + o[1] + "</text>";
      m += '<text x="350" y="220" fill="#94a3b8" font-size="11" text-anchor="middle">Protoplasm hides; proxies speak (PDF p. 3)</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Weight / length / area / volume / number</text>';
      readout(cell("Organ", o[0], "#38bdf8") + cell("Proxy", o[1], "#22c55e"));
      verdict("No single parameter fits all.");
    } else if(view === "zones"){
      var z = ZONES[zone];
      var cols = ["#22c55e", "#f59e0b", "#38bdf8"];
      for(var i = 0; i < 3; i++){
        var y = 100 + i * 60;
        var on = i === zone;
        m += '<rect x="220" y="' + y + '" width="260" height="50" rx="8" fill="#0f172a" stroke="' + (on ? cols[i] : "#334155") + '" stroke-width="2"/>';
        m += '<text x="350" y="' + (y + 30) + '" fill="' + (on ? cols[i] : "#475569") + '" font-size="12" font-weight="700" text-anchor="middle">' + ZONES[i][0] + "</text>";
      }
      m += '<text x="350" y="90" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">root tip \u2193 (apex at top)</text>';
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">' + z[0] + ": " + z[1] + "</text>";
      readout(cell("Zone", z[0], cols[zone]) + cell("Does", z[1], "#94a3b8"));
      verdict("Divide, then enlarge, then finish.");
    } else {
      var gaps = spread ? [14, 40, 34, 16] : [22, 22, 22, 22];
      var yy = 110;
      m += '<line x1="330" y1="90" x2="330" y2="250" stroke="#64748b" stroke-width="3"/>';
      m += '<line x1="370" y1="90" x2="370" y2="250" stroke="#64748b" stroke-width="3"/>';
      for(var l = 0; l < 5; l++){
        m += '<line x1="330" y1="' + yy + '" x2="370" y2="' + yy + '" stroke="#f59e0b" stroke-width="2.5"/>';
        if(l < 4) yy += gaps[l];
      }
      if(spread) m += '<text x="450" y="170" fill="#f59e0b" font-size="11" text-anchor="middle">widest here (A-D)</text>';
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">' + (spread ? "Lines spread most behind the apex (Fig. 13.3)" : "Even ink marks on the tip") + "</text>";
      readout(cell("Marks", spread ? "spread" : "even", spread ? "#f59e0b" : "#38bdf8"));
      verdict(spread ? "Elongation zone located." : "Mark, wait, measure spread.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 3. Growth Curves & Rate Compare Lab (ratelab) - L3, 13.1.4-13.1.5
// -------------------------------------------------------------------------
window.SIMS.ratelab = (function(){
  var view = "arith"; // "arith", "sigmoid", "absrel"
  var t = 50, phase = 1, leaf = 0;
  var PHASES = [["Lag", "slow start"], ["Exponential/log", "both divide"], ["Stationary", "nutrients limit"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Arithmetic (linear)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Geometrical (S)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Relative winner</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-arith">Linear Lt</button>' +
      '<button class="preset-btn" id="p-sigmoid">S-Curve</button>' +
      '<button class="preset-btn" id="p-absrel">Fig 13.7 Leaves</button>';
    document.getElementById("p-arith").onclick = function(){ setActivePreset(this); setV("arith"); };
    document.getElementById("p-sigmoid").onclick = function(){ setActivePreset(this); setV("sigmoid"); };
    document.getElementById("p-absrel").onclick = function(){ setActivePreset(this); setV("absrel"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "arith"){
      c.innerHTML =
        '<div class="control-group"><label>Time:</label><input id="c-tm" type="range" min="5" max="100" value="' + t + '" style="width:100%;margin-top:4px;"></div>' +
        '<div class="control-group"><label>Math:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Lt = L0 + rt (Fig. 13.5).</div></div>';
      document.getElementById("c-tm").oninput = function(){ t = Number(this.value); draw(0); };
    } else if(view === "sigmoid"){
      c.innerHTML =
        '<div class="control-group"><label>Phase:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        PHASES.map(function(p, i){ return '<button class="preset-btn" data-ph="' + i + '">' + p[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Math:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">W1 = W0 ert; r = efficiency index.</div></div>';
      c.querySelectorAll("[data-ph]").forEach(function(b){ b.onclick = function(){ phase = Number(b.dataset.ph); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Leaf:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-f0">A (large)</button>' +
        '<button class="preset-btn" id="c-f1">B (small)</button></div></div>' +
        '<div class="control-group"><label>Gain:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Both +5 cm2 (print units).</div></div>';
      document.getElementById("c-f0").onclick = function(){ leaf = 0; draw(0); };
      document.getElementById("c-f1").onclick = function(){ leaf = 1; draw(0); };
    }
  }

  function draw(svgT){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Growth Rates (\u00A713.1.4\u2013\u00A713.1.5)</text>';
    if(view === "arith"){
      m += '<line x1="120" y1="250" x2="600" y2="250" stroke="#64748b" stroke-width="1.5"/>';
      m += '<line x1="120" y1="250" x2="120" y2="70" stroke="#64748b" stroke-width="1.5"/>';
      m += '<text x="600" y="268" fill="#94a3b8" font-size="10" text-anchor="middle">time</text>';
      m += '<text x="60" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">length</text>';
      m += '<line x1="130" y1="230" x2="580" y2="100" stroke="#38bdf8" stroke-width="3"/>';
      var px = 130 + t * 4.5, py = 230 - t * 1.3;
      m += '<circle cx="' + px + '" cy="' + py + '" r="7" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/>';
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">Lt = L0 + rt \u00B7 one daughter divides (Fig. 13.5)</text>';
      readout(cell("Time", String(t), "#38bdf8") + cell("Length", "L0 + rt", "#94a3b8"));
      verdict("Constant rate, straight line.");
    } else if(view === "sigmoid"){
      m += '<line x1="120" y1="250" x2="600" y2="250" stroke="#64748b" stroke-width="1.5"/>';
      m += '<line x1="120" y1="250" x2="120" y2="70" stroke="#64748b" stroke-width="1.5"/>';
      m += '<text x="600" y="268" fill="#94a3b8" font-size="10" text-anchor="middle">time</text>';
      m += '<text x="60" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">size</text>';
      m += '<path d="M130,240 Q230,235 300,190 Q370,140 430,120 Q500,105 570,105" fill="none" stroke="#22c55e" stroke-width="3"/>';
      var dots = [[200, 232], [330, 165], [500, 108]];
      for(var i = 0; i < 3; i++){
        var on = i === phase;
        m += '<circle cx="' + dots[i][0] + '" cy="' + dots[i][1] + '" r="' + (on ? 9 : 5) + '" fill="' + (on ? "#22c55e" : "#334155") + '" stroke="#0f172a" stroke-width="2"/>';
        m += '<text x="' + dots[i][0] + '" y="' + (dots[i][1] - 16) + '" fill="' + (on ? "#22c55e" : "#475569") + '" font-size="' + (on ? 12 : 9) + '" font-weight="700" text-anchor="middle">' + PHASES[i][0] + "</text>";
      }
      m += '<text x="350" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">S-curve of nature (Fig. 13.6) \u00B7 now: ' + PHASES[phase][0] + " \u2014 " + PHASES[phase][1] + "</text>";
      readout(cell("Phase", PHASES[phase][0], "#22c55e") + cell("Means", PHASES[phase][1], "#94a3b8"));
      verdict("Slow, fast, flat.");
    } else {
      var big = leaf === 0;
      m += '<rect x="140" y="120" width="' + (big ? 200 : 150) + '" height="90" rx="8" fill="#0f172a" stroke="' + (big ? "#f59e0b" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="' + (big ? 240 : 215) + '" y="160" fill="' + (big ? "#f59e0b" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">A \u2192 A1</text>';
      m += '<text x="' + (big ? 240 : 215) + '" y="180" fill="#64748b" font-size="10" text-anchor="middle">+5 cm2</text>';
      m += '<rect x="400" y="120" width="' + (big ? 150 : 200) + '" height="90" rx="8" fill="#0f172a" stroke="' + (!big ? "#f59e0b" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="' + (big ? 475 : 500) + '" y="160" fill="' + (!big ? "#f59e0b" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">B \u2192 B1</text>';
      m += '<text x="' + (big ? 475 : 500) + '" y="180" fill="#64748b" font-size="10" text-anchor="middle">+5 cm2</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + (big ? "A: same gain, smaller fraction (lower relative)" : "B: same gain, bigger fraction (higher relative)") + "</text>";
      readout(cell("Leaf", big ? "A (large)" : "B (small)", "#f59e0b") + cell("Relative", big ? "lower" : "HIGHER", big ? "#94a3b8" : "#22c55e"));
      verdict(big ? "Absolute ties; relative loses." : "Absolute ties; relative wins.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Dedifferentiation Cycle & Plasticity Lab (difflab) - L4, 13.2-13.3
// -------------------------------------------------------------------------
window.SIMS.difflab = (function(){
  var view = "cycle"; // "cycle", "position", "plastic"
  var fate = 0, pos = 0, plant = 0;
  var FATES = [["Differentiation", "mature to function"], ["Dedifferentiation", "regain division"], ["Redifferentiation", "mature again"]];
  var PLANTS = [["Cotton", "juvenile vs mature leaves"], ["Larkspur", "juvenile vs mature leaves"], ["Buttercup", "air vs water leaves"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Meristematic</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Differentiated</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Plastic forms</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cycle">Fate Cycle</button>' +
      '<button class="preset-btn" id="p-position">Fate by Address</button>' +
      '<button class="preset-btn" id="p-plastic">Heterophylly</button>';
    document.getElementById("p-cycle").onclick = function(){ setActivePreset(this); setV("cycle"); };
    document.getElementById("p-position").onclick = function(){ setActivePreset(this); setV("position"); };
    document.getElementById("p-plastic").onclick = function(){ setActivePreset(this); setV("plastic"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "cycle"){
      c.innerHTML =
        '<div class="control-group"><label>State:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        FATES.map(function(f, i){ return '<button class="preset-btn" data-ft="' + i + '">' + f[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Example:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Parenchyma \u2194 cambium.</div></div>';
      c.querySelectorAll("[data-ft]").forEach(function(b){ b.onclick = function(){ fate = Number(b.dataset.ft); draw(0); }; });
    } else if(view === "position"){
      c.innerHTML =
        '<div class="control-group"><label>Lands at:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-p0">Periphery</button>' +
        '<button class="preset-btn" id="c-p1">Root tip cap</button></div></div>' +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Same meristem, address-set fate.</div></div>';
      document.getElementById("c-p0").onclick = function(){ pos = 0; draw(0); };
      document.getElementById("c-p1").onclick = function(){ pos = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Plant:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        PLANTS.map(function(p, i){ return '<button class="preset-btn" data-ht="' + i + '">' + p[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Driver:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Phase (age) or environment.</div></div>';
      c.querySelectorAll("[data-ht]").forEach(function(b){ b.onclick = function(){ plant = Number(b.dataset.ht); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Differentiation (\u00A713.2\u2013\u00A713.3)</text>';
    if(view === "cycle"){
      var f = FATES[fate];
      for(var i = 0; i < 3; i++){
        var x = 70 + i * 190;
        var on = i === fate;
        m += '<rect x="' + x + '" y="120" width="170" height="100" rx="8" fill="#0f172a" stroke="' + (on ? (i === 1 ? "#38bdf8" : "#22c55e") : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 85) + '" y="155" fill="' + (on ? "#f8fafc" : "#475569") + '" font-size="9" font-weight="700" text-anchor="middle">' + FATES[i][0] + "</text>";
        m += '<text x="' + (x + 85) + '" y="178" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="8" text-anchor="middle">' + FATES[i][1] + "</text>";
        if(i < 2) m += '<text x="' + (x + 180) + '" y="172" fill="#64748b" font-size="16" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Mature \u2192 divide \u2192 mature: the reversible career (PDF p. 7)</text>';
      readout(cell("State", f[0], fate === 1 ? "#38bdf8" : "#22c55e") + cell("Marks", f[1], "#94a3b8"));
      verdict("Differentiation is not a one-way door.");
    } else if(view === "position"){
      m += '<circle cx="350" cy="140" r="30" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="350" y="144" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle">meristem</text>';
      m += '<line x1="350" y1="170" x2="' + (pos === 0 ? 200 : 500) + '" y2="220" stroke="#64748b" stroke-width="2"/>';
      m += '<rect x="' + (pos === 0 ? 120 : 420) + '" y="200" width="160" height="50" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<text x="' + (pos === 0 ? 200 : 500) + '" y="229" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">' + (pos === 0 ? "epidermis" : "root-cap") + "</text>";
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">Open differentiation: address decides (PDF p. 7)</text>';
      readout(cell("Lands", pos === 0 ? "periphery" : "tip cap", "#94a3b8") + cell("Becomes", pos === 0 ? "epidermis" : "root-cap", "#22c55e"));
      verdict("Same origin, different fate.");
    } else {
      var p = PLANTS[plant];
      m += '<ellipse cx="250" cy="170" rx="70" ry="45" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="250" y="174" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">' + (plant === 2 ? "air leaf" : "juvenile") + "</text>";
      m += '<ellipse cx="450" cy="170" rx="45" ry="60" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="450" y="174" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">' + (plant === 2 ? "water leaf" : "mature") + "</text>";
      m += '<text x="350" y="110" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">' + p[0] + ": " + p[1] + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Plasticity: pathways by phase/environment (Fig. 13.9)</text>';
      readout(cell("Plant", p[0], "#f59e0b") + cell("Shows", p[1], "#94a3b8"));
      verdict(plant === 2 ? "Environmental heterophylly." : "Phase heterophylly.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 5. Accidental Discovery Lab (discoverlab) - L5, 13.4-13.4.2
// -------------------------------------------------------------------------
window.SIMS.discoverlab = (function(){
  var view = "darwin"; // "darwin", "bakanae", "callus"
  var tip = true, filtrate = false, supplement = false;

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Signal source</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Response</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Isolated PGR</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-darwin">Darwin Tip</button>' +
      '<button class="preset-btn" id="p-bakanae">Bakanae Filtrate</button>' +
      '<button class="preset-btn" id="p-callus">Skoog Callus</button>';
    document.getElementById("p-darwin").onclick = function(){ setActivePreset(this); setV("darwin"); };
    document.getElementById("p-bakanae").onclick = function(){ setActivePreset(this); setV("bakanae"); };
    document.getElementById("p-callus").onclick = function(){ setActivePreset(this); setV("callus"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "darwin"){
      c.innerHTML =
        '<div class="control-group"><label>Coleoptile:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-t0">Tip on</button>' +
        '<button class="preset-btn" id="c-t1">Tip off</button></div></div>' +
        '<div class="control-group"><label>Light:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Unilateral; canary grass (Fig. 13.10).</div></div>';
      document.getElementById("c-t0").onclick = function(){ tip = true; draw(0); };
      document.getElementById("c-t1").onclick = function(){ tip = false; draw(0); };
    } else if(view === "bakanae"){
      c.innerHTML =
        '<div class="control-group"><label>Rice seedlings:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-b0">Healthy</button>' +
        '<button class="preset-btn" id="c-b1">+ sterile filtrate</button></div></div>' +
        '<div class="control-group"><label>Source:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Gibberella fujikuroi (Kurosawa 1926).</div></div>';
      document.getElementById("c-b0").onclick = function(){ filtrate = false; draw(0); };
      document.getElementById("c-b1").onclick = function(){ filtrate = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Medium:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-s0">Auxins only</button>' +
        '<button class="preset-btn" id="c-s1">+ coconut milk/DNA</button></div></div>' +
        '<div class="control-group"><label>Tissue:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Tobacco callus (Skoog; Miller 1955).</div></div>';
      document.getElementById("c-s0").onclick = function(){ supplement = false; draw(0); };
      document.getElementById("c-s1").onclick = function(){ supplement = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">PGR Discovery (\u00A713.4\u2013\u00A713.4.2)</text>';
    if(view === "darwin"){
      m += '<text x="120" y="120" fill="#fbbf24" font-size="20" text-anchor="middle">\u2600</text>';
      m += '<text x="120" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">unilateral light</text>';
      if(tip){
        m += '<path d="M350,250 Q350,180 300,130" fill="none" stroke="#22c55e" stroke-width="5"/>';
        m += '<circle cx="300" cy="130" r="10" fill="#38bdf8"/>';
        m += '<text x="300" y="110" fill="#38bdf8" font-size="10" text-anchor="middle">tip signal</text>';
        m += '<text x="350" y="282" fill="#22c55e" font-size="11" text-anchor="middle">Bends toward light (phototropism; Went: auxin)</text>';
      } else {
        m += '<line x1="350" y1="250" x2="350" y2="130" stroke="#64748b" stroke-width="5"/>';
        m += '<text x="350" y="115" fill="#64748b" font-size="10" text-anchor="middle">tip removed</text>';
        m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">No tip, no bend: signal lost</text>';
      }
      readout(cell("Tip", tip ? "on" : "off", tip ? "#38bdf8" : "#94a3b8") + cell("Bends", tip ? "yes" : "no", tip ? "#22c55e" : "#94a3b8"));
      verdict(tip ? "Transmittable influence proven." : "Influence travels from the tip.");
    } else if(view === "bakanae"){
      var h = filtrate ? 150 : 90;
      m += '<rect x="300" y="' + (250 - h) + '" width="100" height="' + h + '" rx="8" fill="#0f172a" stroke="' + (filtrate ? "#f59e0b" : "#38bdf8") + '" stroke-width="2.5"/>';
      m += '<text x="350" y="' + (240 - h) + '" fill="' + (filtrate ? "#f59e0b" : "#38bdf8") + '" font-size="12" font-weight="700" text-anchor="middle">' + (filtrate ? "foolish seedling" : "normal rice") + "</text>";
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">' + (filtrate ? "Sterile filtrate sickens \u2192 gibberellic acid (PDF p. 10)" : "Healthy until filtrate applied") + "</text>";
      readout(cell("Seedlings", filtrate ? "bakanae" : "healthy", filtrate ? "#f59e0b" : "#22c55e"));
      verdict(filtrate ? "Foolish elongation = gibberellin." : "Apply the fungal filtrate.");
    } else {
      m += '<circle cx="350" cy="170" r="' + (supplement ? 55 : 30) + '" fill="#0f172a" stroke="' + (supplement ? "#22c55e" : "#64748b") + '" stroke-width="2.5"/>';
      m += '<text x="350" y="174" fill="' + (supplement ? "#22c55e" : "#64748b") + '" font-size="11" font-weight="700" text-anchor="middle">' + (supplement ? "proliferating" : "stalled") + "</text>";
      m += '<text x="350" y="110" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Tobacco callus + auxins ' + (supplement ? "+ supplement" : "only") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Missing promoter \u2192 kinetin (Miller 1955, PDF p. 10)</text>';
      readout(cell("Callus", supplement ? "dividing" : "stalled", supplement ? "#22c55e" : "#94a3b8"));
      verdict(supplement ? "Cytokinesis promoter found." : "Needs more than auxins.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. Promoter Effects & Farm Uses Lab (promoterlab) - L6, 13.4.3.1-13.4.3.3
// -------------------------------------------------------------------------
window.SIMS.promoterlab = (function(){
  var view = "dominance"; // "dominance", "bolting", "rescue"
  var cut = false, ga = false, ck = false;

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Auxin / apex</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Growing laterals</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>GA / CK action</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dominance">Decapitate</button>' +
      '<button class="preset-btn" id="p-bolting">Bolt Rosette</button>' +
      '<button class="preset-btn" id="p-rescue">CK Rescue</button>';
    document.getElementById("p-dominance").onclick = function(){ setActivePreset(this); setV("dominance"); };
    document.getElementById("p-bolting").onclick = function(){ setActivePreset(this); setV("bolting"); };
    document.getElementById("p-rescue").onclick = function(){ setActivePreset(this); setV("rescue"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "dominance"){
      c.innerHTML =
        '<div class="control-group"><label>Apex:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-a0">Intact (dominant)</button>' +
        '<button class="preset-btn" id="c-a1">Decapitate</button></div></div>' +
        '<div class="control-group"><label>Uses:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Tea plantations, hedge-making (Fig. 13.11).</div></div>';
      document.getElementById("c-a0").onclick = function(){ cut = false; draw(0); };
      document.getElementById("c-a1").onclick = function(){ cut = true; draw(0); };
    } else if(view === "bolting"){
      c.innerHTML =
        '<div class="control-group"><label>Rosette:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-g0">Flat rosette</button>' +
        '<button class="preset-btn" id="c-g1">+ gibberellin</button></div></div>' +
        '<div class="control-group"><label>Crops:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Beet, cabbages; grapes, apple, cane.</div></div>';
      document.getElementById("c-g0").onclick = function(){ ga = false; draw(0); };
      document.getElementById("c-g1").onclick = function(){ ga = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Axillary buds:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-k0">Suppressed</button>' +
        '<button class="preset-btn" id="c-k1">+ cytokinin</button></div></div>' +
        '<div class="control-group"><label>Plus:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Chloroplasts, shoots, delayed senescence.</div></div>';
      document.getElementById("c-k0").onclick = function(){ ck = false; draw(0); };
      document.getElementById("c-k1").onclick = function(){ ck = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Promoters (\u00A713.4.3.1\u2013\u00A713.4.3.3)</text>';
    if(view === "dominance"){
      m += '<line x1="350" y1="250" x2="350" y2="110" stroke="#64748b" stroke-width="4"/>';
      if(!cut){
        m += '<circle cx="350" cy="100" r="12" fill="#38bdf8"/>';
        m += '<circle cx="310" cy="180" r="6" fill="#334155"/>';
        m += '<circle cx="390" cy="180" r="6" fill="#334155"/>';
        m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">Apex auxin suppresses axillary buds</text>';
      } else {
        m += '<line x1="330" y1="130" x2="370" y2="130" stroke="#ef4444" stroke-width="3"/>';
        m += '<line x1="310" y1="180" x2="270" y2="140" stroke="#22c55e" stroke-width="4"/>';
        m += '<line x1="390" y1="180" x2="430" y2="140" stroke="#22c55e" stroke-width="4"/>';
        m += '<text x="350" y="282" fill="#22c55e" font-size="11" text-anchor="middle">Laterals freed \u2192 bushy (tea, hedges)</text>';
      }
      readout(cell("Apex", cut ? "cut" : "intact", cut ? "#ef4444" : "#38bdf8") + cell("Laterals", cut ? "growing" : "held", cut ? "#22c55e" : "#94a3b8"));
      verdict(cut ? "Apical dominance broken." : "Apical bud rules.");
    } else if(view === "bolting"){
      if(!ga){
        m += '<ellipse cx="350" cy="200" rx="90" ry="30" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
        m += '<text x="350" y="205" fill="#38bdf8" font-size="11" text-anchor="middle">flat rosette</text>';
      } else {
        m += '<ellipse cx="350" cy="220" rx="90" ry="20" fill="#0f172a" stroke="#334155" stroke-width="2"/>';
        m += '<line x1="350" y1="220" x2="350" y2="100" stroke="#f59e0b" stroke-width="5"/>';
        m += '<circle cx="350" cy="90" r="12" fill="#f59e0b"/>';
        m += '<text x="350" y="70" fill="#f59e0b" font-size="10" text-anchor="middle">bolted: internodes elongated</text>';
      }
      m += '<text x="350" y="282" fill="#94a3b8" font-size="11" text-anchor="middle">GA: beet, cabbages, rosettes (PDF p. 11)</text>';
      readout(cell("Form", ga ? "bolted" : "rosette", ga ? "#f59e0b" : "#38bdf8"));
      verdict(ga ? "Pre-flowering stretch on." : "Rosette hugs the ground.");
    } else {
      m += '<circle cx="280" cy="170" r="10" fill="' + (ck ? "#22c55e" : "#334155") + '"/>';
      m += '<circle cx="420" cy="170" r="10" fill="' + (ck ? "#22c55e" : "#334155") + '"/>';
      if(ck){
        m += '<line x1="280" y1="160" x2="280" y2="110" stroke="#22c55e" stroke-width="4"/>';
        m += '<line x1="420" y1="160" x2="420" y2="110" stroke="#22c55e" stroke-width="4"/>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Axillary buds ' + (ck ? "growing" : "suppressed") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Cytokinins overcome apical dominance (PDF p. 12)</text>';
      readout(cell("Buds", ck ? "growing" : "held", ck ? "#22c55e" : "#94a3b8"));
      verdict(ck ? "Cytokinin overrules the apex." : "Apex still rules.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 7. Ethylene, ABA & Multi-PGR Lab (stresslab) - L7, 13.4.3.4-13.4.3.5 + Sum
// -------------------------------------------------------------------------
window.SIMS.stresslab = (function(){
  var view = "ethylene"; // "ethylene", "aba", "teams"
  var ripe = false, shut = false, evt = 0;
  var EVTS = [
    ["Dormancy", "ABA holds, GA opposes"],
    ["Abscission", "auxin + ethylene + ABA"],
    ["Senescence", "GA/CK delay, ethylene hastens"],
    ["Apical dominance", "auxin holds, CK frees"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Ethylene gas</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>ABA shutdown</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Committee events</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ethylene">Ripen Gas</button>' +
      '<button class="preset-btn" id="p-aba">ABA Shutdown</button>' +
      '<button class="preset-btn" id="p-teams">PGR Teams</button>';
    document.getElementById("p-ethylene").onclick = function(){ setActivePreset(this); setV("ethylene"); };
    document.getElementById("p-aba").onclick = function(){ setActivePreset(this); setV("aba"); };
    document.getElementById("p-teams").onclick = function(){ setActivePreset(this); setV("teams"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "ethylene"){
      c.innerHTML =
        '<div class="control-group"><label>Fruit:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-f0">Unripe</button>' +
        '<button class="preset-btn" id="c-f1">+ ethylene/ethephon</button></div></div>' +
        '<div class="control-group"><label>Marks:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Respiratory climactic (print).</div></div>';
      document.getElementById("c-f0").onclick = function(){ ripe = false; draw(0); };
      document.getElementById("c-f1").onclick = function(){ ripe = true; draw(0); };
    } else if(view === "aba"){
      c.innerHTML =
        '<div class="control-group"><label>Stomata:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-s0">Open</button>' +
        '<button class="preset-btn" id="c-s1">+ ABA (stress)</button></div></div>' +
        '<div class="control-group"><label>Role:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Stress hormone; GA-antagonist.</div></div>';
      document.getElementById("c-s0").onclick = function(){ shut = false; draw(0); };
      document.getElementById("c-s1").onclick = function(){ shut = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Event:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        EVTS.map(function(e, i){ return '<button class="preset-btn" data-ev="' + i + '">' + e[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Modes:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Complimentary/antagonistic (print).</div></div>';
      c.querySelectorAll("[data-ev]").forEach(function(b){ b.onclick = function(){ evt = Number(b.dataset.ev); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Inhibitors (\u00A713.4.3.4\u2013\u00A713.4.3.5)</text>';
    if(view === "ethylene"){
      m += '<circle cx="350" cy="170" r="50" fill="#0f172a" stroke="' + (ripe ? "#f59e0b" : "#22c55e") + '" stroke-width="2.5"/>';
      m += '<text x="350" y="176" fill="' + (ripe ? "#f59e0b" : "#22c55e") + '" font-size="13" font-weight="700" text-anchor="middle">' + (ripe ? "ripe" : "unripe") + "</text>";
      if(ripe) m += '<text x="350" y="110" fill="#f59e0b" font-size="11" text-anchor="middle">respiratory climactic (print)</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + (ripe ? "Senescing tissues + fruits make it abundantly (PDF p. 12)" : "Apply ethylene or ethephon") + "</text>";
      readout(cell("Fruit", ripe ? "ripe" : "unripe", ripe ? "#f59e0b" : "#22c55e"));
      verdict(ripe ? "Climactic spike marks ripening." : "Green and respiring low.");
    } else if(view === "aba"){
      if(!shut){
        m += '<ellipse cx="350" cy="170" rx="70" ry="30" fill="none" stroke="#38bdf8" stroke-width="3"/>';
        m += '<text x="350" y="176" fill="#38bdf8" font-size="11" text-anchor="middle">pore open</text>';
      } else {
        m += '<line x1="280" y1="170" x2="420" y2="170" stroke="#38bdf8" stroke-width="5"/>';
        m += '<text x="350" y="200" fill="#38bdf8" font-size="11" text-anchor="middle">pore shut (water saved)</text>';
      }
      m += '<text x="350" y="110" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">' + (shut ? "ABA: stress shutdown" : "No stress: open") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">General inhibitor; desiccation via dormancy (PDF pp. 12–13)</text>';
      readout(cell("Stomata", shut ? "shut" : "open", shut ? "#38bdf8" : "#22c55e") + cell("Growth", shut ? "inhibited" : "on", "#94a3b8"));
      verdict(shut ? "Stress hormone at work." : "Growing normally.");
    } else {
      var e = EVTS[evt];
      m += '<text x="350" y="130" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">' + e[0] + "</text>";
      m += '<text x="350" y="175" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">' + e[1] + "</text>";
      m += '<text x="350" y="220" fill="#94a3b8" font-size="11" text-anchor="middle">Individualistic or synergistic; never solo</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Every phase involves some PGR (PDF p. 13)</text>';
      readout(cell("Event", e[0], "#22c55e") + cell("Team", e[1], "#94a3b8"));
      verdict("Committee decisions only.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-112 -
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
