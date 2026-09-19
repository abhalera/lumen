// Textbook figures used by the exercises, redrawn as SVG from
// books/originals/Class12-Biology_lebo113.pdf (Figures 13.1 and 13.2).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", AMBER = "#fbbf24", VIOLET = "#a78bfa",
      GREEN = "#34d399", BLUE = "#38bdf8", PINK = "#f472b6", ORANGE = "#fb923c";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 12) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  // Proportional wedge on a donut of radius r centred at (cx,cy), from startDeg to endDeg
  // (0deg = 12 o'clock, clockwise), used for the three qualitative pie charts in Fig 13.1.
  function wedge(cx, cy, r, startDeg, endDeg, color){
    var toXY = function(deg){
      var rad = (deg - 90) * Math.PI / 180;
      return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
    };
    var p1 = toXY(startDeg), p2 = toXY(endDeg);
    var large = (endDeg - startDeg) > 180 ? 1 : 0;
    return '<path d="M' + cx + ',' + cy + ' L' + p1[0].toFixed(1) + ',' + p1[1].toFixed(1) +
      ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1) + ' Z" fill="' + color + '"/>';
  }

  var figs = {};

  // Fig 13.1: three proportionate pie charts (Invertebrates, Vertebrates, Plants).
  // Source shows qualitative majority slices only (no printed percentages), so the
  // wedge angles below are approximate to match the source drawing, not precise data.
  figs["13.1"] = {
    caption: "Fig. 13.1 — Representing global biodiversity (redrawn): proportionate number of species of major taxa of invertebrates, vertebrates and plants. Insects, fishes and fungi/angiosperms are each the largest slice in their group, matching the source figure's proportions (no percentages are printed in the original).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 300" role="img" aria-label="Three pie charts: invertebrate, vertebrate and plant species proportions">';
      s += '<rect width="720" height="300" fill="#09131d"/>';

      // Invertebrates (left): Insects ~70%, Molluscs, Crustaceans, Other animal groups
      var icx = 130, icy = 150, ir = 78;
      s += text(icx, 40, "INVERTEBRATES", {weight: 700, size: 13});
      s += wedge(icx, icy, ir, 0, 252, AMBER);
      s += wedge(icx, icy, ir, 252, 288, GREEN);
      s += wedge(icx, icy, ir, 288, 306, VIOLET);
      s += wedge(icx, icy, ir, 306, 360, ORANGE);
      s += text(icx, icy + 30, "Insects", {color: "#111827", weight: 700, size: 12});
      s += text(icx - 95, icy + 55, "Molluscs", {color: GREEN, anchor: "start", size: 11});
      s += text(icx - 95, icy - 70, "Crustaceans", {color: VIOLET, anchor: "start", size: 11});
      s += text(icx - 20, icy - 95, "Other animal groups", {color: ORANGE, size: 11});

      // Vertebrates (right): Fishes ~48%, Amphibians, Reptiles, Birds, Mammals
      var vcx = 430, vcy = 150, vr = 78;
      s += text(vcx, 40, "VERTEBRATES", {weight: 700, size: 13});
      s += wedge(vcx, vcy, vr, 0, 173, BLUE);
      s += wedge(vcx, vcy, vr, 173, 210, GREEN);
      s += wedge(vcx, vcy, vr, 210, 260, AMBER);
      s += wedge(vcx, vcy, vr, 260, 312, "#7dd3fc");
      s += wedge(vcx, vcy, vr, 312, 360, ORANGE);
      s += text(vcx - 15, vcy + 10, "Fishes", {color: "#111827", weight: 700, size: 12});
      s += text(vcx - 20, vcy + 65, "Amphibians", {color: GREEN, size: 11});
      s += text(vcx + 60, vcy + 55, "Reptiles", {color: "#78350f", size: 11});
      s += text(vcx + 78, vcy - 20, "Birds", {color: "#0c4a6e", size: 11});
      s += text(vcx + 45, vcy - 68, "Mammals", {color: ORANGE, size: 11});

      // Plants (bottom centre): Fungi + Angiosperms majority, Algae, Lichens, Mosses, Ferns
      var pcx = 590, pcy = 150, pr = 78;
      s += text(pcx, 40, "PLANTS", {weight: 700, size: 13});
      s += wedge(pcx, pcy, pr, 0, 175, GREEN);
      s += wedge(pcx, pcy, pr, 175, 340, "#fde68a");
      s += wedge(pcx, pcy, pr, 340, 352, PINK);
      s += wedge(pcx, pcy, pr, 352, 358, ORANGE);
      s += wedge(pcx, pcy, pr, 358, 360, VIOLET);
      s += text(pcx - 40, pcy + 5, "Fungi", {color: "#052e16", weight: 700, size: 12});
      s += text(pcx + 40, pcy + 5, "Angiosperms", {color: "#78350f", weight: 700, size: 11});
      s += text(pcx - 5, pcy + 92, "Algae", {color: PINK, size: 11});
      s += text(pcx + 45, pcy + 92, "Lichens", {color: ORANGE, size: 11});
      s += text(pcx - 10, pcy - 92, "Mosses / Ferns and allies", {color: VIOLET, size: 11});

      s += '</svg>';
      return s;
    }
  };

  // Fig 13.2: species-area relationship, S = C*A^Z (rectangular hyperbola) and its
  // log-log straight line log S = log C + Z log A.
  figs["13.2"] = {
    caption: "Fig. 13.2 — Species–area relationship (redrawn): on a normal scale S = CAᶻ is a rectangular hyperbola; on a log–log scale the same relationship is the straight line log S = log C + Z log A.",
    svg: function(){
      var s = '<svg viewBox="0 0 460 300" role="img" aria-label="Species-area relationship: rectangular hyperbola and its log-log straight line">';
      s += '<rect width="460" height="300" fill="#09131d"/>';
      // Axes
      s += '<line x1="60" y1="40" x2="60" y2="250" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<line x1="60" y1="250" x2="420" y2="250" stroke="' + MUTED + '" stroke-width="2"/>';
      s += text(30, 145, "Species richness", {color: MUTED, size: 12, anchor: "middle"}).replace('x="30" y="145"', 'x="30" y="145" transform="rotate(-90 30 145)"');
      s += text(240, 275, "Area", {color: MUTED, size: 12});

      // Rectangular hyperbola S = C*A^Z (Z<1): rises steeply then flattens
      var pts = [];
      for (var i = 0; i <= 40; i++){
        var a = i / 40; // 0..1 normalised area
        var sVal = Math.pow(a, 0.28); // Z<1 shape, matches the flattening curve in the source
        var x = 60 + a * 340;
        var y = 250 - sVal * 175;
        pts.push(x.toFixed(1) + ',' + y.toFixed(1));
      }
      s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + BLUE + '" stroke-width="3"/>';
      s += text(150, 90, "S = CAᶻ", {color: BLUE, size: 14, weight: 700});

      // Straight log-log line from near-origin to upper area of the curve's start
      s += '<line x1="75" y1="235" x2="280" y2="95" stroke="' + PINK + '" stroke-width="3"/>';
      s += text(200, 150, "log S = log C + Z log A", {color: PINK, size: 12}).replace('x="200" y="150"', 'x="200" y="150" transform="rotate(-31 200 150)"');
      s += text(150, 210, "log-log scale", {color: PINK, size: 11}).replace('x="150" y="210"', 'x="150" y="210" transform="rotate(-31 150 210)"');
      s += '</svg>';
      return s;
    }
  };

  return figs;
})();
