// Class 12 Physics, Chapter 7 (leph107) — simulation labs.
// One lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}
function wire(x1, y1, x2, y2, color, w){
  return LAB.line(x1, y1, x2, y2, color || "#94a3b8", w || 2);
}
function acSource(cx, cy, r){
  var s = LAB.circle(cx, cy, r, "#0f1b28", ' stroke="#f8fafc" stroke-width="2"');
  s += '<path d="M' + (cx - r * 0.55) + ' ' + cy + ' q ' + (r * 0.28) + ' ' + (-r * 0.7) + ' ' + (r * 0.55) + ' 0 q ' + (r * 0.28) + ' ' + (r * 0.7) + ' ' + (r * 0.55) + ' 0" fill="none" stroke="#fbbf24" stroke-width="2"/>';
  return s;
}
function resistorH(x, y, w){
  var n = 6, step = w / n, s = "";
  for(var i = 0; i < n; i += 1){
    var x0 = x + i * step;
    s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + step / 2) + '" y2="' + (y - 12) + '" stroke="#f8fafc" stroke-width="2"/>';
    s += '<line x1="' + (x0 + step / 2) + '" y1="' + (y - 12) + '" x2="' + (x0 + step) + '" y2="' + y + '" stroke="#f8fafc" stroke-width="2"/>';
  }
  return s;
}
function inductorH(x, y, w, loops){
  var step = w / loops, s = "";
  for(var i = 0; i < loops; i += 1){
    s += '<path d="M' + (x + i * step) + ' ' + y + ' a ' + (step / 2) + ' 12 0 0 1 ' + step + ' 0" fill="none" stroke="#fbbf24" stroke-width="2.2"/>';
  }
  return s;
}
function capacitorH(x, y, w){
  return '<line x1="' + x + '" y1="' + (y - 16) + '" x2="' + x + '" y2="' + (y + 16) + '" stroke="#60a5fa" stroke-width="3"/>' +
    '<line x1="' + (x + w) + '" y1="' + (y - 16) + '" x2="' + (x + w) + '" y2="' + (y + 16) + '" stroke="#60a5fa" stroke-width="3"/>' +
    wire(x - 18, y, x, y) + wire(x + w, y, x + w + 18, y);
}

