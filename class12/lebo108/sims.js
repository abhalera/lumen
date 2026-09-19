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

window.SIMS["household-ferment"] = (function(){
  var food = "curd";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>LAB / yeast (living starter)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>CO2 bubbles (rise / holes)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Product (curd / dough / cheese)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cu" data-preset="p-cu">Curd: LAB + B12</button>' +
      '<button class="preset-btn" id="p-br" data-preset="p-br">Bread/idli: CO2 rise</button>' +
      '<button class="preset-btn" id="p-ch" data-preset="p-ch">Swiss holes / Roquefort</button>' +
      '<button class="preset-btn" id="p-to" data-preset="p-to">Toddy: palm sap</button>';
    document.getElementById("p-cu").onclick = function(){ setActivePreset(this); food = "curd"; draw(App.state.t); };
    document.getElementById("p-br").onclick = function(){ setActivePreset(this); food = "bread"; draw(App.state.t); };
    document.getElementById("p-ch").onclick = function(){ setActivePreset(this); food = "cheese"; draw(App.state.t); };
    document.getElementById("p-to").onclick = function(){ setActivePreset(this); food = "toddy"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Warmth (suitable temperature)</span><span class="val" id="ctrl-w">warm</span></div>' +
      '<input type="range" id="ctrl-w-range" min="0" max="100" step="1" value="75"></div>' +
      '<div class="control-item"><div class="control-label"><span>Starter</span><span class="val">spoon of curd</span></div>' +
      '<div style="font-size:12px;color:#94a3b8">inoculum = millions of LAB; same seed logic as sludge return</div></div>';
    document.getElementById("ctrl-w-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var warm = numEl("ctrl-w-range", 75);
    var el = document.getElementById("ctrl-w"); if(el) el.textContent = warm >= 60 ? "warm" : (warm >= 30 ? "cool" : "cold");
    var active = warm >= 40;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Household microbes (Sec 8.1): ' + (active ? 'starter multiplying' : 'too cold — starter dormant') + '</text>';
    m += '<rect x="90" y="80" width="180" height="140" rx="10" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="180" y="70" fill="#94a3b8" font-size="11" text-anchor="middle">kitchen vessel</text>';
    var i, bx, by;
    if(food === "curd"){
      m += '<rect x="105" y="150" width="150" height="60" rx="8" fill="#fef3c7"/>';
      m += '<text x="180" y="178" fill="#78350f" font-size="12" text-anchor="middle">milk -&gt; curd</text>';
      m += '<text x="180" y="196" fill="#78350f" font-size="10" text-anchor="middle">acids coagulate protein</text>';
      for(i = 0; i < 8; i++){
        bx = 120 + (i * 37 + Math.floor(t * 25)) % 120;
        by = 100 + (i * 23 + Math.floor(t * 15)) % 40;
        m += '<circle cx="' + bx + '" cy="' + by + '" r="4" fill="#38bdf8" opacity="' + (active ? 0.95 : 0.25) + '"/>';
      }
      m += '<text x="420" y="100" fill="#e2e8f0" font-size="13">Lactobacillus + LAB starter (millions)</text>';
      m += '<text x="420" y="124" fill="#34d399" font-size="12">vitamin B12 UP; gut guard vs pathogens</text>';
      m += '<text x="420" y="148" fill="#94a3b8" font-size="12">Ex 3 answer: curd food; sets, digests, B12</text>';
      m += '<text x="420" y="176" fill="#94a3b8" font-size="12">No starter = souring by chance microbes.</text>';
    } else if(food === "bread"){
      m += '<rect x="105" y="150" width="150" height="60" rx="8" fill="#fde68a"/>';
      m += '<text x="180" y="178" fill="#78350f" font-size="12" text-anchor="middle">dough rising</text>';
      for(i = 0; i < 10; i++){
        bx = 120 + (i * 29) % 120;
        by = 200 - ((t * 35 + i * 23) % 90);
        m += '<circle cx="' + bx + '" cy="' + by + '" r="' + (3 + (i % 3)) + '" fill="none" stroke="#f59e0b" stroke-width="2" opacity="' + (active ? 0.95 : 0.2) + '"/>';
      }
      m += '<text x="420" y="100" fill="#e2e8f0" font-size="13">CO2 puffs idli/dosa (bacteria) + bread</text>';
      m += '<text x="420" y="124" fill="#38bdf8" font-size="12">baker yeast: Saccharomyces cerevisiae</text>';
      m += '<text x="420" y="148" fill="#94a3b8" font-size="12">C6H12O6 -&gt; 2C2H5OH + 2CO2 (yeast)</text>';
      m += '<text x="420" y="172" fill="#94a3b8" font-size="12">Ex 2 proof gases make metabolism visible.</text>';
    } else if(food === "cheese"){
      m += '<rect x="105" y="130" width="150" height="80" rx="8" fill="#fde68a"/>';
      m += '<circle cx="150" cy="165" r="10" fill="#09131d"/>';
      m += '<circle cx="195" cy="180" r="14" fill="#09131d"/>';
      m += '<circle cx="225" cy="155" r="7" fill="#09131d"/>';
      m += '<text x="180" y="225" fill="#94a3b8" font-size="10" text-anchor="middle">Swiss holes = trapped CO2</text>';
      m += '<text x="420" y="100" fill="#e2e8f0" font-size="13">Propionibacterium sharmanii -&gt; big CO2</text>';
      m += '<text x="420" y="124" fill="#f59e0b" font-size="12">holes = bacterial breath made visible</text>';
      m += '<text x="420" y="148" fill="#38bdf8" font-size="12">Roquefort: ripening fungi, flavour</text>';
      m += '<text x="420" y="172" fill="#94a3b8" font-size="12">Cheese = oldest microbe food.</text>';
    } else {
      m += '<rect x="105" y="150" width="150" height="60" rx="8" fill="#164e63"/>';
      m += '<text x="180" y="178" fill="#e2e8f0" font-size="12" text-anchor="middle">palm sap -&gt; toddy</text>';
      m += '<text x="420" y="100" fill="#e2e8f0" font-size="13">Toddy: fermented palm sap (south India)</text>';
      m += '<text x="420" y="124" fill="#94a3b8" font-size="12">Also: fish / soyabean / bamboo-shoot</text>';
      m += '<text x="420" y="148" fill="#94a3b8" font-size="12">ferments (Sec 8.1).</text>';
    }
    svg.innerHTML = m;
    readout(cell("food", food) + cell("agent", food === "curd" ? "Lactobacillus" : (food === "bread" ? "S. cerevisiae" : (food === "cheese" ? "P. sharmanii" : "palm microbes"))) + cell("gas", food === "curd" ? "acids" : "CO2", "#f59e0b") + cell("warmth", warm >= 60 ? "suitable" : "low", "#34d399"));
    if(food === "curd") verdict("<b>Sec 8.1 / Ex 3:</b> <b>LAB (Lactobacillus)</b> acids <b>coagulate + partly digest</b> milk protein; <b>vitamin B12 rises</b>; same LAB check gut pathogens. Starter = inoculum logic reused in sewage.");
    else if(food === "bread") verdict("<b>Sec 8.1 / Ex 2:</b> <b>CO2 from fermentation</b> puffs <b>idli/dosa (bacteria)</b> and <b>bread (Saccharomyces cerevisiae)</b>: C6H12O6 -&gt; <b>2C2H5OH + 2CO2</b>.");
    else if(food === "cheese") verdict("<b>Sec 8.1:</b> Swiss holes = large <b>CO2 volumes from Propionibacterium sharmanii</b>; <b>Roquefort ripened by specific fungi</b> — texture, flavour, taste all microbial.");
    else verdict("<b>Sec 8.1:</b> <b>toddy</b> = fermented <b>palm sap</b> (southern India); microbes also ferment <b>fish, soyabean, bamboo-shoots</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["beverage-antibiotic"] = (function(){
  var mode = "distil";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Brewer yeast fermentation</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Distilled: whisky / brandy / rum</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Penicillin halo (1928-1945)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-di" data-preset="p-di">Distillation rule</button>' +
      '<button class="preset-btn" id="p-fe" data-preset="p-fe">Fermentor + yield</button>' +
      '<button class="preset-btn" id="p-pe" data-preset="p-pe">Penicillin timeline</button>';
    document.getElementById("p-di").onclick = function(){ setActivePreset(this); mode = "distil"; draw(App.state.t); };
    document.getElementById("p-fe").onclick = function(){ setActivePreset(this); mode = "ferm"; draw(App.state.t); };
    document.getElementById("p-pe").onclick = function(){ setActivePreset(this); mode = "pen"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Glucose (g)</span><span class="val" id="ctrl-g">180</span></div>' +
      '<input type="range" id="ctrl-g-range" min="18" max="360" step="18" value="180"></div>';
    document.getElementById("ctrl-g-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var g = numEl("ctrl-g-range", 180);
    var el = document.getElementById("ctrl-g"); if(el) el.textContent = g;
    var eth = g / 180 * 92;
    var co2 = g / 180 * 88;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "distil"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 8.2.1: malted cereals + fruit juice -&gt; ethanol (S. cerevisiae, brewer yeast)</text>';
      var drinks = ["wine", "beer", "whisky", "brandy", "rum"];
      var dd = [false, false, true, true, true];
      var i, dx;
      for(i = 0; i < 5; i++){
        dx = 80 + i * 116;
        m += '<rect x="' + dx + '" y="80" width="100" height="90" rx="8" fill="' + (dd[i] ? '#3a2a0f' : '#0f2f3a') + '" stroke="' + (dd[i] ? '#f59e0b' : '#38bdf8') + '"/>';
        m += '<text x="' + (dx + 50) + '" y="115" fill="#e2e8f0" font-size="11" text-anchor="middle">' + drinks[i] + '</text>';
        m += '<text x="' + (dx + 50) + '" y="140" fill="' + (dd[i] ? '#f59e0b' : '#38bdf8') + '" font-size="10" text-anchor="middle">' + (dd[i] ? 'DISTILLED' : 'no distillation') + '</text>';
      }
      m += '<text x="360" y="210" fill="#94a3b8" font-size="12" text-anchor="middle">Bottled direct: wine / beer. Distilled broth: whisky / brandy / rum.</text>';
      m += '<text x="360" y="235" fill="#94a3b8" font-size="12" text-anchor="middle">C6H12O6 -&gt; 2C2H5OH + 2CO2; ' + g + ' g glucose -&gt; ' + eth.toFixed(1) + ' g ethanol + ' + co2.toFixed(1) + ' g CO2.</text>';
      svg.innerHTML = m;
      readout(cell("wine/beer", "no distillation", "#38bdf8") + cell("whisky/rum", "distilled", "#f59e0b") + cell("ethanol", eth.toFixed(1) + " g", "#34d399"));
      verdict("<b>Sec 8.2.1:</b> <b>wine + beer, no distillation</b>; <b>whisky + brandy + rum, distilled</b> fermented broth. Same <b>brewer yeast (Saccharomyces cerevisiae)</b> as bread, scaled to <b>fermentors (Fig. 8.4)</b>.");
    } else if(mode === "ferm"){
      var h = Math.min(150, 30 + eth);
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Fermentor (Fig. 8.4): 180 g glucose -&gt; 92 g ethanol + 88 g CO2 (mass balances)</text>';
      m += '<rect x="120" y="60" width="160" height="180" rx="10" fill="#0f1f2e" stroke="#334155"/>';
      m += '<rect x="130" y="' + (230 - h) + '" width="140" height="' + h + '" fill="#164e63"/>';
      for(var k = 0; k < 8; k++){
        var fbx = 150 + (k * 31) % 110;
        var fby = 220 - ((t * 40 + k * 29) % 140);
        m += '<circle cx="' + fbx + '" cy="' + fby + '" r="4" fill="none" stroke="#38bdf8"/>';
      }
      m += '<text x="420" y="110" fill="#e2e8f0" font-size="13">glucose ' + g + ' g</text>';
      m += '<text x="420" y="134" fill="#34d399" font-size="13">ethanol ' + eth.toFixed(1) + ' g</text>';
      m += '<text x="420" y="158" fill="#f59e0b" font-size="13">CO2 ' + co2.toFixed(1) + ' g</text>';
      m += '<text x="420" y="186" fill="#94a3b8" font-size="12">' + eth.toFixed(1) + ' + ' + co2.toFixed(1) + ' = ' + g + ' g</text>';
      svg.innerHTML = m;
      readout(cell("glucose", g + " g") + cell("ethanol", eth.toFixed(1) + " g", "#34d399") + cell("CO2", co2.toFixed(1) + " g", "#f59e0b"));
      verdict("<b>Sec 8.2.1 worked:</b> 1 mol glucose (180 g) -&gt; <b>2 mol ethanol (92 g)</b> + 2 mol CO2 (88 g); 92 + 88 = 180. Drag glucose to scale the fermentor.");
    } else {
      var st = Math.min(3, Math.floor(t / 1.5));
      var labels = ["Fleming chance plate (Penicillium notatum)", "Chain + Florey prove the drug", "WWII US soldiers treated", "Nobel Prize 1945 (trio)"];
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Penicillin: anti (=against) + bio (=life); kills/retards pathogens (Sec 8.2.2)</text>';
      m += '<circle cx="200" cy="150" r="55" fill="#fef3c7" stroke="#a16207"/>';
      m += '<circle cx="200" cy="150" r="22" fill="#9ca3af"/>';
      m += '<circle cx="200" cy="150" r="38" fill="none" stroke="#34d399" stroke-width="6"/>';
      m += '<text x="200" y="230" fill="#94a3b8" font-size="11" text-anchor="middle">halo: Staphylococci cannot grow</text>';
      m += '<text x="480" y="120" fill="#e2e8f0" font-size="13">' + labels[st] + '</text>';
      m += '<text x="480" y="148" fill="#94a3b8" font-size="12">step ' + (st + 1) + ' / 4 (scrub time)</text>';
      m += '<text x="480" y="172" fill="#94a3b8" font-size="12">Tamed plague, whooping cough</text>';
      m += '<text x="480" y="192" fill="#94a3b8" font-size="12">(kali khansi), diphtheria (gal</text>';
      m += '<text x="480" y="212" fill="#94a3b8" font-size="12">ghotu), leprosy (kusht rog).</text>';
      svg.innerHTML = m;
      readout(cell("mould", "P. notatum") + cell("developers", "Chain + Florey") + cell("prize", "1945", "#f59e0b"));
      verdict("<b>Sec 8.2.2:</b> <b>Fleming</b> saw <b>Penicillium notatum</b> halting Staphylococci; <b>Chain + Florey</b> made it a drug for <b>wounded American soldiers (WWII)</b>; trio shared the <b>1945 Nobel</b>.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["chemical-enzyme"] = (function(){
  var item = 0;
  var products = ["citric acid", "acetic acid", "butyric acid", "lactic acid", "ethanol", "clot buster", "immunosuppressant", "cholesterol-lowering"];
  var microbes = ["Aspergillus niger (fungus)", "Acetobacter aceti (bacterium)", "Clostridium butylicum (bacterium)", "Lactobacillus (bacterium)", "Saccharomyces cerevisiae (yeast)", "Streptococcus (streptokinase, GE)", "Trichoderma polysporum (fungus)", "Monascus purpureus (yeast)"];
  var notes = ["industrial organic acid", "vinegar acid", "industrial organic acid", "curd acid too", "commercial alcohol", "post-myocardial infarction", "cyclosporin A: transplants", "statins: inhibit synthesis enzyme"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Acids + ethanol (book pairs only)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Enzymes: lipase / pectinase / streptokinase</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Bioactives: cyclosporin / statins (Ex 12)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ac" data-preset="p-ac">Acid matcher (4)</button>' +
      '<button class="preset-btn" id="p-en" data-preset="p-en">Enzyme uses</button>' +
      '<button class="preset-btn" id="p-bi" data-preset="p-bi">Ex 12 bioactives</button>';
    document.getElementById("p-ac").onclick = function(){ setActivePreset(this); item = 0; draw(App.state.t); };
    document.getElementById("p-en").onclick = function(){ setActivePreset(this); item = 5; draw(App.state.t); };
    document.getElementById("p-bi").onclick = function(){ setActivePreset(this); item = 6; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Product card</span><span class="val" id="ctrl-i">1 / 8</span></div>' +
      '<input type="range" id="ctrl-i-range" min="0" max="7" step="1" value="0"></div>' +
      '<div class="control-item"><div class="control-label"><span>Self-test</span><span class="val">book facts only</span></div>' +
      '<div><button class="preset-btn" id="b-hide" data-preset="b-hide">Hide microbe</button> <button class="preset-btn" id="b-show" data-preset="b-show">Reveal</button></div></div>';
    document.getElementById("ctrl-i-range").oninput = function(){ item = numEl("ctrl-i-range", 0); draw(App.state.t); };
    var hidden = false;
    document.getElementById("b-hide").onclick = function(){ hidden = true; draw(App.state.t); verdict("<b>Self-test:</b> which book microbe makes <b>" + products[item] + "</b>? (" + notes[item] + "). Press Reveal to check (Sec 8.2.3)."); };
    document.getElementById("b-show").onclick = function(){ hidden = false; draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    item = numEl("ctrl-i-range", item);
    var el = document.getElementById("ctrl-i"); if(el) el.textContent = (item + 1) + " / 8";
    var r = document.getElementById("ctrl-i-range"); if(r) r.value = item;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Bioactive matcher (Sec 8.2.3; Ex 14 acids, Ex 12 bioactives)</text>';
    m += '<rect x="90" y="70" width="230" height="110" rx="8" fill="#0f2f3a" stroke="#38bdf8"/>';
    m += '<text x="205" y="110" fill="#38bdf8" font-size="14" text-anchor="middle">' + products[item] + '</text>';
    m += '<text x="205" y="135" fill="#94a3b8" font-size="11" text-anchor="middle">' + notes[item] + '</text>';
    m += '<text x="205" y="158" fill="#94a3b8" font-size="11" text-anchor="middle">card ' + (item + 1) + ' / 8</text>';
    m += '<rect x="400" y="70" width="230" height="110" rx="8" fill="#064e3b" stroke="#34d399"/>';
    m += '<text x="515" y="110" fill="#e2e8f0" font-size="11" text-anchor="middle">' + microbes[item] + '</text>';
    m += '<text x="515" y="140" fill="#94a3b8" font-size="10" text-anchor="middle">source organism</text>';
    m += '<text x="360" y="215" fill="#94a3b8" font-size="12" text-anchor="middle">Enzymes: lipase (oily stains) / pectinase + protease (clear juice) / streptokinase (clots).</text>';
    m += '<text x="360" y="240" fill="#94a3b8" font-size="12" text-anchor="middle">Trap: Trichoderma = fungus; Monascus = yeast (both fungi broadly).</text>';
    svg.innerHTML = m;
    readout(cell("product", products[item], "#38bdf8") + cell("microbe", microbes[item], "#34d399") + cell("use", notes[item]));
    if(item <= 3) verdict("<b>Sec 8.2.3 / Ex 14:</b> " + microbes[item] + " -&gt; <b>" + products[item] + "</b>. Four pairs only: A. niger-citric, Acetobacter-acetic, Clostridium-butyric, Lactobacillus-lactic.");
    else if(item === 4) verdict("<b>Sec 8.2.3:</b> <b>yeast (Saccharomyces cerevisiae)</b> for commercial <b>ethanol</b> — same species as bread and beverages.");
    else if(item === 5) verdict("<b>Sec 8.2.3:</b> <b>streptokinase (Streptococcus, genetically engineered)</b> = <b>clot buster</b> after <b>myocardial infarction</b>; lipase in detergents; pectinases/proteases clarify juice.");
    else verdict("<b>Ex 12:</b> surgeon gets <b>cyclosporin A (Trichoderma polysporum)</b> for transplants; cardiologist gets <b>statins (Monascus purpureus)</b> — they <b>competitively inhibit the cholesterol-synthesis enzyme</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["sewage-bod"] = (function(){
  var stage = 0;
  function mount(){
    App.state.maxT = 2;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 2;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Primary: physical (screens + settling)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Secondary: flocs eat organics (aeration)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>BOD = O2 to oxidise 1 L organics</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-st" data-preset="p-st">STP stepper (Ex 8)</button>' +
      '<button class="preset-btn" id="p-ex" data-preset="p-ex">Ex 11 labeller: 20 / 8 / 400</button>';
    document.getElementById("p-st").onclick = function(){ setActivePreset(this); stage = 0; App.state.t = 0; var sc = document.getElementById("time-scrubber"); if(sc) sc.value = 0; draw(0); };
    document.getElementById("p-ex").onclick = function(){ setActivePreset(this); stage = 1; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Organics load (BOD in, mg/L)</span><span class="val" id="ctrl-b">400</span></div>' +
      '<input type="range" id="ctrl-b-range" min="8" max="400" step="1" value="400"></div>' +
      '<div class="control-item"><div class="control-label"><span>Aeration</span><span class="val" id="ctrl-a">on</span></div>' +
      '<input type="range" id="ctrl-a-range" min="0" max="1" step="1" value="1"></div>';
    document.getElementById("ctrl-b-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-a-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var bin = numEl("ctrl-b-range", 400);
    var aer = numEl("ctrl-a-range", 1) === 1;
    var eb = document.getElementById("ctrl-b"); if(eb) eb.textContent = bin;
    var ea = document.getElementById("ctrl-a"); if(ea) ea.textContent = aer ? "on" : "failed";
    var bout = aer ? Math.max(8, Math.round(bin * 0.05)) : bin;
    var cut = bin > 0 ? Math.round((bin - bout) / bin * 100) : 0;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(stage === 1){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Ex 11: A = 20, B = 8, C = 400 — greatest BOD = most polluted</text>';
      var rows = [["A: 20 mg/L", "secondary effluent", "#38bdf8", 150], ["B: 8 mg/L", "river water (cleanest)", "#34d399", 60], ["C: 400 mg/L", "untreated sewage", "#f87171", 400]];
      var i;
      for(i = 0; i < 3; i++){
        var bw = rows[i][3] / 400 * 300;
        m += '<text x="90" y="' + (90 + i * 60) + '" fill="#e2e8f0" font-size="12">' + rows[i][0] + '</text>';
        m += '<rect x="230" y="' + (70 + i * 60) + '" width="' + bw + '" height="24" fill="' + rows[i][2] + '"/>';
        m += '<text x="' + (240 + bw) + '" y="' + (88 + i * 60) + '" fill="' + rows[i][2] + '" font-size="11">' + rows[i][1] + '</text>';
      }
      m += '<text x="360" y="262" fill="#94a3b8" font-size="12" text-anchor="middle">400 -&gt; 20 = 95% BOD cut. BOD test = O2-uptake rate by microbes.</text>';
      svg.innerHTML = m;
      readout(cell("A 20", "secondary", "#38bdf8") + cell("B 8", "river", "#34d399") + cell("C 400", "sewage: worst", "#f87171") + cell("cut", "95%"));
      verdict("<b>Ex 11:</b> <b>C (400) = untreated sewage</b> (most polluted); <b>A (20) = secondary effluent</b>; <b>B (8) = river water</b>. Treatment cut (400-20)/400 = <b>95%</b>.");
    } else {
      var st = Math.min(2, Math.floor(t));
      var names = ["PRIMARY (physical)", "SECONDARY (biological)", "SLUDGE LOOP + RIVER"];
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">STP: ' + names[st] + ' — heterotrophic sewage microbes do the work (Sec 8.3)</text>';
      m += '<rect x="80" y="80" width="150" height="120" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<text x="155" y="105" fill="#94a3b8" font-size="11" text-anchor="middle">screens + grit</text>';
      m += '<text x="155" y="125" fill="#94a3b8" font-size="11" text-anchor="middle">primary sludge</text>';
      m += '<rect x="270" y="80" width="180" height="120" rx="8" fill="#0f2f3a" stroke="#38bdf8"/>';
      m += '<text x="360" y="105" fill="#38bdf8" font-size="11" text-anchor="middle">aeration + flocs</text>';
      m += '<text x="360" y="125" fill="#94a3b8" font-size="10" text-anchor="middle">bacteria + fungal mesh</text>';
      var k, fx, fy;
      for(k = 0; k < 10; k++){
        fx = 290 + (k * 41 + Math.floor(t * 40)) % 140;
        fy = 140 + (k * 17) % 45;
        m += '<circle cx="' + fx + '" cy="' + fy + '" r="5" fill="' + (aer ? '#38bdf8' : '#475569') + '"/>';
      }
      if(!aer) m += '<text x="360" y="185" fill="#f87171" font-size="11" text-anchor="middle">blowers failed: flocs starve</text>';
      m += '<rect x="490" y="80" width="150" height="120" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<text x="565" y="105" fill="#94a3b8" font-size="11" text-anchor="middle">activated sludge</text>';
      m += '<text x="565" y="125" fill="#94a3b8" font-size="10" text-anchor="middle">part back; rest -&gt; digester</text>';
      m += '<text x="565" y="145" fill="#f59e0b" font-size="10" text-anchor="middle">CH4 + H2S + CO2</text>';
      m += '<text x="360" y="235" fill="#e2e8f0" font-size="13" text-anchor="middle">BOD ' + bin + ' -&gt; ' + bout + ' mg/L (' + cut + '% cut' + (aer ? '' : '; primary alone cannot cut BOD') + ')</text>';
      m += '<text x="360" y="260" fill="#94a3b8" font-size="11" text-anchor="middle">Ganga + Yamuna Action Plans: STPs lag sewage. No machine beats microbes.</text>';
      svg.innerHTML = m;
      readout(cell("BOD in", bin + " mg/L", "#f87171") + cell("BOD out", bout + " mg/L", aer ? "#34d399" : "#f87171") + cell("aeration", aer ? "on" : "FAILED", aer ? "#38bdf8" : "#f87171") + cell("cut", cut + "%"));
      if(!aer) verdict("<b>Sec 8.3 prediction:</b> blowers failed = <b>BOD stays high</b> — flocs starve, organics uneaten. <b>Primary (physical) cannot cut BOD</b>; it only removes debris/grit.");
      else verdict("<b>Sec 8.3 / Ex 8:</b> primary = <b>physical (filtration + sedimentation)</b>; secondary = <b>biological flocs</b> that eat organics. Sludge: part back as <b>inoculum</b>, rest to <b>anaerobic digesters (biogas)</b>.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["biogas-biocontrol"] = (function(){
  var mode = "gas";
  var item = 0;
  var prey = ["aphids", "mosquitoes", "caterpillars", "root pathogens", "target insects only"];
  var agent = ["ladybird", "dragonflies", "Bt spores / Bt-cotton gene", "Trichoderma fungus", "NPV (Nucleopolyhedrovirus)"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Methane (predominant) + floating cover</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Biocontrol pairs (Sec 8.5)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-g" data-preset="p-g">Gobar-gas flow (10-15 ft)</button>' +
      '<button class="preset-btn" id="p-b" data-preset="p-b">Biocontrol matcher (5)</button>';
    document.getElementById("p-g").onclick = function(){ setActivePreset(this); mode = "gas"; draw(App.state.t); };
    document.getElementById("p-b").onclick = function(){ setActivePreset(this); mode = "bio"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Dung slurry feed</span><span class="val" id="ctrl-f">steady</span></div>' +
      '<input type="range" id="ctrl-f-range" min="0" max="100" step="1" value="70"></div>' +
      '<div class="control-item"><div class="control-label"><span>Biocontrol card</span><span class="val" id="ctrl-i">1 / 5</span></div>' +
      '<input type="range" id="ctrl-i-range" min="0" max="4" step="1" value="2"></div>';
    document.getElementById("ctrl-f-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-i-range").oninput = function(){ item = numEl("ctrl-i-range", 2); draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "bio"){
      item = numEl("ctrl-i-range", item);
      var el = document.getElementById("ctrl-i"); if(el) el.textContent = (item + 1) + " / 5";
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Biocontrol (Sec 8.5): manage pests, do not eradicate all life</text>';
      m += '<rect x="90" y="70" width="230" height="100" rx="8" fill="#0f2f3a" stroke="#38bdf8"/>';
      m += '<text x="205" y="110" fill="#38bdf8" font-size="14" text-anchor="middle">' + agent[item] + '</text>';
      m += '<text x="205" y="140" fill="#94a3b8" font-size="11" text-anchor="middle">eats / kills</text>';
      m += '<rect x="400" y="70" width="230" height="100" rx="8" fill="#3a2a0f" stroke="#f59e0b"/>';
      m += '<text x="515" y="110" fill="#f59e0b" font-size="14" text-anchor="middle">' + prey[item] + '</text>';
      m += '<text x="515" y="140" fill="#94a3b8" font-size="11" text-anchor="middle">card ' + (item + 1) + ' / 5</text>';
      m += '<text x="360" y="205" fill="#94a3b8" font-size="12" text-anchor="middle">Bt: eaten spores release toxin in larval gut; others unharmed.</text>';
      m += '<text x="360" y="230" fill="#94a3b8" font-size="12" text-anchor="middle">NPV: narrow-spectrum, harmless to plants/mammals/birds/fish — IPM ideal.</text>';
      svg.innerHTML = m;
      readout(cell("agent", agent[item], "#38bdf8") + cell("target", prey[item], "#f59e0b") + cell("card", (item + 1) + " / 5"));
      if(item === 2) verdict("<b>Sec 8.5:</b> <b>Bt spores</b> sprayed on brassicas/fruit trees kill <b>eaten-by-larvae (gut toxin)</b>; engineered <b>Bt-cotton</b> resists pests (more in Ch. 10).");
      else if(item === 4) verdict("<b>Sec 8.5:</b> <b>baculoviruses (NPV)</b> are <b>species-specific, narrow-spectrum</b> — safe for plants, mammals, birds, fish, non-target insects; ideal for IPM.");
      else verdict("<b>Sec 8.5:</b> " + agent[item] + " -&gt; <b>" + prey[item] + "</b>. Chemicals pollute soil/groundwater/produce; biocontrol keeps pests manageable within biodiversity.");
    } else {
      var feed = numEl("ctrl-f-range", 70);
      var ef = document.getElementById("ctrl-f"); if(ef) ef.textContent = feed >= 60 ? "steady" : (feed >= 25 ? "low" : "starved");
      var lift = feed / 100 * 55 + Math.sin(t * 2) * 2;
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Gobar-gas plant (Sec 8.4; IARI + KVIC): methanogens digest cellulose anaerobically</text>';
      m += '<rect x="80" y="90" width="200" height="150" fill="#0f1f2e" stroke="#334155"/>';
      m += '<text x="180" y="80" fill="#94a3b8" font-size="11" text-anchor="middle">concrete tank 10-15 ft</text>';
      m += '<rect x="90" y="150" width="180" height="80" fill="#3f2d0c"/>';
      m += '<text x="180" y="195" fill="#f59e0b" font-size="10" text-anchor="middle">dung slurry (gobar)</text>';
      m += '<rect x="90" y="' + (140 - lift) + '" width="180" height="18" rx="6" fill="#64748b"/>';
      m += '<text x="180" y="' + (128 - lift) + '" fill="#94a3b8" font-size="10" text-anchor="middle">cover rises with gas</text>';
      for(var i = 0; i < 7; i++){
        var bx2 = 120 + (i * 31) % 120;
        var by2 = 210 - ((t * 30 + i * 25) % 60);
        m += '<circle cx="' + bx2 + '" cy="' + by2 + '" r="4" fill="#34d399" opacity="0.9"/>';
      }
      m += '<line x1="280" y1="110" x2="420" y2="110" stroke="#34d399" stroke-width="3"/>';
      m += '<text x="480" y="95" fill="#34d399" font-size="12">CH4 (predominant)</text>';
      m += '<text x="480" y="113" fill="#94a3b8" font-size="11">+ CO2 + H2 -&gt; houses</text>';
      m += '<text x="480" y="135" fill="#e2e8f0" font-size="12">cooking + lighting</text>';
      m += '<text x="480" y="160" fill="#94a3b8" font-size="11">Methanobacterium;</text>';
      m += '<text x="480" y="178" fill="#94a3b8" font-size="11">rumen digests cellulose</text>';
      m += '<text x="480" y="200" fill="#94a3b8" font-size="11">spent slurry -&gt; fertiliser</text>';
      m += '<text x="360" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">Ex 9: yes — dung + STP digesters (CH4/H2S/CO2) are energy sources.</text>';
      svg.innerHTML = m;
      readout(cell("gas", "CH4 predominant", "#34d399") + cell("feed", feed + "%") + cell("cover", lift >= 30 ? "rising" : "low") + cell("slurry", "fertiliser"));
      verdict("<b>Sec 8.4:</b> <b>Methanobacterium</b> (also in <b>cattle rumen</b>) makes <b>biogas (CH4 predominant + CO2 + H2)</b>; <b>10-15 ft tank, floating cover rises</b>, piped for <b>cooking + lighting</b>, slurry = fertiliser (IARI + KVIC).");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["biofertiliser"] = (function(){
  var item = 0;
  var crops = ["legume (pulses)", "cereals / soil", "many crops", "paddy field"];
  var microbes = ["Rhizobium (nodules)", "Azospirillum / Azotobacter (free-living)", "Glomus mycorrhiza (fungus)", "Anabaena + Nostoc + Oscillatoria"];
  var gifts = ["fixes air N to organic plant food", "free soil N enrichment", "absorbs soil P for plant + stress cover", "fix N + add organic matter"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>N-fixers: Rhizobium / Azotobacter</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Mycorrhiza: Glomus gives P</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Paddy trio: Anabaena / Nostoc / Oscillatoria</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-rh" data-preset="p-rh">Rhizobium nodules</button>' +
      '<button class="preset-btn" id="p-my" data-preset="p-my">Glomus trade</button>' +
      '<button class="preset-btn" id="p-pa" data-preset="p-pa">Paddy trio (3)</button>';
    document.getElementById("p-rh").onclick = function(){ setActivePreset(this); item = 0; var r = document.getElementById("ctrl-i-range"); if(r) r.value = 0; draw(App.state.t); };
    document.getElementById("p-my").onclick = function(){ setActivePreset(this); item = 2; var r = document.getElementById("ctrl-i-range"); if(r) r.value = 2; draw(App.state.t); };
    document.getElementById("p-pa").onclick = function(){ setActivePreset(this); item = 3; var r = document.getElementById("ctrl-i-range"); if(r) r.value = 3; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Crop card</span><span class="val" id="ctrl-i">1 / 4</span></div>' +
      '<input type="range" id="ctrl-i-range" min="0" max="3" step="1" value="0"></div>' +
      '<div class="control-item"><div class="control-label"><span>Definition</span><span class="val">Ex 15</span></div>' +
      '<div style="font-size:12px;color:#94a3b8">organisms enriching soil nutrient quality</div></div>';
    document.getElementById("ctrl-i-range").oninput = function(){ item = numEl("ctrl-i-range", 0); draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    item = numEl("ctrl-i-range", item);
    var el = document.getElementById("ctrl-i"); if(el) el.textContent = (item + 1) + " / 4";
    var r = document.getElementById("ctrl-i-range"); if(r) r.value = item;
    var cols = ["#38bdf8", "#38bdf8", "#a78bfa", "#34d399"];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Biofertilisers (Sec 8.6; Ex 10 + 15): replace chemicals with living agents</text>';
    m += '<rect x="90" y="70" width="230" height="110" rx="8" fill="#0f1f2e" stroke="' + cols[item] + '"/>';
    m += '<text x="205" y="105" fill="#e2e8f0" font-size="13" text-anchor="middle">' + crops[item] + '</text>';
    m += '<text x="205" y="130" fill="' + cols[item] + '" font-size="11" text-anchor="middle">' + microbes[item] + '</text>';
    m += '<text x="205" y="155" fill="#94a3b8" font-size="10" text-anchor="middle">card ' + (item + 1) + ' / 4</text>';
    m += '<rect x="400" y="70" width="230" height="110" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="515" y="110" fill="#34d399" font-size="11" text-anchor="middle">' + gifts[item] + '</text>';
    if(item === 2){
      m += '<text x="515" y="135" fill="#94a3b8" font-size="10" text-anchor="middle">fungus gets shelter + food;</text>';
      m += '<text x="515" y="152" fill="#94a3b8" font-size="10" text-anchor="middle">plant resists pathogens/salt/drought</text>';
    }
    if(item === 3){
      var sway = Math.sin(t * 2) * 4;
      m += '<rect x="120" y="200" width="480" height="40" rx="8" fill="#0f2f3a" stroke="#34d399"/>';
      m += '<text x="360" y="' + (225 + sway) + '" fill="#34d399" font-size="11" text-anchor="middle">standing paddy water suits cyanobacteria -&gt; less urea</text>';
    }
    if(item === 0){
      m += '<circle cx="180" cy="220" r="16" fill="#14532d" stroke="#34d399"/>';
      m += '<circle cx="220" cy="228" r="10" fill="#14532d" stroke="#34d399"/>';
      m += '<text x="300" y="228" fill="#94a3b8" font-size="11">nodules on legume roots</text>';
    }
    svg.innerHTML = m;
    readout(cell("crop", crops[item]) + cell("microbe", microbes[item], cols[item]) + cell("gift", gifts[item], "#34d399"));
    if(item === 0) verdict("<b>Sec 8.6:</b> <b>Rhizobium</b> nodules on <b>legumes</b> fix air nitrogen to organic plant food — rotate pulses to recharge soil N.");
    else if(item === 1) verdict("<b>Sec 8.6:</b> free-living <b>Azospirillum + Azotobacter</b> enrich soil nitrogen without nodules.");
    else if(item === 2) verdict("<b>Sec 8.6:</b> <b>Glomus mycorrhiza</b>: fungus <b>absorbs soil phosphorus for the plant</b> (+pathogen/salinity/drought cover); plant gives shelter + nourishment.");
    else verdict("<b>Sec 8.6:</b> paddy trio <b>Anabaena + Nostoc + Oscillatoria</b> fix nitrogen and <b>add organic matter</b> — flooded fields fertilise themselves, cutting urea.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.ferment = window.SIMS["household-ferment"];
window.SIMS.antibiotic = window.SIMS["beverage-antibiotic"];
window.SIMS.bioactive = window.SIMS["chemical-enzyme"];
window.SIMS.sewage = window.SIMS["sewage-bod"];
window.SIMS.biogas = window.SIMS["biogas-biocontrol"];
window.SIMS.biofertiliser = window.SIMS["biofertiliser"];
