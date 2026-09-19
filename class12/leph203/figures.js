// Textbook figures used by the exercises of leph203 (Dual Nature of Radiation
// and Matter), redrawn as SVG from the vector data in
// books/originals/Class12-Physics-Pt2_leph203.pdf.
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa", AMBER = "#f59e0b", GREEN = "#34d399", VIOLET = "#a78bfa";

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

  figs["11.2"] = {
    caption: "Fig. 11.1 — Experimental arrangement for the photoelectric effect: monochromatic light through a quartz window falls on emitter C; collector A is held at a variable potential (redrawn for Exercise 11.2).",
    svg: function(){
      var s = '<svg viewBox="0 0 400 230" role="img" aria-label="Photoelectric effect apparatus">';
      s += '<rect x="120" y="45" width="170" height="100" rx="18" fill="rgba(148,163,184,.08)" stroke="' + MUTED + '" stroke-width="2"/>';
      s += '<rect x="145" y="63" width="10" height="64" fill="' + AMBER + '" rx="3"/>';
      s += text(150, 145, "C (emitter)", {color: AMBER, size: 11});
      s += '<rect x="255" y="63" width="10" height="64" fill="' + BLUE + '" rx="3"/>';
      s += text(260, 145, "A (collector)", {color: BLUE, size: 11});
      s += line(30, 78, 122, 95, VIOLET, 2.4);
      s += '<polygon points="108,88 118,92 112,99" fill="' + VIOLET + '"/>';
      s += text(70, 66, "monochromatic light", {color: VIOLET, size: 11});
      s += text(205, 36, "evacuated quartz tube W", {color: MUTED, size: 11});
      s += line(150, 127, 150, 190, MUTED, 2);
      s += line(260, 127, 260, 190, MUTED, 2);
      s += '<rect x="185" y="175" width="40" height="26" rx="4" fill="none" stroke="' + INK + '" stroke-width="1.6"/>';
      s += text(205, 193, "V", {color: INK, size: 12});
      s += line(150, 190, 185, 190, MUTED, 2);
      s += line(225, 190, 260, 190, MUTED, 2);
      s += '<circle cx="205" cy="220" r="10" fill="none" stroke="' + INK + '" stroke-width="1.6"/>';
      s += text(205, 224, "mA", {color: INK, size: 9});
      s += text(205, 82, "e⁻", {color: GREEN, size: 14, weight: 700});
      s += '<polygon points="232,88 218,84 220,94" fill="' + GREEN + '"/>';
      s += line(222, 88, 208, 88, GREEN, 2);
      s += '</svg>';
      return s;
    }
  };

  figs["11.5"] = {
    caption: "Fig. 11.5 — Stopping potential V₀ against frequency ν: a straight line of slope h/e whose intercept on the frequency axis is the threshold ν₀ (redrawn for Exercise 11.5).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 240" role="img" aria-label="Stopping potential versus frequency graph">';
      s += line(50, 200, 340, 200, MUTED, 2);
      s += line(50, 200, 50, 30, MUTED, 2);
      s += text(330, 222, "ν →", {color: MUTED, size: 12, anchor: "end"});
      s += text(58, 24, "V₀", {color: MUTED, size: 12, anchor: "start"});
      s += line(95, 200, 320, 55, BLUE, 2.6);
      s += '<circle cx="95" cy="200" r="5" fill="' + RED + '"/>';
      s += text(95, 222, "ν₀", {color: RED, size: 12});
      s += line(95, 200, 140, 200, RED, 1.2, "4 4");
      s += line(140, 200, 140, 158, MUTED, 1.2, "4 4");
      s += line(220, 200, 220, 107, MUTED, 1.2, "4 4");
      s += text(228, 116, "(ν, V₀)", {color: MUTED, size: 11, anchor: "start"});
      s += '<circle cx="220" cy="107" r="4" fill="' + INK + '"/>';
      s += line(140, 170, 200, 170, GREEN, 1.6);
      s += line(180, 170, 180, 140, GREEN, 1.6);
      s += text(232, 62, "slope = h/e (same for every metal)", {color: GREEN, size: 11, anchor: "start"});
      s += text(190, 40, "V₀ = (h/e)ν − φ₀/e", {color: INK, size: 12});
      s += '</svg>';
      return s;
    }
  };

  figs["11.10"] = {
    caption: "Exercise 11.10 — Matter waves are far too short for everyday objects: the same relation λ = h/p gives a bullet a wavelength about 10⁻³⁵ m and a dust particle about 10⁻²⁵ m (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 400 220" role="img" aria-label="Matter waves of a bullet, a ball and a dust particle">';
      var rows = [
        ["Bullet  0.040 kg, 1000 m/s", "λ = 1.7 × 10⁻³⁵ m", 70, RED],
        ["Ball  0.060 kg, 1.0 m/s", "λ = 1.1 × 10⁻³² m", 118, AMBER],
        ["Dust  1.0 × 10⁻⁹ kg, 2.2 m/s", "λ = 3.0 × 10⁻²⁵ m", 166, BLUE]
      ];
      var r, i;
      for(r = 0; r < rows.length; r += 1){
        var row = rows[r];
        s += text(20, row[2] + 5, row[0], {color: INK, size: 11, anchor: "start"});
        s += text(20, row[2] + 20, row[1], {color: MUTED, size: 10, anchor: "start"});
        var pts = [];
        var n = r === 2 ? 60 : (r === 1 ? 120 : 180);
        for(i = 0; i <= n; i += 1){
          var x = 240 + 140 * i / n;
          var y = row[2] + 10 * Math.sin(2 * Math.PI * i / (r === 2 ? 3 : 1.2));
          pts.push(x.toFixed(1) + "," + y.toFixed(1));
        }
        s += '<polyline fill="none" stroke="' + row[3] + '" stroke-width="2" points="' + pts.join(" ") + '"/>';
      }
      s += text(200, 206, "shorter wavelength ⇒ wave nature harder to observe", {color: MUTED, size: 11});
      s += '</svg>';
      return s;
    }
  };

  figs["11.11"] = {
    caption: "Exercise 11.11 — A photon of frequency ν: its energy is hν, its momentum is h/λ, and rearranging p = hc/λ ÷ c gives exactly the de Broglie relation λ = h/p (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 400 200" role="img" aria-label="Photon energy and momentum relation">';
      s += line(40, 120, 360, 120, MUTED, 2);
      s += text(360, 140, "direction of propagation →", {color: MUTED, size: 11, anchor: "end"});
      var pts = [];
      var i;
      for(i = 0; i <= 200; i += 1){
        var x = 42 + 316 * i / 200;
        var y = 120 - 34 * Math.sin(2 * Math.PI * (x - 42) / 55);
        pts.push(x.toFixed(1) + "," + y.toFixed(1));
      }
      s += '<polyline fill="none" stroke="' + AMBER + '" stroke-width="2.4" points="' + pts.join(" ") + '"/>';
      s += text(145, 52, "E = hν = hc/λ", {color: AMBER, size: 14, weight: 700});
      s += text(145, 76, "p = E/c = h/λ", {color: GREEN, size: 14, weight: 700});
      s += text(200, 178, "combine: λ = h/p — the same relation de Broglie used for matter", {color: INK, size: 11});
      s += '</svg>';
      return s;
    }
  };

  return figs;
})();
