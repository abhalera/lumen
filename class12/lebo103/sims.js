// Class 12 Biology, Chapter 3 (lebo103) — simulation labs.
// One lab per lesson, on the shared Lumen lab framework (window.SIMS + window.LAB).
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function labNoTimeline(){
  var tb = document.getElementById("legacy-lab-toolbar");
  if(tb) tb.style.display = "none";
}

// -------------------------------------------------------------------------
// Lab 1 — RCH strategy explorer (NCERT §3.1, reproductive health strategies)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var DATA = {
    awareness: {
      name: "Awareness & sex education",
      who: "total well-being: physical + emotional + behavioural + social",
      anchor: "§3.1: media, parents, teachers, friends; sex education in schools",
      improves: "better sex-related awareness; myths replaced by right information",
      verdict: "<b>Awareness:</b> the primary RCH step — audio-visual and print media, parents, relatives, teachers, friends, and <b>sex education in schools</b> give right information about organs, adolescence, hygiene, STDs/AIDS and birth control."
    },
    infra: {
      name: "Care & infrastructure",
      who: "medical assistance for every reproduction-related problem",
      anchor: "§3.1: infrastructural facilities, professional expertise, material support",
      improves: "more assisted deliveries, better post-natal care, lower MMR and IMR",
      verdict: "<b>Care + infrastructure:</b> pregnancy, delivery, STDs, abortions, contraception, menstrual problems and infertility need facilities, expertise and material support; improvement shows up as assisted deliveries, post-natal care and falling MMR/IMR."
    },
    law: {
      name: "Programmes & legal ban",
      who: "family planning since 1951, now RCH; statutory guardrails",
      anchor: "§3.1: amniocentesis ban for sex-determination; massive child immunisation",
      improves: "check on female foeticide; healthier mothers and children",
      verdict: "<b>Programmes + law:</b> family planning began in <b>1951</b> and continues as RCH; the <b>statutory ban on amniocentesis for sex-determination</b> legally checks female foeticide, alongside massive child immunisation."
    }
  };
  var st = {preset: "awareness"};

  function draw(){
    var key = st.preset, d = DATA[key];
    var m = "";
    var cols = [
      ["awareness", "AWARENESS", "#38bdf8"],
      ["infra", "CARE + INFRA", "#f59e0b"],
      ["law", "PROGRAMMES + LAW", "#f87171"]
    ];
    cols.forEach(function(col, i){
      var x = 30 + i * 222, on = col[0] === key;
      m += L.rect(x, 45, 210, 190, on ? "#12283d" : "#0c1825", ' rx="10" stroke="' + col[2] + '" stroke-width="' + (on ? 3 : 1) + '"' + (on ? "" : ' opacity="0.55"'));
      m += L.text(x + 105, 70, col[1], {size: 15, weight: 700, color: col[2]});
      if(col[0] === "awareness"){
        m += L.text(x + 14, 100, "organs, adolescence", {size: 11, anchor: "start"});
        m += L.text(x + 14, 118, "hygiene, STDs, AIDS", {size: 11, anchor: "start"});
        m += L.text(x + 14, 136, "birth control, care of", {size: 11, anchor: "start"});
        m += L.text(x + 14, 154, "pregnant mothers, breast", {size: 11, anchor: "start"});
        m += L.text(x + 14, 172, "feeding, equal chances", {size: 11, anchor: "start"});
        m += L.text(x + 14, 196, "media + schools", {size: 11, anchor: "start", color: "#7dd3fc"});
        m += L.text(x + 14, 214, "against myths", {size: 11, anchor: "start", color: "#7dd3fc"});
      } else if(col[0] === "infra"){
        m += L.text(x + 14, 100, "pregnancy, delivery", {size: 11, anchor: "start"});
        m += L.text(x + 14, 118, "STDs, abortions", {size: 11, anchor: "start"});
        m += L.text(x + 14, 136, "contraception, menstrual", {size: 11, anchor: "start"});
        m += L.text(x + 14, 154, "problems, infertility", {size: 11, anchor: "start"});
        m += L.text(x + 14, 178, "child immunisation", {size: 11, anchor: "start", color: "#fcd34d"});
        m += L.text(x + 14, 196, "research support", {size: 11, anchor: "start", color: "#fcd34d"});
        m += L.text(x + 14, 214, "(Saheli, CDRI Lucknow)", {size: 11, anchor: "start", color: "#fcd34d"});
      } else {
        m += L.text(x + 14, 100, "family planning 1951", {size: 11, anchor: "start"});
        m += L.text(x + 14, 118, "now RCH programmes", {size: 11, anchor: "start"});
        m += L.text(x + 14, 142, "BAN amniocentesis", {size: 11, anchor: "start", color: "#fca5a5"});
        m += L.text(x + 14, 160, "for sex-determination", {size: 11, anchor: "start", color: "#fca5a5"});
        m += L.text(x + 14, 184, "checks female foeticide", {size: 11, anchor: "start", color: "#fca5a5"});
        m += L.text(x + 14, 214, "amniocentesis tests:", {size: 11, anchor: "start", color: "#94a3b8"});
        m += L.text(x + 14, 228, "Down, haemophilia, sickle-cell", {size: 10, anchor: "start", color: "#94a3b8"});
      }
    });
    L.svg(m, "Three RCH pillars, current focus: " + d.name + ".", 260);
    L.readout([
      ["Focus", d.name, "#38bdf8"],
      ["WHO view", d.who],
      ["Book anchor", d.anchor],
      ["Improvement shown by", d.improves, C.ok]
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
    L.presets([["awareness", "Awareness & sex education"], ["infra", "Care & infrastructure"], ["law", "Programmes & legal ban"]], st.preset, select);
    L.legend([["#38bdf8", "awareness"], ["#f59e0b", "care + infrastructure"], ["#f87171", "programmes + legal ban"]]);
    draw();
  }

  window.SIMS.rch = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Contraceptive method comparator (NCERT §3.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var METHODS = {
    natural: {
      name: "Natural / traditional",
      principle: "Avoid the ovum and sperms meeting — no medicines, no devices",
      facts: "periodic abstinence day 10–17; withdrawal before ejaculation; lactational amenorrhoea",
      status: "effective only up to six months of full breast-feeding",
      verdict: "<b>Natural methods:</b> abstain during the <b>fertile period (day 10–17)</b>, use withdrawal (<i>coitus interruptus</i>), or rely on <b>lactational amenorrhoea</b> — effective only up to <b>six months</b> following parturition. Side effects almost nil; <b>chances of failure are high</b>."
    },
    barrier: {
      name: "Barrier methods",
      principle: "A physical sheath stops the ejaculated semen from entering the female tract",
      facts: "condoms (male and female) · diaphragms, cervical caps, vaults with spermicidal creams/jellies/foams",
      status: "condoms also protect against STIs and AIDS",
      verdict: "<b>Barriers:</b> condoms of thin rubber/latex cover the penis or the vagina and cervix; <b>'Nirodh'</b> is the popular male brand. Diaphragms, cervical caps and vaults are reusable cervix covers, usually with spermicidal creams, jellies or foams. Condoms give the <b>additional benefit of STI/AIDS protection</b>."
    },
    iud: {
      name: "IUDs",
      principle: "Inserted in the uterus by doctors or expert nurses; increase phagocytosis of sperms",
      facts: "non-medicated Lippes loop · copper CuT, Cu7, Multiload 375 · hormone Progestasert, LNG-20",
      status: "ideal for delaying or spacing children; widely accepted in India",
      verdict: "<b>IUDs:</b> copper ions suppress sperm motility and fertilising capacity; hormone-releasing IUDs also make the <b>uterus unsuitable for implantation</b> and the <b>cervix hostile to sperms</b>. Examples: Lippes loop; CuT, Cu7, Multiload 375; Progestasert, LNG-20."
    },
    pill: {
      name: "Oral pills",
      principle: "Inhibit ovulation and implantation and alter cervical mucus against sperm entry",
      facts: "progestogen or progestogen–estrogen daily for 21 days from the first five days, then a 7-day gap",
      status: "Saheli is a non-steroidal once-a-week pill",
      verdict: "<b>Pills:</b> taken daily for <b>21 days</b>, starting preferably within the first five days of the cycle, then a <b>7-day gap</b> repeated till conception must be prevented. Very effective with lesser side effects; <b>Saheli</b> (CDRI Lucknow) is non-steroidal and taken <b>once a week</b>."
    },
    emergency: {
      name: "Emergency contraceptives",
      principle: "Act after unprotected coitus to avoid a possible pregnancy",
      facts: "progestogens/progestogen–estrogen or IUDs within 72 hours of coitus",
      status: "for rape or casual unprotected intercourse",
      verdict: "<b>Emergency:</b> progestogens, progestogen–estrogen combinations or IUDs used <b>within 72 hours of coitus</b> are very effective after rape or casual unprotected intercourse."
    },
    surgical: {
      name: "Surgical / sterilisation",
      principle: "Terminal method that blocks gamete transport",
      facts: "vasectomy (vas deferens cut/tied) · tubectomy (fallopian tube cut/tied)",
      status: "highly effective, but reversibility is very poor",
      verdict: "<b>Surgery:</b> <b>vasectomy</b> removes or ties a small part of the vas deferens; <b>tubectomy</b> removes or ties a small part of the fallopian tube. Highly effective, but <b>reversibility is very poor</b> — a terminal method."
    }
  };
  var st = {preset: "pill"};

  function draw(){
    var d = METHODS[st.preset];
    var m = "";
    m += L.rect(240, 52, 240, 150, "#0f1f2e", ' rx="14" stroke="' + C.muted + '" stroke-width="1.5"');
    m += L.text(360, 80, d.name.toUpperCase(), {size: 15, weight: 700, color: "#7dd3fc"});
    var lines = d.facts.split(" · ");
    lines.forEach(function(t, i){
      m += L.text(360, 108 + i * 22, t, {size: 12, color: C.text});
    });
    m += L.circle(130, 128, 16, "#f9a8d4");
    m += L.text(130, 134, "ovum", {size: 10, color: "#500724"});
    m += L.circle(590, 128, 16, "#a5f3fc");
    m += L.text(590, 134, "sperm", {size: 10, color: "#164e63"});
    var blocked = st.preset === "barrier" || st.preset === "iud" || st.preset === "surgical";
    m += L.arrow(152, 128, blocked ? 250 : 360, 128, blocked ? C.danger : C.ok, 3);
    m += L.arrow(568, 128, blocked ? 470 : 360, 128, blocked ? C.danger : C.ok, 3);
    m += L.text(360, 235, blocked ? "meeting blocked" : "method acts before/after meeting", {size: 13, color: blocked ? C.danger : C.ok, weight: 700});
    m += L.text(360, 258, "use only in consultation with qualified medical professionals", {size: 11, color: C.muted});
    L.svg(m, d.name + ": " + d.principle + ".", 290);
    L.readout([
      ["Method", d.name, "#38bdf8"],
      ["Principle", d.principle],
      ["Book facts", d.facts],
      ["Status", d.status, st.preset === "surgical" ? C.danger : C.ok]
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
    L.presets([
      ["natural", "Natural"], ["barrier", "Barrier"], ["iud", "IUDs"],
      ["pill", "Oral pills"], ["emergency", "Emergency"], ["surgical", "Surgical"]
    ], st.preset, select);
    L.legend([["#7dd3fc", "method card"], [C.danger, "gamete meeting blocked"]]);
    draw();
  }

  window.SIMS.contraception = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — MTP legal-window explainer (NCERT §3.3 + 2017 Amendment box)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "early", week: 8};

  function rules(w){
    if(w <= 12) return {
      zone: "first trimester", safe: "relatively safe", rmp: "one registered medical practitioner",
      verdict: "<b>Within the first 12 weeks:</b> the pregnancy may be terminated on the opinion of <b>one registered medical practitioner</b> if a ground in the 2017 box exists. First-trimester MTP is considered <b>relatively safe</b>."
    };
    if(w < 24) return {
      zone: "second trimester", safe: "much riskier", rmp: "two registered medical practitioners",
      verdict: "<b>More than 12 but fewer than 24 weeks:</b> <b>two registered medical practitioners</b> must be of the opinion, formed in good faith, that a required ground exists. Second-trimester abortions are <b>much riskier</b>."
    };
    return {
      zone: "beyond the box's stated rule", safe: "outside the 2017 box's wording", rmp: "not stated in the book",
      verdict: "<b>24 weeks and beyond:</b> the 2017 box's rule is written for <b>fewer than 24 weeks</b>, so this chapter does not state a rule here — refer to the Act and medical advice."
    };
  }

  function draw(){
    var w = st.week, r = rules(w);
    var m = "";
    var x0 = 70, x1 = 650, y = 120, sx = (x1 - x0) / 28;
    m += L.line(x0, y, x1, y, C.faint, 3);
    m += L.rect(x0, y - 8, 12 * sx, 16, "rgba(52,211,153,0.35)");
    m += L.rect(x0 + 12 * sx, y - 8, 12 * sx, 16, "rgba(245,158,11,0.35)");
    m += L.rect(x0 + 24 * sx, y - 8, 4 * sx, 16, "rgba(239,68,68,0.35)");
    [0, 4, 8, 12, 16, 20, 24, 28].forEach(function(t){
      m += L.text(x0 + t * sx, y + 28, t + "w", {size: 11, color: C.muted});
    });
    m += L.text(x0 + 6 * sx, y - 24, "≤ 12 weeks: 1 RMP", {size: 12, color: C.ok});
    m += L.text(x0 + 18 * sx, y - 24, "12–24: 2 RMPs", {size: 12, color: "#fbbf24"});
    m += L.text(x0 + 26 * sx, y - 24, "≥ 24", {size: 12, color: C.danger});
    m += L.circle(x0 + Math.min(w, 28) * sx, y, 9, "#f8fafc", ' stroke="#0f172a" stroke-width="2"');
    m += L.text(x0 + Math.min(w, 28) * sx, y + 4, "▲", {size: 10, color: "#0f172a"});
    m += L.text(360, 52, "MEDICAL TERMINATION OF PREGNANCY — the book's 2017 box", {size: 14, weight: 700, color: "#7dd3fc"});
    m += L.text(360, 210, "Grounds: (i) risk to the woman's life or grave injury to health; (ii) substantial risk of serious handicap to the child", {size: 11, color: C.muted});
    m += L.text(360, 232, "MTP legalised in India in 1971; 45–50 million MTPs a year worldwide ≈ 1/5 of conceptions", {size: 11, color: C.muted});
    L.svg(m, "Pregnancy week " + w + " on the MTP rule timeline.", 260);
    L.readout([
      ["Pregnancy week", w + " weeks", "#38bdf8"],
      ["Safety", r.safe],
      ["Opinion required", r.rmp, r.rmp.indexOf("two") >= 0 ? "#fbbf24" : C.ok],
      ["Book zone", r.zone]
    ]);
    L.verdict(r.verdict);
  }

  function setWeek(w){
    st.week = w;
    L.setVal("mtp-week", w + " weeks");
    draw();
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    var w = id === "early" ? 8 : (id === "mid" ? 20 : 28);
    setWeek(w);
  }

  function mount(){
    labNoTimeline();
    L.presets([["early", "8 weeks (early)"], ["mid", "20 weeks (mid)"], ["late", "28 weeks (beyond)"]], st.preset, select);
    L.controls(L.slider("mtp-week", "Pregnancy week", 4, 28, 1, st.week, st.week + " weeks"));
    L.onInput("mtp-week", function(v){ st.preset = ""; L.markPreset(""); setWeek(v); });
    L.legend([[C.ok, "≤ 12 weeks: one RMP"], ["#fbbf24", "12–24 weeks: two RMPs"], [C.danger, "≥ 24 weeks: beyond the book's box"]]);
    draw();
  }

  window.SIMS.mtp = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — STI curability classifier (NCERT §3.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var STIS = {
    gonorrhoea: {name: "Gonorrhoea", curable: true, routes: "sexual intercourse", note: "completely curable if detected early and treated properly"},
    syphilis: {name: "Syphilis", curable: true, routes: "sexual intercourse", note: "completely curable if detected early and treated properly"},
    chlamydiasis: {name: "Chlamydiasis", curable: true, routes: "sexual intercourse", note: "completely curable if detected early and treated properly"},
    trichomoniasis: {name: "Trichomoniasis", curable: true, routes: "sexual intercourse", note: "completely curable if detected early and treated properly"},
    herpes: {name: "Genital herpes", curable: false, routes: "sexual intercourse", note: "one of the three exceptions — not completely curable"},
    hepatitisb: {name: "Hepatitis-B", curable: false, routes: "sexual intercourse; also needles/instruments, transfusion, mother to foetus", note: "one of the three exceptions — not completely curable"},
    hiv: {name: "HIV (leading to AIDS)", curable: false, routes: "sexual intercourse; also needles/instruments, transfusion, mother to foetus", note: "most dangerous of the listed STIs — one of the three exceptions"}
  };
  var st = {preset: "gonorrhoea"};

  function draw(){
    var d = STIS[st.preset];
    var m = "";
    m += L.rect(40, 50, 640, 92, d.curable ? "#0e2a22" : "#2a1517", ' rx="12" stroke="' + (d.curable ? C.ok : C.danger) + '" stroke-width="2"');
    m += L.text(360, 82, d.name.toUpperCase(), {size: 20, weight: 700, color: d.curable ? C.ok : C.danger});
    m += L.text(360, 112, d.curable ? "COMPLETELY CURABLE if detected early and treated properly" : "NOT completely curable — one of the book's three exceptions", {size: 13, color: d.curable ? C.ok : C.danger});
    m += L.text(60, 178, "Routes: " + d.routes, {size: 12, color: C.text, anchor: "start"});
    m += L.text(60, 200, "Early signs: itching, fluid discharge, slight pain, swellings — infected females may be asymptomatic", {size: 11, color: C.muted, anchor: "start"});
    m += L.text(60, 222, "Late complications: PID, abortions, still births, ectopic pregnancies, infertility or cancer", {size: 11, color: C.muted, anchor: "start"});
    m += L.rect(40, 244, 640, 30, "#0c1825", ' rx="8" stroke="' + C.faint + '"');
    m += L.text(360, 264, "Prevention: avoid unknown/multiple partners · use condoms · early qualified doctor + complete treatment", {size: 11, color: "#7dd3fc"});
    L.svg(m, d.name + ": " + (d.curable ? "completely curable if detected early" : "not completely curable") + ".", 290);
    L.readout([
      ["Infection", d.name, d.curable ? C.ok : C.danger],
      ["Group", d.curable ? "curable if detected early" : "excepted from complete cure", d.curable ? C.ok : C.danger],
      ["Routes", d.routes],
      ["Prevention", "partner choice · condoms · qualified doctor"]
    ]);
    L.verdict("<b>" + d.name + ":</b> " + d.note + ". The three exceptions to complete cure are <b>hepatitis-B, genital herpes and HIV</b>; incidence peaks at <b>15–24 years</b>.");
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([
      ["gonorrhoea", "Gonorrhoea"], ["syphilis", "Syphilis"], ["chlamydiasis", "Chlamydiasis"],
      ["trichomoniasis", "Trichomoniasis"], ["herpes", "Genital herpes"], ["hepatitisb", "Hepatitis-B"], ["hiv", "HIV"]
    ], st.preset, select);
    L.legend([[C.ok, "curable if early"], [C.danger, "not completely curable"]]);
    draw();
  }

  window.SIMS.stis = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — ART matcher (NCERT §3.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var ART = {
    ivf: {
      name: "IVF–ET (test tube baby)",
      what: "Ova (wife/donor) and sperms (husband/donor) form the zygote outside the body under simulated conditions",
      dest: "zygote/embryo transferred to complete development in the female tract",
      rule: "IVF = fertilisation outside the body, followed by embryo transfer (ET)",
      verdict: "<b>IVF–ET:</b> fertilisation outside the body under conditions similar to the body's, then transfer of the zygote or early embryo. Popularly called the <b>'test tube baby' programme</b>. The transfer destination follows the blastomere rule: ZIFT or IUT."
    },
    zift: {
      name: "ZIFT (zygote intra fallopian transfer)",
      what: "Zygote or early embryo with up to 8 blastomeres is transferred",
      dest: "fallopian tube",
      rule: "≤ 8 blastomeres → fallopian tube",
      verdict: "<b>ZIFT:</b> a zygote or early embryo with <b>up to 8 blastomeres</b> is transferred into the <b>fallopian tube</b> for further development."
    },
    iut: {
      name: "IUT (intra uterine transfer)",
      what: "Embryo with more than 8 blastomeres is transferred",
      dest: "uterus",
      rule: "> 8 blastomeres → uterus",
      verdict: "<b>IUT:</b> embryos with <b>more than 8 blastomeres</b> are transferred into the <b>uterus</b> to complete further development. Embryos formed by in-vivo fertilisation can also be transferred this way."
    },
    gift: {
      name: "GIFT (gamete intra fallopian transfer)",
      what: "An ovum collected from a donor is transferred",
      dest: "fallopian tube of another female who cannot produce one but can support fertilisation",
      rule: "donor ovum → fallopian tube",
      verdict: "<b>GIFT:</b> transfer of a <b>donor ovum</b> into the <b>fallopian tube</b> of a female who cannot produce one but can provide a suitable environment for fertilisation and further development."
    },
    icsi: {
      name: "ICSI (intra cytoplasmic sperm injection)",
      what: "A sperm is directly injected into the ovum to form an embryo in the laboratory",
      dest: "laboratory embryo (then transferred)",
      rule: "one sperm → directly into the ovum",
      verdict: "<b>ICSI:</b> a specialised laboratory procedure in which a <b>sperm is directly injected into the ovum</b> to form an embryo."
    },
    ai: {
      name: "AI / IUI (artificial insemination)",
      what: "Semen from the husband or a healthy donor is artificially introduced",
      dest: "vagina or uterus (IUI = intra-uterine insemination)",
      rule: "used when the male cannot inseminate or sperm counts are very low",
      verdict: "<b>AI:</b> semen collected from the husband or a healthy donor is introduced into the <b>vagina</b> or into the <b>uterus (IUI)</b>; it corrects inability to inseminate or very low sperm counts."
    }
  };
  var st = {preset: "zift"};

  function draw(){
    var d = ART[st.preset];
    var m = "";
    m += L.rect(40, 80, 150, 90, "#0f1f2e", ' rx="12" stroke="#f9a8d4" stroke-width="2"');
    m += L.text(115, 112, "OVUM", {size: 14, weight: 700, color: "#f9a8d4"});
    m += L.text(115, 136, st.preset === "gift" ? "donor" : "wife/donor", {size: 11});
    m += L.rect(270, 80, 180, 90, "#0f1f2e", ' rx="12" stroke="#7dd3fc" stroke-width="2"');
    m += L.text(360, 112, st.preset === "ai" ? "SEMEN" : "SPERM", {size: 14, weight: 700, color: "#7dd3fc"});
    m += L.text(360, 136, st.preset === "ai" ? "husband/donor" : "husband/donor", {size: 11});
    m += L.rect(530, 80, 150, 90, "#0f1f2e", ' rx="12" stroke="#a3e635" stroke-width="2"');
    m += L.text(605, 112, st.preset === "ai" ? "VAGINA / UTERUS" : "LAB / EGG", {size: 12, weight: 700, color: "#a3e635"});
    m += L.text(605, 136, st.preset === "ai" ? "IUI" : "ICSI / IVF", {size: 11});
    if(st.preset === "gift") m += L.arrow(190, 125, 530, 125, "#f9a8d4", 3);
    else if(st.preset === "ai") m += L.arrow(450, 125, 530, 125, "#7dd3fc", 3);
    else {
      m += L.arrow(190, 105, 530, 105, "#f9a8d4", 3);
      m += L.arrow(450, 145, 530, 145, "#7dd3fc", 3);
    }
    m += L.text(360, 210, d.rule, {size: 15, weight: 700, color: "#a3e635"});
    m += L.text(360, 238, "destination: " + d.dest, {size: 12, color: C.text});
    m += L.text(360, 262, "precision handling, expensive instrumentation — available in very few centres", {size: 11, color: C.muted});
    L.svg(m, d.name + ": " + d.rule + ".", 290);
    L.readout([
      ["Technique", d.name, "#38bdf8"],
      ["What it does", d.what],
      ["Rule", d.rule],
      ["Destination", d.dest, C.ok]
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
    L.presets([
      ["ivf", "IVF–ET"], ["zift", "ZIFT"], ["iut", "IUT"],
      ["gift", "GIFT"], ["icsi", "ICSI"], ["ai", "AI / IUI"]
    ], st.preset, select);
    L.legend([["#f9a8d4", "ovum"], ["#7dd3fc", "sperm / semen"], ["#a3e635", "laboratory or destination"]]);
    draw();
  }

  window.SIMS.art = {mount: mount, draw: draw, select: select, state: st};
})();
