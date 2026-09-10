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

window.SIMS["pond-structure"] = (function(){
  var mode = "pond";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Abiotic (water + soil)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Producers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Consumers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Decomposers (bottom)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pond">Pond: full system</button>' +
      '<button class="preset-btn" id="p-for">Forest stratification</button>' +
      '<button class="preset-btn" id="p-node">Remove decomposers</button>';
    document.getElementById("p-pond").onclick = function(){ setActivePreset(this); mode="pond"; draw(App.state.t); };
    document.getElementById("p-for").onclick = function(){ setActivePreset(this); mode="forest"; draw(App.state.t); };
    document.getElementById("p-node").onclick = function(){ setActivePreset(this); mode="nodecomp"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Highlight component</span><span class="val" id="ctrl-h">all</span></div>' +
      '<input type="range" id="ctrl-h-range" min="0" max="3" step="1" value="0"></div>';
    document.getElementById("ctrl-h-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var h = Math.round(numEl("ctrl-h-range", 0));
    var names = ["all", "abiotic", "producers", "consumers+decomposers"];
    var el = document.getElementById("ctrl-h"); if(el) el.textContent = names[h];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "forest"){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Stratification: trees (top) -&gt; shrubs -&gt; herbs/grasses (bottom)</text>';
      m += '<rect x="160" y="44" width="400" height="60" rx="6" fill="#14532d" opacity="' + (h === 0 || h === 2 ? "1" : "0.4") + '"/>';
      m += '<text x="360" y="78" fill="#e2e8f0" font-size="13" text-anchor="middle">trees: top vertical stratum</text>';
      m += '<rect x="200" y="110" width="320" height="52" rx="6" fill="#166534" opacity="' + (h === 0 || h === 2 ? "1" : "0.4") + '"/>';
      m += '<text x="360" y="141" fill="#e2e8f0" font-size="12" text-anchor="middle">shrubs: second layer</text>';
      m += '<rect x="240" y="168" width="240" height="52" rx="6" fill="#22c55e" opacity="' + (h === 0 || h === 2 ? "1" : "0.4") + '"/>';
      m += '<text x="360" y="199" fill="#09131d" font-size="12" text-anchor="middle">herbs + grasses: bottom</text>';
      m += '<text x="360" y="246" fill="#94a3b8" font-size="12" text-anchor="middle">Species composition = identification + enumeration; stratification = vertical layers (Sec 12.1).</text>';
      m += '<text x="360" y="268" fill="#64748b" font-size="11" text-anchor="middle">Four functions: (i) productivity (ii) decomposition (iii) energy flow (iv) nutrient cycling.</text>';
    } else {
      var dead = (mode === "nodecomp");
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Pond self-sustainable model: abiotic + autotrophs + consumers + decomposers; energy flows up, heat lost</text>';
      m += '<rect x="80" y="50" width="560" height="200" rx="8" fill="#0f2537" stroke="#38bdf8" opacity="' + (h === 0 || h === 1 ? "1" : "0.45") + '"/>';
      m += '<rect x="80" y="210" width="560" height="40" rx="4" fill="#3f2d1c" opacity="' + (h === 0 || h === 1 ? "1" : "0.45") + '"/>';
      m += '<text x="100" y="70" fill="#38bdf8" font-size="11">water + dissolved substances + sun/temperature</text>';
      m += '<text x="100" y="242" fill="#d6a35c" font-size="11">bottom soil deposit (rich)</text>';
      for(var i=0;i<10;i++){
        var px = 110 + (i * 53) % 300;
        var py = 92 + (i * 29) % 40 + Math.sin(t * 2 + i) * 2;
        m += '<circle cx="' + px + '" cy="' + py.toFixed(1) + '" r="5" fill="#34d399" opacity="' + (h === 0 || h === 2 ? "1" : "0.35") + '"/>';
      }
      m += '<rect x="430" y="86" width="26" height="50" fill="#166534" opacity="' + (h === 0 || h === 2 ? "1" : "0.35") + '"/>';
      m += '<rect x="470" y="100" width="22" height="36" fill="#15803d" opacity="' + (h === 0 || h === 2 ? "1" : "0.35") + '"/>';
      m += '<text x="490" y="70" fill="#34d399" font-size="11">phytoplankton, algae, marginal plants</text>';
      for(var f=0;f<3;f++){
        var fx = 170 + f * 110 + Math.sin(t * 1.5 + f * 2) * 10;
        var fy = 160 + (f % 2) * 22;
        m += '<ellipse cx="' + fx.toFixed(1) + '" cy="' + fy + '" rx="22" ry="10" fill="#f59e0b" opacity="' + (h === 0 || h === 3 ? "1" : "0.35") + '"/>';
        m += '<polygon points="' + (fx + 22).toFixed(1) + ',' + fy + ' ' + (fx + 32).toFixed(1) + ',' + (fy - 6) + ' ' + (fx + 32).toFixed(1) + ',' + (fy + 6) + '" fill="#f59e0b" opacity="' + (h === 0 || h === 3 ? "1" : "0.35") + '"/>';
      }
      m += '<text x="360" y="200" fill="#f59e0b" font-size="11" text-anchor="middle">zooplankton + swimmers + bottom dwellers</text>';
      if(!dead){
        for(var dI=0;dI<8;dI++){
          var dx = 110 + dI * 62;
          m += '<circle cx="' + dx + '" cy="' + (224 + Math.sin(t * 3 + dI) * 2).toFixed(1) + '" r="6" fill="#a78bfa" opacity="' + (h === 0 || h === 3 ? "1" : "0.35") + '"/>';
        }
        m += '<text x="540" y="200" fill="#a78bfa" font-size="11">fungi, bacteria, flagellates</text>';
      } else {
        for(var p=0;p<6;p++){
          m += '<rect x="' + (110 + p * 80) + '" y="216" width="40" height="14" fill="#57534e"/>';
        }
        m += '<text x="360" y="200" fill="#f87171" font-size="12" text-anchor="middle">NO decomposers: detritus piles up, minerals not released</text>';
      }
      m += '<text x="360" y="272" fill="#64748b" font-size="11" text-anchor="middle">Aquarium / paddy field = same four boxes (man-made ecosystems, Sec 12.1).</text>';
    }
    svg.innerHTML = m;
    readout(cell("abiotic", "water + soil") + cell("producers", "phytoplankton+plants", "#34d399") + cell("consumers", "zooplankton+fish", "#f59e0b") + cell("decomposers", mode === "nodecomp" ? "REMOVED" : "bottom-abundant", mode === "nodecomp" ? "#f87171" : "#a78bfa"));
    if(mode === "forest") verdict("<b>Section 12.1:</b> structure = <b>species composition</b> (identify + count) + <b>stratification</b> (trees -&gt; shrubs -&gt; herbs/grasses). Function runs through <b>productivity, decomposition, energy flow, nutrient cycling</b> (4 aspects).");
    else if(mode === "nodecomp") verdict("<b>Section 12.1 prediction:</b> remove fungi/bacteria/flagellates and <b>dead matter accumulates, mineralisation stops</b> — autotrophs run short of recycled nutrients. Each box must be non-empty (Exercise 7 core).");
    else verdict("<b>Section 12.1 pond (Exercise 7):</b> autotrophs (phytoplankton, algae, marginal plants) fix inorganic -&gt; organic; heterotrophs feed; <b>bottom decomposers mineralise</b> for reuse. <b>Energy moves unidirectionally</b> upward, dissipated as heat.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["pond"] = window.SIMS["pond-structure"];

window.SIMS["productivity"] = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>GPP (gross fixed)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>R (respiration eaten)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>NPP (left for heterotrophs)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pt">Patch: GPP 52, R 17</button>' +
      '<button class="preset-btn" id="p-oc">Ocean: thin per-area</button>' +
      '<button class="preset-btn" id="p-ld">Land: 115 of 170</button>';
    document.getElementById("p-pt").onclick = function(){ setActivePreset(this); var a=document.getElementById("ctrl-g-range"); var b=document.getElementById("ctrl-r-range"); if(a) a.value=52; if(b) b.value=17; draw(App.state.t); };
    document.getElementById("p-oc").onclick = function(){ setActivePreset(this); var a=document.getElementById("ctrl-g-range"); var b=document.getElementById("ctrl-r-range"); if(a) a.value=30; if(b) b.value=18; draw(App.state.t); };
    document.getElementById("p-ld").onclick = function(){ setActivePreset(this); var a=document.getElementById("ctrl-g-range"); var b=document.getElementById("ctrl-r-range"); if(a) a.value=70; if(b) b.value=22; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>GPP (kcal m-2 yr-1)</span><span class="val" id="ctrl-g">52</span></div>' +
      '<input type="range" id="ctrl-g-range" min="10" max="100" step="1" value="52"></div>' +
      '<div class="control-item"><div class="control-label"><span>R: respiration loss</span><span class="val" id="ctrl-r">17</span></div>' +
      '<input type="range" id="ctrl-r-range" min="0" max="60" step="1" value="17"></div>';
    document.getElementById("ctrl-g-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-r-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var gpp = numEl("ctrl-g-range", 52);
    var rr = numEl("ctrl-r-range", 17);
    if(rr > gpp) rr = gpp;
    var a = document.getElementById("ctrl-g"); if(a) a.textContent = gpp;
    var b = document.getElementById("ctrl-r"); if(b) b.textContent = rr;
    var npp = gpp - rr;
    function H(v){ return (v / 100) * 170; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">NPP = GPP - R: what remains feeds herbivores + decomposers (Sec 12.2)</text>';
    m += '<rect x="120" y="' + (230 - H(gpp)).toFixed(0) + '" width="110" height="' + H(gpp).toFixed(0) + '" fill="#14532d" stroke="#34d399"/>';
    m += '<rect x="120" y="' + (230 - H(gpp)).toFixed(0) + '" width="110" height="' + H(rr).toFixed(0) + '" fill="#f87171" opacity="0.9"/>';
    m += '<text x="175" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">GPP ' + gpp + '</text>';
    m += '<rect x="300" y="' + (230 - H(npp)).toFixed(0) + '" width="110" height="' + H(npp).toFixed(0) + '" fill="#38bdf8" stroke="#e2e8f0"/>';
    m += '<text x="355" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">NPP ' + npp + '</text>';
    var breathe = 1 + 0.06 * Math.sin(t * 3);
    m += '<text x="520" y="100" fill="#e2e8f0" font-size="20">NPP = ' + gpp + ' - ' + rr + ' = ' + npp + '</text>';
    m += '<text x="520" y="126" fill="#94a3b8" font-size="12">kcal m-2 yr-1; production in</text>';
    m += '<text x="520" y="144" fill="#94a3b8" font-size="12">g m-2, rate adds yr-1</text>';
    m += '<circle cx="500" cy="170" r="' + (10 * breathe).toFixed(1) + '" fill="none" stroke="#f87171" stroke-width="2"/>';
    m += '<text x="520" y="174" fill="#f87171" font-size="11">R breathes (use)</text>';
    m += '<text x="360" y="278" fill="#64748b" font-size="11" text-anchor="middle">Biosphere 170 billion t (dry): oceans ~70% surface but only 55; land = 115. Secondary productivity = consumers.</text>';
    svg.innerHTML = m;
    readout(cell("GPP", gpp + " kcal", "#34d399") + cell("R", rr + " kcal", "#f87171") + cell("NPP", npp + " kcal", "#38bdf8") + cell("land share", "115 / 170"));
    verdict("<b>Section 12.2 (Exercises 6, 9):</b> <b>NPP = GPP - R</b>; NPP is the heterotrophs share, <b>secondary productivity</b> belongs to consumers. Biosphere <b>170 = 55 (ocean) + 115 (land)</b> billion tons dry — oceans lose per-area on light, nutrients, species and photosynthetic capacity (teacher discussion).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["decomposition"] = (function(){
  var litter = "nitrogen";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Current step</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#334155;"></span><span>Later step</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Humus reservoir</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ni">Nitrogen/sugar litter (fast)</button>' +
      '<button class="preset-btn" id="p-li">Lignin/chitin litter (slow)</button>';
    document.getElementById("p-ni").onclick = function(){ setActivePreset(this); litter="nitrogen"; draw(App.state.t); };
    document.getElementById("p-li").onclick = function(){ setActivePreset(this); litter="lignin"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Decomposition step (0-4)</span><span class="val" id="ctrl-ds">4</span></div>' +
      '<input type="range" id="ctrl-ds-range" min="0" max="4" step="1" value="4"></div>' +
      '<div class="control-item"><div class="control-label"><span>Warm + moist climate</span><span class="val" id="ctrl-cl">warm-moist</span></div>' +
      '<input type="range" id="ctrl-cl-range" min="0" max="1" step="1" value="1"></div>';
    document.getElementById("ctrl-ds-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-cl-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = Math.round(numEl("ctrl-ds-range", 4));
    var cl = Math.round(numEl("ctrl-cl-range", 1));
    var el = document.getElementById("ctrl-ds"); if(el) el.textContent = st;
    var ce = document.getElementById("ctrl-cl"); if(ce) ce.textContent = cl === 1 ? "warm-moist" : "cold/dry";
    var steps = ["fragmentation", "leaching", "catabolism", "humification", "mineralisation"];
    var agents = ["earthworm detritivores", "water: soluble salts down", "bacterial+fungal enzymes", "humus: dark, colloidal store", "release inorganic nutrients"];
    var speed = (litter === "nitrogen" ? 2 : 0.5) * (cl === 1 ? 1.5 : 0.4);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Detritus (dead + faecal) -&gt; CO2 + water + nutrients; 5 steps run simultaneously (Fig 12.1)</text>';
    for(var i=0;i<5;i++){
      var bx = 40 + i * 130;
      var active = (i === st);
      var done = (i < st);
      var bob = active ? Math.sin(t * 3) * 3 : 0;
      m += '<rect x="' + bx + '" y="' + (70 + bob).toFixed(0) + '" width="116" height="70" rx="8" fill="' + (active ? '#f59e0b' : (done ? '#134e4a' : '#0f1f2e')) + '" stroke="' + (active ? '#fff' : '#334155') + '"/>';
      m += '<text x="' + (bx + 58) + '" y="' + (96 + bob).toFixed(0) + '" fill="' + (active ? '#09131d' : '#e2e8f0') + '" font-size="10" text-anchor="middle">' + (i + 1) + '. ' + steps[i] + '</text>';
      m += '<text x="' + (bx + 58) + '" y="' + (116 + bob).toFixed(0) + '" fill="' + (active ? '#09131d' : '#94a3b8') + '" font-size="9" text-anchor="middle">' + agents[i] + '</text>';
      if(i < 4) m += '<line x1="' + (bx + 116) + '" y1="105" x2="' + (bx + 130) + '" y2="105" stroke="#475569" stroke-width="2"/>';
    }
    m += '<text x="360" y="180" fill="#e2e8f0" font-size="13" text-anchor="middle">Step ' + (st + 1) + '/5: ' + steps[st] + ' — ' + agents[st] + '</text>';
    var barW = Math.min(560, speed * 130);
    m += '<rect x="80" y="200" width="560" height="20" rx="6" fill="#0f1f2e" stroke="#334155"/>';
    m += '<rect x="80" y="200" width="' + barW.toFixed(0) + '" height="20" rx="6" fill="' + (speed > 1.5 ? '#34d399' : '#f87171') + '"/>';
    m += '<text x="360" y="240" fill="#94a3b8" font-size="12" text-anchor="middle">' + litter + ' litter, ' + (cl === 1 ? 'warm+moist favours (O2 needs met)' : 'cold/anaerobic inhibits: organic builds up') + ' — rate x' + speed.toFixed(1) + '</text>';
    m += '<text x="360" y="262" fill="#64748b" font-size="11" text-anchor="middle">Earthworm = farmer friend (fragments + loosens). Humus resists microbes; mineralisation frees nutrients.</text>';
    svg.innerHTML = m;
    readout(cell("step", (st + 1) + "/5 " + steps[st]) + cell("litter", litter, litter === "nitrogen" ? "#34d399" : "#f87171") + cell("climate", cl === 1 ? "warm-moist" : "cold/dry") + cell("rate", "x" + speed.toFixed(1)));
    verdict("<b>Section 12.3 (Exercise 10):</b> order <b>fragmentation -&gt; leaching -&gt; catabolism -&gt; humification -&gt; mineralisation</b> (simultaneous). <b>Lignin/chitin = slow, nitrogen/sugars = quick;</b> <b>warm+moist favours, low-T + anaerobiosis inhibits</b> (oxygen-requiring). Products: <b>CO2 + water + inorganic nutrients</b> (+ humus store).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["energy-flow"] = (function(){
  var chain = "grass";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>T1 producers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>T2 herbivores</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>T3-T4 carnivores</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-gr">Grass-Goat-Man (GFC)</button>' +
      '<button class="preset-btn" id="p-lk">Lake: phyto-zoo-fish</button>' +
      '<button class="preset-btn" id="p-df">Detritus chain (DFC)</button>';
    document.getElementById("p-gr").onclick = function(){ setActivePreset(this); chain="grass"; draw(App.state.t); };
    document.getElementById("p-lk").onclick = function(){ setActivePreset(this); chain="lake"; draw(App.state.t); };
    document.getElementById("p-df").onclick = function(){ setActivePreset(this); chain="detritus"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Producer energy (J)</span><span class="val" id="ctrl-pj">10000</span></div>' +
      '<input type="range" id="ctrl-pj-range" min="1000" max="20000" step="500" value="10000"></div>';
    document.getElementById("ctrl-pj-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var pj = numEl("ctrl-pj-range", 10000);
    var el = document.getElementById("ctrl-pj"); if(el) el.textContent = pj;
    var t2 = pj * 0.1, t3 = pj * 0.01, t4 = pj * 0.001;
    var labels = chain === "grass" ? ["Grass T1", "Goat T2", "Man T3", "Top T4"] : (chain === "lake" ? ["Phytoplankton T1", "Zooplankton T2", "Fish T3", "Top fish T4"] : ["Detritus", "Saprotrophs", "Detritivores", "GFC predators"]);
    var cols = ["#34d399", "#f59e0b", "#38bdf8", "#a78bfa"];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">10% law (Fig 12.3): only ~10% crosses each level; PAR &lt;50%, plants catch 2-10%, ~1% to NPP</text>';
    var vals = [pj, t2, t3, t4];
    for(var i=0;i<4;i++){
      var bw = 40 + (3 - i) * 0 + Math.max(30, 200 - i * 52);
      var bx = 70 + i * 150;
      var bob = Math.sin(t * 2 + i) * 2;
      m += '<rect x="' + bx + '" y="' + (110 + bob).toFixed(0) + '" width="120" height="' + bw + '" rx="6" fill="#0f1f2e" stroke="' + cols[i] + '" stroke-width="2"/>';
      m += '<rect x="' + bx + '" y="' + (110 + bw - Math.min(bw, bw * 0.9) + bob).toFixed(0) + '" width="120" height="' + Math.min(bw, 12 + (3 - i) * 8).toFixed(0) + '" fill="' + cols[i] + '" opacity="0.85"/>';
      m += '<text x="' + (bx + 60) + '" y="' + (100 + bob).toFixed(0) + '" fill="' + cols[i] + '" font-size="11" text-anchor="middle">' + labels[i] + '</text>';
      m += '<text x="' + (bx + 60) + '" y="' + (124 + bw + bob).toFixed(0) + '" fill="#e2e8f0" font-size="12" text-anchor="middle">' + vals[i].toFixed(vals[i] < 100 ? 1 : 0) + ' J</text>';
      if(i < 3){
        var ax = bx + 120;
        m += '<line x1="' + ax + '" y1="170" x2="' + (ax + 30) + '" y2="170" stroke="#475569" stroke-width="2"/>';
        m += '<polygon points="' + (ax + 30) + ',170 ' + (ax + 20) + ',164 ' + (ax + 20) + ',176" fill="#94a3b8"/>';
        m += '<text x="' + (ax + 4) + '" y="160" fill="#f87171" font-size="10">90% heat</text>';
      }
    }
    m += '<text x="360" y="268" fill="#64748b" font-size="11" text-anchor="middle">' + (chain === "detritus" ? 'DFC starts from dead matter (fungi/bacteria saprotrophs); land runs mainly DFC, water mainly GFC; webs link via omnivores (cockroach, crow).' : 'GFC: Grass -&gt; Goat -&gt; Man. Standing crop as dry-weight biomass or numbers; death diverts to detritus.') + '</text>';
    svg.innerHTML = m;
    readout(cell("T1", vals[0].toFixed(0) + " J", "#34d399") + cell("T2", vals[1].toFixed(0) + " J", "#f59e0b") + cell("T3", vals[2].toFixed(1) + " J", "#38bdf8") + cell("T4", vals[3].toFixed(2) + " J", "#a78bfa"));
    verdict("<b>Section 12.4 (Figs 12.2-12.3; Exercises 2-5):</b> chain <b>" + pj + " -&gt; " + t2.toFixed(0) + " -&gt; " + t3.toFixed(0) + " -&gt; " + t4.toFixed(1) + " J</b> (10,000 -&gt; 1,000 -&gt; 100 -&gt; 10 at default). Decomposers hold the <b>largest population</b> (Ex 2); lake T2 = <b>zooplankton</b> (Ex 3); <b>no secondary producers</b> (Ex 4); PAR = <b>50%</b> option (Ex 5).");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["energyflow"] = window.SIMS["energy-flow"];

window.SIMS["pyramids"] = (function(){
  var kind = "numgrass";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Producers (base)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Herbivores</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Carnivores (apex)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ng">Numbers: grassland upright</button>' +
      '<button class="preset-btn" id="p-nt">Numbers: tree inverted</button>' +
      '<button class="preset-btn" id="p-bs">Biomass: sea inverted</button>' +
      '<button class="preset-btn" id="p-en">Energy: always upright</button>';
    document.getElementById("p-ng").onclick = function(){ setActivePreset(this); kind="numgrass"; draw(App.state.t); };
    document.getElementById("p-nt").onclick = function(){ setActivePreset(this); kind="numtree"; draw(App.state.t); };
    document.getElementById("p-bs").onclick = function(){ setActivePreset(this); kind="biosea"; draw(App.state.t); };
    document.getElementById("p-en").onclick = function(){ setActivePreset(this); kind="energy"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Base size (illustrative)</span><span class="val" id="ctrl-pb">100</span></div>' +
      '<input type="range" id="ctrl-pb-range" min="40" max="100" step="5" value="100"></div>';
    document.getElementById("ctrl-pb-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var pb = numEl("ctrl-pb-range", 100);
    var el = document.getElementById("ctrl-pb"); if(el) el.textContent = pb;
    var rows, title, note;
    if(kind === "numgrass"){ rows = [pb, 62, 34, 12]; title = "Numbers upright: ~6M plants -&gt; 3 top-carnivores (Fig 12.4a)"; note = "Base widest: producers exceed every level above."; }
    else if(kind === "numtree"){ rows = [18, 60, 40, 22]; title = "Numbers INVERTED: 1 tree -&gt; insects -&gt; small -&gt; large birds"; note = "One producer supports counted crowds upward."; }
    else if(kind === "biosea"){ rows = [26, 70, 48, 24]; title = "Biomass INVERTED sea: fishes &gt; phytoplankton (Fig 12.4c)"; note = "Tiny fast-turnover crop feeds a bigger zooplankton crop."; }
    else { rows = [pb, 60, 32, 12]; title = "Energy ALWAYS upright: ~1% sunlight to NPP, ~10% per level (Fig 12.4d)"; note = "Heat lost each transfer; watts cannot be recycled."; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">' + title + '</text>';
    var cols = ["#34d399", "#f59e0b", "#38bdf8", "#a78bfa"];
    var names = ["producers", "herbivores", "carnivores", "top"];
    for(var i=0;i<4;i++){
      var w = Math.max(30, rows[i] / 100 * 300);
      var bx = 200 - w / 2 + 60;
      var by = 50 + i * 48;
      var sway = Math.sin(t * 2 + i) * 2;
      m += '<rect x="' + (bx + sway).toFixed(0) + '" y="' + by + '" width="' + w.toFixed(0) + '" height="38" rx="4" fill="' + cols[i] + '" opacity="0.9"/>';
      m += '<text x="' + (bx + w + 14 + sway).toFixed(0) + '" y="' + (by + 24) + '" fill="#94a3b8" font-size="11">' + names[i] + '</text>';
    }
    m += '<text x="480" y="120" fill="#e2e8f0" font-size="13">shape: ' + ((kind === "numtree" || kind === "biosea") ? "INVERTED" : "upright") + '</text>';
    m += '<text x="480" y="144" fill="#94a3b8" font-size="12">apex = tertiary/top</text>';
    m += '<text x="480" y="166" fill="#94a3b8" font-size="12">base = producers T1</text>';
    m += '<text x="360" y="262" fill="#94a3b8" font-size="12" text-anchor="middle">' + note + '</text>';
    m += '<text x="360" y="282" fill="#64748b" font-size="11" text-anchor="middle">Limits (p.214): no two-level species (sparrow), no food webs, no saprophytes; count ALL organisms; level = function.</text>';
    svg.innerHTML = m;
    readout(cell("type", kind === "energy" ? "energy" : (kind === "biosea" ? "biomass" : "numbers")) + cell("shape", (kind === "numtree" || kind === "biosea") ? "INVERTED" : "upright", (kind === "numtree" || kind === "biosea") ? "#f59e0b" : "#34d399") + cell("base", "producers") + cell("apex", "top consumers"));
    if(kind === "energy") verdict("<b>Section 12.5 (Fig 12.4d; Exercise 1e-f):</b> energy is <b>always upright, never inverted</b> — heat lost each transfer; producers convert only <b>~1% of sunlight</b> to NPP. Bar = energy per level per time/area.");
    else if(kind === "numtree") verdict("<b>Section 12.5 / Exercise 1(b) (Fig 12.4 tree case):</b> tree-dominated pyramid of numbers is <b>inverted</b> — 1 tree, thousands of insects, tens of small birds, few large birds. Census the banyan to see it.");
    else if(kind === "biosea") verdict("<b>Section 12.5 (Fig 12.4c):</b> sea biomass pyramid is <b>generally inverted</b> — fish biomass exceeds the small phytoplankton standing crop. Energy above the same water stays upright (rate vs instant).");
    else verdict("<b>Section 12.5 (Fig 12.4a-b; Exercise 8):</b> grassland numbers upright — <b>nearly 6 million plants support 3 top-carnivores</b>; biomass usually upright with sharp fall upward. Base = producers, apex = top consumers.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["pyramids"] = window.SIMS["pyramids"];
