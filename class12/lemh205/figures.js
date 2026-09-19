// Textbook figures for lemh205 (Three Dimensional Geometry), redrawn as SVG from the
// vector diagrams in books/originals/Class12-Maths-Pt2_lemh205.pdf (Figs 11.2, 11.6, 11.7).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", BLUE = "#60a5fa", AMBER = "#f59e0b", GREEN = "#34d399", FAINT = "#475569";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }
  function line(x1, y1, x2, y2, c, w, dash){
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + (w || 2) + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/>';
  }
  function dot(x, y, c, r){
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 4) + '" fill="' + (c || INK) + '"/>';
  }

  var figs = {};

  figs["11.2"] = {
    caption: "Fig. 11.2 — Direction cosines of the line joining P(x₁, y₁, z₁) and Q(x₂, y₂, z₂), with direction angles α, β and γ (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Line through two points showing direction angles">';
      s += line(60, 205, 330, 205, FAINT, 2) + text(342, 210, "x", { color: MUTED });
      s += line(60, 205, 60, 35, FAINT, 2) + text(60, 25, "z", { color: MUTED });
      s += line(60, 205, 150, 245, FAINT, 2) + text(160, 252, "y", { color: MUTED });
      s += line(90, 190, 300, 70, BLUE, 3);
      s += '<polygon points="300,70 286,74 290,84" fill="' + BLUE + '"/>';
      s += dot(90, 190, AMBER, 5) + text(78, 214, "P", { color: AMBER, anchor: "end" });
      s += dot(300, 70, AMBER, 5) + text(312, 64, "Q", { color: AMBER, anchor: "start" });
      s += line(300, 70, 300, 205, MUTED, 1.5, "5 4");
      s += line(90, 190, 300, 190, MUTED, 1.5, "5 4");
      s += text(195, 178, "x₂ − x₁", { color: MUTED });
      s += text(312, 145, "z₂ − z₁", { color: MUTED, anchor: "start" });
      s += text(140, 138, "line PQ", { color: BLUE });
      s += text(190, 40, "direction ratios (x₂−x₁, y₂−y₁, z₂−z₁)", { size: 12, color: INK, weight: 700 });
      return s + '</svg>';
    }
  };

  figs["11.6"] = {
    caption: "Fig. 11.6 — Two skew lines l₁ and l₂ with the shortest segment PQ perpendicular to both directions (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Two skew lines and the common perpendicular">';
      s += line(50, 90, 330, 70, BLUE, 3);
      s += '<polygon points="330,70 318,64 316,74" fill="' + BLUE + '"/>';
      s += line(60, 200, 340, 150, AMBER, 3);
      s += '<polygon points="340,150 327,144 328,155" fill="' + AMBER + '"/>';
      s += line(190, 80, 200, 178, GREEN, 2.5, "6 4");
      s += dot(190, 80, GREEN, 5) + dot(200, 178, GREEN, 5);
      s += text(142, 74, "l₁", { color: BLUE, weight: 700, size: 15 });
      s += text(300, 196, "l₂", { color: AMBER, weight: 700, size: 15 });
      s += text(208, 130, "P", { color: GREEN, anchor: "start" });
      s += text(208, 176, "Q", { color: GREEN, anchor: "start" });
      s += text(190, 34, "PQ ⊥ both lines · d = |(a₂−a₁)·(b₁×b₂)| / |b₁×b₂|", { size: 12, color: INK, weight: 700 });
      s += text(120, 225, "skew lines never meet and are not parallel", { size: 12, color: MUTED });
      return s + '</svg>';
    }
  };

  figs["11.7"] = {
    caption: "Fig. 11.7 — Distance between parallel lines: the perpendicular from T on l₂ meets l₁ at P (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 380 250" role="img" aria-label="Distance between two parallel lines">';
      s += line(50, 80, 330, 60, BLUE, 3);
      s += '<polygon points="330,60 318,54 316,64" fill="' + BLUE + '"/>';
      s += line(50, 190, 330, 170, AMBER, 3);
      s += '<polygon points="330,170 318,164 316,174" fill="' + AMBER + '"/>';
      s += line(210, 98, 218, 178, GREEN, 2.5, "6 4");
      s += dot(210, 98, GREEN, 5) + dot(218, 178, GREEN, 5);
      s += text(70, 72, "l₁", { color: BLUE, weight: 700, size: 15 });
      s += text(70, 184, "l₂", { color: AMBER, weight: 700, size: 15 });
      s += text(200, 92, "P", { color: GREEN, anchor: "end" });
      s += text(228, 186, "T", { color: GREEN, anchor: "start" });
      s += text(300, 138, "d = |PT|", { color: GREEN });
      s += text(190, 30, "b ≠ 0 is the common direction of both lines", { size: 12, color: INK, weight: 700 });
      s += text(190, 228, "d = |b × (a₂ − a₁)| / |b|", { size: 13, color: MUTED });
      return s + '</svg>';
    }
  };

  return figs;
})();
