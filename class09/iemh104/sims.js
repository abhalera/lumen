// iemh104 labs: Exploring Algebraic Identities.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function nM4(v, d){ var L = window.LAB; if(d !== undefined) return L.num(v, d); var a = Math.abs(v); if(Math.abs(a - Math.round(a)) < 1e-9) return L.num(v, 0); if(Math.abs(a * 10 - Math.round(a * 10)) < 1e-9) return L.num(v, 1); return L.num(v, 2); }
function clampM4(x, a, b){ return Math.max(a, Math.min(b, x)); }
function sliderSetM4(L, st, defs){
  L.controls(defs.map(function(d){ return L.slider(d[0], d[1], d[2], d[3], d[4], st[d[5]], nM4(st[d[5]])); }).join(""));
  defs.forEach(function(d){ L.onInput(d[0], function(v){ st[d[5]] = v; L.setVal(d[0], nM4(v)); App.resetTimeline(); App.play(); }); });
}
function termM4(c, v, first){ if(c === 0) return ""; var s = Math.abs(c) === 1 && v ? "" : String(Math.abs(c)); return (first ? (c < 0 ? "−" : "") : (c < 0 ? " − " : " + ")) + s + v; }
function polyM4(a2, a1, a0){ var s = termM4(a2, "x²", true); s += termM4(a1, "x", !s); s += termM4(a0, "", !s); return s || "0"; }
function linM4(p, a){ return "(" + (p === 1 ? "" : p) + "x" + (a < 0 ? " − " + (-a) : " + " + a) + ")"; }
function linesM4(L, lines, n, x, y0, dy, size, hi){ var m = ""; lines.slice(0, n).forEach(function(s, i){ m += L.text(x, y0 + i * dy, s, {size: size || 18, color: i === n - 1 ? (hi || L.C.path) : L.C.text, anchor: "start", mono: true, weight: i === n - 1 ? 700 : 400}); }); return m; }

