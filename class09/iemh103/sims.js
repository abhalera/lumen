// iemh103 labs: The World of Numbers.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function clampM3(x, a, b){ return Math.max(a, Math.min(b, x)); }
function gcdM3(a, b){ a = Math.abs(a); b = Math.abs(b); while(b){ var t = a % b; a = b; b = t; } return a || 1; }
function frM3(n, d){ if(d < 0){ n = -n; d = -d; } var g = gcdM3(n, d); n /= g; d /= g; return (n < 0 ? "−" : "") + Math.abs(n) + (d === 1 ? "" : "/" + d); }
function sgnM3(v){ return v < 0 ? "−" + Math.abs(v) : String(v); }
// A number line from lo to hi with `parts` ticks per unit; fmt(v) labels the major ticks.
function nlM3(L, o){
  var C = L.C, X = function(v){ return o.x0 + (v - o.lo) / (o.hi - o.lo) * (o.x1 - o.x0); }, m = L.line(o.x0 - 12, o.y, o.x1 + 12, o.y, C.faint, 2);
  var n = Math.round((o.hi - o.lo) * o.parts);
  for(var i = 0; i <= n; i++){
    var v = o.lo + i / o.parts, major = o.major ? o.major(i) : Math.abs(v - Math.round(v)) < 1e-9;
    m += L.line(X(v), o.y - (major ? 9 : 5), X(v), o.y + (major ? 9 : 5), major ? C.text : C.muted, major ? 2 : 1);
    if(major) m += L.text(X(v), o.y + 26, o.fmt ? o.fmt(v, i) : sgnM3(Math.round(v)), {size: 11, color: C.muted});
  }
  return {svg: m, X: X};
}

