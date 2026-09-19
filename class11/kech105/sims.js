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
// 1. SIMULATION 1: Thermodynamic Systems & Boundaries (systemtypes)
// -------------------------------------------------------------------------
window.SIMS.systemtypes = (function(){
  var currentType = "open"; // "open", "closed", "isolated", "adiabatic"

  var types = {
    "open": {
      name: "Open System (Boiling Beaker)",
      matter: "Permitted (Δm ≠ 0)",
      energy: "Permitted (q ≠ 0, w ≠ 0)",
      boundary: "Permeable & Diathermic",
      desc: "Exchanges both matter (steam escapes) and energy (heat absorbed from flame) with surroundings.",
      color: "#38bdf8"
    },
    "closed": {
      name: "Closed System (Sealed Piston Vessel)",
      matter: "Forbidden (Δm = 0)",
      energy: "Permitted (Heat q & Work w)",
      boundary: "Impermeable & Diathermic / Movable",
      desc: "Mass remains strictly constant inside, but heat can cross walls and mechanical work can move the piston.",
      color: "#10b981"
    },
    "isolated": {
      name: "Isolated System (Ideal Dewar / Thermos)",
      matter: "Forbidden (Δm = 0)",
      energy: "Forbidden (q = 0, w = 0)",
      boundary: "Impermeable, Rigid & Adiabatic",
      desc: "Neither matter nor energy (heat or work) can cross the boundary. Total internal energy is conserved: ΔU = 0.",
      color: "#f59e0b"
    },
    "adiabatic": {
      name: "Adiabatic Rigid Tank (q = 0, w = 0)",
      matter: "Forbidden (Δm = 0)",
      energy: "Work possible if boundary moves; q = 0",
      boundary: "Adiabatic (Insulated)",
      desc: "Thermal insulation prevents heat flow (q = 0). If work is done (e.g. by stirrer), ΔU = w.",
      color: "#ec4899"
    }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Matter Exchange</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Heat Transfer (q)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Work Boundary (w)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-open">Open System (Beaker)</button>' +
      '<button class="preset-btn" id="p-closed">Closed System (Piston)</button>' +
      '<button class="preset-btn" id="p-isolated">Isolated System (Dewar)</button>' +
      '<button class="preset-btn" id="p-adiabatic">Adiabatic Boundary</button>';

    document.getElementById("p-open").onclick = function(){ setActivePreset(this); currentType = "open"; draw(0); };
    document.getElementById("p-closed").onclick = function(){ setActivePreset(this); currentType = "closed"; draw(0); };
    document.getElementById("p-isolated").onclick = function(){ setActivePreset(this); currentType = "isolated"; draw(0); };
    document.getElementById("p-adiabatic").onclick = function(){ setActivePreset(this); currentType = "adiabatic"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Thermodynamic Boundary Classification:</label>' +
        '<div style="padding:10px;background:#1e293b;border-radius:8px;color:#f8fafc;font-size:14px;">' +
          'A system is the part of universe under thermodynamic investigation. Everything else is surroundings. The boundary determines allowable flux.' +
        '</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = types[currentType];

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">' + st.name + '</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Boundary Type: ' + st.boundary + ' | ' + st.desc + '</text>';

    out += '<g transform="translate(450, 260)">';

    // Vessel walls
    if(currentType === "isolated" || currentType === "adiabatic"){
      // Thick double insulated walls
      out += '<rect x="-180" y="-140" width="360" height="260" rx="14" fill="#1e293b" stroke="#f59e0b" stroke-width="8"/>';
      out += '<rect x="-165" y="-125" width="330" height="230" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2"/>';
      out += '<text x="0" y="-150" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">Adiabatic Insulating Jacket (q = 0)</text>';
    } else {
      // Normal diathermic wall
      out += '<rect x="-160" y="-120" width="320" height="240" rx="10" fill="#0f172a" stroke="#64748b" stroke-width="4"/>';
      out += '<text x="0" y="-132" fill="#64748b" font-size="13" font-weight="bold" text-anchor="middle">Diathermic Wall (Heat permeable)</text>';
    }

    // Interior System Content
    out += '<rect x="-140" y="-20" width="280" height="120" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" stroke-width="2"/>';
    out += '<text x="0" y="45" fill="#38bdf8" font-size="18" font-weight="bold" text-anchor="middle">THERMODYNAMIC SYSTEM</text>';
    out += '<text x="0" y="70" fill="#94a3b8" font-size="12" text-anchor="middle">T, P, V, U, H, S, G</text>';

    // Top Boundary / Matter flux
    if(currentType === "open"){
      out += '<path d="M -80 -120 L -80 -80 M 0 -120 L 0 -80 M 80 -120 L 80 -80" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4 4"/>';
      out += '<polygon points="-80,-70 -85,-82 -75,-82" fill="#38bdf8"/>';
      out += '<polygon points="0,-70 -5,-82 5,-82" fill="#38bdf8"/>';
      out += '<polygon points="80,-70 75,-82 85,-82" fill="#38bdf8"/>';
      out += '<text x="0" y="-95" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">Open Top: Matter Free to Enter/Leave (Δm ≠ 0)</text>';
    } else if(currentType === "closed"){
      // Movable piston
      out += '<rect x="-150" y="-90" width="300" height="24" fill="#475569" stroke="#94a3b8" stroke-width="3"/>';
      out += '<rect x="-16" y="-150" width="32" height="60" fill="#64748b"/>';
      out += '<text x="0" y="-73" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Movable Piston (Work w = −P_ext ΔV)</text>';
      out += '<text x="0" y="-105" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">Sealed: No Matter Transfer (Δm = 0)</text>';
    } else {
      out += '<rect x="-160" y="-125" width="320" height="20" fill="#f59e0b"/>';
      out += '<text x="0" y="-110" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">Hermetically Sealed & Rigid (Δm = 0, w = 0)</text>';
    }

    // Heat transfer arrows (bottom)
    if(currentType === "open" || currentType === "closed"){
      out += '<line x1="-80" y1="170" x2="-80" y2="130" stroke="#ef4444" stroke-width="4"/>';
      out += '<polygon points="-80,120 -86,132 -74,132" fill="#ef4444"/>';
      out += '<line x1="80" y1="170" x2="80" y2="130" stroke="#ef4444" stroke-width="4"/>';
      out += '<polygon points="80,120 74,132 86,132" fill="#ef4444"/>';
      out += '<text x="0" y="165" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">Heat Flux Across Diathermic Boundary (q ≠ 0)</text>';
    } else {
      out += '<text x="0" y="165" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="middle">Adiabatic Boundary Blocks Heat Flow (q = 0)</text>';
    }

    out += '</g>';
    svg.innerHTML = out;

    readout(
      cell("System Type", st.name.split("(")[0], st.color) +
      cell("Matter Exchange (Δm)", st.matter, st.matter.includes("Permitted") ? "#38bdf8" : "#94a3b8") +
      cell("Energy Exchange", st.energy, st.energy.includes("Permitted") ? "#ef4444" : "#f59e0b") +
      cell("Boundary Nature", st.boundary, "#f8fafc")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid ' + st.color + ';padding:12px;border-radius:6px;">' +
        '<strong>System Axiom:</strong> ' + st.desc + ' In an isolated system, both mass and total energy are conserved. In an adiabatic system, only heat flow is forbidden (q = 0), allowing mechanical work to change internal energy: ΔU = w.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: PV-Work & Isothermal Reversible Expansion (pvworklab)
// -------------------------------------------------------------------------
window.SIMS.pvworklab = (function(){
  var mode = "rev"; // "rev", "irrev", "free"
  var v2 = 20; // L (from v1 = 10 L)
  var v1 = 10;
  var n = 2.0; // mol
  var T = 300; // K
  var R = 8.314;

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Reversible PV Work (Area under curve)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Irreversible Work against P_ext</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Isothermal Curve (P = nRT/V)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pv-rev">Reversible Isothermal (Max Work)</button>' +
      '<button class="preset-btn" id="p-pv-irrev">Irreversible Single-Stage (P_ext = 1 bar)</button>' +
      '<button class="preset-btn" id="p-pv-free">Free Expansion (Vacuum P_ext = 0)</button>';

    document.getElementById("p-pv-rev").onclick = function(){ setActivePreset(this); mode = "rev"; draw(0); };
    document.getElementById("p-pv-irrev").onclick = function(){ setActivePreset(this); mode = "irrev"; draw(0); };
    document.getElementById("p-pv-free").onclick = function(){ setActivePreset(this); mode = "free"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Final Expansion Volume V₂ (10 L to 30 L):</label>' +
        '<input type="range" id="v2-range" min="11" max="30" value="' + v2 + '" step="1">' +
      '</div>';

    var rng = document.getElementById("v2-range");
    if(rng) rng.oninput = function(){ v2 = parseFloat(this.value); draw(0); };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;

    // Calculations
    var wRev = -2.303 * n * R * T * Math.log10(v2 / v1); // Joules
    var pExtBar = 1.0; // bar for irrev
    var wIrrev = mode === "free" ? 0 : -(pExtBar * 1e5 * (v2 - v1) * 1e-3); // J

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Isothermal Expansion PV Work Indicator Diagram</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Initial Volume V₁ = 10 L | Final Volume V₂ = ' + v2 + ' L | n = 2 mol ideal gas at T = 300 K</text>';

    // Axes
    out += '<g transform="translate(160, 420)">';
    out += '<line x1="0" y1="0" x2="650" y2="0" stroke="#94a3b8" stroke-width="3"/>';
    out += '<line x1="0" y1="0" x2="0" y2="-340" stroke="#94a3b8" stroke-width="3"/>';
    out += '<text x="650" y="35" fill="#94a3b8" font-size="14" text-anchor="end">Volume V (Litres) →</text>';
    out += '<text x="-30" y="-340" fill="#94a3b8" font-size="14" text-anchor="end">Pressure P (bar) ↑</text>';

    // Map volume 0..35 L to x: 0..600 px
    // Map pressure 0..6 bar to y: 0..-320 px
    function mapX(v){ return (v / 35) * 600; }
    function mapY(p){ return -(p / 6) * 320; }

    var p1 = (n * R * T) / (v1 * 1e-3) / 1e5; // bar
    var p2 = (n * R * T) / (v2 * 1e-3) / 1e5; // bar

    // Plot isotherm P = nRT / V
    var pathD = "";
    var shadeD = "";
    for(var v = 6; v <= 32; v += 0.5){
      var pVal = (n * R * T) / (v * 1e-3) / 1e5;
      var px = mapX(v);
      var py = mapY(pVal);
      if(v === 6) pathD += "M " + px + " " + py;
      else pathD += " L " + px + " " + py;
    }
    out += '<path d="' + pathD + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';

    // Work Shading
    if(mode === "rev"){
      // Full integral under isotherm between v1 and v2
      shadeD = "M " + mapX(v1) + " 0";
      for(var sv = v1; sv <= v2; sv += 0.5){
        var spVal = (n * R * T) / (sv * 1e-3) / 1e5;
        shadeD += " L " + mapX(sv) + " " + mapY(spVal);
      }
      shadeD += " L " + mapX(v2) + " 0 Z";
      out += '<path d="' + shadeD + '" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" stroke-width="2"/>';
      out += '<text x="' + (mapX((v1+v2)/2)) + '" y="' + (mapY(p2)/2) + '" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">Area = |w_rev| = ' + Math.abs(wRev/1000).toFixed(2) + ' kJ</text>';
    } else if(mode === "irrev"){
      // Single stage rectangle: P_ext * (V2 - V1)
      var pExtY = mapY(pExtBar);
      shadeD = "M " + mapX(v1) + " 0 L " + mapX(v1) + " " + pExtY + " L " + mapX(v2) + " " + pExtY + " L " + mapX(v2) + " 0 Z";
      out += '<path d="' + shadeD + '" fill="rgba(239, 68, 68, 0.35)" stroke="#ef4444" stroke-width="2"/>';
      out += '<text x="' + (mapX((v1+v2)/2)) + '" y="' + (pExtY / 2) + '" fill="#ef4444" font-size="15" font-weight="bold" text-anchor="middle">Irreversible Area = |w| = ' + Math.abs(wIrrev/1000).toFixed(2) + ' kJ</text>';
    } else {
      out += '<text x="' + (mapX((v1+v2)/2)) + '" y="-100" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Free Expansion: P_ext = 0 ⇒ Shaded Area = 0 (w = 0)</text>';
    }

    // Mark states A and B
    out += '<circle cx="' + mapX(v1) + '" cy="' + mapY(p1) + '" r="6" fill="#f59e0b"/>';
    out += '<text x="' + (mapX(v1) - 10) + '" y="' + (mapY(p1) - 10) + '" fill="#f59e0b" font-size="13" font-weight="bold">State 1 (10 L, ' + p1.toFixed(1) + ' bar)</text>';

    out += '<circle cx="' + mapX(v2) + '" cy="' + mapY(p2) + '" r="6" fill="#10b981"/>';
    out += '<text x="' + (mapX(v2) + 10) + '" y="' + (mapY(p2) - 10) + '" fill="#10b981" font-size="13" font-weight="bold">State 2 (' + v2 + ' L, ' + p2.toFixed(1) + ' bar)</text>';

    out += '</g>';
    svg.innerHTML = out;

    readout(
      cell("Expansion Mode", mode === "rev" ? "Reversible Isothermal" : (mode === "irrev" ? "Single-Stage Irrev" : "Free Expansion"), "#38bdf8") +
      cell("Work Done (w)", (mode === "rev" ? (wRev/1000).toFixed(2) : (wIrrev/1000).toFixed(2)) + " kJ", mode === "rev" ? "#10b981" : "#ef4444") +
      cell("Heat Absorbed (q)", (mode === "rev" ? (-wRev/1000).toFixed(2) : (-wIrrev/1000).toFixed(2)) + " kJ", "#f59e0b") +
      cell("ΔU (Isothermal)", "0.00 kJ", "#94a3b8")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
        '<strong>Maximum Work Theorem:</strong> A reversible isothermal expansion extracts the absolute maximum possible work (|w_rev| > |w_irrev|) because the internal driving pressure is balanced at every infinitesimal step against external pressure, capturing the entire continuous area under the curve.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Calorimetry & Enthalpy Lab (calorimeter)
// -------------------------------------------------------------------------
window.SIMS.calorimeter = (function(){
  var calType = "bomb"; // "bomb", "coffee"
  var sampleMass = 1.0; // grams

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Bomb Calorimeter (Constant V, q_v = ΔU)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Coffee-Cup (Constant P, q_p = ΔH)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Thermometer Sensor</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-bomb">Bomb Calorimeter (Rigid Steel Bomb, q_v = ΔU)</button>' +
      '<button class="preset-btn" id="p-coffee">Coffee-Cup Calorimeter (Polystyrene, q_p = ΔH)</button>';

    document.getElementById("p-bomb").onclick = function(){ setActivePreset(this); calType = "bomb"; draw(0); };
    document.getElementById("p-coffee").onclick = function(){ setActivePreset(this); calType = "coffee"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Combustible Sample Mass (0.5 g to 3.0 g):</label>' +
        '<input type="range" id="mass-range" min="0.5" max="3.0" value="' + sampleMass + '" step="0.1">' +
      '</div>';

    var rng = document.getElementById("mass-range");
    if(rng) rng.oninput = function(){ sampleMass = parseFloat(this.value); draw(0); };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;

    var cCal = 10.5; // kJ/K
    // Benzoic acid heat of combustion = -26.4 kJ/g
    var heatReleased = sampleMass * 26.4; // kJ
    var deltaT = (heatReleased / cCal).toFixed(2);

    var out = '<rect width="900" height="500" fill="#0b1120"/>';

    if(calType === "bomb"){
      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Bomb Calorimeter — Constant Volume (q_v = ΔU)</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Rigid sealed steel bomb: ΔV = 0 ⇒ w = 0 ⇒ q_v = ΔU (Measures gross internal energy change)</text>';

      out += '<g transform="translate(450, 260)">';
      // Water jacket
      out += '<rect x="-180" y="-130" width="360" height="240" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="4"/>';
      out += '<rect x="-170" y="-120" width="340" height="220" fill="rgba(56, 189, 248, 0.2)"/>';
      out += '<text x="-160" y="-100" fill="#38bdf8" font-size="12" font-weight="bold">Water Bath (C_cal = 10.5 kJ/K)</text>';

      // Inner Steel Bomb
      out += '<rect x="-80" y="-70" width="160" height="150" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="5"/>';
      out += '<text x="0" y="-45" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">Heavy Steel Bomb</text>';
      out += '<text x="0" y="-28" fill="#ec4899" font-size="11" text-anchor="middle">High-pressure O₂ (30 atm)</text>';

      // Sample crucible & combustion flame
      out += '<path d="M -30 35 L 30 35 L 20 55 L -20 55 Z" fill="#64748b"/>';
      out += '<circle cx="0" cy="20" r="14" fill="#f59e0b"/>';
      out += '<text x="0" y="25" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">FLAME</text>';

      // Ignition wires
      out += '<line x1="-15" y1="-70" x2="-15" y2="15" stroke="#ef4444" stroke-width="2"/>';
      out += '<line x1="15" y1="-70" x2="15" y2="15" stroke="#ef4444" stroke-width="2"/>';

      // Thermometer
      out += '<rect x="120" y="-150" width="16" height="210" rx="8" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>';
      out += '<rect x="124" y="' + (-150 + 190 - deltaT*15) + '" width="8" height="' + (deltaT*15 + 10) + '" fill="#ef4444"/>';
      out += '<text x="145" y="-130" fill="#ef4444" font-size="14" font-weight="bold">ΔT = +' + deltaT + ' K</text>';

      // Stirrer
      out += '<line x1="-120" y1="-150" x2="-120" y2="60" stroke="#94a3b8" stroke-width="3"/>';
      out += '<ellipse cx="-120" cy="60" rx="18" ry="6" fill="#94a3b8"/>';
      out += '<text x="-120" y="-160" fill="#94a3b8" font-size="11" text-anchor="middle">Motor Stirrer</text>';

      out += '</g>';

      readout(
        cell("Calorimeter Type", "Constant Volume Bomb", "#38bdf8") +
        cell("Sample Mass", sampleMass.toFixed(1) + " g", "#f8fafc") +
        cell("Heat Released (q_v)", heatReleased.toFixed(1) + " kJ", "#ef4444") +
        cell("Temperature Rise (ΔT)", "+" + deltaT + " K", "#10b981") +
        cell("Internal Energy ΔU", "-" + heatReleased.toFixed(1) + " kJ", "#38bdf8")
      );
    } else {
      // Coffee-cup calorimeter
      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Coffee-Cup Calorimeter — Constant Pressure (q_p = ΔH)</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Open to atmosphere: P = 1 atm constant ⇒ q_p = ΔH (Measures enthalpy of solution/neutralization)</text>';

      out += '<g transform="translate(450, 260)">';
      // Polystyrene cup
      out += '<path d="M -110 -110 L -90 100 L 90 100 L 110 -110 Z" fill="#0f172a" stroke="#f59e0b" stroke-width="5"/>';
      out += '<path d="M -95 -80 L -80 90 L 80 90 L 95 -80 Z" fill="rgba(56, 189, 248, 0.3)"/>';
      out += '<text x="0" y="0" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Aqueous Reaction Mixture</text>';
      out += '<text x="0" y="25" fill="#f8fafc" font-size="12" text-anchor="middle">HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)</text>';

      // Cork lid
      out += '<rect x="-120" y="-125" width="240" height="20" rx="4" fill="#64748b"/>';
      out += '<text x="0" y="-132" fill="#94a3b8" font-size="12" text-anchor="middle">Porous Cork Stopper (P = 1 atm)</text>';

      // Thermometer
      out += '<rect x="40" y="-160" width="14" height="200" rx="6" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>';
      out += '<rect x="44" y="-70" width="6" height="100" fill="#ef4444"/>';
      out += '<text x="65" y="-140" fill="#ef4444" font-size="14" font-weight="bold">ΔT = +5.4 K</text>';
      out += '</g>';

      readout(
        cell("Calorimeter Type", "Constant Pressure Coffee-Cup", "#f59e0b") +
        cell("Reaction", "Neutralization (HCl + NaOH)", "#38bdf8") +
        cell("Enthalpy of Neutralization", "−57.1 kJ/mol", "#10b981") +
        cell("Measured Heat Flow", "q_p = ΔH", "#ef4444")
      );
    }

    svg.innerHTML = out;

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #38bdf8;padding:12px;border-radius:6px;">' +
        '<strong>Calorimetry Law:</strong> A bomb calorimeter measures heat at constant volume with zero work (q_v = ΔU). In contrast, open coffee-cup calorimeters measure heat under constant atmospheric pressure (q_p = ΔH). They are converted via ΔH = ΔU + Δn_g RT.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Thermochemical Cycle & Hess Builder (hesscycle)
// -------------------------------------------------------------------------
window.SIMS.hesscycle = (function(){
  var currentTarget = "ch4"; // "ch4", "ccl4", "ch3oh"

  var cycles = {
    "ch4": {
      name: "Formation of Methane: C(graphite) + 2 H₂(g) → CH₄(g)",
      target_val: -74.8,
      steps: [
        { label: "C(graphite) + O₂(g) → CO₂(g)", dH: -393.5, mult: 1 },
        { label: "2 [H₂(g) + ½O₂(g) → H₂O(l)]", dH: -571.6, mult: 2 },
        { label: "Reverse: CO₂(g) + 2 H₂O(l) → CH₄(g) + 2 O₂(g)", dH: +890.3, mult: -1 }
      ],
      insight: "Sum = (-393.5) + (-571.6) + (+890.3) = -74.8 kJ/mol"
    },
    "ch3oh": {
      name: "Formation of Methanol: C(s) + 2 H₂(g) + ½O₂(g) → CH₃OH(l)",
      target_val: -239.0,
      steps: [
        { label: "C(graphite) + O₂(g) → CO₂(g)", dH: -393.0, mult: 1 },
        { label: "2 [H₂(g) + ½O₂(g) → H₂O(l)]", dH: -572.0, mult: 2 },
        { label: "Reverse: CO₂(g) + 2 H₂O(l) → CH₃OH(l) + 1.5 O₂(g)", dH: +726.0, mult: -1 }
      ],
      insight: "Sum = (-393.0) + (-572.0) + (+726.0) = -239.0 kJ/mol"
    },
    "ccl4": {
      name: "Bond Dissociation of CCl₄(g) → C(g) + 4 Cl(g)",
      target_val: +1304.0,
      steps: [
        { label: "Atomization of C(s) → C(g)", dH: +715.0, mult: 1 },
        { label: "2 × Dissociation of Cl₂(g) → 4 Cl(g)", dH: +484.0, mult: 2 },
        { label: "Reverse Formation: CCl₄(g) → C(s) + 2 Cl₂(g)", dH: +105.0, mult: -1 }
      ],
      insight: "Total Δ_a H = 715 + 484 + 105 = 1304 kJ/mol ⇒ Mean C-Cl Bond Enthalpy = 1304/4 = 326 kJ/mol"
    }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Exothermic Step (−ΔH)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Endothermic Step (+ΔH)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Net Hess Summation Result</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ch4">Methane CH₄ (Δ_f H° = −74.8 kJ)</button>' +
      '<button class="preset-btn" id="p-ch3oh">Methanol CH₃OH (Δ_f H° = −239 kJ)</button>' +
      '<button class="preset-btn" id="p-ccl4">CCl₄ Bond Enthalpy (326 kJ/mol)</button>';

    document.getElementById("p-ch4").onclick = function(){ setActivePreset(this); currentTarget = "ch4"; draw(0); };
    document.getElementById("p-ch3oh").onclick = function(){ setActivePreset(this); currentTarget = "ch3oh"; draw(0); };
    document.getElementById("p-ccl4").onclick = function(){ setActivePreset(this); currentTarget = "ccl4"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Hess&#39;s Law of Constant Heat Summation Principle:</label>' +
        '<div style="padding:10px;background:#1e293b;border-radius:8px;color:#f8fafc;font-size:14px;">' +
          'Enthalpy is a state function: whether a reaction occurs in a single step or a series of stages, total ΔH is strictly identical.' +
        '</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var cy = cycles[currentTarget];

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">' + cy.name + '</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">' + cy.insight + '</text>';

    // Energy ladder diagram
    out += '<g transform="translate(150, 100)">';

    var y = 30;
    cy.steps.forEach(function(st, idx){
      var isExo = st.dH < 0;
      var col = isExo ? "#10b981" : "#ef4444";
      out += '<rect x="0" y="' + y + '" width="600" height="55" rx="8" fill="#1e293b" stroke="' + col + '" stroke-width="2"/>';
      out += '<text x="20" y="' + (y + 33) + '" fill="#f8fafc" font-size="14" font-weight="bold">Step ' + (idx + 1) + ': ' + st.label + '</text>';
      out += '<text x="580" y="' + (y + 33) + '" fill="' + col + '" font-size="16" font-weight="900" text-anchor="end">' + (st.dH > 0 ? "+" + st.dH : st.dH) + ' kJ</text>';
      y += 75;
    });

    // Net summation bar
    out += '<rect x="0" y="' + (y + 10) + '" width="600" height="65" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>';
    out += '<text x="20" y="' + (y + 48) + '" fill="#38bdf8" font-size="16" font-weight="bold">Net Overall Reaction Enthalpy (Δ_r H°):</text>';
    out += '<text x="580" y="' + (y + 48) + '" fill="#38bdf8" font-size="20" font-weight="900" text-anchor="end">' + (cy.target_val > 0 ? "+" + cy.target_val : cy.target_val) + ' kJ/mol</text>';

    out += '</g>';
    svg.innerHTML = out;

    readout(
      cell("Target Process", cy.name.split(":")[0], "#38bdf8") +
      cell("Total Steps Combined", cy.steps.length.toString(), "#f8fafc") +
      cell("Calculated Enthalpy", (cy.target_val > 0 ? "+" + cy.target_val : cy.target_val) + " kJ/mol", "#10b981") +
      cell("State Function Rule", "Path-Independent ΣΔH", "#f59e0b")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
        '<strong>Hess&#39;s Law in Practice:</strong> Reactions that cannot be conducted directly in a laboratory calorimeter (such as the slow soot-forming formation of methane from carbon and hydrogen) can be determined with extreme precision by combining combustion and dissociation enthalpies.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Entropy & Free Expansion Microstate Lab (entropylab)
// -------------------------------------------------------------------------
window.SIMS.entropylab = (function(){
  var expanded = false;
  var tempK = 298;

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Gas Microstate Particles</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Partition Stopcock</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Entropy Surge (ΔS > 0)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-stopcock-closed">Bulb Partition Closed (W₁)</button>' +
      '<button class="preset-btn" id="p-stopcock-open">Stopcock Open (Free Expansion, W₂ &gt;&gt; W₁)</button>';

    document.getElementById("p-stopcock-closed").onclick = function(){ setActivePreset(this); expanded = false; draw(0); };
    document.getElementById("p-stopcock-open").onclick = function(){ setActivePreset(this); expanded = true; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Temperature (100 K to 600 K):</label>' +
        '<input type="range" id="t-range" min="100" max="600" value="' + tempK + '" step="10">' +
      '</div>';

    var rng = document.getElementById("t-range");
    if(rng) rng.oninput = function(){ tempK = parseInt(this.value, 10); draw(0); };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;

    var nMol = 1.0;
    var deltaS = expanded ? (nMol * 8.314 * Math.log(2)).toFixed(2) : "0.00";

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Entropy & Boltzmann Microstates (S = k_B ln W)</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Two-bulb expansion: Opening stopcock doubles accessible volume, multiplying microstates by 2^N and driving ΔS > 0</text>';

    out += '<g transform="translate(450, 250)">';

    // Left Bulb
    out += '<circle cx="-140" cy="0" r="110" fill="#0f172a" stroke="#64748b" stroke-width="4"/>';
    out += '<text x="-140" y="-125" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">Bulb 1 (Volume V)</text>';

    // Right Bulb
    out += '<circle cx="140" cy="0" r="110" fill="#0f172a" stroke="#64748b" stroke-width="4"/>';
    out += '<text x="140" y="-125" fill="#94a3b8" font-size="15" font-weight="bold" text-anchor="middle">Bulb 2 (Volume V)</text>';

    // Connecting tube
    out += '<rect x="-40" y="-18" width="80" height="36" fill="#1e293b" stroke="#64748b" stroke-width="2"/>';

    // Stopcock
    if(!expanded){
      out += '<rect x="-8" y="-40" width="16" height="80" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>';
      out += '<text x="0" y="55" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">STOPCOCK CLOSED</text>';
    } else {
      out += '<rect x="-25" y="-8" width="50" height="16" fill="#10b981"/>';
      out += '<text x="0" y="55" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">STOPCOCK OPEN (Free Expansion)</text>';
    }

    // Render particles
    var pCount = 36;
    for(var i = 0; i < pCount; i++){
      var px, py;
      if(!expanded){
        // All in left bulb
        var ang = (i * 2.39996) % (2 * Math.PI);
        var rad = 25 + ((i * 17) % 70);
        px = -140 + rad * Math.cos(ang);
        py = rad * Math.sin(ang);
      } else {
        // Dispersed in both bulbs
        var inRight = (i % 2 === 0);
        var cX = inRight ? 140 : -140;
        var ang2 = (i * 2.39996) % (2 * Math.PI);
        var rad2 = 25 + ((i * 17) % 70);
        px = cX + rad2 * Math.cos(ang2);
        py = rad2 * Math.sin(ang2);
      }
      out += '<circle cx="' + px + '" cy="' + py + '" r="5" fill="#38bdf8"/>';
    }

    out += '</g>';
    svg.innerHTML = out;

    readout(
      cell("Stopcock Status", expanded ? "OPEN (Expanded)" : "CLOSED", expanded ? "#10b981" : "#f59e0b") +
      cell("Volume", expanded ? "2 V" : "1 V", "#f8fafc") +
      cell("Entropy Change ΔS", "+" + deltaS + " J/K/mol", expanded ? "#10b981" : "#94a3b8") +
      cell("Temperature", tempK + " K", "#38bdf8") +
      cell("Spontaneity Reason", expanded ? "Disorder Maximization" : "Constrained", "#10b981")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
        '<strong>Second Law in Isolated Systems:</strong> During free expansion into a vacuum, no heat is absorbed (q = 0) and no work is done (w = 0), so ΔU = 0 and ΔT = 0. The gas expands spontaneously solely because molecular dispersal increases the accessible microstates: ΔS = nR ln(V2/V1) = +5.76 J/K/mol.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Gibbs Free Energy & Temperature Spontaneity (gibbslab)
// -------------------------------------------------------------------------
window.SIMS.gibbslab = (function(){
  var currentCase = "high-t"; // "all-t", "never", "high-t", "low-t"
  var userTemp = 1500; // K

  var cases = {
    "all-t": {
      name: "Case 1: ΔH < 0, ΔS > 0 (Combustion)",
      dH: -200, dS: +0.1,
      desc: "Both enthalpy and entropy favor the reaction. ΔG is strictly negative at all temperatures.",
      switchT: "Always Spontaneous"
    },
    "never": {
      name: "Case 2: ΔH > 0, ΔS < 0 (3 O₂ → 2 O₃)",
      dH: +285, dS: -0.07,
      desc: "Both enthalpy and entropy oppose the reaction. ΔG is strictly positive at all temperatures.",
      switchT: "Never Spontaneous"
    },
    "high-t": {
      name: "Case 3: ΔH > 0, ΔS > 0 (Endothermic Dissociation)",
      dH: +400, dS: +0.2,
      desc: "Enthalpy opposes (+400 kJ), but entropy favors (+0.2 kJ/K). Becomes spontaneous when T > 2000 K.",
      switchT: "2000 K (Exercise 5.17)"
    },
    "low-t": {
      name: "Case 4: ΔH < 0, ΔS < 0 (Freezing / 2 Cl → Cl₂)",
      dH: -180, dS: -0.15,
      desc: "Enthalpy favors (-180 kJ), but entropy opposes (-0.15 kJ/K). Spontaneous only at low T (T < 1200 K).",
      switchT: "1200 K"
    }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Spontaneous Zone (ΔG < 0)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Non-Spontaneous Zone (ΔG > 0)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Equilibrium Point (ΔG = 0)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-case1">Case 1: ΔH&lt;0, ΔS&gt;0 (Always)</button>' +
      '<button class="preset-btn" id="p-case2">Case 2: ΔH&gt;0, ΔS&lt;0 (Never)</button>' +
      '<button class="preset-btn active" id="p-case3">Case 3: ΔH&gt;0, ΔS&gt;0 (High T)</button>' +
      '<button class="preset-btn" id="p-case4">Case 4: ΔH&lt;0, ΔS&lt;0 (Low T)</button>';

    document.getElementById("p-case1").onclick = function(){ setActivePreset(this); currentCase = "all-t"; draw(0); };
    document.getElementById("p-case2").onclick = function(){ setActivePreset(this); currentCase = "never"; draw(0); };
    document.getElementById("p-case3").onclick = function(){ setActivePreset(this); currentCase = "high-t"; draw(0); };
    document.getElementById("p-case4").onclick = function(){ setActivePreset(this); currentCase = "low-t"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Temperature Explorer (0 K to 3000 K):</label>' +
        '<input type="range" id="temp-k-range" min="10" max="3000" value="' + userTemp + '" step="20">' +
      '</div>';

    var rng = document.getElementById("temp-k-range");
    if(rng) rng.oninput = function(){ userTemp = parseInt(this.value, 10); draw(0); };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var cs = cases[currentCase];

    var dG = cs.dH - (userTemp * cs.dS); // kJ
    var isSpon = dG < 0;

    var out = '<rect width="900" height="500" fill="#0b1120"/>';
    out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">' + cs.name + '</text>';
    out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">' + cs.desc + '</text>';

    // Graph plotting ΔG vs T (T from 0 to 3000 K)
    // x: 150 to 800 (T: 0 to 3000 K)
    // y: 250 is ΔG = 0; y: 100 is +300 kJ; y: 400 is -300 kJ
    out += '<g transform="translate(150, 250)">';

    // Zero line (ΔG = 0)
    out += '<line x1="0" y1="0" x2="650" y2="0" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 4"/>';
    out += '<text x="655" y="5" fill="#f59e0b" font-size="12" font-weight="bold">ΔG = 0 (Equilibrium)</text>';

    // Axes
    out += '<line x1="0" y1="-170" x2="0" y2="170" stroke="#94a3b8" stroke-width="2"/>';
    out += '<text x="-15" y="-170" fill="#94a3b8" font-size="13" text-anchor="end">+ΔG (Non-spon) ↑</text>';
    out += '<text x="-15" y="170" fill="#94a3b8" font-size="13" text-anchor="end">−ΔG (Spon) ↓</text>';
    out += '<text x="650" y="35" fill="#94a3b8" font-size="13" text-anchor="end">Temperature T (Kelvin) →</text>';

    function mapT(temp){ return (temp / 3000) * 600; }
    function mapG(g){ return -(g / 500) * 150; }

    var g0 = cs.dH;
    var g3000 = cs.dH - (3000 * cs.dS);

    var xStart = mapT(0);
    var yStart = mapG(g0);
    var xEnd = mapT(3000);
    var yEnd = mapG(g3000);

    out += '<line x1="' + xStart + '" y1="' + yStart + '" x2="' + xEnd + '" y2="' + yEnd + '" stroke="#38bdf8" stroke-width="4"/>';

    // Current point
    var curX = mapT(userTemp);
    var curY = mapG(dG);
    var ptCol = isSpon ? "#10b981" : "#ef4444";
    out += '<circle cx="' + curX + '" cy="' + curY + '" r="8" fill="' + ptCol + '" stroke="#fff" stroke-width="2"/>';
    out += '<text x="' + curX + '" y="' + (curY - 14) + '" fill="' + ptCol + '" font-size="15" font-weight="bold" text-anchor="middle">T = ' + userTemp + ' K (ΔG = ' + (dG > 0 ? "+" + dG.toFixed(1) : dG.toFixed(1)) + ' kJ)</text>';

    out += '</g>';
    svg.innerHTML = out;

    readout(
      cell("Condition Case", cs.name.split(":")[0], "#38bdf8") +
      cell("Temperature", userTemp + " K", "#f8fafc") +
      cell("ΔH", (cs.dH > 0 ? "+" + cs.dH : cs.dH) + " kJ", "#ec4899") +
      cell("T·ΔS", (userTemp * cs.dS).toFixed(1) + " kJ", "#f59e0b") +
      cell("Gibbs ΔG", (dG > 0 ? "+" + dG.toFixed(1) : dG.toFixed(1)) + " kJ", isSpon ? "#10b981" : "#ef4444") +
      cell("Spontaneous?", isSpon ? "YES (Spontaneous)" : "NO (Non-spontaneous)", isSpon ? "#10b981" : "#ef4444")
    );

    verdict(
      '<div class="callout" style="background:#0f172a;border-left:4px solid ' + (isSpon ? "#10b981" : "#ef4444") + ';padding:12px;border-radius:6px;">' +
        '<strong>Gibbs Criterion:</strong> At constant T and P, a process can proceed spontaneously only if ΔG = ΔH − TΔS &lt; 0. ' +
        'Crossover occurs at T_switch = ΔH / ΔS = ' + cs.switchT + '.' +
      '</div>'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Equilibrium Constant & Third Law Crystal Lab (thirdlawsim)
// -------------------------------------------------------------------------
window.SIMS.thirdlawsim = (function(){
  var mode = "eq"; // "eq", "thirdlaw"
  var kVal = 10; // equilibrium constant

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Products Favored (K > 1, ΔG° < 0)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Reactants Favored (K < 1, ΔG° > 0)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Third Law Absolute Zero Crystal</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-eq10">K = 10 (Δ_r G° = −5.74 kJ/mol)</button>' +
      '<button class="preset-btn" id="p-eq1">K = 1 (Δ_r G° = 0 kJ/mol)</button>' +
      '<button class="preset-btn" id="p-eq001">K = 0.01 (Δ_r G° = +11.49 kJ/mol)</button>' +
      '<button class="preset-btn" id="p-thirdlaw">Third Law Crystal (0 K, S = 0)</button>';

    document.getElementById("p-eq10").onclick = function(){ setActivePreset(this); mode = "eq"; kVal = 10; draw(0); };
    document.getElementById("p-eq1").onclick = function(){ setActivePreset(this); mode = "eq"; kVal = 1; draw(0); };
    document.getElementById("p-eq001").onclick = function(){ setActivePreset(this); mode = "eq"; kVal = 0.01; draw(0); };
    document.getElementById("p-thirdlaw").onclick = function(){ setActivePreset(this); mode = "thirdlaw"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Standard Free Energy & Equilibrium Relation:</label>' +
        '<div style="padding:10px;background:#1e293b;border-radius:8px;font-family:monospace;color:#10b981;font-size:15px;font-weight:bold;text-align:center;">' +
          'Δ_r G° = −RT ln K = −2.303 RT log₁₀ K' +
        '</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var out = '<rect width="900" height="500" fill="#0b1120"/>';

    if(mode === "eq"){
      var T = 300; // K
      var R = 8.314;
      var dG = (-2.303 * R * T * Math.log10(kVal) / 1000).toFixed(2); // kJ/mol

      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Standard Free Energy vs Equilibrium Constant K (at 300 K)</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">Δ_r G° = −2.303 · R · T · log₁₀(K) | When K &gt; 1, ΔG° &lt; 0 | When K = 1, ΔG° = 0 | When K &lt; 1, ΔG° &gt; 0</text>';

      out += '<g transform="translate(450, 240)">';

      // Balance beam representing equilibrium
      out += '<polygon points="0,50 -25,100 25,100" fill="#475569"/>';
      var tilt = kVal === 1 ? 0 : (kVal > 1 ? -15 : 15);
      out += '<g transform="rotate(' + tilt + ' 0 50)">';
      out += '<rect x="-180" y="44" width="360" height="12" rx="4" fill="#94a3b8"/>';

      // Left pan: Reactants
      out += '<line x1="-150" y1="50" x2="-150" y2="100" stroke="#64748b" stroke-width="2"/>';
      out += '<circle cx="-150" cy="110" r="28" fill="#ef4444"/><text x="-150" y="115" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Reactants</text>';

      // Right pan: Products
      out += '<line x1="150" y1="50" x2="150" y2="100" stroke="#64748b" stroke-width="2"/>';
      out += '<circle cx="150" cy="110" r="28" fill="#10b981"/><text x="150" y="115" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Products</text>';
      out += '</g>';

      // Calculation card
      out += '<rect x="-240" y="-120" width="480" height="85" rx="10" fill="#1e293b" stroke="#334155"/>';
      out += '<text x="0" y="-95" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">Selected: K = ' + kVal + ' at T = 300 K</text>';
      out += '<text x="0" y="-68" fill="#f8fafc" font-size="14" text-anchor="middle">Δ_r G° = −2.303 × 8.314 × 300 × log₁₀(' + kVal + ') J/mol</text>';
      out += '<text x="0" y="-45" fill="' + (dG < 0 ? "#10b981" : (dG == 0 ? "#f59e0b" : "#ef4444")) + '" font-size="17" font-weight="900" text-anchor="middle">Δ_r G° = ' + dG + ' kJ/mol</text>';

      out += '</g>';

      readout(
        cell("Equilibrium Constant K", kVal.toString(), kVal >= 1 ? "#10b981" : "#ef4444") +
        cell("Temperature", "300 K", "#f8fafc") +
        cell("Standard Free Energy", dG + " kJ/mol", dG < 0 ? "#10b981" : "#ef4444") +
        cell("Favored at Equilibrium", kVal > 1 ? "Products (K > 1)" : (kVal === 1 ? "Equal (K = 1)" : "Reactants (K < 1)"), "#38bdf8")
      );

      verdict(
        '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
          '<strong>Equilibrium Link:</strong> When Δ_r G° is negative, K &gt; 1, driving the reaction to produce high equilibrium yields of products. When Δ_r G° is positive, K &lt; 1, indicating negligible product formation at standard states.' +
        '</div>'
      );
    } else {
      // Third Law Crystal Lab
      out += '<text x="450" y="38" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle">Third Law of Thermodynamics: Absolute Zero Crystal</text>';
      out += '<text x="450" y="64" fill="#94a3b8" font-size="13" text-anchor="middle">"The entropy of any perfectly crystalline substance approaches zero as temperature approaches absolute zero (0 K)"</text>';

      out += '<g transform="translate(450, 260)">';
      // 5x5 perfectly ordered crystalline lattice
      var spacing = 45;
      for(var r = -2; r <= 2; r++){
        for(var c = -2; c <= 2; c++){
          var cx = c * spacing;
          var cy = r * spacing;
          out += '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>';
          if(c < 2) out += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + spacing) + '" y2="' + cy + '" stroke="#334155" stroke-width="2"/>';
          if(r < 2) out += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + (cy + spacing) + '" stroke="#334155" stroke-width="2"/>';
        }
      }
      out += '<text x="0" y="145" fill="#10b981" font-size="16" font-weight="bold" text-anchor="middle">T = 0 K ⇒ Zero Thermal Vibration ⇒ W = 1 Microstate ⇒ S = k_B ln(1) = 0</text>';
      out += '</g>';

      readout(
        cell("Lattice State", "Perfect Crystalline Solid", "#38bdf8") +
        cell("Absolute Temperature", "0 Kelvin (−273.15 °C)", "#f59e0b") +
        cell("Microstate Count (W)", "W = 1", "#10b981") +
        cell("Absolute Entropy (S)", "0.00 J·K⁻¹·mol⁻¹", "#10b981")
      );

      verdict(
        '<div class="callout" style="background:#0f172a;border-left:4px solid #10b981;padding:12px;border-radius:6px;">' +
          '<strong>Third Law Significance:</strong> Unlike enthalpy where only ΔH can be measured, the Third Law provides an absolute baseline (S = 0 at 0 K) for a perfect crystal. This allows absolute molar entropies (S°) of all chemical elements and compounds to be determined by integrating heat capacity data.' +
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
