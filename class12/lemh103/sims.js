// Class 12 Mathematics, Chapter 3 (lemh103) — one interactive lab per lesson.
// ES5, window.LAB helpers, no timeline: every lab is scenario- or slider-driven.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// Shared helpers for this chapter's labs ------------------------------------
var SUB = { "1": "\u2081", "2": "\u2082", "3": "\u2083", "4": "\u2084", "5": "\u2085", "6": "\u2086" };

function mFmt(x){
  x = Number(x);
  if(Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x)).replace("-", "\u2212");
  return LAB.num(x, 1);
}

// Draw one matrix as a bracketed grid of cells. opts: {cellW, cellH, size, hiRow, hiCol, hiFill}
function grid(x, y, M, opts){
  opts = opts || {};
  var cw = opts.cellW || 58, ch = opts.cellH || 44, size = opts.size || 17;
  var rows = M.length, cols = M[0].length, s = "";
  for(var i = 0; i < rows; i += 1){
    for(var j = 0; j < cols; j += 1){
      var cx = x + j * cw, cy = y + i * ch;
      var hi = (opts.hiRow === i + 1 && opts.hiCol === j + 1);
      if(hi) s += LAB.rect(cx + 1, cy + 1, cw - 2, ch - 2, opts.hiFill || "rgba(245,158,11,.28)", ' rx="6"');
      s += LAB.text(cx + cw / 2, cy + ch / 2 + size * 0.35, mFmt(M[i][j]), {size: size, color: hi ? "#fbbf24" : LAB.C.text, weight: hi ? 700 : 400});
    }
  }
  var top = y - 6, bot = y + rows * ch + 6, r = 8;
  s += '<path d="M' + (x - 6) + ' ' + top + ' h' + (-r) + ' v' + (bot - top) + ' h' + r + '" fill="none" stroke="' + LAB.C.muted + '" stroke-width="2"/>';
  s += '<path d="M' + (x + cols * cw + 6) + ' ' + top + ' h' + r + ' v' + (bot - top) + ' h' + (-r) + '" fill="none" stroke="' + LAB.C.muted + '" stroke-width="2"/>';
  return s;
}

