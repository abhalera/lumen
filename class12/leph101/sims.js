// Class 12 Physics, Chapter 1 (leph101) — simulation labs.
// One lab per lesson, in the Lumen class-9 lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Charge transfer bench (NCERT §1.1, charging by friction)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var STEPS = [
    {short: "Start", glass: 0, silk: 0, watch: "Both objects are neutral: equal positive and negative charge.", verdict: "Press a step button. The pair starts neutral, with 0 excess electrons on either body."},
    {short: "Rub", glass: 4, silk: -4, watch: "Electrons move from the glass rod to the silk cloth as they are rubbed together.", verdict: "<b>Rub:</b> the glass loses 4 electrons (+4e) and the silk gains the same 4 electrons (−4e). The total charge of the pair is still 0."},
    {short: "Separate", glass: 4, silk: -4, watch: "The charges stay on the insulating surfaces after the objects are pulled apart.", verdict: "<b>Separate:</b> the charged regions do not disappear. Glass stays +4e, silk stays −4e, total = 0. Charge was transferred, not created."},
    {short: "Bring near", glass: 4, silk: -4, watch: "Unlike charges attract across the gap. No electrons jump through dry air.", verdict: "<b>Bring near:</b> the +4e glass and −4e silk attract each other. Air is an insulator here, so no charge crosses the gap — only the attractive force appears."},
    {short: "Touch", glass: 0, silk: 0, watch: "On contact, electrons flow back from the silk to the glass until both are neutral.", verdict: "<b>Touch:</b> electrons return to the positively charged glass. Both bodies end neutral and the net charge remains 0 throughout."}
  ];
  var st = {step: 0};

  function marks(value, x, color){
    if(!value) return L.text(x, 132, "neutral", {color: C.muted, size: 18});
    var out = "";
    for(var i = 0; i < Math.min(4, Math.abs(value)); i += 1){
      var cx = x - 27 + i * 18;
      out += L.circle(cx, 126, 12, color, ' opacity=".25"') + L.text(cx, 132, value > 0 ? "+" : "−", {color: color, size: 17, weight: 700});
    }
    return out;
  }

  function draw(){
    var d = STEPS[st.step];
    var m = "";
    m += L.rect(75, 82, 250, 105, "#e7f2ff", ' rx="20" stroke="#8db0d8" stroke-width="2"');
    m += L.rect(435, 82, 250, 105, "#fff1e8", ' rx="20" stroke="#e2b794" stroke-width="2"');
    m += L.text(200, 54, "GLASS ROD", {color: "#7dd3fc", size: 20, weight: 700});
    m += L.text(560, 54, "SILK CLOTH", {color: "#fbbf24", size: 20, weight: 700});
    m += marks(d.glass, 200, "#60a5fa") + marks(d.silk, 560, "#f59e0b");
    if(st.step === 3 || st.step === 4){
      m += L.arrow(345, 140, 415, 140, st.step === 4 ? C.ok : C.danger, 4);
      m += L.text(380, 122, st.step === 4 ? "contact" : "attract", {color: st.step === 4 ? C.ok : C.danger, size: 14});
    }
    m += L.text(360, 250, "total charge of the pair = " + L.signed(d.glass + d.silk, 0) + " e", {color: C.text, size: 17, weight: 700});
    L.svg(m, "Glass rod charge " + d.glass + " e, silk cloth charge " + d.silk + " e.", 290);
    L.readout([
      ["Glass rod", (d.glass > 0 ? "+" : "") + d.glass + " e", "#60a5fa"],
      ["Silk cloth", (d.silk > 0 ? "+" : "") + d.silk + " e", "#f59e0b"],
      ["Net charge", "0 e", C.ok],
      ["Charge transferred", (d.glass !== 0 ? "4 electrons" : "0 e"), C.text]
    ]);
    L.verdict(d.verdict);
  }

  function select(id){
    st.step = Number(id);
    L.watch(STEPS[st.step].watch);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["0", "1 · Start neutral"], ["1", "2 · Rub"], ["2", "3 · Separate"], ["3", "4 · Bring near"], ["4", "5 · Touch"]], "0", select);
    L.legend([["#60a5fa", "glass (electron donor)"], ["#f59e0b", "silk (electron acceptor)"]]);
    draw();
  }

  window.SIMS.chargerub = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Attract or repel (NCERT §1.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "pn", r: 0.4};
  var Q = 1e-6;

  function signs(){
    if(st.preset === "pp") return [1, 1];
    if(st.preset === "p0") return [1, 0];
    return [1, -1];
  }

  function draw(){
    var s = signs(), q1 = s[0] * Q, q2 = s[1] * Q;
    var x1 = 190, x2 = x1 + 120 + st.r * 420;
    var F = (q2 === 0) ? 0 : 9e9 * Math.abs(q1 * q2) / (st.r * st.r);
    var m = "";
    m += L.line(80, 235, 650, 235, C.faint, 2);
    m += L.circle(x1, 185, 22, "#fff", ' stroke="' + (q1 > 0 ? C.danger : "#60a5fa") + '" stroke-width="3"');
    m += L.circle(x2, 185, 22, "#fff", ' stroke="' + (q2 > 0 ? C.danger : "#60a5fa") + '" stroke-width="3"');
    m += L.text(x1, 194, q1 > 0 ? "+" : "−", {size: 26, color: q1 > 0 ? C.danger : "#60a5fa", weight: 700});
    m += L.text(x2, 194, q2 > 0 ? "+" : "−", {size: 26, color: q2 > 0 ? C.danger : "#60a5fa", weight: 700});
    m += L.text((x1 + x2) / 2, 265, L.num(st.r, 2) + " m", {size: 15, color: C.muted});
    m += L.line(x1, 250, x2, 250, C.faint, 1, "5 5");
    if(F > 0){
      var len = 60;
      if(q1 * q2 > 0){
        m += L.arrow(x1 - 30, 185, x1 - 30 - len, 185, C.danger, 4);
        m += L.arrow(x2 + 30, 185, x2 + 30 + len, 185, C.danger, 4);
        m += L.text((x1 + x2) / 2, 60, "like charges repel", {size: 18, color: C.danger, weight: 700});
      } else {
        m += L.arrow(x1 + 30, 185, x1 + 30 + len, 185, C.ok, 4);
        m += L.arrow(x2 - 30, 185, x2 - 30 - len, 185, C.ok, 4);
        m += L.text((x1 + x2) / 2, 60, "unlike charges attract", {size: 18, color: C.ok, weight: 700});
      }
    } else {
      m += L.text((x1 + x2) / 2, 60, "no net electric force", {size: 18, color: C.muted, weight: 700});
    }
    L.svg(m, "Two charges separated by " + L.num(st.r, 2) + " metres.", 290);
    L.readout([
      ["Charge 1", (q1 > 0 ? "+1.0" : "−1.0") + " μC", q1 > 0 ? C.danger : "#60a5fa"],
      ["Charge 2", q2 === 0 ? "0 (neutral)" : (q2 > 0 ? "+1.0" : "−1.0") + " μC", q2 === 0 ? C.muted : (q2 > 0 ? C.danger : "#60a5fa")],
      ["Separation", L.num(st.r, 2) + " m"],
      ["Force", F === 0 ? "0 N" : L.num(F, 3) + " N " + (q1 * q2 > 0 ? "(repulsive)" : "(attractive)"), F === 0 ? C.muted : (q1 * q2 > 0 ? C.danger : C.ok)]
    ]);
    var msg;
    if(q2 === 0) msg = "A charged body can still attract a neutral body by polarising it, but this simple bench shows only charge-to-charge forces: with q₂ = 0 the force is zero.";
    else if(q1 * q2 > 0) msg = "Both charges have the same sign, so the force is repulsive. Move the slider: the force obeys F = kq₁q₂/r².";
    else msg = "The charges have opposite signs, so the force is attractive. The two bodies always pull with equal and opposite forces.";
    L.verdict(msg);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["pn", "Unlike + −"], ["pp", "Like + +"], ["p0", "Charged / neutral"]], st.preset, select);
    L.controls(L.slider("t2-r", "Separation r", 0.2, 0.9, 0.05, st.r, L.num(st.r, 2) + " m"));
    L.onInput("t2-r", function(v){ st.r = v; L.setVal("t2-r", L.num(v, 2) + " m"); draw(); });
    L.legend([[C.danger, "positive charge"], ["#60a5fa", "negative charge"], [C.ok, "attractive pull"]]);
    draw();
  }

  window.SIMS.twokinds = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Electron mobility: conductors and insulators (NCERT §1.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "copper"};
  var INFO = {
    copper: {name: "Copper (metal)", mobile: "free electrons in a sea", spread: true, note: "Electrons are free to move, so the excess charge spreads over the outer surface at once."},
    glass: {name: "Glass (insulator)", mobile: "electrons locked in atoms", spread: false, note: "Electrons cannot travel, so the charge stays where it was placed."},
    plastic: {name: "Plastic (insulator)", mobile: "electrons locked in molecules", spread: false, note: "Like glass, plastic holds charge locally; that is why a rubbed pen keeps its charge."}
  };

  function draw(){
    var info = INFO[st.preset];
    var m = "";
    m += L.rect(90, 110, 540, 90, info.spread ? "#25364a" : "#33272a", ' rx="14" stroke="' + (info.spread ? "#60a5fa" : "#f59e0b") + '" stroke-width="2"');
    m += L.text(360, 75, info.name.toUpperCase(), {size: 20, weight: 700, color: info.spread ? "#93c5fd" : "#fcd34d"});
    var i;
    if(info.spread){
      for(i = 0; i < 9; i += 1){
        var x = 110 + i * 62;
        m += L.circle(x, 155, 8, "#1d4ed8");
        m += L.text(x, 160, "−", {size: 13, color: "#dbeafe"});
      }
      m += L.arrow(636, 155, 668, 155, C.danger, 3);
      m += L.text(614, 100, "spreads to surface →", {size: 14, color: C.muted});
    } else {
      for(i = 0; i < 4; i += 1){
        var xc = 320 + i * 26;
        m += L.circle(xc, 155, 8, "#b45309");
        m += L.text(xc, 160, "−", {size: 13, color: "#fef3c7"});
      }
      m += L.text(360, 230, "charge stays local", {size: 15, color: "#fcd34d"});
    }
    L.svg(m, info.name + ": " + info.mobile + ".", 290);
    L.readout([
      ["Material", info.name],
      ["Electron freedom", info.mobile],
      ["Charge location", info.spread ? "outer surface" : "where placed", info.spread ? "#60a5fa" : "#f59e0b"],
      ["Conductivity", info.spread ? "conductor" : "insulator", info.spread ? C.ok : C.danger]
    ]);
    L.verdict("<b>" + info.name + ":</b> " + info.note);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["copper", "Copper"], ["glass", "Glass"], ["plastic", "Plastic"]], st.preset, select);
    L.legend([["#60a5fa", "free electron"], ["#f59e0b", "bound electron"]]);
    L.watch("Place the same charge on each material. In the metal the charge spreads; in the insulators it stays put.");
    draw();
  }

  window.SIMS.conduct = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Quantisation of charge (NCERT §1.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {n: 4, sign: 1};
  var E = 1.602e-19;

  function draw(){
    var q = st.sign * st.n * E;
    var q19 = st.n * 1.6;
    var m = "";
    m += L.circle(200, 150, 82, "#132033", ' stroke="#8db0d8" stroke-width="2"');
    for(var i = 0; i < st.n; i += 1){
      var ang = -Math.PI / 2 + i * (2 * Math.PI / Math.max(st.n, 1));
      var x = 200 + 56 * Math.cos(ang), y = 150 + 56 * Math.sin(ang);
      m += L.circle(x, y, 13, st.sign > 0 ? C.danger : "#1d4ed8");
      m += L.text(x, y + 6, st.sign > 0 ? "+" : "−", {size: 18, color: "#fff", weight: 700});
    }
    m += L.text(200, 268, (st.sign > 0 ? "deficit of " : "excess of ") + st.n + " electrons", {size: 15, color: C.muted});
    m += L.text(500, 120, "q = n e", {size: 30, color: C.text, weight: 700});
    m += L.text(500, 165, "= " + st.n + " × 1.6 × 10⁻¹⁹ C", {size: 17, color: C.muted});
    m += L.text(500, 205, "= " + L.num(st.sign * q19, 2) + " × 10⁻¹⁹ C", {size: 22, color: st.sign > 0 ? C.danger : "#60a5fa", weight: 700});
    m += L.text(500, 250, "1 C needs 6.25 × 10¹⁸ electrons", {size: 14, color: C.muted});
    L.svg(m, "A body with n excess or deficit electrons; charge equals n times e.", 290);
    L.readout([
      ["Integer n", String(st.n)],
      ["Type", st.sign > 0 ? "deficit of electrons" : "excess of electrons"],
      ["Charge q = ne", L.num(st.sign * q19, 2) + " × 10⁻¹⁹ C", st.sign > 0 ? C.danger : "#60a5fa"],
      ["In units of e", L.signed(st.n, 0) + " e"]
    ]);
    L.verdict("Charge is quantised: it always comes in whole multiples of e = 1.6 × 10⁻¹⁹ C. There is no such thing as half an electron's charge in isolation.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t4-n", "Excess electrons n", 1, 10, 1, st.n, String(st.n)) +
      '<div class="control-item"><button class="toolbar-btn" id="t4-sign">Switch to ' + (st.sign > 0 ? "excess electrons (−)" : "deficit of electrons (+)") + '</button></div>'
    );
    L.onInput("t4-n", function(v){ st.n = Number(v); L.setVal("t4-n", String(st.n)); draw(); });
    var btn = document.getElementById("t4-sign");
    if(btn) btn.addEventListener("click", function(){
      st.sign = -st.sign;
      btn.textContent = "Switch to " + (st.sign > 0 ? "excess electrons (−)" : "deficit of electrons (+)");
      draw();
    });
    L.legend([[C.danger, "positive (deficit)"], ["#60a5fa", "negative (excess)"]]);
    L.watch("Change n and switch the sign. The charge is always an exact multiple of the elementary charge e.");
    draw();
  }

  window.SIMS.quantise = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Coulomb force bench (NCERT §1.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {q1: 2, q2: 3, r: 0.5};

  function draw(){
    var q1 = st.q1 * 1e-6, q2 = st.q2 * 1e-6;
    var F = 9e9 * q1 * q2 / (st.r * st.r);
    var x1 = 170, x2 = x1 + 120 + st.r * 260;
    var m = "";
    m += L.circle(x1, 178, 24, "#fff", ' stroke="' + C.danger + '" stroke-width="3"');
    m += L.circle(x2, 178, 24, "#fff", ' stroke="' + C.danger + '" stroke-width="3"');
    m += L.text(x1, 188, "+", {size: 28, color: C.danger, weight: 700});
    m += L.text(x2, 188, "+", {size: 28, color: C.danger, weight: 700});
    m += L.text(x1, 245, "+" + st.q1 + " μC", {size: 15, color: C.danger});
    m += L.text(x2, 245, "+" + st.q2 + " μC", {size: 15, color: C.danger});
    m += L.line(x1, 215, x2, 215, C.faint, 1, "5 5");
    m += L.text((x1 + x2) / 2, 205, L.num(st.r, 2) + " m", {size: 15, color: C.muted});
    var len = Math.min(150, 12 * Math.sqrt(F) * 4);
    m += L.arrow(x1 - 30, 178, x1 - 30 - len, 178, C.danger, 4);
    m += L.arrow(x2 + 30, 178, x2 + 30 + len, 178, C.danger, 4);
    m += L.text(360, 60, "F = k q₁q₂ / r²", {size: 26, color: C.text, weight: 700});
    L.svg(m, "Two positive charges " + L.num(st.r, 2) + " metres apart.", 290);
    L.readout([
      ["q₁", "+" + st.q1 + " μC"],
      ["q₂", "+" + st.q2 + " μC"],
      ["r", L.num(st.r, 2) + " m"],
      ["F = kq₁q₂/r²", L.num(F, 3) + " N", C.danger],
      ["F if r doubles", L.num(F / 4, 3) + " N", C.muted]
    ]);
    L.verdict("<b>Repulsive force " + L.num(F, 3) + " N.</b> The arrows grow with the force. If you double r, the force falls to one quarter — the inverse-square law at work.");
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t5-q1", "Charge q₁", 1, 5, 1, st.q1, "+" + st.q1 + " μC") +
      L.slider("t5-q2", "Charge q₂", 1, 5, 1, st.q2, "+" + st.q2 + " μC") +
      L.slider("t5-r", "Separation r", 0.2, 1.0, 0.05, st.r, L.num(st.r, 2) + " m")
    );
    L.onInput("t5-q1", function(v){ st.q1 = v; L.setVal("t5-q1", "+" + v + " μC"); draw(); });
    L.onInput("t5-q2", function(v){ st.q2 = v; L.setVal("t5-q2", "+" + v + " μC"); draw(); });
    L.onInput("t5-r", function(v){ st.r = v; L.setVal("t5-r", L.num(v, 2) + " m"); draw(); });
    L.legend([[C.danger, "positive charge"], ["#94a3b8", "repulsive force"]]);
    L.watch("Move the sliders and compare the force readout with k q₁q₂/r². The arrow length tracks the force magnitude.");
    draw();
  }

  window.SIMS.coulomb = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Vector addition of electric fields (NCERT §1.6–1.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "opposite", x: 0.5};
  var K = 9e9, Q = 2e-6, X1 = 0, X2 = 1;

  function q2sign(){ return st.preset === "like" ? 1 : -1; }

  function field(x){
    var q1 = Q, q2 = q2sign() * Q;
    var e1 = K * q1 / ((x - X1) * (x - X1));
    if(x < X1) e1 = -e1;
    var e2 = K * q2 / ((x - X2) * (x - X2));
    if(x < X2) e2 = -e2;
    return {e1: e1, e2: e2, net: e1 + e2};
  }

  function arrowFor(x, y, e, color, label){
    var scale = 0.0018;
    var len = Math.max(-170, Math.min(170, e * scale));
    if(Math.abs(len) < 6) return L.text(x, y - 16, label + " = 0", {size: 13, color: color});
    return L.arrow(x, y, x + len, y, color, 3) + L.text(x + len / 2, y - 10, label, {size: 13, color: color});
  }

  function draw(){
    var f = field(st.x);
    var px = 150 + st.x * 400;
    var m = "";
    m += L.line(150, 230, 550, 230, C.faint, 2);
    m += L.circle(150, 230, 16, C.danger) + L.text(150, 237, "+", {size: 20, color: "#fff", weight: 700});
    m += L.circle(550, 230, 16, q2sign() > 0 ? C.danger : "#1d4ed8") + L.text(550, 237, q2sign() > 0 ? "+" : "−", {size: 20, color: "#fff", weight: 700});
    m += L.text(150, 265, "q₁ = +2 μC", {size: 14, color: C.muted});
    m += L.text(550, 265, "q₂ = " + (q2sign() > 0 ? "+" : "−") + "2 μC", {size: 14, color: C.muted});
    m += L.text(350, 265, "x = " + L.num(st.x, 2) + " m", {size: 14, color: C.muted});
    m += L.arrow(px, 210, px, 190, "#f8fafc", 2);
    m += L.circle(px, 178, 7, "#f8fafc");
    m += arrowFor(px, 130, f.e1, "#60a5fa", "E₁");
    m += arrowFor(px, 100, f.e2, "#f59e0b", "E₂");
    m += arrowFor(px, 62, f.net, "#f8fafc", "E net");
    L.svg(m, "Electric field vectors at x = " + L.num(st.x, 2) + " metres.", 300);
    L.readout([
      ["E₁ (from +2 μC)", L.num(f.e1 / 1000, 0) + " kN/C " + (f.e1 >= 0 ? "→" : "←"), "#60a5fa"],
      ["E₂ (from q₂)", L.num(f.e2 / 1000, 0) + " kN/C " + (f.e2 >= 0 ? "→" : "←"), "#f59e0b"],
      ["Net field", L.num(f.net / 1000, 0) + " kN/C " + (f.net >= 0 ? "→" : "←"), "#f8fafc"],
      ["Direction", f.net > 0 ? "toward +x" : (f.net < 0 ? "toward −x" : "zero"), C.muted]
    ]);
    var msg;
    if(st.preset === "opposite" && Math.abs(st.x - 0.5) < 0.03) msg = "<b>Midpoint of opposite charges:</b> the two fields point the same way and add. Use the slider to move away and watch the net field change.";
    else if(st.preset === "like" && Math.abs(st.x - 0.5) < 0.03) msg = "<b>Midpoint of like charges:</b> equal fields point in opposite directions and cancel — the net field is zero.";
    else msg = "Fields add as vectors. The white arrow is the vector sum of the blue and amber arrows: E = E₁ + E₂ + ….";
    L.verdict(msg);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch(id === "opposite" ? "Two equal and opposite charges. At the midpoint the fields reinforce." : "Two equal positive charges. At the midpoint the fields cancel.");
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["opposite", "Opposite + −"], ["like", "Like + +"]], st.preset, select);
    L.controls(L.slider("t6-x", "Test point position x", 0.1, 0.9, 0.02, st.x, L.num(st.x, 2) + " m"));
    L.onInput("t6-x", function(v){ st.x = v; L.setVal("t6-x", L.num(v, 2) + " m"); draw(); });
    L.legend([["#60a5fa", "E₁"], ["#f59e0b", "E₂"], ["#f8fafc", "E net"]]);
    L.watch("Two equal charges, one test point. Slide x and watch the net field arrow.");
    draw();
  }

  window.SIMS.fieldvec = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Field-line explorer (NCERT §1.8)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "dipole"};

  function radial(cx, cy, outward){
    var m = "";
    for(var i = 0; i < 12; i += 1){
      var a = i * Math.PI / 6;
      var r1 = 34, r2 = 120;
      var x1 = cx + r1 * Math.cos(a), y1 = cy + r1 * Math.sin(a);
      var x2 = cx + r2 * Math.cos(a), y2 = cy + r2 * Math.sin(a);
      if(outward) m += L.arrow(x1, y1, x2, y2, "#60a5fa", 2.5);
      else m += L.arrow(x2, y2, x1, y1, "#60a5fa", 2.5);
    }
    return m;
  }

  function dipoleLines(){
    var m = "";
    var xp = 280, xm = 440, cy = 150;
    m += L.circle(xp, cy, 18, C.danger) + L.text(xp, cy + 7, "+", {size: 22, color: "#fff", weight: 700});
    m += L.circle(xm, cy, 18, "#1d4ed8") + L.text(xm, cy + 7, "−", {size: 22, color: "#fff", weight: 700});
    for(var i = 0; i < 6; i += 1){
      var bow = 24 + i * 26;
      var up = "M" + xp + " " + (cy - 20) + " C " + (xp - 30) + " " + (cy - bow) + ", " + (xm + 30) + " " + (cy - bow) + ", " + xm + " " + (cy - 20);
      var dn = "M" + xp + " " + (cy + 20) + " C " + (xp - 30) + " " + (cy + bow) + ", " + (xm + 30) + " " + (cy + bow) + ", " + xm + " " + (cy + 20);
      m += '<path d="' + up + '" fill="none" stroke="#60a5fa" stroke-width="2.2"/>';
      m += '<path d="' + dn + '" fill="none" stroke="#60a5fa" stroke-width="2.2"/>';
    }
    m += L.arrow(xp + 12, cy, xm - 12, cy, "#60a5fa", 2.5);
    m += L.text(360, 45, "lines leave + and end on −", {size: 15, color: C.muted});
    return m;
  }

  function plateLines(){
    var m = "";
    m += L.rect(120, 60, 480, 22, "#7f1d1d", ' rx="6"');
    m += L.rect(120, 218, 480, 22, "#1e3a8a", ' rx="6"');
    m += L.text(360, 48, "+ + + + + + + +  (positive plate)", {size: 16, color: C.danger});
    m += L.text(360, 262, "− − − − − − − −  (negative plate)", {size: 16, color: "#93c5fd"});
    for(var i = 0; i < 11; i += 1){
      var x = 145 + i * 43;
      m += L.arrow(x, 88, x, 212, "#60a5fa", 2.5);
    }
    m += L.text(360, 145, "uniform field: equal spacing", {size: 15, color: C.muted});
    return m;
  }

  function draw(){
    var m = "";
    if(st.preset === "pos"){
      m += L.circle(360, 150, 18, C.danger) + L.text(360, 157, "+", {size: 22, color: "#fff", weight: 700});
      m += radial(360, 150, true);
      L.readout([["Source", "+ point charge", C.danger], ["Direction", "radially outward"], ["Density", "falls as 1/r²"], ["Crossing", "never"]]);
      L.verdict("Lines leave a positive charge in every direction. They are crowded near the charge and spread out as r grows, because E falls as 1/r².");
    } else if(st.preset === "neg"){
      m += L.circle(360, 150, 18, "#1d4ed8") + L.text(360, 157, "−", {size: 22, color: "#fff", weight: 700});
      m += radial(360, 150, false);
      L.readout([["Source", "− point charge", "#60a5fa"], ["Direction", "radially inward"], ["Density", "falls as 1/r²"], ["Crossing", "never"]]);
      L.verdict("Lines end on a negative charge. Arrows show the direction a positive test charge would move: toward the charge.");
    } else if(st.preset === "dipole"){
      m += dipoleLines();
      L.readout([["Sources", "+q and −q", C.text], ["Start / end", "+ surface / − surface"], ["Middle region", "one-way curves"], ["Crossing", "never"]]);
      L.verdict("Dipole lines start on the positive charge and end on the negative charge. Near the charges the lines are dense; far away they look like those of a single dipole.");
    } else {
      m += plateLines();
      L.readout([["Sources", "two large plates", C.text], ["Shape", "straight, parallel"], ["Spacing", "equal (uniform field)"], ["At edges", "fringing"]]);
      L.verdict("Between oppositely charged parallel plates the lines are straight, parallel and equally spaced: a uniform electric field.");
    }
    L.svg(m, "Electric field lines for " + st.preset + ".", 300);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["pos", "Point + charge"], ["neg", "Point − charge"], ["dipole", "Dipole + −"], ["plates", "Parallel plates"]], st.preset, select);
    L.legend([["#60a5fa", "field line"], [C.danger, "positive charge"], ["#1d4ed8", "negative charge"]]);
    L.watch("Switch between the four charge arrangements. The tangent to a line is the field direction; line density shows relative strength.");
    draw();
  }

  window.SIMS.fieldlines = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Electric flux bench (NCERT §1.9)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {E: 60, theta: 0};
  var A = 1;

  function draw(){
    var th = st.theta * Math.PI / 180;
    var phi = st.E * A * Math.cos(th);
    var cx = 360, cy = 185, half = 130;
    var dx = half * Math.cos(th), dy = half * Math.sin(th);
    var m = "";
    var i;
    var aperture = half * Math.cos(th);
    for(i = 0; i < 9; i += 1){
      var x = cx - 120 + i * 30;
      var hits = Math.abs(x - cx) <= aperture;
      var yEnd;
      if(hits){
        yEnd = Math.abs(Math.cos(th)) < 1e-6 ? cy - 6 : (cy - Math.tan(th) * (x - cx) - 6);
      } else {
        yEnd = 250;
      }
      m += L.line(x, 70, x, yEnd, hits ? "#38bdf8" : "rgba(56,189,248,.25)", hits ? 2.4 : 1.6);
    }
    m += L.line(cx - dx, cy - dy, cx + dx, cy + dy, "#f8fafc", 6);
    var nx = cx + 0, ny = cy - 78;
    m += L.arrow(cx, cy, nx, ny, C.ok, 3);
    m += L.text(nx, ny - 10, "normal", {size: 13, color: C.ok});
    m += L.text(80, 70, "E", {size: 18, color: "#38bdf8", weight: 700});
    m += L.text(360, 45, "θ = " + L.num(st.theta, 0) + "°   ·   Φ = EA cos θ", {size: 18, color: C.text, weight: 700});
    L.svg(m, "Uniform field crossing a surface tilted by " + L.num(st.theta, 0) + " degrees.", 300);
    L.readout([
      ["Field E", L.num(st.E, 0) + " N/C", "#38bdf8"],
      ["Area A", L.num(A, 1) + " m²"],
      ["Angle θ", L.num(st.theta, 0) + "°"],
      ["Flux Φ", L.num(phi, 1) + " N m²/C", phi > 0.5 ? C.ok : C.muted]
    ]);
    var msg;
    if(st.theta >= 89) msg = "<b>θ = 90°:</b> the surface is edge-on to the field. No field lines pass through it, so the flux is zero.";
    else if(st.theta <= 1) msg = "<b>θ = 0°:</b> the surface faces the field. The flux is maximum: Φ = EA = " + L.num(st.E * A, 1) + " N m²/C.";
    else msg = "Tilt the surface and watch the number of crossing lines fall. The flux follows Φ = EA cos θ.";
    L.verdict(msg);
  }

  function mount(){
    labNoTimeline();
    L.controls(
      L.slider("t8-E", "Field E", 10, 100, 5, st.E, L.num(st.E, 0) + " N/C") +
      L.slider("t8-th", "Tilt angle θ", 0, 90, 5, st.theta, L.num(st.theta, 0) + "°")
    );
    L.onInput("t8-E", function(v){ st.E = v; L.setVal("t8-E", L.num(v, 0) + " N/C"); draw(); });
    L.onInput("t8-th", function(v){ st.theta = v; L.setVal("t8-th", L.num(v, 0) + "°"); draw(); });
    L.legend([["#38bdf8", "field line"], ["#f8fafc", "surface"], [C.ok, "normal"]]);
    L.watch("Keep the area fixed at 1 m². Tilt the surface and count how many field lines cross it.");
    draw();
  }

  window.SIMS.flux = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 9 — Dipole in a uniform field (NCERT §1.10–1.12)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {theta: 90};
  var P = 4e-9, E = 5e4;

  function draw(){
    var th = st.theta * Math.PI / 180;
    var torque = P * E * Math.sin(th);
    var cx = 360, cy = 160, Lp = 80;
    var ux = Math.cos(th), uy = -Math.sin(th);
    var xp = cx + ux * Lp, yp = cy + uy * Lp;
    var xm = cx - ux * Lp, ym = cy - uy * Lp;
    var m = "";
    var i;
    for(i = 0; i < 6; i += 1){
      var y = 60 + i * 40;
      m += L.arrow(90, y, 640, y, "rgba(148,163,184,.5)", 2);
    }
    m += L.text(650, 60, "E", {size: 18, color: C.muted, weight: 700});
    m += L.line(xm, ym, xp, yp, "#94a3b8", 4);
    m += L.circle(xp, yp, 16, C.danger) + L.text(xp, yp + 6, "+", {size: 20, color: "#fff", weight: 700});
    m += L.circle(xm, ym, 16, "#1d4ed8") + L.text(xm, ym + 6, "−", {size: 20, color: "#fff", weight: 700});
    m += L.arrow(xp, yp, xp + 55, yp, C.danger, 3);
    m += L.arrow(xm, ym, xm - 55, ym, C.danger, 3);
    var R = 50;
    if(st.theta > 3){
      var p0x = cx + R, p0y = cy;
      var p1x = cx + R * Math.cos(th), p1y = cy - R * Math.sin(th);
      m += '<path d="M ' + p0x + ' ' + p0y + ' A ' + R + ' ' + R + ' 0 0 0 ' + p1x + ' ' + p1y + '" fill="none" stroke="' + C.ok + '" stroke-width="3"/>';
      m += L.arrow(p1x + 10 * Math.sin(th), p1y + 10 * Math.cos(th), p1x, p1y, C.ok, 3);
    }
    m += L.text(360, 265, "τ = pE sin θ = " + L.num(torque * 1e6, 1) + " × 10⁻⁶ N m", {size: 18, color: C.ok, weight: 700});
    L.svg(m, "Dipole at " + L.num(st.theta, 0) + " degrees to a uniform field.", 300);
    L.readout([
      ["Dipole moment p", "4 × 10⁻⁹ C m"],
      ["Field E", "5 × 10⁴ N/C"],
      ["Angle θ", L.num(st.theta, 0) + "°"],
      ["Torque τ", L.num(torque * 1e6, 1) + " × 10⁻⁶ N m", torque > 1e-6 ? C.ok : C.muted],
      ["Net force", "0 N", C.muted]
    ]);
    var msg;
    if(st.theta <= 3) msg = "<b>Aligned with the field:</b> the forces on +q and −q act along the same line, so the torque is zero. This is the stable equilibrium orientation.";
    else if(st.theta >= 177) msg = "<b>Anti-aligned (θ = 180°):</b> the torque is again zero, but this is unstable — the slightest nudge twists the dipole back toward alignment.";
    else if(Math.abs(st.theta - 90) <= 3) msg = "<b>θ = 90°:</b> the forces are perpendicular to the dipole axis, producing the maximum torque τ = pE.";
    else msg = "The force pair on the dipole is equal and opposite, so the net force is zero. Their separation turns the pair into a torque τ = pE sin θ that twists p toward E.";
    L.verdict(msg);
  }

  function mount(){
    labNoTimeline();
    L.controls(L.slider("t9-th", "Angle θ between p and E", 0, 180, 5, st.theta, L.num(st.theta, 0) + "°"));
    L.onInput("t9-th", function(v){ st.theta = v; L.setVal("t9-th", L.num(v, 0) + "°"); draw(); });
    L.legend([["#94a3b8", "uniform field"], [C.danger, "forces on the charges"], [C.ok, "torque"]]);
    L.watch("Rotate the dipole. The torque is maximum at 90° and zero when the dipole lines up with the field.");
    draw();
  }

  window.SIMS.dipole = {mount: mount, draw: draw, select: function(){}, state: st};
})();

