var App = window.App;
window.SIMS = {};

// =========================================================================
// 1. SIMULATION 1: 1D Track Runner & Activity 4.1 Ball Toss (track1d)
// =========================================================================
(function(){
  var simState = {
    mode: "runner", // "runner" or "toss"
    xTarget: 100,
    leg2: 40,
    totalDistance: 160,
    netDisplacement: 40,
    tossHeight: 140 // cm
  };

  function mount(lesson){
    simState.mode = "runner";
    var maxT = 6.0;
    App.state.maxT = maxT;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = maxT; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Forward Leg Trajectory</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Return Leg Trajectory</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#818cf8;"></span><span>Net Displacement Vector (Δs)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p1-run-both">Run to A (+100m) & Return to B (+40m)</button>' +
      '<button class="preset-btn" id="p1-run-a">Run to A (+100m) Only</button>' +
      '<button class="preset-btn" id="p1-ball-toss">Activity 4.1: Vertical Ball Toss (140 cm)</button>';

    document.getElementById("p1-run-both").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "runner";
      simState.xTarget = 100; simState.leg2 = 40;
      App.state.maxT = 6.0;
      document.getElementById("time-scrubber").max = 6.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Notice the green forward trail reach +100 m, then the orange return trail accumulate distance to 160 m while displacement shrinks back to +40 m!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p1-run-a").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "runner";
      simState.xTarget = 100; simState.leg2 = 100;
      App.state.maxT = 3.0;
      document.getElementById("time-scrubber").max = 3.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Moving in one straight direction without turning: Distance travelled (100 m) strictly equals magnitude of displacement (+100 m).";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p1-ball-toss").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "toss";
      App.state.maxT = 4.0;
      document.getElementById("time-scrubber").max = 4.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch (Activity 4.1):</strong> Ball rises to peak (140 cm), pauses, and falls back to hand. Watch how height resets to 0, displacement becomes 0, but total distance is 280 cm!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("lab-controls").innerHTML = 
      '<div class="control-item"><div class="control-label"><span>Manual Position Scrubber</span><span class="val" id="ctrl-p1-val">0 m</span></div>' +
      '<input type="range" id="ctrl-p1-pos" min="-40" max="100" value="0" step="1"></div>';

    document.getElementById("ctrl-p1-pos").addEventListener("input", function(e){
      App.pause();
      simState.mode = "manual";
      var x = Number(e.target.value);
      drawManual(x);
    });

    draw(0);
  }

  function setActivePreset(btn){
    document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
  }

  function draw(t){
    var svg = document.getElementById("diagram");
    if(!svg) return;

    if(simState.mode === "toss"){
      drawBallToss(t, svg);
      return;
    }

    var xOrigin = 220, scale = 4.4;
    function toSvgX(x){ return xOrigin + x * scale; }

    var xCurrent = 0;
    var dist = 0;
    var disp = 0;

    if(t <= 3.0){
      var frac = t / 3.0;
      xCurrent = frac * simState.xTarget;
      dist = xCurrent;
      disp = xCurrent;
    } else {
      var frac2 = (t - 3.0) / 3.0;
      xCurrent = 100 - frac2 * (100 - simState.leg2);
      dist = 100 + (100 - xCurrent);
      disp = xCurrent;
    }

    var runnerX = toSvgX(xCurrent);
    var markup = '<rect width="720" height="300" fill="#09131d"/>';
    markup += '<line x1="40" y1="170" x2="680" y2="170" stroke="#334155" stroke-width="6" stroke-linecap="round"/>';

    for(var m = -40; m <= 100; m += 20){
      var px = toSvgX(m);
      markup += '<line x1="' + px + '" y1="' + 162 + '" x2="' + px + '" y2="' + 178 + '" stroke="#64748b" stroke-width="2"/>';
      markup += '<text x="' + px + '" y="196" fill="#94a3b8" font-size="12" font-family="monospace" text-anchor="middle">' + (m > 0 ? "+" + m : m) + 'm</text>';
    }

    markup += '<circle cx="' + toSvgX(0) + '" cy="170" r="5" fill="#38bdf8"/>';
    markup += '<text x="' + toSvgX(0) + '" y="152" fill="#38bdf8" font-weight="700" font-size="13" text-anchor="middle">Origin O (0m)</text>';

    markup += '<circle cx="' + toSvgX(100) + '" cy="170" r="4" fill="#f59e0b"/>';
    markup += '<text x="' + toSvgX(100) + '" y="152" fill="#f59e0b" font-size="12" text-anchor="middle">A (+100m)</text>';

    markup += '<circle cx="' + toSvgX(40) + '" cy="170" r="4" fill="#10b981"/>';
    markup += '<text x="' + toSvgX(40) + '" y="152" fill="#10b981" font-size="12" text-anchor="middle">B (+40m)</text>';

    var fwdReach = Math.min(100, dist);
    if(fwdReach > 0){
      markup += '<path d="M ' + toSvgX(0) + ' 130 L ' + toSvgX(fwdReach) + ' 130" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>';
      markup += '<text x="' + (toSvgX(fwdReach/2)) + '" y="122" fill="#38bdf8" font-size="11" text-anchor="middle">Leg 1: Outward (' + fwdReach.toFixed(0) + 'm)</text>';
    }

    if(t > 3.0 && dist > 100){
      markup += '<path d="M ' + toSvgX(100) + ' 220 L ' + runnerX + ' 220" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>';
      markup += '<text x="' + ((toSvgX(100) + runnerX)/2) + '" y="238" fill="#f59e0b" font-size="11" text-anchor="middle">Leg 2: Return (' + (dist - 100).toFixed(0) + 'm)</text>';
    }

    if(Math.abs(disp) > 0.5){
      markup += '<defs><marker id="arrow-disp" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,1 L7,4 L0,7 Z" fill="#818cf8"/></marker></defs>';
      markup += '<line x1="' + toSvgX(0) + '" y1="80" x2="' + runnerX + '" y2="80" stroke="#818cf8" stroke-width="5" marker-end="url(#arrow-disp)"/>';
      markup += '<text x="' + ((toSvgX(0) + runnerX)/2) + '" y="70" fill="#818cf8" font-size="13" font-weight="700" text-anchor="middle">Displacement Δs = ' + (disp > 0 ? "+" : "") + disp.toFixed(1) + ' m</text>';
    }

    markup += '<g transform="translate(' + runnerX + ', 170)">';
    markup += '<circle cx="0" cy="-22" r="9" fill="#f8fafc"/>';
    markup += '<line x1="0" y1="-13" x2="0" y2="4" stroke="#f8fafc" stroke-width="3"/>';
    markup += '<line x1="-7" y1="-5" x2="7" y2="-5" stroke="#f8fafc" stroke-width="2.5"/>';
    markup += '<line x1="0" y1="4" x2="-6" y2="16" stroke="#f8fafc" stroke-width="2.5"/>';
    markup += '<line x1="0" y1="4" x2="6" y2="16" stroke="#f8fafc" stroke-width="2.5"/>';
    markup += '</g>';

    svg.innerHTML = markup;
    svg.setAttribute("aria-label", "Runner at position " + xCurrent.toFixed(1) + " meters. Distance: " + dist.toFixed(1) + " meters. Displacement: " + disp.toFixed(1) + " meters.");

    document.getElementById("lab-readout").innerHTML = 
      '<div class="telemetry-cell"><div class="telemetry-label">Position x(t)</div><div class="telemetry-val">' + (xCurrent >= 0 ? "+" : "") + xCurrent.toFixed(1) + ' m</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Total Distance Traversed (d)</div><div class="telemetry-val" style="color:#f59e0b;">' + dist.toFixed(1) + ' m</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Net Displacement (Δs)</div><div class="telemetry-val" style="color:#818cf8;">' + (disp >= 0 ? "+" : "") + disp.toFixed(1) + ' m</div></div>';

    var verdict = "";
    if(dist === disp && dist > 0){
      verdict = "<b>Motion in single straight direction:</b> Distance travelled (" + dist.toFixed(0) + " m) strictly equals magnitude of displacement (+" + disp.toFixed(0) + " m).";
    } else if(dist > disp && disp > 0){
      verdict = "<b>Reversal occurred:</b> The athlete turned around at point A! The odometer kept accumulating path length (<b>" + dist.toFixed(0) + " m</b>), while the displacement shrank back to the straight-line distance from O (<b>+" + disp.toFixed(0) + " m</b>). Distance > |Displacement|!";
    } else {
      verdict = "Athlete is at origin O. Ready to begin motion!";
    }
    document.getElementById("lab-verdict").innerHTML = verdict;
    var pVal = document.getElementById("ctrl-p1-val");
    if(pVal) pVal.textContent = xCurrent.toFixed(0) + " m";
  }

  function drawBallToss(t, svg){
    var hMax = 140; // cm
    var curH = 0;
    var dist = 0;
    var disp = 0;

    if(t <= 2.0){
      var fr = t / 2.0;
      curH = fr * hMax;
      dist = curH;
      disp = curH;
    } else {
      var fr2 = (t - 2.0) / 2.0;
      curH = hMax * (1 - fr2);
      dist = hMax + (hMax - curH);
      disp = curH;
    }

    var svgY = 240 - (curH / 140) * 160;
    var markup = '<rect width="720" height="300" fill="#09131d"/>';
    markup += '<line x1="280" y1="80" x2="280" y2="240" stroke="#475569" stroke-width="4"/>';
    for(var cm = 0; cm <= 140; cm += 20){
      var ry = 240 - (cm / 140) * 160;
      markup += '<line x1="272" y1="' + ry + '" x2="288" y2="' + ry + '" stroke="#94a3b8" stroke-width="2"/>';
      markup += '<text x="260" y="' + (ry + 4) + '" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="end">' + cm + ' cm</text>';
    }

    markup += '<path d="M 340 250 Q 360 235 370 245 T 390 255" stroke="#f59e0b" stroke-width="5" fill="none"/>';
    markup += '<text x="360" y="275" fill="#94a3b8" font-size="12" text-anchor="middle">Student Hand (Origin y=0)</text>';

    if(dist <= 140){
      markup += '<line x1="355" y1="240" x2="355" y2="' + svgY + '" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4"/>';
    } else {
      markup += '<line x1="355" y1="240" x2="355" y2="80" stroke="#38bdf8" stroke-width="3"/>';
      markup += '<line x1="365" y1="80" x2="365" y2="' + svgY + '" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4"/>';
    }

    markup += '<circle cx="360" cy="' + svgY + '" r="12" fill="#38bdf8" stroke="#fff" stroke-width="2"/>';
    markup += '<text x="382" y="' + (svgY + 4) + '" fill="#38bdf8" font-weight="700" font-size="13">' + curH.toFixed(0) + ' cm</text>';

    svg.innerHTML = markup;
    svg.setAttribute("aria-label", "Activity 4.1 Ball Toss: Height is " + curH.toFixed(0) + " cm. Distance so far: " + dist.toFixed(0) + " cm. Displacement: " + disp.toFixed(0) + " cm.");

    document.getElementById("lab-readout").innerHTML = 
      '<div class="telemetry-cell"><div class="telemetry-label">Ball Height y(t)</div><div class="telemetry-val">' + curH.toFixed(0) + ' cm</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Cumulative Distance</div><div class="telemetry-val" style="color:#f59e0b;">' + dist.toFixed(0) + ' cm</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Net Displacement</div><div class="telemetry-val" style="color:#818cf8;">+' + disp.toFixed(0) + ' cm</div></div>';

    var verdict = "";
    if(t >= 3.9){
      verdict = "<b>Activity 4.1 Conclusion:</b> The ball returned back into the student's hand! The total path traversed is <b>280 cm</b> (140 cm up + 140 cm down), but the net straight-line displacement from starting position is exactly <b>0 cm</b>!";
    } else if(t >= 1.9 && t <= 2.1){
      verdict = "<b>At Peak (140 cm):</b> Instantaneous velocity is zero. Both distance (140 cm) and displacement (+140 cm upward) are equal at the highest point.";
    } else {
      verdict = "Ball is in flight. Watch how distance accumulates continuously while displacement reflects distance from hand!";
    }
    document.getElementById("lab-verdict").innerHTML = verdict;
  }

  function drawManual(x){
    var svg = document.getElementById("diagram");
    var xOrigin = 220, scale = 4.4;
    var runnerX = xOrigin + x * scale;
    var disp = x;

    var markup = '<rect width="720" height="300" fill="#09131d"/>';
    markup += '<line x1="40" y1="170" x2="680" y2="170" stroke="#334155" stroke-width="6" stroke-linecap="round"/>';
    for(var m = -40; m <= 100; m += 20){
      var px = xOrigin + m * scale;
      markup += '<line x1="' + px + '" y1="162" x2="' + px + '" y2="178" stroke="#64748b" stroke-width="2"/>';
      markup += '<text x="' + px + '" y="196" fill="#94a3b8" font-size="12" font-family="monospace" text-anchor="middle">' + (m > 0 ? "+" + m : m) + 'm</text>';
    }
    markup += '<circle cx="' + xOrigin + '" cy="170" r="5" fill="#38bdf8"/>';
    markup += '<circle cx="' + runnerX + '" cy="148" r="8" fill="#f8fafc"/>';
    markup += '<line x1="' + runnerX + '" y1="156" x2="' + runnerX + '" y2="170" stroke="#f8fafc" stroke-width="3"/>';
    svg.innerHTML = markup;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="telemetry-cell"><div class="telemetry-label">Position x</div><div class="telemetry-val">' + (x >= 0 ? "+" : "") + x + ' m</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Displacement from Origin</div><div class="telemetry-val" style="color:#818cf8;">' + (disp >= 0 ? "+" : "") + disp + ' m</div></div>';
    document.getElementById("ctrl-p1-val").textContent = x + " m";
  }

  window.SIMS.track1d = { mount: mount, draw: draw };
})();

