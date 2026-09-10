// Class 9 Mathematics Chapter 8: Predicting What Comes Next - Sequences and Progressions
// Pure offline interactive simulation engines with standard timeline controls.

window.SimEngine = (function() {
  'use strict';

  var engines = {};

  // -------------------------------------------------------------
  // Engine 1: Sequence Rule Generator & Virahāṅka Prosody Visualizer
  // -------------------------------------------------------------
  engines['sim-concept-1'] = {
    rule: 'virahanka',
    n: 6,
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
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Sequence Rule Generator & Virahāṅka Prosody Visualizer</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Compare direct explicit term generation vs recursive history-dependent accumulation across poetic mora rhythms.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c1-svg" width="460" height="220" viewBox="0 0 460 220" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c1-play" class="btn btn-sm">▶ Play</button>
            <button id="c1-pause" class="btn btn-sm">⏸ Pause</button>
            <button id="c1-step" class="btn btn-sm">⏭ Step</button>
            <button id="c1-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Rule:
              <select id="c1-rule" style="font-size: 0.85rem; padding: 2px 6px;">
                <option value="virahanka">Recursive: Virahāṅka (V_n = V_{n-1} + V_{n-2})</option>
                <option value="odd">Explicit: u_n = 2n - 1 (Odd Numbers)</option>
                <option value="linear">Explicit: t_n = 3n - 4 (Linear)</option>
                <option value="triangular">Explicit: t_n = n(n+1)/2 (Triangular)</option>
                <option value="rec_linear">Recursive: t_1=-5, t_n = t_{n-1}+3</option>
              </select>
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Term n: <span id="c1-n-val">6</span>
              <input type="range" id="c1-n" min="1" max="10" value="6" style="vertical-align: middle; width: 80px;">
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
      var ruleSelect = this.container.querySelector('#c1-rule');
      var nSlider = this.container.querySelector('#c1-n');

      if (playBtn) playBtn.addEventListener('click', function() { self.play(); });
      if (pauseBtn) pauseBtn.addEventListener('click', function() { self.pause(); });
      if (stepBtn) stepBtn.addEventListener('click', function() { self.step(); });
      if (resetBtn) resetBtn.addEventListener('click', function() { self.reset(); });

      if (ruleSelect) {
        ruleSelect.addEventListener('change', function(e) {
          self.rule = e.target.value;
          self.update();
        });
      }

      if (nSlider) {
        nSlider.addEventListener('input', function(e) {
          self.n = parseInt(e.target.value, 10);
          var lbl = self.container.querySelector('#c1-n-val');
          if (lbl) lbl.textContent = self.n;
          self.update();
        });
      }
    },

    getTerms: function(maxN) {
      var terms = [];
      if (this.rule === 'virahanka') {
        var v = [1, 2];
        for (var i = 2; i < maxN; i++) {
          v.push(v[i - 1] + v[i - 2]);
        }
        for (var k = 0; k < maxN; k++) terms.push(v[k]);
      } else if (this.rule === 'odd') {
        for (var j = 1; j <= maxN; j++) terms.push(2 * j - 1);
      } else if (this.rule === 'linear') {
        for (var l = 1; l <= maxN; l++) terms.push(3 * l - 4);
      } else if (this.rule === 'triangular') {
        for (var m = 1; m <= maxN; m++) terms.push((m * (m + 1)) / 2);
      } else if (this.rule === 'rec_linear') {
        var curr = -5;
        terms.push(curr);
        for (var p = 2; p <= maxN; p++) {
          curr += 3;
          terms.push(curr);
        }
      }
      return terms;
    },

    play: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      this.timer = setInterval(function() {
        if (self.n < 10) {
          self.n++;
        } else {
          self.n = 1;
        }
        var slider = self.container.querySelector('#c1-n');
        var lbl = self.container.querySelector('#c1-n-val');
        if (slider) slider.value = self.n;
        if (lbl) lbl.textContent = self.n;
        self.update();
      }, 700);
    },

    pause: function() {
      this.playing = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    step: function() {
      this.pause();
      if (this.n < 10) this.n++;
      else this.n = 1;
      var slider = this.container.querySelector('#c1-n');
      var lbl = this.container.querySelector('#c1-n-val');
      if (slider) slider.value = this.n;
      if (lbl) lbl.textContent = this.n;
      this.update();
    },

    reset: function() {
      this.pause();
      this.n = 1;
      var slider = this.container.querySelector('#c1-n');
      var lbl = this.container.querySelector('#c1-n-val');
      if (slider) slider.value = 1;
      if (lbl) lbl.textContent = '1';
      this.update();
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c1-svg') : null;
      var terms = this.getTerms(this.n);
      var currentVal = terms[this.n - 1];

      if (svg) {
        var width = 460;
        var height = 220;
        var maxVal = Math.max.apply(null, terms.concat([10]));
        var minVal = Math.min.apply(null, terms.concat([0]));
        var range = Math.max(maxVal - minVal, 10);
        var zeroY = height - 35 - ((0 - minVal) / range) * 140;

        var barW = Math.min(30, Math.floor(360 / this.n) - 6);
        var startX = 35;
        var barSpacing = Math.floor(390 / Math.max(this.n, 1));

        var rects = [];
        for (var i = 0; i < terms.length; i++) {
          var val = terms[i];
          var barH = (Math.abs(val) / range) * 140;
          var x = startX + i * barSpacing;
          var y = val >= 0 ? zeroY - barH : zeroY;
          var isCurrent = (i === this.n - 1);
          var color = isCurrent ? '#0284c7' : '#93c5fd';
          if (val < 0) color = isCurrent ? '#ef4444' : '#fca5a5';

          rects.push(`
            <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(barH, 2)}" fill="${color}" rx="3" />
            <text x="${x + barW / 2}" y="${val >= 0 ? y - 6 : y + barH + 14}" text-anchor="middle" font-size="11" font-weight="${isCurrent ? 'bold' : 'normal'}" fill="#334155">${val}</text>
            <text x="${x + barW / 2}" y="${height - 10}" text-anchor="middle" font-size="10" fill="#64748b">n=${i + 1}</text>
          `);
        }

        svg.innerHTML = `
          <!-- Baseline -->
          <line x1="20" y1="${zeroY}" x2="440" y2="${zeroY}" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,3" />
          <text x="25" y="${zeroY - 4}" font-size="9" fill="#94a3b8">0</text>
          <!-- Bars -->
          ${rects.join('')}
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        var termsList = terms.join(', ');
        var ruleDescription = '';
        if (this.rule === 'virahanka') {
          ruleDescription = `Virahāṅka Recurrence: V₁ = 1, V₂ = 2, Vₙ = V_{n-1} + V_{n-2}. (Term n=${this.n} gives ${currentVal} poetic meters)`;
        } else if (this.rule === 'odd') {
          ruleDescription = `Explicit Odd Formula: u_n = 2(${this.n}) - 1 = ${currentVal}. (Direct calculation without prior terms)`;
        } else if (this.rule === 'linear') {
          ruleDescription = `Explicit Linear Formula: t_n = 3(${this.n}) - 4 = ${currentVal}.`;
        } else if (this.rule === 'triangular') {
          ruleDescription = `Triangular Dots: T_n = ${this.n}(${this.n}+1)/2 = (${this.n}×${this.n+1})/2 = ${currentVal}.`;
        } else if (this.rule === 'rec_linear') {
          ruleDescription = `Recursive Step: t_1 = -5, t_n = t_{n-1} + 3. (Term n=${this.n} is ${currentVal})`;
        }

        readout.innerHTML = `
          <strong>Sequence State:</strong> n = ${this.n} &middot; Term <strong>t<sub>${this.n}</sub> = ${currentVal}</strong><br>
          <strong>Generated Terms (${this.n}):</strong> [${termsList}]<br>
          <strong>Rule Mechanism:</strong> ${ruleDescription}
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        if (this.rule === 'virahanka') {
          verdict.innerHTML = `✓ <strong>Virahāṅka's 7th-Century Law:</strong> In Sanskrit prosody, a meter of length ${this.n} beats can be formed by appending either a short syllable (1 mora) to a pattern of (${this.n}-1) beats, or a long syllable (2 morae) to a pattern of (${this.n}-2) beats. Hence Vₙ = V_{n-1} + V_{n-2}!`;
        } else {
          verdict.innerHTML = `✓ <strong>Explicit vs Recursive Mastery:</strong> Explicit rules calculate any arbitrary nth term instantly in constant time O(1), while recursive rules simulate real physical growth one step at a time!`;
        }
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 2: AP Coordinate Line & Difference Sandbox
  // -------------------------------------------------------------
  engines['sim-concept-2'] = {
    a: 3,
    d: 4,
    n: 6,
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
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">AP Coordinate Line & Difference Sandbox</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Discover why every arithmetic progression is a straight line y = dx + (a - d) with geometric slope d.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c2-svg" width="460" height="230" viewBox="0 0 460 230" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c2-play" class="btn btn-sm">▶ Play</button>
            <button id="c2-pause" class="btn btn-sm">⏸ Pause</button>
            <button id="c2-step" class="btn btn-sm">⏭ Step</button>
            <button id="c2-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              First Term (a): <span id="c2-a-val">3</span>
              <input type="range" id="c2-a" min="-10" max="20" value="3" style="vertical-align: middle; width: 70px;">
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Common Diff (d): <span id="c2-d-val">4</span>
              <input type="range" id="c2-d" min="-5" max="8" value="4" style="vertical-align: middle; width: 70px;">
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Terms (n): <span id="c2-n-val">6</span>
              <input type="range" id="c2-n" min="2" max="10" value="6" style="vertical-align: middle; width: 60px;">
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
      var aSlider = this.container.querySelector('#c2-a');
      var dSlider = this.container.querySelector('#c2-d');
      var nSlider = this.container.querySelector('#c2-n');

      if (playBtn) playBtn.addEventListener('click', function() { self.play(); });
      if (pauseBtn) pauseBtn.addEventListener('click', function() { self.pause(); });
      if (stepBtn) stepBtn.addEventListener('click', function() { self.step(); });
      if (resetBtn) resetBtn.addEventListener('click', function() { self.reset(); });

      if (aSlider) {
        aSlider.addEventListener('input', function(e) {
          self.a = parseInt(e.target.value, 10);
          var lbl = self.container.querySelector('#c2-a-val');
          if (lbl) lbl.textContent = self.a;
          self.update();
        });
      }

      if (dSlider) {
        dSlider.addEventListener('input', function(e) {
          self.d = parseInt(e.target.value, 10);
          var lbl = self.container.querySelector('#c2-d-val');
          if (lbl) lbl.textContent = self.d;
          self.update();
        });
      }

      if (nSlider) {
        nSlider.addEventListener('input', function(e) {
          self.n = parseInt(e.target.value, 10);
          var lbl = self.container.querySelector('#c2-n-val');
          if (lbl) lbl.textContent = self.n;
          self.update();
        });
      }
    },

    play: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      this.timer = setInterval(function() {
        if (self.n < 10) self.n++;
        else self.n = 2;
        var slider = self.container.querySelector('#c2-n');
        var lbl = self.container.querySelector('#c2-n-val');
        if (slider) slider.value = self.n;
        if (lbl) lbl.textContent = self.n;
        self.update();
      }, 800);
    },

    pause: function() {
      this.playing = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    step: function() {
      this.pause();
      if (this.n < 10) this.n++;
      else this.n = 2;
      var slider = this.container.querySelector('#c2-n');
      var lbl = this.container.querySelector('#c2-n-val');
      if (slider) slider.value = this.n;
      if (lbl) lbl.textContent = this.n;
      this.update();
    },

    reset: function() {
      this.pause();
      this.a = 3;
      this.d = 4;
      this.n = 6;
      var aS = this.container.querySelector('#c2-a');
      var dS = this.container.querySelector('#c2-d');
      var nS = this.container.querySelector('#c2-n');
      if (aS) aS.value = 3;
      if (dS) dS.value = 4;
      if (nS) nS.value = 6;
      var aL = this.container.querySelector('#c2-a-val');
      var dL = this.container.querySelector('#c2-d-val');
      var nL = this.container.querySelector('#c2-n-val');
      if (aL) aL.textContent = '3';
      if (dL) dL.textContent = '4';
      if (nL) nL.textContent = '6';
      this.update();
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c2-svg') : null;
      var terms = [];
      for (var i = 1; i <= this.n; i++) {
        terms.push(this.a + (i - 1) * this.d);
      }

      var currentTn = terms[this.n - 1];
      var c = this.a - this.d; // y-intercept: y = dx + c

      if (svg) {
        var minVal = Math.min.apply(null, terms.concat([0, c]));
        var maxVal = Math.max.apply(null, terms.concat([0, c]));
        var valRange = Math.max(maxVal - minVal, 10);

        var plotX0 = 50;
        var plotX1 = 430;
        var plotY0 = 20;
        var plotY1 = 195;

        var getX = function(idx) {
          return plotX0 + ((idx - 1) / 9) * (plotX1 - plotX0);
        };
        var getY = function(val) {
          return plotY1 - ((val - minVal) / valRange) * (plotY1 - plotY0);
        };

        var zeroY = getY(0);

        // Build points and slope triangle
        var pointsSvg = [];
        for (var k = 0; k < terms.length; k++) {
          var px = getX(k + 1);
          var py = getY(terms[k]);
          var isLast = (k === terms.length - 1);
          pointsSvg.push(`
            <circle cx="${px}" cy="${py}" r="${isLast ? 6 : 4.5}" fill="${isLast ? '#0284c7' : '#3b82f6'}" stroke="#ffffff" stroke-width="2" />
            <text x="${px}" y="${py - 9}" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">(${k+1}, ${terms[k]})</text>
          `);
        }

        // Draw straight line from x=1 to x=10
        var lineX1 = getX(1);
        var lineY1 = getY(terms[0]);
        var lineX2 = getX(10);
        var lineY2 = getY(this.a + 9 * this.d);

        // Slope triangle between term 1 and term 2
        var t1x = getX(1);
        var t1y = getY(terms[0]);
        var t2x = getX(2);
        var t2y = getY(terms[1]);

        svg.innerHTML = `
          <!-- Axes -->
          <line x1="${plotX0 - 15}" y1="${zeroY}" x2="${plotX1 + 15}" y2="${zeroY}" stroke="#cbd5e1" stroke-width="1.5" />
          <line x1="${plotX0}" y1="${plotY1 + 10}" x2="${plotX0}" y2="${plotY0 - 10}" stroke="#cbd5e1" stroke-width="1.5" />
          <text x="${plotX1 + 20}" y="${zeroY + 4}" font-size="11" fill="#64748b">n</text>
          <text x="${plotX0 - 5}" y="${plotY0 - 5}" font-size="11" text-anchor="end" fill="#64748b">t_n</text>

          <!-- Fitted Linear Line -->
          <line x1="${lineX1}" y1="${lineY1}" x2="${lineX2}" y2="${lineY2}" stroke="#93c5fd" stroke-width="2.5" stroke-dasharray="6,4" />

          <!-- Delta slope right triangle -->
          <line x1="${t1x}" y1="${t1y}" x2="${t2x}" y2="${t1y}" stroke="#f59e0b" stroke-width="2" />
          <line x1="${t2x}" y1="${t1y}" x2="${t2x}" y2="${t2y}" stroke="#f59e0b" stroke-width="2" />
          <text x="${(t1x + t2x)/2}" y="${t1y + (this.d >= 0 ? 14 : -6)}" text-anchor="middle" font-size="10" font-weight="bold" fill="#d97706">Δn = 1</text>
          <text x="${t2x + 8}" y="${(t1y + t2y)/2 + 4}" font-size="10" font-weight="bold" fill="#d97706">Δt = ${this.d}</text>

          <!-- AP Points -->
          ${pointsSvg.join('')}
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        var signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
        readout.innerHTML = `
          <strong>AP Parameters:</strong> a = ${this.a}, d = ${this.d} &middot; Current term <strong>t<sub>${this.n}</sub> = ${currentTn}</strong><br>
          <strong>General Formula:</strong> t<sub>n</sub> = ${this.a} + (n - 1)(${this.d}) = <strong>${this.d}n ${signC}</strong><br>
          <strong>Linear Polynomial:</strong> Continuous Line equation <em>y = ${this.d}x ${signC}</em> with slope <strong>m = ${this.d}</strong>.
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        verdict.innerHTML = `✓ <strong>Linearity Equivalence:</strong> Every Arithmetic Progression is simply a discrete linear function sampled at integer inputs! The common difference d is geometrically identical to the line's slope (Δy / Δx).`;
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 3: Āryabhaṭa Reversal & Triangular Dot Array Lab
  // -------------------------------------------------------------
  engines['sim-concept-3'] = {
    n: 6,
    paired: true,
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
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Āryabhaṭa Reversal & Triangular Dot Array Lab</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Rotate and pair two triangular arrays to form an n × (n+1) rectangle, visually proving 2Sₙ = n(n+1).</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c3-svg" width="460" height="230" viewBox="0 0 460 230" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c3-play" class="btn btn-sm">▶ Play</button>
            <button id="c3-pause" class="btn btn-sm">⏸ Pause</button>
            <button id="c3-step" class="btn btn-sm">⏭ Step</button>
            <button id="c3-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              <input type="checkbox" id="c3-paired" checked style="vertical-align: middle;">
              Pair Reversal (Āryabhaṭa Rectangle)
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Size n: <span id="c3-n-val">6</span>
              <input type="range" id="c3-n" min="2" max="10" value="6" style="vertical-align: middle; width: 70px;">
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
      var pairedCb = this.container.querySelector('#c3-paired');
      var nSlider = this.container.querySelector('#c3-n');

      if (playBtn) playBtn.addEventListener('click', function() { self.play(); });
      if (pauseBtn) pauseBtn.addEventListener('click', function() { self.pause(); });
      if (stepBtn) stepBtn.addEventListener('click', function() { self.step(); });
      if (resetBtn) resetBtn.addEventListener('click', function() { self.reset(); });

      if (pairedCb) {
        pairedCb.addEventListener('change', function(e) {
          self.paired = e.target.checked;
          self.update();
        });
      }

      if (nSlider) {
        nSlider.addEventListener('input', function(e) {
          self.n = parseInt(e.target.value, 10);
          var lbl = self.container.querySelector('#c3-n-val');
          if (lbl) lbl.textContent = self.n;
          self.update();
        });
      }
    },

    play: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      this.timer = setInterval(function() {
        if (self.n < 10) self.n++;
        else self.n = 2;
        var slider = self.container.querySelector('#c3-n');
        var lbl = self.container.querySelector('#c3-n-val');
        if (slider) slider.value = self.n;
        if (lbl) lbl.textContent = self.n;
        self.update();
      }, 800);
    },

    pause: function() {
      this.playing = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    step: function() {
      this.pause();
      if (this.n < 10) this.n++;
      else this.n = 2;
      var slider = this.container.querySelector('#c3-n');
      var lbl = this.container.querySelector('#c3-n-val');
      if (slider) slider.value = this.n;
      if (lbl) lbl.textContent = this.n;
      this.update();
    },

    reset: function() {
      this.pause();
      this.n = 6;
      this.paired = true;
      var slider = this.container.querySelector('#c3-n');
      var lbl = this.container.querySelector('#c3-n-val');
      var cb = this.container.querySelector('#c3-paired');
      if (slider) slider.value = 6;
      if (lbl) lbl.textContent = '6';
      if (cb) cb.checked = true;
      this.update();
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c3-svg') : null;
      var n = this.n;
      var sum = (n * (n + 1)) / 2;
      var rectTotal = n * (n + 1);

      if (svg) {
        var gridSpacing = Math.min(22, Math.floor(180 / (n + 1)));
        var r = Math.max(4, gridSpacing / 3.2);

        var startX = 230 - ((n + 1) * gridSpacing) / 2;
        var startY = 115 - (n * gridSpacing) / 2;

        var dotsSvg = [];

        // Row r: 0 to n-1 (representing row lengths 1 to n)
        for (var row = 0; row < n; row++) {
          var y = startY + row * gridSpacing;
          var originalCols = row + 1;

          // Original triangle dots (Blue)
          for (var col = 0; col < originalCols; col++) {
            var x = startX + col * gridSpacing;
            dotsSvg.push(`
              <circle cx="${x}" cy="${y}" r="${r}" fill="#0284c7" />
            `);
          }

          // Paired complementary dots (Orange)
          if (this.paired) {
            var pairedCols = (n + 1) - originalCols;
            for (var pcol = 0; pcol < pairedCols; pcol++) {
              var px = startX + (originalCols + pcol) * gridSpacing;
              dotsSvg.push(`
                <circle cx="${px}" cy="${y}" r="${r}" fill="#f97316" />
              `);
            }
          }
        }

        var rectBorder = '';
        if (this.paired) {
          var rw = (n + 1) * gridSpacing;
          var rh = n * gridSpacing;
          rectBorder = `
            <rect x="${startX - gridSpacing/2}" y="${startY - gridSpacing/2}" width="${rw}" height="${rh}" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3" rx="6" />
            <text x="${startX + rw/2 - gridSpacing/2}" y="${startY - gridSpacing/2 - 8}" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">Width = n + 1 = ${n + 1}</text>
            <text x="${startX - gridSpacing/2 - 12}" y="${startY + rh/2 - gridSpacing/2}" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569" transform="rotate(-90, ${startX - gridSpacing/2 - 12}, ${startY + rh/2 - gridSpacing/2})">Height = n = ${n}</text>
          `;
        }

        svg.innerHTML = `
          ${rectBorder}
          ${dotsSvg.join('')}
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        if (this.paired) {
          readout.innerHTML = `
            <strong>Āryabhaṭa Dot Arrangement:</strong> Height n = <strong>${n}</strong> &middot; Width = n + 1 = <strong>${n + 1}</strong><br>
            <strong>Combined Rectangle Dots:</strong> n × (n + 1) = ${n} × ${n + 1} = <strong>${rectTotal} dots</strong><br>
            <strong>Single Triangular Sum:</strong> S<sub>${n}</sub> = ${rectTotal} / 2 = <strong>${sum}</strong> (1 + 2 + ... + ${n} = ${sum})
          `;
        } else {
          readout.innerHTML = `
            <strong>Triangular Dot Array:</strong> Base size n = <strong>${n}</strong><br>
            <strong>Total Dots in Triangle:</strong> T<sub>${n}</sub> = 1 + 2 + ... + ${n} = <strong>${sum}</strong>
          `;
        }
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        verdict.innerHTML = `✓ <strong>Geometric Proof of Sum Formula:</strong> Āryabhaṭa (c. 499 CE) recognized that pairing a sequence with its reversed copy yields identical row sums of (n+1). Since 2 copies equal an n × (n+1) grid, Sₙ = n(n+1)/2!`;
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 4: GP Exponential Growth & Bouncing Ball Simulator
  // -------------------------------------------------------------
  engines['sim-concept-4'] = {
    h0: 80,
    r: 0.6,
    bounce: 3,
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
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">GP Exponential Growth & Bouncing Ball Simulator</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Observe geometric decay as a ball rebounds to 60% of each prior height, calculating peak heights and total vertical distance.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c4-svg" width="460" height="230" viewBox="0 0 460 230" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c4-play" class="btn btn-sm">▶ Play</button>
            <button id="c4-pause" class="btn btn-sm">⏸ Pause</button>
            <button id="c4-step" class="btn btn-sm">⏭ Step</button>
            <button id="c4-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Drop H₀: <span id="c4-h0-val">80</span>m
              <input type="range" id="c4-h0" min="20" max="100" value="80" style="vertical-align: middle; width: 65px;">
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Rebound r: <span id="c4-r-val">0.60</span>
              <input type="range" id="c4-r" min="0.3" max="0.8" step="0.05" value="0.6" style="vertical-align: middle; width: 65px;">
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Bounce n: <span id="c4-b-val">3</span>
              <input type="range" id="c4-bounce" min="0" max="6" value="3" style="vertical-align: middle; width: 60px;">
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c4-play');
      var pauseBtn = this.container.querySelector('#c4-pause');
      var stepBtn = this.container.querySelector('#c4-step');
      var resetBtn = this.container.querySelector('#c4-reset');
      var h0Slider = this.container.querySelector('#c4-h0');
      var rSlider = this.container.querySelector('#c4-r');
      var bSlider = this.container.querySelector('#c4-bounce');

      if (playBtn) playBtn.addEventListener('click', function() { self.play(); });
      if (pauseBtn) pauseBtn.addEventListener('click', function() { self.pause(); });
      if (stepBtn) stepBtn.addEventListener('click', function() { self.step(); });
      if (resetBtn) resetBtn.addEventListener('click', function() { self.reset(); });

      if (h0Slider) {
        h0Slider.addEventListener('input', function(e) {
          self.h0 = parseFloat(e.target.value);
          var lbl = self.container.querySelector('#c4-h0-val');
          if (lbl) lbl.textContent = self.h0;
          self.update();
        });
      }

      if (rSlider) {
        rSlider.addEventListener('input', function(e) {
          self.r = parseFloat(e.target.value);
          var lbl = self.container.querySelector('#c4-r-val');
          if (lbl) lbl.textContent = self.r.toFixed(2);
          self.update();
        });
      }

      if (bSlider) {
        bSlider.addEventListener('input', function(e) {
          self.bounce = parseInt(e.target.value, 10);
          var lbl = self.container.querySelector('#c4-b-val');
          if (lbl) lbl.textContent = self.bounce;
          self.update();
        });
      }
    },

    play: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      this.timer = setInterval(function() {
        if (self.bounce < 6) self.bounce++;
        else self.bounce = 0;
        var slider = self.container.querySelector('#c4-bounce');
        var lbl = self.container.querySelector('#c4-b-val');
        if (slider) slider.value = self.bounce;
        if (lbl) lbl.textContent = self.bounce;
        self.update();
      }, 900);
    },

    pause: function() {
      this.playing = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    step: function() {
      this.pause();
      if (this.bounce < 6) this.bounce++;
      else this.bounce = 0;
      var slider = this.container.querySelector('#c4-bounce');
      var lbl = this.container.querySelector('#c4-b-val');
      if (slider) slider.value = this.bounce;
      if (lbl) lbl.textContent = this.bounce;
      this.update();
    },

    reset: function() {
      this.pause();
      this.h0 = 80;
      this.r = 0.6;
      this.bounce = 3;
      var h0S = this.container.querySelector('#c4-h0');
      var rS = this.container.querySelector('#c4-r');
      var bS = this.container.querySelector('#c4-bounce');
      if (h0S) h0S.value = 80;
      if (rS) rS.value = 0.6;
      if (bS) bS.value = 3;
      var h0L = this.container.querySelector('#c4-h0-val');
      var rL = this.container.querySelector('#c4-r-val');
      var bL = this.container.querySelector('#c4-b-val');
      if (h0L) h0L.textContent = '80';
      if (rL) rL.textContent = '0.60';
      if (bL) bL.textContent = '3';
      this.update();
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c4-svg') : null;
      var groundY = 195;
      var scaleY = 1.6; // pixels per metre

      var heights = [this.h0];
      var totalDistance = this.h0;
      for (var k = 1; k <= 6; k++) {
        var hk = this.h0 * Math.pow(this.r, k);
        heights.push(hk);
        if (k <= this.bounce) {
          totalDistance += 2 * hk;
        }
      }

      var currentH = this.h0 * Math.pow(this.r, this.bounce);

      if (svg) {
        var startX = 40;
        var bounceWidth = 60;

        var pathsSvg = [];
        // Initial vertical drop
        var dropX = startX;
        var dropTopY = groundY - this.h0 * scaleY;
        pathsSvg.push(`
          <line x1="${dropX}" y1="${dropTopY}" x2="${dropX}" y2="${groundY}" stroke="#0284c7" stroke-width="2.5" />
          <circle cx="${dropX}" cy="${dropTopY}" r="7" fill="#0284c7" />
          <text x="${dropX - 6}" y="${dropTopY - 8}" font-size="11" font-weight="bold" fill="#0369a1">h₀=${this.h0}m</text>
        `);

        // Successive bounce parabolic arcs
        for (var b = 1; b <= 6; b++) {
          var bx0 = startX + (b - 1) * bounceWidth;
          var bx1 = startX + b * bounceWidth;
          var midX = (bx0 + bx1) / 2;
          var peakH = heights[b];
          var peakY = groundY - peakH * scaleY;
          var isActive = (b <= this.bounce);
          var strokeColor = isActive ? '#0284c7' : '#cbd5e1';
          var strokeWidth = isActive ? 2.5 : 1.5;

          // Parabolic Bezier arc
          pathsSvg.push(`
            <path d="M ${bx0} ${groundY} Q ${midX} ${peakY - (peakH * scaleY)} ${bx1} ${groundY}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
            <circle cx="${midX}" cy="${peakY}" r="${b === this.bounce ? 6 : 4}" fill="${isActive ? '#f59e0b' : '#e2e8f0'}" stroke="#ffffff" stroke-width="1.5" />
            <text x="${midX}" y="${peakY - 7}" text-anchor="middle" font-size="10" font-weight="${b === this.bounce ? 'bold' : 'normal'}" fill="${isActive ? '#1e293b' : '#94a3b8'}">${peakH.toFixed(2)}m</text>
            <text x="${bx1}" y="${groundY + 14}" text-anchor="middle" font-size="9" fill="#64748b">Hit ${b}</text>
          `);
        }

        svg.innerHTML = `
          <!-- Ground Line -->
          <line x1="20" y1="${groundY}" x2="440" y2="${groundY}" stroke="#475569" stroke-width="2" />
          <!-- Arcs & Labels -->
          ${pathsSvg.join('')}
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        readout.innerHTML = `
          <strong>Drop Height:</strong> h₀ = ${this.h0} m &middot; <strong>Common Ratio:</strong> r = ${this.r.toFixed(2)} (60% rebound)<br>
          <strong>Bounce ${this.bounce} Peak:</strong> h<sub>${this.bounce}</sub> = ${this.h0} × (${this.r.toFixed(2)})<sup>${this.bounce}</sup> = <strong>${currentH.toFixed(4)} m</strong><br>
          <strong>Total Vertical Distance:</strong> By hit ${this.bounce + 1} = <strong>${totalDistance.toFixed(4)} metres</strong>
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        var infiniteSum = this.h0 * (1 + this.r) / (1 - this.r);
        verdict.innerHTML = `✓ <strong>Geometric Series Convergence:</strong> Because the rebound ratio |r| = 0.60 < 1, the infinite sum of bounce heights converges to a finite boundary: Total Vertical Limit = h₀ · (1 + r)/(1 - r) = ${this.h0} · 1.6 / 0.4 = <strong>${infiniteSum.toFixed(1)} metres</strong>!`;
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 5: Sierpiński Fractal Zoomer & Stage Stepper
  // -------------------------------------------------------------
  engines['sim-concept-5'] = {
    fractal: 'carpet', // 'carpet' or 'triangle'
    stage: 2,
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
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Sierpiński Fractal Zoomer & Stage Stepper</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Explore how recursive geometric division simultaneously creates an infinite count of shapes with zero limiting area.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c5-svg" width="460" height="230" viewBox="0 0 460 230" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c5-play" class="btn btn-sm">▶ Play</button>
            <button id="c5-pause" class="btn btn-sm">⏸ Pause</button>
            <button id="c5-step" class="btn btn-sm">⏭ Step</button>
            <button id="c5-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Fractal:
              <select id="c5-type" style="font-size: 0.85rem; padding: 2px 6px;">
                <option value="carpet">Sierpiński Carpet (Factor 8)</option>
                <option value="triangle">Sierpiński Triangle (Factor 3)</option>
              </select>
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Stage: <span id="c5-st-val">2</span>
              <input type="range" id="c5-stage" min="0" max="3" value="2" style="vertical-align: middle; width: 70px;">
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c5-play');
      var pauseBtn = this.container.querySelector('#c5-pause');
      var stepBtn = this.container.querySelector('#c5-step');
      var resetBtn = this.container.querySelector('#c5-reset');
      var typeSelect = this.container.querySelector('#c5-type');
      var stSlider = this.container.querySelector('#c5-stage');

      if (playBtn) playBtn.addEventListener('click', function() { self.play(); });
      if (pauseBtn) pauseBtn.addEventListener('click', function() { self.pause(); });
      if (stepBtn) stepBtn.addEventListener('click', function() { self.step(); });
      if (resetBtn) resetBtn.addEventListener('click', function() { self.reset(); });

      if (typeSelect) {
        typeSelect.addEventListener('change', function(e) {
          self.fractal = e.target.value;
          self.update();
        });
      }

      if (stSlider) {
        stSlider.addEventListener('input', function(e) {
          self.stage = parseInt(e.target.value, 10);
          var lbl = self.container.querySelector('#c5-st-val');
          if (lbl) lbl.textContent = self.stage;
          self.update();
        });
      }
    },

    play: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      this.timer = setInterval(function() {
        if (self.stage < 3) self.stage++;
        else self.stage = 0;
        var slider = self.container.querySelector('#c5-stage');
        var lbl = self.container.querySelector('#c5-st-val');
        if (slider) slider.value = self.stage;
        if (lbl) lbl.textContent = self.stage;
        self.update();
      }, 1000);
    },

    pause: function() {
      this.playing = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    step: function() {
      this.pause();
      if (this.stage < 3) this.stage++;
      else this.stage = 0;
      var slider = this.container.querySelector('#c5-stage');
      var lbl = this.container.querySelector('#c5-st-val');
      if (slider) slider.value = this.stage;
      if (lbl) lbl.textContent = this.stage;
      this.update();
    },

    reset: function() {
      this.pause();
      this.stage = 0;
      var slider = this.container.querySelector('#c5-stage');
      var lbl = this.container.querySelector('#c5-st-val');
      if (slider) slider.value = 0;
      if (lbl) lbl.textContent = '0';
      this.update();
    },

    drawCarpet: function(x, y, size, depth, out) {
      if (depth === 0) {
        out.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#dc2626" rx="1" />`);
        return;
      }
      var s = size / 3;
      for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
          if (row === 1 && col === 1) {
            // center hole removed
            out.push(`<rect x="${x + s}" y="${y + s}" width="${s}" height="${s}" fill="#ffffff" />`);
          } else {
            this.drawCarpet(x + col * s, y + row * s, s, depth - 1, out);
          }
        }
      }
    },

    drawTriangle: function(x1, y1, x2, y2, x3, y3, depth, out) {
      if (depth === 0) {
        out.push(`<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="#0284c7" />`);
        return;
      }
      var m12x = (x1 + x2) / 2, m12y = (y1 + y2) / 2;
      var m23x = (x2 + x3) / 2, m23y = (y2 + y3) / 2;
      var m31x = (x3 + x1) / 2, m31y = (y3 + y1) / 2;

      // central triangle cut out (white)
      out.push(`<polygon points="${m12x},${m12y} ${m23x},${m23y} ${m31x},${m31y}" fill="#ffffff" />`);

      this.drawTriangle(x1, y1, m12x, m12y, m31x, m31y, depth - 1, out);
      this.drawTriangle(m12x, m12y, x2, y2, m23x, m23y, depth - 1, out);
      this.drawTriangle(m31x, m31y, m23x, m23y, x3, y3, depth - 1, out);
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c5-svg') : null;
      var shapesCount = 0;
      var areaFraction = '';
      var areaDecimal = 0;

      if (this.fractal === 'carpet') {
        shapesCount = Math.pow(8, this.stage);
        areaDecimal = Math.pow(8 / 9, this.stage);
        areaFraction = `(8/9)<sup>${this.stage}</sup> = ${(Math.pow(8, this.stage))}/${(Math.pow(9, this.stage))}`;
      } else {
        shapesCount = Math.pow(3, this.stage);
        areaDecimal = Math.pow(3 / 4, this.stage);
        areaFraction = `(3/4)<sup>${this.stage}</sup> = ${(Math.pow(3, this.stage))}/${(Math.pow(4, this.stage))}`;
      }

      if (svg) {
        var elements = [];
        if (this.fractal === 'carpet') {
          var carpetSize = 190;
          var cx = 230 - carpetSize / 2;
          var cy = 115 - carpetSize / 2;
          this.drawCarpet(cx, cy, carpetSize, this.stage, elements);
        } else {
          var tx1 = 230, ty1 = 15;
          var tx2 = 130, ty2 = 215;
          var tx3 = 330, ty3 = 215;
          this.drawTriangle(tx1, ty1, tx2, ty2, tx3, ty3, this.stage, elements);
        }

        svg.innerHTML = `
          ${elements.join('')}
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        var typeName = this.fractal === 'carpet' ? 'Sierpiński Carpet' : 'Sierpiński Triangle';
        readout.innerHTML = `
          <strong>Fractal:</strong> ${typeName} &middot; <strong>Stage:</strong> n = ${this.stage}<br>
          <strong>Remaining Unit Shapes (GP):</strong> S<sub>${this.stage}</sub> = <strong>${shapesCount.toLocaleString()}</strong><br>
          <strong>Total Retained Area (GP):</strong> Area = ${areaFraction} ≈ <strong>${(areaDecimal * 100).toFixed(2)}%</strong>
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        verdict.innerHTML = `✓ <strong>Fractal Geometric Progressions:</strong> At each stage, the number of self-similar units multiplies by a constant ratio (> 1), while the total area multiplies by a constant ratio (< 1). In the infinite limit, Count → ∞ while Area → 0!`;
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 6: AP/GP Dual Solver & Consecutive Partition Explorer
  // -------------------------------------------------------------
  engines['sim-concept-6'] = {
    targetSum: 100,
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
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Consecutive Sum Partition Explorer (End-of-Chapter Q6)</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Express target integer N as the sum of consecutive positive integers by analyzing odd divisors of 2N.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c6-svg" width="460" height="230" viewBox="0 0 460 230" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c6-play" class="btn btn-sm">▶ Play</button>
            <button id="c6-pause" class="btn btn-sm">⏸ Pause</button>
            <button id="c6-step" class="btn btn-sm">⏭ Step</button>
            <button id="c6-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Target Sum N: <span id="c6-n-val">100</span>
              <input type="range" id="c6-n" min="15" max="150" step="5" value="100" style="vertical-align: middle; width: 100px;">
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c6-play');
      var pauseBtn = this.container.querySelector('#c6-pause');
      var stepBtn = this.container.querySelector('#c6-step');
      var resetBtn = this.container.querySelector('#c6-reset');
      var nSlider = this.container.querySelector('#c6-n');

      if (playBtn) playBtn.addEventListener('click', function() { self.play(); });
      if (pauseBtn) pauseBtn.addEventListener('click', function() { self.pause(); });
      if (stepBtn) stepBtn.addEventListener('click', function() { self.step(); });
      if (resetBtn) resetBtn.addEventListener('click', function() { self.reset(); });

      if (nSlider) {
        nSlider.addEventListener('input', function(e) {
          self.targetSum = parseInt(e.target.value, 10);
          var lbl = self.container.querySelector('#c6-n-val');
          if (lbl) lbl.textContent = self.targetSum;
          self.update();
        });
      }
    },

    getPartitions: function(N) {
      // Find all k >= 2 such that k(2m + k - 1) = 2N with m >= 1
      var partitions = [];
      var doubleN = 2 * N;
      for (var k = 2; k * (k + 1) / 2 <= N; k++) {
        var rem = doubleN - k * (k - 1);
        if (rem % (2 * k) === 0) {
          var m = rem / (2 * k);
          if (m >= 1) {
            var terms = [];
            for (var i = 0; i < k; i++) terms.push(m + i);
            partitions.push({ k: k, m: m, terms: terms });
          }
        }
      }
      return partitions;
    },

    play: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      var targets = [45, 50, 60, 75, 100, 105, 120];
      var idx = 0;
      this.timer = setInterval(function() {
        self.targetSum = targets[idx % targets.length];
        idx++;
        var slider = self.container.querySelector('#c6-n');
        var lbl = self.container.querySelector('#c6-n-val');
        if (slider) slider.value = self.targetSum;
        if (lbl) lbl.textContent = self.targetSum;
        self.update();
      }, 1200);
    },

    pause: function() {
      this.playing = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    step: function() {
      this.pause();
      if (this.targetSum < 150) this.targetSum += 5;
      else this.targetSum = 15;
      var slider = this.container.querySelector('#c6-n');
      var lbl = this.container.querySelector('#c6-n-val');
      if (slider) slider.value = this.targetSum;
      if (lbl) lbl.textContent = this.targetSum;
      this.update();
    },

    reset: function() {
      this.pause();
      this.targetSum = 100;
      var slider = this.container.querySelector('#c6-n');
      var lbl = this.container.querySelector('#c6-n-val');
      if (slider) slider.value = 100;
      if (lbl) lbl.textContent = '100';
      this.update();
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c6-svg') : null;
      var N = this.targetSum;
      var partitions = this.getPartitions(N);

      if (svg) {
        var svgLines = [];
        if (partitions.length === 0) {
          svgLines.push(`
            <text x="230" y="115" text-anchor="middle" font-size="14" fill="#94a3b8">
              ${N} is a power of 2: cannot be written as a sum of ≥ 2 consecutive integers!
            </text>
          `);
        } else {
          var startY = 30;
          var rowSpacing = Math.min(50, Math.floor(180 / partitions.length));

          for (var p = 0; p < partitions.length; p++) {
            var part = partitions[p];
            var y = startY + p * rowSpacing;
            var textRep = part.terms.join(' + ') + ' = ' + N;
            var labelText = `k=${part.k} terms (starts at ${part.m}):`;

            svgLines.push(`
              <text x="25" y="${y}" font-size="11" font-weight="bold" fill="#0369a1">${labelText}</text>
              <rect x="25" y="${y + 6}" width="410" height="24" fill="#f0f9ff" stroke="#bae6fd" rx="4" />
              <text x="230" y="${y + 22}" text-anchor="middle" font-size="11" font-weight="bold" fill="#0284c7">${textRep}</text>
            `);
          }
        }

        svg.innerHTML = svgLines.join('');
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        var partsStr = partitions.map(function(p) {
          return `(${p.terms.join(' + ')})`;
        }).join(', ');
        readout.innerHTML = `
          <strong>Target Sum:</strong> N = ${N} (2N = ${2 * N}) &middot; <strong>Consecutive Representations:</strong> ${partitions.length}<br>
          <strong>Valid Partitions:</strong> ${partitions.length > 0 ? partsStr : 'None (power of 2)'}
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        if (partitions.length > 0) {
          verdict.innerHTML = `✓ <strong>Number Theory of Arithmetic Progressions:</strong> The number of ways to express N as the sum of consecutive positive integers equals the number of odd divisors of N strictly greater than 1! For 100, odd factors of 200 are {5, 25}, yielding exactly 2 solutions!`;
        } else {
          verdict.innerHTML = `✓ <strong>Powers of 2 Theorem:</strong> If N has no odd factor > 1 (i.e. N = 2ᵏ), it is mathematically impossible to partition N into consecutive positive integers!`;
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
