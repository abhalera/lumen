// Chapter 1: Exploration: Entering the World of Secondary Science - Interactive Simulation Suite
window.SIMS = window.SIMS || {};

function createSimState(container, onUpdate) {
    const state = {
        running: false,
        time: 0,
        speed: 1.0,
        animId: null,
        presets: {},
        custom: {}
    };

    function loop() {
        if (state.running) {
            state.time += 0.03 * state.speed;
            if (state.time > 10.0) state.time = 0.0;
            const scrubber = container.querySelector('.sim-scrubber');
            if (scrubber) scrubber.value = state.time.toFixed(2);
            onUpdate(state);
            state.animId = requestAnimationFrame(loop);
        }
    }

    state.play = function() {
        if (!state.running) {
            state.running = true;
            state.animId = requestAnimationFrame(loop);
            const playBtn = container.querySelector('.btn-play');
            if (playBtn) { playBtn.textContent = '⏸ Pause'; playBtn.classList.add('active'); }
        }
    };

    state.pause = function() {
        state.running = false;
        if (state.animId) cancelAnimationFrame(state.animId);
        const playBtn = container.querySelector('.btn-play');
        if (playBtn) { playBtn.textContent = '▶ Play'; playBtn.classList.remove('active'); }
    };

    state.step = function() {
        state.pause();
        state.time += 0.2;
        if (state.time > 10.0) state.time = 0.0;
        const scrubber = container.querySelector('.sim-scrubber');
        if (scrubber) scrubber.value = state.time.toFixed(2);
        onUpdate(state);
    };

    state.reset = function() {
        state.pause();
        state.time = 0;
        const scrubber = container.querySelector('.sim-scrubber');
        if (scrubber) scrubber.value = '0';
        onUpdate(state);
    };

    state.bindControls = function() {
        const playBtn = container.querySelector('.btn-play');
        const stepBtn = container.querySelector('.btn-step');
        const resetBtn = container.querySelector('.btn-reset');
        const scrubber = container.querySelector('.sim-scrubber');
        const speedSel = container.querySelector('.sim-speed');

        if (playBtn) playBtn.addEventListener('click', () => {
            if (state.running) state.pause(); else state.play();
        });
        if (stepBtn) stepBtn.addEventListener('click', () => state.step());
        if (resetBtn) resetBtn.addEventListener('click', () => state.reset());
        if (scrubber) scrubber.addEventListener('input', (e) => {
            state.pause();
            state.time = parseFloat(e.target.value) || 0;
            onUpdate(state);
        });
        if (speedSel) speedSel.addEventListener('change', (e) => {
            state.speed = parseFloat(e.target.value) || 1.0;
        });
    };

    return state;
}

