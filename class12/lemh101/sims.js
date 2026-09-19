// Class 12 Mathematics, Chapter 1 (lemh101) — simulation labs.
// One lab per lesson, built on the shared window.LAB helpers (scripts/templates/lab.js).
// Labs are control/preset driven, so the legacy timeline toolbar is hidden on mount.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Relation builder (NCERT §1.1, relations as subsets of A × B)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var RELS = {
    square: {
      rule: "b = a²", A: [1, 2, 3], B: [1, 4, 9],
      pairs: [[1, 1], [2, 4], [3, 9]], isFn: "a function",
      verdict: "<b>Every input has exactly one image</b>: the chosen pairs are the function f(a) = a². Its domain is all of A and its range is {1, 4, 9}."
    },
    divides: {
      rule: "a divides b", A: [1, 2, 3, 4], B: [1, 2, 3, 4],
      pairs: [[1, 1], [1, 2], [1, 3], [1, 4], [2, 2], [2, 4], [3, 3], [4, 4]], isFn: "not a function",
      verdict: "<b>Input 1 is paired with 1, 2, 3 and 4</b> — four images at once. A function would allow exactly one pair per input, so this relation is not a function."
    },
    less: {
      rule: "a < b", A: [1, 2, 3], B: [1, 2, 3, 4],
      pairs: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]], isFn: "a function",
      verdict: "<b>Each input appears exactly once.</b> The selected pairs are the function f(a) = 'b such that a < b', and the range is the proper subset {2, 3, 4} of B."
    },
    universal: {
      rule: "A × B (all pairs)", A: [1, 2, 3], B: ["x", "y"],
      pairs: [[1, "x"], [1, "y"], [2, "x"], [2, "y"], [3, "x"], [3, "y"]], isFn: "not a function",
      verdict: "<b>The universal relation pairs everything with everything.</b> Input 1 goes to both x and y, so A × B is a relation that is not a function."
    }
  };
  var st = {preset: "square"};

  function inR(pairs, a, b){
    for(var i = 0; i < pairs.length; i++){
      if(pairs[i][0] === a && pairs[i][1] === b) return true;
    }
    return false;
  }
  function listOf(set){ return "{" + set.join(", ") + "}"; }

  function draw(){
    var r = RELS[st.preset];
    var m = "";
    var ay = [], by = [], i, j;
    for(i = 0; i < r.A.length; i++) ay.push(110 + i * (150 / Math.max(r.A.length - 1, 1)));
    for(j = 0; j < r.B.length; j++) by.push(110 + j * (150 / Math.max(r.B.length - 1, 1)));
    if(r.A.length === 1) ay = [185];
    if(r.B.length === 1) by = [185];
    m += L.text(140, 55, "A", {size: 20, weight: 700, color: "#60a5fa"});
    m += L.text(580, 55, "B", {size: 20, weight: 700, color: "#f59e0b"});
    m += L.rect(85, 80, 110, 210, "#132033", ' rx="12" stroke="#8db0d8" stroke-width="1.5"');
    m += L.rect(525, 80, 110, 210, "#2a2313", ' rx="12" stroke="#e2b794" stroke-width="1.5"');
    for(i = 0; i < r.A.length; i++){
      m += L.circle(140, ay[i], 13, "#1d4ed8") + L.text(140, ay[i] + 5, String(r.A[i]), {size: 15, color: "#fff", weight: 700});
    }
    for(j = 0; j < r.B.length; j++){
      m += L.circle(580, by[j], 13, "#b45309") + L.text(580, by[j] + 5, String(r.B[j]), {size: 15, color: "#fff", weight: 700});
    }
    for(i = 0; i < r.pairs.length; i++){
      var px = -1, py = -1, k;
      for(k = 0; k < r.A.length; k++) if(r.A[k] === r.pairs[i][0]) px = k;
      for(k = 0; k < r.B.length; k++) if(r.B[k] === r.pairs[i][1]) py = k;
      if(px >= 0 && py >= 0) m += L.arrow(158, ay[px], 562, by[py], "#34d399", 2.2);
    }
    m += L.text(360, 245, "rule: " + r.rule + "  ·  R ⊆ A × B", {size: 17, weight: 700, color: C.text});
    m += L.text(360, 272, "|A × B| = " + (r.A.length * r.B.length) + " ordered pairs  ·  |R| = " + r.pairs.length, {size: 14, color: C.muted});
    L.svg(m, "Arrow diagram of the relation " + r.rule, 300);

    var dom = [], rng = [];
    for(i = 0; i < r.pairs.length; i++){
      if(dom.indexOf(r.pairs[i][0]) < 0) dom.push(r.pairs[i][0]);
      if(rng.indexOf(r.pairs[i][1]) < 0) rng.push(r.pairs[i][1]);
    }
    L.readout([
      ["Rule", r.rule],
      ["Cartesian product A × B", (r.A.length * r.B.length) + " ordered pairs"],
      ["Chosen relation R", r.pairs.length + " ordered pairs"],
      ["Domain of R", listOf(dom)],
      ["Range of R", listOf(rng)],
      ["Is it a function?", r.isFn]
    ]);
    L.verdict(r.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["square", "b = a²"], ["divides", "a divides b"], ["less", "a < b"], ["universal", "A × B"]], st.preset, select);
    L.legend([["#60a5fa", "input from A"], ["#f59e0b", "output in B"], ["#34d399", "chosen pair in R"]]);
    L.watch("Select a rule. The green arrows are exactly the relation R; the readout counts A × B, R, the domain and the range.");
    draw();
  }

  window.SIMS.relationbuilder = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Property checker (NCERT §1.2, reflexive/symmetric/transitive)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var SET = [1, 2, 3];
  var MATS = {
    refnotsym: {
      label: "{(1, 1), (2, 2), (3, 3), (1, 2)}",
      pairs: [[1, 1], [2, 2], [3, 3], [1, 2]],
      verdict: "<b>Reflexive and transitive, but not symmetric.</b> The pair (1, 2) lies in R while its mirror (2, 1) does not — one missing mirror fails symmetry."
    },
    symnotref: {
      label: "{(1, 2), (2, 1), (2, 3), (3, 2)}",
      pairs: [[1, 2], [2, 1], [2, 3], [3, 2]],
      verdict: "<b>Symmetric but not reflexive or transitive.</b> No diagonal pair is present, and the chain (1, 2), (2, 3) is missing its short-cut (1, 3)."
    },
    equiv: {
      label: "{(1, 1), (2, 2), (3, 3), (1, 2), (2, 1)}",
      pairs: [[1, 1], [2, 2], [3, 3], [1, 2], [2, 1]],
      classes: "classes {1, 2} and {3}",
      verdict: "<b>All three tests pass: an equivalence relation.</b> It partitions {1, 2, 3} into {1, 2} and {3}; every element of a class is related to every other member."
    },
    universal: {
      label: "A × A (all 9 pairs)",
      pairs: [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3]],
      classes: "one class {1, 2, 3}",
      verdict: "<b>The universal relation A × A passes all three tests.</b> Everything is related to everything, so the whole set forms a single equivalence class {1, 2, 3}."
    }
  };
  var st = {preset: "equiv"};

  function has(pairs, a, b){
    for(var i = 0; i < pairs.length; i++) if(pairs[i][0] === a && pairs[i][1] === b) return true;
    return false;
  }
  function isRef(pairs){
    for(var i = 0; i < SET.length; i++) if(!has(pairs, SET[i], SET[i])) return false;
    return true;
  }
  function isSym(pairs){
    for(var i = 0; i < pairs.length; i++) if(!has(pairs, pairs[i][1], pairs[i][0])) return false;
    return true;
  }
  function isTrans(pairs){
    for(var i = 0; i < pairs.length; i++){
      for(var j = 0; j < pairs.length; j++){
        if(pairs[i][1] === pairs[j][0] && !has(pairs, pairs[i][0], pairs[j][1])) return false;
      }
    }
    return true;
  }

  function draw(){
    var r = MATS[st.preset];
    var ref = isRef(r.pairs), sym = isSym(r.pairs), tr = isTrans(r.pairs);
    var m = "";
    m += L.text(360, 42, "R on A = {1, 2, 3}   ·   " + r.label, {size: 15, color: C.text, weight: 700});
    var i, j;
    for(i = 0; i < 3; i++){
      m += L.text(210 + i * 90, 92, String(SET[i]), {size: 16, color: "#f59e0b", weight: 700});
      m += L.text(150, 130 + i * 56, String(SET[i]), {size: 16, color: "#60a5fa", weight: 700});
      for(j = 0; j < 3; j++){
        var on = has(r.pairs, SET[i], SET[j]);
        var diag = i === j;
        m += L.circle(210 + j * 90, 128 + i * 56, 16, on ? "#34d399" : "#132033",
                      ' stroke="' + (diag ? "#f8fafc" : "#475569") + '" stroke-width="' + (diag ? 2.5 : 1.5) + '"');
        if(on) m += L.text(210 + j * 90, 134 + i * 56, "✓", {size: 18, color: "#06251c", weight: 700});
      }
    }
    m += L.text(210, 300, "columns: second coordinate b", {size: 13, color: C.muted});
    m += L.text(360, 285, "white outline = diagonal pair (a, a)", {size: 13, color: C.muted});
    L.svg(m, "3 by 3 membership grid for the relation on 1, 2, 3.", 310);

    L.readout([
      ["Relation R", r.label],
      ["Reflexive?", ref ? "Yes — every (a, a) is present" : "No — a diagonal pair is missing"],
      ["Symmetric?", sym ? "Yes — every pair has its mirror" : "No — a mirror pair is missing"],
      ["Transitive?", tr ? "Yes — no chain escapes R" : "No — a chain is missing its short-cut"],
      ["Type", (ref && sym && tr) ? "equivalence relation" : "not an equivalence relation"],
      ["Equivalence classes", (ref && sym && tr) ? r.classes : "—"]
    ]);
    L.verdict(r.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["refnotsym", "Reflexive, not symmetric"], ["symnotref", "Symmetric, not reflexive"], ["equiv", "Equivalence"], ["universal", "Universal A × A"]], st.preset, select);
    L.legend([["#34d399", "pair in R"], ["#132033", "pair not in R"], ["#f8fafc", "diagonal (a, a)"]]);
    L.watch("Filled cells are the pairs of R. The three properties are tested independently in the readout.");
    draw();
  }

  window.SIMS.relationtype = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Function explorer (NCERT §1.3, one-one / onto)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var FNS = {
    double: {
      name: "f(x) = 2x", space: "R → R", one: true, onto: true, inv: "f⁻¹(x) = x / 2",
      ins: [["−2", "−4"], ["−1", "−2"], ["0", "0"], ["1", "2"], ["2", "4"]], un: [],
      verdict: "<b>f(x) = 2x is a bijection.</b> Doubling is strictly increasing, so distinct inputs give distinct images; and every real y is reached as f(y/2)."
    },
    square: {
      name: "f(x) = x²", space: "R → R", one: false, onto: false, inv: "—",
      ins: [["−2", "4"], ["−1", "1"], ["0", "0"], ["1", "1"], ["2", "4"]], un: ["−1", "−2"],
      verdict: "<b>f(x) = x² is neither one-one nor onto.</b> f(−1) = f(1) = 1 shows two inputs sharing an image, and every negative co-domain value is never reached."
    },
    cube: {
      name: "f(x) = x³", space: "R → R", one: true, onto: true, inv: "f⁻¹(x) = ∛x",
      ins: [["−2", "−8"], ["−1", "−1"], ["0", "0"], ["1", "1"], ["2", "8"]], un: [],
      verdict: "<b>f(x) = x³ is a bijection.</b> Cubing is strictly increasing (one-one) and every real number has a real cube root (onto)."
    },
    natdouble: {
      name: "f(x) = 2x", space: "N → N", one: true, onto: false, inv: "—",
      ins: [["1", "2"], ["2", "4"], ["3", "6"], ["4", "8"]], un: ["1", "3", "5"],
      verdict: "<b>f(x) = 2x on N is one-one but not onto.</b> No two naturals double to the same number, but every odd natural number is unreachable."
    },
    constant: {
      name: "f(x) = 1", space: "R → R", one: false, onto: false, inv: "—",
      ins: [["−2", "1"], ["−1", "1"], ["0", "1"], ["1", "1"], ["2", "1"]], un: ["0", "2"],
      verdict: "<b>f(x) = 1 is neither one-one nor onto.</b> All inputs share the single image 1, and almost every co-domain value is missed."
    }
  };
  var st = {preset: "double"};

  function draw(){
    var f = FNS[st.preset];
    var outs = [], i, k;
    for(i = 0; i < f.ins.length; i++) if(outs.indexOf(f.ins[i][1]) < 0) outs.push(f.ins[i][1]);
    var all = f.un.concat(outs);
    var m = "";
    var x0 = 95, x1 = 640, label = 40;
    m += L.line(x0, label, x1, label, C.faint, 2);
    m += L.text(360, 30, f.name + "   (" + f.space + ")", {size: 18, color: C.text, weight: 700});
    m += L.text(120, 62, "domain", {size: 14, color: "#60a5fa"});
    m += L.text(600, 62, "co-domain samples", {size: 14, color: "#f59e0b"});
    for(i = 0; i < f.ins.length; i++){
      var iy = 105 + i * 38;
      m += L.circle(130, iy, 12, "#1d4ed8") + L.text(130, iy + 5, f.ins[i][0], {size: 14, color: "#fff", weight: 700});
      var oy = -1;
      for(k = 0; k < outs.length; k++) if(outs[k] === f.ins[i][1]) oy = 105 + k * 38;
      if(oy >= 0) m += L.arrow(146, iy, 570, oy, "#34d399", 2.2);
    }
    for(k = 0; k < outs.length; k++){
      var y = 105 + k * 38;
      m += L.circle(590, y, 12, "#b45309") + L.text(590, y + 5, outs[k], {size: 14, color: "#fff", weight: 700});
    }
    var uy = 105 + outs.length * 38 + 14;
    for(k = 0; k < f.un.length; k++){
      var yy = uy + k * 30;
      m += L.circle(590, yy, 11, "#132033", ' stroke="' + C.danger + '" stroke-width="2" stroke-dasharray="3 3"');
      m += L.text(590, yy + 5, f.un[k], {size: 13, color: C.danger});
      m += L.text(505, yy + 5, "never reached", {size: 12, color: C.danger});
    }
    if(!f.un.length) m += L.text(590, uy, "every sample reached", {size: 13, color: C.ok});
    L.svg(m, "Mapping diagram for " + f.name + " on " + f.space + ".", 360);

    var type = f.one && f.onto ? "bijection (one-one and onto)" : (f.one ? "one-one but not onto" : (f.onto ? "onto but not one-one" : "neither one-one nor onto"));
    L.readout([
      ["Function", f.name],
      ["Domain → co-domain", f.space],
      ["One-one?", f.one ? "Yes — distinct inputs, distinct images" : "No — two inputs share an image"],
      ["Onto?", f.onto ? "Yes — every co-domain value is reached" : "No — some co-domain values are never reached"],
      ["Type", type],
      ["Inverse", f.inv]
    ]);
    L.verdict(f.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["double", "2x on R"], ["square", "x² on R"], ["cube", "x³ on R"], ["natdouble", "2x on N"], ["constant", "constant 1"]], st.preset, select);
    L.legend([["#1d4ed8", "input"], ["#34d399", "arrow to image"], ["#ef4444", "unreached value"]]);
    L.watch("Follow the arrows. Filled amber dots are reached co-domain values; dashed red dots are never reached, which is what breaks 'onto'.");
    draw();
  }

  window.SIMS.functiontype = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Function machines (NCERT §1.4, composition and inverse)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PAIRS = {
    linear: {
      fName: "f(x) = 2x + 1", gName: "g(x) = x²", x: 1,
      f: function(x){ return 2 * x + 1; }, g: function(x){ return x * x; },
      inv: "f⁻¹(x) = (x − 1) / 2",
      verdict: "<b>Order matters.</b> With x = 1, g(f(1)) = g(3) = 9 but f(g(1)) = f(1) = 3. The same two machines give different results in different orders, so g∘f ≠ f∘g in general."
    },
    trig: {
      fName: "f(x) = cos x", gName: "g(x) = 3x²", x: 0,
      f: Math.cos, g: function(x){ return 3 * x * x; },
      inv: "—",
      verdict: "<b>NCERT Example 16:</b> g∘f(x) = 3cos²x while f∘g(x) = cos(3x²). They differ at x = 0, where g(f(0)) = 3 but f(g(0)) = 1."
    },
    inverse: {
      fName: "f(x) = 4x + 3", gName: "g(x) = (x − 3) / 4", x: 1,
      f: function(x){ return 4 * x + 3; }, g: function(x){ return (x - 3) / 4; },
      inv: "g = f⁻¹",
      verdict: "<b>g is the inverse of f.</b> Both round trips return the input: g(f(x)) = x and f(g(x)) = x, so g = f⁻¹ and f is invertible."
    }
  };
  var st = {preset: "linear", x: 1};

  function machine(x, y, title, color, outY){
    return L.rect(x, y, 130, 66, "#132033", ' rx="10" stroke="' + color + '" stroke-width="2"') +
      L.text(x + 65, y + 28, title, {size: 14, color: color, weight: 700});
  }

  function lane(y, first, second, x, value, color1, color2){
    var m = "";
    m += L.circle(105, y, 17, "#1d4ed8") + L.text(105, y + 5, L.num(x, 1), {size: 14, color: "#fff", weight: 700});
    m += L.arrow(125, y, 175, y, color1, 2.5);
    m += machine(180, y - 33, first, color1, y);
    m += L.arrow(315, y, 365, y, color2, 2.5);
    m += machine(370, y - 33, second, color2, y);
    m += L.arrow(505, y, 555, y, C.ok, 2.5);
    m += L.circle(580, y, 19, "#0f2a22", ' stroke="' + C.ok + '" stroke-width="2"');
    m += L.text(580, y + 6, L.num(value, 2), {size: 13, color: C.ok, weight: 700});
    return m;
  }

  function draw(){
    var p = PAIRS[st.preset];
    var x = st.x;
    var gof = p.g(p.f(x)), fog = p.f(p.g(x));
    var m = "";
    m += L.text(360, 32, "input x = " + L.num(x, 1) + "  ·  " + p.fName + "  ·  " + p.gName, {size: 16, color: C.text, weight: 700});
    m += L.text(60, 80, "g ∘ f", {size: 15, color: "#60a5fa", weight: 700, anchor: "start"});
    m += lane(105, p.fName, p.gName, x, gof, "#60a5fa", "#f59e0b");
    m += L.text(60, 205, "f ∘ g", {size: 15, color: "#a78bfa", weight: 700, anchor: "start"});
    m += lane(230, p.gName, p.fName, x, fog, "#f59e0b", "#60a5fa");
    var same = Math.abs(gof - fog) < 1e-9;
    m += L.text(360, 288, "g(f(x)) = " + L.num(gof, 3) + "   ·   f(g(x)) = " + L.num(fog, 3) + "   ·   " + (same ? "identical here" : "different"), {size: 14, color: same ? C.ok : C.danger});
    L.svg(m, "Composition lanes: g of f and f of g at x = " + L.num(x, 1) + ".", 300);

    L.readout([
      ["Composition", "g∘f and f∘g at x = " + L.num(x, 1)],
      ["g(f(x))", L.num(gof, 3) + (same ? " (same as f∘g here)" : ""), "#f59e0b"],
      ["f(g(x))", L.num(fog, 3) + (same ? " (same as g∘f here)" : ""), "#a78bfa"],
      ["Commutative?", same ? "yes for this x" : "no — the order changes the result"],
      ["Inverse machine", p.inv]
    ]);
    L.verdict(p.verdict);
  }

  function select(id){
    st.preset = id;
    st.x = PAIRS[id].x;
    var el = document.getElementById("t4-x");
    if(el){ el.value = st.x; L.setVal("t4-x", L.num(st.x, 1)); }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["linear", "2x + 1 after x²"], ["trig", "cos x after 3x²"], ["inverse", "f then f⁻¹"]], st.preset, select);
    L.controls(L.slider("t4-x", "Input x", -2, 2, 0.5, st.x, L.num(st.x, 1)));
    L.onInput("t4-x", function(v){ st.x = v; L.setVal("t4-x", L.num(v, 1)); draw(); });
    L.legend([["#60a5fa", "first machine"], ["#f59e0b", "second machine"], [C.ok, "output"]]);
    L.watch("Follow a value through both routes. g∘f applies f then g; f∘g applies g then f. The inverse preset returns the input unchanged.");
    draw();
  }

  window.SIMS.compositionlab = {mount: mount, draw: draw, select: select, state: st};
})();
