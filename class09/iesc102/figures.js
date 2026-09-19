// Textbook figures used by iesc102 exercises, redrawn as SVG (PDF pages 18–19).
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 14) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.italic ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
  function arrow(x1, y1, x2, y2){
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, bx = x2 - ux * 9, by = y2 - uy * 9;
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + bx + '" y2="' + by + '" stroke="#111" stroke-width="2"/><polygon points="' + x2 + ',' + y2 + ' ' + (bx - uy * 5) + ',' + (by + ux * 5) + ' ' + (bx + uy * 5) + ',' + (by - ux * 5) + '" fill="#111"/>';
  }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function chloro(cx, cy, rot){ return '<g transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"><ellipse cx="' + cx + '" cy="' + cy + '" rx="30" ry="17" fill="#6cc070" stroke="#2f7d3a" stroke-width="2"/><rect x="' + (cx - 14) + '" y="' + (cy - 8) + '" width="28" height="16" fill="none" stroke="#2f7d3a" stroke-width="1.5"/></g>'; }
  function mito(cx, cy, rot){ return '<g transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"><ellipse cx="' + cx + '" cy="' + cy + '" rx="28" ry="12" fill="#f5a15c" stroke="#c2410c" stroke-width="2"/><path d="M' + (cx - 20) + ' ' + cy + ' q5 -9 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#9a3412" stroke-width="1.5"/></g>'; }
  var figs = {};

  figs["2.20"] = {
    caption: "Fig. 2.20 — A plant cell with parts labelled (a) to (g) (redrawn).",
    svg: function(){
      var b = '<rect x="70" y="20" width="200" height="260" rx="30" fill="#f08a3e"/><rect x="78" y="28" width="184" height="244" rx="24" fill="#fdf1c7"/><rect x="82" y="32" width="176" height="236" rx="22" fill="#b8d98b"/>';
      b += chloro(115, 60, -20) + chloro(225, 90, 30) + chloro(150, 245, -15);
      b += mito(105, 120, -50) + mito(175, 205, 70);
      b += '<circle cx="160" cy="130" r="40" fill="#c96fbf" stroke="#8e3a87" stroke-width="2"/><circle cx="160" cy="130" r="14" fill="#7c2f7a"/>';
      for(var i = 0; i < 3; i++) b += '<path d="M' + (125 - i * 6) + ' ' + (88 - i * 8) + ' q35 -22 70 0" fill="none" stroke="#8e3a87" stroke-width="2.5"/>';
      b += '<path d="M95 175 q30 -25 55 0 q-25 10 -55 0 z M100 190 q25 -15 45 0" fill="#7fb8e6" stroke="#3b82c4" stroke-width="2"/>';
      b += '<path d="M200 150 q45 -20 50 20 l-3 80 q-20 20 -55 5 q-15 -40 8 -105 z" fill="#cfe6f7" stroke="#6aa6d6" stroke-width="2"/>';
      b += '<circle cx="233" cy="118" r="8" fill="#fef3c7" stroke="#d4b106" stroke-width="2"/>';
      var L = [["(a)", 30, 120, 90, 118], ["(b)", 30, 150, 125, 138], ["(c)", 30, 180, 95, 180], ["(d)", 320, 80, 250, 88], ["(e)", 320, 115, 272, 115], ["(f)", 320, 145, 262, 145], ["(g)", 320, 200, 240, 200]];
      L.forEach(function(l){ b += t(l[1], l[2] + 5, l[0], {italic: true}) + arrow(l[1] < 100 ? l[1] + 16 : l[1] - 16, l[2], l[3], l[4]); });
      return wrap(350, 300, b, "Plant cell with seven labelled parts: (a) mitochondrion, (b) nucleus, (c) Golgi apparatus, (d) chloroplast, (e) outer layer, (f) thin inner layer, (g) large vacuole.");
    }
  };

  figs["2.21"] = {
    caption: "Fig. 2.21 — Carrot (A) in plain water and (B) in salt solution (redrawn).",
    svg: function(){
      var b = "";
      [["A", 30, "#cfe7f7"], ["B", 170, "#e6eef3"]].forEach(function(c){
        var x = c[1];
        b += '<path d="M' + x + ' 30 v140 q0 12 12 12 h96 q12 0 12 -12 v-140" fill="' + c[2] + '" stroke="#9aa5b1" stroke-width="2"/><rect x="' + (x + 1) + '" y="30" width="118" height="22" fill="#fff"/>';
        b += '<path d="M' + (x + 30) + ' 160 L' + (x + 95) + ' 60 q8 -6 6 6 L' + (x + 40) + ' 166 q-10 4 -10 -6 z" fill="#f5a25a" stroke="#c46a1f" stroke-width="1.5"/>';
        b += t(x + 60, 205, c[0], {size: 15});
      });
      return wrap(320, 220, b, "Two beakers: carrot A in plain water and carrot B in concentrated salt solution.");
    }
  };

  figs["2.22"] = {
    caption: "Fig. 2.22 — Potato cups A (empty), B (sugar), C (salt) and D (boiled potato with sugar) in water (redrawn).",
    svg: function(){
      var b = "";
      [["A", 20, 20, ""], ["B", 170, 20, "Sugar"], ["C", 20, 170, "Salt"], ["D", 170, 170, "Sugar"]].forEach(function(c){
        var x = c[1], y = c[2];
        b += '<path d="M' + x + ' ' + (y + 30) + ' v90 q0 10 10 10 h100 q10 0 10 -10 v-90" fill="none" stroke="#9aa5b1" stroke-width="2"/><rect x="' + (x + 2) + '" y="' + (y + 75) + '" width="116" height="53" fill="#bfe0f5"/>';
        b += '<ellipse cx="' + (x + 60) + '" cy="' + (y + 78) + '" rx="34" ry="12" fill="' + (c[0] === "D" ? "#fff3c4" : "#f7d774") + '" stroke="#c9a227" stroke-width="2"/><ellipse cx="' + (x + 60) + '" cy="' + (y + 74) + '" rx="20" ry="5" fill="#e6c14f"/>';
        if(c[3]) b += '<line x1="' + (x + 60) + '" y1="' + (y + 8) + '" x2="' + (x + 60) + '" y2="' + (y + 70) + '" stroke="#555" stroke-width="1.5"/>' + t(x + 60, y + 4, c[3], {size: 11});
        if(c[0] === "D") b += t(x + 16, y + 48, "Boiled potato", {size: 10, anchor: "start"});
        b += t(x + 60, y + 150, c[0], {size: 14});
      });
      return wrap(320, 330, b, "Four beakers of water with potato cups: A empty, B with sugar, C with salt, D boiled potato with sugar.");
    }
  };

  return figs;
})();