// -------------------------------------------------------------------------
// Lab 10 — Gaussian surface bench (NCERT §1.13–1.14)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "sphere", r: 90};
  var EPS = 8.854e-12;

  function sphere(){
    var m = "";
    m += L.circle(360, 150, st.r, "rgba(52,211,153,.10)", ' stroke="#34d399" stroke-width="2" stroke-dasharray="6 5"');
    var i;
    for(i = 0; i < 12; i += 1){
      var a = i * Math.PI / 6;
      m += L.arrow(360 + (st.r - 30) * Math.cos(a), 150 + (st.r - 30) * Math.sin(a), 360 + (st.r + 24) * Math.cos(a), 150 + (st.r + 24) * Math.sin(a), "#60a5fa", 2);
    }
    m += L.circle(360, 150, 10, C.danger) + L.text(360, 156, "+", {size: 15, color: "#fff", weight: 700});
    L.svg(m, "Spherical Gaussian surface of radius " + st.r + " pixels around a point charge.", 300);
    var Efield = 9e9 * 2e-6 / Math.pow(st.r / 100, 2);
    L.readout([
      ["Surface", "sphere, r = " + L.num(st.r / 100, 2) + " m"],
      ["Enclosed charge", "+2 μC", C.danger],
      ["Net flux q/ε₀", "2.26 × 10⁵ N m²/C", C.ok],
      ["Field at surface", L.num(Efield, 0) + " N/C"]
    ]);
    L.verdict("<b>Move the size slider:</b> the field at the surface changes as 1/r², but the net flux stays exactly q/ε₀ = 2.26 × 10⁵ N m²/C. Gauss's law depends only on the enclosed charge.");
  }

  function cylinder(){
    var m = "";
    var hw = st.r, hh = 130;
    m += L.line(360, 20, 360, 280, "#f59e0b", 4);
    m += L.text(360, 14, "line charge λ", {size: 14, color: "#f59e0b"});
    m += L.rect(360 - hw, 150 - hh / 2, hw * 2, hh, "rgba(52,211,153,.10)", ' stroke="#34d399" stroke-width="2" stroke-dasharray="6 5" rx="10"');
    var i;
    for(i = 0; i < 7; i += 1){
      var y = 60 + i * 30;
      m += L.arrow(360 - hw - 40, y, 360 - hw + 20, y, "#60a5fa", 2);
      m += L.arrow(360 + hw + 40, y, 360 + hw - 20, y, "#60a5fa", 2);
    }
    m += L.text(360, 285, "E = λ / 2πε₀r", {size: 16, color: C.text, weight: 700});
    L.svg(m, "Cylindrical Gaussian surface of radius " + st.r + " pixels around a line charge.", 300);
    L.readout([
      ["Surface", "cylinder, r = " + L.num(st.r / 100, 2) + " m"],
      ["Enclosed charge", "λL"],
      ["Net flux", "λL/ε₀", C.ok],
      ["Field at surface", "E ∝ 1/r"]
    ]);
    L.verdict("<b>Cylinder around a line charge:</b> the curved surface captures the flux, the flat caps contribute nothing. E falls as 1/r, and again the net flux depends only on the enclosed charge.");
  }

  function pillbox(){
    var m = "";
    var hw = 200, hh = st.r;
    m += L.rect(100, 148, 520, 6, "#f59e0b", ' rx="3"');
    m += L.text(120, 140, "charged sheet σ", {size: 14, color: "#f59e0b", anchor: "start"});
    m += L.rect(360 - hw / 2, 150 - hh, hw, hh * 2, "rgba(52,211,153,.10)", ' stroke="#34d399" stroke-width="2" stroke-dasharray="6 5" rx="10"');
    var i;
    for(i = 0; i < 5; i += 1){
      var x = 220 + i * 70;
      m += L.arrow(x, 150 - hh - 30, x, 150 - hh + 25, "#60a5fa", 2);
      m += L.arrow(x, 150 + hh + 30, x, 150 + hh - 25, "#60a5fa", 2);
    }
    m += L.text(360, 285, "E = σ / 2ε₀ (sheet)", {size: 16, color: C.text, weight: 700});
    L.svg(m, "Pillbox Gaussian surface of half-height " + st.r + " pixels around a charged sheet.", 300);
    L.readout([
      ["Surface", "pillbox, h = " + L.num(st.r / 100, 2) + " m"],
      ["Enclosed charge", "σA"],
      ["Net flux", "σA/ε₀", C.ok],
      ["Field at surface", "σ/2ε₀ (uniform)"]
    ]);
    L.verdict("<b>Pillbox around a sheet:</b> only the two flat faces contribute. The field of an infinite sheet is uniform, so the flux is the same no matter how tall the pillbox is.");
  }

  function draw(){
    if(st.preset === "sphere") sphere();
    else if(st.preset === "cylinder") cylinder();
    else pillbox();
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.watch(id === "sphere" ? "A spherical Gaussian surface around a point charge." : (id === "cylinder" ? "A cylindrical Gaussian surface around a line charge." : "A pillbox Gaussian surface around a charged sheet."));
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["sphere", "Sphere + point charge"], ["cylinder", "Cylinder + line charge"], ["pillbox", "Pillbox + sheet"]], st.preset, select);
    L.controls(L.slider("t10-r", "Gaussian surface size", 50, 120, 5, st.r, L.num(st.r / 100, 2) + " m"));
    L.onInput("t10-r", function(v){ st.r = v; L.setVal("t10-r", L.num(v / 100, 2) + " m"); draw(); });
    L.legend([["#34d399", "Gaussian surface"], ["#60a5fa", "field line"]]);
    L.watch("Choose a surface and change its size. The net flux always equals q_enclosed/ε₀.");
    draw();
  }

  window.SIMS.gauss = {mount: mount, draw: draw, select: select, state: st};
})();
