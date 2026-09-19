// Class 12 Biology, Chapter 2 (lebo102) — one tailored lab per lesson.
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
// Lab 1 — Male reproductive system (NCERT §2.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {view: "overview"};

  function bodyOutline(){
    var m = "";
    m += '<rect x="60" y="40" width="600" height="230" fill="#0d1a27" rx="18"/>';
    m += '<ellipse cx="360" cy="150" rx="120" ry="95" fill="#132132" stroke="#334155" stroke-width="2"/>';
    m += L.text(360, 66, "PAIR OF TESTES IN THE SCROTUM", {size: 14, color: "#93c5fd", weight: 700});
    return m;
  }

  function overview(){
    var m = bodyOutline();
    m += L.circle(320, 140, 20, "#f59e0b");
    m += L.circle(400, 140, 20, "#f59e0b");
    m += L.text(360, 195, "scrotum: 2\u20132.5 \u00b0C below body temperature", {size: 12, color: "#fbbf24"});
    m += L.rect(330, 86, 60, 16, "#a78bfa", ' rx="6"');
    m += L.text(360, 78, "bladder", {size: 11, color: "#c4b5fd"});
    m += path("M320 105 Q330 70 360 60 Q390 70 400 105", "#38bdf8", 3);
    m += L.text(360, 52, "vas deferens loops over the bladder", {size: 11, color: "#7dd3fc"});
    m += L.rect(348, 220, 24, 44, "#94a3b8", ' rx="10"');
    m += L.text(360, 288, "penis \u2192 urethral meatus", {size: 12, color: C.muted});
    m += L.text(610, 250, "pelvis region", {size: 12, color: C.muted, anchor: "start"});
    return m;
  }

  function testis(){
    var m = bodyOutline();
    m += '<ellipse cx="300" cy="150" rx="150" ry="104" fill="#0f2438" stroke="#f59e0b" stroke-width="3"/>';
    for(var i = 0; i < 7; i += 1){
      m += '<ellipse cx="' + (210 + i * 30) + '" cy="150" rx="14" ry="80" fill="none" stroke="#fbbf24" stroke-width="2" opacity=".85"/>';
    }
    m += L.text(300, 56, "seminiferous tubules: spermatogonia + Sertoli cells", {size: 12, color: "#fbbf24"});
    m += L.circle(560, 120, 16, "#38bdf8");
    m += L.text(560, 125, "L", {size: 12, color: "#082f49", weight: 700});
    m += L.text(560, 156, "Leydig cell (interstitial)", {size: 11, color: "#7dd3fc"});
    m += L.text(560, 176, "\u2192 androgens", {size: 11, color: "#7dd3fc"});
    m += L.text(80, 260, "~250 lobules per testis", {size: 12, color: C.muted, anchor: "start"});
    return m;
  }

  function ducts(){
    var m = bodyOutline();
    var pts = [["testis", 190, 190, "#f59e0b"], ["rete testis", 250, 140, "#34d399"], ["vasa efferentia", 320, 120, "#38bdf8"], ["epididymis", 390, 140, "#a78bfa"], ["vas deferens", 455, 120, "#f472b6"], ["ejaculatory duct", 520, 160, "#fbbf24"], ["urethra", 585, 200, "#e2e8f0"]];
    for(var i = 0; i < pts.length; i += 1){
      m += L.circle(pts[i][1], pts[i][2], 9, pts[i][3]);
      m += L.text(pts[i][1], pts[i][2] - 18, pts[i][0], {size: 11, color: pts[i][3]});
      if(i) m += L.arrow(pts[i - 1][1] + 14, pts[i - 1][2], pts[i][1] - 14, pts[i][2], "#475569", 2);
    }
    m += L.text(385, 260, "store and transport sperms to the outside", {size: 13, color: C.muted});
    return m;
  }

  function glands(){
    var m = bodyOutline();
    m += '<ellipse cx="280" cy="150" rx="52" ry="34" fill="#f59e0b" opacity=".9"/>';
    m += L.text(280, 155, "seminal", {size: 11, color: "#451a03", weight: 700});
    m += L.text(280, 170, "vesicles (paired)", {size: 10, color: "#451a03"});
    m += L.circle(400, 150, 32, "#34d399");
    m += L.text(400, 155, "prostate", {size: 11, color: "#052e16", weight: 700});
    m += L.circle(500, 150, 24, "#38bdf8");
    m += L.text(500, 155, "bulbo-", {size: 11, color: "#082f49", weight: 700});
    m += L.text(500, 170, "urethral", {size: 10, color: "#082f49"});
    m += L.text(360, 250, "secretions \u2192 seminal plasma: fructose, calcium and certain enzymes", {size: 13, color: C.text});
    return m;
  }

  function draw(){
    var v = st.view, m = "";
    if(v === "overview") m = overview();
    else if(v === "testis") m = testis();
    else if(v === "ducts") m = ducts();
    else m = glands();
    L.svg(m, "Male reproductive system view: " + v, 300);
    if(v === "overview"){
      L.readout([["Location", "pelvis region"], ["Gonads", "pair of testes in the scrotum"], ["Cooling", "2\u20132.5 \u00b0C below body", "#fbbf24"], ["Accessory organs", "ducts + glands + penis"]]);
      L.verdict("The male reproductive system sits in the <b>pelvis region</b>: a pair of <b>testes</b> in the <b>scrotum</b> (2\u20132.5 \u00b0C below internal body temperature, necessary for spermatogenesis), the accessory ducts and glands, and the external genitalia (penis).");
    } else if(v === "testis"){
      L.readout([["Lobules per testis", "~250"], ["Tubules per lobule", "1\u20133"], ["Inside lining", "spermatogonia + Sertoli"], ["Interstitial cells", "Leydig \u2192 androgens"]]);
      L.verdict("Each testis has about <b>250 lobules</b>, each with <b>one to three</b> coiled <b>seminiferous tubules</b>. Inside, germ cells (spermatogonia) undergo meiosis while <b>Sertoli cells provide nutrition</b>; interstitial <b>Leydig cells synthesise androgens</b>.");
    } else if(v === "ducts"){
      L.readout([["Order", "rete testis \u2192 vasa efferentia"], ["Then", "epididymis \u2192 vas deferens"], ["Join", "duct from seminal vesicle"], ["Open as", "ejaculatory duct \u2192 urethra"]]);
      L.verdict("The male sex accessory ducts run <b>rete testis \u2192 vasa efferentia \u2192 epididymis (posterior surface) \u2192 vas deferens (looping over the bladder) \u2192 ejaculatory duct \u2192 urethra</b>; they store and transport sperms to the outside through the urethral meatus.");
    } else {
      L.readout([["Glands", "seminal vesicles + prostate"], ["Plus", "paired bulbourethral glands"], ["Seminal plasma", "fructose, calcium, enzymes"], ["Bulbourethral", "lubricates the penis"]]);
      L.verdict("The accessory glands are the <b>paired seminal vesicles, a prostate and paired bulbourethral glands</b>. Their secretions form <b>seminal plasma</b>, rich in <b>fructose, calcium and certain enzymes</b>; seminal plasma plus sperms is <b>semen</b>.");
    }
  }

  function select(id){
    st.view = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["overview", "Overview"], ["testis", "Testis & tubule"], ["ducts", "Duct route"], ["glands", "Accessory glands"]], st.view, select);
    L.watch("Toggle the presets from overview to testis to ducts to glands and follow one sperm's route; note where Sertoli, Leydig and seminal plasma enter.");
    draw();
  }

  window.SIMS.malesystem = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Female reproductive system (NCERT §2.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {view: "overview"};

  function body(){
    var m = "";
    m += '<rect x="60" y="40" width="600" height="230" fill="#0d1a27" rx="18"/>';
    m += '<ellipse cx="360" cy="150" rx="140" ry="100" fill="#132132" stroke="#334155" stroke-width="2"/>';
    return m;
  }

  function overview(){
    var m = body();
    m += L.circle(230, 110, 17, "#f59e0b");
    m += L.circle(230, 190, 17, "#f59e0b");
    m += L.text(230, 66, "ovaries (2\u20134 cm)", {size: 12, color: "#fbbf24"});
    m += path("M250 110 Q330 80 420 110", "#38bdf8", 3);
    m += path("M250 190 Q330 220 420 190", "#38bdf8", 3);
    m += L.text(335, 66, "oviducts (10\u201312 cm)", {size: 12, color: "#7dd3fc"});
    m += '<ellipse cx="450" cy="150" rx="52" ry="70" fill="#a78bfa" opacity=".85"/>';
    m += L.text(450, 144, "uterus", {size: 13, color: "#2e1065", weight: 700});
    m += L.text(450, 164, "(inverted pear)", {size: 10, color: "#2e1065"});
    m += L.rect(440, 230, 20, 40, "#94a3b8", ' rx="8"');
    m += L.text(450, 288, "cervix \u2192 vagina : birth canal", {size: 12, color: C.muted});
    m += L.circle(560, 110, 22, "#f472b6");
    m += L.text(560, 146, "mammary glands", {size: 11, color: "#f9a8d4"});
    return m;
  }

  function tube(){
    var m = body();
    m += L.circle(230, 150, 17, "#f59e0b");
    m += L.text(230, 196, "ovary", {size: 12, color: "#fbbf24"});
    m += L.text(300, 92, "fimbriae", {size: 13, color: "#34d399"});
    m += L.text(370, 92, "infundibulum", {size: 13, color: "#38bdf8"});
    m += L.text(450, 92, "ampulla", {size: 13, color: "#a78bfa"});
    m += L.text(545, 92, "isthmus", {size: 13, color: "#f472b6"});
    m += path("M248 140 Q300 120 350 130 Q420 145 500 150 Q540 152 570 150", "#e2e8f0", 6);
    for(var i = 0; i < 5; i += 1){
      m += L.line(258 + i * 12, 138 - i * 2, 250 + i * 12, 118 - i * 2, "#34d399", 3);
    }
    m += L.arrow(480, 150, 560, 150, "#f472b6", 3);
    m += L.text(400, 236, "fimbriae collect the ovum after ovulation", {size: 13, color: C.muted});
    return m;
  }

  function uterus(){
    var m = body();
    m += '<ellipse cx="360" cy="150" rx="120" ry="90" fill="#1b2a3a" stroke="#a78bfa" stroke-width="3"/>';
    m += '<ellipse cx="360" cy="150" rx="96" ry="70" fill="#26384c" stroke="#38bdf8" stroke-width="2"/>';
    m += '<ellipse cx="360" cy="150" rx="72" ry="50" fill="#334155" stroke="#34d399" stroke-width="2"/>';
    m += L.text(360, 76, "perimetrium (thin outer)", {size: 12, color: "#94a3b8"});
    m += L.text(360, 110, "myometrium (smooth muscle)", {size: 12, color: "#7dd3fc"});
    m += L.text(360, 155, "endometrium (glandular lining)", {size: 12, color: "#6ee7b7"});
    m += L.text(360, 250, "cervical canal + vagina = birth canal", {size: 13, color: C.text, weight: 700});
    return m;
  }

  function mammary(){
    var m = body();
    var cx = 340, cy = 150;
    m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="150" ry="100" fill="#1b2a3a" stroke="#f472b6" stroke-width="3"/>';
    for(var i = 0; i < 8; i += 1){
      m += L.circle(cx - 90 + i * 26, 120 + (i % 3) * 30, 11, "#f472b6");
    }
    m += L.text(cx, 74, "15\u201320 mammary lobes of alveoli", {size: 12, color: "#f9a8d4"});
    m += path("M" + cx + " " + cy + " L" + (cx + 110) + " " + cy, "#e2e8f0", 4);
    m += L.text(cx + 130, cy - 16, "mammary tubules \u2192", {size: 12, color: C.text, anchor: "start"});
    m += L.text(cx + 130, cy + 8, "mammary duct \u2192 ampulla", {size: 12, color: C.text, anchor: "start"});
    m += L.text(cx + 130, cy + 32, "\u2192 lactiferous duct", {size: 12, color: "#f9a8d4", anchor: "start"});
    m += L.circle(cx + 118, cy, 9, "#f472b6");
    m += L.text(cx + 118, cy + 44, "nipple", {size: 12, color: C.muted});
    return m;
  }

  function draw(){
    var v = st.view, m = "";
    if(v === "overview") m = overview();
    else if(v === "tube") m = tube();
    else if(v === "uterus") m = uterus();
    else m = mammary();
    L.svg(m, "Female reproductive system view: " + v, 300);
    if(v === "overview"){
      L.readout([["Primary organs", "pair of ovaries (2\u20134 cm)"], ["Accessory ducts", "oviducts + uterus + vagina"], ["Birth canal", "cervical canal + vagina"], ["Integrated for", "ovulation \u2192 child care"]]);
      L.verdict("The female system has a <b>pair of ovaries</b> plus oviducts, uterus, cervix, vagina and external genitalia, and a pair of <b>mammary glands</b> \u2014 integrated to support ovulation, fertilisation, pregnancy, birth and child care.");
    } else if(v === "tube"){
      L.readout([["Ovary", "2\u20134 cm"], ["Tube length", "10\u201312 cm"], ["Funnel", "infundibulum + fimbriae"], ["Route", "ampulla \u2192 isthmus"], ["Fimbriae", "collect the ovum"]]);
      L.verdict("Each fallopian tube (about <b>10\u201312 cm</b>) ends near the ovary in a funnel-shaped <b>infundibulum</b> edged by finger-like <b>fimbriae</b> that collect the ovum; it widens into the <b>ampulla</b>, then narrows as the <b>isthmus</b> joining the uterus.");
    } else if(v === "uterus"){
      L.readout([["Uterus", "single, inverted pear"], ["Outer layer", "perimetrium"], ["Middle layer", "myometrium"], ["Inner layer", "endometrium"], ["Birth canal", "cervical canal + vagina"]]);
      L.verdict("The uterine wall has three layers: thin outer <b>perimetrium</b>, thick smooth-muscle <b>myometrium</b> (contracts strongly at delivery) and glandular <b>endometrium</b> lining the cavity, which cycles with menstruation. The <b>cervical canal with the vagina</b> forms the birth canal.");
    } else {
      L.readout([["Lobes per breast", "15\u201320"], ["Secretory units", "alveoli"], ["Path", "tubules \u2192 duct \u2192 ampulla"], ["Opens at", "lactiferous duct \u2192 nipple"]]);
      L.verdict("Each breast has <b>15\u201320 mammary lobes</b> of alveoli that secrete milk. Milk flows <b>alveoli \u2192 mammary tubules \u2192 mammary duct \u2192 mammary ampulla \u2192 lactiferous duct</b> to open at the nipple.");
    }
  }

  function select(id){
    st.view = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["overview", "Overview"], ["tube", "Oviduct route"], ["uterus", "Uterine wall"], ["mammary", "Mammary gland"]], st.view, select);
    L.watch("Walk the four presets: fimbriae collect the ovum, the three uterine layers separate, and the milk path ends at the nipple.");
    draw();
  }

  window.SIMS.femalesystem = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Gametogenesis: spermatogenesis vs oogenesis (NCERT §2.3)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {view: "sperm"};

  function flow(x, y, label, sub, color){
    var m = "";
    m += L.rect(x, y, 130, 52, "#132132", ' rx="10" stroke="' + color + '" stroke-width="2"');
    m += L.text(x + 65, y + 22, label, {size: 13, color: color, weight: 700});
    m += L.text(x + 65, y + 40, sub, {size: 11, color: C.muted});
    return m;
  }

  function sperm(){
    var m = "";
    var rows = [["spermatogonium", "46 (2n)", "#f59e0b"], ["primary spermatocyte", "46 (2n)", "#fbbf24"], ["2 secondary spermatocytes", "23 + 23", "#38bdf8"], ["4 spermatids", "23 each (n)", "#a78bfa"]];
    rows.forEach(function(r, i){
      m += flow(70, 40 + i * 62, r[0], r[1], r[2]);
      if(i < 3){
        m += L.arrow(205, 66 + i * 62, 250, 66 + i * 62, "#475569", 2);
        m += L.text(228, 56 + i * 62, i === 0 ? "mitosis" : "meiosis " + (i), {size: 10, color: C.muted});
      }
    });
    m += flow(500, 102, "spermiogenesis", "spermatids \u2192 sperm", "#34d399");
    m += flow(500, 164, "spermiation", "release from Sertoli", "#34d399");
    m += L.text(360, 288, "one spermatogonium \u2192 four functional sperms", {size: 14, color: C.text, weight: 700});
    return m;
  }

  function oogen(){
    var m = "";
    var rows = [["oogonia (foetus)", "2n, before birth", "#f59e0b"], ["primary oocyte", "arrested in prophase-I", "#fbbf24"], ["secondary oocyte", "n + first polar body", "#38bdf8"], ["ootid at fertilisation", "+ second polar body", "#a78bfa"]];
    rows.forEach(function(r, i){
      m += flow(70, 40 + i * 62, r[0], r[1], r[2]);
      if(i < 3) m += L.arrow(205, 66 + i * 62, 250, 66 + i * 62, "#475569", 2);
    });
    m += L.text(500, 80, "unequal meiosis I", {size: 12, color: "#7dd3fc"});
    m += L.text(500, 102, "keeps the cytoplasm in", {size: 12, color: C.muted});
    m += L.text(500, 124, "one secondary oocyte", {size: 12, color: C.muted});
    m += L.text(360, 288, "one primary oocyte \u2192 one functional ovum per meiosis", {size: 14, color: C.text, weight: 700});
    return m;
  }

  function follicle(){
    var m = "";
    var stages = [["primary follicle", "oocyte + granulosa", "#f59e0b"], ["secondary follicle", "+ theca layers", "#38bdf8"], ["tertiary follicle", "+ fluid antrum", "#a78bfa"], ["Graafian follicle", "pre-ovulation", "#34d399"]];
    stages.forEach(function(s, i){
      var x = 80 + i * 160;
      m += L.circle(x, 150, 52, "#132132", ' stroke="' + s[2] + '" stroke-width="3"');
      m += L.circle(x, 150, 22, s[2]);
      if(i === 2 || i === 3) m += L.circle(x + 30, 120, 10, "#0f2438");
      m += L.text(x, 66, s[0], {size: 12, color: s[2], weight: 700});
      m += L.text(x, 228, s[1], {size: 11, color: C.muted});
      if(i < 3) m += L.arrow(x + 60, 150, x + 96, 150, "#475569", 2);
    });
    m += L.text(360, 288, "primary \u2192 secondary \u2192 tertiary (antrum) \u2192 Graafian \u2192 ovulation", {size: 13, color: C.text});
    return m;
  }

  function hormones(){
    var m = "";
    m += flow(60, 40, "GnRH", "hypothalamus", "#f59e0b");
    m += flow(280, 40, "LH + FSH", "anterior pituitary", "#38bdf8");
    m += L.arrow(195, 66, 275, 66, "#475569", 2);
    m += flow(60, 160, "LH \u2192 Leydig cells", "\u2192 androgens", "#34d399");
    m += flow(280, 160, "FSH \u2192 Sertoli cells", "\u2192 spermiogenesis", "#a78bfa");
    m += L.arrow(125, 96, 125, 155, "#475569", 2);
    m += L.arrow(345, 96, 345, 155, "#475569", 2);
    m += L.text(360, 260, "spermatogenesis starts at puberty under this chain", {size: 13, color: C.muted});
    return m;
  }

  function draw(){
    var v = st.view, m = "";
    if(v === "sperm") m = sperm();
    else if(v === "oogen") m = oogen();
    else if(v === "follicle") m = follicle();
    else m = hormones();
    L.svg(m, "Gametogenesis view: " + v, 300);
    if(v === "sperm"){
      L.readout([["Start", "spermatogonium (46)"], ["Meiosis I", "2 secondary spermatocytes (23)"], ["Meiosis II", "4 spermatids (23)"], ["Then", "spermiogenesis + spermiation"]]);
      L.verdict("<b>Spermatogenesis:</b> each diploid spermatogonium (46) gives two secondary spermatocytes (23) by meiosis I and <b>four spermatids (23 each)</b> by meiosis II. Spermiogenesis transforms them into spermatozoa and <b>spermiation</b> releases them from the Sertoli cells.");
    } else if(v === "oogen"){
      L.readout([["Start", "oogonia in foetal ovary"], ["Arrest", "primary oocyte in prophase-I"], ["Meiosis I", "unequal: 1 secondary oocyte + polar body"], ["At fertilisation", "second polar body + ootid"]]);
      L.verdict("<b>Oogenesis</b> begins in embryonic life \u2014 a couple of million oogonia form per foetal ovary, no more are added after birth, and they arrest as <b>primary oocytes in prophase-I</b>. Meiosis I is <b>unequal</b>, giving one large secondary oocyte plus a tiny first polar body; the second polar body is extruded only at fertilisation.");
    } else if(v === "follicle"){
      L.readout([["At puberty", "60,000\u201380,000 primary follicles"], ["Sequence", "primary \u2192 secondary \u2192 tertiary"], ["Tertiary", "fluid antrum + theca"], ["Mature", "Graafian follicle \u2192 ovulation"]]);
      L.verdict("Most foetal follicles degenerate, leaving <b>60,000\u201380,000 primary follicles per ovary at puberty</b>. They mature <b>primary \u2192 secondary \u2192 tertiary</b> (fluid antrum, theca interna and externa) and become the mature <b>Graafian follicle</b> that ruptures at ovulation.");
    } else {
      L.readout([["Hypothalamus", "GnRH"], ["Pituitary", "LH + FSH"], ["LH acts on", "Leydig \u2192 androgens"], ["FSH acts on", "Sertoli \u2192 factors"]]);
      L.verdict("At puberty the hypothalamus raises <b>GnRH</b>, which makes the anterior pituitary release <b>LH and FSH</b>. <b>LH acts on Leydig cells</b> to make androgens that stimulate spermatogenesis, while <b>FSH acts on Sertoli cells</b> to secrete factors that aid spermiogenesis.");
    }
  }

  function select(id){
    st.view = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["sperm", "Spermatogenesis"], ["oogen", "Oogenesis"], ["follicle", "Follicle series"], ["hormones", "Hormone chain"]], st.view, select);
    L.watch("Compare the two division sequences: the readout counts cells and chromosomes \u2014 four \u00d7 23 in the male, one functional ovum plus polar bodies in the female.");
    draw();
  }

  window.SIMS.gametogenesis = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Menstrual cycle (NCERT §2.4)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {phase: "menstrual"};
  var PH = {
    menstrual: {span: [1, 5], color: "#f472b6", title: "MENSTRUAL PHASE (DAYS 1\u20135)", event: "endometrium breaks down", hormones: "cycle hormones low", verdict: "The cycle starts with the <b>menstrual phase</b> (3\u20135 days): the endometrial lining and its blood vessels <b>break down</b> and leave through the vagina. Menstruation happens only if the released ovum is not fertilised."},
    follicular: {span: [5, 13], color: "#38bdf8", title: "FOLLICULAR PHASE (DAYS 5\u201313)", event: "follicles grow; endometrium regenerates", hormones: "FSH + LH rise \u2192 estrogens", verdict: "In the <b>follicular phase</b> primary follicles grow into a mature <b>Graafian follicle</b> while the endometrium regenerates by proliferation, driven by pituitary and ovarian hormones; growing follicles secrete <b>estrogens</b>."},
    ovulation: {span: [13, 15], color: "#f59e0b", title: "OVULATION (~DAY 14)", event: "Graafian follicle ruptures", hormones: "LH surge", verdict: "Both FSH and LH peak mid-cycle; the rapid <b>LH surge</b> about <b>day 14</b> ruptures the Graafian follicle and releases the ovum \u2014 <b>ovulation</b>."},
    luteal: {span: [15, 28], color: "#a78bfa", title: "LUTEAL PHASE (DAYS 15\u201328)", event: "corpus luteum maintains the endometrium", hormones: "progesterone", verdict: "The ruptured follicle becomes the <b>corpus luteum</b>, which secretes large amounts of <b>progesterone</b> to maintain the endometrium for implantation. Without fertilisation it degenerates, the endometrium disintegrates, and menstruation starts a new cycle."}
  };

  function draw(){
    var p = PH[st.phase], m = "";
    m += L.text(360, 34, p.title, {size: 18, weight: 700, color: p.color});
    m += L.line(70, 170, 650, 170, "#475569", 3);
    for(var d = 0; d <= 28; d += 2){
      var x = 70 + d * (580 / 28);
      m += L.line(x, 164, x, 176, "#334155", 2);
      if(d % 4 === 0) m += L.text(x, 194, String(d), {size: 11, color: C.muted});
    }
    var x1 = 70 + p.span[0] * (580 / 28), x2 = 70 + p.span[1] * (580 / 28);
    m += L.rect(x1, 148, x2 - x1, 22, p.color, ' rx="8" opacity=".85"');
    m += L.text((x1 + x2) / 2, 138, p.event, {size: 12, color: C.text});
    m += L.text(360, 80, "28/29-day cycle \u00b7 day 1 = first bleeding day", {size: 13, color: C.muted});
    m += L.line(70, 224, 650, 224, "#334155", 1);
    m += path("M70 250 Q260 250 300 210 Q330 180 360 224 Q420 300 650 224", p.color, 3);
    m += L.text(80, 268, "FSH/LH", {size: 11, color: C.muted});
    m += L.text(400, 268, "hormone pattern (schematic)", {size: 11, color: C.muted});
    L.svg(m, "Menstrual cycle phase: " + st.phase, 300);
    L.readout([
      ["Phase", st.phase, p.color],
      ["Days", p.span[0] + "\u2013" + p.span[1], p.color],
      ["Event", p.event],
      ["Hormones", p.hormones]
    ]);
    L.verdict(p.verdict);
  }

  function select(id){
    st.phase = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["menstrual", "Menstrual 1\u20135"], ["follicular", "Follicular 5\u201313"], ["ovulation", "Ovulation ~14"], ["luteal", "Luteal 15\u201328"]], st.phase, select);
    L.watch("Step through the four phases of the 28-day clock; note the LH surge at mid-cycle and progesterone holding the luteal phase.");
    draw();
  }

  window.SIMS.menstrual = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Fertilisation and implantation (NCERT §2.5)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {view: "ampulla"};

  function tubeBase(){
    var m = "";
    m += path("M40 90 Q360 40 680 90", "#e2e8f0", 10);
    m += path("M40 230 Q360 280 680 230", "#e2e8f0", 10);
    m += L.text(360, 66, "fallopian tube", {size: 13, color: C.muted});
    return m;
  }

  function draw(){
    var v = st.view, m = "";
    if(v === "ampulla"){
      m = tubeBase();
      m += L.circle(300, 160, 34, "#f59e0b");
      m += L.text(300, 166, "ovum", {size: 12, color: "#111827", weight: 700});
      for(var i = 0; i < 5; i += 1){
        var x = 480 + Math.cos(i * 1.25) * 70, y = 160 + Math.sin(i * 1.25) * 46;
        m += '<ellipse cx="' + x + '" cy="' + y + '" rx="14" ry="7" fill="#38bdf8" transform="rotate(' + (i * 72) + ' ' + x + ' ' + y + ')"/>';
        m += L.arrow(x + (x > 480 ? -18 : 18), y, 350, 160, "#38bdf8", 2);
      }
      m += L.text(360, 286, "sperms swim to the ampullary region; fertilisation happens here", {size: 13, color: C.text});
    } else if(v === "zona"){
      m = tubeBase();
      m += L.circle(340, 160, 44, "#f59e0b");
      m += L.circle(340, 160, 34, "#fde68a");
      var blocked = [["#38bdf8", 240, 110], ["#ef4444", 250, 210], ["#ef4444", 430, 110], ["#ef4444", 440, 210]];
      blocked.forEach(function(b, i){
        m += '<ellipse cx="' + b[1] + '" cy="' + b[2] + '" rx="16" ry="8" fill="' + b[0] + '"/>';
        m += L.arrow(b[1], b[2], 296, 160, b[0], 2);
      });
      m += L.text(360, 286, "one sperm enters; contact changes the zona and blocks the others", {size: 13, color: C.text});
    } else if(v === "zygote"){
      m = tubeBase();
      m += L.circle(300, 160, 36, "#f59e0b");
      m += L.circle(330, 160, 36, "#38bdf8");
      m += L.text(315, 166, "2n", {size: 18, color: "#0f172a", weight: 700});
      m += L.circle(255, 160, 12, "#a78bfa");
      m += L.text(255, 164, "PB2", {size: 10, color: "#2e1065", weight: 700});
      m += L.text(360, 286, "sperm nucleus (23) + ootid nucleus (23) \u2192 zygote (46)", {size: 13, color: C.text});
    } else if(v === "cleavage"){
      m = tubeBase();
      var counts = [2, 4, 8, 16];
      counts.forEach(function(nn, i){
        var cx = 140 + i * 150;
        var col = i < 3 ? "#34d399" : "#a78bfa";
        for(var j = 0; j < Math.min(nn, 8); j += 1){
          m += L.circle(cx - 24 + (j % 4) * 16, 140 + Math.floor(j / 4) * 22 + (i === 3 ? 8 : 0), 9, col);
        }
        m += L.text(cx, 222, nn + " cells", {size: 12, color: col});
        if(i < 3) m += L.arrow(cx + 52, 160, cx + 96, 160, "#475569", 2);
      });
      m += L.text(360, 286, "zygote \u2192 2 \u2192 4 \u2192 8 \u2192 16 blastomeres = morula", {size: 13, color: C.text});
    } else {
      m = tubeBase();
      m += L.circle(300, 160, 58, "#a78bfa");
      m += L.circle(300, 160, 40, "#26384c");
      m += L.circle(290, 148, 18, "#34d399");
      m += L.text(290, 153, "ICM", {size: 10, color: "#052e16", weight: 700});
      m += L.text(300, 236, "blastocyst", {size: 13, color: "#c4b5fd"});
      m += L.text(470, 120, "trophoblast (outer)", {size: 12, color: "#f472b6", anchor: "start"});
      m += L.text(470, 146, "inner cell mass \u2192 embryo", {size: 12, color: "#6ee7b7", anchor: "start"});
      m += L.rect(480, 190, 160, 60, "#7f1d1d", ' rx="10" opacity=".7"');
      m += L.text(560, 225, "endometrium", {size: 12, color: "#fecaca"});
      m += L.arrow(360, 160, 470, 220, "#94a3b8", 3);
    }
    L.svg(m, "Fertilisation view: " + v, 300);
    if(v === "ampulla"){
      L.readout([["Site", "ampullary region of the fallopian tube"], ["Gametes", "sperm + ovum together"], ["Requirement", "both arrive simultaneously"], ["Result", "fertilisation possible"]]);
      L.verdict("Sperms swim through the cervix and uterus to the <b>ampullary region of the fallopian tube</b>, where the ovulated ovum is transported. <b>Fertilisation happens in the ampulla</b> \u2014 and only when both gametes arrive simultaneously, which is why not every copulation leads to pregnancy.");
    } else if(v === "zona"){
      L.readout([["First contact", "zona pellucida"], ["Effect", "blocks additional sperms"], ["Result", "one sperm fertilises"], ["Acrosome", "helps entry"]]);
      L.verdict("A sperm contacting the <b>zona pellucida</b> induces membrane changes that <b>block additional sperms</b>, so only one sperm fertilises the ovum; <b>acrosome secretions</b> help it enter through the zona and plasma membrane.");
    } else if(v === "zygote"){
      L.readout([["Sperm", "23 (n)"], ["Ootid", "23 (n)"], ["Zygote", "46 (2n)", "#f59e0b"], ["Second polar body", "extruded", "#a78bfa"]]);
      L.verdict("Sperm entry completes the <b>second meiotic division</b> of the secondary oocyte, giving the <b>second polar body</b> and the haploid ootid. The two haploid nuclei fuse into the diploid <b>zygote (23 + 23 = 46)</b>; an X- or Y-sperm makes it XX or XY.");
    } else if(v === "cleavage"){
      L.readout([["Division", "mitotic cleavage"], ["Cells", "2 \u2192 4 \u2192 8 \u2192 16"], ["At 8\u201316 cells", "morula"], ["Travel", "isthmus \u2192 uterus"]]);
      L.verdict("The zygote divides mitotically while moving through the isthmus toward the uterus: <b>2, 4, 8 and 16 blastomeres</b>. The <b>8- to 16-cell embryo is the morula</b>, which becomes the blastocyst in the uterus.");
    } else {
      L.readout([["Outer layer", "trophoblast"], ["Inner mass", "embryo proper"], ["Attachment", "endometrium"], ["Process", "implantation \u2192 pregnancy"]]);
      L.verdict("The morula becomes the <b>blastocyst</b>: outer <b>trophoblast</b> plus attached <b>inner cell mass</b>. The trophoblast attaches to the <b>endometrium</b>, uterine cells overgrow it, and it embeds \u2014 <b>implantation, leading to pregnancy</b>.");
    }
  }

  function select(id){
    st.view = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["ampulla", "Ampulla meeting"], ["zona", "Zona block"], ["zygote", "Zygote (46)"], ["cleavage", "Cleavage to morula"], ["implant", "Implantation"]], st.view, select);
    L.watch("Follow sperm to the ampulla, then the single-sperm block, the 46-chromosome zygote, and the cleavage count up to the 16-cell morula before the blastocyst embeds.");
    draw();
  }

  window.SIMS.fertilisation = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Pregnancy and embryonic development (NCERT §2.6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {view: "placenta"};

  function frame(){
    var m = "";
    m += '<rect x="60" y="40" width="600" height="230" fill="#0d1a27" rx="18"/>';
    return m;
  }

  function draw(){
    var v = st.view, m = frame();
    if(v === "placenta"){
      m += '<ellipse cx="250" cy="155" rx="120" ry="90" fill="#7f1d1d" opacity=".55"/>';
      for(var i = 0; i < 7; i += 1){
        m += L.line(190 + i * 18, 80, 190 + i * 18, 230, "#f87171", 3);
      }
      m += '<ellipse cx="250" cy="155" rx="70" ry="55" fill="#f472b6"/>';
      m += L.text(250, 150, "foetus", {size: 14, color: "#500724", weight: 700});
      m += L.text(250, 170, "umbilical cord", {size: 11, color: "#500724"});
      m += path("M310 155 Q400 120 470 155", "#fbbf24", 5);
      m += L.text(430, 90, "chorionic villi + uterine tissue", {size: 12, color: "#fca5a5"});
      m += L.text(430, 250, "exchange: O\u2082/nutrients in, CO\u2082/waste out", {size: 12, color: C.text});
    } else if(v === "hormones"){
      var rows = [["hCG", "pregnancy only", "#f59e0b"], ["hPL", "pregnancy only", "#38bdf8"], ["relaxin", "ovary, later phase", "#34d399"], ["estrogens + progestogens", "rise several-fold", "#a78bfa"]];
      rows.forEach(function(r, i){
        m += L.rect(120, 70 + i * 46, 480, 34, "#132132", ' rx="8" stroke="' + r[2] + '"');
        m += L.text(200, 92 + i * 46, r[0], {size: 14, color: r[2], weight: 700, anchor: "start"});
        m += L.text(560, 92 + i * 46, r[1], {size: 12, color: C.muted, anchor: "end"});
      });
      m += L.text(360, 268, "placenta is an endocrine organ too", {size: 13, color: C.text});
    } else if(v === "germ"){
      m += L.rect(110, 90, 500, 140, "#132132", ' rx="14" stroke="#a78bfa"');
      m += L.rect(130, 110, 460, 30, "#f59e0b", ' rx="6"');
      m += L.text(360, 131, "ectoderm (outer)", {size: 13, color: "#451a03", weight: 700});
      m += L.rect(130, 148, 460, 30, "#34d399", ' rx="6"');
      m += L.text(360, 169, "mesoderm (middle)", {size: 13, color: "#052e16", weight: 700});
      m += L.rect(130, 186, 460, 30, "#38bdf8", ' rx="6"');
      m += L.text(360, 207, "endoderm (inner)", {size: 13, color: "#082f49", weight: 700});
      m += L.text(360, 262, "inner cell mass: three layers + potent stem cells", {size: 13, color: C.text});
    } else {
      var ms = [["1 month", "heart formed", "#f59e0b", 100], ["2 months", "limbs + digits", "#fbbf24", 200], ["12 weeks", "major organ systems", "#38bdf8", 290], ["5 months", "first movements, head hair", "#a78bfa", 380], ["24 weeks", "eyelids, eyelashes, fine hair", "#34d399", 470], ["9 months", "fully developed, delivery-ready", "#f472b6", 560]];
      ms.forEach(function(r){
        m += L.circle(r[3], 150, 11, r[2]);
        m += L.text(r[3], 120, r[0], {size: 11, color: r[2]});
        m += L.text(r[3], 230, r[1], {size: 10, color: C.muted});
      });
      m += L.line(100, 150, 560, 150, "#475569", 2);
      m += L.text(360, 272, "heart first, then limbs, systems, movement, eyelashes, birth", {size: 12, color: C.text});
    }
    L.svg(m, "Pregnancy view: " + v, 300);
    if(v === "placenta"){
      L.readout([["Structure", "chorionic villi + uterine tissue"], ["Links to embryo", "umbilical cord"], ["Supplies", "oxygen and nutrients"], ["Removes", "CO\u2082 and waste"]]);
      L.verdict("After implantation, <b>chorionic villi</b> grow on the trophoblast and interdigitate with uterine tissue and maternal blood to form the <b>placenta</b>, the structural and functional unit between foetus and mother. It supplies <b>oxygen and nutrients</b>, removes <b>CO\u2082 and waste</b>, and connects to the embryo by the <b>umbilical cord</b>.");
    } else if(v === "hormones"){
      L.readout([["Pregnancy only", "hCG + hPL + relaxin", "#34d399"], ["Placenta makes", "hCG, hPL, estrogens, progestogens"], ["Ovary adds", "relaxin (later phase)"], ["Rising", "cortisol, prolactin, thyroxine"]]);
      L.verdict("The placenta secretes <b>hCG, hPL, estrogens and progestogens</b>, and the ovary adds <b>relaxin</b> later. <b>hCG, hPL and relaxin are produced in women only during pregnancy</b>; estrogens, progestogens, cortisol, prolactin and thyroxine rise several-fold to support fetal growth and maintain pregnancy.");
    } else if(v === "germ"){
      L.readout([["Outer layer", "ectoderm"], ["Middle layer", "mesoderm"], ["Inner layer", "endoderm"], ["Stem cells", "all tissues and organs"]]);
      L.verdict("After implantation the inner cell mass differentiates into outer <b>ectoderm</b> and inner <b>endoderm</b>, with <b>mesoderm</b> appearing between them. These <b>three germ layers give all adult tissues and organs</b>, and the inner mass holds stem cells with full potency.");
    } else {
      L.readout([["1 month", "heart formed"], ["2 months", "limbs and digits"], ["12 weeks", "major organ systems"], ["5 months", "movements + head hair"], ["24 weeks", "eyelids, eyelashes, fine hair"], ["9 months", "delivery-ready"]]);
      L.verdict("Human pregnancy lasts <b>9 months</b>: the <b>heart</b> forms in the first month, limbs and digits by the second, major organ systems by <b>12 weeks</b>, first movements and head hair in the fifth month, fine hair with separated <b>eyelids and eyelashes by about 24 weeks</b>, and a fully developed foetus by nine months.");
    }
  }

  function select(id){
    st.view = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["placenta", "Placenta & cord"], ["hormones", "Pregnancy hormones"], ["germ", "Germ layers"], ["clock", "Milestone clock"]], st.view, select);
    L.watch("Run the four panels: the placenta exchanges and signals, three germ layers build the body, and the clock orders heart, digits, systems, movement and eyelashes.");
    draw();
  }

  window.SIMS.pregnancy = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Parturition and lactation (NCERT §2.7)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {view: "reflex"};

  function box(x, y, w, label, color){
    return L.rect(x, y, w || 150, 52, "#132132", ' rx="10" stroke="' + color + '" stroke-width="2"') +
      L.text(x + (w || 150) / 2, y + 31, label, {size: 13, color: color, weight: 700});
  }

  function draw(){
    var v = st.view, m = "";
    if(v === "reflex"){
      m += box(60, 60, 190, "fully developed foetus", "#f59e0b");
      m += box(280, 60, 190, "+ placenta signals", "#fbbf24");
      m += box(500, 60, 160, "mild contractions", "#38bdf8");
      m += L.arrow(255, 86, 275, 86, "#475569", 2);
      m += L.arrow(475, 86, 495, 86, "#475569", 2);
      m += L.text(360, 160, "foetal ejection reflex", {size: 18, color: "#93c5fd", weight: 700});
      m += L.text(360, 200, "signals for parturition originate from the", {size: 13, color: C.muted});
      m += L.text(360, 222, "fully developed foetus and the placenta", {size: 13, color: C.muted});
      m += L.text(360, 268, "average gestation \u2248 9 months", {size: 13, color: C.text});
    } else if(v === "oxytocin"){
      m += box(80, 90, 170, "maternal pituitary", "#34d399");
      m += box(330, 90, 130, "oxytocin", "#f472b6");
      m += box(540, 90, 130, "stronger contractions", "#f59e0b");
      m += L.arrow(255, 116, 325, 116, "#475569", 2);
      m += L.arrow(465, 116, 535, 116, "#475569", 2);
      m += path("M605 142 Q605 210 360 210 Q180 210 180 148", "#f472b6", 3);
      m += L.arrow(180, 155, 200, 130, "#f472b6", 2);
      m += L.text(392, 232, "positive reflex: contraction \u2192 more oxytocin", {size: 13, color: "#f9a8d4"});
      m += L.text(360, 272, "keeps strengthening until delivery", {size: 13, color: C.text});
    } else if(v === "birth"){
      m += box(80, 80, 170, "birth canal", "#38bdf8");
      m += box(330, 80, 150, "baby expelled", "#34d399");
      m += box(560, 80, 130, "placenta out", "#a78bfa");
      m += L.arrow(255, 106, 325, 106, "#475569", 2);
      m += L.arrow(485, 106, 555, 106, "#475569", 2);
      m += L.text(360, 190, "soon after the baby, the placenta is expelled", {size: 14, color: C.text});
      m += L.text(360, 230, "summary names cortisol + estrogens + oxytocin", {size: 13, color: C.muted});
      m += L.text(360, 272, "doctors may inject oxytocin to induce delivery", {size: 13, color: "#7dd3fc"});
    } else {
      m += '<ellipse cx="300" cy="160" rx="120" ry="86" fill="#1b2a3a" stroke="#f472b6" stroke-width="3"/>';
      for(var i = 0; i < 8; i += 1){
        m += L.circle(230 + (i % 4) * 48, 120 + Math.floor(i / 4) * 56, 16, "#f472b6");
      }
      m += L.text(300, 60, "mammary alveoli: colostrum first", {size: 13, color: "#f9a8d4"});
      m += L.text(540, 120, "several antibodies", {size: 13, color: "#34d399"});
      m += L.text(540, 146, "essential for newborn", {size: 12, color: C.muted});
      m += L.text(540, 168, "resistance", {size: 12, color: C.muted});
      m += L.text(300, 274, "mammary glands differentiate in pregnancy; lactation follows birth", {size: 12, color: C.text});
    }
    L.svg(m, "Parturition view: " + v, 300);
    if(v === "reflex"){
      L.readout([["Signal source", "fully developed foetus + placenta"], ["First event", "mild uterine contractions"], ["Name", "foetal ejection reflex"], ["Then", "maternal oxytocin"]]);
      L.verdict("Parturition is induced by a complex neuroendocrine mechanism: signals from the <b>fully developed foetus and the placenta</b> induce mild uterine contractions called the <b>foetal ejection reflex</b>. Average human gestation is about <b>9 months</b>.");
    } else if(v === "oxytocin"){
      L.readout([["Reflex", "foetal ejection \u2192 oxytocin"], ["Source", "maternal pituitary"], ["Action", "stronger contractions"], ["Loop", "positive feedback"]]);
      L.verdict("The reflex triggers <b>oxytocin release from the maternal pituitary</b>. Oxytocin acts on uterine muscle causing <b>stronger contractions</b>, which stimulate further oxytocin secretion \u2014 a stimulatory <b>positive reflex</b> that keeps strengthening until the baby is expelled.");
    } else if(v === "birth"){
      L.readout([["Delivery", "through the birth canal"], ["After birth", "placenta is expelled"], ["Trigger (summary)", "cortisol + estrogens + oxytocin"], ["Induction question", "oxytocin"]]);
      L.verdict("Contractions keep strengthening until the baby is expelled through the <b>birth canal</b>; soon after, the <b>placenta is also expelled</b>. The summary names <b>cortisol, estrogens and oxytocin</b> in the trigger, and the chapter asks what doctors inject to induce delivery \u2014 the oxytocin link.");
    } else {
      L.readout([["Mammary glands", "differentiate in pregnancy"], ["First milk", "colostrum"], ["Contains", "several antibodies"], ["Advice", "breast-feed initially"]]);
      L.verdict("The mammary glands differentiate during pregnancy and secrete <b>colostrum</b> in the first days after birth. Colostrum contains <b>several antibodies absolutely essential for newborn resistance</b>, and doctors recommend <b>breast-feeding in the initial period</b>.");
    }
  }

  function select(id){
    st.view = id;
    L.markPreset(id);
    draw();
  }

  function mount(){
    labNoTimeline();
    L.presets([["reflex", "Foetal ejection reflex"], ["oxytocin", "Oxytocin feedback"], ["birth", "Birth + placenta"], ["colostrum", "Lactation"]], st.view, select);
    L.watch("Trigger the reflex and follow oxytocin's positive feedback to birth; the lactation preset shows colostrum's antibodies.");
    draw();
  }

  window.SIMS.parturition = {mount: mount, draw: draw, select: select, state: st};
})();
