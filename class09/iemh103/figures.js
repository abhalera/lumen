// Textbook figure used by iemh103 exercises: Fig. 3.14, the square root spiral (PDF page 26), redrawn as SVG with 10 right triangles.
window.FIGURES = (function(){
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  var figs = {};
  figs["3.14"] = {caption: "Fig. 3.14: The square root spiral. Each triangle adds a side of length 1 at right angles to the previous hypotenuse (redrawn).", svg: function(){
    var cx = 170, cy = 175, s = 46, P = [1, 0], b = "", cols = ["#c4a5d8", "#8e4fa1", "#4bb8c9", "#79b85c", "#e7df7d", "#f2b16e", "#e46f6f", "#d7a3c8", "#9a5fb0", "#3fb3c6"];
    var X = function(p){ return (cx + p[0] * s).toFixed(1); }, Y = function(p){ return (cy - p[1] * s).toFixed(1); };
    for(var i = 0; i < 10; i++){
      var len = Math.hypot(P[0], P[1]), u = [-P[1] / len, P[0] / len], Q = [P[0] + u[0], P[1] + u[1]];
      b += '<polygon points="' + cx + ',' + cy + ' ' + X(P) + ',' + Y(P) + ' ' + X(Q) + ',' + Y(Q) + '" fill="' + cols[i] + '" stroke="#1f2937" stroke-width="1.2"/>';
      // right-angle mark at P
      var d = [-P[0] / len * 0.12, -P[1] / len * 0.12], e = [u[0] * 0.12, u[1] * 0.12];
      b += '<polyline points="' + X([P[0] + d[0], P[1] + d[1]]) + ',' + Y([P[0] + d[0], P[1] + d[1]]) + ' ' + X([P[0] + d[0] + e[0], P[1] + d[1] + e[1]]) + ',' + Y([P[0] + d[0] + e[0], P[1] + d[1] + e[1]]) + ' ' + X([P[0] + e[0], P[1] + e[1]]) + ',' + Y([P[0] + e[0], P[1] + e[1]]) + '" fill="none" stroke="#1f2937" stroke-width="1"/>';
      // label the unit side just outside its midpoint
      var mid = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], ml = Math.hypot(mid[0], mid[1]), lab = [mid[0] / ml * (ml + 0.28), mid[1] / ml * (ml + 0.28)];
      b += '<text x="' + X(lab) + '" y="' + (cy - lab[1] * s + 4).toFixed(1) + '" font-size="12" font-weight="700" fill="#1f2937" text-anchor="middle">1</text>';
      if(i === 0) b += '<text x="' + (cx + 0.5 * s).toFixed(1) + '" y="' + (cy + 16) + '" font-size="12" font-weight="700" fill="#1f2937" text-anchor="middle">1</text>';
      P = Q;
    }
    return wrap(340, 340, b, "Square root spiral made of 10 right triangles with unit outer sides");
  }};
  return figs;
})();