// 1. Scientific Modeling & Projectile Laboratory (sim-scientific-modeling)
window.SIMS['sim-scientific-modeling'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Scientific Modeling: Primary Idealization vs Environmental Complexity</h3>
    <div class="sim-controls-top">
      <label>Launch Velocity (m/s):
        <input type="range" class="vel-slider form-range" min="15" max="35" value="28" step="1">
        <span class="vel-val">28 m/s</span>
      </label>
      <label>Launch Angle:
        <input type="range" class="angle-slider form-range" min="20" max="70" value="45" step="1">
        <span class="angle-val">45°</span>
      </label>
      <label>Model Complexity:
        <select class="sel-model form-select">
          <option value="ideal" selected>Level 1: Idealized (Vacuum / Gravity Only)</option>
          <option value="drag">Level 2: Realistic (Quadratic Air Drag)</option>
          <option value="spin">Level 3: Advanced (Air Drag + Backspin Magnus)</option>
        </select>
      </label>
    </div>
  </div>
  <div class="sim-canvas-box">
    <svg class="sim-svg" viewBox="0 0 800 380" width="100%" height="320"></svg>
  </div>
  <div class="sim-controls-bar">
    <div class="btn-group">
      <button class="btn btn-sm btn-play">▶ Play</button>
      <button class="btn btn-sm btn-step">⏭ Step</button>
      <button class="btn btn-sm btn-reset">↺ Reset</button>
    </div>
    <input type="range" class="sim-scrubber form-range" min="0" max="10" step="0.05" value="0">
    <select class="sim-speed form-select">
      <option value="0.5">0.5×</option>
      <option value="1.0" selected>1.0×</option>
      <option value="2.0">2.0×</option>
    </select>
  </div>
  <div id="lab-readout" class="sim-readout"></div>
  <div id="lab-verdict" class="sim-verdict"></div>
</div>`;

        const velSlider = container.querySelector('.vel-slider');
        const velVal = container.querySelector('.vel-val');
        const angleSlider = container.querySelector('.angle-slider');
        const angleVal = container.querySelector('.angle-val');
        const selModel = container.querySelector('.sel-model');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const v0 = parseFloat(velSlider.value);
            const thetaDeg = parseFloat(angleSlider.value);
            const theta = thetaDeg * Math.PI / 180;
            const model = selModel.value;

            velVal.textContent = v0 + ' m/s';
            angleVal.textContent = thetaDeg + '°';

            const g = 9.8;
            // Ideal vacuum trajectory
            const tFlightIdeal = (2 * v0 * Math.sin(theta)) / g;
            const rangeIdeal = (v0 * v0 * Math.sin(2 * theta)) / g;
            const hMaxIdeal = (v0 * Math.sin(theta)) ** 2 / (2 * g);

            // Realistic aerodynamic drag multiplier
            let rangeActual = rangeIdeal;
            let hMaxActual = hMaxIdeal;
            let dragFactor = 1.0;

            if (model === 'drag') {
                dragFactor = 0.82; // ~18% range reduction for cricket ball
                rangeActual = rangeIdeal * dragFactor;
                hMaxActual = hMaxIdeal * 0.90;
            } else if (model === 'spin') {
                dragFactor = 0.88; // backspin creates lift via Magnus effect
                rangeActual = rangeIdeal * dragFactor;
                hMaxActual = hMaxIdeal * 0.96;
            }

            // Boundary rope at 75 metres
            const boundaryMeters = 75.0;
            const clearsSix = rangeActual >= boundaryMeters;

            // Animate ball along trajectory
            const currentT = (state.time / 10.0) * tFlightIdeal;
            const clampedT = Math.min(currentT, tFlightIdeal);

            // Scale to SVG coordinates: origin at (60, 320), width 700 covers 100m (7 px/m), height 250 covers 35m (7 px/m)
            const scaleX = 7.0;
            const scaleY = 7.0;
            const ox = 60;
            const oy = 320;

            // Build path points
            let idealPath = `M ${ox} ${oy}`;
            for (let t = 0; t <= tFlightIdeal; t += 0.05) {
                const x = ox + (v0 * Math.cos(theta) * t) * scaleX;
                const y = oy - (v0 * Math.sin(theta) * t - 0.5 * g * t * t) * scaleY;
                if (y <= oy) idealPath += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
            }

            let actualPath = `M ${ox} ${oy}`;
            const tFlightActual = tFlightIdeal * (model === 'ideal' ? 1.0 : 0.92);
            for (let t = 0; t <= tFlightActual; t += 0.05) {
                const frac = t / tFlightActual;
                const x = ox + (v0 * Math.cos(theta) * t * (model === 'ideal' ? 1.0 : dragFactor)) * scaleX;
                const y = oy - (v0 * Math.sin(theta) * t - 0.5 * g * t * t) * scaleY * (model === 'ideal' ? 1.0 : (model === 'spin' ? 0.96 : 0.90));
                if (y <= oy) actualPath += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
            }

            // Current ball position
            const ballX = ox + (v0 * Math.cos(theta) * clampedT * (model === 'ideal' ? 1.0 : dragFactor)) * scaleX;
            const ballY = Math.min(oy, oy - (v0 * Math.sin(theta) * clampedT - 0.5 * g * clampedT * clampedT) * scaleY * (model === 'ideal' ? 1.0 : (model === 'spin' ? 0.96 : 0.90)));

            const boundaryX = ox + boundaryMeters * scaleX;

            let svgContent = `
            <rect width="800" height="380" fill="#09131d" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              SCIENTIFIC MODELING: CRICKET BALL FLIGHT TRAJECTORY
            </text>

            <!-- Ground & Pitch -->
            <line x1="40" y1="${oy}" x2="760" y2="${oy}" stroke="#334155" stroke-width="2"/>
            <rect x="${ox}" y="${oy}" width="80" height="8" fill="#ca8a04"/>
            <text x="${ox + 40}" y="${oy + 22}" fill="#facc15" font-size="10" text-anchor="middle">Pitch (Crease)</text>

            <!-- Boundary Rope Marker (75m) -->
            <line x1="${boundaryX}" y1="${oy - 40}" x2="${boundaryX}" y2="${oy}" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
            <polygon points="${boundaryX},${oy - 40} ${boundaryX - 10},${oy - 30} ${boundaryX},${oy - 20}" fill="#ef4444"/>
            <text x="${boundaryX}" y="${oy - 45}" fill="#f87171" font-size="11" font-weight="bold" text-anchor="middle">75m Boundary</text>

            <!-- Ideal Path (White dashed) -->
            <path d="${idealPath}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6,4"/>
            
            <!-- Real / Active Model Path -->
            <path d="${actualPath}" fill="none" stroke="${clearsSix ? '#22c55e' : '#f59e0b'}" stroke-width="3"/>

            <!-- Moving Cricket Ball -->
            <circle cx="${ballX}" cy="${ballY}" r="7" fill="#dc2626" stroke="#fef08a" stroke-width="1.5"/>
            <line x1="${ballX - 4}" y1="${ballY}" x2="${ballX + 4}" y2="${ballY}" stroke="#ffffff" stroke-width="1"/>

            <!-- Legend Box -->
            <g transform="translate(560, 50)">
              <rect x="0" y="0" width="200" height="85" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
              <line x1="15" y1="20" x2="45" y2="20" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,2"/>
              <text x="55" y="24" fill="#cbd5e1" font-size="11">Level 1: Ideal Vacuum</text>
              <line x1="15" y1="45" x2="45" y2="45" stroke="${clearsSix ? '#22c55e' : '#f59e0b'}" stroke-width="3"/>
              <text x="55" y="49" fill="#f8fafc" font-size="11">${model === 'ideal' ? 'Active: Vacuum' : (model === 'drag' ? 'Level 2: Air Drag' : 'Level 3: Drag + Spin')}</text>
              <circle cx="25" cy="70" r="5" fill="#dc2626"/>
              <text x="55" y="74" fill="#cbd5e1" font-size="11">Cricket Ball (160 g)</text>
            </g>`;

            svg.innerHTML = svgContent;

            const discrepancy = Math.abs(rangeIdeal - rangeActual);
            const errPercent = ((discrepancy / rangeIdeal) * 100).toFixed(1);

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Ideal Range (Vacuum):</strong> ${rangeIdeal.toFixed(1)} m</div>
              <div><strong>Calculated Range:</strong> ${rangeActual.toFixed(1)} m</div>
              <div><strong>Peak Height:</strong> ${hMaxActual.toFixed(1)} m</div>
              <div><strong>Idealization Discrepancy:</strong> ${errPercent}% (${discrepancy.toFixed(1)} m)</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box ${clearsSix ? 'alert-tip' : 'alert-note'}" style="margin-top: 10px;">
              <strong>Scientific Modeling Verdict:</strong> ${clearsSix ? 
                `SIX! The shot travels ${rangeActual.toFixed(1)} m, safely crossing the 75m boundary rope.` : 
                `CAUGHT INSIDE BOUNDARY! The shot lands at ${rangeActual.toFixed(1)} m, falling short of the 75m rope.`}
              Deliberate simplification (ignoring seam roughness, grass blade vibration, and ball brand) isolates the core projectile mechanics 
              with over ${(100 - errPercent)}% accuracy. Extra complexities are added only when high-precision telemetry is needed!
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        velSlider.addEventListener('input', () => update(state));
        angleSlider.addEventListener('input', () => update(state));
        selModel.addEventListener('change', () => update(state));
        update(state);
    }
};

// 2. Units & Dimensional Analysis Lab: The Gimli Glider (sim-units-conversion)
window.SIMS['sim-units-conversion'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Units & Dimensional Analysis: The 1983 Gimli Glider Simulation</h3>
    <div class="sim-controls-top">
      <label>Required Fuel (kg):
        <input type="range" class="fuel-needed form-range" min="15000" max="30000" value="22300" step="500">
        <span class="fuel-val">22,300 kg</span>
      </label>
      <label>Ground Crew Unit Entry:
        <select class="sel-unit form-select">
          <option value="kg" selected>Correct SI Unit: 22,300 kg (Metric)</option>
          <option value="lb">Historical Fatal Error: 22,300 lb (Pounds)</option>
        </select>
      </label>
    </div>
  </div>
  <div class="sim-canvas-box">
    <svg class="sim-svg" viewBox="0 0 800 380" width="100%" height="320"></svg>
  </div>
  <div class="sim-controls-bar">
    <div class="btn-group">
      <button class="btn btn-sm btn-play">▶ Play</button>
      <button class="btn btn-sm btn-step">⏭ Step</button>
      <button class="btn btn-sm btn-reset">↺ Reset</button>
    </div>
    <input type="range" class="sim-scrubber form-range" min="0" max="10" step="0.05" value="0">
    <select class="sim-speed form-select">
      <option value="0.5">0.5×</option>
      <option value="1.0" selected>1.0×</option>
      <option value="2.0">2.0×</option>
    </select>
  </div>
  <div id="lab-readout" class="sim-readout"></div>
  <div id="lab-verdict" class="sim-verdict"></div>
</div>`;

        const fuelSlider = container.querySelector('.fuel-needed');
        const fuelVal = container.querySelector('.fuel-val');
        const selUnit = container.querySelector('.sel-unit');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const reqKg = parseFloat(fuelSlider.value);
            fuelVal.textContent = reqKg.toLocaleString() + ' kg';
            const unit = selUnit.value;

            // If unit is 'lb', actual kg loaded = reqKg / 2.20462
            const actualKg = unit === 'kg' ? reqKg : (reqKg / 2.20462);
            const deficitPercent = unit === 'kg' ? 0 : ((reqKg - actualKg) / reqKg * 100);

            // Flight distance capacity: assume 0.05 kg/km consumption per passenger equivalent -> standard route 4,000 km
            const routeDistance = 4000; // km
            const maxRange = (actualKg / reqKg) * routeDistance;

            // Flight progress based on state.time (0 to 10s represents 4,000 km journey)
            const currentDist = (state.time / 10.0) * routeDistance;
            const isFlameout = currentDist > maxRange;
            const planeDist = isFlameout ? maxRange : currentDist;

            // Map to SVG coordinates: x: 100 to 700 covers 4000 km
            const px = 100 + (planeDist / routeDistance) * 600;
            // Plane altitude: climb to y=120, if flameout glide down to y=290
            let py = 120;
            if (isFlameout) {
                const glideFrac = Math.min(1.0, (currentDist - maxRange) / (routeDistance - maxRange));
                py = 120 + glideFrac * 170; // glides toward runway
            }

            let svgContent = `
            <rect width="800" height="380" fill="#070d18" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              THE GIMLI GLIDER (1983): AIR CANADA FLIGHT 143 FLIGHT TRACK
            </text>

            <!-- Sky & Altitude lines -->
            <line x1="80" y1="120" x2="720" y2="120" stroke="#1e293b" stroke-dasharray="4,4"/>
            <text x="85" y="115" fill="#64748b" font-size="10">Cruising Altitude: 41,000 ft (FL410)</text>

            <!-- Ground Line -->
            <line x1="80" y1="290" x2="720" y2="290" stroke="#334155" stroke-width="2"/>
            
            <!-- Montreal Departure -->
            <rect x="90" y="285" width="40" height="5" fill="#3b82f6"/>
            <text x="100" y="310" fill="#93c5fd" font-size="11" text-anchor="middle">Montreal (CYUL)</text>

            <!-- Edmonton Destination -->
            <rect x="680" y="285" width="40" height="5" fill="#22c55e"/>
            <text x="700" y="310" fill="#86efac" font-size="11" text-anchor="middle">Edmonton (CYEG)</text>

            <!-- Gimli Dragstrip Emergency Landing Spot (~1,800 km mark) -->
            <g transform="translate(370, 275)">
              <rect x="0" y="0" width="30" height="15" fill="#f59e0b" rx="2"/>
              <text x="15" y="35" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">Gimli Racetrack</text>
            </g>

            <!-- Flight Path Trail -->
            <line x1="100" y1="120" x2="${px}" y2="${py}" stroke="${unit === 'kg' ? '#38bdf8' : (isFlameout ? '#ef4444' : '#f59e0b')}" stroke-width="3"/>

            <!-- Aircraft Icon -->
            <g transform="translate(${px}, ${py})">
              <!-- Fuselage -->
              <ellipse cx="0" cy="0" rx="16" ry="5" fill="${isFlameout ? '#f87171' : '#f8fafc'}"/>
              <!-- Wings -->
              <path d="M -4,0 L -12,-18 L -6,-18 L 4,0 L -6,18 L -12,18 Z" fill="#94a3b8"/>
              <!-- Tail -->
              <path d="M -14,0 L -20,-8 L -17,-8 L -11,0 Z" fill="#dc2626"/>
              ${isFlameout ? '<text x="0" y="-24" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">⚠️ ENGINES FLAMED OUT!</text>' : ''}
            </g>

            <!-- Fuel Tank Gauge Box -->
            <g transform="translate(520, 50)">
              <rect x="0" y="0" width="230" height="100" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
              <text x="15" y="24" fill="#38bdf8" font-size="12" font-weight="bold">Wing Tank Metric Balance:</text>
              <text x="15" y="48" fill="#cbd5e1" font-size="11">Required: <tspan fill="#ffffff" font-weight="bold">${reqKg.toLocaleString()} kg</tspan></text>
              <text x="15" y="68" fill="#cbd5e1" font-size="11">Loaded: <tspan fill="${unit === 'kg' ? '#4ade80' : '#f87171'}" font-weight="bold">${Math.round(actualKg).toLocaleString()} kg (${unit.toUpperCase()})</tspan></text>
              <rect x="15" y="78" width="190" height="10" rx="3" fill="#334155"/>
              <rect x="15" y="78" width="${(actualKg / reqKg) * 190}" height="10" rx="3" fill="${unit === 'kg' ? '#22c55e' : '#ef4444'}"/>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Target Fuel Load:</strong> ${reqKg.toLocaleString()} kg</div>
              <div><strong>Actual Mass in Tanks:</strong> ${Math.round(actualKg).toLocaleString()} kg</div>
              <div><strong>Fuel Deficit:</strong> ${deficitPercent.toFixed(1)}%</div>
              <div><strong>Available Flight Range:</strong> ${Math.round(maxRange)} / ${routeDistance} km</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box ${unit === 'kg' ? 'alert-tip' : 'alert-note'}" style="margin-top: 10px;">
              <strong>Dimensional Verification Verdict:</strong> ${unit === 'kg' ? 
                'Nominal Flight: Tanks contain 100% required fuel mass. Aircraft cruises smoothly at 41,000 ft directly to destination.' : 
                `CRITICAL EMERGENCY! Pumping 22,300 pounds loaded only 10,115 kg of fuel (a 54.6% deficit). Both Pratt & Whitney JT9D engines flame out mid-flight over Red Lake, Ontario. Pilots must deadstick glide to Gimli, Manitoba! This demonstrates why standard SI units are mandatory in engineering.`}
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        fuelSlider.addEventListener('input', () => update(state));
        selUnit.addEventListener('change', () => update(state));
        update(state);
    }
};

// 3. Multi-Variable Weather Prediction & Scientific Inquiries (sim-weather-prediction)
window.SIMS['sim-weather-prediction'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Formulating Scientific Inquiries: Atmospheric Weather Modeling</h3>
    <div class="sim-controls-top">
      <label>Relative Humidity (%):
        <input type="range" class="hum-slider form-range" min="30" max="100" value="85" step="1">
        <span class="hum-val">85%</span>
      </label>
      <label>Barometric Pressure Trend:
        <select class="sel-pressure form-select">
          <option value="rapid-drop" selected>Dropping Rapidly (-3 hPa/hr, Cold Front)</option>
          <option value="steady">Steady (1013 hPa, Fair Weather)</option>
          <option value="rising">Rising (+2 hPa/hr, High Pressure Ridge)</option>
        </select>
      </label>
      <label>Tropospheric Wind Speed:
        <input type="range" class="wind-slider form-range" min="5" max="60" value="35" step="5">
        <span class="wind-val">35 km/h</span>
      </label>
    </div>
  </div>
  <div class="sim-canvas-box">
    <svg class="sim-svg" viewBox="0 0 800 380" width="100%" height="320"></svg>
  </div>
  <div class="sim-controls-bar">
    <div class="btn-group">
      <button class="btn btn-sm btn-play">▶ Play</button>
      <button class="btn btn-sm btn-step">⏭ Step</button>
      <button class="btn btn-sm btn-reset">↺ Reset</button>
    </div>
    <input type="range" class="sim-scrubber form-range" min="0" max="10" step="0.05" value="0">
    <select class="sim-speed form-select">
      <option value="0.5">0.5×</option>
      <option value="1.0" selected>1.0×</option>
      <option value="2.0">2.0×</option>
    </select>
  </div>
  <div id="lab-readout" class="sim-readout"></div>
  <div id="lab-verdict" class="sim-verdict"></div>
</div>`;

        const humSlider = container.querySelector('.hum-slider');
        const humVal = container.querySelector('.hum-val');
        const selPress = container.querySelector('.sel-pressure');
        const windSlider = container.querySelector('.wind-slider');
        const windVal = container.querySelector('.wind-val');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const humidity = parseFloat(humSlider.value);
            const pTrend = selPress.value;
            const wind = parseFloat(windSlider.value);

            humVal.textContent = humidity + '%';
            windVal.textContent = wind + ' km/h';

            // Rain probability algorithm
            let rainProb = 0;
            if (humidity > 70) rainProb += (humidity - 70) * 2.5; // up to 75%
            if (pTrend === 'rapid-drop') rainProb += 25;
            else if (pTrend === 'rising') rainProb = Math.max(0, rainProb - 30);
            rainProb = Math.min(98, Math.max(5, Math.round(rainProb)));

            const rainDrops = [];
            if (rainProb > 50) {
                const count = Math.floor((rainProb / 100) * 35);
                for (let i = 0; i < count; i++) {
                    const rx = 150 + (i * 15 + state.time * 60) % 500;
                    const ry = 160 + (i * 18 + state.time * 120) % 150;
                    rainDrops.push({ x: rx, y: ry });
                }
            }

            let svgContent = `
            <rect width="800" height="380" fill="#0b1320" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              MEASURABLE METEOROLOGICAL INQUIRY: VARSHA & MEGHNA LAB
            </text>

            <!-- Sky Column -->
            <rect x="80" y="60" width="400" height="260" rx="8" fill="${rainProb > 60 ? '#1e293b' : '#0284c7'}" opacity="0.5"/>
            <line x1="80" y1="310" x2="480" y2="310" stroke="#22c55e" stroke-width="4"/>

            <!-- Clouds -->
            <g transform="translate(180, 100)">
              <circle cx="0" cy="0" r="35" fill="${rainProb > 60 ? '#475569' : '#e2e8f0'}"/>
              <circle cx="45" cy="-10" r="45" fill="${rainProb > 60 ? '#334155' : '#f8fafc'}"/>
              <circle cx="95" cy="0" r="40" fill="${rainProb > 60 ? '#475569' : '#e2e8f0'}"/>
              <circle cx="140" cy="5" r="30" fill="${rainProb > 60 ? '#334155' : '#f8fafc'}"/>
              <rect x="0" y="0" width="140" height="35" fill="${rainProb > 60 ? '#334155' : '#f8fafc'}"/>
            </g>`;

            // Draw rain drops
            rainDrops.forEach(d => {
                svgContent += `<line x1="${d.x}" y1="${d.y}" x2="${d.x - 3}" y2="${d.y + 12}" stroke="#38bdf8" stroke-width="2"/>`;
            });

            // Sensor Readout Dials in SVG
            svgContent += `
            <g transform="translate(520, 60)">
              <rect x="0" y="0" width="220" height="260" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1"/>
              <text x="110" y="28" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">EMPIRICAL SENSORS</text>
              
              <!-- Rain Probability Gauge -->
              <circle cx="110" cy="95" r="45" fill="none" stroke="#334155" stroke-width="8"/>
              <circle cx="110" cy="95" r="45" fill="none" 
                      stroke="${rainProb > 70 ? '#38bdf8' : (rainProb > 40 ? '#facc15' : '#22c55e')}" 
                      stroke-width="8" stroke-dasharray="283" stroke-dashoffset="${283 - (rainProb / 100) * 283}" stroke-linecap="round"/>
              <text x="110" y="102" fill="#f8fafc" font-size="20" font-weight="bold" text-anchor="middle">${rainProb}%</text>
              <text x="110" y="155" fill="#cbd5e1" font-size="11" text-anchor="middle">Precipitation Probability</text>

              <line x1="20" y1="170" x2="200" y2="170" stroke="#334155" stroke-width="1"/>
              
              <text x="20" y="195" fill="#94a3b8" font-size="11">Humidity: <tspan fill="#ffffff">${humidity}%</tspan></text>
              <text x="20" y="215" fill="#94a3b8" font-size="11">Barometer: <tspan fill="${pTrend === 'rapid-drop' ? '#f87171' : '#4ade80'}">${pTrend.replace('-', ' ').toUpperCase()}</tspan></text>
              <text x="20" y="235" fill="#94a3b8" font-size="11">Wind Speed: <tspan fill="#ffffff">${wind} km/h</tspan></text>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Relative Humidity:</strong> ${humidity}%</div>
              <div><strong>Barometric Tendency:</strong> ${pTrend}</div>
              <div><strong>Upper Wind Speed:</strong> ${wind} km/h</div>
              <div><strong>Rainfall Likelihood:</strong> ${rainProb}%</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box ${rainProb > 65 ? 'alert-note' : 'alert-tip'}" style="margin-top: 10px;">
              <strong>Scientific Inquiry Principle:</strong> Meghna's approach replaces subjective phrases ('clouds look dark') with four 
              verifiable metrics: relative humidity, barometric pressure drop rate, ambient wind vector, and dew point approach. 
              ${rainProb > 65 ? 'Sustained high humidity combined with rapid barometric drop predicts imminent precipitation with high statistical confidence.' : 'Current atmospheric sensors indicate stable air masses; rainfall remains unlikely despite localized cloud cover.'}
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        humSlider.addEventListener('input', () => update(state));
        selPress.addEventListener('change', () => update(state));
        windSlider.addEventListener('input', () => update(state));
        update(state);
    }
};

// 4. Fermi Estimation Workshop (sim-fermi-estimation)
window.SIMS['sim-fermi-estimation'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>The Art of Fermi Estimation: Respiratory Volume & Household Sanity Checks</h3>
    <div class="sim-controls-top">
      <label>Breathing Rate (breaths/min):
        <input type="range" class="rate-slider form-range" min="8" max="25" value="14" step="1">
        <span class="rate-val">14 breaths/min</span>
      </label>
      <label>Tidal Volume per Breath (L):
        <input type="range" class="vol-slider form-range" min="0.3" max="0.8" value="0.5" step="0.05">
        <span class="vol-val">0.50 L</span>
      </label>
      <label>Household Members:
        <input type="range" class="family-slider form-range" min="1" max="8" value="4" step="1">
        <span class="family-val">4 Persons</span>
      </label>
    </div>
  </div>
  <div class="sim-canvas-box">
    <svg class="sim-svg" viewBox="0 0 800 380" width="100%" height="320"></svg>
  </div>
  <div class="sim-controls-bar">
    <div class="btn-group">
      <button class="btn btn-sm btn-play">▶ Play</button>
      <button class="btn btn-sm btn-step">⏭ Step</button>
      <button class="btn btn-sm btn-reset">↺ Reset</button>
    </div>
    <input type="range" class="sim-scrubber form-range" min="0" max="10" step="0.05" value="0">
    <select class="sim-speed form-select">
      <option value="0.5">0.5×</option>
      <option value="1.0" selected>1.0×</option>
      <option value="2.0">2.0×</option>
    </select>
  </div>
  <div id="lab-readout" class="sim-readout"></div>
  <div id="lab-verdict" class="sim-verdict"></div>
</div>`;

        const rateSlider = container.querySelector('.rate-slider');
        const rateVal = container.querySelector('.rate-val');
        const volSlider = container.querySelector('.vol-slider');
        const volVal = container.querySelector('.vol-val');
        const familySlider = container.querySelector('.family-slider');
        const familyVal = container.querySelector('.family-val');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const rate = parseFloat(rateSlider.value);
            const tidal = parseFloat(volSlider.value);
            const members = parseInt(familySlider.value, 10);

            rateVal.textContent = rate + ' breaths/min';
            volVal.textContent = tidal.toFixed(2) + ' L';
            familyVal.textContent = members + ' Persons';

            // Daily calculations
            const minPerDay = 1440;
            const dailyBreaths = Math.round(rate * minPerDay);
            const dailyLitres = Math.round(dailyBreaths * tidal);

            // Balloon equivalents (1 balloon = 2 litres)
            const balloonsPerDay = Math.round(dailyLitres / 2.0);

            // Family monthly rice estimation (assume 2,200 kcal/person/day, 100g raw rice = 350 kcal, 50% calories from rice)
            const dailyKcal = members * 2200;
            const riceKcal = dailyKcal * 0.50;
            const dailyRiceGrams = (riceKcal / 350) * 100;
            const monthlyRiceKg = Math.round((dailyRiceGrams * 30) / 1000);

            const pulse = Math.sin(state.time * (rate / 3.0)) * 5;

            let svgContent = `
            <rect width="800" height="380" fill="#080e18" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              FERMI ESTIMATION WORKSHOP: RESPIRATORY VOLUME & HOUSEHOLD CALORIES
            </text>

            <!-- Lungs & Breathing Visual -->
            <g transform="translate(180, 180)">
              <!-- Trachea -->
              <rect x="-8" y="-100" width="16" height="40" fill="#38bdf8" rx="4"/>
              <!-- Lungs -->
              <ellipse cx="-45" cy="-20" rx="${40 + pulse}" ry="${55 + pulse * 1.2}" fill="#0284c7" opacity="0.8"/>
              <ellipse cx="45" cy="-20" rx="${40 + pulse}" ry="${55 + pulse * 1.2}" fill="#0284c7" opacity="0.8"/>
              
              <!-- 2-Litre Balloon Indicator -->
              <g transform="translate(0, 70)">
                <ellipse cx="0" cy="0" rx="${22 + pulse * 0.4}" ry="${28 + pulse * 0.5}" fill="#ec4899" stroke="#f472b6" stroke-width="2"/>
                <polygon points="0,28 -5,36 5,36" fill="#be185d"/>
                <text x="0" y="52" fill="#f472b6" font-size="11" text-anchor="middle">1 Party Balloon &approx; 2 Litres</text>
              </g>

              <text x="0" y="-120" fill="#93c5fd" font-size="12" font-weight="bold" text-anchor="middle">
                ${rate} breaths/min &times; ${tidal.toFixed(2)} L/breath
              </text>
            </g>

            <!-- Fermi Arithmetic Ledger -->
            <g transform="translate(420, 70)">
              <rect x="0" y="0" width="330" height="240" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1"/>
              <text x="20" y="30" fill="#facc15" font-size="14" font-weight="bold">Fermi Step-by-Step Ledger:</text>

              <line x1="20" y1="45" x2="310" y2="45" stroke="#334155" stroke-width="1"/>

              <text x="20" y="70" fill="#cbd5e1" font-size="12">Minutes in 1 Day: <tspan fill="#ffffff" font-weight="bold">1,440 min</tspan></text>
              <text x="20" y="95" fill="#cbd5e1" font-size="12">Daily Breath Count: <tspan fill="#38bdf8" font-weight="bold">${dailyBreaths.toLocaleString()} breaths</tspan></text>
              <text x="20" y="120" fill="#cbd5e1" font-size="12">Daily Air Inhaled: <tspan fill="#4ade80" font-weight="bold">${dailyLitres.toLocaleString()} Litres/day</tspan></text>
              <text x="20" y="145" fill="#cbd5e1" font-size="12">Balloon Equivalent: <tspan fill="#ec4899" font-weight="bold">~${balloonsPerDay.toLocaleString()} party balloons</tspan></text>
              
              <line x1="20" y1="160" x2="310" y2="160" stroke="#334155" stroke-width="1"/>
              
              <text x="20" y="185" fill="#facc15" font-size="12" font-weight="bold">Family Rice Requirement (Month):</text>
              <text x="20" y="210" fill="#cbd5e1" font-size="12">${members} Persons &times; 2,200 kcal &rarr; <tspan fill="#ffffff" font-weight="bold">~${monthlyRiceKg} kg of dry rice/month</tspan></text>
              <text x="20" y="230" fill="#94a3b8" font-size="10">Order of magnitude: 10&sup1; kg (not 1 kg, not 1,000 kg!)</text>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Daily Inhaled Volume:</strong> ${dailyLitres.toLocaleString()} L</div>
              <div><strong>Order of Magnitude:</strong> 10⁴ Litres</div>
              <div><strong>Balloon Equivalence:</strong> ${balloonsPerDay.toLocaleString()} balloons</div>
              <div><strong>Monthly Rice Mass:</strong> ${monthlyRiceKg} kg (${members} pers.)</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-tip" style="margin-top: 10px;">
              <strong>Fermi Reasoning Sanity Check:</strong> The estimated respiratory volume of ~10,000 litres of air per day 
              equals about 10 cubic metres of air (the volume of an entire small bedroom). A calculation giving 10 L is clearly too small, 
              while 1,000,000 L is physically absurd. Fermi estimation builds intuition, catches errors, and develops critical confidence!
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        rateSlider.addEventListener('input', () => update(state));
        volSlider.addEventListener('input', () => update(state));
        familySlider.addEventListener('input', () => update(state));
        update(state);
    }
};

// 5. Interdisciplinary Science: Multi-Physics of the N95 Mask (sim-n95-filtration)
window.SIMS['sim-n95-filtration'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Interdisciplinary Science: Multi-Physics Aerosol Filtration in N95 Masks</h3>
    <div class="sim-controls-top">
      <label>Particle Size (μm):
        <input type="range" class="size-slider form-range" min="0.02" max="2.5" value="0.30" step="0.02">
        <span class="size-val">0.30 μm (MPPS)</span>
      </label>
      <label>Electrostatic Electret Charge:
        <select class="sel-charge form-select">
          <option value="active" selected>Active Electret Field (N95 Certified)</option>
          <option value="discharged">Discharged (Uncharged Simple Cloth Mesh)</option>
        </select>
      </label>
    </div>
  </div>
  <div class="sim-canvas-box">
    <svg class="sim-svg" viewBox="0 0 800 380" width="100%" height="320"></svg>
  </div>
  <div class="sim-controls-bar">
    <div class="btn-group">
      <button class="btn btn-sm btn-play">▶ Play</button>
      <button class="btn btn-sm btn-step">⏭ Step</button>
      <button class="btn btn-sm btn-reset">↺ Reset</button>
    </div>
    <input type="range" class="sim-scrubber form-range" min="0" max="10" step="0.05" value="0">
    <select class="sim-speed form-select">
      <option value="0.5">0.5×</option>
      <option value="1.0" selected>1.0×</option>
      <option value="2.0">2.0×</option>
    </select>
  </div>
  <div id="lab-readout" class="sim-readout"></div>
  <div id="lab-verdict" class="sim-verdict"></div>
</div>`;

        const sizeSlider = container.querySelector('.size-slider');
        const sizeVal = container.querySelector('.size-val');
        const selCharge = container.querySelector('.sel-charge');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const dp = parseFloat(sizeSlider.value);
            const isCharged = selCharge.value === 'active';
            sizeVal.textContent = dp.toFixed(2) + ' μm' + (Math.abs(dp - 0.3) < 0.05 ? ' (MPPS)' : '');

            // Theoretical N95 U-shaped curve calculations
            // Diffusion efficiency ~ 1 / sqrt(dp)
            const diffEff = Math.min(0.999, 0.20 / Math.sqrt(dp));
            // Inertial impaction & interception ~ dp^1.5
            const impEff = Math.min(0.999, Math.pow(dp / 1.8, 1.5));
            // Mechanical penetration
            const mechPen = (1 - diffEff) * (1 - impEff);
            // Electrostatic efficiency boost
            const electroBoost = isCharged ? 0.88 : 0.0;

            const totalPenetration = mechPen * (1 - electroBoost);
            const totalEfficiency = Math.max(10, Math.min(99.9, (1 - totalPenetration) * 100));

            // Dominant mechanism
            let dominant = 'Brownian Diffusion';
            if (dp > 0.8) dominant = 'Inertial Impaction';
            else if (dp > 0.25 && dp < 0.6) dominant = isCharged ? 'Electrostatic Attraction' : 'Interception (Weakest Point)';

            let svgContent = `
            <rect width="800" height="380" fill="#080f1e" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              MULTI-DISCIPLINARY FILTRATION: BROWNIAN DIFFUSION, IMPACTION & ELECTRET CHARGE
            </text>

            <!-- Microscopic Fiber Mesh Chamber -->
            <g transform="translate(60, 60)">
              <rect x="0" y="0" width="380" height="260" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
              <text x="15" y="24" fill="#38bdf8" font-size="11" font-weight="bold">Microscopic Non-Woven Polypropylene Web</text>

              <!-- Polypropylene Microfibers (~3 μm diameter) -->
              <line x1="120" y1="20" x2="140" y2="240" stroke="#64748b" stroke-width="14" stroke-linecap="round"/>
              <line x1="220" y1="20" x2="190" y2="240" stroke="#64748b" stroke-width="16" stroke-linecap="round"/>
              <line x1="300" y1="40" x2="320" y2="220" stroke="#64748b" stroke-width="12" stroke-linecap="round"/>

              ${isCharged ? `
              <!-- Electrostatic Field Lines -->
              <line x1="120" y1="50" x2="140" y2="50" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="2,2"/>
              <line x1="125" y1="120" x2="145" y2="120" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="2,2"/>
              <line x1="205" y1="80" x2="225" y2="80" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="2,2"/>
              <text x="210" y="45" fill="#f472b6" font-size="10" font-weight="bold">+ - Electret Field</text>` : ''}

              <!-- Particle Flow Simulation -->`;
            
            // Draw particles based on size
            const pCount = 12;
            for (let i = 0; i < pCount; i++) {
                const startY = 50 + i * 18;
                const progress = (state.time * 20 + i * 30) % 360;
                let px = 20 + progress;
                let py = startY;

                // Brownian zigzag for small particles
                if (dp < 0.2) {
                    py += Math.sin(progress * 0.2 + i) * 12;
                }
                // Deflection or capture
                const isCaptured = (px > 120 && px < 160 && Math.abs(py - 120) < 40) ||
                                   (px > 190 && px < 230 && Math.abs(py - 140) < 50) ||
                                   (isCharged && px > 100 && px < 280 && (i % 3 === 0));

                if (isCaptured && px > 140) {
                    px = 135; // stuck on fiber
                }

                const r = Math.max(2, Math.min(8, dp * 4));
                svgContent += `<circle cx="${px}" cy="${py}" r="${r}" fill="${isCaptured ? '#22c55e' : (dp < 0.15 ? '#38bdf8' : '#f59e0b')}"/>`;
            }

            svgContent += `</g>

            <!-- Efficiency Curve Box -->
            <g transform="translate(470, 60)">
              <rect x="0" y="0" width="280" height="260" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1"/>
              <text x="140" y="28" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">FILTRATION EFFICIENCY</text>
              
              <!-- Big Percentage Gauge -->
              <circle cx="140" cy="95" r="45" fill="none" stroke="#334155" stroke-width="8"/>
              <circle cx="140" cy="95" r="45" fill="none" 
                      stroke="${totalEfficiency >= 95 ? '#22c55e' : (totalEfficiency >= 70 ? '#facc15' : '#ef4444')}" 
                      stroke-width="8" stroke-dasharray="283" stroke-dashoffset="${283 - (totalEfficiency / 100) * 283}" stroke-linecap="round"/>
              <text x="140" y="102" fill="#f8fafc" font-size="20" font-weight="bold" text-anchor="middle">${totalEfficiency.toFixed(1)}%</text>

              <text x="140" y="155" fill="${totalEfficiency >= 95 ? '#4ade80' : '#f87171'}" font-size="12" font-weight="bold" text-anchor="middle">
                ${totalEfficiency >= 95 ? 'N95 Certified Standard (≥95%)' : 'Below Surgical Mask Threshold'}
              </text>

              <line x1="20" y1="170" x2="260" y2="170" stroke="#334155" stroke-width="1"/>

              <text x="20" y="195" fill="#cbd5e1" font-size="11">Particle Diameter: <tspan fill="#facc15" font-weight="bold">${dp.toFixed(2)} μm</tspan></text>
              <text x="20" y="215" fill="#cbd5e1" font-size="11">Dominant Physics: <tspan fill="#38bdf8">${dominant}</tspan></text>
              <text x="20" y="235" fill="#cbd5e1" font-size="11">Electret Charge: <tspan fill="${isCharged ? '#4ade80' : '#f87171'}">${isCharged ? 'Active (Electrostatic)' : 'Discharged'}</tspan></text>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Aerosol Diameter:</strong> ${dp.toFixed(2)} μm</div>
              <div><strong>Filtration Score:</strong> ${totalEfficiency.toFixed(1)}%</div>
              <div><strong>Dominant Capture:</strong> ${dominant}</div>
              <div><strong>Electret State:</strong> ${isCharged ? 'Charged' : 'Discharged'}</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box ${totalEfficiency >= 95 ? 'alert-tip' : 'alert-note'}" style="margin-top: 10px;">
              <strong>Interdisciplinary Verdict:</strong> An N95 respirator is not a mechanical sieve. It synthesizes 
              <strong>Physics</strong> (Brownian diffusion of nanoparticles + inertial impaction of heavy droplets + electret Coulomb capture), 
              <strong>Chemistry</strong> (melt-blown non-woven polypropylene polymer fibers), and 
              <strong>Biology</strong> (aerosol virus droplet dynamics). Electrostatic charge provides the critical boost capturing 0.3 μm particles!
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        sizeSlider.addEventListener('input', () => update(state));
        selCharge.addEventListener('change', () => update(state));
        update(state);
    }
};
