// Chapter 11: Reproduction: How Life Continues - Interactive Simulation Suite
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
// 1. SIMULATION: Asexual Reproduction & Vegetative Propagation Lab (sim-asexual-propagation)
// =========================================================================
window.SIMS['sim-asexual-propagation'] = {
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
                        <span class="preset-label">Modes:</span>
                        <button class="btn btn-sm btn-preset" data-mode="yeast">Yeast Budding (Activity 11.1)</button>
                        <button class="btn btn-sm btn-preset" data-mode="potato">Potato Tuber 'Eyes' Sprouting</button>
                        <button class="btn btn-sm btn-preset" data-mode="grafting-good">Stem Grafting (Cambium Aligned)</button>
                        <button class="btn btn-sm btn-preset" data-mode="grafting-bad">Stem Grafting (Misaligned - Fails)</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Asexual Mechanism:
                        <select class="sel-asexual-mode">
                            <option value="yeast">Yeast Budding (Asymmetric Mitotic Division)</option>
                            <option value="potato">Potato Tuber Axillary Meristem Sprouting</option>
                            <option value="grafting-good">Horticultural Grafting: Aligned Vascular Cambium</option>
                            <option value="grafting-bad">Horticultural Grafting: Misaligned (Necrosis)</option>
                        </select>
                    </label>
                    <label class="control-item">Cambium Alignment (%): <span class="val-align">100%</span>
                        <input type="range" class="rng-align" min="0" max="100" step="5" value="100">
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
        const selMode = container.querySelector('.sel-asexual-mode');
        const rngAlign = container.querySelector('.rng-align');
        const lblAlign = container.querySelector('.val-align');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.mode = 'yeast';
        state.custom.align = 100;

        function setMode(m) {
            state.custom.mode = m;
            selMode.value = m;
            if (m === 'grafting-good') state.custom.align = 100;
            if (m === 'grafting-bad') state.custom.align = 20;
            rngAlign.value = state.custom.align;
            lblAlign.textContent = state.custom.align + '%';
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => setMode(btn.dataset.mode);
        });

        selMode.onchange = (e) => setMode(e.target.value);
        rngAlign.oninput = (e) => {
            state.custom.align = parseInt(e.target.value);
            lblAlign.textContent = state.custom.align + '%';
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const mode = state.custom.mode;
        const align = state.custom.align;
        const t = state.time;

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (mode === 'yeast') {
            const budSize = Math.min(30, 5 + t * 3.0);
            const detached = t > 7.0;
            const budX = detached ? (460 + (t - 7.0) * 15) : (390 + budSize * 0.8);

            svgContent = `
                <text x="40" y="35" fill="#facc15" font-size="16" font-weight="bold">Yeast Budding: Asymmetric Asexual Proliferation (Activity 11.1)</text>

                <!-- Mother Cell -->
                <circle cx="350" cy="200" r="55" fill="#ca8a04" stroke="#fef08a" stroke-width="3" />
                <circle cx="350" cy="200" r="18" fill="#713f12" />
                <text x="325" y="205" fill="#fef08a" font-size="12">Nucleus</text>
                <text x="310" y="280" fill="#facc15" font-size="13">Mother Yeast Cell</text>

                <!-- Growing Daughter Bud -->
                <circle cx="${budX}" cy="180" r="${budSize}" fill="#eab308" stroke="#fef08a" stroke-width="2" />
                ${budSize > 15 ? `<circle cx="${budX}" cy="180" r="${budSize * 0.35}" fill="#713f12" />` : ''}
                <text x="${budX - 25}" y="${180 - budSize - 10}" fill="#fde047" font-size="12">
                    ${detached ? 'Detached Clone' : 'Emerging Bud'}
                </text>

                <!-- Annotation Card -->
                <g transform="translate(80, 80)">
                    <rect x="0" y="0" width="200" height="110" fill="#1e293b" stroke="#334155" rx="6" />
                    <text x="15" y="25" fill="#f8fafc" font-size="12" font-weight="bold">Yeast Characteristics</text>
                    <text x="15" y="50" fill="#94a3b8" font-size="11">• Unicellular Ascomycete fungus</text>
                    <text x="15" y="70" fill="#94a3b8" font-size="11">• Uniparental mitosis</text>
                    <text x="15" y="90" fill="#4ade80" font-size="11">• 100% Genetically identical</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Mode:</span> <span class="metric-val" style="color:#facc15;">Unicellular Budding</span></div>
                <div class="metric"><span class="metric-lbl">Daughter Clones:</span> <span class="metric-val">${detached ? '2 Independent Cells' : 'Budding in Progress'}</span></div>
                <div class="metric"><span class="metric-lbl">Genetic Identity:</span> <span class="metric-val" style="color:#22c55e;">100% Clonal Match</span></div>
                <div class="metric"><span class="metric-lbl">Meiosis / Gametes:</span> <span class="metric-val">NONE (Mitosis Only)</span></div>
            `;

            verdictHtml = `<strong>Activity 11.1 Verification:</strong> Yeast cells form asymmetric bulb-like protuberances (buds). Mitotic nuclear division supplies a copy of the genome, producing genetically identical daughter clones without gametes.`;

        } else if (mode === 'potato') {
            const shootH = Math.min(110, 20 + t * 9.0);

            svgContent = `
                <text x="40" y="35" fill="#4ade80" font-size="16" font-weight="bold">Potato Tuber: Axillary Meristem 'Eyes' Sprouting (Activity 11.2)</text>

                <!-- Soil Bed -->
                <rect x="100" y="240" width="600" height="130" fill="#2d1c14" rx="6" />
                <line x1="100" y1="240" x2="700" y2="240" stroke="#78350f" stroke-width="3" />
                <text x="120" y="260" fill="#ca8a04" font-size="12">Moist Garden Soil Substrate</text>

                <!-- Potato Tuber underground -->
                <ellipse cx="400" cy="270" rx="90" ry="55" fill="#854d0e" stroke="#a16207" stroke-width="3" />
                <text x="360" y="275" fill="#fef08a" font-size="14" font-weight="bold">Potato Tuber</text>

                <!-- Eyes / Nodes with adventitious buds -->
                <ellipse cx="360" cy="240" rx="8" ry="4" fill="#451a03" />
                <ellipse cx="440" cy="245" rx="8" ry="4" fill="#451a03" />
                <text x="460" y="250" fill="#fde047" font-size="11">'Eye' (Axillary Meristem)</text>

                <!-- Sprouting Green Aerial Shoot -->
                <path d="M 360 240 Q 355 ${240 - shootH * 0.6} 350 ${240 - shootH}" stroke="#22c55e" stroke-width="6" fill="none" stroke-linecap="round" />
                <ellipse cx="340" cy="${240 - shootH * 0.7}" rx="14" ry="7" fill="#16a34a" transform="rotate(-25 340 ${240 - shootH * 0.7})" />
                <ellipse cx="365" cy="${240 - shootH * 0.7}" rx="14" ry="7" fill="#16a34a" transform="rotate(25 365 ${240 - shootH * 0.7})" />

                <!-- Underground Adventitious Roots -->
                <line x1="360" y1="270" x2="340" y2="330" stroke="#fef08a" stroke-width="2" />
                <line x1="360" y1="270" x2="375" y2="340" stroke="#fef08a" stroke-width="2" />
                <text x="380" y="340" fill="#fde047" font-size="11">Adventitious Roots</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Organ:</span> <span class="metric-val" style="color:#fde047;">Modified Underground Stem</span></div>
                <div class="metric"><span class="metric-lbl">Active Site:</span> <span class="metric-val">'Eyes' (Nodal Meristems)</span></div>
                <div class="metric"><span class="metric-lbl">Shoot Height:</span> <span class="metric-val">${(shootH / 8).toFixed(1)} cm</span></div>
                <div class="metric"><span class="metric-lbl">Offspring Type:</span> <span class="metric-val" style="color:#22c55e;">Clonal Plantlet</span></div>
            `;

            verdictHtml = `<strong>Natural Vegetative Propagation:</strong> Potato tubers are modified underground stems whose 'eyes' are nodes with dormant buds. In moist soil, mitotic division sprouts new root systems and aerial shoots without seeds.`;

        } else if (mode.startsWith('grafting')) {
            const isGood = align >= 70;
            const shiftX = (100 - align) * 0.5;

            svgContent = `
                <text x="40" y="35" fill="${isGood ? '#22c55e' : '#ef4444'}" font-size="16" font-weight="bold">
                    Horticultural Grafting: ${isGood ? 'Vascular Cambium Aligned (Union Heals)' : 'Misaligned Cambium (Vascular Starvation & Death)'}
                </text>

                <!-- Stock (Rooted hardy base) -->
                <rect x="360" y="210" width="80" height="150" fill="#78350f" stroke="#a16207" stroke-width="3" rx="4" />
                <text x="375" y="290" fill="#fef08a" font-size="14" font-weight="bold">STOCK</text>
                <text x="365" y="310" fill="#cbd5e1" font-size="11">Rooted Base</text>

                <!-- Scion (Desirable shoot cultivar) -->
                <rect x="${360 + shiftX}" y="70" width="80" height="140" fill="#15803d" stroke="#22c55e" stroke-width="3" rx="4" />
                <text x="${375 + shiftX}" y="130" fill="#fef08a" font-size="14" font-weight="bold">SCION</text>
                <text x="${365 + shiftX}" y="150" fill="#86efac" font-size="11">Fruit Cultivar</text>

                <!-- Cambium Interface Lines -->
                <line x1="365" y1="210" x2="365" y2="350" stroke="#facc15" stroke-width="3" stroke-dasharray="4,2" />
                <line x1="${365 + shiftX}" y1="70" x2="${365 + shiftX}" y2="210" stroke="#facc15" stroke-width="3" stroke-dasharray="4,2" />

                <!-- Binding Tape / Graft Joint -->
                <rect x="345" y="195" width="110" height="30" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,3" />
                <text x="470" y="215" fill="#38bdf8" font-size="12">Graft Union Joint</text>

                ${isGood ? `
                    <text x="470" y="180" fill="#22c55e" font-size="13" font-weight="bold">✓ Cambium Merged (${align}%)</text>
                    <text x="470" y="240" fill="#86efac" font-size="11">Vascular bundles connect smoothly</text>
                ` : `
                    <text x="470" y="180" fill="#ef4444" font-size="13" font-weight="bold">❌ Cambium Misaligned (${align}%)</text>
                    <text x="470" y="240" fill="#fca5a5" font-size="11">Zero sap bridge → Scion withers</text>
                `}
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Technique:</span> <span class="metric-val">Artificial Stem Grafting</span></div>
                <div class="metric"><span class="metric-lbl">Cambium Alignment:</span> <span class="metric-val" style="color:${isGood ? '#22c55e' : '#ef4444'};">${align}%</span></div>
                <div class="metric"><span class="metric-lbl">Vascular Continuity:</span> <span class="metric-val">${isGood ? 'Established (Xylem + Phloem)' : 'Blocked'}</span></div>
                <div class="metric"><span class="metric-lbl">Graft Status:</span> <span class="metric-val" style="color:${isGood ? '#22c55e' : '#ef4444'};">${isGood ? 'SUCCESSFUL HEALING' : 'GRAFT FAILURE'}</span></div>
            `;

            verdictHtml = isGood
                ? `<strong>Horticultural Mechanics:</strong> Aligning the lateral meristem (vascular cambium) of stock and scion allows dividing cells to produce secondary xylem and phloem across the cut, ensuring water and sugar conduction.`
                : `<strong>Graft Failure Warning:</strong> Misalignment prevents vascular union. Without xylem sap reaching the scion or phloem sugars feeding the rootstock, the scion desiccates and dies.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 2. SIMULATION: Floral Reproductive Architecture & Meiosis (sim-floral-anatomy)
// =========================================================================
window.SIMS['sim-floral-anatomy'] = {
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
                        <span class="preset-label">Flower Models:</span>
                        <button class="btn btn-sm btn-preset" data-flower="bisexual">Bisexual Complete (Hibiscus)</button>
                        <button class="btn btn-sm btn-preset" data-flower="male">Male Unisexual (Papaya Staminate)</button>
                        <button class="btn btn-sm btn-preset" data-flower="female">Female Unisexual (Papaya Pistillate)</button>
                        <button class="btn btn-sm btn-preset" data-flower="meiosis">Meiosis Chromosome Halving (2n → n)</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Floral / Genetic View:
                        <select class="sel-flower-type">
                            <option value="bisexual">Bisexual Complete Flower (Stamens + Pistil)</option>
                            <option value="male">Male Unisexual Flower (Stamens Only - No Fruit!)</option>
                            <option value="female">Female Unisexual Flower (Pistil Only - Fruit Bearing)</option>
                            <option value="meiosis">Meiotic Reduction & Recombination (2n → n)</option>
                        </select>
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
        const selFlower = container.querySelector('.sel-flower-type');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.flower = 'bisexual';

        function setFlower(f) {
            state.custom.flower = f;
            selFlower.value = f;
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => setFlower(btn.dataset.flower);
        });

        selFlower.onchange = (e) => setFlower(e.target.value);

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const flower = state.custom.flower;
        const t = state.time;

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (flower === 'bisexual' || flower === 'male' || flower === 'female') {
            const hasStamens = (flower === 'bisexual' || flower === 'male');
            const hasPistil = (flower === 'bisexual' || flower === 'female');

            svgContent = `
                <text x="40" y="35" fill="#f8fafc" font-size="16" font-weight="bold">
                    Floral Architecture: ${flower === 'bisexual' ? 'Bisexual Hermaphrodite (Hibiscus)' : flower === 'male' ? 'Male Staminate (Papaya - Cannot Bear Fruit!)' : 'Female Pistillate (Papaya - Fruit Bearing)'}
                </text>

                <!-- Receptacle & Sepals (Calyx) -->
                <path d="M 370 340 L 400 370 L 430 340 Z" fill="#15803d" stroke="#166534" stroke-width="2" />
                <path d="M 350 330 Q 320 310 300 320" stroke="#16a34a" stroke-width="8" fill="none" stroke-linecap="round" />
                <path d="M 450 330 Q 480 310 500 320" stroke="#16a34a" stroke-width="8" fill="none" stroke-linecap="round" />
                <text x="250" y="345" fill="#4ade80" font-size="12">Calyx (Sepals)</text>

                <!-- Petals (Corolla) -->
                <path d="M 350 330 Q 240 220 220 120 Q 320 160 370 240" fill="#f43f5e" opacity="0.8" />
                <path d="M 450 330 Q 560 220 580 120 Q 480 160 430 240" fill="#f43f5e" opacity="0.8" />
                <text x="140" y="160" fill="#fda4af" font-size="13">Corolla (Petals)</text>

                ${hasPistil ? `
                    <!-- Gynoecium (Pistil) -->
                    <!-- Ovary -->
                    <ellipse cx="400" cy="290" rx="35" ry="40" fill="#047857" stroke="#10b981" stroke-width="3" />
                    <!-- Ovules inside locule -->
                    <circle cx="390" cy="285" r="7" fill="#fef08a" />
                    <circle cx="410" cy="285" r="7" fill="#fef08a" />
                    <circle cx="400" cy="305" r="7" fill="#fef08a" />
                    <text x="445" y="295" fill="#6ee7b7" font-size="12">Ovary (Ovules inside)</text>

                    <!-- Style -->
                    <line x1="400" y1="250" x2="400" y2="120" stroke="#10b981" stroke-width="8" />
                    <text x="415" y="180" fill="#6ee7b7" font-size="12">Style</text>

                    <!-- Stigma -->
                    <ellipse cx="400" cy="115" rx="20" ry="8" fill="#be123c" stroke="#f43f5e" stroke-width="3" />
                    <text x="425" y="115" fill="#f43f5e" font-size="12" font-weight="bold">Stigma (Receptive Platform)</text>
                ` : `
                    <text x="350" y="250" fill="#ef4444" font-size="14" font-weight="bold">❌ NO PISTIL / OVARY</text>
                    <text x="330" y="275" fill="#ef4444" font-size="11">Cannot form seeds or fruit!</text>
                `}

                ${hasStamens ? `
                    <!-- Androecium (Stamens) -->
                    <!-- Left Stamen -->
                    <path d="M 380 270 Q 330 200 320 140" stroke="#facc15" stroke-width="4" fill="none" />
                    <ellipse cx="320" cy="135" rx="10" ry="6" fill="#ca8a04" stroke="#eab308" stroke-width="2" />
                    <!-- Right Stamen -->
                    <path d="M 420 270 Q 470 200 480 140" stroke="#facc15" stroke-width="4" fill="none" />
                    <ellipse cx="480" cy="135" rx="10" ry="6" fill="#ca8a04" stroke="#eab308" stroke-width="2" />
                    <text x="495" y="140" fill="#fde047" font-size="12">Anther (Pollen Grains)</text>
                ` : `
                    <text x="350" y="200" fill="#ef4444" font-size="13" font-weight="bold">❌ NO STAMENS</text>
                `}
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Flower Type:</span> <span class="metric-val" style="color:#f43f5e;">${flower.toUpperCase()}</span></div>
                <div class="metric"><span class="metric-lbl">Stamens (Male):</span> <span class="metric-val">${hasStamens ? 'Present (Pollen Producer)' : 'Absent'}</span></div>
                <div class="metric"><span class="metric-lbl">Pistil (Female):</span> <span class="metric-val">${hasPistil ? 'Present (Ovary & Ovules)' : 'Absent'}</span></div>
                <div class="metric"><span class="metric-lbl">Fruit Potential:</span> <span class="metric-val" style="color:${hasPistil ? '#22c55e' : '#ef4444'};">${hasPistil ? 'Can Ripen into Fruit' : 'CANNOT Bear Fruit (Ex 11)'}</span></div>
            `;

            verdictHtml = flower === 'male'
                ? `<strong>NCERT Exercise 11 Deductions:</strong> Male papaya flowers possess stamens but zero ovaries. Because botanical fruits develop strictly from fertilized ovaries, male papaya trees can never bear fruit.`
                : flower === 'female'
                ? `<strong>Unisexual Female Flower:</strong> Possesses the ovary and ovules. Upon receiving cross-pollen from a male tree via wind or insect, it develops into a mature papaya fruit.`
                : `<strong>Bisexual Completeness:</strong> Possesses all 4 floral whorls (sepals, petals, stamens, pistil), capable of either self-pollination or cross-pollination.`;

        } else if (flower === 'meiosis') {
            // Meiosis Chromosome Halving
            svgContent = `
                <text x="40" y="35" fill="#38bdf8" font-size="16" font-weight="bold">Meiosis: Reduction Division (2n = 46 → n = 23 Gametes)</text>

                <!-- Diploid Mother Germ Cell -->
                <g transform="translate(100, 100)">
                    <circle cx="80" cy="80" r="60" fill="#1e3a8a" stroke="#3b82f6" stroke-width="3" />
                    <line x1="60" y1="50" x2="60" y2="110" stroke="#f43f5e" stroke-width="8" stroke-linecap="round" />
                    <line x1="80" y1="50" x2="80" y2="110" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" />
                    <text x="30" y="165" fill="#93c5fd" font-size="13" font-weight="bold">Diploid Germ Cell (2n = 46)</text>
                </g>

                <!-- Arrow Meiosis I & II -->
                <path d="M 280 180 L 370 180 M 360 170 L 370 180 L 360 190" stroke="#facc15" stroke-width="4" stroke-linecap="round" />
                <text x="290" y="160" fill="#facc15" font-size="12" font-weight="bold">Meiosis I + II</text>
                <text x="290" y="210" fill="#94a3b8" font-size="11">Crossing Over</text>

                <!-- 4 Haploid Gametes -->
                <g transform="translate(420, 50)">
                    <circle cx="50" cy="50" r="35" fill="#065f46" stroke="#10b981" stroke-width="2" />
                    <line x1="50" y1="35" x2="50" y2="65" stroke="#f43f5e" stroke-width="5" stroke-linecap="round" />
                    <text x="35" y="55" fill="#fef08a" font-size="11">n=23</text>

                    <circle cx="150" cy="50" r="35" fill="#065f46" stroke="#10b981" stroke-width="2" />
                    <line x1="150" y1="35" x2="150" y2="65" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
                    <text x="135" y="55" fill="#fef08a" font-size="11">n=23</text>

                    <circle cx="50" cy="150" r="35" fill="#065f46" stroke="#10b981" stroke-width="2" />
                    <line x1="50" y1="135" x2="50" y2="165" stroke="#f43f5e" stroke-width="5" stroke-linecap="round" />
                    <text x="35" y="155" fill="#fef08a" font-size="11">n=23</text>

                    <circle cx="150" cy="150" r="35" fill="#065f46" stroke="#10b981" stroke-width="2" />
                    <line x1="150" y1="135" x2="150" y2="165" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
                    <text x="135" y="155" fill="#fef08a" font-size="11">n=23</text>

                    <text x="50" y="215" fill="#34d399" font-size="13" font-weight="bold">4 Haploid Gametes (n = 23 each)</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Parent Cell:</span> <span class="metric-val">Diploid (2n = 46)</span></div>
                <div class="metric"><span class="metric-lbl">Gametes Formed:</span> <span class="metric-val">4 Haploid Cells (n = 23)</span></div>
                <div class="metric"><span class="metric-lbl">Recombination:</span> <span class="metric-val" style="color:#facc15;">Crossing Over at Chiasmata</span></div>
                <div class="metric"><span class="metric-lbl">Zygote Count:</span> <span class="metric-val" style="color:#22c55e;">Restores 2n = 46 upon Syngamy</span></div>
            `;

            verdictHtml = `<strong>Chromosome Conservation:</strong> Meiosis ensures species chromosome count stability by halving the ploidy from 2n to n. Gametic fusion at fertilisation reconstitutes exactly 2n = 46 in the offspring.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 3. SIMULATION: Pollination Ecology & Apple Orchard Apiculture (sim-pollination-ecology)
// =========================================================================
window.SIMS['sim-pollination-ecology'] = {
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
                        <button class="btn btn-sm btn-preset" data-mode="place-a">Place A: Natural Pollinators Alone</button>
                        <button class="btn btn-sm btn-preset" data-mode="place-b">Place B: Integrated Beekeeping</button>
                        <button class="btn btn-sm btn-preset" data-mode="night">Night Flower Moonlight Contrast</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Managed Beehives / Hectare: <span class="val-bees">0</span>
                        <input type="range" class="rng-bees" min="0" max="8" step="1" value="0">
                    </label>
                    <label class="control-item">
                        <input type="checkbox" class="chk-night"> Night-Blooming Mode (Moonlight Contrast)
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
        const rngBees = container.querySelector('.rng-bees');
        const chkNight = container.querySelector('.chk-night');
        const lblBees = container.querySelector('.val-bees');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.bees = 0;
        state.custom.night = false;

        function setPreset(p) {
            if (p === 'place-a') {
                state.custom.bees = 0;
                state.custom.night = false;
                chkNight.checked = false;
            } else if (p === 'place-b') {
                state.custom.bees = 5;
                state.custom.night = false;
                chkNight.checked = false;
            } else if (p === 'night') {
                state.custom.bees = 2;
                state.custom.night = true;
                chkNight.checked = true;
            }
            rngBees.value = state.custom.bees;
            lblBees.textContent = state.custom.bees;
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => setPreset(btn.dataset.mode);
        });

        rngBees.oninput = (e) => {
            state.custom.bees = parseInt(e.target.value);
            lblBees.textContent = state.custom.bees;
            this.draw(svg, state, container);
        };
        chkNight.onchange = (e) => {
            state.custom.night = e.target.checked;
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const bees = state.custom.bees;
        const night = state.custom.night;
        const t = state.time;

        const fruitSetPct = Math.min(85, 28 + bees * 8.5);
        const fruitDropPct = Math.max(8, 52 - bees * 7.5);
        const netYieldFactor = ((fruitSetPct * (100 - fruitDropPct)) / (28 * (100 - 52))).toFixed(1);

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (!night) {
            // Apple Orchard Simulation (Place A vs Place B - Exercise 12)
            let flyingBees = '';
            for (let i = 0; i < bees * 3; i++) {
                const bx = 200 + ((t * 80 + i * 70) % 450);
                const by = 120 + Math.sin(bx * 0.08 + i) * 35;
                flyingBees += `<circle cx="${bx}" cy="${by}" r="4" fill="#facc15" stroke="#000" stroke-width="1" />`;
            }

            svgContent = `
                <text x="40" y="35" fill="#38bdf8" font-size="16" font-weight="bold">
                    Himalayan Apple Orchard: Apiculture Pollination Trial (Exercise 12 & Fig. 11.24)
                </text>

                <!-- Apple Tree Trunk & Canopy -->
                <rect x="380" y="220" width="40" height="130" fill="#78350f" rx="4" />
                <circle cx="400" cy="160" r="95" fill="#15803d" opacity="0.9" />

                <!-- Developing Apple Fruitlets on Canopy -->
                ${fruitSetPct > 40 ? `
                    <circle cx="350" cy="140" r="10" fill="#ef4444" />
                    <circle cx="430" cy="130" r="10" fill="#ef4444" />
                    <circle cx="390" cy="180" r="10" fill="#ef4444" />
                    <circle cx="440" cy="170" r="10" fill="#ef4444" />
                ` : `
                    <circle cx="360" cy="150" r="8" fill="#ef4444" />
                    <circle cx="420" cy="160" r="8" fill="#ef4444" />
                `}

                <!-- Premature Fallen Fruitlets (Drop) -->
                ${fruitDropPct > 30 ? `
                    <circle cx="340" cy="340" r="6" fill="#7f1d1d" />
                    <circle cx="370" cy="345" r="6" fill="#7f1d1d" />
                    <circle cx="430" cy="340" r="6" fill="#7f1d1d" />
                    <circle cx="460" cy="345" r="6" fill="#7f1d1d" />
                    <text x="475" y="345" fill="#ef4444" font-size="11">Premature Fruit Drop (${fruitDropPct}%)</text>
                ` : `
                    <circle cx="370" cy="345" r="6" fill="#7f1d1d" />
                    <text x="400" y="345" fill="#22c55e" font-size="11">Low Drop (<15%)</text>
                `}

                <!-- Managed Beehives (Place B) -->
                ${bees > 0 ? `
                    <g transform="translate(140, 250)">
                        <rect x="0" y="0" width="55" height="70" fill="#ca8a04" stroke="#eab308" stroke-width="2" rx="4" />
                        <line x1="0" y1="25" x2="55" y2="25" stroke="#713f12" stroke-width="2" />
                        <line x1="0" y1="50" x2="55" y2="50" stroke="#713f12" stroke-width="2" />
                        <circle cx="28" cy="60" r="4" fill="#0f172a" />
                        <text x="-15" y="-10" fill="#facc15" font-size="11" font-weight="bold">${bees} Beehives/ha</text>
                    </g>
                    ${flyingBees}
                ` : `
                    <text x="120" y="280" fill="#94a3b8" font-size="12">Place A: Zero Hives</text>
                    <text x="100" y="300" fill="#ef4444" font-size="11">Natural Pollinator Deficit</text>
                `}

                <!-- Comparative Metrics Chart Inset -->
                <g transform="translate(560, 80)">
                    <rect x="0" y="0" width="200" height="150" fill="#1e293b" stroke="#334155" rx="6" />
                    <text x="15" y="25" fill="#f8fafc" font-size="12" font-weight="bold">Yield Projections</text>
                    <text x="15" y="55" fill="#4ade80" font-size="12">Fruit Set: ${fruitSetPct.toFixed(0)}%</text>
                    <text x="15" y="85" fill="#f87171" font-size="12">Fruit Drop: ${fruitDropPct.toFixed(0)}%</text>
                    <text x="15" y="115" fill="#facc15" font-size="13" font-weight="bold">Harvest: ${netYieldFactor}× Baseline</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Orchard Regimen:</span> <span class="metric-val" style="color:${bees > 0 ? '#4ade80' : '#f87171'};">${bees > 0 ? 'Place B (Beekeeping)' : 'Place A (Natural Only)'}</span></div>
                <div class="metric"><span class="metric-lbl">Fruit Setting %:</span> <span class="metric-val" style="color:#4ade80;">${fruitSetPct.toFixed(0)}%</span></div>
                <div class="metric"><span class="metric-lbl">Premature Fruit Drop %:</span> <span class="metric-val" style="color:#f87171;">${fruitDropPct.toFixed(0)}%</span></div>
                <div class="metric"><span class="metric-lbl">Commercial Harvest:</span> <span class="metric-val" style="color:#facc15;">${netYieldFactor}× of Baseline Yield</span></div>
            `;

            verdictHtml = bees > 0
                ? `<strong>NCERT Exercise 12 Verification (Place B):</strong> Managed honeybee hives provide essential cross-pollination. High ovule fertilisation stimulates auxin and gibberellin synthesis in seeds, suppressing the stem abscission layer and cutting fruit drop from 50% down to 10%.`
                : `<strong>Place A Pollination Deficit:</strong> Without managed hives, wild pollinator decline leaves blossoms unfertilized. Developing fruitlets lack seed hormones and abort prematurely, resulting in poor commercial yield.`;

        } else {
            // Night Blooming White Flower Contrast (Exercise 6)
            svgContent = `
                <text x="40" y="35" fill="#f8fafc" font-size="16" font-weight="bold">Night-Blooming White Flowers: Moonlight Silhouette & Moth Guidance (Ex 6)</text>

                <!-- Full Moon in Night Sky -->
                <circle cx="680" cy="70" r="35" fill="#fef08a" opacity="0.9" />
                <circle cx="670" cy="65" r="5" fill="#ca8a04" opacity="0.3" />
                <text x="650" y="125" fill="#fef08a" font-size="12">Moonlight Source</text>

                <!-- Dark Green Foliage -->
                <rect x="200" y="100" width="360" height="220" fill="#052e16" rx="12" />

                <!-- White Flower Luminous Petals -->
                <g transform="translate(380, 190)">
                    <circle cx="0" cy="0" r="18" fill="#facc15" />
                    <!-- White Petals reflecting moonlight -->
                    <circle cx="-35" cy="0" r="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
                    <circle cx="35" cy="0" r="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
                    <circle cx="0" cy="-35" r="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
                    <circle cx="0" cy="35" r="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
                </g>

                <!-- Hawk-Moth with long proboscis approaching -->
                <g transform="translate(${250 + Math.sin(t * 3.0) * 40}, ${150 + Math.cos(t * 3.0) * 20})">
                    <ellipse cx="0" cy="0" rx="14" ry="7" fill="#64748b" />
                    <path d="M 0 -7 L 20 -25 L 10 0 Z" fill="#94a3b8" />
                    <path d="M 0 7 L 20 25 L 10 0 Z" fill="#94a3b8" />
                    <path d="M -14 0 Q -25 10 -35 0" stroke="#cbd5e1" stroke-width="2" fill="none" />
                    <text x="-40" y="-15" fill="#94a3b8" font-size="11">Hawk-Moth</text>
                </g>

                <text x="240" y="300" fill="#ffffff" font-size="13" font-weight="bold">Luminous White Petals (Maximum Reflectivity under Dim Light)</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Adaptation:</span> <span class="metric-val" style="color:#ffffff;">Alabaster White Petals</span></div>
                <div class="metric"><span class="metric-lbl">Pollinator:</span> <span class="metric-val">Nocturnal Hawk-Moths / Bats</span></div>
                <div class="metric"><span class="metric-lbl">Moonlight Reflectivity:</span> <span class="metric-val">94% (High Contrast Beacon)</span></div>
                <div class="metric"><span class="metric-lbl">Scent Scenting:</span> <span class="metric-val">Intense Volatile Terpenoids</span></div>
            `;

            verdictHtml = `<strong>NCERT Exercise 6 Explained:</strong> In darkness, colored pigments are invisible to rod photoreceptors. White petals reflect moonlight to form sharp visual targets against dark leaves, complemented by intense night fragrances.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 4. SIMULATION: Pollen Tube Chemotropism & Double Fertilisation (sim-pollen-fertilisation)
// =========================================================================
window.SIMS['sim-pollen-fertilisation'] = {
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
                        <span class="preset-label">Sucrose Presets:</span>
                        <button class="btn btn-sm btn-preset" data-sugar="5">5% Optimum (Double Fertilisation)</button>
                        <button class="btn btn-sm btn-preset" data-sugar="0">0% Distilled Water (Hypotonic Burst)</button>
                        <button class="btn btn-sm btn-preset" data-sugar="10">10% Hypertonic (Plasmolytic Stunt)</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Sucrose Concentration (%): <span class="val-sugar">5.0%</span>
                        <input type="range" class="rng-sugar" min="0" max="10" step="2.5" value="5">
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
        const rngSugar = container.querySelector('.rng-sugar');
        const lblSugar = container.querySelector('.val-sugar');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.sugar = 5.0;

        function setSugar(s) {
            state.custom.sugar = parseFloat(s);
            rngSugar.value = s;
            lblSugar.textContent = s + '%';
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => setSugar(btn.dataset.sugar);
        });

        rngSugar.oninput = (e) => {
            setSugar(e.target.value);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const sugar = state.custom.sugar;
        const t = state.time;

        const isBurst = (sugar === 0);
        const isStunted = (sugar === 10);
        const isOptimal = (sugar >= 2.5 && sugar <= 7.5);

        const tubeLength = isBurst ? 15 : isStunted ? 40 : Math.min(230, 20 + t * 25);
        const reachedOvule = isOptimal && (tubeLength >= 220);

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        svgContent = `
            <text x="40" y="35" fill="#38bdf8" font-size="16" font-weight="bold">
                Pollen Germination & Chemotropic Fertilisation (Activity 11.3 & Exercise 10)
            </text>

            <!-- Pistil Longitudinal Section -->
            <!-- Stigma -->
            <ellipse cx="400" cy="70" rx="60" ry="20" fill="#be123c" stroke="#f43f5e" stroke-width="2" />
            <text x="470" y="75" fill="#fda4af" font-size="12">Stigma Surface</text>

            <!-- Style Tube -->
            <rect x="380" y="85" width="40" height="150" fill="#065f46" stroke="#10b981" stroke-width="2" />
            <text x="430" y="150" fill="#6ee7b7" font-size="12">Style Conduit</text>

            <!-- Ovary & Ovule Embryo Sac -->
            <ellipse cx="400" cy="290" rx="70" ry="60" fill="#047857" stroke="#10b981" stroke-width="3" />
            <!-- Ovule -->
            <ellipse cx="400" cy="290" rx="35" ry="30" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
            <!-- Egg Cell (n) -->
            <circle cx="400" cy="275" r="7" fill="#f43f5e" />
            <text x="415" y="278" fill="#f43f5e" font-size="11">Egg Cell (n)</text>
            <!-- Polar Nuclei (2n) -->
            <circle cx="395" cy="295" r="5" fill="#38bdf8" />
            <circle cx="405" cy="295" r="5" fill="#38bdf8" />
            <text x="420" y="300" fill="#38bdf8" font-size="11">Polar Nuclei</text>

            <!-- Pollen Grain on Stigma -->
            <circle cx="400" cy="65" r="14" fill="#facc15" stroke="#ca8a04" stroke-width="2" />

            ${!isBurst ? `
                <!-- Pollen Tube Growing Downwards -->
                <path d="M 400 75 L 400 ${75 + tubeLength}" stroke="#facc15" stroke-width="7" stroke-linecap="round" fill="none" />
                <!-- Two Male Gamete Sperms inside tube -->
                <circle cx="400" cy="${70 + tubeLength}" r="3" fill="#ef4444" />
                <circle cx="400" cy="${60 + tubeLength}" r="3" fill="#ef4444" />
                <text x="420" y="${65 + tubeLength}" fill="#ef4444" font-size="10">2 Sperms</text>
            ` : `
                <!-- Burst Pollen Grain (Plasmoptysis) -->
                <circle cx="400" cy="65" r="22" fill="#ef4444" opacity="0.6" />
                <path d="M 385 55 L 415 75 M 385 75 L 415 55" stroke="#ffffff" stroke-width="3" />
                <text x="430" y="55" fill="#ef4444" font-size="12" font-weight="bold">💥 BURST (Hypotonic Lysis!)</text>
            `}

            ${reachedOvule ? `
                <!-- Double Fertilisation Flash -->
                <circle cx="400" cy="285" r="25" fill="none" stroke="#facc15" stroke-width="4" opacity="0.8" />
                <text x="490" y="250" fill="#facc15" font-size="14" font-weight="bold">⚡ DOUBLE FERTILISATION</text>
                <text x="490" y="270" fill="#f43f5e" font-size="11">• Syngamy: Sperm + Egg → Zygote (2n)</text>
                <text x="490" y="290" fill="#38bdf8" font-size="11">• Triple Fusion: Sperm + Polar → Endosperm (3n)</text>
            ` : ''}

            <!-- Sugar Status Box -->
            <g transform="translate(60, 100)">
                <rect x="0" y="0" width="200" height="110" fill="#1e293b" stroke="#334155" rx="6" />
                <text x="15" y="25" fill="#f8fafc" font-size="12" font-weight="bold">Sucrose Osmotic State</text>
                <text x="15" y="55" fill="#38bdf8" font-size="12">Sugar: ${sugar}%</text>
                <text x="15" y="80" fill="${isBurst ? '#ef4444' : isStunted ? '#facc15' : '#4ade80'}" font-size="12" font-weight="bold">
                    ${isBurst ? '0% Hypotonic (Burst)' : isStunted ? '10% Hypertonic (Plasmolysis)' : 'Isotonic / Optimal'}
                </text>
            </g>
        `;

        readoutHtml = `
            <div class="metric"><span class="metric-lbl">Sucrose Concentration:</span> <span class="metric-val">${sugar.toFixed(1)}%</span></div>
            <div class="metric"><span class="metric-lbl">Pollen Tube Status:</span> <span class="metric-val" style="color:${isBurst ? '#ef4444' : isOptimal ? '#4ade80' : '#facc15'};">${isBurst ? 'Cell Lysis (Plasmoptysis)' : isStunted ? 'Plasmolyzed / Stunted' : 'Active Elongation'}</span></div>
            <div class="metric"><span class="metric-lbl">Chemotropic Path:</span> <span class="metric-val">${tubeLength.toFixed(0)} μm into Style</span></div>
            <div class="metric"><span class="metric-lbl">Fertilisation Event:</span> <span class="metric-val" style="color:${reachedOvule ? '#facc15' : '#94a3b8'};">${reachedOvule ? 'Syngamy + Triple Fusion!' : 'In Transit'}</span></div>
        `;

        verdictHtml = isBurst
            ? `<strong>NCERT Exercise 10 (0% Sugar):</strong> Pure water is strongly hypotonic. Rapid endosmosis increases internal turgor beyond wall tensile strength, bursting the pollen grain before germination can start.`
            : isStunted
            ? `<strong>NCERT Exercise 10 (10% Sugar):</strong> Excessive external sugar causes hypertonic exosmosis. Dehydrated protoplasm retards metabolic growth.`
            : `<strong>Double Fertilisation Accomplished:</strong> Chemotropically guided by ovule peptide signals, one sperm fuses with the egg cell (Zygote 2n), while the second fuses with polar nuclei (Endosperm 3n).`;

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 5. SIMULATION: Human Reproductive Anatomy & Scrotal Thermoregulation (sim-human-anatomy)
// =========================================================================
window.SIMS['sim-human-anatomy'] = {
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
                        <button class="btn btn-sm btn-preset" data-view="male">Male Reproductive Tract</button>
                        <button class="btn btn-sm btn-preset" data-view="female">Female Reproductive Tract</button>
                        <button class="btn btn-sm btn-preset" data-view="thermo-good">Optimal Scrotal Temp (34.5°C)</button>
                        <button class="btn btn-sm btn-preset" data-view="thermo-bad">Cryptorchidism / Heat Arrest (37.0°C)</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Anatomical System:
                        <select class="sel-anat-view">
                            <option value="male">Male Reproductive Conduit (Testis, Vas Deferens, Glands)</option>
                            <option value="female">Female Reproductive Conduit (Ovary, Oviduct, Uterus)</option>
                        </select>
                    </label>
                    <label class="control-item">Testicular Temperature (°C): <span class="val-temp">34.5°C</span>
                        <input type="range" class="rng-temp" min="32" max="39" step="0.5" value="34.5">
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
        const selView = container.querySelector('.sel-anat-view');
        const rngTemp = container.querySelector('.rng-temp');
        const lblTemp = container.querySelector('.val-temp');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.view = 'male';
        state.custom.temp = 34.5;

        function applyView(v) {
            if (v === 'male') {
                state.custom.view = 'male';
                selView.value = 'male';
            } else if (v === 'female') {
                state.custom.view = 'female';
                selView.value = 'female';
            } else if (v === 'thermo-good') {
                state.custom.view = 'male';
                selView.value = 'male';
                state.custom.temp = 34.5;
            } else if (v === 'thermo-bad') {
                state.custom.view = 'male';
                selView.value = 'male';
                state.custom.temp = 37.0;
            }
            rngTemp.value = state.custom.temp;
            lblTemp.textContent = state.custom.temp + '°C';
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => applyView(btn.dataset.view);
        });

        selView.onchange = (e) => applyView(e.target.value);
        rngTemp.oninput = (e) => {
            state.custom.temp = parseFloat(e.target.value);
            lblTemp.textContent = state.custom.temp + '°C';
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const view = state.custom.view;
        const temp = state.custom.temp;
        const t = state.time;

        const isViable = (temp <= 35.5 && temp >= 33.5);

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (view === 'male') {
            svgContent = `
                <text x="40" y="35" fill="#38bdf8" font-size="16" font-weight="bold">Male Reproductive System: Spermatogenesis & Thermoregulation</text>

                <!-- Abdominal Cavity Outline -->
                <rect x="200" y="60" width="380" height="180" fill="#1e293b" stroke="#334155" rx="8" />
                <text x="220" y="85" fill="#94a3b8" font-size="12">Abdominal Cavity (Core Body Temperature = 37.0°C)</text>

                <!-- Scrotum Suspended Outside Body -->
                <path d="M 280 240 Q 280 360 360 360 Q 440 360 440 240 Z" fill="#334155" stroke="#475569" stroke-width="2" />
                <text x="320" y="380" fill="#38bdf8" font-size="13" font-weight="bold">Scrotal Sac (${temp}°C)</text>

                <!-- Testis inside Scrotum -->
                <ellipse cx="360" cy="290" rx="35" ry="45" fill="${isViable ? '#0284c7' : '#ef4444'}" stroke="#38bdf8" stroke-width="3" />
                <text x="345" y="295" fill="#f8fafc" font-size="12" font-weight="bold">Testis</text>

                <!-- Epididymis capping Testis -->
                <path d="M 390 250 Q 405 290 395 330" stroke="#facc15" stroke-width="6" fill="none" stroke-linecap="round" />
                <text x="410" y="300" fill="#facc15" font-size="11">Epididymis</text>

                <!-- Vas Deferens ascending into abdomen -->
                <path d="M 395 250 Q 440 200 440 140 Q 440 110 380 110" stroke="#facc15" stroke-width="4" fill="none" />
                <text x="450" y="160" fill="#facc15" font-size="11">Vas Deferens</text>

                <!-- Prostate & Seminal Vesicles -->
                <circle cx="360" cy="110" r="18" fill="#ca8a04" />
                <text x="260" y="115" fill="#fde047" font-size="12">Prostate & Seminal Vesicles</text>

                <!-- Urethra to Penis -->
                <line x1="360" y1="128" x2="360" y2="220" stroke="#38bdf8" stroke-width="8" />
                <text x="375" y="180" fill="#38bdf8" font-size="12">Urethra</text>

                <!-- Thermal State Indicator -->
                <g transform="translate(590, 100)">
                    <rect x="0" y="0" width="180" height="120" fill="#1e293b" stroke="#334155" rx="6" />
                    <text x="15" y="25" fill="#f8fafc" font-size="12" font-weight="bold">Thermal Audit</text>
                    <text x="15" y="55" fill="${isViable ? '#4ade80' : '#ef4444'}" font-size="13" font-weight="bold">
                        ${isViable ? '✓ OPTIMAL (34.5°C)' : '⚠️ THERMAL ARREST'}
                    </text>
                    <text x="15" y="85" fill="#94a3b8" font-size="11">ΔT vs Core: ${(temp - 37.0).toFixed(1)}°C</text>
                    <text x="15" y="105" fill="#94a3b8" font-size="11">Motile Sperm: ${isViable ? 'Millions/day' : '0 (Azoospermia)'}</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Testis Temp:</span> <span class="metric-val" style="color:${isViable ? '#4ade80' : '#ef4444'};">${temp}°C</span></div>
                <div class="metric"><span class="metric-lbl">Spermatogenesis:</span> <span class="metric-val">${isViable ? 'Active Mitosis & Meiosis' : 'Thermal Apoptosis (Arrested)'}</span></div>
                <div class="metric"><span class="metric-lbl">Accessory Glands:</span> <span class="metric-val">Alkaline Fructose Semen</span></div>
                <div class="metric"><span class="metric-lbl">Clinical Status:</span> <span class="metric-val" style="color:${isViable ? '#22c55e' : '#ef4444'};">${isViable ? 'Fertile' : 'Cryptorchidism Infertility'}</span></div>
            `;

            verdictHtml = isViable
                ? `<strong>Scrotal Thermoregulation:</strong> Keeping the testes 2 to 2.5°C cooler than core body temperature allows continuous, healthy spermatogenesis (~100-200 million motile sperm daily).`
                : `<strong>Cryptorchidism Pathophysiology:</strong> Exposure to core body temperature (37°C) destroys heat-sensitive spermatogenic germ cells, causing permanent infertility (azoospermia).`;

        } else {
            // Female Reproductive Conduit
            svgContent = `
                <text x="40" y="35" fill="#f43f5e" font-size="16" font-weight="bold">Female Reproductive System: Oviducts, Uterus & Implantation Site</text>

                <!-- Uterus Womb (Myometrium) -->
                <path d="M 330 160 Q 400 130 470 160 L 440 260 L 360 260 Z" fill="#881337" stroke="#f43f5e" stroke-width="3" />
                <text x="375" y="200" fill="#fecdd3" font-size="13" font-weight="bold">Uterus</text>
                <text x="355" y="220" fill="#fde047" font-size="11">Endometrial Lining</text>

                <!-- Fallopian Tubes (Oviducts) -->
                <path d="M 330 160 Q 240 120 200 160" stroke="#fb7185" stroke-width="8" fill="none" />
                <path d="M 470 160 Q 560 120 600 160" stroke="#fb7185" stroke-width="8" fill="none" />
                <text x="210" y="130" fill="#fb7185" font-size="12">Fallopian Tube (Ampulla)</text>

                <!-- Fimbriae -->
                <circle cx="195" cy="165" r="14" fill="#e11d48" />
                <circle cx="605" cy="165" r="14" fill="#e11d48" />

                <!-- Ovaries -->
                <ellipse cx="190" cy="205" rx="22" ry="16" fill="#ca8a04" stroke="#eab308" stroke-width="2" />
                <text x="170" y="210" fill="#fef08a" font-size="11">Ovary</text>
                <ellipse cx="610" cy="205" rx="22" ry="16" fill="#ca8a04" stroke="#eab308" stroke-width="2" />
                <text x="590" y="210" fill="#fef08a" font-size="11">Ovary</text>

                <!-- Cervix & Vagina -->
                <rect x="375" y="260" width="50" height="35" fill="#4c0519" />
                <text x="430" y="280" fill="#f43f5e" font-size="11">Cervix</text>
                <rect x="370" y="295" width="60" height="65" fill="#310e19" stroke="#9f1239" stroke-width="2" />
                <text x="435" y="335" fill="#fca5a5" font-size="12">Vagina</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Ovarian Gametes:</span> <span class="metric-val">1 Ovum Released / Month</span></div>
                <div class="metric"><span class="metric-lbl">Fertilisation Site:</span> <span class="metric-val" style="color:#fb7185;">Fallopian Tube Ampulla</span></div>
                <div class="metric"><span class="metric-lbl">Gestation Site:</span> <span class="metric-val" style="color:#fde047;">Uterine Endometrium</span></div>
                <div class="metric"><span class="metric-lbl">Hormones Secreted:</span> <span class="metric-val">Estrogen & Progesterone</span></div>
            `;

            verdictHtml = `<strong>Female Reproductive Symphony:</strong> The ovary releases a mature secondary oocyte into the ciliated Fallopian tube. Fertilisation takes place in the ampulla, after which the blastocyst travels 5-7 days to implant into the vascular uterine endometrium.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 6. SIMULATION: Menstrual Cycle & Pregnancy Horizon (sim-menstrual-pregnancy)
// =========================================================================
window.SIMS['sim-menstrual-pregnancy'] = {
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
                        <button class="btn btn-sm btn-preset" data-cycle="28-menses">Standard 28-Day Cycle (Menses)</button>
                        <button class="btn btn-sm btn-preset" data-cycle="32-menses">32-Day Cycle (Ovulation Day 18 - Ex 13)</button>
                        <button class="btn btn-sm btn-preset" data-cycle="28-pregnant">Fertilisation & Pregnancy (Menses Stops!)</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Cycle Length (Days): <span class="val-cycle-len">28</span>
                        <input type="range" class="rng-cycle-len" min="21" max="35" step="1" value="28">
                    </label>
                    <label class="control-item">
                        <input type="checkbox" class="chk-pregnant"> Fertilisation Occurs (Pregnancy & hCG Arrest)
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
        const rngCycle = container.querySelector('.rng-cycle-len');
        const chkPreg = container.querySelector('.chk-pregnant');
        const lblCycle = container.querySelector('.val-cycle-len');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.cycleLen = 28;
        state.custom.pregnant = false;

        function applyPreset(p) {
            if (p === '28-menses') {
                state.custom.cycleLen = 28;
                state.custom.pregnant = false;
                chkPreg.checked = false;
            } else if (p === '32-menses') {
                state.custom.cycleLen = 32;
                state.custom.pregnant = false;
                chkPreg.checked = false;
            } else if (p === '28-pregnant') {
                state.custom.cycleLen = 28;
                state.custom.pregnant = true;
                chkPreg.checked = true;
            }
            rngCycle.value = state.custom.cycleLen;
            lblCycle.textContent = state.custom.cycleLen;
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => applyPreset(btn.dataset.cycle);
        });

        rngCycle.oninput = (e) => {
            state.custom.cycleLen = parseInt(e.target.value);
            lblCycle.textContent = state.custom.cycleLen;
            this.draw(svg, state, container);
        };
        chkPreg.onchange = (e) => {
            state.custom.pregnant = e.target.checked;
            this.draw(svg, state, container);
        };

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const cycleLen = state.custom.cycleLen;
        const pregnant = state.custom.pregnant;
        const t = state.time;

        const currentDay = 1 + ((t / 10.0) * cycleLen);
        const ovulationDay = cycleLen - 14;

        // Endometrial curve
        let endoThickness;
        if (currentDay <= 5) {
            endoThickness = 30 - currentDay * 3; // Sloughing
        } else if (currentDay <= ovulationDay) {
            endoThickness = 15 + ((currentDay - 5) / (ovulationDay - 5)) * 45; // Proliferating
        } else {
            if (pregnant) {
                endoThickness = 60 + Math.min(30, (currentDay - ovulationDay) * 2); // Highly maintained
            } else {
                if (currentDay <= cycleLen - 2) {
                    endoThickness = 60; // Secretory plateau
                } else {
                    endoThickness = 60 - (currentDay - (cycleLen - 2)) * 18; // Regression
                }
            }
        }

        const svgContent = `
            <text x="40" y="35" fill="#f43f5e" font-size="16" font-weight="bold">
                The Menstrual Cycle & Pregnancy: Endocrine & Endometrial Dynamics (Ex 3, 5 & 13)
            </text>

            <!-- Day Axis Bar -->
            <rect x="80" y="60" width="640" height="30" fill="#1e293b" rx="4" />
            <text x="90" y="80" fill="#94a3b8" font-size="12">Day 1 (Menses)</text>
            <text x="${80 + (ovulationDay / cycleLen) * 640 - 25}" y="80" fill="#facc15" font-size="12" font-weight="bold">Day ${ovulationDay} (Ovulation)</text>
            <text x="640" y="80" fill="#94a3b8" font-size="12">Day ${cycleLen}</text>

            <!-- Timeline Scrubber Cursor -->
            <line x1="${80 + (currentDay / cycleLen) * 640}" y1="55" x2="${80 + (currentDay / cycleLen) * 640}" y2="330" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4,2" />
            <circle cx="${80 + (currentDay / cycleLen) * 640}" cy="55" r="6" fill="#38bdf8" />
            <text x="${80 + (currentDay / cycleLen) * 640 - 15}" y="48" fill="#38bdf8" font-size="11" font-weight="bold">Day ${currentDay.toFixed(0)}</text>

            <!-- Endometrial Cross-Section Graphic -->
            <g transform="translate(80, 200)">
                <rect x="0" y="0" width="640" height="120" fill="#310e19" stroke="#9f1239" stroke-width="2" rx="6" />
                <rect x="0" y="${120 - endoThickness}" width="640" height="${endoThickness}" fill="#be123c" opacity="0.85" />
                <text x="20" y="30" fill="#fecdd3" font-size="13" font-weight="bold">Endometrial Vascular Bed (${(endoThickness / 10).toFixed(1)} mm thickness)</text>
                <text x="20" y="55" fill="#fda4af" font-size="11">
                    ${currentDay <= 5 ? '🩸 Menstrual Phase: Desquamation & Bleeding' : currentDay <= ovulationDay ? '🌿 Proliferative Phase: Estrogen Repair' : pregnant ? '🤰 Pregnancy Maintained by hCG & Progesterone (Menses Stopped!)' : '🍯 Secretory Phase: Progesterone Maintenance'}
                </text>
            </g>

            <!-- Hormonal Status Callout -->
            <g transform="translate(80, 105)">
                <rect x="0" y="0" width="640" height="80" fill="#1e293b" stroke="#334155" rx="6" />
                <text x="20" y="25" fill="#facc15" font-size="12" font-weight="bold">Hormonal Profile at Day ${currentDay.toFixed(0)}:</text>
                <text x="20" y="48" fill="#cbd5e1" font-size="11">
                    • Estrogen: ${currentDay >= 10 && currentDay <= ovulationDay ? 'PEAK' : 'Moderate'} | • Progesterone: ${pregnant || currentDay > ovulationDay ? 'ELEVATED' : 'Low'}
                </text>
                <text x="20" y="68" fill="#cbd5e1" font-size="11">
                    • LH / FSH: ${Math.abs(currentDay - ovulationDay) <= 1 ? '⚡ LH SURGE TRIGGERING OVULATION' : 'Basal'}
                </text>
            </g>
        `;

        readoutHtml = `
            <div class="metric"><span class="metric-lbl">Timeline:</span> <span class="metric-val">Day ${currentDay.toFixed(0)} of ${cycleLen}-Day Cycle</span></div>
            <div class="metric"><span class="metric-lbl">Ovulation Day:</span> <span class="metric-val" style="color:#facc15;">Day ${ovulationDay} (${cycleLen}-14 Rule)</span></div>
            <div class="metric"><span class="metric-lbl">Endometrium:</span> <span class="metric-val">${(endoThickness / 10).toFixed(1)} mm (${pregnant ? 'Hyper-Vascular' : currentDay <= 5 ? 'Sloughing' : 'Secretory'})</span></div>
            <div class="metric"><span class="metric-lbl">Menses Status:</span> <span class="metric-val" style="color:${pregnant ? '#4ade80' : '#f43f5e'};">${pregnant ? 'CEASED (Pregnancy hCG)' : currentDay <= 5 ? 'Active Bleeding' : 'Inactive'}</span></div>
        `;

        verdictHtml = pregnant
            ? `<strong>NCERT Exercise 5 Verified:</strong> The implanted blastocyst secretes hCG, maintaining the corpus luteum to produce elevated progesterone. This sustains the endometrium indefinitely and halts menstruation throughout pregnancy.`
            : `<strong>NCERT Exercise 13 Verified:</strong> Ovulation is NOT universally fixed on Day 14! Because the luteal phase is ~14 days, a 32-day cycle ovulates on Day 18, and a 24-day cycle ovulates on Day 10.`;

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};

// =========================================================================
// 7. SIMULATION: Contraception Modalities & STI Barrier Lab (sim-contraception-modes)
// =========================================================================
window.SIMS['sim-contraception-modes'] = {
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
                        <button class="btn btn-sm btn-preset" data-method="condom">Latex Condom (Dual STI Shield)</button>
                        <button class="btn btn-sm btn-preset" data-method="saheli">Saheli (Once-Weekly Non-Steroidal Pill)</button>
                        <button class="btn btn-sm btn-preset" data-method="copper-t">Copper-T IUD (Sperm Motility Arrest)</button>
                        <button class="btn btn-sm btn-preset" data-method="vasectomy">Vasectomy / Tubectomy (Surgical)</button>
                    </div>
                </div>

                <div class="sim-interactive-controls">
                    <label class="control-item">Contraceptive Modality:
                        <select class="sel-contra-method">
                            <option value="condom">Mechanical Barrier: Latex Condom (Dual Protection)</option>
                            <option value="saheli">Hormonal/Chemical: Saheli (CDRI Lucknow Non-Steroidal)</option>
                            <option value="copper-t">Intrauterine Device: Copper-T (Cu-T)</option>
                            <option value="vasectomy">Surgical Sterilization: Vasectomy & Tubectomy</option>
                        </select>
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
        const selMethod = container.querySelector('.sel-contra-method');

        const state = createSimState(container, (s) => this.draw(svg, s, container));
        state.custom.method = 'condom';

        function setMethod(m) {
            state.custom.method = m;
            selMethod.value = m;
            state.reset();
        }

        container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.onclick = () => setMethod(btn.dataset.method);
        });

        selMethod.onchange = (e) => setMethod(e.target.value);

        state.bindControls();
        this.draw(svg, state, container);
    },

    draw: function(svg, state, container) {
        const method = state.custom.method;
        const t = state.time;

        let svgContent = '';
        let readoutHtml = '';
        let verdictHtml = '';

        if (method === 'condom') {
            svgContent = `
                <text x="40" y="35" fill="#38bdf8" font-size="16" font-weight="bold">Mechanical Barrier: Condom (Dual Protection: Pregnancy + STIs)</text>

                <!-- Physical Latex Barrier Wall -->
                <rect x="380" y="70" width="25" height="260" fill="#38bdf8" stroke="#7dd3fc" stroke-width="3" rx="8" />
                <text x="365" y="355" fill="#38bdf8" font-size="13" font-weight="bold">Latex Barrier</text>

                <!-- Incoming Sperm (Blocked on left) -->
                <g transform="translate(140, 100)">
                    <rect x="0" y="0" width="220" height="200" fill="#1e293b" stroke="#334155" rx="6" />
                    <text x="15" y="25" fill="#f8fafc" font-size="13" font-weight="bold">Semen & Pathogens (Male)</text>
                    <!-- Blocked Sperm -->
                    <circle cx="160" cy="80" r="5" fill="#facc15" />
                    <line x1="160" y1="80" x2="130" y2="85" stroke="#facc15" stroke-width="2" />
                    <circle cx="170" cy="120" r="5" fill="#facc15" />
                    <line x1="170" y1="120" x2="140" y2="125" stroke="#facc15" stroke-width="2" />
                    <text x="15" y="105" fill="#facc15" font-size="11">Sperm Ejaculate</text>
                    <!-- Blocked STIs (HIV, Syphilis) -->
                    <circle cx="150" cy="160" r="7" fill="#ef4444" />
                    <circle cx="180" cy="170" r="6" fill="#ef4444" />
                    <text x="15" y="170" fill="#ef4444" font-size="11" font-weight="bold">STIs (HIV, Bacteria)</text>
                </g>

                <!-- Female Tract Protected on right -->
                <g transform="translate(430, 100)">
                    <rect x="0" y="0" width="240" height="200" fill="#064e3b" stroke="#059669" rx="6" />
                    <text x="20" y="30" fill="#6ee7b7" font-size="13" font-weight="bold">Protected Female Genital Tract</text>
                    <text x="20" y="70" fill="#a7f3d0" font-size="12">✓ Zero Sperm Entry (No Pregnancy)</text>
                    <text x="20" y="110" fill="#a7f3d0" font-size="12">✓ Zero Pathogen Entry (No STIs)</text>
                    <text x="20" y="150" fill="#fef08a" font-size="12" font-weight="bold">DUAL PROTECTION SHIELD</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Contraceptive:</span> <span class="metric-val" style="color:#38bdf8;">Latex Barrier (Condom)</span></div>
                <div class="metric"><span class="metric-lbl">Pregnancy Prevention:</span> <span class="metric-val" style="color:#22c55e;">98% Effective</span></div>
                <div class="metric"><span class="metric-lbl">STI Protection:</span> <span class="metric-val" style="color:#22c55e;">YES (The ONLY Method)</span></div>
                <div class="metric"><span class="metric-lbl">Hormonal Disruption:</span> <span class="metric-val">NONE (Zero Side Effects)</span></div>
            `;

            verdictHtml = `<strong>Dual Protection Advantage:</strong> Condoms are the ONLY contraceptive modality that concurrently prevents unintended pregnancies AND blocks mucosal transmission of STIs (HIV, syphilis, gonorrhea).`;

        } else if (method === 'saheli') {
            svgContent = `
                <text x="40" y="35" fill="#facc15" font-size="16" font-weight="bold">Saheli (Centchroman): World's 1st Non-Steroidal Once-Weekly Pill (CDRI Lucknow)</text>

                <!-- Pill Graphic -->
                <g transform="translate(120, 100)">
                    <rect x="0" y="0" width="220" height="180" fill="#1e293b" stroke="#ca8a04" stroke-width="2" rx="8" />
                    <ellipse cx="110" cy="70" rx="45" ry="25" fill="#facc15" stroke="#eab308" stroke-width="2" />
                    <text x="80" y="75" fill="#713f12" font-size="14" font-weight="bold">Saheli</text>
                    <text x="20" y="125" fill="#fef08a" font-size="12">• Non-steroidal SERM</text>
                    <text x="20" y="145" fill="#fef08a" font-size="12">• Taken ONCE a week</text>
                    <text x="20" y="165" fill="#4ade80" font-size="11">CDRI Lucknow Innovation</text>
                </g>

                <!-- Mechanism in Uterus -->
                <g transform="translate(380, 80)">
                    <rect x="0" y="0" width="340" height="220" fill="#1e293b" stroke="#334155" rx="8" />
                    <text x="20" y="30" fill="#38bdf8" font-size="13" font-weight="bold">Mechanism of Action</text>
                    <text x="20" y="65" fill="#e2e8f0" font-size="12">• Does NOT flood body with steroid hormones</text>
                    <text x="20" y="95" fill="#e2e8f0" font-size="12">• Normal ovulation proceeds uninhibited</text>
                    <text x="20" y="125" fill="#e2e8f0" font-size="12">• Antagonizes uterine estrogen receptors</text>
                    <text x="20" y="155" fill="#facc15" font-size="12">• Prevents blastocyst implantation</text>
                    <text x="20" y="190" fill="#22c55e" font-size="12" font-weight="bold">Zero Nausea, Weight Gain or Headache</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Drug Formulation:</span> <span class="metric-val" style="color:#facc15;">Non-Steroidal (Centchroman)</span></div>
                <div class="metric"><span class="metric-lbl">Dosage Regimen:</span> <span class="metric-val">Once Weekly</span></div>
                <div class="metric"><span class="metric-lbl">Ovulation State:</span> <span class="metric-val">Normal / Intact</span></div>
                <div class="metric"><span class="metric-lbl">Primary Action:</span> <span class="metric-val">Implantation Prevention</span></div>
            `;

            verdictHtml = `<strong>Indian Scientific Breakthrough:</strong> Developed by CDRI Lucknow, Saheli avoids steroid side effects (nausea, weight gain) and improves compliance via its simple once-weekly schedule.`;

        } else if (method === 'copper-t') {
            svgContent = `
                <text x="40" y="35" fill="#f97316" font-size="16" font-weight="bold">Intrauterine Device: Copper-T (Cu-T) Spermicidal Action</text>

                <!-- Uterine Cavity Outline -->
                <path d="M 280 100 Q 400 70 520 100 L 480 270 L 320 270 Z" fill="#310e19" stroke="#9f1239" stroke-width="3" />
                <text x="350" y="295" fill="#fecdd3" font-size="12">Uterine Cavity</text>

                <!-- T-shaped Frame -->
                <line x1="340" y1="120" x2="460" y2="120" stroke="#f8fafc" stroke-width="8" stroke-linecap="round" />
                <line x1="400" y1="120" x2="400" y2="230" stroke="#f8fafc" stroke-width="8" stroke-linecap="round" />

                <!-- Copper Wire Coil Releasing Cu2+ ions -->
                <line x1="400" y1="130" x2="400" y2="210" stroke="#f97316" stroke-width="12" stroke-dasharray="4,3" />
                <text x="420" y="170" fill="#f97316" font-size="12" font-weight="bold">Copper Wire (Cu2+ release)</text>

                <!-- Immobilized Sperm -->
                <circle cx="360" cy="180" r="5" fill="#94a3b8" />
                <line x1="360" y1="180" x2="340" y2="190" stroke="#64748b" stroke-width="2" />
                <text x="240" y="185" fill="#f87171" font-size="11">Paralyzed Sperm</text>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Device Type:</span> <span class="metric-val" style="color:#f97316;">Intrauterine Device (IUD)</span></div>
                <div class="metric"><span class="metric-lbl">Active Agent:</span> <span class="metric-val">Copper Ions (Cu2+)</span></div>
                <div class="metric"><span class="metric-lbl">Sperm Motility:</span> <span class="metric-val" style="color:#ef4444;">Suppressed / Paralyzed</span></div>
                <div class="metric"><span class="metric-lbl">Duration:</span> <span class="metric-val">3 to 5 Years (Reversible)</span></div>
            `;

            verdictHtml = `<strong>Copper-T Mechanism:</strong> Inserted by medical professionals into the uterus, Copper-T continuously releases trace copper ions that suppress sperm motility and fertilising ability, offering long-term reversible contraception.`;

        } else if (method === 'vasectomy') {
            svgContent = `
                <text x="40" y="35" fill="#a855f7" font-size="16" font-weight="bold">Surgical Sterilization: Vasectomy (Male) & Tubectomy (Female)</text>

                <!-- Vasectomy Box (Left) -->
                <g transform="translate(80, 80)">
                    <rect x="0" y="0" width="300" height="220" fill="#1e293b" stroke="#3b82f6" stroke-width="2" rx="8" />
                    <text x="20" y="30" fill="#93c5fd" font-size="14" font-weight="bold">Vasectomy (Male Sterilization)</text>
                    
                    <!-- Cut Vas Deferens -->
                    <line x1="50" y1="110" x2="110" y2="110" stroke="#facc15" stroke-width="6" />
                    <line x1="170" y1="110" x2="230" y2="110" stroke="#facc15" stroke-width="6" />
                    <!-- Cut Gap with Ligatures -->
                    <circle cx="110" cy="110" r="5" fill="#ef4444" />
                    <circle cx="170" cy="110" r="5" fill="#ef4444" />
                    <text x="115" y="95" fill="#ef4444" font-size="11" font-weight="bold">Cut & Tied</text>

                    <text x="20" y="160" fill="#cbd5e1" font-size="11">• Vas deferens severed</text>
                    <text x="20" y="180" fill="#cbd5e1" font-size="11">• Ejaculate contains seminal fluid only</text>
                    <text x="20" y="200" fill="#22c55e" font-size="11">• 99.9% Permanent Sterility</text>
                </g>

                <!-- Tubectomy Box (Right) -->
                <g transform="translate(420, 80)">
                    <rect x="0" y="0" width="300" height="220" fill="#1e293b" stroke="#ec4899" stroke-width="2" rx="8" />
                    <text x="20" y="30" fill="#fbcfe8" font-size="14" font-weight="bold">Tubectomy (Female Sterilization)</text>

                    <!-- Cut Fallopian Tube -->
                    <line x1="50" y1="110" x2="110" y2="110" stroke="#fb7185" stroke-width="8" />
                    <line x1="170" y1="110" x2="230" y2="110" stroke="#fb7185" stroke-width="8" />
                    <circle cx="110" cy="110" r="6" fill="#ef4444" />
                    <circle cx="170" cy="110" r="6" fill="#ef4444" />
                    <text x="115" y="95" fill="#ef4444" font-size="11" font-weight="bold">Cut & Tied</text>

                    <text x="20" y="160" fill="#cbd5e1" font-size="11">• Fallopian tubes severed</text>
                    <text x="20" y="180" fill="#cbd5e1" font-size="11">• Ovulation continues, egg cannot meet sperm</text>
                    <text x="20" y="200" fill="#22c55e" font-size="11">• 99.9% Permanent Sterility</text>
                </g>
            `;

            readoutHtml = `
                <div class="metric"><span class="metric-lbl">Procedure:</span> <span class="metric-val" style="color:#c084fc;">Surgical Transection</span></div>
                <div class="metric"><span class="metric-lbl">Reversibility:</span> <span class="metric-val" style="color:#ef4444;">Permanent / Irreversible</span></div>
                <div class="metric"><span class="metric-lbl">Efficacy:</span> <span class="metric-val" style="color:#22c55e;">>99.9% Effective</span></div>
                <div class="metric"><span class="metric-lbl">Gamete Production:</span> <span class="metric-val">Unaffected (Sperm/Eggs Still Made)</span></div>
            `;

            verdictHtml = `<strong>Permanent Sterilization:</strong> Vasectomy and tubectomy block gamete transport conduits (vas deferens and fallopian tubes respectively), permanently preventing sperm and egg fusion.`;
        }

        svg.innerHTML = svgContent;
        const readoutEl = container.querySelector('#lab-readout');
        const verdictEl = container.querySelector('#lab-verdict');
        if (readoutEl) readoutEl.innerHTML = readoutHtml;
        if (verdictEl) verdictEl.innerHTML = verdictHtml;
    }
};
