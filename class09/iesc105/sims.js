// Class 9 Science, Chapter 5 (iesc105) — simulation labs.
// Textbook data (Examples 5.1–5.3, Fig. 5.6, Tables 5.4–5.5) are used where given; drawings are schematic.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function beakerSVG(L, x, y, fill, label){
  return '<path d="M' + (x - 45) + ' ' + y + ' v110 q0 10 10 10 h70 q10 0 10 -10 v-110" fill="' + fill + '" stroke="#cbd5e1" stroke-width="3"/>' + L.text(x, y + 145, label, {size: 14, color: "#e2e8f0", weight: 700});
}

// Lab 1 — Activity 5.1: salt, chalk and milk in water
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "laser"};
  var B = [["A: salt + water", "rgba(186,230,253,0.25)"], ["B: chalk + water", "rgba(241,245,249,0.55)"], ["C: milk + water", "rgba(248,250,252,0.35)"]];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 5, step: 1, speed: 1});
    L.legend([["#ef4444", "laser beam"], ["#f8fafc", "particles"]]);
    L.watch({laser: "Step 5: a laser beam passes through all three beakers. Look from the side. (Never look into a laser.)", settle: "Step 6: leave the beakers undisturbed. Which mixture settles?", filter: "Step 7: filter each mixture. Which leaves a residue on the filter paper?"}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", f = Math.min(1, t / 4), xs = [150, 360, 570];
    xs.forEach(function(x, i){
      var fill = B[i][1];
      if(st.preset === "settle" && i === 1) fill = "rgba(241,245,249," + (0.55 - 0.45 * f) + ")";
      m += beakerSVG(L, x, 60, fill, B[i][0]);
      if(i === 1){
        for(var p = 0; p < 26; p++){
          var px = x - 35 + (p * 37 % 70), py0 = 80 + (p * 53 % 90), py = st.preset === "settle" ? py0 + (165 - py0) * f : py0;
          if(st.preset !== "filter" || t < 2) m += L.circle(px, py, 2.5, "#f8fafc");
        }
      }
      if(st.preset === "filter"){
        m += '<path d="M' + (x - 35) + ' 20 L' + (x + 35) + ' 20 L' + x + ' 55 z" fill="#f1f5f9" stroke="#94a3b8"/>';
        if(i === 1 && t >= 2) m += '<path d="M' + (x - 18) + ' 30 L' + (x + 18) + ' 30 L' + x + ' 45 z" fill="#cbd5e1"/>';
      }
    });
    if(st.preset === "laser" && t > 0){
      var reach = 40 + 640 * f;
      xs.forEach(function(x, i){
        if(reach > x - 45){
          var x2 = Math.min(x + 45, reach);
          if(i > 0) m += L.line(x - 45, 120, x2, 120, "#ef4444", i === 1 ? 5 : 4) + L.rect(x - 45, 112, x2 - x + 45, 16, "rgba(239,68,68,0.25)");
        }
      });
      m += L.circle(30, 120, 8, "#ef4444");
    }
    L.svg(m, "Three beakers: " + st.preset, 300);
    var done = t >= 4.9, rows = {laser: ["no", "yes", "yes"], settle: ["no", "yes", "no"], filter: ["no", "yes", "no"]}[st.preset];
    var head = {laser: "Beam path visible?", settle: "Settles?", filter: "Residue on filter paper?"}[st.preset];
    L.readout(B.map(function(b, i){ return [b[0] + ": " + head, done ? rows[i] : "…"]; }));
    L.verdict(!done ? "Observing…" : st.preset === "laser" ? "The path of the beam is visible in B and C (their particles scatter light) but not in A." :
      st.preset === "settle" ? "Only B settles: chalk particles are large and undissolved. A and C stay uniform." :
      "A residue is left only in B. Salt (A) is dissolved and milk's particles (C) are small enough to pass through.");
  }
  function mount(){ L.presets([["laser", "Laser beam test"], ["settle", "Leave undisturbed"], ["filter", "Filter each"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.mixtureTests = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Concentration: Examples 5.1–5.3 and saline
(function(){
  var L = LAB, C = L.C;
  var CFG = {
    mm: {name: "Example 5.1", solute: 10, other: 90, soluteUnit: "g", otherLabel: "Mass of water (solvent)", otherUnit: "g", kind: "% m/m", solName: "salt"},
    mv: {name: "Example 5.2", solute: 5, other: 100, soluteUnit: "g", otherLabel: "Volume of solution", otherUnit: "mL", kind: "% m/v", solName: "glucose"},
    vv: {name: "Example 5.3", solute: 1, other: 100, soluteUnit: "mL", otherLabel: "Volume of solution", otherUnit: "mL", kind: "% v/v", solName: "pesticide"},
    saline: {name: "Saline drip", solute: 0.9, other: 100, soluteUnit: "g", otherLabel: "Volume of solution", otherUnit: "mL", kind: "% m/v", solName: "salt"}
  };
  var st = {preset: "mm", solute: 10, other: 90};
  function pct(c){ return c.kind === "% m/m" ? st.solute / (st.solute + st.other) * 100 : st.solute / st.other * 100; }
  function select(id){
    st.preset = id; L.markPreset(id); var c = CFG[id]; st.solute = c.solute; st.other = c.other;
    L.timeline({maxT: 4, step: 1, speed: 1});
    L.legend([["#fbbf24", "solute"], ["#38bdf8", "solvent / solution"]]);
    L.watch(c.name + ": " + c.solute + " " + c.soluteUnit + " of " + c.solName + (c.kind === "% m/m" ? " in " + c.other + " g of water." : ", made up to " + c.other + " mL of solution."));
    L.controls(L.slider("c2-sol", "Solute (" + c.solName + ")", c.kind === "% v/v" ? 0.5 : 0.5, c.kind === "% v/v" ? 20 : 50, 0.5, st.solute, L.num(st.solute, 1) + " " + c.soluteUnit) +
      L.slider("c2-oth", c.otherLabel, 20, 200, 5, st.other, st.other + " " + c.otherUnit));
    L.onInput("c2-sol", function(v){ st.solute = v; L.setVal("c2-sol", L.num(v, 1) + " " + c.soluteUnit); App.seekTimeline(4); });
    L.onInput("c2-oth", function(v){ st.other = v; L.setVal("c2-oth", v + " " + c.otherUnit); App.seekTimeline(4); });
    L.restart(true);
  }
  function draw(t){
    var c = CFG[st.preset], f = Math.min(1, t / 3), m = "";
    m += beakerSVG(L, 220, 70, "rgba(56,189,248," + (0.15 + 0.1 * f) + ")", c.name);
    for(var i = 0; i < Math.round(20 * f); i++) m += L.circle(190 + (i * 13 % 60), 90 + (i * 29 % 90) * (1 - f) + 60 * f * (i % 3) / 2, 3, "#fbbf24");
    var p = pct(c), frac;
    if(c.kind === "% m/m") frac = L.num(st.solute, 1) + " g ÷ (" + L.num(st.solute, 1) + " g + " + st.other + " g) × 100";
    else frac = L.num(st.solute, 1) + " " + c.soluteUnit + " ÷ " + st.other + " mL × 100";
    m += L.text(420, 110, c.kind + " =", {size: 18, color: C.text, anchor: "start"}) + L.text(420, 145, frac, {size: 16, color: C.path, anchor: "start"}) + L.text(420, 190, "= " + L.num(p, 2).replace(/\.?0+$/, "") + " " + c.kind, {size: 26, color: "#34d399", anchor: "start", weight: 700});
    L.svg(m, c.name + " concentration " + L.num(p, 2), 300);
    L.readout([["Solute", L.num(st.solute, 1) + " " + c.soluteUnit, "#fbbf24"], [c.kind === "% m/m" ? "Mass of solution" : "Volume of solution", (c.kind === "% m/m" ? L.num(st.solute + st.other, 1) + " g" : st.other + " mL"), "#38bdf8"], ["Concentration", t >= 3 ? L.num(p, 2).replace(/\.?0+$/, "") + " " + c.kind : "…", "#34d399"]]);
    var isBook = st.solute === c.solute && st.other === c.other;
    L.verdict(t < 3 ? "Making the solution…" :
      !isBook ? "Concentration = <b>" + L.num(p, 2).replace(/\.?0+$/, "") + " " + c.kind + "</b>." :
      st.preset === "mm" ? "<b>Example 5.1:</b> mass of solution = 10 g + 90 g = 100 g, so concentration = <b>10% m/m</b>." :
      st.preset === "mv" ? "<b>Example 5.2:</b> 5 g in 100 mL = <b>5% m/v</b>, like the glucose solution in Fig. 5.4b." :
      st.preset === "vv" ? "<b>Example 5.3:</b> 1 mL in 100 mL = <b>1% v/v</b> pesticide spray." :
      "<b>Saline drip:</b> 0.9 g of salt in 100 mL = <b>0.9% m/v</b>, safe for blood.");
  }
  function mount(){ L.presets([["mm", "Example 5.1: % m/m"], ["mv", "Example 5.2: % m/v"], ["vv", "Example 5.3: % v/v"], ["saline", "0.9% saline"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.concentration = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Solubility curves and crystallization (Fig. 5.6, Table 5.4)
(function(){
  var L = LAB, C = L.C;
  var CB = [[0, 180], [10, 190], [20, 203], [30, 219], [40, 241], [50, 262], [60, 287], [70, 320], [80, 360]];
  var CA = [[0, 28], [10, 33], [20, 37], [30, 41], [40, 45], [50, 51], [60, 55], [70, 61], [80, 64]];
  var T54 = {"potassium nitrate": [[10, 21], [20, 32], [30, 45], [40, 62], [60, 106], [80, 167]], "sodium chloride": [[10, 36], [20, 36], [30, 36.3], [40, 36.5], [60, 37], [80, 37]], "potassium chloride": [[10, 35], [20, 35], [30, 37.4], [40, 40], [60, 46], [80, 54]], "ammonium chloride": [[10, 24], [20, 37], [30, 41], [40, 41], [60, 55], [80, 66]]};
  var COLS = {"potassium nitrate": "#f472b6", "sodium chloride": "#38bdf8", "potassium chloride": "#34d399", "ammonium chloride": "#fbbf24"};
  var st = {preset: "fig56"};
  function select(id){
    st.preset = id; L.markPreset(id);
    if(id === "fig56"){ L.timeline({maxT: 20, step: 5, speed: 5, format: function(t){ return "<b>" + Math.round(60 - t) + " °C</b>"; }}); L.legend([["#38bdf8", "compound B (Fig. 5.6)"], [C.path, "compound A"], ["#f8fafc", "crystals"]]); L.watch("A saturated solution of B (287 g in 100 g water) cools from 60 °C to 40 °C."); }
    else if(id === "kcl"){ L.timeline({maxT: 55, step: 5, speed: 10, format: function(t){ return "<b>" + Math.round(80 - t) + " °C</b>"; }}); L.legend([["#34d399", "potassium chloride (Table 5.4)"], ["#f8fafc", "crystals"]]); L.watch("Exercise Q13 (ii): saturated potassium chloride at 80 °C cools to room temperature, 25 °C."); }
    else { L.timeline({maxT: 70, step: 10, speed: 20, format: function(t){ return "<b>" + Math.round(10 + t) + " °C</b>"; }}); L.legend(Object.keys(COLS).map(function(k){ return [COLS[k], k]; })); L.watch("Exercise Q13 (iii): how does the solubility of each salt in Table 5.4 change from 10 °C to 80 °C?"); }
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "compare"){
      var g = L.graph({x0: 80, y0: 262, w: 560, h: 214, tmax: 80, vmin: 0, vmax: 180, tStep: 10, vStep: 30, tLabel: "°C", vLabel: "g per 100 g water"});
      m += g.svg; var T = 10 + t;
      Object.keys(T54).forEach(function(k){ var pts = T54[k].filter(function(p){ return p[0] <= T + 1e-6; }); if(pts.length) m += L.polyline(g, pts.concat([[T, L.interp(T54[k], T)]]), COLS[k], 3); });
      L.svg(m, "Solubility curves of four salts", 290);
      L.readout(Object.keys(T54).map(function(k){ return [k + " at " + Math.round(T) + " °C", L.num(L.interp(T54[k], T), 1) + " g", COLS[k]]; }));
      msg = t < 70 ? "Heating…" : "<b>Table 5.4:</b> solubility rises with temperature for all four, greatly for potassium nitrate (21 → 167 g), moderately for ammonium chloride (24 → 66 g) and potassium chloride (35 → 54 g), and hardly at all for sodium chloride (36 → 37 g).";
    } else {
      var kcl = st.preset === "kcl", curve = kcl ? T54["potassium chloride"] : CB, Tstart = kcl ? 80 : 60, T2 = Tstart - t;
      var g2 = L.graph({x0: 80, y0: 262, w: 400, h: 214, tmax: 80, vmin: 0, vmax: kcl ? 60 : 400, tStep: 10, vStep: kcl ? 10 : 50, tLabel: "°C", vLabel: "g per 100 g water"});
      m += g2.svg + L.polyline(g2, curve, kcl ? "#34d399" : "#38bdf8", 3);
      if(!kcl) m += L.polyline(g2, CA, C.path, 3);
      var s0 = L.interp(curve, Tstart), s = L.interp(curve, Math.max(kcl ? 10 : 0, T2)), crystals = s0 - s;
      m += L.circle(g2.X(T2), g2.Y(s), 7, "#f8fafc") + L.line(g2.X(T2), g2.Y(s), g2.X(T2), g2.Y(s0), "#f8fafc", 1.5, "4 4");
      m += beakerSVG(L, 600, 70, "rgba(56,189,248,0.2)", Math.round(T2) + " °C");
      for(var i = 0; i < Math.min(40, Math.round(crystals * (kcl ? 2 : 0.8))); i++) m += '<rect x="' + (565 + (i * 17 % 70)) + '" y="' + (178 - (i % 4) * 7) + '" width="7" height="7" fill="#e0f2fe" transform="rotate(45 ' + (568 + (i * 17 % 70)) + ' ' + (181 - (i % 4) * 7) + ')"/>';
      L.svg(m, "Cooling saturated solution", 290);
      L.readout([["Temperature", Math.round(T2) + " °C"], ["Solubility now", L.num(s, 1) + " g per 100 g water", kcl ? "#34d399" : "#38bdf8"], ["Crystals formed so far", L.num(crystals, 1) + " g per 100 g water", "#f8fafc"]]);
      msg = kcl ? (t < 55 ? "Cooling…" : "<b>Exercise Q13 (ii):</b> solubility falls from 54 g to about 36 g, so about <b>18 g</b> of potassium chloride crystallises from every 100 g of water as it cools.")
        : (t < 20 ? "Cooling…" : "<b>Crystallization:</b> at 40 °C only 241 g can stay dissolved, so 287 − 241 = <b>46 g</b> of B separates out as crystals.");
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["fig56", "Fig. 5.6: cool B from 60 °C"], ["kcl", "Q13: cool KCl from 80 °C"], ["compare", "Q13: compare four salts"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.solubility = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Distillation and paper chromatography
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "acetone"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 10, step: 1, speed: 1, format: id === "ink" ? null : function(t){ return "t = <b>" + L.num(t, 1) + " min</b>"; }});
    L.legend(id === "ink" ? [["#38bdf8", "water rising"], ["#1f2937", "ink spot"]] : [["#ef4444", "thermometer reading"], ["#38bdf8", "liquid collected"]]);
    L.watch({acetone: "Acetone (56 °C) and water (100 °C) are heated in a distillation set-up (schematic timing).", close: "Alcohol (78 °C) and benzene (80 °C): can simple distillation separate them?", ink: "Activity 5.5: a black sketch-pen spot on paper, lower end dipped in water (the dye colours are illustrative)."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "ink"){
      var rise = Math.min(1, t / 8);
      m += L.rect(300, 30, 120, 250, "#f8fafc", ' rx="4"') + L.rect(300, 250, 120, 30, "rgba(56,189,248,0.4)");
      m += L.rect(300, 250 - 200 * rise, 120, 200 * rise, "rgba(56,189,248,0.15)");
      m += L.line(300, 220, 420, 220, "#94a3b8", 1, "4 4");
      [["#2563eb", 0.95], ["#dc2626", 0.65], ["#eab308", 0.35]].forEach(function(d){
        var y = 220 - 180 * rise * d[1];
        m += '<ellipse cx="360" cy="' + y + '" rx="' + (10 + 8 * rise) + '" ry="7" fill="' + d[0] + '" fill-opacity="' + (t > 0 ? 0.8 : 0) + '"/>';
      });
      if(t <= 0) m += L.circle(360, 220, 9, "#1f2937");
      m += L.text(480, 60, "solvent front", {size: 13, color: C.muted, anchor: "start"}) + L.text(480, 225, "pencil line with ink spot", {size: 13, color: C.muted, anchor: "start"});
      L.svg(m, "Chromatography strip", 300);
      L.readout([["Water has risen", L.num(rise * 100, 0) + " % of the strip", "#38bdf8"], ["Colour spots", t > 2 ? "3 separate spots" : "one black spot"]]);
      msg = t < 8 ? "Water rising…" : "<b>Paper chromatography:</b> the black ink was a mixture of dyes. Each moves up the paper at a different speed, so they separate into spots.";
    } else {
      var close = st.preset === "close";
      var b1 = close ? 78 : 56, b2 = close ? 80 : 100, T;
      if(t < 2) T = 25 + (b1 - 25) * t / 2; else if(t < 6) T = b1 + (close ? 1 : 0) * (t - 2) / 4; else if(t < 7) T = b1 + (b2 - b1) * (t - 6); else T = b2;
      var collected = t < 2 ? 0 : Math.min(1, (t - 2) / 4);
      m += '<circle cx="140" cy="190" r="50" fill="rgba(56,189,248,0.25)" stroke="#94a3b8" stroke-width="3"/>' + L.rect(132, 80, 16, 70, "none", ' stroke="#94a3b8" stroke-width="3"');
      m += L.line(140, 40, 140, 150, "#ef4444", 3) + L.text(140, 30, Math.round(T) + " °C", {size: 16, color: "#ef4444", weight: 700});
      m += L.line(150, 110, 470, 190, "#94a3b8", 6) + L.line(210, 118, 440, 176, "rgba(56,189,248,0.4)", 18) + L.text(320, 128, "condenser", {size: 12, color: C.muted});
      m += '<path d="M455 200 L505 200 L525 270 L435 270 z" fill="none" stroke="#94a3b8" stroke-width="3"/>' + L.rect(440, 270 - 50 * collected, 80, 50 * collected, close ? "rgba(167,139,250,0.5)" : "rgba(56,189,248,0.5)");
      m += '<path d="M130 245 q-6 -14 10 -24 q6 12 -10 24" fill="#f97316"/>';
      L.svg(m, "Distillation at " + Math.round(T) + " degrees", 300);
      L.readout([["Thermometer", Math.round(T) + " °C", "#ef4444"], ["Boiling points", b1 + " °C and " + b2 + " °C (difference " + (b2 - b1) + " °C)"], ["Collected", L.num(collected * 100, 0) + " %"]]);
      msg = t < 10 ? "Heating…" : close ? "<b>Too close to separate:</b> 78 °C and 80 °C differ by only 2 °C, so both liquids vaporise together. Simple distillation needs about 25 °C; fractional distillation is used for close boiling points." :
        "<b>Distillation:</b> the temperature holds near 56 °C while acetone distils first and collects in the flask; water (100 °C) stays behind until the acetone is gone.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["acetone", "Acetone and water"], ["close", "Alcohol and benzene"], ["ink", "Activity 5.5: black ink"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.distillation = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Separating funnel and sublimation (Activities 5.6–5.7)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "funnel"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 10, step: 1, speed: 1});
    L.legend(id === "funnel" ? [["#eab308", "mustard oil (less dense)"], ["#38bdf8", "water"]] : [["#f8fafc", "camphor"], ["#a16207", "sand"]]);
    L.watch(id === "funnel" ? "Activity 5.6: 5 mL mustard oil + 20 mL water stand in a separating funnel; then the stopcock is opened." : "Activity 5.7: camphor and sand heated gently under an inverted funnel.");
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "funnel"){
      var settle = Math.min(1, t / 3), drain = Math.max(0, Math.min(1, (t - 4) / 5));
      m += '<path d="M300 40 L420 40 L420 150 L375 230 L365 230 L300 150 z" fill="none" stroke="#cbd5e1" stroke-width="3"/>' + L.rect(364, 230, 12, 30, "none", ' stroke="#cbd5e1" stroke-width="3"');
      var waterH = 90 * (1 - drain), oilTop = 150 - waterH - 30;
      if(settle < 1){ m += L.rect(302, 60, 116, 110, "rgba(234,179,8," + (0.25 * (1 - settle)) + ")") + L.rect(302, 60, 116, 110, "rgba(56,189,248," + (0.25 * (1 - settle)) + ")"); }
      m += L.rect(302, 150 - waterH, 116, waterH, "rgba(56,189,248," + (0.5 * settle) + ")") + L.rect(302, oilTop, 116, 30, "rgba(234,179,8," + (0.7 * settle) + ")");
      m += '<path d="M430 290 L470 230 L510 290 z" fill="none" stroke="#cbd5e1" stroke-width="3"/>' + L.rect(440, 290 - 40 * drain, 60, 40 * drain, "rgba(56,189,248,0.5)");
      m += L.text(250, 90, "oil", {size: 14, color: "#eab308", anchor: "end"}) + L.text(250, 130, "water", {size: 14, color: "#38bdf8", anchor: "end"});
      L.svg(m, "Separating funnel", 300);
      L.readout([["Layers", settle >= 1 ? "oil on top, water below" : "forming…"], ["Stopcock", t < 4 ? "closed" : drain < 1 ? "open: draining water" : "closed", C.path], ["Water collected", L.num(20 * drain, 1) + " mL", "#38bdf8"]]);
      msg = t < 10 ? "Separating…" : "<b>Separating funnel:</b> the less dense mustard oil forms the upper layer, so the <b>water is drained first</b>; the small mixed portion is discarded and then the oil is collected.";
    } else {
      var heat = Math.min(1, t / 8);
      m += '<path d="M250 200 q110 70 220 0 z" fill="#e5e7eb" stroke="#94a3b8" stroke-width="2"/>';
      for(var i = 0; i < 40; i++) m += L.circle(300 + (i * 23 % 120), 212 + (i % 3) * 5, 3, "#a16207");
      for(var j = 0; j < Math.round(30 * (1 - heat)); j++) m += L.circle(305 + (j * 31 % 110), 205 + (j % 2) * 6, 4, "#f8fafc");
      m += '<path d="M265 196 L360 60 L455 196" fill="none" stroke="#cbd5e1" stroke-width="3"/>' + L.rect(352, 30, 16, 30, "#f1f5f9");
      for(var k = 0; k < Math.round(30 * heat); k++){ var yy = 90 + (k * 37 % 100), xx = 360 + (yy - 60) * 0.7 * (k % 2 ? 1 : -1); m += L.circle(xx, yy, 3, "#f8fafc"); }
      for(var v = 0; v < 8 && t > 0 && heat < 1; v++) m += L.circle(330 + v * 8, 190 - ((t * 40 + v * 17) % 90), 2, "rgba(248,250,252,0.5)");
      m += '<path d="M360 270 q-8 -16 0 -26 q8 10 0 26" fill="#f97316"/>';
      L.svg(m, "Sublimation of camphor", 300);
      L.readout([["Camphor left in dish", L.num((1 - heat) * 100, 0) + " %"], ["Camphor on funnel wall", L.num(heat * 100, 0) + " %", "#f8fafc"], ["Sand", "stays in the dish", "#a16207"]]);
      msg = t < 10 ? "Heating gently…" : "<b>Sublimation:</b> camphor turns straight into vapour, then the vapour cools and camphor deposits as a white solid on the funnel wall; sand does not sublime and stays in the dish.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["funnel", "Activity 5.6: oil and water"], ["sublime", "Activity 5.7: camphor and sand"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.funnelSublime = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Clearing a suspension: settle, centrifuge, coagulate
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "settle"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 10, step: 1, speed: 1});
    L.legend(id === "centrifuge" ? [["#dc2626", "red blood cells"], ["#fde68a", "plasma"]] : [["#a16207", "mud particles"], ["#38bdf8", "water"]]);
    L.watch({settle: "Muddy water left undisturbed. Watch the big and the very fine particles (schematic).", centrifuge: "A blood sample spun in a centrifuge (Fig. 5.22).", alum: "Powdered alum added to muddy water (Fig. 5.21)."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, f = Math.min(1, t / 9);
    if(st.preset === "centrifuge"){
      var ang = t * 40;
      m += L.circle(200, 150, 90, "none", ' stroke="#475569" stroke-width="3"') + '<g transform="rotate(' + ang + ' 200 150)">' + L.rect(270, 138, 50, 24, "#fca5a5", ' rx="10"') + L.rect(80, 138, 50, 24, "#fca5a5", ' rx="10"') + '</g>';
      m += L.rect(500, 40, 50, 220, "none", ' stroke="#cbd5e1" stroke-width="3" rx="20"');
      var red = 0.45;
      m += L.rect(503, 257 - 214 * red, 44, 214 * red * f + 214 * red * (1 - f), "#dc2626", ' rx="18" fill-opacity="' + (0.4 + 0.6 * f) + '"');
      m += L.rect(503, 43, 44, 214 * (1 - red), f > 0.3 ? "rgba(253,230,138," + (0.3 + 0.6 * f) + ")" : "rgba(220,38,38,0.4)", ' rx="18"');
      if(f > 0.9) m += L.text(570, 100, "plasma", {size: 14, color: "#fde68a", anchor: "start"}) + L.text(570, 220, "red blood cells", {size: 14, color: "#f87171", anchor: "start"});
      L.svg(m, "Centrifuge", 300);
      L.readout([["Spinning", L.num(f * 100, 0) + " % done"], ["Top of tube", f > 0.9 ? "plasma" : "mixed"], ["Bottom of tube", f > 0.9 ? "red blood cells" : "mixed", "#dc2626"]]);
      msg = t < 10 ? "Spinning…" : "<b>Centrifugation:</b> heavier red blood cells are pushed to the bottom of the tube; the lighter plasma stays on top.";
    } else {
      var alum = st.preset === "alum";
      m += beakerSVG(L, 360, 60, "rgba(56,189,248,0.15)", alum ? "muddy water + alum" : "muddy water");
      var cloud = alum ? 0.45 * (1 - f) : 0.45 - 0.2 * f;
      m += L.rect(317, 62, 86, 110, "rgba(161,98,7," + cloud + ")");
      for(var i = 0; i < 30; i++){
        var big = i < 10, x = 325 + (i * 29 % 70), y0 = 75 + (i * 41 % 90);
        var y = big || alum ? y0 + (170 - y0) * f : y0;
        m += L.circle(x, Math.min(172, y), alum ? 2 + 3 * f : big ? 4 : 1.5, "#a16207");
      }
      L.svg(m, "Beaker of muddy water", 300);
      L.readout([["Cloudiness (schematic)", L.num(cloud / 0.45 * 100, 0) + " %"], ["Fine particles", alum ? (f > 0.5 ? "clumped and settled" : "clumping") : "still suspended"]]);
      msg = t < 10 ? "Waiting…" : alum ? "<b>Coagulation:</b> alum makes the fine particles clump; the clumps settle and the water above becomes clear enough to decant or filter." : "<b>Sedimentation alone:</b> the heavier mud settles, but the water is <b>still cloudy</b> because the finest particles stay suspended.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["settle", "Leave it to settle"], ["centrifuge", "Centrifuge a blood sample"], ["alum", "Add alum (coagulation)"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.suspension = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Particle size and the Tyndall effect
(function(){
  var L = LAB, C = L.C;
  var Q2 = [["(a) air and dust particles", true], ["(b) copper sulfate and water", false], ["(c) starch and water", true], ["(d) acetone and water", false]];
  var st = {preset: "size"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "size" ? 10 : 4, step: 1, speed: id === "size" ? 1 : 0.7});
    L.legend([["#ef4444", "light beam"], ["#f8fafc", "particles"]]);
    L.watch(id === "size" ? "Particle size grows from 0.1 nm to 100,000 nm (log scale). Watch the beam and whether particles settle." : "Exercise Q2: which of these four mixtures show the Tyndall effect?");
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "size"){
      var logd = -1 + t / 10 * 6, d = Math.pow(10, logd), kind = d < 1 ? "solution" : d <= 1000 ? "colloid" : "suspension";
      m += beakerSVG(L, 250, 60, "rgba(56,189,248,0.15)", kind);
      var scatter = kind !== "solution", settles = kind === "suspension";
      m += L.circle(40, 120, 8, "#ef4444") + L.line(48, 120, 205, 120, "#ef4444", 3) + (scatter ? L.rect(205, 112, 90, 16, "rgba(239,68,68,0.35)") + L.line(205, 120, 295, 120, "#ef4444", 4) : "") + L.line(295, 120, 360, 120, "#ef4444", 3);
      var r = Math.max(0.6, Math.min(6, 1 + logd));
      for(var i = 0; i < 25; i++) m += L.circle(215 + (i * 31 % 70), settles ? 168 - (i % 3) * 5 : 75 + (i * 43 % 95), r, "#f8fafc");
      var X = function(l){ return 420 + (l + 1) / 6 * 260; };
      m += L.line(420, 250, 680, 250, C.muted, 2);
      [[-1, "0.1"], [0, "1 nm"], [3, "1000 nm"], [5, "10⁵"]].forEach(function(p){ m += L.line(X(p[0]), 244, X(p[0]), 256, C.muted, 2) + L.text(X(p[0]), 274, p[1], {size: 11, color: C.muted}); });
      m += L.rect(X(0), 230, X(3) - X(0), 12, "rgba(167,139,250,0.4)") + L.text((X(0) + X(3)) / 2, 222, "colloid 1–1000 nm", {size: 11, color: "#a78bfa"});
      m += L.circle(X(logd), 250, 7, C.path);
      L.svg(m, "Particle size " + L.num(d, 1) + " nm: " + kind, 300);
      L.readout([["Particle size", (d < 1 ? L.num(d, 2) : L.num(d, 0)) + " nm", C.path], ["Type of mixture", kind], ["Beam path visible?", scatter ? "yes (Tyndall effect)" : "no", "#ef4444"], ["Settles?", settles ? "yes" : "no"]]);
      msg = t < 10 ? "Particles growing…" : "<b>Particle size decides:</b> below 1 nm a solution shows no beam; from 1–1000 nm a colloid scatters light but does not settle; above 1000 nm a suspension scatters light and settles.";
    } else {
      var k = Math.min(3, Math.floor(t + 1e-9)), yes = Q2[k][1];
      m += beakerSVG(L, 300, 60, "rgba(56,189,248,0.15)", Q2[k][0]);
      m += L.circle(80, 120, 8, "#ef4444") + L.line(88, 120, 520, 120, "#ef4444", yes ? 5 : 2) + (yes ? L.rect(255, 110, 90, 20, "rgba(239,68,68,0.35)") : "");
      L.svg(m, Q2[k][0], 300);
      L.readout(Q2.map(function(q, i){ return [q[0], i <= k && t > 0 ? (q[1] ? "Tyndall effect: yes" : "no (true solution)") : "…", q[1] && i <= k ? "#ef4444" : null]; }));
      msg = t < 4 ? "Testing…" : "<b>Exercise Q2:</b> the answer is <b>(iii) a and c</b>. Dust in air and starch in water scatter light; copper sulfate solution and acetone–water are true solutions.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["size", "Grow the particles"], ["q2", "Exercise Q2 mixtures"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.tyndall = {mount: mount, draw: draw, select: select, state: st};
})();
