// Textbook structures used by the lech202 exercises, redrawn as SVG from the printed
// structures in books/originals/Class12-Chemistry-Pt2_lech202.pdf (exercise pp. 222–224).
// Rings are drawn as skeletal formulae; chains and equations as condensed formulae.
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa", GOLD = "#fbbf24";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 15) + '" ' +
      'text-anchor="' + (o.anchor || "middle") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') +
      (o.mono ? ' font-family="ui-monospace,monospace"' : '') + '>' + s + '</text>';
  }
  function line(x1, y1, x2, y2, color, w){
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (color || INK) +
      '" stroke-width="' + (w || 2) + '" stroke-linecap="round"/>';
  }
  function pts(cx, cy, r, rot){
    var out = [];
    for(var k = 0; k < 6; k++){
      var a = Math.PI / 180 * (60 * k - 90 + (rot || 0));
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return out;
  }
  function cyclo(cx, cy, r, rot){
    var p = pts(cx, cy, r, rot), s = "";
    for(var k = 0; k < 6; k++){
      var q = p[(k + 1) % 6];
      s += line(p[k][0], p[k][1], q[0], q[1], INK, 2);
    }
    return s;
  }
  function benzene(cx, cy, r, rot){
    var p = pts(cx, cy, r, rot), s = cyclo(cx, cy, r, rot);
    [0, 2, 4].forEach(function(k){
      var a = p[k], b = p[(k + 1) % 6];
      var ax = cx + (a[0] - cx) * 0.72, ay = cy + (a[1] - cy) * 0.72;
      var bx = cx + (b[0] - cx) * 0.72, by = cy + (b[1] - cy) * 0.72;
      s += line(ax, ay, bx, by, INK, 2);
    });
    return s;
  }
  function poly(pl, color, w){
    var s = "";
    for(var k = 1; k < pl.length; k++){
      s += line(pl[k - 1][0], pl[k - 1][1], pl[k][0], pl[k][1], color || INK, w || 2);
    }
    return s;
  }

  var figs = {};

  figs["7.1"] = {
    caption: "Fig. 7.1 — Exercise 7.1: structures (i)–(xii) redrawn (chains as condensed formulae, phenols as skeletal rings).",
    svg: function(){
      var s = '<svg viewBox="0 0 960 640" role="img" aria-label="Structures (i) to (xii) of Exercise 7.1">';
      s += '<rect width="960" height="640" fill="#09131d"/>';
      s += text(30, 42, "(i)  CH₃–CH(CH₃)–CH(OH)–C(CH₃)₂–CH₃", {anchor: "start", size: 16});
      s += text(510, 42, "(ii)  H₃C–CH(OH)–CH₂–CH(OH)–CH(C₂H₅)–CH₂–CH₃", {anchor: "start", size: 16});
      s += text(30, 96, "(iii)  CH₃–CH(OH)–CH(OH)–CH₃", {anchor: "start", size: 16});
      s += text(510, 96, "(iv)  HO–CH₂–CH(OH)–CH₂–OH", {anchor: "start", size: 16});
      // (v)–(viii): four rings with labels
      var r = 40, y = 230, xs = [120, 340, 560, 780];
      var v = xs.map(function(x){ return pts(x, y, r); });
      s += benzene(xs[0], y, r);
      s += text(xs[0], y - r - 12, "CH₃", {size: 15});
      s += text(v[0][1][0] + 26, v[0][1][1] - 4, "OH", {color: BLUE, size: 15});
      s += text(xs[0], y + r + 30, "(v) 2-methylphenol", {size: 13, color: MUTED});
      s += benzene(xs[1], y, r);
      s += text(xs[1], y - r - 12, "CH₃", {size: 15});
      s += text(xs[1], y + r + 22, "OH", {color: BLUE, size: 15});
      s += text(xs[1], y + r + 48, "(vi) 4-methylphenol", {size: 13, color: MUTED});
      s += benzene(xs[2], y, r);
      s += text(xs[2], y - r - 12, "CH₃", {size: 15});
      s += text(v[2][2][0] + 28, v[2][2][1] + 4, "OH", {color: BLUE, size: 15});
      s += text(xs[2], y + r + 22, "CH₃", {size: 15});
      s += text(xs[2], y + r + 48, "(vii) 2,5-dimethylphenol", {size: 13, color: MUTED});
      s += benzene(xs[3], y, r);
      s += text(xs[3], y - r - 12, "CH₃", {size: 15});
      s += text(v[3][1][0] + 26, v[3][1][1] - 4, "OH", {color: BLUE, size: 15});
      s += text(v[3][2][0] + 26, v[3][2][1] + 12, "CH₃", {size: 15});
      s += text(xs[3], y + r + 48, "(viii) 2,6-dimethylphenol", {size: 13, color: MUTED});
      // (ix)–(xii)
      s += text(30, 400, "(ix)  CH₃–O–CH₂–CH(CH₃)–CH₃", {anchor: "start", size: 16});
      s += text(510, 400, "(x)  C₆H₅–O–C₂H₅", {anchor: "start", size: 16});
      s += text(30, 470, "(xi)  C₆H₅–O–C₇H₁₅(n–)", {anchor: "start", size: 16});
      s += text(510, 470, "(xii)  CH₃–CH₂–O–CH(CH₃)–CH₂–CH₃", {anchor: "start", size: 16});
      s += text(480, 560, "Exercise 7.1 · structures (i)–(xii) · redrawn from the NCERT chapter", {size: 12, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["7.23"] = {
    caption: "Fig. 7.23 — Exercise 7.23: the six ether structures (i)–(vi) redrawn (rings as skeletal formulae).",
    svg: function(){
      var s = '<svg viewBox="0 0 860 430" role="img" aria-label="Ether structures (i) to (vi) of Exercise 7.23">';
      s += '<rect width="860" height="430" fill="#09131d"/>';
      s += text(30, 46, "(i)  C₂H₅OCH₂–CH(CH₃)–CH₃", {anchor: "start", size: 16});
      s += text(470, 46, "(ii)  CH₃OCH₂CH₂Cl", {anchor: "start", size: 16});
      s += text(30, 100, "(iii)  O₂N–C₆H₄–OCH₃ (p)", {anchor: "start", size: 16});
      s += text(470, 100, "(iv)  CH₃CH₂CH₂OCH₃", {anchor: "start", size: 16});
      var r = 46, cy = 255;
      // (v) cyclohexane: gem-dimethyl top, OC2H5 bottom
      var x5 = 190;
      s += cyclo(x5, cy, r);
      s += line(x5, cy - r, x5 - 24, cy - r - 20, INK, 2);
      s += text(x5 - 44, cy - r - 26, "H₃C", {size: 14});
      s += line(x5, cy - r, x5 + 24, cy - r - 20, INK, 2);
      s += text(x5 + 42, cy - r - 26, "CH₃", {size: 14});
      s += line(x5, cy + r, x5, cy + r + 14, GOLD, 2);
      s += text(x5, cy + r + 32, "OC₂H₅", {size: 15, color: GOLD});
      s += text(x5, cy + r + 56, "(v) 1-ethoxy-4,4-dimethylcyclohexane", {size: 12, color: MUTED});
      // (vi) benzene with OC2H5
      var x6 = 620;
      s += benzene(x6, cy, r);
      s += line(x6, cy + r, x6, cy + r + 14, GOLD, 2);
      s += text(x6, cy + r + 32, "OC₂H₅", {size: 15, color: GOLD});
      s += text(x6, cy + r + 56, "(vi) ethoxybenzene", {size: 12, color: MUTED});
      s += text(430, 400, "Exercise 7.23 · redrawn from the printed structures", {size: 12, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["7.32"] = {
    caption: "Fig. 7.32 — Exercise 7.32: the four target alcohols (i)–(iv) redrawn as skeletal structures.",
    svg: function(){
      var s = '<svg viewBox="0 0 860 430" role="img" aria-label="Target alcohols of Exercise 7.32">';
      s += '<rect width="860" height="430" fill="#09131d"/>';
      // (i) 1-methylcyclohexanol
      var r = 44, cx = 140, cy = 150;
      s += cyclo(cx, cy, r);
      s += line(cx, cy - r, cx - 26, cy - r - 34, INK, 2);
      s += text(cx - 42, cy - r - 40, "CH₃", {size: 14});
      s += line(cx, cy - r, cx + 30, cy - r - 26, BLUE, 2);
      s += text(cx + 44, cy - r - 26, "OH", {size: 14, color: BLUE});
      s += text(cx, cy + r + 30, "(i) 1-methylcyclohexanol", {size: 13, color: MUTED});
      // (ii) 4-methylheptan-4-ol (central C with two propyls + methyl + OH)
      var c = [430, 190];
      s += poly([[c[0] - 120, c[1] - 45], [c[0] - 80, c[1] - 70], [c[0] - 40, c[1] - 45], c], INK, 2);
      s += poly([c, [c[0] + 40, c[1] - 45], [c[0] + 80, c[1] - 70], [c[0] + 120, c[1] - 45]], INK, 2);
      s += line(c[0], c[1], c[0], c[1] - 42, BLUE, 2);
      s += text(c[0], c[1] - 52, "OH", {size: 14, color: BLUE});
      s += line(c[0], c[1], c[0] + 26, c[1] + 26, INK, 2);
      s += text(c[0] + 50, c[1] + 32, "CH₃", {size: 14, anchor: "start"});
      s += text(c[0], c[1] + 86, "(ii) 4-methylheptan-4-ol", {size: 13, color: MUTED});
      // (iii) pentan-2-ol
      var p3 = [[90, 330], [130, 305], [170, 330], [210, 305], [250, 330]];
      s += poly(p3, INK, 2);
      s += line(130, 305, 130, 268, BLUE, 2);
      s += text(130, 258, "OH", {size: 14, color: BLUE});
      s += text(170, 372, "(iii) pentan-2-ol", {size: 13, color: MUTED});
      // (iv) 2-cyclohexylbutan-2-ol
      var x4 = 560, y4 = 320;
      s += cyclo(x4, y4, 46);
      var a4 = [x4 + 46 * Math.cos(Math.PI / 180 * 90), y4 - 46 * Math.sin(Math.PI / 180 * 90)];
      s += line(x4 + 40, y4 - 22, x4 + 92, y4 - 48, INK, 2);
      s += line(x4 + 92, y4 - 48, x4 + 92, y4 - 10, BLUE, 2);
      s += text(x4 + 92, y4, "OH", {size: 14, color: BLUE});
      s += line(x4 + 92, y4 - 48, x4 + 118, y4 - 78, INK, 2);
      s += text(x4 + 142, y4 - 84, "CH₃", {size: 14});
      s += poly([[x4 + 92, y4 - 48], [x4 + 140, y4 - 30], [x4 + 172, y4 - 58]], INK, 2);
      s += text(x4 + 90, y4 + 84, "(iv) 2-cyclohexylbutan-2-ol", {size: 13, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["7.33"] = {
    caption: "Fig. 7.33 — Exercise 7.33: 3-methylbutan-2-ol + HBr → 2-bromo-2-methylbutane (redrawn reaction).",
    svg: function(){
      var s = '<svg viewBox="0 0 900 230" role="img" aria-label="HBr rearrangement of 3-methylbutan-2-ol">';
      s += '<rect width="900" height="230" fill="#09131d"/>';
      s += text(30, 105, "CH₃–CH(CH₃)–CH(OH)–CH₃", {anchor: "start", size: 18});
      s += line(290, 98, 370, 98, INK, 2);
      s += '<polygon points="370,98 358,92 358,104" fill="' + INK + '"/>';
      s += text(330, 80, "HBr", {size: 16, color: GOLD});
      s += text(400, 105, "(CH₃)₂CBr–CH₂–CH₃", {anchor: "start", size: 18});
      s += text(450, 180, "2° carbocation → 3° carbocation by a 1,2-hydride shift, then Br⁻ attacks", {size: 13, color: MUTED});
      return s + '</svg>';
    }
  };

  return figs;
})();
