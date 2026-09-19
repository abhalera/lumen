// iesc108 labs: Journey Inside the Atom. Particle counts in scattering and colours are illustrative; atoms have no colour.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function clamp8(x, a, b){ return Math.max(a, Math.min(b, x)); }
var ELEM8 = [["H", "Hydrogen"], ["He", "Helium"], ["Li", "Lithium"], ["Be", "Beryllium"], ["B", "Boron"], ["C", "Carbon"], ["N", "Nitrogen"], ["O", "Oxygen"], ["F", "Fluorine"], ["Ne", "Neon"], ["Na", "Sodium"], ["Mg", "Magnesium"], ["Al", "Aluminium"], ["Si", "Silicon"], ["P", "Phosphorus"], ["S", "Sulfur"], ["Cl", "Chlorine"], ["Ar", "Argon"], ["K", "Potassium"], ["Ca", "Calcium"], ["Sc", "Scandium"], ["Ti", "Titanium"], ["V", "Vanadium"], ["Cr", "Chromium"], ["Mn", "Manganese"], ["Fe", "Iron"]];
function config8(e){ var out = [], caps = [2, 8, 8, 2], left = e; for(var i = 0; i < caps.length && left > 0; i++){ var k = Math.min(caps[i], left); out.push(k); left -= k; } return out; }
function valency8(e){ var c = config8(e), v = c[c.length - 1]; if(e === 2 || v === 8) return 0; return v <= 4 ? v : 8 - v; }
function nucleus8(L, cx, cy, p, n, r){
  var m = "", total = p + n, pi = 0, ni = 0;
  for(var i = 0; i < total; i++){
    var isP = (pi < p) && (ni >= n || pi * n <= ni * p), a = i * 2.39996, d = r * 1.05 * Math.sqrt(i);
    if(isP) pi++; else ni++;
    m += L.circle(cx + d * Math.cos(a), cy + d * Math.sin(a), r, isP ? "#ef4444" : "#94a3b8", ' stroke="#0f172a" stroke-width="1"');
  }
  return m;
}
function atom8(L, cx, cy, conf, radii, phase, col){
  var m = "";
  conf.forEach(function(k, s){
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radii[s] + '" fill="none" stroke="#475569" stroke-width="1.5"/>';
    for(var j = 0; j < k; j++){ var a = phase * (1 - s * 0.2) + j * 2 * Math.PI / k - Math.PI / 2; m += L.circle(cx + radii[s] * Math.cos(a), cy + radii[s] * Math.sin(a), 5, col || "#38bdf8"); }
  });
  return m;
}

