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

window.SIMS["tissue-culture"] = (function(){
  var step = 4;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Explant / meristem</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Sterile medium</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Somaclones</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-e0">Step 0: explant</button>' +
      '<button class="preset-btn" id="p-e2">Step 2: medium</button>' +
      '<button class="preset-btn active" id="p-e4">Step 5: somaclones</button>' +
      '<button class="preset-btn" id="p-pom">Pomato fusion</button>';
    document.getElementById("p-e0").onclick = function(){ setActivePreset(this); step=0; draw(App.state.t); };
    document.getElementById("p-e2").onclick = function(){ setActivePreset(this); step=2; draw(App.state.t); };
    document.getElementById("p-e4").onclick = function(){ setActivePreset(this); step=5; draw(App.state.t); };
    document.getElementById("p-pom").onclick = function(){ setActivePreset(this); step=6; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Protocol step</span><span class="val" id="ctrl-st">5</span></div>' +
      '<input type="range" id="ctrl-st-range" min="0" max="6" step="1" value="5"></div>';
    document.getElementById("ctrl-st-range").oninput = function(){ step = Number(this.value); draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var se = document.getElementById("ctrl-st"); if(se) se.textContent = step;
    var sr = document.getElementById("ctrl-st-range"); if(sr && Number(sr.value) !== step) sr.value = step;
    var anim = Math.min(step, step);
    anim = step;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Totipotency (1950s): any explant -sterile medium- whole plant; micropropagation = thousands of somaclones</text>';
    var labels = ["0 explant cut", "1 sterile tube", "2 medium feed", "3 proliferation", "4 plantlets", "5 somaclones x1000", "6 pomato fusion"];
    for(var i=0;i<6;i++){
      var bx = 70 + i * 100;
      var on = (anim >= i && anim <= 5) || (anim === 6 && i >= 4);
      var bob = on ? Math.sin(t * 2 + i) * 3 : 0;
      m += '<rect x="' + bx + '" y="' + (100 + bob) + '" width="84" height="60" rx="8" fill="' + (on ? '#0f2f3f' : '#0f1f2e') + '" stroke="' + (on ? '#34d399' : '#334155') + '"/>';
      if(i === 0){ m += '<circle cx="' + (bx + 42) + '" cy="' + (130 + bob) + '" r="14" fill="#38bdf8"/>'; }
      if(i === 1){ m += '<rect x="' + (bx + 22) + '" y="' + (118 + bob) + '" width="40" height="30" fill="#1e293b" stroke="#f59e0b"/>'; }
      if(i === 2){ m += '<text x="' + (bx + 42) + '" y="' + (136 + bob) + '" fill="#f59e0b" font-size="9" text-anchor="middle">sucrose+salts</text>'; }
      if(i === 3){ for(var d=0;d<3;d++){ m += '<circle cx="' + (bx + 22 + d * 20) + '" cy="' + (132 + bob) + '" r="8" fill="#34d399" opacity="0.8"/>'; } }
      if(i === 4){ m += '<line x1="' + (bx + 42) + '" y1="' + (150 + bob) + '" x2="' + (bx + 42) + '" y2="' + (118 + bob) + '" stroke="#34d399" stroke-width="3"/>'; m += '<circle cx="' + (bx + 42) + '" cy="' + (114 + bob) + '" r="7" fill="#34d399"/>'; }
      if(i === 5){ m += '<text x="' + (bx + 42) + '" y="' + (128 + bob) + '" fill="#34d399" font-size="11" text-anchor="middle">x1000</text>'; m += '<text x="' + (bx + 42) + '" y="' + (144 + bob) + '" fill="#94a3b8" font-size="9" text-anchor="middle">identical</text>'; }
      if(i < 5) m += '<line x1="' + (bx + 84) + '" y1="130" x2="' + (bx + 100) + '" y2="130" stroke="#475569" stroke-width="2"/>';
    }
    m += '<text x="360" y="200" fill="#e2e8f0" font-size="13" text-anchor="middle">' + labels[Math.min(anim, 6)] + '</text>';
    if(anim === 6){
      m += '<rect x="230" y="216" width="120" height="30" rx="6" fill="#f59e0b"/><text x="290" y="235" fill="#09131d" font-size="11" text-anchor="middle">tomato protoplast</text>';
      m += '<text x="365" y="236" fill="#e2e8f0" font-size="14">+</text>';
      m += '<rect x="380" y="216" width="120" height="30" rx="6" fill="#38bdf8"/><text x="440" y="235" fill="#09131d" font-size="11" text-anchor="middle">potato protoplast</text>';
      m += '<text x="360" y="266" fill="#f87171" font-size="12" text-anchor="middle">pomato: real hybrid, NO desired combo for commercial use</text>';
    } else {
      m += '<text x="360" y="232" fill="#94a3b8" font-size="12" text-anchor="middle">Medium: sucrose + inorganic salts + vitamins + amino acids + auxins/cytokinins (Exercise 3)</text>';
      m += '<text x="360" y="254" fill="#34d399" font-size="12" text-anchor="middle">Meristem (apical/axillary) virus-free even in infected plant: banana, sugarcane, potato (Exercise 1)</text>';
      m += '<text x="360" y="276" fill="#64748b" font-size="11" text-anchor="middle">Micropropagation advantage (Exercise 2): thousands of identical somaclones in very short time.</text>';
    }
    svg.innerHTML = m;
    readout(cell("step", labels[Math.min(anim, 6)]) + cell("medium", "sucrose+salts+vit+aux/cyt", "#f59e0b") + cell("output", anim === 6 ? "pomato (not commercial)" : "somaclones", "#34d399"));
    if(anim === 6) verdict("<b>Section 10.1:</b> somatic hybridisation fuses naked <b>protoplasts</b> into hybrid protoplasts grown to plants — tomato + potato = <b>pomato</b>, which lacked the desired combination for commercial utilisation.");
    else if(anim < 3) verdict("<b>Section 10.1:</b> <b>totipotency</b> — any cell/explant regenerates a whole plant (learnt in the <b>1950s</b>) under sterile test-tube conditions. Drag the step slider forward.");
    else verdict("<b>Exercises 1-2 (Section 10.1):</b> culture the <b>apical/axillary meristem</b> (virus-free zone) in vitro for healthy banana/sugarcane/potato; <b>micropropagation</b> then yields <b>thousands of genetically identical somaclones</b> (tomato, banana, apple).");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["tissueculture"] = window.SIMS["tissue-culture"];

window.SIMS["bt-rnai"] = (function(){
  var pest = "bollworm";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Inactive protoxin crystal</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Active toxin / dsRNA</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Protected plant</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-bw">cryIAc/IIAb vs bollworm</button>' +
      '<button class="preset-btn" id="p-cb">cryIAb vs corn borer</button>' +
      '<button class="preset-btn" id="p-ne">RNAi vs nematode</button>';
    document.getElementById("p-bw").onclick = function(){ setActivePreset(this); pest="bollworm"; draw(App.state.t); };
    document.getElementById("p-cb").onclick = function(){ setActivePreset(this); pest="borer"; draw(App.state.t); };
    document.getElementById("p-ne").onclick = function(){ setActivePreset(this); pest="nematode"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Larvae feeding (exposure)</span><span class="val" id="ctrl-ex">70</span></div>' +
      '<input type="range" id="ctrl-ex-range" min="0" max="100" step="5" value="70"></div>';
    document.getElementById("ctrl-ex-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var ex = numEl("ctrl-ex-range", 70);
    var el = document.getElementById("ctrl-ex"); if(el) el.textContent = ex;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var title = "Bt cotton: cryIAc + cryIIAb control cotton bollworms (insect-group specific)";
    if(pest === "borer") title = "Bt corn: cryIAb controls corn borer (lepidopteran / coleopteran / dipteran strains)";
    if(pest === "nematode") title = "RNAi tobacco: dsRNA silences Meloidegyne incognitia mRNA (Agrobacterium delivery)";
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">' + title + '</text>';
    m += '<rect x="60" y="60" width="200" height="140" rx="8" fill="#0f2f1a" stroke="#34d399"/>';
    m += '<line x1="160" y1="200" x2="160" y2="120" stroke="#34d399" stroke-width="6"/>';
    m += '<circle cx="160" cy="105" r="22" fill="#166534"/>';
    m += '<text x="160" y="230" fill="#34d399" font-size="12" text-anchor="middle">transgenic plant</text>';
    if(pest !== "nematode"){
      m += '<rect x="300" y="90" width="90" height="30" rx="6" fill="#f59e0b"/>';
      m += '<text x="345" y="109" fill="#09131d" font-size="11" text-anchor="middle">protoxin</text>';
      var gut = 470 + Math.sin(t * 2) * 4;
      m += '<ellipse cx="' + gut + '" cy="150" rx="70" ry="44" fill="#1e293b" stroke="#f87171"/>';
      m += '<text x="' + gut + '" y="120" fill="#f87171" font-size="11" text-anchor="middle">alkaline gut pH</text>';
      m += '<text x="' + gut + '" y="150" fill="#e2e8f0" font-size="11" text-anchor="middle">pores - swell - lyse</text>';
      var dead = Math.round(ex * (pest === "bollworm" ? 0.95 : 0.9));
      m += '<text x="' + gut + '" y="178" fill="#f87171" font-size="13" text-anchor="middle">mortality ' + dead + '%</text>';
    } else {
      m += '<text x="345" y="90" fill="#38bdf8" font-size="12" text-anchor="middle">sense + antisense -&gt; dsRNA</text>';
      m += '<line x1="330" y1="100" x2="400" y2="100" stroke="#38bdf8" stroke-width="3"/>';
      m += '<line x1="330" y1="108" x2="400" y2="108" stroke="#38bdf8" stroke-width="3"/>';
      var wig = Math.sin(t * 3) * 5;
      m += '<ellipse cx="' + (500 + wig) + '" cy="150" rx="46" ry="30" fill="#1e293b" stroke="#a78bfa"/>';
      m += '<text x="500" y="146" fill="#a78bfa" font-size="11" text-anchor="middle">mRNA silenced</text>';
      m += '<text x="500" y="164" fill="#e2e8f0" font-size="11" text-anchor="middle">nematode cannot survive</text>';
      m += '<text x="500" y="196" fill="#34d399" font-size="12" text-anchor="middle">roots protected (Fig 10.2)</text>';
    }
    m += '<text x="360" y="266" fill="#64748b" font-size="11" text-anchor="middle">Bacillus thuringiensis strains kill lepidopterans / coleopterans / dipterans. Golden rice = Vitamin-A enriched GM rice.</text>';
    svg.innerHTML = m;
    var mort = pest === "nematode" ? Math.round(ex * 0.92) : Math.round(ex * 0.95);
    readout(cell("pest", pest) + cell("gene", pest === "borer" ? "cryIAb" : (pest === "bollworm" ? "cryIAc+IIAb" : "dsRNA"), "#38bdf8") + cell("exposure", ex + "%") + cell("kill/protect", mort + "%", "#f87171"));
    if(pest === "nematode") verdict("<b>Section 10.1 (Fig 10.2):</b> <b>Agrobacterium vectors</b> deliver nematode-specific genes; <b>sense + antisense -&gt; dsRNA</b> initiates <b>RNAi</b> (complementary dsRNA binds mRNA, blocks translation) — <b>Meloidegyne incognitia</b> cannot survive in the transgenic host.");
    else verdict("<b>Section 10.1 / Exercise 4(c) (Fig 10.1):</b> crystals are <b>inactive protoxin</b> (why Bacillus lives); <b>alkaline insect gut solubilises</b> them -&gt; active toxin binds midgut, <b>pores -&gt; swell -&gt; lyse -&gt; death</b>. <b>cryIAc + cryIIAb = cotton bollworms; cryIAb = corn borer</b> (group-specific).");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["btcotton"] = window.SIMS["bt-rnai"];

window.SIMS["insulin-genetherapy"] = (function(){
  var mode = "insulin";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Chain A (21 aa)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Chain B (30 aa)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>C peptide (33, removed)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>ADA lymphocytes</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ins">Proinsulin remover (Fig 10.3)</button>' +
      '<button class="preset-btn" id="p-ada">ADA 1990 timeline</button>';
    document.getElementById("p-ins").onclick = function(){ setActivePreset(this); mode="insulin"; draw(App.state.t); };
    document.getElementById("p-ada").onclick = function(){ setActivePreset(this); mode="ada"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>C-peptide cut / ADA step</span><span class="val" id="ctrl-cu">1</span></div>' +
      '<input type="range" id="ctrl-cu-range" min="0" max="3" step="1" value="1"></div>';
    document.getElementById("ctrl-cu-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var v = Math.round(numEl("ctrl-cu-range", 1));
    var el = document.getElementById("ctrl-cu"); if(el) el.textContent = v;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "insulin"){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Proinsulin A(21) + C(33) + B(30) = 84 aa -maturation- mature A + B = 51 aa (disulphide-linked)</text>';
      var cut = (v >= 1);
      var cy = 140;
      m += '<rect x="120" y="' + cy + '" width="140" height="34" rx="6" fill="#38bdf8"/><text x="190" y="' + (cy + 22) + '" fill="#09131d" font-size="12" text-anchor="middle">A: 21 aa</text>';
      var cw = cut ? 0 : 1;
      if(!cut){
        m += '<rect x="270" y="' + cy + '" width="170" height="34" rx="6" fill="#f87171"/><text x="355" y="' + (cy + 22) + '" fill="#09131d" font-size="12" text-anchor="middle">C: 33 aa</text>';
      } else {
        var fy = cy - 40 - (t * 20 % 30);
        m += '<rect x="300" y="' + fy.toFixed(0) + '" width="110" height="26" rx="6" fill="#f87171" opacity="0.85"/>';
        m += '<text x="355" y="' + (fy + 17).toFixed(0) + '" fill="#09131d" font-size="11" text-anchor="middle">C floats away</text>';
        m += '<line x1="262" y1="' + cy + '" x2="262" y2="' + (cy + 34) + '" stroke="#f8fafc" stroke-width="2" stroke-dasharray="4 3"/>';
        m += '<line x1="438" y1="' + cy + '" x2="438" y2="' + (cy + 34) + '" stroke="#f8fafc" stroke-width="2" stroke-dasharray="4 3"/>';
      }
      var bx = cut ? 300 : 450;
      m += '<rect x="' + bx + '" y="' + cy + '" width="150" height="34" rx="6" fill="#f59e0b"/><text x="' + (bx + 75) + '" y="' + (cy + 22) + '" fill="#09131d" font-size="12" text-anchor="middle">B: 30 aa</text>';
      if(cut){
        m += '<line x1="262" y1="' + (cy + 40) + '" x2="' + (bx + 20) + '" y2="' + (cy + 40) + '" stroke="#f8fafc" stroke-width="3"/>';
        m += '<line x1="262" y1="' + (cy + 50) + '" x2="' + (bx + 20) + '" y2="' + (cy + 50) + '" stroke="#f8fafc" stroke-width="3"/>';
        m += '<text x="360" y="230" fill="#34d399" font-size="14" text-anchor="middle">Mature insulin = 21 + 30 = 51 aa (Eli Lilly 1983: A-DNA + B-DNA in E. coli, join by S-S)</text>';
      } else {
        m += '<text x="360" y="230" fill="#94a3b8" font-size="13" text-anchor="middle">Proinsulin = 84 aa. Move slider to 1+ to cut C during maturation.</text>';
      }
      m += '<text x="360" y="256" fill="#64748b" font-size="11" text-anchor="middle">Old animal insulin (cattle/pig) caused allergy; bacterial human insulin is identical. ~30 therapeutics approved, 12 in India.</text>';
      svg.innerHTML = m;
      readout(cell("A", "21 aa", "#38bdf8") + cell("C", cut ? "removed" : "33 aa", "#f87171") + cell("B", "30 aa", "#f59e0b") + cell("mature", cut ? "51 aa" : "84 aa", "#34d399"));
      verdict("<b>Figure 10.3 / Section 10.2.1:</b> C peptide is <b>absent in mature insulin — removed during maturation</b>. <b>Eli Lilly (1983)</b> built <b>A-DNA + B-DNA in E. coli plasmids</b>, made chains <b>separately</b>, joined by <b>disulphide bonds</b>. Mature = <b>51 aa</b> (21+30); proinsulin = 84.");
    } else {
      var st = Math.min(3, v + (t > 3 ? 1 : 0));
      if(v === 3) st = 3;
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">First clinical gene therapy 1990: 4-year-old girl, ADA deficiency (deleted gene, no immunity)</text>';
      var steps = ["1 blood out: culture lymphocytes", "2 retroviral ADA cDNA in", "3 cells back to patient", "repeat: cells mortal, not immortal"];
      for(var i=0;i<4;i++){
        var px = 60 + i * 160;
        var on = (st >= i) || (i === 0);
        if(i > st && v < 3){ on = (i === 0); }
        m += '<rect x="' + px + '" y="90" width="140" height="70" rx="8" fill="' + (i <= st ? '#134e4a' : '#0f1f2e') + '" stroke="#34d399"/>';
        m += '<text x="' + (px + 70) + '" y="120" fill="#e2e8f0" font-size="11" text-anchor="middle">' + steps[i].split(":")[0] + '</text>';
        m += '<text x="' + (px + 70) + '" y="140" fill="#94a3b8" font-size="10" text-anchor="middle">' + (steps[i].split(":")[1] || "") + '</text>';
        if(i < 3) m += '<line x1="' + (px + 140) + '" y1="125" x2="' + (px + 160) + '" y2="125" stroke="#475569" stroke-width="2"/>';
      }
      m += '<text x="360" y="200" fill="#e2e8f0" font-size="13" text-anchor="middle">Alternatives (not fully curative): bone-marrow transplant; enzyme-replacement injections.</text>';
      m += '<text x="360" y="224" fill="#94a3b8" font-size="12" text-anchor="middle">Permanent cure needs marrow-cell ADA gene at early embryonic stage.</text>';
      m += '<text x="360" y="248" fill="#64748b" font-size="11" text-anchor="middle">Why not oral insulin (Exercises 12-13)? Blood/gut proteases + nucleases digest protein/DNA drugs.</text>';
      svg.innerHTML = m;
      readout(cell("year", "1990") + cell("patient", "age 4, ADA-", "#f87171") + cell("vector", "retroviral cDNA", "#38bdf8") + cell("step", (st + 1) + "/4", "#34d399"));
      verdict("<b>Section 10.2.2 / Exercise 8:</b> gene therapy inserts a normal gene to compensate. <b>1990, 4-year-old ADA girl:</b> lymphocytes out -&gt; <b>functional ADA cDNA via retroviral vector</b> -&gt; cells back; <b>periodic infusion</b> since cells are <b>not immortal</b>.");
    }
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["insulin"] = window.SIMS["insulin-genetherapy"];

window.SIMS["diagnosis-transgenic"] = (function(){
  var tool = "pcr";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>PCR: amplify nucleic acid</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Probe: hybridise + film</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>ELISA: antigen-antibody</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pcr">HIV few copies: PCR</button>' +
      '<button class="preset-btn" id="p-prb">Mutant clone: probe</button>' +
      '<button class="preset-btn" id="p-eli">Infection Ag/Ab: ELISA</button>' +
      '<button class="preset-btn" id="p-ros">Rosie 1997 cow</button>';
    document.getElementById("p-pcr").onclick = function(){ setActivePreset(this); tool="pcr"; draw(App.state.t); };
    document.getElementById("p-prb").onclick = function(){ setActivePreset(this); tool="probe"; draw(App.state.t); };
    document.getElementById("p-eli").onclick = function(){ setActivePreset(this); tool="elisa"; draw(App.state.t); };
    document.getElementById("p-ros").onclick = function(){ setActivePreset(this); tool="rosie"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Milk volume / L (Rosie 2.4 g/L)</span><span class="val" id="ctrl-ml">0.25</span></div>' +
      '<input type="range" id="ctrl-ml-range" min="0.1" max="2" step="0.05" value="0.25"></div>';
    document.getElementById("ctrl-ml-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var vol = numEl("ctrl-ml-range", 0.25);
    var el = document.getElementById("ctrl-ml"); if(el) el.textContent = vol.toFixed(2);
    var mg = Math.round(vol * 2.4 * 1000);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Early diagnosis trio (10.2.3): PCR vs probe vs ELISA  |  transgenics: &gt;95% mice</text>';
    if(tool === "pcr"){
      m += '<text x="120" y="70" fill="#38bdf8" font-size="13">few HIV copies</text>';
      var n = 3 + Math.floor(t * 2);
      for(var i=0;i<Math.min(24, n);i++){
        var px = 100 + (i * 41) % 220;
        var py = 100 + (i * 23) % 90;
        m += '<circle cx="' + px + '" cy="' + py + '" r="5" fill="#38bdf8"/>';
      }
      m += '<text x="450" y="110" fill="#38bdf8" font-size="14">PCR amplifies nucleic acid</text>';
      m += '<text x="450" y="134" fill="#94a3b8" font-size="12">HIV in AIDS, cancer mutations:</text>';
      m += '<text x="450" y="154" fill="#94a3b8" font-size="12">low counts become detectable</text>';
    } else if(tool === "probe"){
      m += '<rect x="100" y="70" width="200" height="120" fill="#020617" stroke="#475569"/>';
      m += '<circle cx="160" cy="120" r="10" fill="#f59e0b"/><text x="160" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">normal: dark spot</text>';
      m += '<circle cx="240" cy="120" r="10" fill="none" stroke="#475569"/><text x="240" y="150" fill="#f87171" font-size="10" text-anchor="middle">mutant: BLANK</text>';
      m += '<text x="450" y="110" fill="#f59e0b" font-size="14">ssDNA/RNA radioactive probe</text>';
      m += '<text x="450" y="134" fill="#94a3b8" font-size="12">hybridise + autoradiography:</text>';
      m += '<text x="450" y="154" fill="#f87171" font-size="12">mutated clone NOT on film</text>';
    } else if(tool === "elisa"){
      m += '<rect x="120" y="90" width="60" height="60" rx="6" fill="#34d399"/><text x="150" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">antigen</text>';
      m += '<rect x="220" y="90" width="60" height="60" rx="6" fill="none" stroke="#34d399" stroke-width="3"/><text x="250" y="160" fill="#94a3b8" font-size="10" text-anchor="middle">antibody</text>';
      m += '<line x1="180" y1="120" x2="220" y2="120" stroke="#f8fafc" stroke-width="3"/>';
      m += '<text x="450" y="110" fill="#34d399" font-size="14">ELISA = antigen-antibody</text>';
      m += '<text x="450" y="134" fill="#94a3b8" font-size="12">pathogen proteins/glycoproteins</text>';
      m += '<text x="450" y="154" fill="#94a3b8" font-size="12">or antibodies against them</text>';
    } else {
      m += '<ellipse cx="220" cy="150" rx="90" ry="50" fill="#1e293b" stroke="#f59e0b"/>';
      m += '<circle cx="220" cy="110" r="26" fill="#1e293b" stroke="#f59e0b"/>';
      var fill = Math.min(80, vol * 40);
      m += '<rect x="400" y="' + (190 - fill) + '" width="60" height="' + fill + '" fill="#f8fafc"/>';
      m += '<text x="430" y="210" fill="#94a3b8" font-size="11" text-anchor="middle">milk</text>';
      m += '<text x="540" y="110" fill="#e2e8f0" font-size="14">Rosie 1997: 2.4 g/L</text>';
      m += '<text x="540" y="134" fill="#f59e0b" font-size="13">human alpha-lactalbumin</text>';
      m += '<text x="540" y="158" fill="#34d399" font-size="13">' + vol.toFixed(2) + ' L = ' + mg + ' mg</text>';
    }
    m += '<text x="360" y="232" fill="#94a3b8" font-size="12" text-anchor="middle">Transgenics: rats, rabbits, pigs, sheep, cows, fish — but &gt;95% are mice.</text>';
    m += '<text x="360" y="254" fill="#94a3b8" font-size="12" text-anchor="middle">Uses: (i) physiology (IGF) (ii) disease: cancer, cystic fibrosis, arthritis, Alzheimer (iii) alpha-1-antitrypsin (Tracy) (iv) polio vaccine (v) toxicity.</text>';
    m += '<text x="360" y="276" fill="#64748b" font-size="11" text-anchor="middle">Serum/urine analysis cannot catch disease early — rDNA + PCR/ELISA can (Section 10.2.3).</text>';
    svg.innerHTML = m;
    readout(cell("tool", tool) + cell("Rosie milk", vol.toFixed(2) + " L", "#f59e0b") + cell("alpha-lactalbumin", mg + " mg", "#34d399") + cell("mice", ">95%", "#38bdf8"));
    if(tool === "rosie") verdict("<b>Section 10.3:</b> first transgenic cow <b>Rosie (1997)</b> gave <b>2.4 g/L human alpha-lactalbumin</b> milk (more balanced for babies): 250 mL = <b>600 mg</b> (Exercise-style: 2.4 x 0.25 x 1000). Sheep <b>Tracy</b> gave alpha-1-antitrypsin for emphysema.");
    else if(tool === "probe") verdict("<b>Section 10.2.3 trap:</b> the <b>mutated clone does NOT appear on the film</b> — no complementarity, no hybrid, no signal. Normal clone binds the radioactive ssDNA/RNA probe and darkens.");
    else if(tool === "elisa") verdict("<b>Section 10.2.3:</b> <b>ELISA</b> reads <b>antigen–antibody interaction</b> — pathogen antigens (proteins, glycoproteins) or the antibodies made against them.");
    else verdict("<b>Section 10.2.3:</b> <b>very low bacterial/viral counts are detected by amplifying nucleic acid with PCR</b> — routine for <b>HIV in suspected AIDS</b> and mutations in suspected cancer before symptoms.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["transgenic"] = window.SIMS["diagnosis-transgenic"];

window.SIMS["ethics-biopiracy"] = (function(){
  var idx = 0;
  var cases = [
    { name: "Basmati 1997 (USA)", res: "Indian farmer varieties + semi-dwarf cross", verdict: "biopiracy", why: "US patent on Basmati lines + functional equivalents; no authorisation/compensation. 27 Basmati of ~2,00,000 Indian rice varieties." },
    { name: "Turmeric wound-healing", res: "traditional herbal medicine", verdict: "biopiracy", why: "Ancient home use patented abroad without permission or payment — challenged and revoked." },
    { name: "Neem patents", res: "traditional pesticide/medicine", verdict: "biopiracy", why: "Traditional-knowledge claims by foreign firms; same no-authorisation, no-payment pattern." },
    { name: "GEAC-approved Bt trial", res: "regulated GM research", verdict: "legitimate", why: "GEAC judges validity of GM research + safety of GM release for public services — authorised pathway." }
  ];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Biopiracy pattern</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Legitimate (GEAC route)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-c0">Basmati 1997</button>' +
      '<button class="preset-btn" id="p-c1">Turmeric</button>' +
      '<button class="preset-btn" id="p-c2">Neem</button>' +
      '<button class="preset-btn" id="p-c3">GEAC trial</button>';
    document.getElementById("p-c0").onclick = function(){ setActivePreset(this); idx=0; draw(App.state.t); };
    document.getElementById("p-c1").onclick = function(){ setActivePreset(this); idx=1; draw(App.state.t); };
    document.getElementById("p-c2").onclick = function(){ setActivePreset(this); idx=2; draw(App.state.t); };
    document.getElementById("p-c3").onclick = function(){ setActivePreset(this); idx=3; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Your sort: biopiracy?</span><span class="val" id="ctrl-gu">biopiracy</span></div>' +
      '<input type="range" id="ctrl-gu-range" min="0" max="1" step="1" value="0"></div>';
    document.getElementById("ctrl-gu-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var g = Math.round(numEl("ctrl-gu-range", 0));
    var guess = g === 0 ? "biopiracy" : "legitimate";
    var ge = document.getElementById("ctrl-gu"); if(ge) ge.textContent = guess;
    var c = cases[idx];
    var right = (guess === c.verdict);
    var pulse = 0.5 + 0.5 * Math.sin(t * 3);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">GEAC decides GM validity + release safety | biopiracy = no authorisation + no payment</text>';
    m += '<rect x="60" y="50" width="300" height="150" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="210" y="78" fill="#e2e8f0" font-size="14" text-anchor="middle">' + c.name + '</text>';
    m += '<text x="210" y="104" fill="#94a3b8" font-size="12" text-anchor="middle">' + c.res + '</text>';
    m += '<text x="210" y="130" fill="#64748b" font-size="11" text-anchor="middle">rich biodiversity + knowledge vs</text>';
    m += '<text x="210" y="148" fill="#64748b" font-size="11" text-anchor="middle">rich finance, poor biodiversity</text>';
    m += '<text x="210" y="172" fill="' + (c.verdict === "biopiracy" ? "#f87171" : "#34d399") + '" font-size="13" text-anchor="middle">textbook key: ' + c.verdict + '</text>';
    m += '<rect x="400" y="50" width="260" height="150" rx="8" fill="' + (right ? '#052e2b' : '#2a1215') + '" stroke="' + (right ? '#34d399' : '#f87171') + '"/>';
    m += '<text x="530" y="78" fill="#e2e8f0" font-size="13" text-anchor="middle">your sort: ' + guess + '</text>';
    m += '<text x="530" y="104" fill="' + (right ? '#34d399' : '#f87171') + '" font-size="14" text-anchor="middle">' + (right ? "CORRECT" : "TRY AGAIN") + '</text>';
    m += '<circle cx="530" cy="150" r="' + (16 + 6 * pulse).toFixed(1) + '" fill="' + (right ? '#34d399' : '#f87171') + '" opacity="0.85"/>';
    m += '<text x="530" y="186" fill="#94a3b8" font-size="11" text-anchor="middle">slider 0 = biopiracy, 1 = legitimate</text>';
    m += '<text x="360" y="232" fill="#94a3b8" font-size="12" text-anchor="middle">India: ~2,00,000 rice varieties; 27 Basmati; patent 1997 (USPTO) reached functional equivalents.</text>';
    m += '<text x="360" y="254" fill="#94a3b8" font-size="12" text-anchor="middle">Defence: challenge patents + benefit-sharing law (2nd amendment, Indian Patents Bill).</text>';
    svg.innerHTML = m;
    readout(cell("case", c.name) + cell("your sort", guess) + cell("key", c.verdict, c.verdict === "biopiracy" ? "#f87171" : "#34d399") + cell("score", right ? "1/1" : "0/1", right ? "#34d399" : "#f87171"));
    verdict("<b>Section 10.4:</b> " + c.why + " <b>GEAC (Genetic Engineering Approval Committee)</b> decides <b>validity of GM research + safety of GM release</b>; <b>biopiracy</b> = bio-resource use <b>without proper authorisation and without compensatory payment</b> (Exercise: Basmati = 27 documented varieties).");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["ethics"] = window.SIMS["ethics-biopiracy"];