// ---------------------------------------------------------------------------
// Lab 1 — AC waveform, rms and power (NCERT §7.1-7.2)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {vm: 311, R: 220, freq: 50};

  function draw(){
    var w = 2 * Math.PI * st.freq;
    var V = st.vm / Math.SQRT2;
    var im = st.vm / st.R;
    var I = im / Math.SQRT2;
    var P = I * I * st.R;
    var x0 = 70, y0 = 150, gw = 610, gh = 88;
    var m = "";
    m += L.line(x0, y0, x0 + gw, y0, C.muted, 1.5);
    m += L.line(x0, y0 - gh - 10, x0, y0 + gh + 10, C.muted, 1.5);
    m += L.text(x0 + gw, y0 + 22, "t", {size: 13, color: C.text, anchor: "end"});
    m += L.text(x0 - 8, y0 - gh - 14, "v, i", {size: 13, color: C.text, anchor: "start"});
    var k, pv = "", pi = "";
    for(k = 0; k <= 96; k += 1){
      var t = k / 96 * (2 / st.freq);
      var px = x0 + k / 96 * gw;
      pv += px + "," + (y0 - gh * Math.sin(w * t)) + " ";
      pi += px + "," + (y0 - gh * 0.7 * Math.sin(w * t)) + " ";
    }
    m += '<polyline fill="none" stroke="#fbbf24" stroke-width="2.6" points="' + pv + '"/>';
    m += '<polyline fill="none" stroke="#60a5fa" stroke-width="2.2" points="' + pi + '"/>';
    m += L.text(330, 32, "v = vₘ sin ωt", {size: 15, color: "#fbbf24", weight: 700});
    m += L.text(480, 32, "i = iₘ sin ωt (in phase)", {size: 15, color: "#60a5fa", weight: 700});
    m += L.text(x0, 288, "average power P = I²R = " + L.num(P, 1) + " W", {size: 16, color: C.ok, weight: 700});
    L.svg(m, "Voltage and current waveforms in phase for a resistor.", 300);
    L.readout([
      ["Peak voltage vm", L.num(st.vm, 0) + " V"],
      ["Rms voltage V = vm/√2", L.num(V, 1) + " V", "#fbbf24"],
      ["Rms current I = V/R", L.num(I, 3) + " A", "#60a5fa"],
      ["Peak current im", L.num(im, 3) + " A"],
      ["Average power I²R", L.num(P, 1) + " W", C.ok]
    ]);
    L.verdict("The current rises and falls exactly with the voltage — a resistor has no memory and no phase lag. Although the current averages to zero, the power I²R is positive in both half-cycles, so the average power is <b>" + L.num(P, 1) + " W</b>.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t1-vm", "Peak voltage vm", 50, 340, 10, st.vm, L.num(st.vm, 0) + " V") +
      L.slider("t1-R", "Resistance R", 10, 500, 10, st.R, L.num(st.R, 0) + " Ω")
    );
    L.onInput("t1-vm", function(v){ st.vm = v; L.setVal("t1-vm", L.num(v, 0) + " V"); draw(); });
    L.onInput("t1-R", function(v){ st.R = v; L.setVal("t1-R", L.num(v, 0) + " Ω"); draw(); });
    L.legend([["#fbbf24", "voltage v(t)"], ["#60a5fa", "current i(t)"], [C.ok, "average power"]]);
    L.watch("The quoted mains voltage (220 V) is an rms value, so the peak is √2 times larger. Move the sliders and compare.");
    draw();
  }

  window.SIMS.acrms = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 2 — Phasor bench (NCERT §7.3)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {mode: "R", angle: 40};
  var PHASE = {R: 0, L: -90, C: 90};

  function draw(){
    var phi = PHASE[st.mode];
    var th = st.angle * Math.PI / 180;
    var cx = 210, cy = 160, R = 105;
    var m = "";
    m += L.circle(cx, cy, R, "rgba(148,163,184,0.06)", ' stroke="#475569" stroke-width="1"');
    m += L.line(cx - R, cy, cx + R, cy, C.faint, 1);
    m += L.line(cx, cy - R, cx, cy + R, C.faint, 1);
    var vx = cx + R * Math.cos(th), vy = cy - R * Math.sin(th);
    var ix = cx + R * Math.cos(th + phi * Math.PI / 180), iy = cy - R * Math.sin(th + phi * Math.PI / 180);
    m += L.arrow(cx, cy, vx, vy, "#fbbf24", 4);
    m += L.arrow(cx, cy, ix, iy, "#60a5fa", 4);
    m += L.text(vx, vy - 10, "V", {color: "#fbbf24", size: 16, weight: 700});
    m += L.text(ix, iy - 10, "I", {color: "#60a5fa", size: 16, weight: 700});
    m += L.line(vx, vy, vx, cy, "#fbbf24", 1, "4 4");
    m += L.line(ix, iy, ix, cy, "#60a5fa", 1, "4 4");
    var gx = 470, gy = 160, gw = 210, gh = 100;
    var k, pts = "";
    for(k = 0; k <= 72; k += 1){
      var t = k / 72 * 4 * Math.PI;
      pts += (gx + k / 72 * gw) + "," + (gy - gh * 0.45 * Math.sin(t)) + " ";
    }
    m += '<polyline fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="2" points="' + pts + '"/>';
    var ptsI = "";
    for(k = 0; k <= 72; k += 1){
      var t2 = k / 72 * 4 * Math.PI;
      ptsI += (gx + k / 72 * gw) + "," + (gy - gh * 0.45 * Math.sin(t2 + phi * Math.PI / 180)) + " ";
    }
    m += '<polyline fill="none" stroke="rgba(96,165,250,0.75)" stroke-width="2" points="' + ptsI + '"/>';
    m += L.line(gx, gy, gx + gw, gy, C.muted, 1.5);
    m += L.text(gx + gw / 2, gy + 24, "ωt", {size: 13, color: C.text});
    m += L.text(400, 40, st.mode === "R" ? "IN PHASE" : (st.mode === "L" ? "CURRENT LAGS BY 90°" : "CURRENT LEADS BY 90°"), {size: 18, color: C.text, weight: 700});
    L.svg(m, "Rotating voltage and current phasors with their sine projections.", 300);
    L.readout([
      ["Element", st.mode === "R" ? "resistor" : (st.mode === "L" ? "inductor" : "capacitor")],
      ["Phase of I relative to V", phi === 0 ? "0°" : (phi < 0 ? "lags by 90°" : "leads by 90°"), "#60a5fa"],
      ["Rotation angle ωt", L.num(st.angle, 0) + "°"],
      ["v at this instant", L.num(Math.sin(th), 2) + " vm", "#fbbf24"],
      ["i at this instant", L.num(Math.sin(th + phi * Math.PI / 180), 2) + " im", "#60a5fa"]
    ]);
    L.verdict(st.mode === "R" ? "For a resistor the two phasors are always parallel: there is no phase difference. The current reaches every value at the same instant as the voltage." : (st.mode === "L" ? "The current phasor lags the voltage phasor by 90°. Rotate the diagram and watch the current peak a quarter-cycle after the voltage." : "The current phasor leads the voltage phasor by 90°. The current peaks a quarter-cycle before the voltage."));
  }

  function select(id){
    st.mode = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["R", "Resistor (in phase)"], ["L", "Inductor (I lags)"], ["C", "Capacitor (I leads)"]], st.mode, select);
    L.controls(L.slider("t2-th", "Rotation angle ωt", 0, 360, 5, st.angle, L.num(st.angle, 0) + "°"));
    L.onInput("t2-th", function(v){ st.angle = v; L.setVal("t2-th", L.num(v, 0) + "°"); draw(); });
    L.legend([["#fbbf24", "voltage phasor V"], ["#60a5fa", "current phasor I"]]);
    L.watch("Switch between R, L and C, then rotate the phasors. The vertical projections are the instantaneous v and i.");
    draw();
  }

  window.SIMS.phasorlab = {mount: mount, draw: draw, select: select, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 3 — AC through a pure inductor (NCERT §7.4)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {Lm: 25, freq: 50, V: 220};

  function draw(){
    var Lh = st.Lm * 1e-3;
    var w = 2 * Math.PI * st.freq;
    var XL = w * Lh;
    var I = st.V / XL;
    var im = I * Math.SQRT2;
    var m = "";
    m += wire(110, 90, 110, 240);
    m += wire(110, 90, 300, 90);
    m += inductorH(300, 90, 180, 5);
    m += wire(480, 90, 590, 90);
    m += wire(590, 90, 590, 240);
    m += wire(110, 240, 590, 240);
    m += acSource(110, 165, 30);
    m += L.text(70, 165, "v(t)", {size: 13, color: C.text, anchor: "end"});
    m += L.text(390, 70, "L = " + L.num(st.Lm, 0) + " mH", {size: 14, color: "#fbbf24", weight: 700});
    var i;
    for(i = 0; i < 7; i += 1){
      m += L.circle(90, 115 + i * 18, 2.5, "rgba(96,165,250,0.8)");
    }
    m += L.arrow(90, 100, 90, 78, "#60a5fa", 2.5);
    m += L.text(70, 74, "i", {size: 14, color: "#60a5fa", weight: 700, anchor: "end"});
    L.svg(m, "Circuit with an ac source and a pure inductor.", 290);
    L.readout([
      ["Inductance L", L.num(st.Lm, 0) + " mH"],
      ["Frequency ν", L.num(st.freq, 0) + " Hz"],
      ["Reactance XL = 2πνL", L.num(XL, 2) + " Ω", "#fbbf24"],
      ["Rms current I = V/XL", L.num(I, 3) + " A", "#60a5fa"],
      ["Peak current im", L.num(im, 3) + " A"],
      ["Average power", "0 W", C.muted]
    ]);
    L.verdict("The current lags the voltage by exactly <b>π/2</b>, so over a full cycle the power flows in and out of the magnetic field and averages to zero. Raising the frequency raises XL, so the current falls.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t3-L", "Inductance L", 5, 100, 5, st.Lm, L.num(st.Lm, 0) + " mH") +
      L.slider("t3-f", "Frequency ν", 10, 200, 10, st.freq, L.num(st.freq, 0) + " Hz") +
      L.slider("t3-V", "Rms voltage V", 50, 300, 10, st.V, L.num(st.V, 0) + " V")
    );
    L.onInput("t3-L", function(v){ st.Lm = v; L.setVal("t3-L", L.num(v, 0) + " mH"); draw(); });
    L.onInput("t3-f", function(v){ st.freq = v; L.setVal("t3-f", L.num(v, 0) + " Hz"); draw(); });
    L.onInput("t3-V", function(v){ st.V = v; L.setVal("t3-V", L.num(v, 0) + " V"); draw(); });
    L.legend([["#fbbf24", "inductor"], ["#60a5fa", "current"]]);
    L.watch("Double the frequency and watch the reactance double, so the current halves. The current always peaks a quarter-cycle after the voltage.");
    draw();
  }

  window.SIMS.indlab = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 4 — AC through a pure capacitor (NCERT §7.5)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {Cm: 15, freq: 50, V: 220};

  function draw(){
    var Ch = st.Cm * 1e-6;
    var w = 2 * Math.PI * st.freq;
    var XC = 1 / (w * Ch);
    var I = st.V / XC;
    var im = I * Math.SQRT2;
    var m = "";
    m += wire(110, 90, 110, 240);
    m += wire(110, 90, 340, 90);
    m += capacitorH(360, 90, 40);
    m += wire(110, 240, 590, 240);
    m += wire(590, 90, 590, 240);
    m += wire(400, 90, 590, 90);
    m += acSource(110, 165, 30);
    m += L.text(70, 165, "v(t)", {size: 13, color: C.text, anchor: "end"});
    m += L.text(380, 60, "C = " + L.num(st.Cm, 0) + " μF", {size: 14, color: "#60a5fa", weight: 700});
    var i;
    for(i = 0; i < 7; i += 1){
      m += L.circle(90, 115 + i * 18, 2.5, "rgba(96,165,250,0.8)");
    }
    m += L.arrow(90, 100, 90, 78, "#60a5fa", 2.5);
    m += L.text(70, 74, "i", {size: 14, color: "#60a5fa", weight: 700, anchor: "end"});
    L.svg(m, "Circuit with an ac source and a pure capacitor.", 290);
    L.readout([
      ["Capacitance C", L.num(st.Cm, 0) + " μF"],
      ["Frequency ν", L.num(st.freq, 0) + " Hz"],
      ["Reactance XC = 1/(2πνC)", L.num(XC, 1) + " Ω", "#60a5fa"],
      ["Rms current I = V/XC", L.num(I, 3) + " A", "#fbbf24"],
      ["Peak current im", L.num(im, 3) + " A"],
      ["Average power", "0 W", C.muted]
    ]);
    L.verdict("The current leads the voltage by exactly <b>π/2</b>: the capacitor takes its largest current while its voltage is changing fastest. Raising the frequency lowers XC, so more current flows — which is why a capacitor passes high frequencies and blocks dc.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t4-C", "Capacitance C", 2, 100, 2, st.Cm, L.num(st.Cm, 0) + " μF") +
      L.slider("t4-f", "Frequency ν", 10, 200, 10, st.freq, L.num(st.freq, 0) + " Hz") +
      L.slider("t4-V", "Rms voltage V", 50, 300, 10, st.V, L.num(st.V, 0) + " V")
    );
    L.onInput("t4-C", function(v){ st.Cm = v; L.setVal("t4-C", L.num(v, 0) + " μF"); draw(); });
    L.onInput("t4-f", function(v){ st.freq = v; L.setVal("t4-f", L.num(v, 0) + " Hz"); draw(); });
    L.onInput("t4-V", function(v){ st.V = v; L.setVal("t4-V", L.num(v, 0) + " V"); draw(); });
    L.legend([["#60a5fa", "capacitor"], ["#fbbf24", "current"]]);
    L.watch("Double the frequency and watch the reactance halve, so the current doubles. The current always peaks a quarter-cycle before the voltage.");
    draw();
  }

  window.SIMS.caplab = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 5 — Series LCR impedance (NCERT §7.6)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {R: 30, Lm: 100, Cm: 50, freq: 50, V: 220};

  function draw(){
    var Lh = st.Lm * 1e-3, Ch = st.Cm * 1e-6;
    var w = 2 * Math.PI * st.freq;
    var XL = w * Lh, XC = 1 / (w * Ch);
    var Z = Math.sqrt(st.R * st.R + (XC - XL) * (XC - XL));
    var I = st.V / Z;
    var phi = Math.atan2(XC - XL, st.R) * 180 / Math.PI;
    var m = "";
    m += wire(90, 80, 90, 240);
    m += wire(90, 80, 150, 80);
    m += resistorH(150, 80, 110);
    m += wire(260, 80, 330, 80);
    m += inductorH(330, 80, 110, 4);
    m += wire(440, 80, 500, 80);
    m += capacitorH(500, 80, 30);
    m += wire(530, 80, 620, 80);
    m += wire(620, 80, 620, 240);
    m += wire(90, 240, 620, 240);
    m += acSource(90, 160, 30);
    m += L.text(205, 52, "R = " + L.num(st.R, 0) + " Ω", {size: 13, color: "#f8fafc"});
    m += L.text(385, 52, "L = " + L.num(st.Lm, 0) + " mH", {size: 13, color: "#fbbf24"});
    m += L.text(560, 52, "C = " + L.num(st.Cm, 0) + " μF", {size: 13, color: "#60a5fa"});
    // impedance triangle
    var tx = 160, ty = 290, sc = Math.min(1.1, 120 / Math.max(Z, 1));
    m += L.line(tx, ty, tx + st.R * sc, ty, "#f8fafc", 3);
    m += L.line(tx + st.R * sc, ty, tx + st.R * sc, ty + (XC - XL) * sc * 0.6, "#60a5fa", 3);
    m += L.arrow(tx, ty, tx + st.R * sc, ty + (XC - XL) * sc * 0.6, C.ok, 3);
    m += L.text(tx + st.R * sc / 2, ty + 16, "R", {size: 12, color: "#f8fafc"});
    m += L.text(tx + st.R * sc + 8, ty + (XC - XL) * sc * 0.3, "XC−XL", {size: 12, color: "#60a5fa"});
    m += L.text(tx + 40, ty + (XC - XL) * sc * 0.3 - 8, "Z", {size: 12, color: C.ok});
    L.svg(m, "Series LCR circuit with its impedance triangle.", 300);
    L.readout([
      ["XL = 2πνL", L.num(XL, 2) + " Ω", "#fbbf24"],
      ["XC = 1/(2πνC)", L.num(XC, 2) + " Ω", "#60a5fa"],
      ["Z = √(R²+(XC−XL)²)", L.num(Z, 2) + " Ω", C.ok],
      ["Phase angle φ", L.num(phi, 1) + "°", phi > 0 ? "#60a5fa" : (phi < 0 ? "#fbbf24" : C.muted)],
      ["Rms current I = V/Z", L.num(I, 3) + " A", "#f8fafc"]
    ]);
    var msg;
    if(Math.abs(XC - XL) < 0.02 * Math.max(1, XL)) msg = "<b>Near resonance:</b> XL ≈ XC, the reactances cancel, Z ≈ R, and the current is in phase with the voltage (φ ≈ 0).";
    else if(XC > XL) msg = "XC &gt; XL, so the circuit is <b>capacitive</b>: the current leads the voltage (φ = " + L.num(phi, 1) + "°).";
    else msg = "XL &gt; XC, so the circuit is <b>inductive</b>: the current lags the voltage (φ = " + L.num(phi, 1) + "°).";
    L.verdict(msg);
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t5-R", "Resistance R", 5, 200, 5, st.R, L.num(st.R, 0) + " Ω") +
      L.slider("t5-L", "Inductance L", 10, 300, 10, st.Lm, L.num(st.Lm, 0) + " mH") +
      L.slider("t5-C", "Capacitance C", 5, 200, 5, st.Cm, L.num(st.Cm, 0) + " μF") +
      L.slider("t5-f", "Frequency ν", 10, 200, 10, st.freq, L.num(st.freq, 0) + " Hz") +
      L.slider("t5-V", "Rms voltage V", 50, 300, 10, st.V, L.num(st.V, 0) + " V")
    );
    L.onInput("t5-R", function(v){ st.R = v; L.setVal("t5-R", L.num(v, 0) + " Ω"); draw(); });
    L.onInput("t5-L", function(v){ st.Lm = v; L.setVal("t5-L", L.num(v, 0) + " mH"); draw(); });
    L.onInput("t5-C", function(v){ st.Cm = v; L.setVal("t5-C", L.num(v, 0) + " μF"); draw(); });
    L.onInput("t5-f", function(v){ st.freq = v; L.setVal("t5-f", L.num(v, 0) + " Hz"); draw(); });
    L.onInput("t5-V", function(v){ st.V = v; L.setVal("t5-V", L.num(v, 0) + " V"); draw(); });
    L.legend([["#f8fafc", "resistor R"], ["#fbbf24", "inductor L"], ["#60a5fa", "capacitor C"], [C.ok, "impedance Z"]]);
    L.watch("Move frequency up and down: above resonance XL dominates and the current lags; below it XC dominates and the current leads.");
    draw();
  }

  window.SIMS.lcrlab = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 6 — Resonance curve (NCERT §7.6.2)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {Lm: 25, Cm: 796, R: 3, V: 200};

  function currentAt(nu){
    var w = 2 * Math.PI * nu;
    var Lh = st.Lm * 1e-3, Ch = st.Cm * 1e-6;
    var X = w * Lh - 1 / (w * Ch);
    return st.V / Math.sqrt(st.R * st.R + X * X);
  }

  function draw(){
    var Lh = st.Lm * 1e-3, Ch = st.Cm * 1e-6;
    var nu0 = 1 / (2 * Math.PI * Math.sqrt(Lh * Ch));
    var w0 = 2 * Math.PI * nu0;
    var Imax = st.V / st.R;
    var Q = w0 * Lh / st.R;
    var x0 = 70, y0 = 250, gw = 600, gh = 190;
    var nuMax = nu0 * 4;
    var m = "";
    var i;
    for(i = 0; i <= 8; i += 1){
      var x = x0 + i * gw / 8;
      m += L.line(x, y0, x, y0 - gh, C.grid, 1);
      m += L.text(x, y0 + 20, L.num(i * nuMax / 8, 0), {size: 11, color: C.muted});
    }
    for(i = 0; i <= 4; i += 1){
      var y = y0 - i * gh / 4;
      m += L.line(x0, y, x0 + gw, y, C.grid, 1);
      m += L.text(x0 - 8, y + 4, L.num(i * Imax / 4, 0), {size: 11, color: C.muted, anchor: "end"});
    }
    m += L.line(x0, y0, x0 + gw + 8, y0, C.muted, 1.5);
    m += L.line(x0, y0, x0, y0 - gh - 8, C.muted, 1.5);
    m += L.text(x0 + gw, y0 + 36, "frequency ν (Hz)", {size: 12, color: C.text, anchor: "end"});
    m += L.text(x0 + 4, y0 - gh - 14, "current I (A)", {size: 12, color: C.text, anchor: "start"});
    var pts = "";
    for(i = 0; i <= 180; i += 1){
      var nu = i / 180 * nuMax;
      var cur = currentAt(nu);
      var frac = Math.min(1, cur / Imax);
      pts += (x0 + i / 180 * gw) + "," + (y0 - frac * gh * 0.92) + " ";
    }
    m += '<polyline fill="none" stroke="#60a5fa" stroke-width="3" points="' + pts + '"/>';
    var px = x0 + (nu0 / nuMax) * gw;
    m += L.line(px, y0, px, y0 - gh * 0.92, C.ok, 2, "5 4");
    m += L.circle(px, y0 - gh * 0.92, 5, C.ok);
    m += L.text(px + 8, 62, "ω₀ = 1/√(LC)", {size: 15, color: C.ok, weight: 700, anchor: "start"});
    m += L.text(360, 34, "ν₀ ≈ " + L.num(nu0, 1) + " Hz   ·   I at resonance ≈ " + L.num(Imax, 1) + " A", {size: 15, color: C.text, weight: 700});
    L.svg(m, "Resonance curve of a series LCR circuit: current versus driving frequency.", 300);
    L.readout([
      ["L", L.num(st.Lm, 0) + " mH"],
      ["C", L.num(st.Cm, 0) + " μF"],
      ["R", L.num(st.R, 0) + " Ω"],
      ["Resonant frequency ν₀", L.num(nu0, 2) + " Hz", C.ok],
      ["Maximum current V/R", L.num(Imax, 2) + " A", "#60a5fa"],
      ["Quality factor Q = ω₀L/R", L.num(Q, 1), C.text]
    ]);
    L.verdict("<b>Resonance:</b> at ν₀ = 1/(2π√(LC)) the reactances cancel, Z = R and the current peaks. A smaller R (higher Q) makes the peak sharper. Away from ν₀ the current falls on both sides.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t6-L", "Inductance L", 5, 100, 5, st.Lm, L.num(st.Lm, 0) + " mH") +
      L.slider("t6-C", "Capacitance C", 100, 1000, 100, st.Cm, L.num(st.Cm, 0) + " μF") +
      L.slider("t6-R", "Resistance R", 1, 100, 1, st.R, L.num(st.R, 0) + " Ω") +
      L.slider("t6-V", "Rms voltage V", 50, 300, 10, st.V, L.num(st.V, 0) + " V")
    );
    L.onInput("t6-L", function(v){ st.Lm = v; L.setVal("t6-L", L.num(v, 0) + " mH"); draw(); });
    L.onInput("t6-C", function(v){ st.Cm = v; L.setVal("t6-C", L.num(v, 0) + " μF"); draw(); });
    L.onInput("t6-R", function(v){ st.R = v; L.setVal("t6-R", L.num(v, 0) + " Ω"); draw(); });
    L.onInput("t6-V", function(v){ st.V = v; L.setVal("t6-V", L.num(v, 0) + " V"); draw(); });
    L.legend([["#60a5fa", "current vs frequency"], [C.ok, "resonant peak"]]);
    L.watch("Lower R sharpens the peak; change L or C to move where the peak sits on the frequency axis.");
    draw();
  }

  window.SIMS.resonance = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 7 — Power and power factor (NCERT §7.7)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {phi: 53, V: 200, I: 5};

  function draw(){
    var th = st.phi * Math.PI / 180;
    var P = st.V * st.I * Math.cos(th);
    var Q = st.V * st.I * Math.sin(th);
    var S = st.V * st.I;
    var m = "";
    // power triangle
    var x0 = 120, y0 = 250;
    var b = 300 * Math.cos(th), h = 170 * Math.sin(th);
    m += L.line(x0, y0, x0 + b, y0, C.ok, 4);
    m += L.line(x0 + b, y0, x0 + b, y0 - h, "#fbbf24", 4);
    m += L.arrow(x0, y0, x0 + b, y0 - h, C.danger, 3.5);
    m += L.line(x0, y0, x0 + b, y0 - h, "rgba(239,68,68,0.35)", 1, "5 4");
    m += L.text(x0 + b / 2, y0 + 22, "P = " + L.num(P, 1) + " W", {color: C.ok, size: 14, weight: 700});
    m += L.text(x0 + b + 10, y0 - h / 2, "Q = " + L.num(Q, 1) + " var", {color: "#fbbf24", size: 13, anchor: "start"});
    m += L.text(x0 + b / 2 + 12, y0 - h / 2 - 8, "S = " + L.num(S, 1) + " VA", {color: C.danger, size: 13});
    m += L.text(120, 60, "cos φ = " + L.num(Math.cos(th), 2), {size: 22, color: C.text, weight: 700});
    m += L.text(150, 90, "φ = " + L.num(st.phi, 0) + "°", {size: 15, color: C.muted});
    // vectors at a rotating angle
    var cx = 560, cy = 150, R = 90;
    m += L.circle(cx, cy, R, "rgba(148,163,184,0.06)", ' stroke="#475569" stroke-width="1"');
    m += L.arrow(cx, cy, cx + R, cy, "#fbbf24", 3.5);
    m += L.arrow(cx, cy, cx + R * Math.cos(th), cy - R * Math.sin(th), "#60a5fa", 3.5);
    m += L.text(cx + R + 6, cy + 4, "V", {size: 13, color: "#fbbf24", anchor: "start"});
    m += L.text(cx + R * Math.cos(th), cy - R * Math.sin(th) - 8, "I", {size: 13, color: "#60a5fa"});
    m += L.line(cx + R * Math.cos(th), cy, cx + R * Math.cos(th), cy - R * Math.sin(th), "#60a5fa", 1, "4 4");
    L.svg(m, "Power triangle and voltage-current phasors for an ac circuit.", 300);
    L.readout([
      ["Rms voltage V", L.num(st.V, 0) + " V"],
      ["Rms current I", L.num(st.I, 1) + " A"],
      ["Phase angle φ", L.num(st.phi, 0) + "°"],
      ["Active power P = VI cos φ", L.num(P, 1) + " W", P > 1 ? C.ok : C.muted],
      ["Reactive power Q = VI sin φ", L.num(Q, 1) + " var", "#fbbf24"],
      ["Apparent power S = VI", L.num(S, 1) + " VA", C.danger]
    ]);
    var msg;
    if(st.phi <= 1) msg = "<b>φ = 0:</b> purely resistive. The whole current is active, cos φ = 1, and P = VI is maximum.";
    else if(st.phi >= 89) msg = "<b>φ = 90°:</b> purely inductive or capacitive. cos φ = 0 and P = 0: the current is wattless — it sloshes energy back and forth without doing net work.";
    else msg = "Only the component of current in phase with the voltage delivers real power. As φ grows, the active power P = VI cos φ shrinks while the wattless component I sin φ grows.";
    L.verdict(msg);
  }

  function select(id){
    if(id === "R") st.phi = 0;
    else if(id === "L") st.phi = 90;
    else if(id === "C") st.phi = 90;
    else st.phi = 53;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["R", "Pure R (pf = 1)"], ["L", "Pure L (pf = 0)"], ["LR", "RL load (pf = 0.6)"]], "LR", select);
    L.controls(
      L.slider("t7-phi", "Phase angle φ", 0, 90, 1, st.phi, L.num(st.phi, 0) + "°") +
      L.slider("t7-V", "Rms voltage V", 50, 300, 10, st.V, L.num(st.V, 0) + " V") +
      L.slider("t7-I", "Rms current I", 1, 20, 1, st.I, L.num(st.I, 1) + " A")
    );
    L.onInput("t7-phi", function(v){ st.phi = v; L.setVal("t7-phi", L.num(v, 0) + "°"); draw(); });
    L.onInput("t7-V", function(v){ st.V = v; L.setVal("t7-V", L.num(v, 0) + " V"); draw(); });
    L.onInput("t7-I", function(v){ st.I = v; L.setVal("t7-I", L.num(v, 1) + " A"); draw(); });
    L.legend([[C.ok, "active power P"], ["#fbbf24", "reactive power Q"], [C.danger, "apparent power S"]]);
    L.watch("Increase φ and watch the active power shrink even though V and I are unchanged. At 90° no net work is done.");
    draw();
  }

  window.SIMS.powerfac = {mount: mount, draw: draw, select: select, state: st};
})();

