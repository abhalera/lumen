var App = window.App;
window.SIMS = {};

function setActivePreset(btn){
  document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
  if(btn) btn.classList.add("active");
}

// =========================================================================
// 1. SIMULATION 1: Thomson Plum Pudding & Cathode Ray Tube (lab_roots_thomson)
// =========================================================================
(function(){
  var simState = {
    mode: "thomson", // "thomson", "crt_pos", "crt_neg", "crt_off"
    eField: 0
  };

  function mount(lesson){
    simState.mode = "thomson";
    simState.eField = 0;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Positive Sphere (+Q)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Negative Electrons (&minus;)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Phosphor Screen Deflection</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p1-thomson">Watermelon Model (Thomson 1904)</button>' +
      '<button class="preset-btn" id="p1-crt-pos">Cathode Ray: Top Plate (+)</button>' +
      '<button class="preset-btn" id="p1-crt-neg">Cathode Ray: Top Plate (&minus;)</button>';

    document.getElementById("p1-thomson").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "thomson";
      simState.eField = 0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Thomson watermelon model: Negative electrons embedded like seeds in a continuous uniform sphere of positive charge.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-crt-pos").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "crt_pos";
      simState.eField = 1;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Cathode ray deflects toward positive plate (+), proving rays consist of negatively charged subatomic particles (electrons)!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-crt-neg").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "crt_neg";
      simState.eField = -1;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Negative plate repels cathode rays downward, reinforcing negative electrical charge.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    if(simState.mode === "thomson"){
      // Watermelon Sphere
      svg += '<defs><radialGradient id="thGrad" cx="40%" cy="40%" r="60%">' +
             '<stop offset="0%" stop-color="#fda4af"/>' +
             '<stop offset="60%" stop-color="#f43f5e"/>' +
             '<stop offset="100%" stop-color="#be123c"/>' +
             '</radialGradient></defs>';
      svg += '<circle cx="360" cy="135" r="95" fill="url(#thGrad)" stroke="#e11d48" stroke-width="3"/>';
      svg += '<text x="360" y="35" text-anchor="middle" fill="#f43f5e" font-size="14" font-weight="bold">Sphere of Positive Charge (+Q)</text>';

      // Embedded electrons
      var seeds = [
        {x: 320, y: 105}, {x: 400, y: 100}, {x: 295, y: 145},
        {x: 360, y: 135}, {x: 430, y: 150}, {x: 330, y: 175},
        {x: 390, y: 180}, {x: 350, y: 85},  {x: 370, y: 165},
        {x: 300, y: 115}, {x: 420, y: 125}, {x: 360, y: 105}
      ];
      seeds.forEach(function(s){
        svg += '<circle cx="' + s.x + '" cy="' + s.y + '" r="9" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>';
        svg += '<text x="' + s.x + '" y="' + (s.y + 4) + '" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">&minus;</text>';
      });

      svg += '<text x="360" y="255" text-anchor="middle" fill="#94a3b8" font-size="12">J.J. Thomson (1904): Atom is electrically neutral overall: Total Positive Charge = Total Negative Charge</text>';

      document.getElementById("diagram").innerHTML = svg + '</svg>';
      document.getElementById("lab-readout").innerHTML = 
        '<span>Model: <strong>Watermelon / Plum Pudding</strong></span>' +
        '<span>Net Charge: <strong style="color:#10b981;">0 C (Neutral)</strong></span>' +
        '<span>Electrons Embedded: <strong>12</strong></span>';
      document.getElementById("lab-verdict").innerHTML = 
        'Thomson model proved atoms are divisible and established electrical neutrality, but lacked a central nucleus.';
    } else {
      // Cathode Ray Tube
      var deflY = simState.eField === 1 ? 85 : (simState.eField === -1 ? 185 : 135);
      var pTopColor = simState.eField === 1 ? '#ef4444' : '#3b82f6';
      var pBotColor = simState.eField === 1 ? '#3b82f6' : '#ef4444';

      svg += '<rect x="80" y="60" width="560" height="150" rx="30" fill="none" stroke="#475569" stroke-width="3"/>';
      svg += '<text x="110" y="50" fill="#94a3b8" font-size="12">Cathode Ray Tube (Discharge Tube at 0.001 mmHg)</text>';

      // Cathode & Anode
      svg += '<rect x="105" y="95" width="10" height="80" fill="#64748b"/>';
      svg += '<text x="110" y="195" fill="#f87171" font-size="11" text-anchor="middle">Cathode (&minus;)</text>';

      svg += '<rect x="175" y="95" width="10" height="80" fill="#64748b"/>';
      svg += '<line x1="180" y1="130" x2="180" y2="140" stroke="#0f172a" stroke-width="4"/>';
      svg += '<text x="180" y="195" fill="#38bdf8" font-size="11" text-anchor="middle">Anode (+)</text>';

      // Deflection Plates
      svg += '<rect x="310" y="70" width="120" height="10" rx="2" fill="' + pTopColor + '"/>';
      svg += '<text x="370" y="65" fill="' + pTopColor + '" font-size="11" font-weight="bold" text-anchor="middle">' + 
             (simState.eField === 1 ? '+ + + Top Plate (+1000 V)' : '&minus; &minus; &minus; Top Plate (&minus;1000 V)') + '</text>';

      svg += '<rect x="310" y="190" width="120" height="10" rx="2" fill="' + pBotColor + '"/>';
      svg += '<text x="370" y="215" fill="' + pBotColor + '" font-size="11" font-weight="bold" text-anchor="middle">' + 
             (simState.eField === 1 ? '&minus; &minus; &minus; Bottom Plate (&minus;1000 V)' : '+ + + Bottom Plate (+1000 V)') + '</text>';

      // Screen
      svg += '<line x1="620" y1="80" x2="620" y2="190" stroke="#22c55e" stroke-width="5"/>';
      svg += '<text x="620" y="205" fill="#22c55e" font-size="10" text-anchor="middle">ZnS Screen</text>';

      // Beam Path
      svg += '<path d="M 115 135 L 310 135 Q 430 135 620 ' + deflY + '" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-dasharray="8,4"/>';
      svg += '<circle cx="620" cy="' + deflY + '" r="7" fill="#4ade80"/>';

      document.getElementById("diagram").innerHTML = svg + '</svg>';
      document.getElementById("lab-readout").innerHTML = 
        '<span>Beam Type: <strong>Cathode Rays (Electrons)</strong></span>' +
        '<span>Deflection: <strong style="color:#38bdf8;">' + (simState.eField === 1 ? 'Upward toward (+)' : 'Downward toward (-)') + '</strong></span>' +
        '<span>Particle Charge: <strong>&minus;1.602 &times; 10⁻¹⁹ C</strong></span>';
      document.getElementById("lab-verdict").innerHTML = 
        simState.eField === 1 ? 
        'Attraction toward the positive electrode conclusively proved cathode rays are streams of negatively charged subatomic particles!' :
        'Electrostatic repulsion from the negative plate confirms like charges repel.';
    }
  }

  window.SIMS.lab_roots_thomson = { mount: mount, draw: draw };
})();

