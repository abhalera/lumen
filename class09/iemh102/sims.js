
// =========================================================================
// IEMH102: INTRODUCTION TO LINEAR POLYNOMIALS
// Interactive Algebraic Manipulatives & Laboratory Engines
// =========================================================================

window.SIM_STATE = {
  currentConcept: 'c1',
  isPlaying: false,
  timer: null,
  scrubberVal: 0,
  speed: 1,
  // Concept-specific states
  c1: { c3: 0, c2: 0, c1: 4, c0: -3 },
  c2: { a: 5, b: -3, x: 2 },
  c3: { start: 500, rate: 150, months: 6 },
  c4: { t: 4, growRate: 0.5, growBase: 1.75, decayRate: -8, decayBase: 100 },
  c5: { a: 2, b: 3 },
  c6: { mode: 'parallel', a: 2, b1: 3.5, b2: -3.67, matchN: 3 }
};

window.SIM_ENGINES = {

  // -----------------------------------------------------------------------
  // LAB 1: POLYNOMIAL DEGREE & TERM DISSECTOR (pp. 16–20)
  // -----------------------------------------------------------------------
  c1: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🔬 Polynomial Degree & Term Dissector Workbench</div>
            <div style="font-size:13px;color:#94a3b8;">Standard Univariate Form: c₃x³ + c₂x² + c₁x + c₀</div>
          </div>
          <div id="c1-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;padding:16px;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:14px;">
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Cubic Coeff (c₃): <b id="c1-c3-val" style="color:#ec4899;">0</b></label>
              <input type="range" id="c1-slider-c3" min="-5" max="5" value="0" step="1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Quadratic Coeff (c₂): <b id="c1-c2-val" style="color:#f59e0b;">0</b></label>
              <input type="range" id="c1-slider-c2" min="-5" max="5" value="0" step="1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Linear Coeff (c₁): <b id="c1-c1-val" style="color:#38bdf8;">4</b></label>
              <input type="range" id="c1-slider-c1" min="-5" max="5" value="4" step="1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:8px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:11px;color:#94a3b8;display:block;">Constant (c₀): <b id="c1-c0-val" style="color:#10b981;">-3</b></label>
              <input type="range" id="c1-slider-c0" min="-9" max="9" value="-3" step="1" style="width:100%;">
            </div>
          </div>
        </div>
      `;

      var self = this;
      ['c3','c2','c1','c0'].forEach(function(k) {
        document.getElementById('c1-slider-' + k).addEventListener('input', function(e) {
          window.SIM_STATE.c1[k] = parseInt(e.target.value);
          self.render();
        });
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c1;
      var c3 = state.c3, c2 = state.c2, c1 = state.c1, c0 = state.c0;
      document.getElementById('c1-c3-val').textContent = c3;
      document.getElementById('c1-c2-val').textContent = c2;
      document.getElementById('c1-c1-val').textContent = c1;
      document.getElementById('c1-c0-val').textContent = c0;

      // Determine degree
      var deg = 0;
      var degName = "Constant Polynomial";
      var badgeColor = "#10b981";
      if(c3 !== 0) { deg = 3; degName = "Cubic Polynomial (Degree 3)"; badgeColor = "#ec4899"; }
      else if(c2 !== 0) { deg = 2; degName = "Quadratic Polynomial (Degree 2)"; badgeColor = "#f59e0b"; }
      else if(c1 !== 0) { deg = 1; degName = "Linear Polynomial (Degree 1)"; badgeColor = "#38bdf8"; }
      else if(c0 !== 0) { deg = 0; degName = "Constant Polynomial (Degree 0)"; badgeColor = "#10b981"; }
      else { deg = "Undefined"; degName = "Zero Polynomial (Degree Undefined)"; badgeColor = "#64748b"; }

      // Build expression string
      var terms = [];
      if(c3 !== 0) terms.push((c3 === 1 ? '' : c3 === -1 ? '-' : c3) + 'x³');
      if(c2 !== 0) terms.push((terms.length && c2 > 0 ? '+ ' : terms.length && c2 < 0 ? '- ' : (c2 < 0 ? '-' : '')) + (Math.abs(c2) === 1 ? '' : Math.abs(c2)) + 'x²');
      if(c1 !== 0) terms.push((terms.length && c1 > 0 ? '+ ' : terms.length && c1 < 0 ? '- ' : (c1 < 0 ? '-' : '')) + (Math.abs(c1) === 1 ? '' : Math.abs(c1)) + 'x');
      if(c0 !== 0) terms.push((terms.length && c0 > 0 ? '+ ' : terms.length && c0 < 0 ? '- ' : (c0 < 0 ? '-' : '')) + Math.abs(c0));
      var polyStr = terms.length ? terms.join(' ') : '0';

      var html = `
        <div style="text-align:center;padding:16px 8px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:6px;">Current Polynomial Expression:</div>
          <div style="font:700 28px/1.3 Georgia,serif;color:#ffffff;margin-bottom:12px;">p(x) = ${polyStr}</div>
          <div style="display:inline-block;background:${badgeColor};color:#0f172a;font-weight:800;font-size:13px;padding:6px 14px;border-radius:999px;">
            ${degName}
          </div>
          
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:24px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid ${c3!==0?'#ec4899':'#334155'};">
              <div style="font-size:11px;color:#94a3b8;">Cubic Term</div>
              <div style="font-weight:700;font-size:16px;color:#ec4899;">${c3!==0?c3+'x³':'—'}</div>
              <div style="font-size:10px;color:#64748b;">Exponent = 3</div>
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid ${c2!==0?'#f59e0b':'#334155'};">
              <div style="font-size:11px;color:#94a3b8;">Quadratic Term</div>
              <div style="font-weight:700;font-size:16px;color:#f59e0b;">${c2!==0?c2+'x²':'—'}</div>
              <div style="font-size:10px;color:#64748b;">Exponent = 2</div>
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid ${c1!==0?'#38bdf8':'#334155'};">
              <div style="font-size:11px;color:#94a3b8;">Linear Term</div>
              <div style="font-weight:700;font-size:16px;color:#38bdf8;">${c1!==0?c1+'x':'—'}</div>
              <div style="font-size:10px;color:#64748b;">Exponent = 1</div>
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid ${c0!==0?'#10b981':'#334155'};">
              <div style="font-size:11px;color:#94a3b8;">Constant Term</div>
              <div style="font-weight:700;font-size:16px;color:#10b981;">${c0!==0?c0:'—'}</div>
              <div style="font-size:10px;color:#64748b;">Exponent = 0</div>
            </div>
          </div>
        </div>
      `;
      document.getElementById('c1-svg-box').innerHTML = html;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Polynomial:</b> p(x) = ${polyStr}</div>
            <div><b>Highest Non-Zero Exponent:</b> ${deg}</div>
            <div><b>Classification:</b> <span style="color:${badgeColor};font-weight:700;">${degName}</span></div>
            <div><b>Linear Form ax + b:</b> ${c3===0&&c2===0&&c1!==0 ? 'YES (a = '+c1+', b = '+c0+')' : 'NO'}</div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>Polynomial Classification:</strong> The polynomial <em>p(x) = ${polyStr}</em> has degree <b>${deg}</b>. 
          ${c3===0 && c2===0 && c1!==0 ? 'This is a true <b>Linear Polynomial</b> of the standard form ax + b, representing uniform linear rate of change.' : (c3!==0||c2!==0 ? 'This is NOT a linear polynomial because it contains non-linear terms of degree ' + deg + '.' : 'This is a constant polynomial of degree 0.')}
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c1 = { c3: 0, c2: 0, c1: 4, c0: -3 }; }
      else if(idx === 1) { window.SIM_STATE.c1 = { c3: 0, c2: 2, c1: -5, c0: 3 }; }
      else if(idx === 2) { window.SIM_STATE.c1 = { c3: 1, c2: 0, c1: 2, c0: -1 }; }
      ['c3','c2','c1','c0'].forEach(function(k) {
        document.getElementById('c1-slider-' + k).value = window.SIM_STATE.c1[k];
      });
      this.render();
    }
  },

  // -----------------------------------------------------------------------
  // LAB 2: INPUT-OUTPUT FUNCTION MACHINE (pp. 20–23)
  // -----------------------------------------------------------------------
  c2: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">⚙️ Polynomial Input-Output Evaluation Machine</div>
            <div style="font-size:13px;color:#94a3b8;">Input x → Processor [5x - 3] → Output p(x)</div>
          </div>
          <div id="c2-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Input Value x: <b id="c2-x-val" style="color:#38bdf8;">2</b></label>
              <input type="range" id="c2-slider-x" min="-5" max="5" value="2" step="1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;display:flex;align-items:center;justify-content:center;">
              <button id="c2-btn-zero" style="background:#38bdf8;color:#0f172a;border:none;padding:10px 16px;border-radius:8px;font-weight:700;cursor:pointer;width:100%;">
                🎯 Snap to Zero (x = 3/5 = 0.6)
              </button>
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c2-slider-x').addEventListener('input', function(e) {
        window.SIM_STATE.c2.x = parseFloat(e.target.value);
        self.render();
      });
      document.getElementById('c2-btn-zero').addEventListener('click', function() {
        window.SIM_STATE.c2.x = 0.6;
        self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c2;
      var W = 720, H = 340;
      var x = state.x, a = state.a, b = state.b;
      var result = a * x + b;
      var zeroRoot = -b / a;

      document.getElementById('c2-x-val').textContent = x;

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';

      // 1. Input Hopper (Left)
      svg += '<polygon points="80,70 180,70 150,130 110,130" fill="#334155" stroke="#60a5fa" stroke-width="2"/>';
      svg += '<text x="130" y="55" fill="#60a5fa" font-size="13" font-weight="700" text-anchor="middle">Input Hopper</text>';
      svg += '<circle cx="130" cy="95" r="22" fill="#38bdf8"/>';
      svg += '<text x="130" y="100" fill="#0f172a" font-size="14" font-weight="800" text-anchor="middle">x = ' + x + '</text>';

      // Arrow Hopper to Machine
      svg += '<line x1="130" y1="130" x2="130" y2="170" stroke="#60a5fa" stroke-width="3" stroke-dasharray="4,4"/>';
      svg += '<line x1="130" y1="170" x2="250" y2="170" stroke="#60a5fa" stroke-width="3"/>';

      // 2. Machine Chamber (Center)
      svg += '<rect x="250" y="90" width="220" height="160" rx="12" fill="#090d16" stroke="#f59e0b" stroke-width="3"/>';
      svg += '<text x="360" y="120" fill="#f59e0b" font-size="15" font-weight="800" text-anchor="middle">⚙️ PROCESSING ENGINE</text>';
      svg += '<text x="360" y="150" fill="#ffffff" font-size="14" text-anchor="middle">Multiply by 5: 5(' + x + ') = ' + (5*x) + '</text>';
      svg += '<text x="360" y="180" fill="#ffffff" font-size="14" text-anchor="middle">Subtract 3: ' + (5*x) + ' - 3</text>';
      svg += '<text x="360" y="220" fill="#38bdf8" font-size="16" font-weight="800" text-anchor="middle">p(' + x + ') = ' + result + '</text>';

      // Arrow Machine to Output Tray
      svg += '<line x1="470" y1="170" x2="550" y2="170" stroke="#10b981" stroke-width="3"/>';

      // 3. Output Tray (Right)
      svg += '<rect x="550" y="120" width="130" height="100" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
      svg += '<text x="615" y="145" fill="#10b981" font-size="13" font-weight="700" text-anchor="middle">Output Tray</text>';
      svg += '<circle cx="615" cy="180" r="26" fill="' + (result === 0 ? '#f59e0b' : '#10b981') + '"/>';
      svg += '<text x="615" y="186" fill="#0f172a" font-size="16" font-weight="800" text-anchor="middle">' + result + '</text>';

      // Zero Indicator Banner at bottom
      if(Math.abs(result) < 0.001) {
        svg += '<rect x="180" y="275" width="360" height="34" rx="17" fill="#f59e0b"/>';
        svg += '<text x="360" y="297" fill="#0f172a" font-size="14" font-weight="800" text-anchor="middle">🎯 ZERO LOCATED: x = 0.6 produces p(x) = 0!</text>';
      } else {
        svg += '<text x="360" y="300" fill="#94a3b8" font-size="12" text-anchor="middle">Unique Zero of p(x) = 5x - 3 lies at x = -b/a = 3/5 = 0.6</text>';
      }

      svg += '</svg>';
      document.getElementById('c2-svg-box').innerHTML = svg;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Input Value x:</b> ${x}</div>
            <div><b>Polynomial Rule:</b> p(x) = 5x - 3</div>
            <div><b>Output p(x):</b> <span style="color:${result===0?'#f59e0b':'#10b981'};font-weight:700;">${result}</span></div>
            <div><b>Root / Zero Condition:</b> ${result === 0 ? 'ZERO ACHIEVED' : 'Non-zero'}</div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>Evaluation Mechanics:</strong> For input <b>x = ${x}</b>, the function engine evaluates 5(${x}) - 3 = <b>${result}</b>. 
          ${result === 0 ? 'Since p(' + x + ') = 0, x = ' + x + ' is the exact root / zero of the linear polynomial!' : 'To reach an output of 0, the input must equal the root x = -(-3)/5 = 3/5 = 0.6.'}
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c2.x = 2; }
      else if(idx === 1) { window.SIM_STATE.c2.x = 0; }
      else if(idx === 2) { window.SIM_STATE.c2.x = -1; }
      document.getElementById('c2-slider-x').value = window.SIM_STATE.c2.x;
      this.render();
    }
  },

  // -----------------------------------------------------------------------
  // LAB 3: LINEAR PATTERNS & SAVINGS ACCUMULATOR (pp. 24–27)
  // -----------------------------------------------------------------------
  c3: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">💰 Linear Sequence & Savings Account Stepper (Ex Set 2.3)</div>
            <div style="font-size:13px;color:#94a3b8;">Base ₹500 + ₹150 every month: S(n) = 500 + 150n</div>
          </div>
          <div id="c3-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Months Elapsed (n): <b id="c3-n-val" style="color:#38bdf8;">6 months</b></label>
              <input type="range" id="c3-slider-n" min="0" max="12" value="6" step="1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Monthly Rate: <b style="color:#10b981;">₹150 / month</b></label>
              <div style="font-size:13px;color:#94a3b8;padding-top:4px;">Constant difference: ΔS = ₹150</div>
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c3-slider-n').addEventListener('input', function(e) {
        window.SIM_STATE.c3.months = parseInt(e.target.value);
        self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c3;
      var W = 720, H = 340;
      var n = state.months;
      var base = state.start, rate = state.rate;
      var currentTotal = base + rate * n;

      document.getElementById('c3-n-val').textContent = n + ' months';

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';

      var ox = 80, oy = 280;
      var maxN = 12;
      var maxS = base + rate * maxN; // 500 + 1800 = 2300
      var scX = (W - 140) / maxN; // ~48px
      var scY = 220 / maxS; // ~0.095

      // Axes
      svg += '<line x1="' + ox + '" y1="' + oy + '" x2="' + (W - 30) + '" y2="' + oy + '" stroke="#60a5fa" stroke-width="2"/>';
      svg += '<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="30" stroke="#60a5fa" stroke-width="2"/>';
      svg += '<text x="' + (W - 20) + '" y="' + (oy + 18) + '" fill="#94a3b8" font-size="11">Month n</text>';
      svg += '<text x="' + ox + '" y="20" fill="#94a3b8" font-size="11">Balance S(n) ₹</text>';

      // Bars & Line path
      var pts = [];
      for(var m = 0; m <= maxN; m++) {
        var val = base + rate * m;
        var bx = ox + m * scX;
        var by = oy - val * scY;
        pts.push(bx + ',' + by);

        if(m <= n) {
          // Bar
          svg += '<rect x="' + (bx - 12) + '" y="' + by + '" width="24" height="' + (val * scY) + '" fill="#38bdf8" opacity="0.35" rx="3"/>';
        }
        svg += '<circle cx="' + bx + '" cy="' + by + '" r="' + (m === n ? 7 : 4) + '" fill="' + (m === n ? '#f59e0b' : '#38bdf8') + '"/>';
        if(m % 2 === 0) svg += '<text x="' + bx + '" y="' + (oy + 18) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + m + '</text>';
      }

      // Linear trajectory line
      svg += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>';

      // Current Highlight
      var curX = ox + n * scX;
      var curY = oy - currentTotal * scY;
      svg += '<line x1="' + curX + '" y1="' + oy + '" x2="' + curX + '" y2="' + curY + '" stroke="#f59e0b" stroke-width="2"/>';
      svg += '<circle cx="' + curX + '" cy="' + curY + '" r="8" fill="#f59e0b" stroke="#ffffff" stroke-width="2"/>';
      svg += '<rect x="' + (curX - 60) + '" y="' + (curY - 34) + '" width="120" height="24" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>';
      svg += '<text x="' + curX + '" y="' + (curY - 18) + '" fill="#f59e0b" font-size="12" font-weight="800" text-anchor="middle">₹' + currentTotal + '</text>';

      // Step difference indicator
      if(n > 0) {
        var prevY = oy - (base + rate * (n - 1)) * scY;
        svg += '<text x="' + (curX + 15) + '" y="' + ((curY + prevY)/2 + 4) + '" fill="#10b981" font-size="11" font-weight="700">+₹150</text>';
      }

      svg += '</svg>';
      document.getElementById('c3-svg-box').innerHTML = svg;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Initial Savings:</b> ₹${base}</div>
            <div><b>Month n:</b> ${n}</div>
            <div><b>Total Balance S(n):</b> <span style="color:#f59e0b;font-weight:700;">₹${currentTotal}</span></div>
            <div><b>Constant Increment:</b> <span style="color:#10b981;">+₹150 / month</span></div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>Linear Sequence Growth:</strong> The bank savings sequence grows strictly linearly according to <b>S(n) = 500 + 150n</b>. 
          At month <b>n = ${n}</b>, total accumulation is <b>₹${currentTotal}</b>. The step difference between any two adjacent months is constantly ₹150.
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c3.months = 6; }
      else if(idx === 1) { window.SIM_STATE.c3.months = 2; }
      else if(idx === 2) { window.SIM_STATE.c3.months = 12; }
      document.getElementById('c3-slider-n').value = window.SIM_STATE.c3.months;
      this.render();
    }
  },

  // -----------------------------------------------------------------------
  // LAB 4: LINEAR GROWTH VS DECAY DUAL EXPLORER (pp. 28–30)
  // -----------------------------------------------------------------------
  c4: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🌱 Linear Growth (+a) vs Linear Decay (-a) Studio</div>
            <div style="font-size:13px;color:#94a3b8;">Plant Height vs Leaking Water Tank</div>
          </div>
          <div id="c4-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Time Elapsed (t): <b id="c4-t-val" style="color:#38bdf8;">4 months</b></label>
              <input type="range" id="c4-slider-t" min="0" max="10" value="4" step="1" style="width:100%;">
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c4-slider-t').addEventListener('input', function(e) {
        window.SIM_STATE.c4.t = parseInt(e.target.value);
        self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c4;
      var W = 720, H = 340;
      var t = state.t;

      var plantHeight = state.growBase + state.growRate * t; // 1.75 + 0.5t
      var tankWater = state.decayBase + state.decayRate * t; // 100 - 8t

      document.getElementById('c4-t-val').textContent = t + ' time units';

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';

      // Split Screen divider
      svg += '<line x1="360" y1="20" x2="360" y2="320" stroke="#334155" stroke-width="2" stroke-dasharray="4,4"/>';

      // --- LEFT SIDE: LINEAR GROWTH (Plant) ---
      svg += '<text x="180" y="35" fill="#10b981" font-size="14" font-weight="800" text-anchor="middle">🌱 LINEAR GROWTH (Slope a > 0)</text>';
      svg += '<text x="180" y="55" fill="#94a3b8" font-size="12" text-anchor="middle">h(t) = 1.75 + 0.5t (feet)</text>';

      // Ground line
      svg += '<line x1="50" y1="270" x2="310" y2="270" stroke="#475569" stroke-width="3"/>';

      // Plant stem
      var pPx = plantHeight * 30; // 30px per foot
      svg += '<rect x="175" y="' + (270 - pPx) + '" width="10" height="' + pPx + '" fill="#10b981" rx="4"/>';
      // Leaves
      svg += '<circle cx="170" cy="' + (270 - pPx) + '" r="12" fill="#10b981"/>';
      svg += '<circle cx="190" cy="' + (270 - pPx) + '" r="12" fill="#10b981"/>';
      svg += '<text x="180" y="' + (270 - pPx - 16) + '" fill="#10b981" font-size="14" font-weight="800" text-anchor="middle">' + plantHeight.toFixed(2) + ' ft</text>';

      // --- RIGHT SIDE: LINEAR DECAY (Water Tank) ---
      svg += '<text x="540" y="35" fill="#ef4444" font-size="14" font-weight="800" text-anchor="middle">🚰 LINEAR DECAY (Slope a < 0)</text>';
      svg += '<text x="540" y="55" fill="#94a3b8" font-size="12" text-anchor="middle">V(t) = 100 - 8t (litres)</text>';

      // Tank outline
      var tx = 480, ty = 90, tw = 120, th = 180;
      svg += '<rect x="' + tx + '" y="' + ty + '" width="' + tw + '" height="' + th + '" fill="#090d16" stroke="#475569" stroke-width="3" rx="6"/>';

      // Water fill
      var wHeight = (tankWater / 100) * th;
      svg += '<rect x="' + (tx + 3) + '" y="' + (ty + th - wHeight) + '" width="' + (tw - 6) + '" height="' + wHeight + '" fill="#38bdf8" opacity="0.6"/>';
      svg += '<text x="' + (tx + tw/2) + '" y="' + (ty + th - wHeight - 10) + '" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">' + tankWater + ' L</text>';

      svg += '</svg>';
      document.getElementById('c4-svg-box').innerHTML = svg;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Elapsed Time t:</b> ${t} units</div>
            <div><b>Plant Height h(t):</b> <span style="color:#10b981;font-weight:700;">${plantHeight.toFixed(2)} ft</span> (Growth: +0.5/t)</div>
            <div><b>Tank Water V(t):</b> <span style="color:#ef4444;font-weight:700;">${tankWater} L</span> (Decay: -8/t)</div>
            <div><b>Slope Contrast:</b> a = +0.5 vs a = -8</div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>Growth vs Decay Comparison:</strong> The plant height exhibits <b>linear growth</b> because its slope a = +0.5 is positive. 
          The water tank exhibits <b>linear decay</b> because its slope a = -8 is negative. Both follow the standard form y = ax + b!
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c4.t = 4; }
      else if(idx === 1) { window.SIM_STATE.c4.t = 7; }
      else if(idx === 2) { window.SIM_STATE.c4.t = 0; }
      document.getElementById('c4-slider-t').value = window.SIM_STATE.c4.t;
      this.render();
    }
  },

  // -----------------------------------------------------------------------
  // LAB 5: STRAIGHT-LINE SLOPE & INTERCEPT BENCH (pp. 31–36)
  // -----------------------------------------------------------------------
  c5: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">📈 Dynamic Straight-Line Slope & Intercept Bench</div>
            <div style="font-size:13px;color:#94a3b8;">y = ax + b (Slope a, y-Intercept b)</div>
          </div>
          <div id="c5-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Slope (a = Rise / Run): <b id="c5-a-val" style="color:#38bdf8;">+2</b></label>
              <input type="range" id="c5-slider-a" min="-5" max="5" value="2" step="0.5" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">y-Intercept (b): <b id="c5-b-val" style="color:#f59e0b;">+3</b></label>
              <input type="range" id="c5-slider-b" min="-6" max="6" value="3" step="0.5" style="width:100%;">
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c5-slider-a').addEventListener('input', function(e) {
        window.SIM_STATE.c5.a = parseFloat(e.target.value); self.render();
      });
      document.getElementById('c5-slider-b').addEventListener('input', function(e) {
        window.SIM_STATE.c5.b = parseFloat(e.target.value); self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c5;
      var W = 720, H = 340;
      var cx = W / 2, cy = H / 2;
      var scale = 22; // 22px per unit

      var a = state.a, b = state.b;
      document.getElementById('c5-a-val').textContent = (a >= 0 ? '+' : '') + a;
      document.getElementById('c5-b-val').textContent = (b >= 0 ? '+' : '') + b;

      // x-intercept root = -b/a (if a != 0)
      var rootX = a !== 0 ? (-b / a) : null;

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';

      // Grid
      for(var i = -15; i <= 15; i++) {
        var gx = cx + i * scale;
        var gy = cy + i * scale;
        if(gx >= 0 && gx <= W) svg += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + H + '" stroke="#334155" stroke-width="' + (i===0?2:0.5) + '"/>';
        if(gy >= 0 && gy <= H) svg += '<line x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '" stroke="#334155" stroke-width="' + (i===0?2:0.5) + '"/>';
      }

      // Line y = ax + b
      var xLeft = -15, yLeft = a * xLeft + b;
      var xRight = 15, yRight = a * xRight + b;
      var p1x = cx + xLeft * scale, p1y = cy - yLeft * scale;
      var p2x = cx + xRight * scale, p2y = cy - yRight * scale;
      svg += '<line x1="' + p1x + '" y1="' + p1y + '" x2="' + p2x + '" y2="' + p2y + '" stroke="#38bdf8" stroke-width="3.5"/>';

      // y-intercept marker at (0, b)
      var yintX = cx, yintY = cy - b * scale;
      svg += '<circle cx="' + yintX + '" cy="' + yintY + '" r="7" fill="#f59e0b" stroke="#ffffff" stroke-width="2"/>';
      svg += '<text x="' + (yintX + 12) + '" y="' + (yintY + 4) + '" fill="#f59e0b" font-weight="700" font-size="12">y-int (0, ' + b + ')</text>';

      // x-intercept marker at (-b/a, 0)
      if(rootX !== null && rootX >= -15 && rootX <= 15) {
        var xintX = cx + rootX * scale, xintY = cy;
        svg += '<circle cx="' + xintX + '" cy="' + xintY + '" r="7" fill="#10b981" stroke="#ffffff" stroke-width="2"/>';
        svg += '<text x="' + xintX + '" y="' + (xintY + 20) + '" fill="#10b981" font-weight="700" font-size="12" text-anchor="middle">x-int (' + rootX.toFixed(2) + ', 0)</text>';
      }

      // Origin
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#ffffff"/>';

      svg += '</svg>';
      document.getElementById('c5-svg-box').innerHTML = svg;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Line Equation:</b> y = ${a}x + (${b})</div>
            <div><b>Slope (Steepness):</b> a = ${a} (${a>0?'Rises ↗':a<0?'Falls ↘':'Horizontal —'})</div>
            <div><b>y-Intercept:</b> (0, ${b})</div>
            <div><b>x-Intercept (Root):</b> ${rootX !== null ? '(' + rootX.toFixed(2) + ', 0)' : 'None (Parallel to x-axis)'}</div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>Slope-Intercept Verification:</strong> The line <em>y = ${a}x + ${b}</em> has slope <b>a = ${a}</b> and crosses the y-axis at <b>(0, ${b})</b>. 
          ${b === 0 ? 'Since b = 0, the line passes directly through the origin (0, 0).' : 'The constant b = ' + b + ' shifts the line vertically by ' + Math.abs(b) + ' units.'}
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c5.a = 2; window.SIM_STATE.c5.b = 3; }
      else if(idx === 1) { window.SIM_STATE.c5.a = -3; window.SIM_STATE.c5.b = 4; }
      else if(idx === 2) { window.SIM_STATE.c5.a = 1.5; window.SIM_STATE.c5.b = 0; }
      document.getElementById('c5-slider-a').value = window.SIM_STATE.c5.a;
      document.getElementById('c5-slider-b').value = window.SIM_STATE.c5.b;
      this.render();
    }
  },

  // -----------------------------------------------------------------------
  // LAB 6: PARALLEL FAMILIES & MATCHSTICK HEXAGONS (pp. 37–40)
  // -----------------------------------------------------------------------
  c6: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🔷 Hexagon Matchstick Pattern & Parallel Lines Studio</div>
            <div style="font-size:13px;color:#94a3b8;">M(n) = 5n + 1 (Ex 12) & Parallel Lines y = ax + b</div>
          </div>
          <div id="c6-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Matchstick Stage Number (n): <b id="c6-n-val" style="color:#38bdf8;">Stage 3</b></label>
              <input type="range" id="c6-slider-n" min="1" max="6" value="3" step="1" style="width:100%;">
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c6-slider-n').addEventListener('input', function(e) {
        window.SIM_STATE.c6.matchN = parseInt(e.target.value);
        self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c6;
      var W = 720, H = 340;
      var n = state.matchN;
      var totalSticks = 5 * n + 1;

      document.getElementById('c6-n-val').textContent = 'Stage ' + n + ' (' + totalSticks + ' matchsticks)';

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';

      // Chained regular hexagons
      var r = 28; // radius
      var dx = r * 1.5; // step between centers
      var cy = 130;
      var startX = (W - n * dx) / 2 + 10;

      for(var i = 0; i < n; i++) {
        var hx = startX + i * dx;
        // Draw 6 edges as matchsticks
        var pts = [];
        for(var a = 0; a < 6; a++) {
          var angle = (a * 60) * Math.PI / 180;
          var px = hx + r * Math.cos(angle);
          var py = cy + r * Math.sin(angle);
          pts.push([px, py]);
        }

        // Polygon matchstick edges
        for(var e = 0; e < 6; e++) {
          var pA = pts[e], pB = pts[(e + 1) % 6];
          var isShared = (i > 0 && e === 3); // Left edge of subsequent hexagon is shared
          svg += '<line x1="' + pA[0] + '" y1="' + pA[1] + '" x2="' + pB[0] + '" y2="' + pB[1] + '" stroke="' + (isShared ? '#94a3b8' : '#f59e0b') + '" stroke-width="' + (isShared ? 2 : 4) + '"/>';
          svg += '<circle cx="' + pA[0] + '" cy="' + pA[1] + '" r="3.5" fill="#ef4444"/>';
        }
        svg += '<text x="' + hx + '" y="' + (cy + 5) + '" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">Hex ' + (i+1) + '</text>';
      }

      // Pattern formula banner
      svg += '<rect x="80" y="220" width="' + (W - 160) + '" height="80" rx="10" fill="#090d16" stroke="#334155" stroke-width="2"/>';
      svg += '<text x="' + (W/2) + '" y="250" fill="#f59e0b" font-size="16" font-weight="800" text-anchor="middle">Hexagon Progression Formula: M(n) = 5n + 1</text>';
      svg += '<text x="' + (W/2) + '" y="280" fill="#ffffff" font-size="14" text-anchor="middle">Stage ' + n + ': M(' + n + ') = 5(' + n + ') + 1 = ' + totalSticks + ' matchsticks (Stage 15 = 76, 200 is impossible)</text>';

      svg += '</svg>';
      document.getElementById('c6-svg-box').innerHTML = svg;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Current Stage (n):</b> ${n}</div>
            <div><b>Number of Hexagons:</b> ${n}</div>
            <div><b>Total Matchsticks:</b> <span style="color:#f59e0b;font-weight:700;">${totalSticks}</span></div>
            <div><b>General Linear Rule:</b> M(n) = 5n + 1</div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>Pattern Rule Verification:</strong> Stage 1 requires 6 matchsticks. Every new hexagon shares 1 edge with the preceding hexagon, adding exactly <b>5 new matchsticks</b> per stage. 
          The formula is <b>M(n) = 5n + 1</b>. For 200 matchsticks: 5n + 1 = 200 => 5n = 199 => n = 39.8 (not an integer), proving 200 matchsticks cannot form a complete stage!
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c6.matchN = 3; }
      else if(idx === 1) { window.SIM_STATE.c6.matchN = 5; }
      else if(idx === 2) { window.SIM_STATE.c6.matchN = 1; }
      document.getElementById('c6-slider-n').value = window.SIM_STATE.c6.matchN;
      this.render();
    }
  }
};

// Global control bindings
window.initSimControls = function() {
  var pBtn = document.getElementById('sim-btn-play');
  var rBtn = document.getElementById('sim-btn-reset');
  var sBtn = document.getElementById('sim-btn-step');

  if(pBtn) {
    pBtn.onclick = function() {
      window.SIM_STATE.isPlaying = !window.SIM_STATE.isPlaying;
      pBtn.textContent = window.SIM_STATE.isPlaying ? '⏸ Pause' : '▶ Play';
      if(window.SIM_STATE.isPlaying) {
        window.SIM_STATE.timer = setInterval(function() {
          var cid = window.SIM_STATE.currentConcept;
          if(cid === 'c2') {
            window.SIM_STATE.c2.x = (window.SIM_STATE.c2.x + 1) > 5 ? -5 : window.SIM_STATE.c2.x + 1;
            var sl = document.getElementById('c2-slider-x'); if(sl) sl.value = window.SIM_STATE.c2.x;
            window.SIM_ENGINES.c2.render();
          } else if(cid === 'c3') {
            window.SIM_STATE.c3.months = (window.SIM_STATE.c3.months + 1) > 12 ? 0 : window.SIM_STATE.c3.months + 1;
            var sl3 = document.getElementById('c3-slider-n'); if(sl3) sl3.value = window.SIM_STATE.c3.months;
            window.SIM_ENGINES.c3.render();
          } else if(cid === 'c4') {
            window.SIM_STATE.c4.t = (window.SIM_STATE.c4.t + 1) > 10 ? 0 : window.SIM_STATE.c4.t + 1;
            var sl4 = document.getElementById('c4-slider-t'); if(sl4) sl4.value = window.SIM_STATE.c4.t;
            window.SIM_ENGINES.c4.render();
          } else if(cid === 'c5') {
            window.SIM_STATE.c5.b = (window.SIM_STATE.c5.b + 1) > 6 ? -6 : window.SIM_STATE.c5.b + 1;
            var sl5 = document.getElementById('c5-slider-b'); if(sl5) sl5.value = window.SIM_STATE.c5.b;
            window.SIM_ENGINES.c5.render();
          } else if(cid === 'c6') {
            window.SIM_STATE.c6.matchN = (window.SIM_STATE.c6.matchN + 1) > 6 ? 1 : window.SIM_STATE.c6.matchN + 1;
            var sl6 = document.getElementById('c6-slider-n'); if(sl6) sl6.value = window.SIM_STATE.c6.matchN;
            window.SIM_ENGINES.c6.render();
          }
        }, 1000 / window.SIM_STATE.speed);
      } else {
        clearInterval(window.SIM_STATE.timer);
      }
    };
  }

  if(rBtn) {
    rBtn.onclick = function() {
      clearInterval(window.SIM_STATE.timer);
      window.SIM_STATE.isPlaying = false;
      if(pBtn) pBtn.textContent = '▶ Play';
      var cid = window.SIM_STATE.currentConcept;
      if(window.SIM_ENGINES[cid] && window.SIM_ENGINES[cid].setPreset) {
        window.SIM_ENGINES[cid].setPreset(0);
      }
    };
  }

  if(sBtn) {
    sBtn.onclick = function() {
      var cid = window.SIM_STATE.currentConcept;
      if(cid === 'c3') {
        window.SIM_STATE.c3.months = (window.SIM_STATE.c3.months + 1) > 12 ? 0 : window.SIM_STATE.c3.months + 1;
        var sl = document.getElementById('c3-slider-n'); if(sl) sl.value = window.SIM_STATE.c3.months;
        window.SIM_ENGINES.c3.render();
      } else if(cid === 'c6') {
        window.SIM_STATE.c6.matchN = (window.SIM_STATE.c6.matchN + 1) > 6 ? 1 : window.SIM_STATE.c6.matchN + 1;
        var sl6 = document.getElementById('c6-slider-n'); if(sl6) sl6.value = window.SIM_STATE.c6.matchN;
        window.SIM_ENGINES.c6.render();
      }
    };
  }

  // Presets
  var p0 = document.getElementById('sim-preset-0');
  var p1 = document.getElementById('sim-preset-1');
  var p2 = document.getElementById('sim-preset-2');
  if(p0) p0.onclick = function() { var cid = window.SIM_STATE.currentConcept; if(window.SIM_ENGINES[cid]) window.SIM_ENGINES[cid].setPreset(0); };
  if(p1) p1.onclick = function() { var cid = window.SIM_STATE.currentConcept; if(window.SIM_ENGINES[cid]) window.SIM_ENGINES[cid].setPreset(1); };
  if(p2) p2.onclick = function() { var cid = window.SIM_STATE.currentConcept; if(window.SIM_ENGINES[cid]) window.SIM_ENGINES[cid].setPreset(2); };
};

// Mount active lab
window.mountSimulation = function(conceptId, container) {
  window.SIM_STATE.currentConcept = conceptId;
  clearInterval(window.SIM_STATE.timer);
  window.SIM_STATE.isPlaying = false;
  var engine = window.SIM_ENGINES[conceptId];
  if (engine && engine.init) {
    engine.init(container);
    window.initSimControls();
  }
};
