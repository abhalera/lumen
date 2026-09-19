// Textbook figures cited by the lebo112 exercises, redrawn as SVG.
// Figure 12.3 (energy flow, PDF p. 7) and Figure 12.4 (ecological pyramids, PDF pp. 8–9).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", OK = "#34d399", RED = "#f87171", BLUE = "#38bdf8";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function rect(x, y, w, h, fill, extra){
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function line(x1, y1, x2, y2, color, w, dash){
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="' + (w || 1.5) + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
  }
  function pyramid(cx, topY, rows, cols, widths, names){
    var s = "";
    for(var i = 0; i < rows.length; i++){
      var w = widths[i];
      var y = topY + i * 44;
      s += rect(cx - w / 2, y, w, 36, cols[i], ' rx="3" opacity="0.9"');
      s += text(cx, y + 24, rows[i], {size: 11, color: "#08131d", weight: 700});
      if(names) s += text(cx - w / 2 - 8, y + 24, names[i], {size: 10, color: MUTED, anchor: "end"});
    }
    return s;
  }

  var figs = {};

  figs["12.3"] = {
    caption: "Figure 12.3 \u2014 energy flow through different trophic levels: about 10 per cent crosses each level (10 000 \u2192 1 000 \u2192 100 \u2192 10 J) and the rest is lost as heat, redrawn.",
    svg: function(){
      var s = '<svg viewBox="0 0 720 300" role="img" aria-label="Energy flow chain from producers to secondary carnivores with the ten per cent law">';
      s += rect(0, 0, 720, 300, "#09131d");
      var labels = ["Producers", "Herbivores", "Primary carnivores", "Secondary carnivores"];
      var vals = ["10 000 J", "1 000 J", "100 J", "10 J"];
      var cols = [OK, "#f59e0b", BLUE, "#a78bfa"];
      var hs = [190, 128, 84, 56];
      for(var i = 0; i < 4; i++){
        var bx = 50 + i * 170;
        s += rect(bx, 220 - hs[i], 130, hs[i], "#0f1f2e", ' rx="6" stroke="' + cols[i] + '" stroke-width="2"');
        s += rect(bx, 220 - hs[i], 130, Math.min(14, hs[i]), cols[i], ' rx="6"');
        s += text(bx + 65, 34, labels[i], {size: 10, color: cols[i]});
        s += text(bx + 65, 240, vals[i], {size: 12, color: INK});
        if(i < 3){
          s += text(bx + 150, 120, "\u2192", {size: 18, color: MUTED});
          s += text(bx + 150, 140, "90% heat", {size: 10, color: RED});
        }
      }
      s += text(360, 272, "T1 producers \u2192 T2 herbivores \u2192 T3 carnivores \u2192 T4 secondary carnivores: the 10 per cent law restricts the chain length.", {size: 10, color: "#64748b"});
      s += text(360, 290, "Sun is the only energy source (except deep-sea hydrothermal); PAR < 50% of incident radiation; plants capture 2\u201310% of PAR.", {size: 10, color: "#64748b"});
      return s + '</svg>';
    }
  };

  figs["12.4"] = {
    caption: "Figure 12.4 \u2014 pyramids of number and biomass: a grassland number pyramid has nearly 6 million plants supporting only 3 top-carnivores; biomass decreases sharply at higher trophic levels, redrawn.",
    svg: function(){
      var s = '<svg viewBox="0 0 720 300" role="img" aria-label="Pyramid of numbers and pyramid of biomass">';
      s += rect(0, 0, 720, 300, "#09131d");
      s += text(180, 26, "(a) Pyramid of numbers, grassland", {size: 12, color: INK});
      s += pyramid(180, 44, ["6 000 000", "700 000", "3 000", "3"], [OK, "#f59e0b", BLUE, "#a78bfa"], [230, 150, 90, 46], null);
      s += text(180, 250, "nearly 6 million plants \u2192 3 top-carnivores", {size: 11, color: MUTED});
      s += text(540, 26, "(b) Pyramid of biomass", {size: 12, color: INK});
      s += pyramid(540, 44, ["809", "37", "11", "1.5"], [OK, "#f59e0b", BLUE, "#a78bfa"], [230, 140, 80, 40], ["prod.", "herb.", "carn.", "top"]);
      s += text(540, 250, "biomass sharply decreases upward (g m\u207b\u00b2)", {size: 11, color: MUTED});
      s += text(360, 282, "Base = producers (T1), apex = tertiary/top consumers; calculations must include all organisms at a level.", {size: 10, color: "#64748b"});
      return s + '</svg>';
    }
  };

  figs["12.4c"] = {
    caption: "Figure 12.4c \u2014 upright and inverted pyramids: tree numbers invert (1 tree \u2192 thousands of insects) and the sea's biomass pyramid is inverted (fish biomass exceeds the phytoplankton standing crop), redrawn.",
    svg: function(){
      var s = '<svg viewBox="0 0 720 300" role="img" aria-label="Upright and inverted ecological pyramids">';
      s += rect(0, 0, 720, 300, "#09131d");
      s += text(180, 26, "upright: producers widest", {size: 12, color: INK});
      s += pyramid(180, 44, ["6 000 000", "700 000", "3 000", "3"], [OK, "#f59e0b", BLUE, "#a78bfa"], [240, 160, 96, 50], null);
      s += text(180, 248, "grassland numbers (Fig 12.4a)", {size: 11, color: MUTED});
      s += text(540, 26, "inverted: base narrower", {size: 12, color: INK});
      s += pyramid(540, 44, ["1 tree", "thousands", "tens", "2"], ["#38bdf8", "#f59e0b", "#34d399", "#a78bfa"], [54, 140, 190, 230], ["producer", "insects", "small birds", "large birds"]);
      s += text(540, 248, "tree numbers (inverted)", {size: 11, color: MUTED});
      s += text(360, 282, "The sea's biomass pyramid is also generally inverted: fish biomass far exceeds the small phytoplankton standing crop.", {size: 10, color: "#64748b"});
      return s + '</svg>';
    }
  };

  return figs;
})();
