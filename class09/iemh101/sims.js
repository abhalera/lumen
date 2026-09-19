// iemh101 labs: Orienting Yourself — The Use of Coordinates. 1 unit = 1 ft in Reiaan’s house.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function nM1(v){ var L = window.LAB, a = Math.abs(v); if(Math.abs(a - Math.round(a)) < 1e-9) return L.num(v, 0); if(Math.abs(a * 10 - Math.round(a * 10)) < 1e-9) return L.num(v, 1); return L.num(v, 2); }
function ptM1(x, y){ return "(" + nM1(x) + ", " + nM1(y) + ")"; }
function clampM1(x, a, b){ return Math.max(a, Math.min(b, x)); }
function d2M1(a, b){ return Math.round(((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])) * 1000) / 1000; }
function rootM1(n){ var L = window.LAB, r = Math.sqrt(n); return Math.abs(r - Math.round(r)) < 1e-9 ? String(Math.round(r)) : "√" + n + " ≈ " + L.num(r, 2); }
// Coordinate plane centred in a 720-wide lab. v = {xmin, xmax, ymin, ymax, s (px per unit), top, every}
function planeM1(L, v){
  var C = L.C, ox = Math.round((720 - (v.xmax - v.xmin) * v.s) / 2), oy = v.top || 20, ev = v.every || 1, m = "";
  var X = function(x){ return ox + (x - v.xmin) * v.s; }, Y = function(y){ return oy + (v.ymax - y) * v.s; };
  for(var x = v.xmin; x <= v.xmax; x++) m += L.line(X(x), Y(v.ymin), X(x), Y(v.ymax), C.grid, 1);
  for(var y = v.ymin; y <= v.ymax; y++) m += L.line(X(v.xmin), Y(y), X(v.xmax), Y(y), C.grid, 1);
  var ax = clampM1(0, v.ymin, v.ymax), ay = clampM1(0, v.xmin, v.xmax);
  if(v.ymin <= 0 && v.ymax >= 0) m += L.line(X(v.xmin), Y(0), X(v.xmax), Y(0), C.faint, 2) + L.text(X(v.xmax) + 12, Y(0) + 4, "x", {size: 12, color: C.muted});
  if(v.xmin <= 0 && v.xmax >= 0) m += L.line(X(0), Y(v.ymin), X(0), Y(v.ymax), C.faint, 2) + L.text(X(0), Y(v.ymax) - 6, "y", {size: 12, color: C.muted});
  for(var i = Math.ceil(v.xmin / ev) * ev; i <= v.xmax; i += ev) if(i !== 0) m += L.text(X(i), Y(ax) + 14, nM1(i), {size: 9, color: C.muted});
  for(var j = Math.ceil(v.ymin / ev) * ev; j <= v.ymax; j += ev) if(j !== 0) m += L.text(X(ay) - 5, Y(j) + 3, nM1(j), {size: 9, color: C.muted, anchor: "end"});
  return {svg: m, X: X, Y: Y, h: Math.round(oy + (v.ymax - v.ymin) * v.s + 30)};
}
function dotM1(L, P, p, color, label, dx, dy){ var x = P.X(p[0]), y = P.Y(p[1]); return L.circle(x, y, 4.5, color) + (label ? L.text(x + (dx === undefined ? 8 : dx), y + (dy === undefined ? -8 : dy), label, {size: 11, color: color, anchor: "start", weight: 700}) : ""); }
function polyM1(P, pts, stroke, fill, w, dash){ return '<polygon points="' + pts.map(function(p){ return P.X(p[0]) + "," + P.Y(p[1]); }).join(" ") + '" fill="' + (fill || "none") + '" stroke="' + stroke + '" stroke-width="' + (w || 2) + '"' + (dash ? ' stroke-dasharray="6 5"' : '') + '/>'; }
function segM1(L, P, a, b, color, w, dash){ return L.line(P.X(a[0]), P.Y(a[1]), P.X(b[0]), P.Y(b[1]), color, w || 2, dash); }

