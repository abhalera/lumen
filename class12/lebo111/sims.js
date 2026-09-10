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

window.SIMS["population-attributes"] = (function(){
  var shape = "expanding";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pre-reproductive (young)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Reproductive</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Post-reproductive (old)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-exp">Expanding (broad base)</button>' +
      '<button class="preset-btn" id="p-sta">Stable (even sides)</button>' +
      '<button class="preset-btn" id="p-dec">Declining (narrow base)</button>';
    document.getElementById("p-exp").onclick = function(){ setActivePreset(this); shape="expanding"; draw(App.state.t); };
    document.getElementById("p-sta").onclick = function(){ setActivePreset(this); shape="stable"; draw(App.state.t); };
    document.getElementById("p-dec").onclick = function(){ setActivePreset(this); shape="declining"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Young proportion / %</span><span class="val" id="ctrl-y">55</span></div>' +
      '<input type="range" id="ctrl-y-range" min="20" max="70" step="1" value="55"></div>';
    document.getElementById("ctrl-y-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var y = numEl("ctrl-y-range", 55);
    var el = document.getElementById("ctrl-y"); if(el) el.textContent = y;
    var young, mid, old;
    if(shape === "expanding"){ young = y; mid = 100 - y - 18; old = 18; }
    else if(shape === "stable"){ young = 40; mid = 38; old = 22; }
    else { young = 26; mid = 40; old = 34; }
    var w0 = 200;
    function barW(p){ return Math.max(24, p / 70 * w0); }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Figure 11.1 age pyramids: shape diagnoses growing / stable / declining</text>';
    var rows = [[young, "#38bdf8", "young"], [mid, "#f59e0b", "adult"], [old, "#94a3b8", "old"]];
    for(var i=0;i<3;i++){
      var ry = 60 + i * 56;
      var hw = barW(rows[i][0]);
      var wob = Math.sin(t * 2 + i) * 2;
      m += '<rect x="' + (360 - hw + wob) + '" y="' + ry + '" width="' + hw.toFixed(0) + '" height="40" fill="' + rows[i][1] + '" opacity="0.85"/>';
      m += '<rect x="360" y="' + ry + '" width="' + hw.toFixed(0) + '" height="40" fill="' + rows[i][1] + '" opacity="0.55"/>';
      m += '<text x="360" y="' + (ry + 26) + '" fill="#09131d" font-size="11" text-anchor="middle">' + rows[i][0].toFixed(0) + '%</text>';
      m += '<text x="120" y="' + (ry + 26) + '" fill="#94a3b8" font-size="11">' + rows[i][2] + '</text>';
    }
    m += '<line x1="360" y1="50" x2="360" y2="230" stroke="#475569"/>';
    m += '<text x="360" y="252" fill="#e2e8f0" font-size="13" text-anchor="middle">' + shape + ' pyramid</text>';
    m += '<text x="360" y="272" fill="#64748b" font-size="11" text-anchor="middle">Lotus birth 8/20 = 0.4/yr; fruitfly death 4/40 = 0.1/wk; Nt+1 = Nt + [(B+I)-(D+E)]</text>';
    svg.innerHTML = m;
    readout(cell("birth rate", "0.4 /lotus/yr", "#38bdf8") + cell("death rate", "0.1 /fly/wk", "#f59e0b") + cell("shape", shape, "#34d399") + cell("young", young.toFixed(0) + "%"));
    if(shape === "expanding") verdict("<b>Figure 11.1(a) / Exercise 1 (Section 11.1.1):</b> broad base, many young = <b>expanding</b>. Rates are per-capita population attributes — an individual lotus has a birth, only the pond has a birth <b>rate</b> (8/20 = 0.4).");
    else if(shape === "stable") verdict("<b>Figure 11.1(b) / Exercise 1:</b> even sides = <b>stable</b>. Density N spans &lt;10 Bharatpur cranes to millions of Chlamydomonas — count, weigh (biomass/cover) or trap (pug marks, catch per trap).");
    else verdict("<b>Figure 11.1(c) / Exercise 1:</b> narrow base, few young = <b>declining</b>. Sex ratio (60% female etc.) and pyramids belong to populations, never to one plant or fly.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["agepyramid"] = window.SIMS["population-attributes"];

window.SIMS["exponential-growth"] = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Nt = N0 e^rt (J-curve)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Time marker (scrubber)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-rat">Norway rat r=0.015</button>' +
      '<button class="preset-btn" id="p-bee">Flour beetle r=0.12</button>' +
      '<button class="preset-btn" id="p-ind">India 1981 r=0.0205</button>' +
      '<button class="preset-btn active" id="p-ex2">Exercise 2: r=0.231</button>';
    document.getElementById("p-rat").onclick = function(){ setActivePreset(this); var n=document.getElementById("ctrl-r-range"); if(n) n.value=0.015; draw(App.state.t); };
    document.getElementById("p-bee").onclick = function(){ setActivePreset(this); var n=document.getElementById("ctrl-r-range"); if(n) n.value=0.12; draw(App.state.t); };
    document.getElementById("p-ind").onclick = function(){ setActivePreset(this); var n=document.getElementById("ctrl-r-range"); if(n) n.value=0.0205; draw(App.state.t); };
    document.getElementById("p-ex2").onclick = function(){ setActivePreset(this); var n=document.getElementById("ctrl-r-range"); if(n) n.value=0.231; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>r (intrinsic rate) / yr</span><span class="val" id="ctrl-r">0.231</span></div>' +
      '<input type="range" id="ctrl-r-range" min="0" max="0.5" step="0.001" value="0.231"></div>' +
      '<div class="control-item"><div class="control-label"><span>N0</span><span class="val" id="ctrl-n0">100</span></div>' +
      '<input type="range" id="ctrl-n0-range" min="10" max="500" step="10" value="100"></div>';
    document.getElementById("ctrl-r-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-n0-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var r = numEl("ctrl-r-range", 0.231);
    var n0 = numEl("ctrl-n0-range", 100);
    var a = document.getElementById("ctrl-r"); if(a) a.textContent = r.toFixed(3);
    var b = document.getElementById("ctrl-n0"); if(b) b.textContent = n0;
    var T = 10;
    function X(tt){ return 80 + tt / T * 520; }
    var nmax = n0 * Math.exp(r * T);
    function Y(n){ return 250 - (n / nmax) * 190; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="250" x2="620" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="50" stroke="#475569"/>';
    m += '<text x="350" y="30" fill="#94a3b8" font-size="13" text-anchor="middle">dN/dt = rN, Nt = N0 e^rt, e = 2.71828 (Fig 11.3a J-curve)</text>';
    var d = "";
    for(var i=0;i<=60;i++){
      var tt = i / 60 * T;
      var nn = n0 * Math.exp(r * tt);
      d += (i === 0 ? "M " : "L ") + X(tt).toFixed(1) + " " + Y(nn).toFixed(1) + " ";
    }
    m += '<path d="' + d + '" fill="none" stroke="#34d399" stroke-width="3"/>';
    var tm = Math.min(T, t);
    var nm = n0 * Math.exp(r * tm);
    m += '<circle cx="' + X(tm).toFixed(1) + '" cy="' + Y(nm).toFixed(1) + '" r="6" fill="#38bdf8"/>';
    var n6 = n0 * Math.exp(r * 6);
    m += '<text x="450" y="80" fill="#e2e8f0" font-size="13">r = ' + r.toFixed(3) + ' /yr (b - d)</text>';
    m += '<text x="450" y="104" fill="#34d399" font-size="13">N(6 yr) = ' + n6.toFixed(0) + '</text>';
    m += '<text x="450" y="128" fill="#94a3b8" font-size="12">double in ' + (r > 0 ? (0.6931 / r).toFixed(1) + ' yr' : '--') + '</text>';
    svg.innerHTML = m;
    readout(cell("r", r.toFixed(3) + " /yr", "#34d399") + cell("N0", String(n0)) + cell("N(t=6)", n6.toFixed(0)) + cell("doubling", r > 0 ? (0.6931 / r).toFixed(1) + " yr" : "--", "#38bdf8"));
    verdict("<b>Section 11.1.2 / Exercise 2:</b> 2 = e^(3r) gives <b>r = ln2/3 = 0.231/yr</b> (doubling in 3 yr); at r = 0.231, N0 = 100 reaches <b>400 in 6 yr</b> (two doublings). Norway rat 0.015, flour beetle 0.12, India 1981 0.0205 — drag r to feel the J.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["exponential"] = window.SIMS["exponential-growth"];

window.SIMS["logistic-lifehistory"] = (function(){
  var strat = "many";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Sigmoid N-t (lag-accel-decel-K)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Carrying capacity K</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-mny">Many small (oysters)</button>' +
      '<button class="preset-btn" id="p-few">Few large (birds)</button>' +
      '<button class="preset-btn" id="p-once">Breed once (salmon/bamboo)</button>';
    document.getElementById("p-mny").onclick = function(){ setActivePreset(this); strat="many"; draw(App.state.t); };
    document.getElementById("p-few").onclick = function(){ setActivePreset(this); strat="few"; draw(App.state.t); };
    document.getElementById("p-once").onclick = function(){ setActivePreset(this); strat="once"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>K (carrying capacity)</span><span class="val" id="ctrl-k">200</span></div>' +
      '<input type="range" id="ctrl-k-range" min="50" max="400" step="10" value="200"></div>' +
      '<div class="control-item"><div class="control-label"><span>r / yr</span><span class="val" id="ctrl-r2">0.20</span></div>' +
      '<input type="range" id="ctrl-r2-range" min="0.05" max="0.5" step="0.01" value="0.2"></div>';
    document.getElementById("ctrl-k-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-r2-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var K = numEl("ctrl-k-range", 200);
    var r = numEl("ctrl-r2-range", 0.2);
    var a = document.getElementById("ctrl-k"); if(a) a.textContent = K;
    var c = document.getElementById("ctrl-r2"); if(c) c.textContent = r.toFixed(2);
    var N0 = 10, T = 30;
    function N(tt){ return K / (1 + ((K - N0) / N0) * Math.exp(-r * tt)); }
    function X(tt){ return 80 + tt / T * 420; }
    function Y(n){ return 250 - (n / 420) * 190; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="250" x2="520" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="50" stroke="#475569"/>';
    m += '<text x="300" y="30" fill="#94a3b8" font-size="13" text-anchor="middle">Verhulst-Pearl: dN/dt = rN(K-N)/K (Fig 11.3b)</text>';
    var d = "";
    for(var i=0;i<=80;i++){ var tt = i / 80 * T; d += (i === 0 ? "M " : "L ") + X(tt).toFixed(1) + " " + Y(N(tt)).toFixed(1) + " "; }
    m += '<path d="' + d + '" fill="none" stroke="#34d399" stroke-width="3"/>';
    m += '<line x1="80" y1="' + Y(K).toFixed(1) + '" x2="520" y2="' + Y(K).toFixed(1) + '" stroke="#f87171" stroke-width="2" stroke-dasharray="6 4"/>';
    m += '<text x="528" y="' + (Y(K) + 4).toFixed(0) + '" fill="#f87171" font-size="12">K=' + K + '</text>';
    var tm = Math.min(T, t * 5);
    m += '<circle cx="' + X(tm).toFixed(1) + '" cy="' + Y(N(tm)).toFixed(1) + '" r="6" fill="#38bdf8"/>';
    var half = K / 2;
    m += '<text x="560" y="110" fill="#e2e8f0" font-size="12">fastest at</text>';
    m += '<text x="560" y="130" fill="#34d399" font-size="13">N=K/2=' + half.toFixed(0) + '</text>';
    var sname = strat === "many" ? "many small: oysters" : (strat === "few" ? "few large: birds" : "once: salmon/bamboo");
    m += '<text x="560" y="170" fill="#94a3b8" font-size="12">' + sname + '</text>';
    m += '<text x="560" y="190" fill="#64748b" font-size="11">fitness = high r</text>';
    svg.innerHTML = m;
    var dndt = r * 50 * (K - 50) / K;
    readout(cell("K", String(K), "#f87171") + cell("max at", "K/2=" + half.toFixed(0)) + cell("dN/dt N=50", dndt.toFixed(1) + "/yr", "#34d399") + cell("strategy", sname));
    verdict("<b>Section 11.1.2-11.1.3 / Exercise 8:</b> sigmoid <b>lag-acceleration-deceleration-asymptote (N=K, dN/dt=0)</b>; N&lt;&lt;K grows ~exponentially; fastest at <b>K/2</b>. Life history maximises r: breed <b>once (salmon, bamboo)</b> vs many times; <b>many small (oysters)</b> vs <b>few large (birds, mammals)</b>.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["logistic"] = window.SIMS["logistic-lifehistory"];

window.SIMS["mutualism-competition"] = (function(){
  var idx = 0;
  var cases = [
    { name: "Lichen (fungus + alga)", a: 1, b: 1, note: "both gain: +/+" },
    { name: "Mycorrhiza (fungus + root)", a: 1, b: 1, note: "nutrients for carbohydrates" },
    { name: "Fig + wasp (Fig 11.4)", a: 1, b: 1, note: "pollination for seeds/oviposition" },
    { name: "Flamingo vs fish (zooplankton)", a: -1, b: -1, note: "both lose: -/-" },
    { name: "Balanus vs Chathamalus", a: -1, b: -1, note: "superior excludes intertidal" },
    { name: "Warblers partitioned (MacArthur)", a: -1, b: -1, note: "co-exist by foraging time" }
  ];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>+ benefit</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>- harm</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>0 neutral</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-m0">Lichen</button>' +
      '<button class="preset-btn" id="p-m2">Fig-wasp</button>' +
      '<button class="preset-btn" id="p-m3">Flamingo-fish</button>' +
      '<button class="preset-btn" id="p-m5">Warblers</button>';
    document.getElementById("p-m0").onclick = function(){ setActivePreset(this); idx=0; draw(App.state.t); };
    document.getElementById("p-m2").onclick = function(){ setActivePreset(this); idx=2; draw(App.state.t); };
    document.getElementById("p-m3").onclick = function(){ setActivePreset(this); idx=3; draw(App.state.t); };
    document.getElementById("p-m5").onclick = function(){ setActivePreset(this); idx=5; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Your sign: species A</span><span class="val" id="ctrl-a">+</span></div>' +
      '<input type="range" id="ctrl-a-range" min="-1" max="1" step="1" value="1"></div>' +
      '<div class="control-item"><div class="control-label"><span>Your sign: species B</span><span class="val" id="ctrl-b">+</span></div>' +
      '<input type="range" id="ctrl-b-range" min="-1" max="1" step="1" value="1"></div>';
    document.getElementById("ctrl-a-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-b-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function sign(x){ return x > 0 ? "+" : (x < 0 ? "-" : "0"); }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var ga = Math.round(numEl("ctrl-a-range", 1));
    var gb = Math.round(numEl("ctrl-b-range", 1));
    var ea = document.getElementById("ctrl-a"); if(ea) ea.textContent = sign(ga);
    var eb = document.getElementById("ctrl-b"); if(eb) eb.textContent = sign(gb);
    var c = cases[idx];
    var right = (ga === c.a && gb === c.b);
    var col = right ? "#34d399" : "#f87171";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Table 11.1 sorter: mutualism +/+ vs competition -/- (Ophrys-bee co-evolves too)</text>';
    m += '<rect x="60" y="60" width="300" height="130" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="210" y="90" fill="#e2e8f0" font-size="14" text-anchor="middle">' + c.name + '</text>';
    m += '<text x="210" y="116" fill="#94a3b8" font-size="12" text-anchor="middle">' + c.note + '</text>';
    m += '<text x="210" y="150" fill="' + col + '" font-size="16" text-anchor="middle">key: ' + sign(c.a) + " / " + sign(c.b) + '</text>';
    m += '<rect x="400" y="60" width="260" height="130" rx="8" fill="#0f1f2e" stroke="' + col + '"/>';
    m += '<text x="530" y="90" fill="#e2e8f0" font-size="13" text-anchor="middle">your sort: ' + sign(ga) + " / " + sign(gb) + '</text>';
    m += '<text x="530" y="130" fill="' + col + '" font-size="16" text-anchor="middle">' + (right ? "CORRECT" : "TRY AGAIN") + '</text>';
    m += '<circle cx="530" cy="160" r="' + (12 + 4 * Math.sin(t * 3)).toFixed(1) + '" fill="' + col + '"/>';
    m += '<text x="360" y="230" fill="#94a3b8" font-size="12" text-anchor="middle">Gause exclusion when resources limit; release on removal (Abingdon goat-tortoise); warblers partition.</text>';
    m += '<text x="360" y="252" fill="#64748b" font-size="11" text-anchor="middle">Slider -1 = harm, 0 = neutral, +1 = benefit. Interference cuts feeding even when food is plenty.</text>';
    svg.innerHTML = m;
    readout(cell("case", c.name.split(" (")[0]) + cell("your A/B", sign(ga) + "/" + sign(gb)) + cell("key", sign(c.a) + "/" + sign(c.b), col) + cell("score", right ? "1/1" : "0/1", col));
    verdict("<b>Table 11.1 / Exercise 7(d)-(e) (Section 11.1.4):</b> <b>mutualism +/+</b> (lichen, mycorrhiza, fig-wasp: wasp lays in fruit, feeds larvae on seeds) vs <b>competition -/-</b> (fitness r falls for both). <b>Gause</b>: same limiting resources -&gt; inferior eliminated; <b>MacArthur warblers</b> co-exist by different foraging time/pattern.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["interactions"] = window.SIMS["mutualism-competition"];

window.SIMS["predation-parasitism"] = (function(){
  var mode = "pisaster";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Predator / parasite (+)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Prey / host (-)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pi">Pisaster keystone</button>' +
      '<button class="preset-btn" id="p-op">Opuntia biocontrol</button>' +
      '<button class="preset-btn" id="p-pa">Cuscuta / koel parasites</button>';
    document.getElementById("p-pi").onclick = function(){ setActivePreset(this); mode="pisaster"; draw(App.state.t); };
    document.getElementById("p-op").onclick = function(){ setActivePreset(this); mode="opuntia"; draw(App.state.t); };
    document.getElementById("p-pa").onclick = function(){ setActivePreset(this); mode="parasite"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Timeline step</span><span class="val" id="ctrl-ps">4</span></div>' +
      '<input type="range" id="ctrl-ps-range" min="0" max="4" step="1" value="4"></div>';
    document.getElementById("ctrl-ps-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = Math.round(numEl("ctrl-ps-range", 4));
    var el = document.getElementById("ctrl-ps"); if(el) el.textContent = st;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "pisaster"){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Pisaster removal: predators hold prey in check and keep diversity (+/-)</text>';
      for(var i=0;i<10;i++){
        var alive = (st < 3) || (i < 10 - (st - 2) * 4);
        var px = 100 + (i % 5) * 90, py = 90 + Math.floor(i / 5) * 60;
        m += '<circle cx="' + px + '" cy="' + (py + Math.sin(t * 2 + i) * 2).toFixed(1) + '" r="18" fill="' + (alive ? '#164e63' : '#1f2937') + '" stroke="' + (alive ? '#38bdf8' : '#475569') + '"/>';
        if(!alive) m += '<line x1="' + (px - 12) + '" y1="' + (py - 12) + '" x2="' + (px + 12) + '" y2="' + (py + 12) + '" stroke="#f87171" stroke-width="3"/>';
      }
      m += '<text x="540" y="110" fill="#f87171" font-size="14">starfish removed</text>';
      m += '<text x="540" y="134" fill="#e2e8f0" font-size="13">' + (st >= 3 ? '10+ species extinct/yr' : 'diversity held') + '</text>';
      m += '<text x="540" y="158" fill="#94a3b8" font-size="12">step ' + st + '/4</text>';
    } else if(mode === "opuntia"){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Opuntia 1920s Australia: millions of ha -&gt; cactus moth saves rangeland</text>';
      var cover = Math.max(8, 200 - st * 46);
      m += '<rect x="80" y="80" width="' + cover.toFixed(0) + '" height="120" fill="#166534" opacity="0.8"/>';
      var mx = 420 + Math.sin(t * 2) * 8;
      m += '<ellipse cx="' + mx.toFixed(0) + '" cy="140" rx="30" ry="18" fill="#f59e0b"/>';
      m += '<text x="420" y="230" fill="#e2e8f0" font-size="13" text-anchor="middle">cactus area shrinks as moth step rises (' + st + '/4)</text>';
    } else {
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Parasites (+/-): ecto lice/Cuscuta, endo liver fluke, brood koel-crow</text>';
      m += '<rect x="80" y="70" width="160" height="90" rx="8" fill="#0f1f2e" stroke="#38bdf8"/><text x="160" y="100" fill="#38bdf8" font-size="12" text-anchor="middle">Cuscuta on hedge</text><text x="160" y="122" fill="#94a3b8" font-size="11" text-anchor="middle">ecto: sucks host</text>';
      m += '<rect x="280" y="70" width="160" height="90" rx="8" fill="#0f1f2e" stroke="#f87171"/><text x="360" y="100" fill="#f87171" font-size="12" text-anchor="middle">liver fluke</text><text x="360" y="122" fill="#94a3b8" font-size="11" text-anchor="middle">endo: snail+fish</text>';
      m += '<rect x="480" y="70" width="160" height="90" rx="8" fill="#0f1f2e" stroke="#f59e0b"/><text x="560" y="100" fill="#f59e0b" font-size="12" text-anchor="middle">koel in crow nest</text><text x="560" y="122" fill="#94a3b8" font-size="11" text-anchor="middle">brood: egg mimic</text>';
      m += '<text x="360" y="200" fill="#94a3b8" font-size="12" text-anchor="middle">Female mosquito (blood for eggs) is NOT a parasite — no lodging. Lice/ticks/copepods are.</text>';
    }
    m += '<text x="360" y="266" fill="#64748b" font-size="11" text-anchor="middle">Sparrow = predator on seeds AND insects; herbivores are predators ecologically. Prudent predators persist.</text>';
    svg.innerHTML = m;
    readout(cell("system", mode) + cell("step", st + "/4") + cell("sign", "+/-", "#f87171") + cell("result", mode === "pisaster" ? (st >= 3 ? "10+ extinct" : "diverse") : (mode === "opuntia" ? "biocontrol" : "host harmed")));
    if(mode === "pisaster") verdict("<b>Section 11.1.4(i) (+/-):</b> removing <b>Pisaster</b> let <b>10+ invertebrate species vanish within a year</b> — predators maintain diversity by cutting prey competition. Without them, dominants exclude the rest.");
    else if(mode === "opuntia") verdict("<b>Section 11.1.4 / Exercise 5:</b> <b>Opuntia</b> covered <b>millions of hectares</b> (1920s Australia) until its <b>cactus-feeding moth</b> controlled it — the template for <b>biological control: predators regulate prey</b>.");
    else verdict("<b>Table 11.1 / Exercise 9(d):</b> parasitism = <b>one benefits, other is affected (+/-)</b>. <b>Cuscuta</b> (no chlorophyll) on hedge = ecto; liver fluke/malaria = endo with vectors; <b>koel-crow eggs match in size/colour</b> = brood parasitism.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["predation"] = window.SIMS["predation-parasitism"];

window.SIMS["commensalism-defenses"] = (function(){
  var idx = 0;
  var cases = [
    { name: "Orchid on mango (Ex 4)", cat: "commensal +/0", opts: ["commensal +/0", "parasite +/-", "mutual +/+"] },
    { name: "Barnacles on whale", cat: "commensal +/0", opts: ["commensal +/0", "competition -/-", "parasite +/-"] },
    { name: "Egret + cattle / clownfish + anemone", cat: "commensal +/0", opts: ["commensal +/0", "mutual +/+", "amensal -/0"] },
    { name: "Penicillium vs Staphylococcus", cat: "amensal -/0", opts: ["amensal -/0", "commensal +/0", "parasite +/-"] },
    { name: "Acacia thorns / Calotropis glycosides", cat: "plant defense", opts: ["plant defense", "camouflage", "mutual +/+"] },
    { name: "Monarch distasteful / frog camouflage", cat: "animal defense", opts: ["animal defense", "amensal -/0", "competition -/-"] }
  ];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Commensal +/0</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Amensal -/0</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Defense (thorns/poison/camo)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-d0">Orchid/mango</button>' +
      '<button class="preset-btn" id="p-d3">Penicillium</button>' +
      '<button class="preset-btn" id="p-d4">Calotropis</button>' +
      '<button class="preset-btn" id="p-d5">Monarch</button>';
    document.getElementById("p-d0").onclick = function(){ setActivePreset(this); idx=0; draw(App.state.t); };
    document.getElementById("p-d3").onclick = function(){ setActivePreset(this); idx=3; draw(App.state.t); };
    document.getElementById("p-d4").onclick = function(){ setActivePreset(this); idx=4; draw(App.state.t); };
    document.getElementById("p-d5").onclick = function(){ setActivePreset(this); idx=5; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Your match (option #)</span><span class="val" id="ctrl-g">0</span></div>' +
      '<input type="range" id="ctrl-g-range" min="0" max="2" step="1" value="0"></div>';
    document.getElementById("ctrl-g-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var g = Math.round(numEl("ctrl-g-range", 0));
    var el = document.getElementById("ctrl-g"); if(el) el.textContent = g;
    var c = cases[idx];
    var right = (c.opts[g] === c.cat);
    var col = right ? "#34d399" : "#f87171";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Defense matcher: orchid (no feeding) is NOT Cuscuta (feeds); 25% insects phytophagous</text>';
    m += '<rect x="60" y="50" width="320" height="120" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="220" y="82" fill="#e2e8f0" font-size="14" text-anchor="middle">' + c.name + '</text>';
    for(var i=0;i<3;i++){
      m += '<text x="100" y="' + (110 + i * 22) + '" fill="' + (i === g ? '#fff' : '#94a3b8') + '" font-size="12">' + i + ': ' + c.opts[i] + (i === g ? '  &lt; yours' : '') + '</text>';
    }
    m += '<rect x="410" y="50" width="250" height="120" rx="8" fill="#0f1f2e" stroke="' + col + '"/>';
    m += '<text x="535" y="95" fill="' + col + '" font-size="15" text-anchor="middle">' + (right ? "CORRECT" : "TRY AGAIN") + '</text>';
    m += '<text x="535" y="120" fill="#94a3b8" font-size="11" text-anchor="middle">key: ' + c.cat + '</text>';
    m += '<circle cx="535" cy="145" r="' + (11 + 3 * Math.sin(t * 3)).toFixed(1) + '" fill="' + col + '"/>';
    m += '<text x="360" y="205" fill="#94a3b8" font-size="12" text-anchor="middle">Thorns (Acacia, Cactus); cardiac glycosides (Calotropis); nicotine, caffeine, quinine, strychnine, opium.</text>';
    m += '<text x="360" y="229" fill="#94a3b8" font-size="12" text-anchor="middle">Monarch: poisonous-weed caterpillar -&gt; distasteful adult. Camouflage: insects, frogs hide.</text>';
    svg.innerHTML = m;
    readout(cell("case", c.name.split(" (")[0]) + cell("yours", c.opts[g]) + cell("key", c.cat, col) + cell("score", right ? "1/1" : "0/1", col));
    verdict("<b>Table 11.1 / Exercises 3, 4, 7 (Section 11.1.4):</b> orchid-on-mango = <b>commensalism (+/0)</b> — support only, mango unmoved (not Cuscuta +/- feeding, not mycorrhiza +/+). <b>Amensalism (-/0): Penicillium/Staphylococcus.</b> Defenses: <b>thorns + cardiac glycosides + alkaloids + camouflage</b>.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["defenses"] = window.SIMS["commensalism-defenses"];
