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

window.SIMS["flower-whorls"] = (function(){
  var sel = "androecium";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Calyx (sepals)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Corolla (petals)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Androecium (male)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Gynoecium (female)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-cal">Calyx</button>' +
      '<button class="preset-btn" id="p-cor">Corolla</button>' +
      '<button class="preset-btn active" id="p-and">Ex 1: androecium</button>' +
      '<button class="preset-btn" id="p-gyn">Ex 1: gynoecium</button>';
    document.getElementById("p-cal").onclick = function(){ setActivePreset(this); sel="calyx"; draw(App.state.t); };
    document.getElementById("p-cor").onclick = function(){ setActivePreset(this); sel="corolla"; draw(App.state.t); };
    document.getElementById("p-and").onclick = function(){ setActivePreset(this); sel="androecium"; draw(App.state.t); };
    document.getElementById("p-gyn").onclick = function(){ setActivePreset(this); sel="gynoecium"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Bloom openness</span><span class="val" id="ctrl-open">70</span></div>' +
      '<input type="range" id="ctrl-open-range" min="0" max="100" step="1" value="70"></div>';
    document.getElementById("ctrl-open-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function whorl(fill, dim){
    return dim ? "#1e293b" : fill;
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var open = numEl("ctrl-open-range", 70);
    var el = document.getElementById("ctrl-open"); if(el) el.textContent = open.toFixed(0);
    var spread = 20 + open * 0.7 + Math.sin(t) * 3;
    var dimC = sel !== "calyx", dimP = sel !== "corolla", dimA = sel !== "androecium", dimG = sel !== "gynoecium";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 1.1 style L.S. of flower: 4 whorls on the thalamus</text>';
    m += '<rect x="170" y="248" width="160" height="14" rx="4" fill="#334155"/>';
    m += '<text x="250" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">thalamus</text>';
    m += '<path d="M ' + (250-spread-40) + ' 248 Q 200 190 150 170" fill="none" stroke="' + whorl("#34d399", dimC) + '" stroke-width="' + (sel==="calyx"?5:3) + '"/>';
    m += '<path d="M ' + (250+spread+40) + ' 248 Q 300 190 350 170" fill="none" stroke="' + whorl("#34d399", dimC) + '" stroke-width="' + (sel==="calyx"?5:3) + '"/>';
    m += '<path d="M ' + (250-spread-15) + ' 248 Q 215 180 185 150" fill="none" stroke="' + whorl("#f472b6", dimP) + '" stroke-width="' + (sel==="corolla"?6:4) + '"/>';
    m += '<path d="M ' + (250+spread+15) + ' 248 Q 285 180 315 150" fill="none" stroke="' + whorl("#f472b6", dimP) + '" stroke-width="' + (sel==="corolla"?6:4) + '"/>';
    var aw = sel === "androecium" ? 4 : 2;
    m += '<line x1="' + (250-spread+25) + '" y1="248" x2="' + (250-40) + '" y2="130" stroke="' + whorl("#f59e0b", dimA) + '" stroke-width="' + aw + '"/>';
    m += '<line x1="' + (250+spread-25) + '" y1="248" x2="' + (250+40) + '" y2="130" stroke="' + whorl("#f59e0b", dimA) + '" stroke-width="' + aw + '"/>';
    m += '<ellipse cx="210" cy="122" rx="12" ry="20" fill="' + whorl("#f59e0b", dimA) + '"/>';
    m += '<ellipse cx="290" cy="122" rx="12" ry="20" fill="' + whorl("#f59e0b", dimA) + '"/>';
    for(var i=0;i<6;i++){
      var px = 204 + (i*5 + t*9) % 12;
      m += '<circle cx="' + px + '" cy="' + (108 + (i*7)%26) + '" r="1.8" fill="#fde68a"/>';
      var qx = 284 + (i*5 + t*9) % 12;
      m += '<circle cx="' + qx + '" cy="' + (108 + (i*7)%26) + '" r="1.8" fill="#fde68a"/>';
    }
    m += '<text x="210" y="92" fill="#f59e0b" font-size="11" text-anchor="middle">anther</text>';
    m += '<rect x="228" y="180" width="44" height="66" rx="12" fill="' + whorl("#a78bfa", dimG) + '" stroke="' + (sel==="gynoecium" ? "#f8fafc" : "#475569") + '" stroke-width="' + (sel==="gynoecium"?3:1) + '"/>';
    m += '<line x1="250" y1="180" x2="250" y2="120" stroke="' + whorl("#a78bfa", dimG) + '" stroke-width="' + (sel==="gynoecium"?6:3) + '"/>';
    m += '<ellipse cx="250" cy="110" rx="18" ry="10" fill="' + whorl("#a78bfa", dimG) + '"/>';
    m += '<circle cx="250" cy="215" r="7" fill="#0f1f2e" stroke="#e2e8f0"/>';
    m += '<circle cx="250" cy="215" r="3" fill="#e2e8f0"/>';
    m += '<text x="250" y="140" fill="#94a3b8" font-size="11" text-anchor="middle">stigma + style</text>';
    m += '<text x="250" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">ovary (ovule inside)</text>';
    m += '<text x="470" y="90" fill="#e2e8f0" font-size="14">Selected: ' + sel + '</text>';
    m += '<text x="470" y="114" fill="#f59e0b" font-size="13">male gametophyte: pollen in anther</text>';
    m += '<text x="470" y="136" fill="#a78bfa" font-size="13">female gametophyte: embryo sac in ovule</text>';
    m += '<text x="470" y="160" fill="#94a3b8" font-size="12">stamen = filament + bilobed anther</text>';
    m += '<text x="470" y="180" fill="#94a3b8" font-size="12">pistil = stigma + style + ovary</text>';
    m += '<text x="470" y="204" fill="#34d399" font-size="12">androecium - male organ</text>';
    m += '<text x="470" y="224" fill="#a78bfa" font-size="12">gynoecium - female organ</text>';
    svg.innerHTML = m;
    var role = sel === "androecium" ? "male organ" : (sel === "gynoecium" ? "female organ" : (sel === "calyx" ? "protection" : "attraction"));
    var site = sel === "androecium" ? "pollen grains in anther" : (sel === "gynoecium" ? "embryo sac in ovule" : "no gametophyte");
    readout(cell("whorl", sel) + cell("role", role, "#38bdf8") + cell("gametophyte site", site, "#f59e0b"));
    if(sel === "androecium") verdict("<b>Exercise 1:</b> the male gametophyte (pollen grain) develops in the anther of the stamen — the androecium. Stamen = filament + bilobed dithecous anther (Fig. 1.2, Sec 1.2.1).");
    else if(sel === "gynoecium") verdict("<b>Exercise 1:</b> the female gametophyte (embryo sac) develops in the ovule inside the ovary — the gynoecium. Pistil = stigma (landing platform) + style + ovary (Sec 1.2.2, Fig. 1.7a).");
    else verdict("<b>Sections 1.1-1.2:</b> calyx and corolla are accessory whorls; only androecium and gynoecium house gametophytes. Floral primordium differentiates both before the bud opens.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["stamen-pollen"] = (function(){
  var focus = "seq";
  var names = ["sporogenous tissue", "pollen mother cell (PMC)", "meiosis I: dyad", "meiosis II: microspore tetrad", "free microspores + wall layers", "pollen mitosis: vegetative + generative", "shed pollen grain"];
  var ploidy = ["2n", "2n", "n + n", "n x 4", "n", "n", "n"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>PMC / microspores (n or 2n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Tapetum (nourishing)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Exine sporopollenin</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-seq">Ex 3: full sequence</button>' +
      '<button class="preset-btn" id="p-wall">Wall layers + tapetum</button>' +
      '<button class="preset-btn" id="p-shed">Shed: 2-celled (&gt;60%)</button>' +
      '<button class="preset-btn" id="p-via">Viability + pollen bank</button>';
    document.getElementById("p-seq").onclick = function(){ setActivePreset(this); focus="seq"; draw(App.state.t); };
    document.getElementById("p-wall").onclick = function(){ setActivePreset(this); focus="wall"; var r=document.getElementById("ctrl-stage-range"); if(r) r.value=4; draw(App.state.t); };
    document.getElementById("p-shed").onclick = function(){ setActivePreset(this); focus="shed"; var r2=document.getElementById("ctrl-stage-range"); if(r2) r2.value=6; draw(App.state.t); };
    document.getElementById("p-via").onclick = function(){ setActivePreset(this); focus="via"; var r3=document.getElementById("ctrl-stage-range"); if(r3) r3.value=6; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Development stage</span><span class="val" id="ctrl-stage">3</span></div>' +
      '<input type="range" id="ctrl-stage-range" min="0" max="6" step="1" value="3"></div>' +
      '<div class="control-item"><div class="control-label"><span>Shed type</span><span class="val" id="ctrl-shedv">2-celled</span></div>' +
      '<select id="ctrl-shed"><option value="2-celled">2-celled (&gt;60%)</option><option value="3-celled">3-celled (rest)</option></select></div>';
    document.getElementById("ctrl-stage-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-shed").onchange = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = Math.round(numEl("ctrl-stage-range", 3));
    var shedEl = document.getElementById("ctrl-shed");
    var shed = shedEl ? shedEl.value : "2-celled";
    var e1 = document.getElementById("ctrl-stage"); if(e1) e1.textContent = st;
    var e2 = document.getElementById("ctrl-shedv"); if(e2) e2.textContent = shed;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="200" y="30" fill="#94a3b8" font-size="13" text-anchor="middle">Anther (dithecous, 4 microsporangia) - microsporogenesis</text>';
    m += '<rect x="60" y="48" width="280" height="120" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    var cx = 200, cy = 108;
    if(st === 0){
      for(var a=0;a<12;a++){
        var ax = 100 + (a%4)*50, ay = 70 + Math.floor(a/4)*35;
        m += '<circle cx="' + ax + '" cy="' + ay + '" r="12" fill="#f59e0b" opacity="0.85"/>';
      }
      m += '<text x="200" y="186" fill="#94a3b8" font-size="11" text-anchor="middle">compact sporogenous tissue (centre)</text>';
    } else if(st === 1){
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="30" fill="#f59e0b"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="#7c2d12"/>';
      m += '<text x="200" y="186" fill="#94a3b8" font-size="11" text-anchor="middle">PMC (2n) - dense cytoplasm</text>';
    } else if(st === 2){
      var off = 4 + Math.min(10, t*2);
      m += '<circle cx="' + (cx-off) + '" cy="' + cy + '" r="22" fill="#f59e0b"/>';
      m += '<circle cx="' + (cx+off) + '" cy="' + cy + '" r="22" fill="#f59e0b"/>';
      m += '<text x="200" y="186" fill="#94a3b8" font-size="11" text-anchor="middle">dyad after meiosis I (n + n)</text>';
    } else if(st === 3){
      m += '<circle cx="170" cy="90" r="18" fill="#f59e0b"/><circle cx="230" cy="90" r="18" fill="#f59e0b"/>';
      m += '<circle cx="170" cy="128" r="18" fill="#f59e0b"/><circle cx="230" cy="128" r="18" fill="#f59e0b"/>';
      m += '<text x="200" y="186" fill="#94a3b8" font-size="11" text-anchor="middle">microspore tetrad (haploid x 4)</text>';
    } else if(st === 4){
      m += '<rect x="60" y="48" width="280" height="120" rx="8" fill="none" stroke="#38bdf8" stroke-dasharray="5 3"/>';
      m += '<circle cx="130" cy="100" r="16" fill="#f59e0b"/><circle cx="200" cy="88" r="16" fill="#f59e0b"/>';
      m += '<circle cx="270" cy="100" r="16" fill="#f59e0b"/><circle cx="200" cy="132" r="16" fill="#f59e0b"/>';
      m += '<text x="200" y="186" fill="#38bdf8" font-size="11" text-anchor="middle">epidermis | endothecium | middle | tapetum (inner)</text>';
    } else {
      m += '<circle cx="200" cy="105" r="42" fill="none" stroke="#34d399" stroke-width="7"/>';
      m += '<circle cx="200" cy="105" r="34" fill="none" stroke="#e2c07a" stroke-width="2"/>';
      m += '<ellipse cx="192" cy="112" rx="20" ry="14" fill="#38bdf8" opacity="0.85"/>';
      m += '<ellipse cx="214" cy="96" rx="9" ry="6" fill="#7c2d12"/>';
      m += '<rect x="238" y="92" width="10" height="26" fill="#09131d"/>';
      m += '<text x="200" y="186" fill="#94a3b8" font-size="11" text-anchor="middle">exine (sporopollenin) + intine; germ pore gap</text>';
      if(shed === "3-celled"){
        m += '<circle cx="212" cy="118" r="4" fill="#f8fafc"/><circle cx="222" cy="118" r="4" fill="#f8fafc"/>';
        m += '<text x="200" y="200" fill="#f59e0b" font-size="11" text-anchor="middle">3-celled: vegetative + 2 male gametes</text>';
      } else {
        m += '<text x="200" y="200" fill="#f59e0b" font-size="11" text-anchor="middle">2-celled: vegetative + generative (shed in &gt;60%)</text>';
      }
    }
    m += '<text x="480" y="60" fill="#e2e8f0" font-size="14">Stage ' + st + ': ' + names[st] + '</text>';
    m += '<text x="480" y="84" fill="#38bdf8" font-size="13">ploidy: ' + ploidy[st] + '</text>';
    m += '<text x="480" y="108" fill="#94a3b8" font-size="12">anther: tetragonal, 4 microsporangia</text>';
    m += '<text x="480" y="130" fill="#94a3b8" font-size="12">pollen size 25-50 micrometres</text>';
    m += '<text x="480" y="152" fill="#34d399" font-size="12">exine resists acid, alkali, heat</text>';
    m += '<text x="480" y="174" fill="#f59e0b" font-size="12">shed: ' + shed + '</text>';
    m += '<text x="480" y="196" fill="#94a3b8" font-size="12">rice, wheat: viable ~30 min</text>';
    m += '<text x="480" y="218" fill="#38bdf8" font-size="12">pollen banks: liquid N2 (-196 C)</text>';
    svg.innerHTML = m;
    readout(cell("stage", st + " / 6") + cell("ploidy", ploidy[st], "#38bdf8") + cell("shed", shed, "#f59e0b") + cell("size", "25-50 um", "#34d399"));
    if(focus === "wall") verdict("<b>Section 1.2.1, Fig. 1.3:</b> four wall layers — epidermis, endothecium, middle layers, nutritive tapetum (dense, often multinucleate). Outer three protect and aid dehiscence; tapetum feeds the grains.");
    else if(focus === "shed") verdict("<b>Section 1.2.1:</b> mature grain holds large vegetative cell + spindle generative cell; shed <b>2-celled in over 60% of angiosperms</b>, 3-celled (two male gametes) in the rest. In-text check: each tetrad cell is haploid (n).");
    else if(focus === "via") verdict("<b>Section 1.2.1 viability:</b> rice and wheat pollen lost within <b>30 minutes</b>; some Rosaceae, Leguminosae, Solanaceae keep months; banks store years in <b>liquid nitrogen (-196 C)</b>. Parthenium pollen causes allergy.");
    else verdict("<b>Exercise 3 order:</b> sporogenous tissue -&gt; pollen mother cell -&gt; microspore tetrad -&gt; pollen grain -&gt; male gametes (5 stages). Microsporogenesis is meiosis: PMC (2n) gives four haploid microspores.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["pistil-embryosac"] = (function(){
  var steps = ["MMC in micropylar nucellus (2n)", "meiosis: 4 megaspores (n)", "1 functional + 3 degenerate", "2-nucleate (poles)", "4-nucleate", "8-nucleate free-nuclear", "7-celled, 8-nucleate organised"];
  var nuclei = [1, 4, 1, 2, 4, 8, 8];
  var cells = [1, 4, 1, 1, 1, 1, 7];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Functional megaspore / sac</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#64748b;"></span><span>Degenerating megaspores</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Egg apparatus + polars</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-ex5">Ex 5: monosporic</button>' +
      '<button class="preset-btn active" id="p-ex6">Ex 6: 7 cells, 8 nuclei</button>' +
      '<button class="preset-btn" id="p-plo">In-text: ploidy line</button>';
    document.getElementById("p-ex5").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-step-range"); if(r) r.value=2; draw(App.state.t); };
    document.getElementById("p-ex6").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-step-range"); if(r) r.value=6; draw(App.state.t); };
    document.getElementById("p-plo").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-step-range"); if(r) r.value=0; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Builder step</span><span class="val" id="ctrl-step">6</span></div>' +
      '<input type="range" id="ctrl-step-range" min="0" max="6" step="1" value="6"></div>';
    document.getElementById("ctrl-step-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function dot(x, y, c){
    return '<circle cx="' + x + '" cy="' + y + '" r="6" fill="' + c + '"/>';
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = Math.round(numEl("ctrl-step-range", 6));
    var e1 = document.getElementById("ctrl-step"); if(e1) e1.textContent = st;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="200" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Ovule (anatropous): funicle, integuments, micropyle, chalaza, nucellus</text>';
    m += '<ellipse cx="200" cy="160" rx="90" ry="100" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="200" y="52" fill="#94a3b8" font-size="11" text-anchor="middle">micropyle (top)</text>';
    m += '<text x="200" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">chalaza (base)</text>';
    m += '<ellipse cx="200" cy="160" rx="46" ry="66" fill="#16283a" stroke="#475569"/>';
    if(st === 0){
      m += '<circle cx="200" cy="150" r="16" fill="#a78bfa"/>';
      m += '<text x="200" y="230" fill="#94a3b8" font-size="11" text-anchor="middle">single MMC (2n), dense cytoplasm</text>';
    } else if(st === 1){
      m += dot(200, 100, "#a78bfa") + dot(200, 130, "#a78bfa") + dot(200, 160, "#a78bfa") + dot(200, 190, "#a78bfa");
      m += '<text x="200" y="230" fill="#94a3b8" font-size="11" text-anchor="middle">meiotic tetrad of 4 megaspores (n)</text>';
    } else if(st === 2){
      m += dot(200, 100, "#64748b") + dot(200, 130, "#64748b") + dot(200, 160, "#64748b");
      m += '<line x1="190" y1="92" x2="210" y2="108" stroke="#f87171" stroke-width="2"/><line x1="190" y1="122" x2="210" y2="138" stroke="#f87171" stroke-width="2"/><line x1="190" y1="152" x2="210" y2="168" stroke="#f87171" stroke-width="2"/>';
      m += '<circle cx="200" cy="195" r="14" fill="#a78bfa"/>';
      m += '<text x="200" y="230" fill="#94a3b8" font-size="11" text-anchor="middle">monosporic: 1 functional, 3 degenerate</text>';
    } else if(st <= 5){
      var n = nuclei[st];
      m += '<ellipse cx="200" cy="155" rx="34" ry="52" fill="#1d3350" stroke="#a78bfa"/>';
      if(n === 2){ m += dot(200, 115, "#f59e0b") + dot(200, 195, "#f59e0b"); }
      else if(n === 4){ m += dot(185, 115, "#f59e0b") + dot(215, 115, "#f59e0b") + dot(185, 195, "#f59e0b") + dot(215, 195, "#f59e0b"); }
      else { m += dot(185, 112, "#f59e0b") + dot(215, 112, "#f59e0b") + dot(170, 155, "#f59e0b") + dot(230, 155, "#f59e0b") + dot(185, 198, "#f59e0b") + dot(215, 198, "#f59e0b") + dot(200, 132, "#38bdf8") + dot(200, 178, "#38bdf8"); }
      m += '<text x="200" y="230" fill="#94a3b8" font-size="11" text-anchor="middle">free-nuclear mitoses: no walls yet</text>';
    } else {
      m += '<ellipse cx="200" cy="155" rx="36" ry="56" fill="#1d3350" stroke="#f8fafc" stroke-width="2"/>';
      m += dot(185, 108, "#f59e0b") + dot(215, 108, "#f59e0b") + dot(200, 122, "#f87171");
      m += '<text x="200" y="84" fill="#f59e0b" font-size="10" text-anchor="middle">egg apparatus: 2 synergids + egg</text>';
      m += dot(185, 202, "#94a3b8") + dot(200, 210, "#94a3b8") + dot(215, 202, "#94a3b8");
      m += '<text x="200" y="240" fill="#94a3b8" font-size="10" text-anchor="middle">3 antipodals (chalazal)</text>';
      m += dot(192, 155, "#38bdf8") + dot(208, 155, "#38bdf8");
      m += '<text x="292" y="158" fill="#38bdf8" font-size="11">central cell: 2 polars</text>';
      m += '<line x1="184" y1="116" x2="216" y2="116" stroke="#f59e0b" stroke-dasharray="3 2"/>';
      m += '<text x="292" y="120" fill="#94a3b8" font-size="11">filiform apparatus</text>';
    }
    m += '<text x="470" y="60" fill="#e2e8f0" font-size="14">Step ' + st + ': ' + steps[st] + '</text>';
    m += '<text x="470" y="86" fill="#38bdf8" font-size="13">nuclei: ' + nuclei[st] + '  cells: ' + cells[st] + '</text>';
    m += '<text x="470" y="110" fill="#94a3b8" font-size="12">nucellus 2n, MMC 2n, sac n</text>';
    m += '<text x="470" y="132" fill="#94a3b8" font-size="12">one ovule: generally one sac</text>';
    m += '<text x="470" y="154" fill="#f59e0b" font-size="12">egg + 2 synergids (micropylar)</text>';
    m += '<text x="470" y="176" fill="#94a3b8" font-size="12">3 antipodals (chalazal)</text>';
    m += '<text x="470" y="198" fill="#38bdf8" font-size="12">central cell: 2 polar nuclei</text>';
    svg.innerHTML = m;
    readout(cell("nuclei", String(nuclei[st]), "#38bdf8") + cell("cells", String(cells[st]), "#f59e0b") + cell("origin", "1 functional megaspore"));
    if(st <= 1) verdict("<b>In-text ploidy, Sec 1.2.2:</b> nucellus 2n, MMC 2n; meiosis gives four haploid (n) megaspores. MMC must divide meiotically to halve the number for the gametophyte.");
    else if(st <= 3) verdict("<b>Exercise 5:</b> monosporic development — the sac grows from a single functional megaspore while three degenerate. Divisions are strictly free-nuclear (Fig. 1.8a).");
    else verdict("<b>Exercise 6, Fig. 1.8b-c:</b> 3 mitoses give 8 nuclei; walls enclose six, leaving 2 polars in one central cell: 3 (egg apparatus) + 3 (antipodals) + 1 (central) = <b>7 cells, 8 nuclei</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["pollination"] = (function(){
  var agent = "wind";
  var ftype = "chasmogamous";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pollen in transit</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Stigma (receptive)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Reward / surface</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-wind">Wind (grasses, corn cob)</button>' +
      '<button class="preset-btn" id="p-water">Water (Vallisneria)</button>' +
      '<button class="preset-btn" id="p-insect">Insect (bees, Yucca)</button>';
    document.getElementById("p-wind").onclick = function(){ setActivePreset(this); agent="wind"; draw(App.state.t); };
    document.getElementById("p-water").onclick = function(){ setActivePreset(this); agent="water"; draw(App.state.t); };
    document.getElementById("p-insect").onclick = function(){ setActivePreset(this); agent="insect"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Flower type</span><span class="val" id="ctrl-ft">chasmogamous</span></div>' +
      '<select id="ctrl-ftsel"><option value="chasmogamous">chasmogamous (open)</option><option value="cleistogamous">cleistogamous (closed: Viola, Oxalis, Commelina)</option></select></div>';
    document.getElementById("ctrl-ftsel").onchange = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var fsel = document.getElementById("ctrl-ftsel");
    ftype = fsel ? fsel.value : "chasmogamous";
    var e1 = document.getElementById("ctrl-ft"); if(e1) e1.textContent = ftype;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var i, px, py;
    if(ftype === "cleistogamous"){
      m += '<ellipse cx="220" cy="160" rx="60" ry="80" fill="#14532d" stroke="#34d399" stroke-width="3"/>';
      m += '<text x="220" y="165" fill="#e2e8f0" font-size="12" text-anchor="middle">bud never opens</text>';
      m += '<text x="220" y="250" fill="#34d399" font-size="12" text-anchor="middle">anthers dehisce inside; stigma close</text>';
    } else if(agent === "wind"){
      m += '<line x1="120" y1="240" x2="120" y2="120" stroke="#34d399" stroke-width="4"/>';
      m += '<ellipse cx="120" cy="110" rx="30" ry="14" fill="#365314"/>';
      m += '<path d="M 300 240 L 300 130" stroke="#94a3b8" stroke-width="3"/>';
      m += '<path d="M 270 130 Q 300 100 330 130" fill="none" stroke="#f59e0b" stroke-width="4"/>';
      m += '<text x="300" y="110" fill="#f59e0b" font-size="11" text-anchor="middle">feathery stigma (corn cob silk)</text>';
      for(i=0;i<14;i++){
        px = 140 + ((i*53 + t*60) % 150); py = 120 + ((i*29 + t*14) % 90);
        m += '<circle cx="' + px + '" cy="' + py + '" r="2.2" fill="#38bdf8"/>';
      }
      m += '<text x="220" y="265" fill="#94a3b8" font-size="11" text-anchor="middle">light, non-sticky pollen; dull, nectarless; single ovule</text>';
    } else if(agent === "water"){
      m += '<rect x="60" y="170" width="320" height="100" fill="#0c2437"/>';
      m += '<line x1="60" y1="170" x2="380" y2="170" stroke="#38bdf8" stroke-width="3"/>';
      m += '<text x="220" y="160" fill="#38bdf8" font-size="11" text-anchor="middle">water surface</text>';
      m += '<line x1="300" y1="170" x2="300" y2="120" stroke="#34d399" stroke-width="3"/>';
      m += '<circle cx="300" cy="112" r="12" fill="#f472b6"/>';
      m += '<text x="300" y="96" fill="#e2e8f0" font-size="10" text-anchor="middle">female flower (long stalk)</text>';
      for(i=0;i<5;i++){
        px = 120 + ((i*47 + t*40) % 130);
        m += '<ellipse cx="' + px + '" cy="170" rx="9" ry="5" fill="#f59e0b"/>';
      }
      m += '<text x="220" y="285" fill="#94a3b8" font-size="11" text-anchor="middle">male flowers float over; Zostera: ribbon pollen</text>';
    } else {
      m += '<circle cx="220" cy="160" r="46" fill="#f472b6"/>';
      m += '<circle cx="220" cy="160" r="16" fill="#f59e0b"/>';
      m += '<text x="220" y="230" fill="#34d399" font-size="11" text-anchor="middle">large, colourful, fragrant, nectar-rich</text>';
      var bx = 150 + (t*50 % 140);
      m += '<ellipse cx="' + bx + '" cy="120" rx="16" ry="10" fill="#fbbf24"/>';
      m += '<circle cx="' + (bx+14) + '" cy="118" r="6" fill="#92400e"/>';
      for(i=0;i<5;i++){ m += '<circle cx="' + (bx-8+i*4) + '" cy="' + (128+(i%2)*4) + '" r="2" fill="#38bdf8"/>'; }
      m += '<text x="220" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">sticky pollen; bees + Yucca moth; robbers skip contact</text>';
    }
    m += '<text x="470" y="70" fill="#e2e8f0" font-size="14">Agent: ' + agent + '</text>';
    m += '<text x="470" y="94" fill="#38bdf8" font-size="13">flower: ' + ftype + '</text>';
    var genetic = ftype === "cleistogamous" ? "invariably autogamous" : (agent === "insect" ? "often xenogamy (outbreeding)" : "wind/water: abiotic transfer");
    m += '<text x="470" y="118" fill="#34d399" font-size="12">' + genetic + '</text>';
    m += '<text x="470" y="142" fill="#94a3b8" font-size="12">autogamy: same flower</text>';
    m += '<text x="470" y="162" fill="#94a3b8" font-size="12">geitonogamy: same plant (genetically autogamy)</text>';
    m += '<text x="470" y="182" fill="#94a3b8" font-size="12">xenogamy: different plant (only true cross)</text>';
    m += '<text x="470" y="206" fill="#f59e0b" font-size="12">outbreeding: dichogamy, herkogamy,</text>';
    m += '<text x="470" y="224" fill="#f59e0b" font-size="12">self-incompatibility, monoecy, dioecy</text>';
    svg.innerHTML = m;
    readout(cell("agent", agent, "#38bdf8") + cell("flower", ftype) + cell("water genera", "~30", "#34d399") + cell("genetics", genetic, "#f59e0b"));
    if(ftype === "cleistogamous") verdict("<b>Exercise 7:</b> cleistogamous flowers (Viola, Oxalis, Commelina) never open, so no cross-pollen can land — cross-pollination cannot occur; they are <b>invariably autogamous</b> with assured seed-set.");
    else if(agent === "water") verdict("<b>Section 1.2.3:</b> water pollination is rare (~<b>30 genera, mostly monocots</b>): Vallisneria floats male flowers to surface female flowers; Hydrilla similar; submerged Zostera uses long <b>ribbon-like pollen</b>. Water hyacinth and water lily instead rise above water.");
    else if(agent === "wind") verdict("<b>Section 1.2.3:</b> wind flowers: light non-sticky pollen, exposed stamens, large <b>feathery stigmas</b> (corn-cob silk), single ovule, packed inflorescences; dull and nectarless. Grasses are the model.");
    else verdict("<b>Section 1.2.3:</b> animal pollinators (mostly <b>insects, especially bees</b>) serve large colourful fragrant nectar-rich flowers with sticky pollen — Amorphophallus (~<b>6 feet</b>) and the obligate <b>Yucca-moth</b> pact. Visitors skipping contact are <b>pollen/nectar robbers</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["double-fertilisation"] = (function(){
  var steps = ["pollen tube enters synergid", "2 male gametes released", "syngamy: egg + gamete", "triple fusion: 2 polars + gamete", "PEC + zygote: endosperm first"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Pollen tube</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Male gametes (n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Egg / polars</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-syn">Syngamy (2n)</button>' +
      '<button class="preset-btn" id="p-tri">Ex 11: triple fusion (3n)</button>' +
      '<button class="preset-btn" id="p-end">Ex 12: endosperm first</button>';
    document.getElementById("p-syn").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-df-range"); if(r) r.value=2; draw(App.state.t); };
    document.getElementById("p-tri").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-df-range"); if(r) r.value=3; draw(App.state.t); };
    document.getElementById("p-end").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-df-range"); if(r) r.value=4; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Fertilisation step</span><span class="val" id="ctrl-df">2</span></div>' +
      '<input type="range" id="ctrl-df-range" min="0" max="4" step="1" value="2"></div>';
    document.getElementById("ctrl-df-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var st = Math.round(numEl("ctrl-df-range", 2));
    var e1 = document.getElementById("ctrl-df"); if(e1) e1.textContent = st;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="210" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Embryo sac: tube via micropyle into a synergid (Fig. 1.12-1.13a)</text>';
    m += '<ellipse cx="210" cy="160" rx="110" ry="95" fill="#0f1f2e" stroke="#334155"/>';
    var tubeLen = st === 0 ? 30 + t*8 : 90;
    m += '<path d="M 210 40 L 210 ' + (40+tubeLen) + '" stroke="#34d399" stroke-width="7" stroke-linecap="round"/>';
    m += '<circle cx="210" cy="105" r="10" fill="none" stroke="#f59e0b"/>';
    m += '<text x="330" y="60" fill="#94a3b8" font-size="11">synergid (entry)</text>';
    m += '<circle cx="170" cy="170" r="11" fill="#38bdf8"/>';
    m += '<text x="140" y="200" fill="#38bdf8" font-size="11">egg (n)</text>';
    m += '<circle cx="250" cy="170" r="9" fill="#64748b"/>';
    m += '<text x="280" y="200" fill="#94a3b8" font-size="11">synergids</text>';
    m += '<circle cx="200" cy="220" r="8" fill="#38bdf8"/><circle cx="222" cy="220" r="8" fill="#38bdf8"/>';
    m += '<text x="262" y="240" fill="#38bdf8" font-size="11">2 polar nuclei (n+n)</text>';
    var g1x = 210, g1y = 130 + (st >= 1 ? 30 : 0), g2x = 210, g2y = 130 + (st >= 1 ? 55 : 10);
    if(st >= 1){
      if(st === 2){ g1x = 172; g1y = 168; }
      if(st >= 3){ g2x = 211; g2y = 218; }
      if(st === 2){ g2x = 210; g2y = 190; }
    }
    m += '<circle cx="' + g1x + '" cy="' + g1y + '" r="7" fill="#f59e0b"/>';
    m += '<circle cx="' + g2x + '" cy="' + g2y + '" r="7" fill="#f59e0b"/>';
    m += '<text x="210" y="272" fill="#f59e0b" font-size="11" text-anchor="middle">two male gametes (n + n)</text>';
    if(st >= 2){
      m += '<circle cx="170" cy="170" r="15" fill="none" stroke="#34d399" stroke-width="2"/>';
      m += '<text x="470" y="120" fill="#34d399" font-size="13">zygote (2n): egg + gamete</text>';
    }
    if(st >= 3){
      m += '<circle cx="211" cy="220" r="17" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="470" y="144" fill="#f59e0b" font-size="13">PEN (3n): polar + polar + gamete</text>';
    }
    m += '<text x="470" y="60" fill="#e2e8f0" font-size="14">Step ' + st + ': ' + steps[st] + '</text>';
    m += '<text x="470" y="86" fill="#38bdf8" font-size="13">syngamy: n + n = 2n</text>';
    m += '<text x="470" y="168" fill="#94a3b8" font-size="12">triple fusion: n + n + n = 3n</text>';
    m += '<text x="470" y="192" fill="#94a3b8" font-size="12">zygote -&gt; embryo; PEC -&gt; endosperm</text>';
    m += '<text x="470" y="214" fill="#34d399" font-size="12">double fertilisation: unique to</text>';
    m += '<text x="470" y="232" fill="#34d399" font-size="12">flowering plants (Sec 1.3)</text>';
    svg.innerHTML = m;
    readout(cell("syngamy", "n + n = 2n", "#34d399") + cell("triple fusion", "n + n + n = 3n", "#f59e0b") + cell("step", st + " / 4"));
    if(st <= 2) verdict("<b>Section 1.3:</b> the tube discharges <b>two male gametes</b> into the synergid; one fuses with the egg — <b>syngamy</b> — giving the diploid <b>zygote (2n)</b> (Fig. 1.13a).");
    else if(st === 3) verdict("<b>Exercise 11:</b> the second gamete fuses with the <b>two polar nuclei</b> in the central cell — <b>triple fusion</b> — giving the triploid <b>PEN (3n)</b>. Nuclei: polar + polar + male gamete.");
    else verdict("<b>Exercise 12, Sec 1.4:</b> the central cell becomes the PEC -&gt; endosperm; the zygote waits (dormant) while <b>endosperm forms first</b> — assured nutrition. Two fusions in one sac = <b>double fertilisation</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["post-fertilisation"] = (function(){
  var view = "dicot";
  var focus = "endosperm";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Endosperm (3n reserve)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Embryo (2n)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Fruit / seed coats</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-endo">Endosperm + coconut</button>' +
      '<button class="preset-btn" id="p-emb">Embryo stages</button>' +
      '<button class="preset-btn" id="p-fate">Fate map</button>' +
      '<button class="preset-btn" id="p-false">False + parthenocarpic</button>';
    document.getElementById("p-endo").onclick = function(){ setActivePreset(this); focus="endosperm"; draw(App.state.t); };
    document.getElementById("p-emb").onclick = function(){ setActivePreset(this); focus="embryo"; draw(App.state.t); };
    document.getElementById("p-fate").onclick = function(){ setActivePreset(this); focus="fate"; draw(App.state.t); };
    document.getElementById("p-false").onclick = function(){ setActivePreset(this); focus="false"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Embryo</span><span class="val" id="ctrl-em">dicot</span></div>' +
      '<select id="ctrl-emsel"><option value="dicot">dicot (2 cotyledons)</option><option value="monocot">grass monocot (scutellum)</option></select></div>';
    document.getElementById("ctrl-emsel").onchange = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var vsel = document.getElementById("ctrl-emsel");
    view = vsel ? vsel.value : "dicot";
    var e1 = document.getElementById("ctrl-em"); if(e1) e1.textContent = view;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Post-fertilisation (Sec 1.4): endosperm first, then embryo, seed and fruit</text>';
    var eo = focus === "endosperm" ? 1 : 0.45, bo = focus === "embryo" ? 1 : 0.45, fo = focus === "fate" || focus === "false" ? 1 : 0.45;
    m += '<g opacity="' + eo + '">';
    m += '<rect x="30" y="50" width="200" height="210" rx="8" fill="#0f1f2e" stroke="#f59e0b"/>';
    m += '<text x="130" y="70" fill="#f59e0b" font-size="12" text-anchor="middle">ENDOSPERM (3n)</text>';
    m += '<ellipse cx="130" cy="130" rx="60" ry="38" fill="#164e63"/>';
    m += '<text x="130" y="134" fill="#e2e8f0" font-size="10" text-anchor="middle">coconut water: free-nuclear</text>';
    m += '<rect x="70" y="180" width="120" height="26" rx="6" fill="#e2c07a"/>';
    m += '<text x="130" y="197" fill="#422006" font-size="10" text-anchor="middle">kernel: cellular</text>';
    m += '<text x="130" y="222" fill="#94a3b8" font-size="10" text-anchor="middle">pea: consumed; castor: stays</text>';
    m += '<text x="130" y="238" fill="#94a3b8" font-size="10" text-anchor="middle">cereals persist (wheat, rice)</text>';
    m += '</g><g opacity="' + bo + '">';
    m += '<rect x="245" y="50" width="200" height="210" rx="8" fill="#0f1f2e" stroke="#34d399"/>';
    if(view === "dicot"){
      m += '<text x="345" y="70" fill="#34d399" font-size="12" text-anchor="middle">DICOT EMBRYO</text>';
      m += '<ellipse cx="305" cy="140" rx="22" ry="34" fill="#34d399"/><ellipse cx="385" cy="140" rx="22" ry="34" fill="#34d399"/>';
      m += '<line x1="345" y1="120" x2="345" y2="210" stroke="#e2e8f0" stroke-width="5"/>';
      m += '<text x="345" y="110" fill="#94a3b8" font-size="10" text-anchor="middle">epicotyl/plumule up</text>';
      m += '<text x="345" y="228" fill="#94a3b8" font-size="10" text-anchor="middle">hypocotyl/radicle down</text>';
      m += '<text x="345" y="244" fill="#94a3b8" font-size="10" text-anchor="middle">axis + 2 cotyledons</text>';
    } else {
      m += '<text x="345" y="70" fill="#34d399" font-size="12" text-anchor="middle">GRASS EMBRYO</text>';
      m += '<ellipse cx="310" cy="150" rx="20" ry="40" fill="#34d399"/>';
      m += '<text x="310" y="154" fill="#052e16" font-size="10" text-anchor="middle">scutellum</text>';
      m += '<rect x="340" y="90" width="26" height="70" rx="8" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="353" y="82" fill="#38bdf8" font-size="10" text-anchor="middle">coleoptile</text>';
      m += '<rect x="340" y="170" width="26" height="50" rx="8" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="353" y="234" fill="#f59e0b" font-size="10" text-anchor="middle">coleorrhiza</text>';
    }
    m += '<text x="345" y="252" fill="#94a3b8" font-size="10" text-anchor="middle">zygote-proembryo-globular-heart</text>';
    m += '</g><g opacity="' + fo + '">';
    m += '<rect x="460" y="50" width="230" height="210" rx="8" fill="#0f1f2e" stroke="#38bdf8"/>';
    m += '<text x="575" y="70" fill="#38bdf8" font-size="12" text-anchor="middle">FATE MAP</text>';
    m += '<text x="475" y="96" fill="#e2e8f0" font-size="12">ovary -&gt; fruit (pericarp)</text>';
    m += '<text x="475" y="116" fill="#e2e8f0" font-size="12">ovule -&gt; seed</text>';
    m += '<text x="475" y="136" fill="#e2e8f0" font-size="12">integuments -&gt; testa</text>';
    m += '<text x="475" y="156" fill="#94a3b8" font-size="11">nucellus remnant -&gt; perisperm</text>';
    m += '<text x="475" y="176" fill="#94a3b8" font-size="11">ovary wall -&gt; pericarp</text>';
    m += '<text x="475" y="196" fill="#94a3b8" font-size="11">fleshy: mango, guava, orange</text>';
    m += '<text x="475" y="214" fill="#94a3b8" font-size="11">dry: groundnut, mustard</text>';
    m += '<text x="475" y="232" fill="#f59e0b" font-size="11">false: apple (thalamus); banana:</text>';
    m += '<text x="475" y="248" fill="#f59e0b" font-size="11">parthenocarpic, seedless</text>';
    m += '</g>';
    svg.innerHTML = m;
    readout(cell("ovary", "fruit", "#38bdf8") + cell("ovule", "seed") + cell("integuments", "testa", "#f59e0b") + cell("moisture", "10-15%", "#34d399"));
    if(focus === "endosperm") verdict("<b>Section 1.4.1:</b> PEN divides into triploid tissue; free-nuclear first, then cellular. Tender <b>coconut water is free-nuclear endosperm</b>; kernel is cellular. Pea, groundnut, beans consume it; castor, coconut, cereals retain it.");
    else if(focus === "embryo") verdict("<b>Section 1.4.2, Fig. 1.13b, Ex 13:</b> zygote -&gt; proembryo -&gt; globular -&gt; heart -&gt; mature. Dicot: axis + 2 cotyledons (epicotyl/plumule, hypocotyl/radicle). Grass: scutellum + coleoptile (shoot) + coleorrhiza (root).");
    else if(focus === "fate") verdict("<b>Section 1.4.3, Ex 13-14:</b> ovary -&gt; fruit, ovule -&gt; seed, integuments -&gt; <b>testa</b>, nucellus remnant -&gt; <b>perisperm</b> (black pepper, beet). Seeds dry to <b>10-15% moisture</b>; Lupinus ~<b>10,000 yr</b>, date palm ~<b>2,000 yr</b>.");
    else verdict("<b>Section 1.4.3, Ex 14/16:</b> true fruits from ovary alone; <b>false fruits</b> add thalamus (<b>apple, strawberry, cashew</b>). <b>Parthenocarpic</b> fruits form without fertilisation (<b>banana</b>, seedless; inducible by hormones).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["apomixis-polyembryony"] = (function(){
  var mode = "sexual";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sexual (meiosis + fusion)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Apomixis (no fertilisation)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Polyembryony (Citrus, mango)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-sex">Sexual</button>' +
      '<button class="preset-btn" id="p-apo">Apomixis (grasses)</button>' +
      '<button class="preset-btn" id="p-pol">Polyembryony (Citrus)</button>';
    document.getElementById("p-sex").onclick = function(){ setActivePreset(this); mode="sexual"; draw(App.state.t); };
    document.getElementById("p-apo").onclick = function(){ setActivePreset(this); mode="apomixis"; draw(App.state.t); };
    document.getElementById("p-pol").onclick = function(){ setActivePreset(this); mode="poly"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Embryos per seed (squeeze test)</span><span class="val" id="ctrl-emb">3</span></div>' +
      '<input type="range" id="ctrl-emb-range" min="1" max="5" step="1" value="3"></div>';
    document.getElementById("ctrl-emb-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var nEmb = Math.round(numEl("ctrl-emb-range", 3));
    var e1 = document.getElementById("ctrl-emb"); if(e1) e1.textContent = nEmb;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 1.5: sexual vs apomixis vs polyembryony (Ex 18)</text>';
    var so = mode === "sexual" ? 1 : 0.4, ao = mode === "apomixis" ? 1 : 0.4, po = mode === "poly" ? 1 : 0.4;
    var i, ex;
    m += '<g opacity="' + so + '"><rect x="30" y="45" width="200" height="215" rx="8" fill="#0f1f2e" stroke="#38bdf8"/>';
    m += '<text x="130" y="66" fill="#38bdf8" font-size="12" text-anchor="middle">SEXUAL</text>';
    m += '<circle cx="100" cy="120" r="14" fill="#38bdf8"/><circle cx="160" cy="120" r="14" fill="#f472b6"/>';
    m += '<text x="130" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">meiosis + fusion</text>';
    m += '<circle cx="130" cy="185" r="16" fill="#a78bfa"/>';
    m += '<text x="130" y="216" fill="#94a3b8" font-size="10" text-anchor="middle">1 embryo; segregates</text>';
    m += '<text x="130" y="232" fill="#f87171" font-size="10" text-anchor="middle">hybrid seed must be</text>';
    m += '<text x="130" y="246" fill="#f87171" font-size="10" text-anchor="middle">bought every year</text></g>';
    m += '<g opacity="' + ao + '"><rect x="245" y="45" width="200" height="215" rx="8" fill="#0f1f2e" stroke="#f59e0b"/>';
    m += '<text x="345" y="66" fill="#f59e0b" font-size="12" text-anchor="middle">APOMIXIS</text>';
    m += '<circle cx="345" cy="120" r="16" fill="#f59e0b"/>';
    m += '<text x="345" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">diploid egg, no reduction,</text>';
    m += '<text x="345" y="164" fill="#94a3b8" font-size="10" text-anchor="middle">no fertilisation</text>';
    m += '<circle cx="345" cy="195" r="16" fill="#f59e0b"/>';
    m += '<text x="345" y="226" fill="#94a3b8" font-size="10" text-anchor="middle">maternal clones</text>';
    m += '<text x="345" y="242" fill="#94a3b8" font-size="10" text-anchor="middle">Asteraceae, grasses</text></g>';
    m += '<g opacity="' + po + '"><rect x="460" y="45" width="230" height="215" rx="8" fill="#0f1f2e" stroke="#34d399"/>';
    m += '<text x="575" y="66" fill="#34d399" font-size="12" text-anchor="middle">POLYEMBRYONY</text>';
    m += '<ellipse cx="575" cy="140" rx="70" ry="46" fill="#14532d"/>';
    for(i=0;i<nEmb;i++){
      ex = 525 + i*(100/Math.max(1,(nEmb-1)||1)) - (nEmb===1? -50 : 0);
      if(nEmb === 1) ex = 575;
      m += '<ellipse cx="' + ex + '" cy="' + (130 + (i%2)*22) + '" rx="14" ry="18" fill="#34d399" stroke="#052e16"/>';
    }
    m += '<text x="575" y="206" fill="#e2e8f0" font-size="11" text-anchor="middle">' + nEmb + ' embryos in one seed</text>';
    m += '<text x="575" y="222" fill="#94a3b8" font-size="10" text-anchor="middle">nucellar cells protrude in;</text>';
    m += '<text x="575" y="236" fill="#94a3b8" font-size="10" text-anchor="middle">Citrus, mango; squeeze orange</text>';
    m += '<text x="575" y="250" fill="#94a3b8" font-size="10" text-anchor="middle">seeds, count sizes</text></g>';
    svg.innerHTML = m;
    readout(cell("mode", mode) + cell("embryos/seed", String(nEmb), "#34d399") + cell("genetics", mode === "sexual" ? "segregates" : "clones", "#f59e0b"));
    if(mode === "sexual") verdict("<b>Section 1.5 contrast:</b> sexual seeds use meiosis + fusion, so resown hybrids <b>segregate</b> and lose hybrid characters — costly seed every year. Compare with apomixis (no segregation).");
    else if(mode === "apomixis") verdict("<b>Exercise 18:</b> apomixis = <b>seeds without fertilisation</b> (asexual mimic; diploid egg without reduction), in some Asteraceae and grasses. Apomictic hybrids show <b>no segregation</b> — farmers could <b>reuse seed yearly</b>.");
    else verdict("<b>Section 1.5 activity:</b> nucellar cells divide into the sac giving <b>&gt;1 embryo per seed (polyembryony)</b> — Citrus, mango. Squeeze orange seeds: embryos differ in size, shape; apomictic ones are maternal <b>clones</b>. Parthenocarpy (banana) differs: fruit without fertilisation.");
  }
  return { mount: mount, draw: draw };
})();
