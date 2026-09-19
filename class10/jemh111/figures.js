window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 12) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function ln(x1, y1, x2, y2, c, w){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#111") + '" stroke-width="' + (w || 1.6) + '"/>'; }
  var figs = {};
  figs["11.8"] = {caption: "Fig. 11.8: horse at a corner of a 15 m square, rope 5 m.", svg: function(){
    var b = ln(40, 40, 200, 40, "#111", 1.5) + ln(200, 40, 200, 200, "#111", 1.5) + ln(200, 200, 40, 200, "#111", 1.5) + ln(40, 200, 40, 40, "#111", 1.5);
    b += '<path d="M40 200 A50 50 0 0 1 90 150" fill="rgba(34,197,94,0.25)" stroke="#16a34a" stroke-width="1.6"/>';
    b += t(28, 214, "peg") + t(120, 188, "5 m", {size: 11, color: "#16a34a"});
    return wrap(240, 230, b, "Fig. 11.8");
  }};
  figs["11.9"] = {caption: "Fig. 11.9: brooch, diameter 35 mm, five diameters.", svg: function(){
    var b = '<circle cx="120" cy="110" r="70" fill="none" stroke="#111" stroke-width="1.6"/>';
    var i;
    for (i = 0; i < 5; i++) {
      var a = i * Math.PI / 5, x = 120 + 70 * Math.cos(a), y = 110 + 70 * Math.sin(a);
      var x2 = 120 - 70 * Math.cos(a), y2 = 110 - 70 * Math.sin(a);
      b += ln(x, y, x2, y2, "#2563eb", 1.2);
    }
    return wrap(240, 220, b, "Fig. 11.9");
  }};
  figs["11.11"] = {caption: "Fig. 11.11: table cover, six equal designs, r = 28 cm.", svg: function(){
    var b = '<circle cx="120" cy="110" r="70" fill="none" stroke="#111" stroke-width="1.6"/>';
    var i;
    for (i = 0; i < 6; i++) {
      var a = i * Math.PI / 3;
      b += ln(120, 110, 120 + 70 * Math.cos(a), 110 + 70 * Math.sin(a), "#dc2626", 1.2);
    }
    return wrap(240, 220, b, "Fig. 11.11");
  }};
  return figs;
})();
