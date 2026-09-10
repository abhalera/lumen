// Chapter 12: Patterns in Life: Diversity and Classification - Interactive Simulation Suite
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

// 1. Taxonomic Hierarchy Explorer (sim-taxonomic-hierarchy)
window.SIMS['sim-taxonomic-hierarchy'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Taxonomic Hierarchy & Binomial Nomenclature Explorer</h3>
    <div class="sim-controls-top">
      <label>Select Organism:
        <select class="organism-select form-select">
          <option value="human">Human (Homo sapiens)</option>
          <option value="tiger">Bengal Tiger (Panthera tigris)</option>
          <option value="mango">Mango Tree (Mangifera indica)</option>
          <option value="pea">Garden Pea (Pisum sativum)</option>
        </select>
      </label>
      <label>Hierarchy Depth:
        <input type="range" class="depth-slider form-range" min="1" max="8" value="4" step="1">
        <span class="depth-val">4 (Class)</span>
      </label>
    </div>
  </div>
  <div class="sim-canvas-box">
    <svg class="sim-svg" viewBox="0 0 800 420" width="100%" height="320"></svg>
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

        const orgData = {
            human: {
                common: 'Human',
                scientific: 'Homo sapiens',
                levels: [
                    { rank: 'Domain', name: 'Eukarya', count: '~8.7M species', desc: 'Cells have true membrane-bound nucleus and organelles' },
                    { rank: 'Kingdom', name: 'Animalia', count: '~1.5M species', desc: 'Multicellular heterotrophs lacking cell walls' },
                    { rank: 'Phylum', name: 'Chordata', count: '~65,000 species', desc: 'Notochord, dorsal nerve cord, pharyngeal gill slits' },
                    { rank: 'Class', name: 'Mammalia', count: '~6,400 species', desc: 'Mammary glands, hair, homeothermic 4-chambered heart' },
                    { rank: 'Order', name: 'Primates', count: '~500 species', desc: 'Grasping hands with opposable thumbs, forward vision' },
                    { rank: 'Family', name: 'Hominidae', count: '~8 living species', desc: 'Great apes, high cognitive brain encephalisation' },
                    { rank: 'Genus', name: 'Homo', count: '1 living species', desc: 'Bipedal upright posture, complex tool fabrication' },
                    { rank: 'Species', name: 'Homo sapiens', count: '1 single species', desc: 'Modern humans capable of symbolic thought and speech' }
                ]
            },
            tiger: {
                common: 'Bengal Tiger',
                scientific: 'Panthera tigris',
                levels: [
                    { rank: 'Domain', name: 'Eukarya', count: '~8.7M species', desc: 'Eukaryotic cellular architecture' },
                    { rank: 'Kingdom', name: 'Animalia', count: '~1.5M species', desc: 'Multicellular, motile ingestive heterotroph' },
                    { rank: 'Phylum', name: 'Chordata', count: '~65,000 species', desc: 'Dorsal tubular nerve cord, vertebral column' },
                    { rank: 'Class', name: 'Mammalia', count: '~6,400 species', desc: 'Fur, mammary milk glands, warm-blooded metabolism' },
                    { rank: 'Order', name: 'Carnivora', count: '~280 species', desc: 'Enlarged shearing carnassial teeth, acute hunting senses' },
                    { rank: 'Family', name: 'Felidae', count: '~40 species', desc: 'Retractile claws, flexible muscular agile bodies' },
                    { rank: 'Genus', name: 'Panthera', count: '5 species (Tiger, Lion, Leopard, Jaguar, Snow Leopard)', desc: 'Modified hyoid apparatus enabling mighty roar' },
                    { rank: 'Species', name: 'Panthera tigris', count: '1 specific apex species', desc: 'Striped apex predator of Indian deciduous & mangrove forests' }
                ]
            },
            mango: {
                common: 'Mango Tree',
                scientific: 'Mangifera indica',
                levels: [
                    { rank: 'Domain', name: 'Eukarya', count: '~8.7M species', desc: 'Eukaryotic cells with plastids and mitochondria' },
                    { rank: 'Kingdom', name: 'Plantae', count: '~390,000 species', desc: 'Multicellular photosynthetic autotrophs with cellulose walls' },
                    { rank: 'Division', name: 'Angiospermae', count: '~300,000 species', desc: 'Flowering plants with seeds enclosed within an ovary fruit' },
                    { rank: 'Class', name: 'Dicotyledonae', count: '~200,000 species', desc: 'Two seed cotyledons, reticulate leaf veins, taproot system' },
                    { rank: 'Order', name: 'Sapindales', count: '~6,000 species', desc: 'Woody plants producing resin and essential aromatic oils' },
                    { rank: 'Family', name: 'Anacardiaceae', count: '~800 species', desc: 'Cashew and sumac family; resinous drupe fruits' },
                    { rank: 'Genus', name: 'Mangifera', count: '~69 species', desc: 'Dense canopy trees producing fleshy edible drupes' },
                    { rank: 'Species', name: 'Mangifera indica', count: '1 single species', desc: 'National fruit of India, sweet mesocarp drupe' }
                ]
            },
            pea: {
                common: 'Garden Pea',
                scientific: 'Pisum sativum',
                levels: [
                    { rank: 'Domain', name: 'Eukarya', count: '~8.7M species', desc: 'Eukaryotic plant cells' },
                    { rank: 'Kingdom', name: 'Plantae', count: '~390,000 species', desc: 'Autotrophic photosynthetic plants' },
                    { rank: 'Division', name: 'Angiospermae', count: '~300,000 species', desc: 'Flowering plants with ovules protected in ovary' },
                    { rank: 'Class', name: 'Dicotyledonae', count: '~200,000 species', desc: '2 cotyledons, reticulate venation, taproot system' },
                    { rank: 'Order', name: 'Fabales', count: '~20,000 species', desc: 'Symbiotic root nodules with nitrogen-fixing Rhizobium' },
                    { rank: 'Family', name: 'Fabaceae', count: '~19,000 species', desc: 'Papilionaceous flower, pod/legume fruit' },
                    { rank: 'Genus', name: 'Pisum', count: '~3 species', desc: 'Climbing annual herbs with leaf tendrils' },
                    { rank: 'Species', name: 'Pisum sativum', count: '1 species', desc: 'Mendel classic experimental subject with distinct allelic traits' }
                ]
            }
        };

        const sel = container.querySelector('.organism-select');
        const slider = container.querySelector('.depth-slider');
        const depthVal = container.querySelector('.depth-val');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const orgKey = sel.value;
            const org = orgData[orgKey];
            const maxDepth = parseInt(slider.value, 10);
            depthVal.textContent = maxDepth + ' (' + org.levels[maxDepth - 1].rank + ')';

            // Pulse animation
            const pulse = Math.sin(state.time * 2) * 3;

            let svgContent = `
            <defs>
              <linearGradient id="pyrGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#1e3a8a"/>
                <stop offset="50%" stop-color="#3b82f6"/>
                <stop offset="100%" stop-color="#60a5fa"/>
              </linearGradient>
              <linearGradient id="activeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#047857"/>
                <stop offset="100%" stop-color="#10b981"/>
              </linearGradient>
            </defs>
            <rect width="800" height="420" fill="#0f172a" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              TAXONOMIC HIERARCHY: ${org.common.toUpperCase()} (${org.scientific})
            </text>
            <text x="50" y="60" fill="#94a3b8" font-size="12">Broadest Category (Kingdom/Domain) &darr; Highest Specificity (Genus & Species)</text>
            `;

            // Draw hierarchy steps
            const totalSteps = 8;
            for (let i = 0; i < totalSteps; i++) {
                const lvl = org.levels[i];
                const isActive = i < maxDepth;
                const isCurrent = i === maxDepth - 1;
                const y = 80 + i * 38;
                const barWidth = 650 - i * 50;
                const x = 75 + (i * 25);

                const fill = isCurrent ? 'url(#activeGrad)' : (isActive ? 'url(#pyrGrad)' : '#334155');
                const stroke = isCurrent ? '#34d399' : (isActive ? '#60a5fa' : '#475569');
                const strokeWidth = isCurrent ? 2.5 : 1;
                const barHeight = isCurrent ? 30 + pulse * 0.4 : 28;

                svgContent += `
                <g class="tier-group" opacity="${isActive ? '1' : '0.4'}">
                  <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="5" 
                        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                  <text x="${x + 15}" y="${y + 19}" fill="#ffffff" font-size="13" font-weight="${isCurrent ? 'bold' : 'normal'}">
                    ${lvl.rank}: <tspan fill="#fef08a" font-style="${lvl.rank === 'Genus' || lvl.rank === 'Species' ? 'italic' : 'normal'}">${lvl.name}</tspan>
                  </text>
                  <text x="${x + barWidth - 15}" y="${y + 19}" fill="#cbd5e1" font-size="11" text-anchor="end">
                    ${lvl.count}
                  </text>
                </g>`;
            }

            svg.innerHTML = svgContent;

            const curr = org.levels[maxDepth - 1];
            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Current Rank:</strong> ${curr.rank}</div>
              <div><strong>Taxon Name:</strong> <em>${curr.name}</em></div>
              <div><strong>Estimated Diversity:</strong> ${curr.count}</div>
              <div><strong>Shared Similarities:</strong> ${Math.round((maxDepth / 8) * 100)}%</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-note" style="margin-top: 10px;">
              <strong>Taxonomic Principle:</strong> As we descend from ${org.levels[0].rank} down to ${org.levels[7].rank}, 
              the total number of species decreases drastically, but the degree of mutual morphological, anatomical, and genomic 
              similarity increases exponentially. <strong>${curr.rank} (${curr.name}):</strong> ${curr.desc}.
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        sel.addEventListener('change', () => update(state));
        slider.addEventListener('input', () => update(state));
        update(state);
    }
};

