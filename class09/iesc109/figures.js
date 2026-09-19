// Textbook figure used by iesc109 exercises, redrawn as SVG (PDF page 21). Electrons per shell counted from a high-zoom render: (i) 2, 7, 8; (ii) 2, 8, 8; (iii) 2, 8, 9; (iv) 2, 8, 7.
window.FIGURES = (function(){
  function atom(cx, cy, shells, label){
    var radii = [20, 36, 48], b = '<circle cx="' + cx + '" cy="' + cy + '" r="4.5" fill="#111"/>';
    shells.forEach(function(k, s){
      var r = radii[s];
      b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#111" stroke-width="1.3"/>';
      for(var j = 0; j < k; j++){ var a = -Math.PI / 2 + 0.3 + s * 0.4 + j * 2 * Math.PI / k; b += '<circle cx="' + (cx + r * Math.cos(a)).toFixed(1) + '" cy="' + (cy + r * Math.sin(a)).toFixed(1) + '" r="3.2" fill="#1d5fa8" stroke="#0b2f5a" stroke-width="0.7"/>'; }
    });
    return b + '<text x="' + cx + '" y="' + (cy + 68) + '" font-size="12" font-style="italic" fill="#1f2937" text-anchor="middle">' + label + '</text>';
  }
  var figs = {};
  figs["9.18"] = {caption: "Fig. 9.18: Four possible electron arrangements for the chloride ion (redrawn).", svg: function(){
    var b = atom(60, 62, [2, 7, 8], "(i)") + atom(175, 62, [2, 8, 8], "(ii)") + atom(290, 62, [2, 8, 9], "(iii)") + atom(405, 62, [2, 8, 7], "(iv)");
    return '<svg viewBox="0 0 465 140" role="img" aria-label="Four atoms with three shells: (i) 2, 7 and 8 electrons; (ii) 2, 8 and 8; (iii) 2, 8 and 9; (iv) 2, 8 and 7." xmlns="http://www.w3.org/2000/svg"><rect width="465" height="140" fill="#fff"/>' + b + '</svg>';
  }};
  return figs;
})();