// =========================================================================
// 2. SIMULATION 2: Speedometer & Signed Velocity Vector (speedvel)
// =========================================================================
(function(){
  var simState = {
    mode: "uniform",
    speedKmh: 60,
    direction: 1
  };

  function mount(lesson){
    App.state.maxT = 5.0;
    document.getElementById("time-scrubber").max = 5.0;

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Analog Speedometer (Magnitude ≥ 0)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Signed Velocity Vector (+ / −)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p2-highway">Uniform Highway (+60 km/h East)</button>' +
      '<button class="preset-btn" id="p2-reverse">Reverse Maneuver (−15 km/h West)</button>' +
      '<button class="preset-btn" id="p2-sarang">Sarang 50m Pool (NCERT Pause & Ponder Q4)</button>';

    document.getElementById("p2-highway").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "uniform"; simState.speedKmh = 60; simState.direction = 1;
      App.state.maxT = 5.0;
      document.getElementById("time-scrubber").max = 5.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Moving forward east: Speedometer needle reads 60 km/h; velocity vector points east with +60 km/h.";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p2-reverse").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "reverse"; simState.speedKmh = 15; simState.direction = -1;
      App.state.maxT = 5.0;
      document.getElementById("time-scrubber").max = 5.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> When backing up west: The speedometer needle STILL reads positive (+15 km/h) because speed has no direction! But the velocity vector is negative (−15 km/h).";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p2-sarang").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "sarang";
      App.state.maxT = 25.0;
      document.getElementById("time-scrubber").max = 25.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch (NCERT Pause & Ponder Q4):</strong> Sarang swims 50m out in 10s (+5.0 m/s = 18 km/h), then 50m back in 15s (−3.3 m/s = 12 km/h). Observe average speed = 4.0 m/s while average velocity = 0 m/s!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("lab-controls").innerHTML = 
      '<div class="control-item"><div class="control-label"><span>Vehicle Speed Slider</span><span class="val" id="ctrl-p2-val">60 km/h</span></div>' +
      '<input type="range" id="ctrl-p2-spd" min="0" max="120" value="60" step="5"></div>';

    document.getElementById("ctrl-p2-spd").addEventListener("input", function(e){
      App.pause();
      simState.mode = "custom";
      simState.speedKmh = Number(e.target.value);
      draw(App.state.t);
    });

    draw(0);
  }

  function setActivePreset(btn){
    document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
  }

  function draw(t){
    var svg = document.getElementById("diagram");
    if(!svg) return;

    var curSpeed = simState.speedKmh;
    var curDir = simState.direction;
    var odo = 0;
    var disp = 0;

    if(simState.mode === "sarang"){
      if(t <= 10){
        curSpeed = 18;
        curDir = 1;
        var distM = (t / 10) * 50;
        odo = distM;
        disp = distM;
      } else {
        curSpeed = 12;
        curDir = -1;
        var backM = ((t - 10) / 15) * 50;
        odo = 50 + backM;
        disp = 50 - backM;
      }
    } else {
      var speedMs = (curSpeed * 1000) / 3600;
      odo = speedMs * t;
      disp = curDir * odo;
    }

    var markup = '<rect width="720" height="300" fill="#09131d"/>';
    var cx = 160, cy = 160, r = 90;
    markup += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#15263a" stroke="#334155" stroke-width="4"/>';
    for(var k = 0; k <= 120; k += 20){
      var ang = -140 + (k / 120) * 280;
      var rad = (ang - 90) * Math.PI / 180;
      var tx1 = cx + Math.cos(rad) * 76;
      var ty1 = cy + Math.sin(rad) * 76;
      var tx2 = cx + Math.cos(rad) * 86;
      var ty2 = cy + Math.sin(rad) * 86;
      markup += '<line x1="' + tx1 + '" y1="' + ty1 + '" x2="' + tx2 + '" y2="' + ty2 + '" stroke="#94a3b8" stroke-width="2"/>';
      var lx = cx + Math.cos(rad) * 60;
      var ly = cy + Math.sin(rad) * 60;
      markup += '<text x="' + lx + '" y="' + (ly + 4) + '" fill="#cbd5e1" font-size="10" font-family="monospace" text-anchor="middle">' + k + '</text>';
    }

    var needleAng = -140 + (Math.min(120, curSpeed) / 120) * 280;
    var needleRad = (needleAng - 90) * Math.PI / 180;
    var nx = cx + Math.cos(needleRad) * 72;
    var ny = cy + Math.sin(needleRad) * 72;
    markup += '<line x1="' + cx + '" y1="' + cy + '" x2="' + nx + '" y2="' + ny + '" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>';
    markup += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#f59e0b"/>';
    markup += '<text x="' + cx + '" y="' + (cy + 40) + '" fill="#f59e0b" font-weight="700" font-size="14" text-anchor="middle">' + curSpeed.toFixed(0) + ' km/h</text>';
    markup += '<text x="' + cx + '" y="' + (cy + 55) + '" fill="#94a3b8" font-size="11" text-anchor="middle">SPEEDOMETER</text>';

    markup += '<rect x="300" y="110" width="390" height="100" rx="8" fill="#15263a" stroke="#334155"/>';
    markup += '<line x1="320" y1="160" x2="670" y2="160" stroke="#475569" stroke-width="2" stroke-dasharray="6"/>';

    var carOffset = 0;
    if(simState.mode === "sarang"){
      carOffset = (disp / 50) * 240;
    } else {
      carOffset = (t % 4) * 60;
      if(curDir < 0) carOffset = 240 - carOffset;
    }
    var carX = 350 + carOffset;

    markup += '<g transform="translate(' + carX + ', 140)">';
    markup += '<rect x="-24" y="-12" width="48" height="20" rx="4" fill="#38bdf8"/>';
    markup += '<circle cx="-14" cy="10" r="5" fill="#0f172a"/>';
    markup += '<circle cx="14" cy="10" r="5" fill="#0f172a"/>';
    if(curDir > 0){
      markup += '<polygon points="24,-4 32,-8 32,0" fill="#fde047" opacity="0.8"/>';
    } else {
      markup += '<polygon points="-24,-4 -32,-8 -32,0" fill="#fde047" opacity="0.8"/>';
    }
    markup += '</g>';

    var arrowLen = Math.min(80, (curSpeed / 120) * 100);
    var arrowX2 = carX + (curDir > 0 ? arrowLen : -arrowLen);
    markup += '<defs><marker id="vel-arr" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8"/></marker></defs>';
    if(curSpeed > 0.5){
      markup += '<line x1="' + carX + '" y1="90" x2="' + arrowX2 + '" y2="90" stroke="#38bdf8" stroke-width="4" marker-end="url(#vel-arr)"/>';
      markup += '<text x="' + carX + '" y="78" fill="#38bdf8" font-weight="700" font-size="12" text-anchor="middle">Velocity: ' + (curDir > 0 ? "+" : "−") + curSpeed.toFixed(0) + ' km/h (' + (curDir > 0 ? "East" : "West") + ')</text>';
    }

    svg.innerHTML = markup;
    svg.setAttribute("aria-label", "Speedometer reading " + curSpeed.toFixed(0) + " km/h. Velocity is " + (curDir > 0 ? "+" : "−") + curSpeed.toFixed(0) + " km/h.");

    var speedMs = (curSpeed * 1000) / 3600;
    var velMs = curDir * speedMs;
    document.getElementById("lab-readout").innerHTML = 
      '<div class="telemetry-cell"><div class="telemetry-label">Speedometer (Magnitude)</div><div class="telemetry-val" style="color:#f59e0b;">' + curSpeed.toFixed(0) + ' km/h</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Instantaneous Velocity</div><div class="telemetry-val" style="color:#38bdf8;">' + (velMs >= 0 ? "+" : "") + velMs.toFixed(1) + ' m/s</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Odometer (Total Path)</div><div class="telemetry-val">' + odo.toFixed(1) + ' m</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Net Displacement</div><div class="telemetry-val">' + (disp >= 0 ? "+" : "") + disp.toFixed(1) + ' m</div></div>';

    var verdict = "";
    if(simState.mode === "sarang"){
      verdict = "<b>NCERT Pause & Ponder Q4 Analysis:</b> Total distance = 100 m in 25 s ⟹ <b>Average Speed = 4.0 m/s (14.4 km/h)</b>. Because Sarang returns to his starting point, net displacement = 0 m ⟹ <b>Average Velocity = 0.0 m/s</b>. Speed and velocity are fundamentally distinct!";
    } else if(curDir < 0){
      verdict = "<b>Reversing Vehicle:</b> Notice that the speedometer never points negative—it measures the scalar rate of motion (15 km/h). Velocity, however, carries a negative sign (−15 km/h) because it points in the opposite direction!";
    } else {
      verdict = "<b>Uniform Straight Motion:</b> Vehicle is driving East at constant speed. Since direction is constant, average speed equals magnitude of average velocity.";
    }
    document.getElementById("lab-verdict").innerHTML = verdict;
    var cVal = document.getElementById("ctrl-p2-val");
    if(cVal) cVal.textContent = curSpeed.toFixed(0) + " km/h";
  }

  window.SIMS.speedvel = { mount: mount, draw: draw };
})();