// 2. Five Kingdom Classifier Decision Tree (sim-kingdom-classifier)
window.SIMS['sim-kingdom-classifier'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Whittaker's Five Kingdom Interactive Dichotomous Key</h3>
    <div class="sim-controls-top">
      <label>Cell Type:
        <select class="sel-cell form-select">
          <option value="prokaryote">Prokaryotic (No true nucleus)</option>
          <option value="eukaryote" selected>Eukaryotic (Membrane nucleus)</option>
          <option value="acellular">Acellular (Non-cellular entity)</option>
        </select>
      </label>
      <label>Cellularity:
        <select class="sel-cellularity form-select">
          <option value="unicellular">Unicellular (Solitary cell)</option>
          <option value="multicellular" selected>Multicellular (Tissue/Organs)</option>
        </select>
      </label>
      <label>Cell Wall:
        <select class="sel-wall form-select">
          <option value="cellulose">Present (Cellulose)</option>
          <option value="chitin">Present (Chitin)</option>
          <option value="peptidoglycan">Present (Peptidoglycan)</option>
          <option value="absent" selected>Absent (Naked membrane)</option>
        </select>
      </label>
      <label>Nutrition:
        <select class="sel-nutrition form-select">
          <option value="autotroph">Autotrophic (Photosynthetic)</option>
          <option value="saprotroph">Heterotrophic Absorptive (Saprotrophic)</option>
          <option value="holozoic" selected>Heterotrophic Ingestive (Holozoic)</option>
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

        const selCell = container.querySelector('.sel-cell');
        const selCellularity = container.querySelector('.sel-cellularity');
        const selWall = container.querySelector('.sel-wall');
        const selNutrition = container.querySelector('.sel-nutrition');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function evaluateClassification() {
            const cell = selCell.value;
            const mult = selCellularity.value;
            const wall = selWall.value;
            const nut = selNutrition.value;

            if (cell === 'acellular') {
                return {
                    kingdom: 'Acellular Entities (Viruses / Viroids / Prions)',
                    status: 'Excluded from Five Kingdoms',
                    color: '#ef4444',
                    icon: '🔬 Non-Living / Borderline',
                    rationale: 'Viruses lack protoplasm, ribosomes, and ATP generation. They cannot be placed in any cellular kingdom.'
                };
            }
            if (cell === 'prokaryote') {
                return {
                    kingdom: 'Kingdom Monera',
                    status: 'Valid Whittaker Kingdom',
                    color: '#eab308',
                    icon: '🦠 Bacteria & Cyanobacteria',
                    rationale: 'Prokaryotic cell architecture (nucleoid, 70S ribosomes, peptidoglycan wall). Includes Archaebacteria and Eubacteria.'
                };
            }
            if (cell === 'eukaryote' && mult === 'unicellular') {
                return {
                    kingdom: 'Kingdom Protista',
                    status: 'Valid Whittaker Kingdom',
                    color: '#06b6d4',
                    icon: '🧫 Amoeba, Paramecium, Euglena',
                    rationale: 'Unicellular eukaryotes. Can be autotrophic (Diatoms), heterotrophic (Protozoa), or mixotrophic (Euglena).'
                };
            }
            if (cell === 'eukaryote' && mult === 'multicellular') {
                if (nut === 'autotroph' && wall === 'cellulose') {
                    return {
                        kingdom: 'Kingdom Plantae',
                        status: 'Valid Whittaker Kingdom',
                        color: '#22c55e',
                        icon: '🌿 Algae, Moss, Fern, Gymno, Angiosperms',
                        rationale: 'Multicellular eukaryotic autotrophs with cellulose cell walls and chlorophyll in chloroplasts.'
                    };
                }
                if (nut === 'saprotroph' || wall === 'chitin') {
                    return {
                        kingdom: 'Kingdom Fungi',
                        status: 'Valid Whittaker Kingdom',
                        color: '#f97316',
                        icon: '🍄 Moulds, Mushrooms, Yeasts',
                        rationale: 'Multicellular eukaryotic heterotrophs with chitin cell walls and absorptive saprophytic digestion.'
                    };
                }
                if (nut === 'holozoic' && wall === 'absent') {
                    return {
                        kingdom: 'Kingdom Animalia',
                        status: 'Valid Whittaker Kingdom',
                        color: '#8b5cf6',
                        icon: '🦁 Invertebrates & Vertebrates',
                        rationale: 'Multicellular eukaryotic heterotrophs lacking cell walls with ingestive nutrition and sensory motility.'
                    };
                }
                return {
                    kingdom: 'Unconventional Mosaic Combination',
                    status: 'Key Conflict',
                    color: '#ec4899',
                    icon: '⚠️ Synthetic Phenotype',
                    rationale: `This combination (${mult} + ${wall} cell wall + ${nut} nutrition) does not match standard Whittaker taxonomy.`
                };
            }
            return { kingdom: 'Unclassified', status: 'Unknown', color: '#94a3b8', icon: '❓', rationale: 'Check inputs.' };
        }

        function update(state) {
            const res = evaluateClassification();
            const pulse = Math.sin(state.time * 2.5) * 5;

            let svgContent = `
            <rect width="800" height="380" fill="#0b132b" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              WHITTAKER'S DICHOTOMOUS CLASSIFICATION ENGINE
            </text>

            <!-- Kingdom Hubs -->
            <g transform="translate(60, 70)">
              <!-- Monera -->
              <rect x="0" y="0" width="120" height="70" rx="6" fill="${res.kingdom.includes('Monera') ? '#ca8a04' : '#1e293b'}" 
                    stroke="${res.kingdom.includes('Monera') ? '#facc15' : '#475569'}" stroke-width="${res.kingdom.includes('Monera') ? 3 : 1}"/>
              <text x="60" y="30" fill="#ffffff" text-anchor="middle" font-size="13" font-weight="bold">MONERA</text>
              <text x="60" y="52" fill="#cbd5e1" text-anchor="middle" font-size="10">Prokaryotes</text>

              <!-- Protista -->
              <rect x="140" y="0" width="120" height="70" rx="6" fill="${res.kingdom.includes('Protista') ? '#0891b2' : '#1e293b'}"
                    stroke="${res.kingdom.includes('Protista') ? '#38bdf8' : '#475569'}" stroke-width="${res.kingdom.includes('Protista') ? 3 : 1}"/>
              <text x="200" y="30" fill="#ffffff" text-anchor="middle" font-size="13" font-weight="bold">PROTISTA</text>
              <text x="200" y="52" fill="#cbd5e1" text-anchor="middle" font-size="10">Unicellular Eukaryote</text>

              <!-- Fungi -->
              <rect x="280" y="0" width="120" height="70" rx="6" fill="${res.kingdom.includes('Fungi') ? '#ea580c' : '#1e293b'}"
                    stroke="${res.kingdom.includes('Fungi') ? '#fb923c' : '#475569'}" stroke-width="${res.kingdom.includes('Fungi') ? 3 : 1}"/>
              <text x="340" y="30" fill="#ffffff" text-anchor="middle" font-size="13" font-weight="bold">FUNGI</text>
              <text x="340" y="52" fill="#cbd5e1" text-anchor="middle" font-size="10">Chitin / Saprotrophic</text>

              <!-- Plantae -->
              <rect x="420" y="0" width="120" height="70" rx="6" fill="${res.kingdom.includes('Plantae') ? '#16a34a' : '#1e293b'}"
                    stroke="${res.kingdom.includes('Plantae') ? '#4ade80' : '#475569'}" stroke-width="${res.kingdom.includes('Plantae') ? 3 : 1}"/>
              <text x="480" y="30" fill="#ffffff" text-anchor="middle" font-size="13" font-weight="bold">PLANTAE</text>
              <text x="480" y="52" fill="#cbd5e1" text-anchor="middle" font-size="10">Cellulose / Autotroph</text>

              <!-- Animalia -->
              <rect x="560" y="0" width="120" height="70" rx="6" fill="${res.kingdom.includes('Animalia') ? '#7c3aed' : '#1e293b'}"
                    stroke="${res.kingdom.includes('Animalia') ? '#a78bfa' : '#475569'}" stroke-width="${res.kingdom.includes('Animalia') ? 3 : 1}"/>
              <text x="620" y="30" fill="#ffffff" text-anchor="middle" font-size="13" font-weight="bold">ANIMALIA</text>
              <text x="620" y="52" fill="#cbd5e1" text-anchor="middle" font-size="10">No Wall / Ingestive</text>
            </g>

            <!-- Result Showcase Card -->
            <g transform="translate(150, 180)">
              <rect x="0" y="0" width="500" height="160" rx="10" fill="#1e293b" stroke="${res.color}" stroke-width="2.5"/>
              <circle cx="60" cy="80" r="${35 + pulse * 0.3}" fill="${res.color}" opacity="0.2"/>
              <text x="60" y="86" fill="${res.color}" font-size="28" text-anchor="middle">${res.icon.slice(0,2)}</text>
              
              <text x="120" y="45" fill="#f8fafc" font-size="18" font-weight="bold">${res.kingdom}</text>
              <text x="120" y="70" fill="${res.color}" font-size="13" font-weight="600">${res.status}</text>
              <foreignObject x="120" y="80" width="360" height="70">
                <p style="color: #cbd5e1; font-size: 12px; margin: 0; line-height: 1.4;">
                  ${res.rationale}
                </p>
              </foreignObject>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Cell Architecture:</strong> ${selCell.value}</div>
              <div><strong>Body Complexity:</strong> ${selCellularity.value}</div>
              <div><strong>Cell Wall Nature:</strong> ${selWall.value}</div>
              <div><strong>Trophic Mode:</strong> ${selNutrition.value}</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-note" style="margin-top: 10px; border-left-color: ${res.color};">
              <strong>Systematic Classification Verdict:</strong> Based on Whittaker's four core criteria 
              (cell structure, body organization, cell wall presence, and nutrition mode), the specimen maps directly to 
              <strong>${res.kingdom}</strong>.
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        [selCell, selCellularity, selWall, selNutrition].forEach(el => el.addEventListener('change', () => update(state)));
        update(state);
    }
};

// 3. Cryptogam Morphology Lab (sim-cryptogam-morphology)
window.SIMS['sim-cryptogam-morphology'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Plant Evolution: Seedless Cryptogams Laboratory</h3>
    <div class="sim-controls-top">
      <label>Plant Division:
        <select class="sel-division form-select">
          <option value="thallophyta" selected>Thallophyta (Algae: Spirogyra)</option>
          <option value="bryophyta">Bryophyta (Moss: Funaria)</option>
          <option value="pteridophyta">Pteridophyta (Fern: Marsilea)</option>
        </select>
      </label>
      <label>Vascular Activation:
        <input type="range" class="vasc-slider form-range" min="0" max="1" value="0" step="1">
        <span class="vasc-val">Absent (0)</span>
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

        const selDiv = container.querySelector('.sel-division');
        const vascSlider = container.querySelector('.vasc-slider');
        const vascVal = container.querySelector('.vasc-val');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const div = selDiv.value;
            // auto-sync slider with biological reality
            if (div === 'pteridophyta') {
                vascSlider.value = '1';
                vascVal.textContent = 'Present (Xylem & Phloem)';
            } else {
                vascSlider.value = '0';
                vascVal.textContent = 'Absent (Diffusion Only)';
            }

            const wave = Math.sin(state.time * 2) * 8;
            let svgContent = `
            <rect width="800" height="380" fill="#031926" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              MORPHOLOGICAL EVOLUTION: ${div.toUpperCase()}
            </text>`;

            if (div === 'thallophyta') {
                // Spirogyra water ribbon
                svgContent += `
                <!-- Water background -->
                <rect x="50" y="60" width="700" height="280" rx="8" fill="#0c4a6e" opacity="0.4"/>
                <text x="60" y="85" fill="#38bdf8" font-size="12">Aquatic Freshwater Medium</text>
                
                <!-- Filament ribbon -->
                <g transform="translate(100, 180)">
                  <!-- Filament cells -->
                  <rect x="0" y="-30" width="180" height="60" fill="none" stroke="#22c55e" stroke-width="3" rx="2"/>
                  <rect x="180" y="-30" width="180" height="60" fill="none" stroke="#22c55e" stroke-width="3" rx="2"/>
                  <rect x="360" y="-30" width="180" height="60" fill="none" stroke="#22c55e" stroke-width="3" rx="2"/>
                  
                  <!-- Spiral Chloroplast Ribbons -->
                  <path d="M 10,-20 Q 50,${20 + wave} 90,-20 T 170,-20" fill="none" stroke="#16a34a" stroke-width="6" stroke-linecap="round"/>
                  <path d="M 190,-20 Q 230,${20 + wave} 270,-20 T 350,-20" fill="none" stroke="#16a34a" stroke-width="6" stroke-linecap="round"/>
                  <path d="M 370,-20 Q 410,${20 + wave} 450,-20 T 530,-20" fill="none" stroke="#16a34a" stroke-width="6" stroke-linecap="round"/>
                  
                  <!-- Nucleus -->
                  <circle cx="90" cy="0" r="10" fill="#fbbf24" opacity="0.8"/>
                  <circle cx="270" cy="0" r="10" fill="#fbbf24" opacity="0.8"/>
                  <circle cx="450" cy="0" r="10" fill="#fbbf24" opacity="0.8"/>
                </g>
                
                <text x="400" y="270" fill="#93c5fd" text-anchor="middle" font-size="13">
                  Undifferentiated Thallus: No true root, stem, or leaf. Absorbs water & nutrients directly by diffusion.
                </text>`;
            } else if (div === 'bryophyta') {
                // Moss Funaria
                svgContent += `
                <!-- Soil substrate -->
                <rect x="50" y="290" width="700" height="60" fill="#451a03" rx="4"/>
                <text x="60" y="320" fill="#d97706" font-size="12">Moist Shaded Terrestrial Soil</text>

                <!-- Moss plant -->
                <g transform="translate(400, 290)">
                  <!-- Rhizoids -->
                  <path d="M 0,0 Q -15,20 -30,40 M 0,0 Q 10,20 20,40 M 0,0 Q 0,25 -5,50" fill="none" stroke="#92400e" stroke-width="2.5"/>
                  <text x="-50" y="35" fill="#d97706" font-size="11">Rhizoids</text>

                  <!-- Gametophyte leafy shoot -->
                  <path d="M 0,0 L 0,-100" stroke="#15803d" stroke-width="6"/>
                  <!-- Leaves -->
                  <path d="M 0,-20 Q -25,-30 -40,-20 M 0,-40 Q 25,-50 40,-40 M 0,-60 Q -25,-70 -40,-60 M 0,-80 Q 25,-90 40,-80" 
                        fill="none" stroke="#22c55e" stroke-width="4"/>
                  <text x="60" y="-50" fill="#22c55e" font-size="12" font-weight="bold">Gametophyte (Haploid dominant)</text>

                  <!-- Dependent Sporophyte Seta & Capsule -->
                  <path d="M 0,-100 C ${wave * 2},-150 ${-wave * 2},-180 0,-210" fill="none" stroke="#ca8a04" stroke-width="3"/>
                  <ellipse cx="0" cy="-215" rx="12" ry="8" fill="#ea580c"/>
                  <!-- Calyptra / Operculum -->
                  <path d="M -10,-218 Q 0,-230 10,-218 Z" fill="#b45309"/>
                  <text x="25" y="-210" fill="#f97316" font-size="12" font-weight="bold">Sporophyte (Spore capsule)</text>
                </g>`;
            } else {
                // Pteridophyta Marsilea / Fern
                svgContent += `
                <!-- Substrate -->
                <rect x="50" y="290" width="700" height="60" fill="#365314" rx="4"/>
                <text x="60" y="320" fill="#a3e635" font-size="12">Marshy / Damp Substrate</text>

                <!-- Fern anatomy -->
                <g transform="translate(380, 290)">
                  <!-- True Roots -->
                  <path d="M -80,10 L -90,40 M -40,10 L -30,50 M 20,10 L 30,45 M 70,10 L 80,40" stroke="#78350f" stroke-width="3"/>
                  <text x="-120" y="35" fill="#b45309" font-size="11">True Adventitious Roots</text>

                  <!-- Underground Rhizome stem -->
                  <rect x="-100" y="-10" width="200" height="20" rx="6" fill="#713f12" stroke="#a16207" stroke-width="2"/>
                  <text x="110" y="5" fill="#eab308" font-size="11">Rhizome (Stem with Xylem/Phloem)</text>

                  <!-- Large Frond with Sori -->
                  <path d="M 0,-10 C -20,-80 -10,-150 ${wave},-220" fill="none" stroke="#15803d" stroke-width="5"/>
                  <!-- Pinnae leaflets -->
                  <g stroke="#16a34a" stroke-width="4" fill="none">
                    <path d="M -5,-60 Q -50,-80 -70,-60 M 0,-60 Q 40,-80 65,-60"/>
                    <path d="M -8,-110 Q -50,-130 -65,-110 M 0,-110 Q 45,-130 65,-110"/>
                    <path d="M -5,-160 Q -40,-180 -55,-160 M 0,-160 Q 35,-180 50,-160"/>
                  </g>
                  
                  <!-- Sori clusters (sporangia) under leaves -->
                  <circle cx="-35" cy="-68" r="4" fill="#ea580c"/>
                  <circle cx="35" cy="-68" r="4" fill="#ea580c"/>
                  <circle cx="-30" cy="-118" r="4" fill="#ea580c"/>
                  <circle cx="30" cy="-118" r="4" fill="#ea580c"/>
                  <text x="75" y="-115" fill="#f97316" font-size="11">Sori (Spore clusters)</text>
                </g>`;
            }

            svg.innerHTML = svgContent;

            const readouts = {
                thallophyta: { organs: 'No root/stem/leaf', vascular: 'Absent', dominant: 'Gametophyte', rep: 'Zygotic spores' },
                bryophyta: { organs: 'Rhizoids & false stem/leaf', vascular: 'Absent', dominant: 'Gametophyte (independent)', rep: 'Capsule spores' },
                pteridophyta: { organs: 'True roots, stem (rhizome) & fronds', vascular: 'Present (Xylem/Phloem)', dominant: 'Sporophyte (independent)', rep: 'Sori sporangia' }
            };

            const r = readouts[div];
            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Body Differentiation:</strong> ${r.organs}</div>
              <div><strong>Vascular Tissues:</strong> ${r.vascular}</div>
              <div><strong>Dominant Generation:</strong> ${r.dominant}</div>
              <div><strong>Spore Formation:</strong> ${r.rep}</div>
            </div>`;

            const verdicts = {
                thallophyta: 'Thallophytes (Algae) thrive in aquatic habitats without structural tissues. Every cell handles its own water and nutrient exchange.',
                bryophyta: 'Bryophytes are the "amphibians of the plant kingdom". They inhabit damp land but require external water films for flagellated antherozoids to swim to archegonia.',
                pteridophyta: 'Pteridophytes are the earliest true vascular plants (Tracheophytes). Vascular bundles allow tall erect growth and colonization of dry terrestrial environments.'
            };

            verdict.innerHTML = `
            <div class="alert-box alert-tip" style="margin-top: 10px;">
              <strong>Evolutionary Milestone:</strong> ${verdicts[div]}
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        selDiv.addEventListener('change', () => update(state));
        update(state);
    }
};

// 4. Phanerogam Seeds Lab (sim-phanerogam-seeds)
window.SIMS['sim-phanerogam-seeds'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Seed Plants: Gymnosperms vs Angiosperms (Monocots & Dicots)</h3>
    <div class="sim-controls-top">
      <label>Select Specimen:
        <select class="sel-specimen form-select">
          <option value="gymno">Gymnosperm (Pinus - Naked Cone Seed)</option>
          <option value="dicot" selected>Dicot Angiosperm (Gram / Pea - 2 Cotyledons)</option>
          <option value="monocot">Monocot Angiosperm (Maize - 1 Cotyledon)</option>
        </select>
      </label>
      <label>Dissection Layer:
        <select class="sel-layer form-select">
          <option value="seed" selected>Seed Architecture</option>
          <option value="leaf">Leaf Venation & Stem Bundle</option>
          <option value="root">Root System Morphology</option>
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

        const selSpec = container.querySelector('.sel-specimen');
        const selLayer = container.querySelector('.sel-layer');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const spec = selSpec.value;
            const layer = selLayer.value;
            const pulse = Math.sin(state.time * 2) * 4;

            let svgContent = `
            <rect width="800" height="380" fill="#0f172a" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              PHANEROGAM MORPHOMETRICS: ${spec.toUpperCase()} [${layer.toUpperCase()} VIEW]
            </text>`;

            if (layer === 'seed') {
                if (spec === 'gymno') {
                    svgContent += `
                    <!-- Naked seed on cone scale -->
                    <g transform="translate(300, 80)">
                      <!-- Woody cone scale -->
                      <path d="M 0,150 C 40,80 120,40 180,20 C 140,80 80,180 0,200 Z" fill="#78350f" stroke="#b45309" stroke-width="2"/>
                      <text x="180" y="15" fill="#d97706" font-size="12">Woody Megasporophyll Scale</text>
                      
                      <!-- Naked winged seed -->
                      <ellipse cx="60" cy="140" rx="30" ry="18" fill="#ca8a04" stroke="#facc15" stroke-width="2"/>
                      <path d="M 85,135 C 130,120 180,110 210,95 C 180,130 140,150 85,145 Z" fill="#fde047" opacity="0.7"/>
                      <text x="50" y="145" fill="#78350f" font-size="11" font-weight="bold">Naked Seed</text>
                      <text x="150" y="90" fill="#fef08a" font-size="11">Wing (Wind dispersal)</text>
                    </g>
                    <text x="400" y="330" fill="#93c5fd" text-anchor="middle" font-size="13">
                      Gymnosperm: Seeds develop openly on scale surfaces without an enclosing ovary fruit wall.
                    </text>`;
                } else if (spec === 'dicot') {
                    svgContent += `
                    <!-- Dicot Seed Dissection (Bean / Gram) -->
                    <g transform="translate(250, 90)">
                      <!-- Two Split Cotyledons -->
                      <path d="M 120,130 C 70,50 0,70 10,140 C 20,200 90,200 120,160 Z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
                      <path d="M 140,130 C 190,50 260,70 250,140 C 240,200 170,200 140,160 Z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
                      
                      <!-- Embryo axis -->
                      <path d="M 130,135 Q 125,110 120,95" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
                      <circle cx="120" cy="92" r="5" fill="#eab308"/>
                      <path d="M 130,135 Q 132,160 135,175" stroke="#f97316" stroke-width="4" stroke-linecap="round"/>
                      <circle cx="135" cy="178" r="5" fill="#ea580c"/>
                      
                      <text x="35" y="130" fill="#ffffff" font-size="12" font-weight="bold">Cotyledon 1</text>
                      <text x="185" y="130" fill="#ffffff" font-size="12" font-weight="bold">Cotyledon 2</text>
                      <text x="80" y="90" fill="#facc15" font-size="11">Plumule (Shoot)</text>
                      <text x="150" y="180" fill="#fb923c" font-size="11">Radicle (Root)</text>
                    </g>
                    <text x="400" y="330" fill="#86efac" text-anchor="middle" font-size="13">
                      Dicot Seed: 2 fleshy cotyledons containing stored starch and protein for embryonic germination.
                    </text>`;
                } else {
                    svgContent += `
                    <!-- Monocot Grain Dissection (Maize) -->
                    <g transform="translate(300, 80)">
                      <rect x="0" y="0" width="200" height="230" rx="30" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5"/>
                      
                      <!-- Endosperm Region -->
                      <path d="M 10,20 C 60,10 140,10 190,20 L 190,130 C 130,120 70,120 10,130 Z" fill="#fde047"/>
                      <text x="100" y="80" fill="#854d0e" font-size="14" font-weight="bold" text-anchor="middle">Starchy Endosperm</text>
                      
                      <!-- Single Cotyledon (Scutellum) -->
                      <path d="M 10,135 C 70,130 130,130 190,135 L 190,210 C 140,225 60,225 10,210 Z" fill="#86efac"/>
                      <text x="100" y="170" fill="#166534" font-size="12" font-weight="bold" text-anchor="middle">Scutellum (1 Cotyledon)</text>
                      <circle cx="100" cy="195" r="8" fill="#3b82f6"/>
                      <text x="100" y="220" fill="#1e3a8a" font-size="10" text-anchor="middle">Embryo Axis</text>
                    </g>
                    <text x="400" y="330" fill="#fef08a" text-anchor="middle" font-size="13">
                      Monocot Grain: Single shield-shaped cotyledon (scutellum) adjacent to massive nutritive endosperm.
                    </text>`;
                }
            } else if (layer === 'leaf') {
                if (spec === 'gymno') {
                    svgContent += `
                    <g transform="translate(300, 100)">
                      <!-- Needle-like leaves -->
                      <path d="M 100,200 L 30,50 M 100,200 L 70,30 M 100,200 L 110,20 M 100,200 L 150,30 M 100,200 L 180,60" 
                            stroke="#15803d" stroke-width="6" stroke-linecap="round"/>
                      <text x="100" y="230" fill="#4ade80" font-size="12" text-anchor="middle">Needle-like Foliage (Low Surface Area, Sunken Stomata)</text>
                    </g>`;
                } else if (spec === 'dicot') {
                    svgContent += `
                    <g transform="translate(300, 80)">
                      <!-- Broad leaf with reticulate network -->
                      <path d="M 100,220 C 20,180 10,80 100,20 C 190,80 180,180 100,220 Z" fill="#22c55e" stroke="#14532d" stroke-width="2"/>
                      <!-- Midrib -->
                      <path d="M 100,220 L 100,20" stroke="#facc15" stroke-width="3.5"/>
                      <!-- Reticulate lateral veins -->
                      <path d="M 100,180 Q 60,160 30,170 M 100,180 Q 140,160 170,170" stroke="#fef08a" stroke-width="2"/>
                      <path d="M 100,140 Q 50,110 25,120 M 100,140 Q 150,110 175,120" stroke="#fef08a" stroke-width="2"/>
                      <path d="M 100,90 Q 60,70 40,75 M 100,90 Q 140,70 160,75" stroke="#fef08a" stroke-width="2"/>
                      <text x="100" y="250" fill="#facc15" font-size="13" font-weight="bold" text-anchor="middle">Reticulate (Net-like) Venation</text>
                    </g>`;
                } else {
                    svgContent += `
                    <g transform="translate(350, 70)">
                      <!-- Long blade with parallel veins -->
                      <path d="M 50,230 L 30,30 C 50,10 50,10 70,30 L 50,230 Z" fill="#84cc16" stroke="#4d7c0f" stroke-width="2"/>
                      <!-- Parallel lines -->
                      <line x1="42" y1="220" x2="42" y2="40" stroke="#fef08a" stroke-width="1.5"/>
                      <line x1="50" y1="230" x2="50" y2="25" stroke="#facc15" stroke-width="2.5"/>
                      <line x1="58" y1="220" x2="58" y2="40" stroke="#fef08a" stroke-width="1.5"/>
                      <text x="50" y="260" fill="#bef264" font-size="13" font-weight="bold" text-anchor="middle">Parallel Venation</text>
                    </g>`;
                }
            } else {
                // Root view
                if (spec === 'dicot') {
                    svgContent += `
                    <g transform="translate(400, 100)">
                      <!-- Taproot system -->
                      <path d="M 0,0 L 0,180" stroke="#b45309" stroke-width="7" stroke-linecap="round"/>
                      <!-- Secondary branch roots -->
                      <path d="M 0,30 Q -40,50 -70,70 M 0,30 Q 40,50 70,70" stroke="#d97706" stroke-width="3"/>
                      <path d="M 0,80 Q -30,100 -60,120 M 0,80 Q 30,100 60,120" stroke="#d97706" stroke-width="2.5"/>
                      <path d="M 0,130 Q -20,140 -40,160 M 0,130 Q 20,140 40,160" stroke="#d97706" stroke-width="2"/>
                      <text x="0" y="210" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">Taproot System (Deep Primary Root + Laterals)</text>
                    </g>`;
                } else {
                    svgContent += `
                    <g transform="translate(400, 100)">
                      <!-- Fibrous root cluster -->
                      <path d="M 0,0 Q -60,80 -90,170 M 0,0 Q -30,100 -40,180 M 0,0 Q -10,120 -10,185 M 0,0 Q 10,120 10,185 M 0,0 Q 30,100 40,180 M 0,0 Q 60,80 90,170"
                            stroke="#ca8a04" stroke-width="2.5" fill="none"/>
                      <text x="0" y="210" fill="#facc15" font-size="13" font-weight="bold" text-anchor="middle">Fibrous Root System (Cluster of Slender Roots from Stem Base)</text>
                    </g>`;
                }
            }

            svg.innerHTML = svgContent;

            const summary = {
                gymno: { seeds: 'Naked (in woody female cones)', leaves: 'Needle-like / xerophytic', roots: 'Taproot (mycorrhizal)', cot: 'Multiple (polyembryony)' },
                dicot: { seeds: 'Enclosed inside fruit wall', leaves: 'Reticulate (net) venation', roots: 'Taproot system', cot: '2 cotyledons' },
                monocot: { seeds: 'Enclosed inside grain/caryopsis', leaves: 'Parallel venation', roots: 'Fibrous root cluster', cot: '1 cotyledon (scutellum)' }
            };

            const s = summary[spec];
            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Seed Protection:</strong> ${s.seeds}</div>
              <div><strong>Cotyledon Count:</strong> ${s.cot}</div>
              <div><strong>Leaf Venation:</strong> ${s.leaves}</div>
              <div><strong>Root Architecture:</strong> ${s.roots}</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-note" style="margin-top: 10px;">
              <strong>Morphological Correlation:</strong> The number of cotyledons in angiosperms reliably predicts leaf venation and root structure:
              <strong>Dicot</strong> = 2 cotyledons + reticulate venation + taproots; <strong>Monocot</strong> = 1 cotyledon + parallel venation + fibrous roots.
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        selSpec.addEventListener('change', () => update(state));
        selLayer.addEventListener('change', () => update(state));
        update(state);
    }
};

// 5. Invertebrate Phyla Architect (sim-invertebrate-phyla)
window.SIMS['sim-invertebrate-phyla'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Kingdom Animalia: Invertebrate Body Plan Architect</h3>
    <div class="sim-controls-top">
      <label>Phylum:
        <select class="sel-phylum form-select">
          <option value="porifera">Porifera (Sponges - Sycon)</option>
          <option value="cnidaria">Cnidaria (Hydra / Jellyfish)</option>
          <option value="platy">Platyhelminthes (Tapeworm / Planaria)</option>
          <option value="nematoda">Nematoda (Ascaris Roundworm)</option>
          <option value="annelida" selected>Annelida (Earthworm)</option>
          <option value="arthropoda">Arthropoda (Insect / Prawn)</option>
          <option value="mollusca">Mollusca (Pila / Snail)</option>
          <option value="echinodermata">Echinodermata (Starfish)</option>
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

        const selPhy = container.querySelector('.sel-phylum');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        const phylaDetails = {
            porifera: { name: 'Porifera', level: 'Cellular Level', sym: 'Asymmetrical', coelom: 'Acoelomate', layers: 'Diploblastic-like / Cellular', trait: 'Ostia pores & spongocoel canal system', ex: 'Sycon, Spongilla' },
            cnidaria: { name: 'Cnidaria', level: 'Tissue Level', sym: 'Radial Symmetry', coelom: 'Acoelomate (gastrovascular cavity)', layers: 'Diploblastic (Ecto + Endo)', trait: 'Cnidocyte stinging tentacles', ex: 'Hydra, Aurelia' },
            platy: { name: 'Platyhelminthes', level: 'Organ Level', sym: 'Bilateral Symmetry', coelom: 'Acoelomate (solid mesoderm)', layers: 'Triploblastic', trait: 'Dorsoventrally flattened, flame cells', ex: 'Planaria, Taenia' },
            nematoda: { name: 'Nematoda', level: 'Organ System', sym: 'Bilateral Symmetry', coelom: 'Pseudocoelomate', layers: 'Triploblastic', trait: 'Cylindrical body, hydrostatic pseudocoel', ex: 'Ascaris, Wuchereria' },
            annelida: { name: 'Annelida', level: 'Organ System', sym: 'Bilateral Symmetry', coelom: 'True Coelomate', layers: 'Triploblastic', trait: 'Metameric segmentation & chitinous setae', ex: 'Earthworm, Leech' },
            arthropoda: { name: 'Arthropoda', level: 'Organ System', sym: 'Bilateral Symmetry', coelom: 'Coelomate (Haemocoel)', layers: 'Triploblastic', trait: 'Jointed appendages & chitinous exoskeleton', ex: 'Cockroach, Butterfly, Prawn' },
            mollusca: { name: 'Mollusca', level: 'Organ System', sym: 'Bilateral Symmetry', coelom: 'True Coelomate', layers: 'Triploblastic', trait: 'Calcareous shell, mantle, muscular foot', ex: 'Pila, Octopus, Unio' },
            echinodermata: { name: 'Echinodermata', level: 'Organ System', sym: 'Radial (adult) / Bilateral (larva)', coelom: 'True Enterocoelomate', layers: 'Triploblastic', trait: 'Water vascular ambulacral tube feet', ex: 'Asterias (Starfish), Sea Urchin' }
        };

        function update(state) {
            const p = phylaDetails[selPhy.value];
            const pulse = Math.sin(state.time * 2.5) * 5;

            let svgContent = `
            <rect width="800" height="380" fill="#0b0f19" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              PHYLUM ${p.name.toUpperCase()} — BODY PLAN ARCHITECTURE
            </text>

            <!-- Cross Section Graphic -->
            <g transform="translate(180, 180)">
              <!-- Body Wall Outer -->
              <circle cx="0" cy="0" r="90" fill="#1e293b" stroke="#38bdf8" stroke-width="4"/>
              <text x="0" y="-98" fill="#38bdf8" font-size="11" text-anchor="middle">Outer Ectoderm / Epicuticle</text>
              
              <!-- Mesoderm / Coelom Region -->`;
            
            if (p.coelom === 'Acoelomate (solid mesoderm)' || p.name === 'Platyhelminthes') {
                svgContent += `
                <!-- Solid Mesoderm -->
                <circle cx="0" cy="0" r="70" fill="#b45309" opacity="0.8"/>
                <text x="0" y="-45" fill="#fef08a" font-size="11" text-anchor="middle">Solid Mesodermal Parenchyma (No Cavity)</text>`;
            } else if (p.coelom === 'Pseudocoelomate') {
                svgContent += `
                <!-- Pseudocoelom with loose mesodermal patches -->
                <circle cx="0" cy="0" r="70" fill="#0284c7" opacity="0.3"/>
                <circle cx="-35" cy="-30" r="14" fill="#b45309"/>
                <circle cx="35" cy="-30" r="14" fill="#b45309"/>
                <circle cx="-35" cy="30" r="14" fill="#b45309"/>
                <circle cx="35" cy="30" r="14" fill="#b45309"/>
                <text x="0" y="-45" fill="#38bdf8" font-size="11" text-anchor="middle">Pseudocoelom (Persistent Blastocoel)</text>`;
            } else if (p.coelom.includes('Coelomate') || p.coelom.includes('Enterocoelomate')) {
                svgContent += `
                <!-- True Coelom lined by Peritoneum -->
                <circle cx="0" cy="0" r="70" fill="#15803d" stroke="#22c55e" stroke-width="2.5" opacity="0.4"/>
                <path d="M -70,0 A 70,70 0 0,0 70,0" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="4,4"/>
                <text x="0" y="-45" fill="#4ade80" font-size="11" text-anchor="middle">True Coelom Lined by Mesodermal Peritoneum</text>`;
            }

            // Gut tube in centre
            svgContent += `
              <!-- Endoderm / Gut tube -->
              <circle cx="0" cy="0" r="${25 + pulse * 0.3}" fill="#ef4444" stroke="#f87171" stroke-width="2"/>
              <circle cx="0" cy="0" r="12" fill="#0f172a"/>
              <text x="0" y="4" fill="#ffffff" font-size="10" text-anchor="middle">Lumen</text>
              <text x="0" y="45" fill="#fca5a5" font-size="11" text-anchor="middle">Endoderm / Alimentary Canal</text>
            </g>

            <!-- Diagnostic Trait Panel -->
            <g transform="translate(420, 80)">
              <rect x="0" y="0" width="330" height="230" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
              <text x="20" y="30" fill="#38bdf8" font-size="14" font-weight="bold">Key Diagnostic Hallmark:</text>
              <text x="20" y="55" fill="#fef08a" font-size="13" font-weight="600">${p.trait}</text>
              
              <line x1="20" y1="75" x2="310" y2="75" stroke="#334155" stroke-width="1"/>
              
              <text x="20" y="100" fill="#94a3b8" font-size="12">Symmetry: <tspan fill="#ffffff">${p.sym}</tspan></text>
              <text x="20" y="125" fill="#94a3b8" font-size="12">Organization: <tspan fill="#ffffff">${p.level}</tspan></text>
              <text x="20" y="150" fill="#94a3b8" font-size="12">Germ Layers: <tspan fill="#ffffff">${p.layers}</tspan></text>
              <text x="20" y="175" fill="#94a3b8" font-size="12">Coelom Type: <tspan fill="#ffffff">${p.coelom}</tspan></text>
              <text x="20" y="205" fill="#34d399" font-size="12">Representative Taxa: <tspan font-style="italic">${p.ex}</tspan></text>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Phylum:</strong> ${p.name}</div>
              <div><strong>Symmetry:</strong> ${p.sym}</div>
              <div><strong>Coelom:</strong> ${p.coelom}</div>
              <div><strong>Organ Level:</strong> ${p.level}</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-note" style="margin-top: 10px;">
              <strong>Body Plan Evolutionary Principle:</strong> The transition from acoelomate flatworms to pseudocoelomate roundworms and 
              subsequently true coelomate annelids and arthropods enabled internal organs to develop independently of outer body contractions.
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        selPhy.addEventListener('change', () => update(state));
        update(state);
    }
};

