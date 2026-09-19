// iemh102 labs: Introduction to Linear Polynomials.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function nM2(v, d){ var L = window.LAB; if(d !== undefined) return L.num(v, d); var a = Math.abs(v); if(Math.abs(a - Math.round(a)) < 1e-9) return L.num(v, 0); if(Math.abs(a * 10 - Math.round(a * 10)) < 1e-9) return L.num(v, 1); return L.num(v, 2); }
function clampM2(x, a, b){ return Math.max(a, Math.min(b, x)); }
function eqM2(a, b){
  var A = Math.abs(a - 1) < 1e-9 ? "x" : Math.abs(a + 1) < 1e-9 ? "−x" : Math.abs(a) < 1e-9 ? "" : nM2(a) + "x";
  if(A === "") return "y = " + nM2(b);
  return "y = " + A + (Math.abs(b) > 1e-9 ? (b > 0 ? " + " : " − ") + nM2(Math.abs(b)) : "");
}
// Coordinate plane with separate x and y scales, centred in the 720-wide lab.
function planeM2(L, v){
  var C = L.C, ox = Math.round((720 - (v.xmax - v.xmin) * v.sx) / 2), oy = v.top || 16, m = "";
  var X = function(x){ return ox + (x - v.xmin) * v.sx; }, Y = function(y){ return oy + (v.ymax - y) * v.sy; };
  for(var x = v.xmin; x <= v.xmax; x++) m += L.line(X(x), Y(v.ymin), X(x), Y(v.ymax), C.grid, 1);
  for(var y = v.ymin; y <= v.ymax; y++) m += L.line(X(v.xmin), Y(y), X(v.xmax), Y(y), C.grid, 1);
  m += L.line(X(v.xmin), Y(0), X(v.xmax), Y(0), C.faint, 2) + L.line(X(0), Y(v.ymin), X(0), Y(v.ymax), C.faint, 2);
  m += L.text(X(v.xmax) + 10, Y(0) + 4, "x", {size: 12, color: C.muted}) + L.text(X(0), Y(v.ymax) - 4, "y", {size: 12, color: C.muted});
  for(var i = v.xmin; i <= v.xmax; i++) if(i && i % (v.xev || 2) === 0) m += L.text(X(i), Y(0) + 13, nM2(i), {size: 9, color: C.muted});
  for(var j = v.ymin; j <= v.ymax; j++) if(j && j % (v.yev || 2) === 0) m += L.text(X(0) - 4, Y(j) + 3, nM2(j), {size: 9, color: C.muted, anchor: "end"});
  return {svg: m, X: X, Y: Y, v: v, h: Math.round(oy + (v.ymax - v.ymin) * v.sy + 24)};
}
// The part of y = ax + b inside the plane, drawn up to fraction f of its length.
function lineM2(L, P, a, b, color, w, f, label){
  var v = P.v, pts = [];
  [v.xmin, v.xmax].forEach(function(x){ var y = a * x + b; if(y >= v.ymin - 1e-9 && y <= v.ymax + 1e-9) pts.push([x, y]); });
  if(Math.abs(a) > 1e-12) [v.ymin, v.ymax].forEach(function(y){ var x = (y - b) / a; if(x >= v.xmin - 1e-9 && x <= v.xmax + 1e-9) pts.push([x, y]); });
  if(pts.length < 2) return "";
  pts.sort(function(p, q){ return p[0] - q[0]; });
  var p0 = pts[0], p1 = pts[pts.length - 1], k = f === undefined ? 1 : f, e = [p0[0] + (p1[0] - p0[0]) * k, p0[1] + (p1[1] - p0[1]) * k];
  var m = L.line(P.X(p0[0]), P.Y(p0[1]), P.X(e[0]), P.Y(e[1]), color, w || 3), right = p1[0] >= v.xmax - 1e-6;
  if(label && k >= 1) m += L.text(P.X(p1[0]) + (right ? -4 : 6), P.Y(p1[1]) + (p1[1] >= v.ymax - 1e-6 ? 14 : -6), label, {size: 12, color: color, anchor: right ? "end" : "start", weight: 700});
  return m;
}
function dotM2(L, P, x, y, color, label, dx, dy){ return L.circle(P.X(x), P.Y(y), 4.5, color) + (label ? L.text(P.X(x) + (dx === undefined ? 7 : dx), P.Y(y) + (dy === undefined ? -7 : dy), label, {size: 11, color: color, anchor: "start", weight: 700}) : ""); }
function sliderSetM2(L, st, defs){
  L.controls(defs.map(function(d){ return L.slider(d[0], d[1], d[2], d[3], d[4], st[d[5]], nM2(st[d[5]])); }).join(""));
  defs.forEach(function(d){ L.onInput(d[0], function(v){ st[d[5]] = v; L.setVal(d[0], nM2(v)); App.resetTimeline(); App.play(); }); });
}

