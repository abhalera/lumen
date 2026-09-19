// Class 12 Physics, Chapter 10 (leph202) — simulation labs.
// One lab per lesson, built on the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// Shared drawing helper: a sampled sine curve as an SVG polyline.
function sinePoly(x0, x1, y0, amp, k, phase, color, w){
  var pts = [];
  for(var i = 0; i <= 90; i += 1){
    var x = x0 + (x1 - x0) * i / 90;
    var y = y0 + amp * Math.sin(k * (x - x0) + phase);
    pts.push(x.toFixed(1) + "," + y.toFixed(1));
  }
  return '<polyline fill="none" stroke="' + color + '" stroke-width="' + (w || 2.4) + '" points="' + pts.join(" ") + '"/>';
}

// -------------------------------------------------------------------------
// Lab 1 — Corpuscular vs wave model (NCERT §10.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {model: "wave", n: 1.33};

  function draw(){
    var n = st.n;
    var ix = 340, iy = 178;
    var ia = 45 * Math.PI / 180;
    var r = Math.asin(Math.sin(ia) / n);
    var m = "";
    m += L.line(70, iy, 660, iy, "#93c5fd", 3);
    m += L.line(ix, 60, ix, 270, C.faint, 1.6, "6 5");
    m += L.text(80, 200, "medium 1 (air, n = 1)", {size: 14, color: C.muted, anchor: "start"});
    m += L.text(80, 222, "medium 2 (n = " + L.num(n, 2) + ")", {size: 14, color: C.muted, anchor: "start"});
    m += L.line(ix - 220 * Math.sin(ia), iy - 220 * Math.cos(ia), ix, iy, "#38bdf8", 3);
    m += L.arrow(ix - 50 * Math.sin(ia), iy - 50 * Math.cos(ia), ix - 20 * Math.sin(ia), iy - 20 * Math.cos(ia), "#38bdf8", 3);
    m += L.line(ix, iy, ix + 200 * Math.sin(r), iy + 200 * Math.cos(r), "#f59e0b", 3);
    m += L.arrow(ix + 30 * Math.sin(r), iy + 30 * Math.cos(r), ix + 60 * Math.sin(r), iy + 60 * Math.cos(r), "#f59e0b", 3);
    m += L.line(ix, iy, ix + 170 * Math.sin(ia), iy - 170 * Math.cos(ia), "rgba(226,232,240,.45)", 2, "6 5");
    m += L.text(ix - 66, iy - 62, "i = 45°", {size: 14, color: "#38bdf8"});
    m += L.text(ix + 74, iy + 96, "r = " + L.num(r * 180 / Math.PI, 1) + "°", {size: 14, color: "#f59e0b"});
    m += L.text(90, 52, "Both models bend the ray toward the normal", {size: 15, color: C.text, anchor: "start"});

    var v2 = st.model === "wave" ? 1 / n : n;
    var bar = function(y, value, color, label){
      var s = "";
      s += L.text(485, y + 5, label, {size: 14, color: color, anchor: "end"});
      s += L.rect(500, y - 9, 110, 18, "rgba(148,163,184,.18)", ' rx="4"');
      s += L.rect(500, y - 9, Math.min(140, Math.max(4, 110 * Math.abs(value))), 18, color, ' rx="4"');
      s += L.text(620, y + 5, L.num(value, 2) + " c", {size: 13, color: C.muted, anchor: "start"});
      return s;
    };
    m += L.text(490, 200, "Speed prediction", {size: 14, color: C.text, anchor: "start"});
    m += bar(230, 1, "#38bdf8", "v₁ (air) = ");
    m += bar(258, v2, st.model === "wave" ? "#34d399" : C.danger, "v₂ (medium) = ");
    L.svg(m, "Ray bending at an interface under the " + st.model + " model.", 300);

    L.readout([
      ["Model", st.model === "wave" ? "Wave (Huygens)" : "Corpuscular (Newton)", st.model === "wave" ? "#34d399" : C.danger],
      ["Refractive index n", L.num(n, 2)],
      ["Predicted v₂", L.num(v2, 2) + " × c", st.model === "wave" ? "#34d399" : C.danger],
      ["Foucault (1850) measured", "v in water < v in air", C.ok]
    ]);
    if(st.model === "wave"){
      L.verdict("<b>Wave model:</b> the ray bends toward the normal because the wave slows down: v₂ = c/n = " + L.num(1 / n, 2) + "c. Foucault measured exactly this, so the wave model explains refraction.");
    } else {
      L.verdict("<b>Corpuscular model:</b> to bend toward the normal the particles must speed up, predicting v₂ = " + L.num(n, 2) + "c. Foucault's measurement gave the opposite result, ruling this model out.");
    }
  }

  function select(id){
    st.model = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["wave", "Wave model"], ["corpuscular", "Corpuscular model"]], st.model, select);
    L.controls(L.slider("l1-n", "Refractive index n of medium 2", 1.05, 2.40, 0.05, st.n, L.num(st.n, 2)));
    L.onInput("l1-n", function(v){ st.n = v; L.setVal("l1-n", L.num(v, 2)); draw(); });
    L.legend([["#38bdf8", "incident ray"], ["#f59e0b", "refracted ray"], ["#34d399", "wave prediction"]]);
    L.watch("Both models bend the ray toward the normal. Only the predicted speed inside the medium differs; experiment decides which is right.");
    draw();
  }

  window.SIMS.lightmodels = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Huygens construction (NCERT §10.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "point", t: 0.4};
  var D = 34;

  function draw(){
    var m = "";
    if(st.preset === "point"){
      var cx = 130, cy = 155;
      var R = 62 + st.t * 70;
      m += L.circle(cx, cy, R, "none", ' stroke="#f59e0b" stroke-width="3"');
      var pts = [];
      for(var i = 0; i < 9; i += 1){
        var ang = -Math.PI / 2 + i * Math.PI / 8;
        var px = cx + R * Math.cos(ang), py = cy + R * Math.sin(ang);
        pts.push([px, py]);
        m += L.circle(px, py, D, "rgba(56,189,248,.10)", ' stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="4 4"');
      }
      m += L.circle(cx, cy, R + D, "none", ' stroke="#34d399" stroke-width="3"');
      m += L.circle(cx, cy, 8, C.danger) + L.text(cx, cy + 4, "+", {size: 13, color: "#fff", weight: 700});
      m += L.text(cx, cy + R + D + 26, "new wavefront (envelope)", {size: 14, color: "#34d399"});
      m += L.text(cx, cy - R - 14, "wavefront at time t", {size: 14, color: "#f59e0b"});
      L.svg(m, "Spherical Huygens construction with secondary wavelets.", 300);
      L.readout([
        ["Source", "point (spherical waves)", C.danger],
        ["Wavefront at t", "sphere of radius R"],
        ["Secondary wavelets", "radius v Δt", "#38bdf8"],
        ["New wavefront", "sphere of radius R + vΔt", "#34d399"]
      ]);
      L.verdict("<b>Point source:</b> every point of the spherical wavefront sends a wavelet. Their common tangent is a bigger sphere centred on the same source — the wavefront of a diverging wave.");
    } else {
      var x = 150 + st.t * 110;
      m += L.line(x, 35, x, 275, "#f59e0b", 3);
      m += L.text(x, 24, "wavefront at time t", {size: 14, color: "#f59e0b"});
      for(var j = 0; j < 7; j += 1){
        var yy = 55 + j * 36;
        m += L.circle(x, yy, D, "rgba(56,189,248,.10)", ' stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="4 4"');
      }
      m += L.line(x + D, 35, x + D, 275, "#34d399", 3);
      m += L.text(x + D, 292, "envelope = new plane wavefront", {size: 14, color: "#34d399"});
      m += L.arrow(60, 155, 110, 155, "#f59e0b", 3);
      m += L.text(85, 140, "v", {size: 15, color: "#f59e0b"});
      L.svg(m, "Plane Huygens construction with secondary wavelets.", 300);
      L.readout([
        ["Source", "plane wave", "#f59e0b"],
        ["Wavefront at t", "a vertical plane"],
        ["Secondary wavelets", "radius v Δt", "#38bdf8"],
        ["New wavefront", "plane shifted by vΔt", "#34d399"]
      ]);
      L.verdict("<b>Plane wave:</b> wavelets drawn from every point of the plane wavefront have a common tangent that is again a plane, shifted forward — a plane wave keeps its shape as it travels.");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["point", "Point source"], ["plane", "Plane wave"]], st.preset, select);
    L.controls(L.slider("l2-t", "Time step along the wave", 0, 1, 0.05, st.t, L.num(st.t, 2)));
    L.onInput("l2-t", function(v){ st.t = v; L.setVal("l2-t", L.num(v, 2)); draw(); });
    L.legend([["#f59e0b", "wavefront at t"], ["#38bdf8", "secondary wavelets"], ["#34d399", "envelope (new wavefront)"]]);
    L.watch("Each point of the old wavefront is a source. The envelope of all the little circles is the wavefront a moment later.");
    draw();
  }

  window.SIMS.huygens = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Refraction: Snell's law from Huygens (NCERT §10.3.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {i: 40, n2: 1.33};
  var N1 = 1.0;

  function tick(cx, cy, dx, dy, len, color){
    var px = -dy, py = dx;
    return L.line(cx - px * len, cy - py * len, cx + px * len, cy + py * len, color, 1.8);
  }

  function draw(){
    var i = st.i * Math.PI / 180;
    var s2 = N1 * Math.sin(i) / st.n2;
    var r = Math.asin(Math.max(-1, Math.min(1, s2)));
    var ix = 360, iy = 170;
    var m = "";
    m += L.line(60, iy, 660, iy, "#93c5fd", 3);
    m += L.line(ix, 40, ix, 285, C.faint, 1.6, "6 5");
    m += L.text(100, iy - 12, "medium 1, n₁ = " + L.num(N1, 2), {size: 14, color: C.muted, anchor: "start"});
    m += L.text(100, iy + 24, "medium 2, n₂ = " + L.num(st.n2, 2), {size: 14, color: C.muted, anchor: "start"});
    var s = 0.22, t;
    for(t = 0.30; t < 1.0; t += 0.22){
      m += tick(ix - (ix - 90) * t * Math.sin(i), iy - (iy - 40) * t * Math.cos(i), Math.sin(i), Math.cos(i), 30, "#38bdf8");
      m += tick(ix + (610 - ix) * t * Math.sin(r), iy + (285 - iy) * t * Math.cos(r), Math.sin(r), Math.cos(r), 30, "#f59e0b");
    }
    m += L.arrow(ix - 150 * Math.sin(i), iy - 150 * Math.cos(i), ix - 100 * Math.sin(i), iy - 100 * Math.cos(i), "#38bdf8", 3);
    m += L.arrow(ix + 90 * Math.sin(r), iy + 90 * Math.cos(r), ix + 140 * Math.sin(r), iy + 140 * Math.cos(r), "#f59e0b", 3);
    m += L.text(ix - 70, iy - 60, "i = " + L.num(st.i, 0) + "°", {size: 14, color: "#38bdf8"});
    m += L.text(ix + 62, iy + 80, "r = " + L.num(r * 180 / Math.PI, 1) + "°", {size: 14, color: "#f59e0b"});
    m += L.text(360, 30, "wavefront spacing tracks the wavelength", {size: 14, color: C.muted});
    L.svg(m, "Plane wavefronts crossing an interface at " + L.num(st.i, 0) + " degrees.", 300);

    L.readout([
      ["Angle of incidence", L.num(st.i, 0) + "°", "#38bdf8"],
      ["Angle of refraction", L.num(r * 180 / Math.PI, 1) + "°", "#f59e0b"],
      ["Speed ratio v₂/v₁", L.num(1 / st.n2, 3), C.text],
      ["Wavelength ratio λ₂/λ₁", L.num(1 / st.n2, 3), C.text]
    ]);
    L.verdict("<b>sin i / sin r = " + L.num(st.i === 0 ? 1 : Math.sin(i) / Math.sin(r), 2) + " = n₂/n₁.</b> The wavefronts are closer together in the slower medium: the wave is compressed while the frequency stays the same.");
  }

  function select(id){
    st.n2 = {water: 1.33, glass: 1.50, diamond: 2.42}[id];
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["water", "Into water (1.33)"], ["glass", "Into glass (1.50)"], ["diamond", "Into diamond (2.42)"]], "water", select);
    L.controls(
      L.slider("l3-i", "Angle of incidence i", 0, 80, 1, st.i, L.num(st.i, 0) + "°") +
      L.slider("l3-n", "Refractive index n₂", 1.05, 2.50, 0.05, st.n2, L.num(st.n2, 2))
    );
    L.onInput("l3-i", function(v){ st.i = v; L.setVal("l3-i", L.num(v, 0) + "°"); draw(); });
    L.onInput("l3-n", function(v){ st.n2 = v; L.setVal("l3-n", L.num(v, 2)); draw(); });
    L.legend([["#38bdf8", "incident wavefront"], ["#f59e0b", "refracted wavefront"]]);
    L.watch("Move the incident angle and the refractive index. Check that sin i / sin r equals v₁/v₂ every time.");
    draw();
  }

  window.SIMS.refraction = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Total internal reflection (NCERT §10.3.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "water-air", i: 30};
  var INFO = {
    "water-air": {n1: 1.33, n2: 1.00, label: "water → air"},
    "glass-air": {n1: 1.50, n2: 1.00, label: "glass → air"},
    "glass-water": {n1: 1.50, n2: 1.33, label: "glass → water"}
  };

  function draw(){
    var cfg = INFO[st.preset];
    var ic = Math.asin(Math.min(1, cfg.n2 / cfg.n1));
    var i = st.i * Math.PI / 180;
    var tir = i > ic;
    var ix = 360, iy = 150;
    var m = "";
    m += L.rect(70, 150, 580, 70, "rgba(56,189,248,.08)", ' stroke="none"');
    m += L.line(70, iy, 650, iy, "#93c5fd", 3);
    m += L.line(ix, 28, ix, 260, C.faint, 1.6, "6 5");
    m += L.text(92, 216, "denser medium n₁ = " + L.num(cfg.n1, 2), {size: 14, color: "#93c5fd", anchor: "start"});
    m += L.text(92, 240, "rarer medium n₂ = " + L.num(cfg.n2, 2), {size: 14, color: C.muted, anchor: "start"});
    m += L.line(ix - 190 * Math.sin(i), iy + 190 * Math.cos(i), ix, iy, "#38bdf8", 3);
    m += L.arrow(ix - 80 * Math.sin(i), iy + 80 * Math.cos(i), ix - 40 * Math.sin(i), iy + 40 * Math.cos(i), "#38bdf8", 3);
    m += L.line(ix, iy, ix + 170 * Math.sin(i), iy + 170 * Math.cos(i), "rgba(52,211,153,.85)", 2.5, "7 5");
    if(!tir){
      var r = Math.asin(Math.min(1, cfg.n1 * Math.sin(i) / cfg.n2));
      m += L.line(ix, iy, ix + 210 * Math.sin(r), iy - 210 * Math.cos(r), "#f59e0b", 3);
      m += L.arrow(ix + 70 * Math.sin(r), iy - 70 * Math.cos(r), ix + 110 * Math.sin(r), iy - 110 * Math.cos(r), "#f59e0b", 3);
      m += L.text(ix + 120 * Math.sin(r), iy - 120 * Math.cos(r) - 8, "refracted r = " + L.num(r * 180 / Math.PI, 1) + "°", {size: 14, color: "#f59e0b", anchor: "start"});
      m += L.text(ix - 150, iy + 45, "i = " + L.num(st.i, 0) + "°", {size: 14, color: "#38bdf8"});
    } else {
      m += L.text(ix + 20, 60, "no refracted ray — 100% reflected", {size: 16, color: C.ok, anchor: "start"});
      m += L.text(ix - 150, iy + 45, "i = " + L.num(st.i, 0) + "° > i_c", {size: 14, color: C.danger});
    }
    m += L.text(ix - 84, iy - 34, "i_c = " + L.num(ic * 180 / Math.PI, 1) + "°", {size: 15, color: "#f8fafc", weight: 700});
    L.svg(m, "Refraction and total internal reflection for " + cfg.label + ".", 300);

    L.readout([
      ["Interface", cfg.label, C.text],
      ["Critical angle", L.num(ic * 180 / Math.PI, 1) + "°", "#f8fafc"],
      ["Angle of incidence", L.num(st.i, 0) + "°", "#38bdf8"],
      ["Outcome", tir ? "Total internal reflection" : "Partly refracted, partly reflected", tir ? C.ok : "#f59e0b"]
    ]);
    if(tir){
      L.verdict("<b>i = " + L.num(st.i, 0) + "° is greater than i_c = " + L.num(ic * 180 / Math.PI, 1) + "°:</b> Snell's law would need sin r > 1, which is impossible. No refracted wave exists and all the light is reflected back.");
    } else {
      L.verdict("Below the critical angle both rays exist. Push the angle past " + L.num(ic * 180 / Math.PI, 1) + "° and the refracted ray will vanish completely.");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["water-air", "Water → air"], ["glass-air", "Glass → air"], ["glass-water", "Glass → water"]], st.preset, select);
    L.controls(L.slider("l4-i", "Angle of incidence i", 0, 89, 1, st.i, L.num(st.i, 0) + "°"));
    L.onInput("l4-i", function(v){ st.i = v; L.setVal("l4-i", L.num(v, 0) + "°"); draw(); });
    L.legend([["#38bdf8", "incident ray"], ["#f59e0b", "refracted ray"], ["#34d399", "reflected ray"]]);
    L.watch("Sweep the angle from 0° to 89°. The refracted ray disappears abruptly at the critical angle.");
    draw();
  }

  window.SIMS.tir = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Wavefronts at a mirror, prism and lens (NCERT §10.3.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "mirror", angle: 40};

  function mirrorDraw(){
    var i = st.angle * Math.PI / 180;
    var m = "";
    m += L.line(380, 45, 380, 255, "#93c5fd", 4);
    m += L.text(380, 32, "plane mirror", {size: 14, color: "#93c5fd"});
    m += L.line(380, 150, 250, 150, C.faint, 1.6, "6 5");
    var x0 = 380 - 150 * Math.cos(i), y0 = 150 - 150 * Math.sin(i);
    m += L.line(x0, y0, 380, 150, "#38bdf8", 3);
    m += L.arrow(x0 + 80 * Math.cos(i), y0 + 80 * Math.sin(i), x0 + 120 * Math.cos(i), y0 + 120 * Math.sin(i), "#38bdf8", 3);
    m += L.line(380, 150, 380 - 200 * Math.cos(i), 150 + 200 * Math.sin(i), "#f59e0b", 3);
    m += L.arrow(380 - 80 * Math.cos(i), 150 + 80 * Math.sin(i), 380 - 120 * Math.cos(i), 150 + 120 * Math.sin(i), "#f59e0b", 3);
    m += L.text(300, 120, "i = " + L.num(st.angle, 0) + "°", {size: 14, color: "#38bdf8"});
    m += L.text(280, 190, "r = " + L.num(st.angle, 0) + "°", {size: 14, color: "#f59e0b"});
    m += L.text(360, 284, "angle of incidence = angle of reflection", {size: 15, color: C.text});
    L.svg(m, "Plane wavefront reflecting from a mirror at " + L.num(st.angle, 0) + " degrees.", 300);
    L.readout([
      ["Surface", "plane mirror"],
      ["Angle of incidence", L.num(st.angle, 0) + "°", "#38bdf8"],
      ["Angle of reflection", L.num(st.angle, 0) + "°", "#f59e0b"],
      ["Law", "i = r", C.ok]
    ]);
    L.verdict("The incident and reflected wavefronts are congruent: AE = BC = vΔt in the same medium, so the angles with the normal must be equal.");
  }

  function prismDraw(){
    var m = "";
    m += '<polygon points="270,70 470,220 190,220" fill="rgba(148,163,184,.12)" stroke="#93c5fd" stroke-width="2.5"/>';
    m += L.text(330, 208, "glass prism", {size: 14, color: "#93c5fd"});
    var j;
    for(j = 0; j < 3; j += 1){
      var yy = 96 + j * 34;
      m += L.line(90, yy, 232, yy, "#38bdf8", 2.4);
      m += L.arrow(180, yy, 220, yy, "#38bdf8", 2.4);
    }
    for(j = 0; j < 3; j += 1){
      var y2 = 140 + j * 36;
      m += L.line(438, y2, 640, y2 + 60, "#f59e0b", 2.4);
      m += L.arrow(540, y2 + 28, 590, y2 + 48, "#f59e0b", 2.4);
    }
    m += L.text(360, 46, "plane wavefronts are delayed most where the glass is thickest", {size: 14, color: C.text});
    m += L.text(540, 250, "emergent front tilts → beam deviates", {size: 14, color: "#f59e0b"});
    L.svg(m, "Plane wavefronts passing through a prism.", 300);
    L.readout([
      ["Element", "thin prism"],
      ["Delay at the base", "largest (thickest glass)"],
      ["Emergent wavefront", "tilted", "#f59e0b"],
      ["Result", "beam deviates", C.text]
    ]);
    L.verdict("Different parts of the wavefront spend different times inside the glass. The emerging front is tilted, which is exactly a deviated beam.");
  }

  function lensDraw(){
    var m = "";
    m += '<path d="M360 55 Q410 150 360 245 Q310 150 360 55 Z" fill="rgba(148,163,184,.12)" stroke="#93c5fd" stroke-width="2.5"/>';
    m += L.text(300, 40, "convex lens", {size: 14, color: "#93c5fd"});
    var j;
    for(j = 0; j < 4; j += 1){
      var yy = 85 + j * 44;
      m += L.line(90, yy, 335, yy, "#38bdf8", 2.2);
    }
    for(j = 0; j < 5; j += 1){
      var yEnd = 70 + j * 40;
      m += L.line(392, 150 + (yEnd - 150) * 0.55, 520, yEnd, "rgba(56,189,248,.55)", 1.6);
      m += L.line(392, 150 + (yEnd - 150) * 0.55, 520, 300 - yEnd, "rgba(56,189,248,.55)", 1.6);
    }
    m += L.circle(540, 150, 6, C.ok);
    m += L.text(556, 156, "F", {size: 16, color: C.ok, anchor: "start", weight: 700});
    m += L.text(360, 288, "plane wavefront becomes a converging spherical wavefront", {size: 14, color: C.text});
    L.svg(m, "Plane wavefronts focused by a convex lens.", 300);
    L.readout([
      ["Element", "convex lens"],
      ["Centre of the lens", "thickest → largest delay"],
      ["After the lens", "converging spherical front", "#38bdf8"],
      ["Crossing point", "focus F", C.ok]
    ]);
    L.verdict("The lens delays the middle of the wavefront more than the edges. The front curves inward and converges at the focus — the wave picture of focusing.");
  }

  function draw(){
    if(st.preset === "mirror") mirrorDraw();
    else if(st.preset === "prism") prismDraw();
    else lensDraw();
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch(id === "mirror" ? "Use the angle slider: the reflected wavefront mirrors the incident one about the normal." : (id === "prism" ? "Trace where the wavefront is delayed the most." : "The thickest part of the lens delays the centre of the wavefront the most."));
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["mirror", "Plane mirror"], ["prism", "Prism"], ["lens", "Convex lens"]], st.preset, select);
    L.controls(L.slider("l5-a", "Angle of incidence (mirror)", 10, 70, 1, st.angle, L.num(st.angle, 0) + "°"));
    L.onInput("l5-a", function(v){ st.angle = v; L.setVal("l5-a", L.num(v, 0) + "°"); draw(); });
    L.legend([["#38bdf8", "incident wavefront"], ["#f59e0b", "reflected / deviated"], ["#34d399", "focus"]]);
    L.watch("Switch elements and follow the shape of the wavefront before and after.");
    draw();
  }

  window.SIMS.waveoptics = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Coherent addition of waves (NCERT §10.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {path: 0.5};
  var KPX = 2 * Math.PI / 90;

  // Δx = nλ is constructive, Δx = (n + ½)λ is destructive, anything else is partial.
  function classify(path){
    var frac = Math.abs(path - Math.round(path));
    if(frac < 0.025) return "constructive";
    if(Math.abs(frac - 0.5) < 0.025) return "destructive";
    return "partial";
  }

  function draw(){
    var phi = 2 * Math.PI * st.path;
    var amp = Math.abs(2 * Math.cos(phi / 2));
    var inten = 4 * Math.cos(phi / 2) * Math.cos(phi / 2);
    var kind = classify(st.path);
    var type = kind === "constructive" ? "constructive maximum: 4I₀" : (kind === "destructive" ? "destructive minimum: 0" : "partial interference");
    var stateColor = kind === "constructive" ? C.ok : (kind === "destructive" ? C.danger : "#f59e0b");
    var m = "";
    m += L.text(70, 46, "y₁", {size: 15, color: "#38bdf8", anchor: "start"});
    m += sinePoly(120, 660, 66, 30, KPX, 0, "#38bdf8", 2.4);
    m += L.text(70, 116, "y₂", {size: 15, color: "#f59e0b", anchor: "start"});
    m += sinePoly(120, 660, 136, 30, KPX, phi, "#f59e0b", 2.4);
    m += L.text(70, 216, "sum", {size: 15, color: "#f8fafc", anchor: "start"});
    m += sinePoly(120, 660, 216, 30 * amp / 2, KPX, phi / 2, "#f8fafc", 3);
    m += L.line(120, 186, 660, 186, C.faint, 1, "5 5");
    m += L.text(390, 274, "path difference Δx = " + L.num(st.path, 2) + " λ    ·    " + type, {size: 15, color: C.text});
    L.svg(m, "Two coherent waves and their sum for a path difference of " + L.num(st.path, 2) + " wavelengths.", 300);

    L.readout([
      ["Path difference Δx", L.num(st.path, 2) + " λ"],
      ["Phase difference φ", L.num(phi * 180 / Math.PI, 0) + "°", C.text],
      ["I / I₀ = 4cos²(φ/2)", L.num(inten, 2), stateColor],
      ["Result", type, stateColor]
    ]);
    if(kind === "constructive"){
      L.verdict("<b>In phase:</b> the path difference is a whole number of wavelengths (" + L.num(st.path, 2) + "λ), so the crests line up with crests, the amplitudes add to 2a and the intensity reaches its maximum 4I₀. This is constructive interference.");
    } else if(kind === "destructive"){
      L.verdict("<b>Exactly out of phase:</b> the path difference is a half-integer multiple of the wavelength (" + L.num(st.path, 2) + "λ), so a crest meets a trough everywhere, the displacements cancel and the intensity is zero. This is destructive interference.");
    } else {
      L.verdict("The waves are neither perfectly in step nor perfectly opposed. Their sum has amplitude 2a cos(φ/2), so the intensity follows I = 4I₀cos²(φ/2).");
    }
  }

  function draw0(){ draw(); }

  function mount(){
    labNoTimeline();
    L.controls(L.slider("l6-x", "Path difference Δx (in wavelengths)", 0, 2, 0.05, st.path, L.num(st.path, 2) + " λ"));
    L.onInput("l6-x", function(v){ st.path = v; L.setVal("l6-x", L.num(v, 2) + " λ"); draw(); });
    L.legend([["#38bdf8", "wave 1"], ["#f59e0b", "wave 2"], ["#f8fafc", "resultant"]]);
    L.watch("At Δx = 0, λ and 2λ the waves reinforce; at 0.5λ and 1.5λ they cancel exactly.");
    draw();
  }

  window.SIMS.interfere = {mount: mount, draw: draw0, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Young's double slit (NCERT §10.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {lam: 600, d: 0.30, D: 1.0};

  function draw(){
    var beta = st.lam * st.D / st.d / 1000;      // mm
    var x4 = 4 * beta;                            // mm, distance to 4th bright
    var betaPx = Math.max(9, Math.min(46, beta * 26));
    var yc = 150, sx = 130, screenX = 610;
    var m = "";
    m += L.rect(screenX, 18, 14, 264, "rgba(148,163,184,.25)", ' rx="4"');
    m += L.text(screenX + 7, 14, "screen", {size: 13, color: C.muted});
    m += L.rect(sx - 6, 96, 8, 108, "#93c5fd", ' rx="2"');
    m += L.circle(sx, yc - 26, 5, "#f8fafc");
    m += L.circle(sx, yc + 26, 5, "#f8fafc");
    m += L.text(sx - 10, yc - 34, "S₁", {size: 13, color: C.muted, anchor: "end"});
    m += L.text(sx - 10, yc + 42, "S₂", {size: 13, color: C.muted, anchor: "end"});
    m += L.text(sx - 12, 150, "slit plane, d = " + L.num(st.d, 2) + " mm", {size: 13, color: "#93c5fd", anchor: "end"});

    var j, y;
    for(j = -12; j <= 12; j += 1){
      y = yc + j * betaPx;
      if(y < 26 || y > 274) continue;
      var col = "rgba(250,204,21,";
      if(st.lam < 470) col = "rgba(96,165,250,";
      else if(st.lam < 560) col = "rgba(52,211,153,";
      else if(st.lam >= 620) col = "rgba(248,113,113,";
      var alpha = (0.55 + 0.4 * Math.max(0, 1 - Math.abs(j) / 12)).toFixed(2);
      m += L.rect(screenX, y - betaPx * 0.35, 14, betaPx * 0.7, col + alpha + ")", ' rx="2"');
    }
    var yP = yc + 4 * betaPx;
    m += L.line(sx, yc - 26, screenX, yP, "rgba(56,189,248,.8)", 1.6, "5 4");
    m += L.line(sx, yc + 26, screenX, yP, "rgba(245,158,11,.8)", 1.6, "5 4");
    m += L.circle(screenX + 7, yP, 5, "#f8fafc");
    m += L.text(screenX - 6, yP - 8, "4th bright", {size: 12, color: "#f8fafc", anchor: "end"});
    m += L.text(370, 284, "central maximum", {size: 13, color: C.muted});
    m += L.text(90, 40, "λ = " + L.num(st.lam, 0) + " nm   D = " + L.num(st.D, 2) + " m", {size: 15, color: C.text, anchor: "start"});
    L.svg(m, "Double-slit fringe pattern with fringe width " + L.num(beta, 2) + " millimetres.", 300);

    L.readout([
      ["Wavelength λ", L.num(st.lam, 0) + " nm"],
      ["Slit separation d", L.num(st.d, 2) + " mm"],
      ["Screen distance D", L.num(st.D, 2) + " m"],
      ["Fringe width β = λD/d", L.num(beta, 3) + " mm", "#f8fafc"],
      ["4th bright at 4β", L.num(x4, 3) + " mm", C.ok]
    ]);
    L.verdict("<b>β = λD/d = " + L.num(beta, 3) + " mm.</b> Increase the wavelength or the screen distance and the fringes spread apart; increase the slit separation and they pack closer together.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("l7-lam", "Wavelength λ", 400, 700, 5, st.lam, L.num(st.lam, 0) + " nm") +
      L.slider("l7-d", "Slit separation d", 0.10, 1.00, 0.05, st.d, L.num(st.d, 2) + " mm") +
      L.slider("l7-D", "Screen distance D", 0.50, 2.00, 0.05, st.D, L.num(st.D, 2) + " m")
    );
    L.onInput("l7-lam", function(v){ st.lam = v; L.setVal("l7-lam", L.num(v, 0) + " nm"); draw(); });
    L.onInput("l7-d", function(v){ st.d = v; L.setVal("l7-d", L.num(v, 2) + " mm"); draw(); });
    L.onInput("l7-D", function(v){ st.D = v; L.setVal("l7-D", L.num(v, 2) + " m"); draw(); });
    L.legend([["#38bdf8", "ray from S₁"], ["#f59e0b", "ray from S₂"], ["#f8fafc", "bright fringe"]]);
    L.watch("Watch the fringe spacing change with each slider and compare it with the β = λD/d readout.");
    draw();
  }

  window.SIMS.ydse = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Single-slit diffraction (NCERT §10.6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {lam: 600, a: 0.20, D: 1.0};

  function draw(){
    var aM = st.a * 1e-3, lamM = st.lam * 1e-9;
    var ratio = lamM / aM;
    var th1 = Math.asin(Math.min(1, ratio));            // first minimum
    var widthMM = 2 * st.D * ratio * 1000;
    var thMax = th1 * 4.0;
    var m = "";
    m += L.rect(100, 60, 20, 180, "#93c5fd", ' rx="3"');
    m += L.rect(100, 60 + 90 - 18, 20, 36, "#09131d");
    m += L.text(110, 46, "slit a = " + L.num(st.a, 2) + " mm", {size: 14, color: "#93c5fd"});
    m += L.line(120, 150, 210, 150, "#38bdf8", 2, "6 5");

    var pts = [];
    var i;
    for(i = 0; i <= 160; i += 1){
      var th = -thMax + 2 * thMax * i / 160;
      var beta = Math.PI * aM * Math.sin(th) / lamM;
      var inten = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
      var x = 200 + (th + thMax) / (2 * thMax) * 430;
      var y = 262 - inten * 130;
      pts.push(x.toFixed(1) + "," + y.toFixed(1));
    }
    m += '<polyline fill="none" stroke="#f59e0b" stroke-width="2.6" points="' + pts.join(" ") + '"/>';
    m += L.line(200, 262, 650, 262, C.muted, 1.5);
    for(i = 1; i <= 3; i += 1){
      var thn = Math.asin(Math.min(1, i * ratio));
      if(thn > thMax) continue;
      var xr = 200 + (thn + thMax) / (2 * thMax) * 430;
      var xl = 200 + (-thn + thMax) / (2 * thMax) * 430;
      m += L.line(xr, 138, xr, 262, "rgba(148,163,184,.45)", 1.2, "4 4");
      m += L.line(xl, 138, xl, 262, "rgba(148,163,184,.45)", 1.2, "4 4");
      if(i <= 2){
        m += L.text(xr, 128, "n=" + i, {size: 11, color: C.muted});
        m += L.text(xl, 128, "n=−" + i, {size: 11, color: C.muted});
      }
    }
    m += L.text(425, 292, "position on screen →", {size: 13, color: C.muted});
    m += L.text(425, 34, "central maximum", {size: 14, color: "#f8fafc"});
    L.svg(m, "Single-slit diffraction intensity pattern for slit width " + L.num(st.a, 2) + " millimetres.", 300);

    L.readout([
      ["Wavelength λ", L.num(st.lam, 0) + " nm"],
      ["Slit width a", L.num(st.a, 2) + " mm"],
      ["λ/a", L.num(ratio * 1000, 2) + " × 10⁻³"],
      ["First minimum θ₁", L.num(Math.asin(Math.min(1, ratio)) * 180 / Math.PI, 2) + "°", "#f8fafc"],
      ["Central width 2Dλ/a", L.num(widthMM, 2) + " mm", C.ok]
    ]);
    L.verdict("<b>The central maximum is twice as wide as the others.</b> Its width 2Dλ/a = " + L.num(widthMM, 2) + " mm grows if the slit becomes narrower or the wavelength larger — the unmistakable signature of diffraction.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("l8-lam", "Wavelength λ", 400, 700, 5, st.lam, L.num(st.lam, 0) + " nm") +
      L.slider("l8-a", "Slit width a", 0.05, 0.50, 0.01, st.a, L.num(st.a, 2) + " mm") +
      L.slider("l8-D", "Screen distance D", 0.50, 2.00, 0.05, st.D, L.num(st.D, 2) + " m")
    );
    L.onInput("l8-lam", function(v){ st.lam = v; L.setVal("l8-lam", L.num(v, 0) + " nm"); draw(); });
    L.onInput("l8-a", function(v){ st.a = v; L.setVal("l8-a", L.num(v, 2) + " mm"); draw(); });
    L.onInput("l8-D", function(v){ st.D = v; L.setVal("l8-D", L.num(v, 2) + " m"); draw(); });
    L.legend([["#f59e0b", "intensity profile"], ["#93c5fd", "single slit"]]);
    L.watch("The dotted lines mark the minima at a sin θ = nλ. Narrow the slit and watch the whole pattern spread out.");
    draw();
  }

  window.SIMS.diffract = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Polarisation and Malus's law (NCERT §10.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {theta: 0};

  function draw(){
    var th = st.theta * Math.PI / 180;
    var cos2 = Math.cos(th) * Math.cos(th);
    var frac = 0.5 * cos2;
    var m = "";
    m += L.rect(40, 120, 150, 60, "rgba(148,163,184,.12)", ' rx="8"');
    var k;
    for(k = 0; k < 14; k += 1){
      var yy = 126 + (k % 7) * 9;
      var ang = k * 0.45;
      var dx = 14 * Math.cos(ang), dy = 14 * Math.sin(ang);
      m += L.line(60 + k * 8, yy - dy, 60 + k * 8 + dx, yy + dy, "rgba(226,232,240,.5)", 1.4);
    }
    m += L.text(115, 105, "unpolarised I₀", {size: 13, color: C.text});
    m += L.line(200, 70, 200, 230, "#93c5fd", 5);
    m += L.text(200, 250, "P₁ (vertical)", {size: 13, color: "#93c5fd"});
    var ax = 420, ay = 150, r0 = 78;
    var dxa = r0 * Math.cos(th - Math.PI / 2), dya = r0 * Math.sin(th - Math.PI / 2);
    m += L.line(ax - dxa, ay - dya, ax + dxa, ay + dya, "#f59e0b", 5);
    m += L.text(ax, 250, "P₂ at " + L.num(st.theta, 0) + "°", {size: 13, color: "#f59e0b"});
    m += L.line(205, 150, 340, 150, "rgba(96,165,250,.85)", 4);
    m += L.text(275, 134, "I₁ = I₀/2", {size: 13, color: "#93c5fd"});
    m += L.line(426, 150, 620, 150, "rgba(245,158,11," + (0.2 + 0.8 * frac * 2).toFixed(2) + ")", 4);
    m += L.text(530, 134, "I₂ = (I₀/2)cos²θ = " + L.num(frac, 3) + " I₀", {size: 13, color: "#f59e0b"});
    m += L.text(360, 48, "Malus's law", {size: 20, color: C.text, weight: 700});
    m += L.text(360, 74, "I = I₀ cos² θ after the polariser", {size: 14, color: C.muted});
    L.svg(m, "Unpolarised light through two polaroids with axes at " + L.num(st.theta, 0) + " degrees.", 300);

    L.readout([
      ["Analyser angle θ", L.num(st.theta, 0) + "°", "#f59e0b"],
      ["cos²θ", L.num(cos2, 3)],
      ["Transmitted intensity", L.num(frac, 3) + " I₀", frac > 0.4 ? C.ok : (frac < 0.02 ? C.danger : "#f59e0b")],
      ["Brightness after P₂", L.num(frac * 200, 0) + " % of I₀/2"]
    ]);
    if(st.theta <= 2){
      L.verdict("<b>Parallel axes:</b> the analyser transmits the full polarised beam, so I₂ = I₀/2 = " + L.num(frac, 3) + " I₀.");
    } else if(Math.abs(st.theta - 90) <= 2){
      L.verdict("<b>Crossed polaroids:</b> the analyser axis is perpendicular to the polarisation, cos²90° = 0, and the light is completely extinguished.");
    } else if(Math.abs(st.theta - 45) <= 2){
      L.verdict("<b>θ = 45°:</b> cos²45° = 0.5, so exactly half of the polarised light gets through — a useful calibration point.");
    } else {
      L.verdict("The electric field after P₁ is E₀; P₂ passes only its component E₀cosθ, so the intensity falls as cos²θ. This is Malus's law.");
    }
  }

  function select(id){
    st.theta = {par: 0, half: 45, crossed: 90}[id];
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["par", "Parallel (0°)"], ["half", "45°"], ["crossed", "Crossed (90°)"]], "par", select);
    L.controls(L.slider("l9-th", "Analyser angle θ", 0, 90, 1, st.theta, L.num(st.theta, 0) + "°"));
    L.onInput("l9-th", function(v){ st.theta = v; L.setVal("l9-th", L.num(v, 0) + "°"); draw(); });
    L.legend([["#93c5fd", "first polaroid"], ["#f59e0b", "analyser"], ["#f8fafc", "unpolarised light"]]);
    L.watch("Rotate the analyser through 90° and watch the transmitted beam fade to nothing.");
    draw();
  }

  window.SIMS.polarise = {mount: mount, draw: draw, select: select, state: st};
})();
