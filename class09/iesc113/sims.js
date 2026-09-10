// Chapter 13: Earth as a System: Energy, Matter, and Life - Interactive Simulation Suite
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

// 1. Earth's Four Spheres & Feedback Cascades (sim-earth-spheres)
window.SIMS['sim-earth-spheres'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Earth's Four Spheres & Systemic Disturbance Cascades</h3>
    <div class="sim-controls-top">
      <label>Trigger Disturbance:
        <select class="sel-event form-select">
          <option value="none" selected>Stable Planetary Equilibrium</option>
          <option value="volcano">Lithospheric Volcanic Eruption (SO2 & Ash)</option>
          <option value="deforestation">Biospheric Tropical Deforestation</option>
          <option value="fossil">Anthropogenic Fossil Carbon Injection</option>
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

        const selEv = container.querySelector('.sel-event');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const ev = selEv.value;
            const pulse = Math.sin(state.time * 2.5) * 4;

            // Sphere health metrics
            let atmoHealth = 95;
            let hydroHealth = 95;
            let lithoHealth = 95;
            let bioHealth = 95;
            let cascadeDesc = 'All four spheres maintain balanced biogeochemical fluxes.';

            if (ev === 'volcano') {
                atmoHealth = 60; // aerosol veil
                hydroHealth = 80; // altered monsoon rainfall
                lithoHealth = 70; // magmatic venting
                bioHealth = 75; // reduced photosynthesis
                cascadeDesc = 'Lithospheric eruption injects SO2 into Atmosphere, cooling global climate and disrupting Hydrosphere monsoons and Biosphere agriculture.';
            } else if (ev === 'deforestation') {
                atmoHealth = 75; // reduced moisture, higher CO2
                hydroHealth = 70; // disrupted transpiration & watershed runoff
                lithoHealth = 65; // massive topsoil erosion
                bioHealth = 50; // severe habitat & biodiversity collapse
                cascadeDesc = 'Biosphere tree clearing eliminates transpiration, accelerating Lithospheric soil erosion and disrupting atmospheric moisture recycling.';
            } else if (ev === 'fossil') {
                atmoHealth = 55; // 425 ppm CO2, radiative forcing
                hydroHealth = 60; // ocean acidification & thermal expansion
                lithoHealth = 85; // mineral depletion
                bioHealth = 65; // coral bleaching & phenological mismatch
                cascadeDesc = 'Combustion of Lithospheric fossil carbon floods Atmosphere with CO2, driving Hydrosphere ocean acidification and warming Biosphere biomes.';
            }

            let svgContent = `
            <rect width="800" height="380" fill="#09131d" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              PLANETARY DYNAMICS: THE FOUR INTERCONNECTED SPHERES
            </text>

            <!-- Network Connections -->
            <g stroke="#334155" stroke-width="2">
              <line x1="220" y1="120" x2="580" y2="120"/>
              <line x1="220" y1="120" x2="220" y2="280"/>
              <line x1="580" y1="120" x2="580" y2="280"/>
              <line x1="220" y1="280" x2="580" y2="280"/>
              <line x1="220" y1="120" x2="580" y2="280" stroke-dasharray="4,4"/>
              <line x1="580" y1="120" x2="220" y2="280" stroke-dasharray="4,4"/>
            </g>

            <!-- Sphere 1: Atmosphere (Top-Left) -->
            <g transform="translate(220, 120)">
              <circle cx="0" cy="0" r="${50 + (ev === 'volcano' || ev === 'fossil' ? pulse : 0)}" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/>
              <text x="0" y="-8" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">ATMOSPHERE</text>
              <text x="0" y="12" fill="#bae6fd" font-size="10" text-anchor="middle">Gaseous Envelope</text>
              <text x="0" y="28" fill="#fef08a" font-size="10" font-weight="bold" text-anchor="middle">${atmoHealth}% Index</text>
            </g>

            <!-- Sphere 2: Hydrosphere (Top-Right) -->
            <g transform="translate(580, 120)">
              <circle cx="0" cy="0" r="${50 + (ev === 'fossil' || ev === 'volcano' ? pulse : 0)}" fill="#1d4ed8" stroke="#60a5fa" stroke-width="3"/>
              <text x="0" y="-8" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">HYDROSPHERE</text>
              <text x="0" y="12" fill="#bfdbfe" font-size="10" text-anchor="middle">Oceans & Waters</text>
              <text x="0" y="28" fill="#fef08a" font-size="10" font-weight="bold" text-anchor="middle">${hydroHealth}% Index</text>
            </g>

            <!-- Sphere 3: Lithosphere (Bottom-Left) -->
            <g transform="translate(220, 280)">
              <circle cx="0" cy="0" r="${50 + (ev === 'volcano' || ev === 'deforestation' ? pulse : 0)}" fill="#78350f" stroke="#d97706" stroke-width="3"/>
              <text x="0" y="-8" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">LITHOSPHERE</text>
              <text x="0" y="12" fill="#fde68a" font-size="10" text-anchor="middle">Crust & Rocks</text>
              <text x="0" y="28" fill="#fef08a" font-size="10" font-weight="bold" text-anchor="middle">${lithoHealth}% Index</text>
            </g>

            <!-- Sphere 4: Biosphere (Bottom-Right) -->
            <g transform="translate(580, 280)">
              <circle cx="0" cy="0" r="${50 + (ev === 'deforestation' || ev === 'fossil' ? pulse : 0)}" fill="#15803d" stroke="#4ade80" stroke-width="3"/>
              <text x="0" y="-8" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">BIOSPHERE</text>
              <text x="0" y="12" fill="#bbf7d0" font-size="10" text-anchor="middle">Living Realm</text>
              <text x="0" y="28" fill="#fef08a" font-size="10" font-weight="bold" text-anchor="middle">${bioHealth}% Index</text>
            </g>

            <!-- Central Core Hub -->
            <circle cx="400" cy="200" r="28" fill="#0f172a" stroke="#e2e8f0" stroke-width="2"/>
            <text x="400" y="204" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">ENERGY & MATTER FLUX</text>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Atmosphere Health:</strong> ${atmoHealth}%</div>
              <div><strong>Hydrosphere Health:</strong> ${hydroHealth}%</div>
              <div><strong>Lithosphere Health:</strong> ${lithoHealth}%</div>
              <div><strong>Biosphere Health:</strong> ${bioHealth}%</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-note" style="margin-top: 10px;">
              <strong>Earth System Science Law:</strong> ${cascadeDesc} Earth operates as a single thermodynamic super-system; 
              a disruption originating in any one sphere propagates non-linear feedback adjustments across all others.
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        selEv.addEventListener('change', () => update(state));
        update(state);
    }
};

// 2. Solar Insolation & Land vs Water Specific Heat (sim-differential-heating)
window.SIMS['sim-differential-heating'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Activity 13.2: Differential Heating of Land vs Water</h3>
    <div class="sim-controls-top">
      <label>Solar Illumination:
        <select class="sel-sun form-select">
          <option value="day" selected>Daytime Solar Insolation (Heating Phase)</option>
          <option value="night">Nighttime Radiative Cooling (Darkness Phase)</option>
        </select>
      </label>
      <label>Latitude Angle:
        <input type="range" class="lat-slider form-range" min="0" max="80" value="20" step="5">
        <span class="lat-val">20° (Tropical / Subtropical)</span>
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

        const selSun = container.querySelector('.sel-sun');
        const latSlider = container.querySelector('.lat-slider');
        const latVal = container.querySelector('.lat-val');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const isDay = selSun.value === 'day';
            const lat = parseFloat(latSlider.value);
            latVal.textContent = lat + '° (' + (lat < 25 ? 'Equatorial/Tropical' : (lat < 55 ? 'Temperate' : 'Subpolar')) + ')';

            // Solar flux based on latitude: cos(lat)
            const cosLat = Math.cos(lat * Math.PI / 180);
            const solarFlux = cosLat * (isDay ? 1.0 : 0.0);

            // Temperatures: Sand has low specific heat (c=800), water has high specific heat (c=4184)
            // Progress over 10s timeline
            const tFrac = state.time / 10.0;
            let tempSand = 22.0;
            let tempWater = 22.0;

            if (isDay) {
                // Sand heats fast
                tempSand = 22.0 + (32.0 * solarFlux * (1 - Math.exp(-tFrac * 3.0)));
                // Water heats slow
                tempWater = 22.0 + (9.0 * solarFlux * (1 - Math.exp(-tFrac * 0.8)));
            } else {
                // Night cooling
                tempSand = 48.0 * Math.exp(-tFrac * 2.0) + 16.0;
                tempWater = 28.0 * Math.exp(-tFrac * 0.4) + 16.0;
            }

            // Cap ranges
            tempSand = Math.max(16, Math.min(55, tempSand));
            tempWater = Math.max(16, Math.min(32, tempWater));

            let svgContent = `
            <rect width="800" height="380" fill="#080e18" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              SPECIFIC HEAT & THERMAL INERTIA: DRY SAND VS LIQUID WATER
            </text>

            <!-- Solar Lamp / Night Sky -->
            <g transform="translate(400, 70)">
              ${isDay ? `
              <circle cx="0" cy="0" r="24" fill="#f59e0b" stroke="#fef08a" stroke-width="3"/>
              <!-- Rays pointing down -->
              <line x1="-120" y1="20" x2="-160" y2="90" stroke="#facc15" stroke-width="2" stroke-dasharray="4,3"/>
              <line x1="0" y1="28" x2="0" y2="100" stroke="#facc15" stroke-width="2" stroke-dasharray="4,3"/>
              <line x1="120" y1="20" x2="160" y2="90" stroke="#facc15" stroke-width="2" stroke-dasharray="4,3"/>
              <text x="0" y="-32" fill="#fef08a" font-size="12" font-weight="bold" text-anchor="middle">Solar Insolation: ${(cosLat * 100).toFixed(0)}% Intensity</text>` : `
              <circle cx="0" cy="0" r="18" fill="#38bdf8" opacity="0.6"/>
              <text x="0" y="-30" fill="#93c5fd" font-size="12" font-weight="bold" text-anchor="middle">Nocturnal Radiative Cooling Phase</text>`}
            </g>

            <!-- Beaker A: Dry Sand (Left) -->
            <g transform="translate(200, 200)">
              <!-- Glass Beaker -->
              <rect x="-60" y="0" width="120" height="120" rx="4" fill="none" stroke="#64748b" stroke-width="3"/>
              <!-- Sand Material -->
              <rect x="-56" y="20" width="112" height="96" rx="2" fill="#b45309" opacity="0.9"/>
              <!-- Thermometer Probe -->
              <rect x="-6" y="-50" width="12" height="130" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
              <rect x="-3" y="${80 - (tempSand / 60) * 120}" width="6" height="${(tempSand / 60) * 120}" fill="#ef4444" rx="2"/>
              <circle cx="0" cy="85" r="8" fill="#dc2626"/>

              <text x="0" y="140" fill="#facc15" font-size="14" font-weight="bold" text-anchor="middle">Dry Sand (Land)</text>
              <text x="0" y="160" fill="#cbd5e1" font-size="12" text-anchor="middle">c = 800 J/(kg&middot;K)</text>
              <text x="0" y="-60" fill="#ef4444" font-size="16" font-weight="bold" text-anchor="middle">${tempSand.toFixed(1)}°C</text>
            </g>

            <!-- Beaker B: Liquid Water (Right) -->
            <g transform="translate(600, 200)">
              <!-- Glass Beaker -->
              <rect x="-60" y="0" width="120" height="120" rx="4" fill="none" stroke="#64748b" stroke-width="3"/>
              <!-- Water Material -->
              <rect x="-56" y="20" width="112" height="96" rx="2" fill="#0284c7" opacity="0.8"/>
              <!-- Thermometer Probe -->
              <rect x="-6" y="-50" width="12" height="130" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
              <rect x="-3" y="${80 - (tempWater / 60) * 120}" width="6" height="${(tempWater / 60) * 120}" fill="#3b82f6" rx="2"/>
              <circle cx="0" cy="85" r="8" fill="#2563eb"/>

              <text x="0" y="140" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">Water (Ocean)</text>
              <text x="0" y="160" fill="#cbd5e1" font-size="12" text-anchor="middle">c = 4,184 J/(kg&middot;K)</text>
              <text x="0" y="-60" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">${tempWater.toFixed(1)}°C</text>
            </g>`;

            svg.innerHTML = svgContent;

            const deltaT = Math.abs(tempSand - tempWater);

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Sand Temperature:</strong> ${tempSand.toFixed(1)}°C</div>
              <div><strong>Water Temperature:</strong> ${tempWater.toFixed(1)}°C</div>
              <div><strong>Thermal Contrast (ΔT):</strong> ${deltaT.toFixed(1)}°C</div>
              <div><strong>Heat Capacity Ratio:</strong> 5.23× (Water/Sand)</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-tip" style="margin-top: 10px;">
              <strong>Thermal Dynamics Verdict:</strong> Water's immense specific heat capacity ($c_w \approx 4184\text{ J/kg}\cdot\text{K}$) 
              prevents rapid temperature swings. On sunny days, coastal land becomes substantially warmer than the sea, while at night, 
              land cools down much faster than the ocean. This continuous temperature differential drives local coastal breezes and moderates maritime climates.
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        selSun.addEventListener('change', () => update(state));
        latSlider.addEventListener('input', () => update(state));
        update(state);
    }
};

// 3. Local Sea/Land Breezes & Planetary Winds (sim-atmospheric-winds)
window.SIMS['sim-atmospheric-winds'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Atmospheric Convection: Coastal Diurnal Breezes & Global Wind Belts</h3>
    <div class="sim-controls-top">
      <label>Atmospheric System:
        <select class="sel-windmode form-select">
          <option value="sea-breeze" selected>Local: Daytime Sea Breeze (Onshore Flow)</option>
          <option value="land-breeze">Local: Nighttime Land Breeze (Offshore Flow)</option>
          <option value="planetary">Global: Planetary Wind Cells & Coriolis Deflection</option>
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

        const selMode = container.querySelector('.sel-windmode');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const mode = selMode.value;
            const flowOffset = (state.time * 40) % 200;

            let svgContent = `
            <rect width="800" height="380" fill="#080f1e" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              ${mode === 'planetary' ? 'GLOBAL PLANETARY WIND BELTS & CORIOLIS CONVECTION' : (mode === 'sea-breeze' ? 'LOCAL DAYTIME SEA BREEZE (ONSHORE CONVECTION)' : 'LOCAL NIGHTTIME LAND BREEZE (OFFSHORE CONVECTION)')}
            </text>`;

            if (mode === 'planetary') {
                // Planetary globe view
                svgContent += `
                <g transform="translate(400, 200)">
                  <!-- Earth Globe Sphere -->
                  <circle cx="0" cy="0" r="130" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                  <!-- Latitude lines -->
                  <line x1="-130" y1="0" x2="130" y2="0" stroke="#facc15" stroke-width="1.5" stroke-dasharray="4,3"/>
                  <text x="140" y="4" fill="#facc15" font-size="10">Equator (0° ITCZ)</text>
                  <line x1="-115" y1="-65" x2="115" y2="-65" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>
                  <text x="125" y="-62" fill="#94a3b8" font-size="9">30°N (Subtropical High)</text>
                  <line x1="-115" y1="65" x2="115" y2="65" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>
                  <text x="125" y="68" fill="#94a3b8" font-size="9">30°S (Subtropical High)</text>

                  <!-- Trade Winds (NE in North, SE in South) -->
                  <path d="M 60,-45 L 20,-10" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow)"/>
                  <path d="M 0,-45 L -40,-10" stroke="#38bdf8" stroke-width="2.5"/>
                  <path d="M -60,-45 L -100,-10" stroke="#38bdf8" stroke-width="2.5"/>
                  <text x="-40" y="-25" fill="#38bdf8" font-size="11" font-weight="bold">NE Trade Winds</text>

                  <path d="M 60,45 L 20,10" stroke="#38bdf8" stroke-width="2.5"/>
                  <path d="M 0,45 L -40,10" stroke="#38bdf8" stroke-width="2.5"/>
                  <text x="-40" y="32" fill="#38bdf8" font-size="11" font-weight="bold">SE Trade Winds</text>

                  <!-- Westerlies (SW in North) -->
                  <path d="M -80,-85 L -30,-115" stroke="#4ade80" stroke-width="2.5"/>
                  <text x="-10" y="-95" fill="#4ade80" font-size="10" font-weight="bold">Westerlies</text>
                </g>`;
            } else {
                const isSea = mode === 'sea-breeze';
                svgContent += `
                <!-- Coastal Landscape -->
                <!-- Sea on Left, Land on Right -->
                <rect x="50" y="240" width="350" height="80" fill="#0284c7" rx="2"/>
                <text x="220" y="280" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">OCEAN (Sea)</text>

                <rect x="400" y="240" width="350" height="80" fill="#78350f" rx="2"/>
                <text x="580" y="280" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">COASTAL LAND</text>

                <!-- Pressure tags -->
                ${isSea ? `
                <!-- Sea Breeze: Sea is High, Land is Low -->
                <rect x="180" y="205" width="80" height="26" rx="4" fill="#1e3a8a"/>
                <text x="220" y="222" fill="#93c5fd" font-size="12" font-weight="bold" text-anchor="middle">HIGH (H)</text>

                <rect x="540" y="205" width="80" height="26" rx="4" fill="#991b1b"/>
                <text x="580" y="222" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">LOW (L)</text>

                <!-- Convective Loop Arrows (Counter-Clockwise) -->
                <!-- Low-level onshore flow (Sea -> Land) -->
                <line x1="280" y1="218" x2="520" y2="218" stroke="#38bdf8" stroke-width="4"/>
                <polygon points="530,218 515,212 515,224" fill="#38bdf8"/>
                <text x="400" y="210" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Cool Sea Breeze (Onshore)</text>

                <!-- Vertical Thermal Ascending over Land -->
                <line x1="620" y1="200" x2="620" y2="110" stroke="#f87171" stroke-width="4"/>
                <polygon points="620,100 614,115 626,115" fill="#f87171"/>
                <text x="670" y="150" fill="#f87171" font-size="11">Warm Air Ascends</text>

                <!-- Upper return flow -->
                <line x1="580" y1="100" x2="220" y2="100" stroke="#64748b" stroke-width="3" stroke-dasharray="6,4"/>
                <polygon points="210,100 225,95 225,105" fill="#64748b"/>

                <!-- Sinking cold air over sea -->
                <line x1="180" y1="110" x2="180" y2="195" stroke="#3b82f6" stroke-width="3"/>
                <polygon points="180,205 174,190 186,190" fill="#3b82f6"/>` : `
                <!-- Land Breeze: Land is High, Sea is Low -->
                <rect x="180" y="205" width="80" height="26" rx="4" fill="#991b1b"/>
                <text x="220" y="222" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">LOW (L)</text>

                <rect x="540" y="205" width="80" height="26" rx="4" fill="#1e3a8a"/>
                <text x="580" y="222" fill="#93c5fd" font-size="12" font-weight="bold" text-anchor="middle">HIGH (H)</text>

                <!-- Low-level offshore flow (Land -> Sea) -->
                <line x1="520" y1="218" x2="280" y2="218" stroke="#38bdf8" stroke-width="4"/>
                <polygon points="270,218 285,212 285,224" fill="#38bdf8"/>
                <text x="400" y="210" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Cool Land Breeze (Offshore)</text>

                <!-- Vertical Ascending over warmer Sea -->
                <line x1="180" y1="200" x2="180" y2="110" stroke="#f87171" stroke-width="4"/>
                <polygon points="180,100 174,115 186,115" fill="#f87171"/>`}
                `;
            }

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>System Mode:</strong> ${mode.replace('-', ' ').toUpperCase()}</div>
              <div><strong>Driving Gradient:</strong> Thermal Convection</div>
              <div><strong>Flow Direction:</strong> ${mode === 'sea-breeze' ? 'Sea &rarr; Land (Onshore)' : (mode === 'land-breeze' ? 'Land &rarr; Sea (Offshore)' : 'Equatorward / Poleward')}</div>
              <div><strong>Coriolis Factor:</strong> ${mode === 'planetary' ? 'Right (NH) / Left (SH)' : 'Localized Scale (negligible)'}</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-tip" style="margin-top: 10px;">
              <strong>Convective Wind Law:</strong> Air invariably displaces horizontally from high-pressure zones toward low-pressure thermal deficits. 
              ${mode === 'planetary' ? 'On a rotating Earth, three large-scale atmospheric cells (Hadley, Ferrel, Polar) combined with Coriolis deflection produce predictable global wind belts that navigated merchant ships for centuries.' : 'Differential heating reverses pressure gradients twice every 24 hours, generating the sea breeze by day and land breeze by night.'}
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        selMode.addEventListener('change', () => update(state));
        update(state);
    }
};

// 4. Thermohaline Conveyor Belt (sim-thermohaline-conveyor)
window.SIMS['sim-thermohaline-conveyor'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>The Global Ocean Conveyor Belt (Thermohaline AMOC Circulation)</h3>
    <div class="sim-controls-top">
      <label>North Atlantic Water Temp (°C):
        <input type="range" class="temp-slider form-range" min="-1" max="10" value="2" step="0.5">
        <span class="temp-val">2.0°C</span>
      </label>
      <label>Salinity (PSU):
        <input type="range" class="sal-slider form-range" min="30" max="38" value="35" step="0.5">
        <span class="sal-val">35.0 PSU</span>
      </label>
      <label>Greenland Freshwater Melt:
        <select class="sel-melt form-select">
          <option value="low" selected>Normal Baseline (0.05 Sv)</option>
          <option value="med">Moderate Meltwater Influx (0.25 Sv)</option>
          <option value="high">Severe Glacial Discharge (0.80 Sv - AMOC Collapse Risk)</option>
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

        const tempSlider = container.querySelector('.temp-slider');
        const tempVal = container.querySelector('.temp-val');
        const salSlider = container.querySelector('.sal-slider');
        const salVal = container.querySelector('.sal-val');
        const selMelt = container.querySelector('.sel-melt');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const temp = parseFloat(tempSlider.value);
            let sal = parseFloat(salSlider.value);
            const melt = selMelt.value;

            tempVal.textContent = temp.toFixed(1) + '°C';
            if (melt === 'med') sal -= 1.5;
            if (melt === 'high') sal -= 3.5;
            salVal.textContent = sal.toFixed(1) + ' PSU';

            // Calculate seawater density: rho ~ 1000 + 0.8 * Sal - 0.2 * Temp
            const density = 1000 + (0.78 * sal) - (0.22 * temp);
            const sinkingThreshold = 1027.2; // kg/m^3
            const canSink = density >= sinkingThreshold;

            let amocStrength = canSink ? (density - 1026.0) * 12 : 2.0;
            amocStrength = Math.max(1, Math.min(22, Math.round(amocStrength)));

            let status = 'Vigorous Deep Overturning';
            let statusColor = '#22c55e';
            if (amocStrength < 12 && amocStrength >= 5) {
                status = 'Weakened / Sluggish AMOC';
                statusColor = '#facc15';
            } else if (amocStrength < 5) {
                status = 'Tipping Point: AMOC Shutdown';
                statusColor = '#ef4444';
            }

            const flow = (state.time * 25) % 150;

            let svgContent = `
            <rect width="800" height="380" fill="#070e1a" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              GLOBAL THERMOHALINE CONVEYOR & ATLANTIC OVERTURNING (AMOC)
            </text>

            <!-- Schematic Global Ocean Map Track -->
            <g transform="translate(60, 60)">
              <!-- Continents Silhouette simplified -->
              <rect x="20" y="50" width="120" height="150" rx="6" fill="#1e293b" opacity="0.6"/>
              <text x="80" y="130" fill="#475569" font-size="12" text-anchor="middle">Americas</text>

              <rect x="220" y="40" width="140" height="80" rx="6" fill="#1e293b" opacity="0.6"/>
              <text x="290" y="80" fill="#475569" font-size="12" text-anchor="middle">Eurasia</text>

              <rect x="230" y="140" width="100" height="100" rx="6" fill="#1e293b" opacity="0.6"/>
              <text x="280" y="190" fill="#475569" font-size="12" text-anchor="middle">Africa</text>

              <!-- Warm Surface Current (Gulf Stream - Red) -->
              <path d="M 60,180 Q 120,130 180,90 T 220,50" fill="none" stroke="#dc2626" stroke-width="${canSink ? 4 : 1.5}" stroke-linecap="round"/>
              <text x="140" y="100" fill="#f87171" font-size="11" font-weight="bold">Warm Surface Current (Gulf Stream)</text>

              <!-- Sinking Downwelling Zone at Greenland/North Atlantic -->
              <circle cx="220" cy="50" r="${canSink ? 18 : 10}" fill="${canSink ? '#2563eb' : '#94a3b8'}" opacity="0.8"/>
              <text x="220" y="54" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">${canSink ? 'PLUNGE' : 'NO SINK'}</text>
              <text x="220" y="25" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">North Atlantic Deep Water</text>

              <!-- Deep Cold Current (Blue) flowing south along seafloor -->
              <path d="M 220,50 C 200,120 180,180 180,240 S 300,240 380,220" fill="none" stroke="#1d4ed8" stroke-width="${canSink ? 4 : 1.5}" stroke-dasharray="6,4"/>
              <text x="200" y="235" fill="#60a5fa" font-size="11" font-weight="bold">Deep Cold Abyssal Return</text>
            </g>

            <!-- Thermohaline Status Gauge -->
            <g transform="translate(540, 60)">
              <rect x="0" y="0" width="220" height="260" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1"/>
              <text x="110" y="28" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">AMOC CONVEYOR HEALTH</text>
              
              <circle cx="110" cy="95" r="45" fill="none" stroke="#334155" stroke-width="8"/>
              <circle cx="110" cy="95" r="45" fill="none" 
                      stroke="${statusColor}" 
                      stroke-width="8" stroke-dasharray="283" stroke-dashoffset="${283 - (amocStrength / 22) * 283}" stroke-linecap="round"/>
              <text x="110" y="102" fill="#f8fafc" font-size="20" font-weight="bold" text-anchor="middle">${amocStrength} Sv</text>
              
              <text x="110" y="155" fill="${statusColor}" font-size="11" font-weight="bold" text-anchor="middle">${status}</text>

              <line x1="20" y1="170" x2="200" y2="170" stroke="#334155" stroke-width="1"/>

              <text x="20" y="195" fill="#cbd5e1" font-size="11">Density: <tspan font-weight="bold" fill="#ffffff">${density.toFixed(1)} kg/m³</tspan></text>
              <text x="20" y="215" fill="#cbd5e1" font-size="11">Sinking Threshold: <tspan fill="#94a3b8">1027.2 kg/m³</tspan></text>
              <text x="20" y="235" fill="#cbd5e1" font-size="11">Heat Delivery: <tspan font-weight="bold" fill="${statusColor}">${(amocStrength * 0.06).toFixed(2)} PW</tspan></text>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Water Temperature:</strong> ${temp.toFixed(1)}°C</div>
              <div><strong>Effective Salinity:</strong> ${sal.toFixed(1)} PSU</div>
              <div><strong>Water Density:</strong> ${density.toFixed(1)} kg/m³</div>
              <div><strong>AMOC Transport:</strong> ${amocStrength} Sverdrups</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-note" style="margin-top: 10px; border-left-color: ${statusColor};">
              <strong>Oceanographic Verdict:</strong> ${canSink ? 
                `Thermohaline circulation is ACTIVE. Frigid, saline seawater achieves high density (${density.toFixed(1)} kg/m³), plunging into the deep abyss and pulling warm tropical surface waters northward.` : 
                `CRITICAL TIPPING WARNING: Excessive freshwater meltwater diluted North Atlantic salinity, lowering density below the sinking threshold. Deep water formation has stalled, collapsing the global conveyor!` }
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        tempSlider.addEventListener('input', () => update(state));
        salSlider.addEventListener('input', () => update(state));
        selMelt.addEventListener('change', () => update(state));
        update(state);
    }
};

