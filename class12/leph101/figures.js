// Textbook figures used by the exercises, redrawn as SVG from the vector data in
// books/originals/Class12-Physics-Pt1_leph101.pdf (Figures 1.30 and 1.31).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa", TRACK = "#38bdf8";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  var figs = {};

  figs["1.30"] = {
    caption: "Fig. 1.30 — Tracks of three charged particles in a uniform electrostatic field (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Three particle tracks between charged plates">';
      s += '<rect x="40" y="42" width="300" height="10" rx="4" fill="#7f1d1d"/>';
      s += '<rect x="40" y="198" width="300" height="10" rx="4" fill="#1e3a8a"/>';
      s += text(190, 32, "+ + + + + + + + + +", {color: RED, size: 15});
      s += text(190, 226, "− − − − − − − − − −", {color: BLUE, size: 15});
      s += text(190, 128, "E", {color: MUTED, size: 16, weight: 700});
      s += '<line x1="190" y1="62" x2="190" y2="96" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="182" y1="88" x2="190" y2="98" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="198" y1="88" x2="190" y2="98" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<path d="M60 150 Q200 150 322 72" fill="none" stroke="' + TRACK + '" stroke-width="2.4"/>';
      s += '<path d="M60 132 Q200 124 330 108" fill="none" stroke="' + TRACK + '" stroke-width="2.4"/>';
      s += '<path d="M60 150 Q200 152 338 192" fill="none" stroke="' + TRACK + '" stroke-width="2.4"/>';
      s += '<polygon points="322,72 310,76 314,84" fill="' + TRACK + '"/>';
      s += '<polygon points="330,108 318,106 319,114" fill="' + TRACK + '"/>';
      s += '<polygon points="338,192 326,186 325,194" fill="' + TRACK + '"/>';
      s += text(338, 58, "1", {size: 15, weight: 700});
      s += text(348, 106, "2", {size: 15, weight: 700});
      s += text(352, 200, "3", {size: 15, weight: 700});
      s += '<circle cx="60" cy="150" r="3" fill="' + INK + '"/>';
      return s + '</svg>';
    }
  };

  figs["1.31"] = {
    caption: "Fig. 1.31 — A +10 μC point charge 5 cm above the centre of a 10 cm square (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 340 250" role="img" aria-label="Point charge above the centre of a square">';
      s += '<polygon points="70,190 250,190 292,126 112,126" fill="rgba(56,189,248,.12)" stroke="' + BLUE + '" stroke-width="2"/>';
      s += '<line x1="181" y1="60" x2="181" y2="158" stroke="' + MUTED + '" stroke-width="2" stroke-dasharray="5 4"/>';
      s += '<circle cx="181" cy="60" r="7" fill="' + RED + '"/>';
      s += text(181, 46, "+10 μC", {color: RED, size: 15, weight: 700});
      s += text(196, 112, "5 cm", {color: MUTED, size: 13, anchor: "start"});
      s += text(160, 210, "10 cm", {color: MUTED, size: 13});
      s += text(281, 168, "10 cm", {color: MUTED, size: 13});
      s += '<circle cx="181" cy="158" r="3" fill="' + INK + '"/>';
      return s + '</svg>';
    }
  };

  return figs;
})();
