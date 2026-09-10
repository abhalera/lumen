
// =========================================================================
// IEMH104: EXPLORING ALGEBRAIC IDENTITIES
// Interactive Algebraic Manipulatives & Laboratory Engines
// =========================================================================

window.SIM_STATE = {
  currentConcept: 'c1',
  isPlaying: false,
  timer: null,
  scrubberVal: 0,
  speed: 1,
  // Concept-specific states
  c1: { a: 120, b: 50, mode: 'sum' },
  c2: { A: 9, B: 24, C: 16, x: 2, y: 1 },
  c3: { a: 150, b: 60, shift: 1 },
  c4: { a: 5, b: 3, preset: 'saira' },
  c5: { x: 80, y: 40, explode: 0 },
  c6: { preset: 'quad_frac', nVal: 5 }
};

window.SIM_ENGINES = {

  // -----------------------------------------------------------------------
  // LAB 1: GEOMETRIC AREA DISSECTION OF (a+b)² AND (a-b)² (pp. 68–72)
  // -----------------------------------------------------------------------
  c1: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">📐 2D Geometric Area Dissection Workbench</div>
            <div style="font-size:13px;color:#94a3b8;">(a + b)² = a² + 2ab + b² • (a - b)² = a² - 2ab + b²</div>
          </div>
          <div id="c1-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c1-btn-sum" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">(a + b)² Sum Dissection</button>
            <button class="lab-btn" id="c1-btn-diff" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">(a - b)² Difference Model</button>
            <button class="lab-btn" id="c1-btn-105" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Preset: 105² = (100+5)²</button>
            <button class="lab-btn" id="c1-btn-64" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Preset: 64² = (60+4)²</button>
          </div>

          <div style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;">
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Dimension a: <b id="c1-a-val" style="color:#38bdf8;">120</b></label>
              <input type="range" id="c1-slider-a" min="60" max="150" value="120" step="5" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Dimension b: <b id="c1-b-val" style="color:#f59e0b;">50</b></label>
              <input type="range" id="c1-slider-b" min="20" max="80" value="50" step="5" style="width:100%;">
            </div>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c1;
      var aSlider = document.getElementById('c1-slider-a');
      var bSlider = document.getElementById('c1-slider-b');

      function setMode(m) {
        s.mode = m;
        document.getElementById('c1-btn-sum').style.background = (m === 'sum') ? '#0284c7' : '#334155';
        document.getElementById('c1-btn-diff').style.background = (m === 'diff') ? '#0284c7' : '#334155';
        window.SIM_ENGINES.c1.update();
      }

      document.getElementById('c1-btn-sum').onclick = function() { setMode('sum'); };
      document.getElementById('c1-btn-diff').onclick = function() { setMode('diff'); };

      document.getElementById('c1-btn-105').onclick = function() {
        s.mode = 'sum';
        s.a = 130; s.b = 30;
        aSlider.value = 130; bSlider.value = 30;
        document.getElementById('c1-a-val').innerText = '100';
        document.getElementById('c1-b-val').innerText = '5';
        setMode('sum');
      };

      document.getElementById('c1-btn-64').onclick = function() {
        s.mode = 'sum';
        s.a = 120; s.b = 40;
        aSlider.value = 120; bSlider.value = 40;
        document.getElementById('c1-a-val').innerText = '60';
        document.getElementById('c1-b-val').innerText = '4';
        setMode('sum');
      };

      aSlider.oninput = function() {
        s.a = parseInt(aSlider.value);
        document.getElementById('c1-a-val').innerText = s.a;
        window.SIM_ENGINES.c1.update();
      };
      bSlider.oninput = function() {
        s.b = parseInt(bSlider.value);
        document.getElementById('c1-b-val').innerText = s.b;
        window.SIM_ENGINES.c1.update();
      };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c1;
      var box = document.getElementById('c1-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 250;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      var a = s.a;
      var b = s.b;
      var scale = 190 / (a + b);
      var aPx = a * scale;
      var bPx = b * scale;

      var startX = 60;
      var startY = 30;

      if (s.mode === 'sum') {
        // (a + b)^2
        svg += `
          <text x="${w/2}" y="20" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">Geometric Dissection of (a + b)² into 4 Regions</text>
          
          <!-- Region 1: a² square -->
          <rect x="${startX}" y="${startY}" width="${aPx}" height="${aPx}" fill="#0284c7" fill-opacity="0.75" stroke="#38bdf8" stroke-width="2"/>
          <text x="${startX + aPx/2}" y="${startY + aPx/2 + 5}" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">a²</text>

          <!-- Region 2: top-right ab rectangle -->
          <rect x="${startX + aPx}" y="${startY}" width="${bPx}" height="${aPx}" fill="#0d9488" fill-opacity="0.75" stroke="#2dd4bf" stroke-width="2"/>
          <text x="${startX + aPx + bPx/2}" y="${startY + aPx/2 + 5}" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">ab</text>

          <!-- Region 3: bottom-left ab rectangle -->
          <rect x="${startX}" y="${startY + aPx}" width="${aPx}" height="${bPx}" fill="#0d9488" fill-opacity="0.75" stroke="#2dd4bf" stroke-width="2"/>
          <text x="${startX + aPx/2}" y="${startY + aPx + bPx/2 + 5}" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">ab</text>

          <!-- Region 4: b² square -->
          <rect x="${startX + aPx}" y="${startY + aPx}" width="${bPx}" height="${bPx}" fill="#eab308" fill-opacity="0.75" stroke="#fde047" stroke-width="2"/>
          <text x="${startX + aPx + bPx/2}" y="${startY + aPx + bPx/2 + 5}" fill="#000000" font-size="12" font-weight="bold" text-anchor="middle">b²</text>

          <!-- Dimension labels -->
          <text x="${startX + aPx/2}" y="${startY + aPx + bPx + 16}" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">a</text>
          <text x="${startX + aPx + bPx/2}" y="${startY + aPx + bPx + 16}" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">b</text>
        `;

        var infoX = startX + aPx + bPx + 40;
        svg += `
          <g transform="translate(${infoX}, ${startY})">
            <rect x="0" y="0" width="${w - infoX - 30}" height="190" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
            <text x="15" y="30" fill="#38bdf8" font-size="14" font-weight="bold">Area Partition:</text>
            <text x="15" y="60" fill="#38bdf8" font-size="12">• a² = ${a}² = ${a*a}</text>
            <text x="15" y="85" fill="#2dd4bf" font-size="12">• 2ab = 2(${a})(${b}) = ${2*a*b}</text>
            <text x="15" y="110" fill="#fde047" font-size="12">• b² = ${b}² = ${b*b}</text>
            <line x1="15" y1="125" x2="${w - infoX - 45}" y2="125" stroke="#475569"/>
            <text x="15" y="150" fill="#ffffff" font-size="14" font-weight="bold">Total = ${(a+b)*(a+b)}</text>
            <text x="15" y="172" fill="#10b981" font-size="12">≡ (${a} + ${b})²</text>
          </g>
        `;

        readout.innerHTML = `a = ${a} | b = ${b} | a² = ${a*a} | 2ab = ${2*a*b} | b² = ${b*b} | SUM: ${(a+b)*(a+b)} = (${a+b})²`;
        verdict.innerHTML = `<strong>Universal Identity:</strong> $(a + b)^2 = a^2 + 2ab + b^2$ is proven by partition: a square of side $(a+b)$ always splits into two squares and two matching rectangles.`;
      }
      else {
        // (a - b)^2
        svg += `
          <text x="${w/2}" y="20" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">Geometric Deduction of (a - b)² = a² - 2ab + b²</text>
          
          <!-- Base a² square -->
          <rect x="${startX}" y="${startY}" width="${aPx}" height="${aPx}" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          
          <!-- (a-b)² sub square -->
          <rect x="${startX}" y="${startY}" width="${aPx - bPx}" height="${aPx - bPx}" fill="#10b981" fill-opacity="0.8" stroke="#34d399" stroke-width="2"/>
          <text x="${startX + (aPx - bPx)/2}" y="${startY + (aPx - bPx)/2 + 5}" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">(a - b)²</text>

          <!-- Subtracted strips -->
          <rect x="${startX + aPx - bPx}" y="${startY}" width="${bPx}" height="${aPx}" fill="#ef4444" fill-opacity="0.4" stroke="#f87171" stroke-width="1.5"/>
          <rect x="${startX}" y="${startY + aPx - bPx}" width="${aPx}" height="${bPx}" fill="#ef4444" fill-opacity="0.4" stroke="#f87171" stroke-width="1.5"/>

          <!-- Overlapping b² corner -->
          <rect x="${startX + aPx - bPx}" y="${startY + aPx - bPx}" width="${bPx}" height="${bPx}" fill="#a855f7" fill-opacity="0.75" stroke="#c084fc" stroke-width="2"/>
          <text x="${startX + aPx - bPx/2}" y="${startY + aPx - bPx/2 + 5}" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">+b²</text>
        `;

        var infoX = startX + aPx + 30;
        svg += `
          <g transform="translate(${infoX}, ${startY})">
            <rect x="0" y="0" width="${w - infoX - 30}" height="190" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
            <text x="15" y="25" fill="#38bdf8" font-size="13" font-weight="bold">Overlapping Subtraction:</text>
            <text x="15" y="50" fill="#38bdf8" font-size="11">1. Full square: a² = ${a*a}</text>
            <text x="15" y="75" fill="#f87171" font-size="11">2. Subtract 2 strips: -2ab = -${2*a*b}</text>
            <text x="15" y="100" fill="#c084fc" font-size="11">3. Corner b² double-subtracted: +b² = +${b*b}</text>
            <line x1="15" y1="115" x2="${w - infoX - 45}" y2="115" stroke="#475569"/>
            <text x="15" y="140" fill="#ffffff" font-size="13" font-weight="bold">Net: ${(a-b)*(a-b)}</text>
            <text x="15" y="165" fill="#10b981" font-size="12">≡ (${a} - ${b})²</text>
          </g>
        `;

        readout.innerHTML = `a = ${a} | b = ${b} | a² = ${a*a} | -2ab = -${2*a*b} | +b² = +${b*b} | RESULT: ${(a-b)*(a-b)} = (${a-b})²`;
        verdict.innerHTML = `<strong>Inclusion-Exclusion Principle:</strong> In $(a - b)^2$, subtracting two strips of area $ab$ removes the corner $b^2$ twice. Adding back $b^2$ perfectly restores the balance!`;
      }

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  },

  // -----------------------------------------------------------------------
  // LAB 2: TRINOMIAL MATCHER & PERFECT SQUARE INSPECTOR (pp. 73–75)
  // -----------------------------------------------------------------------
  c2: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🔍 Perfect Square Trinomial Inspector</div>
            <div style="font-size:13px;color:#94a3b8;">Condition: Middle Term B = 2√(A·C) ⟹ Ax² + Bxy + Cy² = (√A x + √C y)²</div>
          </div>
          <div id="c2-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c2-p1" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">9x² + 24xy + 16y² (Ex 4.2)</button>
            <button class="lab-btn" id="c2-p2" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">4s² + 20st + 25t²</button>
            <button class="lab-btn" id="c2-p3" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">49x² + 28xy + 4y²</button>
            <button class="lab-btn" id="c2-p4" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">36x² + 12x + 1</button>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c2;
      function setTrinomial(A, B, C, name) {
        s.A = A; s.B = B; s.C = C;
        ['p1', 'p2', 'p3', 'p4'].forEach(function(k) {
          var b = document.getElementById('c2-' + k);
          if (b) b.style.background = (k === name) ? '#0284c7' : '#334155';
        });
        window.SIM_ENGINES.c2.update();
      }

      document.getElementById('c2-p1').onclick = function() { setTrinomial(9, 24, 16, 'p1'); };
      document.getElementById('c2-p2').onclick = function() { setTrinomial(4, 20, 25, 'p2'); };
      document.getElementById('c2-p3').onclick = function() { setTrinomial(49, 28, 4, 'p3'); };
      document.getElementById('c2-p4').onclick = function() { setTrinomial(36, 12, 1, 'p4'); };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c2;
      var box = document.getElementById('c2-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 220;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      var A = s.A, B = s.B, C = s.C;
      var sqrtA = Math.sqrt(A);
      var sqrtC = Math.sqrt(C);
      var reqB = 2 * sqrtA * sqrtC;
      var isPerfect = (Math.abs(B - reqB) < 1e-6);

      svg += `
        <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Expression: ${A}x² + ${B}xy + ${C}y²</text>
        
        <g transform="translate(${w/2 - 180}, 60)">
          <rect x="0" y="0" width="360" height="120" rx="8" fill="#0f172a" stroke="${isPerfect ? '#10b981' : '#ef4444'}" stroke-width="2"/>
          <text x="180" y="30" fill="#38bdf8" font-size="12" text-anchor="middle">Step 1: Check First Term ⟹ √(${A}x²) = ${sqrtA.toFixed(1)}x</text>
          <text x="180" y="55" fill="#f59e0b" font-size="12" text-anchor="middle">Step 2: Check Last Term ⟹ √(${C}y²) = ${sqrtC.toFixed(1)}y</text>
          <text x="180" y="80" fill="#e2e8f0" font-size="13" font-weight="bold" text-anchor="middle">Step 3: Test 2AB = 2(${sqrtA.toFixed(1)})(${sqrtC.toFixed(1)}) = ${reqB.toFixed(1)}xy</text>
          <text x="180" y="105" fill="${isPerfect ? '#10b981' : '#ef4444'}" font-size="14" font-weight="bold" text-anchor="middle">
            ${isPerfect ? `✓ Factored: (${sqrtA.toFixed(0)}x + ${sqrtC.toFixed(0)}y)²` : `✗ Not a perfect square`}
          </text>
        </g>
      `;

      readout.innerHTML = `TRINOMIAL: ${A}x² + ${B}xy + ${C}y² | √A = ${sqrtA} | √C = ${sqrtC} | 2√(AC) = ${reqB} | MATCH: ${isPerfect}`;
      verdict.innerHTML = isPerfect
        ? `<strong>Perfect Square Verified:</strong> The middle term $${B}xy$ matches $2(${sqrtA}x)(${sqrtC}y)$ exactly! Hence $${A}x^2 + ${B}xy + ${C}y^2 = (${sqrtA}x + ${sqrtC}y)^2$.`
        : `<strong>Not a perfect square:</strong> The middle term must equal ${reqB}xy.`;

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  },

  // -----------------------------------------------------------------------
  // LAB 3: ŚRĪDHARĀCĀRYA'S DIFFERENCE OF SQUARES (pp. 75–80)
  // -----------------------------------------------------------------------
  c3: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">✂ Śrīdharācārya's Difference of Squares (c. 750 CE)</div>
            <div style="font-size:13px;color:#94a3b8;">a² - b² = (a + b)(a - b) • Geometric Cut-and-Paste Rearrangement</div>
          </div>
          <div id="c3-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c3-btn-square" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">1. L-Shape (a² - b²)</button>
            <button class="lab-btn" id="c3-btn-rect" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">2. Rearrange to (a+b)×(a-b)</button>
            <button class="lab-btn" id="c3-btn-mental" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">104 × 96 = 100² - 16</button>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c3;
      document.getElementById('c3-btn-square').onclick = function() {
        s.shift = 0;
        document.getElementById('c3-btn-square').style.background = '#0284c7';
        document.getElementById('c3-btn-rect').style.background = '#334155';
        window.SIM_ENGINES.c3.update();
      };
      document.getElementById('c3-btn-rect').onclick = function() {
        s.shift = 1;
        document.getElementById('c3-btn-rect').style.background = '#0284c7';
        document.getElementById('c3-btn-square').style.background = '#334155';
        window.SIM_ENGINES.c3.update();
      };
      document.getElementById('c3-btn-mental').onclick = function() {
        s.a = 100; s.b = 4; s.shift = 1;
        document.getElementById('c3-btn-rect').style.background = '#0284c7';
        document.getElementById('c3-btn-square').style.background = '#334155';
        window.SIM_ENGINES.c3.update();
      };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c3;
      var box = document.getElementById('c3-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 230;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      var a = 140;
      var b = 50;
      var aMinusB = a - b;

      if (s.shift === 0) {
        // L-Shape state
        svg += `
          <text x="${w/2}" y="25" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Step 1: Square of side a with corner b² removed (Area = a² - b²)</text>
          <g transform="translate(${w/2 - 140}, 45)">
            <!-- Main rectangle (a - b) x a -->
            <rect x="0" y="0" width="${aMinusB}" height="${a}" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
            <text x="${aMinusB/2}" y="${a/2}" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">(a - b) × a</text>
            
            <!-- Side strip (a - b) x b -->
            <rect x="${aMinusB}" y="${b}" width="${b}" height="${aMinusB}" fill="#0d9488" stroke="#2dd4bf" stroke-width="2"/>
            <text x="${aMinusB + b/2}" y="${b + aMinusB/2}" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">b × (a-b)</text>

            <!-- Cutout b² -->
            <rect x="${aMinusB}" y="0" width="${b}" height="${b}" fill="#334155" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4"/>
            <text x="${aMinusB + b/2}" y="${b/2 + 4}" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">-b²</text>
          </g>
        `;
      } else {
        // Rearranged rectangle
        svg += `
          <text x="${w/2}" y="25" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Step 2: Śrīdharācārya Rearrangement ⟹ Rectangle of (a + b) × (a - b)</text>
          <g transform="translate(${w/2 - (a + b)/2}, 60)">
            <!-- First piece: (a - b) x a -->
            <rect x="0" y="0" width="${a}" height="${aMinusB}" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
            <text x="${a/2}" y="${aMinusB/2 + 5}" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">Length a</text>

            <!-- Second piece: rotated (a - b) x b placed next to it -->
            <rect x="${a}" y="0" width="${b}" height="${aMinusB}" fill="#0d9488" stroke="#2dd4bf" stroke-width="2"/>
            <text x="${a + b/2}" y="${aMinusB/2 + 5}" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">+ b</text>

            <!-- Dimensions -->
            <text x="${(a+b)/2}" y="${aMinusB + 22}" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Total Length = (a + b)</text>
            <text x="-25" y="${aMinusB/2 + 5}" fill="#2dd4bf" font-size="12" font-weight="bold" text-anchor="middle">(a - b)</text>
          </g>
        `;
      }

      readout.innerHTML = `a = ${s.a} | b = ${s.b} | a² = ${s.a*s.a} | b² = ${s.b*s.b} | a² - b² = ${s.a*s.a - s.b*s.b} | (a+b)(a-b) = ${(s.a+s.b)*(s.a-s.b)}`;
      verdict.innerHTML = `<strong>Śrīdharācārya (750 CE):</strong> The L-shaped region left after removing $b^2$ from $a^2$ rearranges without distortion into a single rectangle of dimensions $(a + b)$ by $(a - b)$, proving $a^2 - b^2 = (a + b)(a - b)$.`;

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  },

  // -----------------------------------------------------------------------
  // LAB 4: ALGEBRA TILES GRID & SAIRA'S RECTANGLE (pp. 80–84)
  // -----------------------------------------------------------------------
  c4: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🧱 Virtual Algebra Tiles Factorisation Board</div>
            <div style="font-size:13px;color:#94a3b8;">x² square • x rectangular strips • 1 unit squares ⟹ (x + a)(x + b)</div>
          </div>
          <div id="c4-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c4-p1" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Saira's Rectangle: x² + 8x + 15</button>
            <button class="lab-btn" id="c4-p2" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">x² + 7x + 12 = (x+3)(x+4)</button>
            <button class="lab-btn" id="c4-p3" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">x² + 5x + 6 = (x+2)(x+3)</button>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c4;
      function setTiles(a, b, pName) {
        s.a = a; s.b = b; s.preset = pName;
        ['p1', 'p2', 'p3'].forEach(function(k) {
          var btn = document.getElementById('c4-' + k);
          if (btn) btn.style.background = (k === pName) ? '#0284c7' : '#334155';
        });
        window.SIM_ENGINES.c4.update();
      }

      document.getElementById('c4-p1').onclick = function() { setTiles(5, 3, 'p1'); };
      document.getElementById('c4-p2').onclick = function() { setTiles(4, 3, 'p2'); };
      document.getElementById('c4-p3').onclick = function() { setTiles(3, 2, 'p3'); };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c4;
      var box = document.getElementById('c4-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 230;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      var a = s.a, b = s.b;
      var xSize = 85;
      var unitSize = 14;

      var startX = w/2 - (xSize + a * unitSize) / 2;
      var startY = 35;

      svg += `
        <text x="${w/2}" y="22" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">Algebra Tiles: x² + ${a+b}x + ${a*b} ≡ (x + ${a})(x + ${b})</text>
        
        <!-- Large x² Tile -->
        <rect x="${startX}" y="${startY}" width="${xSize}" height="${xSize}" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <text x="${startX + xSize/2}" y="${startY + xSize/2 + 5}" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">x²</text>

        <!-- Top x-strips (a strips) -->
        <g transform="translate(${startX + xSize}, ${startY})">
      `;

      for (var i = 0; i < a; i++) {
        svg += `
          <rect x="${i * unitSize}" y="0" width="${unitSize}" height="${xSize}" fill="#0d9488" stroke="#2dd4bf" stroke-width="1"/>
        `;
      }
      svg += `
        </g>
        <text x="${startX + xSize + (a*unitSize)/2}" y="${startY - 6}" fill="#2dd4bf" font-size="11" font-weight="bold" text-anchor="middle">${a}x strips</text>

        <!-- Bottom x-strips (b strips) -->
        <g transform="translate(${startX}, ${startY + xSize})">
      `;
      for (var j = 0; j < b; j++) {
        svg += `
          <rect x="0" y="${j * unitSize}" width="${xSize}" height="${unitSize}" fill="#0d9488" stroke="#2dd4bf" stroke-width="1"/>
        `;
      }
      svg += `
        </g>
        <text x="${startX - 25}" y="${startY + xSize + (b*unitSize)/2 + 4}" fill="#2dd4bf" font-size="11" font-weight="bold" text-anchor="middle">${b}x</text>

        <!-- Corner unit squares: a x b -->
        <g transform="translate(${startX + xSize}, ${startY + xSize})">
      `;
      for (var r = 0; r < b; r++) {
        for (var c = 0; c < a; c++) {
          svg += `<rect x="${c * unitSize}" y="${r * unitSize}" width="${unitSize}" height="${unitSize}" fill="#eab308" stroke="#ca8a04" stroke-width="0.8"/>`;
        }
      }
      svg += `</g>`;

      svg += `
        <text x="${w/2}" y="${startY + xSize + b*unitSize + 22}" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">Total Dimensions: Length = (x + ${a}), Breadth = (x + ${b})</text>
      `;

      readout.innerHTML = `TILES: 1 of x² | ${a+b} of x strips | ${a*b} unit squares | AREA: x² + ${a+b}x + ${a*b} | FACTORS: (x + ${a})(x + ${b})`;
      verdict.innerHTML = `<strong>Saira's Geometric Puzzle Solved:</strong> Factorising a quadratic trinomial is geometrically equivalent to arranging algebra tiles into a continuous, complete rectangle without gaps or overlaps.`;

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  },

  // -----------------------------------------------------------------------
  // LAB 5: 3D ISOMETRIC CUBIC DISSECTION ((x+y)³) (pp. 84–87)
  // -----------------------------------------------------------------------
  c5: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🧊 3D Binomial Cube Dissection Workbench</div>
            <div style="font-size:13px;color:#94a3b8;">(x + y)³ = x³ + 3x²y + 3xy² + y³ • 8 Solid Geometric Sub-Prisms</div>
          </div>
          <div id="c5-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c5-btn-solid" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Solid (x + y)³</button>
            <button class="lab-btn" id="c5-btn-explode" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Explode 8 Blocks</button>
            <button class="lab-btn" id="c5-btn-cond" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">x+y+z=0 ⟹ x³+y³+z³=3xyz</button>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c5;
      document.getElementById('c5-btn-solid').onclick = function() {
        s.explode = 0;
        document.getElementById('c5-btn-solid').style.background = '#0284c7';
        document.getElementById('c5-btn-explode').style.background = '#334155';
        window.SIM_ENGINES.c5.update();
      };
      document.getElementById('c5-btn-explode').onclick = function() {
        s.explode = 1;
        document.getElementById('c5-btn-explode').style.background = '#0284c7';
        document.getElementById('c5-btn-solid').style.background = '#334155';
        window.SIM_ENGINES.c5.update();
      };
      document.getElementById('c5-btn-cond').onclick = function() {
        s.explode = 2;
        window.SIM_ENGINES.c5.update();
      };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c5;
      var box = document.getElementById('c5-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 230;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      if (s.explode === 2) {
        // Condition x+y+z = 0
        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Symmetric Theorem: If x + y + z = 0, then x³ + y³ + z³ = 3xyz</text>
          <g transform="translate(${w/2 - 180}, 60)">
            <rect x="0" y="0" width="360" height="130" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
            <text x="180" y="30" fill="#38bdf8" font-size="13" text-anchor="middle">Identity: x³+y³+z³-3xyz = (x+y+z)(x²+y²+z²-xy-yz-zx)</text>
            <text x="180" y="60" fill="#fbbf24" font-size="13" text-anchor="middle">Substitute (x + y + z) = 0 ⟹ RHS = 0</text>
            <text x="180" y="90" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">x³ + y³ + z³ = 3xyz</text>
            <text x="180" y="115" fill="#94a3b8" font-size="11" text-anchor="middle">Example: 28³ + (-15)³ + (-13)³ = 3(28)(-15)(-13) = 16,380</text>
          </g>
        `;
        readout.innerHTML = `COROLLARY: (x+y+z)=0 ⟹ x³+y³+z³ = 3xyz | NUMERICAL DEMO: 28³ + (-15)³ + (-13)³ = 16,380`;
        verdict.innerHTML = `<strong>Effortless Cubic Sums:</strong> When the sum of three terms is zero, you never need to compute large cubes; simply compute $3xyz$ directly!`;
      } else {
        // Isometric Cube Dissection
        var cx = w / 2 - 80;
        var cy = 150;
        var exp = s.explode ? 25 : 0;

        svg += `
          <text x="${w/2}" y="25" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">${s.explode ? 'Exploded View: 8 Solid Components' : 'Solid Isometric Cube (x + y)³'}</text>
          
          <!-- Isometric Box Layout -->
          <!-- x³ Base Cube -->
          <g transform="translate(${cx - exp}, ${cy})">
            <polygon points="0,0 50,-25 100,0 50,25" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
            <polygon points="0,0 50,25 50,75 0,50" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>
            <polygon points="50,25 100,0 100,50 50,75" fill="#075985" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="50" y="45" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">x³</text>
          </g>
        `;

        var infoX = w / 2 + 50;
        svg += `
          <g transform="translate(${infoX}, 50)">
            <rect x="0" y="0" width="${w - infoX - 30}" height="150" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
            <text x="15" y="25" fill="#38bdf8" font-size="13" font-weight="bold">8 Solid Sub-Prisms:</text>
            <text x="15" y="50" fill="#38bdf8" font-size="11">• 1 cube of x³ (large core)</text>
            <text x="15" y="75" fill="#2dd4bf" font-size="11">• 3 slabs of x²y (flat plates)</text>
            <text x="15" y="100" fill="#fbbf24" font-size="11">• 3 columns of xy² (tall prisms)</text>
            <text x="15" y="125" fill="#f43f5e" font-size="11">• 1 cube of y³ (corner block)</text>
          </g>
        `;

        readout.innerHTML = `VOLUME: (x + y)³ | DECOMPOSITION: 1·x³ + 3·x²y + 3·xy² + 1·y³ = 8 solid pieces`;
        verdict.innerHTML = `<strong>Isometric 3D Dissection:</strong> Just as $(x+y)^2$ splits into 4 2D areas, $(x+y)^3$ decomposes into exactly $2^3 = 8$ solid 3D volumes!`;
      }

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  },

  // -----------------------------------------------------------------------
  // LAB 6: RATIONAL EXPRESSION SIMPLIFIER & DIVISIBILITY (pp. 87–91)
  // -----------------------------------------------------------------------
  c6: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">⚡ Rational Expression Canceller &amp; Divisibility Inspector</div>
            <div style="font-size:13px;color:#94a3b8;">Cancelling Common Binomial Factors • n³ - n Consecutive Integers Divisibility</div>
          </div>
          <div id="c6-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c6-btn-q1" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">(4x² + 4x + 1) / (4x² - 1)</button>
            <button class="lab-btn" id="c6-btn-q2" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">(p⁴ - 16) / (p² - 4)</button>
            <button class="lab-btn" id="c6-btn-div6" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">n³ - n Divisible by 6 Proof</button>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c6;
      function setFrac(p) {
        s.preset = p;
        ['q1', 'q2', 'div6'].forEach(function(k) {
          var btn = document.getElementById('c6-btn-' + k);
          if (btn) btn.style.background = (k === p) ? '#0284c7' : '#334155';
        });
        window.SIM_ENGINES.c6.update();
      }

      document.getElementById('c6-btn-q1').onclick = function() { setFrac('q1'); };
      document.getElementById('c6-btn-q2').onclick = function() { setFrac('q2'); };
      document.getElementById('c6-btn-div6').onclick = function() { setFrac('div6'); };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c6;
      var box = document.getElementById('c6-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 230;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      if (s.preset === 'q1') {
        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Simplification: (4x² + 4x + 1) / (4x² - 1)</text>
          <g transform="translate(${w/2 - 180}, 55)">
            <rect x="0" y="0" width="360" height="130" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
            <text x="180" y="30" fill="#38bdf8" font-size="13" text-anchor="middle">Numerator: 4x² + 4x + 1 = (2x + 1)(2x + 1)</text>
            <text x="180" y="55" fill="#f59e0b" font-size="13" text-anchor="middle">Denominator: 4x² - 1 = (2x + 1)(2x - 1)</text>
            <line x1="30" y1="70" x2="330" y2="70" stroke="#475569"/>
            <text x="180" y="95" fill="#ef4444" font-size="12" text-anchor="middle">Cancel Common Factor (2x + 1)</text>
            <text x="180" y="118" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">= (2x + 1) / (2x - 1)</text>
          </g>
        `;
        readout.innerHTML = `FRACTION: (4x²+4x+1)/(4x²-1) | COMMON FACTOR: (2x+1) | REDUCED: (2x+1)/(2x-1) (x ≠ ±1/2)`;
        verdict.innerHTML = `<strong>Factor Cancellation:</strong> Factoring polynomials using perfect squares and difference of squares enables complete algebraic reduction to lowest terms.`;
      }
      else if (s.preset === 'q2') {
        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Simplification: (p⁴ - 16) / (p² - 4)</text>
          <g transform="translate(${w/2 - 180}, 55)">
            <rect x="0" y="0" width="360" height="130" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
            <text x="180" y="30" fill="#38bdf8" font-size="13" text-anchor="middle">Numerator: (p²)² - 4² = (p² - 4)(p² + 4)</text>
            <text x="180" y="55" fill="#f59e0b" font-size="13" text-anchor="middle">Denominator: (p² - 4)</text>
            <line x1="30" y1="70" x2="330" y2="70" stroke="#475569"/>
            <text x="180" y="95" fill="#ef4444" font-size="12" text-anchor="middle">Cancel Non-Zero Factor (p² - 4)</text>
            <text x="180" y="118" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">= p² + 4</text>
          </g>
        `;
        readout.innerHTML = `FRACTION: (p⁴-16)/(p²-4) | FACTOR: (p²-4) | REDUCED: p² + 4 (p ≠ ±2)`;
        verdict.innerHTML = `<strong>Nested Difference of Squares:</strong> $p^4 - 16 = (p^2 - 4)(p^2 + 4)$. Cancelling the common factor leaves a clean quadratic $p^2 + 4$.`;
      }
      else {
        // n³ - n Divisibility
        var n = 5;
        svg += `
          <text x="${w/2}" y="30" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Proof: n³ - n is Always Divisible by 6 for Any Natural Number n</text>
          <g transform="translate(${w/2 - 180}, 55)">
            <rect x="0" y="0" width="360" height="130" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
            <text x="180" y="30" fill="#38bdf8" font-size="13" text-anchor="middle">Factor: n³ - n = n(n² - 1) = (n - 1) · n · (n + 1)</text>
            <text x="180" y="55" fill="#fbbf24" font-size="12" text-anchor="middle">3 Consecutive Integers: At least one is even (divisible by 2)</text>
            <text x="180" y="80" fill="#2dd4bf" font-size="12" text-anchor="middle">Exactly one is a multiple of 3</text>
            <text x="180" y="110" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">⟹ Divisible by 2 × 3 = 6! (e.g. 4 × 5 × 6 = 120)</text>
          </g>
        `;
        readout.innerHTML = `EXPRESSION: n³ - n = (n-1)n(n+1) | SAMPLE n=5: 4 × 5 × 6 = 120 | 120 ÷ 6 = 20 | DIVISIBLE: YES`;
        verdict.innerHTML = `<strong>Number Theoretic Truth:</strong> The product of three consecutive integers always contains both 2 and 3 as factors. Since $\\gcd(2, 3) = 1$, $n^3 - n$ is unconditionally divisible by 6!`;
      }

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  }
};
