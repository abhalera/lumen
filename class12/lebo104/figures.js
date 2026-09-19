// Textbook figures used by the lebo104 exercises, redrawn as SVG from
// books/originals/Class12-Biology_lebo104.pdf (Figures 4.4, 4.5, 4.7 and 4.14).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa", GREEN = "#34d399", AMBER = "#fbbf24";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  var figs = {};

  // Fig. 4.4 — Punnett square for the monohybrid cross Tt × Tt.
  figs["4.4"] = {
    caption: "Fig. 4.4 — Punnett square for the monohybrid cross Tt × Tt: 1 TT : 2 Tt : 1 tt, i.e. 3 tall : 1 dwarf (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 260" role="img" aria-label="Punnett square for Tt x Tt">';
      var x0 = 120, y0 = 70, cw = 70;
      s += text(x0 + cw / 2, 52, "T", {size: 18, weight: 700, color: BLUE});
      s += text(x0 + cw + cw / 2, 52, "t", {size: 18, weight: 700, color: BLUE});
      s += text(x0 - 28, y0 + cw / 2 + 6, "T", {size: 18, weight: 700, color: BLUE});
      s += text(x0 - 28, y0 + cw + cw / 2 + 6, "t", {size: 18, weight: 700, color: BLUE});
      var cells = [["TT", true], ["Tt", true], ["Tt", true], ["tt", false]];
      cells.forEach(function(c, i){
        var x = x0 + (i % 2) * cw, y = y0 + Math.floor(i / 2) * cw;
        s += '<rect x="' + x + '" y="' + y + '" width="' + (cw - 4) + '" height="' + (cw - 4) + '" rx="6" fill="' + (c[1] ? "#0e2a22" : "#2a1517") + '" stroke="' + (c[1] ? GREEN : RED) + '" stroke-width="2"/>';
        s += text(x + cw / 2 - 2, y + cw / 2 + 4, c[0], {size: 18, weight: 700, color: c[1] ? GREEN : RED});
      });
      s += text(190, 238, "tall = T_ (3/4)   ·   dwarf = tt (1/4)", {size: 13, color: INK});
      return s + '</svg>';
    }
  };

  // Fig. 4.5 — Test cross of a violet heterozygote with the white parent.
  figs["4.5"] = {
    caption: "Fig. 4.5 — Test cross of a violet Vv plant with the white vv parent: 1 violet : 1 white in the progeny (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 260" role="img" aria-label="Test cross Vv x vv">';
      var x0 = 120, y0 = 70, cw = 70;
      s += text(x0 + cw / 2, 52, "V", {size: 18, weight: 700, color: BLUE});
      s += text(x0 + cw + cw / 2, 52, "v", {size: 18, weight: 700, color: BLUE});
      s += text(x0 - 28, y0 + cw / 2 + 6, "v", {size: 18, weight: 700, color: BLUE});
      s += text(x0 - 28, y0 + cw + cw / 2 + 6, "v", {size: 18, weight: 700, color: BLUE});
      var cells = [["Vv", true], ["vv", false], ["Vv", true], ["vv", false]];
      cells.forEach(function(c, i){
        var x = x0 + (i % 2) * cw, y = y0 + Math.floor(i / 2) * cw;
        s += '<rect x="' + x + '" y="' + y + '" width="' + (cw - 4) + '" height="' + (cw - 4) + '" rx="6" fill="' + (c[1] ? "#2a1f38" : "#2a1517") + '" stroke="' + (c[1] ? "#c084fc" : RED) + '" stroke-width="2"/>';
        s += text(x + cw / 2 - 2, y + cw / 2 + 4, c[0], {size: 18, weight: 700, color: c[1] ? "#c084fc" : RED});
      });
      s += text(190, 238, "violet = V_ (1/2)   ·   white = vv (1/2)", {size: 13, color: INK});
      return s + '</svg>';
    }
  };

  // Fig. 4.7 — Dihybrid F2 Punnett square with the 9:3:3:1 classes.
  figs["4.7"] = {
    caption: "Fig. 4.7 — Dihybrid cross RrYy × RrYy: 9 round-yellow : 3 round-green : 3 wrinkled-yellow : 1 wrinkled-green (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 420 330" role="img" aria-label="Dihybrid Punnett square">';
      var gam = ["RY", "Ry", "rY", "ry"];
      var x0 = 90, y0 = 60, cw = 68;
      var colors = [
        ["#0e2a22", GREEN],
        ["#12283d", BLUE],
        ["#2a1f0e", AMBER],
        ["#2a1517", RED]
      ];
      gam.forEach(function(g, i){
        s += text(x0 + cw * i + cw / 2, y0 - 12, g, {size: 13, weight: 700, color: BLUE});
        s += text(x0 - 28, y0 + cw * i + cw / 2 + 5, g, {size: 13, weight: 700, color: BLUE});
      });
      var rows = [
        [0, 0, 0, 0],
        [0, 1, 0, 1],
        [0, 0, 2, 2],
        [0, 1, 2, 3]
      ];
      var labels = [
        ["RRYY", "RRYy", "RrYY", "RrYy"],
        ["RRYy", "RRyy", "RrYy", "Rryy"],
        ["RrYY", "RrYy", "rrYY", "rrYy"],
        ["RrYy", "Rryy", "rrYy", "rryy"]
      ];
      rows.forEach(function(row, j){
        row.forEach(function(k, i){
          var x = x0 + cw * i, y = y0 + cw * j;
          s += '<rect x="' + x + '" y="' + y + '" width="' + (cw - 3) + '" height="' + (cw - 3) + '" rx="4" fill="' + colors[k][0] + '" stroke="' + colors[k][1] + '"/>';
          s += text(x + cw / 2, y + cw / 2 + 4, labels[j][i], {size: 10, color: colors[k][1]});
        });
      });
      s += text(210, 320, "16 squares: 9 · 3 · 3 · 1 = (3:1) × (3:1)", {size: 13, color: INK});
      return s + '</svg>';
    }
  };

  // Fig. 4.14 — Representative pedigree of an autosomal recessive trait.
  figs["4.14"] = {
    caption: "Fig. 4.14 — Pedigree of an autosomal recessive trait (sickle-cell anaemia): carrier parents I-1 and I-2 have 1 affected child in 4 (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 400 260" role="img" aria-label="Pedigree of an autosomal recessive trait">';
      function female(x, y, affected, label){
        var o = '<circle cx="' + x + '" cy="' + y + '" r="16" fill="' + (affected ? "#4a1d1d" : "#0f1f2e") + '" stroke="' + (affected ? RED : MUTED) + '" stroke-width="2"/>';
        return o + text(x, y + 36, label, {size: 11, color: affected ? RED : MUTED});
      }
      function male(x, y, affected, label){
        var o = '<rect x="' + (x - 15) + '" y="' + (y - 15) + '" width="30" height="30" rx="4" fill="' + (affected ? "#4a1d1d" : "#0f1f2e") + '" stroke="' + (affected ? RED : MUTED) + '" stroke-width="2"/>';
        return o + text(x, y + 36, label, {size: 11, color: affected ? RED : MUTED});
      }
      s += text(200, 26, "I", {size: 13, weight: 700, color: MUTED});
      s += female(120, 72, false, "I-1 carrier");
      s += male(280, 72, false, "I-2 carrier");
      s += '<line x1="136" y1="72" x2="264" y2="72" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="200" y1="72" x2="200" y2="120" stroke="' + MUTED + '" stroke-width="2"/>';
      s += text(200, 140, "II", {size: 13, weight: 700, color: MUTED});
      s += '<line x1="70" y1="120" x2="330" y2="120" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="70" y1="120" x2="70" y2="166" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="200" y1="120" x2="200" y2="166" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="330" y1="120" x2="330" y2="166" stroke="' + MUTED + '" stroke-width="2"/>';
      s += female(70, 186, false, "II-1 healthy");
      s += male(200, 186, true, "II-2 affected");
      s += female(330, 186, false, "II-3 carrier");
      s += text(200, 246, "shaded = HbSHbS affected · open = healthy carrier or normal", {size: 11, color: MUTED});
      return s + '</svg>';
    }
  };

  return figs;
})();
