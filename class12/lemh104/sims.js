// Class 12 Mathematics, Chapter 4 (lemh104) — one interactive lab per lesson.
// ES5, window.LAB helpers, no timeline: every lab is scenario- or slider-driven.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

var SUB = { "1": "\u2081", "2": "\u2082", "3": "\u2083", "4": "\u2084" };

function cellText(v){
  if(typeof v === "string") return v;
  return mFmt(v);
}

function mFmt(x){
  x = Number(x);
  if(Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x)).replace("-", "\u2212");
  return LAB.num(x, 2).replace(/0+$/, "").replace(/\.$/, "");
}

function grid(x, y, M, opts){
  opts = opts || {};
  var cw = opts.cellW || 56, ch = opts.cellH || 44, size = opts.size || 17;
  var rows = M.length, cols = M[0].length, s = "";
  for(var i = 0; i < rows; i += 1){
    for(var j = 0; j < cols; j += 1){
      var cx = x + j * cw, cy = y + i * ch;
      var hi = (opts.hiRow === i + 1 || opts.hiCol === j + 1);
      if(hi) s += LAB.rect(cx + 1, cy + 1, cw - 2, ch - 2, opts.hiFill || "rgba(245,158,11,.25)", ' rx="6"');
      s += LAB.text(cx + cw / 2, cy + ch / 2 + size * 0.35, cellText(M[i][j]), {size: size, color: hi ? "#fbbf24" : LAB.C.text, weight: hi ? 700 : 400});
    }
  }
  var top = y - 6, bot = y + rows * ch + 6, r = 8;
  s += '<path d="M' + (x - 6) + ' ' + top + ' h' + (-r) + ' v' + (bot - top) + ' h' + r + '" fill="none" stroke="' + LAB.C.muted + '" stroke-width="2"/>';
  s += '<path d="M' + (x + cols * cw + 6) + ' ' + top + ' h' + r + ' v' + (bot - top) + ' h' + (-r) + '" fill="none" stroke="' + LAB.C.muted + '" stroke-width="2"/>';
  return s;
}

function det2(A){
  return A[0][0] * A[1][1] - A[0][1] * A[1][0];
}
function minorMat3(A, r, c){
  var M = [];
  for(var i = 0; i < 3; i += 1){
    if(i === r) continue;
    var row = [];
    for(var j = 0; j < 3; j += 1){
      if(j === c) continue;
      row.push(A[i][j]);
    }
    M.push(row);
  }
  return M;
}

function minor3(A, r, c){
  return det2(minorMat3(A, r, c));
}
function det3(A){
  var s = 0;
  for(var j = 0; j < 3; j += 1) s += A[0][j] * (j % 2 ? -1 : 1) * minor3(A, 0, j);
  return s;
}

