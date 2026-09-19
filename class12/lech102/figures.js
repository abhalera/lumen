// Textbook figure used by the exercises, redrawn as SVG from the cell notation printed with
// books/originals/Class12-Chemistry-Pt1_lech102.pdf (Exercise 2.3, printed p. 59).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa", AMBER = "#f59e0b", GREEN = "#34d399";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  var figs = {};

  figs["2.3"] = {
    caption: "Exercise 2.3 \u2014 the Zn(s) | Zn\u00b2\u207a(aq) || Ag\u207a(aq) | Ag(s) galvanic cell (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 620 330" role="img" aria-label="Zinc-silver galvanic cell with salt bridge">';
      s += '<rect width="620" height="330" fill="#09131d"/>';
      s += '<rect x="60" y="120" width="200" height="160" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      s += '<rect x="360" y="120" width="200" height="160" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      s += '<rect x="66" y="150" width="188" height="120" fill="#1e3a5f" opacity="0.55"/>';
      s += '<rect x="366" y="150" width="188" height="120" fill="#3f2d12" opacity="0.55"/>';
      s += '<rect x="140" y="80" width="28" height="180" rx="3" fill="' + MUTED + '"/>';
      s += '<text x="154" y="74" fill="' + MUTED + '" font-size="12" text-anchor="middle">Zn(s)</text>';
      s += '<rect x="452" y="80" width="28" height="180" rx="3" fill="' + AMBER + '"/>';
      s += '<text x="466" y="74" fill="' + AMBER + '" font-size="12" text-anchor="middle">Ag(s)</text>';
      s += '<text x="160" y="205" fill="' + BLUE + '" font-size="12" text-anchor="middle">Zn\u00b2\u207a(aq)</text>';
      s += '<text x="460" y="205" fill="' + AMBER + '" font-size="12" text-anchor="middle">Ag\u207a(aq)</text>';
      s += '<path d="M 154 80 C 220 18, 400 18, 466 80" fill="none" stroke="' + BLUE + '" stroke-width="3"/>';
      s += '<polygon points="278,17 266,24 276,31" fill="' + BLUE + '"/>';
      s += '<text x="310" y="14" fill="' + BLUE + '" font-size="12">e\u207b \u2192</text>';
      s += '<path d="M 250 64 h 120" stroke="' + INK + '" stroke-width="2" stroke-dasharray="5 4"/>';
      s += '<text x="310" y="58" fill="' + INK + '" font-size="12">external wire</text>';
      s += '<rect x="250" y="118" width="120" height="26" rx="6" fill="#334155" stroke="' + GREEN + '" stroke-width="1.6"/>';
      s += '<text x="310" y="136" fill="' + GREEN + '" font-size="12">salt bridge (KCl)</text>';
      s += '<text x="154" y="272" fill="' + RED + '" font-size="12" text-anchor="middle">anode (\u2212): Zn \u2192 Zn\u00b2\u207a + 2e\u207b</text>';
      s += '<text x="466" y="272" fill="' + GREEN + '" font-size="12" text-anchor="middle">cathode (+): Ag\u207a + e\u207b \u2192 Ag</text>';
      s += text(310, 312, "Zn(s) | Zn\u00b2\u207a(aq) || Ag\u207a(aq) | Ag(s)", {size: 13, color: MUTED});
      return s + '</svg>';
    }
  };

  return figs;
})();
