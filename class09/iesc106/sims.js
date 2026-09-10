var App = window.App;
window.SIMS = {};

function setActivePreset(btn){
  document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
  if(btn) btn.classList.add("active");
}

// =========================================================================
// 1. SIMULATION 1: Force & Net Equilibrium (lab_forces)
// =========================================================================
(function(){
  var simState = {
    f1: 15,  // N (East/Right)
    f2: 9,   // N (West/Left)
    mass: 3, // kg
    x0: 360,
    v: 0
  };

  function mount(lesson){
    simState.f1 = 15;
    simState.f2 = 9;
    simState.mass = 3;
    simState.v = 0;
    var maxT = 5.0;
    App.state.maxT = maxT;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = maxT; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Force F₁ (Right/East)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Force F₂ (Left/West)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Net Resultant Vector (ΣF)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p1-unbalanced">Unbalanced: 15 N East vs 9 N West</button>' +
      '<button class="preset-btn" id="p1-balanced">Balanced: 12 N East vs 12 N West (Equilibrium)</button>' +
      '<button class="preset-btn" id="p1-snakeboat">Vallum Kali: 19 kN vs 1 kN</button>';

    document.getElementById("p1-unbalanced").addEventListener("click", function(){
      setActivePreset(this);
      simState.f1 = 15; simState.f2 = 9; simState.mass = 3;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Net force is +6 N East. The 3 kg crate accelerates at a = 2.0 m/s², visibly picking up speed to the right!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-balanced").addEventListener("click", function(){
      setActivePreset(this);
      simState.f1 = 12; simState.f2 = 12; simState.mass = 3;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Net force is exactly 0 N. The opposing forces cancel completely: acceleration is 0 m/s² and the crate remains at rest!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-snakeboat").addEventListener("click", function(){
      setActivePreset(this);
      simState.f1 = 19; simState.f2 = 1; simState.mass = 6;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Kerala Snake Boat Race model: 19 kN forward vs 1 kN mistake backward. Massive net forward surge of 18 kN!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Notice how the green Net Force arrow determines acceleration. Press Play or drag the Scrubber to see the crate move!";
    draw(0);
  }

  function draw(t){
    var fNet = simState.f1 - simState.f2;
    var a = fNet / simState.mass;
    var x = 0.5 * a * t * t * 18; // scaled position
    var v = a * t;
    var currentX = simState.x0 + x;
    if(currentX > 640) currentX = 640;
    if(currentX < 80) currentX = 80;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    // Background & Floor
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';
    svg += '<line x1="40" y1="210" x2="680" y2="210" stroke="#334155" stroke-width="4"/>';
    for(var i = 40; i <= 680; i += 40){
      svg += '<line x1="' + i + '" y1="210" x2="' + (i - 15) + '" y2="225" stroke="#1e293b" stroke-width="2"/>';
    }

    // Crate Box
    var boxW = 80, boxH = 60;
    var boxY = 210 - boxH;
    svg += '<rect x="' + (currentX - boxW/2) + '" y="' + boxY + '" width="' + boxW + '" height="' + boxH + '" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="6"/>';
    svg += '<text x="' + currentX + '" y="' + (boxY + 34) + '" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">m = ' + simState.mass + ' kg</text>';

    // Arrow F1 (Rightward)
    var arrow1Len = simState.f1 * 7;
    svg += '<line x1="' + (currentX + boxW/2) + '" y1="' + (boxY + 30) + '" x2="' + (currentX + boxW/2 + arrow1Len) + '" y2="' + (boxY + 30) + '" stroke="#38bdf8" stroke-width="4" marker-end="url(#arr-blue)"/>';
    svg += '<text x="' + (currentX + boxW/2 + arrow1Len/2) + '" y="' + (boxY + 18) + '" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">F₁ = ' + simState.f1 + ' N</text>';

    // Arrow F2 (Leftward)
    var arrow2Len = simState.f2 * 7;
    svg += '<line x1="' + (currentX - boxW/2) + '" y1="' + (boxY + 30) + '" x2="' + (currentX - boxW/2 - arrow2Len) + '" y2="' + (boxY + 30) + '" stroke="#f43f5e" stroke-width="4"/>';
    svg += '<polygon points="' + (currentX - boxW/2 - arrow2Len) + ',' + (boxY + 30) + ' ' + (currentX - boxW/2 - arrow2Len + 8) + ',' + (boxY + 25) + ' ' + (currentX - boxW/2 - arrow2Len + 8) + ',' + (boxY + 35) + '" fill="#f43f5e"/>';
    svg += '<text x="' + (currentX - boxW/2 - arrow2Len/2) + '" y="' + (boxY + 18) + '" fill="#f43f5e" font-size="12" font-weight="bold" text-anchor="middle">F₂ = ' + simState.f2 + ' N</text>';

    // Resultant Vector
    var netColor = fNet === 0 ? '#94a3b8' : '#10b981';
    var netY = boxY - 35;
    if(fNet !== 0){
      var netLen = Math.abs(fNet) * 7;
      var sign = fNet > 0 ? 1 : -1;
      svg += '<line x1="' + currentX + '" y1="' + netY + '" x2="' + (currentX + sign * netLen) + '" y2="' + netY + '" stroke="' + netColor + '" stroke-width="4"/>';
      svg += '<polygon points="' + (currentX + sign * netLen) + ',' + netY + ' ' + (currentX + sign * (netLen - 8)) + ',' + (netY - 5) + ' ' + (currentX + sign * (netLen - 8)) + ',' + (netY + 5) + '" fill="' + netColor + '"/>';
    }
    svg += '<text x="' + currentX + '" y="' + (netY - 10) + '" fill="' + netColor + '" font-size="13" font-weight="bold" text-anchor="middle">Net Force ΣF = ' + (fNet > 0 ? '+' : '') + fNet + ' N</text>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Time (t)</span><span class="v">' + t.toFixed(1) + ' s</span></div>' +
      '<div class="metric"><span class="k">Net Force (ΣF)</span><span class="v" style="color:' + netColor + '">' + fNet + ' N</span></div>' +
      '<div class="metric"><span class="k">Acceleration (a)</span><span class="v">' + a.toFixed(2) + ' m/s²</span></div>' +
      '<div class="metric"><span class="k">Velocity (v)</span><span class="v">' + v.toFixed(2) + ' m/s</span></div>';

    var verdictText = fNet === 0 
      ? '<strong>Balanced Forces (Equilibrium):</strong> Net force is 0 N. Acceleration is zero. State of rest persists indefinitely.'
      : '<strong>Unbalanced Net Force (' + fNet + ' N):</strong> Causes acceleration of ' + a.toFixed(2) + ' m/s² in the direction of the net force.';
    document.getElementById("lab-verdict").innerHTML = verdictText;
  }

  window.SIMS.lab_forces = { mount: mount, draw: draw };
})();

// =========================================================================
// 2. SIMULATION 2: Friction Test Bench (lab_friction)
// =========================================================================
(function(){
  var simState = {
    fApp: 40,
    muS: 0.5,
    muK: 0.35,
    mass: 10, // kg -> N = 100 N
    mode: "static"
  };

  function mount(lesson){
    simState.fApp = 40;
    simState.mass = 10;
    simState.muS = 0.5;
    simState.muK = 0.35;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Applied Pull (F_app)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Friction Opposing Force (f)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Breakaway Threshold (f_s,max = 50 N)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p2-sub">Below Threshold: 30 N Pull (Stationary)</button>' +
      '<button class="preset-btn" id="p2-limit">At Threshold: 50 N Pull (Limiting)</button>' +
      '<button class="preset-btn" id="p2-sliding">Breakaway: 70 N Pull (Accelerating)</button>';

    document.getElementById("p2-sub").addEventListener("click", function(){
      setActivePreset(this);
      simState.fApp = 30;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Static friction self-adjusts to exactly 30 N. The block stays completely locked at rest (net force = 0).";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-limit").addEventListener("click", function(){
      setActivePreset(this);
      simState.fApp = 50;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Applied force reaches the maximum static limit f_s,max = 50 N. Impending motion is on the verge of breakaway!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-sliding").addEventListener("click", function(){
      setActivePreset(this);
      simState.fApp = 70;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Breakaway occurs! Kinetic friction drops to a constant 35 N. Net force is 35 N forward, accelerating the block!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var normal = simState.mass * 10; // 100 N
    var fsMax = simState.muS * normal; // 50 N
    var fk = simState.muK * normal;    // 35 N
    var fFrict = 0, a = 0, isSliding = false;

    if(simState.fApp > fsMax){
      isSliding = true;
      fFrict = fk;
      a = (simState.fApp - fk) / simState.mass;
    } else {
      isSliding = false;
      fFrict = simState.fApp;
      a = 0;
    }

    var x = isSliding ? 0.5 * a * t * t * 14 : 0;
    var currentX = 260 + x;
    if(currentX > 580) currentX = 580;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';
    // Rough Surface
    svg += '<rect x="40" y="200" width="640" height="15" fill="#334155" rx="3"/>';
    for(var j = 45; j < 670; j += 15){
      svg += '<circle cx="' + j + '" cy="207" r="2" fill="#64748b"/>';
    }

    // Wooden Block
    var bx = currentX - 50, by = 200 - 65, bw = 100, bh = 65;
    svg += '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" fill="#78350f" stroke="#d97706" stroke-width="2" rx="5"/>';
    svg += '<text x="' + currentX + '" y="' + (by + 36) + '" fill="#fef3c7" font-size="13" font-weight="bold" text-anchor="middle">Block (10 kg)</text>';

    // Applied Force Arrow
    var appLen = simState.fApp * 1.5;
    svg += '<line x1="' + (bx + bw) + '" y1="' + (by + 32) + '" x2="' + (bx + bw + appLen) + '" y2="' + (by + 32) + '" stroke="#38bdf8" stroke-width="4"/>';
    svg += '<polygon points="' + (bx + bw + appLen) + ',' + (by + 32) + ' ' + (bx + bw + appLen - 8) + ',' + (by + 27) + ' ' + (bx + bw + appLen - 8) + ',' + (by + 37) + '" fill="#38bdf8"/>';
    svg += '<text x="' + (bx + bw + appLen/2) + '" y="' + (by + 20) + '" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">F_app = ' + simState.fApp + ' N</text>';

    // Friction Arrow
    var frictLen = fFrict * 1.5;
    svg += '<line x1="' + bx + '" y1="' + (by + bh - 6) + '" x2="' + (bx - frictLen) + '" y2="' + (by + bh - 6) + '" stroke="#fbbf24" stroke-width="4"/>';
    svg += '<polygon points="' + (bx - frictLen) + ',' + (by + bh - 6) + ' ' + (bx - frictLen + 8) + ',' + (by + bh - 11) + ' ' + (bx - frictLen + 8) + ',' + (by + bh - 1) + '" fill="#fbbf24"/>';
    svg += '<text x="' + (bx - frictLen/2) + '" y="' + (by + bh - 14) + '" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">f = ' + fFrict + ' N (' + (isSliding ? 'Kinetic' : 'Static') + ')</text>';

    // Gauge Meter for Limiting Friction
    svg += '<rect x="40" y="30" width="220" height="24" fill="#1e293b" rx="6" stroke="#475569"/>';
    var fillW = Math.min(216, (simState.fApp / fsMax) * 216);
    var gaugeCol = simState.fApp > fsMax ? '#ef4444' : '#38bdf8';
    svg += '<rect x="42" y="32" width="' + fillW + '" height="20" fill="' + gaugeCol + '" rx="4"/>';
    svg += '<text x="150" y="47" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Friction Demand: ' + simState.fApp + ' / ' + fsMax + ' N</text>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Applied Force</span><span class="v">' + simState.fApp + ' N</span></div>' +
      '<div class="metric"><span class="k">Friction Type</span><span class="v">' + (isSliding ? 'Kinetic (f_k)' : 'Static (f_s)') + '</span></div>' +
      '<div class="metric"><span class="k">Opposing Force</span><span class="v" style="color:#fbbf24">' + fFrict + ' N</span></div>' +
      '<div class="metric"><span class="k">Acceleration</span><span class="v">' + a.toFixed(2) + ' m/s²</span></div>';

    document.getElementById("lab-verdict").innerHTML = isSliding
      ? '<strong>Sliding Motion:</strong> Applied force (' + simState.fApp + ' N) exceeded limiting static friction (50 N). Kinetic friction holds at ' + fk + ' N. Net force is ' + (simState.fApp - fk) + ' N.'
      : '<strong>Static Equilibrium:</strong> Applied force (' + simState.fApp + ' N) does not exceed 50 N. Static friction self-adjusts to exactly ' + fFrict + ' N. Object remains stationary.';
  }

  window.SIMS.lab_friction = { mount: mount, draw: draw };
})();

// =========================================================================
// 3. SIMULATION 3: Galileo's Incline & Inertia (lab_galileo)
// =========================================================================
(function(){
  var simState = {
    thetaRight: 30, // degrees (30, 15, 0 = horizontal)
    h: 120,
    ballR: 12
  };

  function mount(lesson){
    simState.thetaRight = 30;
    App.state.maxT = 6.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 6.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Galileo Rolling Marble</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Initial Release Height (h)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Inertial Motion Path</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p3-steep">Equal Steep Slope (30° Right)</button>' +
      '<button class="preset-btn" id="p3-gentle">Gentle Slope (15° Right)</button>' +
      '<button class="preset-btn" id="p3-horizontal">Zero Slope: Flat Plane (0° Right - Newton 1st Law)</button>';

    document.getElementById("p3-steep").addEventListener("click", function(){
      setActivePreset(this);
      simState.thetaRight = 30;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Marble rolls down and climbs up the opposite slope to reach the exact same starting height h.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-gentle").addEventListener("click", function(){
      setActivePreset(this);
      simState.thetaRight = 15;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> The gentler slope forces the marble to travel much further along the ramp to attain the same height h.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-horizontal").addEventListener("click", function(){
      setActivePreset(this);
      simState.thetaRight = 0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Galileo's genius insight: With zero inclination on the right, the marble NEVER attains height h and continues rolling forever in a straight line!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Left incline: (80, 80) to (300, 220)
    var xL0 = 80, yL0 = 80, xV = 300, yV = 220;
    // Right incline endpoint depending on thetaRight
    var xR1, yR1;
    if(simState.thetaRight === 30){
      xR1 = 520; yR1 = 80;
    } else if(simState.thetaRight === 15){
      xR1 = 660; yR1 = 120;
    } else {
      xR1 = 680; yR1 = 220; // horizontal
    }

    // Incline track paths
    svg += '<path d="M ' + xL0 + ' ' + yL0 + ' L ' + xV + ' ' + yV + ' L ' + xR1 + ' ' + yR1 + '" fill="none" stroke="#475569" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>';
    // Release height reference dashed line
    svg += '<line x1="' + xL0 + '" y1="' + yL0 + '" x2="680" y2="' + yL0 + '" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4"/>';
    svg += '<text x="490" y="' + (yL0 - 8) + '" fill="#38bdf8" font-size="12">Initial Height h</text>';

    // Ball motion physics approximation
    var bx = xL0, by = yL0;
    var tDown = 2.0;
    if(t <= tDown){
      var f1 = t / tDown;
      bx = xL0 + (xV - xL0) * f1;
      by = yL0 + (yV - yL0) * f1;
    } else {
      var tUp = t - tDown;
      if(simState.thetaRight === 0){
        // Continuous constant velocity on flat plane
        var vH = (xV - xL0) / tDown;
        bx = xV + vH * tUp * 0.9;
        if(bx > 670) bx = 670;
        by = yV;
      } else {
        var climbDur = simState.thetaRight === 30 ? 2.0 : 3.5;
        var f2 = Math.min(1.0, tUp / climbDur);
        bx = xV + (xR1 - xV) * f2;
        by = yV + (yR1 - yV) * f2;
      }
    }

    // Ball
    svg += '<circle cx="' + bx + '" cy="' + (by - 12) + '" r="12" fill="#c084fc" stroke="#f3e8ff" stroke-width="2"/>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Time (t)</span><span class="v">' + t.toFixed(1) + ' s</span></div>' +
      '<div class="metric"><span class="k">Right Inclination</span><span class="v">' + simState.thetaRight + '&deg;</span></div>' +
      '<div class="metric"><span class="k">Ball Position X</span><span class="v">' + bx.toFixed(0) + ' px</span></div>' +
      '<div class="metric"><span class="k">State of Motion</span><span class="v">' + (t <= 2 ? 'Accelerating Down' : (simState.thetaRight === 0 ? 'Uniform Motion (Inertia)' : 'Decelerating Up')) + '</span></div>';

    document.getElementById("lab-verdict").innerHTML = simState.thetaRight === 0
      ? '<strong>Galileo / Newton First Law:</strong> On a frictionless horizontal plane, no net force opposes motion. The marble continues moving in a straight line at constant velocity indefinitely.'
      : '<strong>Conservation of Height:</strong> The marble climbs until it recovers its initial gravitational height h. A gentler slope requires a greater travel distance to reach height h.';
  }

  window.SIMS.lab_galileo = { mount: mount, draw: draw };
})();

// =========================================================================
// 4. SIMULATION 4: Newton's Second Law Dynamic Cart (lab_second_law)
// =========================================================================
(function(){
  var simState = {
    cartM: 2.0,    // kg
    hangM: 0.5,    // kg
    trackL: 500
  };

  function mount(lesson){
    simState.cartM = 2.0;
    simState.hangM = 0.5;
    App.state.maxT = 4.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 4.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Dynamic Cart (M)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Hanging Falling Mass (m)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Accelerating System (F = ma)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p4-base">Standard: Cart 2 kg, Hang 0.5 kg (a = 2.0 m/s²)</button>' +
      '<button class="preset-btn" id="p4-double-f">Double Force: Hang 1.0 kg (a &propto; F)</button>' +
      '<button class="preset-btn" id="p4-double-m">Double Cart Mass: Cart 4 kg (a &propto; 1/M)</button>';

    document.getElementById("p4-base").addEventListener("click", function(){
      setActivePreset(this);
      simState.cartM = 2.0; simState.hangM = 0.5;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Base acceleration test. Observe the dynamic cart accelerate smoothly along the aluminum track.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-double-f").addEventListener("click", function(){
      setActivePreset(this);
      simState.cartM = 2.0; simState.hangM = 1.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Activity 6.3: Doubling hanging pulling force increases system acceleration markedly!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-double-m").addEventListener("click", function(){
      setActivePreset(this);
      simState.cartM = 4.0; simState.hangM = 0.5;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Activity 6.4: Doubling cart inertia halves the acceleration!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var g = 9.8;
    var fPull = simState.hangM * g; // N
    var totalM = simState.cartM + simState.hangM;
    var a = fPull / totalM;
    var s = 0.5 * a * t * t * 20; // scale pixels
    var cartX = Math.min(480, 100 + s);
    var hangY = Math.min(220, 110 + s * 0.7);
    var v = a * t;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Track
    svg += '<rect x="60" y="100" width="460" height="12" fill="#334155" rx="3"/>';
    svg += '<circle cx="520" cy="106" r="14" fill="#64748b" stroke="#94a3b8" stroke-width="3"/>'; // Pulley

    // Cart
    svg += '<rect x="' + cartX + '" y="65" width="80" height="35" fill="#0284c7" stroke="#38bdf8" stroke-width="2" rx="4"/>';
    svg += '<circle cx="' + (cartX + 18) + '" cy="100" r="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
    svg += '<circle cx="' + (cartX + 62) + '" cy="100" r="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
    svg += '<text x="' + (cartX + 40) + '" y="87" fill="#f0f9ff" font-size="11" font-weight="bold" text-anchor="middle">M = ' + simState.cartM + ' kg</text>';

    // String
    svg += '<line x1="' + (cartX + 80) + '" y1="80" x2="520" y2="80" stroke="#f8fafc" stroke-width="2"/>';
    svg += '<line x1="534" y1="106" x2="534" y2="' + hangY + '" stroke="#f8fafc" stroke-width="2"/>';

    // Hanging Mass
    svg += '<rect x="520" y="' + hangY + '" width="28" height="36" fill="#d97706" stroke="#fbbf24" stroke-width="2" rx="3"/>';
    svg += '<text x="534" y="' + (hangY + 22) + '" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">m=' + simState.hangM + '</text>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Time (t)</span><span class="v">' + t.toFixed(1) + ' s</span></div>' +
      '<div class="metric"><span class="k">Pulling Force (mg)</span><span class="v">' + fPull.toFixed(1) + ' N</span></div>' +
      '<div class="metric"><span class="k">Total Mass (M+m)</span><span class="v">' + totalM.toFixed(1) + ' kg</span></div>' +
      '<div class="metric"><span class="k">Acceleration (a)</span><span class="v" style="color:#38bdf8">' + a.toFixed(2) + ' m/s²</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Newton's Second Law (F = ma):</strong> Net driving force is " + fPull.toFixed(1) + " N acting on total mass " + totalM.toFixed(1) + " kg &rarr; System acceleration is " + a.toFixed(2) + " m/s².";
  }

  window.SIMS.lab_second_law = { mount: mount, draw: draw };
})();

// =========================================================================
// 5. SIMULATION 5: Impulse & Contact Time (lab_impulse)
// =========================================================================
(function(){
  var simState = {
    mode: "catch", // "catch", "penalty", "highjump"
    dt: 0.1,       // seconds
    deltaP: 3.0    // kg m/s
  };

  function mount(lesson){
    simState.mode = "catch";
    simState.dt = 0.1;
    simState.deltaP = 3.0;
    App.state.maxT = 3.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 3.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Stiff Hands Catch (Short Δt = 0.02s)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Cushioned Hands Catch (Long Δt = 0.15s)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Impulse Area ∫ F dt = Δp</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p5-cushion">Cushioned Cricket Catch (Hands Pulled Back)</button>' +
      '<button class="preset-btn" id="p5-stiff">Stiff Hands Catch (Painful 150 N Spike)</button>' +
      '<button class="preset-btn" id="p5-penalty">Football Penalty: 108 km/h, 15 ms, 800 N</button>';

    document.getElementById("p5-cushion").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "catch"; simState.dt = 0.15; simState.deltaP = 3.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> By pulling hands back along ball trajectory, contact time expands to 0.15 s. Peak force drops safely to just 20 N!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-stiff").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "catch"; simState.dt = 0.02; simState.deltaP = 3.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Stiff hands bring ball to instant dead stop in 0.02 s. The impact force spikes dangerously to 150 N!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-penalty").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "penalty"; simState.dt = 0.015; simState.deltaP = 12.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> NCERT Exercise 13: Boot imparts 800 N force over 15 milliseconds, launching football to 108 km/h!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var fAvg = simState.deltaP / simState.dt;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Graph Axes: Force vs Time
    svg += '<line x1="80" y1="230" x2="660" y2="230" stroke="#475569" stroke-width="2"/>';
    svg += '<line x1="80" y1="230" x2="80" y2="40" stroke="#475569" stroke-width="2"/>';
    svg += '<text x="650" y="220" fill="#94a3b8" font-size="11">Time t &rarr;</text>';
    svg += '<text x="90" y="50" fill="#94a3b8" font-size="11">Impact Force F &rarr;</text>';

    // Curve rendering
    var color = simState.dt >= 0.1 ? '#10b981' : '#ef4444';
    var peakH = Math.min(170, fAvg * 1.0);
    var spanW = simState.dt * 1200;
    var xStart = 200;

    svg += '<path d="M ' + xStart + ' 230 Q ' + (xStart + spanW/2) + ' ' + (230 - peakH) + ' ' + (xStart + spanW) + ' 230" fill="' + color + '" fill-opacity="0.3" stroke="' + color + '" stroke-width="3"/>';

    svg += '<circle cx="' + (xStart + spanW/2) + '" cy="' + (230 - peakH) + '" r="5" fill="' + color + '"/>';
    svg += '<text x="' + (xStart + spanW/2) + '" y="' + (230 - peakH - 10) + '" fill="' + color + '" font-size="13" font-weight="bold" text-anchor="middle">Peak F = ' + fAvg.toFixed(0) + ' N</text>';
    svg += '<text x="' + (xStart + spanW/2) + '" y="250" fill="#cbd5e1" font-size="12" text-anchor="middle">Contact Duration &Delta;t = ' + (simState.dt * 1000).toFixed(0) + ' ms</text>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Momentum Change (Δp)</span><span class="v">' + simState.deltaP.toFixed(1) + ' kg·m/s</span></div>' +
      '<div class="metric"><span class="k">Contact Time (Δt)</span><span class="v">' + (simState.dt * 1000).toFixed(0) + ' ms</span></div>' +
      '<div class="metric"><span class="k">Average Force (F_avg)</span><span class="v" style="color:' + color + '">' + fAvg.toFixed(1) + ' N</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      '<strong>Impulse Theorem (J = F · Δt = Δp):</strong> Extending contact time to ' + (simState.dt * 1000).toFixed(0) + ' ms lowers the average force to ' + fAvg.toFixed(1) + ' N. Softening impacts saves bones and equipment!';
  }

  window.SIMS.lab_impulse = { mount: mount, draw: draw };
})();

// =========================================================================
// 6. SIMULATION 6: Third Law Action-Reaction (lab_action_reaction)
// =========================================================================
(function(){
  var simState = {
    pullF: 16, // N
    mode: "springs"
  };

  function mount(lesson){
    simState.pullF = 16;
    App.state.maxT = 4.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 4.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Balance A Dial (Action on B)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Balance B Dial (Reaction on A)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Strict Magnitude Equality (|F_AB| = |F_BA|)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p6-16n">Activity 6.6: Pull with 16 N Force</button>' +
      '<button class="preset-btn" id="p6-24n">Harder Pull: 24 N Force</button>' +
      '<button class="preset-btn" id="p6-boat">Sailor Leaping from Boat (NCERT Ex 7)</button>';

    document.getElementById("p6-16n").addEventListener("click", function(){
      setActivePreset(this);
      simState.pullF = 16; simState.mode = "springs";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Balance A and Balance B both read exactly 16 N! Action and reaction are strictly equal and opposite.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-24n").addEventListener("click", function(){
      setActivePreset(this);
      simState.pullF = 24; simState.mode = "springs";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Increasing the pull to 24 N increases both balance readings simultaneously to 24 N.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-boat").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "boat";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Sailor pushes boat backward (Action) to leap forward (Reaction). Boat moves backward into river!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    if(simState.mode === "boat"){
      // Boat & Sailor Animation
      svg += '<rect x="40" y="190" width="640" height="70" fill="#1e3a8a" opacity="0.6"/>'; // water
      svg += '<rect x="520" y="170" width="160" height="90" fill="#334155"/>'; // shore
      svg += '<text x="600" y="215" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">River Shore</text>';

      var boatX = 240 - t * 25;
      var sailorX = 360 + t * 45;

      // Boat
      svg += '<path d="M ' + boatX + ' 190 L ' + (boatX + 180) + ' 190 L ' + (boatX + 150) + ' 230 L ' + (boatX + 30) + ' 230 Z" fill="#78350f" stroke="#d97706" stroke-width="2"/>';
      svg += '<text x="' + (boatX + 90) + '" y="215" fill="#fef3c7" font-size="12" font-weight="bold" text-anchor="middle">Boat &larr; Backward</text>';

      // Sailor
      if(sailorX < 560){
        svg += '<circle cx="' + sailorX + '" cy="140" r="12" fill="#fcd34d"/>';
        svg += '<line x1="' + sailorX + '" y1="152" x2="' + sailorX + '" y2="185" stroke="#fcd34d" stroke-width="4"/>';
        svg += '<text x="' + sailorX + '" y="125" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Sailor &rarr;</text>';
      }
    } else {
      // Dual Spring Balances
      // Anchor left
      svg += '<line x1="60" y1="90" x2="60" y2="190" stroke="#64748b" stroke-width="8"/>';

      // Balance B (left)
      svg += '<rect x="90" y="115" width="220" height="50" fill="#1e293b" stroke="#f43f5e" stroke-width="2" rx="6"/>';
      svg += '<text x="200" y="145" fill="#f43f5e" font-size="14" font-weight="bold" text-anchor="middle">Balance B: ' + simState.pullF + ' N &larr;</text>';

      // Hook connection
      svg += '<path d="M 310 140 C 330 130 330 150 350 140" stroke="#f8fafc" stroke-width="4" fill="none"/>';

      // Balance A (right)
      svg += '<rect x="350" y="115" width="220" height="50" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="6"/>';
      svg += '<text x="460" y="145" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">Balance A: ' + simState.pullF + ' N &rarr;</text>';

      // Pulling hand arrow
      svg += '<line x1="570" y1="140" x2="660" y2="140" stroke="#38bdf8" stroke-width="4"/>';
      svg += '<polygon points="660,140 650,135 650,145" fill="#38bdf8"/>';
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Action Force (F_AB)</span><span class="v" style="color:#38bdf8">+' + simState.pullF + ' N</span></div>' +
      '<div class="metric"><span class="k">Reaction Force (F_BA)</span><span class="v" style="color:#f43f5e">−' + simState.pullF + ' N</span></div>' +
      '<div class="metric"><span class="k">Vector Sum (F_AB + F_BA)</span><span class="v" style="color:#10b981">0 N</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Newton's Third Law:</strong> F_AB = −F_BA. Action and reaction are simultaneous, strictly equal in magnitude (" + simState.pullF + " N), and act on two distinct bodies.";
  }

  window.SIMS.lab_action_reaction = { mount: mount, draw: draw };
})();

// =========================================================================
// 7. SIMULATION 7: Momentum Conservation & Recoil (lab_recoil)
// =========================================================================
(function(){
  var simState = {
    mBullet: 0.1,  // kg
    vBullet: 300,  // m/s
    mGun: 5.0      // kg
  };

  function mount(lesson){
    simState.mBullet = 0.1;
    simState.vBullet = 300;
    simState.mGun = 5.0;
    App.state.maxT = 3.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 3.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Forward Bullet Momentum (+30 kg·m/s)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Backward Gun Recoil (−30 kg·m/s)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Total System Momentum = 0 kg·m/s</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p7-ncert">NCERT Example 6.8: 5 kg Gun, 0.1 kg Bullet at 300 m/s</button>' +
      '<button class="preset-btn" id="p7-heavy">Heavy 10 kg Gun (Halves Recoil Velocity)</button>' +
      '<button class="preset-btn" id="p7-collision">Two Skaters Pushing Off (Activity 6.7)</button>';

    document.getElementById("p7-ncert").addEventListener("click", function(){
      setActivePreset(this);
      simState.mGun = 5.0; simState.mBullet = 0.1; simState.vBullet = 300;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Bullet flies forward at +300 m/s. Rifle recoils backward at V = −6.0 m/s, strictly conserving momentum!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-heavy").addEventListener("click", function(){
      setActivePreset(this);
      simState.mGun = 10.0; simState.mBullet = 0.1; simState.vBullet = 300;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Doubling rifle mass to 10 kg cuts the recoil velocity in half to −3.0 m/s!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-collision").addEventListener("click", function(){
      setActivePreset(this);
      simState.mGun = 60.0; simState.mBullet = 40.0; simState.vBullet = 2.5;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Two skaters pushing off: 40 kg skater recoils at 2.5 m/s, 60 kg skater recoils at 1.67 m/s.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var vRecoil = -(simState.mBullet * simState.vBullet) / simState.mGun;
    var pBullet = simState.mBullet * simState.vBullet;
    var pGun = simState.mGun * vRecoil;
    var pTotal = pBullet + pGun;

    var gunX = 300 + (t > 0.2 ? vRecoil * (t - 0.2) * 15 : 0);
    var bulletX = 380 + (t > 0.2 ? (t - 0.2) * 350 : 0);
    if(gunX < 80) gunX = 80;
    if(bulletX > 680) bulletX = 680;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Stand
    svg += '<line x1="40" y1="200" x2="680" y2="200" stroke="#334155" stroke-width="4"/>';

    // Rifle Body
    svg += '<rect x="' + (gunX - 120) + '" y="130" width="160" height="30" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="4"/>';
    svg += '<rect x="' + (gunX + 40) + '" y="138" width="60" height="12" fill="#475569" stroke="#94a3b8" stroke-width="1"/>'; // barrel
    svg += '<text x="' + (gunX - 40) + '" y="150" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Gun (M = ' + simState.mGun + ' kg)</text>';

    // Recoil arrow
    if(t > 0.2){
      svg += '<line x1="' + (gunX - 130) + '" y1="145" x2="' + (gunX - 180) + '" y2="145" stroke="#38bdf8" stroke-width="4"/>';
      svg += '<polygon points="' + (gunX - 180) + ',145 ' + (gunX - 170) + ',140 ' + (gunX - 170) + ',150" fill="#38bdf8"/>';
      svg += '<text x="' + (gunX - 155) + '" y="135" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">V = ' + vRecoil.toFixed(1) + ' m/s</text>';
    }

    // Bullet
    if(t > 0.2){
      svg += '<ellipse cx="' + bulletX + '" cy="144" rx="8" ry="4" fill="#ef4444"/>';
      svg += '<text x="' + bulletX + '" y="130" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">v = +' + simState.vBullet + ' m/s</text>';
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Bullet Momentum</span><span class="v" style="color:#ef4444">+' + pBullet.toFixed(1) + ' kg·m/s</span></div>' +
      '<div class="metric"><span class="k">Gun Momentum</span><span class="v" style="color:#38bdf8">' + pGun.toFixed(1) + ' kg·m/s</span></div>' +
      '<div class="metric"><span class="k">Total Momentum</span><span class="v" style="color:#10b981">' + pTotal.toFixed(2) + ' kg·m/s</span></div>' +
      '<div class="metric"><span class="k">Recoil Velocity</span><span class="v">' + vRecoil.toFixed(2) + ' m/s</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      '<strong>Conservation of Momentum:</strong> In the absence of external forces, total momentum remains strictly zero. Gun recoil velocity is ' + vRecoil.toFixed(2) + ' m/s.';
  }

  window.SIMS.lab_recoil = { mount: mount, draw: draw };
})();