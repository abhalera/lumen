// Textbook figures used by the exercises, redrawn as SVG from the vector data in
// books/originals/Class12-Physics-Pt1_leph108.pdf (Figures 8.5 and 8.6).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  var figs = {};

  figs["8.5"] = {
    caption: "Fig. 8.5 — Two circular capacitor plates of radius 12 cm separated by 5.0 cm, charged by a constant current (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 220" role="img" aria-label="Two circular capacitor plates with a charging current">';
      s += '<line x1="22" y1="118" x2="90" y2="118" stroke="' + MUTED + '" stroke-width="2.5"/>';
      s += '<line x1="290" y1="118" x2="358" y2="118" stroke="' + MUTED + '" stroke-width="2.5"/>';
      s += '<polygon points="86,118 70,111 70,125" fill="' + MUTED + '"/>';
      s += '<polygon points="294,118 310,111 310,125" fill="' + MUTED + '"/>';
      s += '<ellipse cx="120" cy="118" rx="18" ry="60" fill="#1e3a8a" stroke="' + BLUE + '" stroke-width="3"/>';
      s += '<ellipse cx="260" cy="118" rx="18" ry="60" fill="#7f1d1d" stroke="' + RED + '" stroke-width="3"/>';
      for(var i = -2; i <= 2; i += 1){
        var y = 118 + i * 22;
        s += '<line x1="150" y1="' + y + '" x2="230" y2="' + y + '" stroke="' + MUTED + '" stroke-width="1.6" stroke-dasharray="4 4"/>';
      }
      s += text(190, 45, "circular plates, radius 12 cm", {color: INK, size: 13});
      s += text(190, 202, "separation 5.0 cm", {color: MUTED, size: 13});
      s += text(105, 205, "+", {color: RED, size: 18, weight: 700});
      s += text(275, 205, "−", {color: BLUE, size: 18, weight: 700});
      s += text(45, 106, "I", {color: INK, size: 15, weight: 700});
      s += text(338, 106, "I", {color: INK, size: 15, weight: 700});
      return s + '</svg>';
    }
  };

  figs["8.6"] = {
    caption: "Fig. 8.6 — A parallel-plate capacitor of circular plates (R = 6.0 cm, C = 100 pF) connected to a 230 V ac supply (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 400 240" role="img" aria-label="Parallel plate capacitor connected to an ac supply">';
      s += '<line x1="120" y1="52" x2="160" y2="52" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<line x1="240" y1="52" x2="280" y2="52" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<ellipse cx="180" cy="52" rx="16" ry="42" fill="#1e3a8a" stroke="' + BLUE + '" stroke-width="3"/>';
      s += '<ellipse cx="220" cy="52" rx="16" ry="42" fill="#7f1d1d" stroke="' + RED + '" stroke-width="3"/>';
      s += '<line x1="120" y1="52" x2="120" y2="170" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<line x1="280" y1="52" x2="280" y2="170" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<line x1="120" y1="170" x2="165" y2="170" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<line x1="235" y1="170" x2="280" y2="170" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<circle cx="200" cy="170" r="34" fill="none" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<path d="M182 162 q6 -14 12 0 t12 0" fill="none" stroke="' + "#f59e0b" + '" stroke-width="2.4"/>';
      s += text(200, 186, "230 V", {color: "#f59e0b", size: 12});
      s += text(200, 205, "ac, ω = 300 rad s⁻¹", {color: MUTED, size: 12});
      s += text(180, 24, "+", {color: RED, size: 17, weight: 700});
      s += text(220, 24, "−", {color: BLUE, size: 17, weight: 700});
      s += text(200, 130, "R = 6.0 cm", {color: INK, size: 13});
      s += text(200, 148, "C = 100 pF", {color: MUTED, size: 12});
      return s + '</svg>';
    }
  };

  return figs;
})();
