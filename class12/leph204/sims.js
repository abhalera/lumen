// Class 12 Physics, Chapter 12 (leph204) — simulation labs.
// One lab per lesson, in the Lumen class-9 lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Inside the atom: Thomson's pudding vs the nuclear atom (NCERT §12.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "thomson", aim: 60};

  function draw(){
    var m = "";
    var cx = 250, cy = 150, R = 105;
    if(st.preset === "thomson"){
      m += L.circle(cx, cy, R, "rgba(244,114,182,.12)", ' stroke="#f472b6" stroke-width="2"');
      for(var i = 0; i < 10; i += 1){
        var a = i * Math.PI / 5;
        m += L.circle(cx + 58 * Math.cos(a), cy + 50 * Math.sin(a), 8, "#60a5fa");
        m += L.text(cx + 58 * Math.cos(a), cy + 50 * Math.sin(a) + 4, "−", {size: 12, color: "#dbeafe"});
      }
      m += L.text(cx, cy - 8, "positive cloud", {size: 15, color: "#f9a8d4", weight: 700});
      m += L.text(cx, cy + 14, "(charge spread out)", {size: 12, color: C.muted});
    } else {
      m += L.circle(cx, cy, R, "rgba(148,163,184,.07)", ' stroke="#475569" stroke-width="2" stroke-dasharray="6 5"');
      m += L.circle(cx, cy, 12, C.danger);
      m += L.text(cx, cy + 5, "+", {size: 16, color: "#fff", weight: 700});
      m += L.text(cx, cy - 8, "tiny nucleus +Ze", {size: 14, color: C.danger, weight: 700});
      m += L.circle(cx + 78, cy - 58, 7, "#60a5fa");
      m += L.text(cx + 78, cy - 54, "−", {size: 12, color: "#dbeafe"});
    }
    var y = cy + st.aim * 0.9;
    if(y > cy + R - 6) y = cy + R - 6;
    var bend;
    if(st.preset === "thomson"){
      bend = 0.25 * st.aim * (1 - st.aim / 130);
    } else {
      bend = 120 * Math.exp(-Math.abs(st.aim) / 26);
      if(st.aim === 0) bend = 118;
    }
    var xs = 60, xe = 660;
    var path = "M" + xs + " " + y + " Q" + cx + " " + (y - bend) + " " + xe + " " + (y - bend * 0.92);
    m += '<path d="' + path + '" fill="none" stroke="' + C.ok + '" stroke-width="2.5"/>';
    m += L.arrow(xe - 40, y - bend * 0.92, xe, y - bend * 0.92, C.ok, 3);
    m += L.text(90, 40, "α-particle", {size: 15, color: C.ok, weight: 700, anchor: "start"});
    L.svg(m, "An alpha particle crossing an atom in the " + st.preset + " model.", 290);
    var strength = st.preset === "thomson"
      ? "weak, spread over the whole atom"
      : "intense near the nucleus only";
    L.readout([
      ["Model", st.preset === "thomson" ? "Thomson plum pudding" : "Rutherford nuclear", st.preset === "thomson" ? "#f9a8d4" : C.danger],
      ["Positive charge", st.preset === "thomson" ? "fills the atom" : "concentrated in a nucleus"],
      ["Coulomb pull on α", strength],
      ["α deflection", st.preset === "thomson" ? "tiny at most" : (Math.abs(st.aim) < 25 ? "large (near miss!)" : "small"), st.preset === "thomson" ? C.muted : C.ok]
    ]);
    if(st.preset === "thomson"){
      L.verdict("<b>Plum pudding:</b> the positive charge is smeared through the atom, so an α-particle feels only a gentle, diffuse push wherever it passes. Every α would emerge nearly undeflected — but experiment shows some rebound.");
    } else if(Math.abs(st.aim) < 25){
      L.verdict("<b>Nuclear atom:</b> this α passes close to the concentrated charge. The Coulomb force is enormous at short range, so the α is deflected through a large angle — just like the rare ricochets seen by Geiger and Marsden.");
    } else {
      L.verdict("<b>Nuclear atom:</b> this α passes far from the nucleus and travels almost straight. Most α-particles do exactly this, because the nucleus occupies a tiny fraction of the atom.");
    }
  }

  function select(id){ st.preset = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["thomson", "Thomson plum pudding"], ["rutherford", "Rutherford nuclear"]], st.preset, select);
    L.controls(L.slider("t1-aim", "Aim offset of the α-particle", -90, 90, 5, st.aim, String(st.aim) + " px"));
    L.onInput("t1-aim", function(v){ st.aim = v; L.setVal("t1-aim", String(v) + " px"); draw(); });
    L.legend([["#f472b6", "positive charge"], ["#60a5fa", "electron"], [C.ok, "α-particle path"]]);
    L.watch("Sweep the aim offset. In the nuclear model the deflection explodes only when the α passes very close to the nucleus.");
    draw();
  }

  window.SIMS.thomson = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Geiger-Marsden scattering bench (NCERT §12.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {theta: 20};

  function rate(t){
    var s = Math.sin(t * Math.PI / 360);
    return 4 / Math.pow(s, 4);
  }

  function draw(){
    var m = "";
    var fx = 210, fy = 150;
    m += L.line(fx, 45, fx, 255, "#f59e0b", 4);
    m += L.text(fx, 34, "gold foil (2.1 × 10⁻⁷ m)", {size: 13, color: "#f59e0b"});
    for(var i = 0; i < 5; i += 1){
      m += L.arrow(fx - 130, 95 + i * 28, fx - 8, 95 + i * 28, "#60a5fa", 2.5);
    }
    m += L.text(fx - 130, 80, "α beam (5.5 MeV)", {size: 13, color: "#60a5fa", anchor: "start"});
    m += L.text(fx - 14, 270, "Bi-214 source", {size: 12, color: C.muted});
    var th = st.theta * Math.PI / 180;
    var arm = 190;
    var dx = fx + arm * Math.cos(th), dy = fy - arm * Math.sin(th);
    m += L.line(fx, fy, dx, dy, C.ok, 3);
    m += '<path d="M ' + (fx + 55) + ' ' + fy + ' A 55 55 0 0 0 ' + (fx + 55 * Math.cos(th)) + ' ' + (fy - 55 * Math.sin(th)) + '" fill="none" stroke="' + C.muted + '" stroke-width="1.5"/>';
    m += L.text(fx + 82 * Math.cos(th / 2), fy - 82 * Math.sin(th / 2) + 4, "θ = " + L.num(st.theta, 0) + "°", {size: 14, color: C.muted});
    m += L.rect(dx - 16, dy - 12, 32, 24, "#1e3a8a", ' rx="5" stroke="#93c5fd" stroke-width="2"');
    m += L.text(dx, dy + 4, "ZnS", {size: 12, color: "#dbeafe", weight: 700});
    m += L.text(dx + (dx > fx ? 26 : -26), dy - 16, "detector", {size: 12, color: C.muted});
    var hits = 1 + Math.floor(Math.min(28, rate(st.theta) / 45000));
    for(var k = 0; k < hits; k += 1){
      var aa = th + (k - 1.5) * 0.05;
      m += L.circle(fx + 70 * Math.cos(aa), fy - 70 * Math.sin(aa), 5, k === 0 ? C.ok : "#a7f3d0");
    }
    m += L.text(360, 40, "count rate ∝ 1 / sin⁴(θ/2)", {size: 18, color: C.text, weight: 700});
    L.svg(m, "Scattering bench with the detector at " + L.num(st.theta, 0) + " degrees.", 290);
    var r = rate(st.theta);
    var bar = Math.round(30 + (Math.log(r) / Math.log(6e5)) * 150);
    if(bar < 4) bar = 4;
    L.readout([
      ["Detector angle θ", L.num(st.theta, 0) + "°"],
      ["Relative count rate", L.num(r, 0), r > 2000 ? C.danger : C.ok],
      ["Scattering probability", r > 2000 ? "common (small-angle)" : (r > 20 ? "moderate" : "rare (large-angle)")],
      ["What the detector sees", hits + " flash" + (hits === 1 ? "" : "es") + " per interval", C.ok]
    ]);
    if(st.theta < 15){
      L.verdict("<b>Near the beam direction:</b> the count rate is enormous. Almost every α passes through the foil with little deflection — the atoms are mostly empty space.");
    } else if(st.theta < 90){
      L.verdict("<b>Intermediate angles:</b> only a small fraction of α-particles is scattered this far. The 1/sin⁴(θ/2) law, derived from Coulomb repulsion by a tiny nucleus, matches the data.");
    } else {
      L.verdict("<b>Backward scattering (θ > 90°):</b> about 1 α in 8000. These are the head-on near-encounters with a massive, concentrated positive charge — Rutherford's nucleus.");
    }
  }

  function select(id){
    st.theta = Number(id);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(b){
      b.classList.toggle("active", Number(b.getAttribute("data-preset")) === st.theta);
      b.setAttribute("aria-pressed", Number(b.getAttribute("data-preset")) === st.theta ? "true" : "false");
    });
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["10", "Forward (10°)"], ["45", "Mid (45°)"], ["90", "Sideways (90°)"], ["150", "Back (150°)"]], "10", select);
    L.controls('<div class="control-item"><label class="control-label" for="t2-th"><span>Detector angle θ</span><span class="val" id="t2-th-val">20°</span></label>' +
      '<input type="range" id="t2-th" min="5" max="175" step="5" value="20"></div>');
    L.onInput("t2-th", function(v){ st.theta = v; L.setVal("t2-th", L.num(v, 0) + "°"); L.markPreset(String(v)); draw(); });
    L.legend([["#60a5fa", "α beam"], ["#f59e0b", "gold foil"], [C.ok, "scintillation"], ["#93c5fd", "detector"]]);
    L.watch("Rotate the detector. The count rate collapses as θ grows — the signature of a tiny, dense nucleus.");
    st.theta = 20;
    draw();
  }

  window.SIMS.scatter = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Impact parameter and closest approach (NCERT §12.2.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {b: 40};
  var K = 5.5 * 1.6e-13;
  var D = 2 * 9e9 * 79 * 1.6e-19 * 1.6e-19 / K;   // head-on closest approach, m
  var DFM = D * 1e15;                               // in fm  (~41.4 fm)

  function angleFor(b){
    if(b <= 0.001) return 180;
    return 2 * Math.atan(DFM / 2 / b) * 180 / Math.PI;
  }

  function draw(){
    var theta = angleFor(st.b);
    var th = theta * Math.PI / 180;
    var m = "";
    var scale = 2.1;
    var cx = 360, cy = 160;
    m += L.circle(cx, cy, 7, C.danger);
    m += L.text(cx, cy + 5, "+", {size: 13, color: "#fff", weight: 700});
    m += L.text(cx + 16, cy - 14, "gold nucleus (Z = 79)", {size: 13, color: C.danger, anchor: "start"});
    var b = Math.max(st.b, 0.0001);
    var e = 1 / Math.sin(th / 2);
    var vmax = Math.PI / 2 + th / 2;
    var rmin = (DFM + Math.sqrt(DFM * DFM + 4 * st.b * st.b)) / 2;
    var alpha = (Math.PI - th) / 2;
    var pts = [];
    for(var i = 0; i <= 60; i += 1){
      var nu = vmax * 0.985 - (i / 60) * vmax * 1.97;
      var den = 1 + e * Math.cos(nu);
      var r = rmin * (1 + e) / den;
      var x = r * Math.cos(alpha + nu) * scale;
      var y = -r * Math.sin(alpha + nu) * scale;
      if(Math.abs(x) < 340 && Math.abs(y) < 135) pts.push([cx + x, cy + y]);
    }
    if(pts.length > 1){
      var d = "M" + pts[0][0] + " " + pts[0][1];
      for(var p = 1; p < pts.length; p += 1) d += " L" + pts[p][0] + " " + pts[p][1];
      m += '<path d="' + d + '" fill="none" stroke="' + C.ok + '" stroke-width="2.5"/>';
      var last = pts[pts.length - 1];
      m += L.circle(last[0], last[1], 5, C.ok);
    }
    m += L.line(cx - 330, cy + b * scale, cx + 330, cy + b * scale, "rgba(148,163,184,.5)", 1.5, "6 5");
    m += L.line(cx, cy, cx, cy + b * scale, "#f59e0b", 2);
    m += L.text(cx + 6, cy + b * scale / 2, "b = " + L.num(st.b, 0) + " fm", {size: 13, color: "#f59e0b", anchor: "start"});
    if(pts.length > 1){
      var lp = pts[pts.length - 1];
      m += L.arrow(lp[0] - 26, lp[1], lp[0] - 4, lp[1], C.ok, 2);
    }
    m += L.text(360, 40, "θ = " + L.num(theta, 0) + "°", {size: 22, color: C.text, weight: 700});
    L.svg(m, "Alpha trajectory with impact parameter " + L.num(st.b, 0) + " femtometres.", 300);
    L.readout([
      ["Impact parameter b", L.num(st.b, 0) + " fm", "#f59e0b"],
      ["Scattering angle θ", L.num(theta, 0) + "°", theta > 90 ? C.danger : C.ok],
      ["Closest approach", L.num(rmin, 1) + " fm"],
      ["Head-on distance d", L.num(DFM, 1) + " fm"]
    ]);
    if(st.b < 1){
      L.verdict("<b>Head-on collision:</b> the α stops momentarily at the distance of closest approach d ≈ 41 fm and rebounds straight back (θ = 180°). This is the event that sets an upper limit on the nuclear size.");
    } else if(theta > 90){
      L.verdict("<b>Close encounter:</b> b is only a few times the head-on distance, so the repulsion is strong enough to send the α back. Such events are rare because the target area is so small.");
    } else {
      L.verdict("<b>Grazing encounter:</b> at b = " + L.num(st.b, 0) + " fm the α passes well outside the strong-field region and is deflected by only " + L.num(theta, 0) + "°. Most α-particles in the real beam behave like this.");
    }
  }

  function select(id){
    st.b = Number(id);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(bt){
      bt.classList.toggle("active", Number(bt.getAttribute("data-preset")) === st.b);
      bt.setAttribute("aria-pressed", Number(bt.getAttribute("data-preset")) === st.b ? "true" : "false");
    });
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["90", "Grazing (b = 90 fm)"], ["20", "Close (b = 20 fm)"], ["5", "Very close (b = 5 fm)"], ["0", "Head-on (b = 0)"]], "90", select);
    L.controls('<div class="control-item"><label class="control-label" for="t3-b"><span>Impact parameter b</span><span class="val" id="t3-b-val">40 fm</span></label>' +
      '<input type="range" id="t3-b" min="0" max="100" step="1" value="40"></div>');
    L.onInput("t3-b", function(v){ st.b = v; L.setVal("t3-b", L.num(v, 0) + " fm"); draw(); });
    L.legend([["#f59e0b", "impact parameter b"], [C.ok, "α trajectory"], [C.danger, "gold nucleus"]]);
    L.watch("Drag b down to zero. The trajectory bends harder and harder until the α rebounds exactly along its incoming path.");
    draw();
  }

  window.SIMS.impact = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Rutherford orbit bench (NCERT §12.2.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {r: 0.53, collapse: false};

  function draw(){
    var r = st.r * 1e-10;
    var ke2 = 9e9 * 1.6e-19 * 1.6e-19;
    var K = ke2 / (2 * r) / 1.6e-19;
    var U = -ke2 / r / 1.6e-19;
    var E = -ke2 / (2 * r) / 1.6e-19;
    var v = Math.sqrt(ke2 / (9.11e-31 * r));
    var cx = 240, cy = 155;
    var rpx = 30 + st.r * 95;
    var m = "";
    m += L.circle(cx, cy, 9, C.danger);
    m += L.text(cx, cy + 5, "+", {size: 14, color: "#fff", weight: 700});
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rpx + '" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="6 5"/>';
    var ea = st.collapse ? 130 : 200;
    m += L.circle(cx + rpx * Math.cos(ea * Math.PI / 180), cy - rpx * Math.sin(ea * Math.PI / 180), 7, "#60a5fa");
    m += L.text(cx + rpx * Math.cos(ea * Math.PI / 180), cy - rpx * Math.sin(ea * Math.PI / 180) + 4, "−", {size: 12, color: "#dbeafe"});
    var ex = cx + rpx * Math.cos(ea * Math.PI / 180), ey = cy - rpx * Math.sin(ea * Math.PI / 180);
    m += L.arrow(ex, ey, cx + (rpx - 34) * Math.cos(ea * Math.PI / 180), cy - (rpx - 34) * Math.sin(ea * Math.PI / 180), C.ok, 2.5);
    m += L.arrow(cx, cy, cx + 52, cy, C.danger, 2.5);
    if(st.collapse){
      var sp = "";
      for(var i = 0; i < 70; i += 1){
        var rr = rpx * (1 - i / 74);
        var aa = ea * Math.PI / 180 + i * 0.22;
        sp += (i === 0 ? "M" : " L") + (cx + rr * Math.cos(aa)) + " " + (cy - rr * Math.sin(aa));
      }
      m += '<path d="' + sp + '" fill="none" stroke="' + C.danger + '" stroke-width="2"/>';
      m += L.text(560, 80, "radiates → spirals in", {size: 15, color: C.danger, weight: 700});
    }
    m += L.text(560, 130, "F = k e²/r²", {size: 18, color: C.text, weight: 700});
    m += L.text(560, 162, "v = " + L.num(v / 1e6, 2) + " × 10⁶ m/s", {size: 15, color: "#60a5fa"});
    m += L.text(560, 192, "E = " + L.num(E, 2) + " eV", {size: 15, color: C.text});
    L.svg(m, "Rutherford electron orbit of radius " + L.num(st.r, 2) + " angstrom.", 300);
    L.readout([
      ["Orbit radius r", L.num(st.r, 2) + " × 10⁻¹⁰ m"],
      ["Speed v", L.num(v / 1e6, 2) + " × 10⁶ m/s", "#60a5fa"],
      ["Kinetic energy K", "+" + L.num(K, 2) + " eV"],
      ["Potential energy U", L.num(U, 2) + " eV", C.danger],
      ["Total energy E", L.num(E, 2) + " eV", st.collapse ? C.danger : C.ok]
    ]);
    if(st.collapse){
      L.verdict("<b>Classical disaster:</b> an accelerating electron must radiate. Its energy decreases, the orbit shrinks, and the atom should collapse in about 10⁻¹¹ s while emitting a continuous smear of frequencies. Real hydrogen does neither.");
    } else {
      L.verdict("<b>Rutherford orbit:</b> the Coulomb attraction supplies the centripetal force, giving a definite speed for each radius. The total energy is always negative — the electron is bound. But classical physics still demands radiation.");
    }
  }

  function select(id){
    st.collapse = id === "collapse";
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["stable", "Rutherford orbit"], ["collapse", "Include classical radiation"]], "stable", select);
    L.controls('<div class="control-item"><label class="control-label" for="t4-r"><span>Orbit radius r</span><span class="val" id="t4-r-val">0.53 × 10⁻¹⁰ m</span></label>' +
      '<input type="range" id="t4-r" min="0.4" max="2.5" step="0.01" value="0.53"></div>');
    L.onInput("t4-r", function(v){ st.r = v; L.setVal("t4-r", L.num(v, 2) + " × 10⁻¹⁰ m"); draw(); });
    L.legend([["#475569", "orbit"], ["#60a5fa", "electron"], [C.danger, "nucleus / radiation"]]);
    L.watch("Change the radius and check the orbital relations. Then switch on classical radiation to see why the model fails.");
    draw();
  }

  window.SIMS.orbits = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Emission and absorption spectra (NCERT §12.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {mode: "emission", cursor: 656};
  var LINES = [[656, "Hα"], [486, "Hβ"], [434, "Hγ"], [410, "Hδ"]];

  function wlColor(nm){
    var r = 0, g = 0, b = 0;
    if(nm < 440){ r = -(nm - 440) / 60; b = 1; }
    else if(nm < 490){ g = (nm - 440) / 50; b = 1; }
    else if(nm < 510){ g = 1; b = -(nm - 510) / 20; }
    else if(nm < 580){ r = (nm - 510) / 70; g = 1; }
    else if(nm < 645){ r = 1; g = -(nm - 645) / 65; }
    else { r = 1; }
    return "rgb(" + Math.round(Math.max(0, Math.min(1, r)) * 255) + "," + Math.round(Math.max(0, Math.min(1, g)) * 255) + "," + Math.round(Math.max(0, Math.min(1, b)) * 255) + ")";
  }

  function xOf(nm){ return 70 + (nm - 380) / (750 - 380) * 580; }

  function draw(){
    var m = "";
    var x0 = 70, x1 = 650, y = 120, h = 62;
    if(st.mode === "emission"){
      m += L.rect(x0, y, x1 - x0, h, "#05070c", ' stroke="#334155" stroke-width="1.5" rx="4"');
      for(var i = 0; i < 4; i += 1){
        var lx = xOf(LINES[i][0]);
        m += L.line(lx, y + 6, lx, y + h - 6, wlColor(LINES[i][0]), 5);
        m += L.text(lx, y - 8, L.num(LINES[i][0], 0) + " nm", {size: 12, color: wlColor(LINES[i][0])});
      }
      m += L.text(360, 210, "bright lines on a dark background", {size: 15, color: C.muted});
    } else {
      for(var k = 0; k < 74; k += 1){
        var nm = 380 + k * 5 + 2.5;
        m += L.rect(xOf(nm) - 4, y, 8.2, h, wlColor(nm));
      }
      m += L.rect(x0, y, x1 - x0, h, "none", ' stroke="#334155" stroke-width="1.5" rx="4"');
      for(var j = 0; j < 4; j += 1){
        var lx2 = xOf(LINES[j][0]);
        m += L.line(lx2, y + 4, lx2, y + h - 4, "#05070c", 5);
        m += L.text(lx2, y + h + 22, L.num(LINES[j][0], 0) + " nm", {size: 12, color: "#e2e8f0"});
      }
      m += L.text(360, 210, "dark lines on a continuous rainbow", {size: 15, color: C.muted});
    }
    var cxp = xOf(st.cursor);
    m += L.line(cxp, y - 24, cxp, y + h + 34, "#f59e0b", 2, "5 4");
    m += L.text(cxp, y + h + 52, "cursor " + L.num(st.cursor, 0) + " nm", {size: 12, color: "#f59e0b"});
    m += L.text(360, 48, st.mode === "emission" ? "HYDROGEN EMISSION SPECTRUM" : "HYDROGEN ABSORPTION SPECTRUM", {size: 17, color: C.text, weight: 700});
    L.svg(m, "Hydrogen " + st.mode + " spectrum with a wavelength cursor.", 290);
    var nearest = LINES[0], best = 1e9;
    LINES.forEach(function(ln){
      var d = Math.abs(ln[0] - st.cursor);
      if(d < best){ best = d; nearest = ln; }
    });
    L.readout([
      ["View", st.mode === "emission" ? "emission" : "absorption", st.mode === "emission" ? C.ok : "#93c5fd"],
      ["Cursor λ", L.num(st.cursor, 0) + " nm"],
      ["Photon energy", L.num(1240 / st.cursor, 2) + " eV"],
      ["Nearest line", nearest[1] + " (" + nearest[0] + " nm), Δ = " + L.num(best, 0) + " nm", best < 8 ? C.ok : C.muted]
    ]);
    L.verdict(st.mode === "emission"
      ? "<b>Emission:</b> excited hydrogen atoms drop to lower levels and send out only the photon energies ΔE = E_i − E_f. The bright lines mark those exact wavelengths."
      : "<b>Absorption:</b> white light passing through hydrogen loses photons whose energy matches an upward jump. The dark lines fall at exactly the same wavelengths as the emission lines — an atomic fingerprint.");
  }

  function select(id){ st.mode = id; L.markPreset(id); draw(); }

  function mount(){
    labNoTimeline();
    L.presets([["emission", "Emission spectrum"], ["absorption", "Absorption spectrum"]], st.mode, select);
    L.controls('<div class="control-item"><label class="control-label" for="t5-l"><span>Wavelength cursor</span><span class="val" id="t5-l-val">656 nm</span></label>' +
      '<input type="range" id="t5-l" min="380" max="750" step="1" value="656"></div>');
    L.onInput("t5-l", function(v){ st.cursor = v; L.setVal("t5-l", L.num(v, 0) + " nm"); draw(); });
    L.legend([[C.ok, "bright line"], ["#05070c", "dark line"], ["#f59e0b", "cursor"]]);
    L.watch("Switch between emission and absorption. The lines sit at identical wavelengths because both involve the same energy gaps.");
    draw();
  }

  window.SIMS.spectra = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Bohr's quantum ladder (NCERT §12.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {n: 2};

  function draw(){
    var n = st.n;
    var cx = 250, cy = 155;
    var m = "";
    m += L.circle(cx, cy, 9, C.danger);
    m += L.text(cx, cy + 5, "+", {size: 14, color: "#fff", weight: 700});
    for(var i = 6; i >= 1; i -= 1){
      var rr = 18 + i * i * 3.2;
      var on = i === n;
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" fill="none" stroke="' + (on ? C.ok : "#334155") + '" stroke-width="' + (on ? 2.5 : 1.2) + '"' + (on ? "" : ' stroke-dasharray="4 5"') + '/>';
      m += L.text(cx, cy - rr - 3, "n=" + i, {size: 11, color: on ? C.ok : C.muted});
    }
    var rpx = 18 + n * n * 3.2;
    var ex = cx + rpx, ey = cy;
    m += L.circle(ex, ey, 7, "#60a5fa");
    m += L.text(ex, ey + 4, "−", {size: 12, color: "#dbeafe"});
    var bx = 470, by = 250;
    m += L.text(bx, 52, "ANGULAR MOMENTUM LADDER", {size: 14, color: C.text, weight: 700, anchor: "start"});
    for(var k = 1; k <= 6; k += 1){
      var yy = by - k * 30;
      var onk = k === n;
      m += L.line(bx, yy, bx + 150, yy, onk ? C.ok : "#475569", onk ? 4 : 2);
      m += L.text(bx + 160, yy + 5, "n=" + k + "  L=" + k + "(h/2π)", {size: 12, color: onk ? C.ok : C.muted, anchor: "start"});
    }
    L.svg(m, "Bohr orbits with angular momentum values up to n = 6.", 300);
    L.readout([
      ["Principal quantum number n", String(n), C.ok],
      ["Angular momentum L", n + " h/2π = " + L.num(n * 1.055, 2) + " × 10⁻³⁴ J s"],
      ["Orbit radius rₙ = n²a₀", L.num(n * n * 0.53, 2) + " Å", "#60a5fa"],
      ["Speed vₙ = 2.18/n × 10⁶ m/s", L.num(2.18 / n, 2) + " × 10⁶ m/s"],
      ["Energy Eₙ = −13.6/n² eV", L.num(-13.6 / (n * n), 2) + " eV", C.danger]
    ]);
    L.verdict("<b>Only whole-number rungs:</b> L must be an integer multiple of h/2π, so the electron can sit on n = " + n + " but nowhere in between. In a stationary state it does not radiate; light appears only when it jumps between rungs.");
  }

  function mount(){
    labNoTimeline();
    L.controls('<div class="control-item"><label class="control-label" for="t6-n"><span>Principal quantum number n</span><span class="val" id="t6-n-val">2</span></label>' +
      '<input type="range" id="t6-n" min="1" max="6" step="1" value="2"></div>');
    L.onInput("t6-n", function(v){ st.n = Number(v); L.setVal("t6-n", String(v)); draw(); });
    L.legend([["#334155", "other allowed orbits"], [C.ok, "current orbit"], ["#60a5fa", "electron"]]);
    L.watch("Step n upward. Radius grows as n², speed falls as 1/n, and angular momentum rises in exact units of h/2π.");
    draw();
  }

  window.SIMS.bohrpost = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Hydrogen energy-level explorer (NCERT §12.4.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {ni: 3, nf: 2};

  function E(n){ return -13.6 / (n * n); }

  function yOf(e){ return 250 - (e + 13.6) / 13.6 * 195; }

  function seriesName(nf){
    if(nf === 1) return "Lyman (ultraviolet)";
    if(nf === 2) return "Balmer (visible)";
    return "Paschen (infrared)";
  }

  function draw(){
    var m = "";
    var xL = 90, xR = 400;
    for(var n = 1; n <= 6; n += 1){
      var y = yOf(E(n));
      var on = (n === st.ni || n === st.nf);
      m += L.line(xL, y, xR, y, on ? C.ok : "#475569", on ? 2.6 : 1.4);
      m += L.text(xL - 10, y + 5, "n=" + n, {size: 12, color: on ? C.ok : C.muted, anchor: "end"});
      m += L.text(xR + 8, y + 5, L.num(E(n), 2) + " eV", {size: 12, color: on ? C.ok : C.muted, anchor: "start"});
    }
    m += L.line(xL, 55, xR, 55, "#334155", 1.4, "5 4");
    m += L.text(xR + 8, 60, "0 eV (free)", {size: 12, color: C.muted, anchor: "start"});
    var y1 = yOf(E(st.ni)), y2 = yOf(E(st.nf));
    var xa = 300;
    m += L.arrow(xa, y1, xa, y2, C.ok, 3);
    var dE = E(st.ni) - E(st.nf);
    var lam = 1240 / dE;
    m += L.text(430, (y1 + y2) / 2, "ΔE = " + L.num(dE, 2) + " eV", {size: 15, color: C.ok, anchor: "start", weight: 700});
    m += L.text(430, (y1 + y2) / 2 + 22, "λ = " + L.num(lam, 1) + " nm", {size: 14, color: "#60a5fa", anchor: "start"});
    m += L.text(430, (y1 + y2) / 2 + 44, seriesName(st.nf), {size: 13, color: C.muted, anchor: "start"});
    m += L.text(210, 282, "photon emitted on the downward jump", {size: 13, color: C.muted});
    L.svg(m, "Hydrogen energy levels with a transition from n = " + st.ni + " to n = " + st.nf + ".", 300);
    L.readout([
      ["Upper level n_i", String(st.ni)],
      ["Lower level n_f", String(st.nf)],
      ["Photon energy", L.num(dE, 2) + " eV", C.ok],
      ["Wavelength", L.num(lam, 1) + " nm", "#60a5fa"],
      ["Series", seriesName(st.nf)]
    ]);
    if(st.nf === 1){
      L.verdict("<b>Lyman series:</b> every jump to n = 1 releases more than 10 eV, so the photon is ultraviolet. These lines are seen only from hot, excited hydrogen.");
    } else if(st.nf === 2){
      L.verdict("<b>Balmer series:</b> jumps to n = 2 release 1.9–3.4 eV, landing in the visible. Hα at 656 nm is the brightest line in many astronomical objects.");
    } else {
      L.verdict("<b>Paschen series:</b> jumps to n = 3 release less than 1.5 eV, producing infrared photons. The gaps shrink as n grows, so the lines crowd toward the series limit.");
    }
  }

  function select(id){
    st.nf = Number(id);
    // A transition needs an upper level: the Paschen preset must start from
    // n_i = 4 so that n_i -> n_f = 3 describes the real Paschen-alpha line.
    if(st.ni <= st.nf) st.ni = st.nf + 1;
    L.markPreset(id);
    var slider = document.getElementById("t7-ni");
    if(slider) slider.value = st.ni;
    L.setVal("t7-ni", String(st.ni));
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["1", "End at n = 1 (Lyman)"], ["2", "End at n = 2 (Balmer)"], ["3", "End at n = 3 (Paschen)"]], "2", select);
    L.controls('<div class="control-item"><label class="control-label" for="t7-ni"><span>Upper level n_i</span><span class="val" id="t7-ni-val">3</span></label>' +
      '<input type="range" id="t7-ni" min="2" max="6" step="1" value="3"></div>');
    L.onInput("t7-ni", function(v){
      st.ni = Number(v);
      if(st.ni <= st.nf){ st.nf = st.ni - 1; if(st.nf < 1) st.nf = 1; L.markPreset(String(st.nf)); }
      L.setVal("t7-ni", String(st.ni));
      draw();
    });
    L.legend([["#475569", "allowed levels"], [C.ok, "transition"], ["#60a5fa", "photon"]]);
    L.watch("Move n_i and pick a final level. Watch the photon energy and wavelength — and which series it belongs to.");
    draw();
  }

  window.SIMS.energylevels = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Hydrogen spectral series explorer (NCERT §12.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {series: "balmer", ni: 3};

  function nfOf(s){ return s === "lyman" ? 1 : (s === "balmer" ? 2 : 3); }
  function E(n){ return -13.6 / (n * n); }

  function xOf(nm){
    var lo = Math.log(85), hi = Math.log(2000);
    return 80 + (Math.log(nm) - lo) / (hi - lo) * 560;
  }

  function draw(){
    var nf = nfOf(st.series);
    var m = "";
    m += L.text(360, 42, "HYDROGEN SERIES ON A LOGARITHMIC WAVELENGTH AXIS", {size: 15, color: C.text, weight: 700});
    var y = 90, h = 70;
    m += L.rect(70, y, 570, h, "#05070c", ' rx="5"');
    m += L.rect(70, y, xOf(380) - 70, h, "rgba(96,165,250,.13)");
    m += L.rect(xOf(380), y, xOf(750) - xOf(380), h, "rgba(52,211,153,.10)");
    m += L.rect(xOf(750), y, 640 - xOf(750), h, "rgba(244,114,182,.12)");
    m += L.text((70 + xOf(380)) / 2, y + h + 20, "UV", {size: 12, color: "#93c5fd"});
    m += L.text((xOf(380) + xOf(750)) / 2, y + h + 20, "visible", {size: 12, color: C.ok});
    m += L.text((xOf(750) + 640) / 2, y + h + 20, "infrared", {size: 12, color: "#f9a8d4"});
    [100, 200, 400, 700, 1000, 2000].forEach(function(t){
      m += L.line(xOf(t), y + h, xOf(t), y + h + 6, C.muted, 1);
      m += L.text(xOf(t), y + h + 22, String(t), {size: 10, color: C.muted});
    });
    for(var ni = nf + 1; ni <= 7; ni += 1){
      var dE = E(ni) - E(nf);
      var lam = 1240 / dE;
      var lx = xOf(lam);
      var on = ni === st.ni;
      m += L.line(lx, y + 8, lx, y + h - 8, on ? C.ok : "#64748b", on ? 5 : 2.5);
      m += L.text(lx, y - 8, "n=" + ni, {size: 11, color: on ? C.ok : C.muted});
    }
    var dE2 = E(st.ni) - E(nf);
    var lam2 = 1240 / dE2;
    m += L.line(xOf(lam2), y, xOf(lam2), y + h, "#f59e0b", 1.6, "4 4");
    m += L.text(360, 240, st.series.toUpperCase() + " SERIES:  n_i = " + st.ni + " → n_f = " + nf, {size: 17, color: C.text, weight: 700});
    m += L.text(360, 266, "λ = " + L.num(lam2, 1) + " nm    ΔE = " + L.num(dE2, 2) + " eV", {size: 15, color: C.ok});
    L.svg(m, "Hydrogen " + st.series + " series with the transition from n = " + st.ni + ".", 300);
    L.readout([
      ["Series", st.series.charAt(0).toUpperCase() + st.series.slice(1)],
      ["Transition", "n_i = " + st.ni + " → n_f = " + nf],
      ["Photon energy", L.num(dE2, 2) + " eV", C.ok],
      ["Wavelength", L.num(lam2, 1) + " nm", "#60a5fa"],
      ["Region", lam2 < 380 ? "ultraviolet" : (lam2 < 750 ? "visible" : "infrared")]
    ]);
    L.verdict("<b>" + st.series.charAt(0).toUpperCase() + st.series.slice(1) + " series:</b> each downward jump to n_f = " + nf + " emits one photon. The lines crowd toward the series limit at " + L.num(13.6 / (nf * nf) * 0 + 1240 / (13.6 / (nf * nf)), 1) + " nm as n_i → ∞.");
  }

  function select(id){
    st.series = id;
    var nf = nfOf(id);
    if(st.ni <= nf) st.ni = nf + 1;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["lyman", "Lyman (n_f = 1)"], ["balmer", "Balmer (n_f = 2)"], ["paschen", "Paschen (n_f = 3)"]], "balmer", select);
    L.controls('<div class="control-item"><label class="control-label" for="t8-ni"><span>Upper level n_i</span><span class="val" id="t8-ni-val">3</span></label>' +
      '<input type="range" id="t8-ni" min="2" max="7" step="1" value="3"></div>');
    L.onInput("t8-ni", function(v){
      st.ni = Number(v);
      var nf = nfOf(st.series);
      if(st.ni <= nf){ st.ni = nf + 1; }
      L.setVal("t8-ni", String(st.ni));
      draw();
    });
    L.legend([["#64748b", "series lines"], [C.ok, "selected line"], ["#f59e0b", "marker"]]);
    L.watch("Pick a series and step n_i. The line moves toward the series limit as the upper level climbs.");
    draw();
  }

  window.SIMS.linespectrum = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Standing electron waves on Bohr orbits (NCERT §12.6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {n: 4, mismatch: false};

  function draw(){
    var n = st.n;
    var cx = 250, cy = 155;
    var r = 26 + n * n * 3.1;
    var m = "";
    m += L.circle(cx, cy, 9, C.danger);
    m += L.text(cx, cy + 5, "+", {size: 14, color: "#fff", weight: 700});
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#475569" stroke-width="1.2" stroke-dasharray="4 5"/>';
    var turns = st.mismatch ? n + 0.5 : n;
    var path = "";
    for(var i = 0; i <= 360; i += 2){
      var a = i * Math.PI / 180;
      var rr = r + 9 * Math.sin(turns * a);
      var x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
      path += (i === 0 ? "M" : " L") + x + " " + y;
    }
    m += '<path d="' + path + '" fill="none" stroke="' + (st.mismatch ? C.danger : C.ok) + '" stroke-width="2.4"/>';
    var circ = 2 * Math.PI * (n * n * 0.53) * 1e-10;
    var lam = 6.63e-34 / (9.11e-31 * 2.18e6 / n);
    m += L.text(470, 70, "2πr_n = n λ", {size: 22, color: st.mismatch ? C.danger : C.ok, weight: 700, anchor: "start"});
    m += L.text(470, 105, "r_n = " + L.num(n * n * 0.53, 2) + " Å", {size: 14, color: C.text, anchor: "start"});
    m += L.text(470, 130, "2πr_n = " + L.num(circ * 1e9, 2) + " nm", {size: 14, color: C.text, anchor: "start"});
    m += L.text(470, 155, "λ_deB = " + L.num(lam * 1e9, 2) + " nm", {size: 14, color: "#60a5fa", anchor: "start"});
    m += L.text(470, 180, "λ fits " + (st.mismatch ? L.num(n + 0.5, 1) : String(n)) + " time(s)", {size: 14, color: st.mismatch ? C.danger : C.ok, anchor: "start"});
    m += L.text(470, 205, "m v r = " + (st.mismatch ? "?" : n) + " h/2π", {size: 14, color: C.muted, anchor: "start"});
    L.svg(m, "A standing electron wave with " + (st.mismatch ? "a mismatched" : n + " whole") + " wavelengths around a Bohr orbit.", 300);
    L.readout([
      ["Quantum number n", String(n)],
      ["Orbit radius rₙ", L.num(n * n * 0.53, 2) + " Å"],
      ["de Broglie λ", L.num(lam * 1e10, 2) + " × 10⁻¹⁰ m", "#60a5fa"],
      ["Wavelengths around orbit", st.mismatch ? L.num(n + 0.5, 1) + " (not an integer)" : String(n), st.mismatch ? C.danger : C.ok],
      ["Standing wave?", st.mismatch ? "No — the wave cancels itself" : "Yes — closes smoothly", st.mismatch ? C.danger : C.ok]
    ]);
    if(st.mismatch){
      L.verdict("<b>Mismatch:</b> with " + (n + 0.5) + " wavelengths the wave meets its own tail out of step, interferes destructively, and cannot persist. Only whole numbers of wavelengths are allowed.");
    } else {
      L.verdict("<b>Standing wave:</b> exactly n wavelengths fit around the orbit, so the wave closes smoothly on itself. This is why the angular momentum comes in units of h/2π and why only discrete orbits exist.");
    }
  }

  function select(id){
    st.mismatch = id === "mismatch";
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["standing", "Whole wavelengths (standing)"], ["mismatch", "Half wavelength extra (cancels)"]], "standing", select);
    L.controls('<div class="control-item"><label class="control-label" for="t9-n"><span>Quantum number n</span><span class="val" id="t9-n-val">4</span></label>' +
      '<input type="range" id="t9-n" min="1" max="6" step="1" value="4"></div>');
    L.onInput("t9-n", function(v){ st.n = Number(v); L.setVal("t9-n", String(v)); draw(); });
    L.legend([["#475569", "orbit path"], [C.ok, "allowed standing wave"], [C.danger, "cancelling wave"]]);
    L.watch("Compare the two modes. The whole-wavelength wave is stable; the extra half-wave destroys itself.");
    draw();
  }

  window.SIMS.debroglie = {mount: mount, draw: draw, select: select, state: st};
})();
