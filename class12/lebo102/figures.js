// Textbook figures used by the exercises, redrawn as SVG from
// books/originals/Class12-Biology_lebo102.pdf (Figures 2.1, 2.2, 2.3, 2.6
// and the ovarian follicle series of Figure 2.7).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", AMBER = "#fbbf24", VIOLET = "#a78bfa",
      GREEN = "#34d399", BLUE = "#38bdf8", PINK = "#f472b6", RED = "#f87171";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 12) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function line(x1, y1, x2, y2, color, w, dash){
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="' + (w || 2) + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/>';
  }
  function circle(cx, cy, r, fill, extra){
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' + (extra || "") + '/>';
  }
  function ellipse(cx, cy, rx, ry, fill, extra){
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' + (extra || "") + '/>';
  }

  var figs = {};

  figs["2.1"] = {
    caption: "Fig. 2.1a\u2013b \u2014 Male reproductive system (redrawn): testes in the scrotum, rete testis \u2192 vasa efferentia \u2192 epididymis \u2192 vas deferens \u2192 ejaculatory duct \u2192 urethra, with seminal vesicles, prostate and bulbourethral glands.",
    svg: function(){
      var s = '<svg viewBox="0 0 520 320" role="img" aria-label="Diagram of the male reproductive system">';
      s += '<rect width="520" height="320" fill="#09131d"/>';
      s += '<rect x="205" y="52" width="110" height="42" rx="14" fill="#3b4a63" stroke="' + MUTED + '"/>';
      s += text(260, 79, "urinary bladder", {color: INK, size: 11});
      s += line(238, 40, 238, 54, BLUE, 3);
      s += line(282, 40, 282, 54, BLUE, 3);
      s += ellipse(165, 96, 34, 22, AMBER, '" opacity=".9"');
      s += ellipse(355, 96, 34, 22, AMBER, '" opacity=".9"');
      s += text(165, 72, "seminal", {color: AMBER, size: 11});
      s += text(165, 56, "vesicle", {color: AMBER, size: 11});
      s += text(355, 72, "seminal", {color: AMBER, size: 11});
      s += text(355, 56, "vesicle", {color: AMBER, size: 11});
      s += circle(260, 150, 26, GREEN, '" opacity=".85"');
      s += text(260, 154, "prostate", {color: "#052e16", size: 10, weight: 700});
      s += circle(190, 190, 15, BLUE);
      s += circle(330, 190, 15, BLUE);
      s += text(190, 218, "bulbourethral", {color: BLUE, size: 10});
      s += text(330, 218, "bulbourethral", {color: BLUE, size: 10});
      s += line(200, 100, 235, 140, PINK, 3);
      s += line(320, 100, 285, 140, PINK, 3);
      s += text(140, 140, "vas deferens", {color: PINK, size: 11});
      s += text(380, 140, "vas deferens", {color: PINK, size: 11});
      s += line(260, 176, 260, 262, MUTED, 6);
      s += text(286, 230, "urethra", {color: INK, size: 11});
      s += '<rect x="246" y="262" width="28" height="34" rx="12" fill="' + MUTED + '"/>';
      s += text(260, 314, "penis \u2192 urethral meatus", {color: MUTED, size: 11});
      s += ellipse(90, 235, 30, 22, AMBER, '" opacity=".95"');
      s += text(90, 240, "testis", {color: "#451a03", size: 11, weight: 700});
      s += ellipse(150, 260, 26, 15, GREEN, '" opacity=".8"');
      s += text(150, 264, "epididymis", {color: "#052e16", size: 9});
      s += line(112, 240, 132, 252, GREEN, 3);
      s += text(62, 278, "scrotum", {color: MUTED, size: 11});
      s += '<ellipse cx="90" cy="262" rx="46" ry="30" fill="none" stroke="' + MUTED + '" stroke-width="2" stroke-dasharray="4 4"/>';
      s += text(260, 36, "rete testis \u2192 vasa efferentia open into the epididymis", {color: MUTED, size: 11});
      s += '</svg>';
      return s;
    }
  };

  figs["2.2"] = {
    caption: "Fig. 2.2 \u2014 Section of a seminiferous tubule (redrawn): spermatogonia and Sertoli cells in the lining, with Leydig cells and blood vessels in the interstitial space.",
    svg: function(){
      var s = '<svg viewBox="0 0 460 300" role="img" aria-label="Sectional view of a seminiferous tubule">';
      s += '<rect width="460" height="300" fill="#09131d"/>';
      s += circle(220, 150, 108, "#132132", ' stroke="' + AMBER + '" stroke-width="3"');
      s += circle(220, 150, 78, "#1b2a3a");
      var i;
      for(i = 0; i < 10; i += 1){
        var a = i * Math.PI / 5;
        s += circle(220 + Math.cos(a) * 88, 150 + Math.sin(a) * 88, 12, AMBER);
      }
      for(i = 0; i < 6; i += 1){
        var b = i * Math.PI / 3 + 0.5;
        s += ellipse(220 + Math.cos(b) * 64, 150 + Math.sin(b) * 64, 9, 18, GREEN, ' transform="rotate(' + (b * 180 / Math.PI + 90) + ' ' + (220 + Math.cos(b) * 64) + ' ' + (150 + Math.sin(b) * 64) + ')"');
      }
      s += text(220, 154, "lumen", {color: MUTED});
      s += text(388, 70, "spermatogonium", {color: AMBER, anchor: "middle"});
      s += line(388, 78, 300, 106, MUTED, 1);
      s += text(80, 80, "Sertoli cell", {color: GREEN});
      s += line(116, 86, 168, 108, MUTED, 1);
      s += circle(390, 220, 15, BLUE);
      s += text(390, 224, "L", {color: "#082f49", weight: 700});
      s += text(390, 252, "Leydig cell", {color: BLUE});
      s += text(390, 268, "(androgens)", {color: BLUE});
      s += circle(60, 228, 11, RED);
      s += text(60, 258, "blood vessel", {color: RED});
      s += line(72, 228, 112, 208, MUTED, 1);
      s += text(220, 288, "spermatogonia \u2192 meiosis; Sertoli cells nourish; Leydig cells outside", {color: MUTED, size: 11});
      s += '</svg>';
      return s;
    }
  };

  figs["2.3"] = {
    caption: "Fig. 2.3a\u2013b \u2014 Female reproductive system (redrawn): ovary, fimbriae, infundibulum, ampulla, isthmus, uterus, cervix and vagina.",
    svg: function(){
      var s = '<svg viewBox="0 0 520 320" role="img" aria-label="Diagram of the female reproductive system">';
      s += '<rect width="520" height="320" fill="#09131d"/>';
      s += ellipse(90, 150, 34, 26, AMBER, '" opacity=".95"');
      s += text(90, 154, "ovary", {color: "#451a03", size: 10, weight: 700});
      s += text(90, 110, "2\u20134 cm", {color: MUTED, size: 10});
      s += '<path d="M126 140 Q210 110 300 130" fill="none" stroke="' + INK + '" stroke-width="7"/>';
      s += '<path d="M126 162 Q210 195 300 176" fill="none" stroke="' + INK + '" stroke-width="7"/>';
      s += line(134, 136, 120, 116, GREEN, 2);
      s += line(140, 132, 128, 110, GREEN, 2);
      s += text(158, 106, "fimbriae", {color: GREEN, size: 11});
      s += text(214, 106, "infundibulum", {color: BLUE, size: 11});
      s += text(300, 106, "ampulla", {color: VIOLET, size: 11});
      s += text(392, 106, "isthmus", {color: PINK, size: 11});
      s += line(214, 112, 214, 122, MUTED, 1);
      s += line(300, 112, 300, 122, MUTED, 1);
      s += line(392, 112, 392, 124, MUTED, 1);
      s += ellipse(360, 152, 60, 76, VIOLET, '" opacity=".35" stroke="' + VIOLET + '" stroke-width="2"');
      s += text(360, 148, "uterus", {color: INK, size: 13, weight: 700});
      s += text(360, 168, "(inverted pear)", {color: MUTED, size: 10});
      s += '<rect x="348" y="228" width="24" height="34" rx="8" fill="' + MUTED + '"/>';
      s += text(392, 248, "cervix", {color: INK, size: 11});
      s += line(360, 262, 360, 298, MUTED, 4);
      s += text(360, 314, "vagina: with the cervical canal forms the birth canal", {color: MUTED, size: 11});
      s += text(360, 44, "oviduct (fallopian tube): 10\u201312 cm", {color: MUTED, size: 11});
      s += '</svg>';
      return s;
    }
  };

  figs["2.6"] = {
    caption: "Fig. 2.6 \u2014 Human sperm (redrawn): head with acrosome and haploid nucleus, neck, mitochondria-packed middle piece and tail.",
    svg: function(){
      var s = '<svg viewBox="0 0 520 220" role="img" aria-label="Labelled diagram of a human sperm">';
      s += '<rect width="520" height="220" fill="#09131d"/>';
      s += ellipse(155, 110, 64, 44, AMBER, '" opacity=".9"');
      s += ellipse(175, 110, 44, 34, VIOLET, '" opacity=".95"');
      s += '<path d="M100 78 Q118 110 100 142 Q130 126 132 110 Q130 94 100 78 Z" fill="' + PINK + '"/>';
      s += text(103, 74, "acrosome", {color: PINK, size: 11, anchor: "start"});
      s += text(182, 114, "nucleus", {color: "#1e1b4b", size: 10, weight: 700});
      s += text(155, 170, "head", {color: AMBER, size: 12, weight: 700});
      s += '<rect x="219" y="100" width="18" height="20" rx="6" fill="' + GREEN + '"/>';
      s += text(228, 88, "neck", {color: GREEN, size: 11});
      s += ellipse(285, 110, 46, 17, BLUE, '" opacity=".9"');
      for(var i = 0; i < 4; i += 1){
        s += circle(250 + i * 22, 110, 6, "#0f2438");
      }
      s += text(285, 70, "middle piece (mitochondria)", {color: BLUE, size: 11});
      s += '<path d="M331 110 Q400 96 470 140" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>';
      s += text(430, 178, "tail (motility)", {color: INK, size: 11});
      s += '</svg>';
      return s;
    }
  };

  figs["2.7"] = {
    caption: "Fig. 2.7 \u2014 Section of the ovary (redrawn): cortex and medulla with primary, secondary, tertiary (antrum) and Graafian follicles plus a corpus luteum.",
    svg: function(){
      var s = '<svg viewBox="0 0 480 300" role="img" aria-label="Section through the ovary showing follicle stages">';
      s += '<rect width="480" height="300" fill="#09131d"/>';
      s += ellipse(240, 150, 150, 118, "#132132", ' stroke="' + MUTED + '" stroke-width="2"');
      s += ellipse(240, 158, 118, 88, "#1b2a3a", ' stroke="#475569" stroke-width="1.5"');
      s += ellipse(240, 168, 70, 50, "#26384c", ' stroke="#475569" stroke-width="1.5"');
      s += text(240, 66, "cortex", {color: MUTED});
      s += text(240, 192, "medulla", {color: MUTED});
      // primary follicle
      s += circle(120, 100, 26, "#0f2438", ' stroke="' + AMBER + '" stroke-width="2"');
      s += circle(120, 100, 12, AMBER);
      s += text(96, 56, "primary follicle", {color: AMBER});
      // secondary
      s += circle(360, 96, 30, "#0f2438", ' stroke="' + BLUE + '" stroke-width="2"');
      s += circle(360, 96, 13, BLUE);
      s += text(378, 56, "secondary follicle", {color: BLUE});
      // tertiary with antrum
      s += circle(150, 210, 34, "#0f2438", ' stroke="' + VIOLET + '" stroke-width="2"');
      s += circle(150, 210, 14, VIOLET);
      s += circle(172, 198, 14, "#09131d", ' stroke="' + VIOLET + '" stroke-width="1.5"');
      s += text(108, 254, "tertiary (antrum)", {color: VIOLET});
      // Graafian
      s += circle(330, 208, 40, "#0f2438", ' stroke="' + GREEN + '" stroke-width="2.5"');
      s += circle(330, 210, 16, GREEN);
      s += circle(352, 196, 19, "#09131d", ' stroke="' + GREEN + '" stroke-width="1.5"');
      s += text(356, 258, "Graafian", {color: GREEN});
      // corpus luteum
      s += circle(240, 150, 18, PINK, '" opacity=".85"');
      s += text(240, 126, "corpus luteum", {color: PINK, size: 11});
      s += '</svg>';
      return s;
    }
  };

  figs["2.7g"] = {
    caption: "Fig. 2.7 \u2014 Mature Graafian follicle (redrawn): theca externa and interna, granulosa cells, fluid antrum, secondary oocyte with zona pellucida and the first polar body.",
    svg: function(){
      var s = '<svg viewBox="0 0 460 300" role="img" aria-label="Mature Graafian follicle">';
      s += '<rect width="460" height="300" fill="#09131d"/>';
      s += circle(220, 150, 118, "#132132", ' stroke="' + PINK + '" stroke-width="3"');
      s += circle(220, 150, 104, "#1b2a3a", ' stroke="' + AMBER + '" stroke-width="2.5"');
      s += circle(220, 150, 88, "#0f2438", ' stroke="' + VIOLET + '" stroke-width="2"');
      s += circle(220, 150, 56, "#09131d", ' stroke="' + BLUE + '" stroke-width="2"');
      s += text(220, 120, "antrum", {color: BLUE, size: 12});
      s += circle(185, 185, 26, GREEN);
      s += circle(185, 185, 18, "#0f2438", ' stroke="' + INK + '" stroke-width="2"');
      s += circle(185, 185, 10, AMBER);
      s += text(185, 240, "secondary oocyte", {color: GREEN});
      s += text(185, 256, "+ zona pellucida", {color: GREEN, size: 11});
      s += circle(214, 206, 5, PINK);
      s += text(244, 236, "first polar body", {color: PINK, size: 11, anchor: "start"});
      s += text(396, 62, "theca externa", {color: PINK, size: 11, anchor: "start"});
      s += text(396, 84, "theca interna", {color: AMBER, size: 11, anchor: "start"});
      s += text(396, 106, "granulosa", {color: VIOLET, size: 11, anchor: "start"});
      s += line(392, 58, 330, 74, MUTED, 1);
      s += line(392, 80, 316, 96, MUTED, 1);
      s += line(392, 102, 300, 122, MUTED, 1);
      s += text(220, 290, "theca interna/externa, granulosa, antrum, oocyte \u2014 pre-ovulation", {color: MUTED, size: 11});
      s += '</svg>';
      return s;
    }
  };

  return figs;
})();
