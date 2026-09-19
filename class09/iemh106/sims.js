// iemh106 labs: Measuring Space — Perimeter and Area.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function nM6(v, d){ var L = window.LAB; if(d !== undefined) return L.num(v, d); var a = Math.abs(v); if(Math.abs(a - Math.round(a)) < 1e-6) return L.num(v, 0); if(Math.abs(a * 10 - Math.round(a * 10)) < 1e-6) return L.num(v, 1); return L.num(v, 2); }
function clampM6(x, a, b){ return Math.max(a, Math.min(b, x)); }
var DEG6 = Math.PI / 180, PI7 = 22 / 7;
function viewM6(ox, oy, k){ return function(p){ return [ox + p[0] * k, oy - p[1] * k]; }; }
function ptsM6(P){ return P.map(function(p){ return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); }
function polyM6(P, fill, stroke, w){ return '<polygon points="' + ptsM6(P) + '" fill="' + fill + '" stroke="' + (stroke || "none") + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round"/>'; }
function plineM6(P, col, w, dash){ return '<polyline points="' + ptsM6(P) + '" fill="none" stroke="' + col + '" stroke-width="' + (w || 2) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linejoin="round"/>'; }
function pathM6(d, fill, col, w){ return '<path d="' + d + '" fill="' + (fill || "none") + '" stroke="' + (col || "none") + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round"/>'; }
function arcPtsM6(c, r, a0, a1, n){ var P = []; n = n || 48; for(var i = 0; i <= n; i++){ var a = (a0 + (a1 - a0) * i / n) * DEG6; P.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]); } return P; }
function areaM6(P){ var s = 0; for(var i = 0; i < P.length; i++){ var q = P[(i + 1) % P.length]; s += P[i][0] * q[1] - q[0] * P[i][1]; } return Math.abs(s) / 2; }
function sliderSetM6(L, st, defs){
  L.controls(defs.map(function(d){ return L.slider(d[0], d[1], d[2], d[3], d[4], st[d[5]], nM6(st[d[5]])); }).join(""));
  defs.forEach(function(d){ L.onInput(d[0], function(v){ st[d[5]] = v; L.setVal(d[0], nM6(v)); App.resetTimeline(); App.play(); }); });
}

// Lab 1 — Perimeter and π (§6.1–6.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "roll", d: 2};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend({roll: [[C.vel, "wheel"], [C.path, "unrolled circumference"]], archimedes: [[C.ok, "inscribed polygon"], [C.danger, "circumscribed polygon"]], madhava: [[C.path, "4 × partial sum"], [C.muted, "π"]], approx: [[C.path, "approximation"], [C.danger, "π"]]}[id]);
    L.watch({roll: "§6.2 Home measurement: roll a wheel once and compare the track it leaves with its diameter. Change the diameter.", archimedes: "Fig. 6.7: Archimedes trapped π between inscribed and circumscribed polygons, doubling the sides from 6 to 96.", madhava: "Mādhava’s series π/4 = 1 − 1/3 + 1/5 − 1/7 + … adds one term at a time.", approx: "Historical values of π on a magnified number line from 3.00 to 3.20."}[id]);
    if(id === "roll") sliderSetM6(L, st, [["m6d", "diameter d (units)", 1, 3, 0.5, "d"]]); else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var f = clampM6(t / 5, 0, 1), id = st.preset, m = "", msg;
    if(id === "roll"){
      var k = 50, r = st.d / 2 * k, dist = Math.PI * st.d * f * k, x0 = 70, gy = 230, cx = x0 + dist, cy = gy - r, ang = -Math.PI / 2 + dist / r;
      m += L.line(40, gy, 700, gy, C.faint, 2) + L.line(x0, gy, x0 + dist, gy, C.path, 5);
      m += L.circle(cx, cy, r, "rgba(56,189,248,0.12)", ' stroke="' + C.vel + '" stroke-width="3"') + L.line(cx - r * Math.cos(ang - Math.PI / 2), cy - r * Math.sin(ang - Math.PI / 2), cx + r * Math.cos(ang - Math.PI / 2), cy + r * Math.sin(ang - Math.PI / 2), C.muted, 1.5, "5 4");
      m += L.circle(cx + r * Math.cos(Math.PI / 2 + dist / r), cy + r * Math.sin(Math.PI / 2 + dist / r), 5, C.danger);
      m += L.text(x0, gy + 22, "start", {size: 12, color: C.muted, anchor: "middle"}) + L.text(360, 40, "d = " + nM6(st.d) + " units", {size: 15, color: C.text, anchor: "middle"});
      L.svg(m, "A wheel rolling out its circumference", 280);
      L.readout([["Diameter D", nM6(st.d) + " units", C.vel], ["Rolled so far", nM6(Math.PI * st.d * f, 2) + " units", C.path], ["Rolled ÷ D", nM6(Math.PI * f, 4)]]);
      msg = t < 5 ? "Rolling one full turn…" : "One turn leaves C = " + nM6(Math.PI * st.d, 3) + " units, and C ÷ D = 3.1416 for d = " + nM6(st.d) + ": <b>the C/D ratio is the same for every circle</b>.";
    } else if(id === "archimedes"){
      var ns = [6, 12, 24, 48, 96], n = ns[Math.min(4, Math.floor(f * 5 + 1e-9))], R = 110, c = [250, 150];
      var ins = [], out = [], Rc = R / Math.cos(Math.PI / n);
      for(var i = 0; i < n; i++){ var a = 2 * Math.PI * i / n + Math.PI / 2; ins.push([c[0] + R * Math.cos(a), c[1] - R * Math.sin(a)]); out.push([c[0] + Rc * Math.cos(a + Math.PI / n), c[1] - Rc * Math.sin(a + Math.PI / n)]); }
      m += polyM6(out, "rgba(248,113,113,0.08)", C.danger, 1.5) + L.circle(c[0], c[1], R, "none", ' stroke="' + C.text + '" stroke-width="2"') + polyM6(ins, "rgba(74,222,128,0.10)", C.ok, 1.5);
      var lo = n * Math.sin(Math.PI / n), hi = n * Math.tan(Math.PI / n);
      m += L.text(420, 90, n + " sides", {size: 22, color: C.text, weight: 700, anchor: "start"}) + L.text(420, 130, "π is between " + nM6(lo, 4) + " and " + nM6(hi, 4), {size: 17, color: C.text, anchor: "start", mono: true});
      L.svg(m, "Polygons inside and outside a circle", 300);
      L.readout([["Sides", String(n)], ["Inscribed perimeter ÷ diameter", nM6(lo, 4), C.ok], ["Circumscribed perimeter ÷ diameter", nM6(hi, 4), C.danger]]);
      msg = t < 5 ? "Doubling the sides…" : "With 96 sides: <b>3.1410 < π < 3.1427</b>, just inside Archimedes’ 3 10/71 < π < 3 1/7.";
    } else if(id === "madhava"){
      var N = Math.max(1, Math.floor(f * 40 + 1e-9)), s = 0, P = [], X = function(i){ return 70 + (i - 1) * 15.5; }, Y = function(v){ return 260 - (v - 2.6) / 1.5 * 230; };
      for(var j = 1; j <= N; j++){ s += (j % 2 ? 1 : -1) / (2 * j - 1); P.push([X(j), Y(4 * s)]); }
      m += L.line(60, Y(Math.PI), 690, Y(Math.PI), C.muted, 1.5, "6 4") + L.text(694, Y(Math.PI) + 4, "π", {size: 14, color: C.muted, anchor: "start"});
      m += L.line(60, 262, 690, 262, C.faint, 1) + L.text(60, 282, "1 term", {size: 12, color: C.muted, anchor: "start"}) + L.text(690, 282, "40 terms", {size: 12, color: C.muted, anchor: "end"});
      [3, 3.5, 4].forEach(function(v){ m += L.text(52, Y(v) + 4, nM6(v), {size: 12, color: C.muted, anchor: "end"}); });
      m += plineM6(P, C.path, 2) + P.map(function(p){ return L.circle(p[0], p[1], 2.5, C.path); }).join("");
      L.svg(m, "Partial sums of Mādhava’s series", 290);
      L.readout([["Terms", String(N)], ["4 × partial sum", nM6(4 * s, 4), C.path], ["Gap from π", nM6(Math.abs(Math.PI - 4 * s), 4)]]);
      msg = t < 5 ? "Adding terms…" : "After 40 terms the sum is " + nM6(4 * s, 4) + ": it zig-zags around π and closes in slowly, but <b>the infinite series is exactly π</b>.";
    } else {
      var vals = [["3 (early)", 3], ["3⅛ Mesopotamia", 3.125], ["√10 Brahmagupta", Math.sqrt(10)], ["22/7", 22 / 7], ["3.1416 Āryabhaṭa", 3.1416], ["355/113 Zu Chongzhi", 355 / 113]];
      var n2 = Math.min(6, Math.floor(f * 6 + 1e-9) + 1), XX = function(v){ return 60 + (v - 3) / 0.2 * 600; };
      m += L.line(60, 250, 660, 250, C.text, 2) + [3, 3.05, 3.1, 3.15, 3.2].map(function(v){ return L.line(XX(v), 244, XX(v), 256, C.text, 1.5) + L.text(XX(v), 274, nM6(v), {size: 12, color: C.muted, anchor: "middle"}); }).join("");
      m += L.line(XX(Math.PI), 30, XX(Math.PI), 256, C.danger, 2, "5 4") + L.text(XX(Math.PI) + 6, 26, "π", {size: 15, color: C.danger, anchor: "start", weight: 700});
      vals.slice(0, n2).forEach(function(v, i){ var y = 50 + i * 32, x = XX(Math.min(3.2, v[1])); m += L.line(x, y, x, 250, C.faint, 1) + L.circle(x, y, 5, C.path) + L.text(x + (x > 500 ? -10 : 10), y + 5, v[0] + (v[1] > 3.2 ? " (3.162, off scale)" : ""), {size: 13, color: C.text, anchor: x > 500 ? "end" : "start"}); });
      L.svg(m, "Approximations of π on a number line", 290);
      var last = vals[n2 - 1];
      L.readout([["Value", last[0] + " = " + nM6(last[1], 7), C.path], ["Error", nM6(Math.abs(last[1] - Math.PI), 7), C.danger]]);
      msg = t < 5 ? "Placing the historical values…" : "Errors: 22/7 is off by 0.0013, 3.1416 by 0.0000073, and <b>355/113 is closest</b>, off by only 0.00000003.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["roll", "Roll a wheel"], ["archimedes", "Archimedes’ polygons"], ["madhava", "Mādhava’s series"], ["approx", "Values through history"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.pi = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Arc length and the 400 m track (§6.4–6.5)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "sector", theta: 90, lane: 2};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend({sector: [[C.path, "arc"], [C.muted, "radii"]], track: [[C.path, "distance run"], [C.faint, "lane 1"]], stagger: [[C.ok, "lane 1 bends"], [C.vel, "outer lane bends"], [C.danger, "extra distance"]], paradox: [[C.path, "one semicircle"], [C.vel, "chain of semicircles"]]}[id]);
    L.watch({sector: "Fig. 6.10: an arc of radius 7 cm subtending θ° at the centre. Change θ.", track: "Fig. 6.11: one lap, 0.3 m from the inner edge of lane 1.", stagger: "Think and Reflect: how far ahead must an outer lane start? Change the lane.", paradox: "Example 2 (Fig. 6.13): split the semicircle on PQ into smaller semicircles."}[id]);
    if(id === "sector") sliderSetM6(L, st, [["m6th", "angle θ (°)", 10, 360, 10, "theta"]]);
    else if(id === "stagger") sliderSetM6(L, st, [["m6lane", "lane", 2, 8, 1, "lane"]]);
    else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var f = clampM6(t / 5, 0, 1), id = st.preset, m = "", msg;
    if(id === "sector"){
      var r = 7, k = 17, c = [260, 150], th = st.theta * f, P = arcPtsM6(c, r * k, 0, th, 72), len = 2 * PI7 * r * th / 360;
      m += L.circle(c[0], c[1], r * k, "none", ' stroke="' + C.faint + '" stroke-width="1.5"') + L.line(c[0], c[1], c[0] + r * k, c[1], C.muted, 2) + L.line(c[0], c[1], P[P.length - 1][0], P[P.length - 1][1], C.muted, 2) + plineM6(P, C.path, 5) + L.circle(c[0], c[1], 4, C.text);
      m += L.text(470, 110, "θ = " + nM6(th, 0) + "°", {size: 20, color: C.text, anchor: "start"}) + L.text(470, 150, "l = 2πr × θ/360", {size: 16, color: C.muted, anchor: "start", mono: true}) + L.text(470, 185, "= " + nM6(len, 2) + " cm", {size: 20, color: C.path, anchor: "start", weight: 700});
      L.svg(m, "An arc of a circle of radius 7 cm", 300);
      L.readout([["Radius", "7 cm"], ["Angle θ", nM6(th, 0) + "°"], ["Arc length (π ≈ 22/7)", nM6(len, 2) + " cm", C.path]]);
      msg = t < 5 ? "Sweeping the arc…" : "θ = " + nM6(st.theta) + "°: arc = 2 × 22/7 × 7 × " + nM6(st.theta) + "/360 = <b>" + nM6(2 * PI7 * 7 * st.theta / 360) + " cm</b>.";
    } else if(id === "track"){
      var s = 84.39, R0 = 36.5, run = 36.8, lw = 1.22, k2 = 3.1, xL = 185, xR = xL + s * k2, yc = 150, d = 400 * f, pos, done = {straight: 0, bend: 0};
      for(var i = 0; i <= 8; i++){ var rr = (R0 + i * lw) * k2; m += pathM6("M " + xL + " " + (yc + rr) + " L " + xR + " " + (yc + rr) + " A " + rr + " " + rr + " 0 0 0 " + xR + " " + (yc - rr) + " L " + xL + " " + (yc - rr) + " A " + rr + " " + rr + " 0 0 0 " + xL + " " + (yc + rr), "none", i === 0 ? C.text : C.faint, i === 0 ? 2 : 1); }
      var Rk = run * k2, bend = Math.PI * run, segs = [s, bend, s, bend], acc = 0, trail = [[xL, yc + Rk]];
      for(var q = 0; q < 4; q++){
        var take = clampM6(d - acc, 0, segs[q]);
        for(var u = 1; u <= 24; u++){ var g = take * u / 24;
          if(q === 0) pos = [xL + g * k2, yc + Rk]; else if(q === 1) pos = [xR + Rk * Math.sin(g / run), yc + Rk * Math.cos(g / run)]; else if(q === 2) pos = [xR - g * k2, yc - Rk]; else pos = [xL - Rk * Math.sin(g / run), yc - Rk * Math.cos(g / run)];
          if(take > 0) trail.push(pos); }
        if(q % 2) done.bend += take; else done.straight += take; acc += segs[q];
      }
      m += plineM6(trail, C.path, 4) + L.circle(trail[trail.length - 1][0], trail[trail.length - 1][1], 6, C.danger);
      L.svg(m, "One lap of a 400 m track", 300);
      L.readout([["Straights", nM6(done.straight, 2) + " m"], ["Bends (radius 36.8 m)", nM6(done.bend, 2) + " m"], ["Total", nM6(d, 2) + " m", C.path]]);
      msg = t < 5 ? "Running the lap…" : "168.78 m of straights + 2π × 36.8 = 231.22 m of bends: <b>400 m</b> in all.";
    } else if(id === "stagger"){
      var k3 = 2.6, c3 = [220, 290], base = 36.8, lane = st.lane, rL = base + (lane - 1) * 1.22, extra = 2 * Math.PI * 1.22 * (lane - 1) * f;
      m += plineM6(arcPtsM6(c3, base * k3, 0, 180, 64), C.ok, 4) + plineM6(arcPtsM6(c3, rL * k3, 0, 180, 64), C.vel, 4);
      for(var j = 2; j <= 8; j++) if(j !== lane) m += plineM6(arcPtsM6(c3, (base + (j - 1) * 1.22) * k3, 0, 180, 48), C.faint, 1);
      var w3 = extra * 4;
      m += L.text(470, 80, "Lane 1 bends: 2π × 36.8", {size: 14, color: C.ok, anchor: "start"}) + L.text(470, 105, "Lane " + lane + " bends: 2π × " + nM6(rL, 2), {size: 14, color: C.vel, anchor: "start"});
      m += L.line(470, 160, 470 + w3, 160, C.danger, 8) + L.text(470, 145, "extra: " + nM6(extra, 2) + " m", {size: 16, color: C.danger, anchor: "start", weight: 700});
      L.svg(m, "Bends of lane 1 and an outer lane", 300);
      L.readout([["Lane", String(lane), C.vel], ["Radius difference", nM6(1.22 * (lane - 1), 2) + " m"], ["Stagger from lane 1", nM6(extra, 2) + " m", C.danger]]);
      msg = t < 5 ? "Comparing the bends…" : "Lane " + lane + " starts " + nM6(2 * Math.PI * 1.22 * (lane - 1), 2) + " m ahead of lane 1. Each lane adds the same <b>2π × 1.22 ≈ 7.67 m</b>, whatever the track’s radius.";
    } else {
      var X0 = 60, W = 600, y0 = 230, splits = [[1], [0.5, 0.5], [0.25, 0.45, 0.3], [0.1, 0.15, 0.2, 0.1, 0.25, 0.2]], lev = Math.min(3, Math.floor(f * 4 + 1e-9)), parts = splits[lev];
      m += plineM6(arcPtsM6([X0 + W / 2, y0], W / 2, 180, 0, 90), C.path, 3) + L.line(X0, y0, X0 + W, y0, C.faint, 1.5);
      var x = X0;
      parts.forEach(function(p){ var w = p * W; m += plineM6(arcPtsM6([x + w / 2, y0], w / 2, 180, 360, 40), C.vel, 3); x += w; });
      m += L.circle(X0, y0, 4, C.text) + L.circle(X0 + W, y0, 4, C.text) + L.text(X0 - 12, y0 + 4, "P", {size: 14, color: C.text, anchor: "end", weight: 700}) + L.text(X0 + W + 12, y0 + 4, "Q", {size: 14, color: C.text, anchor: "start", weight: 700});
      L.svg(m, "One semicircle and a chain of smaller semicircles", 300);
      L.readout([["PQ", "12 units"], ["Big semicircle", "6π ≈ 18.85 units", C.path], ["Chain of " + parts.length, "π × (sum of radii) = 6π ≈ 18.85 units", C.vel]]);
      msg = t < 5 ? "Splitting the diameter…" : "The radii always add up to 6, so both paths are 6π ≈ 18.85 units: <b>the two paths are equal</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["sector", "Arc length"], ["track", "A 400 m lap"], ["stagger", "Lane staggers"], ["paradox", "Semicircle paradox"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.arc = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Areas of parallelograms and triangles; the median (§6.6–6.8)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "cutmove"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend({cutmove: [[C.path, "parallelogram"], [C.acc, "piece that moves"]], shear: [[C.path, "base 8, height 5"]], sides: [[C.path, "sides 8 and 5"], [C.danger, "height"]], median: [[C.vel, "ΔABD"], [C.ok, "ΔACD"]]}[id]);
    L.watch({cutmove: "Fig. 6.17: cut a triangle off one end of the parallelogram and move it to the other end.", shear: "Slide the top edge along its line: same base, same height.", sides: "Think and Reflect: keep the sides 8 and 5 but close the angle between them.", median: "Fig. 6.22: move A along a line parallel to BC; D is the midpoint of BC."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var f = clampM6(t / 5, 0, 1), id = st.preset, k = 34, V = viewM6(180, 240, k), m = "", msg, T = function(P){ return P.map(V); };
    m += L.line(60, 240, 680, 240, C.faint, 1);
    if(id === "cutmove"){
      var dx = 8 * f;
      m += polyM6(T([[3, 0], [8, 0], [11, 5], [3, 5]]), "rgba(251,191,36,0.18)", C.path, 2.5) + polyM6(T([[0 + dx, 0], [3 + dx, 5], [3 + dx, 0]]), "rgba(244,114,182,0.35)", C.acc, 2.5);
      if(t < 0.2) m += polyM6(T([[0, 0], [8, 0], [11, 5], [3, 5]]), "none", C.muted, 1);
      m += L.line(V([3, 0])[0], V([3, 0])[1], V([3, 5])[0], V([3, 5])[1], C.danger, 2, "5 4");
      L.svg(m, "Cutting and moving part of a parallelogram", 280);
      L.readout([["Base", "8 units"], ["Height", "5 units"], ["Area", "8 × 5 = 40 square units", C.path]]);
      msg = t < 5 ? "Moving the triangle…" : "The piece fills the gap exactly: an 8 × 5 rectangle, so <b>bh = 40</b> square units.";
    } else if(id === "shear"){
      var o = -4 + 8 * f, P = [[0, 0], [8, 0], [8 + o, 5], [o, 5]];
      m += polyM6(T(P), "rgba(251,191,36,0.18)", C.path, 2.5) + L.line(V([0, 5])[0] - 200, V([0, 5])[1], V([8, 5])[0] + 200, V([8, 5])[1], C.faint, 1, "4 4");
      L.svg(m, "Shearing a parallelogram", 280);
      L.readout([["Top edge shifted", nM6(o, 1) + " units"], ["Height", "5 units"], ["Area", nM6(areaM6(P), 1) + " square units", C.path]]);
      msg = t < 5 ? "Sliding the top edge…" : "The shape changes, but with the same base and height <b>the area stays 40</b>.";
    } else if(id === "sides"){
      var th = 90 - 60 * f, h = 5 * Math.sin(th * DEG6), off = 5 * Math.cos(th * DEG6), Q = [[0, 0], [8, 0], [8 + off, h], [off, h]];
      m += polyM6(T(Q), "rgba(251,191,36,0.18)", C.path, 2.5) + L.line(V([off, h])[0], V([off, h])[1], V([off, 0])[0], V([off, 0])[1], C.danger, 2, "5 4");
      L.svg(m, "A parallelogram with fixed sides and a closing angle", 280);
      L.readout([["Angle", nM6(th, 0) + "°"], ["Height", nM6(h, 2) + " units", C.danger], ["Area", nM6(8 * h, 2) + " square units", C.path]]);
      msg = t < 5 ? "Closing the angle…" : "At 30° the height is 2.5, so the area is <b>8 × 2.5 = 20</b>: the sides alone do not fix the area.";
    } else {
      var ax = 2 + 8 * f, A = [ax, 7], B = [0, 0], Cc = [12, 0], D = [6, 0], V2 = viewM6(150, 270, 30), T2 = function(P){ return P.map(V2); };
      m = L.line(60, 270, 680, 270, C.faint, 1) + polyM6(T2([A, B, D]), "rgba(56,189,248,0.25)", C.vel, 2) + polyM6(T2([A, D, Cc]), "rgba(74,222,128,0.25)", C.ok, 2) + L.line(V2([-2, 7])[0], V2([-2, 7])[1], V2([14, 7])[0], V2([14, 7])[1], C.faint, 1, "4 4");
      [[A, "A", -12], [B, "B", 0], [Cc, "C", 0], [D, "D", 0]].forEach(function(p){ var q = V2(p[0]); m += L.circle(q[0], q[1], 4, C.text) + L.text(q[0], q[1] + (p[1] === "A" ? -10 : 20), p[1], {size: 14, color: C.text, weight: 700, anchor: "middle"}); });
      L.svg(m, "A median dividing a triangle", 290);
      L.readout([["BD = DC", "6 units"], ["Height", "7 units"], ["Areas", nM6(areaM6([A, B, D])) + " and " + nM6(areaM6([A, D, Cc])), C.vel]]);
      msg = t < 5 ? "Moving A…" : "Wherever A is on the parallel line, ΔABD and ΔACD have areas <b>21 and 21</b>: the median halves the triangle.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["cutmove", "Cut and move"], ["shear", "Shear"], ["sides", "Same sides, less area"], ["median", "The median theorem"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.shear = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Heron’s formula and the circumcircle and incircle formulas (§6.8.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "equilateral", a: 13, b: 14, c: 15};
  var P = {equilateral: [6, 6, 6], right: [5, 4, 3], iso: [6, 5, 5]};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend([[C.path, "triangle (BC = a, CA = b, AB = c)"], [C.vel, "circumcircle, radius R"], [C.ok, "incircle, radius r"]]);
    L.watch({equilateral: "Example 3: an equilateral triangle with side 6.", right: "Example 5: the 3–4–5 triangle (BC = 5).", iso: "An isosceles triangle with sides 5, 5, 6.", custom: "Choose any three sides; the 13–14–15 triangle is a classic."}[id]);
    if(id === "custom") sliderSetM6(L, st, [["m6a", "a = BC", 2, 16, 1, "a"], ["m6b", "b = CA", 2, 16, 1, "b"], ["m6c", "c = AB", 2, 16, 1, "c"]]); else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var s3 = st.preset === "custom" ? [st.a, st.b, st.c] : P[st.preset], a = s3[0], b = s3[1], c = s3[2], m = "", msg;
    if(a + b <= c || b + c <= a || c + a <= b){
      L.svg(L.text(360, 150, "These sides do not make a triangle", {size: 18, color: C.danger, anchor: "middle"}), "No triangle", 300);
      L.readout([["Sides", a + ", " + b + ", " + c], ["Triangle inequality", "fails", C.danger]]);
      L.verdict("Each side must be shorter than the other two together, so <b>no triangle</b> has these sides (Heron would need the square root of a negative number).");
      return;
    }
    var s = (a + b + c) / 2, heron = Math.sqrt(s * (s - a) * (s - b) * (s - c)), ax = (a * a + c * c - b * b) / (2 * a), ay = Math.sqrt(Math.max(0, c * c - ax * ax));
    var A = [ax, ay], B = [0, 0], Cc = [a, 0];
    var D = 2 * (A[0] * (B[1] - Cc[1]) + B[0] * (Cc[1] - A[1]) + Cc[0] * (A[1] - B[1])), sq = function(p){ return p[0] * p[0] + p[1] * p[1]; };
    var O = [(sq(A) * (B[1] - Cc[1]) + sq(B) * (Cc[1] - A[1]) + sq(Cc) * (A[1] - B[1])) / D, (sq(A) * (Cc[0] - B[0]) + sq(B) * (A[0] - Cc[0]) + sq(Cc) * (B[0] - A[0])) / D], R = Math.hypot(O[0], O[1]);
    var k = Math.min(26, 250 / (2 * R)), V = viewM6(360 - O[0] * k, 155 + O[1] * k, k);
    var I = [(a * A[0] + b * B[0] + c * Cc[0]) / (a + b + c), (a * A[1] + b * B[1] + c * Cc[1]) / (a + b + c)], r = I[1];
    var show = t >= 2;
    m += polyM6([A, B, Cc].map(V), "rgba(251,191,36,0.15)", C.path, 2.5) + L.line(V(A)[0], V(A)[1], V([ax, 0])[0], V([ax, 0])[1], C.muted, 1.5, "5 4");
    if(show) m += L.circle(V(O)[0], V(O)[1], R * k, "none", ' stroke="' + C.vel + '" stroke-width="1.8"') + L.circle(V(I)[0], V(I)[1], r * k, "none", ' stroke="' + C.ok + '" stroke-width="1.8"');
    [[A, "A", 0, -10], [B, "B", -12, 16], [Cc, "C", 12, 16]].forEach(function(p){ var q = V(p[0]); m += L.circle(q[0], q[1], 4, C.text) + L.text(q[0] + p[2], q[1] + p[3], p[1], {size: 14, color: C.text, weight: 700, anchor: "middle"}); });
    L.svg(m, "Triangle with its circumcircle and incircle", 300);
    L.readout([["Sides a, b, c", a + ", " + b + ", " + c], ["s", nM6(s)], ["Heron √(s(s − a)(s − b)(s − c))", nM6(heron, 2), C.path], ["½ × a × height", nM6(0.5 * a * ay, 2)], ["abc/(4R)", show ? nM6(a * b * c / (4 * R), 2) : "…", C.vel], ["r(a + b + c)/2", show ? nM6(r * s, 2) : "…", C.ok]]);
    msg = t < 4 ? "Computing the formulas…" : "s = " + nM6(s) + " and every formula gives <b>area = " + nM6(heron, 2) + "</b> (R = " + nM6(R, 2) + ", r = " + nM6(r, 2) + ").";
    L.verdict(msg);
  }
  function mount(){ L.presets([["equilateral", "Equilateral, side 6"], ["right", "3–4–5 triangle"], ["iso", "Sides 5, 5, 6"], ["custom", "Any three sides"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.heron = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Brahmagupta’s formula (§6.8)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "rhombus"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend({rhombus: [[C.path, "rhombus with sides 3"]], cyclic: [[C.vel, "circle"], [C.path, "cyclic 4-gon"]], trap: [[C.vel, "circle"], [C.path, "isosceles trapezium"]], collapse: [[C.path, "4-gon ABCD"], [C.danger, "side DA shrinking"]]}[id]);
    L.watch({rhombus: "Fig. 6.27: four rods of length 3; flex the rhombus.", cyclic: "Move the corners around the circle; compare Brahmagupta’s formula with the actual area.", trap: "Example 7: an isosceles trapezium with parallel sides 10 and 4 and legs 5 is cyclic.", collapse: "Heron as a special case: slide D onto A so that side d becomes 0."}[id]);
    L.controls(""); L.restart(true);
  }
  function brahma(Q){ var sd = [0, 1, 2, 3].map(function(i){ var p = Q[i], q = Q[(i + 1) % 4]; return Math.hypot(q[0] - p[0], q[1] - p[1]); }), s = (sd[0] + sd[1] + sd[2] + sd[3]) / 2; return {sides: sd, s: s, area: Math.sqrt(Math.max(0, (s - sd[0]) * (s - sd[1]) * (s - sd[2]) * (s - sd[3])))}; }
  function draw(t){
    var f = clampM6(t / 5, 0, 1), id = st.preset, m = "", msg, k, V;
    if(id === "rhombus"){
      var th0 = Math.asin(5.41 / 9) / DEG6, th = 90 - (90 - th0) * f, area = 9 * Math.sin(th * DEG6), off = 3 * Math.cos(th * DEG6), h = 3 * Math.sin(th * DEG6);
      k = 55; V = viewM6(240, 250, k);
      m += polyM6([[0, 0], [3, 0], [3 + off, h], [off, h]].map(V), "rgba(251,191,36,0.18)", C.path, 3);
      var seen = [[9, "9"], [8.01, "8.01"], [5.41, "5.41"]].filter(function(x){ return area <= x[0] + 1e-6; });
      m += L.text(520, 90, "angle " + nM6(th, 1) + "°", {size: 16, color: C.text, anchor: "start"}) + L.text(520, 125, "area " + nM6(area, 2), {size: 20, color: C.path, anchor: "start", weight: 700});
      m += L.text(520, 170, "seen: " + seen.map(function(x){ return x[1]; }).join(", "), {size: 14, color: C.muted, anchor: "start"});
      L.svg(m, "A rhombus with sides 3 flexing", 280);
      L.readout([["Sides", "3, 3, 3, 3"], ["Angle", nM6(th, 1) + "°"], ["Area = 9 sin(angle)", nM6(area, 2), C.path]]);
      msg = t < 5 ? "Flexing…" : "Same four sides, areas 9, 8.01 and <b>5.41</b>: the sides alone cannot fix a 4-gon’s area.";
    } else if(id === "cyclic" || id === "collapse" || id === "trap"){
      var R = 5, c = [0, 0], Q;
      if(id === "cyclic"){ var base = [95, 200, 250, 340], dv = [40, -30, 25, -30]; Q = base.map(function(a0, i){ var a = (a0 + dv[i] * f) * DEG6; return [R * Math.cos(a), R * Math.sin(a)]; }); }
      else if(id === "trap"){ Q = [[-5, -1.5], [5, -1.5], [2, 2.5], [-2, 2.5]]; c = [0, -2.125]; R = Math.hypot(5, 0.625); }
      else { var aD = (130 + 70 * f) * DEG6, deg = [200, 320, 60]; Q = deg.map(function(d){ return [R * Math.cos(d * DEG6), R * Math.sin(d * DEG6)]; }); Q = [Q[0], Q[1], Q[2], [R * Math.cos(aD), R * Math.sin(aD)]]; }
      k = 24; V = viewM6(250 - c[0] * k, 150 + c[1] * k, k);
      var br = brahma(Q), real = areaM6(Q);
      m += L.circle(V(c)[0], V(c)[1], R * k, "none", ' stroke="' + C.vel + '" stroke-width="1.8"') + polyM6(Q.map(V), "rgba(251,191,36,0.18)", C.path, 2.5);
      if(id === "collapse") m += L.line(V(Q[3])[0], V(Q[3])[1], V(Q[0])[0], V(Q[0])[1], C.danger, 4);
      ["A", "B", "C", "D"].forEach(function(n, i){ var q = V(Q[i]), dx = q[0] - 250, dy = q[1] - 150, l = Math.hypot(dx, dy) || 1; m += L.circle(q[0], q[1], 4, C.text) + L.text(q[0] + dx / l * 16, q[1] + dy / l * 16 + 5, n, {size: 14, color: C.text, weight: 700, anchor: "middle"}); });
      m += L.text(460, 70, "sides " + br.sides.map(function(x){ return nM6(x, 2); }).join(", "), {size: 14, color: C.text, anchor: "start"}) + L.text(460, 105, "s = " + nM6(br.s, 2), {size: 14, color: C.text, anchor: "start"});
      m += L.text(460, 145, "Brahmagupta: " + nM6(br.area, 2), {size: 17, color: C.path, anchor: "start", weight: 700}) + L.text(460, 175, "actual area: " + nM6(real, 2), {size: 17, color: C.vel, anchor: "start"});
      L.svg(m, "A cyclic 4-gon and Brahmagupta’s formula", 300);
      L.readout([["Sides a, b, c, d", br.sides.map(function(x){ return nM6(x, 2); }).join(", ")], ["√((s − a)(s − b)(s − c)(s − d))", nM6(br.area, 2), C.path], ["Area measured", nM6(real, 2), C.vel]]);
      if(id === "cyclic") msg = t < 5 ? "Moving the corners…" : "Brahmagupta " + nM6(br.area, 2) + " and measured " + nM6(real, 2) + ": <b>they match</b> for every cyclic 4-gon.";
      else if(id === "trap") msg = t < 5 ? "Checking…" : "s = 12 and √(2 × 8 × 7 × 7) = <b>28</b>, the same as ½(10 + 4) × 4 = 28.";
      else msg = t < 5 ? "Shrinking DA…" : "With d = 0 the 4-gon is ΔABC and the formula becomes √(s(s − a)(s − b)(s − c)) = " + nM6(br.area, 2) + ": <b>Heron’s formula</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["rhombus", "Flexing rhombus"], ["cyclic", "Cyclic 4-gon"], ["trap", "Isosceles trapezium"], ["collapse", "d → 0 gives Heron"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.brahma = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Squaring a rectangle (§6.9)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "steps", a: 8, b: 2};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 7, step: 0.05, speed: 1});
    L.legend({steps: [[C.path, "rectangle ABCD"], [C.vel, "square AFGH and arc"], [C.ok, "square HPQS"]], explore: [[C.path, "rectangle"], [C.ok, "equal square"]], identity: [[C.vel, "((a + b)/2)²"], [C.danger, "((a − b)/2)² removed"]], triangle: [[C.path, "triangle"], [C.ok, "equal square"]]}[id]);
    L.watch({steps: "Fig. 6.30: Baudhāyana’s construction for AD = 9 and AB = 4, one step at a time.", explore: "Choose the rectangle’s sides a > b and watch the construction.", identity: "Why it works: a big square minus a small square equals the rectangle.", triangle: "Think and Reflect: square a triangle with base 18 and height 4."}[id]);
    if(id === "explore") sliderSetM6(L, st, [["m6sa", "a = AD", 2, 10, 0.5, "a"], ["m6sb", "b = AB", 1, 8, 0.5, "b"]]); else L.controls("");
    L.restart(true);
  }
  function construct(a, b, step, m, V){
    var AF = (a + b) / 2, BH = AF - b, hp = Math.sqrt(AF * AF - BH * BH), pt = function(p){ return V(p); }, seg = function(p, q, col, w, dash){ var P = pt(p), Q = pt(q); return L.line(P[0], P[1], Q[0], Q[1], col, w || 2, dash); };
    m += polyM6([[0, 0], [a, 0], [a, b], [0, b]].map(V), "rgba(251,191,36,0.15)", C.path, 2.5);
    var lab = function(p, s, dx, dy){ var P = pt(p); return L.circle(P[0], P[1], 3.5, C.text) + L.text(P[0] + dx, P[1] + dy, s, {size: 13, color: C.text, weight: 700, anchor: "middle"}); };
    m += lab([0, 0], "A", -12, 14) + lab([a, 0], "D", 10, 14) + lab([a, b], "C", 12, 0) + lab([0, b], "B", -12, 0);
    if(step >= 1) m += lab([b, 0], "E", 0, 16);
    if(step >= 2) m += lab([AF, 0], "F", 0, 16);
    if(step >= 3) m += polyM6([[0, 0], [AF, 0], [AF, AF], [0, AF]].map(V), "none", C.vel, 2) + lab([AF, AF], "G", 12, -4) + lab([0, AF], "H", -12, -4);
    if(step >= 4){ var arcP = arcPtsM6(pt([0, AF]), AF * (pt([1, 0])[0] - pt([0, 0])[0]), -90, 0, 40); m += plineM6(arcP, C.vel, 1.8, "5 4") + lab([hp, b], "K", 10, 16); }
    if(step >= 5) m += seg([hp, b], [hp, AF], C.muted, 1.5, "4 3") + lab([hp, AF], "P", 6, -8);
    if(step >= 6) m += polyM6([[0, AF], [hp, AF], [hp, AF + hp], [0, AF + hp]].map(V), "rgba(74,222,128,0.25)", C.ok, 2.5) + lab([hp, AF + hp], "Q", 10, -4) + lab([0, AF + hp], "S", -12, -4);
    return {m: m, AF: AF, BH: BH, hp: hp};
  }
  function draw(t){
    var id = st.preset, m = "", msg, f = clampM6(t / 7, 0, 1), step = Math.min(6, Math.floor(t + 1e-9));
    if(id === "steps" || id === "explore"){
      var a = id === "steps" ? 9 : st.a, b = id === "steps" ? 4 : st.b;
      if(a <= b){ L.svg(L.text(360, 150, "Choose a > b", {size: 18, color: C.danger, anchor: "middle"}), "Invalid sides", 300); L.readout([["a", nM6(a)], ["b", nM6(b)]]); L.verdict("The construction needs <b>a > b</b> (if a = b the rectangle is already a square)."); return; }
      var k = Math.min(22, 270 / ((a + b) / 2 + Math.sqrt(a * b)), 300 / a), V = viewM6(260, 285, k), r = construct(a, b, step, m, V);
      m = r.m;
      var names = ["Rectangle ABCD", "E on AD with AE = AB", "F, the midpoint of ED", "Square AFGH", "Arc AG with centre H cuts BC at K", "KP ∥ AH meets GH at P", "Square HPQS"];
      L.svg(m, "Baudhāyana’s construction", 300);
      L.readout([["Step", names[step]], ["AF = (a + b)/2", nM6(r.AF, 2)], ["BH = (a − b)/2", nM6(r.BH, 2)], ["HP = √(HK² − BH²)", step >= 5 ? nM6(r.hp, 2) : "…", C.ok], ["ab", nM6(a * b, 2), C.path]]);
      msg = t < 7 ? names[step] + "…" : "HP² = " + nM6(r.AF, 2) + "² − " + nM6(r.BH, 2) + "² = " + nM6(a * b, 2) + ", so <b>HP = " + nM6(r.hp, 2) + "</b> and square HPQS has the area of the " + nM6(a) + " × " + nM6(b) + " rectangle.";
    } else if(id === "identity"){
      var a2 = 9, b2 = 4, big = (a2 + b2) / 2, small = (a2 - b2) / 2, k2 = 30, V2 = viewM6(80, 270, k2), sh = clampM6(f * 2, 0, 1);
      m += polyM6([[0, 0], [big, 0], [big, big], [0, big]].map(V2), "rgba(56,189,248,0.18)", C.vel, 2.5) + polyM6([[big - small, big - small], [big, big - small], [big, big], [big - small, big]].map(V2), "rgba(248,113,113," + (0.2 + 0.4 * sh) + ")", C.danger, 2);
      var V3 = viewM6(390, 270, k2);
      if(t >= 3.5) m += polyM6([[0, 0], [a2, 0], [a2, b2], [0, b2]].map(V3), "rgba(251,191,36,0.25)", C.path, 2.5) + L.text(V3([a2 / 2, b2 / 2])[0], V3([a2 / 2, b2 / 2])[1] + 5, "9 × 4", {size: 15, color: C.text, anchor: "middle"});
      m += L.text(V2([big / 2, big / 2])[0], V2([big / 2, big / 2])[1], "6.5²", {size: 15, color: C.text, anchor: "middle"}) + L.text(V2([big - small / 2, big - small / 2])[0], V2([big - small / 2, big - small / 2])[1] + 5, "2.5²", {size: 13, color: C.danger, anchor: "middle"});
      L.svg(m, "Difference of two squares equals a rectangle", 300);
      L.readout([["((a + b)/2)²", "6.5² = 42.25", C.vel], ["((a − b)/2)²", "2.5² = 6.25", C.danger], ["Difference", t >= 3.5 ? "36 = 9 × 4" : "…", C.path]]);
      msg = t < 7 ? "Removing the small square…" : "<b>42.25 − 6.25 = 36</b> = 9 × 4: the L-shape left over has the rectangle’s area, which is what Baudhāyana’s right triangle HKP measures.";
    } else {
      var k4 = 26, V4 = viewM6(120, 270, k4), stage = Math.min(2, Math.floor(f * 3 + 1e-9));
      m += polyM6([[0, 0], [18, 0], [6, 4]].map(function(p){ return viewM6(120, 120, k4)(p); }), "rgba(251,191,36,0.2)", C.path, 2.5);
      if(stage >= 1) m += polyM6([[0, 0], [18, 0], [18, 2], [0, 2]].map(V4), "rgba(56,189,248,0.2)", C.vel, 2.5);
      if(stage >= 2) m += polyM6([[20, 0], [26, 0], [26, 6], [20, 6]].map(function(p){ return viewM6(40, 270, k4 * 0.9)(p); }), "rgba(74,222,128,0.3)", C.ok, 2.5);
      L.svg(m, "Squaring a triangle", 300);
      L.readout([["Triangle", "base 18, height 4, area 36", C.path], ["Rectangle", stage >= 1 ? "18 × 2 = 36" : "…", C.vel], ["Square", stage >= 2 ? "6 × 6 = 36" : "…", C.ok]]);
      msg = t < 7 ? "Transforming…" : "Triangle → rectangle 18 × 2 (same base, half the height) → square of <b>side 6</b>, by Baudhāyana’s construction.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["steps", "Fig. 6.30 step by step"], ["explore", "Any rectangle"], ["identity", "Why it works"], ["triangle", "Squaring a triangle"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.square = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Area of a circle, sectors and segments (§6.10)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "slices", theta: 60};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend({slices: [[C.path, "slices"], [C.vel, "other slices"]], polygon: [[C.ok, "inscribed regular polygon"]], sector: [[C.path, "sector"]], segment: [[C.path, "segment"], [C.vel, "triangle"]]}[id]);
    L.watch({slices: "Fig. 6.37: Nīlakaṇṭha’s slices laid head to tail. More slices look more like a parallelogram.", polygon: "Fig. 6.36: regular polygons with more and more sides fill the circle.", sector: "Fig. 6.38: a sector of radius 7 cm and angle θ. Change θ.", segment: "Worked example: radius 14 cm, θ = 90°; segment = sector − triangle."}[id]);
    if(id === "sector") sliderSetM6(L, st, [["m6st", "angle θ (°)", 10, 360, 10, "theta"]]); else L.controls("");
    L.restart(true);
  }
  function wedge(c, r, a0, a1, flip){ var P = [c]; for(var i = 0; i <= 12; i++){ var a = (a0 + (a1 - a0) * i / 12) * DEG6; P.push([c[0] + r * Math.cos(a), c[1] + (flip ? 1 : -1) * r * Math.sin(a)]); } return P; }
  function draw(t){
    var f = clampM6(t / 5, 0, 1), id = st.preset, m = "", msg;
    if(id === "slices"){
      var ns = [4, 8, 16, 32], n = ns[Math.min(3, Math.floor(f * 4 + 1e-9))], r = 70, c = [110, 150], da = 360 / n, alpha = Math.PI / n, sw = r * Math.sin(alpha), x0 = 250, yTop = 80;
      for(var i = 0; i < n; i++){ m += polyM6(wedge(c, r, i * da, (i + 1) * da), i % 2 ? "rgba(56,189,248,0.45)" : "rgba(251,191,36,0.55)", C.text, 0.8); }
      for(var j = 0; j < n; j++){
        var up = j % 2 === 0, apex = up ? [x0 + j * sw, yTop] : [x0 + j * sw, yTop + r * Math.cos(alpha)];
        m += polyM6(wedge(apex, r, (up ? 270 : 90) - da / 2, (up ? 270 : 90) + da / 2), up ? "rgba(251,191,36,0.55)" : "rgba(56,189,248,0.45)", C.text, 0.8);
      }
      m += L.text(x0 + n * sw / 2, 280, "base ≈ πr", {size: 14, color: C.muted, anchor: "middle"});
      L.svg(m, "A disc cut into slices and rearranged", 300);
      L.readout([["Slices", String(n)], ["Base of the arrangement", "≈ " + nM6(n * Math.sin(alpha), 3) + " × r (→ π)"], ["Height", "≈ r"]]);
      msg = t < 5 ? "Cutting thinner slices…" : "With many slices the shape is a parallelogram with base πr and height r, so <b>area = πr²</b>.";
    } else if(id === "polygon"){
      var ns2 = [6, 12, 24, 48, 96], n2 = ns2[Math.min(4, Math.floor(f * 5 + 1e-9))], R = 110, c2 = [250, 150], P = [];
      for(var q = 0; q < n2; q++){ var a = 2 * Math.PI * q / n2; P.push([c2[0] + R * Math.cos(a), c2[1] - R * Math.sin(a)]); }
      m += L.circle(c2[0], c2[1], R, "rgba(248,113,113,0.08)", ' stroke="' + C.text + '" stroke-width="2"') + polyM6(P, "rgba(74,222,128,0.25)", C.ok, 1.5);
      var ratio = n2 / 2 * Math.sin(2 * Math.PI / n2);
      m += L.text(420, 110, n2 + " sides", {size: 22, color: C.text, weight: 700, anchor: "start"}) + L.text(420, 150, "area = " + nM6(ratio, 4) + " r²", {size: 18, color: C.ok, anchor: "start", mono: true});
      L.svg(m, "Regular polygons inside a circle", 300);
      L.readout([["Sides", String(n2)], ["Polygon area ÷ r²", nM6(ratio, 4), C.ok], ["π", "3.1416"]]);
      msg = t < 5 ? "Doubling the sides…" : "With 96 sides the polygon covers " + nM6(ratio, 4) + " r²: the area closes in on <b>πr²</b>.";
    } else if(id === "sector"){
      var r3 = 7, k = 17, c3 = [260, 150], th = st.theta * f, A3 = PI7 * r3 * r3 * th / 360;
      m += L.circle(c3[0], c3[1], r3 * k, "none", ' stroke="' + C.faint + '" stroke-width="1.5"') + polyM6(wedge(c3, r3 * k, 0, Math.max(th, 0.01)), "rgba(251,191,36,0.4)", C.path, 2);
      m += L.text(470, 110, "θ = " + nM6(th, 0) + "°", {size: 20, color: C.text, anchor: "start"}) + L.text(470, 150, "πr² × θ/360", {size: 16, color: C.muted, anchor: "start", mono: true}) + L.text(470, 185, "= " + nM6(A3, 2) + " cm²", {size: 20, color: C.path, anchor: "start", weight: 700});
      L.svg(m, "A sector of radius 7 cm", 300);
      L.readout([["Radius", "7 cm"], ["Angle θ", nM6(th, 0) + "°"], ["Sector area (π ≈ 22/7)", nM6(A3, 2) + " cm²", C.path]]);
      msg = t < 5 ? "Sweeping the sector…" : "θ = " + nM6(st.theta) + "°: area = 22/7 × 49 × " + nM6(st.theta) + "/360 = <b>" + nM6(PI7 * 49 * st.theta / 360, 2) + " cm²</b>.";
    } else {
      var r4 = 14, k4 = 9, c4 = [230, 190], th4 = 90 * f, sec = PI7 * r4 * r4 * th4 / 360, tri = 0.5 * r4 * r4 * Math.sin(th4 * DEG6), W = wedge(c4, r4 * k4, 0, Math.max(th4, 0.01));
      m += L.circle(c4[0], c4[1], r4 * k4, "none", ' stroke="' + C.faint + '" stroke-width="1.5"') + polyM6(W, "rgba(251,191,36,0.45)", C.path, 2) + polyM6([W[0], W[1], W[W.length - 1]], "rgba(56,189,248,0.45)", C.vel, 2);
      L.svg(m, "A segment as sector minus triangle", 330);
      L.readout([["Sector", nM6(sec, 2) + " cm²", C.path], ["Triangle ½ r² (at 90°)", nM6(tri, 2) + " cm²", C.vel], ["Segment", nM6(sec - tri, 2) + " cm²"]]);
      msg = t < 5 ? "Opening the angle…" : "Sector 154 cm² − triangle 98 cm² gives <b>segment = 56 cm²</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["slices", "Nīlakaṇṭha’s slices"], ["polygon", "Polygons fill the circle"], ["sector", "Sector area"], ["segment", "Segment area"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.disc = {mount: mount, draw: draw, select: select, state: st};
})();