// Lab 1 — Counting: pebbles, the Ishango bone, finger joints, trade at Lothal (§3.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "herd"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend({herd: [[C.path, "pebble"], [C.text, "cow"]], ishango: [["#e7d3b1", "bone"], ["#7c2d12", "notch"]], fingers: [[C.path, "joint counted"]], lothal: [["#a16207", "bag of spices"], ["#b45309", "copper ingot"]]}[id]);
    L.watch({herd: "Morning: 8 cows go out and a pebble goes into the pot for each. Evening: a pebble comes out for each cow that returns.", ishango: "Fig. 3.1: one column of the Ishango bone groups its notches as 11, 13, 17 and 19.", fingers: "Exercise Set 3.1 Q4: the thumb counts the 3 joints on each of the other 4 fingers.", lothal: "Exercise Set 3.1 Q1: 15 copper ingots for every 2 bags of spices; the merchant brings 12 bags."}[id]);
    L.controls(""); L.restart(true);
  }
  function cow(x, y, on){ var col = on ? "#e2e8f0" : "rgba(226,232,240,0.12)"; return L.rect(x - 18, y - 12, 34, 20, col, ' rx="6"') + L.circle(x + 20, y - 9, 8, col) + L.line(x - 10, y + 8, x - 10, y + 20, col, 3) + L.line(x + 8, y + 8, x + 8, y + 20, col, 3); }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "herd"){
      var out = Math.min(8, Math.floor(t / 2 * 8 + 1e-9)), back = t <= 2 ? 0 : Math.min(7, Math.floor((t - 2) / 2 * 7 + 1e-9)), pebbles = out - back;
      m += L.text(180, 30, t < 2 ? "Morning: cows leave to graze" : "Evening: cows return", {size: 14, color: C.text, weight: 700});
      for(i = 0; i < 8; i++) m += cow(60 + (i % 4) * 80, 90 + Math.floor(i / 4) * 70, t < 2 ? i >= out : i < back);
      m += '<path d="M 470 90 L 490 230 L 610 230 L 630 90 Z" fill="rgba(180,83,9,0.35)" stroke="#b45309" stroke-width="3"/>' + L.text(550, 256, "clay pot", {size: 12, color: C.muted});
      for(var p = 0; p < pebbles; p++) m += L.circle(508 + (p % 4) * 28, 212 - Math.floor(p / 4) * 24, 10, C.path);
      L.svg(m, "Pebbles in a pot", 270);
      L.readout([["Cows that went out", String(out)], ["Cows back", String(back)], ["Pebbles in the pot", String(pebbles), C.path]]);
      msg = t < 4 ? "Matching cows and pebbles…" : "8 cows went out but only 7 came back: 1 pebble is left, so <b>1 cow is missing</b>.";
    } else if(st.preset === "ishango"){
      var groups = [11, 13, 17, 19], x = 90;
      m += '<path d="M 60 120 Q 360 80 660 120 L 660 180 Q 360 220 60 180 Z" fill="#e7d3b1" stroke="#a8906a" stroke-width="2"/>';
      groups.forEach(function(g, gi){
        var f = clampM3(t - gi, 0, 1), k = Math.round(g * f);
        for(var j = 0; j < g; j++) m += L.line(x + j * 5, 128, x + j * 5, 172, j < k ? "#7c2d12" : "rgba(124,45,18,0.15)", 2);
        if(f >= 1) m += L.text(x + g * 2.5, 210, String(g), {size: 15, color: C.path, weight: 700});
        x += g * 5 + 40;
      });
      L.svg(m, "Ishango bone tallies", 240);
      L.readout([["Groups", groups.filter(function(g, gi){ return t >= gi + 1; }).join(", ") || "…", C.path], ["Factors of each", t >= 4 ? "only 1 and itself" : "…"]]);
      msg = t < 4 ? "Counting notches…" : "11, 13, 17 and 19 have no factors except 1 and themselves: they are <b>the primes between 10 and 20</b>.";
    } else if(st.preset === "fingers"){
      var n = Math.min(12, Math.floor(t / 4 * 12 + 1e-9)), c = 0;
      m += L.rect(250, 160, 200, 110, "rgba(251,191,140,0.35)", ' rx="30"') + L.rect(196, 178, 70, 30, "rgba(251,191,140,0.5)", ' rx="14"') + L.text(222, 228, "thumb", {size: 11, color: C.muted});
      for(var f2 = 0; f2 < 4; f2++){
        var fx = 270 + f2 * 46;
        m += L.rect(fx, 40, 38, 125, "rgba(251,191,140,0.35)", ' rx="16"');
        for(var jn = 0; jn < 3; jn++){ c++; var on = c <= n; m += L.circle(fx + 19, 62 + jn * 40, 12, on ? C.path : "rgba(245,158,11,0.15)") + (on ? L.text(fx + 19, 66 + jn * 40, String(c), {size: 10, color: "#111", weight: 700}) : ""); }
      }
      L.svg(m, "Counting on finger joints", 290);
      L.readout([["Joints counted", String(n), C.path], ["Fingers × joints", "4 × 3 = 12"], ["Dozens on the other hand", "5 × 12 = 60"]]);
      msg = t < 4 ? "Counting joints…" : "<b>12 joints</b> on one hand: counting naturally in dozens, the idea behind base-12 systems.";
    } else {
      var pairs = Math.min(6, Math.floor(t / 4 * 6 + 1e-9));
      for(var b = 0; b < 12; b++) m += L.rect(40 + (b % 2) * 34 + Math.floor(b / 2) * 105, 40, 30, 36, Math.floor(b / 2) < pairs ? "#a16207" : "rgba(161,98,7,0.3)", ' rx="6"');
      for(var g2 = 0; g2 < pairs; g2++) for(var ing = 0; ing < 15; ing++) m += L.rect(40 + g2 * 105 + (ing % 5) * 18, 100 + Math.floor(ing / 5) * 14, 15, 9, "#b45309");
      L.svg(m, "Spices for copper", 170);
      L.readout([["Pairs of bags", pairs + " of 6"], ["Ingots", String(pairs * 15), C.path], ["Rate", "15 ingots per 2 bags"]]);
      msg = t < 4 ? "Exchanging…" : "12 bags make 6 pairs, and 6 × 15 = <b>90 ingots</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["herd", "Pebbles for cows"], ["ishango", "Fig. 3.1: Ishango bone"], ["fingers", "Set 3.1 Q4: finger joints"], ["lothal", "Set 3.1 Q1: trade at Lothal"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.counting = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Integers: fortunes and debts on the number line (§3.3, Exercise Set 3.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "debts"};
  var P = {
    debts: {lo: -12, hi: 12, tick: 1, every: 2, unit: "", moves: [[0, -5, "danger", "debt of 5"], [-5, -9, "danger", "debt of 4"]], watch: "Brahmagupta’s rule: a debt plus a debt is a debt.", msg: "(−5) + (−4) = <b>−9</b>: a debt plus a debt is a debt."},
    temp: {lo: -16, hi: 8, tick: 1, every: 2, unit: " °C", moves: [[0, 4, "ok", "4 °C at noon"], [4, -11, "vel", "drops by 15 °C"]], watch: "Exercise Set 3.2 Q1: 4 °C at noon, then a drop of 15 °C by midnight in Ladakh.", msg: "4 + (−15) = <b>−11 °C</b> at midnight."},
    trader: {lo: -1000, hi: 800, tick: 100, every: 200, unit: "", moves: [[0, -850, "danger", "loan ₹850"], [-850, 350, "ok", "profit ₹1200"], [350, -100, "danger", "loss ₹450"]], watch: "Exercise Set 3.2 Q2: a loan, then a profit, then a loss.", msg: "(−850) + 1200 + (−450) = −100: a <b>debt of ₹100</b>."},
    product: {lo: -14, hi: 14, tick: 1, every: 2, unit: "", moves: [[0, 3, "ok", "remove a debt of 3"], [3, 6, "ok", ""], [6, 9, "ok", ""], [9, 12, "ok", ""]], watch: "Think and Reflect: someone takes away four of your debts of ₹3 each.", msg: "Taking away four debts of ₹3 leaves you ₹12 richer: (−3) × (−4) = <b>12</b>."},
    subneg: {lo: -2, hi: 18, tick: 1, every: 2, unit: "", moves: [[0, 10, "ok", "worth 10"], [10, 15, "ok", "remove a debt of 5"]], watch: "Exercise Set 3.2 Q4: subtracting a negative number.", msg: "Removing a debt of 5 moves you 5 to the right: 10 − (−5) = <b>15</b>."}
  };
  function select(id){ st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.04, speed: 1}); L.legend([[C.ok, "fortune: move right"], [C.danger, "debt: move left"]]); L.watch(P[id].watch); L.controls(""); L.restart(true); }
  function draw(t){
    var c = P[st.preset], x0 = 50, x1 = 670, y = 175, X = function(v){ return x0 + (v - c.lo) / (c.hi - c.lo) * (x1 - x0); }, m = L.line(x0 - 10, y, x1 + 10, y, C.faint, 2), pos = 0;
    for(var v = c.lo; v <= c.hi + 1e-9; v += c.tick){ var lab = Math.round(v) % c.every === 0; m += L.line(X(v), y - (lab ? 8 : 4), X(v), y + (lab ? 8 : 4), v === 0 ? C.text : C.muted, v === 0 ? 2.5 : 1) + (lab ? L.text(X(v), y + 26, sgnM3(Math.round(v)), {size: 11, color: v === 0 ? C.text : C.muted}) : ""); }
    m += L.text(X(c.lo) + 70, y + 54, "← debts (ṛiṇa)", {size: 12, color: C.danger}) + L.text(X(c.hi) - 80, y + 54, "fortunes (dhana) →", {size: 12, color: C.ok}) + L.text(X(0), y + 54, "śhūnya", {size: 11, color: C.muted});
    c.moves.forEach(function(mv, i){
      var f = clampM3(t / 4 * c.moves.length - i, 0, 1);
      if(f <= 0) return;
      var e = mv[0] + (mv[1] - mv[0]) * f, yy = y - 34 - (i % 2) * 36, col = C[mv[2]];
      m += L.arrow(X(mv[0]), yy, X(e), yy, col, 3) + (f >= 1 && mv[3] ? L.text((X(mv[0]) + X(mv[1])) / 2, yy - 9, mv[3], {size: 11, color: col}) : "");
      pos = e;
    });
    m += L.circle(X(pos), y, 8, C.path);
    L.svg(m, "Integers on the number line", 250);
    L.readout([["Position", sgnM3(Math.round(pos)) + c.unit, C.path], ["Steps", String(c.moves.length)]]);
    L.verdict(t < 4 ? "Moving along the number line…" : c.msg);
  }
  function mount(){ L.presets([["debts", "(−5) + (−4)"], ["temp", "Set 3.2 Q1: Ladakh"], ["trader", "Set 3.2 Q2: spice trader"], ["product", "(−3) × (−4)"], ["subneg", "10 − (−5)"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.integers = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Fractions: equality, sums, products, quotients and distributivity (§3.4, Exercise Set 3.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "equal"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend({equal: [[C.vel, "2/3"], [C.path, "4/6"]], add: [[C.vel, "7/12 = 14/24"], [C.path, "5/8 = 15/24"]], multiply: [[C.vel, "2/3 of the rows"], [C.path, "3/10 of the columns"], [C.ok, "overlap"]], divide: [["#a855f7", "one kurta: 2¼ m"]], distrib: [[C.vel, "1/2 × 8/3"], [C.path, "3/4 × 8/3"]]}[id]);
    L.watch({equal: "Exercise Set 3.3 Q1: are 2/3 and 4/6 the same amount?", add: "Exercise Set 3.3 Q2 (ii): 7/12 + 5/8, re-cut into 24ths.", multiply: "Exercise Set 3.3 Q4 (i): 2/3 × 3/10 as an area.", divide: "Exercise Set 3.4 Q4: cut 15¾ m of silk into pieces of 2¼ m.", distrib: "Exercise Set 3.3 Q6: (1/2 + 3/4) × 8/3 as the area of two rectangles."}[id]);
    L.controls(""); L.restart(true);
  }
  function bar(x, y, w, h, parts, filled, col){ var m = "", pw = w / parts; for(var i = 0; i < parts; i++) m += L.rect(x + i * pw, y, pw, h, i < filled ? col : "rgba(148,163,184,0.08)", ' stroke="#64748b" stroke-width="1"'); return m; }
  function draw(t){
    var m = "", msg;
    if(st.preset === "equal"){
      m += bar(60, 50, 480, 40, 3, 2, C.vel) + L.text(560, 76, "2/3", {size: 16, color: C.vel, anchor: "start", weight: 700});
      if(t >= 1.5) m += bar(60, 120, 480, 40, 6, 4, C.path) + L.text(560, 146, "4/6", {size: 16, color: C.path, anchor: "start", weight: 700});
      if(t >= 3) m += L.line(380, 40, 380, 170, C.ok, 2, "5 4");
      L.svg(m, "Equal fractions", 200);
      L.readout([["2 × 6", "12"], ["3 × 4", "12"], ["Equal?", t >= 3 ? "yes" : "…", C.ok]]);
      msg = t < 4 ? "Comparing the bars…" : "2 × 6 = 3 × 4 = 12, and the shaded lengths match: <b>2/3 = 4/6</b>.";
    } else if(st.preset === "add"){
      var cut = t >= 1.5;
      m += bar(60, 40, 480, 34, cut ? 24 : 12, cut ? 14 : 7, C.vel) + L.text(560, 63, cut ? "14/24" : "7/12", {size: 15, color: C.vel, anchor: "start", weight: 700});
      m += bar(60, 90, 480, 34, cut ? 24 : 8, cut ? 15 : 5, C.path) + L.text(560, 113, cut ? "15/24" : "5/8", {size: 15, color: C.path, anchor: "start", weight: 700});
      if(t >= 3) m += bar(60, 150, 480, 34, 24, 24, C.ok) + bar(60, 194, 480, 34, 24, 5, C.ok) + L.text(560, 173, "24/24 = 1", {size: 14, color: C.ok, anchor: "start"}) + L.text(560, 217, "+ 5/24", {size: 14, color: C.ok, anchor: "start"});
      L.svg(m, "Adding fractions", 250);
      L.readout([["Common denominator", "LCM(12, 8) = 24"], ["Sum of numerators", cut ? "14 + 15 = 29" : "…"], ["Result", t >= 3 ? "29/24 = 1 5/24" : "…", C.ok]]);
      msg = t < 4 ? "Re-cutting into 24ths…" : "7/12 + 5/8 = 14/24 + 15/24 = <b>29/24</b>, that is 1 whole and 5/24.";
    } else if(st.preset === "multiply"){
      var gx = 180, gy = 30, W = 360, H = 180;
      for(var r = 0; r < 3; r++) for(var c = 0; c < 10; c++){
        var inRow = r < 2 && t >= 1, inCol = c < 3 && t >= 2, both = inRow && inCol && t >= 3;
        m += L.rect(gx + c * W / 10, gy + r * H / 3, W / 10, H / 3, both ? C.ok : inRow ? "rgba(56,189,248,0.35)" : inCol ? "rgba(245,158,11,0.35)" : "rgba(148,163,184,0.06)", ' stroke="#64748b" stroke-width="1"');
      }
      L.svg(m, "A product as an area", 230);
      L.readout([["Rows shaded", "2 of 3"], ["Columns shaded", "3 of 10"], ["Overlap", t >= 3 ? "6 of 30 cells" : "…", C.ok]]);
      msg = t < 4 ? "Shading rows and columns…" : "The overlap is 6 of the 30 cells: 2/3 × 3/10 = 6/30 = <b>1/5</b>.";
    } else if(st.preset === "divide"){
      var sc = 38, x0 = 60, pieces = Math.min(7, Math.floor(t / 4 * 7 + 1e-9));
      m += L.rect(x0, 70, 15.75 * sc, 44, "rgba(168,85,247,0.15)", ' stroke="#a855f7" stroke-width="2"');
      for(var k = 0; k < pieces; k++) m += L.rect(x0 + k * 2.25 * sc + 2, 72, 2.25 * sc - 4, 40, "rgba(168,85,247,0.55)") + L.text(x0 + (k + 0.5) * 2.25 * sc, 97, String(k + 1), {size: 13, color: "#fff", weight: 700});
      m += L.text(x0, 60, "15¾ m of silk", {size: 12, color: C.muted, anchor: "start"}) + L.text(x0 + 2.25 * sc / 2, 140, "2¼ m", {size: 12, color: "#a855f7"});
      L.svg(m, "Cutting silk into kurtas", 170);
      L.readout([["15¾", "63/4"], ["2¼", "9/4"], ["Kurtas", String(pieces), "#a855f7"]]);
      msg = t < 4 ? "Cutting pieces…" : "15¾ ÷ 2¼ = 63/4 × 4/9 = <b>7 kurtas</b>, with no silk left over.";
    } else {
      var sx = 180, sy = 36, u = 96;
      m += L.rect(sx, sy, 0.5 * u * 2, (8 / 3) * u * 0.6, t >= 1 ? "rgba(56,189,248,0.35)" : "none", ' stroke="' + C.vel + '" stroke-width="2"') + L.rect(sx + u, sy, 0.75 * u * 2, (8 / 3) * u * 0.6, t >= 2 ? "rgba(245,158,11,0.35)" : "none", ' stroke="' + C.path + '" stroke-width="2"');
      m += L.text(sx + u / 2 + u / 2, sy + 180, "1/2", {size: 13, color: C.vel}) + L.text(sx + u + 0.75 * u, sy + 180, "3/4", {size: 13, color: C.path}) + L.text(sx - 12, sy + 80, "8/3", {size: 13, color: C.text, anchor: "end"});
      if(t >= 1) m += L.text(sx + u / 2, sy + 84, "4/3", {size: 16, color: C.text, weight: 700});
      if(t >= 2) m += L.text(sx + u + 0.75 * u, sy + 84, "2", {size: 16, color: C.text, weight: 700});
      L.svg(m, "The distributive law as areas", 240);
      L.readout([["Left side", "(1/2 + 3/4) × 8/3 = 5/4 × 8/3 = 10/3"], ["Right side", t >= 2 ? "4/3 + 2 = 10/3" : "…", C.ok]]);
      msg = t < 4 ? "Adding the two areas…" : "(1/2 + 3/4) × 8/3 = 1/2 × 8/3 + 3/4 × 8/3 = 4/3 + 2 = <b>10/3</b>, the same either way.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["equal", "Set 3.3 Q1: 2/3 = 4/6"], ["add", "Set 3.3 Q2: 7/12 + 5/8"], ["multiply", "Set 3.3 Q4: 2/3 × 3/10"], ["divide", "Set 3.4 Q4: kurtas"], ["distrib", "Set 3.3 Q6: distributive law"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.fractions = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Rational numbers on the number line, distance and density (§3.4.1–3.4.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "q34"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend([[C.path, "the rational number"], [C.vel, "equal parts"]]);
    L.watch({q34: "Fig. 3.5: divide the unit from 0 to 1 into 4 equal parts and move 3 parts.", q94: "Fig. 3.6: 9/4 = 2¼ lies between 2 and 3.", neg: "Think and Reflect: place 8/5 and −7/4, then measure the distance between them.", dist: "Fig. 3.8: the distance between −4 and 3 is |a − b|.", dense: "Fig. 3.9: keep averaging. Each zoom finds a new rational between 1 and the last one.", tight: "Exercise Set 3.4 Q5: zoom in between 3.1415 and 3.1416."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, y = 130, id = st.preset, line, f = clampM3(t / 3, 0, 1);
    if(id === "q34" || id === "q94"){
      var hi = id === "q34" ? 1 : 3, target = id === "q34" ? 0.75 : 2.25;
      line = nlM3(L, {lo: 0, hi: hi, parts: 4, x0: 80, x1: 640, y: y});
      m += line.svg + L.line(line.X(0), y - 30, line.X(target * f), y - 30, C.vel, 4) + L.circle(line.X(target * f), y, 9, C.path);
      if(t >= 3) m += L.text(line.X(target), y - 44, id === "q34" ? "3/4" : "9/4 = 2¼", {size: 15, color: C.path, weight: 700});
      L.svg(m, "Placing a fraction", 190);
      L.readout([["Parts per unit", "4"], ["Parts moved", id === "q34" ? "3" : "9"], ["Value", t >= 3 ? (id === "q34" ? "3/4 = 0.75" : "9/4 = 2.25") : "…", C.path]]);
      msg = t < 4 ? "Counting equal parts…" : id === "q34" ? "3/4 is <b>3 of the 4 equal parts</b> from 0 to 1." : "9/4 = <b>2¼</b>: one quarter of the way from 2 to 3.";
    } else if(id === "neg"){
      line = nlM3(L, {lo: -2, hi: 2, parts: 20, x0: 80, x1: 640, y: y});
      var a = -1.75, b = 1.6;
      m += line.svg + L.circle(line.X(a), y, 9, C.danger) + L.text(line.X(a), y - 20, "−7/4", {size: 14, color: C.danger, weight: 700});
      if(t >= 1) m += L.circle(line.X(b), y, 9, C.ok) + L.text(line.X(b), y - 20, "8/5", {size: 14, color: C.ok, weight: 700});
      if(t >= 2) m += L.line(line.X(a), y - 50, line.X(a + (b - a) * clampM3(t - 2, 0, 1)), y - 50, C.path, 4);
      L.svg(m, "Distance between −7/4 and 8/5", 190);
      L.readout([["−7/4", "−1¾ (quarters)"], ["8/5", "1⅗ (fifths)"], ["Distance", t >= 3 ? "|8/5 − (−7/4)| = 67/20" : "…", C.path]]);
      msg = t < 4 ? "Measuring…" : "−7/4 = −1¾ and 8/5 = 1⅗; the distance between them is <b>67/20</b> = 3.35 units.";
    } else if(id === "dist"){
      line = nlM3(L, {lo: -5, hi: 4, parts: 1, x0: 80, x1: 640, y: y});
      m += line.svg + L.circle(line.X(-4), y, 9, C.danger) + L.text(line.X(-4), y - 20, "a = −4", {size: 13, color: C.danger, weight: 700}) + L.circle(line.X(3), y, 9, C.ok) + L.text(line.X(3), y - 20, "b = 3", {size: 13, color: C.ok, weight: 700});
      m += L.line(line.X(-4), y - 50, line.X(-4 + 7 * f), y - 50, C.path, 4) + (t >= 3 ? L.text(line.X(-0.5), y - 60, "7 units", {size: 14, color: C.path, weight: 700}) : "");
      L.svg(m, "Distance between two integers", 190);
      L.readout([["a − b", "−4 − 3 = −7"], ["|a − b|", t >= 3 ? "7" : "…", C.path]]);
      msg = t < 4 ? "Measuring…" : "The distance is |a − b| = |−4 − 3| = <b>7</b> units.";
    } else if(id === "dense"){
      var level = Math.min(2, Math.floor(t * 0.75 + 1e-9)), lo = 1, his = [1.5, 1.25, 1.125], names = ["3/2", "5/4", "9/8", "17/16"];
      line = nlM3(L, {lo: lo, hi: his[level], parts: 4 / (his[level] - lo), x0: 80, x1: 640, y: y, major: function(i){ return i === 0 || i === 4; }, fmt: function(v, i){ return i === 0 ? "1" : names[level]; }});
      m += line.svg + L.circle(line.X((lo + his[level]) / 2), y, 9, C.path) + L.text(line.X((lo + his[level]) / 2), y - 22, names[level + 1], {size: 15, color: C.path, weight: 700});
      m += L.text(360, 40, "zoom " + (level + 1) + ": between 1 and " + names[level], {size: 13, color: C.muted});
      L.svg(m, "Density of rational numbers", 190);
      L.readout([["Interval", "1 to " + names[level]], ["Average", names[Math.min(3, level + 1)], C.path], ["Found so far", names.slice(1, level + 2).join(", ")]]);
      msg = t < 4 ? "Zooming in…" : "5/4, then 9/8, then 17/16, … averaging never runs out, so there are <b>infinitely many rationals</b> between 1 and 3/2.";
    } else {
      line = nlM3(L, {lo: 0, hi: 1, parts: 10, x0: 80, x1: 640, y: y, major: function(i){ return i === 0 || i === 10 || i === 5; }, fmt: function(v, i){ return i === 0 ? "3.1415" : i === 10 ? "3.1416" : "3.14155"; }});
      m += line.svg;
      [[0.1, "3.14151"], [0.5, "3.14155"], [0.9, "3.14159"]].forEach(function(p, i){ if(t >= i + 1) m += L.circle(line.X(p[0]), y, 8, C.path) + L.text(line.X(p[0]), y - 20 - (i % 2) * 16, p[1], {size: 12, color: C.path, weight: 700}); });
      L.svg(m, "Rationals between 3.1415 and 3.1416", 190);
      L.readout([["Each tick", "0.00001"], ["Chosen", ["3.14151", "3.14155", "3.14159"].slice(0, Math.min(3, Math.floor(t + 1e-9))).join(", ") || "…", C.path]]);
      msg = t < 4 ? "Adding a decimal place…" : "3.14151, 3.14155 and 3.14159 all lie between 3.1415 and 3.1416.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["q34", "Fig. 3.5: 3/4"], ["q94", "Fig. 3.6: 9/4"], ["neg", "−7/4 and 8/5"], ["dist", "Fig. 3.8: |a − b|"], ["dense", "Fig. 3.9: density"], ["tight", "Set 3.4 Q5: 3.1415 to 3.1416"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.numberline = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — √2: the diagonal, the proof, the construction and the square root spiral (§3.5)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "square"};
  var MAXT = {square: 5, proof: 8, construct: 5, spiral: 5};
  var STEPS = ["1. Assume √2 = p/q in lowest form (p, q co-prime).", "2. Square both sides: 2 = p²/q².", "3. Multiply by q²: 2q² = p².", "4. p² is even, so p is even: p = 2k.", "5. Substitute: 2q² = 4k².", "6. Divide by 2: q² = 2k².", "7. q² is even, so q is even.", "8. p and q share the factor 2: contradiction!"];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: MAXT[id], step: 0.04, speed: 1});
    L.legend({square: [[C.path, "diagonal"], [C.vel, "trial squares"]], proof: [[C.text, "step"], [C.danger, "contradiction"]], construct: [[C.vel, "unit steps"], [C.path, "arcs to the number line"]], spiral: [[C.path, "hypotenuses √n"]]}[id]);
    L.watch({square: "Fig. 3.10: the diagonal of a unit square. Try decimals whose square is close to 2.", proof: "§3.5.1: the proof by contradiction, one step at a time.", construct: "Fig. 3.11: construct √2 and then √3 with a ruler and compass.", spiral: "Fig. 3.14: add a unit side at right angles to each hypotenuse."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, id = st.preset;
    if(id === "square"){
      m += L.rect(60, 50, 180, 180, "rgba(56,189,248,0.12)", ' stroke="' + C.vel + '" stroke-width="2"') + L.line(60, 230, 240, 50, C.path, 4) + L.text(150, 250, "1", {size: 13, color: C.text}) + L.text(48, 140, "1", {size: 13, color: C.text, anchor: "end"}) + L.text(160, 130, "√2", {size: 16, color: C.path, weight: 700});
      var tries = [1.4, 1.41, 1.414, 1.4142, 1.41421], k = Math.min(5, Math.floor(t + 1e-9));
      tries.slice(0, k).forEach(function(v, i){ var sq = (v * v).toFixed(10).replace(/0+$/, ""); m += L.text(300, 70 + i * 36, v + "² = " + sq, {size: 15, color: C.vel, anchor: "start", mono: true}); });
      L.svg(m, "The diagonal of a unit square", 270);
      L.readout([["d²", "1² + 1² = 2"], ["Closest try", k ? String(tries[k - 1]) : "…", C.vel], ["Exactly 2?", t >= 5 ? "never" : "…", C.danger]]);
      msg = t < 5 ? "Trying decimals…" : "Each try gets closer to 2 but never equals it: <b>√2 ≈ 1.41421…</b> has no exact fraction.";
    } else if(id === "proof"){
      var n = Math.min(8, Math.floor(t + 1e-9) + 1);
      STEPS.slice(0, n).forEach(function(s, i){ m += L.text(40, 34 + i * 32, s, {size: 15, color: i === 7 ? C.danger : i === n - 1 ? C.path : C.text, anchor: "start", weight: i === n - 1 ? 700 : 400}); });
      L.svg(m, "Proof that √2 is irrational", 280);
      L.readout([["Step", n + " of 8"], ["Assumption", "√2 = p/q, lowest form"], ["Result", t >= 8 ? "contradiction" : "…", C.danger]]);
      msg = t < 8 ? "Following the argument…" : "The assumption led to a contradiction, so <b>√2 is irrational</b>.";
    } else if(id === "construct"){
      var ox = 110, oy = 220, u = 150, X = function(v){ return ox + v * u; }, Y = function(v){ return oy - v * u; };
      m += L.line(40, oy, 690, oy, C.faint, 2);
      [0, 1, 2, 3].forEach(function(v){ m += L.line(X(v), oy - 8, X(v), oy + 8, C.text, 2) + L.text(X(v), oy + 26, String(v), {size: 12, color: C.muted}); });
      m += L.text(X(0), oy + 44, "O", {size: 12, color: C.text});
      var f1 = clampM3(t, 0, 1), f2 = clampM3(t - 1, 0, 1), f3 = clampM3(t - 2, 0, 1), f4 = clampM3(t - 3, 0, 1), f5 = clampM3(t - 4, 0, 1);
      m += L.line(X(0), oy, X(f1), oy, C.vel, 4) + L.line(X(1), oy, X(1), Y(f1), C.vel, 4) + L.text(X(1) + 10, Y(0.5), "AB = 1", {size: 12, color: C.vel, anchor: "start"});
      if(f2 > 0) m += L.line(X(0), oy, X(f2), Y(f2), C.path, 3) + (f2 >= 1 ? L.text(X(0.45), Y(0.62), "√2", {size: 14, color: C.path, weight: 700}) : "");
      function arc(r, a0, frac){ var pts = [], k; for(k = 0; k <= 30; k++){ var a = a0 * (1 - frac * k / 30); pts.push(X(r * Math.cos(a)).toFixed(1) + "," + Y(r * Math.sin(a)).toFixed(1)); } return '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + C.path + '" stroke-width="2" stroke-dasharray="5 4"/>'; }
      if(f3 > 0) m += arc(Math.SQRT2, Math.PI / 4, f3);
      if(f3 >= 1) m += L.circle(X(Math.SQRT2), oy, 7, C.path) + L.text(X(Math.SQRT2), oy + 44, "P = √2", {size: 12, color: C.path, weight: 700});
      var cx = 1 - Math.SQRT1_2, cy = 1 + Math.SQRT1_2;
      if(f4 > 0) m += L.line(X(1), Y(1), X(1 + (cx - 1) * f4), Y(1 + (cy - 1) * f4), C.vel, 4) + L.line(X(0), oy, X(cx * f4), Y(cy * f4), C.acc, 3);
      if(f5 > 0) m += arc(Math.sqrt(3), Math.atan2(cy, cx), f5);
      if(f5 >= 1) m += L.circle(X(Math.sqrt(3)), oy, 7, C.acc) + L.text(X(Math.sqrt(3)) + 30, oy + 44, "Q = √3", {size: 12, color: C.acc, weight: 700});
      L.svg(m, "Constructing √2 and √3", 280);
      L.readout([["OB", "√(1² + 1²) = √2 ≈ 1.414", C.path], ["OC", t >= 4 ? "√(2 + 1) = √3 ≈ 1.732" : "…", C.acc]]);
      msg = t < 5 ? "Constructing…" : "OP = √2 ≈ 1.414 and OQ = √3 ≈ 1.732: irrational lengths are now <b>points on the number line</b>.";
    } else {
      var cx0 = 360, cy0 = 150, s = 42, n2 = Math.min(10, Math.floor(t / 5 * 10 + 1e-9)), P = [1, 0], cols = ["#38bdf8", "#a78bfa", "#f472b6", "#f59e0b", "#34d399", "#fb7185", "#60a5fa", "#facc15", "#c084fc", "#2dd4bf"];
      for(var i2 = 0; i2 < n2; i2++){
        var len = Math.hypot(P[0], P[1]), Q = [P[0] - P[1] / len, P[1] + P[0] / len];
        m += '<polygon points="' + cx0 + ',' + cy0 + ' ' + (cx0 + P[0] * s).toFixed(1) + ',' + (cy0 - P[1] * s).toFixed(1) + ' ' + (cx0 + Q[0] * s).toFixed(1) + ',' + (cy0 - Q[1] * s).toFixed(1) + '" fill="' + cols[i2] + '" fill-opacity="0.45" stroke="#e2e8f0" stroke-width="1.5"/>';
        P = Q;
      }
      L.svg(m, "Square root spiral", 300);
      var names = ["√2", "√3", "2", "√5", "√6", "√7", "√8", "3", "√10", "√11"];
      L.readout([["Triangles", n2 + " of 10"], ["Latest hypotenuse", n2 ? names[n2 - 1] : "…", C.path]]);
      msg = t < 5 ? "Adding unit sides…" : "The hypotenuses are √2, √3, 2, √5, √6, √7, √8, 3, √10 and <b>√11</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["square", "Fig. 3.10: the diagonal"], ["proof", "The proof by contradiction"], ["construct", "Fig. 3.11: construct √2, √3"], ["spiral", "Fig. 3.14: square root spiral"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.sqrt2 = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — π: Mādhava’s series, Āryabhaṭa’s value, a rolling wheel and the real line (§3.5.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "madhava"};
  function sum(n){ var s = 0; for(var k = 0; k < n; k++) s += (k % 2 ? -1 : 1) / (2 * k + 1); return 4 * s; }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend({madhava: [[C.path, "sum of n terms"], [C.ok, "π"]], aryabhata: [[C.path, "approximations"], [C.ok, "π"]], wheel: [[C.vel, "wheel of diameter 1"], [C.path, "distance rolled"]], realline: [[C.vel, "rational"], [C.path, "irrational"]]}[id]);
    L.watch({madhava: "Mādhava’s series: add one more term each step and watch the total.", aryabhata: "Āryabhaṭa’s 3927/1250 and the familiar 22/7, zoomed in next to π.", wheel: "Roll a wheel of diameter 1 unit through one full turn.", realline: "Fig. 3.12: rational and irrational numbers on one line."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, id = st.preset;
    if(id === "madhava"){
      var N = 20, n = Math.max(1, Math.min(N, Math.ceil(t / 4 * N)));
      var g = L.graph({x0: 90, y0: 250, w: 580, h: 210, tmax: N, vmin: 2.5, vmax: 4.2, tStep: 2, vStep: 0.25, tLabel: "number of terms n", vLabel: "sum", tFmt: function(v){ return L.num(v, 0); }, vFmt: function(v){ return L.num(v, 2); }});
      var pts = []; for(var k = 1; k <= n; k++) pts.push([k, sum(k)]);
      m += g.svg + L.polyline(g, [[0, Math.PI], [N, Math.PI]], C.ok, 2, "6 4") + L.polyline(g, pts, C.path, 2);
      pts.forEach(function(p){ m += L.circle(g.X(p[0]), g.Y(p[1]), 3.5, C.path); });
      L.svg(m, "Sums of Mādhava’s series", 290);
      L.readout([["Terms", String(n)], ["Sum", L.num(sum(n), 4), C.path], ["π", "3.1416", C.ok], ["Gap", L.num(Math.abs(sum(n) - Math.PI), 4)]]);
      msg = t < 4 ? "Adding terms…" : "After 20 terms the sum is " + L.num(sum(20), 4) + ": the sums <b>swing above and below π</b> and close in slowly.";
    } else if(id === "aryabhata"){
      var lo = 3.14, hi = 3.1435, X = function(v){ return 70 + (v - lo) / (hi - lo) * 580; }, y = 150;
      m += L.line(50, y, 670, y, C.faint, 2);
      for(var i = 0; i <= 6; i++){ var v = lo + i * 0.00025; m += L.line(X(v), y - 6, X(v), y + 6, C.muted, 1) + (i % 2 === 0 ? L.text(X(v), y + 24, L.num(v, 4), {size: 11, color: C.muted}) : ""); }
      var items = [[Math.PI, "π = 3.14159…", C.ok], [3.1416, "3927/1250 = 3.1416", C.path], [22 / 7, "22/7 = 3.14286…", C.danger]];
      items.forEach(function(it, j){ if(t >= j * 1.2) m += L.circle(X(it[0]), y, 7, it[2]) + L.line(X(it[0]), y - 10, X(it[0]), y - 40 - j * 26, it[2], 1.5) + L.text(X(it[0]), y - 46 - j * 26, it[1], {size: 12, color: it[2], weight: 700}); });
      L.svg(m, "Approximations of π", 210);
      L.readout([["3.1416 − π", L.num(3.1416 - Math.PI, 7), C.path], ["22/7 − π", L.num(22 / 7 - Math.PI, 4), C.danger]]);
      msg = t < 4 ? "Zooming in…" : "3927/1250 = 3.1416 differs from π by only <b>" + L.num(3.1416 - Math.PI, 7) + "</b>; 22/7 is off by about " + L.num(22 / 7 - Math.PI, 4) + ".";
    } else if(id === "wheel"){
      var u = 150, r = u / 2, x0 = 80, y0 = 230, f = clampM3(t / 4, 0, 1), cx = x0 + Math.PI * u * f, ang = 2 * Math.PI * f;
      m += L.line(40, y0, 700, y0, C.faint, 2);
      [0, 1, 2, 3, 4].forEach(function(v){ m += L.line(x0 + v * u, y0 - 6, x0 + v * u, y0 + 6, C.text, 2) + L.text(x0 + v * u, y0 + 24, String(v), {size: 12, color: C.muted}); });
      m += L.line(x0, y0 + 36, cx, y0 + 36, C.path, 4) + L.circle(cx, y0 - r, r, "rgba(56,189,248,0.12)", ' stroke="' + C.vel + '" stroke-width="3"');
      m += L.circle(cx - r * Math.sin(ang), y0 - r + r * Math.cos(ang), 7, C.path) + L.line(cx, y0 - r, cx - r * Math.sin(ang), y0 - r + r * Math.cos(ang), C.vel, 2);
      if(t >= 4) m += L.text(x0 + Math.PI * u, y0 + 58, "π ≈ 3.14159", {size: 13, color: C.path, weight: 700});
      L.svg(m, "A rolling wheel", 300);
      L.readout([["Diameter", "1 unit"], ["Turns", L.num(f, 2)], ["Distance", L.num(Math.PI * f, 3) + " units", C.path]]);
      msg = t < 4 ? "Rolling…" : "One turn of a wheel of diameter 1 unit covers its circumference, <b>π ≈ 3.14159</b> units.";
    } else {
      var X2 = function(v){ return 60 + (v + 5) / 10 * 600; }, y2 = 170;
      m += L.line(40, y2, 680, y2, C.faint, 2);
      for(var q = -5; q <= 5; q++) m += L.line(X2(q), y2 - 7, X2(q), y2 + 7, C.text, 1.5) + L.text(X2(q), y2 + 24, sgnM3(q), {size: 11, color: C.muted});
      var list = [[-22 / 5, "−22/5", 0], [-Math.sqrt(10), "−√10", 1], [-12 / 5, "−12/5", 0], [-3 / 2, "−3/2", 0], [-1 / 3, "−1/3", 0], [5 / 6, "5/6", 0], [Math.SQRT2, "√2", 1], [3 / 2, "3/2", 0], [Math.sqrt(5), "√5", 1], [Math.PI, "π", 1], [7 / 2, "7/2", 0], [9 / 2, "9/2", 0]];
      var shown = Math.floor(t / 4 * list.length + 1e-9);
      list.slice(0, shown).forEach(function(it, i){ var col = it[2] ? C.path : C.vel, up = i % 2 === 0; m += L.circle(X2(it[0]), y2, 5, col) + L.text(X2(it[0]), up ? y2 - 16 - (i % 4 === 0 ? 18 : 0) : y2 + 46 + (i % 4 === 1 ? 18 : 0), it[1], {size: 12, color: col, weight: 700}); });
      L.svg(m, "The real number line", 260);
      L.readout([["Rational shown", String(list.slice(0, shown).filter(function(it){ return !it[2]; }).length), C.vel], ["Irrational shown", String(list.slice(0, shown).filter(function(it){ return it[2]; }).length), C.path]]);
      msg = t < 4 ? "Placing numbers…" : "Fractions and irrational numbers such as √2, √5, π and −√10 all sit on one line: <b>the real numbers</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["madhava", "Mādhava’s series"], ["aryabhata", "Āryabhaṭa’s 3.1416"], ["wheel", "A wheel rolls π"], ["realline", "Fig. 3.12: the real line"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.pi = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Decimal expansions: long division, prediction, conversion, cyclic numbers, 0.999… (§3.6)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "longdiv"};
  var MAXT = {longdiv: 7, predict: 4, convert: 4, cyclic: 6, nines: 4};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: MAXT[id], step: 0.04, speed: 1});
    L.legend({longdiv: [[C.path, "digit"], [C.vel, "remainder"]], predict: [[C.ok, "terminates"], [C.danger, "repeats"]], convert: [[C.path, "step"]], cyclic: [[C.path, "starting digit"]], nines: [[C.vel, "0.99…9"], [C.danger, "gap to 1"]]}[id]);
    L.watch({longdiv: "Long division for 1/7: watch the remainders. The first repeated remainder starts the loop.", predict: "Exercise Set 3.5 Q1 and more: predict from the prime factors of the denominator.", convert: "Example 6: turn 0.4545… into a fraction.", cyclic: "§3.6.2: 142857 multiplied by 1 to 6.", nines: "Exercise Set 3.5 Q4: how far is 0.99…9 from 1?"}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, id = st.preset;
    if(id === "longdiv"){
      var r = 1, rows = [], k;
      for(k = 0; k < 7; k++){ var dgt = Math.floor(r * 10 / 7), nr = (r * 10) % 7; rows.push([r * 10, dgt, nr]); r = nr; }
      var n = Math.min(7, Math.floor(t + 1e-9) + 1);
      m += L.text(60, 34, "bring down", {size: 12, color: C.muted, anchor: "start"}) + L.text(230, 34, "÷ 7 = digit", {size: 12, color: C.muted, anchor: "start"}) + L.text(400, 34, "remainder", {size: 12, color: C.muted, anchor: "start"});
      rows.slice(0, n).forEach(function(rw, i){ var back = i === 5; m += L.text(60, 66 + i * 30, String(rw[0]), {size: 16, color: C.text, anchor: "start", mono: true}) + L.text(230, 66 + i * 30, String(rw[1]), {size: 16, color: C.path, anchor: "start", mono: true, weight: 700}) + L.text(400, 66 + i * 30, String(rw[2]), {size: 16, color: back ? C.danger : C.vel, anchor: "start", mono: true, weight: back ? 700 : 400}); });
      m += L.text(560, 120, "1/7 = 0." + rows.slice(0, Math.min(6, n)).map(function(rw){ return rw[1]; }).join("") + (n >= 7 ? "142857…" : "…"), {size: 15, color: C.path, weight: 700, mono: true});
      L.svg(m, "Long division for 1/7", 290);
      L.readout([["Digits", rows.slice(0, n).map(function(rw){ return rw[1]; }).join(""), C.path], ["Remainders", "1, " + rows.slice(0, n).map(function(rw){ return rw[2]; }).join(", "), C.vel]]);
      msg = t < 7 ? "Dividing…" : "The remainder 1 comes back after 6 steps, so the digits <b>142857 repeat</b>: 1/7 = 0.142857142857…";
    } else if(id === "predict"){
      var cards = [["7/20", "20 = 2² × 5", 1, "0.35"], ["4/15", "15 = 3 × 5", 0, "0.2666…"], ["13/250", "250 = 2 × 5³", 1, "0.052"], ["5/11", "11 = 11", 0, "0.4545…"]];
      cards.forEach(function(c, i){
        var on = t >= i * 0.9, y = 20 + i * 64, col = c[2] ? C.ok : C.danger;
        m += L.rect(40, y, 640, 52, on ? (c[2] ? "rgba(52,211,153,0.10)" : "rgba(239,68,68,0.10)") : "rgba(148,163,184,0.05)", ' rx="8"') + L.text(70, y + 33, c[0], {size: 20, color: C.text, anchor: "start", weight: 700, mono: true});
        if(on) m += L.text(210, y + 33, c[1], {size: 15, color: C.muted, anchor: "start"}) + L.text(430, y + 33, c[2] ? "terminates" : "repeats", {size: 15, color: col, anchor: "start", weight: 700}) + L.text(660, y + 33, c[3], {size: 15, color: col, anchor: "end", mono: true});
      });
      L.svg(m, "Predicting decimal expansions", 280);
      L.readout([["Rule", "only 2s and 5s in q ⇒ terminates"], ["Terminating", t >= 3 ? "7/20, 13/250" : "…", C.ok], ["Repeating", t >= 3 ? "4/15, 5/11" : "…", C.danger]]);
      msg = t < 4 ? "Factorising denominators…" : "7/20 and 13/250 terminate (only 2s and 5s); <b>4/15 and 5/11 repeat</b>.";
    } else if(id === "convert"){
      var lines = ["x = 0.454545…", "100x = 45.454545…", "100x − x = 45", "99x = 45", "x = 45/99 = 5/11"];
      lines.slice(0, Math.min(5, Math.floor(t + 1e-9) + 1)).forEach(function(s, i){ m += L.text(120, 50 + i * 44, s, {size: 22, color: i === 4 ? C.path : C.text, anchor: "start", mono: true, weight: i === 4 ? 700 : 400}); });
      L.svg(m, "Converting a repeating decimal", 260);
      L.readout([["Repeating digits", "2 (45)"], ["Multiply by", "10² = 100"], ["Result", t >= 4 ? "5/11" : "…", C.path]]);
      msg = t < 4 ? "Shifting and subtracting…" : "100x − x = 45, so x = 45/99 = <b>5/11</b>.";
    } else if(id === "cyclic"){
      var digits = "142857", cx = 170, cy = 145, R = 90, n2 = Math.min(6, Math.floor(t + 1e-9) + 1), prods = ["142857", "285714", "428571", "571428", "714285", "857142"], start = prods[n2 - 1].charAt(0), idx = digits.indexOf(start);
      for(var i = 0; i < 6; i++){ var a = -Math.PI / 2 + i * Math.PI / 3, on = i === idx; m += L.circle(cx + R * Math.cos(a), cy + R * Math.sin(a), 22, on ? C.path : "rgba(148,163,184,0.12)") + L.text(cx + R * Math.cos(a), cy + R * Math.sin(a) + 7, digits.charAt(i), {size: 20, color: on ? "#111" : C.text, weight: 700}); }
      prods.slice(0, n2).forEach(function(p, j){ m += L.text(360, 44 + j * 40, "142857 × " + (j + 1) + " = " + p, {size: 18, color: j === n2 - 1 ? C.path : C.text, anchor: "start", mono: true}); });
      L.svg(m, "The cyclic number 142857", 290);
      L.readout([["Multiplier", String(n2)], ["Product", prods[n2 - 1], C.path], ["× 7", t >= 6 ? "999999" : "…"]]);
      msg = t < 6 ? "Multiplying…" : "142857 × 1 to 6 uses the same digits in the same circular order, and <b>142857 × 7 = 999999</b>.";
    } else {
      var n3 = Math.min(8, Math.floor(t / 4 * 8 + 1e-9) + 1);
      for(var j2 = 1; j2 <= n3; j2++){ var val = "0." + new Array(j2 + 1).join("9"), y = 20 + (j2 - 1) * 30; m += L.text(40, y + 18, val, {size: 15, color: C.vel, anchor: "start", mono: true}) + L.rect(260, y + 4, 400 * Math.pow(0.1, j2 - 1), 18, C.danger) + L.text(250, y + 18, "gap 10⁻" + (j2 === 1 ? "¹" : j2 === 2 ? "²" : j2 === 3 ? "³" : j2 === 4 ? "⁴" : j2 === 5 ? "⁵" : j2 === 6 ? "⁶" : j2 === 7 ? "⁷" : "⁸"), {size: 12, color: C.danger, anchor: "end"}); }
      L.svg(m, "0.999… and 1", 270);
      L.readout([["Nines", String(n3)], ["Gap to 1", "0." + new Array(n3).join("0") + "1", C.danger]]);
      msg = t < 4 ? "Adding nines…" : "The gap to 1 is 0.1, 0.01, 0.001, …, smaller than any positive number, so <b>0.999… = 1</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["longdiv", "Long division: 1/7"], ["predict", "Terminate or repeat?"], ["convert", "Example 6: 0.4545…"], ["cyclic", "Cyclic 142857"], ["nines", "0.999… = 1"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.decimals = {mount: mount, draw: draw, select: select, state: st};
})();
