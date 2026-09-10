
// =========================================================================
// IEMH101: ORIENTING YOURSELF — THE USE OF COORDINATES
// Interactive Geometric Manipulatives & Laboratory Engines
// =========================================================================

window.SIM_STATE = {
  currentConcept: 'c1',
  isPlaying: false,
  timer: null,
  scrubberVal: 0,
  speed: 1,
  // Concept-specific states
  c1: { x: 3, y: 4, targetName: 'Granary (3, 4)' },
  c2: { doorX: 10, doorW: 1.5, bathY: 1.5, bathH: 2.5, tableX: 8, tableY: 7 },
  c3: { px: 3, py: -5, showReflection: true },
  c4: { mode: 'h', x1: -3, x2: -7, y: 4, y1: 1, y2: 7, x: 2 },
  c5: { ax: 3, ay: 4, bx: 7, by: 1, reflectY: false },
  c6: { mode: 'collision', c1x: 100, c1y: 150, r1: 80, c2x: 250, c2y: 230, r2: 100, m_ax: -3, m_ay: -4, m_bx: 6, m_by: 8 }
};

window.SIM_ENGINES = {

  // -----------------------------------------------------------------------
  // LAB 1: HARAPPAN URBAN GRID NAVIGATOR (pp. 1–3)
  // -----------------------------------------------------------------------
  c1: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🏛️ Ancient Harappan Street Grid Navigator (10m Intervals)</div>
            <div style="font-size:13px;color:#94a3b8;">Central Citadel Origin O(0, 0)</div>
          </div>
          <div id="c1-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">East–West Position (x-axis): <b id="c1-x-val" style="color:#38bdf8;">+3 blocks</b></label>
              <input type="range" id="c1-slider-x" min="-8" max="8" value="3" step="1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">North–South Position (y-axis): <b id="c1-y-val" style="color:#38bdf8;">+4 blocks</b></label>
              <input type="range" id="c1-slider-y" min="-8" max="8" value="4" step="1" style="width:100%;">
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c1-slider-x').addEventListener('input', function(e) {
        window.SIM_STATE.c1.x = parseInt(e.target.value);
        window.SIM_STATE.c1.targetName = 'Custom Address (' + window.SIM_STATE.c1.x + ', ' + window.SIM_STATE.c1.y + ')';
        self.render();
      });
      document.getElementById('c1-slider-y').addEventListener('input', function(e) {
        window.SIM_STATE.c1.y = parseInt(e.target.value);
        window.SIM_STATE.c1.targetName = 'Custom Address (' + window.SIM_STATE.c1.x + ', ' + window.SIM_STATE.c1.y + ')';
        self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c1;
      var W = 720, H = 340;
      var cx = W / 2, cy = H / 2;
      var scale = 20; // 20 px per block

      document.getElementById('c1-x-val').textContent = (state.x >= 0 ? '+' : '') + state.x + ' blocks (' + (state.x * 10) + ' m ' + (state.x >= 0 ? 'East' : 'West') + ')';
      document.getElementById('c1-y-val').textContent = (state.y >= 0 ? '+' : '') + state.y + ' blocks (' + (state.y * 10) + ' m ' + (state.y >= 0 ? 'North' : 'South') + ')';

      var px = cx + state.x * scale;
      var py = cy - state.y * scale;

      var distBlocks = Math.sqrt(state.x * state.x + state.y * state.y);
      var distMetres = distBlocks * 10;
      var manhattanBlocks = Math.abs(state.x) + Math.abs(state.y);

      var landmarks = [
        { name: "Citadel O(0, 0)", x: 0, y: 0, color: "#f59e0b" },
        { name: "Granary (3, 4)", x: 3, y: 4, color: "#10b981" },
        { name: "Bead Factory (-4, 3)", x: -4, y: 3, color: "#a855f7" },
        { name: "Dockyard (-6, -8)", x: -6, y: -8, color: "#06b6d4" },
        { name: "Market (5, -3)", x: 5, y: -3, color: "#ec4899" }
      ];

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';
      
      // Background Grid
      for(var i = -16; i <= 16; i++) {
        var gx = cx + i * scale;
        var gy = cy + i * scale;
        if(gx >= 0 && gx <= W) {
          svg += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + H + '" stroke="#334155" stroke-width="' + (i===0?2:0.75) + '" stroke-dasharray="' + (i===0?'none':'2,2') + '"/>';
        }
        if(gy >= 0 && gy <= H) {
          svg += '<line x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '" stroke="#334155" stroke-width="' + (i===0?2:0.75) + '" stroke-dasharray="' + (i===0?'none':'2,2') + '"/>';
        }
      }

      // Axes labels
      svg += '<text x="' + (W - 40) + '" y="' + (cy - 8) + '" fill="#94a3b8" font-size="12" font-weight="700">East (+x)</text>';
      svg += '<text x="12" y="' + (cy - 8) + '" fill="#94a3b8" font-size="12" font-weight="700">West (-x)</text>';
      svg += '<text x="' + (cx + 10) + '" y="20" fill="#94a3b8" font-size="12" font-weight="700">North (+y)</text>';
      svg += '<text x="' + (cx + 10) + '" y="' + (H - 12) + '" fill="#94a3b8" font-size="12" font-weight="700">South (-y)</text>';

      // Landmarks
      landmarks.forEach(function(l) {
        var lx = cx + l.x * scale;
        var ly = cy - l.y * scale;
        if(lx >= 10 && lx <= W-10 && ly >= 10 && ly <= H-10) {
          svg += '<circle cx="' + lx + '" cy="' + ly + '" r="5" fill="' + l.color + '" opacity="0.6"/>';
          svg += '<text x="' + (lx + 8) + '" y="' + (ly + 4) + '" fill="' + l.color + '" font-size="11" font-weight="600">' + l.name + '</text>';
        }
      });

      // Path from Origin to Cart
      // Along street grid (Manhattan)
      svg += '<path d="M ' + cx + ' ' + cy + ' L ' + px + ' ' + cy + ' L ' + px + ' ' + py + '" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,4"/>';

      // Direct displacement line (Euclidean)
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + px + '" y2="' + py + '" stroke="#38bdf8" stroke-width="2.5"/>';

      // Cart location
      svg += '<circle cx="' + px + '" cy="' + py + '" r="8" fill="#38bdf8" stroke="#ffffff" stroke-width="2"/>';
      svg += '<text x="' + (px + 12) + '" y="' + (py - 8) + '" fill="#38bdf8" font-size="13" font-weight="700">Cart (' + state.x + ', ' + state.y + ')</text>';

      // Origin badge
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#f59e0b" stroke="#ffffff" stroke-width="2"/>';

      svg += '</svg>';
      document.getElementById('c1-svg-box').innerHTML = svg;

      // Update readout
      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Current Address:</b> <span style="color:#38bdf8;">(${state.x}, ${state.y})</span></div>
            <div><b>Grid Street Distance:</b> <span style="color:#f59e0b;">${manhattanBlocks} blocks (${manhattanBlocks * 10} m)</span></div>
            <div><b>Straight-Line Distance:</b> <span style="color:#10b981;">${distBlocks.toFixed(2)} blocks (${distMetres.toFixed(1)} m)</span></div>
            <div><b>Displacement Formula:</b> √(x² + y²) = √(${state.x * state.x} + ${state.y * state.y})</div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>Urban Grid Verification:</strong> Moving to coordinate address (${state.x}, ${state.y}) requires navigating <b>${manhattanBlocks} blocks</b> along the orthogonal street corridors. 
          By the Baudhāyana–Pythagoras theorem, the crow-flies Euclidean displacement is <b>${distMetres.toFixed(1)} metres</b> (ratio of street path to direct flight: ${(manhattanBlocks * 10 / (distMetres || 1)).toFixed(2)}x).
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c1.x = 0; window.SIM_STATE.c1.y = 0; }
      else if(idx === 1) { window.SIM_STATE.c1.x = 3; window.SIM_STATE.c1.y = 4; }
      else if(idx === 2) { window.SIM_STATE.c1.x = -6; window.SIM_STATE.c1.y = -8; }
      document.getElementById('c1-slider-x').value = window.SIM_STATE.c1.x;
      document.getElementById('c1-slider-y').value = window.SIM_STATE.c1.y;
      this.render();
    }
  },

  // -----------------------------------------------------------------------
  // LAB 2: REIAAN'S ROOM FLOORPLANNER & 1D AXES (pp. 3–5)
  // -----------------------------------------------------------------------
  c2: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">📐 Reiaan's Room Floorplan Workbench & 1D Axis Snapper</div>
            <div style="font-size:13px;color:#94a3b8;">Origin Corner O(0, 0)</div>
          </div>
          <div id="c2-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Main Door D₁R₁ on Wall (x-axis): <b id="c2-door-val" style="color:#38bdf8;">1.5 m wide</b></label>
              <input type="range" id="c2-slider-door" min="1.0" max="2.5" value="1.5" step="0.1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Bathroom Door B₁B₂ on Wall (y-axis): <b id="c2-bath-val" style="color:#38bdf8;">2.5 m wide</b></label>
              <input type="range" id="c2-slider-bath" min="1.0" max="3.5" value="2.5" step="0.1" style="width:100%;">
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c2-slider-door').addEventListener('input', function(e) {
        window.SIM_STATE.c2.doorW = parseFloat(e.target.value);
        self.render();
      });
      document.getElementById('c2-slider-bath').addEventListener('input', function(e) {
        window.SIM_STATE.c2.bathH = parseFloat(e.target.value);
        self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c2;
      var W = 720, H = 340;
      var ox = 80, oy = 280;
      var scale = 40; // 40px per metre

      document.getElementById('c2-door-val').textContent = state.doorW.toFixed(1) + ' m (ends at R₁(' + (10 + state.doorW).toFixed(1) + ', 0))';
      document.getElementById('c2-bath-val').textContent = state.bathH.toFixed(1) + ' m (ends at B₂(0, ' + (1.5 + state.bathH).toFixed(1) + '))';

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';

      // Wall lines
      svg += '<rect x="' + ox + '" y="' + (oy - 6 * scale) + '" width="' + (14 * scale) + '" height="' + (6 * scale) + '" fill="#1e293b" stroke="#475569" stroke-width="3"/>';

      // Coordinate axes
      svg += '<line x1="' + (ox - 30) + '" y1="' + oy + '" x2="' + (W - 30) + '" y2="' + oy + '" stroke="#60a5fa" stroke-width="2.5"/>';
      svg += '<line x1="' + ox + '" y1="' + (H - 20) + '" x2="' + ox + '" y2="20" stroke="#60a5fa" stroke-width="2.5"/>';

      // Ticks along axes
      for(var m = 0; m <= 14; m++) {
        var tx = ox + m * scale;
        svg += '<line x1="' + tx + '" y1="' + (oy - 4) + '" x2="' + tx + '" y2="' + (oy + 4) + '" stroke="#94a3b8" stroke-width="1.5"/>';
        if(m % 2 === 0) svg += '<text x="' + tx + '" y="' + (oy + 18) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + m + '</text>';
      }
      for(var n = 0; n <= 6; n++) {
        var ty = oy - n * scale;
        svg += '<line x1="' + (ox - 4) + '" y1="' + ty + '" x2="' + (ox + 4) + '" y2="' + ty + '" stroke="#94a3b8" stroke-width="1.5"/>';
        if(n > 0) svg += '<text x="' + (ox - 12) + '" y="' + (ty + 4) + '" fill="#94a3b8" font-size="11" text-anchor="end">' + n + '</text>';
      }

      // Origin
      svg += '<circle cx="' + ox + '" cy="' + oy + '" r="6" fill="#f59e0b"/>';
      svg += '<text x="' + (ox - 15) + '" y="' + (oy + 18) + '" fill="#f59e0b" font-weight="700" font-size="12">O(0, 0)</text>';

      // Main door along x-axis
      var d1x = ox + 10 * scale;
      var r1x = ox + (10 + state.doorW) * scale;
      svg += '<line x1="' + d1x + '" y1="' + oy + '" x2="' + r1x + '" y2="' + oy + '" stroke="#10b981" stroke-width="6"/>';
      svg += '<text x="' + ((d1x + r1x)/2) + '" y="' + (oy - 10) + '" fill="#10b981" font-weight="700" font-size="11" text-anchor="middle">Door D₁R₁ (' + state.doorW.toFixed(1) + ' m)</text>';
      svg += '<circle cx="' + d1x + '" cy="' + oy + '" r="4" fill="#ffffff"/>';
      svg += '<text x="' + d1x + '" y="' + (oy - 22) + '" fill="#ffffff" font-size="10" text-anchor="middle">D₁(10, 0)</text>';
      svg += '<circle cx="' + r1x + '" cy="' + oy + '" r="4" fill="#ffffff"/>';
      svg += '<text x="' + r1x + '" y="' + (oy - 22) + '" fill="#ffffff" font-size="10" text-anchor="middle">R₁(' + (10 + state.doorW).toFixed(1) + ', 0)</text>';

      // Bathroom door along y-axis
      var b1y = oy - 1.5 * scale;
      var b2y = oy - (1.5 + state.bathH) * scale;
      svg += '<line x1="' + ox + '" y1="' + b1y + '" x2="' + ox + '" y2="' + b2y + '" stroke="#a855f7" stroke-width="6"/>';
      svg += '<text x="' + (ox + 10) + '" y="' + ((b1y + b2y)/2) + '" fill="#a855f7" font-weight="700" font-size="11" dominant-baseline="middle">Bath Door B₁B₂ (' + state.bathH.toFixed(1) + ' m)</text>';
      svg += '<circle cx="' + ox + '" cy="' + b1y + '" r="4" fill="#ffffff"/>';
      svg += '<text x="' + (ox - 30) + '" y="' + b1y + '" fill="#ffffff" font-size="10" dominant-baseline="middle">B₁(0, 1.5)</text>';
      svg += '<circle cx="' + ox + '" cy="' + b2y + '" r="4" fill="#ffffff"/>';
      svg += '<text x="' + (ox - 30) + '" y="' + b2y + '" fill="#ffffff" font-size="10" dominant-baseline="middle">B₂(0, ' + (1.5 + state.bathH).toFixed(1) + ')</text>';

      // Study table in room (at (8,9) scaled down or table corners)
      var tbx = ox + 4 * scale, tby = oy - 4 * scale, tbw = 3 * scale, tbh = 2 * scale;
      svg += '<rect x="' + tbx + '" y="' + tby + '" width="' + tbw + '" height="' + tbh + '" fill="#334155" stroke="#f59e0b" stroke-width="2" rx="4"/>';
      svg += '<text x="' + (tbx + tbw/2) + '" y="' + (tby + tbh/2 + 4) + '" fill="#f59e0b" font-weight="700" font-size="11" text-anchor="middle">Study Table (3m × 2m)</text>';

      svg += '</svg>';
      document.getElementById('c2-svg-box').innerHTML = svg;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Main Door Endpoints:</b> <span style="color:#10b981;">D₁(10, 0), R₁(${(10 + state.doorW).toFixed(1)}, 0)</span></div>
            <div><b>Main Door Width:</b> <span style="color:#38bdf8;">|x₂ - x₁| = ${state.doorW.toFixed(1)} m</span></div>
            <div><b>Bath Door Endpoints:</b> <span style="color:#a855f7;">B₁(0, 1.5), B₂(0, ${(1.5 + state.bathH).toFixed(1)})</span></div>
            <div><b>Bath Door Width:</b> <span style="color:#38bdf8;">|y₂ - y₁| = ${state.bathH.toFixed(1)} m</span></div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>1D Axis Property Confirmed:</strong> Every point along the bottom wall has <b>y = 0</b> (horizontal x-axis), while every point along the left wall has <b>x = 0</b> (vertical y-axis). 
          Widths along walls are pure 1D absolute differences: |Δx| and |Δy|.
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c2.doorW = 1.5; window.SIM_STATE.c2.bathH = 2.5; }
      else if(idx === 1) { window.SIM_STATE.c2.doorW = 2.0; window.SIM_STATE.c2.bathH = 1.8; }
      else if(idx === 2) { window.SIM_STATE.c2.doorW = 1.2; window.SIM_STATE.c2.bathH = 3.0; }
      document.getElementById('c2-slider-door').value = window.SIM_STATE.c2.doorW;
      document.getElementById('c2-slider-bath').value = window.SIM_STATE.c2.bathH;
      this.render();
    }
  },

  // -----------------------------------------------------------------------
  // LAB 3: 4-QUADRANT DYNAMIC DARTBOARD (pp. 6–8)
  // -----------------------------------------------------------------------
  c3: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🎯 4-Quadrant Point Explorer & Sign Signature Dartboard</div>
            <div style="font-size:13px;color:#94a3b8;">Non-Commutative Ordered Pair (x, y) vs (y, x)</div>
          </div>
          <div id="c3-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Abscissa x (distance from y-axis): <b id="c3-x-val" style="color:#38bdf8;">+3</b></label>
              <input type="range" id="c3-slider-x" min="-7" max="7" value="3" step="1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Ordinate y (distance from x-axis): <b id="c3-y-val" style="color:#38bdf8;">-5</b></label>
              <input type="range" id="c3-slider-y" min="-7" max="7" value="-5" step="1" style="width:100%;">
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c3-slider-x').addEventListener('input', function(e) {
        window.SIM_STATE.c3.px = parseInt(e.target.value);
        self.render();
      });
      document.getElementById('c3-slider-y').addEventListener('input', function(e) {
        window.SIM_STATE.c3.py = parseInt(e.target.value);
        self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c3;
      var W = 720, H = 340;
      var cx = W / 2, cy = H / 2;
      var scale = 22; // 22px per unit

      var x = state.px, y = state.py;
      document.getElementById('c3-x-val').textContent = (x >= 0 ? '+' : '') + x;
      document.getElementById('c3-y-val').textContent = (y >= 0 ? '+' : '') + y;

      var px = cx + x * scale;
      var py = cy - y * scale;

      // Swap coordinates for Q(y, x)
      var qx = cx + y * scale;
      var qy = cy - x * scale;

      // Determine quadrant
      var quadStr = "";
      var quadColor = "#38bdf8";
      if(x > 0 && y > 0) { quadStr = "Quadrant I (+, +)"; quadColor = "#10b981"; }
      else if(x < 0 && y > 0) { quadStr = "Quadrant II (-, +)"; quadColor = "#f59e0b"; }
      else if(x < 0 && y < 0) { quadStr = "Quadrant III (-, -)"; quadColor = "#ef4444"; }
      else if(x > 0 && y < 0) { quadStr = "Quadrant IV (+, -)"; quadColor = "#a855f7"; }
      else if(x === 0 && y === 0) { quadStr = "Origin O(0, 0)"; quadColor = "#ffffff"; }
      else if(y === 0) { quadStr = "On Horizontal x-axis"; quadColor = "#60a5fa"; }
      else if(x === 0) { quadStr = "On Vertical y-axis"; quadColor = "#60a5fa"; }

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';

      // Quadrant tint boxes
      svg += '<rect x="' + cx + '" y="0" width="' + cx + '" height="' + cy + '" fill="#10b981" opacity="0.04"/>';
      svg += '<rect x="0" y="0" width="' + cx + '" height="' + cy + '" fill="#f59e0b" opacity="0.04"/>';
      svg += '<rect x="0" y="' + cy + '" width="' + cx + '" height="' + cy + '" fill="#ef4444" opacity="0.04"/>';
      svg += '<rect x="' + cx + '" y="' + cy + '" width="' + cx + '" height="' + cy + '" fill="#a855f7" opacity="0.04"/>';

      // Grid lines
      for(var i = -15; i <= 15; i++) {
        var gx = cx + i * scale;
        var gy = cy + i * scale;
        if(gx >= 0 && gx <= W) {
          svg += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + H + '" stroke="#334155" stroke-width="' + (i===0?2.5:0.5) + '"/>';
        }
        if(gy >= 0 && gy <= H) {
          svg += '<line x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '" stroke="#334155" stroke-width="' + (i===0?2.5:0.5) + '"/>';
        }
      }

      // Quadrant labels
      svg += '<text x="' + (cx + 20) + '" y="30" fill="#10b981" font-size="14" font-weight="700">QUADRANT I (+, +)</text>';
      svg += '<text x="20" y="30" fill="#f59e0b" font-size="14" font-weight="700">QUADRANT II (-, +)</text>';
      svg += '<text x="20" y="' + (H - 20) + '" fill="#ef4444" font-size="14" font-weight="700">QUADRANT III (-, -)</text>';
      svg += '<text x="' + (cx + 20) + '" y="' + (H - 20) + '" fill="#a855f7" font-size="14" font-weight="700">QUADRANT IV (+, -)</text>';

      // Dashed projection lines for P(x, y)
      svg += '<line x1="' + px + '" y1="' + cy + '" x2="' + px + '" y2="' + py + '" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4"/>';
      svg += '<line x1="' + cx + '" y1="' + py + '" x2="' + px + '" y2="' + py + '" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4"/>';

      // Swapped Point Q(y, x)
      if(state.showReflection && (x !== y)) {
        svg += '<line x1="' + qx + '" y1="' + cy + '" x2="' + qx + '" y2="' + qy + '" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3,3"/>';
        svg += '<line x1="' + cx + '" y1="' + qy + '" x2="' + qx + '" y2="' + qy + '" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3,3"/>';
        svg += '<circle cx="' + qx + '" cy="' + qy + '" r="6" fill="#f43f5e" stroke="#ffffff" stroke-width="1.5"/>';
        svg += '<text x="' + (qx + 10) + '" y="' + (qy - 6) + '" fill="#f43f5e" font-size="12" font-weight="700">Q(y, x) = (' + y + ', ' + x + ')</text>';
      }

      // Point P(x, y)
      svg += '<circle cx="' + px + '" cy="' + py + '" r="8" fill="' + quadColor + '" stroke="#ffffff" stroke-width="2.5"/>';
      svg += '<text x="' + (px + 12) + '" y="' + (py - 10) + '" fill="' + quadColor + '" font-size="14" font-weight="800">P(' + x + ', ' + y + ')</text>';

      svg += '</svg>';
      document.getElementById('c3-svg-box').innerHTML = svg;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Active Point P:</b> <span style="color:${quadColor};">(${x}, ${y})</span></div>
            <div><b>Region / Quadrant:</b> <span style="color:${quadColor};">${quadStr}</span></div>
            <div><b>Abscissa (from y-axis):</b> ${x}</div>
            <div><b>Ordinate (from x-axis):</b> ${y}</div>
            <div><b>Swapped Pair Q(y, x):</b> <span style="color:#f43f5e;">(${y}, ${x})</span></div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>Ordered Pair Inspection:</strong> Point P(${x}, ${y}) lies in <b>${quadStr}</b>. 
          Notice that swapping the numbers produces Q(${y}, ${x})${x === y ? ' which coincides with P because x = y' : ' which lands in a completely different location'}.
          Coordinates are strictly <em>ordered pairs</em>!
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c3.px = 3; window.SIM_STATE.c3.py = -5; }
      else if(idx === 1) { window.SIM_STATE.c3.px = -5; window.SIM_STATE.c3.py = 3; }
      else if(idx === 2) { window.SIM_STATE.c3.px = -7; window.SIM_STATE.c3.py = -4; }
      document.getElementById('c3-slider-x').value = window.SIM_STATE.c3.px;
      document.getElementById('c3-slider-y').value = window.SIM_STATE.c3.py;
      this.render();
    }
  },

  // -----------------------------------------------------------------------
  // LAB 4: 1D AXIS DISTANCE & ABSOLUTE VALUE BRACKET (pp. 8–9)
  // -----------------------------------------------------------------------
  c4: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">📏 1D Axis Distance & Absolute Value Bracket Lab</div>
            <div style="font-size:13px;color:#94a3b8;">Symmetric Distance: |a - b| = |b - a| ≥ 0</div>
          </div>
          <div id="c4-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Point A Coordinate (x₁): <b id="c4-x1-val" style="color:#38bdf8;">-3</b></label>
              <input type="range" id="c4-slider-x1" min="-10" max="10" value="-3" step="1" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Point B Coordinate (x₂): <b id="c4-x2-val" style="color:#38bdf8;">-7</b></label>
              <input type="range" id="c4-slider-x2" min="-10" max="10" value="-7" step="1" style="width:100%;">
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c4-slider-x1').addEventListener('input', function(e) {
        window.SIM_STATE.c4.x1 = parseInt(e.target.value);
        self.render();
      });
      document.getElementById('c4-slider-x2').addEventListener('input', function(e) {
        window.SIM_STATE.c4.x2 = parseInt(e.target.value);
        self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c4;
      var W = 720, H = 340;
      var cx = W / 2, cy = 170;
      var scale = 28; // 28px per unit

      var x1 = state.x1, x2 = state.x2;
      document.getElementById('c4-x1-val').textContent = x1;
      document.getElementById('c4-x2-val').textContent = x2;

      var p1x = cx + x1 * scale;
      var p2x = cx + x2 * scale;
      var dist = Math.abs(x2 - x1);

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';

      // Axis line
      svg += '<line x1="40" y1="' + cy + '" x2="' + (W - 40) + '" y2="' + cy + '" stroke="#60a5fa" stroke-width="3"/>';

      // Axis Ticks
      for(var i = -11; i <= 11; i++) {
        var tx = cx + i * scale;
        if(tx >= 40 && tx <= W - 40) {
          svg += '<line x1="' + tx + '" y1="' + (cy - 6) + '" x2="' + tx + '" y2="' + (cy + 6) + '" stroke="#94a3b8" stroke-width="' + (i===0?2.5:1) + '"/>';
          svg += '<text x="' + tx + '" y="' + (cy + 22) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + i + '</text>';
        }
      }

      // Origin tick
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#f59e0b"/>';
      svg += '<text x="' + cx + '" y="' + (cy + 38) + '" fill="#f59e0b" font-weight="700" font-size="11" text-anchor="middle">Origin 0</text>';

      // Segment highlight bracket
      var minX = Math.min(p1x, p2x), maxX = Math.max(p1x, p2x);
      svg += '<line x1="' + minX + '" y1="' + (cy - 30) + '" x2="' + maxX + '" y2="' + (cy - 30) + '" stroke="#10b981" stroke-width="4"/>';
      svg += '<line x1="' + minX + '" y1="' + (cy - 40) + '" x2="' + minX + '" y2="' + (cy - 20) + '" stroke="#10b981" stroke-width="3"/>';
      svg += '<line x1="' + maxX + '" y1="' + (cy - 40) + '" x2="' + maxX + '" y2="' + (cy - 20) + '" stroke="#10b981" stroke-width="3"/>';
      svg += '<text x="' + ((minX + maxX)/2) + '" y="' + (cy - 48) + '" fill="#10b981" font-size="16" font-weight="800" text-anchor="middle">Distance = |' + x2 + ' - (' + x1 + ')| = ' + dist + ' units</text>';

      // Point A
      svg += '<circle cx="' + p1x + '" cy="' + cy + '" r="9" fill="#38bdf8" stroke="#ffffff" stroke-width="2.5"/>';
      svg += '<text x="' + p1x + '" y="' + (cy - 12) + '" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">A(' + x1 + ')</text>';

      // Point B
      svg += '<circle cx="' + p2x + '" cy="' + cy + '" r="9" fill="#ec4899" stroke="#ffffff" stroke-width="2.5"/>';
      svg += '<text x="' + p2x + '" y="' + (cy - 12) + '" fill="#ec4899" font-size="14" font-weight="800" text-anchor="middle">B(' + x2 + ')</text>';

      svg += '</svg>';
      document.getElementById('c4-svg-box').innerHTML = svg;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Point A (x₁):</b> ${x1}</div>
            <div><b>Point B (x₂):</b> ${x2}</div>
            <div><b>Forward Difference:</b> x₂ - x₁ = ${x2 - x1}</div>
            <div><b>Reverse Difference:</b> x₁ - x₂ = ${x1 - x2}</div>
            <div><b>Absolute Distance:</b> <span style="color:#10b981;font-weight:700;">|x₂ - x₁| = ${dist} units</span></div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>1D Distance Invariance:</strong> Distance is always non-negative: <b>|${x2} - (${x1})| = |${x1} - (${x2})| = ${dist} units</b>.
          ${(x1 < 0 && x2 < 0) ? 'Both coordinates are negative, demonstrating how subtracting a negative number adds positive distance: ' + Math.max(x1,x2) + ' - (' + Math.min(x1,x2) + ') = ' + dist + '.' : 'Geometric length ignores vector direction.'}
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c4.x1 = -3; window.SIM_STATE.c4.x2 = -7; }
      else if(idx === 1) { window.SIM_STATE.c4.x1 = 8; window.SIM_STATE.c4.x2 = 11; }
      else if(idx === 2) { window.SIM_STATE.c4.x1 = -5; window.SIM_STATE.c4.x2 = 5; }
      document.getElementById('c4-slider-x1').value = window.SIM_STATE.c4.x1;
      document.getElementById('c4-slider-x2').value = window.SIM_STATE.c4.x2;
      this.render();
    }
  },

  // -----------------------------------------------------------------------
  // LAB 5: BAUDHĀYANA-PYTHAGORAS 2D DISTANCE BENCH (pp. 9–11)
  // -----------------------------------------------------------------------
  c5: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">📐 Baudhāyana–Pythagoras 2D Distance Formula Bench</div>
            <div style="font-size:13px;color:#94a3b8;">d = √[(x₂ - x₁)² + (y₂ - y₁)²]</div>
          </div>
          <div id="c5-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Point A (x₁, y₁): <b id="c5-a-val" style="color:#38bdf8;">(3, 4)</b></label>
              <div style="display:flex;gap:6px;">
                <input type="range" id="c5-slider-ax" min="-8" max="8" value="3" step="1" style="width:50%;">
                <input type="range" id="c5-slider-ay" min="-8" max="8" value="4" step="1" style="width:50%;">
              </div>
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Point B (x₂, y₂): <b id="c5-b-val" style="color:#ec4899;">(7, 1)</b></label>
              <div style="display:flex;gap:6px;">
                <input type="range" id="c5-slider-bx" min="-8" max="8" value="7" step="1" style="width:50%;">
                <input type="range" id="c5-slider-by" min="-8" max="8" value="1" step="1" style="width:50%;">
              </div>
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c5-slider-ax').addEventListener('input', function(e) {
        window.SIM_STATE.c5.ax = parseInt(e.target.value); self.render();
      });
      document.getElementById('c5-slider-ay').addEventListener('input', function(e) {
        window.SIM_STATE.c5.ay = parseInt(e.target.value); self.render();
      });
      document.getElementById('c5-slider-bx').addEventListener('input', function(e) {
        window.SIM_STATE.c5.bx = parseInt(e.target.value); self.render();
      });
      document.getElementById('c5-slider-by').addEventListener('input', function(e) {
        window.SIM_STATE.c5.by = parseInt(e.target.value); self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c5;
      var W = 720, H = 340;
      var cx = W / 2, cy = H / 2;
      var scale = 20; // 20px per unit

      var ax = state.ax, ay = state.ay;
      var bx = state.bx, by = state.by;
      var cx_vert = bx, cy_vert = ay; // right-angle corner vertex C(x2, y1)

      document.getElementById('c5-a-val').textContent = '(' + ax + ', ' + ay + ')';
      document.getElementById('c5-b-val').textContent = '(' + bx + ', ' + by + ')';

      var pax = cx + ax * scale, pay = cy - ay * scale;
      var pbx = cx + bx * scale, pby = cy - by * scale;
      var pcx = cx + cx_vert * scale, pcy = cy - cy_vert * scale;

      var dx = Math.abs(bx - ax);
      var dy = Math.abs(by - ay);
      var dist = Math.sqrt(dx * dx + dy * dy);

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';

      // Axes
      svg += '<line x1="0" y1="' + cy + '" x2="' + W + '" y2="' + cy + '" stroke="#334155" stroke-width="2"/>';
      svg += '<line x1="' + cx + '" y1="0" x2="' + cx + '" y2="' + H + '" stroke="#334155" stroke-width="2"/>';

      // Right-angled triangle fill
      svg += '<polygon points="' + pax + ',' + pay + ' ' + pcx + ',' + pcy + ' ' + pbx + ',' + pby + '" fill="#38bdf8" opacity="0.12"/>';

      // Legs
      svg += '<line x1="' + pax + '" y1="' + pay + '" x2="' + pcx + '" y2="' + pcy + '" stroke="#f59e0b" stroke-width="3" stroke-dasharray="3,3"/>';
      svg += '<line x1="' + pcx + '" y1="' + pcy + '" x2="' + pbx + '" y2="' + pby + '" stroke="#a855f7" stroke-width="3" stroke-dasharray="3,3"/>';

      // Hypotenuse AB
      svg += '<line x1="' + pax + '" y1="' + pay + '" x2="' + pbx + '" y2="' + pby + '" stroke="#10b981" stroke-width="4"/>';

      // Labels on legs
      svg += '<text x="' + ((pax + pcx)/2) + '" y="' + (pay - 8) + '" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">Δx = |' + bx + ' - ' + ax + '| = ' + dx + '</text>';
      svg += '<text x="' + (pcx + 10) + '" y="' + ((pcy + pby)/2) + '" fill="#a855f7" font-size="12" font-weight="700" dominant-baseline="middle">Δy = |' + by + ' - ' + ay + '| = ' + dy + '</text>';

      // Hypotenuse label
      svg += '<text x="' + ((pax + pbx)/2 - 10) + '" y="' + ((pay + pby)/2 - 10) + '" fill="#10b981" font-size="15" font-weight="800">d = ' + dist.toFixed(2) + '</text>';

      // Right angle box at C
      var rsize = 12;
      var sgnX = (pax < pcx) ? -1 : 1;
      var sgnY = (pby < pcy) ? -1 : 1;
      svg += '<path d="M ' + (pcx + sgnX * rsize) + ' ' + pcy + ' L ' + (pcx + sgnX * rsize) + ' ' + (pcy + sgnY * rsize) + ' L ' + pcx + ' ' + (pcy + sgnY * rsize) + '" fill="none" stroke="#94a3b8" stroke-width="1.5"/>';

      // Point vertices
      svg += '<circle cx="' + pax + '" cy="' + pay + '" r="7" fill="#38bdf8" stroke="#fff" stroke-width="2"/>';
      svg += '<text x="' + (pax - 12) + '" y="' + (pay - 10) + '" fill="#38bdf8" font-weight="700" font-size="13">A(' + ax + ', ' + ay + ')</text>';

      svg += '<circle cx="' + pbx + '" cy="' + pby + '" r="7" fill="#ec4899" stroke="#fff" stroke-width="2"/>';
      svg += '<text x="' + (pbx + 10) + '" y="' + (pby + 16) + '" fill="#ec4899" font-weight="700" font-size="13">B(' + bx + ', ' + by + ')</text>';

      svg += '<circle cx="' + pcx + '" cy="' + pcy + '" r="5" fill="#94a3b8"/>';
      svg += '<text x="' + (pcx + 8) + '" y="' + (pcy - 8) + '" fill="#94a3b8" font-size="11">C(' + cx_vert + ', ' + cy_vert + ')</text>';

      svg += '</svg>';
      document.getElementById('c5-svg-box').innerHTML = svg;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Horizontal Leg Δx:</b> |${bx} - (${ax})| = ${dx}</div>
            <div><b>Vertical Leg Δy:</b> |${by} - (${ay})| = ${dy}</div>
            <div><b>Sum of Squares:</b> ${dx}² + ${dy}² = ${dx * dx + dy * dy}</div>
            <div><b>Euclidean Distance d:</b> <span style="color:#10b981;font-weight:700;">√${dx * dx + dy * dy} ≈ ${dist.toFixed(3)} units</span></div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>Baudhāyana–Pythagoras Derivation:</strong> In right-angled triangle ACB, 
          Hypotenuse² = Base² + Altitude² => d² = (${dx})² + (${dy})² = ${dx * dx} + ${dy * dy} = <b>${dx * dx + dy * dy}</b>. 
          Therefore, <b>d = √${dx * dx + dy * dy} ≈ ${dist.toFixed(2)} units</b>.
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c5.ax = 3; window.SIM_STATE.c5.ay = 4; window.SIM_STATE.c5.bx = 7; window.SIM_STATE.c5.by = 1; }
      else if(idx === 1) { window.SIM_STATE.c5.ax = 0; window.SIM_STATE.c5.ay = 0; window.SIM_STATE.c5.bx = 5; window.SIM_STATE.c5.by = -12; }
      else if(idx === 2) { window.SIM_STATE.c5.ax = 2; window.SIM_STATE.c5.ay = -3; window.SIM_STATE.c5.bx = -4; window.SIM_STATE.c5.by = 5; }
      document.getElementById('c5-slider-ax').value = window.SIM_STATE.c5.ax;
      document.getElementById('c5-slider-ay').value = window.SIM_STATE.c5.ay;
      document.getElementById('c5-slider-bx').value = window.SIM_STATE.c5.bx;
      document.getElementById('c5-slider-by').value = window.SIM_STATE.c5.by;
      this.render();
    }
  },

  // -----------------------------------------------------------------------
  // LAB 6: COLLISION DETECTION, MIDPOINTS & CIRCLES STUDIO (pp. 12–15)
  // -----------------------------------------------------------------------
  c6: {
    init: function(container) {
      container.innerHTML = `
        <div style="background:#0f172a;border-radius:12px;padding:16px;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="font-weight:700;font-size:15px;color:#38bdf8;">🎮 Screen Graphics Collision & Midpoint Engine (Ex 15)</div>
            <div style="font-size:13px;color:#94a3b8;">800×600 Screen Boundary & Hitbox Lab</div>
          </div>
          <div id="c6-svg-box" style="position:relative;background:#1e293b;border-radius:8px;border:1px solid #334155;overflow:hidden;"></div>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px;">
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Icon A Center X: <b id="c6-c1x-val" style="color:#38bdf8;">100 px</b></label>
              <input type="range" id="c6-slider-c1x" min="80" max="720" value="100" step="10" style="width:100%;">
            </div>
            <div style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;">
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">Icon B Center X: <b id="c6-c2x-val" style="color:#ec4899;">250 px</b></label>
              <input type="range" id="c6-slider-c2x" min="100" max="700" value="250" step="10" style="width:100%;">
            </div>
          </div>
        </div>
      `;

      var self = this;
      document.getElementById('c6-slider-c1x').addEventListener('input', function(e) {
        window.SIM_STATE.c6.c1x = parseInt(e.target.value); self.render();
      });
      document.getElementById('c6-slider-c2x').addEventListener('input', function(e) {
        window.SIM_STATE.c6.c2x = parseInt(e.target.value); self.render();
      });

      this.render();
    },

    render: function() {
      var state = window.SIM_STATE.c6;
      var W = 720, H = 340;
      // Screen is 800 x 600, scale down to fit 720 x 340
      var sc = 0.5; // 800 * 0.5 = 400, 600 * 0.5 = 300
      var ox = (W - 800 * sc) / 2; // 160
      var oy = H - (H - 600 * sc) / 2; // 320

      var ax = state.c1x, ay = state.c1y, r1 = state.r1;
      var bx = state.c2x, by = state.c2y, r2 = state.r2;

      document.getElementById('c6-c1x-val').textContent = ax + ' px';
      document.getElementById('c6-c2x-val').textContent = bx + ' px';

      // Distance between centers
      var d = Math.sqrt((bx - ax)*(bx - ax) + (by - ay)*(by - ay));
      var isColliding = d <= (r1 + r2);

      // Midpoint between centers
      var mx = (ax + bx) / 2;
      var my = (ay + by) / 2;

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="340" style="display:block;">';

      // Screen border (800 x 600)
      var sw = 800 * sc, sh = 600 * sc;
      var sx = ox, sy = oy - sh;
      svg += '<rect x="' + sx + '" y="' + sy + '" width="' + sw + '" height="' + sh + '" fill="#090d16" stroke="#475569" stroke-width="2.5" rx="6"/>';
      svg += '<text x="' + (sx + 8) + '" y="' + (sy + 18) + '" fill="#94a3b8" font-size="11">Computer Screen (800 × 600 px)</text>';
      svg += '<text x="' + (sx + 8) + '" y="' + (oy - 8) + '" fill="#f59e0b" font-size="11">Origin O(0, 0)</text>';

      // Screen coords to SVG coords
      var toSvgX = function(x) { return sx + x * sc; };
      var toSvgY = function(y) { return oy - y * sc; };

      var pax = toSvgX(ax), pay = toSvgY(ay);
      var pbx = toSvgX(bx), pby = toSvgY(by);
      var pmx = toSvgX(mx), pmy = toSvgY(my);

      // Circle A
      svg += '<circle cx="' + pax + '" cy="' + pay + '" r="' + (r1 * sc) + '" fill="' + (isColliding ? 'rgba(239,68,68,0.25)' : 'rgba(56,189,248,0.2)') + '" stroke="' + (isColliding ? '#ef4444' : '#38bdf8') + '" stroke-width="2"/>';
      svg += '<circle cx="' + pax + '" cy="' + pay + '" r="4" fill="#38bdf8"/>';
      svg += '<text x="' + pax + '" y="' + (pay - r1*sc - 6) + '" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">Icon A(100, 150) r=80</text>';

      // Circle B
      svg += '<circle cx="' + pbx + '" cy="' + pby + '" r="' + (r2 * sc) + '" fill="' + (isColliding ? 'rgba(239,68,68,0.25)' : 'rgba(236,72,153,0.2)') + '" stroke="' + (isColliding ? '#ef4444' : '#ec4899') + '" stroke-width="2"/>';
      svg += '<circle cx="' + pbx + '" cy="' + pby + '" r="4" fill="#ec4899"/>';
      svg += '<text x="' + pbx + '" y="' + (pby - r2*sc - 6) + '" fill="#ec4899" font-size="11" font-weight="700" text-anchor="middle">Icon B(' + bx + ', ' + by + ') r=100</text>';

      // Segment joining centers
      svg += '<line x1="' + pax + '" y1="' + pay + '" x2="' + pbx + '" y2="' + pby + '" stroke="' + (isColliding ? '#ef4444' : '#10b981') + '" stroke-width="2.5" stroke-dasharray="3,3"/>';

      // Midpoint M
      svg += '<circle cx="' + pmx + '" cy="' + pmy + '" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>';
      svg += '<text x="' + pmx + '" y="' + (pmy + 16) + '" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">Midpoint M(' + mx + ', ' + my + ')</text>';

      // Collision Banner
      var bannerColor = isColliding ? "#ef4444" : "#10b981";
      var bannerText = isColliding ? "💥 COLLISION DETECTED! (d ≤ r₁ + r₂)" : "✅ CLEAR! NO OVERLAP (d > r₁ + r₂)";
      svg += '<rect x="' + (W/2 - 170) + '" y="12" width="340" height="28" fill="' + bannerColor + '" rx="14"/>';
      svg += '<text x="' + (W/2) + '" y="31" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle">' + bannerText + '</text>';

      svg += '</svg>';
      document.getElementById('c6-svg-box').innerHTML = svg;

      var readout = document.getElementById('lab-readout');
      if (readout) {
        readout.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            <div><b>Center Distance d:</b> <span style="color:${bannerColor};font-weight:700;">${d.toFixed(1)} px</span></div>
            <div><b>Sum of Radii (r₁ + r₂):</b> 80 + 100 = 180 px</div>
            <div><b>Segment Midpoint M:</b> (${mx.toFixed(1)}, ${my.toFixed(1)})</div>
            <div><b>Intersection Status:</b> <span style="color:${bannerColor};">${isColliding ? 'YES (Intersecting)' : 'NO (Clear)'}</span></div>
          </div>
        `;
      }

      var verdict = document.getElementById('lab-verdict');
      if (verdict) {
        verdict.innerHTML = `
          <strong>Graphics Collision Verdict:</strong> For centers A(${ax}, ${ay}) and B(${bx}, ${by}), 
          the center-to-center distance is <b>d = ${d.toFixed(1)} px</b>. 
          Comparing with r₁ + r₂ = 180 px: ${isColliding ? 'Since d = ' + d.toFixed(1) + ' ≤ 180, the icons overlap and collide!' : 'Since d = ' + d.toFixed(1) + ' > 180, the icons do not collide.'}
          Both circular sprites lie strictly within the 800×600 screen boundary.
        `;
      }
    },

    setPreset: function(idx) {
      if(idx === 0) { window.SIM_STATE.c6.c1x = 100; window.SIM_STATE.c6.c2x = 250; }
      else if(idx === 1) { window.SIM_STATE.c6.c1x = 100; window.SIM_STATE.c6.c2x = 350; }
      else if(idx === 2) { window.SIM_STATE.c6.c1x = 150; window.SIM_STATE.c6.c2x = 220; }
      document.getElementById('c6-slider-c1x').value = window.SIM_STATE.c6.c1x;
      document.getElementById('c6-slider-c2x').value = window.SIM_STATE.c6.c2x;
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
          if(cid === 'c1') {
            window.SIM_STATE.c1.x = (window.SIM_STATE.c1.x + 1) > 8 ? -8 : window.SIM_STATE.c1.x + 1;
            var sl = document.getElementById('c1-slider-x');
            if(sl) sl.value = window.SIM_STATE.c1.x;
            window.SIM_ENGINES.c1.render();
          } else if(cid === 'c3') {
            window.SIM_STATE.c3.px = (window.SIM_STATE.c3.px + 1) > 7 ? -7 : window.SIM_STATE.c3.px + 1;
            var sl3 = document.getElementById('c3-slider-x');
            if(sl3) sl3.value = window.SIM_STATE.c3.px;
            window.SIM_ENGINES.c3.render();
          } else if(cid === 'c4') {
            window.SIM_STATE.c4.x2 = (window.SIM_STATE.c4.x2 + 1) > 10 ? -10 : window.SIM_STATE.c4.x2 + 1;
            var sl4 = document.getElementById('c4-slider-x2');
            if(sl4) sl4.value = window.SIM_STATE.c4.x2;
            window.SIM_ENGINES.c4.render();
          } else if(cid === 'c5') {
            window.SIM_STATE.c5.bx = (window.SIM_STATE.c5.bx + 1) > 8 ? -8 : window.SIM_STATE.c5.bx + 1;
            var sl5 = document.getElementById('c5-slider-bx');
            if(sl5) sl5.value = window.SIM_STATE.c5.bx;
            window.SIM_ENGINES.c5.render();
          } else if(cid === 'c6') {
            window.SIM_STATE.c6.c2x = (window.SIM_STATE.c6.c2x + 10) > 600 ? 150 : window.SIM_STATE.c6.c2x + 10;
            var sl6 = document.getElementById('c6-slider-c2x');
            if(sl6) sl6.value = window.SIM_STATE.c6.c2x;
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
      if(cid === 'c1') {
        window.SIM_STATE.c1.x = (window.SIM_STATE.c1.x + 1) > 8 ? -8 : window.SIM_STATE.c1.x + 1;
        var sl = document.getElementById('c1-slider-x'); if(sl) sl.value = window.SIM_STATE.c1.x;
        window.SIM_ENGINES.c1.render();
      } else if(cid === 'c5') {
        window.SIM_STATE.c5.bx = (window.SIM_STATE.c5.bx + 1) > 8 ? -8 : window.SIM_STATE.c5.bx + 1;
        var sl5 = document.getElementById('c5-slider-bx'); if(sl5) sl5.value = window.SIM_STATE.c5.bx;
        window.SIM_ENGINES.c5.render();
      } else if(cid === 'c6') {
        window.SIM_STATE.c6.c2x = (window.SIM_STATE.c6.c2x + 20) > 600 ? 150 : window.SIM_STATE.c6.c2x + 20;
        var sl6 = document.getElementById('c6-slider-c2x'); if(sl6) sl6.value = window.SIM_STATE.c6.c2x;
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
