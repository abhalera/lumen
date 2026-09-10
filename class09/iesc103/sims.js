// Chapter 3: Tissues in Action - Interactive Simulation Suite
window.SIMS = window.SIMS || {};

// =========================================================================
// Helper: Setup Standardized Timeline Controls & State
// =========================================================================
function createSimState(container, onUpdate) {
    const state = {
        running: false,
        time: 0,
        speed: 1.0,
        animId: null,
        presets: {},
        custom: {}
    };

    // Timeline Loop
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

        if (playBtn) playBtn.onclick = () => state.running ? state.pause() : state.play();
        if (stepBtn) stepBtn.onclick = () => state.step();
        if (resetBtn) resetBtn.onclick = () => state.reset();
        if (scrubber) {
            scrubber.oninput = (e) => {
                state.pause();
                state.time = parseFloat(e.target.value) || 0;
                onUpdate(state);
            };
        }
        if (speedSel) {
            speedSel.onchange = (e) => {
                state.speed = parseFloat(e.target.value) || 1.0;
            };
        }
    };

    return state;
}

// =========================================================================
// 1. SIMULATION: Plant Meristem Growth Lab (sim-meristems)
// =========================================================================
window.SIMS['sim-meristems'] = {
    mount: function(container) {
        container.innerHTML = `
            <div class="sim-ui-wrapper">
                <div class="sim-toolbar">
                    <div class="sim-controls-row">
                        <button class="btn btn-primary btn-play">▶ Play</button>
                        <button class="btn btn-secondary btn-step">⏭ Step</button>
                        <button class="btn btn-outline btn-reset">↺ Reset</button>
                        <label class="sim-label">Scrubber: <input type="range" class="sim-scrubber" min="0" max="10" step="0.05" value="0"></label>
                        <label class="sim-label">Speed: 
                            <select class="sim-speed">
                                <option value="0.5">0.5×</option>
                                <option value="1" selected>1.0×</option>
                                <option value="2">2.0×</option>
                            </select>
                        </label>
                    </div>
                    <div class="sim-presets-row">
                        <span class="preset-label">Modes / Presets:</span>
                        <button class="btn btn-sm btn-preset" data-mode="apical">Apical Elongation (Shoot/Root)</button>
                        <button class="btn btn-sm btn-preset" data-mode="lateral">Lateral Girth (Annual Rings)</button>
                        <button class="btn btn-sm btn-preset" data-mode="intercalary">Intercalary Regrowth (Grass)</button>
                        <button class="btn btn-sm btn-preset" data-mode="cut-root">Activity 3.1: Onion Root Tip Cut</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Meristem Mode:
                        <select class="sel-meristem-type">
                            <option value="apical">Apical Meristem (Primary Vertical Growth)</option>
                            <option value="lateral">Lateral Meristem (Vascular Cambium Girth)</option>
                            <option value="intercalary">Intercalary Meristem (Nodal Regrowth)</option>
                            <option value="cut-root">Activity 3.1: Onion Root Excision</option>
                        </select>
                    </label>
                    <label class="control-item">Years / Days Elapsed: <span class="val-elapsed">0</span>
                        <input type="range" class="rng-elapsed" min="0" max="40" step="1" value="5">
                    </label>
                    <label class="control-item">
                        <input type="checkbox" class="chk-cut-tip"> Cut Root / Shoot Tip (Excise Meristem)
                    </label>
                </div>

                <div class="sim-stage-area">
                    <svg class="sim-svg" viewBox="0 0 800 440" width="100%" height="340" style="background:#0f172a; border-radius:12px;"></svg>
                </div>

                <div id="lab-readout" class="lab-metrics-panel"></div>
                <div id="lab-verdict" class="lab-verdict-box"></div>
            </div>
        `;

        const svg = container.querySelector('.sim-svg');
        const selMode = container.querySelector('.sel-meristem-type');
        const rngElapsed = container.querySelector('.rng-elapsed');
        const chkCut = container.querySelector('.chk-cut-tip');
        const lblElapsed = container.querySelector('.val-elapsed');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.mode = 'apical';
        state.custom.elapsed = 5;
        state.custom.tipCut = false;

        function applyMode(m) {
            state.custom.mode = m;
            selMode.value = m;
            if (m === 'cut-root') {
                chkCut.checked = true;
                state.custom.tipCut = true;
            } else {
                chkCut.checked = false;
                state.custom.tipCut = false;
            }
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => applyMode(btn.dataset.mode);
        });

        selMode.onchange = (e) => applyMode(e.target.value);
        rngElapsed.oninput = (e) => {
            state.custom.elapsed = parseInt(e.target.value);
            lblElapsed.textContent = state.custom.elapsed;
            this.draw(svg, state, container);
        };
        chkCut.onchange = (e) => {
            state.custom.tipCut = e.target.checked;
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const mode = state.custom.mode;
        const elapsed = state.custom.elapsed;
        const tipCut = state.custom.tipCut;
        const t = state.time;

        const effectiveProgress = tipCut ? Math.min(t, 2.0) : t;
        const animatedGrowth = (elapsed + effectiveProgress * 3.5);

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (mode === 'apical' || mode === 'cut-root') {
            const shootHeight = tipCut ? 120 : Math.min(260, 80 + animatedGrowth * 4.5);
            const rootDepth = tipCut ? 60 : Math.min(130, 40 + animatedGrowth * 2.2);

            svgContent = `
                <defs>
                    <linearGradient id="stemGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stop-color="#15803d" />
                        <stop offset="50%" stop-color="#22c55e" />
                        <stop offset="100%" stop-color="#15803d" />
                    </linearGradient>
                    <radialGradient id="meristemGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#facc15" stop-opacity="1" />
                        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.1" />
                    </radialGradient>
                </defs>
                <rect x="50" y="240" width="700" height="190" fill="#2d1c14" rx="4" />
                <line x1="50" y1="240" x2="750" y2="240" stroke="#78350f" stroke-width="4" stroke-dasharray="6,4" />
                <text x="60" y="260" fill="#ca8a04" font-size="13" font-family="sans-serif">🌱 Soil Horizon (Subterranean Root Zone)</text>

                <rect x="390" y="${240 - shootHeight}" width="20" height="${shootHeight}" fill="url(#stemGrad)" rx="3" />
                
                <ellipse cx="370" cy="${240 - shootHeight * 0.7}" rx="25" ry="12" fill="#16a34a" transform="rotate(-25 370 ${240 - shootHeight * 0.7})" />
                <ellipse cx="430" cy="${240 - shootHeight * 0.7}" rx="25" ry="12" fill="#16a34a" transform="rotate(25 430 ${240 - shootHeight * 0.7})" />
                <ellipse cx="365" cy="${240 - shootHeight * 0.4}" rx="30" ry="14" fill="#15803d" transform="rotate(-30 365 ${240 - shootHeight * 0.4})" />
                <ellipse cx="435" cy="${240 - shootHeight * 0.4}" rx="30" ry="14" fill="#15803d" transform="rotate(30 435 ${240 - shootHeight * 0.4})" />

                ${!tipCut ? `
                    <circle cx="400" cy="${240 - shootHeight}" r="12" fill="url(#meristemGlow)" />
                    <circle cx="400" cy="${240 - shootHeight}" r="6" fill="#fef08a" />
                    <text x="425" y="${240 - shootHeight + 4}" fill="#facc15" font-size="13" font-weight="bold" font-family="sans-serif">Shoot Apical Meristem (SAM) [Active Mitosis]</text>
                ` : `
                    <line x1="380" y1="${240 - shootHeight}" x2="420" y2="${240 - shootHeight}" stroke="#ef4444" stroke-width="3" />
                    <text x="425" y="${240 - shootHeight + 4}" fill="#ef4444" font-size="13" font-weight="bold" font-family="sans-serif">✂️ Meristem Excised (Elongation Terminated)</text>
                `}

                <line x1="400" y1="240" x2="400" y2="${240 + rootDepth}" stroke="#d97706" stroke-width="6" stroke-linecap="round" />
                <line x1="400" y1="${240 + rootDepth * 0.4}" x2="360" y2="${240 + rootDepth * 0.6}" stroke="#b45309" stroke-width="3" />
                <line x1="400" y1="${240 + rootDepth * 0.5}" x2="440" y2="${240 + rootDepth * 0.7}" stroke="#b45309" stroke-width="3" />

                ${!tipCut ? `
                    <circle cx="400" cy="${240 + rootDepth}" r="8" fill="#facc15" />
                    <text x="425" y="${240 + rootDepth + 5}" fill="#facc15" font-size="13" font-weight="bold" font-family="sans-serif">Root Apical Meristem (RAM) + Root Cap</text>
                ` : `
                    <circle cx="400" cy="${240 + rootDepth}" r="5" fill="#ef4444" />
                    <text x="425" y="${240 + rootDepth + 5}" fill="#ef4444" font-size="13" font-family="sans-serif">✂️ Root Tip Severed (Activity 3.1: Zero Growth)</text>
                `}

                <line x1="120" y1="40" x2="120" y2="380" stroke="#64748b" stroke-width="2" />
                <text x="130" y="55" fill="#94a3b8" font-size="11">Height Ruler</text>
                <line x1="115" y1="240" x2="125" y2="240" stroke="#38bdf8" stroke-width="2" />
                <text x="80" y="244" fill="#38bdf8" font-size="11">0 cm</text>
                <line x1="115" y1="120" x2="125" y2="120" stroke="#38bdf8" stroke-width="2" />
                <text x="75" y="124" fill="#38bdf8" font-size="11">+25 cm</text>
                <line x1="115" y1="340" x2="125" y2="340" stroke="#38bdf8" stroke-width="2" />
                <text x="75" y="344" fill="#38bdf8" font-size="11">-20 cm</text>
            `;

            const currentShootCm = (shootHeight / 5).toFixed(1);
            const currentRootCm = (rootDepth / 5).toFixed(1);

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Meristem State:</span> <span class="metric-val" style="color:${tipCut ? '#ef4444' : '#22c55e'};">${tipCut ? 'Excised / Non-functional' : 'Active Mitotic Division'}</span></div>
                <div class="metric"><span class="metric-lbl">Shoot Height:</span> <span class="metric-val">${currentShootCm} cm</span></div>
                <div class="metric"><span class="metric-lbl">Root Depth:</span> <span class="metric-val">${currentRootCm} cm</span></div>
                <div class="metric"><span class="metric-lbl">Mitotic Rate:</span> <span class="metric-val">${tipCut ? '0 cells/hr' : '142 cells/hr'}</span></div>
            `;

            verdictHtml = tipCut 
                ? `<strong>NCERT Activity 3.1 Verification:</strong> Snipping 2-3 mm from root/shoot tips removes the <em>Apical Meristem</em>. Without these undifferentiated dividing cells, vertical primary elongation ceases permanently.`
                : `<strong>Apical Meristem in Action:</strong> Continuous cell division at the shoot apex (SAM) and root apex (RAM) pushes the plant body upward into sunlight and downward into soil moisture.`;

        } else if (mode === 'lateral') {
            const treeAge = Math.min(40, Math.max(1, Math.round(animatedGrowth)));
            const radius = Math.min(150, 20 + treeAge * 3.1);
            const numRings = Math.min(treeAge, 40);

            let ringsSvg = '';
            for (let r = 1; r <= numRings; r++) {
                const ringR = 20 + (r * (radius - 20) / numRings);
                ringsSvg += `<circle cx="400" cy="220" r="${ringR}" fill="none" stroke="#78350f" stroke-width="1.8" opacity="0.65" />`;
            }

            svgContent = `
                <rect x="50" y="20" width="700" height="400" fill="#1e293b" rx="8" />
                <text x="70" y="50" fill="#f8fafc" font-size="16" font-weight="bold">Trunk Transverse Section: Lateral Meristem & Dendrochronology (Table 3.7)</text>

                <circle cx="400" cy="220" r="${radius + 12}" fill="#3b2518" stroke="#52311b" stroke-width="6" />
                <text x="${400 + radius + 20}" y="200" fill="#d97706" font-size="12">Outer Cork / Bark (Dead suberized cells)</text>

                <circle cx="400" cy="220" r="${radius}" fill="#451a03" stroke="#eab308" stroke-width="3" stroke-dasharray="4,2" />
                <text x="${400 + radius + 20}" y="225" fill="#eab308" font-size="13" font-weight="bold">Vascular Cambium (Lateral Meristem)</text>

                ${ringsSvg}

                <circle cx="400" cy="220" r="16" fill="#ca8a04" />
                <text x="382" y="225" fill="#1e293b" font-size="11" font-weight="bold">Pith</text>

                <line x1="${400 - radius}" y1="390" x2="${400 + radius}" y2="390" stroke="#38bdf8" stroke-width="3" />
                <line x1="${400 - radius}" y1="382" x2="${400 - radius}" y2="398" stroke="#38bdf8" stroke-width="3" />
                <line x1="${400 + radius}" y1="382" x2="${400 + radius}" y2="398" stroke="#38bdf8" stroke-width="3" />
                <text x="360" y="415" fill="#38bdf8" font-size="14" font-weight="bold">DBH = ${(radius * 2 / 7.5).toFixed(1)} cm</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Tree Age:</span> <span class="metric-val">${treeAge} Years</span></div>
                <div class="metric"><span class="metric-lbl">Annual Rings:</span> <span class="metric-val">${numRings} Concentric Rings</span></div>
                <div class="metric"><span class="metric-lbl">Trunk Diameter:</span> <span class="metric-val">${(radius * 2 / 7.5).toFixed(1)} cm</span></div>
                <div class="metric"><span class="metric-lbl">Active Meristem:</span> <span class="metric-val" style="color:#eab308;">Vascular Cambium</span></div>
            `;

            verdictHtml = `<strong>Table 3.7 Teak Tree Verification:</strong> The <em>lateral meristem</em> (vascular cambium) divides tangentially, depositing secondary xylem inward and secondary phloem outward. Each year's seasonal alternation forms 1 distinct ring (${numRings} rings = ${treeAge} years).`;

        } else if (mode === 'intercalary') {
            const bladeLength = Math.min(240, 80 + animatedGrowth * 4.0);

            svgContent = `
                <rect x="50" y="20" width="700" height="400" fill="#1e293b" rx="8" />
                <text x="70" y="50" fill="#f8fafc" font-size="16" font-weight="bold">Grass / Sugarcane Stem: Intercalary Meristem at Nodes</text>

                <rect x="100" y="350" width="600" height="60" fill="#2d1c14" />
                <line x1="100" y1="350" x2="700" y2="350" stroke="#78350f" stroke-width="3" />

                <rect x="385" y="270" width="30" height="80" fill="#4ade80" stroke="#16a34a" stroke-width="2" />
                <rect x="385" y="180" width="30" height="85" fill="#4ade80" stroke="#16a34a" stroke-width="2" />
                <rect x="385" y="${180 - bladeLength * 0.4}" width="30" height="${bladeLength * 0.4}" fill="#4ade80" stroke="#16a34a" stroke-width="2" />

                <ellipse cx="400" cy="270" rx="20" ry="6" fill="#f59e0b" />
                <text x="435" y="274" fill="#f59e0b" font-size="13" font-weight="bold">Node 1: Intercalary Meristem Zone</text>

                <ellipse cx="400" cy="180" rx="20" ry="6" fill="#f59e0b" />
                <text x="435" y="184" fill="#f59e0b" font-size="13" font-weight="bold">Node 2: Active Intercalary Meristem</text>

                <path d="M 385 270 Q 300 240 280 160" fill="none" stroke="#22c55e" stroke-width="6" stroke-linecap="round" />
                <path d="M 415 180 Q 520 150 540 80" fill="none" stroke="#22c55e" stroke-width="6" stroke-linecap="round" />

                <text x="180" y="140" fill="#86efac" font-size="13">Leaf blade regenerating from base</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Meristem Type:</span> <span class="metric-val" style="color:#f59e0b;">Intercalary Meristem</span></div>
                <div class="metric"><span class="metric-lbl">Nodal Position:</span> <span class="metric-val">Base of Internodes</span></div>
                <div class="metric"><span class="metric-lbl">Regeneration Speed:</span> <span class="metric-val">2.8 cm / day</span></div>
                <div class="metric"><span class="metric-lbl">Ecological Role:</span> <span class="metric-val">Grazer Survival Adaptation</span></div>
            `;

            verdictHtml = `<strong>Intercalary Meristem Mechanics:</strong> Positioned at nodes between mature permanent tissues, these cells divide to elongate internodes and regrow grass leaves after grazing herbivores excise the tips.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 2. SIMULATION: Simple Permanent Tissues Mechanical Lab (sim-simple-tissues)
// =========================================================================
window.SIMS['sim-simple-tissues'] = {
    mount: function(container) {
        container.innerHTML = `
            <div class="sim-ui-wrapper">
                <div class="sim-toolbar">
                    <div class="sim-controls-row">
                        <button class="btn btn-primary btn-play">▶ Play</button>
                        <button class="btn btn-secondary btn-step">⏭ Step</button>
                        <button class="btn btn-outline btn-reset">↺ Reset</button>
                        <label class="sim-label">Scrubber: <input type="range" class="sim-scrubber" min="0" max="10" step="0.05" value="0"></label>
                    </div>
                    <div class="sim-presets-row">
                        <span class="preset-label">Presets:</span>
                        <button class="btn btn-sm btn-preset" data-tissue="collenchyma">Wind Flexing (Collenchyma)</button>
                        <button class="btn btn-sm btn-preset" data-tissue="sclerenchyma">Nut Shell Armor (Sclerenchyma)</button>
                        <button class="btn btn-sm btn-preset" data-tissue="parenchyma">Turgor Storage (Parenchyma)</button>
                        <button class="btn btn-sm btn-preset" data-tissue="brittle-test">Exercise 9: Mango Sapling Wind Test</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Tissue Type:
                        <select class="sel-tissue-type">
                            <option value="collenchyma">Collenchyma (Living, Pectin Corner Thickenings)</option>
                            <option value="sclerenchyma">Sclerenchyma (Dead, Lignified Thick Walls)</option>
                            <option value="parenchyma">Parenchyma (Living, Thin Cellulose Walls)</option>
                            <option value="brittle-test">Sclerenchyma-Replaced Stem (Exercise 9 Snap Test)</option>
                        </select>
                    </label>
                    <label class="control-item">Applied Wind / Shear Force (N): <span class="val-force">30</span>
                        <input type="range" class="rng-force" min="0" max="100" step="5" value="30">
                    </label>
                </div>

                <div class="sim-stage-area">
                    <svg class="sim-svg" viewBox="0 0 800 400" width="100%" height="320" style="background:#0f172a; border-radius:12px;"></svg>
                </div>

                <div id="lab-readout" class="lab-metrics-panel"></div>
                <div id="lab-verdict" class="lab-verdict-box"></div>
            </div>
        `;

        const svg = container.querySelector('.sim-svg');
        const selTissue = container.querySelector('.sel-tissue-type');
        const rngForce = container.querySelector('.rng-force');
        const lblForce = container.querySelector('.val-force');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.tissue = 'collenchyma';
        state.custom.force = 30;

        function setTissue(t) {
            state.custom.tissue = t;
            selTissue.value = t;
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => setTissue(btn.dataset.tissue);
        });

        selTissue.onchange = (e) => setTissue(e.target.value);
        rngForce.oninput = (e) => {
            state.custom.force = parseInt(e.target.value);
            lblForce.textContent = state.custom.force;
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const tissue = state.custom.tissue;
        const force = state.custom.force;
        const osc = Math.sin(state.time * 3.0);

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (tissue === 'collenchyma') {
            const bendAngle = (force * 0.45) * (0.8 + 0.2 * osc);
            const tipX = 250 + Math.sin(bendAngle * Math.PI / 180) * 180;
            const tipY = 320 - Math.cos(bendAngle * Math.PI / 180) * 180;

            svgContent = `
                <text x="40" y="40" fill="#38bdf8" font-size="16" font-weight="bold">Collenchyma: Dynamic Tensile Flexibility Under Wind</text>
                
                <rect x="80" y="320" width="340" height="50" fill="#334155" rx="4" />
                <circle cx="250" cy="320" r="10" fill="#64748b" />

                <path d="M 250 320 Q ${250 + (tipX-250)*0.5} ${320 - (320-tipY)*0.4} ${tipX} ${tipY}" fill="none" stroke="#22c55e" stroke-width="18" stroke-linecap="round" />
                <ellipse cx="${tipX}" cy="${tipY}" rx="22" ry="10" fill="#4ade80" transform="rotate(${bendAngle} ${tipX} ${tipY})" />

                <path d="M 80 180 L 160 180 M 150 170 L 160 180 L 150 190" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
                <path d="M 60 220 L 180 220 M 170 210 L 180 220 L 170 230" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
                <text x="60" y="165" fill="#38bdf8" font-size="13">Monsoon Gale Force = ${force} N</text>

                <g transform="translate(480, 50)">
                    <rect x="0" y="0" width="280" height="280" fill="#1e293b" stroke="#475569" stroke-width="2" rx="8" />
                    <text x="20" y="30" fill="#facc15" font-size="13" font-weight="bold">Micro-Structure: Corner Pectin Thickenings</text>
                    
                    <circle cx="90" cy="110" r="35" fill="#14532d" stroke="#22c55e" stroke-width="3" />
                    <circle cx="160" cy="110" r="35" fill="#14532d" stroke="#22c55e" stroke-width="3" />
                    <circle cx="125" cy="170" r="35" fill="#14532d" stroke="#22c55e" stroke-width="3" />

                    <circle cx="125" cy="110" r="10" fill="#eab308" />
                    <circle cx="125" cy="140" r="12" fill="#eab308" />
                    <text x="145" y="145" fill="#fde047" font-size="11">Hydrophilic Pectin Corner Cushion</text>
                    <text x="20" y="240" fill="#94a3b8" font-size="12">• Living protoplast with nucleus</text>
                    <text x="20" y="260" fill="#94a3b8" font-size="12">• Elastic tensile deflection without snap</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Tissue:</span> <span class="metric-val" style="color:#4ade80;">Collenchyma (Living)</span></div>
                <div class="metric"><span class="metric-lbl">Deflection Angle:</span> <span class="metric-val">${bendAngle.toFixed(1)}°</span></div>
                <div class="metric"><span class="metric-lbl">Elastic Strain:</span> <span class="metric-val">${(force * 0.18).toFixed(1)}% (Reversible)</span></div>
                <div class="metric"><span class="metric-lbl">Mechanical Verdict:</span> <span class="metric-val" style="color:#22c55e;">Flexible Support (Zero Snapping)</span></div>
            `;

            verdictHtml = `<strong>Pectin Engineering:</strong> Collenchyma cell corners are reinforced with hydrophilic pectin and hemicellulose. They allow high tensile bending moments under heavy winds without cracking, springing back elastically when wind subsides.`;

        } else if (tissue === 'sclerenchyma' || tissue === 'brittle-test') {
            const isSnapped = force > 60;
            const bendAngle = isSnapped ? 65 : (force * 0.08);
            const tipX = isSnapped ? 340 : (250 + Math.sin(bendAngle * Math.PI / 180) * 180);
            const tipY = isSnapped ? 280 : (320 - Math.cos(bendAngle * Math.PI / 180) * 180);

            svgContent = `
                <text x="40" y="40" fill="${isSnapped ? '#ef4444' : '#e2e8f0'}" font-size="16" font-weight="bold">
                    ${tissue === 'brittle-test' ? 'Exercise 9: Mango Sapling Replaced by Sclerenchyma' : 'Sclerenchyma: Lignified Rigid Armor & Brittle Limit'}
                </text>

                <rect x="80" y="320" width="340" height="50" fill="#334155" rx="4" />

                ${!isSnapped ? `
                    <line x1="250" y1="320" x2="${tipX}" y2="${tipY}" stroke="#a16207" stroke-width="20" stroke-linecap="round" />
                    <text x="270" y="240" fill="#facc15" font-size="13">High Compressive Stiffness (Zero Flex)</text>
                ` : `
                    <line x1="250" y1="320" x2="250" y2="230" stroke="#a16207" stroke-width="20" />
                    <line x1="255" y1="225" x2="340" y2="270" stroke="#78350f" stroke-width="18" stroke-linecap="round" />
                    <path d="M 238 230 L 250 220 L 245 235 L 260 225" stroke="#ef4444" stroke-width="3" fill="none" />
                    <text x="270" y="210" fill="#ef4444" font-size="15" font-weight="bold">💥 BRITTLE SNAP (Fractured at 60 N!)</text>
                `}

                <g transform="translate(480, 50)">
                    <rect x="0" y="0" width="280" height="280" fill="#1e293b" stroke="#475569" stroke-width="2" rx="8" />
                    <text x="20" y="30" fill="#f87171" font-size="13" font-weight="bold">Micro-Structure: Lignified Armor</text>
                    
                    <rect x="70" y="70" width="140" height="120" fill="#78350f" stroke="#b45309" stroke-width="2" rx="6" />
                    <rect x="110" y="110" width="60" height="40" fill="#0f172a" stroke="#ca8a04" stroke-width="2" />
                    <text x="118" y="135" fill="#94a3b8" font-size="11">Narrow Lumen</text>
                    
                    <text x="20" y="220" fill="#e2e8f0" font-size="12">• Massive lignified secondary walls</text>
                    <text x="20" y="240" fill="#e2e8f0" font-size="12">• Dead protoplast (empty lumen)</text>
                    <text x="20" y="260" fill="#ef4444" font-size="12">• High strength, ZERO bending elasticity</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Tissue:</span> <span class="metric-val" style="color:#f87171;">Sclerenchyma (Dead)</span></div>
                <div class="metric"><span class="metric-lbl">Applied Force:</span> <span class="metric-val">${force} N</span></div>
                <div class="metric"><span class="metric-lbl">Elastic Strain:</span> <span class="metric-val">${isSnapped ? 'FAILED (Fractured)' : '0.4% (Brittle)'}</span></div>
                <div class="metric"><span class="metric-lbl">Status:</span> <span class="metric-val" style="color:${isSnapped ? '#ef4444' : '#eab308'};">${isSnapped ? 'Snapping Failure' : 'Rigid Holding'}</span></div>
            `;

            verdictHtml = isSnapped 
                ? `<strong>NCERT Exercise 9 Proven:</strong> If a young mango sapling's collenchyma were replaced by sclerenchyma, the brittle lignified walls would fail to dissipate dynamic bending energy, snapping cleanly in high winds.`
                : `<strong>Sclerenchyma Rigidity:</strong> Extreme compressive and tensile resistance due to lignin, ideal for coconut husks and seed armor, but lacks elasticity for wind-blown young stems.`;

        } else if (tissue === 'parenchyma') {
            svgContent = `
                <text x="40" y="40" fill="#86efac" font-size="16" font-weight="bold">Parenchyma: Living Matrix, Turgor Pressure & Intercellular Spaces</text>

                <g transform="translate(150, 80)">
                    <circle cx="100" cy="100" r="50" fill="#15803d" stroke="#86efac" stroke-width="2" opacity="0.8" />
                    <circle cx="180" cy="100" r="50" fill="#15803d" stroke="#86efac" stroke-width="2" opacity="0.8" />
                    <circle cx="140" cy="170" r="50" fill="#15803d" stroke="#86efac" stroke-width="2" opacity="0.8" />
                    
                    <circle cx="100" cy="100" r="32" fill="#0284c7" opacity="0.5" />
                    <circle cx="180" cy="100" r="32" fill="#0284c7" opacity="0.5" />
                    <circle cx="140" cy="170" r="32" fill="#0284c7" opacity="0.5" />
                    
                    <polygon points="140,115 155,135 125,135" fill="#f8fafc" opacity="0.7" />
                    <text x="170" y="140" fill="#f8fafc" font-size="12">Intercellular Air Space</text>

                    <circle cx="85" cy="85" r="4" fill="#fef08a" />
                    <circle cx="110" cy="115" r="5" fill="#fef08a" />
                    <circle cx="170" cy="90" r="4" fill="#fef08a" />
                    <circle cx="190" cy="110" r="5" fill="#fef08a" />
                </g>

                <g transform="translate(480, 50)">
                    <rect x="0" y="0" width="280" height="280" fill="#1e293b" stroke="#475569" stroke-width="2" rx="8" />
                    <text x="20" y="30" fill="#86efac" font-size="13" font-weight="bold">Parenchyma Cytology</text>
                    <text x="20" y="70" fill="#e2e8f0" font-size="12">• Thin primary cellulose wall</text>
                    <text x="20" y="100" fill="#e2e8f0" font-size="12">• Massive central sap vacuole (turgor)</text>
                    <text x="20" y="130" fill="#e2e8f0" font-size="12">• Prominent intercellular air spaces</text>
                    <text x="20" y="160" fill="#e2e8f0" font-size="12">• Stores starch, water, and nutrients</text>
                    <text x="20" y="200" fill="#38bdf8" font-size="12">Specialized forms:</text>
                    <text x="20" y="225" fill="#4ade80" font-size="11">🍃 Chlorenchyma (Photosynthesis)</text>
                    <text x="20" y="250" fill="#38bdf8" font-size="11">🪷 Aerenchyma (Aquatic Buoyancy)</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Tissue:</span> <span class="metric-val" style="color:#86efac;">Parenchyma (Living)</span></div>
                <div class="metric"><span class="metric-lbl">Wall Composition:</span> <span class="metric-val">Primary Cellulose</span></div>
                <div class="metric"><span class="metric-lbl">Intercellular Space:</span> <span class="metric-val">Large / Prominent</span></div>
                <div class="metric"><span class="metric-lbl">Primary Role:</span> <span class="metric-val">Storage & Osmotic Turgidity</span></div>
            `;

            verdictHtml = `<strong>Parenchyma Versatility:</strong> The unspecialized mother tissue of plants. Living, thin-walled, and versatile—differentiating into chlorenchyma for photosynthesis, aerenchyma for buoyancy, or dividing for wound healing.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 3. SIMULATION: Dual Vascular Engine Lab: Xylem & Phloem (sim-vascular-transport)
// =========================================================================
window.SIMS['sim-vascular-transport'] = {
    mount: function(container) {
        container.innerHTML = `
            <div class="sim-ui-wrapper">
                <div class="sim-toolbar">
                    <div class="sim-controls-row">
                        <button class="btn btn-primary btn-play">▶ Play</button>
                        <button class="btn btn-secondary btn-step">⏭ Step</button>
                        <button class="btn btn-outline btn-reset">↺ Reset</button>
                        <label class="sim-label">Scrubber: <input type="range" class="sim-scrubber" min="0" max="10" step="0.05" value="0"></label>
                    </div>
                    <div class="sim-presets-row">
                        <span class="preset-label">Presets:</span>
                        <button class="btn btn-sm btn-preset" data-preset="normal">Transpiration Pull (Normal Day)</button>
                        <button class="btn btn-sm btn-preset" data-preset="debarked">Exercise 8: Elephant Debarking (Phloem Cut)</button>
                        <button class="btn btn-sm btn-preset" data-preset="night">Nighttime (Zero Transpiration)</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Sunlight / Transpiration Intensity: <span class="val-sun">75%</span>
                        <input type="range" class="rng-sun" min="0" max="100" step="5" value="75">
                    </label>
                    <label class="control-item">
                        <input type="checkbox" class="chk-debarked"> Elephant Debarking (Sever Outer Phloem)
                    </label>
                </div>

                <div class="sim-stage-area">
                    <svg class="sim-svg" viewBox="0 0 800 420" width="100%" height="340" style="background:#0f172a; border-radius:12px;"></svg>
                </div>

                <div id="lab-readout" class="lab-metrics-panel"></div>
                <div id="lab-verdict" class="lab-verdict-box"></div>
            </div>
        `;

        const svg = container.querySelector('.sim-svg');
        const rngSun = container.querySelector('.rng-sun');
        const chkDebark = container.querySelector('.chk-debarked');
        const lblSun = container.querySelector('.val-sun');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.sun = 75;
        state.custom.debarked = false;

        function applyPreset(p) {
            if (p === 'normal') {
                state.custom.sun = 75;
                state.custom.debarked = false;
                chkDebark.checked = false;
            } else if (p === 'debarked') {
                state.custom.sun = 75;
                state.custom.debarked = true;
                chkDebark.checked = true;
            } else if (p === 'night') {
                state.custom.sun = 0;
                state.custom.debarked = false;
                chkDebark.checked = false;
            }
            rngSun.value = state.custom.sun;
            lblSun.textContent = state.custom.sun + '%';
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => applyPreset(btn.dataset.preset);
        });

        rngSun.oninput = (e) => {
            state.custom.sun = parseInt(e.target.value);
            lblSun.textContent = state.custom.sun + '%';
            this.draw(svg, state, container);
        };
        chkDebark.onchange = (e) => {
            state.custom.debarked = e.target.checked;
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const sun = state.custom.sun;
        const debarked = state.custom.debarked;
        const t = state.time;

        const xylemSpeed = (sun / 100) * 12;
        const phloemSpeed = debarked ? 0 : 8;

        let waterParticles = '';
        for (let i = 0; i < 7; i++) {
            const yPos = (340 - ((t * xylemSpeed * 6 + i * 45) % 300));
            waterParticles += `<circle cx="270" cy="${yPos}" r="5" fill="#38bdf8" />`;
            waterParticles += `<circle cx="290" cy="${(yPos + 20) % 300 + 40}" r="4" fill="#0284c7" />`;
        }

        let sugarParticles = '';
        if (!debarked) {
            for (let i = 0; i < 6; i++) {
                const yPos = 80 + ((t * phloemSpeed * 4 + i * 50) % 260);
                sugarParticles += `<circle cx="510" cy="${yPos}" r="6" fill="#facc15" />`;
                sugarParticles += `<circle cx="530" cy="${(yPos + 30) % 260 + 80}" r="5" fill="#eab308" />`;
            }
        }

        const svgContent = `
            <text x="40" y="35" fill="#f8fafc" font-size="16" font-weight="bold">Vascular Engine: Xylem Conduction vs Phloem Translocation</text>

            <rect x="200" y="45" width="400" height="35" fill="#15803d" rx="6" />
            <text x="320" y="68" fill="#fef08a" font-size="13" font-weight="bold">🌿 Photosynthetic Canopy (Sugar Source)</text>

            <rect x="200" y="360" width="400" height="45" fill="#3b2518" rx="6" />
            <text x="310" y="388" fill="#ca8a04" font-size="13" font-weight="bold">🌱 Root System (Water Source & Nutrient Sink)</text>

            <rect x="240" y="80" width="80" height="280" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2" rx="4" />
            <text x="250" y="105" fill="#7dd3fc" font-size="13" font-weight="bold">XYLEM</text>
            <text x="245" y="125" fill="#bae6fd" font-size="10">Tracheids & Vessels</text>
            <text x="245" y="140" fill="#38bdf8" font-size="10">Unidirectional ↑</text>
            <path d="M 280 320 L 280 270 M 275 280 L 280 270 L 285 280" stroke="#38bdf8" stroke-width="2" />
            <path d="M 280 220 L 280 170 M 275 180 L 280 170 L 285 180" stroke="#38bdf8" stroke-width="2" />
            ${waterParticles}

            <rect x="480" y="80" width="80" height="280" fill="#713f12" stroke="#eab308" stroke-width="2" rx="4" />
            <text x="490" y="105" fill="#fef08a" font-size="13" font-weight="bold">PHLOEM</text>
            <text x="485" y="125" fill="#fde047" font-size="10">Sieve Tubes & CC</text>
            <text x="485" y="140" fill="#eab308" font-size="10">Bidirectional ↕</text>

            ${!debarked ? `
                <path d="M 520 170 L 520 220 M 515 210 L 520 220 L 525 210" stroke="#facc15" stroke-width="2" />
                <path d="M 520 270 L 520 320 M 515 310 L 520 320 L 525 310" stroke="#facc15" stroke-width="2" />
                ${sugarParticles}
            ` : `
                <rect x="475" y="200" width="90" height="40" fill="#ef4444" stroke="#f87171" stroke-width="2" rx="3" />
                <line x1="475" y1="200" x2="565" y2="240" stroke="#ffffff" stroke-width="3" />
                <line x1="475" y1="240" x2="565" y2="200" stroke="#ffffff" stroke-width="3" />
                <text x="575" y="225" fill="#ef4444" font-size="12" font-weight="bold">✂️ Bark Stripped (Phloem Severed!)</text>
                <circle cx="520" cy="190" r="18" fill="#ca8a04" opacity="0.8" />
                <text x="575" y="195" fill="#ca8a04" font-size="11">Sugar Callus Swelling</text>
                <text x="575" y="320" fill="#ef4444" font-size="11">Roots Starving (0 ATP)</text>
            `}

            <g transform="translate(40, 160)">
                <rect x="0" y="0" width="180" height="150" fill="#1e293b" stroke="#334155" rx="6" />
                <text x="15" y="25" fill="#f8fafc" font-size="12" font-weight="bold">Legend & Status</text>
                <circle cx="25" cy="50" r="5" fill="#38bdf8" />
                <text x="40" y="55" fill="#94a3b8" font-size="11">Water + Mineral Sap</text>
                <circle cx="25" cy="80" r="5" fill="#facc15" />
                <text x="40" y="85" fill="#94a3b8" font-size="11">Sucrose Photoassimilates</text>
                <text x="15" y="115" fill="#38bdf8" font-size="11">Sun: ${sun}%</text>
                <text x="15" y="135" fill="${debarked ? '#ef4444' : '#22c55e'}" font-size="11">Phloem: ${debarked ? 'Severed' : 'Intact'}</text>
            </g>
        `;

        readoutHtml = `
            <div class="metric"><span class="metric-lbl">Xylem Water Flow:</span> <span class="metric-val" style="color:#38bdf8;">${(xylemSpeed * 1.5).toFixed(1)} L/hr</span></div>
            <div class="metric"><span class="metric-lbl">Phloem Sugar Flux:</span> <span class="metric-val" style="color:#facc15;">${debarked ? '0 μmol/s (BLOCKED)' : '48 μmol/s'}</span></div>
            <div class="metric"><span class="metric-lbl">Canopy Hydration:</span> <span class="metric-val" style="color:#22c55e;">100% (Turgid)</span></div>
            <div class="metric"><span class="metric-lbl">Root Viability:</span> <span class="metric-val" style="color:${debarked ? '#ef4444' : '#22c55e'};">${debarked ? 'Starving (No Sucrose)' : 'Nourished'}</span></div>
        `;

        verdictHtml = debarked
            ? `<strong>NCERT Exercise 8 Verification:</strong> Removing outer bark strips the <em>phloem</em>. Water transport up the deeper woody <em>xylem</em> continues unhindered (leaves stay green initially), but roots are cut off from photosynthetic food, starving to death in weeks.`
            : `<strong>Dual Vascular Operation:</strong> Xylem pulls water and inorganic minerals upwards via physical transpiration suction. Phloem distributes energy-rich sucrose bidirectionally from mature source leaves to sinks.`;

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 4. SIMULATION: Epithelial Permeability & Barriers Lab (sim-epithelial-barriers)
// =========================================================================
window.SIMS['sim-epithelial-barriers'] = {
    mount: function(container) {
        container.innerHTML = `
            <div class="sim-ui-wrapper">
                <div class="sim-toolbar">
                    <div class="sim-controls-row">
                        <button class="btn btn-primary btn-play">▶ Play</button>
                        <button class="btn btn-secondary btn-step">⏭ Step</button>
                        <button class="btn btn-outline btn-reset">↺ Reset</button>
                        <label class="sim-label">Scrubber: <input type="range" class="sim-scrubber" min="0" max="10" step="0.05" value="0"></label>
                    </div>
                    <div class="sim-presets-row">
                        <span class="preset-label">Presets:</span>
                        <button class="btn btn-sm btn-preset" data-type="squamous">Alveoli Diffusion (Simple Squamous)</button>
                        <button class="btn btn-sm btn-preset" data-type="stratified">Skin Armor (Stratified Squamous)</button>
                        <button class="btn btn-sm btn-preset" data-type="ciliated">Tracheal Escalator (Ciliated Columnar)</button>
                        <button class="btn btn-sm btn-preset" data-type="cuboidal">Kidney Reabsorption (Cuboidal)</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Epithelial Architecture:
                        <select class="sel-epi-type">
                            <option value="squamous">Simple Squamous (Ultra-thin Pavement - 0.3 μm)</option>
                            <option value="stratified">Stratified Squamous (Multi-layered Protective Shield - 50 μm)</option>
                            <option value="ciliated">Ciliated Columnar (Mucociliary Sweeper)</option>
                            <option value="cuboidal">Simple Cuboidal (Tubular Secretion & Reabsorption)</option>
                        </select>
                    </label>
                    <label class="control-item">Gas / Solute Concentration (mM): <span class="val-conc">80</span>
                        <input type="range" class="rng-conc" min="10" max="100" step="5" value="80">
                    </label>
                </div>

                <div class="sim-stage-area">
                    <svg class="sim-svg" viewBox="0 0 800 400" width="100%" height="320" style="background:#0f172a; border-radius:12px;"></svg>
                </div>

                <div id="lab-readout" class="lab-metrics-panel"></div>
                <div id="lab-verdict" class="lab-verdict-box"></div>
            </div>
        `;

        const svg = container.querySelector('.sim-svg');
        const selType = container.querySelector('.sel-epi-type');
        const rngConc = container.querySelector('.rng-conc');
        const lblConc = container.querySelector('.val-conc');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.type = 'squamous';
        state.custom.conc = 80;

        function setType(tp) {
            state.custom.type = tp;
            selType.value = tp;
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => setType(btn.dataset.type);
        });

        selType.onchange = (e) => setType(e.target.value);
        rngConc.oninput = (e) => {
            state.custom.conc = parseInt(e.target.value);
            lblConc.textContent = state.custom.conc;
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const type = state.custom.type;
        const conc = state.custom.conc;
        const t = state.time;

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (type === 'squamous') {
            const diffFlux = (conc * 0.95).toFixed(1);
            let diffusedDots = '';
            for (let i = 0; i < 15; i++) {
                const x = 120 + (i * 35 + t * 40) % 550;
                const y = 280 + Math.sin(x * 0.05 + t) * 20;
                diffusedDots += `<circle cx="${x}" cy="${y}" r="4" fill="#38bdf8" />`;
            }

            svgContent = `
                <text x="40" y="35" fill="#38bdf8" font-size="16" font-weight="bold">Simple Squamous Epithelium: Lung Alveoli Gas Diffusion (NCERT Ex 3 & 6A)</text>
                
                <rect x="80" y="60" width="640" height="90" fill="#1e293b" rx="4" />
                <text x="100" y="100" fill="#94a3b8" font-size="14">Alveolar Lumen (High O2 Concentration = ${conc} mM)</text>

                <rect x="80" y="150" width="640" height="24" fill="#0369a1" stroke="#38bdf8" stroke-width="2" />
                <ellipse cx="180" cy="162" rx="20" ry="5" fill="#082f49" />
                <ellipse cx="320" cy="162" rx="20" ry="5" fill="#082f49" />
                <ellipse cx="460" cy="162" rx="20" ry="5" fill="#082f49" />
                <ellipse cx="600" cy="162" rx="20" ry="5" fill="#082f49" />
                <text x="100" y="195" fill="#38bdf8" font-size="12">Single cell layer (Thickness Δx = 0.3 μm) on Basement Membrane</text>

                <rect x="80" y="220" width="640" height="110" fill="#881337" rx="4" />
                <text x="100" y="250" fill="#fecdd3" font-size="14">Capillary Lumen: Rapid Oxygen Diffusion Uptake</text>
                ${diffusedDots}
                
                <line x1="250" y1="120" x2="250" y2="240" stroke="#22c55e" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="450" y1="120" x2="450" y2="240" stroke="#22c55e" stroke-width="3" marker-end="url(#arrow)" />
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Architecture:</span> <span class="metric-val" style="color:#38bdf8;">Simple Squamous (1 Layer)</span></div>
                <div class="metric"><span class="metric-lbl">Barrier Thickness:</span> <span class="metric-val">0.3 μm (Minimal)</span></div>
                <div class="metric"><span class="metric-lbl">Diffusion Rate J:</span> <span class="metric-val" style="color:#22c55e;">${diffFlux} mmol/s·m² (100% Maximum)</span></div>
                <div class="metric"><span class="metric-lbl">Primary Role:</span> <span class="metric-val">Instant Gas Exchange</span></div>
            `;

            verdictHtml = `<strong>Fick's Law Proven (Exercise 3 & 6A):</strong> Diffusion rate $J \propto 1/\Delta x$. Because simple squamous is only one flat cell thick (0.3 μm), oxygen diffuses into red blood cells in milliseconds. A multi-layered barrier would cause fatal suffocation.`;

        } else if (type === 'stratified') {
            svgContent = `
                <text x="40" y="35" fill="#facc15" font-size="16" font-weight="bold">Stratified Squamous Epithelium: Skin Protection & Abrasion Resistance</text>

                <g transform="translate(80, 80)">
                    <rect x="0" y="0" width="640" height="30" fill="#78350f" stroke="#a16207" stroke-width="2" />
                    <text x="20" y="20" fill="#fde047" font-size="12">Stratum Corneum: Dead, keratinized, waterproof scales</text>

                    <rect x="0" y="30" width="640" height="40" fill="#b45309" />
                    <rect x="0" y="70" width="640" height="40" fill="#92400e" />
                    
                    <rect x="0" y="110" width="640" height="40" fill="#451a03" stroke="#eab308" stroke-width="2" />
                    <text x="20" y="135" fill="#facc15" font-size="12">Basal Germinative Layer (Continuous mitosis pushing cells upwards)</text>
                    
                    <line x1="0" y1="150" x2="640" y2="150" stroke="#f8fafc" stroke-width="3" stroke-dasharray="6,3" />
                    <text x="20" y="175" fill="#94a3b8" font-size="12">Extracellular Basement Membrane</text>

                    <rect x="0" y="180" width="640" height="70" fill="#1e293b" />
                    <text x="20" y="220" fill="#64748b" font-size="13">Dermis (Vascular connective tissue with collagen)</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Architecture:</span> <span class="metric-val" style="color:#facc15;">Stratified Squamous (40+ Layers)</span></div>
                <div class="metric"><span class="metric-lbl">Barrier Thickness:</span> <span class="metric-val">50.0 μm (160× Thicker!)</span></div>
                <div class="metric"><span class="metric-lbl">Diffusion Rate J:</span> <span class="metric-val" style="color:#ef4444;">0.01 mmol/s·m² (BLOCKED)</span></div>
                <div class="metric"><span class="metric-lbl">Abrasion Protection:</span> <span class="metric-val" style="color:#22c55e;">Maximum Shield (10/10)</span></div>
            `;

            verdictHtml = `<strong>Structural Trade-off:</strong> Stratified epithelium provides impenetrable physical defense against friction, microbial invasion, and water loss, but completely blocks diffusion. Ideal for skin, unsuitable for lungs.`;

        } else if (type === 'ciliated') {
            let ciliaSvg = '';
            for (let i = 0; i < 28; i++) {
                const x = 100 + i * 22;
                const slant = 12 * Math.sin(t * 6.0 + i * 0.4);
                ciliaSvg += `<line x1="${x}" y1="160" x2="${x + slant}" y2="120" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />`;
            }

            const mucusX = 100 + (t * 50) % 560;

            svgContent = `
                <text x="40" y="35" fill="#38bdf8" font-size="16" font-weight="bold">Ciliated Columnar Epithelium: Tracheal Mucociliary Escalator</text>

                <rect x="80" y="90" width="640" height="30" fill="#065f46" opacity="0.6" />
                <text x="100" y="110" fill="#6ee7b7" font-size="12">Sticky Mucus Coat (Trapping Inhaled Microbes & Dust)</text>
                <circle cx="${mucusX}" cy="105" r="8" fill="#a7f3d0" />
                <text x="${mucusX - 6}" y="110" fill="#064e3b" font-size="10" font-weight="bold">Dust</text>

                ${ciliaSvg}

                <rect x="80" y="160" width="640" height="150" fill="#047857" stroke="#10b981" stroke-width="2" />
                <ellipse cx="150" cy="270" rx="14" ry="22" fill="#064e3b" />
                <ellipse cx="230" cy="270" rx="14" ry="22" fill="#064e3b" />
                <ellipse cx="310" cy="270" rx="14" ry="22" fill="#064e3b" />
                <ellipse cx="390" cy="270" rx="14" ry="22" fill="#064e3b" />
                <ellipse cx="470" cy="270" rx="14" ry="22" fill="#064e3b" />
                <ellipse cx="550" cy="270" rx="14" ry="22" fill="#064e3b" />
                <ellipse cx="630" cy="270" rx="14" ry="22" fill="#064e3b" />
                
                <text x="100" y="200" fill="#a7f3d0" font-size="13">Tall Pillar-like Cells with Basal Oval Nuclei</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Architecture:</span> <span class="metric-val" style="color:#34d399;">Ciliated Columnar</span></div>
                <div class="metric"><span class="metric-lbl">Ciliary Beat Freq:</span> <span class="metric-val">12 Hz (Metachronal Wave)</span></div>
                <div class="metric"><span class="metric-lbl">Clearance Speed:</span> <span class="metric-val">15 mm / min</span></div>
                <div class="metric"><span class="metric-lbl">Function:</span> <span class="metric-val">Airway Debris Expulsion</span></div>
            `;

            verdictHtml = `<strong>Mucociliary Defense:</strong> Microscopic cilia beat rhythmically in metachronal waves, sweeping pathogen-laden mucus upward away from lungs toward the pharynx. Smoking paralyzes these cilia, causing chronic cough.`;

        } else if (type === 'cuboidal') {
            svgContent = `
                <text x="40" y="35" fill="#facc15" font-size="16" font-weight="bold">Simple Cuboidal Epithelium: Kidney Tubule Secretion & Reabsorption</text>

                <g transform="translate(80, 80)">
                    <rect x="0" y="0" width="640" height="70" fill="#1e293b" />
                    <text x="20" y="40" fill="#38bdf8" font-size="14">Nephron Tubule Lumen (Glomerular Filtrate: Glucose, Water, Salts)</text>

                    <rect x="0" y="70" width="640" height="100" fill="#ca8a04" stroke="#eab308" stroke-width="2" />
                    <circle cx="80" cy="120" r="22" fill="#713f12" />
                    <circle cx="180" cy="120" r="22" fill="#713f12" />
                    <circle cx="280" cy="120" r="22" fill="#713f12" />
                    <circle cx="380" cy="120" r="22" fill="#713f12" />
                    <circle cx="480" cy="120" r="22" fill="#713f12" />
                    <circle cx="580" cy="120" r="22" fill="#713f12" />
                    
                    <text x="20" y="195" fill="#fef08a" font-size="12">Cube-shaped Cells with Central Spherical Nuclei & Microvilli Brush Border</text>
                    <rect x="0" y="210" width="640" height="60" fill="#881337" />
                    <text x="20" y="245" fill="#fecdd3" font-size="13">Peritubular Capillary (Reabsorbed Solutes Enter Bloodstream)</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Architecture:</span> <span class="metric-val" style="color:#facc15;">Simple Cuboidal</span></div>
                <div class="metric"><span class="metric-lbl">Nucleus:</span> <span class="metric-val">Central & Spherical</span></div>
                <div class="metric"><span class="metric-lbl">Reabsorption Efficiency:</span> <span class="metric-val">99% Water / 100% Glucose</span></div>
                <div class="metric"><span class="metric-lbl">Locations:</span> <span class="metric-val">Kidney Tubules, Salivary Ducts</span></div>
            `;

            verdictHtml = `<strong>Metabolic Workhorse:</strong> Cuboidal cells are structurally optimized for active transport. Packed with mitochondria and apical microvilli, they reabsorb essential ions, amino acids, and water from kidney filtrate back into the blood.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 5. SIMULATION: Connective Tissue Biomechanics Lab (sim-connective-matrix)
// =========================================================================
window.SIMS['sim-connective-matrix'] = {
    mount: function(container) {
        container.innerHTML = `
            <div class="sim-ui-wrapper">
                <div class="sim-toolbar">
                    <div class="sim-controls-row">
                        <button class="btn btn-primary btn-play">▶ Play</button>
                        <button class="btn btn-secondary btn-step">⏭ Step</button>
                        <button class="btn btn-outline btn-reset">↺ Reset</button>
                        <label class="sim-label">Scrubber: <input type="range" class="sim-scrubber" min="0" max="10" step="0.05" value="0"></label>
                    </div>
                    <div class="sim-presets-row">
                        <span class="preset-label">Presets:</span>
                        <button class="btn btn-sm btn-preset" data-mode="tendon">Tendon Pull (Muscle to Bone)</button>
                        <button class="btn btn-sm btn-preset" data-mode="ligament">Ligament Stretch (Bone to Bone)</button>
                        <button class="btn btn-sm btn-preset" data-mode="bone-cart">Bone vs Cartilage Shock Test</button>
                        <button class="btn btn-sm btn-preset" data-mode="blood">Blood Smear Differential Count</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Connective Tissue Type:
                        <select class="sel-conn-mode">
                            <option value="tendon">Tendon (White Collagen, High Tensile Pull)</option>
                            <option value="ligament">Ligament (Yellow Elastic Fibers, Joint Stabilizer)</option>
                            <option value="bone-cart">Bone & Cartilage Matrix Comparison</option>
                            <option value="blood">Fluid Connective Tissue: Blood Components</option>
                        </select>
                    </label>
                    <label class="control-item">Applied Tensile / Compressive Force (N): <span class="val-load">400</span>
                        <input type="range" class="rng-load" min="0" max="1000" step="50" value="400">
                    </label>
                </div>

                <div class="sim-stage-area">
                    <svg class="sim-svg" viewBox="0 0 800 400" width="100%" height="320" style="background:#0f172a; border-radius:12px;"></svg>
                </div>

                <div id="lab-readout" class="lab-metrics-panel"></div>
                <div id="lab-verdict" class="lab-verdict-box"></div>
            </div>
        `;

        const svg = container.querySelector('.sim-svg');
        const selMode = container.querySelector('.sel-conn-mode');
        const rngLoad = container.querySelector('.rng-load');
        const lblLoad = container.querySelector('.val-load');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.mode = 'tendon';
        state.custom.load = 400;

        function setMode(m) {
            state.custom.mode = m;
            selMode.value = m;
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => setMode(btn.dataset.mode);
        });

        selMode.onchange = (e) => setMode(e.target.value);
        rngLoad.oninput = (e) => {
            state.custom.load = parseInt(e.target.value);
            lblLoad.textContent = state.custom.load;
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const mode = state.custom.mode;
        const load = state.custom.load;
        const t = state.time;

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (mode === 'tendon') {
            const isRuptured = load > 850;
            const stretchMm = isRuptured ? 35 : (load * 0.015);
            const tendonLength = 220 + stretchMm * 2.5;

            svgContent = `
                <text x="40" y="35" fill="#f8fafc" font-size="16" font-weight="bold">Tendon Biomechanics: Muscle-to-Bone Force Transmission (NCERT Ex 6-C)</text>

                <rect x="80" y="140" width="160" height="90" fill="#dc2626" rx="25" />
                <text x="110" y="190" fill="#fef2f2" font-size="14" font-weight="bold">Skeletal Muscle</text>

                ${!isRuptured ? `
                    <rect x="240" y="165" width="${tendonLength}" height="40" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
                    <line x1="245" y1="175" x2="${240 + tendonLength - 5}" y2="175" stroke="#cbd5e1" stroke-width="2" />
                    <line x1="245" y1="185" x2="${240 + tendonLength - 5}" y2="185" stroke="#cbd5e1" stroke-width="2" />
                    <line x1="245" y1="195" x2="${240 + tendonLength - 5}" y2="195" stroke="#cbd5e1" stroke-width="2" />
                    <text x="${260 + tendonLength * 0.2}" y="150" fill="#f8fafc" font-size="12">Tendon (Parallel White Collagen)</text>
                ` : `
                    <rect x="240" y="165" width="100" height="40" fill="#e2e8f0" />
                    <rect x="380" y="165" width="100" height="40" fill="#e2e8f0" />
                    <path d="M 340 165 L 355 185 L 342 205" stroke="#ef4444" stroke-width="4" fill="none" />
                    <text x="310" y="140" fill="#ef4444" font-size="14" font-weight="bold">💥 TENDON RUPTURE (Load > 850 N)</text>
                `}

                <rect x="${240 + tendonLength}" y="80" width="70" height="210" fill="#fef08a" stroke="#ca8a04" stroke-width="3" rx="10" />
                <text x="${245 + tendonLength}" y="190" fill="#854d0e" font-size="14" font-weight="bold">BONE</text>

                <path d="M 600 185 L 700 185 M 690 175 L 700 185 L 690 195" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
                <text x="610" y="165" fill="#38bdf8" font-size="14" font-weight="bold">Pull = ${load} N</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Tissue:</span> <span class="metric-val" style="color:#e2e8f0;">Tendon (White Collagen)</span></div>
                <div class="metric"><span class="metric-lbl">Connection:</span> <span class="metric-val">Muscle to Bone</span></div>
                <div class="metric"><span class="metric-lbl">Elongation:</span> <span class="metric-val">${stretchMm.toFixed(2)} mm (${((stretchMm/220)*100).toFixed(1)}% strain)</span></div>
                <div class="metric"><span class="metric-lbl">Mechanical State:</span> <span class="metric-val" style="color:${isRuptured ? '#ef4444' : '#22c55e'};">${isRuptured ? 'Torn / Ruptured' : 'Rigid Force Transfer'}</span></div>
            `;

            verdictHtml = `<strong>Tendon Physiology (Exercise 6-C):</strong> Tendons attach muscle to bone. Made of dense parallel bundles of white collagen fibers, they possess enormous tensile strength with limited elasticity, transferring muscular power directly to bone levers without stretch losses.`;

        } else if (mode === 'ligament') {
            const isSprained = load > 700;
            const stretchMm = (load * 0.05);

            svgContent = `
                <text x="40" y="35" fill="#fde047" font-size="16" font-weight="bold">Ligament Biomechanics: Bone-to-Bone Articular Stabilization</text>

                <rect x="140" y="110" width="130" height="150" fill="#fef08a" stroke="#ca8a04" stroke-width="3" rx="12" />
                <text x="170" y="190" fill="#854d0e" font-size="14" font-weight="bold">Bone A</text>

                <rect x="270" y="130" width="${100 + stretchMm * 2}" height="25" fill="#facc15" stroke="#ca8a04" stroke-width="2" rx="4" />
                <rect x="270" y="215" width="${100 + stretchMm * 2}" height="25" fill="#facc15" stroke="#ca8a04" stroke-width="2" rx="4" />
                <text x="280" y="115" fill="#fde047" font-size="12">Collateral Ligaments (Yellow Elastic Fibers)</text>

                <rect x="${370 + stretchMm * 2}" y="110" width="130" height="150" fill="#fef08a" stroke="#ca8a04" stroke-width="3" rx="12" />
                <text x="${400 + stretchMm * 2}" y="190" fill="#854d0e" font-size="14" font-weight="bold">Bone B</text>

                ${isSprained ? `
                    <text x="260" y="280" fill="#ef4444" font-size="14" font-weight="bold">⚠️ LIGAMENT SPRAIN (Excessive Strain > 25%!)</text>
                ` : `
                    <text x="270" y="280" fill="#22c55e" font-size="13">Joint Stabilized within Elastic Limit</text>
                `}
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Tissue:</span> <span class="metric-val" style="color:#facc15;">Ligament (Yellow Elastic)</span></div>
                <div class="metric"><span class="metric-lbl">Connection:</span> <span class="metric-val">Bone to Bone</span></div>
                <div class="metric"><span class="metric-lbl">Stretch / Elongation:</span> <span class="metric-val">${stretchMm.toFixed(1)} mm (${((stretchMm/100)*100).toFixed(1)}% strain)</span></div>
                <div class="metric"><span class="metric-lbl">Joint Security:</span> <span class="metric-val" style="color:${isSprained ? '#ef4444' : '#22c55e'};">${isSprained ? 'Sprained / Joint Unstable' : 'Secure & Flexible'}</span></div>
            `;

            verdictHtml = `<strong>Ligament Physiology:</strong> Ligaments bind bone to bone across synovial joints. Composed of yellow elastic fibers, they allow smooth joint articulation while preventing hyper-extension and joint dislocation.`;

        } else if (mode === 'bone-cart') {
            svgContent = `
                <text x="40" y="35" fill="#38bdf8" font-size="16" font-weight="bold">Skeletal Tissues: Mineralized Bone vs Resilient Cartilage Matrix</text>

                <g transform="translate(80, 70)">
                    <rect x="0" y="0" width="290" height="270" fill="#1e293b" stroke="#ca8a04" stroke-width="2" rx="8" />
                    <text x="20" y="30" fill="#fef08a" font-size="14" font-weight="bold">Bone (Osseous Tissue)</text>
                    
                    <circle cx="145" cy="130" r="80" fill="none" stroke="#713f12" stroke-width="3" />
                    <circle cx="145" cy="130" r="55" fill="none" stroke="#713f12" stroke-width="3" />
                    <circle cx="145" cy="130" r="30" fill="none" stroke="#713f12" stroke-width="3" />
                    <circle cx="145" cy="130" r="14" fill="#ef4444" />
                    <text x="110" y="135" fill="#fef2f2" font-size="9">Haversian</text>

                    <ellipse cx="100" cy="130" rx="6" ry="3" fill="#ca8a04" />
                    <ellipse cx="190" cy="130" rx="6" ry="3" fill="#ca8a04" />
                    <ellipse cx="145" cy="85" rx="3" ry="6" fill="#ca8a04" />
                    <ellipse cx="145" cy="175" rx="3" ry="6" fill="#ca8a04" />

                    <text x="20" y="230" fill="#ca8a04" font-size="11">• Hard matrix: Calcium phosphate & carbonate</text>
                    <text x="20" y="250" fill="#ca8a04" font-size="11">• Osteocytes trapped in lacunae with canaliculi</text>
                </g>

                <g transform="translate(420, 70)">
                    <rect x="0" y="0" width="290" height="270" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="8" />
                    <text x="20" y="30" fill="#7dd3fc" font-size="14" font-weight="bold">Cartilage (Chondral Tissue)</text>

                    <rect x="20" y="50" width="250" height="150" fill="#0369a1" opacity="0.3" rx="6" />
                    
                    <circle cx="80" cy="90" r="16" fill="#0284c7" />
                    <circle cx="80" cy="85" r="5" fill="#f8fafc" />
                    <circle cx="80" cy="95" r="5" fill="#f8fafc" />

                    <circle cx="180" cy="130" r="18" fill="#0284c7" />
                    <circle cx="175" cy="130" r="5" fill="#f8fafc" />
                    <circle cx="185" cy="130" r="5" fill="#f8fafc" />

                    <text x="20" y="230" fill="#38bdf8" font-size="11">• Flexible matrix: Chondrin proteins & sugars</text>
                    <text x="20" y="250" fill="#38bdf8" font-size="11">• Chondrocytes in lacunar nests (ear/nose/joints)</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Bone Hardness:</span> <span class="metric-val" style="color:#fef08a;">Mineralized (Rigid)</span></div>
                <div class="metric"><span class="metric-lbl">Cartilage Resilience:</span> <span class="metric-val" style="color:#38bdf8;">Chondrin (Compressible)</span></div>
                <div class="metric"><span class="metric-lbl">Vascularity:</span> <span class="metric-val">Bone (Rich) vs Cartilage (Avascular)</span></div>
                <div class="metric"><span class="metric-lbl">Repair Capacity:</span> <span class="metric-val">Bone (Fast) vs Cartilage (Slow)</span></div>
            `;

            verdictHtml = `<strong>Matrix Composition Defines Function:</strong> Bone matrix is hardened by insoluble calcium and phosphate minerals, providing a rigid structural scaffold. Cartilage matrix contains organic chondrin proteoglycans, providing smooth shock-absorbing cushions for articular joints.`;

        } else if (mode === 'blood') {
            let bloodCells = '';
            for (let i = 0; i < 35; i++) {
                const rx = 100 + (i * 37 + 15) % 580;
                const ry = 80 + (i * 47 + 25) % 240;
                bloodCells += `<ellipse cx="${rx}" cy="${ry}" rx="12" ry="10" fill="#dc2626" stroke="#991b1b" stroke-width="1.5" />`;
                bloodCells += `<circle cx="${rx}" cy="${ry}" r="4" fill="#b91c1c" />`;
            }

            svgContent = `
                <text x="40" y="35" fill="#f87171" font-size="16" font-weight="bold">Fluid Connective Tissue: Blood Smear Differential View (Activity 3.2)</text>

                <rect x="80" y="60" width="640" height="290" fill="#450a0a" stroke="#b91c1c" stroke-width="3" rx="8" />
                <text x="100" y="90" fill="#fca5a5" font-size="13">Fluid Matrix: Blood Plasma (Water, Albumin, Salts, Glucose)</text>

                ${bloodCells}

                <circle cx="280" cy="180" r="18" fill="#f8fafc" stroke="#3b82f6" stroke-width="2" />
                <path d="M 273 175 Q 280 185 287 175" fill="#1e3a8a" />
                <text x="240" y="215" fill="#93c5fd" font-size="11">WBC (Neutrophil)</text>

                <circle cx="500" cy="220" r="16" fill="#f8fafc" stroke="#8b5cf6" stroke-width="2" />
                <circle cx="500" cy="220" r="10" fill="#4c1d95" />
                <text x="470" y="250" fill="#c4b5fd" font-size="11">WBC (Lymphocyte)</text>

                <circle cx="380" cy="130" r="4" fill="#cbd5e1" />
                <circle cx="440" cy="160" r="3" fill="#cbd5e1" />
                <circle cx="340" cy="240" r="4" fill="#cbd5e1" />
                <text x="390" y="135" fill="#e2e8f0" font-size="10">Platelets</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Plasma Matrix:</span> <span class="metric-val">55% of Blood Volume</span></div>
                <div class="metric"><span class="metric-lbl">Erythrocytes (RBC):</span> <span class="metric-val" style="color:#ef4444;">~5 Million / mm³ (O2 Transport)</span></div>
                <div class="metric"><span class="metric-lbl">Leukocytes (WBC):</span> <span class="metric-val" style="color:#93c5fd;">6,000 - 8,000 / mm³ (Immunity)</span></div>
                <div class="metric"><span class="metric-lbl">Platelets:</span> <span class="metric-val">1.5 - 4.0 Lakhs / mm³ (Clotting)</span></div>
            `;

            verdictHtml = `<strong>Why Blood is a Connective Tissue:</strong> Like all connective tissues, blood consists of living cells suspended in an extracellular matrix (plasma). It chemically connects and integrates every organ system in the body through systemic circulation.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 6. SIMULATION: Muscle Motors & Neuron Communication Lab (sim-muscle-neuron)
// =========================================================================
window.SIMS['sim-muscle-neuron'] = {
    mount: function(container) {
        container.innerHTML = `
            <div class="sim-ui-wrapper">
                <div class="sim-toolbar">
                    <div class="sim-controls-row">
                        <button class="btn btn-primary btn-play">▶ Play</button>
                        <button class="btn btn-secondary btn-step">⏭ Step</button>
                        <button class="btn btn-outline btn-reset">↺ Reset</button>
                        <label class="sim-label">Scrubber: <input type="range" class="sim-scrubber" min="0" max="10" step="0.05" value="0"></label>
                    </div>
                    <div class="sim-presets-row">
                        <span class="preset-label">Presets:</span>
                        <button class="btn btn-sm btn-preset" data-view="cardiac">Tireless Heart Motor (Cardiac)</button>
                        <button class="btn btn-sm btn-preset" data-view="striated">Voluntary Skeletal (Striated)</button>
                        <button class="btn btn-sm btn-preset" data-view="smooth">Visceral Wave (Smooth)</button>
                        <button class="btn btn-sm btn-preset" data-view="neuron">Neuron Action Potential & Synapse</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Tissue Type:
                        <select class="sel-mn-view">
                            <option value="cardiac">Cardiac Muscle (Branched, Intercalated Discs, Never Fatigues)</option>
                            <option value="striated">Striated / Skeletal Muscle (Voluntary, Multinucleate)</option>
                            <option value="smooth">Smooth / Visceral Muscle (Involuntary, Spindle-shaped)</option>
                            <option value="neuron">Motor Neuron (Impulse Conduction & Synapse)</option>
                        </select>
                    </label>
                    <label class="control-item">Stimulation Rate: <span class="val-stim">72 bpm</span>
                        <input type="range" class="rng-stim" min="40" max="180" step="5" value="72">
                    </label>
                </div>

                <div class="sim-stage-area">
                    <svg class="sim-svg" viewBox="0 0 800 400" width="100%" height="320" style="background:#0f172a; border-radius:12px;"></svg>
                </div>

                <div id="lab-readout" class="lab-metrics-panel"></div>
                <div id="lab-verdict" class="lab-verdict-box"></div>
            </div>
        `;

        const svg = container.querySelector('.sim-svg');
        const selView = container.querySelector('.sel-mn-view');
        const rngStim = container.querySelector('.rng-stim');
        const lblStim = container.querySelector('.val-stim');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.view = 'cardiac';
        state.custom.stim = 72;

        function setView(v) {
            state.custom.view = v;
            selView.value = v;
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => setView(btn.dataset.view);
        });

        selView.onchange = (e) => setView(e.target.value);
        rngStim.oninput = (e) => {
            state.custom.stim = parseInt(e.target.value);
            lblStim.textContent = state.custom.stim + (state.custom.view === 'neuron' ? ' Hz' : ' bpm');
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const view = state.custom.view;
        const stim = state.custom.stim;
        const t = state.time;

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (view === 'cardiac') {
            const freq = (stim / 60) * 2.0;
            const beat = Math.sin(t * freq * Math.PI * 2);
            const scale = 1.0 + 0.08 * beat;

            svgContent = `
                <text x="40" y="35" fill="#f87171" font-size="16" font-weight="bold">Cardiac Muscle: Branched Architecture, Intercalated Discs & Tireless Rhythm</text>

                <g transform="translate(180, 110) scale(${scale})">
                    <path d="M 0 30 Q 120 10 240 30 T 400 30" fill="none" stroke="#be123c" stroke-width="26" stroke-linecap="round" />
                    <path d="M 160 30 Q 200 70 240 110" fill="none" stroke="#be123c" stroke-width="20" />
                    <path d="M 0 110 Q 120 130 240 110 T 400 110" fill="none" stroke="#be123c" stroke-width="26" stroke-linecap="round" />

                    <ellipse cx="100" cy="30" rx="14" ry="7" fill="#4c0519" />
                    <ellipse cx="320" cy="30" rx="14" ry="7" fill="#4c0519" />
                    <ellipse cx="120" cy="110" rx="14" ry="7" fill="#4c0519" />
                    <ellipse cx="340" cy="110" rx="14" ry="7" fill="#4c0519" />

                    <line x1="210" y1="17" x2="210" y2="43" stroke="#facc15" stroke-width="4" />
                    <line x1="260" y1="97" x2="260" y2="123" stroke="#facc15" stroke-width="4" />
                    <text x="215" y="10" fill="#facc15" font-size="12" font-weight="bold">Intercalated Disc (Gap Junctions)</text>
                </g>

                <g transform="translate(80, 270)">
                    <rect x="0" y="0" width="640" height="70" fill="#1e293b" stroke="#334155" rx="6" />
                    <text x="20" y="28" fill="#facc15" font-size="13" font-weight="bold">Mitochondrial Bioenergetics (Exercise 6-B):</text>
                    <text x="20" y="50" fill="#cbd5e1" font-size="12">Mitochondria make up 40% of cell volume + rich coronary capillary beds → continuous aerobic ATP synthesis → ZERO lactic acid fatigue!</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Heart Rate:</span> <span class="metric-val" style="color:#f87171;">${stim} bpm</span></div>
                <div class="metric"><span class="metric-lbl">Mitochondrial Fraction:</span> <span class="metric-val">40% Cell Volume (Massive)</span></div>
                <div class="metric"><span class="metric-lbl">Intercalated Discs:</span> <span class="metric-val" style="color:#facc15;">Electrical Syncytium</span></div>
                <div class="metric"><span class="metric-lbl">Fatigue Status:</span> <span class="metric-val" style="color:#22c55e;">IMMUNE (0% Lactic Acid)</span></div>
            `;

            verdictHtml = `<strong>Exercise 6-B Verified:</strong> Assertion & Reason are both TRUE. Cardiac muscle contracts continuously without fatigue because vast mitochondrial density and abundant blood supply keep ATP levels high via aerobic respiration throughout life.`;

        } else if (view === 'striated') {
            const contraction = Math.abs(Math.sin(t * 3.0));
            const width = 450 - contraction * 50;

            let sarcomereBands = '';
            for (let i = 0; i < 18; i++) {
                const x = 160 + i * 22;
                sarcomereBands += `<line x1="${x}" y1="120" x2="${x}" y2="200" stroke="#fecdd3" stroke-width="5" />`;
                sarcomereBands += `<line x1="${x + 11}" y1="120" x2="${x + 11}" y2="200" stroke="#991b1b" stroke-width="6" />`;
            }

            svgContent = `
                <text x="40" y="35" fill="#f87171" font-size="16" font-weight="bold">Striated / Skeletal Muscle: Voluntary Sarcomeric Contractile Engine</text>

                <rect x="150" y="120" width="${width}" height="80" fill="#b91c1c" stroke="#f87171" stroke-width="2" rx="12" />
                ${sarcomereBands}

                <ellipse cx="200" cy="124" rx="18" ry="6" fill="#1e1b4b" />
                <ellipse cx="360" cy="124" rx="18" ry="6" fill="#1e1b4b" />
                <ellipse cx="280" cy="196" rx="18" ry="6" fill="#1e1b4b" />
                <ellipse cx="440" cy="196" rx="18" ry="6" fill="#1e1b4b" />
                <text x="480" y="115" fill="#a5b4fc" font-size="12">Peripheral Nuclei (Multinucleate)</text>

                <g transform="translate(80, 260)">
                    <rect x="0" y="0" width="640" height="80" fill="#1e293b" stroke="#334155" rx="6" />
                    <text x="20" y="28" fill="#f87171" font-size="13" font-weight="bold">Skeletal Muscle Characteristics:</text>
                    <text x="20" y="50" fill="#cbd5e1" font-size="12">• Long, cylindrical, unbranched fibers with distinct Dark (A) and Light (I) bands.</text>
                    <text x="20" y="70" fill="#cbd5e1" font-size="12">• Voluntary control; contracts rapidly but fatigues during prolonged anaerobic glycolysis.</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Muscle Type:</span> <span class="metric-val" style="color:#f87171;">Striated (Skeletal)</span></div>
                <div class="metric"><span class="metric-lbl">Control:</span> <span class="metric-val">Voluntary (Somatic)</span></div>
                <div class="metric"><span class="metric-lbl">Nuclear State:</span> <span class="metric-val">Multinucleate (Syncytial)</span></div>
                <div class="metric"><span class="metric-lbl">Fatigue Rate:</span> <span class="metric-val" style="color:#ef4444;">Rapid (Lactic Acid Accumulation)</span></div>
            `;

            verdictHtml = `<strong>Sarcomere Sliding:</strong> Myosin thick filaments pull actin thin filaments inward to shorten the fiber. Because burst power demands outstrip aerobic supply, skeletal muscle fatigues under prolonged exertion.`;

        } else if (view === 'smooth') {
            const waveX = (t * 60) % 400;

            svgContent = `
                <text x="40" y="35" fill="#fde047" font-size="16" font-weight="bold">Smooth / Visceral Muscle: Spindle-Shaped Uninucleate Fibers</text>

                <g transform="translate(100, 100)">
                    <path d="M 50 50 Q 200 10 350 50 Q 200 90 50 50 Z" fill="#854d0e" stroke="#facc15" stroke-width="2" />
                    <ellipse cx="200" cy="50" rx="18" ry="8" fill="#422006" />

                    <path d="M 220 90 Q 370 50 520 90 Q 370 130 220 90 Z" fill="#854d0e" stroke="#facc15" stroke-width="2" />
                    <ellipse cx="370" cy="90" rx="18" ry="8" fill="#422006" />

                    <path d="M 80 120 Q 230 80 380 120 Q 230 160 80 120 Z" fill="#854d0e" stroke="#facc15" stroke-width="2" />
                    <ellipse cx="230" cy="120" rx="18" ry="8" fill="#422006" />

                    <text x="210" y="45" fill="#fef08a" font-size="11">Single Central Nucleus</text>
                </g>

                <ellipse cx="${180 + waveX}" cy="220" rx="40" ry="12" fill="#38bdf8" opacity="0.3" />
                <text x="250" y="270" fill="#38bdf8" font-size="13">Autonomic Involuntary Peristaltic Wave (Gut / Blood Vessels)</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Muscle Type:</span> <span class="metric-val" style="color:#fde047;">Smooth (Visceral)</span></div>
                <div class="metric"><span class="metric-lbl">Cell Morphology:</span> <span class="metric-val">Spindle-shaped (Fusiform)</span></div>
                <div class="metric"><span class="metric-lbl">Striations:</span> <span class="metric-val">None (Unstriated)</span></div>
                <div class="metric"><span class="metric-lbl">Contraction Style:</span> <span class="metric-val">Slow, Sustained, Fatigue-Resistant</span></div>
            `;

            verdictHtml = `<strong>Involuntary Smooth Action:</strong> Lining the digestive tract, blood vessels, and iris, smooth muscle provides rhythmic peristalsis and vasoconstriction without conscious voluntary effort.`;

        } else if (view === 'neuron') {
            const pulseX = 260 + ((t * 120) % 360);

            svgContent = `
                <text x="40" y="35" fill="#38bdf8" font-size="16" font-weight="bold">Neuron: High-Speed Electrochemical Action Potential Propagation</text>

                <polygon points="180,180 140,120 90,140 110,190 70,220 130,240 170,210" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2" />
                <line x1="140" y1="120" x2="110" y2="80" stroke="#60a5fa" stroke-width="3" />
                <line x1="90" y1="140" x2="50" y2="120" stroke="#60a5fa" stroke-width="3" />
                <line x1="70" y1="220" x2="40" y2="250" stroke="#60a5fa" stroke-width="3" />
                <text x="40" y="75" fill="#93c5fd" font-size="12" font-weight="bold">Dendrites (Input)</text>

                <circle cx="140" cy="180" r="16" fill="#172554" stroke="#93c5fd" stroke-width="2" />
                <text x="125" y="185" fill="#f8fafc" font-size="10">Nucleus</text>

                <line x1="180" y1="190" x2="650" y2="190" stroke="#60a5fa" stroke-width="6" />

                <rect x="230" y="172" width="60" height="36" fill="#ca8a04" rx="8" />
                <rect x="310" y="172" width="60" height="36" fill="#ca8a04" rx="8" />
                <rect x="390" y="172" width="60" height="36" fill="#ca8a04" rx="8" />
                <rect x="470" y="172" width="60" height="36" fill="#ca8a04" rx="8" />
                <rect x="550" y="172" width="60" height="36" fill="#ca8a04" rx="8" />
                
                <text x="292" y="165" fill="#facc15" font-size="10">Node</text>
                <text x="372" y="165" fill="#facc15" font-size="10">Node</text>
                <text x="380" y="235" fill="#ca8a04" font-size="12">Myelin Sheath (Lipid Insulation)</text>

                <circle cx="${pulseX}" cy="190" r="10" fill="#fde047" />
                <line x1="${pulseX - 15}" y1="190" x2="${pulseX + 15}" y2="190" stroke="#ffffff" stroke-width="4" />

                <path d="M 650 190 L 700 160 M 650 190 L 710 190 M 650 190 L 700 220" stroke="#3b82f6" stroke-width="3" />
                <circle cx="700" cy="160" r="6" fill="#ef4444" />
                <circle cx="710" cy="190" r="6" fill="#ef4444" />
                <circle cx="700" cy="220" r="6" fill="#ef4444" />
                <text x="660" y="245" fill="#f87171" font-size="12">Synaptic Knobs</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Structure:</span> <span class="metric-val" style="color:#60a5fa;">Multipolar Motor Neuron</span></div>
                <div class="metric"><span class="metric-lbl">Signal Direction:</span> <span class="metric-val">Dendrite → Cyton → Axon → Synapse</span></div>
                <div class="metric"><span class="metric-lbl">Conduction Velocity:</span> <span class="metric-val" style="color:#fde047;">100 m/s (Saltatory)</span></div>
                <div class="metric"><span class="metric-lbl">Synaptic Output:</span> <span class="metric-val">Neurotransmitter (Acetylcholine)</span></div>
            `;

            verdictHtml = `<strong>Neural Highway:</strong> Dendrites receive input signals, the cyton integrates them, and the axon transmits depolarization waves at up to 100 m/s via Nodes of Ranvier to synaptic terminals.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 7. SIMULATION: Joint Kinematics & Jump Mechanics Lab (sim-joints-biomechanics)
// =========================================================================
window.SIMS['sim-joints-biomechanics'] = {
    mount: function(container) {
        container.innerHTML = `
            <div class="sim-ui-wrapper">
                <div class="sim-toolbar">
                    <div class="sim-controls-row">
                        <button class="btn btn-primary btn-play">▶ Play</button>
                        <button class="btn btn-secondary btn-step">⏭ Step</button>
                        <button class="btn btn-outline btn-reset">↺ Reset</button>
                        <label class="sim-label">Scrubber: <input type="range" class="sim-scrubber" min="0" max="10" step="0.05" value="0"></label>
                    </div>
                    <div class="sim-presets-row">
                        <span class="preset-label">Presets:</span>
                        <button class="btn btn-sm btn-preset" data-jump="normal">Normal Jump (Cushioned Landing)</button>
                        <button class="btn btn-sm btn-preset" data-jump="stiff">Straight-Leg Jump (Shock Spike)</button>
                        <button class="btn btn-sm btn-preset" data-jump="ball-socket">Ball & Socket Shoulder (360°)</button>
                        <button class="btn btn-sm btn-preset" data-jump="pivot">Pivot Joint Neck Turn</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Joint / Landing Mode:
                        <select class="sel-joint-mode">
                            <option value="normal">Normal Jump Landing (Knees & Ankles Flex - Δt = 0.20 s)</option>
                            <option value="stiff">Straight-Leg Stiff Landing (Locked Joints - Δt = 0.015 s)</option>
                            <option value="ball-socket">Ball and Socket Articulation (Multi-axial)</option>
                            <option value="pivot">Pivot Articulation (Atlanto-Axial Neck)</option>
                        </select>
                    </label>
                    <label class="control-item">Jumper Body Mass (kg): <span class="val-mass">60</span>
                        <input type="range" class="rng-mass" min="40" max="100" step="5" value="60">
                    </label>
                </div>

                <div class="sim-stage-area">
                    <svg class="sim-svg" viewBox="0 0 800 400" width="100%" height="320" style="background:#0f172a; border-radius:12px;"></svg>
                </div>

                <div id="lab-readout" class="lab-metrics-panel"></div>
                <div id="lab-verdict" class="lab-verdict-box"></div>
            </div>
        `;

        const svg = container.querySelector('.sim-svg');
        const selMode = container.querySelector('.sel-joint-mode');
        const rngMass = container.querySelector('.rng-mass');
        const lblMass = container.querySelector('.val-mass');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.mode = 'normal';
        state.custom.mass = 60;

        function setMode(m) {
            state.custom.mode = m;
            selMode.value = m;
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => setMode(btn.dataset.jump);
        });

        selMode.onchange = (e) => setMode(e.target.value);
        rngMass.oninput = (e) => {
            state.custom.mass = parseInt(e.target.value);
            lblMass.textContent = state.custom.mass;
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const mode = state.custom.mode;
        const mass = state.custom.mass;
        const t = state.time;

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (mode === 'normal' || mode === 'stiff') {
            const isNormal = (mode === 'normal');
            const vImpact = 3.0;
            const deltaT = isNormal ? 0.20 : 0.015;
            const deltaP = mass * vImpact;
            const fImpact = (deltaP / deltaT);
            const gForce = (fImpact / (mass * 9.8)).toFixed(1);

            const groundY = 320;
            const cycle = (t * 2.0) % 4.0;
            const isLanded = cycle > 1.5;

            let hipY, kneeX, kneeY, ankleX, ankleY;
            if (isNormal) {
                const flex = isLanded ? Math.min(1.0, (cycle - 1.5) * 2.0) : 0;
                hipY = isLanded ? (200 + flex * 45) : (160 + (cycle / 1.5) * 40);
                kneeX = 380 + flex * 35;
                kneeY = hipY + 55;
                ankleX = 400;
                ankleY = groundY;
            } else {
                hipY = isLanded ? 200 : (160 + (cycle / 1.5) * 40);
                kneeX = 400;
                kneeY = hipY + 60;
                ankleX = 400;
                ankleY = groundY;
            }

            svgContent = `
                <text x="40" y="35" fill="${isNormal ? '#22c55e' : '#ef4444'}" font-size="16" font-weight="bold">
                    ${isNormal ? 'Normal Jump: Knee & Ankle Hinge Flexion (Cushioned Deceleration)' : 'Straight-Leg Jump: Rigid Locked Joints (Shockwave Spike - Ex 4 & 5)'}
                </text>

                <rect x="100" y="320" width="600" height="50" fill="#334155" rx="4" />
                <line x1="100" y1="320" x2="700" y2="320" stroke="#64748b" stroke-width="3" />

                <circle cx="400" cy="${hipY - 70}" r="20" fill="#f8fafc" />
                <line x1="400" y1="${hipY - 50}" x2="400" y2="${hipY}" stroke="#f8fafc" stroke-width="6" stroke-linecap="round" />
                <line x1="400" y1="${hipY - 35}" x2="${isNormal ? 430 : 410}" y2="${hipY - 10}" stroke="#f8fafc" stroke-width="5" stroke-linecap="round" />
                
                <line x1="400" y1="${hipY}" x2="${kneeX}" y2="${kneeY}" stroke="${isNormal ? '#4ade80' : '#f87171'}" stroke-width="7" stroke-linecap="round" />
                <line x1="${kneeX}" y1="${kneeY}" x2="${ankleX}" y2="${ankleY}" stroke="${isNormal ? '#4ade80' : '#f87171'}" stroke-width="7" stroke-linecap="round" />
                <line x1="${ankleX}" y1="${ankleY}" x2="${ankleX + 25}" y2="${ankleY}" stroke="#f8fafc" stroke-width="6" stroke-linecap="round" />

                ${isLanded && !isNormal ? `
                    <circle cx="400" cy="320" r="30" fill="none" stroke="#ef4444" stroke-width="4" opacity="0.8" />
                    <circle cx="400" cy="320" r="55" fill="none" stroke="#ef4444" stroke-width="3" opacity="0.5" />
                    <text x="440" y="290" fill="#ef4444" font-size="14" font-weight="bold">⚡ IMPACT: ${(fImpact / 1000).toFixed(1)} kN (${gForce}g!)</text>
                ` : isLanded ? `
                    <circle cx="400" cy="320" r="25" fill="none" stroke="#22c55e" stroke-width="2" opacity="0.6" />
                    <text x="440" y="270" fill="#22c55e" font-size="14" font-weight="bold">✓ CUSHIONED: ${(fImpact / 1000).toFixed(1)} kN (${gForce}g)</text>
                ` : ''}

                <g transform="translate(60, 80)">
                    <rect x="0" y="0" width="240" height="130" fill="#1e293b" stroke="#334155" rx="6" />
                    <text x="15" y="25" fill="#f8fafc" font-size="12" font-weight="bold">Impulse Physics Equation</text>
                    <text x="15" y="55" fill="#38bdf8" font-size="13">F = Δp / Δt = m·v / Δt</text>
                    <text x="15" y="85" fill="#94a3b8" font-size="11">Deceleration Δt: ${deltaT} s</text>
                    <text x="15" y="110" fill="${isNormal ? '#4ade80' : '#ef4444'}" font-size="11">Peak Force: ${(fImpact).toFixed(0)} N</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Jump Style:</span> <span class="metric-val" style="color:${isNormal ? '#22c55e' : '#ef4444'};">${isNormal ? 'Normal (Bent Joints)' : 'Straight-Leg (Stiff)'}</span></div>
                <div class="metric"><span class="metric-lbl">Deceleration Time Δt:</span> <span class="metric-val">${(deltaT * 1000).toFixed(0)} ms</span></div>
                <div class="metric"><span class="metric-lbl">Impact Force:</span> <span class="metric-val" style="color:${isNormal ? '#22c55e' : '#ef4444'};">${(fImpact).toFixed(0)} N (${gForce}g)</span></div>
                <div class="metric"><span class="metric-lbl">Articular Cartilage:</span> <span class="metric-val">${isNormal ? 'Safely Protected' : 'Severe Shock Trauma'}</span></div>
            `;

            verdictHtml = isNormal
                ? `<strong>Exercise 4 & 5 Kinematics:</strong> Bending the knee and ankle hinge joints prolongs deceleration time ($\Delta t \approx 200\text{ ms}$), dissipating momentum smoothly via eccentric quadriceps work and shielding bones from fracture.`
                : `<strong>Straight-Leg Trauma:</strong> Locking joints cuts stopping time down to $\approx 15\text{ ms}$. Force spikes to ${gForce} times body weight, transmitting bone-jarring shockwaves directly through articular cartilage and spinal vertebrae!`;

        } else if (mode === 'ball-socket') {
            const rot = (t * 60) % 360;
            const armX = 400 + Math.cos(rot * Math.PI / 180) * 110;
            const armY = 200 + Math.sin(rot * Math.PI / 180) * 110;

            svgContent = `
                <text x="40" y="35" fill="#38bdf8" font-size="16" font-weight="bold">Ball and Socket Joint: 360° Multi-Axial Articulation (Shoulder / Hip)</text>

                <path d="M 370 140 A 65 65 0 0 0 370 260 L 350 260 L 350 140 Z" fill="#ca8a04" stroke="#eab308" stroke-width="3" />
                <text x="270" y="205" fill="#fde047" font-size="12">Cup Socket</text>

                <circle cx="400" cy="200" r="45" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />
                <text x="390" y="205" fill="#854d0e" font-size="11" font-weight="bold">Ball</text>

                <line x1="400" y1="200" x2="${armX}" y2="${armY}" stroke="#fef08a" stroke-width="14" stroke-linecap="round" />
                <circle cx="${armX}" cy="${armY}" r="12" fill="#ca8a04" />

                <circle cx="400" cy="200" r="110" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" />
                <text x="480" y="110" fill="#38bdf8" font-size="13">Multi-Axial 3D Freedom (Flex, Extend, Abduct, Rotate)</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Joint Type:</span> <span class="metric-val" style="color:#38bdf8;">Ball and Socket</span></div>
                <div class="metric"><span class="metric-lbl">Freedom of Motion:</span> <span class="metric-val">3 Planes (Multi-axial)</span></div>
                <div class="metric"><span class="metric-lbl">Current Rotation:</span> <span class="metric-val">${rot.toFixed(0)}°</span></div>
                <div class="metric"><span class="metric-lbl">Anatomical Examples:</span> <span class="metric-val">Shoulder & Hip Joints</span></div>
            `;

            verdictHtml = `<strong>Ball and Socket Kinematics:</strong> The spherical head of one bone fits smoothly into the cup-like cavity of another, permitting universal rotational freedom in all three spatial planes.`;

        } else if (mode === 'pivot') {
            const angle = Math.sin(t * 3.0) * 60;

            svgContent = `
                <text x="40" y="35" fill="#facc15" font-size="16" font-weight="bold">Pivot Joint: Atlanto-Axial Neck Rotation (Atlas C1 & Axis C2)</text>

                <ellipse cx="400" cy="200" rx="90" ry="40" fill="none" stroke="#ca8a04" stroke-width="8" />
                <text x="240" y="205" fill="#fde047" font-size="12">Fibro-Osseous Ring (Atlas)</text>

                <ellipse cx="400" cy="200" rx="25" ry="18" fill="#fef08a" stroke="#a16207" stroke-width="3" />
                <text x="382" y="205" fill="#854d0e" font-size="10" font-weight="bold">Peg</text>

                <line x1="400" y1="200" x2="${400 + Math.sin(angle * Math.PI / 180) * 140}" y2="${200 - Math.cos(angle * Math.PI / 180) * 90}" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
                <circle cx="${400 + Math.sin(angle * Math.PI / 180) * 140}" cy="${200 - Math.cos(angle * Math.PI / 180) * 90}" r="14" fill="#0284c7" />
                <text x="450" y="100" fill="#38bdf8" font-size="13">Rotational Turning Angle: ${angle.toFixed(1)}°</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Joint Type:</span> <span class="metric-val" style="color:#facc15;">Pivot Joint (Trochoid)</span></div>
                <div class="metric"><span class="metric-lbl">Motion:</span> <span class="metric-val">Axial Rotation in 1 Plane</span></div>
                <div class="metric"><span class="metric-lbl">Rotation Angle:</span> <span class="metric-val">${angle.toFixed(1)}° (Side-to-Side)</span></div>
                <div class="metric"><span class="metric-lbl">Examples:</span> <span class="metric-val">Neck (Saying 'No') & Radioulnar</span></div>
            `;

            verdictHtml = `<strong>Pivot Joint Mechanics:</strong> A conical or cylindrical bony peg rotates within a stable ring formed of bone and ligaments, enabling head turning and forearm pronation/supination.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};
