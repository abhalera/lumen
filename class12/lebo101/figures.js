// Textbook figures used by the exercises, redrawn as SVG from
// books/originals/Class12-Biology_lebo101.pdf (Figures 1.7d and 1.8).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", AMBER = "#fbbf24", VIOLET = "#a78bfa",
      GREEN = "#34d399", BLUE = "#38bdf8", PINK = "#f472b6";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 12) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function line(x1, y1, x2, y2, color, w, dash){
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="' + (w || 2) + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/>';
  }

  var figs = {};

  figs["1.7d"] = {
    caption: "Fig. 1.7d \u2014 Anatropous ovule (redrawn): funicle, hilum, integuments, micropyle, chalaza, nucellus and the embryo sac.",
    svg: function(){
      var s = '<svg viewBox="0 0 460 300" role="img" aria-label="Longitudinal section of an anatropous ovule">';
      s += '<rect width="460" height="300" fill="#09131d"/>';
      s += '<ellipse cx="250" cy="150" rx="115" ry="85" fill="#26384c" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<ellipse cx="250" cy="150" rx="94" ry="66" fill="#1b2a3a" stroke="#64748b" stroke-width="2"/>';
      s += '<ellipse cx="250" cy="150" rx="64" ry="42" fill="#0f2438" stroke="' + VIOLET + '" stroke-width="2"/>';
      s += text(250, 154, "embryo sac", {color: VIOLET});
      s += text(250, 62, "integuments (1 or 2)", {color: MUTED});
      s += text(250, 196, "nucellus", {color: INK, size: 13});
      s += line(135, 150, 70, 150, MUTED, 3);
      s += '<circle cx="70" cy="150" r="5" fill="' + AMBER + '"/>';
      s += text(84, 132, "hilum", {color: AMBER});
      s += text(58, 176, "funicle", {color: MUTED});
      s += '<polygon points="365,150 400,136 400,164" fill="' + PINK + '"/>';
      s += text(414, 132, "micropyle", {color: PINK, anchor: "end"});
      s += '<polygon points="135,150 100,136 100,164" fill="' + BLUE + '"/>';
      s += text(96, 186, "chalaza", {color: BLUE});
      s += '</svg>';
      return s;
    }
  };

  figs["1.8"] = {
    caption: "Fig. 1.8b\u2013c \u2014 Mature embryo sac (redrawn): a 7-celled, 8-nucleate female gametophyte with the egg apparatus, two polar nuclei and three antipodals.",
    svg: function(){
      var s = '<svg viewBox="0 0 480 300" role="img" aria-label="Mature 7-celled 8-nucleate embryo sac">';
      s += '<rect width="480" height="300" fill="#09131d"/>';
      s += '<ellipse cx="240" cy="150" rx="195" ry="105" fill="#0f2438" stroke="' + VIOLET + '" stroke-width="3"/>';
      // egg apparatus, micropylar (left)
      s += '<ellipse cx="108" cy="100" rx="19" ry="26" fill="' + GREEN + '"/>';
      s += text(108, 105, "S", {color: "#052e16", weight: 700});
      s += '<ellipse cx="108" cy="200" rx="19" ry="26" fill="' + GREEN + '"/>';
      s += text(108, 205, "S", {color: "#052e16", weight: 700});
      s += '<ellipse cx="176" cy="150" rx="22" ry="30" fill="' + AMBER + '"/>';
      s += text(176, 156, "egg", {color: "#111827", weight: 700});
      s += text(146, 56, "egg apparatus: 2 synergids + egg", {color: GREEN});
      // central cell polar nuclei
      s += '<circle cx="256" cy="150" r="21" fill="' + VIOLET + '"/>';
      s += '<circle cx="292" cy="150" r="21" fill="' + VIOLET + '"/>';
      s += text(256, 155, "P", {color: "#1e1b4b", weight: 700});
      s += text(292, 155, "P", {color: "#1e1b4b", weight: 700});
      s += text(274, 205, "central cell: 2 polar nuclei", {color: "#c4b5fd"});
      // antipodals, chalazal (right)
      var i;
      for(i = 0; i < 3; i += 1){
        var ay = 100 + i * 60;
        s += '<circle cx="386" cy="' + ay + '" r="16" fill="' + BLUE + '"/>';
        s += text(386, ay + 4, "A", {color: "#082f49", weight: 700});
      }
      s += text(386, 56, "3 antipodals", {color: BLUE});
      s += text(240, 282, "7 cells \u00b7 8 nuclei", {color: INK, size: 14, weight: 700});
      s += '</svg>';
      return s;
    }
  };

  return figs;
})();
