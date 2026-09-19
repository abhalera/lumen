// Class 12 Biology, Chapter 4 (lebo104) — simulation labs.
// One lab per lesson, on the shared Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — Monohybrid Punnett square and test cross (NCERT §4.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CROSSES = {
    TTtt: {
      label: "TT × tt", top: ["T"], side: ["t"], cells: ["Tt"],
      geno: "all Tt", pheno: "100% tall", ratio: "4 : 0",
      verdict: "<b>TT × tt:</b> every F1 is <b>Tt</b> and tall — only the dominant parent's character appears. Selfing this F1 gives the 3:1 F2."
    },
    Tttt: {
      label: "Tt × tt (test cross)", top: ["T", "t"], side: ["t", "t"], cells: ["Tt", "tt", "Tt", "tt"],
      geno: "1/2 Tt : 1/2 tt", pheno: "1/2 tall : 1/2 dwarf", ratio: "1 : 1",
      verdict: "<b>Test cross Tt × tt:</b> the recessive parent gives only t, so the progeny split <b>1 tall : 1 dwarf</b>. This 1:1 result proves the tall parent was heterozygous; TT would give all tall."
    },
    TtTt: {
      label: "Tt × Tt (F1 self)", top: ["T", "t"], side: ["T", "t"], cells: ["TT", "Tt", "Tt", "tt"],
      geno: "1/4 TT : 1/2 Tt : 1/4 tt", pheno: "3/4 tall : 1/4 dwarf", ratio: "3 : 1",
      verdict: "<b>F1 selfed:</b> the Punnett square gives <b>1/4 TT + 1/2 Tt + 1/4 tt</b> — the 1:2:1 genotype ratio and the classic <b>3 tall : 1 dwarf</b> phenotype ratio."
    }
  };
  var st = {preset: "TtTt"};

  function grid(top, side, cells){
    var m = "", x0 = 250, y0 = 70, cw = 70, ch = 62;
    top.forEach(function(g, i){
      m += L.text(x0 + cw * i + cw / 2, y0 - 14, g, {size: 16, weight: 700, color: "#7dd3fc"});
    });
    side.forEach(function(g, j){
      m += L.text(x0 - 24, y0 + ch * j + ch / 2 + 5, g, {size: 16, weight: 700, color: "#7dd3fc"});
    });
    cells.forEach(function(g, k){
      var i = k % top.length, j = Math.floor(k / top.length);
      var tall = g.indexOf("T") >= 0 && g !== "tt";
      m += L.rect(x0 + cw * i, y0 + ch * j, cw - 4, ch - 4, tall ? "#0e2a22" : "#2a1517", ' rx="6" stroke="' + (tall ? C.ok : C.danger) + '"');
      m += L.text(x0 + cw * i + cw / 2, y0 + ch * j + ch / 2 + 6, g, {size: 17, weight: 700, color: tall ? C.ok : C.danger});
    });
    return m;
  }

  function draw(){
    var d = CROSSES[st.preset];
    var m = grid(d.top, d.side, d.cells);
    m += L.text(360, 40, "PUNNETT SQUARE — " + d.label, {size: 15, weight: 700, color: "#7dd3fc"});
    m += L.text(360, 240, "square = male gametes down the side · circle = female gametes across the top", {size: 11, color: C.muted});
    L.svg(m, "Punnett square for " + d.label + ", " + d.pheno + ".", 270);
    L.readout([
      ["Cross", d.label, "#38bdf8"],
      ["Genotypes", d.geno],
      ["Phenotypes", d.pheno, C.ok],
      ["Ratio", d.ratio, C.ok]
    ]);
    L.verdict(d.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["TTtt", "TT × tt"], ["Tttt", "Tt × tt (test cross)"], ["TtTt", "Tt × Tt (F1 self)"]], st.preset, select);
    L.legend([[C.ok, "tall (T_)"], [C.danger, "dwarf (tt)"], ["#7dd3fc", "parental gametes"]]);
    draw();
  }

  window.SIMS.punnett1 = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Dihybrid cross and independent assortment (NCERT §4.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var CLASS = [
    {fill: "#0e2a22", stroke: "#34d399", color: "#34d399"}, // dominant for both
    {fill: "#12283d", stroke: "#38bdf8", color: "#38bdf8"}, // dominant first, recessive second
    {fill: "#2a1f0e", stroke: "#fbbf24", color: "#fbbf24"}, // recessive first, dominant second
    {fill: "#2a1517", stroke: "#f87171", color: "#f87171"}  // recessive for both
  ];
  var DATA = {
    F1: {
      label: "RRYY × rryy (F1)", top: ["RY"], side: ["ry"], rows: [["RrYy"]],
      pheno: "all round-yellow", numbers: "F1 = RrYy only",
      verdict: "<b>F1:</b> RRYY × rryy gives gametes RY and ry only, so every F1 seed is <b>RrYy, round-yellow</b>. The F1 makes four gamete types at 1/4 each."
    },
    F2: {
      label: "RrYy × RrYy (F2)", top: ["RY", "Ry", "rY", "ry"], side: ["RY", "Ry", "rY", "ry"],
      rows: [
        ["RRYY", "RRYy", "RrYY", "RrYy"],
        ["RRYy", "RRyy", "RrYy", "Rryy"],
        ["RrYY", "RrYy", "rrYY", "rrYy"],
        ["RrYy", "Rryy", "rrYy", "rryy"]
      ],
      pheno: "9 round-yellow : 3 round-green : 3 wrinkled-yellow : 1 wrinkled-green", numbers: "9 + 3 + 3 + 1 = 16",
      verdict: "<b>F2:</b> the 4×4 square gives <b>9:3:3:1</b> — exactly (3:1) × (3:1) — because the two gene pairs assort independently."
    },
    Ex7: {
      label: "TtYy × Ttyy (Exercise 7)", top: ["TY", "Ty", "tY", "ty"], side: ["Ty", "ty"],
      rows: [
        ["TTYy", "TTyy", "TtYy", "Ttyy"],
        ["TtYy", "Ttyy", "ttYy", "ttyy"]
      ],
      pheno: "3/8 tall-green : 3/8 tall-yellow : 1/8 dwarf-green : 1/8 dwarf-yellow", numbers: "tall-green 3/8 · dwarf-green 1/8",
      verdict: "<b>Exercise 7:</b> split the cross by trait — height 3/4 tall : 1/4 dwarf, colour 1/2 yellow : 1/2 green. So <b>tall-green = 3/4 × 1/2 = 3/8</b> and <b>dwarf-green = 1/4 × 1/2 = 1/8</b>."
    }
  };
  var st = {preset: "F2"};

  function classOf(d, i, j){
    var a = d.top[i], b = d.side[j];
    if(st.preset === "Ex7"){
      var tall = a.charAt(0) === "T" || b.charAt(0) === "T";
      var green = a.slice(1) === "y" && b.slice(1) === "y";
      return tall ? (green ? 1 : 0) : (green ? 3 : 2);
    }
    var R = a.charAt(0) === "R" || b.charAt(0) === "R";
    var Y = a.charAt(1) === "Y" || b.charAt(1) === "Y";
    return R ? (Y ? 0 : 1) : (Y ? 2 : 3);
  }

  function draw(){
    var d = DATA[st.preset];
    var nTop = d.top.length, nSide = d.side.length;
    var cw = st.preset === "Ex7" ? 78 : 66, ch = 46;
    var x0 = st.preset === "Ex7" ? 160 : 170, y0 = 90;
    var counts = [0, 0, 0, 0];
    var m = "";
    m += L.text(360, 40, "DIHYBRID PUNNETT SQUARE — " + d.label, {size: 15, weight: 700, color: "#7dd3fc"});
    d.top.forEach(function(g, i){ m += L.text(x0 + cw * i + cw / 2, y0 - 14, g, {size: 13, weight: 700, color: "#7dd3fc"}); });
    d.side.forEach(function(g, j){ m += L.text(x0 - 30, y0 + ch * j + ch / 2 + 5, g, {size: 13, weight: 700, color: "#7dd3fc"}); });
    d.rows.forEach(function(row, j){
      row.forEach(function(g, i){
        var k = classOf(d, i, j); counts[k] += 1;
        var s = CLASS[k];
        m += L.rect(x0 + cw * i, y0 + ch * j, cw - 3, ch - 3, s.fill, ' rx="5" stroke="' + s.stroke + '"');
        m += L.text(x0 + cw * i + cw / 2, y0 + ch * j + ch / 2 + 5, g, {size: 11, color: s.color});
      });
    });
    var total = nTop * nSide;
    m += L.text(360, y0 + ch * nSide + 50, total + "-square classes: " + counts.map(function(c){ return c + "/" + total; }).join(" · "), {size: 12, color: C.muted});
    L.svg(m, "Dihybrid Punnett square for " + d.label + ".", 300);
    L.readout([
      ["Cross", d.label, "#38bdf8"],
      ["F1 gametes", d.top.join(" · ")],
      ["Phenotypes", d.pheno, C.ok],
      ["Key numbers", d.numbers]
    ]);
    L.verdict(d.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["F1", "RRYY × rryy (F1)"], ["F2", "RrYy × RrYy (F2)"], ["Ex7", "TtYy × Ttyy (Ex 7)"]], st.preset, select);
    L.legend([["#34d399", "both dominant"], ["#38bdf8", "first dominant"], ["#fbbf24", "second dominant"], ["#f87171", "both recessive"]]);
    draw();
  }

  window.SIMS.punnett2 = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Linkage and recombination: Morgan's crosses (NCERT §4.3.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var DATA = {
    whiteyellow: {
      name: "Cross A: white-bodied white-eyed × brown-bodied red-eyed",
      rec: 1.3, level: "tightly linked", verdict: "<b>Cross A:</b> only <b>1.3%</b> recombinants — the genes for white eyes and yellow body are <b>tightly linked</b> on the X chromosome, so parental combinations overwhelmingly dominate."
    },
    whiteminiature: {
      name: "Cross B: white-eyed × miniature-winged",
      rec: 37.2, level: "loosely linked", verdict: "<b>Cross B:</b> <b>37.2%</b> recombinants — white and miniature are <b>loosely linked</b>, approaching the 50% of independently assorting genes."
    },
    unlinked: {
      name: "Reference: unlinked two-locus dihybrid",
      rec: 50, level: "independent assortment", verdict: "<b>Unlinked reference:</b> genes on different chromosomes assort independently, giving <b>9:3:3:1</b> and 50% recombinant-type combinations — the expectation Morgan's 1.3% result breaks."
    }
  };
  var st = {preset: "whiteyellow"};

  function draw(){
    var d = DATA[st.preset];
    var rec = Math.round(d.rec * 10), par = 1000 - rec;
    var m = "";
    m += L.text(360, 42, d.name, {size: 14, weight: 700, color: "#7dd3fc"});
    m += L.rect(70, 100, 580, 46, "#0f1f2e", ' rx="8" stroke="' + C.muted + '"');
    var frac = d.rec / 100;
    m += L.rect(70, 100, 580 * (1 - frac), 46, "#123b2a", ' rx="8"');
    m += L.rect(70 + 580 * (1 - frac), 100, 580 * frac, 46, "#4a1d1d", ' rx="8"');
    m += L.text(70 + 580 * (1 - frac) / 2, 128, "parental " + par, {size: 14, weight: 700, color: "#6ee7b7"});
    m += L.text(70 + 580 * (1 - frac) + 580 * frac / 2, 128, "recombinant " + rec, {size: 13, weight: 700, color: "#fca5a5"});
    m += L.text(360, 190, "recombination frequency = " + L.num(d.rec, 1) + "%  →  " + rec + " recombinant in 1000", {size: 15, weight: 700, color: "#a3e635"});
    m += L.text(360, 222, "1.3% (white–yellow) vs 37.2% (white–miniature): the percentage measures how far apart the genes sit", {size: 11, color: C.muted});
    L.svg(m, d.name + ": " + L.num(d.rec, 1) + "% recombination.", 260);
    L.readout([
      ["Cross", d.name, "#38bdf8"],
      ["Recombination", L.num(d.rec, 1) + "%", d.rec < 10 ? C.danger : C.ok],
      ["In 1000 flies", "recombinant " + rec + " · parental " + par],
      ["Interpretation", d.level, C.ok]
    ]);
    L.verdict(d.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["whiteyellow", "Morgan cross A (1.3%)"], ["whiteminiature", "Morgan cross B (37.2%)"], ["unlinked", "Unlinked reference"]], st.preset, select);
    L.legend([["#6ee7b7", "parental combinations"], ["#fca5a5", "recombinants"]]);
    draw();
  }

  window.SIMS.linkage = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Polygenic inheritance and pleiotropy (NCERT §4.4, §4.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var DATA = {
    cross: {
      name: "AABBCC × aabbcc",
      geno: "F1 = AaBbCc (3 of 6 dark alleles)",
      dose: 3, colour: "intermediate skin colour",
      number: "each parent contributes 3 dark alleles",
      verdict: "<b>Polygenic cross:</b> the darkest (AABBCC) × lightest (aabbcc) gives F1 <b>AaBbCc</b> — an intermediate shade, because the three gene pairs add their effects."
    },
    f2: {
      name: "AaBbCc × AaBbCc (F2)",
      geno: "AABBCC rarest · aabbcc rarest · intermediates common",
      dose: 3, colour: "full range from darkest to lightest",
      number: "AABBCC = 1/4 × 1/4 × 1/4 = 1/64",
      verdict: "<b>F2 extremes:</b> each extreme genotype needs all three pairs homozygous, so <b>AABBCC and aabbcc are 1/64 each</b>; the great majority of children cluster at intermediate doses."
    },
    pku: {
      name: "Pleiotropy: phenylketonuria",
      geno: "one faulty gene (phenylalanine hydroxylase)",
      dose: 0, colour: "one gene, several traits",
      number: "no phenylalanine → tyrosine enzyme",
      verdict: "<b>Pleiotropy:</b> the single phenylketonuria gene has multiple effects — phenylpyruvic acid accumulates, mental retardation follows, and hair and skin are lighter. One gene feeds many pathways."
    }
  };
  var st = {preset: "cross"};

  function draw(){
    var d = DATA[st.preset];
    var m = "";
    m += L.text(360, 42, "ADDITIVE DOSE OF DARK-ALLELE GENES — " + d.name, {size: 14, weight: 700, color: "#7dd3fc"});
    for(var i = 0; i <= 6; i += 1){
      var x = 90 + i * 90, on = (st.preset !== "pku") && i === d.dose;
      var shade = "rgba(120,72,50," + (0.15 + i * 0.13) + ")";
      m += L.rect(x, 110, 64, 70, shade, ' rx="8" stroke="' + (on ? "#f59e0b" : C.faint) + '" stroke-width="' + (on ? 3 : 1) + '"');
      m += L.text(x + 32, 200, i + " dark", {size: 11, color: on ? "#fbbf24" : C.muted});
    }
    m += L.text(360, 100, "0 = aabbcc lightest", {size: 11, color: C.muted});
    if(st.preset === "pku"){
      m += L.rect(180, 230, 360, 40, "#2a1f0e", ' rx="8" stroke="#fbbf24"');
      m += L.text(360, 255, "brain (retardation) · hair (lighter) · skin (lighter)", {size: 13, color: "#fcd34d"});
    } else {
      m += L.text(360, 252, "AABBCC darkest (6 dark) · aabbcc lightest (0 dark)", {size: 12, color: C.text});
    }
    L.svg(m, d.name + ": " + d.colour + ".", 290);
    L.readout([
      ["Situation", d.name, "#38bdf8"],
      ["Genotype", d.geno],
      ["Effect", d.colour],
      ["Key number", d.number, C.ok]
    ]);
    L.verdict(d.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["cross", "Darkest × lightest (F1)"], ["f2", "F2 extremes (1/64)"], ["pku", "Pleiotropy: PKU"]], st.preset, select);
    L.legend([["#f59e0b", "active dose"], ["rgba(120,72,50,0.8)", "skin shade"]]);
    draw();
  }

  window.SIMS.polygenic = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Sex determination systems (NCERT §4.6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var DATA = {
    human: {
      name: "Humans (male heterogamety, XY)",
      male: "XY — makes 1/2 X-sperm + 1/2 Y-sperm",
      female: "XX — makes only X-ova",
      offspring: "X-sperm + ovum → XX girl; Y-sperm + ovum → XY boy, 1/2 each",
      verdict: "<b>Humans:</b> the male is heterogametic (<b>XY</b>) and the female is XX. Each pregnancy is a 1/2 chance of a girl or a boy, and the <b>sperm decides</b> — blaming mothers is unscientific."
    },
    grasshopper: {
      name: "Grasshopper (XO)",
      male: "XO — one X, no Y",
      female: "XX",
      offspring: "the sperm that lacks a sex chromosome gives an XO son",
      verdict: "<b>Grasshopper:</b> the male has only one sex chromosome (<b>XO</b>), an XO system, while the female is XX. Henking's 'X body' was the first visible sex chromosome."
    },
    bird: {
      name: "Birds / chicken (female heterogamety, ZW)",
      male: "ZZ",
      female: "ZW",
      offspring: "the egg's Z or W decides the sex of the chick",
      verdict: "<b>Birds:</b> here the <b>female is heterogametic (ZW)</b> and the male is ZZ — the opposite of humans, showing that sex determination is not always male-driven."
    },
    bee: {
      name: "Honey bee (haplodiploidy)",
      male: "drone 16 — haploid, from an unfertilised egg",
      female: "queen/worker 32 — diploid, from a fertilised egg",
      offspring: "the drone has a mother and a grandfather but no father",
      verdict: "<b>Honey bee:</b> fertilised eggs give diploid females (<b>32</b>), unfertilised eggs give haploid males (<b>16</b>) by parthenogenesis — a drone has no father and cannot have sons."
    }
  };
  var st = {preset: "human"};

  function draw(){
    var d = DATA[st.preset];
    var m = "";
    m += L.text(360, 42, d.name.toUpperCase(), {size: 15, weight: 700, color: "#7dd3fc"});
    m += L.rect(70, 80, 240, 120, "#12283d", ' rx="12" stroke="#60a5fa" stroke-width="2"');
    m += L.text(190, 112, "MALE", {size: 16, weight: 700, color: "#60a5fa"});
    m += L.text(190, 142, d.male, {size: 12});
    m += L.rect(410, 80, 240, 120, "#2a1230", ' rx="12" stroke="#f472b6" stroke-width="2"');
    m += L.text(530, 112, "FEMALE", {size: 16, weight: 700, color: "#f472b6"});
    m += L.text(530, 142, d.female, {size: 12});
    m += L.arrow(190, 212, 360, 212, "#60a5fa", 3);
    m += L.arrow(530, 212, 360, 212, "#f472b6", 3);
    m += L.text(360, 244, d.offspring, {size: 12, color: "#a3e635"});
    if(st.preset === "bee"){
      m += L.text(360, 268, "females 32 (diploid) · males 16 (haploid)", {size: 12, color: "#fbbf24", weight: 700});
    }
    L.svg(m, d.name + ": " + d.offspring + ".", 290);
    L.readout([
      ["System", d.name, "#38bdf8"],
      ["Male", d.male],
      ["Female", d.female],
      ["Offspring", d.offspring, C.ok]
    ]);
    L.verdict(d.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["human", "Humans (XY)"], ["grasshopper", "Grasshopper (XO)"], ["bird", "Birds (ZW)"], ["bee", "Honey bee (32/16)"]], st.preset, select);
    L.legend([["#60a5fa", "male"], ["#f472b6", "female"], ["#a3e635", "offspring rule"]]);
    draw();
  }

  window.SIMS.sexdetermination = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Mutation: point changes and frame shifts (NCERT §4.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var DATA = {
    normal: {
      name: "Normal beta-globin",
      codon: "GAG", aa: "Glutamic acid (Glu)", note: "codon 6 of the beta-globin gene",
      effect: "disc-shaped red blood cell", colour: C.ok,
      verdict: "<b>Normal:</b> codon 6 of beta-globin is <b>GAG</b> and reads as <b>glutamic acid</b>. The red cells stay disc-shaped and carry oxygen normally."
    },
    sickle: {
      name: "Sickle-cell point mutation",
      codon: "GUG", aa: "Valine (Val)", note: "one base pair changed (A → U in the mRNA codon)",
      effect: "HbS polymerises under low oxygen → sickled cell", colour: C.danger,
      verdict: "<b>Point mutation:</b> changing <b>GAG to GUG</b> puts <b>valine</b> in place of glutamic acid at position 6. HbS polymerises under low oxygen tension and the red cell sickles — sickle-cell anaemia."
    },
    frames: {
      name: "Frame-shift from a 1–2 base indel",
      codon: "GAG + 1 base inserted", aa: "reading frame shifts", note: "insertions/deletions of 1–2 bases realign every later codon",
      effect: "completely different downstream protein", colour: "#fbbf24",
      verdict: "<b>Frame-shift:</b> inserting or deleting <b>1–2 bases</b> shifts the reading frame, so every codon after the change is read wrongly. Point mutation changes one base; frame-shift changes everything downstream."
    }
  };
  var st = {preset: "sickle"};

  function draw(){
    var d = DATA[st.preset];
    var m = "";
    m += L.text(360, 42, "BETA-GLOBIN CODON STRIP — " + d.name, {size: 14, weight: 700, color: "#7dd3fc"});
    var codons = ["codon 4", "codon 5", "codon 6", "codon 7", "codon 8"];
    codons.forEach(function(c, i){
      var active = i === 2;
      m += L.rect(90 + i * 112, 90, 100, 52, active ? (st.preset === "sickle" ? "#4a1d1d" : "#12283d") : "#0f1f2e",
        ' rx="8" stroke="' + (active ? d.colour : C.faint) + '" stroke-width="' + (active ? 3 : 1) + '"');
      m += L.text(140 + i * 112, 113, active ? d.codon : c, {size: 12, weight: 700, color: active ? d.colour : C.muted});
      m += L.text(140 + i * 112, 132, active ? "←" : "", {size: 12, color: d.colour});
    });
    m += L.text(360, 180, "amino acid at position 6: " + d.aa, {size: 15, weight: 700, color: d.colour});
    m += L.text(360, 208, d.note, {size: 12, color: C.text});
    m += L.circle(360, 246, 18, d.colour, ' opacity="0.35"');
    m += L.text(360, 251, d.effect, {size: 11, color: C.text});
    L.svg(m, d.name + ": " + d.codon + " → " + d.aa + ".", 290);
    L.readout([
      ["Mutation", d.name, "#38bdf8"],
      ["Codon 6", d.codon, d.colour],
      ["Amino acid", d.aa],
      ["Effect", d.effect]
    ]);
    L.verdict(d.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["normal", "Normal GAG"], ["sickle", "Point mutation GUG"], ["frames", "Frame-shift"]], st.preset, select);
    L.legend([[C.ok, "normal"], [C.danger, "sickle point mutation"], ["#fbbf24", "frame-shift"]]);
    draw();
  }

  window.SIMS.mutation = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Pedigree analysis (NCERT §4.8.1, §4.8.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var DATA = {
    sickle: {
      name: "Sickle-cell anaemia (autosomal recessive)",
      mode: "autosomal recessive — HbS needed from both parents",
      carrier: "carrier parents HbAHbS look healthy",
      risk: "1/4 HbSHbS affected per pregnancy; 1/2 carriers",
      verdict: "<b>Sickle-cell pedigree:</b> the trait is <b>autosomal recessive</b>; carrier parents (HbAHbS) have <b>1/4 affected</b> children per pregnancy. The disease can skip generations through healthy carriers."
    },
    haemophilia: {
      name: "Haemophilia (X-linked recessive)",
      mode: "X-linked recessive — the gene sits on the X chromosome",
      carrier: "carrier mother XHXh is healthy",
      risk: "1/2 of her sons are XhY affected; daughters are carriers at most",
      verdict: "<b>Haemophilia pedigree:</b> an <b>X-linked recessive</b> trait; carrier mothers pass it to about <b>half their sons</b>. Queen Victoria's family is the textbook example."
    },
    colourblind: {
      name: "Colour blindness (X-linked recessive)",
      mode: "X-linked recessive",
      carrier: "carrier mother XCXc has normal vision",
      risk: "1/2 of sons colour blind; a daughter is affected only if the father is too",
      verdict: "<b>Colour-blindness pedigree:</b> again <b>X-linked recessive</b> — mostly males are affected because they carry a single X. A daughter needs an affected allele from both parents."
    }
  };
  var st = {preset: "sickle"};

  function sym(x, y, female, affected, label){
    var m = "";
    if(female){
      m += L.circle(x, y, 16, affected ? "#4a1d1d" : "#0f1f2e", ' stroke="' + (affected ? C.danger : C.muted) + '" stroke-width="2"');
    } else {
      m += L.rect(x - 15, y - 15, 30, 30, affected ? "#4a1d1d" : "#0f1f2e", ' rx="4" stroke="' + (affected ? C.danger : C.muted) + '" stroke-width="2"');
    }
    if(label) m += L.text(x, y + 34, label, {size: 11, color: affected ? C.danger : C.muted});
    return m;
  }

  function draw(){
    var d = DATA[st.preset];
    var m = "";
    m += L.text(360, 34, "PEDIGREE — " + d.name, {size: 15, weight: 700, color: "#7dd3fc"});
    m += L.text(360, 58, "square = male · circle = female · shaded = affected", {size: 11, color: C.muted});
    // Generation I: carrier father and carrier mother
    m += sym(220, 120, true, false, "I-1 carrier mother");
    m += sym(500, 120, false, false, "I-2 carrier father");
    m += L.line(236, 120, 384, 120, C.muted, 2);
    m += L.line(310, 120, 310, 160, C.muted, 2);
    // Generation II: normal daughter, affected son, carrier daughter
    m += L.line(310, 160, 170, 160, C.muted, 2);
    m += L.line(310, 160, 360, 160, C.muted, 2);
    m += L.line(310, 160, 550, 160, C.muted, 2);
    var aff = true;
    m += sym(170, 200, true, false, "II-1 healthy");
    m += sym(360, 200, false, aff, "II-2 affected son");
    m += sym(550, 200, true, false, "II-3 carrier");
    m += L.line(360, 215, 360, 245, C.muted, 2);
    m += sym(360, 280, false, aff, "III-1 affected");
    L.svg(m, "Pedigree of " + d.name + ".", 320);
    L.readout([
      ["Trait", d.name, "#38bdf8"],
      ["Inheritance", d.mode],
      ["Carriers", d.carrier],
      ["Recurrence risk", d.risk, C.ok]
    ]);
    L.verdict(d.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["sickle", "Sickle-cell (autosomal)"], ["haemophilia", "Haemophilia (X-linked)"], ["colourblind", "Colour blindness (X-linked)"]], st.preset, select);
    L.legend([[C.muted, "unaffected"], [C.danger, "affected"], ["#7dd3fc", "generation labels"]]);
    draw();
  }

  window.SIMS.pedigree = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 8 — Chromosomal disorders from a karyotype (NCERT §4.8.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var DATA = {
    normal: {
      name: "46, XX / XY", total: 46, diag: "Normal human karyotype", colour: C.ok,
      sym: "22 pairs of autosomes + one pair of sex chromosomes",
      verdict: "<b>Normal:</b> 23 pairs = <b>46</b> chromosomes, with 22 autosome pairs and XX (female) or XY (male). Gametes carry 23 each.",
      highlight: -1
    },
    down: {
      name: "47, +21", total: 47, diag: "Down's syndrome (trisomy 21)", colour: C.danger,
      sym: "short stature, small round head, furrowed tongue, partially open mouth, broad palm crease, retarded development",
      verdict: "<b>Down's syndrome:</b> an extra copy of chromosome 21 (trisomy 21) gives <b>47</b> chromosomes. Langdon Down described it in 1866.",
      highlight: 21
    },
    turner: {
      name: "45, XO", total: 45, diag: "Turner's syndrome", colour: C.danger,
      sym: "sterile female with rudimentary ovaries and lack of secondary sexual characters",
      verdict: "<b>Turner's syndrome:</b> one X is missing (<b>45, XO</b>); the individual is a sterile female with rudimentary ovaries and underdeveloped feminine characters.",
      highlight: -2
    },
    klinefelter: {
      name: "47, XXY", total: 47, diag: "Klinefelter's syndrome", colour: C.danger,
      sym: "overall masculine development plus gynaecomastia; sterile",
      verdict: "<b>Klinefelter's syndrome:</b> an additional X gives <b>47, XXY</b>, with overall masculine development plus gynaecomastia; affected individuals are sterile.",
      highlight: -3
    }
  };
  var st = {preset: "down"};

  function draw(){
    var d = DATA[st.preset];
    var m = "";
    m += L.text(360, 34, "KARYOTYPE — " + d.name, {size: 15, weight: 700, color: "#7dd3fc"});
    for(var i = 1; i <= 22; i += 1){
      var col = (i - 1) % 11, row = Math.floor((i - 1) / 11);
      var x = 70 + col * 52, y = 70 + row * 70;
      var extra = d.highlight === i;
      m += L.rect(x, y, 18, 52, extra ? "#4a1d1d" : "#1e3a5f", ' rx="5" stroke="' + (extra ? C.danger : C.faint) + '" stroke-width="' + (extra ? 3 : 1) + '"');
      m += L.rect(x + 21, y, 18, 52, extra ? "#4a1d1d" : "#1e3a5f", ' rx="5" stroke="' + (extra ? C.danger : C.faint) + '" stroke-width="' + (extra ? 3 : 1) + '"');
      m += L.text(x + 20, y + 66, String(i), {size: 10, color: extra ? C.danger : C.muted});
    }
    // sex chromosome pair
    var sx = 70 + 3 * 52, sy = 210;
    var turns = d.highlight === -2, kline = d.highlight === -3;
    m += L.rect(sx, sy, 18, 52, turns ? "#4a1d1d" : "#3b1d4a", ' rx="5" stroke="' + (turns ? C.danger : "#c084fc") + '" stroke-width="' + (turns ? 3 : 1) + '"');
    m += L.text(sx + 9, sy + 68, "X", {size: 11, color: turns ? C.danger : "#c084fc"});
    if(!turns){
      m += L.rect(sx + 21, sy, 18, 52, "#3b1d4a", ' rx="5" stroke="' + (kline ? C.danger : "#c084fc") + '" stroke-width="' + (kline ? 3 : 1) + '"');
      m += L.text(sx + 30, sy + 68, kline ? "X" : "Y", {size: 11, color: kline ? C.danger : "#c084fc"});
    }
    m += L.text(360, 296, "total chromosomes = " + d.total, {size: 16, weight: 700, color: d.colour});
    L.svg(m, "Karyotype " + d.name + ": " + d.diag + ".", 330);
    L.readout([
      ["Karyotype", d.name, "#38bdf8"],
      ["Total", d.total + " chromosomes", d.colour],
      ["Diagnosis", d.diag, d.colour],
      ["Features", d.sym]
    ]);
    L.verdict(d.verdict);
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["normal", "Normal 46"], ["down", "Down's 47, +21"], ["turner", "Turner's 45, XO"], ["klinefelter", "Klinefelter's 47, XXY"]], st.preset, select);
    L.legend([["#c084fc", "sex chromosomes"], [C.danger, "extra or missing chromosome"]]);
    draw();
  }

  window.SIMS.karyotype = {mount: mount, draw: draw, select: select, state: st};
})();