// 6. Vertebrate Classes & Heart Chambers (sim-vertebrate-classes)
window.SIMS['sim-vertebrate-classes'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Subphylum Vertebrata: Heart Chambers & Thermoregulation</h3>
    <div class="sim-controls-top">
      <label>Vertebrate Class:
        <select class="sel-class form-select">
          <option value="pisces">Pisces (Rohu Fish - 2 Chambers)</option>
          <option value="amphibia">Amphibia (Frog - 3 Chambers)</option>
          <option value="reptilia" selected>Reptilia (Lizard - Incomplete 3 Chambers)</option>
          <option value="crocodile">Reptilia Exception (Crocodile - 4 Chambers)</option>
          <option value="aves">Aves (Pigeon - 4 Chambers)</option>
          <option value="mammalia">Mammalia (Human - 4 Chambers)</option>
        </select>
      </label>
      <label>Ambient Temperature:
        <input type="range" class="temp-slider form-range" min="0" max="45" value="25" step="1">
        <span class="temp-val">25°C</span>
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

        const selClass = container.querySelector('.sel-class');
        const tempSlider = container.querySelector('.temp-slider');
        const tempVal = container.querySelector('.temp-val');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const vclass = selClass.value;
            const ambient = parseFloat(tempSlider.value);
            tempVal.textContent = ambient + '°C';

            // Calculate core temperature & metabolism
            let coreTemp = ambient;
            let thermoType = 'Poikilothermic (Cold-blooded)';
            let heartChambers = 3;
            let mixing = 'Partial blood mixing';

            if (vclass === 'pisces') {
                coreTemp = ambient;
                heartChambers = 2;
                mixing = 'Single circulation (all venous)';
            } else if (vclass === 'amphibia') {
                coreTemp = ambient;
                heartChambers = 3;
                mixing = 'High blood mixing in single ventricle';
            } else if (vclass === 'reptilia') {
                coreTemp = ambient;
                heartChambers = 3;
                mixing = 'Partial mixing (incomplete septum)';
            } else if (vclass === 'crocodile') {
                coreTemp = ambient;
                heartChambers = 4;
                mixing = 'Minimal mixing (Panizza foramen shunt)';
            } else if (vclass === 'aves') {
                coreTemp = 41.5; // constant avian temp
                thermoType = 'Homeothermic (Warm-blooded)';
                heartChambers = 4;
                mixing = 'Zero mixing (Complete Double Circulation)';
            } else if (vclass === 'mammalia') {
                coreTemp = 37.0; // constant mammalian temp
                thermoType = 'Homeothermic (Warm-blooded)';
                heartChambers = 4;
                mixing = 'Zero mixing (Complete Double Circulation)';
            }

            const beat = Math.sin(state.time * (thermoType.includes('Warm') ? 6 : 3)) * 4;

            let svgContent = `
            <rect width="800" height="380" fill="#080e1a" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              VERTEBRATE CARDIAC BLUEPRINT & THERMOREGULATORY THERMOSTAT
            </text>

            <!-- Heart Diagram -->
            <g transform="translate(180, 180)">
              <rect x="-110" y="-100" width="220" height="200" rx="14" fill="#1e293b" stroke="#475569" stroke-width="2"/>
              <text x="0" y="-80" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">
                ${heartChambers}-CHAMBERED HEART
              </text>`;

            if (heartChambers === 2) {
                // Fish 2 chamber
                svgContent += `
                <!-- 1 Atrium (Blue venous) -->
                <rect x="-80" y="-60" width="160" height="60" rx="8" fill="#1d4ed8" stroke="#3b82f6" stroke-width="2"/>
                <text x="0" y="-25" fill="#ffffff" font-size="12" text-anchor="middle">Single Atrium (Deox)</text>

                <!-- 1 Ventricle -->
                <rect x="-80" y="10" width="160" height="${70 + beat}" rx="8" fill="#2563eb" stroke="#60a5fa" stroke-width="2"/>
                <text x="0" y="48" fill="#ffffff" font-size="12" text-anchor="middle">Single Ventricle &rarr; Gills</text>`;
            } else if (heartChambers === 3 && vclass !== 'crocodile') {
                // Amphibian / Reptile 3 chamber
                svgContent += `
                <!-- Right Atrium (Deox blue) -->
                <rect x="-95" y="-60" width="85" height="60" rx="6" fill="#1d4ed8" stroke="#3b82f6" stroke-width="2"/>
                <text x="-52" y="-25" fill="#ffffff" font-size="11" text-anchor="middle">Right Atrium</text>

                <!-- Left Atrium (Ox red) -->
                <rect x="10" y="-60" width="85" height="60" rx="6" fill="#b91c1c" stroke="#ef4444" stroke-width="2"/>
                <text x="52" y="-25" fill="#ffffff" font-size="11" text-anchor="middle">Left Atrium</text>

                <!-- Common Ventricle (Purple mixing) -->
                <rect x="-95" y="10" width="190" height="${70 + beat}" rx="8" fill="#7e22ce" stroke="#a855f7" stroke-width="2"/>
                <text x="0" y="48" fill="#ffffff" font-size="12" text-anchor="middle">Common Ventricle (Mixed Blood)</text>`;
            } else {
                // 4 Chamber (Crocodile, Aves, Mammalia)
                svgContent += `
                <!-- Right Atrium -->
                <rect x="-95" y="-60" width="85" height="60" rx="6" fill="#1d4ed8" stroke="#3b82f6" stroke-width="2"/>
                <text x="-52" y="-25" fill="#ffffff" font-size="11" text-anchor="middle">Right Atrium</text>

                <!-- Left Atrium -->
                <rect x="10" y="-60" width="85" height="60" rx="6" fill="#b91c1c" stroke="#ef4444" stroke-width="2"/>
                <text x="52" y="-25" fill="#ffffff" font-size="11" text-anchor="middle">Left Atrium</text>

                <!-- Right Ventricle (Pulmonary blue) -->
                <rect x="-95" y="10" width="85" height="${70 + beat}" rx="6" fill="#2563eb" stroke="#60a5fa" stroke-width="2"/>
                <text x="-52" y="48" fill="#ffffff" font-size="10" text-anchor="middle">Right Vent (To Lungs)</text>

                <!-- Left Ventricle (Systemic red) -->
                <rect x="10" y="10" width="85" height="${70 + beat}" rx="6" fill="#dc2626" stroke="#f87171" stroke-width="2"/>
                <text x="52" y="48" fill="#ffffff" font-size="10" text-anchor="middle">Left Vent (To Body)</text>`;
            }

            svgContent += `</g>

            <!-- Thermoregulation Thermometer & Response -->
            <g transform="translate(420, 80)">
              <rect x="0" y="0" width="330" height="230" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
              <text x="20" y="30" fill="#facc15" font-size="14" font-weight="bold">Thermoregulatory Status:</text>
              <text x="20" y="55" fill="${thermoType.includes('Warm') ? '#4ade80' : '#38bdf8'}" font-size="13" font-weight="600">${thermoType}</text>

              <line x1="20" y1="75" x2="310" y2="75" stroke="#334155" stroke-width="1"/>

              <text x="20" y="105" fill="#cbd5e1" font-size="12">Ambient Air Temp: <tspan font-weight="bold" fill="#f59e0b">${ambient}°C</tspan></text>
              <text x="20" y="130" fill="#cbd5e1" font-size="12">Core Internal Temp: <tspan font-weight="bold" fill="${thermoType.includes('Warm') ? '#4ade80' : '#38bdf8'}">${coreTemp.toFixed(1)}°C</tspan></text>
              <text x="20" y="155" fill="#cbd5e1" font-size="12">Heart Partition: <tspan fill="#ffffff">${heartChambers} Chambers</tspan></text>
              <text x="20" y="180" fill="#cbd5e1" font-size="12">Blood Circuit: <tspan fill="#ffffff">${mixing}</tspan></text>

              <!-- Thermometer visual -->
              <rect x="20" y="195" width="280" height="14" rx="4" fill="#334155"/>
              <rect x="20" y="195" width="${(coreTemp / 50) * 280}" height="14" rx="4" fill="${thermoType.includes('Warm') ? '#22c55e' : '#0284c7'}"/>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Vertebrate Class:</strong> ${selClass.options[selClass.selectedIndex].text.split(' ')[0]}</div>
              <div><strong>Heart Structure:</strong> ${heartChambers} Chambers</div>
              <div><strong>Ambient vs Core:</strong> ${ambient}°C &rarr; ${coreTemp.toFixed(1)}°C</div>
              <div><strong>Metabolic Mode:</strong> ${thermoType.split(' ')[0]}</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-tip" style="margin-top: 10px;">
              <strong>Physiological Verdict:</strong> ${thermoType.includes('Warm') ? 
                'Birds and mammals sustain high metabolic rates powered by complete double circulation, maintaining constant core temperature regardless of arctic cold or desert heat.' : 
                'Cold-blooded vertebrates experience temperature-dependent metabolic rates; in extreme cold or heat they must hibernate or aestivate to survive.'}
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        selClass.addEventListener('change', () => update(state));
        tempSlider.addEventListener('input', () => update(state));
        update(state);
    }
};

// 7. Ecosystem Stability & Keystone Food Web (sim-ecosystem-stability)
window.SIMS['sim-ecosystem-stability'] = {
    mount: function(container) {
        container.innerHTML = `
<div class="sim-wrapper">
  <div class="sim-header">
    <h3>Biodiversity & Ecosystem Stability Food Web Simulator</h3>
    <div class="sim-controls-top">
      <label>Species Richness:
        <input type="range" class="richness-slider form-range" min="3" max="15" value="12" step="1">
        <span class="richness-val">12 Species</span>
      </label>
      <label>Keystone Species:
        <select class="sel-keystone form-select">
          <option value="present" selected>Present (Apex Predator Intact)</option>
          <option value="removed">Removed (Habitat Disturbance / Poaching)</option>
        </select>
      </label>
      <label>Environmental Shock:
        <select class="sel-shock form-select">
          <option value="none" selected>Normal Equilibrium</option>
          <option value="drought">Severe Drought (Producers -40%)</option>
          <option value="invasive">Invasive Weed Invasion</option>
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

        const richSlider = container.querySelector('.richness-slider');
        const richVal = container.querySelector('.richness-val');
        const selKey = container.querySelector('.sel-keystone');
        const selShock = container.querySelector('.sel-shock');
        const svg = container.querySelector('.sim-svg');
        const readout = container.querySelector('#lab-readout');
        const verdict = container.querySelector('#lab-verdict');

        function update(state) {
            const richness = parseInt(richSlider.value, 10);
            richVal.textContent = richness + ' Species';
            const hasKeystone = selKey.value === 'present';
            const shock = selShock.value;

            // Calculate stability index
            let stability = (richness / 15) * 60 + (hasKeystone ? 30 : 5);
            if (shock === 'drought') stability -= 20;
            if (shock === 'invasive') stability -= 25;
            stability = Math.max(10, Math.min(100, Math.round(stability)));

            const pulse = Math.sin(state.time * 3) * 3;

            let svgContent = `
            <rect width="800" height="380" fill="#0b1120" rx="8"/>
            <text x="400" y="30" fill="#f8fafc" text-anchor="middle" font-size="16" font-weight="bold">
              FOOD WEB RESILIENCE: ${richness} SPECIES (${hasKeystone ? 'KEYSTONE INTACT' : 'KEYSTONE ABSENT'})
            </text>

            <!-- Food Web Network Graph -->
            <g transform="translate(80, 70)">
              <!-- Trophic Levels -->
              <text x="-20" y="40" fill="#ef4444" font-size="12" font-weight="bold">Tertiary (Apex)</text>
              <text x="-20" y="120" fill="#fb923c" font-size="12" font-weight="bold">Secondary</text>
              <text x="-20" y="190" fill="#facc15" font-size="12" font-weight="bold">Primary Herbivores</text>
              <text x="-20" y="260" fill="#4ade80" font-size="12" font-weight="bold">Producers</text>

              <!-- Network Links -->`;
            
            // Draw links
            const nodes = [];
            // Producers (y=260)
            const prodCount = Math.min(5, Math.max(2, Math.floor(richness * 0.4)));
            for (let i = 0; i < prodCount; i++) {
                nodes.push({ id: `p${i}`, x: 150 + i * 90, y: 260, color: '#22c55e', role: 'Producer' });
            }
            // Herbivores (y=190)
            const herbCount = Math.min(4, Math.max(1, Math.floor(richness * 0.3)));
            for (let i = 0; i < herbCount; i++) {
                nodes.push({ id: `h${i}`, x: 180 + i * 110, y: 190, color: '#eab308', role: 'Herbivore' });
            }
            // Secondary (y=120)
            const carnCount = Math.min(3, Math.max(1, Math.floor(richness * 0.2)));
            for (let i = 0; i < carnCount; i++) {
                nodes.push({ id: `c${i}`, x: 220 + i * 120, y: 120, color: '#f97316', role: 'Carnivore' });
            }
            // Apex (y=40)
            if (hasKeystone) {
                nodes.push({ id: 'apex', x: 300, y: 40, color: '#ef4444', role: 'Keystone Apex' });
            }

            // Draw connecting web lines
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    if (Math.abs(nodes[i].y - nodes[j].y) < 90) {
                        svgContent += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" 
                                             stroke="#334155" stroke-width="1.5" stroke-opacity="0.6"/>`;
                    }
                }
            }

            // Draw node circles
            nodes.forEach(n => {
                const r = n.id === 'apex' ? 14 + pulse * 0.4 : 10;
                svgContent += `
                <circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${n.color}" stroke="#ffffff" stroke-width="2"/>
                <text x="${n.x}" y="${n.y + 4}" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">${n.id.toUpperCase()}</text>`;
            });

            svgContent += `</g>

            <!-- Stability Gauge Box -->
            <g transform="translate(560, 80)">
              <rect x="0" y="0" width="200" height="230" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
              <text x="100" y="30" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">ECOSYSTEM RESILIENCE</text>
              
              <circle cx="100" cy="100" r="50" fill="none" stroke="#334155" stroke-width="10"/>
              <circle cx="100" cy="100" r="50" fill="none" 
                      stroke="${stability > 70 ? '#22c55e' : (stability > 40 ? '#facc15' : '#ef4444')}" 
                      stroke-width="10" stroke-dasharray="314" stroke-dashoffset="${314 - (stability / 100) * 314}" stroke-linecap="round"/>
              <text x="100" y="108" fill="#f8fafc" font-size="22" font-weight="bold" text-anchor="middle">${stability}%</text>

              <text x="100" y="170" fill="#cbd5e1" font-size="11" text-anchor="middle">
                ${stability > 70 ? 'High Resilience' : (stability > 40 ? 'Moderate Fragility' : 'High Extinction Risk')}
              </text>
              <text x="100" y="195" fill="#94a3b8" font-size="10" text-anchor="middle">
                ${hasKeystone ? 'Trophic Cascade Prevented' : 'Mesopredator Release Warning'}
              </text>
            </g>`;

            svg.innerHTML = svgContent;

            readout.innerHTML = `
            <div class="readout-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 13px;">
              <div><strong>Species Count:</strong> ${richness}</div>
              <div><strong>Keystone State:</strong> ${hasKeystone ? 'Present' : 'Removed'}</div>
              <div><strong>Disturbance Shock:</strong> ${shock}</div>
              <div><strong>Resilience Score:</strong> ${stability}%</div>
            </div>`;

            verdict.innerHTML = `
            <div class="alert-box alert-tip" style="margin-top: 10px;">
              <strong>Ecological Law of Diversity & Stability:</strong> More complex, biodiverse food webs possess redundant pathways. 
              If one herbivore or producer experiences population stress, interconnected species buffer against collapse, maintaining 
              steady bio-geochemical cycles.
            </div>`;
        }

        const state = createSimState(container, update);
        state.bindControls();
        richSlider.addEventListener('input', () => update(state));
        selKey.addEventListener('change', () => update(state));
        selShock.addEventListener('change', () => update(state));
        update(state);
    }
};
