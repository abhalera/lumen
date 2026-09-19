// Textbook figure used by iemh102 exercises: the growing pattern of matchstick hexagons (End-of-Chapter Q12, PDF page 23), redrawn as SVG.
window.FIGURES = (function(){
  function t(x, y, s){ return '<text x="' + x + '" y="' + y + '" font-size="12" fill="#1f2937" text-anchor="middle">' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  // Flat-topped hexagon of side r centred at (cx, cy), drawn as six matchsticks.
  function hex(cx, cy, r){
    var s = "", k, a1, a2;
    for(k = 0; k < 6; k++){
      a1 = Math.PI / 3 * k; a2 = Math.PI / 3 * (k + 1);
      var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1), x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#92400e" stroke-width="3" stroke-linecap="round"/>';
    }
    return s;
  }
  // Stage n: a zigzag chain; each new hexagon shares one side with the previous one.
  function chain(x0, y0, r, n){
    var s = "", h = r * Math.sqrt(3), x = x0, y = y0;
    for(var i = 0; i < n; i++){
      s += hex(x, y, r);
      x += 1.5 * r; y += (i % 2 === 0 ? h / 2 : -h / 2);
    }
    return s;
  }
  var figs = {};
  figs["hexagons"] = {caption: "End-of-Chapter Q12: Stages 1, 2 and 3 of the growing pattern of matchstick hexagons (redrawn).", svg: function(){
    var r = 22, b = "";
    b += chain(50, 52, r, 1) + t(50, 128, "Stage 1");
    b += chain(140, 52, r, 2) + t(157, 128, "Stage 2");
    b += chain(262, 52, r, 3) + t(295, 128, "Stage 3");
    return wrap(360, 140, b, "Stages 1 to 3 of a zigzag chain of hexagons made of matchsticks");
  }};
  return figs;
})();
