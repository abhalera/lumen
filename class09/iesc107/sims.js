var App = window.App;
window.SIMS = {};

function setActivePreset(btn){
  document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
  if(btn) btn.classList.add("active");
}

// =========================================================================
// 1. SIMULATION 1: Work Done & Sign Conventions (lab_work)
// =========================================================================
(function(){
  var simState = {
    mode: "pull", // "pull", "porter", "friction"
    f: 30,
    dist: 5,
    angle: 0
  };

  function mount(lesson){
    simState.mode = "pull";
    simState.f = 30; simState.dist = 5; simState.angle = 0;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Force Vector (F)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Displacement Vector (s)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Work Magnitude (W = F s cos θ)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p1-pos">Positive Work: Pull Along Floor (θ = 0°)</button>' +
      '<button class="preset-btn" id="p1-zero">Zero Work: Porter Carrying Bag (θ = 90°)</button>' +
      '<button class="preset-btn" id="p1-neg">Negative Work: Kinetic Friction Opposing (θ = 180°)</button>';

    document.getElementById("p1-pos").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "pull"; simState.f = 30; simState.angle = 0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Force and displacement vectors are collinear (θ = 0°). Work done is maximum and POSITIVE (+150 J).";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-zero").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "porter"; simState.f = 300; simState.angle = 90;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Vertical lifting force is strictly perpendicular to horizontal motion (θ = 90°, cos 90° = 0). Work done on the bag is ZERO!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-neg").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "friction"; simState.f = 15; simState.angle = 180;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Friction opposes displacement (θ = 180°, cos 180° = −1). Work done is NEGATIVE (−75 J), removing energy.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var sCurrent = (t / 5.0) * simState.dist;
    var rad = (simState.angle * Math.PI) / 180;
    var cosVal = Math.cos(rad);
    var workDone = simState.f * sCurrent * cosVal;

    var posX = 140 + sCurrent * 60;
    if(posX > 580) posX = 580;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';
    // Ground
    svg += '<line x1="60" y1="210" x2="660" y2="210" stroke="#334155" stroke-width="4"/>';

    if(simState.mode === "porter"){
      // Porter Walking
      svg += '<circle cx="' + posX + '" cy="110" r="14" fill="#fcd34d"/>'; // head
      svg += '<line x1="' + posX + '" y1="124" x2="' + posX + '" y2="175" stroke="#fcd34d" stroke-width="4"/>';
      svg += '<line x1="' + posX + '" y1="175" x2="' + (posX - 15) + '" y2="210" stroke="#fcd34d" stroke-width="3"/>';
      svg += '<line x1="' + posX + '" y1="175" x2="' + (posX + 15) + '" y2="210" stroke="#fcd34d" stroke-width="3"/>';
      // Luggage on head
      svg += '<rect x="' + (posX - 25) + '" y="65" width="50" height="30" fill="#78350f" stroke="#d97706" stroke-width="2" rx="3"/>';
      // Upward force arrow
      svg += '<line x1="' + posX + '" y1="65" x2="' + posX + '" y2="25" stroke="#38bdf8" stroke-width="4"/>';
      svg += '<polygon points="' + posX + ',25 ' + (posX - 6) + ',35 ' + (posX + 6) + ',35" fill="#38bdf8"/>';
      svg += '<text x="' + (posX + 12) + '" y="45" fill="#38bdf8" font-size="12" font-weight="bold">F_up = 300 N</text>';
      // Horizontal displacement arrow
      svg += '<line x1="140" y1="235" x2="' + posX + '" y2="235" stroke="#10b981" stroke-width="3"/>';
      svg += '<text x="' + (140 + posX)/2 + '" y="255" fill="#10b981" font-size="12" text-anchor="middle">Displacement s &rarr;</text>';
    } else {
      // Crate Box
      svg += '<rect x="' + (posX - 40) + '" y="150" width="80" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>';
      svg += '<text x="' + posX + '" y="185" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">Box</text>';

      if(simState.mode === "pull"){
        // Forward pull arrow
        svg += '<line x1="' + (posX + 40) + '" y1="180" x2="' + (posX + 120) + '" y2="180" stroke="#38bdf8" stroke-width="4"/>';
        svg += '<polygon points="' + (posX + 120) + ',180 ' + (posX + 110) + ',175 ' + (posX + 110) + ',185" fill="#38bdf8"/>';
        svg += '<text x="' + (posX + 80) + '" y="170" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">F = 30 N &rarr;</text>';
      } else {
        // Friction opposing arrow
        svg += '<line x1="' + (posX - 40) + '" y1="205" x2="' + (posX - 100) + '" y2="205" stroke="#f43f5e" stroke-width="4"/>';
        svg += '<polygon points="' + (posX - 100) + ',205 ' + (posX - 90) + ',200 ' + (posX - 90) + ',210" fill="#f43f5e"/>';
        svg += '<text x="' + (posX - 70) + '" y="195" fill="#f43f5e" font-size="12" font-weight="bold" text-anchor="middle">f_k = 15 N &larr;</text>';
      }
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    var workSign = workDone > 0 ? '+' : (workDone < 0 ? '−' : '');
    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Displacement (s)</span><span class="v">' + sCurrent.toFixed(1) + ' m</span></div>' +
      '<div class="metric"><span class="k">Angle (θ)</span><span class="v">' + simState.angle + '&deg;</span></div>' +
      '<div class="metric"><span class="k">cos(θ)</span><span class="v">' + cosVal.toFixed(2) + '</span></div>' +
      '<div class="metric"><span class="k">Work Done (W)</span><span class="v" style="color:#fbbf24">' + workSign + Math.abs(workDone).toFixed(1) + ' J</span></div>';

    document.getElementById("lab-verdict").innerHTML = simState.angle === 90
      ? '<strong>Zero Work Condition (θ = 90°):</strong> The upward supporting force is perpendicular to horizontal displacement. cos(90°) = 0, so work done on the luggage is exactly 0 J!'
      : (simState.angle === 180 
        ? '<strong>Negative Work (θ = 180°):</strong> Friction acts opposite to motion (cos 180° = −1). Work done is negative, dissipating energy as heat.'
        : '<strong>Positive Work (θ = 0°):</strong> Applied force aligns with displacement. Positive work (+150 J) adds kinetic energy to the object.');
  }

  window.SIMS.lab_work = { mount: mount, draw: draw };
})();

