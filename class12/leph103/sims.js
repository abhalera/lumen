// Class 12 Physics, Chapter 3 (leph103) — simulation labs.
// One lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Counting charge through a cross-section (NCERT §3.1–3.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {I: 2, t: 5};

  function draw(){
    var Q = st.I * st.t;
    var N = Q / 1.6e-19;
    var perSec = st.I / 1.6e-19;
    var cx = 360, cy = 150;
    var m = "";
    m += L.rect(80, cy - 34, 560, 68, "#132033", ' rx="30" stroke="#8db0d8" stroke-width="2"');
    m += L.line(cx, cy - 52, cx, cy + 52, C.ok, 3, "7 4");
    m += L.text(cx, cy - 62, "cross-section", {size: 14, color: C.ok});
    var seg = 34;
    var shift = (st.I * 12) % seg;
    var count = 14;
    for(var i = 0; i < count; i += 1){
      var x = 90 + i * seg + shift;
      if(x > 630) continue;
      m += L.circle(x, cy, 7, "#60a5fa");
      m += L.text(x, cy + 4, "−", {size: 12, color: "#0b1220", weight: 700});
    }
    m += L.text(120, cy - 46, "electrons drift left", {size: 13, color: "#60a5fa"});
    m += L.arrow(620, cy + 44, 100, cy + 44, C.danger, 3);
    m += L.text(360, cy + 72, "conventional current", {size: 13, color: C.danger});
    m += L.text(360, 60, "I = ΔQ/Δt = " + L.num(st.I, 1) + " A", {size: 22, color: C.text, weight: 700});
    L.svg(m, "Electrons drifting through a wire and crossing a marked cross-section.", 250);
    L.readout([
      ["Current I", L.num(st.I, 1) + " A", C.danger],
      ["Elapsed time", L.num(st.t, 1) + " s"],
      ["Charge passed Q = It", L.num(Q, 1) + " C", C.ok],
      ["Electrons passed", L.num(N / 1e19, 2) + " × 10¹⁹", "#60a5fa"],
      ["Electrons per second", L.num(perSec / 1e19, 2) + " × 10¹⁹"]
    ]);
    L.verdict("<b>Q = It.</b> Every second, " + L.num(perSec / 1e19, 2) + " × 10¹⁹ electrons cross the section. Current is charge crossing per second — not the speed of individual electrons.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("u1-I", "Current I", 0.5, 5, 0.5, st.I, L.num(st.I, 1) + " A") +
      L.slider("u1-t", "Time interval", 1, 10, 1, st.t, L.num(st.t, 1) + " s")
    );
    L.onInput("u1-I", function(v){ st.I = v; L.setVal("u1-I", L.num(v, 1) + " A"); draw(); });
    L.onInput("u1-t", function(v){ st.t = v; L.setVal("u1-t", L.num(v, 1) + " s"); draw(); });
    L.legend([["#60a5fa", "conduction electron"], [C.danger, "conventional current"], [C.ok, "cross-section"]]);
    L.watch("Set the current and the time. The readout accumulates the charge Q = It and counts the electrons that crossed.");
    draw();
  }

  window.SIMS.currentflow = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Ohm's law bench (NCERT §3.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "ohmic", V: 6, R: 12};

  function drawOhmic(){
    var I = st.R === 0 ? 0 : st.V / st.R;
    var x0 = 110, y0 = 240, x1 = 620, y1 = 55;
    var Imax = 10;
    var xx = function(i){ return x0 + (i / Imax) * (x1 - x0); };
    var yy = function(v){ return y0 - (v / 10) * (y0 - y1); };
    var m = "";
    m += L.line(x0, y0, x1 + 10, y0, C.muted, 2);
    m += L.line(x0, y0, x0, y1, C.muted, 2);
    m += L.text((x0 + x1) / 2, y0 + 28, "current I (A)", {size: 13, color: C.muted});
    m += L.text(x0 - 6, y1 - 8, "voltage V (V)", {size: 13, color: C.muted, anchor: "start"});
    var Vslope = st.R;
    m += L.line(xx(0), yy(0), xx(Math.min(Imax, 10 / Vslope)), yy(Math.min(10, Imax * Vslope)), "#38bdf8", 3);
    m += L.line(xx(I), yy(0), xx(I), yy(st.V), C.ok, 1.5, "4 4");
    m += L.line(x0, yy(st.V), xx(I), yy(st.V), C.ok, 1.5, "4 4");
    m += L.circle(xx(I), yy(st.V), 7, "#f8fafc");
    m += L.text(xx(I) + 12, yy(st.V) - 10, "(" + L.num(I, 2) + " A, " + L.num(st.V, 1) + " V)", {size: 13, color: "#f8fafc", anchor: "start"});
    m += L.text(620, 80, "slope of V–I = R = " + L.num(st.R, 1) + " Ω", {size: 15, color: C.text, weight: 700, anchor: "end"});
    L.svg(m, "V–I graph of an ohmic resistor with the operating point marked.", 300);
    L.readout([
      ["Resistance R", L.num(st.R, 1) + " Ω", C.ok],
      ["Voltage V", L.num(st.V, 1) + " V", C.danger],
      ["Current I = V/R", L.num(I, 3) + " A", "#38bdf8"],
      ["Conductance 1/R", L.num(1 / st.R, 3) + " S", C.muted],
      ["Power VI", L.num(st.V * I, 2) + " W"]
    ]);
    L.verdict("<b>Ohmic conductor:</b> the V–I graph is a straight line through the origin. R is constant; doubling V doubles I.");
  }

  function drawDiode(){
    var Vt = 0.5;
    var I = 1e-6 * (Math.exp(st.V / Vt) - 1);
    if(I > 100) I = 100;
    var x0 = 110, y0 = 240, x1 = 620, y1 = 55;
    var xx = function(v){ return x0 + (v / 10) * (x1 - x0); };
    var yy = function(i){
      var t = Math.log10(1 + i * 1000) / 5;
      if(t > 1) t = 1;
      return y0 - t * (y0 - y1);
    };
    var m = "";
    m += L.line(x0, y0, x1 + 10, y0, C.muted, 2);
    m += L.line(x0, y0, x0, y1, C.muted, 2);
    m += L.text((x0 + x1) / 2, y0 + 28, "voltage V (V)", {size: 13, color: C.muted});
    m += L.text(x0 - 6, y1 - 8, "current (log scale)", {size: 13, color: C.muted, anchor: "start"});
    var px = x0, py = y0;
    for(var i = 1; i <= 200; i += 1){
      var v = 10 * i / 200;
      var cur = 1e-6 * (Math.exp(v / Vt) - 1);
      if(cur > 100) cur = 100;
      var x = xx(v), y = yy(cur);
      m += L.line(px, py, x, y, "#f59e0b", 3);
      px = x; py = y;
    }
    m += L.circle(xx(st.V), yy(I), 7, "#f8fafc");
    m += L.text(620, 80, "diode: I grows exponentially", {size: 15, color: "#f59e0b", weight: 700, anchor: "end"});
    L.svg(m, "Non-ohmic V–I curve of a diode on a logarithmic current scale.", 300);
    L.readout([
      ["Device", "semiconductor diode", "#f59e0b"],
      ["Forward voltage V", L.num(st.V, 2) + " V", C.danger],
      ["Current", L.num(I * 1000, 3) + " mA", "#38bdf8"],
      ["Effective R = V/I", I > 1e-9 ? L.num(st.V / I, 0) + " Ω" : "—", C.muted],
      ["Ohmic?", "no", C.danger]
    ]);
    L.verdict("<b>Non-ohmic device:</b> the resistance changes with voltage. V = IR still defines an effective resistance at each point, but R is not constant, so Ohm's law fails.");
  }

  function draw(){
    if(st.preset === "ohmic") drawOhmic(); else drawDiode();
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    if(id === "ohmic"){
      L.controls(
        L.slider("u2-V", "Applied voltage V", 0, 10, 0.5, st.V, L.num(st.V, 1) + " V") +
        L.slider("u2-R", "Resistance R", 1, 20, 1, st.R, L.num(st.R, 1) + " Ω")
      );
      L.onInput("u2-R", function(v){ st.R = Number(v); L.setVal("u2-R", L.num(v, 1) + " Ω"); draw(); });
    } else {
      st.V = 0.5;
      L.controls(L.slider("u2-V", "Forward voltage V", 0, 0.9, 0.02, st.V, L.num(st.V, 2) + " V"));
      L.onInput("u2-V", function(v){ st.V = Number(v); L.setVal("u2-V", L.num(v, 2) + " V"); draw(); });
    }
    if(id === "ohmic") L.onInput("u2-V", function(v){ st.V = Number(v); L.setVal("u2-V", L.num(v, 1) + " V"); draw(); });
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["ohmic", "Ohmic resistor"], ["diode", "Diode (non-ohmic)"]], st.preset, select);
    L.legend([["#38bdf8", "V–I line"], [C.ok, "operating point"], ["#f59e0b", "diode curve"]]);
    L.watch("Switch between the resistor and the diode. The resistor gives a straight V–I line; the diode bends sharply and is not ohmic.");
    select(st.preset);
  }

  window.SIMS.ohmlaw = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Drift velocity and mobility (NCERT §3.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "copper", I: 1.5, A: 1.0};
  var MAT = {
    copper: {name: "Copper", n: 8.5e28},
    silver: {name: "Silver", n: 5.9e28}
  };

  function draw(){
    var mat = MAT[st.preset];
    var A = st.A * 1e-6;
    var vd = st.I / (mat.n * 1.6e-19 * A);
    var t1m = 1 / vd;
    var cx = 360, cy = 165;
    var m = "";
    m += L.rect(80, cy - 40, 560, 80, "#132033", ' rx="34" stroke="#8db0d8" stroke-width="2"');
    var x = 110, y = cy, i;
    var rnd = 1;
    function rndm(){ rnd = (rnd * 1103515245 + 12345) % 2147483648; return rnd / 2147483648; }
    m += '<path d="M' + x + ' ' + y;
    for(i = 1; i <= 24; i += 1){
      x += 20;
      y = cy + (rndm() - 0.5) * 66;
      m += ' L' + x + ' ' + y;
    }
    m += '" fill="none" stroke="rgba(96,165,250,.8)" stroke-width="2"/>';
    m += L.arrow(110, cy, 110 + 560, cy, C.ok, 3);
    m += L.text(360, cy + 62, "net drift vd = " + L.num(vd * 1000, 3) + " mm/s", {size: 16, color: C.ok, weight: 700});
    m += L.text(360, 55, mat.name + ": n = " + L.num(mat.n / 1e28, 1) + " × 10²⁸ m⁻³", {size: 16, color: C.text, weight: 700});
    L.svg(m, "Random zig-zag path of an electron with a small net drift along the wire.", 280);
    L.readout([
      ["Material", mat.name, C.muted],
      ["Carrier density n", L.num(mat.n / 1e28, 1) + " × 10²⁸ m⁻³"],
      ["Area A", L.num(st.A, 1) + " × 10⁻⁶ m²"],
      ["Current I", L.num(st.I, 1) + " A", C.danger],
      ["Drift speed vd", L.num(vd * 1000, 3) + " mm/s", C.ok],
      ["Time to cross 1 m", L.num(t1m, 0) + " s", C.muted]
    ]);
    L.verdict("<b>vd = I/(neA).</b> Even at amperes, the drift is a fraction of a millimetre per second: the random zig-zag dominates, and only the tiny net drift carries the current.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["copper", "Copper"], ["silver", "Silver"]], st.preset, select);
    L.controls(
      L.slider("u3-I", "Current I", 0.5, 5, 0.5, st.I, L.num(st.I, 1) + " A") +
      L.slider("u3-A", "Area A", 0.5, 2.0, 0.1, st.A, L.num(st.A, 1) + " × 10⁻⁶ m²")
    );
    L.onInput("u3-I", function(v){ st.I = Number(v); L.setVal("u3-I", L.num(v, 1) + " A"); draw(); });
    L.onInput("u3-A", function(v){ st.A = Number(v); L.setVal("u3-A", L.num(v, 1) + " × 10⁻⁶ m²"); draw(); });
    L.legend([["#60a5fa", "random path"], [C.ok, "net drift"], ["#8db0d8", "wire"]]);
    L.watch("Raise the current or shrink the area and watch the drift speed grow. The random motion never stops; only its average carries current.");
    draw();
  }

  window.SIMS.drift = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Resistance versus temperature (NCERT §3.6–3.8)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "metal", T: 27};
  var MAT = {
    metal: {name: "Copper (metal)", alpha: 4.0e-3, sign: "+", note: "scattering grows" },
    alloy: {name: "Nichrome (alloy)", alpha: 2.0e-5, sign: "+", note: "nearly constant" },
    semi: {name: "Germanium (semiconductor)", alpha: -0.02, sign: "−", note: "carriers multiply" }
  };

  function Rof(T, m){
    var dT = T - 27;
    if(m.sign === "+") return 100 * (1 + m.alpha * dT);
    return 100 / (1 + 0.02 * dT);
  }

  function draw(){
    var m = MAT[st.preset];
    var R = Rof(st.T, m);
    var x0 = 110, y0 = 245, x1 = 620, y1 = 55;
    var Rmax = 350;
    var xx = function(T){ return x0 + ((T - 20) / 500) * (x1 - x0); };
    var yy = function(r){ return y0 - (Math.min(r, Rmax) / Rmax) * (y0 - y1); };
    var s = "";
    s += L.line(x0, y0, x1 + 10, y0, C.muted, 2);
    s += L.line(x0, y0, x0, y1, C.muted, 2);
    s += L.text((x0 + x1) / 2, y0 + 28, "temperature T (°C)", {size: 13, color: C.muted});
    s += L.text(x0 - 6, y1 - 8, "resistance R (Ω)", {size: 13, color: C.muted, anchor: "start"});
    var px = x0, py = yy(Rof(20, m));
    for(var i = 1; i <= 160; i += 1){
      var T = 20 + 500 * i / 160;
      var x = xx(T), y = yy(Rof(T, m));
      s += L.line(px, py, x, y, m.sign === "+" ? "#f59e0b" : "#38bdf8", 3);
      px = x; py = y;
    }
    s += L.line(x0, yy(100), x1, yy(100), C.faint, 1.5, "5 4");
    s += L.circle(xx(st.T), yy(R), 7, "#f8fafc");
    s += L.text(xx(st.T) + 12, yy(R) - 10, "R = " + L.num(R, 1) + " Ω", {size: 14, color: "#f8fafc", anchor: "start"});
    L.svg(s, "Resistance versus temperature for the chosen material.", 300);
    L.readout([
      ["Material", m.name, C.muted],
      ["R at 27 °C", "100.0 Ω"],
      ["Temperature", L.num(st.T, 0) + " °C"],
      ["Resistance now", L.num(R, 1) + " Ω", m.sign === "+" ? "#f59e0b" : "#38bdf8"],
      ["Mechanism", m.note, C.ok]
    ]);
    var msg;
    if(st.preset === "semi") msg = "<b>Semiconductor:</b> heating frees many more charge carriers, and n wins over extra collisions. The resistance falls sharply with temperature — the thermistor effect.";
    else if(st.preset === "alloy") msg = "<b>Alloy:</b> heavy impurity atoms already scatter electrons strongly, so extra thermal vibration changes little. Resistance is nearly independent of temperature.";
    else msg = "<b>Metal:</b> the lattice vibrates more at higher temperature, collisions shorten τ, and R = R₀[1 + αΔT] grows linearly. For copper α ≈ 4 × 10⁻³ °C⁻¹.";
    L.verdict(msg);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["metal", "Copper (metal)"], ["alloy", "Nichrome (alloy)"], ["semi", "Semiconductor"]], st.preset, select);
    L.controls(L.slider("u4-T", "Temperature T", 20, 520, 10, st.T, L.num(st.T, 0) + " °C"));
    L.onInput("u4-T", function(v){ st.T = Number(v); L.setVal("u4-T", L.num(v, 0) + " °C"); draw(); });
    L.legend([["#f59e0b", "metal / alloy"], ["#38bdf8", "semiconductor"], ["#f8fafc", "operating point"]]);
    L.watch("Raise the temperature and compare the three materials. Only the semiconductor's resistance falls.");
    draw();
  }

  window.SIMS.temperature = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Electrical power and energy (NCERT §3.9)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {V: 12, R: 6};

  function draw(){
    var I = st.V / st.R;
    var P = st.V * I;
    var energy = P * 3600; // joules delivered in one hour
    var x0 = 110, y0 = 240, x1 = 620, y1 = 60;
    var Pmax = 576; // V = 24, R = 1
    var xx = function(r){ return x0 + ((r - 1) / 23) * (x1 - x0); };
    var yy = function(p){ return y0 - (p / Pmax) * (y0 - y1); };
    var m = "";
    m += L.line(x0, y0, x1 + 10, y0, C.muted, 2);
    m += L.line(x0, y0, x0, y1, C.muted, 2);
    m += L.text((x0 + x1) / 2, y0 + 28, "resistance R (Ω)", {size: 13, color: C.muted});
    m += L.text(x0 - 6, y1 - 8, "power P (W) at fixed V", {size: 13, color: C.muted, anchor: "start"});
    var px = x0, py = yy(st.V * st.V / 1);
    for(var i = 1; i <= 120; i += 1){
      var r = 1 + 23 * i / 120;
      var x = xx(r), y = yy(st.V * st.V / r);
      m += L.line(px, py, x, y, "#f59e0b", 3);
      px = x; py = y;
    }
    m += L.circle(xx(st.R), yy(P), 7, "#f8fafc");
    m += L.line(xx(st.R), yy(0), xx(st.R), yy(P), C.ok, 1.5, "4 4");
    var heat = Math.min(1, P / 200);
    m += L.rect(90, 40, 540, 14, "rgba(148,163,184,.2)", ' rx="7"');
    m += L.rect(90, 40, 540 * heat, 14, "#ef4444", ' rx="7"');
    m += L.text(360, 30, "heating ∝ P", {size: 13, color: C.danger});
    L.svg(m, "Power dissipated in a fixed-voltage circuit as resistance changes.", 300);
    L.readout([
      ["Voltage V", L.num(st.V, 1) + " V", C.danger],
      ["Resistance R", L.num(st.R, 1) + " Ω"],
      ["Current I = V/R", L.num(I, 2) + " A", "#38bdf8"],
      ["Power P = VI = I²R", L.num(P, 2) + " W", C.ok],
      ["Energy in 1 h", L.num(energy / 3.6e6, 3) + " kWh", C.muted]
    ]);
    L.verdict("<b>P = VI = I²R = V²/R.</b> At fixed voltage the power falls as 1/R — a small resistance draws a big current and heats hard. This is why short circuits are dangerous.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("u5-V", "Supply voltage V", 1, 24, 1, st.V, L.num(st.V, 1) + " V") +
      L.slider("u5-R", "Resistance R", 1, 24, 1, st.R, L.num(st.R, 1) + " Ω")
    );
    L.onInput("u5-V", function(v){ st.V = Number(v); L.setVal("u5-V", L.num(v, 1) + " V"); draw(); });
    L.onInput("u5-R", function(v){ st.R = Number(v); L.setVal("u5-R", L.num(v, 1) + " Ω"); draw(); });
    L.legend([["#f59e0b", "P versus R at fixed V"], [C.ok, "operating point"], [C.danger, "heat bar"]]);
    L.watch("Change V and R. Watch how the power splits into the current and the resistance: P = V²/R.");
    draw();
  }

  window.SIMS.power = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Cells, emf and internal resistance (NCERT §3.10)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {e: 12, r: 1.0, R: 5.0};

  function draw(){
    var I = st.e / (st.R + st.r);
    var V = st.e - I * st.r;
    var Pload = I * I * st.R;
    var Pint = I * I * st.r;
    var eff = 100 * Pload / (Pload + Pint);
    var m = "";
    m += L.rect(120, 90, 480, 140, "rgba(148,163,184,.06)", ' rx="12" stroke="#475569" stroke-width="2"');
    m += L.line(120, 160, 190, 160, "#94a3b8", 3);
    m += L.line(190, 130, 190, 190, C.danger, 4);
    m += L.line(210, 140, 210, 180, C.danger, 4);
    m += L.line(230, 130, 230, 190, C.danger, 4);
    m += L.line(250, 140, 250, 180, C.danger, 4);
    m += L.line(250, 160, 300, 160, "#94a3b8", 3);
    m += L.rect(300, 145, 70, 30, "#f59e0b", ' rx="5" opacity=".8"');
    m += L.text(335, 165, "r", {size: 15, color: "#0b1220", weight: 700});
    m += L.line(370, 160, 500, 160, "#94a3b8", 3);
    m += L.rect(500, 130, 60, 60, "#1e3a8a", ' rx="6" stroke="#60a5fa" stroke-width="2"');
    m += L.text(530, 167, "R", {size: 18, color: "#fff", weight: 700});
    m += L.line(500, 160, 480, 160, "#94a3b8", 3);
    m += L.line(560, 160, 600, 160, "#94a3b8", 3);
    m += L.line(600, 160, 600, 230, "#94a3b8", 3);
    m += L.line(600, 230, 120, 230, "#94a3b8", 3);
    m += L.line(120, 230, 120, 160, "#94a3b8", 3);
    m += L.arrow(430, 140, 470, 140, C.danger, 3);
    m += L.text(450, 128, "I", {size: 14, color: C.danger, weight: 700});
    m += L.text(200, 76, "emf ε = " + L.num(st.e, 1) + " V", {size: 16, color: C.danger, weight: 700});
    m += L.text(335, 214, "internal resistance r = " + L.num(st.r, 2) + " Ω", {size: 14, color: "#f59e0b"});
    m += L.text(530, 118, "load R = " + L.num(st.R, 1) + " Ω", {size: 14, color: "#60a5fa"});
    m += L.text(360, 268, "I = ε/(R + r) = " + L.num(I, 3) + " A   ·   V = ε − Ir = " + L.num(V, 2) + " V", {size: 16, color: C.text, weight: 700});
    L.svg(m, "A cell with internal resistance driving an external load.", 300);
    L.readout([
      ["emf ε", L.num(st.e, 1) + " V", C.danger],
      ["Internal resistance r", L.num(st.r, 2) + " Ω", "#f59e0b"],
      ["Current I", L.num(I, 3) + " A", "#38bdf8"],
      ["Terminal voltage V", L.num(V, 2) + " V", C.ok],
      ["Power in load", L.num(Pload, 2) + " W"],
      ["Efficiency", L.num(eff, 1) + " %", eff > 80 ? C.ok : C.danger]
    ]);
    var msg = "<b>V = ε − Ir.</b> ";
    if(Math.abs(st.R - st.r) < 0.05) msg += "Here R ≈ r: the load receives maximum power, but half the energy is wasted inside the cell.";
    else if(st.R > st.r) msg += "The external load is larger than r, so most of the emf appears at the terminals — good efficiency.";
    else msg += "The load is smaller than r, so much of the emf is lost internally and the terminal voltage sags badly.";
    L.verdict(msg);
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("u6-e", "emf ε", 2, 24, 1, st.e, L.num(st.e, 1) + " V") +
      L.slider("u6-r", "Internal resistance r", 0.2, 5.0, 0.1, st.r, L.num(st.r, 2) + " Ω") +
      L.slider("u6-R", "Load resistance R", 0.5, 20, 0.5, st.R, L.num(st.R, 1) + " Ω")
    );
    L.onInput("u6-e", function(v){ st.e = Number(v); L.setVal("u6-e", L.num(v, 1) + " V"); draw(); });
    L.onInput("u6-r", function(v){ st.r = Number(v); L.setVal("u6-r", L.num(v, 2) + " Ω"); draw(); });
    L.onInput("u6-R", function(v){ st.R = Number(v); L.setVal("u6-R", L.num(v, 1) + " Ω"); draw(); });
    L.legend([[C.danger, "emf source"], ["#f59e0b", "internal resistance"], ["#60a5fa", "external load"]]);
    L.watch("Increase the load current (lower R) and watch the terminal voltage fall. The power split shows where the energy goes.");
    draw();
  }

  window.SIMS.emf = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Cells in series and parallel (NCERT §3.11)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "series", n: 3, e: 1.5, r: 0.3, R: 2.0};

  function draw(){
    var n = st.n;
    var eq, req;
    if(st.preset === "series"){ eq = n * st.e; req = n * st.r; }
    else { eq = st.e; req = st.r / n; }
    var I = eq / (st.R + req);
    var V = eq - I * req;
    var m = "";
    var x0 = 130, y0 = 120;
    if(st.preset === "series"){
      m += L.line(x0, y0, x0 + n * 90 + 60, y0, "#94a3b8", 3);
      for(var i = 0; i < n; i += 1){
        var x = x0 + 20 + i * 90;
        m += L.line(x, y0 - 16, x, y0 + 16, C.danger, 4);
        m += L.line(x + 18, y0 - 9, x + 18, y0 + 9, C.danger, 3);
        m += L.text(x + 9, y0 - 28, "ε", {size: 12, color: C.danger});
      }
      m += L.line(x0, y0, 120, y0, "#94a3b8", 3);
      m += L.line(120, y0, 120, 230, "#94a3b8", 3);
      m += L.rect(390, 215, 70, 30, "#1e3a8a", ' rx="5" stroke="#60a5fa" stroke-width="2"');
      m += L.text(425, 235, "R", {size: 16, color: "#fff", weight: 700});
      m += L.line(120, 230, 390, 230, "#94a3b8", 3);
      m += L.line(460, 230, 660, 230, "#94a3b8", 3);
      m += L.line(660, 230, 660, y0, "#94a3b8", 3);
      m += L.line(660, y0, x0 + n * 90 + 60, y0, "#94a3b8", 3);
      m += L.text(360, 272, "series: ε_eq = nε, r_eq = nr", {size: 17, color: C.text, weight: 700});
    } else {
      m += L.line(120, 90, 620, 90, "#94a3b8", 3);
      m += L.line(120, 250, 620, 250, "#94a3b8", 3);
      for(var j = 0; j < n; j += 1){
        var xb = 170 + j * 110;
        m += L.line(xb, 90, xb, 250, "#94a3b8", 3);
        m += L.line(xb, 150, xb + 30, 150, "#94a3b8", 3);
        m += L.line(xb + 30, 138, xb + 30, 162, C.danger, 4);
        m += L.line(xb + 46, 143, xb + 46, 157, C.danger, 3);
        m += L.line(xb + 46, 150, xb + 80, 150, "#94a3b8", 3);
      }
      m += L.line(120, 90, 120, 250, "#94a3b8", 3);
      m += L.line(620, 250, 620, 170, "#94a3b8", 3);
      m += L.rect(585, 140, 70, 30, "#1e3a8a", ' rx="5" stroke="#60a5fa" stroke-width="2"');
      m += L.text(620, 160, "R", {size: 16, color: "#fff", weight: 700});
      m += L.line(620, 90, 620, 140, "#94a3b8", 3);
      m += L.text(360, 282, "parallel: ε_eq = ε, r_eq = r/n", {size: 17, color: C.text, weight: 700});
    }
    L.svg(m, n + " cells connected in " + st.preset + " with an external load.", 310);
    L.readout([
      ["Connection", st.preset === "series" ? "series" : "parallel", C.muted],
      ["Cells n", String(n)],
      ["Equivalent emf", L.num(eq, 2) + " V", C.danger],
      ["Equivalent internal resistance", L.num(req, 3) + " Ω", "#f59e0b"],
      ["Current through load R", L.num(I, 3) + " A", "#38bdf8"],
      ["Terminal voltage", L.num(V, 3) + " V", C.ok]
    ]);
    var msg = st.preset === "series" ? "<b>Series:</b> the emfs add and the internal resistances add. This is best when R is much larger than r." : "<b>Parallel:</b> the emf stays that of one cell while the internal resistance is divided by n. This is best when the load R is small and you need current.";
    L.verdict(msg);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["series", "In series"], ["parallel", "In parallel"]], st.preset, select);
    L.controls(
      L.slider("u7-n", "Number of cells n", 1, 4, 1, st.n, String(st.n)) +
      L.slider("u7-e", "Cell emf ε", 1, 6, 0.5, st.e, L.num(st.e, 1) + " V") +
      L.slider("u7-r", "Cell internal resistance r", 0.1, 1.0, 0.1, st.r, L.num(st.r, 1) + " Ω") +
      L.slider("u7-R", "External resistance R", 0.5, 10, 0.5, st.R, L.num(st.R, 1) + " Ω")
    );
    L.onInput("u7-n", function(v){ st.n = Number(v); L.setVal("u7-n", String(st.n)); draw(); });
    L.onInput("u7-e", function(v){ st.e = Number(v); L.setVal("u7-e", L.num(v, 1) + " V"); draw(); });
    L.onInput("u7-r", function(v){ st.r = Number(v); L.setVal("u7-r", L.num(v, 1) + " Ω"); draw(); });
    L.onInput("u7-R", function(v){ st.R = Number(v); L.setVal("u7-R", L.num(v, 1) + " Ω"); draw(); });
    L.legend([[C.danger, "cell"], ["#60a5fa", "load resistor"], ["#94a3b8", "wires"]]);
    L.watch("Switch series and parallel, then change n. Compare the equivalent emf, the equivalent internal resistance and the current delivered.");
    draw();
  }

  window.SIMS.cellscombo = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Kirchhoff's rules bench (NCERT §3.12)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "parallel", e: 6, R1: 2, R2: 3};

  function drawParallel(){
    var I1 = st.e / st.R1, I2 = st.e / st.R2, It = I1 + I2;
    var m = "";
    m += L.line(120, 90, 360, 90, "#94a3b8", 3);
    m += L.line(360, 90, 600, 90, "#94a3b8", 3);
    m += L.line(360, 90, 360, 150, "#94a3b8", 3);
    m += L.line(120, 250, 360, 250, "#94a3b8", 3);
    m += L.line(360, 250, 600, 250, "#94a3b8", 3);
    m += L.line(360, 250, 360, 190, "#94a3b8", 3);
    m += L.line(120, 90, 120, 250, "#94a3b8", 3);
    m += L.rect(240, 75, 60, 30, "#60a5fa", ' rx="5" opacity=".85"');
    m += L.text(270, 96, "R₁", {size: 15, color: "#0b1220", weight: 700});
    m += L.rect(470, 75, 60, 30, "#60a5fa", ' rx="5" opacity=".85"');
    m += L.text(500, 96, "R₂", {size: 15, color: "#0b1220", weight: 700});
    m += L.line(340, 160, 380, 160, C.danger, 4);
    m += L.line(340, 172, 360, 172, C.danger, 3);
    m += L.line(360, 172, 360, 160, C.danger, 3);
    m += L.line(360, 172, 380, 172, C.danger, 3);
    m += L.text(360, 145, "ε = " + L.num(st.e, 1) + " V", {size: 14, color: C.danger, weight: 700});
    m += L.circle(360, 90, 5, C.ok) + L.text(380, 70, "junction B", {size: 13, color: C.ok, anchor: "start"});
    m += L.circle(360, 250, 5, C.ok) + L.text(380, 272, "junction D", {size: 13, color: C.ok, anchor: "start"});
    m += L.arrow(220, 58, 260, 58, "#38bdf8", 2.5);
    m += L.text(240, 48, "I₁ = " + L.num(I1, 2) + " A", {size: 13, color: "#38bdf8"});
    m += L.arrow(450, 58, 490, 58, "#f59e0b", 2.5);
    m += L.text(470, 48, "I₂ = " + L.num(I2, 2) + " A", {size: 13, color: "#f59e0b"});
    L.svg(m, "Two resistors in parallel driven by one cell, with the junction points marked.", 310);
    L.readout([
      ["I through R₁", L.num(I1, 3) + " A", "#38bdf8"],
      ["I through R₂", L.num(I2, 3) + " A", "#f59e0b"],
      ["I₁ + I₂ (into B)", L.num(It, 3) + " A", C.ok],
      ["Total from the battery", L.num(It, 3) + " A", C.muted],
      ["Equivalent resistance", L.num(1 / (1 / st.R1 + 1 / st.R2), 3) + " Ω"]
    ]);
    L.verdict("<b>Junction rule:</b> the current entering B, " + L.num(It, 3) + " A, equals I₁ + I₂ leaving along the two branches. The loop rule applied to each loop gives V across each branch = ε = " + L.num(st.e, 1) + " V.");
  }

  function drawSeries(){
    var Rt = st.R1 + st.R2;
    var I = st.e / Rt;
    var V1 = I * st.R1, V2 = I * st.R2;
    var m = "";
    m += L.line(120, 100, 230, 100, "#94a3b8", 3);
    m += L.line(290, 100, 430, 100, "#94a3b8", 3);
    m += L.line(490, 100, 600, 100, "#94a3b8", 3);
    m += L.line(600, 100, 600, 240, "#94a3b8", 3);
    m += L.line(600, 240, 120, 240, "#94a3b8", 3);
    m += L.line(120, 240, 120, 100, "#94a3b8", 3);
    m += L.rect(230, 85, 60, 30, "#60a5fa", ' rx="5" opacity=".85"');
    m += L.text(260, 106, "R₁", {size: 15, color: "#0b1220", weight: 700});
    m += L.rect(430, 85, 60, 30, "#60a5fa", ' rx="5" opacity=".85"');
    m += L.text(460, 106, "R₂", {size: 15, color: "#0b1220", weight: 700});
    m += L.line(330, 210, 370, 210, C.danger, 4);
    m += L.line(330, 222, 350, 222, C.danger, 3);
    m += L.line(350, 222, 350, 210, C.danger, 3);
    m += L.line(350, 222, 370, 222, C.danger, 3);
    m += L.text(350, 265, "ε = " + L.num(st.e, 1) + " V", {size: 14, color: C.danger, weight: 700});
    m += L.arrow(150, 70, 210, 70, "#38bdf8", 2.5);
    m += L.text(180, 60, "I = " + L.num(I, 3) + " A", {size: 13, color: "#38bdf8"});
    m += L.text(260, 60, "V₁ = " + L.num(V1, 2) + " V", {size: 13, color: "#60a5fa"});
    m += L.text(460, 60, "V₂ = " + L.num(V2, 2) + " V", {size: 13, color: "#f59e0b"});
    L.svg(m, "Two resistors in series with one cell, showing the loop used for the loop rule.", 310);
    L.readout([
      ["Current I", L.num(I, 3) + " A", "#38bdf8"],
      ["V across R₁", L.num(V1, 3) + " V", "#60a5fa"],
      ["V across R₂", L.num(V2, 3) + " V", "#f59e0b"],
      ["V₁ + V₂", L.num(V1 + V2, 3) + " V", C.ok],
      ["Supply emf", L.num(st.e, 1) + " V", C.danger]
    ]);
    L.verdict("<b>Loop rule:</b> V₁ + V₂ = " + L.num(V1 + V2, 3) + " V, exactly equal to the emf of " + L.num(st.e, 1) + " V. Going once around the loop returns to the same potential, so the changes sum to zero.");
  }

  function draw(){
    if(st.preset === "parallel") drawParallel(); else drawSeries();
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["parallel", "Parallel branches"], ["series", "Series loop"]], st.preset, select);
    L.controls(
      L.slider("u8-e", "Cell emf ε", 1, 12, 1, st.e, L.num(st.e, 1) + " V") +
      L.slider("u8-R1", "Resistance R₁", 1, 12, 1, st.R1, L.num(st.R1, 1) + " Ω") +
      L.slider("u8-R2", "Resistance R₂", 1, 12, 1, st.R2, L.num(st.R2, 1) + " Ω")
    );
    L.onInput("u8-e", function(v){ st.e = Number(v); L.setVal("u8-e", L.num(v, 1) + " V"); draw(); });
    L.onInput("u8-R1", function(v){ st.R1 = Number(v); L.setVal("u8-R1", L.num(v, 1) + " Ω"); draw(); });
    L.onInput("u8-R2", function(v){ st.R2 = Number(v); L.setVal("u8-R2", L.num(v, 1) + " Ω"); draw(); });
    L.legend([["#60a5fa", "R₁ branch"], ["#f59e0b", "R₂ branch"], [C.ok, "junction / check"]]);
    L.watch("In the parallel preset the currents add at the junction; in the series preset the voltages add around the loop.");
    draw();
  }

  window.SIMS.kirchhoff = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Wheatstone bridge bench (NCERT §3.13)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {R1: 100, R2: 10, R3: 5, R4: 60};
  var E = 10, G = 10;

  function solve(){
    var g = 1 / G;
    var a11 = 1 / st.R1 + 1 / st.R2 + g;
    var a12 = -g;
    var b1 = E / st.R1;
    var a21 = -g;
    var a22 = 1 / st.R3 + 1 / st.R4 + g;
    var b2 = E / st.R3;
    var det = a11 * a22 - a12 * a21;
    var VB = (b1 * a22 - a12 * b2) / det;
    var VD = (a11 * b2 - b1 * a21) / det;
    return {VB: VB, VD: VD, Ig: (VB - VD) / G};
  }

  function draw(){
    var s = solve();
    var balanced = Math.abs(s.Ig) < 1e-4;
    var m = "";
    m += L.line(150, 155, 360, 55, "#94a3b8", 3);
    m += L.line(360, 55, 570, 155, "#94a3b8", 3);
    m += L.line(150, 155, 360, 255, "#94a3b8", 3);
    m += L.line(360, 255, 570, 155, "#94a3b8", 3);
    m += L.line(150, 155, 60, 155, "#94a3b8", 3);
    m += L.line(570, 155, 660, 155, "#94a3b8", 3);
    m += L.line(60, 155, 60, 290, "#94a3b8", 3);
    m += L.line(60, 290, 320, 290, "#94a3b8", 3);
    m += L.line(400, 290, 660, 290, "#94a3b8", 3);
    m += L.line(660, 290, 660, 155, "#94a3b8", 3);
    m += L.rect(230, 82, 54, 26, "#1e3a8a", ' rx="5" stroke="#60a5fa" stroke-width="2"');
    m += L.text(257, 100, "R₁", {size: 14, color: "#fff", weight: 700});
    m += L.rect(438, 82, 54, 26, "#1e3a8a", ' rx="5" stroke="#60a5fa" stroke-width="2"');
    m += L.text(465, 100, "R₂", {size: 14, color: "#fff", weight: 700});
    m += L.rect(230, 202, 54, 26, "#1e3a8a", ' rx="5" stroke="#60a5fa" stroke-width="2"');
    m += L.text(257, 220, "R₃", {size: 14, color: "#fff", weight: 700});
    m += L.rect(438, 202, 54, 26, "#1e3a8a", ' rx="5" stroke="#60a5fa" stroke-width="2"');
    m += L.text(465, 220, "R₄", {size: 14, color: "#fff", weight: 700});
    m += L.line(360, 55, 360, 135, balanced ? C.ok : C.danger, 3);
    m += L.line(360, 175, 360, 255, balanced ? C.ok : C.danger, 3);
    m += L.circle(360, 155, 20, "#0b1220", ' stroke="' + (balanced ? C.ok : C.danger) + '" stroke-width="3"');
    m += L.text(360, 161, "G", {size: 17, color: balanced ? C.ok : C.danger, weight: 700});
    m += L.text(360, 128, "Ig = " + L.num(s.Ig * 1000, 3) + " mA", {size: 14, color: balanced ? C.ok : C.danger, weight: 700});
    m += L.text(140, 148, "A", {size: 15, color: C.text, weight: 700});
    m += L.text(360, 42, "B", {size: 15, color: C.text, weight: 700});
    m += L.text(580, 148, "C", {size: 15, color: C.text, weight: 700});
    m += L.text(360, 275, "D", {size: 15, color: C.text, weight: 700});
    m += L.rect(320, 278, 80, 24, C.danger, ' rx="4" opacity=".85"');
    m += L.text(360, 295, "10 V", {size: 13, color: "#fff", weight: 700});
    L.svg(m, "Wheatstone bridge with four arms and a galvanometer.", 320);
    L.readout([
      ["R₁ / R₂", L.num(st.R1 / st.R2, 3)],
      ["R₃ / R₄", L.num(st.R3 / st.R4, 3)],
      ["Potential at B", L.num(s.VB, 3) + " V", "#60a5fa"],
      ["Potential at D", L.num(s.VD, 3) + " V", "#f59e0b"],
      ["Galvanometer current", L.num(s.Ig * 1000, 3) + " mA", balanced ? C.ok : C.danger],
      ["Bridge state", balanced ? "balanced" : "not balanced", balanced ? C.ok : C.danger]
    ]);
    if(balanced) L.verdict("<b>Balanced!</b> R₁/R₂ = R₃/R₄ and the galvanometer current is zero. An unknown resistance in one arm can now be found from the other three.");
    else {
      var need = st.R2 * st.R3 / st.R1;
      L.verdict("<b>Not balanced.</b> R₁/R₂ = " + L.num(st.R1 / st.R2, 3) + " but R₃/R₄ = " + L.num(st.R3 / st.R4, 3) + ". To balance with these R₁, R₂ and R₃, set R₄ = " + L.num(need, 2) + " Ω.");
    }
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("u9-R1", "Arm AB = R₁", 1, 100, 1, st.R1, L.num(st.R1, 0) + " Ω") +
      L.slider("u9-R2", "Arm BC = R₂", 1, 100, 1, st.R2, L.num(st.R2, 0) + " Ω") +
      L.slider("u9-R3", "Arm AD = R₃", 1, 100, 1, st.R3, L.num(st.R3, 0) + " Ω") +
      L.slider("u9-R4", "Arm DC = R₄", 1, 100, 1, st.R4, L.num(st.R4, 0) + " Ω")
    );
    L.onInput("u9-R1", function(v){ st.R1 = Number(v); L.setVal("u9-R1", L.num(v, 0) + " Ω"); draw(); });
    L.onInput("u9-R2", function(v){ st.R2 = Number(v); L.setVal("u9-R2", L.num(v, 0) + " Ω"); draw(); });
    L.onInput("u9-R3", function(v){ st.R3 = Number(v); L.setVal("u9-R3", L.num(v, 0) + " Ω"); draw(); });
    L.onInput("u9-R4", function(v){ st.R4 = Number(v); L.setVal("u9-R4", L.num(v, 0) + " Ω"); draw(); });
    L.legend([["#60a5fa", "bridge arms"], [C.ok, "balanced"], [C.danger, "deflection"]]);
    L.watch("Vary the four arms. The galvanometer current falls to zero when R₁/R₂ = R₃/R₄ — the balance condition.");
    draw();
  }

  window.SIMS.wheatstone = {mount: mount, draw: draw, select: function(){}, state: st};
})();


