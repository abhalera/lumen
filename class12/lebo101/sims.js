// Class 12 Biology, Chapter 1 (lebo101) — one tailored lab per lesson.
// Built on the shared Lumen lab helpers (window.LAB) with stable data-preset ids.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}
function poly(points, fill, extra){
  return '<polygon points="' + points + '" fill="' + fill + '"' + (extra || "") + '/>';
}
function path(d, stroke, w, extra){
  return '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + (w || 2) + '"' + (extra || "") + '/>';
}

// -------------------------------------------------------------------------
// Lab 1 — Flower whorls: androecium vs gynoecium (NCERT §1.1–1.2, Exercise 1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {sel: "androecium"};
  var FLOWERS = {
    androecium: {title: "ANDROECIUM \u2014 MALE WHORL", role: "male organ", gameto: "pollen grains in anther", site: "anther of the stamen"},
    gynoecium: {title: "GYNOECIUM \u2014 FEMALE WHORL", role: "female organ", gameto: "embryo sac in ovule", site: "ovule inside the ovary"},
    accessory: {title: "ACCESSORY WHORLS \u2014 CALYX + COROLLA", role: "protection and attraction", gameto: "no gametophyte", site: "none"},
    all: {title: "FOUR WHORLS ON THE THALAMUS", role: "two accessory + two reproductive", gameto: "pollen + embryo sac", site: "anther and ovule"}
  };

  function draw(){
    var d = FLOWERS[st.sel];
    var onA = st.sel === "androecium" || st.sel === "all";
    var onG = st.sel === "gynoecium" || st.sel === "all";
    var onAcc = st.sel === "accessory" || st.sel === "all";
    var m = "";
    m += L.text(360, 30, d.title, {size: 18, weight: 700, color: "#93c5fd"});
    // thalamus and stem
    m += L.rect(300, 252, 120, 16, "#334155", ' rx="6"');
    m += L.line(360, 268, 360, 286, "#334155", 8);
    m += L.text(360, 298, "thalamus", {size: 12, color: C.muted});
    // calyx (sepals)
    var cal = onAcc ? "#34d399" : "#1e293b";
    m += path("M300 252 Q230 200 200 150", cal, onAcc ? 5 : 3);
    m += path("M420 252 Q490 200 520 150", cal, onAcc ? 5 : 3);
    m += L.text(185, 142, "calyx", {size: 12, color: cal});
    // corolla (petals)
    var cor = onAcc ? "#f472b6" : "#1e293b";
    m += path("M318 252 Q280 190 268 148", cor, onAcc ? 6 : 4);
    m += path("M402 252 Q440 190 452 148", cor, onAcc ? 6 : 4);
    m += L.text(520, 142, "corolla", {size: 12, color: cor});
    // androecium: filaments + anthers
    var and = onA ? "#f59e0b" : "#334155";
    var aw = onA ? 4 : 2;
    m += L.line(336, 252, 322, 120, and, aw);
    m += L.line(384, 252, 398, 120, and, aw);
    m += '<ellipse cx="318" cy="108" rx="13" ry="20" fill="' + and + '"/>';
    m += '<ellipse cx="402" cy="108" rx="13" ry="20" fill="' + and + '"/>';
    m += L.text(318, 76, "anther", {size: 12, color: and});
    m += L.text(402, 76, "filament", {size: 12, color: and});
    // gynoecium: stigma style ovary
    var gyn = onG ? "#a78bfa" : "#334155";
    m += '<rect x="342" y="178" width="36" height="74" rx="14" fill="' + gyn + '" stroke="' + (onG ? "#f8fafc" : "#475569") + '" stroke-width="' + (onG ? 3 : 1) + '"/>';
    m += L.line(360, 178, 360, 118, gyn, onG ? 6 : 3);
    m += '<ellipse cx="360" cy="110" rx="18" ry="9" fill="' + gyn + '"/>';
    m += L.circle(360, 216, 7, "#0f1f2e", ' stroke="#e2e8f0"');
    m += L.text(360, 90, "stigma + style", {size: 12, color: gyn});
    m += L.text(360, 172, "ovary (ovule inside)", {size: 11, color: gyn});
    if(st.sel === "all"){
      m += L.text(560, 60, "androecium", {size: 13, color: "#f59e0b", anchor: "start"});
      m += L.text(560, 84, "gynoecium", {size: 13, color: "#a78bfa", anchor: "start"});
      m += L.text(560, 108, "calyx", {size: 13, color: "#34d399", anchor: "start"});
      m += L.text(560, 132, "corolla", {size: 13, color: "#f472b6", anchor: "start"});
    }
    L.svg(m, "Longitudinal section of a flower with four whorls; highlighted whorl: " + st.sel, 300);
    L.readout([
      ["Selected whorl", st.sel, "#60a5fa"],
      ["Role", d.role, "#38bdf8"],
      ["Gametophyte", d.gameto, "#f59e0b"],
      ["Gametophyte site", d.site, C.ok]
    ]);
    var msg;
    if(st.sel === "androecium") msg = "<b>Exercise 1:</b> the male gametophyte (pollen grain) develops in the anther of the stamen \u2014 the androecium. Stamen = filament + bilobed dithecous anther (Fig. 1.2, \u00a71.2.1).";
    else if(st.sel === "gynoecium") msg = "<b>Exercise 1:</b> the female gametophyte (embryo sac) develops in the ovule inside the ovary \u2014 the gynoecium. Pistil = stigma + style + ovary (\u00a71.2.2, Fig. 1.7a).";
    else if(st.sel === "accessory") msg = "<b>\u00a71.1:</b> calyx (sepals) and corolla (petals) are accessory whorls \u2014 they protect the bud and attract pollinators, but they house no gametophyte.";
    else msg = "<b>\u00a71.1\u20131.2:</b> four whorls sit on the thalamus: calyx, corolla, androecium (male) and gynoecium (female). Only the last two house gametophytes, which is where sexual reproduction happens.";
    L.verdict(msg);
  }

  function select(id){
    st.sel = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["androecium", "Androecium (male)"], ["gynoecium", "Gynoecium (female)"], ["accessory", "Calyx + corolla"], ["all", "All four whorls"]], st.sel, select);
    L.watch("Only the androecium and gynoecium house gametophytes. The readout names the organ, the gametophyte and its exact site.");
    draw();
  }

  window.SIMS.flowerwhorls = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Microsporogenesis: PMC to pollen grain (NCERT §1.2.1, Exercise 3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {stage: "pmc"};

  function anther(layers){
    var m = "";
    m += '<ellipse cx="230" cy="165" rx="140" ry="95" fill="#132132" stroke="#475569" stroke-width="2"/>';
    var cols = ["#f59e0b", "#38bdf8", "#a78bfa", "#34d399"];
    var names = ["epidermis", "endothecium", "middle layers", "tapetum"];
    for(var i = 0; i < layers; i += 1){
      m += '<ellipse cx="230" cy="165" rx="' + (124 - i * 22) + '" ry="' + (80 - i * 17) + '" fill="none" stroke="' + cols[i] + '" stroke-width="' + (i === 3 ? 4 : 2) + '"/>';
      m += L.text(420, 78 + i * 22, names[i], {size: 13, color: cols[i], anchor: "start"});
    }
    return m;
  }

  function draw(){
    var s = st.stage;
    var m = "";
    // anther transverse section on the left
    m += anther(s === "wall" ? 4 : 2);
    if(s === "pmc"){
      m += '<ellipse cx="230" cy="165" rx="70" ry="45" fill="#0f2438"/>';
      for(var i = 0; i < 4; i += 1){
        m += L.circle(196 + (i % 2) * 68, 140 + Math.floor(i / 2) * 50, 15, "#f59e0b");
        m += L.text(196 + (i % 2) * 68, 145 + Math.floor(i / 2) * 50, "2n", {size: 12, color: "#1f2937", weight: 700});
      }
      m += L.text(230, 290, "sporogenous tissue = pollen mother cells (diploid)", {size: 13, color: C.muted});
    } else if(s === "tetrad"){
      m += L.text(230, 290, "meiosis I \u2192 dyad; meiosis II \u2192 microspore tetrad", {size: 13, color: C.muted});
      for(var j = 0; j < 4; j += 1){
        m += L.circle(198 + (j % 2) * 64, 142 + Math.floor(j / 2) * 46, 16, "#a78bfa");
        m += L.text(198 + (j % 2) * 64, 147 + Math.floor(j / 2) * 46, "n", {size: 12, color: "#111827", weight: 700});
      }
      m += L.text(540, 165, "four haploid microspores", {size: 16, color: "#c4b5fd", weight: 700});
    } else if(s === "wall"){
      m += L.text(230, 290, "four wall layers surround every microsporangium", {size: 13, color: C.muted});
      m += L.text(540, 165, "tapetum nourishes", {size: 16, color: "#34d399", weight: 700});
      m += L.text(540, 190, "the developing pollen", {size: 14, color: C.text});
    } else {
      m += L.circle(540, 165, 74, "#0f2438", ' stroke="#34d399" stroke-width="3"');
      m += L.circle(540, 165, 62, "#fde68a");
      m += L.circle(540, 165, 52, "#b45309");
      m += L.text(500, 158, "vegetative", {size: 11, color: "#fef3c7"});
      m += L.text(500, 174, "cell", {size: 11, color: "#fef3c7"});
      m += '<ellipse cx="578" cy="165" rx="10" ry="22" fill="#f59e0b"/>';
      m += L.text(596, 160, "generative", {size: 11, color: "#fbbf24", anchor: "start"});
      m += L.text(596, 176, "cell", {size: 11, color: "#fbbf24", anchor: "start"});
      m += L.text(540, 268, "exine (sporopollenin) + intine; germ pores", {size: 12, color: C.muted});
      m += L.text(540, 288, "shed 2-celled in over 60% of angiosperms", {size: 12, color: C.muted});
    }
    L.svg(m, "Microsporogenesis stage: " + s, 300);
    if(s === "pmc"){
      L.readout([["Stage", "PMC", "#f59e0b"], ["Ploidy", "2n (diploid)", "#f59e0b"], ["Location", "microsporangium centre"], ["Next", "meiosis I"] ]);
      L.verdict("<b>Sporogenous tissue</b> cells enlarge into <b>pollen mother cells (PMCs)</b>, the diploid (2n) cells that will divide by meiosis. A typical anther is tetragonal with <b>four microsporangia</b>.");
    } else if(s === "tetrad"){
      L.readout([["Stage", "microspore tetrad", "#a78bfa"], ["Ploidy", "n (haploid)", "#a78bfa"], ["Products per PMC", "4 microspores"], ["Division", "meiosis"] ]);
      L.verdict("<b>Microsporogenesis</b>: each PMC undergoes meiosis to form a <b>microspore tetrad</b> of four haploid (n) microspores. Exercise 3 order: sporogenous tissue \u2192 pollen mother cell \u2192 microspore tetrad \u2192 pollen grain \u2192 male gametes.");
    } else if(s === "wall"){
      L.readout([["Wall layers", "4", "#34d399"], ["Inner layer", "tapetum", "#34d399"], ["Function", "nourishes pollen"], ["Outer three", "protect + dehiscence"] ]);
      L.verdict("Each microsporangium has four wall layers: <b>epidermis, endothecium, middle layers and tapetum</b>. The tapetum has dense cytoplasm, is often multinucleate, and <b>nourishes the developing pollen grains</b>.");
    } else {
      L.readout([["Pollen grain", "2-celled", "#fbbf24"], ["Cells", "vegetative + generative"], ["Shed as 2-celled", ">60% of angiosperms"], ["Wall", "sporopollenin exine"] ]);
      L.verdict("Pollen grains are the male gametophytes. At shedding, over <b>60% of angiosperms</b> release <b>2-celled</b> grains \u2014 a large <b>vegetative cell</b> and a small spindle-shaped <b>generative cell</b>; the rest are 3-celled with two male gametes.");
    }
  }

  function select(id){
    st.stage = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["pmc", "1 \u00b7 PMC (2n)"], ["tetrad", "2 \u00b7 Microspore tetrad"], ["wall", "3 \u00b7 Wall + tapetum"], ["shed", "4 \u00b7 Shed pollen"]], st.stage, select);
    L.legend([["#f59e0b", "PMC / microspore"], ["#34d399", "tapetum"], ["#a78bfa", "haploid tetrad"]]);
    L.watch("Step 1 to 4: watch the ploidy tag fall from 2n to n, the four wall layers build, and the tapetum stay innermost.");
    draw();
  }

  window.SIMS.pollenlab = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Embryo sac: monosporic 7-celled, 8-nucleate (NCERT §1.2.2, Ex 5–6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {view: "ovule"};

  function ovuleDiagram(){
    var m = "";
    m += '<ellipse cx="330" cy="160" rx="120" ry="86" fill="#1b2a3a" stroke="#94a3b8" stroke-width="2"/>';
    m += '<ellipse cx="330" cy="160" rx="102" ry="70" fill="#26384c" stroke="#64748b" stroke-width="2"/>';
    m += '<ellipse cx="330" cy="160" rx="74" ry="50" fill="#0f2438" stroke="#a78bfa" stroke-width="2"/>';
    m += L.text(330, 100, "integuments (1 or 2)", {size: 12, color: "#94a3b8"});
    m += L.text(330, 160, "nucellus", {size: 13, color: "#e2e8f0"});
    m += L.text(330, 182, "embryo sac", {size: 12, color: "#a78bfa"});
    m += L.line(210, 160, 150, 160, "#94a3b8", 3);
    m += L.text(120, 156, "funicle", {size: 12, color: "#94a3b8", anchor: "start"});
    m += L.circle(150, 160, 5, "#f59e0b");
    m += L.text(150, 138, "hilum", {size: 12, color: "#f59e0b"});
    m += '<polygon points="450,160 486,146 486,174" fill="#f472b6"/>';
    m += L.text(500, 164, "micropyle", {size: 12, color: "#f472b6", anchor: "start"});
    m += '<polygon points="210,160 174,146 174,174" fill="#38bdf8"/>';
    m += L.text(160, 186, "chalaza", {size: 12, color: "#38bdf8"});
    return m;
  }

  function monoDiagram(){
    var m = "";
    var stages = [
      ["MMC (2n)", 120, "#f59e0b"],
      ["meiosis", 255, "#94a3b8"],
      ["4 megaspores (n)", 390, "#a78bfa"],
      ["1 functional", 560, "#34d399"]
    ];
    stages.forEach(function(s, i){
      m += L.text(s[1], 80, s[0], {size: 14, color: s[2], weight: 700});
      if(i < stages.length - 1) m += L.arrow(s[1] + 70, 76, stages[i + 1][1] - 70, 76, "#475569", 2);
    });
    m += L.circle(120, 165, 26, "#f59e0b");
    m += L.text(120, 170, "2n", {size: 14, color: "#111827", weight: 700});
    m += L.text(120, 215, "single MMC in micropylar nucellus", {size: 12, color: C.muted});
    for(var i = 0; i < 4; i += 1){
      var x = 390 + (i % 2) * 62, y = 140 + Math.floor(i / 2) * 52;
      m += L.circle(x, y, 21, i === 3 ? "#34d399" : "#334155");
      m += L.text(x, y + 5, "n", {size: 12, color: i === 3 ? "#052e16" : "#94a3b8", weight: 700});
    }
    m += L.text(452, 230, "3 degenerate", {size: 12, color: C.muted});
    m += L.text(560, 165, "functional", {size: 13, color: "#34d399"});
    m += L.text(560, 185, "megaspore", {size: 13, color: "#34d399"});
    m += L.text(250, 260, "three free-nuclear mitoses \u2192 2-, 4-, 8-nucleate stages", {size: 13, color: C.muted});
    return m;
  }

  function sacDiagram(){
    var m = "";
    m += '<ellipse cx="350" cy="160" rx="170" ry="100" fill="#0f2438" stroke="#a78bfa" stroke-width="3"/>';
    // egg apparatus (micropylar, left)
    m += '<ellipse cx="230" cy="112" rx="20" ry="26" fill="#34d399"/>';
    m += L.text(230, 117, "S", {size: 13, color: "#052e16", weight: 700});
    m += '<ellipse cx="230" cy="205" rx="20" ry="26" fill="#34d399"/>';
    m += L.text(230, 210, "S", {size: 13, color: "#052e16", weight: 700});
    m += '<ellipse cx="292" cy="160" rx="23" ry="30" fill="#f59e0b"/>';
    m += L.text(292, 166, "egg", {size: 12, color: "#111827", weight: 700});
    m += L.text(230, 60, "2 synergids + egg", {size: 13, color: "#34d399"});
    // antipodals (chalazal, right)
    for(var i = 0; i < 3; i += 1){
      m += L.circle(470, 120 + i * 40, 16, "#38bdf8");
      m += L.text(470, 125 + i * 40, "A", {size: 11, color: "#082f49", weight: 700});
    }
    m += L.text(470, 60, "3 antipodals", {size: 13, color: "#38bdf8"});
    // central cell
    m += L.circle(370, 160, 22, "#a78bfa");
    m += L.circle(402, 160, 22, "#a78bfa");
    m += L.text(370, 165, "P", {size: 12, color: "#1e1b4b", weight: 700});
    m += L.text(402, 165, "P", {size: 12, color: "#1e1b4b", weight: 700});
    m += L.text(386, 215, "central cell: 2 polar nuclei", {size: 13, color: "#c4b5fd"});
    m += L.text(350, 288, "7 cells \u00b7 8 nuclei (2 synergids + egg + 3 antipodals + 1 central cell)", {size: 12, color: C.muted});
    return m;
  }

  function ploidyDiagram(){
    var m = "";
    var rows = [
      ["nucellus", "2n", "#94a3b8", 70],
      ["megaspore mother cell (MMC)", "2n", "#f59e0b", 125],
      ["megaspores (after meiosis)", "n", "#a78bfa", 180],
      ["functional megaspore", "n", "#34d399", 235]
    ];
    rows.forEach(function(r){
      m += L.text(200, r[3], r[0], {size: 15, color: r[2], anchor: "end"});
      m += L.rect(230, r[3] - 22, 220, 32, "#132132", ' rx="8" stroke="' + r[2] + '"');
      m += L.text(340, r[3], r[1], {size: 16, color: r[2], weight: 700});
    });
    m += L.arrow(240, 92, 240, 108, "#475569", 2);
    m += L.arrow(240, 147, 240, 163, "#475569", 2);
    m += L.arrow(240, 202, 240, 218, "#475569", 2);
    m += L.text(360, 282, "meiosis happens once: at the MMC", {size: 13, color: C.muted});
    return m;
  }

  function draw(){
    var v = st.view, m = "";
    if(v === "ovule") m = ovuleDiagram();
    else if(v === "mono") m = monoDiagram();
    else if(v === "sac") m = sacDiagram();
    else m = ploidyDiagram();
    L.svg(m, "Embryo-sac view: " + v, 300);
    if(v === "ovule"){
      L.readout([["Structure", "anatropous ovule"], ["Stalk", "funicle"], ["Attachment", "hilum"], ["Tip pore", "micropyle"], ["Base", "chalaza"], ["Gametophyte", "embryo sac"]]);
      L.verdict("A typical ovule has a stalk (<b>funicle</b>; junction = <b>hilum</b>), one or two <b>integuments</b> leaving a <b>micropyle</b>, a basal <b>chalaza</b>, the reserve-rich <b>nucellus</b> and the <b>embryo sac</b> (Fig. 1.7d). Exercise 4 names all these parts.");
    } else if(v === "mono"){
      L.readout([["Megaspores", "4"], ["Functional", "1 (monosporic)"], ["Degenerate", "3"], ["Divisions", "free-nuclear mitosis"]]);
      L.verdict("<b>Monosporic development:</b> of the four megaspores from MMC meiosis, <b>one functional megaspore</b> builds the whole female gametophyte and the other <b>three degenerate</b> \u2014 Exercise 5's answer in one line.");
    } else if(v === "sac"){
      L.readout([["Cells", "7"], ["Nuclei", "8", "#a78bfa"], ["Egg apparatus", "2 synergids + egg"], ["Chalazal", "3 antipodals"], ["Centre", "central cell: 2 polar nuclei"]]);
      L.verdict("The mature embryo sac is <b>7-celled and 8-nucleate</b>: egg apparatus (2 synergids + egg) + 3 antipodals + 1 central cell. The central cell holds <b>two polar nuclei</b>, so nuclei outnumber cells by one (Exercise 6).");
    } else {
      L.readout([["Nucellus", "2n"], ["MMC", "2n"], ["Functional megaspore", "n"], ["Embryo sac", "n"]]);
      L.verdict("Ploidy line of \u00a71.2.2: nucellus <b>2n</b> \u2192 MMC <b>2n</b> \u2192 functional megaspore <b>n</b> \u2192 embryo sac <b>n</b>. The single meiosis happens at the MMC, so every cell of the gametophyte is haploid.");
    }
  }

  function select(id){
    st.view = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["ovule", "Ovule parts"], ["mono", "Monosporic sequence"], ["sac", "Mature embryo sac"], ["ploidy", "Ploidy map"]], st.view, select);
    L.legend([["#34d399", "egg apparatus"], ["#38bdf8", "antipodals"], ["#a78bfa", "polar nuclei"]]);
    L.watch("Count the readout at the mature-sac stage: 7 cells and 8 nuclei \u2014 the central cell carries the extra pair of polar nuclei.");
    draw();
  }

  window.SIMS.embryosac = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Pollination: autogamy, geitonogamy, xenogamy (NCERT §1.2.3, Ex 7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {mode: "auto"};
  var MODES = {
    auto: {
      title: "AUTOGAMY", flowers: 1, arrow: "same flower", genetic: "genetically self", agent: "not needed (self)",
      verdict: "<b>Autogamy</b> is pollination within the same flower; it needs synchrony of pollen release and stigma receptivity plus close anther\u2013stigma placement. It is genetically self-pollination."
    },
    geitono: {
      title: "GEITONOGAMY", flowers: 2, arrow: "same plant", genetic: "genetically autogamy", agent: "a pollinator is needed",
      verdict: "<b>Geitonogamy</b> transfers pollen to another flower of the <b>same plant</b>: functionally cross-pollination (an agent is needed) but <b>genetically autogamy</b>, because the pollen comes from the same plant."
    },
    xeno: {
      title: "XENOGAMY", flowers: 2, arrow: "different plant", genetic: "the only genetically cross type", agent: "wind / water / animal",
      verdict: "<b>Xenogamy</b> transfers pollen from one plant to a genetically different plant \u2014 the <b>only genetically cross-pollination</b> of the three."
    },
    cleisto: {
      title: "CLEISTOGAMY \u2014 CLOSED BUD", flowers: 1, arrow: "inside the bud", genetic: "invariably autogamous", agent: "no pollinator needed",
      verdict: "<b>Cleistogamous</b> flowers never open; anthers dehisce inside the bud next to the stigma. No foreign pollen can land, so cross-pollination cannot occur \u2014 <b>assured seed-set</b> without pollinators (Exercise 7)."
    },
    agents: {
      title: "POLLINATING AGENTS", flowers: 2, arrow: "wind / water / animal", genetic: "varies with the agent", agent: "abiotic (wind, water) or biotic (insects, birds, bats)",
      verdict: "Abiotic agents need light non-sticky pollen, exposed stigmas (wind) or mucilage-protected pollen (water, about 30 genera); biotic agents visit large, colourful, nectar-rich flowers and are mostly <b>insects, especially bees</b>."
    }
  };

  function flower(x, y, label, color){
    var m = "";
    m += L.line(x, y, x, y + 55, "#475569", 4);
    m += L.circle(x, y - 18, 17, color);
    m += L.circle(x, y - 18, 7, "#0f1f2e");
    m += L.text(x, y + 78, label, {size: 13, color: C.text});
    return m;
  }

  function draw(){
    var d = MODES[st.mode];
    var m = "";
    m += L.text(360, 36, d.title, {size: 20, weight: 700, color: "#93c5fd"});
    if(d.flowers === 1){
      m += flower(320, 160, "flower", "#f472b6");
      m += L.arrow(348, 110, 348, 190, "#f59e0b", 3);
      m += L.text(392, 120, "pollen \u2192 stigma", {size: 13, color: "#f59e0b", anchor: "start"});
    } else {
      m += flower(210, 160, st.mode === "geitono" ? "flower A (same plant)" : "flower A", "#f472b6");
      m += flower(510, 160, st.mode === "geitono" ? "flower B (same plant)" : "flower B (other plant)", "#f472b6");
      if(st.mode === "geitono"){
        m += L.line(210, 225, 510, 225, "#475569", 3);
        m += L.text(360, 252, "one plant \u2014 same genotype", {size: 13, color: C.muted});
      } else if(st.mode === "xeno"){
        m += L.text(360, 252, "two different plants", {size: 13, color: C.muted});
      }
      m += L.arrow(258, 128, 462, 128, st.mode === "geitono" ? "#f59e0b" : "#34d399", 4);
    }
    m += L.text(360, 288, "pollen source: " + d.arrow, {size: 14, color: C.text, weight: 700});
    L.svg(m, "Pollination diagram: " + st.mode, 300);
    L.readout([
      ["Type", st.mode, "#60a5fa"],
      ["Pollen source", d.arrow, "#f59e0b"],
      ["Genetically", d.genetic, "#34d399"],
      ["Agent", d.agent]
    ]);
    L.verdict(d.verdict);
  }

  function select(id){
    st.mode = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["auto", "Autogamy"], ["geitono", "Geitonogamy"], ["xeno", "Xenogamy"], ["cleisto", "Cleistogamy"], ["agents", "Agents"]], st.mode, select);
    L.legend([["#f472b6", "flower"], ["#f59e0b", "self pollen"], ["#34d399", "cross pollen"]]);
    L.watch("Compare the three pollen sources. Only xenogamy is genetically cross; cleistogamy locks the self route inside a closed bud.");
    draw();
  }

  window.SIMS.pollination = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Double fertilisation: syngamy + triple fusion (NCERT §1.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {view: "tube"};

  function sacBase(){
    var m = "";
    m += '<ellipse cx="350" cy="160" rx="180" ry="104" fill="#0f2438" stroke="#a78bfa" stroke-width="3"/>';
    m += '<ellipse cx="215" cy="112" rx="20" ry="26" fill="#34d399"/>';
    m += L.text(215, 117, "S", {size: 13, color: "#052e16", weight: 700});
    m += '<ellipse cx="215" cy="205" rx="20" ry="26" fill="#34d399"/>';
    m += L.text(215, 210, "S", {size: 13, color: "#052e16", weight: 700});
    m += '<ellipse cx="280" cy="160" rx="23" ry="30" fill="#f59e0b"/>';
    m += L.text(280, 166, "egg", {size: 12, color: "#111827", weight: 700});
    for(var i = 0; i < 3; i += 1){
      m += L.circle(490, 120 + i * 40, 16, "#38bdf8");
      m += L.text(490, 125 + i * 40, "A", {size: 11, color: "#082f49", weight: 700});
    }
    m += L.circle(390, 160, 22, "#a78bfa");
    m += L.circle(422, 160, 22, "#a78bfa");
    m += L.text(390, 165, "P", {size: 12, color: "#1e1b4b", weight: 700});
    m += L.text(422, 165, "P", {size: 12, color: "#1e1b4b", weight: 700});
    return m;
  }

  function draw(){
    var v = st.view, m = "";
    if(v === "tube"){
      m = sacBase();
      m += path("M40 40 Q160 60 215 96", "#38bdf8", 5);
      m += L.text(60, 30, "stigma \u2192 style", {size: 13, color: "#38bdf8", anchor: "start"});
      m += L.arrow(120, 52, 190, 92, "#38bdf8", 3);
      m += L.text(150, 250, "tube enters through the micropyle into a synergid", {size: 13, color: C.muted});
    } else if(v === "syngamy"){
      m = sacBase();
      m += L.circle(300, 160, 12, "#f472b6");
      m += L.text(300, 164, "n", {size: 10, color: "#500724", weight: 700});
      m += L.arrow(348, 200, 306, 172, "#f472b6", 3);
      m += L.text(360, 246, "egg (n) + male gamete (n) \u2192 zygote (2n)", {size: 14, color: "#f472b6", weight: 700});
    } else if(v === "triple"){
      m = sacBase();
      m += L.circle(420, 130, 12, "#f472b6");
      m += L.text(420, 134, "n", {size: 10, color: "#500724", weight: 700});
      m += L.arrow(420, 108, 420, 132, "#f472b6", 3);
      m += L.text(360, 246, "polar nucleus (n) + polar nucleus (n) + male gamete (n) \u2192 PEN (3n)", {size: 13, color: "#f472b6", weight: 700});
    } else {
      m = sacBase();
      m += L.circle(300, 160, 12, "#f472b6");
      m += L.circle(420, 130, 12, "#f472b6");
      m += L.text(240, 250, "syngamy \u2192 2n zygote", {size: 13, color: "#f59e0b"});
      m += L.text(470, 250, "triple fusion \u2192 3n PEN", {size: 13, color: "#a78bfa"});
      m += L.text(360, 282, "two fusions in one embryo sac", {size: 14, color: C.text, weight: 700});
    }
    L.svg(m, "Double fertilisation view: " + v, 300);
    if(v === "tube"){
      L.readout([["Path", "stigma \u2192 style \u2192 ovary"], ["Entry", "micropyle"], ["Receives tube", "a synergid"], ["Delivered", "2 male gametes"]]);
      L.verdict("The compatible pollen tube grows through the stigma and style into the ovary, enters the ovule through the <b>micropyle</b>, and discharges its <b>two male gametes</b> into a <b>synergid</b> (Fig. 1.12).");
    } else if(v === "syngamy"){
      L.readout([["Egg", "n"], ["Male gamete", "n"], ["Product", "zygote (2n)", "#f472b6"], ["Fusion", "syngamy"]]);
      L.verdict("<b>Syngamy:</b> one male gamete fuses with the egg nucleus \u2014 egg (n) + male gamete (n) = diploid <b>zygote (2n)</b>, which will develop into the embryo.");
    } else if(v === "triple"){
      L.readout([["Polar nucleus 1", "n"], ["Polar nucleus 2", "n"], ["Male gamete", "n"], ["Product", "PEN (3n)", "#a78bfa"]]);
      L.verdict("<b>Triple fusion:</b> the second male gamete fuses with the two polar nuclei in the central cell, giving the triploid <b>primary endosperm nucleus (PEN, 3n)</b> \u2014 Exercise 11.");
    } else {
      L.readout([["Syngamy", "2n zygote", "#f59e0b"], ["Triple fusion", "3n PEN", "#a78bfa"], ["Where", "one embryo sac"], ["Uniqueness", "only in flowering plants"]]);
      L.verdict("Because <b>syngamy and triple fusion</b> occur together in one embryo sac, the event is <b>double fertilisation \u2014 unique to flowering plants</b>. The central cell becomes the primary endosperm cell and the zygote becomes the embryo.");
    }
  }

  function select(id){
    st.view = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["tube", "Pollen-tube path"], ["syngamy", "Syngamy (2n)"], ["triple", "Triple fusion (3n)"], ["double", "Double fertilisation"]], st.view, select);
    L.legend([["#f59e0b", "egg / zygote"], ["#a78bfa", "polar nuclei / PEN"], ["#f472b6", "male gamete"]]);
    L.watch("Fire both fusions: n + n gives the 2n zygote; n + n + n gives the 3n PEN. Two fusions in one embryo sac is the signature of flowering plants.");
    draw();
  }

  window.SIMS.doublefert = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Post-fertilisation: endosperm, embryo, seed, fruit (NCERT §1.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {view: "endosperm"};

  function draw(){
    var v = st.view, m = "";
    if(v === "endosperm"){
      m += '<ellipse cx="250" cy="160" rx="120" ry="92" fill="#0f2438" stroke="#34d399" stroke-width="3"/>';
      for(var i = 0; i < 14; i += 1){
        m += L.circle(190 + (i % 5) * 30, 110 + Math.floor(i / 5) * 44, 7, "#34d399", ' opacity=".8"');
      }
      m += L.text(250, 64, "free-nuclear endosperm (coconut water)", {size: 13, color: "#6ee7b7"});
      m += '<ellipse cx="540" cy="160" rx="110" ry="92" fill="#0f2438" stroke="#f59e0b" stroke-width="3"/>';
      for(var j = 0; j < 24; j += 1){
        m += L.circle(452 + (j % 6) * 36, 96 + Math.floor(j / 6) * 44, 13, "#f59e0b", ' opacity=".85"');
      }
      m += L.text(540, 64, "cellular endosperm (white kernel)", {size: 13, color: "#fbbf24"});
      m += L.arrow(385, 160, 415, 160, "#94a3b8", 3);
    } else if(v === "embryo"){
      var pts = [[90, "zygote"], [240, "proembryo"], [390, "globular"], [540, "heart-shaped"]];
      pts.forEach(function(p, i){
        m += L.text(p[0], 72, p[1], {size: 13, color: "#93c5fd", weight: 700});
        if(i === 0) m += L.circle(p[0], 165, 20, "#f59e0b");
        else if(i === 1) m += '<ellipse cx="' + p[0] + '" cy="165" rx="26" ry="30" fill="#34d399"/>';
        else if(i === 2) m += L.circle(p[0], 165, 30, "#38bdf8");
        else m += '<path d="M' + (p[0] - 34) + ' 165 Q' + p[0] + ' 105 ' + (p[0] + 34) + ' 165 Q' + p[0] + ' 225 ' + (p[0] - 34) + ' 165 Z" fill="#a78bfa"/>';
        if(i < 3) m += L.arrow(p[0] + 42, 160, p[0] + 100, 160, "#475569", 2);
      });
      m += L.text(360, 272, "zygote \u2192 proembryo \u2192 globular \u2192 heart-shaped \u2192 mature", {size: 14, color: C.text, weight: 700});
    } else if(v === "seed"){
      m += L.rect(120, 90, 200, 150, "#1b2a3a", ' rx="16" stroke="#94a3b8" stroke-width="2"');
      m += L.text(220, 130, "seed coat (testa)", {size: 13, color: "#94a3b8"});
      m += L.circle(220, 180, 30, "#f59e0b");
      m += L.text(220, 185, "embryo", {size: 11, color: "#111827"});
      m += L.text(220, 228, "from the fertilised ovule", {size: 12, color: C.muted});
      var arrows = [["ovary \u2192 fruit", 420, 90], ["ovule \u2192 seed", 420, 130], ["integuments \u2192 testa", 420, 170], ["nucellus remnant \u2192 perisperm", 420, 210]];
      arrows.forEach(function(a){
        m += L.text(420, a[2], a[0], {size: 14, color: "#93c5fd", anchor: "start"});
      });
    } else {
      m += L.rect(90, 120, 150, 120, "#f472b6", ' rx="60"');
      m += L.text(165, 185, "true fruit", {size: 14, color: "#500724", weight: 700});
      m += L.text(165, 250, "from the ovary alone", {size: 12, color: C.muted});
      m += L.rect(290, 120, 150, 120, "#f59e0b", ' rx="60"');
      m += L.text(365, 175, "false fruit", {size: 14, color: "#451a03", weight: 700});
      m += L.text(365, 198, "+ thalamus", {size: 12, color: "#451a03"});
      m += L.text(365, 250, "apple, strawberry, cashew", {size: 12, color: C.muted});
      m += L.rect(490, 120, 150, 120, "#a78bfa", ' rx="60"');
      m += L.text(565, 175, "parthenocarpic", {size: 13, color: "#2e1065", weight: 700});
      m += L.text(565, 198, "no fertilisation", {size: 12, color: "#2e1065"});
      m += L.text(565, 250, "banana (seedless)", {size: 12, color: C.muted});
    }
    L.svg(m, "Post-fertilisation view: " + v, 300);
    if(v === "endosperm"){
      L.readout([["Develops", "before the embryo"], ["First stage", "free-nuclear"], ["Coconut water", "free-nuclear endosperm"], ["Kernel", "cellular endosperm"], ["Persists in", "castor, coconut, cereals"]]);
      L.verdict("The <b>endosperm develops before the embryo</b> \u2014 an adaptation ensuring nutrition. The primary endosperm cell divides into triploid tissue: first <b>free-nuclear endosperm</b> (coconut water), later <b>cellular</b> (the white kernel).");
    } else if(v === "embryo"){
      L.readout([["Sequence", "zygote \u2192 proembryo"], ["Then", "globular"], ["Then", "heart-shaped"], ["Mature dicot", "axis + 2 cotyledons"], ["Grass embryo", "scutellum + coleoptile + coleorrhiza"]]);
      L.verdict("The embryo develops at the micropylar end through <b>zygote \u2192 proembryo \u2192 globular \u2192 heart-shaped \u2192 mature</b> (Fig. 1.13b). A dicot has two cotyledons; a grass embryo has one scutellum with coleoptile and coleorrhiza sheaths.");
    } else if(v === "seed"){
      L.readout([["Seed is", "fertilised ovule"], ["Non-albuminous", "pea, groundnut"], ["Albuminous", "wheat, maize, castor"], ["Perisperm", "black pepper, beet"], ["Dry seed", "10\u201315% moisture"]]);
      L.verdict("The seed inside a fruit holds seed coat(s), cotyledon(s) and the embryo axis. Fate map: <b>ovule \u2192 seed</b>, <b>integuments \u2192 testa</b>, persistent nucellus \u2192 <b>perisperm</b> (black pepper, beet). Mature seeds dry to 10\u201315% moisture and may become dormant.");
    } else {
      L.readout([["Source", "ovary"], ["Ovary wall", "pericarp"], ["True fruit", "ovary only"], ["False fruit", "thalamus also joins"], ["Parthenocarpic", "banana (seedless)"]]);
      L.verdict("<b>Ovary \u2192 fruit</b> as the ovules ripen into seeds; the ovary wall becomes the <b>pericarp</b>. False fruits add thalamus tissue (apple, strawberry, cashew); <b>parthenocarpic</b> fruits such as banana develop without fertilisation.");
    }
  }

  function select(id){
    st.view = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["endosperm", "Endosperm"], ["embryo", "Embryo stages"], ["seed", "Seed + fate map"], ["fruit", "Fruit types"]], st.view, select);
    L.watch("Cycle the presets: free-nuclear endosperm becomes cellular, the embryo passes globular \u2192 heart-shaped, and the fate map runs ovary \u2192 fruit.");
    draw();
  }

  window.SIMS.seedfruit = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Apomixis and polyembryony (NCERT §1.5, Exercise 18)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {view: "apo"};

  function seed(x, y, label, nucellar){
    var m = "";
    m += '<ellipse cx="' + x + '" cy="' + y + '" rx="58" ry="76" fill="#1b2a3a" stroke="#94a3b8" stroke-width="2"/>';
    m += '<ellipse cx="' + x + '" cy="' + y + '" rx="44" ry="60" fill="#fef3c7"/>';
    if(nucellar){
      m += L.circle(x - 16, y - 18, 12, "#34d399");
      m += L.circle(x + 16, y + 4, 12, "#34d399");
      m += L.circle(x - 6, y + 28, 12, "#34d399");
      m += L.circle(x + 14, y - 34, 9, "#f59e0b");
    } else {
      m += L.circle(x, y, 20, "#34d399");
    }
    m += L.text(x, y + 100, label, {size: 13, color: C.text});
    return m;
  }

  function draw(){
    var v = st.view, m = "";
    if(v === "apo"){
      m += seed(230, 140, "apomictic seed", false);
      m += L.text(230, 256, "embryo from a diploid egg", {size: 12, color: "#6ee7b7"});
      m += L.text(230, 274, "no reduction, no fertilisation", {size: 12, color: "#6ee7b7"});
      m += L.arrow(320, 140, 420, 140, "#94a3b8", 3);
      m += seed(520, 140, "clone of the parent", false);
      m += L.text(520, 262, "no meiosis, no fusion", {size: 12, color: C.muted});
    } else if(v === "poly"){
      m += seed(260, 140, "Citrus / mango seed", true);
      m += L.text(260, 262, "nucellar cells protrude into the embryo sac", {size: 12, color: "#6ee7b7"});
      m += L.text(560, 120, "more than one embryo", {size: 15, color: "#34d399", anchor: "start"});
      m += L.text(560, 146, "per seed = polyembryony", {size: 14, color: "#34d399", anchor: "start"});
      m += L.text(560, 172, "maternal clones", {size: 13, color: C.muted, anchor: "start"});
    } else {
      m += L.rect(70, 90, 250, 130, "#132132", ' rx="14" stroke="#f59e0b" stroke-width="2"');
      m += L.text(195, 128, "HYBRID SEED resown", {size: 14, color: "#fbbf24", weight: 700});
      m += L.text(195, 158, "segregates \u2014 hybrid", {size: 13, color: C.text});
      m += L.text(195, 180, "characters are lost", {size: 13, color: C.text});
      m += L.rect(400, 90, 250, 130, "#132132", ' rx="14" stroke="#34d399" stroke-width="2"');
      m += L.text(525, 128, "APOMICTIC HYBRID", {size: 14, color: "#6ee7b7", weight: 700});
      m += L.text(525, 158, "no segregation \u2014 seed", {size: 13, color: C.text});
      m += L.text(525, 180, "can be reused yearly", {size: 13, color: C.text});
      m += L.arrow(325, 155, 395, 155, "#94a3b8", 3);
      m += L.text(360, 262, "the hybrid seed industry's prize", {size: 13, color: C.muted});
    }
    L.svg(m, "Apomixis view: " + v, 300);
    if(v === "apo"){
      L.readout([["Apomixis", "seed without fertilisation"], ["Seen in", "Asteraceae and grasses"], ["Mimics", "sexual reproduction"], ["Embryo source", "diploid egg (no reduction)"]]);
      L.verdict("<b>Apomixis</b> is seed production without fertilisation \u2014 asexual reproduction that mimics sexual reproduction. Some <b>Asteraceae and grasses</b> form a diploid egg without reduction and raise the embryo with no fertilisation.");
    } else if(v === "poly"){
      L.readout([["Polyembryony", "more than one embryo per seed"], ["Source", "nucellar cells"], ["Examples", "Citrus, mango"], ["Genetic nature", "maternal clones"]]);
      L.verdict("<b>Polyembryony</b>: in many <b>Citrus and mango</b> varieties, nucellar cells around the embryo sac divide, protrude into it and develop into extra embryos. Lacking meiosis and fusion they are genetically uniform \u2014 <b>clones</b> of the parent.");
    } else {
      L.readout([["Hybrid seed resown", "segregates"], ["Apomictic hybrid", "no segregation"], ["Benefit", "reuse hybrid seed yearly"], ["Research goal", "transfer apomictic genes"]]);
      L.verdict("Hybrid productivity is lost when saved seed is resown because the progeny <b>segregates</b>. An <b>apomictic hybrid</b> would not segregate, so farmers could <b>reuse hybrid seed year after year</b> instead of buying costly seed every season.");
    }
  }

  function select(id){
    st.view = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["apo", "Apomixis"], ["poly", "Polyembryony"], ["hybrid", "Hybrid-seed payoff"]], st.view, select);
    L.legend([["#34d399", "apomictic embryo"], ["#f59e0b", "sexual embryo"]]);
    L.watch("Toggle the presets: the apomictic seed forms with no fertilisation, and nucellar embryos put more than one embryo in a single seed.");
    draw();
  }

  window.SIMS.apomixis = {mount: mount, draw: draw, select: select, state: st};
})();
