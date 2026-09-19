// Textbook figures used by iesc106 exercises, redrawn as SVG (PDF pages 19–21). Photographs are shown as simple drawings.
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 13) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.italic ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
  function arrow(x1, y1, x2, y2, col){ var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, bx = x2 - ux * 9, by = y2 - uy * 9; col = col || "#111"; return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + bx + '" y2="' + by + '" stroke="' + col + '" stroke-width="2"/><polygon points="' + x2 + ',' + y2 + ' ' + (bx - uy * 5) + ',' + (by + ux * 5) + ' ' + (bx + uy * 5) + ',' + (by - ux * 5) + '" fill="' + col + '"/>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function axes(x0, y0, w, h, xl, yl){ return '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + w) + '" y2="' + y0 + '" stroke="#111" stroke-width="1.5"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + (y0 - h) + '" stroke="#111" stroke-width="1.5"/>' + t(x0 + w / 2, y0 + 18, xl, {size: 11}) + '<text x="' + (x0 - 10) + '" y="' + (y0 - h / 2) + '" font-size="11" text-anchor="middle" transform="rotate(-90 ' + (x0 - 10) + ' ' + (y0 - h / 2) + ')">' + yl + '</text>'; }
  var figs = {};
  figs["6.36"] = {caption: "Fig. 6.36 — (a) Block P with forces of 5 N and 4 N in opposite directions; (b) block Q (redrawn).", svg: function(){
    var b = '<line x1="60" y1="80" x2="220" y2="80" stroke="#111" stroke-width="2"/><rect x="110" y="40" width="50" height="40" fill="#fff" stroke="#111" stroke-width="2"/>' + t(135, 66, "P") + arrow(60, 60, 108, 60) + t(48, 64, "5 N", {anchor: "end"}) + arrow(210, 60, 162, 60) + t(222, 64, "4 N", {anchor: "start"}) + t(140, 105, "(a)", {italic: true});
    b += '<line x1="280" y1="80" x2="380" y2="80" stroke="#111" stroke-width="2"/><rect x="305" y="40" width="50" height="40" fill="#fff" stroke="#111" stroke-width="2"/>' + t(330, 66, "Q") + t(330, 105, "(b)", {italic: true});
    return wrap(400, 120, b, "Block P pushed right with 5 newtons and left with 4 newtons; block Q with no forces shown.");
  }};
  figs["6.37"] = {caption: "Fig. 6.37 — Position–time graphs of objects A, B, C and D (redrawn).", svg: function(){
    var b = "", names = ["Object A", "Object B", "Object C", "Object D"];
    [function(x0, y0){ return '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + 70) + '" y2="' + (y0 - 70) + '" stroke="#1d74bc" stroke-width="2.5"/>'; },
     function(x0, y0){ return '<line x1="' + x0 + '" y1="' + (y0 - 45) + '" x2="' + (x0 + 70) + '" y2="' + (y0 - 45) + '" stroke="#1d74bc" stroke-width="2.5"/>'; },
     function(x0, y0){ return '<path d="M' + x0 + ' ' + y0 + ' Q' + (x0 + 55) + ' ' + y0 + ' ' + (x0 + 70) + ' ' + (y0 - 75) + '" fill="none" stroke="#1d74bc" stroke-width="2.5"/>'; },
     function(x0, y0){ return '<line x1="' + x0 + '" y1="' + (y0 - 70) + '" x2="' + (x0 + 70) + '" y2="' + y0 + '" stroke="#1d74bc" stroke-width="2.5"/>'; }].forEach(function(f, i){
      var x0 = 30 + i * 110, y0 = 100;
      b += axes(x0, y0, 80, 85, "Time", "Position") + f(x0, y0) + t(x0 + 40, 135, names[i], {italic: true, size: 12});
    });
    return wrap(460, 145, b, "Four position-time graphs: A straight rising line, B horizontal line, C upward curve getting steeper, D straight falling line.");
  }};
  figs["6.38"] = {caption: "Fig. 6.38 — A sailor jumping forward from a small boat to the shore (drawn from the textbook photograph).", svg: function(){
    var b = '<rect x="0" y="120" width="360" height="60" fill="#bfdbfe"/><rect x="0" y="80" width="110" height="100" fill="#c2410c"/><path d="M190 125 q70 20 150 -5 l-10 22 q-60 18 -130 0 z" fill="#7c5a3a"/>';
    b += '<circle cx="160" cy="45" r="9" fill="#7a4a2b"/><path d="M160 54 L150 85 M150 85 L120 100 M150 85 L185 110 M158 62 L125 60 M158 62 L190 55" stroke="#b91c1c" stroke-width="5" stroke-linecap="round"/>';
    b += arrow(170, 150, 120, 150, "#1d4ed8") + t(145, 170, "?", {size: 12});
    return wrap(360, 180, b, "A sailor leaping from a small wooden boat towards a brick shore.");
  }};
  figs["6.39"] = {caption: "Fig. 6.39 — A landing mat for a high jump event (drawn from the textbook photograph).", svg: function(){
    var b = '<rect x="0" y="0" width="360" height="190" fill="#f8fafc"/><line x1="20" y1="45" x2="320" y2="40" stroke="#7c5a3a" stroke-width="4"/><line x1="320" y1="0" x2="320" y2="190" stroke="#94a3b8" stroke-width="6"/>';
    b += '<path d="M120 50 q40 -30 90 -8" stroke="#dc2626" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="118" cy="55" r="8" fill="#7a4a2b"/>';
    b += '<rect x="20" y="110" width="300" height="60" rx="8" fill="#16a34a"/><rect x="20" y="104" width="300" height="12" rx="4" fill="#bbf7d0"/>' + t(170, 150, "landing mat", {size: 13, color: "#fff"});
    return wrap(360, 190, b, "A high jumper clearing the bar above a thick green landing mat.");
  }};
  figs["6.40"] = {caption: "Fig. 6.40 — Acceleration–mass graph for a force acting on objects of different masses (redrawn).", svg: function(){
    var x0 = 50, y0 = 170, X = function(m){ return x0 + m * 45; }, Y = function(a){ return y0 - a * 14; };
    var b = axes(x0, y0, 250, 160, "Mass (kg)", "Acceleration (m s⁻²)");
    [1, 2, 3, 4, 5].forEach(function(m){ b += t(X(m), y0 + 14, String(m), {size: 11}); });
    [2.5, 5, 7.5, 10].forEach(function(a){ b += t(x0 - 6, Y(a) + 4, a.toFixed(1), {size: 11, anchor: "end"}); });
    var d = ""; for(var m = 1; m <= 5.001; m += 0.1) d += (m === 1 ? "M" : " L") + X(m) + " " + Y(10 / m);
    b += '<path d="' + d + '" fill="none" stroke="#1d74bc" stroke-width="2.5"/>' + '<line x1="' + x0 + '" y1="' + Y(2) + '" x2="' + X(5) + '" y2="' + Y(2) + '" stroke="#111" stroke-dasharray="5 4"/>';
    [[1, 10], [2, 5], [5, 2]].forEach(function(p){ b += '<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="3" fill="#111"/>'; });
    return wrap(320, 200, b, "Curve of acceleration against mass: 10 at 1 kilogram, 5 at 2 kilograms, 2 at 5 kilograms.");
  }};
  figs["6.41"] = {caption: "Fig. 6.41 — Velocity–time graph of a 10 kg object (redrawn).", svg: function(){
    var x0 = 50, y0 = 170, X = function(s){ return x0 + s * 25; }, Y = function(v){ return y0 - v * 5; };
    var b = axes(x0, y0, 240, 160, "Time (s)", "Velocity (m s⁻¹)");
    [4, 8].forEach(function(s){ b += t(X(s), y0 + 14, String(s), {size: 11}) + '<line x1="' + X(s) + '" y1="' + y0 + '" x2="' + X(s) + '" y2="' + Y(s === 4 ? 20 : 30) + '" stroke="#111" stroke-dasharray="4 4"/>'; });
    [10, 20, 30].forEach(function(v){ b += t(x0 - 6, Y(v) + 4, String(v), {size: 11, anchor: "end"}); });
    b += '<line x1="' + x0 + '" y1="' + Y(20) + '" x2="' + X(4) + '" y2="' + Y(20) + '" stroke="#111" stroke-dasharray="4 4"/><line x1="' + x0 + '" y1="' + Y(30) + '" x2="' + X(8) + '" y2="' + Y(30) + '" stroke="#111" stroke-dasharray="4 4"/>';
    b += '<line x1="' + X(0) + '" y1="' + Y(10) + '" x2="' + X(8) + '" y2="' + Y(30) + '" stroke="#1d74bc" stroke-width="2.5"/>';
    return wrap(320, 200, b, "Straight line velocity-time graph from 10 metres per second at 0 seconds to 30 at 8 seconds, passing 20 at 4 seconds.");
  }};
  figs["6.42"] = {caption: "Fig. 6.42 — A bar magnet held near a magnetic compass (redrawn).", svg: function(){
    var b = '<rect x="95" y="10" width="22" height="90" fill="#b91c1c"/>' + t(106, 26, "N", {size: 12, color: "#fff"}) + t(106, 94, "S", {size: 12, color: "#fff"});
    b += '<circle cx="106" cy="170" r="55" fill="#f8fafc" stroke="#475569" stroke-width="4"/><path d="M106 125 L114 170 L106 215 L98 170 z" fill="#dc2626"/><path d="M106 170 L114 170 L106 215 L98 170 z" fill="#e5e7eb"/><circle cx="106" cy="170" r="4" fill="#111"/>';
    return wrap(212, 235, b, "A red bar magnet above a round magnetic compass whose needle points towards it.");
  }};
  return figs;
})();
