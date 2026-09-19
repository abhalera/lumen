// Textbook figures used by iemh107 exercises, redrawn as SVG.
window.FIGURES = (function(){
  var INK = "#1f2937";
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function lab(x, y, s, o){ o = o || {}; return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + (o.size || 13) + '" font-weight="' + (o.bold ? 700 : 400) + '" fill="' + (o.c || INK) + '" text-anchor="' + (o.anchor || 'middle') + '">' + s + '</text>'; }
  var figs = {};

  figs["7.5"] = {caption: "Fig. 7.5: A paper cup can land on its bottom, upside down on its top, or on its side (redrawn).", svg: function(){
    var b = "", red = "#dc2626", rim = "#fecaca";
    // bottom: narrow base down, wide rim up
    b += '<path d="M 40 60 L 110 60 L 98 130 L 52 130 Z" fill="' + red + '" stroke="' + INK + '" stroke-width="1.5"/><ellipse cx="75" cy="60" rx="35" ry="7" fill="' + rim + '" stroke="' + INK + '" stroke-width="1.5"/>';
    // top: wide rim down
    b += '<path d="M 187 60 L 233 60 L 245 130 L 175 130 Z" fill="' + red + '" stroke="' + INK + '" stroke-width="1.5"/><ellipse cx="210" cy="60" rx="23" ry="5" fill="' + red + '" stroke="' + INK + '" stroke-width="1.5"/>';
    // side: lying down, rim to the right
    b += '<path d="M 300 108 L 370 90 L 370 136 L 300 124 Z" fill="' + red + '" stroke="' + INK + '" stroke-width="1.5"/><ellipse cx="370" cy="113" rx="8" ry="23" fill="' + rim + '" stroke="' + INK + '" stroke-width="1.5"/>';
    b += '<line x1="20" y1="136" x2="410" y2="136" stroke="#92400e" stroke-width="4"/>';
    b += lab(75, 160, "bottom", {bold: true}) + lab(210, 160, "top", {bold: true}) + lab(338, 160, "side", {bold: true});
    return wrap(430, 175, b, "Three paper cups: standing on the bottom, upside down on the top, and lying on the side");
  }};

  figs["7.7"] = {caption: "Fig. 7.7: A spinner with eight equal sectors numbered 1 to 8 (redrawn).", svg: function(){
    var c = [130, 125], R = 100, cols = ["#dc2626", "#9333ea", "#4338ca", "#38bdf8", "#16a34a", "#d4c34a", "#f97316", "#7c2d12"], b = "";
    for(var i = 0; i < 8; i++){
      var a0 = (-90 + 45 * i) * Math.PI / 180, a1 = (-45 + 45 * i) * Math.PI / 180, am = (a0 + a1) / 2;
      b += '<path d="M ' + c[0] + ' ' + c[1] + ' L ' + (c[0] + R * Math.cos(a0)).toFixed(1) + ' ' + (c[1] + R * Math.sin(a0)).toFixed(1) + ' A ' + R + ' ' + R + ' 0 0 1 ' + (c[0] + R * Math.cos(a1)).toFixed(1) + ' ' + (c[1] + R * Math.sin(a1)).toFixed(1) + ' Z" fill="' + cols[i] + '" stroke="#fff" stroke-width="2"/>';
      b += lab(c[0] + 68 * Math.cos(am), c[1] + 68 * Math.sin(am) + 6, String(i + 1), {size: 18, bold: true, c: "#fff"});
    }
    b += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + R + '" fill="none" stroke="#7c2d12" stroke-width="8"/>';
    var ang = (-90 + 45 * 1.5) * Math.PI / 180;
    b += '<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + (c[0] + 52 * Math.cos(ang)).toFixed(1) + '" y2="' + (c[1] + 52 * Math.sin(ang)).toFixed(1) + '" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="10" fill="#d6b48c" stroke="' + INK + '" stroke-width="2"/>';
    return wrap(260, 250, b, "Spinner divided into eight equal coloured sectors numbered 1 to 8 with an arrow");
  }};

  figs["7.8"] = {caption: "Fig. 7.8: A drop of dye falls at random on a 3 m × 2 m rectangle containing a circle of diameter 1 m (redrawn).", svg: function(){
    var k = 90, x0 = 30, y0 = 40, b = '<rect x="' + x0 + '" y="' + y0 + '" width="' + 3 * k + '" height="' + 2 * k + '" fill="#6d6fc4" stroke="' + INK + '" stroke-width="1.5"/>';
    b += '<circle cx="' + (x0 + 1.5 * k) + '" cy="' + (y0 + k) + '" r="' + 0.5 * k + '" fill="#f5ecd7" stroke="' + INK + '" stroke-width="1.2"/>';
    b += '<line x1="' + (x0 + k) + '" y1="' + (y0 + k) + '" x2="' + (x0 + 2 * k) + '" y2="' + (y0 + k) + '" stroke="' + INK + '" stroke-width="1" stroke-dasharray="4 3"/>' + lab(x0 + 1.5 * k, y0 + k - 6, "1 m", {size: 12});
    b += '<path d="M ' + (x0 + 1.62 * k) + ' ' + (y0 + 0.62 * k) + ' q -7 12 0 16 q 7 -4 0 -16 Z" fill="#eab308" stroke="' + INK + '" stroke-width="0.8"/>';
    b += lab(x0 + 1.5 * k, y0 - 10, "3 m", {size: 13}) + lab(x0 + 3 * k + 22, y0 + k + 4, "2 m", {size: 13});
    return wrap(3 * k + 70, 2 * k + 60, b, "Rectangle 3 m by 2 m with a circle of diameter 1 m and a drop of dye");
  }};
  return figs;
})();
