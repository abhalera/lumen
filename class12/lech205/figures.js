// Exercise figures redrawn as SVG from the data printed in
// books/originals/Class12-Chemistry-Pt2_lech205.pdf (Exercise 10.9 and Exercise 10.22).
window.FIGURES = (function(){
  var INK = "#0f172a", MUTED = "#475569", RED = "#b91c1c", BLUE = "#1d4ed8", GREEN = "#047857", AMBER = "#b45309";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function node(x, y, s, o){
    o = o || {};
    var w = o.w || Math.max(70, s.length * 7.4 + 18);
    return '<rect x="' + (x - w / 2) + '" y="' + (y - 15) + '" width="' + w + '" height="30" rx="6" fill="#f8fafc" stroke="' + (o.stroke || "#94a3b8") + '" stroke-width="1.6"/>' +
      text(x, y + 4, s, {color: o.color || INK, size: o.size || 12.5});
  }

  var defs = '<defs><marker id="figarr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="' + MUTED + '"/></marker></defs>';

  var figs = {};

  figs["10.9"] = {
    caption: "Exercise 10.9 — D-glucose with HI, bromine water and HNO₃ (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 300" role="img" aria-label="D-glucose reactions with HI, bromine water and nitric acid">';
      s += defs;
      s += node(120, 150, "D-glucose", {w: 150, color: GREEN, stroke: GREEN, size: 15});
      s += text(120, 128, "CHO–(CHOH)₄–CH₂OH", {size: 11, color: MUTED});
      var outs = [
        [70, "prolonged HI", "n-hexane (straight six-carbon chain)", RED],
        [150, "Br₂ water", "gluconic acid (CHO → COOH)", BLUE],
        [230, "HNO₃", "saccharic acid (CHO and CH₂OH → COOH)", AMBER]
      ];
      outs.forEach(function(o){
        s += '<line x1="198" y1="150" x2="392" y2="' + o[0] + '" stroke="' + MUTED + '" stroke-width="1.6" marker-end="url(#figarr)"/>';
        s += text(300, (150 + o[0]) / 2 - 14, o[1], {size: 11.5, color: RED});
        s += node(510, o[0], o[2], {w: 240, color: o[3], stroke: o[3], size: 12});
      });
      return s + '</svg>';
    }
  };

  figs["10.22"] = {
    caption: "Exercise 10.22 — a nucleoside adds a 5′-phosphate to become a nucleotide (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 280" role="img" aria-label="Nucleoside and nucleotide structures">';
      s += defs;
      function sugar(cx, cy){
        var pts = [[cx, cy - 44], [cx + 42, cy - 14], [cx + 26, cy + 36], [cx - 26, cy + 36], [cx - 42, cy - 14]];
        return '<polygon points="' + pts.map(function(p){ return p[0] + "," + p[1]; }).join(" ") + '" fill="#f8fafc" stroke="' + BLUE + '" stroke-width="1.8"/>' +
          text(cx, cy - 50, "O", {size: 12, color: BLUE});
      }
      s += text(180, 30, "Nucleoside = base + sugar", {size: 14, weight: 700, color: INK});
      s += sugar(180, 150);
      s += '<rect x="196" y="66" width="86" height="34" rx="6" fill="#e0f2fe" stroke="' + BLUE + '"/>';
      s += text(239, 88, "base", {size: 12, color: BLUE});
      s += text(239, 112, "at C1′", {size: 11, color: MUTED});
      s += text(180, 226, "base + pentose", {size: 12, color: MUTED});
      s += text(360, 150, "+", {size: 22, color: MUTED});
      s += text(520, 30, "Nucleotide = nucleoside + phosphate at 5′", {size: 14, weight: 700, color: INK});
      s += sugar(520, 150);
      s += '<rect x="536" y="66" width="86" height="34" rx="6" fill="#e0f2fe" stroke="' + BLUE + '"/>';
      s += text(579, 88, "base", {size: 12, color: BLUE});
      s += text(579, 112, "at C1′", {size: 11, color: MUTED});
      s += '<circle cx="612" cy="196" r="20" fill="#ecfdf5" stroke="' + GREEN + '" stroke-width="1.8"/>';
      s += text(612, 201, "P", {size: 14, weight: 700, color: GREEN});
      s += '<line x1="584" y1="186" x2="600" y2="192" stroke="' + GREEN + '" stroke-width="1.8"/>';
      s += text(520, 226, "base + pentose + 5′-phosphate", {size: 12, color: MUTED});
      s += text(360, 258, "Nucleotides join by 5′–3′ phosphodiester links; primary structure = base sequence.", {size: 11.5, color: MUTED});
      return s + '</svg>';
    }
  };

  return figs;
})();
