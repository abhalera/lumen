// Textbook figures used by the exercises, redrawn as SVG from the vector data in
// books/originals/Class12-Physics-Pt2_leph206.pdf (Figs. 14.2, 14.10, 14.13, 14.18).
window.FIGURES = (function(){
  var INK = "#1e293b", MUTED = "#475569", RED = "#dc2626", BLUE = "#2563eb", GREEN = "#059669", AMBER = "#b45309";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function band(x, y, w, h, fill, stroke){
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="' + fill + '"' +
      (stroke ? ' stroke="' + stroke + '" stroke-width="1.5"' : '') + '/>';
  }
  function arrow(x1, y1, x2, y2, color, w){
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    if(len < 4) return "";
    var ux = dx / len, uy = dy / len, hl = Math.min(10, len * 0.5), hw = hl * 0.55;
    var bx = x2 - ux * hl, by = y2 - uy * hl;
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + bx + '" y2="' + by + '" stroke="' + color + '" stroke-width="' + (w || 2) + '" stroke-linecap="round"/>' +
      '<polygon points="' + x2 + ',' + y2 + ' ' + (bx - uy * hw) + ',' + (by + ux * hw) + ' ' + (bx + uy * hw) + ',' + (by - ux * hw) + '" fill="' + color + '"/>';
  }
  function carrier(cx, cy, sign, color){
    return '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="#fff" stroke="' + color + '" stroke-width="1.6"/>' +
      '<text x="' + cx + '" y="' + (cy + 4) + '" fill="' + color + '" font-size="12" text-anchor="middle">' + sign + '</text>';
  }

  var figs = {};

  figs["14.2"] = {
    caption: "Fig. 14.2 — Energy bands of (a) a metal, (b) an insulator and (c) a semiconductor (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 560 250" role="img" aria-label="Band diagrams for metal, insulator and semiconductor">';
      // metal
      s += band(30, 100, 130, 46, "rgba(96,165,250,.55)", BLUE);
      s += band(30, 146, 130, 46, "rgba(96,165,250,.35)", BLUE);
      s += text(95, 128, "overlap", { color: INK, size: 13, weight: 700 });
      s += text(95, 88, "conduction band", { color: BLUE, size: 11 });
      s += text(95, 208, "valence band", { color: BLUE, size: 11 });
      s += text(95, 234, "(a) metal: E_g ≈ 0", { color: INK, size: 13, weight: 700 });
      // insulator
      s += band(215, 62, 130, 40, "rgba(96,165,250,.20)", BLUE);
      s += band(215, 176, 130, 40, "rgba(96,165,250,.70)", BLUE);
      s += arrow(280, 176, 280, 104, GREEN, 2);
      s += text(302, 142, "E_g > 3 eV", { color: GREEN, size: 12, anchor: "start" });
      s += text(280, 50, "empty", { color: MUTED, size: 11 });
      s += text(280, 232, "(b) insulator", { color: INK, size: 13, weight: 700 });
      // semiconductor
      s += band(400, 92, 130, 40, "rgba(96,165,250,.20)", BLUE);
      s += band(400, 166, 130, 40, "rgba(96,165,250,.70)", BLUE);
      s += arrow(465, 166, 465, 134, GREEN, 2);
      s += text(487, 154, "E_g < 3 eV", { color: GREEN, size: 12, anchor: "start" });
      s += text(465, 80, "a few electrons", { color: MUTED, size: 11 });
      s += carrier(430, 112, "−", BLUE);
      s += carrier(445, 186, "+", RED);
      s += text(465, 232, "(c) semiconductor", { color: INK, size: 13, weight: 700 });
      return s + '</svg>';
    }
  };

  figs["14.10"] = {
    caption: "Fig. 14.10 — p–n junction formation: diffusion leaves a depletion region of immobile ions (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 600 260" role="img" aria-label="p-n junction with diffusion, drift and depletion region">';
      s += '<rect x="30" y="60" width="190" height="150" rx="8" fill="rgba(248,113,113,.08)" stroke="' + RED + '" stroke-width="1.4"/>';
      s += '<rect x="380" y="60" width="190" height="150" rx="8" fill="rgba(96,165,250,.08)" stroke="' + BLUE + '" stroke-width="1.4"/>';
      s += '<rect x="220" y="60" width="160" height="150" fill="rgba(148,163,184,.16)" stroke="' + MUTED + '" stroke-width="1.4" stroke-dasharray="6 5"/>';
      s += text(125, 48, "p-region (holes)", { color: RED, weight: 700 });
      s += text(475, 48, "n-region (electrons)", { color: BLUE, weight: 700 });
      s += text(300, 46, "depletion region", { color: MUTED, size: 12 });
      var i;
      for(i = 0; i < 4; i += 1){
        s += carrier(70 + i * 38, 110, "+", RED);
        s += carrier(420 + i * 38, 110, "−", BLUE);
      }
      for(i = 0; i < 3; i += 1){
        s += carrier(246 - i * 22, 165, "−", RED);
        s += carrier(354 + i * 22, 165, "+", BLUE);
      }
      s += arrow(140, 205, 240, 205, RED, 2.4);
      s += text(190, 224, "holes diffuse p → n", { color: RED, size: 12 });
      s += arrow(460, 205, 360, 205, BLUE, 2.4);
      s += text(410, 224, "electrons diffuse n → p", { color: BLUE, size: 12 });
      s += arrow(240, 88, 140, 88, BLUE, 2.2);
      s += arrow(360, 88, 460, 88, RED, 2.2);
      s += text(300, 246, "drift (junction field) opposes diffusion", { color: GREEN, size: 12 });
      return s + '</svg>';
    }
  };

  figs["14.13"] = {
    caption: "Fig. 14.13 — Barrier potential with no bias, forward bias and reverse bias (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 560 250" role="img" aria-label="Barrier height without bias, under forward bias and under reverse bias">';
      function panel(x, h, label, color, note){
        var baseY = 185, halfW = 130, mid = x + halfW / 2, w = 44;
        var d = "M" + x + " " + baseY +
          " L" + (mid - w / 2) + " " + baseY +
          " L" + (mid - w / 2) + " " + (baseY - h) +
          " L" + (mid + w / 2) + " " + (baseY - h) +
          " L" + (mid + w / 2) + " " + baseY +
          " L" + (x + halfW) + " " + baseY;
        var out = '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2.6"/>';
        out += arrow(x + 14, baseY, x + 14, baseY - h, color, 1.8);
        out += text(x + 30, baseY - h / 2, label, { color: color, size: 11, anchor: "start" });
        out += text(mid, 214, note, { color: INK, size: 12 });
        return out;
      }
      s += panel(30, 70, "no bias", MUTED, "barrier V₀ = 0.7 V");
      s += panel(215, 35, "forward bias", GREEN, "barrier V₀ − V");
      s += panel(400, 100, "reverse bias", RED, "barrier V₀ + V");
      s += text(280, 238, "forward bias lowers the barrier and narrows the depletion region", { color: MUTED, size: 12 });
      return s + '</svg>';
    }
  };

  figs["14.18"] = {
    caption: "Fig. 14.18 — Half-wave rectifier: circuit and input/output waveforms (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 580 340" role="img" aria-label="Half-wave rectifier circuit and waveforms">';
      // circuit
      s += text(290, 24, "half-wave rectifier circuit", { color: INK, size: 13, weight: 700 });
      s += '<path d="M60 80 Q95 50 130 80 Q95 110 60 80 Z" fill="none" stroke="' + AMBER + '" stroke-width="2"/>';
      s += '<path d="M60 80 Q95 50 130 80" fill="none" stroke="' + AMBER + '" stroke-width="2"/>';
      s += text(95, 122, "transformer", { color: AMBER, size: 11 });
      s += '<line x1="130" y1="55" x2="230" y2="55" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="130" y1="105" x2="230" y2="105" stroke="' + INK + '" stroke-width="2"/>';
      s += text(180, 45, "A", { color: INK, size: 13, weight: 700 });
      s += text(180, 122, "B", { color: INK, size: 13, weight: 700 });
      s += '<polygon points="230,45 230,65 258,55" fill="none" stroke="' + GREEN + '" stroke-width="2"/>';
      s += '<line x1="258" y1="45" x2="258" y2="65" stroke="' + GREEN + '" stroke-width="2"/>';
      s += text(244, 34, "diode", { color: GREEN, size: 11 });
      s += '<line x1="258" y1="55" x2="410" y2="55" stroke="' + INK + '" stroke-width="2"/>';
      s += '<rect x="410" y="30" width="22" height="50" fill="none" stroke="' + BLUE + '" stroke-width="2"/>';
      s += text(421, 96, "R_L", { color: BLUE, size: 12 });
      s += '<line x1="432" y1="55" x2="470" y2="55" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="470" y1="55" x2="470" y2="105" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="230" y1="105" x2="470" y2="105" stroke="' + INK + '" stroke-width="2"/>';
      // input waveform
      var i, pts = "";
      for(i = 0; i <= 120; i += 1){
        var t = i / 120, x = 60 + t * 200, y = 200 - 40 * Math.sin(2 * Math.PI * t * 2);
        pts += (i ? " " : "") + x + "," + y;
      }
      s += '<polyline points="' + pts + '" fill="none" stroke="' + AMBER + '" stroke-width="2"/>';
      s += text(160, 158, "input a.c.", { color: AMBER, size: 12 });
      s += '<line x1="60" y1="200" x2="260" y2="200" stroke="' + MUTED + '" stroke-width="1" stroke-dasharray="3 3"/>';
      // output waveform
      var out = "";
      for(i = 0; i <= 120; i += 1){
        var t2 = i / 120, x2 = 330 + t2 * 200, v = Math.max(Math.sin(2 * Math.PI * t2 * 2), 0);
        out += (i ? " " : "") + x2 + "," + (200 - 40 * v);
      }
      s += '<polyline points="' + out + '" fill="none" stroke="' + BLUE + '" stroke-width="2.4"/>';
      s += text(430, 158, "half-wave output", { color: BLUE, size: 12 });
      s += '<line x1="330" y1="200" x2="530" y2="200" stroke="' + MUTED + '" stroke-width="1" stroke-dasharray="3 3"/>';
      // full wave
      var full = "";
      for(i = 0; i <= 120; i += 1){
        var t3 = i / 120, x3 = 60 + t3 * 200, v3 = Math.abs(Math.sin(2 * Math.PI * t3 * 2));
        full += (i ? " " : "") + x3 + "," + (300 - 40 * v3);
      }
      s += '<polyline points="' + full + '" fill="none" stroke="' + GREEN + '" stroke-width="2.4"/>';
      s += text(160, 254, "full-wave output (for comparison)", { color: GREEN, size: 12 });
      s += '<line x1="60" y1="300" x2="260" y2="300" stroke="' + MUTED + '" stroke-width="1" stroke-dasharray="3 3"/>';
      s += text(160, 328, "negative half-cycles blocked in half-wave", { color: MUTED, size: 11 });
      return s + '</svg>';
    }
  };

  return figs;
})();