// 5. Hydrological Acceleration & Oxygen/Ozone Shield (sim-water-oxygen-cycle)
window.SIMS['sim-water-oxygen-cycle'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Biogeochemical Fluxes: Hydrological Cycle & Stratospheric Ozone Shield</h3>
    <div class="sim-controls-top">
      <label>Global Warming Anomaly:
        <input type="range" class="warm-slider form-range" min="0" max="4" value="1.5" step="0.5">
        <span class="warm-val">+1.5°C</span>
      </label>
      <label>Stratospheric CFC Regime:
        <select class="sel-cfc form-select">
          <option value="healed" selected>Post-Montreal Protocol (Healing / Low CFCs)</option>
          <option value="depleted">Pre-1987 Crisis (Peak CFCs / Ozone Hole)</option>
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

        const warmSlider = container.querySelector('.warm-slider');
        const warmVal = container.querySelector('.warm-val');
        const selCfc = container.querySelector('.sel-cfc');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const dT = parseFloat(warmSlider.value);
            const isHealed = selCfc.value === 'healed';
            warmVal.textContent = '+' + dT.toFixed(1) + '°C';

            // Clausius-Clapeyron moisture increase (+7% per degree C)
            const moistureIncrease = (dT * 7.0).toFixed(1);
            const ozoneThickness = isHealed ? 310 : 180; // Dobson Units

            let svgContent = `
            <rect width="800" height="380" fill="#0a121e" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              WATER VAPOR CAPACITY & STRATOSPHERIC OZONE (O3) DYNAMICS
            </text>

            <!-- Stratosphere Ozone Layer (Altitude ~20-30 km) -->
            <rect x="60" y="55" width="680" height="30" rx="4" fill="${isHealed ? '#0284c7' : '#991b1b'}" opacity="0.6"/>
            <text x="400" y="75" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">
              STRATOSPHERIC OZONE SHIELD: ${ozoneThickness} DU (${isHealed ? 'HEALTHY / PROTECTIVE' : 'OZONE HOLE / DANGEROUS UV-B LEAK'})
            </text>

            <!-- Troposphere Landscape (Below 12 km) -->
            <!-- Mountains and Plains -->
            <path d="M 60,280 L 180,180 L 280,240 L 450,280 L 740,280 L 740,340 L 60,340 Z" fill="#334155"/>
            <!-- Ocean on right -->
            <rect x="450" y="270" width="290" height="70" fill="#0284c7" rx="2"/>
            <text x="600" y="305" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">OCEAN</text>

            <!-- Water Cycle Evaporation arrows -->
            <g stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4,3">
              <line x1="530" y1="260" x2="530" y2="170"/>
              <line x1="600" y1="260" x2="600" y2="160"/>
              <line x1="670" y1="260" x2="670" y2="170"/>
            </g>
            <text x="600" y="210" fill="#7dd3fc" font-size="11" text-anchor="middle">Evaporation (+${moistureIncrease}%)</text>

            <!-- Cloud -->
            <g transform="translate(320, 130)">
              <ellipse cx="0" cy="0" rx="55" ry="25" fill="#cbd5e1"/>
              <ellipse cx="35" cy="-10" rx="40" ry="28" fill="#f8fafc"/>
              <ellipse cx="-30" cy="-5" rx="35" ry="22" fill="#e2e8f0"/>
              <!-- Rain -->
              <line x1="-30" y1="25" x2="-35" y2="55" stroke="#38bdf8" stroke-width="2"/>
              <line x1="0" y1="28" x2="-5" y2="60" stroke="#38bdf8" stroke-width="2"/>
              <line x1="30" y1="25" x2="25" y2="55" stroke="#38bdf8" stroke-width="2"/>
            </g>
            <text x="320" y="115" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Intensified Precipitation</text>

            <!-- UV Radiation rays from Sun -->
            <line x1="200" y1="40" x2="200" y2="${isHealed ? 55 : 200}" stroke="#facc15" stroke-width="${isHealed ? 1.5 : 3}"/>
            <text x="200" y="110" fill="${isHealed ? '#4ade80' : '#f87171'}" font-size="10" text-anchor="middle">
              ${isHealed ? 'UV-B Blocked' : '⚠️ UV-B Penetrating to Ground!'}
            </text>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Warming Anomaly:</strong> +${dT.toFixed(1)}°C</div>
              <div><strong>Vapor Capacity Boost:</strong> +${moistureIncrease}%</div>
              <div><strong>Ozone Column:</strong> ${ozoneThickness} DU</div>
              <div><strong>Ozone Status:</strong> ${isHealed ? 'Protected' : 'Depleted'}</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-tip" style="margin-top: 10px;">
              <strong>Biogeochemical Cycle Verdict:</strong> Each +1°C of warming expands atmospheric water-holding capacity by ~7%, 
              speeding up evaporation from soils (worsening droughts) and generating heavy storm rainfall (worsening floods). 
              Meanwhile, the Montreal Protocol demonstrates how global human stewardship can restore protective atmospheric layers.
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        warmSlider.addEventListener('input', () => update(state));
        selCfc.addEventListener('change', () => update(state));
        update(state);
    }
};

// 6. Carbon & Nitrogen Nutrient Dynamics (sim-carbon-nitrogen-cycles)
window.SIMS['sim-carbon-nitrogen-cycles'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Nutrient Cycling: Global Carbon & Nitrogen Dynamics</h3>
    <div class="sim-controls-top">
      <label>Fossil Carbon Emissions (Gt CO2/yr):
        <input type="range" class="c-slider form-range" min="0" max="40" value="36" step="2">
        <span class="c-val">36 Gt/yr</span>
      </label>
      <label>Synthetic Nitrogen Fertilizer (Mt N/yr):
        <input type="range" class="n-slider form-range" min="0" max="150" value="120" step="10">
        <span class="n-val">120 Mt/yr</span>
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

        const cSlider = container.querySelector('.c-slider');
        const cVal = container.querySelector('.c-val');
        const nSlider = container.querySelector('.n-slider');
        const nVal = container.querySelector('.n-val');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const cEmit = parseFloat(cSlider.value);
            const nSynth = parseFloat(nSlider.value);

            cVal.textContent = cEmit + ' Gt/yr';
            nVal.textContent = nSynth + ' Mt/yr';

            // Calculate atmospheric CO2 ppm projection: 280 baseline + (cEmit / 40) * 150
            const co2Ppm = Math.round(280 + (cEmit / 40) * 145);
            // Eutrophication runoff index (0 to 100)
            const eutro = Math.min(100, Math.round((nSynth / 150) * 90));

            let svgContent = `
            <rect width="800" height="380" fill="#080f1a" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              ANTHROPOGENIC ACCELERATION OF CARBON & NITROGEN CYCLES
            </text>

            <!-- Carbon Cycle Box (Left) -->
            <g transform="translate(60, 60)">
              <rect x="0" y="0" width="320" height="260" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
              <text x="160" y="28" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">CARBON CYCLE (C)</text>

              <!-- Atmosphere Pool -->
              <rect x="40" y="50" width="240" height="45" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
              <text x="160" y="70" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">Atmospheric CO2 Pool</text>
              <text x="160" y="86" fill="${co2Ppm > 400 ? '#f87171' : '#4ade80'}" font-size="11" text-anchor="middle">${co2Ppm} ppm (Pre-ind: 280)</text>

              <!-- Photosynthesis vs Respiration -->
              <path d="M 60,98 L 60,160" stroke="#22c55e" stroke-width="3"/>
              <text x="85" y="130" fill="#4ade80" font-size="10">Photosynthesis</text>

              <path d="M 140,160 L 140,98" stroke="#f59e0b" stroke-width="2"/>
              <text x="170" y="130" fill="#fbbf24" font-size="10">Respiration</text>

              <!-- Fossil Emissions Influx -->
              <path d="M 240,210 L 240,98" stroke="#ef4444" stroke-width="${Math.max(1, cEmit / 8)}" stroke-dasharray="4,2"/>
              <text x="240" y="160" fill="#f87171" font-size="10" text-anchor="middle">Fossil Influx (${cEmit} Gt)</text>

              <!-- Terrestrial & Fossil Reservoir -->
              <rect x="40" y="170" width="240" height="70" rx="5" fill="#0f172a" stroke="#64748b" stroke-width="1"/>
              <text x="160" y="195" fill="#cbd5e1" font-size="11" text-anchor="middle">Biomass & Sedimentary Limestone</text>
              <text x="160" y="215" fill="#94a3b8" font-size="10" text-anchor="middle">Deep Lithospheric Reservoir</text>
            </g>

            <!-- Nitrogen Cycle Box (Right) -->
            <g transform="translate(420, 60)">
              <rect x="0" y="0" width="320" height="260" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
              <text x="160" y="28" fill="#facc15" font-size="14" font-weight="bold" text-anchor="middle">NITROGEN CYCLE (N)</text>

              <!-- Atmospheric N2 Pool -->
              <rect x="40" y="50" width="240" height="45" rx="5" fill="#0f172a" stroke="#facc15" stroke-width="1.5"/>
              <text x="160" y="70" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">Atmospheric N2 Gas (78%)</text>
              <text x="160" y="86" fill="#fef08a" font-size="10" text-anchor="middle">Triple Bond N&equiv;N (Inert)</text>

              <!-- Fixation Pathways -->
              <text x="50" y="125" fill="#38bdf8" font-size="10">Rhizobium Bio-Fixation</text>
              <text x="190" y="125" fill="#ef4444" font-size="10">Haber-Bosch Synth (${nSynth} Mt)</text>

              <!-- Soil Nitrates -->
              <rect x="40" y="145" width="240" height="45" rx="5" fill="#0f172a" stroke="#22c55e" stroke-width="1.5"/>
              <text x="160" y="165" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Soil Nitrate (NO3-) & Ammonium (NH4+)</text>
              <text x="160" y="180" fill="#4ade80" font-size="10" text-anchor="middle">Nitrification by Nitrosomonas/Nitrobacter</text>

              <!-- Denitrification Return -->
              <text x="160" y="215" fill="#a78bfa" font-size="10" text-anchor="middle">Denitrification by Pseudomonas &rarr; N2&uarr;</text>
              <text x="160" y="235" fill="${eutro > 50 ? '#f87171' : '#38bdf8'}" font-size="10" font-weight="bold" text-anchor="middle">
                Eutrophication Risk: ${eutro}%
              </text>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Atmospheric CO2:</strong> ${co2Ppm} ppm</div>
              <div><strong>Carbon Emission:</strong> ${cEmit} Gt/yr</div>
              <div><strong>Haber-Bosch Nitrogen:</strong> ${nSynth} Mt/yr</div>
              <div><strong>Eutrophication Index:</strong> ${eutro}%</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-note" style="margin-top: 10px;">
              <strong>Biogeochemical Disturbance Law:</strong> Human industrial activity currently injects over 36 billion tonnes of carbon 
              and fixes more reactive nitrogen via the Haber-Bosch process than all natural terrestrial bacteria combined. 
              Restoring planetary equilibrium requires shifting to zero-emission energy and precision organic agriculture.
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        cSlider.addEventListener('input', () => update(state));
        nSlider.addEventListener('input', () => update(state));
        update(state);
    }
};

