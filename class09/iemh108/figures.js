// Textbook figures used by iemh108 exercises, redrawn as SVG.
window.FIGURES = (function(){
  var INK = "#1f2937", RED = "#e2622f";
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function carpet(x, y, s, depth){
    if(depth === 0) return '<rect x="' + x.toFixed(2) + '" y="' + y.toFixed(2) + '" width="' + s.toFixed(2) + '" height="' + s.toFixed(2) + '" fill="' + RED + '"/>';
    var out = "", t = s / 3;
    for(var i = 0; i < 3; i++) for(var j = 0; j < 3; j++) if(!(i === 1 && j === 1)) out += carpet(x + i * t, y + j * t, t, depth - 1);
    return out;
  }
  var figs = {};
  figs["8.12"] = {caption: "Fig. 8.12: Stages 0, 1, 2 and 3 of the Sierpiński square carpet (redrawn).", svg: function(){
    var b = "", s = 108;
    for(var k = 0; k < 4; k++){ var x = 16 + k * (s + 22); b += '<rect x="' + x + '" y="16" width="' + s + '" height="' + s + '" fill="#fde2d4"/>' + carpet(x, 16, s, k) + '<text x="' + (x + s / 2) + '" y="' + (s + 38) + '" font-size="13" fill="' + INK + '" text-anchor="middle">Stage ' + k + '</text>'; }
    return wrap(4 * s + 3 * 22 + 32, s + 50, b, "Four stages of the Sierpinski square carpet");
  }};
  return figs;
})();
