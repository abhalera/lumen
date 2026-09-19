// Textbook structures used by Exercise 6.3, redrawn as SVG from the names printed in
// books/originals/Class12-Chemistry-Pt2_lech201.pdf (Exercise 6.3, printed p. 189).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", AMBER = "#f59e0b", BLUE = "#60a5fa",
      GREEN = "#34d399", RED = "#f87171", VIOLET = "#c4b5fd";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + (o.mono ? ' font-family="ui-monospace,monospace"' : '') + '>' + s + '</text>';
  }

  var figs = {};

  figs["6.3"] = {
    caption: "Exercise 6.3 — Structures of the eight organic halogen compounds (redrawn as condensed formulas).",
    svg: function(){
      var panels = [
        ["(i) 2-Chloro-3-methylpentane", "CH\u2083CH\u2082CH(CH\u2083)CHClCH\u2083", AMBER],
        ["(ii) p-Bromochlorobenzene", "p-Br\u2013C\u2086H\u2084\u2013Cl", AMBER],
        ["(iii) 1-Chloro-4-ethylcyclohexane", "Cl\u2013C\u2086H\u2081\u2080\u2013CH\u2082CH\u2083 (Cl at C1, Et at C4)", BLUE],
        ["(iv) 2-(2-Chlorophenyl)-1-iodooctane", "ICH\u2082CH(C\u2086H\u2084Cl)(CH\u2082)\u2085CH\u2083", BLUE],
        ["(v) 2-Bromobutane", "CH\u2083CHBrCH\u2082CH\u2083", GREEN],
        ["(vi) 4-tert-Butyl-3-iodoheptane", "CH\u2083CH\u2082CH(I)CH(C(CH\u2083)\u2083)CH\u2082CH\u2082CH\u2083", GREEN],
        ["(vii) 1-Bromo-4-sec-butyl-2-methylbenzene", "1-Br, 2-CH\u2083, 4-CH(CH\u2083)CH\u2082CH\u2083 (C\u2086H\u2084)", RED],
        ["(viii) 1,4-Dibromobut-2-ene", "BrCH\u2082CH=CHCH\u2082Br", VIOLET]
      ];
      var s = '<svg viewBox="0 0 720 520" role="img" aria-label="Structures of eight organic halogen compounds">';
      panels.forEach(function(p, i){
        var col = i % 2, row = Math.floor(i / 2);
        var x = 20 + col * 350, y = 20 + row * 122;
        s += '<rect x="' + x + '" y="' + y + '" width="330" height="106" rx="10" fill="#0f172a" stroke="#334155"/>';
        s += text(x + 165, y + 30, p[0], {color: p[2], size: 12, weight: 700});
        s += text(x + 165, y + 66, p[1], {color: INK, size: 12, mono: true});
      });
      s += text(360, 512, "Halogen substituents are shown in the condensed formulas; the parent chain/ring is numbered as in the IUPAC name.", {color: MUTED, size: 11});
      return s + '</svg>';
    }
  };

  return figs;
})();