// ---------------------------------------------------------------------------
// Lab 8 — Transformer (NCERT §7.8)
// ---------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {Np: 100, Ns: 200, Vp: 220, Ip: 10};

  function draw(){
    var Vs = st.Vp * st.Ns / st.Np;
    var Is = st.Ip * st.Np / st.Ns;
    var Pin = st.Vp * st.Ip;
    var loopsP = Math.max(3, Math.min(10, Math.round(st.Np / 50)));
    var loopsS = Math.max(3, Math.min(10, Math.round(st.Ns / 50)));
    var m = "";
    m += L.rect(300, 100, 120, 170, "#1b2a3a", ' rx="10" stroke="#94a3b8" stroke-width="2"');
    m += L.text(360, 84, "LAMINATED IRON CORE", {size: 12, color: C.muted, weight: 700});
    var i, yTopP = 120, yTopS = 120;
    var stepP = loopsP > 1 ? 130 / (loopsP - 1) : 0;
    var stepS = loopsS > 1 ? 130 / (loopsS - 1) : 0;
    var yLastP = 120 + (loopsP - 1) * stepP, yLastS = 120 + (loopsS - 1) * stepS;
    for(i = 0; i < loopsP; i += 1){
      m += '<ellipse cx="300" cy="' + (120 + i * stepP) + '" rx="14" ry="7" fill="none" stroke="#fbbf24" stroke-width="2.2"/>';
    }
    for(i = 0; i < loopsS; i += 1){
      m += '<ellipse cx="420" cy="' + (120 + i * stepS) + '" rx="14" ry="7" fill="none" stroke="#60a5fa" stroke-width="2.2"/>';
    }
    m += L.text(250, 62, "PRIMARY Np = " + st.Np, {size: 14, color: "#fbbf24", weight: 700});
    m += L.text(470, 62, "SECONDARY Ns = " + st.Ns, {size: 14, color: "#60a5fa", weight: 700});
    m += wire(286, yTopP, 200, yTopP); m += wire(200, yTopP, 200, 250); m += wire(200, 250, 214, 250);
    m += acSource(240, 250, 26);
    m += wire(266, 250, 286, 250); m += wire(286, 250, 286, yLastP);
    m += L.text(120, 150, "vp = " + L.num(st.Vp, 0) + " V", {size: 13, color: "#f8fafc", anchor: "start"});
    m += L.text(120, 172, "ip = " + L.num(st.Ip, 1) + " A", {size: 13, color: "#f8fafc", anchor: "start"});
    m += wire(434, yTopS, 540, yTopS); m += wire(540, yTopS, 540, 250); m += wire(540, 250, 500, 250);
    m += resistorH(455, 250, 45);
    m += wire(434, 250, 455, 250); m += wire(434, 250, 434, yLastS);
    m += L.text(560, 150, "vs = " + L.num(Vs, 1) + " V", {size: 14, color: C.ok, anchor: "start", weight: 700});
    m += L.text(560, 172, "is = " + L.num(Is, 2) + " A", {size: 14, color: C.ok, anchor: "start"});
    m += L.text(360, 292, (st.Ns > st.Np ? "STEP-UP" : (st.Ns < st.Np ? "STEP-DOWN" : "ISOLATION")) + " TRANSFORMER", {size: 15, color: C.text, weight: 700});
    L.svg(m, "Transformer with primary and secondary coils on a laminated iron core.", 310);
    L.readout([
      ["Turns ratio Ns/Np", L.num(st.Ns / st.Np, 2), "#60a5fa"],
      ["Secondary voltage Vs", L.num(Vs, 1) + " V", C.ok],
      ["Secondary current Is", L.num(Is, 2) + " A", C.ok],
      ["Input power VpIp", L.num(Pin, 0) + " W"],
      ["Output power VsIs", L.num(Vs * Is, 0) + " W", C.ok]
    ]);
    L.verdict("The voltage follows the turns ratio <b>Vs/Vp = Ns/Np</b>. In an ideal transformer the power is unchanged, so the current scales in the opposite direction: <b>Is/Ip = Np/Ns</b>. A step-up transformer raises the voltage and lowers the current by the same factor.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t8-Np", "Primary turns Np", 50, 1000, 50, st.Np, String(st.Np)) +
      L.slider("t8-Ns", "Secondary turns Ns", 50, 1000, 50, st.Ns, String(st.Ns)) +
      L.slider("t8-Vp", "Primary voltage Vp", 50, 440, 10, st.Vp, L.num(st.Vp, 0) + " V") +
      L.slider("t8-Ip", "Primary current Ip", 1, 50, 1, st.Ip, L.num(st.Ip, 1) + " A")
    );
    L.onInput("t8-Np", function(v){ st.Np = Math.round(v); L.setVal("t8-Np", String(st.Np)); draw(); });
    L.onInput("t8-Ns", function(v){ st.Ns = Math.round(v); L.setVal("t8-Ns", String(st.Ns)); draw(); });
    L.onInput("t8-Vp", function(v){ st.Vp = v; L.setVal("t8-Vp", L.num(v, 0) + " V"); draw(); });
    L.onInput("t8-Ip", function(v){ st.Ip = v; L.setVal("t8-Ip", L.num(v, 1) + " A"); draw(); });
    L.legend([["#fbbf24", "primary coil"], ["#60a5fa", "secondary coil"], [C.ok, "output"]]);
    L.watch("Set Ns above Np for step-up and below for step-down. The power readout stays equal in both cases.");
    draw();
  }

  window.SIMS.transformer = {mount: mount, draw: draw, select: function(){}, state: st};
})();
