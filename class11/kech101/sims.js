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
// 1. SIMULATION 1: States of Matter & Kinetic Particulate Simulator (matterstate)
// -------------------------------------------------------------------------
window.SIMS.matterstate = (function(){
  var temp = 25; // °C
  var mode = "liquid"; // "solid", "liquid", "gas"

  function setMode(newMode, tVal){
    mode = newMode;
    temp = tVal;
    var s = document.getElementById("temp-slider");
    if(s) s.value = temp;
    var tv = document.getElementById("temp-val");
    if(tv) tv.textContent = temp + " °C (" + (temp + 273.15).toFixed(1) + " K)";
    draw(0);
  }

  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Molecules (H₂O)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Intermolecular Bonds</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Boundary Wall</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-solid">Solid Ice (−20 °C)</button>' +
      '<button class="preset-btn active" id="p-liquid">Liquid Water (25 °C)</button>' +
      '<button class="preset-btn" id="p-gas">Water Vapour (120 °C)</button>';

    document.getElementById("p-solid").onclick = function(){ setActivePreset(this); setMode("solid", -20); App.resetTimeline(); App.play(); };
    document.getElementById("p-liquid").onclick = function(){ setActivePreset(this); setMode("liquid", 25); App.resetTimeline(); App.play(); };
    document.getElementById("p-gas").onclick = function(){ setActivePreset(this); setMode("gas", 120); App.resetTimeline(); App.play(); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Thermal Temperature: <b id="temp-val" style="color:#38bdf8;">25 °C (298.2 K)</b></label>' +
        '<input type="range" id="temp-slider" min="-50" max="150" value="25" step="1">' +
      '</div>';

    document.getElementById("temp-slider").oninput = function(e){
      temp = parseFloat(e.target.value);
      var tv = document.getElementById("temp-val");
      if(tv) tv.textContent = temp + " °C (" + (temp + 273.15).toFixed(1) + " K)";
      if(temp <= 0) mode = "solid";
      else if(temp >= 100) mode = "gas";
      else mode = "liquid";
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="60" y="40" width="600" height="220" rx="8" fill="#0f1f2e" stroke="#334155" stroke-width="2"/>';

    var phaseLabel = mode.toUpperCase();
    var phaseColor = mode === "solid" ? "#38bdf8" : (mode === "liquid" ? "#10b981" : "#f59e0b");

    m += '<text x="80" y="70" fill="' + phaseColor + '" font-size="16" font-weight="700">STATE: ' + phaseLabel + '</text>';
    m += '<text x="80" y="90" fill="#94a3b8" font-size="12">Kanāda Parmanu / Kinetic Molecular Model</text>';

    // Draw 36 particles
    var cols = 9, rows = 4;
    var speedMult = Math.max(0.2, (temp + 100) / 100);

    for(var r = 0; r < rows; r++){
      for(var c = 0; c < cols; c++){
        var idx = r * cols + c;
        var cx, cy;
        if(mode === "solid"){
          // Rigid lattice with small jitter
          cx = 160 + c * 48 + Math.sin(t * 8 + idx) * 2;
          cy = 120 + r * 36 + Math.cos(t * 8 + idx) * 2;
          // Connecting bond lines
          if(c < cols - 1) m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 48) + '" y2="' + cy + '" stroke="#1e3a5f" stroke-width="1.5"/>';
          if(r < rows - 1) m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + (cy + 36) + '" stroke="#1e3a5f" stroke-width="1.5"/>';
        } else if(mode === "liquid"){
          // Fluid lower cluster
          cx = 120 + c * 52 + Math.sin(t * 3 * speedMult + idx * 1.7) * 14;
          cy = 150 + r * 24 + Math.cos(t * 2.5 * speedMult + idx * 2.1) * 8;
        } else {
          // Gas: widely dispersed high-speed
          var seedX = (idx * 67 + 23) % 520;
          var seedY = (idx * 41 + 17) % 180;
          cx = 100 + ((seedX + t * 90 * speedMult) % 520);
          cy = 70 + ((seedY + Math.sin(t * 4 + idx) * 60) % 180);
        }
        m += '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="' + phaseColor + '" opacity="0.9"/>';
        m += '<circle cx="' + (cx - 2) + '" cy="' + (cy - 2) + '" r="2.5" fill="#ffffff" opacity="0.8"/>';
      }
    }

    readout(
      cell("Temperature", temp + " °C") +
      cell("Kinetic Energy", (speedMult * 1.38).toFixed(2) + " × 10⁻²¹ J", phaseColor) +
      cell("Compressibility", mode === "gas" ? "High (100×)" : "Negligible", "#34d399")
    );

    var msg = "";
    if(mode === "solid") msg = "<b>Solid Phase (T ≤ 0 °C):</b> Rigid lattice structure with fixed positions and definite volume. Particles possess only vibrational kinetic energy.";
    else if(mode === "liquid") msg = "<b>Liquid Phase (0 < T < 100 °C):</b> Definite volume but indefinite shape. Molecules tumble freely past neighbors while maintaining intermolecular contact.";
    else msg = "<b>Gaseous Phase (T ≥ 100 °C):</b> Thermal kinetic energy completely overcomes intermolecular attractions. Particles fly freely, colliding elastically with container boundaries.";
    verdict(msg);

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Significant Figures & Analytical Balance Precision Lab (sigfiglab)
// -------------------------------------------------------------------------
window.SIMS.sigfiglab = (function(){
  var student = "C"; // "A", "B", "C"
  var testVal = "0.00250";

  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>True Bullseye (2.000 g)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Measured Replicates</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-stu-a">Student A (Precise, Inaccurate)</button>' +
      '<button class="preset-btn" id="p-stu-b">Student B (Neither Precise nor Accurate)</button>' +
      '<button class="preset-btn active" id="p-stu-c">Student C (Both Precise & Accurate)</button>';

    document.getElementById("p-stu-a").onclick = function(){ setActivePreset(this); student = "A"; draw(0); };
    document.getElementById("p-stu-b").onclick = function(){ setActivePreset(this); student = "B"; draw(0); };
    document.getElementById("p-stu-c").onclick = function(){ setActivePreset(this); student = "C"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Live Sig-Fig Analyser: Test any number</label>' +
        '<input type="text" id="sigfig-input" value="0.00250" style="background:#09131d;color:#38bdf8;padding:8px 12px;border:1px solid #334155;border-radius:6px;font-family:monospace;font-size:16px;">' +
      '</div>';

    document.getElementById("sigfig-input").oninput = function(e){
      testVal = e.target.value.trim();
      draw(0);
    };

    draw(0);
  }

  function countSigFigs(s){
    if(!s || isNaN(Number(s))) return 0;
    s = s.replace(/^[+-]/, "");
    if(s.includes("e") || s.includes("E")){
      s = s.split(/[eE]/)[0];
    }
    if(!s.includes(".")){
      // Trailing zeros without decimal are ambiguous/non-significant
      var stripped = s.replace(/^0+/, "").replace(/0+$/, "");
      return stripped.length;
    }
    var parts = s.split(".");
    var intPart = parts[0].replace(/^0+/, "");
    var fracPart = parts[1];
    if(intPart.length > 0){
      return intPart.length + fracPart.length;
    }
    // E.g. 0.00250 -> strip leading zeros after decimal
    var nonZeros = fracPart.replace(/^0+/, "");
    return nonZeros.length;
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    // Left Dartboard Target
    var cx = 180, cy = 150;
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="100" fill="#0f1f2e" stroke="#334155" stroke-width="2"/>';
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="70" fill="none" stroke="#334155" stroke-width="1.5"/>';
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="40" fill="none" stroke="#334155" stroke-width="1.5"/>';
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="#10b981" opacity="0.3"/>';
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#10b981"/>';
    m += '<text x="' + cx + '" y="35" fill="#94a3b8" font-size="13" font-weight="700" text-anchor="middle">PRECISION VS ACCURACY TARGET</text>';
    m += '<text x="' + cx + '" y="' + (cy + 120) + '" fill="#64748b" font-size="11" text-anchor="middle">Bullseye = 2.000 g (True Standard)</text>';

    // Measurements per student
    var pts = [];
    var verdictText = "";
    if(student === "A"){
      pts = [{x: cx - 40, y: cy - 25, val: "1.95 g"}, {x: cx - 44, y: cy - 22, val: "1.93 g"}];
      verdictText = "<b>Student A: Precise but Not Accurate.</b> Spread is only 0.02 g (high repeatability), but average 1.94 g is 0.06 g away from the true 2.000 g standard (systematic calibration error).";
    } else if(student === "B"){
      pts = [{x: cx - 45, y: cy - 30, val: "1.94 g"}, {x: cx + 38, y: cy + 32, val: "2.05 g"}];
      verdictText = "<b>Student B: Neither Precise nor Accurate.</b> Huge spread of 0.11 g between measurements and random error across the bullseye.";
    } else {
      pts = [{x: cx + 6, y: cy - 4, val: "2.01 g"}, {x: cx - 5, y: cy + 3, val: "1.99 g"}];
      verdictText = "<b>Student C: Both Precise and Accurate!</b> Minimal spread (0.02 g) tightly clustered directly around the true standard 2.000 g.";
    }

    pts.forEach(function(p){
      m += '<circle cx="' + p.x + '" cy="' + p.y + '" r="6" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>';
      m += '<text x="' + (p.x + 10) + '" y="' + (p.y + 4) + '" fill="#38bdf8" font-size="11" font-weight="700">' + p.val + '</text>';
    });

    // Right Box: Analytical Balance and Sig-Fig Decoder
    m += '<rect x="360" y="50" width="320" height="200" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>';
    m += '<text x="520" y="78" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">METTLER ANALYTICAL BALANCE</text>';

    // Digital readout panel
    m += '<rect x="390" y="95" width="260" height="50" rx="6" fill="#020617" stroke="#1e293b"/>';
    m += '<text x="520" y="130" fill="#38bdf8" font-size="24" font-family="monospace" font-weight="700" text-anchor="middle">' + testVal + ' g</text>';

    var sCount = countSigFigs(testVal);
    m += '<text x="520" y="175" fill="#f8fafc" font-size="14" text-anchor="middle">Significant Figures: <tspan fill="#34d399" font-weight="700" font-size="18">' + sCount + '</tspan></text>';
    m += '<text x="520" y="200" fill="#94a3b8" font-size="11" text-anchor="middle">Scientific: ' + (Number(testVal) ? Number(testVal).toExponential(Math.max(0, sCount - 1)) : "0") + '</text>';
    m += '<text x="520" y="225" fill="#64748b" font-size="11" text-anchor="middle">Leading zeros never count · Trailing zeros after decimal count</text>';

    readout(
      cell("Investigator", "Student " + student) +
      cell("Input Value", testVal) +
      cell("Sig Figs", sCount, "#34d399")
    );
    verdict(verdictText);

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Chemical Combining Laws & Dalton Ratios (reactionlaws)
// -------------------------------------------------------------------------
window.SIMS.reactionlaws = (function(){
  var law = "multiple"; // "multiple", "definite", "gaylussac"
  var nMass = 14; // g
  var oMass = 32; // g

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Element A (Nitrogen)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Element B (Oxygen)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Product Compound</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-mult">Dalton: Multiple Proportions (Nitrogen Oxides)</button>' +
      '<button class="preset-btn" id="p-def">Proust: Definite Proportions (Water)</button>' +
      '<button class="preset-btn" id="p-gay">Gay-Lussac: Gas Volumes (H₂ + O₂ → Steam)</button>';

    document.getElementById("p-mult").onclick = function(){ setActivePreset(this); law = "multiple"; nMass = 14; oMass = 32; draw(0); };
    document.getElementById("p-def").onclick = function(){ setActivePreset(this); law = "definite"; draw(0); };
    document.getElementById("p-gay").onclick = function(){ setActivePreset(this); law = "gaylussac"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Fixed Nitrogen Mass: <b id="nmass-lbl">14 g</b></label>' +
        '<input type="range" id="nmass-slider" min="14" max="28" value="14" step="14">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Oxygen Mass: <b id="omass-lbl">32 g</b></label>' +
        '<input type="range" id="omass-slider" min="16" max="80" value="32" step="16">' +
      '</div>';

    document.getElementById("nmass-slider").oninput = function(e){
      nMass = parseFloat(e.target.value);
      document.getElementById("nmass-lbl").textContent = nMass + " g";
      draw(0);
    };
    document.getElementById("omass-slider").oninput = function(e){
      oMass = parseFloat(e.target.value);
      document.getElementById("omass-lbl").textContent = oMass + " g";
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(law === "multiple"){
      m += '<text x="360" y="32" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">DALTON’S LAW OF MULTIPLE PROPORTIONS (NCERT EX 1.21)</text>';
      m += '<text x="360" y="52" fill="#94a3b8" font-size="12" text-anchor="middle">Fixed 14 g Nitrogen combines with varying Oxygen in small integer ratios</text>';

      // Table comparing the 4 oxides
      var oxides = [
        {name: "Nitric Oxide (NO)", n: 14, o: 16, ratio: 1},
        {name: "Nitrogen Dioxide (NO₂)", n: 14, o: 32, ratio: 2},
        {name: "Dinitrogen Trioxide (N₂O₃)", n: 14, o: 24, ratio: 1.5},
        {name: "Dinitrogen Pentoxide (N₂O₅)", n: 14, o: 40, ratio: 2.5}
      ];

      for(var i = 0; i < oxides.length; i++){
        var ox = oxides[i];
        var y = 80 + i * 44;
        var isCurrent = (nMass === 14 && oMass === ox.o);
        m += '<rect x="60" y="' + y + '" width="600" height="36" rx="6" fill="' + (isCurrent ? "#1e3a5f" : "#0f172a") + '" stroke="' + (isCurrent ? "#38bdf8" : "#334155") + '"/>';
        m += '<text x="80" y="' + (y + 22) + '" fill="#f8fafc" font-size="13" font-weight="700">' + ox.name + '</text>';
        m += '<text x="280" y="' + (y + 22) + '" fill="#38bdf8" font-size="13">N: ' + ox.n + ' g</text>';
        m += '<text x="380" y="' + (y + 22) + '" fill="#ef4444" font-size="13">O: ' + ox.o + ' g</text>';
        m += '<text x="500" y="' + (y + 22) + '" fill="#34d399" font-size="13" font-weight="700">O-Ratio: ' + ox.ratio + ' (or ' + (ox.ratio * 2) + ')</text>';
      }

      var normalizedO = (14 / nMass) * oMass;
      var ratioFactor = normalizedO / 16;
      readout(
        cell("Fixed N Mass", "14 g") +
        cell("Reacting O Mass", oMass + " g", "#ef4444") +
        cell("Combining Ratio", "1 : " + ratioFactor.toFixed(1), "#34d399")
      );
      verdict("<b>Multiple Proportions Verified:</b> For fixed 14 g N, the oxygen masses 16 g, 32 g, 40 g form the simple integer ratio <b>1 : 2 : 2.5 (2 : 4 : 5)</b>. Atoms combine in whole units!");
    } else if(law === "definite"){
      m += '<text x="360" y="32" fill="#10b981" font-size="15" font-weight="700" text-anchor="middle">PROUST’S LAW OF DEFINITE PROPORTIONS</text>';
      m += '<text x="360" y="52" fill="#94a3b8" font-size="12" text-anchor="middle">Pure water from rain, river, or synthesis always contains 11.2% H and 88.8% O by mass</text>';

      // Water beaker visualization
      m += '<rect x="220" y="80" width="280" height="150" rx="8" fill="#0f1f2e" stroke="#38bdf8" stroke-width="2"/>';
      m += '<rect x="222" y="130" width="276" height="98" rx="6" fill="#0284c7" opacity="0.6"/>';
      m += '<text x="360" y="175" fill="#ffffff" font-size="20" font-weight="700" text-anchor="middle">H₂O: 1 : 8 by Mass</text>';
      m += '<text x="360" y="200" fill="#bae6fd" font-size="13" text-anchor="middle">2.016 g H : 16.00 g O = 1 : 7.94</text>';

      readout(
        cell("Hydrogen %", "11.19 %", "#38bdf8") +
        cell("Oxygen %", "88.81 %", "#ef4444") +
        cell("Source Invariance", "100% Constant", "#34d399")
      );
      verdict("<b>Proust’s Law:</b> Irrespective of source (Glacier, Indus River, or laboratory combustion), pure water has strict 1:8 mass ratio.");
    } else {
      m += '<text x="360" y="32" fill="#f59e0b" font-size="15" font-weight="700" text-anchor="middle">GAY-LUSSAC’S LAW OF GASEOUS VOLUMES</text>';
      m += '<text x="360" y="52" fill="#94a3b8" font-size="12" text-anchor="middle">2 Volumes H₂ + 1 Volume O₂ → 2 Volumes Steam (at constant T and P)</text>';

      // Cylinders
      m += '<rect x="80" y="90" width="80" height="140" rx="6" fill="#1e3a5f" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="120" y="165" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">H₂ (Vol 1)</text>';

      m += '<rect x="180" y="90" width="80" height="140" rx="6" fill="#1e3a5f" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="220" y="165" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">H₂ (Vol 2)</text>';

      m += '<text x="290" y="170" fill="#ffffff" font-size="24" font-weight="700">+</text>';

      m += '<rect x="320" y="90" width="80" height="140" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="360" y="165" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">O₂ (Vol 1)</text>';

      m += '<text x="430" y="170" fill="#ffffff" font-size="24" font-weight="700">→</text>';

      m += '<rect x="460" y="90" width="80" height="140" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="500" y="165" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">H₂O (Vol 1)</text>';

      m += '<rect x="560" y="90" width="80" height="140" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="600" y="165" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">H₂O (Vol 2)</text>';

      readout(
        cell("Reacting Volumes", "2 Vol H₂ : 1 Vol O₂") +
        cell("Product Volume", "2 Vol H₂O vapour", "#10b981") +
        cell("Volume Ratio", "2 : 1 : 2", "#34d399")
      );
      verdict("<b>Gay-Lussac’s Law (1808):</b> 100 mL of hydrogen combines with 50 mL of oxygen to yield 100 mL of steam (not 150 mL!). Volume contraction occurs because atoms regroup into fewer product gas molecules.");
    }

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Isotopic Mass Spectrometer (atomicmass)
// -------------------------------------------------------------------------
window.SIMS.atomicmass = (function(){
  var cl35Pct = 75.77;

  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>³⁵Cl (34.9689 u)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>³⁷Cl (36.9659 u)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Average Atomic Mass</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cl">Chlorine (Terrestrial: 75.8% / 24.2%)</button>' +
      '<button class="preset-btn" id="p-5050">Equal 50/50 Synthetic Mix</button>' +
      '<button class="preset-btn" id="p-pure35">Pure ³⁵Cl Enriched (99%)</button>';

    document.getElementById("p-cl").onclick = function(){ setActivePreset(this); cl35Pct = 75.77; updateSlider(); draw(0); };
    document.getElementById("p-5050").onclick = function(){ setActivePreset(this); cl35Pct = 50.0; updateSlider(); draw(0); };
    document.getElementById("p-pure35").onclick = function(){ setActivePreset(this); cl35Pct = 99.0; updateSlider(); draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Natural Terrestrial ³⁵Cl Abundance (%): <b id="cl35-lbl" style="color:#38bdf8;">75.77%</b></label>' +
        '<input type="range" id="cl35-slider" min="0" max="100" value="75.77" step="0.1">' +
      '</div>';

    document.getElementById("cl35-slider").oninput = function(e){
      cl35Pct = parseFloat(e.target.value);
      document.getElementById("cl35-lbl").textContent = cl35Pct.toFixed(1) + "%";
      draw(0);
    };

    draw(0);
  }

  function updateSlider(){
    var s = document.getElementById("cl35-slider"); if(s) s.value = cl35Pct;
    var l = document.getElementById("cl35-lbl"); if(l) l.textContent = cl35Pct.toFixed(1) + "%";
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    var m35 = 34.9689, m37 = 36.9659;
    var cl37Pct = 100 - cl35Pct;
    var avgMass = (cl35Pct * m35 + cl37Pct * m37) / 100;

    m += '<text x="360" y="32" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">QUADRUPOLE MASS SPECTROMETER: CHLORINE ISOTOPES</text>';

    // Spectrum axes
    m += '<line x1="100" y1="230" x2="620" y2="230" stroke="#475569" stroke-width="2"/>';
    m += '<line x1="100" y1="60" x2="100" y2="230" stroke="#475569" stroke-width="2"/>';
    m += '<text x="360" y="260" fill="#94a3b8" font-size="12" text-anchor="middle">Mass-to-Charge Ratio (m/z in u)</text>';
    m += '<text x="50" y="145" fill="#94a3b8" font-size="12" text-anchor="middle" transform="rotate(-90 50 145)">Relative Abundance (%)</text>';

    // Peak 35
    var h35 = (cl35Pct / 100) * 150;
    m += '<line x1="240" y1="230" x2="240" y2="' + (230 - h35) + '" stroke="#38bdf8" stroke-width="12" stroke-linecap="round"/>';
    m += '<text x="240" y="246" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">35 u</text>';
    m += '<text x="240" y="' + (220 - h35) + '" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">' + cl35Pct.toFixed(1) + '%</text>';

    // Peak 37
    var h37 = (cl37Pct / 100) * 150;
    m += '<line x1="480" y1="230" x2="480" y2="' + (230 - h37) + '" stroke="#f59e0b" stroke-width="12" stroke-linecap="round"/>';
    m += '<text x="480" y="246" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">37 u</text>';
    m += '<text x="480" y="' + (220 - h37) + '" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">' + cl37Pct.toFixed(1) + '%</text>';

    // Centroid average line
    var centroidX = 240 + ((avgMass - 35) / 2) * 240;
    m += '<line x1="' + centroidX + '" y1="70" x2="' + centroidX + '" y2="230" stroke="#10b981" stroke-width="2" stroke-dasharray="4 4"/>';
    m += '<rect x="' + (centroidX - 60) + '" y="60" width="120" height="24" rx="4" fill="#064e3b" stroke="#10b981"/>';
    m += '<text x="' + centroidX + '" y="76" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">Avg: ' + avgMass.toFixed(3) + ' u</text>';

    readout(
      cell("³⁵Cl (34.97 u)", cl35Pct.toFixed(2) + " %", "#38bdf8") +
      cell("³⁷Cl (36.97 u)", cl37Pct.toFixed(2) + " %", "#f59e0b") +
      cell("Weighted Atomic Mass", avgMass.toFixed(3) + " u", "#34d399")
    );

    verdict("<b>NCERT Ex 1.9 Isotopic Calculation:</b> Average mass = (0.7577 × 34.9689) + (0.2423 × 36.9659) = <b>35.453 u</b>. Because neither isotope exists as a fraction, 35.453 u represents the statistical weighted average of millions of atoms.");

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Interactive 4-Way Mole Hub (moleconverter)
// -------------------------------------------------------------------------
window.SIMS.moleconverter = (function(){
  var mol = 1.0;
  var formula = "H2O";
  var molarMass = 18.016;

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Mass (g)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Amount (Moles)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Particle Count (N_A)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>STP Volume (L)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-h2o">Water H₂O (18.02 g/mol)</button>' +
      '<button class="preset-btn" id="p-co2">Carbon Dioxide CO₂ (44.01 g/mol)</button>' +
      '<button class="preset-btn" id="p-c2h6">Ethane C₂H₆ (30.07 g/mol)</button>' +
      '<button class="preset-btn" id="p-glc">Glucose C₆H₁₂O₆ (180.16 g/mol)</button>';

    document.getElementById("p-h2o").onclick = function(){ setActivePreset(this); formula = "H2O"; molarMass = 18.016; draw(0); };
    document.getElementById("p-co2").onclick = function(){ setActivePreset(this); formula = "CO2"; molarMass = 44.011; draw(0); };
    document.getElementById("p-c2h6").onclick = function(){ setActivePreset(this); formula = "C2H6"; molarMass = 30.07; draw(0); };
    document.getElementById("p-glc").onclick = function(){ setActivePreset(this); formula = "C6H12O6"; molarMass = 180.16; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Moles of Substance (n): <b id="mol-lbl" style="color:#10b981;">1.00 mol</b></label>' +
        '<input type="range" id="mol-slider" min="0.1" max="5.0" value="1.0" step="0.1">' +
      '</div>';

    document.getElementById("mol-slider").oninput = function(e){
      mol = parseFloat(e.target.value);
      document.getElementById("mol-lbl").textContent = mol.toFixed(2) + " mol";
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    var massG = mol * molarMass;
    var particles = mol * 6.02214; // in units of 10^23
    var stpL = mol * 22.71;

    m += '<text x="360" y="32" fill="#10b981" font-size="15" font-weight="700" text-anchor="middle">THE UNIVERSAL 4-WAY MOLE BRIDGE (' + formula + ')</text>';

    // Centre Hub (Moles)
    m += '<circle cx="360" cy="155" r="54" fill="#064e3b" stroke="#10b981" stroke-width="3"/>';
    m += '<text x="360" y="150" fill="#ffffff" font-size="15" font-weight="700" text-anchor="middle">' + mol.toFixed(2) + ' mol</text>';
    m += '<text x="360" y="170" fill="#a7f3d0" font-size="11" text-anchor="middle">CENTRAL HUB</text>';

    // Left Node: Mass (g)
    m += '<rect x="40" y="115" width="160" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
    m += '<text x="120" y="145" fill="#94a3b8" font-size="11" font-weight="700" text-anchor="middle">MASS (n × Molar Mass)</text>';
    m += '<text x="120" y="175" fill="#38bdf8" font-size="18" font-weight="700" text-anchor="middle">' + massG.toFixed(2) + ' g</text>';
    m += '<line x1="200" y1="155" x2="306" y2="155" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 4"/>';

    // Top Node: Particles
    m += '<rect x="270" y="45" width="180" height="46" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
    m += '<text x="360" y="65" fill="#94a3b8" font-size="10" font-weight="700" text-anchor="middle">ENTITIES (n × N_A)</text>';
    m += '<text x="360" y="82" fill="#f59e0b" font-size="14" font-weight="700" text-anchor="middle">' + particles.toFixed(3) + ' × 10²³</text>';
    m += '<line x1="360" y1="91" x2="360" y2="101" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 4"/>';

    // Right Node: STP Volume (L)
    m += '<rect x="520" y="115" width="160" height="80" rx="8" fill="#0f172a" stroke="#ec4899" stroke-width="2"/>';
    m += '<text x="600" y="145" fill="#94a3b8" font-size="11" font-weight="700" text-anchor="middle">GAS STP (n × 22.71 L)</text>';
    m += '<text x="600" y="175" fill="#ec4899" font-size="18" font-weight="700" text-anchor="middle">' + stpL.toFixed(1) + ' L</text>';
    m += '<line x1="414" y1="155" x2="520" y2="155" stroke="#ec4899" stroke-width="2" stroke-dasharray="4 4"/>';

    // Formula indicator
    m += '<text x="360" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">Compound: ' + formula + ' · Molar Mass = ' + molarMass + ' g mol⁻¹</text>';

    readout(
      cell("Amount (n)", mol.toFixed(2) + " mol", "#10b981") +
      cell("Mass", massG.toFixed(2) + " g", "#38bdf8") +
      cell("Entities", particles.toFixed(2) + " × 10²³", "#f59e0b") +
      cell("STP Volume", stpL.toFixed(1) + " L", "#ec4899")
    );

    verdict("<b>The Mole Bridge:</b> 1 mole contains exactly 6.022 × 10²³ elementary units. Weighing " + massG.toFixed(2) + " g on a laboratory balance counts out exactly " + particles.toFixed(2) + " × 10²³ molecules!");

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Empirical to Molecular Formula Analyzer (formulalab)
// -------------------------------------------------------------------------
window.SIMS.formulalab = (function(){
  var compound = "iron_oxide"; // "iron_oxide", "welding", "glucose"

  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Element 1 Mass %</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Element 2 Mass %</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Deductions</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-feox">NCERT Ex 1.3: Iron Oxide (Fe₂O₃)</button>' +
      '<button class="preset-btn" id="p-weld">NCERT Ex 1.34: Welding Gas (C₂H₂)</button>' +
      '<button class="preset-btn" id="p-gluc">Glucose (C₆H₁₂O₆)</button>';

    document.getElementById("p-feox").onclick = function(){ setActivePreset(this); compound = "iron_oxide"; draw(0); };
    document.getElementById("p-weld").onclick = function(){ setActivePreset(this); compound = "welding"; draw(0); };
    document.getElementById("p-gluc").onclick = function(){ setActivePreset(this); compound = "glucose"; draw(0); };

    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    var cName = "", pct1 = 0, pct2 = 0, el1 = "", el2 = "", emp = "", mol = "", nMult = 1, mm = 0;
    if(compound === "iron_oxide"){
      cName = "Iron Oxide (NCERT Ex 1.3 & 1.8)";
      el1 = "Iron (Fe)"; pct1 = 69.9;
      el2 = "Oxygen (O)"; pct2 = 30.1;
      emp = "Fe₂O₃"; mol = "Fe₂O₃"; nMult = 1; mm = 159.7;
    } else if(compound === "welding"){
      cName = "Welding Fuel Gas (NCERT Ex 1.34)";
      el1 = "Carbon (C)"; pct1 = 92.3;
      el2 = "Hydrogen (H)"; pct2 = 7.7;
      emp = "CH"; mol = "C₂H₂ (Acetylene)"; nMult = 2; mm = 26.0;
    } else {
      cName = "Glucose Sugar Molecule";
      el1 = "Carbon (C)"; pct1 = 40.0;
      el2 = "H + O"; pct2 = 60.0;
      emp = "CH₂O"; mol = "C₆H₁₂O₆"; nMult = 6; mm = 180.2;
    }

    m += '<text x="360" y="32" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">5-STEP FORMULA DEDUCTION WORKBENCH</text>';
    m += '<text x="360" y="52" fill="#94a3b8" font-size="12" text-anchor="middle">' + cName + '</text>';

    // Step Flow Cards
    var steps = [
      {title: "1. Mass % in 100g", desc: el1 + ": " + pct1 + "% | " + el2 + ": " + pct2 + "%"},
      {title: "2. Relative Moles", desc: "n = Mass / Atomic Weight"},
      {title: "3. Simplest Ratio", desc: "Divide by smallest mole value"},
      {title: "4. Empirical Formula", desc: emp},
      {title: "5. Molecular Formula", desc: mol + " (n=" + nMult + ")"}
    ];

    for(var i = 0; i < steps.length; i++){
      var st = steps[i];
      var x = 40 + i * 130;
      m += '<rect x="' + x + '" y="80" width="120" height="130" rx="8" fill="#0f172a" stroke="' + (i >= 3 ? "#10b981" : "#334155") + '" stroke-width="2"/>';
      m += '<text x="' + (x + 60) + '" y="105" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">STEP ' + (i + 1) + '</text>';
      m += '<text x="' + (x + 60) + '" y="130" fill="#f8fafc" font-size="10" font-weight="600" text-anchor="middle">' + st.title.split(". ")[1] + '</text>';
      m += '<text x="' + (x + 60) + '" y="165" fill="' + (i >= 3 ? "#34d399" : "#94a3b8") + '" font-size="12" font-weight="700" text-anchor="middle">' + st.desc + '</text>';
      if(i < steps.length - 1){
        m += '<text x="' + (x + 125) + '" y="150" fill="#475569" font-size="16" font-weight="700">→</text>';
      }
    }

    readout(
      cell("Empirical Formula", emp, "#38bdf8") +
      cell("Multiplier n", nMult, "#f59e0b") +
      cell("Molecular Formula", mol, "#34d399")
    );

    verdict("<b>Deduction Verified:</b> Empirical formula gives the simplest atomic ratio (" + emp + "). Dividing experimental molar mass (" + mm + " g/mol) by empirical formula mass gives integer multiplier <b>n = " + nMult + "</b>, revealing true molecular formula: <b>" + mol + "</b>.");

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Stoichiometric Reactor & Solution Concentration Lab (stoichiometrylab)
// -------------------------------------------------------------------------
window.SIMS.stoichiometrylab = (function(){
  var n2Mass = 2000; // g
  var h2Mass = 1000; // g
  var concMode = "solutions"; // "reactor", "solutions"

  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Reactant 1 (N₂)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Reactant 2 (H₂)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Product Yield (NH₃)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-haber">NCERT Ex 1.24: Haber Process (2 kg N₂ + 1 kg H₂)</button>' +
      '<button class="preset-btn" id="p-stoch">Perfect Stoichiometric Mix (2.8 kg N₂ + 0.6 kg H₂)</button>' +
      '<button class="preset-btn" id="p-conc">Solution Concentration Comparator (M vs m)</button>';

    document.getElementById("p-haber").onclick = function(){ setActivePreset(this); concMode = "reactor"; n2Mass = 2000; h2Mass = 1000; updateInputs(); draw(0); };
    document.getElementById("p-stoch").onclick = function(){ setActivePreset(this); concMode = "reactor"; n2Mass = 2802; h2Mass = 605; updateInputs(); draw(0); };
    document.getElementById("p-conc").onclick = function(){ setActivePreset(this); concMode = "solutions"; draw(0); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Dinitrogen Mass (g): <b id="n2-lbl">2000 g (2.0 kg)</b></label>' +
        '<input type="range" id="n2-slider" min="500" max="3000" value="2000" step="100">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Dihydrogen Mass (g): <b id="h2-lbl">1000 g (1.0 kg)</b></label>' +
        '<input type="range" id="h2-slider" min="200" max="1500" value="1000" step="50">' +
      '</div>';

    document.getElementById("n2-slider").oninput = function(e){
      n2Mass = parseFloat(e.target.value);
      document.getElementById("n2-lbl").textContent = n2Mass + " g (" + (n2Mass/1000).toFixed(1) + " kg)";
      draw(0);
    };
    document.getElementById("h2-slider").oninput = function(e){
      h2Mass = parseFloat(e.target.value);
      document.getElementById("h2-lbl").textContent = h2Mass + " g (" + (h2Mass/1000).toFixed(1) + " kg)";
      draw(0);
    };

    draw(0);
  }

  function updateInputs(){
    var s1 = document.getElementById("n2-slider"); if(s1) s1.value = n2Mass;
    var s2 = document.getElementById("h2-slider"); if(s2) s2.value = h2Mass;
    var l1 = document.getElementById("n2-lbl"); if(l1) l1.textContent = n2Mass + " g";
    var l2 = document.getElementById("h2-lbl"); if(l2) l2.textContent = h2Mass + " g";
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(concMode === "reactor"){
      m += '<text x="360" y="32" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">HABER PROCESS STOICHIOMETRIC REACTOR: N₂(g) + 3H₂(g) → 2NH₃(g)</text>';

      var molN2 = n2Mass / 28.02;
      var molH2 = h2Mass / 2.016;

      // Stoichiometric requirement: 1 N2 requires 3 H2
      var h2Needed = molN2 * 3;
      var limiting = "";
      var nh3Moles = 0;
      var excessGas = "";
      var excessGrams = 0;

      if(molH2 < h2Needed){
        limiting = "Dihydrogen (H₂)";
        nh3Moles = (molH2 / 3) * 2;
        excessGas = "Dinitrogen (N₂)";
        excessGrams = (molN2 - (molH2 / 3)) * 28.02;
      } else {
        limiting = "Dinitrogen (N₂)";
        nh3Moles = molN2 * 2;
        excessGas = "Dihydrogen (H₂)";
        excessGrams = (molH2 - h2Needed) * 2.016;
      }

      var nh3Mass = nh3Moles * 17.034;

      // Reactor Chamber Graphic
      m += '<rect x="80" y="60" width="560" height="170" rx="10" fill="#0f1f2e" stroke="#334155" stroke-width="2"/>';

      // Reactant 1 Feed
      m += '<rect x="110" y="80" width="140" height="130" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="180" y="105" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">FEED 1: N₂</text>';
      m += '<text x="180" y="135" fill="#ffffff" font-size="16" font-weight="700" text-anchor="middle">' + n2Mass + ' g</text>';
      m += '<text x="180" y="160" fill="#94a3b8" font-size="12" text-anchor="middle">' + molN2.toFixed(1) + ' mol</text>';
      if(limiting === "Dinitrogen (N₂)") m += '<rect x="120" y="175" width="120" height="24" rx="4" fill="#ef4444"/><text x="180" y="191" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">LIMITING REAGENT</text>';

      // Plus sign
      m += '<text x="280" y="150" fill="#64748b" font-size="24" font-weight="700">+</text>';

      // Reactant 2 Feed
      m += '<rect x="310" y="80" width="140" height="130" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="380" y="105" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">FEED 2: H₂</text>';
      m += '<text x="380" y="135" fill="#ffffff" font-size="16" font-weight="700" text-anchor="middle">' + h2Mass + ' g</text>';
      m += '<text x="380" y="160" fill="#94a3b8" font-size="12" text-anchor="middle">' + molH2.toFixed(1) + ' mol</text>';
      if(limiting === "Dihydrogen (H₂)") m += '<rect x="320" y="175" width="120" height="24" rx="4" fill="#ef4444"/><text x="380" y="191" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">LIMITING REAGENT</text>';

      // Arrow
      m += '<text x="475" y="150" fill="#64748b" font-size="24" font-weight="700">→</text>';

      // Output Tank
      m += '<rect x="500" y="80" width="120" height="130" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="560" y="105" fill="#10b981" font-size="13" font-weight="700" text-anchor="middle">YIELD: NH₃</text>';
      m += '<text x="560" y="135" fill="#ffffff" font-size="16" font-weight="700" text-anchor="middle">' + (nh3Mass / 1000).toFixed(2) + ' kg</text>';
      m += '<text x="560" y="160" fill="#a7f3d0" font-size="12" text-anchor="middle">' + nh3Moles.toFixed(1) + ' mol</text>';
      m += '<text x="560" y="190" fill="#6ee7b7" font-size="10" text-anchor="middle">Excess: ' + excessGrams.toFixed(0) + ' g ' + excessGas.split(" ")[0] + '</text>';

      readout(
        cell("Limiting Reagent", limiting, "#ef4444") +
        cell("Ammonia Yield", (nh3Mass / 1000).toFixed(2) + " kg (" + nh3Mass.toFixed(0) + " g)", "#34d399") +
        cell("Unreacted Excess", excessGrams.toFixed(1) + " g of " + excessGas, "#f59e0b")
      );

      verdict("<b>NCERT Ex 1.24 Solution:</b> 2000 g N₂ (71.38 mol) requires 214.1 mol H₂. Because 496.0 mol H₂ is supplied, <b>N₂ is the Limiting Reagent</b>. The reaction terminates once N₂ is depleted, yielding <b>2.43 kg NH₃</b> with <b>568 g H₂ remaining unreacted</b>.");
    } else {
      m += '<text x="360" y="32" fill="#10b981" font-size="15" font-weight="700" text-anchor="middle">SOLUTION CONCENTRATION METRICS: TEMPERATURE DEPENDENCE</text>';

      // Side-by-side comparison of Molarity vs Molality
      m += '<rect x="80" y="70" width="260" height="160" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="210" y="100" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">MOLARITY (M)</text>';
      m += '<text x="210" y="130" fill="#ffffff" font-size="13" text-anchor="middle">Moles of solute / Litre of Solution</text>';
      m += '<rect x="100" y="150" width="220" height="30" rx="4" fill="#450a0a"/>';
      m += '<text x="210" y="170" fill="#fca5a5" font-size="11" font-weight="700" text-anchor="middle">CHANGES WITH TEMPERATURE ⚠</text>';
      m += '<text x="210" y="210" fill="#94a3b8" font-size="11" text-anchor="middle">Liquids thermally expand; volume increases</text>';

      m += '<rect x="380" y="70" width="260" height="160" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>';
      m += '<text x="510" y="100" fill="#10b981" font-size="15" font-weight="700" text-anchor="middle">MOLALITY (m)</text>';
      m += '<text x="510" y="130" fill="#ffffff" font-size="13" text-anchor="middle">Moles of solute / kg of Solvent</text>';
      m += '<rect x="400" y="150" width="220" height="30" rx="4" fill="#064e3b"/>';
      m += '<text x="510" y="170" fill="#86efac" font-size="11" font-weight="700" text-anchor="middle">TEMPERATURE INDEPENDENT ✓</text>';
      m += '<text x="510" y="210" fill="#94a3b8" font-size="11" text-anchor="middle">Mass is invariant with thermal changes</text>';

      readout(
        cell("Molarity (M)", "mol L⁻¹", "#38bdf8") +
        cell("Molality (m)", "mol kg⁻¹", "#10b981") +
        cell("Preferred for T-study", "Molality", "#34d399")
      );
      verdict("<b>Physical Principle:</b> Molality (m) and Mole Fraction (x) rely purely on mass, making them immune to thermal expansion or contraction. Molarity (M) varies with temperature because liquid solution volume expands when heated.");
    }

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();
