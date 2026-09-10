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
// 1. SIMULATION 1: Thomson e/m Cross-Field Spectrometer (cathoderay)
// -------------------------------------------------------------------------
window.SIMS.cathoderay = (function(){
  var eField = 2.0; // kV/m
  var bField = 1.0; // mT
  var gas = "vacuum";

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cathode Ray Beam (e⁻)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Electric Deflection (+/−)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Magnetic Field (B)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-balanced">Crossed Fields (Undeflected: v = E/B)</button>' +
      '<button class="preset-btn" id="p-electric">Electric Only (Upward Deflection)</button>' +
      '<button class="preset-btn" id="p-magnetic">Magnetic Only (Downward Deflection)</button>';

    document.getElementById("p-balanced").onclick = function(){
      setActivePreset(this); eField = 2.0; bField = 1.0; updateInputs(); App.resetTimeline(); App.play();
    };
    document.getElementById("p-electric").onclick = function(){
      setActivePreset(this); eField = 3.0; bField = 0.0; updateInputs(); App.resetTimeline(); App.play();
    };
    document.getElementById("p-magnetic").onclick = function(){
      setActivePreset(this); eField = 0.0; bField = 2.0; updateInputs(); App.resetTimeline(); App.play();
    };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Electric Field (E): <b id="e-val" style="color:#f43f5e;">2.0 kV/m</b></label>' +
        '<input type="range" id="e-slider" min="0" max="5" value="2.0" step="0.1">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Magnetic Field (B): <b id="b-val" style="color:#10b981;">1.0 mT</b></label>' +
        '<input type="range" id="b-slider" min="0" max="3" value="1.0" step="0.1">' +
      '</div>';

    document.getElementById("e-slider").oninput = function(e){
      eField = parseFloat(e.target.value);
      document.getElementById("e-val").textContent = eField.toFixed(1) + " kV/m";
      draw(App.state.t);
    };
    document.getElementById("b-slider").oninput = function(e){
      bField = parseFloat(e.target.value);
      document.getElementById("b-val").textContent = bField.toFixed(1) + " mT";
      draw(App.state.t);
    };

    draw(0);
  }

  function updateInputs(){
    var es = document.getElementById("e-slider"); if(es) es.value = eField;
    var bs = document.getElementById("b-slider"); if(bs) bs.value = bField;
    var ev = document.getElementById("e-val"); if(ev) ev.textContent = eField.toFixed(1) + " kV/m";
    var bv = document.getElementById("b-val"); if(bv) bv.textContent = bField.toFixed(1) + " mT";
    draw(App.state.t);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;

    // Beam dynamics: net vertical deflection force F_net = e*(E - v*B)
    var v0 = 2.0; // beam speed in 10^6 m/s
    var netDefl = (eField - (v0 * bField)) * 18; // screen deflection in pixels
    var ySpot = (H / 2) - netDefl;
    ySpot = Math.max(70, Math.min(H - 70, ySpot));

    var pulse = (t * 300) % 200;

    var h = '<rect width="100%" height="100%" fill="#0a131f"/>';
    // Glass tube outline
    h += '<path d="M 60 ' + (H/2 - 50) + ' L 260 ' + (H/2 - 50) + ' L 540 ' + (H/2 - 120) + ' L 720 ' + (H/2 - 140) +
         ' L 720 ' + (H/2 + 140) + ' L 540 ' + (H/2 + 120) + ' L 260 ' + (H/2 + 50) + ' L 60 ' + (H/2 + 50) + ' Z" ' +
         'fill="#0f2137" stroke="#254ad7" stroke-width="2.5" opacity="0.8"/>';

    // Cathode (−) and Anode (+)
    h += '<rect x="80" y="' + (H/2 - 40) + '" width="12" height="80" fill="#94a3b8" rx="2"/>';
    h += '<text x="86" y="' + (H/2 + 55) + '" fill="#94a3b8" font-size="11" text-anchor="middle">Cathode (−)</text>';

    h += '<rect x="180" y="' + (H/2 - 40) + '" width="12" height="32" fill="#e2e8f0" rx="2"/>';
    h += '<rect x="180" y="' + (H/2 + 8) + '" width="12" height="32" fill="#e2e8f0" rx="2"/>';
    h += '<text x="186" y="' + (H/2 + 55) + '" fill="#e2e8f0" font-size="11" text-anchor="middle">Anode (+)</text>';

    // Electric deflection plates
    h += '<rect x="300" y="' + (H/2 - 65) + '" width="140" height="12" fill="' + (eField > 0 ? '#f43f5e' : '#475569') + '" rx="3"/>';
    h += '<text x="370" y="' + (H/2 - 72) + '" fill="#f43f5e" font-size="12" text-anchor="middle">Positive Plate (+)</text>';

    h += '<rect x="300" y="' + (H/2 + 53) + '" width="140" height="12" fill="' + (eField > 0 ? '#38bdf8' : '#475569') + '" rx="3"/>';
    h += '<text x="370" y="' + (H/2 + 80) + '" fill="#38bdf8" font-size="12" text-anchor="middle">Negative Plate (−)</text>';

    // Magnetic field coils indicator
    if(bField > 0){
      h += '<circle cx="370" cy="' + (H/2) + '" r="45" fill="none" stroke="#10b981" stroke-dasharray="4,4" stroke-width="2"/>';
      h += '<text x="370" y="' + (H/2 + 4) + '" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">B ⊗ (Into Screen)</text>';
    }

    // Electron beam trajectory
    var midY = (H/2);
    h += '<path d="M 92 ' + midY + ' L 300 ' + midY + ' Q 440 ' + midY + ' 718 ' + ySpot + '" fill="none" stroke="#38bdf8" stroke-width="3.5" filter="drop-shadow(0 0 6px #38bdf8)"/>';

    // Fluorescent screen at end
    h += '<line x1="720" y1="' + (H/2 - 135) + '" x2="720" y2="' + (H/2 + 135) + '" stroke="#a3e635" stroke-width="6"/>';
    h += '<circle cx="720" cy="' + ySpot + '" r="8" fill="#bef264" filter="drop-shadow(0 0 10px #a3e635)"/>';

    // Scale markings on screen
    for(var i = -100; i <= 100; i += 25){
      var ym = (H/2) + i;
      h += '<line x1="723" y1="' + ym + '" x2="732" y2="' + ym + '" stroke="#64748b" stroke-width="1.5"/>';
    }

    svg.innerHTML = h;

    var status = "";
    if(Math.abs(netDefl) < 2){
      status = '<span style="color:#10b981;font-weight:bold;">BALANCED (v = E/B = 2.0 × 10⁶ m/s)</span>';
    } else if(netDefl > 0){
      status = '<span style="color:#f43f5e;font-weight:bold;">DEFLECTED UPWARDS (Electric force dominates)</span>';
    } else {
      status = '<span style="color:#10b981;font-weight:bold;">DEFLECTED DOWNWARDS (Magnetic Lorentz force dominates)</span>';
    }

    readout(
      cell("Electric Field E", eField.toFixed(1) + " kV/m", "#f43f5e") +
      cell("Magnetic Field B", bField.toFixed(1) + " mT", "#10b981") +
      cell("Beam Spot y", (netDefl > 0 ? "+" : "") + (netDefl / 3).toFixed(1) + " mm", "#38bdf8") +
      cell("Specific Charge e/m_e", "1.759 × 10¹¹ C/kg", "#e2e8f0")
    );

    verdict('<b>Thomson Crossed-Field Condition:</b> ' + status + '<br><small>When electric force eE exactly balances magnetic force evB, electrons pass with zero deflection at velocity v = E/B. Measuring deflection with B=0 yields the specific charge e/m.</small>');
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Rutherford Gold Foil Alpha Scattering Lab (alphascatter)
// -------------------------------------------------------------------------
window.SIMS.alphascatter = (function(){
  var impactB = 15; // impact parameter in fm
  var alphaEnergy = 5.5; // MeV
  var targetZ = 79; // Gold (Z = 79)

  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Alpha Particle (⁴₂He²⁺)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#e11d48;"></span><span>Gold Nucleus (Z = 79)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Hyperbolic Trajectory</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-close">Close Encounter (b = 15 fm, Large Angle)</button>' +
      '<button class="preset-btn" id="p-headon">Head-On (b = 0 fm, 180° Backscatter)</button>' +
      '<button class="preset-btn" id="p-distant">Distant (b = 60 fm, Undeflected)</button>';

    document.getElementById("p-close").onclick = function(){ setActivePreset(this); impactB = 15; updateB(); App.resetTimeline(); App.play(); };
    document.getElementById("p-headon").onclick = function(){ setActivePreset(this); impactB = 0; updateB(); App.resetTimeline(); App.play(); };
    document.getElementById("p-distant").onclick = function(){ setActivePreset(this); impactB = 60; updateB(); App.resetTimeline(); App.play(); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Impact Parameter (b): <b id="b-param" style="color:#38bdf8;">15 fm</b></label>' +
        '<input type="range" id="b-slider" min="0" max="80" value="15" step="1">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Target Nucleus: <b id="z-val" style="color:#e11d48;">Gold (Z = 79)</b></label>' +
        '<select id="z-select" style="padding:6px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;">' +
          '<option value="79" selected>Gold (Z = 79)</option>' +
          '<option value="47">Silver (Z = 47)</option>' +
          '<option value="13">Aluminium (Z = 13)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("b-slider").oninput = function(e){
      impactB = parseFloat(e.target.value);
      document.getElementById("b-param").textContent = impactB + " fm";
      draw(App.state.t);
    };
    document.getElementById("z-select").onchange = function(e){
      targetZ = parseInt(e.target.value);
      var names = { 79: "Gold (Z = 79)", 47: "Silver (Z = 47)", 13: "Aluminium (Z = 13)" };
      document.getElementById("z-val").textContent = names[targetZ];
      draw(App.state.t);
    };

    draw(0);
  }

  function updateB(){
    var bs = document.getElementById("b-slider"); if(bs) bs.value = impactB;
    var bp = document.getElementById("b-param"); if(bp) bp.textContent = impactB + " fm";
    draw(App.state.t);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var cx = W / 2, cy = H / 2;

    // Rutherford scattering angle cot(theta/2) = 2*b / d0
    // d0 = distance of closest approach = 2*Z*e^2 / (4*pi*eps0 * E)
    // for gold (Z=79, E=5.5 MeV), d0 ≈ 41.4 fm
    var d0 = (targetZ / 79) * 41.4;
    var thetaRad = (impactB === 0) ? Math.PI : (2 * Math.atan2(d0, 2 * impactB));
    var thetaDeg = thetaRad * (180 / Math.PI);

    var h = '<rect width="100%" height="100%" fill="#070d17"/>';
    // Coordinate grid
    h += '<line x1="40" y1="' + cy + '" x2="' + (W-40) + '" y2="' + cy + '" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="4,4"/>';
    h += '<line x1="' + cx + '" y1="40" x2="' + cx + '" y2="' + (H-40) + '" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="4,4"/>';

    // Target Nucleus (Gold)
    h += '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="#e11d48" filter="drop-shadow(0 0 12px #f43f5e)"/>';
    h += '<text x="' + cx + '" y="' + (cy + 5) + '" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">+' + targetZ + '</text>';
    h += '<text x="' + cx + '" y="' + (cy + 30) + '" fill="#f43f5e" font-size="12" font-weight="bold" text-anchor="middle">Nucleus</text>';

    // Impact parameter line
    var bPix = impactB * 2.5;
    var yIn = cy - bPix;
    h += '<line x1="60" y1="' + yIn + '" x2="' + cx + '" y2="' + yIn + '" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,2"/>';
    if(impactB > 0){
      h += '<line x1="80" y1="' + cy + '" x2="80" y2="' + yIn + '" stroke="#38bdf8" stroke-width="1.5"/>';
      h += '<text x="88" y="' + ((cy + yIn)/2 + 4) + '" fill="#38bdf8" font-size="11">b = ' + impactB + ' fm</text>';
    }

    // Trajectory generation (Hyperbolic Rutherford orbit)
    var points = [];
    var alphaX = 0, alphaY = 0;
    var progress = Math.min(1.0, t / 4.0);

    for(var s = -250; s <= 250; s += 5){
      // parametric approximation of repulsive hyperbolic scattering
      var px = cx + s;
      var py;
      if(impactB === 0){
        // head on: rebounds backwards
        var rClose = d0 * 2.5;
        if(s < -rClose) py = cy;
        else py = cy;
      } else {
        var rDist = Math.sqrt(s*s + bPix*bPix);
        var deflAngle = thetaRad * (1 - Math.exp(-40 / rDist));
        py = cy - bPix * Math.cos(deflAngle) - (s > 0 ? (s * Math.sin(thetaRad)) : 0);
      }
      points.push(px + ',' + py);
    }

    if(impactB === 0){
      var rStop = cx - (d0 * 2.5);
      var travelX = 60 + progress * 2 * (rStop - 60);
      if(progress > 0.5){
        travelX = rStop - (progress - 0.5) * 2 * (rStop - 60);
      }
      h += '<line x1="60" y1="' + cy + '" x2="' + rStop + '" y2="' + cy + '" stroke="#38bdf8" stroke-width="3"/>';
      alphaX = travelX; alphaY = cy;
    } else {
      var dPath = 'M ' + points.join(' L ');
      h += '<path d="' + dPath + '" fill="none" stroke="#38bdf8" stroke-width="2.5" opacity="0.85"/>';
      var idx = Math.floor(progress * (points.length - 1));
      var coords = points[idx].split(',');
      alphaX = parseFloat(coords[0]); alphaY = parseFloat(coords[1]);
    }

    // Alpha particle
    h += '<circle cx="' + alphaX + '" cy="' + alphaY + '" r="7" fill="#f59e0b" filter="drop-shadow(0 0 8px #f59e0b)"/>';
    h += '<text x="' + (alphaX - 10) + '" y="' + (alphaY - 12) + '" fill="#f59e0b" font-size="11" font-weight="bold">⁴₂α²⁺</text>';

    // Angular arc
    h += '<path d="M ' + (cx + 90) + ' ' + cy + ' A 90 90 0 0 0 ' + (cx + 90 * Math.cos(thetaRad)) + ' ' + (cy - 90 * Math.sin(thetaRad)) + '" fill="none" stroke="#a855f7" stroke-width="2"/>';
    h += '<text x="' + (cx + 110) + '" y="' + (cy - 20) + '" fill="#c084fc" font-size="13" font-weight="bold">θ = ' + thetaDeg.toFixed(1) + '°</text>';

    svg.innerHTML = h;

    readout(
      cell("Impact Parameter b", impactB + " fm", "#38bdf8") +
      cell("Closest Approach d₀", d0.toFixed(1) + " fm", "#e11d48") +
      cell("Scattering Angle θ", thetaDeg.toFixed(1) + "°", "#c084fc") +
      cell("Relative Intensity N(θ)", (1.0 / Math.pow(Math.sin((thetaRad/2) || 0.05), 4)).toExponential(1), "#e2e8f0")
    );

    var note = thetaDeg > 90 ?
      '<b style="color:#f43f5e;">LARGE ANGLE BACKSCATTERING!</b> Only a concentrated, dense positive core (+Ze) within &lt;10⁻¹⁴ m can exert enough Coulomb force to reverse an incoming alpha particle.' :
      'At larger impact parameters (b > 40 fm), the repulsive Coulomb force falls off as 1/r², producing small forward deflections.';
    verdict('<b>Rutherford Nuclear Deduction:</b> ' + note);
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Photoelectric Effect & Work Function Lab (photoelectric)
// -------------------------------------------------------------------------
window.SIMS.photoelectric = (function(){
  var wavelength = 350; // nm
  var intensity = 5; // mW/cm²
  var retardingV = 0.0; // Volts
  var targetMetal = "Na"; // Cs, K, Na, Cu
  var workFunctions = { Cs: 1.90, K: 2.25, Na: 2.36, Cu: 4.70 };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#eab308;"></span><span>Incident Photons (hν)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ejected Photoelectrons</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Stopping Potential Barrier</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-uv">UV on Sodium (Photoelectric Current)</button>' +
      '<button class="preset-btn" id="p-stop">Exact Stopping Potential (V₀)</button>' +
      '<button class="preset-btn" id="p-red">Red Light (Below Threshold ν < ν₀)</button>';

    document.getElementById("p-uv").onclick = function(){
      setActivePreset(this); wavelength = 300; retardingV = 0.0; targetMetal = "Na"; updateControls(); App.resetTimeline(); App.play();
    };
    document.getElementById("p-stop").onclick = function(){
      setActivePreset(this); wavelength = 300; targetMetal = "Na";
      var h = 4.1357e-15, c = 3.0e17; // eV*s and nm/s
      var Eph = (h * c) / wavelength;
      retardingV = Math.max(0, Eph - workFunctions[targetMetal]);
      updateControls(); App.resetTimeline(); App.play();
    };
    document.getElementById("p-red").onclick = function(){
      setActivePreset(this); wavelength = 680; retardingV = 0.0; targetMetal = "Na"; updateControls(); App.resetTimeline(); App.play();
    };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Light Wavelength (λ): <b id="lam-val" style="color:#eab308;">350 nm</b></label>' +
        '<input type="range" id="lam-slider" min="150" max="750" value="350" step="5">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Cathode Metal Target: <b id="metal-val" style="color:#38bdf8;">Sodium (W₀ = 2.36 eV)</b></label>' +
        '<select id="metal-select" style="padding:6px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;">' +
          '<option value="Cs">Caesium (1.90 eV)</option>' +
          '<option value="K">Potassium (2.25 eV)</option>' +
          '<option value="Na" selected>Sodium (2.36 eV)</option>' +
          '<option value="Cu">Copper (4.70 eV)</option>' +
        '</select>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Opposing Retarding Voltage (V): <b id="ret-val" style="color:#f43f5e;">0.00 V</b></label>' +
        '<input type="range" id="ret-slider" min="0" max="5.0" value="0.0" step="0.05">' +
      '</div>';

    document.getElementById("lam-slider").oninput = function(e){
      wavelength = parseFloat(e.target.value);
      document.getElementById("lam-val").textContent = wavelength + " nm";
      draw(App.state.t);
    };
    document.getElementById("metal-select").onchange = function(e){
      targetMetal = e.target.value;
      document.getElementById("metal-val").textContent = targetMetal + " (W₀ = " + workFunctions[targetMetal].toFixed(2) + " eV)";
      draw(App.state.t);
    };
    document.getElementById("ret-slider").oninput = function(e){
      retardingV = parseFloat(e.target.value);
      document.getElementById("ret-val").textContent = retardingV.toFixed(2) + " V";
      draw(App.state.t);
    };

    draw(0);
  }

  function updateControls(){
    var ls = document.getElementById("lam-slider"); if(ls) ls.value = wavelength;
    var ms = document.getElementById("metal-select"); if(ms) ms.value = targetMetal;
    var rs = document.getElementById("ret-slider"); if(rs) rs.value = retardingV;
    var lv = document.getElementById("lam-val"); if(lv) lv.textContent = wavelength + " nm";
    var rv = document.getElementById("ret-val"); if(rv) rv.textContent = retardingV.toFixed(2) + " V";
    draw(App.state.t);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;

    // Physics calculations
    // Eph = 1240 / lambda (eV)
    var Eph = 1240.0 / wavelength;
    var W0 = workFunctions[targetMetal];
    var Kmax = Eph - W0; // in eV
    var canEmit = (Kmax > 0);
    var reachesAnode = canEmit && (Kmax > retardingV);
    var stopV0 = Math.max(0, Kmax);

    // Light colour
    var lightColor = "#eab308";
    if(wavelength < 380) lightColor = "#c084fc"; // UV
    else if(wavelength < 450) lightColor = "#3b82f6"; // Blue
    else if(wavelength < 500) lightColor = "#06b6d4"; // Cyan
    else if(wavelength < 560) lightColor = "#22c55e"; // Green
    else if(wavelength < 610) lightColor = "#eab308"; // Yellow
    else lightColor = "#ef4444"; // Red

    var h = '<rect width="100%" height="100%" fill="#07101b"/>';

    // Evacuated Glass Tube
    h += '<rect x="120" y="80" width="560" height="260" rx="30" fill="#0d1b2a" stroke="#1e3a5f" stroke-width="2.5"/>';

    // Cathode (Emitter Plate)
    h += '<rect x="180" y="110" width="16" height="200" fill="#94a3b8" rx="3"/>';
    h += '<text x="188" y="335" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Cathode (' + targetMetal + ')</text>';

    // Anode (Collector Plate)
    h += '<rect x="600" y="110" width="16" height="200" fill="#cbd5e1" rx="3"/>';
    h += '<text x="608" y="335" fill="#cbd5e1" font-size="12" font-weight="bold" text-anchor="middle">Anode</text>';

    // Incident light beam
    for(var i = 0; i < 6; i++){
      var yOff = 130 + i * 28;
      var phOffset = ((t * 80 + i * 25) % 90);
      h += '<line x1="80" y1="' + (yOff - 50) + '" x2="180" y2="' + yOff + '" stroke="' + lightColor + '" stroke-width="3" opacity="0.8"/>';
      h += '<circle cx="' + (80 + phOffset) + '" cy="' + (yOff - 50 + phOffset * 0.5) + '" r="4" fill="' + lightColor + '"/>';
    }

    // Ejected Photoelectrons animation
    if(canEmit){
      var vMaxRel = Math.sqrt(Kmax);
      for(var j = 0; j < 8; j++){
        var yPos = 130 + j * 22;
        var electronT = ((t * (1.5 + vMaxRel * 0.8) + j * 0.3) % 1.0);
        var distTotal = 600 - 196; // 404 px
        var xElec;

        if(reachesAnode){
          xElec = 196 + electronT * distTotal;
        } else {
          // turns back before anode!
          var maxPenetration = (Kmax / (retardingV || 0.001)) * distTotal;
          maxPenetration = Math.min(distTotal - 20, maxPenetration);
          if(electronT < 0.5){
            xElec = 196 + (electronT * 2) * maxPenetration;
          } else {
            xElec = 196 + maxPenetration - (electronT - 0.5) * 2 * maxPenetration;
          }
        }

        h += '<circle cx="' + xElec + '" cy="' + yPos + '" r="5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)"/>';
      }
    }

    // Voltmeter & Ammeter Circuit Loop
    h += '<path d="M 188 310 L 188 390 L 360 390" fill="none" stroke="#475569" stroke-width="2.5"/>';
    h += '<path d="M 608 310 L 608 390 L 440 390" fill="none" stroke="#475569" stroke-width="2.5"/>';

    // Battery / Retarding potential symbol
    h += '<circle cx="400" cy="390" r="24" fill="#1e293b" stroke="#f43f5e" stroke-width="2"/>';
    h += '<text x="400" y="394" fill="#f43f5e" font-size="11" font-weight="bold" text-anchor="middle">− ' + retardingV.toFixed(2) + ' V +</text>';

    // Ammeter symbol
    h += '<circle cx="530" cy="390" r="20" fill="#1e293b" stroke="' + (reachesAnode ? '#10b981' : '#64748b') + '" stroke-width="2"/>';
    h += '<text x="530" y="395" fill="' + (reachesAnode ? '#10b981' : '#64748b') + '" font-size="12" font-weight="bold" text-anchor="middle">A</text>';

    svg.innerHTML = h;

    var currentText = reachesAnode ? '<span style="color:#10b981;">CURRENT FLOWING (I > 0)</span>' : '<span style="color:#f43f5e;">ZERO CURRENT (Stopped)</span>';
    if(!canEmit) currentText = '<span style="color:#64748b;">NO EMISSION (hν < W₀)</span>';

    readout(
      cell("Photon Energy hν", Eph.toFixed(2) + " eV", "#eab308") +
      cell("Work Function W₀", W0.toFixed(2) + " eV", "#94a3b8") +
      cell("Max Kinetic Energy", (canEmit ? Kmax.toFixed(2) : "0.00") + " eV", "#38bdf8") +
      cell("Stopping Potential V₀", stopV0.toFixed(2) + " V", "#f43f5e")
    );

    var expl = canEmit ?
      (reachesAnode ? 'Photons overcome work function; photoelectrons possess sufficient kinetic energy to overcome retarding voltage.' :
                      'Photoelectrons are ejected, but the opposing electric potential halts and turns them back before reaching the anode.') :
      'Light frequency is strictly below the metal threshold (ν < ν₀). No electrons can be ejected, regardless of light intensity.';
    verdict('<b>Einstein Photoelectric Condition:</b> ' + currentText + '<br><small>' + expl + '</small>');
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Bohr Model Orbit Transitions & Line Spectra (bohrmodel)
// -------------------------------------------------------------------------
window.SIMS.bohrmodel = (function(){
  var nInitial = 3;
  var nFinal = 2; // Balmer H-alpha (656 nm red)

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#e11d48;"></span><span>Proton (+e)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Bohr Electron Orbit (r_n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#facc15;"></span><span>Emitted Photon (hν)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-balmer-red">Balmer H-α (3 → 2, Red 656 nm)</button>' +
      '<button class="preset-btn" id="p-balmer-blue">Balmer H-β (4 → 2, Cyan 486 nm)</button>' +
      '<button class="preset-btn" id="p-lyman">Lyman-α (2 → 1, UV 121.6 nm)</button>' +
      '<button class="preset-btn" id="p-paschen">Paschen-α (4 → 3, IR 1875 nm)</button>';

    document.getElementById("p-balmer-red").onclick = function(){ setActivePreset(this); setTransition(3, 2); };
    document.getElementById("p-balmer-blue").onclick = function(){ setActivePreset(this); setTransition(4, 2); };
    document.getElementById("p-lyman").onclick = function(){ setActivePreset(this); setTransition(2, 1); };
    document.getElementById("p-paschen").onclick = function(){ setActivePreset(this); setTransition(4, 3); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Initial Orbit (n_i): <b id="ni-val" style="color:#38bdf8;">3</b></label>' +
        '<select id="ni-select" style="padding:6px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;">' +
          '<option value="6">n = 6</option>' +
          '<option value="5">n = 5</option>' +
          '<option value="4">n = 4</option>' +
          '<option value="3" selected>n = 3</option>' +
          '<option value="2">n = 2</option>' +
        '</select>' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Final Orbit (n_f): <b id="nf-val" style="color:#10b981;">2</b></label>' +
        '<select id="nf-select" style="padding:6px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;">' +
          '<option value="5">n = 5 (Pfund)</option>' +
          '<option value="4">n = 4 (Brackett)</option>' +
          '<option value="3">n = 3 (Paschen)</option>' +
          '<option value="2" selected>n = 2 (Balmer)</option>' +
          '<option value="1">n = 1 (Lyman)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("ni-select").onchange = function(e){
      var val = parseInt(e.target.value);
      if(val <= nFinal) { alert("Initial orbit n_i must be strictly greater than final orbit n_f for emission!"); e.target.value = nInitial; return; }
      nInitial = val;
      document.getElementById("ni-val").textContent = nInitial;
      App.resetTimeline(); App.play();
    };
    document.getElementById("nf-select").onchange = function(e){
      var val = parseInt(e.target.value);
      if(val >= nInitial) { alert("Final orbit n_f must be strictly less than initial orbit n_i for emission!"); e.target.value = nFinal; return; }
      nFinal = val;
      document.getElementById("nf-val").textContent = nFinal;
      App.resetTimeline(); App.play();
    };

    draw(0);
  }

  function setTransition(ni, nf){
    nInitial = ni; nFinal = nf;
    var nis = document.getElementById("ni-select"); if(nis) nis.value = ni;
    var nfs = document.getElementById("nf-select"); if(nfs) nfs.value = nf;
    var niv = document.getElementById("ni-val"); if(niv) niv.textContent = ni;
    var nfv = document.getElementById("nf-val"); if(nfv) nfv.textContent = nf;
    App.resetTimeline(); App.play();
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var cx = W * 0.42, cy = H / 2;

    // Rydberg calculations
    // 1/lambda = 1.097e7 * (1/nf^2 - 1/ni^2)
    var invLambda = 1.09677e7 * ((1.0 / (nFinal * nFinal)) - (1.0 / (nInitial * nInitial)));
    var lambdaM = 1.0 / invLambda;
    var lambdaNm = lambdaM * 1e9;
    var deltaE_eV = 13.6 * ((1.0 / (nFinal * nFinal)) - (1.0 / (nInitial * nInitial)));

    var seriesName = "Unknown";
    var emColor = "#facc15";
    if(nFinal === 1){ seriesName = "Lyman Series (Ultraviolet)"; emColor = "#a855f7"; }
    else if(nFinal === 2){
      seriesName = "Balmer Series (Visible)";
      if(lambdaNm > 620) emColor = "#ef4444"; // Red
      else if(lambdaNm > 480) emColor = "#06b6d4"; // Cyan
      else if(lambdaNm > 430) emColor = "#3b82f6"; // Blue
      else emColor = "#8b5cf6"; // Violet
    }
    else if(nFinal === 3){ seriesName = "Paschen Series (Infrared)"; emColor = "#f97316"; }
    else if(nFinal === 4){ seriesName = "Brackett Series (Infrared)"; emColor = "#ea580c"; }
    else { seriesName = "Pfund Series (Far Infrared)"; emColor = "#c2410c"; }

    var h = '<rect width="100%" height="100%" fill="#090f1d"/>';

    // Concentric Bohr orbits (scaled radii r_n = 28 * n^1.2)
    var radii = [0, 32, 60, 95, 135, 178, 220];
    for(var n = 1; n <= 6; n++){
      var r = radii[n];
      var isTarget = (n === nFinal || n === nInitial);
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + (isTarget ? '#38bdf8' : '#1e293b') + '" stroke-width="' + (isTarget ? '1.8' : '1') + '" stroke-dasharray="' + (isTarget ? 'none' : '3,3') + '"/>';
      h += '<text x="' + (cx + r + 4) + '" y="' + (cy - 4) + '" fill="' + (isTarget ? '#38bdf8' : '#475569') + '" font-size="10">n=' + n + '</text>';
    }

    // Central Nucleus (+e)
    h += '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="#e11d48" filter="drop-shadow(0 0 8px #f43f5e)"/>';
    h += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">+1</text>';

    // Electron position and orbital jump
    var jumpProgress = Math.min(1.0, (t % 2.5) / 1.5);
    var rCurrent = radii[nInitial] - jumpProgress * (radii[nInitial] - radii[nFinal]);
    var angle = t * 2.5;
    var ex = cx + rCurrent * Math.cos(angle);
    var ey = cy + rCurrent * Math.sin(angle);

    h += '<circle cx="' + ex + '" cy="' + ey + '" r="6" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)"/>';

    // Emitted photon packet animation
    if(jumpProgress > 0.8){
      var phT = (t % 2.5) - 1.2;
      var phDist = phT * 120;
      var phX = cx + radii[nFinal] + phDist;
      h += '<path d="M ' + (phX - 25) + ' ' + (cy - 10) + ' q 6 -8 12 0 t 12 0" fill="none" stroke="' + emColor + '" stroke-width="3" filter="drop-shadow(0 0 6px ' + emColor + ')"/>';
      h += '<text x="' + phX + '" y="' + (cy - 18) + '" fill="' + emColor + '" font-size="11" font-weight="bold">hν (' + lambdaNm.toFixed(1) + ' nm)</text>';
    }

    // Right-hand side Spectral Bar Visualizer
    var specX = W - 140, specW = 100, specH = 280;
    h += '<rect x="' + specX + '" y="' + (cy - specH/2) + '" width="' + specW + '" height="' + specH + '" fill="#0f172a" stroke="#334155" rx="8"/>';
    h += '<text x="' + (specX + specW/2) + '" y="' + (cy - specH/2 - 12) + '" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Spectrum Bar</text>';

    // Characteristic spectral line marker
    var normY = (cy - specH/2) + 20 + ((lambdaNm - 100) / 1800) * (specH - 40);
    normY = Math.max(cy - specH/2 + 10, Math.min(cy + specH/2 - 10, normY));
    h += '<line x1="' + (specX + 10) + '" y1="' + normY + '" x2="' + (specX + specW - 10) + '" y2="' + normY + '" stroke="' + emColor + '" stroke-width="4" filter="drop-shadow(0 0 8px ' + emColor + ')"/>';
    h += '<text x="' + (specX + specW/2) + '" y="' + (normY + 18) + '" fill="' + emColor + '" font-size="11" font-weight="bold" text-anchor="middle">' + lambdaNm.toFixed(0) + ' nm</text>';

    svg.innerHTML = h;

    readout(
      cell("Transition", nInitial + " → " + nFinal, "#38bdf8") +
      cell("Energy ΔE", deltaE_eV.toFixed(2) + " eV", "#facc15") +
      cell("Wavelength λ", (lambdaNm < 1000 ? lambdaNm.toFixed(1) + " nm" : (lambdaNm/1000).toFixed(3) + " µm"), emColor) +
      cell("Spectral Series", seriesName.split(" ")[0], "#e2e8f0")
    );

    verdict('<b>Bohr Quantum Transition:</b> Electron de-excites from stationary orbit n=' + nInitial + ' to n=' + nFinal + ', emitting a single photon with energy ΔE = E(' + nInitial + ') − E(' + nFinal + '). Series: <b>' + seriesName + '</b>.');
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: de Broglie Standing Waves & Heisenberg Slit (uncertainty)
// -------------------------------------------------------------------------
window.SIMS.uncertainty = (function(){
  var slitWidth = 10; // delta x in arbitrary pm
  var orbitN = 3; // standing wave mode

  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Standing de Broglie Wave (2πr = nλ)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Aperture Slit (Δx)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Transverse Spread (Δp)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-mode3">Bohr-de Broglie Resonance (n = 3 Waves)</button>' +
      '<button class="preset-btn" id="p-mode4">Resonance (n = 4 Waves)</button>' +
      '<button class="preset-btn" id="p-narrow">Narrow Slit (High Δp Uncertainty)</button>' +
      '<button class="preset-btn" id="p-wide">Wide Slit (Low Δp Spread)</button>';

    document.getElementById("p-mode3").onclick = function(){ setActivePreset(this); orbitN = 3; update(); };
    document.getElementById("p-mode4").onclick = function(){ setActivePreset(this); orbitN = 4; update(); };
    document.getElementById("p-narrow").onclick = function(){ setActivePreset(this); slitWidth = 4; update(); };
    document.getElementById("p-wide").onclick = function(){ setActivePreset(this); slitWidth = 25; update(); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Bohr Standing Wave Harmonic (n): <b id="mode-val" style="color:#38bdf8;">n = 3</b></label>' +
        '<input type="range" id="mode-slider" min="1" max="5" value="3" step="1">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Position Aperture Confinement (Δx): <b id="slit-val" style="color:#f43f5e;">10 pm</b></label>' +
        '<input type="range" id="slit-slider" min="2" max="30" value="10" step="1">' +
      '</div>';

    document.getElementById("mode-slider").oninput = function(e){
      orbitN = parseInt(e.target.value);
      document.getElementById("mode-val").textContent = "n = " + orbitN;
      draw(App.state.t);
    };
    document.getElementById("slit-slider").oninput = function(e){
      slitWidth = parseInt(e.target.value);
      document.getElementById("slit-val").textContent = slitWidth + " pm";
      draw(App.state.t);
    };

    draw(0);
  }

  function update(){
    var ms = document.getElementById("mode-slider"); if(ms) ms.value = orbitN;
    var ss = document.getElementById("slit-slider"); if(ss) ss.value = slitWidth;
    var mv = document.getElementById("mode-val"); if(mv) mv.textContent = "n = " + orbitN;
    var sv = document.getElementById("slit-val"); if(sv) sv.textContent = slitWidth + " pm";
    draw(App.state.t);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;

    var h = '<rect width="100%" height="100%" fill="#070e1a"/>';

    // LEFT PANEL: Standing circular de Broglie matter wave (2πr = nλ)
    var cx = W * 0.28, cy = H / 2;
    var r0 = 90;
    var amp = 14;

    h += '<text x="' + cx + '" y="45" fill="#94a3b8" font-size="13" font-weight="bold" text-anchor="middle">Standing Matter Wave (2πr = ' + orbitN + 'λ)</text>';
    h += '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="#e11d48"/>';

    var wavePoints = [];
    for(var a = 0; a <= 360; a += 2){
      var rad = a * Math.PI / 180;
      var rWave = r0 + amp * Math.sin(orbitN * rad - t * 3);
      var wx = cx + rWave * Math.cos(rad);
      var wy = cy + rWave * Math.sin(rad);
      wavePoints.push(wx + ',' + wy);
    }
    h += '<path d="M ' + wavePoints.join(' L ') + ' Z" fill="none" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 0 6px #38bdf8)"/>';
    h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r0 + '" fill="none" stroke="#334155" stroke-dasharray="3,3"/>';

    // RIGHT PANEL: Heisenberg Uncertainty Diffraction Slit
    var sx = W * 0.72;
    h += '<text x="' + sx + '" y="45" fill="#94a3b8" font-size="13" font-weight="bold" text-anchor="middle">Heisenberg Aperture (Δx · Δp ≥ ℏ/2)</text>';

    var sHalf = slitWidth * 3.5;
    // Barrier plates
    h += '<rect x="' + (sx - 60) + '" y="70" width="12" height="' + (cy - sHalf - 70) + '" fill="#64748b" rx="2"/>';
    h += '<rect x="' + (sx - 60) + '" y="' + (cy + sHalf) + '" width="12" height="' + (H - 70 - cy - sHalf) + '" fill="#64748b" rx="2"/>';

    // Incoming parallel electron matter waves
    for(var k = -3; k <= 3; k++){
      var offX = ((t * 40 + k * 20) % 70);
      h += '<line x1="' + (sx - 130 + offX) + '" y1="' + (cy - 50) + '" x2="' + (sx - 130 + offX) + '" y2="' + (cy + 50) + '" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/>';
    }

    // Transverse momentum spread envelope: theta ~ lambda / Delta_x
    var spreadAngle = (30.0 / slitWidth); // spread in radians scaled
    var endX = sx + 80;
    var spreadY = endX * Math.tan(Math.min(1.2, spreadAngle));

    h += '<path d="M ' + (sx - 48) + ' ' + (cy - sHalf) + ' L ' + endX + ' ' + (cy - spreadY) + ' L ' + endX + ' ' + (cy + spreadY) + ' L ' + (sx - 48) + ' ' + (cy + sHalf) + ' Z" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-dasharray="3,3"/>';

    // Detector screen
    h += '<line x1="' + endX + '" y1="70" x2="' + endX + '" y2="' + (H - 70) + '" stroke="#cbd5e1" stroke-width="4"/>';
    h += '<text x="' + (endX + 10) + '" y="' + cy + '" fill="#10b981" font-size="12" font-weight="bold">Spread Δp</text>';

    svg.innerHTML = h;

    var dpVal = (52.7 / slitWidth).toFixed(1);
    readout(
      cell("Harmonic n", orbitN + " λ = 2πr", "#38bdf8") +
      cell("Slit Width Δx", slitWidth + " pm", "#f43f5e") +
      cell("Momentum Spread Δp", dpVal + " × 10⁻²⁴ N·s", "#10b981") +
      cell("Uncertainty Product", "Δx · Δp ≥ ℏ/2", "#e2e8f0")
    );

    var msg = slitWidth < 8 ?
      '<b>Severe Quantum Confinement:</b> Narrowing the aperture pins position Δx accurately, causing the momentum uncertainty Δp to blow up massively via diffraction!' :
      '<b>Moderate Spatial Confinement:</b> Wider slit preserves low momentum uncertainty Δp but blurs the exact transverse position of the electron.';
    verdict('<b>Quantum Dual Behavior:</b> ' + msg);
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: 3D Atomic Orbital Visualizer & Nodes Mapper (orbitalviewer)
// -------------------------------------------------------------------------
window.SIMS.orbitalviewer = (function(){
  var currentOrbital = "2p"; // 1s, 2s, 2p, 3s, 3p, 3d

  var orbitalData = {
    "1s": { n: 1, l: 0, ml: 0, radialNodes: 0, angularNodes: 0, totalNodes: 0, shape: "Spherical" },
    "2s": { n: 2, l: 0, ml: 0, radialNodes: 1, angularNodes: 0, totalNodes: 1, shape: "Spherical (1 Radial Node)" },
    "2p": { n: 2, l: 1, ml: 0, radialNodes: 0, angularNodes: 1, totalNodes: 1, shape: "Dumbbell (Nodal Plane xy)" },
    "3s": { n: 3, l: 0, ml: 0, radialNodes: 2, angularNodes: 0, totalNodes: 2, shape: "Spherical (2 Radial Nodes)" },
    "3p": { n: 3, l: 1, ml: 0, radialNodes: 1, angularNodes: 1, totalNodes: 2, shape: "Dumbbell + 1 Radial Node" },
    "3d": { n: 3, l: 2, ml: 0, radialNodes: 0, angularNodes: 2, totalNodes: 2, shape: "Cloverleaf / Double Dumbbell" }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Positive Wavefunction (+ψ)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Negative Wavefunction (−ψ)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Nodal Surface (|ψ|² = 0)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-1s">1s Orbital</button>' +
      '<button class="preset-btn" id="p-2s">2s Orbital (Radial Node)</button>' +
      '<button class="preset-btn" id="p-2p">2p Orbital (Angular Node)</button>' +
      '<button class="preset-btn" id="p-3d">3d Orbital (Double Dumbbell)</button>';

    document.getElementById("p-1s").onclick = function(){ setActivePreset(this); setOrbital("1s"); };
    document.getElementById("p-2s").onclick = function(){ setActivePreset(this); setOrbital("2s"); };
    document.getElementById("p-2p").onclick = function(){ setActivePreset(this); setOrbital("2p"); };
    document.getElementById("p-3d").onclick = function(){ setActivePreset(this); setOrbital("3d"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Select Atomic Orbital: <b id="orb-label" style="color:#38bdf8;">2p Orbital</b></label>' +
        '<select id="orb-select" style="padding:8px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;font-size:14px;">' +
          '<option value="1s">1s (n=1, l=0)</option>' +
          '<option value="2s">2s (n=2, l=0)</option>' +
          '<option value="2p" selected>2p (n=2, l=1)</option>' +
          '<option value="3s">3s (n=3, l=0)</option>' +
          '<option value="3p">3p (n=3, l=1)</option>' +
          '<option value="3d">3d (n=3, l=2)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("orb-select").onchange = function(e){
      setOrbital(e.target.value);
    };

    draw(0);
  }

  function setOrbital(name){
    currentOrbital = name;
    var os = document.getElementById("orb-select"); if(os) os.value = name;
    var ol = document.getElementById("orb-label"); if(ol) ol.textContent = name + " Orbital";
    draw(App.state.t);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var cx = W / 2, cy = H / 2;

    var info = orbitalData[currentOrbital];
    var h = '<rect width="100%" height="100%" fill="#070f1a"/>';

    // 3D Cartesian axes
    h += '<line x1="' + (cx - 160) + '" y1="' + cy + '" x2="' + (cx + 160) + '" y2="' + cy + '" stroke="#334155" stroke-width="1.5"/>';
    h += '<text x="' + (cx + 170) + '" y="' + (cy + 4) + '" fill="#64748b" font-size="12">x</text>';

    h += '<line x1="' + cx + '" y1="' + (cy - 140) + '" x2="' + cx + '" y2="' + (cy + 140) + '" stroke="#334155" stroke-width="1.5"/>';
    h += '<text x="' + (cx - 15) + '" y="' + (cy - 145) + '" fill="#64748b" font-size="12">z</text>';

    h += '<line x1="' + (cx - 100) + '" y1="' + (cy + 80) + '" x2="' + (cx + 100) + '" y2="' + (cy - 80) + '" stroke="#334155" stroke-width="1.5" stroke-dasharray="3,3"/>';
    h += '<text x="' + (cx + 105) + '" y="' + (cy - 85) + '" fill="#64748b" font-size="12">y</text>';

    // Render probability clouds based on orbital geometry
    var pulse = 1.0 + 0.04 * Math.sin(t * 3);

    if(currentOrbital === "1s"){
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (65 * pulse) + '" fill="url(#grad-blue)" opacity="0.85" filter="drop-shadow(0 0 15px #38bdf8)"/>';
    }
    else if(currentOrbital === "2s"){
      // Outer sphere
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (110 * pulse) + '" fill="rgba(56, 189, 248, 0.35)"/>';
      // Radial node sphere
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="60" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,4"/>';
      // Inner crest
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="35" fill="#38bdf8" opacity="0.9"/>';
    }
    else if(currentOrbital === "2p"){
      // Upper lobe (+ψ)
      h += '<path d="M ' + cx + ' ' + cy + ' C ' + (cx - 45) + ' ' + (cy - 60) + ', ' + (cx - 30) + ' ' + (cy - 120) + ', ' + cx + ' ' + (cy - 120 * pulse) + ' C ' + (cx + 30) + ' ' + (cy - 120) + ', ' + (cx + 45) + ' ' + (cy - 60) + ', ' + cx + ' ' + cy + '" fill="#38bdf8" opacity="0.8" filter="drop-shadow(0 0 10px #38bdf8)"/>';
      // Lower lobe (−ψ)
      h += '<path d="M ' + cx + ' ' + cy + ' C ' + (cx - 45) + ' ' + (cy + 60) + ', ' + (cx - 30) + ' ' + (cy + 120) + ', ' + cx + ' ' + (cy + 120 * pulse) + ' C ' + (cx + 30) + ' ' + (cy + 120) + ', ' + (cx + 45) + ' ' + (cy + 60) + ', ' + cx + ' ' + cy + '" fill="#f43f5e" opacity="0.8" filter="drop-shadow(0 0 10px #f43f5e)"/>';
      // Nodal plane xy (horizontal line through nucleus)
      h += '<line x1="' + (cx - 120) + '" y1="' + cy + '" x2="' + (cx + 120) + '" y2="' + cy + '" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,4"/>';
      h += '<text x="' + (cx + 125) + '" y="' + (cy + 15) + '" fill="#fbbf24" font-size="11">Nodal plane (|ψ|² = 0)</text>';
    }
    else if(currentOrbital === "3d"){
      // Four lobes (cloverleaf)
      var dAngles = [45, 135, 225, 315];
      for(var i = 0; i < 4; i++){
        var ang = dAngles[i] * Math.PI / 180;
        var lx = cx + 80 * Math.cos(ang);
        var ly = cy + 80 * Math.sin(ang);
        var col = (i % 2 === 0) ? "#38bdf8" : "#f43f5e";
        h += '<circle cx="' + lx + '" cy="' + ly + '" r="' + (35 * pulse) + '" fill="' + col + '" opacity="0.75" filter="drop-shadow(0 0 8px ' + col + ')"/>';
      }
      // Two planar angular nodes
      h += '<line x1="' + (cx - 90) + '" y1="' + cy + '" x2="' + (cx + 90) + '" y2="' + cy + '" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3,3"/>';
      h += '<line x1="' + cx + '" y1="' + (cy - 90) + '" x2="' + cx + '" y2="' + (cy + 90) + '" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3,3"/>';
    }
    else {
      // 3s or 3p
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="120" fill="rgba(56, 189, 248, 0.2)"/>';
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="75" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,4"/>';
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="40" fill="#38bdf8" opacity="0.7"/>';
    }

    // Central Nucleus
    h += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)"/>';

    svg.innerHTML = h;

    readout(
      cell("Quantum Numbers", "n=" + info.n + ", l=" + info.l + ", m_l=" + info.ml, "#38bdf8") +
      cell("Radial Nodes (n−l−1)", info.radialNodes, "#fbbf24") +
      cell("Angular Nodes (l)", info.angularNodes, "#f43f5e") +
      cell("Total Nodes (n−1)", info.totalNodes, "#e2e8f0")
    );

    verdict('<b>Orbital Nodal Architecture:</b> ' + info.shape + '. Total nodes = ' + info.totalNodes + ' (Radial = ' + info.radialNodes + ', Angular = ' + info.angularNodes + ').');
  }

  return { mount: mount, update: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Interactive Aufbau Filling & Hund Spin Multiplicity (electronconfig)
// -------------------------------------------------------------------------
window.SIMS.electronconfig = (function(){
  var atomicZ = 24; // Default to Chromium (anomalous 3d5 4s1)

  var elementData = {
    1: { sym: "H", name: "Hydrogen", cfg: "1s¹", unpaired: 1 },
    6: { sym: "C", name: "Carbon", cfg: "1s² 2s² 2p²", unpaired: 2 },
    7: { sym: "N", name: "Nitrogen", cfg: "1s² 2s² 2p³", unpaired: 3 },
    8: { sym: "O", name: "Oxygen", cfg: "1s² 2s² 2p⁴", unpaired: 2 },
    11: { sym: "Na", name: "Sodium", cfg: "[Ne] 3s¹", unpaired: 1 },
    24: { sym: "Cr", name: "Chromium (Anomalous)", cfg: "[Ar] 3d⁵ 4s¹", unpaired: 6 },
    26: { sym: "Fe", name: "Iron", cfg: "[Ar] 3d⁶ 4s²", unpaired: 4 },
    29: { sym: "Cu", name: "Copper (Anomalous)", cfg: "[Ar] 3d¹⁰ 4s¹", unpaired: 1 },
    30: { sym: "Zn", name: "Zinc", cfg: "[Ar] 3d¹⁰ 4s²", unpaired: 0 }
  };

  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Spin Up (m_s = +½)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Spin Down (m_s = −½)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Degenerate Subshell Box</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cr">Chromium (Cr: [Ar] 3d⁵ 4s¹)</button>' +
      '<button class="preset-btn" id="p-cu">Copper (Cu: [Ar] 3d¹⁰ 4s¹)</button>' +
      '<button class="preset-btn" id="p-fe">Iron (Fe: [Ar] 3d⁶ 4s²)</button>' +
      '<button class="preset-btn" id="p-n">Nitrogen (N: 1s² 2s² 2p³)</button>';

    document.getElementById("p-cr").onclick = function(){ setActivePreset(this); setZ(24); };
    document.getElementById("p-cu").onclick = function(){ setActivePreset(this); setZ(29); };
    document.getElementById("p-fe").onclick = function(){ setActivePreset(this); setZ(26); };
    document.getElementById("p-n").onclick = function(){ setActivePreset(this); setZ(7); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Select Element: <b id="z-label" style="color:#38bdf8;">Chromium (Z = 24)</b></label>' +
        '<select id="z-picker" style="padding:8px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #334155;font-size:14px;">' +
          '<option value="1">H (Z=1, 1s¹)</option>' +
          '<option value="6">C (Z=6, [He] 2s² 2p²)</option>' +
          '<option value="7">N (Z=7, [He] 2s² 2p³)</option>' +
          '<option value="8">O (Z=8, [He] 2s² 2p⁴)</option>' +
          '<option value="11">Na (Z=11, [Ne] 3s¹)</option>' +
          '<option value="24" selected>Cr (Z=24, [Ar] 3d⁵ 4s¹ anomalous)</option>' +
          '<option value="26">Fe (Z=26, [Ar] 3d⁶ 4s²)</option>' +
          '<option value="29">Cu (Z=29, [Ar] 3d¹⁰ 4s¹ anomalous)</option>' +
          '<option value="30">Zn (Z=30, [Ar] 3d¹⁰ 4s²)</option>' +
        '</select>' +
      '</div>';

    document.getElementById("z-picker").onchange = function(e){
      setZ(parseInt(e.target.value));
    };

    draw(0);
  }

  function setZ(z){
    atomicZ = z;
    var zp = document.getElementById("z-picker"); if(zp) zp.value = z;
    var zl = document.getElementById("z-label"); if(zl) zl.textContent = elementData[z].name + " (Z = " + z + ")";
    draw(App.state.t);
  }

  function drawBox(x, y, up, down, label){
    var h = '<g transform="translate(' + x + ',' + y + ')">';
    h += '<rect width="36" height="36" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>';
    h += '<text x="18" y="50" fill="#94a3b8" font-size="11" text-anchor="middle">' + label + '</text>';
    if(up){
      h += '<path d="M 12 28 L 12 10 L 8 15 M 12 10 L 16 15" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    if(down){
      h += '<path d="M 24 10 L 24 28 L 20 23 M 24 28 L 28 23" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    h += '</g>';
    return h;
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var W = svg.clientWidth || 800, H = svg.clientHeight || 460;
    var ed = elementData[atomicZ];

    var h = '<rect width="100%" height="100%" fill="#080f1a"/>';

    h += '<text x="40" y="45" fill="#38bdf8" font-size="18" font-weight="bold">' + ed.sym + ' — ' + ed.name + ' (Z = ' + atomicZ + ')</text>';
    h += '<text x="40" y="70" fill="#94a3b8" font-size="14">Ground State Configuration: <tspan fill="#facc15" font-weight="bold">' + ed.cfg + '</tspan></text>';

    // Orbital Boxes Layout
    var startY = 130;

    // 1s
    var has1s2 = (atomicZ >= 2);
    h += drawBox(50, startY, atomicZ >= 1, has1s2, "1s");

    // 2s
    if(atomicZ >= 3){
      h += drawBox(120, startY, true, atomicZ >= 4, "2s");
    }

    // 2p (3 boxes)
    if(atomicZ >= 5){
      var n2p = Math.min(6, Math.max(0, atomicZ - 4));
      h += '<g transform="translate(190, 0)">';
      h += drawBox(0, startY, n2p >= 1, n2p >= 4, "2pₓ");
      h += drawBox(40, startY, n2p >= 2, n2p >= 5, "2pᵧ");
      h += drawBox(80, startY, n2p >= 3, n2p >= 6, "2p_z");
      h += '</g>';
    }

    // 3s
    if(atomicZ >= 11){
      h += drawBox(340, startY, true, atomicZ >= 12, "3s");
    }

    // 3p (3 boxes)
    if(atomicZ >= 13){
      var n3p = Math.min(6, Math.max(0, atomicZ - 12));
      h += '<g transform="translate(410, 0)">';
      h += drawBox(0, startY, n3p >= 1, n3p >= 4, "3pₓ");
      h += drawBox(40, startY, n3p >= 2, n3p >= 5, "3pᵧ");
      h += drawBox(80, startY, n3p >= 3, n3p >= 6, "3p_z");
      h += '</g>';
    }

    // Transition row: 4s and 3d
    var row2Y = startY + 110;
    if(atomicZ >= 19){
      h += '<text x="40" y="' + (row2Y - 15) + '" fill="#94a3b8" font-size="13" font-weight="bold">Valence Orbitals (4s & 3d):</text>';

      // 4s
      var has4sUp = (atomicZ >= 19);
      var has4sDown = (atomicZ >= 20 && atomicZ !== 24 && atomicZ !== 29); // Cr and Cu promote 1 e- to 3d!
      h += drawBox(50, row2Y, has4sUp, has4sDown, "4s");

      // 3d (5 degenerate boxes)
      var n3d = 0;
      if(atomicZ === 24) n3d = 5; // Cr: 3d5
      else if(atomicZ === 26) n3d = 6; // Fe: 3d6
      else if(atomicZ === 29) n3d = 10; // Cu: 3d10
      else if(atomicZ === 30) n3d = 10; // Zn: 3d10

      h += '<g transform="translate(130, 0)">';
      h += drawBox(0, row2Y, n3d >= 1, n3d >= 6, "3d₁");
      h += drawBox(40, row2Y, n3d >= 2, n3d >= 7, "3d₂");
      h += drawBox(80, row2Y, n3d >= 3, n3d >= 8, "3d₃");
      h += drawBox(120, row2Y, n3d >= 4, n3d >= 9, "3d₄");
      h += drawBox(160, row2Y, n3d >= 5, n3d >= 10, "3d₅");
      h += '</g>';
    }

    // Highlight anomalous exchange stability
    if(atomicZ === 24){
      h += '<rect x="420" y="' + (row2Y - 10) + '" width="330" height="70" rx="8" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" stroke-width="1.5"/>';
      h += '<text x="435" y="' + (row2Y + 18) + '" fill="#f59e0b" font-size="12" font-weight="bold">★ Half-Filled d⁵ Stabilization</text>';
      h += '<text x="435" y="' + (row2Y + 38) + '" fill="#cbd5e1" font-size="11">10 exchange pairs + spherical symmetry minimize</text>';
      h += '<text x="435" y="' + (row2Y + 54) + '" fill="#cbd5e1" font-size="11">electron-electron repulsion over [Ar] 3d⁴ 4s².</text>';
    }
    else if(atomicZ === 29){
      h += '<rect x="420" y="' + (row2Y - 10) + '" width="330" height="70" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="1.5"/>';
      h += '<text x="435" y="' + (row2Y + 18) + '" fill="#10b981" font-size="12" font-weight="bold">★ Completely Filled d¹⁰ Stabilization</text>';
      h += '<text x="435" y="' + (row2Y + 38) + '" fill="#cbd5e1" font-size="11">Completely filled closed d-subshell yields maximum</text>';
      h += '<text x="435" y="' + (row2Y + 54) + '" fill="#cbd5e1" font-size="11">symmetry and exchange stability over [Ar] 3d⁹ 4s².</text>';
    }

    svg.innerHTML = h;

    // Spin magnetic moment mu = sqrt(n(n+2)) BM
    var nUnp = ed.unpaired;
    var muSpin = Math.sqrt(nUnp * (nUnp + 2)).toFixed(2);

    readout(
      cell("Atomic Number Z", atomicZ, "#38bdf8") +
      cell("Configuration", ed.cfg, "#facc15") +
      cell("Unpaired Electrons (n)", nUnp, (nUnp > 0 ? "#10b981" : "#94a3b8")) +
      cell("Spin Magnetic Moment µ", muSpin + " BM", "#e2e8f0")
    );

    var note = (atomicZ === 24 || atomicZ === 29) ?
      '<b>Anomalous Aufbau Configuration:</b> Inter-electronic exchange energy stabilization causes promotion of a 4s electron into 3d to achieve symmetrical half-filled (d⁵) or fully filled (d¹⁰) subshells.' :
      'Ground-state assembly follows the Aufbau (n+l) energy ranking rule, Pauli exclusion limit of 2 electrons per orbital, and Hund\'s maximum spin rule in degenerate subshells.';
    verdict('<b>Electronic Architecture:</b> ' + note);
  }

  return { mount: mount, update: draw };
})();

// Route timeline tick from App
App.updateSim = function(t){
  var s = App.currentConcept && App.currentConcept.sim;
  if(s && window.SIMS[s] && window.SIMS[s].update){
    window.SIMS[s].update(t);
  }
};
App.mountSim = function(id){
  if(window.SIMS[id] && window.SIMS[id].mount){
    window.SIMS[id].mount();
  }
};

// Initial hash route
window.addEventListener("DOMContentLoaded", function(){
  if(window.App && window.App.routeFromHash){
    window.App.routeFromHash();
  }
});