// =========================================================================
// 3. SIMULATION 3: Acceleration, Braking & Inertial Tilt (accel)
// =========================================================================
(function(){
  var simState = {
    a: 2.0,
    u: 0,
    tSpan: 6.0
  };

  function mount(lesson){
    App.state.maxT = 6.0;
    document.getElementById("time-scrubber").max = 6.0;

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Velocity Vector v⃗</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Acceleration Vector a⃗</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Passenger Inertial Tilt</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p3-accel">Uniform Acceleration (+2 m/s²)</button>' +
      '<button class="preset-btn" id="p3-brake">Emergency Braking (−4 m/s²)</button>' +
      '<button class="preset-btn" id="p3-cruise">Zero Acceleration / Cruise (a = 0)</button>';

    document.getElementById("p3-accel").addEventListener("click", function(){
      setActivePreset(this);
      simState.u = 0; simState.a = 2.0; App.state.maxT = 6.0;
      document.getElementById("time-scrubber").max = 6.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Speeding up forward: a⃗ points forward with v⃗. Notice the passenger silhouette tilts backward into the seat due to inertia!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p3-brake").addEventListener("click", function(){
      setActivePreset(this);
      simState.u = 24; simState.a = -4.0; App.state.maxT = 6.0;
      document.getElementById("time-scrubber").max = 6.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Braking stop: Velocity v⃗ points forward (+), but acceleration a⃗ points backward (−). The passenger tilts forward!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p3-cruise").addEventListener("click", function(){
      setActivePreset(this);
      simState.u = 15; simState.a = 0.0; App.state.maxT = 6.0;
      document.getElementById("time-scrubber").max = 6.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Constant speed: a = 0 m/s². The passenger sits perfectly upright. No net force, no acceleration.";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("lab-controls").innerHTML = 
      '<div class="control-item"><div class="control-label"><span>Acceleration (a)</span><span class="val" id="ctrl-p3-aval">+2.0 m/s²</span></div>' +
      '<input type="range" id="ctrl-p3-a" min="-6" max="6" value="2" step="0.5"></div>' +
      '<div class="control-item"><div class="control-label"><span>Initial Speed (u)</span><span class="val" id="ctrl-p3-uval">0 m/s</span></div>' +
      '<input type="range" id="ctrl-p3-u" min="0" max="30" value="0" step="2"></div>';

    document.getElementById("ctrl-p3-a").addEventListener("input", function(e){
      App.pause();
      simState.a = Number(e.target.value);
      draw(App.state.t);
    });
    document.getElementById("ctrl-p3-u").addEventListener("input", function(e){
      App.pause();
      simState.u = Number(e.target.value);
      draw(App.state.t);
    });

    draw(0);
  }

  function setActivePreset(btn){
    document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
  }

  function draw(t){
    var svg = document.getElementById("diagram");
    if(!svg) return;

    var u = simState.u;
    var a = simState.a;
    var v = u + a * t;
    if(u > 0 && a < 0 && v < 0) v = 0;
    var s = u * t + 0.5 * a * t * t;

    var carX = 140 + (s % 120) * 3.5;
    var markup = '<rect width="720" height="300" fill="#09131d"/>';
    markup += '<rect x="40" y="140" width="640" height="90" fill="#15263a" rx="6"/>';
    markup += '<line x1="40" y1="185" x2="680" y2="185" stroke="#475569" stroke-width="2" stroke-dasharray="10"/>';

    markup += '<g transform="translate(' + carX + ', 175)">';
    markup += '<rect x="-35" y="-20" width="70" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
    markup += '<rect x="-18" y="-36" width="40" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>';
    markup += '<circle cx="-20" cy="8" r="8" fill="#020617" stroke="#64748b" stroke-width="2"/>';
    markup += '<circle cx="20" cy="8" r="8" fill="#020617" stroke="#64748b" stroke-width="2"/>';

    var tiltDeg = -a * 4.5;
    if(tiltDeg > 28) tiltDeg = 28;
    if(tiltDeg < -28) tiltDeg = -28;
    markup += '<g transform="translate(0, -20) rotate(' + tiltDeg + ')">';
    markup += '<circle cx="0" cy="-8" r="5" fill="#ec4899"/>';
    markup += '<line x1="0" y1="-3" x2="0" y2="10" stroke="#ec4899" stroke-width="3"/>';
    markup += '</g>';
    markup += '</g>';

    var vLen = Math.min(90, v * 3);
    if(v > 0.5){
      markup += '<defs><marker id="arr-v" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8"/></marker></defs>';
      markup += '<line x1="' + carX + '" y1="115" x2="' + (carX + vLen) + '" y2="115" stroke="#38bdf8" stroke-width="4" marker-end="url(#arr-v)"/>';
      markup += '<text x="' + (carX + vLen/2) + '" y="105" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">v = ' + v.toFixed(1) + ' m/s</text>';
    }

    var aLen = Math.abs(a) * 14;
    var aDir = a >= 0 ? 1 : -1;
    if(Math.abs(a) > 0.1){
      markup += '<defs><marker id="arr-a" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b"/></marker></defs>';
      markup += '<line x1="' + carX + '" y1="75" x2="' + (carX + aDir * aLen) + '" y2="75" stroke="#f59e0b" stroke-width="4" marker-end="url(#arr-a)"/>';
      markup += '<text x="' + (carX + aDir * aLen/2) + '" y="65" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">a = ' + (a > 0 ? "+" : "") + a.toFixed(1) + ' m/s²</text>';
    }

    svg.innerHTML = markup;
    svg.setAttribute("aria-label", "Acceleration lab: velocity is " + v.toFixed(1) + " m/s. Acceleration is " + a.toFixed(1) + " m/s².");

    document.getElementById("lab-readout").innerHTML = 
      '<div class="telemetry-cell"><div class="telemetry-label">Current Velocity (v)</div><div class="telemetry-val" style="color:#38bdf8;">' + v.toFixed(1) + ' m/s</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Acceleration (a)</div><div class="telemetry-val" style="color:#f59e0b;">' + (a >= 0 ? "+" : "") + a.toFixed(1) + ' m/s²</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Distance Travelled (s)</div><div class="telemetry-val">' + s.toFixed(1) + ' m</div></div>';

    var verdict = "";
    if(a > 0){
      verdict = "<b>Speeding Up:</b> Acceleration a⃗ points in the same direction as velocity v⃗. Velocity increases by " + a.toFixed(1) + " m/s every single second!";
    } else if(a < 0){
      verdict = "<b>Slowing Down (Deceleration / Retardation):</b> Acceleration a⃗ points backward, directly opposing forward velocity v⃗. <i>Rule:</i> Slowing down means acceleration and velocity have opposite directions.";
    } else {
      verdict = "<b>Zero Acceleration:</b> Velocity is completely constant. No inertial tilt is experienced by the passenger.";
    }
    document.getElementById("lab-verdict").innerHTML = verdict;

    var aval = document.getElementById("ctrl-p3-aval");
    var uval = document.getElementById("ctrl-p3-uval");
    if(aval) aval.textContent = (a >= 0 ? "+" : "") + a.toFixed(1) + " m/s²";
    if(uval) uval.textContent = u.toFixed(0) + " m/s";
  }

  window.SIMS.accel = { mount: mount, draw: draw };
})();

// =========================================================================
// 4. SIMULATION 4: Position–Time Graphs & Slope Triangle (stgraph)
// =========================================================================
(function(){
  var simState = {
    mode: "triangle",
    t1: 2,
    t2: 6,
    v: 10
  };

  function mount(lesson){
    App.state.maxT = 10.0;
    document.getElementById("time-scrubber").max = 10.0;

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Position Curve s(t)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Activity 4.4 Slope Triangle ABC</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p4-triangle">Activity 4.4: Interactive Slope Triangle (Δs / Δt)</button>' +
      '<button class="preset-btn" id="p4-plot">Activity 4.3: Progressive Data Plotting</button>' +
      '<button class="preset-btn" id="p4-rest">Object at Rest (Slope = 0)</button>';

    document.getElementById("p4-triangle").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "triangle"; simState.v = 10;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch (Activity 4.4):</strong> Triangle ABC on the s–t curve has vertical side BC = Δs and horizontal side AC = Δt. The ratio Δs / Δt equals the speed!";
      draw(App.state.t);
    });

    document.getElementById("p4-plot").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "plot";
      App.state.maxT = 10.0;
      document.getElementById("time-scrubber").max = 10.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch (Activity 4.3):</strong> Step or play through the timeline to plot each measured data point (t, s) one by one and watch the straight-line graph emerge!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p4-rest").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "rest";
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> A stationary object remains at s = 40 m for all t. The line is horizontal, Δs = 0, so slope = 0 m/s (velocity is zero).";
      draw(App.state.t);
    });

    document.getElementById("lab-controls").innerHTML = 
      '<div class="control-item"><div class="control-label"><span>Point A Time (t₁)</span><span class="val" id="ctrl-p4-t1val">2 s</span></div>' +
      '<input type="range" id="ctrl-p4-t1" min="0" max="5" value="2" step="1"></div>' +
      '<div class="control-item"><div class="control-label"><span>Point B Time (t₂)</span><span class="val" id="ctrl-p4-t2val">6 s</span></div>' +
      '<input type="range" id="ctrl-p4-t2" min="6" max="10" value="6" step="1"></div>';

    document.getElementById("ctrl-p4-t1").addEventListener("input", function(e){
      simState.t1 = Number(e.target.value);
      draw(App.state.t);
    });
    document.getElementById("ctrl-p4-t2").addEventListener("input", function(e){
      simState.t2 = Number(e.target.value);
      draw(App.state.t);
    });

    draw(0);
  }

  function setActivePreset(btn){
    document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
  }

  function draw(t){
    var svg = document.getElementById("diagram");
    if(!svg) return;

    var originX = 120, originY = 240;
    var scaleX = 48, scaleY = 1.9;

    function toG(x, y){
      return { x: originX + x * scaleX, y: originY - y * scaleY };
    }

    var markup = '<rect width="720" height="300" fill="#09131d"/>';

    for(var s = 0; s <= 100; s += 20){
      var pt = toG(0, s);
      markup += '<line x1="' + originX + '" y1="' + pt.y + '" x2="640" y2="' + pt.y + '" stroke="#1e293b" stroke-width="1"/>';
      markup += '<text x="' + (originX - 10) + '" y="' + (pt.y + 4) + '" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="end">' + s + '</text>';
    }
    for(var time = 0; time <= 10; time += 2){
      var ptX = toG(time, 0);
      markup += '<line x1="' + ptX.x + '" y1="' + originY + '" x2="' + ptX.x + '" y2="40" stroke="#1e293b" stroke-width="1"/>';
      markup += '<text x="' + ptX.x + '" y="' + (originY + 18) + '" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">' + time + 's</text>';
    }

    markup += '<line x1="' + originX + '" y1="' + originY + '" x2="650" y2="' + originY + '" stroke="#64748b" stroke-width="2"/>';
    markup += '<line x1="' + originX + '" y1="' + originY + '" x2="' + originX + '" y2="30" stroke="#64748b" stroke-width="2"/>';
    markup += '<text x="655" y="' + (originY + 4) + '" fill="#cbd5e1" font-size="12">Time t (s)</text>';
    markup += '<text x="' + originX + '" y="20" fill="#cbd5e1" font-size="12" text-anchor="middle">Position s (m)</text>';

    if(simState.mode === "plot"){
      var pts = [ [0,0], [2,15], [4,30], [6,45], [8,60], [10,75] ];
      var maxPlotIdx = Math.min(pts.length - 1, Math.floor(t / 1.6));
      for(var pi = 0; pi <= maxPlotIdx; pi++){
        var gp = toG(pts[pi][0], pts[pi][1]);
        markup += '<circle cx="' + gp.x + '" cy="' + gp.y + '" r="6" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>';
        markup += '<text x="' + gp.x + '" y="' + (gp.y - 10) + '" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">(' + pts[pi][0] + 's, ' + pts[pi][1] + 'm)</text>';
      }
      if(maxPlotIdx > 0){
        var lastPt = toG(pts[maxPlotIdx][0], pts[maxPlotIdx][1]);
        markup += '<line x1="' + originX + '" y1="' + originY + '" x2="' + lastPt.x + '" y2="' + lastPt.y + '" stroke="#38bdf8" stroke-width="3"/>';
      }
    } else if(simState.mode === "rest"){
      var rPt = toG(0, 40);
      markup += '<line x1="' + originX + '" y1="' + rPt.y + '" x2="640" y2="' + rPt.y + '" stroke="#38bdf8" stroke-width="4"/>';
      markup += '<text x="380" y="' + (rPt.y - 12) + '" fill="#38bdf8" font-size="13" font-weight="700">Stationary Object (s = 40 m, v = 0 m/s)</text>';
    } else {
      var vVal = simState.v;
      var endG = toG(10, vVal * 10);
      markup += '<line x1="' + originX + '" y1="' + originY + '" x2="' + endG.x + '" y2="' + endG.y + '" stroke="#38bdf8" stroke-width="3"/>';

      var t1 = simState.t1, t2 = simState.t2;
      var s1 = vVal * t1, s2 = vVal * t2;
      var pA = toG(t1, s1);
      var pB = toG(t2, s2);
      var pC = toG(t2, s1);

      markup += '<polygon points="' + pA.x + ',' + pA.y + ' ' + pC.x + ',' + pC.y + ' ' + pB.x + ',' + pB.y + '" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="2"/>';
      markup += '<circle cx="' + pA.x + '" cy="' + pA.y + '" r="5" fill="#fff" stroke="#f59e0b" stroke-width="2"/>';
      markup += '<text x="' + (pA.x - 8) + '" y="' + (pA.y - 8) + '" fill="#fff" font-weight="700" font-size="12">A(' + t1 + 's,' + s1 + 'm)</text>';

      markup += '<circle cx="' + pB.x + '" cy="' + pB.y + '" r="5" fill="#fff" stroke="#f59e0b" stroke-width="2"/>';
      markup += '<text x="' + (pB.x + 8) + '" y="' + (pB.y - 8) + '" fill="#fff" font-weight="700" font-size="12">B(' + t2 + 's,' + s2 + 'm)</text>';
      markup += '<text x="' + (pC.x + 8) + '" y="' + (pC.y + 14) + '" fill="#94a3b8" font-size="11">C</text>';

      markup += '<text x="' + ((pA.x + pC.x)/2) + '" y="' + (pC.y + 16) + '" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">Δt = ' + (t2 - t1) + ' s</text>';
      markup += '<text x="' + (pB.x + 10) + '" y="' + ((pB.y + pC.y)/2) + '" fill="#f59e0b" font-size="12" font-weight="700">Δs = ' + (s2 - s1) + ' m</text>';
    }

    svg.innerHTML = markup;
    svg.setAttribute("aria-label", "Position-time graph lab showing slope calculation.");

    if(simState.mode === "triangle"){
      var ds = simState.v * (simState.t2 - simState.t1);
      var dt = simState.t2 - simState.t1;
      var slope = ds / dt;
      document.getElementById("lab-readout").innerHTML = 
        '<div class="telemetry-cell"><div class="telemetry-label">Vertical Change (Δs)</div><div class="telemetry-val" style="color:#f59e0b;">' + ds + ' m</div></div>' +
        '<div class="telemetry-cell"><div class="telemetry-label">Time Interval (Δt)</div><div class="telemetry-val" style="color:#f59e0b;">' + dt + ' s</div></div>' +
        '<div class="telemetry-cell"><div class="telemetry-label">Slope = Δs / Δt (Velocity)</div><div class="telemetry-val" style="color:#38bdf8;">' + slope.toFixed(1) + ' m/s</div></div>';

      document.getElementById("lab-verdict").innerHTML = 
        "<b>Activity 4.4 Slope Principle:</b> Slope = BC / AC = Δs / Δt = <b>" + slope.toFixed(1) + " m/s</b>. Because the line is straight, you can pick ANY two points along the curve and you will obtain the exact same velocity!";
    } else if(simState.mode === "rest"){
      document.getElementById("lab-readout").innerHTML = 
        '<div class="telemetry-cell"><div class="telemetry-label">Slope Δs / Δt</div><div class="telemetry-val" style="color:#38bdf8;">0.0 m/s</div></div>' +
        '<div class="telemetry-cell"><div class="telemetry-label">State</div><div class="telemetry-val">At Rest</div></div>';
      document.getElementById("lab-verdict").innerHTML = "Horizontal position line indicates zero motion. Slope = 0 ⟹ Object velocity = 0.";
    }

    var t1v = document.getElementById("ctrl-p4-t1val");
    var t2v = document.getElementById("ctrl-p4-t2val");
    if(t1v) t1v.textContent = simState.t1 + " s";
    if(t2v) t2v.textContent = simState.t2 + " s";
  }

  window.SIMS.stgraph = { mount: mount, draw: draw };
})();

