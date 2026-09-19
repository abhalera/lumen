// Class 12 Biology, Chapter 13 (lebo113) — simulation labs.
// One tailored lab per lesson, built on the shared window.LAB helpers
// (scripts/templates/lab.js). All labs are preset/control driven, so the
// legacy timeline toolbar is hidden on mount and the shared timeline is unused.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Three levels of biodiversity + species counters (NCERT §13.1, 13.1.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {mode: "levels", described: 1.5};

  function draw(){
    var m = "";
    if(st.mode === "levels"){
      m += L.text(360, 30, "Biodiversity (Edward Wilson): genetic + species + ecological — macromolecules to biomes", {size: 14, color: C.muted});
      var box = [
        ["GENETIC", "#38bdf8", ["Rauwolfia vomitoria:", "reserpine varies across", "Himalayan ranges; 50,000 rice", "strains and 1,000 mangoes"]],
        ["SPECIES", "#34d399", ["Western Ghats amphibians", "show greater diversity", "than the Eastern Ghats", "— a species-level count"]],
        ["ECOLOGICAL", "#f59e0b", ["deserts, rain forests,", "mangroves, coral reefs,", "wetlands, estuaries, alpine", "meadows: India > Norway"]]
      ];
      for(var i = 0; i < 3; i++){
        var x = 35 + i * 222;
        m += L.rect(x, 62, 202, 148, "#0f1f2e", ' rx="10" stroke="' + box[i][1] + '" stroke-width="2"');
        m += L.text(x + 101, 92, box[i][0], {size: 16, color: box[i][1], weight: 700});
        for(var j = 0; j < 4; j++){
          m += L.text(x + 101, 120 + j * 20, box[i][2][j], {size: 11.5, color: C.text});
        }
      }
      m += L.text(360, 244, "More than 70% of recorded species are animals; plants (including algae, fungi, bryophytes, gymnosperms and angiosperms) no more than 22%.", {size: 12.5, color: C.muted});
      m += L.text(360, 270, "Among animals, insects exceed 70% — out of every 10 animals on the planet, 7 are insects (Figure 13.1).", {size: 12.5, color: C.text});
      L.readout([
        ["Genetic", "Rauwolfia + 50,000 rice", "#38bdf8"],
        ["Species", "W. Ghats > E. Ghats", "#34d399"],
        ["Ecological", "deserts to alpine", "#f59e0b"],
        ["Insects", "7 of 10 animals", C.text]
      ]);
      L.verdict("<b>Section 13.1 / Exercise 1:</b> biodiversity — the term popularised by the sociobiologist <b>Edward Wilson</b> — has three key levels. <b>Genetic:</b> Rauwolfia vomitoria varies in the potency and concentration of reserpine across Himalayan ranges, and India has more than 50,000 rice strains and 1,000 mango varieties. <b>Species:</b> the Western Ghats hold a greater amphibian diversity than the Eastern Ghats. <b>Ecological:</b> India's deserts, rain forests, mangroves, coral reefs, wetlands, estuaries and alpine meadows give it greater ecosystem diversity than Norway.");
    } else if(st.mode === "counts"){
      var d = st.described;
      var pct = d / 7 * 100;
      var w = 520 * Math.min(1, d / 7);
      m += L.text(360, 30, "IUCN (2004): slightly more than 1.5 million species described of May's ~7 million estimate", {size: 14, color: C.muted});
      m += L.rect(100, 82, 520, 38, "#0f1f2e", ' rx="8" stroke="#334155"');
      m += L.rect(100, 82, w, 38, "#34d399", ' rx="8"');
      m += L.text(360, 146, L.num(d, 2) + " million described ÷ 7 million estimate = " + L.num(pct, 1) + "% recorded", {size: 16, color: C.text, weight: 700});
      m += L.text(360, 178, "More than 70% of recorded species are animals; plants are no more than 22% (Exercise 9 quotes 72% vs 22%).", {size: 12.5, color: C.muted});
      m += L.text(360, 204, "Extreme guesses range from 20 to 50 million; May extrapolated a temperate–tropical insect ratio (Exercise 2).", {size: 12.5, color: C.muted});
      m += L.text(360, 236, "India records ~45,000 plant species and twice as many animal species — 2.4% of land, 8.1% of global species.", {size: 12.5, color: C.text});
      m += L.text(360, 264, "'Nature's biological library is burning even before we catalogued the titles of all the books stocked there.'", {size: 12.5, color: C.danger});
      L.readout([
        ["described", L.num(d, 2) + " M", "#34d399"],
        ["global estimate", "7 M"],
        ["recorded", L.num(pct, 1) + "%", "#38bdf8"],
        ["insects", "7 of 10 animals", C.text]
      ]);
      L.verdict("<b>Section 13.1.1 / Exercises 2 and 9:</b> the IUCN (2004) tally of slightly more than <b>1.5 million</b> described species against Robert May's conservative <b>7 million</b> means only about <b>21.4% ≈ 22%</b> of species are recorded. Animals are more than 70% of the total and plants no more than 22%; insects are more than 70% of animals, so <b>7 of every 10 animals is an insect</b>. Prokaryote numbers stay unknown because conventional taxonomy and culture methods fail for them.");
    } else {
      m += L.text(360, 30, "India: 2.4% of the world's land area but 8.1% of global species diversity — one of 12 mega diversity countries", {size: 14, color: C.muted});
      m += L.rect(60, 78, 270, 96, "#0f1f2e", ' rx="10" stroke="#38bdf8" stroke-width="2"');
      m += L.text(195, 110, "share of world land area", {size: 12.5, color: C.muted});
      m += L.text(195, 150, "2.4%", {size: 28, color: "#38bdf8", weight: 700});
      m += L.rect(390, 78, 270, 96, "#0f1f2e", ' rx="10" stroke="#34d399" stroke-width="2"');
      m += L.text(525, 110, "share of global species", {size: 12.5, color: C.muted});
      m += L.text(525, 150, "8.1%", {size: 28, color: "#34d399", weight: 700});
      m += L.text(360, 212, "Nearly 45,000 plant species and twice as many animal species have been recorded from India.", {size: 13, color: C.text});
      m += L.text(360, 238, "At the ~22% recorded share: more than 1,00,000 plant and more than 3,00,000 animal species may await discovery.", {size: 13, color: C.text});
      m += L.text(360, 264, "Ecosystem spread: deserts, rain forests, mangroves, coral reefs, wetlands, estuaries and alpine meadows.", {size: 12.5, color: C.muted});
      L.readout([
        ["world land area", "2.4%", "#38bdf8"],
        ["global species", "8.1%", "#34d399"],
        ["mega diversity", "1 of 12", "#f59e0b"],
        ["recorded plants", "~45,000", C.text]
      ]);
      L.verdict("<b>Section 13.1.1:</b> although India has only <b>2.4%</b> of the world's land area, its share of global species diversity is <b>8.1%</b>, making it one of the <b>12 mega diversity countries</b>. Nearly <b>45,000 plant species</b> and twice as many animal species are recorded, yet at the 22% recorded share more than <b>1,00,000 plant</b> and <b>3,00,000 animal</b> species may still be waiting to be discovered and described.");
    }
    L.svg(m, "Biodiversity bench, view: " + st.mode, 300);
  }

  function select(id){
    st.mode = id;
    if(id === "counts"){
      st.described = 1.5;
      var s = document.getElementById("l1-desc");
      if(s) s.value = "1.5";
      L.setVal("l1-desc", L.num(1.5, 2) + " M");
    }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["levels", "1 · Three levels"], ["counts", "2 · Counts: 1.5M / 7M"], ["india", "3 · India: 2.4% → 8.1%"]], st.mode, select);
    L.controls(L.slider("l1-desc", "Described species (millions)", 0.5, 7, 0.1, st.described, L.num(st.described, 2) + " M"));
    L.onInput("l1-desc", function(v){ st.described = v; L.setVal("l1-desc", L.num(v, 2) + " M"); draw(); });
    L.legend([["#38bdf8", "genetic"], ["#34d399", "species"], ["#f59e0b", "ecological"], ["#f87171", "extinction warning"]]);
    draw();
  }

  window.SIMS.biodivlevels = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Latitudinal gradient + species–area relationship (NCERT §13.1.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {mode: "lat", z: 0.15, am: 2};

  function X(la){ return 80 + la / 3 * 520; }
  function Y(ls){ return 250 - (ls - 1) / 3 * 195; }

  function draw(){
    var m = "";
    if(st.mode === "lat"){
      m += L.text(360, 30, "Latitudinal gradient: species diversity decreases from the equator towards the poles", {size: 14, color: C.muted});
      m += L.line(60, 132, 660, 132, C.faint, 3);
      var pts = [
        [120, "Colombia (equator)", "~1,400 birds", "#34d399"],
        [280, "India (tropical)", ">1,200 birds", "#38bdf8"],
        [480, "New York (41°N)", "105 birds", "#f59e0b"],
        [615, "Greenland (71°N)", "56 birds", "#f87171"]
      ];
      for(var i = 0; i < pts.length; i++){
        m += L.circle(pts[i][0], 132, 9, pts[i][3]);
        m += L.text(pts[i][0], 106, pts[i][1], {size: 12.5, color: pts[i][3], weight: 700});
        m += L.text(pts[i][0], 160, pts[i][2], {size: 12.5, color: C.text});
      }
      m += L.arrow(660, 196, 70, 196, C.danger, 2.5);
      m += L.text(360, 190, "increasing latitude →  fewer species", {size: 13, color: C.danger});
      m += L.text(360, 232, "A tropical forest in Ecuador holds up to 10× the vascular-plant species of an equal temperate area.", {size: 12.5, color: C.muted});
      m += L.text(360, 256, "Amazon rain forest: >40,000 plants, 3,000 fishes, 1,300 birds, 427 mammals, 427 amphibians, 378 reptiles, >1,25,000 invertebrates — and at least 2 million insects still unnamed.", {size: 12, color: C.muted});
      L.readout([
        ["Colombia", "~1,400 birds", "#34d399"],
        ["India", ">1,200 birds", "#38bdf8"],
        ["New York", "105 birds", "#f59e0b"],
        ["Greenland", "56 birds", "#f87171"]
      ]);
      L.verdict("<b>Section 13.1.2:</b> with very few exceptions, the tropics (23.5° N to 23.5° S) harbour more species than temperate or polar areas. Colombia near the equator has nearly <b>1,400 bird species</b>, New York at 41° N has <b>105</b> and Greenland at 71° N only <b>56</b>; largely tropical India has more than <b>1,200</b>. Ecuador's tropical forest holds up to <b>10 times</b> the vascular-plant species of an equal temperate area, and the Amazon is the most biodiverse rain forest on Earth.");
    } else if(st.mode === "hyp"){
      m += L.text(360, 30, "Why are the tropics so rich? Three hypotheses (NCERT §13.1.2)", {size: 14, color: C.muted});
      var hyp = [
        ["(a) TIME", "#38bdf8", ["Speciation is a function of time:", "tropical latitudes stayed relatively", "undisturbed for millions of years,", "while temperate zones were glaciated."]],
        ["(b) CONSTANCY", "#34d399", ["Tropical environments are less", "seasonal, more constant and", "predictable — promoting niche", "specialisation and diversity."]],
        ["(c) ENERGY", "#f59e0b", ["More solar energy reaches the", "tropics, contributing to higher", "productivity, which indirectly", "favours greater diversity."]]
      ];
      for(var i = 0; i < 3; i++){
        var x = 35 + i * 222;
        m += L.rect(x, 64, 202, 166, "#0f1f2e", ' rx="10" stroke="' + hyp[i][1] + '" stroke-width="2"');
        m += L.text(x + 101, 96, hyp[i][0], {size: 16, color: hyp[i][1], weight: 700});
        for(var j = 0; j < 4; j++){
          m += L.text(x + 101, 126 + j * 22, hyp[i][2][j], {size: 11.5, color: C.text});
        }
      }
      m += L.text(360, 262, "These three long-run advantages explain why the tropical latitudinal band carries the greatest species richness.", {size: 12.5, color: C.muted});
      L.readout([
        ["time", "long, unglaciated", "#38bdf8"],
        ["climate", "constant, predictable", "#34d399"],
        ["energy", "high solar input", "#f59e0b"],
        ["outcome", "greater diversity", C.text]
      ]);
      L.verdict("<b>Section 13.1.2:</b> (a) <b>time</b> — tropical latitudes remained relatively undisturbed for millions of years while temperate regions were subjected to frequent glaciations, giving tropical species a longer evolutionary runway; (b) <b>constancy</b> — tropical environments are less seasonal, more constant and predictable, and such stability promotes niche specialisation; (c) <b>productivity</b> — more solar energy raises productivity, which in turn contributes indirectly to greater diversity.");
    } else {
      var Z = st.z, am = st.am;
      var mult = Math.pow(am, Z);
      var continental = Z >= 0.6;
      m += L.text(360, 30, "Species–area relationship: log S = log C + Z log A (a straight line only on the log scale)", {size: 14, color: C.muted});
      m += L.line(80, 250, 660, 250, C.muted, 2);
      m += L.line(80, 250, 80, 45, C.muted, 2);
      m += L.text(370, 278, "log A (explored area)", {size: 13, color: C.text});
      m += L.text(88, 38, "log S (species richness)", {size: 13, color: C.text, anchor: "start"});
      for(var gi = 1; gi <= 3; gi++){
        m += L.line(80, Y(1 + gi), 660, Y(1 + gi), C.grid, 1);
        m += L.text(70, Y(1 + gi) + 4, "S" + gi, {size: 11, color: C.muted, anchor: "end"});
      }
      var d = "";
      for(var i = 0; i <= 60; i++){
        var la = i / 60 * 3;
        d += (i === 0 ? "M " : "L ") + X(la).toFixed(1) + " " + Y(1 + Z * la).toFixed(1) + " ";
      }
      m += '<path d="' + d + '" fill="none" stroke="#34d399" stroke-width="3"/>';
      m += L.circle(X(0.3), Y(1 + Z * 0.3), 6, "#38bdf8");
      m += L.text(560, 80, "Z = " + L.num(Z, 2), {size: 16, color: "#34d399", weight: 700});
      m += L.text(560, 108, "area ×" + L.num(am, 1) + " → species ×" + L.num(mult, 2), {size: 14, color: C.text});
      m += L.text(560, 136, continental ? "continental slope" : "local / regional slope", {size: 12.5, color: continental ? "#f59e0b" : "#34d399"});
      m += L.text(360, 232, "Raw scale: a rectangular hyperbola (Humboldt: richness rises with area only up to a limit).", {size: 12, color: C.muted});
      m += L.text(360, 256, "Within regions Z = 0.1–0.2; across continents Z = 0.6–1.2; frugivorous birds and mammals of tropical forests: 1.15.", {size: 12, color: C.muted});
      L.readout([
        ["Z (slope)", L.num(Z, 2), continental ? "#f59e0b" : "#34d399"],
        ["area ×", "×" + L.num(am, 1)],
        ["species ×", "×" + L.num(mult, 2), "#38bdf8"],
        ["regime", continental ? "continental" : "local/regional"]
      ]);
      if(continental){
        L.verdict("<b>Section 13.1.2 / Exercise 4:</b> across entire continents the slope of log S = log C + Z log A steepens to <b>Z = 0.6–1.2</b> — for frugivorous birds and mammals of tropical forests it is <b>1.15</b>. Doubling the explored area then multiplies richness by 2^1.15 ≈ <b>2.22</b>: richness more than doubles because each new continental area adds species that occur nowhere else (endemics).");
      } else {
        L.verdict("<b>Section 13.1.2 / Exercise 4:</b> the slope Z of the regression log S = log C + Z log A measures how fast species richness accumulates with area. With the local value Z = 0.15, doubling the explored area multiplies richness by 2^0.15 ≈ <b>1.11</b> — only about 11 per cent more species, because the same regional pool is being sampled more thoroughly (plants in Britain, birds in California and molluscs in New York all give Z = 0.1–0.2).");
      }
    }
    L.svg(m, "Species pattern bench, view: " + st.mode, 300);
  }

  function select(id){
    st.mode = id;
    if(id === "local" || id === "lat"){
      st.z = 0.15;
      var s1 = document.getElementById("l2-z"); if(s1) s1.value = "0.15";
      L.setVal("l2-z", L.num(0.15, 2));
    }
    if(id === "continent"){
      st.z = 1.15;
      var s2 = document.getElementById("l2-z"); if(s2) s2.value = "1.15";
      L.setVal("l2-z", L.num(1.15, 2));
    }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["lat", "1 · Latitude transect"], ["local", "2 · Local Z = 0.15"], ["continent", "3 · Continental Z = 1.15"], ["hyp", "4 · Why the tropics?"]], st.mode, select);
    L.controls(
      L.slider("l2-z", "Z (slope of the log–log line)", 0.1, 1.2, 0.01, st.z, L.num(st.z, 2)) +
      L.slider("l2-am", "Area multiplier A₂/A₁", 1, 10, 0.5, st.am, L.num(st.am, 1))
    );
    L.onInput("l2-z", function(v){ st.z = v; L.setVal("l2-z", L.num(v, 2)); draw(); });
    L.onInput("l2-am", function(v){ st.am = v; L.setVal("l2-am", L.num(v, 1)); draw(); });
    L.legend([["#34d399", "log S = log C + Z log A"], ["#38bdf8", "sample point"], ["#f59e0b", "continental regime"]]);
    draw();
  }

  window.SIMS.latarea = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Loss of biodiversity: Evil Quartet + Red List (NCERT §13.1.3–13.1.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {mode: "quartet", rivets: 0};

  function draw(){
    var m = "";
    if(st.mode === "quartet"){
      m += L.text(360, 28, "The Evil Quartet: four human-driven causes of species loss (habitat loss is the most important)", {size: 14, color: C.muted});
      var q = [
        ["(i) HABITAT LOSS", "#f87171", ["The most important cause. Rain forests fell", "from >14% to no more than 6% of land;", "1,000 ha vanish per chapter-read. The", "Amazon is cleared for soya and beef."]],
        ["(ii) OVER-EXPLOITATION", "#f59e0b", ["'Need' turned to 'greed': Steller's sea", "cow and the passenger pigeon in the last", "500 years; marine fishes are now", "over-harvested around the world."]],
        ["(iii) ALIEN INVASIONS", "#a78bfa", ["Nile perch in Lake Victoria exterminated", ">200 endemic cichlids; Parthenium,", "Lantana and Eichhornia threaten India's", "natives; Clarias gariepinus the catfish."]],
        ["(iv) CO-EXTINCTIONS", "#38bdf8", ["Obligate partners die together: when a", "host fish goes extinct its unique", "parasites follow; a coevolved", "plant–pollinator pair goes together."]]
      ];
      for(var i = 0; i < 4; i++){
        var col = i % 2, row = Math.floor(i / 2);
        var x = 35 + col * 332, y = 52 + row * 116;
        m += L.rect(x, y, 318, 102, "#0f1f2e", ' rx="10" stroke="' + q[i][1] + '" stroke-width="2"');
        m += L.text(x + 159, y + 24, q[i][0], {size: 13, color: q[i][1], weight: 700});
        for(var j = 0; j < 4; j++){
          m += L.text(x + 159, y + 45 + j * 16, q[i][2][j], {size: 10.5, color: C.text});
        }
      }
      L.readout([
        ["(i)", "habitat loss", "#f87171"],
        ["(ii)", "over-exploitation", "#f59e0b"],
        ["(iii)", "alien invasion", "#a78bfa"],
        ["(iv)", "co-extinction", "#38bdf8"]
      ]);
      L.verdict("<b>Sections 13.1.3–13.1.4 / Exercise 5:</b> the accelerated losses are human-driven — the <b>Evil Quartet</b>. <b>(i) Habitat loss and fragmentation</b> is the most important cause: tropical rain forests fell from more than <b>14%</b> of land to no more than <b>6%</b>, and 1,000 more hectares vanish while you read the chapter. <b>(ii) Over-exploitation</b> — need turned to greed — took Steller's sea cow and the passenger pigeon and now over-harvests marine fishes. <b>(iii) Alien species invasions</b>: the Nile perch exterminated more than <b>200</b> cichlid species in Lake Victoria, while Parthenium, Lantana, Eichhornia and the illegal African catfish <i>Clarias gariepinus</i> threaten India's natives. <b>(iv) Co-extinctions</b> take obligate partners together — host fish with its parasites, coevolved plant with its pollinator.");
    } else if(st.mode === "redlist"){
      m += L.text(360, 28, "IUCN Red List (2004): 784 species extinct in the last 500 years", {size: 14, color: C.muted});
      var bars = [["vertebrates", 338, "#38bdf8"], ["invertebrates", 359, "#f59e0b"], ["plants", 87, "#34d399"]];
      for(var i = 0; i < 3; i++){
        var y = 66 + i * 56;
        var w = bars[i][1] / 359 * 420;
        m += L.text(120, y + 20, bars[i][0], {size: 13, color: C.text, anchor: "start"});
        m += L.rect(200, y, 420, 30, "#0f1f2e", ' rx="6" stroke="#334155"');
        m += L.rect(200, y, w, 30, bars[i][2], ' rx="6"');
        m += L.text(636, y + 21, String(bars[i][1]), {size: 14, color: bars[i][2], weight: 700, anchor: "end"});
      }
      m += L.text(360, 252, "338 + 359 + 87 = 784 extinctions; the last twenty years alone saw 27 species disappear.", {size: 14, color: C.text, weight: 700});
      m += L.text(360, 276, "Colonisation of tropical Pacific islands is linked to the extinction of more than 2,000 native bird species.", {size: 12, color: C.muted});
      L.readout([
        ["vertebrates", "338", "#38bdf8"],
        ["invertebrates", "359", "#f59e0b"],
        ["plants", "87", "#34d399"],
        ["total", "784", C.text]
      ]);
      L.verdict("<b>Section 13.1.4:</b> the IUCN Red List (2004) documents the extinction of <b>784 species in the last 500 years — 338 vertebrates + 359 invertebrates + 87 plants</b> — and the last twenty years alone witnessed the disappearance of <b>27 species</b>. The colonisation of tropical Pacific islands by humans is said to have led to the extinction of more than <b>2,000 native bird species</b>. Extinctions are not random across taxa: amphibians appear more vulnerable than most groups.");
    } else if(st.mode === "extinct"){
      m += L.text(360, 28, "Some recent extinctions named in the text — and the three lost tiger subspecies", {size: 14, color: C.muted});
      var rows = [
        ["Dodo", "Mauritius", "#38bdf8"],
        ["Quagga", "Africa", "#f59e0b"],
        ["Thylacine", "Australia", "#a78bfa"],
        ["Steller's Sea Cow", "Russia", "#f87171"]
      ];
      for(var i = 0; i < 4; i++){
        var y = 62 + i * 42;
        m += L.rect(120, y, 480, 34, "#0f1f2e", ' rx="8" stroke="' + rows[i][2] + '"');
        m += L.text(180, y + 22, rows[i][0], {size: 14, color: rows[i][2], weight: 700, anchor: "start"});
        m += L.text(560, y + 22, rows[i][1], {size: 13, color: C.text, anchor: "end"});
      }
      m += L.text(360, 252, "Three subspecies of tiger — Bali, Javan and Caspian — have also gone extinct.", {size: 14, color: C.text, weight: 700});
      m += L.text(360, 276, "IUCN Red List (2004): 784 documented extinctions in 500 years; 27 in the last twenty years alone.", {size: 12, color: C.muted});
      L.readout([
        ["dodo", "Mauritius", "#38bdf8"],
        ["quagga", "Africa", "#f59e0b"],
        ["thylacine", "Australia", "#a78bfa"],
        ["sea cow", "Russia", "#f87171"]
      ]);
      L.verdict("<b>Section 13.1.4:</b> examples of recent extinctions include the <b>dodo (Mauritius)</b>, <b>quagga (Africa)</b>, <b>thylacine (Australia)</b>, <b>Steller's Sea Cow (Russia)</b> and three subspecies of tiger — <b>Bali, Javan and Caspian</b>. The IUCN Red List (2004) records 784 extinctions in the last 500 years, and the last twenty years alone saw 27 species disappear.");
    } else if(st.mode === "threats"){
      m += L.text(360, 28, "More than 15,500 species face extinction — amphibians are the most vulnerable group", {size: 14, color: C.muted});
      var pcts = [["birds", 12, "#38bdf8"], ["mammals", 23, "#34d399"], ["amphibians", 32, "#f87171"], ["gymnosperms", 31, "#f59e0b"]];
      for(var i = 0; i < 4; i++){
        var y = 62 + i * 48;
        m += L.text(140, y + 20, pcts[i][0], {size: 13, color: C.text, anchor: "start"});
        m += L.rect(250, y, 380, 30, "#0f1f2e", ' rx="6" stroke="#334155"');
        m += L.rect(250, y, 380 * pcts[i][1] / 32, 30, pcts[i][2], ' rx="6"');
        m += L.text(646, y + 21, pcts[i][1] + "%", {size: 14, color: pcts[i][2], weight: 700, anchor: "end"});
      }
      m += L.text(360, 262, "Five mass extinctions in >3 billion years, but the Sixth Extinction is 100–1,000× faster than pre-human rates.", {size: 12.5, color: C.text});
      m += L.text(360, 284, "If present trends continue, nearly half of all species could be wiped out within the next 100 years.", {size: 12, color: C.danger});
      L.readout([
        ["birds", "12%", "#38bdf8"],
        ["mammals", "23%", "#34d399"],
        ["amphibians", "32%", "#f87171"],
        ["gymnosperms", "31%", "#f59e0b"]
      ]);
      L.verdict("<b>Section 13.1.4:</b> more than <b>15,500 species</b> worldwide face the threat of extinction — <b>12% of birds, 23% of mammals, 32% of amphibians and 31% of gymnosperms</b>; amphibians are the most vulnerable group. Life has suffered five mass extinctions in more than 3 billion years, but the present <b>Sixth Extinction</b> runs <b>100 to 1,000 times faster</b> than pre-human rates, and ecologists warn that nearly half of all species might be wiped out within the next 100 years if present trends continue.");
    } else {
      var n = Math.round(st.rivets);
      var frac = n / 40;
      var state = n < 12 ? "flying safely" : (n < 26 ? "weakening" : "in danger");
      var col = n < 12 ? C.ok : (n < 26 ? "#f59e0b" : C.danger);
      m += L.text(360, 28, "Ehrlich's rivet-popper: species are rivets on the ecosystem-airplane", {size: 14, color: C.muted});
      m += L.rect(80, 110, 560, 80, "#0f1f2e", ' rx="40" stroke="' + col + '" stroke-width="3"');
      for(var i = 0; i < 40; i++){
        var rx = 108 + (i % 20) * 26;
        var ry = 130 + Math.floor(i / 20) * 40;
        var popped = i < n;
        m += L.circle(rx, ry, 5, popped ? "#1e293b" : "#e2e8f0", popped ? ' stroke="#475569"' : '');
      }
      m += L.text(360, 216, "rivets popped: " + n + " of 40  ·  " + state, {size: 16, color: col, weight: 700});
      m += L.text(360, 246, "Tilman: plots with more species show less year-to-year variation in biomass and higher productivity.", {size: 12.5, color: C.muted});
      m += L.text(360, 270, "Wing rivets (key species driving major functions) matter far more than seat or window rivets (redundant species).", {size: 12.5, color: C.text});
      L.readout([
        ["rivets popped", String(n), col],
        ["flight", state, col],
        ["diversity", "stability + productivity", "#34d399"],
        ["key species", "wing rivets", "#f87171"]
      ]);
      L.verdict("<b>Section 13.1.3 / Exercise 6:</b> David Tilman's long-term outdoor-plot experiments found that plots with more species showed <b>less year-to-year variation in total biomass</b> and <b>higher productivity</b>. Ehrlich's <b>rivet-popper hypothesis</b> treats every species as a rivet on the ecosystem-airplane: popping a few seems harmless at first, but cumulative loss makes the plane dangerously weak over time — and losing a <b>wing rivet</b> (a key species that drives major ecosystem functions) is far more serious than losing a few <b>seat or window rivets</b> (redundant species).");
    }
    L.svg(m, "Biodiversity-loss bench, view: " + st.mode, 300);
  }

  function select(id){
    st.mode = id;
    if(id === "rivet"){
      st.rivets = 0;
      var s = document.getElementById("l3-rivets");
      if(s) s.value = "0";
      L.setVal("l3-rivets", "0");
    }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([
      ["quartet", "1 · Evil Quartet"],
      ["redlist", "2 · Red List: 784"],
      ["extinct", "3 · Recent losses"],
      ["threats", "4 · 15,500 at risk"],
      ["rivet", "5 · Rivet-popper"]
    ], st.mode, select);
    L.controls(L.slider("l3-rivets", "Rivets popped (rivet-popper bench)", 0, 40, 1, st.rivets, String(st.rivets)));
    L.onInput("l3-rivets", function(v){ st.rivets = v; L.setVal("l3-rivets", String(Math.round(v))); draw(); });
    L.legend([["#f87171", "habitat loss"], ["#f59e0b", "over-exploitation"], ["#a78bfa", "alien invasion"], ["#38bdf8", "co-extinction"]]);
    draw();
  }

  window.SIMS.evilquartet = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Why conserve: narrow, broad and ethical values (NCERT §13.2.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {mode: "narrow", drugs: 200};

  function draw(){
    var m = "";
    if(st.mode === "narrow"){
      var dr = st.drugs;
      var plant = Math.round(dr * 0.25);
      m += L.text(360, 28, "Narrowly utilitarian: direct economic products from biodiversity (NCERT §13.2.1)", {size: 14, color: C.muted});
      m += L.text(360, 70, "drugs sampled: " + L.num(dr, 0), {size: 15, color: C.text});
      m += L.rect(160, 88, 400, 34, "#0f1f2e", ' rx="8" stroke="#334155"');
      m += L.rect(160, 88, 400 * 0.25, 34, "#f59e0b", ' rx="8"');
      m += L.text(560, 112, "≥25% plant-derived", {size: 13, color: "#f59e0b", anchor: "end"});
      m += L.text(360, 154, "~" + L.num(plant, 0) + " of " + L.num(dr, 0) + " drugs derive from plants; 25,000 plant species serve traditional medicine.", {size: 14, color: C.text, weight: 700});
      m += L.text(360, 192, "Other direct goods: food (cereals, pulses, fruits), firewood, fibre, construction material,", {size: 12.5, color: C.muted});
      m += L.text(360, 214, "industrial products — tannins, lubricants, dyes, resins and perfumes.", {size: 12.5, color: C.muted});
      m += L.text(360, 250, "Bioprospecting: exploring molecular, genetic and species-level diversity for products of economic importance.", {size: 12.5, color: "#38bdf8"});
      L.readout([
        ["drugs sampled", L.num(dr, 0)],
        ["plant-derived", "~" + L.num(plant, 0), "#f59e0b"],
        ["traditional medicine", "25,000 spp", "#34d399"],
        ["bioprospecting", "molecules → markets", "#38bdf8"]
      ]);
      L.verdict("<b>Section 13.2.1 (narrowly utilitarian):</b> more than <b>25 per cent of the drugs currently sold worldwide are derived from plants</b>, and <b>25,000 plant species</b> contribute to the traditional medicines of native peoples. Together with food, firewood, fibre, construction material and industrial products such as tannins, lubricants, dyes, resins and perfumes, these are the direct economic benefits that make <b>bioprospecting</b> — exploring molecular, genetic and species-level diversity for products of economic importance — worthwhile.");
    } else if(st.mode === "broad"){
      m += L.text(360, 28, "Broadly utilitarian: ecosystem services that nature provides (NCERT §13.2.1)", {size: 14, color: C.muted});
      var svc = [
        ["OXYGEN", "#38bdf8", ["The fast-dwindling Amazon", "produces, through photosynthesis,", "about 20% of the total oxygen", "in the Earth's atmosphere."]],
        ["POLLINATION", "#34d399", ["Bees, bumblebees, birds and bats", "give us fruits and seeds. What", "would pollination cost without", "these natural pollinators?"]],
        ["FLOOD & SOIL", "#f59e0b", ["Forest cover controls floods and", "soil erosion, and supports pest", "control and climate moderation", "as free, unaccounted services."]],
        ["AESTHETICS", "#a78bfa", ["Thick woods, spring flowers in", "full bloom and a bulbul's song", "at dawn — intangible benefits", "with no price tag (Exercise 8)."]]
      ];
      for(var i = 0; i < 4; i++){
        var col = i % 2, row = Math.floor(i / 2);
        var x = 35 + col * 332, y = 50 + row * 112;
        m += L.rect(x, y, 318, 98, "#0f1f2e", ' rx="10" stroke="' + svc[i][1] + '" stroke-width="2"');
        m += L.text(x + 159, y + 24, svc[i][0], {size: 13, color: svc[i][1], weight: 700});
        for(var j = 0; j < 4; j++){
          m += L.text(x + 159, y + 44 + j * 15, svc[i][2][j], {size: 10.5, color: C.text});
        }
      }
      m += L.text(360, 282, "Priced against a hospital oxygen cylinder and a pollinator-free orchard, these services stop being free.", {size: 12, color: C.muted});
      L.readout([
        ["Amazon oxygen", "~20%", "#38bdf8"],
        ["pollinators", "bees, birds, bats", "#34d399"],
        ["flood/erosion", "forest cover", "#f59e0b"],
        ["aesthetics", "bulbul's song", "#a78bfa"]
      ]);
      L.verdict("<b>Section 13.2.1 (broadly utilitarian):</b> the fast-dwindling Amazon forest is estimated to produce, through photosynthesis, <b>20 per cent of the total oxygen in the Earth's atmosphere</b>; pollination by bees, bumblebees, birds and bats gives us fruits and seeds; and ecosystems also provide flood control, soil-erosion control, pest control and climate moderation. Beyond these stand intangible benefits — walking through thick woods, watching spring flowers in full bloom, waking to a <b>bulbul's song</b> — on which no price tag fits.");
    } else if(st.mode === "services"){
      m += L.text(360, 28, "Exercise 8: how biotic cover controls floods and soil erosion", {size: 14, color: C.muted});
      m += L.line(80, 250, 660, 250, C.faint, 2);
      m += L.text(112, 244, "slope", {size: 12, color: C.muted, anchor: "start"});
      var trees = [180, 320, 460, 600];
      for(var i = 0; i < trees.length; i++){
        m += L.rect(trees[i] - 5, 150, 10, 100, "#8b5a2b", ' rx="2"');
        m += L.circle(trees[i], 130, 34, "#166534");
        m += L.arrow(trees[i] - 20, 96, trees[i] - 20, 62, "#38bdf8", 2.5);
      }
      m += L.text(360, 52, "canopy and litter intercept rain, slow runoff", {size: 12.5, color: "#38bdf8"});
      for(var i = 0; i < trees.length; i++){
        m += L.line(trees[i] - 12, 250, trees[i] - 12, 210, "#d97706", 2);
        m += L.line(trees[i] - 12, 210, trees[i] - 28, 190, "#d97706", 2);
        m += L.line(trees[i] - 12, 210, trees[i] + 4, 190, "#d97706", 2);
      }
      m += L.text(360, 194, "roots bind soil particles into a coherent matrix", {size: 12.5, color: "#f59e0b"});
      m += L.text(360, 276, "Remove the cover and the service reverses: faster runoff, eroded topsoil, silted rivers.", {size: 12.5, color: C.muted});
      L.readout([
        ["canopy", "intercepts rainfall", "#38bdf8"],
        ["litter", "slows runoff", "#a78bfa"],
        ["roots", "bind the soil", "#f59e0b"],
        ["result", "floods + erosion checked", "#34d399"]
      ]);
      L.verdict("<b>Exercise 8 / §13.2.1 (broadly utilitarian):</b> the biotic components are the engineers. The plant <b>canopy and leaf litter</b> intercept rainfall and slow runoff, so water reaches rivers metered rather than as a flood pulse; <b>roots bind soil particles</b> into a coherent matrix that resists erosion and traps silt in the catchment. Flood control, soil-erosion control, pest control and climate moderation are exactly the ecosystem services the broadly utilitarian argument prices — and they vanish when the cover is removed.");
    } else {
      m += L.text(360, 28, "Ethical: intrinsic value and a moral duty to future generations (NCERT §13.2.1)", {size: 14, color: C.muted});
      m += L.rect(60, 66, 600, 72, "#0f1f2e", ' rx="10" stroke="#a78bfa" stroke-width="2"');
      m += L.text(360, 98, "Every species has an intrinsic value, even if it has no current or future economic value to us.", {size: 14, color: C.text});
      m += L.text(360, 122, "We share this planet with millions of plant, animal and microbe species.", {size: 12.5, color: C.muted});
      m += L.rect(60, 154, 600, 72, "#0f1f2e", ' rx="10" stroke="#38bdf8" stroke-width="2"');
      m += L.text(360, 186, "We have a moral duty to care for their well-being and pass our biological legacy", {size: 14, color: C.text});
      m += L.text(360, 210, "on in good order to future generations.", {size: 14, color: C.text});
      m += L.text(360, 258, "The bulbul's song and spring flowers are the everyday face of this argument: priceless, and owed.", {size: 12.5, color: "#a78bfa"});
      L.readout([
        ["intrinsic value", "every species", "#a78bfa"],
        ["moral duty", "care for well-being", "#38bdf8"],
        ["legacy", "in good order", "#34d399"],
        ["price tag", "not applicable", C.muted]
      ]);
      L.verdict("<b>Section 13.2.1 (ethical):</b> philosophically and spiritually we must realise that <b>every species has an intrinsic value</b>, even if it is of no current or any economic value to us. We share the planet with millions of plant, animal and microbe species, and we have a <b>moral duty to care for their well-being and pass on our biological legacy in good order to future generations</b> — the argument that turns spring flowers and a bulbul's song into an inheritance rather than a commodity.");
    }
    L.svg(m, "Why-conserve bench, view: " + st.mode, 300);
  }

  function select(id){
    st.mode = id;
    if(id === "narrow"){
      st.drugs = 200;
      var s = document.getElementById("l4-drugs");
      if(s) s.value = "200";
      L.setVal("l4-drugs", "200");
    }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([
      ["narrow", "1 · Narrowly utilitarian"],
      ["broad", "2 · Broadly utilitarian"],
      ["services", "3 · Flood & erosion (Ex 8)"],
      ["ethical", "4 · Ethical duty"]
    ], st.mode, select);
    L.controls(L.slider("l4-drugs", "Drugs sampled (more than 25% plant-derived)", 40, 400, 20, st.drugs, L.num(st.drugs, 0)));
    L.onInput("l4-drugs", function(v){ st.drugs = v; L.setVal("l4-drugs", L.num(v, 0)); draw(); });
    L.legend([["#f59e0b", "narrowly utilitarian"], ["#38bdf8", "broadly utilitarian"], ["#a78bfa", "ethical"]]);
    draw();
  }

  window.SIMS.whysave = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — How to conserve: in situ, ex situ, hotspots, summits (NCERT §13.2.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {mode: "insitu", year: 2002};

  function draw(){
    var m = "";
    if(st.mode === "insitu"){
      m += L.text(360, 28, "In situ (on site): protect the whole ecosystem — 'we save the entire forest to save the tiger'", {size: 14, color: C.muted});
      var estate = [["14", "biosphere reserves", "#38bdf8"], ["90", "national parks", "#34d399"], ["448", "wildlife sanctuaries", "#f59e0b"]];
      for(var i = 0; i < 3; i++){
        var x = 60 + i * 210;
        m += L.rect(x, 60, 190, 92, "#0f1f2e", ' rx="10" stroke="' + estate[i][2] + '" stroke-width="2"');
        m += L.text(x + 95, 106, estate[i][0], {size: 30, color: estate[i][2], weight: 700});
        m += L.text(x + 95, 134, estate[i][1], {size: 12.5, color: C.text});
      }
      m += L.rect(60, 170, 600, 96, "#0f1f2e", ' rx="10" stroke="#a78bfa" stroke-width="2"');
      m += L.text(360, 196, "Sacred groves — community in-situ reserves protected long before wildlife law", {size: 13.5, color: "#a78bfa", weight: 700});
      m += L.text(360, 222, "Khasi & Jaintia Hills (Meghalaya) · Aravalli Hills (Rajasthan) · Western Ghats (Karnataka, Maharashtra)", {size: 11.5, color: C.text});
      m += L.text(360, 244, "Sarguja, Chanda and Bastar (Madhya Pradesh). In Meghalaya they are the last refuges of many rare and threatened plants.", {size: 11.5, color: C.text});
      m += L.text(360, 286, "Hotspots extend the same logic: strict protection of <2% of the land could cut ongoing extinctions by almost 30%.", {size: 12, color: C.muted});
      L.readout([
        ["biosphere reserves", "14", "#38bdf8"],
        ["national parks", "90", "#34d399"],
        ["sanctuaries", "448", "#f59e0b"],
        ["mantra", "save the whole forest", "#a78bfa"]
      ]);
      L.verdict("<b>Section 13.2.2:</b> when we conserve and protect the whole ecosystem, its biodiversity at all levels is protected — '<b>we save the entire forest to save the tiger</b>'. India's in-situ network now has <b>14 biosphere reserves, 90 national parks and 448 wildlife sanctuaries</b>, joined by <b>sacred groves</b> in Khasi and Jaintia Hills (Meghalaya), the Aravalli Hills (Rajasthan), the Western Ghats (Karnataka and Maharashtra) and the Sarguja, Chanda and Bastar areas (Madhya Pradesh). In Meghalaya, sacred groves are the last refuges for a large number of rare and threatened plants.");
    } else if(st.mode === "exsitu"){
      m += L.text(360, 28, "Ex situ (off site): urgent rescue for threatened species — zoos, gardens, banks and cryolabs", {size: 14, color: C.muted});
      var kit = [
        ["ZOOS & GARDENS", "#38bdf8", ["Zoological parks, botanical", "gardens and wildlife safari", "parks hold threatened species;", "some are extinct in the wild."]],
        ["CRYOPRESERVATION", "#34d399", ["Gametes of threatened species", "can be preserved in viable and", "fertile condition for long", "periods at cryogenic temperatures."]],
        ["IVF & TISSUE CULTURE", "#f59e0b", ["Eggs can be fertilised in vitro;", "plants can be propagated", "using tissue-culture methods", "in the laboratory."]],
        ["SEED BANKS", "#a78bfa", ["Seeds of different genetic strains", "of commercially important plants", "can be kept for long periods", "in seed banks."]]
      ];
      for(var i = 0; i < 4; i++){
        var col = i % 2, row = Math.floor(i / 2);
        var x = 35 + col * 332, y = 52 + row * 116;
        m += L.rect(x, y, 318, 102, "#0f1f2e", ' rx="10" stroke="' + kit[i][1] + '" stroke-width="2"');
        m += L.text(x + 159, y + 24, kit[i][0], {size: 12.5, color: kit[i][1], weight: 700});
        for(var j = 0; j < 4; j++){
          m += L.text(x + 159, y + 45 + j * 16, kit[i][2][j], {size: 10.5, color: C.text});
        }
      }
      L.readout([
        ["zoos & gardens", "extinct-in-wild species", "#38bdf8"],
        ["gametes", "cryopreserved", "#34d399"],
        ["IVF", "eggs fertilised", "#f59e0b"],
        ["seed banks", "crop strains", "#a78bfa"]
      ]);
      L.verdict("<b>Section 13.2.2:</b> in <b>ex-situ conservation</b>, threatened animals and plants are taken out of their natural habitat and placed in special settings — <b>zoological parks, botanical gardens and wildlife safari parks</b>; some animals now survive only there after becoming extinct in the wild. Modern methods go further: <b>cryopreservation</b> keeps gametes viable and fertile for long periods, eggs can be fertilised <b>in vitro</b>, plants can be propagated by <b>tissue culture</b>, and <b>seed banks</b> preserve the genetic strains of commercially important plants.");
    } else if(st.mode === "hotspots"){
      m += L.text(360, 28, "Biodiversity hotspots: 25 initially + 9 added = 34 — three of them cover India", {size: 14, color: C.muted});
      m += L.rect(60, 64, 600, 60, "#0f1f2e", ' rx="10" stroke="#f59e0b" stroke-width="2"');
      m += L.text(200, 102, "25 + 9 = 34 hotspots", {size: 20, color: "#f59e0b", weight: 700});
      m += L.text(500, 102, "cover < 2% of Earth's land", {size: 14, color: C.text});
      var spots = [["Western Ghats & Sri Lanka", "#34d399"], ["Indo-Burma", "#38bdf8"], ["Himalaya", "#f59e0b"]];
      for(var i = 0; i < 3; i++){
        var x = 60 + i * 210;
        m += L.rect(x, 148, 190, 74, "#0f1f2e", ' rx="10" stroke="' + spots[i][1] + '" stroke-width="2"');
        m += L.text(x + 95, 180, spots[i][0], {size: 12.5, color: spots[i][1], weight: 700});
        m += L.text(x + 95, 204, "India hotspot " + (i + 1) + " of 3", {size: 11.5, color: C.muted});
      }
      m += L.text(360, 250, "Strict protection of these hotspots could reduce the ongoing mass extinctions by almost 30%.", {size: 13, color: C.text, weight: 700});
      m += L.text(360, 276, "Hotspots combine very high species richness with high endemism (species confined to that region) and accelerated habitat loss.", {size: 11.5, color: C.muted});
      L.readout([
        ["initial hotspots", "25", "#38bdf8"],
        ["added", "9", "#a78bfa"],
        ["total", "34", "#f59e0b"],
        ["in India", "3", "#34d399"]
      ]);
      L.verdict("<b>Section 13.2.2:</b> because species awaiting rescue far outnumber the resources available, conservationists identified <b>biodiversity hotspots</b> — regions of very high species richness and a high degree of <b>endemism</b> (species confined there and found nowhere else) under accelerated habitat loss. Initially <b>25</b> hotspots were identified; nine more were added, bringing the world total to <b>34</b>. Together they cover less than <b>2 per cent</b> of Earth's land, yet strict protection could reduce the ongoing mass extinctions by almost <b>30 per cent</b>. Three hotspots — <b>Western Ghats and Sri Lanka, Indo-Burma and Himalaya</b> — cover India.");
    } else {
      m += L.text(360, 28, "Global summits: Rio de Janeiro 1992 → Johannesburg 2002 → the 2010 reduction pledge", {size: 14, color: C.muted});
      m += L.line(90, 130, 630, 130, C.faint, 3);
      var events = [
        [150, "1992", "Rio Earth Summit", "Convention on Biological", "Diversity: conserve and", "sustainably use biodiversity", "#38bdf8"],
        [370, "2002", "Johannesburg", "World Summit on Sustainable", "Development: 190 countries", "pledged to reduce biodiversity", "#34d399"],
        [590, "2010", "Deadline", "Significant reduction in the", "current rate of biodiversity", "loss at global, regional", "#f59e0b"]
      ];
      for(var i = 0; i < 3; i++){
        m += L.circle(events[i][0], 130, 10, events[i][6]);
        m += L.text(events[i][0], 106, events[i][1], {size: 16, color: events[i][6], weight: 700});
        m += L.text(events[i][0], 158, events[i][2], {size: 12.5, color: C.text, weight: 700});
        for(var j = 0; j < 3; j++){
          m += L.text(events[i][0], 180 + j * 16, events[i][3 + j], {size: 10.5, color: C.muted});
        }
      }
      var y = Math.round(st.year);
      var stage = y < 1992 ? "before Rio" : (y < 2002 ? "after Rio 1992" : (y < 2010 ? "after Johannesburg 2002" : "2010 deadline reached"));
      m += L.text(360, 262, "Year " + L.num(y, 0) + ": " + stage + ". Biodiversity knows no political boundaries — conservation is a collective responsibility.", {size: 12.5, color: C.text});
      m += L.text(360, 286, "The 2002 Johannesburg pledge: 190 countries, and a significant reduction of biodiversity loss by 2010.", {size: 12, color: C.muted});
      L.readout([
        ["year", L.num(y, 0), "#f59e0b"],
        ["Rio", "1992", "#38bdf8"],
        ["Johannesburg", "2002 · 190 countries", "#34d399"],
        ["pledge", "by 2010", "#f59e0b"]
      ]);
      L.verdict("<b>Section 13.2.2:</b> biodiversity knows no political boundaries, so its conservation is a collective responsibility of all nations. The historic <b>Convention on Biological Diversity ('The Earth Summit') held in Rio de Janeiro in 1992</b> called upon all nations to conserve biodiversity and sustainably use its benefits. In a follow-up, the <b>World Summit on Sustainable Development held in Johannesburg in 2002</b> saw <b>190 countries</b> pledge to achieve, by <b>2010</b>, a significant reduction in the current rate of biodiversity loss at global, regional and local levels.");
    }
    L.svg(m, "Conservation bench, view: " + st.mode, 300);
  }

  function select(id){
    st.mode = id;
    if(id === "summits"){
      st.year = 2002;
      var s = document.getElementById("l5-year");
      if(s) s.value = "2002";
      L.setVal("l5-year", L.num(2002, 0));
    }
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([
      ["insitu", "1 · In situ"],
      ["exsitu", "2 · Ex situ"],
      ["hotspots", "3 · Hotspots: 34"],
      ["summits", "4 · Summits timeline"]
    ], st.mode, select);
    L.controls(L.slider("l5-year", "Summit timeline year", 1992, 2010, 1, st.year, L.num(st.year, 0)));
    L.onInput("l5-year", function(v){ st.year = v; L.setVal("l5-year", L.num(v, 0)); draw(); });
    L.legend([["#34d399", "in situ"], ["#38bdf8", "ex situ"], ["#f59e0b", "hotspots"], ["#a78bfa", "sacred groves"]]);
    draw();
  }

  window.SIMS.conserve = {mount: mount, draw: draw, select: select, state: st};
})();
