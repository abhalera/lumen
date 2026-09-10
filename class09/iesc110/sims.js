var App = window.App;
window.SIMS = {};

function setActivePreset(btn){
  document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
  if(btn) btn.classList.add("active");
}

// =========================================================================
// 1. SIMULATION 1: Bell Jar Vacuum Experiment (lab_production)
// =========================================================================
(function(){
  var simState = {
    airLevel: 1.0 // 1.0 = atmospheric pressure, 0.0 = total vacuum
  };

  function mount(lesson){
    simState.airLevel = 1.0;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Air Molecule Density</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Vibrating Bell Hammer</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Audible Sound Intensity</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p1-air">Full Air: Loud Chime (100% Atmosphere)</button>' +
      '<button class="preset-btn" id="p1-partial">Pumping Out Air: Faint Sound (30% Air)</button>' +
      '<button class="preset-btn" id="p1-vacuum">Total Vacuum: Absolute Silence (0% Air - Space)</button>';

    document.getElementById("p1-air").addEventListener("click", function(){
      setActivePreset(this);
      simState.airLevel = 1.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Abundant air molecules transmit bell vibrations to the glass jar. Sound is loud and clear!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-partial").addEventListener("click", function(){
      setActivePreset(this);
      simState.airLevel = 0.3;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> As vacuum pump extracts air, fewer particles collide. The chime becomes very faint!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p1-vacuum").addEventListener("click", function(){
      setActivePreset(this);
      simState.airLevel = 0.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Total vacuum! The hammer strikes vigorously, but ZERO sound escapes. Silence in space!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var hammerAngle = Math.sin(t * 25) * 15; // vibrating hammer
    var soundIntensity = simState.airLevel * 100;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Base plate
    svg += '<rect x="220" y="220" width="280" height="15" fill="#475569" rx="3"/>';
    svg += '<line x1="360" y1="235" x2="360" y2="260" stroke="#64748b" stroke-width="8"/>'; // vacuum pipe
    svg += '<text x="360" y="275" fill="#94a3b8" font-size="11" text-anchor="middle">&darr; To Vacuum Pump</text>';

    // Glass Bell Jar Outline
    svg += '<path d="M 250 220 L 250 110 C 250 50 470 50 470 110 L 470 220 Z" fill="#0284c7" fill-opacity="0.08" stroke="#38bdf8" stroke-width="3"/>';

    // Air molecules inside jar
    var numParticles = Math.floor(simState.airLevel * 60);
    for(var i = 0; i < numParticles; i++){
      var px = 270 + (i * 29) % 180;
      var py = 90 + (i * 37) % 120;
      svg += '<circle cx="' + px + '" cy="' + py + '" r="2.5" fill="#38bdf8" opacity="0.6"/>';
    }

    // Electric Bell
    svg += '<circle cx="360" cy="130" r="28" fill="#d97706" stroke="#fbbf24" stroke-width="2"/>'; // gong
    svg += '<g transform="rotate(' + hammerAngle + ' 360 175)">';
    svg += '<line x1="360" y1="175" x2="385" y2="135" stroke="#f43f5e" stroke-width="3"/>';
    svg += '<circle cx="385" cy="135" r="5" fill="#ef4444"/>';
    svg += '</g>';

    // Sound wave concentric ripples if air present
    if(simState.airLevel > 0.05){
      var rWave = (t * 80) % 120;
      svg += '<circle cx="360" cy="130" r="' + (35 + rWave) + '" fill="none" stroke="#10b981" stroke-width="2" opacity="' + (simState.airLevel * (1 - rWave/120)) + '"/>';
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Medium Pressure</span><span class="v">' + (simState.airLevel * 100).toFixed(0) + '% Atm</span></div>' +
      '<div class="metric"><span class="k">Air Particles</span><span class="v">' + (simState.airLevel > 0 ? 'Present' : 'NONE (Vacuum)') + '</span></div>' +
      '<div class="metric"><span class="k">Sound Heard</span><span class="v" style="color:' + (soundIntensity > 0 ? '#10b981' : '#f43f5e') + '">' + (soundIntensity > 0 ? soundIntensity.toFixed(0) + '% Intensity' : 'ABSOLUTE SILENCE') + '</span></div>';

    document.getElementById("lab-verdict").innerHTML = simState.airLevel === 0
      ? "<strong>Total Vacuum (Outer Space):</strong> Without atoms or molecules to collide, mechanical vibrations cannot propagate. The bell strikes vigorously in complete silence!"
      : "<strong>Mechanical Wave Propagation:</strong> Air molecules transmit acoustic pressure vibrations from the bell gong to the jar walls and to the listener's ear.";
  }

  window.SIMS.lab_production = { mount: mount, draw: draw };
})();

// =========================================================================
// 2. SIMULATION 2: Longitudinal Wave & Slinky (lab_longitudinal)
// =========================================================================
(function(){
  var simState = {
    freq: 2,
    waveSpeed: 160
  };

  function mount(lesson){
    simState.freq = 2;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Compression (High Density / Pressure)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#64748b;"></span><span>Rarefaction (Low Density / Expansion)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Particle Oscillation (&parallel; Wave Travel)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p2-standard">Standard Sound Pulse (f = 2 Hz)</button>' +
      '<button class="preset-btn" id="p2-fast">High Frequency (f = 4 Hz &rarr; Packed Compressions)</button>' +
      '<button class="preset-btn" id="p2-slinky">Slinky Hand Push-Pull (Activity 10.3)</button>';

    document.getElementById("p2-standard").addEventListener("click", function(){
      setActivePreset(this);
      simState.freq = 2;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Notice particles oscillate horizontally left-and-right, while the dense compression bands travel forward!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-fast").addEventListener("click", function(){
      setActivePreset(this);
      simState.freq = 4;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Doubling frequency crowds compressions closer together, cutting wavelength in half!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p2-slinky").addEventListener("click", function(){
      setActivePreset(this);
      simState.freq = 1;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Slow slinky oscillation: clearly trace single compression packets cruising from left to right.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var k = (2 * Math.PI * simState.freq) / simState.waveSpeed;
    var omega = 2 * Math.PI * simState.freq;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Prongs of Tuning Fork (Source at left)
    var prongDispl = Math.sin(omega * t) * 12;
    svg += '<line x1="60" y1="90" x2="60" y2="190" stroke="#94a3b8" stroke-width="6"/>';
    svg += '<line x1="60" y1="110" x2="' + (100 + prongDispl) + '" y2="110" stroke="#cbd5e1" stroke-width="6"/>';
    svg += '<line x1="60" y1="170" x2="' + (100 + prongDispl) + '" y2="170" stroke="#cbd5e1" stroke-width="6"/>';

    // Air Particles in Horizontal Channels
    for(var row = 90; row <= 190; row += 25){
      for(var x0 = 120; x0 <= 660; x0 += 16){
        var displ = Math.sin(k * (x0 - 120) - omega * t) * 10;
        var currentX = x0 + displ;
        var isCompressed = Math.cos(k * (x0 - 120) - omega * t) < -0.3;
        var col = isCompressed ? '#38bdf8' : '#64748b';
        var r = isCompressed ? 3.5 : 2.0;
        svg += '<circle cx="' + currentX + '" cy="' + row + '" r="' + r + '" fill="' + col + '"/>';
      }
    }

    // Density wave representation below
    svg += '<line x1="120" y1="240" x2="660" y2="240" stroke="#334155" stroke-width="1.5"/>';
    var pathD = 'M 120 ' + (240 - Math.cos(-omega * t) * 20);
    for(var px = 125; px <= 660; px += 5){
      var yD = 240 - Math.cos(k * (px - 120) - omega * t) * 20;
      pathD += ' L ' + px + ' ' + yD;
    }
    svg += '<path d="' + pathD + '" fill="none" stroke="#10b981" stroke-width="2"/>';
    svg += '<text x="120" y="265" fill="#10b981" font-size="11">Density Variation Graph &rarr;</text>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    var wavelength = simState.waveSpeed / simState.freq;
    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Frequency (f)</span><span class="v">' + simState.freq + ' Hz</span></div>' +
      '<div class="metric"><span class="k">Wave Speed (v)</span><span class="v">' + simState.waveSpeed + ' px/s</span></div>' +
      '<div class="metric"><span class="k">Wavelength (λ)</span><span class="v" style="color:#38bdf8">' + wavelength.toFixed(0) + ' px</span></div>' +
      '<div class="metric"><span class="k">Wave Type</span><span class="v">Longitudinal</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Longitudinal Wave Physics:</strong> Air particles oscillate left and right parallel to the wave travel. Compressions (blue dots close together) alternate with rarefactions (spread apart).";
  }

  window.SIMS.lab_longitudinal = { mount: mount, draw: draw };
})();

// =========================================================================
// 3. SIMULATION 3: Wave Anatomy & Formula Lab (lab_wave_chars)
// =========================================================================
(function(){
  var simState = {
    freq: 100,
    speed: 344
  };

  function mount(lesson){
    simState.freq = 100; simState.speed = 344;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Wavelength (λ = v / f)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Amplitude (Peak Height)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Wave Speed v = f λ = 344 m/s</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p3-ncert9">NCERT Ex 9: f = 100 Hz &rarr; λ = 3.44 m (T = 0.01 s)</button>' +
      '<button class="preset-btn" id="p3-double-f">Double Frequency: f = 200 Hz &rarr; λ = 1.72 m</button>' +
      '<button class="preset-btn" id="p3-whistle">High Pitch: f = 500 Hz &rarr; λ = 0.69 m</button>';

    document.getElementById("p3-ncert9").addEventListener("click", function(){
      setActivePreset(this);
      simState.freq = 100;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> NCERT Exercise 9: With v = 344 m/s and f = 100 Hz, wavelength is exactly 3.44 m. Time period is 0.01 s!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-double-f").addEventListener("click", function(){
      setActivePreset(this);
      simState.freq = 200;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Doubling frequency compresses the wave cycles horizontally: wavelength halves to 1.72 m.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p3-whistle").addEventListener("click", function(){
      setActivePreset(this);
      simState.freq = 500;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> High pitch: tightly grouped cycles, shorter wavelength λ = 0.69 m.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var lambda = simState.speed / simState.freq; // metres
    var period = 1 / simState.freq;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Baseline axis
    svg += '<line x1="60" y1="140" x2="660" y2="140" stroke="#475569" stroke-width="2"/>';
    svg += '<line x1="60" y1="40" x2="60" y2="240" stroke="#475569" stroke-width="2"/>';

    // Sinusoidal Wave
    var cyclePix = (lambda / 3.44) * 240; // scale to canvas
    var k = (2 * Math.PI) / cyclePix;
    var omega = 2 * Math.PI * 1.5; // visual animation speed

    var path = 'M 60 ' + (140 - Math.sin(-omega * t) * 60);
    for(var x = 65; x <= 660; x += 5){
      var y = 140 - Math.sin(k * (x - 60) - omega * t) * 60;
      path += ' L ' + x + ' ' + y;
    }
    svg += '<path d="' + path + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';

    // Wavelength measurement dimension line
    var xCrest1 = 60 + cyclePix * 0.25;
    var xCrest2 = xCrest1 + cyclePix;
    if(xCrest2 < 650){
      svg += '<line x1="' + xCrest1 + '" y1="60" x2="' + xCrest2 + '" y2="60" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<polygon points="' + xCrest1 + ',60 ' + (xCrest1 + 8) + ',56 ' + (xCrest1 + 8) + ',64" fill="#fbbf24"/>';
      svg += '<polygon points="' + xCrest2 + ',60 ' + (xCrest2 - 8) + ',56 ' + (xCrest2 - 8) + ',64" fill="#fbbf24"/>';
      svg += '<text x="' + (xCrest1 + xCrest2)/2 + '" y="50" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">&lambda; = ' + lambda.toFixed(2) + ' m</text>';
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Wave Speed (v)</span><span class="v">' + simState.speed + ' m/s</span></div>' +
      '<div class="metric"><span class="k">Frequency (f)</span><span class="v">' + simState.freq + ' Hz</span></div>' +
      '<div class="metric"><span class="k">Wavelength (λ)</span><span class="v" style="color:#38bdf8">' + lambda.toFixed(2) + ' m</span></div>' +
      '<div class="metric"><span class="k">Time Period (T)</span><span class="v" style="color:#fbbf24">' + (period * 1000).toFixed(1) + ' ms</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Wave Equation (v = f · λ):</strong> Speed is constant at 344 m/s. Frequency is " + simState.freq + " Hz, giving wavelength λ = " + lambda.toFixed(2) + " m and period T = " + (period * 1000).toFixed(1) + " ms.";
  }

  window.SIMS.lab_wave_chars = { mount: mount, draw: draw };
})();

// =========================================================================
// 4. SIMULATION 4: Pitch & Loudness Oscilloscope (lab_pitch_loudness)
// =========================================================================
(function(){
  var simState = {
    amp: 60,   // amplitude -> loudness
    freq: 2    // frequency -> pitch
  };

  function mount(lesson){
    simState.amp = 60; simState.freq = 2;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Loudness (Vertical Amplitude)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Pitch (Horizontal Frequency)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Oscilloscope Trace</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p4-std">Moderate Note: Normal Volume & Pitch</button>' +
      '<button class="preset-btn" id="p4-loud">Loud Bass: High Amplitude, Low Pitch (Lion Roar)</button>' +
      '<button class="preset-btn" id="p4-shrill">Soft Whistle: Low Amplitude, High Pitch (Mosquito)</button>';

    document.getElementById("p4-std").addEventListener("click", function(){
      setActivePreset(this);
      simState.amp = 50; simState.freq = 2;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Medium loudness and medium pitch.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-loud").addEventListener("click", function(){
      setActivePreset(this);
      simState.amp = 90; simState.freq = 1;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Huge vertical wave height (great loudness/energy), but slow wide waves (deep low pitch).";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p4-shrill").addEventListener("click", function(){
      setActivePreset(this);
      simState.amp = 20; simState.freq = 5;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Tiny vertical height (soft sound), but very dense rapidly repeating waves (sharp shrill pitch)!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Oscilloscope Grid
    for(var gx = 60; gx <= 660; gx += 40){
      svg += '<line x1="' + gx + '" y1="40" x2="' + gx + '" y2="240" stroke="#1e293b" stroke-width="1"/>';
    }
    for(var gy = 40; gy <= 240; gy += 40){
      svg += '<line x1="60" y1="' + gy + '" x2="660" y2="' + gy + '" stroke="#1e293b" stroke-width="1"/>';
    }
    svg += '<line x1="60" y1="140" x2="660" y2="140" stroke="#334155" stroke-width="2"/>';

    // Oscilloscope Wave Trace
    var omega = 2 * Math.PI * simState.freq;
    var path = 'M 60 ' + (140 - Math.sin(-t * 8) * simState.amp);
    for(var x = 65; x <= 660; x += 4){
      var y = 140 - Math.sin(((x - 60) / 600) * omega * 4 - t * 8) * simState.amp;
      path += ' L ' + x + ' ' + y;
    }
    svg += '<path d="' + path + '" fill="none" stroke="#10b981" stroke-width="3"/>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    var loudnessDesc = simState.amp > 70 ? 'LOUD' : (simState.amp < 30 ? 'SOFT' : 'MODERATE');
    var pitchDesc = simState.freq > 3 ? 'HIGH (Shrill)' : (simState.freq < 2 ? 'LOW (Deep Bass)' : 'MEDIUM');

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Amplitude</span><span class="v">' + simState.amp + ' px (' + loudnessDesc + ')</span></div>' +
      '<div class="metric"><span class="k">Frequency</span><span class="v">' + simState.freq + ' kHz (' + pitchDesc + ')</span></div>' +
      '<div class="metric"><span class="k">Perceived Loudness</span><span class="v" style="color:#38bdf8">' + (simState.amp * simState.amp / 10).toFixed(0) + ' units</span></div>' +
      '<div class="metric"><span class="k">Tone Quality</span><span class="v" style="color:#fbbf24">' + loudnessDesc + ', ' + pitchDesc + '</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Pitch vs Loudness Independence:</strong> Amplitude controls loudness (Energy ∝ A²). Frequency controls pitch (shrillness). You can have a loud low sound (lion) or a soft high sound (mosquito)!";
  }

  window.SIMS.lab_pitch_loudness = { mount: mount, draw: draw };
})();

// =========================================================================
// 5. SIMULATION 5: Speed of Sound across Media (lab_speed_media)
// =========================================================================
(function(){
  var simState = {
    temp: 22,
    dist: 1720
  };

  function mount(lesson){
    simState.temp = 22; simState.dist = 1720;
    App.state.maxT = 6.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 6.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Air at 22°C (344 m/s)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Air at 0°C (331 m/s)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Water (~1500 m/s) & Steel (~5950 m/s)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p5-temp">NCERT Ex 12: Thunder over 1720 m (22°C vs 0°C)</button>' +
      '<button class="preset-btn" id="p5-race">Triple Race: Steel vs Water vs Air</button>' +
      '<button class="preset-btn" id="p5-rail">Indian Railways Trackmen Acoustic Test</button>';

    document.getElementById("p5-temp").addEventListener("click", function(){
      setActivePreset(this);
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Sound at 22°C reaches 1720 m in 5.0 s. Sound at 0°C takes 5.2 s (0.2 s slower!).";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-race").addEventListener("click", function(){
      setActivePreset(this);
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Sound in steel arrives almost instantaneously; water arrives 4.5× faster than air!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p5-rail").addEventListener("click", function(){
      setActivePreset(this);
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Vibrations along steel railway tracks outpace air sound by over 17 times!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var v22 = 344, v0 = 331, vWater = 1500, vSteel = 5950;
    var d22 = Math.min(1720, v22 * t);
    var d0 = Math.min(1720, v0 * t);
    var dWater = Math.min(1720, vWater * t);

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Track 1: Air at 22°C
    svg += '<text x="60" y="70" fill="#38bdf8" font-size="12" font-weight="bold">Air at 22°C (344 m/s)</text>';
    svg += '<line x1="60" y1="85" x2="660" y2="85" stroke="#334155" stroke-width="6"/>';
    var x22 = 60 + (d22 / 1720) * 600;
    svg += '<circle cx="' + x22 + '" cy="85" r="10" fill="#38bdf8"/>';

    // Track 2: Air at 0°C
    svg += '<text x="60" y="135" fill="#f43f5e" font-size="12" font-weight="bold">Air at 0°C (331 m/s - 0.2s delay)</text>';
    svg += '<line x1="60" y1="150" x2="660" y2="150" stroke="#334155" stroke-width="6"/>';
    var x0 = 60 + (d0 / 1720) * 600;
    svg += '<circle cx="' + x0 + '" cy="150" r="10" fill="#f43f5e"/>';

    // Track 3: Water (1500 m/s)
    svg += '<text x="60" y="200" fill="#10b981" font-size="12" font-weight="bold">Water (~1500 m/s - 4.5× Faster)</text>';
    svg += '<line x1="60" y1="215" x2="660" y2="215" stroke="#334155" stroke-width="6"/>';
    var xW = 60 + (dWater / 1720) * 600;
    svg += '<circle cx="' + xW + '" cy="215" r="10" fill="#10b981"/>';

    // Finish line (1720 m)
    svg += '<line x1="660" y1="50" x2="660" y2="230" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4"/>';
    svg += '<text x="660" y="45" fill="#fbbf24" font-size="11" text-anchor="middle">1720 m</text>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Time Elapsed</span><span class="v">' + t.toFixed(2) + ' s</span></div>' +
      '<div class="metric"><span class="k">Distance (22°C)</span><span class="v" style="color:#38bdf8">' + d22.toFixed(0) + ' m</span></div>' +
      '<div class="metric"><span class="k">Distance (0°C)</span><span class="v" style="color:#f43f5e">' + d0.toFixed(0) + ' m</span></div>' +
      '<div class="metric"><span class="k">Water Distance</span><span class="v" style="color:#10b981">' + dWater.toFixed(0) + ' m</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>Temperature & Medium Dependence:</strong> At 22°C, sound reaches 1720 m in 5.0 s (1720/344). In 0°C cold air, it takes 5.2 s (1720/331), arriving 0.20 seconds later!";
  }

  window.SIMS.lab_speed_media = { mount: mount, draw: draw };
})();

// =========================================================================
// 6. SIMULATION 6: Echo & Reverberation (lab_echo)
// =========================================================================
(function(){
  var simState = {
    dist: 17.2, // metres
    v: 344
  };

  function mount(lesson){
    simState.dist = 17.2; simState.v = 344;
    App.state.maxT = 3.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 3.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Forward Sound Wave Pulse</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Reflected Echo Pulse</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>0.1 s Persistence of Hearing Threshold</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p6-min">Critical Threshold: d = 17.2 m (Echo Delay = 0.10 s)</button>' +
      '<button class="preset-btn" id="p6-echo">Distant Cliff: d = 34.4 m (Clear Echo Delay = 0.20 s)</button>' +
      '<button class="preset-btn" id="p6-reverb">NCERT Ex 4: Small Room d = 8.6 m (Delay = 0.05 s &rarr; Reverberation!)</button>';

    document.getElementById("p6-min").addEventListener("click", function(){
      setActivePreset(this);
      simState.dist = 17.2;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> At exactly 17.2 m, round-trip time is 0.10 s—the exact boundary between echo and reverberation.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-echo").addEventListener("click", function(){
      setActivePreset(this);
      simState.dist = 34.4;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Distant cliff (34.4 m): Round trip takes 0.20 s. A crystal-clear separated echo is heard!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p6-reverb").addEventListener("click", function(){
      setActivePreset(this);
      simState.dist = 8.6;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> NCERT Ex 4: Delay is 0.05 s (< 0.1 s). Brain cannot separate sounds &rarr; produces REVERBERATION!";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var tRound = (2 * simState.dist) / simState.v;
    var isEcho = tRound >= 0.1;

    var wallX = 200 + (simState.dist / 34.4) * 380;
    if(wallX > 620) wallX = 620;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    // Person at left
    svg += '<circle cx="120" cy="150" r="12" fill="#fcd34d"/>';
    svg += '<line x1="120" y1="162" x2="120" y2="210" stroke="#fcd34d" stroke-width="4"/>';
    svg += '<line x1="60" y1="210" x2="660" y2="210" stroke="#334155" stroke-width="4"/>';

    // Reflecting Wall
    svg += '<rect x="' + wallX + '" y="80" width="30" height="130" fill="#475569" stroke="#94a3b8" stroke-width="2" rx="3"/>';
    svg += '<text x="' + (wallX + 15) + '" y="70" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">Wall</text>';

    // Sound pulses animation
    var distTraveled = simState.v * t;
    if(distTraveled <= simState.dist){
      // Forward wave
      var waveX = 120 + (distTraveled / simState.dist) * (wallX - 120);
      svg += '<path d="M ' + waveX + ' 130 C ' + (waveX + 20) + ' 150 ' + (waveX + 20) + ' 170 ' + waveX + ' 190" fill="none" stroke="#38bdf8" stroke-width="4"/>';
    } else if(distTraveled <= 2 * simState.dist){
      // Return wave
      var retFrac = (distTraveled - simState.dist) / simState.dist;
      var retX = wallX - retFrac * (wallX - 120);
      svg += '<path d="M ' + retX + ' 130 C ' + (retX - 20) + ' 150 ' + (retX - 20) + ' 170 ' + retX + ' 190" fill="none" stroke="#10b981" stroke-width="4"/>';
    }

    svg += '<text x="' + (120 + wallX)/2 + '" y="235" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Distance d = ' + simState.dist.toFixed(1) + ' m</text>';

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Wall Distance</span><span class="v">' + simState.dist.toFixed(1) + ' m</span></div>' +
      '<div class="metric"><span class="k">Round-Trip Time</span><span class="v" style="color:#fbbf24">' + tRound.toFixed(3) + ' s</span></div>' +
      '<div class="metric"><span class="k">Persistence Limit</span><span class="v">0.100 s</span></div>' +
      '<div class="metric"><span class="k">Perception</span><span class="v" style="color:' + (isEcho ? '#10b981' : '#f43f5e') + '">' + (isEcho ? 'DISTINCT ECHO' : 'REVERBERATION') + '</span></div>';

    document.getElementById("lab-verdict").innerHTML = isEcho
      ? "<strong>Distinct Echo Heard:</strong> Round trip time (" + tRound.toFixed(2) + " s) &ge; 0.10 s. The brain hears the reflection as a separate, distinct sound!"
      : "<strong>Reverberation (NCERT Ex 4):</strong> Round trip time (" + tRound.toFixed(3) + " s) &lt; 0.10 s. The reflection overlaps with the original sensation, causing reverberation.";
  }

  window.SIMS.lab_echo = { mount: mount, draw: draw };
})();

// =========================================================================
// 7. SIMULATION 7: SONAR & Ultrasound (lab_sonar)
// =========================================================================
(function(){
  var simState = {
    mode: "sonar", // "sonar" or "parking"
    v: 1525,
    tEcho: 5.0
  };

  function mount(lesson){
    simState.mode = "sonar"; simState.v = 1525; simState.tEcho = 5.0;
    App.state.maxT = 5.0;
    var scrubber = document.getElementById("time-scrubber");
    if(scrubber){ scrubber.max = 5.0; scrubber.value = 0; }

    document.getElementById("lab-legend").innerHTML = 
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Transmitted Ultrasonic Wave</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Reflected Echo Wave</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Calculated Distance (d = vt / 2)</span></div>';

    document.getElementById("preset-bar").innerHTML = 
      '<button class="preset-btn active" id="p7-wreck">NCERT Ex 10: Sunken Shipwreck (t = 5.0 s &rarr; Depth 3812.5 m)</button>' +
      '<button class="preset-btn" id="p7-parking">NCERT Ex 11: Car Parking Sensor (d = 1.2 m &rarr; 6.96 ms)</button>' +
      '<button class="preset-btn" id="p7-bat">Bat Echolocation in Night Cave</button>';

    document.getElementById("p7-wreck").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "sonar"; simState.v = 1525; simState.tEcho = 5.0;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> NCERT Exercise 10: Ultrasonic chirp travels down to sunken wreck and returns in 5 s &rarr; Depth = 3812.5 m.";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-parking").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "parking"; simState.v = 345; simState.tEcho = 0.00696;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> NCERT Exercise 11: 40 kHz ultrasonic pulses detect parking obstacle at 1.2 m in just 6.96 ms!";
      App.resetTimeline(); App.play();
    });

    document.getElementById("p7-bat").addEventListener("click", function(){
      setActivePreset(this);
      simState.mode = "sonar"; simState.v = 345; simState.tEcho = 0.02;
      document.getElementById("what-to-watch").innerHTML = "<strong>What to watch:</strong> Bat echolocation: High-frequency ultrasonic clicks locate flying insects in milliseconds.";
      App.resetTimeline(); App.play();
    });

    draw(0);
  }

  function draw(t){
    var dCalc = (simState.v * simState.tEcho) / 2;

    var svg = '<svg viewBox="0 0 720 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="720" height="280" fill="#0f172a" rx="12"/>';

    if(simState.mode === "parking"){
      // Car Reversing Scenario
      svg += '<line x1="60" y1="220" x2="660" y2="220" stroke="#334155" stroke-width="4"/>';
      svg += '<rect x="140" y="160" width="140" height="60" fill="#0284c7" rx="8"/>'; // car body
      svg += '<circle cx="170" cy="220" r="10" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>';
      svg += '<circle cx="250" cy="220" r="10" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>';
      svg += '<rect x="520" y="150" width="30" height="70" fill="#ef4444" rx="3"/>'; // obstacle
      svg += '<text x="535" y="140" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">Obstacle</text>';

      // Ultrasonic waves
      var fracP = (t * 2) % 1.0;
      var wX = 280 + fracP * 240;
      svg += '<path d="M ' + wX + ' 170 C ' + (wX + 15) + ' 190 ' + (wX + 15) + ' 200 ' + wX + ' 210" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      svg += '<text x="400" y="245" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">d = 1.2 m</text>';
    } else {
      // Ocean SONAR Scenario
      svg += '<rect x="40" y="70" width="640" height="170" fill="#1e3a8a" opacity="0.4"/>'; // ocean
      // Surface ship
      svg += '<path d="M 300 70 L 420 70 L 390 40 L 330 40 Z" fill="#475569" stroke="#94a3b8" stroke-width="2"/>';
      svg += '<text x="360" y="60" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">RESEARCH SHIP</text>';

      // Sunken Wreck at bottom
      svg += '<rect x="310" y="215" width="100" height="25" fill="#78350f" stroke="#d97706" stroke-width="2" rx="3"/>';
      svg += '<text x="360" y="232" fill="#fef3c7" font-size="11" font-weight="bold" text-anchor="middle">Sunken Wreck</text>';

      // SONAR downward wave pulse
      var fracS = (t / 2.5) % 2.0;
      if(fracS <= 1.0){
        var downY = 70 + fracS * 145;
        svg += '<ellipse cx="360" cy="' + downY + '" rx="25" ry="8" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      } else {
        var upY = 215 - (fracS - 1.0) * 145;
        svg += '<ellipse cx="360" cy="' + upY + '" rx="25" ry="8" fill="none" stroke="#10b981" stroke-width="3"/>';
      }
    }

    svg += '</svg>';
    document.getElementById("diagram").innerHTML = svg;

    document.getElementById("lab-readout").innerHTML = 
      '<div class="metric"><span class="k">Wave Speed (v)</span><span class="v">' + simState.v + ' m/s</span></div>' +
      '<div class="metric"><span class="k">Round-Trip Time</span><span class="v">' + (simState.tEcho >= 1 ? simState.tEcho.toFixed(1) + ' s' : (simState.tEcho * 1000).toFixed(2) + ' ms') + '</span></div>' +
      '<div class="metric"><span class="k">Calculated Depth</span><span class="v" style="color:#fbbf24">' + dCalc.toFixed(1) + ' m</span></div>';

    document.getElementById("lab-verdict").innerHTML = 
      "<strong>SONAR Equation (2d = v · t):</strong> Round trip time is " + (simState.tEcho >= 1 ? simState.tEcho + " s" : (simState.tEcho * 1000).toFixed(2) + " ms") + ". One-way target distance is d = (v · t) / 2 = " + dCalc.toFixed(1) + " metres.";
  }

  window.SIMS.lab_sonar = { mount: mount, draw: draw };
})();