// =========================================================================
// 5. SIMULATION 5: Velocity–Time Graphs & Progressive Area (vtgraph)
// =========================================================================
(function(){
  var simState = {
    scenario: "ex4_4"
  };

  function mount(lesson){
    App.state.maxT = 4.0;
    document.getElementById("time-scrubber").max = 4.0;

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Velocity Curve v(t)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:rgba(56,189,248,0.35);"></span><span>Cumulative Shaded Area = Displacement</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#64748b;"></span><span>Dashed Ghost Line: Future Trajectory</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p5-ex44">NCERT Example 4.4 (Uniform Accel to 8 m/s)</button>' +
      '<button class="preset-btn" id="p5-trip9">NCERT Ex Q9 (Car 3-Stage Trip: 310 m)</button>' +
      '<button class="preset-btn" id="p5-cyc12">NCERT Ex Q12 (Cyclist Run: 150 m)</button>';

    document.getElementById("p5-ex44").addEventListener("click", function(){
      setActivePreset(this);
      simState.scenario = "ex4_4";
      App.state.maxT = 4.0;
      document.getElementById("time-scrubber").max = 4.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch (Example 4.4):</strong> Car accelerates from rest at 2 m/s² for 4 s to reach 8 m/s. The area of the triangle is ½ × 4 × 8 = 16 m!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p5-trip9").addEventListener("click", function(){
      setActivePreset(this);
      simState.scenario = "trip9";
      App.state.maxT = 21.0;
      document.getElementById("time-scrubber").max = 21.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch (NCERT Ex Q9):</strong> 3-Stage Trip: 0–5s accel (area=50m) + 5–15s cruise (area=200m) + 15–21s braking (area=60m). Watch area accumulate progressively to 310 m without showing future area!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p5-cyc12").addEventListener("click", function(){
      setActivePreset(this);
      simState.scenario = "cyclist12";
      App.state.maxT = 20.0;
      document.getElementById("time-scrubber").max = 20.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch (NCERT Ex Q12):</strong> Cyclist accelerates for 5s to 10 m/s (25m), cruises for 10s (100m), and brakes to rest in 5s (25m). Total distance = 150 m!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }

  function setActivePreset(btn){
    document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
  }

  function draw(t){
    var svg = document.getElementById("diagram");
    if(!svg) return;

    var originX = 90, originY = 240;
    var maxT = App.state.maxT;
    var maxV = simState.scenario === "ex4_4" ? 10 : 25;
    var scaleX = 540 / maxT;
    var scaleY = 190 / maxV;

    function toG(time, vel){
      return { x: originX + time * scaleX, y: originY - vel * scaleY };
    }

    var markup = '<rect width="720" height="300" fill="#09131d"/>';
    markup += '<line x1="' + originX + '" y1="' + originY + '" x2="660" y2="' + originY + '" stroke="#64748b" stroke-width="2"/>';
    markup += '<line x1="' + originX + '" y1="' + originY + '" x2="' + originX + '" y2="30" stroke="#64748b" stroke-width="2"/>';
    markup += '<text x="665" y="' + (originY + 4) + '" fill="#cbd5e1" font-size="12">Time t (s)</text>';
    markup += '<text x="' + originX + '" y="22" fill="#cbd5e1" font-size="12" text-anchor="middle">Velocity v (m/s)</text>';

    function getV(time){
      if(simState.scenario === "ex4_4"){
        return Math.min(8, 2 * time);
      } else if(simState.scenario === "trip9"){
        if(time <= 5) return (time / 5) * 20;
        if(time <= 15) return 20;
        if(time <= 21) return 20 - ((time - 15) / 6) * 20;
        return 0;
      } else {
        if(time <= 5) return (time / 5) * 10;
        if(time <= 15) return 10;
        if(time <= 20) return 10 - ((time - 15) / 5) * 10;
        return 0;
      }
    }

    var futurePath = "M " + originX + " " + originY;
    for(var step = 0; step <= maxT; step += 0.5){
      var pt = toG(step, getV(step));
      futurePath += " L " + pt.x + " " + pt.y;
    }
    markup += '<path d="' + futurePath + '" stroke="#475569" stroke-width="2" stroke-dasharray="4" fill="none"/>';

    if(t > 0){
      var areaPoly = "M " + originX + " " + originY;
      for(var tau = 0; tau <= t; tau += 0.2){
        var gp = toG(tau, getV(tau));
        areaPoly += " L " + gp.x + " " + gp.y;
      }
      var endPt = toG(t, getV(t));
      areaPoly += " L " + endPt.x + " " + endPt.y + " L " + endPt.x + " " + originY + " Z";
      markup += '<path d="' + areaPoly + '" fill="rgba(56,189,248,0.3)" stroke="none"/>';

      var activePath = "M " + originX + " " + originY;
      for(var tau2 = 0; tau2 <= t; tau2 += 0.2){
        var ap = toG(tau2, getV(tau2));
        activePath += " L " + ap.x + " " + ap.y;
      }
      markup += '<path d="' + activePath + '" stroke="#38bdf8" stroke-width="3.5" fill="none"/>';
      markup += '<circle cx="' + endPt.x + '" cy="' + endPt.y + '" r="5" fill="#38bdf8"/>';
    }

    var totalArea = 0;
    var dt = 0.05;
    for(var tt = 0; tt <= t; tt += dt){
      totalArea += getV(tt) * dt;
    }

    svg.innerHTML = markup;
    svg.setAttribute("aria-label", "Velocity-time graph: current velocity is " + getV(t).toFixed(1) + " m/s. Cumulative area is " + totalArea.toFixed(1) + " meters.");

    document.getElementById("lab-readout").innerHTML = 
      '<div class="telemetry-cell"><div class="telemetry-label">Current Velocity v(t)</div><div class="telemetry-val" style="color:#38bdf8;">' + getV(t).toFixed(1) + ' m/s</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Shaded Area = Displacement</div><div class="telemetry-val" style="color:#38bdf8;">' + totalArea.toFixed(1) + ' m</div></div>';

    var verdict = "";
    if(simState.scenario === "ex4_4"){
      verdict = "<b>NCERT Example 4.4:</b> Area of triangle = ½ × base × height = ½ × 4s × 8 m/s = <b>16.0 m</b> displacement.";
    } else if(simState.scenario === "trip9"){
      if(t >= 20.9){
        verdict = "<b>NCERT Ex Q9 Final Verification:</b> Total Area = Triangle (50 m) + Rectangle (200 m) + Braking Triangle (60 m) = <b>310 m</b> total displacement!";
      } else {
        verdict = "Progressively integrating displacement across 3 stages. Current displacement: " + totalArea.toFixed(1) + " m.";
      }
    } else {
      if(t >= 19.9){
        verdict = "<b>NCERT Ex Q12 Final Verification:</b> Cyclist accelerates (25 m) + cruises (100 m) + brakes (25 m) = <b>150 m</b> total distance.";
      } else {
        verdict = "Cyclist journey in progress. Current distance: " + totalArea.toFixed(1) + " m.";
      }
    }
    document.getElementById("lab-verdict").innerHTML = verdict;
  }

  window.SIMS.vtgraph = { mount: mount, draw: draw };
})();

// =========================================================================
// 6. SIMULATION 6: Three Equations & Highway Emergency Stopping (kinematics)
// =========================================================================
(function(){
  var simState = {
    uKmh: 36,
    tReact: 0.0,
    brakeA: 2.0,
    obstacleGap: 30
  };

  function mount(lesson){
    App.state.maxT = 7.0;
    document.getElementById("time-scrubber").max = 7.0;

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Thinking Zone s₁ (Reaction delay)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Braking Zone s₂ (Deceleration)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Obstacle Position</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p6-q10">NCERT Ex Q10 (Bus at 36 km/h, 30m Gap)</button>' +
      '<button class="preset-btn" id="p6-fast">High Speed Crash (72 km/h, 30m Gap)</button>' +
      '<button class="preset-btn" id="p6-abs">ABS Braking Test (54 km/h, a = −5 m/s²)</button>';

    document.getElementById("p6-q10").addEventListener("click", function(){
      setActivePreset(this);
      simState.uKmh = 36; simState.tReact = 0.0; simState.brakeA = 2.0; simState.obstacleGap = 30;
      updateControls();
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch (NCERT Ex Q10):</strong> Bus travelling at 36 km/h (10 m/s) brakes at 2 m/s². Braking distance is s = u²/(2|a|) = 100/4 = 25 m. Since 25 m < 30 m, it stops 5 m safely before the obstacle!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p6-fast").addEventListener("click", function(){
      setActivePreset(this);
      simState.uKmh = 72; simState.tReact = 0.8; simState.brakeA = 3.0; simState.obstacleGap = 30;
      updateControls();
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> High speed (72 km/h = 20 m/s) with 0.8s reaction delay: Thinking distance s₁ = 16 m, braking distance s₂ = 66.7 m! Total 82.7 m > 30 m gap ⟹ CRASH!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p6-abs").addEventListener("click", function(){
      setActivePreset(this);
      simState.uKmh = 54; simState.tReact = 0.5; simState.brakeA = 5.0; simState.obstacleGap = 35;
      updateControls();
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> ABS high deceleration (5 m/s²): s₁ = 7.5 m, s₂ = 22.5 m. Total stopping distance = 30 m ≤ 35 m. Safe stop!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("lab-controls").innerHTML = 
      '<div class="control-item"><div class="control-label"><span>Initial Speed (u)</span><span class="val" id="ctrl-p6-uval">36 km/h</span></div>' +
      '<input type="range" id="ctrl-p6-u" min="18" max="90" value="36" step="9"></div>' +
      '<div class="control-item"><div class="control-label"><span>Driver Reaction Time</span><span class="val" id="ctrl-p6-trval">0.0 s</span></div>' +
      '<input type="range" id="ctrl-p6-tr" min="0" max="1.5" value="0" step="0.1"></div>' +
      '<div class="control-item"><div class="control-label"><span>Braking Deceleration (|a|)</span><span class="val" id="ctrl-p6-aval">2.0 m/s²</span></div>' +
      '<input type="range" id="ctrl-p6-a" min="1" max="6" value="2" step="0.5"></div>';

    document.getElementById("ctrl-p6-u").addEventListener("input", function(e){
      App.pause();
      clearPresetActive();
      simState.uKmh = Number(e.target.value);
      draw(App.state.t);
    });
    document.getElementById("ctrl-p6-tr").addEventListener("input", function(e){
      App.pause();
      clearPresetActive();
      simState.tReact = Number(e.target.value);
      draw(App.state.t);
    });
    document.getElementById("ctrl-p6-a").addEventListener("input", function(e){
      App.pause();
      clearPresetActive();
      simState.brakeA = Number(e.target.value);
      draw(App.state.t);
    });

    draw(0);
  }

  function clearPresetActive(){
    document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
  }

  function setActivePreset(btn){
    clearPresetActive();
    btn.classList.add("active");
  }

  function updateControls(){
    var cu = document.getElementById("ctrl-p6-u");
    var ctr = document.getElementById("ctrl-p6-tr");
    var ca = document.getElementById("ctrl-p6-a");
    if(cu) cu.value = simState.uKmh;
    if(ctr) ctr.value = simState.tReact;
    if(ca) ca.value = simState.brakeA;
  }

  function draw(t){
    var svg = document.getElementById("diagram");
    if(!svg) return;

    var u = (simState.uKmh * 1000) / 3600;
    var tR = simState.tReact;
    var a = simState.brakeA;
    var tBrake = u / a;

    var s1 = u * tR;
    var s2 = (u * u) / (2 * a);
    var sTotal = s1 + s2;

    var curPos = 0;
    var curV = u;
    if(t <= tR){
      curPos = u * t;
      curV = u;
    } else {
      var tDec = t - tR;
      if(tDec <= tBrake){
        curPos = s1 + u * tDec - 0.5 * a * tDec * tDec;
        curV = Math.max(0, u - a * tDec);
      } else {
        curPos = sTotal;
        curV = 0;
      }
    }

    var scaleRoad = 520 / 60;
    var busX = 80 + curPos * scaleRoad;
    var obsX = 80 + simState.obstacleGap * scaleRoad;

    var markup = '<rect width="720" height="300" fill="#09131d"/>';
    markup += '<rect x="60" y="40" width="600" height="90" fill="#15263a" rx="6"/>';
    markup += '<line x1="60" y1="85" x2="660" y2="85" stroke="#475569" stroke-width="2" stroke-dasharray="8"/>';

    if(s1 > 0){
      var z1w = s1 * scaleRoad;
      markup += '<rect x="80" y="45" width="' + z1w + '" height="80" fill="rgba(245,158,11,0.25)"/>';
      markup += '<text x="' + (80 + z1w/2) + '" y="60" fill="#f59e0b" font-size="11" text-anchor="middle">Thinking Zone s₁ = ' + s1.toFixed(1) + 'm</text>';
    }
    var z2x = 80 + s1 * scaleRoad;
    var z2w = s2 * scaleRoad;
    markup += '<rect x="' + z2x + '" y="45" width="' + z2w + '" height="80" fill="rgba(56,189,248,0.2)"/>';
    markup += '<text x="' + (z2x + z2w/2) + '" y="60" fill="#38bdf8" font-size="11" text-anchor="middle">Braking Zone s₂ = ' + s2.toFixed(1) + 'm</text>';

    markup += '<rect x="' + (obsX - 10) + '" y="55" width="20" height="60" fill="#ef4444" rx="3"/>';
    markup += '<text x="' + obsX + '" y="50" fill="#ef4444" font-size="11" font-weight="700" text-anchor="middle">Obstacle (' + simState.obstacleGap + 'm)</text>';

    markup += '<g transform="translate(' + busX + ', 85)">';
    markup += '<rect x="-28" y="-18" width="56" height="32" rx="4" fill="#254ad7" stroke="#fff" stroke-width="1.5"/>';
    markup += '<circle cx="-16" cy="14" r="5" fill="#020617"/>';
    markup += '<circle cx="16" cy="14" r="5" fill="#020617"/>';
    markup += '</g>';

    var gOx = 80, gOy = 270;
    markup += '<line x1="' + gOx + '" y1="' + gOy + '" x2="640" y2="' + gOy + '" stroke="#64748b" stroke-width="1.5"/>';
    markup += '<line x1="' + gOx + '" y1="' + gOy + '" x2="' + gOx + '" y2="160" stroke="#64748b" stroke-width="1.5"/>';
    markup += '<text x="645" y="' + (gOy + 4) + '" fill="#94a3b8" font-size="11">Time t</text>';
    markup += '<text x="' + gOx + '" y="152" fill="#94a3b8" font-size="11" text-anchor="middle">Velocity v</text>';

    var gScaleT = 500 / 8;
    var gScaleV = 90 / 25;
    var tR_px = tR * gScaleT;
    var u_py = gOy - u * gScaleV;
    if(tR > 0){
      markup += '<rect x="' + gOx + '" y="' + u_py + '" width="' + tR_px + '" height="' + (gOy - u_py) + '" fill="rgba(245,158,11,0.3)"/>';
    }
    var tB_px = (tR + tBrake) * gScaleT;
    markup += '<polygon points="' + (gOx + tR_px) + ',' + u_py + ' ' + (gOx + tB_px) + ',' + gOy + ' ' + (gOx + tR_px) + ',' + gOy + '" fill="rgba(56,189,248,0.3)"/>';
    markup += '<line x1="' + gOx + '" y1="' + u_py + '" x2="' + (gOx + tR_px) + '" y2="' + u_py + '" stroke="#f59e0b" stroke-width="2"/>';
    markup += '<line x1="' + (gOx + tR_px) + '" y1="' + u_py + '" x2="' + (gOx + tB_px) + '" y2="' + gOy + '" stroke="#38bdf8" stroke-width="2"/>';

    svg.innerHTML = markup;
    svg.setAttribute("aria-label", "Emergency stopping lab: total stopping distance is " + sTotal.toFixed(1) + " meters.");

    document.getElementById("lab-readout").innerHTML = 
      '<div class="telemetry-cell"><div class="telemetry-label">Thinking Distance s₁ = u·t_r</div><div class="telemetry-val" style="color:#f59e0b;">' + s1.toFixed(1) + ' m</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Braking Distance s₂ = u²/(2|a|)</div><div class="telemetry-val" style="color:#38bdf8;">' + s2.toFixed(1) + ' m</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Total Stopping Distance (s_stop)</div><div class="telemetry-val">' + sTotal.toFixed(1) + ' m</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Obstacle Gap</div><div class="telemetry-val" style="color:#ef4444;">' + simState.obstacleGap + ' m</div></div>';

    var verdict = "";
    if(sTotal <= simState.obstacleGap){
      var margin = simState.obstacleGap - sTotal;
      verdict = "<b>Safe Stop!</b> Total stopping distance is <b>" + sTotal.toFixed(1) + " m</b> (Thinking: " + s1.toFixed(1) + "m + Braking: " + s2.toFixed(1) + "m). The vehicle halts safely with a <b>" + margin.toFixed(1) + " m</b> safety buffer before the obstacle!";
    } else {
      var crashSpd = Math.sqrt(Math.max(0, u*u - 2*a*(simState.obstacleGap - s1)));
      verdict = "<b>CRASH DETECTED!</b> Stopping distance (<b>" + sTotal.toFixed(1) + " m</b>) exceeds the obstacle gap (" + simState.obstacleGap + " m). Impact occurs at <b>" + (crashSpd * 3.6).toFixed(1) + " km/h</b> (" + crashSpd.toFixed(1) + " m/s)! Reduce speed or increase following distance.";
    }
    document.getElementById("lab-verdict").innerHTML = verdict;

    var cuVal = document.getElementById("ctrl-p6-uval");
    var ctrVal = document.getElementById("ctrl-p6-trval");
    var caVal = document.getElementById("ctrl-p6-aval");
    if(cuVal) cuVal.textContent = simState.uKmh + " km/h (" + u.toFixed(1) + " m/s)";
    if(ctrVal) ctrVal.textContent = simState.tReact.toFixed(1) + " s";
    if(caVal) caVal.textContent = simState.brakeA.toFixed(1) + " m/s²";
  }

  window.SIMS.kinematics = { mount: mount, draw: draw };
})();

// =========================================================================
// 7. SIMULATION 7: Circular Motion & Tangential Velocity Release (circular)
// =========================================================================
(function(){
  var simState = {
    mode: "marble",
    rMeters: 0.8,
    vMs: 2.0,
    released: false,
    releaseT: 0,
    releaseX: 0,
    releaseY: 0,
    releaseVx: 0,
    releaseVy: 0
  };

  function mount(lesson){
    simState.mode = "marble";
    simState.released = false;
    App.state.maxT = 6.0;
    document.getElementById("time-scrubber").max = 6.0;

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Tangential Velocity Vector v⃗</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Centripetal Acceleration a_c</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Tangential Release Trajectory</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p7-marble">Activity 4.5: Marble in Circular Ring</button>' +
      '<button class="preset-btn" id="p7-lift">Lift Ring (Tangential Release!)</button>' +
      '<button class="preset-btn" id="p7-clock">Rohan’s Clock (NCERT Ex Q16)</button>';

    document.getElementById("p7-marble").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "marble";
      simState.released = false;
      simState.rMeters = 0.8;
      simState.vMs = 2.0;
      App.state.maxT = 6.0;
      document.getElementById("time-scrubber").max = 6.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Particle moves at constant speed, but its velocity vector v⃗ is continuously turning tangentially! Inward centripetal acceleration a_c is directed toward center O.";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("p7-lift").addEventListener("click", function(){
      simState.released = true;
      simState.releaseT = App.state.t;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch (Activity 4.5):</strong> Ring lifted! Without the inward normal force, the marble flies off in a straight line along the instantaneous tangent!";
      draw(App.state.t);
    });

    document.getElementById("p7-clock").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "clock";
      simState.released = false;
      simState.rMeters = 0.07;
      App.state.maxT = 60.0;
      document.getElementById("time-scrubber").max = 60.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch (NCERT Ex Q16):</strong> Minute hand radius r = 7 cm, Period T = 3600 s (60 min). Tip speed = 0.122 mm/s. In 15 min, distance = 11 cm and displacement = 9.9 cm!";
      App.resetTimeline();
      App.play();
    });

    document.getElementById("lab-controls").innerHTML = 
      '<div class="control-item"><div class="control-label"><span>Circle Radius (r)</span><span class="val" id="ctrl-p7-rval">0.8 m</span></div>' +
      '<input type="range" id="ctrl-p7-r" min="0.4" max="1.4" value="0.8" step="0.1"></div>' +
      '<div class="control-item"><div class="control-label"><span>Speed (v)</span><span class="val" id="ctrl-p7-vval">2.0 m/s</span></div>' +
      '<input type="range" id="ctrl-p7-v" min="0.5" max="4.0" value="2.0" step="0.5"></div>';

    document.getElementById("ctrl-p7-r").addEventListener("input", function(e){
      simState.rMeters = Number(e.target.value);
      draw(App.state.t);
    });
    document.getElementById("ctrl-p7-v").addEventListener("input", function(e){
      simState.vMs = Number(e.target.value);
      draw(App.state.t);
    });

    draw(0);
  }

  function setActivePreset(btn){
    document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
  }

  function draw(t){
    var svg = document.getElementById("diagram");
    if(!svg) return;

    var cx = 360, cy = 150;
    var rPix = 90;
    var omega = simState.vMs / simState.rMeters;
    var theta = (omega * t) % (2 * Math.PI);

    var px = cx + Math.cos(theta) * rPix;
    var py = cy + Math.sin(theta) * rPix;

    var vxPix = -Math.sin(theta) * 45;
    var vyPix = Math.cos(theta) * 45;

    var axPix = -Math.cos(theta) * 35;
    var ayPix = -Math.sin(theta) * 35;

    var ac = (simState.vMs * simState.vMs) / simState.rMeters;

    var markup = '<rect width="720" height="300" fill="#09131d"/>';

    if(simState.mode === "clock"){
      markup += '<circle cx="' + cx + '" cy="' + cy + '" r="100" fill="#15263a" stroke="#475569" stroke-width="4"/>';
      for(var hr = 1; hr <= 12; hr++){
        var hAng = (hr * 30 - 90) * Math.PI / 180;
        markup += '<text x="' + (cx + Math.cos(hAng)*82) + '" y="' + (cy + Math.sin(hAng)*82 + 4) + '" fill="#94a3b8" font-size="11" font-weight="700" text-anchor="middle">' + hr + '</text>';
      }
      var minAng = (t / 60) * 2 * Math.PI - Math.PI / 2;
      var mx = cx + Math.cos(minAng) * 75;
      var my = cy + Math.sin(minAng) * 75;
      markup += '<line x1="' + cx + '" y1="' + cy + '" x2="' + mx + '" y2="' + my + '" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>';
      markup += '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#f59e0b"/>';

      var fracHour = (t % 60) / 60;
      var distCm = fracHour * (2 * Math.PI * 7);
      var dispCm = 2 * 7 * Math.sin(fracHour * Math.PI);

      svg.innerHTML = markup;
      svg.setAttribute("aria-label", "Clock simulation at minute " + t.toFixed(0) + ".");

      document.getElementById("lab-readout").innerHTML = 
        '<div class="telemetry-cell"><div class="telemetry-label">Hand Radius</div><div class="telemetry-val">7.0 cm (0.07 m)</div></div>' +
        '<div class="telemetry-cell"><div class="telemetry-label">Tip Speed (v = 2πr/T)</div><div class="telemetry-val" style="color:#38bdf8;">0.122 mm/s</div></div>' +
        '<div class="telemetry-cell"><div class="telemetry-label">Tip Distance Travelled</div><div class="telemetry-val" style="color:#f59e0b;">' + distCm.toFixed(1) + ' cm</div></div>' +
        '<div class="telemetry-cell"><div class="telemetry-label">Tip Displacement</div><div class="telemetry-val" style="color:#818cf8;">' + dispCm.toFixed(1) + ' cm</div></div>';

      document.getElementById("lab-verdict").innerHTML = 
        "<b>NCERT Ex Q16 Solution:</b> For Rohan's clock with minute hand radius 7 cm: In 15 minutes (quarter-turn), tip distance = ¼(2π×7) = <b>11.0 cm</b>, displacement = √(7² + 7²) = 7√2 = <b>9.9 cm</b>. In 60 minutes (full turn), tip distance = <b>44.0 cm</b>, displacement = <b>0 cm</b>!";
      return;
    }

    markup += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rPix + '" fill="none" stroke="#334155" stroke-width="3" stroke-dasharray="4"/>';
    markup += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#64748b"/>';
    markup += '<text x="' + cx + '" y="' + (cy + 18) + '" fill="#94a3b8" font-size="11" text-anchor="middle">Center O</text>';

    if(simState.released){
      var dtRel = t - simState.releaseT;
      var flyX = px + vxPix * dtRel;
      var flyY = py + vyPix * dtRel;
      markup += '<line x1="' + px + '" y1="' + py + '" x2="' + flyX + '" y2="' + flyY + '" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4"/>';
      markup += '<circle cx="' + flyX + '" cy="' + flyY + '" r="8" fill="#38bdf8" stroke="#fff" stroke-width="2"/>';
      markup += '<text x="' + (flyX + 12) + '" y="' + flyY + '" fill="#f59e0b" font-size="12">Tangent Line</text>';
    } else {
      markup += '<circle cx="' + px + '" cy="' + py + '" r="9" fill="#38bdf8" stroke="#fff" stroke-width="2"/>';

      markup += '<defs><marker id="arr-c-v" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8"/></marker></defs>';
      markup += '<line x1="' + px + '" y1="' + py + '" x2="' + (px + vxPix) + '" y2="' + (py + vyPix) + '" stroke="#38bdf8" stroke-width="3.5" marker-end="url(#arr-c-v)"/>';
      markup += '<text x="' + (px + vxPix*1.1) + '" y="' + (py + vyPix*1.1) + '" fill="#38bdf8" font-size="11" font-weight="700">v⃗</text>';

      markup += '<defs><marker id="arr-c-a" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444"/></marker></defs>';
      markup += '<line x1="' + px + '" y1="' + py + '" x2="' + (px + axPix) + '" y2="' + (py + ayPix) + '" stroke="#ef4444" stroke-width="3" marker-end="url(#arr-c-a)"/>';
      markup += '<text x="' + (px + axPix*0.6) + '" y="' + (py + ayPix*0.6 - 4) + '" fill="#ef4444" font-size="11" font-weight="700">a_c</text>';
    }

    svg.innerHTML = markup;
    svg.setAttribute("aria-label", "Circular motion lab: speed is " + simState.vMs.toFixed(1) + " m/s. Centripetal acceleration is " + ac.toFixed(1) + " m/s².");

    document.getElementById("lab-readout").innerHTML = 
      '<div class="telemetry-cell"><div class="telemetry-label">Radius (r)</div><div class="telemetry-val">' + simState.rMeters.toFixed(2) + ' m</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Constant Speed (v)</div><div class="telemetry-val" style="color:#38bdf8;">' + simState.vMs.toFixed(1) + ' m/s</div></div>' +
      '<div class="telemetry-cell"><div class="telemetry-label">Centripetal Accel (v²/r)</div><div class="telemetry-val" style="color:#ef4444;">' + ac.toFixed(1) + ' m/s²</div></div>';

    var verdict = "";
    if(simState.released){
      verdict = "<b>Activity 4.5 Tangential Release:</b> Without the inward normal force from the ring, the marble flies off along the exact tangent to the circle at the moment of release! Velocity is always directed along the tangent.";
    } else {
      verdict = "<b>Uniform Circular Motion:</b> Although speed is strictly constant, the velocity vector is continually turning. Therefore, circular motion is ALWAYS accelerated motion, with centripetal acceleration directed toward center O!";
    }
    document.getElementById("lab-verdict").innerHTML = verdict;

    var rv = document.getElementById("ctrl-p7-rval");
    var vv = document.getElementById("ctrl-p7-vval");
    if(rv) rv.textContent = simState.rMeters.toFixed(2) + " m";
    if(vv) vv.textContent = simState.vMs.toFixed(1) + " m/s";
  }

  window.SIMS.circular = { mount: mount, draw: draw };
})();
