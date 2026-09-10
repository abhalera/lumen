var App = window.App;
window.SIMS = {};

function setActivePreset(btn){
  document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
  if(btn) btn.classList.add("active");
}

// =========================================================================
// 1. SIMULATION 1: Compound Microscope & Cell Scale (lab_microscopy_cell_size)
// =========================================================================
(function(){
  var simState = {
    slide: "onion", // "onion", "cheek", "puga"
    mag: 100 // 100x, 400x
  };

  function mount(lesson){
    simState.slide = "onion";
    simState.mag = 100;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Cellulose Cell Wall (Plant)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Nucleus (Stained by Iodine)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cytoplasm</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p1-onion">Onion Epidermal Peel (100&times; - Plant Cells)</button>' +
      '<button class="preset-btn" id="p1-cheek">Human Cheek Epithelium (400&times; - Animal Cells)</button>' +
      '<button class="preset-btn" id="p1-puga">Puga Valley Thermophile Bacteria (Ladakh 1000&times;)</button>';

    document.getElementById("p1-onion").addEventListener("click", function(){
      setActivePreset(this);
      simState.slide = "onion";
      simState.mag = 100;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Onion peel: Brick-shaped cells with rigid cellulose cell walls, large central vacuoles, and prominent peripheral nuclei.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-cheek").addEventListener("click", function(){
      setActivePreset(this);
      simState.slide = "cheek";
      simState.mag = 400;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Cheek cells: Irregular polygonal animal cells with flexible cell membranes, central nuclei, and zero cell walls.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-puga").addEventListener("click", function(){
      setActivePreset(this);
      simState.slide = "puga";
      simState.mag = 1000;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Puga Valley hot spring bacteria: Tiny rod-shaped thermophilic prokaryotes (~2 μm) lacking nuclear envelopes!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    // Microscope Circular Field of View
    var cx = 360, cy = 140, r = 120;
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 8) + '" fill="#1e293b" stroke="#475569" stroke-width="3"/>';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#020617"/>';

    // Clip path for circular view
    svg += '<defs><clipPath id="scopeClip"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/></clipPath></defs>';
    svg += '<g clip-path="url(#scopeClip)">';

    if(simState.slide === "onion"){
      // Brick-like plant cells
      for(var row = 0; row < 5; row++){
        var ry = 40 + row * 45;
        for(var col = 0; col < 4; col++){
          var rx = 240 + col * 75 + (row % 2 === 0 ? 0 : 35);
          svg += '<rect x="' + rx + '" y="' + ry + '" width="72" height="42" fill="#14532d" fill-opacity="0.25" stroke="#22c55e" stroke-width="2"/>';
          // Nucleus
          svg += '<circle cx="' + (rx + 50) + '" cy="' + (ry + 20) + '" r="6" fill="#a855f7"/>';
          // Vacuole hint
          svg += '<rect x="' + (rx + 8) + '" y="' + (ry + 8) + '" width="35" height="26" rx="4" fill="#38bdf8" fill-opacity="0.15"/>';
        }
      }
      svg += '<text x="360" y="245" fill="#22c55e" font-size="12" font-weight="bold" text-anchor="middle">Onion Cells: ~200 &mu;m &times; 60 &mu;m</text>';
    } else if(simState.slide === "cheek"){
      // Irregular polygonal animal cells
      var cheekCells = [
        {x: 320, y: 110}, {x: 410, y: 120}, {x: 350, y: 180}, {x: 300, y: 160}
      ];
      cheekCells.forEach(function(c){
        svg += '<polygon points="' + (c.x-35) + ',' + (c.y-25) + ' ' + (c.x+30) + ',' + (c.y-35) + ' ' + (c.x+45) + ',' + (c.y+20) + ' ' + (c.x-10) + ',' + (c.y+40) + ' ' + (c.x-40) + ',' + (c.y+15) + '" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2"/>';
        svg += '<circle cx="' + c.x + '" cy="' + c.y + '" r="8" fill="#a855f7"/>';
      });
      svg += '<text x="360" y="245" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Cheek Epithelial Cells: ~50 &mu;m (No Cell Wall)</text>';
    } else {
      // Puga Valley tiny thermophile bacteria
      for(var b = 0; b < 25; b++){
        var bx = 260 + (b * 37) % 200;
        var by = 50 + (b * 29) % 180;
        var rot = (b * 45) % 180;
        svg += '<rect x="' + bx + '" y="' + by + '" width="12" height="5" rx="2.5" fill="#f59e0b" transform="rotate(' + rot + ' ' + bx + ' ' + by + ')"/>';
      }
      svg += '<text x="360" y="245" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">Puga Thermophiles: ~2 &mu;m Prokaryotes</text>';
    }

    // Reticle crosshair & micrometer scale
    svg += '<line x1="240" y1="140" x2="480" y2="140" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>';
    svg += '<line x1="360" y1="20" x2="360" y2="260" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>';
    svg += '</g>';

    // Scope Labels Outside
    svg += '<text x="60" y="40" fill="#f8fafc" font-size="15" font-weight="bold">Light Microscopy Optics</text>';
    svg += '<text x="60" y="65" fill="#94a3b8" font-size="12">Objective: ' + (simState.mag / 10) + '&times; | Eyepiece: 10&times;</text>';
    svg += '<text x="60" y="90" fill="#38bdf8" font-size="14" font-weight="bold">Total: ' + simState.mag + '&times;</text>';

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Sample: <strong>' + (simState.slide==='onion'?'Onion Peel (Plant)':(simState.slide==='cheek'?'Cheek Cells (Animal)':'Puga Thermophiles (Bacteria)')) + '</strong></span>' +
      '<span>Magnification: <strong style="color:#38bdf8;">' + simState.mag + '&times;</strong></span>' +
      '<span>Scale: <strong>' + (simState.slide==='puga'?'~2 &mu;m':'~50 &ndash; 200 &mu;m') + '</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      simState.slide === 'onion' ? 
      'Plant cells feature rigid cellulose walls and peripheral nuclei pushed aside by the massive central vacuole.' :
      (simState.slide === 'cheek' ? 'Animal cells have flexible plasma membranes, central nuclei, and no cell walls.' : 'Thermophilic bacteria represent primordial unicellular life thriving in extreme Ladakh hot springs!');
  }

  window.SIMS.lab_microscopy_cell_size = { mount: mount, draw: draw };
})();

// =========================================================================
// 2. SIMULATION 2: Plasma Membrane Osmosis & Tonicity (lab_osmosis_tonicity)
// =========================================================================
(function(){
  var simState = {
    env: "hypo" // "hypo", "iso", "hyper"
  };

  function mount(lesson){
    simState.env = "hypo";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Water Molecule Flow</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Red Blood Cell (RBC)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Equilibrium Shape</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p2-hypo">Hypotonic Solution: Pure Water (Endosmosis &rarr; Lysis!)</button>' +
      '<button class="preset-btn" id="p2-iso">Isotonic Solution: 0.9% Saline (Normal Shape)</button>' +
      '<button class="preset-btn" id="p2-hyper">Hypertonic Solution: Brine (Exosmosis &rarr; Shrink!)</button>';

    document.getElementById("p2-hypo").addEventListener("click", function(){
      setActivePreset(this);
      simState.env = "hypo";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Hypotonic pure water: Water rushes in by endosmosis. Lacking a cell wall, the RBC swells and lyses (bursts)!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-iso").addEventListener("click", function(){
      setActivePreset(this);
      simState.env = "iso";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Isotonic 0.9% saline: Equal water influx and efflux. Cell retains its healthy biconcave disc shape.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-hyper").addEventListener("click", function(){
      setActivePreset(this);
      simState.env = "hyper";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Hypertonic concentrated salt: Water leaves by exosmosis. The cell shrivels into a crenated spiky shape!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Solution Beaker
    svg += '<rect x="180" y="50" width="360" height="190" rx="12" fill="#0284c7" fill-opacity="0.12" stroke="#38bdf8" stroke-width="2.5"/>';

    var cx = 360, cy = 145;

    if(simState.env === "hypo"){
      // Swollen / Lyzed RBC
      var rPulse = 65 + Math.min(25, t * 8);
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rPulse + '" fill="#ef4444" fill-opacity="0.8" stroke="#fca5a5" stroke-width="3"/>';
      if(t > 3.0){
        svg += '<text x="' + cx + '" y="' + (cy + 6) + '" fill="#fff" font-size="18" font-weight="bold" text-anchor="middle">LYSED (BURST)!</text>';
      } else {
        svg += '<text x="' + cx + '" y="' + (cy + 6) + '" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">Swelling...</text>';
      }
      // Inward Water Arrows
      svg += '<path d="M 230 145 L 280 145" stroke="#38bdf8" stroke-width="4"/><polygon points="280,140 295,145 280,150" fill="#38bdf8"/>';
      svg += '<path d="M 490 145 L 440 145" stroke="#38bdf8" stroke-width="4"/><polygon points="440,140 425,145 440,150" fill="#38bdf8"/>';
      svg += '<text x="360" y="35" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Hypotonic Medium: Net Inward Water Diffusion (Endosmosis)</text>';
    } else if(simState.env === "iso"){
      // Normal biconcave RBC
      svg += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="60" ry="42" fill="#ef4444" stroke="#f87171" stroke-width="3"/>';
      svg += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="25" ry="18" fill="#b91c1c"/>';
      svg += '<text x="' + cx + '" y="' + (cy + 5) + '" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">Normal Biconcave</text>';

      // Dual balanced arrows
      svg += '<path d="M 250 135 L 290 135" stroke="#10b981" stroke-width="3"/><polygon points="290,131 300,135 290,139" fill="#10b981"/>';
      svg += '<path d="M 290 155 L 250 155" stroke="#10b981" stroke-width="3"/><polygon points="250,151 240,155 250,159" fill="#10b981"/>';
      svg += '<text x="360" y="35" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">Isotonic Medium: Dynamic Equilibrium (Influx = Efflux)</text>';
    } else {
      // Shriveled / Crenated RBC
      svg += '<polygon points="320,110 345,95 380,105 405,120 415,150 395,180 365,190 330,175 315,145" fill="#991b1b" stroke="#ef4444" stroke-width="2.5"/>';
      svg += '<text x="' + cx + '" y="' + (cy + 5) + '" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Crenated (Shrunk)</text>';

      // Outward Water Arrows
      svg += '<path d="M 310 145 L 250 145" stroke="#fbbf24" stroke-width="4"/><polygon points="250,140 235,145 250,150" fill="#fbbf24"/>';
      svg += '<path d="M 420 145 L 480 145" stroke="#fbbf24" stroke-width="4"/><polygon points="480,140 495,145 480,150" fill="#fbbf24"/>';
      svg += '<text x="360" y="35" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Hypertonic Medium: Net Outward Water Diffusion (Exosmosis)</text>';
    }

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Tonicity: <strong>' + (simState.env==='hypo'?'Hypotonic':(simState.env==='iso'?'Isotonic':'Hypertonic')) + '</strong></span>' +
      '<span>Water Movement: <strong style="color:#38bdf8;">' + (simState.env==='hypo'?'Net Inflow (Endosmosis)':(simState.env==='iso'?'Equilibrium':'Net Outflow (Exosmosis)')) + '</strong></span>' +
      '<span>Cell State: <strong>' + (simState.env==='hypo'?'Swelling / Lysis':(simState.env==='iso'?'Normal 100% Volume':'Crenated / Shrunk')) + '</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      simState.env === 'hypo' ? 
      'Animal cells lack a rigid cell wall, so hypotonic water influx causes swelling and eventual lysis.' :
      (simState.env === 'iso' ? 'Isotonic saline maintains exact osmotic balance for intravenous medical fluids.' : 'Hypertonic environments extract intracellular water, shriveling animal cells.');
  }

  window.SIMS.lab_osmosis_tonicity = { mount: mount, draw: draw };
})();

// =========================================================================
// 3. SIMULATION 3: Cell Wall & Plasmolysis (lab_plant_cell_wall_plasmolysis)
// =========================================================================
(function(){
  var simState = {
    state: "turgid" // "turgid", "plasmolysed"
  };

  function mount(lesson){
    simState.state = "turgid";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Cellulose Cell Wall (Rigid)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Plasma Membrane (Flexible)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Central Vacuole (Sap)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p3-turgid">Hypotonic Water: Turgid Cell (Turgor Pressure)</button>' +
      '<button class="preset-btn" id="p3-plasmo">Hypertonic Sugar/Salt: Plasmolysed Cell (Exosmosis)</button>';

    document.getElementById("p3-turgid").addEventListener("click", function(){
      setActivePreset(this);
      simState.state = "turgid";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Turgid plant cell: Vacuole fills with water, pushing outward against plasma membrane and rigid cell wall.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-plasmo").addEventListener("click", function(){
      setActivePreset(this);
      simState.state = "plasmolysed";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Plasmolysis: Water exits via exosmosis. Protoplast shrinks away from the rigid cell wall!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    var wx = 200, wy = 50, ww = 320, wh = 180;

    // Rigid Cellulose Cell Wall (stays constant!)
    svg += '<rect x="' + wx + '" y="' + wy + '" width="' + ww + '" height="' + wh + '" rx="10" fill="none" stroke="#22c55e" stroke-width="6"/>';
    svg += '<text x="' + (wx + 15) + '" y="' + (wy + 22) + '" fill="#22c55e" font-size="12" font-weight="bold">Cellulose Cell Wall</text>';

    if(simState.state === "turgid"){
      // Full Protoplast pushing against wall
      svg += '<rect x="' + (wx + 8) + '" y="' + (wy + 8) + '" width="' + (ww - 16) + '" height="' + (wh - 16) + '" rx="8" fill="#14532d" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2"/>';

      // Huge central vacuole
      svg += '<ellipse cx="' + (wx + 160) + '" cy="' + (wy + 95) + '" rx="110" ry="60" fill="#a855f7" fill-opacity="0.4" stroke="#c084fc" stroke-width="2"/>';
      svg += '<text x="' + (wx + 160) + '" y="' + (wy + 95) + '" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">Turgid Central Vacuole (90% Volume)</text>';

      // Peripheral Nucleus
      svg += '<circle cx="' + (wx + 280) + '" cy="' + (wy + 50) + '" r="14" fill="#ef4444"/><text x="' + (wx + 280) + '" y="' + (wy + 54) + '" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">N</text>';

      // Turgor pressure outward arrows
      svg += '<path d="M ' + (wx + 160) + ' 75 L ' + (wx + 160) + ' 45" stroke="#fbbf24" stroke-width="2.5"/><polygon points="' + (wx + 156) + ',48 ' + (wx + 160) + ',40 ' + (wx + 164) + ',48" fill="#fbbf24"/>';
      svg += '<path d="M ' + (wx + 160) + ' 115 L ' + (wx + 160) + ' 145" stroke="#fbbf24" stroke-width="2.5"/><polygon points="' + (wx + 156) + ',142 ' + (wx + 160) + ',150 ' + (wx + 164) + ',142" fill="#fbbf24"/>';

      svg += '<text x="360" y="260" fill="#22c55e" font-size="13" font-weight="bold" text-anchor="middle">Turgid Cell: Turgor Pressure = Wall Pressure (Plant stands firm & crunchy)</text>';
    } else {
      // Plasmolysed Shrunken Protoplast
      var shrinkProgress = Math.min(1.0, t / 2.5);
      var pw = (ww - 16) - shrinkProgress * 120;
      var ph = (wh - 16) - shrinkProgress * 70;
      var px = wx + 8 + (shrinkProgress * 60);
      var py = wy + 8 + (shrinkProgress * 35);

      // Hypertonic solution fills gap
      svg += '<rect x="' + (wx + 6) + '" y="' + (wy + 6) + '" width="' + (ww - 12) + '" height="' + (wh - 12) + '" rx="8" fill="#f59e0b" fill-opacity="0.15"/>';
      svg += '<text x="' + (wx + 25) + '" y="' + (wy + 50) + '" fill="#f59e0b" font-size="11">External Hypertonic Solution</text>';

      // Shrunken Protoplast
      svg += '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" rx="20" fill="#14532d" fill-opacity="0.5" stroke="#38bdf8" stroke-width="2.5"/>';
      svg += '<ellipse cx="' + (px + pw/2) + '" cy="' + (py + ph/2) + '" rx="' + (pw/2 - 20) + '" ry="' + (ph/2 - 15) + '" fill="#a855f7" fill-opacity="0.5"/>';
      svg += '<text x="' + (px + pw/2) + '" y="' + (py + ph/2 + 4) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Shrunken Protoplast</text>';

      // Outward Exosmosis arrows
      svg += '<path d="M ' + (px + 10) + ' 140 L ' + (wx + 20) + ' 140" stroke="#38bdf8" stroke-width="2.5"/><polygon points="' + (wx + 25) + ',137 ' + (wx + 15) + ',140 ' + (wx + 25) + ',143" fill="#38bdf8"/>';
      svg += '<text x="360" y="260" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">Plasmolysis: Exosmosis pulls membrane away from rigid cell wall (Tissue goes limp)</text>';
    }

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Condition: <strong>' + (simState.state==='turgid'?'Hypotonic Water':'Hypertonic Solution') + '</strong></span>' +
      '<span>Internal Pressure: <strong style="color:' + (simState.state==='turgid'?'#22c55e':'#ef4444') + ';">' + (simState.state==='turgid'?'High Turgor (Firm)':'Zero Turgor (Flaccid)') + '</strong></span>' +
      '<span>Cell Wall: <strong>Rigid Cellulose Intact</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      simState.state === 'turgid' ? 
      'Cell wall exerts wall pressure preventing lysis, maintaining plant crispness (Activity 2.4 / Carrot Ex 8).' :
      'Exosmosis causes plasmolysis: protoplast shrinks into the center. Foundation of pickle preservation (Deepa Ex 16)!';
  }

  window.SIMS.lab_plant_cell_wall_plasmolysis = { mount: mount, draw: draw };
})();

// =========================================================================
// 4. SIMULATION 4: Nucleus & Endomembrane Transport (lab_nucleus_endomembrane)
// =========================================================================
(function(){
  var simState = {
    step: "rer" // "rer", "golgi", "membrane"
  };

  function mount(lesson){
    simState.step = "rer";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Nucleus (DNA / mRNA)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>RER Ribosomes (Proteins)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Golgi Cisternae (Sorting)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p4-rer">1. RER & SER: Synthesis of Proteins & Lipids</button>' +
      '<button class="preset-btn" id="p4-golgi">2. Golgi Apparatus: Packaging & Glycosylation</button>' +
      '<button class="preset-btn" id="p4-mem">3. Plasma Membrane Fusion (Membrane Biogenesis)</button>';

    document.getElementById("p4-rer").addEventListener("click", function(){
      setActivePreset(this);
      simState.step = "rer";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Ribosomes on RER synthesize proteins; SER synthesizes lipids. Transport vesicles bud off towards the Golgi!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-golgi").addEventListener("click", function(){
      setActivePreset(this);
      simState.step = "golgi";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Golgi cisternae modify proteins (adding carbohydrate tags) and sort them into secretory vesicles.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-mem").addEventListener("click", function(){
      setActivePreset(this);
      simState.step = "membrane";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Membrane Biogenesis: Vesicles fuse with the plasma membrane, incorporating fresh proteins and lipids!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    // Nucleus on left
    svg += '<circle cx="60" cy="140" r="90" fill="#581c87" stroke="#a855f7" stroke-width="3"/>';
    svg += '<text x="75" y="145" fill="#fff" font-size="14" font-weight="bold">Nucleus</text>';

    // Endoplasmic Reticulum (RER & SER)
    svg += '<path d="M 150 70 Q 200 90 150 110 Q 210 130 150 150 Q 200 170 150 190 Q 210 210 150 230" fill="none" stroke="#3b82f6" stroke-width="6"/>';
    // Ribosome dots on RER
    for(var r = 0; r < 8; r++){
      svg += '<circle cx="' + (170 + (r % 2) * 15) + '" cy="' + (80 + r * 18) + '" r="3.5" fill="#fca5a5"/>';
    }
    svg += '<text x="175" y="60" fill="#93c5fd" font-size="11" font-weight="bold">RER & SER</text>';

    // Transport Vesicles traveling to Golgi
    var vX = 230 + (t * 20 % 70);
    svg += '<circle cx="' + vX + '" cy="135" r="9" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>';
    svg += '<text x="260" y="115" fill="#38bdf8" font-size="10">Transport Vesicle</text>';

    // Golgi Apparatus Cisternae
    svg += '<g transform="translate(360, 60)">';
    for(var g = 0; g < 4; g++){
      var gx = g * 16;
      svg += '<path d="M ' + gx + ' 20 Q ' + (gx + 12) + ' 80 ' + gx + ' 140" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>';
    }
    svg += '<text x="25" y="10" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Golgi Complex</text>';
    svg += '</g>';

    // Secretory Vesicle traveling to Membrane
    var svX = 450 + (t * 22 % 160);
    svg += '<circle cx="' + svX + '" cy="140" r="10" fill="#10b981" stroke="#fff" stroke-width="1.5"/>';
    svg += '<text x="490" y="115" fill="#10b981" font-size="10">Secretory Vesicle</text>';

    // Plasma Membrane on right
    svg += '<line x1="650" y1="20" x2="650" y2="260" stroke="#38bdf8" stroke-width="6"/>';
    svg += '<text x="640" y="40" fill="#38bdf8" font-size="12" font-weight="bold" transform="rotate(-90, 640, 40)" text-anchor="end">Plasma Membrane</text>';

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Active Step: <strong>' + (simState.step==='rer'?'ER Synthesis':(simState.step==='golgi'?'Golgi Packaging':'Membrane Fusion')) + '</strong></span>' +
      '<span>Cargo: <strong>Proteins (RER) + Lipids (SER)</strong></span>' +
      '<span>Process: <strong style="color:#10b981;">Membrane Biogenesis (Ex 14)</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      'RER ribosomes build proteins & SER builds lipids &rarr; Golgi modifies and sorts &rarr; Vesicles fuse to replenish the plasma membrane!';
  }

  window.SIMS.lab_nucleus_endomembrane = { mount: mount, draw: draw };
})();

// =========================================================================
// 5. SIMULATION 5: Mitochondria, Plastids & Lysosomes (lab_organelles_mitochondria_plastids)
// =========================================================================
(function(){
  var simState = {
    organelle: "mito" // "mito", "chloro", "lyso"
  };

  function mount(lesson){
    simState.organelle = "mito";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Mitochondrial Cristae (ATP)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Chloroplast Thylakoids (Grana)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Autonomous DNA & Ribosomes</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p5-mito">Mitochondrion: Cristae Folds & 36 ATP Synthesis</button>' +
      '<button class="preset-btn" id="p5-chloro">Chloroplast: Thylakoid Grana (Photosynthesis)</button>' +
      '<button class="preset-btn" id="p5-lyso">Lysosome: Hydrolytic Enzymes (Suicide Bag Autolysis)</button>';

    document.getElementById("p5-mito").addEventListener("click", function(){
      setActivePreset(this);
      simState.organelle = "mito";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Mitochondrion: Double membrane with cristae folds. Own circular DNA and 70S ribosomes produce 36–38 ATP via respiration!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-chloro").addEventListener("click", function(){
      setActivePreset(this);
      simState.organelle = "chloro";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Chloroplast: Double membrane enclosing stroma and disc-like thylakoids stacked into grana for solar energy capture.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-lyso").addEventListener("click", function(){
      setActivePreset(this);
      simState.organelle = "lyso";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Lysosome: Membrane vesicle containing ~50 acid hydrolase enzymes for cellular waste breakdown and autolysis.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    var cx = 360, cy = 140;

    if(simState.organelle === "mito"){
      // Mitochondrion Oval Outer Membrane
      svg += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="180" ry="90" fill="#7f1d1d" fill-opacity="0.3" stroke="#ef4444" stroke-width="3"/>';

      // Deeply Folded Cristae Inner Membrane
      svg += '<path d="M 210 140 Q 230 90 260 140 Q 290 190 320 140 Q 350 80 380 140 Q 410 200 440 140 Q 470 90 510 140" fill="none" stroke="#f87171" stroke-width="4"/>';

      // DNA Loop
      svg += '<circle cx="280" cy="110" r="14" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,2"/>';
      svg += '<text x="280" y="90" fill="#fbbf24" font-size="10" text-anchor="middle">mtDNA</text>';

      // Ribosome 70S dots
      for(var i = 0; i < 10; i++){
        svg += '<circle cx="' + (250 + i * 22) + '" cy="' + (155 + (i % 3) * 8) + '" r="2.5" fill="#38bdf8"/>';
      }

      svg += '<text x="360" y="40" fill="#ef4444" font-size="15" font-weight="bold" text-anchor="middle">Mitochondrion: Powerhouse of the Cell (Aerobic Respiration)</text>';
      svg += '<text x="360" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">Cristae maximize surface area for ATP synthase: Glucose + O₂ &rarr; 36&ndash;38 ATP!</text>';
    } else if(simState.organelle === "chloro"){
      // Chloroplast Oval
      svg += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="180" ry="90" fill="#14532d" fill-opacity="0.4" stroke="#22c55e" stroke-width="3"/>';

      // Thylakoid Grana Stacks
      var granaX = [260, 330, 400, 470];
      granaX.forEach(function(gx){
        for(var d = 0; d < 4; d++){
          svg += '<ellipse cx="' + gx + '" cy="' + (115 + d * 14) + '" rx="20" ry="6" fill="#15803d" stroke="#86efac" stroke-width="1.5"/>';
        }
      });

      // DNA loop
      svg += '<circle cx="360" cy="80" r="12" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,2"/>';
      svg += '<text x="360" y="65" fill="#fbbf24" font-size="10" text-anchor="middle">cpDNA</text>';

      svg += '<text x="360" y="40" fill="#22c55e" font-size="15" font-weight="bold" text-anchor="middle">Chloroplast: Kitchen of the Plant Cell (Photosynthesis)</text>';
      svg += '<text x="360" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">Thylakoid grana contain chlorophyll for solar capture: 6 CO₂ + 6 H₂O &rarr; Glucose + 6 O₂</text>';
    } else {
      // Lysosome Spherical Vesicle
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="85" fill="#451a03" fill-opacity="0.5" stroke="#f59e0b" stroke-width="3"/>';
      // Digestive enzyme particles inside
      for(var e = 0; e < 20; e++){
        var ex = cx + ((e * 27) % 110) - 55;
        var ey = cy + ((e * 39) % 110) - 55;
        svg += '<circle cx="' + ex + '" cy="' + ey + '" r="4" fill="#fbbf24"/>';
      }
      svg += '<text x="360" y="40" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">Lysosome: Waste Disposal & Suicide Bag</text>';
      svg += '<text x="360" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">Contains acid hydrolases (pH ~4.8) for autolysis and defense against foreign invaders</text>';
    }

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Organelle: <strong>' + (simState.organelle==='mito'?'Mitochondrion':(simState.organelle==='chloro'?'Chloroplast':'Lysosome')) + '</strong></span>' +
      '<span>Genome: <strong>' + (simState.organelle==='lyso'?'None':'Circular DNA + 70S Ribosomes') + '</strong></span>' +
      '<span>Output: <strong style="color:#10b981;">' + (simState.organelle==='mito'?'ATP Energy Currency':(simState.organelle==='chloro'?'Glucose Food':'Hydrolytic Digestion')) + '</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      simState.organelle === 'mito' ? 
      'Mitochondria provide cellular ATP via aerobic respiration. Removal causes bioenergetic cell death (Ex 12)!' :
      (simState.organelle === 'chloro' ? 'Chloroplasts synthesize glucose; both mitochondria and chloroplasts contain autonomous DNA (Ex 7).' : 'Lysosomes degrade cellular debris; damaged cells undergo autolytic self-digestion.');
  }

  window.SIMS.lab_organelles_mitochondria_plastids = { mount: mount, draw: draw };
})();

// =========================================================================
// 6. SIMULATION 6: Comparative Cell Architect (lab_plant_vs_animal_prokaryote)
// =========================================================================
(function(){
  var simState = {
    cellType: "plant" // "plant", "animal", "prok"
  };

  function mount(lesson){
    simState.cellType = "plant";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Cell Wall (Plant & Bacteria)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>True Nucleus (Eukaryotes)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Nucleoid (Prokaryotes)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p6-plant">Plant Cell (Cell Wall, Plastids, Large Vacuole)</button>' +
      '<button class="preset-btn" id="p6-animal">Animal Cell (Centrosome, Flexible Membrane)</button>' +
      '<button class="preset-btn" id="p6-prok">Bacterial Cell (Prokaryote: Nucleoid, No Organelles)</button>';

    document.getElementById("p6-plant").addEventListener("click", function(){
      setActivePreset(this);
      simState.cellType = "plant";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Plant cell: Outer cellulose cell wall, green chloroplasts, large central sap vacuole, and peripheral nucleus.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-animal").addEventListener("click", function(){
      setActivePreset(this);
      simState.cellType = "animal";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Animal cell: Flexible plasma membrane, centrioles/centrosome for cell division, central nucleus, and small vacuoles.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-prok").addEventListener("click", function(){
      setActivePreset(this);
      simState.cellType = "prok";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Prokaryotic bacterium: No nuclear envelope (nucleoid), flagellum, capsule, and zero membrane-bound organelles.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    var cx = 360, cy = 140;

    if(simState.cellType === "plant"){
      // Plant Cell Outline
      svg += '<polygon points="200,60 520,60 540,220 180,220" fill="#14532d" fill-opacity="0.2" stroke="#22c55e" stroke-width="5"/>';
      // Plasma membrane inside
      svg += '<polygon points="206,66 514,66 534,214 186,214" fill="none" stroke="#38bdf8" stroke-width="2"/>';

      // Huge Vacuole
      svg += '<ellipse cx="360" cy="140" rx="90" ry="50" fill="#a855f7" fill-opacity="0.3" stroke="#c084fc"/>';
      svg += '<text x="360" y="145" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Large Central Vacuole</text>';

      // Peripheral Nucleus
      svg += '<circle cx="460" cy="100" r="18" fill="#581c87" stroke="#a855f7" stroke-width="2"/><text x="460" y="104" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Nucleus</text>';

      // Chloroplasts
      svg += '<ellipse cx="250" cy="100" rx="16" ry="10" fill="#15803d" stroke="#86efac"/><ellipse cx="270" cy="180" rx="16" ry="10" fill="#15803d" stroke="#86efac"/>';

      svg += '<text x="360" y="35" fill="#22c55e" font-size="15" font-weight="bold" text-anchor="middle">Eukaryotic Plant Cell (Rigid & Photosynthetic)</text>';
    } else if(simState.cellType === "animal"){
      // Animal Cell Flexible Outline
      svg += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="150" ry="85" fill="#0284c7" fill-opacity="0.15" stroke="#38bdf8" stroke-width="3"/>';

      // Central Nucleus
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="30" fill="#581c87" stroke="#a855f7" stroke-width="2.5"/>';
      svg += '<text x="' + cx + '" y="' + (cy + 5) + '" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Nucleus</text>';

      // Centrosome / Centrioles near nucleus
      svg += '<rect x="' + (cx + 40) + '" y="' + (cy - 35) + '" width="12" height="6" fill="#fbbf24"/>';
      svg += '<rect x="' + (cx + 43) + '" y="' + (cy - 44) + '" width="6" height="12" fill="#fbbf24"/>';
      svg += '<text x="' + (cx + 46) + '" y="' + (cy - 50) + '" fill="#fbbf24" font-size="10" text-anchor="middle">Centrioles</text>';

      // Mitochondria
      svg += '<ellipse cx="260" cy="120" rx="18" ry="10" fill="#b91c1c" stroke="#f87171"/>';
      svg += '<ellipse cx="440" cy="160" rx="18" ry="10" fill="#b91c1c" stroke="#f87171"/>';

      svg += '<text x="360" y="35" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">Eukaryotic Animal Cell (Flexible & Motile)</text>';
    } else {
      // Bacterial Cell
      svg += '<rect x="240" y="90" width="240" height="100" rx="45" fill="#451a03" fill-opacity="0.4" stroke="#f59e0b" stroke-width="3"/>';
      svg += '<text x="360" y="75" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">Peptidoglycan Cell Wall + Capsule</text>';

      // Nucleoid (Tangled circular DNA with NO membrane)
      svg += '<path d="M 310 140 Q 340 115 360 140 Q 380 165 410 140 Q 380 120 340 145" fill="none" stroke="#fbbf24" stroke-width="3" stroke-dasharray="4,2"/>';
      svg += '<text x="360" y="145" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Nucleoid (No Membrane!)</text>';

      // Flagellum
      svg += '<path d="M 240 140 Q 180 110 140 150 Q 100 190 60 140" fill="none" stroke="#94a3b8" stroke-width="3"/>';
      svg += '<text x="140" y="125" fill="#94a3b8" font-size="10">Flagellum</text>';

      svg += '<text x="360" y="35" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">Prokaryotic Cell: Bacteria (Simple, No Organelles)</text>';
    }

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Type: <strong>' + (simState.cellType==='plant'?'Plant (Eukaryote)':(simState.cellType==='animal'?'Animal (Eukaryote)':'Bacterial (Prokaryote)')) + '</strong></span>' +
      '<span>Cell Wall: <strong style="color:' + (simState.cellType==='animal'?'#ef4444':'#22c55e') + ';">' + (simState.cellType==='animal'?'ABSENT':'PRESENT') + '</strong></span>' +
      '<span>Nuclear Membrane: <strong>' + (simState.cellType==='prok'?'ABSENT (Nucleoid)':'PRESENT (True Nucleus)') + '</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      simState.cellType === 'plant' ? 
      'Plant cells have cell walls, plastids, and a 90% volume vacuole (Ex 4 / Ex 9).' :
      (simState.cellType === 'animal' ? 'Animal cells possess centrioles and flexible membranes without cell walls.' : 'Prokaryotes lack membrane-bound organelles and a true nucleus; genome is unshielded nucleoid.');
  }

  window.SIMS.lab_plant_vs_animal_prokaryote = { mount: mount, draw: draw };
})();

// =========================================================================
// 7. SIMULATION 7: Cell Division Simulator (lab_cell_division_mitosis_meiosis)
// =========================================================================
(function(){
  var simState = {
    mode: "mitosis" // "mitosis", "meiosis"
  };

  function mount(lesson){
    simState.mode = "mitosis";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Paternal Chromosome</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Maternal Chromosome</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Daughter Cell Formation</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p7-mito">Mitosis: 2n &rarr; 2 Identical Diploid Cells (Growth & Repair)</button>' +
      '<button class="preset-btn" id="p7-meio">Meiosis: 2n &rarr; 4 Haploid Gametes (n) (Reproduction)</button>';

    document.getElementById("p7-mito").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "mitosis";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Mitosis: Equational division. Sister chromatids separate into 2 identical diploid (2n) daughter cells.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-meio").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "meiosis";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Meiosis: Two divisions halve chromosomes into 4 haploid (n) gametes, preventing chromosome doubling (Ex 15)!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    if(simState.mode === "mitosis"){
      // Mitosis: 1 cell -> 2 cells
      // Parent cell
      svg += '<circle cx="180" cy="140" r="60" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="180" y="95" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Parent Cell (2n)</text>';
      svg += '<line x1="170" y1="125" x2="170" y2="155" stroke="#3b82f6" stroke-width="4"/>';
      svg += '<line x1="190" y1="125" x2="190" y2="155" stroke="#ef4444" stroke-width="4"/>';

      // Arrow
      svg += '<line x1="260" y1="140" x2="350" y2="140" stroke="#10b981" stroke-width="3"/>';
      svg += '<polygon points="350,135 365,140 350,145" fill="#10b981"/>';
      svg += '<text x="305" y="130" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Equational Mitosis</text>';

      // Two Daughter Cells (2n each)
      svg += '<circle cx="460" cy="80" r="45" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
      svg += '<text x="460" y="55" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Daughter 1 (2n)</text>';
      svg += '<line x1="453" y1="70" x2="453" y2="90" stroke="#3b82f6" stroke-width="3"/>';
      svg += '<line x1="467" y1="70" x2="467" y2="90" stroke="#ef4444" stroke-width="3"/>';

      svg += '<circle cx="460" cy="200" r="45" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
      svg += '<text x="460" y="175" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Daughter 2 (2n)</text>';
      svg += '<line x1="453" y1="190" x2="453" y2="210" stroke="#3b82f6" stroke-width="3"/>';
      svg += '<line x1="467" y1="190" x2="467" y2="210" stroke="#ef4444" stroke-width="3"/>';

      svg += '<text x="360" y="260" fill="#94a3b8" font-size="12" text-anchor="middle">Mitosis: 1 division &rarr; 2 identical diploid cells (used for body growth and healing cuts)</text>';
    } else {
      // Meiosis: 1 cell (2n) -> 4 haploid gametes (n)
      svg += '<circle cx="130" cy="140" r="50" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="130" y="105" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">Germline (2n)</text>';
      svg += '<line x1="123" y1="130" x2="123" y2="150" stroke="#3b82f6" stroke-width="3"/>';
      svg += '<line x1="137" y1="130" x2="137" y2="150" stroke="#ef4444" stroke-width="3"/>';

      // Intermediate 2 cells (Meiosis I)
      svg += '<path d="M 200 140 L 270 100" stroke="#a855f7" stroke-width="2"/>';
      svg += '<path d="M 200 140 L 270 180" stroke="#a855f7" stroke-width="2"/>';
      svg += '<circle cx="290" cy="95" r="28" fill="#1e293b" stroke="#a855f7"/>';
      svg += '<circle cx="290" cy="185" r="28" fill="#1e293b" stroke="#a855f7"/>';

      // 4 Final Gametes (Meiosis II)
      var gy = [50, 110, 170, 230];
      gy.forEach(function(y, idx){
        svg += '<path d="M 325 ' + (idx < 2 ? 95 : 185) + ' L 460 ' + y + '" stroke="#10b981" stroke-width="1.5"/>';
        svg += '<circle cx="490" cy="' + y + '" r="22" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
        svg += '<text x="490" y="' + (y + 4) + '" fill="#10b981" font-size="10" font-weight="bold" text-anchor="middle">n</text>';
      });

      svg += '<text x="590" y="145" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">4 Gametes (Haploid n)</text>';
      svg += '<text x="360" y="260" fill="#94a3b8" font-size="12" text-anchor="middle">Meiosis: 2 successive divisions halve chromosomes (2n &rarr; n). Halving prevents chromosome doubling in zygote (Ex 15)!</text>';
    }

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Division: <strong>' + (simState.mode==='mitosis'?'Mitosis (Equational)':'Meiosis (Reductional)') + '</strong></span>' +
      '<span>Daughter Cells: <strong style="color:#10b981;">' + (simState.mode==='mitosis'?'2 Cells (2n)':'4 Gametes (n)') + '</strong></span>' +
      '<span>Function: <strong>' + (simState.mode==='mitosis'?'Somatic Growth & Repair':'Sexual Reproduction') + '</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      simState.mode === 'mitosis' ? 
      'Mitosis creates identical copies for organismal growth. Cell Theory: Omnis cellula-e cellula (Virchow 1855)!' :
      'Meiosis halves chromosome count into haploid gametes. If mitotic, chromosome number would double every generation (Ex 15)!';
  }

  window.SIMS.lab_cell_division_mitosis_meiosis = { mount: mount, draw: draw };
})();