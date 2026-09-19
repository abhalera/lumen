// Textbook figures used by iesc110 exercises, redrawn as SVG from the vector graphics on PDF pages 22–23.
// Measured from the PDF: Fig. 10.30 (a) 3 cycles, amplitude 20.4 pt; (b) 6 cycles in 96 pt, amplitude 26 pt. Fig. 10.31: green 4, red 3, blue 2 cycles.
// Fig. 10.32: compressions 2 grid intervals apart, arrow of 8 cm spans 4 intervals (λ = 4 cm). Fig. 10.33: A λ = 2.5 cm, B λ = 5.0 cm (curve spans 7.5 cm).
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 11) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.italic ? ' font-style="italic"' : '') + (o.bold ? ' font-weight="700"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function wave(x0, x1, mid, amp, cycles, fn, col, w){ var d = ""; for(var i = 0; i <= 240; i++){ var x = x0 + (x1 - x0) * i / 240, th = 2 * Math.PI * cycles * i / 240; d += (i ? " L" : "M") + x.toFixed(1) + " " + (mid - amp * fn(th)).toFixed(1); } return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + (w || 2.2) + '"/>'; }
  function axes(x0, y0, w, h, xl, yl){ return '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + w) + '" y2="' + y0 + '" stroke="#111" stroke-width="1.3"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + (y0 - h) + '" stroke="#111" stroke-width="1.3"/>' + t(x0 + w - 20, y0 + 14, xl) + '<text x="' + (x0 - 8) + '" y="' + (y0 - h / 2) + '" font-size="11" text-anchor="middle" transform="rotate(-90 ' + (x0 - 8) + ' ' + (y0 - h / 2) + ')">' + yl + '</text>'; }
  function dash(x0, x1, y){ return '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="#111" stroke-width="1" stroke-dasharray="4 3"/>'; }
  var BLUE = "#1475bd", GREEN = "#2b8a4d", RED = "#e02629", PINK = "#ed008c";
  var figs = {};
  figs["10.30"] = {caption: "Fig. 10.30: Density–distance graphs of two sound waves drawn to the same scales (redrawn).", svg: function(){
    var b = axes(40, 160, 250, 150, "Distance", "Density") + dash(55, 290, 95) + wave(58, 292, 95, 40, 3, Math.cos, BLUE) + t(165, 185, "(a)", {italic: true});
    b += axes(310, 160, 210, 150, "Distance", "Density") + dash(325, 520, 95) + wave(326, 518, 95, 52, 6, Math.cos, BLUE) + t(420, 185, "(b)", {italic: true});
    return wrap(540, 195, b, "Two density graphs: (a) three long waves with smaller height; (b) six short waves with greater height.");
  }};
  figs["10.31"] = {caption: "Fig. 10.31: Sound waves emitted by three sources (redrawn; colours as in the textbook).", svg: function(){
    var b = axes(40, 180, 410, 165, "Distance", "Density") + dash(45, 440, 95);
    b += wave(45, 435, 95, 55, 4, Math.sin, GREEN) + wave(45, 435, 95, 36, 3, Math.sin, RED) + wave(45, 435, 95, 17, 2, Math.sin, BLUE);
    return wrap(460, 200, b, "Three waves over the same distance: green with four cycles, red with three, blue with two.");
  }};
  figs["10.32"] = {caption: "Fig. 10.32: Variation of density of the medium for a sound wave (redrawn; dots show air particles).", svg: function(){
    var b = "", seed = 7, rnd = function(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for(var k = 0; k <= 6; k++) b += '<line x1="' + (20 + 70 * k) + '" y1="28" x2="' + (20 + 70 * k) + '" y2="104" stroke="#9ca3af" stroke-width="1"/>';
    for(var n = 0; n < 900; n++){ var x = 20 + rnd() * 420; if(rnd() < (1 + 0.8 * Math.cos(2 * Math.PI * (x - 90) / 140)) / 1.8) b += '<circle cx="' + x.toFixed(1) + '" cy="' + (32 + rnd() * 68).toFixed(1) + '" r="1.3" fill="' + BLUE + '"/>'; }
    b += '<line x1="94" y1="14" x2="366" y2="14" stroke="#111" stroke-width="1.3"/><polygon points="90,14 98,10 98,18" fill="#111"/><polygon points="370,14 362,10 362,18" fill="#111"/>' + t(230, 10, "8 cm");
    return wrap(460, 112, b, "A strip of dots crowded at three places and sparse between them; an arrow marked 8 centimetres spans from the first crowded region to the third.");
  }};
  figs["10.33"] = {caption: "Fig. 10.33: Density–distance graphs of sound waves A and B (redrawn).", svg: function(){
    var X = function(cm){ return 50 + cm * 52; }, mid = 100, b = "";
    for(var g = 0; g <= 15; g++) b += '<line x1="' + X(g / 2) + '" y1="30" x2="' + X(g / 2) + '" y2="170" stroke="#bbe3c1" stroke-width="0.8"/>';
    for(var h = 0; h <= 10; h++) b += '<line x1="50" y1="' + (30 + h * 14) + '" x2="' + X(7.5) + '" y2="' + (30 + h * 14) + '" stroke="#bbe3c1" stroke-width="0.8"/>';
    b += axes(50, 170, 405, 150, "Distance (cm)", "Density") + dash(50, X(7.5), mid);
    b += wave(X(0), X(7.5), mid, 27, 1.5, Math.sin, BLUE) + wave(X(0), X(7.5), mid, 55, 3, Math.sin, PINK);
    [[0, "0"], [2.5, "2.5"], [5, "5.0"]].forEach(function(p){ b += t(X(p[0]), 186, p[1]); });
    b += t(X(0.625) + 10, mid - 60, "A", {bold: true}) + t(X(6.25) + 8, mid - 32, "B", {bold: true});
    return wrap(470, 195, b, "On a grid, wave A completes one cycle every 2.5 centimetres and wave B one cycle every 5 centimetres; A has twice the height of B.");
  }};
  figs["10.34"] = {caption: "Fig. 10.34: Sound sources A (in air) and B (in water) facing a cliff (redrawn).", svg: function(){
    var b = '<rect x="0" y="0" width="460" height="130" fill="#dbeafe"/><rect x="0" y="130" width="460" height="80" fill="#60a5fa"/>';
    b += '<rect x="20" y="95" width="110" height="80" fill="#9ca3af"/><polygon points="360,20 460,20 460,210 350,210 340,120" fill="#65a30d"/><polygon points="350,40 380,30 372,210 350,210 344,120" fill="#4d7c0f"/>';
    b += '<rect x="130" y="82" width="12" height="14" fill="#374151"/>' + t(152, 92, "A", {bold: true, anchor: "start"}) + '<rect x="130" y="160" width="12" height="14" fill="#374151"/>' + t(152, 171, "B", {bold: true, anchor: "start"});
    b += '<line x1="150" y1="84" x2="336" y2="84" stroke="#111" stroke-width="1.2" stroke-dasharray="5 4"/><line x1="150" y1="164" x2="344" y2="164" stroke="#111" stroke-width="1.2" stroke-dasharray="5 4"/>';
    return wrap(460, 210, b, "A speaker A on a wall above the water and a speaker B under water, both facing a vertical cliff across the water.");
  }};
  return figs;
})();
