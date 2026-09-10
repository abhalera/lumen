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

window.SIMS["origin-miller"] = (function(){
  var spark = true;
  var o2 = false;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Reducing gases CH4 / NH3 / H2 / H2O</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Spark discharge</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Amino-acid product</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-red">1953 reducing flask</button>' +
      '<button class="preset-btn" id="p-oxy">Oxygen-rich (prediction test)</button>';
    document.getElementById("p-red").onclick = function(){ setActivePreset(this); o2 = false; spark = true; var r = document.getElementById("ctrl-sp-range"); if(r) r.value = 1; draw(App.state.t); };
    document.getElementById("p-oxy").onclick = function(){ setActivePreset(this); o2 = true; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Spark</span><span class="val" id="ctrl-sp">on</span></div>' +
      '<input type="range" id="ctrl-sp-range" min="0" max="1" step="1" value="1"></div>' +
      '<div class="control-item"><div class="control-label"><span>Heating / vapour</span><span class="val" id="ctrl-ht">high</span></div>' +
      '<input type="range" id="ctrl-ht-range" min="0" max="100" step="1" value="80"></div>';
    document.getElementById("ctrl-sp-range").oninput = function(){ spark = numEl("ctrl-sp-range", 1) === 1; draw(App.state.t); };
    document.getElementById("ctrl-ht-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    spark = numEl("ctrl-sp-range", spark ? 1 : 0) === 1;
    var heat = numEl("ctrl-ht-range", 80);
    var sp = document.getElementById("ctrl-sp"); if(sp) sp.textContent = spark ? "on" : "off";
    var ht = document.getElementById("ctrl-ht"); if(ht) ht.textContent = heat >= 60 ? "high" : (heat >= 30 ? "low" : "cold");
    var gases = o2 ? ["O2", "N2", "CO2", "H2O"] : ["CH4", "H2", "NH3", "H2O vapour"];
    var yieldPct = 0;
    if(spark && heat >= 30 && !o2) yieldPct = Math.min(100, Math.round(heat * 0.9 + 10 + Math.sin(t * 2) * 3));
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Miller 1953 (Fig. 6.1): discharge in closed flask -&gt; amino acids</text>';
    m += '<rect x="90" y="70" width="220" height="160" rx="40" fill="#0f1f2e" stroke="#334155"/>';
    m += '<rect x="110" y="180" width="180" height="40" fill="#164e63"/>';
    var i, bx, by;
    for(i = 0; i < 10; i++){
      bx = 120 + (i * 53 + Math.floor(t * 30)) % 160;
      by = 100 + (i * 29 + Math.floor(t * 22)) % 80;
      m += '<circle cx="' + bx + '" cy="' + by + '" r="4" fill="#38bdf8" opacity="0.9"/>';
    }
    if(spark && !o2){
      var jx = 200 + Math.sin(t * 9) * 8;
      m += '<polyline points="200,80 ' + jx + ',120 200,150 215,180" fill="none" stroke="#f59e0b" stroke-width="3"/>';
    }
    m += '<text x="200" y="255" fill="#38bdf8" font-size="12" text-anchor="middle">' + gases.join(" + ") + '</text>';
    m += '<rect x="400" y="70" width="230" height="160" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="515" y="95" fill="#e2e8f0" font-size="13" text-anchor="middle">collection: amino acids</text>';
    var h = Math.round(yieldPct / 100 * 90);
    m += '<rect x="430" y="' + (200 - h) + '" width="170" height="' + h + '" fill="#064e3b"/>';
    m += '<text x="515" y="220" fill="#34d399" font-size="16" text-anchor="middle">' + yieldPct + '% yield</text>';
    m += '<text x="515" y="248" fill="#94a3b8" font-size="11" text-anchor="middle">earth 4.5 bya; life ~4.0 bya; cells ~2000 mya</text>';
    svg.innerHTML = m;
    readout(cell("flask", o2 ? "O2-rich" : "CH4/H2/NH3/H2O", o2 ? "#f87171" : "#38bdf8") + cell("spark", spark ? "on" : "off", "#f59e0b") + cell("amino acids", yieldPct + "%", "#34d399"));
    if(o2) verdict("<b>Section 6.1 prediction:</b> an oxygen-rich modern atmosphere gives <b>no comparable yield</b> — Miller needs the <b>reducing CH4/H2/NH3/H2O</b> mixture plus discharge. Pasteur kills spontaneous generation; Oparin-Haldane needs reducing chemistry.");
    else if(!spark) verdict("<b>Fig. 6.1:</b> switch the spark on — without <b>electric discharge</b> (lightning/volcanic storms) even the right gases give nothing. Others got sugars, bases, pigments, fats in repeats.");
    else verdict("<b>Section 6.1 (Miller 1953):</b> discharge through <b>CH4 + H2 + NH3 + water vapour</b> forms <b>amino acids</b> — chemical evolution in a flask. Non-cellular giants ~3 bya; first cells ~2000 mya, all in water.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["theories-evidences"] = (function(){
  var item = 0;
  var names = ["forelimb: whale/bat/cheetah/human", "wings: butterfly vs bird", "eye: octopus vs mammal", "flipper: penguin vs dolphin", "tuber: sweet potato vs potato", "thorn: Bougainvillea vs tendril: Cucurbita"];
  var kind = ["H", "A", "A", "A", "A", "H"];
  var why = [
    "same bones humerus/radius/ulna/carpals/metacarpals/phalanges, different functions",
    "similar flight, not anatomically similar structures",
    "similar vision, different structures",
    "similar swimming, different structures",
    "root vs stem modification, same storage job",
    "same plant-organ origin (homology in plants)"
  ];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Homologous = divergent, common ancestry</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Analogous = convergent, same habitat job</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-h">Homology set</button>' +
      '<button class="preset-btn" id="p-a">Analogy set</button>' +
      '<button class="preset-btn" id="p-m">Moth melanism 1850s-1920</button>';
    document.getElementById("p-h").onclick = function(){ setActivePreset(this); item = 0; draw(App.state.t); };
    document.getElementById("p-a").onclick = function(){ setActivePreset(this); item = 1; draw(App.state.t); };
    document.getElementById("p-m").onclick = function(){ setActivePreset(this); item = -1; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Specimen</span><span class="val" id="ctrl-i">1 / 6</span></div>' +
      '<input type="range" id="ctrl-i-range" min="0" max="5" step="1" value="0"></div>' +
      '<div class="control-item"><div class="control-label"><span>Your call</span><span class="val">?</span></div>' +
      '<div><button class="preset-btn" id="b-hom">Homologous</button> <button class="preset-btn" id="b-ana">Analogous</button></div></div>';
    document.getElementById("ctrl-i-range").oninput = function(){ item = numEl("ctrl-i-range", 0); draw(App.state.t); };
    document.getElementById("b-hom").onclick = function(){ judge("H"); };
    document.getElementById("b-ana").onclick = function(){ judge("A"); };
    draw(0);
  }
  function judge(g){
    var ok = (g === kind[item]);
    verdict("<b>" + (ok ? "Correct." : "Not quite.") + "</b> " + names[item] + " is <b>" + (kind[item] === "H" ? "homologous (divergent)" : "analogous (convergent)") + "</b>: " + why[item] + " (Section 6.3). Fitness = reproductive fitness only.");
    draw(App.state.t);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(item === -1){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Industrial melanism (Fig. 6.4): background decides who predators see</text>';
      m += '<rect x="80" y="60" width="260" height="170" fill="#d6c9a8"/>';
      m += '<text x="210" y="52" fill="#94a3b8" font-size="11" text-anchor="middle">1850s lichen trunks: white &gt; dark</text>';
      m += '<ellipse cx="160" cy="150" rx="22" ry="16" fill="#f8fafc" stroke="#64748b"/>';
      m += '<ellipse cx="260" cy="150" rx="22" ry="16" fill="#334155" stroke="#64748b"/>';
      m += '<rect x="380" y="60" width="260" height="170" fill="#3f3a33"/>';
      m += '<text x="510" y="52" fill="#94a3b8" font-size="11" text-anchor="middle">1920 soot trunks: dark &gt; white</text>';
      m += '<ellipse cx="460" cy="150" rx="22" ry="16" fill="#f8fafc" stroke="#94a3b8"/>';
      m += '<ellipse cx="560" cy="150" rx="22" ry="16" fill="#1e293b" stroke="#94a3b8"/>';
      m += '<line x1="460" y1="' + (120 + Math.sin(t * 3) * 8) + '" x2="470" y2="130" stroke="#f87171" stroke-width="2"/>';
      m += '<text x="360" y="262" fill="#94a3b8" font-size="12" text-anchor="middle">Rural areas stayed low-melanic; no variant fully wiped out; lichens = pollution indicators.</text>';
      svg.innerHTML = m;
      readout(cell("1850s", "white > dark") + cell("1920", "dark > white", "#f59e0b") + cell("agent", "predation on contrast"));
      verdict("<b>Section 6.3:</b> pre-industrialisation <b>white-winged &gt; dark</b>; post-industrialisation the <b>proportion reversed</b>. Contrasting moths are picked by predators. Resistance in months/years is the same anthropogenic selection.");
      return;
    }
    item = numEl("ctrl-i-range", item < 0 ? 0 : item);
    var el = document.getElementById("ctrl-i"); if(el) el.textContent = (item + 1) + " / 6";
    var r = document.getElementById("ctrl-i-range"); if(r) r.value = item;
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Sorter: same structure -&gt; different jobs (H) vs different structures -&gt; same job (A)</text>';
    m += '<rect x="90" y="60" width="220" height="150" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="200" y="90" fill="#e2e8f0" font-size="12" text-anchor="middle">specimen ' + (item + 1) + ' / 6</text>';
    m += '<text x="200" y="115" fill="#38bdf8" font-size="12" text-anchor="middle">' + names[item] + '</text>';
    m += '<text x="200" y="140" fill="#94a3b8" font-size="11" text-anchor="middle">' + why[item] + '</text>';
    m += '<text x="200" y="175" fill="#94a3b8" font-size="11" text-anchor="middle">press Homologous / Analogous</text>';
    m += '<rect x="380" y="60" width="130" height="150" rx="8" fill="#0f2f3a" stroke="#38bdf8"/>';
    m += '<text x="445" y="90" fill="#38bdf8" font-size="12" text-anchor="middle">HOMO-</text>';
    m += '<text x="445" y="108" fill="#38bdf8" font-size="12" text-anchor="middle">LOGOUS</text>';
    m += '<text x="445" y="130" fill="#94a3b8" font-size="10" text-anchor="middle">divergent</text>';
    m += '<rect x="530" y="60" width="130" height="150" rx="8" fill="#3a2a0f" stroke="#f59e0b"/>';
    m += '<text x="595" y="90" fill="#f59e0b" font-size="12" text-anchor="middle">ANA-</text>';
    m += '<text x="595" y="108" fill="#f59e0b" font-size="12" text-anchor="middle">LOGOUS</text>';
    m += '<text x="595" y="130" fill="#94a3b8" font-size="10" text-anchor="middle">convergent</text>';
    m += '<text x="360" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">Special creation (4000-yr earth) fell to Darwin-Wallace; fossils/embryos/biochemistry back deep time.</text>';
    m += '<text x="360" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">Haeckel gill slits cited; von Baer disapproved (embryos never pass adult stages).</text>';
    svg.innerHTML = m;
    readout(cell("item", (item + 1) + " / 6") + cell("answer", kind[item] === "H" ? "homologous" : "analogous", kind[item] === "H" ? "#38bdf8" : "#f59e0b") + cell("mechanism", kind[item] === "H" ? "divergent" : "convergent"));
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["adaptive-radiation"] = (function(){
  var beak = 1;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Seed-eating ancestor</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Insectivorous (probing)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Vegetarian (crushing)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-s">Seed-eating ancestor</button>' +
      '<button class="preset-btn active" id="p-i">Insectivorous</button>' +
      '<button class="preset-btn" id="p-v">Vegetarian</button>' +
      '<button class="preset-btn" id="p-w">Wolf mirror</button>';
    document.getElementById("p-s").onclick = function(){ setActivePreset(this); beak = 0; var r = document.getElementById("ctrl-b-range"); if(r) r.value = 0; draw(App.state.t); };
    document.getElementById("p-i").onclick = function(){ setActivePreset(this); beak = 1; var r = document.getElementById("ctrl-b-range"); if(r) r.value = 1; draw(App.state.t); };
    document.getElementById("p-v").onclick = function(){ setActivePreset(this); beak = 2; var r = document.getElementById("ctrl-b-range"); if(r) r.value = 2; draw(App.state.t); };
    document.getElementById("p-w").onclick = function(){ setActivePreset(this); beak = 3; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Radiation slider</span><span class="val" id="ctrl-b">insectivorous</span></div>' +
      '<input type="range" id="ctrl-b-range" min="0" max="2" step="1" value="1"></div>';
    document.getElementById("ctrl-b-range").oninput = function(){ beak = numEl("ctrl-b-range", 1); draw(App.state.t); };
    draw(0);
  }
  function bird(x, y, beakKind, col, label){
    var s = '<circle cx="' + x + '" cy="' + y + '" r="26" fill="#0f1f2e" stroke="' + col + '" stroke-width="2"/>';
    if(beakKind === 0) s += '<polygon points="' + x + ',' + y + ' ' + (x + 26) + ',' + (y - 7) + ' ' + (x + 26) + ',' + (y + 7) + '" fill="' + col + '"/>';
    else if(beakKind === 1) s += '<polygon points="' + x + ',' + y + ' ' + (x + 38) + ',' + (y - 3) + ' ' + (x + 38) + ',' + (y + 3) + '" fill="' + col + '"/>';
    else s += '<polygon points="' + x + ',' + y + ' ' + (x + 24) + ',' + (y - 12) + ' ' + (x + 24) + ',' + (y + 12) + '" fill="' + col + '"/>';
    s += '<circle cx="' + (x - 8) + '" cy="' + (y - 6) + '" r="3" fill="#f8fafc"/>';
    s += '<text x="' + x + '" y="' + (y + 44) + '" fill="' + col + '" font-size="11" text-anchor="middle">' + label + '</text>';
    return s;
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    if(beak <= 2){
      var r = document.getElementById("ctrl-b-range"); if(r && beak !== 3) r.value = beak;
      var names = ["seed-eating", "insectivorous", "vegetarian"];
      var e2 = document.getElementById("ctrl-b"); if(e2) e2.textContent = names[beak];
    }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(beak === 3){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Convergent mirror (Fig. 6.7): placental wolf ~= Tasmanian wolf-marsupial</text>';
      m += '<rect x="90" y="70" width="230" height="150" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<text x="205" y="100" fill="#e2e8f0" font-size="13" text-anchor="middle">placental wolf</text>';
      m += '<text x="205" y="125" fill="#94a3b8" font-size="11" text-anchor="middle">separate stock</text>';
      m += '<rect x="400" y="70" width="230" height="150" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<text x="515" y="100" fill="#e2e8f0" font-size="13" text-anchor="middle">Tasmanian wolf</text>';
      m += '<text x="515" y="125" fill="#94a3b8" font-size="11" text-anchor="middle">marsupial stock</text>';
      m += '<text x="360" y="180" fill="#f59e0b" font-size="13" text-anchor="middle">similar form, separate radiations</text>';
      m += '<text x="360" y="255" fill="#94a3b8" font-size="12" text-anchor="middle">Australian marsupials radiated from one ancestral stock (Fig. 6.6).</text>';
      svg.innerHTML = m;
      readout(cell("left", "placental wolf") + cell("right", "Tasmanian wolf") + cell("pattern", "convergence", "#f59e0b"));
      verdict("<b>Section 6.4 / Fig. 6.7:</b> <b>placental wolf and Tasmanian wolf-marsupial</b> look alike from <b>separate stocks</b> — convergent evolution after independent radiations.");
      return;
    }
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Darwin finches (Fig. 6.5): one seed-eating stock radiates on Galapagos</text>';
    m += '<circle cx="360" cy="110" r="10" fill="#f59e0b"/>';
    m += '<text x="360" y="92" fill="#f59e0b" font-size="11" text-anchor="middle">ancestor</text>';
    var sway = Math.sin(t * 2) * 5;
    m += '<line x1="360" y1="120" x2="200" y2="180" stroke="#334155"/>';
    m += '<line x1="360" y1="120" x2="360" y2="185" stroke="#334155"/>';
    m += '<line x1="360" y1="120" x2="520" y2="180" stroke="#334155"/>';
    m += bird(200, 195 + sway, 0, "#f59e0b", "seed-eating");
    m += bird(360, 200 - sway, 1, "#38bdf8", "insectivorous");
    m += bird(520, 195 + sway, 2, "#34d399", "vegetarian");
    var cols = ["#f59e0b", "#38bdf8", "#34d399"];
    var labels = ["seed-eating (ancestral)", "insectivorous + altered beak", "vegetarian + altered beak"];
    m += '<rect x="180" y="238" width="360" height="30" rx="8" fill="#0f1f2e" stroke="' + cols[beak] + '"/>';
    m += '<text x="360" y="258" fill="' + cols[beak] + '" font-size="12" text-anchor="middle">selected: ' + labels[beak] + '</text>';
    svg.innerHTML = m;
    readout(cell("stock", "one seed-eating") + cell("derived", "insect. + veget.") + cell("area", "Galapagos", "#34d399"));
    verdict("<b>Section 6.4 / Exercise 8:</b> from the original <b>seed-eating</b> features arose <b>insectivorous and vegetarian finches</b> with <b>altered beaks</b> — one point radiating across habitats = <b>adaptive radiation</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["lamarck-darwin-mechanism"] = (function(){
  var mode = "dir";
  function gauss(x, mu, sg){ return Math.exp(-((x - mu) * (x - mu)) / (2 * sg * sg)); }
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#64748b;"></span><span>Before selection</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>After selection</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-st">Stabilising (mean)</button>' +
      '<button class="preset-btn active" id="p-di">Directional (off-mean)</button>' +
      '<button class="preset-btn" id="p-du">Disruptive (both ends)</button>' +
      '<button class="preset-btn" id="p-la">Lamarck giraffe (rejected)</button>';
    document.getElementById("p-st").onclick = function(){ setActivePreset(this); mode = "stab"; draw(App.state.t); };
    document.getElementById("p-di").onclick = function(){ setActivePreset(this); mode = "dir"; draw(App.state.t); };
    document.getElementById("p-du").onclick = function(){ setActivePreset(this); mode = "dis"; draw(App.state.t); };
    document.getElementById("p-la").onclick = function(){ setActivePreset(this); mode = "lam"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Selection strength</span><span class="val" id="ctrl-s">0.6</span></div>' +
      '<input type="range" id="ctrl-s-range" min="0" max="1" step="0.05" value="0.6"></div>';
    document.getElementById("ctrl-s-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function curve(mu, sg, shift, narrow, split, col, w){
    var d = "", x, y, v;
    for(x = 0; x <= 100; x += 2){
      v = gauss(x, mu + shift, sg * narrow);
      if(split > 0) v = v * (0.35 + split * Math.abs(x - mu) / 50);
      y = 240 - v * 160;
      d += (x === 0 ? "M " : "L ") + (110 + x * 5) + " " + y + " ";
    }
    return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w + '"/>';
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = numEl("ctrl-s-range", 0.6);
    var el = document.getElementById("ctrl-s"); if(el) el.textContent = st.toFixed(2);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "lam"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Lamarck use/disuse giraffe: stretching inherited - nobody believes it now (Sec 6.5)</text>';
      var stretch = 20 + Math.sin(t * 2) * 6;
      m += '<rect x="150" y="60" width="120" height="170" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<line x1="210" y1="200" x2="210" y2="' + (140 - stretch / 2) + '" stroke="#a16207" stroke-width="10"/>';
      m += '<circle cx="210" cy="' + (130 - stretch / 2) + '" r="14" fill="#a16207"/>';
      m += '<text x="210" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">stretching...</text>';
      m += '<rect x="450" y="60" width="120" height="170" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<line x1="510" y1="200" x2="510" y2="110" stroke="#a16207" stroke-width="10"/>';
      m += '<circle cx="510" cy="100" r="14" fill="#a16207"/>';
      m += '<line x1="430" y1="70" x2="470" y2="215" stroke="#f87171" stroke-width="4"/>';
      m += '<text x="510" y="250" fill="#f87171" font-size="11" text-anchor="middle">NOT inherited</text>';
      m += '<text x="360" y="278" fill="#94a3b8" font-size="11" text-anchor="middle">Darwin needs heritable variation + branching descent + selection; de Vries adds saltation.</text>';
      svg.innerHTML = m;
      readout(cell("claim", "acquired neck", "#f87171") + cell("status", "rejected") + cell("need", "heritable fitness"));
      verdict("<b>Section 6.5:</b> giraffes stretching then passing long necks on is <b>Lamarckian use/disuse — rejected</b>. Darwin: <b>branching descent + natural selection</b> on <b>inherited</b> variation (Malthus competition).");
      return;
    }
    var title = mode === "stab" ? "(a) stabilising: mean favoured" : (mode === "dir" ? "(b) directional: off-mean favoured" : "(c) disruptive: both ends favoured");
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 6.8 ' + title + ' (strength ' + st.toFixed(2) + ')</text>';
    m += '<line x1="110" y1="240" x2="610" y2="240" stroke="#475569"/>';
    m += curve(50, 16, 0, 1, 0, "#64748b", 2);
    if(mode === "stab") m += curve(50, 16, 0, 1 - st * 0.45, 0, "#34d399", 3);
    else if(mode === "dir") m += curve(50, 16, st * 26, 1, 0, "#34d399", 3);
    else m += curve(50, 16, 0, 1.05, st, "#34d399", 3);
    m += '<text x="360" y="268" fill="#94a3b8" font-size="12" text-anchor="middle">Bacteria A-&gt;B in days; fish/fowl need millions of years (life-span clock).</text>';
    svg.innerHTML = m;
    readout(cell("mode", mode === "stab" ? "stabilising" : (mode === "dir" ? "directional" : "disruptive"), "#34d399") + cell("peak", mode === "dir" ? "off-mean" : (mode === "stab" ? "mean" : "both ends")) + cell("strength", st.toFixed(2)));
    if(mode === "stab") verdict("<b>Fig. 6.8(a) / Section 6.7:</b> <b>stabilisation</b> keeps the <b>mean</b> — extremes trimmed. Antibiotic courses must finish or resistant B-like variants (Sec 6.5) outgrow.");
    else if(mode === "dir") verdict("<b>Fig. 6.8(b):</b> <b>directional change</b> shifts the peak <b>off-mean</b> — e.g. melanised moths rising on soot. de Vries <b>saltation</b> = sudden large step; Darwin = small directional steps.");
    else verdict("<b>Fig. 6.8(c):</b> <b>disruption</b> favours <b>both peripheral ends</b> — middle loses. Population genetics reconciles Darwin gradualism with de Vries mutations.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["hardy-weinberg"] = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>AA = p2</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Aa = 2pq</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>aa = q2</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-eq">Equilibrium (q2=0.16)</button>' +
      '<button class="preset-btn" id="p-ds">Disturbed: selection + drift</button>';
    document.getElementById("p-eq").onclick = function(){ setActivePreset(this); var r = document.getElementById("ctrl-p-range"); if(r) r.value = 0.6; App.state.maxT = 6; var sc = document.getElementById("time-scrubber"); if(sc) sc.max = 6; draw(App.state.t); };
    document.getElementById("p-ds").onclick = function(){ setActivePreset(this); draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>p (allele A)</span><span class="val" id="ctrl-p">0.60</span></div>' +
      '<input type="range" id="ctrl-p-range" min="0" max="1" step="0.01" value="0.6"></div>' +
      '<div class="control-item"><div class="control-label"><span>disturber</span><span class="val">none</span></div>' +
      '<div style="font-size:11px;color:#94a3b8">flow / drift+founder / mutation / recombination / selection</div></div>';
    document.getElementById("ctrl-p-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var p = numEl("ctrl-p-range", 0.6);
    var el = document.getElementById("ctrl-p"); if(el) el.textContent = p.toFixed(2);
    var q = 1 - p;
    var p2 = p * p, het = 2 * p * q, q2 = q * q;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Hardy-Weinberg (Sec 6.7): p2 + 2pq + q2 = 1; gene pool constant unless disturbed</text>';
    var bw = 420;
    m += '<rect x="90" y="70" width="' + (bw * p2) + '" height="44" fill="#38bdf8"/>';
    m += '<rect x="' + (90 + bw * p2) + '" y="70" width="' + (bw * het) + '" height="44" fill="#a78bfa"/>';
    m += '<rect x="' + (90 + bw * (p2 + het)) + '" y="70" width="' + (bw * q2) + '" height="44" fill="#f59e0b"/>';
    m += '<text x="90" y="135" fill="#38bdf8" font-size="12">AA ' + p2.toFixed(3) + '</text>';
    m += '<text x="260" y="135" fill="#a78bfa" font-size="12">Aa ' + het.toFixed(3) + '</text>';
    m += '<text x="430" y="135" fill="#f59e0b" font-size="12">aa ' + q2.toFixed(3) + '</text>';
    m += '<text x="90" y="170" fill="#e2e8f0" font-size="13">(p+q)2 with p=' + p.toFixed(2) + ' q=' + q.toFixed(2) + '; sum = ' + (p2 + het + q2).toFixed(3) + '</text>';
    m += '<text x="90" y="195" fill="#94a3b8" font-size="12">5 disturbers: gene flow - drift (+founder) - mutation - recombination - selection</text>';
    var drift = Math.sin(t * 2) * 0.02;
    m += '<text x="90" y="220" fill="#94a3b8" font-size="12">live drift wobble on q: ' + (q + drift).toFixed(3) + ' (chance change; founders start new pool)</text>';
    m += '<text x="90" y="245" fill="#94a3b8" font-size="12">Selection replays Fig. 6.8: mean / off-mean / both-ends.</text>';
    svg.innerHTML = m;
    readout(cell("p", p.toFixed(2)) + cell("q", q.toFixed(2)) + cell("AA p2", p2.toFixed(3), "#38bdf8") + cell("Aa 2pq", het.toFixed(3), "#a78bfa") + cell("aa q2", q2.toFixed(3), "#f59e0b"));
    if(Math.abs(q2 - 0.16) < 0.005) verdict("<b>Section 6.7 worked:</b> q2 = 0.16 gives q = <b>0.40</b>, p = <b>0.60</b>, carriers 2pq = <b>0.48 (48%)</b>. Measured-vs-expected gaps measure evolution.");
    else verdict("<b>Section 6.7:</b> p2 + 2pq + q2 = <b>1</b> recomputed live (p+q = 1). Any lasting gap after census = <b>disturbed equilibrium = evolution</b> via the five factors.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["timeline-human"] = (function(){
  var stages = [
    ["cells ~2000 mya", "first cellular forms; O2 from light reaction", 2000, 0],
    ["invertebrates 500 mya", "active seas; plants invade land first", 500, 0],
    ["jawless fish 350 mya", "lobefin -&gt; amphibian; Coelacanth 1938", 350, 0],
    ["reptiles rule ~200 my", "dinosaurs gone ~65 mya; mammals take over", 65, 0],
    ["apes 15 mya", "Dryopithecus ape-like; Ramapithecus man-like", 15, 0],
    ["habilis ~2 mya", "650-800cc; fruit; stone tools", 2, 725],
    ["erectus ~1.5 mya", "~900cc Java 1891; probably meat", 1.5, 900],
    ["Neanderthal 1L-40k ya", "1400cc; hides; burials", 0.07, 1400],
    ["sapiens", "ice age 75k-10k; Bhimbetka 18k; farming 10k", 0.01, 1350]
  ];
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Vertebrate spine</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Hominid brain staircase</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-v">Vertebrate spine</button>' +
      '<button class="preset-btn active" id="p-h">Hominid brains 650-1400cc</button>';
    document.getElementById("p-v").onclick = function(){ setActivePreset(this); App.state.t = 1; var sc = document.getElementById("time-scrubber"); if(sc) sc.value = 1; draw(1); };
    document.getElementById("p-h").onclick = function(){ setActivePreset(this); App.state.t = 6; var sc = document.getElementById("time-scrubber"); if(sc) sc.value = 6; draw(6); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Walker (scrub time 0-8)</span><span class="val" id="ctrl-w">hominids</span></div>' +
      '<div style="font-size:12px;color:#94a3b8">Ex 4 traces brain + skeleton + diet + tools</div></div>';
    draw(6);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var idx = Math.min(8, Math.max(0, Math.floor(t)));
    var st = stages[idx];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Brief account (Secs 6.8-6.9): scrub time to walk 2000 mya -&gt; farming (Figs 6.9-6.11)</text>';
    var i, px;
    for(i = 0; i < 9; i++){
      px = 70 + i * 68;
      var hot = (i === idx);
      m += '<circle cx="' + px + '" cy="120" r="' + (hot ? 13 : 8) + '" fill="' + (i < 5 ? '#38bdf8' : '#f59e0b') + '" stroke="' + (hot ? '#f8fafc' : 'none') + '" stroke-width="2"/>';
      if(stages[i][3] > 0){
        var bh = (stages[i][3] - 600) / 900 * 70;
        m += '<rect x="' + (px - 10) + '" y="' + (200 - bh) + '" width="20" height="' + bh + '" fill="#f59e0b" opacity="0.85"/>';
        m += '<text x="' + px + '" y="218" fill="#94a3b8" font-size="9" text-anchor="middle">' + stages[i][3] + '</text>';
      }
    }
    m += '<text x="360" y="170" fill="#e2e8f0" font-size="15" text-anchor="middle">' + st[0] + '</text>';
    m += '<text x="360" y="248" fill="#94a3b8" font-size="12" text-anchor="middle">' + st[1] + '</text>';
    m += '<text x="360" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">brain staircase: habilis 650-800 -&gt; erectus ~900 -&gt; Neanderthal 1400cc (Ex 4, 9-10).</text>';
    svg.innerHTML = m;
    readout(cell("stop", (idx + 1) + " / 9") + cell("stage", st[0]) + cell("brain", st[3] > 0 ? st[3] + "cc" : "-", "#f59e0b"));
    if(idx <= 4) verdict("<b>Section 6.8:</b> cells 2000 mya -&gt; invertebrates 500 mya -&gt; jawless fish 350 mya -&gt; lobefin-to-amphibian -&gt; reptiles; <b>dinosaurs gone ~65 mya</b>; shrew-like mammals rise. Horse/elephant/dog deferred.");
    else if(idx <= 6) verdict("<b>Section 6.9:</b> 15 mya apes -&gt; <b>habilis 650-800cc</b> (~2 mya) -&gt; <b>erectus ~900cc</b> (Java 1891, ~1.5 mya, meat). Ex 9: human evolution is <b>not</b> adaptive radiation — successive grades, one lineage.");
    else verdict("<b>Section 6.9:</b> <b>Neanderthal 1400cc</b> (1,00,000-40,000 ya, hides/burials) -&gt; <b>sapiens</b> out of Africa; art <b>Bhimbetka ~18,000 ya</b>, agriculture ~10,000 ya. Brain + language evolve in parallel.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.miller = window.SIMS["origin-miller"];
window.SIMS.evidences = window.SIMS["theories-evidences"];
window.SIMS.finches = window.SIMS["adaptive-radiation"];
window.SIMS.selection = window.SIMS["lamarck-darwin-mechanism"];
window.SIMS.hardyweinberg = window.SIMS["hardy-weinberg"];
window.SIMS.humanevolution = window.SIMS["timeline-human"];
