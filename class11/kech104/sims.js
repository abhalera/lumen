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
// 1. SIMULATION 1: Lewis Electron Dot & Formal Charge Lab (lewisdot)
// -------------------------------------------------------------------------
window.SIMS.lewisdot = (function(){
  var currentMol = "co3"; // "co3", "o3", "hno3", "co"
  var selectedAtomIdx = 0;

  var molecules = {
    "co3": {
      name: "Carbonate Ion (CO₃²⁻)",
      totalE: 24,
      atoms: [
        { sym: "C", v: 4, l: 0, s: 8, label: "Central Carbon", x: 450, y: 250, color: "#38bdf8" },
        { sym: "O(1)", v: 6, l: 4, s: 4, label: "Carbonyl Oxygen (=O)", x: 450, y: 130, color: "#ef4444" },
        { sym: "O(2)", v: 6, l: 6, s: 2, label: "Negative Oxygen (—O⁻)", x: 330, y: 320, color: "#f59e0b" },
        { sym: "O(3)", v: 6, l: 6, s: 2, label: "Negative Oxygen (—O⁻)", x: 570, y: 320, color: "#f59e0b" }
      ],
      bonds: [
        { from: 0, to: 1, type: "double" },
        { from: 0, to: 2, type: "single" },
        { from: 0, to: 3, type: "single" }
      ],
      notes: "Resonance hybrid of 3 equivalent forms; net charge = -2; C-O bond order = 4/3 = 1.33."
    },
    "o3": {
      name: "Ozone (O₃)",
      totalE: 18,
      atoms: [
        { sym: "O(central)", v: 6, l: 2, s: 6, label: "Central Oxygen", x: 450, y: 200, color: "#38bdf8" },
        { sym: "O(left)", v: 6, l: 4, s: 4, label: "Double-bonded Oxygen", x: 340, y: 290, color: "#ef4444" },
        { sym: "O(right)", v: 6, l: 6, s: 2, label: "Single-bonded Oxygen", x: 560, y: 290, color: "#f59e0b" }
      ],
      bonds: [
        { from: 0, to: 1, type: "double" },
        { from: 0, to: 2, type: "single" }
      ],
      notes: "Central O formal charge = +1; single-bonded O = -1; double-bonded O = 0. Net charge = 0."
    },
    "hno3": {
      name: "Nitric Acid (HNO₃)",
      totalE: 24,
      atoms: [
        { sym: "N", v: 5, l: 0, s: 8, label: "Central Nitrogen", x: 450, y: 240, color: "#38bdf8" },
        { sym: "O(carbonyl)", v: 6, l: 4, s: 4, label: "Terminal Double O", x: 450, y: 120, color: "#ef4444" },
        { sym: "O(coordinate)", v: 6, l: 6, s: 2, label: "Terminal Single O⁻", x: 570, y: 310, color: "#f59e0b" },
        { sym: "O(hydroxyl)", v: 6, l: 4, s: 4, label: "Hydroxyl Oxygen", x: 330, y: 310, color: "#10b981" },
        { sym: "H", v: 1, l: 0, s: 2, label: "Hydrogen", x: 230, y: 310, color: "#e2e8f0" }
      ],
      bonds: [
        { from: 0, to: 1, type: "double" },
        { from: 0, to: 2, type: "single" },
        { from: 0, to: 3, type: "single" },
        { from: 3, to: 4, type: "single" }
      ],
      notes: "N has FC = +1; coordinate O has FC = -1; OH and carbonyl O have FC = 0."
    },
    "co": {
      name: "Carbon Monoxide (CO)",
      totalE: 10,
      atoms: [
        { sym: "C", v: 4, l: 2, s: 6, label: "Carbon Atom", x: 380, y: 250, color: "#f59e0b" },
        { sym: "O", v: 6, l: 2, s: 6, label: "Oxygen Atom", x: 520, y: 250, color: "#38bdf8" }
      ],
      bonds: [
        { from: 0, to: 1, type: "triple" }
      ],
      notes: "C has FC = 4 - 2 - 3 = -1; O has FC = 6 - 2 - 3 = +1. Triple bond with coordinate pair from O to C."
    }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Central / Positive Atom</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Negative Formal Charge</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Zero Formal Charge</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-co3">Carbonate CO₃²⁻</button>' +
      '<button class="preset-btn" id="p-o3">Ozone O₃</button>' +
      '<button class="preset-btn" id="p-hno3">Nitric Acid HNO₃</button>' +
      '<button class="preset-btn" id="p-co">Carbon Monoxide CO</button>';

    document.getElementById("p-co3").onclick = function(){ setActivePreset(this); currentMol = "co3"; selectedAtomIdx = 0; draw(0); };
    document.getElementById("p-o3").onclick = function(){ setActivePreset(this); currentMol = "o3"; selectedAtomIdx = 0; draw(0); };
    document.getElementById("p-hno3").onclick = function(){ setActivePreset(this); currentMol = "hno3"; selectedAtomIdx = 0; draw(0); };
    document.getElementById("p-co").onclick = function(){ setActivePreset(this); currentMol = "co"; selectedAtomIdx = 0; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Select Target Atom to Calculate Formal Charge:</label>' +
        '<select id="atom-select" style="padding:8px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;font-size:14px;"></select>' +
      '</div>';

    updateAtomDropdown();
    draw(0);
  }

  function updateAtomDropdown(){
    var sel = document.getElementById("atom-select");
    if(!sel) return;
    var mol = molecules[currentMol];
    var html = "";
    mol.atoms.forEach(function(a, idx){
      html += '<option value="' + idx + '"' + (idx === selectedAtomIdx ? ' selected' : '') + '>' + a.sym + ' — ' + a.label + '</option>';
    });
    sel.innerHTML = html;
    sel.onchange = function(){
      selectedAtomIdx = parseInt(this.value, 10);
      draw(0);
    };
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var mol = molecules[currentMol];
    var atom = mol.atoms[selectedAtomIdx] || mol.atoms[0];

    // Compute formal charge
    var fc = atom.v - atom.l - (atom.s / 2);
    var fcStr = (fc > 0 ? "+" + fc : fc.toString());

    var out = '<rect width="900" height="500" fill="#0b1120"/>';

    // Title and formula
    out += '<text x="450" y="40" fill="#f8fafc" font-size="19" font-weight="700" text-anchor="middle">' + mol.name + ' — Lewis Octet & Formal Charge</text>';
    out += '<text x="450" y="70" fill="#94a3b8" font-size="13" text-anchor="middle">Total Valence Electrons = ' + mol.totalE + ' e⁻ (' + (mol.totalE/2) + ' pairs) | Click any atom or dropdown to inspect</text>';

    // Draw bonds
    mol.bonds.forEach(function(b){
      var a1 = mol.atoms[b.from];
      var a2 = mol.atoms[b.to];
      var dx = a2.x - a1.x;
      var dy = a2.y - a1.y;
      var len = Math.sqrt(dx*dx + dy*dy);
      var nx = -dy / len;
      var ny = dx / len;

      if(b.type === "single"){
        out += '<line x1="' + a1.x + '" y1="' + a1.y + '" x2="' + a2.x + '" y2="' + a2.y + '" stroke="#64748b" stroke-width="4"/>';
      } else if(b.type === "double"){
        out += '<line x1="' + (a1.x + nx*4) + '" y1="' + (a1.y + ny*4) + '" x2="' + (a2.x + nx*4) + '" y2="' + (a2.y + ny*4) + '" stroke="#38bdf8" stroke-width="3.5"/>';
        out += '<line x1="' + (a1.x - nx*4) + '" y1="' + (a1.y - ny*4) + '" x2="' + (a2.x - nx*4) + '" y2="' + (a2.y - ny*4) + '" stroke="#38bdf8" stroke-width="3.5"/>';
      } else if(b.type === "triple"){
        out += '<line x1="' + a1.x + '" y1="' + a1.y + '" x2="' + a2.x + '" y2="' + a2.y + '" stroke="#f59e0b" stroke-width="3"/>';
        out += '<line x1="' + (a1.x + nx*7) + '" y1="' + (a1.y + ny*7) + '" x2="' + (a2.x + nx*7) + '" y2="' + (a2.y + ny*7) + '" stroke="#f59e0b" stroke-width="3"/>';
        out += '<line x1="' + (a1.x - nx*7) + '" y1="' + (a1.y - ny*7) + '" x2="' + (a2.x - nx*7) + '" y2="' + (a2.y - ny*7) + '" stroke="#f59e0b" stroke-width="3"/>';
      }
    });

    // Draw atoms
    mol.atoms.forEach(function(a, idx){
      var isSel = (idx === selectedAtomIdx);
      var r = isSel ? 36 : 30;
      var strokeColor = isSel ? "#38bdf8" : "#475569";
      var strokeWidth = isSel ? 4 : 2;

      out += '<circle cx="' + a.x + '" cy="' + a.y + '" r="' + r + '" fill="#1e293b" stroke="' + strokeColor + '" stroke-width="' + strokeWidth + '" style="cursor:pointer;" onclick="SIMS.lewisdot.selectAtom(' + idx + ')"/>';
      out += '<text x="' + a.x + '" y="' + (a.y + 7) + '" fill="#f8fafc" font-size="18" font-weight="bold" text-anchor="middle" pointer-events="none">' + a.sym.split("(")[0] + '</text>';

      // Lone pairs visual indicator
      var lpCount = a.l / 2;
      for(var k = 0; k < lpCount; k++){
        var ang = (k * Math.PI / 2) + 0.3;
        var lx = a.x + (r + 10) * Math.cos(ang);
        var ly = a.y + (r + 10) * Math.sin(ang);
        out += '<circle cx="' + (lx - 3) + '" cy="' + ly + '" r="2.5" fill="#e2e8f0"/>';
        out += '<circle cx="' + (lx + 3) + '" cy="' + ly + '" r="2.5" fill="#e2e8f0"/>';
      }

      // Formal charge badge
      var thisFc = a.v - a.l - (a.s / 2);
      var badgeColor = thisFc === 0 ? "#64748b" : (thisFc > 0 ? "#38bdf8" : "#f59e0b");
      out += '<rect x="' + (a.x + 18) + '" y="' + (a.y - 32) + '" width="28" height="18" rx="4" fill="' + badgeColor + '"/>';
      out += '<text x="' + (a.x + 32) + '" y="' + (a.y - 19) + '" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">' + (thisFc > 0 ? "+" + thisFc : thisFc) + '</text>';
    });

    // Formal charge formula display box
    out += '<g transform="translate(100, 390)">';
    out += '<rect width="700" height="90" rx="10" fill="#1e293b" stroke="#334155"/>';
    out += '<text x="20" y="30" fill="#38bdf8" font-size="15" font-weight="bold">Formal Charge Formula: FC = V − L − (1/2)·S</text>';
    out += '<text x="20" y="55" fill="#f8fafc" font-size="14">Selected: <tspan fill="#f59e0b" font-weight="bold">' + atom.sym + ' (' + atom.label + ')</tspan> → V = ' + atom.v + ', Lone Pair Electrons (L) = ' + atom.l + ', Shared Bonding Electrons (S) = ' + atom.s + '</text>';
    out += '<text x="20" y="76" fill="#10b981" font-size="15" font-weight="bold">Calculation: FC = ' + atom.v + ' − ' + atom.l + ' − (' + atom.s + '/2) = ' + atom.v + ' − ' + atom.l + ' − ' + (atom.s/2) + ' = ' + fcStr + '</text>';
    out += '</g>';

    svg.innerHTML = out;

    readout(
      cell("Target Atom", atom.sym + " (" + atom.label + ")", "#38bdf8") +
      cell("Valence (V)", atom.v + " e⁻", "#f8fafc") +
      cell("Non-bonding (L)", atom.l + " e⁻", "#f59e0b") +
      cell("Shared (S)", atom.s + " e⁻", "#e2e8f0") +
      cell("Formal Charge", fcStr, fc === 0 ? "#10b981" : (fc > 0 ? "#38bdf8" : "#f59e0b"))
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #38bdf8;padding:12px;border-radius:6px;">' +
        '<strong>Lewis Structure Principle:</strong> Formal charge represents the difference between valence electrons in an isolated atom and the electron count assigned in a Lewis structure. ' +
        mol.notes +
      '</div>'
    );
  }

  function selectAtom(idx){
    selectedAtomIdx = idx;
    var sel = document.getElementById("atom-select");
    if(sel) sel.value = idx;
    draw(0);
  }

  return { mount: mount, draw: draw, selectAtom: selectAtom };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Born-Haber Cycle & Lattice Enthalpy Lab (bornhaber)
// -------------------------------------------------------------------------
window.SIMS.bornhaber = (function(){
  var currentSalt = "nacl"; // "nacl", "mgo", "cacl2"
  var currentStep = 5; // 0..5

  var salts = {
    "nacl": {
      name: "Sodium Chloride (NaCl)",
      delta_f: -411.2,
      sub: 108.4,
      diss: 121.0, // 1/2 of 242
      ie: 495.8,
      ea: -348.6,
      ul: -787.8, // Lattice enthalpy (released upon formation)
      metal: "Na", nonmetal: "Cl", solid: "NaCl(s)",
      gas_ions: "Na⁺(g) + Cl⁻(g)"
    },
    "mgo": {
      name: "Magnesium Oxide (MgO)",
      delta_f: -601.7,
      sub: 148.0,
      diss: 249.0, // 1/2 of 498
      ie: 2188.0, // IE1 + IE2
      ea: 657.0, // EA1 + EA2 (net endothermic for O²⁻)
      ul: -3843.7,
      metal: "Mg", nonmetal: "O", solid: "MgO(s)",
      gas_ions: "Mg²⁺(g) + O²⁻(g)"
    },
    "cacl2": {
      name: "Calcium Chloride (CaCl₂)",
      delta_f: -795.8,
      sub: 178.2,
      diss: 242.0, // 1 * 242 for Cl2
      ie: 1735.0, // IE1 + IE2
      ea: -697.2, // 2 * -348.6
      ul: -2253.8,
      metal: "Ca", nonmetal: "Cl₂", solid: "CaCl₂(s)",
      gas_ions: "Ca²⁺(g) + 2Cl⁻(g)"
    }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Standard Enthalpy of Formation Δ_f H°</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Endothermic Steps (+ΔH)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Lattice Enthalpy U_L</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-nacl">NaCl (Rock Salt, U = −788 kJ/mol)</button>' +
      '<button class="preset-btn" id="p-mgo">MgO (Divalent Oxide, U = −3844 kJ/mol)</button>' +
      '<button class="preset-btn" id="p-cacl2">CaCl₂ (Divalent Cation, U = −2254 kJ/mol)</button>';

    document.getElementById("p-nacl").onclick = function(){ setActivePreset(this); currentSalt = "nacl"; currentStep = 5; draw(0); };
    document.getElementById("p-mgo").onclick = function(){ setActivePreset(this); currentSalt = "mgo"; currentStep = 5; draw(0); };
    document.getElementById("p-cacl2").onclick = function(){ setActivePreset(this); currentSalt = "cacl2"; currentStep = 5; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Cycle Stage Explorer (0 to 5):</label>' +
        '<input type="range" id="stage-range" min="0" max="5" value="5" step="1">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Direct Jump to Step:</label>' +
        '<div style="display:flex;gap:6px;margin-top:4px;">' +
          '<button class="btn btn-sm" onclick="SIMS.bornhaber.setStep(1)">Sublimation</button>' +
          '<button class="btn btn-sm" onclick="SIMS.bornhaber.setStep(3)">Ionization</button>' +
          '<button class="btn btn-sm" onclick="SIMS.bornhaber.setStep(5)">Full Cycle</button>' +
        '</div>' +
      '</div>';

    var rng = document.getElementById("stage-range");
    if(rng) rng.oninput = function(){ currentStep = parseInt(this.value, 10); draw(0); };
    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var salt = salts[currentSalt];

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">' + salt.name + ' — Born-Haber Thermochemical Cycle</text>';

    // Energy ladder baseline
    // Levels:
    // Level 0: Elements in standard states: Na(s) + 1/2 Cl2(g) (y = 280)
    // Level -1: Product solid: NaCl(s) (y = 420) -> delta_f H
    // Level 1: Na(g) + 1/2 Cl2(g) (y = 240) -> +sub
    // Level 2: Na(g) + Cl(g) (y = 200) -> +diss
    // Level 3: Na+(g) + e- + Cl(g) (y = 100) -> +ie
    // Level 4: Na+(g) + Cl-(g) (y = 150) -> ea
    // From Level 4 down to Level -1 -> U_L (Lattice Enthalpy)

    var y0 = 280; // Standard state
    var yProd = 430; // Solid crystal
    var y1 = 235; // After sublimation
    var y2 = 195; // After dissociation
    var y3 = 85;  // After ionization (peak)
    var y4 = y3 + (salt.ea < 0 ? 55 : -25); // After electron gain

    // Baseline axis
    out += '<line x1="80" y1="460" x2="80" y2="60" stroke="#334155" stroke-width="2"/>';
    out += '<text x="75" y="70" fill="#94a3b8" font-size="12" text-anchor="end">Enthalpy (H)</text>';

    // Level 0: Elements
    out += '<line x1="120" y1="' + y0 + '" x2="360" y2="' + y0 + '" stroke="#94a3b8" stroke-width="4"/>';
    out += '<text x="240" y="' + (y0 - 8) + '" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">' + salt.metal + '(s) + ' + (salt.nonmetal === "Cl" ? "½Cl₂(g)" : salt.nonmetal + "(g)") + '</text>';

    // Direct formation arrow down to solid
    out += '<line x1="180" y1="' + y0 + '" x2="180" y2="' + yProd + '" stroke="#10b981" stroke-width="4" stroke-dasharray="' + (currentStep >= 5 ? 'none' : '4 4') + '"/>';
    out += '<polygon points="175,' + (yProd - 6) + ' 185,' + (yProd - 6) + ' 180,' + yProd + '" fill="#10b981"/>';
    out += '<text x="170" y="' + ((y0 + yProd)/2) + '" fill="#10b981" font-size="13" font-weight="bold" text-anchor="end">Δ_f H° = ' + salt.delta_f + ' kJ</text>';

    // Product level
    out += '<line x1="120" y1="' + yProd + '" x2="800" y2="' + yProd + '" stroke="#10b981" stroke-width="4"/>';
    out += '<text x="460" y="' + (yProd + 25) + '" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">' + salt.solid + ' (Crystal Lattice)</text>';

    // Step 1: Sublimation
    if(currentStep >= 1){
      out += '<line x1="320" y1="' + y0 + '" x2="320" y2="' + y1 + '" stroke="#ef4444" stroke-width="3"/>';
      out += '<polygon points="316,' + (y1 + 6) + ' 324,' + (y1 + 6) + ' 320,' + y1 + '" fill="#ef4444"/>';
      out += '<line x1="300" y1="' + y1 + '" x2="480" y2="' + y1 + '" stroke="#ef4444" stroke-width="3"/>';
      out += '<text x="330" y="' + ((y0+y1)/2 + 4) + '" fill="#ef4444" font-size="11">Δ_sub H = +' + salt.sub + '</text>';
      out += '<text x="390" y="' + (y1 - 6) + '" fill="#f8fafc" font-size="12">' + salt.metal + '(g) + nonmetal</text>';
    }

    // Step 2: Dissociation
    if(currentStep >= 2){
      out += '<line x1="450" y1="' + y1 + '" x2="450" y2="' + y2 + '" stroke="#f59e0b" stroke-width="3"/>';
      out += '<polygon points="446,' + (y2 + 6) + ' 454,' + (y2 + 6) + ' 450,' + y2 + '" fill="#f59e0b"/>';
      out += '<line x1="430" y1="' + y2 + '" x2="600" y2="' + y2 + '" stroke="#f59e0b" stroke-width="3"/>';
      out += '<text x="460" y="' + ((y1+y2)/2 + 4) + '" fill="#f59e0b" font-size="11">½Δ_diss H = +' + salt.diss + '</text>';
    }

    // Step 3: Ionization
    if(currentStep >= 3){
      out += '<line x1="560" y1="' + y2 + '" x2="560" y2="' + y3 + '" stroke="#ec4899" stroke-width="3"/>';
      out += '<polygon points="556,' + (y3 + 6) + ' 564,' + (y3 + 6) + ' 560,' + y3 + '" fill="#ec4899"/>';
      out += '<line x1="530" y1="' + y3 + '" x2="720" y2="' + y3 + '" stroke="#ec4899" stroke-width="3"/>';
      out += '<text x="570" y="' + ((y2+y3)/2 + 4) + '" fill="#ec4899" font-size="11">Δ_i H = +' + salt.ie + '</text>';
    }

    // Step 4: Electron affinity
    if(currentStep >= 4){
      out += '<line x1="680" y1="' + y3 + '" x2="680" y2="' + y4 + '" stroke="#8b5cf6" stroke-width="3"/>';
      out += '<polygon points="676,' + (y4 - 6) + ' 684,' + (y4 - 6) + ' 680,' + y4 + '" fill="#8b5cf6"/>';
      out += '<line x1="640" y1="' + y4 + '" x2="800" y2="' + y4 + '" stroke="#8b5cf6" stroke-width="3"/>';
      out += '<text x="690" y="' + ((y3+y4)/2 + 4) + '" fill="#8b5cf6" font-size="11">Δ_eg H = ' + salt.ea + '</text>';
      out += '<text x="720" y="' + (y4 - 8) + '" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">' + salt.gas_ions + '</text>';
    }

    // Step 5: Lattice Enthalpy
    if(currentStep >= 5){
      out += '<line x1="770" y1="' + y4 + '" x2="770" y2="' + yProd + '" stroke="#38bdf8" stroke-width="4"/>';
      out += '<polygon points="765,' + (yProd - 8) + ' 775,' + (yProd - 8) + ' 770,' + yProd + '" fill="#38bdf8"/>';
      out += '<text x="780" y="' + ((y4+yProd)/2) + '" fill="#38bdf8" font-size="14" font-weight="bold">Lattice Enthalpy (U_L)<tspan x="780" dy="18" fill="#94a3b8" font-size="12">' + salt.ul + ' kJ/mol</tspan></text>';
    }

    svg.innerHTML = out;

    readout(
      cell("Substance", salt.name, "#38bdf8") +
      cell("Sublimation Δ_sub H", "+" + salt.sub + " kJ", "#ef4444") +
      cell("Dissociation ½Δ_d H", "+" + salt.diss + " kJ", "#f59e0b") +
      cell("Ionization Δ_i H", "+" + salt.ie + " kJ", "#ec4899") +
      cell("Electron Gain Δ_eg H", salt.ea + " kJ", "#8b5cf6") +
      cell("Lattice Enthalpy U_L", salt.ul + " kJ/mol", "#38bdf8")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
        '<strong>Hess&#39;s Law Verification:</strong> Δ_f H° = Δ_sub H + ½Δ_diss H + Δ_i H + Δ_eg H + U_L = ' +
        salt.sub + ' + ' + salt.diss + ' + ' + salt.ie + ' + (' + salt.ea + ') + (' + salt.ul + ') = <strong>' + salt.delta_f + ' kJ/mol</strong>. ' +
        'The massive negative lattice enthalpy proves that ionic stability arises from crystal formation, not isolated ion creation.' +
      '</div>'
    );
  }

  function setStep(s){
    currentStep = s;
    var rng = document.getElementById("stage-range");
    if(rng) rng.value = s;
    draw(0);
  }

  return { mount: mount, draw: draw, setStep: setStep };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Dipole Moment Vector Summation (dipolelab)
// -------------------------------------------------------------------------
window.SIMS.dipolelab = (function(){
  var currentPreset = "nh3-nf3"; // "nh3-nf3", "co2-h2o"
  var userAngle = 104.5; // for bent comparison

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Individual Bond Dipoles</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Lone Pair Dipole</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Net Resultant Vector (μ_net)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-nh3-nf3">NH₃ vs NF₃ (Pyramidal Dipole Anomaly)</button>' +
      '<button class="preset-btn" id="p-co2-h2o">CO₂ vs H₂O (Linear 0 D vs Bent 1.85 D)</button>';

    document.getElementById("p-nh3-nf3").onclick = function(){ setActivePreset(this); currentPreset = "nh3-nf3"; draw(0); };
    document.getElementById("p-co2-h2o").onclick = function(){ setActivePreset(this); currentPreset = "co2-h2o"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Dynamic Bond Angle Bending (80° to 180°):</label>' +
        '<input type="range" id="angle-range" min="80" max="180" value="' + userAngle + '" step="0.5">' +
      '</div>';

    var rng = document.getElementById("angle-range");
    if(rng) rng.oninput = function(){ userAngle = parseFloat(this.value); draw(0); };
    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var out = '<rect width="900" height="500" fill="#0b1120"/>';

    if(currentPreset === "nh3-nf3"){
      out += '<text x="450" y="36" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">NH₃ vs NF₃ Dipole Moment Contrast</text>';
      out += '<text x="450" y="60" fill="#94a3b8" font-size="13" text-anchor="middle">Both pyramidal, but NH₃ (μ = 1.47 D) vastly exceeds NF₃ (μ = 0.23 D) due to vector alignment</text>';

      // Left: NH3
      out += '<g transform="translate(230, 240)">';
      out += '<rect x="-180" y="-140" width="360" height="280" rx="12" fill="#1e293b" stroke="#334155"/>';
      out += '<text x="0" y="-110" fill="#38bdf8" font-size="18" font-weight="bold" text-anchor="middle">Ammonia (NH₃)</text>';
      out += '<text x="0" y="-88" fill="#10b981" font-size="16" font-weight="900" text-anchor="middle">μ = 1.47 D (Large)</text>';

      // N atom
      out += '<circle cx="0" cy="0" r="24" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/>';
      out += '<text x="0" y="7" fill="#fff" font-size="18" font-weight="bold" text-anchor="middle">N</text>';

      // H atoms
      out += '<circle cx="-80" cy="70" r="14" fill="#475569"/><text x="-80" y="75" fill="#fff" font-size="12" text-anchor="middle">H</text>';
      out += '<circle cx="0" cy="85" r="14" fill="#475569"/><text x="0" y="90" fill="#fff" font-size="12" text-anchor="middle">H</text>';
      out += '<circle cx="80" cy="70" r="14" fill="#475569"/><text x="80" y="75" fill="#fff" font-size="12" text-anchor="middle">H</text>';

      // Bonds
      out += '<line x1="0" y1="0" x2="-80" y2="70" stroke="#64748b" stroke-width="3"/>';
      out += '<line x1="0" y1="0" x2="0" y2="85" stroke="#64748b" stroke-width="3"/>';
      out += '<line x1="0" y1="0" x2="80" y2="70" stroke="#64748b" stroke-width="3"/>';

      // N-H bond dipole arrows pointing UPWARD toward N (more electronegative)
      out += '<line x1="-55" y1="48" x2="-20" y2="18" stroke="#38bdf8" stroke-width="3"/>';
      out += '<polygon points="-20,18 -28,26 -21,28" fill="#38bdf8"/>';
      out += '<line x1="55" y1="48" x2="20" y2="18" stroke="#38bdf8" stroke-width="3"/>';
      out += '<polygon points="20,18 21,28 28,26" fill="#38bdf8"/>';

      // Lone pair dipole pointing UPWARD
      out += '<ellipse cx="0" cy="-45" rx="14" ry="22" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="2"/>';
      out += '<circle cx="-3" cy="-45" r="2.5" fill="#f59e0b"/><circle cx="3" cy="-45" r="2.5" fill="#f59e0b"/>';
      out += '<line x1="0" y1="-25" x2="0" y2="-75" stroke="#f59e0b" stroke-width="3"/>';
      out += '<polygon points="0,-75 -5,-65 5,-65" fill="#f59e0b"/>';

      // Net resultant vector pointing strongly UPWARD
      out += '<line x1="120" y1="50" x2="120" y2="-60" stroke="#10b981" stroke-width="5"/>';
      out += '<polygon points="120,-68 113,-56 127,-56" fill="#10b981"/>';
      out += '<text x="120" y="-76" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">μ_net</text>';
      out += '<text x="0" y="125" fill="#94a3b8" font-size="11" text-anchor="middle">Bond dipoles & lone pair REINFORCE</text>';
      out += '</g>';

      // Right: NF3
      out += '<g transform="translate(670, 240)">';
      out += '<rect x="-180" y="-140" width="360" height="280" rx="12" fill="#1e293b" stroke="#334155"/>';
      out += '<text x="0" y="-110" fill="#f59e0b" font-size="18" font-weight="bold" text-anchor="middle">Nitrogen Trifluoride (NF₃)</text>';
      out += '<text x="0" y="-88" fill="#f59e0b" font-size="16" font-weight="900" text-anchor="middle">μ = 0.23 D (Very Small)</text>';

      // N atom
      out += '<circle cx="0" cy="0" r="24" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/>';
      out += '<text x="0" y="7" fill="#fff" font-size="18" font-weight="bold" text-anchor="middle">N</text>';

      // F atoms
      out += '<circle cx="-80" cy="70" r="16" fill="#ef4444"/><text x="-80" y="75" fill="#fff" font-size="12" text-anchor="middle">F</text>';
      out += '<circle cx="0" cy="85" r="16" fill="#ef4444"/><text x="0" y="90" fill="#fff" font-size="12" text-anchor="middle">F</text>';
      out += '<circle cx="80" cy="70" r="16" fill="#ef4444"/><text x="80" y="75" fill="#fff" font-size="12" text-anchor="middle">F</text>';

      // Bonds
      out += '<line x1="0" y1="0" x2="-80" y2="70" stroke="#64748b" stroke-width="3"/>';
      out += '<line x1="0" y1="0" x2="0" y2="85" stroke="#64748b" stroke-width="3"/>';
      out += '<line x1="0" y1="0" x2="80" y2="70" stroke="#64748b" stroke-width="3"/>';

      // N-F bond dipoles pointing DOWNWARD toward F (more electronegative)
      out += '<line x1="-20" y1="18" x2="-55" y2="48" stroke="#ef4444" stroke-width="3"/>';
      out += '<polygon points="-55,48 -46,42 -49,35" fill="#ef4444"/>';
      out += '<line x1="20" y1="18" x2="55" y2="48" stroke="#ef4444" stroke-width="3"/>';
      out += '<polygon points="55,48 49,35 46,42" fill="#ef4444"/>';

      // Lone pair dipole pointing UPWARD
      out += '<ellipse cx="0" cy="-45" rx="14" ry="22" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="2"/>';
      out += '<circle cx="-3" cy="-45" r="2.5" fill="#f59e0b"/><circle cx="3" cy="-45" r="2.5" fill="#f59e0b"/>';
      out += '<line x1="0" y1="-25" x2="0" y2="-75" stroke="#f59e0b" stroke-width="3"/>';
      out += '<polygon points="0,-75 -5,-65 5,-65" fill="#f59e0b"/>';

      // Net resultant vector is very short
      out += '<line x1="120" y1="10" x2="120" y2="-15" stroke="#f59e0b" stroke-width="3"/>';
      out += '<polygon points="120,-20 115,-10 125,-10" fill="#f59e0b"/>';
      out += '<text x="120" y="-28" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">μ_net</text>';
      out += '<text x="0" y="125" fill="#94a3b8" font-size="11" text-anchor="middle">Bond dipoles OPPOSE lone pair</text>';
      out += '</g>';

      readout(
        cell("Molecule 1", "Ammonia (NH₃)", "#38bdf8") +
        cell("NH₃ Net Dipole", "1.47 Debye", "#10b981") +
        cell("Molecule 2", "Nitrogen Trifluoride (NF₃)", "#f59e0b") +
        cell("NF₃ Net Dipole", "0.23 Debye", "#ef4444") +
        cell("Vector Interaction", "NH₃ reinforces / NF₃ opposes", "#f8fafc")
      );

      verdict(
        '<div class="callout" style="background:#0f172a;border-left:4px solid #38bdf8;padding:12px;border-radius:6px;">' +
          '<strong>Electronegativity Vector Analysis:</strong> In NH₃, N (3.0) is more electronegative than H (2.1), so bond dipoles and lone-pair dipole point in the same direction, adding constructively. In NF₃, F (4.0) is more electronegative than N (3.0), so bond dipoles oppose the lone pair dipole, leaving only a tiny residual dipole moment.' +
        '</div>'
      );
    } else {
      // CO2 vs H2O dynamic bending
      var rad = (userAngle * Math.PI) / 180;
      var bondLen = 120;
      var hx1 = -bondLen * Math.sin(rad / 2);
      var hy1 = bondLen * Math.cos(rad / 2);
      var hx2 = bondLen * Math.sin(rad / 2);
      var hy2 = bondLen * Math.cos(rad / 2);

      // μ_net = 2 * μ_bond * cos(θ/2)
      var muBond = 1.5;
      var muNet = (2 * muBond * Math.cos(rad / 2)).toFixed(2);

      out += '<text x="450" y="36" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Molecular Dipole vs Bond Angle θ</text>';
      out += '<text x="450" y="60" fill="#94a3b8" font-size="13" text-anchor="middle">Observe how linear geometry (180°) causes complete vector cancellation (CO₂ = 0 D) while bent geometry yields polarity</text>';

      out += '<g transform="translate(450, 240)">';
      out += '<circle cx="0" cy="0" r="28" fill="#ef4444" stroke="#f87171" stroke-width="3"/>';
      out += '<text x="0" y="8" fill="#fff" font-size="18" font-weight="bold" text-anchor="middle">Central</text>';

      out += '<circle cx="' + hx1 + '" cy="' + hy1 + '" r="18" fill="#38bdf8"/><text x="' + hx1 + '" y="' + (hy1 + 5) + '" fill="#fff" font-size="12" text-anchor="middle">X</text>';
      out += '<circle cx="' + hx2 + '" cy="' + hy2 + '" r="18" fill="#38bdf8"/><text x="' + hx2 + '" y="' + (hy2 + 5) + '" fill="#fff" font-size="12" text-anchor="middle">X</text>';

      out += '<line x1="0" y1="0" x2="' + hx1 + '" y2="' + hy1 + '" stroke="#64748b" stroke-width="4"/>';
      out += '<line x1="0" y1="0" x2="' + hx2 + '" y2="' + hy2 + '" stroke="#64748b" stroke-width="4"/>';

      // Angle arc
      out += '<path d="M ' + (hx1*0.3) + ' ' + (hy1*0.3) + ' A 36 36 0 0 0 ' + (hx2*0.3) + ' ' + (hy2*0.3) + '" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      out += '<text x="0" y="' + (hy1*0.35 + 18) + '" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="middle">θ = ' + userAngle.toFixed(1) + '°</text>';

      // Resultant arrow
      if(userAngle < 179){
        var resLen = 60 * Math.cos(rad / 2);
        out += '<line x1="0" y1="0" x2="0" y2="' + (-resLen * 2) + '" stroke="#10b981" stroke-width="5"/>';
        out += '<polygon points="0,' + (-resLen * 2 - 8) + ' -7,' + (-resLen * 2 + 4) + ' 7,' + (-resLen * 2 + 4) + '" fill="#10b981"/>';
        out += '<text x="0" y="' + (-resLen * 2 - 16) + '" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">μ_net = ' + muNet + ' D</text>';
      } else {
        out += '<text x="0" y="-40" fill="#10b981" font-size="16" font-weight="bold" text-anchor="middle">Linear: Vectors Cancel Strictly to μ = 0 D (CO₂ / BeF₂)</text>';
      }
      out += '</g>';

      readout(
        cell("Bond Angle (θ)", userAngle.toFixed(1) + "°", "#f59e0b") +
        cell("Vector Formula", "2 · μ_bond · cos(θ/2)", "#94a3b8") +
        cell("Net Dipole μ_net", muNet + " Debye", userAngle > 178 ? "#ef4444" : "#10b981") +
        cell("Real Analogue", userAngle > 175 ? "CO₂, BeCl₂ (Non-polar)" : "H₂O (104.5°, 1.85 D)", "#38bdf8")
      );

      verdict(
        '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
          '<strong>Linear vs Bent Geometry Proof:</strong> At 180°, the angle between the two bond dipole vectors is 180° so cos(90°) = 0, causing complete vector cancellation. This proves why CO₂ has zero dipole moment while bent H₂O (104.5°) has μ = 1.85 D.' +
        '</div>'
      );
    }

    svg.innerHTML = out;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: VSEPR Molecular Geometry & Lone Pair Distortion Lab (vseprlab)
// -------------------------------------------------------------------------
window.SIMS.vseprlab = (function(){
  var currentShape = "ab4"; // "ab2", "ab3", "ab2e", "ab4", "ab3e", "ab2e2", "ab5", "ab6"

  var shapes = {
    "ab2": { name: "Linear (AB₂)", ex: "BeCl₂, CO₂", bp: 2, lp: 0, angle: "180°", geom: "Linear" },
    "ab3": { name: "Trigonal Planar (AB₃)", ex: "BF₃, BCl₃", bp: 3, lp: 0, angle: "120°", geom: "Trigonal Planar" },
    "ab2e": { name: "Bent / Angular (AB₂E)", ex: "SO₂, O₃", bp: 2, lp: 1, angle: "119.5°", geom: "Bent" },
    "ab4": { name: "Tetrahedral (AB₄)", ex: "CH₄, SiCl₄", bp: 4, lp: 0, angle: "109.5°", geom: "Tetrahedral" },
    "ab3e": { name: "Trigonal Pyramidal (AB₃E)", ex: "NH₃, PCl₃", bp: 3, lp: 1, angle: "107.8°", geom: "Trigonal Pyramidal" },
    "ab2e2": { name: "Bent / V-Shaped (AB₂E₂)", ex: "H₂O, H₂S", bp: 2, lp: 2, angle: "104.5°", geom: "Bent" },
    "ab5": { name: "Trigonal Bipyramidal (AB₅)", ex: "PCl₅", bp: 5, lp: 0, angle: "90° (ax) / 120° (eq)", geom: "Trigonal Bipyramidal" },
    "ab6": { name: "Octahedral (AB₆)", ex: "SF₆", bp: 6, lp: 0, angle: "90°", geom: "Octahedral" }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Bond Pairs (bp)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Lone Pairs (lp)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Repulsive Distortion Force</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-ab2">AB₂ Linear</button>' +
      '<button class="preset-btn" id="p-ab3">AB₃ Trigonal</button>' +
      '<button class="preset-btn" id="p-ab2e">AB₂E Bent</button>' +
      '<button class="preset-btn active" id="p-ab4">AB₄ CH₄</button>' +
      '<button class="preset-btn" id="p-ab3e">AB₃E NH₃</button>' +
      '<button class="preset-btn" id="p-ab2e2">AB₂E₂ H₂O</button>' +
      '<button class="preset-btn" id="p-ab5">AB₅ PCl₅</button>' +
      '<button class="preset-btn" id="p-ab6">AB₆ SF₆</button>';

    var keys = ["ab2", "ab3", "ab2e", "ab4", "ab3e", "ab2e2", "ab5", "ab6"];
    keys.forEach(function(k){
      var btn = document.getElementById("p-" + k);
      if(btn){
        btn.onclick = function(){
          setActivePreset(this);
          currentShape = k;
          draw(0);
        };
      }
    });

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>VSEPR Repulsion Order Hierarchy:</label>' +
        '<div style="padding:10px;background:#1e293b;border-radius:8px;font-family:monospace;color:#38bdf8;font-size:15px;font-weight:bold;text-align:center;">' +
          'Lone Pair – Lone Pair (lp–lp) &gt; Lone Pair – Bond Pair (lp–bp) &gt; Bond Pair – Bond Pair (bp–bp)' +
        '</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var sh = shapes[currentShape];

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">' + sh.name + ' — Example: ' + sh.ex + '</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Steric Number = ' + (sh.bp + sh.lp) + ' (' + sh.bp + ' Bond Pairs + ' + sh.lp + ' Lone Pairs) | Measured Angle: ' + sh.angle + '</text>';

    out += '<g transform="translate(450, 240)">';

    // Central Atom
    out += '<circle cx="0" cy="0" r="32" fill="#0284c7" stroke="#38bdf8" stroke-width="4"/>';
    out += '<text x="0" y="9" fill="#fff" font-size="20" font-weight="bold" text-anchor="middle">A</text>';

    // Specific layouts for shapes
    if(currentShape === "ab2"){
      out += '<line x1="-160" y1="0" x2="160" y2="0" stroke="#64748b" stroke-width="5"/>';
      out += '<circle cx="-160" cy="0" r="22" fill="#10b981"/><text x="-160" y="6" fill="#fff" font-size="15" text-anchor="middle">B</text>';
      out += '<circle cx="160" cy="0" r="22" fill="#10b981"/><text x="160" y="6" fill="#fff" font-size="15" text-anchor="middle">B</text>';
      out += '<path d="M -50 0 A 50 50 0 0 1 50 0" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      out += '<text x="0" y="-60" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">180°</text>';
    } else if(currentShape === "ab3"){
      var angs = [-Math.PI/2, Math.PI/6, 5*Math.PI/6];
      angs.forEach(function(a){
        var bx = 140 * Math.cos(a);
        var by = 140 * Math.sin(a);
        out += '<line x1="0" y1="0" x2="' + bx + '" y2="' + by + '" stroke="#64748b" stroke-width="5"/>';
        out += '<circle cx="' + bx + '" cy="' + by + '" r="22" fill="#10b981"/><text x="' + bx + '" y="' + (by+6) + '" fill="#fff" font-size="15" text-anchor="middle">B</text>';
      });
      out += '<text x="0" y="40" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">120°</text>';
    } else if(currentShape === "ab2e"){
      // SO2
      out += '<line x1="0" y1="0" x2="-120" y2="90" stroke="#64748b" stroke-width="5"/>';
      out += '<circle cx="-120" cy="90" r="22" fill="#10b981"/><text x="-120" y="96" fill="#fff" font-size="15" text-anchor="middle">B</text>';
      out += '<line x1="0" y1="0" x2="120" y2="90" stroke="#64748b" stroke-width="5"/>';
      out += '<circle cx="120" cy="90" r="22" fill="#10b981"/><text x="120" y="96" fill="#fff" font-size="15" text-anchor="middle">B</text>';
      // Lone pair on top
      out += '<ellipse cx="0" cy="-60" rx="20" ry="34" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="3"/>';
      out += '<circle cx="-4" cy="-60" r="3" fill="#f59e0b"/><circle cx="4" cy="-60" r="3" fill="#f59e0b"/>';
      out += '<text x="0" y="55" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">119.5° (&lt; 120°)</text>';
    } else if(currentShape === "ab4"){
      // CH4
      var pts = [{x:0, y:-140}, {x:-130, y:70}, {x:0, y:120}, {x:130, y:70}];
      pts.forEach(function(p){
        out += '<line x1="0" y1="0" x2="' + p.x + '" y2="' + p.y + '" stroke="#64748b" stroke-width="5"/>';
        out += '<circle cx="' + p.x + '" cy="' + p.y + '" r="22" fill="#10b981"/><text x="' + p.x + '" y="' + (p.y+6) + '" fill="#fff" font-size="15" text-anchor="middle">B</text>';
      });
      out += '<text x="50" y="-30" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">109.5°</text>';
    } else if(currentShape === "ab3e"){
      // NH3
      var pts3 = [{x:-120, y:80}, {x:0, y:110}, {x:120, y:80}];
      pts3.forEach(function(p){
        out += '<line x1="0" y1="0" x2="' + p.x + '" y2="' + p.y + '" stroke="#64748b" stroke-width="5"/>';
        out += '<circle cx="' + p.x + '" cy="' + p.y + '" r="22" fill="#10b981"/><text x="' + p.x + '" y="' + (p.y+6) + '" fill="#fff" font-size="15" text-anchor="middle">B</text>';
      });
      out += '<ellipse cx="0" cy="-65" rx="22" ry="36" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="3"/>';
      out += '<circle cx="-4" cy="-65" r="3" fill="#f59e0b"/><circle cx="4" cy="-65" r="3" fill="#f59e0b"/>';
      out += '<text x="0" y="45" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">107.8°</text>';
    } else if(currentShape === "ab2e2"){
      // H2O
      out += '<line x1="0" y1="0" x2="-100" y2="100" stroke="#64748b" stroke-width="5"/>';
      out += '<circle cx="-100" cy="100" r="22" fill="#10b981"/><text x="-100" y="106" fill="#fff" font-size="15" text-anchor="middle">B</text>';
      out += '<line x1="0" y1="0" x2="100" y2="100" stroke="#64748b" stroke-width="5"/>';
      out += '<circle cx="100" cy="100" r="22" fill="#10b981"/><text x="100" y="106" fill="#fff" font-size="15" text-anchor="middle">B</text>';
      // Two lone pairs
      out += '<ellipse cx="-45" cy="-55" rx="20" ry="32" transform="rotate(-25 -45 -55)" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="3"/>';
      out += '<ellipse cx="45" cy="-55" rx="20" ry="32" transform="rotate(25 45 -55)" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="3"/>';
      out += '<text x="0" y="55" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">104.5°</text>';
      out += '<text x="0" y="-105" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">Intense lp-lp repulsion</text>';
    } else if(currentShape === "ab5"){
      // PCl5
      // 3 equatorial
      var eq = [{x:0, y:20}, {x:-110, y:40}, {x:110, y:40}];
      eq.forEach(function(p){
        out += '<line x1="0" y1="0" x2="' + p.x + '" y2="' + p.y + '" stroke="#64748b" stroke-width="5"/>';
        out += '<circle cx="' + p.x + '" cy="' + p.y + '" r="20" fill="#10b981"/><text x="' + p.x + '" y="' + (p.y+5) + '" fill="#fff" font-size="13" text-anchor="middle">Cl(eq)</text>';
      });
      // 2 axial (longer!)
      out += '<line x1="0" y1="0" x2="0" y2="-150" stroke="#ef4444" stroke-width="5"/>';
      out += '<circle cx="0" cy="-150" r="22" fill="#ef4444"/><text x="0" y="-144" fill="#fff" font-size="13" text-anchor="middle">Cl(ax)</text>';
      out += '<line x1="0" y1="0" x2="0" y2="150" stroke="#ef4444" stroke-width="5"/>';
      out += '<circle cx="0" cy="150" r="22" fill="#ef4444"/><text x="0" y="156" fill="#fff" font-size="13" text-anchor="middle">Cl(ax)</text>';
      out += '<text x="70" y="-80" fill="#ef4444" font-size="13" font-weight="bold">Axial: 219 pm</text>';
      out += '<text x="130" y="25" fill="#10b981" font-size="13" font-weight="bold">Equatorial: 204 pm</text>';
    } else if(currentShape === "ab6"){
      // SF6
      var oct = [{x:0, y:-140}, {x:0, y:140}, {x:-130, y:0}, {x:130, y:0}, {x:-75, y:75}, {x:75, y:-75}];
      oct.forEach(function(p){
        out += '<line x1="0" y1="0" x2="' + p.x + '" y2="' + p.y + '" stroke="#64748b" stroke-width="5"/>';
        out += '<circle cx="' + p.x + '" cy="' + p.y + '" r="20" fill="#10b981"/><text x="' + p.x + '" y="' + (p.y+5) + '" fill="#fff" font-size="13" text-anchor="middle">F</text>';
      });
      out += '<text x="0" y="50" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">All angles = 90°</text>';
    }

    out += '</g>';
    svg.innerHTML = out;

    readout(
      cell("Configuration", sh.name, "#38bdf8") +
      cell("Steric Number", (sh.bp + sh.lp).toString(), "#f8fafc") +
      cell("Bond Pairs (bp)", sh.bp.toString(), "#10b981") +
      cell("Lone Pairs (lp)", sh.lp.toString(), "#f59e0b") +
      cell("Bond Angle", sh.angle, "#ef4444")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #38bdf8;padding:12px;border-radius:6px;">' +
        '<strong>VSEPR Rule in Action:</strong> Lone pair electrons are localized on a single nucleus and spread out in space, exerting greater repulsion than bonded electron pairs. ' +
        'In methane (0 lp), angle is 109.5°; in ammonia (1 lp), angle is compressed to 107.8°; in water (2 lp), lp-lp repulsion squashes the angle to 104.5°.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Valence Bond Orbital Overlap & Hybridization Simulator (hybridsim)
// -------------------------------------------------------------------------
window.SIMS.hybridsim = (function(){
  var currentType = "sp"; // "sp", "sp2", "sp3", "sigma-pi"

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Positive Wave Phase (+)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Negative Wave Phase (−)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Hybrid Lobe (Concentrated Density)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-sp">sp Hybridization (BeCl₂, C₂H₂)</button>' +
      '<button class="preset-btn" id="p-sp2">sp² Hybridization (BF₃, C₂H₄)</button>' +
      '<button class="preset-btn" id="p-sp3">sp³ Hybridization (CH₄, C₂H₆)</button>' +
      '<button class="preset-btn" id="p-sigpi">σ vs π Overlap Comparison</button>';

    document.getElementById("p-sp").onclick = function(){ setActivePreset(this); currentType = "sp"; draw(0); };
    document.getElementById("p-sp2").onclick = function(){ setActivePreset(this); currentType = "sp2"; draw(0); };
    document.getElementById("p-sp3").onclick = function(){ setActivePreset(this); currentType = "sp3"; draw(0); };
    document.getElementById("p-sigpi").onclick = function(){ setActivePreset(this); currentType = "sigma-pi"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Pauling Principle of Maximum Overlap:</label>' +
        '<div style="padding:10px;background:#1e293b;border-radius:8px;color:#f8fafc;font-size:14px;">' +
          'Hybridization concentrates electron density directionally toward the bonding partner, yielding vastly greater orbital overlap and stronger bonds than unhybridized s and p orbitals.' +
        '</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var out = '<rect width="900" height="500" fill="#0b1120"/>';

    if(currentType === "sp"){
      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">sp Hybridization: Linear (180°)</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Mixing 1s + 1p gives two collinear sp hybrid orbitals with 50% s-character</text>';

      out += '<g transform="translate(450, 240)">';
      // Center nucleus
      out += '<circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#64748b" stroke-width="2"/>';

      // Left sp hybrid orbital (large positive lobe left, small negative tail right)
      out += '<path d="M 0 0 C -70 -50, -160 -40, -180 0 C -160 40, -70 50, 0 0 Z" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" stroke-width="3"/>';
      out += '<text x="-100" y="7" fill="#38bdf8" font-size="18" font-weight="bold" text-anchor="middle">+</text>';

      // Right sp hybrid orbital (large positive lobe right, small negative tail left)
      out += '<path d="M 0 0 C 70 -50, 160 -40, 180 0 C 160 40, 70 50, 0 0 Z" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" stroke-width="3"/>';
      out += '<text x="100" y="7" fill="#10b981" font-size="18" font-weight="bold" text-anchor="middle">+</text>';

      out += '<path d="M -70 0 A 70 70 0 0 1 70 0" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      out += '<text x="0" y="-80" fill="#f59e0b" font-size="16" font-weight="bold" text-anchor="middle">Bond Angle = 180°</text>';
      out += '</g>';

      readout(
        cell("Hybrid Type", "sp (Diagonal)", "#38bdf8") +
        cell("Orbitals Mixed", "1s + 1p_x", "#f8fafc") +
        cell("Geometry", "Collinear / Linear", "#10b981") +
        cell("s-Character", "50.0%", "#f59e0b") +
        cell("Typical Angle", "180°", "#ef4444")
      );
    } else if(currentType === "sp2"){
      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">sp² Hybridization: Trigonal Planar (120°)</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Mixing 1s + 2p gives three equivalent sp² orbitals in a plane with 33.3% s-character</text>';

      out += '<g transform="translate(450, 250)">';
      var angs = [-Math.PI/2, Math.PI/6, 5*Math.PI/6];
      angs.forEach(function(a, idx){
        var deg = (a * 180 / Math.PI);
        out += '<g transform="rotate(' + deg + ')">';
        out += '<path d="M 0 0 C 40 -35, 120 -30, 150 0 C 120 30, 40 35, 0 0 Z" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" stroke-width="3"/>';
        out += '<text x="80" y="6" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">+</text>';
        out += '</g>';
      });
      out += '<circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#64748b" stroke-width="2"/>';
      out += '<text x="0" y="55" fill="#f59e0b" font-size="16" font-weight="bold" text-anchor="middle">120° Planar</text>';
      out += '</g>';

      readout(
        cell("Hybrid Type", "sp² (Trigonal)", "#38bdf8") +
        cell("Orbitals Mixed", "1s + 2p (px, py)", "#f8fafc") +
        cell("Geometry", "Trigonal Planar", "#10b981") +
        cell("s-Character", "33.3%", "#f59e0b") +
        cell("Typical Angle", "120°", "#ef4444")
      );
    } else if(currentType === "sp3"){
      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">sp³ Hybridization: Tetrahedral (109.5°)</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Mixing 1s + 3p gives four equivalent sp³ orbitals oriented towards tetrahedral vertices</text>';

      out += '<g transform="translate(450, 250)">';
      var angles4 = [-90, 45, 135, 180];
      angles4.forEach(function(deg){
        out += '<g transform="rotate(' + deg + ')">';
        out += '<path d="M 0 0 C 40 -30, 110 -25, 140 0 C 110 25, 40 30, 0 0 Z" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" stroke-width="3"/>';
        out += '<text x="70" y="6" fill="#10b981" font-size="16" font-weight="bold" text-anchor="middle">+</text>';
        out += '</g>';
      });
      out += '<circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#64748b" stroke-width="2"/>';
      out += '<text x="0" y="65" fill="#f59e0b" font-size="16" font-weight="bold" text-anchor="middle">109° 28&#39;</text>';
      out += '</g>';

      readout(
        cell("Hybrid Type", "sp³ (Tetrahedral)", "#10b981") +
        cell("Orbitals Mixed", "1s + 3p (px, py, pz)", "#f8fafc") +
        cell("Geometry", "Tetrahedral", "#38bdf8") +
        cell("s-Character", "25.0%", "#f59e0b") +
        cell("Typical Angle", "109.5°", "#ef4444")
      );
    } else {
      // sigma vs pi
      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Axial Overlap (σ-Bond) vs Lateral Overlap (π-Bond)</text>';

      // Left: Sigma
      out += '<g transform="translate(240, 250)">';
      out += '<rect x="-180" y="-150" width="360" height="300" rx="12" fill="#1e293b" stroke="#334155"/>';
      out += '<text x="0" y="-115" fill="#10b981" font-size="17" font-weight="bold" text-anchor="middle">Sigma (σ) Bond</text>';
      out += '<text x="0" y="-90" fill="#94a3b8" font-size="12" text-anchor="middle">Head-on / Axial Overlap</text>';

      out += '<line x1="-120" y1="0" x2="120" y2="0" stroke="#475569" stroke-width="2" stroke-dasharray="4 4"/>';
      out += '<ellipse cx="-50" cy="0" rx="60" ry="32" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" stroke-width="2"/>';
      out += '<ellipse cx="50" cy="0" rx="60" ry="32" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" stroke-width="2"/>';
      // Overlap zone
      out += '<ellipse cx="0" cy="0" rx="20" ry="25" fill="#f59e0b" opacity="0.7"/>';
      out += '<text x="0" y="6" fill="#0f172a" font-size="11" font-weight="bold" text-anchor="middle">Overlap</text>';

      out += '<text x="0" y="80" fill="#f8fafc" font-size="12" text-anchor="middle">Cylindrically symmetrical along axis</text>';
      out += '<text x="0" y="105" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">Strong Bond • Free Rotation</text>';
      out += '</g>';

      // Right: Pi
      out += '<g transform="translate(660, 250)">';
      out += '<rect x="-180" y="-150" width="360" height="300" rx="12" fill="#1e293b" stroke="#334155"/>';
      out += '<text x="0" y="-115" fill="#ef4444" font-size="17" font-weight="bold" text-anchor="middle">Pi (π) Bond</text>';
      out += '<text x="0" y="-90" fill="#94a3b8" font-size="12" text-anchor="middle">Sideways / Lateral Overlap</text>';

      out += '<line x1="-120" y1="0" x2="120" y2="0" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3"/>';
      out += '<text x="0" y="-5" fill="#ef4444" font-size="10" text-anchor="middle">Nodal Plane (Electron Density = 0)</text>';

      // Upper lobes
      out += '<ellipse cx="-45" cy="-50" rx="26" ry="40" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" stroke-width="2"/>';
      out += '<ellipse cx="45" cy="-50" rx="26" ry="40" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" stroke-width="2"/>';
      // Lower lobes
      out += '<ellipse cx="-45" cy="50" rx="26" ry="40" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" stroke-width="2"/>';
      out += '<ellipse cx="45" cy="50" rx="26" ry="40" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" stroke-width="2"/>';

      out += '<text x="0" y="80" fill="#f8fafc" font-size="12" text-anchor="middle">Electron cloud above & below plane</text>';
      out += '<text x="0" y="105" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">Weaker Bond • Restricted Rotation</text>';
      out += '</g>';

      readout(
        cell("Overlap Comparison", "σ vs π Bonds", "#38bdf8") +
        cell("σ Electron Cloud", "Cylindrically Symmetric", "#10b981") +
        cell("π Electron Cloud", "Above & Below Nodal Plane", "#ef4444") +
        cell("Bond Strength", "σ > π", "#f59e0b") +
        cell("Rotational Freedom", "σ free / π rigid", "#f8fafc")
      );
    }

    svg.innerHTML = out;

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
        '<strong>Fundamental Overlap Rule:</strong> Head-on (axial) overlap along the internuclear axis creates maximum orbital interpenetration and lower potential energy, forming a strong σ-bond. Lateral overlap of unhybridized parallel p-orbitals is restricted to outer fringe contacts, yielding weaker π-bonds with a central nodal plane.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Molecular Orbital Diagram & O₂ Paramagnetism Lab (mothelab)
// -------------------------------------------------------------------------
window.SIMS.mothelab = (function(){
  var currentSpecies = "o2"; // "h2", "be2", "n2", "o2", "o2+", "o2-", "o22-"

  var speciesData = {
    "h2": { name: "H₂ (Hydrogen)", electrons: 2, z: 1, nb: 2, na: 0, bo: 1.0, mag: "Diamagnetic" },
    "be2": { name: "Be₂ (Beryllium Dimer)", electrons: 8, z: 4, nb: 4, na: 4, bo: 0.0, mag: "Non-existent (BO = 0)" },
    "n2": { name: "N₂ (Dinitrogen)", electrons: 14, z: 7, nb: 10, na: 4, bo: 3.0, mag: "Diamagnetic" },
    "o2": { name: "O₂ (Dioxygen)", electrons: 16, z: 8, nb: 10, na: 6, bo: 2.0, mag: "Paramagnetic (2 unpaired e⁻ in π*)" },
    "o2+": { name: "O₂⁺ (Dioxygenyl cation)", electrons: 15, z: 8, nb: 10, na: 5, bo: 2.5, mag: "Paramagnetic (1 unpaired e⁻)" },
    "o2-": { name: "O₂⁻ (Superoxide ion)", electrons: 17, z: 8, nb: 10, na: 7, bo: 1.5, mag: "Paramagnetic (1 unpaired e⁻)" },
    "o22-": { name: "O₂²⁻ (Peroxide ion)", electrons: 18, z: 8, nb: 10, na: 8, bo: 1.0, mag: "Diamagnetic (All paired)" }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Bonding MO (Lower Energy)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Antibonding MO (σ*, π*)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Unpaired Electron (Paramagnetic)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-mo-h2">H₂ (BO=1)</button>' +
      '<button class="preset-btn" id="p-mo-be2">Be₂ (BO=0)</button>' +
      '<button class="preset-btn" id="p-mo-n2">N₂ (BO=3)</button>' +
      '<button class="preset-btn active" id="p-mo-o2">O₂ (BO=2, Paramagnetic)</button>' +
      '<button class="preset-btn" id="p-mo-o2p">O₂⁺ (BO=2.5)</button>' +
      '<button class="preset-btn" id="p-mo-o2m">O₂⁻ (BO=1.5)</button>' +
      '<button class="preset-btn" id="p-mo-o22m">O₂²⁻ (BO=1.0)</button>';

    var pmap = {
      "p-mo-h2": "h2", "p-mo-be2": "be2", "p-mo-n2": "n2", "p-mo-o2": "o2",
      "p-mo-o2p": "o2+", "p-mo-o2m": "o2-", "p-mo-o22m": "o22-"
    };
    Object.keys(pmap).forEach(function(pid){
      var btn = document.getElementById(pid);
      if(btn){
        btn.onclick = function(){
          setActivePreset(this);
          currentSpecies = pmap[pid];
          draw(0);
        };
      }
    });

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Bond Order Calculation Rule:</label>' +
        '<div style="padding:10px;background:#1e293b;border-radius:8px;font-family:monospace;color:#10b981;font-size:15px;font-weight:bold;text-align:center;">' +
          'Bond Order = (N_b − N_a) / 2' +
        '</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var sp = speciesData[currentSpecies];

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">' + sp.name + ' — Molecular Orbital Energy Diagram</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Total Electrons = ' + sp.electrons + ' | Bond Order = ' + sp.bo.toFixed(1) + ' | ' + sp.mag + '</text>';

    // Left and Right Atomic Orbital columns
    out += '<text x="180" y="100" fill="#94a3b8" font-size="14" font-weight="bold" text-anchor="middle">Atom A (2s/2p)</text>';
    out += '<text x="720" y="100" fill="#94a3b8" font-size="14" font-weight="bold" text-anchor="middle">Atom B (2s/2p)</text>';
    out += '<text x="450" y="100" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">Molecular Orbitals (A–B)</text>';

    // Energy levels in MO for Z >= 8:
    // Levels:
    // y = 430: σ_2s
    // y = 370: σ*_2s
    // y = 290: σ_2pz
    // y = 240: π_2px, π_2py
    // y = 180: π*_2px, π*_2py
    // y = 130: σ*_2pz

    var levels = [
      { id: "sig_2s", name: "σ_2s", y: 430, type: "bonding", cap: 2, degenerate: 1 },
      { id: "sig_star_2s", name: "σ*_2s", y: 370, type: "anti", cap: 2, degenerate: 1 },
      { id: "sig_2pz", name: "σ_2p_z", y: 290, type: "bonding", cap: 2, degenerate: 1 },
      { id: "pi_2p", name: "π_2p_x = π_2p_y", y: 240, type: "bonding", cap: 4, degenerate: 2 },
      { id: "pi_star_2p", name: "π*_2p_x = π*_2p_y", y: 180, type: "anti", cap: 4, degenerate: 2 },
      { id: "sig_star_2pz", name: "σ*_2p_z", y: 130, type: "anti", cap: 2, degenerate: 1 }
    ];

    // For Z < 8 (N2), swap sig_2pz and pi_2p:
    if(sp.z < 8 && sp.electrons >= 8){
      levels[2].y = 240; // sig_2pz higher
      levels[3].y = 290; // pi_2p lower
    }

    // Distribute valence electrons (beyond KK core 4 electrons):
    var valenceE = Math.max(0, sp.electrons - 4);
    if(sp.electrons <= 4){
      // For H2 and Be2, just show 1s / 2s
      valenceE = sp.electrons;
    }

    var remaining = valenceE;
    var occ = {};
    levels.forEach(function(lvl){
      var take = Math.min(remaining, lvl.cap);
      occ[lvl.id] = take;
      remaining -= take;
    });

    // Draw energy levels
    levels.forEach(function(lvl){
      var color = lvl.type === "bonding" ? "#10b981" : "#ef4444";
      var electronsInLevel = occ[lvl.id] || 0;

      if(lvl.degenerate === 1){
        out += '<line x1="400" y1="' + lvl.y + '" x2="500" y2="' + lvl.y + '" stroke="' + color + '" stroke-width="4"/>';
        out += '<text x="515" y="' + (lvl.y + 5) + '" fill="' + color + '" font-size="12" font-weight="bold">' + lvl.name + '</text>';

        // Render electrons
        if(electronsInLevel === 1){
          out += '<text x="445" y="' + (lvl.y - 6) + '" fill="#f59e0b" font-size="17" font-weight="900">↑</text>';
        } else if(electronsInLevel === 2){
          out += '<text x="435" y="' + (lvl.y - 6) + '" fill="#f8fafc" font-size="17" font-weight="900">↑</text>';
          out += '<text x="455" y="' + (lvl.y - 6) + '" fill="#f8fafc" font-size="17" font-weight="900">↓</text>';
        }
      } else {
        // Degenerate (2 sub-boxes)
        out += '<line x1="360" y1="' + lvl.y + '" x2="430" y2="' + lvl.y + '" stroke="' + color + '" stroke-width="4"/>';
        out += '<line x1="470" y1="' + lvl.y + '" x2="540" y2="' + lvl.y + '" stroke="' + color + '" stroke-width="4"/>';
        out += '<text x="555" y="' + (lvl.y + 5) + '" fill="' + color + '" font-size="12" font-weight="bold">' + lvl.name + '</text>';

        // Hund's rule distribution
        if(electronsInLevel === 1){
          out += '<text x="390" y="' + (lvl.y - 6) + '" fill="#f59e0b" font-size="17" font-weight="900">↑</text>';
        } else if(electronsInLevel === 2){
          // Unpaired spins in separate degenerate orbitals! (Key to O2 paramagnetism)
          out += '<text x="390" y="' + (lvl.y - 6) + '" fill="#f59e0b" font-size="17" font-weight="900">↑</text>';
          out += '<text x="500" y="' + (lvl.y - 6) + '" fill="#f59e0b" font-size="17" font-weight="900">↑</text>';
        } else if(electronsInLevel === 3){
          out += '<text x="382" y="' + (lvl.y - 6) + '" fill="#f8fafc" font-size="17" font-weight="900">↑</text>';
          out += '<text x="398" y="' + (lvl.y - 6) + '" fill="#f8fafc" font-size="17" font-weight="900">↓</text>';
          out += '<text x="500" y="' + (lvl.y - 6) + '" fill="#f59e0b" font-size="17" font-weight="900">↑</text>';
        } else if(electronsInLevel === 4){
          out += '<text x="382" y="' + (lvl.y - 6) + '" fill="#f8fafc" font-size="17" font-weight="900">↑</text>';
          out += '<text x="398" y="' + (lvl.y - 6) + '" fill="#f8fafc" font-size="17" font-weight="900">↓</text>';
          out += '<text x="492" y="' + (lvl.y - 6) + '" fill="#f8fafc" font-size="17" font-weight="900">↑</text>';
          out += '<text x="508" y="' + (lvl.y - 6) + '" fill="#f8fafc" font-size="17" font-weight="900">↓</text>';
        }
      }
    });

    // Dash connecting lines from atomic to molecular levels
    out += '<line x1="220" y1="400" x2="390" y2="430" stroke="#334155" stroke-dasharray="3 3"/>';
    out += '<line x1="680" y1="400" x2="510" y2="430" stroke="#334155" stroke-dasharray="3 3"/>';
    out += '<line x1="220" y1="400" x2="390" y2="370" stroke="#334155" stroke-dasharray="3 3"/>';
    out += '<line x1="680" y1="400" x2="510" y2="370" stroke="#334155" stroke-dasharray="3 3"/>';

    svg.innerHTML = out;

    readout(
      cell("Molecule / Ion", sp.name, "#38bdf8") +
      cell("Total Electrons", sp.electrons.toString(), "#f8fafc") +
      cell("Bonding (N_b)", sp.nb.toString(), "#10b981") +
      cell("Antibonding (N_a)", sp.na.toString(), "#ef4444") +
      cell("Bond Order", sp.bo.toFixed(1), sp.bo > 0 ? "#10b981" : "#ef4444") +
      cell("Magnetic Nature", sp.mag, sp.mag.includes("Paramagnetic") ? "#f59e0b" : "#38bdf8")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
        '<strong>Triumph of Molecular Orbital Theory:</strong> Simple Lewis structures incorrectly predict O₂ has all paired electrons (diamagnetic). MOT correctly places the last two electrons in degenerate antibonding π*2p_x and π*2p_y orbitals with parallel spins according to Hund&#39;s rule, perfectly explaining the experimentally observed paramagnetism of liquid oxygen.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Hydrogen Bonding & Ice Cage Simulator (hbondlab)
// -------------------------------------------------------------------------
window.SIMS.hbondlab = (function(){
  var currentTemp = 0; // -10 to 100 °C
  var mode = "ice-cage"; // "ice-cage", "nitro-isomer"

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Covalent O–H Bond (460 kJ/mol)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Hydrogen Bond O···H (20 kJ/mol)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Open Cage Free Volume</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ice">Ice Hexagonal Open Cage (0 °C)</button>' +
      '<button class="preset-btn" id="p-water4">Water at Max Density (4 °C)</button>' +
      '<button class="preset-btn" id="p-water80">Thermal Agitation (80 °C)</button>' +
      '<button class="preset-btn" id="p-isomers">o- vs p-Nitrophenol Isomerism</button>';

    document.getElementById("p-ice").onclick = function(){ setActivePreset(this); mode = "ice-cage"; currentTemp = 0; updateSlider(); draw(0); };
    document.getElementById("p-water4").onclick = function(){ setActivePreset(this); mode = "ice-cage"; currentTemp = 4; updateSlider(); draw(0); };
    document.getElementById("p-water80").onclick = function(){ setActivePreset(this); mode = "ice-cage"; currentTemp = 80; updateSlider(); draw(0); };
    document.getElementById("p-isomers").onclick = function(){ setActivePreset(this); mode = "nitro-isomer"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Temperature Control (−10 °C to 100 °C):</label>' +
        '<input type="range" id="temp-range" min="-10" max="100" value="' + currentTemp + '" step="1">' +
      '</div>';

    var rng = document.getElementById("temp-range");
    if(rng) rng.oninput = function(){
      currentTemp = parseInt(this.value, 10);
      draw(0);
    };

    draw(0);
  }

  function updateSlider(){
    var rng = document.getElementById("temp-range");
    if(rng) rng.value = currentTemp;
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var out = '<rect width="900" height="500" fill="#0b1120"/>';

    if(mode === "ice-cage"){
      // Calculate density trend: max at 4 deg C
      var density;
      if(currentTemp <= 0){
        density = 0.917; // solid ice
      } else if(currentTemp <= 4){
        density = 0.917 + (1.000 - 0.917) * (currentTemp / 4);
      } else {
        density = 1.000 - 0.00035 * (currentTemp - 4);
      }

      var cageOpacity = currentTemp <= 0 ? 0.9 : Math.max(0.1, 0.9 - (currentTemp / 60));

      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Hydrogen Bonding & Anomalous Expansion of Water</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Temperature: ' + currentTemp + ' °C | State: ' + (currentTemp <= 0 ? "Solid Ice (Open Cage)" : (currentTemp < 100 ? "Liquid Water" : "Steam")) + ' | Density: ' + density.toFixed(4) + ' g/cm³</text>';

      // Render Hexagonal open cage in center
      out += '<g transform="translate(450, 260)">';

      // 6 vertices of hexagon
      var hexR = 130;
      var hexPts = [];
      for(var i = 0; i < 6; i++){
        var a = (i * Math.PI / 3) - Math.PI/6;
        hexPts.push({ x: hexR * Math.cos(a), y: hexR * Math.sin(a) });
      }

      // Draw H-bond connections around hexagon
      for(var j = 0; j < 6; j++){
        var p1 = hexPts[j];
        var p2 = hexPts[(j + 1) % 6];
        out += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6 4" opacity="' + cageOpacity + '"/>';
      }

      // Central open cavity highlight
      out += '<circle cx="0" cy="0" r="60" fill="rgba(16, 185, 129, ' + (cageOpacity * 0.25) + ')" stroke="#10b981" stroke-dasharray="4 4" opacity="' + cageOpacity + '"/>';
      out += '<text x="0" y="5" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle" opacity="' + cageOpacity + '">Open Cage Cavity</text>';
      out += '<text x="0" y="22" fill="#10b981" font-size="10" text-anchor="middle" opacity="' + cageOpacity + '">(Lower Density)</text>';

      // Draw water molecules at each vertex
      hexPts.forEach(function(p, idx){
        out += '<circle cx="' + p.x + '" cy="' + p.y + '" r="18" fill="#ef4444" stroke="#f87171" stroke-width="2"/>';
        out += '<text x="' + p.x + '" y="' + (p.y + 5) + '" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">O</text>';

        // 2 small H atoms
        var h1x = p.x + 16 * Math.cos(idx);
        var h1y = p.y + 16 * Math.sin(idx);
        out += '<circle cx="' + h1x + '" cy="' + h1y + '" r="8" fill="#38bdf8"/>';
        out += '<line x1="' + p.x + '" y1="' + p.y + '" x2="' + h1x + '" y2="' + h1y + '" stroke="#38bdf8" stroke-width="2"/>';
      });

      out += '</g>';

      readout(
        cell("Temperature", currentTemp + " °C", currentTemp <= 0 ? "#38bdf8" : (currentTemp === 4 ? "#10b981" : "#f59e0b")) +
        cell("Density", density.toFixed(4) + " g/cm³", currentTemp === 4 ? "#10b981" : "#f8fafc") +
        cell("Lattice State", currentTemp <= 0 ? "Hexagonal Ice" : "Collapsed Liquid", "#38bdf8") +
        cell("H-Bond Energy", "~20 kJ/mol", "#f59e0b") +
        cell("Open Cage Status", currentTemp <= 0 ? "Intact (Density < 1)" : (currentTemp <= 4 ? "Collapsing (Density increases)" : "Thermal expansion"), "#10b981")
      );

      verdict(
        '<div class="callout" style="background:#0f172a;border-left:4px solid #38bdf8;padding:12px;border-radius:6px;">' +
          '<strong>Anomalous Expansion of Water:</strong> In ice, each oxygen is tetrahedrally coordinated to four hydrogens via two covalent and two hydrogen bonds, freezing into an open cage with large vacant cavities. As ice melts, the rigid cages collapse, packing molecules closer together until maximum density is reached at <strong>4 °C</strong>. Above 4 °C, normal thermal expansion dominates.' +
        '</div>'
      );
    } else {
      // o- vs p-nitrophenol isomerism
      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Intramolecular vs Intermolecular Hydrogen Bonding</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">ortho-Nitrophenol (Intramolecular, steam-volatile) vs para-Nitrophenol (Intermolecular, higher boiling point)</text>';

      // Left: ortho
      out += '<g transform="translate(240, 240)">';
      out += '<rect x="-170" y="-130" width="340" height="260" rx="12" fill="#1e293b" stroke="#334155"/>';
      out += '<text x="0" y="-100" fill="#38bdf8" font-size="17" font-weight="bold" text-anchor="middle">o-Nitrophenol</text>';
      out += '<text x="0" y="-80" fill="#10b981" font-size="13" text-anchor="middle">Intramolecular Chelation (Internal Ring)</text>';

      // Benzene ring representation
      out += '<polygon points="0,-40 40,-15 40,30 0,55 -40,30 -40,-15" fill="none" stroke="#64748b" stroke-width="3"/>';
      out += '<circle cx="0" cy="7" r="22" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>';

      // Substituents close to each other
      out += '<text x="-45" y="-50" fill="#ef4444" font-size="12" font-weight="bold">O—H</text>';
      out += '<text x="35" y="-50" fill="#f59e0b" font-size="12" font-weight="bold">O=N⁺—O⁻</text>';
      // Dotted internal bond
      out += '<line x1="-15" y1="-55" x2="30" y2="-55" stroke="#10b981" stroke-width="3" stroke-dasharray="4 3"/>';
      out += '<text x="8" y="-64" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Intra H-bond</text>';

      out += '<text x="0" y="90" fill="#f8fafc" font-size="12" text-anchor="middle">No association between molecules</text>';
      out += '<text x="0" y="110" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Lower b.p. (216 °C) • Steam Volatile</text>';
      out += '</g>';

      // Right: para
      out += '<g transform="translate(660, 240)">';
      out += '<rect x="-170" y="-130" width="340" height="260" rx="12" fill="#1e293b" stroke="#334155"/>';
      out += '<text x="0" y="-100" fill="#f59e0b" font-size="17" font-weight="bold" text-anchor="middle">p-Nitrophenol</text>';
      out += '<text x="0" y="-80" fill="#f59e0b" font-size="13" text-anchor="middle">Intermolecular Association (Chains)</text>';

      // Benzene ring representation
      out += '<polygon points="0,-40 40,-15 40,30 0,55 -40,30 -40,-15" fill="none" stroke="#64748b" stroke-width="3"/>';
      out += '<circle cx="0" cy="7" r="22" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>';

      // Substituents opposite
      out += '<text x="0" y="-55" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">O—H</text>';
      out += '<text x="0" y="80" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">NO₂</text>';

      // Dotted external bond to neighbor
      out += '<line x1="0" y1="-65" x2="0" y2="-95" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4 3"/>';
      out += '<text x="15" y="-80" fill="#f59e0b" font-size="11" font-weight="bold">Inter H-bond</text>';

      out += '<text x="0" y="98" fill="#f8fafc" font-size="12" text-anchor="middle">Forms extensive polymeric networks</text>';
      out += '<text x="0" y="118" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">Higher b.p. (279 °C) • Non-steam volatile</text>';
      out += '</g>';

      readout(
        cell("Isomer Comparison", "o- vs p-Nitrophenol", "#38bdf8") +
        cell("ortho Type", "Intramolecular (Chelate ring)", "#10b981") +
        cell("ortho Boiling Pt", "216 °C (Steam Volatile)", "#38bdf8") +
        cell("para Type", "Intermolecular (Polymeric chain)", "#f59e0b") +
        cell("para Boiling Pt", "279 °C (Non-volatile)", "#ef4444")
      );

      verdict(
        '<div class="callout" style="background:#0f172a;border-left:4px solid #f59e0b;padding:12px;border-radius:6px;">' +
          '<strong>Steam Distillation Separation:</strong> In o-nitrophenol, the -OH and -NO₂ groups are adjacent (ortho), forming a stable 6-membered intramolecular hydrogen-bonded ring. Because it cannot associate with neighboring molecules, it has high vapour pressure and boils at 216 °C, distilling readily with steam. In p-nitrophenol, groups are far apart (180°), forcing intermolecular hydrogen bonding that knits molecules into high-boiling networks (b.p. 279 °C).' +
        '</div>'
      );
    }

    svg.innerHTML = out;
  }

  return { mount: mount, draw: draw };
})();

// Browser QA identifies each scenario by data-preset. Keep these identifiers
// local to the chapter so every visible preset has a stable fixture key.
Object.keys(window.SIMS).forEach(function(key){
  var sim = window.SIMS[key];
  if(!sim || typeof sim.mount !== "function") return;
  var originalMount = sim.mount;
  // Zero-arg wrapper: the runtime wipes the play block when mount.length >= 1
  // on a sim without .draw, so this wrapper must not declare parameters.
  sim.mount = function(){
    originalMount.apply(sim, arguments);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn, index){
      if(!btn.dataset.preset) btn.dataset.preset = btn.id || (key + "-" + index);
    });
  };
});

// The shared browser fixture names the revealed prediction states explicitly.
// Add those semantic aliases after the existing chapter runtime evaluates a choice.
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

// Keep this chapter's presentation aligned with its data while the shared
// Class 11 runtime remains backward-compatible with older array connect cards.
function normalizeConceptPresentation(){
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  if(!lesson) return;
  var watch = document.getElementById("what-to-watch");
  var watchText = "What to watch: " + lesson.watch;
  if(watch && lesson.watch && watch.textContent !== watchText) watch.textContent = watchText;
  document.querySelectorAll(".connect-grid").forEach(function(grid){
    var cards = Array.from(grid.querySelectorAll(":scope > .connect-card"));
    var explicitWow = cards.find(function(card){
      var heading = card.querySelector("h3");
      return heading && /^Wow/i.test(heading.textContent.trim());
    });
    if(!explicitWow) return;
    cards.forEach(function(card){
      if(card === explicitWow) return;
      card.classList.remove("wow");
      card.removeAttribute("data-wow");
      card.removeAttribute("data-source");
      var badge = card.querySelector(":scope > .wow-badge");
      if(badge) badge.remove();
    });
  });
}
var conceptView = document.getElementById("concept-view");
if(conceptView){
  new MutationObserver(normalizeConceptPresentation).observe(conceptView, {childList: true, subtree: true});
  normalizeConceptPresentation();
}
