// Textbook figures used by the exercises of leph202 (Wave Optics), redrawn as SVG
// from the vector data in books/originals/Class12-Physics-Pt2_leph202.pdf.
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa", AMBER = "#f59e0b", GREEN = "#34d399";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function line(x1, y1, x2, y2, color, w, dash){
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="' + (w || 2) + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
  }

  var figs = {};

  figs["10.1"] = {
    caption: "Fig. 10.4 — A monochromatic ray meeting an air–water surface: reflected ray back into air, refracted ray compressed into water (redrawn for Exercise 10.1).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 240" role="img" aria-label="Reflection and refraction of light at a water surface">';
      s += '<rect x="30" y="128" width="320" height="82" fill="rgba(56,189,248,.12)"/>';
      s += line(30, 128, 350, 128, BLUE, 3);
      s += text(190, 118, "air  n = 1.00", {color: MUTED, anchor: "middle"});
      s += text(190, 152, "water  n = 1.33", {color: "#93c5fd", anchor: "middle"});
      s += line(160, 128, 160, 30, MUTED, 1.4, "6 5");
      s += line(60, 30, 160, 128, AMBER, 2.6);
      s += '<polygon points="112,89 121,84 117,76" fill="' + AMBER + '"/>';
      s += line(160, 128, 260, 30, BLUE, 2.6);
      s += '<polygon points="210,80 201,74 196,82" fill="' + BLUE + '"/>';
      s += line(160, 128, 268, 200, GREEN, 2.6);
      s += '<polygon points="215,165 206,160 210,152" fill="' + GREEN + '"/>';
      s += text(120, 66, "incident 589 nm", {color: AMBER, anchor: "end"});
      s += text(228, 62, "reflected 589 nm", {color: BLUE, anchor: "start"});
      s += text(238, 188, "refracted 443 nm", {color: GREEN, anchor: "start"});
      s += text(70, 52, "i = 45°", {color: MUTED, anchor: "start"});
      s += '</svg>';
      return s;
    }
  };

  figs["10.2"] = {
    caption: "Fig. 10.1/10.12 — Wavefront shapes: (a) spherical from a point source, (b) plane after a convex lens with the source at its focus, (c) plane wavefront from a distant star (redrawn for Exercise 10.2).",
    svg: function(){
      var s = '<svg viewBox="0 0 400 240" role="img" aria-label="Spherical, plane and distant-star wavefronts">';
      s += text(70, 20, "(a)", {color: MUTED});
      s += '<circle cx="70" cy="90" r="6" fill="' + RED + '"/>';
      var r;
      for(r = 22; r <= 58; r += 18){
        s += '<circle cx="70" cy="90" r="' + r + '" fill="none" stroke="' + BLUE + '" stroke-width="1.8"/>';
      }
      s += text(70, 170, "point source", {color: MUTED});
      s += text(70, 186, "spherical fronts", {color: MUTED, size: 11});
      s += text(200, 20, "(b)", {color: MUTED});
      s += '<path d="M200 60 Q222 100 200 140 Q178 100 200 60 Z" fill="rgba(148,163,184,.15)" stroke="' + BLUE + '" stroke-width="2"/>';
      var y;
      for(y = 62; y <= 138; y += 19){
        s += line(120, y, 182, y, AMBER, 2);
      }
      for(y = 70; y <= 130; y += 15){
        s += line(216, y, 280, y, GREEN, 2);
      }
      s += text(200, 170, "source at focus", {color: MUTED});
      s += text(200, 186, "emergent plane front", {color: MUTED, size: 11});
      s += text(330, 20, "(c)", {color: MUTED});
      s += '<circle cx="330" cy="78" r="7" fill="' + RED + '"/>';
      s += text(330, 58, "distant star", {color: MUTED, size: 11});
      for(y = 96; y <= 136; y += 14){
        s += line(300, y, 372, y, AMBER, 2);
      }
      s += '<path d="M300 150 Q336 120 372 150" fill="none" stroke="' + BLUE + '" stroke-width="2"/>';
      s += text(336, 168, "small patch ≈ plane", {color: MUTED, size: 11});
      s += '</svg>';
      return s;
    }
  };

  figs["10.4"] = {
    caption: "Fig. 10.12 — Young's double-slit geometry: slits S₁, S₂ separated by d, screen at distance D, point P at distance x from the centre (redrawn for Exercise 10.4).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 240" role="img" aria-label="Young double-slit geometry">';
      s += '<rect x="60" y="40" width="10" height="170" fill="#93c5fd"/>';
      s += text(46, 34, "S₁", {color: MUTED, anchor: "end"});
      s += text(46, 48, "S₂", {color: MUTED, anchor: "end"});
      s += '<circle cx="70" cy="78" r="4" fill="#f8fafc"/>';
      s += '<circle cx="70" cy="122" r="4" fill="#f8fafc"/>';
      s += text(70, 178, "slits, separation d = 0.28 mm", {color: "#93c5fd"});
      s += line(70, 78, 320, 96, AMBER, 1.8, "5 4");
      s += line(70, 122, 320, 96, BLUE, 1.8, "5 4");
      s += '<rect x="320" y="24" width="12" height="200" fill="rgba(148,163,184,.3)"/>';
      s += line(320, 100, 344, 100, MUTED, 1.2, "4 4");
      s += text(326, 116, "C (centre)", {color: MUTED, size: 11, anchor: "start"});
      s += '<circle cx="326" cy="96" r="4" fill="#f8fafc"/>';
      s += text(300, 88, "P", {color: "#f8fafc", anchor: "end"});
      s += line(70, 160, 320, 160, MUTED, 1.2, "4 4");
      s += line(300, 160, 300, 96, MUTED, 1.2);
      s += text(286, 132, "x", {color: MUTED, anchor: "end"});
      s += text(196, 208, "D = 1.4 m", {color: MUTED});
      s += '</svg>';
      return s;
    }
  };

  figs["10.6"] = {
    caption: "Fig. 10.13 — Superposed fringe patterns of 650 nm (top) and 520 nm (bottom); they coincide first where 4 × 650 nm = 5 × 520 nm (redrawn for Exercise 10.6).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 230" role="img" aria-label="Two superposed interference fringe patterns that coincide">';
      var i, x;
      s += text(28, 46, "650 nm", {color: "#f87171", anchor: "start"});
      for(i = 0; i <= 16; i += 1){
        x = 90 + i * 16;
        s += '<rect x="' + x + '" y="34" width="8" height="26" fill="rgba(248,113,113,' + (i === 4 ? "0.95" : "0.45") + ')"/>';
      }
      s += text(28, 116, "520 nm", {color: "#60a5fa", anchor: "start"});
      for(i = 0; i <= 16; i += 1){
        x = 90 + i * 16 * 1.25;
        s += '<rect x="' + x + '" y="104" width="8" height="26" fill="rgba(96,165,250,' + (i === 5 ? "0.95" : "0.45") + ')"/>';
      }
      s += line(90 + 4 * 16 + 4, 70, 90 + 4 * 16 + 4, 158, GREEN, 2, "5 4");
      s += line(90 + 5 * 16 * 1.25 + 4, 70, 90 + 5 * 16 * 1.25 + 4, 158, GREEN, 2, "5 4");
      s += line(90 + 4 * 16 + 4, 158, 90 + 5 * 16 * 1.25 + 4, 158, GREEN, 2);
      s += text(190, 180, "coincide here: 4th bright of 650 nm meets 5th of 520 nm", {color: GREEN, size: 11});
      s += text(190, 208, "both patterns are drawn to the same scale", {color: MUTED, size: 11});
      s += '</svg>';
      return s;
    }
  };

  return figs;
})();
