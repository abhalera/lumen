// iesc109 labs: Atomic Foundations of Matter. Balance readings in the activities are illustrative; example values are from the textbook.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function clamp9(x, a, b){ return Math.max(a, Math.min(b, x)); }
var SUB9 = "₀₁₂₃₄₅₆₇₈₉";
function sub9(n){ return String(n).split("").map(function(d){ return SUB9[+d]; }).join(""); }
function gcd9(a, b){ return b ? gcd9(b, a % b) : a; }

// Lab 1 — Conservation of mass (Activities 9.1–9.3, Example 9.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "salt"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 2, step: 0.05, speed: 0.6});
    L.legend(id === "ex91" ? [[C.vel, "reactants"], [C.path, "products"]] : [[C.path, "balance reading"]]);
    L.watch({salt: "Activity 9.1: about 50 g of water and a spatula of salt in a beaker on a tared balance (55.0 g is illustrative).", open: "Activity 9.2, set-up 1: baking soda tipped into vinegar in an open flask (readings illustrative).", closed: "Activity 9.2, set-up 2: the balloon of baking soda is tied over the flask before mixing (readings illustrative).", precipitate: "Activity 9.3: sodium sulfate solution (A) and barium chloride solution (B) are mixed (readings illustrative).", ex91: "Example 9.1: calcium carbonate and hydrochloric acid react in a closed container."}[id]);
    L.controls(""); L.restart(true);
  }
  function balance(m, reading){ return m + L.rect(170, 240, 380, 40, "#334155", ' rx="6"') + L.rect(300, 250, 120, 24, "#0f172a", ' rx="3"') + L.text(360, 268, reading, {size: 16, color: "#4ade80", weight: 700, mono: true}); }
  function flask(x, y, fill, level){ return '<path d="M' + (x - 12) + ' ' + (y - 110) + ' L' + (x - 12) + ' ' + (y - 70) + ' L' + (x - 50) + ' ' + y + ' L' + (x + 50) + ' ' + y + ' L' + (x + 12) + ' ' + (y - 70) + ' L' + (x + 12) + ' ' + (y - 110) + '" fill="none" stroke="#cbd5e1" stroke-width="2.5"/>' + '<path d="M' + (x - 50 + level * 0.54) + ' ' + (y - level) + ' L' + (x + 50 - level * 0.54) + ' ' + (y - level) + ' L' + (x + 50) + ' ' + y + ' L' + (x - 50) + ' ' + y + ' Z" fill="' + fill + '" opacity="0.7"/>'; }
  function draw(t){
    var m = "", msg, f = clamp9(t, 0, 1), i;
    if(st.preset === "salt"){
      m += L.rect(310, 140, 100, 100, "none", ' stroke="#cbd5e1" stroke-width="2.5"') + L.rect(312, 170, 96, 68, "#38bdf8", ' opacity="0.45"');
      var left = Math.round(12 * (1 - clamp9((t - 0.3) / 1.5, 0, 1)));
      for(i = 0; i < left; i++) m += L.rect(322 + (i * 7) % 76, 226 - (i % 3) * 5, 5, 5, "#f8fafc");
      m = balance(m, "55.0 g");
      L.svg(m, "Salt dissolving on a balance", 300);
      L.readout([["Water + salt, before", "55.0 g", C.path], ["Solution, after", t >= 2 ? "55.0 g" : "…", C.path], ["Change in mass", t >= 2 ? "none" : "…"]]);
      msg = t < 2 ? "Dissolving…" : "<b>Activity 9.1:</b> the reading stays at 55.0 g. Dissolving is a physical change, and the <b>mass does not change</b>.";
    } else if(st.preset === "open" || st.preset === "closed"){
      var open = st.preset === "open", reading = open ? 22.0 - 1.0 * clamp9((t - 0.5) / 1.5, 0, 1) : 22.0;
      m += flask(360, 240, "#fde68a", 30);
      if(open){ m += '<ellipse cx="' + (460) + '" cy="225" rx="' + (22 * (1 - clamp9(t / 0.5, 0, 1)) + 1) + '" ry="14" fill="#ef4444" opacity="' + (t < 0.5 ? 0.9 : 0.25) + '"/>'; for(i = 0; i < 10 && t > 0.5; i++){ var ph = ((t - 0.5) * 0.8 + i / 10) % 1; m += L.circle(352 + (i * 5) % 18, 200 - ph * 170, 4, "#e2e8f0"); } }
      else { var inflate = clamp9((t - 0.5) / 1.2, 0, 1), rr = 18 + 32 * inflate; m += '<ellipse cx="360" cy="' + (130 - rr) + '" rx="' + rr + '" ry="' + (rr * 1.15) + '" fill="#ef4444" opacity="0.85"/>'; for(i = 0; i < 6 && t > 0.5; i++){ var q = ((t - 0.5) * 0.8 + i / 6) % 1; m += L.circle(352 + (i * 7) % 16, 225 - q * 90, 3.5, "#e2e8f0"); } }
      m = balance(m, reading.toFixed(1) + " g");
      L.svg(m, open ? "Open flask reaction" : "Flask with balloon", 300);
      L.readout([["Before mixing", "22.0 g", C.path], ["After the reaction", t >= 2 ? reading.toFixed(1) + " g" : "…", C.path], ["Carbon dioxide", open ? "escapes into the air" : "trapped in the balloon"]]);
      msg = t < 2 ? "Reacting…" : open ? "<b>Set-up 1:</b> the reading fell from 22.0 g to 21.0 g because the <b>carbon dioxide escaped</b> into the air." : "<b>Set-up 2:</b> the balloon trapped the carbon dioxide, so the reading stayed at 22.0 g: <b>mass is conserved</b>.";
    } else if(st.preset === "precipitate"){
      var pour = clamp9(t / 0.8, 0, 1);
      m += flask(280, 240, "#bae6fd", 30 + 20 * pour) + flask(440, 240, "#bae6fd", 30 * (1 - pour) + 1) + L.text(280, 120, "A", {size: 14, color: C.text, weight: 700}) + L.text(440, 120, "B", {size: 14, color: C.text, weight: 700});
      var ppt = Math.round(24 * clamp9((t - 0.8) / 1, 0, 1));
      for(i = 0; i < ppt; i++) m += L.circle(248 + (i * 13) % 64, 232 - (i % 4) * 9, 3.2, "#f8fafc");
      m = balance(m, "20.0 g");
      L.svg(m, "Mixing sodium sulfate and barium chloride", 300);
      L.readout([["Before mixing", "20.0 g", C.path], ["After mixing", t >= 2 ? "20.0 g" : "…", C.path], ["Observed", t > 0.8 ? "white precipitate" : "clear solutions"]]);
      msg = t < 2 ? "Mixing…" : "<b>Activity 9.3:</b> a white precipitate of <b>barium sulfate</b> forms (with sodium chloride), and the total stays at 20.0 g.";
    } else {
      var X = function(g){ return g * 70; }, ra = [["calcium carbonate", 4.0, "#60a5fa"], ["hydrochloric acid", 2.92, "#93c5fd"]], pr = [["carbon dioxide", 1.76, "#fb923c"], ["water", 0.72, "#fdba74"], ["calcium chloride", 4.44, "#f59e0b"]];
      var x = 80;
      ra.forEach(function(r){ var w = X(r[1]) * (1 - f); m += L.rect(x, 70, w, 40, r[2]) + (w > 60 ? L.text(x + w / 2, 95, r[1] + " g", {size: 12, color: "#0f172a", weight: 700}) : ""); x += w; });
      m += L.text(70, 95, "reactants", {size: 13, color: C.vel, anchor: "end"});
      x = 80;
      pr.forEach(function(r){ var w = X(r[1]) * f; m += L.rect(x, 170, w, 40, r[2]) + (w > 40 ? L.text(x + w / 2, 195, r[1] + " g", {size: 12, color: "#0f172a", weight: 700}) : ""); x += w; });
      m += L.text(70, 195, "products", {size: 13, color: C.path, anchor: "end"}) + L.text(80 + X(6.92) + 10, 95, (6.92 * (1 - f)).toFixed(2) + " g", {size: 14, color: C.vel, anchor: "start", weight: 700}) + L.text(80 + X(6.92) + 10, 195, (6.92 * f).toFixed(2) + " g", {size: 14, color: C.path, anchor: "start", weight: 700});
      L.svg(m, "Reactant and product masses", 260);
      L.readout([["Reactants", "4.0 + 2.92 = 6.92 g", C.vel], ["Products", "1.76 + 0.72 + 4.44 = 6.92 g", C.path], ["Difference", "0 g"]]);
      msg = t < 2 ? "Reacting…" : "<b>Example 9.1:</b> 4.0 g + 2.92 g = 6.92 g of reactants and 1.76 g + 0.72 g + 4.44 g = <b>6.92 g</b> of products: the law is obeyed.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["salt", "Activity 9.1: salt in water"], ["open", "Activity 9.2: open flask"], ["closed", "Activity 9.2: with a balloon"], ["precipitate", "Activity 9.3: precipitate"], ["ex91", "Example 9.1"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.massLab = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Constant proportions and Dalton's atoms (Section 9.2–9.3, Example 9.3, Pause and Ponder 6)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "water"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 2, step: 0.05, speed: 0.6});
    L.legend(id === "rearrange" ? [[C.vel, "hydrogen atoms"], [C.danger, "oxygen atoms"]] : [[C.vel, "first element"], [C.path, "second element"]]);
    L.watch({water: "Section 9.2: 9 g of purified water from a river, a borewell and the ocean is decomposed.", ex93: "Example 9.3: sodium and chlorine combine in the ratio 23 : 35.5.", copper: "Pause and Ponder 6: students X and Y each prepare an oxide of copper.", rearrange: "Dalton's theory: two hydrogen molecules and one oxygen molecule rearrange into two water molecules."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, f = clamp9(t, 0, 1);
    if(st.preset === "water"){
      ["River", "Borewell", "Ocean"].forEach(function(s, i){
        var y = 50 + i * 80;
        m += L.text(120, y + 22, s + " (9 g)", {size: 13, color: C.text, anchor: "end"}) + L.rect(140, y, 9 * 50 * (1 - f), 34, "#38bdf8", ' opacity="0.4"');
        m += L.rect(140, y, 50 * f, 34, C.vel) + L.rect(140 + 50 * f + 4, y, 400 * f, 34, C.path);
        if(f > 0.6) m += L.text(165, y + 22, "1 g", {size: 12, color: "#0f172a", weight: 700}) + L.text(140 + 50 + 4 + 200, y + 22, "8 g oxygen", {size: 12, color: "#0f172a", weight: 700});
      });
      L.svg(m, "Decomposing water samples", 270);
      L.readout([["River", "1 g H : 8 g O", C.vel], ["Borewell", "1 g H : 8 g O", C.vel], ["Ocean", "1 g H : 8 g O", C.vel]]);
      msg = t < 2 ? "Decomposing…" : "Every sample gives 1 g of hydrogen and 8 g of oxygen for each 9 g of water: always <b>1 : 8</b>.";
    } else if(st.preset === "ex93"){
      var S = 4.2;
      m += L.text(130, 82, "sodium", {size: 13, color: C.vel, anchor: "end"}) + L.rect(140, 60, 46 * S, 34, C.vel) + L.text(140 + 46 * S / 2, 82, "46 g", {size: 13, color: "#0f172a", weight: 700});
      m += L.text(130, 142, "chlorine", {size: 13, color: C.path, anchor: "end"}) + L.rect(140, 120, 71 * S * f, 34, C.path) + L.text(150 + 71 * S * f, 142, (71 * f).toFixed(1) + " g", {size: 13, color: C.path, anchor: "start", weight: 700});
      m += L.text(130, 212, "sodium chloride", {size: 13, color: C.text, anchor: "end"}) + L.rect(140, 190, 46 * S * f, 34, C.vel, ' opacity="0.8"') + L.rect(140 + 46 * S * f, 190, 71 * S * f, 34, C.path, ' opacity="0.8"') + L.text(150 + 117 * S * f, 212, (117 * f).toFixed(0) + " g", {size: 13, color: C.text, anchor: "start", weight: 700});
      L.svg(m, "Sodium and chlorine masses", 250);
      L.readout([["Ratio Na : Cl", "23 : 35.5"], ["Chlorine for 46 g of sodium", "(35.5 ÷ 23) × 46 = 71 g", C.path], ["Sodium chloride formed", "46 + 71 = 117 g"]]);
      msg = t < 2 ? "Combining…" : "<b>Example 9.3:</b> (35.5 ÷ 23) × 46 g = <b>71 g</b> of chlorine, forming 117 g of sodium chloride.";
    } else if(st.preset === "copper"){
      [["Student X", 4, 1], ["Student Y", 8, 2]].forEach(function(s, i){
        var y = 60 + i * 100, S = 40;
        m += L.text(130, y + 22, s[0], {size: 14, color: C.text, anchor: "end"}) + L.rect(140, y, s[1] * S * f, 34, "#b45309") + L.rect(144 + s[1] * S * f, y, s[2] * S * f, 34, C.danger);
        m += L.text(140, y + 56, s[1] + " g copper : " + s[2] + " g oxygen = " + (s[1] / gcd9(s[1], s[2])) + " : " + (s[2] / gcd9(s[1], s[2])), {size: 13, color: C.muted, anchor: "start"});
      });
      L.svg(m, "Two copper oxide samples", 270);
      L.readout([["Student X", "4 : 1"], ["Student Y", "8 : 2 = 4 : 1"], ["Same compound?", "yes, same ratio", C.ok]]);
      msg = t < 2 ? "Comparing…" : "<b>Pause and Ponder 6:</b> 4 : 1 and 8 : 2 are the <b>same ratio</b>, so both results support the Law of Constant Proportions.";
    } else {
      var before = [[120, 100], [150, 100], [120, 200], [150, 200], [250, 150], [280, 150]], after = [[470, 125], [530, 125], [470, 235], [530, 235], [500, 100], [500, 210]];
      if(f === 0) m += L.line(120, 100, 150, 100, "#cbd5e1", 4) + L.line(120, 200, 150, 200, "#cbd5e1", 4) + L.line(250, 150, 280, 150, "#cbd5e1", 4);
      if(f === 1) m += L.line(470, 125, 500, 100, "#cbd5e1", 4) + L.line(530, 125, 500, 100, "#cbd5e1", 4) + L.line(470, 235, 500, 210, "#cbd5e1", 4) + L.line(530, 235, 500, 210, "#cbd5e1", 4);
      before.forEach(function(b, i){ var x = b[0] + (after[i][0] - b[0]) * f, y = b[1] + (after[i][1] - b[1]) * f, O = i >= 4; m += L.circle(x, y, O ? 17 : 12, O ? C.danger : C.vel) + L.text(x, y + 5, O ? "O" : "H", {size: 12, color: "#fff", weight: 700}); });
      m += L.text(200, 270, "2 H₂ + O₂", {size: 15, color: C.text}) + L.text(500, 285, "2 H₂O", {size: 15, color: C.text}) + L.arrow(320, 160, 410, 160, C.faint, 3);
      L.svg(m, "Atoms rearranging into water", 300);
      L.readout([["Before", "4 H atoms, 2 O atoms", C.vel], ["After", "4 H atoms, 2 O atoms", C.vel], ["Atoms created or destroyed", "none"]]);
      msg = t < 2 ? "Rearranging…" : "Atoms only rearrange: <b>4 H and 2 O</b> before and after. So mass is conserved, and every water molecule has the same make-up (Dalton's postulates).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["water", "Water from three sources"], ["ex93", "Example 9.3: NaCl"], ["copper", "Pause and Ponder 6: copper oxide"], ["rearrange", "Dalton: atoms rearrange"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.proportions = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Covalent bonds (Figs. 9.6–9.10, Pause and Ponder 8)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "h2"};
  var MOL = {
    h2: {atoms: [["H", 1, 40, 250, 150, 330, 150], ["H", 1, 40, 470, 150, 390, 150]], bonds: [[0, 1, 1]], name: "H—H", fig: "<b>Fig. 9.6:</b> each hydrogen shares one electron, and the shared pair gives both a full K-shell. Single bond: <b>H—H</b>.", each: "2 (full K-shell)"},
    cl2: {atoms: [["Cl", 7, 60, 200, 150, 315, 150], ["Cl", 7, 60, 520, 150, 405, 150]], bonds: [[0, 1, 1]], name: "Cl—Cl", fig: "<b>Fig. 9.7:</b> each chlorine shares one electron to complete its octet: <b>Cl—Cl</b>.", each: "8 (octet)"},
    o2: {atoms: [["O", 6, 60, 200, 150, 315, 150], ["O", 6, 60, 520, 150, 405, 150]], bonds: [[0, 1, 2]], name: "O=O", fig: "<b>Fig. 9.8:</b> each oxygen shares two electrons: two shared pairs make a double bond, <b>O=O</b>.", each: "8 (octet)"},
    hcl: {atoms: [["H", 1, 40, 230, 150, 330, 150], ["Cl", 7, 60, 520, 150, 410, 150]], bonds: [[0, 1, 1]], name: "H—Cl", fig: "<b>Fig. 9.9:</b> hydrogen and chlorine each need one electron, so they share a pair: <b>H—Cl</b>.", each: "H 2, Cl 8"},
    h2o: {atoms: [["O", 6, 60, 360, 120, 360, 120], ["H", 1, 40, 170, 250, 297, 190], ["H", 1, 40, 550, 250, 423, 190]], bonds: [[0, 1, 1], [0, 2, 1]], name: "H—O—H", fig: "<b>Fig. 9.10:</b> oxygen shares one pair with each of two hydrogen atoms: <b>H—O—H</b>, the water molecule H₂O.", each: "O 8, H 2"},
    n2: {atoms: [["N", 5, 60, 200, 150, 315, 150], ["N", 5, 60, 520, 150, 405, 150]], bonds: [[0, 1, 3]], name: "N≡N", fig: "<b>Pause and Ponder 8:</b> each nitrogen shares three electrons: three shared pairs make a triple bond, <b>N≡N</b>.", each: "8 (octet)"}
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 1.5, step: 0.05, speed: 0.6});
    L.legend([[C.vel, "electrons of the first atom"], [C.path, "electrons of the other atom(s)"]]);
    L.watch({h2: "Fig. 9.6: two hydrogen atoms (1 electron each).", cl2: "Fig. 9.7: two chlorine atoms (7 valence electrons each).", o2: "Fig. 9.8: two oxygen atoms (6 valence electrons each).", hcl: "Fig. 9.9: a hydrogen atom and a chlorine atom.", h2o: "Fig. 9.10: one oxygen atom and two hydrogen atoms.", n2: "Pause and Ponder 8: two nitrogen atoms (5 valence electrons each)."}[id] + " Only the valence shell is drawn.");
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var M = MOL[st.preset], f = clamp9(t, 0, 1), m = "", pos = M.atoms.map(function(a){ return [a[3] + (a[5] - a[3]) * f, a[4] + (a[6] - a[4]) * f]; });
    M.atoms.forEach(function(a, i){
      var p = pos[i], dirs = [], shared = 0, col = i === 0 ? C.vel : C.path;
      M.bonds.forEach(function(b){ if(b[0] === i || b[1] === i){ var o = pos[b[0] === i ? b[1] : b[0]]; dirs.push([Math.atan2(o[1] - p[1], o[0] - p[0]), b[2]]); shared += b[2]; } });
      m += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + a[2] + '" fill="none" stroke="#64748b" stroke-width="2"/>' + L.circle(p[0], p[1], 16, "#1e293b") + L.text(p[0], p[1] + 5, a[0], {size: 14, color: C.text, weight: 700});
      var sx = 0, sy = 0;
      dirs.forEach(function(d){ sx += Math.cos(d[0]); sy += Math.sin(d[0]); for(var k = 0; k < d[1]; k++){ var ang = d[0] + (k - (d[1] - 1) / 2) * 0.32; m += L.circle(p[0] + a[2] * Math.cos(ang), p[1] + a[2] * Math.sin(ang), 5.5, col); } });
      var lone = a[1] - shared, base = Math.atan2(-sy, -sx);
      for(var j = 0; j < lone; j++){ var an = base + (j - (lone - 1) / 2) * 0.55; m += L.circle(p[0] + a[2] * Math.cos(an), p[1] + a[2] * Math.sin(an), 5.5, col); }
    });
    var pairs = M.bonds.reduce(function(s, b){ return s + b[2]; }, 0);
    m += L.text(360, 285, f >= 1 ? M.name : "", {size: 22, color: C.text, weight: 700});
    L.svg(m, "Covalent bond: " + M.name, 300);
    L.readout([["Shared pairs", String(pairs)], ["Bond type", M.bonds[0][2] === 1 ? "single" : M.bonds[0][2] === 2 ? "double" : "triple"], ["Structure", M.name, C.path], ["Electrons each atom counts", M.each]]);
    L.verdict(t < 1.5 ? "Atoms approaching…" : M.fig);
  }
  function mount(){ L.presets([["h2", "Fig. 9.6: H₂"], ["cl2", "Fig. 9.7: Cl₂"], ["o2", "Fig. 9.8: O₂"], ["hcl", "Fig. 9.9: HCl"], ["h2o", "Fig. 9.10: H₂O"], ["n2", "N₂ (triple bond)"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.covalent = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Ionic bonds (Figs. 9.11–9.14, Pause and Ponder 13 and 15)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "nacl"};
  var ION = {
    nacl: {metals: [["Na", 1, 200, 150]], non: [["Cl", 7, 1, 480, 150]], moves: [[0, 0]], formula: "NaCl", rows: [["Sodium", "Na (2, 8, 1) → Na⁺ (2, 8)"], ["Chlorine", "Cl (2, 8, 7) → Cl⁻ (2, 8, 8)"]], msg: "<b>Fig. 9.13:</b> sodium gives its valence electron to chlorine, forming <b>Na⁺ and Cl⁻</b>, which attract each other: NaCl."},
    mgcl2: {metals: [["Mg", 2, 360, 150]], non: [["Cl", 7, 1, 140, 150], ["Cl", 7, 1, 580, 150]], moves: [[0, 0], [0, 1]], formula: "MgCl₂", rows: [["Magnesium", "Mg (2, 8, 2) → Mg²⁺ (2, 8)"], ["Each chlorine", "Cl (2, 8, 7) → Cl⁻ (2, 8, 8)"]], msg: "<b>Pause and Ponder 13:</b> magnesium gives one electron to each of two chlorine atoms, and Mg²⁺ with 2 Cl⁻ forms <b>MgCl₂</b>."},
    na2s: {metals: [["Na", 1, 140, 150], ["Na", 1, 580, 150]], non: [["S", 6, 2, 360, 150]], moves: [[0, 0], [1, 0]], formula: "Na₂S", rows: [["Each sodium", "Na (2, 8, 1) → Na⁺ (2, 8)"], ["Sulfur", "S (2, 8, 6) → S²⁻ (2, 8, 8)"]], msg: "<b>Pause and Ponder 15:</b> two sodium atoms each give one electron to sulfur, and 2 Na⁺ with S²⁻ form <b>Na₂S</b>."}
  };
  var CH = {1: "⁺", 2: "²⁺"}, AN = {1: "⁻", 2: "²⁻"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 2, step: 0.05, speed: 0.6});
    L.legend(id === "lattice" ? [["#a78bfa", "Na⁺"], ["#4ade80", "Cl⁻"]] : [[C.vel, "metal's valence electrons"], [C.path, "non-metal's valence electrons"]]);
    L.watch({nacl: "Figs. 9.11–9.13: a sodium atom and a chlorine atom. Only valence shells are drawn.", mgcl2: "A magnesium atom between two chlorine atoms.", na2s: "Two sodium atoms and a sulfur atom.", lattice: "Fig. 9.14: one layer of a sodium chloride crystal."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "lattice"){
      var rowsShown = Math.ceil(clamp9(t / 1.5, 0, 1) * 5);
      for(var r = 0; r < rowsShown; r++) for(var c = 0; c < 9; c++){
        var x = 120 + c * 60, y = 40 + r * 55, na = (r + c) % 2 === 0;
        m += L.circle(x, y, na ? 13 : 20, na ? "#a78bfa" : "#4ade80", ' opacity="0.9"') + L.text(x, y + 4, na ? "Na⁺" : "Cl⁻", {size: 10, color: "#0f172a", weight: 700});
      }
      if(t >= 1.5){ m += '<circle cx="360" cy="150" r="22" fill="none" stroke="#facc15" stroke-width="3"/>'; [[300, 150], [420, 150], [360, 95], [360, 205]].forEach(function(p){ m += L.line(360, 150, p[0], p[1], "#facc15", 2); }); }
      L.svg(m, "Sodium chloride crystal layer", 290);
      L.readout([["Around each Na⁺ in this layer", "4 Cl⁻"], ["Plus one above and one below", "6 Cl⁻ in 3-D", C.path], ["Around each Cl⁻", "6 Na⁺"]]);
      msg = t < 2 ? "Building the crystal…" : "<b>Fig. 9.14:</b> the ions repeat in a regular pattern. In 3-D each Na⁺ is surrounded by <b>six chloride ions</b> (four in this layer, one above and one below).";
    } else {
      var S = ION[st.preset], f = clamp9((t - 0.5) / 1, 0, 1), done = t >= 1.6;
      S.metals.forEach(function(a, i){
        var moved = S.moves.filter(function(mv){ return mv[0] === i; }).length;
        m += '<circle cx="' + a[2] + '" cy="' + a[3] + '" r="50" fill="none" stroke="#64748b" stroke-width="2"' + (done ? ' stroke-dasharray="4 5" opacity="0.4"' : '') + '/>' + L.circle(a[2], a[3], 20, "#1e293b") + L.text(a[2], a[3] + 5, a[0] + (done ? CH[a[1]] : ""), {size: 15, color: done ? C.vel : C.text, weight: 700});
      });
      S.non.forEach(function(a){
        m += '<circle cx="' + a[3] + '" cy="' + a[4] + '" r="60" fill="none" stroke="#64748b" stroke-width="2"/>' + L.circle(a[3], a[4], 22, "#1e293b") + L.text(a[3], a[4] + 5, a[0] + (done ? AN[a[2]] : ""), {size: 15, color: done ? C.path : C.text, weight: 700});
        for(var j = 0; j < a[1]; j++){ var an = -Math.PI / 2 + j * 2 * Math.PI / 8; m += L.circle(a[3] + 60 * Math.cos(an), a[4] + 60 * Math.sin(an), 5.5, C.path); }
      });
      var slot = {};
      S.moves.forEach(function(mv, k){
        var a = S.metals[mv[0]], b = S.non[mv[1]], idx = S.moves.filter(function(q, qi){ return q[0] === mv[0] && qi < k; }).length;
        var sa = Math.atan2(b[4] - a[3], b[3] - a[2]) + (idx ? 0.5 : 0) * (S.metals[mv[0]][1] > 1 ? 1 : 0), sx = a[2] + 50 * Math.cos(sa), sy = a[3] + 50 * Math.sin(sa);
        slot[mv[1]] = (slot[mv[1]] || 0) + 1;
        var ta = -Math.PI / 2 + (b[1] + slot[mv[1]] - 1) * 2 * Math.PI / 8, tx = b[3] + 60 * Math.cos(ta), ty = b[4] + 60 * Math.sin(ta);
        m += L.circle(sx + (tx - sx) * f, sy + (ty - sy) * f - Math.sin(f * Math.PI) * 40, 6, "#facc15");
      });
      if(done) m += L.text(360, 285, S.formula, {size: 24, color: C.text, weight: 700});
      L.svg(m, "Electron transfer forming " + S.formula, 300);
      L.readout(S.rows.concat([["Formula", done ? S.formula : "…", C.path]]));
      msg = done ? S.msg : "Transferring electrons…";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["nacl", "Fig. 9.13: NaCl"], ["mgcl2", "MgCl₂"], ["na2s", "Na₂S"], ["lattice", "Fig. 9.14: crystal"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.ionic = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Writing chemical formulae by criss-cross (Section 9.5, Table 9.1)
(function(){
  var L = LAB, C = L.C;
  var CAT = [["Na", "sodium", 1, 0], ["K", "potassium", 1, 0], ["Ag", "silver", 1, 0], ["NH₄", "ammonium", 1, 1], ["Ca", "calcium", 2, 0], ["Mg", "magnesium", 2, 0], ["Zn", "zinc", 2, 0], ["Ba", "barium", 2, 0], ["Cu", "cupric", 2, 0], ["Fe", "ferrous", 2, 0], ["Fe", "ferric", 3, 0], ["Al", "aluminium", 3, 0]];
  var ANI = [["Cl", "chloride", 1, 0], ["Br", "bromide", 1, 0], ["I", "iodide", 1, 0], ["F", "fluoride", 1, 0], ["OH", "hydroxide", 1, 1], ["NO₃", "nitrate", 1, 1], ["HCO₃", "hydrogencarbonate", 1, 1], ["O", "oxide", 2, 0], ["S", "sulfide", 2, 0], ["CO₃", "carbonate", 2, 1], ["SO₄", "sulfate", 2, 1]];
  var PRE = {h2s: [["H", 1, 0], ["S", 2, 0], false, "hydrogen sulfide"], ccl4: [["C", 4, 0], ["Cl", 1, 0], false, "carbon tetrachloride"], cacl2: [["Ca", 2, 0], ["Cl", 1, 0], true, "calcium chloride"], al2o3: [["Al", 3, 0], ["O", 2, 0], true, "aluminium oxide"], mgo: [["Mg", 2, 0], ["O", 2, 0], true, "magnesium oxide"], mgoh2: [["Mg", 2, 0], ["OH", 1, 1], true, "magnesium hydroxide"], al2so43: [["Al", 3, 0], ["SO₄", 2, 1], true, "aluminium sulfate"]};
  var st = {preset: "cacl2", c: 0, a: 0};
  var SUP = {1: "", 2: "²", 3: "³", 4: "⁴"};
  function part(sym, n, poly){ return n === 1 ? sym : poly ? "(" + sym + ")" + sub9(n) : sym + sub9(n); }
  function spec(){ if(st.preset !== "build") return PRE[st.preset]; var c = CAT[st.c], a = ANI[st.a]; return [[c[0], c[2], c[3]], [a[0], a[2], a[3]], true, c[1] + " " + a[1]]; }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 0.8});
    L.legend([[C.vel, "first symbol / cation"], [C.path, "second symbol / anion"]]);
    L.watch(id === "build" ? "Pick any cation and anion from Table 9.1." : id === "h2s" || id === "ccl4" ? "Section 9.5.1: a covalent compound, using valencies." : "Section 9.5.2: an ionic compound, using the charges (numbers only).");
    if(id === "build"){
      var ionTxt = function(r, sign){ return r[0] + SUP[r[2]] + sign; };
      L.controls(L.slider("cc-c", "Cation", 0, CAT.length - 1, 1, st.c, ionTxt(CAT[st.c], "⁺")) + L.slider("cc-a", "Anion", 0, ANI.length - 1, 1, st.a, ionTxt(ANI[st.a], "⁻")));
      L.onInput("cc-c", function(v){ st.c = v; L.setVal("cc-c", ionTxt(CAT[v], "⁺")); App.resetTimeline(); App.play(); });
      L.onInput("cc-a", function(v){ st.a = v; L.setVal("cc-a", ionTxt(ANI[v], "⁻")); App.resetTimeline(); App.play(); });
    } else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var S = spec(), A = S[0], B = S[1], ionic = S[2], m = "";
    var na = B[1], nb = A[1], g = gcd9(na, nb), raw = part(A[0], na, A[2]) + part(B[0], nb, B[2]), simple = part(A[0], na / g, A[2]) + part(B[0], nb / g, B[2]);
    var f = clamp9(t - 1, 0, 1);
    m += L.text(240, 100, A[0], {size: 44, color: C.vel, weight: 700}) + L.text(460, 100, B[0], {size: 44, color: C.path, weight: 700});
    m += L.text(240, 150, ionic ? A[1] + "+" : String(A[1]), {size: 22, color: C.vel, mono: true}) + L.text(460, 150, ionic ? B[1] + "−" : String(B[1]), {size: 22, color: C.path, mono: true}) + L.text(120, 150, ionic ? "charge" : "valency", {size: 13, color: C.muted, anchor: "start"});
    var ax = 240 + (500 - 240) * f, ay = 150 + (120 - 150) * f, bx = 460 + (285 - 460) * f, by = 150 + (120 - 150) * f;
    if(t >= 1){ m += L.line(250, 140, 490, 115, C.faint, 1.5) + L.line(450, 140, 295, 115, C.faint, 1.5); m += L.text(ax, ay, String(A[1]), {size: 18, color: C.vel, weight: 700}) + L.text(bx, by, String(B[1]), {size: 18, color: C.path, weight: 700}); }
    if(t >= 2) m += L.text(360, 220, "→ " + raw, {size: 26, color: C.muted});
    if(t >= 2.5) m += L.text(360, 268, simple, {size: 34, color: C.text, weight: 700});
    L.svg(m, "Criss-cross method for " + simple, 290);
    var charge = A[1] * (na / g) - B[1] * (nb / g);
    L.readout([[ionic ? "Cation" : "First element", A[0] + " (" + (ionic ? A[1] + "+" : "valency " + A[1]) + ")", C.vel], [ionic ? "Anion" : "Second element", B[0] + " (" + (ionic ? B[1] + "−" : "valency " + B[1]) + ")", C.path], ["After crossing", raw], ["Formula", t >= 2.5 ? simple : "…"], ionic ? ["Charge check", (na / g) + " × " + A[1] + " − " + (nb / g) + " × " + B[1] + " = " + charge] : ["Name", S[3]]]);
    var note = raw !== simple ? " (" + raw + " divided by " + g + ")" : "";
    note += (A[2] && na / g > 1) || (B[2] && nb / g > 1) ? "; brackets show more than one polyatomic ion" : "";
    L.verdict(t < 3 ? "Crossing over…" : "The formula of " + S[3] + " is <b>" + simple + "</b>" + note + ".");
  }
  function mount(){ L.presets([["h2s", "H₂S"], ["ccl4", "CCl₄"], ["cacl2", "CaCl₂"], ["al2o3", "Al₂O₃"], ["mgo", "MgO"], ["mgoh2", "Mg(OH)₂"], ["al2so43", "Al₂(SO₄)₃"], ["build", "Build from Table 9.1"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.crissCross = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Solubility and conductivity (Activity 9.4, Table 9.2)
(function(){
  var L = LAB, C = L.C;
  var DATA = {
    nacl: ["Sodium chloride", [1, 0, 0], 0, 1, true, "<b>Sodium chloride:</b> dissolves in water only. The solid does not conduct, but in water the <b>bulb glows</b> because the ions are free to move."],
    cuso4: ["Copper sulfate", [1, 0, 0], 0, 1, true, "<b>Copper sulfate:</b> dissolves in water only. The solid does not conduct, but in water the <b>bulb glows</b>: it is ionic."],
    sugar: ["Sugar", [1, 0, 0], 0, 0, false, "<b>Sugar:</b> dissolves in water but gives <b>no ions</b>, so the bulb stays off. It is covalent."],
    camphor: ["Camphor", [0, 1, 1], 0, 0, false, "<b>Camphor:</b> <b>does not dissolve in water</b> but dissolves in kerosene and petrol, and it never conducts: a covalent compound."],
    molten: ["Molten sodium chloride", [1, 0, 0], 0, 1, true, "<b>Prediction:</b> melted sodium chloride conducts because its ions are <b>free to move</b>; a melted covalent compound has no ions and would not."]
  };
  var st = {preset: "nacl"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 0.8});
    L.legend([["#facc15", "bulb glowing"], [C.vel, "moving ions"]]);
    L.watch(id === "molten" ? "The textbook asks you to predict: does molten (melted) sodium chloride conduct? Solid first, then melted." : "Activity 9.4: first the solubility tests (0–1 s), then conductivity of the solid (1–2 s) and in water (2–3 s).");
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var D = DATA[st.preset], m = "", i, phase = t < 1 ? 0 : t < 2 ? 1 : 2, glow = (phase === 1 && D[2]) || (phase === 2 && D[3]);
    if(st.preset !== "molten"){
      ["water", "kerosene", "petrol"].forEach(function(s, k){
        var x = 70 + k * 90, dis = D[1][k], left = Math.round(8 * (1 - (dis ? clamp9(t, 0, 1) : 0)));
        m += L.rect(x - 30, 150, 60, 80, "none", ' stroke="#cbd5e1" stroke-width="2"') + L.rect(x - 28, 170, 56, 58, k ? "#fde68a" : "#38bdf8", ' opacity="0.35"');
        for(i = 0; i < left; i++) m += L.rect(x - 22 + (i * 7) % 44, 220 - (i % 2) * 5, 5, 5, "#f8fafc");
        m += L.text(x, 250, s, {size: 12, color: C.muted}) + L.text(x, 140, t >= 1 ? (dis ? "dissolves" : "no") : "", {size: 12, color: dis ? C.ok : C.danger, weight: 700});
      });
    } else {
      m += L.rect(110, 150, 120, 60, "#475569", ' rx="6"') + L.text(170, 186, t < 1 ? "solid" : "melted", {size: 14, color: C.text});
      for(i = 0; i < 5 && t >= 1; i++) m += '<path d="M' + (130 + i * 20) + ' 240 q8 -18 0 -26 q-8 8 0 26" fill="#f97316"/>';
    }
    m += L.rect(420, 40, 60, 30, "#475569", ' rx="3"') + L.text(450, 60, "9 V", {size: 12, color: C.text}) + L.line(420, 55, 360, 55, "#cbd5e1", 2) + L.line(360, 55, 360, 120, "#cbd5e1", 2) + L.line(480, 55, 620, 55, "#cbd5e1", 2) + L.line(620, 55, 620, 80, "#cbd5e1", 2);
    m += L.circle(620, 100, 20, glow ? "#facc15" : "#1e293b", ' stroke="#cbd5e1" stroke-width="2"') + (glow ? L.circle(620, 100, 34, "#facc15", ' opacity="0.25"') : "") + L.line(620, 120, 620, 140, "#cbd5e1", 2) + L.line(620, 140, 540, 140, "#cbd5e1", 2) + L.line(540, 140, 540, 170, "#cbd5e1", 2);
    m += L.rect(330, 150, 240, 100, "none", ' stroke="#cbd5e1" stroke-width="2"') + L.line(360, 120, 360, 230, "#94a3b8", 6) + L.line(540, 170, 540, 230, "#94a3b8", 6);
    var inWater = phase === 2;
    if(phase >= 1){
      if(inWater && st.preset !== "molten") m += L.rect(332, 175, 236, 73, "#38bdf8", ' opacity="0.3"');
      if(inWater && st.preset === "molten") m += L.rect(332, 175, 236, 73, "#f97316", ' opacity="0.3"');
      for(i = 0; i < 12; i++){
        var bx = 380 + (i * 37) % 140, by = 195 + (i * 23) % 45;
        if(inWater && D[4]) { bx += Math.sin(t * 4 + i) * 10; m += L.circle(bx, by, 5, i % 2 ? C.vel : C.path); }
        else if(inWater && D[1][0]) m += L.circle(bx, by, 4, "#e2e8f0", ' opacity="0.6"');
        else if(!inWater) m += L.rect(380 + (i % 6) * 22, 226 - Math.floor(i / 6) * 10, 16, 9, "#f8fafc");
      }
    }
    m += L.text(450, 275, phase === 0 ? "" : phase === 1 ? "testing the solid" : st.preset === "molten" ? "testing the melt" : "testing in water", {size: 13, color: C.muted});
    L.svg(m, D[0] + " tests", 290);
    var yn = function(b){ return b ? "yes" : "no"; };
    L.readout([["Dissolves in water / kerosene / petrol", st.preset === "molten" ? "(melted instead)" : D[1].map(yn).join(" / ")], ["Solid conducts?", t >= 1 ? yn(D[2]) : "…"], [st.preset === "molten" ? "Melt conducts?" : "In water conducts?", t >= 2 ? yn(D[3]) : "…", D[3] ? C.ok : C.danger]]);
    L.verdict(t < 3 ? "Testing…" : D[5]);
  }
  function mount(){ L.presets([["nacl", "Sodium chloride"], ["cuso4", "Copper sulfate"], ["sugar", "Sugar"], ["camphor", "Camphor"], ["molten", "Prediction: molten salt"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.conductivity = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Molecular mass and formula unit mass (Examples 9.4–9.7, Pause and Ponder 21 and 24)
(function(){
  var L = LAB, C = L.C;
  var MASS = {H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Ca: 40};
  var SUBS = {
    h2o: ["H₂O", ["H", "H", "O"], "(1 u × 2) + (16 u × 1)", "<b>Example 9.4:</b> H₂O = (1 u × 2) + (16 u × 1) = <b>18 u</b>."],
    co2: ["CO₂", ["C", "O", "O"], "(12 u × 1) + (16 u × 2)", "<b>Example 9.5:</b> CO₂ = (12 u × 1) + (16 u × 2) = <b>44 u</b>."],
    na2o: ["Na₂O", ["Na", "Na", "O"], "(23 u × 2) + (16 u × 1)", "<b>Example 9.6:</b> the formula unit mass of Na₂O = (23 u × 2) + (16 u × 1) = <b>62 u</b>."],
    cano32: ["Ca(NO₃)₂", ["Ca", "N", "O", "O", "O", "N", "O", "O", "O"], "40 u + {14 u + (16 u × 3)} × 2", "<b>Example 9.7:</b> Ca(NO₃)₂ = 40 u + {14 u + (16 u × 3)} × 2 = <b>164 u</b>."],
    hno3: ["HNO₃", ["H", "N", "O", "O", "O"], "1 u + 14 u + (16 u × 3)", "<b>Pause and Ponder 21:</b> HNO₃ = 1 u + 14 u + (16 u × 3) = <b>63 u</b>."],
    mgoh2: ["Mg(OH)₂", ["Mg", "O", "H", "O", "H"], "24 u + (16 u + 1 u) × 2", "<b>Pause and Ponder 24:</b> Mg(OH)₂ = 24 u + (16 u + 1 u) × 2 = <b>58 u</b>."]
  };
  var COL = {H: "#e2e8f0", C: "#475569", N: "#60a5fa", O: "#ef4444", Na: "#a78bfa", Mg: "#4ade80", Ca: "#fbbf24"};
  var st = {preset: "h2o"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 2, step: 0.05, speed: 0.6});
    L.legend([[C.path, "running total"]]);
    L.watch("Atomic masses: H 1 u, C 12 u, N 14 u, O 16 u, Na 23 u, Mg 24 u, Ca 40 u.");
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var S = SUBS[st.preset], atoms = S[1], n = atoms.length, k = Math.min(n, Math.floor(clamp9(t, 0, 2) / 2 * n + 1e-9)), total = 0, m = "", x = 40, scale = 3.6;
    atoms.forEach(function(a, i){
      var w = MASS[a] * scale;
      if(i < k){ total += MASS[a]; m += L.rect(x, 120, w - 2, 50, COL[a], ' rx="3"') + (w > 26 ? L.text(x + w / 2, 142, a, {size: 12, color: "#0f172a", weight: 700}) + L.text(x + w / 2, 160, MASS[a] + " u", {size: 10, color: "#0f172a"}) : L.text(x + w / 2, 110, a, {size: 11, color: C.text})); }
      else m += L.rect(x, 120, w - 2, 50, "#1e293b", ' rx="3"');
      x += w;
    });
    m += L.text(360, 70, S[0], {size: 34, color: C.text, weight: 700}) + L.text(360, 230, "total = " + total + " u", {size: 26, color: C.path, weight: 700});
    L.svg(m, "Adding atomic masses for " + S[0], 260);
    L.readout([["Formula", S[0]], ["Calculation", S[2]], ["Atoms added", k + " of " + n], ["Total so far", total + " u", C.path]]);
    L.verdict(t < 2 ? "Adding atoms…" : S[3]);
  }
  function mount(){ L.presets([["h2o", "Example 9.4: H₂O"], ["co2", "Example 9.5: CO₂"], ["na2o", "Example 9.6: Na₂O"], ["cano32", "Example 9.7: Ca(NO₃)₂"], ["hno3", "HNO₃"], ["mgoh2", "Mg(OH)₂"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.massCalc = {mount: mount, draw: draw, select: select, state: st};
})();
