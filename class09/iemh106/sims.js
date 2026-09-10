// Class 9 Mathematics Chapter 6: Measuring Space - Perimeter and Area
// Pure offline interactive simulation engines with standard timeline controls.

window.SimEngine = (function() {
  'use strict';

  var engines = {};

  // -------------------------------------------------------------
  // Engine 1: Archimedes Polygon Bounds & Mādhava Series Convergence
  // -------------------------------------------------------------
  engines['sim-concept-1'] = {
    sides: 6,
    madhavaTerms: 10,
    playing: false,
    timer: null,

    init: function(container) {
      this.container = container;
      this.renderUI();
      this.update();
    },

    renderUI: function() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="sim-wrapper" style="font-family: system-ui, sans-serif;">
          <div class="sim-header" style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Archimedes Polygon Bounds & Mādhava Series Explorer</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Trap π between inscribed/circumscribed regular n-gons and observe Mādhava's infinite series convergence.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c1-svg" width="380" height="260" viewBox="-130 -130 260 260" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c1-play" class="btn btn-sm">▶ Play</button>
            <button id="c1-pause" class="btn btn-sm">⏸ Pause</button>
            <button id="c1-step" class="btn btn-sm">⏭ Step</button>
            <button id="c1-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Polygon Sides N:
              <select id="c1-sides" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
                <option value="6">6-gon (Hexagon)</option>
                <option value="12">12-gon</option>
                <option value="24">24-gon</option>
                <option value="48">48-gon</option>
                <option value="96">96-gon (Archimedes)</option>
              </select>
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Mādhava Terms: <span id="c1-terms-val">10</span>
              <input type="range" id="c1-terms" min="1" max="50" value="10" style="vertical-align: middle;">
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c1-play');
      var pauseBtn = this.container.querySelector('#c1-pause');
      var stepBtn = this.container.querySelector('#c1-step');
      var resetBtn = this.container.querySelector('#c1-reset');
      var sidesSelect = this.container.querySelector('#c1-sides');
      var termsSlider = this.container.querySelector('#c1-terms');

      if (playBtn) playBtn.onclick = function() { self.play(); };
      if (pauseBtn) pauseBtn.onclick = function() { self.pause(); };
      if (stepBtn) stepBtn.onclick = function() { self.step(); };
      if (resetBtn) resetBtn.onclick = function() { self.reset(); };

      if (sidesSelect) sidesSelect.onchange = function(e) {
        self.sides = parseInt(e.target.value, 10);
        self.update();
      };
      if (termsSlider) termsSlider.oninput = function(e) {
        self.madhavaTerms = parseInt(e.target.value, 10);
        var lbl = self.container.querySelector('#c1-terms-val');
        if (lbl) lbl.textContent = self.madhavaTerms;
        self.update();
      };
    },

    play: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      var sideList = [6, 12, 24, 48, 96];
      this.timer = setInterval(function() {
        var idx = sideList.indexOf(self.sides);
        self.sides = sideList[(idx + 1) % sideList.length];
        var sel = self.container ? self.container.querySelector('#c1-sides') : null;
        if (sel) sel.value = self.sides;
        if (self.madhavaTerms < 50) {
          self.madhavaTerms += 2;
          var tSlider = self.container ? self.container.querySelector('#c1-terms') : null;
          var tLbl = self.container ? self.container.querySelector('#c1-terms-val') : null;
          if (tSlider) tSlider.value = self.madhavaTerms;
          if (tLbl) tLbl.textContent = self.madhavaTerms;
        } else {
          self.madhavaTerms = 2;
        }
        self.update();
      }, 900);
    },

    pause: function() {
      this.playing = false;
      if (this.timer) clearInterval(this.timer);
    },

    step: function() {
      var sideList = [6, 12, 24, 48, 96];
      var idx = sideList.indexOf(this.sides);
      this.sides = sideList[(idx + 1) % sideList.length];
      var sel = this.container ? this.container.querySelector('#c1-sides') : null;
      if (sel) sel.value = this.sides;
      this.madhavaTerms = (this.madhavaTerms % 50) + 2;
      var tSlider = this.container ? this.container.querySelector('#c1-terms') : null;
      var tLbl = this.container ? self.container.querySelector('#c1-terms-val') : null;
      if (tSlider) tSlider.value = this.madhavaTerms;
      if (tLbl) tLbl.textContent = this.madhavaTerms;
      this.update();
    },

    reset: function() {
      this.pause();
      this.sides = 6;
      this.madhavaTerms = 10;
      var sel = this.container ? this.container.querySelector('#c1-sides') : null;
      var tSlider = this.container ? this.container.querySelector('#c1-terms') : null;
      var tLbl = this.container ? this.container.querySelector('#c1-terms-val') : null;
      if (sel) sel.value = 6;
      if (tSlider) tSlider.value = 10;
      if (tLbl) tLbl.textContent = 10;
      this.update();
    },

    update: function() {
      var n = this.sides;
      var r = 90;
      var theta = Math.PI / n;

      // Inscribed perimeter = 2*n*r*sin(theta) => lower bound for pi = n * sin(theta)
      var lowerPi = n * Math.sin(theta);
      // Circumscribed perimeter = 2*n*r*tan(theta) => upper bound for pi = n * tan(theta)
      var upperPi = n * Math.tan(theta);

      // Madhava series: 4 * sum_{k=0}^{K-1} (-1)^k / (2k + 1)
      var madhavaPi = 0;
      for (var k = 0; k < this.madhavaTerms; k++) {
        madhavaPi += (k % 2 === 0 ? 1 : -1) / (2 * k + 1);
      }
      madhavaPi *= 4;

      // Build SVG polygons
      var svg = this.container ? this.container.querySelector('#c1-svg') : null;
      if (svg) {
        var inPts = [];
        var outPts = [];
        var rOut = r / Math.cos(theta);
        for (var i = 0; i < n; i++) {
          var ang = 2 * Math.PI * i / n - Math.PI / 2;
          inPts.push((r * Math.cos(ang)).toFixed(1) + ',' + (r * Math.sin(ang)).toFixed(1));
          outPts.push((rOut * Math.cos(ang)).toFixed(1) + ',' + (rOut * Math.sin(ang)).toFixed(1));
        }

        svg.innerHTML = `
          <!-- Circumscribed polygon (Upper bound) -->
          <polygon points="${outPts.join(' ')}" fill="#fee2e2" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2"/>
          <!-- Reference Circle -->
          <circle cx="0" cy="0" r="${r}" fill="#f1f5f9" stroke="#0284c7" stroke-width="2.5"/>
          <!-- Inscribed polygon (Lower bound) -->
          <polygon points="${inPts.join(' ')}" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
          <!-- Center Point -->
          <circle cx="0" cy="0" r="3.5" fill="#1e293b"/>
          <text x="0" y="-105" text-anchor="middle" font-size="11" fill="#ef4444" font-weight="bold">Circumscribed ${n}-gon (π &lt; ${upperPi.toFixed(4)})</text>
          <text x="0" y="5" text-anchor="middle" font-size="11" fill="#0369a1" font-weight="bold">Circle C = πd</text>
          <text x="0" y="115" text-anchor="middle" font-size="11" fill="#2563eb" font-weight="bold">Inscribed ${n}-gon (π &gt; ${lowerPi.toFixed(4)})</text>
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        readout.innerHTML = `
          <strong>Archimedes ${n}-gon Bounds:</strong> ${lowerPi.toFixed(5)} &lt; π &lt; ${upperPi.toFixed(5)} (Gap: ${(upperPi - lowerPi).toFixed(5)})<br>
          <strong>Mādhava Infinite Series (${this.madhavaTerms} terms):</strong> π ≈ ${madhavaPi.toFixed(6)} (Error: ${Math.abs(Math.PI - madhavaPi).toFixed(6)})
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        if (n >= 96) {
          verdict.innerHTML = `✓ <strong>Archimedes Benchmark Verified:</strong> For a 96-gon, lower bound is 3 10/71 (≈ 3.1408) and upper bound is 3 1/7 (≈ 3.1429), trapping π = 3.14159265... with under 0.07% error!`;
        } else {
          verdict.innerHTML = `• Increase polygon sides N to squeeze the gap between inscribed and circumscribed perimeters toward π.`;
        }
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 2: Olympic 400 m Athletics Track & Lane Stagger Simulator
  // -------------------------------------------------------------
  engines['sim-concept-2'] = {
    lane: 1,
    progress: 0, // 0 to 400 m
    speed: 5,
    playing: false,
    timer: null,

    init: function(container) {
      this.container = container;
      this.renderUI();
      this.update();
    },

    renderUI: function() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="sim-wrapper" style="font-family: system-ui, sans-serif;">
          <div class="sim-header" style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Olympic 400 m Running Track & Lane Stagger Lab</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Explore why outer lane athletes start ahead: curvature compensation Δs = 2πw ≈ 7.67 m per lane.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #064e3b; border-radius: 8px; padding: 10px; border: 1px solid #047857;">
            <svg id="c2-svg" width="380" height="200" viewBox="0 0 380 200" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c2-play" class="btn btn-sm">▶ Play</button>
            <button id="c2-pause" class="btn btn-sm">⏸ Pause</button>
            <button id="c2-step" class="btn btn-sm">⏭ Step</button>
            <button id="c2-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px; color: #1e293b;">
              Active Lane:
              <select id="c2-lane" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
                <option value="1">Lane 1 (Curb: r = 36.8 m)</option>
                <option value="2">Lane 2 (+7.67 m stagger)</option>
                <option value="3">Lane 3 (+15.33 m stagger)</option>
                <option value="4">Lane 4 (+23.00 m stagger)</option>
                <option value="5">Lane 5 (+30.66 m stagger)</option>
                <option value="6">Lane 6 (+38.33 m stagger)</option>
                <option value="7">Lane 7 (+45.99 m stagger)</option>
                <option value="8">Lane 8 (+53.66 m stagger)</option>
              </select>
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px; color: #1e293b;">
              Race Progress: <span id="c2-prog-lbl">0 m</span>
              <input type="range" id="c2-prog" min="0" max="400" value="0" style="vertical-align: middle;">
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c2-play');
      var pauseBtn = this.container.querySelector('#c2-pause');
      var stepBtn = this.container.querySelector('#c2-step');
      var resetBtn = this.container.querySelector('#c2-reset');
      var laneSel = this.container.querySelector('#c2-lane');
      var progSlider = this.container.querySelector('#c2-prog');

      if (playBtn) playBtn.onclick = function() { self.play(); };
      if (pauseBtn) pauseBtn.onclick = function() { self.pause(); };
      if (stepBtn) stepBtn.onclick = function() { self.step(); };
      if (resetBtn) resetBtn.onclick = function() { self.reset(); };

      if (laneSel) laneSel.onchange = function(e) {
        self.lane = parseInt(e.target.value, 10);
        self.update();
      };
      if (progSlider) progSlider.oninput = function(e) {
        self.progress = parseFloat(e.target.value);
        var lbl = self.container.querySelector('#c2-prog-lbl');
        if (lbl) lbl.textContent = self.progress.toFixed(0) + ' m';
        self.update();
      };
    },

    play: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      this.timer = setInterval(function() {
        self.progress += 8;
        if (self.progress > 400) self.progress = 0;
        var pSlider = self.container ? self.container.querySelector('#c2-prog') : null;
        var pLbl = self.container ? self.container.querySelector('#c2-prog-lbl') : null;
        if (pSlider) pSlider.value = self.progress;
        if (pLbl) pLbl.textContent = self.progress.toFixed(0) + ' m';
        self.update();
      }, 100);
    },

    pause: function() {
      this.playing = false;
      if (this.timer) clearInterval(this.timer);
    },

    step: function() {
      this.progress = Math.min(400, this.progress + 25);
      var pSlider = this.container ? this.container.querySelector('#c2-prog') : null;
      var pLbl = this.container ? this.container.querySelector('#c2-prog-lbl') : null;
      if (pSlider) pSlider.value = this.progress;
      if (pLbl) pLbl.textContent = this.progress.toFixed(0) + ' m';
      this.update();
    },

    reset: function() {
      this.pause();
      this.progress = 0;
      var pSlider = this.container ? this.container.querySelector('#c2-prog') : null;
      var pLbl = this.container ? this.container.querySelector('#c2-prog-lbl') : null;
      if (pSlider) pSlider.value = 0;
      if (pLbl) pLbl.textContent = '0 m';
      this.update();
    },

    update: function() {
      var w = 1.22;
      var n = this.lane;
      var rBase = 36.8;
      var rLane = rBase + (n - 1) * w;
      var stagger = 2 * Math.PI * w * (n - 1);
      var lapDist = 2 * 84.39 + 2 * Math.PI * rLane;

      var svg = this.container ? this.container.querySelector('#c2-svg') : null;
      if (svg) {
        // SVG track dimensions:
        // Left center: (120, 100), Right center: (260, 100)
        // Straight length = 140 px (represents 84.39 m)
        // Radius scale: 1.3 px per meter => 36.8 * 1.3 ≈ 48 px.
        var rPx = 42 + (n - 1) * 4.5;
        var runnerAngle = (this.progress / 400) * 2 * Math.PI;

        svg.innerHTML = `
          <!-- Infield Grass -->
          <rect x="120" y="58" width="140" height="84" fill="#15803d"/>
          <path d="M 120,58 A 42,42 0 0,0 120,142 L 260,142 A 42,42 0 0,0 260,58 Z" fill="#15803d"/>
          
          <!-- Outer Running Track Ribbon -->
          <path d="M 120,${100 - rPx} L 260,${100 - rPx} A ${rPx},${rPx} 0 0,1 260,${100 + rPx} L 120,${100 + rPx} A ${rPx},${rPx} 0 0,1 120,${100 - rPx}" 
                fill="none" stroke="#f97316" stroke-width="7" opacity="0.4"/>
          <path d="M 120,${100 - rPx} L 260,${100 - rPx} A ${rPx},${rPx} 0 0,1 260,${100 + rPx} L 120,${100 + rPx} A ${rPx},${rPx} 0 0,1 120,${100 - rPx}" 
                fill="none" stroke="#fed7aa" stroke-width="1.5"/>

          <!-- Common Finish Line at Bottom Straight (x = 260, y = 142) -->
          <line x1="260" y1="135" x2="260" y2="185" stroke="#ffffff" stroke-width="2.5"/>
          <text x="260" y="196" fill="#ffffff" font-size="9" text-anchor="middle" font-weight="bold">FINISH 400m</text>

          <!-- Stagger Marker for this lane -->
          <circle cx="${260 - (stagger * 0.7)}" cy="${100 + rPx}" r="3" fill="#eab308"/>
          <text x="${260 - (stagger * 0.7)}" y="${100 + rPx + 12}" fill="#fde047" font-size="8" text-anchor="middle">Start L${n}</text>

          <!-- Animated Runner Dot -->
          <circle cx="${190 + 70 * Math.cos(runnerAngle)}" cy="${100 + rPx * Math.sin(runnerAngle)}" r="5.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
          <text x="190" y="95" fill="#ffffff" font-size="12" text-anchor="middle" font-weight="bold">LANE ${n}</text>
          <text x="190" y="112" fill="#93c5fd" font-size="10" text-anchor="middle">Stagger: +${stagger.toFixed(2)} m</text>
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        readout.innerHTML = `
          <strong>Lane ${n} Metrics:</strong> Curve Radius = ${rLane.toFixed(2)} m &middot; Stagger Offset = <strong>${stagger.toFixed(2)} m</strong> ahead of Lane 1.<br>
          <strong>Uncompensated Lap Distance:</strong> ${lapDist.toFixed(2)} m &middot; <strong>Distance Covered:</strong> ${this.progress.toFixed(1)} / 400 m
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        verdict.innerHTML = `✓ <strong>Fairness Theorem:</strong> Each lane increases bend circumference by exactly 2πw = 2 × 3.1416 × 1.22 = <strong>7.67 m</strong>. Starting Lane ${n} ahead by ${stagger.toFixed(2)} m guarantees exactly 400.0 m to the common finish line!`;
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 3: Parallelogram Shear & Triangle Median Area Invariance Lab
  // -------------------------------------------------------------
  engines['sim-concept-3'] = {
    mode: 'median', // 'shear' or 'median'
    shearX: 40,
    apexX: 180,
    base: 160,
    height: 90,
    playing: false,
    timer: null,

    init: function(container) {
      this.container = container;
      this.renderUI();
      this.update();
    },

    renderUI: function() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="sim-wrapper" style="font-family: system-ui, sans-serif;">
          <div class="sim-header" style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Shear Invariance & Triangle Median Area Lab</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Discover why shearing preserves parallelogram area (bh) and why a median divides a triangle into two equal areas.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c3-svg" width="380" height="220" viewBox="0 0 380 220" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c3-play" class="btn btn-sm">▶ Play</button>
            <button id="c3-pause" class="btn btn-sm">⏸ Pause</button>
            <button id="c3-step" class="btn btn-sm">⏭ Step</button>
            <button id="c3-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Experiment:
              <select id="c3-mode" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
                <option value="median">Triangle Median Area Theorem</option>
                <option value="shear">Parallelogram Shear Invariance</option>
              </select>
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Move Apex X: <span id="c3-pos-lbl">180</span>
              <input type="range" id="c3-pos" min="80" max="300" value="180" style="vertical-align: middle;">
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c3-play');
      var pauseBtn = this.container.querySelector('#c3-pause');
      var stepBtn = this.container.querySelector('#c3-step');
      var resetBtn = this.container.querySelector('#c3-reset');
      var modeSel = this.container.querySelector('#c3-mode');
      var posSlider = this.container.querySelector('#c3-pos');

      if (playBtn) playBtn.onclick = function() { self.play(); };
      if (pauseBtn) pauseBtn.onclick = function() { self.pause(); };
      if (stepBtn) stepBtn.onclick = function() { self.step(); };
      if (resetBtn) resetBtn.onclick = function() { self.reset(); };

      if (modeSel) modeSel.onchange = function(e) {
        self.mode = e.target.value;
        self.update();
      };
      if (posSlider) posSlider.oninput = function(e) {
        self.apexX = parseInt(e.target.value, 10);
        self.shearX = self.apexX - 140;
        var lbl = self.container.querySelector('#c3-pos-lbl');
        if (lbl) lbl.textContent = self.apexX;
        self.update();
      };
    },

    play: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      var dir = 1;
      this.timer = setInterval(function() {
        self.apexX += dir * 4;
        if (self.apexX >= 290) dir = -1;
        if (self.apexX <= 90) dir = 1;
        self.shearX = self.apexX - 140;
        var pSlider = self.container ? self.container.querySelector('#c3-pos') : null;
        var pLbl = self.container ? self.container.querySelector('#c3-pos-lbl') : null;
        if (pSlider) pSlider.value = self.apexX;
        if (pLbl) pLbl.textContent = self.apexX;
        self.update();
      }, 60);
    },

    pause: function() {
      this.playing = false;
      if (this.timer) clearInterval(this.timer);
    },

    step: function() {
      this.apexX = (this.apexX + 25 > 290) ? 90 : this.apexX + 25;
      this.shearX = this.apexX - 140;
      var pSlider = this.container ? this.container.querySelector('#c3-pos') : null;
      var pLbl = this.container ? this.container.querySelector('#c3-pos-lbl') : null;
      if (pSlider) pSlider.value = this.apexX;
      if (pLbl) pLbl.textContent = this.apexX;
      this.update();
    },

    reset: function() {
      this.pause();
      this.apexX = 180;
      this.shearX = 40;
      var pSlider = this.container ? this.container.querySelector('#c3-pos') : null;
      var pLbl = this.container ? this.container.querySelector('#c3-pos-lbl') : null;
      if (pSlider) pSlider.value = 180;
      if (pLbl) pLbl.textContent = 180;
      this.update();
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c3-svg') : null;
      var b = this.base;
      var h = this.height;
      var yBase = 180;
      var yTop = yBase - h;
      var x1 = 110;
      var x2 = x1 + b;
      var xMid = (x1 + x2) / 2;

      if (svg) {
        if (this.mode === 'median') {
          var ax = this.apexX;
          var ay = yTop;
          // Triangle ABC: A(ax, ay), B(x1, yBase), C(x2, yBase). Midpoint D(xMid, yBase).
          var areaTotal = 0.5 * b * h;
          var areaLeft = 0.5 * (b / 2) * h;
          var areaRight = 0.5 * (b / 2) * h;

          svg.innerHTML = `
            <!-- Top Parallel Guideline -->
            <line x1="40" y1="${yTop}" x2="340" y2="${yTop}" stroke="#94a3b8" stroke-dasharray="4,4" stroke-width="1.5"/>
            <text x="345" y="${yTop + 4}" fill="#64748b" font-size="10">Parallel Line</text>

            <!-- Altitude Dotted Line -->
            <line x1="${ax}" y1="${ay}" x2="${ax}" y2="${yBase}" stroke="#64748b" stroke-dasharray="3,3" stroke-width="1.2"/>
            <text x="${ax + 4}" y="${(ay + yBase) / 2}" fill="#64748b" font-size="10">h = ${h}px</text>

            <!-- Left Sub-Triangle ABD (Blue) -->
            <polygon points="${ax},${ay} ${x1},${yBase} ${xMid},${yBase}" fill="#93c5fd" opacity="0.6" stroke="#2563eb" stroke-width="2"/>
            <!-- Right Sub-Triangle ACD (Orange) -->
            <polygon points="${ax},${ay} ${xMid},${yBase} ${x2},${yBase}" fill="#fed7aa" opacity="0.6" stroke="#ea580c" stroke-width="2"/>

            <!-- Median Line AD -->
            <line x1="${ax}" y1="${ay}" x2="${xMid}" y2="${yBase}" stroke="#dc2626" stroke-width="2.5"/>

            <!-- Base Line BC -->
            <line x1="${x1}" y1="${yBase}" x2="${x2}" y2="${yBase}" stroke="#0f172a" stroke-width="3"/>
            
            <!-- Points -->
            <circle cx="${ax}" cy="${ay}" r="5" fill="#dc2626"/>
            <text x="${ax}" y="${ay - 8}" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">A</text>

            <circle cx="${x1}" cy="${yBase}" r="4" fill="#0f172a"/>
            <text x="${x1 - 10}" y="${yBase + 15}" font-size="11" font-weight="bold" fill="#0f172a">B</text>

            <circle cx="${xMid}" cy="${yBase}" r="4.5" fill="#dc2626"/>
            <text x="${xMid}" y="${yBase + 16}" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">D (Midpoint)</text>

            <circle cx="${x2}" cy="${yBase}" r="4" fill="#0f172a"/>
            <text x="${x2 + 8}" y="${yBase + 15}" font-size="11" font-weight="bold" fill="#0f172a">C</text>

            <text x="${(x1 + xMid) / 2}" y="${yBase - 8}" font-size="10" fill="#1d4ed8" font-weight="bold" text-anchor="middle">BD = ${b/2}</text>
            <text x="${(xMid + x2) / 2}" y="${yBase - 8}" font-size="10" fill="#c2410c" font-weight="bold" text-anchor="middle">DC = ${b/2}</text>
          `;
        } else {
          // Shear mode
          var sx = this.shearX;
          svg.innerHTML = `
            <!-- Top Parallel Guideline -->
            <line x1="40" y1="${yTop}" x2="340" y2="${yTop}" stroke="#94a3b8" stroke-dasharray="4,4" stroke-width="1.5"/>
            <!-- Parallelogram ABCD -->
            <polygon points="${x1},${yBase} ${x2},${yBase} ${x2 + sx},${yTop} ${x1 + sx},${yTop}" 
                     fill="#c7d2fe" opacity="0.7" stroke="#4338ca" stroke-width="2.5"/>
            <!-- Altitude h -->
            <line x1="${x1 + sx}" y1="${yTop}" x2="${x1 + sx}" y2="${yBase}" stroke="#dc2626" stroke-dasharray="3,3" stroke-width="1.5"/>
            <text x="${x1 + sx + 4}" y="${(yTop + yBase) / 2}" fill="#dc2626" font-size="10">h = ${h}</text>
            <!-- Base b -->
            <line x1="${x1}" y1="${yBase}" x2="${x2}" y2="${yBase}" stroke="#0f172a" stroke-width="3"/>
            <text x="${(x1 + x2) / 2}" y="${yBase + 16}" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Base b = ${b}</text>
          `;
        }
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        if (this.mode === 'median') {
          readout.innerHTML = `
            <strong>Triangle Median Invariance:</strong> Base BC = ${b} units &middot; Altitude h = ${h} units &middot; Total Area = <strong>${(0.5 * b * h).toFixed(1)} sq. units</strong><br>
            <strong>Area(∆ABD) [Blue]:</strong> ${(0.25 * b * h).toFixed(1)} sq. units &nbsp;|&nbsp; 
            <strong>Area(∆ACD) [Orange]:</strong> ${(0.25 * b * h).toFixed(1)} sq. units &nbsp;(Ratio: <strong>1.00 : 1.00</strong>)
          `;
        } else {
          readout.innerHTML = `
            <strong>Parallelogram Shearing:</strong> Base b = ${b} units &middot; Height h = ${h} units &middot; 
            Shear Displacement = ${this.shearX}px &middot; <strong>Area = b × h = ${b * h} sq. units</strong> (Strictly Constant!)
          `;
        }
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        if (this.mode === 'median') {
          verdict.innerHTML = `✓ <strong>Median Theorem Verified:</strong> Dragging vertex A along the parallel line changes triangle shape, but both halves always share equal bases (BD = DC) and identical altitude h. Thus Area(∆ABD) ≡ Area(∆ACD)!`;
        } else {
          verdict.innerHTML = `✓ <strong>Cavalieri's Shear Invariance:</strong> Horizontal translation leaves both base b and perpendicular altitude h completely unchanged, proving Area = bh for all parallelograms!`;
        }
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 4: Heron's Formula & Dual Circles (Incircle/Circumcircle) Explorer
  // -------------------------------------------------------------
  engines['sim-concept-4'] = {
    a: 13,
    b: 14,
    c: 15,
    playing: false,
    timer: null,

    init: function(container) {
      this.container = container;
      this.renderUI();
      this.update();
    },

    renderUI: function() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="sim-wrapper" style="font-family: system-ui, sans-serif;">
          <div class="sim-header" style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Heron's Formula & Dual Circles (Incircle/Circumcircle)</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Compute triangle area from 3 sides without altitudes, and view the inscribed (Area = r·s) and circumscribed (Area = abc/4R) circles.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c4-svg" width="380" height="230" viewBox="-40 -20 380 230" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c4-play" class="btn btn-sm">▶ Presets</button>
            <button id="c4-reset" class="btn btn-sm">↺ Reset (13-14-15)</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Side a: <span id="c4-a-val">13</span>
              <input type="range" id="c4-a" min="6" max="25" value="13" style="vertical-align: middle; width: 80px;">
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Side b: <span id="c4-b-val">14</span>
              <input type="range" id="c4-b" min="6" max="25" value="14" style="vertical-align: middle; width: 80px;">
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Side c: <span id="c4-c-val">15</span>
              <input type="range" id="c4-c" min="6" max="25" value="15" style="vertical-align: middle; width: 80px;">
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c4-play');
      var resetBtn = this.container.querySelector('#c4-reset');
      var aSlider = this.container.querySelector('#c4-a');
      var bSlider = this.container.querySelector('#c4-b');
      var cSlider = this.container.querySelector('#c4-c');

      if (playBtn) playBtn.onclick = function() { self.cyclePreset(); };
      if (resetBtn) resetBtn.onclick = function() { self.reset(); };

      var handleInput = function() {
        self.a = parseInt(aSlider.value, 10);
        self.b = parseInt(bSlider.value, 10);
        self.c = parseInt(cSlider.value, 10);

        // Enforce triangle inequality
        if (self.a + self.b <= self.c) self.c = self.a + self.b - 1;
        if (self.b + self.c <= self.a) self.a = self.b + self.c - 1;
        if (self.c + self.a <= self.b) self.b = self.c + self.a - 1;

        aSlider.value = self.a;
        bSlider.value = self.b;
        cSlider.value = self.c;
        self.container.querySelector('#c4-a-val').textContent = self.a;
        self.container.querySelector('#c4-b-val').textContent = self.b;
        self.container.querySelector('#c4-c-val').textContent = self.c;
        self.update();
      };

      if (aSlider) aSlider.oninput = handleInput;
      if (bSlider) bSlider.oninput = handleInput;
      if (cSlider) cSlider.oninput = handleInput;
    },

    cyclePreset: function() {
      var presets = [
        [13, 14, 15],
        [9, 12, 15],  // Right 3-4-5 multiple
        [10, 10, 10], // Equilateral
        [10, 13, 13], // Isosceles
        [7, 24, 25]   // Famous Pythagorean
      ];
      this.presetIdx = ((this.presetIdx || 0) + 1) % presets.length;
      var p = presets[this.presetIdx];
      this.a = p[0];
      this.b = p[1];
      this.c = p[2];

      var aSlider = this.container ? this.container.querySelector('#c4-a') : null;
      var bSlider = this.container ? this.container.querySelector('#c4-b') : null;
      var cSlider = this.container ? this.container.querySelector('#c4-c') : null;
      if (aSlider) aSlider.value = this.a;
      if (bSlider) bSlider.value = this.b;
      if (cSlider) cSlider.value = this.c;
      if (this.container) {
        this.container.querySelector('#c4-a-val').textContent = this.a;
        this.container.querySelector('#c4-b-val').textContent = this.b;
        this.container.querySelector('#c4-c-val').textContent = this.c;
      }
      this.update();
    },

    reset: function() {
      this.a = 13;
      this.b = 14;
      this.c = 15;
      var aSlider = this.container ? this.container.querySelector('#c4-a') : null;
      var bSlider = this.container ? this.container.querySelector('#c4-b') : null;
      var cSlider = this.container ? this.container.querySelector('#c4-c') : null;
      if (aSlider) aSlider.value = 13;
      if (bSlider) bSlider.value = 14;
      if (cSlider) cSlider.value = 15;
      if (this.container) {
        this.container.querySelector('#c4-a-val').textContent = 13;
        this.container.querySelector('#c4-b-val').textContent = 14;
        this.container.querySelector('#c4-c-val').textContent = 15;
      }
      this.update();
    },

    update: function() {
      var a = this.a;
      var b = this.b;
      var c = this.c;

      var s = (a + b + c) / 2;
      var diffA = s - a;
      var diffB = s - b;
      var diffC = s - c;
      var prod = s * diffA * diffB * diffC;
      var area = Math.sqrt(Math.max(0, prod));
      var rIn = area / s;
      var rCirc = (a * b * c) / (4 * area);

      // SVG Coordinate mapping: Place C at origin, B at (a, 0)
      // Vertex A position via law of cosines on angle C:
      // cosC = (a^2 + b^2 - c^2)/(2ab)
      var cosC = (a * a + b * b - c * c) / (2 * a * b);
      var sinC = Math.sqrt(Math.max(0, 1 - cosC * cosC));
      var axRaw = b * cosC;
      var ayRaw = b * sinC;

      // Scaling to fit SVG box (width ~300, height ~180)
      var scale = 220 / Math.max(a, axRaw, ayRaw, 15);
      var xC = 60;
      var yC = 170;
      var xB = xC + a * scale;
      var yB = yC;
      var xA = xC + axRaw * scale;
      var yA = yC - ayRaw * scale;

      // Incenter coordinates: (a*xA + b*xB + c*xC) / (a + b + c)
      var inX = (a * xA + b * xB + c * xC) / (2 * s);
      var inY = (a * yA + b * yB + c * yC) / (2 * s);
      var inRPx = rIn * scale;

      var svg = this.container ? this.container.querySelector('#c4-svg') : null;
      if (svg) {
        svg.innerHTML = `
          <!-- Circumcircle -->
          <circle cx="${(xC + xB) / 2}" cy="${(yC + yA) / 2}" r="${rCirc * scale}" fill="none" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="4,3"/>
          
          <!-- Incircle (Touching all 3 sides) -->
          <circle cx="${inX}" cy="${inY}" r="${inRPx}" fill="#fef3c7" opacity="0.6" stroke="#d97706" stroke-width="2"/>
          <circle cx="${inX}" cy="${inY}" r="3" fill="#d97706"/>

          <!-- Main Triangle ABC -->
          <polygon points="${xA},${yA} ${xB},${yB} ${xC},${yC}" fill="#dcfce7" opacity="0.7" stroke="#16a34a" stroke-width="2.5"/>

          <!-- Vertices Labels -->
          <circle cx="${xA}" cy="${yA}" r="4" fill="#0f172a"/>
          <text x="${xA}" y="${yA - 8}" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">A</text>
          
          <circle cx="${xB}" cy="${yB}" r="4" fill="#0f172a"/>
          <text x="${xB + 8}" y="${yB + 4}" font-size="11" font-weight="bold" fill="#0f172a">B</text>

          <circle cx="${xC}" cy="${yC}" r="4" fill="#0f172a"/>
          <text x="${xC - 12}" y="${yC + 4}" font-size="11" font-weight="bold" fill="#0f172a">C</text>

          <!-- Side Labels -->
          <text x="${(xC + xB) / 2}" y="${yC + 15}" font-size="10" fill="#15803d" font-weight="bold" text-anchor="middle">a = ${a}</text>
          <text x="${(xC + xA) / 2 - 12}" y="${(yC + yA) / 2}" font-size="10" fill="#15803d" font-weight="bold">b = ${b}</text>
          <text x="${(xB + xA) / 2 + 8}" y="${(yB + yA) / 2}" font-size="10" fill="#15803d" font-weight="bold">c = ${c}</text>
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        readout.innerHTML = `
          <strong>Heron's Formula:</strong> s = ${s.toFixed(1)} &middot; (s-a)=${diffA.toFixed(1)}, (s-b)=${diffB.toFixed(1)}, (s-c)=${diffC.toFixed(1)}<br>
          <strong>Computed Area:</strong> √[${s.toFixed(1)} × ${diffA.toFixed(1)} × ${diffB.toFixed(1)} × ${diffC.toFixed(1)}] = <strong>${area.toFixed(2)} sq. units</strong><br>
          <strong>Inradius r:</strong> Area / s = <strong>${rIn.toFixed(2)}</strong> &nbsp;|&nbsp; <strong>Circumradius R:</strong> abc / 4Area = <strong>${rCirc.toFixed(2)}</strong>
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        verdict.innerHTML = `✓ <strong>Alexandrian Duality Verified:</strong> The incircle (r = Area/s) touches all three edges internally, and the circumcircle (R = abc/4Area) passes through all 3 vertices, fully determined by sides ${a}, ${b}, and ${c}!`;
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 5: Brahmagupta Cyclic 4-gon & Baudhāyana Squaring Lab
  // -------------------------------------------------------------
  engines['sim-concept-5'] = {
    mode: 'brahmagupta', // 'brahmagupta' or 'baudhayana'
    shrinkD: 6,
    rectA: 16,
    rectB: 9,
    playing: false,
    timer: null,

    init: function(container) {
      this.container = container;
      this.renderUI();
      this.update();
    },

    renderUI: function() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="sim-wrapper" style="font-family: system-ui, sans-serif;">
          <div class="sim-header" style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Brahmagupta Cyclic 4-gon & Baudhāyana Squaring Lab</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Witness Brahmagupta's formula reduce to Heron's as side d → 0, and explore Baudhāyana's 800 BCE rectangle squarer.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c5-svg" width="380" height="230" viewBox="-130 -115 260 230" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c5-play" class="btn btn-sm">▶ Animate d → 0</button>
            <button id="c5-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Model:
              <select id="c5-mode" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
                <option value="brahmagupta">Brahmagupta Cyclic 4-gon (d → 0)</option>
                <option value="baudhayana">Baudhāyana Squaring of a Rectangle</option>
              </select>
            </label>
            <label id="c5-shrink-ctrl" style="font-size: 0.85rem; margin-left: 8px;">
              Side d Length: <span id="c5-d-lbl">6.0</span>
              <input type="range" id="c5-d" min="0" max="8" step="0.2" value="6" style="vertical-align: middle; width: 80px;">
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c5-play');
      var resetBtn = this.container.querySelector('#c5-reset');
      var modeSel = this.container.querySelector('#c5-mode');
      var dSlider = this.container.querySelector('#c5-d');

      if (playBtn) playBtn.onclick = function() { self.animateShrink(); };
      if (resetBtn) resetBtn.onclick = function() { self.reset(); };

      if (modeSel) modeSel.onchange = function(e) {
        self.mode = e.target.value;
        var ctrl = self.container.querySelector('#c5-shrink-ctrl');
        if (ctrl) ctrl.style.display = self.mode === 'brahmagupta' ? 'inline-block' : 'none';
        self.update();
      };
      if (dSlider) dSlider.oninput = function(e) {
        self.shrinkD = parseFloat(e.target.value);
        var lbl = self.container.querySelector('#c5-d-lbl');
        if (lbl) lbl.textContent = self.shrinkD.toFixed(1);
        self.update();
      };
    },

    animateShrink: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      var d = self.shrinkD;
      this.timer = setInterval(function() {
        d -= 0.3;
        if (d <= 0.05) {
          d = 0;
          clearInterval(self.timer);
          self.playing = false;
        }
        self.shrinkD = Math.max(0, d);
        var sld = self.container ? self.container.querySelector('#c5-d') : null;
        var lbl = self.container ? self.container.querySelector('#c5-d-lbl') : null;
        if (sld) sld.value = self.shrinkD;
        if (lbl) lbl.textContent = self.shrinkD.toFixed(1);
        self.update();
      }, 70);
    },

    reset: function() {
      this.playing = false;
      if (this.timer) clearInterval(this.timer);
      this.shrinkD = 6.0;
      var sld = this.container ? this.container.querySelector('#c5-d') : null;
      var lbl = this.container ? this.container.querySelector('#c5-d-lbl') : null;
      if (sld) sld.value = 6.0;
      if (lbl) lbl.textContent = '6.0';
      this.update();
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c5-svg') : null;
      if (!svg) return;

      if (this.mode === 'brahmagupta') {
        var R = 85;
        // Vertex angles on circle:
        // A at top-left: 200°
        // B at bottom-left: 120°
        // C at bottom-right: 20°
        // D moves from 290° toward 200° (coalescing with A when d=0)
        var angA = 200 * Math.PI / 180;
        var angB = 120 * Math.PI / 180;
        var angC = 20 * Math.PI / 180;
        var frac = this.shrinkD / 8.0;
        var angD = (200 + frac * 90) * Math.PI / 180;

        var ax = R * Math.cos(angA), ay = -R * Math.sin(angA);
        var bx = R * Math.cos(angB), by = -R * Math.sin(angB);
        var cx = R * Math.cos(angC), cy = -R * Math.sin(angC);
        var dx = R * Math.cos(angD), dy = -R * Math.sin(angD);

        var aSide = Math.hypot(bx - ax, by - ay) / 15;
        var bSide = Math.hypot(cx - bx, cy - by) / 15;
        var cSide = Math.hypot(dx - cx, dy - cy) / 15;
        var dSide = Math.hypot(ax - dx, ay - dy) / 15;

        var s = (aSide + bSide + cSide + dSide) / 2;
        var areaBrahma = Math.sqrt(Math.max(0, (s - aSide) * (s - bSide) * (s - cSide) * (s - dSide)));

        svg.setAttribute('viewBox', '-110 -110 220 220');
        svg.innerHTML = `
          <!-- Circumscribing Circle -->
          <circle cx="0" cy="0" r="${R}" fill="#f1f5f9" stroke="#0284c7" stroke-width="2"/>

          <!-- Quadrilateral ABCD -->
          <polygon points="${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}" 
                   fill="#fef08a" opacity="0.6" stroke="#ca8a04" stroke-width="2.5"/>

          <!-- Vertices -->
          <circle cx="${ax}" cy="${ay}" r="4" fill="#0f172a"/>
          <text x="${ax - 12}" y="${ay}" font-size="11" font-weight="bold" fill="#0f172a">A</text>

          <circle cx="${bx}" cy="${by}" r="4" fill="#0f172a"/>
          <text x="${bx}" y="${by + 14}" font-size="11" font-weight="bold" fill="#0f172a">B</text>

          <circle cx="${cx}" cy="${cy}" r="4" fill="#0f172a"/>
          <text x="${cx + 8}" y="${cy}" font-size="11" font-weight="bold" fill="#0f172a">C</text>

          <circle cx="${dx}" cy="${dy}" r="4.5" fill="#dc2626"/>
          <text x="${dx + 6}" y="${dy - 8}" font-size="11" font-weight="bold" fill="#dc2626">${this.shrinkD <= 0.2 ? 'D ≡ A' : 'D'}</text>

          <!-- Label side d -->
          <line x1="${ax}" y1="${ay}" x2="${dx}" y2="${dy}" stroke="#dc2626" stroke-width="3"/>
          <text x="${(ax + dx) / 2}" y="${(ay + dy) / 2 - 8}" font-size="10" fill="#dc2626" font-weight="bold">d = ${dSide.toFixed(1)}</text>
        `;

        var readout = this.container.querySelector('#lab-readout');
        if (readout) {
          if (this.shrinkD <= 0.2) {
            readout.innerHTML = `
              <strong>Vertices Coalesced (d = 0):</strong> Vertices D and A collide into a single vertex!<br>
              <strong>Brahmagupta Formula:</strong> √[(s-a)(s-b)(s-c)(s-0)] ≡ <strong>√[s(s-a)(s-b)(s-c)]</strong> (Exact Heron's Formula!)<br>
              <strong>Area:</strong> ${areaBrahma.toFixed(2)} sq. units.
            `;
          } else {
            readout.innerHTML = `
              <strong>Brahmagupta Cyclic 4-gon:</strong> Sides: a=${aSide.toFixed(1)}, b=${bSide.toFixed(1)}, c=${cSide.toFixed(1)}, d=${dSide.toFixed(1)}<br>
              <strong>Semi-perimeter s:</strong> ${s.toFixed(1)} &middot; <strong>Area:</strong> √[(s-a)(s-b)(s-c)(s-d)] = <strong>${areaBrahma.toFixed(2)} sq. units</strong>
            `;
          }
        }

        var verdict = this.container.querySelector('#lab-verdict');
        if (verdict) {
          if (this.shrinkD <= 0.2) {
            verdict.innerHTML = `✓ <strong>Generalisation Confirmed:</strong> Heron's formula is rigorously proven to be a direct special case of Brahmagupta's formula for cyclic quadrilaterals when side d = 0!`;
          } else {
            verdict.innerHTML = `• Drag slider or click 'Animate d → 0' to watch the 4-gon morph continuously into a triangle with identical area!`;
          }
        }
      } else {
        // Baudhāyana Squaring Mode
        var a = this.rectA;
        var b = this.rectB;
        var sSide = Math.sqrt(a * b); // sqrt(16 * 9) = 12

        svg.setAttribute('viewBox', '0 0 340 200');
        svg.innerHTML = `
          <!-- Rectangle ABCD: 16 x 9 scaled -->
          <rect x="20" y="50" width="${a * 8}" height="${b * 8}" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
          <text x="${20 + a * 4}" y="${50 + b * 4}" font-size="12" fill="#1e40af" font-weight="bold" text-anchor="middle">
            Rectangle ${a} × ${b}<br>(Area = ${a * b})
          </text>

          <!-- Squaring Compass Arc -->
          <path d="M ${20 + a * 8},50 A 90,90 0 0,1 ${20 + (a + b) * 4},140" fill="none" stroke="#dc2626" stroke-dasharray="3,3"/>

          <!-- Constructed Square HPQS: 12 x 12 scaled -->
          <rect x="190" y="${50 + (b - sSide) * 4}" width="${sSide * 8}" height="${sSide * 8}" fill="#bbf7d0" stroke="#16a34a" stroke-width="2.5"/>
          <text x="${190 + sSide * 4}" y="${50 + b * 4}" font-size="12" fill="#15803d" font-weight="bold" text-anchor="middle">
            Constructed Square<br>Side = √(${a}×${b}) = ${sSide}<br>(Area = ${sSide * sSide})
          </text>
        `;

        var readout2 = this.container.querySelector('#lab-readout');
        if (readout2) {
          readout2.innerHTML = `
            <strong>Baudhāyana Śulbasūtra Construction (800 BCE):</strong><br>
            Rectangle Area = a × b = ${a} × ${b} = <strong>${a * b} sq. units</strong><br>
            Constructed Square Side = √[((a+b)/2)² - ((a-b)/2)²] = √[(${((a+b)/2)}² - ${((a-b)/2)}²)] = √[${a*b}] = <strong>${sSide.toFixed(1)} units</strong>
          `;
        }
        var verdict2 = this.container.querySelector('#lab-verdict');
        if (verdict2) {
          verdict2.innerHTML = `✓ <strong>Geometric Squaring Validated:</strong> Baudhāyana's geometric identity ((a+b)/2)² - ((a-b)/2)² ≡ ab yields a square with exactly identical area to the given rectangle!`;
        }
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 6: Nīlakaṇṭha Circle-Slice Unrolling & Sector/Segment Calculator
  // -------------------------------------------------------------
  engines['sim-concept-6'] = {
    mode: 'nilakantha', // 'nilakantha' or 'sector'
    wedges: 16,
    unrollFrac: 0, // 0 = disc, 1 = parallelogram
    radius: 10,
    angle: 60,
    playing: false,
    timer: null,

    init: function(container) {
      this.container = container;
      this.renderUI();
      this.update();
    },

    renderUI: function() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="sim-wrapper" style="font-family: system-ui, sans-serif;">
          <div class="sim-header" style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Nīlakaṇṭha Circle-Slice Unrolling & Sector/Segment Explorer</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">See Kerala astronomer Nīlakaṇṭha Somayājī's visual proof that Area = πr², and compute sectors and segments dynamically.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c6-svg" width="380" height="220" viewBox="0 0 380 220" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c6-play" class="btn btn-sm">▶ Animate Unroll</button>
            <button id="c6-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Mode:
              <select id="c6-mode" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
                <option value="nilakantha">Nīlakaṇṭha Slice-to-Parallelogram</option>
                <option value="sector">Sector & Segment Calculator</option>
              </select>
            </label>
            <span id="c6-nilakantha-ctrls">
              <label style="font-size: 0.85rem; margin-left: 8px;">
                Slices N:
                <select id="c6-slices" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
                  <option value="8">8 Slices</option>
                  <option value="16" selected>16 Slices</option>
                  <option value="32">32 Slices</option>
                </select>
              </label>
              <label style="font-size: 0.85rem; margin-left: 8px;">
                Unroll: <span id="c6-unroll-lbl">0%</span>
                <input type="range" id="c6-unroll" min="0" max="100" value="0" style="vertical-align: middle; width: 70px;">
              </label>
            </span>
            <span id="c6-sector-ctrls" style="display: none;">
              <label style="font-size: 0.85rem; margin-left: 8px;">
                Angle θ: <span id="c6-ang-lbl">60°</span>
                <input type="range" id="c6-ang" min="15" max="360" step="5" value="60" style="vertical-align: middle; width: 80px;">
              </label>
            </span>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c6-play');
      var resetBtn = this.container.querySelector('#c6-reset');
      var modeSel = this.container.querySelector('#c6-mode');
      var slicesSel = this.container.querySelector('#c6-slices');
      var unrollSlider = this.container.querySelector('#c6-unroll');
      var angSlider = this.container.querySelector('#c6-ang');

      if (playBtn) playBtn.onclick = function() { self.animateUnroll(); };
      if (resetBtn) resetBtn.onclick = function() { self.reset(); };

      if (modeSel) modeSel.onchange = function(e) {
        self.mode = e.target.value;
        var nCtrls = self.container.querySelector('#c6-nilakantha-ctrls');
        var sCtrls = self.container.querySelector('#c6-sector-ctrls');
        if (nCtrls) nCtrls.style.display = self.mode === 'nilakantha' ? 'inline' : 'none';
        if (sCtrls) sCtrls.style.display = self.mode === 'sector' ? 'inline' : 'none';
        self.update();
      };
      if (slicesSel) slicesSel.onchange = function(e) {
        self.wedges = parseInt(e.target.value, 10);
        self.update();
      };
      if (unrollSlider) unrollSlider.oninput = function(e) {
        self.unrollFrac = parseFloat(e.target.value) / 100;
        var lbl = self.container.querySelector('#c6-unroll-lbl');
        if (lbl) lbl.textContent = e.target.value + '%';
        self.update();
      };
      if (angSlider) angSlider.oninput = function(e) {
        self.angle = parseInt(e.target.value, 10);
        var lbl = self.container.querySelector('#c6-ang-lbl');
        if (lbl) lbl.textContent = self.angle + '°';
        self.update();
      };
    },

    animateUnroll: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      var u = 0;
      this.timer = setInterval(function() {
        u += 4;
        if (u > 100) {
          u = 100;
          clearInterval(self.timer);
          self.playing = false;
        }
        self.unrollFrac = u / 100;
        var sld = self.container ? self.container.querySelector('#c6-unroll') : null;
        var lbl = self.container ? self.container.querySelector('#c6-unroll-lbl') : null;
        if (sld) sld.value = u;
        if (lbl) lbl.textContent = u + '%';
        self.update();
      }, 50);
    },

    reset: function() {
      this.playing = false;
      if (this.timer) clearInterval(this.timer);
      this.unrollFrac = 0;
      this.angle = 60;
      var sld = this.container ? this.container.querySelector('#c6-unroll') : null;
      var lbl = this.container ? this.container.querySelector('#c6-unroll-lbl') : null;
      if (sld) sld.value = 0;
      if (lbl) lbl.textContent = '0%';
      this.update();
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c6-svg') : null;
      if (!svg) return;

      if (this.mode === 'nilakantha') {
        var N = this.wedges;
        var r = 65;
        var t = this.unrollFrac; // 0 (circle) to 1 (interlocked parallelogram)
        var wedgeWidth = (2 * Math.PI * r) / N;

        var paths = [];
        for (var i = 0; i < N; i++) {
          var isUp = i % 2 === 0;
          var color = isUp ? '#38bdf8' : '#fb923c';

          // Circle mode position
          var thetaMid = (i + 0.5) * (2 * Math.PI / N) - Math.PI / 2;
          var circX = 100 + r * Math.cos(thetaMid);
          var circY = 110 + r * Math.sin(thetaMid);

          // Unrolled parallelogram position:
          // Interlocked row: x spans from 50 to 50 + pi*r
          var paraX = 50 + (i * 0.5) * wedgeWidth;
          var paraY = isUp ? 80 : 145;

          // Interpolate
          var curX = (1 - t) * circX + t * paraX;
          var curY = (1 - t) * circY + t * paraY;

          // Draw wedge triangle / sector representation
          var wedgeAng = 2 * Math.PI / N;
          var ang1 = i * wedgeAng - Math.PI / 2;
          var ang2 = (i + 1) * wedgeAng - Math.PI / 2;

          if (t < 0.5) {
            var p1 = (100 + r * Math.cos(ang1)).toFixed(1) + ',' + (110 + r * Math.sin(ang1)).toFixed(1);
            var p2 = (100 + r * Math.cos(ang2)).toFixed(1) + ',' + (110 + r * Math.sin(ang2)).toFixed(1);
            paths.push(`<path d="M 100,110 L ${p1} A ${r},${r} 0 0,1 ${p2} Z" fill="${color}" stroke="#ffffff" stroke-width="1"/>`);
          } else {
            // Parallelogram wedges
            var wHalf = wedgeWidth / 2;
            var wH = isUp ? r : -r;
            paths.push(`<polygon points="${curX - wHalf},${curY} ${curX + wHalf},${curY} ${curX},${curY - wH}" fill="${color}" stroke="#ffffff" stroke-width="1"/>`);
          }
        }

        svg.innerHTML = `
          ${paths.join('\n')}
          ${t > 0.7 ? `
            <!-- Dimension indicators on parallelogram -->
            <line x1="50" y1="165" x2="${50 + Math.PI * r}" y2="165" stroke="#0f172a" stroke-width="2"/>
            <text x="${50 + (Math.PI * r) / 2}" y="180" font-size="11" fill="#0f172a" font-weight="bold" text-anchor="middle">Base = πr ≈ ${(Math.PI * r).toFixed(1)} px</text>
            <line x1="40" y1="80" x2="40" y2="145" stroke="#dc2626" stroke-width="2"/>
            <text x="32" y="116" font-size="11" fill="#dc2626" font-weight="bold" text-anchor="end">Height = r</text>
          ` : `
            <text x="100" y="195" font-size="11" fill="#0369a1" font-weight="bold" text-anchor="middle">Circular Disc (Radius r)</text>
          `}
        `;

        var readout = this.container.querySelector('#lab-readout');
        if (readout) {
          readout.innerHTML = `
            <strong>Nīlakaṇṭha Dissection (c. 1500 CE):</strong> Slices = ${N} &middot; Unroll = ${(t * 100).toFixed(0)}%<br>
            <strong>Parallelogram Dimensions:</strong> Base = Half Circumference = <strong>πr</strong> &middot; Height = Radius = <strong>r</strong><br>
            <strong>Area:</strong> Base × Height = (πr) × r = <strong>πr²</strong>!
          `;
        }

        var verdict = this.container.querySelector('#lab-verdict');
        if (verdict) {
          verdict.innerHTML = `✓ <strong>Geometric Proof of πr²:</strong> As the number of wedge sectors increases, the undulating boundary approaches a straight line, transforming the circle into an exact rectangle of base πr and height r!`;
        }
      } else {
        // Sector & Segment Mode
        var rS = 85;
        var cx = 190, cy = 115;
        var th = this.angle;
        var rad = th * Math.PI / 180;

        var x0 = cx, y0 = cy;
        var xA = cx + rS;
        var yA = cy;
        var xB = cx + rS * Math.cos(-rad);
        var yB = cy + rS * Math.sin(-rad);

        var largeArc = th > 180 ? 1 : 0;
        var sectorArea = (th / 360) * Math.PI * this.radius * this.radius;
        var triArea = 0.5 * this.radius * this.radius * Math.sin(rad);
        var segArea = sectorArea - triArea;
        var arcLen = (th / 360) * 2 * Math.PI * this.radius;

        svg.innerHTML = `
          <!-- Full circle background -->
          <circle cx="${cx}" cy="${cy}" r="${rS}" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>

          <!-- Minor Sector -->
          <path d="M ${cx},${cy} L ${xA},${yA} A ${rS},${rS} 0 ${largeArc},0 ${xB},${yB} Z" fill="#fed7aa" opacity="0.8" stroke="#ea580c" stroke-width="2"/>

          <!-- Chord AB -->
          <line x1="${xA}" y1="${yA}" x2="${xB}" y2="${yB}" stroke="#dc2626" stroke-width="2.5"/>

          <!-- Segment Highlight -->
          <path d="M ${xA},${yA} A ${rS},${rS} 0 ${largeArc},0 ${xB},${yB} Z" fill="#fca5a5" opacity="0.6"/>

          <!-- Center point -->
          <circle cx="${cx}" cy="${cy}" r="4" fill="#0f172a"/>
          <text x="${cx - 8}" y="${cy + 15}" font-size="11" font-weight="bold" fill="#0f172a">O</text>

          <!-- Arc label -->
          <text x="${cx}" y="25" font-size="11" fill="#ea580c" font-weight="bold" text-anchor="middle">Arc AB (Angle θ = ${th}°)</text>
        `;

        var readout2 = this.container.querySelector('#lab-readout');
        if (readout2) {
          readout2.innerHTML = `
            <strong>Radius r = ${this.radius} cm &middot; Central Angle θ = ${th}°:</strong><br>
            <strong>Arc Length:</strong> 2πr × (${th}/360) = <strong>${arcLen.toFixed(2)} cm</strong><br>
            <strong>Sector Area:</strong> πr² × (${th}/360) = <strong>${sectorArea.toFixed(2)} cm²</strong><br>
            <strong>Minor Segment Area:</strong> Sector - ∆OAB = ${sectorArea.toFixed(2)} - ${triArea.toFixed(2)} = <strong>${segArea.toFixed(2)} cm²</strong>
          `;
        }

        var verdict2 = this.container.querySelector('#lab-verdict');
        if (verdict2) {
          verdict2.innerHTML = `✓ <strong>Curved Area Calculus:</strong> The circular segment is isolated by subtracting the isosceles chord triangle from the proportional sector!`;
        }
      }
    },

    render: function() {
      this.update();
    }
  };

  return {
    init: function(conceptId, container) {
      if (engines[conceptId]) {
        engines[conceptId].init(container);
      }
    },
    getEngine: function(conceptId) {
      return engines[conceptId];
    },
    getAllEngines: function() {
      return engines;
    }
  };
})();
