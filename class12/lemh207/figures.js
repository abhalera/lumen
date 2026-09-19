// Textbook figures used by the lemh207 exercises and examples, redrawn as SVG from
// books/originals/Class12-Maths-Pt2_lemh207.pdf (Figs 13.1–13.4 and the marble table
// cited by Miscellaneous Exercise Q6).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", BLUE = "#60a5fa", GREEN = "#34d399", PINK = "#f472b6", AMBER = "#fbbf24";

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

  figs["13.1"] = {
    caption: "Fig. 13.1 — Tree diagram for 'coin, then toss again or throw a die': the 8 outcomes of the experiment (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 420 250" role="img" aria-label="Tree diagram with 8 outcomes">';
      s += text(210, 24, "Example 7: coin first, then coin or die", {size: 14, weight: 700});
      s += line(60, 125, 160, 70, MUTED, 2);
      s += line(60, 125, 160, 180, MUTED, 2);
      s += text(60, 132, "start", {size: 12, color: MUTED});
      s += text(150, 58, "H", {size: 15, color: BLUE, weight: 700});
      s += text(150, 196, "T", {size: 15, color: AMBER, weight: 700});
      var hh = [["(H, H)", 40], ["(H, T)", 92]];
      hh.forEach(function(p){ s += line(175, 70, 230, p[1] + 6, MUTED, 1.6) + text(252, p[1] + 10, p[0], {size: 13, anchor: "start"}); });
      for(var i = 1; i <= 6; i += 1){
        var yy = 132 + (i - 1) * 20;
        s += line(175, 180, 230, yy, MUTED, 1.6);
        s += text(252, yy + 5, "(T, " + i + ")", {size: 13, anchor: "start"});
      }
      s += text(210, 242, "8 equally likely outcomes", {size: 12, color: GREEN});
      return s + '</svg>';
    }
  };

  figs["13.2"] = {
    caption: "Fig. 13.2 — The same tree with branch probabilities: P(H) = P(T) = 1/2, then 1/2 or 1/6 on the branches (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 440 250" role="img" aria-label="Probability tree for the coin then coin-or-die experiment">';
      s += text(220, 24, "Branch probabilities multiply", {size: 14, weight: 700});
      s += line(60, 125, 170, 70, MUTED, 2);
      s += line(60, 125, 170, 180, MUTED, 2);
      s += text(60, 132, "start", {size: 12, color: MUTED});
      s += text(120, 86, "1/2", {size: 13, color: BLUE});
      s += text(120, 168, "1/2", {size: 13, color: AMBER});
      s += text(168, 62, "H", {size: 15, color: BLUE, weight: 700});
      s += text(168, 196, "T", {size: 15, color: AMBER, weight: 700});
      s += line(185, 70, 250, 44, MUTED, 1.6) + text(258, 48, "(H, H)   1/2 \u00d7 1/2 = 1/4", {size: 12, anchor: "start"});
      s += line(185, 70, 250, 82, MUTED, 1.6) + text(258, 86, "(H, T)   1/2 \u00d7 1/2 = 1/4", {size: 12, anchor: "start"});
      s += text(215, 128, "1/6 each", {size: 12, color: GREEN, anchor: "start"});
      for(var i = 1; i <= 6; i += 1){
        var yy = 128 + i * 18;
        s += line(185, 180, 250, yy, MUTED, 1.4);
        s += text(258, yy + 4, "(T, " + i + ")   1/2 \u00d7 1/6 = 1/12", {size: 12, anchor: "start"});
      }
      return s + '</svg>';
    }
  };

  figs["13.3"] = {
    caption: "Fig. 13.3 — Independent events E and F: E = (E ∩ F) ∪ (E ∩ F′) and P(E ∩ F′) = P(E) − P(E)P(F) (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 420 250" role="img" aria-label="Venn diagram of E, F and their intersection">';
      s += '<rect x="14" y="34" width="392" height="182" rx="10" fill="none" stroke="' + MUTED + '" stroke-width="1.5" stroke-dasharray="5 4"/>';
      s += text(28, 26, "S", {size: 14, color: MUTED, anchor: "start"});
      s += '<ellipse cx="170" cy="128" rx="112" ry="72" fill="rgba(56,189,248,.14)" stroke="' + BLUE + '" stroke-width="2"/>';
      s += '<ellipse cx="252" cy="128" rx="112" ry="72" fill="rgba(244,114,182,.14)" stroke="' + PINK + '" stroke-width="2"/>';
      s += '<path d="M211 62 A 112 72 0 0 1 211 194 A 112 72 0 0 1 211 62 Z" fill="rgba(52,211,153,.30)" stroke="' + GREEN + '" stroke-width="1.6"/>';
      s += text(120, 66, "E", {size: 17, color: BLUE, weight: 700});
      s += text(304, 66, "F", {size: 17, color: PINK, weight: 700});
      s += text(211, 122, "E \u2229 F", {size: 13, color: GREEN, weight: 700});
      s += text(211, 140, "1/8", {size: 12, color: GREEN});
      s += text(120, 190, "E \u2229 F\u2032", {size: 12, color: MUTED});
      s += text(302, 190, "E\u2032 \u2229 F", {size: 12, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["13.4"] = {
    caption: "Fig. 13.4 — A partition E₁, E₂, …, Eₙ of the sample space S: pairwise disjoint, exhaustive, P(Eᵢ) > 0 (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 420 250" role="img" aria-label="Partition of the sample space into disjoint slices">';
      var cx = 210, cy = 130, r = 104;
      var i, a0;
      var cols = [BLUE, GREEN, AMBER, PINK, "#a78bfa"];
      for(i = 0; i < 5; i += 1){
        a0 = -Math.PI / 2 + i * 2 * Math.PI / 5;
        var a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / 5;
        var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
        var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        s += '<path d="M' + cx + ' ' + cy + ' L' + x0 + ' ' + y0 + ' A' + r + ' ' + r + ' 0 0 1 ' + x1 + ' ' + y1 + ' Z" fill="' + cols[i] + '" fill-opacity=".16" stroke="' + cols[i] + '" stroke-width="1.8"/>';
        var am = (a0 + a1) / 2;
        s += text(cx + 58 * Math.cos(am), cy + 58 * Math.sin(am) + 4, "E" + (i + 1), {size: 14, color: cols[i], weight: 700});
      }
      s += text(210, 30, "S", {size: 14, color: MUTED});
      s += text(210, 236, "E\u2081 \u222a E\u2082 \u222a \u2026 \u222a E\u2099 = S,  E\u1d62 \u2229 E\u2c7c = \u03c6", {size: 12, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["Misc.6"] = {
    caption: "Table for Miscellaneous Exercise Q6 — 10 marbles per box: red / white / black counts for boxes A, B, C, D (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 420 220" role="img" aria-label="Marble composition table for boxes A, B, C and D">';
      var rows = [["A", 1, 6, 3], ["B", 6, 2, 2], ["C", 8, 1, 1], ["D", 0, 6, 4]];
      var x0 = 70, y0 = 54, cw = 82, rh = 32;
      var heads = ["Box", "Red", "White", "Black"];
      var i;
      for(i = 0; i < 4; i += 1){
        s += '<rect x="' + (x0 + i * cw) + '" y="' + (y0 - rh) + '" width="' + cw + '" height="' + rh + '" fill="rgba(56,189,248,.18)" stroke="' + MUTED + '" stroke-width="1"/>';
        s += text(x0 + i * cw + cw / 2, y0 - 11, heads[i], {size: 13, weight: 700, color: i === 1 ? PINK : INK});
      }
      rows.forEach(function(r, ri){
        var y = y0 + ri * rh;
        for(i = 0; i < 4; i += 1){
          s += '<rect x="' + (x0 + i * cw) + '" y="' + y + '" width="' + cw + '" height="' + rh + '" fill="' + (ri % 2 ? "rgba(148,163,184,.06)" : "transparent") + '" stroke="' + MUTED + '" stroke-width="1"/>';
          s += text(x0 + i * cw + cw / 2, y + 21, String(r[i]), {size: 14, color: i === 1 ? "#fbcfe8" : INK});
        }
      });
      s += text(210, 30, "Coloured marbles per box (10 marbles each)", {size: 14, weight: 700});
      s += text(210, 210, "Each box is chosen with probability 1/4", {size: 12, color: GREEN});
      return s + '</svg>';
    }
  };

  return figs;
})();
