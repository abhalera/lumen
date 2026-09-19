// Textbook figure used by the exercises, redrawn as SVG from the data table printed with
// books/originals/Class12-Chemistry-Pt1_lech101.pdf (Exercise 1.37, printed p. 30).
window.FIGURES = (function(){
  var INK = "#e2e8f0", MUTED = "#94a3b8", RED = "#f87171", GREEN = "#34d399";

  function text(x, y, s, o){
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.color || INK) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || "middle") + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + s + '</text>';
  }

  var figs = {};

  figs["1.37"] = {
    caption: "Exercise 1.37 \u2014 acetone\u2013chloroform p_total at 328 K against the ideal Raoult line (redrawn).",
    svg: function(){
      var s = '<svg viewBox="0 0 520 320" role="img" aria-label="Acetone-chloroform total pressure versus mole fraction of acetone">';
      s += '<rect width="520" height="320" fill="#09131d"/>';
      function X(x){ return 60 + 420 * x; }
      function Y(p){ return 270 - (p / 800) * 240; }
      s += '<line x1="60" y1="270" x2="490" y2="270" stroke="' + MUTED + '" stroke-width="1.4"/>';
      s += '<line x1="60" y1="270" x2="60" y2="24" stroke="' + MUTED + '" stroke-width="1.4"/>';
      for (var p = 0; p <= 800; p += 200){
        s += '<line x1="56" y1="' + Y(p) + '" x2="60" y2="' + Y(p) + '" stroke="' + MUTED + '"/>';
        s += text(44, Y(p) + 4, String(p), {size: 10, color: MUTED});
      }
      for (var x = 0; x <= 1; x += 0.25){
        s += '<line x1="' + X(x) + '" y1="270" x2="' + X(x) + '" y2="274" stroke="' + MUTED + '"/>';
        s += text(X(x), 288, x.toFixed(2), {size: 10, color: MUTED});
      }
      s += '<line x1="' + X(0) + '" y1="' + Y(632.8) + '" x2="' + X(1) + '" y2="' + Y(741.8) + '" stroke="' + GREEN + '" stroke-width="2" stroke-dasharray="6 4"/>';
      var xa = [0, 0.118, 0.234, 0.360, 0.508, 0.582, 0.645, 0.721, 1];
      var pt = [632.8, 603.0, 579.5, 562.1, 580.4, 599.5, 615.3, 641.8, 741.8];
      var d = "";
      for (var i = 0; i < xa.length; i++){
        d += (i === 0 ? "M" : "L") + " " + X(xa[i]).toFixed(1) + " " + Y(pt[i]).toFixed(1) + " ";
        s += '<circle cx="' + X(xa[i]).toFixed(1) + '" cy="' + Y(pt[i]).toFixed(1) + '" r="4" fill="' + RED + '"/>';
      }
      s += '<path d="' + d + '" fill="none" stroke="' + RED + '" stroke-width="2"/>';
      s += text(260, 14, "Exercise 1.37 \u00b7 328 K \u00b7 p_total vs x(acetone)", {size: 13, color: MUTED});
      s += text(390, 40, "ideal Raoult line", {size: 11, color: GREEN, anchor: "end"});
      s += text(390, 56, "experimental p_total", {size: 11, color: RED, anchor: "end"});
      s += '<circle cx="62" cy="36" r="4" fill="' + GREEN + '"/><circle cx="62" cy="52" r="4" fill="' + RED + '"/>';
      s += text(120, 306, "x(acetone)", {size: 11, color: MUTED, anchor: "end"});
      s += text(16, 20, "p/mm Hg", {size: 11, color: MUTED, anchor: "start"});
      return s + '</svg>';
    }
  };

  return figs;
})();