// =========================================================================
// 2. SIMULATION 2: Rutherford Gold Foil Alpha Scattering (lab_rutherford)
// =========================================================================
(function(){
  var simState = {
    layer: 1 // 1: thin, 2: thick
  };

  function mount(lesson){
    simState.layer = 1;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Heavy Gold Nucleus (+79e)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Alpha Trajectory (He²⁺)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Circular ZnS Detector Screen</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p2-thin">Thin Gold Foil (~1000 Atoms)</button>' +
      '<button class="preset-btn" id="p2-thick">Thick Gold Foil (Multiple Deflections)</button>';

    document.getElementById("p2-thin").addEventListener("click", function(){
      setActivePreset(this);
      simState.layer = 1;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Over 99% of alpha particles pass undeflected through atomic empty space; only 1 in 20,000 rebounds from the tiny dense nucleus!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-thick").addEventListener("click", function(){
      setActivePreset(this);
      simState.layer = 2;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Thicker gold foil increases cumulative scattering angles as alpha particles encounter more consecutive nuclei.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    // Circular Scintillation Screen
    svg += '<path d="M 360 25 A 220 220 0 1 1 360 255" fill="none" stroke="#22c55e" stroke-width="4" stroke-dasharray="6,4" opacity="0.8"/>';
    svg += '<text x="680" y="260" fill="#22c55e" font-size="11" text-anchor="end">Circular Scintillation Screen (ZnS)</text>';

    // Alpha Source Collimator
    svg += '<rect x="30" y="115" width="40" height="50" rx="4" fill="#334155" stroke="#64748b"/>';
    svg += '<text x="50" y="110" fill="#94a3b8" font-size="10" text-anchor="middle">α Emitter (²¹⁴Bi)</text>';

    // Gold Nuclei
    var nuclei = simState.layer === 1 ? 
      [{x: 360, y: 65}, {x: 360, y: 140}, {x: 360, y: 215}] :
      [{x: 350, y: 65}, {x: 350, y: 140}, {x: 350, y: 215}, {x: 380, y: 80}, {x: 380, y: 160}, {x: 380, y: 230}];

    nuclei.forEach(function(n){
      svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="50" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3,3" opacity="0.3"/>';
      svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="7" fill="#ef4444" stroke="#fca5a5" stroke-width="1.5"/>';
      svg += '<text x="' + n.x + '" y="' + (n.y + 3) + '" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">+79</text>';
    });

    // Foil boundary
    svg += '<line x1="360" y1="20" x2="360" y2="260" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6"/>';
    svg += '<text x="360" y="15" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">Gold Foil Sheet (~100 nm)</text>';

    // Animated Alpha Particle Beams
    // Path 1: Straight through top empty space
    svg += '<path d="M 70 85 L 630 85" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    svg += '<circle cx="630" cy="85" r="4" fill="#4ade80"/>';

    // Path 2: Slight deflection near nucleus
    svg += '<path d="M 70 120 L 330 120 Q 360 115 580 40" fill="none" stroke="#fbbf24" stroke-width="2.5"/>';
    svg += '<circle cx="580" cy="40" r="4" fill="#4ade80"/>';

    // Path 3: Direct hit -> Rebounds backwards (>90°)
    svg += '<path d="M 70 140 L 340 140 Q 355 140 310 180 L 140 230" fill="none" stroke="#ef4444" stroke-width="3"/>';
    svg += '<circle cx="140" cy="230" r="5" fill="#f87171"/>';
    svg += '<text x="140" y="250" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">1 in 20,000 Rebound (&gt;90&deg;)!</text>';

    // Path 4: Straight through bottom
    svg += '<path d="M 70 175 L 620 175" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    svg += '<circle cx="620" cy="175" r="4" fill="#4ade80"/>';

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Alpha Incident: <strong>20,000 / sec</strong></span>' +
      '<span>Undeflected (&lt;1&deg;): <strong style="color:#38bdf8;">99.9%</strong></span>' +
      '<span>Rebounded (&gt;90&deg;): <strong style="color:#ef4444;">1 in 20,000</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      'Rutherford deduced: Most of the atom is empty space; all positive charge and mass is packed into a tiny central nucleus!';
  }

  window.SIMS.lab_rutherford = { mount: mount, draw: draw };
})();

// =========================================================================
// 3. SIMULATION 3: Bohr Quantized Shells & Photons (lab_bohr)
// =========================================================================
(function(){
  var simState = {
    shell: 1, // 1 (K), 2 (L), 3 (M)
    transition: null
  };

  function mount(lesson){
    simState.shell = 1;
    simState.transition = null;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Positive Nucleus (+Ze)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Quantized Orbit (K, L, M)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Emitted Photon Wavepacket</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p3-k">K-Shell Ground State (n=1, &minus;13.6 eV)</button>' +
      '<button class="preset-btn" id="p3-l">L-Shell Excited (n=2, &minus;3.4 eV)</button>' +
      '<button class="preset-btn" id="p3-balmer">Balmer Drop (n=3 &rarr; n=2, Red 656 nm)</button>';

    document.getElementById("p3-k").addEventListener("click", function(){
      setActivePreset(this);
      simState.shell = 1;
      simState.transition = null;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Electron in lowest energy ground state (K-shell). Zero electromagnetic radiation emitted in stationary orbit.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-l").addEventListener("click", function(){
      setActivePreset(this);
      simState.shell = 2;
      simState.transition = "1->2";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Electron absorbed quantum energy packet ΔE = 10.2 eV to jump from K to L shell.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-balmer").addEventListener("click", function(){
      setActivePreset(this);
      simState.shell = 2;
      simState.transition = "3->2";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Quantum de-excitation: Electron drops from M (n=3) to L (n=2), emitting a red photon (Balmer H-α, 656 nm)!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    var cx = 360, cy = 140;
    var radii = {1: 45, 2: 85, 3: 125};

    // Concentric Orbits
    [1, 2, 3].forEach(function(n){
      var r = radii[n];
      var isCurrent = n === simState.shell;
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + (isCurrent ? '#38bdf8' : '#334155') + '" stroke-width="' + (isCurrent ? 2.5 : 1) + '" stroke-dasharray="' + (isCurrent ? 'none' : '4,4') + '"/>';
      svg += '<text x="' + (cx + r + 6) + '" y="' + (cy - 6) + '" fill="#64748b" font-size="11">' + (n===1?'K (n=1)':(n===2?'L (n=2)':'M (n=3)')) + '</text>';
    });

    // Central Nucleus
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="16" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>';
    svg += '<text x="' + cx + '" y="' + (cy + 5) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">+Ze</text>';

    // Revolving Electron
    var angle = t * 2.5;
    var curR = radii[simState.shell];
    var ex = cx + curR * Math.cos(angle);
    var ey = cy + curR * Math.sin(angle);

    svg += '<circle cx="' + ex + '" cy="' + ey + '" r="7" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>';
    svg += '<text x="' + ex + '" y="' + (ey - 10) + '" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">e&minus;</text>';

    // Photon Wavepacket if transition active
    if(simState.transition === "3->2"){
      var px = cx + 80 + t * 40;
      svg += '<path d="M ' + px + ' 90 q 8 -10 16 0 q 8 10 16 0 q 8 -10 16 0" fill="none" stroke="#ef4444" stroke-width="3"/>';
      svg += '<text x="' + (px + 20) + '" y="75" fill="#ef4444" font-size="11" font-weight="bold">Emitted Red Photon (656 nm)</text>';
    } else if(simState.transition === "1->2"){
      svg += '<text x="100" y="50" fill="#fbbf24" font-size="12" font-weight="bold">Absorbed UV Quanta: &Delta;E = 10.2 eV</text>';
    }

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Active Orbit: <strong>' + (simState.shell===1?'K (n=1)':(simState.shell===2?'L (n=2)':'M (n=3)')) + '</strong></span>' +
      '<span>Energy Level: <strong>' + (simState.shell===1?'&minus;13.6 eV':(simState.shell===2?'&minus;3.4 eV':'&minus;1.51 eV')) + '</strong></span>' +
      '<span>Radiation: <strong style="color:#10b981;">0 in stationary state</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      simState.transition === "3->2" ? 
      'Electron drops from n=3 to n=2, releasing energy as a characteristic red photon! Explains line emission spectra.' :
      'Bohr resolved atomic collapse: Electrons revolve in non-radiating discrete orbits of definite energy!';
  }

  window.SIMS.lab_bohr = { mount: mount, draw: draw };
})();

// =========================================================================
// 4. SIMULATION 4: Subatomic Trio & BARC Dhruva Reactor (lab_subatomic)
// =========================================================================
(function(){
  var simState = {
    view: "balance" // "balance", "barc"
  };

  function mount(lesson){
    simState.view = "balance";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Electron (e⁻, 1/1840 u)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Proton (p⁺, 1 u)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Neutron (n⁰, 1 u)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p4-balance">Subatomic Mass & Charge Matrix</button>' +
      '<button class="preset-btn" id="p4-barc">BARC Dhruva Reactor Neutron Beam (Mumbai)</button>';

    document.getElementById("p4-balance").addEventListener("click", function(){
      setActivePreset(this);
      simState.view = "balance";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Compare mass and charge: 1 Proton ≈ 1 Neutron ≈ 1 u, while an electron is 1840 times lighter (~0.00054 u)!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-barc").addEventListener("click", function(){
      setActivePreset(this);
      simState.view = "barc";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> BARC Trombay Dhruva reactor harnesses neutral thermal neutrons to probe atomic crystal structures without electric deflection!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    if(simState.view === "balance"){
      // Three comparison cards in SVG
      // Electron Card
      svg += '<g transform="translate(60, 40)">' +
             '<rect width="170" height="190" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>' +
             '<circle cx="85" cy="50" r="22" fill="#3b82f6"/>' +
             '<text x="85" y="57" fill="#fff" font-size="20" font-weight="bold" text-anchor="middle">&minus;</text>' +
             '<text x="85" y="95" fill="#93c5fd" font-size="15" font-weight="bold" text-anchor="middle">Electron (e&minus;)</text>' +
             '<text x="85" y="125" fill="#cbd5e1" font-size="12" text-anchor="middle">Charge: &minus;1 (&minus;e)</text>' +
             '<text x="85" y="145" fill="#cbd5e1" font-size="12" text-anchor="middle">Mass: 1/1840 u</text>' +
             '<text x="85" y="170" fill="#64748b" font-size="11" text-anchor="middle">J.J. Thomson (1897)</text>' +
             '</g>';

      // Proton Card
      svg += '<g transform="translate(275, 40)">' +
             '<rect width="170" height="190" rx="10" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>' +
             '<circle cx="85" cy="50" r="22" fill="#ef4444"/>' +
             '<text x="85" y="57" fill="#fff" font-size="20" font-weight="bold" text-anchor="middle">+</text>' +
             '<text x="85" y="95" fill="#fca5a5" font-size="15" font-weight="bold" text-anchor="middle">Proton (p+)</text>' +
             '<text x="85" y="125" fill="#cbd5e1" font-size="12" text-anchor="middle">Charge: +1 (+e)</text>' +
             '<text x="85" y="145" fill="#cbd5e1" font-size="12" text-anchor="middle">Mass: 1 u (1.67&times;10⁻²⁷ kg)</text>' +
             '<text x="85" y="170" fill="#64748b" font-size="11" text-anchor="middle">Goldstein / Rutherford</text>' +
             '</g>';

      // Neutron Card
      svg += '<g transform="translate(490, 40)">' +
             '<rect width="170" height="190" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>' +
             '<circle cx="85" cy="50" r="22" fill="#10b981"/>' +
             '<text x="85" y="57" fill="#fff" font-size="18" font-weight="bold" text-anchor="middle">0</text>' +
             '<text x="85" y="95" fill="#6ee7b7" font-size="15" font-weight="bold" text-anchor="middle">Neutron (n0)</text>' +
             '<text x="85" y="125" fill="#cbd5e1" font-size="12" text-anchor="middle">Charge: 0 (Neutral)</text>' +
             '<text x="85" y="145" fill="#cbd5e1" font-size="12" text-anchor="middle">Mass: 1 u (1.67&times;10⁻²⁷ kg)</text>' +
             '<text x="85" y="170" fill="#64748b" font-size="11" text-anchor="middle">James Chadwick (1932)</text>' +
             '</g>';

      document.getElementById("diagram").innerHTML = svg + '</svg>';
      document.getElementById("lab-readout").innerHTML = 
        '<span>Nucleon Mass: <strong>99.95% in nucleus</strong></span>' +
        '<span>Electron Mass: <strong>0.05%</strong></span>' +
        '<span>Charge Neutrality: <strong>p = e</strong></span>';
      document.getElementById("lab-verdict").innerHTML = 
        'Protons and neutrons form the dense central nucleus (nucleons), while electrons orbit outside providing atomic volume.';
    } else {
      // BARC Dhruva Reactor Scene
      svg += '<rect x="60" y="50" width="160" height="170" rx="12" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>';
      svg += '<text x="140" y="80" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">Dhruva Reactor</text>';
      svg += '<text x="140" y="100" fill="#94a3b8" font-size="11" text-anchor="middle">BARC Trombay, Mumbai</text>';
      svg += '<circle cx="140" cy="150" r="30" fill="#f59e0b" opacity="0.25"/>';
      svg += '<circle cx="140" cy="150" r="16" fill="#fbbf24"/>';

      // Shutter & Beam
      svg += '<rect x="220" y="140" width="40" height="20" fill="#475569"/>';
      svg += '<line x1="260" y1="150" x2="450" y2="150" stroke="#10b981" stroke-width="3.5" stroke-dasharray="8,4"/>';
      svg += '<text x="350" y="135" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Thermal Neutron Beam (n⁰)</text>';

      // Target crystal
      svg += '<polygon points="450,130 500,110 530,160 480,180" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="490" y="205" fill="#38bdf8" font-size="12" text-anchor="middle">Superconductor Sample</text>';

      // Scattered rays
      svg += '<path d="M 500 135 L 610 75" stroke="#34d399" stroke-width="2.5" stroke-dasharray="4,2"/>';
      svg += '<path d="M 500 135 L 620 145" stroke="#34d399" stroke-width="2.5" stroke-dasharray="4,2"/>';
      svg += '<path d="M 500 135 L 610 215" stroke="#34d399" stroke-width="2.5" stroke-dasharray="4,2"/>';
      svg += '<rect x="610" y="60" width="45" height="170" rx="8" fill="#334155" stroke="#64748b"/>';
      svg += '<text x="632" y="150" fill="#94a3b8" font-size="11" transform="rotate(90, 632, 150)" text-anchor="middle">Diffraction Detector</text>';

      document.getElementById("diagram").innerHTML = svg + '</svg>';
      document.getElementById("lab-readout").innerHTML = 
        '<span>Facility: <strong>Dhruva 100 MW (BARC)</strong></span>' +
        '<span>Probe: <strong>Thermal Neutrons</strong></span>' +
        '<span>Application: <strong>Materials & Medicine</strong></span>';
      document.getElementById("lab-verdict").innerHTML = 
        'Because neutrons carry zero charge, they penetrate deep into electron clouds to map nuclear crystal positions directly!';
    }
  }

  window.SIMS.lab_subatomic = { mount: mount, draw: draw };
})();

// =========================================================================
// 5. SIMULATION 5: Atomic & Mass Numbers Builder (lab_atomic_mass_number)
// =========================================================================
(function(){
  var simState = {
    p: 6, n: 6, e: 6, sym: 'C', name: 'Carbon'
  };

  function mount(lesson){
    simState.p = 6; simState.n = 6; simState.e = 6; simState.sym = 'C'; simState.name = 'Carbon';
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Mass Number A (p+n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Atomic Number Z (p)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Net Ionic Charge</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p5-c">Carbon-12 (¹²₆C)</button>' +
      '<button class="preset-btn" id="p5-mg">Magnesium-24 (²⁴₁₂Mg - Ex 8)</button>' +
      '<button class="preset-btn" id="p5-ga">Gallium-70 (⁷⁰₃₁Ga - Ex 11)</button>' +
      '<button class="preset-btn" id="p5-cl">Chlorine-35 (³⁵₁₇Cl)</button>';

    document.getElementById("p5-c").addEventListener("click", function(){
      setActivePreset(this);
      simState.p = 6; simState.n = 6; simState.e = 6; simState.sym = 'C'; simState.name = 'Carbon';
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Carbon-12 standard: Z = 6, A = 12, exactly 6 neutrons in the nucleus.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-mg").addEventListener("click", function(){
      setActivePreset(this);
      simState.p = 12; simState.n = 12; simState.e = 12; simState.sym = 'Mg'; simState.name = 'Magnesium';
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Magnesium-24 (NCERT Ex 8): 12 protons, 12 neutrons, and 12 electrons in 2, 8, 2 configuration.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-ga").addEventListener("click", function(){
      setActivePreset(this);
      simState.p = 31; simState.n = 39; simState.e = 31; simState.sym = 'Ga'; simState.name = 'Gallium';
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Gallium-70 (NCERT Ex 11): 31 protons and 70 − 31 = 39 neutrons!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-cl").addEventListener("click", function(){
      setActivePreset(this);
      simState.p = 17; simState.n = 18; simState.e = 17; simState.sym = 'Cl'; simState.name = 'Chlorine';
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Chlorine-35 (NCERT Ex 14): Z = 17, A = 35, containing 18 neutrons.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    var massA = simState.p + simState.n;
    var netQ = simState.p - simState.e;

    // Big Nuclide Tile
    svg += '<g transform="translate(100, 40)">' +
           '<rect width="220" height="200" rx="16" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
           '<text x="55" y="75" fill="#f59e0b" font-size="36" font-weight="bold" text-anchor="end">' + massA + '</text>' +
           '<text x="55" y="145" fill="#ef4444" font-size="36" font-weight="bold" text-anchor="end">' + simState.p + '</text>' +
           '<text x="75" y="130" fill="#f8fafc" font-size="80" font-weight="bold">' + simState.sym + '</text>' +
           '<text x="110" y="185" fill="#94a3b8" font-size="15" text-anchor="middle">' + simState.name + '</text>' +
           '</g>';

    // Nuclear Ledger Breakdown
    svg += '<g transform="translate(370, 40)">' +
           '<rect width="250" height="200" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>' +
           '<text x="125" y="32" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Nuclear Ledger Composition</text>' +
           '<text x="25" y="70" fill="#ef4444" font-size="13">Atomic Number (Z = p):</text>' +
           '<text x="225" y="70" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="end">' + simState.p + '</text>' +
           '<text x="25" y="105" fill="#10b981" font-size="13">Neutrons (n = A &minus; Z):</text>' +
           '<text x="225" y="105" fill="#10b981" font-size="14" font-weight="bold" text-anchor="end">' + simState.n + '</text>' +
           '<text x="25" y="140" fill="#f59e0b" font-size="13">Mass Number (A = p + n):</text>' +
           '<text x="225" y="140" fill="#f59e0b" font-size="16" font-weight="bold" text-anchor="end">' + massA + ' u</text>' +
           '<text x="25" y="175" fill="#38bdf8" font-size="13">Electrons (Neutral e = p):</text>' +
           '<text x="225" y="175" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="end">' + simState.e + '</text>' +
           '</g>';

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Nuclide: <strong>' + massA + '/' + simState.p + ' ' + simState.sym + '</strong></span>' +
      '<span>Neutrons: <strong style="color:#10b981;">' + simState.n + '</strong></span>' +
      '<span>Net Charge: <strong style="color:#38bdf8;">0 (Neutral)</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      'Atomic number (Z = ' + simState.p + ') dictates element identity, while neutrons (n = ' + simState.n + ') determine the isotopic mass number (A = ' + massA + ')!';
  }

  window.SIMS.lab_atomic_mass_number = { mount: mount, draw: draw };
})();

// =========================================================================
// 6. SIMULATION 6: Bohr-Bury Shell Architect & Valency (lab_bohr_bury)
// =========================================================================
(function(){
  var simState = {
    z: 11, sym: 'Na', name: 'Sodium', k: 2, l: 8, m: 1
  };

  function mount(lesson){
    simState.z = 11; simState.sym = 'Na'; simState.name = 'Sodium'; simState.k = 2; simState.l = 8; simState.m = 1;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Nucleus (Z Protons)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Paired Inner Electrons</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Valence Electrons (Outermost)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p6-na">Sodium (Z=11: 2, 8, 1 &rarr; Valency 1)</button>' +
      '<button class="preset-btn" id="p6-cl">Chlorine (Z=17: 2, 8, 7 &rarr; Valency 1)</button>' +
      '<button class="preset-btn" id="p6-ar">Argon (Z=18: 2, 8, 8 &rarr; Valency 0 Octet)</button>' +
      '<button class="preset-btn" id="p6-c">Carbon (Z=6: 2, 4 &rarr; Valency 4)</button>';

    document.getElementById("p6-na").addEventListener("click", function(){
      setActivePreset(this);
      simState.z = 11; simState.sym = 'Na'; simState.name = 'Sodium'; simState.k = 2; simState.l = 8; simState.m = 1;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Sodium: 1 valence electron in M-shell. Readily loses 1 e⁻ to achieve stable neon octet: Valency = 1!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-cl").addEventListener("click", function(){
      setActivePreset(this);
      simState.z = 17; simState.sym = 'Cl'; simState.name = 'Chlorine'; simState.k = 2; simState.l = 8; simState.m = 7;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Chlorine: 7 valence electrons in M-shell. Gains 1 e⁻ to complete octet: Valency = 8 − 7 = 1!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-ar").addEventListener("click", function(){
      setActivePreset(this);
      simState.z = 18; simState.sym = 'Ar'; simState.name = 'Argon'; simState.k = 2; simState.l = 8; simState.m = 8;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Argon: Complete stable octet of 8 electrons in outermost M-shell. Inert noble gas: Valency = 0!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-c").addEventListener("click", function(){
      setActivePreset(this);
      simState.z = 6; simState.sym = 'C'; simState.name = 'Carbon'; simState.k = 2; simState.l = 4; simState.m = 0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Carbon: 4 valence electrons in L-shell. Shares 4 electrons: Valency = 4 (tetravalent)!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    var cx = 360, cy = 140;
    var config = [simState.k, simState.l, simState.m].filter(function(n){ return n > 0; });
    var valence = config[config.length - 1];
    var valency = valence <= 4 ? valence : (8 - valence);
    if(simState.z === 2) valency = 0; // helium duplet

    // Shell Radii
    var sData = [
      {r: 45, count: simState.k, name: 'K'},
      {r: 85, count: simState.l, name: 'L'},
      {r: 125, count: simState.m, name: 'M'}
    ];

    sData.forEach(function(s, idx){
      if(s.count === 0 && idx > config.length - 1) return;
      var isOutermost = idx === config.length - 1;
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + s.r + '" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="3,3"/>';

      for(var i = 0; i < s.count; i++){
        var theta = (i / s.count) * 2 * Math.PI - Math.PI / 2 + (t * 0.4 / (idx + 1));
        var ex = cx + s.r * Math.cos(theta);
        var ey = cy + s.r * Math.sin(theta);
        var color = isOutermost ? '#fbbf24' : '#38bdf8';
        svg += '<circle cx="' + ex + '" cy="' + ey + '" r="6" fill="' + color + '" stroke="#fff" stroke-width="1.5"/>';
      }
    });

    // Nucleus
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="22" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>';
    svg += '<text x="' + cx + '" y="' + (cy - 3) + '" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">' + simState.sym + '</text>';
    svg += '<text x="' + cx + '" y="' + (cy + 11) + '" fill="#fecaca" font-size="10" text-anchor="middle">' + simState.z + 'p⁺</text>';

    // Legend info top-left
    svg += '<text x="30" y="35" fill="#f8fafc" font-size="16" font-weight="bold">' + simState.name + ' (Z = ' + simState.z + ')</text>';
    svg += '<text x="30" y="58" fill="#94a3b8" font-size="12">Electronic Configuration: ' + config.join(', ') + '</text>';
    svg += '<text x="30" y="80" fill="#fbbf24" font-size="12">Valence Electrons: ' + valence + ' (Outermost Shell)</text>';
    svg += '<text x="30" y="102" fill="#10b981" font-size="13" font-weight="bold">Valency = ' + valency + '</text>';

    document.getElementById("diagram").innerHTML = svg + '</svg>';
    document.getElementById("lab-readout").innerHTML = 
      '<span>Configuration: <strong style="color:#38bdf8;">' + config.join(', ') + '</strong></span>' +
      '<span>Valence e⁻: <strong style="color:#fbbf24;">' + valence + '</strong></span>' +
      '<span>Valency: <strong style="color:#10b981;">' + valency + '</strong></span>';
    document.getElementById("lab-verdict").innerHTML = 
      valency === 0 ? 
      'Noble gas configuration! Filled shell confers complete chemical inertness.' :
      'Valency = ' + valency + ': Governs chemical bonding to achieve stable noble gas octet!';
  }

  window.SIMS.lab_bohr_bury = { mount: mount, draw: draw };
})();

// =========================================================================
// 7. SIMULATION 7: Isotopes, Isobars & Mass Spectrometer (lab_isotopes_isobars)
// =========================================================================
(function(){
  var simState = {
    view: "spectrometer" // "spectrometer", "decay"
  };

  function mount(lesson){
    simState.view = "spectrometer";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Chlorine-35 (75% Abundance)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#c084fc;"></span><span>Chlorine-37 (25% Abundance)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Weighted Average: 35.5 u</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p7-spec">Chlorine Mass Spectrometry (35.5 u)</button>' +
      '<button class="preset-btn" id="p7-c14">Carbon-14 Archaeological Decay (5,730 yr)</button>';

    document.getElementById("p7-spec").addEventListener("click", function(){
      setActivePreset(this);
      simState.view = "spectrometer";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Mass spectrometer separates ³⁵Cl and ³⁷Cl in magnetic field. 75%:25% abundance yields average mass = 35.5 u!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-c14").addEventListener("click", function(){
      setActivePreset(this);
      simState.view = "decay";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Radiocarbon dating: Carbon-14 decays with 5,730-year half-life to determine ancient fossil ages.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#090d16" rx="12"/>';

    if(simState.view === "spectrometer"){
      // Spectrometer Chamber
      svg += '<path d="M 60 140 L 220 140 Q 380 140 430 70 L 640 70" fill="none" stroke="#38bdf8" stroke-width="4"/>';
      svg += '<path d="M 60 140 L 220 140 Q 380 140 430 210 L 640 210" fill="none" stroke="#c084fc" stroke-width="2.5" stroke-dasharray="6,4"/>';

      // Ion Source
      svg += '<rect x="30" y="105" width="80" height="70" rx="8" fill="#1e293b" stroke="#64748b"/>';
      svg += '<text x="70" y="138" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">Cl⁺ Gas</text>';
      svg += '<text x="70" y="156" fill="#94a3b8" font-size="10" text-anchor="middle">Ion Source</text>';

      // Magnetic Bending Sector
      svg += '<rect x="250" y="45" width="140" height="190" rx="12" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" stroke-dasharray="4,4"/>';
      svg += '<text x="320" y="35" fill="#60a5fa" font-size="12" font-weight="bold" text-anchor="middle">Magnetic Deflection Field (B)</text>';

      // Detectors
      svg += '<g transform="translate(500, 45)">' +
             '<rect width="180" height="55" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>' +
             '<text x="15" y="24" fill="#38bdf8" font-size="14" font-weight="bold">³⁵₁₇Cl (75% Abundance)</text>' +
             '<text x="15" y="44" fill="#cbd5e1" font-size="11">17 Protons, 18 Neutrons</text>' +
             '</g>';

      svg += '<g transform="translate(500, 185)">' +
             '<rect width="180" height="55" rx="8" fill="#1e293b" stroke="#c084fc" stroke-width="2"/>' +
             '<text x="15" y="24" fill="#c084fc" font-size="14" font-weight="bold">³⁷₁₇Cl (25% Abundance)</text>' +
             '<text x="15" y="44" fill="#cbd5e1" font-size="11">17 Protons, 20 Neutrons</text>' +
             '</g>';

      document.getElementById("diagram").innerHTML = svg + '</svg>';
      document.getElementById("lab-readout").innerHTML = 
        '<span>Isotopes: <strong>³⁵Cl (75%), ³⁷Cl (25%)</strong></span>' +
        '<span>Average Mass: <strong style="color:#10b981;">35.5 u</strong></span>' +
        '<span>Ratio: <strong>3 : 1</strong></span>';
      document.getElementById("lab-verdict").innerHTML = 
        'Calculation: (35 &times; 0.75) + (37 &times; 0.25) = 26.25 + 9.25 = 35.5 u! Fractional atomic mass reflects isotopic abundance.';
    } else {
      // Carbon-14 Decay Graph
      svg += '<line x1="100" y1="220" x2="620" y2="220" stroke="#64748b" stroke-width="2"/>';
      svg += '<line x1="100" y1="220" x2="100" y2="40" stroke="#64748b" stroke-width="2"/>';
      svg += '<text x="620" y="240" fill="#94a3b8" font-size="11">Time Elapsed (Years)</text>';
      svg += '<text x="90" y="35" fill="#94a3b8" font-size="11" text-anchor="end">% ¹⁴C Remaining</text>';

      // Exponential Curve
      svg += '<path d="M 100 60 Q 220 140 300 180 T 500 215 T 600 218" fill="none" stroke="#ef4444" stroke-width="3.5"/>';

      // Milestones
      svg += '<circle cx="100" cy="60" r="5" fill="#ef4444"/>';
      svg += '<text x="115" y="65" fill="#fca5a5" font-size="11">100% (Death)</text>';

      svg += '<circle cx="240" cy="140" r="5" fill="#fbbf24"/>';
      svg += '<line x1="240" y1="140" x2="240" y2="220" stroke="#fbbf24" stroke-dasharray="3,3"/>';
      svg += '<text x="240" y="238" fill="#fbbf24" font-size="11" text-anchor="middle">5,730 yr (50%)</text>';

      svg += '<circle cx="380" cy="180" r="5" fill="#38bdf8"/>';
      svg += '<line x1="380" y1="180" x2="380" y2="220" stroke="#38bdf8" stroke-dasharray="3,3"/>';
      svg += '<text x="380" y="238" fill="#38bdf8" font-size="11" text-anchor="middle">11,460 yr (25%)</text>';

      document.getElementById("diagram").innerHTML = svg + '</svg>';
      document.getElementById("lab-readout").innerHTML = 
        '<span>Radioisotope: <strong>Carbon-14 (¹⁴₆C)</strong></span>' +
        '<span>Half-Life: <strong>5,730 Years</strong></span>' +
        '<span>Decay Product: <strong>Nitrogen-14 (¹⁴₇N)</strong></span>';
      document.getElementById("lab-verdict").innerHTML = 
        'Radiocarbon dating measures the remaining ratio of unstable Carbon-14 to stable Carbon-12 to date organic fossils up to 50,000 years!';
    }
  }

  window.SIMS.lab_isotopes_isobars = { mount: mount, draw: draw };
})();