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

window.SIMS["levels-counts"] = (function(){
  var mode = "levels";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Genetic (Rauwolfia, rice)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Species (amphibians)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Ecological (biomes)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-lv">3 levels (Wilson)</button>' +
      '<button class="preset-btn" id="p-ct">Counters: 1.5M / 7M</button>' +
      '<button class="preset-btn" id="p-in">India 2.4% -&gt; 8.1%</button>';
    document.getElementById("p-lv").onclick = function(){ setActivePreset(this); mode="levels"; draw(App.state.t); };
    document.getElementById("p-ct").onclick = function(){ setActivePreset(this); mode="counts"; draw(App.state.t); };
    document.getElementById("p-in").onclick = function(){ setActivePreset(this); mode="india"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Discovery slider (described / M)</span><span class="val" id="ctrl-ds">1.50</span></div>' +
      '<input type="range" id="ctrl-ds-range" min="0.5" max="7" step="0.1" value="1.5"></div>';
    document.getElementById("ctrl-ds-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var dv = numEl("ctrl-ds-range", 1.5);
    var el = document.getElementById("ctrl-ds"); if(el) el.textContent = dv.toFixed(2);
    var pct = dv / 7 * 100;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "levels"){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Biodiversity (Wilson): genetic + species + ecological — macromolecules to biomes</text>';
      var boxes = [["genetic", "Rauwolfia reserpine;", "50,000 rice, 1000 mango", "#38bdf8"], ["species", "W. Ghats amphibians", "> E. Ghats", "#34d399"], ["ecological", "desert to alpine;", "India > Norway", "#f59e0b"]];
      for(var i=0;i<3;i++){
        var bx = 60 + i * 210;
        var bob = Math.sin(t * 2 + i) * 3;
        m += '<rect x="' + bx + '" y="' + (70 + bob).toFixed(0) + '" width="190" height="110" rx="8" fill="#0f1f2e" stroke="' + boxes[i][3] + '" stroke-width="2"/>';
        m += '<text x="' + (bx + 95) + '" y="' + (100 + bob).toFixed(0) + '" fill="' + boxes[i][3] + '" font-size="14" text-anchor="middle">' + boxes[i][0] + '</text>';
        m += '<text x="' + (bx + 95) + '" y="' + (126 + bob).toFixed(0) + '" fill="#e2e8f0" font-size="11" text-anchor="middle">' + boxes[i][1] + '</text>';
        m += '<text x="' + (bx + 95) + '" y="' + (144 + bob).toFixed(0) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + boxes[i][2] + '</text>';
      }
      m += '<text x="360" y="220" fill="#94a3b8" font-size="12" text-anchor="middle">Insects &gt;70% of animals: 7 of every 10 animals is an insect (Fig 13.1).</text>';
      m += '<text x="360" y="242" fill="#94a3b8" font-size="12" text-anchor="middle">Fungi &gt; fishes+amphibians+reptiles+mammals; prokaryotes uncounted (unculturable).</text>';
      m += '<text x="360" y="264" fill="#64748b" font-size="11" text-anchor="middle">20,000 ants, 3,00,000 beetles, 28,000 fishes, ~20,000 orchids set the tropical scale.</text>';
    } else if(mode === "counts"){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">IUCN 2004: &gt;1.5M described of ~7M (May) = ~22% recorded</text>';
      m += '<rect x="100" y="70" width="520" height="34" rx="6" fill="#0f1f2e" stroke="#334155"/>';
      m += '<rect x="100" y="70" width="' + (520 * pct / 100).toFixed(0) + '" height="34" rx="6" fill="#34d399"/>';
      m += '<text x="360" y="126" fill="#e2e8f0" font-size="14" text-anchor="middle">' + dv.toFixed(2) + 'M / 7M = ' + pct.toFixed(1) + '% recorded</text>';
      m += '<text x="360" y="152" fill="#94a3b8" font-size="12" text-anchor="middle">&gt;70% animals; plants &lt;=22% (Ex 9: animals ~72%, plants 22%)</text>';
      m += '<text x="360" y="176" fill="#94a3b8" font-size="12" text-anchor="middle">Extreme guesses 20-50M; May conservative ~7M (temperate-tropical insect ratio, Ex 2).</text>';
      m += '<text x="360" y="210" fill="#f87171" font-size="13" text-anchor="middle">Library burning before catalogued: extinction before discovery.</text>';
      m += '<text x="360" y="234" fill="#64748b" font-size="11" text-anchor="middle">Drag slider: at 1.5M the bar stops at ~21.4% (text rounds 22%).</text>';
    } else {
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">India: 2.4% of land, 8.1% of species — 1 of 12 mega-diversity countries</text>';
      m += '<rect x="120" y="80" width="200" height="60" rx="6" fill="#0f1f2e" stroke="#38bdf8"/><text x="220" y="104" fill="#38bdf8" font-size="13" text-anchor="middle">land 2.4%</text>';
      m += '<rect x="400" y="80" width="200" height="60" rx="6" fill="#0f2f3f" stroke="#34d399"/><text x="500" y="104" fill="#34d399" font-size="13" text-anchor="middle">species 8.1%</text>';
      m += '<text x="500" y="124" fill="#94a3b8" font-size="11" text-anchor="middle">x3.4 richer per area</text>';
      m += '<text x="360" y="180" fill="#e2e8f0" font-size="13" text-anchor="middle">45,000 plants + ~90,000 animals recorded; &gt;1,00,000 plants + &gt;3,00,000 animals await</text>';
      m += '<text x="360" y="204" fill="#94a3b8" font-size="12" text-anchor="middle">45,000/0.22 ~= 2,05,000 total plants; 90,000/0.22 ~= 4,09,000 animals.</text>';
    }
    svg.innerHTML = m;
    readout(cell("described", dv.toFixed(2) + "M / 7M") + cell("recorded", pct.toFixed(1) + "%", "#34d399") + cell("India land", "2.4%") + cell("India species", "8.1%", "#38bdf8"));
    if(mode === "india") verdict("<b>Section 13.1.1:</b> India holds <b>2.4% of land but 8.1% of species</b> (12 mega-diversity): <b>~45,000 plants + twice as many animals</b> recorded, yet <b>&gt;1,00,000 plants and &gt;3,00,000 animals</b> await discovery at 22% recorded.");
    else if(mode === "counts") verdict("<b>Section 13.1.1 / Exercises 2, 9:</b> <b>IUCN 2004 &gt;1.5M</b> described; <b>May ~7M</b> (temperate-tropical insect extrapolation); <b>1.5/7 ~= 21.4% ~= 22%</b> recorded. Animals ~72%, plants 22%; <b>7 of 10 animals = insects</b>.");
    else verdict("<b>Section 13.1 (Wilson) / Exercise 1:</b> <b>genetic</b> (Rauwolfia reserpine across Himalayan ranges; 50,000 rice, 1,000 mango), <b>species</b> (Western &gt; Eastern Ghats amphibians), <b>ecological</b> (India deserts-to-alpine vs Norway).");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["diversity"] = window.SIMS["levels-counts"];

window.SIMS["patterns-diversity"] = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>log S = log C + Z log A</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Latitudinal gradient</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-lo">Local Z = 0.15</button>' +
      '<button class="preset-btn" id="p-co">Continental Z = 1.15</button>' +
      '<button class="preset-btn" id="p-la">Latitude: Colombia-Greenland</button>';
    document.getElementById("p-lo").onclick = function(){ setActivePreset(this); var n=document.getElementById("ctrl-z-range"); if(n) n.value=0.15; draw(App.state.t); };
    document.getElementById("p-co").onclick = function(){ setActivePreset(this); var n=document.getElementById("ctrl-z-range"); if(n) n.value=1.15; draw(App.state.t); };
    document.getElementById("p-la").onclick = function(){ setActivePreset(this); draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Z slope (0.1-1.2)</span><span class="val" id="ctrl-z">0.15</span></div>' +
      '<input type="range" id="ctrl-z-range" min="0.1" max="1.2" step="0.01" value="0.15"></div>' +
      '<div class="control-item"><div class="control-label"><span>Area multiplier (A2/A1)</span><span class="val" id="ctrl-am">2</span></div>' +
      '<input type="range" id="ctrl-am-range" min="1" max="10" step="0.5" value="2"></div>';
    document.getElementById("ctrl-z-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-am-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var Z = numEl("ctrl-z-range", 0.15);
    var am = numEl("ctrl-am-range", 2);
    var a = document.getElementById("ctrl-z"); if(a) a.textContent = Z.toFixed(2);
    var b = document.getElementById("ctrl-am"); if(b) b.textContent = am;
    var mult = Math.pow(am, Z);
    function X(la){ return 80 + la / 3 * 520; }
    function Y(ls){ return 250 - (ls - 1) / 3 * 190; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="250" x2="620" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="50" stroke="#475569"/>';
    m += '<text x="350" y="30" fill="#94a3b8" font-size="13" text-anchor="middle">log S vs log A: straight line slope Z (rectangular hyperbola on raw scale)</text>';
    var d = "";
    for(var i=0;i<=40;i++){
      var la = i / 40 * 3;
      var ls = 1 + Z * la;
      d += (i === 0 ? "M " : "L ") + X(la).toFixed(1) + " " + Y(ls).toFixed(1) + " ";
    }
    m += '<path d="' + d + '" fill="none" stroke="#34d399" stroke-width="3"/>';
    var laNow = 1 + Math.sin(t) * 0.6 + 1;
    m += '<circle cx="' + X(laNow).toFixed(1) + '" cy="' + Y(1 + Z * laNow).toFixed(1) + '" r="6" fill="#38bdf8"/>';
    m += '<text x="450" y="80" fill="#e2e8f0" font-size="14">Z = ' + Z.toFixed(2) + '</text>';
    m += '<text x="450" y="104" fill="#34d399" font-size="14">x' + am + ' area -&gt; x' + mult.toFixed(2) + ' species</text>';
    m += '<text x="450" y="128" fill="#94a3b8" font-size="12">local 0.1-0.2; continent 0.6-1.2</text>';
    m += '<text x="450" y="148" fill="#94a3b8" font-size="12">frugivores 1.15 (Ex 4)</text>';
    m += '<text x="80" y="272" fill="#64748b" font-size="11" text-anchor="middle">Birds: Colombia ~1400, NY 105, Greenland 56; India &gt;1200. Amazon: 40k plants, 1300 birds, 2M insects pending.</text>';
    svg.innerHTML = m;
    readout(cell("Z", Z.toFixed(2), "#34d399") + cell("area x", "x" + am) + cell("species x", "x" + mult.toFixed(2), "#38bdf8") + cell("regime", Z < 0.6 ? "local" : "continental"));
    verdict("<b>Section 13.1.2 / Exercise 4:</b> S scales as A^Z, so doubling gives <b>2^Z</b>: local Z = 0.15 -&gt; <b>x1.11</b> (+11%); continental Z = 1.15 -&gt; <b>x2.22</b> (more than doubles — new realms add endemics). Tropics richer by <b>time + constancy + productivity</b> (3 hypotheses).");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["speciesarea"] = window.SIMS["patterns-diversity"];

window.SIMS["loss-evil-quartet"] = (function(){
  var idx = 0;
  var cases = [
    { name: "Amazon cleared for soya/beef", cat: 0, note: "rain forest 14% -&gt; 6%; 1000 ha per read" },
    { name: "Steller sea cow / passenger pigeon", cat: 1, note: "need turned to greed; marine over-harvest" },
    { name: "Nile perch vs 200+ cichlids", cat: 2, note: "Lake Victoria extermination" },
    { name: "Parthenium / Lantana / Eichhornia / Clarias", cat: 2, note: "India alien weeds + catfish" },
    { name: "Host fish + its parasites vanish", cat: 3, note: "obligate partners die together" },
    { name: "Dodo / quagga / thylacine / Bali tiger", cat: 0, note: "784 = 338 + 359 + 87 (Red List 2004)" }
  ];
  var qnames = ["habitat loss", "over-exploit", "alien invasion", "co-extinction"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Habitat loss (#1 cause)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Over-exploitation</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Alien invasion</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Co-extinction</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-q0">Amazon clearing</button>' +
      '<button class="preset-btn" id="p-q2">Nile perch</button>' +
      '<button class="preset-btn" id="p-q4">Host + parasite</button>' +
      '<button class="preset-btn" id="p-q5">Dodo ledger</button>';
    document.getElementById("p-q0").onclick = function(){ setActivePreset(this); idx=0; draw(App.state.t); };
    document.getElementById("p-q2").onclick = function(){ setActivePreset(this); idx=2; draw(App.state.t); };
    document.getElementById("p-q4").onclick = function(){ setActivePreset(this); idx=4; draw(App.state.t); };
    document.getElementById("p-q5").onclick = function(){ setActivePreset(this); idx=5; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Your sort (0-3)</span><span class="val" id="ctrl-g">0 habitat loss</span></div>' +
      '<input type="range" id="ctrl-g-range" min="0" max="3" step="1" value="0"></div>';
    document.getElementById("ctrl-g-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var g = Math.round(numEl("ctrl-g-range", 0));
    var el = document.getElementById("ctrl-g"); if(el) el.textContent = g + " " + qnames[g];
    var c = cases[idx];
    var right = (g === c.cat);
    var col = right ? "#34d399" : "#f87171";
    var qcols = ["#f87171", "#f59e0b", "#a78bfa", "#38bdf8"];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Evil Quartet sorter (Ex 5) | Sixth Extinction 100-1000x; ~50% at risk in 100 yr</text>';
    m += '<rect x="60" y="50" width="320" height="130" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="220" y="82" fill="#e2e8f0" font-size="13" text-anchor="middle">' + c.name + '</text>';
    m += '<text x="220" y="108" fill="#94a3b8" font-size="11" text-anchor="middle">' + c.note + '</text>';
    m += '<text x="220" y="140" fill="' + qcols[c.cat] + '" font-size="13" text-anchor="middle">key: ' + qnames[c.cat] + '</text>';
    for(var i=0;i<4;i++){
      m += '<text x="90" y="' + (200 + i * 20) + '" fill="' + (i === g ? '#fff' : '#64748b') + '" font-size="11">' + i + ': ' + qnames[i] + (i === g ? '  &lt; yours' : '') + '</text>';
    }
    m += '<rect x="410" y="50" width="250" height="130" rx="8" fill="#0f1f2e" stroke="' + col + '"/>';
    m += '<text x="535" y="100" fill="' + col + '" font-size="16" text-anchor="middle">' + (right ? "CORRECT" : "TRY AGAIN") + '</text>';
    m += '<circle cx="535" cy="140" r="' + (11 + 3 * Math.sin(t * 3)).toFixed(1) + '" fill="' + col + '"/>';
    m += '<text x="535" y="170" fill="#94a3b8" font-size="11" text-anchor="middle">key: ' + qnames[c.cat] + '</text>';
    m += '<text x="360" y="286" fill="#64748b" font-size="11" text-anchor="middle">Tilman: diverse plots steadier + more productive. Rivets: wing loss (key species) &gt; seat loss (Ex 6).</text>';
    svg.innerHTML = m;
    readout(cell("case", c.name.split(" /")[0].slice(0, 18)) + cell("yours", qnames[g]) + cell("key", qnames[c.cat], qcols[c.cat]) + cell("score", right ? "1/1" : "0/1", col));
    verdict("<b>Sections 13.1.3-13.1.4 / Exercises 5-6:</b> Quartet = <b>(i) habitat loss/fragmentation (#1)</b> + (ii) over-exploitation + (iii) alien invasion + (iv) co-extinction. Toll: <b>784 = 338 vertebrates + 359 invertebrates + 87 plants</b>; 15,500 threatened (12% birds, 23% mammals, 32% amphibians, 31% gymnosperms); dodo/quagga/thylacine/sea cow + Bali-Javan-Caspian tigers gone.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["evilquartet"] = window.SIMS["loss-evil-quartet"];

window.SIMS["why-conserve"] = (function(){
  var mode = "narrow";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Narrowly utilitarian (goods)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Broadly utilitarian (services)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Ethical (intrinsic duty)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-nr">Reserpine / drugs (narrow)</button>' +
      '<button class="preset-btn" id="p-br">Amazon O2 / bees (broad)</button>' +
      '<button class="preset-btn" id="p-et">Bulbul + duty (ethical)</button>';
    document.getElementById("p-nr").onclick = function(){ setActivePreset(this); mode="narrow"; draw(App.state.t); };
    document.getElementById("p-br").onclick = function(){ setActivePreset(this); mode="broad"; draw(App.state.t); };
    document.getElementById("p-et").onclick = function(){ setActivePreset(this); mode="ethical"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Drugs sampled (25% plant-derived)</span><span class="val" id="ctrl-dr">200</span></div>' +
      '<input type="range" id="ctrl-dr-range" min="40" max="400" step="20" value="200"></div>';
    document.getElementById("ctrl-dr-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var dr = numEl("ctrl-dr-range", 200);
    var el = document.getElementById("ctrl-dr"); if(el) el.textContent = dr;
    var plant = Math.round(dr * 0.25);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Why conserve (Ex 8): narrow + broad + ethical — price the cylinder, hear the bulbul</text>';
    var tabs = [["narrow", "direct goods", "#f59e0b"], ["broad", "free services", "#38bdf8"], ["ethical", "intrinsic value", "#a78bfa"]];
    for(var i=0;i<3;i++){
      var bx = 60 + i * 210;
      var on = (tabs[i][0] === mode);
      m += '<rect x="' + bx + '" y="50" width="190" height="90" rx="8" fill="' + (on ? '#1c1917' : '#0f1f2e') + '" stroke="' + tabs[i][2] + '" stroke-width="' + (on ? 3 : 1) + '"/>';
      m += '<text x="' + (bx + 95) + '" y="80" fill="' + tabs[i][2] + '" font-size="13" text-anchor="middle">' + tabs[i][0] + '</text>';
      m += '<text x="' + (bx + 95) + '" y="102" fill="#94a3b8" font-size="11" text-anchor="middle">' + tabs[i][1] + '</text>';
      m += '<text x="' + (bx + 95) + '" y="122" fill="#64748b" font-size="11" text-anchor="middle">' + (on ? '&lt; viewing' : '') + '</text>';
    }
    if(mode === "narrow"){
      m += '<text x="360" y="180" fill="#f59e0b" font-size="14" text-anchor="middle">' + dr + ' drugs sampled -&gt; ~' + plant + ' plant-derived (&gt;25%)</text>';
      m += '<text x="360" y="204" fill="#94a3b8" font-size="12" text-anchor="middle">25,000 species in traditional medicine; bioprospecting = dive for product molecules.</text>';
      m += '<text x="360" y="228" fill="#94a3b8" font-size="12" text-anchor="middle">Food, firewood, fibre, tannins, lubricants, dyes, resins, perfumes.</text>';
    } else if(mode === "broad"){
      var o2 = 20 + Math.sin(t * 2) * 1.5;
      m += '<text x="360" y="180" fill="#38bdf8" font-size="14" text-anchor="middle">Amazon exhales ~' + o2.toFixed(1) + '% of atmospheric O2 (hospital-cylinder test)</text>';
      m += '<text x="360" y="204" fill="#94a3b8" font-size="12" text-anchor="middle">Bees/birds/bats pollinate fruits + seeds; forests meter floods, hold soil (Ex 8).</text>';
      m += '<text x="360" y="228" fill="#94a3b8" font-size="12" text-anchor="middle">Roots bind, canopy slows runoff, litter traps silt — cover removed, rivers silt.</text>';
    } else {
      m += '<text x="360" y="180" fill="#a78bfa" font-size="14" text-anchor="middle">Bulbul song + spring flowers: priceless, no price tag fits</text>';
      m += '<text x="360" y="204" fill="#94a3b8" font-size="12" text-anchor="middle">Moral duty: pass the biological legacy in good order to future generations.</text>';
      m += '<text x="360" y="228" fill="#94a3b8" font-size="12" text-anchor="middle">Every species has intrinsic value beyond current economic use.</text>';
    }
    m += '<text x="360" y="262" fill="#64748b" font-size="11" text-anchor="middle">Rauwolfia reserpine links back: the narrow dividend priced from Lesson 1 chemistry.</text>';
    svg.innerHTML = m;
    readout(cell("lens", mode) + cell("plant drugs", "~" + plant + "/" + dr, "#f59e0b") + cell("Amazon O2", "~20%", "#38bdf8") + cell("traditional", "25,000 spp"));
    if(mode === "narrow") verdict("<b>Section 13.2.1 narrowly utilitarian:</b> <b>&gt;25% of drugs from plants</b> (" + plant + " of " + dr + "), <b>25,000 species</b> in traditional medicine; <b>bioprospecting</b> explores molecules/genes/species for economic products.");
    else if(mode === "broad") verdict("<b>Section 13.2.1 broadly utilitarian / Exercise 8:</b> Amazon <b>~20% of O2</b>; pollinators, flood/erosion control, pest control, climate moderation + <b>bulbul-song</b> aesthetics — free only while the providers live.");
    else verdict("<b>Section 13.2.1 ethical:</b> co-inhabitants hold <b>intrinsic value</b>; we bear a <b>moral duty</b> to care and bequeath the legacy intact — the argument no price tag can capture.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["whyconserve"] = window.SIMS["why-conserve"];

window.SIMS["how-conserve"] = (function(){
  var idx = 0;
  var cases = [
    { name: "Tiger reserve forest", insitu: true, note: "save the entire forest to save the tiger" },
    { name: "Khasi sacred grove orchids", insitu: true, note: "Meghalaya groves: last refuges" },
    { name: "Zoo-bred extinct-in-wild animal", insitu: false, note: "persists only in zoos" },
    { name: "Seed bank crop strains", insitu: false, note: "banks genes of commercial crops" },
    { name: "Cryopreserved gametes / IVF", insitu: false, note: "viable, fertile, long-term" },
    { name: "National park + sanctuary web", insitu: true, note: "14 reserves + 90 parks + 448 sanctuaries" }
  ];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>In situ (on site)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ex situ (off site)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Hotspots: 34 (3 in India)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-h0">Tiger forest</button>' +
      '<button class="preset-btn" id="p-h2">Zoo rescue</button>' +
      '<button class="preset-btn" id="p-h3">Seed bank</button>' +
      '<button class="preset-btn" id="p-hs">Hotspots + summits</button>';
    document.getElementById("p-h0").onclick = function(){ setActivePreset(this); idx=0; draw(App.state.t); };
    document.getElementById("p-h2").onclick = function(){ setActivePreset(this); idx=2; draw(App.state.t); };
    document.getElementById("p-h3").onclick = function(){ setActivePreset(this); idx=3; draw(App.state.t); };
    document.getElementById("p-hs").onclick = function(){ setActivePreset(this); idx=6; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Your match: in situ?</span><span class="val" id="ctrl-ie">in situ</span></div>' +
      '<input type="range" id="ctrl-ie-range" min="0" max="1" step="1" value="1"></div>';
    document.getElementById("ctrl-ie-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var g = Math.round(numEl("ctrl-ie-range", 1));
    var guess = g === 1;
    var ge = document.getElementById("ctrl-ie"); if(ge) ge.textContent = guess ? "in situ" : "ex situ";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(idx === 6){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">25 + 9 = 34 hotspots on &lt;2% land cut extinctions ~30% | Rio 1992 -&gt; Johannesburg 2002 (190) -&gt; 2010 pledge</text>';
      var spots = [["W. Ghats + Sri Lanka", "#34d399"], ["Indo-Burma", "#38bdf8"], ["Himalaya", "#f59e0b"]];
      for(var i=0;i<3;i++){
        var bx = 60 + i * 210;
        var bob = Math.sin(t * 2 + i) * 3;
        m += '<rect x="' + bx + '" y="' + (60 + bob).toFixed(0) + '" width="190" height="70" rx="8" fill="#0f1f2e" stroke="' + spots[i][1] + '" stroke-width="2"/>';
        m += '<text x="' + (bx + 95) + '" y="' + (90 + bob).toFixed(0) + '" fill="' + spots[i][1] + '" font-size="12" text-anchor="middle">' + spots[i][0] + '</text>';
        m += '<text x="' + (bx + 95) + '" y="' + (110 + bob).toFixed(0) + '" fill="#94a3b8" font-size="11" text-anchor="middle">India hotspot ' + (i + 1) + '/3</text>';
      }
      m += '<text x="360" y="170" fill="#e2e8f0" font-size="13" text-anchor="middle">34 hotspots: richness x endemism x threat; &lt;2% land buys ~30% less extinction</text>';
      m += '<text x="140" y="205" fill="#94a3b8" font-size="12">1992 Rio Earth Summit: conserve + sustainably use</text>';
      m += '<text x="140" y="229" fill="#94a3b8" font-size="12">2002 Johannesburg, 190 countries: cut loss by 2010</text>';
      m += '<text x="140" y="253" fill="#94a3b8" font-size="12">Groves (Ex 7): Khasi-Jaintia, Aravalli, W. Ghats, Sarguja-Chanda-Bastar</text>';
      m += '<text x="140" y="275" fill="#64748b" font-size="11" text-anchor="middle">Estate: 14 biosphere reserves + 90 national parks + 448 sanctuaries.</text>';
    } else {
      var c = cases[idx];
      var right = (guess === c.insitu);
      var col = right ? "#34d399" : "#f87171";
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">In situ = whole ecosystem persists | ex situ = urgent rescue outside habitat (endangered)</text>';
      m += '<rect x="60" y="50" width="320" height="130" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<text x="220" y="84" fill="#e2e8f0" font-size="14" text-anchor="middle">' + c.name + '</text>';
      m += '<text x="220" y="110" fill="#94a3b8" font-size="12" text-anchor="middle">' + c.note + '</text>';
      m += '<text x="220" y="142" fill="' + (c.insitu ? '#34d399' : '#38bdf8') + '" font-size="13" text-anchor="middle">key: ' + (c.insitu ? 'in situ' : 'ex situ') + '</text>';
      m += '<rect x="410" y="50" width="250" height="130" rx="8" fill="#0f1f2e" stroke="' + col + '"/>';
      m += '<text x="535" y="90" fill="#e2e8f0" font-size="13" text-anchor="middle">yours: ' + (guess ? 'in situ' : 'ex situ') + '</text>';
      m += '<text x="535" y="125" fill="' + col + '" font-size="16" text-anchor="middle">' + (right ? "CORRECT" : "TRY AGAIN") + '</text>';
      m += '<circle cx="535" cy="152" r="' + (11 + 3 * Math.sin(t * 3)).toFixed(1) + '" fill="' + col + '"/>';
      m += '<text x="360" y="215" fill="#94a3b8" font-size="12" text-anchor="middle">Ex situ kit: zoos, botanical gardens, safari parks + cryopreservation, IVF, tissue culture, seed banks.</text>';
      m += '<text x="360" y="239" fill="#94a3b8" font-size="12" text-anchor="middle">Threatened orchid in Meghalaya grove: defend grove in situ first, bank seeds ex situ as backup.</text>';
    }
    svg.innerHTML = m;
    if(idx === 6){
      readout(cell("hotspots", "34 (25+9)", "#f59e0b") + cell("in India", "3", "#34d399") + cell("land", "<2%") + cell("summits", "1992-2002-2010"));
      verdict("<b>Section 13.2.2 / Exercises 5, 7:</b> <b>25 + 9 = 34 hotspots</b> (richness + <b>endemism</b> + loss); <b>3 cover India: Western Ghats-Sri Lanka, Indo-Burma, Himalaya</b>. Estate: <b>14 + 90 + 448</b> + groves in <b>Khasi-Jaintia, Aravalli, W. Ghats, Sarguja-Chanda-Bastar</b>. <b>Rio 1992 -&gt; Johannesburg 2002 (190 countries) -&gt; 2010 pledge</b>.");
    } else {
      var cc = cases[idx];
      var rr = (guess === cc.insitu);
      readout(cell("case", cc.name.split(" ").slice(0, 2).join(" ")) + cell("yours", guess ? "in situ" : "ex situ") + cell("key", cc.insitu ? "in situ" : "ex situ", cc.insitu ? "#34d399" : "#38bdf8") + cell("score", rr ? "1/1" : "0/1", rr ? "#34d399" : "#f87171"));
      verdict("<b>Section 13.2.2 / Exercise 7:</b> <b>in situ</b> protects whole ecosystems and processes (<b>" + "we save the entire forest to save the tiger" + "</b>); <b>ex situ</b> (zoos, gardens, <b>cryopreservation, IVF, tissue culture, seed banks</b>) is urgent backup for <b>endangered/threatened</b> taxa.");
    }
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["conserve"] = window.SIMS["how-conserve"];
