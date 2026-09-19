// Textbook figures used by the exercises, redrawn as SVG from the vector data in
// books/originals/Class12-Physics-Pt2_leph201.pdf (Figures 9.26–9.30).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa", RAY = "#38bdf8";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  var figs = {};

  figs["9.26"] = {
    caption: "Fig. 9.26 — Schematic diagram of a reflecting (Cassegrain) telescope (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 420 260" role="img" aria-label="Cassegrain reflecting telescope with a concave primary and convex secondary mirror">';
      // tube
      s += '<rect x="40" y="40" width="300" height="14" fill="#1f3a5f"/>';
      s += '<rect x="40" y="216" width="300" height="14" fill="#1f3a5f"/>';
      // primary mirror (concave, opening left)
      s += '<path d="M330 50 Q300 130, 330 220" fill="none" stroke="' + BLUE + '" stroke-width="7"/>';
      s += text(370, 60, "Objective", {color: INK, size: 12, anchor: "start"});
      s += text(370, 76, "mirror", {color: INK, size: 12, anchor: "start"});
      // secondary mirror (convex toward primary)
      s += '<path d="M180 84 Q205 130, 180 176" fill="none" stroke="' + RAY + '" stroke-width="6"/>';
      s += text(150, 78, "Secondary", {color: INK, size: 12});
      s += text(150, 94, "mirror", {color: INK, size: 12});
      // incoming parallel rays
      s += '<line x1="55" y1="100" x2="180" y2="100" stroke="' + RAY + '" stroke-width="2"/>';
      s += '<line x1="55" y1="160" x2="180" y2="160" stroke="' + RAY + '" stroke-width="2"/>';
      s += '<polygon points="180,100 168,95 168,105" fill="' + RAY + '"/>';
      s += '<polygon points="180,160 168,155 168,165" fill="' + RAY + '"/>';
      s += '<line x1="55" y1="130" x2="332" y2="130" stroke="' + RAY + '" stroke-width="2"/>';
      // rays from secondary converge through the hole
      s += '<line x1="180" y1="100" x2="332" y2="146" stroke="' + RAY + '" stroke-width="2"/>';
      s += '<line x1="180" y1="160" x2="332" y2="146" stroke="' + RAY + '" stroke-width="2"/>';
      s += '<line x1="180" y1="130" x2="332" y2="130" stroke="' + RAY + '" stroke-width="2"/>';
      s += '<polygon points="332,146 320,139 320,153" fill="' + RAY + '"/>';
      // hole and eyepiece
      s += '<rect x="326" y="120" width="70" height="20" rx="6" fill="#334155" stroke="' + MUTED + '" stroke-width="1.5"/>';
      s += text(361, 134, "eyepiece", {color: MUTED, size: 11});
      s += text(392, 158, "hole in", {color: MUTED, size: 10, anchor: "start"});
      s += text(392, 170, "primary", {color: MUTED, size: 10, anchor: "start"});
      return s + '</svg>';
    }
  };

  figs["9.27"] = {
    caption: "Fig. 9.27 — Refraction at (a) glass–air, (b) air–water and (c) water–glass interfaces (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 620 240" role="img" aria-label="Three panels showing refraction at glass-air, air-water and water-glass interfaces">';
      function panel(x, topLabel, botLabel, i, r, rLabel){
        var g = '<line x1="' + (x + 20) + '" y1="120" x2="' + (x + 180) + '" y2="120" stroke="' + INK + '" stroke-width="1.8"/>';
        g += '<line x1="' + (x + 100) + '" y1="40" x2="' + (x + 100) + '" y2="200" stroke="' + INK + '" stroke-width="1.8"/>';
        g += text(x + 145, 70, topLabel, {color: INK, size: 14});
        g += text(x + 55, 180, botLabel, {color: INK, size: 14});
        // incident ray from bottom-left to the surface point at (x+100,120)
        var ang = i * Math.PI / 180;
        g += '<line x1="' + (x + 100 - 70 * Math.sin(ang)) + '" y1="' + (120 + 70 * Math.cos(ang)) + '" x2="' + (x + 100) + '" y2="120" stroke="' + RAY + '" stroke-width="2.4"/>';
        g += '<polygon points="' + (x + 100) + ',120 ' + (x + 92) + ',112 ' + (x + 100) + ',110" fill="' + RAY + '"/>';
        var rad = r * Math.PI / 180;
        g += '<line x1="' + (x + 100) + '" y1="120" x2="' + (x + 100 + 70 * Math.sin(rad)) + '" y2="' + (120 - 70 * Math.cos(rad)) + '" stroke="' + RAY + '" stroke-width="2.4"/>';
        g += '<polygon points="' + (x + 100 + 70 * Math.sin(rad)) + ',' + (120 - 70 * Math.cos(rad)) + ' ' + (x + 92 + 70 * Math.sin(rad)) + ',' + (114 - 70 * Math.cos(rad)) + ' ' + (x + 104 + 70 * Math.sin(rad)) + ',' + (110 - 70 * Math.cos(rad)) + '" fill="' + RAY + '"/>';
        g += text(x + 78, 152, i + "°", {color: MUTED, size: 12});
        g += text(x + 126, 82, rLabel, {color: MUTED, size: 12});
        return g;
      }
      s += panel(10, "Glass", "Air", 60, 35, "35°");
      s += panel(210, "Air", "Water", 60, 47, "47°");
      // panel (c): light from water (below) into glass (above), incidence 45°, unknown
      s += '<line x1="450" y1="120" x2="610" y2="120" stroke="' + INK + '" stroke-width="1.8"/>';
      s += '<line x1="530" y1="40" x2="530" y2="200" stroke="' + INK + '" stroke-width="1.8"/>';
      s += text(577, 70, "Glass", {color: INK, size: 14});
      s += text(485, 180, "Water", {color: INK, size: 14});
      var angc = 45 * Math.PI / 180;
      s += '<line x1="' + (530 - 70 * Math.sin(angc)) + '" y1="' + (120 + 70 * Math.cos(angc)) + '" x2="530" y2="120" stroke="' + RAY + '" stroke-width="2.4"/>';
      s += '<polygon points="530,120 522,112 530,110" fill="' + RAY + '"/>';
      s += '<line x1="530" y1="120" x2="' + (530 + 62 * Math.sin(0.30)) + '" y2="' + (120 - 62 * Math.cos(0.30)) + '" stroke="' + RAY + '" stroke-width="2.4"/>';
      s += '<polygon points="' + (530 + 62 * Math.sin(0.30)) + ',' + (120 - 62 * Math.cos(0.30)) + ' ' + (522 + 62 * Math.sin(0.30)) + ',' + (114 - 62 * Math.cos(0.30)) + ' ' + (534 + 62 * Math.sin(0.30)) + ',' + (110 - 62 * Math.cos(0.30)) + '" fill="' + RAY + '"/>';
      s += text(508, 152, "45°", {color: MUTED, size: 12});
      s += text(556, 82, "?°", {color: MUTED, size: 13, weight: 700});
      s += text(110, 222, "(a)", {color: INK, size: 13});
      s += text(310, 222, "(b)", {color: INK, size: 13});
      s += text(540, 222, "(c)", {color: INK, size: 13});
      return s + '</svg>';
    }
  };

  figs["9.28"] = {
    caption: "Fig. 9.28 — Cross-section of a light pipe: repeated total internal reflection inside the glass fibre (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 460 200" role="img" aria-label="Light pipe with a ray undergoing repeated total internal reflections">';
      // cladding bands and core
      s += '<rect x="80" y="40" width="340" height="16" fill="#1e3a8a" stroke="' + BLUE + '" stroke-width="1.5"/>';
      s += '<rect x="80" y="144" width="340" height="16" fill="#1e3a8a" stroke="' + BLUE + '" stroke-width="1.5"/>';
      s += '<rect x="80" y="56" width="340" height="88" fill="rgba(148,163,184,.15)"/>';
      s += '<line x1="80" y1="100" x2="420" y2="100" stroke="' + MUTED + '" stroke-width="1.4" stroke-dasharray="6 5"/>';
      // entrance ray
      s += '<line x1="40" y1="170" x2="80" y2="100" stroke="' + RAY + '" stroke-width="2.4"/>';
      s += '<polygon points="80,100 70,108 78,112" fill="' + RAY + '"/>';
      // refracted inside: down to bottom then zigzag
      s += '<line x1="80" y1="100" x2="150" y2="144" stroke="' + RAY + '" stroke-width="2.4"/>';
      s += '<polygon points="150,144 138,138 140,148" fill="' + RAY + '"/>';
      s += '<line x1="150" y1="144" x2="220" y2="56" stroke="' + RAY + '" stroke-width="2.4"/>';
      s += '<polygon points="220,56 210,64 220,66" fill="' + RAY + '"/>';
      s += '<line x1="220" y1="56" x2="290" y2="144" stroke="' + RAY + '" stroke-width="2.4"/>';
      s += '<polygon points="290,144 278,138 280,148" fill="' + RAY + '"/>';
      s += '<line x1="290" y1="144" x2="360" y2="56" stroke="' + RAY + '" stroke-width="2.4"/>';
      s += '<polygon points="360,56 350,64 360,66" fill="' + RAY + '"/>';
      // emergent ray
      s += '<line x1="360" y1="56" x2="430" y2="20" stroke="' + RAY + '" stroke-width="2.4"/>';
      s += '<polygon points="430,20 418,22 424,30" fill="' + RAY + '"/>';
      // labels
      s += text(60, 186, "i", {color: MUTED, size: 14});
      s += text(112, 84, "r", {color: MUTED, size: 13});
      s += text(176, 70, "i′", {color: MUTED, size: 13});
      s += text(200, 92, "i′", {color: MUTED, size: 13});
      s += text(250, 30, "core n₁ = 1.68", {color: INK, size: 11});
      s += text(250, 184, "cladding n₂ = 1.44", {color: BLUE, size: 11});
      s += '<line x1="80" y1="56" x2="80" y2="48" stroke="' + MUTED + '" stroke-width="1.2"/>';
      return s + '</svg>';
    }
  };

  figs["9.29"] = {
    caption: "Fig. 9.29 — Rotation of a galvanometer mirror displaces the reflected spot on a screen 1.5 m away (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 400 220" role="img" aria-label="Galvanometer mirror reflecting a spot onto a screen">';
      // screen
      s += '<line x1="60" y1="30" x2="60" y2="190" stroke="' + INK + '" stroke-width="2.5"/>';
      s += text(46, 196, "S", {color: INK, size: 14, weight: 700});
      // mirror
      s += '<line x1="330" y1="60" x2="330" y2="140" stroke="' + MUTED + '" stroke-width="1.6" stroke-dasharray="5 4"/>';
      s += '<line x1="330" y1="70" x2="340" y2="70" stroke="' + INK + '" stroke-width="3"/>';
      s += text(348, 158, "M", {color: INK, size: 14, weight: 700});
      // original ray (normal incidence, retraces)
      s += '<line x1="62" y1="110" x2="328" y2="110" stroke="' + RAY + '" stroke-width="2.2"/>';
      s += '<polygon points="328,110 316,105 316,115" fill="' + RAY + '"/>';
      s += '<polygon points="62,110 74,105 74,115" fill="' + RAY + '"/>';
      // displaced ray (dotted)
      s += '<line x1="62" y1="48" x2="328" y2="110" stroke="' + RAY + '" stroke-width="2" stroke-dasharray="6 5"/>';
      s += '<polygon points="328,110 315,102 318,114" fill="' + RAY + '"/>';
      // d dimension
      s += '<line x1="60" y1="48" x2="40" y2="48" stroke="' + MUTED + '" stroke-width="1.2"/>';
      s += '<line x1="60" y1="110" x2="40" y2="110" stroke="' + MUTED + '" stroke-width="1.2"/>';
      s += '<line x1="44" y1="48" x2="44" y2="110" stroke="' + MUTED + '" stroke-width="1.2"/>';
      s += text(26, 82, "d", {color: INK, size: 14, weight: 700});
      // 1.5 m dimension
      s += '<line x1="62" y1="170" x2="328" y2="170" stroke="' + MUTED + '" stroke-width="1.4"/>';
      s += '<polygon points="62,170 74,166 74,174" fill="' + MUTED + '"/>';
      s += '<polygon points="328,170 316,166 316,174" fill="' + MUTED + '"/>';
      s += text(195, 190, "1.5 m", {color: INK, size: 13});
      s += text(195, 22, "incident and reflected rays", {color: MUTED, size: 11});
      return s + '</svg>';
    }
  };

  figs["9.30"] = {
    caption: "Fig. 9.30 — Equiconvex lens resting on a liquid layer over a plane mirror; the needle position P (with liquid) shifts to P′ (without liquid) (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Equiconvex lens on a liquid layer above a plane mirror with needle positions marked">';
      // axis
      s += '<line x1="190" y1="16" x2="190" y2="230" stroke="' + MUTED + '" stroke-width="1.4" stroke-dasharray="6 5"/>';
      // top points
      s += text(122, 26, "Ω", {color: INK, size: 13, weight: 700});
      s += text(176, 26, "P", {color: INK, size: 13, weight: 700});
      s += text(206, 26, "P′", {color: INK, size: 13, weight: 700});
      s += text(256, 26, "Ω′", {color: INK, size: 13, weight: 700});
      s += '<circle cx="122" cy="30" r="2.6" fill="' + INK + '"/>';
      s += '<circle cx="178" cy="30" r="2.6" fill="' + INK + '"/>';
      s += '<circle cx="204" cy="30" r="2.6" fill="' + INK + '"/>';
      s += '<circle cx="254" cy="30" r="2.6" fill="' + INK + '"/>';
      // lens: equiconvex (two arcs)
      s += '<path d="M60 160 Q190 96, 320 160 Q190 224, 60 160 Z" fill="rgba(56,189,248,.15)" stroke="' + RAY + '" stroke-width="2.4"/>';
      // liquid layer (dotted)
      s += '<rect x="70" y="182" width="240" height="18" fill="rgba(56,189,248,.10)" stroke="' + RAY + '" stroke-width="1.4" stroke-dasharray="4 4"/>';
      // mirror
      s += '<rect x="50" y="200" width="280" height="10" fill="#1e3a8a" stroke="' + BLUE + '" stroke-width="1.5"/>';
      // rays from Omega down through lens to mirror and back
      s += '<line x1="122" y1="30" x2="96" y2="160" stroke="' + INK + '" stroke-width="1.8"/>';
      s += '<line x1="96" y1="160" x2="178" y2="201" stroke="' + INK + '" stroke-width="1.8"/>';
      s += '<line x1="178" y1="201" x2="204" y2="30" stroke="' + INK + '" stroke-width="1.8"/>';
      s += '<line x1="122" y1="30" x2="204" y2="30" stroke="' + INK + '" stroke-width="1.8"/>';
      s += '<line x1="254" y1="30" x2="204" y2="30" stroke="' + INK + '" stroke-width="1.2"/>';
      s += '<line x1="254" y1="30" x2="150" y2="160" stroke="' + INK + '" stroke-width="1.8"/>';
      s += '<line x1="150" y1="160" x2="204" y2="201" stroke="' + INK + '" stroke-width="1.8"/>';
      s += '<line x1="254" y1="30" x2="122" y2="30" stroke="' + INK + '" stroke-width="1.2"/>';
      // labels
      s += text(190, 238, "plane mirror", {color: BLUE, size: 11});
      s += text(190, 176, "liquid layer", {color: RAY, size: 11});
      return s + '</svg>';
    }
  };

  return figs;
})();