// Lab 1 — Expressions and polynomials (Examples 1–3, degrees)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "raju", x: 3, y: 2, l: 10, w: 6, len: 7};
  var DEF = {raju: [["m2x", "x (red boxes)", 0, 10, 1, "x"], ["m2y", "y (blue boxes)", 0, 10, 1, "y"]], garden: [["m2l", "l (length, m)", 2, 20, 1, "l"], ["m2w", "w (width, m)", 2, 15, 1, "w"]], wire: [["m2len", "x (length, cm)", 0.5, 9.5, 0.5, "len"]], degree: []};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 1});
    L.legend({raju: [[C.danger, "red box: 4 pens"], [C.vel, "blue box: 5 pencils"], [C.path, "free pens"]], garden: [[C.danger, "wire fence, ₹100 per m"], [C.path, "wooden fence, ₹80 per m"], [C.ok, "seeds, ₹50 per m²"]], wire: [[C.path, "20 cm wire"], [C.danger, "the chosen length on the area curve"]], degree: [[C.path, "highest power"], [C.ok, "degree and name"]]}[id]);
    L.watch({raju: "Example 1: x red boxes of 4 pens, y blue boxes of 5 pencils and 3 free pens. Change x and y.", garden: "Example 2: wire along both lengths, wood along both widths, and seeds over the whole area. Change l and w.", wire: "Example 3: a 20 cm wire bent into a rectangle. If the length is x cm, the width is (10 − x) cm.", degree: "Four polynomials from the text. The highest power of the variable names each one."}[id]);
    sliderSetM2(L, st, DEF[id]);
    L.restart(true);
  }
  function box(x, y, col, label){ return L.rect(x, y, 34, 30, col, ' rx="4" opacity="0.85"') + L.text(x + 17, y + 20, label, {size: 12, color: "#fff", weight: 700}); }
  function draw(t){
    var m = "", msg, k = Math.floor(clampM2(t, 0, 3) + 1e-9), i;
    if(st.preset === "raju"){
      var x = st.x, y = st.y, tot = 4 * x + 5 * y + 3;
      for(i = 0; i < x; i++) m += box(30 + i * 42, 30, C.danger, "4");
      for(i = 0; i < y; i++) m += box(30 + i * 42, 100, C.vel, "5");
      for(i = 0; i < 3; i++) m += L.line(50 + i * 26, 180, 50 + i * 26, 222, C.path, 5);
      m += L.text(500, 52, "4x = " + (4 * x), {size: 16, color: k >= 1 ? C.danger : C.faint, anchor: "start", weight: 700}) + L.text(500, 122, "5y = " + (5 * y), {size: 16, color: k >= 2 ? C.vel : C.faint, anchor: "start", weight: 700}) + L.text(500, 206, "+ 3 free pens", {size: 16, color: k >= 3 ? C.path : C.faint, anchor: "start", weight: 700});
      L.svg(m, "Raju’s boxes of pens and pencils", 240);
      L.readout([["Expression", "4x + 5y + 3"], ["Terms", "4x, 5y, 3"], ["Coefficients", "4 and 5; constant 3"], ["Total", t >= 3 ? String(tot) : "…", C.path]]);
      msg = t < 3 ? "Adding the terms…" : "4x + 5y + 3 = 4 × " + x + " + 5 × " + y + " + 3 = <b>" + tot + " pens and pencils</b>.";
    } else if(st.preset === "garden"){
      var l = st.l, w = st.w, s = Math.min(400 / l, 210 / w), gx = 60, gy = 34, W = l * s, H = w * s, c1 = 200 * l, c2 = 160 * w, c3 = 50 * l * w;
      m += L.rect(gx, gy, W, H, k >= 3 ? "rgba(52,211,153,0.35)" : "rgba(52,211,153,0.08)");
      m += L.line(gx, gy, gx + W, gy, k >= 1 ? C.danger : C.faint, 5) + L.line(gx, gy + H, gx + W, gy + H, k >= 1 ? C.danger : C.faint, 5) + L.line(gx, gy, gx, gy + H, k >= 2 ? C.path : C.faint, 5) + L.line(gx + W, gy, gx + W, gy + H, k >= 2 ? C.path : C.faint, 5);
      m += L.text(gx + W / 2, gy - 10, "l = " + l + " m", {size: 12, color: C.text}) + L.text(gx + W + 10, gy + H / 2, "w = " + w + " m", {size: 12, color: C.text, anchor: "start"});
      m += L.text(610, 70, "200l = ₹" + c1, {size: 14, color: k >= 1 ? C.danger : C.faint, weight: 700}) + L.text(610, 110, "160w = ₹" + c2, {size: 14, color: k >= 2 ? C.path : C.faint, weight: 700}) + L.text(610, 150, "50lw = ₹" + c3, {size: 14, color: k >= 3 ? C.ok : C.faint, weight: 700});
      L.svg(m, "Garden fencing and seeds", 270);
      L.readout([["Expression", "200l + 160w + 50lw"], ["Variables", "l and w"], ["Coefficients", "200, 160, 50"], ["Total cost", t >= 3 ? "₹" + (c1 + c2 + c3) : "…", C.ok]]);
      msg = t < 3 ? "Pricing each part…" : "Cost = 200 × " + l + " + 160 × " + w + " + 50 × " + l + " × " + w + " = <b>₹" + (c1 + c2 + c3) + "</b>.";
    } else if(st.preset === "wire"){
      var xl = st.len, wd = 10 - xl, sc = 22, ar = 10 * xl - xl * xl, pts = [], q;
      m += L.rect(50, 40, xl * sc, wd * sc, C.area, ' stroke="' + C.path + '" stroke-width="4"');
      m += L.text(50 + xl * sc / 2, 30, "x = " + nM2(xl) + " cm", {size: 12, color: C.text}) + L.text(58 + xl * sc, 40 + wd * sc / 2, "10 − x = " + nM2(wd) + " cm", {size: 12, color: C.text, anchor: "start"});
      var g = L.graph({x0: 450, y0: 250, w: 240, h: 190, tmax: 10, vmin: 0, vmax: 25, tStep: 2, vStep: 5, tLabel: "length x (cm)", vLabel: "area (cm²)", tFmt: function(v){ return L.num(v, 0); }, vFmt: function(v){ return L.num(v, 0); }});
      for(q = 0; q <= 40; q++){ var xx = q / 4; pts.push([xx, 10 * xx - xx * xx]); }
      m += g.svg + L.polyline(g, pts, C.path, 2.5) + L.circle(g.X(xl), g.Y(ar), 6, C.danger);
      L.svg(m, "Wire rectangle and its area", 290);
      L.readout([["Length", nM2(xl) + " cm"], ["Width", nM2(wd) + " cm"], ["Area 10x − x²", nM2(ar) + " cm²", C.path], ["Perimeter", "20 cm"]]);
      msg = t < 3 ? "Bending the wire…" : "Length " + nM2(xl) + " cm, width " + nM2(wd) + " cm: area = 10 × " + nM2(xl) + " − " + nM2(xl) + "² = <b>" + nM2(ar) + " cm²</b>. The largest area, 25 cm², comes from the square with x = 5.";
    } else {
      var rows = [["5y³ + y² + 2y − 1", "5y³", 3, "cubic"], ["x² + 5x + 1", "x²", 2, "quadratic"], ["3z + 7", "3z", 1, "linear"], ["8 = 8x⁰", "8x⁰", 0, "constant"]];
      rows.forEach(function(r, n){
        var on = t >= n * 0.75;
        m += L.rect(30, 20 + n * 60, 660, 48, on ? "rgba(245,158,11,0.10)" : "rgba(148,163,184,0.05)", ' rx="8"') + L.text(50, 51 + n * 60, r[0], {size: 19, color: C.text, anchor: "start", mono: true});
        if(on) m += L.text(330, 51 + n * 60, "highest power: " + r[1], {size: 14, color: C.path, anchor: "start"}) + L.text(675, 51 + n * 60, "degree " + r[2] + ", " + r[3], {size: 14, color: C.ok, anchor: "end", weight: 700});
      });
      L.svg(m, "Degrees of polynomials", 270);
      L.readout(rows.map(function(r, n){ return [r[0], t >= n * 0.75 ? "degree " + r[2] : "…", C.ok]; }));
      msg = t < 3 ? "Finding the highest powers…" : "Degrees 3, 2, 1 and 0 name the polynomials <b>cubic, quadratic, linear and constant</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["raju", "Example 1: Raju’s boxes"], ["garden", "Example 2: the garden"], ["wire", "Example 3: wire rectangle"], ["degree", "Degrees of polynomials"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.terms = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Linear polynomials, a linear equation and function machines (§2.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "square", input: 4, xin: 6};
  var MAXT = {square: 5, chess: 5, sum: 4, machine: 3, area: 3};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: MAXT[id], step: 0.05, speed: 1});
    L.legend({square: [[C.vel, "square and its perimeter"], [C.path, "constant difference"]], chess: [[C.vel, "amount paid"], [C.path, "₹750"]], sum: [[C.vel, "x"], [C.path, "10 more"]], machine: [[C.vel, "input"], [C.path, "output"]], area: [[C.vel, "input"], [C.path, "output"]]}[id]);
    L.watch({square: "Example 4: sides 1, 1.5, 2, 2.5 and 3 cm. Watch the perimeter 4x change by equal amounts.", chess: "Example 5: ₹200 joining fee plus ₹50 per match. Where does ₹750 come?", sum: "Example 6: the sum of two numbers is 64 and one is 10 more than the other.", machine: "Fig. 2.3: the machine 2x + 3. Change the input.", area: "Think and Reflect: the wire-rectangle area 10x − x² as a machine. Input the length."}[id]);
    if(id === "machine") sliderSetM2(L, st, [["m2in", "input x", -10, 10, 1, "input"]]);
    else if(id === "area") sliderSetM2(L, st, [["m2ain", "input x (cm)", 0, 10, 0.5, "xin"]]);
    else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "square"){
      var sides = [1, 1.5, 2, 2.5, 3], n = Math.min(5, Math.floor(t + 1e-9) + 1), x = 40;
      sides.forEach(function(s, i){
        var px = s * 40, on = i < n;
        m += L.rect(x, 170 - px, px, px, on ? "rgba(56,189,248,0.25)" : "none", ' stroke="' + (on ? C.vel : C.faint) + '" stroke-width="2"');
        m += L.text(x + px / 2, 192, "side " + nM2(s) + " cm", {size: 11, color: C.muted}) + (on ? L.text(x + px / 2, 214, "P = " + nM2(4 * s) + " cm", {size: 13, color: C.vel, weight: 700}) : "");
        if(i > 0 && on) m += L.text(x - 18, 240, "+2", {size: 13, color: C.path, weight: 700});
        x += px + 36;
      });
      L.svg(m, "Perimeters of squares", 255);
      L.readout([["Rule", "P = 4x"], ["Perimeters", sides.slice(0, n).map(function(s){ return nM2(4 * s); }).join(", ") + " cm"], ["Difference", n > 1 ? "2 cm each step" : "…", C.path]]);
      msg = t < 5 ? "Growing the side by 0.5 cm…" : "Perimeters 4, 6, 8, 10, 12 cm: each 0.5 cm added to the side adds <b>2 cm</b> to the perimeter.";
    } else if(st.preset === "chess"){
      var g = L.graph({x0: 90, y0: 250, w: 560, h: 200, tmax: 12, vmin: 0, vmax: 800, tStep: 1, vStep: 100, tLabel: "matches played m", vLabel: "amount paid (₹)", tFmt: function(v){ return L.num(v, 0); }, vFmt: function(v){ return L.num(v, 0); }});
      var shown = Math.min(11, Math.floor(t / 5 * 11 + 1e-9));
      m += g.svg;
      for(var i = 1; i <= shown; i++){ var val = 200 + 50 * i; m += L.rect(g.X(i) - 12, g.Y(val), 24, g.Y(0) - g.Y(val), i === 11 ? C.path : C.vel, ' opacity="0.8"'); }
      if(t >= 5) m += L.line(g.X(0), g.Y(750), g.X(11), g.Y(750), C.path, 1.5, "5 4") + L.text(g.X(11), g.Y(750) - 8, "₹750", {size: 12, color: C.path, weight: 700});
      L.svg(m, "Chess club fees", 290);
      L.readout([["Rule", "₹(200 + 50m)"], ["Bars shown", shown ? "m = 1 to " + shown : "…"], ["Step", "₹50 per match", C.vel], ["₹750 pays for", t >= 5 ? "11 matches" : "…", C.path]]);
      msg = t < 5 ? "Adding matches…" : "Each extra match adds <b>₹50</b>. A player who paid ₹750 played (750 − 200) ÷ 50 = <b>11 matches</b>.";
    } else if(st.preset === "sum"){
      var steps = ["x + (x + 10) = 64", "2x + 10 = 64", "2x = 54", "x = 27"], k2 = Math.min(4, Math.floor(t + 1e-9) + 1), sc = 7, bx = 40;
      m += L.rect(bx, 40, 27 * sc, 34, C.vel, ' rx="4"') + L.text(bx + 27 * sc / 2, 62, k2 >= 4 ? "27" : "x", {size: 13, color: "#fff", weight: 700});
      m += L.rect(bx, 90, 27 * sc, 34, C.vel, ' rx="4"') + L.rect(bx + 27 * sc, 90, 10 * sc, 34, C.path, ' rx="4"') + L.text(bx + 27 * sc / 2, 112, k2 >= 4 ? "27" : "x", {size: 13, color: "#fff", weight: 700}) + L.text(bx + 32 * sc, 112, "10", {size: 13, color: "#111", weight: 700});
      m += L.text(bx + 18 * sc, 150, "smaller + larger = 64", {size: 12, color: C.muted});
      steps.slice(0, k2).forEach(function(s, n){ m += L.text(560, 50 + n * 38, s, {size: 16, color: n === k2 - 1 ? C.path : C.text, weight: 700, mono: true}); });
      L.svg(m, "Two numbers with sum 64", 200);
      L.readout([["Smaller", k2 >= 4 ? "27" : "x", C.vel], ["Larger", k2 >= 4 ? "37" : "x + 10", C.path], ["Sum", "64"]]);
      msg = t < 4 ? "Solving step by step…" : "x = 27, so the numbers are <b>27 and 37</b> (27 + 37 = 64).";
    } else {
      var isA = st.preset === "area", xin = isA ? st.xin : st.input, out = isA ? 10 * xin - xin * xin : 2 * xin + 3, f = clampM2(t / 3, 0, 1);
      m += L.rect(250, 60, 220, 120, "rgba(167,139,250,0.18)", ' rx="16" stroke="' + C.disp + '" stroke-width="3"') + L.text(360, 116, isA ? "10x − x²" : "2x + 3", {size: 26, color: C.text, weight: 700, mono: true}) + L.text(360, 156, "function machine", {size: 12, color: C.muted});
      m += L.arrow(70, 120, 245, 120, C.vel, 3) + L.arrow(475, 120, 650, 120, C.path, 3) + L.text(70, 100, "input x = " + nM2(xin), {size: 15, color: C.vel, anchor: "start", weight: 700});
      if(f >= 1) m += L.text(650, 100, "output " + nM2(out), {size: 15, color: C.path, anchor: "end", weight: 700});
      var bxp = f < 0.5 ? 70 + 175 * (f / 0.5) : 475 + 175 * ((f - 0.5) / 0.5);
      m += L.circle(bxp, 120, 10, f < 0.5 ? C.vel : C.path);
      L.svg(m, "Function machine", 210);
      var sub = isA ? "10 × " + nM2(xin) + " − " + nM2(xin) + "²" : "2 × " + (xin < 0 ? "(" + nM2(xin) + ")" : nM2(xin)) + " + 3";
      L.readout([["Input", nM2(xin), C.vel], ["Substitute", sub], ["Output", f >= 1 ? nM2(out) + (isA ? " cm²" : "") : "…", C.path]]);
      msg = t < 3 ? "Processing the input…" : sub + " = <b>" + nM2(out) + (isA ? " cm²" : "") + "</b>" + (isA ? ": a quadratic function of x." : ": a linear function of x.");
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["square", "Example 4: square perimeters"], ["chess", "Example 5: chess club"], ["sum", "Example 6: sum 64"], ["machine", "Fig. 2.3: machine 2x + 3"], ["area", "Think and Reflect: area machine"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.linear = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Linear patterns (§2.3: Fig. 2.4, Examples 7–8)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "tiles"};
  var MAXT = {tiles: 7, bela: 5, auto: 5};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: MAXT[id], step: 0.05, speed: 1});
    L.legend({tiles: [["#fb923c", "square tile"]], bela: [[C.danger, "money left"], [C.path, "day 12"], [C.vel, "day 15"]], auto: [[C.danger, "fare"], [C.vel, "9 km"], [C.path, "10 km"]]}[id]);
    L.watch({tiles: "Fig. 2.4: each stage adds one tile to each column. Count the tiles in Stages 1 to 7.", bela: "Example 7: Bela starts with ₹100 and spends ₹5 every day.", auto: "Example 8: ₹25 covers the first 2 km; each further km adds ₹15."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "tiles"){
      var n = clampM2(Math.floor(t + 1e-9) + 1, 1, 7), sz = 17, x = 24, base = 230;
      for(var s = 1; s <= 7; s++){
        var on = s <= n, fill = on ? "rgba(251,146,60,0.75)" : "none", edge = ' stroke="' + (on ? "#9a3412" : C.faint) + '" stroke-width="1"';
        for(var r = 0; r < s; r++) m += L.rect(x + sz, base - (r + 1) * sz, sz, sz, fill, edge);
        for(var r2 = 0; r2 < s - 1; r2++) m += L.rect(x, base - (r2 + 1) * sz, sz, sz, fill, edge);
        m += L.text(x + sz, base + 16, "Stage " + s, {size: 10, color: C.muted}) + (on ? L.text(x + sz, base + 32, (2 * s - 1) + " tiles", {size: 11, color: C.path, weight: 700}) : "");
        x += 2 * sz + 60;
      }
      L.svg(m, "Growing pattern of square tiles", 280);
      var seq = []; for(var q = 1; q <= n; q++) seq.push(2 * q - 1);
      L.readout([["Tiles", seq.join(", "), C.path], ["Difference", "2"], ["Stage n", "2n − 1"], ["Stage 15 / Stage 26", t >= 7 ? "29 / 51 tiles" : "…"]]);
      msg = t < 7 ? "Adding two tiles per stage…" : "Stage 7 has <b>13 tiles</b>. Stage n has 2n − 1 tiles, so Stage 15 has 29 and the stage with 47 tiles is Stage 24.";
    } else if(st.preset === "bela"){
      var g = L.graph({x0: 80, y0: 250, w: 580, h: 200, tmax: 20, vmin: 0, vmax: 100, tStep: 2, vStep: 20, tLabel: "day n", vLabel: "money left (₹)", tFmt: function(v){ return L.num(v, 0); }, vFmt: function(v){ return L.num(v, 0); }});
      var dmax = clampM2(t / 5, 0, 1) * 20, dn = Math.floor(dmax + 1e-9);
      m += g.svg + L.polyline(g, [[0, 100], [dmax, 100 - 5 * dmax]], C.danger, 3);
      for(var d = 0; d <= dn; d++) m += L.circle(g.X(d), g.Y(100 - 5 * d), d === 12 || d === 15 ? 6 : 3.5, d === 12 ? C.path : d === 15 ? C.vel : C.danger);
      if(t >= 5) m += L.text(g.X(12) + 8, g.Y(40) - 8, "day 12: ₹40", {size: 12, color: C.path, anchor: "start", weight: 700}) + L.text(g.X(15) + 8, g.Y(25) - 8, "day 15: ₹25", {size: 12, color: C.vel, anchor: "start", weight: 700});
      L.svg(m, "Bela’s pocket money", 290);
      L.readout([["Rule", "₹(100 − 5n)"], ["Day", String(dn)], ["Money left", "₹" + (100 - 5 * dn), C.danger], ["Runs out", t >= 5 ? "after 20 days" : "…"]]);
      msg = t < 5 ? "Spending ₹5 a day…" : "Bela has ₹40 left on day 12 and ₹25 on day 15; the money lasts <b>20 days</b>.";
    } else {
      var g2 = L.graph({x0: 80, y0: 250, w: 580, h: 200, tmax: 11, vmin: 0, vmax: 160, tStep: 1, vStep: 20, tLabel: "distance n (km)", vLabel: "fare (₹)", tFmt: function(v){ return L.num(v, 0); }, vFmt: function(v){ return L.num(v, 0); }});
      var km = Math.min(10, Math.floor(clampM2(t / 5, 0, 1) * 10 + 1e-9));
      m += g2.svg;
      for(var k = 1; k <= km; k++){ var fare = k <= 2 ? 25 : 15 * k - 5; m += L.rect(g2.X(k) - 14, g2.Y(fare), 28, g2.Y(0) - g2.Y(fare), k === 9 ? C.vel : k === 10 ? C.path : C.danger, ' opacity="0.8"') + L.text(g2.X(k), g2.Y(fare) - 5, String(fare), {size: 10, color: C.text}); }
      L.svg(m, "Auto-rickshaw fares", 290);
      L.readout([["Rule (n ≥ 2 km)", "25 + 15(n − 2) = 15n − 5"], ["Distance", km + " km"], ["Fare", km ? "₹" + (km <= 2 ? 25 : 15 * km - 5) : "…", C.path], ["₹130 pays for", t >= 5 ? "9 km" : "…", C.vel]]);
      msg = t < 5 ? "Adding kilometres…" : "10 km costs 25 + 15 × 8 = <b>₹145</b>; a fare of ₹130 pays for 9 km.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["tiles", "Fig. 2.4: square tiles"], ["bela", "Example 7: Bela’s money"], ["auto", "Example 8: auto fare"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.patterns = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Linear growth and decay (§2.4, Exercise Set 2.4)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "journey"};
  var CFG = {
    journey: {f: function(x){ return 100 + 60 * x; }, tmax: 15, vmax: 1000, tStep: 1, vStep: 100, tl: "distance d (km)", vl: "cost C (₹)", rule: "C(d) = 100 + 60d", col: "ok", kind: "growth: +₹60 per km", unit: ["₹", ""]},
    tank: {f: function(x){ return 3 - 0.5 * x; }, tmax: 6, vmax: 3, tStep: 1, vStep: 0.5, tl: "month t", vl: "height h (m)", rule: "h(t) = 3 − 0.5t", col: "vel", kind: "decay: −0.5 m per month", unit: ["", " m"]},
    plant: {f: function(x){ return 1.75 + 0.5 * x; }, tmax: 10, vmax: 7, tStep: 1, vStep: 1, tl: "month t", vl: "height h (ft)", rule: "h = 1.75 + 0.5t", col: "ok", kind: "growth: +0.5 ft per month", unit: ["", " ft"]},
    phone: {f: function(x){ return 10000 - 800 * x; }, tmax: 8, vmax: 10000, tStep: 1, vStep: 2000, tl: "year t", vl: "value v (₹)", rule: "v = 10000 − 800t", col: "danger", kind: "decay: −₹800 per year", unit: ["₹", ""]}
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend([[C[CFG[id].col], CFG[id].rule]]);
    L.watch({journey: "Example 9: every kilometre adds the same ₹60 to the cost.", tank: "Example 10: every month the water level drops by the same 0.5 m.", plant: "Exercise Set 2.4 Q1: a 1.75 ft plant grows 0.5 ft each month.", phone: "Exercise Set 2.4 Q2: a ₹10,000 phone loses ₹800 of value each year."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var c = CFG[st.preset], col = C[c.col], xnow = clampM2(t / 4, 0, 1) * c.tmax, tank = st.preset === "tank", m;
    var g = L.graph({x0: tank ? 320 : 100, y0: 255, w: tank ? 360 : 570, h: 210, tmax: c.tmax, vmin: 0, vmax: c.vmax, tStep: c.tStep, vStep: c.vStep, tLabel: c.tl, vLabel: c.vl, tFmt: function(v){ return L.num(v, 0); }, vFmt: function(v){ return nM2(v); }});
    m = g.svg + L.polyline(g, [[0, c.f(0)], [xnow, c.f(xnow)]], col, 3);
    var tt = Math.floor(xnow + 1e-9);
    for(var i = 0; i <= tt; i++) m += L.circle(g.X(i), g.Y(c.f(i)), 4, col);
    if(tank){ var hh = c.f(xnow); m += L.rect(70, 45, 150, 210, "none", ' stroke="' + C.faint + '" stroke-width="3"') + L.rect(72, 45 + 210 * (1 - hh / 3), 146, 210 * hh / 3, "rgba(56,189,248,0.45)") + L.text(145, 276, "h = " + nM2(hh, 2) + " m", {size: 13, color: C.vel, weight: 700}); }
    L.svg(m, c.rule, 300);
    L.readout([["Rule", c.rule], [c.tl, String(tt)], [c.vl, c.unit[0] + nM2(c.f(tt)) + c.unit[1], col], ["Linear", c.kind]]);
    L.verdict(t < 4 ? "Stepping through equal intervals…" : {journey: "15 km costs 100 + 60 × 15 = <b>₹1000</b>, and ₹700 buys (700 − 100) ÷ 60 = 10 km. Equal rises of ₹60: linear growth.", tank: "After 5 months the water is 3 − 0.5 × 5 = <b>0.5 m</b> deep, and the tank is empty at 6 months. Equal falls of 0.5 m: linear decay.", plant: "After 7 months the plant is 1.75 + 0.5 × 7 = <b>5.25 ft</b> tall. Equal rises of 0.5 ft: linear growth.", phone: "After 3 years the phone is worth 10000 − 800 × 3 = <b>₹7600</b>. Equal falls of ₹800: linear decay."}[st.preset]);
  }
  function mount(){ L.presets([["journey", "Example 9: journey cost"], ["tank", "Example 10: water tank"], ["plant", "Set 2.4 Q1: plant"], ["phone", "Set 2.4 Q2: phone value"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.growth = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Finding y = ax + b from two observations (§2.5)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "telecom"};
  var CFG = {
    telecom: {p: [10, 350], q: [20, 550], tmax: 25, vmin: 0, vmax: 700, tStep: 5, vStep: 100, tl: "data x (GB)", vl: "bill y (₹)", eq: "y = 20x + 150"},
    modules: {p: [10, 400], q: [14, 500], tmax: 20, vmin: 0, vmax: 700, tStep: 2, vStep: 100, tl: "modules x", vl: "bill y (₹)", eq: "y = 25x + 150"},
    gym: {p: [10, 800], q: [15, 1100], tmax: 20, vmin: 0, vmax: 1400, tStep: 2, vStep: 200, tl: "court hours x", vl: "bill y (₹)", eq: "y = 60x + 200"},
    temp: {p: [32, 0], q: [212, 100], tmax: 240, vmin: -20, vmax: 120, tStep: 40, vStep: 20, tl: "temperature (°F)", vl: "temperature (°C)", eq: "°C = (5/9)(°F − 32)"}
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.04, speed: 1});
    L.legend([[C.vel, "observations"], [C.path, "line through them"], [C.ok, "y-intercept b"]]);
    L.watch({telecom: "Example 11: ₹350 for 10 GB and ₹550 for 20 GB.", modules: "Exercise Set 2.5 Q1: ₹400 for 10 modules and ₹500 for 14.", gym: "Exercise Set 2.5 Q2: ₹800 for 10 hours and ₹1100 for 15 hours.", temp: "Exercise Set 2.5 Q3: ice melts at 32 °F = 0 °C and water boils at 212 °F = 100 °C."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var c = CFG[st.preset], a = (c.q[1] - c.p[1]) / (c.q[0] - c.p[0]), b = c.p[1] - a * c.p[0], temp = st.preset === "temp", m;
    var g = L.graph({x0: 100, y0: 260, w: 560, h: 220, tmax: c.tmax, vmin: c.vmin, vmax: c.vmax, tStep: c.tStep, vStep: c.vStep, tLabel: c.tl, vLabel: c.vl, tFmt: function(v){ return L.num(v, 0); }, vFmt: function(v){ return L.num(v, 0); }});
    m = g.svg;
    [c.p, c.q].forEach(function(pt, i){ if(t >= 0.3 + i * 0.6) m += L.circle(g.X(pt[0]), g.Y(pt[1]), 6, C.vel) + L.text(g.X(pt[0]) + 8, g.Y(pt[1]) + 18, "(" + pt[0] + ", " + pt[1] + ")", {size: 11, color: C.vel, anchor: "start", weight: 700}); });
    if(t >= 1.5){ var f = clampM2((t - 1.5) / 1.5, 0, 1); m += L.polyline(g, [[0, b], [c.tmax * f, b + a * c.tmax * f]], C.path, 3); }
    if(t >= 3) m += L.circle(g.X(0), g.Y(b), 6, C.ok) + L.text(g.X(0) + 10, g.Y(b) - 8, "b = " + nM2(b, temp ? 2 : 0), {size: 12, color: C.ok, anchor: "start", weight: 700});
    L.svg(m, "Two observations fix a line", 300);
    var aTxt = temp ? "100 ÷ 180 = 5/9" : "(" + c.q[1] + " − " + c.p[1] + ") ÷ (" + c.q[0] + " − " + c.p[0] + ") = " + nM2(a);
    var bTxt = temp ? "0 − (5/9) × 32 = −160/9 ≈ −17.78" : c.p[1] + " − " + c.p[0] + " × " + nM2(a) + " = " + nM2(b);
    L.readout([["Observations", "(" + c.p.join(", ") + ") and (" + c.q.join(", ") + ")", C.vel], ["a", t >= 2 ? aTxt : "…", C.path], ["b", t >= 3 ? bTxt : "…", C.ok]]);
    L.verdict(t < 3 ? "Fitting the line…" : "a = " + aTxt + " and b = " + bTxt + ", so <b>" + c.eq + "</b>.");
  }
  function mount(){ L.presets([["telecom", "Example 11: data plan"], ["modules", "Set 2.5 Q1: modules"], ["gym", "Set 2.5 Q2: gym"], ["temp", "Set 2.5 Q3: °C and °F"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.relation = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Graphs and slope (§2.6: Fig. 2.5, Examples 12–15)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "fig25", a: 1.5};
  var V = {xmin: -6, xmax: 6, ymin: -13, ymax: 13, sx: 26, sy: 11, top: 14, xev: 2, yev: 2};
  var SETS = {
    fig25: {pts: [[0, 1, "A (0, 1)"], [3, 7, "B (3, 7)"], [1, 3, "(1, 3)"], [2, 5, "(2, 5)"]], lines: [[2, 1, "y = 2x + 1"]]},
    ex12: {pts: [[-1, -3, "(−1, −3)"], [0, 0, "(0, 0)"], [1, 3, "(1, 3)"], [3, 9, "(3, 9)"], [4, 12, "(4, 12)"]], lines: [[3, 0, "y = 3x"]]},
    ex13: {pts: [[-3, 6, "(−3, 6)"], [-2, 4, "(−2, 4)"], [0, 0, "(0, 0)"], [1, -2, "(1, −2)"], [2, -4, "(2, −4)"], [3, -6, "(3, −6)"]], lines: [[-2, 0, "y = −2x"]]},
    fig29: {pts: [], lines: [[0.5, 0, "y = ½x"], [1, 0, "y = x"], [2, 0, "y = 2x"]]},
    fig211: {pts: [], lines: [[-1 / 3, 0, "y = −⅓x"], [-1, 0, "y = −x"], [-3, 0, "y = −3x"]]}
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.04, speed: 1});
    L.legend(id === "explore" ? [[C.faint, "y = x for comparison"], [C.vel, "y = ax"]] : [[C.text, "plotted points"], [C.vel, "line"]]);
    L.watch({fig25: "Fig. 2.5: two points A and B fix the line y = 2x + 1; other points on it satisfy the equation.", ex12: "Example 12: five points on one straight line. What rule connects x and y?", ex13: "Example 13: six points on a line through the origin that falls.", fig29: "Figs. 2.8–2.9: y = ½x, y = x and y = 2x on the same axes.", fig211: "Figs. 2.10–2.11: y = −⅓x, y = −x and y = −3x on the same axes.", explore: "Change a and compare y = ax with y = x."}[id]);
    if(id === "explore") sliderSetM2(L, st, [["m2a", "slope a", -4, 4, 0.5, "a"]]);
    else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var P = planeM2(L, V), m = P.svg, ex = st.preset === "explore", s = ex ? {pts: [], lines: [[1, 0, "y = x"], [st.a, 0, eqM2(st.a, 0)]]} : SETS[st.preset], cols = [C.vel, C.path, C.acc], msg;
    var np = s.pts.length, tp = np ? 1.2 : 0;
    s.pts.forEach(function(p, i){ if(t >= tp * i / np) m += dotM2(L, P, p[0], p[1], C.text, p[2]); });
    s.lines.forEach(function(ln, i){ var f = clampM2((t - tp - i * 0.6) / 0.6, 0, 1); if(f > 0) m += lineM2(L, P, ln[0], ln[1], ex && i === 0 ? C.faint : cols[i % 3], 3, f, ln[2]); });
    L.svg(m, "Graphs of straight lines", P.h);
    var done = t >= 3;
    if(st.preset === "fig25"){ L.readout([["Line", "y = 2x + 1"], ["Two points", "A (0, 1), B (3, 7)"], ["Check (7, 15)", "2 × 7 + 1 = 15"]]); msg = "A (0, 1) and B (3, 7) fix the line <b>y = 2x + 1</b>; (1, 3), (2, 5) and (7, 15) also satisfy it."; }
    else if(st.preset === "ex12"){ L.readout([["Rule", "y = 3 × x"], ["Slope", "3"], ["Through origin", "yes"]]); msg = "Every y-coordinate is 3 times the x-coordinate, so the line is <b>y = 3x</b>."; }
    else if(st.preset === "ex13"){ L.readout([["Rule", "y = −2 × x"], ["Slope", "−2"], ["Direction", "falls"]]); msg = "Every y-coordinate is −2 times the x-coordinate, so the line is <b>y = −2x</b>, falling from left to right."; }
    else if(st.preset === "fig29"){ L.readout([["Slopes", "½, 1, 2"], ["All pass through", "(0, 0)"], ["Steepest", "y = 2x", C.acc]]); msg = "All three pass through the origin and rise. <b>y = 2x is the steepest</b> (a greater than 1) and y = ½x the least steep (a less than 1)."; }
    else if(st.preset === "fig211"){ L.readout([["Slopes", "−⅓, −1, −3"], ["All pass through", "(0, 0)"], ["Steepest", "y = −3x", C.acc]]); msg = "All three pass through the origin and fall. <b>y = −3x falls most steeply</b> and y = −⅓x falls most gently."; }
    else {
      var a = st.a, dir = a > 0 ? "rises" : a < 0 ? "falls" : "is flat (it is the x-axis)", steep = Math.abs(Math.abs(a) - 1) < 1e-9 ? "exactly as steeply as y = x" : Math.abs(a) > 1 ? "more steeply than y = x" : "less steeply than y = x";
      L.readout([["Equation", eqM2(a, 0)], ["Slope a", nM2(a), C.vel], ["Direction", a > 0 ? "rises" : a < 0 ? "falls" : "flat"]]);
      msg = eqM2(a, 0) + " passes through the origin and <b>" + dir + "</b>" + (a ? ", " + steep : "") + ".";
    }
    L.verdict(done ? msg : "Plotting…");
  }
  function mount(){ L.presets([["fig25", "Fig. 2.5: y = 2x + 1"], ["ex12", "Example 12"], ["ex13", "Example 13"], ["fig29", "Fig. 2.9: a > 0"], ["fig211", "Fig. 2.11: a < 0"], ["explore", "Explore: change a"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.slope = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — y-intercept and parallel lines (§2.6: Example 16, Figs. 2.12–2.14)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "mirror", a: 2, b: 1};
  var V = {xmin: -6, xmax: 6, ymin: -10, ymax: 12, sx: 26, sy: 12, top: 14, xev: 2, yev: 2};
  var SETS = {mirror: [[3, 1, "y = 3x + 1"], [-3, 1, "y = −3x + 1"]], ex16: [[2, -1, "y = 2x − 1"], [2, 1, "y = 2x + 1"], [2, 5, "y = 2x + 5"]], fig214: [[2, 5, "y = 2x + 5"], [1, 3, "y = x + 3"], [3, -2, "y = 3x − 2"]]};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.04, speed: 1});
    L.legend([[C.vel, "first line"], [C.path, "second line"], [C.acc, "third line"]]);
    L.watch({mirror: "Think and Reflect: y = 3x + 1 and y = −3x + 1.", ex16: "Example 16: y = 2x − 1, y = 2x + 1 and y = 2x + 5 on the same axes (Fig. 2.13).", fig214: "Fig. 2.14: y = 2x + 5, y = x + 3 and y = 3x − 2. Where does each cut the y-axis?", explore: "Change a and b separately: a turns the line, b slides it."}[id]);
    if(id === "explore") sliderSetM2(L, st, [["m2ia", "slope a", -3, 3, 0.5, "a"], ["m2ib", "y-intercept b", -6, 6, 1, "b"]]);
    else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var P = planeM2(L, V), m = P.svg, ex = st.preset === "explore", lines = ex ? [[st.a, st.b, eqM2(st.a, st.b)]] : SETS[st.preset], cols = [C.vel, C.path, C.acc], names = st.preset === "fig214" ? ["A ", "B ", "C "] : ["", "", ""], msg;
    lines.forEach(function(ln, i){
      var f = clampM2((t - i * 0.9) / 0.9, 0, 1);
      if(f > 0) m += lineM2(L, P, ln[0], ln[1], cols[i % 3], 3, f, ln[2]);
      if(f >= 1) m += dotM2(L, P, 0, ln[1], cols[i % 3], names[i] + "(0, " + nM2(ln[1]) + ")", -78, 4);
    });
    L.svg(m, "y-intercepts and parallel lines", P.h);
    if(st.preset === "mirror"){ L.readout([["Slopes", "3 and −3"], ["y-intercept", "1 for both", C.ok], ["Relation", "mirror images in the y-axis"]]); msg = "Both lines cut the y-axis at <b>(0, 1)</b>. y = 3x + 1 rises and y = −3x + 1 falls: each is the mirror image of the other in the y-axis."; }
    else if(st.preset === "ex16"){ L.readout([["Slope", "2 for all three"], ["y-intercepts", "−1, 1, 5"], ["Relation", "parallel", C.ok]]); msg = "Same slope 2, different b: the lines are <b>parallel</b>, cutting the y-axis at (0, −1), (0, 1) and (0, 5)."; }
    else if(st.preset === "fig214"){ L.readout([["A", "y = 2x + 5 → (0, 5)", C.vel], ["B", "y = x + 3 → (0, 3)", C.path], ["C", "y = 3x − 2 → (0, −2)", C.acc]]); msg = "A (0, 5), B (0, 3) and C (0, −2): each line y = ax + b cuts the y-axis at <b>(0, b)</b>."; }
    else {
      var a = st.a, b = st.b;
      L.readout([["Slope a", nM2(a), C.vel], ["y-intercept b", nM2(b), C.ok], ["Cuts the y-axis at", "(0, " + nM2(b) + ")"], ["Cuts the x-axis at", a ? "(" + nM2(-b / a) + ", 0)" : b ? "never" : "every point"]]);
      msg = eqM2(a, b) + ": slope " + nM2(a) + " and y-intercept " + nM2(b) + ", so it cuts the y-axis at <b>(0, " + nM2(b) + ")</b>.";
    }
    L.verdict(t >= 3 ? msg : "Drawing the lines…");
  }
  function mount(){ L.presets([["mirror", "y = 3x + 1 and y = −3x + 1"], ["ex16", "Example 16: parallel lines"], ["fig214", "Fig. 2.14: y-intercepts"], ["explore", "Explore: a and b"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.intercept = {mount: mount, draw: draw, select: select, state: st};
})();
