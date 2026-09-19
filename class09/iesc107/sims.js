// iesc107 labs: Work, Energy, and Simple Machines. g = 10 m s⁻² throughout, as in the textbook's examples.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function fmt7(v, d){ var s = Math.abs(v).toFixed(d === undefined ? 0 : d); return (v < 0 && Number(s) !== 0 ? "−" : "") + s; }
function clamp7(x, a, b){ return Math.max(a, Math.min(b, x)); }
function bars7(L, rows, x, y, w){
  var m = "";
  rows.forEach(function(r, i){
    var yy = y + i * 34, f = r[2] > 0 ? clamp7(r[1] / r[2], 0, 1) : 0;
    m += L.text(x, yy + 15, r[0], {size: 12, color: L.C.muted, anchor: "start"}) + L.rect(x + 110, yy, w, 20, "#1e293b", ' rx="4"') + L.rect(x + 110, yy, Math.max(0, w * f), 20, r[3], ' rx="4"') + L.text(x + 118 + w, yy + 15, r[4], {size: 12, color: r[3], anchor: "start", weight: 700});
  });
  return m;
}
function person7(L, x, y, col){
  col = col || "#e2e8f0";
  return L.circle(x, y - 62, 8, col) + L.line(x, y - 54, x, y - 25, col, 3) + L.line(x, y - 25, x - 9, y, col, 3) + L.line(x, y - 25, x + 9, y, col, 3);
}

