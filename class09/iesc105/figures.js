// Textbook figures used by iesc105 exercises, redrawn as SVG (PDF pages 21–22).
window.FIGURES = (function(){
  function t(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 13) + '" fill="' + (o.color || "#1f2937") + '" text-anchor="' + (o.anchor || "middle") + '"' + (o.italic ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
  function wrap(w, h, body, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg>'; }
  function burner(x, y){ return '<rect x="' + (x - 6) + '" y="' + (y - 30) + '" width="12" height="30" fill="#475569"/><path d="M' + x + ' ' + (y - 30) + ' q-7 -10 0 -20 q7 10 0 20 z" fill="#38bdf8"/><rect x="' + (x - 20) + '" y="' + y + '" width="40" height="6" fill="#334155"/>'; }
  function tripod(x, y){ return '<line x1="' + (x - 35) + '" y1="' + y + '" x2="' + (x + 35) + '" y2="' + y + '" stroke="#334155" stroke-width="4"/><line x1="' + (x - 30) + '" y1="' + y + '" x2="' + (x - 38) + '" y2="' + (y + 55) + '" stroke="#334155" stroke-width="3"/><line x1="' + (x + 30) + '" y1="' + y + '" x2="' + (x + 38) + '" y2="' + (y + 55) + '" stroke="#334155" stroke-width="3"/>'; }
  var figs = {};
  figs["5.25"] = {caption: "Fig. 5.25 — (a) Mixture of sand, salt and naphthalene; (b) steps 1, 2 and 3 used to separate it (redrawn).", svg: function(){
    var b = '<path d="M20 60 q60 70 120 0 z" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/><ellipse cx="80" cy="72" rx="42" ry="10" fill="#6b7280"/>' + t(80, 130, "(a) mixture", {italic: true});
    // step 1: inverted funnel over china dish on tripod
    b += tripod(220, 90) + burner(220, 145) + '<path d="M190 90 q30 22 60 0 z" fill="#e5e7eb" stroke="#9ca3af"/><path d="M195 86 L220 50 L245 86 z" fill="none" stroke="#64748b" stroke-width="2"/><line x1="220" y1="50" x2="220" y2="25" stroke="#64748b" stroke-width="3"/><circle cx="220" cy="24" r="4" fill="#f1f5f9" stroke="#94a3b8"/>' + t(220, 175, "1");
    // step 2: china dish with liquid on tripod
    b += tripod(330, 90) + burner(330, 145) + '<path d="M300 90 q30 22 60 0 z" fill="#e5e7eb" stroke="#9ca3af"/><ellipse cx="330" cy="92" rx="24" ry="5" fill="#93c5fd"/>' + t(330, 175, "2");
    // step 3: filtration
    b += '<line x1="410" y1="20" x2="410" y2="150" stroke="#334155" stroke-width="3"/><line x1="410" y1="70" x2="445" y2="70" stroke="#334155" stroke-width="3"/><path d="M430 60 L460 60 L447 85 L447 105 L443 105 L443 85 z" fill="#f1f5f9" stroke="#64748b"/><rect x="430" y="110" width="30" height="40" fill="#dbeafe" stroke="#64748b"/><path d="M470 25 l-15 25" stroke="#64748b" stroke-width="6"/>' + t(440, 175, "3");
    b += t(330, 195, "(b) steps", {italic: true});
    return wrap(490, 205, b, "Mixture in a dish; step 1 heating under an inverted funnel; step 2 heating a solution in a china dish; step 3 filtering through a funnel into a beaker.");
  }};
  figs["5.26"] = {caption: "Fig. 5.26 — Separation technique ‘S’ with apparatus A, B and C (redrawn).", svg: function(){
    var b = tripod(90, 130) + burner(90, 190) + '<circle cx="90" cy="110" r="28" fill="#dbeafe" stroke="#64748b" stroke-width="2"/><rect x="84" y="50" width="12" height="40" fill="#f1f5f9" stroke="#64748b"/><line x1="90" y1="20" x2="90" y2="100" stroke="#ef4444" stroke-width="2"/>';
    b += '<line x1="96" y1="70" x2="300" y2="140" stroke="#64748b" stroke-width="5"/><line x1="140" y1="75" x2="280" y2="123" stroke="#94a3b8" stroke-width="14" stroke-opacity="0.5"/>';
    b += '<path d="M300 140 L306 175" stroke="#64748b" stroke-width="4"/><path d="M290 175 L322 175 L335 215 L277 215 z" fill="#eef2ff" stroke="#64748b" stroke-width="2"/>';
    b += t(30, 115, "A", {italic: true}) + '<line x1="38" y1="111" x2="60" y2="111" stroke="#111"/>' + t(250, 70, "B", {italic: true}) + '<line x1="245" y1="76" x2="225" y2="102" stroke="#111"/>' + t(365, 200, "C", {italic: true}) + '<line x1="358" y1="196" x2="330" y2="196" stroke="#111"/>';
    b += t(190, 238, "S ……………", {size: 12});
    return wrap(390, 245, b, "Heated flask with a thermometer (A) connected to a sloping water-cooled tube (B) leading to a collecting flask (C).");
  }};
  return figs;
})();
