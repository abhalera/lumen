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
// 1. SIMULATION 1: Dynamic Chemical Equilibrium (dynamiceq)
// -------------------------------------------------------------------------
window.SIMS.dynamiceq = (function(){
  var currentReaction = "h2-i2"; // "h2-i2", "no2-n2o4", "nh3"
  var simTime = 3.0; // 0..5 s

  var reactions = {
    "h2-i2": {
      name: "Hydrogen-Iodine Equilibrium: H₂(g) + I₂(g) ⇌ 2 HI(g)",
      kc: "54.8 (at 700 K)",
      reactants: "H₂ + I₂", products: "2 HI",
      rf: function(t){ return Math.max(10, 100 * Math.exp(-t * 0.9)); },
      rb: function(t){ return Math.min(55, 55 * (1 - Math.exp(-t * 0.9))); },
      concA: function(t){ return (0.10 - 0.078 * (1 - Math.exp(-t))).toFixed(3); },
      concB: function(t){ return (0.156 * (1 - Math.exp(-t))).toFixed(3); }
    },
    "no2-n2o4": {
      name: "Dimerization Equilibrium: 2 NO₂(g) (Brown) ⇌ N₂O₄(g) (Colorless)",
      kc: "215.5 (at 298 K)",
      reactants: "2 NO₂", products: "N₂O₄",
      rf: function(t){ return Math.max(15, 90 * Math.exp(-t * 1.1)); },
      rb: function(t){ return Math.min(45, 45 * (1 - Math.exp(-t * 1.1))); },
      concA: function(t){ return (0.20 - 0.12 * (1 - Math.exp(-t))).toFixed(3); },
      concB: function(t){ return (0.06 * (1 - Math.exp(-t))).toFixed(3); }
    },
    "nh3": {
      name: "Haber Ammonia Synthesis: N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)",
      kc: "0.061 (at 500 K)",
      reactants: "N₂ + 3 H₂", products: "2 NH₃",
      rf: function(t){ return Math.max(8, 80 * Math.exp(-t * 0.8)); },
      rb: function(t){ return Math.min(30, 30 * (1 - Math.exp(-t * 0.8))); },
      concA: function(t){ return (0.50 - 0.20 * (1 - Math.exp(-t))).toFixed(3); },
      concB: function(t){ return (0.40 * (1 - Math.exp(-t))).toFixed(3); }
    }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Forward Reaction Rate (r_f)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Reverse Reaction Rate (r_b)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Equilibrium Point (r_f = r_b)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-eq-h2i2">H₂ + I₂ ⇌ 2 HI (700 K)</button>' +
      '<button class="preset-btn" id="p-eq-no2">2 NO₂ ⇌ N₂O₄</button>' +
      '<button class="preset-btn" id="p-eq-nh3">N₂ + 3 H₂ ⇌ 2 NH₃</button>';

    document.getElementById("p-eq-h2i2").onclick = function(){ setActivePreset(this); currentReaction = "h2-i2"; draw(simTime); };
    document.getElementById("p-eq-no2").onclick = function(){ setActivePreset(this); currentReaction = "no2-n2o4"; draw(simTime); };
    document.getElementById("p-eq-nh3").onclick = function(){ setActivePreset(this); currentReaction = "nh3"; draw(simTime); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Time Progress towards Dynamic Equilibrium (0 to 5 s):</label>' +
        '<input type="range" id="eq-time-range" min="0" max="5" value="' + simTime + '" step="0.1">' +
      '</div>';

    var rng = document.getElementById("eq-time-range");
    if(rng) rng.oninput = function(){ simTime = parseFloat(this.value); draw(simTime); };

    draw(simTime);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var rx = reactions[currentReaction];
    var rfVal = rx.rf(t);
    var rbVal = rx.rb(t);
    var isEq = Math.abs(rfVal - rbVal) < 8 || t >= 3.5;

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">' + rx.name + '</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Equilibrium Constant K_c = ' + rx.kc + ' | At dynamic equilibrium, r_forward = r_reverse &gt; 0</text>';

    // Reaction rate indicator plot
    out += '<g transform="translate(150, 420)">';
    out += '<line x1="0" y1="0" x2="600" y2="0" stroke="#94a3b8" stroke-width="2"/>';
    out += '<line x1="0" y1="0" x2="0" y2="-320" stroke="#94a3b8" stroke-width="2"/>';
    out += '<text x="600" y="30" fill="#94a3b8" font-size="13" text-anchor="end">Reaction Time (t) →</text>';
    out += '<text x="-15" y="-320" fill="#94a3b8" font-size="13" text-anchor="end">Reaction Rate (r) ↑</text>';

    // Forward curve (decreases)
    var fPath = "M 0 " + (-rx.rf(0) * 2.8);
    for(var st = 0.1; st <= 5.0; st += 0.1){
      fPath += " L " + (st * 120) + " " + (-rx.rf(st) * 2.8);
    }
    out += '<path d="' + fPath + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';
    out += '<text x="120" y="-230" fill="#38bdf8" font-size="14" font-weight="bold">Forward Rate r_f (' + rx.reactants + ')</text>';

    // Reverse curve (increases)
    var bPath = "M 0 " + (-rx.rb(0) * 2.8);
    for(var st2 = 0.1; st2 <= 5.0; st2 += 0.1){
      bPath += " L " + (st2 * 120) + " " + (-rx.rb(st2) * 2.8);
    }
    out += '<path d="' + bPath + '" fill="none" stroke="#ef4444" stroke-width="3"/>';
    out += '<text x="120" y="-70" fill="#ef4444" font-size="14" font-weight="bold">Reverse Rate r_b (' + rx.products + ')</text>';

    // Current time indicator line
    var curX = t * 120;
    out += '<line x1="' + curX + '" y1="0" x2="' + curX + '" y2="-320" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 4"/>';
    out += '<circle cx="' + curX + '" cy="' + (-rfVal * 2.8) + '" r="6" fill="#38bdf8"/>';
    out += '<circle cx="' + curX + '" cy="' + (-rbVal * 2.8) + '" r="6" fill="#ef4444"/>';

    if(isEq){
      out += '<rect x="420" y="-180" width="170" height="40" rx="6" fill="#10b981" opacity="0.9"/>';
      out += '<text x="505" y="-155" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">DYNAMIC EQUILIBRIUM</text>';
    }

    out += '</g>';
    svg.innerHTML = out;

    readout(
      cell("Reaction", rx.reactants + " ⇌ " + rx.products, "#38bdf8") +
      cell("Forward Rate (r_f)", rfVal.toFixed(1) + " s⁻¹", "#38bdf8") +
      cell("Reverse Rate (r_b)", rbVal.toFixed(1) + " s⁻¹", "#ef4444") +
      cell("State", isEq ? "AT DYNAMIC EQUILIBRIUM" : "Approaching Equilibrium", isEq ? "#10b981" : "#f59e0b") +
      cell("Equilibrium K_c", rx.kc, "#f8fafc")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid ' + (isEq ? "#10b981" : "#38bdf8") + ';padding:12px;border-radius:6px;">' +
        '<strong>Dynamic Nature of Chemical Equilibrium:</strong> ' +
        (isEq
          ? 'Forward and reverse reaction rates are identical (r_f = r_b). Molecules continue to collide, react, and decompose at equal speeds, keeping all macroscopic concentrations constant.'
          : 'The forward reaction rate is decelerating as reactants are consumed, while the reverse rate accelerates as products accumulate.') +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Kp vs Kc & Reaction Quotient Qc (kpconverter)
// -------------------------------------------------------------------------
window.SIMS.kpconverter = (function(){
  var currentReaction = "nocl"; // "nocl", "caco3", "so3"
  var userTemp = 500; // K

  var rxData = {
    "nocl": {
      name: "2 NOCl(g) ⇌ 2 NO(g) + Cl₂(g)",
      kp: 0.018, dng: 1,
      r_bar: 0.0831,
      calcKc: function(T){ return (0.018 / (0.0831 * T)).toExponential(2); }
    },
    "caco3": {
      name: "CaCO₃(s) ⇌ CaO(s) + CO₂(g)",
      kp: 167, dng: 1,
      r_bar: 0.0831,
      calcKc: function(T){ return (167 / (0.0831 * T)).toFixed(2); }
    },
    "so3": {
      name: "2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g)",
      kp: 2.0e10, dng: -1,
      r_bar: 0.0831,
      calcKc: function(T){ return (2.0e10 * (0.0831 * T)).toExponential(2); }
    }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Partial Pressure K_p</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Molar Concentration K_c</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Gaseous Mole Change (Δn_g)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-kp-nocl">2 NOCl ⇌ 2 NO + Cl₂ (Δn_g = +1)</button>' +
      '<button class="preset-btn" id="p-kp-caco3">CaCO₃ ⇌ CaO + CO₂ (Heterogeneous)</button>' +
      '<button class="preset-btn" id="p-kp-so3">2 SO₂ + O₂ ⇌ 2 SO₃ (Δn_g = −1)</button>';

    document.getElementById("p-kp-nocl").onclick = function(){ setActivePreset(this); currentReaction = "nocl"; userTemp = 500; updateSlider(); draw(0); };
    document.getElementById("p-kp-caco3").onclick = function(){ setActivePreset(this); currentReaction = "caco3"; userTemp = 1073; updateSlider(); draw(0); };
    document.getElementById("p-kp-so3").onclick = function(){ setActivePreset(this); currentReaction = "so3"; userTemp = 450; updateSlider(); draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Reaction Temperature (300 K to 1200 K):</label>' +
        '<input type="range" id="kp-temp-range" min="300" max="1200" value="' + userTemp + '" step="25">' +
      '</div>';

    var rng = document.getElementById("kp-temp-range");
    if(rng) rng.oninput = function(){ userTemp = parseInt(this.value, 10); draw(0); };

    draw(0);
  }

  function updateSlider(){
    var rng = document.getElementById("kp-temp-range");
    if(rng) rng.value = userTemp;
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var rx = rxData[currentReaction];
    var kcVal = rx.calcKc(userTemp);

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">' + rx.name + '</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Formula: K_p = K_c · (RT)^{Δn_g} ⇔ K_c = K_p · (RT)^{-Δn_g} | R = 0.0831 L·bar·K⁻¹·mol⁻¹</text>';

    out += '<g transform="translate(180, 140)">';

    // Calculation Box
    out += '<rect x="0" y="0" width="540" height="240" rx="12" fill="#1e293b" stroke="#334155"/>';
    out += '<text x="270" y="40" fill="#38bdf8" font-size="18" font-weight="bold" text-anchor="middle">Thermodynamic Conversion at T = ' + userTemp + ' K</text>';

    out += '<text x="40" y="85" fill="#f8fafc" font-size="15">1. Gaseous Mole Change (Δn_g) = <tspan fill="#f59e0b" font-weight="bold">' + (rx.dng > 0 ? "+" + rx.dng : rx.dng) + '</tspan></text>';
    out += '<text x="40" y="120" fill="#f8fafc" font-size="15">2. RT factor = (0.0831) × (' + userTemp + ') = <tspan fill="#10b981" font-weight="bold">' + (0.0831 * userTemp).toFixed(2) + ' bar·L/mol</tspan></text>';
    out += '<text x="40" y="155" fill="#f8fafc" font-size="15">3. Value of K_p = <tspan fill="#38bdf8" font-weight="bold">' + rx.kp + '</tspan></text>';

    out += '<rect x="30" y="175" width="480" height="45" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>';
    out += '<text x="270" y="204" fill="#10b981" font-size="17" font-weight="900" text-anchor="middle">Resulting K_c = ' + kcVal + ' M^{Δn_g}</text>';

    out += '</g>';
    svg.innerHTML = out;

    readout(
      cell("Reaction", rx.name.split("⇌")[0] + " ⇌ ...", "#38bdf8") +
      cell("Temperature", userTemp + " K", "#f8fafc") +
      cell("Δn_g", (rx.dng > 0 ? "+" + rx.dng : rx.dng).toString(), "#f59e0b") +
      cell("K_p", rx.kp.toString(), "#38bdf8") +
      cell("K_c", kcVal.toString(), "#10b981")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
        '<strong>Conversion Rule:</strong> If Δn_g = 0, K_p = K_c strictly. If Δn_g > 0, K_p > K_c (at standard temperature). If Δn_g < 0, K_p < K_c. ' +
        'Pure solids (like CaCO₃ and CaO) have unit activity and do not contribute to Δn_g.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Le Chatelier Disturbance Responder (lechatelier)
// -------------------------------------------------------------------------
window.SIMS.lechatelier = (function(){
  var currentAction = "add-n2"; // "add-n2", "inc-p", "inc-t", "inert-v", "inert-p", "catalyst"

  var actions = {
    "add-n2": {
      name: "Increase Reactant [N₂]",
      stress: "Adding reactant N₂ increases numerator in Q_c denominator ratio",
      shift: "FORWARD (Shift to Right)",
      color: "#10b981",
      detail: "The system consumes added N₂ by reacting with H₂ to produce more NH₃."
    },
    "inc-p": {
      name: "Increase Pressure (Volume Halved)",
      stress: "Compressing gas increases all partial pressures equally",
      shift: "FORWARD (Shift to Right)",
      color: "#10b981",
      detail: "Reactants have 4 gas moles (N₂ + 3 H₂) while products have 2 gas moles (2 NH₃). High pressure shifts toward FEWER gas moles."
    },
    "inc-t": {
      name: "Increase Temperature (Heating)",
      stress: "Adding thermal energy to an exothermic reaction (ΔH = −92.4 kJ/mol)",
      shift: "BACKWARD (Shift to Left)",
      color: "#ef4444",
      detail: "Exothermic reaction produces heat. Adding heat shifts the reaction in the ENDOTHERMIC reverse direction to absorb excess energy. K_c decreases."
    },
    "inert-v": {
      name: "Add Inert Gas (Argon) at CONSTANT VOLUME",
      stress: "Total pressure increases, but partial pressures of N₂, H₂, NH₃ remain unchanged",
      shift: "NO SHIFT (Equilibrium Unaffected)",
      color: "#94a3b8",
      detail: "Because vessel volume is fixed, molar concentrations p_i = n_i RT / V are constant, so Q_c remains equal to K_c."
    },
    "inert-p": {
      name: "Add Inert Gas at CONSTANT PRESSURE",
      stress: "Vessel expands to accommodate argon, diluting reactant and product concentrations",
      shift: "BACKWARD (Shift to Left)",
      color: "#ef4444",
      detail: "Expansion lowers partial pressures. The system shifts toward the side with MORE gas moles (4 moles on left vs 2 on right)."
    },
    "catalyst": {
      name: "Add Iron / Molybdenum Catalyst",
      stress: "Lowers activation energy for forward and reverse paths equally",
      shift: "NO SHIFT (Composition & K_c Unchanged)",
      color: "#38bdf8",
      detail: "Catalysts accelerate the rate of reaching equilibrium without altering the equilibrium position or constant."
    }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Forward Shift (Yield Increases)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Reverse Shift (Yield Decreases)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>No Shift (Equilibrium Stable)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-lc-n2">+ [N₂]</button>' +
      '<button class="preset-btn" id="p-lc-p">+ Pressure</button>' +
      '<button class="preset-btn" id="p-lc-t">+ Temperature</button>' +
      '<button class="preset-btn" id="p-lc-ar-v">Ar (Const V)</button>' +
      '<button class="preset-btn" id="p-lc-ar-p">Ar (Const P)</button>' +
      '<button class="preset-btn" id="p-lc-cat">+ Catalyst</button>';

    var pmap = {
      "p-lc-n2": "add-n2", "p-lc-p": "inc-p", "p-lc-t": "inc-t",
      "p-lc-ar-v": "inert-v", "p-lc-ar-p": "inert-p", "p-lc-cat": "catalyst"
    };
    Object.keys(pmap).forEach(function(pid){
      var btn = document.getElementById(pid);
      if(btn){
        btn.onclick = function(){
          setActivePreset(this);
          currentAction = pmap[pid];
          draw(0);
        };
      }
    });

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Target System: Haber-Bosch Ammonia Synthesis:</label>' +
        '<div style="padding:10px;background:#1e293b;border-radius:8px;font-family:monospace;color:#38bdf8;font-size:15px;font-weight:bold;text-align:center;">' +
          'N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g);  ΔH = −92.4 kJ/mol (Exothermic)' +
        '</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var act = actions[currentAction];

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Le Chatelier Disturbance Responder Lab</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Perturbation: ' + act.name + ' | System Response: ' + act.shift + '</text>';

    out += '<g transform="translate(450, 240)">';

    // Reactor vessel box
    out += '<rect x="-240" y="-120" width="480" height="240" rx="14" fill="#1e293b" stroke="' + act.color + '" stroke-width="4"/>';

    // Left side: N2 + 3 H2 (4 moles)
    out += '<rect x="-210" y="-80" width="180" height="160" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
    out += '<text x="-120" y="-40" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Reactants</text>';
    out += '<text x="-120" y="-10" fill="#f8fafc" font-size="14" text-anchor="middle">N₂ + 3 H₂</text>';
    out += '<text x="-120" y="25" fill="#f59e0b" font-size="18" font-weight="900" text-anchor="middle">4 Moles Gas</text>';

    // Right side: 2 NH3 (2 moles)
    out += '<rect x="30" y="-80" width="180" height="160" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>';
    out += '<text x="120" y="-40" fill="#10b981" font-size="16" font-weight="bold" text-anchor="middle">Products</text>';
    out += '<text x="120" y="-10" fill="#f8fafc" font-size="14" text-anchor="middle">2 NH₃</text>';
    out += '<text x="120" y="25" fill="#f59e0b" font-size="18" font-weight="900" text-anchor="middle">2 Moles Gas</text>';

    // Shift arrow in center
    if(act.shift.includes("FORWARD")){
      out += '<line x1="-20" y1="0" x2="20" y2="0" stroke="#10b981" stroke-width="6"/>';
      out += '<polygon points="28,0 16,-8 16,8" fill="#10b981"/>';
      out += '<text x="0" y="-20" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">SHIFTS FORWARD →</text>';
    } else if(act.shift.includes("BACKWARD")){
      out += '<line x1="20" y1="0" x2="-20" y2="0" stroke="#ef4444" stroke-width="6"/>';
      out += '<polygon points="-28,0 -16,-8 -16,8" fill="#ef4444"/>';
      out += '<text x="0" y="-20" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">← SHIFTS BACKWARD</text>';
    } else {
      out += '<text x="0" y="5" fill="#94a3b8" font-size="14" font-weight="bold" text-anchor="middle">EQUILIBRIUM UNCHANGED</text>';
    }

    out += '</g>';
    svg.innerHTML = out;

    readout(
      cell("Applied Stress", act.name, "#38bdf8") +
      cell("Equilibrium Shift", act.shift, act.color) +
      cell("Ammonia Yield", act.shift.includes("FORWARD") ? "Increases (Optimal)" : (act.shift.includes("BACKWARD") ? "Decreases" : "Unchanged"), act.color) +
      cell("Equilibrium K_c", act.name.includes("Temperature") ? "Decreases (Exothermic)" : "Unchanged", "#f8fafc")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid ' + act.color + ';padding:12px;border-radius:6px;">' +
        '<strong>Le Chatelier Mechanism:</strong> ' + act.detail +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Brønsted & Lewis Acid-Base Theories (acidbasetheory)
// -------------------------------------------------------------------------
window.SIMS.acidbasetheory = (function(){
  var currentModel = "bronsted"; // "bronsted", "lewis"

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Proton Donor / Acid</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Proton Acceptor / Base</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Conjugate Transfer Product</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ab-bronsted">Brønsted-Lowry Conjugate Pairs (NH₃ + H₂O)</button>' +
      '<button class="preset-btn" id="p-ab-lewis">Lewis Coordinate Bond (BF₃ + NH₃)</button>';

    document.getElementById("p-ab-bronsted").onclick = function(){ setActivePreset(this); currentModel = "bronsted"; draw(0); };
    document.getElementById("p-ab-lewis").onclick = function(){ setActivePreset(this); currentModel = "lewis"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Core Definition Comparison:</label>' +
        '<div style="padding:10px;background:#1e293b;border-radius:8px;color:#f8fafc;font-size:14px;">' +
          'Brønsted-Lowry: Acid = Proton donor (H⁺), Base = Proton acceptor. | Lewis: Acid = Electron pair acceptor, Base = Electron pair donor.' +
        '</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var out = '<rect width="900" height="500" fill="#0b1120"/>';

    if(currentModel === "bronsted"){
      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Brønsted-Lowry Acid-Base Conjugate Pairs</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq) | Conjugate pairs differ by exactly one proton (H⁺)</text>';

      out += '<g transform="translate(450, 240)">';

      // Pair 1: NH3 (base) -> NH4+ (conjugate acid)
      out += '<rect x="-240" y="-120" width="200" height="100" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/>';
      out += '<text x="-140" y="-80" fill="#f59e0b" font-size="18" font-weight="bold" text-anchor="middle">NH₃ (Base)</text>';
      out += '<text x="-140" y="-50" fill="#94a3b8" font-size="12" text-anchor="middle">Proton Acceptor (:NH₃)</text>';

      out += '<rect x="40" y="-120" width="200" height="100" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="3"/>';
      out += '<text x="140" y="-80" fill="#10b981" font-size="18" font-weight="bold" text-anchor="middle">NH₄⁺ (Conj Acid)</text>';
      out += '<text x="140" y="-50" fill="#94a3b8" font-size="12" text-anchor="middle">Proton Carrier (+H⁺)</text>';

      // Proton transfer arrow
      out += '<path d="M -80 -125 C -40 -170, 40 -170, 80 -125" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4 4"/>';
      out += '<text x="0" y="-170" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="middle">+ H⁺ Transfer</text>';

      // Pair 2: H2O (acid) -> OH- (conjugate base)
      out += '<rect x="-240" y="20" width="200" height="100" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>';
      out += '<text x="-140" y="60" fill="#38bdf8" font-size="18" font-weight="bold" text-anchor="middle">H₂O (Acid)</text>';
      out += '<text x="-140" y="90" fill="#94a3b8" font-size="12" text-anchor="middle">Proton Donor</text>';

      out += '<rect x="40" y="20" width="200" height="100" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="3"/>';
      out += '<text x="140" y="60" fill="#ef4444" font-size="18" font-weight="bold" text-anchor="middle">OH⁻ (Conj Base)</text>';
      out += '<text x="140" y="90" fill="#94a3b8" font-size="12" text-anchor="middle">Lost Proton (−H⁺)</text>';

      out += '</g>';

      readout(
        cell("Base", "NH₃ (Ammonia)", "#f59e0b") +
        cell("Conjugate Acid", "NH₄⁺ (Ammonium)", "#10b981") +
        cell("Acid", "H₂O (Water)", "#38bdf8") +
        cell("Conjugate Base", "OH⁻ (Hydroxide)", "#ef4444")
      );
    } else {
      // Lewis model: BF3 + NH3 -> F3B <- NH3
      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Lewis Acid-Base Coordinate Adduct Formation</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">BF₃ (Electrophile, vacant 2p orbital) + :NH₃ (Nucleophile, lone pair donor) → F₃B·NH₃</text>';

      out += '<g transform="translate(450, 240)">';

      // BF3 Box
      out += '<rect x="-240" y="-70" width="180" height="140" rx="10" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>';
      out += '<text x="-150" y="-30" fill="#ef4444" font-size="17" font-weight="bold" text-anchor="middle">BF₃ (Lewis Acid)</text>';
      out += '<text x="-150" y="0" fill="#f8fafc" font-size="12" text-anchor="middle">Incomplete Octet (6 e⁻)</text>';
      out += '<text x="-150" y="25" fill="#f59e0b" font-size="12" text-anchor="middle">Vacant 2p Orbital</text>';

      // NH3 Box
      out += '<rect x="60" y="-70" width="180" height="140" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>';
      out += '<text x="150" y="-30" fill="#38bdf8" font-size="17" font-weight="bold" text-anchor="middle">:NH₃ (Lewis Base)</text>';
      out += '<text x="150" y="0" fill="#f8fafc" font-size="12" text-anchor="middle">Complete Octet (8 e⁻)</text>';
      out += '<text x="150" y="25" fill="#10b981" font-size="12" text-anchor="middle">Non-bonding Lone Pair</text>';

      // Coordinate arrow
      out += '<line x1="50" y1="0" x2="-50" y2="0" stroke="#10b981" stroke-width="5"/>';
      out += '<polygon points="-58,0 -46,-8 -46,8" fill="#10b981"/>';
      out += '<text x="0" y="-15" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">Coordinate Dative Bond (e⁻ pair)</text>';

      out += '</g>';

      readout(
        cell("Lewis Acid", "BF₃ (Vacant orbital)", "#ef4444") +
        cell("Lewis Base", ":NH₃ (Lone pair donor)", "#38bdf8") +
        cell("Bond Formed", "Coordinate Covalent", "#10b981") +
        cell("Adduct Formula", "F₃B ← NH₃", "#f8fafc")
      );
    }

    svg.innerHTML = out;

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
        '<strong>Unification of Theories:</strong> All Brønsted bases are Lewis bases (possessing electron pairs to accept protons). However, the Lewis theory is broader because it encompasses electron-deficient metal cations (Co³⁺, Fe³⁺) and molecules with vacant orbitals (BF₃, AlCl₃) that contain no protons.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Weak Acid Ionization & Ostwald Dilution (phweakacid)
// -------------------------------------------------------------------------
window.SIMS.phweakacid = (function(){
  var acidType = "acetic"; // "acetic", "hf", "chloro"
  var userC = 0.05; // M

  var acids = {
    "acetic": { name: "Acetic Acid (CH₃COOH)", ka: 1.74e-5, pka: 4.76 },
    "hf": { name: "Hydrofluoric Acid (HF)", ka: 6.8e-4, pka: 3.17 },
    "chloro": { name: "Chloroacetic Acid (CH₂ClCOOH)", ka: 1.35e-3, pka: 2.87 }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Degree of Ionization (α = √(K_a / C))</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Hydrogen Ion Concentration [H⁺]</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Resulting pH Scale</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-wa-ace">Acetic Acid (K_a = 1.74 × 10⁻⁵)</button>' +
      '<button class="preset-btn" id="p-wa-hf">HF (K_a = 6.8 × 10⁻⁴)</button>' +
      '<button class="preset-btn" id="p-wa-cl">Chloroacetic (K_a = 1.35 × 10⁻³)</button>';

    document.getElementById("p-wa-ace").onclick = function(){ setActivePreset(this); acidType = "acetic"; draw(0); };
    document.getElementById("p-wa-hf").onclick = function(){ setActivePreset(this); acidType = "hf"; draw(0); };
    document.getElementById("p-wa-cl").onclick = function(){ setActivePreset(this); acidType = "chloro"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Concentration C (0.001 M to 0.20 M):</label>' +
        '<input type="range" id="wa-conc-range" min="0.001" max="0.20" value="' + userC + '" step="0.005">' +
      '</div>';

    var rng = document.getElementById("wa-conc-range");
    if(rng) rng.oninput = function(){ userC = parseFloat(this.value); draw(0); };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var ac = acids[acidType];

    // Ostwald calculation: α = sqrt(Ka / C)
    var alpha = Math.min(1.0, Math.sqrt(ac.ka / userC));
    var hConc = userC * alpha;
    var ph = (-Math.log10(hConc)).toFixed(2);

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">' + ac.name + ' — Ostwald Dilution Law</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">K_a = ' + ac.ka + ' (pK_a = ' + ac.pka + ') | α = √(K_a / C) | [H⁺] = C·α | As C decreases, α increases</text>';

    out += '<g transform="translate(180, 140)">';
    out += '<rect x="0" y="0" width="540" height="250" rx="12" fill="#1e293b" stroke="#334155"/>';

    out += '<text x="40" y="45" fill="#38bdf8" font-size="17" font-weight="bold">Solution Parameters (C = ' + userC.toFixed(3) + ' M):</text>';
    out += '<text x="40" y="85" fill="#f8fafc" font-size="15">Degree of Ionization (α): <tspan fill="#f59e0b" font-weight="bold">' + (alpha * 100).toFixed(2) + '%</tspan></text>';
    out += '<text x="40" y="120" fill="#f8fafc" font-size="15">Hydrogen Ion [H⁺]: <tspan fill="#10b981" font-weight="bold">' + hConc.toExponential(3) + ' M</tspan></text>';
    out += '<text x="40" y="155" fill="#f8fafc" font-size="15">Hydroxide Ion [OH⁻]: <tspan fill="#94a3b8">' + (1e-14 / hConc).toExponential(3) + ' M</tspan></text>';

    out += '<rect x="30" y="180" width="480" height="50" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
    out += '<text x="270" y="212" fill="#ef4444" font-size="22" font-weight="900" text-anchor="middle">pH = ' + ph + '</text>';
    out += '</g>';

    svg.innerHTML = out;

    readout(
      cell("Acid", ac.name.split("(")[0], "#38bdf8") +
      cell("Concentration (C)", userC.toFixed(3) + " M", "#f8fafc") +
      cell("Degree of Dissociation α", (alpha * 100).toFixed(2) + "%", "#f59e0b") +
      cell("[H⁺]", hConc.toExponential(2) + " M", "#10b981") +
      cell("pH", ph, "#ef4444")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #38bdf8;padding:12px;border-radius:6px;">' +
        '<strong>Ostwald Dilution Law in Action:</strong> As the solution is diluted (C decreases), the degree of ionization α increases proportionally to 1/√C. However, the total product C·α decreases, so [H⁺] decreases and pH rises.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Buffer Solutions & Henderson-Hasselbalch (buffersim)
// -------------------------------------------------------------------------
window.SIMS.buffersim = (function(){
  var saltConc = 0.10; // M
  var acidConc = 0.10; // M
  var pka = 4.76; // acetic acid
  var addedHcl = false;

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Buffered pH Resistance</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Unbuffered Water pH Plunge</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Henderson-Hasselbalch Ratio</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-buf-equi">Equimolar Buffer ([Salt] = [Acid])</button>' +
      '<button class="preset-btn" id="p-buf-salt">Excess Salt ([Salt] = 2 [Acid])</button>' +
      '<button class="preset-btn" id="p-buf-hcl">Stress Test: Add 1 mL 1M HCl</button>';

    document.getElementById("p-buf-equi").onclick = function(){ setActivePreset(this); saltConc = 0.10; acidConc = 0.10; addedHcl = false; draw(0); };
    document.getElementById("p-buf-salt").onclick = function(){ setActivePreset(this); saltConc = 0.20; acidConc = 0.10; addedHcl = false; draw(0); };
    document.getElementById("p-buf-hcl").onclick = function(){ setActivePreset(this); addedHcl = true; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Sodium Acetate [Salt] (0.02 to 0.30 M):</label>' +
        '<input type="range" id="salt-range" min="0.02" max="0.30" value="' + saltConc + '" step="0.01">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Acetic Acid [Acid] (0.02 to 0.30 M):</label>' +
        '<input type="range" id="acid-range" min="0.02" max="0.30" value="' + acidConc + '" step="0.01">' +
      '</div>';

    var rS = document.getElementById("salt-range");
    if(rS) rS.oninput = function(){ saltConc = parseFloat(this.value); addedHcl = false; draw(0); };
    var rA = document.getElementById("acid-range");
    if(rA) rA.oninput = function(){ acidConc = parseFloat(this.value); addedHcl = false; draw(0); };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;

    var effSalt = saltConc;
    var effAcid = acidConc;
    var waterPh = 7.00;

    if(addedHcl){
      // 1 mL of 1 M HCl in 1 L => +0.001 mol H+
      effSalt = Math.max(0.001, saltConc - 0.001);
      effAcid = acidConc + 0.001;
      waterPh = 3.00; // in water, [H+] becomes 1e-3 M
    }

    var logRatio = Math.log10(effSalt / effAcid);
    var bufferPh = (pka + logRatio).toFixed(2);

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Buffer Action & Henderson-Hasselbalch Equation</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">pH = pK_a + log₁₀([Salt] / [Acid]) | pK_a(CH₃COOH) = 4.76</text>';

    // Comparison columns: Buffered Solution vs Unbuffered Water
    out += '<g transform="translate(240, 240)">';
    out += '<rect x="-170" y="-120" width="340" height="240" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="3"/>';
    out += '<text x="0" y="-85" fill="#10b981" font-size="17" font-weight="bold" text-anchor="middle">Buffered System (Acetate)</text>';
    out += '<text x="0" y="-55" fill="#f8fafc" font-size="13" text-anchor="middle">[Salt] = ' + effSalt.toFixed(3) + ' M | [Acid] = ' + effAcid.toFixed(3) + ' M</text>';
    out += '<text x="0" y="-25" fill="#94a3b8" font-size="12" text-anchor="middle">log₁₀(' + effSalt.toFixed(3) + ' / ' + effAcid.toFixed(3) + ') = ' + (logRatio > 0 ? "+" + logRatio.toFixed(3) : logRatio.toFixed(3)) + '</text>';
    out += '<rect x="-100" y="15" width="200" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>';
    out += '<text x="0" y="52" fill="#10b981" font-size="24" font-weight="900" text-anchor="middle">pH = ' + bufferPh + '</text>';
    out += '<text x="0" y="95" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">' + (addedHcl ? "Shifted by barely 0.01 pH units!" : "Stable Reserve Buffer") + '</text>';
    out += '</g>';

    out += '<g transform="translate(660, 240)">';
    out += '<rect x="-170" y="-120" width="340" height="240" rx="12" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>';
    out += '<text x="0" y="-85" fill="#ef4444" font-size="17" font-weight="bold" text-anchor="middle">Unbuffered Distilled Water</text>';
    out += '<text x="0" y="-55" fill="#f8fafc" font-size="13" text-anchor="middle">Pure H₂O (Initial pH = 7.00)</text>';
    out += '<text x="0" y="-25" fill="#94a3b8" font-size="12" text-anchor="middle">' + (addedHcl ? "Added 1 mL 1M HCl (10⁻³ mol H⁺)" : "No acid added") + '</text>';
    out += '<rect x="-100" y="15" width="200" height="60" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
    out += '<text x="0" y="52" fill="#ef4444" font-size="24" font-weight="900" text-anchor="middle">pH = ' + waterPh.toFixed(2) + '</text>';
    out += '<text x="0" y="95" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">' + (addedHcl ? "CRASHED BY 4.00 pH UNITS!" : "Zero Buffer Resistance") + '</text>';
    out += '</g>';

    svg.innerHTML = out;

    readout(
      cell("Buffer [Salt]", effSalt.toFixed(3) + " M", "#38bdf8") +
      cell("Buffer [Acid]", effAcid.toFixed(3) + " M", "#f8fafc") +
      cell("Buffer pH", bufferPh, "#10b981") +
      cell("Unbuffered Water pH", waterPh.toFixed(2), addedHcl ? "#ef4444" : "#94a3b8") +
      cell("Buffer Resistance", addedHcl ? "EXCEPTIONAL" : "READY", "#10b981")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
        '<strong>Buffer Action Principle:</strong> Adding a strong acid to unbuffered water crashes pH from 7.00 down to 3.00 (a 10,000-fold surge in [H⁺]). In the buffer, acetate ions consume the added H⁺ (CH₃COO⁻ + H⁺ → CH₃COOH), shifting pH by only ~0.01 units.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Solubility Product Ksp & Common Ion (ksplab)
// -------------------------------------------------------------------------
window.SIMS.ksplab = (function(){
  var currentSalt = "agcl"; // "agcl", "baso4", "caf2"
  var commonIonConc = 0.0; // M (e.g. Cl- from NaCl)

  var salts = {
    "agcl": {
      name: "Silver Chloride (AgCl)",
      ksp: 1.8e-10, type: "AB",
      pureS: 1.34e-5,
      calcS: function(c){ return c > 0 ? (1.8e-10 / c) : 1.34e-5; }
    },
    "baso4": {
      name: "Barium Sulfate (BaSO₄)",
      ksp: 1.1e-10, type: "AB",
      pureS: 1.05e-5,
      calcS: function(c){ return c > 0 ? (1.1e-10 / c) : 1.05e-5; }
    },
    "caf2": {
      name: "Calcium Fluoride (CaF₂)",
      ksp: 5.3e-9, type: "AB2",
      pureS: 1.10e-3,
      calcS: function(c){ return c > 0 ? (5.3e-9 / (c * c)) : 1.10e-3; }
    }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Dissolved Ions in Equilibrium</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Precipitate (Solid Undissolved)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Common Ion Suppression</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ksp-agcl">AgCl (Pure Water: S = 1.34 × 10⁻⁵ M)</button>' +
      '<button class="preset-btn" id="p-ksp-baso4">BaSO₄ (Pure Water: S = 1.05 × 10⁻⁵ M)</button>' +
      '<button class="preset-btn" id="p-ksp-caf2">CaF₂ (AB₂ type: K_sp = 4S³)</button>';

    document.getElementById("p-ksp-agcl").onclick = function(){ setActivePreset(this); currentSalt = "agcl"; commonIonConc = 0.0; updateSlider(); draw(0); };
    document.getElementById("p-ksp-baso4").onclick = function(){ setActivePreset(this); currentSalt = "baso4"; commonIonConc = 0.0; updateSlider(); draw(0); };
    document.getElementById("p-ksp-caf2").onclick = function(){ setActivePreset(this); currentSalt = "caf2"; commonIonConc = 0.0; updateSlider(); draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Added Common Ion Concentration (0.00 M to 0.10 M NaCl / NaF):</label>' +
        '<input type="range" id="common-ion-range" min="0.00" max="0.10" value="' + commonIonConc + '" step="0.005">' +
      '</div>';

    var rng = document.getElementById("common-ion-range");
    if(rng) rng.oninput = function(){ commonIonConc = parseFloat(this.value); draw(0); };

    draw(0);
  }

  function updateSlider(){
    var rng = document.getElementById("common-ion-range");
    if(rng) rng.value = commonIonConc;
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = salts[currentSalt];
    var sVal = st.calcS(commonIonConc);

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">' + st.name + ' — Common Ion Effect on Solubility</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">K_sp = ' + st.ksp.toExponential(2) + ' | In pure water: S = ' + st.pureS.toExponential(2) + ' M | Common ion suppresses solubility</text>';

    out += '<g transform="translate(180, 140)">';
    out += '<rect x="0" y="0" width="540" height="240" rx="12" fill="#1e293b" stroke="#334155"/>';

    out += '<text x="40" y="45" fill="#38bdf8" font-size="17" font-weight="bold">Solubility Equilibrium:</text>';
    out += '<text x="40" y="85" fill="#f8fafc" font-size="15">Common Ion Concentration: <tspan fill="#f59e0b" font-weight="bold">' + (commonIonConc > 0 ? commonIonConc.toFixed(3) + ' M' : '0.00 M (Pure Water)') + '</tspan></text>';
    out += '<text x="40" y="125" fill="#f8fafc" font-size="15">Molar Solubility (S): <tspan fill="#10b981" font-weight="bold">' + sVal.toExponential(3) + ' mol/L</tspan></text>';

    var ratio = (st.pureS / sVal).toFixed(0);
    out += '<rect x="30" y="155" width="480" height="60" rx="8" fill="#0f172a" stroke="' + (commonIonConc > 0 ? "#f59e0b" : "#10b981") + '" stroke-width="2"/>';
    if(commonIonConc > 0){
      out += '<text x="270" y="192" fill="#f59e0b" font-size="18" font-weight="900" text-anchor="middle">Solubility Suppressed by ' + ratio + '× Times!</text>';
    } else {
      out += '<text x="270" y="192" fill="#10b981" font-size="18" font-weight="900" text-anchor="middle">Maximum Molar Solubility in Pure Water</text>';
    }

    out += '</g>';
    svg.innerHTML = out;

    readout(
      cell("Salt", st.name.split("(")[0], "#38bdf8") +
      cell("K_sp", st.ksp.toExponential(2), "#f8fafc") +
      cell("Common Ion [X⁻]", commonIonConc > 0 ? commonIonConc.toFixed(3) + " M" : "0.00 M", "#f59e0b") +
      cell("Molar Solubility S", sVal.toExponential(2) + " M", "#10b981") +
      cell("Suppression Factor", commonIonConc > 0 ? ratio + "× Lower" : "1.0× (Pure)", commonIonConc > 0 ? "#ef4444" : "#10b981")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
        '<strong>Common Ion Suppression:</strong> Adding a common ion (such as Cl⁻ to AgCl) stresses the dissolution equilibrium AgCl(s) ⇌ Ag⁺ + Cl⁻. ' +
        'By Le Chatelier&#39;s principle, the system shifts backward, precipitating more solid and suppressing the molar solubility from 1.34 × 10⁻⁵ M down to 1.8 × 10⁻⁹ M (in 0.1 M NaCl).' +
      '</div>'
    );
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