// Lab 1 — Cathode rays and Thomson's model (Figs. 8.1–8.3, Pause and Ponder 1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "tube"};
  var GASES = ["iron cathode, air", "copper cathode, hydrogen", "aluminium cathode, neon"];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "tube" ? 3 : 2, step: 0.05, speed: 0.8});
    L.legend(id === "tube" || id === "field" ? [[C.vel, "cathode rays (electrons)"]] : [[C.danger, "positive charge"], [C.vel, "electrons"]]);
    L.watch({tube: "Fig. 8.1: a high voltage across a tube of gas at very low pressure. The cathode material and gas are changed every second.", field: "Charged plates are placed around the beam of cathode rays.", neutral: "Fig. 8.2: Thomson's atom, a sphere of positive charge with electrons spread through it (8 units of charge, illustrative).", unbalanced: "Pause and Ponder 1: a clay model whose positive charge (+6) is less than the beads' negative charge (−8)."}[id]);
    L.controls(""); L.restart(true);
  }
  function tube(m){ return m + L.rect(70, 90, 580, 110, "#0b1220", ' rx="50" stroke="#94a3b8" stroke-width="3"') + L.rect(108, 110, 10, 70, "#cbd5e1") + L.rect(600, 110, 10, 70, "#cbd5e1") + L.text(113, 228, "cathode (−)", {size: 13, color: C.text}) + L.text(605, 228, "anode (+)", {size: 13, color: C.text}); }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "tube"){
      m = tube(m);
      for(i = 0; i < 14; i++){ var ph = (t * 0.9 + i / 14) % 1; m += L.circle(125 + ph * 470, 145 + ((i * 37) % 21) - 10, 4, C.vel); }
      var g = GASES[Math.min(2, Math.floor(t))];
      m += L.text(360, 60, g, {size: 15, color: C.path, weight: 700});
      L.svg(m, "Cathode ray tube", 250);
      L.readout([["Rays travel", "cathode (−) → anode (+)", C.vel], ["Now using", g, C.path], ["Rays observed", "the same every time"]]);
      msg = t < 3 ? "Changing the cathode and gas…" : "<b>Fig. 8.1:</b> cathode rays travel from the cathode to the anode and behave the same for every cathode material and gas, so <b>electrons are in all atoms</b>.";
    } else if(st.preset === "field"){
      m = tube(m) + L.rect(300, 96, 160, 10, C.danger) + L.text(380, 84, "+ plate", {size: 13, color: C.danger}) + L.rect(300, 184, 160, 10, "#64748b") + L.text(380, 222, "− plate", {size: 13, color: C.muted});
      var path = function(x){ return x < 300 ? 145 : x < 460 ? 145 - 0.0012 * (x - 300) * (x - 300) : 145 - 30.7 - 0.384 * (x - 460); };
      var shown = clamp8(t, 0, 1);
      for(i = 0; i < 16; i++){ var q = (t * 0.9 + i / 16) % 1; if(q > shown && t < 1) continue; var x = 125 + q * 470; m += L.circle(x, path(x), 4, C.vel); }
      L.svg(m, "Cathode rays between charged plates", 250);
      L.readout([["Rays bend towards", "the + plate", C.vel], ["So their charge is", "negative"]]);
      msg = t < 2 ? "Switching on the plates…" : "The rays bend towards the <b>positive plate</b>, so they are streams of negatively charged particles.";
    } else {
      var pos = st.preset === "neutral" ? 8 : 6, neg = 8, shownE = Math.round(clamp8(t, 0, 1) * neg), net = pos - shownE;
      m += L.circle(260, 145, 100, "#fecaca", ' stroke="#ef4444" stroke-width="3" opacity="0.9"') + L.text(260, 60, "+" + pos + " (positive sphere)", {size: 14, color: C.danger, weight: 700});
      var spots = [[210, 100], [300, 110], [240, 150], [310, 170], [200, 180], [270, 205], [335, 130], [185, 135]];
      for(i = 0; i < shownE; i++) m += L.circle(spots[i][0], spots[i][1], 9, "#1d4ed8") + L.text(spots[i][0], spots[i][1] + 4, "−", {size: 12, color: "#fff", weight: 700});
      m += L.text(520, 120, "positive: +" + pos, {size: 16, color: C.danger, weight: 700}) + L.text(520, 150, "negative: −" + shownE, {size: 16, color: C.vel, weight: 700}) + L.text(520, 190, "net charge: " + (net > 0 ? "+" + net : net < 0 ? "−" + (-net) : "0"), {size: 18, color: C.text, weight: 700});
      L.svg(m, "Thomson model atom", 260);
      L.readout([["Positive charge", "+" + pos, C.danger], ["Negative charge", "−" + shownE, C.vel], ["Net charge", net > 0 ? "+" + net : net < 0 ? "−" + (-net) : "0"]]);
      msg = t < 2 ? "Adding electrons…" : st.preset === "neutral" ? "<b>Fig. 8.2:</b> +8 and −8 balance, so the total charge is 0: <b>a neutral atom</b>." : "<b>Pause and Ponder 1:</b> positive +6 and negative −8 give a net charge of <b>−2</b>, so the model is <b>not a neutral atom</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["tube", "Fig. 8.1: cathode ray tube"], ["field", "Rays in an electric field"], ["neutral", "Fig. 8.2: Thomson's atom"], ["unbalanced", "Pause and Ponder 1: unbalanced model"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.cathode = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Gold foil experiment (Figs. 8.4–8.6)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "rutherford"};
  function beams(kind){
    var out = [];
    for(var i = 0; i < 24; i++){
      var y = 40 + i * 9.5, type = "s", ang = 0;
      if(kind === "thomson"){ ang = ((i % 5) - 2) * 1.2; }
      else if(kind === "rutherford"){ if(i === 11) type = "b"; else if(i === 5 || i === 17){ type = "d"; ang = i === 5 ? -55 : 70; } else if(i === 20){ type = "d"; ang = 35; } }
      else { if(i === 4 || i === 11 || i === 19){ type = "b"; } else if([2, 7, 9, 14, 16, 21, 23].indexOf(i) >= 0){ type = "d"; ang = (i % 2 ? 1 : -1) * (30 + (i * 13) % 60); } }
      out.push({y: y, type: type, ang: ang, delay: (i % 6) * 0.1});
    }
    return out;
  }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "collapse" ? 3 : 2, step: 0.05, speed: 0.6});
    L.legend(id === "collapse" ? [[C.vel, "electron's path"], [C.danger, "nucleus"]] : [[C.path, "α-particles"], [C.danger, "positive charge"]]);
    L.watch({thomson: "Thomson's prediction: positive charge spread evenly through each gold atom.", rutherford: "Fig. 8.4: what Geiger and Marsden actually saw with a very thin gold foil (counts illustrative).", thick: "Think as a Scientist: the same beam aimed at a thicker foil (counts illustrative).", collapse: "Fig. 8.6: Rutherford's model predicts that an orbiting electron loses energy and spirals inwards."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "collapse"){
      var pts = [], cx = 360, cy = 150;
      for(var s = 0; s <= t + 1e-9; s += 0.02){ var r = 120 * (1 - s / 3), a = 2 * Math.PI * s * (1 + s * 0.8); pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
      var rr = 120 * (1 - clamp8(t, 0, 3) / 3), aa = 2 * Math.PI * t * (1 + t * 0.8);
      m += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + C.vel + '" stroke-width="2" opacity="0.7"/>' + L.circle(cx, cy, 8, C.danger) + L.circle(cx + rr * Math.cos(aa), cy + rr * Math.sin(aa), 6, "#e0f2fe");
      L.svg(m, "Electron spiralling into the nucleus", 300);
      L.readout([["Distance from nucleus", Math.round(rr / 1.2) + "% of start", C.vel], ["Energy", t < 3 ? "being lost" : "gone: atom collapsed", C.danger]]);
      msg = t < 3 ? "Losing energy…" : "<b>Fig. 8.6:</b> an accelerating electron would lose energy and <b>spiral into the nucleus</b>. Real atoms are stable, so Rutherford's model needed changing.";
    } else {
      var kind = st.preset, B = beams(kind), FX = 360, counts = {s: 0, d: 0, b: 0};
      if(kind === "thomson"){ for(var k = 0; k < 6; k++) m += L.circle(FX, 30 + k * 48, 24, "#fecaca", ' opacity="0.35"'); m += L.rect(FX - 2, 10, 4, 280, "#fbbf24"); }
      else { var w = kind === "thick" ? 40 : 4; m += L.rect(FX - w / 2, 10, w, 280, "#fbbf24", ' opacity="0.8"'); for(var j = 0; j < 12; j++) for(var c = 0; c < (kind === "thick" ? 4 : 1); c++) m += L.circle(FX - w / 2 + 2 + c * 12 + (kind === "thick" ? 4 : 0), 22 + j * 23, 2, C.danger); }
      m += L.rect(10, 120, 40, 60, "#475569", ' rx="4"') + L.text(30, 205, "α source", {size: 12, color: C.muted});
      B.forEach(function(p){
        counts[p.type]++;
        var u = t - p.delay, x0 = 50, speed = 520, reach = (FX - x0) / speed, x, y;
        if(u <= 0) return;
        if(u < reach){ x = x0 + u * speed; y = 150 + (p.y - 150) * (u / reach); }
        else {
          var d = (u - reach) * speed, ang = p.type === "b" ? 180 - p.ang : p.ang, rad = ang * Math.PI / 180;
          x = FX + d * Math.cos(rad); y = p.y + d * Math.sin(rad);
        }
        var col = p.type === "b" ? C.danger : p.type === "d" ? C.acc : C.path;
        m += '<polyline points="' + x0 + ',150 ' + (u < reach ? "" : FX + ',' + p.y.toFixed(1) + ' ') + x.toFixed(1) + ',' + y.toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="1.2" opacity="0.45"/>';
        if(x >= 0 && x <= 720 && y >= 0 && y <= 300) m += L.circle(x, y, 3.5, col);
      });
      L.svg(m, "Alpha particles and gold foil", 300);
      var done = t >= 2;
      L.readout([["Passed straight through", done ? String(counts.s) : "…", C.path], ["Deflected", done ? String(counts.d) : "…", C.acc], ["Bounced back", done ? String(counts.b) : "…", C.danger], ["Size of atom : nucleus", "10⁻¹⁰ m : 10⁻¹⁵ m = 100000 : 1"]]);
      msg = !done ? "Firing α-particles…" : kind === "thomson" ? "<b>Thomson's prediction:</b> with the positive charge spread out, every α-particle passes straight through or is deflected only slightly." : kind === "rutherford" ? "<b>Fig. 8.4:</b> most α-particles passed straight through (empty space), some were deflected sharply and a few bounced back: positive charge and mass are packed into a <b>tiny nucleus</b>." : "<b>Thicker foil:</b> more nuclei lie in the way, so <b>more particles are deflected</b> or bounced back, and fewer pass straight through.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["thomson", "Thomson's prediction"], ["rutherford", "Fig. 8.4: the real result"], ["thick", "Thicker foil"], ["collapse", "Fig. 8.6: collapse problem"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.goldFoil = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Bohr's model (Fig. 8.7)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "shells"};
  var R = [40, 70, 100, 130], LEV = [260, 180, 130, 100], NAMES = ["K", "L", "M", "N"];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "stable" ? 3 : 2, step: 0.05, speed: 0.6});
    L.legend([[C.vel, "electron"], [C.path, "energy level"]]);
    L.watch({shells: "Fig. 8.7: the K, L, M and N shells (n = 1 to 4) and their energy levels.", absorb: "An electron in the L-shell absorbs a fixed amount of energy.", emit: "An electron in the M-shell drops back to the L-shell.", stable: "An electron moving in the K-shell (a stationary state)."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, cx = 200, cy = 150, s;
    m += L.circle(cx, cy, 10, C.danger);
    R.forEach(function(r, i){ m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#475569" stroke-width="1.5"/>' + L.text(cx + r * 0.72 + 6, cy - r * 0.72 - 2, NAMES[i], {size: 12, color: C.muted}); });
    LEV.forEach(function(y, i){ m += L.line(470, y, 650, y, C.path, 2) + L.text(660, y + 4, NAMES[i] + " (n = " + (i + 1) + ")", {size: 12, color: C.text, anchor: "start"}); });
    m += L.arrow(440, 270, 440, 90, C.faint, 2) + L.text(430, 180, "energy", {size: 12, color: C.muted, anchor: "end"});
    if(st.preset === "shells"){
      R.forEach(function(r, i){ var a = t * (3 - i * 0.5) + i; m += L.circle(cx + r * Math.cos(a), cy + r * Math.sin(a), 6, C.vel) + L.circle(560 - 30 + i * 20, LEV[i], 5, C.vel); });
      L.svg(m, "Bohr shells", 300);
      L.readout([["K", "n = 1, closest, least energy"], ["L", "n = 2"], ["M", "n = 3"], ["N", "n = 4, farthest, most energy"]]);
      msg = t < 2 ? "Electrons in their shells…" : "<b>Fig. 8.7:</b> shells K, L, M, N are n = 1, 2, 3, 4, and the <b>farther the shell, the higher its energy</b>.";
    } else if(st.preset === "absorb" || st.preset === "emit"){
      var up = st.preset === "absorb", from = up ? 1 : 2, to = up ? 2 : 1, f = clamp8((t - 1) / 0.25, 0, 1);
      s = from + (to - from) * f;
      var r0 = R[1] + (R[2] - R[1]) * (s - 1), a0 = t * 2.5, ly = LEV[1] + (LEV[2] - LEV[1]) * (s - 1);
      m += L.circle(cx + r0 * Math.cos(a0), cy + r0 * Math.sin(a0), 7, C.vel) + L.circle(560, ly, 7, C.vel);
      if(t > 0.6 && t < 1.25){ var wx = up ? 380 - (t - 0.6) * 250 : 330 + (t - 1) * 300, wave = ""; for(var k = 0; k <= 20; k++) wave += (k ? " L" : "M") + (wx + k * 3) + " " + (40 + 6 * Math.sin(k * 1.2)); m += '<path d="' + wave + '" fill="none" stroke="#facc15" stroke-width="3"/>'; }
      m += L.text(560, 60, up ? "absorbs E(M) − E(L)" : "releases E(M) − E(L)", {size: 14, color: "#facc15", weight: 700});
      L.svg(m, up ? "Electron absorbing energy" : "Electron releasing energy", 300);
      L.readout([["Shell", t < 1 ? NAMES[from] : f < 1 ? "jumping (never in between)" : NAMES[to], C.vel], ["Energy", up ? "absorbed: E(M) − E(L)" : "released: E(M) − E(L)", C.path]]);
      msg = t < 2 ? "Watch the electron…" : up ? "The electron <b>absorbs</b> exactly E(M) − E(L) to move from L to M; it cannot stop between shells." : "Dropping from M to L, the electron <b>releases</b> exactly the same fixed amount E(M) − E(L).";
    } else {
      var a = t * 4;
      m += L.circle(cx + R[0] * Math.cos(a), cy + R[0] * Math.sin(a), 7, C.vel) + L.circle(560, LEV[0], 7, C.vel);
      L.svg(m, "Electron in a stationary state", 300);
      L.readout([["Shell", "K (n = 1)", C.vel], ["Energy of the electron", "constant", C.path], ["Distance from nucleus", "unchanged"]]);
      msg = t < 3 ? "Orbiting…" : "In a stationary state the electron's <b>energy stays constant</b>, so it does not spiral into the nucleus: the atom is stable.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["shells", "Fig. 8.7: shells and energy levels"], ["absorb", "L → M: absorbing energy"], ["emit", "M → L: releasing energy"], ["stable", "A stationary state"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.bohr = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — The neutron and symbols (Section 8.3, Table 8.1, Tables 8.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "puzzle"};
  var SYMS = [["Copper", "cuprum", "Cu"], ["Gold", "aurum", "Au"], ["Potassium", "kalium", "K"], ["Silver", "argentum", "Ag"], ["Iron", "ferrum", "Fe"], ["Sodium", "natrium", "Na"], ["Lead", "plumbum", "Pb"], ["Mercury", "hydrargyros", "Hg"], ["Tungsten", "wolfram", "W"]];
  var HEAVY = [["Carbon", 6, 6], ["Oxygen", 8, 8], ["Iron", 26, 30], ["Uranium", 92, 146]];
  function select(id){
    st.preset = id; L.markPreset(id);
    var cfg = {puzzle: [2, 0.05, 0.6], particles: [1, 0.02, 0.4], heavy: [3, 1, 0.8], symbols: [9, 1, 1.5]}[id];
    L.timeline({maxT: cfg[0], step: cfg[1], speed: cfg[2]});
    L.legend(id === "symbols" ? [[C.path, "symbol"]] : id === "particles" ? [[C.vel, "electron"], [C.danger, "proton"], [C.muted, "neutron"]] : [[C.danger, "protons"], [C.muted, "neutrons"]]);
    L.watch({puzzle: "Hydrogen has 1 proton; helium has 2 protons but about 4 times the mass (mass of a proton ≈ a neutron ≈ 1 unit).", particles: "Table 8.1: an electron, a proton and a neutron pass between charged plates.", heavy: "Section 8.3.1: protons and neutrons in carbon, oxygen, iron and uranium.", symbols: "Table 8.2: symbols that come from Latin, Greek or German names."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "puzzle"){
      var showN = t >= 1;
      m += nucleus8(L, 170, 130, 1, 0, 12) + L.text(170, 210, "Hydrogen: 1 proton", {size: 14, color: C.text});
      m += nucleus8(L, 470, 130, 2, showN ? 2 : 0, 12) + L.text(470, 210, "Helium: 2 protons" + (showN ? " + 2 neutrons" : ""), {size: 14, color: C.text});
      m += L.text(470, 250, showN ? "mass ≈ 4 units ✓" : "mass from protons: 2 units, but measured ≈ 4", {size: 13, color: showN ? C.ok : C.danger, weight: 700});
      L.svg(m, "Hydrogen and helium nuclei", 280);
      L.readout([["Hydrogen mass", "1 unit"], ["Helium protons", "2 units of mass", C.danger], ["Helium measured mass", "≈ 4 units"], ["Missing mass", showN ? "2 neutrons" : "?", C.muted]]);
      msg = t < 2 ? "Solving the puzzle…" : "Helium's 2 protons give only 2 units of mass; <b>2 neutrons</b> supply the other 2 (Chadwick, 1932).";
    } else if(st.preset === "particles"){
      var f = clamp8(t, 0, 1), x = 60 + f * 600;
      m += L.rect(260, 40, 200, 10, C.danger) + L.text(360, 32, "+ plate", {size: 12, color: C.danger}) + L.rect(260, 250, 200, 10, "#64748b") + L.text(360, 280, "− plate", {size: 12, color: C.muted});
      var bend = function(k){ var xx = x; if(xx < 260) return 0; var d = Math.min(xx, 460) - 260; var extra = xx > 460 ? (xx - 460) * 2 * d / 200 : 0; return k * (d * d / 400 + extra); };
      m += L.circle(x, 110 - bend(0.45), 6, C.vel) + L.text(40, 114, "e⁻ (−1)", {size: 12, color: C.vel, anchor: "start"});
      m += L.circle(x, 150, 9, "#94a3b8") + L.text(40, 154, "n⁰ (0)", {size: 12, color: C.muted, anchor: "start"});
      m += L.circle(x, 190 + bend(0.12), 9, "#ef4444") + L.text(40, 194, "p⁺ (+1)", {size: 12, color: C.danger, anchor: "start"});
      L.svg(m, "Subatomic particles between charged plates", 300);
      L.readout([["Electron e⁻", "charge −1, bends to + plate (mass negligible)", C.vel], ["Proton p⁺", "charge +1, bends to − plate", C.danger], ["Neutron n⁰", "charge 0, goes straight (mass ≈ proton)", C.muted]]);
      msg = t < 1 ? "Passing the plates…" : "<b>Table 8.1:</b> electron −1, proton +1, <b>neutron 0</b>: only the neutron is not pushed or pulled by the charged plates.";
    } else if(st.preset === "heavy"){
      var shown = Math.floor(t + 1e-9), X = function(v){ return 150 + v * 2.2; };
      HEAVY.forEach(function(h, i){
        if(i > shown) return;
        var y = 50 + i * 60;
        m += L.text(140, y + 16, h[0], {size: 13, color: C.text, anchor: "end"}) + L.rect(X(0), y, h[1] * 2.2, 11, "#ef4444") + L.rect(X(0), y + 13, h[2] * 2.2, 11, "#94a3b8");
        m += L.text(X(h[1]) + 6, y + 10, h[1] + " p", {size: 11, color: C.danger, anchor: "start"}) + L.text(X(h[2]) + 6, y + 23, h[2] + " n", {size: 11, color: C.muted, anchor: "start"});
      });
      L.svg(m, "Protons and neutrons in nuclei", 290);
      L.readout(HEAVY.filter(function(h, i){ return i <= shown; }).map(function(h){ return [h[0], h[1] + " protons, " + h[2] + " neutrons"]; }));
      msg = t < 3 ? "Heavier nuclei…" : "Light nuclei have about equal numbers of protons and neutrons; heavy nuclei need many more neutrons: <b>uranium 92 and 146</b>.";
    } else {
      var k = Math.floor(t + 1e-9);
      SYMS.forEach(function(s, i){
        var cxs = 130 + (i % 3) * 230, cys = 50 + Math.floor(i / 3) * 90, open = i < k;
        m += L.rect(cxs - 100, cys - 30, 200, 70, "#1e293b", ' rx="8" stroke="' + (open ? C.path : "#475569") + '"') + L.text(cxs - 88, cys - 8, s[0], {size: 13, color: C.text, anchor: "start"}) + L.text(cxs - 88, cys + 12, "(" + s[1] + ")", {size: 12, color: C.muted, anchor: "start"}) + L.text(cxs + 70, cys + 12, open ? s[2] : "?", {size: 26, color: C.path, weight: 700});
      });
      L.svg(m, "Element symbols from other languages", 300);
      L.readout([["Rule 1", "capital first letter"], ["Rule 2", "small second letter: Co, not CO"], ["Symbols revealed", k + " of 9", C.path]]);
      msg = t < 9 ? "Revealing symbols…" : "These symbols come from Latin, Greek or German names: Fe (ferrum), Hg (hydrargyros) and <b>W for tungsten</b> (wolfram).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["puzzle", "The helium mass puzzle"], ["particles", "Table 8.1: three particles"], ["heavy", "Neutrons in heavier nuclei"], ["symbols", "Table 8.2: Latin names"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.neutronSymbols = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Atom builder: atomic number and mass number (Figs. 8.10, Table 8.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "li", p: 6, n: 6, e: 6};
  var PRE = {li: [3, 4, 3], c12: [6, 6, 6], fe: [26, 30, 26]};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 1, step: 0.05, speed: 0.5});
    L.legend([[C.danger, "protons"], [C.muted, "neutrons"], [C.vel, "electrons"]]);
    L.watch({li: "Fig. 8.10: a lithium atom.", c12: "Carbon with atomic number 6 and mass number 12.", fe: "Pause and Ponder 10: an atom with atomic number 26 and 56 nucleons.", build: "Build your own atom (up to 20 protons). Electrons are placed in shells K, L, M, N."}[id]);
    if(id === "build"){
      L.controls(L.slider("ab-p", "Protons", 1, 20, 1, st.p, String(st.p)) + L.slider("ab-n", "Neutrons", 0, 24, 1, st.n, String(st.n)) + L.slider("ab-e", "Electrons", 0, 20, 1, st.e, String(st.e)));
      ["p", "n", "e"].forEach(function(k){ L.onInput("ab-" + k, function(v){ st[k] = v; L.setVal("ab-" + k, String(v)); App.resetTimeline(); App.play(); }); });
    } else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var v = st.preset === "build" ? [st.p, st.n, st.e] : PRE[st.preset], p = v[0], n = v[1], e = v[2], f = clamp8(t, 0, 1);
    var pp = Math.round(p * f), nn = Math.round(n * f), ee = Math.round(e * f), el = ELEM8[p - 1], A = p + n, charge = p - e, m = "", msg;
    m += nucleus8(L, 190, 150, pp, nn, p + n > 30 ? 5 : 8);
    if(e <= 20) m += atom8(L, 190, 150, config8(ee), [62, 88, 112, 134], t * 2);
    else m += L.text(190, 285, ee + " electrons around the nucleus", {size: 13, color: C.vel});
    m += L.text(520, 150, el[0], {size: 64, color: C.text, weight: 700}) + L.text(470, 112, String(A), {size: 22, color: C.path, anchor: "end", weight: 700}) + L.text(470, 172, String(p), {size: 22, color: C.danger, anchor: "end", weight: 700}) + L.text(520, 210, el[1], {size: 16, color: C.muted});
    L.svg(m, "Atom with " + p + " protons, " + n + " neutrons and " + e + " electrons", 300);
    L.readout([["Atomic number Z = protons", String(p), C.danger], ["Neutrons", String(n), C.muted], ["Mass number A = p + n", p + " + " + n + " = " + A, C.path], ["Electrons", String(e), C.vel], ["Overall charge", charge === 0 ? "0 (neutral)" : (charge > 0 ? "+" : "−") + Math.abs(charge)]]);
    if(t < 1) msg = "Adding particles…";
    else if(st.preset === "li") msg = "<b>Fig. 8.10:</b> lithium has 3 protons and 4 neutrons: atomic number <b>Z = 3</b> and mass number A = 7.";
    else if(st.preset === "c12") msg = "<b>Carbon-12:</b> Z = 6 and A = 12; neutrons = 12 − 6 = <b>6</b>.";
    else if(st.preset === "fe") msg = "<b>Pause and Ponder 10:</b> Z = 26 and 56 nucleons give 26 protons, 26 electrons and <b>30 neutrons</b> (iron).";
    else msg = "<b>" + el[1] + "</b>: Z = " + p + ", A = " + A + ". " + (charge === 0 ? "Electrons equal protons, so the atom is neutral." : "Electrons do not equal protons, so this particle is not neutral (charge " + (charge > 0 ? "+" : "−") + Math.abs(charge) + ").");
    L.verdict(msg);
  }
  function mount(){ L.presets([["li", "Fig. 8.10: lithium"], ["c12", "Carbon-12"], ["fe", "Pause and Ponder 10"], ["build", "Build an atom"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.atomBuilder = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Electron shells and valency (Fig. 8.11, Table 8.4, Section 8.8)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "steps"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "steps" ? {maxT: 17, step: 1, speed: 1.5, format: function(t){ return "Z = <b>" + (1 + Math.floor(t + 1e-9)) + "</b>"; }} : {maxT: 2, step: 0.05, speed: 0.6});
    L.legend([[C.vel, "electrons"], [C.path, "valence shell"]]);
    L.watch({steps: "Fig. 8.11 and Table 8.4: add one proton and one electron at a time, from hydrogen to argon.", na: "Sodium, 2, 8, 1.", o: "Oxygen, 2, 6.", c: "Carbon, 2, 4, sharing electrons with four hydrogen atoms (as in methane).", ar: "Argon, 2, 8, 8."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, Z = st.preset === "steps" ? 1 + Math.floor(t + 1e-9) : {na: 11, o: 8, c: 6, ar: 18}[st.preset], conf = config8(Z).slice(), R = [45, 80, 115], cx = 220, cy = 150, f = clamp8(t - 1, 0, 1);
    var el = ELEM8[Z - 1], v = conf[conf.length - 1], val = valency8(Z);
    m += L.circle(cx, cy, 24, "#7f1d1d") + L.text(cx, cy + 6, el[0], {size: 16, color: "#fff", weight: 700});
    var shown = conf.slice();
    if(st.preset === "na") shown[2] = 0;
    m += atom8(L, cx, cy, shown, R, st.preset === "steps" ? 0 : t * 1.5);
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R[conf.length - 1] + '" fill="none" stroke="' + C.path + '" stroke-width="2.5" stroke-dasharray="6 5"/>';
    if(st.preset === "na") m += L.circle(cx + 115 + f * 260, cy, 6, C.vel) + (f > 0.5 ? L.text(cx + 240, cy - 20, "1 electron lost", {size: 13, color: C.vel}) : "");
    if(st.preset === "o") for(var i = 0; i < 2; i++) m += L.circle(cx + (i ? -1 : 1) * (80 + (1 - f) * 260) * (i ? 1 : 1), cy + (i ? 60 : -60) * (1 - f) + (f >= 1 ? (i ? 30 : -30) : 0), 6, "#facc15");
    if(st.preset === "c") [0, 1, 2, 3].forEach(function(k){ var a = k * Math.PI / 2 + Math.PI / 4, d = 80 + 12 + (1 - f) * 120; m += L.circle(cx + d * Math.cos(a), cy + d * Math.sin(a), 16, "#334155", ' stroke="#94a3b8"') + L.text(cx + d * Math.cos(a), cy + d * Math.sin(a) + 5, "H", {size: 13, color: C.text}); });
    var cfgText = (st.preset === "o" && f >= 1 ? [2, 8] : st.preset === "na" && f >= 1 ? [2, 8] : conf).join(", ");
    m += L.text(560, 90, el[1], {size: 22, color: C.text, weight: 700}) + L.text(560, 130, "Z = " + Z, {size: 16, color: C.muted}) + L.text(560, 170, conf.join(", "), {size: 24, color: C.vel, weight: 700, mono: true}) + L.text(560, 210, "valency " + val, {size: 18, color: C.path, weight: 700});
    L.svg(m, el[1] + " electron shells", 300);
    L.readout([["Element", el[1] + " (" + el[0] + ")"], ["Configuration", conf.join(", "), C.vel], ["Valence electrons", String(v), C.path], ["Valency", String(val), C.path]]);
    if(st.preset === "steps") msg = t < 17 ? el[1] + ": " + conf.join(", ") + ". K fills first (2), then L (8), then M." : "Electrons fill K (2), then L (8), then M: argon ends with <b>2, 8, 8</b>, a complete octet.";
    else if(t < 2) msg = "Watch the valence shell…";
    else msg = {na: "Sodium (2, 8, 1) <b>loses 1 electron</b> to be left with a complete octet (now " + cfgText + "): valency 1.", o: "Oxygen (2, 6) <b>gains 2 electrons</b> to complete its octet: valency 2.", c: "Carbon (2, 4) cannot easily lose or gain four electrons, so it <b>shares 4 electrons</b>: valency 4.", ar: "Argon (2, 8, 8) already has an octet: <b>valency 0</b>, and it is largely unreactive."}[st.preset];
    L.verdict(msg);
  }
  function mount(){ L.presets([["steps", "Fig. 8.11: hydrogen to argon"], ["na", "Sodium loses"], ["o", "Oxygen gains"], ["c", "Carbon shares"], ["ar", "Argon: octet"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.shells = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Isotopes, average atomic mass and isobars (Section 8.9)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "hydrogen"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "chlorine" ? 2 : 1, step: 0.02, speed: id === "chlorine" ? 0.5 : 0.6});
    L.legend(id === "chlorine" || id === "bromine" ? [[C.vel, "lighter isotope"], [C.path, "heavier isotope"]] : [[C.danger, "protons"], [C.muted, "neutrons"]]);
    L.watch({hydrogen: "Fig. 8.12: protium, deuterium and tritium.", carbon: "Fig. 8.13: carbon-12, carbon-13 and carbon-14.", chlorine: "Section 8.9.1 A: 100 chlorine atoms, 3 of chlorine-35 for every 1 of chlorine-37.", bromine: "Pause and Ponder 18: bromine-79 (49.7%) and bromine-81 (50.3%).", isobars: "Section 8.9.2: argon, potassium and calcium, each with mass number 40."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, f = clamp8(t, 0, 1);
    if(st.preset === "hydrogen" || st.preset === "carbon"){
      var H = st.preset === "hydrogen", p = H ? 1 : 6, names = H ? ["Protium", "Deuterium", "Tritium"] : ["Carbon-12", "Carbon-13", "Carbon-14"], ns = H ? [0, 1, 2] : [6, 7, 8];
      names.forEach(function(nm, i){
        var cx = 130 + i * 230;
        m += nucleus8(L, cx, 120, p, Math.round(ns[i] * f), H ? 12 : 8) + '<circle cx="' + cx + '" cy="120" r="' + (H ? 60 : 70) + '" fill="none" stroke="#475569"/>';
        m += L.text(cx, 225, nm, {size: 15, color: C.text, weight: 700}) + L.text(cx, 247, p + " p, " + ns[i] + " n, " + p + " e", {size: 13, color: C.muted}) + L.text(cx, 270, "A = " + (p + ns[i]), {size: 14, color: C.path, weight: 700});
      });
      L.svg(m, H ? "Isotopes of hydrogen" : "Isotopes of carbon", 290);
      L.readout(names.map(function(nm, i){ return [nm, "Z = " + p + ", A = " + (p + ns[i]) + ", " + ns[i] + " neutrons", i ? C.path : C.vel]; }));
      msg = t < 1 ? "Adding neutrons…" : H ? "All three have <b>1 proton and 1 electron</b>; only the neutrons differ, giving A = 1, 2 and 3. So their chemical properties are similar." : "Each carbon isotope has 6 protons and 6 electrons, with <b>6, 7 or 8 neutrons</b> (A = 12, 13, 14).";
    } else if(st.preset === "chlorine"){
      var k = Math.round(clamp8(t, 0, 1) * 100), n37 = 0;
      for(var i = 0; i < 100; i++){
        var heavy = i % 4 === 3, x = 40 + (i % 10) * 26, y = 30 + Math.floor(i / 10) * 25;
        if(i < k){ if(heavy) n37++; m += L.circle(x, y, heavy ? 10 : 9, heavy ? C.path : C.vel); }
        else m += L.circle(x, y, 9, "#1e293b");
      }
      var n35 = k - n37, avg = k ? (35 * n35 + 37 * n37) / k : 0;
      m += L.text(330, 60, "Cl-35: " + n35, {size: 16, color: C.vel, weight: 700, anchor: "start"}) + L.text(330, 90, "Cl-37: " + n37, {size: 16, color: C.path, weight: 700, anchor: "start"});
      m += L.text(330, 150, "Simple average (35 + 37) ÷ 2 = 36 u", {size: 14, color: C.muted, anchor: "start"}) + L.text(330, 190, "Weighted average so far: " + (k ? avg.toFixed(2) : "–") + " u", {size: 16, color: C.text, weight: 700, anchor: "start"});
      L.svg(m, "One hundred chlorine atoms", 290);
      L.readout([["Atoms counted", String(k)], ["Chlorine-35 (35 u)", String(n35), C.vel], ["Chlorine-37 (37 u)", String(n37), C.path], ["Weighted average", k ? avg.toFixed(2) + " u" : "–"]]);
      msg = t < 2 ? "Counting atoms…" : "75 atoms of chlorine-35 and 25 of chlorine-37: 35 × 75/100 + 37 × 25/100 = <b>35.5 u</b>, not the simple mean of 36 u.";
    } else if(st.preset === "bromine"){
      m += L.rect(60, 80, 600 * 0.497 * f, 50, C.vel) + L.rect(60 + 600 * 0.497 * f, 80, 600 * 0.503 * f, 50, C.path) + L.rect(60, 80, 600, 50, "none", ' stroke="#475569"');
      m += L.text(60 + 300 * 0.497, 112, "Br-79: 49.7%", {size: 14, color: "#fff", weight: 700}) + L.text(60 + 600 * 0.497 + 300 * 0.503, 112, "Br-81: 50.3%", {size: 14, color: "#fff", weight: 700});
      var part1 = 79 * 0.497 * f, part2 = 81 * 0.503 * f;
      m += L.text(360, 190, "79 × 0.497 = " + part1.toFixed(3) + "   +   81 × 0.503 = " + part2.toFixed(3), {size: 15, color: C.text}) + L.text(360, 235, "Average = " + (part1 + part2).toFixed(1) + " u", {size: 22, color: C.path, weight: 700});
      L.svg(m, "Bromine isotopes", 270);
      L.readout([["Bromine-79 part", part1.toFixed(3) + " u", C.vel], ["Bromine-81 part", part2.toFixed(3) + " u", C.path], ["Average atomic mass", (part1 + part2).toFixed(1) + " u"]]);
      msg = t < 1 ? "Weighting by abundance…" : "<b>Pause and Ponder 18:</b> 79 × 0.497 + 81 × 0.503 = 80.006, so the average atomic mass of bromine is about <b>80.0 u</b>.";
    } else {
      [["Argon", "Ar", 18, 22], ["Potassium", "K", 19, 21], ["Calcium", "Ca", 20, 20]].forEach(function(e, i){
        var y = 60 + i * 75, X = function(v){ return 160 + v * 11; };
        m += L.text(150, y + 20, e[0] + " (Z = " + e[2] + ")", {size: 13, color: C.text, anchor: "end"}) + L.rect(X(0), y, e[2] * 11 * f, 30, "#ef4444") + L.rect(X(e[2] * f), y, e[3] * 11 * f, 30, "#94a3b8");
        m += L.text(X(40) + 10, y + 20, f >= 1 ? "A = " + e[2] + " + " + e[3] + " = 40" : "", {size: 13, color: C.path, anchor: "start", weight: 700});
      });
      m += L.line(160 + 440, 45, 160 + 440, 270, C.path, 2);
      L.svg(m, "Isobars with mass number 40", 290);
      L.readout([["Argon", "18 p + 22 n", C.muted], ["Potassium", "19 p + 21 n", C.muted], ["Calcium", "20 p + 20 n", C.muted]]);
      msg = t < 1 ? "Building nuclei…" : "Different elements (Z = 18, 19, 20) with the same mass number, <b>A = 40</b>, are isobars.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["hydrogen", "Fig. 8.12: hydrogen"], ["carbon", "Fig. 8.13: carbon"], ["chlorine", "Chlorine: 35.5 u"], ["bromine", "Pause and Ponder 18: bromine"], ["isobars", "Isobars: A = 40"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.isotopes = {mount: mount, draw: draw, select: select, state: st};
})();
