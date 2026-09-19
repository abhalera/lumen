// Textbook figures used by the exercises of Class 12 Physics Chapter 7
// (Alternating Current), redrawn as SVG from the vector artwork in
// books/originals/Class12-Physics-Pt1_leph107.pdf (Figure 7.17).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", AMBER = "#fbbf24", BLUE = "#60a5fa";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 14) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  var figs = {};

  figs["7.17"] = {
    caption: "Fig. 7.17 — A series LCR circuit connected to a variable-frequency ac source (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 420 260" role="img" aria-label="Series LCR circuit with resistor, capacitor and inductor">';
      // outer rectangle
      s += '<line x1="80" y1="60" x2="340" y2="60" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="340" y1="60" x2="340" y2="200" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="80" y1="60" x2="80" y2="200" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="80" y1="200" x2="340" y2="200" stroke="' + INK + '" stroke-width="2"/>';
      // resistor R on the top wire
      var x = 130, i;
      for(i = 0; i < 6; i += 1){
        var x0 = x + i * 18;
        s += '<line x1="' + x0 + '" y1="60" x2="' + (x0 + 9) + '" y2="46" stroke="' + INK + '" stroke-width="2"/>';
        s += '<line x1="' + (x0 + 9) + '" y1="46" x2="' + (x0 + 18) + '" y2="60" stroke="' + INK + '" stroke-width="2"/>';
      }
      s += text(238, 44, "R", {color: INK, weight: 700});
      // capacitor C on the right wire
      s += '<line x1="340" y1="110" x2="326" y2="110" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="326" y1="88" x2="326" y2="132" stroke="' + INK + '" stroke-width="3"/>';
      s += '<line x1="314" y1="88" x2="314" y2="132" stroke="' + INK + '" stroke-width="3"/>';
      s += '<line x1="340" y1="110" x2="340" y2="110" stroke="' + INK + '" stroke-width="2"/>';
      s += text(296, 96, "C", {color: INK, weight: 700, anchor: "end"});
      // inductor L on the bottom wire
      for(i = 0; i < 4; i += 1){
        var lx = 160 + i * 30;
        s += '<path d="M' + lx + ' 200 a 15 12 0 0 1 30 0" fill="none" stroke="' + INK + '" stroke-width="2.4"/>';
      }
      s += text(220, 228, "L", {color: INK, weight: 700});
      // ac source on the left wire
      s += '<circle cx="80" cy="130" r="26" fill="none" stroke="' + AMBER + '" stroke-width="2.2"/>';
      s += '<path d="M67 130 q 7 -18 13 0 q 7 18 13 0" fill="none" stroke="' + AMBER + '" stroke-width="2.2"/>';
      s += text(42, 124, "ε", {color: AMBER, size: 18, weight: 700});
      s += text(42, 148, "230 V", {color: MUTED, size: 12});
      s += text(210, 252, "variable frequency", {color: MUTED, size: 12});
      return s + '</svg>';
    }
  };

  return figs;
})();
