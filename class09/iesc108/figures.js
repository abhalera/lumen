// Textbook figure used by iesc108 exercises, redrawn as SVG (PDF page 20). Electron counts per shell read from the PDF: (a) 2, 1; (b) 2, 5; (c) 2, 8, 3; (d) 2, 7.
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 12) + '" fill="#1f2937" text-anchor="middle"' + (o.italic ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
  function atom(cx, cy, shells, label){
    var radii = [22, 36, 48], b = '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#111"/>';
    shells.forEach(function(k, s){
      var r = radii[s];
      b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#111" stroke-width="1.6"/>';
      for(var j = 0; j < k; j++){ var a = -Math.PI / 2 + (s * 0.6) + j * 2 * Math.PI / k; b += '<circle cx="' + (cx + r * Math.cos(a)).toFixed(1) + '" cy="' + (cy + r * Math.sin(a)).toFixed(1) + '" r="3.6" fill="#1d5fa8" stroke="#0b2f5a" stroke-width="0.8"/>'; }
    });
    return b + t(cx, 150, label, {italic: true});
  }
  var figs = {};
  figs["8.17"] = {caption: "Fig. 8.17: Electron arrangements of four atoms (redrawn).", svg: function(){
    var b = atom(60, 80, [2, 1], "(a)") + atom(170, 80, [2, 5], "(b)") + atom(290, 80, [2, 8, 3], "(c)") + atom(410, 80, [2, 7], "(d)");
    return '<svg viewBox="0 0 470 165" role="img" aria-label="Four atoms: (a) 2 and 1 electrons, (b) 2 and 5, (c) 2, 8 and 3, (d) 2 and 7." xmlns="http://www.w3.org/2000/svg"><rect width="470" height="165" fill="#fff"/>' + b + '</svg>';
  }};
  return figs;
})();
