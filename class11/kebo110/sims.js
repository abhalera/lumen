// kebo110 interactive simulations: Cell Cycle and Cell Division (Ch. 10, print pp. 120-130)
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
// 1. Cell Cycle Clock & DNA Doubling Bench (cyclelab) - L1, 10.1-10.1.1
// -------------------------------------------------------------------------
window.SIMS.cyclelab = (function(){
  var view = "clock"; // "clock", "dna", "yeast"
  var phase = 0, sdone = false, org = 0;
  var PHASES = [["G1", "grow, no replication"], ["S", "DNA 2C\u21924C"], ["G2", "mitotic proteins"], ["M", "~1 hour division"]];
  var ORGS = [["Human cells", "about every 24 hours"], ["Yeast", "about 90 minutes"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Interphase (&gt;95%)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>M phase (~1 hour)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>DNA doubled, number kept</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-clock">Cycle Clock</button>' +
      '<button class="preset-btn" id="p-dna">DNA Doubling</button>' +
      '<button class="preset-btn" id="p-yeast">Human vs Yeast</button>';
    document.getElementById("p-clock").onclick = function(){ setActivePreset(this); setV("clock"); };
    document.getElementById("p-dna").onclick = function(){ setActivePreset(this); setV("dna"); };
    document.getElementById("p-yeast").onclick = function(){ setActivePreset(this); setV("yeast"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "clock"){
      c.innerHTML =
        '<div class="control-group"><label>Phase:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        PHASES.map(function(ph, i){ return '<button class="preset-btn" data-ph="' + i + '">' + ph[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Shares:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">M ~1 h of 24 h; interphase &gt;95%.</div></div>';
      c.querySelectorAll("[data-ph]").forEach(function(b){ b.onclick = function(){ phase = Number(b.dataset.ph); draw(0); }; });
    } else if(view === "dna"){
      c.innerHTML =
        '<div class="control-group"><label>S phase:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-d0">Before (2C, 2n)</button>' +
        '<button class="preset-btn" id="c-d1">After (4C, 2n)</button></div></div>' +
        '<div class="control-group"><label>Rule:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Content doubles; number unchanged.</div></div>';
      document.getElementById("c-d0").onclick = function(){ sdone = false; draw(0); };
      document.getElementById("c-d1").onclick = function(){ sdone = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Organism:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-o0">Human cells</button>' +
        '<button class="preset-btn" id="c-o1">Yeast</button></div></div>' +
        '<div class="control-group"><label>Note:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Duration varies by organism and cell type.</div></div>';
      document.getElementById("c-o0").onclick = function(){ org = 0; draw(0); };
      document.getElementById("c-o1").onclick = function(){ org = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Cell Cycle (\u00A710.1\u2013\u00A710.1.1)</text>';
    if(view === "clock"){
      var cols = ["#38bdf8", "#38bdf8", "#38bdf8", "#f59e0b"];
      for(var i = 0; i < 4; i++){
        var x = 45 + i * 160;
        var on = i === phase;
        m += '<rect x="' + x + '" y="120" width="140" height="100" rx="8" fill="#0f172a" stroke="' + (on ? cols[i] : "#334155") + '" stroke-width="2.5"/>';
        m += '<text x="' + (x + 70) + '" y="155" fill="' + (on ? cols[i] : "#475569") + '" font-size="14" font-weight="700" text-anchor="middle">' + PHASES[i][0] + "</text>";
        m += '<text x="' + (x + 70) + '" y="178" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="9" text-anchor="middle">' + PHASES[i][1] + "</text>";
        if(i < 3) m += '<text x="' + (x + 150) + '" y="172" fill="#64748b" font-size="16" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Interphase: G1 + S + G2 (\u201crestes\u201d while preparing) \u00B7 M: karyokinesis \u2192 cytokinesis</text>';
      readout(cell("Phase", PHASES[phase][0], cols[phase]) + cell("Job", PHASES[phase][1], "#94a3b8"));
      verdict(phase === 3 ? "M Phase: actual division, about an hour." : "Interphase: between two successive M phases.");
    } else if(view === "dna"){
      m += '<text x="350" y="90" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">S phase: DNA ' + (sdone ? "2C \u2192 4C (doubled)" : "2C (not yet doubled)") + " \u00B7 chromosomes 2n (unchanged)</text>";
      var bars = sdone ? [4, 4] : [2, 4];
      var bl = ["DNA content", "Chromosome number"];
      var bv = sdone ? ["4C", "2n"] : ["2C", "2n"];
      for(var j = 0; j < 2; j++){
        var jx = 170 + j * 200;
        var h = bars[j] * 32;
        m += '<rect x="' + jx + '" y="' + (250 - h) + '" width="110" height="' + h + '" rx="6" fill="#0f172a" stroke="' + (j === 0 ? "#22c55e" : "#38bdf8") + '" stroke-width="2"/>';
        m += '<text x="' + (jx + 55) + '" y="' + (240 - h) + '" fill="' + (j === 0 ? "#22c55e" : "#38bdf8") + '" font-size="13" font-weight="700" text-anchor="middle">' + bv[j] + "</text>";
        m += '<text x="' + (jx + 55) + '" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">' + bl[j] + "</text>";
      }
      readout(cell("DNA", bv[0], "#22c55e") + cell("Number", bv[1], "#38bdf8"));
      verdict(sdone ? "Doubled content, same number." : "Run S phase to double the DNA.");
    } else {
      var o = ORGS[org];
      m += '<text x="350" y="90" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + o[0] + ": " + o[1] + "</text>";
      var w = org === 0 ? 420 : 60;
      m += '<rect x="140" y="140" width="' + w + '" height="60" rx="8" fill="#0f172a" stroke="' + (org === 0 ? "#38bdf8" : "#22c55e") + '" stroke-width="2.5"/>';
      m += '<text x="' + (140 + w / 2) + '" y="176" fill="' + (org === 0 ? "#38bdf8" : "#22c55e") + '" font-size="12" font-weight="700" text-anchor="middle">' + (org === 0 ? "24 hours" : "90 minutes") + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Figure 10.1: one cell \u2192 two cells per cycle</text>';
      readout(cell("Organism", o[0], "#38bdf8") + cell("Cycle", o[1], "#22c55e"));
      verdict("Same phases, very different pace.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 2. G0 Exit & Mitosis Distribution Bench (quiesclab) - L2, 10.1.1-10.2
// -------------------------------------------------------------------------
window.SIMS.quiesclab = (function(){
  var view = "g0"; // "g0", "somatic", "equational"
  var exited = false, realm = 0, divided = false;
  var REALMS = [["Animals", "diploid somatic only (+ male honey bees)"], ["Plants", "haploid AND diploid cells"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cycling cells</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>G0 quiescent</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Equational outcome</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-g0">G1-G0 Exit</button>' +
      '<button class="preset-btn" id="p-somatic">Who Divides</button>' +
      '<button class="preset-btn" id="p-equational">Equational 2n-2n</button>';
    document.getElementById("p-g0").onclick = function(){ setActivePreset(this); setV("g0"); };
    document.getElementById("p-somatic").onclick = function(){ setActivePreset(this); setV("somatic"); };
    document.getElementById("p-equational").onclick = function(){ setActivePreset(this); setV("equational"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "g0"){
      c.innerHTML =
        '<div class="control-group"><label>Heart cell:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-q0">Stay in G1</button>' +
        '<button class="preset-btn" id="c-q1">Exit to G0</button></div></div>' +
        '<div class="control-group"><label>G0 means:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Active but not proliferating unless called on.</div></div>';
      document.getElementById("c-q0").onclick = function(){ exited = false; draw(0); };
      document.getElementById("c-q1").onclick = function(){ exited = true; draw(0); };
    } else if(view === "somatic"){
      c.innerHTML =
        '<div class="control-group"><label>Realm:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-r0">Animals</button>' +
        '<button class="preset-btn" id="c-r1">Plants</button></div></div>' +
        '<div class="control-group"><label>Pointer:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Chapter 3: alternation of generations.</div></div>';
      document.getElementById("c-r0").onclick = function(){ realm = 0; draw(0); };
      document.getElementById("c-r1").onclick = function(){ realm = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Mitosis:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-e0">Parent (2n)</button>' +
        '<button class="preset-btn" id="c-e1">Divide</button></div></div>' +
        '<div class="control-group"><label>Why equational:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Same number in parent and progeny.</div></div>';
      document.getElementById("c-e0").onclick = function(){ divided = false; draw(0); };
      document.getElementById("c-e1").onclick = function(){ divided = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Quiescence &amp; M Phase (\u00A710.1.1\u2013\u00A710.2)</text>';
    if(view === "g0"){
      m += '<rect x="120" y="130" width="180" height="90" rx="8" fill="#0f172a" stroke="' + (!exited ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="210" y="168" fill="' + (!exited ? "#38bdf8" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">G1</text>';
      m += '<text x="210" y="188" fill="#64748b" font-size="10" text-anchor="middle">cycling</text>';
      m += '<text x="330" y="178" fill="#64748b" font-size="16" text-anchor="middle">\u2192</text>';
      m += '<rect x="360" y="130" width="180" height="90" rx="8" fill="#0f172a" stroke="' + (exited ? "#94a3b8" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="450" y="168" fill="' + (exited ? "#cbd5e1" : "#475569") + '" font-size="13" font-weight="700" text-anchor="middle">G0 (quiescent)</text>';
      m += '<text x="450" y="188" fill="#64748b" font-size="10" text-anchor="middle">e.g. heart cells</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Question prints \u2018Go\u2019; body text prints \u2018G0\u2019 \u2014 same stage</text>';
      readout(cell("State", exited ? "G0" : "G1", exited ? "#94a3b8" : "#38bdf8") + cell("Dividing", exited ? "no" : "yes", exited ? "#94a3b8" : "#22c55e"));
      verdict(exited ? "Quiescent: active, not proliferating unless called on." : "Cycling in G1.");
    } else if(view === "somatic"){
      var r = REALMS[realm];
      m += '<text x="350" y="110" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">' + r[0] + ": mitosis in</text>";
      m += '<text x="350" y="170" fill="' + (realm === 0 ? "#38bdf8" : "#22c55e") + '" font-size="13" font-weight="700" text-anchor="middle">' + r[1] + "</text>";
      if(realm === 0) m += '<text x="350" y="215" fill="#f59e0b" font-size="11" text-anchor="middle">Exception: haploid cells of male honey bees</text>';
      else m += '<text x="350" y="215" fill="#94a3b8" font-size="11" text-anchor="middle">See Chapter 3 alternation of generations</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Mitosis distribution, PDF p. 3</text>';
      readout(cell("Realm", r[0], "#38bdf8") + cell("Rule", r[1], "#22c55e"));
      verdict(realm === 0 ? "Animals: diploid somatic (+ bee exception)." : "Plants: both ploidies divide.");
    } else {
      if(!divided){
        m += '<circle cx="350" cy="170" r="50" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
        m += '<text x="350" y="178" fill="#38bdf8" font-size="16" font-weight="700" text-anchor="middle">2n</text>';
        m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Parent cell, diploid</text>';
      } else {
        m += '<circle cx="240" cy="170" r="50" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
        m += '<text x="240" y="178" fill="#22c55e" font-size="16" font-weight="700" text-anchor="middle">2n</text>';
        m += '<circle cx="460" cy="170" r="50" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
        m += '<text x="460" y="178" fill="#22c55e" font-size="16" font-weight="700" text-anchor="middle">2n</text>';
        m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Two daughters, same number \u2014 equational division</text>';
      }
      readout(cell("Cells", divided ? "2" : "1", "#38bdf8") + cell("Number", "2n \u2192 2n", "#22c55e"));
      verdict(divided ? "Equational: number conserved." : "Divide to see the equational outcome.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 3. Condensation, Asters & Plate Alignment Lab (prometalab) - L3, 10.2.1-2
// -------------------------------------------------------------------------
window.SIMS.prometalab = (function(){
  var view = "condense"; // "condense", "asters", "plate"
  var cond = 0, apart = 0, aligned = 1;

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Chromosomes / sisters</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Centrosome + asters</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Metaphase plate</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-condense">Condensation</button>' +
      '<button class="preset-btn" id="p-asters">Asters Apart</button>' +
      '<button class="preset-btn" id="p-plate">Plate Line-up</button>';
    document.getElementById("p-condense").onclick = function(){ setActivePreset(this); setV("condense"); };
    document.getElementById("p-asters").onclick = function(){ setActivePreset(this); setV("asters"); };
    document.getElementById("p-plate").onclick = function(){ setActivePreset(this); setV("plate"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "condense"){
      c.innerHTML =
        '<div class="control-group"><label>Material:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-k0">Intertwined</button>' +
        '<button class="preset-btn" id="c-k1">Condensed</button></div></div>' +
        '<div class="control-group"><label>Result:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Two chromatids at the centromere.</div></div>';
      document.getElementById("c-k0").onclick = function(){ cond = 0; draw(0); };
      document.getElementById("c-k1").onclick = function(){ cond = 1; draw(0); };
    } else if(view === "asters"){
      c.innerHTML =
        '<div class="control-group"><label>Centrosomes:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-s0">Together</button>' +
        '<button class="preset-btn" id="c-s1">Opposite poles</button></div></div>' +
        '<div class="control-group"><label>Apparatus:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Two asters + spindle fibres.</div></div>';
      document.getElementById("c-s0").onclick = function(){ apart = 0; draw(0); };
      document.getElementById("c-s1").onclick = function(){ apart = 1; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Chromosomes:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-p0">Scattered</button>' +
        '<button class="preset-btn" id="c-p1">At plate</button></div></div>' +
        '<div class="control-group"><label>Wiring:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Sister kinetochores to opposite poles.</div></div>';
      document.getElementById("c-p0").onclick = function(){ aligned = 0; draw(0); };
      document.getElementById("c-p1").onclick = function(){ aligned = 1; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Prophase &amp; Metaphase (\u00A710.2.1\u2013\u00A710.2.2)</text>';
    if(view === "condense"){
      if(cond === 0){
        m += '<path d="M150,150 q60,-60 120,0 t120,0 t120,0" fill="none" stroke="#38bdf8" stroke-width="3"/>';
        m += '<path d="M150,180 q60,60 120,0 t120,0 t120,0" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.6"/>';
        m += '<text x="350" y="240" fill="#94a3b8" font-size="11" text-anchor="middle">New DNA: not distinct but intertwined</text>';
      } else {
        for(var i = 0; i < 3; i++){
          var cx = 230 + i * 120;
          m += '<rect x="' + (cx - 14) + '" y="110" width="12" height="100" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
          m += '<rect x="' + (cx + 2) + '" y="110" width="12" height="100" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
          m += '<circle cx="' + cx + '" cy="160" r="6" fill="#f59e0b"/>';
        }
        m += '<text x="350" y="240" fill="#22c55e" font-size="11" text-anchor="middle">Compact mitotic chromosomes: two chromatids at the centromere</text>';
      }
      m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">Figure 10.2 a \u00B7 untangled during chromatin condensation</text>';
      readout(cell("Material", cond ? "condensed" : "intertwined", cond ? "#22c55e" : "#38bdf8"));
      verdict(cond ? "Prophase completion event 1." : "Initiate condensation of chromosomal material.");
    } else if(view === "asters"){
      var lx = apart ? 120 : 300, rx = apart ? 580 : 400;
      m += '<circle cx="' + lx + '" cy="170" r="12" fill="#f59e0b"/>';
      m += '<circle cx="' + rx + '" cy="170" r="12" fill="#f59e0b"/>';
      for(var a = 0; a < 8; a++){
        var ang = a * Math.PI / 4;
        m += '<line x1="' + lx + '" y1="170" x2="' + (lx + 34 * Math.cos(ang)) + '" y2="' + (170 + 34 * Math.sin(ang)) + '" stroke="#f59e0b" stroke-width="2" opacity="0.8"/>';
        m += '<line x1="' + rx + '" y1="170" x2="' + (rx + 34 * Math.cos(ang)) + '" y2="' + (170 + 34 * Math.sin(ang)) + '" stroke="#f59e0b" stroke-width="2" opacity="0.8"/>';
      }
      if(apart){
        m += '<line x1="154" y1="170" x2="546" y2="170" stroke="#64748b" stroke-width="2" stroke-dasharray="6,4"/>';
        m += '<text x="350" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">spindle fibres</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">' + (apart ? "Two asters + spindle fibres = mitotic apparatus" : "Centrosome duplicated in S; march to poles next") + "</text>";
      readout(cell("Centrosomes", apart ? "opposite poles" : "together", apart ? "#22c55e" : "#f59e0b"));
      verdict(apart ? "Prophase completion event 2." : "Move the centrosomes apart.");
    } else {
      m += '<line x1="350" y1="80" x2="350" y2="250" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="5,4"/>';
      m += '<text x="350" y="268" fill="#22c55e" font-size="11" text-anchor="middle">metaphase plate (equator)</text>';
      var pxs = aligned ? [350, 350, 350] : [220, 350, 470];
      var pys = aligned ? [130, 170, 210] : [130, 190, 140];
      for(var k = 0; k < 3; k++){
        m += '<rect x="' + (pxs[k] - 12) + '" y="' + (pys[k] - 16) + '" width="10" height="32" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<rect x="' + (pxs[k] + 2) + '" y="' + (pys[k] - 16) + '" width="10" height="32" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<circle cx="' + pxs[k] + '" cy="' + pys[k] + '" r="4" fill="#f59e0b"/>';
        m += '<line x1="' + pxs[k] + '" y1="' + pys[k] + '" x2="120" y2="' + pys[k] + '" stroke="#64748b" stroke-width="1.5"/>';
        m += '<line x1="' + pxs[k] + '" y1="' + pys[k] + '" x2="580" y2="' + pys[k] + '" stroke="#64748b" stroke-width="1.5"/>';
      }
      m += '<text x="120" y="100" fill="#f59e0b" font-size="10" text-anchor="middle">pole</text>';
      m += '<text x="580" y="100" fill="#f59e0b" font-size="10" text-anchor="middle">pole</text>';
      readout(cell("Chromosomes", aligned ? "at plate" : "scattered", aligned ? "#22c55e" : "#38bdf8") + cell("Morphology", "best studied here", "#94a3b8"));
      verdict(aligned ? "Metaphase: sisters wired to opposite poles." : "Move chromosomes to the spindle equator.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 4. Chromosome March & Cytokinesis Lab (divisionalab) - L4, 10.2.3-10.2.5
// -------------------------------------------------------------------------
window.SIMS.divisionalab = (function(){
  var view = "anaphase"; // "anaphase", "telo", "cytokinesis"
  var split = false, rebuilt = false, plant = false;

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Daughter chromosomes</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Rebuilt nuclei</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Furrow / cell-plate</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-anaphase">Anaphase March</button>' +
      '<button class="preset-btn" id="p-telo">Telophase Rebuild</button>' +
      '<button class="preset-btn" id="p-cytokinesis">Furrow vs Plate</button>';
    document.getElementById("p-anaphase").onclick = function(){ setActivePreset(this); setV("anaphase"); };
    document.getElementById("p-telo").onclick = function(){ setActivePreset(this); setV("telo"); };
    document.getElementById("p-cytokinesis").onclick = function(){ setActivePreset(this); setV("cytokinesis"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "anaphase"){
      c.innerHTML =
        '<div class="control-group"><label>Centromeres:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-n0">Joined at plate</button>' +
        '<button class="preset-btn" id="c-n1">Split + march</button></div></div>' +
        '<div class="control-group"><label>March order:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Centromere leads; arms trail behind.</div></div>';
      document.getElementById("c-n0").onclick = function(){ split = false; draw(0); };
      document.getElementById("c-n1").onclick = function(){ split = true; draw(0); };
    } else if(view === "telo"){
      c.innerHTML =
        '<div class="control-group"><label>Poles:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-t0">Bare clusters</button>' +
        '<button class="preset-btn" id="c-t1">Rebuild nuclei</button></div></div>' +
        '<div class="control-group"><label>Reforms:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Envelope, nucleolus, golgi, ER.</div></div>';
      document.getElementById("c-t0").onclick = function(){ rebuilt = false; draw(0); };
      document.getElementById("c-t1").onclick = function(){ rebuilt = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Cell type:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-y0">Animal (furrow)</button>' +
        '<button class="preset-btn" id="c-y1">Plant (cell-plate)</button></div></div>' +
        '<div class="control-group"><label>Skip both:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Multinucleate syncytium (coconut).</div></div>';
      document.getElementById("c-y0").onclick = function(){ plant = false; draw(0); };
      document.getElementById("c-y1").onclick = function(){ plant = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Anaphase to Cytokinesis (\u00A710.2.3\u2013\u00A710.2.5)</text>';
    if(view === "anaphase"){
      if(!split){
        for(var i = 0; i < 3; i++){
          var iy = 120 + i * 45;
          m += '<rect x="328" y="' + (iy - 14) + '" width="10" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
          m += '<rect x="342" y="' + (iy - 14) + '" width="10" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
          m += '<circle cx="345" cy="' + iy + '" r="4" fill="#f59e0b"/>';
        }
        m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Chromosomes at the metaphase plate, centromeres whole</text>';
      } else {
        for(var j = 0; j < 3; j++){
          var jy = 120 + j * 45;
          m += '<circle cx="200" cy="' + jy + '" r="5" fill="#f59e0b"/>';
          m += '<line x1="200" y1="' + jy + '" x2="245" y2="' + (jy - 12) + '" stroke="#38bdf8" stroke-width="3"/>';
          m += '<line x1="200" y1="' + jy + '" x2="245" y2="' + (jy + 12) + '" stroke="#38bdf8" stroke-width="3"/>';
          m += '<circle cx="500" cy="' + jy + '" r="5" fill="#f59e0b"/>';
          m += '<line x1="500" y1="' + jy + '" x2="455" y2="' + (jy - 12) + '" stroke="#38bdf8" stroke-width="3"/>';
          m += '<line x1="500" y1="' + jy + '" x2="455" y2="' + (jy + 12) + '" stroke="#38bdf8" stroke-width="3"/>';
        }
        m += '<text x="150" y="100" fill="#f59e0b" font-size="10" text-anchor="middle">pole</text>';
        m += '<text x="550" y="100" fill="#f59e0b" font-size="10" text-anchor="middle">pole</text>';
        m += '<text x="350" y="262" fill="#22c55e" font-size="11" text-anchor="middle">Simultaneous split \u00B7 centromere leading, arms trailing (Fig. 10.2 c)</text>';
      }
      readout(cell("Centromeres", split ? "split" : "whole", split ? "#22c55e" : "#38bdf8") + cell("Moving", split ? "to poles" : "at plate", "#94a3b8"));
      verdict(split ? "Anaphase: chromatids march to opposite poles." : "Split all centromeres simultaneously.");
    } else if(view === "telo"){
      var items = rebuilt ? ["envelope", "nucleolus", "golgi", "ER"] : [];
      [200, 500].forEach(function(px){
        if(rebuilt){
          m += '<circle cx="' + px + '" cy="170" r="55" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
          m += '<circle cx="' + px + '" cy="170" r="12" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
          m += '<text x="' + px + '" y="173" fill="#22c55e" font-size="8" text-anchor="middle">nucl</text>';
        } else {
          for(var d = 0; d < 5; d++) m += '<circle cx="' + (px - 24 + d * 12) + '" cy="' + (160 + (d % 2) * 18) + '" r="5" fill="#38bdf8"/>';
        }
        m += '<text x="' + px + '" y="250" fill="#94a3b8" font-size="10" text-anchor="middle">' + (rebuilt ? "daughter nucleus" : "bare cluster") + "</text>";
      });
      m += '<text x="350" y="90" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">' + (rebuilt ? "Rebuilt: envelope + nucleolus + golgi + ER" : "Decondensed clusters, identity lost") + "</text>";
      readout(cell("Nuclei", rebuilt ? "2 rebuilt" : "0 yet", rebuilt ? "#22c55e" : "#38bdf8"));
      verdict(rebuilt ? "Telophase: two daughter nuclei." : "Chromosomes decondense at the poles.");
    } else {
      if(!plant){
        m += '<ellipse cx="350" cy="170" rx="180" ry="80" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
        m += '<path d="M350,95 Q330,140 350,170 Q370,140 350,95" fill="none" stroke="#f59e0b" stroke-width="3"/>';
        m += '<path d="M350,245 Q330,200 350,170 Q370,200 350,245" fill="none" stroke="#f59e0b" stroke-width="3"/>';
        m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Furrow deepens, joins in the centre \u2192 two cytoplasms</text>';
      } else {
        m += '<rect x="170" y="90" width="360" height="160" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
        m += '<line x1="350" y1="110" x2="350" y2="230" stroke="#f59e0b" stroke-width="4"/>';
        m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Cell-plate grows outward \u2192 middle lamella (wall inextensible)</text>';
      }
      m += '<text x="350" y="70" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">' + (plant ? "Plant cytokinesis: cell-plate" : "Animal cytokinesis: furrow") + "</text>";
      readout(cell("Mechanism", plant ? "cell-plate" : "furrow", "#f59e0b") + cell("Direction", plant ? "centre-out" : "outside-in", "#38bdf8"));
      verdict(plant ? "Wall grows from centre to lateral walls." : "Furrow joins in the centre.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 5. Mitosis Significance & Meiosis Overview Lab (signiflab) - L5, 10.3-10.4
// -------------------------------------------------------------------------
window.SIMS.signiflab = (function(){
  var view = "repair"; // "repair", "halve", "contract"
  var job = 0, fused = false, feat = 0;
  var JOBS = [
    ["Growth", "multicellular bodies via mitosis"],
    ["Ratio", "restore nucleo-cytoplasmic ratio"],
    ["Repair", "epidermis, gut lining, blood"],
    ["Meristems", "apical + lateral cambium"]
  ];
  var FEATS = [
    ["Two divisions", "meiosis I and II"],
    ["One replication", "single S phase"],
    ["Pair + recombine", "non-sister chromatids"],
    ["Four haploid", "end of meiosis II"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Mitosis pays</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Meiosis halves</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Fertilisation restores</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-repair">Mitosis Pays</button>' +
      '<button class="preset-btn" id="p-halve">Halve + Restore</button>' +
      '<button class="preset-btn" id="p-contract">Meiosis Contract</button>';
    document.getElementById("p-repair").onclick = function(){ setActivePreset(this); setV("repair"); };
    document.getElementById("p-halve").onclick = function(){ setActivePreset(this); setV("halve"); };
    document.getElementById("p-contract").onclick = function(){ setActivePreset(this); setV("contract"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "repair"){
      c.innerHTML =
        '<div class="control-group"><label>Contribution:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        JOBS.map(function(j, i){ return '<button class="preset-btn" data-jb="' + i + '">' + j[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Haploid too:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Lower plants + social insects divide haploid cells.</div></div>';
      c.querySelectorAll("[data-jb]").forEach(function(b){ b.onclick = function(){ job = Number(b.dataset.jb); draw(0); }; });
    } else if(view === "halve"){
      c.innerHTML =
        '<div class="control-group"><label>Cycle:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-h0">Meiosis (2n\u2192n)</button>' +
        '<button class="preset-btn" id="c-h1">+ fertilisation (n\u21922n)</button></div></div>' +
        '<div class="control-group"><label>Net:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Species number conserved across generations.</div></div>';
      document.getElementById("c-h0").onclick = function(){ fused = false; draw(0); };
      document.getElementById("c-h1").onclick = function(){ fused = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Feature:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        FEATS.map(function(f, i){ return '<button class="preset-btn" data-ft="' + i + '">' + f[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Venue:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Gametogenesis in plants and animals.</div></div>';
      c.querySelectorAll("[data-ft]").forEach(function(b){ b.onclick = function(){ feat = Number(b.dataset.ft); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Significance &amp; Meiosis (\u00A710.3\u2013\u00A710.4)</text>';
    if(view === "repair"){
      var jb = JOBS[job];
      for(var i = 0; i < 4; i++){
        var x = 45 + i * 160;
        var on = i === job;
        m += '<rect x="' + x + '" y="120" width="140" height="90" rx="8" fill="#0f172a" stroke="' + (on ? "#22c55e" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 70) + '" y="155" fill="' + (on ? "#22c55e" : "#475569") + '" font-size="11" font-weight="700" text-anchor="middle">' + JOBS[i][0] + "</text>";
        m += '<text x="' + (x + 70) + '" y="175" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="8" text-anchor="middle">' + JOBS[i][1] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Now viewing: ' + jb[0] + " \u2014 " + jb[1] + "</text>";
      readout(cell("Pays for", jb[0], "#22c55e") + cell("Detail", jb[1], "#94a3b8"));
      verdict("Mitosis: identical diploid daughters at work.");
    } else if(view === "halve"){
      if(!fused){
        m += '<circle cx="250" cy="170" r="45" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
        m += '<text x="250" y="178" fill="#38bdf8" font-size="16" font-weight="700" text-anchor="middle">2n</text>';
        m += '<text x="350" y="178" fill="#64748b" font-size="18" text-anchor="middle">\u2192</text>';
        m += '<circle cx="450" cy="170" r="45" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
        m += '<text x="450" y="178" fill="#38bdf8" font-size="16" font-weight="700" text-anchor="middle">n</text>';
        m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Meiosis halves the number for gametes</text>';
      } else {
        m += '<circle cx="200" cy="170" r="40" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="200" y="177" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">n</text>';
        m += '<text x="280" y="178" fill="#64748b" font-size="16" text-anchor="middle">+</text>';
        m += '<circle cx="360" cy="170" r="40" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="360" y="177" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">n</text>';
        m += '<text x="430" y="178" fill="#64748b" font-size="16" text-anchor="middle">\u2192</text>';
        m += '<circle cx="520" cy="170" r="45" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>';
        m += '<text x="520" y="178" fill="#f59e0b" font-size="16" font-weight="700" text-anchor="middle">2n</text>';
        m += '<text x="350" y="262" fill="#f59e0b" font-size="11" text-anchor="middle">Fertilisation restores diploidy \u2014 number conserved</text>';
      }
      readout(cell("Number", fused ? "n+n\u21922n" : "2n\u2192n", fused ? "#f59e0b" : "#38bdf8"));
      verdict(fused ? "Halve + restore: conserved." : "Meiosis ensures the haploid phase.");
    } else {
      var f = FEATS[feat];
      for(var k = 0; k < 4; k++){
        var kx = 45 + k * 160;
        var kon = k === feat;
        m += '<rect x="' + kx + '" y="120" width="140" height="90" rx="8" fill="#0f172a" stroke="' + (kon ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (kx + 70) + '" y="155" fill="' + (kon ? "#38bdf8" : "#475569") + '" font-size="10" font-weight="700" text-anchor="middle">' + FEATS[k][0] + "</text>";
        m += '<text x="' + (kx + 70) + '" y="175" fill="' + (kon ? "#94a3b8" : "#475569") + '" font-size="8" text-anchor="middle">' + FEATS[k][1] + "</text>";
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Key features of meiosis, PDF p. 6</text>';
      readout(cell("Feature", f[0], "#38bdf8") + cell("Detail", f[1], "#94a3b8"));
      verdict("Two divisions, one replication, four haploid cells.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 6. Meiotic Phases & Dyad-to-Tetrad Lab (meiosislab) - L6, 10.4.1-10.4.2
// -------------------------------------------------------------------------
window.SIMS.meiosislab = (function(){
  var view = "march"; // "march", "reduction", "dyad"
  var sub = 1, ana1 = false, tetra = false;
  var SUBS = [
    ["Leptotene", "chromosomes visible"],
    ["Zygotene", "synapsis \u2192 bivalent"],
    ["Pachytene", "crossing over"],
    ["Diplotene", "chiasmata"],
    ["Diakinesis", "terminalisation"]
  ];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Homologues</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Crossover links</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Haploid products</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-march">Prophase I March</button>' +
      '<button class="preset-btn" id="p-reduction">Homologue Split</button>' +
      '<button class="preset-btn" id="p-dyad">Dyad to Tetrad</button>';
    document.getElementById("p-march").onclick = function(){ setActivePreset(this); setV("march"); };
    document.getElementById("p-reduction").onclick = function(){ setActivePreset(this); setV("reduction"); };
    document.getElementById("p-dyad").onclick = function(){ setActivePreset(this); setV("dyad"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "march"){
      c.innerHTML =
        '<div class="control-group"><label>Subphase:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        SUBS.map(function(s, i){ return '<button class="preset-btn" data-sb="' + i + '">' + s[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Enzyme:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Crossing over is mediated by recombinase.</div></div>';
      c.querySelectorAll("[data-sb]").forEach(function(b){ b.onclick = function(){ sub = Number(b.dataset.sb); draw(0); }; });
    } else if(view === "reduction"){
      c.innerHTML =
        '<div class="control-group"><label>Anaphase I:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-a0">Bivalents at plate</button>' +
        '<button class="preset-btn" id="c-a1">Homologues part</button></div></div>' +
        '<div class="control-group"><label>Sisters:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Stay associated at centromeres.</div></div>';
      document.getElementById("c-a0").onclick = function(){ ana1 = false; draw(0); };
      document.getElementById("c-a1").onclick = function(){ ana1 = true; draw(0); };
    } else {
      c.innerHTML =
        '<div class="control-group"><label>After:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        '<button class="preset-btn" id="c-d0">Meiosis I (dyad)</button>' +
        '<button class="preset-btn" id="c-d1">Meiosis II (tetrad)</button></div></div>' +
        '<div class="control-group"><label>Between:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Interkinesis: no DNA replication.</div></div>';
      document.getElementById("c-d0").onclick = function(){ tetra = false; draw(0); };
      document.getElementById("c-d1").onclick = function(){ tetra = true; draw(0); };
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Meiotic Phases (\u00A710.4.1\u2013\u00A710.4.2)</text>';
    if(view === "march"){
      var s = SUBS[sub];
      for(var i = 0; i < 5; i++){
        var x = 30 + i * 130;
        var on = i === sub;
        m += '<rect x="' + x + '" y="120" width="118" height="95" rx="8" fill="#0f172a" stroke="' + (on ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
        m += '<text x="' + (x + 59) + '" y="155" fill="' + (on ? "#38bdf8" : "#475569") + '" font-size="10" font-weight="700" text-anchor="middle">' + SUBS[i][0] + "</text>";
        m += '<text x="' + (x + 59) + '" y="178" fill="' + (on ? "#94a3b8" : "#475569") + '" font-size="8" text-anchor="middle">' + SUBS[i][1] + "</text>";
        if(i < 4) m += '<text x="' + (x + 124) + '" y="170" fill="#64748b" font-size="14" text-anchor="middle">\u2192</text>';
      }
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Oocyte diplotene can last months or years \u00B7 diakinesis \u2192 metaphase</text>';
      readout(cell("Subphase", s[0], "#38bdf8") + cell("Marks", s[1], "#f59e0b"));
      verdict("Prophase I: longer and more complex than mitotic prophase.");
    } else if(view === "reduction"){
      if(!ana1){
        m += '<line x1="350" y1="80" x2="350" y2="250" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5,4"/>';
        [130, 175, 220].forEach(function(by){
          m += '<rect x="322" y="' + (by - 14) + '" width="12" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
          m += '<rect x="366" y="' + (by - 14) + '" width="12" height="28" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        });
        m += '<text x="350" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">Metaphase I: bivalents on the equatorial plate (Fig. 10.3)</text>';
      } else {
        [130, 175, 220].forEach(function(cy){
          m += '<rect x="180" y="' + (cy - 14) + '" width="12" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
          m += '<rect x="508" y="' + (cy - 14) + '" width="12" height="28" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
        });
        m += '<text x="350" y="268" fill="#22c55e" font-size="11" text-anchor="middle">Anaphase I: homologues part, sisters stay joined at centromeres</text>';
      }
      readout(cell("Parting", ana1 ? "homologues" : "aligned", ana1 ? "#22c55e" : "#38bdf8") + cell("Sisters", "joined", "#94a3b8"));
      verdict(ana1 ? "Reduction: each pole gets half the number." : "Bivalents aligned; part them next.");
    } else {
      if(!tetra){
        [270, 430].forEach(function(px){
          m += '<circle cx="' + px + '" cy="170" r="48" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
          m += '<text x="' + px + '" y="166" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">n</text>';
          m += '<text x="' + px + '" y="184" fill="#94a3b8" font-size="10" text-anchor="middle">2C</text>';
        });
        m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Dyad of cells (telophase I + cytokinesis) \u00B7 then interkinesis, no replication</text>';
      } else {
        [200, 300, 400, 500].forEach(function(px){
          m += '<circle cx="' + px + '" cy="170" r="38" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
          m += '<text x="' + px + '" y="166" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">n</text>';
          m += '<text x="' + px + '" y="182" fill="#94a3b8" font-size="9" text-anchor="middle">C</text>';
        });
        m += '<text x="350" y="262" fill="#22c55e" font-size="11" text-anchor="middle">Tetrad of cells: four haploid daughters (Fig. 10.4)</text>';
      }
      readout(cell("Cells", tetra ? "4 (tetrad)" : "2 (dyad)", tetra ? "#22c55e" : "#38bdf8") + cell("Each", tetra ? "n, C" : "n, 2C", "#94a3b8"));
      verdict(tetra ? "Meiosis II splits sisters without fresh replication." : "Dyad waits through interkinesis.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// 7. Meiosis Significance & N/C Ledger Lab (comparelab) - L7, 10.5 + Summary
// -------------------------------------------------------------------------
window.SIMS.comparelab = (function(){
  var view = "nc"; // "nc", "vs", "onion"
  var stage = 0, row = 0, ostep = 0;
  var STAGES = [
    ["G1", "2n", "2C"], ["S", "2n", "4C"], ["G2-meta", "2n", "4C"],
    ["Anaphase", "4n", "4C"], ["Daughters", "2n", "2C"],
    ["Dyad", "n", "2C"], ["Tetrad", "n", "C"]
  ];
  var ROWS = [
    ["Divisions", "one", "two (I, II)"],
    ["Replication", "one S", "one S"],
    ["Number", "equational 2n", "reductional n"],
    ["Pairing", "none", "synapsis + crossing"],
    ["Products", "2 diploid", "4 haploid"]
  ];
  var OSTEPS = [["G1", "16", "2C"], ["After S", "16", "4C"], ["G2", "16", "4C"], ["After M", "16", "2C"]];

  function setV(v){ view = v; mountControls(); draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Chromosome number (N)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>DNA content (C)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Onion: 16 chromosomes</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-nc">N/C Ledger</button>' +
      '<button class="preset-btn" id="p-vs">Mitosis vs Meiosis</button>' +
      '<button class="preset-btn" id="p-onion">Onion 16</button>';
    document.getElementById("p-nc").onclick = function(){ setActivePreset(this); setV("nc"); };
    document.getElementById("p-vs").onclick = function(){ setActivePreset(this); setV("vs"); };
    document.getElementById("p-onion").onclick = function(){ setActivePreset(this); setV("onion"); };
    mountControls();
    draw(0);
  }

  function mountControls(){
    var c = document.getElementById("lab-controls");
    if(view === "nc"){
      c.innerHTML =
        '<div class="control-group"><label>Stage:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        STAGES.map(function(s, i){ return '<button class="preset-btn" data-st="' + i + '">' + s[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Rules:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">N doubles only at anaphase; C doubles only in S.</div></div>';
      c.querySelectorAll("[data-st]").forEach(function(b){ b.onclick = function(){ stage = Number(b.dataset.st); draw(0); }; });
    } else if(view === "vs"){
      c.innerHTML =
        '<div class="control-group"><label>Aspect:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        ROWS.map(function(r, i){ return '<button class="preset-btn" data-rw="' + i + '">' + r[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Purpose:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">Growth/repair vs gametes.</div></div>';
      c.querySelectorAll("[data-rw]").forEach(function(b){ b.onclick = function(){ row = Number(b.dataset.rw); draw(0); }; });
    } else {
      c.innerHTML =
        '<div class="control-group"><label>Point:</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
        OSTEPS.map(function(o, i){ return '<button class="preset-btn" data-os="' + i + '">' + o[0] + "</button>"; }).join("") + "</div></div>" +
        '<div class="control-group"><label>Given:</label><div style="color:#94a3b8;font-size:12px;margin-top:4px;">16 chromosomes; 2C after M.</div></div>';
      c.querySelectorAll("[data-os]").forEach(function(b){ b.onclick = function(){ ostep = Number(b.dataset.os); draw(0); }; });
    }
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';
    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">N/C Ledger &amp; Contrasts (\u00A710.5 + Summary)</text>';
    if(view === "nc"){
      var st = STAGES[stage];
      m += '<text x="350" y="100" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">' + st[0] + "</text>";
      m += '<rect x="170" y="130" width="150" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="245" y="168" fill="#38bdf8" font-size="18" font-weight="700" text-anchor="middle">' + st[1] + "</text>";
      m += '<text x="245" y="190" fill="#64748b" font-size="10" text-anchor="middle">chromosomes (N)</text>';
      m += '<rect x="380" y="130" width="150" height="80" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<text x="455" y="168" fill="#22c55e" font-size="18" font-weight="700" text-anchor="middle">' + st[2] + "</text>";
      m += '<text x="455" y="190" fill="#64748b" font-size="10" text-anchor="middle">DNA content (C)</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Q16 ledger \u00B7 anaphase promotes chromatids to chromosomes \u00B7 meiosis I halves N</text>';
      readout(cell("Stage", st[0], "#f8fafc") + cell("N", st[1], "#38bdf8") + cell("C", st[2], "#22c55e"));
      verdict("Number and content tracked separately.");
    } else if(view === "vs"){
      var rw = ROWS[row];
      m += '<rect x="60" y="120" width="170" height="80" rx="8" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>';
      m += '<text x="145" y="160" fill="#cbd5e1" font-size="12" font-weight="700" text-anchor="middle">' + rw[0] + "</text>";
      m += '<rect x="250" y="120" width="190" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="345" y="150" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">Mitosis</text>';
      m += '<text x="345" y="172" fill="#94a3b8" font-size="11" text-anchor="middle">' + rw[1] + "</text>";
      m += '<rect x="450" y="120" width="190" height="80" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="545" y="150" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">Meiosis</text>';
      m += '<text x="545" y="172" fill="#94a3b8" font-size="11" text-anchor="middle">' + rw[2] + "</text>";
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Q11 comparison \u00B7 equational vs reductional</text>';
      readout(cell("Aspect", rw[0], "#cbd5e1") + cell("Mitosis", rw[1], "#38bdf8") + cell("Meiosis", rw[2], "#22c55e"));
      verdict("One division, same number \u2014 vs \u2014 two divisions, halved number.");
    } else {
      var os = OSTEPS[ostep];
      m += '<text x="350" y="100" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">Onion root tip \u2014 ' + os[0] + "</text>";
      m += '<rect x="170" y="130" width="150" height="80" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<text x="245" y="168" fill="#f59e0b" font-size="18" font-weight="700" text-anchor="middle">' + os[1] + "</text>";
      m += '<text x="245" y="190" fill="#64748b" font-size="10" text-anchor="middle">chromosomes</text>';
      m += '<rect x="380" y="130" width="150" height="80" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2.5"/>';
      m += '<text x="455" y="168" fill="#22c55e" font-size="18" font-weight="700" text-anchor="middle">' + os[2] + "</text>";
      m += '<text x="455" y="190" fill="#64748b" font-size="10" text-anchor="middle">DNA content</text>';
      m += '<text x="350" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Margin box, PDF p. 3 \u00B7 16/16/16 chromosomes \u00B7 2C/4C/4C DNA</text>';
      readout(cell("Point", os[0], "#f8fafc") + cell("Count", os[1], "#f59e0b") + cell("DNA", os[2], "#22c55e"));
      verdict("Equational: 16 before, 16 after.");
    }
    svg.innerHTML = m;
  }

  return {mount: mount, draw: draw};
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-109 -
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