// Lab 1 — Work: Fig. 7.2 bags, Fig. 7.4 area, zero work, Example 7.2
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "bags"};
  function select(id){
    st.preset = id; L.markPreset(id);
    var cfg = {bags: [4, 0.1, 1], graph: [1, 0.05, 0.5], zero: [2, 0.1, 1], goalie: [1, 0.05, 0.5]}[id];
    L.timeline({maxT: cfg[0], step: cfg[1], speed: cfg[2]});
    L.legend(id === "graph" ? [[C.vel, "force"], [C.area, "area = work done"]] : id === "goalie" ? [[C.danger, "force on the ball"], [C.path, "displacement of the ball"]] : id === "zero" ? [[C.vel, "force"], [C.path, "displacement"]] : [[C.path, "work done"]]);
    L.watch({bags: "Fig. 7.2: one 5 kg bag lifted 1 m, three bags one by one, three bags together, and one bag lifted 3 m (taking g = 10 m s⁻², so mg = 50 N).", graph: "Fig. 7.4: a constant 10 N force while the object moves 1 m. The shaded area grows as the object moves.", zero: "Figs. 7.5–7.6: pushing a rigid wall, and carrying a box while walking (illustrative distance).", goalie: "Example 7.2: the goalkeeper's hands move back 15 cm while she stops the ball with 200 N (motion exaggerated)."}[id]);
    L.controls(""); L.restart(true);
  }
  function bag(x, y){ return L.rect(x - 16, y - 24, 32, 24, "#a16207", ' rx="5"') + L.text(x, y - 8, "5 kg", {size: 10, color: "#fff"}); }
  function draw(t){
    var m = "", msg;
    if(st.preset === "bags"){
      var G = 240, PX = 55, W1 = 50, works = [];
      [0, 1, 2, 3].forEach(function(k){ m += L.line(44, G - k * PX, 700, G - k * PX, k ? C.grid : C.faint, k ? 1 : 2) + L.text(38, G - k * PX + 4, k + " m", {size: 11, color: C.muted, anchor: "end"}); });
      [["(a) 1 bag, 1 m", 110], ["(b) 3 bags one by one", 275], ["(c) 3 bags together", 445], ["(d) 1 bag, 3 m", 610]].forEach(function(c, k){
        var f = clamp7(t - k, 0, 1), x = c[1], w = 0;
        if(k === 0){ m += bag(x, G - f * PX); w = W1 * f; }
        else if(k === 1){ for(var i = 0; i < 3; i++){ var fi = clamp7(3 * f - i, 0, 1); m += bag(x - 40 + i * 40, G - fi * PX); w += W1 * fi; } }
        else if(k === 2){ for(var j = 0; j < 3; j++) m += bag(x, G - f * PX - j * 24); w = 3 * W1 * f; }
        else { m += bag(x, G - 3 * f * PX); w = 3 * W1 * f; }
        works.push(w);
        m += L.text(x, G + 22, c[0], {size: 12, color: C.text}) + L.text(x, G + 42, "W = " + fmt7(w) + " J", {size: 13, color: C.path, weight: 700, mono: true});
      });
      L.svg(m, "Lifting bags", 300);
      L.readout([["Force for one bag", "mg = 5 × 10 = 50 N"], ["(a)", fmt7(works[0]) + " J", C.path], ["(b)", fmt7(works[1]) + " J", C.path], ["(c)", fmt7(works[2]) + " J", C.path], ["(d)", fmt7(works[3]) + " J", C.path]]);
      msg = t < 4 ? "Lifting…" : "<b>Fig. 7.2:</b> one bag through 1 m needs W = 50 N × 1 m = 50 J. Cases (b), (c) and (d) each need <b>3W = 150 J</b>: 3 times the force over the same distance, or the same force over 3 times the distance.";
    } else if(st.preset === "graph"){
      var s = clamp7(t, 0, 1);
      var g = L.graph({x0: 80, y0: 250, w: 560, h: 190, tmax: 1, vmin: 0, vmax: 12, tStep: 0.2, vStep: 2, tLabel: "Displacement (m)", vLabel: "Force (N)", tFmt: function(v){ return L.num(v, 1); }, vFmt: function(v){ return L.num(v, 0); }});
      m += g.svg + '<polygon points="' + g.X(0) + ',' + g.Y(0) + ' ' + g.X(0) + ',' + g.Y(10) + ' ' + g.X(s) + ',' + g.Y(10) + ' ' + g.X(s) + ',' + g.Y(0) + '" fill="' + C.area + '" opacity="0.45"/>' + L.polyline(g, [[0, 10], [1, 10]], C.vel, 4);
      if(s > 0.25) m += L.text((g.X(0) + g.X(s)) / 2, g.Y(5), "W = " + L.num(10 * s, 1) + " J", {size: 16, color: C.text, weight: 700});
      L.svg(m, "Force-displacement graph", 290);
      L.readout([["Displacement", L.num(s, 2) + " m", C.path], ["Force", "10 N", C.vel], ["Work = area", L.num(10 * s, 1) + " J", C.area]]);
      msg = t < 1 ? "Moving…" : "<b>Fig. 7.4:</b> work = area of the shaded rectangle = 10 N × 1 m = <b>10 J</b>.";
    } else if(st.preset === "zero"){
      var f = clamp7(t / 2, 0, 1), x = 400 + 180 * f;
      m += L.line(20, 250, 700, 250, C.faint, 2) + L.rect(250, 70, 40, 180, "#78716c") + person7(L, 205, 250) + L.line(205, 205, 248, 200, "#e2e8f0", 3);
      m += L.arrow(170, 150, 246, 150, C.vel, 4) + L.text(200, 138, "push", {size: 12, color: C.vel});
      m += person7(L, x, 250) + L.rect(x + 8, 176, 36, 28, "#a16207", ' rx="3"') + L.arrow(x + 26, 172, x + 26, 120, C.vel, 4) + L.text(x + 34, 124, "force (up)", {size: 12, color: C.vel, anchor: "start"});
      m += L.arrow(400, 90, 400 + Math.max(14, 180 * f), 90, C.path, 4) + L.text(410, 76, "displacement", {size: 12, color: C.path, anchor: "start"});
      m += L.text(190, 282, "Wall: F > 0 but s = 0, so W = 0", {size: 13, color: C.text}) + L.text(500, 282, "Box: force ⟂ displacement, so W = 0", {size: 13, color: C.text});
      L.svg(m, "Zero work examples", 300);
      L.readout([["Work done on the wall", "0 J", C.ok], ["Work by the upward force on the box", "0 J", C.ok], ["Box displaced", L.num(10 * f, 1) + " m", C.path]]);
      msg = t < 2 ? "Pushing and walking…" : "<b>Zero work</b> in both cases: the wall does not move (Fig. 7.5), and the upward force on the box is perpendicular to its displacement (Fig. 7.6).";
    } else {
      var sg = t < 0.5 ? 0 : 0.15 * (1 - Math.pow(1 - (t - 0.5) / 0.5, 2)), hx = 400 - sg * 1000, bx = t < 0.5 ? 700 - 300 * (t / 0.5) : hx;
      m += L.line(20, 250, 700, 250, C.faint, 2) + person7(L, hx - 60, 250) + L.line(hx - 60, 205, hx - 14, 190, "#e2e8f0", 3) + L.circle(bx, 190, 13, "#f8fafc");
      if(t >= 0.5) m += L.arrow(hx + 20, 150, hx + 80, 150, C.danger, 4) + L.text(hx + 50, 138, "200 N", {size: 13, color: C.danger}) + L.arrow(400, 100, 400 - Math.max(14, sg * 1000), 100, C.path, 4) + L.text(410, 104, "s = −" + L.num(sg, 2) + " m", {size: 13, color: C.path, anchor: "start"});
      m += L.text(360, 285, "W = F × s = 200 N × (−" + L.num(sg, 2) + " m) = " + fmt7(-200 * sg, 1) + " J", {size: 14, color: C.text, weight: 700});
      L.svg(m, "Goalkeeper stopping a ball", 300);
      L.readout([["Force on the ball", "200 N, opposite to its motion", C.danger], ["Displacement along the force", (sg > 0 ? "−" : "") + L.num(sg, 2) + " m", C.path], ["Work done on the ball", fmt7(-200 * sg, 1) + " J"]]);
      msg = t < 1 ? "Stopping the ball…" : "<b>Example 7.2:</b> W = 200 N × (−0.15 m) = <b>−30 J</b>. The goalkeeper does negative work on the ball.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["bags", "Fig. 7.2: lifting bags"], ["graph", "Fig. 7.4: work as an area"], ["zero", "Zero work: wall and box"], ["goalie", "Example 7.2: goalkeeper"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.work = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Energy transfers: Example 7.3 carrom and forms of energy (Section 7.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "carrom"};
  var FLOWS = {
    bulb: ["Electrical energy", "Bulb", ["Light energy", "Thermal energy"], "<b>Bulb:</b> electrical energy → light energy and thermal energy (the bulb warms up)."],
    heater: ["Electrical energy", "Water heater", ["Thermal energy of water"], "<b>Water heater:</b> electrical energy → thermal energy of the water."],
    bell: ["Mechanical energy of bell", "Vibrating bell", ["Sound energy"], "<b>Ringing bell:</b> mechanical energy of the vibrating bell → sound energy."],
    cycle: ["Chemical energy from food", "Muscles", ["Kinetic energy", "Thermal energy", "Sound"], "<b>Pause and Ponder 3:</b> muscular energy appears as kinetic energy of the rider and bicycle, plus thermal energy and a little sound."]
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 1});
    L.legend(id === "carrom" ? [[C.ok, "positive work (energy gained)"], [C.danger, "negative work (energy lost)"]] : [[C.vel, "energy in"], [C.path, "energy out"]]);
    L.watch(id === "carrom" ? "Example 7.3: the striker hits the white coin, which hits the black coin into the pocket. Bar lengths are illustrative." : "Follow the energy from its source, through the device, into its new forms (Section 7.3).");
    L.controls(""); L.restart(true);
  }
  function box(x, y, w, h, label, col){
    var words = label.split(" "), lines = [label];
    if(label.length > 16){ var half = Math.ceil(words.length / 2); lines = [words.slice(0, half).join(" "), words.slice(half).join(" ")]; }
    var m = L.rect(x, y, w, h, "#1e293b", ' rx="8" stroke="' + col + '" stroke-width="2"');
    lines.forEach(function(s, i){ m += L.text(x + w / 2, y + h / 2 + 5 + (i - (lines.length - 1) / 2) * 16, s, {size: 13, color: C.text}); });
    return m;
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "carrom"){
      var sx = t < 1 ? 80 + 186 * t : 266 + 20 * clamp7(t - 1, 0, 0.5),
          wx = t < 1 ? 300 : t < 2 ? 300 + 152 * (t - 1) : 452 + 8 * clamp7(t - 2, 0, 0.5),
          kx = t < 2 ? 480 : 480 + 180 * clamp7(t - 2, 0, 1);
      m += L.rect(20, 40, 680, 130, "#d6a86b", ' rx="10"') + L.circle(680, 105, 18, "#111827");
      m += L.circle(sx, 105, 20, "#f1f5f9", ' stroke="#64748b" stroke-width="2"') + L.circle(wx, 105, 14, "#fefce8", ' stroke="#a16207" stroke-width="2"') + (kx < 670 ? L.circle(kx, 105, 14, "#111827", ' stroke="#94a3b8" stroke-width="2"') : "");
      if(t >= 1 && t < 2) m += L.text(283, 64, "+ work on white", {size: 12, color: "#166534", weight: 700}) + L.text(283, 158, "− work on striker", {size: 12, color: "#991b1b", weight: 700});
      if(t >= 2) m += L.text(466, 64, "+ work on black", {size: 12, color: "#166534", weight: 700}) + L.text(466, 158, "− work on white", {size: 12, color: "#991b1b", weight: 700});
      var Es = t < 1 ? 100 : 30, Ew = t < 1 ? 0 : t < 2 ? 70 : 15, Eb = t < 2 ? 0 : 55;
      m += bars7(L, [["striker", Es, 100, C.vel, ""], ["white coin", Ew, 100, "#facc15", ""], ["black coin", Eb, 100, "#94a3b8", ""]], 40, 190, 300);
      L.svg(m, "Carrom shot", 300);
      L.readout(t < 1 ? [["Now", "the striker moves towards the white coin"]] : t < 2 ? [["Striker on white coin", "positive work: white gains energy", C.ok], ["White coin on striker", "negative work: striker loses energy", C.danger]] : [["White coin on black coin", "positive work: black gains energy", C.ok], ["Black coin on white coin", "negative work: white loses energy", C.danger]]);
      msg = t < 3 ? "Striking…" : "<b>Example 7.3:</b> at each collision the coin that is pushed gains energy through positive work, and the pusher loses energy through negative work.";
    } else {
      var F = FLOWS[st.preset], outs = F[2], n = outs.length, ys = n === 1 ? [120] : n === 2 ? [60, 180] : [30, 120, 210];
      m += box(20, 120, 190, 60, F[0], C.vel) + box(270, 120, 160, 60, F[1], C.muted) + L.arrow(212, 150, 266, 150, C.faint, 3);
      outs.forEach(function(o, i){ m += box(500, ys[i], 200, 60, o, C.path) + L.arrow(432, 150, 496, ys[i] + 30, C.faint, 3); });
      for(var p = 0; p < 6; p++){
        var ph = (t * 0.8 + p / 6) % 1, px, py;
        if(ph < 0.5){ px = 212 + (ph / 0.5) * 54; py = 150; }
        else { var yT = ys[p % n] + 30, q = (ph - 0.5) / 0.5; px = 432 + q * 64; py = 150 + q * (yT - 150); }
        m += L.circle(px, py, 5, ph < 0.5 ? C.vel : C.path);
      }
      L.svg(m, "Energy flow diagram", 290);
      L.readout([["Energy in", F[0], C.vel], ["Converted by", F[1]], ["Energy out", outs.join(" + "), C.path]]);
      msg = t < 3 ? "Energy flowing…" : F[3];
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["carrom", "Example 7.3: carrom"], ["bulb", "Bulb"], ["heater", "Water heater"], ["bell", "Ringing bell"], ["cycle", "Pedalling a bicycle"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.transfers = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Kinetic energy: Examples 7.4–7.6, Exercise Q8 and free exploration
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "ball", m: 50, v: 10};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "jet" ? 70 / 24.5 : 1, step: 0.05, speed: id === "jet" ? 1 : 0.5});
    L.legend(id === "jet" ? [[C.vel, "kinetic energy of the jet"], [C.danger, "work done by the wire (negative)"]] : id === "double" || id === "scooter" ? [[C.vel, "slower / lighter"], [C.path, "faster / heavier"]] : [[C.vel, "kinetic energy"]]);
    L.watch({ball: "Example 7.5: a 0.2 kg cricket ball bowled at 154.8 km h⁻¹.", double: "Example 7.4: the same 1000 kg car at 10 m s⁻¹ and at 20 m s⁻¹ (illustrative values).", jet: "Example 7.6: a 15000 kg jet caught by an arresting wire that pulls back with 367500 N.", scooter: "Exercise Q8: the same scooter reaches the same speed with and without a 40 kg passenger (speed 10 m s⁻¹ illustrative).", explore: "Choose any mass and speed: K = ½mv²."}[id]);
    if(id === "explore"){
      L.controls(L.slider("k-m", "Mass m", 1, 100, 1, st.m, st.m + " kg") + L.slider("k-v", "Speed v", 0, 30, 1, st.v, st.v + " m s⁻¹"));
      L.onInput("k-m", function(v){ st.m = v; L.setVal("k-m", v + " kg"); App.resetTimeline(); App.play(); });
      L.onInput("k-v", function(v){ st.v = v; L.setVal("k-v", v + " m s⁻¹"); App.resetTimeline(); App.play(); });
    } else L.controls("");
    L.restart(true);
  }
  function car(x, y, col){ return L.rect(x - 30, y - 22, 60, 22, col, ' rx="6"') + L.circle(x - 16, y + 2, 7, "#0f172a") + L.circle(x + 16, y + 2, 7, "#0f172a"); }
  function draw(t){
    var m = "", msg, f = clamp7(t, 0, 1);
    if(st.preset === "ball"){
      m += L.rect(20, 130, 680, 60, "#65a30d", ' rx="6" opacity="0.35"') + L.rect(40, 120, 8, 50, "#fde68a") + L.rect(672, 120, 8, 50, "#fde68a") + L.circle(60 + 600 * f, 150, 10, "#dc2626");
      m += L.text(360, 70, "m = 0.2 kg,  v = 154.8 km h⁻¹ = 43 m s⁻¹", {size: 15, color: C.text}) + bars7(L, [["kinetic energy", 184.9, 200, C.vel, "184.9 J"]], 150, 220, 300);
      L.svg(m, "Cricket ball", 270);
      L.readout([["Mass", "0.2 kg"], ["Velocity", "154.8 ÷ 3.6 = 43 m s⁻¹", C.vel], ["K = ½mv²", "½ × 0.2 × 43² = 184.9 J", C.vel]]);
      msg = t < 1 ? "Bowling…" : "<b>Example 7.5:</b> K = ½ × 0.2 kg × (43 m s⁻¹)² = <b>184.9 J</b>.";
    } else if(st.preset === "double"){
      m += L.line(20, 110, 700, 110, C.faint, 2) + L.line(20, 200, 700, 200, C.faint, 2) + car(60 + 280 * f, 102, C.vel) + car(60 + 560 * f, 192, C.path);
      m += L.text(60, 50, "v = 10 m s⁻¹", {size: 13, color: C.vel, anchor: "start"}) + L.text(60, 140, "v = 20 m s⁻¹", {size: 13, color: C.path, anchor: "start"});
      m += bars7(L, [["at 10 m s⁻¹", 50000, 200000, C.vel, "50000 J"], ["at 20 m s⁻¹", 200000, 200000, C.path, "200000 J"]], 40, 225, 380);
      L.svg(m, "Two speeds", 300);
      L.readout([["Car mass (illustrative)", "1000 kg"], ["At 10 m s⁻¹", "½ × 1000 × 10² = 50000 J", C.vel], ["At 20 m s⁻¹", "½ × 1000 × 20² = 200000 J", C.path]]);
      msg = t < 1 ? "Driving…" : "<b>Example 7.4:</b> twice the speed gives <b>4 times</b> the kinetic energy, because K depends on v².";
    } else if(st.preset === "jet"){
      var a = 24.5, T = 70 / a, tt = clamp7(t, 0, T), v = Math.max(0, 70 - a * tt), s = clamp7(70 * tt - 0.5 * a * tt * tt, 0, 100), K = 0.5 * 15000 * v * v, Wd = -367500 * s;
      var X = function(d){ return 90 + d * 5.4; }, jx = X(s);
      m += L.rect(20, 160, 680, 16, "#475569") + L.line(X(0), 150, X(0), 176, C.danger, 3) + L.text(X(0), 196, "wire", {size: 12, color: C.danger}) + L.text(X(100), 196, "100 m", {size: 12, color: C.muted}) + L.line(X(100), 150, X(100), 176, C.faint, 2);
      m += L.line(X(0), 160, jx - 42, 146, C.danger, 2) + '<polygon points="' + (jx + 42) + ',140 ' + (jx - 40) + ',132 ' + (jx - 40) + ',152 " fill="#cbd5e1"/><polygon points="' + (jx - 5) + ',142 ' + (jx - 28) + ',110 ' + (jx - 16) + ',142" fill="#94a3b8"/>';
      m += L.text(360, 60, "m = 15000 kg, backward force 367500 N", {size: 14, color: C.text});
      m += bars7(L, [["kinetic energy", K, 36750000, C.vel, fmt7(K) + " J"], ["work by wire", -Wd, 36750000, C.danger, fmt7(Wd) + " J"]], 40, 220, 300);
      L.svg(m, "Jet landing on a carrier", 300);
      L.readout([["Speed", L.num(v, 1) + " m s⁻¹", C.vel], ["Distance along deck", L.num(s, 1) + " m", C.path], ["Kinetic energy", fmt7(K) + " J", C.vel], ["Work by wire", fmt7(Wd) + " J", C.danger]]);
      msg = t < T - 1e-6 ? "Hook caught…" : "<b>Example 7.6:</b> work by the wire = 367500 N × (−100 m) = −36750000 J = change in kinetic energy = −½ × 15000 kg × v², so v² = 4900 m² s⁻² and v = <b>70 m s⁻¹</b> (252 km h⁻¹).";
    } else if(st.preset === "scooter"){
      var vv = 10 * f, K1 = 0.5 * 160 * vv * vv, K2 = 0.5 * 200 * vv * vv, sx = 60 + 540 * f * f;
      [[100, "Day 1: 60 kg rider", C.vel, 1], [190, "Day 2: rider + 40 kg son", C.path, 2]].forEach(function(r){
        m += L.line(20, r[0] + 10, 700, r[0] + 10, C.faint, 2) + L.rect(sx - 30, r[0] - 16, 60, 16, r[2], ' rx="5"') + L.circle(sx - 20, r[0] + 2, 8, "#0f172a") + L.circle(sx + 20, r[0] + 2, 8, "#0f172a");
        for(var i = 0; i < r[3]; i++) m += L.circle(sx - 4 - i * 18, r[0] - 36, 8, "#e2e8f0") + L.line(sx - 4 - i * 18, r[0] - 28, sx - 4 - i * 18, r[0] - 16, "#e2e8f0", 3);
        m += L.text(20, r[0] - 50, r[1], {size: 13, color: r[2], anchor: "start"});
      });
      m += bars7(L, [["Day 1 energy", K1, 10000, C.vel, fmt7(K1) + " J"], ["Day 2 energy", K2, 10000, C.path, fmt7(K2) + " J"]], 40, 225, 360);
      L.svg(m, "Scooter on two days", 300);
      L.readout([["Day 1 mass", "60 + 100 = 160 kg", C.vel], ["Day 2 mass", "60 + 40 + 100 = 200 kg", C.path], ["Energy (and fuel) ratio", "160 : 200 = 4 : 5"]]);
      msg = t < 1 ? "Accelerating…" : "<b>Exercise Q8:</b> at the same speed, kinetic energy is proportional to mass: 160 : 200 = <b>4 : 5</b>. The fuel used is in the same ratio.";
    } else {
      var Ke = 0.5 * st.m * st.v * st.v;
      m += L.line(20, 150, 700, 150, C.faint, 2) + L.circle(60 + 580 * f * Math.min(1, st.v / 30 + 0.05), 150 - 8 - st.m / 10, 8 + st.m / 10, C.vel);
      m += bars7(L, [["kinetic energy", Ke, 45000, C.vel, fmt7(Ke) + " J"]], 40, 210, 400);
      L.svg(m, "Explore kinetic energy", 260);
      L.readout([["Mass", st.m + " kg"], ["Speed", st.v + " m s⁻¹", C.vel], ["K = ½mv²", fmt7(Ke) + " J", C.vel]]);
      msg = "K = ½ × " + st.m + " kg × (" + st.v + " m s⁻¹)² = <b>" + fmt7(Ke) + " J</b>. Double the speed and K becomes 4 times as large.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["ball", "Example 7.5: fast delivery"], ["double", "Example 7.4: double the speed"], ["jet", "Example 7.6: jet landing"], ["scooter", "Exercise Q8: scooter"], ["explore", "Explore ½mv²"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.kinetic = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Potential energy: Activity 7.1, Exercise Q5, Fig. 7.14, Example 7.7
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "sand"};
  function select(id){
    st.preset = id; L.markPreset(id);
    var cfg = {sand: [1, 0.02, 0.4], paths: [2, 0.05, 0.5], spring: [3.5, 0.05, 1], catch: [Math.SQRT2, 0.02, 0.6]}[id];
    L.timeline({maxT: cfg[0], step: cfg[1], speed: cfg[2]});
    L.legend(id === "paths" ? [[C.vel, "lift"], [C.path, "stairs"]] : id === "sand" ? [[C.path, "potential energy before the drop"]] : [[C.path, "potential energy"], [C.vel, "kinetic energy"]]);
    L.watch({sand: "Activity 7.1: a heavy ball dropped onto sand from 1 m and 2 m, and from 3 m for comparison (a 1 kg ball is illustrative).", paths: "Exercise Q5: a 50 kg student goes up a 72.5 m building by lift and by the stairs.", spring: "Fig. 7.14: a spring is compressed, held, and released against a block (20 J stored is illustrative).", catch: "Example 7.7: a 200 g ball thrown up to 10 m above the ground."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "sand"){
      var G = 240, PX = 55;
      m += L.rect(60, G, 600, 40, "#d6b370", ' rx="4"');
      [[1, 170], [2, 360], [3, 550]].forEach(function(b){
        var h = b[0], x = b[1], tf = Math.sqrt(2 * h / 10), y = Math.max(0, h - 5 * t * t), dep = t > tf ? clamp7((t - tf) / 0.15, 0, 1) * 6 * h : 0;
        m += L.line(x - 40, G - h * PX, x + 40, G - h * PX, C.faint, 1) + L.text(x + 46, G - h * PX + 4, h + " m", {size: 12, color: C.muted, anchor: "start"});
        if(dep > 0) m += '<ellipse cx="' + x + '" cy="' + G + '" rx="24" ry="' + dep + '" fill="#8a6d3b"/>';
        m += L.circle(x, G - y * PX - 12 + dep * 0.6, 12, "#475569", ' stroke="#e2e8f0"');
        m += L.text(x, G + 58, "U = " + 10 * h + " J", {size: 13, color: C.path, weight: 700});
      });
      L.svg(m, "Balls dropped onto sand", 310);
      L.readout([["Dropped from 1 m", "U = 1 × 10 × 1 = 10 J", C.path], ["Dropped from 2 m", "U = 1 × 10 × 2 = 20 J", C.path], ["Dropped from 3 m", "U = 1 × 10 × 3 = 30 J", C.path]]);
      msg = t < 1 ? "Dropping…" : "<b>Activity 7.1:</b> the ball dropped from the greatest height makes the <b>deepest depression</b>: more height means more potential energy (U = mgh).";
    } else if(st.preset === "paths"){
      var G2 = 260, S = 220 / 72.5, fl = clamp7(t, 0, 1), fs = clamp7(t / 2, 0, 1), hl = 72.5 * fl, hs = 72.5 * fs;
      m += L.rect(230, 40, 320, 220, "#334155", ' rx="4"') + L.rect(250, 40, 44, 220, "#1e293b") + L.rect(252, G2 - hl * S - 26, 40, 26, C.vel, ' rx="3"');
      var zig = [];
      for(var k = 0; k <= 8; k++) zig.push((k % 2 ? 520 : 400) + ',' + (G2 - k / 8 * 220));
      m += '<polyline points="' + zig.join(' ') + '" fill="none" stroke="#94a3b8" stroke-width="3"/>';
      var kk = Math.min(7, Math.floor(fs * 8)), p = fs * 8 - kk, zx = kk % 2 ? 520 - 120 * p : 400 + 120 * p;
      m += L.circle(zx, G2 - fs * 220 - 8, 8, C.path);
      m += L.text(272, 282, "lift", {size: 13, color: C.vel}) + L.text(460, 282, "stairs", {size: 13, color: C.path}) + L.text(600, 44, "72.5 m", {size: 13, color: C.muted, anchor: "start"}) + L.line(560, 40, 590, 40, C.faint, 1);
      L.svg(m, "Lift and stairs", 300);
      L.readout([["Lift: height", L.num(hl, 1) + " m", C.vel], ["Lift: U gained", fmt7(500 * hl) + " J", C.vel], ["Stairs: height", L.num(hs, 1) + " m", C.path], ["Stairs: U gained", fmt7(500 * hs) + " J", C.path]]);
      msg = t < 2 ? "Going up…" : "<b>Exercise Q5:</b> U = mgh = 50 kg × 10 m s⁻² × 72.5 m = <b>36250 J</b> by either route. Potential energy depends only on the height gained, not on the path.";
    } else if(st.preset === "spring"){
      var xs = t < 1 ? 300 - 100 * t : t < 2 ? 200 : t < 3 ? 200 + 100 * (t - 2) : 300, comp = (300 - xs) / 100, U = 20 * comp * comp, K = t >= 2 ? 20 - U : 0, bxs = t < 3 ? xs : 300 + 150 * (t - 3);
      var zz = [];
      for(var i = 0; i <= 14; i++) zz.push((70 + (xs - 70) * i / 14) + ',' + (i === 0 || i === 14 ? 150 : i % 2 ? 132 : 168));
      m += L.rect(40, 90, 30, 110, "#78716c") + L.line(40, 200, 700, 200, C.faint, 2) + '<polyline points="' + zz.join(' ') + '" fill="none" stroke="#cbd5e1" stroke-width="3"/>' + L.rect(bxs, 120, 60, 80, "#475569", ' rx="4"');
      if(t < 1) m += L.arrow(bxs + 130, 160, bxs + 66, 160, C.vel, 4) + L.text(bxs + 100, 148, "push", {size: 12, color: C.vel});
      m += bars7(L, [["stored in spring", U, 20, C.path, fmt7(U, 1) + " J"], ["block's kinetic", K, 20, C.vel, fmt7(K, 1) + " J"]], 40, 225, 300);
      L.svg(m, "Spring and block", 300);
      L.readout([["Stage", t < 1 ? "compressing: work done on the spring" : t < 2 ? "held: energy stored" : t < 3 ? "released: spring pushes the block" : "block moving off"], ["Stored potential energy", fmt7(U, 1) + " J", C.path], ["Block's kinetic energy", fmt7(K, 1) + " J", C.vel]]);
      msg = t < 3.5 ? "Watch the stored energy…" : "<b>Fig. 7.14:</b> the work done compressing the spring was stored as potential energy; on release it became the block's <b>kinetic energy</b>.";
    } else {
      var v0 = Math.sqrt(200), tt = clamp7(t, 0, Math.SQRT2), h = Math.min(10, v0 * tt - 5 * tt * tt), Uc = 2 * h, Kc = Math.max(0, 20 - Uc), G3 = 270;
      m += L.line(20, G3, 700, G3, C.faint, 2) + person7(L, 250, G3) + L.circle(300, G3 - 20 * h - 12, 9, "#dc2626");
      [0, 5, 10].forEach(function(k){ m += L.line(332, G3 - 20 * k, 344, G3 - 20 * k, C.faint, 2) + L.text(350, G3 - 20 * k + 4, k + " m", {size: 12, color: C.muted, anchor: "start"}); });
      m += bars7(L, [["potential", Uc, 20, C.path, fmt7(Uc, 1) + " J"], ["kinetic", Kc, 20, C.vel, fmt7(Kc, 1) + " J"]], 420, 120, 110);
      L.svg(m, "Ball thrown up", 290);
      L.readout([["Height", L.num(h, 1) + " m"], ["Potential energy", fmt7(Uc, 1) + " J", C.path], ["Kinetic energy", fmt7(Kc, 1) + " J", C.vel]]);
      msg = t < Math.SQRT2 - 1e-6 ? "Rising…" : "<b>Example 7.7:</b> at the top, U = mgh = 0.2 kg × 10 m s⁻² × 10 m = <b>20 J</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["sand", "Activity 7.1: sand bed"], ["paths", "Exercise Q5: lift or stairs"], ["spring", "Fig. 7.14: spring"], ["catch", "Example 7.7: ball thrown up"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.potential = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Conservation: Fig. 7.19, Activity 7.2, Examples 7.8–7.9, Exercise Q14 (Fig. 7.39)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "fall"};
  var SEG = [[56.1, 540.7, 59.9, 537.0, 60.7, 537.1, 61.8, 537.4], [61.8, 537.4, 63.9, 538.2, 64.4, 541.4, 67.3, 552.3], [67.3, 552.3, 68.0, 555.1, 69.0, 559.0, 70.9, 564.3], [70.9, 564.3, 71.4, 565.6, 72.0, 567.2, 72.5, 568.4], [72.5, 568.4, 75.5, 575.2, 78.2, 582.9, 84.1, 582.9], [84.1, 582.9, 94.8, 582.9, 94.9, 558.6, 105.6, 558.6], [105.6, 558.6, 116.3, 558.6, 116.0, 574.7, 126.9, 574.8], [126.9, 574.8, 136.4, 575.0, 141.5, 554.9, 149.3, 537.2], [149.3, 537.2, 153.5, 527.6, 159.8, 518.1, 164.1, 514.3]];
  var TRACK = [];
  SEG.forEach(function(s){ for(var i = 0; i <= 20; i++){ var u = i / 20, a = (1 - u) * (1 - u) * (1 - u), b = 3 * u * (1 - u) * (1 - u), c = 3 * u * u * (1 - u), d = u * u * u; TRACK.push([a * s[0] + b * s[2] + c * s[4] + d * s[6], (595.6 - (a * s[1] + b * s[3] + c * s[5] + d * s[7])) / 1.9475]); } });
  TRACK.sort(function(p, q){ return p[0] - q[0]; });
  function trackU(x){ for(var i = 1; i < TRACK.length; i++){ if(TRACK[i][0] >= x){ var p = TRACK[i - 1], q = TRACK[i], r = q[0] > p[0] ? (x - p[0]) / (q[0] - p[0]) : 0; return p[1] + r * (q[1] - p[1]); } } return TRACK[TRACK.length - 1][1]; }
  function select(id){
    st.preset = id; L.markPreset(id);
    var cfg = {fall: [2, 0.05, 0.5], pendulum: [1, 0.02, 0.4], slide: [1, 0.02, 0.4], ramp: [2, 0.05, 0.5], track: [2, 0.02, 0.4]}[id];
    L.timeline({maxT: cfg[0], step: cfg[1], speed: cfg[2]});
    L.legend(id === "ramp" ? [[C.vel, "kinetic"], [C.path, "potential"], [C.danger, "work against sand"]] : id === "slide" ? [[C.vel, "20 kg child"], [C.path, "40 kg child"]] : [[C.path, "potential energy"], [C.vel, "kinetic energy"], [C.ok, "total"]]);
    L.watch({fall: "Fig. 7.19: a 1 kg ball dropped from 20 m (illustrative values), g = 10 m s⁻².", pendulum: "Activity 7.2: a pendulum released from P swings through Q to R. Energies are shown as percentages of the total.", slide: "Example 7.8: children of 20 kg and 40 kg on a straight and a curved frictionless slide, both 5 m high (illustrative). Positions are shown by height fallen.", ramp: "Example 7.9: a 10000 kg truck at 20 m s⁻¹ runs up a 30° escape ramp filled with sand.", track: "Exercise Q14: the 0.5 kg ball on the frictionless track of Fig. 7.39, released from O with 30 J. Its position is stepped along the track, not timed."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "fall"){
      var hh = Math.max(0, 20 - 5 * t * t), v = 10 * t, U = 10 * hh, K = 0.5 * v * v;
      m += L.line(120, 260, 300, 260, C.faint, 2) + L.line(150, 50, 150, 260, C.grid, 1) + L.text(140, 54, "A (20 m)", {size: 12, color: C.muted, anchor: "end"}) + L.text(140, 264, "C (ground)", {size: 12, color: C.muted, anchor: "end"}) + L.circle(200, 260 - hh * 10.5 - 10, 10, "#dc2626");
      m += bars7(L, [["potential", U, 200, C.path, fmt7(U) + " J"], ["kinetic", K, 200, C.vel, fmt7(K) + " J"], ["total", U + K, 200, C.ok, fmt7(U + K) + " J"]], 320, 100, 200);
      L.svg(m, "Free fall energy", 290);
      L.readout([["Time", L.num(t, 2) + " s"], ["Height", L.num(hh, 1) + " m"], ["Speed v = gt", L.num(v, 1) + " m s⁻¹", C.vel], ["K + U", fmt7(U + K) + " J", C.ok]]);
      msg = t < 2 ? "Falling…" : "<b>Eqs. 7.9–7.10:</b> potential energy fell as kinetic energy grew, and at every instant K + U = mgh = <b>200 J</b>.";
    } else if(st.preset === "pendulum"){
      var th0 = 35 * Math.PI / 180, th = -th0 * Math.cos(Math.PI * t), bx = 360 + 180 * Math.sin(th), by = 40 + 180 * Math.cos(th), yP = 40 + 180 * Math.cos(th0);
      var Up = 100 * (1 - Math.cos(th)) / (1 - Math.cos(th0)), Kp = 100 - Up;
      m += L.rect(300, 30, 120, 10, "#475569") + '<line x1="180" y1="' + yP + '" x2="540" y2="' + yP + '" stroke="' + C.faint + '" stroke-dasharray="6 5"/>' + L.line(360, 40, bx, by, "#cbd5e1", 2) + L.circle(bx, by, 14, "#f59e0b");
      m += L.text(360 - 180 * Math.sin(th0) - 26, yP + 5, "P", {size: 14, color: C.text, weight: 700}) + L.text(360 + 180 * Math.sin(th0) + 26, yP + 5, "R", {size: 14, color: C.text, weight: 700}) + L.text(360, 244, "Q", {size: 14, color: C.text, weight: 700});
      m += bars7(L, [["potential", Up, 100, C.path, fmt7(Up) + "%"], ["kinetic", Kp, 100, C.vel, fmt7(Kp) + "%"]], 150, 256, 280);
      L.svg(m, "Pendulum", 330);
      L.readout([["Bob at", t < 0.03 ? "P (extreme)" : Math.abs(t - 0.5) < 0.03 ? "Q (lowest point)" : t > 0.97 ? "R (extreme)" : "between"], ["Potential energy", fmt7(Up) + "% of total", C.path], ["Kinetic energy", fmt7(Kp) + "% of total", C.vel]]);
      msg = t < 1 ? "Swinging…" : "<b>Activity 7.2:</b> the bob rises on the other side to almost the height of P: only potential energy at P and R, only kinetic energy at Q. The <b>mechanical energy is conserved</b>; friction and air resistance slowly remove a little.";
    } else if(st.preset === "slide"){
      var f = clamp7(t, 0, 1), vs = 10 * Math.sqrt(f), u = 1 - Math.sqrt(1 - f);
      var cx = (1 - u) * (1 - u) * 400 + 2 * u * (1 - u) * 420 + u * u * 660, cy = 60 + 200 * f;
      m += L.line(60, 60, 300, 260, "#f59e0b", 5) + '<path d="M400 60 Q420 260 660 260" fill="none" stroke="#f59e0b" stroke-width="5"/>' + L.line(40, 260, 700, 260, C.faint, 2) + L.line(56, 60, 56, 260, "#64748b", 3) + L.line(396, 60, 396, 260, "#64748b", 3);
      m += L.circle(60 + 240 * f, 60 + 200 * f - 12, 10, C.vel) + L.circle(cx, cy - 15, 13, C.path) + L.text(20, 164, "5 m", {size: 12, color: C.muted, anchor: "start"}) + L.text(180, 40, "20 kg, straight", {size: 13, color: C.vel}) + L.text(540, 40, "40 kg, curved", {size: 13, color: C.path});
      L.svg(m, "Two slides", 290);
      L.readout([["Height fallen", L.num(5 * f, 2) + " m"], ["20 kg child", L.num(vs, 1) + " m s⁻¹, K = " + fmt7(1000 * f) + " J", C.vel], ["40 kg child", L.num(vs, 1) + " m s⁻¹, K = " + fmt7(2000 * f) + " J", C.path]]);
      msg = t < 1 ? "Sliding…" : "<b>Example 7.8:</b> both children reach v = √(2 × 10 × 5) = <b>10 m s⁻¹</b>. The mass cancels and the shape of the slide does not matter.";
    } else if(st.preset === "ramp"){
      var tr = clamp7(t, 0, 2), d = 20 * tr - 5 * tr * tr, vr = 20 - 10 * tr, Kr = 5000 * vr * vr, Ur = 50000 * d, SC = 18;
      var px = 70 + 0.866 * SC * d, py = 270 - 0.5 * SC * d;
      m += L.line(10, 270, 70, 270, C.faint, 3) + '<polygon points="70,270 ' + (70 + 0.866 * SC * 24) + ',270 ' + (70 + 0.866 * SC * 24) + ',' + (270 - 0.5 * SC * 24) + '" fill="#a8a29e"/>';
      m += '<line x1="' + (70 + 0.866 * SC * 20) + '" y1="' + (270 - 0.5 * SC * 20 - 6) + '" x2="' + (70 + 0.866 * SC * 20 + 6) + '" y2="' + (270 - 0.5 * SC * 20 + 6) + '" stroke="' + C.danger + '" stroke-width="3"/>' + L.text(70 + 0.866 * SC * 20 - 10, 270 - 0.5 * SC * 20 - 12, "20 m", {size: 12, color: C.danger, anchor: "end"});
      m += '<g transform="translate(' + px + ' ' + py + ') rotate(-30)">' + L.rect(-24, -26, 48, 26, "#2563eb", ' rx="4"') + '</g>';
      m += bars7(L, [["kinetic", Kr, 2000000, C.vel, fmt7(Kr) + " J"], ["potential", Ur, 2000000, C.path, fmt7(Ur) + " J"], ["vs sand", 50000 * d, 2000000, C.danger, fmt7(50000 * d) + " J"]], 440, 150, 80);
      L.svg(m, "Escape ramp", 290);
      L.readout([["Distance up the ramp", L.num(d, 1) + " m"], ["Speed", L.num(vr, 1) + " m s⁻¹", C.vel], ["K + U", fmt7(Kr + Ur) + " J"], ["Work done by sand", fmt7(-50000 * d) + " J", C.danger]]);
      msg = t < 2 ? "Climbing the ramp…" : "<b>Example 7.9:</b> 2000000 J of kinetic energy became 1000000 J of potential energy plus 1000000 J of work against the sand: the truck stops after <b>20 m</b>.";
    } else {
      var X = function(x){ return 70 + (x - 55.6) * 5.5; }, Y = function(J){ return 250 - J * 5; };
      var xb = 61.8 + (149.3 - 61.8) * clamp7(t / 2, 0, 1), Ub = t >= 2 ? 30 : Math.min(30, trackU(xb)), Kb = Math.max(0, 30 - Ub), vb = Math.sqrt(2 * Kb / 0.5);
      m += L.line(X(55.6), Y(0), X(172), Y(0), C.faint, 2) + L.line(X(55.6), Y(0), X(55.6), Y(45), C.faint, 2) + L.text(X(114), 276, "Displacement", {size: 12, color: C.muted});
      [10, 20, 30, 40].forEach(function(J){ m += L.text(X(55.6) - 8, Y(J) + 4, J + " J", {size: 11, color: C.muted, anchor: "end"}); });
      [[20, 141.5], [30, 149.2], [40, 161.0]].forEach(function(r){ m += '<line x1="' + X(55.9) + '" y1="' + Y(r[0]) + '" x2="' + X(r[1]) + '" y2="' + Y(r[0]) + '" stroke="' + C.faint + '" stroke-dasharray="5 4"/>'; });
      m += '<polyline points="' + TRACK.map(function(p){ return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join(' ') + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
      [["O", 61.8, 30], ["P", 141.5, 20], ["Q", 149.3, 30], ["R", 164.1, 41.7]].forEach(function(l){ m += L.text(X(l[1]) - 12, Y(l[2]) - 8, l[0], {size: 13, color: C.text, weight: 700}); });
      m += L.circle(X(xb), Y(Ub) - 9, 8, "#f8fafc");
      L.svg(m, "Potential energy track", 290);
      L.readout([["Potential energy", L.num(Ub, 1) + " J", C.path], ["Kinetic energy", L.num(Kb, 1) + " J", C.vel], ["Speed", L.num(vb, 2) + " m s⁻¹", C.vel]]);
      msg = t < 2 ? "Rolling from O…" : "<b>Exercise Q14:</b> total energy = 30 J. At P (U = 20 J): K = 10 J, v = √(2 × 10 ÷ 0.5) = <b>6.32 m s⁻¹</b>. At Q (U = 30 J): v = <b>0</b>, so the ball turns back. R (U = 40 J) is never reached.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["fall", "Fig. 7.19: free fall"], ["pendulum", "Activity 7.2: pendulum"], ["slide", "Example 7.8: slides"], ["ramp", "Example 7.9: escape ramp"], ["track", "Exercise Q14: track"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.conservation = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Power: stairs, Examples 7.10–7.11, Exercise Q6
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "stairs"};
  function select(id){
    st.preset = id; L.markPreset(id);
    var cfg = {stairs: [300, 5, 60], lifter: [5, 0.1, 1], car: [10, 0.1, 2], crane: [60, 1, 10]}[id];
    L.timeline({maxT: cfg[0], step: cfg[1], speed: cfg[2], format: function(t){ return "t = <b>" + L.num(t, id === "lifter" || id === "car" ? 1 : 0) + " s</b>"; }});
    L.legend(id === "stairs" ? [[C.vel, "A walks (5 min)"], [C.path, "B runs (1 min)"]] : id === "crane" ? [[C.vel, "run 1: 10th floor"], [C.path, "run 2: 20th floor"]] : [[C.path, "work done"]]);
    L.watch({stairs: "Section 7.5: two students of 50 kg climb 6 m of stairs, one walking in 5 minutes and one running in 1 minute (illustrative values).", lifter: "Example 7.10: a weightlifter lifts 75 kg through 2 m in 5 s.", car: "Example 7.11: a 1000 kg car goes from rest to 72 km h⁻¹ (20 m s⁻¹) in 10 s.", crane: "Exercise Q6: a crane lifts 500 kg to the 10th floor in 30 s, then to the 20th floor in 60 s (3 m floors; values illustrative)."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "stairs"){
      var fA = clamp7(t / 300, 0, 1), fB = clamp7(t / 60, 0, 1);
      [[80, fA, C.vel, "A walks (5 min)"], [400, fB, C.path, "B runs (1 min)"]].forEach(function(r){
        var pts = [];
        for(var k = 0; k <= 10; k++){ pts.push((r[0] + k * 22) + ',' + (260 - k * 20)); pts.push((r[0] + (k + 1) * 22) + ',' + (260 - k * 20)); }
        m += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#94a3b8" stroke-width="3"/>' + L.circle(r[0] + 11 + r[1] * 220, 260 - r[1] * 200 - 12, 9, r[2]);
        m += L.text(r[0] + 110, 285, r[3], {size: 13, color: r[2]}) + L.text(r[0] + 40, 60, "W = " + fmt7(3000 * r[1]) + " J", {size: 14, color: r[2], weight: 700, anchor: "start"});
      });
      L.svg(m, "Walking and running upstairs", 300);
      L.readout([["A: work so far", fmt7(3000 * fA) + " J", C.vel], ["A: power", "3000 J ÷ 300 s = 10 W", C.vel], ["B: work so far", fmt7(3000 * fB) + " J", C.path], ["B: power", "3000 J ÷ 60 s = 50 W", C.path]]);
      msg = t < 300 ? "Climbing…" : "<b>Same work</b> (50 kg × 10 m s⁻² × 6 m = 3000 J) for both, but B does it in one-fifth of the time: <b>50 W</b> against 10 W.";
    } else if(st.preset === "lifter"){
      var hh = 2 * clamp7(t / 5, 0, 1), W = 750 * hh, yb = 250 - hh * 90;
      m += L.line(20, 250, 700, 250, C.faint, 2) + L.line(120, yb, 280, yb, "#cbd5e1", 5) + L.rect(110, yb - 22, 14, 44, "#475569") + L.rect(276, yb - 22, 14, 44, "#475569") + L.text(200, yb - 16, "75 kg", {size: 13, color: C.text});
      [0, 1, 2].forEach(function(k){ m += L.line(40, 250 - k * 90, 56, 250 - k * 90, C.faint, 2) + L.text(62, 254 - k * 90, k + " m", {size: 12, color: C.muted, anchor: "start"}); });
      m += bars7(L, [["work done", W, 1500, C.path, fmt7(W) + " J"]], 360, 120, 150);
      L.svg(m, "Weightlifter", 280);
      L.readout([["Height", L.num(hh, 2) + " m"], ["Work done so far", fmt7(W) + " J", C.path], ["Power", "1500 J ÷ 5 s = 300 W", C.vel]]);
      msg = t < 5 ? "Lifting…" : "<b>Example 7.10:</b> W = 75 kg × 10 m s⁻² × 2 m = 1500 J in 5 s, so P = <b>300 W</b>.";
    } else if(st.preset === "car"){
      var tc = clamp7(t, 0, 10), vc = 2 * tc, Kc = 500 * vc * vc, xc = 60 + tc * tc * 6;
      m += L.line(20, 150, 700, 150, C.faint, 2) + L.rect(xc - 30, 120, 60, 22, "#2563eb", ' rx="6"') + L.circle(xc - 16, 146, 7, "#0f172a") + L.circle(xc + 16, 146, 7, "#0f172a");
      m += bars7(L, [["kinetic energy", Kc, 200000, C.path, fmt7(Kc) + " J"]], 40, 200, 400);
      L.svg(m, "Car accelerating", 260);
      L.readout([["Time", L.num(tc, 1) + " s"], ["Speed", L.num(vc, 1) + " m s⁻¹", C.vel], ["Kinetic energy gained", fmt7(Kc) + " J", C.path], ["Average power (0–10 s)", "200000 J ÷ 10 s = 20000 W"]]);
      msg = t < 10 ? "Accelerating…" : "<b>Example 7.11:</b> the engine does 200000 J of work in 10 s: P = <b>20000 W</b>, about 26.8 hp (1 hp = 746 W).";
    } else {
      var h1 = 30 * clamp7(t / 30, 0, 1), h2 = 60 * clamp7(t / 60, 0, 1);
      m += L.rect(250, 60, 220, 200, "#334155");
      for(var fl = 1; fl <= 20; fl++) m += L.line(250, 260 - fl * 10, 470, 260 - fl * 10, "#475569", 1);
      m += L.text(480, 164, "10th floor", {size: 12, color: C.muted, anchor: "start"}) + L.text(480, 64, "20th floor", {size: 12, color: C.muted, anchor: "start"});
      m += L.line(200, 30, 200, 260, "#f59e0b", 4) + L.line(200, 30, 520, 30, "#f59e0b", 4);
      m += L.rect(165, 240 - h1 * 10 / 3, 26, 20, C.vel, ' rx="3"') + L.line(178, 30, 178, 240 - h1 * 10 / 3, "#cbd5e1", 1) + L.rect(530, 240 - h2 * 10 / 3, 26, 20, C.path, ' rx="3"') + L.line(543, 30, 543, 240 - h2 * 10 / 3, "#cbd5e1", 1);
      m += L.text(178, 285, "run 1", {size: 12, color: C.vel}) + L.text(543, 285, "run 2", {size: 12, color: C.path});
      L.svg(m, "Crane", 300);
      L.readout([["Run 1: energy", fmt7(5000 * h1) + " J", C.vel], ["Run 1: power", "150000 J ÷ 30 s = 5000 W", C.vel], ["Run 2: energy", fmt7(5000 * h2) + " J", C.path], ["Run 2: power", "300000 J ÷ 60 s = 5000 W", C.path]]);
      msg = t < 60 ? "Lifting…" : "<b>Exercise Q6:</b> twice the height needs twice the energy, delivered in twice the time, so <b>the same power</b> is needed.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["stairs", "Running vs walking upstairs"], ["lifter", "Example 7.10: weightlifter"], ["car", "Example 7.11: car"], ["crane", "Exercise Q6: crane"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.power = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Simple machines: pulley, Example 7.12, Activity 7.3, Activity 7.5, Example 7.13, Table 7.2
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "pulley"};
  function select(id){
    st.preset = id; L.markPreset(id);
    var cfg = {pulley: [1, 0.05, 0.5], ramp: [1, 0.05, 0.5], plank: [1, 0.05, 0.5], beam: [3, 1, 0.8], seesaw: [2, 0.05, 0.5], classes: [2, 1, 0.7]}[id];
    L.timeline({maxT: cfg[0], step: cfg[1], speed: cfg[2]});
    L.legend(id === "classes" ? [[C.ok, "fulcrum"], [C.path, "load"], [C.vel, "effort"]] : [[C.vel, "effort"], [C.path, "load"]]);
    L.watch({pulley: "Fig. 7.24: a 100 N load raised with a fixed pulley (illustrative load).", ramp: "Example 7.12: a ramp 40 cm wide over a step 30 cm high. A 60 N load is illustrative.", plank: "Activity 7.3: a 6 N cart pulled up to 0.5 m along a 1.0 m and a 1.5 m plank (illustrative weights, friction ignored).", beam: "Activity 7.5: 1 coin 20 cm from the fulcrum balances 1, 2, 4 and 8 coins on the other side (the 20 cm arm is illustrative).", seesaw: "Example 7.13: seats A and E are 2 m from the fulcrum C; B and D are 1 m. A 15 kg child sits at A.", classes: "Table 7.2: the three classes of levers."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, f = clamp7(t, 0, 1);
    if(st.preset === "pulley"){
      var ly = 250 - 60 * f, ey = 150 + 60 * f;
      m += L.rect(300, 20, 120, 10, "#475569") + L.line(360, 30, 360, 60, "#94a3b8", 3) + L.circle(360, 60, 26, "#1e293b", ' stroke="#cbd5e1" stroke-width="3"');
      m += L.line(334, 60, 334, ly - 40, "#e2e8f0", 2) + L.line(386, 60, 386, ey, "#e2e8f0", 2) + L.rect(309, ly - 40, 50, 40, "#a16207", ' rx="4"') + L.text(334, ly - 15, "100 N", {size: 12, color: "#fff"});
      m += L.arrow(386, ey, 386, ey + 40, C.vel, 4) + L.text(396, ey + 30, "effort 100 N (pull down)", {size: 12, color: C.vel, anchor: "start"}) + L.arrow(300, ly - 20, 300, ly - 60, C.path, 3) + L.text(290, ly - 50, "load rises", {size: 12, color: C.path, anchor: "end"});
      L.svg(m, "Fixed pulley", 290);
      L.readout([["Load", "100 N"], ["Effort", "100 N", C.vel], ["MA = load ÷ effort", "100 ÷ 100 = 1"], ["Rope pulled / load raised", L.num(f, 2) + " m / " + L.num(f, 2) + " m", C.path]]);
      msg = t < 1 ? "Pulling…" : "<b>Fixed pulley (Fig. 7.24):</b> <b>MA = 1</b>. The pulley only changes the direction of the effort: you pull down to lift the load up.";
    } else if(st.preset === "ramp"){
      var A = [200, 60], B = [200, 240], Cc = [440, 240], px = Cc[0] + f * (A[0] - Cc[0]), py = Cc[1] + f * (A[1] - Cc[1]);
      m += '<polygon points="' + A.join(',') + ' ' + B.join(',') + ' ' + Cc.join(',') + '" fill="#a8a29e"/>';
      m += '<g transform="translate(' + (px + 0.6 * 14) + ' ' + (py - 0.8 * 14) + ') rotate(36.87)">' + L.rect(-20, -14, 40, 28, "#a16207", ' rx="3"') + '</g>';
      m += L.text(168, 70, "A", {size: 14, color: C.text, weight: 700, anchor: "end"}) + L.text(188, 252, "B", {size: 14, color: C.text, weight: 700, anchor: "end"}) + L.text(452, 252, "C", {size: 14, color: C.text, weight: 700, anchor: "start"});
      m += L.text(176, 155, "30 cm", {size: 13, color: C.text, anchor: "end"}) + L.text(320, 264, "40 cm", {size: 13, color: C.text}) + L.text(350, 130, "50 cm", {size: 13, color: C.text, anchor: "start"});
      L.svg(m, "Ramp over a step", 280);
      L.readout([["Height h = AB", "30 cm"], ["Ramp length L = AC", "√(30² + 40²) = 50 cm"], ["MA = L ÷ h", "50 ÷ 30 = 1.67", C.ok], ["Effort for a 60 N load", "60 × 30 ÷ 50 = 36 N", C.vel]]);
      msg = t < 1 ? "Pushing up the ramp…" : "<b>Example 7.12:</b> MA = 50 cm ÷ 30 cm = <b>1.67</b>. The work is the same either way: 36 N × 0.5 m = 60 N × 0.3 m = 18 J.";
    } else if(st.preset === "plank"){
      [[40, 1.0, C.vel, "1.0 m plank: effort 3 N"], [330, 1.5, C.path, "1.5 m plank: effort 2 N"]].forEach(function(r){
        var base = Math.sqrt(r[1] * r[1] - 0.25) * 200, ang = Math.atan2(100, base), x0 = r[0], x1 = x0 + base, cx = x0 + f * base, cy = 250 - f * 100;
        m += L.rect(x1, 150, 40, 100, "#78716c") + L.line(x0, 250, x1, 150, "#d6a86b", 6);
        m += '<g transform="translate(' + (cx - Math.sin(ang) * 12) + ' ' + (cy - Math.cos(ang) * 12) + ') rotate(' + (-ang * 180 / Math.PI).toFixed(2) + ')">' + L.rect(-18, -10, 36, 20, r[2], ' rx="3"') + '</g>';
        m += L.text(x0 + base / 2 + 20, 282, r[3], {size: 13, color: r[2]});
      });
      m += L.line(20, 250, 700, 250, C.faint, 2);
      L.svg(m, "Two planks", 300);
      L.readout([["Cart weight", "6 N, raised 0.5 m"], ["1.0 m plank", "6 × 0.5 ÷ 1.0 = 3 N", C.vel], ["1.5 m plank", "6 × 0.5 ÷ 1.5 = 2 N", C.path], ["Work in each case", "3 N × 1.0 m = 2 N × 1.5 m = 3 J"]]);
      msg = t < 1 ? "Pulling the carts…" : "<b>Activity 7.3:</b> the less steep, longer plank needs a <b>smaller force</b> (2 N instead of 3 N) over a longer distance; the work done, 3 J, is the same.";
    } else if(st.preset === "beam"){
      var idx = clamp7(Math.floor(t + 1e-9), 0, 3), n2 = [1, 2, 4, 8][idx], L2 = 20 / n2, xr = 360 + 10 * L2;
      m += L.line(360, 20, 360, 90, "#cbd5e1", 2) + L.rect(150, 86, 420, 8, "#d6a86b", ' rx="3"') + '<polygon points="360,86 352,76 368,76" fill="' + C.ok + '"/>';
      [[160, 1, C.vel], [xr, n2, C.path]].forEach(function(p){
        m += L.line(p[0], 94, p[0], 170, "#94a3b8", 1) + '<polygon points="' + (p[0] - 26) + ',170 ' + (p[0] + 26) + ',170 ' + (p[0] + 18) + ',196 ' + (p[0] - 18) + ',196" fill="' + p[2] + '"/>';
        for(var i = 0; i < p[1]; i++) m += L.circle(p[0] - 14 + (i % 4) * 9, 164 - Math.floor(i / 4) * 9, 4, "#fbbf24");
      });
      m += L.text(160, 222, "1 coin at 20 cm", {size: 13, color: C.vel}) + L.text(Math.max(xr, 430), 222, n2 + (n2 > 1 ? " coins" : " coin") + " at " + L2 + " cm", {size: 13, color: C.path});
      L.svg(m, "Beam balance", 250);
      var rows = [["n₁ × L₁", "1 × 20 = 20", C.vel]];
      for(var k = 0; k <= idx; k++){ var nn = [1, 2, 4, 8][k]; rows.push(["Row " + (k + 1) + ": n₂ × L₂", nn + " × " + (20 / nn) + " = 20", C.path]); }
      L.readout(rows);
      msg = t < 3 ? "Adding coins…" : "<b>Activity 7.5:</b> 1, 2, 4 and 8 coins balanced at 20, 10, 5 and 2.5 cm: the beam balances when <b>n₁ × L₁ = n₂ × L₂</b>.";
    } else if(st.preset === "seesaw"){
      var pos = t < 1 ? 2 : 2 - clamp7((t - 1) / 0.3, 0, 1), ang = t < 1 ? 8 * Math.min(1, t * 3) : 8 * Math.max(0, 1 - (t - 1) * 2), tilts = Math.abs(30 * pos - 30) > 0.01;
      m += '<polygon points="360,184 336,240 384,240" fill="' + C.ok + '"/>' + L.line(20, 240, 700, 240, C.faint, 2);
      m += '<g transform="rotate(' + ang.toFixed(2) + ' 360 180)">' + L.rect(120, 174, 480, 10, "#d6a86b", ' rx="3"');
      [["A", -2], ["B", -1], ["D", 1], ["E", 2]].forEach(function(s){ m += L.text(360 + s[1] * 100, 202, s[0], {size: 13, color: C.text, weight: 700}); });
      m += L.circle(160, 160, 12, C.vel) + L.circle(360 + pos * 100, 156, 16, C.path) + '</g>';
      m += L.text(160, 120, "15 kg", {size: 13, color: C.vel}) + L.text(360 + pos * 100, 116, "30 kg", {size: 13, color: C.path}) + L.text(360, 262, "C (fulcrum)", {size: 12, color: C.muted});
      L.svg(m, "Seesaw", 280);
      L.readout([["Left: 15 kg at A", "15 × 2 = 30 kg m", C.vel], ["Right: 30 kg at " + (pos > 1.5 ? "E" : pos <= 1 ? "D" : "…"), "30 × " + L.num(pos, 1) + " = " + L.num(30 * pos, 0) + " kg m", C.path], ["Seesaw", tilts ? "tilts" : "balanced"]]);
      msg = t < 2 ? "Finding the balance…" : "<b>Example 7.13:</b> 15 kg × 2 m = 30 kg × 1 m, so the 30 kg child sits at <b>seat D</b>. (Exercise Q9: an adult twice as heavy as a child balances at half the child's distance.)";
    } else {
      var rowsC = [["Class I: fulcrum in between", "scissors, crowbar, pliers, seesaw", ["E", "F", "L"]], ["Class II: load in between", "lemon squeezer, wheelbarrow, bottle opener", ["F", "L", "E"]], ["Class III: effort in between", "tweezers, broom, hammer, oar", ["F", "E", "L"]]];
      rowsC.forEach(function(r, k){
        if(t < k - 1e-9) return;
        var y = 70 + k * 90;
        m += L.rect(40, y - 5, 320, 8, "#d6a86b", ' rx="3"');
        r[2].forEach(function(p, i){
          var x = 50 + i * 150;
          if(p === "F") m += '<polygon points="' + x + ',' + (y + 3) + ' ' + (x - 12) + ',' + (y + 25) + ' ' + (x + 12) + ',' + (y + 25) + '" fill="' + C.ok + '"/>';
          else if(p === "L") m += L.rect(x - 16, y - 33, 32, 28, C.path, ' rx="3"');
          else m += L.arrow(x, y - 45, x, y - 8, C.vel, 4);
        });
        m += L.text(390, y - 4, r[0], {size: 14, color: C.text, weight: 700, anchor: "start"}) + L.text(390, y + 16, r[1], {size: 12, color: C.muted, anchor: "start"});
      });
      L.svg(m, "Classes of levers", 290);
      L.readout([["Class I", "fulcrum in between", C.ok], ["Class II", t >= 1 ? "load in between" : "…", C.path], ["Class III", t >= 2 ? "effort in between" : "…", C.vel]]);
      msg = t < 2 ? "Showing the classes…" : "<b>Table 7.2:</b> Class I: fulcrum in between; Class II: load in between; Class III: <b>effort in between</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["pulley", "Fixed pulley"], ["ramp", "Example 7.12: ramp"], ["plank", "Activity 7.3: planks"], ["beam", "Activity 7.5: beam balance"], ["seesaw", "Example 7.13: seesaw"], ["classes", "Table 7.2: lever classes"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.machines = {mount: mount, draw: draw, select: select, state: st};
})();
