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

window.SIMS.stressstrain = (function(){
  var mode = "metal";
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>OA Hooke</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>B yield</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>D ultimate / E fracture</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-metal">Fig. 8.2 metal</button>' +
      '<button class="preset-btn" id="p-aorta">Fig. 8.3 aorta / elastomer</button>' +
      '<button class="preset-btn" id="p-putty">Putty (plastic)</button>';
    document.getElementById("p-metal").onclick = function(){ setActivePreset(this); mode="metal"; App.resetTimeline(); App.play(); };
    document.getElementById("p-aorta").onclick = function(){ setActivePreset(this); mode="aorta"; App.resetTimeline(); App.play(); };
    document.getElementById("p-putty").onclick = function(){ setActivePreset(this); mode="putty"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function metalPts(){
    return [[0,0],[1.2,1.5],[2.2,2.4],[3.2,2.7],[4.4,3.1],[5.4,3.35],[6.4,3.2],[7.4,2.4]];
  }
  function aortaPts(){
    var p = [];
    for(var i=0;i<=20;i++){
      var e = i/20;
      var sig = 0.15*e + 2.8*e*e*e;
      p.push([e*7.2, sig*1.2]);
    }
    return p;
  }
  function puttyPts(){
    return [[0,0],[0.6,0.35],[2.0,0.45],[4.0,0.5],[7.2,0.55]];
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var pts = mode==="metal" ? metalPts() : (mode==="aorta" ? aortaPts() : puttyPts());
    var frac = Math.min(1, t/8);
    var nShow = Math.max(2, Math.floor(frac*(pts.length-1))+1);
    function X(e){ return 80 + e*80; }
    function Y(s){ return 260 - s*60; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="260" x2="680" y2="260" stroke="#475569"/><line x1="80" y1="260" x2="80" y2="30" stroke="#475569"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">stress vs strain — load ramps with the timeline</text>';
    m += '<text x="640" y="278" fill="#64748b" font-size="11">strain</text>';
    m += '<text x="20" y="40" fill="#64748b" font-size="11">stress</text>';
    var d = "";
    for(var i=0;i<nShow;i++){
      d += (i===0?"M":"L") + " " + X(pts[i][0]) + " " + Y(pts[i][1]);
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="3"/>';
    var last = pts[nShow-1];
    m += '<circle cx="'+X(last[0])+'" cy="'+Y(last[1])+'" r="5" fill="#f8fafc"/>';
    if(mode==="metal"){
      m += '<text x="200" y="170" fill="#34d399" font-size="12">OA Hooke</text>';
      m += '<text x="340" y="90" fill="#f59e0b" font-size="12">B yield</text>';
      m += '<text x="520" y="55" fill="#f87171" font-size="12">D · E fracture</text>';
    }
    svg.innerHTML = m;
    var lab = mode==="metal" ? "metal (Fig. 8.2)" : (mode==="aorta" ? "elastomer (Fig. 8.3)" : "putty / plastic");
    readout(cell("curve", lab) + cell("load fraction", (frac*100).toFixed(0)+"%"));
    if(mode==="metal") verdict("<b>Fig. 8.2:</b> OA linear (Hooke, elastic). B is yield σ<sub>y</sub>. Unload from C → permanent set. D = σ<sub>u</sub>, E = fracture. Close D–E: brittle; far: ductile.");
    else if(mode==="aorta") verdict("<b>Fig. 8.3:</b> huge elastic range, almost no Hookean sliver, no plastic plateau — an <b>elastomer</b> (aorta, rubber).");
    else verdict("<b>§8.1:</b> putty has no restoring tendency. Strain stays when stress returns to zero — ideal plastic.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.stresskinds = (function(){
  var kind = "tensile";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Restoring stress</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Deformation</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="k-t">Fig. 8.1a tension</button>' +
      '<button class="preset-btn" id="k-s">Fig. 8.1b shear</button>' +
      '<button class="preset-btn" id="k-h">Fig. 8.1d hydraulic</button>';
    document.getElementById("k-t").onclick = function(){ setActivePreset(this); kind="tensile"; App.resetTimeline(); App.play(); };
    document.getElementById("k-s").onclick = function(){ setActivePreset(this); kind="shear"; App.resetTimeline(); App.play(); };
    document.getElementById("k-h").onclick = function(){ setActivePreset(this); kind="hyd"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var u = Math.min(1, t/6);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(kind==="tensile"){
      var L = 160 + u*40;
      m += '<rect x="'+(360-L/2)+'" y="110" width="'+L+'" height="70" rx="8" fill="#1e3a5f" stroke="#38bdf8" stroke-width="2"/>';
      m += '<polygon points="'+(360-L/2-30)+',145 '+(360-L/2)+',125 '+(360-L/2)+',165" fill="#f59e0b"/>';
      m += '<polygon points="'+(360+L/2+30)+',145 '+(360+L/2)+',125 '+(360+L/2)+',165" fill="#f59e0b"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">longitudinal strain ΔL/L — tensile stress F/A</text>';
      readout(cell("ΔL/L", (0.05*u).toFixed(3)) + cell("kind","tensile","#38bdf8"));
      verdict("<b>Eqs. 8.1–8.2:</b> two equal opposite forces normal to the faces. Compression is the same modulus with ΔL &lt; 0.");
    } else if(kind==="shear"){
      var dx = u*50;
      m += '<polygon points="'+(250)+',90 '+(450)+',90 '+(450+dx)+',210 '+(250+dx)+',210" fill="#1e3a5f" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">shearing strain Δx/L = tan θ ≈ θ</text>';
      readout(cell("θ (rad)", (0.40*u).toFixed(3)) + cell("kind","shear","#f59e0b"));
      verdict("<b>Eqs. 8.3–8.4:</b> tangential forces. At θ = 10° tan θ and θ differ by ~1%. Shape changes; volume does not.");
    } else {
      var r = 70 - u*8;
      m += '<circle cx="360" cy="155" r="'+r+'" fill="#1e3a5f" stroke="#34d399" stroke-width="3"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">hydraulic stress = p; volume strain ΔV/V; shape unchanged</text>';
      readout(cell("ΔV/V", (-0.02*u).toFixed(3)) + cell("kind","hydraulic","#34d399"));
      verdict("<b>Eq. 8.5:</b> fluid pressure on every face. Restoring stress equals p. This is the only modulus gases possess.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.youngmod = (function(){
  var mat = "steel";
  var Ymap = {steel:2.0e11, copper:1.1e11, aluminium:0.70e11, bone:9.4e9};
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Wire</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Load F</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="m-st">Steel Y=200 GPa</button>' +
      '<button class="preset-btn" id="m-cu">Copper 110</button>' +
      '<button class="preset-btn" id="m-al">Aluminium 70</button>' +
      '<button class="preset-btn" id="m-bo">Bone 9.4 (Ex 8.3)</button>';
    document.getElementById("m-st").onclick = function(){ setActivePreset(this); mat="steel"; App.resetTimeline(); };
    document.getElementById("m-cu").onclick = function(){ setActivePreset(this); mat="copper"; App.resetTimeline(); };
    document.getElementById("m-al").onclick = function(){ setActivePreset(this); mat="aluminium"; App.resetTimeline(); };
    document.getElementById("m-bo").onclick = function(){ setActivePreset(this); mat="bone"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Force F (kN)</span><span class="val" id="ctrl-f">100</span></div>' +
      '<input type="range" id="ctrl-f-range" min="10" max="200" step="5" value="100"></div>' +
      '<div class="control-item"><div class="control-label"><span>Radius r (mm)</span><span class="val" id="ctrl-r">10</span></div>' +
      '<input type="range" id="ctrl-r-range" min="4" max="20" step="1" value="10"></div>';
    document.getElementById("ctrl-f-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-r-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var F = Number(document.getElementById("ctrl-f-range").value)*1000;
    var rmm = Number(document.getElementById("ctrl-r-range").value);
    document.getElementById("ctrl-f").textContent = (F/1000).toFixed(0);
    document.getElementById("ctrl-r").textContent = rmm.toFixed(0);
    var r = rmm/1000, L = 1.0, Y = Ymap[mat];
    var A = Math.PI*r*r;
    var stress = F/A;
    var dL = stress*L/Y;
    var strain = dL/L;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var x0 = 80, y0 = 150, pix = 400 + dL*20000;
    m += '<rect x="'+x0+'" y="'+(y0-18)+'" width="'+pix+'" height="36" rx="6" fill="#1e3a5f" stroke="#38bdf8" stroke-width="2"/>';
    m += '<rect x="'+(x0+pix)+'" y="'+(y0-28)+'" width="18" height="56" fill="#f59e0b"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Y = (F/A)/(ΔL/L) — L = 1.0 m as in Example 8.1</text>';
    svg.innerHTML = m;
    readout(cell("Y", (Y/1e9).toFixed(1)+" GPa") + cell("stress", (stress/1e6).toFixed(0)+" MPa", "#f59e0b") + cell("ΔL", (dL*1000).toFixed(2)+" mm", "#34d399") + cell("strain", (strain*100).toFixed(3)+"%"));
    verdict("<b>Eq. 8.8:</b> "+mat+" wire. Example 8.1 steel r = 10 mm, F = 100 kN → 3.18×10⁸ Pa, ΔL = 1.59 mm. Same F on bone would crush far more — Y_bone is 20× smaller.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.shearslab = (function(){
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Lead slab</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Shear F</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ex">Example 8.4 lead</button>';
    document.getElementById("p-ex").onclick = function(){ setActivePreset(this); App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>F (×10⁴ N)</span><span class="val" id="ctrl-f">9.0</span></div>' +
      '<input type="range" id="ctrl-f-range" min="1" max="20" step="0.5" value="9"></div>';
    document.getElementById("ctrl-f-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var F = Number(document.getElementById("ctrl-f-range").value)*1e4;
    document.getElementById("ctrl-f").textContent = (F/1e4).toFixed(1);
    var A = 0.05, L = 0.5, G = 5.6e9;
    var stress = F/A;
    var dx = stress*L/G;
    var u = Math.min(1, t/5);
    var show = dx * u;
    var skew = show * 80000;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<polygon points="220,80 520,80 '+(520+skew)+',220 '+(220+skew)+',220" fill="#334155" stroke="#38bdf8" stroke-width="2"/>';
    m += '<line x1="220" y1="220" x2="520" y2="220" stroke="#f59e0b" stroke-width="4"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Example 8.4: 50 cm × 10 cm lead face, G = 5.6 GPa</text>';
    svg.innerHTML = m;
    readout(cell("stress", (stress/1e6).toFixed(2)+" MPa") + cell("Δx", (show*1000).toFixed(3)+" mm", "#34d399"));
    verdict("<b>Example 8.4:</b> F = 9.0×10⁴ N → stress = 1.80×10⁶ Pa → Δx = 0.16 mm. Timeline ramps the shear from 0 to full load.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.bulkmod = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Water column</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Depth</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-io">Indian Ocean 3000 m</button>' +
      '<button class="preset-btn" id="p-trench">Mariana-class 10 km</button>';
    var depth = 3000;
    document.getElementById("p-io").onclick = function(){ setActivePreset(this); depth=3000; App.resetTimeline(); App.play(); };
    document.getElementById("p-trench").onclick = function(){ setActivePreset(this); depth=10000; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    window.SIMS.bulkmod._d = function(){ return depth; };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var H = (window.SIMS.bulkmod._d && window.SIMS.bulkmod._d()) || 3000;
    var h = H * Math.min(1, t/6);
    var p = h * 1000 * 10;
    var B = 2.2e9;
    var frac = p/B;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="200" y="40" width="160" height="220" fill="#0c4a6e"/>';
    var y = 40 + (1 - h/Math.max(H,1))*220;
    m += '<circle cx="280" cy="'+y+'" r="8" fill="#f8fafc"/>';
    m += '<text x="480" y="80" fill="#94a3b8" font-size="14">g = 10 m s⁻² (Example 8.5)</text>';
    m += '<text x="480" y="110" fill="#94a3b8" font-size="14">B_water = 2.2 × 10⁹ Pa</text>';
    svg.innerHTML = m;
    readout(cell("h", h.toFixed(0)+" m") + cell("p", (p/1e6).toFixed(2)+" MPa") + cell("ΔV/V", (frac*100).toFixed(2)+"%", "#34d399"));
    verdict("<b>Example 8.5:</b> at 3000 m, p = 3.0×10⁷ Pa and ΔV/V = 1.36%. Water is ‘incompressible’ only compared with air, not compared with zero.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.ibeam = (function(){
  var shape = "I";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Beam</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Load W</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="s-rect">Fig. 8.7a rectangle</button>' +
      '<button class="preset-btn" id="s-thin">Fig. 8.7b thin (buckles)</button>' +
      '<button class="preset-btn active" id="s-I">Fig. 8.7c I-section</button>';
    document.getElementById("s-rect").onclick = function(){ setActivePreset(this); shape="rect"; App.resetTimeline(); App.play(); };
    document.getElementById("s-thin").onclick = function(){ setActivePreset(this); shape="thin"; App.resetTimeline(); App.play(); };
    document.getElementById("s-I").onclick = function(){ setActivePreset(this); shape="I"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var u = Math.min(1, t/6);
    var sag = (shape==="thin"? 48 : shape==="rect"? 22 : 10) * u;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<circle cx="140" cy="200" r="10" fill="#64748b"/><circle cx="580" cy="200" r="10" fill="#64748b"/>';
    var ymid = 120 + sag;
    m += '<path d="M140 120 Q 360 '+ymid+' 580 120" fill="none" stroke="#38bdf8" stroke-width="8"/>';
    if(shape==="I"){
      m += '<rect x="330" y="'+(ymid-30)+'" width="60" height="10" fill="#94a3b8"/>';
      m += '<rect x="352" y="'+(ymid-30)+'" width="16" height="50" fill="#94a3b8"/>';
      m += '<rect x="330" y="'+(ymid+10)+'" width="60" height="10" fill="#94a3b8"/>';
    } else if(shape==="thin"){
      m += '<rect x="356" y="'+(ymid-40)+'" width="8" height="70" fill="#f87171"/>';
    } else {
      m += '<rect x="340" y="'+(ymid-20)+'" width="40" height="40" fill="#64748b"/>';
    }
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">δ = Wℓ³/(4 b d³ Y) — deepen, then I-section to stop buckling</text>';
    svg.innerHTML = m;
    readout(cell("section", shape) + cell("relative sag", sag.toFixed(0)+" px (schematic)"));
    verdict("<b>Eq. 8.16 / Fig. 8.7:</b> a thin deep bar sags less until it buckles sideways. The I puts mass in the flanges — Indian railway girders and Howrah’s cantilevers use exactly this.");
  }
  return { mount: mount, draw: draw };
})();

// Browser QA identifies each scenario by data-preset. Keep these identifiers
// local to the chapter so every visible preset has a stable fixture key.
Object.keys(window.SIMS).forEach(function(key){
  var sim = window.SIMS[key];
  if(!sim || sim.mount._qaWrapped) return;
  var originalMount = sim.mount;
  sim.mount = function(lesson){
    var result = originalMount(lesson);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn){
      if(!btn.dataset.preset) btn.dataset.preset = btn.id;
    });
    return result;
  };
  sim.mount._qaWrapped = true;
});
// The shared browser fixture names the revealed prediction states explicitly.
// Add those semantic aliases after the existing chapter runtime evaluates a choice.
document.addEventListener("click", function(event){
  if(!event.target.closest("#btn-check-prediction")) return;
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  var chosen = document.querySelector('input[name="predict_ans"]:checked');
  if(!lesson || !chosen) return;
  document.querySelectorAll("#predict-options .predict-option").forEach(function(option, index){
    option.classList.toggle("is-answer", index === lesson.prediction.answer);
    option.classList.toggle("is-wrong", index === Number(chosen.value) && index !== lesson.prediction.answer);
  });
});

// Keep this chapter's presentation aligned with its data while the shared
// Class 11 runtime remains backward-compatible with older array connect cards.
function normalizeConceptPresentation(){
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  if(!lesson) return;
  var watch = document.getElementById("what-to-watch");
  var watchText = "What to watch: " + lesson.watch;
  if(watch && lesson.watch && watch.textContent !== watchText) watch.textContent = watchText;
  document.querySelectorAll(".connect-grid").forEach(function(grid){
    var cards = Array.from(grid.querySelectorAll(":scope > .connect-card"));
    var explicitWow = cards.find(function(card){
      var heading = card.querySelector("h3");
      return heading && /^Wow/i.test(heading.textContent.trim());
    });
    if(!explicitWow) return;
    cards.forEach(function(card){
      if(card === explicitWow) return;
      card.classList.remove("wow");
      card.removeAttribute("data-wow");
      card.removeAttribute("data-source");
      var badge = card.querySelector(":scope > .wow-badge");
      if(badge) badge.remove();
    });
  });
}
var conceptView = document.getElementById("concept-view");
if(conceptView){
  new MutationObserver(normalizeConceptPresentation).observe(conceptView, {childList: true, subtree: true});
  normalizeConceptPresentation();
}
