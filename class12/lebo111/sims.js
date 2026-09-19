// Class 12 Biology, Chapter 11 (lebo111) — simulation labs.
// One lab per lesson, in the Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Age-pyramid builder (NCERT §11.1.1, Figure 11.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var DATA = {
    expanding: {young: 55, mid: 32, old: 13, shape: "expanding", note: "broad base, many young"},
    stable: {young: 35, mid: 38, old: 27, shape: "stable", note: "even sides"},
    declining: {young: 22, mid: 38, old: 40, shape: "declining", note: "narrow base, few young"}
  };
  var st = {preset: "expanding"};

  function draw(){
    var d = DATA[st.preset];
    var m = "";
    m += L.text(360, 24, "Figure 11.1 age pyramid (per cent of the population)", {size: 14, color: C.muted});
    m += L.rect(172, 42, 376, 202, "#0b1a28", ' rx="12" stroke="#334155" stroke-width="1.5"');
    var rows = [
      {p: d.young, color: "#38bdf8", label: "pre-reproductive (young)"},
      {p: d.mid, color: "#f59e0b", label: "reproductive"},
      {p: d.old, color: "#94a3b8", label: "post-reproductive (old)"}
    ];
    m += L.line(360, 50, 360, 246, C.faint, 1.5);
    for(var i = 0; i < rows.length; i++){
      var r = rows[i];
      var y = 58 + i * 62;
      var w = Math.max(26, r.p / 70 * 150);
      m += L.rect(360 - w, y, 2 * w, 46, r.color, ' opacity="0.85"');
      m += L.text(360, y + 28, L.num(r.p, 0) + "%", {size: 13, color: "#08131d", weight: 700});
      m += L.text(200, y + 28, r.label, {size: 11, color: C.muted, anchor: "end"});
    }
    m += L.text(360, 268, "same population attributes: birth rate 8/20 = 0.4/yr, death rate 4/40 = 0.1/wk", {size: 12, color: C.muted});
    L.svg(m, "Age pyramid for a " + d.shape + " population.", 300);

    L.readout([
      ["shape", d.shape, C.ok],
      ["young share", L.num(d.young, 0) + "%", "#38bdf8"],
      ["lotus birth rate", "0.4 per lotus per yr", "#f59e0b"],
      ["fruitfly death rate", "0.1 per fruitfly per wk", "#f59e0b"]
    ]);

    if(st.preset === "expanding"){
      L.verdict("<b>Figure 11.1(a) / Section 11.1.1:</b> a broad base with many young is an <b>expanding</b> population. Rates are per-capita population attributes: 8/20 = <b>0.4</b> offspring per lotus per year and 4/40 = <b>0.1</b> deaths per fruitfly per week.");
    } else if(st.preset === "stable"){
      L.verdict("<b>Figure 11.1(b) / Section 11.1.1:</b> even sides give a <b>stable</b> population. Density N may be counted (fewer than 10 Siberian cranes at Bharatpur) or measured as biomass or per cent cover (banyan versus Parthenium, millions of Chlamydomonas).");
    } else {
      L.verdict("<b>Figure 11.1(c) / Section 11.1.1:</b> a narrow base with few young means a <b>declining</b> population. Sex ratio (for example 60 per cent females) and age pyramids belong to populations, never to one lotus or one fruitfly.");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["expanding", "Expanding (broad base)"], ["stable", "Stable (even sides)"], ["declining", "Declining (narrow base)"]], st.preset, select);
    L.legend([[C.ok, "shape diagnoses growth status"], ["#38bdf8", "young"], ["#f59e0b", "reproductive"], ["#94a3b8", "old"]]);
    draw();
  }

  window.SIMS.agepyramid = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Exponential growth: the J-curve (NCERT §11.1.2, Figure 11.3a)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PRESET = {
    rat: {r: 0.015, label: "Norway rat"},
    beetle: {r: 0.12, label: "flour beetle"},
    india: {r: 0.0205, label: "India 1981"},
    ex2: {r: 0.231, label: "Exercise 2 doubling"}
  };
  var st = {preset: "ex2", r: 0.231, n0: 100};
  var T = 10;

  function curve(){
    var pts = [];
    for(var i = 0; i <= 80; i++){
      var t = T * i / 80;
      pts.push([t, st.n0 * Math.exp(st.r * t)]);
    }
    return pts;
  }

  function draw(){
    var pts = curve();
    var vmax = Math.max(120, st.n0 * Math.exp(st.r * T) * 1.05);
    var g = L.graph({x0: 80, y0: 252, w: 500, h: 192, tmax: T, vmin: 0, vmax: vmax, tStep: 2, vStep: vmax / 4, tLabel: "time (years)", vLabel: "N"});
    var m = g.svg;
    m += L.polyline(g, pts, C.ok, 3);
    var n3 = st.n0 * Math.exp(st.r * 3), n6 = st.n0 * Math.exp(st.r * 6);
    m += L.circle(g.X(3), g.Y(n3), 5, "#38bdf8");
    m += L.circle(g.X(6), g.Y(n6), 5, "#38bdf8");
    m += L.text(g.X(3), g.Y(n3) - 10, "N(3) = " + L.num(n3, 0), {size: 12, color: "#38bdf8"});
    m += L.text(g.X(6), g.Y(n6) - 10, "N(6) = " + L.num(n6, 0), {size: 12, color: "#38bdf8"});
    m += L.text(600, 70, PRESET[st.preset].label, {size: 14, color: C.text, anchor: "start"});
    m += L.text(600, 92, "r = " + L.num(st.r, 3) + " /yr", {size: 14, color: C.ok, anchor: "start"});
    m += L.text(600, 114, "dN/dt = rN", {size: 13, color: C.muted, anchor: "start"});
    L.svg(m, "Exponential J-curve for r = " + L.num(st.r, 3) + " per year.", 300);

    L.readout([
      ["r (per year)", L.num(st.r, 3), C.ok],
      ["N(3 yr)", L.num(n3, 0), "#38bdf8"],
      ["N(6 yr)", L.num(n6, 0), "#38bdf8"],
      ["doubling time", L.num(Math.log(2) / st.r, 1) + " yr", "#f59e0b"]
    ]);
    L.verdict("<b>Section 11.1.2 / Exercise 2:</b> with unlimited resources dN/dt = rN and Nt = N0 e^(rt), the J-curve. A population doubling in 3 years has 2 = e^(3r), so r = ln 2 / 3 = <b>0.231</b> per year. Textbook r values: Norway rat 0.015, flour beetle 0.12, India 1981 0.0205.");
  }

  function select(id){
    st.preset = id;
    st.r = PRESET[id].r;
    var el = document.getElementById("exp-r");
    if(el) el.value = st.r;
    L.setVal("exp-r", L.num(st.r, 3));
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["rat", "Norway rat r = 0.015"], ["beetle", "Flour beetle r = 0.12"], ["india", "India 1981 r = 0.0205"], ["ex2", "Exercise 2: r = 0.231"]], st.preset, select);
    L.controls(L.slider("exp-r", "Intrinsic rate r (per year)", 0.005, 0.35, 0.001, st.r, L.num(st.r, 3)));
    L.onInput("exp-r", function(v){ st.r = v; L.setVal("exp-r", L.num(v, 3)); draw(); });
    L.legend([[C.ok, "Nt = N0 e^(rt)"], ["#38bdf8", "N(3), N(6) markers"], [C.muted, "J-shaped growth"]]);
    draw();
  }

  window.SIMS.exponential = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Logistic growth and life history (NCERT §11.1.2–11.1.3, Figure 11.3b)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PRESET = {
    k100: {K: 100, strategy: "repeated breeding, many young", label: "K = 100"},
    k200: {K: 200, strategy: "repeated breeding, many young", label: "K = 200"},
    k400: {K: 400, strategy: "repeated breeding, many young", label: "K = 400"},
    salmon: {K: 200, strategy: "breeds once: Pacific salmon, bamboo", label: "breed once (salmon, bamboo)"},
    oysters: {K: 200, strategy: "many small offspring: oysters, pelagic fishes", label: "many small offspring (oysters)"}
  };
  var st = {preset: "k200", K: 200, r: 0.2};

  function draw(){
    var N0 = 10, T = 30;
    var vmax = st.K * 1.18;
    var g = L.graph({x0: 80, y0: 252, w: 460, h: 192, tmax: T, vmin: 0, vmax: vmax, tStep: 5, vStep: vmax / 4, tLabel: "time (years)", vLabel: "N"});
    var pts = [];
    for(var i = 0; i <= 90; i++){
      var t = T * i / 90;
      pts.push([t, st.K / (1 + ((st.K - N0) / N0) * Math.exp(-st.r * t))]);
    }
    var m = g.svg;
    m += L.polyline(g, pts, C.ok, 3);
    m += L.line(g.X(0), g.Y(st.K), g.X(T), g.Y(st.K), C.danger, 2, "6 4");
    m += L.text(g.X(T) + 6, g.Y(st.K) + 4, "K = " + L.num(st.K, 0), {size: 13, color: C.danger, anchor: "start"});
    m += L.text(g.X(T * 0.55), g.Y(st.K / 2) - 8, "fastest at N = K/2 = " + L.num(st.K / 2, 0), {size: 12, color: C.muted});
    m += L.text(560, 80, PRESET[st.preset].label, {size: 13, color: C.text, anchor: "start"});
    m += L.text(560, 102, "r = " + L.num(st.r, 2) + " /yr", {size: 13, color: C.ok, anchor: "start"});
    m += L.text(560, 124, "sigmoid: lag, acceleration,", {size: 10, color: C.muted, anchor: "start"});
    m += L.text(560, 140, "deceleration, asymptote", {size: 10, color: C.muted, anchor: "start"});
    L.svg(m, "Logistic sigmoid with carrying capacity " + L.num(st.K, 0) + ".", 300);

    var d50 = st.r * 50 * (st.K - 50) / st.K;
    L.readout([
      ["carrying capacity K", L.num(st.K, 0), C.danger],
      ["r (per year)", L.num(st.r, 2), C.ok],
      ["dN/dt at N = 50", L.num(d50, 1) + " /yr", "#38bdf8"],
      ["max growth at", "N = K/2 = " + L.num(st.K / 2, 0), "#38bdf8"]
    ]);
    L.verdict("<b>Section 11.1.2–11.1.3 / Exercise 8:</b> dN/dt = rN(K \u2212 N)/K gives the sigmoid \u2014 lag, acceleration, deceleration and an asymptote at N = K where dN/dt = 0; growth is fastest at <b>K/2</b>. Life history maximises Darwinian fitness (high r): " + PRESET[st.preset].strategy + ".");
  }

  function select(id){
    st.preset = id;
    st.K = PRESET[id].K;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["k100", "K = 100"], ["k200", "K = 200"], ["k400", "K = 400"], ["salmon", "Breed once (salmon)"], ["oysters", "Many small (oysters)"]], st.preset, select);
    L.controls(L.slider("log-r", "Intrinsic rate r (per year)", 0.05, 0.5, 0.01, st.r, L.num(st.r, 2)));
    L.onInput("log-r", function(v){ st.r = v; L.setVal("log-r", L.num(v, 2)); draw(); });
    L.legend([[C.ok, "sigmoid N(t)"], [C.danger, "carrying capacity K"], [C.muted, "N = K/2 is the steepest point"]]);
    draw();
  }

  window.SIMS.logistic = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Interaction matrix: mutualism and competition (NCERT §11.1.4, Table 11.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var ROWS = [
    ["mutualism", "+", "+"],
    ["competition", "\u2212", "\u2212"],
    ["predation", "+", "\u2212"],
    ["parasitism", "+", "\u2212"],
    ["commensalism", "+", "0"],
    ["amensalism", "\u2212", "0"]
  ];
  var CASES = {
    lichen: {title: "Lichen", a: "+", b: "+", row: "mutualism", text: "fungus + photosynthesising algae or cyanobacteria; mycorrhiza works the same way"},
    figwasp: {title: "Fig tree + wasp", a: "+", b: "+", row: "mutualism", text: "one-to-one: the wasp pollinates and uses the fruit for oviposition; seeds feed its larvae (Fig 11.4)"},
    flamingo: {title: "Flamingoes vs fishes", a: "\u2212", b: "\u2212", row: "competition", text: "unrelated species competing for zooplankton in shallow South American lakes"},
    balanus: {title: "Balanus vs Chathamalus", a: "\u2212", b: "\u2212", row: "competition", text: "the superior barnacle excludes the smaller one from the intertidal zone in Scotland (Connell)"},
    warblers: {title: "MacArthur's five warblers", a: "\u2212", b: "\u2212", row: "competition", text: "co-exist on one tree by different feeding times and foraging patterns: resource partitioning"}
  };
  var st = {preset: "lichen"};

  function draw(){
    var c = CASES[st.preset];
    var m = "";
    m += L.text(360, 22, "Table 11.1 interaction matrix: assign + (benefit), \u2212 (harm), 0 (neutral)", {size: 13, color: C.muted});
    for(var i = 0; i < ROWS.length; i++){
      var y = 42 + i * 30;
      var on = ROWS[i][0] === c.row;
      m += L.rect(60, y, 300, 26, on ? "#164e63" : "#0f1f2e", ' rx="6" stroke="' + (on ? "#38bdf8" : "#334155") + '"');
      m += L.text(74, y + 18, ROWS[i][0], {size: 13, color: on ? C.text : C.muted, anchor: "start", weight: on ? 700 : 400});
      m += L.text(300, y + 18, ROWS[i][1] + " / " + ROWS[i][2], {size: 13, color: on ? "#38bdf8" : C.muted, anchor: "end"});
    }
    m += L.rect(400, 48, 270, 170, "#0f1f2e", ' rx="10" stroke="#334155"');
    m += L.text(535, 78, c.title, {size: 15, color: C.text, weight: 700});
    m += L.text(535, 112, c.a + " / " + c.b, {size: 26, color: c.a === "+" ? C.ok : C.danger, weight: 700});
    m += L.text(535, 146, c.row, {size: 14, color: c.a === "+" ? C.ok : C.danger});
    // wrapped note
    var words = c.text.split(" "), line = "", lines = [];
    for(var w = 0; w < words.length; w++){
      var test = line ? line + " " + words[w] : words[w];
      if(test.length > 36){ lines.push(line); line = words[w]; } else line = test;
    }
    if(line) lines.push(line);
    for(var li = 0; li < lines.length; li++){
      m += L.text(535, 178 + li * 16, lines[li], {size: 11, color: C.muted});
    }
    L.svg(m, "Interaction matrix with " + c.title + " highlighted.", 300);

    L.readout([
      ["case", c.title],
      ["species A", c.a, c.a === "+" ? C.ok : C.danger],
      ["species B", c.b, c.b === "+" ? C.ok : C.danger],
      ["interaction", c.row, c.a === "+" ? C.ok : C.danger]
    ]);
    if(c.row === "mutualism"){
      L.verdict("<b>Table 11.1 mutualism (+/+), Section 11.1.4:</b> both species benefit. " + c.text + ". Plants pay pollinators and seed dispersers in pollen, nectar and juicy fruits, and co-evolve with them; <b>Ophrys</b> even uses sexual deceit, mimicking the female bee.");
    } else {
      L.verdict("<b>Table 11.1 competition (\u2212/\u2212), Section 11.1.4:</b> the fitness (r) of both species falls. " + c.text + ". <b>Gause:</b> two closely related species competing for the same limiting resource cannot co-exist indefinitely \u2014 but resource partitioning can let them co-exist (MacArthur's warblers).");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["lichen", "Lichen (+/+)"], ["figwasp", "Fig-wasp (+/+)"], ["flamingo", "Flamingo-fish (\u2212/\u2212)"], ["balanus", "Balanus (\u2212/\u2212)"], ["warblers", "Warblers (\u2212/\u2212)"]], st.preset, select);
    L.legend([[C.ok, "benefit +"], [C.danger, "harm \u2212"], [C.muted, "neutral 0"]]);
    draw();
  }

  window.SIMS.interactions = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Predation and parasitism stepper (NCERT §11.1.4(i)–(iii))
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CASES = {
    pisaster: {title: "Pisaster keystone removal", key: "more than 10 invertebrate species extinct within a year", kind: "predation"},
    opuntia: {title: "Opuntia and the cactus moth", key: "millions of hectares of rangeland invaded in the 1920s", kind: "predation"},
    cuscuta: {title: "Cuscuta: ectoparasitic plant", key: "lost chlorophyll and leaves; draws nutrition from the host", kind: "ecto"},
    liverfluke: {title: "Liver fluke: endoparasite", key: "two intermediate hosts, a snail and a fish", kind: "endo"},
    brood: {title: "Koel and crow: brood parasitism", key: "koel eggs match the host's in size and colour", kind: "brood"}
  };
  var st = {preset: "pisaster"};

  function draw(){
    var c = CASES[st.preset];
    var m = "";
    m += L.text(360, 22, "Predation and parasitism both score +/\u2212 on Table 11.1", {size: 13, color: C.muted});
    if(c.kind === "predation" && st.preset === "pisaster"){
      m += L.text(360, 52, "Enclosed intertidal area: all starfish removed", {size: 13, color: C.text});
      for(var i = 0; i < 12; i++){
        var px = 130 + (i % 6) * 92, py = 96 + Math.floor(i / 6) * 74;
        var dead = i >= 2;
        m += L.circle(px, py, 22, dead ? "#1f2937" : "#164e63", ' stroke="' + (dead ? "#475569" : "#38bdf8") + '" stroke-width="2"');
        if(dead) m += L.line(px - 12, py - 12, px + 12, py + 12, C.danger, 3);
      }
      m += L.text(360, 236, "more than 10 species become extinct within a year", {size: 13, color: C.danger});
    } else if(c.kind === "predation"){
      m += L.text(360, 54, "Prickly pear (Opuntia) cover versus the introduced moth", {size: 13, color: C.text});
      m += L.rect(110, 90, 240, 90, "#166534", ' opacity="0.85"');
      m += L.text(230, 205, "1920s: millions of hectares invaded", {size: 12, color: C.muted});
      m += L.arrow(370, 135, 440, 135, C.danger, 4);
      m += L.circle(490, 135, 34, "#f59e0b", ' opacity="0.9"');
      m += L.text(490, 141, "moth", {size: 12, color: "#08131d", weight: 700});
      m += L.text(535, 210, "cactus-feeding moth from its native range", {size: 12, color: C.muted});
    } else if(c.kind === "ecto"){
      m += L.rect(110, 80, 220, 150, "#14532d", ' rx="8"');
      m += L.text(220, 70, "hedge plant (host)", {size: 12, color: C.muted});
      m += L.line(290, 90, 420, 130, "#f59e0b", 3);
      m += L.line(300, 150, 430, 170, "#f59e0b", 3);
      m += L.circle(455, 150, 26, "#b45309");
      m += L.text(455, 155, "Cuscuta", {size: 11, color: "#fff", weight: 700});
      m += L.text(360, 256, "ectoparasite: feeds on the external surface (lice, ticks, copepods also)", {size: 12, color: C.muted});
    } else if(c.kind === "endo"){
      m += L.circle(200, 150, 42, "#7f1d1d");
      m += L.text(200, 154, "host", {size: 13, color: "#fff", weight: 700});
      m += L.arrow(248, 150, 300, 150, C.muted, 3);
      m += L.circle(340, 150, 30, "#0f766e");
      m += L.text(340, 154, "snail", {size: 11, color: "#fff"});
      m += L.arrow(376, 150, 428, 150, C.muted, 3);
      m += L.circle(470, 150, 30, "#1e40af");
      m += L.text(470, 154, "fish", {size: 11, color: "#fff"});
      m += L.text(360, 256, "endoparasite: lives inside the host; two intermediate hosts (snail, fish)", {size: 12, color: C.muted});
    } else {
      m += L.rect(150, 80, 180, 110, "#3f2d1c", ' rx="40"');
      m += L.circle(205, 130, 18, "#e2e8f0");
      m += L.circle(250, 125, 18, "#e2e8f0");
      m += L.circle(288, 138, 15, "#f59e0b");
      m += L.text(360, 230, "crow nest: the koel egg mimics the host's in size and colour", {size: 12, color: C.muted});
      m += L.text(360, 252, "the host incubates the foreign egg, reducing detection and ejection", {size: 12, color: C.muted});
    }
    L.svg(m, "Predation and parasitism lab: " + c.title + ".", 300);

    L.readout([
      ["interaction", "+ / \u2212", C.danger],
      ["case", c.title],
      ["key fact", c.key],
      ["section", "11.1.4"]
    ]);
    if(st.preset === "pisaster"){
      L.verdict("<b>Section 11.1.4(i), predation (+/\u2212):</b> removing the starfish <b>Pisaster</b> from an enclosed American Pacific intertidal area let <b>more than 10 species of invertebrates become extinct within a year</b> \u2014 predators maintain diversity by reducing competition among prey.");
    } else if(st.preset === "opuntia"){
      L.verdict("<b>Section 11.1.4(i) and Exercise 5:</b> prickly pear (<b>Opuntia</b>) spread into <b>millions of hectares</b> of Australian rangeland in the early 1920s until a <b>cactus-feeding moth</b> from its native range was introduced. Biological control rests on the predator's ability to regulate the prey population.");
    } else if(st.preset === "cuscuta"){
      L.verdict("<b>Section 11.1.4(iii), parasitism (+/\u2212):</b> <b>Cuscuta</b> has lost chlorophyll and leaves and draws nutrition from the host \u2014 an ectoparasite like lice on humans and ticks on dogs. The female mosquito is not a parasite: she takes blood for reproduction but does not live on the host.");
    } else if(st.preset === "liverfluke"){
      L.verdict("<b>Section 11.1.4(iii):</b> the human <b>liver fluke</b> is an endoparasite with two intermediate hosts (<b>a snail and a fish</b>); the malarial parasite uses a mosquito vector. Parasites reduce host survival, growth and reproduction and may make the host easier prey.");
    } else {
      L.verdict("<b>Section 11.1.4(iii):</b> in <b>brood parasitism</b> the parasitic bird lays eggs in the host's nest; koel eggs evolved to resemble the crow's eggs in <b>size and colour</b>, so the host incubates them. Watch the cuckoo (koel) and crow in spring\u2013summer.");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["pisaster", "Pisaster keystone"], ["opuntia", "Opuntia biocontrol"], ["cuscuta", "Cuscuta (ecto)"], ["liverfluke", "Liver fluke (endo)"], ["brood", "Koel (brood)"]], st.preset, select);
    L.legend([[C.danger, "predator / parasite +"], ["#38bdf8", "prey / host \u2212"], ["#f59e0b", "biocontrol agent"]]);
    draw();
  }

  window.SIMS.predation = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Commensals, amensals and defences (NCERT §11.1.4(iv)–(v) + defence)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CASES = {
    orchid: {title: "Orchid on mango (Exercise 4)", cat: "commensalism + / 0", color: C.ok, note: "support and light for the orchid; the mango is neither helped nor harmed."},
    barnacles: {title: "Barnacles on a whale", cat: "commensalism + / 0", color: C.ok, note: "the barnacle gains a moving substrate; the whale shows no apparent benefit or harm."},
    penicillium: {title: "Penicillium vs Staphylococcus", cat: "amensalism \u2212 / 0", color: C.danger, note: "the fungus secretes a chemical that harms the bacterium while the fungus is unaffected."},
    calotropis: {title: "Calotropis chemical defence", cat: "chemical defence", color: "#f59e0b", note: "highly poisonous cardiac glycosides keep cattle and goats from browsing the weed of abandoned fields."},
    thorns: {title: "Thorns (Acacia, Cactus)", cat: "morphological defence", color: "#38bdf8", note: "the most common morphological defence: spines and thorns make herbivory costly."},
    monarch: {title: "Monarch butterfly", cat: "animal chemical defence", color: "#a78bfa", note: "distasteful to birds because of a chemical gained as a caterpillar feeding on a poisonous weed."}
  };
  var st = {preset: "orchid"};

  function draw(){
    var c = CASES[st.preset];
    var m = "";
    m += L.text(360, 22, "Commensalism (+/0), amensalism (\u2212/0) and the defences prey and plants evolved", {size: 13, color: C.muted});
    m += L.rect(70, 46, 340, 160, "#0f1f2e", ' rx="10" stroke="' + c.color + '" stroke-width="2"');
    m += L.text(240, 82, c.title, {size: 15, color: C.text, weight: 700});
    m += L.text(240, 118, c.cat, {size: 17, color: c.color, weight: 700});
    var words = c.note.split(" "), line = "", lines = [];
    for(var w = 0; w < words.length; w++){
      var test = line ? line + " " + words[w] : words[w];
      if(test.length > 42){ lines.push(line); line = words[w]; } else line = test;
    }
    if(line) lines.push(line);
    for(var li = 0; li < lines.length; li++){
      m += L.text(240, 150 + li * 17, lines[li], {size: 11, color: C.muted});
    }
    m += L.rect(440, 46, 230, 160, "#0f1f2e", ' rx="10" stroke="#334155"');
    m += L.text(555, 76, "Defence classes", {size: 13, color: C.text, weight: 700});
    m += L.text(555, 104, "morphological: thorns", {size: 12, color: "#38bdf8"});
    m += L.text(555, 126, "chemical: glycosides,", {size: 12, color: "#f59e0b"});
    m += L.text(555, 144, "nicotine, quinine, opium", {size: 12, color: "#f59e0b"});
    m += L.text(555, 166, "concealment: camouflage", {size: 12, color: C.muted});
    m += L.text(555, 188, "warning: Monarch poisons", {size: 12, color: "#a78bfa"});
    m += L.text(360, 246, "Nearly 25 per cent of all insects are phytophagous; plants cannot run, so defences are varied.", {size: 12, color: C.muted});
    L.svg(m, "Defence and interaction matcher: " + c.title + ".", 290);

    L.readout([
      ["case", c.title],
      ["classification", c.cat, c.color],
      ["sign", c.cat.indexOf("+ / 0") >= 0 ? "+ / 0" : (c.cat.indexOf("\u2212 / 0") >= 0 ? "\u2212 / 0" : "defence"), c.color],
      ["section", "11.1.4"]
    ]);
    if(st.preset === "orchid"){
      L.verdict("<b>Table 11.1 and Exercise 4:</b> the orchid is an epiphyte that gains support and light, while the mango is neither benefited nor harmed \u2014 <b>commensalism (+/0)</b>. It is not parasitism (nothing is drawn from the mango, unlike Cuscuta) and not mutualism (the mango gains nothing).");
    } else if(st.preset === "barnacles"){
      L.verdict("<b>Table 11.1, Section 11.1.4(iv):</b> barnacles on the back of a whale benefit while the whale derives no apparent benefit or harm \u2014 <b>commensalism (+/0)</b>. Cattle egrets with grazing cattle and clown fish with sea anemones are the other textbook cases.");
    } else if(st.preset === "penicillium"){
      L.verdict("<b>Table 11.1, amensalism (\u2212/0):</b> <b>Penicillium</b> releases a substance that harms <b>Staphylococcus</b> while the fungus is unaffected in the scored interaction \u2014 one species is harmed, the other is not.");
    } else if(st.preset === "calotropis"){
      L.verdict("<b>Section 11.1.4(i), chemical defence (Exercise 3):</b> <b>Calotropis</b> produces highly poisonous <b>cardiac glycosides</b>, so cattle and goats never browse it. Nicotine, caffeine, quinine, strychnine and opium are commercial chemicals the plants make as defences against grazers and browsers.");
    } else if(st.preset === "thorns"){
      L.verdict("<b>Section 11.1.4(i), morphological defence (Exercise 3):</b> <b>thorns</b> on <b>Acacia</b> and <b>Cactus</b> are the most common morphological defence against herbivores. Plants also make chemicals that sicken, block digestion or reproduction, or kill the herbivore.");
    } else {
      L.verdict("<b>Section 11.1.4(i), animal defence:</b> the <b>Monarch butterfly</b> is highly distasteful to birds because of a chemical acquired as a caterpillar feeding on a poisonous weed. Other prey use <b>camouflage</b>: insects and frogs are cryptically coloured to escape detection.");
    }
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["orchid", "Orchid on mango (+/0)"], ["barnacles", "Barnacles (+/0)"], ["penicillium", "Penicillium (\u2212/0)"], ["calotropis", "Calotropis (chemical)"], ["thorns", "Thorns (morphological)"], ["monarch", "Monarch (animal)"]], st.preset, select);
    L.legend([[C.ok, "commensal +/0"], [C.danger, "amensal \u2212/0"], ["#f59e0b", "chemical"], ["#38bdf8", "morphological"], ["#a78bfa", "animal defence"]]);
    draw();
  }

  window.SIMS.defenses = {mount: mount, draw: draw, select: select, state: st};
})();
