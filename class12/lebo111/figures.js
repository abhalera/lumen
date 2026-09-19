// Textbook figures cited by the lebo111 exercises, redrawn as SVG.
// Figure 11.1 (age pyramids, PDF p. 4) and Figure 11.3 (growth curves, PDF p. 7).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", OK = "#34d399", RED = "#f87171", BLUE = "#38bdf8";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function line(x1, y1, x2, y2, color, w, dash){
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="' + (w || 1.5) + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
  }
  function rect(x, y, w, h, fill, extra){
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"' + (extra || '') + '/>';
  }

  var figs = {};

  figs["11.1"] = {
    caption: "Figure 11.1 \u2014 age pyramids for the human population: (a) expanding (55% young), (b) stable (35% young), (c) declining (22% young), redrawn.",
    svg: function(){
      var s = '<svg viewBox="0 0 720 300" role="img" aria-label="Three age pyramids: expanding, stable and declining">';
      s += rect(0, 0, 720, 300, "#09131d");
      var sets = [
        {x: 130, title: "(a) expanding", rows: [55, 32, 13]},
        {x: 360, title: "(b) stable", rows: [35, 38, 27]},
        {x: 590, title: "(c) declining", rows: [22, 38, 40]}
      ];
      var cols = [BLUE, "#f59e0b", MUTED];
      for(var k = 0; k < sets.length; k++){
        var d = sets[k];
        s += text(d.x, 30, d.title, {size: 13, color: INK, weight: 700});
        s += line(d.x, 46, d.x, 214, "#475569", 1.5);
        for(var i = 0; i < 3; i++){
          var y = 54 + i * 54;
          var w = Math.max(10, d.rows[i] / 60 * 62);
          s += rect(d.x - w, y, 2 * w, 40, cols[i], ' opacity="0.85"');
          s += text(d.x, y + 25, d.rows[i] + "%", {size: 11, color: "#08131d", weight: 700});
        }
        s += text(d.x, 238, k === 0 ? "many young" : (k === 1 ? "even sides" : "few young"), {size: 11, color: MUTED});
      }
      var y0 = 258;
      s += text(360, y0, "young / reproductive / old per cent of the population \u2014 shape diagnoses growth status", {size: 11, color: MUTED});
      s += text(360, 284, "Birth rate 8/20 = 0.4 per lotus per year; death rate 4/40 = 0.1 per fruitfly per week (Section 11.1.1)", {size: 11, color: "#64748b"});
      return s + '</svg>';
    }
  };

  figs["11.3"] = {
    caption: "Figure 11.3 \u2014 population growth curves: (a) exponential J-curve (dN/dt = rN; Norway rat r = 0.015, flour beetle r = 0.12, India 1981 r = 0.0205) and (b) logistic sigmoid with carrying capacity K, redrawn.",
    svg: function(){
      var s = '<svg viewBox="0 0 720 300" role="img" aria-label="Exponential J-curve and logistic sigmoid">';
      s += rect(0, 0, 720, 300, "#09131d");
      // panel a: exponential
      var ax = 70, ay = 240, aw = 250, ah = 180;
      s += text(60, 44, "(a) exponential: dN/dt = rN", {size: 12, color: INK, anchor: "start"});
      s += line(ax, ay, ax + aw, ay, MUTED, 1.5);
      s += line(ax, ay, ax, ay - ah, MUTED, 1.5);
      s += text(ax + aw, ay + 20, "time", {size: 11, color: MUTED});
      s += text(ax - 6, ay - ah - 8, "N", {size: 11, color: MUTED, anchor: "start"});
      var curves = [
        {r: 0.12, color: RED, t: 10},
        {r: 0.231, color: OK, t: 9}
      ];
      for(var c = 0; c < curves.length; c++){
        var cv = curves[c], pts = "";
        for(var i = 0; i <= 60; i++){
          var tt = cv.t * i / 60;
          var v = Math.exp(cv.r * tt);
          var px = ax + tt / 10 * aw;
          var py = ay - (v - 1) / (Math.exp(cv.r * 10) - 1) * (ah - 20);
          pts += (i === 0 ? "M" : "L") + px.toFixed(1) + " " + py.toFixed(1) + " ";
        }
        s += '<path d="' + pts + '" fill="none" stroke="' + cv.color + '" stroke-width="2.5"/>';
      }
      s += text(160, 110, "J-shaped", {size: 12, color: OK});
      // panel b: logistic
      var bx = 420, by = 240, bw = 250, bh = 180, K = 200;
      s += text(410, 44, "(b) logistic: dN/dt = rN(K \u2212 N)/K", {size: 12, color: INK, anchor: "start"});
      s += line(bx, by, bx + bw, by, MUTED, 1.5);
      s += line(bx, by, bx, by - bh, MUTED, 1.5);
      s += text(bx + bw, by + 20, "time", {size: 11, color: MUTED});
      s += text(bx - 6, by - bh - 8, "N", {size: 11, color: MUTED, anchor: "start"});
      s += line(bx, by - (K / 220) * (bh - 20) - 20, bx + bw, by - (K / 220) * (bh - 20) - 20, RED, 1.5, "6 4");
      s += text(bx + bw - 6, by - (K / 220) * (bh - 20) - 26, "K = 200", {size: 12, color: RED});
      var lpts = "";
      for(var j = 0; j <= 80; j++){
        var lt = 30 * j / 80;
        var n = K / (1 + ((K - 10) / 10) * Math.exp(-0.2 * lt));
        lpts += (j === 0 ? "M" : "L") + (bx + lt / 30 * bw).toFixed(1) + " " + (by - n / 220 * (bh - 20) - 20).toFixed(1) + " ";
      }
      s += '<path d="' + lpts + '" fill="none" stroke="' + OK + '" stroke-width="2.5"/>';
      s += text(bx + 60, by - 40, "lag \u2192 acceleration", {size: 10, color: MUTED});
      s += text(bx + 170, by - 110, "deceleration", {size: 10, color: MUTED});
      s += text(bx + 190, by - 152, "asymptote", {size: 10, color: RED});
      s += text(360, 284, "Exercise 8: label lag, acceleration, deceleration and the asymptote at N = K; growth is fastest near K/2 = 100.", {size: 11, color: "#64748b"});
      return s + '</svg>';
    }
  };

  return figs;
})();
