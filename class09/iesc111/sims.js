// iesc111 labs: Reproduction — How Life Continues. Drawings are schematic; counts marked illustrative are not from the textbook.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function clamp11(x, a, b){ return Math.max(a, Math.min(b, x)); }
function leaf11(x, y, ang, s, col){ return '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + (10 * s).toFixed(1) + '" ry="' + (4 * s).toFixed(1) + '" fill="' + (col || "#22c55e") + '" transform="rotate(' + ang + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>'; }

// Lab 1 — Vegetative propagation (Activity 11.1, Figs. 11.2–11.5)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "cutting"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 0.6});
    L.legend([[C.ok, "parent plant"], [C.path, "new growth"]]);
    L.watch({cutting: "Activity 11.1 (Fig. 11.2): a stem cutting with its lower leaves removed, planted at about 45–60°.", grafting: "Activity 11.1 (Fig. 11.3): a yellow rose stem piece (plant B) grafted onto a rooted wild rose (plant A).", layering: "Activity 11.1 (Fig. 11.4): a flexible lemon twig with its middle buried in soil.", tissue: "Bridging Science and Society (Fig. 11.5): banana plantlets grown from a shoot tip (numbers illustrative)."}[id]);
    L.controls(""); L.restart(true);
  }
  function roots(x, y, len){ var m = ""; for(var i = 0; i < 5; i++){ var a = (i - 2) * 0.45 + Math.PI / 2; m += L.line(x, y, x + len * Math.cos(a), y + len * Math.sin(a), "#fde68a", 2); } return m; }
  function draw(t){
    var m = "", msg, G = 220, s1 = clamp11(t, 0, 1), s2 = clamp11(t - 1, 0, 1), s3 = clamp11(t - 2, 0, 1), k;
    if(st.preset === "cutting"){
      var bx = 200 + 160 * s2, by = 170 + 80 * s2, ang = (-90 + 40 * s2) * Math.PI / 180, tx = bx + 140 * Math.cos(ang), ty = by + 140 * Math.sin(ang);
      m += L.line(bx, by, tx, ty, "#15803d", 6);
      for(k = 1; k <= 4; k++){ var fx = bx + (tx - bx) * k / 5, fy = by + (ty - by) * k / 5, op = k <= 2 ? 1 - s1 : 1; if(op > 0.02) m += '<g opacity="' + op.toFixed(2) + '">' + leaf11(fx + 13, fy, -20, 1.4) + leaf11(fx - 13, fy, 20, 1.4) + '</g>'; }
      m += L.rect(0, G, 720, 80, "#7c5a3a");
      if(s3 > 0) m += roots(bx, by, 30 * s3) + leaf11(tx + 10, ty - 8, -35, 1.5 * s3, "#86efac") + leaf11(tx - 10, ty - 8, 35, 1.5 * s3, "#86efac");
      var steps = ["Remove leaves from the lower half", "Plant half its length at about 45–60°", "Roots and new leaves grow"];
      m += L.text(360, 40, steps[Math.min(2, Math.floor(t))], {size: 16, color: C.text, weight: 700});
      L.svg(m, "Stem cutting", 300);
      L.readout([["Step", steps[Math.min(2, Math.floor(t))]], ["Parents", "1"], ["New plant", t >= 3 ? "genetically identical to the parent" : "…", C.path]]);
      msg = t < 3 ? "Growing…" : "The cutting grew roots and new leaves: <b>a new plant from one parent</b>, genetically identical to it.";
    } else if(st.preset === "grafting"){
      m += L.rect(0, G, 720, 80, "#7c5a3a") + L.line(300, G, 300, 90, "#92400e", 10) + roots(300, G + 5, 50) + L.line(300, 150, 250, 110, "#92400e", 5) + L.text(230, 260, "plant A: roots (wild rose)", {size: 12, color: C.text, anchor: "end"});
      var gx = 520 - 220 * clamp11(t / 1.2, 0, 1), gy = 90 - 30 * clamp11(t / 1.2, 0, 1);
      m += L.line(gx, gy, gx, gy - 70, "#16a34a", 7) + leaf11(gx + 12, gy - 40, -25, 1.3) + L.text(gx + 20, gy - 75, "plant B piece", {size: 12, color: C.path, anchor: "start"});
      if(t >= 1.2) m += L.rect(290, 80, 20, 24, "#e5e7eb", ' rx="3" opacity="' + clamp11((t - 1.2) / 0.6, 0, 1).toFixed(2) + '"');
      if(s3 > 0){ for(k = 0; k < 3; k++) m += leaf11(300 + (k % 2 ? 14 : -14), 50 - k * 12, k % 2 ? -30 : 30, 1.4 * s3, "#86efac"); m += L.circle(300, 10 + 20, 12 * s3, "#facc15") + L.circle(300, 30, 5 * s3, "#ca8a04"); }
      L.svg(m, "Grafting a rose", 300);
      L.readout([["Plant A", "roots and lower stem"], ["Plant B", "stem piece of a yellow rose", C.path], ["New flowers", t >= 3 ? "yellow, like plant B" : "…"]]);
      msg = t < 3 ? (t < 1.2 ? "Fitting plant B into the slit…" : t < 1.8 ? "Wrapping the graft…" : "Growing…") : "Plant B's branch grows on plant A's roots and flowers <b>yellow like plant B</b>: the variety is copied exactly.";
    } else if(st.preset === "layering"){
      m += L.line(180, G, 180, 90, "#92400e", 9) + leaf11(165, 90, 30, 1.8) + leaf11(195, 85, -30, 1.8) + leaf11(180, 75, 90, 1.6);
      var cut = t >= 2.5, cy = 150 + 150 * s1;
      m += '<path d="M180 140 Q300 ' + cy.toFixed(1) + ' 430 120" fill="none" stroke="#65a30d" stroke-width="5"' + (cut ? '' : '') + '/>' + leaf11(430, 115, -30, 1.5) + leaf11(445, 125, 20, 1.3);
      m += L.rect(0, G, 720, 80, "#7c5a3a");
      if(s2 > 0) m += roots(305, G + 18, 35 * s2) + L.text(305, 290, "roots after 10–15 days", {size: 12, color: "#fde68a"});
      if(cut) m += L.line(228, 140, 248, 175, C.danger, 4) + L.line(248, 140, 228, 175, C.danger, 4) + L.text(238, 125, "cut", {size: 12, color: C.danger});
      L.svg(m, "Layering a twig", 300);
      L.readout([["Buried part of twig", s1 >= 1 ? "under the soil" : "being bent down"], ["Roots", s2 >= 1 ? "formed" : "…", C.path], ["Cut from parent", cut ? "yes: a separate plant" : "not yet"]]);
      msg = t < 3 ? "Layering…" : "Roots formed where the twig was buried (after about 10–15 days); cut from the parent, it grows as <b>a separate plant</b>.";
    } else {
      m += L.rect(0, G, 720, 80, "#7c5a3a") + L.line(90, G, 90, 80, "#65a30d", 12) + leaf11(70, 80, 40, 3) + leaf11(110, 75, -40, 3) + L.circle(90, 70, 6, C.path);
      m += L.arrow(120, 120, 190, 120, C.faint, 2) + '<ellipse cx="240" cy="150" rx="45" ry="16" fill="#fef9c3" stroke="#cbd5e1"/>' + L.text(240, 185, "culture dish", {size: 12, color: C.muted});
      var n = Math.pow(2, Math.min(6, Math.floor(t * 2 + 1e-9)));
      m += L.arrow(295, 150, 345, 150, C.faint, 2);
      for(k = 0; k < n; k++){ var px = 380 + (k % 8) * 38, py = 60 + Math.floor(k / 8) * 20; m += L.line(px, py + 12, px, py, "#16a34a", 2) + leaf11(px - 4, py, 30, 0.7, "#86efac") + leaf11(px + 4, py, -30, 0.7, "#86efac"); }
      L.svg(m, "Tissue culture plantlets", 300);
      L.readout([["Starting material", "shoot tip (apical meristem)"], ["Plantlets", n + " (illustrative)", C.path], ["Plantlets are", "identical and virus-free"]]);
      msg = t < 3 ? "Multiplying…" : "One shoot tip gives <b>many identical, virus-free plantlets</b> for farmers.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["cutting", "Fig. 11.2: cutting"], ["grafting", "Fig. 11.3: grafting"], ["layering", "Fig. 11.4: layering"], ["tissue", "Fig. 11.5: tissue culture"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.vegetative = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Budding, spores and mitosis (Activities 11.2–11.3, Figs. 11.6–11.8)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "yeast"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "yeast" ? 4 : 3, step: 0.05, speed: 0.6});
    L.legend(id === "mould" ? [[C.ok, "warm, moist chamber"], [C.vel, "refrigerator"]] : [[C.vel, "parent"], [C.path, "new individual"]]);
    L.watch({yeast: "Activity 11.2 (Fig. 11.6): yeast in warm sugar solution; each round, every cell forms one bud (illustrative).", hydra: "Fig. 11.7: a bud forms on a hydra's body.", mould: "Activity 11.3 (Fig. 11.8): moist bread in a warm (about 30 °C) chamber and in a refrigerator, over three days.", mitosis: "Section 11.1: one cell divides by mitosis (two chromosome pairs shown instead of 23)."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "yeast"){
      var g = Math.min(4, Math.floor(t + 1e-9)), fr = g < 4 ? t - g : 0, n = Math.pow(2, g);
      for(i = 0; i < n; i++){ var x = 80 + (i % 8) * 80, y = 90 + Math.floor(i / 8) * 90; m += L.circle(x, y, 18, "#fde68a", ' stroke="#a16207" stroke-width="2"') + (fr > 0.05 ? L.circle(x + 18 + 8 * fr, y - 14, 4 + 8 * fr, "#fef3c7", ' stroke="#a16207" stroke-width="2"') : ""); }
      L.svg(m, "Yeast cells budding", 260);
      L.readout([["Rounds of budding", String(g)], ["Yeast cells", String(n), C.path], ["Offspring", "identical to the parent"]]);
      msg = t < 4 ? "Budding…" : "Each yeast cell formed a bud that separated: 1 → 2 → 4 → 8 → <b>16 cells</b> after four rounds (illustrative).";
    } else if(st.preset === "hydra"){
      var grow = clamp11(t / 2, 0, 1), off = clamp11(t - 2, 0, 1), bx = 395 + 150 * off, by = 175 + 60 * off, ang = 50 * (1 - off);
      m += L.rect(0, 260, 720, 40, "#334155") + '<path d="M345 260 L350 110 Q360 95 370 110 L375 260 Z" fill="#a3e635"/>';
      for(i = 0; i < 5; i++) m += '<path d="M360 102 q' + ((i - 2) * 22) + ' -40 ' + ((i - 2) * 34) + ' -20" fill="none" stroke="#a3e635" stroke-width="4"/>';
      if(grow > 0.05) m += '<g transform="translate(' + bx.toFixed(1) + ' ' + by.toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(' + (0.35 * grow + 0.15).toFixed(2) + ')"><path d="M-12 0 L-8 -120 Q0 -135 8 -120 L12 0 Z" fill="#bef264"/>' + [0, 1, 2, 3].map(function(j){ return '<path d="M0 -125 q' + ((j - 1.5) * 20) + ' -40 ' + ((j - 1.5) * 32) + ' -18" fill="none" stroke="#bef264" stroke-width="5"/>'; }).join("") + '</g>';
      L.svg(m, "Hydra budding", 300);
      L.readout([["Bud", grow < 1 ? "growing" : off < 1 ? "separating" : "separated", C.path], ["Parents", "1"], ["New hydra", t >= 3 ? "lives independently" : "…"]]);
      msg = t < 3 ? "Budding…" : "A bud grew from the side of the hydra and <b>separated to live on its own</b>: budding.";
    } else if(st.preset === "mould"){
      var day = clamp11(t, 0, 3);
      [[190, C.ok, "warm, moist (about 30 °C)", 12 + 22 * day], [530, C.vel, "refrigerator", 2 + 1.2 * day]].forEach(function(b){
        m += L.rect(b[0] - 130, 50, 260, 180, "#1e293b", ' rx="10" stroke="' + b[1] + '" stroke-width="2"') + L.rect(b[0] - 90, 90, 180, 110, "#d6b370", ' rx="16"') + L.text(b[0], 255, b[2], {size: 13, color: b[1]});
        if(b[3] > 3){ m += L.circle(b[0], 145, b[3], "#475569", ' opacity="0.85"'); if(b[3] > 40) for(i = 0; i < 8; i++){ var a = i * Math.PI / 4; m += L.line(b[0], 145, b[0] + 44 * Math.cos(a), 145 + 44 * Math.sin(a), "#e2e8f0", 1.5) + L.circle(b[0] + 48 * Math.cos(a), 145 + 48 * Math.sin(a), 4, "#111827"); } }
        else m += L.circle(b[0], 145, b[3], "#475569");
      });
      L.svg(m, "Bread mould in warm and cold conditions", 280);
      L.readout([["Day", L.num(day, 1)], ["Warm, moist chamber", day > 2 ? "fuzzy mould with spore sacs" : day > 0.5 ? "mould spreading" : "fresh", C.ok], ["Refrigerator", "hardly any growth", C.vel]]);
      msg = t < 3 ? "Days passing…" : "In the warm, moist chamber spores from the air grew into mould with spore sacs by day 3; <b>in the cold they hardly grew</b>. This is why we refrigerate food.";
    } else {
      var dup = clamp11(t, 0, 1), sep = clamp11(t - 1, 0, 1), cols = ["#ef4444", "#3b82f6"];
      var cellW = 90 + 110 * sep;
      if(sep < 1) m += '<ellipse cx="360" cy="150" rx="' + cellW.toFixed(1) + '" ry="80" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>';
      else m += L.circle(220, 150, 80, "#1e293b", ' stroke="#94a3b8" stroke-width="3"') + L.circle(500, 150, 80, "#1e293b", ' stroke="#94a3b8" stroke-width="3"');
      [-1, 1].forEach(function(side){
        var cx = sep < 1 ? 360 + side * (dup > 0.5 ? 140 * sep : 0) : (side < 0 ? 220 : 500);
        for(var p = 0; p < 2; p++) for(var c = 0; c < 2; c++){
          var x = cx + (p - 0.5) * 36 + (c ? 8 : -8), y = 150 + (c ? 22 : -22);
          if(side > 0 && dup < 0.5 && sep === 0) continue;
          m += L.line(x, y - 18, x, y + 18, cols[p], 7);
        }
      });
      L.svg(m, "Mitosis", 300);
      L.readout([["Parent cell", "2 pairs (46 chromosomes in humans)"], ["Daughter cells", t >= 2 ? "2, each with the same chromosomes" : "forming…", C.path], ["Genetically", "identical: clones"]]);
      msg = t < 3 ? "Dividing…" : "Mitosis gave <b>two identical daughter cells</b>, each with the same chromosomes as the parent (46 in humans).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["yeast", "Activity 11.2: yeast"], ["hydra", "Fig. 11.7: hydra"], ["mould", "Activity 11.3: bread mould"], ["mitosis", "Mitosis makes clones"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.asexual = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Meiosis and variation (Activity 11.4, Fig. 11.9)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "beads", n: 3};
  var PAIRS = [["#86efac", "#15803d", "blonde", "black hair"], ["#93c5fd", "#1d4ed8", "straight", "curly"], ["#fca5a5", "#b91c1c", "brown eyes", "black eyes"]];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "beads" ? {maxT: 8, step: 1, speed: 1.5} : id === "nomeiosis" ? {maxT: 3, step: 1, speed: 0.8} : {maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "beads" ? [["#86efac", "light bead"], ["#15803d", "dark bead"]] : [[C.vel, "chromosome count"]]);
    L.watch({beads: "Activity 11.4 (Fig. 11.9): pick one bead from each of three pairs.", count: "Choose how many chromosome pairs to include; each pair doubles the combinations.", halving: "Human cells: meiosis forms gametes, and fertilisation joins them.", nomeiosis: "What if gametes carried all 46 chromosomes?"}[id]);
    if(id === "count"){
      L.controls(L.slider("mz-n", "Chromosome pairs", 1, 23, 1, st.n, st.n + " pairs"));
      L.onInput("mz-n", function(v){ st.n = v; L.setVal("mz-n", v + " pairs"); App.resetTimeline(); App.play(); });
    } else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "beads"){
      PAIRS.forEach(function(p, j){ var y = 70 + j * 70; m += L.circle(50, y, 13, p[0]) + L.circle(85, y, 13, p[1]) + L.text(110, y + 5, p[2] + " / " + p[3], {size: 12, color: C.muted, anchor: "start"}); });
      var k = Math.floor(t + 1e-9);
      for(i = 0; i < 8; i++){
        var x = 330 + (i % 4) * 95, y0 = 60 + Math.floor(i / 4) * 120, bits = [(i >> 2) & 1, (i >> 1) & 1, i & 1];
        if(i < k){ m += L.rect(x - 40, y0 - 15, 80, 100, "#1e293b", ' rx="8"'); bits.forEach(function(bt, j){ m += L.circle(x, y0 + 5 + j * 26, 10, PAIRS[j][bt]); }); m += L.text(x, y0 + 100, String(i + 1), {size: 11, color: C.muted}); }
        else m += L.rect(x - 40, y0 - 15, 80, 100, "none", ' rx="8" stroke="#334155" stroke-dasharray="4 4"');
      }
      L.svg(m, "Bead combinations", 300);
      L.readout([["Pairs", "3"], ["Combinations found", String(Math.min(8, k)), C.path], ["Total possible", "2 × 2 × 2 = 8"]]);
      msg = t < 8 ? "Finding combinations…" : "Picking one bead from each of 3 pairs gives <b>8 combinations</b> (2 × 2 × 2), just as meiosis sends one chromosome of each pair into a gamete.";
    } else if(st.preset === "count"){
      var n = st.n, total = Math.pow(2, n), f = clamp11(t / 3, 0, 1);
      m += L.text(360, 90, "2 multiplied by itself " + n + " time" + (n > 1 ? "s" : ""), {size: 16, color: C.muted}) + L.text(360, 160, String(Math.round(Math.pow(2, n * f))), {size: 52, color: C.path, weight: 700, mono: true});
      m += L.rect(60, 220, 600, 16, "#1e293b", ' rx="8"') + L.rect(60, 220, 600 * (n / 23) * f, 16, C.vel, ' rx="8"') + L.text(60, 260, "1 pair", {size: 11, color: C.muted, anchor: "start"}) + L.text(660, 260, "23 pairs (humans)", {size: 11, color: C.muted, anchor: "end"});
      L.svg(m, "Number of combinations", 280);
      L.readout([["Chromosome pairs", String(n)], ["Combinations", String(total), C.path], ["Humans (23 pairs)", "8388608"]]);
      msg = "With " + n + " pair" + (n > 1 ? "s" : "") + " there are <b>" + total + " combinations</b> of chromosomes in a gamete. Every extra pair doubles the variety.";
    } else if(st.preset === "halving"){
      var a = clamp11(t, 0, 1), b = clamp11(t - 1, 0, 1), c = clamp11(t - 2, 0, 1);
      if(t < 1){ m += L.circle(160, 150, 60, "#1e293b", ' stroke="#f472b6" stroke-width="3"') + L.text(160, 158, "46", {size: 26, color: C.text, weight: 700}) + L.text(160, 235, "mother's cell", {size: 12, color: C.muted}); m += L.circle(560, 150, 60, "#1e293b", ' stroke="#60a5fa" stroke-width="3"') + L.text(560, 158, "46", {size: 26, color: C.text, weight: 700}) + L.text(560, 235, "father's cell", {size: 12, color: C.muted}); }
      else if(t < 2.7){ var ex = 160 + 170 * b, sx = 560 - 170 * b; m += L.circle(ex, 150, 40, "#1e293b", ' stroke="#f472b6" stroke-width="3"') + L.text(ex, 157, "23", {size: 22, color: C.text, weight: 700}) + L.text(ex, 210, "egg", {size: 12, color: "#f472b6"}) + L.circle(sx, 150, 20, "#1e293b", ' stroke="#60a5fa" stroke-width="3"') + L.text(sx, 156, "23", {size: 14, color: C.text, weight: 700}) + L.text(sx, 190, "sperm", {size: 12, color: "#60a5fa"}); }
      else m += L.circle(360, 150, 55, "#1e293b", ' stroke="' + C.ok + '" stroke-width="4"') + L.text(360, 158, "46", {size: 28, color: C.text, weight: 700}) + L.text(360, 230, "zygote", {size: 13, color: C.ok});
      L.svg(m, "Chromosome numbers through meiosis and fertilisation", 270);
      L.readout([["Body cells", "46"], ["After meiosis (gametes)", t >= 1 ? "23 each" : "…", C.path], ["Zygote", t >= 2.7 ? "23 + 23 = 46" : "…", C.ok]]);
      msg = t < 3 ? "Meiosis, then fertilisation…" : "46 → <b>23 in each gamete</b> → 46 in the zygote: the chromosome number stays the same generation after generation.";
    } else {
      var gnum = Math.floor(t + 1e-9);
      for(i = 0; i <= gnum; i++){ var val = 46 * Math.pow(2, i); m += L.rect(160, 50 + i * 55, val * 1.2, 34, i ? C.danger : C.vel, ' rx="5"') + L.text(150, 72 + i * 55, "generation " + (i + 1), {size: 12, color: C.text, anchor: "end"}) + L.text(170 + val * 1.2, 72 + i * 55, String(val), {size: 14, color: C.text, anchor: "start", weight: 700}); }
      L.svg(m, "Chromosome numbers without meiosis", 280);
      L.readout([["Generation", String(gnum + 1)], ["Chromosomes per cell", String(46 * Math.pow(2, gnum)), C.danger]]);
      msg = t < 3 ? "Doubling…" : "Without meiosis the number would double every generation: 46 → 92 → 184 → <b>368</b>. Meiosis prevents this.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["beads", "Activity 11.4: beads"], ["count", "Counting combinations"], ["halving", "46 → 23 → 46"], ["nomeiosis", "What if there were no meiosis?"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.meiosis = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Flowers and pollination (Figs. 11.10–11.13, Activity 11.6)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "parts"};
  function flower(x, y, s, bud){
    var m = "";
    m += '<path d="M' + (x - 30 * s) + ' ' + y + ' L' + x + ' ' + (y - 25 * s) + ' L' + (x + 30 * s) + ' ' + y + ' Z" fill="#16a34a"/>';
    if(!bud){ m += '<ellipse cx="' + (x - 45 * s) + '" cy="' + (y - 55 * s) + '" rx="' + (22 * s) + '" ry="' + (50 * s) + '" fill="#f9a8d4" transform="rotate(-25 ' + (x - 45 * s) + ' ' + (y - 55 * s) + ')"/><ellipse cx="' + (x + 45 * s) + '" cy="' + (y - 55 * s) + '" rx="' + (22 * s) + '" ry="' + (50 * s) + '" fill="#f9a8d4" transform="rotate(25 ' + (x + 45 * s) + ' ' + (y - 55 * s) + ')"/>'; }
    else m += '<ellipse cx="' + x + '" cy="' + (y - 40 * s) + '" rx="' + (20 * s) + '" ry="' + (38 * s) + '" fill="#86efac"/>';
    if(!bud){
      m += '<ellipse cx="' + x + '" cy="' + (y - 20 * s) + '" rx="' + (16 * s) + '" ry="' + (14 * s) + '" fill="#a3e635"/>' + L.circle(x - 5 * s, y - 20 * s, 3 * s, "#fef9c3") + L.circle(x + 5 * s, y - 22 * s, 3 * s, "#fef9c3");
      m += L.line(x, y - 32 * s, x, y - 95 * s, "#65a30d", 3 * s) + '<ellipse cx="' + x + '" cy="' + (y - 100 * s) + '" rx="' + (8 * s) + '" ry="' + (5 * s) + '" fill="#84cc16"/>';
      [-1, 1].forEach(function(d){ m += L.line(x + d * 10 * s, y - 25 * s, x + d * 22 * s, y - 80 * s, "#fde68a", 2.5 * s) + '<ellipse cx="' + (x + d * 22 * s) + '" cy="' + (y - 84 * s) + '" rx="' + (6 * s) + '" ry="' + (9 * s) + '" fill="#facc15"/>'; });
    }
    return m;
  }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "parts" ? {maxT: 4, step: 1, speed: 1} : {maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "selfcross" ? [["#facc15", "pollen"], [C.path, "pollen path"]] : [[C.ok, "female parts"], ["#facc15", "male parts"]]);
    L.watch({parts: "Figs. 11.10–11.11: longitudinal section of a flower.", bagging: "Activity 11.6 (Fig. 11.12): five treatments on a pea plant.", selfcross: "Fig. 11.13: self-pollination on one plant, then cross-pollination between two plants by an insect.", agents: "Section 11.2.4: four kinds of pollinators and the features of their flowers."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "parts"){
      var k = Math.floor(t + 1e-9);
      m += L.line(300, 290, 300, 250, "#15803d", 6) + flower(300, 250, 2);
      var labels = [["sepals (protect the bud)", 250, 250], ["petals (attract)", 180, 150], ["stamen: anther + filament (male)", 350, 80], ["pistil: stigma, style, ovary with ovules (female)", 300, 45]];
      labels.forEach(function(lb, j){ if(j < k || (t >= 4 && j <= 3)){ var ly = 60 + j * 60; m += L.line(lb[1] + 60, lb[2], 470, ly, "#94a3b8", 1) + L.text(478, ly + 4, lb[0], {size: 13, color: j === 2 ? "#facc15" : j === 3 ? C.ok : C.text, anchor: "start"}); } });
      L.svg(m, "Parts of a flower", 300);
      L.readout([["Outer whorl", "sepals"], ["Coloured", "petals"], ["Male", "stamens", "#facc15"], ["Female", "pistil", C.ok]]);
      msg = t < 4 ? "Labelling…" : "A complete flower has sepals, petals, <b>stamens (male)</b> and a pistil (female: stigma, style, and an ovary containing ovules).";
    } else if(st.preset === "bagging"){
      var names = [["bud, bagged", ""], ["bud, stamens", "removed, bagged"], ["flower, stamens", "removed, bagged"], ["flower, bagged", ""], ["flower, open", ""]], res = [true, false, true, true, true], done = t >= 2;
      names.forEach(function(nm, j){
        var x = 80 + j * 140;
        m += L.line(x, 250, x, 160, "#15803d", 4);
        if(!done) m += flower(x, 160, 0.55, j < 2);
        else if(res[j]) m += '<ellipse cx="' + (x + 8) + '" cy="130" rx="14" ry="38" fill="#4ade80" transform="rotate(15 ' + (x + 8) + ' 130)"/>' + [0, 1, 2].map(function(q){ return L.circle(x + 4 + q * 3, 105 + q * 22, 5, "#166534"); }).join("");
        else m += '<ellipse cx="' + x + '" cy="150" rx="8" ry="14" fill="#78716c"/>';
        if(j < 4) m += L.rect(x - 40, 60, 80, 110, "#f8fafc", ' rx="10" opacity="0.18" stroke="#e2e8f0" stroke-dasharray="4 3"');
        m += L.text(x, 272, nm[0], {size: 11, color: C.text}) + L.text(x, 287, nm[1], {size: 11, color: C.text});
        if(done) m += L.text(x, 45, res[j] ? "pod" : "no pod", {size: 13, color: res[j] ? C.ok : C.danger, weight: 700});
      });
      L.svg(m, "Pea pollination experiment", 300);
      L.readout(names.map(function(nm, j){ return [nm[0] + (nm[1] ? " " + nm[1] : ""), done ? (res[j] ? "pod formed" : "no pod") : "…", res[j] ? C.ok : C.danger]; }));
      msg = !done ? "Waiting for pods…" : "Pods formed in every treatment except <b>the bud with stamens removed</b>: pollen must reach the stigma (pollination) for fruits to form.";
    } else if(st.preset === "selfcross"){
      m += L.rect(0, 270, 720, 30, "#3f6212");
      [[200, "plant 1"], [520, "plant 2"]].forEach(function(p){ m += L.line(p[0], 270, p[0], 190, "#15803d", 5) + flower(p[0], 190, 0.9) + L.text(p[0], 290, p[1], {size: 12, color: C.text}); });
      var a = clamp11(t / 1.5, 0, 1), bq = clamp11((t - 1.5) / 1.5, 0, 1);
      if(t < 1.5){ m += L.circle(200 - 20 + 20 * a, 190 - 75 - 15 * a, 5, "#facc15"); m += L.text(200, 40, "self-pollination: same plant", {size: 15, color: C.path, weight: 700}); }
      else { var bx = 200 + 320 * bq, by = 110 - 60 * Math.sin(Math.PI * bq); m += '<ellipse cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" rx="12" ry="8" fill="#facc15" stroke="#111" stroke-width="2"/>' + L.circle(bx + 4, by + 8, 4, "#fde047") + L.text(360, 40, "cross-pollination: another plant", {size: 15, color: C.path, weight: 700}); }
      L.svg(m, "Self- and cross-pollination", 300);
      L.readout([["Self-pollination", "pollen to a stigma on the same plant"], ["Cross-pollination", "pollen to a flower of another plant of the same kind", C.path]]);
      msg = t < 3 ? "Moving pollen…" : "Self-pollination stays within one plant; <b>cross-pollination</b> carries pollen to a flower on another plant of the same kind.";
    } else {
      var P = [["wind", "maize, wheat, rice", "light, tiny, plentiful pollen; feathery stigma"], ["water", "Vallisneria, Hydrilla", "pollen carried by currents"], ["insects", "sunflower, marigold", "colour, nectar, scent; sticky pollen"], ["birds", "coral tree, hibiscus", "sunbirds, Indian white-eye"]];
      P.forEach(function(p, j){
        var x0 = 20 + j * 175, cx = x0 + 80;
        m += L.rect(x0, 30, 160, 180, "#1e293b", ' rx="10"') + L.text(cx, 52, p[0], {size: 14, color: C.path, weight: 700});
        if(j === 0){ m += L.line(cx, 200, cx, 80, "#a3e635", 3); for(i = 0; i < 14; i++){ var ph = (t * 0.6 + i / 14) % 1; m += L.circle(x0 + 10 + ph * 140, 80 + (i * 29) % 90, 1.8, "#fde68a"); } }
        else if(j === 1){ m += '<path d="' + [0, 1, 2, 3].map(function(q){ return (q ? "Q" : "M" + (x0 + 10) + " 150 Q") + (x0 + 30 + q * 40) + " " + (140 + (q % 2 ? 12 : -12)) + " " + (x0 + 50 + q * 40) + " 150"; }).join(" ").replace(/Q(\d)/, "Q$1") + '" fill="none" stroke="#38bdf8" stroke-width="3"/>' + L.circle(x0 + 20 + ((t * 40) % 120), 146, 4, "#fde68a"); }
        else if(j === 2){ m += flower(cx, 190, 0.55) + '<ellipse cx="' + (cx + 30 * Math.cos(t * 3)).toFixed(1) + '" cy="' + (100 + 10 * Math.sin(t * 5)).toFixed(1) + '" rx="10" ry="7" fill="#facc15" stroke="#111" stroke-width="2"/>'; }
        else { m += L.line(cx, 200, cx, 120, "#15803d", 3) + L.circle(cx, 110, 18, "#dc2626") + '<path d="M' + (cx + 40) + ' 90 q-20 -10 -30 5 l-8 2 l8 3 q10 12 30 0 z" fill="#65a30d"/>'; }
        m += L.text(cx, 232, p[1], {size: 11, color: C.text}) + L.text(cx, 250, p[2].split("; ")[0], {size: 10, color: C.muted}) + L.text(cx, 265, p[2].split("; ")[1] || "", {size: 10, color: C.muted});
      });
      L.svg(m, "Pollinators", 280);
      L.readout(P.map(function(p){ return [p[0], p[1]]; }));
      msg = t < 3 ? "Pollinating…" : "Wind: light, plentiful pollen and feathery stigmas; water: Vallisneria and Hydrilla; insects: colour, nectar, scent and sticky pollen; birds: <b>coral tree and hibiscus</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["parts", "Fig. 11.10: parts of a flower"], ["bagging", "Activity 11.6: pea experiment"], ["selfcross", "Fig. 11.13: self and cross"], ["agents", "Pollinators"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.flower = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Fertilisation, fruits and seeds (Figs. 11.14–11.16, Activity 11.7)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "tube"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "strategy" ? [[C.vel, "wind-pollinated"], [C.path, "insect-pollinated"]] : [["#facc15", "pollen / male gamete"], ["#f472b6", "egg / zygote"]]);
    L.watch({tube: "Fig. 11.14: a pollen grain germinates on the stigma.", fruit: "Fig. 11.15: after fertilisation, the ovary and ovules change.", strategy: "Activity 11.7 (Table 11.3): pollen grains released per seed formed, on a logarithmic scale.", dispersal: "Fig. 11.16: madar and dandelion seeds."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "tube"){
      m += '<ellipse cx="360" cy="45" rx="30" ry="12" fill="#84cc16"/>' + L.line(350, 55, 350, 205, "#65a30d", 3) + L.line(370, 55, 370, 205, "#65a30d", 3) + '<ellipse cx="360" cy="245" rx="70" ry="45" fill="#a3e635" opacity="0.55" stroke="#65a30d" stroke-width="3"/>';
      m += '<ellipse cx="360" cy="252" rx="22" ry="16" fill="#fef9c3"/>' + L.text(450, 285, "ovule in ovary", {size: 12, color: C.muted, anchor: "start"}) + L.text(410, 48, "stigma", {size: 12, color: C.muted, anchor: "start"}) + L.text(390, 130, "style", {size: 12, color: C.muted, anchor: "start"});
      var grow = clamp11(t / 2, 0, 1), tipY = 45 + 200 * grow, pts = [];
      for(i = 0; i <= 20; i++){ var yy = 45 + (tipY - 45) * i / 20; pts.push((362 + 3 * Math.sin(i)).toFixed(1) + "," + yy.toFixed(1)); }
      m += L.circle(372, 36, 9, "#facc15", ' stroke="#a16207" stroke-width="2"') + '<polyline points="' + pts.join(" ") + '" fill="none" stroke="#fde68a" stroke-width="3"/>';
      var fused = t >= 2.6;
      if(t >= 2 && !fused) m += L.circle(362, 45 + 200 * clamp11((t - 2) / 0.6, 0, 1), 5, "#facc15");
      m += L.circle(360, 254, fused ? 9 : 5, fused ? "#a855f7" : "#f472b6") + (fused ? L.text(260, 258, "zygote", {size: 13, color: "#a855f7", weight: 700, anchor: "end"}) : L.text(260, 258, "egg cell", {size: 12, color: "#f472b6", anchor: "end"}));
      L.svg(m, "Pollen tube and fertilisation", 300);
      L.readout([["Pollen tube", grow < 1 ? "growing down the style" : "reached the ovule", C.path], ["Male gamete", t < 2 ? "waiting" : fused ? "fused with the egg" : "moving down the tube"], ["Result", fused ? "zygote → embryo" : "…", "#a855f7"]]);
      msg = t < 3 ? "Growing the pollen tube…" : "The pollen tube reached the ovule, and the male gamete fused with the egg: <b>fertilisation</b>, forming a zygote.";
    } else if(st.preset === "fruit"){
      var f = clamp11(t / 3, 0, 1), rx = 40 + 90 * f, ry = 30 + 65 * f, col = f < 0.5 ? "#a3e635" : "#fb923c";
      if(f < 0.7) m += '<ellipse cx="' + (360 - 60) + '" cy="110" rx="22" ry="48" fill="#f9a8d4" opacity="' + (1 - f / 0.7).toFixed(2) + '" transform="rotate(-25 300 110)"/><ellipse cx="420" cy="110" rx="22" ry="48" fill="#f9a8d4" opacity="' + (1 - f / 0.7).toFixed(2) + '" transform="rotate(25 420 110)"/>';
      m += '<ellipse cx="360" cy="170" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" fill="' + col + '" stroke="#65a30d" stroke-width="3"/>';
      for(i = 0; i < 5; i++){ var a = i * 2 * Math.PI / 5; m += '<ellipse cx="' + (360 + rx * 0.45 * Math.cos(a)).toFixed(1) + '" cy="' + (170 + ry * 0.45 * Math.sin(a)).toFixed(1) + '" rx="' + (4 + 8 * f).toFixed(1) + '" ry="' + (3 + 5 * f).toFixed(1) + '" fill="' + (f < 0.5 ? "#fef9c3" : "#78350f") + '"/>'; }
      m += L.text(360, 290, f >= 1 ? "fruit with seeds" : "ovary with ovules", {size: 14, color: C.text, weight: 700});
      L.svg(m, "Ovary becoming a fruit", 300);
      L.readout([["Ovary", f >= 1 ? "became the fruit" : "enlarging", C.path], ["Ovules", f >= 1 ? "became seeds" : "developing"], ["Petals", f > 0.7 ? "fallen" : "withering"]]);
      msg = t < 3 ? "Developing…" : "After fertilisation the <b>ovary became the fruit</b> and the ovules became seeds (Fig. 11.15).";
    } else if(st.preset === "strategy"){
      var X = function(v){ return 150 + (Math.log(v) / Math.LN10 - 1) * 125; }, g = clamp11(t / 2, 0, 1);
      [10, 100, 1000, 10000, 100000].forEach(function(v){ m += L.line(X(v), 60, X(v), 230, "#334155", 1) + L.text(X(v), 250, String(v), {size: 11, color: C.muted}); });
      m += L.text(360, 275, "pollen grains per seed (log scale)", {size: 12, color: C.muted});
      [[100, "wind: maize, wheat", 2500, 20000, C.vel], [180, "insect: sunflower", 20, 50, C.path]].forEach(function(r){
        var x1 = X(r[2]), x2 = X(r[2]) + (X(r[3]) - X(r[2])) * g;
        m += L.text(140, r[0] + 5, r[1], {size: 13, color: C.text, anchor: "end"}) + L.rect(x1, r[0] - 16, Math.max(2, x2 - x1), 32, r[4], ' rx="5"');
        if(g >= 1) m += L.text(X(r[3]) + 8, r[0] + 5, r[2] + "–" + r[3], {size: 13, color: r[4], weight: 700, anchor: "start"});
      });
      L.svg(m, "Pollen per seed", 290);
      L.readout([["Wind: 5,00,000–10,00,000 pollen, 50–200 seeds", "about 2,500–20,000 per seed", C.vel], ["Insect: 20,000–40,000 pollen, 800–1,000 seeds", "about 20–50 per seed", C.path]]);
      msg = t < 2 ? "Calculating…" : "Wind pollination needs about 2,500–20,000 pollen grains per seed, insects only about 20–50: insect pollination is <b>far more efficient</b>, while wind relies on huge numbers.";
    } else {
      for(i = 0; i < 2; i++){
        var ph = t * 0.35 + i * 0.4, x = 80 + ((ph * 600) % 640), y = 100 + i * 90 + 25 * Math.sin(t * 2 + i);
        if(i === 0) m += '<ellipse cx="' + x.toFixed(1) + '" cy="' + (y + 18).toFixed(1) + '" rx="6" ry="9" fill="#78350f"/>' + [0, 1, 2, 3, 4, 5, 6].map(function(q){ return L.line(x, y + 10, x + (q - 3) * 9, y - 22, "#f8fafc", 1.5); }).join("");
        else m += L.line(x, y + 25, x, y - 5, "#a8a29e", 1.5) + '<ellipse cx="' + x.toFixed(1) + '" cy="' + (y + 28).toFixed(1) + '" rx="3" ry="6" fill="#78350f"/>' + [0, 1, 2, 3, 4, 5, 6, 7].map(function(q){ var a = Math.PI + q * Math.PI / 7; return L.line(x, y - 5, x + 20 * Math.cos(a), y - 5 + 14 * Math.sin(a), "#f8fafc", 1.3); }).join("");
        m += L.text(x, y + 50, i ? "dandelion" : "madar", {size: 11, color: C.muted});
      }
      for(i = 0; i < 4; i++) m += L.arrow(40 + ((t * 120 + i * 180) % 680), 270, 90 + ((t * 120 + i * 180) % 680), 270, C.faint, 2);
      L.svg(m, "Seeds carried by wind", 300);
      L.readout([["Madar (calotropis)", "silky hairs"], ["Dandelion", "parachute of fine hairs"], ["Dispersed by", "wind", C.path]]);
      msg = t < 3 ? "Drifting…" : "Silky hairs and parachutes let madar and dandelion seeds <b>ride the wind</b> far from the parent (Pause and Ponder 2).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["tube", "Fig. 11.14: pollen tube"], ["fruit", "Fig. 11.15: ovary to fruit"], ["strategy", "Activity 11.7: pollen per seed"], ["dispersal", "Fig. 11.16: seed dispersal"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.fertilisation = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Reproductive strategies in animals (Table 11.4, Fig. 11.17)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "external"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "butterfly" ? {maxT: 4, step: 0.05, speed: 0.6} : {maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "table" ? [[C.vel, "eggs at a time (log scale)"]] : [[C.path, "eggs / young"], [C.danger, "lost"]]);
    L.watch({external: "Section 11.3: frog eggs and sperm released into a pond (dots stand for many eggs; illustrative).", internal: "Section 11.3: a bird lays a few eggs after internal fertilisation (illustrative).", table: "Table 11.4: eggs produced at a time and survival of young.", butterfly: "Fig. 11.17: the life cycle of a butterfly."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "external"){
      m += L.rect(20, 60, 680, 220, "#0e7490", ' rx="20" opacity="0.6"') + '<ellipse cx="90" cy="120" rx="40" ry="24" fill="#65a30d"/>';
      var lostFrac = clamp11((t - 1) / 1.5, 0, 1), laid = clamp11(t, 0, 1);
      for(i = 0; i < 120; i++){
        if(i / 120 > laid) break;
        var x = 150 + (i * 47) % 520, y = 90 + (i * 31) % 170, lost = (i % 12) !== 0 && (i * 7) % 100 / 100 < lostFrac;
        if(lost) m += L.circle(x + 60 * lostFrac, y, 3, C.danger, ' opacity="' + (0.8 - 0.6 * lostFrac).toFixed(2) + '"');
        else m += (t >= 2.5 && i % 12 === 0) ? '<ellipse cx="' + x + '" cy="' + y + '" rx="7" ry="4" fill="#1f2937"/>' + L.line(x + 6, y, x + 14, y + 2, "#1f2937", 2) : L.circle(x, y, 4, "#f8fafc");
      }
      m += '<ellipse cx="' + (620 - 80 * lostFrac).toFixed(1) + '" cy="240" rx="28" ry="12" fill="#f97316"/>';
      L.svg(m, "External fertilisation in a pond", 300);
      L.readout([["Eggs laid (frog)", "5,000–50,000 at a time"], ["Lost to currents and predators", t >= 2.5 ? "most" : "…", C.danger], ["Survival", "low", C.path]]);
      msg = t < 3 ? "In the pond…" : "External fertilisation: thousands of eggs, but most are lost to currents or eaten, so <b>survival is low</b>.";
    } else if(st.preset === "internal"){
      m += '<ellipse cx="360" cy="230" rx="140" ry="40" fill="#92400e"/>' + '<ellipse cx="360" cy="215" rx="110" ry="25" fill="#78350f"/>';
      var hatch = t >= 2;
      for(i = 0; i < 4; i++){ var ex = 300 + i * 40; if(t >= 0.2 + i * 0.2) m += hatch ? L.circle(ex, 200, 14, "#fde047") + L.circle(ex + 5, 195, 2, "#111") + '<polygon points="' + (ex + 12) + ',198 ' + (ex + 20) + ',200 ' + (ex + 12) + ',203" fill="#f97316"/>' : '<ellipse cx="' + ex + '" cy="205" rx="13" ry="17" fill="#f1f5f9"/>'; }
      if(t >= 1 && t < 2) m += '<ellipse cx="360" cy="160" rx="80" ry="40" fill="#64748b"/>' + L.circle(420, 130, 18, "#64748b");
      L.svg(m, "Bird eggs in a nest", 300);
      L.readout([["Eggs laid (bird)", "1–15 at a time"], ["Protection", "fertilised inside the body; eggs cared for"], ["Survival", "moderate to high", C.path]]);
      msg = t < 3 ? (t < 1 ? "Laying eggs…" : t < 2 ? "Incubating…" : "Hatching…") : "Internal fertilisation: few eggs, well protected, so <b>survival is moderate to high</b>.";
    } else if(st.preset === "table"){
      var X = function(v){ return 170 + Math.log(v) / Math.LN10 * 100; }, g = clamp11(t / 2, 0, 1);
      [1, 10, 100, 1000, 10000, 100000].forEach(function(v){ m += L.line(X(v), 40, X(v), 250, "#334155", 1) + L.text(X(v), 268, String(v), {size: 11, color: C.muted}); });
      [["Fish", 100, 1000, "100s–1000s", "low", C.danger], ["Frog", 5000, 50000, "5,000–50,000", "low", C.danger], ["Lizard", 2, 20, "2–20", "moderate", C.acc], ["Bird", 1, 15, "1–15", "moderate to high", C.ok]].forEach(function(r, j){
        var y = 65 + j * 50, x1 = X(r[1]), x2 = x1 + (X(r[2]) - x1) * g;
        m += L.text(160, y + 5, r[0], {size: 13, color: C.text, anchor: "end"}) + L.rect(x1, y - 12, Math.max(3, x2 - x1), 24, C.vel, ' rx="4"');
        if(g >= 1) m += L.text(X(r[2]) + 8, y + 5, r[3] + " · survival " + r[4], {size: 12, color: r[5], anchor: "start"});
      });
      L.svg(m, "Eggs and survival in four animals", 290);
      L.readout([["Fish", "100s–1000s eggs; low survival"], ["Frog", "5,000–50,000 eggs; low survival"], ["Lizard", "2–20 eggs; moderate"], ["Bird", "1–15 eggs; moderate to high", C.ok]]);
      msg = t < 2 ? "Plotting Table 11.4…" : "More eggs go with lower survival: frogs lay <b>5,000–50,000</b> eggs at a time, birds only 1–15.";
    } else {
      var stages = [["egg", -90], ["larva (feeding)", 0], ["pupa", 90], ["adult", 180]], s = Math.min(3, Math.floor(t + 1e-9)), ang = (-90 + 90 * clamp11(t, 0, 4)) * Math.PI / 180;
      m += '<circle cx="300" cy="150" r="105" fill="none" stroke="#475569" stroke-width="3" stroke-dasharray="8 6"/>';
      stages.forEach(function(sg, j){
        var a = sg[1] * Math.PI / 180, x = 300 + 105 * Math.cos(a), y = 150 + 105 * Math.sin(a), on = j <= s;
        m += L.circle(x, y, 26, on ? "#1e293b" : "#0f172a", ' stroke="' + (on ? C.path : "#334155") + '" stroke-width="3"');
        if(j === 0) m += '<ellipse cx="' + x + '" cy="' + y + '" rx="7" ry="10" fill="#f8fafc"/>';
        else if(j === 1) m += [0, 1, 2, 3].map(function(q){ return L.circle(x - 12 + q * 8, y, 5, "#4ade80"); }).join("");
        else if(j === 2) m += '<ellipse cx="' + x + '" cy="' + y + '" rx="9" ry="16" fill="#a16207"/>';
        else m += '<ellipse cx="' + (x - 9) + '" cy="' + y + '" rx="10" ry="14" fill="#f97316"/><ellipse cx="' + (x + 9) + '" cy="' + y + '" rx="10" ry="14" fill="#f97316"/>' + L.line(x, y - 12, x, y + 12, "#111", 3);
        m += L.text(x + (j === 1 ? 40 : j === 3 ? -40 : 0), y + (j === 0 ? -36 : j === 2 ? 46 : 5), sg[0], {size: 12, color: on ? C.text : C.muted, anchor: j === 1 ? "start" : j === 3 ? "end" : "middle"});
      });
      m += L.circle(300 + 105 * Math.cos(ang), 150 + 105 * Math.sin(ang), 7, "#facc15");
      L.svg(m, "Butterfly life cycle", 300);
      L.readout([["Stage", stages[s][0], C.path], ["Order", "egg → larva → pupa → adult"]]);
      msg = t < 4 ? "Developing…" : "Egg → larva (the feeding stage) → pupa → adult: the larva <b>transforms into the adult</b> (Fig. 11.17).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["external", "External fertilisation"], ["internal", "Internal fertilisation"], ["table", "Table 11.4"], ["butterfly", "Fig. 11.17: butterfly"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.animalStrategies = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Human reproduction: gametes, cycle, pregnancy, sex determination (Section 11.5)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "gametes"};
  function dateFor(d){ var n = 5 + d - 1; return n <= 31 ? n + " March" : (n - 31) + " April"; }
  var PH = [[1, 5, "#ef4444", "menstruation: lining is shed"], [6, 13, "#f9a8d4", "lining rebuilds; egg matures"], [14, 14, "#facc15", "ovulation: egg released"], [15, 28, "#a78bfa", "lining thick and rich in blood vessels"]];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "cycle" ? {maxT: 27, step: 1, speed: 4, format: function(t){ return "Day <b>" + (Math.round(t) + 1) + "</b>"; }} : id === "pregnancy" ? {maxT: 9, step: 0.1, speed: 1.5, format: function(t){ return "month <b>" + L.num(t, 1) + "</b>"; }} : {maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "cycle" ? [["#ef4444", "menstruation"], ["#f9a8d4", "rebuilding"], ["#facc15", "ovulation"], ["#a78bfa", "thickened lining"]] : id === "sex" ? [["#f472b6", "from the mother"], ["#60a5fa", "from the father"]] : [[C.path, "development"]]);
    L.watch({gametes: "Table 11.5 and Fig. 11.20: sperm and egg, and fertilisation (schematic).", cycle: "Fig. 11.21 and Pause and Ponder 7: a 28-day cycle whose day 1 is 5 March.", pregnancy: "Section 11.5.7 (Fig. 11.22): about nine months in three trimesters.", sex: "Threads of Curiosity: sex chromosomes from mother and father."}[id]);
    L.controls(""); L.restart(true);
  }
  function arc(cx, cy, r, d0, d1, col){ var a0 = (-90 + (d0 - 1) / 28 * 360) * Math.PI / 180, a1 = (-90 + d1 / 28 * 360) * Math.PI / 180; return '<path d="M' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cy + r * Math.sin(a0)).toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="28"/>'; }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "gametes"){
      var f = clamp11(t / 2, 0, 1), fused = t >= 2;
      m += L.circle(470, 150, 70, "#fce7f3", ' stroke="#f472b6" stroke-width="3"') + L.circle(470, 150, 18, "#f9a8d4") + L.text(470, 250, "egg: large, few, stored food, does not move", {size: 12, color: "#f472b6"});
      for(i = 0; i < 12; i++){
        var sx = 60 + 320 * f * (0.5 + 0.5 * ((i * 7) % 10) / 10) + (i === 0 ? 20 * f : 0), sy = 60 + (i * 37) % 180;
        if(fused && i === 0) continue;
        m += '<ellipse cx="' + sx.toFixed(1) + '" cy="' + sy + '" rx="5" ry="3.5" fill="#bfdbfe"/>' + '<path d="M' + (sx - 5).toFixed(1) + ' ' + sy + ' q-10 ' + (4 * Math.sin(t * 8 + i)).toFixed(1) + ' -20 0" fill="none" stroke="#bfdbfe" stroke-width="1.5"/>';
      }
      m += L.text(170, 275, "sperm: tiny, millions, no stored food, swim", {size: 12, color: "#60a5fa"});
      if(fused) m += L.circle(470, 150, 24, "#a855f7") + L.text(470, 40, "zygote: 23 + 23 = 46 chromosomes", {size: 15, color: "#c084fc", weight: 700});
      L.svg(m, "Sperm and egg", 290);
      L.readout([["Size", "sperm very small; egg large"], ["Number produced", "sperm millions; eggs few"], ["Stored nutrients", "sperm absent; egg present"], ["Motility", "sperm actively motile; egg non-motile"]]);
      msg = t < 3 ? "Approaching…" : "Sperm are tiny, numerous and motile; the egg is large, stores nutrients and does not move. At fertilisation, <b>23 + 23 = 46</b> chromosomes in the zygote.";
    } else if(st.preset === "cycle"){
      var day = Math.round(clamp11(t, 0, 27)) + 1, ph = PH.filter(function(p){ return day >= p[0] && day <= p[1]; })[0];
      PH.forEach(function(p){ m += arc(200, 150, 100, p[0], p[1], p[2]); });
      var a = (-90 + (day - 0.5) / 28 * 360) * Math.PI / 180;
      m += L.circle(200 + 100 * Math.cos(a), 150 + 100 * Math.sin(a), 12, "#f8fafc", ' stroke="#111" stroke-width="2"') + L.text(200, 145, "Day " + day, {size: 24, color: C.text, weight: 700}) + L.text(200, 172, dateFor(day), {size: 14, color: C.muted});
      m += L.text(360, 110, ph[3], {size: 15, color: ph[2], anchor: "start", weight: 700}) + L.text(360, 150, "Next period expected: 2 April", {size: 14, color: C.text, anchor: "start"}) + L.text(360, 180, "(cycles vary from 21 to 35 days)", {size: 12, color: C.muted, anchor: "start"});
      L.svg(m, "Menstrual cycle", 290);
      L.readout([["Day of cycle", String(day)], ["Date", dateFor(day)], ["What is happening", ph[3], ph[2]]]);
      msg = t < 27 ? "Following the cycle…" : "In a 28-day cycle whose day 1 is 5 March, day 28 is 1 April, so the next period is expected on about <b>2 April</b> (Pause and Ponder 7). Real cycles vary from 21 to 35 days.";
    } else if(st.preset === "pregnancy"){
      var mo = clamp11(t, 0, 9), X = function(v){ return 60 + v / 9 * 600; };
      [["1st trimester", 0, 3, "#f9a8d4"], ["2nd trimester", 3, 6, "#c4b5fd"], ["3rd trimester", 6, 9, "#93c5fd"]].forEach(function(tr){ m += L.rect(X(tr[1]), 200, X(tr[2]) - X(tr[1]) - 2, 30, tr[3], ' opacity="0.6"') + L.text((X(tr[1]) + X(tr[2])) / 2, 220, tr[0], {size: 12, color: "#0f172a", weight: 700}); });
      for(i = 0; i <= 9; i++) m += L.text(X(i), 250, String(i), {size: 11, color: C.muted});
      m += L.text(360, 272, "months", {size: 11, color: C.muted}) + L.line(X(mo), 190, X(mo), 240, "#f8fafc", 3);
      var stage = mo < 2.1 ? "embryo: major organs start forming" : mo < 3 ? "foetus (from about the 9th week)" : mo < 6 ? "foetus grows bigger and stronger; movements felt" : "rapid growth; getting ready for birth";
      m += L.circle(360, 100, 10 + 7 * mo, "#fbcfe8", ' opacity="0.8"') + L.text(360, 30, stage, {size: 15, color: C.text, weight: 700});
      L.svg(m, "Stages of pregnancy", 290);
      L.readout([["Month", L.num(mo, 1)], ["Stage", stage, C.path], ["Mother's needs", "balanced diet, check-ups, rest, support"]]);
      msg = t < 9 ? "Developing…" : "About nine months in three trimesters: an embryo first, a <b>foetus from about the ninth week</b>, growing rapidly in the third trimester.";
    } else {
      var rev = t >= 1.5;
      m += L.text(160, 40, "mother: XX", {size: 16, color: "#f472b6", weight: 700}) + L.text(560, 40, "father: XY", {size: 16, color: "#60a5fa", weight: 700});
      m += L.text(120, 80, "egg X", {size: 13, color: "#f472b6"}) + L.text(200, 80, "egg X", {size: 13, color: "#f472b6"}) + L.text(520, 80, "sperm X", {size: 13, color: "#60a5fa"}) + L.text(600, 80, "sperm Y", {size: 13, color: "#60a5fa"});
      var combos = [["X", "X"], ["X", "Y"], ["X", "X"], ["X", "Y"]];
      combos.forEach(function(cb, j){
        var x = 180 + (j % 2) * 180 + (j > 1 ? 180 : 0), show = t >= 0.5 + j * 0.3;
        if(!show) return;
        var girl = cb[1] === "X";
        m += L.rect(x - 70, 130, 140, 90, "#1e293b", ' rx="10" stroke="' + (girl ? "#f472b6" : "#60a5fa") + '" stroke-width="2"') + L.text(x - 12, 175, cb[0], {size: 26, color: "#f472b6", weight: 700}) + L.text(x + 14, 175, cb[1], {size: 26, color: cb[1] === "Y" ? "#60a5fa" : "#93c5fd", weight: 700}) + L.text(x, 205, girl ? "girl (XX)" : "boy (XY)", {size: 12, color: C.text});
      });
      L.svg(m, "Sex determination", 250);
      L.readout([["From the mother", "always X", "#f472b6"], ["From the father", "X or Y", "#60a5fa"], ["Chance of XX or XY", rev ? "about equal" : "…"]]);
      msg = t < 3 ? "Combining…" : "Every egg carries X; sperm carry X or Y. So <b>the father's sperm decides</b>: XX (girl) or XY (boy), about equally likely.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["gametes", "Table 11.5: sperm and egg"], ["cycle", "Fig. 11.21: the cycle"], ["pregnancy", "Fig. 11.22: pregnancy"], ["sex", "XX or XY?"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.human = {mount: mount, draw: draw, select: select, state: st};
})();
