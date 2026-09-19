// Class 12 Mathematics, Chapter 13 (lemh207) — simulation labs.
// One tailored lab per lesson, built on the shared window.LAB helpers.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// Reduce a fraction of non-negative integers and render it as "a/b" (or "a").
function gcd(a, b){
  a = Math.abs(a); b = Math.abs(b);
  while(b){ var t = a % b; a = b; b = t; }
  return a || 1;
}
function frac(n, d){
  if(d < 0){ n = -n; d = -d; }
  if(n === 0) return "0";
  var g = gcd(n, d);
  n = n / g; d = d / g;
  return d === 1 ? String(n) : n + "/" + d;
}
// "4/7 ≈ 0.5714" — both forms present so every reader can check the value.
function ratio(n, d){
  return frac(n, d) + " \u2248 " + LAB.num(n / d, 4);
}
function pct(n, d){
  return LAB.num(100 * n / d, 1) + "%";
}
// Fraction arithmetic on [num, den] pairs.
function mulF(a, b){ return [a[0] * b[0], a[1] * b[1]]; }
function addF(a, b){ return [a[0] * b[1] + b[0] * a[1], a[1] * b[1]]; }

// -------------------------------------------------------------------------
// Lab 1 — Conditional probability explorer (NCERT §13.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var INIT = {preset: "cards"};
  var st = {preset: INIT.preset};

  function cardsOutcomes(){
    var out = [];
    for(var i = 1; i <= 10; i += 1) out.push({label: String(i), w: 1, f: i > 3, e: i % 2 === 0});
    return out;
  }
  function diceOutcomes(){
    var out = [];
    for(var r = 1; r <= 6; r += 1){
      for(var c = 1; c <= 6; c += 1) out.push({label: r + "," + c, w: 1, f: (r + c) === 6, e: (r === 4 || c === 4)});
    }
    return out;
  }
  function familyOutcomes(){
    return ["BB", "BG", "GB", "GG"].map(function(s){
      return {label: s, w: 1, f: s.indexOf("B") >= 0, e: s === "BB"};
    });
  }
  // This branch is not equally likely: HH and HT each carry 1/4 while every
  // (T, i) carries 1/12, so the weights use the common denominator 12.
  function coindieOutcomes(){
    var out = [{label: "HH", w: 3, f: false, e: false}, {label: "HT", w: 3, f: true, e: false}];
    for(var i = 1; i <= 6; i += 1) out.push({label: "T" + i, w: 1, f: true, e: i > 4});
    return out;
  }

  var SCEN = {
    cards: {
      label: "10 cards numbered 1\u201310",
      cond: "F: card > 3", ev: "E: card is even",
      outcomes: cardsOutcomes(), cols: 5, cw: 66, ch: 58, fs: 16, y: 84, showW: false,
      verdict: "Only cards 4\u201310 survive the condition. Among those seven equally likely cards, the four even ones (4, 6, 8, 10) give P(E|F) = 4/7."
    },
    dice: {
      label: "Two dice: 36 ordered outcomes",
      cond: "F: sum = 6", ev: "E: at least one 4",
      outcomes: diceOutcomes(), cols: 6, cw: 50, ch: 32, fs: 11, y: 52, showW: false,
      verdict: "The condition keeps the five pairs that sum to 6. Two of them, (2, 4) and (4, 2), contain a 4, so P(E|F) = 2/5."
    },
    family: {
      label: "Two children: BB, BG, GB, GG",
      cond: "F: at least one boy", ev: "E: both are boys",
      outcomes: familyOutcomes(), cols: 2, cw: 110, ch: 66, fs: 20, y: 66, showW: false,
      verdict: "At least one boy leaves BB, BG and GB, all equally likely. Only BB gives two boys, so P(E|F) = 1/3 \u2014 not 1/2."
    },
    coindie: {
      label: "Coin, then die if tail",
      cond: "F: at least one tail", ev: "E: die shows > 4",
      outcomes: coindieOutcomes(), cols: 4, cw: 96, ch: 62, fs: 15, y: 74, showW: true,
      verdict: "The outcomes are not equally likely: HH and HT each have probability 3/12, while each (T, i) has 1/12. The tail branch sums to 9/12 and reaches T5, T6 with probability 2/12, so P(E|F) = 2/9."
    }
  };

  function counts(s){
    var wF = 0, wEF = 0, wAll = 0;
    s.outcomes.forEach(function(o){
      var w = o.w || 1;
      wAll += w;
      if(o.f) wF += w;
      if(o.f && o.e) wEF += w;
    });
    return {wF: wF, wEF: wEF, wAll: wAll};
  }

  function drawGrid(s){
    var m = "";
    var rows = Math.ceil(s.outcomes.length / s.cols);
    var x0 = (720 - s.cols * s.cw) / 2;
    s.outcomes.forEach(function(o, i){
      var r = Math.floor(i / s.cols), c = i % s.cols;
      var x = x0 + c * s.cw, y = s.y + r * s.ch;
      var fill, stroke;
      if(o.f && o.e){ fill = "rgba(52,211,153,.35)"; stroke = "#34d399"; }
      else if(o.f){ fill = "rgba(56,189,248,.22)"; stroke = "#38bdf8"; }
      else if(o.e){ fill = "rgba(244,114,182,.22)"; stroke = "#f472b6"; }
      else { fill = "#132033"; stroke = "#334155"; }
      m += L.rect(x + 3, y + 3, s.cw - 6, s.ch - 6, fill, ' rx="6" stroke="' + stroke + '" stroke-width="1.6"');
      m += L.text(x + s.cw / 2, y + s.ch / 2 + s.fs * 0.36, o.label, {size: s.fs, color: o.f && o.e ? "#d1fae5" : C.text});
      if(s.showW) m += L.text(x + s.cw / 2, y + s.ch - 7, "w = " + frac(o.w || 1, 12), {size: 10, color: C.muted});
    });
    m += L.text(360, 30, s.label, {size: 17, weight: 700, color: C.text});
    m += L.text(360, 52, s.cond + "   \u00b7   " + s.ev, {size: 13, color: C.muted});
    return m;
  }

  function draw(t){
    if(t === 0) st.preset = INIT.preset;
    var s = SCEN[st.preset];
    var c = counts(s);
    var m = drawGrid(s);
    m += L.text(360, 282, "P(E|F) = P(E \u2229 F) / P(F) = " + frac(c.wEF, c.wAll) + " / " + frac(c.wF, c.wAll) + " = " + frac(c.wEF, c.wF), {size: 17, weight: 700, color: C.ok});
    L.svg(m, "Conditional probability grid: " + s.label, 300);
    L.readout([
      ["Scenario", s.label],
      ["Condition F", s.cond + "  (P = " + frac(c.wF, c.wAll) + ")"],
      ["Overlap E \u2229 F", s.ev + "  (P = " + frac(c.wEF, c.wAll) + ")", "#34d399"],
      ["P(E|F)", ratio(c.wEF, c.wF), C.ok]
    ]);
    L.verdict("<b>P(E|F) = P(E \u2229 F)/P(F) = " + frac(c.wEF, c.wF) + ".</b> " + s.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([
      ["cards", "10 cards"],
      ["dice", "Two dice"],
      ["family", "Two children"],
      ["coindie", "Coin then die"]
    ], st.preset, select);
    L.legend([
      ["#38bdf8", "condition F only"],
      ["#34d399", "E \u2229 F (favourable)"],
      ["#f472b6", "E only"],
      ["#334155", "outside both"]
    ]);
    L.watch("Switch scenarios. Blue cells are in the condition, pink cells are in the event, and green cells are in both. The conditional probability counts the green cells inside the blue sample space.");
    draw();
  }

  window.SIMS.condprob = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Multiplication bench (NCERT §13.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var INIT = {preset: "urn"};
  var st = {preset: INIT.preset};

  var SCEN = {
    urn: {
      label: "Urn: 10 black, 5 white; 2 drawn without replacement",
      factors: [[10, 15], [9, 14]],
      labels: ["P(black\u2081)", "P(black\u2082 | black\u2081)"],
      joint: "P(both black)",
      verdict: "After one black ball is removed, only 9 of the 14 remaining balls are black. The path probability is the product."
    },
    twored: {
      label: "52 cards: 2 drawn without replacement",
      factors: [[26, 52], [25, 51]],
      labels: ["P(red\u2081)", "P(red\u2082 | red\u2081)"],
      joint: "P(both red)",
      verdict: "Half the pack is red; once a red card is gone, 25 red cards remain among 51."
    },
    redblack: {
      label: "52 cards: red first, then black",
      factors: [[26, 52], [26, 51]],
      labels: ["P(red\u2081)", "P(black\u2082 | red\u2081)"],
      joint: "P(red then black)",
      verdict: "Removing a red card leaves all 26 black cards, but only 51 cards in total."
    },
    kka: {
      label: "Three cards: king, king, ace",
      factors: [[4, 52], [3, 51], [4, 50]],
      labels: ["P(K)", "P(K | K)", "P(A | KK)"],
      joint: "P(KKA)",
      verdict: "Each draw changes the pack: 4 kings in 52, then 3 kings in 51, then 4 aces in the remaining 50."
    }
  };

  function product(s){
    var p = [1, 1];
    s.factors.forEach(function(f){ p = mulF(p, f); });
    return p;
  }

  function draw(t){
    if(t === 0) st.preset = INIT.preset;
    var s = SCEN[st.preset];
    var p = product(s);
    var n = s.factors.length;
    var step = n >= 3 ? 150 : 220;
    var x0 = n >= 3 ? 110 : 150;
    var m = "";
    var i;
    for(i = 0; i < n; i += 1){
      var x = x0 + i * step;
      var nx = x + step;
      var y = 150;
      m += L.circle(x, y, 20, "#132033", ' stroke="#38bdf8" stroke-width="2"');
      m += L.text(x, y + 5, String(i + 1), {size: 14, color: C.text});
      if(i < n){
        m += L.arrow(x + 22, y - 6, nx - 22, y - 6, "#34d399", 3);
        m += L.text((x + nx) / 2, y - 18, frac(s.factors[i][0], s.factors[i][1]), {size: 15, color: "#34d399", weight: 700});
        m += L.line(x + 22, y + 6, (x + nx) / 2, 240, C.faint, 2, "4 4");
        m += L.text((x + nx) / 2, 258, frac(s.factors[i][1] - s.factors[i][0], s.factors[i][1]), {size: 12, color: C.muted});
      }
    }
    var xe = x0 + n * step;
    m += L.circle(xe, 150, 22, "rgba(52,211,153,.25)", ' stroke="#34d399" stroke-width="2.4"');
    m += L.text(xe, 145, frac(p[0], p[1]), {size: 15, color: C.ok, weight: 700});
    m += L.text(xe, 165, s.joint, {size: 11, color: C.muted});
    m += L.text(360, 40, s.label, {size: 17, weight: 700, color: C.text});
    m += L.text(360, 68, "green branches multiply along the path", {size: 13, color: C.muted});
    L.svg(m, "Multiplication-rule tree for " + s.label, 300);
    var cells = [["Scenario", s.label]];
    s.factors.forEach(function(f, fi){ cells.push([s.labels[fi], frac(f[0], f[1]) + " \u2248 " + L.num(f[0] / f[1], 4)]); });
    cells.push([s.joint, ratio(p[0], p[1]), C.ok]);
    L.readout(cells);
    var chain = s.factors.map(function(f){ return "(" + f[0] + "/" + f[1] + ")"; }).join(" \u00d7 ");
    L.verdict("<b>P(A \u2229 B) = P(A) \u00b7 P(B|A).</b> Here " + chain + " = " + frac(p[0], p[1]) + " \u2248 " + L.num(p[0] / p[1], 4) + ". " + s.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([
      ["urn", "Urn: two black"],
      ["twored", "Two red cards"],
      ["redblack", "Red then black"],
      ["kka", "King, king, ace"]
    ], st.preset, select);
    L.legend([
      ["#34d399", "path followed"],
      ["#475569", "other branch"]
    ]);
    L.watch("Follow the green path from left to right. Each green branch shows its conditional probability; multiplying them gives the probability of the whole path.");
    draw();
  }

  window.SIMS.multbench = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Independence tester (NCERT §13.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var INIT = {preset: "coindie"};
  var st = {preset: INIT.preset};

  var SCEN = {
    coindie: {
      label: "Coin head and die showing 3",
      aName: "A: head", bName: "B: face 3",
      pA: [1, 2], pB: [1, 6], joint: [1, 12], prod: [1, 12],
      note: "The two experiments do not influence each other, so the product rule holds exactly."
    },
    dieevenred: {
      label: "Die: even and red faces {1,2,3}",
      aName: "A: even", bName: "B: red",
      pA: [1, 2], pB: [1, 2], joint: [1, 6], prod: [1, 4],
      note: "Knowing the face is red removes 4 and 6, so P(even) drops from 1/2 to 1/3: dependent."
    },
    cards: {
      label: "Card drawn: spade and ace",
      aName: "A: spade", bName: "B: ace",
      pA: [1, 4], pB: [1, 13], joint: [1, 52], prod: [1, 52],
      note: "P(ace | spade) = 1/13 = P(ace): the suit carries no information about being an ace."
    },
    kingqueen: {
      label: "Card drawn: king-or-queen and queen-or-jack",
      aName: "A: king or queen", bName: "B: queen or jack",
      pA: [2, 13], pB: [2, 13], joint: [1, 13], prod: [4, 169],
      note: "Both events contain queens, so they overlap: P(A \u2229 B) = 1/13 while P(A)P(B) = 4/169."
    }
  };

  function sameF(a, b){ return a[0] * b[1] === b[0] * a[1]; }

  function draw(t){
    if(t === 0) st.preset = INIT.preset;
    var s = SCEN[st.preset];
    var indep = sameF(s.joint, s.prod);
    var m = "";
    m += '<ellipse cx="250" cy="132" rx="128" ry="78" fill="rgba(56,189,248,.13)" stroke="#38bdf8" stroke-width="2"/>';
    m += '<ellipse cx="470" cy="132" rx="128" ry="78" fill="rgba(244,114,182,.13)" stroke="#f472b6" stroke-width="2"/>';
    m += '<path d="M360 74 A 128 78 0 0 1 360 190 A 128 78 0 0 1 360 74 Z" fill="rgba(52,211,153,.25)" stroke="#34d399" stroke-width="1.8"/>';
    m += L.text(190, 70, s.aName, {size: 15, color: "#7dd3fc", weight: 700});
    m += L.text(530, 70, s.bName, {size: 15, color: "#f9a8d4", weight: 700});
    m += L.text(360, 137, "P(A \u2229 B) = " + frac(s.joint[0], s.joint[1]), {size: 13, color: C.ok, weight: 700});
    m += L.text(360, 42, s.label, {size: 17, weight: 700, color: C.text});
    // comparison bars
    var scale = 170 / (s.prod[0] / s.prod[1]);
    var wP = Math.max(3, (s.prod[0] / s.prod[1]) * scale);
    var wJ = Math.max(3, (s.joint[0] / s.joint[1]) * scale);
    m += L.text(100, 236, "P(A)\u00b7P(B)", {size: 12, color: C.muted, anchor: "end"});
    m += L.rect(110, 224, wP, 16, "rgba(56,189,248,.55)", ' rx="4"');
    m += L.text(110 + wP + 8, 237, frac(s.prod[0], s.prod[1]), {size: 12, color: "#7dd3fc", anchor: "start"});
    m += L.text(100, 268, "P(A \u2229 B)", {size: 12, color: C.muted, anchor: "end"});
    m += L.rect(110, 256, wJ, 16, "rgba(52,211,153,.55)", ' rx="4"');
    m += L.text(110 + wJ + 8, 269, frac(s.joint[0], s.joint[1]), {size: 12, color: C.ok, anchor: "start"});
    m += L.text(430, 250, indep ? "=  \u2192 independent" : "\u2260  \u2192 dependent", {size: 20, color: indep ? C.ok : C.danger, weight: 700});
    L.svg(m, "Independence bench for " + s.label, 300);
    L.readout([
      ["Scenario", s.label],
      ["P(A) \u00b7 P(B)", ratio(s.prod[0], s.prod[1]), "#7dd3fc"],
      ["P(A \u2229 B)", ratio(s.joint[0], s.joint[1]), "#34d399"],
      ["Test", indep ? "Independent (product = joint)" : "Dependent (product \u2260 joint)", indep ? C.ok : C.danger]
    ]);
    L.verdict("<b>" + (indep ? "Independent." : "Dependent.") + "</b> P(A)\u00b7P(B) = " + frac(s.prod[0], s.prod[1]) + " and P(A \u2229 B) = " + frac(s.joint[0], s.joint[1]) + ". " + s.note);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([
      ["coindie", "Coin & die"],
      ["dieevenred", "Die even & red"],
      ["cards", "Spade & ace"],
      ["kingqueen", "King/queen & queen/jack"]
    ], st.preset, select);
    L.legend([
      ["#38bdf8", "event A"],
      ["#f472b6", "event B"],
      ["#34d399", "A \u2229 B"]
    ]);
    L.watch("Compare the two bars: the product P(A)\u00b7P(B) against the joint P(A \u2229 B). A match means independence; a mismatch means dependence.");
    draw();
  }

  window.SIMS.indep = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Theorem of total probability (NCERT §13.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var INIT = {preset: "machines"};
  var st = {preset: INIT.preset};

  var SCEN = {
    machines: {
      label: "Defective bolt from three machines",
      event: "A: bolt is defective",
      mode: "dec",
      cases: [
        {name: "Machine A", prior: [1, 4], like: [1, 20]},
        {name: "Machine B", prior: [7, 20], like: [1, 25]},
        {name: "Machine C", prior: [2, 5], like: [1, 50]}
      ],
      note: "Machine A dominates production but has the highest defect rate; the weighted sum 0.0345 blends all three lines."
    },
    commute: {
      label: "The doctor arrives late",
      event: "A: doctor is late",
      mode: "frac",
      cases: [
        {name: "Train", prior: [3, 10], like: [1, 4]},
        {name: "Bus", prior: [1, 5], like: [1, 3]},
        {name: "Scooter", prior: [1, 10], like: [1, 12]},
        {name: "Other", prior: [2, 5], like: [0, 1]}
      ],
      note: "Only the first three transport modes can make the doctor late; the fourth branch contributes zero."
    },
    strike: {
      label: "Construction job finished on time",
      event: "A: job finished on time",
      mode: "dec",
      cases: [
        {name: "Strike", prior: [13, 20], like: [8, 25]},
        {name: "No strike", prior: [7, 20], like: [4, 5]}
      ],
      note: "The no-strike branch is less likely but much more likely to finish on time, and together they give 0.488."
    },
    twobags: {
      label: "Red ball from one of two bags",
      event: "A: ball drawn is red",
      mode: "frac",
      cases: [
        {name: "Bag I (3R 4B)", prior: [1, 2], like: [3, 7]},
        {name: "Bag II (5R 6B)", prior: [1, 2], like: [5, 11]}
      ],
      note: "Equal priors, different red fractions: 3/14 + 5/22 = 34/77."
    }
  };

  function contribution(c){ return mulF(c.prior, c.like); }

  function draw(t){
    if(t === 0) st.preset = INIT.preset;
    var s = SCEN[st.preset];
    var total = [0, 1];
    s.cases.forEach(function(c){ total = addF(total, contribution(c)); });
    var m = "";
    m += L.text(360, 34, s.label, {size: 17, weight: 700, color: C.text});
    m += L.text(360, 58, s.event + " \u2014 split into disjoint cases", {size: 13, color: C.muted});
    var x = 90;
    var maxContrib = 0;
    s.cases.forEach(function(c){
      var v = contribution(c)[0] / contribution(c)[1];
      if(v > maxContrib) maxContrib = v;
    });
    var cScale = maxContrib > 0 ? 250 / maxContrib : 1;
    s.cases.forEach(function(c, i){
      var prior = c.prior[0] / c.prior[1];
      var w = prior * 540;
      m += L.rect(x, 78, w - 4, 26, i % 2 === 0 ? "rgba(56,189,248,.35)" : "rgba(244,114,182,.30)", ' rx="5" stroke="' + (i % 2 === 0 ? "#38bdf8" : "#f472b6") + '" stroke-width="1.4"');
      m += L.text(x + (w - 4) / 2, 95, c.name, {size: 11, color: C.text});
      m += L.text(x + (w - 4) / 2, 118, "prior " + frac(c.prior[0], c.prior[1]), {size: 10, color: C.muted});
      var cf = contribution(c);
      var cv = cf[0] / cf[1];
      var wc = cv * cScale;
      m += L.rect(x, 156, wc, 18, "rgba(52,211,153,.55)", ' rx="4"');
      m += L.text(x, 188, "P(E\u1d62)P(A|E\u1d62) = " + (s.mode === "frac" ? frac(cf[0], cf[1]) : L.num(cv, 4)), {size: 10, color: C.muted, anchor: "start"});
      x += w;
    });
    var tv = total[0] / total[1];
    m += L.rect(90, 214, Math.min(540, tv * cScale), 24, "rgba(52,211,153,.35)", ' rx="5" stroke="#34d399" stroke-width="2"');
    m += L.text(360, 262, "P(A) = \u03a3 P(E\u1d62)P(A|E\u1d62) = " + (s.mode === "frac" ? ratio(total[0], total[1]) : L.num(tv, 4)), {size: 16, weight: 700, color: C.ok});
    L.svg(m, "Total-probability partition for " + s.label, 300);
    var cells = [["Scenario", s.label]];
    s.cases.forEach(function(c){
      var cf = contribution(c);
      cells.push([c.name + " \u00b7 P(A|E\u1d62)", frac(c.like[0], c.like[1]) + " \u2192 " + (s.mode === "frac" ? frac(cf[0], cf[1]) : L.num(cf[0] / cf[1], 4))]);
    });
    cells.push(["P(A)", s.mode === "frac" ? ratio(total[0], total[1]) : L.num(tv, 4), C.ok]);
    cells.push(["Partition check", "\u03a3 P(E\u1d62) = 1.0000", C.muted]);
    L.readout(cells);
    L.verdict("<b>The branches that reach A add up.</b> " + s.note);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([
      ["machines", "Three machines"],
      ["commute", "Doctor's transport"],
      ["strike", "Strike or no strike"],
      ["twobags", "Two bags"]
    ], st.preset, select);
    L.legend([
      ["#38bdf8", "case E\u1d62"],
      ["#f472b6", "another case"],
      ["#34d399", "contribution to A"]
    ]);
    L.watch("The top bar is the partition: each case takes a share of the sample space. Each green bar below is that case's prior times its conditional probability. Adding the green bars gives P(A).");
    draw();
  }

  window.SIMS.totalprob = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Bayes updater (NCERT §13.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var INIT = {preset: "machinesB"};
  var st = {preset: INIT.preset};

  var SCEN = {
    machinesB: {
      label: "Which machine made the defective bolt?",
      target: 1,
      hypotheses: [
        {name: "Machine A", prior: [1, 4], like: [1, 20]},
        {name: "Machine B", prior: [7, 20], like: [1, 25]},
        {name: "Machine C", prior: [2, 5], like: [1, 50]}
      ],
      mode: "dec",
      note: "Defective branch weights: 0.0125, 0.0140 and 0.0080. The posterior for B is 0.0140/0.0345 = 28/69."
    },
    hiv: {
      label: "HIV test reports positive",
      target: 0,
      hypotheses: [
        {name: "Has HIV", prior: [1, 1000], like: [9, 10]},
        {name: "No HIV", prior: [999, 1000], like: [1, 100]}
      ],
      mode: "frac",
      note: "True positives 0.0009, false positives 0.00999. The posterior for HIV is 10/121 \u2248 0.083, far below the test's 90% sensitivity."
    },
    bags: {
      label: "Red ball came from which bag?",
      target: 1,
      hypotheses: [
        {name: "Bag I (3R 4B)", prior: [1, 2], like: [3, 7]},
        {name: "Bag II (5R 6B)", prior: [1, 2], like: [5, 11]}
      ],
      mode: "frac",
      note: "Branch weights 3/14 and 5/22; the posterior for Bag II is (5/22)/(34/77) = 35/68."
    },
    doctor: {
      label: "The doctor arrived late by train?",
      target: 0,
      hypotheses: [
        {name: "Train", prior: [3, 10], like: [1, 4]},
        {name: "Bus", prior: [1, 5], like: [1, 3]},
        {name: "Scooter", prior: [1, 10], like: [1, 12]},
        {name: "Other", prior: [2, 5], like: [0, 1]}
      ],
      mode: "frac",
      note: "The train branch contributes 3/40 out of the total late probability 3/20, giving posterior 1/2."
    }
  };

  function branch(h){ return mulF(h.prior, h.like); }

  function draw(t){
    if(t === 0) st.preset = INIT.preset;
    var s = SCEN[st.preset];
    var total = [0, 1];
    s.hypotheses.forEach(function(h){ total = addF(total, branch(h)); });
    var m = "";
    m += L.text(360, 32, s.label, {size: 17, weight: 700, color: C.text});
    m += L.text(360, 54, "posterior = branch \u00d7 likelihood / total evidence", {size: 12, color: C.muted});
    var n = s.hypotheses.length;
    var y0 = 96, gap = Math.min(46, 150 / n);
    var target = s.hypotheses[s.target];
    var tb = branch(target);
    var tv = tb[0] / tb[1];
    var totalV = total[0] / total[1];
    var post = tv / totalV;
    s.hypotheses.forEach(function(h, i){
      var y = y0 + i * gap;
      var hb = branch(h);
      var isT = i === s.target;
      m += L.circle(120, y, 12, isT ? "rgba(52,211,153,.35)" : "#132033", ' stroke="' + (isT ? "#34d399" : "#475569") + '" stroke-width="2"');
      m += L.text(120, y + 4, "E" + (i + 1), {size: 11, color: isT ? C.ok : C.muted});
      m += L.arrow(136, y, 320, y, isT ? "#34d399" : "#475569", isT ? 3 : 2);
      m += L.text(228, y - 8, "prior " + frac(h.prior[0], h.prior[1]), {size: 11, color: C.muted});
      m += L.text(228, y + 14, "P(A|E" + (i + 1) + ") = " + frac(h.like[0], h.like[1]), {size: 11, color: "#7dd3fc"});
      m += L.circle(360, y, 12, isT ? "rgba(52,211,153,.35)" : "#132033", ' stroke="' + (isT ? "#34d399" : "#475569") + '" stroke-width="2"');
      m += L.text(360, y + 4, s.mode === "frac" ? frac(hb[0], hb[1]) : L.num(hb[0] / hb[1], 3), {size: 10, color: isT ? C.ok : C.muted});
      m += L.arrow(374, y, 560, y, isT ? "#34d399" : "#475569", isT ? 3 : 2);
    });
    m += L.rect(560, 90, 110, 34, "rgba(52,211,153,.25)", ' rx="6" stroke="#34d399" stroke-width="2"');
    m += L.text(615, 111, "P = " + L.num(post, 4), {size: 15, color: C.ok, weight: 700});
    m += L.text(615, 145, "P(A) = " + (s.mode === "frac" ? frac(total[0], total[1]) : L.num(totalV, 4)), {size: 11, color: C.muted});
    m += L.text(360, 250, "P(E" + (s.target + 1) + "|A) = P(E" + (s.target + 1) + ")P(A|E" + (s.target + 1) + ") / P(A) = " + (s.mode === "frac" ? frac(tb[0], tb[1]) : L.num(tv, 4)) + " / " + (s.mode === "frac" ? frac(total[0], total[1]) : L.num(totalV, 4)) + " = " + (s.mode === "frac" ? frac(target.prior[0] * target.like[0] * total[1], target.prior[1] * target.like[1] * total[0]) : L.num(post, 4)), {size: 14, weight: 700, color: C.ok});
    L.svg(m, "Bayes tree for " + s.label, 300);
    L.readout([
      ["Scenario", s.label],
      ["Prior P(E" + (s.target + 1) + ")", ratio(target.prior[0], target.prior[1])],
      ["Likelihood P(A|E" + (s.target + 1) + ")", ratio(target.like[0], target.like[1])],
      ["Branch / evidence", (s.mode === "frac" ? frac(tb[0], tb[1]) : L.num(tv, 4)) + " / " + (s.mode === "frac" ? frac(total[0], total[1]) : L.num(totalV, 4)), C.muted],
      ["Posterior P(E" + (s.target + 1) + "|A)", s.mode === "frac" ? ratio(tb[0] * total[1], tb[1] * total[0]) : L.num(post, 4), C.ok]
    ]);
    L.verdict("<b>Bayes reverses the branch.</b> " + s.note);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([
      ["machinesB", "Defective bolt"],
      ["hiv", "HIV test"],
      ["bags", "Which bag?"],
      ["doctor", "Late doctor"]
    ], st.preset, select);
    L.legend([
      ["#34d399", "target hypothesis path"],
      ["#475569", "competing hypotheses"]
    ]);
    L.watch("The green path is the hypothesis we are asking about. Its branch probability divided by the total probability of the evidence is the posterior P(E\u1d62|A).");
    draw();
  }

  window.SIMS.bayestree = {mount: mount, draw: draw, select: select, state: st};
})();
