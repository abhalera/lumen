// Class 9 Science, Chapter 1 (iesc101) — simulation labs.
// Textbook numbers are used where the chapter gives them; other values are labelled as typical or illustrative.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

// -------------------------------------------------------------------------
// Lab 1 — Model builder: will the ball clear the boundary? (Example 1.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var BOUNDARY = 65;                       // metres (a typical boundary distance; illustrative)
  var K_DRAG = 0.0069;                     // per metre: ½ρC_dA/m for a cricket ball (approximate)
  var st = {preset: "simple", speed: 30, angle: 38, air: false, colour: "red"};

  function fly(speed, angle, air){
    var th = angle * Math.PI / 180, x = 0, y = 1, vx = speed * Math.cos(th), vy = speed * Math.sin(th), t = 0, dt = 0.005;
    var pts = [[0, x, y]];
    while(y >= 0 && t < 20){
      var v = Math.sqrt(vx * vx + vy * vy), k = air ? K_DRAG * v : 0;
      vx += -k * vx * dt;
      vy += (-9.8 - k * vy) * dt;
      x += vx * dt; y += vy * dt; t += dt;
      if(Math.round(t / dt) % 4 === 0) pts.push([t, x, Math.max(0, y)]);
    }
    pts.push([t, x, 0]);
    return {pts: pts, T: t, range: x, top: pts.reduce(function(m, p){ return Math.max(m, p[2]); }, 0)};
  }
  function at(tr, t){
    var p = tr.pts;
    if(t >= tr.T) return p[p.length - 1];
    for(var i = 1; i < p.length; i++) if(p[i][0] >= t){
      var a = p[i - 1], b = p[i], f = (t - a[0]) / (b[0] - a[0]);
      return [t, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    }
    return p[p.length - 1];
  }

  function select(id){
    st.preset = id;
    st.speed = 30; st.angle = 38;
    st.air = id === "air";
    st.colour = id === "colour" ? "white" : "red";
    L.markPreset(id);
    var w = {
      simple: "Example 1.1's simple model: only the ball's speed and direction (and gravity) are included.",
      air: "A more complex model adds air resistance. The dashed line is the simple model for comparison.",
      colour: "Same hit, but the ball is white. Does the colour change the flight? Compare with the dashed simple model."
    };
    L.watch(w[id]);
    render();
  }

  function render(){
    var tr = fly(st.speed, st.angle, st.air);
    L.timeline({maxT: tr.T, step: 0.25, speed: 0.6});
    L.legend([[C.path, "path in this model"], [C.faint, "simple model (no air resistance)"], [C.danger, "boundary (65 m, illustrative)"]]);
    L.controls(
      L.slider("m1-speed", "Hit speed", 20, 40, 1, st.speed, st.speed + " m s⁻¹") +
      L.slider("m1-angle", "Launch angle", 15, 55, 1, st.angle, st.angle + "°") +
      '<label class="control-item control-check"><input type="checkbox" id="m1-air"' + (st.air ? " checked" : "") + '> Include air resistance</label>' +
      '<label class="control-item control-check">Ball colour <select class="control-select" id="m1-colour"><option value="red"' + (st.colour === "red" ? " selected" : "") + '>red</option><option value="white"' + (st.colour === "white" ? " selected" : "") + '>white</option></select></label>'
    );
    function changed(){ st.preset = "custom"; L.markPreset("custom"); render(); }
    L.onInput("m1-speed", function(v){ st.speed = v; changed(); });
    L.onInput("m1-angle", function(v){ st.angle = v; changed(); });
    var air = L.$("m1-air"); if(air) air.addEventListener("change", function(e){ st.air = e.target.checked; changed(); });
    var col = L.$("m1-colour"); if(col) col.addEventListener("change", function(e){ st.colour = e.target.value; changed(); });
    L.restart(true);
  }

  function draw(t){
    var tr = fly(st.speed, st.angle, st.air), simple = fly(st.speed, st.angle, false);
    var span = Math.max(simple.range, BOUNDARY) + 8, hmax = Math.max(simple.top, 5) + 3;
    var s = Math.min(620 / span, 210 / hmax);
    var X = function(x){ return 50 + x * s; }, Y = function(y){ return 262 - y * s; };
    var m = L.rect(0, 262, 720, 38, "#14532d");
    for(var d = 0; d <= span; d += 10) m += L.line(X(d), 262, X(d), 270, "#86efac", 1.5) + L.text(X(d), 288, d + " m", {size: 12, color: "#bbf7d0"});
    m += L.line(X(BOUNDARY), 262, X(BOUNDARY), 200, C.danger, 4) + L.text(X(BOUNDARY), 192, "boundary", {size: 13, color: C.danger, weight: 700});
    m += '<polyline fill="none" stroke="' + C.faint + '" stroke-width="2" stroke-dasharray="6 5" points="' + simple.pts.map(function(p){ return X(p[1]) + "," + Y(p[2]); }).join(" ") + '"/>';
    var now = at(tr, t);
    var done = tr.pts.filter(function(p){ return p[0] <= t; }).concat([now]);
    m += '<polyline fill="none" stroke="' + C.path + '" stroke-width="3.5" points="' + done.map(function(p){ return X(p[1]) + "," + Y(p[2]); }).join(" ") + '"/>';
    m += L.circle(X(now[1]), Y(now[2]), 7, st.colour === "white" ? "#f8fafc" : "#dc2626", ' stroke="#fff" stroke-width="1.5"');
    m += L.text(40, 30, "batter", {size: 12, color: C.muted, anchor: "start"}) + L.line(50, 262, 50, 236, "#f8fafc", 3);
    L.svg(m, "Cricket ball at " + L.num(now[1], 1) + " m along and " + L.num(now[2], 1) + " m high.", 300);

    var landed = t >= tr.T - 1e-6, clears = tr.range > BOUNDARY;
    L.readout([
      ["Time in air", L.num(Math.min(t, tr.T), 2) + " s"],
      ["Distance along the ground", L.num(now[1], 1) + " m", C.path],
      ["Height", L.num(now[2], 1) + " m"],
      ["Landing point (this model)", landed ? L.num(tr.range, 1) + " m" : "…"],
      ["Clears the boundary?", landed ? (clears ? "yes, a six" : "no") : "…", clears ? C.ok : C.danger]
    ]);
    var diff = simple.range - tr.range, msg;
    if(t <= 0) msg = "Press <b>Play</b> to hit the ball.";
    else if(!landed) msg = "Ball in the air…";
    else if(st.preset === "simple") msg = "<b>Example 1.1 simple model:</b> using only speed, direction and gravity, the ball lands at " + L.num(tr.range, 0) + " m, so it " + (clears ? "clears" : "does not clear") + " the 65 m boundary. Brand, colour and grass were left out because they cannot change this answer.";
    else if(st.preset === "colour") msg = "<b>Same landing point</b> (" + L.num(tr.range, 0) + " m) as the red ball: colour does not change the forces on the ball, so a model is right to ignore it.";
    else if(st.air) msg = "<b>With air resistance</b> the ball lands at " + L.num(tr.range, 0) + " m instead of " + L.num(simple.range, 0) + " m. " + (clears === (simple.range > BOUNDARY) ? "The answer to ‘six or not?’ is the same, so the simple model was good enough for this question." : "Here the extra detail <b>changes the answer</b>: near the boundary, a more complex model is needed.");
    else msg = "Simple model: lands at " + L.num(tr.range, 0) + " m. Try switching air resistance on, or a hit that lands near the boundary.";
    if(landed && st.preset === "custom" && Math.abs(diff) < 0.01 && st.colour === "white") msg += " The colour change made no difference.";
    L.verdict(msg);
  }

  function mount(){
    L.presets([["simple", "Example 1.1: simple model"], ["air", "Add air resistance"], ["colour", "Change the ball's colour"]], st.preset, select);
    select(["simple", "air", "colour"].indexOf(st.preset) >= 0 ? st.preset : "simple");
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.modelShot = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Unit mix-up: fuelling an aircraft (Ready to Go Beyond)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var NEED = 22300;          // kg, from the textbook
  var TRUE_DENSITY = 0.80;   // kg per litre, typical jet fuel (not from the textbook)
  var st = {preset: "correct", used: 0.80};

  function select(id){
    st.preset = id;
    st.used = id === "mixup" ? 1.77 : 0.80;
    L.markPreset(id);
    L.watch(id === "mixup"
      ? "The crew uses 1.77 per litre, a figure in <b>pounds</b> per litre, as if it were kilograms per litre. Watch how much real mass ends up in the tank."
      : "The crew uses the correct density, 0.80 kg per litre (a typical value for jet fuel). The pump stops when the calculated number of litres is loaded.");
    renderControls();
    L.timeline({maxT: 10, step: 1, speed: 1});
    L.legend([["#38bdf8", "fuel actually loaded (real mass)"], [C.ok, "mass needed: 22,300 kg"]]);
    L.restart(true);
  }

  function renderControls(){
    L.controls(L.slider("u2-dens", "Density figure the crew uses (per litre)", 0.5, 2.0, 0.01, st.used, L.num(st.used, 2)));
    L.onInput("u2-dens", function(v){ st.used = v; st.preset = "custom"; L.markPreset("custom"); L.setVal("u2-dens", L.num(v, 2)); App.resetTimeline(); App.play(); });
  }

  function draw(t){
    var litresPlanned = NEED / st.used, f = Math.min(1, t / 10);
    var litres = litresPlanned * f, mass = litres * TRUE_DENSITY;
    var litresNeeded = NEED / TRUE_DENSITY;
    var m = "";
    // Aircraft outline
    m += '<path d="M60 150 L520 140 Q600 140 640 150 Q600 160 520 160 L60 150 Z" fill="#1e293b" stroke="#64748b" stroke-width="2"/>';
    m += '<path d="M300 148 L360 70 L400 70 L380 148 Z M300 152 L360 230 L400 230 L380 152 Z M90 150 L60 105 L90 105 L130 148 Z" fill="#1e293b" stroke="#64748b" stroke-width="2"/>';
    // Fuel gauge in real mass
    var gx = 80, gy = 262, gw = 560, gh = 22, scale = gw / (NEED * 1.25);
    m += L.rect(gx, gy, gw, gh, "#1e293b", ' rx="4"') + L.rect(gx, gy, mass * scale, gh, "#38bdf8", ' rx="4"');
    m += L.line(gx + NEED * scale, gy - 10, gx + NEED * scale, gy + gh + 6, C.ok, 3) + L.text(gx + NEED * scale, gy - 14, "22,300 kg needed", {size: 13, color: C.ok, weight: 700});
    m += L.text(gx, gy - 14, "real mass in tank", {size: 13, color: C.muted, anchor: "start"});
    m += L.text(360, 40, "litres to load = 22,300 ÷ " + L.num(st.used, 2) + " = " + Math.round(litresPlanned).toLocaleString("en-IN") + " L", {size: 16, color: C.text, weight: 700});
    L.svg(m, "Fuel loaded " + Math.round(litres) + " litres, real mass " + Math.round(mass) + " kilograms.", 300);

    var shortKg = NEED - litresPlanned * TRUE_DENSITY, shortL = litresNeeded - litresPlanned;
    L.readout([
      ["Litres loaded", Math.round(litres).toLocaleString("en-IN") + " L", "#38bdf8"],
      ["Real mass (at 0.80 kg per L)", Math.round(mass).toLocaleString("en-IN") + " kg"],
      ["Litres actually needed", Math.round(litresNeeded).toLocaleString("en-IN") + " L", C.ok],
      ["Shortfall when full", f < 1 ? "…" : (Math.abs(shortL) < 50 ? "none" : (shortL > 0 ? Math.round(shortL).toLocaleString("en-IN") + " L short" : Math.round(-shortL).toLocaleString("en-IN") + " L extra")), shortL > 50 ? C.danger : C.text]
    ]);
    var msg;
    if(t <= 0) msg = "Press <b>Play</b> to start the pump.";
    else if(f < 1) msg = "Pumping… the pump counts litres, but the aircraft needs a certain <b>mass</b> of fuel.";
    else if(st.preset === "correct" || Math.abs(st.used - TRUE_DENSITY) < 0.005) msg = "<b>Correct units:</b> 22,300 kg ÷ 0.80 kg/L ≈ <b>27,875 L</b>, which really is 22,300 kg of fuel.";
    else if(st.preset === "mixup") msg = "<b>The mix-up:</b> 22,300 ÷ 1.77 ≈ 12,599 L was loaded. That is only about " + Math.round(litresPlanned * TRUE_DENSITY).toLocaleString("en-IN") + " kg of fuel, about <b>" + Math.round(shortL / 100) * 100 + " litres short</b>, matching the textbook's ‘about 15,000 litres short’. The arithmetic was right; the unit was wrong.";
    else msg = shortKg > 0 ? "With this figure the tank holds " + Math.round(litresPlanned * TRUE_DENSITY).toLocaleString("en-IN") + " kg, short of 22,300 kg." : "With this figure the tank holds more than needed (" + Math.round(litresPlanned * TRUE_DENSITY).toLocaleString("en-IN") + " kg).";
    L.verdict(msg);
  }

  function mount(){
    L.presets([["correct", "Correct: kg per litre"], ["mixup", "The mix-up: pounds per litre"]], st.preset, select);
    select(st.preset === "mixup" ? "mixup" : "correct");
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.unitsFuel = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Why forecasts drift: tiny differences grow (toy model)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var DAYS = 30;
  var CFG = {
    chaotic: {r: 3.9, a: 0.500, b: 0.501, label: "differ by 0.001"},
    better: {r: 3.9, a: 0.500, b: 0.50001, label: "differ by 0.00001 (100 times closer)"},
    stable: {r: 2.8, a: 0.500, b: 0.501, label: "differ by 0.001, calm system"}
  };
  var st = {preset: "chaotic"};

  function series(r, x0){ var s = [x0]; for(var i = 1; i <= DAYS; i++) s.push(r * s[i - 1] * (1 - s[i - 1])); return s; }
  function splitDay(A, B){ for(var i = 0; i <= DAYS; i++) if(Math.abs(A[i] - B[i]) > 0.2) return i; return -1; }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: DAYS, step: 1, speed: 3, format: function(t){ return "day <b>" + Math.floor(t + 1e-9) + "</b>"; }});
    L.legend([[C.vel, "forecast A"], [C.path, "forecast B"]]);
    var w = {
      chaotic: "A toy ‘weather’ model (not a real forecast). The two starting values differ by only 0.001.",
      better: "Measure the starting conditions 100 times more precisely. Do the forecasts now agree for ever?",
      stable: "The same toy model with a calmer setting. Here small differences die away."
    };
    L.watch(w[id]);
    L.controls("");
    L.restart(true);
  }

  function draw(t){
    var c = CFG[st.preset], A = series(c.r, c.a), B = series(c.r, c.b), n = Math.floor(t + 1e-9);
    var g = L.graph({x0: 70, y0: 250, w: 600, h: 200, tmax: DAYS, vmin: 0, vmax: 1, tStep: 5, vStep: 0.25, tLabel: "day", vLabel: "forecast value (toy units)", vFmt: function(v){ return L.num(v, 2); }});
    var m = g.svg;
    function pl(S, col){ return '<polyline fill="none" stroke="' + col + '" stroke-width="3" points="' + S.slice(0, n + 1).map(function(v, i){ return g.X(i) + "," + g.Y(v); }).join(" ") + '"/>'; }
    m += pl(A, C.vel) + pl(B, C.path);
    m += L.circle(g.X(n), g.Y(A[n]), 5, C.vel) + L.circle(g.X(n), g.Y(B[n]), 5, C.path);
    L.svg(m, "Day " + n + ": forecast A " + L.num(A[n], 3) + ", forecast B " + L.num(B[n], 3) + ".", 290);
    var gap = Math.abs(A[n] - B[n]), start = Math.abs(c.a - c.b), split = splitDay(A, B);
    L.readout([
      ["Day", String(n)],
      ["Forecast A", L.num(A[n], 4), C.vel],
      ["Forecast B", L.num(B[n], 4), C.path],
      ["Gap", L.num(gap, 5)],
      ["Gap compared with day 0", gap >= start ? "×" + L.num(gap / start, 0) + " larger" : "smaller"]
    ]);
    var msg;
    if(t <= 0) msg = "Press <b>Play</b>. The two forecasts start almost identical (" + c.label + ").";
    else if(n < DAYS) msg = "Day " + n + ": the gap is " + L.num(gap, 5) + ".";
    else if(st.preset === "stable") msg = "<b>Calm system:</b> the tiny starting difference shrinks and both forecasts settle to the same value. Not every system is so sensitive.";
    else if(st.preset === "better") msg = "<b>Better measurements help, but only for a while:</b> starting 100 times closer, the forecasts still separate, now around day " + split + " instead of earlier. That is why forecasts are reliable for a few days but less certain further ahead.";
    else msg = "<b>Tiny differences grow:</b> by about day " + split + " the two forecasts disagree completely, even though they started only 0.001 apart. This toy model shows why weather forecasts become less certain further into the future.";
    L.verdict(msg);
  }

  function mount(){
    L.presets([["chaotic", "Tiny difference, weather-like"], ["better", "Measure 100× more precisely"], ["stable", "A calm system"]], st.preset, select);
    select(st.preset);
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.forecast = {mount: mount, draw: draw, select: select, state: st, series: series};
})();

