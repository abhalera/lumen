// Class 9 Mathematics Chapter 7: The Mathematics of Maybe - Introduction to Probability
// Pure offline interactive simulation engines with standard timeline controls.

window.SimEngine = (function() {
  'use strict';

  var engines = {};

  // -------------------------------------------------------------
  // Engine 1: Probability Scale & Colored Card Deck Meter
  // -------------------------------------------------------------
  engines['sim-concept-1'] = {
    purpleCount: 3,
    totalCards: 6,
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
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">The 0-to-1 Probability Scale & Card Deck Meter</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Adjust the composition of a 6-card deck and watch the likelihood needle traverse from Impossible (0) to Certain (1).</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c1-svg" width="380" height="220" viewBox="0 0 380 220" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c1-play" class="btn btn-sm">▶ Play</button>
            <button id="c1-pause" class="btn btn-sm">⏸ Pause</button>
            <button id="c1-step" class="btn btn-sm">⏭ Step</button>
            <button id="c1-reset" class="btn btn-sm">↺ Reset</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Purple Cards: <span id="c1-purple-val">3</span> / 6
              <input type="range" id="c1-purple" min="0" max="6" value="3" style="vertical-align: middle; width: 90px;">
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
      var purpleSlider = this.container.querySelector('#c1-purple');

      if (playBtn) playBtn.onclick = function() { self.play(); };
      if (pauseBtn) pauseBtn.onclick = function() { self.pause(); };
      if (stepBtn) stepBtn.onclick = function() { self.step(); };
      if (resetBtn) resetBtn.onclick = function() { self.reset(); };

      if (purpleSlider) purpleSlider.oninput = function(e) {
        self.purpleCount = parseInt(e.target.value, 10);
        var lbl = self.container.querySelector('#c1-purple-val');
        if (lbl) lbl.textContent = self.purpleCount;
        self.update();
      };
    },

    play: function() {
      if (this.playing) return;
      this.playing = true;
      var self = this;
      var dir = 1;
      this.timer = setInterval(function() {
        self.purpleCount += dir;
        if (self.purpleCount >= 6) dir = -1;
        if (self.purpleCount <= 0) dir = 1;
        var sld = self.container ? self.container.querySelector('#c1-purple') : null;
        var lbl = self.container ? self.container.querySelector('#c1-purple-val') : null;
        if (sld) sld.value = self.purpleCount;
        if (lbl) lbl.textContent = self.purpleCount;
        self.update();
      }, 700);
    },

    pause: function() {
      this.playing = false;
      if (this.timer) clearInterval(this.timer);
    },

    step: function() {
      this.purpleCount = (this.purpleCount + 1) % 7;
      var sld = this.container ? this.container.querySelector('#c1-purple') : null;
      var lbl = this.container ? this.container.querySelector('#c1-purple-val') : null;
      if (sld) sld.value = this.purpleCount;
      if (lbl) lbl.textContent = this.purpleCount;
      this.update();
    },

    reset: function() {
      this.pause();
      this.purpleCount = 3;
      var sld = this.container ? this.container.querySelector('#c1-purple') : null;
      var lbl = this.container ? this.container.querySelector('#c1-purple-val') : null;
      if (sld) sld.value = 3;
      if (lbl) lbl.textContent = '3';
      this.update();
    },

    update: function() {
      var p = this.purpleCount / this.totalCards;
      var greenCount = this.totalCards - this.purpleCount;

      var label = "Even Chance";
      var color = "#0284c7";
      if (this.purpleCount === 0) {
        label = "Impossible (P = 0)";
        color = "#ef4444";
      } else if (this.purpleCount < 3) {
        label = "Less Likely / Unlikely";
        color = "#f97316";
      } else if (this.purpleCount === 3) {
        label = "Equally Likely / Even Chance (P = 0.5)";
        color = "#0284c7";
      } else if (this.purpleCount < 6) {
        label = "More Likely / Probable";
        color = "#10b981";
      } else {
        label = "Certain (P = 1)";
        color = "#16a34a";
      }

      var svg = this.container ? this.container.querySelector('#c1-svg') : null;
      if (svg) {
        // Draw 6 cards in row
        var cardSvg = [];
        for (var i = 0; i < 6; i++) {
          var isPurple = i < this.purpleCount;
          var cFill = isPurple ? '#9333ea' : '#10b981';
          var cx = 55 + i * 48;
          cardSvg.push(`
            <rect x="${cx}" y="20" width="38" height="52" rx="4" fill="${cFill}" stroke="#0f172a" stroke-width="1.5"/>
            <text x="${cx + 19}" y="52" font-size="18" fill="#ffffff" font-weight="bold" text-anchor="middle">${isPurple ? 'P' : 'G'}</text>
          `);
        }

        // Horizontal probability scale from x=40 to x=340 (length 300)
        var scaleX = 40 + p * 300;

        svg.innerHTML = `
          <!-- 6 Deck Cards -->
          ${cardSvg.join('\n')}

          <!-- Probability Scale Bar -->
          <rect x="40" y="110" width="300" height="16" rx="8" fill="#e2e8f0"/>
          <rect x="40" y="110" width="${p * 300}" height="16" rx="8" fill="${color}" opacity="0.85"/>

          <!-- Scale Markers -->
          <line x1="40" y1="105" x2="40" y2="132" stroke="#ef4444" stroke-width="2.5"/>
          <text x="40" y="148" font-size="9" fill="#ef4444" font-weight="bold" text-anchor="middle">0 (Imp)</text>

          <line x1="190" y1="105" x2="190" y2="132" stroke="#0284c7" stroke-width="2.5"/>
          <text x="190" y="148" font-size="9" fill="#0284c7" font-weight="bold" text-anchor="middle">0.5 (Even)</text>

          <line x1="340" y1="105" x2="340" y2="132" stroke="#16a34a" stroke-width="2.5"/>
          <text x="340" y="148" font-size="9" fill="#16a34a" font-weight="bold" text-anchor="middle">1.0 (Cert)</text>

          <!-- Current Needle / Cursor -->
          <polygon points="${scaleX},100 ${scaleX - 6},88 ${scaleX + 6},88" fill="${color}"/>
          <circle cx="${scaleX}" cy="118" r="7" fill="#ffffff" stroke="${color}" stroke-width="3"/>
          <text x="${scaleX}" y="180" font-size="13" font-weight="bold" fill="${color}" text-anchor="middle">
            P(Purple) = ${this.purpleCount}/6 = ${p.toFixed(3)} (${(p * 100).toFixed(1)}%)
          </text>
          <text x="190" y="202" font-size="11" fill="#475569" font-weight="bold" text-anchor="middle">
            Status: ${label}
          </text>
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        readout.innerHTML = `
          <strong>Deck Composition:</strong> ${this.purpleCount} Purple, ${greenCount} Green (Total 6 cards)<br>
          <strong>Probability P(Purple):</strong> ${this.purpleCount}/6 = <strong>${p.toFixed(3)}</strong> (${(p * 100).toFixed(1)}%) &middot; <strong>P(Green):</strong> ${greenCount}/6 = <strong>${(1 - p).toFixed(3)}</strong>
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        verdict.innerHTML = `✓ <strong>Probability Scale Rule:</strong> Probabilities are strictly bounded in [0, 1]. When purple cards = 0, P = 0 (Impossible); when purple cards = 6, P = 1 (Certain); when purple = 3, P = 0.5 (Even Chance)!`;
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 2: Monte Carlo Coin Flip & Law of Large Numbers Convergence
  // -------------------------------------------------------------
  engines['sim-concept-2'] = {
    totalFlips: 100,
    headsCount: 52,
    history: [],
    playing: false,
    timer: null,

    init: function(container) {
      this.container = container;
      this.generateHistory();
      this.renderUI();
      this.update();
    },

    generateHistory: function() {
      this.history = [];
      var heads = 0;
      for (var i = 1; i <= this.totalFlips; i++) {
        if (Math.random() < 0.5) heads++;
        this.history.push({ n: i, heads: heads, freq: heads / i });
      }
      this.headsCount = heads;
    },

    renderUI: function() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="sim-wrapper" style="font-family: system-ui, sans-serif;">
          <div class="sim-header" style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Law of Large Numbers (LLN) Convergence Simulator</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Watch empirical relative frequency fluctuate wildly on small sample sizes, then flatten cleanly onto the 50% line.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #0f172a; border-radius: 8px; padding: 10px; border: 1px solid #334155;">
            <svg id="c2-svg" width="380" height="210" viewBox="0 0 380 210" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c2-play" class="btn btn-sm">▶ Re-flip Series</button>
            <button id="c2-reset" class="btn btn-sm">↺ Reset (N = 100)</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Sample Size N:
              <select id="c2-n" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
                <option value="20">N = 20 (High Fluctuation)</option>
                <option value="50">N = 50</option>
                <option value="100" selected>N = 100</option>
                <option value="300">N = 300</option>
                <option value="1000">N = 1000 (Smooth Convergence)</option>
              </select>
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c2-play');
      var resetBtn = this.container.querySelector('#c2-reset');
      var nSel = this.container.querySelector('#c2-n');

      if (playBtn) playBtn.onclick = function() {
        self.generateHistory();
        self.update();
      };
      if (resetBtn) resetBtn.onclick = function() {
        self.totalFlips = 100;
        if (nSel) nSel.value = '100';
        self.generateHistory();
        self.update();
      };
      if (nSel) nSel.onchange = function(e) {
        self.totalFlips = parseInt(e.target.value, 10);
        self.generateHistory();
        self.update();
      };
    },

    update: function() {
      var N = this.totalFlips;
      var svg = this.container ? this.container.querySelector('#c2-svg') : null;

      if (svg && this.history.length > 0) {
        // Chart bounds: x from 45 to 365 (width 320), y from 25 to 175 (height 150)
        // y: 0.0 at y=175, 1.0 at y=25, 0.5 at y=100
        var pts = [];
        var step = Math.max(1, Math.floor(N / 150));
        for (var i = 0; i < this.history.length; i += step) {
          var item = this.history[i];
          var x = 45 + (item.n / N) * 320;
          var y = 175 - item.freq * 150;
          pts.push(x.toFixed(1) + ',' + y.toFixed(1));
        }

        svg.innerHTML = `
          <!-- Grid lines -->
          <line x1="45" y1="25" x2="365" y2="25" stroke="#334155" stroke-dasharray="2,2"/>
          <text x="40" y="29" fill="#94a3b8" font-size="9" text-anchor="end">1.0</text>

          <line x1="45" y1="100" x2="365" y2="100" stroke="#f59e0b" stroke-dasharray="4,3" stroke-width="1.8"/>
          <text x="40" y="103" fill="#f59e0b" font-size="9" text-anchor="end" font-weight="bold">0.5</text>

          <line x1="45" y1="175" x2="365" y2="175" stroke="#334155"/>
          <text x="40" y="179" fill="#94a3b8" font-size="9" text-anchor="end">0.0</text>

          <!-- Axes -->
          <line x1="45" y1="25" x2="45" y2="175" stroke="#64748b" stroke-width="1.5"/>
          <text x="205" y="195" fill="#94a3b8" font-size="10" text-anchor="middle">Number of Tosses (Trials N = ${N})</text>

          <!-- Trajectory Polyline -->
          <polyline points="${pts.join(' ')}" fill="none" stroke="#38bdf8" stroke-width="2"/>

          <!-- End Point Indicator -->
          <circle cx="365" cy="${175 - (this.headsCount / N) * 150}" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
          <text x="365" y="${Math.max(35, 175 - (this.headsCount / N) * 150 - 8)}" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="end">
            ${(this.headsCount / N).toFixed(3)}
          </text>
        `;
      }

      var relFreq = this.headsCount / N;
      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        readout.innerHTML = `
          <strong>Empirical Results for N = ${N} Coin Flips:</strong><br>
          Heads: <strong>${this.headsCount}</strong> &middot; Tails: <strong>${N - this.headsCount}</strong><br>
          Experimental Relative Frequency: <strong>${relFreq.toFixed(4)}</strong> (${(relFreq * 100).toFixed(2)}%) &middot; Deviation from 0.5: <strong>${Math.abs(relFreq - 0.5).toFixed(4)}</strong>
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        if (N >= 300) {
          verdict.innerHTML = `✓ <strong>Law of Large Numbers in Action:</strong> For large N (${N}), random fluctuations average out, and relative frequency tightly hugs the theoretical line P = 0.50!`;
        } else {
          verdict.innerHTML = `• For small N (${N}), note the zig-zag fluctuations. Increase N to 300 or 1000 to see the convergence flatten smoothly.`;
        }
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 3: Classical Fair Dice & Card Probability Analyzer
  // -------------------------------------------------------------
  engines['sim-concept-3'] = {
    filter: 'even', // 'even', 'prime', 'gt4', 'three'
    playing: false,

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
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Theoretical Probability on a Fair 6-Sided Die</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Inspect Laplace's classical formula P(E) = n(E)/n(S) under strictly equally likely face outcomes.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c3-svg" width="380" height="170" viewBox="0 0 380 170" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: bold; color: #334155;">Select Event E:</span>
            <button id="c3-even" class="btn btn-sm">Even {2,4,6}</button>
            <button id="c3-prime" class="btn btn-sm">Prime {2,3,5}</button>
            <button id="c3-gt4" class="btn btn-sm">Greater than 4 {5,6}</button>
            <button id="c3-three" class="btn btn-sm">Face '3' {3}</button>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var btnEven = this.container.querySelector('#c3-even');
      var btnPrime = this.container.querySelector('#c3-prime');
      var btnGt4 = this.container.querySelector('#c3-gt4');
      var btnThree = this.container.querySelector('#c3-three');

      if (btnEven) btnEven.onclick = function() { self.filter = 'even'; self.update(); };
      if (btnPrime) btnPrime.onclick = function() { self.filter = 'prime'; self.update(); };
      if (btnGt4) btnGt4.onclick = function() { self.filter = 'gt4'; self.update(); };
      if (btnThree) btnThree.onclick = function() { self.filter = 'three'; self.update(); };
    },

    update: function() {
      var fav = [];
      var eventTitle = "";
      if (this.filter === 'even') {
        fav = [2, 4, 6];
        eventTitle = "Even Number: {2, 4, 6}";
      } else if (this.filter === 'prime') {
        fav = [2, 3, 5];
        eventTitle = "Prime Number: {2, 3, 5} (Note: 1 is not prime)";
      } else if (this.filter === 'gt4') {
        fav = [5, 6];
        eventTitle = "Number Greater than 4: {5, 6}";
      } else {
        fav = [3];
        eventTitle = "Rolling exactly Face 3: {3}";
      }

      var nFav = fav.length;
      var p = nFav / 6;

      var svg = this.container ? this.container.querySelector('#c3-svg') : null;
      if (svg) {
        var diceSvg = [];
        for (var i = 1; i <= 6; i++) {
          var isFav = fav.indexOf(i) !== -1;
          var x = 30 + (i - 1) * 56;
          var fill = isFav ? '#bbf7d0' : '#ffffff';
          var stroke = isFav ? '#16a34a' : '#cbd5e1';
          var strokeW = isFav ? '2.5' : '1.5';
          var textColor = isFav ? '#15803d' : '#94a3b8';

          diceSvg.push(`
            <rect x="${x}" y="30" width="46" height="46" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"/>
            <text x="${x + 23}" y="60" font-size="22" font-weight="bold" fill="${textColor}" text-anchor="middle">${i}</text>
            <text x="${x + 23}" y="92" font-size="10" font-weight="bold" fill="${isFav ? '#16a34a' : '#94a3b8'}" text-anchor="middle">
              ${isFav ? '✓ Fav' : '✗'}
            </text>
          `);
        }

        svg.innerHTML = `
          ${diceSvg.join('\n')}
          <text x="190" y="130" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">
            Event E: ${eventTitle}
          </text>
          <text x="190" y="152" font-size="14" font-weight="bold" fill="#15803d" text-anchor="middle">
            Theoretical P(E) = n(E)/n(S) = ${nFav}/6 = ${p.toFixed(3)} (${(p * 100).toFixed(1)}%)
          </text>
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        readout.innerHTML = `
          <strong>Sample Space S:</strong> {1, 2, 3, 4, 5, 6}, n(S) = 6<br>
          <strong>Favourable Outcomes n(E):</strong> ${nFav} &middot; <strong>Complement P(not E):</strong> 1 - ${nFav}/6 = <strong>${(6 - nFav)}/6</strong> (${((1 - p) * 100).toFixed(1)}%)
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        verdict.innerHTML = `✓ <strong>Laplace Classical Formula:</strong> Every face on an unbiased die has equal likelihood 1/6. The event probability equals the direct count ratio ${nFav}/6!`;
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 4: Gambler's Fallacy & School Survey Population Projection Lab
  // -------------------------------------------------------------
  engines['sim-concept-4'] = {
    streakLength: 5,
    sampleSize: 50,
    popSize: 1500,

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
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Gambler's Fallacy & Statistical Sampling Lab</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Test why prior streaks NEVER alter the next flip, and scale sample preferences across a 1,500 student population.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c4-svg" width="380" height="190" viewBox="0 0 380 190" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <label style="font-size: 0.85rem;">
              Consecutive Heads Streak: <span id="c4-streak-val">5</span>
              <input type="range" id="c4-streak" min="1" max="8" value="5" style="vertical-align: middle; width: 80px;">
            </label>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              School Population N:
              <select id="c4-pop" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
                <option value="800">800 Students</option>
                <option value="1500" selected>1500 Students</option>
                <option value="3000">3000 Students</option>
              </select>
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var streakSlider = this.container.querySelector('#c4-streak');
      var popSel = this.container.querySelector('#c4-pop');

      if (streakSlider) streakSlider.oninput = function(e) {
        self.streakLength = parseInt(e.target.value, 10);
        var lbl = self.container.querySelector('#c4-streak-val');
        if (lbl) lbl.textContent = self.streakLength;
        self.update();
      };
      if (popSel) popSel.onchange = function(e) {
        self.popSize = parseInt(e.target.value, 10);
        self.update();
      };
    },

    update: function() {
      var k = this.streakLength;
      var svg = this.container ? this.container.querySelector('#c4-svg') : null;

      if (svg) {
        // Draw k coins with 'H' and next coin with '?'
        var coinSvg = [];
        for (var i = 0; i < k; i++) {
          var cx = 35 + i * 36;
          coinSvg.push(`
            <circle cx="${cx}" cy="45" r="15" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
            <text x="${cx}" y="50" font-size="12" font-weight="bold" fill="#854d0e" text-anchor="middle">H</text>
          `);
        }
        var nextCx = 35 + k * 36 + 15;
        coinSvg.push(`
          <circle cx="${nextCx}" cy="45" r="17" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="3,2"/>
          <text x="${nextCx}" y="51" font-size="16" font-weight="bold" fill="#1e40af" text-anchor="middle">?</text>
          <text x="${nextCx}" y="78" font-size="9" fill="#1e40af" font-weight="bold" text-anchor="middle">Next Flip</text>
        `);

        // Sampling fruit bar chart: Mango (40%), Apple (30%), Banana (20%), Grapes (10%)
        var popM = Math.round(0.40 * this.popSize);
        var popA = Math.round(0.30 * this.popSize);
        var popB = Math.round(0.20 * this.popSize);

        svg.innerHTML = `
          <!-- Streak Section -->
          <text x="20" y="20" font-size="11" fill="#475569" font-weight="bold">Observed Streak: ${k} Heads in a row</text>
          ${coinSvg.join('\n')}

          <!-- Divider -->
          <line x1="20" y1="95" x2="360" y2="95" stroke="#cbd5e1" stroke-dasharray="3,3"/>

          <!-- Population Projection Section -->
          <text x="20" y="115" font-size="11" fill="#475569" font-weight="bold">
            Projected School Demand (N = ${this.popSize} students):
          </text>
          <rect x="25" y="128" width="${(popM / this.popSize) * 240}" height="14" fill="#f59e0b" rx="3"/>
          <text x="275" y="140" font-size="10" fill="#0f172a">Mango (40%): ${popM}</text>

          <rect x="25" y="148" width="${(popA / this.popSize) * 240}" height="14" fill="#ef4444" rx="3"/>
          <text x="275" y="160" font-size="10" fill="#0f172a">Apple (30%): ${popA}</text>

          <rect x="25" y="168" width="${(popB / this.popSize) * 240}" height="14" fill="#eab308" rx="3"/>
          <text x="275" y="180" font-size="10" fill="#0f172a">Banana (20%): ${popB}</text>
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        readout.innerHTML = `
          <strong>Next Flip Probability:</strong> P(Tails) = <strong>0.50 (50%)</strong> &middot; P(Heads) = <strong>0.50 (50%)</strong><br>
          <strong>Population Projection:</strong> Mangoes to buy = 0.40 × ${this.popSize} = <strong>${Math.round(0.40 * this.popSize)}</strong> &middot; Apples = <strong>${Math.round(0.30 * this.popSize)}</strong>
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        verdict.innerHTML = `✓ <strong>Gambler's Fallacy Busted:</strong> The coin has no memory! Even after ${k} consecutive Heads, Tails is NOT 'due'. P(Tails) remains strictly 0.50.`;
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 5: Multi-Stage Tree Diagram & Urn Sampling Explorer
  // -------------------------------------------------------------
  engines['sim-concept-5'] = {
    mode: 'coins', // 'coins' or 'urn'
    replacement: false,

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
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Multi-Stage Probability Tree Diagram Lab</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Trace branch multiplications and compound path additions for 2-step coins and urn draws.</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0;">
            <svg id="c5-svg" width="380" height="210" viewBox="0 0 380 210" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <label style="font-size: 0.85rem;">
              Experiment:
              <select id="c5-mode" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
                <option value="coins">Two Fair Coins {HH, HT, TH, TT}</option>
                <option value="urn">Urn (4 Red, 5 Blue Balls)</option>
              </select>
            </label>
            <label id="c5-replace-ctrl" style="font-size: 0.85rem; margin-left: 8px; display: none;">
              <input type="checkbox" id="c5-replace" style="vertical-align: middle;"> With Replacement
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var modeSel = this.container.querySelector('#c5-mode');
      var replaceChk = this.container.querySelector('#c5-replace');

      if (modeSel) modeSel.onchange = function(e) {
        self.mode = e.target.value;
        var rCtrl = self.container.querySelector('#c5-replace-ctrl');
        if (rCtrl) rCtrl.style.display = self.mode === 'urn' ? 'inline' : 'none';
        self.update();
      };
      if (replaceChk) replaceChk.onchange = function(e) {
        self.replacement = e.target.checked;
        self.update();
      };
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c5-svg') : null;
      if (!svg) return;

      if (this.mode === 'coins') {
        svg.innerHTML = `
          <!-- Root -->
          <circle cx="30" cy="105" r="5" fill="#0f172a"/>
          <text x="25" y="125" font-size="10" fill="#64748b">Start</text>

          <!-- Stage 1 branches -->
          <line x1="30" y1="105" x2="140" y2="55" stroke="#2563eb" stroke-width="2"/>
          <text x="75" y="70" font-size="10" fill="#2563eb" font-weight="bold">H (1/2)</text>
          <circle cx="140" cy="55" r="4" fill="#2563eb"/>

          <line x1="30" y1="105" x2="140" y2="155" stroke="#ea580c" stroke-width="2"/>
          <text x="75" y="145" font-size="10" fill="#ea580c" font-weight="bold">T (1/2)</text>
          <circle cx="140" cy="155" r="4" fill="#ea580c"/>

          <!-- Stage 2 branches from H -->
          <line x1="140" y1="55" x2="260" y2="30" stroke="#2563eb" stroke-width="1.5"/>
          <text x="195" y="36" font-size="9" fill="#2563eb">H (1/2)</text>
          <text x="270" y="34" font-size="11" font-weight="bold" fill="#0f172a">HH &rarr; 1/4 (25%)</text>

          <line x1="140" y1="55" x2="260" y2="80" stroke="#ea580c" stroke-width="1.5"/>
          <text x="195" y="75" font-size="9" fill="#ea580c">T (1/2)</text>
          <text x="270" y="84" font-size="11" font-weight="bold" fill="#0f172a">HT &rarr; 1/4 (25%)</text>

          <!-- Stage 2 branches from T -->
          <line x1="140" y1="155" x2="260" y2="130" stroke="#2563eb" stroke-width="1.5"/>
          <text x="195" y="136" font-size="9" fill="#2563eb">H (1/2)</text>
          <text x="270" y="134" font-size="11" font-weight="bold" fill="#0f172a">TH &rarr; 1/4 (25%)</text>

          <line x1="140" y1="155" x2="260" y2="180" stroke="#ea580c" stroke-width="1.5"/>
          <text x="195" y="176" font-size="9" fill="#ea580c">T (1/2)</text>
          <text x="270" y="184" font-size="11" font-weight="bold" fill="#0f172a">TT &rarr; 1/4 (25%)</text>
        `;

        var readout = this.container.querySelector('#lab-readout');
        if (readout) {
          readout.innerHTML = `
            <strong>Two Coins Sample Space:</strong> S = {HH, HT, TH, TT}, n(S) = 4<br>
            <strong>P(At least 1 Head):</strong> {HH, HT, TH} = 3/4 (75%) &middot; <strong>P(Exactly 1 Head):</strong> {HT, TH} = 2/4 = 1/2 (50%)
          `;
        }
        var verdict = this.container.querySelector('#lab-verdict');
        if (verdict) {
          verdict.innerHTML = `✓ <strong>Path Multiplication Rule:</strong> Along any path, P(A and B) = P(A) × P(B) = 1/2 × 1/2 = 1/4. Summing all 4 leaves yields 1/4 + 1/4 + 1/4 + 1/4 = 1.0!`;
        }
      } else {
        // Urn mode
        var withRep = this.replacement;
        var pR1 = 4/9, pB1 = 5/9;
        var pR2_R1 = withRep ? 4/9 : 3/8;
        var pB2_R1 = withRep ? 5/9 : 5/8;
        var pR2_B1 = withRep ? 4/9 : 4/8;
        var pB2_B1 = withRep ? 5/9 : 4/8;

        var pRR = pR1 * pR2_R1;
        var pRB = pR1 * pB2_R1;
        var pBR = pB1 * pR2_B1;
        var pBB = pB1 * pB2_B1;

        svg.innerHTML = `
          <!-- Root -->
          <circle cx="30" cy="105" r="5" fill="#0f172a"/>

          <!-- Stage 1 -->
          <line x1="30" y1="105" x2="130" y2="55" stroke="#ef4444" stroke-width="2"/>
          <text x="65" y="70" font-size="10" fill="#ef4444" font-weight="bold">R (4/9)</text>

          <line x1="30" y1="105" x2="130" y2="155" stroke="#3b82f6" stroke-width="2"/>
          <text x="65" y="145" font-size="10" fill="#3b82f6" font-weight="bold">B (5/9)</text>

          <!-- Stage 2 from R -->
          <line x1="130" y1="55" x2="240" y2="30" stroke="#ef4444" stroke-width="1.5"/>
          <text x="175" y="36" font-size="9" fill="#ef4444">R (${withRep ? '4/9' : '3/8'})</text>
          <text x="250" y="34" font-size="10" font-weight="bold" fill="#0f172a">RR: ${(pRR * 100).toFixed(1)}%</text>

          <line x1="130" y1="55" x2="240" y2="80" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="175" y="75" font-size="9" fill="#3b82f6">B (${withRep ? '5/9' : '5/8'})</text>
          <text x="250" y="84" font-size="10" font-weight="bold" fill="#0f172a">RB: ${(pRB * 100).toFixed(1)}%</text>

          <!-- Stage 2 from B -->
          <line x1="130" y1="155" x2="240" y2="130" stroke="#ef4444" stroke-width="1.5"/>
          <text x="175" y="136" font-size="9" fill="#ef4444">R (${withRep ? '4/9' : '4/8'})</text>
          <text x="250" y="134" font-size="10" font-weight="bold" fill="#0f172a">BR: ${(pBR * 100).toFixed(1)}%</text>

          <line x1="130" y1="155" x2="240" y2="180" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="175" y="176" font-size="9" fill="#3b82f6">B (${withRep ? '5/9' : '4/8'})</text>
          <text x="250" y="184" font-size="10" font-weight="bold" fill="#0f172a">BB: ${(pBB * 100).toFixed(1)}%</text>
        `;

        var readout2 = this.container.querySelector('#lab-readout');
        if (readout2) {
          readout2.innerHTML = `
            <strong>Urn (4 Red, 5 Blue &middot; ${withRep ? 'WITH' : 'WITHOUT'} Replacement):</strong><br>
            P(Red then Blue): (4/9) × (${withRep ? '5/9' : '5/8'}) = <strong>${(pRB * 100).toFixed(1)}%</strong> (${withRep ? '20/81' : '5/18'})<br>
            P(Two Blue): (5/9) × (${withRep ? '5/9' : '4/8'}) = <strong>${(pBB * 100).toFixed(1)}%</strong> (${withRep ? '25/81' : '5/18'})
          `;
        }
        var verdict2 = this.container.querySelector('#lab-verdict');
        if (verdict2) {
          verdict2.innerHTML = `✓ <strong>Conditional Sampling Law:</strong> Without replacement, removing the first ball decreases both numerator and denominator for the second draw (e.g. 5/9 becomes 4/8)!`;
        }
      }
    },

    render: function() {
      this.update();
    }
  };

  // -------------------------------------------------------------
  // Engine 6: Geometric Dartboard & Monte Carlo π Drop Lab
  // -------------------------------------------------------------
  engines['sim-concept-6'] = {
    dartCount: 200,
    inCircleCount: 0,
    darts: [],
    playing: false,
    timer: null,

    init: function(container) {
      this.container = container;
      this.generateDarts();
      this.renderUI();
      this.update();
    },

    generateDarts: function() {
      this.darts = [];
      var inCount = 0;
      // Rectangle: x in [0, 3], y in [0, 2].
      // Circle centered at (1.5, 1.0) with radius 0.5 (diameter 1.0)
      for (var i = 0; i < this.dartCount; i++) {
        var rx = Math.random() * 3.0;
        var ry = Math.random() * 2.0;
        var distSq = (rx - 1.5) * (rx - 1.5) + (ry - 1.0) * (ry - 1.0);
        var inside = distSq <= 0.25;
        if (inside) inCount++;
        this.darts.push({ x: rx, y: ry, inside: inside });
      }
      this.inCircleCount = inCount;
    },

    renderUI: function() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="sim-wrapper" style="font-family: system-ui, sans-serif;">
          <div class="sim-header" style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #1e293b;">Geometric Probability & Monte Carlo Drop Sandbox</h3>
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">Drop random dye/darts on a 2m × 3m rectangle with a 1m diameter circular target (NCERT Fig. 7.8).</p>
          </div>
          <div class="sim-canvas-container" style="text-align: center; background: #0f172a; border-radius: 8px; padding: 10px; border: 1px solid #334155;">
            <svg id="c6-svg" width="380" height="210" viewBox="0 0 380 210" style="max-width: 100%; height: auto;"></svg>
          </div>
          <div class="sim-controls" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <button id="c6-play" class="btn btn-sm">▶ Drop Darts</button>
            <button id="c6-reset" class="btn btn-sm">↺ Reset (N = 200)</button>
            <label style="font-size: 0.85rem; margin-left: 8px;">
              Number of Drops:
              <select id="c6-drops" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
                <option value="100">100 Darts</option>
                <option value="200" selected>200 Darts</option>
                <option value="500">500 Darts</option>
                <option value="1500">1500 Darts</option>
              </select>
            </label>
          </div>
          <div id="lab-readout" style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #0369a1;"></div>
          <div id="lab-verdict" style="margin-top: 6px; padding: 8px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; font-size: 0.85rem; color: #15803d;"></div>
        </div>
      `;

      var self = this;
      var playBtn = this.container.querySelector('#c6-play');
      var resetBtn = this.container.querySelector('#c6-reset');
      var dropsSel = this.container.querySelector('#c6-drops');

      if (playBtn) playBtn.onclick = function() {
        self.generateDarts();
        self.update();
      };
      if (resetBtn) resetBtn.onclick = function() {
        self.dartCount = 200;
        if (dropsSel) dropsSel.value = '200';
        self.generateDarts();
        self.update();
      };
      if (dropsSel) dropsSel.onchange = function(e) {
        self.dartCount = parseInt(e.target.value, 10);
        self.generateDarts();
        self.update();
      };
    },

    update: function() {
      var svg = this.container ? this.container.querySelector('#c6-svg') : null;
      var theoP = Math.PI / 24; // ≈ 0.130899
      var empP = this.inCircleCount / this.dartCount;

      if (svg) {
        // SVG mapping:
        // Rectangle width 3m -> 300px (x from 40 to 340)
        // Rectangle height 2m -> 160px (y from 25 to 185)
        // Scale: 100px per meter. Circle radius = 0.5m -> 50px. Center at (190, 105).
        var dartSvg = [];
        var maxShow = Math.min(this.darts.length, 300);
        for (var i = 0; i < maxShow; i++) {
          var d = this.darts[i];
          var sx = 40 + d.x * 100;
          var sy = 25 + d.y * 80;
          var dColor = d.inside ? '#4ade80' : '#f87171';
          dartSvg.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="2.5" fill="${dColor}"/>`);
        }

        svg.innerHTML = `
          <!-- 2m x 3m Rectangle -->
          <rect x="40" y="25" width="300" height="160" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
          <text x="190" y="18" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle">Width = 3 m</text>
          <text x="350" y="110" fill="#cbd5e1" font-size="11" font-weight="bold">Height = 2 m</text>

          <!-- 1m Diameter Circle Target (Radius 0.5m = 40px) -->
          <circle cx="190" cy="105" r="40" fill="#334155" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="190" y="108" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">Circle d = 1 m</text>

          <!-- Dropped Darts -->
          ${dartSvg.join('\n')}
        `;
      }

      var readout = this.container ? this.container.querySelector('#lab-readout') : null;
      if (readout) {
        readout.innerHTML = `
          <strong>Geometric Area Calculation:</strong><br>
          Area(Rectangle) = 3 × 2 = <strong>6 m²</strong> &middot; Area(Circle) = π(0.5)² = <strong>π/4 ≈ 0.7854 m²</strong><br>
          <strong>Theoretical Probability:</strong> (π/4) / 6 = <strong>π/24 ≈ ${(theoP * 100).toFixed(2)}%</strong><br>
          <strong>Empirical Drop Result (${this.dartCount} drops):</strong> ${this.inCircleCount} inside = <strong>${(empP * 100).toFixed(2)}%</strong> (Diff: ${Math.abs(empP - theoP).toFixed(4)})
        `;
      }

      var verdict = this.container ? this.container.querySelector('#lab-verdict') : null;
      if (verdict) {
        verdict.innerHTML = `✓ <strong>Continuous Probability Law:</strong> When sampling uniformly over a region, P(Target) = Area(Target)/Area(Region). Monte Carlo drop ratio approaches π/24 ≈ 13.09%!`;
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