// =========================================================================
// 2. SIMULATION 2: Kinetic Energy & Braking Distance (lab_ke)
// =========================================================================
(function(){
  var simState = {
    mass: 1000, // kg
    v0: 20,     // m/s
    fBrake: 4000 // N
  };

  function mount(lesson){
    simState.mass = 1000;
    simState.v0 = 20;
    simState.fBrake = 4000;
    App.state.maxT = 6.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 6.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Vehicle Velocity (v)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Braking Retarding Force (F_brake)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Work-Energy dissipated (ΔKE)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p2-slow">Standard Speed: 20 m/s (72 km/h) &rarr; KE = 200 kJ</button>' +
      '<button class="preset-btn" id="p2-fast">Double Speed: 40 m/s (144 km/h) &rarr; KE = 800 kJ (4× Stop Dist!)</button>' +
      '<button class="preset-btn" id="p2-ncert">NCERT Ex 13: 35 m/s &rarr; KE = 612.5 kJ</button>';

    document.getElementById("p2-slow").addEventListener("click", function(){
      setActivePreset(this);
      simState.v0 = 20;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> At 20 m/s, stopping distance is 50 m. Energy absorbed by brakes is 200 kJ.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-fast").addEventListener("click", function(){
      setActivePreset(this);
      simState.v0 = 40;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Doubling speed quadruples kinetic energy (800 kJ) and quadruples stopping distance to 200 m!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-ncert").addEventListener("click", function(){
      setActivePreset(this);
      simState.v0 = 35;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> NCERT Exercise 13: 1000 kg car at 35 m/s requires 612.5 kJ of braking work to halt.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var a = -simState.fBrake / simState.mass;
    var tStop = -simState.v0 / a;
    var currentT = Math.min(t, tStop);
    var v = Math.max(0, simState.v0 + a * currentT);
    var s = simState.v0 * currentT + 0.5 * a * currentT * currentT;
    var ke = 0.5 * simState.mass * v * v;
    var totalStopDist = (simState.v0 * simState.v0) / (2 * Math.abs(a));

    var carX = 100 + (s / totalStopDist) * 480;
    if(carX > 580) carX = 580;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';
    // Road
    svg += '<rect x="40" y="190" width="640" height="30" fill="#334155" rx="4"/>';
    svg += '<line x1="40" y1="205" x2="680" y2="205" stroke="#fbbf24" stroke-width="2" stroke-dasharray="20,15"/>';

    // Car
    svg += '<rect x="' + (carX - 50) + '" y="145" width="100" height="45" fill="#0284c7" stroke="#38bdf8" stroke-width="2" rx="8"/>';
    svg += '<circle cx="' + (carX - 25) + '" cy="190" r="10" fill="#0f172a" stroke="#94a3b8" stroke-width="3"/>';
    svg += '<circle cx="' + (carX + 25) + '" cy="190" r="10" fill="#0f172a" stroke="#94a3b8" stroke-width="3"/>';
    svg += '<text x="' + carX + '" y="172" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">' + v.toFixed(1) + ' m/s</text>';

    // Obstacle line
    svg += '<line x1="600" y1="130" x2="600" y2="220" stroke="#ef4444" stroke-width="4"/>';
    svg += '<text x="600" y="120" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">STOP LINE</text>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Speed (v)</span><span class="v">' + v.toFixed(1) + ' m/s</span></div>' +
      '<div class="metric"><span class="k">Kinetic Energy</span><span class="v" style="color:#38bdf8">' + (ke / 1000).toFixed(1) + ' kJ</span></div>' +
      '<div class="metric"><span class="k">Distance Traveled</span><span class="v">' + s.toFixed(1) + ' m</span></div>' +
      '<div class="metric"><span class="k">Total Stop Distance</span><span class="v" style="color:#fbbf24">' + totalStopDist.toFixed(1) + ' m</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Work-Energy Theorem (W = ΔKE):</strong> Initial KE is " + (0.5 * simState.mass * simState.v0 * simState.v0 / 1000).toFixed(1) + " kJ. Braking force does −" + (0.5 * simState.mass * simState.v0 * simState.v0 / 1000).toFixed(1) + " kJ of work over " + totalStopDist.toFixed(1) + " m, converting kinetic energy into heat.";
  }

  window.SIMS.lab_ke = { mount: mount, draw: draw };
})();

// =========================================================================
// 3. SIMULATION 3: Gravitational PE & Path Independence (lab_pe)
// =========================================================================
(function(){
  var simState = {
    mode: "elevator", // "elevator" or "stairs"
    mass: 50,
    h: 72.5
  };

  function mount(lesson){
    simState.mode = "elevator";
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Elevator Straight Vertical Path</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Zigzag Staircase Path</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>PE = mgh (Strictly Equal!)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p3-elev">NCERT Ex 5(i): Elevator Vertical Lift (h = 72.5 m)</button>' +
      '<button class="preset-btn" id="p3-stairs">NCERT Ex 5(ii): Winding Staircase Climb (h = 72.5 m)</button>' +
      '<button class="preset-btn" id="p3-moon">Lunar Gravitational PE (1/6th g)</button>';

    document.getElementById("p3-elev").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "elevator";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Student lifted vertically. PE gained is mgh = 50 × 10 × 72.5 = 36,250 J.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-stairs").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "stairs";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Student climbs long winding stairs. Despite the longer path, the vertical height gained is identical &rarr; PE gain is identically 36,250 J!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-moon").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "elevator";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> On the Moon (g = 1.67 m/s²), the same 72.5 m climb yields 6 times less potential energy!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var g = 10;
    var frac = t / 5.0;
    var currentH = frac * simState.h;
    var pe = simState.mass * g * currentH;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Building Structure
    svg += '<rect x="180" y="40" width="360" height="200" fill="#1e293b" stroke="#475569" stroke-width="2" rx="4"/>';
    for(var floor = 40; floor <= 240; floor += 40){
      svg += '<line x1="180" y1="' + floor + '" x2="540" y2="' + floor + '" stroke="#334155" stroke-width="1"/>';
    }

    // Elevator shaft (left)
    svg += '<rect x="200" y="50" width="50" height="180" fill="#0f172a" stroke="#64748b"/>';
    var elevY = 205 - frac * 140;
    svg += '<rect x="205" y="' + elevY + '" width="40" height="25" fill="#0284c7" rx="3"/>';
    svg += '<text x="225" y="' + (elevY + 17) + '" fill="#fff" font-size="10" text-anchor="middle">50kg</text>';

    // Staircase zigzag (right)
    svg += '<path d="M 460 230 L 490 200 L 460 170 L 490 140 L 460 110 L 490 80 L 460 50" fill="none" stroke="#f59e0b" stroke-width="3"/>';
    var stairsY = 230 - frac * 180;
    var stairsX = 475 + Math.sin(frac * Math.PI * 5) * 15;
    svg += '<circle cx="' + stairsX + '" cy="' + stairsY + '" r="8" fill="#fcd34d"/>';

    svg += '<text x="140" y="' + (240 - frac * 140) + '" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="end">h = ' + currentH.toFixed(1) + ' m</text>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Elevation (h)</span><span class="v">' + currentH.toFixed(1) + ' m</span></div>' +
      '<div class="metric"><span class="k">Student Mass</span><span class="v">' + simState.mass + ' kg</span></div>' +
      '<div class="metric"><span class="k">Gravity (g)</span><span class="v">' + g + ' m/s²</span></div>' +
      '<div class="metric"><span class="k">Potential Energy</span><span class="v" style="color:#10b981">' + (pe / 1000).toFixed(2) + ' kJ</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Path Independence of Potential Energy:</strong> ΔPE = mgh = 50 × 10 × " + currentH.toFixed(1) + " = " + pe.toFixed(0) + " J. Whether ascending vertically via elevator or along winding stairs, potential energy gain depends purely on vertical elevation.";
  }

  window.SIMS.lab_pe = { mount: mount, draw: draw };
})();

// =========================================================================
// 4. SIMULATION 4: Conservation of Mechanical Energy (lab_energy_skate)
// =========================================================================
(function(){
  var simState = {
    mass: 1.5,
    trackH: 10, // m
    mode: "fall" // "fall", "track"
  };

  function mount(lesson){
    simState.mass = 1.5;
    simState.trackH = 10;
    App.state.maxT = 4.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 4.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Kinetic Energy (KE = ½mv²)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Potential Energy (PE = mgh)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Total Mechanical Energy (E = KE+PE = 150 J)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p4-coconut">NCERT Ex 15: Falling Coconut (m = 1.5 kg, h = 10 m)</button>' +
      '<button class="preset-btn" id="p4-pendulum">Roller Coaster Loop (Continuous Energy Interchange)</button>' +
      '<button class="preset-btn" id="p4-drag">Air Resistance Loss (NCERT Ex 10)</button>';

    document.getElementById("p4-coconut").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "fall";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Total energy is 150 J. As PE shrinks from 150 J to 0 J, KE swells from 0 J to 150 J. Impact velocity is √200 ≈ 14.14 m/s!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-pendulum").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "track";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Energy Skate Park track: As skater oscillates back and forth, energy swaps between KE and PE seamlessly.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-drag").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "fall";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> NCERT Ex 10: In air, 12 J of energy transforms into heat, leaving less final kinetic energy.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var g = 10;
    var totalE = simState.mass * g * simState.trackH; // 150 J
    var tImpact = 1.414; // sqrt(2h/g) = sqrt(20/10) = 1.414 s
    var frac = Math.min(1.0, t / tImpact);

    var currentH = simState.trackH * (1 - frac * frac);
    var v = g * (frac * tImpact);
    var pe = simState.mass * g * currentH;
    var ke = 0.5 * simState.mass * v * v;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Palm tree & beach
    svg += '<line x1="200" y1="40" x2="200" y2="230" stroke="#78350f" stroke-width="12"/>'; // trunk
    svg += '<circle cx="200" cy="40" r="30" fill="#15803d"/>'; // leaves
    svg += '<rect x="60" y="230" width="600" height="25" fill="#d97706" rx="4"/>'; // wet sand

    // Coconut
    var cocY = 50 + (1 - currentH / simState.trackH) * 175;
    svg += '<ellipse cx="230" cy="' + cocY + '" rx="10" ry="12" fill="#451a03" stroke="#78350f" stroke-width="2"/>';

    // Dynamic Energy Bar Chart (Right side)
    var barX = 480;
    svg += '<text x="' + barX + '" y="50" fill="#94a3b8" font-size="12" font-weight="bold">ENERGY TRANSFORMATION</text>';

    // PE bar
    svg += '<text x="' + barX + '" y="80" fill="#fbbf24" font-size="11">PE (' + pe.toFixed(0) + ' J)</text>';
    svg += '<rect x="' + barX + '" y="85" width="' + (pe * 1.2) + '" height="18" fill="#fbbf24" rx="3"/>';

    // KE bar
    svg += '<text x="' + barX + '" y="125" fill="#38bdf8" font-size="11">KE (' + ke.toFixed(0) + ' J)</text>';
    svg += '<rect x="' + barX + '" y="130" width="' + (ke * 1.2) + '" height="18" fill="#38bdf8" rx="3"/>';

    // Total Energy Bar
    svg += '<text x="' + barX + '" y="170" fill="#10b981" font-size="11">Total E (' + totalE.toFixed(0) + ' J)</text>';
    svg += '<rect x="' + barX + '" y="175" width="' + (totalE * 1.2) + '" height="18" fill="#10b981" rx="3"/>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Height (h)</span><span class="v">' + currentH.toFixed(2) + ' m</span></div>' +
      '<div class="metric"><span class="k">Velocity (v)</span><span class="v">' + v.toFixed(2) + ' m/s</span></div>' +
      '<div class="metric"><span class="k">Potential Energy</span><span class="v" style="color:#fbbf24">' + pe.toFixed(1) + ' J</span></div>' +
      '<div class="metric"><span class="k">Kinetic Energy</span><span class="v" style="color:#38bdf8">' + ke.toFixed(1) + ' J</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Conservation of Energy:</strong> Total mechanical energy E = KE + PE is strictly conserved at " + totalE.toFixed(0) + " J. Ground impact speed is v = √(2gh) = √200 ≈ " + (Math.sqrt(200)).toFixed(2) + " m/s.";
  }

  window.SIMS.lab_energy_skate = { mount: mount, draw: draw };
})();

