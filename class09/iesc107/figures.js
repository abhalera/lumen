// Textbook figures used by iesc107 exercises, redrawn as SVG from the vector graphics on PDF page 23.
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 12) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.italic ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (o.color || "#111") + '" stroke-width="' + (o.w || 1.5) + '"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + '/>'; }
  function axes(x0, y0, w, h, xl, yl){ return ln(x0, y0, x0 + w, y0) + ln(x0, y0, x0, y0 - h) + t(x0 + w / 2, y0 + 30, xl, {size: 11}) + '<text x="' + (x0 - 30) + '" y="' + (y0 - h / 2) + '" font-size="11" text-anchor="middle" transform="rotate(-90 ' + (x0 - 30) + ' ' + (y0 - h / 2) + ')">' + yl + '</text>'; }
  var figs = {};
  figs["7.37"] = {caption: "Fig. 7.37: Force–displacement graph of the force applied on the 10 kg block (redrawn).", svg: function(){
    var x0 = 60, y0 = 170, X = function(m){ return x0 + m * 55; }, Y = function(F){ return y0 - F * 2.6; };
    var b = axes(x0, y0, 250, 160, "Displacement (m)", "Force (N)") + t(x0 - 6, y0 + 14, "0", {size: 11, anchor: "end"});
    [1, 2, 3, 4].forEach(function(m){ b += t(X(m), y0 + 15, String(m), {size: 11}); });
    b += t(x0 - 6, Y(50) + 4, "50", {size: 11, anchor: "end"}) + ln(x0, Y(50), X(1), Y(50), {dash: true}) + ln(X(1), y0, X(1), Y(50), {dash: true}) + ln(X(3), y0, X(3), Y(50), {dash: true});
    b += '<polyline points="' + [[0, 0], [1, 50], [3, 50], [4, 0]].map(function(p){ return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '" fill="none" stroke="#1d74bc" stroke-width="2.5"/>';
    return wrap(330, 210, b, "Force rises from 0 to 50 newtons between 0 and 1 metre, stays at 50 newtons until 3 metres, and falls to 0 at 4 metres.");
  }};
  figs["7.38"] = {caption: "Fig. 7.38: Speed–time graph of the braking car (redrawn).", svg: function(){
    var x0 = 60, y0 = 170, X = function(s){ return x0 + s * 70; }, Y = function(v){ return y0 - v * 4; };
    var b = axes(x0, y0, 250, 160, "Time (s)", "Speed (m s⁻¹)") + t(x0 - 6, y0 + 14, "0", {size: 11, anchor: "end"});
    [1, 2, 3].forEach(function(s){ b += t(X(s), y0 + 15, String(s), {size: 11}); });
    b += t(x0 - 6, Y(35) + 4, "35", {size: 11, anchor: "end"}) + ln(X(1), y0, X(1), Y(35), {dash: true});
    b += '<polyline points="' + X(0) + ',' + Y(35) + ' ' + X(1) + ',' + Y(35) + ' ' + X(3) + ',' + Y(0) + '" fill="none" stroke="#1d74bc" stroke-width="2.5"/>';
    b += t(X(0) + 10, Y(35) - 7, "A", {size: 12}) + t(X(1) + 8, Y(35) - 7, "B", {size: 12}) + t(X(3), Y(0) - 8, "C", {size: 12});
    return wrap(330, 210, b, "Speed stays at 35 metres per second from A at 0 seconds to B at 1 second, then falls in a straight line to 0 at C at 3 seconds.");
  }};
  figs["7.39"] = {caption: "Fig. 7.39: Potential energy–displacement graph of the 0.5 kg ball on a frictionless track (redrawn).", svg: function(){
    // Page coordinates of the textbook curve (PDF points): axis at y = 595.6, 1 J = 1.9475 pt.
    var P = function(x, y){ return (70 + (x - 55.6) * 2.2).toFixed(1) + ' ' + (20 + (y - 498.2) * 2.2).toFixed(1); };
    var XY = function(x, y){ return P(x, y).split(' ').map(Number); };
    var yJ = function(J){ return 595.6 - J * 1.9475; };
    var seg = [[56.1, 540.7, 59.9, 537.0, 60.7, 537.1, 61.8, 537.4], [61.8, 537.4, 63.9, 538.2, 64.4, 541.4, 67.3, 552.3], [67.3, 552.3, 68.0, 555.1, 69.0, 559.0, 70.9, 564.3], [70.9, 564.3, 71.4, 565.6, 72.0, 567.2, 72.5, 568.4], [72.5, 568.4, 75.5, 575.2, 78.2, 582.9, 84.1, 582.9], [84.1, 582.9, 94.8, 582.9, 94.9, 558.6, 105.6, 558.6], [105.6, 558.6, 116.3, 558.6, 116.0, 574.7, 126.9, 574.8], [126.9, 574.8, 136.4, 575.0, 141.5, 554.9, 149.3, 537.2], [149.3, 537.2, 153.5, 527.6, 159.8, 518.1, 164.1, 514.3]];
    var d = "M" + P(seg[0][0], seg[0][1]);
    seg.forEach(function(s){ d += " C" + P(s[2], s[3]) + " " + P(s[4], s[5]) + " " + P(s[6], s[7]); });
    var o = XY(55.6, 595.6), end = XY(172.4, 498.2);
    var b = ln(o[0], o[1], end[0], o[1]) + ln(o[0], o[1], o[0], end[1]) + t(o[0] - 6, o[1] + 14, "0", {size: 11, anchor: "end"});
    b += t((o[0] + end[0]) / 2, o[1] + 22, "Displacement (m)", {size: 11}) + '<text x="' + (o[0] - 36) + '" y="' + ((o[1] + end[1]) / 2) + '" font-size="11" text-anchor="middle" transform="rotate(-90 ' + (o[0] - 36) + ' ' + ((o[1] + end[1]) / 2) + ')">Potential Energy (J)</text>';
    [10, 20, 30, 40].forEach(function(J){ var p = XY(55.6, yJ(J)); b += t(p[0] - 6, p[1] + 4, String(J), {size: 11, anchor: "end"}); });
    [[20, 141.5], [30, 149.2], [40, 161.0]].forEach(function(r){ var a = XY(55.9, yJ(r[0])), e = XY(r[1], yJ(r[0])); b += ln(a[0], a[1], e[0], e[1], {dash: true, w: 1}); });
    b += '<path d="' + d + '" fill="none" stroke="#1d74bc" stroke-width="2.5"/>';
    [["O", 58.0, 533.8], ["P", 144.5, 557.9], ["Q", 153.8, 539.4], ["R", 166.0, 519.3]].forEach(function(l){ var p = XY(l[1], l[2]); b += t(p[0] + 4, p[1], l[0], {size: 12}); });
    return wrap(350, 280, b, "Potential energy curve starting at O at 30 joules, dipping to two valleys, passing P at 20 joules, Q at 30 joules and rising to R at 40 joules.");
  }};
  return figs;
})();
