
// =========================================================================
// IEMH105: ROUND AND ROUND (CIRCLES)
// Interactive Geometric Manipulatives & Laboratory Engines
// =========================================================================

window.SIM_STATE = {
  currentConcept: 'c1',
  isPlaying: false,
  timer: null,
  scrubberVal: 0,
  speed: 1,
  // Concept-specific states
  c1: { mode: 'circum', triType: 'acute' },
  c2: { chordL: 140, angle: 70 },
  c3: { r: 130, d: 50 },
  c4: { mode: 'parallel', r: 130, l1: 240, l2: 100 },
  c5: { centralAngle: 120, pAngle: 50, isDiameter: false },
  c6: { aAngle: 40, bAngle: 110, cAngle: 210, dAngle: 300 }
};

window.SIM_ENGINES = {

  // -----------------------------------------------------------------------
  // LAB 1: CIRCLE SYMMETRIES & CIRCUMCIRCLE EXPLORER (pp. 92–98)
  // -----------------------------------------------------------------------
  c1: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">⭕ Circumcircle &amp; Circle Symmetries Explorer</div>
            <div style="font-size:13px;color:#94a3b8;">Unique Circle Through 3 Points • Acute vs Right vs Obtuse Circumcentre</div>
          </div>
          <div id="c1-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn active" id="c1-btn-acute" aria-pressed="true" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Acute Δ (Centre Inside)</button>
            <button class="lab-btn" id="c1-btn-right" aria-pressed="false" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Right Δ (Centre on Hypotenuse)</button>
            <button class="lab-btn" id="c1-btn-obtuse" aria-pressed="false" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Obtuse Δ (Centre Outside)</button>
            <button class="lab-btn" id="c1-btn-reset" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">↺ Reset</button>
          </div>

          <div style="margin-top:12px;background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
            <label style="font-size:11px;color:#94a3b8;display:block;">Triangle Scale: <b id="c1-scale-val" style="color:#38bdf8;">100%</b></label>
            <input type="range" id="c1-slider-scale" min="50" max="150" value="100" step="5" aria-label="Triangle scale factor" style="width:100%;">
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c1;
      s.scale = 100;
      function setTri(t) {
        s.triType = t;
        ['acute', 'right', 'obtuse'].forEach(function(k) {
          var b = document.getElementById('c1-btn-' + k);
          if (b) {
            b.style.background = (k === t) ? '#0284c7' : '#334155';
            b.classList.toggle('active', k === t);
            b.setAttribute('aria-pressed', k === t ? 'true' : 'false');
          }
        });
        window.SIM_ENGINES.c1.update();
      }

      var scaleSlider = document.getElementById('c1-slider-scale');
      if (scaleSlider) {
        scaleSlider.oninput = function() {
          s.scale = parseInt(scaleSlider.value, 10);
          var sv = document.getElementById('c1-scale-val');
          if (sv) sv.innerText = s.scale + '%';
          window.SIM_ENGINES.c1.update();
        };
      }

      document.getElementById('c1-btn-acute').onclick = function() { setTri('acute'); };
      document.getElementById('c1-btn-right').onclick = function() { setTri('right'); };
      document.getElementById('c1-btn-obtuse').onclick = function() { setTri('obtuse'); };
      document.getElementById('c1-btn-reset').onclick = function() {
        setTri('acute');
        s.scale = 100;
        if (scaleSlider) scaleSlider.value = 100;
        var sv = document.getElementById('c1-scale-val');
        if (sv) sv.innerText = '100%';
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

      var cx = w / 2 - 40;
      var cy = 125;
      var R = 85;

      // Circle
      svg += `
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="4" fill="#f59e0b"/>
        <text x="${cx + 8}" y="${cy - 8}" fill="#f59e0b" font-size="11" font-weight="bold">O (Centre)</text>
      `;

      var ax, ay, bx, by, cxP, cyP;
      var locText = "";

      if (s.triType === 'acute') {
        // Acute triangle: all angles < 90°
        ax = cx + R * Math.cos(-2.4); ay = cy + R * Math.sin(-2.4);
        bx = cx + R * Math.cos(2.4);  by = cy + R * Math.sin(2.4);
        cxP = cx + R * Math.cos(0.2); cyP = cy + R * Math.sin(0.2);
        locText = "INSIDE the triangle";
      } else if (s.triType === 'right') {
        // Right triangle: AB is diameter
        ax = cx - R; ay = cy;
        bx = cx + R; by = cy;
        cxP = cx + R * Math.cos(-1.1); cyP = cy + R * Math.sin(-1.1);
        locText = "ON the hypotenuse (midpoint of AB)";
      } else {
        // Obtuse triangle: one angle > 90°
        ax = cx + R * Math.cos(-0.8); ay = cy + R * Math.sin(-0.8);
        bx = cx + R * Math.cos(0.8);  by = cy + R * Math.sin(0.8);
        cxP = cx + R * Math.cos(0.1); cyP = cy + R * Math.sin(0.1);
        locText = "OUTSIDE the triangle";
      }

      // Draw Triangle
      svg += `
        <polygon points="${ax},${ay} ${bx},${by} ${cxP},${cyP}" fill="#0284c7" fill-opacity="0.25" stroke="#ffffff" stroke-width="2"/>
        <circle cx="${ax}" cy="${ay}" r="4" fill="#38bdf8"/><text x="${ax - 12}" y="${ay}" fill="#fff" font-size="11" font-weight="bold">A</text>
        <circle cx="${bx}" cy="${by}" r="4" fill="#38bdf8"/><text x="${bx + 8}" y="${by}" fill="#fff" font-size="11" font-weight="bold">B</text>
        <circle cx="${cxP}" cy="${cyP}" r="4" fill="#38bdf8"/><text x="${cxP}" y="${cyP + 16}" fill="#fff" font-size="11" font-weight="bold">C</text>
      `;

      // Legend box
      var infoX = cx + R + 35;
      svg += `
        <g transform="translate(${infoX}, 45)">
          <rect x="0" y="0" width="${w - infoX - 25}" height="140" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <text x="12" y="25" fill="#38bdf8" font-size="12" font-weight="bold">Circumcentre Location:</text>
          <text x="12" y="55" fill="#ffffff" font-size="13" font-weight="bold">${s.triType.toUpperCase()} Δ</text>
          <text x="12" y="80" fill="#10b981" font-size="12">Centre O lies:</text>
          <text x="12" y="105" fill="#fbbf24" font-size="12" font-weight="bold">${locText}</text>
          <text x="12" y="125" fill="#94a3b8" font-size="10">Radius OA = OB = OC = R</text>
        </g>
      `;

      readout.innerHTML = `TRIANGLE: ${s.triType.toUpperCase()} | CIRCUMRADIUS: ${R}px | CIRCUMCENTRE: ${locText}`;
      verdict.innerHTML = `<strong>Unique Circumcircle Theorem:</strong> Exactly ONE unique circle passes through any three non-collinear points. The circumcentre lies inside for acute triangles, on the hypotenuse for right triangles, and outside for obtuse triangles.`;

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  },

  // -----------------------------------------------------------------------
  // LAB 2: CHORDS & CENTRAL ANGLE COMPARATOR (pp. 98–100)
  // -----------------------------------------------------------------------
  c2: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">📏 Chords &amp; Central Angle Subtended Workbench</div>
            <div style="font-size:13px;color:#94a3b8;">Theorem 1 &amp; 2: Equal Chords ⟺ Equal Central Angles (SSS / SAS Congruence)</div>
          </div>
          <div id="c2-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Central Angle θ: <b id="c2-angle-val" style="color:#38bdf8;">70°</b></label>
              <input type="range" id="c2-slider-angle" min="30" max="150" value="70" step="5" style="width:100%;">
            </div>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c2;
      var aSlider = document.getElementById('c2-slider-angle');
      aSlider.oninput = function() {
        s.angle = parseInt(aSlider.value);
        document.getElementById('c2-angle-val').innerText = s.angle + '°';
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

      var cx = w / 2 - 40;
      var cy = 120;
      var R = 85;
      var rad = (s.angle * Math.PI) / 180;

      // Chord 1 (AB)
      var a1 = -rad / 2;
      var a2 = rad / 2;
      var ax = cx + R * Math.cos(a1), ay = cy + R * Math.sin(a1);
      var bx = cx + R * Math.cos(a2), by = cy + R * Math.sin(a2);
      var chordLen = 2 * R * Math.sin(rad / 2);

      // Chord 2 (CD) rotated by 180°
      var c1 = Math.PI - rad / 2;
      var c2 = Math.PI + rad / 2;
      var cxP = cx + R * Math.cos(c1), cyP = cy + R * Math.sin(c1);
      var dx = cx + R * Math.cos(c2), dy = cy + R * Math.sin(c2);

      svg += `
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#64748b" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="4" fill="#f59e0b"/>
        <text x="${cx - 10}" y="${cy - 8}" fill="#f59e0b" font-size="11" font-weight="bold">O</text>

        <!-- Sector / Chord 1: AB -->
        <polygon points="${cx},${cy} ${ax},${ay} ${bx},${by}" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7" stroke-width="1.5"/>
        <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#38bdf8" stroke-width="3"/>
        <text x="${(ax+bx)/2 + 10}" y="${(ay+by)/2}" fill="#38bdf8" font-size="11" font-weight="bold">AB</text>

        <!-- Sector / Chord 2: CD -->
        <polygon points="${cx},${cy} ${cxP},${cyP} ${dx},${dy}" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="1.5"/>
        <line x1="${cxP}" y1="${cyP}" x2="${dx}" y2="${dy}" stroke="#34d399" stroke-width="3"/>
        <text x="${(cxP+dx)/2 - 25}" y="${(cyP+dy)/2}" fill="#34d399" font-size="11" font-weight="bold">CD</text>
      `;

      var infoX = cx + R + 35;
      svg += `
        <g transform="translate(${infoX}, 45)">
          <rect x="0" y="0" width="${w - infoX - 25}" height="140" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <text x="12" y="25" fill="#38bdf8" font-size="12" font-weight="bold">Equal Subtended Angles:</text>
          <text x="12" y="55" fill="#ffffff" font-size="12">• ∠AOB = ${s.angle}°</text>
          <text x="12" y="78" fill="#ffffff" font-size="12">• ∠COD = ${s.angle}°</text>
          <line x1="12" y1="90" x2="${w - infoX - 40}" y2="90" stroke="#475569"/>
          <text x="12" y="112" fill="#10b981" font-size="12" font-weight="bold">AB = CD = ${chordLen.toFixed(1)} px</text>
          <text x="12" y="130" fill="#94a3b8" font-size="10">SSS Congruence: ΔOAB ≅ ΔOCD</text>
        </g>
      `;

      readout.innerHTML = `CENTRAL ANGLE: ${s.angle}° | CHORD AB: ${chordLen.toFixed(1)}px | CHORD CD: ${chordLen.toFixed(1)}px | CONGRUENCE: SSS ⟹ AB = CD`;
      verdict.innerHTML = `<strong>Theorem 1 &amp; 2 (Equivalence):</strong> Equal chords subtend equal angles at the centre, and conversely chords subtending equal angles at the centre are strictly equal in length.`;

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  },

  // -----------------------------------------------------------------------
  // LAB 3: PERPENDICULAR BISECTOR & PYTHAGORAS TRIANGLE (pp. 100–102)
  // -----------------------------------------------------------------------
  c3: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">📐 Chord Perpendicular Bisector &amp; Pythagoras Triangle</div>
            <div style="font-size:13px;color:#94a3b8;">r² = d² + (L/2)² • Centre to Midpoint is Perpendicular (OM ⊥ AB)</div>
          </div>
          <div id="c3-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;">
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Radius r: <b id="c3-r-val" style="color:#38bdf8;">13 cm</b></label>
              <input type="range" id="c3-slider-r" min="10" max="18" value="13" step="1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Distance d: <b id="c3-d-val" style="color:#f59e0b;">5 cm</b></label>
              <input type="range" id="c3-slider-d" min="1" max="12" value="5" step="1" style="width:100%;">
            </div>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c3;
      var rSlider = document.getElementById('c3-slider-r');
      var dSlider = document.getElementById('c3-slider-d');

      rSlider.oninput = function() {
        s.r = parseInt(rSlider.value) * 10;
        document.getElementById('c3-r-val').innerText = (s.r / 10) + ' cm';
        if (s.d >= s.r) s.d = s.r - 10;
        dSlider.max = (s.r / 10 - 1).toString();
        window.SIM_ENGINES.c3.update();
      };
      dSlider.oninput = function() {
        s.d = parseInt(dSlider.value) * 10;
        document.getElementById('c3-d-val').innerText = (s.d / 10) + ' cm';
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

      var cx = w / 2 - 50;
      var cy = 120;
      var R = s.r * 0.65; // scale to fit
      var dPx = s.d * 0.65;

      var halfChordPx = Math.sqrt(Math.max(0, R*R - dPx*dPx));
      var halfChordCm = Math.sqrt(Math.max(0, (s.r/10)*(s.r/10) - (s.d/10)*(s.d/10)));
      var chordCm = 2 * halfChordCm;

      // Circle
      svg += `
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#64748b" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="4" fill="#f59e0b"/>
        <text x="${cx - 15}" y="${cy + 4}" fill="#f59e0b" font-size="11" font-weight="bold">O</text>

        <!-- Chord AB -->
        <line x1="${cx - halfChordPx}" y1="${cy + dPx}" x2="${cx + halfChordPx}" y2="${cy + dPx}" stroke="#38bdf8" stroke-width="3"/>
        <circle cx="${cx - halfChordPx}" cy="${cy + dPx}" r="3" fill="#38bdf8"/><text x="${cx - halfChordPx - 14}" y="${cy + dPx + 4}" fill="#fff" font-size="11">A</text>
        <circle cx="${cx + halfChordPx}" cy="${cy + dPx}" r="3" fill="#38bdf8"/><text x="${cx + halfChordPx + 6}" y="${cy + dPx + 4}" fill="#fff" font-size="11">B</text>

        <!-- Perpendicular OM -->
        <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + dPx}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>
        <circle cx="${cx}" cy="${cy + dPx}" r="3" fill="#f59e0b"/><text x="${cx + 6}" y="${cy + dPx + 14}" fill="#f59e0b" font-size="10">M</text>

        <!-- Right angle marker at M -->
        <rect x="${cx}" y="${cy + dPx - 8}" width="8" height="8" fill="none" stroke="#f59e0b" stroke-width="1.5"/>

        <!-- Radius OA (Hypotenuse) -->
        <line x1="${cx}" y1="${cy}" x2="${cx - halfChordPx}" y2="${cy + dPx}" stroke="#ec4899" stroke-width="2"/>
        <text x="${cx - halfChordPx/2 - 12}" y="${cy + dPx/2}" fill="#ec4899" font-size="11" font-weight="bold">r</text>
      `;

      var infoX = cx + R + 30;
      svg += `
        <g transform="translate(${infoX}, 40)">
          <rect x="0" y="0" width="${w - infoX - 20}" height="150" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <text x="12" y="25" fill="#38bdf8" font-size="12" font-weight="bold">Pythagoras in ΔOMA:</text>
          <text x="12" y="50" fill="#ec4899" font-size="11">• Radius r = ${(s.r/10)} cm</text>
          <text x="12" y="70" fill="#f59e0b" font-size="11">• Distance d = ${(s.d/10)} cm</text>
          <text x="12" y="90" fill="#38bdf8" font-size="11">• Half-chord AM = ${halfChordCm.toFixed(2)} cm</text>
          <line x1="12" y1="102" x2="${w - infoX - 35}" y2="102" stroke="#475569"/>
          <text x="12" y="122" fill="#10b981" font-size="12" font-weight="bold">Total Chord L = ${chordCm.toFixed(2)} cm</text>
          <text x="12" y="140" fill="#94a3b8" font-size="10">r² = d² + (L/2)²</text>
        </g>
      `;

      readout.innerHTML = `RADIUS: ${s.r/10} cm | DISTANCE: ${s.d/10} cm | HALF-CHORD: ${halfChordCm.toFixed(2)} cm | TOTAL CHORD LENGTH: ${chordCm.toFixed(2)} cm`;
      verdict.innerHTML = `<strong>Theorem 4 &amp; 5 Applied:</strong> The line from centre to chord midpoint is perpendicular ($OM \\perp AB$), creating right triangle $\\Delta OMA$ with $r^2 = d^2 + (L/2)^2$.`;

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  },

  // -----------------------------------------------------------------------
  // LAB 4: EQUIDISTANT CHORDS & DISTANCE VS LENGTH (pp. 102–106)
  // -----------------------------------------------------------------------
  c4: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">📏 Chord Distance vs Length Hierarchy Workbench</div>
            <div style="font-size:13px;color:#94a3b8;">Longer Chords are Strictly Closer to Centre • Parallel Chords Problem</div>
          </div>
          <div id="c4-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c4-btn-parallel" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Parallel Chords (10 cm &amp; 24 cm)</button>
            <button class="lab-btn" id="c4-btn-opp" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Opposite Sides (6 cm &amp; 8 cm, r=5)</button>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c4;
      document.getElementById('c4-btn-parallel').onclick = function() {
        s.mode = 'parallel';
        s.r = 130; s.l1 = 240; s.l2 = 100;
        document.getElementById('c4-btn-parallel').style.background = '#0284c7';
        document.getElementById('c4-btn-opp').style.background = '#334155';
        window.SIM_ENGINES.c4.update();
      };
      document.getElementById('c4-btn-opp').onclick = function() {
        s.mode = 'opposite';
        s.r = 100; s.l1 = 160; s.l2 = 120;
        document.getElementById('c4-btn-opp').style.background = '#0284c7';
        document.getElementById('c4-btn-parallel').style.background = '#334155';
        window.SIM_ENGINES.c4.update();
      };

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

      var cx = w / 2 - 50;
      var cy = 120;
      var R = 85;

      svg += `
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#64748b" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="4" fill="#f59e0b"/>
      `;

      if (s.mode === 'parallel') {
        // Parallel chords: 24cm (d=5) and 10cm (d=12), r=13
        var d1 = 5 * (R / 13);
        var d2 = 12 * (R / 13);
        var h1 = 12 * (R / 13);
        var h2 = 5 * (R / 13);

        svg += `
          <!-- Chord 1: 24 cm -->
          <line x1="${cx - h1}" y1="${cy + d1}" x2="${cx + h1}" y2="${cy + d1}" stroke="#10b981" stroke-width="2.5"/>
          <text x="${cx + h1 + 6}" y="${cy + d1 + 4}" fill="#10b981" font-size="10">24 cm (d=5)</text>

          <!-- Chord 2: 10 cm -->
          <line x1="${cx - h2}" y1="${cy + d2}" x2="${cx + h2}" y2="${cy + d2}" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="${cx + h2 + 6}" y="${cy + d2 + 4}" fill="#38bdf8" font-size="10">10 cm (d=12)</text>

          <!-- Gap indicator -->
          <line x1="${cx}" y1="${cy + d1}" x2="${cx}" y2="${cy + d2}" stroke="#ef4444" stroke-width="2"/>
          <text x="${cx - 16}" y="${cy + (d1+d2)/2 + 4}" fill="#ef4444" font-size="11" font-weight="bold">7 cm</text>
        `;

        readout.innerHTML = `CHORD 1: 24 cm (d₁ = 5 cm) | CHORD 2: 10 cm (d₂ = 12 cm) | GAP: d₂ - d₁ = 7 cm | RADIUS: r = 13 cm`;
        verdict.innerHTML = `<strong>EOC Q18 Solved:</strong> Longer chord (24 cm) is closer ($d=5$ cm) than shorter chord (10 cm, $d=12$ cm). Both satisfy $r^2 = d^2 + (L/2)^2 = 5^2 + 12^2 = 169 \\implies r = 13$ cm.`;
      } else {
        // Opposite sides: 8cm (d=3) and 6cm (d=4), r=5
        var dA = 3 * (R / 5);
        var dB = 4 * (R / 5);
        var hA = 4 * (R / 5);
        var hB = 3 * (R / 5);

        svg += `
          <!-- Top Chord: 8 cm -->
          <line x1="${cx - hA}" y1="${cy - dA}" x2="${cx + hA}" y2="${cy - dA}" stroke="#10b981" stroke-width="2.5"/>
          <text x="${cx + hA + 6}" y="${cy - dA + 4}" fill="#10b981" font-size="10">8 cm (d=3)</text>

          <!-- Bottom Chord: 6 cm -->
          <line x1="${cx - hB}" y1="${cy + dB}" x2="${cx + hB}" y2="${cy + dB}" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="${cx + hB + 6}" y="${cy + dB + 4}" fill="#38bdf8" font-size="10">6 cm (d=4)</text>

          <!-- Total distance line through centre -->
          <line x1="${cx}" y1="${cy - dA}" x2="${cx}" y2="${cy + dB}" stroke="#fbbf24" stroke-width="2"/>
          <text x="${cx + 8}" y="${cy}" fill="#fbbf24" font-size="11" font-weight="bold">Dist = 7 cm</text>
        `;

        readout.innerHTML = `OPPOSITE CHORDS: 8 cm (d=3) & 6 cm (d=4) | TOTAL SEPARATION: 3 + 4 = 7 cm | RADIUS: 5 cm`;
        verdict.innerHTML = `<strong>Exercise 5.3 Q3 Solved:</strong> Because the chords are on opposite sides of the centre, the line joining their midpoints passes through $O$, so total separation is $d_1 + d_2 = 3 + 4 = 7$ cm.`;
      }

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  },

  // -----------------------------------------------------------------------
  // LAB 5: INSCRIBED ANGLE THEOREM & SEMICIRCLE (pp. 106–111)
  // -----------------------------------------------------------------------
  c5: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">📐 Inscribed Angle Theorem &amp; Semicircle Right Angle</div>
            <div style="font-size:13px;color:#94a3b8;">Theorem 8: ∠AOB = 2∠APB • Thales Theorem: Angle in Semicircle = 90°</div>
          </div>
          <div id="c5-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c5-btn-general" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">General Arc (∠AOB = 2∠APB)</button>
            <button class="lab-btn" id="c5-btn-semi" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Thales Semicircle (90°)</button>
          </div>

          <div style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Central Angle ∠AOB: <b id="c5-angle-val" style="color:#38bdf8;">120°</b></label>
              <input type="range" id="c5-slider-angle" min="40" max="170" value="120" step="5" style="width:100%;">
            </div>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c5;
      var aSlider = document.getElementById('c5-slider-angle');

      document.getElementById('c5-btn-general').onclick = function() {
        s.isDiameter = false;
        aSlider.disabled = false;
        document.getElementById('c5-btn-general').style.background = '#0284c7';
        document.getElementById('c5-btn-semi').style.background = '#334155';
        window.SIM_ENGINES.c5.update();
      };
      document.getElementById('c5-btn-semi').onclick = function() {
        s.isDiameter = true;
        s.centralAngle = 180;
        aSlider.value = 180;
        aSlider.disabled = true;
        document.getElementById('c5-angle-val').innerText = '180° (Diameter)';
        document.getElementById('c5-btn-semi').style.background = '#0284c7';
        document.getElementById('c5-btn-general').style.background = '#334155';
        window.SIM_ENGINES.c5.update();
      };

      aSlider.oninput = function() {
        s.centralAngle = parseInt(aSlider.value);
        document.getElementById('c5-angle-val').innerText = s.centralAngle + '°';
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

      var cx = w / 2 - 40;
      var cy = 125;
      var R = 85;

      var cenDeg = s.isDiameter ? 180 : s.centralAngle;
      var insDeg = cenDeg / 2;

      var rad = (cenDeg * Math.PI) / 180;
      var ax = cx - R * Math.sin(rad/2);
      var ay = cy + R * Math.cos(rad/2);
      var bx = cx + R * Math.sin(rad/2);
      var by = cy + R * Math.cos(rad/2);

      // Point P on top circumference
      var px = cx;
      var py = cy - R;

      svg += `
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#64748b" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="4" fill="#f59e0b"/>
        <text x="${cx + 8}" y="${cy + 15}" fill="#f59e0b" font-size="11">O</text>

        <!-- Central Angle Lines OA, OB -->
        <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" stroke="#f59e0b" stroke-width="2"/>
        <line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="#f59e0b" stroke-width="2"/>

        <!-- Inscribed Angle Lines PA, PB -->
        <line x1="${px}" y1="${py}" x2="${ax}" y2="${ay}" stroke="#38bdf8" stroke-width="2"/>
        <line x1="${px}" y1="${py}" x2="${bx}" y2="${by}" stroke="#38bdf8" stroke-width="2"/>

        <!-- Vertex Points -->
        <circle cx="${ax}" cy="${ay}" r="4" fill="#fff"/><text x="${ax - 14}" y="${ay + 4}" fill="#fff" font-size="11">A</text>
        <circle cx="${bx}" cy="${by}" r="4" fill="#fff"/><text x="${bx + 6}" y="${by + 4}" fill="#fff" font-size="11">B</text>
        <circle cx="${px}" cy="${py}" r="5" fill="#38bdf8"/><text x="${px}" y="${py - 8}" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">P</text>
      `;

      var infoX = cx + R + 35;
      svg += `
        <g transform="translate(${infoX}, 45)">
          <rect x="0" y="0" width="${w - infoX - 25}" height="140" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <text x="12" y="25" fill="#38bdf8" font-size="12" font-weight="bold">Angle Measurements:</text>
          <text x="12" y="55" fill="#f59e0b" font-size="13" font-weight="bold">Central ∠AOB = ${cenDeg}°</text>
          <text x="12" y="80" fill="#38bdf8" font-size="13" font-weight="bold">Inscribed ∠APB = ${insDeg.toFixed(1)}°</text>
          <line x1="12" y1="95" x2="${w - infoX - 40}" y2="95" stroke="#475569"/>
          <text x="12" y="118" fill="#10b981" font-size="12" font-weight="bold">Ratio: 2.000 × ∠APB</text>
          <text x="12" y="134" fill="#94a3b8" font-size="10">${s.isDiameter ? "Thales: 180° / 2 = 90°" : "Theorem 8 Verified"}</text>
        </g>
      `;

      readout.innerHTML = `CENTRAL ANGLE: ${cenDeg}° | INSCRIBED ANGLE: ${insDeg.toFixed(1)}° | RATIO: ${(cenDeg / insDeg).toFixed(3)} | THALES: ${s.isDiameter}`;
      verdict.innerHTML = s.isDiameter
        ? `<strong>Thales' Theorem:</strong> The central angle of a diameter is $180^\\circ$. Therefore, the angle subtended at the circumference is always $180^\\circ / 2 = 90^\\circ$ (a right angle)!`
        : `<strong>Theorem 8 Verified:</strong> The angle subtended by an arc at the centre is strictly twice the angle subtended at any point on the remaining part of the circle ($\\angle AOB = 2\\angle APB$).`;

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  },

  // -----------------------------------------------------------------------
  // LAB 6: CYCLIC QUADRILATERAL 180° LAW & EXTERIOR ANGLE (pp. 111–117)
  // -----------------------------------------------------------------------
  c6: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🔄 Cyclic Quadrilateral 180° Law &amp; Exterior Angle Engine</div>
            <div style="font-size:13px;color:#94a3b8;">Theorem 11: ∠A + ∠C = 180° • Theorem 12 • Exterior Angle = Interior Opposite</div>
          </div>
          <div id="c6-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            <button class="lab-btn" id="c6-btn-standard" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Standard Cyclic Quad (75° &amp; 105°)</button>
            <button class="lab-btn" id="c6-btn-rect" style="background:#334155;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Inscribed Rectangle (90° All)</button>
          </div>

          <div style="margin-top:12px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #38bdf8;font-family:monospace;font-size:12px;" id="lab-readout"></div>
          <div style="margin-top:8px;background:#0f172a;border-radius:8px;padding:10px;border-left:4px solid #10b981;font-size:13px;color:#e2e8f0;" id="lab-verdict"></div>
        </div>
      `;

      var s = window.SIM_STATE.c6;
      document.getElementById('c6-btn-standard').onclick = function() {
        s.aAngle = 40; s.bAngle = 110; s.cAngle = 210; s.dAngle = 300;
        document.getElementById('c6-btn-standard').style.background = '#0284c7';
        document.getElementById('c6-btn-rect').style.background = '#334155';
        window.SIM_ENGINES.c6.update();
      };
      document.getElementById('c6-btn-rect').onclick = function() {
        s.aAngle = 45; s.bAngle = 135; s.cAngle = 225; s.dAngle = 315;
        document.getElementById('c6-btn-rect').style.background = '#0284c7';
        document.getElementById('c6-btn-standard').style.background = '#334155';
        window.SIM_ENGINES.c6.update();
      };

      this.update();
    },

    update: function() {
      var s = window.SIM_STATE.c6;
      var box = document.getElementById('c6-svg-box');
      if (!box) return;

      var w = box.clientWidth || 560;
      var h = 240;
      var svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;display:block;">`;

      var readout = document.getElementById('lab-readout');
      var verdict = document.getElementById('lab-verdict');

      var cx = w / 2 - 50;
      var cy = 125;
      var R = 85;

      var pt = function(deg) {
        var r = (deg * Math.PI) / 180;
        return { x: cx + R * Math.cos(r), y: cy + R * Math.sin(r) };
      };

      var A = pt(s.aAngle);
      var B = pt(s.bAngle);
      var C = pt(s.cAngle);
      var D = pt(s.dAngle);

      // Exterior line extension of CD to E
      var ex = D.x + (D.x - C.x) * 0.4;
      var ey = D.y + (D.y - C.y) * 0.4;

      svg += `
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#64748b" stroke-width="2"/>
        
        <!-- Cyclic Quad Polygon -->
        <polygon points="${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2"/>

        <!-- Extension line for exterior angle -->
        <line x1="${C.x}" y1="${C.y}" x2="${ex}" y2="${ey}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>
        <circle cx="${ex}" cy="${ey}" r="3" fill="#f59e0b"/><text x="${ex + 6}" y="${ey}" fill="#f59e0b" font-size="10">E</text>

        <!-- Vertices -->
        <circle cx="${A.x}" cy="${A.y}" r="4" fill="#fff"/><text x="${A.x + 6}" y="${A.y}" fill="#fff" font-size="11" font-weight="bold">A</text>
        <circle cx="${B.x}" cy="${B.y}" r="4" fill="#fff"/><text x="${B.x}" y="${B.y + 14}" fill="#fff" font-size="11" font-weight="bold">B</text>
        <circle cx="${C.x}" cy="${C.y}" r="4" fill="#fff"/><text x="${C.x - 14}" y="${C.y}" fill="#fff" font-size="11" font-weight="bold">C</text>
        <circle cx="${D.x}" cy="${D.y}" r="4" fill="#fff"/><text x="${D.x}" y="${D.y - 8}" fill="#fff" font-size="11" font-weight="bold">D</text>
      `;

      var infoX = cx + R + 35;
      svg += `
        <g transform="translate(${infoX}, 40)">
          <rect x="0" y="0" width="${w - infoX - 25}" height="150" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <text x="12" y="25" fill="#38bdf8" font-size="12" font-weight="bold">Opposite Angles Law:</text>
          <text x="12" y="52" fill="#10b981" font-size="12" font-weight="bold">∠A + ∠C = 180° (Supp)</text>
          <text x="12" y="75" fill="#10b981" font-size="12" font-weight="bold">∠B + ∠D = 180° (Supp)</text>
          <line x1="12" y1="88" x2="${w - infoX - 40}" y2="88" stroke="#475569"/>
          <text x="12" y="110" fill="#f59e0b" font-size="12" font-weight="bold">Exterior Angle Property:</text>
          <text x="12" y="132" fill="#ffffff" font-size="12">∠ADE ≡ ∠ABC</text>
        </g>
      `;

      readout.innerHTML = `CYCLIC QUAD: ABCD | ∠A + ∠C = 180° | ∠B + ∠D = 180° | EXTERIOR ∠ADE = INTERIOR OPPOSITE ∠ABC`;
      verdict.innerHTML = `<strong>Theorems 11 &amp; 12:</strong> In any quadrilateral inscribed in a circle, opposite pairs of angles are supplementary (sum to $180^\\circ$), and extending any side produces an exterior angle identical to the interior opposite angle!`;

      svg += `</svg>`;
      box.innerHTML = svg;
    },
    render: function() { this.update(); }
  }
};