// 7. Planetary Radiative Balance & Enhanced Greenhouse Effect (sim-climate-radiative-balance)
window.SIMS['sim-climate-radiative-balance'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Planetary Thermal Radiative Balance & Climate Equilibrium</h3>
    <div class="sim-controls-top">
      <label>Atmospheric CO2 Concentration:
        <input type="range" class="co2-slider form-range" min="280" max="600" value="425" step="5">
        <span class="co2-val">425 ppm (Present Day)</span>
      </label>
      <label>Global Surface Albedo:
        <input type="range" class="alb-slider form-range" min="0.22" max="0.36" value="0.30" step="0.01">
        <span class="alb-val">0.30 (30% Reflected)</span>
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

        const co2Slider = container.querySelector('.co2-slider');
        const co2Val = container.querySelector('.co2-val');
        const albSlider = container.querySelector('.alb-slider');
        const albVal = container.querySelector('.alb-val');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const co2 = parseFloat(co2Slider.value);
            const albedo = parseFloat(albSlider.value);

            co2Val.textContent = co2 + ' ppm' + (co2 === 280 ? ' (Pre-Industrial)' : (co2 === 425 ? ' (Present)' : ' (High Emission)'));
            albVal.textContent = albedo.toFixed(2) + ' (' + Math.round(albedo * 100) + '% Reflected)';

            // Radiative forcing Delta F = 5.35 * ln(C / 280) W/m^2
            const dF = 5.35 * Math.log(co2 / 280.0);
            // Temperature anomaly dT = lambda * dF (climate sensitivity ~0.8 °C per W/m^2)
            const dT = 0.8 * dF + (0.30 - albedo) * 30.0;
            const globalTemp = 14.0 + dT;

            // Sea-level rise estimate (thermal expansion + ice melt)
            const seaRiseCm = Math.max(0, Math.round(dT * 35));

            let svgContent = `
            <rect width="800" height="380" fill="#080e18" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              EARTH'S RADIATIVE ENERGY BALANCE: INCOMING SOLAR VS GREENHOUSE INFRARED
            </text>

            <!-- Space & Sun -->
            <g transform="translate(100, 70)">
              <circle cx="0" cy="0" r="28" fill="#f59e0b" stroke="#fef08a" stroke-width="2"/>
              <text x="0" y="4" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">SUN</text>
            </g>

            <!-- Incoming Solar Shortwave (340 W/m2) -->
            <line x1="140" y1="80" x2="320" y2="180" stroke="#facc15" stroke-width="5"/>
            <polygon points="325,183 310,175 315,188" fill="#facc15"/>
            <text x="210" y="115" fill="#fef08a" font-size="11" font-weight="bold">Solar Shortwave: 340 W/m²</text>

            <!-- Reflected Solar Shortwave (Albedo * 340) -->
            <line x1="280" y1="160" x2="380" y2="70" stroke="#94a3b8" stroke-width="${albedo * 10}"/>
            <polygon points="385,65 372,72 380,82" fill="#94a3b8"/>
            <text x="350" y="125" fill="#cbd5e1" font-size="10">Reflected: ${Math.round(albedo * 340)} W/m²</text>

            <!-- Earth Surface Line -->
            <rect x="50" y="270" width="700" height="60" rx="4" fill="#15803d"/>
            <text x="400" y="305" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">EARTH'S SURFACE (Absorbs Shortwave, Radiates Infrared)</text>

            <!-- Terrestrial Longwave Infrared Radiation (Red) -->
            <line x1="450" y1="270" x2="450" y2="150" stroke="#ef4444" stroke-width="4"/>
            <text x="460" y="220" fill="#f87171" font-size="11" font-weight="bold">Thermal Infrared</text>

            <!-- Atmospheric Greenhouse Blanket -->
            <rect x="350" y="130" width="360" height="28" rx="6" fill="#7c3aed" opacity="${0.4 + (co2 / 600) * 0.5}"/>
            <text x="530" y="149" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">
              Greenhouse Blanket (${co2} ppm CO2 & H2O vapor)
            </text>

            <!-- Downward Trapped Re-radiation (Back Radiation) -->
            <line x1="580" y1="160" x2="580" y2="260" stroke="#ec4899" stroke-width="${2 + (co2 / 200)}"/>
            <polygon points="580,265 574,250 586,250" fill="#ec4899"/>
            <text x="590" y="210" fill="#f472b6" font-size="11">Trapped Back-Radiation (+${dF.toFixed(1)} W/m²)</text>

            <!-- Global Temperature Thermometer Gauge -->
            <g transform="translate(640, 50)">
              <rect x="0" y="0" width="130" height="85" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
              <text x="65" y="22" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">Global Mean Temp:</text>
              <text x="65" y="52" fill="${globalTemp > 15 ? '#ef4444' : '#4ade80'}" font-size="20" font-weight="bold" text-anchor="middle">
                ${globalTemp.toFixed(1)}°C
              </text>
              <text x="65" y="72" fill="#cbd5e1" font-size="10" text-anchor="middle">(ΔT = ${dT >= 0 ? '+' : ''}${dT.toFixed(1)}°C)</text>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Atmospheric CO2:</strong> ${co2} ppm</div>
              <div><strong>Radiative Forcing:</strong> +${dF.toFixed(2)} W/m²</div>
              <div><strong>Mean Global Temp:</strong> ${globalTemp.toFixed(1)}°C</div>
              <div><strong>Sea-Level Rise:</strong> +${seaRiseCm} cm</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-tip" style="margin-top: 10px;">
              <strong>Planetary Energy Balance Principle:</strong> Without the natural greenhouse effect, Earth would be an icy $-18^\circ\text{C}$. 
              However, burning fossil fuels has increased $CO_2$ to ${co2} ppm, adding $+${dF.toFixed(1)}\text{ W/m}^2$ of radiative forcing. 
              Every fraction of a degree of warming alters polar ice albedo, sea levels, and the habitability of our shared planetary home.
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        co2Slider.addEventListener('input', () => update(state));
        albSlider.addEventListener('input', () => update(state));
        update(state);
    }
};
