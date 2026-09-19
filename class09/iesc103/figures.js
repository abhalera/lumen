// Textbook figures used by iesc103 exercises, redrawn as SVG (PDF pages 17–19). Photographs are shown as simple drawings.
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 13) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '">' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function person(x, y, crouch){
    var col = "#2f5fb3", b = '<circle cx="' + x + '" cy="' + (y - (crouch ? 95 : 150)) + '" r="11" fill="#7a4a2b"/>';
    if(crouch){
      b += '<path d="M' + x + ' ' + (y - 84) + ' L' + (x - 8) + ' ' + (y - 40) + '" stroke="' + col + '" stroke-width="14" stroke-linecap="round"/>';
      b += '<path d="M' + (x - 8) + ' ' + (y - 40) + ' L' + (x + 26) + ' ' + (y - 30) + ' L' + (x + 14) + ' ' + y + '" fill="none" stroke="' + col + '" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>';
      b += '<path d="M' + (x + 2) + ' ' + (y - 74) + ' L' + (x + 52) + ' ' + (y - 70) + '" stroke="' + col + '" stroke-width="8" stroke-linecap="round"/>';
    } else {
      b += '<path d="M' + x + ' ' + (y - 138) + ' L' + x + ' ' + (y - 70) + '" stroke="' + col + '" stroke-width="14" stroke-linecap="round"/>';
      b += '<path d="M' + x + ' ' + (y - 70) + ' L' + x + ' ' + y + '" stroke="' + col + '" stroke-width="12" stroke-linecap="round"/>';
      b += '<path d="M' + x + ' ' + (y - 128) + ' L' + (x + 50) + ' ' + (y - 126) + '" stroke="' + col + '" stroke-width="8" stroke-linecap="round"/>';
    }
    return b + '<rect x="' + (x - 6) + '" y="' + (y - 2) + '" width="26" height="8" rx="3" fill="#cbd5e1"/>';
  }
  var figs = {};
  figs["3.21"] = {caption: "Fig. 3.21 — Knees and ankles bent (left) and straight (right) (redrawn).", svg: function(){
    return wrap(260, 200, person(70, 185, true) + person(180, 185, false), "Two figures: one crouching with knees and ankles bent, one standing with legs straight and arms forward.");
  }};
  figs["3.22"] = {caption: "Fig. 3.22 — A tree trunk debarked by an elephant (drawn from the textbook photograph).", svg: function(){
    var b = '<rect x="0" y="0" width="300" height="200" fill="#dfeccf"/><rect x="60" y="0" width="60" height="200" fill="#8b6b4a"/>';
    b += '<path d="M72 40 q10 40 0 90 q15 20 5 50 h30 q-10 -40 5 -70 q-8 -40 -2 -70 z" fill="#e8d6b6"/>';
    b += '<ellipse cx="210" cy="140" rx="70" ry="45" fill="#8d8d8d"/><circle cx="160" cy="95" r="30" fill="#8d8d8d"/><path d="M140 110 q-20 20 -30 -20" stroke="#8d8d8d" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M150 108 q-18 10 -28 2" stroke="#f5f0e1" stroke-width="5" fill="none"/>';
    b += t(95, 195, "bark stripped", {size: 11});
    return wrap(300, 200, b, "An elephant beside a tree whose bark has been stripped from part of the trunk.");
  }};
  figs["3.23"] = {caption: "Fig. 3.23 — Sugarcane cuttings: (A) a piece of internode without a node, (B) a piece with a node (redrawn).", svg: function(){
    var b = "";
    b += '<rect x="50" y="20" width="36" height="150" rx="6" fill="#9bb8a3" stroke="#56715e" stroke-width="2"/>' + t(68, 192, "(A)");
    b += '<rect x="170" y="20" width="36" height="150" rx="6" fill="#9bb8a3" stroke="#56715e" stroke-width="2"/><rect x="167" y="88" width="42" height="12" rx="4" fill="#c7b36b" stroke="#8a7a3a"/><ellipse cx="212" cy="94" rx="6" ry="9" fill="#6b8e3a"/>' + t(188, 192, "(B)");
    b += t(228, 85, "node with bud", {size: 11, anchor: "start"});
    return wrap(320, 200, b, "Two sugarcane cuttings: A is a plain internode piece; B has a node band with a bud in the middle.");
  }};
  return figs;
})();