// =========================================================================
// 5. SIMULATION 5: Power & Energy Rate (lab_power)
// =========================================================================
(function(){
  var simState = {
    loadM: 200,
    h: 15,
    tLift: 10
  };

  function mount(lesson){
    simState.loadM = 200; simState.h = 15; simState.tLift = 10;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Crane Hook & Load</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Total Work Done (W = mgh)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Power Requirement (P = W / t)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p5-pump">NCERT Example 7.7: Water Pump (200 kg in 10 s &rarr; 3 kW)</button>' +
      '<button class="preset-btn" id="p5-fast">Fast Lift (Double Speed in 5 s &rarr; 6 kW Power)</button>' +
      '<button class="preset-btn" id="p5-crane">NCERT Ex 6: Crane 10th vs 20th Floor</button>';

    document.getElementById("p5-pump").addEventListener("click", function(){
      setActivePreset(this);
      simState.loadM = 200; simState.h = 15; simState.tLift = 10;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Work done is 30 kJ. Lifting in 10 s yields a power output of exactly 3,000 W (3 kW).";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-fast").addEventListener("click", function(){
      setActivePreset(this);
      simState.loadM = 200; simState.h = 15; simState.tLift = 5;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Work is identical (30 kJ), but doing it in half the time DOUBLES the required power to 6 kW!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-crane").addEventListener("click", function(){
      setActivePreset(this);
      simState.loadM = 400; simState.h = 30; simState.tLift = 20;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> NCERT Ex 6: Doubling height and doubling time doubles work (60 kJ) while keeping power constant!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var g = 10;
    var totalW = simState.loadM * g * simState.h;
    var power = totalW / simState.tLift;

    var frac = Math.min(1.0, t / (simState.tLift / 2.0));
    var yPos = 210 - frac * 140;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Crane Tower
    svg += '<line x1="200" y1="40" x2="200" y2="240" stroke="#f59e0b" stroke-width="8"/>';
    svg += '<line x1="200" y1="40" x2="400" y2="40" stroke="#f59e0b" stroke-width="6"/>'; // jib

    // Cable & Load
    svg += '<line x1="360" y1="40" x2="360" y2="' + yPos + '" stroke="#94a3b8" stroke-width="3"/>';
    svg += '<rect x="335" y="' + yPos + '" width="50" height="40" fill="#0284c7" stroke="#38bdf8" stroke-width="2" rx="4"/>';
    svg += '<text x="360" y="' + (yPos + 24) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">' + simState.loadM + ' kg</text>';

    // Ground
    svg += '<line x1="60" y1="240" x2="660" y2="240" stroke="#334155" stroke-width="4"/>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Total Work (W)</span><span class="v" style="color:#fbbf24">' + (totalW / 1000).toFixed(1) + ' kJ</span></div>' +
      '<div class="metric"><span class="k">Time Taken (t)</span><span class="v">' + simState.tLift + ' s</span></div>' +
      '<div class="metric"><span class="k">Power Output (P)</span><span class="v" style="color:#ef4444">' + (power / 1000).toFixed(2) + ' kW</span></div>' +
      '<div class="metric"><span class="k">Horsepower (hp)</span><span class="v">' + (power / 746).toFixed(1) + ' hp</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Power Definition (P = W/t):</strong> Total work done is " + (totalW / 1000).toFixed(1) + " kJ. Lifting over " + simState.tLift + " s requires a continuous power delivery of " + (power / 1000).toFixed(2) + " kW (" + (power / 746).toFixed(1) + " horsepower).";
  }

  window.SIMS.lab_power = { mount: mount, draw: draw };
})();

// =========================================================================
// 6. SIMULATION 6: Levers & Principle of Moments (lab_lever)
// =========================================================================
(function(){
  var simState = {
    mAdult: 60,
    dAdult: 1.2,
    mChild: 30,
    dChild: 2.4
  };

  function mount(lesson){
    simState.mAdult = 60; simState.dAdult = 1.2;
    simState.mChild = 30; simState.dChild = 2.4;
    App.state.maxT = 4.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 4.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Adult Torque (W₁ × d₁)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Child Torque (W₂ × d₂)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Rotational Equilibrium (Torque Sum = 0)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p6-balance">NCERT Ex 9: Balanced Seesaw (Adult at 1.2m, Child at 2.4m)</button>' +
      '<button class="preset-btn" id="p6-equal-dist">Equal Distance (1.2m each &rarr; Adult Tilts Down)</button>' +
      '<button class="preset-btn" id="p6-crowbar">Class 1 Crowbar (MA = 4)</button>';

    document.getElementById("p6-balance").addEventListener("click", function(){
      setActivePreset(this);
      simState.dAdult = 1.2; simState.dChild = 2.4;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Adult (60 kg) at 1.2 m exerts 720 N·m. Child (30 kg) at 2.4 m exerts 720 N·m. Perfectly balanced horizontally!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-equal-dist").addEventListener("click", function(){
      setActivePreset(this);
      simState.dAdult = 1.2; simState.dChild = 1.2;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> At equal distances, the heavier adult exerts twice the torque, tipping the seesaw down to the ground!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-crowbar").addEventListener("click", function(){
      setActivePreset(this);
      simState.dAdult = 0.3; simState.dChild = 1.2;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Crowbar principle: Effort arm is 4× load arm &rarr; Effort force required is 4× smaller!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var g = 10;
    var torqueAdult = simState.mAdult * g * simState.dAdult; // anticlockwise
    var torqueChild = simState.mChild * g * simState.dChild; // clockwise
    var netTorque = torqueChild - torqueAdult;
    var tiltAngle = netTorque === 0 ? 0 : (netTorque > 0 ? 12 : -12);

    var fulcrumX = 360, fulcrumY = 200;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Ground
    svg += '<line x1="60" y1="240" x2="660" y2="240" stroke="#334155" stroke-width="4"/>';

    // Fulcrum Triangle
    svg += '<polygon points="360,200 340,240 380,240" fill="#64748b" stroke="#94a3b8" stroke-width="2"/>';

    // Seesaw Beam (Rotated about fulcrum)
    svg += '<g transform="rotate(' + tiltAngle + ' 360 200)">';
    svg += '<rect x="120" y="195" width="480" height="10" fill="#d97706" rx="3"/>';

    // Adult (Left side)
    var adultX = 360 - simState.dAdult * 100;
    svg += '<rect x="' + (adultX - 25) + '" y="155" width="50" height="40" fill="#0284c7" rx="4"/>';
    svg += '<text x="' + adultX + '" y="178" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Adult ' + simState.mAdult + 'kg</text>';

    // Child (Right side)
    var childX = 360 + simState.dChild * 100;
    svg += '<rect x="' + (childX - 20) + '" y="165" width="40" height="30" fill="#f59e0b" rx="4"/>';
    svg += '<text x="' + childX + '" y="184" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Child ' + simState.mChild + 'kg</text>';

    svg += '</g>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Adult Torque</span><span class="v" style="color:#38bdf8">' + torqueAdult.toFixed(0) + ' N·m</span></div>' +
      '<div class="metric"><span class="k">Child Torque</span><span class="v" style="color:#f59e0b">' + torqueChild.toFixed(0) + ' N·m</span></div>' +
      '<div class="metric"><span class="k">Net Torque</span><span class="v" style="color:#10b981">' + netTorque.toFixed(0) + ' N·m</span></div>' +
      '<div class="metric"><span class="k">Equilibrium</span><span class="v">' + (netTorque === 0 ? 'BALANCED' : 'UNBALANCED') + '</span></div>';

    document.getElementById("lab-verdict").innerHTML = netTorque === 0
      ? "<strong>Principle of Moments:</strong> W₁ · d₁ = W₂ · d₂ (600 N × 1.2 m = 300 N × 2.4 m = 720 N·m). Because the adult is twice as heavy, the child must sit twice as far from the fulcrum."
      : "<strong>Unbalanced Torque:</strong> Net torque is " + Math.abs(netTorque).toFixed(0) + " N·m. The heavier torque tilts the seesaw beam down.";
  }

  window.SIMS.lab_lever = { mount: mount, draw: draw };
})();

// =========================================================================
// 7. SIMULATION 7: Pulleys & Inclined Planes (lab_pulley_incline)
// =========================================================================
(function(){
  var simState = {
    mode: "incline", // "incline" or "pulley"
    load: 600,
    rampL: 6.0,
    rampH: 2.0
  };

  function mount(lesson){
    simState.mode = "incline";
    simState.load = 600; simState.rampL = 6.0; simState.rampH = 2.0;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Load Weight (Load = 600 N)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Effort Force (F_effort)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Mechanical Advantage (MA = Load/Effort)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p7-incline">Inclined Plane: 6 m Ramp, 2 m High (MA = 3 &rarr; Effort = 200 N)</button>' +
      '<button class="preset-btn" id="p7-direct">Direct Vertical Lift (Effort = 600 N)</button>' +
      '<button class="preset-btn" id="p7-pulley">2-Pulley Block (MA = 2 &rarr; Effort = 300 N)</button>';

    document.getElementById("p7-incline").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "incline"; simState.rampL = 6.0; simState.rampH = 2.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> MA = 6m / 2m = 3. Required pushing effort is cut 3× to 200 N over 3× the distance!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-direct").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "incline"; simState.rampL = 2.0; simState.rampH = 2.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Lifting straight vertically requires full 600 N force!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-pulley").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "pulley";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> 2-pulley block supported by 2 rope strands halves the effort to 300 N.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var ma = simState.rampL / simState.rampH;
    var effort = simState.load / ma;
    var frac = t / 5.0;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    if(simState.mode === "pulley"){
      // Pulley System
      svg += '<line x1="200" y1="40" x2="520" y2="40" stroke="#64748b" stroke-width="6"/>'; // ceiling
      svg += '<circle cx="320" cy="70" r="20" fill="#475569" stroke="#94a3b8" stroke-width="3"/>'; // fixed pulley
      var movY = 190 - frac * 80;
      svg += '<circle cx="320" cy="' + movY + '" r="20" fill="#475569" stroke="#94a3b8" stroke-width="3"/>'; // movable pulley
      // Load
      svg += '<rect x="295" y="' + (movY + 20) + '" width="50" height="35" fill="#0284c7" rx="4"/>';
      svg += '<text x="320" y="' + (movY + 42) + '" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">600 N</text>';
      // Ropes
      svg += '<line x1="300" y1="40" x2="300" y2="' + movY + '" stroke="#f8fafc" stroke-width="2"/>';
      svg += '<line x1="340" y1="70" x2="340" y2="' + movY + '" stroke="#f8fafc" stroke-width="2"/>';
      svg += '<line x1="340" y1="70" x2="420" y2="' + (100 + frac * 120) + '" stroke="#f8fafc" stroke-width="2"/>';
    } else {
      // Inclined Plane Wedge
      var x0 = 120, y0 = 220;
      var x1 = 560, y1 = 220;
      var x2 = 560, y2 = 220 - (simState.rampH / simState.rampL) * 360;

      svg += '<polygon points="' + x0 + ',' + y0 + ' ' + x1 + ',' + y1 + ' ' + x1 + ',' + y2 + '" fill="#1e293b" stroke="#64748b" stroke-width="2"/>';

      // Moving Box on Ramp
      var bx = x0 + frac * (x1 - x0);
      var by = y0 + frac * (y2 - y0);
      svg += '<rect x="' + (bx - 20) + '" y="' + (by - 25) + '" width="40" height="30" fill="#0284c7" stroke="#38bdf8" stroke-width="2" rx="3"/>';
      svg += '<text x="' + bx + '" y="' + (by - 8) + '" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">600N</text>';
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Load Weight</span><span class="v">' + simState.load + ' N</span></div>' +
      '<div class="metric"><span class="k">Mechanical Advantage</span><span class="v" style="color:#fbbf24">' + ma.toFixed(1) + '</span></div>' +
      '<div class="metric"><span class="k">Effort Force</span><span class="v" style="color:#10b981">' + effort.toFixed(1) + ' N</span></div>' +
      '<div class="metric"><span class="k">Work Input = Work Output</span><span class="v">1,200 J</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Golden Rule of Mechanics:</strong> Mechanical Advantage is " + ma.toFixed(1) + ". Pushing effort is reduced to " + effort.toFixed(0) + " N, but exerted over " + ma.toFixed(1) + "× longer distance. Total work done remains strictly conserved!";
  }

  window.SIMS.lab_pulley_incline = { mount: mount, draw: draw };
})();