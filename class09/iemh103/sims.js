
// =========================================================================
// IEMH103: THE WORLD OF NUMBERS
// Interactive Mathematical Manipulatives & Laboratory Engines
// =========================================================================

window.SIM_STATE = {
  currentConcept: 'c1',
  isPlaying: false,
  timer: null,
  scrubberVal: 0,
  speed: 1,
  // Concept-specific states
  c1: { mode: 'ishango', jointCount: 6, spiceBags: 6 },
  c2: { fortunes: 8, debts: 5, opMode: 'balance', multA: -4, multB: -3 },
  c3: { preset: '2_5_to_3_5', aNum: 2, aDen: 5, bNum: 3, bDen: 5, n: 5, method: 'equal' },
  c4: { step: 4, showDissection: true },
  c5: { den: 7, num: 1, mode: 'wheel' },
  c6: { count: 6, showArcs: true }
};

window.SIM_ENGINES = {

  // -----------------------------------------------------------------------
  // LAB 1: ANCIENT TALLY & BASE-12 FINGER JOINT WORKBENCH (pp. 41–43)
  // -----------------------------------------------------------------------
  c1: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🦴 Ancient Tally, Primes & Base-12 Finger Joint Counter</div>
            <div style="font-size:13px;color:#94a3b8;">1-to-1 Correspondence • Ishango Bone (20,000 BCE) • Lothal Trade</div>
          </div>
          <div id="c1-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c1-btn-ishango" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">🦴 Ishango Primes (11, 13, 17, 19)</button>
            <button class="lab-btn" id="c1-btn-hand" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">🖐 12 Finger Joints (Base-12)</button>
            <button class="lab-btn" id="c1-btn-lothal" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">⚖ Lothal Ingot Trade</button>
            <button class="lab-btn" id="c1-btn-lebombo" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">🌙 Lebombo Lunar (29)</button>
          </div>

          <div id="c1-controls" style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div id="c1-control-box" style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label id="c1-slider-label" style="font-size:11px;color:#94a3b8;display:block;">Finger Joint Count: <b id="c1-val-display" style="color:#38bdf8;">6</b></label>
              <input type="range" id="c1-slider" min="1" max="12" value="6" step="1" style="width:100%;">
            </div>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c1;
      var slider = document.getElementById('c1-slider');
      var sliderLabel = document.getElementById('c1-slider-label');
      var valDisplay = document.getElementById('c1-val-display');

      function setMode(mode) {
        s.mode = mode;
        ['ishango', 'hand', 'lothal', 'lebombo'].forEach(function(m) {
          var b = document.getElementById('c1-btn-' + m);
          if (b) b.style.background = (m === mode) ? '#0284c7' : '#334155';
        });
        if (mode === 'hand') {
          slider.min = '1'; slider.max = '12'; slider.value = s.jointCount;
          sliderLabel.innerHTML = 'Finger Joint Count (Thumb Pointer): <b id="c1-val-display" style="color:#38bdf8;">' + s.jointCount + '</b>';
        } else if (mode === 'lothal') {
          slider.min = '2'; slider.max = '30'; slider.step = '2'; slider.value = s.spiceBags;
          sliderLabel.innerHTML = 'Bags of Spice to Trade: <b id="c1-val-display" style="color:#38bdf8;">' + s.spiceBags + '</b>';
        } else if (mode === 'ishango') {
          slider.min = '1'; slider.max = '4'; slider.step = '1'; slider.value = '4';
          sliderLabel.innerHTML = 'Prime Notch Group: <b id="c1-val-display" style="color:#38bdf8;">All 4 (11, 13, 17, 19)</b>';
        } else {
          slider.min = '1'; slider.max = '29'; slider.step = '1'; slider.value = '29';
          sliderLabel.innerHTML = 'Lunar Day Notches: <b id="c1-val-display" style="color:#38bdf8;">29</b>';
        }
        window.SIM_ENGINES.c1.update();
      }

      document.getElementById('c1-btn-ishango').onclick = function() { setMode('ishango'); };
      document.getElementById('c1-btn-hand').onclick = function() { setMode('hand'); };
      document.getElementById('c1-btn-lothal').onclick = function() { setMode('lothal'); };
      document.getElementById('c1-btn-lebombo').onclick = function() { setMode('lebombo'); };

      slider.oninput = function() {
        if (s.mode === 'hand') {
          s.jointCount = parseInt(slider.value);
          document.getElementById('c1-val-display').innerText = s.jointCount;
        } else if (s.mode === 'lothal') {
          s.spiceBags = parseInt(slider.value);
          document.getElementById('c1-val-display').innerText = s.spiceBags;
        }
        window.SIM_ENGINES.c1.update();
      };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c1;
      var box = document.getElementById('c1-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 240;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      if (s.mode === 'ishango') {
        // Render Ishango bone with 4 clusters
        var boneX = 40, boneY = 60, boneW = w - 80, boneH = 70;
        svg += `
          <defs>
            <linearGradient id="boneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#d4b584"/>
              <stop offset="50%" stop-color="#bfa06a"/>
              <stop offset="100%" stop-color="#8c6d3d"/>
            </linearGradient>
          </defs>
          <rect x="${boneX}" y="${boneY}" width="${boneW}" height="${boneH}" rx="25" fill="url(#boneGrad)" stroke="#5c4321" stroke-width="3"/>
          <text x="${w/2}" y="35" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Ishango Bone: Prime Number Tally Column (~20,000 BCE)</text>
        `;
        var clusters = [11, 13, 17, 19];
        var totalNotches = 11 + 13 + 17 + 19;
        var startX = boneX + 30;
        var gap = (boneW - 80) / 4;

        clusters.forEach(function(num, idx) {
          var cx = startX + idx * gap;
          svg += `<text x="${cx + 25}" y="${boneY - 10}" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Prime: ${num}</text>`;
          for (var i = 0; i < num; i++) {
            var nx = cx + (i % 6) * 7;
            var ny = boneY + 12 + Math.floor(i / 6) * 16;
            svg += `<line x1="${nx}" y1="${ny}" x2="${nx + 4}" y2="${ny + 10}" stroke="#261705" stroke-width="2.5" stroke-linecap="round"/>`;
          }
        });

        // doublings highlight
        svg += `<text x="${w/2}" y="${boneY + boneH + 30}" fill="#94a3b8" font-size="12" text-anchor="middle">Groupings: 11, 13, 17, 19 (Consecutive Primes between 10 &amp; 20). Total prime tallies = 60.</text>`;

        readout.innerHTML = `ARTIFACT: Ishango Bone (Congo, ~20,000 BCE) | COLUMNS: Prime Column (11, 13, 17, 19) | TOTAL NOTCHES: 60 | PATTERN: Prime density awareness`;
        verdict.innerHTML = `<strong>Mathematical Truth:</strong> The Ishango bone provides 22,000-year-old evidence that Paleolithic humans recognized prime numbers (11, 13, 17, 19) long before written civilization!`;
      }
      else if (s.mode === 'hand') {
        // Render 4 fingers with 3 joints each + thumb pointer
        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Anatomy of Base-12: 4 Fingers × 3 Joints = 12 Counts per Hand</text>
        `;
        var fingers = ['Index', 'Middle', 'Ring', 'Little'];
        var fingerW = (w - 120) / 4;
        var jointTotal = s.jointCount;

        fingers.forEach(function(name, fIdx) {
          var fx = 70 + fIdx * fingerW;
          svg += `<text x="${fx + fingerW/2}" y="60" fill="#94a3b8" font-size="11" text-anchor="middle">${name}</text>`;
          // 3 joints per finger
          for (var j = 0; j < 3; j++) {
            var jointIndex = fIdx * 3 + (3 - j);
            var jy = 75 + j * 42;
            var isActive = (fIdx * 3 + (j + 1)) <= jointTotal;
            var fillCol = isActive ? '#0284c7' : '#334155';
            var strokeCol = isActive ? '#38bdf8' : '#64748b';
            var txtCol = isActive ? '#ffffff' : '#94a3b8';

            svg += `
              <rect x="${fx + 10}" y="${jy}" width="${fingerW - 20}" height="34" rx="6" fill="${fillCol}" stroke="${strokeCol}" stroke-width="2"/>
              <text x="${fx + fingerW/2}" y="${jy + 21}" fill="${txtCol}" font-size="11" font-weight="bold" text-anchor="middle">J${fIdx * 3 + j + 1}</text>
            `;
          }
        });

        // Thumb pointer indicator
        svg += `
          <circle cx="45" cy="140" r="18" fill="#f59e0b" stroke="#fbbf24" stroke-width="2"/>
          <text x="45" y="145" fill="#000" font-size="10" font-weight="bold" text-anchor="middle">Thumb</text>
          <text x="${w/2}" y="220" fill="#38bdf8" font-size="12" text-anchor="middle">5 Full Hand Cycles × 12 Joints = 60 (Sexagesimal Astronomical Base)</text>
        `;

        readout.innerHTML = `HAND COUNT: ${jointTotal} of 12 Phalanges | FRACTION OF DOZEN: ${(jointTotal/12).toFixed(2)} | SEXAGESIMAL FRACTION: ${(jointTotal/60).toFixed(3)}`;
        verdict.innerHTML = `<strong>Base-12 to Base-60 Origin:</strong> Using the thumb to point to 3 phalanges on each of the 4 fingers allowed counting to 12 on one hand. Using the 5 fingers of the other hand yielded $5 \\times 12 = 60$, creating our 60 minutes, 60 seconds, and 360° circle!`;
      }
      else if (s.mode === 'lothal') {
        // Lothal Spice to Copper Ingot Trade
        var bags = s.spiceBags;
        var ingots = (bags / 2) * 15;
        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Indus Valley Trade at Lothal Port: Ratio 2 Spice Bags = 15 Copper Ingots</text>
          <g transform="translate(60, 60)">
            <rect x="0" y="0" width="${w/2 - 80}" height="120" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
            <text x="${(w/2 - 80)/2}" y="30" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">🌿 Spices Brought</text>
            <text x="${(w/2 - 80)/2}" y="70" fill="#ffffff" font-size="28" font-weight="bold" text-anchor="middle">${bags} Bags</text>
            <text x="${(w/2 - 80)/2}" y="100" fill="#94a3b8" font-size="11" text-anchor="middle">${bags/2} trade pairs</text>
          </g>
          <text x="${w/2}" y="125" fill="#38bdf8" font-size="24" font-weight="bold" text-anchor="middle">⇄</text>
          <g transform="translate(${w/2 + 20}, 60)">
            <rect x="0" y="0" width="${w/2 - 80}" height="120" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="${(w/2 - 80)/2}" y="30" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">🪙 Copper Ingots Received</text>
            <text x="${(w/2 - 80)/2}" y="70" fill="#ffffff" font-size="28" font-weight="bold" text-anchor="middle">${ingots}</text>
            <text x="${(w/2 - 80)/2}" y="100" fill="#94a3b8" font-size="11" text-anchor="middle">15 ingots per 2 bags</text>
          </g>
          <text x="${w/2}" y="215" fill="#94a3b8" font-size="12" text-anchor="middle">Proportion: (Ingots / ${bags}) = (15 / 2) ⟹ Ingots = (${bags} × 15) / 2 = ${ingots}</text>
        `;

        readout.innerHTML = `INPUT: ${bags} spice bags | EXCHANGE RATE: 7.5 ingots/bag | COPPER INGOTS RETURNED: ${ingots}`;
        verdict.innerHTML = `<strong>Standardized Trade:</strong> The merchants of Harappa and Lothal used unit ratios to trade terracotta, spices, and lapis lazuli with Mesopotamia, laying early foundations for proportional rational arithmetic.`;
      }
      else {
        // Lebombo Lunar Calendar
        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Lebombo Bone (~35,000 BCE): 29 Notches Lunar Month Counter</text>
          <rect x="50" y="80" width="${w - 100}" height="40" rx="15" fill="#a16207" stroke="#713f12" stroke-width="3"/>
        `;
        var step = (w - 140) / 29;
        for (var k = 0; k < 29; k++) {
          var kx = 70 + k * step;
          svg += `<line x1="${kx}" y1="88" x2="${kx}" y2="112" stroke="#451a03" stroke-width="2.5"/>`;
        }
        svg += `
          <circle cx="${w/2}" cy="160" r="22" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <text x="${w/2}" y="165" fill="#000" font-size="11" font-weight="bold" text-anchor="middle">29.5d</text>
          <text x="${w/2}" y="210" fill="#94a3b8" font-size="12" text-anchor="middle">29 notches exactly mirror the synodic lunar cycle tracked in Vedic Panchangas.</text>
        `;
        readout.innerHTML = `ARTIFACT: Lebombo Bone (Swaziland, 35,000 BCE) | TALLIES: 29 discrete notches | ASTRONOMICAL CORRELATE: Synodic Lunar Month (29.53 days)`;
        verdict.innerHTML = `<strong>Lunar Tracking:</strong> Over 35,000 years ago, natural counting numbers $\\mathbb{N}$ enabled humans to predict lunar cycles and agricultural seasons.`;
      }

      svg += `</svg>`;
      box.innerHTML = svg;
    }
  },

  // -----------------------------------------------------------------------
  // LAB 2: BRAHMAGUPTA'S LEDGER OF FORTUNES & DEBTS (pp. 43–48)
  // -----------------------------------------------------------------------
  c2: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">⚖ Brahmagupta's Ledger: Dhana (Fortunes) &amp; Ṛiṇa (Debts)</div>
            <div style="font-size:13px;color:#94a3b8;">Brāhmasphuṭasiddhānta (628 CE) • Zero Pairs • Multiplication of Signs</div>
          </div>
          <div id="c2-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c2-btn-balance" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">🪙 Balance Scale (Zero Pairs)</button>
            <button class="lab-btn" id="c2-btn-mult" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">✖ Brahmagupta's Sign Multiplier</button>
            <button class="lab-btn" id="c2-btn-subdebt" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">✂ Subtracting Debt: a - (-b) = a + b</button>
          </div>

          <div id="c2-controls" style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;">
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Fortunes (+Dhana): <b id="c2-fort-val" style="color:#10b981;">8</b></label>
              <input type="range" id="c2-slider-fort" min="0" max="15" value="8" step="1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Debts (-Ṛiṇa): <b id="c2-debt-val" style="color:#ef4444;">5</b></label>
              <input type="range" id="c2-slider-debt" min="0" max="15" value="5" step="1" style="width:100%;">
            </div>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c2;
      var fSlider = document.getElementById('c2-slider-fort');
      var dSlider = document.getElementById('c2-slider-debt');

      function setOpMode(m) {
        s.opMode = m;
        ['balance', 'mult', 'subdebt'].forEach(function(k) {
          var b = document.getElementById('c2-btn-' + k);
          if (b) b.style.background = (k === m) ? '#0284c7' : '#334155';
        });
        window.SIM_ENGINES.c2.update();
      }

      document.getElementById('c2-btn-balance').onclick = function() { setOpMode('balance'); };
      document.getElementById('c2-btn-mult').onclick = function() { setOpMode('mult'); };
      document.getElementById('c2-btn-subdebt').onclick = function() { setOpMode('subdebt'); };

      fSlider.oninput = function() {
        s.fortunes = parseInt(fSlider.value);
        document.getElementById('c2-fort-val').innerText = s.fortunes;
        window.SIM_ENGINES.c2.update();
      };
      dSlider.oninput = function() {
        s.debts = parseInt(dSlider.value);
        document.getElementById('c2-debt-val').innerText = s.debts;
        window.SIM_ENGINES.c2.update();
      };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c2;
      var box = document.getElementById('c2-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 240;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      if (s.opMode === 'balance') {
        var F = s.fortunes;
        var D = s.debts;
        var net = F - D;
        var pairs = Math.min(F, D);

        // Visual Balance Scale
        var pivotX = w / 2;
        var pivotY = 160;
        var tilt = Math.max(-15, Math.min(15, (D - F) * 1.5)); // angle
        var beamL = 180;
        var rad = tilt * Math.PI / 180;
        var leftPanX = pivotX - beamL * Math.cos(rad);
        var leftPanY = pivotY - beamL * Math.sin(rad);
        var rightPanX = pivotX + beamL * Math.cos(rad);
        var rightPanY = pivotY + beamL * Math.sin(rad);

        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Brahmagupta's Ledger Scale: Fortunes (+${F}) vs Debts (-${D})</text>
          <!-- Stand -->
          <line x1="${pivotX}" y1="${pivotY}" x2="${pivotX}" y2="210" stroke="#64748b" stroke-width="4"/>
          <polygon points="${pivotX-20},210 ${pivotX+20},210 ${pivotX},190" fill="#475569"/>
          <!-- Beam -->
          <line x1="${leftPanX}" y1="${leftPanY}" x2="${rightPanX}" y2="${rightPanY}" stroke="#e2e8f0" stroke-width="4"/>
          <circle cx="${pivotX}" cy="${pivotY}" r="6" fill="#38bdf8"/>
          <!-- Left Pan (Fortunes / Dhana) -->
          <line x1="${leftPanX}" y1="${leftPanY}" x2="${leftPanX-25}" y2="${leftPanY+40}" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="${leftPanX}" y1="${leftPanY}" x2="${leftPanX+25}" y2="${leftPanY+40}" stroke="#94a3b8" stroke-width="1.5"/>
          <ellipse cx="${leftPanX}" cy="${leftPanY+40}" rx="35" ry="8" fill="#10b981" stroke="#059669" stroke-width="2"/>
          <text x="${leftPanX}" y="${leftPanY+30}" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">+${F} Dhana</text>

          <!-- Right Pan (Debts / Rina) -->
          <line x1="${rightPanX}" y1="${rightPanY}" x2="${rightPanX-25}" y2="${rightPanY+40}" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="${rightPanX}" y1="${rightPanY}" x2="${rightPanX+25}" y2="${rightPanY+40}" stroke="#94a3b8" stroke-width="1.5"/>
          <ellipse cx="${rightPanX}" cy="${rightPanY+40}" rx="35" ry="8" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
          <text x="${rightPanX}" y="${rightPanY+30}" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">-${D} Ṛiṇa</text>

          <!-- Status badge -->
          <rect x="${w/2 - 75}" y="50" width="150" height="30" rx="6" fill="#0f172a" stroke="${net >= 0 ? '#10b981' : '#ef4444'}" stroke-width="2"/>
          <text x="${w/2}" y="70" fill="${net >= 0 ? '#10b981' : '#ef4444'}" font-size="13" font-weight="bold" text-anchor="middle">Net Worth = ${net >= 0 ? '+' + net : net}</text>
        `;

        readout.innerHTML = `DHANA (Fortunes): +${F} | ṚIṆA (Debts): -${D} | ZERO PAIRS CANCELLED: ${pairs} | NET INTEGER: ${net}`;
        verdict.innerHTML = net === 0
          ? `<strong>Śhūnya (Zero State):</strong> Fortunes and debts exactly balance! $(${F}) + (-${D}) = 0$. The ledger is perfectly balanced.`
          : net > 0
          ? `<strong>Net Fortune:</strong> After cancelling ${pairs} zero pairs, you retain a positive fortune of +${net}.`
          : `<strong>Net Debt:</strong> After cancelling ${pairs} zero pairs, an unpaid debt of ${Math.abs(net)} remains.`;
      }
      else if (s.opMode === 'mult') {
        // Multiplier rules
        var a = -s.fortunes || -4;
        var b = -s.debts || -3;
        var prod = a * b;

        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Brahmagupta's Law of Signs: The Product of Two Debts is a Fortune!</text>
          <g transform="translate(${w/2 - 160}, 60)">
            <rect x="0" y="0" width="320" height="120" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <text x="160" y="40" fill="#f8fafc" font-size="20" font-weight="bold" text-anchor="middle">
              <tspan fill="#ef4444">(${a})</tspan> × <tspan fill="#ef4444">(${b})</tspan> = <tspan fill="#10b981">+${prod}</tspan>
            </text>
            <text x="160" y="75" fill="#38bdf8" font-size="13" text-anchor="middle">Ṛiṇa × Ṛiṇa = Dhana (Negative × Negative = Positive)</text>
            <text x="160" y="100" fill="#94a3b8" font-size="11" text-anchor="middle">Brahmagupta (628 CE): 'The product of two debts is a fortune'</text>
          </g>
        `;
        readout.innerHTML = `MULTIPLICATION: (${a}) × (${b}) = +${prod} | RULE: Negative × Negative = Positive`;
        verdict.innerHTML = `<strong>Why $(-a) \\times (-b) = +ab$:</strong> If you remove $a$ payments of debt $b$ from your records, your net capital increases by $ab$. Negating a debt creates an asset!`;
      }
      else {
        // Subtraction of Debt: a - (-b) = a + b
        var current = s.fortunes;
        var debtRemoved = s.debts;
        var finalWorth = current + debtRemoved;

        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Cancelling a Debt: Subtracting Negative Equals Adding Positive</text>
          <g transform="translate(${w/2 - 170}, 60)">
            <rect x="0" y="0" width="340" height="120" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
            <text x="170" y="45" fill="#f8fafc" font-size="20" font-weight="bold" text-anchor="middle">
              ${current} - <tspan fill="#ef4444">(-${debtRemoved})</tspan> = <tspan fill="#10b981">${finalWorth}</tspan>
            </text>
            <text x="170" y="80" fill="#38bdf8" font-size="13" text-anchor="middle">Removing a debt of ₹${debtRemoved} increases net wealth by ₹${debtRemoved}!</text>
            <text x="170" y="105" fill="#94a3b8" font-size="11" text-anchor="middle">Formal law: a - (-b) = a + b</text>
          </g>
        `;
        readout.innerHTML = `INITIAL WORTH: ₹${current} | DEBT CANCELLED: -₹${debtRemoved} | FINAL WORTH: ₹${finalWorth}`;
        verdict.innerHTML = `<strong>Creditor Debt Cancellation:</strong> When a creditor forgives your loan of ₹${debtRemoved}, your liabilities decrease to zero, which raises your net financial worth by precisely ₹${debtRemoved}.`;
      }

      svg += `</svg>`;
      box.innerHTML = svg;
    }
  },

  // -----------------------------------------------------------------------
  // LAB 3: RATIONAL DENSITY & NUMBER LINE ZOOMER (pp. 48–56)
  // -----------------------------------------------------------------------
  c3: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🔍 Rational Density &amp; Number Line Micro-Zoomer</div>
            <div style="font-size:13px;color:#94a3b8;">Infinite Intermediate Rationals • Average Midpoint • Common Denominators</div>
          </div>
          <div id="c3-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c3-p1" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">[2/5, 3/5] (Ex 3.4)</button>
            <button class="lab-btn" id="c3-p2" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">[-1/2, 1/4]</button>
            <button class="lab-btn" id="c3-p3" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">[3, 4] (EOC Q5)</button>
            <button class="lab-btn" id="c3-p4" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">[3.1415, 3.1416]</button>
          </div>

          <div style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Intermediate Points (n): <b id="c3-n-val" style="color:#38bdf8;">5</b></label>
              <input type="range" id="c3-slider-n" min="1" max="15" value="5" step="1" style="width:100%;">
            </div>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c3;
      var nSlider = document.getElementById('c3-slider-n');

      function setPreset(p, aN, aD, bN, bD, nDefault) {
        s.preset = p; s.aNum = aN; s.aDen = aD; s.bNum = bN; s.bDen = bD;
        s.n = nDefault;
        nSlider.value = nDefault;
        document.getElementById('c3-n-val').innerText = nDefault;
        ['p1', 'p2', 'p3', 'p4'].forEach(function(k) {
          var b = document.getElementById('c3-' + k);
          if (b) b.style.background = (k === p) ? '#0284c7' : '#334155';
        });
        window.SIM_ENGINES.c3.update();
      }

      document.getElementById('c3-p1').onclick = function() { setPreset('p1', 2, 5, 3, 5, 5); };
      document.getElementById('c3-p2').onclick = function() { setPreset('p2', -1, 2, 1, 4, 3); };
      document.getElementById('c3-p3').onclick = function() { setPreset('p3', 3, 1, 4, 1, 6); };
      document.getElementById('c3-p4').onclick = function() { setPreset('p4', 31415, 10000, 31416, 10000, 3); };

      nSlider.oninput = function() {
        s.n = parseInt(nSlider.value);
        document.getElementById('c3-n-val').innerText = s.n;
        window.SIM_ENGINES.c3.update();
      };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c3;
      var box = document.getElementById('c3-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 240;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      var aVal = s.aNum / s.aDen;
      var bVal = s.bNum / s.bDen;
      var n = s.n;

      var lineY = 120;
      var padX = 60;
      var spanW = w - 2 * padX;

      svg += `
        <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Interval [${s.aNum}/${s.aDen}, ${s.bNum}/${s.bDen}] with ${n} Scaled Intermediate Rationals</text>
        <line x1="${padX - 20}" y1="${lineY}" x2="${w - padX + 20}" y2="${lineY}" stroke="#64748b" stroke-width="3"/>
      `;

      // Endpoints
      svg += `
        <!-- Left Bound -->
        <circle cx="${padX}" cy="${lineY}" r="7" fill="#ef4444" stroke="#fff" stroke-width="2"/>
        <line x1="${padX}" y1="${lineY - 15}" x2="${padX}" y2="${lineY + 15}" stroke="#ef4444" stroke-width="2"/>
        <text x="${padX}" y="${lineY - 22}" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">a = ${s.aNum}/${s.aDen}</text>
        <text x="${padX}" y="${lineY + 30}" fill="#94a3b8" font-size="11" text-anchor="middle">${aVal.toFixed(4)}</text>

        <!-- Right Bound -->
        <circle cx="${w - padX}" cy="${lineY}" r="7" fill="#10b981" stroke="#fff" stroke-width="2"/>
        <line x1="${w - padX}" y1="${lineY - 15}" x2="${w - padX}" y2="${lineY + 15}" stroke="#10b981" stroke-width="2"/>
        <text x="${w - padX}" y="${lineY - 22}" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">b = ${s.bNum}/${s.bDen}</text>
        <text x="${w - padX}" y="${lineY + 30}" fill="#94a3b8" font-size="11" text-anchor="middle">${bVal.toFixed(4)}</text>
      `;

      // Intermediate Points
      var points = [];
      for (var i = 1; i <= n; i++) {
        var frac = i / (n + 1);
        var ptVal = aVal + frac * (bVal - aVal);
        var ptX = padX + frac * spanW;
        points.push(ptVal.toFixed(4));

        svg += `
          <circle cx="${ptX}" cy="${lineY}" r="5" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
          <line x1="${ptX}" y1="${lineY - 10}" x2="${ptX}" y2="${lineY + 10}" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="${ptX}" y="${lineY + (i % 2 === 0 ? 30 : 18)}" fill="#38bdf8" font-size="10" text-anchor="middle">q${i}</text>
        `;
      }

      svg += `
        <text x="${w/2}" y="200" fill="#94a3b8" font-size="12" text-anchor="middle">Scaling denominator by (n+1) = ${n+1} yields exactly ${n} interior rational coordinates.</text>
      `;

      readout.innerHTML = `INTERVAL: [${aVal.toFixed(5)}, ${bVal.toFixed(5)}] | GAP: ${(bVal - aVal).toFixed(5)} | SLOTS INSERTED: ${n} | SAMPLES: ${points.slice(0, 4).join(', ')}...`;
      verdict.innerHTML = `<strong>The Density Theorem:</strong> Between any two distinct rational numbers $a < b$, there exist infinitely many rational numbers. Repeating this process proves there is NO 'immediate next' rational number!`;

      svg += `</svg>`;
      box.innerHTML = svg;
    }
  },

  // -----------------------------------------------------------------------
  // LAB 4: BAUDHĀYANA'S DIAGONAL & √2 ALTAR DISSECTION (pp. 56–60)
  // -----------------------------------------------------------------------
  c4: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">📐 Baudhāyana's Diagonal &amp; Altar Dissection (800 BCE)</div>
            <div style="font-size:13px;color:#94a3b8;">Śulbasūtra Unit Square Diagonal • 577/408 Approximation • Proof of √2 Irrationality</div>
          </div>
          <div id="c4-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c4-s1" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Term 1: 1</button>
            <button class="lab-btn" id="c4-s2" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Term 2: 1 + 1/3 (1.3333)</button>
            <button class="lab-btn" id="c4-s3" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Term 3: + 1/12 (1.4167)</button>
            <button class="lab-btn" id="c4-s4" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Term 4: - 1/408 (577/408 = 1.414215)</button>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c4;
      function setStep(step) {
        s.step = step;
        [1, 2, 3, 4].forEach(function(k) {
          var b = document.getElementById('c4-s' + k);
          if (b) b.style.background = (k === step) ? '#0284c7' : '#334155';
        });
        window.SIM_ENGINES.c4.update();
      }

      document.getElementById('c4-s1').onclick = function() { setStep(1); };
      document.getElementById('c4-s2').onclick = function() { setStep(2); };
      document.getElementById('c4-s3').onclick = function() { setStep(3); };
      document.getElementById('c4-s4').onclick = function() { setStep(4); };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c4;
      var box = document.getElementById('c4-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 240;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      var sqSize = 130;
      var sqX = 50, sqY = 60;

      // Unit Square
      svg += `
        <text x="${w/2}" y="25" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Baudhāyana's Śulbasūtra Formula: √2 ≈ 1 + 1/3 + 1/(3×4) - 1/(3×4×34)</text>
        <!-- Unit Square -->
        <rect x="${sqX}" y="${sqY}" width="${sqSize}" height="${sqSize}" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="${sqX + sqSize/2}" y="${sqY + sqSize + 18}" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Side = 1</text>
        <text x="${sqX - 12}" y="${sqY + sqSize/2}" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">1</text>
        <!-- Diagonal -->
        <line x1="${sqX}" y1="${sqY + sqSize}" x2="${sqX + sqSize}" y2="${sqY}" stroke="#ec4899" stroke-width="3" stroke-dasharray="${s.step >= 1 ? 'none' : '4,4'}"/>
        <text x="${sqX + sqSize/2 - 10}" y="${sqY + sqSize/2 - 8}" fill="#ec4899" font-size="13" font-weight="bold" transform="rotate(-45, ${sqX + sqSize/2}, ${sqY + sqSize/2})">d = √2</text>
      `;

      // Approximation values
      var stepData = [
        { name: "Term 1", frac: "1", dec: 1.0, err: "29.3%" },
        { name: "Term 2", frac: "1 + 1/3 = 4/3", dec: 1.33333, err: "5.7%" },
        { name: "Term 3", frac: "4/3 + 1/12 = 17/12", dec: 1.41667, err: "0.17%" },
        { name: "Term 4", frac: "17/12 - 1/408 = 577/408", dec: 1.41421569, err: "0.00015%" }
      ];
      var cur = stepData[s.step - 1];

      // Comparison Box
      var boxX = sqX + sqSize + 40;
      var boxW = w - boxX - 30;
      svg += `
        <g transform="translate(${boxX}, ${sqY})">
          <rect x="0" y="0" width="${boxW}" height="${sqSize}" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <text x="${boxW/2}" y="25" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Step ${s.step}: ${cur.name}</text>
          <text x="${boxW/2}" y="55" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">${cur.frac}</text>
          <text x="${boxW/2}" y="82" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">≈ ${cur.dec.toFixed(8)}</text>
          <text x="${boxW/2}" y="105" fill="#f59e0b" font-size="11" text-anchor="middle">True √2 = 1.41421356 | Error: ${cur.err}</text>
        </g>
      `;

      readout.innerHTML = `BAUDHĀYANA FORMULA: 577/408 ≈ 1.414215686 | TRUE VALUE: 1.414213562 | ACCURACY: 5 decimal places (Error < 0.00015%)`;
      verdict.innerHTML = `<strong>Vedic Genius (800 BCE):</strong> Baudhāyana derived $577/408$, matching $\\sqrt{2}$ to five decimal places 2,800 years ago! Yet Hippasus proved $\\sqrt{2}$ cannot be expressed by ANY finite fraction $p/q$ by contradiction.`;

      svg += `</svg>`;
      box.innerHTML = svg;
    }
  },

  // -----------------------------------------------------------------------
  // LAB 5: CYCLIC DECIMAL WHEEL (1/7, 1/13, 1/17) (pp. 60–63)
  // -----------------------------------------------------------------------
  c5: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🎡 Cyclic Decimal Wheel &amp; Repeating Period Explorer</div>
            <div style="font-size:13px;color:#94a3b8;">1/7 Heptagon Carousel • Cyclic Digits {1,4,2,8,5,7} • Proof that 0.999... = 1</div>
          </div>
          <div id="c5-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c5-d7" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">1/7 Cyclic Carousel (Period 6)</button>
            <button class="lab-btn" id="c5-d13" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">1/13 Dual Cyclic Families (Ex 3.5)</button>
            <button class="lab-btn" id="c5-nine" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Proof: 0.999... = 1</button>
          </div>

          <div style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Numerator (k): <b id="c5-num-val" style="color:#38bdf8;">1</b></label>
              <input type="range" id="c5-slider-num" min="1" max="6" value="1" step="1" style="width:100%;">
            </div>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c5;
      var numSlider = document.getElementById('c5-slider-num');

      function setDen(den, mode) {
        s.den = den; s.mode = mode;
        s.num = 1;
        numSlider.min = '1';
        numSlider.max = (den === 7) ? '6' : (den === 13 ? '12' : '1');
        numSlider.value = '1';
        document.getElementById('c5-num-val').innerText = '1';
        ['d7', 'd13', 'nine'].forEach(function(k) {
          var b = document.getElementById('c5-' + k);
          if (b) b.style.background = (k === (mode === 'nine' ? 'nine' : ('d' + den))) ? '#0284c7' : '#334155';
        });
        window.SIM_ENGINES.c5.update();
      }

      document.getElementById('c5-d7').onclick = function() { setDen(7, 'wheel'); };
      document.getElementById('c5-d13').onclick = function() { setDen(13, 'wheel'); };
      document.getElementById('c5-nine').onclick = function() { setDen(1, 'nine'); };

      numSlider.oninput = function() {
        s.num = parseInt(numSlider.value);
        document.getElementById('c5-num-val').innerText = s.num;
        window.SIM_ENGINES.c5.update();
      };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c5;
      var box = document.getElementById('c5-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 240;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      if (s.mode === 'nine') {
        // Render 0.999... = 1 Proof
        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Algebraic Proof: Why 0.9̄ = 0.99999... is Exactly Equal to 1</text>
          <g transform="translate(${w/2 - 180}, 60)">
            <rect x="0" y="0" width="360" height="140" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
            <text x="180" y="30" fill="#94a3b8" font-size="13" text-anchor="middle">Step 1: Let x = 0.99999...</text>
            <text x="180" y="55" fill="#38bdf8" font-size="13" text-anchor="middle">Step 2: Multiply by 10 ⟹ 10x = 9.99999...</text>
            <text x="180" y="80" fill="#f59e0b" font-size="13" text-anchor="middle">Step 3: Subtract ⟹ 10x - x = 9.00000...</text>
            <text x="180" y="105" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">9x = 9 ⟹ x = 9/9 = 1</text>
            <text x="180" y="128" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Conclusion: 0.9̄ ≡ 1 (Exact Identity)</text>
          </g>
        `;
        readout.innerHTML = `ALGEBRAIC PROOF: Let x = 0.9̄ ⟹ 10x = 9.9̄ ⟹ 9x = 9 ⟹ x = 1`;
        verdict.innerHTML = `<strong>Rigorous Identity:</strong> $0.\\bar{9}$ is not an approximation; it is precisely and mathematically $1$. Real numbers do not possess infinitesimal gaps.`;
      }
      else if (s.den === 7) {
        // Cyclic 1/7 Wheel
        var k = s.num;
        var digits = ['1', '4', '2', '8', '5', '7'];
        // starting index based on k
        var startMap = { 1: 0, 2: 2, 3: 1, 4: 4, 5: 5, 6: 3 }; // 1/7=.142857, 2/7=.285714, 3/7=.428571, 4/7=.571428, 5/7=.714285, 6/7=.857142
        var sIdx = startMap[k] || 0;
        var rotated = [];
        for (var i = 0; i < 6; i++) {
          rotated.push(digits[(sIdx + i) % 6]);
        }
        var decString = "0." + rotated.join('') + "...";

        // Circle Wheel
        var cx = w / 2 - 90;
        var cy = 135;
        var R = 65;

        svg += `
          <text x="${w/2}" y="25" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Cyclic Wheel of 1/7: All Multiples Circulate {1, 4, 2, 8, 5, 7}</text>
          <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#334155" stroke-width="3" stroke-dasharray="4,4"/>
        `;

        for (var d = 0; d < 6; d++) {
          var ang = (d * 60 - 90) * Math.PI / 180;
          var dx = cx + R * Math.cos(ang);
          var dy = cy + R * Math.sin(ang);
          var isLead = (d === sIdx);

          svg += `
            <circle cx="${dx}" cy="${dy}" r="16" fill="${isLead ? '#0284c7' : '#0f172a'}" stroke="${isLead ? '#38bdf8' : '#64748b'}" stroke-width="2"/>
            <text x="${dx}" y="${dy + 5}" fill="${isLead ? '#ffffff' : '#e2e8f0'}" font-size="13" font-weight="bold" text-anchor="middle">${digits[d]}</text>
          `;
        }

        // Summary Box
        var rX = w / 2 + 20;
        svg += `
          <g transform="translate(${rX}, 65)">
            <rect x="0" y="0" width="${w - rX - 30}" height="120" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
            <text x="${(w - rX - 30)/2}" y="30" fill="#38bdf8" font-size="18" font-weight="bold" text-anchor="middle">${k}/7</text>
            <text x="${(w - rX - 30)/2}" y="65" fill="#10b981" font-size="16" font-weight="bold" text-anchor="middle">= ${decString}</text>
            <text x="${(w - rX - 30)/2}" y="95" fill="#94a3b8" font-size="11" text-anchor="middle">Period: 6 repeating digits</text>
          </g>
        `;

        readout.innerHTML = `FRACTION: ${k}/7 | DECIMAL: ${decString} | START DIGIT: ${rotated[0]} | REPEATING BLOCK: ${rotated.join('')}`;
        verdict.innerHTML = `<strong>The Magic of 142857:</strong> Multiplying the block $142857$ by $1, 2, 3, 4, 5, 6$ produces purely circular shifts of the same digits! It is the smallest cyclic number in mathematics.`;
      }
      else {
        // 1/13 Two Families
        var k13 = s.num;
        var decVal = (k13 / 13).toFixed(8);
        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">1/13 Splits into Two Distinct Cyclic Families of 6 Digits (Ex 3.5)</text>
          <g transform="translate(${w/2 - 180}, 60)">
            <rect x="0" y="0" width="360" height="130" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <text x="180" y="30" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Fraction: ${k13}/13 ≈ ${decVal}</text>
            <text x="180" y="60" fill="#10b981" font-size="12" text-anchor="middle">Family A {0, 7, 6, 9, 2, 3}: 1/13, 3/13, 4/13, 9/13, 10/13, 12/13</text>
            <text x="180" y="85" fill="#f59e0b" font-size="12" text-anchor="middle">Family B {1, 5, 3, 8, 4, 6}: 2/13, 5/13, 6/13, 7/13, 8/13, 11/13</text>
            <text x="180" y="115" fill="#94a3b8" font-size="11" text-anchor="middle">Period length = 6. (Since 6 divides 13 - 1 = 12).</text>
          </g>
        `;
        readout.innerHTML = `FRACTION: ${k13}/13 | DECIMAL: ${decVal} | PERIOD: 6 digits | FAMILIES: 2 cyclic cosets`;
        verdict.innerHTML = `<strong>Coset Decomposition:</strong> For denominator $13$, the period is $6$ (half of $13 - 1 = 12$). The remainders decompose into two cyclic orbits of length 6.`;
      }

      svg += `</svg>`;
      box.innerHTML = svg;
    }
  },

  // -----------------------------------------------------------------------
  // LAB 6: SQUARE ROOT SPIRAL (WHEEL OF THEODORUS) (pp. 63–67)
  // -----------------------------------------------------------------------
  c6: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🌀 The Square Root Spiral (Wheel of Theodorus)</div>
            <div style="font-size:13px;color:#94a3b8;">Pythagorean Recurrence: h² = (√N)² + 1² = N+1 ⟹ Hypotenuse = √(N+1)</div>
          </div>
          <div id="c6-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c6-play" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">▶ Play</button>
            <button class="lab-btn" id="c6-pause" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">⏸ Pause</button>
            <button class="lab-btn" id="c6-step" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">⏭ Step</button>
            <button class="lab-btn" id="c6-reset" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">↺ Reset</button>
          </div>

          <div style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Triangles Constructed: <b id="c6-count-val" style="color:#38bdf8;">6</b></label>
              <input type="range" id="c6-slider-count" min="1" max="16" value="6" step="1" style="width:100%;">
            </div>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c6;
      var cSlider = document.getElementById('c6-slider-count');

      cSlider.oninput = function() {
        s.count = parseInt(cSlider.value);
        document.getElementById('c6-count-val').innerText = s.count;
        window.SIM_ENGINES.c6.update();
      };

      document.getElementById('c6-play').onclick = function() {
        if (window.SIM_STATE.timer) clearInterval(window.SIM_STATE.timer);
        window.SIM_STATE.timer = setInterval(function() {
          if (s.count < 16) {
            s.count++;
            cSlider.value = s.count;
            document.getElementById('c6-count-val').innerText = s.count;
            window.SIM_ENGINES.c6.update();
          } else {
            clearInterval(window.SIM_STATE.timer);
          }
        }, 600);
      };

      document.getElementById('c6-pause').onclick = function() {
        if (window.SIM_STATE.timer) clearInterval(window.SIM_STATE.timer);
      };

      document.getElementById('c6-step').onclick = function() {
        if (s.count < 16) {
          s.count++;
          cSlider.value = s.count;
          document.getElementById('c6-count-val').innerText = s.count;
          window.SIM_ENGINES.c6.update();
        }
      };

      document.getElementById('c6-reset').onclick = function() {
        if (window.SIM_STATE.timer) clearInterval(window.SIM_STATE.timer);
        s.count = 1;
        cSlider.value = 1;
        document.getElementById('c6-count-val').innerText = 1;
        window.SIM_ENGINES.c6.update();
      };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c6;
      var box = document.getElementById('c6-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 260;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      var originX = w / 2;
      var originY = h / 2 + 10;
      var unit = 32; // pixel scale for length 1

      svg += `
        <text x="${w/2}" y="25" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Square Root Spiral: Construction of √2 to √17 (Wheel of Theodorus)</text>
        <circle cx="${originX}" cy="${originY}" r="4" fill="#f59e0b"/>
        <text x="${originX - 10}" y="${originY + 16}" fill="#f59e0b" font-size="11" font-weight="bold">O</text>
      `;

      // Draw spiral triangles
      var angle = 0; // starting horizontally to right
      var px = originX + unit;
      var py = originY;

      // First horizontal leg
      svg += `<line x1="${originX}" y1="${originY}" x2="${px}" y2="${py}" stroke="#64748b" stroke-width="2"/>`;

      var colors = ['#38bdf8', '#818cf8', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#10b981'];

      var lastHypLen = Math.sqrt(2);
      var lastRoot = 2;

      for (var t = 1; t <= s.count; t++) {
        // Altitude perpendicular to current radial vector
        var radLen = Math.sqrt(t);
        var altLen = 1;
        var nextRadLen = Math.sqrt(t + 1);
        var dAngle = Math.atan2(altLen, radLen);
        var nextAngle = angle + dAngle;

        var qx = originX + unit * nextRadLen * Math.cos(nextAngle);
        var qy = originY - unit * nextRadLen * Math.sin(nextAngle);

        var col = colors[(t - 1) % colors.length];

        // Fill triangle
        svg += `
          <polygon points="${originX},${originY} ${px},${py} ${qx},${qy}" fill="${col}" fill-opacity="0.25" stroke="${col}" stroke-width="1.8"/>
          <!-- Perpendicular leg -->
          <line x1="${px}" y1="${py}" x2="${qx}" y2="${qy}" stroke="#f8fafc" stroke-width="2"/>
          <!-- Label hypotenuse -->
          <text x="${(originX + qx)/2}" y="${(originY + qy)/2}" fill="#ffffff" font-size="9" font-weight="bold">√${t + 1}</text>
        `;

        angle = nextAngle;
        px = qx;
        py = qy;
        lastHypLen = nextRadLen;
        lastRoot = t + 1;
      }

      readout.innerHTML = `TRIANGLES: ${s.count} | CURRENT HYPOTENUSE: √${lastRoot} | DECIMAL: ${lastHypLen.toFixed(5)} | RECURRENCE: (${Math.sqrt(lastRoot-1).toFixed(3)})² + 1² = ${lastRoot}`;
      verdict.innerHTML = `<strong>Wheel of Theodorus Construction:</strong> Each consecutive right triangle uses the previous hypotenuse $\\sqrt{N}$ as base and adds an orthogonal leg of 1, yielding hypotenuse $\\sqrt{(\\sqrt{N})^2 + 1^2} = \\sqrt{N+1}$. Rotating this onto the real axis physically constructs all square roots!`;

      svg += `</svg>`;
      box.innerHTML = svg;
    }
  }
};