// -------------------------------------------------------------------------
// Lab 4 — Estimation: air, balloons and rice (Example 1.3, Ready to Go Beyond)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "breaths", bpm: 14, vol: 0.5, balloonsPerMin: 3, balloonL: 2, people: 4, kcal: 2250, riceKcal: 350};

  function total(){
    if(st.preset === "breaths") return {value: st.bpm * 1440 * st.vol, unit: "litres", per: "day"};
    if(st.preset === "balloons") return {value: st.balloonsPerMin * st.balloonL * 1440, unit: "litres", per: "day"};
    return {value: st.people * st.kcal * 30 / (st.riceKcal / 100) / 1000, unit: "kg of rice", per: "month"};
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    var rice = id === "rice";
    L.timeline({maxT: rice ? 30 : 24, step: rice ? 1 : 2, speed: rice ? 3 : 2, format: function(t){ return rice ? "day <b>" + L.num(t, 1) + "</b>" : "<b>" + L.num(t, 1) + " h</b> of 24"; }});
    L.legend([[C.path, "estimate so far"], [C.vel, "order of magnitude (each rung ×10)"]]);
    if(id === "breaths"){
      L.watch("Example 1.3, method 1: breaths per minute × volume per breath × 1440 minutes.");
      L.controls(L.slider("e4-bpm", "Breaths per minute", 10, 20, 1, st.bpm, st.bpm + "") + L.slider("e4-vol", "Litres per breath", 0.3, 0.8, 0.1, st.vol, L.num(st.vol, 1) + " L"));
      L.onInput("e4-bpm", function(v){ st.bpm = v; L.setVal("e4-bpm", v + ""); App.resetTimeline(); });
      L.onInput("e4-vol", function(v){ st.vol = v; L.setVal("e4-vol", L.num(v, 1) + " L"); App.resetTimeline(); });
    } else if(id === "balloons"){
      L.watch("Example 1.3, the check: how many 2-litre balloons could you fill in a minute, all day long?");
      L.controls(L.slider("e4-bal", "Balloons per minute", 1, 5, 1, st.balloonsPerMin, st.balloonsPerMin + "") + L.slider("e4-bl", "Litres per balloon", 1, 3, 0.5, st.balloonL, L.num(st.balloonL, 1) + " L"));
      L.onInput("e4-bal", function(v){ st.balloonsPerMin = v; L.setVal("e4-bal", v + ""); App.resetTimeline(); });
      L.onInput("e4-bl", function(v){ st.balloonL = v; L.setVal("e4-bl", L.num(v, 1) + " L"); App.resetTimeline(); });
    } else {
      L.watch("Ready to Go Beyond: rice for a family for a month, if all their energy came from rice. Check the kcal figure on a real rice packet.");
      L.controls(L.slider("e4-ppl", "People", 1, 8, 1, st.people, st.people + "") + L.slider("e4-kcal", "kcal per person per day", 2000, 2500, 50, st.kcal, st.kcal + " kcal") +
        L.slider("e4-rice", "kcal in 100 g uncooked rice (typical ≈ 350)", 330, 370, 5, st.riceKcal, st.riceKcal + " kcal"));
      L.onInput("e4-ppl", function(v){ st.people = v; L.setVal("e4-ppl", v + ""); App.resetTimeline(); });
      L.onInput("e4-kcal", function(v){ st.kcal = v; L.setVal("e4-kcal", v + " kcal"); App.resetTimeline(); });
      L.onInput("e4-rice", function(v){ st.riceKcal = v; L.setVal("e4-rice", v + " kcal"); App.resetTimeline(); });
    }
    L.restart(true);
  }

  function draw(t){
    var tot = total(), rice = st.preset === "rice", frac = Math.min(1, t / (rice ? 30 : 24)), sofar = tot.value * frac;
    var m = "";
    // Jar filling
    m += L.rect(90, 50, 150, 210, "#1e293b", ' rx="10" stroke="#64748b" stroke-width="2"') + L.rect(92, 258 - 206 * frac, 146, 206 * frac, rice ? "#fde68a" : "rgba(56,189,248,0.55)", ' rx="8"');
    m += L.text(165, 40, rice ? "rice needed so far" : "air breathed so far", {size: 13, color: C.muted});
    m += L.text(165, 160, Math.round(sofar).toLocaleString("en-IN"), {size: 22, color: "#f8fafc", weight: 700});
    m += L.text(165, 184, tot.unit, {size: 13, color: C.text});
    // Order-of-magnitude ladder
    var lo = rice ? -1 : 1, hi = rice ? 4 : 6;
    var Y = function(v){ return 262 - (Math.log10(Math.max(v, Math.pow(10, lo))) - lo) / (hi - lo) * 220; };
    m += L.line(420, Y(Math.pow(10, lo)), 420, Y(Math.pow(10, hi)), C.muted, 2);
    for(var e = lo; e <= hi; e++){
      var v = Math.pow(10, e), lab = v >= 1 ? v.toLocaleString("en-IN") : String(v);
      m += L.line(410, Y(v), 430, Y(v), C.vel, 2) + L.text(440, Y(v) + 5, lab + " " + (rice ? "kg" : "L"), {size: 13, color: C.vel, anchor: "start"});
    }
    m += L.arrow(380, Y(tot.value), 408, Y(tot.value), C.path, 4) + L.text(372, Y(tot.value) + 5, "full " + tot.per, {size: 13, color: C.path, anchor: "end", weight: 700});
    m += L.text(560, 60, rice ? "100 g: far too little" : "100 L: far too little", {size: 12, color: C.muted, anchor: "start"});
    m += L.text(560, 80, rice ? "a few tonnes: far too much" : "1,000,000 L: far too much", {size: 12, color: C.muted, anchor: "start"});
    L.svg(m, "Estimate so far " + Math.round(sofar) + " " + tot.unit + "; full " + tot.per + " estimate " + Math.round(tot.value) + ".", 290);

    var cells;
    if(st.preset === "breaths") cells = [["Breaths so far", Math.round(st.bpm * 60 * 24 * frac).toLocaleString("en-IN")], ["Litres so far", Math.round(sofar).toLocaleString("en-IN") + " L", C.path], ["Estimate for a day", st.bpm + " × " + L.num(st.vol, 1) + " × 1440 = " + Math.round(tot.value).toLocaleString("en-IN") + " L"]];
    else if(st.preset === "balloons") cells = [["Balloons so far", Math.round(st.balloonsPerMin * 1440 * frac).toLocaleString("en-IN")], ["Litres so far", Math.round(sofar).toLocaleString("en-IN") + " L", C.path], ["Estimate for a day", st.balloonsPerMin + " × " + L.num(st.balloonL, 1) + " × 1440 = " + Math.round(tot.value).toLocaleString("en-IN") + " L"]];
    else cells = [["Rice per day", L.num(tot.value / 30, 1) + " kg"], ["Rice so far", L.num(sofar, 1) + " kg", C.path], ["Estimate for 30 days", Math.round(tot.value) + " kg"]];
    L.readout(cells);

    var msg;
    if(t <= 0) msg = "Press <b>Play</b>. Before it runs, guess the rung of the ladder where the answer will land.";
    else if(frac < 1) msg = "Adding up…";
    else if(st.preset === "breaths") msg = "<b>Example 1.3:</b> about " + Math.round(tot.value).toLocaleString("en-IN") + " litres a day" + (st.bpm === 14 && st.vol === 0.5 ? " (the textbook rounds this to about 10,000 litres)" : "") + ". It sits on the 10,000 L rung: sensible.";
    else if(st.preset === "balloons") msg = "<b>Balloon check:</b> " + Math.round(tot.value).toLocaleString("en-IN") + " litres" + (st.balloonsPerMin === 3 && st.balloonL === 2 ? ", the textbook's 8640 litres" : "") + ". Two different methods land on the same rung, so we can trust the estimate.";
    else msg = "<b>Rice estimate:</b> about " + Math.round(tot.value) + " kg for a month. Between 100 g (far too little) and a few tonnes (far too much): a sensible answer. This is an estimate that assumes all energy comes from rice.";
    L.verdict(msg);
  }

  function mount(){
    L.presets([["breaths", "Example 1.3: breaths"], ["balloons", "Example 1.3: balloon check"], ["rice", "Rice for a month"]], st.preset, select);
    select(st.preset);
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.estimate = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Connection map: one object, many branches (Pause and Ponder 3, masks)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var BRANCHES = [["Physics", "#38bdf8"], ["Chemistry", "#f59e0b"], ["Biology", "#34d399"], ["Earth science", "#a78bfa"], ["Mathematics", "#f472b6"]];
  var MAPS = {
    mask: {name: "Face mask", note: "From the textbook (Fig. 1.4)", ideas: [
      ["particle motion", "electrostatic attraction"], ["polymer fibres"], ["size and behaviour", "of viruses"], null, ["modelling airflow", "filtration efficiency"]]},
    cooker: {name: "Pressure cooker", note: "Pause and Ponder 3", ideas: [
      ["trapped steam raises pressure", "higher boiling point"], ["chemical changes", "in food while cooking"], ["softer food is", "easier to digest"], ["low air pressure in hills:", "water boils below 100 °C"], ["timing the whistles"]]},
    traffic: {name: "Traffic jam near school", note: "Pause and Ponder 3", ideas: [
      ["motion, braking", "stopping distance"], ["burning fuel,", "exhaust gases"], ["polluted air and", "our lungs"], ["local air quality"], ["traffic flow rate,", "signal timing"]]},
    phone: {name: "Mobile phone", note: "Pause and Ponder 3", ideas: [
      ["electric circuits,", "radio waves"], ["battery reactions"], null, ["minerals mined", "for its parts"], ["coding data", "into signals"]]}
  };
  var st = {preset: "mask"};

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 5, step: 1, speed: 1, format: function(t){ return "branch <b>" + Math.min(5, Math.floor(t + 1e-9)) + "</b> of 5"; }});
    L.legend(BRANCHES.map(function(b){ return [b[1], b[0]]; }));
    L.watch("Each second one branch of science is checked: does it help explain the " + MAPS[id].name.toLowerCase() + "? (" + MAPS[id].note + ")");
    L.controls("");
    L.restart(true);
  }

  function draw(t){
    var map = MAPS[st.preset], shown = Math.floor(t + 1e-9), cx = 360, cy = 160, m = "", used = [];
    m += L.circle(cx, cy, 62, "#1e293b", ' stroke="#f8fafc" stroke-width="2"') + L.text(cx, cy + 5, map.name, {size: 15, weight: 700, color: "#f8fafc"});
    BRANCHES.forEach(function(b, i){
      var ang = -Math.PI / 2 + i * 2 * Math.PI / 5, bx = cx + Math.cos(ang) * 235, by = cy + Math.sin(ang) * 118;
      var idea = map.ideas[i], on = i < shown;
      if(on && idea) used.push(b[0]);
      var col = on ? (idea ? b[1] : "#475569") : "#334155";
      m += L.line(cx + Math.cos(ang) * 62, cy + Math.sin(ang) * 62, bx, by, col, on && idea ? 3 : 1.5, on && idea ? "" : "4 5");
      m += L.rect(bx - 92, by - 30, 184, 60, "#0f1c2b", ' rx="10" stroke="' + col + '" stroke-width="2"');
      m += L.text(bx, by - 11, b[0], {size: 14, weight: 700, color: on ? (idea ? b[1] : C.muted) : C.faint});
      if(on){
        var lines = idea || ["not needed here"];
        lines.forEach(function(s, k){ m += L.text(bx, by + 7 + k * 15, s, {size: 12, color: idea ? C.text : C.muted}); });
      }
    });
    L.svg(m, map.name + ": branches connected so far: " + (used.join(", ") || "none") + ".", 320);
    L.readout([["Branches checked", Math.min(5, shown) + " of 5"], ["Branches involved", String(used.length), C.path], ["Which", used.join(", ") || "—"]]);
    var total = map.ideas.filter(Boolean).length;
    L.verdict(t <= 0 ? "Press <b>Play</b> to check each branch in turn."
      : shown < 5 ? "Checking the branches…"
      : "<b>" + map.name + ":</b> " + total + " branches of science are needed" + (st.preset === "mask" ? " (physics, chemistry, biology and mathematics, as the textbook says)" : "") + ". The branches organise our knowledge, but a real object or problem crosses all of them.");
  }

  function mount(){
    L.presets([["mask", "Face mask (Fig. 1.4)"], ["cooker", "Pressure cooker"], ["traffic", "Traffic jam"], ["phone", "Mobile phone"]], st.preset, select);
    select(st.preset);
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.branches = {mount: mount, draw: draw, select: select, state: st};
})();
