// iemh108 labs: Predicting What Comes Next — Sequences and Progressions.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function nM8(v, d){ var L = window.LAB; if(d !== undefined) return L.num(v, d); var a = Math.abs(v); if(Math.abs(a - Math.round(a)) < 1e-9) return L.num(v, 0); if(Math.abs(a * 100 - Math.round(a * 100)) < 1e-6) return L.num(v, 2); return L.num(v, 3); }
function clampM8(x, a, b){ return Math.max(a, Math.min(b, x)); }
var SUBM8 = {"0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉", "n": "ₙ", "-": "₋"};
function subM8(s){ return String(s).split("").map(function(c){ return SUBM8[c] || c; }).join(""); }
function sliderSetM8(L, st, defs){
  L.controls(defs.map(function(d){ return L.slider(d[0], d[1], d[2], d[3], d[4], st[d[5]], nM8(st[d[5]])); }).join(""));
  defs.forEach(function(d){ L.onInput(d[0], function(v){ st[d[5]] = v; L.setVal(d[0], nM8(v)); App.resetTimeline(); App.play(); }); });
}
// Scatter plot of points [n, value] inside the box (x0, y0, w, h); optional straight guide line.
function plotM8(L, C, pts, box, opt){
  opt = opt || {};
  var vals = pts.map(function(p){ return p[1]; }).concat(opt.extra || []), lo = Math.min(0, Math.min.apply(null, vals)), hi = Math.max(1, Math.max.apply(null, vals)), nmax = opt.nmax || pts.length;
  var X = function(n){ return box[0] + 20 + (n - (opt.n0 || 1)) / Math.max(1, nmax - (opt.n0 || 1)) * (box[2] - 40); }, Y = function(v){ return box[1] + box[3] - 20 - (v - lo) / (hi - lo) * (box[3] - 40); };
  var m = L.line(box[0], Y(0), box[0] + box[2], Y(0), C.faint, 1) + L.line(box[0] + 10, box[1], box[0] + 10, box[1] + box[3], C.faint, 1);
  m += L.text(box[0] + 6, Y(hi) + 4, nM8(hi), {size: 10, color: C.muted, anchor: "end"}) + (lo < 0 ? L.text(box[0] + 6, Y(lo) + 4, nM8(lo), {size: 10, color: C.muted, anchor: "end"}) : "");
  if(opt.line && pts.length > 1) m += '<polyline points="' + pts.map(function(p){ return X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1); }).join(" ") + '" fill="none" stroke="' + (opt.lineColor || C.muted) + '" stroke-width="1.5" stroke-dasharray="5 4"/>';
  pts.forEach(function(p){ m += L.circle(X(p[0]), Y(p[1]), 5, opt.color || C.path); });
  return m;
}