// -------------------------------------------------------------------------
// Lab 1 — Order builder (NCERT 3.1-3.2): generate a[i][j] from a chosen rule.
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var RULES = {
    abs: {name: "a\u1d62\u2c7c = \u00bd|i \u2212 3j|", m: 3, n: 4, f: function(i, j){ return Math.abs(i - 3 * j) / 2; }},
    sum: {name: "a\u1d62\u2c7c = 2i \u2212 j", m: 3, n: 4, f: function(i, j){ return 2 * i - j; }},
    square: {name: "a\u1d62\u2c7c = (i + j)\u00b2/2", m: 2, n: 2, f: function(i, j){ return (i + j) * (i + j) / 2; }}
  };
  var st = {rule: "abs", k: 1};

  function draw(){
    var r = RULES[st.rule], m = r.m, n = r.n, N = m * n;
    if(st.k > N) st.k = N;
    if(st.k < 1) st.k = 1;
    var M = [], i, j;
    for(i = 1; i <= m; i += 1){
      var row = [];
      for(j = 1; j <= n; j += 1) row.push(r.f(i, j));
      M.push(row);
    }
    var hi = Math.floor((st.k - 1) / n) + 1, hj = ((st.k - 1) % n) + 1;
    var cw = 66, ox = 228, oy = 92;
    var s = L.text(ox + n * cw / 2, 48, r.name, {size: 22, color: C.text, weight: 700});
    s += L.text(ox + n * cw / 2, 74, "order " + m + " \u00d7 " + n + " \u2014 " + N + " elements", {size: 15, color: C.muted});
    s += grid(ox, oy, M, {cellW: cw, cellH: 52, size: 20, hiRow: hi, hiCol: hj});
    s += L.text(ox + n * cw / 2, oy + m * 52 + 40, "highlighted: a" + SUB[hi] + SUB[hj] + " = " + mFmt(M[hi - 1][hj - 1]), {size: 17, color: "#fbbf24", weight: 700});
    L.svg(s, "Generated " + m + " by " + n + " matrix from " + r.name + ".", 300);
    L.readout([
      ["Order m \u00d7 n", m + " \u00d7 " + n, "#93c5fd"],
      ["Elements mn", String(N)],
      ["Rule", r.name],
      ["Highlighted", "a" + SUB[hi] + SUB[hj] + " = " + mFmt(M[hi - 1][hj - 1]), "#fbbf24"]
    ]);
    L.verdict("The order <b>" + m + " \u00d7 " + n + "</b> fixes exactly <b>" + N + "</b> elements. The amber cell is a" + SUB[hi] + SUB[hj] + " = " + mFmt(M[hi - 1][hj - 1]) + ", the entry in row " + hi + ", column " + hj + ".");
  }

  function select(id){ st.rule = id; st.k = 1; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["abs", "\u00bd|i \u2212 3j|"], ["sum", "2i \u2212 j"], ["square", "(i + j)\u00b2/2"]], st.rule, select);
    L.controls(L.slider("m1-k", "Highlight element k", 1, 16, 1, st.k, String(st.k)));
    L.onInput("m1-k", function(v){ st.k = Math.max(1, Math.min(16, Math.round(v))); L.setVal("m1-k", String(st.k)); draw(); });
    L.legend([["#fbbf24", "highlighted entry a\u1d62\u2c7c"], [C.muted, "matrix bracket"]]);
    L.watch("Switch the construction rule, then drag the highlight slider. Element k is counted row by row, and the readout names its position.");
    draw();
  }

  window.SIMS.matrixbuilder = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Matrix zoo (NCERT 3.3): classify a specimen and test equality.
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CASES = {
    equal: {A: [[2, 3], [0, 1]], B: [[2, 3], [0, 1]], type: "Square matrix",
      note: "Same order 2 \u00d7 2 and equal corresponding entries, so A = B."},
    orders: {A: [[1, 2], [3, 4]], B: [[1, 2, 3], [4, 5, 6]], type: "Square matrix",
      note: "A is 2 \u00d7 2 but B is 2 \u00d7 3. Different orders mean A \u2260 B, however many entries look alike."},
    entries: {A: [[1, 2], [3, 4]], B: [[1, 2], [3, 5]], type: "Square matrix",
      note: "Same order, but the (2, 2) entries differ (4 against 5), so A \u2260 B."},
    identity: {A: [[1, 0], [0, 1]], B: [[1, 0], [0, 1]], type: "Identity matrix (also diagonal and scalar)",
      note: "Diagonal entries all 1 and off-diagonal entries 0: this is I, and I = I."},
    zero: {A: [[0, 0], [0, 0]], B: [[0, 0], [0, 0]], type: "Zero matrix",
      note: "Every entry is 0, so this is O, and O = O."}
  };
  var st = {preset: "equal"};

  function equal(A, B){
    if(A.length !== B.length || A[0].length !== B[0].length) return false;
    for(var i = 0; i < A.length; i += 1)
      for(var j = 0; j < A[0].length; j += 1)
        if(A[i][j] !== B[i][j]) return false;
    return true;
  }

  function draw(){
    var c = CASES[st.preset], A = c.A, B = c.B, eq = equal(A, B);
    var s = "";
    s += L.text(150, 52, "A", {size: 26, color: "#93c5fd", weight: 700});
    s += L.text(500, 52, "B", {size: 26, color: "#fbbf24", weight: 700});
    s += grid(80, 80, A, {cellW: 60, cellH: 48, size: 19});
    s += grid(430, 80, B, {cellW: 60, cellH: 48, size: 19});
    s += L.text(360, 145, eq ? "=" : "\u2260", {size: 44, color: eq ? C.ok : C.danger, weight: 700});
    s += L.text(360, 245, eq ? "A = B: same order and all entries match" : "A \u2260 B", {size: 17, color: eq ? C.ok : C.danger, weight: 700});
    L.svg(s, "Two matrices A and B and their equality test.", 300);
    var oa = A.length + " \u00d7 " + A[0].length, ob = B.length + " \u00d7 " + B[0].length;
    L.readout([
      ["Order of A", oa, "#93c5fd"],
      ["Order of B", ob, "#fbbf24"],
      ["Type of A", c.type],
      ["A = B?", eq ? "yes \u2014 same order and all entries match" : "no", eq ? C.ok : C.danger]
    ]);
    L.verdict("<b>" + c.note + "</b>");
  }

  function select(id){ st.preset = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["equal", "Equal"], ["orders", "Different orders"], ["entries", "Different entry"], ["identity", "Identity"], ["zero", "Zero"]], st.preset, select);
    L.legend([["#93c5fd", "matrix A"], ["#fbbf24", "matrix B"]]);
    L.watch("Pick a specimen. Equality needs the same order first, then equal entries in every single position.");
    draw();
  }

  window.SIMS.matrixzoo = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Addition bench (NCERT 3.4.1-3.4.4): A + B, A - B and kA.
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var A = [[1, 2, 3], [4, 5, 6]];
  var B = [[6, 5, 4], [3, 2, 1]];
  var st = {preset: "add", k: 2};

  function result(){
    var i, j, R = [];
    for(i = 0; i < A.length; i += 1){
      R.push([]);
      for(j = 0; j < A[0].length; j += 1){
        if(st.preset === "add") R[i].push(A[i][j] + B[i][j]);
        else if(st.preset === "sub") R[i].push(A[i][j] - B[i][j]);
        else R[i].push(st.k * A[i][j]);
      }
    }
    return R;
  }

  function draw(){
    var R = result();
    var s = "";
    s += grid(60, 100, A, {cellW: 46, cellH: 40, size: 15});
    s += L.text(225, 150, st.preset === "add" ? "+" : (st.preset === "sub" ? "\u2212" : "\u00d7"), {size: 34, color: C.text, weight: 700});
    if(st.preset === "scalar"){
      s += L.text(258, 156, "k = " + L.num(st.k, 1), {size: 15, color: "#fbbf24"});
      s += L.text(300, 150, "A", {size: 26, color: "#93c5fd", weight: 700});
    } else {
      s += grid(258, 100, B, {cellW: 46, cellH: 40, size: 15});
    }
    s += L.text(485, 150, "=", {size: 34, color: C.text, weight: 700});
    s += grid(520, 100, R, {cellW: 46, cellH: 40, size: 15, hiFill: "rgba(52,211,153,.22)"});
    var label = st.preset === "add" ? "A + B" : (st.preset === "sub" ? "A \u2212 B" : "kA with k = " + L.num(st.k, 1));
    s += L.text(360, 62, label, {size: 22, color: C.text, weight: 700});
    s += L.text(360, 250, "same order 2 \u00d7 3 \u2014 entry-wise operation", {size: 15, color: C.muted});
    L.svg(s, label + " computed entry by entry.", 300);
    var cells = [
      ["Operation", label, "#93c5fd"],
      ["Order of result", "2 \u00d7 3"],
      ["Result r\u2081\u2081", mFmt(R[0][0]), C.ok],
      ["Result r\u2082\u2083", mFmt(R[1][2]), C.ok]
    ];
    if(st.preset === "scalar") cells.splice(1, 0, ["Scalar k", L.num(st.k, 1), "#fbbf24"]);
    L.readout(cells);
    var msg = st.preset === "add" ? "Each cell of A + B is the sum of the matching cells. Addition never mixes different positions."
      : st.preset === "sub" ? "Each cell of A \u2212 B is a\u1d62\u2c7c \u2212 b\u1d62\u2c7c, so the two orders must be identical."
      : "Every entry of A is multiplied by the same scalar k; the order never changes.";
    L.verdict("<b>" + label + ":</b> " + msg);
  }

  function select(id){ st.preset = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["add", "A + B"], ["sub", "A \u2212 B"], ["scalar", "kA"]], st.preset, select);
    L.controls(L.slider("m3-k", "Scalar k", -2, 3, 0.5, st.k, L.num(st.k, 1)));
    L.onInput("m3-k", function(v){ st.k = v; L.setVal("m3-k", L.num(v, 1)); draw(); });
    L.legend([[C.ok, "result"], ["#93c5fd", "A"], ["#fbbf24", "B / scalar k"]]);
    L.watch("Choose an operation, then move the scalar slider. In kA the slider multiplies every entry of A.");
    draw();
  }

  window.SIMS.addscalar = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Row-by-column explorer (NCERT 3.4.5): build one entry of AB.
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var A = [[1, 2, 3], [4, 5, 6]];
  var B = [[7, 8], [9, 10], [11, 12]];
  var st = {preset: "c11", i: 1, j: 1};

  function entry(i, j){
    var s = 0;
    for(var k = 0; k < 3; k += 1) s += A[i - 1][k] * B[k][j - 1];
    return s;
  }

  function draw(){
    var i = st.i, j = st.j;
    var row = A[i - 1], col = [B[0][j - 1], B[1][j - 1], B[2][j - 1]];
    var dot = row[0] + "\u00b7" + col[0] + " + " + row[1] + "\u00b7" + col[1] + " + " + row[2] + "\u00b7" + col[2];
    var value = entry(i, j);
    var s = "";
    s += L.text(150, 46, "A (2 \u00d7 3)", {size: 16, color: "#93c5fd", weight: 700});
    s += grid(60, 62, A, {cellW: 60, cellH: 46, size: 18, hiRow: i});
    s += L.text(430, 46, "B (3 \u00d7 2)", {size: 16, color: "#fbbf24", weight: 700});
    s += grid(370, 62, B, {cellW: 60, cellH: 46, size: 18, hiCol: j});
    s += L.text(300, 235, "row " + i + " of A = [" + row.join(", ") + "]", {size: 15, color: "#93c5fd"});
    s += L.text(300, 262, "column " + j + " of B = [" + col.join(", ") + "]", {size: 15, color: "#fbbf24"});
    s += L.text(300, 292, "c" + SUB[i] + SUB[j] + " = " + dot + " = " + value, {size: 17, color: C.ok, weight: 700});
    L.svg(s, "Entry c" + i + j + " of AB built from row " + i + " of A and column " + j + " of B.", 320);
    L.readout([
      ["A order", "2 \u00d7 3", "#93c5fd"],
      ["B order", "3 \u00d7 2", "#fbbf24"],
      ["Product order", "2 \u00d7 2"],
      ["Entry c" + SUB[i] + SUB[j], String(value), C.ok]
    ]);
    L.verdict("Row " + i + " of A meets column " + j + " of B: " + dot + " = <b>c" + SUB[i] + SUB[j] + " = " + value + "</b>. The inner dimensions 3 and 3 match, so AB is 2 \u00d7 2.");
  }

  function select(id){
    st.preset = id;
    st.i = Number(id.charAt(1));
    st.j = Number(id.charAt(2));
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["c11", "c\u2081\u2081"], ["c12", "c\u2081\u2082"], ["c21", "c\u2082\u2081"], ["c22", "c\u2082\u2082"]], st.preset, select);
    L.controls(
      L.slider("m4-i", "Row i of A", 1, 2, 1, st.i, String(st.i)) +
      L.slider("m4-j", "Column j of B", 1, 2, 1, st.j, String(st.j))
    );
    L.onInput("m4-i", function(v){ st.i = Math.max(1, Math.min(2, Math.round(v))); L.setVal("m4-i", String(st.i)); L.markPreset("c" + st.i + st.j); draw(); });
    L.onInput("m4-j", function(v){ st.j = Math.max(1, Math.min(2, Math.round(v))); L.setVal("m4-j", String(st.j)); L.markPreset("c" + st.i + st.j); draw(); });
    L.legend([["#93c5fd", "row of A"], ["#fbbf24", "column of B"], [C.ok, "product entry"]]);
    L.watch("Pick an entry c\u1d62\u2c7c or move the sliders. The highlighted strip and column are multiplied term by term and summed.");
    draw();
  }

  window.SIMS.rowcolumn = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Transpose, symmetry and inverse (NCERT 3.5-3.7).
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CASES = {
    transpose: {
      title: "Transpose A\u2032 (rows become columns)",
      A: [[3, 5], [1, -1]],
      R: [[3, 1], [5, -1]],
      resultLabel: "A\u2032",
      note: "A is 2 \u00d7 2 with a\u2081\u2082 = 5 and a\u2082\u2081 = 1; in A\u2032 these swap to 1 and 5."
    },
    symmetric: {
      title: "Symmetric part P = \u00bd(A + A\u2032)",
      A: [[1, 5], [6, 7]],
      R: [[1, 5.5], [5.5, 7]],
      resultLabel: "P",
      note: "P satisfies P\u2032 = P, so it is symmetric; the off-diagonal entries both become 5.5."
    },
    skew: {
      title: "Skew-symmetric part Q = \u00bd(A \u2212 A\u2032)",
      A: [[1, 5], [6, 7]],
      R: [[0, -0.5], [0.5, 0]],
      resultLabel: "Q",
      note: "Q satisfies Q\u2032 = \u2212Q with zero diagonal, so it is skew-symmetric and A = P + Q."
    },
    inverse: {
      title: "Inverse A\u207b\u00b9 of a 2 \u00d7 2 matrix",
      A: [[2, 3], [1, 2]],
      R: [[2, -3], [-1, 2]],
      resultLabel: "A\u207b\u00b9",
      note: "det A = 4 \u2212 3 = 1, so A\u207b\u00b9 = (1/1)[[2, \u22123], [\u22121, 2]] and AA\u207b\u00b9 = A\u207b\u00b9A = I."
    }
  };
  var st = {preset: "transpose"};

  function draw(){
    var c = CASES[st.preset], R = c.R;
    var s = "";
    s += L.text(180, 52, "A", {size: 26, color: "#93c5fd", weight: 700});
    s += L.text(540, 52, c.resultLabel, {size: 26, color: "#fbbf24", weight: 700});
    s += grid(110, 76, c.A, {cellW: 64, cellH: 50, size: 19});
    s += L.text(360, 150, "\u2192", {size: 40, color: C.muted, weight: 700});
    s += grid(470, 76, R, {cellW: 64, cellH: 50, size: 19, hiFill: "rgba(52,211,153,.20)"});
    s += L.text(360, 235, c.title, {size: 18, color: C.text, weight: 700});
    s += L.text(360, 262, "(A\u2032)\u1d62\u2c7c = a\u2c7c\u1d62  \u00b7  A = \u00bd(A + A\u2032) + \u00bd(A \u2212 A\u2032)  \u00b7  AA\u207b\u00b9 = A\u207b\u00b9A = I", {size: 13, color: C.muted});
    L.svg(s, c.title + " illustrated for a 2 by 2 matrix.", 300);
    L.readout([
      ["Scenario", c.title],
      ["Input A", "[[" + mFmt(c.A[0][0]) + ", " + mFmt(c.A[0][1]) + "], [" + mFmt(c.A[1][0]) + ", " + mFmt(c.A[1][1]) + "]]", "#93c5fd"],
      ["Result " + c.resultLabel, "[[" + mFmt(R[0][0]) + ", " + mFmt(R[0][1]) + "], [" + mFmt(R[1][0]) + ", " + mFmt(R[1][1]) + "]]", "#fbbf24"],
      ["Key check", c.note, C.ok]
    ]);
    L.verdict("<b>" + c.title + ".</b> " + c.note);
  }

  function select(id){ st.preset = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["transpose", "Transpose"], ["symmetric", "Symmetric part"], ["skew", "Skew part"], ["inverse", "Inverse"]], st.preset, select);
    L.legend([["#93c5fd", "matrix A"], ["#fbbf24", "result"], [C.ok, "verification"]]);
    L.watch("Flip A, split A into symmetric and skew parts, or build A\u207b\u00b9. The readout states the defining identity for each scenario.");
    draw();
  }

  window.SIMS.transposeinverse = {mount: mount, draw: draw, select: select, state: st};
})();
