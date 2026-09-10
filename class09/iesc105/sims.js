var App = window.App;
window.SIMS = {};

function setActivePreset(btn){
  document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
  if(btn) btn.classList.add("active");
}

// =========================================================================
// 1. SIMULATION 1: Mixture Classification Bench (lab_mixtures)
// =========================================================================
(function(){
  var simState = {
    type: "solution" // "solution", "colloid", "suspension"
  };

  function mount(lesson){
    simState.type = "solution";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Solute Particle Size</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Filter Paper Permeability</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Phase Uniformity</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p1-sol">True Solution: Salt in Water (< 1 nm)</button>' +
      '<button class="preset-btn" id="p1-col">Colloid: Milk / Blood (1–1000 nm)</button>' +
      '<button class="preset-btn" id="p1-sus">Suspension: Muddy Sand (> 1000 nm - Settles!)</button>';

    document.getElementById("p1-sol").addEventListener("click", function(){
      setActivePreset(this);
      simState.type = "solution";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> True solution: Sub-nanometre particles (< 1 nm) are completely invisible, homogeneous, and never settle.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-col").addEventListener("click", function(){
      setActivePreset(this);
      simState.type = "colloid";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Colloid: Intermediate clusters (1–1000 nm) stay suspended indefinitely via continuous Brownian motion!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-sus").addEventListener("click", function(){
      setActivePreset(this);
      simState.type = "suspension";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Suspension: Macroscopic particles (> 1000 nm) precipitate under gravity and settle to the bottom over time!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Glass Beaker
    svg += '<rect x="180" y="70" width="160" height="150" fill="#0284c7" fill-opacity="0.1" stroke="#38bdf8" stroke-width="3" rx="6"/>';
    svg += '<line x1="180" y1="100" x2="340" y2="100" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4,4"/>';

    // Particles inside beaker
    if(simState.type === "solution"){
      // Tiny invisible sub-nm dots
      for(var i = 0; i < 40; i++){
        var px = 195 + (i * 17) % 130;
        var py = 110 + (i * 23) % 95;
        svg += '<circle cx="' + px + '" cy="' + py + '" r="1.5" fill="#38bdf8" opacity="0.5"/>';
      }
    } else if(simState.type === "colloid"){
      // Medium colloidal globules (jittering)
      for(var j = 0; j < 25; j++){
        var jx = 200 + (j * 23 + Math.sin(t * 5 + j) * 4) % 120;
        var jy = 115 + (j * 19 + Math.cos(t * 4 + j) * 4) % 90;
        svg += '<circle cx="' + jx + '" cy="' + jy + '" r="4" fill="#fbbf24" opacity="0.8"/>';
      }
    } else {
      // Suspension: particles sink over time t
      var settleFrac = Math.min(1.0, t / 4.0);
      for(var k = 0; k < 30; k++){
        var kx = 190 + (k * 19) % 140;
        var startY = 110 + (k * 13) % 70;
        var finalY = 205 + (k % 4) * 3;
        var ky = startY + settleFrac * (finalY - startY);
        svg += '<circle cx="' + kx + '" cy="' + ky + '" r="5.5" fill="#d97706"/>';
      }
    }

    // Microscopic Magnification Window (Right Side)
    svg += '<circle cx="520" cy="145" r="75" fill="#1e293b" stroke="#94a3b8" stroke-width="4"/>';
    svg += '<text x="520" y="55" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">MICROSCOPIC VIEW (1,000,000×)</text>';

    if(simState.type === "solution"){
      svg += '<circle cx="520" cy="145" r="4" fill="#38bdf8"/>';
      svg += '<text x="520" y="170" fill="#38bdf8" font-size="11" text-anchor="middle">Na⁺ / Cl⁻ (&lt; 1 nm)</text>';
    } else if(simState.type === "colloid"){
      svg += '<circle cx="520" cy="145" r="28" fill="#fbbf24" opacity="0.7"/>';
      svg += '<text x="520" y="190" fill="#fbbf24" font-size="11" text-anchor="middle">Fat Globule (100 nm)</text>';
    } else {
      svg += '<circle cx="520" cy="145" r="55" fill="#d97706"/>';
      svg += '<text x="520" y="215" fill="#d97706" font-size="11" text-anchor="middle">Sand Grain (&gt; 1000 nm)</text>';
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    var sizeStr = simState.type === "solution" ? "< 1 nm" : (simState.type === "colloid" ? "1 – 1000 nm" : "> 1000 nm");
    var stableStr = simState.type === "suspension" ? "UNSTABLE (Settles down)" : "STABLE (Does not settle)";

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Mixture Type</span><span class="v">' + simState.type.toUpperCase() + '</span></div>' +
      '<div class="metric"><span class="k">Particle Diameter</span><span class="v" style="color:#38bdf8">' + sizeStr + '</span></div>' +
      '<div class="metric"><span class="k">Stability</span><span class="v" style="color:#fbbf24">' + stableStr + '</span></div>' +
      '<div class="metric"><span class="k">Filterability</span><span class="v">' + (simState.type === "suspension" ? 'Separated by Paper' : 'Passes Paper') + '</span></div>';

    document.getElementById("lab-verdict").innerHTML = simState.type === "solution"
      ? "<strong>True Solution:</strong> Particles < 1 nm are dissolved down to individual ions. Completely transparent, stable, passes through filter paper with no Tyndall scattering."
      : (simState.type === "colloid"
        ? "<strong>Colloid (Milk / Blood):</strong> Intermediate clusters (1–1000 nm) scatter light (Tyndall effect) but stay permanently suspended via Brownian motion."
        : "<strong>Suspension (Muddy Water):</strong> Large particles > 1000 nm settle out under gravity. Can be cleanly separated by normal filter paper.");
  }

  window.SIMS.lab_mixtures = { mount: mount, draw: draw };
})();

// =========================================================================
// 2. SIMULATION 2: Solution Concentration Lab (lab_concentration)
// =========================================================================
(function(){
  var simState = {
    soluteG: 20,
    solventG: 80
  };

  function mount(lesson){
    simState.soluteG = 20; simState.solventG = 80;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Dissolved Sugar Solute (g)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Water Solvent (g)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Mass % Concentration</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p2-a">NCERT Ex 14: Student A (20g in 80g water &rarr; 20.0%)</button>' +
      '<button class="preset-btn" id="p2-b">Student B (20g in 100g water &rarr; 16.67%)</button>' +
      '<button class="preset-btn" id="p2-c">Student C (30g in 80g water &rarr; 27.27% - Most Concentrated!)</button>';

    document.getElementById("p2-a").addEventListener("click", function(){
      setActivePreset(this);
      simState.soluteG = 20; simState.solventG = 80;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Total mass = 20 + 80 = 100 g. Concentration is exactly (20/100) × 100 = 20.0% m/m.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-b").addEventListener("click", function(){
      setActivePreset(this);
      simState.soluteG = 20; simState.solventG = 100;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> More water dilutes the solution: 20 g / 120 g = 16.67% m/m.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-c").addEventListener("click", function(){
      setActivePreset(this);
      simState.soluteG = 30; simState.solventG = 80;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Student C has the highest solute ratio: 30 g / 110 g = 27.27% m/m!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var totalMass = simState.soluteG + simState.solventG;
    var massPct = (simState.soluteG / totalMass) * 100;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Beaker with Solution
    svg += '<rect x="160" y="80" width="180" height="150" fill="#0284c7" fill-opacity="' + (0.15 + (massPct/100)*0.5) + '" stroke="#38bdf8" stroke-width="3" rx="6"/>';
    svg += '<text x="250" y="160" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">Sugar Solution</text>';
    svg += '<text x="250" y="185" fill="#cbd5e1" font-size="12" text-anchor="middle">' + totalMass + ' g total mass</text>';

    // Breakdown Bar Chart (Right side)
    var barX = 420;
    svg += '<text x="' + barX + '" y="70" fill="#94a3b8" font-size="12" font-weight="bold">MASS COMPOSITION BREAKDOWN</text>';

    // Solute bar
    var soluteW = (simState.soluteG / totalMass) * 240;
    svg += '<text x="' + barX + '" y="105" fill="#f59e0b" font-size="12">Solute Sugar: ' + simState.soluteG + ' g (' + massPct.toFixed(1) + '%)</text>';
    svg += '<rect x="' + barX + '" y="115" width="' + soluteW + '" height="22" fill="#f59e0b" rx="4"/>';

    // Solvent bar
    var solventW = (simState.solventG / totalMass) * 240;
    svg += '<text x="' + barX + '" y="165" fill="#38bdf8" font-size="12">Solvent Water: ' + simState.solventG + ' g (' + (100 - massPct).toFixed(1) + '%)</text>';
    svg += '<rect x="' + barX + '" y="175" width="' + solventW + '" height="22" fill="#38bdf8" rx="4"/>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Solute Mass</span><span class="v">' + simState.soluteG + ' g</span></div>' +
      '<div class="metric"><span class="k">Solvent Mass</span><span class="v">' + simState.solventG + ' g</span></div>' +
      '<div class="metric"><span class="k">Total Solution</span><span class="v">' + totalMass + ' g</span></div>' +
      '<div class="metric"><span class="k">Mass % (m/m)</span><span class="v" style="color:#10b981">' + massPct.toFixed(2) + '%</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Mass Percentage Formula:</strong> Mass % = (Mass of Solute / Total Mass of Solution) × 100 = (" + simState.soluteG + " / " + totalMass + ") × 100 = " + massPct.toFixed(2) + "% m/m.";
  }

  window.SIMS.lab_concentration = { mount: mount, draw: draw };
})();

// =========================================================================
// 3. SIMULATION 3: Solubility & Cooling Crystals (lab_solubility)
// =========================================================================
(function(){
  var simState = {
    salt: "kno3", // "kno3", "nacl", "kcl"
    temp: 40
  };

  var tableData = {
    kno3: { name: "Potassium Nitrate (KNO₃)", s: { 10: 21, 20: 32, 40: 62, 80: 167 } },
    nacl: { name: "Sodium Chloride (NaCl)", s: { 10: 36, 20: 36, 40: 36.5, 80: 37 } },
    kcl:  { name: "Potassium Chloride (KCl)", s: { 10: 35, 20: 35, 40: 40, 80: 54 } }
  };

  function mount(lesson){
    simState.salt = "kno3"; simState.temp = 40;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Solubility (g/100g water)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Precipitated Crystals upon Cooling</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Temperature (°C)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p3-kno3">NCERT Ex 13(i): KNO₃ at 40°C (62 g/100g &rarr; 31 g in 50g water)</button>' +
      '<button class="preset-btn" id="p3-kcl">NCERT Ex 13(ii): KCl Cooling from 80°C to 25°C (18 g Crystals)</button>' +
      '<button class="preset-btn" id="p3-nacl">NaCl Flat Curve (36 g &rarr; 37 g)</button>';

    document.getElementById("p3-kno3").addEventListener("click", function(){
      setActivePreset(this);
      simState.salt = "kno3"; simState.temp = 40;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> In 100 g water, 62 g KNO₃ dissolves. In 50 g water, exactly 31 g dissolves.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-kcl").addEventListener("click", function(){
      setActivePreset(this);
      simState.salt = "kcl"; simState.temp = 80;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> As hot solution cools from 80°C (54 g) to 25°C (36 g), 18 g of KCl crystallizes out!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-nacl").addEventListener("click", function(){
      setActivePreset(this);
      simState.salt = "nacl"; simState.temp = 40;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Common salt solubility is almost completely flat across all temperatures (36 g to 37 g).";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var saltObj = tableData[simState.salt];
    var currentT = simState.temp - (simState.salt === "kcl" ? (t / 5.0) * 55 : 0);
    if(currentT < 25) currentT = 25;

    // Approximate solubility
    var solVal = 0;
    if(simState.salt === "kno3"){
      solVal = 21 + (currentT - 10) * 2.08;
    } else if(simState.salt === "kcl"){
      solVal = 35 + (currentT - 10) * 0.27;
    } else {
      solVal = 36 + (currentT - 10) * 0.014;
    }

    var crystals = 0;
    if(simState.salt === "kcl" && currentT < 80){
      crystals = Math.max(0, 54 - solVal);
    }

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Solubility Graph (Left)
    svg += '<line x1="80" y1="220" x2="380" y2="220" stroke="#475569" stroke-width="2"/>';
    svg += '<line x1="80" y1="220" x2="80" y2="40" stroke="#475569" stroke-width="2"/>';
    svg += '<text x="380" y="240" fill="#94a3b8" font-size="11">Temperature (°C) &rarr;</text>';
    svg += '<text x="85" y="50" fill="#94a3b8" font-size="11">Solubility (g/100g) &rarr;</text>';

    // Curve
    svg += '<path d="M 80 200 Q 200 160 360 60" fill="none" stroke="#38bdf8" stroke-width="3"/>';
    svg += '<circle cx="' + (80 + currentT * 3.5) + '" cy="' + (220 - solVal * 0.9) + '" r="6" fill="#fbbf24"/>';

    // Beaker with Crystal Formation (Right)
    svg += '<rect x="460" y="80" width="160" height="140" fill="#0284c7" fill-opacity="0.15" stroke="#38bdf8" stroke-width="3" rx="6"/>';
    svg += '<text x="540" y="110" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">Saturated Solution</text>';
    svg += '<text x="540" y="130" fill="#38bdf8" font-size="12" text-anchor="middle">T = ' + currentT.toFixed(0) + '°C</text>';

    if(crystals > 0){
      for(var c = 0; c < Math.min(30, Math.floor(crystals * 1.5)); c++){
        var cx = 480 + (c * 17) % 120;
        var cy = 205 - (c % 3) * 6;
        svg += '<polygon points="' + cx + ',' + cy + ' ' + (cx + 5) + ',' + (cy - 6) + ' ' + (cx + 10) + ',' + cy + '" fill="#fbbf24"/>';
      }
      svg += '<text x="540" y="180" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">' + crystals.toFixed(1) + ' g Crystals</text>';
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Salt</span><span class="v">' + simState.salt.toUpperCase() + '</span></div>' +
      '<div class="metric"><span class="k">Temperature</span><span class="v">' + currentT.toFixed(0) + '°C</span></div>' +
      '<div class="metric"><span class="k">Solubility</span><span class="v" style="color:#38bdf8">' + solVal.toFixed(1) + ' g/100g</span></div>' +
      '<div class="metric"><span class="k">Crystals Formed</span><span class="v" style="color:#fbbf24">' + crystals.toFixed(1) + ' g</span></div>';

    document.getElementById("lab-verdict").innerHTML = crystals > 0
      ? "<strong>Precipitation upon Cooling (NCERT Ex 13):</strong> When cooled from 80°C to " + currentT.toFixed(0) + "°C, water can no longer dissolve the excess salt. Exactly " + crystals.toFixed(1) + " g of pure crystals precipitate out!"
      : "<strong>Saturated Solution:</strong> At " + currentT.toFixed(0) + "°C, 100 g of water dissolves a maximum of " + solVal.toFixed(1) + " g of " + saltObj.name + ".";
  }

  window.SIMS.lab_solubility = { mount: mount, draw: draw };
})();

// =========================================================================
// 4. SIMULATION 4: Tyndall Effect Laser Bench (lab_tyndall)
// =========================================================================
(function(){
  var simState = {
    beaker: "colloid" // "solution", "colloid", "suspension"
  };

  function mount(lesson){
    simState.beaker = "colloid";
    App.state.maxT = 4.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 4.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Red Laser Beam Path</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Colloidal Light Scattering</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>True Solution (Zero Path Visibility)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p4-colloid">Colloid: Starch / Dilute Milk (Glowing Beam Path!)</button>' +
      '<button class="preset-btn" id="p4-solution">True Solution: Copper Sulfate (Invisible Beam Path)</button>' +
      '<button class="preset-btn" id="p4-dust">Aerosol: Air with Dust Particles (NCERT Ex 2)</button>';

    document.getElementById("p4-colloid").addEventListener("click", function(){
      setActivePreset(this);
      simState.beaker = "colloid";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Tyndall Effect: Colloidal particles (1–1000 nm) scatter red laser light in all directions, making the beam path brightly visible!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-solution").addEventListener("click", function(){
      setActivePreset(this);
      simState.beaker = "solution";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> True solution: Solute ions (< 1 nm) are too small to scatter light. The laser beam travels through invisibly!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-dust").addEventListener("click", function(){
      setActivePreset(this);
      simState.beaker = "colloid";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> NCERT Ex 2: Airborne dust particles scatter light rays, producing visible sunbeams.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var isTyndall = simState.beaker !== "solution";

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Laser Source at left
    svg += '<rect x="60" y="130" width="60" height="25" fill="#334155" stroke="#ef4444" stroke-width="2" rx="3"/>';
    svg += '<circle cx="120" cy="142" r="4" fill="#ef4444"/>';
    svg += '<text x="90" y="147" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">LASER</text>';

    // Air beam to beaker
    svg += '<line x1="120" y1="142" x2="260" y2="142" stroke="#ef4444" stroke-width="2"/>';

    // Glass Beaker
    svg += '<rect x="260" y="70" width="200" height="150" fill="#0284c7" fill-opacity="0.1" stroke="#38bdf8" stroke-width="3" rx="6"/>';
    svg += '<text x="360" y="100" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">' + (isTyndall ? 'Colloid / Starch Solution' : 'True CuSO₄ Solution') + '</text>';

    // Inside beaker beam path
    if(isTyndall){
      svg += '<line x1="260" y1="142" x2="460" y2="142" stroke="#ef4444" stroke-width="6" opacity="0.9"/>';
      svg += '<rect x="260" y="132" width="200" height="20" fill="#ef4444" fill-opacity="0.3"/>';
      // Scattered light cones
      for(var s = 280; s <= 440; s += 30){
        svg += '<line x1="' + s + '" y1="142" x2="' + (s - 15) + '" y2="115" stroke="#fbbf24" stroke-width="1.5" opacity="0.6"/>';
        svg += '<line x1="' + s + '" y1="142" x2="' + (s + 15) + '" y2="170" stroke="#fbbf24" stroke-width="1.5" opacity="0.6"/>';
      }
    } else {
      // Invisible in true solution, faint line only
      svg += '<line x1="260" y1="142" x2="460" y2="142" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,4" opacity="0.2"/>';
    }

    // Exiting beam
    svg += '<line x1="460" y1="142" x2="620" y2="142" stroke="#ef4444" stroke-width="2"/>';
    // Red dot on screen
    svg += '<rect x="620" y="100" width="15" height="85" fill="#475569" rx="2"/>';
    svg += '<circle cx="620" cy="142" r="5" fill="#ef4444"/>';
    svg += '<text x="645" y="146" fill="#94a3b8" font-size="11">Screen</text>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Sample Tested</span><span class="v">' + (isTyndall ? 'Colloid / Aerosol' : 'True Solution') + '</span></div>' +
      '<div class="metric"><span class="k">Particle Size</span><span class="v">' + (isTyndall ? '1 – 1000 nm' : '< 1 nm') + '</span></div>' +
      '<div class="metric"><span class="k">Beam Visibility</span><span class="v" style="color:' + (isTyndall ? '#ef4444' : '#64748b') + '">' + (isTyndall ? 'ILLUMINATED PATH' : 'INVISIBLE PATH') + '</span></div>' +
      '<div class="metric"><span class="k">Tyndall Effect</span><span class="v" style="color:' + (isTyndall ? '#10b981' : '#f43f5e') + '">' + (isTyndall ? 'POSITIVE (Observed)' : 'NEGATIVE (None)') + '</span></div>';

    document.getElementById("lab-verdict").innerHTML = isTyndall
      ? "<strong>Tyndall Effect Observed:</strong> Colloidal particles scatter light in all directions, making the laser path glow brightly through the liquid."
      : "<strong>No Tyndall Effect (True Solution):</strong> Individual dissolved ions (< 1 nm) are far smaller than light wavelengths and cannot scatter light. The path is completely invisible.";
  }

  window.SIMS.lab_tyndall = { mount: mount, draw: draw };
})();

// =========================================================================
// 5. SIMULATION 5: Separating Funnel & Sublimation (lab_funnel_sublimation)
// =========================================================================
(function(){
  var simState = {
    mode: "funnel", // "funnel" or "sublimation"
    stopcockOpen: false,
    drained: 0
  };

  function mount(lesson){
    simState.mode = "funnel"; simState.stopcockOpen = false; simState.drained = 0;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Upper Oil Layer (0.91 g/mL)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Lower Water Layer (1.00 g/mL)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Stopcock Control Valve</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p5-funnel">NCERT Ex 5: Separating Funnel (Oil on Top of Water)</button>' +
      '<button class="preset-btn" id="p5-drain">Drain Water Layer (Open Stopcock)</button>' +
      '<button class="preset-btn" id="p5-sublime">NCERT Ex 11: Sublimation of Naphthalene from Sand</button>';

    document.getElementById("p5-funnel").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "funnel"; simState.stopcockOpen = false; simState.drained = 0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Oil floats on top (0.91 g/mL < 1.0 g/mL). Water forms bottom layer.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-drain").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "funnel"; simState.stopcockOpen = true;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Water drains cleanly into beaker below. Close stopcock as oil boundary reaches valve!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-sublime").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "sublimation";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Heating vaporizes naphthalene directly to gas, which crystallizes on cool inverted funnel walls!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    if(simState.mode === "sublimation"){
      // Sublimation Apparatus
      svg += '<rect x="260" y="210" width="200" height="15" fill="#475569" rx="3"/>'; // wire gauze
      svg += '<polygon points="340,240 380,240 360,215" fill="#ef4444"/>'; // burner flame
      svg += '<text x="360" y="260" fill="#ef4444" font-size="11" text-anchor="middle">Burner Heat</text>';

      // China dish
      svg += '<path d="M 280 210 Q 360 225 440 210 Z" fill="#e2e8f0"/>';
      svg += '<text x="360" y="205" fill="#64748b" font-size="10" text-anchor="middle">Sand + Salt</text>';

      // Inverted glass funnel
      svg += '<polygon points="360,60 290,205 430,205" fill="#0284c7" fill-opacity="0.1" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<rect x="355" y="45" width="10" height="25" fill="#64748b"/>'; // cotton plug
      svg += '<text x="360" y="40" fill="#94a3b8" font-size="10" text-anchor="middle">Cotton Plug</text>';

      // Naphthalene crystals deposited inside funnel
      for(var n = 0; n < 16; n++){
        var nx = 315 + (n * 13) % 90;
        var ny = 100 + (n * 17) % 80;
        svg += '<polygon points="' + nx + ',' + ny + ' ' + (nx + 4) + ',' + (ny - 5) + ' ' + (nx + 8) + ',' + ny + '" fill="#fbbf24"/>';
      }
      svg += '<text x="460" y="120" fill="#fbbf24" font-size="11" font-weight="bold">Pure Naphthalene Crystals</text>';
    } else {
      // Separating Funnel
      var drainH = simState.stopcockOpen ? Math.min(60, t * 15) : 0;

      // Stand
      svg += '<line x1="240" y1="40" x2="240" y2="240" stroke="#64748b" stroke-width="6"/>';
      svg += '<rect x="220" y="240" width="120" height="15" fill="#64748b" rx="3"/>';

      // Funnel Body
      svg += '<path d="M 330 60 C 330 110 300 130 300 170 L 300 195 L 310 195 L 310 170 C 310 130 380 110 380 60 Z" fill="#0284c7" fill-opacity="0.1" stroke="#38bdf8" stroke-width="2"/>';

      // Top Oil Layer
      svg += '<rect x="325" y="65" width="60" height="35" fill="#f59e0b" fill-opacity="0.8" rx="3"/>';
      svg += '<text x="355" y="86" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Oil (0.91 g/mL)</text>';

      // Lower Water Layer (Shrinks if drained)
      var waterH = Math.max(0, 50 - drainH);
      svg += '<path d="M 320 ' + (100 + drainH) + ' L 390 ' + (100 + drainH) + ' L 375 135 L 335 135 Z" fill="#0284c7" fill-opacity="0.8"/>';
      svg += '<text x="355" y="125" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Water (1.0 g/mL)</text>';

      // Stopcock Tap
      svg += '<rect x="295" y="175" width="20" height="8" fill="#10b981" rx="2"/>';

      // Receiving Beaker below
      svg += '<rect x="325" y="210" width="60" height="40" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2" rx="3"/>';
      if(drainH > 0){
        svg += '<rect x="327" y="' + (250 - drainH * 0.5) + '" width="56" height="' + (drainH * 0.5) + '" fill="#0284c7" opacity="0.8"/>';
      }
      svg += '<text x="355" y="235" fill="#94a3b8" font-size="10" text-anchor="middle">Beaker</text>';
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Apparatus</span><span class="v">' + (simState.mode === "funnel" ? 'Separating Funnel' : 'Sublimation Dish') + '</span></div>' +
      '<div class="metric"><span class="k">Upper Layer</span><span class="v" style="color:#f59e0b">' + (simState.mode === "funnel" ? 'Oil (0.91 g/mL)' : 'Vapour Crystals') + '</span></div>' +
      '<div class="metric"><span class="k">Lower Layer</span><span class="v" style="color:#38bdf8">' + (simState.mode === "funnel" ? 'Water (1.00 g/mL)' : 'Sand + Salt') + '</span></div>' +
      '<div class="metric"><span class="k">State</span><span class="v">' + (simState.stopcockOpen ? 'DRAINING' : 'SEPARATED') + '</span></div>';

    document.getElementById("lab-verdict").innerHTML = simState.mode === "funnel"
      ? "<strong>Density Separation:</strong> Cooking oil (0.91 g/mL) floats on water (1.00 g/mL). Opening the stopcock drains the pure water out from the bottom."
      : "<strong>Sublimation Principle:</strong> Heating sublimes naphthalene directly into vapour, which condenses as pure crystals on the cool funnel wall, leaving sand and salt behind.";
  }

  window.SIMS.lab_funnel_sublimation = { mount: mount, draw: draw };
})();

// =========================================================================
// 6. SIMULATION 6: Simple & Fractional Distillation (lab_distillation)
// =========================================================================
(function(){
  var simState = {
    type: "simple", // "simple" or "fractional"
    temp: 56
  };

  function mount(lesson){
    simState.type = "simple"; simState.temp = 56;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Distillation Boiling Flask</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Liebig Water Condenser</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Pure Condensed Distillate</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p6-simple">Simple Distillation: Acetone (56°C) & Water (100°C) [Δ = 44°C]</button>' +
      '<button class="preset-btn" id="p6-fract">Fractional Distillation: Acetone (56°C) & Alcohol (78°C) [Δ = 22°C]</button>' +
      '<button class="preset-btn" id="p6-ex8">NCERT Ex 8: Liquid A (60°C) & Liquid B (90°C) [Δ = 30°C]</button>';

    document.getElementById("p6-simple").addEventListener("click", function(){
      setActivePreset(this);
      simState.type = "simple"; simState.temp = 56;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> ΔBP = 44°C > 25°C. Simple distillation boils acetone off cleanly at 56°C into the condenser.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-fract").addEventListener("click", function(){
      setActivePreset(this);
      simState.type = "fractional"; simState.temp = 56;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> ΔBP = 22°C < 25°C. Fractionating column with glass beads creates repeated condensation plates!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-ex8").addEventListener("click", function(){
      setActivePreset(this);
      simState.type = "simple"; simState.temp = 60;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> NCERT Ex 8: ΔBP = 30°C > 25°C. Simple distillation cleanly separates Liquid A at 60°C.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Burner
    svg += '<polygon points="140,240 180,240 160,215" fill="#ef4444"/>';
    svg += '<rect x="110" y="210" width="100" height="8" fill="#64748b" rx="2"/>';

    // Distillation Flask (Round bottom)
    svg += '<circle cx="160" cy="170" r="35" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2"/>';
    svg += '<rect x="153" y="100" width="14" height="45" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2"/>';
    svg += '<text x="160" y="175" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Flask</text>';

    // Fractionating Column if fractional
    if(simState.type === "fractional"){
      svg += '<rect x="150" y="55" width="20" height="50" fill="#334155" stroke="#fbbf24" stroke-width="2"/>';
      for(var b = 60; b <= 100; b += 8){
        svg += '<circle cx="160" cy="' + b + '" r="3" fill="#fbbf24"/>';
      }
      svg += '<text x="125" y="75" fill="#fbbf24" font-size="9" text-anchor="end">Beads Column</text>';
    }

    // Thermometer
    svg += '<line x1="160" y1="40" x2="160" y2="105" stroke="#ef4444" stroke-width="3"/>';
    svg += '<text x="180" y="50" fill="#ef4444" font-size="11" font-weight="bold">' + simState.temp + '°C</text>';

    // Condenser (Angle downward)
    svg += '<line x1="170" y1="110" x2="440" y2="190" stroke="#10b981" stroke-width="14" stroke-linecap="round"/>';
    svg += '<line x1="170" y1="110" x2="440" y2="190" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>';
    svg += '<text x="310" y="135" fill="#10b981" font-size="11" font-weight="bold">Liebig Condenser</text>';

    // Collection Flask at right
    svg += '<polygon points="440,200 420,245 470,245 450,200" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2"/>';
    svg += '<text x="445" y="235" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">Distillate</text>';

    // Vapour and droplets animation
    var dropFrac = (t * 2) % 1.0;
    var dX = 170 + dropFrac * (440 - 170);
    var dY = 110 + dropFrac * (190 - 110);
    svg += '<circle cx="' + dX + '" cy="' + dY + '" r="3.5" fill="#fbbf24"/>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Distillation Mode</span><span class="v">' + simState.type.toUpperCase() + '</span></div>' +
      '<div class="metric"><span class="k">Thermometer</span><span class="v" style="color:#ef4444">' + simState.temp + '°C</span></div>' +
      '<div class="metric"><span class="k">Distilling Component</span><span class="v" style="color:#fbbf24">' + (simState.temp <= 56 ? 'Acetone' : 'Liquid A') + '</span></div>' +
      '<div class="metric"><span class="k">Condenser Efficiency</span><span class="v">100% Liquefaction</span></div>';

    document.getElementById("lab-verdict").innerHTML = simState.type === "fractional"
      ? "<strong>Fractional Distillation (ΔBP < 25°C):</strong> The fractionating column packed with glass beads provides repeated condensation and revaporization, separating liquids with close boiling points."
      : "<strong>Simple Distillation (ΔBP > 25°C):</strong> Large boiling point difference allows the lower-boiling component to boil off cleanly without carrying the other liquid.";
  }

  window.SIMS.lab_distillation = { mount: mount, draw: draw };
})();

// =========================================================================
// 7. SIMULATION 7: Paper Chromatography (lab_chromatography)
// =========================================================================
(function(){
  var simState = {
    ink: "black"
  };

  function mount(lesson){
    simState.ink = "black";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ascending Solvent Front</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Fast-Moving Dye (Higher Solubility)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Slow-Moving Dye (Stronger Adsorption)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p7-black">Black Ink Strip (Separates into Red, Yellow, Blue)</button>' +
      '<button class="preset-btn" id="p7-chlorophyll">Green Leaf Chlorophyll Extract (Chlorophyll a, b, Carotene)</button>' +
      '<button class="preset-btn" id="p7-rf">Calculate Retention Factor (Rf = d_solute / d_front)</button>';

    document.getElementById("p7-black").addEventListener("click", function(){
      setActivePreset(this);
      simState.ink = "black";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Water rises via capillary action. Highly soluble dyes travel faster and higher up the paper strip!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-chlorophyll").addEventListener("click", function(){
      setActivePreset(this);
      simState.ink = "leaf";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Leaf extract separates into blue-green chlorophyll a, yellow-green chlorophyll b, and yellow xanthophylls.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-rf").addEventListener("click", function(){
      setActivePreset(this);
      simState.ink = "black";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Measure Rf values: Ratio of distance travelled by dye spot to distance travelled by solvent front.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var frac = Math.min(1.0, t / 4.5);
    var solventH = frac * 140;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Glass Chromatography Chamber Jar
    svg += '<rect x="260" y="40" width="200" height="210" fill="#0284c7" fill-opacity="0.05" stroke="#38bdf8" stroke-width="2" rx="6"/>';

    // Solvent pool at bottom
    svg += '<rect x="262" y="230" width="196" height="18" fill="#0284c7" opacity="0.6"/>';
    svg += '<text x="360" y="243" fill="#fff" font-size="10" text-anchor="middle">Water Solvent</text>';

    // Filter paper strip
    svg += '<rect x="330" y="55" width="60" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>';
    svg += '<line x1="330" y1="215" x2="390" y2="215" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2"/>';
    svg += '<text x="320" y="218" fill="#94a3b8" font-size="9" text-anchor="end">Pencil Line</text>';

    // Solvent front
    var frontY = 215 - solventH;
    svg += '<line x1="330" y1="' + frontY + '" x2="390" y2="' + frontY + '" stroke="#38bdf8" stroke-width="2"/>';
    svg += '<text x="400" y="' + (frontY + 3) + '" fill="#38bdf8" font-size="10">Solvent Front</text>';

    // Separated Dye Bands
    if(solventH > 10){
      // Dye 1 (Fastest, e.g. Red, Rf = 0.8)
      var d1Y = 215 - solventH * 0.8;
      svg += '<circle cx="360" cy="' + d1Y + '" r="5" fill="#ef4444"/>';

      // Dye 2 (Medium, e.g. Yellow, Rf = 0.5)
      var d2Y = 215 - solventH * 0.5;
      svg += '<circle cx="360" cy="' + d2Y + '" r="5" fill="#eab308"/>';

      // Dye 3 (Slowest, e.g. Blue, Rf = 0.25)
      var d3Y = 215 - solventH * 0.25;
      svg += '<circle cx="360" cy="' + d3Y + '" r="5" fill="#3b82f6"/>';
    } else {
      // Original ink spot
      svg += '<circle cx="360" cy="215" r="4" fill="#0f172a"/>';
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    var rfRed = 0.80, rfYellow = 0.50, rfBlue = 0.25;
    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Solvent Rise</span><span class="v">' + (solventH / 14).toFixed(1) + ' cm</span></div>' +
      '<div class="metric"><span class="k">Red Dye (Rf)</span><span class="v" style="color:#ef4444">' + rfRed.toFixed(2) + '</span></div>' +
      '<div class="metric"><span class="k">Yellow Dye (Rf)</span><span class="v" style="color:#eab308">' + rfYellow.toFixed(2) + '</span></div>' +
      '<div class="metric"><span class="k">Blue Dye (Rf)</span><span class="v" style="color:#3b82f6">' + rfBlue.toFixed(2) + '</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Paper Chromatography:</strong> Different pigments move at different rates according to their relative solubility in the mobile solvent. The red pigment has the highest solubility (Rf = 0.80) and ascends furthest.";
  }

  window.SIMS.lab_chromatography = { mount: mount, draw: draw };
})();