// Lab 1 — Consecutive squares and (a + b)² (§4.1–4.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "consec", n: 6, a: 3, b: 2};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.04, speed: 1});
    L.legend({consec: [[C.vel, "(n − 1)²"], [C.path, "(n + 1)²"], [C.danger, "2n² taken away"]], area: [[C.vel, "a²"], [C.path, "ab (two of them)"], [C.ok, "b²"]], neg: [[C.path, "(a + b)²"], [C.ok, "a² + 2ab + b²"]], quick: [[C.vel, "40²"], [C.path, "40 × 3 (two of them)"], [C.ok, "3²"]]}[id]);
    L.watch({consec: "Example 1: add the smallest and largest of three consecutive squares, then subtract twice the middle one. Change the middle number.", area: "Fig. 4.2: a square of side a + b is made of a², b² and two rectangles ab. Change a and b.", neg: "Example 2 and the rational check: does the identity still work when a and b are not lengths?", quick: "Example 4: 43² = (40 + 3)² from four pieces."}[id]);
    if(id === "consec") sliderSetM4(L, st, [["m4n", "middle number n", 2, 30, 1, "n"]]);
    else if(id === "area") sliderSetM4(L, st, [["m4a", "a", 1, 6, 0.5, "a"], ["m4b", "b", 0.5, 4, 0.5, "b"]]);
    else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var m = "", msg, id = st.preset;
    if(id === "consec"){
      var n = st.n, s1 = (n - 1) * (n - 1), s3 = (n + 1) * (n + 1), mid2 = 2 * n * n, sc = 460 / (s1 + s3), f1 = clampM4(t, 0, 1), f2 = clampM4(t - 1, 0, 1);
      m += L.rect(160, 50, s1 * sc * f1, 36, C.vel) + L.rect(160 + s1 * sc, 50, s3 * sc * clampM4(t - 0.5, 0, 1), 36, C.path) + L.text(150, 74, "(n − 1)² + (n + 1)²", {size: 13, color: C.text, anchor: "end"});
      m += L.rect(160, 110, mid2 * sc * f2, 36, C.danger) + L.text(150, 134, "2n²", {size: 13, color: C.text, anchor: "end"});
      if(t >= 2) m += L.rect(160 + mid2 * sc, 50, 2 * sc, 36, "rgba(52,211,153,0.6)") + L.text(160 + mid2 * sc + sc, 40, "2 left over", {size: 12, color: C.ok, weight: 700});
      L.svg(m, "Three consecutive squares", 170);
      L.readout([["Squares", s1 + ", " + (n * n) + ", " + s3], ["Sum of outer two", String(s1 + s3), C.path], ["Twice the middle", String(mid2), C.danger], ["Difference", t >= 2 ? "2" : "…", C.ok]]);
      msg = t < 3 ? "Adding and subtracting…" : s1 + " + " + s3 + " − " + mid2 + " = <b>2</b>. In general (n − 1)² + (n + 1)² − 2n² = 2.";
    } else if(id === "area"){
      var a = st.a, b = st.b, u = Math.min(40, 250 / (a + b)), x0 = 70, y0 = 20;
      m += L.rect(x0, y0, a * u, a * u, C.vel, ' opacity="0.8"') + L.text(x0 + a * u / 2, y0 + a * u / 2 + 5, "a²", {size: 15, color: "#fff", weight: 700});
      if(t >= 1) m += L.rect(x0 + a * u, y0, b * u, a * u, C.path, ' opacity="0.8"') + L.rect(x0, y0 + a * u, a * u, b * u, C.path, ' opacity="0.8"') + L.text(x0 + a * u + b * u / 2, y0 + a * u / 2 + 5, "ab", {size: 13, color: "#111", weight: 700}) + L.text(x0 + a * u / 2, y0 + a * u + b * u / 2 + 5, "ab", {size: 13, color: "#111", weight: 700});
      if(t >= 2) m += L.rect(x0 + a * u, y0 + a * u, b * u, b * u, C.ok, ' opacity="0.85"') + L.text(x0 + a * u + b * u / 2, y0 + a * u + b * u / 2 + 5, "b²", {size: 12, color: "#111", weight: 700});
      m += L.rect(x0, y0, (a + b) * u, (a + b) * u, "none", ' stroke="' + C.text + '" stroke-width="2"') + L.text(x0 + a * u / 2, y0 + (a + b) * u + 18, "a = " + nM4(a), {size: 12, color: C.muted}) + L.text(x0 + a * u + b * u / 2, y0 + (a + b) * u + 18, "b = " + nM4(b), {size: 12, color: C.muted});
      var A2 = a * a, AB2 = 2 * a * b, B2 = b * b, S = (a + b) * (a + b);
      L.svg(m, "Area model of (a + b)²", 300);
      L.readout([["a²", nM4(A2), C.vel], ["2ab", nM4(AB2), C.path], ["b²", nM4(B2), C.ok], ["(a + b)²", nM4(S)]]);
      msg = t < 3 ? "Filling the square…" : "(" + nM4(a) + " + " + nM4(b) + ")² = " + nM4(A2) + " + " + nM4(AB2) + " + " + nM4(B2) + " = <b>" + nM4(S) + "</b>.";
    } else if(id === "neg"){
      var rows = [["a = −2, b = −3", "(a + b)² = (−5)² = 25", "a² + 2ab + b² = 4 + 12 + 9 = 25"], ["a = −2/3, b = 3/4", "(a + b)² = (1/12)² = 1/144", "4/9 − 1 + 9/16 = 1/144"]];
      rows.forEach(function(r, i){ if(t >= i * 1.3){ m += L.text(40, 50 + i * 100, r[0], {size: 16, color: C.muted, anchor: "start", weight: 700}) + L.text(60, 80 + i * 100, r[1], {size: 16, color: C.path, anchor: "start", mono: true}) + L.text(60, 106 + i * 100, r[2], {size: 16, color: C.ok, anchor: "start", mono: true}); } });
      L.svg(m, "Checking the identity with negative and rational numbers", 240);
      L.readout([["Integers", t >= 1 ? "25 = 25" : "…", C.ok], ["Rationals", t >= 2.3 ? "1/144 = 1/144" : "…", C.ok]]);
      msg = t < 3 ? "Substituting…" : "Both sides give 25 for a = −2, b = −3, and 1/144 for a = −2/3, b = 3/4; the distributive law shows it always works.";
    } else {
      var us = 6, xq = 80, yq = 20, big = 40 * us, sm = 3 * us;
      m += L.rect(xq, yq, big, big, C.vel, ' opacity="0.75"') + L.text(xq + big / 2, yq + big / 2, "40² = 1600", {size: 15, color: "#fff", weight: 700});
      if(t >= 1) m += L.rect(xq + big, yq, sm, big, C.path) + L.rect(xq, yq + big, big, sm, C.path) + L.text(xq + big + sm + 8, yq + big / 2, "40 × 3 = 120", {size: 13, color: C.path, anchor: "start", weight: 700}) + L.text(xq + big / 2, yq + big + sm + 18, "40 × 3 = 120", {size: 13, color: C.path, weight: 700});
      if(t >= 2) m += L.rect(xq + big, yq + big, sm, sm, C.ok) + L.text(xq + big + sm + 8, yq + big + sm, "3² = 9", {size: 13, color: C.ok, anchor: "start", weight: 700});
      L.svg(m, "43 squared in pieces", 300);
      L.readout([["40²", "1600", C.vel], ["2 × 40 × 3", t >= 1 ? "240" : "…", C.path], ["3²", t >= 2 ? "9" : "…", C.ok]]);
      msg = t < 3 ? "Adding the pieces…" : "43² = (40 + 3)² = 1600 + 240 + 9 = <b>1849</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["consec", "Example 1: consecutive squares"], ["area", "Fig. 4.2: area model"], ["neg", "Example 2: other numbers"], ["quick", "Example 4: 43²"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.square = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Perfect squares and (a − b)² (§4.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "ex5", a: 6, b: 2};
  var P = {
    ex5: ["x² + 4x + 4", "x² = (x)² and 4 = (2)²", "2 × x × 2 = 4x ✓", "= (x + 2)²"],
    ex6: ["36x² + 12x + 1", "36x² = (6x)² and 1 = (1)²", "2 × 6x × 1 = 12x ✓", "= (6x + 1)²"],
    ex7: ["50p² + 60pq + 18q²", "= 2(25p² + 30pq + 9q²)", "25p² = (5p)², 9q² = (3q)², 2 × 5p × 3q = 30pq ✓", "= 2(5p + 3q)²"],
    worked: ["4x² − 12xy + 9y²", "4x² = (2x)² and 9y² = (3y)²", "2 × 2x × 3y = 12xy, with a minus sign ✓", "= (2x − 3y)²"]
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend(id === "fig43" ? [[C.vel, "(a − b)²"], [C.path, "rectangle ab"], [C.danger, "rectangle b(a − b)"]] : [[C.text, "step"], [C.path, "factorised form"]]);
    L.watch({ex5: "Example 5: is x² + 4x + 4 a perfect square?", ex6: "Example 6: 36x² + 12x + 1.", ex7: "Example 7: take out the common factor 2 first.", worked: "Worked example: a perfect square with a minus sign.", fig43: "Fig. 4.3: remove the rectangles ab and b(a − b) from a² to leave (a − b)². Change a and b.", sq29: "Example 8: 29² = (30 − 1)²."}[id]);
    if(id === "fig43") sliderSetM4(L, st, [["m4pa", "a", 3, 8, 0.5, "a"], ["m4pb", "b", 0.5, 2.5, 0.5, "b"]]);
    else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var m = "", msg, id = st.preset;
    if(P[id]){
      var n = Math.min(4, Math.floor(t + 1e-9) + 1);
      m += linesM4(L, P[id], n, 60, 60, 52, 20);
      L.svg(m, "Spotting a perfect square", 260);
      L.readout([["Expression", P[id][0]], ["Square terms", n >= 2 ? P[id][1].replace(/^= /, "") : "…"], ["Result", n >= 4 ? P[id][3].replace(/^= /, "") : "…", C.path]]);
      msg = t < 4 ? "Checking the pattern…" : P[id][0] + " = <b>" + P[id][3].replace(/^= /, "") + "</b>.";
    } else if(id === "fig43"){
      var a = st.a, b = st.b, u = Math.min(36, 260 / a), x0 = 90, y0 = 20, s = (a - b) * u;
      m += L.rect(x0, y0, a * u, a * u, "none", ' stroke="' + C.text + '" stroke-width="2"') + L.rect(x0, y0, s, s, C.vel, ' opacity="0.8"') + L.text(x0 + s / 2, y0 + s / 2 + 5, "(a − b)²", {size: 14, color: "#fff", weight: 700});
      if(t >= 1) m += L.rect(x0 + s, y0, b * u, a * u, C.path, ' opacity="0.8"') + L.text(x0 + s + b * u / 2, y0 + a * u / 2, "ab", {size: 13, color: "#111", weight: 700});
      if(t >= 2) m += L.rect(x0, y0 + s, s, b * u, C.danger, ' opacity="0.8"') + L.text(x0 + s / 2, y0 + s + b * u / 2 + 5, "b(a − b)", {size: 12, color: "#111", weight: 700});
      var val = a * a - a * b - b * (a - b);
      L.svg(m, "Fig. 4.3 area model", 300);
      L.readout([["a²", nM4(a * a)], ["ab", nM4(a * b), C.path], ["b(a − b)", nM4(b * (a - b)), C.danger], ["(a − b)²", nM4((a - b) * (a - b)), C.vel]]);
      msg = t < 3 ? "Removing the rectangles…" : nM4(a * a) + " − " + nM4(a * b) + " − " + nM4(b * (a - b)) + " = <b>" + nM4(val) + "</b> = (" + nM4(a) + " − " + nM4(b) + ")².";
    } else {
      m += linesM4(L, ["29² = (30 − 1)²", "= 30² − 2 × 30 × 1 + 1²", "= 900 − 60 + 1", "= 841"], Math.min(4, Math.floor(t + 1e-9) + 1), 90, 60, 52, 22);
      L.svg(m, "29 squared", 260);
      L.readout([["a", "30"], ["b", "1"], ["Result", t >= 3 ? "841" : "…", C.path]]);
      msg = t < 4 ? "Using (a − b)²…" : "29² = 900 − 60 + 1 = <b>841</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["ex5", "Example 5"], ["ex6", "Example 6"], ["ex7", "Example 7"], ["worked", "4x² − 12xy + 9y²"], ["fig43", "Fig. 4.3: (a − b)²"], ["sq29", "Example 8: 29²"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.perfect = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — (a + b + c)² and Śhrīdharāchārya’s identity (§4.4)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "fig44"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend(id === "fig44" ? [[C.vel, "squares a², b², c²"], [C.path, "rectangles ab, bc, ca"]] : id === "shridhara" ? [[C.vel, "the part that stays"], [C.path, "the strip that moves"], [C.ok, "b²"]] : [[C.path, "result"]]);
    L.watch({fig44: "Fig. 4.4 with a = 3, b = 2, c = 1: nine pieces fill the square of side 6.", ex9: "Example 9: 119² = (100 + 10 + 9)².", shridhara: "Fig. 4.5: cut a strip of width 5 from a 55 × 55 square and move it to make a 60 × 50 rectangle, with a 5 × 5 square left over.", ends5: "Think and Reflect: squares of 35, 65, 85 and 105."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, id = st.preset;
    if(id === "fig44"){
      var s = [3, 2, 1], u = 42, x0 = 60, y0 = 18, cols = [C.vel, C.path, C.ok], names = ["a", "b", "c"], k = 0, off = [0, 3, 5];
      for(var i = 0; i < 3; i++) for(var j = 0; j < 3; j++){
        var show = t >= (i === j ? 0 : 1.5) + k * 0.12; k++;
        if(!show) continue;
        var sq = i === j, lab = sq ? names[i] + "²" : (names[Math.min(i, j)] + names[Math.max(i, j)]).replace("ac", "ca");
        m += L.rect(x0 + off[j] * u, y0 + off[i] * u, s[j] * u, s[i] * u, sq ? cols[i] : "rgba(245,158,11,0.45)", ' stroke="#0f172a" stroke-width="1.5"') + L.text(x0 + (off[j] + s[j] / 2) * u, y0 + (off[i] + s[i] / 2) * u + 5, lab + " = " + (s[i] * s[j]), {size: 11, color: "#111", weight: 700});
      }
      L.svg(m, "Fig. 4.4 square of side a + b + c", 290);
      L.readout([["a² + b² + c²", "9 + 4 + 1 = 14", C.vel], ["2ab + 2bc + 2ca", t >= 3 ? "12 + 4 + 6 = 22" : "…", C.path], ["(a + b + c)²", t >= 3 ? "36" : "…"]]);
      msg = t < 4 ? "Filling the square…" : "(3 + 2 + 1)² = 14 + 22 = <b>36</b>, the area of the square of side 6.";
    } else if(id === "ex9"){
      m += linesM4(L, ["119² = (100 + 10 + 9)²", "= 100² + 10² + 9²", "  + 2(100)(10) + 2(100)(9) + 2(10)(9)", "= 10000 + 100 + 81 + 2000 + 1800 + 180", "= 14161"], Math.min(5, Math.floor(t * 1.25 + 1e-9) + 1), 40, 44, 46, 18);
      L.svg(m, "119 squared", 260);
      L.readout([["a, b, c", "100, 10, 9"], ["Result", t >= 3.2 ? "14161" : "…", C.path]]);
      msg = t < 4 ? "Expanding…" : "119² = 10000 + 100 + 81 + 2000 + 1800 + 180 = <b>14161</b>.";
    } else if(id === "shridhara"){
      var u2 = 4, x1 = 80, y1 = 30, f = clampM4((t - 1) / 2, 0, 1);
      m += L.rect(x1, y1, 50 * u2, 55 * u2, C.vel, ' opacity="0.7"') + L.rect(x1 + 50 * u2 + 40 * f, y1 + 50 * u2 * 0 + 0, 5 * u2, 50 * u2, C.path, ' opacity="0.85"');
      m += L.rect(x1 + 50 * u2, y1 + 50 * u2, 5 * u2, 5 * u2, t < 1 ? C.vel : C.ok, ' opacity="0.85"');
      if(f > 0) m += L.rect(x1 + (50 * u2 + 40) * (1 - f) + (0) * f, y1 + 55 * u2 + 10 * f, 0, 0, "none");
      m += L.text(x1 + 25 * u2, y1 - 8, "50", {size: 12, color: C.muted}) + L.text(x1 - 10, y1 + 27 * u2, "55", {size: 12, color: C.muted, anchor: "end"});
      if(t >= 3) m += L.text(420, 90, "55 × 55 = 50 × 55 + 5 × 55", {size: 14, color: C.text, anchor: "start"}) + L.text(420, 120, "= 60 × 50 + 5 × 5", {size: 14, color: C.text, anchor: "start"}) + L.text(420, 150, "= 3000 + 25", {size: 14, color: C.path, anchor: "start", weight: 700});
      L.svg(m, "Śhrīdharāchārya’s rearrangement", 290);
      L.readout([["(a + b)(a − b)", "60 × 50 = 3000", C.vel], ["b²", "5² = 25", C.ok], ["a²", t >= 3 ? "3025" : "…", C.path]]);
      msg = t < 4 ? "Rearranging…" : "55² = 60 × 50 + 5² = 3000 + 25 = <b>3025</b>.";
    } else {
      var rows = [[35, 40, 30], [65, 70, 60], [85, 90, 80], [105, 110, 100]];
      rows.forEach(function(r, i){ if(t >= i * 0.9) m += L.text(80, 60 + i * 50, r[0] + "² = " + r[1] + " × " + r[2] + " + 25 = " + (r[0] * r[0]), {size: 20, color: i === 3 ? C.path : C.text, anchor: "start", mono: true}); });
      L.svg(m, "Squares of numbers ending in 5", 260);
      L.readout([["Rule", "n5² = n(n + 1) followed by 25"], ["Last result", t >= 2.7 ? "11025" : "…", C.path]]);
      msg = t < 4 ? "Squaring…" : "35² = 1225, 65² = 4225, 85² = 7225 and 105² = 110 × 100 + 25 = <b>11025</b>: n(n + 1) followed by 25.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["fig44", "Fig. 4.4: (a + b + c)²"], ["ex9", "Example 9: 119²"], ["shridhara", "Fig. 4.5: 55²"], ["ends5", "Numbers ending in 5"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.abc = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Algebra tiles (§4.5, Figs. 4.7–4.8)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "x3x4"};
  var P = {x3x4: [1, 3, 1, 4], x2x3: [1, 2, 1, 3], x5x6: [1, 5, 1, 6], twox: [2, 3, 3, 1]};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.04, speed: 1});
    L.legend([[C.vel, "x² tile"], [C.path, "x-tile"], [C.ok, "unit tile"]]);
    L.watch({x3x4: "Fig. 4.7: the rectangle with sides x + 3 and x + 4.", x2x3: "Think and Reflect: the product of x + 2 and x + 3.", x5x6: "Think and Reflect: lay out x² + 11x + 30 so that its factors show.", twox: "Fig. 4.8: the rectangle with sides 2x + 3 and 3x + 1."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var c = P[st.preset], p = c[0], a = c[1], q = c[2], b = c[3], X = 64, U = 16, x0 = 90, y0 = 36, m = "";
    var cols = [], rows = [], i, j;
    for(i = 0; i < p; i++) cols.push(X); for(i = 0; i < a; i++) cols.push(U);
    for(j = 0; j < q; j++) rows.push(X); for(j = 0; j < b; j++) rows.push(U);
    var yy = y0;
    rows.forEach(function(h, rj){
      var xx = x0;
      cols.forEach(function(w, ci){
        var type = (w === X ? 1 : 0) + (h === X ? 1 : 0), show = t >= [2.1, 1.2, 0.3][2 - type];
        if(show) m += L.rect(xx, yy, w, h, [C.ok, C.path, C.vel][type], ' opacity="0.85" stroke="#0f172a" stroke-width="1.2"');
        xx += w;
      });
      yy += h;
    });
    var W = p * X + a * U, H = q * X + b * U;
    m += L.text(x0 + W / 2, y0 - 10, linM4(p, a).slice(1, -1), {size: 14, color: C.text, weight: 700}) + L.text(x0 - 10, y0 + H / 2, linM4(q, b).slice(1, -1), {size: 14, color: C.text, anchor: "end", weight: 700});
    var x2 = p * q, x1 = p * b + q * a, x0c = a * b, prod = polyM4(x2, x1, x0c);
    m += L.text(x0 + W + 40, y0 + 30, x2 + " x² tile" + (x2 > 1 ? "s" : ""), {size: 15, color: C.vel, anchor: "start", weight: 700}) + L.text(x0 + W + 40, y0 + 60, x1 + " x-tiles", {size: 15, color: C.path, anchor: "start", weight: 700}) + L.text(x0 + W + 40, y0 + 90, x0c + " unit tiles", {size: 15, color: C.ok, anchor: "start", weight: 700});
    L.svg(m, "Algebra tiles", Math.max(260, H + 70));
    L.readout([["Sides", linM4(p, a) + " and " + linM4(q, b)], ["x² tiles", String(x2), C.vel], ["x-tiles", p * b + " + " + q * a + " = " + x1, C.path], ["Unit tiles", a + " × " + b + " = " + x0c, C.ok]]);
    var msg = st.preset === "x5x6" ? prod + " = <b>(x + 5)(x + 6)</b>: 11 x-tiles split into 5 and 6, and 30 unit tiles in a 5 by 6 block." : linM4(p, a) + linM4(q, b) + " = <b>" + prod + "</b>.";
    L.verdict(t < 3 ? "Placing tiles…" : msg);
  }
  function mount(){ L.presets([["x3x4", "Fig. 4.7: (x + 3)(x + 4)"], ["x2x3", "(x + 2)(x + 3)"], ["x5x6", "x² + 11x + 30"], ["twox", "Fig. 4.8: (2x + 3)(3x + 1)"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.tiles = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Splitting the middle term (§4.6, Exercise Set 4.4)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "ex10"};
  var P = {ex10: [1, 7, 12], ex11: [1, 11, 30], ex12: [1, -5, 6], neg: [1, -1, -42], lead: [6, 7, 2]};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.04, speed: 1});
    L.legend([[C.muted, "factor pair tried"], [C.ok, "pair with the right sum"]]);
    L.watch({ex10: "Example 10: x² + 7x + 12 needs a + b = 7 and ab = 12.", ex11: "Example 11: x² + 11x + 30.", ex12: "Example 12: x² − 5x + 6, with a negative middle term.", neg: "Exercise Set 4.4 Q3 (iii): r² − r − 42, with a negative constant (written in x here).", lead: "Exercise Set 4.4 Q1 (iv): 6x² + 7x + 2; the pair must multiply to 6 × 2 = 12."}[id]);
    L.controls(""); L.restart(true);
  }
  function pairs(prod, sum){
    var out = [], n = Math.abs(prod);
    for(var d = 1; d * d <= n; d++){
      if(n % d) continue;
      var e = n / d;
      if(prod > 0){ out.push(sum >= 0 ? [d, e] : [-d, -e]); }
      else { out.push([d, -e]); out.push([-d, e]); }
    }
    return out;
  }
  function draw(t){
    var c = P[st.preset], k = c[0], p = c[1], q = c[2], list = pairs(k * q, p), shown = Math.min(list.length, Math.floor(t / 2.4 * list.length + 1e-9) + 1), m = "", hit = null;
    m += L.text(40, 36, polyM4(k, p, q) + ":  need two numbers with product " + (k * q) + " and sum " + p, {size: 16, color: C.text, anchor: "start", weight: 700});
    list.slice(0, shown).forEach(function(pr, i){ var ok = pr[0] + pr[1] === p; if(ok && !hit) hit = pr; m += L.text(60, 72 + i * 28, pr[0] + " × " + pr[1] + " = " + (k * q) + ",   sum " + (pr[0] + pr[1]) + (ok ? "  ✓" : ""), {size: 16, color: ok ? C.ok : C.muted, anchor: "start", mono: true, weight: ok ? 700 : 400}); });
    var res = "", steps = [];
    if(hit){
      if(k === 1){ var s = hit.slice().sort(function(u, v){ return (u < 0) - (v < 0); }); res = linM4(1, s[0]) + linM4(1, s[1]); }
      else { steps = ["6x² + 3x + 4x + 2", "= 3x(2x + 1) + 2(2x + 1)"]; res = "(3x + 2)(2x + 1)"; }
    }
    steps.forEach(function(s2, i){ if(t >= 3) m += L.text(420, 100 + i * 32, s2, {size: 16, color: C.text, anchor: "start", mono: true}); });
    if(t >= 3 && hit) m += L.text(420, 100 + steps.length * 32, "= " + res, {size: 18, color: C.path, anchor: "start", mono: true, weight: 700});
    L.svg(m, "Splitting the middle term", 320);
    L.readout([["Product needed", String(k * q)], ["Sum needed", String(p)], ["Pair found", hit && t >= 3 ? hit.join(" and ") : "…", C.ok]]);
    L.verdict(t < 3 || !hit ? "Trying factor pairs…" : polyM4(k, p, q) + " = <b>" + res + "</b>.");
  }
  function mount(){ L.presets([["ex10", "Example 10"], ["ex11", "Example 11"], ["ex12", "Example 12"], ["neg", "Negative constant"], ["lead", "6x² + 7x + 2"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.split = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Cubes: (a + b)³ and friends (§4.7)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "fig410"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend(id === "fig410" ? [[C.vel, "a³"], [C.path, "a²b (three)"], ["#a78bfa", "ab² (three)"], [C.ok, "b³"]] : [[C.path, "result"]]);
    L.watch({fig410: "Figs. 4.9–4.10 with a = 3, b = 2: the cube of edge 5 comes apart into 8 pieces.", cubed11: "Worked example: 11³ = (10 + 1)³.", diffcubes: "Check x³ − y³ = (x − y)(x² + xy + y²) and x³ + y³ = (x + y)(x² − xy + y²) with x = 5, y = 2.", ex15: "Example 15: x + y + z = 10, xyz = 25 and x² + y² + z² = 38."}[id]);
    L.controls(""); L.restart(true);
  }
  function iso(ox, oy, s){ return function(x, y, z){ return [ox + (x - z) * 0.866 * s, oy - y * s + (x + z) * 0.5 * s]; }; }
  function box(P, x, y, z, w, h, d, col){
    var pt = function(a){ return a[0].toFixed(1) + "," + a[1].toFixed(1); };
    var top = [P(x, y + h, z), P(x + w, y + h, z), P(x + w, y + h, z + d), P(x, y + h, z + d)];
    var right = [P(x + w, y, z), P(x + w, y + h, z), P(x + w, y + h, z + d), P(x + w, y, z + d)];
    var front = [P(x, y, z + d), P(x + w, y, z + d), P(x + w, y + h, z + d), P(x, y + h, z + d)];
    return [[top, 1], [right, 0.75], [front, 0.55]].map(function(f){ return '<polygon points="' + f[0].map(pt).join(" ") + '" fill="' + col + '" fill-opacity="' + f[1] + '" stroke="#0f172a" stroke-width="1.2"/>'; }).join("");
  }
  function draw(t){
    var m = "", msg, id = st.preset;
    if(id === "fig410"){
      var a = 3, b = 2, g = 1.1 * clampM4(t / 2, 0, 1), P = iso(250, 200, 26), pieces = [];
      [0, 1].forEach(function(i){ [0, 1].forEach(function(j){ [0, 1].forEach(function(k){ var dims = [i ? b : a, j ? b : a, k ? b : a], na = 3 - i - j - k; pieces.push({x: i ? a + g : 0, y: j ? a + g : 0, z: k ? a + g : 0, d: dims, col: na === 3 ? C.vel : na === 2 ? C.path : na === 1 ? "#a78bfa" : C.ok, s: i + j + k}); }); }); });
      pieces.sort(function(p1, p2){ return (p1.x + p1.y + p1.z) - (p2.x + p2.y + p2.z); });
      pieces.forEach(function(pc){ m += box(P, pc.x, pc.y, pc.z, pc.d[0], pc.d[1], pc.d[2], pc.col); });
      L.svg(m, "A cube of edge a + b split into eight pieces", 300);
      L.readout([["a³", "27", C.vel], ["3a²b", "3 × 18 = 54", C.path], ["3ab²", "3 × 12 = 36", "#a78bfa"], ["b³", "8", C.ok]]);
      msg = t < 4 ? "Separating the pieces…" : "(3 + 2)³ = 27 + 54 + 36 + 8 = <b>125</b> = 5³.";
    } else if(id === "cubed11"){
      m += linesM4(L, ["11³ = (10 + 1)³", "= 10³ + 3(10²)(1) + 3(10)(1²) + 1³", "= 1000 + 300 + 30 + 1", "= 1331"], Math.min(4, Math.floor(t + 1e-9) + 1), 60, 60, 52, 20);
      L.svg(m, "11 cubed", 260);
      L.readout([["a, b", "10, 1"], ["Result", t >= 3 ? "1331" : "…", C.path]]);
      msg = t < 4 ? "Expanding…" : "11³ = 1000 + 300 + 30 + 1 = <b>1331</b>.";
    } else if(id === "diffcubes"){
      m += linesM4(L, ["x = 5, y = 2", "x³ − y³ = 125 − 8 = 117", "(x − y)(x² + xy + y²) = 3 × 39 = 117", "x³ + y³ = 125 + 8 = 133", "(x + y)(x² − xy + y²) = 7 × 19 = 133"], Math.min(5, Math.floor(t * 1.25 + 1e-9) + 1), 50, 50, 46, 18);
      L.svg(m, "Checking the cube identities", 270);
      L.readout([["x³ − y³", "117", C.path], ["x³ + y³", t >= 2.4 ? "133" : "…", C.path]]);
      msg = t < 4 ? "Substituting…" : "x³ − y³ = 117 = 3 × 39 and x³ + y³ = 133 = 7 × 19: both identities check out.";
    } else {
      m += linesM4(L, ["(x + y + z)² = x² + y² + z² + 2(xy + yz + zx)", "100 = 38 + 2(xy + yz + zx), so xy + yz + zx = 31", "x³ + y³ + z³ − 3xyz = (x + y + z)(x² + y² + z² − xy − yz − zx)", "x³ + y³ + z³ − 75 = 10 × (38 − 31) = 70", "x³ + y³ + z³ = 145"], Math.min(5, Math.floor(t * 1.25 + 1e-9) + 1), 24, 50, 46, 15);
      L.svg(m, "Example 15", 270);
      L.readout([["x + y + z", "10"], ["xy + yz + zx", t >= 0.8 ? "31" : "…"], ["x³ + y³ + z³", t >= 3.2 ? "145" : "…", C.path]]);
      msg = t < 4 ? "Working step by step…" : "x³ + y³ + z³ = 75 + 70 = <b>145</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["fig410", "Fig. 4.10: splitting a cube"], ["cubed11", "11³"], ["diffcubes", "x³ − y³ and x³ + y³"], ["ex15", "Example 15"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.cube = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Rational expressions and applications (§4.8, Examples 16–18)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "ex16"};
  var P = {
    ex16: {lines: ["(x² − 7x + 12) / (5x² + 5x − 100)", "= (x − 3)(x − 4) / [5(x − 4)(x + 5)]", "cancel (x − 4), which is not 0", "= (x − 3)/[5(x + 5)]"], res: "(x − 3)/[5(x + 5)]", check: "at x = 1: 6/(−90) = −1/15 and −2/30 = −1/15"},
    worked: {lines: ["(x² − 9) / (x² + 5x + 6)", "= (x + 3)(x − 3) / [(x + 2)(x + 3)]", "cancel (x + 3), which is not 0", "= (x − 3)/(x + 2)"], res: "(x − 3)/(x + 2)", check: "at x = 1: −8/12 = −2/3 and −2/3"}
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.04, speed: 1});
    L.legend(id === "saira" ? [[C.vel, "x² tile"], [C.path, "x-strip"], [C.ok, "unit square"]] : [[C.text, "step"], [C.path, "result"]]);
    L.watch({ex16: "Example 16: factorise the top and the bottom, then cancel.", worked: "Worked example: (x² − 9)/(x² + 5x + 6).", saira: "Example 17: one x² square, 8 strips and 15 unit squares make a rectangle (drawn with x = 3).", pool: "Example 18: the breadth is 4 m less than the length and the area is 96 m²."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, id = st.preset;
    if(P[id]){
      var c = P[id], n = Math.min(4, Math.floor(t + 1e-9) + 1);
      m += linesM4(L, c.lines, n, 50, 60, 52, 19);
      L.svg(m, "Simplifying a rational expression", 260);
      L.readout([["Result", n >= 4 ? c.res : "…", C.path], ["Numerical check", t >= 4 ? c.check : "…", C.ok]]);
      msg = t < 4 ? "Factorising…" : "The expression simplifies to <b>" + c.res + "</b>; check " + c.check + ".";
    } else if(id === "saira"){
      var u = 20, x = 3, x0 = 90, y0 = 30, f = t / 3;
      var colsW = [x * u, u, u, u, u, u], rowsH = [x * u, u, u, u];
      var yy = y0, cnt = 0;
      rowsH.forEach(function(h, rj){ var xx = x0; colsW.forEach(function(w, ci){ var type = (ci === 0 ? 1 : 0) + (rj === 0 ? 1 : 0); cnt++; if(f * 24 >= cnt) m += L.rect(xx, yy, w, h, [C.ok, C.path, C.vel][type], ' opacity="0.85" stroke="#0f172a" stroke-width="1"'); xx += w; }); yy += h; });
      m += L.text(x0 + (x + 5) * u / 2, y0 - 8, "x + 5", {size: 14, color: C.text, weight: 700}) + L.text(x0 - 10, y0 + (x + 3) * u / 2, "x + 3", {size: 14, color: C.text, anchor: "end", weight: 700});
      L.svg(m, "Saira’s rectangle", 220);
      L.readout([["Pieces", "1 x², 8 strips, 15 units"], ["Area", "x² + 8x + 15"], ["Sides", t >= 3 ? "(x + 5) and (x + 3)" : "…", C.path]]);
      msg = t < 3 ? "Arranging the pieces…" : "x² + 8x + 15 = (x + 3)(x + 5): the rectangle is <b>(x + 5) by (x + 3)</b>.";
    } else {
      var rows = [9, 10, 11, 12, 13, 14], k = Math.min(6, Math.floor(t / 3 * 6 + 1e-9) + 1);
      m += L.text(60, 34, "length x", {size: 13, color: C.muted, anchor: "start"}) + L.text(200, 34, "breadth x − 4", {size: 13, color: C.muted, anchor: "start"}) + L.text(360, 34, "area", {size: 13, color: C.muted, anchor: "start"});
      rows.slice(0, k).forEach(function(v, i){ var ar = v * (v - 4), hit = ar === 96; m += L.text(60, 66 + i * 32, v + " m", {size: 16, color: hit ? C.ok : C.text, anchor: "start", mono: true}) + L.text(200, 66 + i * 32, (v - 4) + " m", {size: 16, color: hit ? C.ok : C.text, anchor: "start", mono: true}) + L.text(360, 66 + i * 32, ar + " m²" + (hit ? "  ✓" : ""), {size: 16, color: hit ? C.ok : C.text, anchor: "start", mono: true, weight: hit ? 700 : 400}); });
      if(t >= 3) m += L.text(470, 120, "x² − 4x − 96 = 0", {size: 15, color: C.text, anchor: "start", mono: true}) + L.text(470, 150, "(x − 12)(x + 8) = 0", {size: 15, color: C.text, anchor: "start", mono: true}) + L.text(470, 180, "x = 12 (not −8)", {size: 15, color: C.path, anchor: "start", mono: true, weight: 700});
      L.svg(m, "The rectangular pool", 270);
      L.readout([["Equation", "x(x − 4) = 96"], ["Factors", t >= 3 ? "(x − 12)(x + 8)" : "…"], ["Pool", t >= 3 ? "12 m by 8 m" : "…", C.path]]);
      msg = t < 4 ? "Solving…" : "x² − 4x − 96 = (x − 12)(x + 8) = 0 gives x = 12 (a length cannot be −8): the pool is <b>12 m by 8 m</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["ex16", "Example 16"], ["worked", "(x² − 9)/(x² + 5x + 6)"], ["saira", "Example 17: Saira’s rectangle"], ["pool", "Example 18: the pool"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.rational = {mount: mount, draw: draw, select: select, state: st};
})();
