// Class 9 Science, Chapter 2 (iesc102) — simulation labs.
// Textbook numbers are used where given; schematic values are labelled as illustrative.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

// Lab 1 — Size and microscope lab (Fig. 2.1, Activity 2.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "act21", field: 5, count: 25};
  var SIZES = [["human height", 1.7], ["chicken egg", 0.05], ["fish egg", 0.001], ["most plant & animal cells", 5e-5], ["nucleus", 6e-6],
    ["most bacteria", 2e-6], ["mitochondrion", 1e-6], ["smallest bacteria", 3e-7], ["viruses", 1e-7], ["ribosomes", 2.5e-8], ["proteins", 5e-9], ["atoms", 1e-10]];

  function select(id){
    st.preset = id; L.markPreset(id);
    if(id === "act21"){
      st.field = 5; st.count = 25;
      L.timeline({maxT: 25, step: 1, speed: 6, format: function(t){ return "counted <b>" + Math.round(Math.min(t, st.count)) + "</b> cells"; }});
      L.watch("Activity 2.1: a 5 mm field of view with 25 onion cells across it. Watch the count along the diameter, then read the estimated size.");
      L.controls(L.slider("s1-field", "Field of view diameter", 1, 8, 0.5, st.field, L.num(st.field, 1) + " mm") + L.slider("s1-count", "Cells along the diameter", 5, 50, 1, st.count, st.count + ""));
      L.onInput("s1-field", function(v){ st.field = v; L.setVal("s1-field", L.num(v, 1) + " mm"); App.seekTimeline(App.state.maxT); });
      L.onInput("s1-count", function(v){ st.count = v; L.setVal("s1-count", v + ""); L.timeline({maxT: v, step: 1, speed: 6}); App.seekTimeline(v); });
    } else if(id === "mag"){
      L.timeline({maxT: 4, step: 1, speed: 1});
      L.watch("A 200 µm onion cell seen with a 10X eyepiece and a 10X objective. Watch its apparent size grow.");
      L.controls("");
    } else {
      L.timeline({maxT: SIZES.length - 1, step: 1, speed: 1.2, format: function(t){ return "<b>" + SIZES[Math.round(t)][0] + "</b>"; }});
      L.watch("Fig. 2.1: zoom from a person down to atoms. Each rung is 10 times smaller. Which tool can see each object?");
      L.controls("");
    }
    L.legend([[C.vel, "light microscope range"], [C.acc, "electron microscope range"], ["#f8fafc", "unaided eye (down to 0.1 mm)"]]);
    L.restart(true);
  }

  function fmtLen(m){
    if(m >= 1) return L.num(m, 1) + " m";
    if(m >= 0.01) return L.num(m * 100, 0) + " cm";
    if(m >= 1e-3) return L.num(m * 1000, 0) + " mm";
    if(m >= 1e-6) return L.num(m * 1e6, 0) + " µm";
    return L.num(m * 1e9, m < 1e-9 ? 1 : 0) + " nm";
  }

  function draw(t){
    var m = "", msg;
    if(st.preset === "act21"){
      var n = Math.min(st.count, Math.round(t)), r = 120, cx = 220, cy = 150, w = 2 * r / st.count;
      m += L.circle(cx, cy, r, "#1f3b2c", ' stroke="#e2e8f0" stroke-width="3"');
      for(var i = 0; i < st.count; i++){
        var x = cx - r + i * w;
        m += L.rect(x + 1, cy - 14, w - 2, 28, i < n ? "rgba(52,211,153,0.55)" : "rgba(52,211,153,0.15)", ' rx="2" stroke="#34d399" stroke-width="1"');
      }
      m += L.line(cx - r, cy + 40, cx + r, cy + 40, C.path, 2) + L.text(cx, cy + 60, "field diameter " + L.num(st.field, 1) + " mm = " + L.num(st.field * 1000, 0) + " µm", {size: 13, color: C.path});
      var size = st.field * 1000 / st.count;
      m += L.text(470, 110, "cell size =", {size: 16, color: C.text, anchor: "start"});
      m += L.text(470, 140, L.num(st.field * 1000, 0) + " µm ÷ " + st.count, {size: 18, color: C.path, anchor: "start", weight: 700});
      m += L.text(470, 175, "= " + L.num(size, 0) + " µm", {size: 24, color: "#34d399", anchor: "start", weight: 700});
      L.svg(m, "Microscope field with " + st.count + " cells across; estimated size " + L.num(size, 0) + " micrometres.", 300);
      L.readout([["Cells counted", n + " of " + st.count], ["Field diameter", L.num(st.field * 1000, 0) + " µm"], ["Estimated cell size", t >= st.count - 1e-6 ? L.num(size, 0) + " µm" : "…", "#34d399"]]);
      msg = t <= 0 ? "Press <b>Play</b> to count cells along the diameter." : t < st.count - 1e-6 ? "Counting cells…" :
        (st.field === 5 && st.count === 25 ? "<b>Activity 2.1:</b> 5 mm = 5000 µm, and 5000 µm ÷ 25 = <b>200 µm</b> per onion cell." : "Estimated size = " + L.num(st.field * 1000, 0) + " µm ÷ " + st.count + " = <b>" + L.num(size, 0) + " µm</b>.");
    } else if(st.preset === "mag"){
      var steps = [1, 10, 100, 100, 100], k = Math.min(4, Math.floor(t + 1e-9)), mag = steps[Math.min(2, k)];
      var shown = 0.2 * mag;
      m += L.text(360, 40, k === 0 ? "real cell: 200 µm (0.2 mm)" : k === 1 ? "through the 10X objective" : "through 10X objective × 10X eyepiece = 100X", {size: 16, color: C.text, weight: 700});
      var px = Math.min(240, 2 + shown * 11);
      m += '<ellipse cx="360" cy="165" rx="' + px / 2 + '" ry="' + px / 3 + '" fill="rgba(52,211,153,0.35)" stroke="#34d399" stroke-width="2"/>';
      m += L.circle(360, 165, Math.max(2, px / 10), "#a78bfa");
      m += L.text(360, 280, "appears about " + L.num(shown, shown < 1 ? 1 : 0) + " mm across", {size: 15, color: C.path});
      L.svg(m, "Onion cell magnified " + mag + " times.", 300);
      L.readout([["Eyepiece", "10X"], ["Objective", "10X"], ["Total magnification", mag + "X", C.path], ["Apparent size", L.num(shown, 1) + " mm"]]);
      msg = t < 2 ? "Magnifying…" : "<b>Total magnification = 10X × 10X = 100X.</b> A 200 µm cell appears 100 times larger, about 20 mm across.";
    } else {
      var idx = Math.round(t), Y = function(v){ return 30 + (Math.log10(2) - Math.log10(v)) / (Math.log10(2) - Math.log10(5e-11)) * 250; };
      m += L.rect(250, Y(1e-4), 26, Y(2e-7) - Y(1e-4), "rgba(56,189,248,0.35)") + L.rect(284, Y(1e-5), 26, Y(5e-11) - Y(1e-5), "rgba(244,114,182,0.35)");
      m += L.rect(216, Y(2), 26, Y(1e-4) - Y(2), "rgba(248,250,252,0.25)");
      [1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10].forEach(function(v){ m += L.line(196, Y(v), 320, Y(v), C.grid, 1) + L.text(190, Y(v) + 4, fmtLen(v), {size: 11, color: C.muted, anchor: "end"}); });
      m += L.text(229, 22, "eye", {size: 11, color: "#f8fafc"}) + L.text(263, 22, "light", {size: 11, color: C.vel}) + L.text(297, 22, "electron", {size: 11, color: C.acc});
      SIZES.forEach(function(s, i){
        var on = i <= idx, y = Y(s[1]);
        m += L.circle(330, y, on ? 5 : 3, i === idx ? C.path : on ? "#f8fafc" : C.faint);
        if(on) m += L.line(335, y, 380, 30 + i * 21, i === idx ? C.path : C.faint, 1) + L.text(386, 34 + i * 21, s[0] + " ≈ " + fmtLen(s[1]), {size: 13, color: i === idx ? C.path : C.text, anchor: "start", weight: i === idx ? 700 : 400});
      });
      L.svg(m, SIZES[idx][0] + " is about " + fmtLen(SIZES[idx][1]) + ".", 300);
      var s = SIZES[idx][1], tool = s >= 1e-4 ? "unaided eye" : s >= 2e-7 ? "light microscope" : "electron microscope";
      L.readout([["Object", SIZES[idx][0]], ["Approximate size", fmtLen(s), C.path], ["Tool needed to see it", tool]]);
      msg = idx < SIZES.length - 1 ? "Zooming in…" : "<b>Fig. 2.1:</b> the unaided eye stops at about 0.1 mm; most plant and animal cells need a light microscope; ribosomes, viruses and molecules need an electron microscope. Sizes are typical values.";
    }
    L.verdict(msg);
  }

  function mount(){
    L.presets([["act21", "Activity 2.1: size of an onion cell"], ["mag", "Magnification 10X × 10X"], ["ladder", "Fig. 2.1: from a person to atoms"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.cellSize = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Osmosis: a cell in different solutions (Activity 2.2, Fig. 2.6)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "hypo"};
  var CFG = {hypo: {out: 0.2, name: "hypotonic (dilute: plain water)"}, iso: {out: 1, name: "isotonic (same concentration)"}, hyper: {out: 2, name: "hypertonic (concentrated: 20% salt)"}};
  function volumeAt(out, t){
    // Solute inside is fixed; water flows until inside concentration equals outside. Illustrative relative units.
    var target = Math.max(0.55, Math.min(1.35, 1 / out));
    return target + (1 - target) * Math.exp(-t / 2.2);
  }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 10, step: 1, speed: 1});
    L.legend([["#38bdf8", "water particles (can cross)"], [C.path, "solute particles (cannot cross)"], ["#f8fafc", "net water movement"]]);
    L.watch({hypo: "Like potato piece A in plain water: the outside has less solute than the cell.", iso: "The outside has the same solute concentration as the inside.", hyper: "Like potato piece B in 20 per cent salt solution: the outside is more concentrated than the cell."}[id]);
    L.controls("");
    L.restart(true);
  }
  function seeded(n, seed){ var a = [], s = seed; for(var i = 0; i < n; i++){ s = (s * 9301 + 49297) % 233280; var u = s / 233280; s = (s * 9301 + 49297) % 233280; a.push([u, s / 233280]); } return a; }
  var P_IN = seeded(14, 7), P_OUT = seeded(40, 3), W = seeded(60, 11);
  function draw(t){
    var c = CFG[st.preset], v = volumeAt(c.out, t), r = 85 * Math.sqrt(v), cx = 360, cy = 150, m = "";
    m += L.rect(40, 20, 640, 260, "rgba(56,189,248,0.07)", ' rx="12" stroke="#334155"');
    var nOut = Math.round(c.out * 20);
    P_OUT.slice(0, nOut).forEach(function(p){ var x = 60 + p[0] * 600, y = 35 + p[1] * 230; if(Math.hypot(x - cx, y - cy) > r + 10) m += L.circle(x, y, 4, C.path); });
    W.forEach(function(p, i){ var x = 55 + p[0] * 610, y = 30 + p[1] * 240; if(Math.abs(Math.hypot(x - cx, y - cy) - r) > 8 && i % 2 === 0) m += L.circle(x, y, 2.5, "#38bdf8"); });
    m += L.circle(cx, cy, r, "rgba(251,191,36,0.10)", ' stroke="#fbbf24" stroke-width="4" stroke-dasharray="10 4"');
    P_IN.forEach(function(p){ var a = p[0] * 6.283, d = Math.sqrt(p[1]) * (r - 12); m += L.circle(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 4, C.path); });
    var flow = st.preset === "hypo" ? 1 : st.preset === "hyper" ? -1 : 0, active = Math.abs(v - volumeAt(c.out, 1e9)) > 0.02;
    if(flow && active) [0, 1.57, 3.14, 4.71].forEach(function(a){
      var x1 = cx + Math.cos(a) * (r + 45), y1 = cy + Math.sin(a) * (r + 45), x2 = cx + Math.cos(a) * (r + 8), y2 = cy + Math.sin(a) * (r + 8);
      m += flow > 0 ? L.arrow(x1, y1, x2, y2, "#f8fafc", 3) : L.arrow(x2, y2, x1, y1, "#f8fafc", 3);
    });
    m += L.text(cx, 300 - 8, "cell membrane: selectively permeable", {size: 12, color: "#fbbf24"});
    L.svg(m, "Cell in " + c.name + " solution; relative volume " + L.num(v * 100, 0) + " percent.", 300);
    var net = !active ? "no net movement" : flow > 0 ? "into the cell" : flow < 0 ? "out of the cell" : "no net movement";
    L.readout([["Surrounding solution", c.name], ["Net water movement", net, "#38bdf8"], ["Cell size (relative)", L.num(v * 100, 0) + " %", "#fbbf24"]]);
    L.verdict(t <= 0 ? "Press <b>Play</b>." : t < 9.9 ? "Water particles cross the membrane in both directions; watch the net movement." :
      st.preset === "hypo" ? "<b>Hypotonic:</b> more water outside, so water moves <b>into</b> the cell by osmosis and it <b>swells</b>, like potato piece A. (Animal cells in pure water can even burst.)" :
      st.preset === "hyper" ? "<b>Hypertonic:</b> the outside is more concentrated, so water moves <b>out</b> and the cell <b>shrinks</b>, like potato piece B. The salt cannot cross the membrane." :
      "<b>Isotonic:</b> the concentrations are equal, so water moves in and out equally and the cell stays the same size.");
  }
  function mount(){
    L.presets([["hypo", "Plain water (hypotonic)"], ["iso", "Isotonic solution"], ["hyper", "20% salt (hypertonic)"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.osmosis = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Plant cell vs animal cell in sugar solution (Activity 2.3, Fig. 2.9)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "sugar"};
  function frac(t){
    if(st.preset === "water") return 1;
    if(st.preset === "sugar") return 1 - 0.38 * (1 - Math.exp(-t / 2));
    return 0.62 + 0.38 * (1 - Math.exp(-t / 2));
  }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 10, step: 1, speed: 1, format: function(t){ return "<b>" + Math.round(t * 3) + " min</b>"; }});
    L.legend([["#34d399", "plant cell wall"], ["#fbbf24", "cell membrane and contents"], ["#38bdf8", "surrounding solution"]]);
    L.watch({water: "Rhoeo peel and cheek cells in plain water: both stay full and firm.", sugar: "Activity 2.3: both slides in 20 per cent sugar solution for half an hour.", back: "Move the shrunken cells back into plain water. Can they recover?"}[id]);
    L.controls("");
    L.restart(true);
  }
  function draw(t){
    var f = frac(t), m = "";
    m += L.rect(0, 0, 720, 300, st.preset === "sugar" ? "rgba(56,189,248,0.10)" : "rgba(56,189,248,0.05)");
    // Plant cell
    m += L.text(190, 30, "Rhoeo leaf peel (plant cell)", {size: 15, color: C.text, weight: 700});
    m += L.rect(90, 60, 200, 180, "none", ' stroke="#34d399" stroke-width="8" rx="6"');
    var pw = 184 * f, ph = 164 * f;
    m += L.rect(190 - pw / 2, 150 - ph / 2, pw, ph, "rgba(251,191,36,0.25)", ' stroke="#fbbf24" stroke-width="3" rx="' + (6 + (1 - f) * 40) + '"');
    m += L.circle(190, 150, 16 * Math.sqrt(f), "#a78bfa");
    if(f < 0.95) m += L.text(190, 262, "gap between wall and membrane", {size: 12, color: C.muted});
    // Animal cell
    m += L.text(520, 30, "Cheek cells (animal cell)", {size: 15, color: C.text, weight: 700});
    var ar = 90 * f;
    m += '<path d="M' + (520 - ar) + ' 150 Q' + (520 - ar) + ' ' + (150 - ar * 0.9) + ' 520 ' + (150 - ar * 0.95) + ' Q' + (520 + ar * 1.1) + ' ' + (150 - ar * 0.8) + ' ' + (520 + ar) + ' 150 Q' + (520 + ar * 0.9) + ' ' + (150 + ar) + ' 520 ' + (150 + ar * 0.9) + ' Q' + (520 - ar * 1.05) + ' ' + (150 + ar) + ' ' + (520 - ar) + ' 150 Z" fill="rgba(251,191,36,0.25)" stroke="#fbbf24" stroke-width="3"/>';
    m += L.circle(520, 150, 14 * Math.sqrt(f), "#a78bfa");
    L.svg(m, "Plant cell contents at " + Math.round(f * 100) + " percent; animal cell size " + Math.round(f * 100) + " percent.", 300);
    L.readout([["Time", Math.round(t * 3) + " min"], ["Plant cell outline (wall)", "unchanged", "#34d399"], ["Plant cell contents", Math.round(f * 100) + " %", "#fbbf24"], ["Cheek cell size", Math.round(f * 100) + " %", "#fbbf24"]]);
    L.verdict(t <= 0 ? "Press <b>Play</b>." : t < 9.9 ? "Water moves by osmosis…" :
      st.preset === "water" ? "In plain water both cells stay full. The plant cell's contents press against its wall, keeping it firm." :
      st.preset === "sugar" ? "<b>Activity 2.3:</b> both lose water to the sugar solution. The plant cell's <b>rigid wall keeps its shape</b> while the contents shrink away from it; the cheek cell, with <b>no wall, shrinks</b> as a whole." :
      "Back in plain water, water re-enters by osmosis: the plant cell's contents swell back against the wall and the cheek cell regains its size.");
  }
  function mount(){
    L.presets([["water", "Plain water"], ["sugar", "Activity 2.3: 20% sugar"], ["back", "Back into water"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.cellWall = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Bacterial, plant and animal cells (Activity 2.4, Tables 2.1–2.2)
(function(){
  var L = LAB, C = L.C;
  var ROWS = [["Cell membrane", [1, 1, 1]], ["Cell wall", [1, 1, 0]], ["Cytoplasm", [1, 1, 1]], ["Well-defined nucleus", [0, 1, 1]], ["Nucleoid", [1, 0, 0]], ["Membrane-bound organelles", [0, 1, 1]]];
  var st = {preset: "table"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "table" ? 6 : 3, step: 1, speed: 0.8, format: function(t){ return id === "table" ? "row <b>" + Math.min(6, Math.floor(t + 1e-9)) + "</b> of 6" : "<b>" + L.num(t, 1) + "</b>"; }});
    L.legend([[C.ok, "present"], [C.danger, "absent"], [C.path, "structure being checked"]]);
    L.watch(id === "table" ? "Activity 2.4: each row of Table 2.1 is checked in all three cells (Fig. 2.10)." : "Table 2.2: typical diameters of prokaryotic (1–10 µm) and eukaryotic (10–100 µm) cells, drawn to scale.");
    L.controls("");
    L.restart(true);
  }
  function cellArt(kind, x, hi){
    var m = "", hl = function(i){ return hi === i ? C.path : null; };
    if(kind === 0){
      m += '<ellipse cx="' + x + '" cy="150" rx="78" ry="44" fill="none" stroke="' + (hl(1) || "#34d399") + '" stroke-width="6"/>';
      m += '<ellipse cx="' + x + '" cy="150" rx="70" ry="37" fill="rgba(251,191,36,' + (hi === 2 ? 0.35 : 0.12) + ')" stroke="' + (hl(0) || "#fbbf24") + '" stroke-width="2.5"/>';
      m += '<path d="M' + (x - 25) + ' 150 q12 -18 25 0 t25 0" fill="none" stroke="' + (hl(4) || "#a78bfa") + '" stroke-width="3"/>';
      m += L.line(x + 78, 150, x + 110, 140, "#94a3b8", 2);
    } else if(kind === 1){
      m += L.rect(x - 80, 80, 160, 140, "none", ' stroke="' + (hl(1) || "#34d399") + '" stroke-width="7" rx="4"');
      m += L.rect(x - 72, 88, 144, 124, "rgba(251,191,36," + (hi === 2 ? 0.35 : 0.12) + ")", ' stroke="' + (hl(0) || "#fbbf24") + '" stroke-width="2.5" rx="3"');
      m += L.rect(x - 20, 105, 70, 80, "rgba(56,189,248,0.2)", ' rx="12"');
      m += L.circle(x - 45, 120, 15, "none", ' stroke="' + (hl(3) || "#a78bfa") + '" stroke-width="3"');
      ["#22c55e", "#22c55e"].forEach(function(c, i){ m += '<ellipse cx="' + (x - 48 + i * 30) + '" cy="195" rx="10" ry="5" fill="' + (hi === 5 ? C.path : c) + '"/>'; });
    } else {
      m += '<ellipse cx="' + x + '" cy="150" rx="80" ry="62" fill="rgba(251,191,36,' + (hi === 2 ? 0.35 : 0.12) + ')" stroke="' + (hl(0) || "#fbbf24") + '" stroke-width="2.5"/>';
      m += L.circle(x, 145, 18, "none", ' stroke="' + (hl(3) || "#a78bfa") + '" stroke-width="3"');
      m += '<ellipse cx="' + (x + 42) + '" cy="175" rx="12" ry="6" fill="' + (hi === 5 ? C.path : "#f97316") + '"/><ellipse cx="' + (x - 44) + '" cy="120" rx="12" ry="6" fill="' + (hi === 5 ? C.path : "#f97316") + '"/>';
    }
    return m;
  }
  function draw(t){
    var m = "";
    if(st.preset === "table"){
      var row = Math.min(5, Math.floor(t + 1e-9)), done = Math.floor(t + 1e-9);
      [["(a) bacterial cell", 120], ["(b) plant cell", 360], ["(c) animal cell", 600]].forEach(function(c, k){
        m += L.text(c[1], 40, c[0], {size: 14, color: C.text, weight: 700}) + cellArt(k, c[1], t > 0 && done < 6 ? row : -1);
        if(t > 0 && done < 6){ var yes = ROWS[row][1][k]; m += L.text(c[1], 262, yes ? "✓ present" : "✗ absent", {size: 16, color: yes ? C.ok : C.danger, weight: 700}); }
      });
      if(t > 0 && done < 6) m += L.text(360, 290, ROWS[row][0], {size: 15, color: C.path, weight: 700});
      L.svg(m, "Table 2.1 row: " + ROWS[row][0] + ".", 300);
      var html = '<table class="lab-table"><caption>Table 2.1: comparison of cells based on their structure</caption><thead><tr><th>Structure</th><th>Bacterial</th><th>Plant</th><th>Animal</th></tr></thead><tbody>' +
        ROWS.map(function(r, i){ var d = i < done; return '<tr' + (d ? '' : ' class="pending"') + '><td>' + r[0] + '</td>' + r[1].map(function(v){ return '<td>' + (d ? (v ? "✓" : "✗") : "?") + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table>';
      L.readoutHTML(html);
      L.verdict(t <= 0 ? "Press <b>Play</b> to fill in Table 2.1." : done < 6 ? "Checking: " + ROWS[row][0] + "…" : "<b>Result:</b> the bacterial cell has a nucleoid and no membrane-bound organelles, so it is <b>prokaryotic</b>. The plant and animal cells have a nucleus and membrane-bound organelles, so they are <b>eukaryotic</b>. Only the bacterial and plant cells have cell walls.");
    } else {
      var f = Math.min(1, t / 3), s = 5.2;
      m += L.text(360, 34, "drawn to scale: 1 µm = " + L.num(s, 1) + " px", {size: 13, color: C.muted});
      [[1, "smallest typical prokaryote (1 µm)", "#34d399"], [10, "large prokaryote / small eukaryote (10 µm)", "#fbbf24"], [100, "large eukaryotic cell (100 µm)", "#a78bfa"]].forEach(function(c, i){
        var d = c[0] * s * f;
        m += L.circle(60 + d / 2 + [0, 40, 180][i], 170, Math.max(1, d / 2), "none", ' stroke="' + c[2] + '" stroke-width="3"');
        m += L.text(60 + [0, 40, 180][i] + d / 2, 170 + d / 2 + 22 + i * 0, "", {});
      });
      m += L.text(40, 280, "prokaryotic: 1–10 µm", {size: 14, color: "#34d399", anchor: "start", weight: 700}) + L.text(680, 280, "eukaryotic: 10–100 µm", {size: 14, color: "#a78bfa", anchor: "end", weight: 700});
      L.svg(m, "Prokaryotic cells 1 to 10 micrometres; eukaryotic cells 10 to 100 micrometres.", 300);
      L.readout([["Prokaryotic cell diameter", "1 to 10 µm", "#34d399"], ["Eukaryotic cell diameter", "10 to 100 µm", "#a78bfa"], ["Organism", "usually unicellular / uni- or multicellular"]]);
      L.verdict(t < 2.9 ? "Growing the circles to scale…" : "<b>Table 2.2:</b> a typical eukaryotic cell is about 10 times wider than a typical prokaryotic cell, and has a membrane-bound nucleus and organelles.");
    }
  }
  function mount(){
    L.presets([["table", "Activity 2.4: fill in Table 2.1"], ["size", "Table 2.2: sizes to scale"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.cellTypes = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Organelle pathways (Fig. 2.13 and organelle functions)
(function(){
  var L = LAB, C = L.C;
  var POS = {nucleus: [220, 150], rer: [320, 110], ser: [330, 200], golgi: [450, 140], vesicle: [540, 110], membrane: [650, 95], mito: [470, 230], chloro: [150, 245], lyso: [560, 200], vacuole: [120, 90], out: [705, 90]};
  var PATHS = {
    protein: {name: "Making and secreting a protein (Fig. 2.13)", steps: [["nucleus", "Nucleus: DNA holds the coded instructions"], ["rer", "Ribosomes on rough ER make the protein"], ["golgi", "ER carries it to the Golgi apparatus, which modifies and packages it"], ["vesicle", "A vesicle carries the packaged protein"], ["membrane", "The vesicle joins the plasma membrane"], ["out", "The protein is released outside the cell (secretion)"]]},
    energy: {name: "Food and energy in a plant cell", steps: [["chloro", "Chloroplast: chlorophyll absorbs light; sugar is made (photosynthesis)"], ["mito", "Mitochondrion: glucose is broken down in cellular respiration"], ["mito", "Energy is stored as ATP, the cell's energy currency"], ["ser", "ATP powers work such as making fats and hormones in the SER"]]},
    cleanup: {name: "Clean-up by lysosomes", steps: [["mito", "A mitochondrion becomes damaged and worn out"], ["lyso", "A lysosome, a sac of enzymes, surrounds the damaged part"], ["lyso", "Enzymes break down its proteins, fats and carbohydrates"], ["vacuole", "The products are released into the cytoplasm to be reused"]]}
  };
  var st = {preset: "protein"};
  function select(id){
    st.preset = id; L.markPreset(id);
    var n = PATHS[id].steps.length;
    L.timeline({maxT: n, step: 1, speed: 0.7, format: function(t){ return "step <b>" + Math.min(n, Math.floor(t + 1e-9) + (t > 0 ? 0 : 0)) + "</b> of " + n; }});
    L.legend([[C.path, "active organelle"], ["#f8fafc", "the material being processed"]]);
    L.watch(PATHS[id].name + ". Follow the white parcel from organelle to organelle.");
    L.controls("");
    L.restart(true);
  }
  function draw(t){
    var p = PATHS[st.preset], n = p.steps.length, k = Math.min(n - 1, Math.floor(t + 1e-9)), m = "";
    var active = t > 0 ? p.steps[k][0] : null;
    var col = function(key, base){ return key === active ? C.path : base; };
    m += '<ellipse cx="380" cy="160" rx="330" ry="140" fill="rgba(251,191,36,0.06)" stroke="' + col("membrane", "#fbbf24") + '" stroke-width="4"/>';
    m += L.circle(220, 150, 48, "rgba(167,139,250,0.15)", ' stroke="' + col("nucleus", "#a78bfa") + '" stroke-width="4"') + L.circle(215, 145, 14, col("nucleus", "#7c3aed")) + L.text(220, 215, "nucleus", {size: 12, color: C.muted});
    for(var i = 0; i < 4; i++) m += '<path d="M' + (285 + i * 8) + ' ' + (80 + i * 14) + ' q40 -10 80 0" fill="none" stroke="' + col("rer", "#60a5fa") + '" stroke-width="3"/>' + L.circle(300 + i * 8, 78 + i * 14, 2.5, col("rer", "#e2e8f0")) + L.circle(330 + i * 8, 74 + i * 14, 2.5, col("rer", "#e2e8f0"));
    m += L.text(330, 150, "rough ER", {size: 12, color: C.muted});
    m += '<path d="M290 200 q20 -20 40 0 t40 0" fill="none" stroke="' + col("ser", "#38bdf8") + '" stroke-width="3"/>' + L.text(330, 225, "smooth ER", {size: 12, color: C.muted});
    for(var g = 0; g < 4; g++) m += '<path d="M' + (420) + ' ' + (118 + g * 12) + ' q30 -8 60 0" fill="none" stroke="' + col("golgi", "#34d399") + '" stroke-width="4"/>';
    m += L.text(450, 185, "Golgi", {size: 12, color: C.muted});
    m += '<ellipse cx="470" cy="238" rx="36" ry="17" fill="none" stroke="' + col("mito", "#f97316") + '" stroke-width="3"/><path d="M445 238 q6 -10 12 0 t12 0 t12 0 t12 0" fill="none" stroke="' + col("mito", "#f97316") + '" stroke-width="2"/>' + L.text(470, 275, "mitochondrion", {size: 12, color: C.muted});
    m += '<ellipse cx="150" cy="245" rx="38" ry="18" fill="rgba(34,197,94,0.25)" stroke="' + col("chloro", "#22c55e") + '" stroke-width="3"/>' + L.text(150, 282, "chloroplast", {size: 12, color: C.muted});
    m += L.circle(560, 200, 18, "rgba(244,114,182,0.2)", ' stroke="' + col("lyso", "#f472b6") + '" stroke-width="3"') + L.text(600, 228, "lysosome", {size: 12, color: C.muted});
    m += L.rect(90, 70, 70, 45, "rgba(56,189,248,0.15)", ' rx="16" stroke="' + col("vacuole", "#38bdf8") + '" stroke-width="2"') + L.text(125, 62, "cytoplasm", {size: 12, color: C.muted});
    if(t > 0){
      var a = POS[p.steps[Math.max(0, k - 1)][0]], b = POS[p.steps[k][0]], f = Math.min(1, (t - k) * 2);
      if(k === 0) a = b;
      m += L.circle(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 8, "#f8fafc", ' stroke="' + C.path + '" stroke-width="2"');
    }
    L.svg(m, t > 0 ? p.steps[k][1] : p.name, 300);
    L.readout(p.steps.map(function(s, i){ return [(i + 1) + ".", i <= k && t > 0 ? s[1] : "…", i === k && t > 0 ? C.path : null]; }));
    L.verdict(t <= 0 ? "Press <b>Play</b>." : t < n - 1e-6 ? p.steps[k][1] + "." :
      st.preset === "protein" ? "<b>Fig. 2.13 pathway:</b> nucleus → ribosomes on RER → ER → Golgi apparatus → vesicle → plasma membrane → outside. Each organelle does one part of the job." :
      st.preset === "energy" ? "<b>Food and energy:</b> chloroplasts capture light to make sugar; mitochondria release the energy from sugar as ATP, which powers the cell's work." :
      "<b>Clean-up:</b> lysosomes digest damaged parts and unwanted material; the products go back into the cytoplasm for reuse, keeping the cell healthy.");
  }
  function mount(){
    L.presets([["protein", "Fig. 2.13: protein pathway"], ["energy", "Food and energy"], ["cleanup", "Lysosome clean-up"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.organelles = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Division counter: mitosis, meiosis, fertilisation, growth
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "mitosis"};
  var STAGES = {
    mitosis: [[[4]], [[4, 4]]],
    meiosis: [[[4]], [[2, 2]], [[2, 2, 2, 2]]],
    fert: [[[2], [2]], [[4]]],
    skin: [[[4]], [[2, 2]], [[1, 1, 1, 1]]]
  };
  function select(id){
    st.preset = id; L.markPreset(id);
    if(id === "growth"){
      L.timeline({maxT: 20, step: 1, speed: 2, format: function(t){ return "division <b>" + Math.floor(t + 1e-9) + "</b>"; }});
      L.watch("Starting from one fertilised egg, every cell divides by mitosis in each round. How fast does the number grow?");
    } else {
      var n = STAGES[id].length - 1;
      L.timeline({maxT: n, step: 1, speed: 0.6, format: function(t){ return "stage <b>" + Math.floor(t + 1e-9) + "</b> of " + n; }});
      L.watch({mitosis: "Mitosis (Fig. 2.18): one division, two identical cells. The parent has 4 chromosomes (for clarity).", meiosis: "Meiosis (Fig. 2.19): two divisions, four gametes with half the chromosomes.", fert: "Fertilisation: two gametes, each with half the chromosomes, fuse.", skin: "Pause and Ponder 7 (a thought experiment): what if skin cells divided by meiosis while healing a cut?"}[id]);
    }
    L.legend([["#fbbf24", "cell"], ["#a78bfa", "chromosome"]]);
    L.controls("");
    L.restart(true);
  }
  function cell(x, y, r, chromo){
    var m = L.circle(x, y, r, "rgba(251,191,36,0.15)", ' stroke="#fbbf24" stroke-width="3"');
    for(var i = 0; i < chromo; i++){ var a = i / Math.max(1, chromo) * 6.283, d = chromo > 1 ? r * 0.45 : 0; m += L.rect(x + Math.cos(a) * d - 3, y + Math.sin(a) * d - 10, 6, 20, "#a78bfa", ' rx="3" transform="rotate(' + (i * 40) + ' ' + (x + Math.cos(a) * d) + ' ' + (y + Math.sin(a) * d) + ')"'); }
    return m + L.text(x, y + r + 18, chromo + " chromosomes", {size: 12, color: C.muted});
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "growth"){
      var n = Math.floor(t + 1e-9), cells = Math.pow(2, n);
      var show = Math.min(cells, 256), cols = Math.ceil(Math.sqrt(show)), size = Math.min(40, 250 / cols);
      for(var i = 0; i < show; i++) m += L.circle(200 + (i % cols) * size - cols * size / 2 + size / 2, 150 + Math.floor(i / cols) * size - Math.ceil(show / cols) * size / 2 + size / 2, size * 0.42, "rgba(251,191,36,0.4)", ' stroke="#fbbf24" stroke-width="1"');
      m += L.text(520, 120, "cells = 2^" + n, {size: 18, color: C.text});
      m += L.text(520, 160, cells.toLocaleString("en-IN"), {size: 28, color: C.path, weight: 700});
      if(cells > 256) m += L.text(200, 292, "(only 256 drawn)", {size: 12, color: C.muted});
      L.svg(m, "After " + n + " divisions there are " + cells + " cells.", 300);
      L.readout([["Rounds of division", String(n)], ["Number of cells", cells.toLocaleString("en-IN"), C.path], ["Chromosomes per cell", "unchanged (mitosis)"]]);
      msg = t <= 0 ? "Press <b>Play</b>." : n < 20 ? "Each round doubles the number of cells." : "After 20 rounds: <b>1,048,576 cells</b> (2²⁰). About 43 rounds of doubling would give trillions of cells, as in the human body, though real cells do not all divide in step.";
    } else {
      var stages = STAGES[st.preset], k = Math.min(stages.length - 1, Math.floor(t + 1e-9)), groups = stages[k], all = [];
      groups.forEach(function(g){ g.forEach(function(c){ all.push(c); }); });
      var r = all.length === 1 ? 70 : all.length === 2 ? 55 : 42;
      all.forEach(function(c, i){ m += cell(360 + (i - (all.length - 1) / 2) * (r * 2 + 40), 145, r, c); });
      if(st.preset === "fert" && k === 0) m += L.text(360, 150, "+", {size: 40, color: C.text, weight: 700});
      L.svg(m, all.length + " cells, each with " + all[0] + " chromosomes.", 300);
      L.readout([["Stage", k + " of " + (stages.length - 1)], ["Number of cells", String(all.length), "#fbbf24"], ["Chromosomes in each cell", String(all[0]), "#a78bfa"]]);
      if(t <= 0) msg = "Press <b>Play</b>.";
      else if(k < stages.length - 1) msg = "Dividing…";
      else if(st.preset === "mitosis") msg = "<b>Mitosis:</b> 1 cell → <b>2 genetically identical cells</b>, each with the same <b>4 chromosomes</b> as the parent. Used for growth and repair.";
      else if(st.preset === "meiosis") msg = "<b>Meiosis:</b> two divisions give <b>4 cells</b>, each with <b>half</b> the chromosomes (2). These are gametes.";
      else if(st.preset === "fert") msg = "<b>Fertilisation:</b> 2 + 2 = <b>4</b>. Fusing two gametes restores the original chromosome number.";
      else msg = "<b>Thought experiment:</b> meiosis halves the chromosome number, so the new skin cells would have fewer chromosomes (and they would keep falling), with incomplete instructions. The cut could not be repaired with normal skin cells: that is why repair uses mitosis.";
    }
    L.verdict(msg);
  }
  function mount(){
    L.presets([["mitosis", "Mitosis"], ["meiosis", "Meiosis"], ["fert", "Fertilisation"], ["skin", "P&P 7: skin cells by meiosis?"], ["growth", "From one egg: doubling"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.division = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Contact inhibition: normal vs cancer cells (2.5.1)
(function(){
  var L = LAB, C = L.C;
  var COLS = 16, ROWS = 8, FULL = COLS * ROWS;
  var st = {preset: "normal"};
  var ORDER = (function(){ var a = []; for(var r = 0; r < ROWS; r++) for(var c = 0; c < COLS; c++) a.push([c, r, Math.hypot(c - 7.5, (r - 3.5) * 1.6)]); a.sort(function(p, q){ return p[2] - q[2]; }); return a; })();
  function count(t){ var n = Math.round(Math.pow(2, t)); return st.preset === "normal" ? Math.min(FULL, n) : n; }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 10, step: 1, speed: 1, format: function(t){ return "division round <b>" + Math.floor(t + 1e-9) + "</b>"; }});
    L.legend([["#34d399", "normal cells"], [C.danger, "cancer cells (piled layers are darker)"]]);
    L.watch(id === "normal" ? "Normal animal cells in a dish. Watch what happens once the surface is covered." : "Cancer cells in the same dish. Do they stop when they touch?");
    L.controls("");
    L.restart(true);
  }
  function draw(t){
    var n = count(Math.floor(t + 1e-9)), layers = Math.ceil(n / FULL), cw = 38, ch = 30, x0 = 56, y0 = 30, m = "";
    m += L.rect(x0 - 10, y0 - 10, COLS * cw + 20, ROWS * ch + 20, "#0f1c2b", ' rx="14" stroke="#475569" stroke-width="2"');
    var base = st.preset === "normal" ? "#34d399" : "#ef4444";
    for(var i = 0; i < Math.min(n, FULL); i++){
      var p = ORDER[i], stacked = st.preset === "cancer" ? Math.floor((n - 1 - i) / FULL) + 1 : 1;
      var op = Math.min(0.95, 0.35 + 0.15 * stacked);
      m += L.rect(x0 + p[0] * cw + 2, y0 + p[1] * ch + 2, cw - 4, ch - 4, base, ' rx="8" fill-opacity="' + op + '"');
    }
    L.svg(m, n + " cells in the dish.", 300);
    var covered = Math.min(100, n / FULL * 100);
    L.readout([["Cells", n.toLocaleString("en-IN")], ["Dish surface covered", L.num(covered, 0) + " %"], ["Layers of cells", st.preset === "normal" ? (n > 0 ? "1" : "0") : String(layers), st.preset === "cancer" && layers > 1 ? C.danger : null]]);
    L.verdict(t <= 0 ? "Press <b>Play</b>." : t < 9.9 ? (n >= FULL && st.preset === "normal" ? "The surface is covered: the cells now touch their neighbours on all sides." : "Cells are dividing…") :
      st.preset === "normal" ? "<b>Contact inhibition:</b> once the normal cells touch their neighbours, they <b>stop dividing</b>, leaving a single layer (" + FULL + " cells here)." :
      "<b>Cancer cells</b> have lost contact inhibition: they keep dividing and pile up in <b>" + layers + " layers</b>, forming a tumour.");
  }
  function mount(){
    L.presets([["normal", "Normal cells: contact inhibition"], ["cancer", "Cancer cells: no contact inhibition"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.contact = {mount: mount, draw: draw, select: select, state: st};
})();
