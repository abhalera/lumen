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

window.SIMS.siunits = (function(){
  var mode = "c";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Light pulse</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>1 metre of path</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-c">Metre from c</button>' +
      '<button class="preset-btn" id="p-cs">Second from Cs-133</button>' +
      '<button class="preset-btn" id="p-h">Kilogram from h</button>';
    document.getElementById("p-c").onclick = function(){ setActivePreset(this); mode="c"; App.resetTimeline(); App.play(); };
    document.getElementById("p-cs").onclick = function(){ setActivePreset(this); mode="cs"; App.resetTimeline(); App.play(); };
    document.getElementById("p-h").onclick = function(){ setActivePreset(this); mode="h"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "c"){
      var x = 80 + (t/4)*560;
      m += '<line x1="80" y1="180" x2="640" y2="180" stroke="#334155" stroke-width="4"/>';
      m += '<rect x="80" y="168" width="12" height="24" fill="#f59e0b"/>';
      m += '<text x="86" y="160" fill="#f59e0b" font-size="11">0</text>';
      m += '<text x="600" y="160" fill="#f59e0b" font-size="11">1 m</text>';
      m += '<circle cx="'+x+'" cy="180" r="7" fill="#38bdf8"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">c = 299 792 458 m s⁻¹ exactly — Table 1.1</text>';
      readout(cell("c","299792458 m/s") + cell("t", (t*1e-9*299792458/4 > 0 ? (1/299792458*t/4).toExponential(3) : "0")+" s") + cell("path",(t/4).toFixed(2)+" m"));
      verdict("<b>Metre (2018):</b> the distance light travels in vacuum in 1/299 792 458 of a second. The artefact bar is gone.");
    } else if(mode === "cs"){
      var n = Math.floor((t/4)*20);
      for(var i=0;i<20;i++){
        var on = i <= n;
        m += '<rect x="'+(60+i*30)+'" y="120" width="22" height="60" fill="'+(on?"#38bdf8":"#1e293b")+'" stroke="#334155"/>';
      }
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Δν<sub>Cs</sub> = 9 192 631 770 Hz exactly</text>';
      readout(cell("ticks shown", String(n+1)+"/20") + cell("true ticks in 1 s","9192631770") + cell("unit","second"));
      verdict("<b>Second:</b> 9 192 631 770 periods of the Cs-133 ground-state hyperfine transition (zoom p.2).");
    } else {
      m += '<text x="360" y="50" fill="#94a3b8" font-size="14" text-anchor="middle">h = 6.62607015×10⁻³⁴ J s (exact) defines the kilogram</text>';
      m += '<rect x="200" y="110" width="320" height="80" rx="8" fill="#1e293b" stroke="#f59e0b"/>';
      m += '<text x="360" y="145" fill="#f8fafc" font-size="16" text-anchor="middle">J s = kg m² s⁻¹</text>';
      m += '<text x="360" y="175" fill="#94a3b8" font-size="13" text-anchor="middle">m and s already fixed by c and Δν_Cs</text>';
      readout(cell("h","6.62607015e-34 J s") + cell("Kibble / h","defines kg") + cell("artefact IPK","retired 2019"));
      verdict("<b>Kilogram (2018):</b> no more prototype cylinder. Fix h, with metre and second already defined.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.sigfig = (function(){
  var idx = 0;
  var samples = [
    {s:"4.700 m", n:4, note:"trailing zeros after a decimal count"},
    {s:"0.004700 km", n:4, note:"leading zeros drop; trailing zeros after decimal stay"},
    {s:"4700 mm", n:2, note:"no decimal: trailing zeros not significant — this is the trap"},
    {s:"4.700×10³ mm", n:4, note:"scientific notation: all digits of a count"},
    {s:"0.007 m²", n:1, note:"Ex 1.10a — only the 7"},
    {s:"0.2370 g cm⁻³", n:4, note:"Ex 1.10c"}
  ];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Significant</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Not significant</span></div>';
    document.getElementById("preset-bar").innerHTML = samples.map(function(x,i){
      return '<button class="preset-btn'+(i===0?' active':'')+'" id="sf'+i+'">'+x.s+'</button>';
    }).join("");
    samples.forEach(function(_,i){
      document.getElementById("sf"+i).onclick = function(){ setActivePreset(this); idx=i; App.resetTimeline(); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var x = samples[idx];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="80" fill="#f8fafc" font-size="28" text-anchor="middle">'+x.s+'</text>';
    m += '<text x="360" y="140" fill="#38bdf8" font-size="22" text-anchor="middle">'+x.n+' significant figure'+(x.n===1?'':'s')+'</text>';
    m += '<text x="360" y="200" fill="#94a3b8" font-size="14" text-anchor="middle">'+x.note+'</text>';
    svg.innerHTML = m;
    readout(cell("writing", x.s) + cell("figures", String(x.n), "#34d399"));
    verdict("<b>§1.3:</b> a change of units cannot change the number of significant figures — unless a sloppy writing (4700 mm) hides the measured zeros. Use a×10<sup>b</sup>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.rounding = (function(){
  var mode = "area";
  var a = 7.203;
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cube side 7.203 m</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="r-a">Example 1.1 area</button>' +
      '<button class="preset-btn" id="r-v">Example 1.1 volume</button>' +
      '<button class="preset-btn" id="r-d">Example 1.2 density</button>';
    document.getElementById("r-a").onclick = function(){ setActivePreset(this); mode="area"; App.resetTimeline(); };
    document.getElementById("r-v").onclick = function(){ setActivePreset(this); mode="vol"; App.resetTimeline(); };
    document.getElementById("r-d").onclick = function(){ setActivePreset(this); mode="den"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var side = 80 + Math.min(App.state.t/4,1)*80;
    m += '<rect x="80" y="80" width="'+side+'" height="'+side+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    if(mode==="area"){
      var raw = 6*a*a, shown = 311.3;
      m += '<text x="400" y="120" fill="#94a3b8" font-size="14">6 a² = '+raw.toFixed(6)+'</text>';
      m += '<text x="400" y="160" fill="#34d399" font-size="18">→ 311.3 m² (4 figures)</text>';
      readout(cell("a","7.203 m") + cell("raw 6a²", raw.toFixed(6)) + cell("quoted","311.3 m²","#34d399"));
      verdict("<b>Example 1.1 (zoom p.6):</b> four figures in the side ⇒ four in the area. 311.299254 rounds to <b>311.3 m²</b>.");
    } else if(mode==="vol"){
      var raw = a*a*a;
      m += '<text x="400" y="120" fill="#94a3b8" font-size="14">a³ = '+raw.toFixed(6)+'</text>';
      m += '<text x="400" y="160" fill="#34d399" font-size="18">→ 373.7 m³ (4 figures)</text>';
      readout(cell("a","7.203 m") + cell("raw a³", raw.toFixed(6)) + cell("quoted","373.7 m³","#34d399"));
      verdict("<b>Example 1.1:</b> 373.714754 → <b>373.7 m³</b>.");
    } else {
      m += '<text x="400" y="120" fill="#94a3b8" font-size="14">5.74 / 1.2 = 4.7833…</text>';
      m += '<text x="400" y="160" fill="#34d399" font-size="18">→ 4.8 g cm⁻³ (2 figures)</text>';
      readout(cell("mass","5.74 g (3)") + cell("volume","1.2 cm³ (2)") + cell("density","4.8 g cm⁻³","#34d399"));
      verdict("<b>Example 1.2 (zoom p.6):</b> product/quotient keeps the fewest figures. 1.2 has two ⇒ <b>4.8 g cm⁻³</b>.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.uncert = (function(){
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sheet 16.2 × 10.1 cm</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>±0.1 cm least count</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="u1">§1.3.3 rectangle</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var l=16.2, b=10.1, dl=0.1, db=0.1;
    var area=l*b, rel=(dl/l + db/b)*100, dA=area*rel/100;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="80" y="70" width="400" height="160" fill="#38bdf822" stroke="#38bdf8" stroke-width="2"/>';
    m += '<rect x="78" y="68" width="404" height="164" fill="none" stroke="#f59e0b" stroke-dasharray="6 4"/>';
    m += '<text x="280" y="155" fill="#f8fafc" font-size="16" text-anchor="middle">16.2 cm × 10.1 cm</text>';
    svg.innerHTML = m;
    readout(cell("lb", area.toFixed(2)+" cm²") + cell("rel. error", rel.toFixed(1)+"%") + cell("quote","164 ± 3 cm²","#34d399"));
    verdict("<b>§1.3.3:</b> 0.6% + 1.0% = 1.6% of 163.62 is 2.6 cm². Quote <b>164 ± 3 cm²</b> (zoom p.6).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.dimformula = (function(){
  var q = "F";
  var data = {
    F: {name:"Force", html:"[M L T⁻²]", bits:[[1,"M"],[1,"L"],[-2,"T"]]},
    v: {name:"Speed", html:"[M⁰ L T⁻¹]", bits:[[0,"M"],[1,"L"],[-1,"T"]]},
    rho:{name:"Density", html:"[M L⁻³ T⁰]", bits:[[1,"M"],[-3,"L"],[0,"T"]]},
    V: {name:"Volume", html:"[M⁰ L³ T⁰]", bits:[[0,"M"],[3,"L"],[0,"T"]]}
  };
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>[M]</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>[L]</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>[T]</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="dF">Force</button>' +
      '<button class="preset-btn" id="dv">Speed</button>' +
      '<button class="preset-btn" id="dr">Density</button>' +
      '<button class="preset-btn" id="dV">Volume</button>';
    [["dF","F"],["dv","v"],["dr","rho"],["dV","V"]].forEach(function(p){
      document.getElementById(p[0]).onclick = function(){ setActivePreset(this); q=p[1]; App.resetTimeline(); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var d = data[q];
    var cols = ["#38bdf8","#f59e0b","#34d399"];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">'+d.name+'  →  '+d.html+'</text>';
    d.bits.forEach(function(b,i){
      var h = Math.abs(b[0])*40 + 20;
      var x = 160 + i*160;
      m += '<rect x="'+x+'" y="'+(220-h)+'" width="80" height="'+h+'" fill="'+cols[i]+'99"/>';
      m += '<text x="'+(x+40)+'" y="250" fill="#f8fafc" font-size="16" text-anchor="middle">'+b[1]+'^{'+b[0]+'}</text>';
    });
    svg.innerHTML = m;
    readout(cell("quantity", d.name) + cell("formula", d.html, "#34d399"));
    verdict("<b>§1.5:</b> dimensional formula lists the exponents of the bases. Magnitudes never enter.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.homog = (function(){
  var pick = "b";
  var opts = {
    a:{k:"(a) m² v³", dim:"[M² L³ T⁻³]", ok:false},
    b:{k:"(b) ½ m v²", dim:"[M L² T⁻²]", ok:true},
    c:{k:"(c) m a", dim:"[M L T⁻²]", ok:false},
    d:{k:"(d) (3/16) m v²", dim:"[M L² T⁻²]", ok:true},
    e:{k:"(e) ½mv² + ma", dim:"mixed — illegal add", ok:false}
  };
  function mount(){
    App.state.maxT = 2;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 2;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Survives [K]=[M L² T⁻²]</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Ruled out</span></div>';
    document.getElementById("preset-bar").innerHTML =
      "abcde".split("").map(function(ch){
        return '<button class="preset-btn'+(ch==="b"?" active":"")+'" id="h'+ch+'">'+opts[ch].k+'</button>';
      }).join("");
    "abcde".split("").forEach(function(ch){
      document.getElementById("h"+ch).onclick = function(){ setActivePreset(this); pick=ch; App.resetTimeline(); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var o = opts[pick];
    var col = o.ok ? "#34d399" : "#f87171";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="90" fill="#f8fafc" font-size="22" text-anchor="middle">'+o.k+'</text>';
    m += '<text x="360" y="140" fill="'+col+'" font-size="20" text-anchor="middle">'+o.dim+'</text>';
    m += '<text x="360" y="200" fill="'+col+'" font-size="16" text-anchor="middle">'+(o.ok?"possible — dimensions match K":"ruled out")+'</text>';
    svg.innerHTML = m;
    readout(cell("candidate", o.k) + cell("RHS dim", o.dim, col) + cell("[K]","[M L² T⁻²]"));
    verdict("<b>Example 1.4 (zoom p.9):</b> (b) and (d) both survive. Dimensions cannot see ½ versus 3/16. Physics (Ch. 5) picks (b).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.pendulum = (function(){
  var L = 1.0;
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Bob</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Length l</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p1">l = 1.0 m</button>' +
      '<button class="preset-btn" id="p4">l = 4.0 m (T doubles)</button>';
    document.getElementById("p1").onclick = function(){ setActivePreset(this); L=1; App.resetTimeline(); App.play(); };
    document.getElementById("p4").onclick = function(){ setActivePreset(this); L=4; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var g=9.8, T=2*Math.PI*Math.sqrt(L/g);
    var th = 0.35*Math.cos(2*Math.PI*t/T);
    var x0=360, y0=40, len=40+L*40;
    var xb=x0+len*Math.sin(th), yb=y0+len*Math.cos(th);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="'+x0+'" y1="'+y0+'" x2="'+xb+'" y2="'+yb+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<circle cx="'+xb+'" cy="'+yb+'" r="14" fill="#38bdf8"/>';
    m += '<text x="80" y="40" fill="#94a3b8" font-size="13">T = 2π √(l/g)</text>';
    svg.innerHTML = m;
    readout(cell("l", L.toFixed(1)+" m") + cell("g","9.8 m/s²") + cell("T", T.toFixed(2)+" s","#34d399") + cell("k from dims","unknown"));
    verdict("<b>Example 1.5:</b> dimensions force T = k √(l/g) and z=0 (no mass). Mechanics, not dimensions, supplies k = 2π. T(4 m)/T(1 m) = 2.");
  }
  return { mount: mount, draw: draw };
})();

// Browser QA identifies each scenario by data-preset. Keep these identifiers
// local to the chapter so every visible preset has a stable fixture key.
Object.keys(window.SIMS).forEach(function(key){
  var sim = window.SIMS[key];
  if(!sim || typeof sim.mount !== "function") return;
  var originalMount = sim.mount;
  sim.mount = function(lesson){
    originalMount.call(sim, lesson);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn, index){
      if(!btn.dataset.preset) btn.dataset.preset = btn.id || (key + "-" + index);
    });
  };
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
