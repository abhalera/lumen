// Textbook figures used by the exercises of Class 12 Physics Chapter 6
// (Electromagnetic Induction), redrawn as SVG from the vector artwork in
// books/originals/Class12-Physics-Pt1_leph106.pdf (Figures 6.15 and 6.16).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", BLUE = "#60a5fa", AMBER = "#fbbf24";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 12) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function coil(cx, cy, w, h, loops){
    var s = '<rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '" fill="#1b2a3a" stroke="' + AMBER + '" stroke-width="1.6"/>';
    var step = (w - 14) / (loops - 1);
    for(var i = 0; i < loops; i += 1){
      var x = cx - w / 2 + 7 + i * step;
      s += '<path d="M' + x + ' ' + (cy - h / 2 + 3) + ' q 7 ' + (h / 2) + ' 0 ' + (h - 6) + '" fill="none" stroke="' + AMBER + '" stroke-width="1.4"/>';
    }
    return s;
  }
  function magnet(cx, cy, w, h, sLeft){
    var hw = w / 2;
    var s = '<rect x="' + (cx - hw) + '" y="' + (cy - h / 2) + '" width="' + hw + '" height="' + h + '" rx="2" fill="' + (sLeft ? "#1d4ed8" : "#b91c1c") + '"/>' +
      '<rect x="' + cx + '" y="' + (cy - h / 2) + '" width="' + hw + '" height="' + h + '" rx="2" fill="' + (sLeft ? "#b91c1c" : "#1d4ed8") + '"/>';
    s += text(cx - hw / 2, cy + 4, sLeft ? "S" : "N", {size: 12, weight: 700, color: "#fff"});
    s += text(cx + hw / 2, cy + 4, sLeft ? "N" : "S", {size: 12, weight: 700, color: "#fff"});
    return s;
  }
  function loopWire(x1, y1, x2, y2, label, color){
    var s = '<rect x="' + x1 + '" y="' + y1 + '" width="' + (x2 - x1) + '" height="' + (y2 - y1) + '" rx="6" fill="none" stroke="' + (color || INK) + '" stroke-width="1.5"/>';
    return s;
  }

  var figs = {};

  figs["6.15"] = {
    caption: "Fig. 6.15 — Six situations for predicting the direction of the induced current (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 430" role="img" aria-label="Six panels showing magnets, coils and changing currents">';
      // (a) coil with closed loop and approaching S-pole
      s += coil(150, 60, 90, 34, 6);
      s += text(150, 24, "(a)", {size: 13, weight: 700});
      s += text(105, 88, "p", {color: MUTED}); s += text(195, 88, "q", {color: MUTED});
      s += loopWire(85, 20, 215, 78, null);
      s += text(150, 14, "r", {color: MUTED, size: 11});
      s += '<circle cx="150" cy="20" r="2.5" fill="' + INK + '"/>';
      s += magnet(270, 60, 58, 22, true);
      s += '<line x1="238" y1="60" x2="212" y2="60" stroke="' + RED + '" stroke-width="2"/>';
      s += '<polygon points="212,60 222,56 222,64" fill="' + RED + '"/>';
      // (b) two coils with a magnet moving between them
      s += coil(410, 60, 90, 34, 6);
      s += text(410, 104, "p", {color: MUTED, anchor: "start"});
      s += text(495, 104, "q", {color: MUTED, anchor: "end"});
      s += loopWire(365, 70, 455, 120, null);
      s += text(410, 132, "r", {color: MUTED});
      s += magnet(540, 52, 58, 22, true);
      s += '<line x1="575" y1="30" x2="515" y2="30" stroke="' + RED + '" stroke-width="2"/>';
      s += '<polygon points="515,30 525,26 525,34" fill="' + RED + '"/>';
      s += coil(660, 60, 78, 34, 5);
      s += text(628, 104, "x", {color: MUTED}); s += text(692, 104, "y", {color: MUTED});
      s += loopWire(620, 70, 700, 120, null);
      s += text(660, 132, "z", {color: MUTED});
      // (c) key just closed in the primary coil
      s += text(150, 180, "(c)", {size: 13, weight: 700});
      s += '<ellipse cx="150" cy="230" rx="16" ry="40" fill="none" stroke="' + BLUE + '" stroke-width="2"/>';
      s += '<ellipse cx="255" cy="230" rx="16" ry="40" fill="none" stroke="' + AMBER + '" stroke-width="2"/>';
      s += '<line x1="70" y1="230" x2="340" y2="230" stroke="' + MUTED + '" stroke-width="1.2" stroke-dasharray="5 4"/>';
      s += text(300, 210, "Common axis", {color: MUTED, size: 11});
      s += text(255, 186, "y", {color: MUTED}); s += text(255, 278, "z", {color: MUTED}); s += text(285, 234, "x", {color: MUTED});
      s += text(150, 288, "Tapping key just closed", {color: MUTED, size: 11});
      s += '<line x1="150" y1="270" x2="150" y2="300" stroke="' + INK + '" stroke-width="1.5"/>';
      s += '<line x1="138" y1="300" x2="150" y2="300" stroke="' + INK + '" stroke-width="1.5"/>';
      s += '<line x1="150" y1="300" x2="168" y2="314" stroke="' + INK + '" stroke-width="1.5"/>';
      s += '<line x1="162" y1="302" x2="166" y2="308" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<line x1="128" y1="304" x2="128" y2="310" stroke="' + INK + '" stroke-width="1.2"/>';
      s += '<line x1="133" y1="303" x2="133" y2="311" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<path d="M150 230 q 22 -8 34 -6" fill="none" stroke="' + INK + '" stroke-width="1.5"/>';
      // (d) rheostat setting being changed
      s += text(430, 180, "(d)", {size: 13, weight: 700});
      s += '<ellipse cx="430" cy="230" rx="16" ry="40" fill="none" stroke="' + BLUE + '" stroke-width="2"/>';
      s += '<ellipse cx="535" cy="230" rx="16" ry="40" fill="none" stroke="' + AMBER + '" stroke-width="2"/>';
      s += '<line x1="350" y1="230" x2="620" y2="230" stroke="' + MUTED + '" stroke-width="1.2" stroke-dasharray="5 4"/>';
      s += text(580, 210, "Common axis", {color: MUTED, size: 11});
      s += text(430, 186, "y", {color: MUTED}); s += text(430, 278, "z", {color: MUTED}); s += text(460, 234, "x", {color: MUTED});
      s += text(535, 288, "Rheostat setting being changed", {color: MUTED, size: 11});
      s += '<line x1="535" y1="270" x2="535" y2="298" stroke="' + INK + '" stroke-width="1.5"/>';
      s += '<rect x="522" y="298" width="26" height="8" fill="none" stroke="' + INK + '" stroke-width="1.4"/>';
      s += '<line x1="544" y1="306" x2="560" y2="292" stroke="' + INK + '" stroke-width="1.5"/>';
      s += '<line x1="548" y1="296" x2="558" y2="292" stroke="' + BLUE + '" stroke-width="2.4"/>';
      // (e) key just released: two adjacent solenoids
      s += text(150, 322, "(e)", {size: 13, weight: 700});
      s += coil(150, 370, 120, 36, 7);
      s += coil(300, 370, 120, 36, 7);
      s += loopWire(90, 385, 210, 424, null);
      s += text(90, 426, "Tapping key just released", {color: MUTED, size: 10, anchor: "start"});
      s += '<line x1="140" y1="400" x2="140" y2="424" stroke="' + INK + '" stroke-width="1.4"/>';
      s += '<line x1="128" y1="406" x2="128" y2="412" stroke="' + INK + '" stroke-width="1.2"/>';
      s += '<line x1="133" y1="405" x2="133" y2="413" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<line x1="160" y1="412" x2="176" y2="424" stroke="' + INK + '" stroke-width="1.4"/>';
      s += text(246, 362, "x", {color: MUTED}); s += text(354, 362, "y", {color: MUTED});
      s += loopWire(240, 385, 360, 424, null);
      s += text(300, 428, "r", {color: MUTED});
      // (f) loop with decreasing current
      s += text(540, 322, "(f)", {size: 13, weight: 700});
      s += '<ellipse cx="540" cy="380" rx="62" ry="16" fill="none" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="540" y1="330" x2="540" y2="384" stroke="' + INK + '" stroke-width="1.8"/>';
      s += '<polygon points="540,330 535,342 545,342" fill="' + INK + '"/>';
      s += '<polygon points="540,384 535,372 545,372" fill="' + INK + '"/>';
      s += text(548, 412, "Current (I) decreasing at a steady rate", {color: MUTED, size: 11, anchor: "start"});
      return s + '</svg>';
    }
  };

  figs["6.16"] = {
    caption: "Fig. 6.16 — (a) an irregular loop becoming circular; (b) a circular loop flattened into a straight wire (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 560 240" role="img" aria-label="Changing loop shapes in magnetic fields">';
      var i, j;
      // (a) field into the page
      for(i = 0; i < 9; i += 1){
        for(j = 0; j < 5; j += 1){
          var xx = 30 + i * 26, yy = 30 + j * 34;
          s += '<line x1="' + (xx - 3) + '" y1="' + (yy - 3) + '" x2="' + (xx + 3) + '" y2="' + (yy + 3) + '" stroke="' + BLUE + '" stroke-width="1.2"/>';
          s += '<line x1="' + (xx - 3) + '" y1="' + (yy + 3) + '" x2="' + (xx + 3) + '" y2="' + (yy - 3) + '" stroke="' + BLUE + '" stroke-width="1.2"/>';
        }
      }
      s += '<ellipse cx="135" cy="115" rx="78" ry="66" fill="none" stroke="' + INK + '" stroke-width="1.2" stroke-dasharray="4 4"/>';
      s += '<path d="M75 105 Q90 60 120 62 Q150 64 170 80 Q195 96 168 130 Q150 158 120 152 Q88 150 72 138 Q60 128 75 105 Z" fill="#1b2a3a" stroke="' + AMBER + '" stroke-width="2"/>';
      s += text(80, 120, "b", {color: INK, weight: 700}); s += text(138, 82, "c", {color: INK, weight: 700});
      s += text(138, 158, "a", {color: INK, weight: 700}); s += text(180, 132, "d", {color: INK, weight: 700});
      s += '<line x1="138" y1="100" x2="138" y2="78" stroke="' + INK + '" stroke-width="1.6"/><polygon points="138,78 134,88 142,88" fill="' + INK + '"/>';
      s += '<line x1="138" y1="132" x2="138" y2="156" stroke="' + INK + '" stroke-width="1.6"/><polygon points="138,156 134,146 142,146" fill="' + INK + '"/>';
      s += text(135, 226, "(a) irregular wire becoming circular", {color: MUTED, size: 11});
      // (b) field out of the page
      for(i = 0; i < 9; i += 1){
        for(j = 0; j < 5; j += 1){
          s += '<circle cx="' + (350 + i * 26) + '" cy="' + (30 + j * 34) + '" r="3" fill="none" stroke="' + AMBER + '" stroke-width="1.2"/>';
        }
      }
      s += '<circle cx="455" cy="115" r="66" fill="none" stroke="' + INK + '" stroke-width="2"/>';
      s += '<ellipse cx="455" cy="115" rx="95" ry="16" fill="none" stroke="' + INK + '" stroke-width="1.2" stroke-dasharray="4 4"/>';
      s += text(455, 68, "c", {color: INK, weight: 700}); s += text(455, 168, "a", {color: INK, weight: 700});
      s += text(388, 118, "b", {color: INK, weight: 700}); s += text(522, 118, "d", {color: INK, weight: 700});
      s += '<line x1="455" y1="48" x2="455" y2="18" stroke="' + INK + '" stroke-width="1.6"/><polygon points="455,48 451,38 459,38" fill="' + INK + '"/>';
      s += '<line x1="455" y1="182" x2="455" y2="212" stroke="' + INK + '" stroke-width="1.6"/><polygon points="455,182 451,192 459,192" fill="' + INK + '"/>';
      s += text(455, 226, "(b) circle deformed into a narrow wire", {color: MUTED, size: 11});
      return s + '</svg>';
    }
  };

  return figs;
})();