// Lab 1 — Sequences and patterns (§8.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "tri"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 6, step: 0.05, speed: 1});
    L.legend({tri: [[C.path, "dots"]], square: [[C.path, "odd-number layers"]], sums: [[C.path, "terms"], [C.vel, "running sums"]], kinds: [[C.path, "1, 1/2, 1/3, …"], [C.vel, "−7, −3, 1, 5, 9"]]}[id]);
    L.watch({tri: "Fig. 8.1: triangular numbers as triangles of dots.", square: "Fig. 8.2: each square number adds the next odd number as an L-shaped layer.", sums: "In-text exercise: the terms of 1, 4, 7, 10, … and their running sums.", kinds: "Other kinds of sequences: unit fractions and negative terms on a number line."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var f = clampM8(t / 6, 0, 1), id = st.preset, k = Math.min(6, Math.floor(f * 6 + 1e-9) + 1), m = "", msg;
    if(id === "tri"){
      var terms = [];
      for(var s = 1; s <= k; s++) terms.push(s * (s + 1) / 2);
      for(var r = 1; r <= k; r++) for(var c = 0; c < r; c++) m += L.circle(260 + (c - (r - 1) / 2) * 30, 40 + (r - 1) * 36, 10, r === k ? C.path : "rgba(251,191,36,0.45)");
      m += L.text(520, 120, "t" + subM8(k) + " = " + terms[k - 1], {size: 22, color: C.path, anchor: "start", weight: 700}) + L.text(520, 150, Array.apply(null, {length: k}).map(function(_, i){ return i + 1; }).join(" + "), {size: 15, color: C.muted, anchor: "start"});
      L.svg(m, "Triangular numbers as dots", 280);
      L.readout([["Stage", String(k)], ["Terms so far", terms.join(", "), C.path]]);
      msg = t < 6 ? "Adding a row…" : "<b>t₆ = 21</b> = 1 + 2 + 3 + 4 + 5 + 6: each triangular number adds the next natural number.";
    } else if(id === "square"){
      var cols = ["rgba(251,191,36,0.9)", "rgba(56,189,248,0.75)"], sz = 38;
      for(var i = 0; i < k; i++) for(var j = 0; j < k; j++){ var layer = Math.max(i, j); m += L.rect(150 + j * sz, 30 + i * sz, sz - 3, sz - 3, cols[layer % 2], ' rx="4"'); }
      var odds = [];
      for(var q = 1; q <= k; q++) odds.push(2 * q - 1);
      m += L.text(470, 120, k * k + " = " + odds.join(" + "), {size: 17, color: C.path, anchor: "start", weight: 700});
      L.svg(m, "Square numbers built from odd layers", 280);
      L.readout([["Stage", String(k)], ["Newest layer", (2 * k - 1) + " tiles", C.path], ["Square", String(k * k)]]);
      msg = t < 6 ? "Adding an L-shaped layer…" : "<b>36 = 1 + 3 + 5 + 7 + 9 + 11</b>: square numbers are sums of odd numbers.";
    } else if(id === "sums"){
      var n = Math.min(10, Math.floor(f * 10 + 1e-9) + 1), run = 0;
      m += L.text(40, 90, "term", {size: 14, color: C.muted, anchor: "start"}) + L.text(40, 160, "running sum", {size: 14, color: C.muted, anchor: "start"});
      for(var p = 0; p < n; p++){ var term = 1 + 3 * p; run += term; var x = 170 + p * 54; m += L.rect(x - 22, 66, 44, 36, "rgba(251,191,36,0.3)", ' rx="6"') + L.text(x, 90, String(term), {size: 15, color: C.text, anchor: "middle", weight: 700}) + L.rect(x - 24, 136, 48, 36, "rgba(56,189,248,0.3)", ' rx="6"') + L.text(x, 160, String(run), {size: 15, color: C.vel, anchor: "middle", weight: 700}); }
      L.svg(m, "Terms and running sums", 220);
      L.readout([["Terms used", String(n)], ["Latest term", String(1 + 3 * (n - 1)), C.path], ["Running sum", String(run), C.vel]]);
      msg = t < 6 ? "Adding terms…" : "Next four terms 16, 19, 22, 25; running sums 1, 5, 12, 22, 35, 51, 70, 92, 117, <b>145</b>.";
    } else {
      var X = function(v){ return 360 + v * 30; };
      m += L.line(40, 90, 690, 90, C.faint, 2) + L.line(40, 200, 690, 200, C.faint, 2);
      [-10, -5, 0, 5, 10].forEach(function(v){ m += L.line(X(v), 196, X(v), 204, C.muted, 1.5) + L.text(X(v), 222, String(v), {size: 11, color: C.muted, anchor: "middle"}); });
      var Xf = function(v){ return 80 + v * 560; }, nn = Math.min(8, Math.floor(f * 8 + 1e-9) + 1);
      [0, 0.5, 1].forEach(function(v){ m += L.line(Xf(v), 86, Xf(v), 94, C.muted, 1.5) + L.text(Xf(v), 112, nM8(v), {size: 11, color: C.muted, anchor: "middle"}); });
      for(var u = 1; u <= nn; u++) m += L.circle(Xf(1 / u), 90, 6, C.path) + (u <= 4 ? L.text(Xf(1 / u), 74, u === 1 ? "1" : "1/" + u, {size: 12, color: C.path, anchor: "middle"}) : "");
      var neg = [-7, -3, 1, 5, 9].slice(0, Math.min(5, Math.floor(f * 5 + 1e-9) + 1));
      neg.forEach(function(v){ m += L.circle(X(v), 200, 6, C.vel) + L.text(X(v), 184, String(v), {size: 12, color: C.vel, anchor: "middle"}); });
      L.svg(m, "Two kinds of sequences on number lines", 250);
      L.readout([["Unit fractions shown", String(nn), C.path], ["Negative-start terms shown", neg.join(", "), C.vel]]);
      msg = t < 6 ? "Placing terms…" : "1, 1/2, 1/3, … is <b>decreasing</b> towards 0, while −7, −3, 1, 5, 9 increases by 4 each time.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["tri", "Triangular numbers"], ["square", "Squares from odd numbers"], ["sums", "Running sums of 1, 4, 7, …"], ["kinds", "Fractions and negatives"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.patterns = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Explicit rules (§8.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "odd", p: 3, q: -7};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend([[C.path, "(n, tₙ)"]]);
    L.watch({odd: "Example 1: uₙ = 2n − 1 and the in-text exercise (53rd, 108th and 1170th terms).", member: "Example 2: is 308 a term of sₙ = 5n − 2? Is 471?", square: "Think and Reflect: the rule for the square numbers.", custom: "Build a rule tₙ = pn + q; the default is the in-text exercise tₙ = 3n − 7."}[id]);
    if(id === "custom") sliderSetM8(L, st, [["m8p", "p (multiplier of n)", -5, 5, 1, "p"], ["m8q", "q (constant)", -10, 10, 1, "q"]]); else L.controls("");
    L.restart(true);
  }
  function table(L, C, rows, x0){ var m = L.text(x0, 36, "n", {size: 13, color: C.muted, anchor: "middle"}) + L.text(x0 + 90, 36, "term", {size: 13, color: C.muted, anchor: "middle"}); rows.forEach(function(r, i){ m += L.text(x0, 60 + i * 26, String(r[0]), {size: 14, color: C.text, anchor: "middle"}) + L.text(x0 + 90, 60 + i * 26, nM8(r[1]), {size: 14, color: C.path, anchor: "middle", weight: 700}); }); return m; }
  function draw(t){
    var f = clampM8(t / 5, 0, 1), id = st.preset, m = "", msg, rule, N = 8, k = Math.min(N, Math.floor(f * N + 1e-9) + 1);
    rule = id === "odd" ? function(n){ return 2 * n - 1; } : id === "member" ? function(n){ return 5 * n - 2; } : id === "square" ? function(n){ return n * n; } : function(n){ return st.p * n + st.q; };
    var pts = [];
    for(var n = 1; n <= k; n++) pts.push([n, rule(n)]);
    m += table(L, C, pts, 60) + plotM8(L, C, pts, [300, 10, 400, 260], {nmax: N, extra: [rule(1), rule(N)], line: id !== "square"});
    L.svg(m, "Table and graph of an explicit rule", 280);
    if(id === "odd"){
      L.readout([["Rule", "uₙ = 2n − 1"], ["u₅₃", t >= 5 ? "105" : "…", C.path], ["u₁₀₈, u₁₁₇₀", t >= 5 ? "215, 2339" : "…"]]);
      msg = t < 5 ? "Filling the table…" : "No earlier terms needed: <b>u₅₃ = 105</b>, u₁₀₈ = 215, u₁₁₇₀ = 2339; and 2n − 1 = 137 gives n = 69.";
    } else if(id === "member"){
      L.readout([["Rule", "sₙ = 5n − 2"], ["5n − 2 = 308", "n = 62 ✓", C.ok], ["5n − 2 = 471", t >= 2.5 ? "n = 94.6 ✗" : "…", C.danger]]);
      msg = t < 5 ? "Testing 308 and 471…" : "308 = s₆₂, but 5n − 2 = 471 gives n = 94.6: s₉₄ = 468 and s₉₅ = 473, so <b>471 is not a term</b>.";
    } else if(id === "square"){
      L.readout([["Rule", "tₙ = n²"], ["t₁₂", "144", C.path]]);
      msg = t < 5 ? "Filling the table…" : "The square numbers follow tₙ = n², so <b>t₁₂ = 144</b>; the points curve upwards instead of lying on a line.";
    } else {
      var txt = "tₙ = " + (st.p === 1 ? "" : st.p === -1 ? "−" : nM8(st.p)) + (st.p === 0 ? "" : "n") + (st.q === 0 ? (st.p === 0 ? "0" : "") : (st.q < 0 ? " − " + nM8(-st.q) : (st.p === 0 ? "" : " + ") + nM8(st.q)));
      L.readout([["Rule", txt], ["t₁", nM8(rule(1))], ["t₅₀", nM8(rule(50)), C.path]]);
      msg = t < 5 ? "Filling the table…" : txt + ": t₁ = " + nM8(rule(1)) + ", t₁₂ = " + nM8(rule(12)) + ", <b>t₅₀ = " + nM8(rule(50)) + "</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["odd", "Odd numbers uₙ = 2n − 1"], ["member", "Is it a term?"], ["square", "Squares tₙ = n²"], ["custom", "Your own rule"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.explicit = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Recursive rules and Virahānka’s sequence (§8.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "add3"};
  var S = {
    add3: {name: "t", terms: [1, 4, 7, 10, 13, 16, 19, 22, 25], rule: "t₁ = 1, tₙ = tₙ₋₁ + 3", back: 1},
    ex3: {name: "u", terms: [1, 5, 13, 29, 61, 125, 253], rule: "u₁ = 1, uₙ = 2uₙ₋₁ + 3", back: 1},
    ex4: {name: "s", terms: [3, 6, 30, 870], rule: "s₁ = 3, sₙ = sₙ₋₁(sₙ₋₁ − 1)", back: 1},
    virahanka: {name: "V", terms: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89], rule: "V₁ = 1, V₂ = 2, Vₙ = Vₙ₋₁ + Vₙ₋₂", back: 2}
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend([[C.path, "new term"], [C.vel, "terms used by the rule"]]);
    L.watch({add3: "§8.3: the recursive rule for 1, 4, 7, 10, 13, ….", ex3: "Example 3: is 133 a term?", ex4: "Example 4: a rule that makes the terms explode.", virahanka: "Virahānka–Fibonacci: each term adds the two before it."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var sp = S[st.preset], f = clampM8(t / 5, 0, 1), N = sp.terms.length, k = Math.min(N, Math.floor(f * N + 1e-9) + 1), w = Math.min(64, 620 / N - 6), m = "", msg;
    for(var i = 0; i < k; i++){
      var x = 40 + i * (w + 6), isNew = i === k - 1, used = i >= k - 1 - sp.back && i < k - 1;
      m += L.rect(x, 110, w, 50, isNew ? "rgba(251,191,36,0.9)" : used ? "rgba(56,189,248,0.45)" : "rgba(148,163,184,0.2)", ' rx="8"') + L.text(x + w / 2, 142, String(sp.terms[i]), {size: sp.terms[i] > 99 ? 13 : 16, color: C.text, anchor: "middle", weight: 700}) + L.text(x + w / 2, 182, sp.name + subM8(i + 1), {size: 12, color: C.muted, anchor: "middle"});
      if(isNew && i > 0) for(var b = 1; b <= Math.min(sp.back, i); b++){ var xs = 40 + (i - b) * (w + 6) + w / 2; m += '<path d="M ' + xs.toFixed(1) + ' 108 Q ' + ((xs + x + w / 2) / 2).toFixed(1) + ' ' + (60 - 20 * b) + ' ' + (x + w / 2).toFixed(1) + ' 106" fill="none" stroke="' + C.vel + '" stroke-width="2"/>'; }
    }
    m += L.text(40, 240, sp.rule, {size: 16, color: C.text, anchor: "start"});
    L.svg(m, "Terms produced by a recursive rule", 260);
    L.readout([["Rule", sp.rule], ["Terms", sp.terms.slice(0, k).join(", "), C.path]]);
    if(st.preset === "add3") msg = t < 5 ? "Applying the rule…" : "1, 4, 7, …, 25: the recursive rule gives the same terms as <b>tₙ = 3n − 2</b>.";
    else if(st.preset === "ex3") msg = t < 5 ? "Applying the rule…" : "The terms increase and 125 < 133 < 253, so <b>133 is not a term</b>.";
    else if(st.preset === "ex4") msg = t < 5 ? "Applying the rule…" : "3, 6, 30, <b>870</b>: each term is the previous one times one less than itself, so the terms explode.";
    else msg = t < 5 ? "Adding the previous two…" : "1, 2, 3, 5, 8, 13, 21, 34, 55, <b>89</b>: Vₙ also counts the rhythms of n beats made of short (1) and long (2) syllables.";
    L.verdict(msg);
  }
  function mount(){ L.presets([["add3", "Add 3 each time"], ["ex3", "Example 3: uₙ = 2uₙ₋₁ + 3"], ["ex4", "Example 4: sₙ = sₙ₋₁(sₙ₋₁ − 1)"], ["virahanka", "Virahānka–Fibonacci"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.recursive = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Arithmetic progressions (§8.4)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "pattern", a: 2, d: 3};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 6, step: 0.05, speed: 1});
    L.legend([[C.path, "(n, tₙ)"], [C.muted, "straight line through the points"]]);
    L.watch({pattern: "Fig. 8.3: each stage adds 4 squares at the corners.", slider: "Choose a and d; the points of every AP lie on a straight line (Fig. 8.4).", taxi: "Example 5: ₹200 booking fee plus ₹40 per km.", decreasing: "§8.4: the AP 11, 7, 3, −1, … with a negative common difference."}[id]);
    if(id === "slider") sliderSetM8(L, st, [["m8a", "first term a", -10, 10, 1, "a"], ["m8d", "common difference d", -5, 5, 1, "d"]]); else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var f = clampM8(t / 6, 0, 1), id = st.preset, m = "", msg, k = Math.min(6, Math.floor(f * 6 + 1e-9) + 1), pts = [];
    if(id === "pattern"){
      var sz = 18, cx = 150, cy = 140;
      m += L.rect(cx - sz / 2, cy - sz / 2, sz, sz, "rgba(251,191,36,0.9)", ' stroke="#1f2937"');
      for(var s = 1; s < k; s++) [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(dir){ m += L.rect(cx - sz / 2 + dir[0] * s * sz, cy - sz / 2 + dir[1] * s * sz, sz, sz, "rgba(251,191,36,0.9)", ' stroke="#1f2937"'); });
      for(var n = 1; n <= k; n++) pts.push([n, 4 * n - 3]);
      m += plotM8(L, C, pts, [320, 10, 380, 260], {nmax: 6, extra: [21], line: true});
      L.svg(m, "Growing pattern of squares and its graph", 280);
      L.readout([["Stage", String(k)], ["Squares", String(4 * k - 3), C.path], ["Rule", "tₙ = 1 + (n − 1) × 4"]]);
      msg = t < 6 ? "Growing…" : "1, 5, 9, 13, 17, 21: Stage n has <b>4n − 3</b> squares, and the points lie on a straight line.";
    } else if(id === "slider" || id === "decreasing"){
      var a = id === "slider" ? st.a : 11, d = id === "slider" ? st.d : -4, K = Math.min(8, Math.floor(f * 8 + 1e-9) + 1);
      for(var q = 1; q <= K; q++) pts.push([q, a + (q - 1) * d]);
      m += plotM8(L, C, pts, [60, 10, 620, 260], {nmax: 8, extra: [a, a + 7 * d], line: true});
      L.svg(m, "Points of an arithmetic progression", 280);
      var c0 = a - d, form = "tₙ = " + (d === 0 ? nM8(a) : (d === 1 ? "" : d === -1 ? "−" : nM8(d)) + "n" + (c0 === 0 ? "" : c0 > 0 ? " + " + nM8(c0) : " − " + nM8(-c0)));
      L.readout([["a", nM8(a)], ["d", nM8(d), C.path], ["Terms", pts.map(function(p){ return nM8(p[1]); }).join(", ")], ["Rule", form]]);
      msg = t < 6 ? "Plotting terms…" : (id === "decreasing" ? "Each step subtracts 4: <b>d = −4</b>, " + form + "; the points fall along a straight line." : form + ": every step adds " + nM8(d) + ", so the points lie on a <b>straight line</b> with slope d.");
    } else {
      var K2 = Math.min(10, Math.floor(f * 10 + 1e-9) + 1);
      for(var km = 1; km <= K2; km++) pts.push([km, 200 + 40 * km]);
      m += plotM8(L, C, pts, [60, 10, 620, 260], {nmax: 10, extra: [600], line: true});
      L.svg(m, "Taxi fare against distance", 280);
      L.readout([["Distance", K2 + " km"], ["Fare", "₹" + (200 + 40 * K2), C.path], ["Rule", "tₙ = 240 + (n − 1) × 40 = 200 + 40n"]]);
      msg = t < 6 ? "Driving…" : "240, 280, 320, …: tₙ = 200 + 40n, so a 10 km ride costs <b>₹600</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["pattern", "Fig. 8.3 pattern"], ["slider", "Choose a and d"], ["taxi", "Example 5: taxi fare"], ["decreasing", "11, 7, 3, −1, …"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.ap = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Sum of the first n natural numbers (§8.5)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "pair", n: 100};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend({pair: [[C.path, "1, 2, …, 10"], [C.vel, "10, 9, …, 1"]], staircase: [[C.path, "1 + 2 + … + 6"], [C.vel, "the same staircase turned over"]], slider: [[C.path, "Sₙ = n(n + 1)/2"]], run: [[C.path, "25 to 58"], [C.faint, "1 to 24"]]}[id]);
    L.watch({pair: "§8.5: write the sum forwards and backwards, and add in columns.", staircase: "Fig. 8.5: two staircases of 1 + 2 + … + 6 make a 7 × 6 rectangle.", slider: "Choose n and use the formula.", run: "§8.5: 25 + 26 + … + 58 as a difference of two sums."}[id]);
    if(id === "slider") sliderSetM8(L, st, [["m8n", "n", 1, 200, 1, "n"]]); else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var f = clampM8(t / 5, 0, 1), id = st.preset, m = "", msg;
    if(id === "pair"){
      var k = Math.min(10, Math.floor(f * 10 + 1e-9) + 1);
      for(var i = 0; i < 10; i++){ var x = 90 + i * 58, on = i < k; m += L.text(x, 70, String(i + 1), {size: 18, color: C.path, anchor: "middle", weight: 700}) + (on ? L.text(x, 110, String(10 - i), {size: 18, color: C.vel, anchor: "middle", weight: 700}) + L.line(x - 18, 124, x + 18, 124, C.faint, 1) + L.text(x, 150, "11", {size: 18, color: C.text, anchor: "middle", weight: 700}) : ""); }
      m += L.text(30, 70, "S =", {size: 16, color: C.text, anchor: "start"}) + L.text(30, 110, "S =", {size: 16, color: C.text, anchor: "start"}) + L.text(20, 150, "2S =", {size: 16, color: C.text, anchor: "start"});
      L.svg(m, "A sum written forwards and backwards", 190);
      L.readout([["Columns added", String(k)], ["Each column", "11"], ["2S", k === 10 ? "10 × 11 = 110" : "…", C.path]]);
      msg = t < 5 ? "Adding column by column…" : "2S = 11 added 10 times = 110, so <b>S = 55</b>.";
    } else if(id === "staircase"){
      var sz = 30, rows = Math.min(6, Math.floor(f * 6 + 1e-9) + 1);
      for(var r = 1; r <= rows; r++) for(var c = 0; c < 7; c++){ var left = c < r; m += L.circle(200 + c * sz, 40 + (r - 1) * sz, 11, left ? C.path : C.vel); }
      m += L.text(470, 110, "7 columns × 6 rows = 42", {size: 16, color: C.text, anchor: "start"}) + L.text(470, 140, "half of 42 = 21", {size: 16, color: C.path, anchor: "start", weight: 700});
      L.svg(m, "Two staircases forming a rectangle", 240);
      L.readout([["Rows shown", String(rows)], ["Dots in the rectangle", String(rows * 7)], ["1 + 2 + … + " + rows, String(rows * (rows + 1) / 2), C.path]]);
      msg = t < 5 ? "Stacking rows…" : "2 × (1 + 2 + 3 + 4 + 5 + 6) = 7 × 6 = 42, so 1 + 2 + … + 6 <b>= 21</b>.";
    } else if(id === "slider"){
      var n = st.n, shown = Math.max(1, Math.round(n * f)), S = n * (n + 1) / 2, W = 520, H = 220, x0 = 100, y0 = 250;
      m += '<polygon points="' + x0 + ',' + y0 + ' ' + (x0 + W * shown / n) + ',' + y0 + ' ' + (x0 + W * shown / n) + ',' + (y0 - H * shown / n) + '" fill="rgba(251,191,36,0.5)" stroke="' + C.path + '" stroke-width="2"/>';
      m += L.text(x0, 30, "1 + 2 + … + " + n, {size: 16, color: C.text, anchor: "start"}) + L.text(x0, 56, "= " + n + " × " + (n + 1) + " ÷ 2 = " + S, {size: 16, color: C.path, anchor: "start", weight: 700});
      L.svg(m, "The staircase sum for any n", 270);
      L.readout([["n", String(n)], ["Running total", String(shown * (shown + 1) / 2)], ["Sₙ = n(n + 1)/2", String(S), C.path]]);
      msg = t < 5 ? "Adding…" : "S = n(n + 1)/2 = " + n + " × " + (n + 1) + "/2 = <b>" + S + "</b>.";
    } else {
      var upto = Math.min(58, Math.floor(f * 58 + 1e-9) + 1), bw = 10.5;
      for(var v = 1; v <= upto; v++){ var h = v * 3.4; m += L.rect(40 + (v - 1) * bw, 240 - h, bw - 1.5, h, v >= 25 ? "rgba(251,191,36,0.85)" : "rgba(148,163,184,0.3)", ""); }
      m += L.text(40 + 24 * bw, 256, "25", {size: 11, color: C.muted, anchor: "middle"}) + L.text(40 + 57.5 * bw, 256, "58", {size: 11, color: C.muted, anchor: "middle"});
      L.svg(m, "Bars for 1 to 58 with 25 to 58 highlighted", 270);
      L.readout([["S₅₈", "58 × 59/2 = 1711"], ["S₂₄", "24 × 25/2 = 300"], ["25 + … + 58", upto === 58 ? "1411" : "…", C.path]]);
      msg = t < 5 ? "Adding bars…" : "25 + 26 + … + 58 = S₅₈ − S₂₄ = 1711 − 300 = <b>1411</b> (also 34 terms × average 41.5).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["pair", "Forwards and backwards"], ["staircase", "Fig. 8.5 staircase"], ["slider", "Any n"], ["run", "25 + … + 58"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.gauss = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Geometric progressions (§8.6, §8.6.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "doubling"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 6, step: 0.05, speed: 1});
    L.legend({doubling: [[C.ok, "green squares"]], ratio: [[C.path, "term"], [C.vel, "ratio to the previous term"]], ball: [[C.path, "bounce height"], [C.danger, "1/6 of 24 ft = 4 ft"]], compare: [[C.vel, "AP 3, 6, 9, …"], [C.path, "GP 3, 6, 12, …"]]}[id]);
    L.watch({doubling: "Fig. 8.6: the number of green squares doubles at each stage.", ratio: "Example 9: is 5, 15/4, 45/16, 135/64, … a GP?", ball: "Example 10: a ball dropped from 24 ft rises to 3/4 of its height each bounce.", compare: "Both start 3, 6, … but the AP adds 3 while the GP doubles."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var f = clampM8(t / 6, 0, 1), id = st.preset, m = "", msg;
    if(id === "doubling"){
      var k = Math.min(6, Math.floor(f * 6 + 1e-9) + 1), vals = [];
      for(var s = 1; s <= k; s++){ var v = 3 * Math.pow(2, s - 1); vals.push(v); var h = v / 96 * 200; m += L.rect(90 + (s - 1) * 100, 240 - h, 60, h, "rgba(132,204,22,0.75)", ' stroke="#f472b6" stroke-width="2"') + L.text(120 + (s - 1) * 100, 232 - h, String(v), {size: 14, color: C.text, anchor: "middle", weight: 700}) + L.text(120 + (s - 1) * 100, 262, "Stage " + s, {size: 12, color: C.muted, anchor: "middle"}); }
      L.svg(m, "Number of squares at each stage", 280);
      L.readout([["Stage", String(k)], ["Squares", String(vals[k - 1]), C.ok], ["Rule", "tₙ = 3 × 2ⁿ⁻¹"]]);
      msg = t < 6 ? "Doubling…" : "3, 6, 12, 24, 48, <b>96</b>: each stage doubles, so tₙ = 3 × 2ⁿ⁻¹ (t₁ = 3, tₙ = 2tₙ₋₁).";
    } else if(id === "ratio"){
      var terms = ["5", "15/4", "45/16", "135/64"], k2 = Math.min(4, Math.floor(f * 4 + 1e-9) + 1);
      for(var i = 0; i < k2; i++){ var x = 90 + i * 160; m += L.rect(x - 45, 70, 90, 50, "rgba(251,191,36,0.3)", ' rx="8"') + L.text(x, 102, terms[i], {size: 18, color: C.text, anchor: "middle", weight: 700}); if(i > 0) m += L.text(x - 80, 160, "÷ → 3/4", {size: 15, color: C.vel, anchor: "middle", weight: 700}) + L.line(x - 110, 140, x - 50, 140, C.vel, 2); }
      L.svg(m, "Ratios of consecutive terms", 220);
      L.readout([["Terms checked", String(k2)], ["Ratios", k2 > 1 ? Array(k2).join("3/4 ").trim().split(" ").join(", ") : "…", C.vel], ["nth term", k2 === 4 ? "5 × (3/4)ⁿ⁻¹" : "…"]]);
      msg = t < 6 ? "Checking ratios…" : "Every ratio is 3/4, so it is a GP with a = 5 and <b>r = 3/4</b>: tₙ = 5 × (3/4)ⁿ⁻¹.";
    } else if(id === "ball"){
      var bounces = Math.min(8, Math.floor(f * 8 + 1e-9)), X = function(i){ return 60 + i * 76; }, Y = function(hh){ return 250 - hh * 9; };
      m += L.line(40, 250, 700, 250, C.faint, 2) + L.line(40, Y(4), 700, Y(4), C.danger, 1.5, "6 4") + L.text(704, Y(4) + 4, "4 ft", {size: 12, color: C.danger, anchor: "start"}) + L.text(X(0), Y(24) - 6, "24 ft", {size: 12, color: C.muted, anchor: "middle"});
      var hPrev = 24, pathD = "M " + X(0) + " " + Y(24) + " L " + X(0) + " 250";
      for(var b = 1; b <= bounces; b++){ var hb = 24 * Math.pow(0.75, b); pathD += " Q " + ((X(b - 1) + X(b)) / 2) + " " + (250 - hb * 18) + " " + X(b) + " 250"; m += L.text((X(b - 1) + X(b)) / 2, Y(hb) - 6, nM8(hb, 2), {size: 11, color: hb < 4 ? C.ok : C.path, anchor: "middle"}); }
      m += '<path d="' + pathD + '" fill="none" stroke="' + C.path + '" stroke-width="2"/>';
      L.svg(m, "Heights of a bouncing ball", 280);
      var last = bounces ? 24 * Math.pow(0.75, bounces) : 24;
      L.readout([["Bounces", String(bounces)], ["Latest height", nM8(last, 2) + " ft", C.path], ["Below 4 ft?", last < 4 ? "yes" : "no", last < 4 ? C.ok : C.danger]]);
      msg = t < 6 ? "Bouncing…" : "18, 13.5, 10.13, 7.59, 5.70, 4.27, 3.20 ft: bounce 6 is still above 4 ft, and from the <b>7th bounce</b> on the ball stays below 1/6 of 24 ft.";
    } else {
      var N = Math.min(10, Math.floor(f * 10 + 1e-9) + 1), apPts = [], gpPts = [];
      for(var n = 1; n <= N; n++){ apPts.push([n, 3 * n]); gpPts.push([n, 3 * Math.pow(2, n - 1)]); }
      m += plotM8(L, C, gpPts, [60, 10, 620, 260], {nmax: 10, extra: [1536], color: C.path}) + plotM8(L, C, apPts, [60, 10, 620, 260], {nmax: 10, extra: [1536], color: C.vel});
      L.svg(m, "An AP and a GP compared", 280);
      L.readout([["n", String(N)], ["AP 3n", String(3 * N), C.vel], ["GP 3 × 2ⁿ⁻¹", String(3 * Math.pow(2, N - 1)), C.path]]);
      msg = t < 6 ? "Plotting…" : "At n = 10 the AP has reached only 30, but the GP has reached <b>1536</b>: the GP curves sharply away from any straight line.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["doubling", "Fig. 8.6 doubling"], ["ratio", "Example 9: ratio test"], ["ball", "Example 10: bouncing ball"], ["compare", "AP versus GP"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.gp = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Fractals: the Sierpiński triangle and carpet (§8.6.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "triangle"};
  function tri(a, b, c, depth, col){
    if(depth === 0) return '<polygon points="' + [a, b, c].map(function(p){ return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '" fill="' + col + '"/>';
    var mid = function(p, q){ return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }, ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
    return tri(a, ab, ca, depth - 1, col) + tri(ab, b, bc, depth - 1, col) + tri(ca, bc, c, depth - 1, col);
  }
  function carpet(x, y, s, depth, col){
    if(depth === 0) return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + s.toFixed(2) + '" height="' + s.toFixed(2) + '" fill="' + col + '"/>';
    var out = "", q = s / 3;
    for(var i = 0; i < 3; i++) for(var j = 0; j < 3; j++) if(!(i === 1 && j === 1)) out += carpet(x + i * q, y + j * q, q, depth - 1, col);
    return out;
  }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 6, step: 0.05, speed: 1});
    L.legend({triangle: [[C.path, "black triangles"]], carpet: [["#e2622f", "red squares"]], graphs: [[C.path, "number of triangles 3ⁿ"], [C.vel, "black area (3/4)ⁿ"]], zoom: [[C.path, "whole fractal"], [C.vel, "magnified corner"]]}[id]);
    L.watch({triangle: "Fig. 8.7: remove the middle triangle again and again (Stages 0 to 5).", carpet: "Fig. 8.12: the Sierpiński square carpet keeps 8 of 9 squares at each stage.", graphs: "Fig. 8.10: the count grows while the area shrinks.", zoom: "Self-similarity: a corner of the fractal looks like the whole."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var f = clampM8(t / 6, 0, 1), id = st.preset, m = "", msg;
    if(id === "triangle"){
      var k = Math.min(5, Math.floor(f * 6 + 1e-9));
      m += tri([60, 270], [360, 270], [210, 10], k, C.path);
      m += L.text(420, 100, "Stage " + k, {size: 20, color: C.text, anchor: "start", weight: 700}) + L.text(420, 135, "triangles: 3" + "⁰¹²³⁴⁵".charAt(k) + " = " + Math.pow(3, k), {size: 16, color: C.path, anchor: "start"}) + L.text(420, 165, "area: (3/4)" + "⁰¹²³⁴⁵".charAt(k) + " ≈ " + nM8(Math.pow(0.75, k), 3), {size: 16, color: C.vel, anchor: "start"});
      L.svg(m, "Sierpiński triangle", 290);
      L.readout([["Stage", String(k)], ["Black triangles", String(Math.pow(3, k)), C.path], ["Black area", nM8(Math.pow(0.75, k), 3), C.vel]]);
      msg = t < 6 ? "Removing middle triangles…" : "Stage 5: <b>243</b> black triangles with total area (3/4)⁵ = 243/1024 ≈ 0.237.";
    } else if(id === "carpet"){
      var k2 = Math.min(3, Math.floor(f * 4 + 1e-9));
      m += '<rect x="60" y="20" width="243" height="243" fill="#fde2d4"/>' + carpet(60, 20, 243, k2, "#e2622f");
      m += L.text(360, 100, "Stage " + k2, {size: 20, color: C.text, anchor: "start", weight: 700}) + L.text(360, 135, "red squares: 8" + "⁰¹²³".charAt(k2) + " = " + Math.pow(8, k2), {size: 16, color: C.path, anchor: "start"}) + L.text(360, 165, "area: (8/9)" + "⁰¹²³".charAt(k2) + " ≈ " + nM8(Math.pow(8 / 9, k2), 3), {size: 16, color: C.vel, anchor: "start"});
      L.svg(m, "Sierpiński square carpet", 290);
      L.readout([["Stage", String(k2)], ["Red squares", String(Math.pow(8, k2)), C.path], ["Red area", nM8(Math.pow(8 / 9, k2), 3), C.vel]]);
      msg = t < 6 ? "Removing centre squares…" : "Stage 3: <b>512</b> red squares with area (8/9)³ = 512/729 ≈ 0.702.";
    } else if(id === "graphs"){
      var n = Math.min(5, Math.floor(f * 6 + 1e-9)), cnt = [], area = [];
      for(var s = 0; s <= n; s++){ cnt.push([s, Math.pow(3, s)]); area.push([s, Math.pow(0.75, s)]); }
      m += plotM8(L, C, cnt, [20, 10, 330, 260], {n0: 0, nmax: 5, extra: [243], color: C.path}) + plotM8(L, C, area, [380, 10, 330, 260], {n0: 0, nmax: 5, extra: [1], color: C.vel});
      m += L.text(185, 280, "number of triangles", {size: 12, color: C.path, anchor: "middle"}) + L.text(545, 280, "black area", {size: 12, color: C.vel, anchor: "middle"});
      L.svg(m, "Count and area of the Sierpiński triangle", 290);
      L.readout([["Stage", String(n)], ["Triangles 3ⁿ", String(Math.pow(3, n)), C.path], ["Area (3/4)ⁿ", nM8(Math.pow(0.75, n), 3), C.vel]]);
      msg = t < 6 ? "Plotting stages…" : "3ⁿ shoots up (1, 3, 9, 27, 81, 243) while (3/4)ⁿ keeps getting <b>closer to 0</b> (1, 0.75, 0.56, 0.42, 0.32, 0.24).";
    } else {
      var z = clampM8(t / 4, 0, 1), big = tri([30, 270], [330, 270], [180, 10], 5, C.path), corner = tri([400, 270], [700, 270], [550, 10], 4, C.vel);
      m += big + '<rect x="28" y="138" width="152" height="134" fill="none" stroke="' + C.vel + '" stroke-width="2" stroke-dasharray="5 4"/>';
      if(t >= 1) m += '<g opacity="' + z.toFixed(2) + '">' + corner + '</g>';
      L.svg(m, "A corner of the Sierpiński triangle magnified", 290);
      L.readout([["Whole", "Stage 5: 243 triangles", C.path], ["Bottom-left corner × 2", t >= 1 ? "Stage 4: 81 triangles" : "…", C.vel]]);
      msg = t < 6 ? "Magnifying the corner…" : "Each corner piece, magnified 2 times, looks the <b>same as the whole</b> (one stage fewer): that self-similarity is what makes it a fractal.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["triangle", "Sierpiński triangle"], ["carpet", "Sierpiński carpet"], ["graphs", "Count and area graphs"], ["zoom", "Zoom into a corner"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.fractal = {mount: mount, draw: draw, select: select, state: st};
})();
