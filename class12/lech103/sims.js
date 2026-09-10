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
function numEl(id, fb){ var n = document.getElementById(id); return n ? Number(n.value) : fb; }

window.SIMS.avgrate = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>[R](t)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>chord Δ[R]/Δt</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>tangent</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-1">Intext 3.1: 0.03 → 0.02 M / 25 min</button>' +
      '<button class="preset-btn" id="p-2">Intext 3.2: 2A → products</button>';
    document.getElementById("p-1").onclick = function(){ setActivePreset(this); kind=1; draw(App.state.t); };
    document.getElementById("p-2").onclick = function(){ setActivePreset(this); kind=2; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  var kind = 1;
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    function X(min){ return 80 + min/30*520; }
    function Y(c){ return 250 - c/0.06*180; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="250" x2="640" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="40" stroke="#475569"/>';
    var d="";
    for(var u=0;u<=30;u+=0.5){
      var c = kind===1 ? 0.03*Math.exp(-u*0.0162) : 0.5 - 0.01*u;
      if(kind===2) c = Math.max(0.2, 0.5 - 0.01*u);
      d += (u===0?"M":"L")+" "+X(u)+" "+Y(c);
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    if(kind===1){
      m += '<line x1="'+X(0)+'" y1="'+Y(0.03)+'" x2="'+X(25)+'" y2="'+Y(0.02)+'" stroke="#f59e0b" stroke-width="3"/>';
    } else {
      m += '<line x1="'+X(0)+'" y1="'+Y(0.5)+'" x2="'+X(10)+'" y2="'+Y(0.4)+'" stroke="#f59e0b" stroke-width="3"/>';
    }
    svg.innerHTML = m;
    if(kind===1){
      readout(cell("Δ[R]","0.01 M") + cell("Δt","25 min") + cell("r_av","6.67×10⁻⁶ M s⁻¹", "#f59e0b"));
      verdict("<b>Intext 3.1:</b> (0.03−0.02)/25 = 4.0×10⁻⁴ M min⁻¹ = <b>6.67×10⁻⁶ M s⁻¹</b> (book 6.66×10⁻⁶). The orange chord is the average; the blue curve’s tangent is instantaneous.");
    } else {
      readout(cell("−Δ[A]/Δt","0.010 M min⁻¹") + cell("rate of reaction","0.005 M min⁻¹", "#34d399"));
      verdict("<b>Intext 3.2:</b> 2A → products, [A] 0.5→0.4 M in 10 min. Rate of reaction = ½(−Δ[A]/Δt) = <b>0.005 mol L⁻¹ min⁻¹</b>.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.ratelaw = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>rate vs [A]</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p0">order 0</button>' +
      '<button class="preset-btn" id="p1">order 1</button>' +
      '<button class="preset-btn" id="p2">order 2</button>' +
      '<button class="preset-btn" id="p25">Intext 3.3 order 2.5</button>';
    ["0","1","2","25"].forEach(function(k){
      document.getElementById("p"+k).onclick = function(){ setActivePreset(this); order = k==="25"?2.5:Number(k); draw(); };
    });
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>[A] / mol L⁻¹</span><span class="val" id="ctrl-a">0.20</span></div>' +
      '<input type="range" id="ctrl-a-range" min="0.05" max="1" step="0.01" value="0.20"></div>';
    document.getElementById("ctrl-a-range").oninput = function(){ draw(); };
    draw();
  }
  var order = 0;
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var A = numEl("ctrl-a-range", 0.20);
    var el = document.getElementById("ctrl-a"); if(el) el.textContent = A.toFixed(2);
    var k = 0.05;
    var rate = k * Math.pow(A, order);
    function X(a){ return 80 + a*520; }
    function Y(r){ return 250 - r*800; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="250" x2="640" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="40" stroke="#475569"/>';
    var d="";
    for(var a=0;a<=1.001;a+=0.02){
      d += (a===0?"M":"L")+" "+X(a)+" "+Y(k*Math.pow(a,order));
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="'+X(A)+'" cy="'+Y(rate)+'" r="6" fill="#f8fafc"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Rate = k [A]^n &nbsp; n = '+order+'</text>';
    svg.innerHTML = m;
    readout(cell("n", String(order)) + cell("[A]", A.toFixed(2)+" M") + cell("rate", rate.toExponential(2), "#38bdf8"));
    verdict(order===2.5
      ? "<b>Intext 3.3:</b> r = k[A]¹/²[B]² has overall order 2.5. Fractional order is legal; molecularity 2.5 is not."
      : "<b>Rate vs concentration:</b> order 0 is a flat line; order 1 is linear; order 2 is a parabola. Never copy stoichiometric coefficients into the rate law without data.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.zeroorder = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>[R] = [R]₀ − k t</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-nh">Ex 3.3 NH₃ on Pt</button>';
    document.getElementById("p-nh").onclick = function(){ setActivePreset(this); draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>[R]₀ / M</span><span class="val" id="ctrl-r">0.10</span></div>' +
      '<input type="range" id="ctrl-r-range" min="0.04" max="0.20" step="0.01" value="0.10"></div>';
    document.getElementById("ctrl-r-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var R0 = numEl("ctrl-r-range", 0.10);
    var el = document.getElementById("ctrl-r"); if(el) el.textContent = R0.toFixed(2);
    var k = 2.5e-4;
    var tmax = R0/k;
    var R = Math.max(0, R0 - k*(t/6)*tmax);
    var t12 = R0/(2*k);
    function X(tt){ return 80 + (tt/tmax)*520; }
    function Y(c){ return 250 - c/0.22*180; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="250" x2="640" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="40" stroke="#475569"/>';
    m += '<line x1="'+X(0)+'" y1="'+Y(R0)+'" x2="'+X(tmax)+'" y2="'+Y(0)+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<circle cx="'+X((t/6)*tmax)+'" cy="'+Y(R)+'" r="6" fill="#f8fafc"/>';
    svg.innerHTML = m;
    readout(cell("k","2.5×10⁻⁴ M s⁻¹") + cell("[R]", R.toFixed(4)+" M") + cell("t₁/₂", t12.toFixed(0)+" s", "#34d399") + cell("d[H₂]/dt","7.5×10⁻⁴ M s⁻¹"));
    verdict("<b>Exercise 3.3 / Table 3.4:</b> zero-order [R] = [R]₀ − k t; t₁/₂ = [R]₀/2k is proportional to starting concentration. d[N₂]/dt = k; d[H₂]/dt = 3k.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.halflife = (function(){
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>[A] = [A]₀ e^{−kt}</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-c">¹⁴C dating Ex 3.14</button>' +
      '<button class="preset-btn" id="p-5">Intext 3.5: 5 g → 3 g</button>' +
      '<button class="preset-btn" id="p-16">Ex 3.16: to 1/16</button>';
    document.getElementById("p-c").onclick = function(){ setActivePreset(this); kind="c"; App.resetTimeline(); App.play(); };
    document.getElementById("p-5").onclick = function(){ setActivePreset(this); kind="g"; App.resetTimeline(); App.play(); };
    document.getElementById("p-16").onclick = function(){ setActivePreset(this); kind="s"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  var kind = "c";
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var k, t12, A0=1, label;
    if(kind==="c"){ t12=5730; k=0.693/t12; label="years"; }
    else if(kind==="g"){ k=1.15e-3; t12=0.693/k; label="s"; }
    else { k=60; t12=0.693/k; label="s"; }
    var tmax = kind==="s" ? 4*t12 : (kind==="g"?800:8000);
    var tt = (t/8)*tmax;
    var A = A0 * Math.exp(-k*tt);
    function X(u){ return 80 + (u/tmax)*520; }
    function Y(a){ return 250 - a*180; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="250" x2="640" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="40" stroke="#475569"/>';
    var d="";
    for(var u=0;u<=tmax;u+=tmax/80){ d += (u===0?"M":"L")+" "+X(u)+" "+Y(Math.exp(-k*u)); }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    for(var n=1;n<=4;n++){
      var th = n*t12; if(th<tmax) m += '<line x1="'+X(th)+'" y1="'+Y(Math.pow(0.5,n))+'" x2="'+X(th)+'" y2="250" stroke="#334155"/>';
    }
    m += '<circle cx="'+X(tt)+'" cy="'+Y(A)+'" r="6" fill="#f8fafc"/>';
    svg.innerHTML = m;
    readout(cell("k", k.toExponential(3)+" "+label+"⁻¹") + cell("t₁/₂", t12.toFixed(kind==="s"?4:1)+" "+label, "#34d399") + cell("[A]/[A]₀", A.toFixed(3)));
    if(kind==="c") verdict("<b>Exercise 3.14:</b> t₁/₂(¹⁴C) = 5730 y. 80% remaining ⇒ t = (2.303/k) log(1.25) = <b>1845 years</b>. Half-life does not care what [A]₀ was.");
    else if(kind==="g") verdict("<b>Intext 3.5:</b> k = 1.15×10⁻³ s⁻¹; 5 g → 3 g takes (2.303/k) log(5/3) = <b>444 s</b>. t₁/₂ itself is 603 s.");
    else verdict("<b>Exercise 3.16:</b> 1/16 = 4 half-lives. t₁/₂ = 0.693/60 = 0.01155 s; t = <b>0.0462 s</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.pseudo = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>sucrose</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>water (excess)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-s">Ex 3.25 t₁/₂ = 3 h</button>' +
      '<button class="preset-btn" id="p-8">Ex 3.8 30–60 s average</button>';
    document.getElementById("p-s").onclick = function(){ setActivePreset(this); kind="s"; draw(App.state.t); };
    document.getElementById("p-8").onclick = function(){ setActivePreset(this); kind="e"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  var kind = "s";
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(kind==="s"){
      var t12=3, tt=(t/6)*12;
      var frac = Math.pow(2, -tt/t12);
      m += '<text x="360" y="60" fill="#e2e8f0" font-size="16" text-anchor="middle">C₁₂H₂₂O₁₁ + H₂O → glucose + fructose</text>';
      m += '<text x="360" y="100" fill="#94a3b8" font-size="13" text-anchor="middle">Rate = k [sugar] because [H₂O] ≈ 55.5 M</text>';
      m += '<rect x="80" y="160" width="'+Math.max(10,frac*560)+'" height="40" fill="#f59e0b"/>';
      m += '<text x="360" y="230" fill="#34d399" font-size="14" text-anchor="middle">fraction left at t = '+tt.toFixed(1)+' h : '+frac.toFixed(3)+'</text>';
      readout(cell("t", tt.toFixed(1)+" h") + cell("t₁/₂","3.00 h") + cell("remaining", frac.toFixed(3), "#f59e0b"));
      verdict("<b>Exercise 3.25:</b> after 8 h, remaining = 2^{−8/3} = <b>0.157</b>. Pseudo-first order: water is a silent partner.");
    } else {
      m += '<text x="360" y="80" fill="#e2e8f0" font-size="14" text-anchor="middle">[A]: 0.55 → 0.31 → 0.17 → 0.085 M at 0, 30, 60, 90 s</text>';
      m += '<text x="360" y="140" fill="#f59e0b" font-size="18" text-anchor="middle">r_av (30–60 s) = 0.14 / 30 = 4.67×10⁻³ M s⁻¹</text>';
      readout(cell("Δ[A]","0.14 M") + cell("Δt","30 s") + cell("r_av","4.67×10⁻³ M s⁻¹"));
      verdict("<b>Exercise 3.8:</b> average rate between 30 and 60 s is (0.31−0.17)/30 = 4.67×10⁻³ mol L⁻¹ s⁻¹.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.arrhenius = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>ln k vs 1/T</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-30">Ex 3.30: rate ×4, 293→313 K</button>' +
      '<button class="preset-btn" id="p-26">Ex 3.26: Ea from 28000 K</button>';
    document.getElementById("p-30").onclick = function(){ setActivePreset(this); kind="30"; draw(); };
    document.getElementById("p-26").onclick = function(){ setActivePreset(this); kind="26"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>T₂ / K</span><span class="val" id="ctrl-t">313</span></div>' +
      '<input type="range" id="ctrl-t-range" min="300" max="350" step="1" value="313"></div>';
    document.getElementById("ctrl-t-range").oninput = function(){ draw(); };
    draw();
  }
  var kind = "30";
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var T2 = numEl("ctrl-t-range", 313);
    var el = document.getElementById("ctrl-t"); if(el) el.textContent = T2.toFixed(0);
    var Ea = kind==="26" ? 28000*8.314 : Math.log(4)*8.314*293*313/20;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    function X(inv){ return 80 + (inv-0.0028)/0.0008*520; }
    function Y(lnk){ return 200 - lnk*8; }
    var d="";
    for(var T=270;T<=360;T+=2){
      var lnk = 20 - Ea/(8.314*T);
      d += (T===270?"M":"L")+" "+X(1/T)+" "+Y(lnk);
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="'+X(1/T2)+'" cy="'+Y(20-Ea/(8.314*T2))+'" r="6" fill="#f8fafc"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">ln k = ln A − (E_a/R)(1/T)</text>';
    svg.innerHTML = m;
    readout(cell("E_a", (Ea/1000).toFixed(2)+" kJ mol⁻¹", "#f59e0b") + cell("T₂", T2+" K") + cell("slope", "−Ea/R"));
    verdict(kind==="26"
      ? "<b>Exercise 3.26:</b> k = (4.5×10¹¹ s⁻¹) e^{−28000 K/T} ⇒ E_a = 28000 × 8.314 = <b>232.8 kJ mol⁻¹</b>."
      : "<b>Exercise 3.30:</b> k₂/k₁ = 4 from 293 to 313 K ⇒ E_a = <b>52.9 kJ mol⁻¹</b>. A 10 °C rise near room temperature often ~doubles the rate.");
  }
  return { mount: mount, draw: draw };
})();
