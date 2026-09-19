// Textbook data tables and graphs used by the exercises, redrawn as SVG from
// books/originals/Class12-Chemistry-Pt1_lech103.pdf (Exercises 3.8, 3.10, 3.11,
// 3.12, 3.15, 3.20, 3.21, 3.22). Drawn for the light revision page.
window.FIGURES = (function(){
  var INK = "#152637", MUTED = "#536678", LINE = "#dce4eb", SOFT = "#f7fafc",
      HEAD = "#edf2ff", ACC = "#254ad7", AMB = "#b45309", RED = "#dc2626";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  // headers: [label, ...]; rows: [[cell, ...], ...]; bold row header cells when o.rowHead.
  function table(x, y, headers, rows, w, colW, o){
    o = o || {};
    var rh = o.rowH || 26, hh = o.headH || 28;
    var total = colW.reduce(function(a, b){ return a + b; }, 0);
    var s = '<g>';
    s += '<rect x="' + x + '" y="' + y + '" width="' + total + '" height="' + (hh + rh * rows.length) + '" rx="8" fill="#fff" stroke="' + LINE + '"/>';
    var cx = x;
    headers.forEach(function(hd, i){
      s += '<rect x="' + cx + '" y="' + y + '" width="' + colW[i] + '" height="' + hh + '" fill="' + HEAD + '"/>';
      s += text(cx + colW[i] / 2, y + hh - 9, hd, {size: 12.5, weight: 700});
      if(i) s += '<line x1="' + cx + '" y1="' + y + '" x2="' + cx + '" y2="' + (y + hh + rh * rows.length) + '" stroke="' + LINE + '"/>';
      cx += colW[i];
    });
    rows.forEach(function(r, ri){
      var ry = y + hh + ri * rh;
      if(ri % 2) s += '<rect x="' + x + '" y="' + ry + '" width="' + total + '" height="' + rh + '" fill="' + SOFT + '"/>';
      s += '<line x1="' + x + '" y1="' + ry + '" x2="' + (x + total) + '" y2="' + ry + '" stroke="' + LINE + '"/>';
      var rcx = x;
      r.forEach(function(c, ci){
        s += text(rcx + colW[ci] / 2, ry + rh - 8, c, {size: 12.5, weight: (ci === 0 || o.rowHead) ? 700 : 400, color: (ci === 0 && !o.rowHead) ? INK : INK});
        rcx += colW[ci];
      });
      cx = x;
    });
    s += '</g>';
    return s;
  }

  var figs = {};
  var C = 0.023;

  figs["ex3.8"] = {
    caption: "Exercise 3.8 — pseudo-first-order run in water: [A] against t at 0, 30, 60 and 90 s (redrawn from the printed table).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 170" role="img" aria-label="Pseudo first order data table for Exercise 3.8">';
      s += table(90, 18, ["t / s", "0", "30", "60", "90"], [["[A] / mol L⁻¹", "0.55", "0.31", "0.17", "0.085"]], 0, [150, 120, 120, 120, 120], {rowHead: true});
      s += text(360, 118, "Average rate, 30–60 s: (0.31 − 0.17)/30 = 4.67 × 10⁻³ mol L⁻¹ s⁻¹", {size: 13, color: MUTED});
      s += text(360, 142, "The falling interval average is the kinetic fingerprint.", {size: 12, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["ex3.10"] = {
    caption: "Exercise 3.10 — initial rates for three runs of the reaction between A and B (redrawn from the printed table).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 170" role="img" aria-label="Initial rate data table for Exercise 3.10">';
      s += table(70, 18, ["", "Run 1", "Run 2", "Run 3"], [
        ["[A] / mol L⁻¹", "0.20", "0.20", "0.40"],
        ["[B] / mol L⁻¹", "0.30", "0.10", "0.05"],
        ["r₀ / mol L⁻¹ s⁻¹", "5.07 × 10⁻⁵", "5.07 × 10⁻⁵", "1.43 × 10⁻⁴"]
      ], 0, [170, 150, 150, 150], {rowHead: true});
      s += text(360, 150, "Runs 1 and 2: [B] changes, rate does not ⇒ order in B = 0.", {size: 12.5, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["ex3.11"] = {
    caption: "Exercise 3.11 — the four kinetic runs for 2A + B → C + D (redrawn from the printed table).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 200" role="img" aria-label="Kinetic runs table for Exercise 3.11">';
      s += table(50, 16, ["Experiment", "[A] / mol L⁻¹", "[B] / mol L⁻¹", "Initial rate of D / mol L⁻¹ min⁻¹"], [
        ["I", "0.1", "0.1", "6.0 × 10⁻³"],
        ["II", "0.3", "0.2", "7.2 × 10⁻²"],
        ["III", "0.3", "0.4", "2.88 × 10⁻¹"],
        ["IV", "0.4", "0.1", "2.40 × 10⁻²"]
      ], 0, [110, 150, 150, 260], {});
      s += text(360, 182, "Rate = k[A][B]²: order 1 in A from I→IV, order 2 in B from II→III.", {size: 12.5, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["ex3.12"] = {
    caption: "Exercise 3.12 — first-order-with-respect-to-A table with the blanks marked ? (redrawn from the printed table).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 200" role="img" aria-label="Table with blanks for Exercise 3.12">';
      s += table(50, 16, ["Experiment", "[A] / mol L⁻¹", "[B] / mol L⁻¹", "Initial rate / mol L⁻¹ min⁻¹"], [
        ["I", "0.1", "0.1", "2.0 × 10⁻²"],
        ["II", "?", "0.2", "4.0 × 10⁻²"],
        ["III", "0.4", "0.4", "?"],
        ["IV", "?", "0.2", "2.0 × 10⁻²"]
      ], 0, [110, 150, 150, 260], {});
      s += text(360, 182, "Zero order in B: the rate depends on [A] only.", {size: 12.5, color: MUTED});
      return s + '</svg>';
    }
  };

  figs["ex3.15"] = {
    caption: "Exercise 3.15 — N₂O₅ decomposition at 318 K: [N₂O₅] against t (left) and log[N₂O₅] against t (right) (redrawn from the printed data).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 320" role="img" aria-label="N2O5 concentration and log concentration graphs">';
      // Left panel
      s += '<rect x="30" y="14" width="320" height="292" rx="8" fill="#fff" stroke="' + LINE + '"/>';
      s += text(190, 38, "[N₂O₅] / 10⁻² mol L⁻¹", {size: 12.5, weight: 700});
      var L = {x: 70, y: 250, w: 250, h: 180};
      s += '<line x1="' + L.x + '" y1="' + L.y + '" x2="' + (L.x + L.w) + '" y2="' + L.y + '" stroke="' + MUTED + '"/>';
      s += '<line x1="' + L.x + '" y1="' + L.y + '" x2="' + L.x + '" y2="' + (L.y - L.h) + '" stroke="' + MUTED + '"/>';
      var T = [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200];
      var N = [1.63, 1.36, 1.14, 0.93, 0.78, 0.64, 0.53, 0.43, 0.35];
      function X(t){ return L.x + (t / 3200) * L.w; }
      function Y(c){ return L.y - (c / 1.8) * L.h; }
      var d = "";
      T.forEach(function(t, i){ d += (i ? " L" : "M") + X(t) + " " + Y(N[i]); });
      s += '<path d="' + d + '" fill="none" stroke="' + ACC + '" stroke-width="2.5"/>';
      T.forEach(function(t, i){ s += '<circle cx="' + X(t) + '" cy="' + Y(N[i]) + '" r="3.2" fill="' + ACC + '"/>'; });
      [0, 800, 1600, 2400, 3200].forEach(function(t){ s += text(X(t), L.y + 16, t, {size: 11, color: MUTED}); });
      [0.5, 1.0, 1.5].forEach(function(v){ s += text(L.x - 8, Y(v) + 4, v.toFixed(1), {size: 11, color: MUTED, anchor: "end"}); });
      s += text(L.x + L.w / 2, L.y + 34, "t / s", {size: 12, color: MUTED});
      // Right panel
      s += '<rect x="370" y="14" width="320" height="292" rx="8" fill="#fff" stroke="' + LINE + '"/>';
      s += text(530, 38, "log[N₂O₅]", {size: 12.5, weight: 700});
      var R = {x: 410, y: 250, w: 250, h: 180};
      s += '<line x1="' + R.x + '" y1="' + R.y + '" x2="' + (R.x + R.w) + '" y2="' + R.y + '" stroke="' + MUTED + '"/>';
      s += '<line x1="' + R.x + '" y1="' + R.y + '" x2="' + R.x + '" y2="' + (R.y - R.h) + '" stroke="' + MUTED + '"/>';
      var logv = N.map(function(c){ return Math.log10(c); });
      function RX(t){ return R.x + (t / 3200) * R.w; }
      function RY(l){ return R.y - ((l + 0.6) / 1.0) * R.h; }
      var d2 = "";
      T.forEach(function(t, i){ d2 += (i ? " L" : "M") + RX(t) + " " + RY(logv[i]); });
      s += '<path d="' + d2 + '" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-dasharray="5 4"/>';
      s += '<line x1="' + RX(0) + '" y1="' + RY(logv[0]) + '" x2="' + RX(3200) + '" y2="' + RY(logv[8]) + '" stroke="' + AMB + '" stroke-width="2"/>';
      T.forEach(function(t, i){ s += '<circle cx="' + RX(t) + '" cy="' + RY(logv[i]) + '" r="3.2" fill="' + ACC + '"/>'; });
      [0, 800, 1600, 2400, 3200].forEach(function(t){ s += text(RX(t), R.y + 16, t, {size: 11, color: MUTED}); });
      [-0.4, 0.0].forEach(function(v){ s += text(R.x - 8, RY(v) + 4, v.toFixed(1), {size: 11, color: MUTED, anchor: "end"}); });
      s += text(R.x + R.w / 2, R.y + 34, "t / s", {size: 12, color: MUTED});
      s += text(R.x + R.w / 2, R.y - R.h - 8, "straight line ⇒ first order, slope = −k/2.303", {size: 11.5, color: MUTED});
      s += text(360, 302, "k ≈ 4.7 × 10⁻⁴ s⁻¹, t₁/₂ ≈ 1.5 × 10³ s", {size: 12.5, color: AMB, weight: 700});
      return s + '</svg>';
    }
  };

  figs["ex3.20"] = {
    caption: "Exercise 3.20 — azoisopropane decomposition at 543 K: total pressure at t = 0, 360 and 720 s (redrawn from the printed table).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 170" role="img" aria-label="Azoisopropane pressure data table">';
      s += table(120, 18, ["t / s", "0", "360", "720"], [["P / mm of Hg", "35.0", "54.0", "63.0"]], 0, [140, 130, 130, 130], {rowHead: true});
      s += text(360, 120, "A → B + C, so pA = 2pi − ptotal = 70.0 − ptotal.", {size: 12.5, color: MUTED});
      s += text(360, 146, "k(360 s) = 2.17 × 10⁻³ s⁻¹; k(720 s) = 2.24 × 10⁻³ s⁻¹.", {size: 12.5, color: AMB, weight: 700});
      return s + '</svg>';
    }
  };

  figs["ex3.21"] = {
    caption: "Exercise 3.21 — SO₂Cl₂ decomposition at constant volume: total pressure at t = 0 and 100 s (redrawn from the printed table).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 170" role="img" aria-label="SO2Cl2 pressure data table">';
      s += table(140, 18, ["Experiment", "Time / s", "Total pressure / atm"], [
        ["1", "0", "0.5"],
        ["2", "100", "0.6"]
      ], 0, [140, 140, 200], {});
      s += text(360, 140, "k = (2.303/100) log(0.50/0.40) = 2.23 × 10⁻³ s⁻¹; rate at 0.65 atm = 7.8 × 10⁻⁴ atm s⁻¹.", {size: 12.5, color: AMB, weight: 700});
      return s + '</svg>';
    }
  };

  figs["ex3.22"] = {
    caption: "Exercise 3.22 — rate constants for N₂O₅ decomposition at 0, 20, 40, 60 and 80 °C (redrawn from the printed table).",
    svg: function(){
      var s = '<svg viewBox="0 0 720 200" role="img" aria-label="Rate constant versus temperature table">';
      s += table(50, 16, ["T / °C", "0", "20", "40", "60", "80"], [["10⁵ × k / s⁻¹", "0.0787", "1.70", "25.7", "178", "2140"]], 0, [140, 96, 96, 96, 96, 96], {rowHead: true});
      s += '<line x1="80" y1="128" x2="640" y2="128" stroke="' + LINE + '"/>';
      var X = [120, 200, 290, 430, 570];
      var labels = ["0", "20", "40", "60", "80"];
      labels.forEach(function(lb, i){ s += text(X[i], 152, lb + " °C", {size: 11, color: MUTED}); });
      s += text(360, 152, "ln k vs 1/T is a straight line: slope = −Ea/R, intercept = ln A", {size: 12, color: MUTED});
      s += text(360, 180, "Least-squares fit: Ea ≈ 1.0 × 10² kJ mol⁻¹, A ≈ 1.5 × 10¹³ s⁻¹", {size: 12.5, color: AMB, weight: 700});
      return s + '</svg>';
    }
  };

  return figs;
})();
