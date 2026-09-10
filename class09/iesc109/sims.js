var App = window.App;
window.SIMS = {};

function setActivePreset(btn){
  document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
  if(btn) btn.classList.add("active");
}

// =========================================================================
// 1. SIMULATION 1: Law of Conservation of Mass (lab_mass_conservation)
// =========================================================================
(function(){
  var simState = {
    sealed: true,
    reacted: false
  };

  function mount(lesson){
    simState.sealed = true;
    simState.reacted = false;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Reactants (Na₂CO₃ + CH₃COOH)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Sealed Rubber Stopper</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Escaping Gas (if Unsealed)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p1-sealed">Sealed Flask (Mass Conserved: 11.30 g)</button>' +
      '<button class="preset-btn" id="p1-open">Unsealed Flask (CO₂ Escapes: 9.10 g!)</button>' +
      '<button class="preset-btn" id="p1-precip">Precipitation: BaCl₂ + Na₂SO₄ &rarr; BaSO₄(s)</button>';

    document.getElementById("p1-sealed").addEventListener("click", function(){
      setActivePreset(this);
      simState.sealed = true;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Sealed flask: 5.3 g Na₂CO₃ + 6.0 g acid react. All CO₂ gas is trapped, maintaining exact mass = 11.30 g!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-open").addEventListener("click", function(){
      setActivePreset(this);
      simState.sealed = false;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Unsealed flask: 2.2 g of CO₂ gas bubbles escape into the room. Apparent balance reading drops to 9.10 g!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-precip").addEventListener("click", function(){
      setActivePreset(this);
      simState.sealed = true;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Precipitation: Liquid mixing produces solid white BaSO₄. Zero gas produced, mass remains perfectly constant!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var progress = Math.min(1.0, t / 3.0);
    var isReacted = progress > 0.4;
    var reading = simState.sealed ? 11.30 : (11.30 - (isReacted ? progress * 2.20 : 0));

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Digital Balance Base
    svg += '<rect x="220" y="210" width="280" height="45" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="2"/>';
    svg += '<rect x="300" y="220" width="120" height="25" rx="3" fill="#020617"/>';
    svg += '<text x="360" y="238" fill="#22c55e" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">' + reading.toFixed(2) + ' g</text>';

    // Conical Flask Outline
    svg += '<polygon points="320,60 400,60 460,205 260,205" fill="#0284c7" fill-opacity="0.08" stroke="#38bdf8" stroke-width="2.5"/>';

    // Stopper if sealed
    if(simState.sealed){
      svg += '<polygon points="315,50 405,50 395,68 325,68" fill="#10b981" stroke="#059669" stroke-width="2"/>';
      svg += '<text x="360" y="42" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Airtight Stopper (Sealed System)</text>';
    } else {
      svg += '<text x="360" y="42" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">Open Mouth (Gas Escapes!)</text>';
      if(isReacted){
        // Escaping bubbles
        for(var b = 0; b < 6; b++){
          var by = 50 - b * 8 - (t * 15 % 30);
          var bx = 350 + (b % 2 === 0 ? 10 : -10);
          svg += '<circle cx="' + bx + '" cy="' + by + '" r="4" fill="#fca5a5" opacity="0.7"/>';
        }
      }
    }

    // Reaction liquid at bottom
    var liqColor = isReacted ? '#0284c7' : '#38bdf8';
    svg += '<polygon points="275,170 445,170 455,203 265,203" fill="' + liqColor + '" fill-opacity="0.5"/>';

    // Bubbles inside liquid if reaction occurring
    if(progress > 0.1 && progress < 0.9){
      for(var i = 0; i < 8; i++){
        var bubbleX = 290 + i * 18;
        var bubbleY = 195 - (i * 3 + t * 20) % 25;
        svg += '<circle cx="' + bubbleX + '" cy="' + bubbleY + '" r="3" fill="#fff" opacity="0.8"/>';
      }
      svg += '<text x="360" y="155" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Brisk Effervescence: CO₂ Gas Formed!</text>';
    }

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>System: <strong>' + (simState.sealed ? 'Closed (Sealed)' : 'Open (Unsealed)') + '</strong></span>' +
      '<span>Reactant Mass: <strong>11.30 g</strong></span>' +
      '<span>Current Balance: <strong style="color:' + (simState.sealed ? '#10b981' : '#ef4444') + ';">' + reading.toFixed(2) + ' g</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      simState.sealed ? 
      'Law of Conservation of Mass strictly verified! Total Mass of Reactants (11.30 g) = Total Mass of Products (11.30 g).' :
      'Apparent mass decrease is due to escaping CO₂ gas in an open system. Mass is strictly conserved in universe!';
  }

  window.SIMS.lab_mass_conservation = { mount: mount, draw: draw };
})();

// =========================================================================
// 2. SIMULATION 2: Constant Proportions & Dalton (lab_constant_proportions)
// =========================================================================
(function(){
  var simState = {
    mH: 3.0,
    mO: 24.0
  };

  function mount(lesson){
    simState.mH = 3.0; simState.mO = 24.0;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Hydrogen Mass (1 Part)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Oxygen Mass (8 Parts)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Water Formed (H:O = 1:8)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p2-exact">Exact Ratio: 3.0 g H + 24.0 g O &rarr; 27.0 g H₂O</button>' +
      '<button class="preset-btn" id="p2-excess-h">Excess Hydrogen: 5.0 g H + 24.0 g O (2.0 g H left!)</button>' +
      '<button class="preset-btn" id="p2-ammonia">Ammonia Ratio: 14.0 g N + 3.0 g H &rarr; 17.0 g NH₃</button>';

    document.getElementById("p2-exact").addEventListener("click", function(){
      setActivePreset(this);
      simState.mH = 3.0; simState.mO = 24.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Exact 1:8 stoichiometric mass ratio! 3.0 g H combines with 24.0 g O to yield 27.0 g water with zero excess.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-excess-h").addEventListener("click", function(){
      setActivePreset(this);
      simState.mH = 5.0; simState.mO = 24.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Limiting reactant: 24.0 g O can react with only 3.0 g H. 2.0 g of excess hydrogen remains completely unreacted!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-ammonia").addEventListener("click", function(){
      setActivePreset(this);
      simState.mH = 3.0; simState.mO = 14.0; // N=14, H=3
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Ammonia (NH₃) constant mass ratio: Nitrogen and Hydrogen combine strictly in the 14:3 mass ratio!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    var maxO = simState.mH * 8;
    var usedH, usedO, excessH, excessO, water;

    if(simState.mO === 14.0){ // Ammonia mode
      usedH = 3.0; usedO = 14.0; excessH = 0; excessO = 0; water = 17.0;
    } else {
      if(simState.mO >= maxO){
        usedH = simState.mH; usedO = maxO; excessH = 0; excessO = simState.mO - maxO;
      } else {
        usedO = simState.mO; usedH = simState.mO / 8; excessH = simState.mH - usedH; excessO = 0;
      }
      water = usedH + usedO;
    }

    // Reaction Chamber Graphic
    svg += '<rect x="60" y="50" width="260" height="180" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
    svg += '<text x="190" y="80" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">Reactant Gas Mixture</text>';
    svg += '<text x="190" y="115" fill="#93c5fd" font-size="13" text-anchor="middle">Hydrogen (H₂): ' + simState.mH.toFixed(1) + ' g</text>';
    svg += '<text x="190" y="145" fill="#fca5a5" font-size="13" text-anchor="middle">' + (simState.mO===14.0?'Nitrogen (N₂)':'Oxygen (O₂)') + ': ' + simState.mO.toFixed(1) + ' g</text>';
    if(excessH > 0){
      svg += '<text x="190" y="185" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Excess H₂ Unreacted: ' + excessH.toFixed(1) + ' g</text>';
    }

    // Arrow
    svg += '<line x1="330" y1="140" x2="410" y2="140" stroke="#10b981" stroke-width="4"/>';
    svg += '<polygon points="410,132 425,140 410,148" fill="#10b981"/>';
    svg += '<text x="370" y="125" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Combines 1:8</text>';

    // Product Chamber Graphic
    svg += '<rect x="435" y="50" width="240" height="180" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
    svg += '<text x="555" y="80" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">' + (simState.mO===14.0?'Ammonia Formed':'Pure Water Formed') + '</text>';
    svg += '<text x="555" y="125" fill="#f8fafc" font-size="28" font-weight="bold" text-anchor="middle">' + water.toFixed(1) + ' g</text>';
    svg += '<text x="555" y="165" fill="#94a3b8" font-size="12" text-anchor="middle">' + (simState.mO===14.0?'14 g N : 3 g H fixed ratio':'1 g H : 8 g O fixed ratio') + '</text>';

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Product Mass: <strong style="color:#10b981;">' + water.toFixed(1) + ' g</strong></span>' +
      '<span>H:O Combining Ratio: <strong>1 : 8 by mass</strong></span>' +
      '<span>Unreacted Gas: <strong style="color:' + (excessH>0?'#fbbf24':'#94a3b8') + ';">' + excessH.toFixed(1) + ' g</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      'Proust Law of Constant Proportions: Elements always combine in fixed definite mass ratios regardless of source or excess!';
  }

  window.SIMS.lab_constant_proportions = { mount: mount, draw: draw };
})();

// =========================================================================
// 3. SIMULATION 3: Covalent Bonding & Octet Sharing (lab_covalent_bonding)
// =========================================================================
(function(){
  var simState = {
    mol: "O2" // "H2", "O2", "N2", "CH4"
  };

  function mount(lesson){
    simState.mol = "O2";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Shared Bonding Electrons</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Non-Bonding Lone Pairs</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Central Nuclei</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p3-o2">Oxygen (O=O Double Bond: 4 Shared e⁻)</button>' +
      '<button class="preset-btn" id="p3-n2">Nitrogen (N&equiv;N Triple Bond: 6 Shared e⁻)</button>' +
      '<button class="preset-btn" id="p3-h2">Hydrogen (H&minus;H Single Bond: 2 Shared e⁻)</button>';

    document.getElementById("p3-o2").addEventListener("click", function(){
      setActivePreset(this);
      simState.mol = "O2";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Oxygen: 6 valence electrons each. Sharing 2 pairs (4 electrons) gives both atoms a complete stable octet: :O=O:!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-n2").addEventListener("click", function(){
      setActivePreset(this);
      simState.mol = "N2";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Nitrogen: 5 valence electrons each. Sharing 3 pairs (6 electrons) forms an immensely strong triple bond: :N≡N:!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-h2").addEventListener("click", function(){
      setActivePreset(this);
      simState.mol = "H2";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Hydrogen: Sharing 1 pair of electrons fulfills the stable helium duplet (2 electrons) for each hydrogen atom.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    var c1x = 280, c2x = 440, cy = 140;

    if(simState.mol === "O2"){
      // Overlapping Shells for O=O
      svg += '<circle cx="' + c1x + '" cy="' + cy + '" r="90" fill="#38bdf8" fill-opacity="0.1" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<circle cx="' + c2x + '" cy="' + cy + '" r="90" fill="#38bdf8" fill-opacity="0.1" stroke="#38bdf8" stroke-width="2"/>';

      // Nuclei
      svg += '<circle cx="' + c1x + '" cy="' + cy + '" r="22" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>';
      svg += '<text x="' + c1x + '" y="' + (cy + 5) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">O (8p)</text>';

      svg += '<circle cx="' + c2x + '" cy="' + cy + '" r="22" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>';
      svg += '<text x="' + c2x + '" y="' + (cy + 5) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">O (8p)</text>';

      // 4 Shared Electrons in intersection
      var sharedPts = [{x: 350, y: 115}, {x: 370, y: 115}, {x: 350, y: 165}, {x: 370, y: 165}];
      sharedPts.forEach(function(p){
        svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="6" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>';
      });

      // Lone pairs on atom 1
      svg += '<circle cx="210" cy="110" r="5.5" fill="#fbbf24"/><circle cx="210" cy="130" r="5.5" fill="#fbbf24"/>';
      svg += '<circle cx="210" cy="150" r="5.5" fill="#fbbf24"/><circle cx="210" cy="170" r="5.5" fill="#fbbf24"/>';

      // Lone pairs on atom 2
      svg += '<circle cx="510" cy="110" r="5.5" fill="#fbbf24"/><circle cx="510" cy="130" r="5.5" fill="#fbbf24"/>';
      svg += '<circle cx="510" cy="150" r="5.5" fill="#fbbf24"/><circle cx="510" cy="170" r="5.5" fill="#fbbf24"/>';

      svg += '<text x="360" y="45" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Oxygen Molecule (O₂): Double Covalent Bond (O=O)</text>';
      svg += '<text x="360" y="255" fill="#94a3b8" font-size="12" text-anchor="middle">4 shared electrons in overlap + 4 lone electrons each = 8 valence electrons (Octet achieved!)</text>';
    } else if(simState.mol === "N2"){
      // N=N Triple bond
      svg += '<circle cx="' + c1x + '" cy="' + cy + '" r="90" fill="#a855f7" fill-opacity="0.1" stroke="#a855f7" stroke-width="2"/>';
      svg += '<circle cx="' + c2x + '" cy="' + cy + '" r="90" fill="#a855f7" fill-opacity="0.1" stroke="#a855f7" stroke-width="2"/>';

      svg += '<circle cx="' + c1x + '" cy="' + cy + '" r="22" fill="#ef4444"/><text x="' + c1x + '" y="' + (cy + 5) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">N (7p)</text>';
      svg += '<circle cx="' + c2x + '" cy="' + cy + '" r="22" fill="#ef4444"/><text x="' + c2x + '" y="' + (cy + 5) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">N (7p)</text>';

      // 6 Shared Electrons
      var nShared = [{x:350, y:110},{x:370, y:110},{x:350, y:140},{x:370, y:140},{x:350, y:170},{x:370, y:170}];
      nShared.forEach(function(p){
        svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="6" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>';
      });

      // 1 Lone pair each
      svg += '<circle cx="210" cy="130" r="5.5" fill="#fbbf24"/><circle cx="210" cy="150" r="5.5" fill="#fbbf24"/>';
      svg += '<circle cx="510" cy="130" r="5.5" fill="#fbbf24"/><circle cx="510" cy="150" r="5.5" fill="#fbbf24"/>';

      svg += '<text x="360" y="45" fill="#a855f7" font-size="16" font-weight="bold" text-anchor="middle">Nitrogen Molecule (N₂): Triple Covalent Bond (N&equiv;N)</text>';
      svg += '<text x="360" y="255" fill="#94a3b8" font-size="12" text-anchor="middle">6 shared electrons + 2 lone electrons = 8 valence electrons per atom (945 kJ/mol bond strength)</text>';
    } else {
      // H-H Single bond
      svg += '<circle cx="' + c1x + '" cy="' + cy + '" r="80" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="2"/>';
      svg += '<circle cx="' + c2x + '" cy="' + cy + '" r="80" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="2"/>';

      svg += '<circle cx="' + c1x + '" cy="' + cy + '" r="20" fill="#ef4444"/><text x="' + c1x + '" y="' + (cy + 5) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">H (1p)</text>';
      svg += '<circle cx="' + c2x + '" cy="' + cy + '" r="20" fill="#ef4444"/><text x="' + c2x + '" y="' + (cy + 5) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">H (1p)</text>';

      svg += '<circle cx="350" cy="140" r="6" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>';
      svg += '<circle cx="370" cy="140" r="6" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>';

      svg += '<text x="360" y="45" fill="#10b981" font-size="16" font-weight="bold" text-anchor="middle">Hydrogen Molecule (H₂): Single Covalent Bond (H&minus;H)</text>';
      svg += '<text x="360" y="255" fill="#94a3b8" font-size="12" text-anchor="middle">1 shared pair (2 electrons) fulfills the stable Helium duplet for both atoms</text>';
    }

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Molecule: <strong>' + simState.mol + '</strong></span>' +
      '<span>Bond Type: <strong style="color:#38bdf8;">' + (simState.mol==='H2'?'Single Bond (2 e⁻)':(simState.mol==='O2'?'Double Bond (4 e⁻)':'Triple Bond (6 e⁻)')) + '</strong></span>' +
      '<span>Octet Status: <strong style="color:#10b981;">Fully Satisfied</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      'Covalent bonding enables non-metals to achieve noble gas electron configurations by sharing electron pairs!';
  }

  window.SIMS.lab_covalent_bonding = { mount: mount, draw: draw };
})();

// =========================================================================
// 4. SIMULATION 4: Ionic Bonding & Electron Transfer (lab_ionic_bonding)
// =========================================================================
(function(){
  var simState = {
    type: "NaCl" // "NaCl" or "MgO"
  };

  function mount(lesson){
    simState.type = "NaCl";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Metal Cation (Na⁺ / Mg²⁺)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Non-Metal Anion (Cl⁻ / O²⁻)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Transferred Electron</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p4-nacl">Sodium Chloride: Na &rarr; Na⁺ + e⁻ to Cl (NaCl)</button>' +
      '<button class="preset-btn" id="p4-mgo">Magnesium Oxide: Mg &rarr; Mg²⁺ + 2e⁻ to O (MgO)</button>';

    document.getElementById("p4-nacl").addEventListener("click", function(){
      setActivePreset(this);
      simState.type = "NaCl";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Sodium (2,8,1) transfers 1 electron to Chlorine (2,8,7), producing Na⁺ (2,8) and Cl⁻ (2,8,8) ionic crystal!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-mgo").addEventListener("click", function(){
      setActivePreset(this);
      simState.type = "MgO";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Magnesium (2,8,2) transfers 2 electrons to Oxygen (2,6), creating highly charged Mg²⁺ and O²⁻ ions!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    var c1x = 220, c2x = 500, cy = 135;
    var transferT = Math.min(1.0, t / 2.5);

    if(simState.type === "NaCl"){
      // Na Atom / Ion
      svg += '<circle cx="' + c1x + '" cy="' + cy + '" r="70" fill="#3b82f6" fill-opacity="0.1" stroke="#3b82f6" stroke-width="2"/>';
      svg += '<circle cx="' + c1x + '" cy="' + cy + '" r="22" fill="#3b82f6"/>';
      svg += '<text x="' + c1x + '" y="' + (cy + 5) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">Na⁺</text>';
      svg += '<text x="' + c1x + '" y="' + (cy - 80) + '" fill="#93c5fd" font-size="13" font-weight="bold" text-anchor="middle">Sodium (2, 8, 1 &rarr; 2, 8)</text>';

      // Cl Atom / Ion
      svg += '<circle cx="' + c2x + '" cy="' + cy + '" r="85" fill="#22c55e" fill-opacity="0.1" stroke="#22c55e" stroke-width="2"/>';
      svg += '<circle cx="' + c2x + '" cy="' + cy + '" r="22" fill="#22c55e"/>';
      svg += '<text x="' + c2x + '" y="' + (cy + 5) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">Cl⁻</text>';
      svg += '<text x="' + c2x + '" y="' + (cy - 95) + '" fill="#86efac" font-size="13" font-weight="bold" text-anchor="middle">Chlorine (2, 8, 7 &rarr; 2, 8, 8)</text>';

      // Migrating Electron
      var ex = (c1x + 70) + transferT * (c2x - 85 - (c1x + 70));
      svg += '<circle cx="' + ex + '" cy="' + (cy - 20) + '" r="6" fill="#fbbf24" stroke="#fff" stroke-width="1.5"/>';
      svg += '<text x="' + ex + '" y="' + (cy - 30) + '" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">e&minus;</text>';

      // Electrostatic Arrow between ions
      if(transferT >= 0.8){
        svg += '<path d="M 290 135 L 415 135" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4"/>';
        svg += '<text x="360" y="125" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">Strong Coulomb Attraction</text>';
      }
    } else {
      // MgO
      svg += '<circle cx="' + c1x + '" cy="' + cy + '" r="70" fill="#3b82f6" fill-opacity="0.1" stroke="#3b82f6" stroke-width="2"/>';
      svg += '<circle cx="' + c1x + '" cy="' + cy + '" r="22" fill="#3b82f6"/><text x="' + c1x + '" y="' + (cy + 5) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">Mg²⁺</text>';
      svg += '<text x="' + c1x + '" y="' + (cy - 80) + '" fill="#93c5fd" font-size="13" font-weight="bold" text-anchor="middle">Magnesium (2, 8, 2 &rarr; 2, 8)</text>';

      svg += '<circle cx="' + c2x + '" cy="' + cy + '" r="75" fill="#22c55e" fill-opacity="0.1" stroke="#22c55e" stroke-width="2"/>';
      svg += '<circle cx="' + c2x + '" cy="' + cy + '" r="22" fill="#22c55e"/><text x="' + c2x + '" y="' + (cy + 5) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">O²⁻</text>';
      svg += '<text x="' + c2x + '" y="' + (cy - 85) + '" fill="#86efac" font-size="13" font-weight="bold" text-anchor="middle">Oxygen (2, 6 &rarr; 2, 8)</text>';

      // 2 Migrating Electrons
      var ex1 = (c1x + 70) + transferT * (c2x - 75 - (c1x + 70));
      svg += '<circle cx="' + ex1 + '" cy="' + (cy - 30) + '" r="6" fill="#fbbf24" stroke="#fff" stroke-width="1.5"/>';
      svg += '<circle cx="' + ex1 + '" cy="' + (cy - 10) + '" r="6" fill="#fbbf24" stroke="#fff" stroke-width="1.5"/>';
      svg += '<text x="' + ex1 + '" y="' + (cy - 42) + '" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">2 e&minus;</text>';

      if(transferT >= 0.8){
        svg += '<path d="M 290 135 L 425 135" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4"/>';
        svg += '<text x="360" y="125" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">Doubly Charged Attraction (+2 &minus;2)</text>';
      }
    }

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Compound: <strong>' + simState.type + '</strong></span>' +
      '<span>Cation: <strong style="color:#38bdf8;">' + (simState.type==='NaCl'?'Na⁺ (2, 8)':'Mg²⁺ (2, 8)') + '</strong></span>' +
      '<span>Anion: <strong style="color:#10b981;">' + (simState.type==='NaCl'?'Cl⁻ (2, 8, 8)':'O²⁻ (2, 8)') + '</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      'Electron transfer completely fulfills octets for both species, forming robust ionic crystals with high lattice energy!';
  }

  window.SIMS.lab_ionic_bonding = { mount: mount, draw: draw };
})();

// =========================================================================
// 5. SIMULATION 5: Chemical Formulae Criss-Cross Solver (lab_chemical_formulae)
// =========================================================================
(function(){
  var simState = {
    cat: "Al", catQ: 3, an: "SO4", anQ: 2, poly: true, name: "Aluminium Sulphate"
  };

  function mount(lesson){
    simState.cat = "Al"; simState.catQ = 3; simState.an = "SO4"; simState.anQ = 2; simState.poly = true; simState.name = "Aluminium Sulphate";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cation & Charge</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Anion & Charge</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Balanced Chemical Formula</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p5-also4">Al³⁺ + SO₄²⁻ &rarr; Al₂(SO₄)₃</button>' +
      '<button class="preset-btn" id="p5-caoh">Ca²⁺ + OH⁻ &rarr; Ca(OH)₂</button>' +
      '<button class="preset-btn" id="p5-cao">Ca²⁺ + O²⁻ &rarr; CaO (Reduced 1:1)</button>' +
      '<button class="preset-btn" id="p5-nh4cl">NH₄⁺ + Cl⁻ &rarr; NH₄Cl</button>';

    document.getElementById("p5-also4").addEventListener("click", function(){
      setActivePreset(this);
      simState.cat = "Al"; simState.catQ = 3; simState.an = "SO4"; simState.anQ = 2; simState.poly = true; simState.name = "Aluminium Sulphate";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Charges +3 and −2 cross over. Polyatomic SO₄ takes subscript 3, requiring brackets: Al₂(SO₄)₃!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-caoh").addEventListener("click", function(){
      setActivePreset(this);
      simState.cat = "Ca"; simState.catQ = 2; simState.an = "OH"; simState.anQ = 1; simState.poly = true; simState.name = "Calcium Hydroxide";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Ca²⁺ with OH⁻: Subscript 2 applies to the whole hydroxide ion: Ca(OH)₂ (never CaOH₂)!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-cao").addEventListener("click", function(){
      setActivePreset(this);
      simState.cat = "Ca"; simState.catQ = 2; simState.an = "O"; simState.anQ = 2; simState.poly = false; simState.name = "Calcium Oxide";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Ca₂O₂ reduces by dividing by common factor 2 to give the simplest formula: CaO!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-nh4cl").addEventListener("click", function(){
      setActivePreset(this);
      simState.cat = "NH4"; simState.catQ = 1; simState.an = "Cl"; simState.anQ = 1; simState.poly = true; simState.name = "Ammonium Chloride";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> +1 and −1 balance 1:1. When subscript is 1, brackets are omitted: NH₄Cl.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    // Top Step 1: Write Symbols & Charges
    svg += '<g transform="translate(140, 40)">' +
           '<rect width="180" height="90" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>' +
           '<text x="90" y="35" fill="#38bdf8" font-size="28" font-weight="bold" text-anchor="middle">' + simState.cat + '</text>' +
           '<text x="145" y="25" fill="#ef4444" font-size="18" font-weight="bold">' + simState.catQ + '+' + '</text>' +
           '<text x="90" y="70" fill="#94a3b8" font-size="12" text-anchor="middle">Valency = ' + simState.catQ + '</text>' +
           '</g>';

    svg += '<g transform="translate(400, 40)">' +
           '<rect width="180" height="90" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>' +
           '<text x="90" y="35" fill="#f59e0b" font-size="28" font-weight="bold" text-anchor="middle">' + simState.an + '</text>' +
           '<text x="145" y="25" fill="#ef4444" font-size="18" font-weight="bold">' + simState.anQ + '&minus;' + '</text>' +
           '<text x="90" y="70" fill="#94a3b8" font-size="12" text-anchor="middle">Valency = ' + simState.anQ + '</text>' +
           '</g>';

    // Criss-Cross Diagonals
    svg += '<line x1="280" y1="130" x2="430" y2="180" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,3"/>';
    svg += '<line x1="440" y1="130" x2="290" y2="180" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,3"/>';

    // Formula Result Box
    var formulaStr;
    if(simState.cat === "Al" && simState.an === "SO4") formulaStr = "Al₂(SO₄)₃";
    else if(simState.cat === "Ca" && simState.an === "OH") formulaStr = "Ca(OH)₂";
    else if(simState.cat === "Ca" && simState.an === "O") formulaStr = "CaO";
    else formulaStr = "NH₄Cl";

    svg += '<g transform="translate(240, 185)">' +
           '<rect width="240" height="70" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="3"/>' +
           '<text x="120" y="45" fill="#10b981" font-size="32" font-weight="bold" text-anchor="middle">' + formulaStr + '</text>' +
           '</g>';

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Compound: <strong>' + simState.name + '</strong></span>' +
      '<span>Formula: <strong style="color:#10b981;">' + formulaStr + '</strong></span>' +
      '<span>Charge Neutrality: <strong>Net 0</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      'Criss-cross valencies and simplify! Use brackets for polyatomic groups when subscript is 2 or more.';
  }

  window.SIMS.lab_chemical_formulae = { mount: mount, draw: draw };
})();

// =========================================================================
// 6. SIMULATION 6: Properties of Ionic vs Covalent Compounds (lab_ionic_vs_covalent)
// =========================================================================
(function(){
  var simState = {
    sample: "salt_sol", // "salt_solid", "salt_sol", "sugar_sol"
    bulbOn: true
  };

  function mount(lesson){
    simState.sample = "salt_sol";
    simState.bulbOn = true;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Bulb Glowing (Conduction)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#475569;"></span><span>Bulb Off (Non-Conductor)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Graphite Electrodes</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p6-saltsol">NaCl in Water: Free Na⁺ & Cl⁻ Ions (Bulb GLOWS!)</button>' +
      '<button class="preset-btn" id="p6-sugarsol">Sugar Solution: Neutral Molecules (Bulb OFF)</button>' +
      '<button class="preset-btn" id="p6-saltsolid">Dry Solid NaCl: Ions Locked in Lattice (Bulb OFF)</button>';

    document.getElementById("p6-saltsol").addEventListener("click", function(){
      setActivePreset(this);
      simState.sample = "salt_sol";
      simState.bulbOn = true;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Dissolved salt breaks into free mobile Na⁺ and Cl⁻ ions that migrate to electrodes, lighting the bulb brightly!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-sugarsol").addEventListener("click", function(){
      setActivePreset(this);
      simState.sample = "sugar_sol";
      simState.bulbOn = false;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Sugar dissolves as intact neutral molecules (C₁₂H₂₂O₁₁). Zero ions exist to carry electric current: bulb stays dark!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-saltsolid").addEventListener("click", function(){
      setActivePreset(this);
      simState.sample = "salt_solid";
      simState.bulbOn = false;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> In solid crystalline NaCl, strong electrostatic forces lock ions in fixed positions: no migration, zero conduction!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Beaker
    svg += '<rect x="180" y="80" width="200" height="150" rx="8" fill="#0284c7" fill-opacity="0.1" stroke="#38bdf8" stroke-width="3"/>';

    if(simState.sample !== "salt_solid"){
      // Liquid
      svg += '<rect x="185" y="110" width="190" height="115" fill="#38bdf8" fill-opacity="0.25"/>';
    } else {
      // Solid salt crystals pile
      svg += '<polygon points="200,225 280,160 360,225" fill="#f8fafc" opacity="0.8"/>';
      svg += '<text x="280" y="215" fill="#0f172a" font-size="11" font-weight="bold" text-anchor="middle">Rigid Crystal Lattice</text>';
    }

    // Graphite Electrodes
    svg += '<rect x="230" y="60" width="15" height="130" fill="#475569" stroke="#64748b"/>';
    svg += '<rect x="315" y="60" width="15" height="130" fill="#475569" stroke="#64748b"/>';
    svg += '<text x="280" y="50" fill="#94a3b8" font-size="11" text-anchor="middle">Carbon Electrodes</text>';

    // Ions floating if salt solution
    if(simState.sample === "salt_sol"){
      svg += '<circle cx="255" cy="140" r="10" fill="#3b82f6"/><text x="255" y="144" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Na⁺</text>';
      svg += '<circle cx="295" cy="165" r="10" fill="#22c55e"/><text x="295" y="169" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Cl⁻</text>';
      svg += '<circle cx="260" cy="185" r="10" fill="#22c55e"/><text x="260" y="189" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Cl⁻</text>';
      svg += '<circle cx="300" cy="130" r="10" fill="#3b82f6"/><text x="300" y="134" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Na⁺</text>';
    }

    // Circuit Wires, Battery and Bulb
    svg += '<line x1="237" y1="60" x2="237" y2="30" stroke="#e2e8f0" stroke-width="2.5"/>';
    svg += '<line x1="237" y1="30" x2="520" y2="30" stroke="#e2e8f0" stroke-width="2.5"/>';

    // Battery (6V)
    svg += '<rect x="520" y="15" width="45" height="30" rx="4" fill="#334155" stroke="#f59e0b"/>';
    svg += '<text x="542" y="35" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">6 V</text>';

    svg += '<line x1="565" y1="30" x2="620" y2="30" stroke="#e2e8f0" stroke-width="2.5"/>';
    svg += '<line x1="620" y1="30" x2="620" y2="120" stroke="#e2e8f0" stroke-width="2.5"/>';

    // Bulb
    var bulbColor = simState.bulbOn ? "#22c55e" : "#475569";
    var glowFilter = simState.bulbOn ? '<circle cx="620" cy="140" r="28" fill="#22c55e" opacity="0.3"/>' : '';
    svg += glowFilter;
    svg += '<circle cx="620" cy="140" r="18" fill="' + bulbColor + '" stroke="#94a3b8" stroke-width="2"/>';
    svg += '<text x="620" y="145" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">' + (simState.bulbOn?'ON':'OFF') + '</text>';
    svg += '<text x="620" y="180" fill="#94a3b8" font-size="11" text-anchor="middle">Bulb</text>';

    svg += '<line x1="620" y1="160" x2="620" y2="240" stroke="#e2e8f0" stroke-width="2.5"/>';
    svg += '<line x1="620" y1="240" x2="322" y2="240" stroke="#e2e8f0" stroke-width="2.5"/>';
    svg += '<line x1="322" y1="240" x2="322" y2="60" stroke="#e2e8f0" stroke-width="2.5"/>';

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Tested Substance: <strong>' + (simState.sample==='salt_sol'?'Aqueous NaCl (Salt)':(simState.sample==='sugar_sol'?'Aqueous Glucose (Sugar)':'Dry Solid NaCl')) + '</strong></span>' +
      '<span>Bulb State: <strong style="color:' + (simState.bulbOn?'#22c55e':'#ef4444') + ';">' + (simState.bulbOn?'GLOWING (Current Flows)':'DARK (No Current)') + '</strong></span>' +
      '<span>Carriers: <strong>' + (simState.sample==='salt_sol'?'Free Mobile Na⁺, Cl⁻':'None') + '</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      simState.bulbOn ? 
      'Ionic solution conducts electricity because polar water dissociates the crystal into free mobile ions that carry charge!' :
      'Covalent sugar contains neutral molecules, while dry salt has ions fixed in lattice. Free mobile ions are essential for conduction!';
  }

  window.SIMS.lab_ionic_vs_covalent = { mount: mount, draw: draw };
})();

// =========================================================================
// 7. SIMULATION 7: Molecular & Formula Mass Calculator (lab_molecular_formula_mass)
// =========================================================================
(function(){
  var simState = {
    formula: "NH4NO3",
    name: "Ammonium Nitrate (Fertilizer - Ex 8)",
    breakdown: "2N (2×14) + 4H (4×1) + 3O (3×16)",
    calc: "28 + 4 + 48",
    mass: 80.0
  };

  function mount(lesson){
    simState.formula = "NH4NO3";
    simState.name = "Ammonium Nitrate (Fertilizer - Ex 8)";
    simState.breakdown = "2N (2×14) + 4H (4×1) + 3O (3×16)";
    simState.calc = "28 + 4 + 48";
    simState.mass = 80.0;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Chemical Formula</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Atomic Mass Breakdown</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Formula Unit Mass (u)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p7-nh4no3">Ammonium Nitrate (NH₄NO₃ &rarr; 80 u)</button>' +
      '<button class="preset-btn" id="p7-h3po4">Phosphoric Acid (H₃PO₄ &rarr; 98 u)</button>' +
      '<button class="preset-btn" id="p7-nahco3">Baking Soda (NaHCO₃ &rarr; 84 u)</button>' +
      '<button class="preset-btn" id="p7-h2o">Water (H₂O &rarr; 18 u)</button>';

    document.getElementById("p7-nh4no3").addEventListener("click", function(){
      setActivePreset(this);
      simState.formula = "NH4NO3";
      simState.name = "Ammonium Nitrate (Fertilizer - Ex 8)";
      simState.breakdown = "2N (2×14) + 4H (4×1) + 3O (3×16)";
      simState.calc = "28 + 4 + 48";
      simState.mass = 80.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Ammonium nitrate (NH₄NO₃): 2 Nitrogens (28 u) + 4 Hydrogens (4 u) + 3 Oxygens (48 u) = 80 u!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-h3po4").addEventListener("click", function(){
      setActivePreset(this);
      simState.formula = "H3PO4";
      simState.name = "Phosphoric Acid (Detergents & Fertilizer - Ex 8)";
      simState.breakdown = "3H (3×1) + 1P (1×31) + 4O (4×16)";
      simState.calc = "3 + 31 + 64";
      simState.mass = 98.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Phosphoric acid (H₃PO₄): 3 H (3 u) + 1 P (31 u) + 4 O (64 u) = 98 u!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-nahco3").addEventListener("click", function(){
      setActivePreset(this);
      simState.formula = "NaHCO3";
      simState.name = "Sodium Hydrogencarbonate (Antacid & Baking Soda - Ex 8)";
      simState.breakdown = "1Na (23) + 1H (1) + 1C (12) + 3O (3×16)";
      simState.calc = "23 + 1 + 12 + 48";
      simState.mass = 84.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Sodium bicarbonate (NaHCO₃): 23 + 1 + 12 + 48 = 84 u!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-h2o").addEventListener("click", function(){
      setActivePreset(this);
      simState.formula = "H2O";
      simState.name = "Water (Universal Solvent)";
      simState.breakdown = "2H (2×1) + 1O (1×16)";
      simState.calc = "2 + 16";
      simState.mass = 18.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Water (H₂O): 2 Hydrogens (2 u) + 1 Oxygen (16 u) = 18 u!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    // Big Formula Display Box
    svg += '<g transform="translate(80, 40)">' +
           '<rect width="250" height="190" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>' +
           '<text x="125" y="40" fill="#94a3b8" font-size="12" text-anchor="middle">Chemical Formula</text>' +
           '<text x="125" y="100" fill="#38bdf8" font-size="44" font-weight="bold" text-anchor="middle">' + simState.formula + '</text>' +
           '<text x="125" y="145" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">' + simState.name + '</text>' +
           '</g>';

    // Breakdown Panel
    svg += '<g transform="translate(360, 40)">' +
           '<rect width="280" height="190" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2"/>' +
           '<text x="140" y="32" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">Atomic Mass Computation</text>' +
           '<text x="25" y="70" fill="#fbbf24" font-size="13">Breakdown:</text>' +
           '<text x="25" y="95" fill="#cbd5e1" font-size="12">' + simState.breakdown + '</text>' +
           '<text x="25" y="130" fill="#fbbf24" font-size="13">Calculation:</text>' +
           '<text x="25" y="150" fill="#cbd5e1" font-size="13">' + simState.calc + ' =</text>' +
           '<text x="255" y="175" fill="#10b981" font-size="28" font-weight="bold" text-anchor="end">' + simState.mass.toFixed(1) + ' u</text>' +
           '</g>';

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Formula: <strong>' + simState.formula + '</strong></span>' +
      '<span>Formula Mass: <strong style="color:#10b981;">' + simState.mass.toFixed(1) + ' u</strong></span>' +
      '<span>Unit: <strong>Unified Atomic Mass (u)</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      'Formula mass is the exact sum of all atomic masses present in the empirical formula unit!';
  }

  window.SIMS.lab_molecular_formula_mass = { mount: mount, draw: draw };
})();