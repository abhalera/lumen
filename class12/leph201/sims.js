// Class 12 Physics, Chapter 9 (leph201) — simulation labs.
// One lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Reflection bench (NCERT §9.1–9.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {ang: 45, tilt: 0};

  function deg(x){ return x * Math.PI / 180; }

  function draw(){
    var a = deg(st.ang), t = deg(st.tilt);
    var px = 360, py = 200;
    var m = "";
    // mirror line, rotated by tilt about the point of incidence
    var hx = 260 * Math.cos(t), hy = 260 * Math.sin(t);
    m += L.line(px - hx, py + hy, px + hx, py - hy, "#94a3b8", 6);
    m += L.text(px + hx * 0.96, py - hy * 0.96 - 12, "mirror", {size: 13, color: C.muted});
    // normal (perpendicular to mirror)
    var nx = -Math.sin(t), ny = Math.cos(t);
    m += L.line(px - 200 * nx, py + 200 * ny, px + 200 * nx, py - 200 * ny, C.faint, 1.6, "6 5");
    m += L.text(px + 14, py - 150, "normal", {size: 12, color: C.muted, anchor: "start"});
    // incident ray: direction rotated by a from the normal
    var ix = Math.sin(t + a), iy = -Math.cos(t + a);
    m += L.arrow(px - 230 * ix, py - 230 * iy, px, py, "#38bdf8", 3);
    var rx = Math.sin(t - a + 2 * t), ry = -Math.cos(t - a + 2 * t);
    m += L.arrow(px, py, px + 230 * rx, py + 230 * ry, "#f59e0b", 3);
    m += L.text(px - 90, py - 150, "incident i = " + L.num(st.ang, 0) + "°", {size: 14, color: "#38bdf8"});
    m += L.text(px + 120, py - 150, "reflected r = " + L.num(st.ang, 0) + "°", {size: 14, color: "#f59e0b"});
    if(st.tilt !== 0){
      m += L.text(360, 270, "mirror turned " + L.num(st.tilt, 0) + "° → reflected ray turned " + L.num(2 * st.tilt, 0) + "°", {size: 14, color: C.danger});
    }
    L.svg(m, "A ray reflecting from a plane mirror, with the angles marked from the normal.", 300);
    L.readout([
      ["Angle of incidence", L.num(st.ang, 0) + "°", "#38bdf8"],
      ["Angle of reflection", L.num(st.ang, 0) + "°", "#f59e0b"],
      ["Mirror rotation", L.num(st.tilt, 0) + "°", C.muted],
      ["Reflected-ray rotation", L.num(2 * st.tilt, 0) + "°", st.tilt ? C.danger : C.muted]
    ]);
    L.verdict(st.tilt
      ? "<b>Rotate the mirror:</b> the normal turns with the mirror, so the reflected ray turns through twice the mirror angle. That doubling is why mirror galvanometers are so sensitive."
      : "<b>∠i = ∠r.</b> Vary the angle of incidence: the reflected ray always leaves at the same angle on the other side of the normal.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("r1-a", "Angle of incidence", 0, 80, 5, st.ang, L.num(st.ang, 0) + "°") +
      L.slider("r1-t", "Tilt the mirror", -30, 30, 5, st.tilt, L.num(st.tilt, 0) + "°")
    );
    L.onInput("r1-a", function(v){ st.ang = v; L.setVal("r1-a", L.num(v, 0) + "°"); draw(); });
    L.onInput("r1-t", function(v){ st.tilt = v; L.setVal("r1-t", L.num(v, 0) + "°"); draw(); });
    L.legend([["#38bdf8", "incident ray"], ["#f59e0b", "reflected ray"], [C.faint, "normal"]]);
    L.watch("Change the angle of incidence, then tilt the mirror. The law of reflection holds at every setting.");
    draw();
  }

  window.SIMS.rayreflect = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Cartesian sign convention (NCERT §9.2.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "concave", x: 30, R: 40};
  var POLE = 560, SCALE = 6;

  function f(){ return st.preset === "concave" ? -st.R / 2 : st.R / 2; }

  function draw(){
    var fl = f(), u = -st.x;
    var v = 1 / (1 / fl - 1 / u);
    var mag = (v === 0) ? 0 : -v / u;
    var m = "";
    m += L.line(40, 190, 680, 190, C.faint, 2);
    m += L.text(680, 212, "+ direction of incident light", {size: 12, color: C.muted, anchor: "end"});
    // mirror
    if(st.preset === "concave"){
      m += '<path d="M ' + POLE + ' 60 Q ' + (POLE - 34) + ' 190, ' + POLE + ' 320" fill="none" stroke="#94a3b8" stroke-width="5"/>';
    } else {
      m += '<path d="M ' + (POLE - 30) + ' 60 Q ' + POLE + ' 190, ' + (POLE - 30) + ' 320" fill="none" stroke="#94a3b8" stroke-width="5"/>';
    }
    m += L.circle(POLE, 190, 5, C.text) + L.text(POLE + 14, 175, "P", {size: 13, color: C.text});
    // focus and centre
    var xf = POLE + fl * SCALE;
    m += L.circle(xf, 190, 4, C.ok) + L.text(xf, 218, "F", {size: 13, color: C.ok});
    var xc = POLE + 2 * fl * SCALE;
    m += L.circle(xc, 190, 4, C.danger) + L.text(xc, 218, "C", {size: 13, color: C.danger});
    // object
    var xo = POLE - st.x * SCALE;
    if(xo > 40) m += L.arrow(xo, 190, xo, 120, C.danger, 4) + L.text(xo, 108, "object", {size: 13, color: C.danger});
    // image
    var xi = POLE + v * SCALE;
    var hh = 70 * mag;
    if(xi > 60 && xi < 700){
      if(v < 0){
        m += L.arrow(xi, 190, xi, 190 - hh, C.ok, 4) + L.text(xi, 190 - hh - 10, "real image", {size: 13, color: C.ok});
      } else {
        m += L.line(xi, 190, xi, 190 + hh, C.ok, 3, "6 4");
        m += L.text(xi, 190 + hh + 18, "virtual image", {size: 13, color: C.ok});
      }
    }
    L.svg(m, "Object, focus, centre and image positions on the principal axis with Cartesian signs.", 300);
    L.readout([
      ["u (object)", "−" + L.num(st.x, 0) + " cm", C.danger],
      ["f", L.num(fl, 1) + " cm", C.ok],
      ["v (image)", L.num(v, 1) + " cm", v < 0 ? C.ok : "#a78bfa"],
      ["Nature", v < 0 ? "real, " + (mag < 0 ? "inverted" : "erect") : "virtual, " + (mag > 0 ? "erect" : "inverted"), C.text]
    ]);
    L.verdict("<b>Signs tell the story.</b> " + (st.preset === "concave" ? "A concave mirror has f negative; " : "A convex mirror has f positive; ") + "v < 0 means the image is real and in front of the mirror, v > 0 means it is virtual and behind.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["concave", "Concave mirror"], ["convex", "Convex mirror"]], st.preset, select);
    L.controls(
      L.slider("r2-x", "Object distance (magnitude)", 5, 70, 1, st.x, L.num(st.x, 0) + " cm") +
      L.slider("r2-R", "Radius of curvature R", 20, 100, 5, st.R, L.num(st.R, 0) + " cm")
    );
    L.onInput("r2-x", function(v){ st.x = v; L.setVal("r2-x", L.num(v, 0) + " cm"); draw(); });
    L.onInput("r2-R", function(v){ st.R = v; L.setVal("r2-R", L.num(v, 0) + " cm"); draw(); });
    L.legend([[C.danger, "object"], [C.ok, "image & focus"], ["#94a3b8", "mirror"]]);
    L.watch("Move the object and change R. Watch the signs of u, f and v change the position and nature of the image.");
    draw();
  }

  window.SIMS.signcon = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Mirror equation bench (NCERT §9.2.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "concave", f: 20, x: 30};
  var AX = 360, POLE = 620, SCALE = 5;

  function draw(){
    var fl = st.preset === "concave" ? -st.f : st.f;
    var u = -st.x;
    var v = 1 / (1 / fl - 1 / u);
    var mag = -v / u;
    var m = "";
    m += L.line(30, 180, 700, 180, C.faint, 2);
    if(st.preset === "concave"){
      m += '<path d="M ' + POLE + ' 40 Q ' + (POLE - 40) + ' 180, ' + POLE + ' 320" fill="none" stroke="#94a3b8" stroke-width="5"/>';
    } else {
      m += '<path d="M ' + (POLE - 30) + ' 40 Q ' + POLE + ' 180, ' + (POLE - 30) + ' 320" fill="none" stroke="#94a3b8" stroke-width="5"/>';
    }
    m += L.circle(POLE + fl * SCALE, 180, 4, C.ok) + L.text(POLE + fl * SCALE, 208, "F", {size: 13, color: C.ok});
    // object
    var xo = POLE - st.x * SCALE;
    var ho = 70;
    if(xo > 30) m += L.arrow(xo, 180, xo, 180 - ho, C.danger, 4);
    // two construction rays
    var xf = POLE + fl * SCALE;
    m += L.line(xo, 180 - ho, POLE, 180 - ho, "rgba(56,189,248,.55)", 2);
    m += L.line(POLE, 180 - ho, xf, 180, "rgba(56,189,248,.55)", 2);
    m += L.line(xo, 180 - ho, POLE, 180, "rgba(245,158,11,.6)", 2);
    m += L.line(POLE, 180, xo - st.x * SCALE, 180 - (st.x * 0) - ho, "rgba(245,158,11,.25)", 1.6, "5 4");
    // image
    var xi = POLE + v * SCALE;
    var hi = ho * mag;
    if(xi > 30 && xi < 710){
      if(v < 0){
        m += L.arrow(xi, 180, xi, 180 - hi, C.ok, 4);
        m += L.text(xi, 180 - hi - 12, "image v = " + L.num(v, 0) + " cm", {size: 13, color: C.ok});
      } else {
        m += L.line(xi, 180, xi, 180 + hi, C.ok, 3, "6 4");
        m += L.text(xi, 180 + hi + 18, "virtual image", {size: 13, color: C.ok});
      }
    }
    L.svg(m, "Ray construction for a " + st.preset + " mirror with object distance " + st.x + " cm.", 300);
    L.readout([
      ["f", L.num(fl, 1) + " cm", C.ok],
      ["u", "−" + L.num(st.x, 0) + " cm", C.danger],
      ["v", L.num(v, 1) + " cm", v < 0 ? C.ok : "#a78bfa"],
      ["m = −v/u", L.num(mag, 2), mag < 0 ? C.danger : C.ok]
    ]);
    L.verdict("<b>Check the equation:</b> 1/v + 1/u = " + L.num(1 / v, 4) + " + (" + L.num(1 / u, 4) + ") = " + L.num(1 / v + 1 / u, 4) + " cm⁻¹, which equals 1/f = " + L.num(1 / fl, 4) + " cm⁻¹. " + (v < 0 ? "The image is real and inverted." : "The image is virtual and erect."));
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["concave", "Concave mirror"], ["convex", "Convex mirror"]], st.preset, select);
    L.controls(
      L.slider("r3-f", "Focal length (magnitude)", 5, 60, 1, st.f, L.num(st.f, 0) + " cm") +
      L.slider("r3-x", "Object distance", 3, 90, 1, st.x, L.num(st.x, 0) + " cm")
    );
    L.onInput("r3-f", function(v){ st.f = v; L.setVal("r3-f", L.num(v, 0) + " cm"); draw(); });
    L.onInput("r3-x", function(v){ st.x = v; L.setVal("r3-x", L.num(v, 0) + " cm"); draw(); });
    L.legend([[C.danger, "object"], [C.ok, "image"], ["#38bdf8", "parallel ray"], ["#f59e0b", "pole ray"]]);
    L.watch("Slide the object across the focus. The image flips from real and inverted to virtual and erect as u passes f.");
    draw();
  }

  window.SIMS.mirrorbench = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Refraction and Snell's law (NCERT §9.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "water", i: 45};
  var N = {water: 1.33, glass: 1.50, diamond: 2.42};

  function draw(){
    var n = N[st.preset];
    var a = st.i * Math.PI / 180;
    var px = 360, py = 170;
    var r = Math.asin(Math.sin(a) / n);
    var m = "";
    m += L.rect(30, 20, 660, 150, "rgba(56,189,248,.06)", ' rx="10" stroke="none"');
    m += L.line(30, py, 690, py, C.faint, 2.5);
    m += L.text(80, 50, "AIR (n = 1)", {size: 14, color: C.muted});
    m += L.text(80, py + 40, st.preset.toUpperCase() + " (n = " + L.num(n, 2) + ")", {size: 14, color: "#38bdf8"});
    m += L.line(px, py - 130, px, py + 130, C.faint, 1.6, "6 5");
    m += L.text(px + 12, py - 120, "normal", {size: 12, color: C.muted, anchor: "start"});
    m += L.arrow(px - 210 * Math.sin(a), py - 210 * Math.cos(a), px, py, "#38bdf8", 3);
    m += L.arrow(px, py, px + 210 * Math.sin(r), py + 210 * Math.cos(r), "#f59e0b", 3);
    m += L.text(px - 120, py - 90, "i = " + L.num(st.i, 0) + "°", {size: 14, color: "#38bdf8"});
    m += L.text(px + 80, py + 100, "r = " + L.num(r * 180 / Math.PI, 1) + "°", {size: 14, color: "#f59e0b"});
    L.svg(m, "A ray bending as it passes from air into " + st.preset + ".", 300);
    L.readout([
      ["Medium", st.preset + " (n = " + L.num(n, 2) + ")", "#38bdf8"],
      ["sin i / sin r", L.num(Math.sin(a) / Math.sin(r), 3), C.ok],
      ["Speed in medium", L.num(3 / n, 2) + " × 10⁸ m/s"],
      ["Wavelength in medium", L.num(500 / n, 0) + " nm (from 500 nm)"]
    ]);
    L.verdict("<b>Snell's law holds.</b> sin i / sin r equals " + L.num(n, 2) + " — the refractive index of " + st.preset + " — for every angle you choose. The ray bends toward the normal because it slows down.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["water", "Air → water"], ["glass", "Air → glass"], ["diamond", "Air → diamond"]], st.preset, select);
    L.controls(L.slider("r4-i", "Angle of incidence", 0, 89, 1, st.i, L.num(st.i, 0) + "°"));
    L.onInput("r4-i", function(v){ st.i = v; L.setVal("r4-i", L.num(v, 0) + "°"); draw(); });
    L.legend([["#38bdf8", "incident ray"], ["#f59e0b", "refracted ray"], [C.faint, "normal"]]);
    L.watch("Sweep the angle of incidence in each medium. The ratio sin i / sin r stays equal to n.");
    draw();
  }

  window.SIMS.refract = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Total internal reflection (NCERT §9.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "water", i: 30};
  var N = {water: 1.33, glass: 1.50, diamond: 2.42};

  function draw(){
    var n = N[st.preset];
    var ic = Math.asin(1 / n);
    var a = st.i * Math.PI / 180;
    var px = 360, py = 150;
    var tir = a > ic;
    var r = tir ? null : Math.asin(n * Math.sin(a));
    var m = "";
    m += L.rect(30, py, 660, 140, "rgba(56,189,248,.08)", ' rx="10" stroke="none"');
    m += L.line(30, py, 690, py, C.faint, 2.5);
    m += L.text(640, py - 14, "AIR (n = 1)", {size: 14, color: C.muted, anchor: "end"});
    m += L.text(80, py + 34, st.preset.toUpperCase() + " (n = " + L.num(n, 2) + ")", {size: 14, color: "#38bdf8"});
    m += L.line(px, py - 120, px, py + 120, C.faint, 1.6, "6 5");
    // critical angle marker
    var cx = px - 150 * Math.sin(ic), cy = py + 150 * Math.cos(ic);
    m += L.line(px, py, cx, cy, C.danger, 1.8, "4 4");
    m += L.text(cx - 30, cy + 16, "i_c = " + L.num(ic * 180 / Math.PI, 1) + "°", {size: 13, color: C.danger});
    // incident ray from denser medium
    m += L.arrow(px - 190 * Math.sin(a), py + 190 * Math.cos(a), px, py, "#38bdf8", 3);
    m += L.text(px - 140, py + 100, "i = " + L.num(st.i, 0) + "°", {size: 14, color: "#38bdf8"});
    if(tir){
      m += L.arrow(px, py, px + 190 * Math.sin(a), py + 190 * Math.cos(a), "#f59e0b", 3);
      m += L.text(px + 130, py + 96, "all reflected", {size: 14, color: "#f59e0b"});
    } else {
      m += L.arrow(px, py, px + 190 * Math.sin(r), py - 190 * Math.cos(r), "#f59e0b", 3);
      m += L.text(px + 120, py - 90, "r = " + L.num(r * 180 / Math.PI, 1) + "°", {size: 14, color: "#f59e0b"});
    }
    L.svg(m, "Light travelling from " + st.preset + " to air; total internal reflection when the incidence exceeds the critical angle.", 300);
    L.readout([
      ["Medium", st.preset + " (n = " + L.num(n, 2) + ")"],
      ["Critical angle", L.num(ic * 180 / Math.PI, 1) + "°", C.danger],
      ["Refraction", tir ? "none — TIR" : "r = " + L.num(r * 180 / Math.PI, 1) + "°", tir ? C.danger : "#f59e0b"],
      ["Reflection", tir ? "100% reflected" : "partial", tir ? C.ok : C.muted]
    ]);
    L.verdict(tir
      ? "<b>Total internal reflection.</b> Beyond the critical angle no refracted ray can exist: the surface acts as a perfect mirror, which is how optical fibres guide light."
      : "<b>Both rays exist.</b> Below the critical angle part of the light refracts into the air and part reflects back. Push the angle past " + L.num(ic * 180 / Math.PI, 1) + "° to switch to TIR.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["water", "Water → air"], ["glass", "Glass → air"], ["diamond", "Diamond → air"]], st.preset, select);
    L.controls(L.slider("r5-i", "Angle of incidence", 0, 89, 1, st.i, L.num(st.i, 0) + "°"));
    L.onInput("r5-i", function(v){ st.i = v; L.setVal("r5-i", L.num(v, 0) + "°"); draw(); });
    L.legend([["#38bdf8", "incident ray"], ["#f59e0b", "refracted / reflected"], [C.danger, "critical angle"]]);
    L.watch("Increase the incidence angle past the critical angle and watch the refracted ray disappear.");
    draw();
  }

  window.SIMS.tirbench = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Refraction at a spherical surface (NCERT §9.5.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {n2: 1.5, R: 20, x: 30};
  var V = 360, SCALE = 5;

  function draw(){
    var n1 = 1, u = -st.x;
    var denom = (st.n2 - n1) / st.R + n1 / u;
    var v = Math.abs(denom) < 1e-9 ? 1e9 : st.n2 / denom;
    if(v > 1e6 || v < -1e6) v = (denom > 0 ? 1e9 : -1e9);
    var m = "";
    m += L.line(20, 170, 700, 170, C.faint, 2);
    // spherical surface: convex toward the incoming (left) for R > 0
    var curve = st.R > 0 ? 1 : -1;
    m += '<path d="M ' + (V + 20 * curve) + ' 30 Q ' + (V - 50 * curve) + ' 170, ' + (V + 20 * curve) + ' 310" fill="none" stroke="#94a3b8" stroke-width="4"/>';
    m += L.circle(V + st.R * SCALE * curve, 170, 4, C.danger);
    m += L.text(V + st.R * SCALE * curve, 198, "C", {size: 13, color: C.danger});
    m += L.text(80, 50, "n₁ = 1 (air)", {size: 14, color: C.muted});
    m += L.text(600, 50, "n₂ = " + L.num(st.n2, 2), {size: 14, color: "#38bdf8"});
    // object
    var xo = V - st.x * SCALE;
    if(xo > 20) m += L.arrow(xo, 170, xo, 105, C.danger, 4) + L.text(xo, 94, "object", {size: 13, color: C.danger});
    // image
    var xi = V + v * SCALE;
    if(xi > 30 && xi < 700){
      m += L.line(xi, 170, xi, 220, C.ok, 4) + L.text(xi, 240, "image", {size: 13, color: C.ok});
    }
    L.svg(m, "A spherical refracting surface with the object and image positions.", 300);
    L.readout([
      ["n₁ → n₂", "1.00 → " + L.num(st.n2, 2)],
      ["R", L.num(st.R, 0) + " cm", C.danger],
      ["u", "−" + L.num(st.x, 0) + " cm", C.danger],
      ["v", Math.abs(v) > 1e5 ? "≈ infinity" : L.num(v, 1) + " cm", v > 0 ? C.ok : "#a78bfa"]
    ]);
    L.verdict("<b>Check:</b> n₂/v − n₁/u = " + L.num(st.n2 / v, 4) + " + " + L.num(1 / st.x, 4) + " = " + L.num(st.n2 / v + 1 / st.x, 4) + ", which equals (n₂ − n₁)/R = " + L.num((st.n2 - 1) / st.R, 4) + ". " + (v > 0 ? "The image is real, on the far side of the surface." : "The image is virtual, on the object's side."));
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("r6-n", "Refractive index n₂", 1.1, 2.0, 0.05, st.n2, L.num(st.n2, 2)) +
      L.slider("r6-R", "Radius of curvature R", 10, 60, 1, st.R, L.num(st.R, 0) + " cm") +
      L.slider("r6-x", "Object distance", 5, 80, 1, st.x, L.num(st.x, 0) + " cm")
    );
    L.onInput("r6-n", function(v){ st.n2 = v; L.setVal("r6-n", L.num(v, 2)); draw(); });
    L.onInput("r6-R", function(v){ st.R = v; L.setVal("r6-R", L.num(v, 0) + " cm"); draw(); });
    L.onInput("r6-x", function(v){ st.x = v; L.setVal("r6-x", L.num(v, 0) + " cm"); draw(); });
    L.legend([["#94a3b8", "refracting surface"], [C.danger, "object & C"], [C.ok, "image"]]);
    L.watch("Vary n₂, R and the object distance. The computed v always satisfies the spherical-surface formula.");
    draw();
  }

  window.SIMS.sphrefract = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Thin lens bench (NCERT §9.5.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "convex", f: 15, x: 30};
  var V = 360, SCALE = 5;

  function draw(){
    var fl = st.preset === "convex" ? st.f : -st.f;
    var u = -st.x;
    var v = 1 / (1 / fl + 1 / u);
    var mag = v / u;
    var m = "";
    m += L.line(20, 170, 700, 170, C.faint, 2);
    m += '<ellipse cx="' + V + '" cy="170" rx="14" ry="95" fill="rgba(56,189,248,.10)" stroke="#94a3b8" stroke-width="3"/>';
    m += L.text(V + 22, 300, st.preset + " lens", {size: 13, color: C.muted, anchor: "middle"});
    var xf = V + fl * SCALE;
    m += L.circle(xf, 170, 4, C.ok) + L.text(xf, 198, "F", {size: 13, color: C.ok});
    if(st.preset === "convex") m += L.circle(V - fl * SCALE, 170, 4, C.ok) + L.text(V - fl * SCALE, 198, "F′", {size: 13, color: C.ok});
    // object
    var xo = V - st.x * SCALE;
    var ho = 65;
    if(xo > 20) m += L.arrow(xo, 170, xo, 170 - ho, C.danger, 4) + L.text(xo, 170 - ho - 10, "object", {size: 13, color: C.danger});
    // principal ray parallel then through focus
    m += L.line(xo, 170 - ho, V, 170 - ho, "rgba(56,189,248,.6)", 2);
    if(st.preset === "convex") m += L.line(V, 170 - ho, xf, 170, "rgba(56,189,248,.6)", 2);
    else m += L.line(V, 170 - ho, xo - 60, 170 - ho * 0.4, "rgba(56,189,248,.35)", 2);
    // central ray
    m += L.line(xo, 170 - ho, V, 170, "rgba(245,158,11,.6)", 2);
    m += L.line(V, 170, V + 240, 170 + 240 * (ho / (V - xo)), "rgba(245,158,11,.6)", 2);
    // image
    var xi = V + v * SCALE;
    var hi = ho * mag;
    if(xi > 20 && xi < 710 && Math.abs(hi) < 260){
      if(v > 0){
        m += L.arrow(xi, 170, xi, 170 + hi, C.ok, 4) + L.text(xi, 170 + hi + (hi < 0 ? -12 : 26), "image", {size: 13, color: C.ok});
      } else {
        m += L.line(xi, 170, xi, 170 - hi, C.ok, 3, "6 4") + L.text(xi, 170 - hi + 20, "virtual image", {size: 13, color: C.ok});
      }
    }
    L.svg(m, "Thin-lens ray construction for a " + st.preset + " lens.", 300);
    L.readout([
      ["f", L.num(fl, 1) + " cm", C.ok],
      ["u", "−" + L.num(st.x, 0) + " cm", C.danger],
      ["v", L.num(v, 1) + " cm", v > 0 ? C.ok : "#a78bfa"],
      ["m = v/u", L.num(mag, 2), Math.abs(mag) > 1 ? C.danger : C.muted]
    ]);
    L.verdict("<b>Check:</b> 1/v − 1/u = " + L.num(1 / v, 4) + " + " + L.num(1 / st.x, 4) + " = " + L.num(1 / v + 1 / st.x, 4) + " cm⁻¹ = 1/f = " + L.num(1 / fl, 4) + " cm⁻¹. " + (v > 0 ? "The image is on the far side: real and inverted." : "The image is on the object side: virtual and erect."));
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["convex", "Convex lens"], ["concave", "Concave lens"]], st.preset, select);
    L.controls(
      L.slider("r7-f", "Focal length (magnitude)", 5, 50, 1, st.f, L.num(st.f, 0) + " cm") +
      L.slider("r7-x", "Object distance", 3, 80, 1, st.x, L.num(st.x, 0) + " cm")
    );
    L.onInput("r7-f", function(v){ st.f = v; L.setVal("r7-f", L.num(v, 0) + " cm"); draw(); });
    L.onInput("r7-x", function(v){ st.x = v; L.setVal("r7-x", L.num(v, 0) + " cm"); draw(); });
    L.legend([[C.danger, "object"], ["#38bdf8", "parallel ray"], ["#f59e0b", "central ray"], [C.ok, "image"]]);
    L.watch("Slide the object inside and outside the focus for both lens types. The image changes side and orientation exactly as the formula predicts.");
    draw();
  }

  window.SIMS.lensbench = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Power and combination of lenses (NCERT §9.5.3–9.5.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {f1: 20, f2: -30};

  function draw(){
    var f1 = st.f1, f2 = st.f2;
    var invF = (f1 ? 1 / f1 : 0) + (f2 ? 1 / f2 : 0);
    var F = Math.abs(invF) < 1e-9 ? 1e9 : 1 / invF;
    var P = 100 / F;
    var m = "";
    m += L.text(360, 40, "LENSES IN CONTACT: POWERS ADD", {size: 17, weight: 700});
    // lens 1
    m += L.text(170, 86, "Lens 1", {size: 14, color: "#60a5fa", weight: 700});
    m += '<ellipse cx="170" cy="170" rx="13" ry="80" fill="rgba(96,165,250,.12)" stroke="#60a5fa" stroke-width="3"/>';
    m += L.text(170, 270, "f₁ = " + L.num(f1, 0) + " cm", {size: 14, color: "#60a5fa"});
    m += L.text(170, 292, "P₁ = " + L.num(f1 ? 100 / f1 : 0, 2) + " D", {size: 14, color: "#60a5fa"});
    // lens 2
    m += L.text(360, 86, "Lens 2", {size: 14, color: "#f59e0b", weight: 700});
    m += '<ellipse cx="360" cy="170" rx="13" ry="80" fill="rgba(245,158,11,.12)" stroke="#f59e0b" stroke-width="3"/>';
    m += L.text(360, 270, "f₂ = " + L.num(f2, 0) + " cm", {size: 14, color: "#f59e0b"});
    m += L.text(360, 292, "P₂ = " + L.num(f2 ? 100 / f2 : 0, 2) + " D", {size: 14, color: "#f59e0b"});
    // combination
    m += L.text(560, 86, "Combination", {size: 14, color: C.ok, weight: 700});
    m += '<ellipse cx="560" cy="170" rx="22" ry="80" fill="rgba(52,211,153,.10)" stroke="' + C.ok + '" stroke-width="3"/>';
    m += L.text(560, 270, "F = " + (Math.abs(F) > 1e5 ? "∞" : L.num(F, 1) + " cm"), {size: 14, color: C.ok});
    m += L.text(560, 292, "P = " + (Math.abs(P) > 1e5 ? "0" : L.num(P, 2) + " D"), {size: 14, color: C.ok});
    L.svg(m, "Two thin lenses in contact and their equivalent single lens.", 300);
    L.readout([
      ["P₁", L.num(f1 ? 100 / f1 : 0, 2) + " D", "#60a5fa"],
      ["P₂", L.num(f2 ? 100 / f2 : 0, 2) + " D", "#f59e0b"],
      ["P = P₁ + P₂", L.num(P, 2) + " D", C.ok],
      ["F = 100/P", Math.abs(F) > 1e5 ? "∞ cm" : L.num(F, 1) + " cm", F > 0 ? C.ok : C.danger]
    ]);
    L.verdict(F > 0
      ? "<b>Net converging system.</b> The positive power of the convex lens wins. Remember: power is additive only when the lenses are thin and in contact."
      : "<b>Net diverging system.</b> The negative lens dominates, so the combination spreads parallel light. Dioptres add algebraically — sign included.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("r8-f1", "Focal length f₁ (convex if +)", 10, 60, 5, st.f1, L.num(st.f1, 0) + " cm") +
      L.slider("r8-f2", "Focal length f₂ (concave if −)", -60, -10, 5, st.f2, L.num(st.f2, 0) + " cm")
    );
    L.onInput("r8-f1", function(v){ st.f1 = v; L.setVal("r8-f1", L.num(v, 0) + " cm"); draw(); });
    L.onInput("r8-f2", function(v){ st.f2 = v; L.setVal("r8-f2", L.num(v, 0) + " cm"); draw(); });
    L.legend([["#60a5fa", "lens 1"], ["#f59e0b", "lens 2"], [C.ok, "equivalent lens"]]);
    L.watch("Change the two focal lengths. The equivalent power is the algebraic sum P₁ + P₂.");
    draw();
  }

  window.SIMS.lenspower = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Prism: deviation and minimum (NCERT §9.6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {i: 40, A: 60, n: 1.5};

  function compute(iDeg, ADeg, n){
    var i = iDeg * Math.PI / 180, A = ADeg * Math.PI / 180;
    var r1 = Math.asin(Math.sin(i) / n);
    var r2 = A - r1;
    if(Math.sin(r2) > 1 / n || r2 < 0) return {r1: r1, r2: r2, tir: true};
    var e = Math.asin(n * Math.sin(r2));
    return {r1: r1, r2: r2, e: e, dev: (iDeg + e * 180 / Math.PI - ADeg), tir: false};
  }

  function draw(){
    var res = compute(st.i, st.A, st.n);
    var m = "";
    // triangle prism
    m += '<polygon points="200,240 320,240 260,120" fill="rgba(148,163,184,.12)" stroke="#94a3b8" stroke-width="2.5"/>';
    m += L.text(260, 104, "A = " + L.num(st.A, 0) + "°", {size: 14, color: C.text});
    var i = st.i * Math.PI / 180;
    var r1 = res.r1;
    // first face from (200,240) to (260,120), normal logic simplified visually
    var p1x = 230, p1y = 180;
    m += L.arrow(p1x - 120 * Math.sin(i), p1y - 60 * Math.cos(i), p1x, p1y, "#38bdf8", 3);
    m += L.line(p1x, p1y - 70, p1x, p1y + 70, C.faint, 1.4, "5 4");
    // ray inside
    var inx = p1x + 70 * Math.sin(r1), iny = p1y + 70 * Math.cos(r1);
    m += L.line(p1x, p1y, inx, iny, "#f59e0b", 3);
    if(!res.tir){
      var e = res.e;
      m += L.line(inx, iny, inx + 90 * Math.sin(e), iny - 90 * Math.cos(e), "#34d399", 3);
      m += L.text(120, 60, "δ = " + L.num(res.dev, 1) + "°", {size: 20, color: C.ok, weight: 700});
    } else {
      m += L.line(inx, iny, inx + 100 * Math.sin(r1), iny + 100 * Math.cos(r1), C.danger, 3);
      m += L.text(120, 60, "TIR at second face", {size: 17, color: C.danger, weight: 700});
    }
    // deviation curve on the right
    var gx = 430, gy = 250, gw = 230, gh = 180;
    m += L.line(gx, gy, gx + gw, gy, C.faint, 1.5);
    m += L.line(gx, gy, gx, gy - gh, C.faint, 1.5);
    m += L.text(gx + gw, gy + 18, "i", {size: 12, color: C.muted});
    m += L.text(gx - 10, gy - gh - 6, "δ", {size: 12, color: C.muted});
    var pts = "", j, dmin = 1e9, imin = 0;
    for(j = 5; j <= 85; j += 2){
      var rr = compute(j, st.A, st.n);
      if(rr.tir) continue;
      if(rr.dev < dmin){ dmin = rr.dev; imin = j; }
      pts += (pts ? " " : "") + (gx + gw * j / 90) + "," + (gy - Math.max(0, rr.dev) * 1.6);
    }
    m += '<polyline points="' + pts + '" fill="none" stroke="#60a5fa" stroke-width="2.4"/>';
    var cur = compute(st.i, st.A, st.n);
    if(!cur.tir){
      m += L.circle(gx + gw * st.i / 90, gy - Math.max(0, cur.dev) * 1.6, 5, C.danger);
      m += L.text(gx + gw * imin / 90, gy - dmin * 1.6 - 8, "min " + L.num(dmin, 1) + "°", {size: 12, color: C.ok});
    }
    L.svg(m, "A ray through a prism and the deviation-versus-incidence curve.", 300);
    L.readout([
      ["Refracting angle A", L.num(st.A, 0) + "°"],
      ["Index n", L.num(st.n, 3), "#60a5fa"],
      ["r₁, r₂", L.num(res.r1 * 180 / Math.PI, 1) + "°, " + L.num(res.r2 * 180 / Math.PI, 1) + "°"],
      ["Deviation δ", res.tir ? "TIR" : L.num(res.dev, 1) + "°", res.tir ? C.danger : C.ok]
    ]);
    L.verdict(res.tir
      ? "<b>Total internal reflection at the second face.</b> The refracted ray inside meets the second face beyond the critical angle, so it cannot emerge."
      : "<b>δ = i + e − A.</b> The curve on the right shows deviation falling to a minimum near symmetric passage (i = e), then rising again. " + (Math.abs(st.i - imin) < 4 ? "You are close to the minimum!" : "Set i near " + imin + "° to reach the minimum."));
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("r9-i", "Angle of incidence i", 5, 85, 1, st.i, L.num(st.i, 0) + "°") +
      L.slider("r9-A", "Refracting angle A", 40, 70, 1, st.A, L.num(st.A, 0) + "°") +
      L.slider("r9-n", "Refractive index n", 1.30, 1.90, 0.01, st.n, L.num(st.n, 2))
    );
    L.onInput("r9-i", function(v){ st.i = v; L.setVal("r9-i", L.num(v, 0) + "°"); draw(); });
    L.onInput("r9-A", function(v){ st.A = v; L.setVal("r9-A", L.num(v, 0) + "°"); draw(); });
    L.onInput("r9-n", function(v){ st.n = v; L.setVal("r9-n", L.num(v, 2)); draw(); });
    L.legend([["#38bdf8", "incident ray"], ["#f59e0b", "ray inside"], ["#34d399", "emergent ray"], [C.danger, "current point"]]);
    L.watch("Sweep the incidence angle. The deviation points on the curve move toward the minimum at the symmetric setting i = e.");
    draw();
  }

  window.SIMS.prismbench = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 10 — Compound microscope (NCERT §9.7.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {fo: 1.5, fe: 5, L: 15, mode: "near"};

  function me(){
    return st.mode === "near" ? 1 + 25 / st.fe : 25 / st.fe;
  }

  function draw(){
    var mo = st.L / st.fo;
    var total = mo * me();
    var m = "";
    m += L.text(360, 34, "COMPOUND MICROSCOPE", {size: 17, weight: 700});
    m += L.line(60, 190, 680, 190, C.faint, 2);
    // objective
    var xo = 230;
    m += '<ellipse cx="' + xo + '" cy="190" rx="11" ry="56" fill="rgba(96,165,250,.12)" stroke="#60a5fa" stroke-width="3"/>';
    m += L.text(xo, 272, "objective", {size: 13, color: "#60a5fa"});
    m += L.text(xo, 290, "f_o = " + L.num(st.fo, 1) + " cm", {size: 13, color: "#60a5fa"});
    // object
    m += L.arrow(xo - 34, 190, xo - 34, 156, C.danger, 3);
    m += L.text(xo - 34, 146, "object", {size: 12, color: C.danger});
    // intermediate image
    var xi = xo + 34 + st.L * 8;
    m += L.arrow(xi, 190, xi, 190 + 34, C.ok, 3);
    m += L.text(xi, 244, "intermediate image", {size: 12, color: C.ok});
    // eyepiece
    var xe = 560;
    m += '<ellipse cx="' + xe + '" cy="190" rx="12" ry="48" fill="rgba(245,158,11,.12)" stroke="#f59e0b" stroke-width="3"/>';
    m += L.text(xe, 272, "eyepiece", {size: 13, color: "#f59e0b"});
    m += L.text(xe, 290, "f_e = " + L.num(st.fe, 1) + " cm", {size: 13, color: "#f59e0b"});
    m += L.text(360, 60, "total M = m_o × m_e = " + L.num(mo, 1) + " × " + L.num(me(), 1) + " = " + L.num(total, 0) + "×", {size: 15, color: C.text, weight: 700});
    L.svg(m, "Schematic compound microscope showing objective, intermediate image and eyepiece.", 300);
    L.readout([
      ["Objective m_o = L/f_o", L.num(mo, 1) + "×", "#60a5fa"],
      ["Eyepiece m_e", L.num(me(), 1) + "× (image at " + (st.mode === "near" ? "near point" : "infinity") + ")", "#f59e0b"],
      ["Tube length L", L.num(st.L, 1) + " cm"],
      ["Total magnification", L.num(total, 0) + "×", C.ok]
    ]);
    L.verdict("<b>Both lenses work in series.</b> The objective's magnification L/f_o multiplies the eyepiece's magnification. Short focal lengths on both lenses are what push the total up; realistic values reach a few hundred times.");
  }

  function select(id){
    st.mode = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["near", "Final image at near point"], ["infinity", "Final image at infinity"]], st.mode, select);
    L.controls(
      L.slider("r10-fo", "Objective focal length f_o", 0.5, 3, 0.1, st.fo, L.num(st.fo, 1) + " cm") +
      L.slider("r10-fe", "Eyepiece focal length f_e", 2, 8, 0.25, st.fe, L.num(st.fe, 2) + " cm") +
      L.slider("r10-L", "Tube length L", 8, 25, 0.5, st.L, L.num(st.L, 1) + " cm")
    );
    L.onInput("r10-fo", function(v){ st.fo = v; L.setVal("r10-fo", L.num(v, 1) + " cm"); draw(); });
    L.onInput("r10-fe", function(v){ st.fe = v; L.setVal("r10-fe", L.num(v, 2) + " cm"); draw(); });
    L.onInput("r10-L", function(v){ st.L = v; L.setVal("r10-L", L.num(v, 1) + " cm"); draw(); });
    L.legend([["#60a5fa", "objective"], ["#f59e0b", "eyepiece"], [C.ok, "images"]]);
    L.watch("Change the focal lengths and the tube length. The total magnification is the product m_o × m_e.");
    draw();
  }

  window.SIMS.microscope = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 11 — Telescope (NCERT §9.7.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {fo: 100, fe: 5, mode: "normal"};

  function mag(){
    var m0 = st.fo / st.fe;
    return st.mode === "near" ? m0 * (1 + st.fe / 25) : m0;
  }

  function draw(){
    var m = "";
    m += L.text(360, 32, "ASTRONOMICAL TELESCOPE", {size: 17, weight: 700});
    m += L.line(40, 185, 700, 185, C.faint, 2);
    // objective
    m += '<ellipse cx="180" cy="185" rx="14" ry="92" fill="rgba(96,165,250,.12)" stroke="#60a5fa" stroke-width="3"/>';
    m += L.text(180, 296, "objective f_o = " + L.num(st.fo, 0) + " cm", {size: 13, color: "#60a5fa"});
    // incoming parallel rays
    var i;
    for(i = -2; i <= 2; i += 1){
      if(i === 0) continue;
      m += L.arrow(40, 185 + i * 34, 180, 185 + i * 34, "rgba(56,189,248,.7)", 2.2);
      m += L.line(180, 185 + i * 34, 460, 185 + i * 14, "rgba(56,189,248,.55)", 1.6);
    }
    // eyepiece
    var xe = 460;
    m += '<ellipse cx="' + xe + '" cy="185" rx="11" ry="52" fill="rgba(245,158,11,.12)" stroke="#f59e0b" stroke-width="3"/>';
    m += L.text(xe, 296, "eyepiece f_e = " + L.num(st.fe, 1) + " cm", {size: 13, color: "#f59e0b"});
    m += L.text(xe + 40, 185 - 70, "real image at focus", {size: 12, color: C.ok});
    m += L.circle(xe, 185, 4, C.ok);
    m += L.text(360, 60, "m = " + L.num(mag(), 1) + "×   ·   tube = " + (st.mode === "normal" ? L.num(st.fo + st.fe, 0) + " cm" : "adjusted for near point"), {size: 15, color: C.text, weight: 700});
    L.svg(m, "Refracting telescope with a large objective and a small eyepiece.", 300);
    L.readout([
      ["Objective focal length", L.num(st.fo, 0) + " cm", "#60a5fa"],
      ["Eyepiece focal length", L.num(st.fe, 1) + " cm", "#f59e0b"],
      ["Mode", st.mode === "normal" ? "final image at infinity" : "final image at 25 cm"],
      ["Magnifying power", L.num(mag(), 1) + "×", C.ok]
    ]);
    L.verdict("<b>m = f_o/f_e.</b> " + (st.mode === "normal" ? "In normal adjustment the tube is f_o + f_e long and the eye is relaxed." : "Focusing at the near point adds the factor (1 + f_e/D), at the cost of a slightly longer tube.") + " A longer objective or a shorter eyepiece raises the magnification.");
  }

  function select(id){
    st.mode = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["normal", "Normal adjustment"], ["near", "Image at near point"]], st.mode, select);
    L.controls(
      L.slider("r11-fo", "Objective focal length", 40, 200, 5, st.fo, L.num(st.fo, 0) + " cm") +
      L.slider("r11-fe", "Eyepiece focal length", 2, 10, 0.5, st.fe, L.num(st.fe, 1) + " cm")
    );
    L.onInput("r11-fo", function(v){ st.fo = v; L.setVal("r11-fo", L.num(v, 0) + " cm"); draw(); });
    L.onInput("r11-fe", function(v){ st.fe = v; L.setVal("r11-fe", L.num(v, 1) + " cm"); draw(); });
    L.legend([["#60a5fa", "objective"], ["#f59e0b", "eyepiece"], ["#38bdf8", "light rays"]]);
    L.watch("Increase the objective focal length or shrink the eyepiece and watch the magnifying power climb.");
    draw();
  }

  window.SIMS.telescope = {mount: mount, draw: draw, select: select, state: st};
})();