// -------------------------------------------------------------------------
// Lab 1 — Determinant expander (NCERT 4.1-4.2).
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CASES = {
    d22: {A: [[2, 4], [-5, -1]], line: 0, note: "Order 2: one multiplication and one subtraction, ad \u2212 bc."},
    d33a: {A: [[1, 2, 4], [-1, 3, 0], [4, 1, 0]], line: 5, note: "Expanding along C\u2083 uses its two zeros and needs only one 2 \u00d7 2 minor."},
    d33b: {A: [[3, -1, -2], [0, 0, -1], [3, -5, 0]], line: 1, note: "Row 2 has two zeros, so a single cofactor term gives the value."},
    d33c: {A: [[0, 1, 2], [-1, 0, -3], [-2, 3, 0]], line: 0, note: "The terms cancel: a skew-symmetric 3 \u00d7 3 determinant is always 0."},
    d33d: {A: [[2, -1, -2], [0, 2, -1], [3, -5, 0]], line: 0, note: "Expanding along R\u2081 with a=2, b=\u22121, c=\u22122."},
    identity: {A: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], line: 0, note: "The identity matrix has determinant 1 whatever line you expand along."}
  };
  var LINES = ["R\u2081", "R\u2082", "R\u2083", "C\u2081", "C\u2082", "C\u2083"];
  var st = {preset: "d33a", line: 5};

  function value(A){
    return A.length === 2 ? det2(A) : det3(A);
  }

  function termsOf(A, line){
    var out = [], i, j;
    if(A.length === 2){
      return ["a\u2081\u2081a\u2082\u2082 = " + mFmt(A[0][0] * A[1][1]), "a\u2081\u2082a\u2082\u2081 = " + mFmt(A[0][1] * A[1][0]), "|A| = a\u2081\u2081a\u2082\u2082 \u2212 a\u2081\u2082a\u2082\u2081 = " + mFmt(value(A))];
    }
    if(line < 3){
      i = line;
      for(j = 0; j < 3; j += 1) out.push("a" + SUB[i + 1] + SUB[j + 1] + "A" + SUB[i + 1] + SUB[j + 1] + " = " + mFmt(A[i][j] * (j % 2 ? -1 : 1) * minor3(A, i, j)));
    } else {
      j = line - 3;
      for(i = 0; i < 3; i += 1) out.push("a" + SUB[i + 1] + SUB[j + 1] + "A" + SUB[i + 1] + SUB[j + 1] + " = " + mFmt(A[i][j] * ((i + j) % 2 ? -1 : 1) * minor3(A, i, j)));
    }
    return out;
  }

  function draw(){
    var c = CASES[st.preset], A = c.A;
    if(A.length === 2 && st.line > 1) st.line = 0;
    var line = st.line;
    var hiRow = A.length === 3 && line < 3 ? line + 1 : 0;
    var hiCol = A.length === 3 && line >= 3 ? line - 2 : 0;
    var s = "";
    s += L.text(230, 44, "A", {size: 24, color: "#93c5fd", weight: 700});
    s += grid(170, 62, A, {cellW: 62, cellH: 48, size: 19, hiRow: hiRow, hiCol: hiCol});
    s += L.text(560, 44, "expand along " + (A.length === 2 ? (line === 0 ? "R\u2081" : "R\u2082") : LINES[line]), {size: 18, color: "#fbbf24", weight: 700});
    var tm = termsOf(A, line);
    for(var i = 0; i < tm.length; i += 1){
      s += L.text(420, 110 + i * 30, tm[i], {size: 14, color: C.text, anchor: "start"});
    }
    s += L.text(420, 110 + tm.length * 30 + 20, "|A| = " + mFmt(value(A)), {size: 22, color: C.ok, weight: 700, anchor: "start"});
    L.svg(s, "Determinant expansion for a " + A.length + " by " + A.length + " matrix.", 320);
    L.readout([
      ["Matrix order", A.length + " \u00d7 " + A.length, "#93c5fd"],
      ["Expansion line", A.length === 2 ? (line === 0 ? "R\u2081" : "R\u2082") : LINES[line], "#fbbf24"],
      ["Terms", tm.join("  |  ")],
      ["|A|", mFmt(value(A)), C.ok]
    ]);
    L.verdict("<b>|A| = " + mFmt(value(A)) + ".</b> " + c.note);
  }

  function select(id){
    st.preset = id;
    st.line = CASES[id].line;
    var A = CASES[id].A;
    if(document.getElementById("m1-line")) document.getElementById("m1-line").max = A.length === 2 ? 1 : 5;
    if(document.getElementById("m1-line")){
      document.getElementById("m1-line").value = st.line;
      L.setVal("m1-line", A.length === 2 ? (st.line === 0 ? "R\u2081" : "R\u2082") : LINES[st.line]);
    }
    L.markPreset(id);
    draw();
  }

  function drawLine(v){
    var A = CASES[st.preset].A;
    var hi = A.length === 2 ? 1 : 5;
    st.line = Math.max(0, Math.min(hi, Math.round(v)));
    L.setVal("m1-line", A.length === 2 ? (st.line === 0 ? "R\u2081" : "R\u2082") : LINES[st.line]);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["d22", "2 \u00d7 2"], ["d33a", "C\u2083 with zeros"], ["d33b", "R\u2082 with zeros"], ["d33c", "skew 3 \u00d7 3"], ["d33d", "generic 3 \u00d7 3"], ["identity", "I\u2083"]], st.preset, select);
    L.controls(L.slider("m1-line", "Expansion line", 0, 5, 1, st.line, "C\u2083"));
    L.onInput("m1-line", drawLine);
    L.legend([["#93c5fd", "matrix entries"], ["#fbbf24", "expansion line"], [C.ok, "determinant"]]);
    L.watch("Pick a matrix; the slider chooses the row or column used for expansion. The value is the same for every choice.");
    draw();
  }

  window.SIMS.detexpand = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Triangle area from a determinant (NCERT 4.3).
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CASES = {
    a: {P: [[1, 0], [6, 0], [4, 3]], note: "A horizontal base of length 5 and height 3 give area 7.5."},
    b: {P: [[2, 7], [1, 1], [10, 8]], note: "Coordinates far apart: the determinant method handles it in one line."},
    c: {P: [[-2, -3], [3, 2], [-1, -8]], note: "Signs matter only in the arithmetic; the absolute value gives the area."},
    collinear: {P: [[0, 0], [1, 2], [3, 6]], note: "The determinant is 0: all three points lie on the line y = 2x."}
  };
  var st = {preset: "a", yes: 6, xs: [1, 6, 4], ys: [0, 0, 3]};

  function pick(id){
    st.preset = id;
    var P = CASES[id].P;
    st.xs = [P[0][0], P[1][0], P[2][0]];
    st.ys = [P[0][1], P[1][1], P[2][1]];
  }

  function detVal(){
    var x = st.xs, y = st.ys;
    return x[0] * (y[1] - y[2]) + x[1] * (y[2] - y[0]) + x[2] * (y[0] - y[1]);
  }

  function draw(){
    var x = st.xs, y = st.ys, d = detVal(), area = Math.abs(d) / 2;
    var ox = 120, oy = 200, sc = 12;
    var s = "";
    for(var g = -4; g <= 10; g += 1) s += L.line(ox + g * sc, 200 + 8 * sc, ox + g * sc, 200 - 7 * sc, C.grid, 1);
    for(var h = -8; h <= 7; h += 1) s += L.line(ox - 4 * sc, oy - h * sc, ox + 10 * sc, oy - h * sc, C.grid, 1);
    s += L.line(ox - 4 * sc, oy, ox + 10 * sc, oy, C.muted, 1.5);
    s += L.line(ox, oy + 8 * sc, ox, oy - 7 * sc, C.muted, 1.5);
    for(var i = 0; i < 3; i += 1){
      s += L.circle(ox + x[i] * sc, oy - y[i] * sc, 5, i === 2 ? "#fbbf24" : "#93c5fd");
      s += L.text(ox + x[i] * sc + 12, oy - y[i] * sc - 8, "(" + x[i] + ", " + y[i] + ")", {size: 12, color: i === 2 ? "#fbbf24" : "#93c5fd", anchor: "start"});
    }
    if(area > 0){
      s += '<polygon points="' + (ox + x[0] * sc) + ',' + (oy - y[0] * sc) + ' ' + (ox + x[1] * sc) + ',' + (oy - y[1] * sc) + ' ' + (ox + x[2] * sc) + ',' + (oy - y[2] * sc) + '" fill="rgba(56,189,248,.25)" stroke="' + C.ok + '" stroke-width="2"/>';
    }
    s += L.text(360, 40, "det = " + mFmt(d) + "   \u2192   area = |det| / 2 = " + mFmt(area), {size: 18, color: C.ok, weight: 700});
    L.svg(s, "Triangle with vertices and its determinant area.", 300);
    L.readout([
      ["Vertices", "(" + x[0] + ", " + y[0] + "), (" + x[1] + ", " + y[1] + "), (" + x[2] + ", " + y[2] + ")"],
      ["Determinant \u0394", mFmt(d), d === 0 ? C.ok : C.text],
      ["Area |\u0394|/2", mFmt(area) + " sq units", C.ok],
      ["Status", area === 0 ? "collinear" : "triangle", area === 0 ? "#fbbf24" : C.muted]
    ]);
    L.verdict("<b>" + CASES[st.preset].note + "</b>");
  }

  function select(id){ pick(id); L.markPreset(id); syncSliders(); draw(); }

  function syncSliders(){
    if(document.getElementById("m2-x")) document.getElementById("m2-x").value = st.xs[2];
    if(document.getElementById("m2-y")) document.getElementById("m2-y").value = st.ys[2];
    L.setVal("m2-x", String(st.xs[2]));
    L.setVal("m2-y", String(st.ys[2]));
  }

  function mount(){
    labNoTimeline();
    L.presets([["a", "Base 5, height 3"], ["b", "Wide triangle"], ["c", "Mixed signs"], ["collinear", "Collinear"]], st.preset, select);
    L.controls(
      L.slider("m2-x", "Vertex C: x", -4, 10, 1, st.xs[2], String(st.xs[2])) +
      L.slider("m2-y", "Vertex C: y", -8, 9, 1, st.ys[2], String(st.ys[2]))
    );
    L.onInput("m2-x", function(v){ st.xs[2] = Math.max(-4, Math.min(10, Math.round(v))); L.setVal("m2-x", String(st.xs[2])); L.markPreset(""); draw(); });
    L.onInput("m2-y", function(v){ st.ys[2] = Math.max(-8, Math.min(9, Math.round(v))); L.setVal("m2-y", String(st.ys[2])); L.markPreset(""); draw(); });
    L.legend([["#93c5fd", "fixed vertices"], ["#fbbf24", "movable vertex C"], [C.ok, "triangle / area"]]);
    L.watch("Pick a triangle, then drag vertex C. The determinant and the area update, and the status switches to collinear when they line up.");
    draw();
  }

  window.SIMS.trianglearea = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Minor and cofactor grid (NCERT 4.4).
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var A = [[2, -3, 5], [6, 0, 4], [1, 5, -7]];
  var st = {r: 1, c: 1};

  function draw(){
    var r = st.r, c = st.c, MM = minorMat3(A, r - 1, c - 1), M = det2(MM);
    var sign = ((r + c) % 2) ? -1 : 1;
    var cof = sign * M;
    var s = "";
    s += L.text(230, 44, "determinant |A|", {size: 17, color: "#93c5fd", weight: 700});
    s += grid(150, 62, A, {cellW: 58, cellH: 46, size: 18, hiRow: r, hiCol: c, hiFill: "rgba(239,68,68,.28)"});
    s += L.text(300, 210, "delete row " + r + " and column " + c, {size: 15, color: C.muted});
    s += L.text(230, 262, "2 \u00d7 2 minor", {size: 15, color: "#fbbf24", anchor: "start"});
    s += grid(490, 225, MM, {cellW: 46, cellH: 38, size: 15, hiFill: "rgba(52,211,153,.22)"});
    s += L.text(420, 110, "M" + SUB[r] + SUB[c] + " = " + mFmt(M), {size: 18, color: C.text, anchor: "start"});
    s += L.text(420, 140, "sign (\u22121)<tspan baseline-shift='super' font-size='11'>" + r + "+" + c + "</tspan> = " + (sign > 0 ? "+1" : "\u22121"), {size: 15, color: C.muted, anchor: "start"});
    s += L.text(420, 170, "A" + SUB[r] + SUB[c] + " = " + mFmt(cof), {size: 22, color: C.ok, weight: 700, anchor: "start"});
    L.svg(s, "Minor and cofactor for position (" + r + ", " + c + ").", 320);
    L.readout([
      ["Position", "(" + r + ", " + c + ")", "#f87171"],
      ["Minor M" + SUB[r] + SUB[c], mFmt(M), "#fbbf24"],
      ["Sign", (sign > 0 ? "+1" : "\u22121")],
      ["Cofactor A" + SUB[r] + SUB[c], mFmt(cof), C.ok]
    ]);
    L.verdict("<b>Position (" + r + ", " + c + "):</b> deleting its row and column leaves the minor M" + SUB[r] + SUB[c] + " = " + mFmt(M) + "; the checkerboard sign is " + (sign > 0 ? "+1" : "\u22121") + ", so the cofactor A" + SUB[r] + SUB[c] + " = " + mFmt(cof) + ".");
  }

  function select(id){
    st.r = Number(id.charAt(1));
    st.c = Number(id.charAt(2));
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    var list = [];
    for(var i = 1; i <= 3; i += 1)
      for(var j = 1; j <= 3; j += 1)
        list.push(["m" + i + j, "a" + SUB[i] + SUB[j]]);
    L.presets(list, "m" + st.r + st.c, select);
    L.legend([["#f87171", "deleted row/column"], ["#fbbf24", "minor"], [C.ok, "cofactor"]]);
    L.watch("Click any position. The crossing row and column grey out, the remaining 2 \u00d7 2 minor is shown, and the checkerboard sign turns it into the cofactor.");
    draw();
  }

  window.SIMS.minorcofactor = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Adjoint and inverse workbench (NCERT 4.5).
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CASES = {
    adj2: {A: [[1, 2], [3, 4]], label: "2 \u00d7 2 adjoint", note: "adj A swaps the diagonal and negates the off-diagonal; the inverse divides by det = \u22122."},
    inv2: {A: [[2, -2], [4, 3]], label: "2 \u00d7 2 inverse", note: "det = 14, so every entry of the adjoint is divided by 14."},
    adj3: {A: [[1, -1, 2], [2, 3, 5], [-2, 0, 1]], label: "3 \u00d7 3 adjoint", note: "Nine cofactors are transposed to build adj A; det = 27 makes A invertible."},
    singular: {A: [[2, 3], [-4, -6]], label: "singular matrix", note: "det = 0, so no inverse exists even though adj A is not the zero matrix."}
  };
  var st = {preset: "adj2"};

  function cofMat2(A){
    return [[A[1][1], -A[1][0]], [-A[0][1], A[0][0]]];
  }

  function cofMat3(A){
    var Cm = [];
    for(var i = 0; i < 3; i += 1){
      Cm.push([]);
      for(var j = 0; j < 3; j += 1) Cm[i].push(((i + j) % 2 ? -1 : 1) * minor3(A, i, j));
    }
    return Cm;
  }

  function transpose(M){
    var T = [];
    for(var j = 0; j < M[0].length; j += 1){
      T.push([]);
      for(var i = 0; i < M.length; i += 1) T[j].push(M[i][j]);
    }
    return T;
  }

  function matStr(M){
    return "[" + M.map(function(row){ return "[" + row.map(mFmt).join(", ") + "]"; }).join(", ") + "]";
  }

  function draw(){
    var c = CASES[st.preset], A = c.A, n = A.length;
    var det = n === 2 ? det2(A) : det3(A);
    var adj = transpose(n === 2 ? cofMat2(A) : cofMat3(A));
    var s = "";
    s += L.text(160, 44, "A", {size: 22, color: "#93c5fd", weight: 700});
    s += grid(100, 62, A, {cellW: n === 2 ? 58 : 52, cellH: 44, size: 17});
    s += L.text(370, 130, "det = " + mFmt(det), {size: 20, color: det === 0 ? C.danger : C.ok, weight: 700});
    s += L.text(370, 165, det === 0 ? "singular \u2014 no inverse" : "non-singular \u2014 inverse exists", {size: 14, color: det === 0 ? C.danger : C.muted});
    s += L.text(540, 44, "adj A", {size: 20, color: "#fbbf24", weight: 700});
    s += grid(480, 62, adj, {cellW: n === 2 ? 58 : 52, cellH: 44, size: 17, hiFill: "rgba(52,211,153,.20)"});
    L.svg(s, c.label + " with determinant " + mFmt(det) + ".", 300);
    var cells = [
      ["Scenario", c.label],
      ["det A", mFmt(det), det === 0 ? C.danger : C.ok],
      ["adj A", matStr(adj), "#fbbf24"]
    ];
    if(det !== 0){
      var inv = adj.map(function(row){ return row.map(function(v){ return v / det; }); });
      cells.push(["A\u207b\u00b9", matStr(inv), C.ok]);
    } else {
      cells.push(["A\u207b\u00b9", "does not exist (det = 0)", C.danger]);
    }
    L.readout(cells);
    L.verdict("<b>" + c.label + ":</b> " + c.note);
  }

  function select(id){ st.preset = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["adj2", "2 \u00d7 2 adjoint"], ["inv2", "2 \u00d7 2 inverse"], ["adj3", "3 \u00d7 3 adjoint"], ["singular", "singular"]], st.preset, select);
    L.legend([["#93c5fd", "A"], ["#fbbf24", "adj A"], [C.ok, "A\u207b\u00b9 when it exists"]]);
    L.watch("Choose a matrix. The bench shows |A|, the transposed cofactor grid adj A, and \u2014 when |A| \u2260 0 \u2014 the inverse A\u207b\u00b9 = adj A/|A|.");
    draw();
  }

  window.SIMS.adjointinverse = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — AX = B system solver (NCERT 4.6).
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CASES = {
    unique2: {
      label: "2 \u00d7 2 unique solution", A: [[1, 1], [2, -1]], B: [3, 0],
      note: "|A| = \u22123 \u2260 0, so the lines cross once at (1, 2)."
    },
    unique3: {
      label: "3 \u00d7 3 unique solution", A: [[3, -2, 3], [2, 1, -1], [4, -3, 2]], B: [8, 1, 4],
      note: "|A| = \u221217 \u2260 0, so the system has the unique solution (1, 2, 3)."
    },
    inconsistent: {
      label: "inconsistent system", A: [[1, 3], [2, 6]], B: [5, 8],
      note: "|A| = 0 and (adj A)B \u2260 O: the equations contradict each other, so there is no solution."
    },
    infinite: {
      label: "infinitely many solutions", A: [[1, 1], [2, 2]], B: [2, 4],
      note: "|A| = 0 and (adj A)B = O: the two equations describe the same line, so there are infinitely many solutions."
    },
    consistent3: {
      label: "3 \u00d7 3 with fractions", A: [[5, -1, 4], [2, 3, 5], [5, -2, 6]], B: [5, 2, -1],
      note: "|A| = 51 \u2260 0, so the solution (3, 2, \u22122) is unique."
    }
  };
  var st = {preset: "unique2"};

  function det2(A){ return A[0][0] * A[1][1] - A[0][1] * A[1][0]; }
  function det3(A){ return A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]); }

  function adj2(A){ return [[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]]; }
  function adj3(A){
    var Cm = [], i, j;
    for(i = 0; i < 3; i += 1){
      Cm.push([]);
      for(j = 0; j < 3; j += 1){
        var sub = [];
        for(var a = 0; a < 3; a += 1){
          if(a === i) continue;
          var row = [];
          for(var b = 0; b < 3; b += 1){ if(b !== j) row.push(A[a][b]); }
          sub.push(row);
        }
        Cm[i].push(((i + j) % 2 ? -1 : 1) * det2(sub));
      }
    }
    return mT(Cm);
  }
  function mT(M){ return M[0].map(function(_, j){ return M.map(function(row){ return row[j]; }); }); }

  function solve2(A, B){
    var D = det2(A);
    return [(B[0] * A[1][1] - A[0][1] * B[1]) / D, (A[0][0] * B[1] - B[0] * A[1][0]) / D];
  }
  function solve3(A, B){
    var D = det3(A), out = [], k;
    for(k = 0; k < 3; k += 1){
      var Ak = A.map(function(row){ return row.slice(); });
      for(var i = 0; i < 3; i += 1) Ak[i][k] = B[i];
      out.push(det3(Ak) / D);
    }
    return out;
  }

  function draw(){
    var c = CASES[st.preset], A = c.A, B = c.B, n = A.length;
    var D = n === 2 ? det2(A) : det3(A);
    var adj = n === 2 ? adj2(A) : adj3(A);
    var adjB = adj.map(function(row){ return row.reduce(function(s, v, i){ return s + v * B[i]; }, 0); });
    var zero = adjB.every(function(v){ return Math.abs(v) < 1e-9; });
    var sol = null;
    if(Math.abs(D) > 1e-9) sol = n === 2 ? solve2(A, B) : solve3(A, B);
    var s = "";
    s += L.text(140, 44, "A", {size: 20, color: "#93c5fd", weight: 700});
    s += grid(90, 62, A, {cellW: n === 2 ? 54 : 50, cellH: 42, size: 16});
    s += L.text(300, 130, "\u00b7", {size: 30, color: C.text});
    s += L.text(345, 44, "X", {size: 20, color: "#fbbf24", weight: 700});
    var Xcol = [];
    for(var i = 0; i < n; i += 1) Xcol.push(["x" + SUB[i + 1]]);
    s += grid(315, 62, Xcol, {cellW: 50, cellH: 42, size: 16, hiFill: "rgba(251,191,36,.15)"});
    s += L.text(430, 130, "=", {size: 30, color: C.text});
    var Bcol = [];
    for(i = 0; i < n; i += 1) Bcol.push([B[i]]);
    s += grid(465, 62, Bcol, {cellW: 50, cellH: 42, size: 16});
    s += L.text(590, 44, "|A| = " + mFmt(D), {size: 18, color: Math.abs(D) < 1e-9 ? C.danger : C.ok, weight: 700});
    var line;
    if(sol) line = "X = A\u207b\u00b9B = (" + (n === 2 ? "x" : "x") + ", y" + (n === 3 ? ", z" : "") + ") = (" + sol.map(mFmt).join(", ") + ")";
    else line = zero ? "infinitely many solutions (equations coincide)" : "no solution (equations contradict)";
    s += L.text(360, 250, line, {size: 17, color: sol ? C.ok : (zero ? "#fbbf24" : C.danger), weight: 700});
    L.svg(s, "Matrix system " + c.label + " with determinant " + mFmt(D) + ".", 300);
    var cells = [
      ["System", c.label],
      ["|A|", mFmt(D), Math.abs(D) < 1e-9 ? C.danger : C.ok],
      ["(adj A)B", "[" + adjB.map(mFmt).join(", ") + "]", zero ? C.muted : C.danger]
    ];
    if(sol) cells.push(["Solution", "(x, y" + (n === 3 ? ", z" : "") + ") = (" + sol.map(mFmt).join(", ") + ")", C.ok]);
    else cells.push(["Status", zero ? "infinitely many solutions" : "no solution", zero ? "#fbbf24" : C.danger]);
    L.readout(cells);
    L.verdict("<b>" + c.label + ".</b> " + c.note);
  }

  function select(id){ st.preset = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["unique2", "2 \u00d7 2 unique"], ["unique3", "3 \u00d7 3 unique"], ["infinite", "infinite solutions"], ["inconsistent", "inconsistent"], ["consistent3", "3 \u00d7 3 fractions"]], st.preset, select);
    L.legend([["#93c5fd", "coefficient matrix A"], ["#fbbf24", "unknowns X"], [C.ok, "solution"]]);
    L.watch("Choose a system. The bench writes AX = B, evaluates |A| and (adj A)B, and reports a unique solution, infinitely many solutions or none.");
    draw();
  }

  window.SIMS.systemmatrix = {mount: mount, draw: draw, select: select, state: st};
})();
