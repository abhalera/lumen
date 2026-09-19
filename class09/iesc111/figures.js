// Textbook figure used by iesc111 exercises, redrawn as SVG (PDF page 19). Bar values read from the page image: fruit set 26% and 40%, fruit drop 35% and 8%.
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 11) + '" fill="#1f2937" text-anchor="' + (o.anchor || "middle") + '">' + s + '</text>'; }
  var figs = {};
  figs["11.24"] = {caption: "Fig. 11.24: Fruit set and fruit drop of apples with natural pollination and with a bee colony (redrawn).", svg: function(){
    var x0 = 60, y0 = 230, Y = function(p){ return y0 - p * 4.8; }, b = "", NAT = "#d9502b", BEE = "#56687a";
    for(var p = 5; p <= 40; p += 5) b += '<line x1="' + x0 + '" y1="' + Y(p) + '" x2="420" y2="' + Y(p) + '" stroke="#cfe8cf" stroke-width="1"/>' + t(x0 - 8, Y(p) + 4, String(p), {anchor: "end"});
    b += '<line x1="' + x0 + '" y1="' + y0 + '" x2="420" y2="' + y0 + '" stroke="#111" stroke-width="2"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="20" stroke="#111" stroke-width="2"/>' + t(x0 - 8, y0 + 14, "0", {anchor: "end"});
    b += '<text x="18" y="130" font-size="11" text-anchor="middle" transform="rotate(-90 18 130)">Per cent</text>';
    [[110, 26, 40, "Fruit Set (%)"], [270, 35, 8, "Fruit Drop (%)"]].forEach(function(g){
      b += '<rect x="' + g[0] + '" y="' + Y(g[1]) + '" width="45" height="' + (y0 - Y(g[1])) + '" fill="' + NAT + '"/>' + '<rect x="' + (g[0] + 45) + '" y="' + Y(g[2]) + '" width="45" height="' + (y0 - Y(g[2])) + '" fill="' + BEE + '"/>';
      b += t(g[0] + 22, Y(g[1]) - 4, g[1]) + t(g[0] + 67, Y(g[2]) - 4, g[2]) + t(g[0] + 45, y0 + 16, g[3]);
    });
    b += '<rect x="250" y="26" width="10" height="10" fill="' + NAT + '"/>' + t(265, 35, "Natural Pollination", {anchor: "start"}) + '<rect x="250" y="42" width="10" height="10" fill="' + BEE + '"/>' + t(265, 51, "with Bee Colony", {anchor: "start"});
    return '<svg viewBox="0 0 440 255" role="img" aria-label="Bar chart: fruit set 26 per cent with natural pollination and 40 per cent with a bee colony; fruit drop 35 per cent and 8 per cent." xmlns="http://www.w3.org/2000/svg"><rect width="440" height="255" fill="#fff"/>' + b + '</svg>';
  }};
  return figs;
})();
