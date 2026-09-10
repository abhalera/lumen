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

window.SIMS["bacterial-viral-protozoan"] = (function(){
  var dis = 0;
  var diseases = ["Typhoid", "Pneumonia", "Common cold", "Malaria", "Amoebiasis"];
  var pathogens = ["Salmonella typhi", "Streptococcus pneumoniae / Haemophilus influenzae", "Rhinoviruses", "Plasmodium (vivax / malariae / falciparum)", "Entamoeba histolytica"];
  var spreads = ["contaminated food + water (faecal-oral)", "droplets / aerosols, shared glasses", "droplets + fomites (pens, doorknobs); nose only", "bite of infected female Anopheles", "faecal-contaminated food/water; housefly carrier"];
  var clocks = ["39-40C sustained; Widal test", "alveoli fill with fluid; grey-blue lips", "3-7 days; nose, not lungs", "chill every 3-4 days (haemozoin)", "mucous + blood stools"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Bacteria (typhoid / pneumonia)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Virus (rhinovirus)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Protozoa (Plasmodium / Entamoeba)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ty">Typhoid</button>' +
      '<button class="preset-btn" id="p-pn">Pneumonia</button>' +
      '<button class="preset-btn" id="p-co">Cold</button>' +
      '<button class="preset-btn" id="p-ma">Malaria</button>' +
      '<button class="preset-btn" id="p-am">Amoebiasis</button>';
    document.getElementById("p-ty").onclick = function(){ setActivePreset(this); dis = 0; draw(App.state.t); };
    document.getElementById("p-pn").onclick = function(){ setActivePreset(this); dis = 1; draw(App.state.t); };
    document.getElementById("p-co").onclick = function(){ setActivePreset(this); dis = 2; draw(App.state.t); };
    document.getElementById("p-ma").onclick = function(){ setActivePreset(this); dis = 3; draw(App.state.t); };
    document.getElementById("p-am").onclick = function(){ setActivePreset(this); dis = 4; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Guess the pathogen</span><span class="val">?</span></div>' +
      '<div><button class="preset-btn" id="g-b">Salmonella</button> ' +
      '<button class="preset-btn" id="g-v">Rhinovirus</button> ' +
      '<button class="preset-btn" id="g-p">Plasmodium</button></div></div>' +
      '<div class="control-item"><div class="control-label"><span>Typhoid Mary note</span><span class="val">carrier</span></div>' +
      '<div style="font-size:12px;color:#94a3b8">Cook + carrier spread typhoid via food for years</div></div>';
    document.getElementById("g-b").onclick = function(){ judge(0); };
    document.getElementById("g-v").onclick = function(){ judge(2); };
    document.getElementById("g-p").onclick = function(){ judge(3); };
    draw(0);
  }
  function judge(g){
    var ok = (g === dis) || (dis === 1 && g === 0) || (dis === 4 && g === 3);
    var trueKind = dis <= 1 ? "bacterial" : (dis === 2 ? "viral" : "protozoan");
    verdict("<b>" + (ok ? "Correct. " : "Not quite. ") + "</b>" + diseases[dis] + " is <b>" + trueKind + "</b>: " + pathogens[dis] + " via " + spreads[dis] + " (Section 7.1).");
    draw(App.state.t);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var cols = ["#f87171", "#f87171", "#38bdf8", "#a78bfa", "#a78bfa"];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Disease -&gt; pathogen -&gt; route (Sec 7.1; Ex Q3)</text>';
    m += '<circle cx="150" cy="140" r="44" fill="#0f1f2e" stroke="' + cols[dis] + '" stroke-width="3"/>';
    m += '<text x="150" y="135" fill="#e2e8f0" font-size="11" text-anchor="middle">' + diseases[dis] + '</text>';
    m += '<text x="150" y="152" fill="#94a3b8" font-size="9" text-anchor="middle">' + clocks[dis] + '</text>';
    var pulse = 300 + Math.sin(t * 3) * 10;
    m += '<line x1="200" y1="140" x2="420" y2="140" stroke="#334155" stroke-width="2" stroke-dasharray="5 4"/>';
    m += '<circle cx="' + pulse + '" cy="140" r="8" fill="' + cols[dis] + '"/>';
    m += '<rect x="430" y="90" width="220" height="100" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="540" y="115" fill="#e2e8f0" font-size="11" text-anchor="middle">' + pathogens[dis] + '</text>';
    m += '<text x="540" y="138" fill="#94a3b8" font-size="10" text-anchor="middle">' + spreads[dis] + '</text>';
    m += '<text x="540" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">' + clocks[dis] + '</text>';
    m += '<text x="360" y="230" fill="#94a3b8" font-size="12" text-anchor="middle">Gut pathogens survive stomach acid + enzymes; then multiply + damage.</text>';
    m += '<text x="360" y="252" fill="#94a3b8" font-size="12" text-anchor="middle">Malignant malaria = P. falciparum (most serious, can be fatal).</text>';
    svg.innerHTML = m;
    readout(cell("disease", diseases[dis], cols[dis]) + cell("pathogen", pathogens[dis]) + cell("spread", spreads[dis]) + cell("clock", clocks[dis]));
    if(dis === 0) verdict("<b>Section 7.1:</b> sustained <b>39-40C</b> + stomach pain/constipation fits typhoid; confirm by <b>Widal test</b> — fever alone is not enough. <b>Typhoid Mary (Mallon)</b> = carrier spread.");
    else if(dis === 2) verdict("<b>Section 7.1:</b> rhinovirus cold infects <b>nose + passage, not lungs</b>; <b>3-7 days</b>; droplets + fomites. Comfortable deep breathing points away from pneumonia.");
    else if(dis === 3) verdict("<b>Fig. 7.1:</b> sporozoites -&gt; liver -&gt; RBC rupture + <b>haemozoin</b> chill <b>every 3-4 days</b>; mosquito salivary glands hold sporozoites — <b>two hosts</b>.");
    else if(dis === 4) verdict("<b>Section 7.1 / Ex Q3:</b> <b>Entamoeba histolytica</b> (large intestine): mucous/blood stools; faecal food/water + <b>housefly mechanical carrier</b>.");
    else verdict("<b>Section 7.1:</b> pneumonia infects <b>alveoli (fluid-filled)</b>; fever/chills/cough; droplets or <b>shared glasses</b>; severe = grey-blue lips/nails. Dysentery/plague/diphtheria are other bacterial cases.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["helminth-fungal-hygiene"] = (function(){
  var mode = "plas";
  var step = 0;
  var stages = ["sporozoites in (Anopheles bite)", "multiply in liver cells", "attack RBCs; rupture + haemozoin", "mosquito gut -&gt; salivary sporozoites"];
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Human stages (liver / RBC)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Mosquito stages (vector + host)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Hygiene break</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pl">Plasmodium stepper</button>' +
      '<button class="preset-btn" id="p-as">Ascaris (faecal-oral)</button>' +
      '<button class="preset-btn" id="p-wu">Wuchereria (vector)</button>' +
      '<button class="preset-btn" id="p-rw">Ringworm (fomite)</button>';
    document.getElementById("p-pl").onclick = function(){ setActivePreset(this); mode = "plas"; draw(App.state.t); };
    document.getElementById("p-as").onclick = function(){ setActivePreset(this); mode = "asc"; draw(App.state.t); };
    document.getElementById("p-wu").onclick = function(){ setActivePreset(this); mode = "wuch"; draw(App.state.t); };
    document.getElementById("p-rw").onclick = function(){ setActivePreset(this); mode = "ring"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Cycle step</span><span class="val" id="ctrl-s">1 / 4</span></div>' +
      '<div><button class="preset-btn" id="b-p">Prev</button> <button class="preset-btn" id="b-n">Next</button></div></div>' +
      '<div class="control-item"><div class="control-label"><span>Vector break</span><span class="val">Gambusia</span></div>' +
      '<div style="font-size:12px;color:#94a3b8">nets, no stagnation, Gambusia, insecticides, mesh</div></div>';
    document.getElementById("b-p").onclick = function(){ step = Math.max(0, step - 1); App.state.t = step; var sc = document.getElementById("time-scrubber"); if(sc) sc.value = step; draw(step); };
    document.getElementById("b-n").onclick = function(){ step = Math.min(3, step + 1); App.state.t = step; var sc = document.getElementById("time-scrubber"); if(sc) sc.value = step; draw(step); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    step = Math.max(0, Math.min(3, Math.round(t)));
    var elb = document.getElementById("ctrl-s"); if(elb) elb.textContent = (step + 1) + " / 4";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "plas"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Plasmodium cycle (Fig. 7.1): human + female Anopheles; step ' + (step + 1) + '/4</text>';
      var i, hx;
      for(i = 0; i < 4; i++){
        hx = 90 + i * 150;
        var hot = (i === step);
        m += '<rect x="' + hx + '" y="80" width="130" height="90" rx="8" fill="' + (hot ? '#1e3a5f' : '#0f1f2e') + '" stroke="' + (hot ? '#34d399' : '#334155') + '" stroke-width="' + (hot ? 3 : 1) + '"/>';
        m += '<text x="' + (hx + 65) + '" y="115" fill="#e2e8f0" font-size="10" text-anchor="middle">' + stages[i] + '</text>';
        if(i === 2) m += '<text x="' + (hx + 65) + '" y="140" fill="#f87171" font-size="10" text-anchor="middle">chill 3-4 days</text>';
        if(i === 3) m += '<text x="' + (hx + 65) + '" y="140" fill="#38bdf8" font-size="10" text-anchor="middle">vector + host</text>';
      }
      m += '<rect x="90" y="200" width="280" height="60" rx="8" fill="#3a1111" stroke="#f87171"/>';
      m += '<text x="230" y="224" fill="#f87171" font-size="12" text-anchor="middle">HUMAN: liver -&gt; RBC</text>';
      m += '<rect x="390" y="200" width="240" height="60" rx="8" fill="#0f2f3a" stroke="#38bdf8"/>';
      m += '<text x="510" y="224" fill="#38bdf8" font-size="12" text-anchor="middle">MOSQUITO: gut -&gt; glands</text>';
      svg.innerHTML = m;
      readout(cell("step", (step + 1) + " / 4") + cell("stage", stages[step]) + cell("vector", "female Anopheles", "#38bdf8") + cell("fever", "3-4 days", "#f87171"));
      verdict("<b>Fig. 7.1:</b> " + stages[step] + ". Rupture dumps <b>haemozoin</b> = chill clock; <b>female Anopheles is vector + second host</b>. Break with nets, <b>Gambusia</b>, drainage, mesh (dengue/chikungunya = Aedes).");
    } else if(mode === "asc"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Ascariasis (Ascaris, roundworm): faecal-oral chain</text>';
      m += '<text x="360" y="90" fill="#e2e8f0" font-size="13" text-anchor="middle">eggs in faeces -&gt; soil/water/plants -&gt; mouth</text>';
      m += '<text x="360" y="120" fill="#f87171" font-size="12" text-anchor="middle">bleeding, muscular pain, fever, anemia, intestinal blockage</text>';
      m += '<text x="360" y="155" fill="#34d399" font-size="13" text-anchor="middle">BREAK: waste disposal + clean water/food/produce</text>';
      m += '<text x="360" y="190" fill="#94a3b8" font-size="12" text-anchor="middle">Same chain as Entamoeba: public hygiene stops both (Ex Q1/Q4).</text>';
      svg.innerHTML = m;
      readout(cell("worm", "Ascaris") + cell("chain", "faecal-oral", "#f87171") + cell("break", "clean water", "#34d399"));
      verdict("<b>Section 7.1:</b> <b>Ascaris</b> eggs pass in faeces, contaminate soil/water/plants; infection via produce/water. Fix: <b>proper waste disposal + clean drinking water/food</b> (Ex Q1).");
    } else if(mode === "wuch"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Elephantiasis (Wuchereria bancrofti / malayi, Fig. 7.2)</text>';
      m += '<text x="360" y="90" fill="#e2e8f0" font-size="13" text-anchor="middle">female mosquito bite -&gt; lymphatic vessels, years</text>';
      m += '<text x="360" y="120" fill="#f87171" font-size="12" text-anchor="middle">chronic lower-limb swelling + genital deformity</text>';
      m += '<text x="360" y="155" fill="#34d399" font-size="13" text-anchor="middle">BREAK: nets, Gambusia, insecticides, no stagnation, mesh</text>';
      svg.innerHTML = m;
      readout(cell("worm", "Wuchereria") + cell("chain", "vector bite", "#38bdf8") + cell("break", "nets + fish", "#34d399"));
      verdict("<b>Section 7.1 / Fig. 7.2:</b> <b>W. bancrofti / W. malayi</b> inflame lymphatics over years (lower limbs). Same vector-borne break as malaria: <b>no stagnant water, coolers, nets, Gambusia, insecticides, mesh</b>.");
    } else {
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Ringworm (Microsporum / Trichophyton / Epidermophyton, Fig. 7.3)</text>';
      m += '<text x="360" y="90" fill="#e2e8f0" font-size="13" text-anchor="middle">dry scaly skin / nails / scalp + intense itching</text>';
      m += '<text x="360" y="120" fill="#f59e0b" font-size="12" text-anchor="middle">heat + moisture (groin, toes); soil, towels, clothes, combs</text>';
      m += '<text x="360" y="155" fill="#34d399" font-size="13" text-anchor="middle">BREAK: personal hygiene; no sharing; keep dry</text>';
      svg.innerHTML = m;
      readout(cell("fungi", "3 genera") + cell("chain", "fomite", "#f59e0b") + cell("break", "hygiene", "#34d399"));
      verdict("<b>Section 7.1 / Fig. 7.3:</b> <b>Microsporum, Trichophyton, Epidermophyton</b> thrive in <b>heat + moisture</b>; spread via <b>towels/clothes/combs/soil</b>. Personal hygiene + no sharing breaks it.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["innate-acquired-immunity"] = (function(){
  var mode = "sort";
  var item = 0;
  var items = ["skin + mucus", "stomach acid / tears", "PMNL-neutrophils / macrophages", "interferons", "B-cell antibodies + memory", "T-cell CMI / graft rejection"];
  var kind = ["I", "I", "I", "I", "A", "A"];
  var h = 2, l = 2;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Innate: birth, non-specific, 4 barriers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Acquired: specific + memory (B/T)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Antibody H2L2 (Fig. 7.4)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-so">Barrier sorter</button>' +
      '<button class="preset-btn" id="p-me">Memory: primary vs secondary</button>' +
      '<button class="preset-btn" id="p-ab">H2L2 builder (Ex Q9)</button>';
    document.getElementById("p-so").onclick = function(){ setActivePreset(this); mode = "sort"; draw(App.state.t); };
    document.getElementById("p-me").onclick = function(){ setActivePreset(this); mode = "mem"; draw(App.state.t); };
    document.getElementById("p-ab").onclick = function(){ setActivePreset(this); mode = "ab"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Classifier item</span><span class="val" id="ctrl-i">1 / 6</span></div>' +
      '<div><button class="preset-btn" id="b-in">Innate</button> <button class="preset-btn" id="b-ac">Acquired</button></div></div>' +
      '<div class="control-item"><div class="control-label"><span>H2L2 chains</span><span class="val" id="ctrl-h">2H + 2L</span></div>' +
      '<div><button class="preset-btn" id="b-h">+ Heavy</button> <button class="preset-btn" id="b-l">+ Light</button> <button class="preset-btn" id="b-r">Reset</button></div></div>';
    document.getElementById("b-in").onclick = function(){ judge("I"); };
    document.getElementById("b-ac").onclick = function(){ judge("A"); };
    document.getElementById("b-h").onclick = function(){ if(h < 2) h++; draw(App.state.t); };
    document.getElementById("b-l").onclick = function(){ if(l < 2) l++; draw(App.state.t); };
    document.getElementById("b-r").onclick = function(){ h = 0; l = 0; draw(App.state.t); };
    draw(0);
  }
  function judge(g){
    var ok = (g === kind[item]);
    verdict("<b>" + (ok ? "Correct. " : "Not quite. ") + "</b>" + items[item] + " is <b>" + (kind[item] === "I" ? "innate" : "acquired") + "</b> (Section 7.2.1-7.2.2; Ex Q8a). Innate = physical/physiological/cellular/cytokine; acquired = B/T + memory.");
    item = (item + 1) % 6;
    draw(App.state.t);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var elb = document.getElementById("ctrl-i"); if(elb) elb.textContent = (item + 1) + " / 6";
    var hb = document.getElementById("ctrl-h"); if(hb) hb.textContent = h + "H + " + l + "L";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "ab"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Antibody = H2L2: 2 heavy (long, inner) + 2 light (small, outer) (Fig. 7.4)</text>';
      var cx = 300, cy = 150;
      m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx - 45) + '" y2="' + (cy - 55) + '" stroke="' + (h >= 1 ? '#34d399' : '#334155') + '" stroke-width="10"/>';
      m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 45) + '" y2="' + (cy - 55) + '" stroke="' + (h >= 2 ? '#34d399' : '#334155') + '" stroke-width="10"/>';
      m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + (cy + 60) + '" stroke="#34d399" stroke-width="12"/>';
      if(l >= 1) m += '<line x1="' + (cx - 22) + '" y1="' + (cy - 25) + '" x2="' + (cx - 55) + '" y2="' + (cy - 60) + '" stroke="#38bdf8" stroke-width="6"/>';
      if(l >= 2) m += '<line x1="' + (cx + 22) + '" y1="' + (cy - 25) + '" x2="' + (cx + 55) + '" y2="' + (cy - 60) + '" stroke="#38bdf8" stroke-width="6"/>';
      m += '<circle cx="' + (cx - 45) + '" cy="' + (cy - 55) + '" r="7" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      m += '<circle cx="' + (cx + 45) + '" cy="' + (cy - 55) + '" r="7" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="300" y="245" fill="#94a3b8" font-size="11" text-anchor="middle">tips bind antigen; classes IgA / IgM / IgE / IgG</text>';
      m += '<text x="520" y="120" fill="#e2e8f0" font-size="13">chains: ' + h + 'H + ' + l + 'L ' + ((h === 2 && l === 2) ? "= COMPLETE" : "(build to 2+2)") + '</text>';
      m += '<text x="520" y="145" fill="#94a3b8" font-size="11">humoral = blood antibodies;</text>';
      m += '<text x="520" y="162" fill="#94a3b8" font-size="11">CMI = T-lymphocytes</text>';
      m += '<text x="520" y="185" fill="#94a3b8" font-size="11">graft rejection = CMI;</text>';
      m += '<text x="520" y="202" fill="#94a3b8" font-size="11">matching + lifelong drugs</text>';
      svg.innerHTML = m;
      readout(cell("heavy", h + " / 2", "#34d399") + cell("light", l + " / 2", "#38bdf8") + cell("total", (h + l) + " / 4") + cell("classes", "IgA/M/E/G"));
      if(h === 2 && l === 2) verdict("<b>Ex Q9 / Fig. 7.4:</b> complete <b>H2L2 Y</b> — 2 longer heavy chains (stem + arms) + 2 smaller light chains, <b>variable tips bind antigen</b>. B cells = humoral arm; T cells = CMI.");
      else verdict("<b>Fig. 7.4 builder:</b> add chains to reach <b>2 heavy + 2 light = 4</b>. Heavy = inner/longer; light = outer/smaller. No tRNA-style shortcut — tips do the recognition.");
    } else if(mode === "mem"){
      var ph = 0.5 + 0.5 * Math.sin(t * 2);
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Memory: primary (low) -&gt; secondary/anamnestic (high, fast)</text>';
      m += '<line x1="90" y1="230" x2="630" y2="230" stroke="#475569"/>';
      m += '<line x1="90" y1="230" x2="90" y2="60" stroke="#475569"/>';
      m += '<rect x="140" y="180" width="120" height="50" fill="#1e293b" stroke="#64748b"/>';
      m += '<text x="200" y="208" fill="#94a3b8" font-size="11" text-anchor="middle">primary: low</text>';
      var sh = 60 + ph * 40;
      m += '<rect x="380" y="' + (230 - 50 - sh) + '" width="140" height="' + (50 + sh) + '" fill="#064e3b" stroke="#34d399"/>';
      m += '<text x="450" y="' + (230 - 50 - sh + 25) + '" fill="#34d399" font-size="11" text-anchor="middle">secondary: HIGH</text>';
      m += '<text x="360" y="262" fill="#94a3b8" font-size="12" text-anchor="middle">Same pathogen again = rapid massive antibodies (basis of vaccination, Sec 7.2.4).</text>';
      svg.innerHTML = m;
      readout(cell("primary", "low / slow") + cell("secondary", "high / fast", "#34d399") + cell("agents", "memory B + T"));
      verdict("<b>Section 7.2.2:</b> first encounter = <b>low primary</b>; re-encounter = <b>intensified secondary (anamnestic)</b>. The body remembers — vaccination installs memory, not instant cure.");
    } else {
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Sorter item ' + (item + 1) + '/6: ' + items[item] + ' — Innate or Acquired?</text>';
      m += '<rect x="200" y="70" width="320" height="70" rx="8" fill="#0f1f2e" stroke="#38bdf8"/>';
      m += '<text x="360" y="112" fill="#e2e8f0" font-size="14" text-anchor="middle">' + items[item] + '</text>';
      m += '<text x="360" y="175" fill="#94a3b8" font-size="12" text-anchor="middle">Innate barriers: (i) skin/mucus (ii) acid/saliva/tears</text>';
      m += '<text x="360" y="197" fill="#94a3b8" font-size="12" text-anchor="middle">(iii) PMNL/monocyte/NK/macrophage (iv) interferons</text>';
      m += '<text x="360" y="225" fill="#94a3b8" font-size="12" text-anchor="middle">Acquired: pathogen-specific, B antibodies + T help, memory.</text>';
      svg.innerHTML = m;
      readout(cell("item", items[item]) + cell("answer", kind[item] === "I" ? "innate" : "acquired", kind[item] === "I" ? "#38bdf8" : "#a78bfa"));
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["vaccination-allergy-lymphoid"] = (function(){
  var mode = "sort";
  var item = 0;
  var organs = ["bone marrow", "thymus", "spleen", "lymph nodes", "tonsils", "Peyers patches", "appendix"];
  var kind = ["P", "P", "S", "S", "S", "S", "S"];
  var malt = 50;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Primary: marrow / thymus</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Secondary: spleen / nodes / MALT</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Allergy: IgE - histamine</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-so">Organ sorter (Ex Q6)</button>' +
      '<button class="preset-btn" id="p-ma">MALT 50%</button>' +
      '<button class="preset-btn" id="p-al">Active/passive + allergy</button>';
    document.getElementById("p-so").onclick = function(){ setActivePreset(this); mode = "sort"; draw(App.state.t); };
    document.getElementById("p-ma").onclick = function(){ setActivePreset(this); mode = "malt"; draw(App.state.t); };
    document.getElementById("p-al").onclick = function(){ setActivePreset(this); mode = "alg"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Organ</span><span class="val" id="ctrl-o">1 / 7</span></div>' +
      '<div><button class="preset-btn" id="b-p">Primary</button> <button class="preset-btn" id="b-s">Secondary</button></div></div>' +
      '<div class="control-item"><div class="control-label"><span>MALT share</span><span class="val" id="ctrl-m">50%</span></div>' +
      '<input type="range" id="ctrl-m-range" min="0" max="100" step="1" value="50"></div>';
    document.getElementById("b-p").onclick = function(){ judge("P"); };
    document.getElementById("b-s").onclick = function(){ judge("S"); };
    document.getElementById("ctrl-m-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function judge(g){
    var ok = (g === kind[item]);
    verdict("<b>" + (ok ? "Correct. " : "Not quite. ") + "</b>" + organs[item] + " is <b>" + (kind[item] === "P" ? "primary (maturation)" : "secondary (interaction)") + "</b> (Section 7.2.7; Ex Q6). Primary = marrow + thymus only.");
    item = (item + 1) % 7;
    draw(App.state.t);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    malt = numEl("ctrl-m-range", 50);
    var el = document.getElementById("ctrl-m"); if(el) el.textContent = malt;
    var eo = document.getElementById("ctrl-o"); if(eo) eo.textContent = (item + 1) + " / 7";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "malt"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">MALT = mucosa-associated tissue: respiratory + digestive + urogenital linings</text>';
      m += '<rect x="150" y="80" width="420" height="60" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<rect x="150" y="80" width="' + (420 * malt / 100) + '" height="60" fill="#7c3aed"/>';
      m += '<text x="360" y="115" fill="#f8fafc" font-size="14" text-anchor="middle">MALT ' + malt + '% ' + (malt === 50 ? '(textbook value)' : '(drag to 50)') + '</text>';
      m += '<text x="360" y="170" fill="#94a3b8" font-size="12" text-anchor="middle">Your slider: ' + malt + '% vs book: about 50% (Sec 7.2.7).</text>';
      m += '<text x="360" y="195" fill="#94a3b8" font-size="12" text-anchor="middle">Spleen filters blood microbes; nodes trap lymph antigens.</text>';
      m += '<text x="360" y="220" fill="#94a3b8" font-size="12" text-anchor="middle">Thymus large at birth, tiny by puberty; marrow makes all blood cells.</text>';
      svg.innerHTML = m;
      readout(cell("MALT", malt + "%", malt === 50 ? "#34d399" : "#f59e0b") + cell("book", "50%") + cell("gap", Math.abs(malt - 50) + "%"));
      if(malt === 50) verdict("<b>Section 7.2.7 / Ex Q7:</b> <b>MALT ~ 50%</b> of lymphoid tissue — the biggest garrison guards the mucosae (respiratory/digestive/urogenital), not the blood.");
      else verdict("<b>Section 7.2.7:</b> drag to <b>50%</b> — the textbook share of mucosa-associated lymphoid tissue. Primary stays marrow + thymus.");
    } else if(mode === "alg"){
      var pulse = 200 + Math.sin(t * 3) * 6;
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Active (slow, self-made) vs passive (ready-made) + allergy axis</text>';
      m += '<rect x="80" y="60" width="250" height="90" rx="8" fill="#0f2f3a" stroke="#38bdf8"/>';
      m += '<text x="205" y="88" fill="#38bdf8" font-size="12" text-anchor="middle">ACTIVE: infection / vaccine</text>';
      m += '<text x="205" y="110" fill="#94a3b8" font-size="10" text-anchor="middle">memory B+T; hepatitis-B yeast</text>';
      m += '<rect x="390" y="60" width="250" height="90" rx="8" fill="#3a2a0f" stroke="#f59e0b"/>';
      m += '<text x="515" y="88" fill="#f59e0b" font-size="12" text-anchor="middle">PASSIVE: colostrum IgA</text>';
      m += '<text x="515" y="110" fill="#94a3b8" font-size="10" text-anchor="middle">placenta; tetanus antitoxin</text>';
      m += '<text x="360" y="175" fill="#e2e8f0" font-size="12" text-anchor="middle">allergen -&gt; IgE -&gt; mast-cell histamine + serotonin</text>';
      m += '<circle cx="' + pulse + '" cy="205" r="9" fill="#f59e0b"/>';
      m += '<text x="360" y="235" fill="#94a3b8" font-size="11" text-anchor="middle">relief: anti-histamine / adrenalin / steroids. Autoimmunity: self-attack (rheumatoid arthritis).</text>';
      svg.innerHTML = m;
      readout(cell("active", "slow + memory", "#38bdf8") + cell("passive", "ready-made", "#f59e0b") + cell("allergy Ab", "IgE") + cell("chemicals", "histamine"));
      verdict("<b>Sections 7.2.3-7.2.5 / Ex Q8b:</b> tetanus wound today = <b>preformed antitoxin (passive)</b>; vaccine alone is too slow. Allergy = <b>allergen-IgE-mast-histamine/serotonin</b>; autoimmunity = <b>rheumatoid arthritis</b> example.");
    } else {
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Sorter ' + (item + 1) + '/7: ' + organs[item] + ' — Primary or Secondary? (Ex Q6)</text>';
      m += '<rect x="200" y="70" width="320" height="70" rx="8" fill="#0f1f2e" stroke="#a78bfa"/>';
      m += '<text x="360" y="112" fill="#e2e8f0" font-size="15" text-anchor="middle">' + organs[item] + '</text>';
      m += '<text x="360" y="175" fill="#94a3b8" font-size="12" text-anchor="middle">Primary: origin/maturation (marrow, thymus).</text>';
      m += '<text x="360" y="197" fill="#94a3b8" font-size="12" text-anchor="middle">Secondary: interaction -&gt; effectors (spleen, nodes, tonsils, Peyers, appendix).</text>';
      svg.innerHTML = m;
      readout(cell("organ", organs[item]) + cell("answer", kind[item] === "P" ? "primary" : "secondary", kind[item] === "P" ? "#38bdf8" : "#a78bfa"));
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["aids"] = (function(){
  var mode = "rep";
  var step = 0;
  var stages = ["virus enters macrophages", "RNA -&gt; DNA (reverse transcriptase)", "DNA integrates; factory makes virions", "helper-T (TH) falls; opportunistic attack"];
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>HIV retrovirus (RNA + envelope)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Macrophage factory</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Helper-T fall (5-10 yr lag)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-r">Replication stepper (Fig. 7.6)</button>' +
      '<button class="preset-btn" id="p-m">Myth-buster: touch?</button>';
    document.getElementById("p-r").onclick = function(){ setActivePreset(this); mode = "rep"; draw(App.state.t); };
    document.getElementById("p-m").onclick = function(){ setActivePreset(this); mode = "myth"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Step</span><span class="val" id="ctrl-s">1 / 4</span></div>' +
      '<div><button class="preset-btn" id="b-p">Prev</button> <button class="preset-btn" id="b-n">Next</button></div></div>' +
      '<div class="control-item"><div class="control-label"><span>Myth test</span><span class="val">body fluids only</span></div>' +
      '<div><button class="preset-btn" id="b-touch">Hug spreads HIV?</button> <button class="preset-btn" id="b-needle">Shared needle?</button></div></div>';
    document.getElementById("b-p").onclick = function(){ step = Math.max(0, step - 1); App.state.t = step; var sc = document.getElementById("time-scrubber"); if(sc) sc.value = step; draw(step); };
    document.getElementById("b-n").onclick = function(){ step = Math.min(3, step + 1); App.state.t = step; var sc = document.getElementById("time-scrubber"); if(sc) sc.value = step; draw(step); };
    document.getElementById("b-touch").onclick = function(){ verdict("<b>Myth BUSTED (Sec 7.3):</b> <b>HIV is NOT spread by touch/hug/bench</b> — body fluids only. Do NOT isolate patients; give help + sympathy. (Ex Q10)."); draw(App.state.t); };
    document.getElementById("b-needle").onclick = function(){ verdict("<b>TRUE route (Sec 7.3):</b> <b>shared IV needles</b> transmit via blood — use <b>disposable syringes</b>. Other routes: sex, contaminated blood, placenta. <b>ELISA</b> diagnoses; ART only prolongs."); draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var elb = document.getElementById("ctrl-s"); if(elb) elb.textContent = (step + 1) + " / 4";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "myth"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Myth-buster: only 4 fluid routes; NEVER touch (Sec 7.3)</text>';
      var routes = ["sex", "blood", "shared needles", "placenta"];
      var i, rx;
      for(i = 0; i < 4; i++){
        rx = 100 + i * 140;
        m += '<rect x="' + rx + '" y="80" width="120" height="60" rx="8" fill="#3a1111" stroke="#f87171"/>';
        m += '<text x="' + (rx + 60) + '" y="115" fill="#f87171" font-size="11" text-anchor="middle">' + routes[i] + '</text>';
      }
      var myths = ["hug", "bench", "mosquito"];
      for(i = 0; i < 3; i++){
        rx = 150 + i * 150;
        m += '<rect x="' + rx + '" y="170" width="120" height="55" rx="8" fill="#0f2f3a" stroke="#34d399"/>';
        m += '<text x="' + (rx + 60) + '" y="192" fill="#94a3b8" font-size="11" text-anchor="middle">' + myths[i] + '</text>';
        m += '<text x="' + (rx + 60) + '" y="210" fill="#34d399" font-size="11" text-anchor="middle">NO</text>';
      }
      m += '<text x="360" y="262" fill="#94a3b8" font-size="12" text-anchor="middle">NACO + WHO: safe blood, disposables, condoms, safe sex. First reported 1981; 25M+ dead.</text>';
      svg.innerHTML = m;
      readout(cell("routes", "4 fluid only", "#f87171") + cell("touch", "never", "#34d399") + cell("test", "ELISA") + cell("lag", "5-10 yr"));
    } else {
      step = Math.max(0, Math.min(3, Math.round(t)));
      if(elb) elb.textContent = (step + 1) + " / 4";
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Retrovirus replication (Fig. 7.6): step ' + (step + 1) + '/4 — ' + stages[step] + '</text>';
      m += '<circle cx="160" cy="150" r="40" fill="#0f1f2e" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="160" y="145" fill="#38bdf8" font-size="11" text-anchor="middle">macro-</text>';
      m += '<text x="160" y="160" fill="#38bdf8" font-size="11" text-anchor="middle">phage</text>';
      m += '<circle cx="360" cy="150" r="26" fill="none" stroke="#f87171" stroke-width="3"/>';
      m += '<text x="360" y="155" fill="#f87171" font-size="10" text-anchor="middle">HIV RNA</text>';
      var th = 100 - step * 22;
      m += '<rect x="500" y="100" width="120" height="100" rx="8" fill="#0f1f2e" stroke="#a78bfa"/>';
      m += '<rect x="510" y="' + (190 - th) + '" width="100" height="' + th + '" fill="#7c3aed"/>';
      m += '<text x="560" y="215" fill="#94a3b8" font-size="10" text-anchor="middle">helper-T</text>';
      m += '<text x="360" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">Opportunistic: Mycobacterium / viruses / fungi / Toxoplasma. ART prolongs, never cures.</text>';
      svg.innerHTML = m;
      readout(cell("step", (step + 1) + " / 4") + cell("enzyme", "reverse transcriptase", "#f87171") + cell("factory", "macrophage") + cell("helper-T", step >= 3 ? "fallen" : "falling", "#a78bfa"));
      verdict("<b>Ex Q11 / Fig. 7.6:</b> " + stages[step] + ". Progeny attack other <b>helper T-lymphocytes</b> — progressive fall + fever/diarrhoea/weight loss. <b>ELISA</b> diagnoses; drugs only <b>prolong life</b>.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["cancer"] = (function(){
  var mode = "sort";
  var item = 0;
  var feats = ["stays confined, little damage", "invades + damages tissue", "starves normal cells", "travels in blood, seeds new tumours", "contact inhibition LOST", "tobacco smoke -&gt; lung cancer"];
  var kind = ["B", "M", "M", "M", "M", "M"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Benign: confined</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Malignant: invade / starve / metastasise</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-so">Benign vs malignant (Ex Q12)</button>' +
      '<button class="preset-btn" id="p-me">Metastasis path (Ex Q13)</button>' +
      '<button class="preset-btn" id="p-ca">Carcinogens + detect-treat</button>';
    document.getElementById("p-so").onclick = function(){ setActivePreset(this); mode = "sort"; draw(App.state.t); };
    document.getElementById("p-me").onclick = function(){ setActivePreset(this); mode = "met"; draw(App.state.t); };
    document.getElementById("p-ca").onclick = function(){ setActivePreset(this); mode = "car"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Feature</span><span class="val" id="ctrl-f">1 / 6</span></div>' +
      '<div><button class="preset-btn" id="b-b">Benign</button> <button class="preset-btn" id="b-m">Malignant</button></div></div>';
    document.getElementById("b-b").onclick = function(){ judge("B"); };
    document.getElementById("b-m").onclick = function(){ judge("M"); };
    draw(0);
  }
  function judge(g){
    var ok = (g === kind[item]);
    verdict("<b>" + (ok ? "Correct. " : "Not quite. ") + "</b>" + feats[item] + " is <b>" + (kind[item] === "B" ? "benign" : "malignant") + "</b> (Section 7.4; Ex Q12). Only item 1 is benign — the rest define malignancy.");
    item = (item + 1) % 6;
    draw(App.state.t);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var el = document.getElementById("ctrl-f"); if(el) el.textContent = (item + 1) + " / 6";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "met"){
      var px = 150 + (t / 6) * 400;
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Metastasis (Ex Q13): sloughed cells ride blood to seed new tumours</text>';
      m += '<circle cx="150" cy="150" r="40" fill="#3a1111" stroke="#f87171" stroke-width="2"/>';
      m += '<text x="150" y="155" fill="#f87171" font-size="10" text-anchor="middle">primary</text>';
      m += '<line x1="190" y1="150" x2="560" y2="150" stroke="#f87171" stroke-width="3"/>';
      m += '<text x="375" y="135" fill="#94a3b8" font-size="11" text-anchor="middle">blood route</text>';
      m += '<circle cx="' + px + '" cy="150" r="10" fill="#f87171"/>';
      m += '<circle cx="560" cy="150" r="26" fill="#3a1111" stroke="#f87171" stroke-width="2"/>';
      m += '<text x="560" y="155" fill="#f87171" font-size="9" text-anchor="middle">new</text>';
      m += '<text x="360" y="230" fill="#94a3b8" font-size="12" text-anchor="middle">Most feared property; 1M+ Indians suffer; early detection curable in many cases.</text>';
      svg.innerHTML = m;
      readout(cell("route", "blood", "#f87171") + cell("seed", "distant tumour") + cell("property", "most feared"));
      verdict("<b>Ex Q13:</b> <b>metastasis</b> = cells sloughed from malignant tumours travel <b>through blood</b>, lodge elsewhere, start <b>new tumours</b>. Benign never does this.");
    } else if(mode === "car"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Carcinogens -&gt; detect -&gt; treat (Sec 7.4)</text>';
      m += '<text x="120" y="90" fill="#f87171" font-size="12">X-rays / gamma + UV</text>';
      m += '<text x="120" y="115" fill="#f87171" font-size="12">tobacco smoke (lung)</text>';
      m += '<text x="120" y="140" fill="#f87171" font-size="12">oncoviruses + c-onc</text>';
      m += '<text x="420" y="90" fill="#38bdf8" font-size="12">biopsy / counts / CT / MRI</text>';
      m += '<text x="420" y="115" fill="#38bdf8" font-size="12">antibodies / genes</text>';
      m += '<text x="420" y="140" fill="#34d399" font-size="12">surgery + radio + chemo</text>';
      m += '<text x="420" y="165" fill="#34d399" font-size="12">+ alpha-interferon (immune)</text>';
      m += '<text x="360" y="220" fill="#94a3b8" font-size="12" text-anchor="middle">Chemo side effects: hair loss, anemia. MRI = non-ionising; CT = X-ray 3-D.</text>';
      svg.innerHTML = m;
      readout(cell("physical", "X/gamma/UV", "#f87171") + cell("chemical", "tobacco", "#f87171") + cell("treat", "4 combined", "#34d399"));
      verdict("<b>Section 7.4:</b> detect by <b>biopsy/histopathology, counts (leukaemia), CT/MRI, antibodies, genes</b>; treat <b>surgery + radiotherapy + chemotherapy + alpha-interferon</b>, mostly combined.");
    } else {
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Sorter ' + (item + 1) + '/6: ' + feats[item] + ' — Benign or Malignant?</text>';
      m += '<rect x="170" y="70" width="380" height="70" rx="8" fill="#0f1f2e" stroke="#f87171"/>';
      m += '<text x="360" y="112" fill="#e2e8f0" font-size="13" text-anchor="middle">' + feats[item] + '</text>';
      m += '<text x="360" y="175" fill="#94a3b8" font-size="12" text-anchor="middle">Normal: controlled + contact inhibition. Cancer: inhibition lost, tumours.</text>';
      svg.innerHTML = m;
      readout(cell("feature", feats[item]) + cell("answer", kind[item] === "B" ? "benign" : "malignant", kind[item] === "B" ? "#34d399" : "#f87171"));
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["drugs-alcohol"] = (function(){
  var mode = "sort";
  var item = 0;
  var feats = ["euphoria craving, higher doses needed", "anxiety + shakiness on stopping", "nausea + sweating on stopping", "opioids -&gt; CNS/GIT receptors", "cocaine -&gt; dopamine transport", "nicotine -&gt; adrenaline, BP up"];
  var kind = ["A", "D", "D", "A", "A", "A"];
  var tag = ["addiction (tolerance loop)", "dependence (withdrawal)", "dependence (withdrawal)", "drug map", "drug map", "drug map"];
  var checks = [false, false, false, false, false];
  var steps5 = ["guard peer pressure", "counsel + yoga/sports", "parents/peers help", "watch + report signs", "de-addiction / rehab"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Addiction: craving + tolerance</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Dependence: withdrawal syndrome</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Prevention ladder (5)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-so">Addiction vs dependence (Ex Q16)</button>' +
      '<button class="preset-btn" id="p-dr">Drug-receptor map</button>' +
      '<button class="preset-btn" id="p-pr">Prevention planner (5 steps)</button>';
    document.getElementById("p-so").onclick = function(){ setActivePreset(this); mode = "sort"; draw(App.state.t); };
    document.getElementById("p-dr").onclick = function(){ setActivePreset(this); mode = "map"; draw(App.state.t); };
    document.getElementById("p-pr").onclick = function(){ setActivePreset(this); mode = "prev"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Sorter</span><span class="val" id="ctrl-i">1 / 6</span></div>' +
      '<div><button class="preset-btn" id="b-a">Addiction</button> <button class="preset-btn" id="b-d">Dependence</button></div></div>' +
      '<div class="control-item"><div class="control-label"><span>Planner tick</span><span class="val" id="ctrl-c">0 / 5</span></div>' +
      '<div><button class="preset-btn" id="b-t">Tick next step</button> <button class="preset-btn" id="b-rs">Reset</button></div></div>';
    document.getElementById("b-a").onclick = function(){ judge("A"); };
    document.getElementById("b-d").onclick = function(){ judge("D"); };
    document.getElementById("b-t").onclick = function(){ var i; for(i = 0; i < 5; i++){ if(!checks[i]){ checks[i] = true; break; } } draw(App.state.t); };
    document.getElementById("b-rs").onclick = function(){ checks = [false, false, false, false, false]; draw(App.state.t); };
    draw(0);
  }
  function judge(g){
    var isMap = item >= 3;
    var ok = (g === kind[item]);
    if(isMap) verdict("<b>" + (ok ? "Logged. " : "Note: ") + "</b>" + feats[item] + " belongs to the <b>drug-receptor map</b> (Sec 7.5.1, Figs 7.7-7.11), not withdrawal. First three items are the addiction/dependence core (Ex Q16).");
    else verdict("<b>" + (ok ? "Correct. " : "Not quite. ") + "</b>" + feats[item] + " = <b>" + tag[item] + "</b> (Sec 7.5.2). Addiction = tolerance loop; dependence = withdrawal needing supervision.");
    item = (item + 1) % 6;
    draw(App.state.t);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var el = document.getElementById("ctrl-i"); if(el) el.textContent = (item + 1) + " / 6";
    var n = 0, i;
    for(i = 0; i < 5; i++){ if(checks[i]) n++; }
    var ec = document.getElementById("ctrl-c"); if(ec) ec.textContent = n + " / 5";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "map"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Drug-receptor map (Sec 7.5.1): educational, no instructions for use</text>';
      var rows = ["heroin: poppy latex, depressant", "cannabis: brain receptors, cardio", "cocaine: dopamine block, stimulant", "nicotine: adrenaline, BP/heart up"];
      for(i = 0; i < 4; i++){
        m += '<rect x="120" y="' + (60 + i * 50) + '" width="480" height="38" rx="6" fill="#0f1f2e" stroke="#334155"/>';
        m += '<text x="360" y="' + (84 + i * 50) + '" fill="#e2e8f0" font-size="12" text-anchor="middle">' + rows[i] + '</text>';
      }
      m += '<text x="360" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">Adolescence 12-18 (6-yr window); curiosity, stress, cool-image, media, family, peers.</text>';
      svg.innerHTML = m;
      readout(cell("opioids", "CNS/GIT") + cell("cocaine", "dopamine", "#f59e0b") + cell("nicotine", "adrenaline") + cell("window", "12-18 yr"));
      verdict("<b>Sec 7.5.1 / Ex Q14-15:</b> <b>heroin = acetylated poppy morphine (depressant)</b>; cannabinoids = <b>Cannabis inflorescence</b>; <b>cocaine = Erythroxylum, dopamine block</b>; nicotine raises <b>BP/heart</b>, CO displaces O2.");
    } else if(mode === "prev"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Prevention planner (Sec 7.5.4): tick all five — better than cure</text>';
      for(i = 0; i < 5; i++){
        var yy = 60 + i * 44;
        m += '<rect x="140" y="' + yy + '" width="440" height="34" rx="6" fill="' + (checks[i] ? '#064e3b' : '#0f1f2e') + '" stroke="' + (checks[i] ? '#34d399' : '#334155') + '"/>';
        m += '<text x="165" y="' + (yy + 22) + '" fill="' + (checks[i] ? '#34d399' : '#94a3b8') + '" font-size="12">' + (checks[i] ? "[x] " : "[ ] ") + (i + 1) + ". " + steps5[i] + '</text>';
      }
      svg.innerHTML = m;
      readout(cell("done", n + " / 5", n === 5 ? "#34d399" : "#f59e0b") + cell("harms", "coma/cirrhosis/HIV") + cell("signs", "drop/absence/hygiene"));
      if(n === 5) verdict("<b>Sec 7.5.4 complete:</b> all five set — with will power + professional help, <b>full return to normal life</b>. Harms avoided: overdose death, <b>IV AIDS/Hepatitis B</b>, cirrhosis, foetal harm, doping damage (Ex Q14).");
      else verdict("<b>Sec 7.5.4:</b> tick to (i) guard peers (ii) counsel/yoga (iii) parents/peers (iv) watch+report (v) rehab. Warning signs: academic drop, isolation, aggression, changed sleep/weight (Ex Q15).");
    } else {
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Sorter ' + (item + 1) + '/6: ' + feats[item] + '</text>';
      m += '<rect x="170" y="70" width="380" height="70" rx="8" fill="#0f1f2e" stroke="#f59e0b"/>';
      m += '<text x="360" y="112" fill="#e2e8f0" font-size="13" text-anchor="middle">' + feats[item] + '</text>';
      m += '<text x="360" y="180" fill="#94a3b8" font-size="12" text-anchor="middle">Addiction: psychological + rising tolerance (even once can forerun).</text>';
      m += '<text x="360" y="202" fill="#94a3b8" font-size="12" text-anchor="middle">Dependence: withdrawal (anxiety, shakiness, nausea, sweating).</text>';
      svg.innerHTML = m;
      readout(cell("item", tag[item]) + cell("answer", kind[item] === "A" ? "addiction" : "dependence", kind[item] === "A" ? "#f59e0b" : "#38bdf8"));
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.pathogens = window.SIMS["bacterial-viral-protozoan"];
window.SIMS.malaria = window.SIMS["helminth-fungal-hygiene"];
window.SIMS.immunity = window.SIMS["innate-acquired-immunity"];
window.SIMS.lymphoid = window.SIMS["vaccination-allergy-lymphoid"];
window.SIMS.aids = window.SIMS["aids"];
window.SIMS.cancer = window.SIMS["cancer"];
window.SIMS.drugs = window.SIMS["drugs-alcohol"];
