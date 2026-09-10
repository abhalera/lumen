var App = window.App;
window.SIMS = {};

function setActivePreset(btn){
  document.querySelectorAll(".preset-btn").forEach(function(b){ b.classList.remove("active"); });
  if(btn) btn.classList.add("active");
}
function svgEl(){ return document.getElementById("diagram"); }
function readout(html){ var n = document.getElementById("lab-readout"); if(n) n.innerHTML = html; }
function verdict(html){ var n = document.getElementById("lab-verdict"); if(n) n.innerHTML = html; }
function cell(label, val, color){
  return '<div class="telemetry-cell"><div class="telemetry-label">' + label + '</div><div class="telemetry-val"' +
    (color ? ' style="color:' + color + '"' : '') + '>' + val + '</div></div>';
}
function numEl(id, fallback){
  var n = document.getElementById(id);
  return n ? Number(n.value) : fallback;
}

window.SIMS["male-reproductive-system"] = (function(){
  var focus = "duct";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Testis / sperm path</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Accessory glands</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Support cells</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-duct">Ex 2: duct order</button>' +
      '<button class="preset-btn" id="p-tub">Ex 5: seminiferous tubule</button>' +
      '<button class="preset-btn" id="p-gland">Ex 10-11: glands + semen</button>';
    document.getElementById("p-duct").onclick = function(){ setActivePreset(this); focus="duct"; draw(App.state.t); };
    document.getElementById("p-tub").onclick = function(){ setActivePreset(this); focus="tubule"; draw(App.state.t); };
    document.getElementById("p-gland").onclick = function(){ setActivePreset(this); focus="gland"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Sperm transit (t flow)</span><span class="val" id="ctrl-fl">flow</span></div>' +
      '<input type="range" id="ctrl-fl-range" min="0" max="100" step="1" value="50"></div>';
    document.getElementById("ctrl-fl-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var fl = numEl("ctrl-fl-range", 50);
    var el = document.getElementById("ctrl-fl"); if(el) el.textContent = fl.toFixed(0);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 2.1a-b style: male pelvis + opened testis (Sec 2.1)</text>';
    m += '<ellipse cx="150" cy="170" rx="52" ry="66" fill="#0f1f2e" stroke="' + (focus==="tubule" ? "#34d399" : "#f59e0b") + '" stroke-width="2"/>';
    m += '<text x="150" y="100" fill="#f59e0b" font-size="11" text-anchor="middle">testis 4-5 x 2-3 cm</text>';
    for(var l=0;l<3;l++){
      var ly = 135 + l*32;
      m += '<path d="M 115 ' + ly + ' Q 150 ' + (ly+14) + ' 185 ' + ly + '" fill="none" stroke="#f59e0b" stroke-width="3"/>';
    }
    m += '<text x="150" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">~250 lobules x 1-3 tubules</text>';
    m += '<ellipse cx="150" cy="252" rx="66" ry="16" fill="none" stroke="#38bdf8" stroke-dasharray="5 3"/>';
    m += '<text x="150" y="282" fill="#38bdf8" font-size="11" text-anchor="middle">scrotum: 2-2.5 C below body</text>';
    var stops = [225, 300, 375, 450, 520, 590];
    var names = ["rete", "vasa eff.", "epididymis", "vas def.", "ejac. duct", "urethra"];
    for(var i=0;i<stops.length;i++){
      var hot = focus === "duct";
      m += '<rect x="' + (stops[i]-30) + '" y="140" width="60" height="40" rx="6" fill="' + (hot ? "#1d3350" : "#0f1f2e") + '" stroke="' + (hot ? "#f59e0b" : "#334155") + '"/>';
      m += '<text x="' + stops[i] + '" y="156" fill="#e2e8f0" font-size="9" text-anchor="middle">' + names[i] + '</text>';
      m += '<text x="' + stops[i] + '" y="170" fill="#94a3b8" font-size="9" text-anchor="middle">' + (i+1) + '/6</text>';
      if(i < stops.length-1){ m += '<line x1="' + (stops[i]+30) + '" y1="160" x2="' + (stops[i+1]-30) + '" y2="160" stroke="#f59e0b" stroke-width="2"/>'; }
    }
    var dot = (t*80 + fl*2) % 400;
    m += '<circle cx="' + (200 + dot) + '" cy="132" r="5" fill="#fde68a"/>';
    m += '<text x="410" y="210" fill="#94a3b8" font-size="11" text-anchor="middle">vas deferens loops over bladder; seminal-vesicle duct joins</text>';
    m += '<rect x="225" y="222" width="300" height="52" rx="6" fill="#0f1f2e" stroke="' + (focus==="gland" ? "#38bdf8" : "#334155") + '"/>';
    m += '<text x="375" y="240" fill="#38bdf8" font-size="11" text-anchor="middle">seminal vesicles (pair) + prostate + bulbourethral (pair)</text>';
    m += '<text x="375" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">seminal plasma: fructose + calcium + enzymes; semen = plasma + sperms</text>';
    if(focus === "tubule"){
      m += '<rect x="545" y="60" width="160" height="150" rx="6" fill="#0f1f2e" stroke="#34d399"/>';
      m += '<text x="625" y="78" fill="#34d399" font-size="11" text-anchor="middle">Fig. 2.2 tubule</text>';
      m += '<circle cx="585" cy="120" r="10" fill="#f59e0b"/><circle cx="625" cy="120" r="10" fill="#34d399"/>';
      m += '<text x="625" y="145" fill="#94a3b8" font-size="10" text-anchor="middle">spermatogonia + Sertoli</text>';
      m += '<text x="625" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">Leydig (outside): androgens</text>';
      m += '<text x="625" y="178" fill="#94a3b8" font-size="10" text-anchor="middle">Sertoli: nutrition</text>';
      m += '<text x="625" y="194" fill="#94a3b8" font-size="10" text-anchor="middle">penis: erectile tissue;</text>';
      m += '<text x="625" y="206" fill="#94a3b8" font-size="10" text-anchor="middle">glans + foreskin; meatus</text>';
    }
    svg.innerHTML = m;
    readout(cell("cooling", "2-2.5 C", "#38bdf8") + cell("lobules", "~250", "#f59e0b") + cell("testis", "4-5 x 2-3 cm") + cell("plasma", "fructose/Ca/enzymes", "#34d399"));
    if(focus === "tubule") verdict("<b>Exercise 5, Fig. 2.2, Ex 16:</b> tubule lined by spermatogonia (meiotic) + Sertoli (nutrition, embedding); interstitial Leydig makes <b>androgens</b> — not Sertoli. Sertoli feeds; Leydig drives.");
    else if(focus === "gland") verdict("<b>Exercises 10-11, Sec 2.1:</b> ducts store + transport; gland secretions mature sperms and add <b>fructose, calcium, enzymes</b> (bulbourethral also lubricates). Plasma + sperms = <b>semen</b>, maintained by androgens.");
    else verdict("<b>Exercise 2, Sec 2.1:</b> seminiferous tubules -&gt; <b>rete testis -&gt; vasa efferentia -&gt; epididymis</b> (posterior surface) -&gt; <b>vas deferens</b> (over bladder) -&gt; <b>ejaculatory duct</b> -&gt; <b>urethra</b> -&gt; meatus. Scrotum holds <b>2-2.5 C</b> cooling for spermatogenesis.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["female-reproductive-system"] = (function(){
  var focus = "oviduct";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Ovary / ovum path</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Uterus layers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Milk path</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ovi">Oviduct map</button>' +
      '<button class="preset-btn" id="p-ute">Ex 15: uterus + birth canal</button>' +
      '<button class="preset-btn" id="p-mam">Mammary gland</button>' +
      '<button class="preset-btn" id="p-ext">Ex 16(g): hymen rule</button>';
    document.getElementById("p-ovi").onclick = function(){ setActivePreset(this); focus="oviduct"; draw(App.state.t); };
    document.getElementById("p-ute").onclick = function(){ setActivePreset(this); focus="uterus"; draw(App.state.t); };
    document.getElementById("p-mam").onclick = function(){ setActivePreset(this); focus="mammary"; draw(App.state.t); };
    document.getElementById("p-ext").onclick = function(){ setActivePreset(this); focus="ext"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Ovum transit</span><span class="val" id="ctrl-ov">mid</span></div>' +
      '<input type="range" id="ctrl-ov-range" min="0" max="100" step="1" value="40"></div>';
    document.getElementById("ctrl-ov-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var pr = numEl("ctrl-ov-range", 40);
    var el = document.getElementById("ctrl-ov"); if(el) el.textContent = pr.toFixed(0);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 2.3a-b style: ovaries, tubes, uterus, birth canal (Sec 2.2)</text>';
    m += '<ellipse cx="120" cy="130" rx="34" ry="44" fill="#0f1f2e" stroke="#f472b6" stroke-width="2"/>';
    m += '<text x="120" y="136" fill="#f472b6" font-size="10" text-anchor="middle">ovary</text>';
    m += '<text x="120" y="190" fill="#94a3b8" font-size="10" text-anchor="middle">2-4 cm; ligaments</text>';
    m += '<text x="120" y="204" fill="#94a3b8" font-size="10" text-anchor="middle">cortex + medulla</text>';
    var segs = ["infundibulum", "ampulla", "isthmus"];
    var sub = ["fimbriae collect", "wider", "narrow to uterus"];
    for(var i=0;i<3;i++){
      var x = 210 + i*90;
      var hot = focus === "oviduct";
      m += '<rect x="' + (x-42) + '" y="105" width="84" height="52" rx="6" fill="' + (hot ? "#1d3350" : "#0f1f2e") + '" stroke="' + (hot ? "#f472b6" : "#334155") + '"/>';
      m += '<text x="' + x + '" y="124" fill="#e2e8f0" font-size="9" text-anchor="middle">' + segs[i] + '</text>';
      m += '<text x="' + x + '" y="140" fill="#94a3b8" font-size="9" text-anchor="middle">' + sub[i] + '</text>';
      if(i<2){ m += '<line x1="' + (x+42) + '" y1="131" x2="' + (x+48) + '" y2="131" stroke="#f472b6" stroke-width="2"/>'; }
    }
    if(focus === "oviduct"){
      for(var f=0;f<4;f++){ m += '<line x1="168" y1="' + (105+f*12) + '" x2="150" y2="' + (100+f*12) + '" stroke="#f472b6" stroke-width="2"/>'; }
    }
    var ox = 165 + pr*3.1;
    m += '<circle cx="' + ox + '" cy="90" r="7" fill="#fde68a" stroke="#f59e0b"/>';
    m += '<text x="310" y="90" fill="#94a3b8" font-size="10">ovum -&gt; uterus (tube 10-12 cm)</text>';
    m += '<path d="M 480 100 L 480 200 L 620 200 L 620 100 Z" fill="#0f1f2e" stroke="' + (focus==="uterus" ? "#38bdf8" : "#334155") + '" stroke-width="2"/>';
    m += '<text x="550" y="92" fill="#38bdf8" font-size="11" text-anchor="middle">uterus (inverted pear)</text>';
    m += '<rect x="490" y="110" width="120" height="20" fill="#1d3350" stroke="#38bdf8"/>';
    m += '<text x="550" y="124" fill="#94a3b8" font-size="10" text-anchor="middle">perimetrium (outer thin)</text>';
    m += '<rect x="490" y="132" width="120" height="30" fill="#164e63" stroke="#38bdf8"/>';
    m += '<text x="550" y="151" fill="#e2e8f0" font-size="10" text-anchor="middle">myometrium (contracts)</text>';
    m += '<rect x="490" y="164" width="120" height="26" fill="#3b2f2f" stroke="#38bdf8"/>';
    m += '<text x="550" y="181" fill="#e2e8f0" font-size="10" text-anchor="middle">endometrium (cycles)</text>';
    m += '<rect x="530" y="200" width="40" height="40" fill="#0f1f2e" stroke="#94a3b8"/>';
    m += '<text x="550" y="256" fill="#94a3b8" font-size="10" text-anchor="middle">cervix + vagina = birth canal</text>';
    if(focus === "mammary"){
      m += '<rect x="60" y="212" width="330" height="70" rx="6" fill="#0f1f2e" stroke="#f59e0b"/>';
      m += '<text x="225" y="230" fill="#f59e0b" font-size="11" text-anchor="middle">15-20 lobes: alveoli -&gt; tubules -&gt; duct -&gt; ampulla -&gt; lactiferous duct</text>';
      m += '<text x="225" y="248" fill="#94a3b8" font-size="10" text-anchor="middle">milk stored in alveolar lumens; opens at nipple (Fig. 2.4)</text>';
      m += '<text x="225" y="264" fill="#94a3b8" font-size="10" text-anchor="middle">mons, labia majora/minora, hymen, clitoris (external)</text>';
    } else if(focus === "ext"){
      m += '<rect x="60" y="212" width="330" height="70" rx="6" fill="#0f1f2e" stroke="#f87171"/>';
      m += '<text x="225" y="234" fill="#f87171" font-size="11" text-anchor="middle">hymen often torn at first coitus but also by</text>';
      m += '<text x="225" y="250" fill="#e2e8f0" font-size="11" text-anchor="middle">fall, jolt, tampon, riding, cycling; may persist</text>';
      m += '<text x="225" y="266" fill="#f87171" font-size="11" text-anchor="middle">NOT a reliable sign of virginity (Sec 2.2, Ex 16g)</text>';
    } else {
      m += '<text x="225" y="240" fill="#94a3b8" font-size="11" text-anchor="middle">ovary: ovum + steroid hormones</text>';
      m += '<text x="225" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">mons, labia, hymen, clitoris; 15-20 mammary lobes</text>';
    }
    svg.innerHTML = m;
    readout(cell("ovary", "2-4 cm", "#f472b6") + cell("tube", "10-12 cm") + cell("lobes", "15-20", "#f59e0b") + cell("wall", "peri/myo/endo", "#38bdf8"));
    if(focus === "uterus") verdict("<b>Exercise 15, Sec 2.2:</b> wall = outer <b>perimetrium</b> + middle <b>myometrium</b> (strong delivery contractions) + inner <b>endometrium</b> (cycles). <b>Cervical canal + vagina = birth canal</b>.");
    else if(focus === "mammary") verdict("<b>Section 2.2, Fig. 2.4:</b> each breast has <b>15-20 lobes</b> of alveoli; milk path <b>alveoli -&gt; tubules -&gt; duct -&gt; ampulla -&gt; lactiferous duct -&gt; nipple</b>. Ovaries make the ovum + steroid hormones.");
    else if(focus === "ext") verdict("<b>Exercise 16(g), Sec 2.2:</b> hymen breaks by sport, tampons or riding and may persist after coitus — presence or absence is <b>not a reliable indicator of virginity or sexual experience</b>.");
    else verdict("<b>Section 2.2, Fig. 2.3b:</b> ovum path <b>fimbriae of infundibulum -&gt; ampulla -&gt; isthmus -&gt; uterus</b>. Fimbriae collect the ovum; each tube is <b>10-12 cm</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["gametogenesis"] = (function(){
  var side = "male";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Diploid (46)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Haploid (23)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Hormone / support</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-male">Spermatogenesis 46-&gt;23</button>' +
      '<button class="preset-btn" id="p-fem">Oogenesis + polar body</button>' +
      '<button class="preset-btn" id="p-hor">Hormones + semen counts</button>';
    document.getElementById("p-male").onclick = function(){ setActivePreset(this); side="male"; var r=document.getElementById("ctrl-g-range"); if(r) r.value=4; draw(App.state.t); };
    document.getElementById("p-fem").onclick = function(){ setActivePreset(this); side="female"; var r=document.getElementById("ctrl-g-range"); if(r) r.value=4; draw(App.state.t); };
    document.getElementById("p-hor").onclick = function(){ setActivePreset(this); side="hormone"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Division step</span><span class="val" id="ctrl-g">4</span></div>' +
      '<input type="range" id="ctrl-g-range" min="0" max="5" step="1" value="4"></div>';
    document.getElementById("ctrl-g-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = Math.round(numEl("ctrl-g-range", 4));
    var e1 = document.getElementById("ctrl-g"); if(e1) e1.textContent = st;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 2.5-2.8 style: one spermatogonium gives 4; one oocyte gives 1 (Sec 2.3)</text>';
    if(side === "hormone"){
      m += '<rect x="60" y="50" width="600" height="200" rx="8" fill="#0f1f2e" stroke="#34d399"/>';
      m += '<text x="360" y="74" fill="#34d399" font-size="13" text-anchor="middle">puberty: GnRH (hypothalamus) -&gt; LH + FSH (anterior pituitary)</text>';
      m += '<text x="150" y="110" fill="#e2e8f0" font-size="12">LH -&gt; Leydig -&gt; androgens</text>';
      m += '<text x="150" y="132" fill="#94a3b8" font-size="11">stimulate spermatogenesis</text>';
      m += '<text x="450" y="110" fill="#e2e8f0" font-size="12">FSH -&gt; Sertoli -&gt; factors</text>';
      m += '<text x="450" y="132" fill="#94a3b8" font-size="11">aid spermiogenesis</text>';
      m += '<text x="360" y="168" fill="#f59e0b" font-size="12" text-anchor="middle">sperm: head (nucleus + acrosome) + neck + middle (mitochondria) + tail</text>';
      m += '<text x="360" y="192" fill="#e2e8f0" font-size="12" text-anchor="middle">200-300 million per coitus; 60%+ normal form; 40%+ vigorous motility</text>';
      m += '<text x="360" y="214" fill="#94a3b8" font-size="11" text-anchor="middle">spermiogenesis = build sperm; spermiation = release from Sertoli (Ex 8)</text>';
      m += '<text x="360" y="234" fill="#94a3b8" font-size="11" text-anchor="middle">semen = sperms + seminal plasma; kept by androgens</text>';
    } else if(side === "male"){
      var labels = ["spermatogonia (46)", "primary spermatocyte (46)", "2 secondary (23+23)", "4 spermatids (23)", "spermiogenesis", "spermiation"];
      var xs = [90, 200, 320, 450, 560, 640];
      for(var i=0;i<6;i++){
        var done = i <= st;
        m += '<circle cx="' + xs[i] + '" cy="130" r="' + (i===2||i===3 ? 22 : 26) + '" fill="' + (i<2 ? "#38bdf8" : "#f59e0b") + '" opacity="' + (done?1:0.25) + '"/>';
        m += '<text x="' + xs[i] + '" y="180" fill="#94a3b8" font-size="9" text-anchor="middle">' + labels[i] + '</text>';
        if(i<5){ m += '<line x1="' + (xs[i]+26) + '" y1="130" x2="' + (xs[i+1]-26) + '" y2="130" stroke="#475569"/>'; }
      }
      m += '<text x="360" y="220" fill="#e2e8f0" font-size="12" text-anchor="middle">meiosis I = reduction; meiosis II = 4 equal haploid spermatids (Fig. 2.5)</text>';
      m += '<text x="360" y="242" fill="#94a3b8" font-size="11" text-anchor="middle">mitotic spermatogonia multiply first; Sertoli nursing throughout</text>';
      m += '<text x="360" y="262" fill="#34d399" font-size="11" text-anchor="middle">step ' + st + ': ' + labels[Math.min(5,st)] + '</text>';
    } else {
      var fl2 = ["oogonia (foetal, millions)", "primary oocyte arrested", "60-80k at puberty", "tertiary + antrum", "meiosis I unequal", "Graafian + ovulation"];
      var xs2 = [80, 190, 300, 410, 520, 620];
      for(var j=0;j<6;j++){
        var done2 = j <= st;
        m += '<rect x="' + (xs2[j]-38) + '" y="100" width="76" height="60" rx="8" fill="' + (j<3 ? "#38bdf8" : "#f59e0b") + '" opacity="' + (done2?0.95:0.25) + '"/>';
        m += '<text x="' + xs2[j] + '" y="180" fill="#94a3b8" font-size="9" text-anchor="middle">' + fl2[j] + '</text>';
      }
      m += '<circle cx="520" cy="130" r="14" fill="#fde68a"/><circle cx="552" cy="112" r="5" fill="#64748b"/>';
      m += '<text x="520" y="200" fill="#94a3b8" font-size="10" text-anchor="middle">secondary oocyte + 1st polar body</text>';
      m += '<text x="360" y="228" fill="#e2e8f0" font-size="12" text-anchor="middle">keeps nutrient-rich cytoplasm in ONE oocyte (unequal division)</text>';
      m += '<text x="360" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">primary -&gt; secondary (theca) -&gt; tertiary (antrum, theca interna/externa) -&gt; Graafian + zona</text>';
      m += '<text x="360" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">no oogonia added after birth; meiosis II completes at fertilisation (Sec 2.5)</text>';
    }
    svg.innerHTML = m;
    readout(cell("sperm ct", "46 -> 23", "#38bdf8") + cell("oocyte", "1 + polar body", "#f59e0b") + cell("follicles", "60-80k", "#34d399") + cell("semen", "200-300M"));
    if(side === "hormone") verdict("<b>Section 2.3, Ex 7-9:</b> GnRH -&gt; <b>LH to Leydig (androgens)</b> + <b>FSH to Sertoli</b>. Normal fertility needs <b>200-300M sperms</b> with <b>60%+ normal, 40%+ motile</b>. Acrosome aids entry; mitochondria drive the tail.");
    else if(side === "female") verdict("<b>Section 2.3, Fig. 2.8b, Ex 12:</b> foetal oogonia arrest in <b>prophase-I</b>; <b>60,000-80,000</b> follicles remain at puberty. Tertiary antrum follicle completes <b>unequal meiosis I</b>: large secondary oocyte + tiny <b>first polar body</b>; Graafian ruptures at ovulation.");
    else verdict("<b>Section 2.3, Fig. 2.5, Ex 6/8:</b> spermatogonium (<b>46</b>) -&gt; meiosis I -&gt; two secondary spermatocytes (<b>23</b>) -&gt; meiosis II -&gt; <b>four spermatids (23)</b>; then <b>spermiogenesis</b> (build) and <b>spermiation</b> (release). Starts at puberty.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["menstrual-cycle"] = (function(){
  function mount(){
    App.state.maxT = 28;
    var s = document.getElementById("time-scrubber"); if(s){ s.max = 28; s.value = 14; }
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Menstrual flow</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Follicular / estrogen</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>LH surge / ovulation</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Luteal / progesterone</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-men">Menstrual (day 1-5)</button>' +
      '<button class="preset-btn" id="p-fol">Follicular (day 5-13)</button>' +
      '<button class="preset-btn active" id="p-ovu">Ex 17: LH surge day 14</button>' +
      '<button class="preset-btn" id="p-lut">Luteal fork</button>';
    document.getElementById("p-men").onclick = function(){ setActivePreset(this); App.state.t = 2; var r=document.getElementById("ctrl-day-range"); if(r) r.value=2; draw(App.state.t); };
    document.getElementById("p-fol").onclick = function(){ setActivePreset(this); App.state.t = 9; var r=document.getElementById("ctrl-day-range"); if(r) r.value=9; draw(App.state.t); };
    document.getElementById("p-ovu").onclick = function(){ setActivePreset(this); App.state.t = 14; var r=document.getElementById("ctrl-day-range"); if(r) r.value=14; draw(App.state.t); };
    document.getElementById("p-lut").onclick = function(){ setActivePreset(this); App.state.t = 22; var r=document.getElementById("ctrl-day-range"); if(r) r.value=22; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Cycle day</span><span class="val" id="ctrl-day">14</span></div>' +
      '<input type="range" id="ctrl-day-range" min="1" max="28" step="1" value="14"></div>' +
      '<div class="control-item"><div class="control-label"><span>Fertilised?</span><span class="val" id="ctrl-fer">no</span></div>' +
      '<select id="ctrl-fersel"><option value="no">no fertilisation</option><option value="yes">fertilisation (pregnancy)</option></select></div>';
    document.getElementById("ctrl-day-range").oninput = function(){ App.state.t = Number(this.value); draw(App.state.t); };
    document.getElementById("ctrl-fersel").onchange = function(){ draw(App.state.t); };
    draw(14);
  }
  function phaseOf(d){
    if(d <= 5) return "menstrual";
    if(d <= 13) return "follicular";
    if(d <= 15) return "ovulation";
    return "luteal";
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var ctrl = document.getElementById("ctrl-day-range");
    var d = ctrl ? Math.round(Number(ctrl.value)) : Math.round(t);
    if(d < 1) d = 1; if(d > 28) d = 28;
    var fsel = document.getElementById("ctrl-fersel");
    var fert = fsel ? fsel.value : "no";
    var e1 = document.getElementById("ctrl-day"); if(e1) e1.textContent = d;
    var e2 = document.getElementById("ctrl-fer"); if(e2) e2.textContent = fert;
    var ph = phaseOf(d);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 2.9 style: hormones + ovary + uterus on one axis (Sec 2.4)</text>';
    m += '<line x1="60" y1="250" x2="660" y2="250" stroke="#475569"/>';
    for(var dd=1;dd<=28;dd+=1){
      var x = 60 + (dd-1)*(600/27);
      var h = 8;
      if(dd >= 12 && dd <= 16) h = 30 + (dd===14 ? 46 : 20);
      else if(dd > 5 && dd < 14) h = 12 + dd;
      else if(dd > 15) h = 44 - (dd-15)*2;
      var col = dd<=5 ? "#f87171" : (dd<14 ? "#38bdf8" : (dd<=15 ? "#f59e0b" : "#34d399"));
      if(dd === d){ m += '<line x1="' + x + '" y1="60" x2="' + x + '" y2="250" stroke="#f8fafc" stroke-width="2"/>'; }
      m += '<line x1="' + x + '" y1="' + (250-h) + '" x2="' + x + '" y2="250" stroke="' + col + '" stroke-width="4"/>';
    }
    m += '<circle cx="' + (60+(14-1)*(600/27)) + '" cy="120" r="8" fill="#f59e0b"/>';
    m += '<text x="' + (60+(14-1)*(600/27)) + '" y="105" fill="#f59e0b" font-size="10" text-anchor="middle">LH surge ~day 14</text>';
    m += '<text x="120" y="70" fill="#e2e8f0" font-size="12">day ' + d + ': ' + ph + '</text>';
    m += '<text x="120" y="92" fill="#94a3b8" font-size="11">cycle 28/29 d; flow 3-5 d</text>';
    m += '<text x="120" y="110" fill="#94a3b8" font-size="11">menarche..menopause (~50)</text>';
    m += '<text x="480" y="70" fill="#38bdf8" font-size="11">follicle -&gt; Graafian; endometrium</text>';
    m += '<text x="480" y="86" fill="#38bdf8" font-size="11">proliferates (estrogens)</text>';
    m += '<text x="480" y="106" fill="#34d399" font-size="11">luteal: corpus luteum -&gt;</text>';
    m += '<text x="480" y="122" fill="#34d399" font-size="11">progesterone holds lining</text>';
    if(fert === "yes" && d > 15){
      m += '<text x="480" y="146" fill="#34d399" font-size="12">fertilised: luteum persists,</text>';
      m += '<text x="480" y="162" fill="#34d399" font-size="12">no menstruation (pregnancy)</text>';
    } else if(d > 15){
      m += '<text x="480" y="146" fill="#f87171" font-size="12">no fertilisation: luteum</text>';
      m += '<text x="480" y="162" fill="#f87171" font-size="12">degenerates -&gt; bleeding</text>';
    }
    m += '<text x="480" y="188" fill="#94a3b8" font-size="10">hygiene box p.35: napkins/pads,</text>';
    m += '<text x="480" y="202" fill="#94a3b8" font-size="10">change every 4-5 h, wrap + bin,</text>';
    m += '<text x="480" y="216" fill="#94a3b8" font-size="10">never drains/open plots, soap wash</text>';
    svg.innerHTML = m;
    readout(cell("day", String(d) + " / 28", "#f59e0b") + cell("phase", ph) + cell("path", fert === "yes" ? "pregnancy" : "bleed restart", "#34d399"));
    if(ph === "menstrual") verdict("<b>Section 2.4:</b> menstrual phase (<b>3-5 days</b>): endometrium + vessels break down and flow out. Absence may mean pregnancy — or stress, poor health. Day 1 restarts the <b>28/29-day</b> count.");
    else if(ph === "follicular") verdict("<b>Section 2.4, Fig. 2.9:</b> follicular phase: Graafian matures while endometrium <b>proliferates</b>, driven by rising <b>LH/FSH + estrogens</b> from growing follicles.");
    else if(ph === "ovulation") verdict("<b>Exercise 1(g), Sec 2.4:</b> both gonadotropins peak mid-cycle (<b>~day 14</b>); rapid <b>LH surge</b> ruptures the Graafian follicle — <b>ovulation</b>. One ovum released mid-cycle.");
    else verdict("<b>Exercise 17, Sec 2.4:</b> luteal phase: remnants become <b>corpus luteum</b> secreting <b>progesterone</b> for implantation. Fertilised: persists, cycles stop. Else: degenerates, endometrium sheds. Cycles run <b>menarche to menopause (~50)</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["fertilisation-implantation"] = (function(){
  var steps = ["insemination (coitus)", "ampullary meeting", "zona block: one sperm", "acrosome entry + meiosis II", "zygote 46: XX/XY fixed", "cleavage 2-4-8-16 (morula)", "blastocyst: trophoblast + ICM", "implantation (embedding)"];
  function mount(){
    App.state.maxT = 7;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 7;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sperm path</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Ovum / zygote</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Blastocyst layers</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-amp">Ampulla site</button>' +
      '<button class="preset-btn active" id="p-zona">Zona block + XX/XY</button>' +
      '<button class="preset-btn" id="p-blas">Ex 1: morula-blastocyst</button>';
    document.getElementById("p-amp").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-fi-range"); if(r) r.value=1; draw(App.state.t); };
    document.getElementById("p-zona").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-fi-range"); if(r) r.value=4; draw(App.state.t); };
    document.getElementById("p-blas").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-fi-range"); if(r) r.value=7; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Journey step</span><span class="val" id="ctrl-fi">4</span></div>' +
      '<input type="range" id="ctrl-fi-range" min="0" max="7" step="1" value="4"></div>' +
      '<div class="control-item"><div class="control-label"><span>Fertilising sperm</span><span class="val" id="ctrl-xy">X</span></div>' +
      '<select id="ctrl-xysel"><option value="X">X-sperm (girl)</option><option value="Y">Y-sperm (boy)</option></select></div>';
    document.getElementById("ctrl-fi-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-xysel").onchange = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = Math.round(numEl("ctrl-fi-range", 4));
    var xsel = document.getElementById("ctrl-xysel");
    var sp = xsel ? xsel.value : "X";
    var e1 = document.getElementById("ctrl-fi"); if(e1) e1.textContent = st;
    var e2 = document.getElementById("ctrl-xy"); if(e2) e2.textContent = sp;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 2.10-2.11 style: vagina -&gt; cervix -&gt; uterus -&gt; ampulla -&gt; isthmus -&gt; uterus (Sec 2.5)</text>';
    m += '<rect x="40" y="120" width="80" height="60" rx="6" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="80" y="155" fill="#94a3b8" font-size="10" text-anchor="middle">vagina</text>';
    m += '<rect x="140" y="130" width="70" height="40" rx="6" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="175" y="154" fill="#94a3b8" font-size="10" text-anchor="middle">uterus</text>';
    m += '<path d="M 210 140 L 330 110" stroke="#475569" stroke-width="8" stroke-linecap="round"/>';
    m += '<text x="270" y="100" fill="#f59e0b" font-size="10" text-anchor="middle">ampulla (fusion)</text>';
    m += '<path d="M 210 160 L 330 190" stroke="#475569" stroke-width="8" stroke-linecap="round"/>';
    m += '<text x="270" y="210" fill="#94a3b8" font-size="10" text-anchor="middle">isthmus (cleavage)</text>';
    var prog = Math.min(1, st/7);
    var sx = 60 + prog*230 + (st>=1 && st<6 ? (t*10 % 12) : 0);
    m += '<circle cx="' + sx + '" cy="140" r="5" fill="#38bdf8"/>';
    m += '<circle cx="' + (sx-14) + '" cy="148" r="4" fill="#38bdf8" opacity="0.6"/>';
    if(st >= 1){
      m += '<circle cx="330" cy="110" r="' + (st===1?10:13) + '" fill="#f472b6" stroke="#f8fafc"/>';
      if(st >= 2){ m += '<circle cx="330" cy="110" r="20" fill="none" stroke="#f59e0b" stroke-dasharray="4 3"/>'; }
      m += '<text x="330" y="82" fill="#94a3b8" font-size="10" text-anchor="middle">zona pellucida</text>';
    }
    if(st >= 5){
      var n = st === 5 ? 4 : (st === 6 ? 12 : 16);
      m += '<text x="470" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">blastomeres: ' + (st===5 ? "2-16 (morula 8-16)" : (st===6 ? "blastocyst layers" : "embedded")) + '</text>';
    }
    if(st >= 6){
      m += '<circle cx="420" cy="150" r="34" fill="none" stroke="#34d399" stroke-width="3"/>';
      m += '<circle cx="420" cy="150" r="12" fill="#f472b6"/>';
      m += '<text x="420" y="200" fill="#34d399" font-size="10" text-anchor="middle">trophoblast + inner mass</text>';
    }
    if(st >= 7){
      m += '<rect x="380" y="210" width="80" height="26" rx="4" fill="#3b2f2f" stroke="#34d399"/>';
      m += '<text x="420" y="227" fill="#e2e8f0" font-size="10" text-anchor="middle">endometrium: step H</text>';
    }
    m += '<text x="540" y="60" fill="#e2e8f0" font-size="13">Step ' + st + ': ' + steps[st] + '</text>';
    m += '<text x="540" y="84" fill="#38bdf8" font-size="12">23 + 23 = 46 zygote</text>';
    m += '<text x="540" y="106" fill="#f59e0b" font-size="12">sperm ' + sp + ' + ovum X -&gt; ' + (sp==="X" ? "XX girl" : "XY boy") + '</text>';
    m += '<text x="540" y="128" fill="#94a3b8" font-size="11">secondary oocyte + entry</text>';
    m += '<text x="540" y="144" fill="#94a3b8" font-size="11">-&gt; ootid + 2nd polar body</text>';
    m += '<text x="540" y="166" fill="#94a3b8" font-size="11">morula 8-16; blastocyst:</text>';
    m += '<text x="540" y="182" fill="#94a3b8" font-size="11">trophoblast (attach) + ICM</text>';
    m += '<text x="540" y="198" fill="#94a3b8" font-size="11">(embryo); uterine cells</text>';
    m += '<text x="540" y="214" fill="#94a3b8" font-size="11">overgrow = implantation</text>';
    svg.innerHTML = m;
    readout(cell("site", "ampulla", "#f59e0b") + cell("zygote", "46", "#38bdf8") + cell("sex", sp === "X" ? "XX girl" : "XY boy", "#f472b6") + cell("stage", "morula 8-16"));
    if(st <= 2) verdict("<b>Section 2.5, Fig. 2.11b:</b> insemination into vagina; sperms swim via cervix to the <b>ampulla</b> where the ovum arrives — fusion needs both together, so not every coitus leads to pregnancy. Zona contact <b>blocks extra sperms</b>.");
    else if(st <= 4) verdict("<b>Exercises 1(d)(e)(h), 19, Sec 2.5:</b> acrosome secretions admit one sperm; entry finishes <b>meiosis II</b> (ootid + <b>second polar body</b>); nuclei fuse to diploid <b>zygote (46)</b>. Ova all X; <b>X-sperm -&gt; XX, Y-sperm -&gt; XY</b> — sex decided by the <b>father</b>.");
    else verdict("<b>Exercise 1(j), Sec 2.5, Fig. 2.11e,g,H:</b> mitotic <b>cleavage 2-4-8-16</b>; <b>8-16 = morula</b>; uterus <b>blastocyst (trophoblast + inner cell mass)</b>; trophoblast attaches, ICM becomes embryo, blastocyst embeds — <b>implantation leads to pregnancy</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["pregnancy-embryonic-development"] = (function(){
  var marks = ["1 mo: heart formed", "2 mo: limbs + digits", "12 wk: systems formed", "5 mo: movement + hair", "24 wk: fine hair, eyelids", "9 mo: delivery-ready"];
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Embryo / foetus</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Placenta + cord</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Pregnancy-only hormones</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-pla">Placenta + hormones</button>' +
      '<button class="preset-btn active" id="p-mile">Milestone clock</button>' +
      '<button class="preset-btn" id="p-ger">Germ layers</button>';
    document.getElementById("p-pla").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-mo-range"); if(r) r.value=4; draw(App.state.t); };
    document.getElementById("p-mile").onclick = function(){ setActivePreset(this); draw(App.state.t); };
    document.getElementById("p-ger").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-mo-range"); if(r) r.value=2; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Month of pregnancy</span><span class="val" id="ctrl-mo">5</span></div>' +
      '<input type="range" id="ctrl-mo-range" min="1" max="9" step="1" value="5"></div>';
    document.getElementById("ctrl-mo-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var mo = Math.round(numEl("ctrl-mo-range", 5));
    var e1 = document.getElementById("ctrl-mo"); if(e1) e1.textContent = mo;
    var idx = mo <= 1 ? 0 : (mo <= 2 ? 1 : (mo <= 3 ? 2 : (mo <= 5 ? 3 : (mo <= 6 ? 4 : 5))));
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 2.12 style: villi + cord + 9-month clock (Sec 2.6)</text>';
    m += '<ellipse cx="200" cy="150" rx="100" ry="80" fill="#0f1f2e" stroke="#38bdf8" stroke-width="2"/>';
    for(var v=0;v<7;v++){
      var vx = 120 + v*24;
      m += '<path d="M ' + vx + ' 110 L ' + (vx+8) + ' 150 L ' + vx + ' 190" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    }
    m += '<text x="200" y="100" fill="#38bdf8" font-size="10" text-anchor="middle">chorionic villi + uterine tissue = placenta</text>';
    var fs = 10 + mo*3;
    m += '<circle cx="200" cy="160" r="' + fs + '" fill="#f472b6"/>';
    if(mo >= 1){ m += '<circle cx="200" cy="160" r="4" fill="#f87171"/>'; }
    if(mo >= 2){ m += '<line x1="' + (200-fs) + '" y1="160" x2="' + (200+fs) + '" y2="160" stroke="#7c2d12" stroke-width="3"/>'; }
    if(mo >= 5){ m += '<path d="M ' + (200-fs) + ' 150 Q 200 130 ' + (200+fs) + ' 150" stroke="#fde68a" stroke-width="2" fill="none"/>'; }
    m += '<line x1="200" y1="' + (160+fs) + '" x2="200" y2="245" stroke="#f59e0b" stroke-width="4"/>';
    m += '<text x="200" y="262" fill="#f59e0b" font-size="10" text-anchor="middle">umbilical cord: transport</text>';
    m += '<text x="200" y="278" fill="#94a3b8" font-size="10" text-anchor="middle">O2/nutrients in; CO2/waste out</text>';
    for(var k=0;k<6;k++){
      var kx = 400 + k*48;
      var on = k <= idx;
      m += '<circle cx="' + kx + '" cy="110" r="14" fill="' + (on ? "#34d399" : "#1e293b") + '" stroke="#475569"/>';
      m += '<text x="' + kx + '" y="114" fill="' + (on ? "#052e16" : "#94a3b8") + '" font-size="10" text-anchor="middle">' + (k+1) + '</text>';
      m += '<text x="' + kx + '" y="140" fill="#94a3b8" font-size="8" text-anchor="middle">' + marks[k].split(":")[0] + '</text>';
    }
    m += '<text x="540" y="170" fill="#e2e8f0" font-size="13">' + marks[idx] + '</text>';
    m += '<text x="420" y="196" fill="#34d399" font-size="11">hCG + hPL + relaxin: pregnancy-only</text>';
    m += '<text x="420" y="214" fill="#94a3b8" font-size="11">+ estrogens, progestogens, cortisol,</text>';
    m += '<text x="420" y="230" fill="#94a3b8" font-size="11">prolactin, thyroxine rise several-fold</text>';
    m += '<text x="420" y="252" fill="#94a3b8" font-size="11">ectoderm / mesoderm / endoderm -&gt; all</text>';
    m += '<text x="420" y="268" fill="#94a3b8" font-size="11">tissues; stem cells potent</text>';
    svg.innerHTML = m;
    readout(cell("month", String(mo) + " / 9", "#f472b6") + cell("milestone", marks[idx], "#34d399") + cell("duration", "9 months"));
    verdict("<b>Section 2.6, Ex 1(k):</b> placenta = <b>villi + uterine tissue</b> (exchange + <b>hCG, hPL, estrogens, progestogens</b>; ovarian <b>relaxin</b> later; first trio <b>pregnancy-only</b>). Month " + mo + ": <b>" + marks[idx] + "</b>. Clock: 1 mo heart (stethoscope) -&gt; 2 mo digits -&gt; 12 wk systems -&gt; 5 mo movement/hair -&gt; ~24 wk eyelids/lashes -&gt; 9 mo ready.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["parturition-lactation"] = (function(){
  var steps = ["9-month gestation complete", "foetal + placental signals", "foetal ejection reflex (mild)", "oxytocin from maternal pituitary", "stronger contractions", "positive reflex loop", "birth-canal delivery", "placental expulsion + colostrum"];
  function mount(){
    App.state.maxT = 7;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 7;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Signal / reflex</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Oxytocin + contraction</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Colostrum (antibodies)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ref">Ex 18: reflex loop</button>' +
      '<button class="preset-btn" id="p-milk">First milk: colostrum</button>';
    document.getElementById("p-ref").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-pa-range"); if(r) r.value=5; draw(App.state.t); };
    document.getElementById("p-milk").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-pa-range"); if(r) r.value=7; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Cascade step</span><span class="val" id="ctrl-pa">5</span></div>' +
      '<input type="range" id="ctrl-pa-range" min="0" max="7" step="1" value="5"></div>';
    document.getElementById("ctrl-pa-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = Math.round(numEl("ctrl-pa-range", 5));
    var e1 = document.getElementById("ctrl-pa"); if(e1) e1.textContent = st;
    var strength = st <= 2 ? 1 : (st <= 4 ? 2 + (t % 2) : 4 + (t % 3));
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 2.7: foetal ejection reflex -&gt; oxytocin loop -&gt; delivery (Ex 18)</text>';
    m += '<rect x="40" y="60" width="220" height="180" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<circle cx="150" cy="140" r="34" fill="#f472b6"/>';
    m += '<text x="150" y="200" fill="#94a3b8" font-size="10" text-anchor="middle">fully developed foetus</text>';
    m += '<text x="150" y="214" fill="#94a3b8" font-size="10" text-anchor="middle">+ placenta signal</text>';
    m += '<rect x="300" y="60" width="180" height="180" rx="8" fill="#0f1f2e" stroke="' + (st>=2 ? "#f59e0b" : "#334155") + '"/>';
    m += '<text x="390" y="80" fill="#f59e0b" font-size="11" text-anchor="middle">uterus (myometrium)</text>';
    for(var w=0;w<strength;w++){
      m += '<path d="M 320 ' + (110+w*22) + ' Q 390 ' + (100+w*22) + ' 460 ' + (110+w*22) + '" fill="none" stroke="#f87171" stroke-width="3"/>';
    }
    m += '<text x="390" y="210" fill="#94a3b8" font-size="10" text-anchor="middle">mild -&gt; strong</text>';
    m += '<rect x="510" y="60" width="170" height="180" rx="8" fill="#0f1f2e" stroke="' + (st>=3 ? "#f87171" : "#334155") + '"/>';
    m += '<text x="595" y="80" fill="#f87171" font-size="11" text-anchor="middle">maternal pituitary</text>';
    m += '<rect x="550" y="100" width="90" height="30" rx="12" fill="#f87171"/>';
    m += '<text x="595" y="119" fill="#450a0a" font-size="11" text-anchor="middle">oxytocin</text>';
    if(st >= 5){
      m += '<path d="M 480 150 Q 595 90 660 150" fill="none" stroke="#f8fafc" stroke-width="2" stroke-dasharray="5 3"/>';
      m += '<path d="M 660 150 Q 595 210 480 170" fill="none" stroke="#f8fafc" stroke-width="2" stroke-dasharray="5 3"/>';
      m += '<text x="595" y="230" fill="#e2e8f0" font-size="10" text-anchor="middle">stimulatory reflex loop</text>';
    }
    if(st >= 6){
      m += '<polygon points="250,256 290,256 270,276" fill="#34d399"/>';
      m += '<text x="360" y="270" fill="#34d399" font-size="11" text-anchor="middle">birth canal; placenta expelled soon after</text>';
    }
    m += '<text x="360" y="44" fill="#e2e8f0" font-size="12">Step ' + st + ': ' + steps[st] + '</text>';
    if(st >= 7){
      m += '<rect x="40" y="248" width="640" height="36" rx="6" fill="#0c2437" stroke="#38bdf8"/>';
      m += '<text x="360" y="270" fill="#38bdf8" font-size="12" text-anchor="middle">lactation: mammary differentiated in late pregnancy; colostrum (first days) = antibodies, essential; breast-feed initially</text>';
    }
    svg.innerHTML = m;
    readout(cell("gestation", "9 months") + cell("driver", "oxytocin", "#f87171") + cell("loop", st >= 5 ? "positive reflex" : "building", "#f59e0b") + cell("first milk", "colostrum", "#38bdf8"));
    if(st <= 5) verdict("<b>Exercise 18, Sec 2.7:</b> average <b>9-month gestation</b>; foetal + placental signals start <b>foetal ejection reflex</b> (mild contractions) -&gt; <b>oxytocin from maternal pituitary</b> -&gt; stronger contractions -&gt; more oxytocin (summary adds <b>cortisol, estrogens</b>). Doctors inject at the oxytocin link.");
    else verdict("<b>Section 2.7:</b> loop strengthens to <b>birth-canal expulsion</b>; <b>placenta expelled</b> soon after. Mammary glands (differentiated in pregnancy) lactate; first-days <b>colostrum carries several antibodies absolutely essential</b> — doctors recommend <b>initial breast-feeding</b>.");
  }
  return { mount: mount, draw: draw };
})();