// Lab 1 — Grid city: addresses and walking along streets (§1.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "shop"};
  var V = {xmin: -5, xmax: 5, ymin: -4, ymax: 4, s: 30, top: 24};
  var trips = {shop: [[-1, 2], [3, 2]], route: [[-2, 3], [4, 3], [4, -1]]};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.05, speed: 1});
    L.legend(id === "one" ? [[C.path, "crossings a 4-block walk from the centre"]] : [[C.path, "walk along the streets"], [C.disp, "straight line"]]);
    L.watch({shop: "Worked example: the warehouse is 1 block West and 2 blocks North of the centre; the shop is 3 East and 2 North. Streets are 10 m apart.", route: "Quiz: from crossing (−2, 3) to crossing (4, −1). The walker must follow the streets; the dashed line is the straight-line gap.", one: "Prediction: which crossings are ‘4 blocks from the centre’? Each lights up as it is found."}[id]);
    L.controls(""); L.restart(true);
  }
  function legLen(a, b){ return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]); }
  function walked(p, d){
    var out = [p[0]];
    for(var i = 1; i < p.length; i++){
      var s = legLen(p[i - 1], p[i]);
      if(d >= s){ out.push(p[i]); d -= s; }
      else { var f = s ? d / s : 0; out.push([p[i - 1][0] + f * (p[i][0] - p[i - 1][0]), p[i - 1][1] + f * (p[i][1] - p[i - 1][1])]); break; }
    }
    return out;
  }
  function draw(t){
    var P = planeM1(L, V), m = P.svg, msg;
    m += L.text(P.X(0) + 6, P.Y(0) + 14, "centre", {size: 10, color: C.muted, anchor: "start"}) + L.text(P.X(5) + 26, P.Y(4) + 4, "N ↑", {size: 11, color: C.muted});
    if(st.preset === "one"){
      var pts = [];
      for(var x = -4; x <= 4; x++) for(var y = -4; y <= 4; y++) if(Math.abs(x) + Math.abs(y) === 4) pts.push([x, y]);
      pts.sort(function(a, b){ return Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]); });
      var k = Math.floor(clampM1(t / 4, 0, 1) * pts.length + 1e-9);
      pts.slice(0, k).forEach(function(p){ m += dotM1(L, P, p, C.path); });
      m += dotM1(L, P, [0, 0], C.text);
      L.svg(m, "Grid city: crossings four blocks from the centre", P.h);
      L.readout([["Crossings found", String(k), C.path], ["Walk from the centre", "4 blocks = 40 m"]]);
      msg = t < 4 ? "Searching the grid…" : "<b>16 crossings</b> are a 4-block walk from the centre, so one number cannot fix the bakery. Two numbers can: (3, 1) means 3 blocks East and 1 block North.";
    } else {
      var path = trips[st.preset], a = path[0], b = path[path.length - 1], len = 0;
      for(var i = 1; i < path.length; i++) len += legLen(path[i - 1], path[i]);
      var done = clampM1(t / 4, 0, 1) * len, w = walked(path, done);
      m += segM1(L, P, a, b, C.disp, 2, "6 5");
      for(var j = 1; j < path.length; j++) m += segM1(L, P, path[j - 1], path[j], C.faint, 5);
      for(var q = 1; q < w.length; q++) m += segM1(L, P, w[q - 1], w[q], C.path, 5);
      var shop = st.preset === "shop";
      m += dotM1(L, P, a, C.vel, (shop ? "warehouse " : "start ") + ptM1(a[0], a[1])) + dotM1(L, P, b, C.ok, (shop ? "shop " : "end ") + ptM1(b[0], b[1]), 8, 20);
      var pos = w[w.length - 1];
      m += L.circle(P.X(pos[0]), P.Y(pos[1]), 7, C.path);
      L.svg(m, "Walking in a grid city", P.h);
      L.readout([["Blocks East–West", String(Math.abs(b[0] - a[0]))], ["Blocks North–South", String(Math.abs(b[1] - a[1]))], ["Walked so far", L.num(done * 10, 0) + " m", C.path], ["Straight line", L.num(Math.sqrt(d2M1(a, b)) * 10, 1) + " m", C.disp]]);
      msg = t < 4 ? "Walking…" : shop ? "Warehouse (−1, 2) and shop (3, 2) share y = 2, so the walk is |3 − (−1)| = 4 blocks = <b>40 m</b>." : "Along the streets: 6 + 4 = 10 blocks = <b>100 m</b>. A straight line would be only about 72.1 m, but no street goes that way.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["shop", "Worked example: warehouse to shop"], ["route", "Quiz: (−2, 3) to (4, −1)"], ["one", "Prediction: one number is not enough"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.grid = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Axes: points on the axes (Fig. 1.2) and the doors of Reiaan’s room (Exercise Set 1.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "fig12"};
  var V = {xmin: -4, xmax: 13, ymin: -5, ymax: 11, s: 19, top: 20, every: 2};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.05, speed: 1});
    L.legend(id === "fig12" ? [[C.vel, "points on the x-axis"], [C.acc, "points on the y-axis"]] : [[C.path, "door"], [C.faint, "walls of the room"]]);
    L.watch({fig12: "Fig. 1.2: B, E, H and G appear one by one. Notice which coordinate is zero on each axis.", door: "Exercise Set 1.1: the room door D₁R₁ lies on the x-axis from the +8 mark to R₁ (11.5, 0). 1 unit = 1 ft.", bath: "Exercise Set 1.1 (iv): the bathroom door B₁B₂ lies on the y-axis from (0, 1.5) to (0, 4)."}[id]);
    L.controls(""); L.restart(true);
  }
  function room(P){ return polyM1(P, [[0, 0], [12, 0], [12, 10], [0, 10]], C.faint, "rgba(148,163,184,0.08)", 3) + dotM1(L, P, [0, 10], C.muted, "C (0, 10)", 6, -6) + dotM1(L, P, [12, 10], C.muted, "B (12, 10)", -70, -8) + dotM1(L, P, [12, 0], C.muted, "A (12, 0)", 6, -8); }
  function draw(t){
    var P = planeM1(L, V), m = P.svg, msg;
    if(st.preset === "fig12"){
      var pts = [["B", 4.5, 0, C.vel], ["E", -2.9, 0, C.vel], ["H", 0, 4, C.acc], ["G", 0, -4.5, C.acc]];
      pts.forEach(function(p, i){
        var f = clampM1(t - i, 0, 1);
        if(f <= 0) return;
        m += segM1(L, P, [0, 0], [p[1] * f, p[2] * f], p[3], 3) + dotM1(L, P, [p[1] * f, p[2] * f], p[3], f >= 1 ? p[0] + " " + ptM1(p[1], p[2]) : "", 8, p[2] < 0 ? 14 : -8);
      });
      m += dotM1(L, P, [0, 0], C.text, "O (0, 0)", 6, 16);
      L.svg(m, "Points on the axes", P.h);
      L.readout(pts.map(function(p, i){ return [p[0], t >= i + 1 ? ptM1(p[1], p[2]) : "…", p[3]]; }).concat([["EB", t >= 2 ? L.num(4.5 + 2.9, 1) + " units" : "…"]]));
      msg = t < 4 ? "Plotting…" : "B and E lie on the x-axis, so y = 0; H and G lie on the y-axis, so x = 0. EB = |4.5 − (−2.9)| = <b>7.4 units</b>.";
    } else if(st.preset === "door"){
      var f = clampM1(t / 3, 0, 1);
      m += room(P) + segM1(L, P, [8, 0], [8 + 3.5 * f, 0], C.path, 6) + dotM1(L, P, [8, 0], C.path, "D₁ (8, 0)", -30, 20) + (f >= 1 ? dotM1(L, P, [11.5, 0], C.path, "R₁ (11.5, 0)", -20, 36) : "") + dotM1(L, P, [0, 0], C.text, "O", -14, 16);
      L.svg(m, "Room door on the x-axis", P.h);
      L.readout([["D₁", "(8, 0)", C.path], ["R₁", "(11.5, 0)", C.path], ["Door width", nM1(3.5 * f) + " ft", C.path], ["In metres", L.num(3.5 * f * 0.3048, 2) + " m"]]);
      msg = t < 3 ? "Measuring along the x-axis…" : "D₁R₁ = |11.5 − 8| = <b>3.5 ft</b> (about 1.07 m): comfortable, and wider than the roughly 0.9 m a wheelchair needs. The door is 8 ft from the y-axis and lies on the x-axis.";
    } else {
      var g = clampM1(t / 3, 0, 1);
      m += room(P) + segM1(L, P, [8, 0], [11.5, 0], C.faint, 6) + segM1(L, P, [0, 1.5], [0, 1.5 + 2.5 * g], C.path, 6) + dotM1(L, P, [0, 1.5], C.path, "B₁ (0, 1.5)", 8, 4) + (g >= 1 ? dotM1(L, P, [0, 4], C.path, "B₂ (0, 4)", 8, 4) : "") + dotM1(L, P, [0, 0], C.text, "O", -14, 16);
      L.svg(m, "Bathroom door on the y-axis", P.h);
      L.readout([["B₁", "(0, 1.5)", C.path], ["B₂", "(0, 4)", C.path], ["Bathroom door", nM1(2.5 * g) + " ft", C.path], ["Room door", "3.5 ft"]]);
      msg = t < 3 ? "Measuring along the y-axis…" : "B₁B₂ = |4 − 1.5| = <b>2.5 ft</b>, so the bathroom door is 1 ft narrower than the room door (3.5 ft).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["fig12", "Fig. 1.2: points on the axes"], ["door", "Set 1.1: room door D₁R₁"], ["bath", "Set 1.1: bathroom door B₁B₂"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.axes = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Quadrants and ordered pairs (Fig. 1.4, Think and Reflect)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "S", x: 2, y: 6};
  var V = {xmin: -8, xmax: 8, ymin: -8, ymax: 8, s: 17, top: 22, every: 2};
  var P0 = {S: [3, -5], Q: [-5, 3], diag: [4, 4], axis: [0, -3]};
  function quad(x, y){ return x === 0 || y === 0 ? "on an axis" : x > 0 && y > 0 ? "Quadrant I" : x < 0 && y > 0 ? "Quadrant II" : x < 0 ? "Quadrant III" : "Quadrant IV"; }
  function signs(x, y){ var s = function(v){ return v > 0 ? "+" : v < 0 ? "−" : "0"; }; return "(" + s(x) + ", " + s(y) + ")"; }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 1});
    L.legend([[C.vel, "move along x"], [C.acc, "move along y"], [C.path, "P (x, y)"], [C.disp, "swapped point (y, x)"]]);
    L.watch({S: "Fig. 1.4: S (3, −5). Move 3 along the x-axis, then 5 down.", Q: "Fig. 1.4: Q (−5, 3), the same two numbers as S in the other order.", diag: "Think and Reflect 3: when does (y, x) land on (x, y)?", axis: "Think and Reflect 1: a point on the y-axis.", explore: "Move the sliders to place P anywhere; the readout names its quadrant."}[id]);
    if(id === "explore"){
      L.controls(L.slider("m1qx", "x", -8, 8, 1, st.x, nM1(st.x)) + L.slider("m1qy", "y", -8, 8, 1, st.y, nM1(st.y)));
      L.onInput("m1qx", function(v){ st.x = v; L.setVal("m1qx", nM1(v)); App.resetTimeline(); App.play(); });
      L.onInput("m1qy", function(v){ st.y = v; L.setVal("m1qy", nM1(v)); App.resetTimeline(); App.play(); });
    } else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var P = planeM1(L, V), m = P.svg, p = st.preset === "explore" ? [st.x, st.y] : P0[st.preset], x = p[0], y = p[1], msg;
    [["I", 5, 7], ["II", -5, 7], ["III", -5, -7], ["IV", 5, -7]].forEach(function(q){ m += L.text(P.X(q[1]), P.Y(q[2]), "Quadrant " + q[0], {size: 11, color: C.muted}); });
    var fx = clampM1(t, 0, 1), fy = clampM1(t - 1, 0, 1), g = clampM1(t - 2, 0, 1);
    m += segM1(L, P, [0, 0], [x * fx, 0], C.vel, 3);
    if(fx >= 1) m += segM1(L, P, [x, 0], [x, y * fy], C.acc, 3);
    if(fy >= 1) m += segM1(L, P, [0, y], [x, y], C.faint, 1.5, "5 4") + dotM1(L, P, [x, y], C.path, "P " + ptM1(x, y));
    if(g > 0 && x !== y) m += '<g opacity="' + L.num(g, 2) + '">' + dotM1(L, P, [y, x], C.disp, "(y, x) = " + ptM1(y, x), 8, 16) + '</g>';
    m += dotM1(L, P, [0, 0], C.text, "O", -14, 16);
    L.svg(m, "Quadrants and ordered pairs", P.h);
    L.readout([["x-coordinate", fx >= 1 ? nM1(x) : "…", C.vel], ["y-coordinate", fy >= 1 ? nM1(y) : "…", C.acc], ["Signs", fy >= 1 ? signs(x, y) : "…"], ["Where", fy >= 1 ? quad(x, y) : "…", C.path]]);
    if(t < 3) msg = "Locating the point…";
    else if(x === 0 || y === 0) msg = ptM1(x, y) + " lies on " + (x === 0 && y === 0 ? "both axes (it is the origin)" : x === 0 ? "the y-axis" : "the x-axis") + ", so it is in <b>no quadrant</b>. Swapping gives " + ptM1(y, x) + (x === y ? ", the same point." : ", which lies on the other axis.");
    else if(x === y) msg = ptM1(x, y) + " is in <b>" + quad(x, y) + "</b>. Swapping gives the same point: (x, y) = (y, x) only when x = y.";
    else msg = ptM1(x, y) + " is in <b>" + quad(x, y) + "</b> " + signs(x, y) + ". Swapping gives " + ptM1(y, x) + " in " + quad(y, x) + ": a different point, since x ≠ y.";
    L.verdict(msg);
  }
  function mount(){ L.presets([["S", "Fig. 1.4: S (3, −5)"], ["Q", "Fig. 1.4: Q (−5, 3)"], ["diag", "Think and Reflect: (4, 4)"], ["axis", "Think and Reflect: (0, −3)"], ["explore", "Explore: place P"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.quadrants = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Room planner (Exercise Set 1.2, Fig. 1.5)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "table", w: 2.5};
  var VIEWS = {
    table: {xmin: -1, xmax: 13, ymin: -1, ymax: 11, s: 24, top: 18, every: 1},
    door: {xmin: -1, xmax: 8, ymin: -1, ymax: 6, s: 40, top: 18, every: 1},
    bath: {xmin: -7, xmax: 1, ymin: -1, ymax: 10, s: 26, top: 18, every: 1},
    dining: {xmin: -7, xmax: 13, ymin: -16, ymax: 11, s: 11, top: 16, every: 3}
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 1});
    L.legend({table: [[C.path, "study table"], [C.faint, "bed, wardrobe and walls"]], door: [[C.path, "bathroom door and its sweep"], [C.danger, "wardrobe"]], bath: [[C.vel, "bathroom"], [C.path, "showering area SHWR"]], dining: [[C.vel, "dining room"], [C.path, "dining table"]]}[id]);
    L.watch({table: "Set 1.2 Q1: three feet of the study table are at (8, 9), (11, 9) and (11, 7). Where must the fourth foot go?", door: "Set 1.2 Q2: the bathroom door is hinged at B₁ (0, 1.5) and swings into the bedroom. Change the width of the door to see when it hits the wardrobe.", bath: "Set 1.2 Q3: the bathroom and its showering area, read from the grid of Fig. 1.5.", dining: "Set 1.2 Q4: the dining room runs 18 ft from P to A and 15 ft below the x-axis; the 5 ft × 3 ft table goes in the centre."}[id]);
    if(id === "door"){
      L.controls(L.slider("m1dw", "Door width (ft)", 1.5, 4, 0.5, st.w, nM1(st.w) + " ft"));
      L.onInput("m1dw", function(v){ st.w = v; L.setVal("m1dw", nM1(v) + " ft"); App.resetTimeline(); App.play(); });
    } else L.controls("");
    L.restart(true);
  }
  function rectPts(x1, y1, x2, y2){ return [[x1, y1], [x2, y1], [x2, y2], [x1, y2]]; }
  function furniture(P){
    return polyM1(P, rectPts(0, 0, 12, 10), C.faint, "none", 3) + polyM1(P, rectPts(3, 0, 7, 2), C.faint, "rgba(161,98,7,0.25)", 2) + polyM1(P, rectPts(0.5, 5, 6.5, 8), C.faint, "rgba(56,189,248,0.10)", 2) + L.text(P.X(5), P.Y(1) + 4, "wardrobe", {size: 10, color: C.muted}) + L.text(P.X(3.5), P.Y(6.5) + 4, "bed", {size: 10, color: C.muted});
  }
  function draw(t){
    var id = st.preset, P = planeM1(L, VIEWS[id]), m = P.svg, msg, f = clampM1(t / 3, 0, 1);
    if(id === "table"){
      m += furniture(P) + L.circle(P.X(11.4), P.Y(9.5), 6, "#15803d");
      [[8, 9], [11, 9], [11, 7]].forEach(function(p){ m += dotM1(L, P, p, C.path, ptM1(p[0], p[1]), 6, p[1] === 9 ? -8 : 16); });
      if(f > 0.5) m += polyM1(P, [[8, 9], [11, 9], [11, 7], [8, 7]], C.path, "rgba(245,158,11,0.18)", 2) + dotM1(L, P, [8, 7], C.ok, "4th foot (8, 7)", -100, 18);
      L.svg(m, "Placing the study table", P.h);
      L.readout([["Fourth foot", f > 0.5 ? "(8, 7)" : "…", C.ok], ["Length (along x)", "|11 − 8| = 3 ft"], ["Width (along y)", "|9 − 7| = 2 ft"], ["Height", "not on a floor plan"]]);
      msg = t < 3 ? "Completing the rectangle…" : "The fourth foot is at <b>(8, 7)</b>. The table is 3 ft × 2 ft and fits between the bed and the right wall, clear of both doors.";
    } else if(id === "door"){
      var w = st.w, arc = [], k;
      for(k = 0; k <= 24; k++){ var a = (Math.PI / 2) * (1 - f * k / 24); arc.push([w * Math.cos(a), 1.5 + w * Math.sin(a)]); }
      var e = arc[arc.length - 1];
      m += polyM1(P, rectPts(3, 0, 7, 2), C.danger, "rgba(239,68,68,0.15)", 2) + L.text(P.X(5), P.Y(1) + 4, "wardrobe", {size: 11, color: C.danger});
      m += L.line(P.X(0), P.Y(0), P.X(0), P.Y(6), C.faint, 4) + L.line(P.X(0), P.Y(0), P.X(8), P.Y(0), C.faint, 4);
      m += '<path d="M ' + P.X(0) + ' ' + P.Y(1.5) + arc.map(function(p){ return ' L ' + P.X(p[0]) + ' ' + P.Y(p[1]); }).join("") + ' Z" fill="rgba(245,158,11,0.15)" stroke="none"/>';
      m += '<path d="' + arc.map(function(p, i){ return (i ? ' L ' : 'M ') + P.X(p[0]) + ' ' + P.Y(p[1]); }).join("") + '" fill="none" stroke="' + C.path + '" stroke-width="1.5" stroke-dasharray="5 4"/>';
      m += segM1(L, P, [0, 1.5], e, C.path, 6) + dotM1(L, P, [0, 1.5], C.text, "hinge B₁ (0, 1.5)", 8, 18);
      var gap = 3 - w;
      L.svg(m, "Swinging bathroom door", P.h);
      L.readout([["Door width", nM1(w) + " ft", C.path], ["Hinge to wardrobe", "3 ft"], ["Clearance", L.num(gap, 1) + " ft", gap > 0 ? C.ok : C.danger], ["Angle opened", L.num(90 * f, 0) + "°"]]);
      msg = t < 3 ? "Opening the door…" : Math.abs(gap) < 1e-9 ? "A 3 ft door just <b>touches</b> the wardrobe when fully open. Any wider and it hits." : gap > 0 ? "The door’s edge stays within " + nM1(w) + " ft of B₁, but the wardrobe is 3 ft away, so the door <b>clears by " + L.num(gap, 1) + " ft</b>. A door wider than 3 ft would hit it." : "A " + nM1(w) + " ft door reaches past x = 3 and <b>hits the wardrobe</b>. Hinge it at B₂, open it into the bathroom, use a sliding door or move the wardrobe.";
    } else if(id === "bath"){
      var S = [-6, 6], H = [-3, 6], W = [-2, 9], R = [-6, 9];
      m += polyM1(P, [[0, 0], [0, 9], [-6, 9], [-6, 0]], C.vel, "rgba(56,189,248,0.10)", 3);
      if(f > 0.3) m += polyM1(P, [S, H, W, R], C.path, "rgba(245,158,11,0.22)", 3) + dotM1(L, P, S, C.path, "S (−6, 6)", 8, 16) + dotM1(L, P, H, C.path, "H (−3, 6)", 6, 16) + dotM1(L, P, W, C.path, "W (−2, 9)", 6, -8);
      m += dotM1(L, P, [0, 0], C.text, "O (0, 0)", 6, 16) + dotM1(L, P, [0, 9], C.text, "F (0, 9)", 6, -6) + dotM1(L, P, R, C.text, "R (−6, 9)", -8, -10) + dotM1(L, P, [-6, 0], C.text, "P (−6, 0)", -8, 16);
      L.svg(m, "Reiaan’s bathroom", P.h);
      L.readout([["Bathroom", "6 ft × 9 ft", C.vel], ["SH (on y = 6)", "3 ft", C.path], ["RW (on y = 9)", "4 ft", C.path], ["Shower area", f >= 1 ? "½ × (3 + 4) × 3 = 10.5 sq ft" : "…"]]);
      msg = t < 3 ? "Reading the corners…" : "Corners O (0, 0), F (0, 9), R (−6, 9), P (−6, 0). SH and RW are both horizontal, and RS is vertical, so SHWR is a <b>right trapezium</b>.";
    } else {
      m += polyM1(P, rectPts(-6, 0, 12, 10), C.faint, "none", 2) + L.text(P.X(3), P.Y(5), "bathroom and bedroom", {size: 10, color: C.muted});
      if(f > 0) m += polyM1(P, [[-6, 0], [12, 0], [12, -15 * f], [-6, -15 * f]], C.vel, "rgba(56,189,248,0.10)", 3);
      m += dotM1(L, P, [-6, 0], C.text, "P (−6, 0)", -8, -8) + dotM1(L, P, [12, 0], C.text, "A (12, 0)", -8, -8);
      if(f >= 1) m += dotM1(L, P, [12, -15], C.vel, "(12, −15)", -62, 18) + dotM1(L, P, [-6, -15], C.vel, "(−6, −15)", 6, 18) + segM1(L, P, [-6, 0], [12, -15], C.faint, 1.5, "5 4") + polyM1(P, rectPts(0.5, -6, 5.5, -9), C.path, "rgba(245,158,11,0.3)", 2) + dotM1(L, P, [3, -7.5], C.ok, "centre (3, −7.5)", 10, 4);
      L.svg(m, "Dining room and its table", P.h);
      L.readout([["Length PA", "|12 − (−6)| = 18 ft", C.vel], ["Width", "15 ft", C.vel], ["Centre", f >= 1 ? "(3, −7.5)" : "…", C.ok], ["Table feet", f >= 1 ? "(0.5, −6), (5.5, −6), (5.5, −9), (0.5, −9)" : "…", C.path]]);
      msg = t < 3 ? "Building the dining room below the x-axis…" : "Corners (−6, 0), (12, 0), (12, −15), (−6, −15). Centre <b>(3, −7.5)</b>; the table’s feet are at (0.5, −6), (5.5, −6), (5.5, −9) and (0.5, −9).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["table", "Set 1.2 Q1: study table"], ["door", "Set 1.2 Q2: door and wardrobe"], ["bath", "Set 1.2 Q3: the bathroom"], ["dining", "Set 1.2 Q4: dining room"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.room = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Distance formula (Figs. 1.6–1.8)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "AD", a: [1, 2], b: [4, 6]};
  var V = {xmin: -6, xmax: 11, ymin: -6, ymax: 8, s: 20, top: 20, every: 2};
  var SEG = {AD: [[3, 4], [7, 1], "A", "D"], DM: [[7, 1], [9, 6], "D", "M"], MA: [[9, 6], [3, 4], "M", "A"]};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 1});
    L.legend([[C.acc, "shift along y"], [C.vel, "shift along x"], [C.path, "distance (hypotenuse)"]]);
    L.watch({AD: "Figs. 1.6–1.7: from A (3, 4) to D (7, 1). First the shift along y (AC), then along x (CD), then the hypotenuse AD.", DM: "Fig. 1.6: side DM of triangle ADM.", MA: "Fig. 1.6: side MA. The shifts are negative here, but squaring removes the signs.", explore: "Move the two points; the right triangle and the distance update."}[id]);
    if(id === "explore"){
      var s = function(k, lab, v){ return L.slider(k, lab, -6, 10, 1, v, nM1(v)); };
      L.controls(s("m1x1", "x₁", st.a[0]) + s("m1y1", "y₁", st.a[1]) + s("m1x2", "x₂", st.b[0]) + s("m1y2", "y₂", st.b[1]));
      [["m1x1", "a", 0], ["m1y1", "a", 1], ["m1x2", "b", 0], ["m1y2", "b", 1]].forEach(function(c){ L.onInput(c[0], function(v){ st[c[1]][c[2]] = v; L.setVal(c[0], nM1(v)); App.resetTimeline(); App.play(); }); });
    } else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var P = planeM1(L, V), m = P.svg, seg = st.preset === "explore" ? [st.a, st.b, "P", "Q"] : SEG[st.preset], A = seg[0], B = seg[1], K = [A[0], B[1]], msg;
    if(st.preset !== "explore") m += polyM1(P, [[3, 4], [7, 1], [9, 6]], C.faint, "rgba(148,163,184,0.10)", 1.5);
    var f1 = clampM1(t, 0, 1), f2 = clampM1(t - 1, 0, 1), f3 = clampM1(t - 2, 0, 1);
    m += segM1(L, P, A, [A[0], A[1] + (K[1] - A[1]) * f1], C.acc, 4);
    if(f1 >= 1) m += segM1(L, P, K, [K[0] + (B[0] - K[0]) * f2, K[1]], C.vel, 4);
    if(f2 >= 1) m += segM1(L, P, A, [A[0] + (B[0] - A[0]) * f3, A[1] + (B[1] - A[1]) * f3], C.path, 4);
    m += dotM1(L, P, A, C.text, seg[2] + " " + ptM1(A[0], A[1])) + dotM1(L, P, B, C.text, seg[3] + " " + ptM1(B[0], B[1]), 8, 18);
    L.svg(m, "Distance between two points", P.h);
    var dx = B[0] - A[0], dy = B[1] - A[1], n = dx * dx + dy * dy, name = seg[2] + seg[3];
    L.readout([["Shift along x", f2 >= 1 ? nM1(dx) : "…", C.vel], ["Shift along y", f1 >= 1 ? nM1(dy) : "…", C.acc], ["(Δx)² + (Δy)²", f2 >= 1 ? String(n) : "…"], [name, t >= 3 ? rootM1(n) + " units" : "…", C.path]]);
    msg = t < 3 ? "Building the right triangle…" : name + " = √(" + nM1(Math.abs(dx)) + "² + " + nM1(Math.abs(dy)) + "²) = <b>" + rootM1(n) + " units</b>.";
    L.verdict(msg);
  }
  function mount(){ L.presets([["AD", "Fig. 1.7: AD"], ["DM", "Fig. 1.6: DM"], ["MA", "Fig. 1.6: MA"], ["explore", "Explore: any two points"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.distance = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Reflection preserves lengths (Fig. 1.9)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "yaxis"};
  var V = {xmin: -10, xmax: 10, ymin: -7, ymax: 7, s: 18, top: 20, every: 2};
  var T = [["A", 3, 4], ["D", 7, 1], ["M", 9, 6]];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 2, step: 0.04, speed: 1});
    L.legend([[C.vel, "original"], [C.path, "image"], [C.danger, "mirror line"]]);
    L.watch({yaxis: "Fig. 1.9: triangle ADM is reflected in the y-axis. Each vertex moves straight across the mirror to the same distance on the other side.", xaxis: "Think and Reflect 2: the same triangle reflected in the x-axis instead.", point: "Prediction: the point (5, −2) reflected in the y-axis."}[id]);
    L.controls(""); L.restart(true);
  }
  function img(p){ return st.preset === "xaxis" ? [p[0], -p[1]] : [-p[0], p[1]]; }
  function sides(p){ return [d2M1(p[0], p[1]), d2M1(p[1], p[2]), d2M1(p[2], p[0])]; }
  function draw(t){
    var P = planeM1(L, V), m = P.svg, f = clampM1(t / 2, 0, 1), msg;
    m += st.preset === "xaxis" ? L.line(P.X(-10), P.Y(0), P.X(10), P.Y(0), C.danger, 2.5) : L.line(P.X(0), P.Y(-7), P.X(0), P.Y(7), C.danger, 2.5);
    if(st.preset === "point"){
      var cur = [5 - 10 * f, -2];
      m += segM1(L, P, [5, -2], cur, C.path, 2, "5 4") + dotM1(L, P, [5, -2], C.vel, "(5, −2)", 8, 18) + dotM1(L, P, cur, C.path, f >= 1 ? "image (−5, −2)" : "", -104, 18);
      L.svg(m, "Reflecting a point", P.h);
      L.readout([["Point", "(5, −2)", C.vel], ["Image", f >= 1 ? "(−5, −2)" : "…", C.path], ["Distance to the y-axis", "5 units each"], ["Point to image", f >= 1 ? "10 units" : "…"]]);
      msg = t < 2 ? "Reflecting…" : "(5, −2) → <b>(−5, −2)</b>: only the sign of x changes, and both points are 5 units from the y-axis.";
    } else {
      var orig = T.map(function(v){ return [v[1], v[2]]; }), im = orig.map(img);
      var mov = orig.map(function(p, i){ return [p[0] + (im[i][0] - p[0]) * f, p[1] + (im[i][1] - p[1]) * f]; });
      m += polyM1(P, orig, C.vel, "rgba(56,189,248,0.12)", 2.5) + polyM1(P, mov, C.path, f >= 1 ? "rgba(245,158,11,0.18)" : "none", 2.5, f < 1);
      T.forEach(function(v, i){ m += dotM1(L, P, orig[i], C.vel, v[0], 6, -6); if(f >= 1) m += dotM1(L, P, im[i], C.path, v[0] + "′ " + ptM1(im[i][0], im[i][1]), st.preset === "xaxis" ? 6 : -88, st.preset === "xaxis" ? 18 : -6); });
      L.svg(m, "Reflecting triangle ADM", P.h);
      var so = sides(orig), si = sides(im), done = f >= 1;
      L.readout([["AD → A′D′", rootM1(so[0]) + " → " + (done ? rootM1(si[0]) : "…")], ["DM → D′M′", rootM1(so[1]) + " → " + (done ? rootM1(si[1]) : "…")], ["MA → M′A′", rootM1(so[2]) + " → " + (done ? rootM1(si[2]) : "…")], ["Images", done ? im.map(function(p){ return ptM1(p[0], p[1]); }).join(", ") : "…", C.path]]);
      msg = t < 2 ? "Reflecting in the " + (st.preset === "xaxis" ? "x" : "y") + "-axis…" : "Images " + im.map(function(p, i){ return T[i][0] + "′ " + ptM1(p[0], p[1]); }).join(", ") + ". The sides are still 5, √29 and √40 units: <b>lengths are preserved</b>, though the triangle is flipped.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["yaxis", "Fig. 1.9: reflect in the y-axis"], ["xaxis", "Reflect in the x-axis"], ["point", "Prediction: (5, −2)"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.reflect = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Coordinate tools: midpoints, collinearity, circles, icons, a square (End-of-Chapter Exercises)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "midpoint"};
  var V = {xmin: -10, xmax: 10, ymin: -13, ymax: 10, s: 12.5, top: 16, every: 2};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 2, step: 0.04, speed: 1});
    L.legend(id === "icons" ? [[C.vel, "icon A (radius 80)"], [C.acc, "icon B (radius 100)"], [C.path, "distance between centres"]] : [[C.path, "measured distances"], [C.ok, "result"]]);
    L.watch({midpoint: "Worked example: the midpoint of S (−2, 5) and T (6, −1), checked with the distance formula.", collinear: "End-of-Chapter Q6: M (−3, −4), A (0, 0), G (6, 8).", nearly: "End-of-Chapter Q7: R (−5, −1), B (−2, −5), C (4, −12) look collinear. Do they pass the distance test?", circle: "End-of-Chapter Q12: circle K centred at O through A, B and C; then D and E.", icons: "End-of-Chapter Q15: two circular icons on an 800 × 600 pixel screen (drawn at 2 : 5 scale).", square: "End-of-Chapter Q16: is ABCD a square?"}[id]);
    L.controls(""); L.restart(true);
  }
  function lab(p){ return p[2] + " " + ptM1(p[0], p[1]); }
  function draw(t){
    var f = clampM1(t / 2, 0, 1), m, msg;
    if(st.preset === "icons"){
      var k = 0.4, SX = function(x){ return 200 + x * k; }, SY = function(y){ return 270 - y * k; };
      m = L.rect(SX(0), SY(600), 800 * k, 600 * k, "rgba(148,163,184,0.06)", ' stroke="' + C.faint + '" stroke-width="2"') + L.text(SX(400), SY(600) - 6, "screen 800 × 600 px", {size: 11, color: C.muted}) + L.text(SX(0) - 4, SY(0) + 14, "(0, 0)", {size: 10, color: C.muted, anchor: "end"});
      m += L.circle(SX(100), SY(150), 80 * k, "rgba(56,189,248,0.18)", ' stroke="' + C.vel + '" stroke-width="2"') + L.circle(SX(250), SY(230), 100 * k, "rgba(244,114,182,0.18)", ' stroke="' + C.acc + '" stroke-width="2"');
      m += L.line(SX(100), SY(150), SX(100 + 150 * f), SY(150 + 80 * f), C.path, 3) + L.circle(SX(100), SY(150), 3, C.vel) + L.circle(SX(250), SY(230), 3, C.acc) + L.text(SX(100) - 6, SY(150) + 16, "A (100, 150)", {size: 10, color: C.vel, anchor: "end"}) + L.text(SX(250) + 8, SY(230) - 8, "B (250, 230)", {size: 10, color: C.acc, anchor: "start"});
      L.svg(m, "Two circular icons on a screen", 300);
      L.readout([["Icon A spans", "x 20–180, y 70–230", C.vel], ["Icon B spans", "x 150–350, y 130–330", C.acc], ["AB", f >= 1 ? "√(150² + 80²) = 170 px" : "…", C.path], ["Sum of radii", "180 px"]]);
      msg = t < 2 ? "Measuring…" : "Both icons stay inside the screen. AB = 170 px, less than 80 + 100 = 180 px, so the circles <b>intersect</b>.";
      L.verdict(msg); return;
    }
    var P = planeM1(L, V);
    m = P.svg;
    if(st.preset === "midpoint"){
      var S = [-2, 5, "S"], T2 = [6, -1, "T"], M = [2, 2, "M"];
      m += segM1(L, P, S, T2, C.faint, 2) + dotM1(L, P, S, C.text, lab(S)) + dotM1(L, P, T2, C.text, lab(T2), 8, 18);
      if(f > 0.4) m += dotM1(L, P, M, C.ok, lab(M), 10, 4);
      L.svg(m, "Midpoint of ST", P.h);
      L.readout([["x of M", "(−2 + 6) ÷ 2 = 2"], ["y of M", "(5 + (−1)) ÷ 2 = 2"], ["MS", f >= 1 ? "5 units" : "…", C.path], ["MT", f >= 1 ? "5 units" : "…", C.path]]);
      msg = t < 2 ? "Averaging the coordinates…" : "M = <b>(2, 2)</b>, and MS = MT = 5 units: M is exactly halfway along ST (ST = 10 units).";
    } else if(st.preset === "collinear" || st.preset === "nearly"){
      var pts = st.preset === "collinear" ? [[-3, -4, "M"], [0, 0, "A"], [6, 8, "G"]] : [[-5, -1, "R"], [-2, -5, "B"], [4, -12, "C"]];
      var a = pts[0], b = pts[1], c = pts[2], ab = Math.sqrt(d2M1(a, b)), bc = Math.sqrt(d2M1(b, c)), ac = Math.sqrt(d2M1(a, c));
      m += segM1(L, P, a, [a[0] + (c[0] - a[0]) * f, a[1] + (c[1] - a[1]) * f], C.faint, 1.5, "5 4") + segM1(L, P, a, b, C.path, 3) + segM1(L, P, b, c, C.path, 3);
      pts.forEach(function(p, i){ m += dotM1(L, P, p, C.text, lab(p), 8, i === 2 ? 18 : -8); });
      L.svg(m, "Collinearity test", P.h);
      var nm = [a[2] + b[2], b[2] + c[2], a[2] + c[2]];
      L.readout([[nm[0], L.num(ab, 3), C.path], [nm[1], L.num(bc, 3), C.path], [nm[0] + " + " + nm[1], f >= 1 ? L.num(ab + bc, 3) : "…"], [nm[2], f >= 1 ? L.num(ac, 3) : "…", C.ok]]);
      msg = t < 2 ? "Measuring the three distances…" : st.preset === "collinear" ? "MA + AG = 5 + 10 = 15 = MG, so the points are <b>collinear</b>." : "RB + BC ≈ 14.220 but RC ≈ 14.213. The sum is not equal, so the points are <b>not collinear</b>, though they very nearly are.";
    } else if(st.preset === "circle"){
      m += L.circle(P.X(0), P.Y(0), Math.sqrt(65) * V.s, "rgba(52,211,153,0.08)", ' stroke="' + C.ok + '" stroke-width="2"');
      [[1, -8, "A"], [-4, 7, "B"], [-7, -4, "C"]].forEach(function(p){ m += segM1(L, P, [0, 0], [p[0] * f, p[1] * f], C.path, 1.5) + dotM1(L, P, p, C.ok, lab(p), 6, p[1] < 0 ? 16 : -6); });
      if(f >= 1) m += dotM1(L, P, [-5, 6, "D"], C.vel, "D (−5, 6)", -60, 18) + dotM1(L, P, [0, 9, "E"], C.danger, "E (0, 9)", 8, -2);
      m += dotM1(L, P, [0, 0], C.text, "O", -12, 16);
      L.svg(m, "Circle K centred at the origin", P.h);
      L.readout([["OA = OB = OC", "√65 ≈ 8.06", C.ok], ["OD", f >= 1 ? "√61 ≈ 7.81, inside" : "…", C.vel], ["OE", f >= 1 ? "9, outside" : "…", C.danger]]);
      msg = t < 2 ? "Measuring from O…" : "A, B and C are all √65 ≈ 8.06 units from O, so they lie on circle K. D is <b>inside</b> (√61 is less than √65) and E is <b>outside</b> (9 is more than √65).";
    } else {
      var Q = [[2, 1, "A"], [-1, 2, "B"], [-2, -1, "C"], [1, -2, "D"]];
      m += polyM1(P, Q, C.path, "rgba(245,158,11," + L.num(0.25 * f, 2) + ")", 3);
      if(f >= 1) m += segM1(L, P, Q[0], Q[2], C.faint, 1.5, "5 4") + segM1(L, P, Q[1], Q[3], C.faint, 1.5, "5 4");
      Q.forEach(function(p){ m += dotM1(L, P, p, C.text, lab(p), p[0] > 0 ? 8 : -66, p[1] > 0 ? -8 : 18); });
      L.svg(m, "Is ABCD a square?", P.h);
      L.readout([["AB = BC = CD = DA", "√10 ≈ 3.16", C.path], ["AC = BD", f >= 1 ? "√20 ≈ 4.47" : "…"], ["Area", f >= 1 ? "(√10)² = 10 square units" : "…", C.ok]]);
      msg = t < 2 ? "Measuring sides and diagonals…" : "All four sides are √10 and both diagonals are √20, so ABCD is a <b>square</b>; its area is 10 square units.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["midpoint", "Worked example: midpoint"], ["collinear", "Q6: M, A, G"], ["nearly", "Q7: R, B, C"], ["circle", "Q12: circle K"], ["icons", "Q15: screen icons"], ["square", "Q16: square ABCD"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.apply = {mount: mount, draw: draw, select: select, state: st};
})();
