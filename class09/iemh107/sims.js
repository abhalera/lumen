// iemh107 labs: The Mathematics of Maybe — Introduction to Probability.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function nM7(v, d){ var L = window.LAB; if(d !== undefined) return L.num(v, d); var a = Math.abs(v); if(Math.abs(a - Math.round(a)) < 1e-6) return L.num(v, 0); if(Math.abs(a * 100 - Math.round(a * 100)) < 1e-6) return L.num(v, 2); return L.num(v, 3); }
function clampM7(x, a, b){ return Math.max(a, Math.min(b, x)); }
// Seeded generator (mulberry32) so every run of a lab shows the same "random" results.
function rngM7(seed){ return function(){ seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gcdM7(a, b){ return b ? gcdM7(b, a % b) : a; }
function fracM7(a, b){ var g = gcdM7(a, b) || 1; return (b / g === 1) ? String(a / g) : (a / g) + "/" + (b / g); }
function scaleWordM7(p){ return p <= 1e-9 ? "impossible" : p >= 1 - 1e-9 ? "certain" : Math.abs(p - 0.5) < 1e-9 ? "even chance" : p < 0.5 ? "less likely" : "more likely"; }
function scaleM7(L, C, y, marks){
  var X = function(p){ return 80 + p * 560; }, m = L.line(80, y, 640, y, C.text, 3);
  [[0, "Impossible"], [0.25, "Less likely"], [0.5, "Even chance"], [0.75, "More likely"], [1, "Certain"]].forEach(function(t){ m += L.line(X(t[0]), y - 8, X(t[0]), y + 8, C.text, 2) + L.text(X(t[0]), y + 26, t[1], {size: 12, color: C.muted, anchor: "middle"}) + L.text(X(t[0]), y + 42, nM7(t[0]), {size: 11, color: C.faint, anchor: "middle"}); });
  (marks || []).forEach(function(k, i){ var x = X(k[0]); m += L.circle(x, y, 8, k[2] || C.path) + L.line(x, y - 10, x, y - 34 - (i % 2) * 22, C.faint, 1) + L.text(x, y - 38 - (i % 2) * 22, k[1], {size: 12, color: k[2] || C.path, anchor: "middle", weight: 700}); });
  return m;
}
function sliderSetM7(L, st, defs){
  L.controls(defs.map(function(d){ return L.slider(d[0], d[1], d[2], d[3], d[4], st[d[5]], nM7(st[d[5]])); }).join(""));
  defs.forEach(function(d){ L.onInput(d[0], function(v){ st[d[5]] = v; L.setVal(d[0], nM7(v)); App.resetTimeline(); App.play(); }); });
}

// Lab 1 — Chance and the probability scale (§7.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "deck", purple: 4};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend({deck: [["#9333ea", "purple card"], ["#16a34a", "green card"]], events: [[C.path, "event from the table"]], choose: [["#9333ea", "purple card"], [C.path, "P(purple)"]], percent: [[C.path, "probability"], [C.vel, "percentage"]]}[id]);
    L.watch({deck: "Fig. 7.1: a deck of six cards; more and more of them are purple.", events: "The table in §7.1.2: five events placed on the scale.", choose: "Choose how many of the six cards are purple.", percent: "§7.1.2: a probability of 0.75 for winning the hockey match."}[id]);
    if(id === "choose") sliderSetM7(L, st, [["m7p", "purple cards (of 6)", 0, 6, 1, "purple"]]); else L.controls("");
    L.restart(true);
  }
  function cards(L, k){ var m = ""; for(var i = 0; i < 6; i++){ var x = 200 + i * 56; m += L.rect(x, 40, 44, 64, i < k ? "#9333ea" : "#16a34a", ' rx="6" stroke="#f5f5dc" stroke-width="3"'); } return m; }
  function draw(t){
    var f = clampM7(t / 5, 0, 1), id = st.preset, m = "", msg;
    if(id === "deck" || id === "choose"){
      var k = id === "deck" ? Math.min(6, Math.floor(f * 7 + 1e-9)) : st.purple, p = k / 6;
      m += cards(L, k) + scaleM7(L, C, 210, [[p, fracM7(k, 6), C.path]]);
      L.svg(m, "Six cards and the probability scale", 290);
      L.readout([["Purple cards", k + " of 6", "#9333ea"], ["P(purple)", fracM7(k, 6) + " ≈ " + nM7(p, 2), C.path], ["On the scale", scaleWordM7(p)]]);
      msg = (id === "deck" && t < 5) ? "Adding purple cards…" : k + " purple of 6: P = " + fracM7(k, 6) + ", <b>" + scaleWordM7(p) + "</b>.";
    } else if(id === "events"){
      var ev = [[0, "more than 6 on a die"], [1 / 6, "a 3 on a die"], [0.5, "heads"], [9 / 13, "2–10 card"], [1, "red sweet (all red)"]], n = Math.min(5, Math.floor(f * 5 + 1e-9) + 1);
      m += scaleM7(L, C, 200, ev.slice(0, n).map(function(e){ return [e[0], e[1], C.path]; }));
      L.svg(m, "Events on the probability scale", 290);
      var last = ev[n - 1], labs = ["0", "1/6", "1/2", "36/52 = 9/13", "1"];
      L.readout([["Event", last[1]], ["Probability", labs[n - 1], C.path], ["On the scale", scaleWordM7(last[0])]]);
      msg = t < 5 ? "Placing the events…" : "0, 1/6, 1/2, 9/13 and 1: the events run <b>from impossible to certain</b>.";
    } else {
      var pw = 0.75 * f;
      m += scaleM7(L, C, 200, [[pw, nM7(pw, 2), C.path]]) + L.rect(80, 60, 560 * pw, 30, "rgba(56,189,248,0.45)", "") + L.rect(80, 60, 560, 30, "none", ' stroke="' + C.faint + '"') + L.text(360, 81, nM7(pw * 100, 0) + "%", {size: 16, color: C.text, anchor: "middle", weight: 700});
      L.svg(m, "A probability and its percentage", 290);
      L.readout([["P(win)", nM7(pw, 2), C.path], ["Percentage", nM7(pw * 100, 0) + "%", C.vel], ["On the scale", scaleWordM7(pw)]]);
      msg = t < 5 ? "Filling the bar…" : "P = 0.75 means a <b>75% chance</b>: more likely than not, but not certain.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["deck", "Fig. 7.1 deck"], ["events", "Events on the scale"], ["choose", "Choose the deck"], ["percent", "0.75 as a percentage"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.scale = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Experimental probability (§7.2.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "coin", seq: []};
  var spec = {coin: {n: 200, names: ["Heads", "Tails"], p: [0.5, 0.5], seed: 11, word: "tosses"}, die: {n: 300, names: ["1", "2", "3", "4", "5", "6"], p: [1, 1, 1, 1, 1, 1].map(function(){ return 1 / 6; }), seed: 23, word: "rolls"}, cup: {n: 100, names: ["Bottom", "Top", "Side"], p: [0.18, 0.12, 0.70], seed: 5, word: "tosses"}};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend([[C.path, "relative frequency"], [C.muted, "count"]]);
    L.watch({coin: "Toss a fair coin 200 times and watch the relative frequencies.", die: "Roll a fair die 300 times.", cup: "Fig. 7.5: toss a paper cup 100 times; the landing positions are not equally likely.", example2: "Example 2: 50 rolls of a die with exactly 8 fours."}[id]);
    if(id === "example2"){ var r2 = rngM7(3), s = []; for(var i = 0; i < 50; i++) s.push(0); var placed = 0; while(placed < 8){ var j = Math.floor(r2() * 50); if(!s[j]){ s[j] = 1; placed++; } } st.seq = s; }
    else { var sp = spec[id], r = rngM7(sp.seed); st.seq = []; for(var q = 0; q < sp.n; q++){ var u = r(), acc = 0, k = 0; while(k < sp.p.length - 1 && u > acc + sp.p[k]){ acc += sp.p[k]; k++; } st.seq.push(k); } }
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var f = clampM7(t / 5, 0, 1), id = st.preset, m = "", msg;
    if(id === "example2"){
      var n = Math.min(50, Math.floor(f * 50 + 1e-9)), fours = 0;
      for(var i = 0; i < n; i++){ var x = 60 + (i % 25) * 24, y = 60 + Math.floor(i / 25) * 44, four = st.seq[i] === 1; if(four) fours++; m += L.rect(x, y, 20, 20, four ? "rgba(251,191,36,0.9)" : "rgba(148,163,184,0.25)", ' rx="4"') + (four ? L.text(x + 10, y + 15, "4", {size: 12, color: "#1f2937", anchor: "middle", weight: 700}) : ""); }
      m += L.text(60, 200, "fours so far: " + fours + " of " + n + " rolls", {size: 16, color: C.text, anchor: "start"});
      L.svg(m, "Fifty rolls with the fours highlighted", 260);
      L.readout([["Rolls", String(n)], ["Fours", String(fours), C.path], ["Relative frequency", n ? fracM7(fours, n) + " = " + nM7(fours / n, 3) : "…"]]);
      msg = t < 5 ? "Rolling…" : "Experimental probability of a 4: <b>8/50 = 0.16</b>, or 16%.";
    } else {
      var sp = spec[id], n2 = Math.max(1, Math.floor(f * sp.n + 1e-9)), counts = sp.names.map(function(){ return 0; });
      for(var q = 0; q < n2; q++) counts[st.seq[q]]++;
      var bw = Math.min(90, 520 / sp.names.length), max = id === "cup" ? 1 : id === "die" ? 0.4 : 1;
      sp.names.forEach(function(nm, k){ var x = 90 + k * (bw + 16), h = counts[k] / n2 / max * 200; m += L.rect(x, 250 - h, bw, h, "rgba(251,191,36,0.75)", "") + L.text(x + bw / 2, 268, nm, {size: 13, color: C.text, anchor: "middle"}) + L.text(x + bw / 2, 244 - h, nM7(counts[k] / n2, 2), {size: 13, color: C.path, anchor: "middle", weight: 700}); });
      if(id !== "cup"){ var yT = 250 - sp.p[0] / max * 200; m += L.line(80, yT, 90 + sp.names.length * (bw + 16), yT, C.muted, 1.5, "6 4") + L.text(96 + sp.names.length * (bw + 16), yT + 4, "theory " + fracM7(1, sp.names.length), {size: 12, color: C.muted, anchor: "start"}); }
      m += L.line(80, 250, 90 + sp.names.length * (bw + 16), 250, C.faint, 1);
      L.svg(m, "Relative frequencies of the outcomes", 280);
      L.readout([["Trials", String(n2)]].concat(sp.names.slice(0, 3).map(function(nm, k){ return [nm, counts[k] + " (" + nM7(counts[k] / n2, 2) + ")", k === 0 ? C.path : undefined]; })));
      msg = t < 5 ? "Collecting results…" : "After " + sp.n + " " + sp.word + ": " + sp.names.map(function(nm, k){ return nm.toLowerCase() + " " + nM7(counts[k] / n2, 2); }).join(", ") + ". <b>Relative frequencies estimate the probabilities</b>" + (id === "cup" ? ", which here are far from equal." : " and add up to 1.");
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["coin", "200 coin tosses"], ["die", "300 die rolls"], ["cup", "Paper cup (Fig. 7.5)"], ["example2", "Example 2: 8 fours in 50"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.experiment = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Theoretical probability (§7.2.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "die", pts: []};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend(id === "area" ? [[C.ok, "drop inside the circle"], [C.danger, "drop outside"]] : [[C.path, "favourable outcome"], [C.faint, "other outcome"]]);
    L.watch({die: "Example 3: the probability of a 4 on a fair die.", letters: "Example 4: picking a letter from PROBABILITY.", spinner: "Fig. 7.7: the multiples of 3 on an 8-sector spinner.", area: "End-of-Chapter Q16 (Fig. 7.8): random drops of dye on a 3 m × 2 m sheet with a circle of diameter 1 m."}[id]);
    if(id === "area"){ var r = rngM7(42); st.pts = []; for(var i = 0; i < 600; i++) st.pts.push([r() * 3, r() * 2]); }
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var f = clampM7(t / 5, 0, 1), id = st.preset, m = "", msg, lit;
    if(id === "die"){
      lit = t >= 2;
      for(var i = 1; i <= 6; i++){ var x = 70 + (i - 1) * 100, fav = i === 4; m += L.rect(x, 80, 76, 76, fav && lit ? "rgba(251,191,36,0.9)" : "rgba(148,163,184,0.2)", ' rx="12" stroke="' + C.text + '" stroke-width="2"') + L.text(x + 38, 130, String(i), {size: 30, color: C.text, anchor: "middle", weight: 700}); }
      L.svg(m, "The six faces of a die", 240);
      L.readout([["Possible outcomes", "6"], ["Favourable (a 4)", lit ? "1" : "…", C.path], ["P(4)", lit ? "1/6 ≈ 0.167" : "…"]]);
      msg = t < 5 ? "Counting…" : "One favourable face out of six: <b>P(4) = 1/6</b> ≈ 0.167, or 16.7%.";
    } else if(id === "letters"){
      var w = "PROBABILITY".split(""), k = Math.min(11, Math.floor(f * 11 + 1e-9) + 1), favs = 0;
      w.forEach(function(ch, i){ var x = 40 + i * 58, show = i < k, fav = ch === "B" && show; if(fav) favs++; m += L.rect(x, 90, 50, 64, fav ? "rgba(251,191,36,0.9)" : show ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.08)", ' rx="8" stroke="' + C.faint + '"') + L.text(x + 25, 132, ch, {size: 26, color: C.text, anchor: "middle", weight: 700}); });
      L.svg(m, "The letters of PROBABILITY", 240);
      L.readout([["Letters checked", k + " of 11"], ["Bs found", String(favs), C.path], ["P(B)", k === 11 ? "2/11 ≈ 0.182" : "…"]]);
      msg = t < 5 ? "Checking the letters…" : "2 Bs among 11 letters: <b>P(B) = 2/11</b> ≈ 0.182, or 18.2%.";
    } else if(id === "spinner"){
      var c = [240, 150], R = 110, upto = Math.min(8, Math.floor(f * 8 + 1e-9) + 1), cnt = 0;
      for(var s = 0; s < 8; s++){
        var a0 = (-90 + 45 * s) * Math.PI / 180, a1 = (-45 + 45 * s) * Math.PI / 180, am = (a0 + a1) / 2, num = s + 1, fav = num % 3 === 0 && num <= upto; if(fav) cnt++;
        m += '<path d="M ' + c[0] + ' ' + c[1] + ' L ' + (c[0] + R * Math.cos(a0)).toFixed(1) + ' ' + (c[1] + R * Math.sin(a0)).toFixed(1) + ' A ' + R + ' ' + R + ' 0 0 1 ' + (c[0] + R * Math.cos(a1)).toFixed(1) + ' ' + (c[1] + R * Math.sin(a1)).toFixed(1) + ' Z" fill="' + (fav ? "rgba(251,191,36,0.9)" : "rgba(148,163,184,0.25)") + '" stroke="' + C.text + '" stroke-width="1.5"/>';
        m += L.text(c[0] + 75 * Math.cos(am), c[1] + 75 * Math.sin(am) + 6, String(num), {size: 18, color: C.text, anchor: "middle", weight: 700});
      }
      m += L.text(420, 120, "multiples of 3: " + cnt, {size: 16, color: C.path, anchor: "start"}) + L.text(420, 150, "sectors checked: " + upto + " of 8", {size: 14, color: C.muted, anchor: "start"});
      L.svg(m, "An eight-sector spinner", 290);
      L.readout([["Possible outcomes", "8"], ["Multiples of 3", String(cnt), C.path], ["P(multiple of 3)", upto === 8 ? "2/8 = 1/4" : "…"]]);
      msg = t < 5 ? "Checking the sectors…" : "3 and 6 are the multiples of 3: 2/8, so <b>P = 1/4</b>.";
    } else {
      var k2 = 100, x0 = 60, y0 = 40, n = Math.floor(f * 600 + 1e-9), inside = 0;
      m += L.rect(x0, y0, 3 * k2, 2 * k2, "rgba(109,111,196,0.35)", ' stroke="' + C.text + '" stroke-width="2"') + L.circle(x0 + 150, y0 + 100, 50, "rgba(245,236,215,0.35)", ' stroke="' + C.text + '" stroke-width="2"');
      for(var q = 0; q < n; q++){ var p = st.pts[q], inn = Math.hypot(p[0] - 1.5, p[1] - 1) <= 0.5; if(inn) inside++; m += L.circle(x0 + p[0] * k2, y0 + p[1] * k2, 2.2, inn ? C.ok : C.danger); }
      m += L.text(x0 + 150, y0 - 10, "3 m", {size: 13, color: C.muted, anchor: "middle"}) + L.text(x0 + 3 * k2 + 20, y0 + 104, "2 m", {size: 13, color: C.muted, anchor: "start"});
      m += L.text(430, 100, "drops: " + n, {size: 15, color: C.text, anchor: "start"}) + L.text(430, 130, "inside: " + inside, {size: 15, color: C.ok, anchor: "start"}) + L.text(430, 170, "π/24 ≈ 0.131", {size: 16, color: C.path, anchor: "start", weight: 700});
      L.svg(m, "Random drops on a rectangle with a circle", 290);
      L.readout([["Drops", String(n)], ["Fraction inside", n ? nM7(inside / n, 3) : "…", C.ok], ["Area ratio (π/4) ÷ 6", "π/24 ≈ 0.131", C.path]]);
      msg = t < 5 ? "Dropping dye…" : inside + " of 600 drops landed inside (" + nM7(inside / 600, 3) + "), close to the area ratio <b>π/24 ≈ 0.131</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["die", "Example 3: a 4 on a die"], ["letters", "Example 4: PROBABILITY"], ["spinner", "Spinner (Fig. 7.7)"], ["area", "Probability from area"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.theory = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Samples, the Law of Large Numbers and the Gambler’s Fallacy (§7.2.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "coin", seq: []};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 6, step: 0.05, speed: 1});
    L.legend({coin: [[C.path, "relative frequency of heads"], [C.muted, "theory 1/2"]], die: [[C.path, "relative frequency of a 4"], [C.muted, "theory 1/6"]], samples: [[C.path, "estimate of P(mango)"], [C.muted, "true value 0.4"]], streak: [[C.danger, "tails right after three heads"], [C.vel, "heads right after three heads"]]}[id]);
    L.watch({coin: "Law of Large Numbers: toss a fair coin 2000 times.", die: "Roll a fair die 3000 times and track the fours.", samples: "Example 5: estimate P(mango) = 0.4 from samples of 10, 50, 200 and 1000 students.", streak: "Gambler’s Fallacy: in 5000 tosses, what happens right after three heads in a row?"}[id]);
    var r = rngM7({coin: 101, die: 202, samples: 303, streak: 404}[id]);
    st.seq = [];
    var n = {coin: 2000, die: 3000, samples: 1260, streak: 5000}[id];
    for(var i = 0; i < n; i++) st.seq.push(id === "die" ? Math.floor(r() * 6) + 1 : id === "samples" ? (r() < 0.4 ? 1 : 0) : (r() < 0.5 ? 1 : 0));
    L.controls(""); L.restart(true);
  }
  function graph(L, C, pts, target, N, label){
    var X = function(n){ return 70 + n / N * 600; }, Y = function(v){ return 250 - v * 220; }, m = "";
    m += L.line(70, 250, 670, 250, C.faint, 1) + L.line(70, 30, 70, 250, C.faint, 1) + L.line(70, Y(target), 670, Y(target), C.muted, 1.5, "6 4");
    [0, 0.25, 0.5, 0.75, 1].forEach(function(v){ m += L.text(62, Y(v) + 4, nM7(v), {size: 11, color: C.muted, anchor: "end"}); });
    m += L.text(670, 270, N + " " + label, {size: 12, color: C.muted, anchor: "end"}) + L.text(70, 270, "0", {size: 12, color: C.muted, anchor: "middle"});
    if(pts.length > 1) m += plineM7(pts.map(function(p){ return [X(p[0]), Y(p[1])]; }), C.path, 2);
    return m;
  }
  function plineM7(P, col, w){ return '<polyline points="' + P.map(function(p){ return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '" fill="none" stroke="' + col + '" stroke-width="' + w + '"/>'; }
  function draw(t){
    var f = clampM7(t / 6, 0, 1), id = st.preset, m = "", msg;
    if(id === "coin" || id === "die"){
      var N = id === "coin" ? 2000 : 3000, n = Math.max(1, Math.floor(f * N + 1e-9)), hit = 0, pts = [], at20 = 0, target = id === "coin" ? 0.5 : 1 / 6;
      for(var i = 0; i < n; i++){ if(id === "coin" ? st.seq[i] === 1 : st.seq[i] === 4) hit++; if(i === 19) at20 = hit / 20; if(i % 5 === 4 || i === n - 1) pts.push([i + 1, hit / (i + 1)]); }
      m += graph(L, C, pts, target, N, id === "coin" ? "tosses" : "rolls");
      L.svg(m, "Relative frequency as the trials grow", 280);
      L.readout([["Trials", String(n)], [id === "coin" ? "Heads" : "Fours", String(hit)], ["Relative frequency", nM7(hit / n, 3), C.path], ["Theory", id === "coin" ? "0.5" : "1/6 ≈ 0.167"]]);
      msg = t < 6 ? "Collecting trials…" : "After 20 trials the relative frequency was " + nM7(at20, 2) + "; after " + N + " it is " + nM7(hit / n, 3) + ". The graph wanders at first and " + (id === "coin" ? "<b>settles near 0.5</b>." : "settles near <b>1/6 ≈ 0.167</b>.");
    } else if(id === "samples"){
      var sizes = [10, 50, 200, 1000], shown = Math.min(4, Math.floor(f * 4 + 1e-9) + 1), start = 0;
      m += L.line(80, 250 - 0.4 * 400, 660, 250 - 0.4 * 400, C.muted, 1.5, "6 4") + L.text(664, 250 - 0.4 * 400 + 4, "0.4", {size: 12, color: C.muted, anchor: "start"}) + L.line(80, 250, 660, 250, C.faint, 1);
      var rows = [];
      sizes.forEach(function(sz, k){ var c = 0; for(var i = 0; i < sz; i++) c += st.seq[start + i]; start += sz; var est = c / sz; rows.push([sz, c, est]); if(k < shown){ var x = 110 + k * 140, h = est * 400; m += L.rect(x, 250 - h, 80, h, "rgba(251,191,36,0.75)", "") + L.text(x + 40, 268, sz + " students", {size: 12, color: C.text, anchor: "middle"}) + L.text(x + 40, 244 - h, nM7(est, 3), {size: 13, color: C.path, anchor: "middle", weight: 700}); } });
      L.svg(m, "Estimates from samples of different sizes", 280);
      L.readout(rows.slice(0, shown).map(function(r){ return ["Sample of " + r[0], r[1] + " like mango → " + nM7(r[2], 3), C.path]; }));
      msg = t < 6 ? "Taking samples…" : "The errors are " + rows.map(function(r){ return nM7(Math.abs(r[2] - 0.4), 3); }).join(", ") + ": <b>larger samples</b> usually give estimates closer to 0.4, and 1000 students give about 0.4 × 1500 ≈ 600 mangoes for the school.";
    } else {
      var n2 = Math.max(4, Math.floor(f * 5000 + 1e-9)), after = 0, tails = 0;
      for(var q = 3; q < n2; q++){ if(st.seq[q - 1] && st.seq[q - 2] && st.seq[q - 3]){ after++; if(!st.seq[q]) tails++; } }
      var ft = after ? tails / after : 0;
      m += L.rect(100, 90, 520 * ft, 50, "rgba(248,113,113,0.7)", "") + L.rect(100 + 520 * ft, 90, 520 * (1 - ft), 50, "rgba(56,189,248,0.6)", "") + L.line(360, 80, 360, 150, C.text, 2, "5 4");
      m += L.text(100, 75, "What came right after H H H?", {size: 15, color: C.text, anchor: "start"}) + L.text(360, 175, "half-way", {size: 12, color: C.muted, anchor: "middle"}) + L.text(100 + 260 * ft, 121, "T " + nM7(ft, 2), {size: 14, color: "#1f2937", anchor: "middle", weight: 700});
      L.svg(m, "Outcomes after three heads in a row", 220);
      L.readout([["Tosses", String(n2)], ["Times H H H happened", String(after)], ["Next toss was tails", tails + " (" + nM7(ft, 3) + ")", C.danger]]);
      msg = t < 6 ? "Tossing…" : "After three heads, tails followed " + nM7(ft, 3) + " of the time, about 1/2: the coin has <b>no memory</b>, so tails is never ‘due’.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["coin", "2000 coin tosses"], ["die", "3000 die rolls"], ["samples", "Sample sizes"], ["streak", "Gambler’s Fallacy"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.lln = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Sample spaces and events (§7.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "coins"};
  var P = {
    coins: {rows: ["H", "T"], cols: ["H", "T"], rl: "Coin 1", cl: "Coin 2", cell: function(r, c){ return r + c; }, ev: function(r, c){ return r === "H" || c === "H"; }, name: "at least one head"},
    diecoin: {rows: ["1", "2", "3", "4", "5", "6"], cols: ["H", "T"], rl: "Die", cl: "Coin", cell: function(r, c){ return r + c; }, ev: function(r, c){ return (+r) % 2 === 0 && c === "H"; }, name: "even number and heads"},
    dice: {rows: ["1", "2", "3", "4", "5", "6"], cols: ["1", "2", "3", "4", "5", "6"], rl: "Die 1", cl: "Die 2", cell: function(r, c){ return "(" + r + "," + c + ")"; }, ev: function(r, c){ return +r + +c === 7; }, name: "sum is 7"},
    snacks: {rows: ["Samosa", "Pakora", "Bhaji"], cols: ["Chai", "Lassi"], rl: "Snack", cl: "Drink", cell: function(r, c){ return r + "+" + c; }, ev: function(r){ return r === "Samosa"; }, name: "Samosa as the snack"}
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend([[C.path, "outcome in the event"], [C.faint, "other outcome"]]);
    L.watch({coins: "§7.3: two coins; the event ‘at least one head’.", diecoin: "Exercise Set 7.3 Q2(i): a die and a coin together.", dice: "Two dice: 36 outcomes, and the event ‘sum is 7’.", snacks: "Exercise Set 7.3 Q3: snacks and drinks at the village fair."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var sp = P[st.preset], f = clampM7(t / 5, 0, 1), R = sp.rows.length, Cn = sp.cols.length, total = R * Cn, shown = Math.min(total, Math.floor(f * total + 1e-9) + 1), cw = Math.min(90, 460 / Cn), ch = Math.min(52, 230 / R), x0 = 150, y0 = 40, m = "", k = 0, inE = 0, list = [];
    m += L.text(x0 + Cn * cw / 2, 26, sp.cl, {size: 13, color: C.muted, anchor: "middle"}) + L.text(40, y0 + R * ch / 2, sp.rl, {size: 13, color: C.muted, anchor: "middle"});
    sp.cols.forEach(function(c, j){ m += L.text(x0 + j * cw + cw / 2, y0 - 2, c, {size: 12, color: C.text, anchor: "middle", weight: 700}); });
    sp.rows.forEach(function(r, i){
      m += L.text(x0 - 10, y0 + i * ch + ch / 2 + 16, r, {size: 12, color: C.text, anchor: "end", weight: 700});
      sp.cols.forEach(function(c, j){ var on = k < shown, e = sp.ev(r, c) && on; if(e){ inE++; list.push(sp.cell(r, c)); } m += L.rect(x0 + j * cw + 2, y0 + i * ch + 6, cw - 4, ch - 4, e ? "rgba(251,191,36,0.85)" : on ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.05)", ' rx="6"') + (on ? L.text(x0 + j * cw + cw / 2, y0 + i * ch + ch / 2 + 9, sp.cell(r, c), {size: Cn > 3 ? 11 : 13, color: C.text, anchor: "middle"}) : ""); k++; });
    });
    L.svg(m, "Sample space grid with the event highlighted", 290);
    var done = shown === total;
    L.readout([["n(S)", R + " × " + Cn + " = " + total], ["Event", sp.name], ["n(E)", String(inE), C.path], ["P(E)", done ? fracM7(inE, total) + (fracM7(inE, total) === inE + "/" + total ? "" : " = " + fracM7(inE, total)) : "…"]]);
    msg = t < 5 ? "Listing outcomes…" : "E = {" + list.join(", ") + "}, so P = " + inE + "/" + total + (fracM7(inE, total) !== inE + "/" + total ? " = " + fracM7(inE, total) : "") + ": <b>" + sp.name + "</b>.";
    L.verdict(msg);
  }
  function mount(){ L.presets([["coins", "Two coins"], ["diecoin", "Die and coin"], ["dice", "Two dice"], ["snacks", "Snacks and drinks"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.space = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Tree diagrams (§7.4)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "coins"};
  function T(n, p, v, k){ return {n: n, p: p, v: v, k: k || []}; }
  var P = {
    coins: {root: [T("H", "1/2", 0.5, [T("H", "1/2", 0.5), T("T", "1/2", 0.5)]), T("T", "1/2", 0.5, [T("H", "1/2", 0.5), T("T", "1/2", 0.5)])], hit: ["HT", "TH"], name: "one head and one tail"},
    fruit: {root: [T("Apple", "1/3", 1 / 3, [T("Banana", "1/2", 0.5), T("Mango", "1/2", 0.5)]), T("Orange", "2/3", 2 / 3, [T("Banana", "1/2", 0.5), T("Mango", "1/2", 0.5)])], hit: ["AppleBanana"], name: "apple and banana"},
    pens: {root: ["R", "B", "G"].map(function(a, i){ var ps = ["3/9", "4/9", "2/9"], vs = [3 / 9, 4 / 9, 2 / 9]; return T(a, ps[i], vs[i], ["R", "B", "G"].map(function(b, j){ return T(b, ps[j], vs[j]); })); }), hit: ["RR", "BB", "GG"], name: "both pens the same colour"},
    balls: {root: [T("R", "4/9", 4 / 9, [T("R", "3/8", 3 / 8), T("B", "5/8", 5 / 8)]), T("B", "5/9", 5 / 9, [T("R", "4/8", 0.5), T("B", "4/8", 0.5)])], hit: ["RB"], name: "red then blue"}
  };
  var exact = {coins: "1/4 + 1/4 = 1/2", fruit: "1/3 × 1/2 = 1/6", pens: "9/81 + 16/81 + 4/81 = 29/81", balls: "4/9 × 5/8 = 20/72 = 5/18"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 0.05, speed: 1});
    L.legend([[C.muted, "branch"], [C.path, "paths in the event"]]);
    L.watch({coins: "Example 7 (Fig. 7.6): toss a fair coin twice.", fruit: "Exercise Set 7.4 Q1: one fruit from basket A (1 apple, 2 oranges) and one from basket B (banana, mango).", pens: "Exercise Set 7.4 Q2: 3 red, 4 black (B), 2 green pens, with replacement.", balls: "End-of-Chapter Q10: 4 red and 5 blue balls, without replacement."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var sp = P[st.preset], m = "", leaves = 0, rows = 0, total = 0, parts = [];
    sp.root.forEach(function(a){ rows += a.k.length; });
    var gap = Math.min(52, 270 / rows), y = 20 + (290 - rows * gap) / 2, ry = 150;
    sp.root.forEach(function(a){
      var cy = y + a.k.length * gap / 2;
      if(t >= 0.5) m += L.line(40, ry, 190, cy, C.muted, 2) + L.text(115, (ry + cy) / 2 - 6, a.p, {size: 12, color: C.vel, anchor: "middle"}) + L.text(204, cy + 5, a.n, {size: 14, color: C.text, anchor: "start", weight: 700});
      a.k.forEach(function(b, j){
        var ly = y + j * gap + gap / 2, key = a.n + b.n, on = sp.hit.indexOf(key) >= 0, pv = a.v * b.v, sx = 214 + 7 * a.n.length;
        if(t >= 2){ m += L.line(sx, cy, 400, ly, on && t >= 3.5 ? C.path : C.muted, on && t >= 3.5 ? 3 : 1.5) + L.text(sx + 0.72 * (400 - sx), cy + 0.72 * (ly - cy) - 5, b.p, {size: 11, color: C.vel, anchor: "middle"}) + L.text(412, ly + 5, b.n, {size: 13, color: C.text, anchor: "start", weight: 700}); }
        if(t >= 3.5){ m += L.text(480, ly + 5, a.n + "·" + b.n + ": " + a.p + " × " + b.p + " = " + nM7(pv, 3), {size: 12, color: on ? C.path : C.muted, anchor: "start", weight: on ? 700 : 400}); if(on){ total += pv; parts.push(a.n + b.n); } }
        leaves++;
      });
      y += a.k.length * gap;
    });
    m += L.circle(40, ry, 5, C.text);
    L.svg(m, "Tree diagram", 300);
    L.readout([["Paths", String(leaves)], ["Event", sp.name], ["P(event)", t >= 3.5 ? nM7(total, 3) : "…", C.path]]);
    L.verdict(t < 5 ? (t < 2 ? "First step…" : t < 3.5 ? "Second step…" : "Multiplying along the paths…") : "P(" + sp.name + ") = <b>" + exact[st.preset] + "</b>.");
  }
  function mount(){ L.presets([["coins", "Two coin tosses"], ["fruit", "Fruit baskets"], ["pens", "Pens with replacement"], ["balls", "Balls without replacement"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.tree = {mount: mount, draw: draw, select: select, state: st};
})();
