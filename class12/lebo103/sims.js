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

window.SIMS["repro-health-strategies"] = (function(){
  var pillar = "awareness";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Awareness</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Care + infrastructure</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Legal ban (sex-determination)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-aw">Ex 1-4: awareness + RCH</button>' +
      '<button class="preset-btn" id="p-infra">Infrastructure + immunisation</button>' +
      '<button class="preset-btn" id="p-amn">Amniocentesis rule (Ex 8)</button>';
    document.getElementById("p-aw").onclick = function(){ setActivePreset(this); pillar="awareness"; draw(App.state.t); };
    document.getElementById("p-infra").onclick = function(){ setActivePreset(this); pillar="infra"; draw(App.state.t); };
    document.getElementById("p-amn").onclick = function(){ setActivePreset(this); pillar="amnio"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Audience reached</span><span class="val" id="ctrl-ad">adolescents</span></div>' +
      '<select id="ctrl-adsel"><option value="adolescents">adolescents (myths vs facts)</option><option value="couples">fertile + marriageable-age couples</option><option value="mothers">pregnant mothers + post-natal</option></select></div>';
    document.getElementById("ctrl-adsel").onchange = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var asel = document.getElementById("ctrl-adsel");
    var aud = asel ? asel.value : "adolescents";
    var e1 = document.getElementById("ctrl-ad"); if(e1) e1.textContent = aud;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 3.1: RCH = awareness + facilities and support (family planning 1951)</text>';
    var ao = pillar === "awareness" ? 1 : 0.45, io = pillar === "infra" ? 1 : 0.45, bo = pillar === "amnio" ? 1 : 0.45;
    m += '<g opacity="' + ao + '"><rect x="30" y="45" width="215" height="215" rx="8" fill="#0f1f2e" stroke="#38bdf8"/>';
    m += '<text x="137" y="66" fill="#38bdf8" font-size="12" text-anchor="middle">AWARENESS</text>';
    m += '<text x="45" y="92" fill="#e2e8f0" font-size="11">organs, adolescence</text>';
    m += '<text x="45" y="110" fill="#e2e8f0" font-size="11">hygiene, STDs, AIDS</text>';
    m += '<text x="45" y="128" fill="#e2e8f0" font-size="11">birth control, pregnancy</text>';
    m += '<text x="45" y="146" fill="#e2e8f0" font-size="11">breast feeding, equal</text>';
    m += '<text x="45" y="164" fill="#e2e8f0" font-size="11">opportunities, population</text>';
    m += '<text x="45" y="186" fill="#94a3b8" font-size="11">media + parents, teachers,</text>';
    m += '<text x="45" y="202" fill="#94a3b8" font-size="11">friends; sex education</text>';
    m += '<text x="45" y="218" fill="#94a3b8" font-size="11">in schools vs myths</text>';
    m += '<text x="45" y="240" fill="#38bdf8" font-size="11">audience: ' + aud + '</text></g>';
    m += '<g opacity="' + io + '"><rect x="258" y="45" width="215" height="215" rx="8" fill="#0f1f2e" stroke="#f59e0b"/>';
    m += '<text x="365" y="66" fill="#f59e0b" font-size="12" text-anchor="middle">CARE + INFRA</text>';
    m += '<text x="273" y="92" fill="#e2e8f0" font-size="11">pregnancy, delivery</text>';
    m += '<text x="273" y="110" fill="#e2e8f0" font-size="11">STDs, abortions,</text>';
    m += '<text x="273" y="128" fill="#e2e8f0" font-size="11">contraception, menstrual</text>';
    m += '<text x="273" y="146" fill="#e2e8f0" font-size="11">problems, infertility</text>';
    m += '<text x="273" y="168" fill="#94a3b8" font-size="11">massive child immunisation</text>';
    m += '<text x="273" y="186" fill="#94a3b8" font-size="11">research: Saheli, CDRI</text>';
    m += '<text x="273" y="204" fill="#94a3b8" font-size="11">Lucknow (see Sec 3.2)</text>';
    m += '<text x="273" y="228" fill="#f59e0b" font-size="11">assisted deliveries up;</text>';
    m += '<text x="273" y="244" fill="#f59e0b" font-size="11">MMR/IMR down; small families</text></g>';
    m += '<g opacity="' + bo + '"><rect x="486" y="45" width="204" height="215" rx="8" fill="#0f1f2e" stroke="#f87171"/>';
    m += '<text x="588" y="66" fill="#f87171" font-size="12" text-anchor="middle">AMNIOCENTESIS</text>';
    m += '<text x="500" y="92" fill="#e2e8f0" font-size="11">tests Down, haemophilia,</text>';
    m += '<text x="500" y="110" fill="#e2e8f0" font-size="11">sickle-cell, survivability</text>';
    m += '<text x="500" y="132" fill="#f87171" font-size="11">statutory BAN on use for</text>';
    m += '<text x="500" y="150" fill="#f87171" font-size="11">sex-determination:</text>';
    m += '<text x="500" y="168" fill="#f87171" font-size="11">checks female foeticide</text>';
    m += '<text x="500" y="192" fill="#94a3b8" font-size="11">amniotic fluid + fetal</text>';
    m += '<text x="500" y="208" fill="#94a3b8" font-size="11">cells analysed</text>';
    m += '<text x="500" y="230" fill="#94a3b8" font-size="11">India among first: 1951</text>';
    m += '<text x="500" y="246" fill="#94a3b8" font-size="11">family planning -&gt; RCH</text></g>';
    svg.innerHTML = m;
    readout(cell("WHO", "physical+emotional+behavioural+social", "#38bdf8") + cell("start", "1951 family planning", "#f59e0b") + cell("tasks", "awareness + facilities"));
    if(pillar === "amnio") verdict("<b>Exercise 8, Sec 3.1:</b> amniocentesis analyses fluid for <b>Down syndrome, haemophilia, sickle-cell anaemia, survivability</b>; the statutory <b>ban on sex-determination</b> checks female foeticide. Ban is necessary — misuse + illegal MTP is condemned in Sec 3.3 too.");
    else if(pillar === "infra") verdict("<b>Exercises 2/4, Sec 3.1:</b> infrastructure for pregnancy, delivery, STDs, abortions, contraception, infertility + better techniques; massive <b>child immunisation</b>; research (Saheli). Improvement = assisted deliveries, post-natal care, lower MMR/IMR, small families, STD detection/cure.");
    else verdict("<b>Exercises 1-3, Sec 3.1:</b> WHO health = <b>total well-being (physical, emotional, behavioural, social)</b>. India among first (1951). Awareness via media, parents, teachers + <b>sex education in schools</b> so adolescents get facts, not myths. Audience now: <b>" + aud + "</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["population-contraception"] = (function(){
  var method = "condom";
  var mode = "method";
  var info = {
    "abstinence": ["natural", "no coitus day 10-17 (fertile); withdrawal; lactational amenorrhoea <= 6 mo", "no devices; ~nil side effects; failure high"],
    "condom": ["barrier", "latex sheath (Nirodh male brand); diaphragm/cap/vault cover cervix + spermicide", "blocks meeting; added STI/AIDS cover; disposable/self-inserted"],
    "iud": ["IUD (doctor/nurse)", "Lippes loop | CuT, Cu7, Multiload 375 | Progestasert, LNG-20", "phagocytosis + Cu motility block + hormone uterus/cervix"],
    "pill": ["oral", "progestogen / progestogen-estrogen 21 d from first 5 d + 7 d gap; Saheli weekly non-steroidal (CDRI Lucknow)", "inhibit ovulation + implantation; mucus vs sperm"],
    "injectable": ["injectable/implant", "progestogen +/- estrogen, longer-acting like pills", "same pill logic; longer duration"],
    "emergency": ["emergency <= 72 h", "progestogen / combo or IUD within 72 h of unprotected coitus", "post-coital; rape/failure backup"],
    "surgical": ["surgical (terminal)", "vasectomy (vas deferens) / tubectomy (fallopian tube); block transport", "highly effective; reversibility very poor"]
  };
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Natural / barrier</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>IUD / pill / injectable</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Emergency / surgical</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-pop">Population figures</button>' +
      '<button class="preset-btn active" id="p-met">Method comparator</button>' +
      '<button class="preset-btn" id="p-ideal">Ideal criteria (Ex 7)</button>';
    mode = "method";
    document.getElementById("p-pop").onclick = function(){ setActivePreset(this); mode="pop"; draw(App.state.t); };
    document.getElementById("p-met").onclick = function(){ setActivePreset(this); mode="method"; draw(App.state.t); };
    document.getElementById("p-ideal").onclick = function(){ setActivePreset(this); mode="ideal"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Method</span><span class="val" id="ctrl-m">condom</span></div>' +
      '<select id="ctrl-msel"><option value="abstinence">natural (abstinence/withdrawal/lactational)</option><option value="condom" selected>barrier (condom/diaphragm)</option><option value="iud">IUDs (Lippes/Cu/hormone)</option><option value="pill">pills (21+7; Saheli)</option><option value="injectable">injectables/implants</option><option value="emergency">emergency (&lt;=72 h)</option><option value="surgical">surgical (vasectomy/tubectomy)</option></select></div>';
    document.getElementById("ctrl-msel").onchange = function(){ mode="method"; setActivePreset(document.getElementById("p-met")); draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var msel = document.getElementById("ctrl-msel");
    method = msel ? msel.value : "condom";
    if(!info[method]) method = "condom";
    var e1 = document.getElementById("ctrl-m"); if(e1) e1.textContent = method;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "pop"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 3.2 in-text title: Population Stabilisation and Birth Control (Ex 5)</text>';
      m += '<text x="80" y="70" fill="#e2e8f0" font-size="13">world: ~2B (1900) -&gt; ~6B (2000) -&gt; 7.2B (2011)</text>';
      m += '<text x="80" y="96" fill="#e2e8f0" font-size="13">India: ~350M (independence) -&gt; ~1B (2000) -&gt; 1.2B+ (May 2011)</text>';
      m += '<text x="80" y="122" fill="#94a3b8" font-size="12">reasons: death rate, MMR, IMR down; more reproductive-age people</text>';
      m += '<text x="80" y="148" fill="#f59e0b" font-size="13">2011 growth still &lt; 2% = 20/1000/yr: still rapid</text>';
      m += '<rect x="80" y="165" width="560" height="14" rx="7" fill="#1e293b"/>';
      m += '<rect x="80" y="165" width="' + (560*0.02*8) + '" height="14" rx="7" fill="#f59e0b"/>';
      m += '<text x="80" y="200" fill="#94a3b8" font-size="12">responses: Hum Do Hamare Do; one-child urban norm; marriage 18 F / 21 M; incentives</text>';
      m += '<text x="80" y="226" fill="#94a3b8" font-size="12">contraceptive groups: natural, barrier, IUD, oral, injectable, implant, surgical (Fig. 3.1-3.4)</text>';
      m += '<text x="80" y="252" fill="#f87171" font-size="12">book gives NO efficacy rates - none shown; use only with qualified medical advice</text>';
    } else if(mode === "ideal"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Ideal contraceptive + cautions (Sec 3.2, Ex 6-7)</text>';
      var items = ["user-friendly", "easily available", "effective + reversible", "no/least side-effects", "no interference with drive/desire/act"];
      for(var i=0;i<items.length;i++){
        m += '<rect x="120" y="' + (60+i*34) + '" width="480" height="26" rx="6" fill="#0f1f2e" stroke="#34d399"/>';
        m += '<text x="360" y="' + (78+i*34) + '" fill="#e2e8f0" font-size="12" text-anchor="middle">' + items[i] + '</text>';
      }
      m += '<text x="360" y="252" fill="#f87171" font-size="11" text-anchor="middle">Ex 7: gonad removal is NOT contraception (irreversible, kills hormones/drive)</text>';
      m += '<text x="360" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">possible ill-effects (nausea, bleeding, even breast cancer): not very significant, not to be ignored</text>';
    } else {
      var d = info[method];
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Method comparator — type, mechanism, book facts (no invented rates)</text>';
      m += '<rect x="60" y="50" width="600" height="200" rx="8" fill="#0f1f2e" stroke="#38bdf8"/>';
      m += '<text x="360" y="76" fill="#38bdf8" font-size="14" text-anchor="middle">' + d[0] + ': ' + method + '</text>';
      m += '<text x="90" y="112" fill="#e2e8f0" font-size="12">regimen/names: ' + d[1] + '</text>';
      m += '<text x="90" y="142" fill="#94a3b8" font-size="12">mechanism: ' + d[2] + '</text>';
      m += '<text x="90" y="172" fill="#f59e0b" font-size="12">natural windows: fertile day 10-17; lactational only &lt;= 6 mo + full feeding</text>';
      m += '<text x="90" y="196" fill="#f59e0b" font-size="12">pill: 21 d from first 5 d + 7 d gap; emergency: &lt;= 72 h; surgery: poor reversibility</text>';
      m += '<text x="90" y="220" fill="#f87171" font-size="12">no efficacy rates in book - comparator stays qualitative by design</text>';
      m += '<text x="90" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Fig. 3.1 condoms 3.2 Copper-T 3.3 implants 3.4 vasectomy/tubectomy; Saheli: non-steroidal, once a week</text>';
    }
    svg.innerHTML = m;
    readout(cell("method", method) + cell("type", info[method][0], "#38bdf8") + cell("fertile", "day 10-17", "#f59e0b") + cell("emergency", "<= 72 h", "#f87171"));
    if(mode === "pop") verdict("<b>Exercise 5, Sec 3.2:</b> explosion from falling death/MMR/IMR + more reproductive-age people. 2011 census growth <b>&lt;2% (20/1000/yr)</b> — still scarcity-threatening. Answers: smaller families, <b>Hum Do Hamare Do</b>, marriage <b>18/21</b>, incentives.");
    else if(mode === "ideal") verdict("<b>Exercises 6-7, Sec 3.2:</b> ideal = user-friendly, available, effective, reversible, safe, desire-neutral. <b>Ex 7:</b> gonad removal fails every test (permanent, hormonal). Contraceptives oppose conception — take only under <b>qualified medical advice</b>.");
    else verdict("<b>Section 3.2, Ex 12(a)(c)(d):</b> <b>" + method + "</b> (" + info[method][0] + "): " + info[method][1] + ". Mechanism: " + info[method][2] + ". Surgery blocks <b>transport, not formation</b>; pills are 21+7 (Saheli weekly); IUDs: Lippes | CuT/Cu7/Multiload 375 | Progestasert/LNG-20.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["mtp"] = (function(){
  function mount(){
    App.state.maxT = 24;
    var s = document.getElementById("time-scrubber"); if(s){ s.max = 24; s.value = 8; }
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>First trimester: relatively safe (&lt;=12 wk)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>12-24 wk: two RMPs, riskier</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Illegal/quack + misuse: unsafe</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-w8">8 weeks: one RMP</button>' +
      '<button class="preset-btn" id="p-w20">20 weeks: two RMPs</button>' +
      '<button class="preset-btn" id="p-trend">Unhealthy trends</button>';
    document.getElementById("p-w8").onclick = function(){ setActivePreset(this); App.state.t = 8; var r=document.getElementById("ctrl-wk-range"); if(r) r.value=8; draw(App.state.t); };
    document.getElementById("p-w20").onclick = function(){ setActivePreset(this); App.state.t = 20; var r=document.getElementById("ctrl-wk-range"); if(r) r.value=20; draw(App.state.t); };
    document.getElementById("p-trend").onclick = function(){ setActivePreset(this); draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Weeks of pregnancy</span><span class="val" id="ctrl-wk">8</span></div>' +
      '<input type="range" id="ctrl-wk-range" min="1" max="24" step="1" value="8"></div>';
    document.getElementById("ctrl-wk-range").oninput = function(){ App.state.t = Number(this.value); draw(App.state.t); };
    draw(8);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var ctrl = document.getElementById("ctrl-wk-range");
    var wk = ctrl ? Math.round(Number(ctrl.value)) : Math.round(t);
    if(wk < 1) wk = 1; if(wk > 24) wk = 24;
    var e1 = document.getElementById("ctrl-wk"); if(e1) e1.textContent = wk;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 3.3 + MTP (Amendment) Act 2017 box, p.46 (legal since 1971)</text>';
    m += '<line x1="60" y1="150" x2="660" y2="150" stroke="#475569" stroke-width="4"/>';
    for(var w=1;w<=24;w++){
      var x = 60 + (w-1)*(600/23);
      var col = w <= 12 ? "#34d399" : "#f59e0b";
      m += '<line x1="' + x + '" y1="130" x2="' + x + '" y2="170" stroke="' + col + '" stroke-width="3"/>';
    }
    var cx = 60 + (wk-1)*(600/23);
    m += '<circle cx="' + cx + '" cy="150" r="12" fill="#f8fafc" stroke="#38bdf8" stroke-width="3"/>';
    m += '<line x1="' + (60+11*(600/23)) + '" y1="110" x2="' + (60+11*(600/23)) + '" y2="190" stroke="#f8fafc" stroke-dasharray="5 3"/>';
    m += '<text x="' + (60+11*(600/23)) + '" y="100" fill="#e2e8f0" font-size="11" text-anchor="middle">12 wk line</text>';
    var cx2 = 60 + 23*(600/23);
    m += '<text x="' + cx2 + '" y="100" fill="#e2e8f0" font-size="11" text-anchor="middle">24 wk</text>';
    var rule = wk <= 12 ? "one RMP opinion" : "TWO RMP opinions (good faith)";
    var col2 = wk <= 12 ? "#34d399" : "#f59e0b";
    m += '<rect x="60" y="200" width="600" height="70" rx="8" fill="#0f1f2e" stroke="' + col2 + '"/>';
    m += '<text x="360" y="222" fill="' + col2 + '" font-size="13" text-anchor="middle">week ' + wk + ': ' + rule + '</text>';
    m += '<text x="360" y="242" fill="#94a3b8" font-size="11" text-anchor="middle">grounds: (i) risk to woman / grave injury to health; (ii) serious handicap risk to child</text>';
    m += '<text x="360" y="260" fill="#94a3b8" font-size="11" text-anchor="middle">45-50M MTPs/yr ~= 1/5 conceptions; 2nd trimester much riskier; quack abortions unsafe</text>';
    svg.innerHTML = m;
    readout(cell("week", String(wk), col2) + cell("opinions", wk <= 12 ? "1 RMP" : "2 RMPs", col2) + cell("safety", wk <= 12 ? "relatively safe" : "riskier", "#f59e0b") + cell("law", "1971 legalised"));
    if(wk <= 12) verdict("<b>2017 box, Sec 3.3:</b> within the <b>first 12 weeks</b>, termination on the <b>opinion of one registered medical practitioner</b> on the stated grounds. <b>First trimester = relatively safe</b>. 1971 legalisation had strict anti-misuse conditions.");
    else verdict("<b>2017 box, Sec 3.3:</b> more than 12 but <b>fewer than 24 weeks</b> needs <b>two RMPs, in good faith</b>, on ground (i) or (ii). <b>Second trimester much riskier</b>. Majority illegal/quack MTPs + amniocentesis-then-female-foeticide are the condemned trends.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["stis"] = (function(){
  var pick = "gonorrhoea";
  var curable = {"gonorrhoea": true, "syphilis": true, "chlamydiasis": true, "genital warts": true, "trichomoniasis": true, "genital herpes": false, "hepatitis-B": false, "HIV": false};
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Curable if early + proper</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Excepted: HIV, hepatitis-B, herpes</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Prevention triad</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cur">Ex 12(b): curable set</button>' +
      '<button class="preset-btn" id="p-exc">Excepted trio</button>' +
      '<button class="preset-btn" id="p-pre">Ex 10: prevention triad</button>';
    document.getElementById("p-cur").onclick = function(){ setActivePreset(this); pick="syphilis"; var r=document.getElementById("ctrl-sti"); if(r) r.value="syphilis"; draw(App.state.t); };
    document.getElementById("p-exc").onclick = function(){ setActivePreset(this); pick="HIV"; var r=document.getElementById("ctrl-sti"); if(r) r.value="HIV"; draw(App.state.t); };
    document.getElementById("p-pre").onclick = function(){ setActivePreset(this); draw(App.state.t); };
    var opts = "";
    for(var k in curable){ opts += '<option value="' + k + '"' + (k===pick ? " selected" : "") + '>' + k + '</option>'; }
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Infection</span><span class="val" id="ctrl-stiv">gonorrhoea</span></div>' +
      '<select id="ctrl-sti">' + opts + '</select></div>';
    document.getElementById("ctrl-sti").onchange = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var sel = document.getElementById("ctrl-sti");
    pick = sel ? sel.value : pick;
    if(!(pick in curable)) pick = "gonorrhoea";
    var e1 = document.getElementById("ctrl-stiv"); if(e1) e1.textContent = pick;
    var ok = curable[pick];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 3.4 in-text title: Sexually Transmitted Infections (Ex 10, 12b)</text>';
    var keys = ["gonorrhoea", "syphilis", "chlamydiasis", "genital warts", "trichomoniasis", "genital herpes", "hepatitis-B", "HIV"];
    for(var i=0;i<keys.length;i++){
      var x = 70 + (i%4)*160, y = 60 + Math.floor(i/4)*90;
      var c = curable[keys[i]] ? "#34d399" : "#f87171";
      var isPick = keys[i] === pick;
      m += '<rect x="' + x + '" y="' + y + '" width="140" height="60" rx="8" fill="' + (isPick ? "#1d3350" : "#0f1f2e") + '" stroke="' + c + '" stroke-width="' + (isPick?3:1) + '"/>';
      m += '<text x="' + (x+70) + '" y="' + (y+26) + '" fill="#e2e8f0" font-size="11" text-anchor="middle">' + keys[i] + '</text>';
      m += '<text x="' + (x+70) + '" y="' + (y+44) + '" fill="' + c + '" font-size="10" text-anchor="middle">' + (curable[keys[i]] ? "curable if early" : "NOT completely curable") + '</text>';
    }
    m += '<rect x="60" y="232" width="600" height="52" rx="8" fill="#0f1f2e" stroke="' + (ok ? "#34d399" : "#f87171") + '"/>';
    m += '<text x="360" y="252" fill="' + (ok ? "#34d399" : "#f87171") + '" font-size="13" text-anchor="middle">' + pick + ': ' + (ok ? "completely curable if detected early + treated properly" : "excepted — not completely curable") + '</text>';
    m += '<text x="360" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">early signs minor (itch, discharge, pain, swelling); females often asymptomatic; peak 15-24; complications PID, ectopy, infertility, cancer</text>';
    svg.innerHTML = m;
    readout(cell("infection", pick) + cell("curable?", ok ? "YES if early" : "NO (excepted)", ok ? "#34d399" : "#f87171") + cell("also spreads via", (pick === "HIV" || pick === "hepatitis-B") ? "needles/transfusion/mother" : "sexual (VD/RTI)", "#38bdf8"));
    verdict("<b>Exercises 10/12(b), Sec 3.4:</b> " + (ok ? "<b>" + pick + "</b> is in the curable set — with early detection + proper complete treatment." : "<b>" + pick + "</b> is in the <b>excepted trio (HIV, hepatitis-B, genital herpes)</b> — not completely curable.") + " Prevention: <b>(i)</b> avoid unknown/multiple partners; <b>(ii)</b> always <b>condoms</b>; <b>(iii)</b> qualified doctor early + full treatment.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["infertility-art"] = (function(){
  var tech = "IVF-ZIFT";
  var desc = {
    "IVF-ZIFT": "IVF outside body (test-tube baby); zygote/early embryos up to 8 blastomeres -> fallopian tube (ZIFT)",
    "IVF-IUT": "IVF outside body; embryos with MORE than 8 blastomeres -> uterus (IUT)",
    "GIFT": "donor ovum -> fallopian tube of female who cannot produce one but can carry",
    "ICSI": "sperm injected directly into ovum in laboratory",
    "AI-IUI": "semen (husband/healthy donor) -> vagina, or uterus (IUI); for non-insemination / very low counts",
    "ADOPT": "legal adoption: as yet one of the best methods (many orphaned children)"
  };
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Tube transfer (ZIFT/GIFT)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Uterus transfer (IUT)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Lab / adoption</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-zi">ZIFT vs IUT (8 rule)</button>' +
      '<button class="preset-btn" id="p-gi">GIFT / ICSI / AI</button>' +
      '<button class="preset-btn" id="p-ad">Ex 9/11: definition + adoption</button>';
    document.getElementById("p-zi").onclick = function(){ setActivePreset(this); tech="IVF-ZIFT"; var r=document.getElementById("ctrl-art"); if(r) r.value=tech; draw(App.state.t); };
    document.getElementById("p-gi").onclick = function(){ setActivePreset(this); tech="ICSI"; var r=document.getElementById("ctrl-art"); if(r) r.value=tech; draw(App.state.t); };
    document.getElementById("p-ad").onclick = function(){ setActivePreset(this); tech="ADOPT"; var r=document.getElementById("ctrl-art"); if(r) r.value=tech; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>ART</span><span class="val" id="ctrl-artv">IVF-ZIFT</span></div>' +
      '<select id="ctrl-art"><option value="IVF-ZIFT">IVF + ZIFT (&lt;=8 to tube)</option><option value="IVF-IUT">IVF + IUT (&gt;8 to uterus)</option><option value="GIFT">GIFT (donor ovum to tube)</option><option value="ICSI">ICSI (sperm into ovum)</option><option value="AI-IUI">AI / IUI (semen to vagina/uterus)</option><option value="ADOPT">legal adoption</option></select></div>' +
      '<div class="control-item"><div class="control-label"><span>Blastomeres</span><span class="val" id="ctrl-bl">4</span></div>' +
      '<input type="range" id="ctrl-bl-range" min="1" max="16" step="1" value="4"></div>';
    document.getElementById("ctrl-art").onchange = function(){ draw(App.state.t); };
    document.getElementById("ctrl-bl-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var sel = document.getElementById("ctrl-art");
    tech = sel ? sel.value : tech;
    if(!desc[tech]) tech = "IVF-ZIFT";
    var bl = Math.round(numEl("ctrl-bl-range", 4));
    var e1 = document.getElementById("ctrl-artv"); if(e1) e1.textContent = tech;
    var e2 = document.getElementById("ctrl-bl"); if(e2) e2.textContent = bl;
    var route = bl <= 8 ? "ZIFT -> fallopian tube" : "IUT -> uterus";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 3.5: infertility = no children despite unprotected cohabitation (summary: even after 2 yrs)</text>';
    m += '<rect x="40" y="50" width="180" height="120" rx="8" fill="#0f1f2e" stroke="#38bdf8"/>';
    m += '<text x="130" y="72" fill="#38bdf8" font-size="12" text-anchor="middle">LAB (IVF)</text>';
    m += '<circle cx="100" cy="110" r="10" fill="#f472b6"/><circle cx="160" cy="110" r="8" fill="#38bdf8"/>';
    m += '<text x="130" y="140" fill="#94a3b8" font-size="10" text-anchor="middle">ova wife/donor +</text>';
    m += '<text x="130" y="154" fill="#94a3b8" font-size="10" text-anchor="middle">sperms husband/donor</text>';
    m += '<rect x="260" y="50" width="180" height="120" rx="8" fill="#0f1f2e" stroke="#f59e0b"/>';
    m += '<text x="350" y="72" fill="#f59e0b" font-size="12" text-anchor="middle">EMBRYO (' + bl + ' cells)</text>';
    for(var i=0;i<Math.min(16,bl);i++){
      var bx = 290 + (i%4)*36, by = 95 + Math.floor(i/4)*22;
      m += '<circle cx="' + bx + '" cy="' + by + '" r="9" fill="#f59e0b" opacity="0.9"/>';
    }
    m += '<text x="350" y="158" fill="#e2e8f0" font-size="11" text-anchor="middle">' + route + '</text>';
    m += '<rect x="480" y="50" width="200" height="120" rx="8" fill="#0f1f2e" stroke="#34d399"/>';
    m += '<text x="580" y="72" fill="#34d399" font-size="12" text-anchor="middle">CHOICE: ' + tech + '</text>';
    m += '<text x="495" y="96" fill="#e2e8f0" font-size="10">' + desc[tech].slice(0,44) + '</text>';
    m += '<text x="495" y="112" fill="#e2e8f0" font-size="10">' + desc[tech].slice(44,88) + '</text>';
    m += '<text x="495" y="128" fill="#e2e8f0" font-size="10">' + desc[tech].slice(88,132) + '</text>';
    m += '<text x="495" y="150" fill="#94a3b8" font-size="10">precision + cost; few</text>';
    m += '<text x="495" y="164" fill="#94a3b8" font-size="10">centres; social factors</text>';
    m += '<rect x="40" y="185" width="640" height="95" rx="8" fill="#0f1f2e" stroke="#475569"/>';
    m += '<text x="360" y="207" fill="#e2e8f0" font-size="12" text-anchor="middle">causes: physical, congenital, diseases, drugs, immunological, psychological — often MALE partner</text>';
    m += '<text x="360" y="229" fill="#94a3b8" font-size="11" text-anchor="middle">GIFT: donor ovum to tube | ICSI: sperm into ovum | AI/IUI: semen to vagina/uterus (low counts)</text>';
    m += '<text x="360" y="249" fill="#94a3b8" font-size="11" text-anchor="middle">in-vivo embryos also transferable; clinics first correct treatable disorders</text>';
    m += '<text x="360" y="267" fill="#34d399" font-size="11" text-anchor="middle">Ex 11(b) FALSE: not always female; Ex 9 + legal adoption as best humane option</text>';
    svg.innerHTML = m;
    readout(cell("ART", tech, "#34d399") + cell("blastomeres", String(bl), "#f59e0b") + cell("book route", route) + cell("threshold", "2 yrs", "#38bdf8"));
    if(tech === "ADOPT") verdict("<b>Exercises 9/11, Sec 3.5:</b> India has many orphaned children — <b>legal adoption is as yet one of the best methods</b> for parenthood. Techniques need precision, cost, few centres; emotional/religious/social factors also deter ART.");
    else verdict("<b>Exercise 9/12(d), Sec 3.5:</b> " + desc[tech] + ". Slider at " + bl + " blastomeres -&gt; book route <b>" + route + "</b> (Ex 12d: embryos NOT always to uterus). Infertility often lies with the <b>male partner</b> — blaming only women is wrong (Ex 11b).");
  }
  return { mount: mount, draw: draw };
})();
