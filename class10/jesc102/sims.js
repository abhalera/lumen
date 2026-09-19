// Class 10 Science, Chapter 2 (jesc102) — simulation labs.
// Textbook numbers (Fig. 2.7, chlor-alkali, POP at 373 K) unless labelled typical.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function phColor(pH){
  // Rough school-model of Fig. 2.7 universal paper (colours are only a rough guide).
  var stops = [
    [0, "#ef4444"], [2, "#f97316"], [4, "#facc15"], [6, "#a3e635"],
    [7, "#22c55e"], [8, "#14b8a6"], [10, "#0ea5e9"], [12, "#2563eb"], [14, "#1e3a8a"]
  ];
  var i = 0;
  while(i < stops.length - 1 && pH > stops[i + 1][0]) i++;
  return stops[Math.min(i, stops.length - 1)][1];
}
function natureOf(pH){
  if(pH < 7) return "acidic";
  if(pH > 7) return "basic / alkaline";
  return "neutral";
}

// -------------------------------------------------------------------------
// Lab 1 — Indicators (Activity 2.1, three-tube question)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "hcl"};
  var RX = {
    hcl: {name:"HCl (acid)", kind:"acid", red:"stays red", blue:"turns red", phph:"colourless", mo:"red"},
    naoh: {name:"NaOH (base)", kind:"base", red:"turns blue", blue:"stays blue", phph:"pink", mo:"yellow"},
    water: {name:"distilled water", kind:"neutral", red:"stays red", blue:"stays blue", phph:"colourless", mo:"orange"},
    turmeric: {name:"curry stain + soap", kind:"base on turmeric", red:"—", blue:"—", phph:"—", mo:"—"}
  };

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 3, step: 0.25, speed: 0.6});
    L.watch(id === "turmeric"
      ? "A curry (turmeric) stain on a white cloth becomes reddish-brown when soap (basic) is scrubbed on it, and yellow again after washing with plenty of water."
      : "Activity 2.1. Drop the indicator on the sample. Red litmus, blue litmus, phenolphthalein, methyl orange.");
    L.legend([["#ef4444","acid colour"],["#38bdf8","base colour"],["#e2e8f0","no change / colourless"]]);
    L.controls("");
    L.restart(true);
  }

  function swatch(x, y, fill, label){
    return L.rect(x, y, 70, 36, fill, ' rx="6" stroke="#334155" stroke-width="2"') +
      L.text(x + 35, y + 54, label, {size: 12, color: C.muted});
  }

  function draw(){
    var r = RX[st.preset], m = L.text(360, 28, r.name, {size: 18, weight: 700});
    if(st.preset === "turmeric"){
      m += L.rect(160, 80, 160, 90, "#eab308", ' rx="10"') + L.text(240, 190, "turmeric (yellow)", {size: 13});
      m += L.arrow(340, 125, 400, 125, C.text, 3);
      m += L.rect(420, 80, 160, 90, "#b45309", ' rx="10"') + L.text(500, 190, "after soap (reddish-brown)", {size: 13});
      L.readout([["Indicator", "turmeric (natural)"], ["With soap (base)", "reddish-brown"], ["After washing", "yellow again"]]);
      L.verdict("<b>Turmeric</b> is a natural indicator. Soap is basic, so the curry stain goes <b>reddish-brown</b>, then yellow again in plenty of water.");
    } else {
      var redC = r.kind === "base" ? "#3b82f6" : "#ef4444";
      var blueC = r.kind === "acid" ? "#ef4444" : "#3b82f6";
      var phC = r.kind === "base" ? "#f9a8d4" : "#f8fafc";
      var moC = r.kind === "acid" ? "#ef4444" : (r.kind === "base" ? "#facc15" : "#fb923c");
      m += swatch(80, 80, redC, "red litmus") + swatch(240, 80, blueC, "blue litmus") +
        swatch(400, 80, phC, "phenolphthalein") + swatch(560, 80, moC, "methyl orange");
      m += L.text(360, 200, "Litmus is from lichen. Methyl orange and phenolphthalein are synthetic.", {size: 13, color: C.muted});
      L.readout([["Red litmus", r.red], ["Blue litmus", r.blue], ["Phenolphthalein", r.phph], ["Methyl orange", r.mo]]);
      L.verdict(st.preset === "water"
        ? "<b>Distilled water</b> is neither acidic nor basic. Red litmus stays red; blue litmus stays blue. With only red litmus: the tube that turns it blue is the base; then that blue paper identifies the acid (turns red) and water (no change)."
        : "<b>" + r.name + "</b>: red litmus " + r.red + "; blue litmus " + r.blue + "; phenolphthalein " + r.phph + "; methyl orange " + r.mo + ".");
    }
    L.svg(m, r.name, 300);
  }

  function mount(){
    L.presets([["hcl","HCl (acid)"],["naoh","NaOH (base)"],["water","distilled water"],["turmeric","turmeric + soap"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.indicators = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Metals, carbonates, lime water (Activities 2.3–2.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "znacid"};

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 5, step: 0.2, speed: 0.8});
    var w = {
      znacid: "Activity 2.3. Zinc in dilute H₂SO₄. Pass the gas through soap solution and bring a burning candle to a bubble.",
      znbase: "Activity 2.4. Zinc in NaOH, warmed. Hydrogen again, but not with every metal. 2NaOH + Zn → Na₂ZnO₂ + H₂.",
      carbonate: "Activity 2.5. Na₂CO₃ or NaHCO₃ + dilute HCl. Pass the gas through lime water."
    };
    L.watch(w[id]);
    L.legend([["#7dd3fc","H₂"],["#e2e8f0","CO₂"],["#f8fafc","milky CaCO₃"]]);
    L.controls(""); L.restart(true);
  }

  function draw(t){
    var p = Math.min(1, t / 5), m = "";
    if(st.preset === "znacid" || st.preset === "znbase"){
      m += L.rect(250, 70, 120, 160, "#1e293b", ' rx="16" stroke="#64748b" stroke-width="3"');
      m += L.rect(265, 140, 90, 70, "rgba(56,189,248,0.25)");
      m += L.rect(290, 195, 40, 14, "#94a3b8");
      for(var i = 0; i < 7; i++) m += L.circle(275 + (i % 4) * 22, 180 - p * 50 - (i % 3) * 10, 5, "#7dd3fc");
      if(p > 0.5) m += L.circle(480, 90, 28, "rgba(253,224,71,0.5)") + L.text(480, 140, "pop / burns with a pop", {size: 14, color: "#fbbf24"});
      var eq = st.preset === "znacid" ? "Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g)" : "2NaOH(aq) + Zn(s) → Na₂ZnO₂(s) + H₂(g)";
      m += L.text(360, 270, eq, {size: 14, weight: 700});
      L.readout([["Gas", "hydrogen, H₂"], ["Test", "burns with a pop"], ["General", "Acid + Metal → Salt + Hydrogen"]]);
      L.verdict(st.preset === "znacid"
        ? "<b>Activity 2.3:</b> the metal displaces hydrogen. The gas <b>burns with a pop</b>. Same with HCl, HNO₃, CH₃COOH. Zn + H₂SO₄ → ZnSO₄ + H₂."
        : "<b>Activity 2.4:</b> a base can also free H₂ with some metals. 2NaOH + Zn → Na₂ZnO₂ (sodium zincate) + H₂. Not possible with all metals.");
    } else {
      m += L.rect(120, 90, 90, 110, "#e0f2fe", ' rx="8"') + L.text(165, 220, "Na₂CO₃ + HCl", {size: 12, color: C.muted});
      m += L.arrow(220, 145, 280, 145, C.ok, 3);
      m += L.rect(300, 90, 90, 110, "rgba(226,232,240,0.9)", ' rx="8"');
      if(p > 0.3) m += L.rect(310, 130, 70, 60, "rgba(248,250,252,0.95)", ' rx="6"') + L.text(345, 160, "milky", {size: 14, weight: 700});
      m += L.text(345, 220, "lime water", {size: 12, color: C.muted});
      m += L.text(360, 50, "Ca(OH)₂(aq) + CO₂(g) → CaCO₃(s) + H₂O(l)", {size: 15, weight: 700});
      m += L.text(360, 270, "excess CO₂: CaCO₃ + H₂O + CO₂ → Ca(HCO₃)₂ (soluble)", {size: 13, color: C.muted});
      L.readout([["Gas", "carbon dioxide, CO₂"], ["Lime water", "turns milky (white CaCO₃)"], ["General", "carbonate / hydrogencarbonate + acid → salt + CO₂ + H₂O"]]);
      L.verdict("<b>Activity 2.5:</b> Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂ (and NaHCO₃ + HCl → NaCl + H₂O + CO₂). The gas turns lime water <b>milky</b>. Excess CO₂ then dissolves the ppt as Ca(HCO₃)₂.");
    }
    L.svg(m, "gas lab", 300);
  }

  function mount(){
    L.presets([["znacid","Activity 2.3: Zn + acid"],["znbase","Activity 2.4: Zn + NaOH"],["carbonate","Activity 2.5: lime water"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.metals = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Neutralisation and oxides (Activities 2.6–2.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "phph"};

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 6, step: 0.25, speed: 0.8});
    L.watch(id === "phph"
      ? "Activity 2.6. Phenolphthalein in dilute NaOH is pink. Add HCl dropwise until it goes colourless; a few drops of NaOH bring the pink back."
      : "Activity 2.7. Copper(II) oxide in dilute HCl becomes a blue-green solution of CuCl₂. Metal oxides are basic oxides.");
    L.legend([["#f9a8d4","phenolphthalein pink"],["#67e8f9","CuCl₂ blue-green"]]);
    L.controls(""); L.restart(true);
  }

  function draw(t){
    var p = Math.min(1, t / 6), m = "";
    if(st.preset === "phph"){
      var pink = p < 0.45 || p > 0.8;
      m += L.rect(260, 70, 200, 140, pink ? "#f9a8d4" : "#f8fafc", ' rx="16" stroke="#64748b" stroke-width="3"');
      m += L.text(360, 140, pink ? "pink (alkaline)" : "colourless (acid added)", {size: 16, weight: 700, color: pink ? "#9d174d" : C.text});
      m += L.text(360, 240, "NaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l)", {size: 16, weight: 700});
      L.readout([["Indicator", pink ? "pink" : "colourless"], ["Type", "neutralisation"], ["General", "Base + Acid → Salt + Water"]]);
      L.verdict("<b>Activity 2.6:</b> the effect of a base is nullified by an acid and vice-versa. NaOH + HCl → NaCl + H₂O. That is a <b>neutralisation</b> reaction.");
    } else {
      m += L.circle(200, 140, 36, "#1e293b") + L.text(200, 190, "CuO(s)", {size: 14});
      m += L.arrow(250, 140, 330, 140, C.text, 4);
      m += L.rect(360, 80, 200, 120, "rgba(34,211,238,0.45)", ' rx="12"') + L.text(460, 145, "blue-green CuCl₂(aq)", {size: 14, weight: 700});
      m += L.text(360, 250, "CuO(s) + 2HCl(aq) → CuCl₂(aq) + H₂O(l)", {size: 15, weight: 700});
      L.readout([["Colour", "blue-green copper(II) chloride"], ["Type", "metal oxide + acid → salt + water"], ["Conclusion", "metallic oxides are basic oxides"]]);
      L.verdict("<b>Activity 2.7:</b> CuO dissolves to a <b>blue-green</b> solution of copper(II) chloride. Metal oxide + acid → salt + water, so metallic oxides are <b>basic oxides</b>. CO₂ + Ca(OH)₂ is the matching fact that non-metallic oxides are acidic.");
    }
    L.svg(m, "neutralisation lab", 300);
  }

  function mount(){
    L.presets([["phph","Activity 2.6: phenolphthalein"],["cuo","Activity 2.7: CuO + HCl"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.neutralise = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — What acids and bases have in common (Activities 2.8–2.10)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "hcl"};

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 4, step: 0.2, speed: 0.7});
    var w = {
      hcl: "Activity 2.8. Dilute HCl (or H₂SO₄) in the beaker: the bulb glows. Ions carry the current.",
      glucose: "Same apparatus, glucose or alcohol solution: the bulb does not glow. They contain hydrogen but are not acids.",
      dryhcl: "Activity 2.9. Dry HCl gas does not change dry blue litmus. Wet litmus turns red. HCl + H₂O → H₃O⁺ + Cl⁻.",
      dilute: "Activity 2.10. Always add concentrated acid slowly to water, with stirring. Mixing is highly exothermic."
    };
    L.watch(w[id]);
    L.legend([["#fbbf24","bulb on"],["#475569","bulb off"],["#ef4444","H₃O⁺"]]);
    L.controls(""); L.restart(true);
  }

  function draw(t){
    var p = Math.min(1, t / 4), m = "";
    if(st.preset === "hcl" || st.preset === "glucose"){
      var on = st.preset === "hcl";
      m += L.rect(220, 100, 280, 120, "#0f172a", ' rx="16" stroke="#334155" stroke-width="3"');
      m += L.rect(240, 150, 240, 50, "rgba(56,189,248,0.25)");
      m += L.rect(300, 155, 10, 40, "#94a3b8") + L.rect(410, 155, 10, 40, "#94a3b8");
      m += L.circle(360, 70, 22, on ? "#fde047" : "#334155");
      m += L.text(360, 250, on ? "bulb glows — ions present" : "bulb stays off — no ions", {size: 16, weight: 700, color: on ? "#fbbf24" : C.muted});
      L.readout([["Solution", st.preset === "hcl" ? "dilute HCl / H₂SO₄" : "glucose or alcohol"], ["Bulb", on ? "glows" : "does not glow"], ["Why", on ? "H⁺(aq) and anions carry current" : "no H⁺(aq) ions, even though the molecules contain H"]]);
      L.verdict(on
        ? "<b>Activity 2.8:</b> acid solutions conduct because they produce <b>H⁺(aq)</b> (shown as H₃O⁺). That is what all acids have in common."
        : "<b>Activity 2.8:</b> glucose and alcohol contain hydrogen but the bulb does <b>not</b> glow. They are not acids: they do not give H⁺(aq) in water.");
    } else if(st.preset === "dryhcl"){
      m += L.rect(140, 80, 160, 50, "#cbd5e1", ' rx="6"') + L.text(220, 110, "dry blue litmus: no change", {size: 13});
      m += L.rect(420, 80, 160, 50, "#ef4444", ' rx="6"') + L.text(500, 110, "wet blue litmus: red", {size: 13});
      m += L.text(360, 180, "HCl + H₂O → H₃O⁺ + Cl⁻", {size: 20, weight: 700});
      m += L.text(360, 220, "H⁺ cannot exist alone; it is H⁺(aq) or hydronium H₃O⁺.", {size: 14, color: C.muted});
      L.readout([["Dry HCl gas", "not acidic on dry litmus"], ["HCl(aq)", "acidic — H₃O⁺ present"], ["Eq.", "HCl + H₂O → H₃O⁺ + Cl⁻"]]);
      L.verdict("<b>Activity 2.9:</b> dry HCl gas does <b>not</b> change dry litmus. Hydrogen ions are produced only in the presence of water.");
    } else {
      m += L.rect(200, 70, 80, 140, "#fecaca", ' rx="8"') + L.text(240, 230, "concentrated acid", {size: 12});
      m += L.arrow(300, 140, 380, 140, C.danger, 4);
      m += L.rect(400, 90, 160, 100, "#e0f2fe", ' rx="10"') + L.text(480, 145, "water (already in the beaker)", {size: 12});
      m += L.text(360, 260, "exothermic — acid into water, never water into acid", {size: 15, weight: 700, color: "#fbbf24"});
      L.readout([["Process", "dilution"], ["Heat", "highly exothermic"], ["Rule", "acid slowly into water, with stirring"], ["Ions", "H₃O⁺ / OH⁻ concentration per unit volume decreases"]]);
      L.verdict("<b>Activity 2.10:</b> dissolving an acid or a base in water is <b>highly exothermic</b>. Always add the acid slowly to water. Dilution decreases the concentration of H₃O⁺/OH⁻ per unit volume.");
    }
    L.svg(m, "ions in water", 300);
  }

  function mount(){
    L.presets([["hcl","Activity 2.8: HCl bulb on"],["glucose","Activity 2.8: glucose off"],["dryhcl","Activity 2.9: dry HCl"],["dilute","Activity 2.10: acid into water"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.ions = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — pH scale (Fig. 2.7, Activities 2.11–2.13)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "gastric", pH: 1.2};
  var RX = {
    gastric: {pH: 1.2, name: "gastric juice (about 1.2)"},
    lemon: {pH: 2.2, name: "lemon juice (about 2.2)"},
    blood: {pH: 7.4, name: "pure water, blood (7.4)"},
    milkmag: {pH: 10, name: "milk of magnesia (10)"},
    naoh: {pH: 14, name: "sodium hydroxide (about 14)"}
  };

  function select(id){
    st.preset = id;
    st.pH = RX[id].pH;
    L.markPreset(id);
    L.timeline({maxT: 2, step: 0.5, speed: 0.4});
    L.watch("Fig. 2.7 (colours are only a rough guide). Universal indicator paper. Higher [H₃O⁺] means lower pH.");
    L.legend([["#ef4444","acidic"],["#22c55e","neutral"],["#1d4ed8","alkaline"]]);
    render();
  }
  function render(){
    L.controls(L.slider("ph-s", "pH (school scale 0–14)", 0, 14, 0.1, st.pH, L.num(st.pH, 1)));
    L.onInput("ph-s", function(v){ st.pH = v; st.preset = "gastric"; L.markPreset(""); L.setVal("ph-s", L.num(v, 1)); App.resetTimeline(); });
    L.restart(false);
  }

  function draw(){
    var pH = st.pH, m = "", x0 = 40, y = 80, w = 640;
    for(var i = 0; i <= 14; i++){
      var x = x0 + i * (w / 14);
      m += L.rect(x - w / 28, y, w / 14, 36, phColor(i));
      m += L.text(x, y + 56, String(i), {size: 12, color: C.muted});
    }
    var mx = x0 + (pH / 14) * w;
    m += L.line(mx, 70, mx, 130, "#f8fafc", 3);
    m += L.text(360, 170, (RX[st.preset] ? RX[st.preset].name : "your pH") + "  ·  " + natureOf(pH), {size: 16, weight: 700});
    m += L.text(360, 210, "neutral = 7.  pH < 7 acidic.  pH > 7 basic.  Body 7.0–7.8.  Acid rain < 5.6.  Tooth enamel < 5.5.", {size: 13, color: C.muted});
    m += L.text(360, 250, "pH 5.5 is where tooth enamel (calcium hydroxyapatite) starts to corrode.", {size: 13, color: C.muted});
    L.svg(m, "pH scale", 300);
    var n = Math.round(pH);
    var hlabel = n <= 0 ? "1 mol L⁻¹" : ("about 10" + "⁻" + n + " mol L⁻¹ (order of magnitude)");
    L.readout([["pH", L.num(pH, 1)], ["Nature", natureOf(pH)], ["[H⁺] order", hlabel], ["Fig. 2.7", "colours are only a rough guide"]]);
    L.verdict("<b>pH " + L.num(pH, 1) + "</b> is " + natureOf(pH) + ". " + (RX[st.preset] ? RX[st.preset].name + " from Fig. 2.7. " : "") + "Higher hydronium-ion concentration means lower pH. Strong acids (1 M HCl) give more H⁺ than weak acids (1 M acetic) of the same concentration.");
  }

  function mount(){
    L.presets([
      ["gastric","Fig. 2.7: gastric ~1.2"],
      ["lemon","lemon ~2.2"],
      ["blood","blood / water 7.4"],
      ["milkmag","milk of magnesia 10"],
      ["naoh","NaOH ~14"]
    ], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.phscale = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Family of salts / pH of salts (Activities 2.13–2.14)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "nacl"};
  var RX = {
    nacl: {name:"NaCl", acid:"HCl (strong)", base:"NaOH (strong)", pH:7, kind:"neutral"},
    kcl: {name:"KCl", acid:"HCl (strong)", base:"KOH (strong)", pH:7, kind:"neutral"},
    ch3coona: {name:"CH₃COONa", acid:"CH₃COOH (weak)", base:"NaOH (strong)", pH:8.5, kind:"basic"},
    nahco3: {name:"NaHCO₃", acid:"H₂CO₃ (weak)", base:"NaOH (strong)", pH:8.3, kind:"basic"},
    znso4: {name:"ZnSO₄", acid:"H₂SO₄ (strong)", base:"Zn(OH)₂ (weak)", pH:5, kind:"acidic"}
  };

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 2, step: 0.5, speed: 0.4});
    L.watch("Activity 2.14 school model: strong acid + strong base → pH 7; strong acid + weak base → acidic; strong base + weak acid → basic. Real salt pH is measured with paper or a meter.");
    L.legend([["#22c55e","neutral pH 7"],["#ef4444","acidic pH < 7"],["#3b82f6","basic pH > 7"]]);
    L.controls(""); L.restart(true);
  }

  function draw(){
    var r = RX[st.preset];
    var col = r.kind === "acidic" ? "#ef4444" : (r.kind === "basic" ? "#3b82f6" : "#22c55e");
    var m = L.text(360, 40, r.name, {size: 22, weight: 700}) +
      L.rect(160, 80, 400, 70, col, ' rx="12"') +
      L.text(360, 122, "pH " + r.pH + "  ·  " + r.kind + " (school model)", {size: 16, weight: 700, color: "#0f172a"}) +
      L.text(360, 190, "Acid used: " + r.acid, {size: 15}) +
      L.text(360, 220, "Base used: " + r.base, {size: 15}) +
      L.text(360, 260, "NaCl and Na₂SO₄ are sodium salts; NaCl and KCl are chloride salts.", {size: 13, color: C.muted});
    L.svg(m, r.name, 300);
    L.readout([["Salt", r.name], ["pH (model)", String(r.pH)], ["Nature", r.kind], ["Parents", r.acid + " + " + r.base]]);
    L.verdict("<b>" + r.name + "</b> is " + r.kind + " on the school model (pH " + r.pH + "). Strong acid + strong base → neutral; strong acid + weak base → acidic; strong base + weak acid → basic. Measure a real sample with pH paper.");
  }

  function mount(){
    L.presets([["nacl","NaCl (neutral)"],["kcl","KCl family"],["ch3coona","sodium acetate (basic)"],["nahco3","NaHCO₃ (basic)"],["znso4","ZnSO₄ (acidic)"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.salts = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Chemicals from salt (chlor-alkali, hydrates, POP)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "chlor"};

  function select(id){
    st.preset = id;
    L.markPreset(id);
    L.timeline({maxT: 5, step: 0.2, speed: 0.8});
    var w = {
      chlor: "Chlor-alkali: electricity through brine. Cl₂ at the anode, H₂ at the cathode, NaOH near the cathode. 2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂.",
      bleach: "Bleaching powder from chlorine on dry slaked lime. Represented as Ca(ClO)₂; the actual composition is quite complex.",
      bake: "Heat baking soda: 2NaHCO₃ → Na₂CO₃ + H₂O + CO₂. Recrystallise: Na₂CO₃ + 10H₂O → Na₂CO₃·10H₂O (washing soda).",
      cuso4: "Activity 2.15. Blue CuSO₄·5H₂O turns white on heating as water of crystallisation leaves; a drop of water restores the blue.",
      pop: "Gypsum CaSO₄·2H₂O heated at 373 K → plaster of Paris CaSO₄·½H₂O. Mix with water and it becomes gypsum again, a hard mass."
    };
    L.watch(w[id]);
    L.legend([["#38bdf8","Cl₂ / brine"],["#fbbf24","H₂"],["#e2e8f0","NaOH"],["#67e8f9","blue hydrate"]]);
    L.controls(""); L.restart(true);
  }

  function draw(t){
    var p = Math.min(1, t / 5), m = "";
    if(st.preset === "chlor"){
      m += L.rect(140, 70, 440, 160, "rgba(56,189,248,0.25)", ' rx="12" stroke="#38bdf8" stroke-width="2"');
      m += L.rect(220, 90, 24, 110, "#1e293b") + L.rect(480, 90, 24, 110, "#1e293b");
      m += L.text(232, 70, "anode (+)", {size: 12, color: C.muted}) + L.text(492, 70, "cathode (−)", {size: 12, color: C.muted});
      m += L.text(232, 250, "Cl₂ (bleaching, PVC, water)", {size: 13, color: "#38bdf8"}) + L.text(492, 250, "H₂ (fuels, ammonia)", {size: 13, color: "#fbbf24"});
      m += L.text(360, 40, "2NaCl(aq) + 2H₂O(l) → 2NaOH(aq) + Cl₂(g) + H₂(g)", {size: 14, weight: 700});
      L.readout([["Anode", "chlorine, Cl₂"], ["Cathode", "hydrogen, H₂"], ["Near cathode", "NaOH(aq)"], ["Name", "chlor-alkali (chlor + alkali)"]]);
      L.verdict("<b>Chlor-alkali:</b> 2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂. Chlorine at the <b>anode</b>, hydrogen at the <b>cathode</b>, sodium hydroxide near the cathode. All three products are useful.");
    } else if(st.preset === "bleach"){
      m += L.text(360, 80, "2Ca(OH)₂ + 2Cl₂ → Ca(ClO)₂ + CaCl₂ + 2H₂O", {size: 18, weight: 700});
      m += L.text(360, 130, "dry slaked lime + chlorine → bleaching powder", {size: 16});
      m += L.text(360, 180, "Ca(ClO)₂ is the textbook formula; actual composition is quite complex.", {size: 14, color: C.muted});
      m += L.text(360, 230, "Uses: bleach cotton/linen/pulp/laundry; oxidising agent; germ-free drinking water.", {size: 14, color: C.muted});
      L.readout([["Formula used here", "Ca(ClO)₂"], ["From", "Cl₂ on dry Ca(OH)₂"], ["Not the same as", "CaOCl₂ (different oxygen count)"]]);
      L.verdict("<b>Bleaching powder</b> is represented as <b>Ca(ClO)₂</b>, from chlorine on dry slaked lime. Common name asked in the in-text questions: bleaching powder.");
    } else if(st.preset === "bake"){
      m += L.text(360, 70, "2NaHCO₃ → Na₂CO₃ + H₂O + CO₂", {size: 18, weight: 700});
      m += L.text(360, 120, "then  Na₂CO₃ + 10H₂O → Na₂CO₃·10H₂O", {size: 18, weight: 700});
      m += L.text(360, 180, "Baking soda is a mild non-corrosive basic salt (antacid, baking powder, soda-acid extinguisher).", {size: 14, color: C.muted});
      m += L.text(360, 220, "Washing soda: glass, soap, paper; borax; cleaning; permanent hardness of water.", {size: 14, color: C.muted});
      L.readout([["Baking soda", "NaHCO₃"], ["After heating", "Na₂CO₃ (sodium carbonate)"], ["Washing soda", "Na₂CO₃·10H₂O"], ["10H₂O", "water of crystallisation — not ‘wet’"]]);
      L.verdict("<b>Two steps:</b> heat NaHCO₃ to sodium carbonate, then recrystallise with 10 H₂O to get washing soda. Do not skip the hydrate step.");
    } else if(st.preset === "cuso4"){
      var blue = p < 0.55;
      m += L.rect(200, 90, 140, 90, blue ? "#22d3ee" : "#f8fafc", ' rx="10" stroke="#334155" stroke-width="2"') +
        L.text(270, 200, blue ? "blue CuSO₄·5H₂O" : "white anhydrous", {size: 13});
      m += L.arrow(360, 130, 430, 130, C.text, 3);
      m += L.rect(450, 90, 140, 90, blue ? "#22d3ee" : "#f8fafc", ' rx="10"') + L.text(520, 200, p > 0.7 ? "blue restored" : "after heating", {size: 13});
      m += L.text(360, 250, "five water molecules per formula unit — water of crystallisation", {size: 14, weight: 700});
      L.readout([["Hydrated", "CuSO₄·5H₂O (blue)"], ["After heat", "white; water droplets in the tube"], ["A drop of water", "blue colour restored"]]);
      L.verdict("<b>Activity 2.15:</b> copper sulphate crystals that seem dry contain <b>water of crystallisation</b>. Heating removes it (white); moistening restores the blue. Gypsum is CaSO₄·2H₂O.");
    } else {
      m += L.text(360, 70, "CaSO₄·2H₂O  —373 K→  CaSO₄·½H₂O", {size: 18, weight: 700});
      m += L.text(360, 120, "plaster of Paris + 1½ H₂O → gypsum (hard mass)", {size: 16});
      m += L.text(360, 170, "½ H₂O means two CaSO₄ units share one water molecule.", {size: 14, color: C.muted});
      m += L.text(360, 210, "Store POP moisture-proof or it sets in the packet.", {size: 14, color: C.muted});
      L.readout([["Gypsum", "CaSO₄·2H₂O"], ["POP", "CaSO₄·½H₂O (hemihydrate)"], ["Temperature", "373 K"], ["With water", "back to gypsum, hard solid"]]);
      L.verdict("<b>Plaster of Paris</b> is calcium sulphate hemihydrate, made by heating gypsum at <b>373 K</b>. Mixed with water it becomes gypsum again and sets hard — that is why it is stored moisture-proof.");
    }
    L.svg(m, "chemicals from salt", 300);
  }

  function mount(){
    L.presets([
      ["chlor","chlor-alkali cell"],
      ["bleach","bleaching powder Ca(ClO)₂"],
      ["bake","baking soda → washing soda"],
      ["cuso4","Activity 2.15: CuSO₄·5H₂O"],
      ["pop","plaster of Paris, 373 K"]
    ], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.saltchem = {mount: mount, draw: draw, select: select, state: st};
})();
