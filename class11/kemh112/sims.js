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
function axes(m, x0, y0, x1, y1){
  return m + '<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y0+'" stroke="#475569"/>' +
    '<line x1="'+x0+'" y1="'+y0+'" x2="'+x0+'" y2="'+y1+'" stroke="#475569"/>';
}

/* 12.2 — falling body s = 4.9 t²: chord → tangent as h → 0 */
window.SIMS.secant = (function(){
  var side = "left";
  function s(t){ return 4.9 * t * t; }
  function mount(){
    App.state.maxT = 4;
    var sc = document.getElementById("time-scrubber"); if(sc) sc.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>s = 4.9 t²</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Secant (average velocity)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Tangent v = 9.8 t</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-left" id="p-left">Table 12.2: intervals ending at t = 2</button>' +
      '<button class="preset-btn" data-preset="p-right" id="p-right">Table 12.3: intervals starting at t = 2</button>';
    document.getElementById("p-left").onclick = function(){ setActivePreset(this); side="left"; draw(App.state.t); };
    document.getElementById("p-right").onclick = function(){ setActivePreset(this); side="right"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Gap |h| (seconds)</span><span class="val" id="ctrl-h">0.50</span></div>' +
      '<input type="range" id="ctrl-h-range" min="0.01" max="2" step="0.01" value="0.5"></div>';
    document.getElementById("ctrl-h-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var h = Number(document.getElementById("ctrl-h-range").value);
    document.getElementById("ctrl-h").textContent = h.toFixed(2);
    var t0 = 2, t1 = side === "left" ? Math.max(0, t0 - h) : t0 + h;
    var chord = (s(t1) - s(t0)) / (t1 - t0);
    var exact = 9.8 * t0;
    function X(t){ return 70 + t * 140; }
    function Y(ss){ return 270 - ss * 2.6; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m = axes(m, 70, 270, 700, 24);
    var d = "";
    for(var t = 0; t <= 4.02; t += 0.05) d += (t === 0 ? "M" : "L") + " " + X(t) + " " + Y(s(t));
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    m += '<line x1="'+X(t0)+'" y1="'+Y(s(t0))+'" x2="'+X(t1)+'" y2="'+Y(s(t1))+'" stroke="#f59e0b" stroke-width="3"/>';
    var slopePx = (exact * 2.6) / 140;
    m += '<line x1="'+X(t0-0.7)+'" y1="'+(Y(s(t0))+slopePx*0.7*140)+'" x2="'+X(t0+0.7)+'" y2="'+(Y(s(t0))-slopePx*0.7*140)+'" stroke="#34d399" stroke-width="2" stroke-dasharray="6 4"/>';
    m += '<circle cx="'+X(t0)+'" cy="'+Y(s(t0))+'" r="5" fill="#f8fafc"/>';
    m += '<circle cx="'+X(t1)+'" cy="'+Y(s(t1))+'" r="4" fill="#f59e0b"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 12.1 — C<sub>i</sub>B<sub>i</sub>/AC<sub>i</sub> → slope of the tangent at A (t = 2)</text>';
    svg.innerHTML = m;
    readout(cell("h", (t1-t0).toFixed(2)+" s") + cell("Δs/Δt (chord)", chord.toFixed(3)+" m/s", "#f59e0b") + cell("9.8 t (tangent)", exact.toFixed(2)+" m/s", "#34d399"));
    verdict("<b>Table 12.2–12.3:</b> as |h| shrinks, the orange secant hugs the green tangent. Instantaneous velocity at t = 2 is <b>19.6 m/s</b> — sandwiched between 19.551 and 19.649 in the book’s tables.");
  }
  return { mount: mount, draw: draw };
})();

/* 12.3 — left vs right hand limits */
window.SIMS.twosided = (function(){
  var mode = "step";
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>y = f(x)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Approach from left</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Approach from right</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-step" id="p-step">Fig 12.3: 1 if x≤0, 2 if x&gt;0</button>' +
      '<button class="preset-btn" data-preset="p-abs" id="p-abs">g(x) = |x|, x ≠ 0</button>' +
      '<button class="preset-btn" data-preset="p-poly" id="p-poly">f(x) = x + 10 at x = 5</button>';
    document.getElementById("p-step").onclick = function(){ setActivePreset(this); mode="step"; draw(); };
    document.getElementById("p-abs").onclick = function(){ setActivePreset(this); mode="abs"; draw(); };
    document.getElementById("p-poly").onclick = function(){ setActivePreset(this); mode="poly"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>How close |x − a|</span><span class="val" id="ctrl-eps">0.80</span></div>' +
      '<input type="range" id="ctrl-eps-range" min="0.05" max="1.5" step="0.05" value="0.8"></div>';
    document.getElementById("ctrl-eps-range").oninput = function(){ draw(); };
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var eps = Number(document.getElementById("ctrl-eps-range").value);
    document.getElementById("ctrl-eps").textContent = eps.toFixed(2);
    var a = mode === "poly" ? 5 : 0;
    function f(x){
      if(mode === "step") return x <= 0 ? 1 : 2;
      if(mode === "abs") return Math.abs(x);
      return x + 10;
    }
    function X(x){ return mode === "poly" ? 70 + (x + 1) * 70 : 360 + x * 140; }
    function Y(y){ return mode === "poly" ? 270 - y * 14 : 250 - y * 70; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m = axes(m, 70, mode === "poly" ? 270 : 250, 700, 24);
    var d = "", started = false;
    var xmin = mode === "poly" ? 2 : -2, xmax = mode === "poly" ? 8 : 2;
    for(var x = xmin; x <= xmax + 0.001; x += 0.02){
      if(mode === "step" && x > 0 && x - 0.02 <= 0){ started = false; continue; }
      d += (started ? "L" : "M") + " " + X(x) + " " + Y(f(x));
      started = true;
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    if(mode === "step"){
      m += '<circle cx="'+X(0)+'" cy="'+Y(1)+'" r="5" fill="#38bdf8"/><circle cx="'+X(0)+'" cy="'+Y(2)+'" r="5" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    }
    var xl = a - eps, xr = a + eps;
    m += '<circle cx="'+X(xl)+'" cy="'+Y(f(xl))+'" r="5" fill="#f59e0b"/>';
    m += '<circle cx="'+X(xr)+'" cy="'+Y(f(xr))+'" r="5" fill="#34d399"/>';
    m += '<line x1="'+X(a)+'" y1="24" x2="'+X(a)+'" y2="270" stroke="#64748b" stroke-dasharray="4 4"/>';
    svg.innerHTML = m;
    var L = f(a - eps), R = f(a + eps);
    var exist = Math.abs(L - R) < 0.05;
    readout(cell("x → a⁻", L.toFixed(2), "#f59e0b") + cell("x → a⁺", R.toFixed(2), "#34d399") + cell("limit exists?", exist ? "YES" : "NO", exist ? "#34d399" : "#f87171"));
    if(mode === "step") verdict("<b>Fig. 12.3:</b> LHL = 1, RHL = 2. They disagree, so lim<sub>x→0</sub> f(x) <b>does not exist</b> even though f(0) = 1 is defined.");
    else if(mode === "abs") verdict("<b>|x|:</b> both sides collapse to 0, so the limit is 0 even though the book’s g is not defined at 0.");
    else verdict("<b>Illustration 1:</b> f(x) = x + 10 is a polynomial. Both sides give 15, and f(5) = 15 — limit equals the value.");
  }
  return { mount: mount, draw: draw };
})();

/* 12.3.2 — removable hole (x² − 4)/(x − 2) */
window.SIMS.hole = (function(){
  function h(x){ return (x * x - 4) / (x - 2); }
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>h(x) = (x²−4)/(x−2), x ≠ 2</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>The cancelled line y = x + 2</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-2" id="p-2">Approach x = 2 (Fig. 12.2)</button>' +
      '<button class="preset-btn" data-preset="p-far" id="p-far">Stand far from 2</button>';
    document.getElementById("p-2").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-x-range").value = 2.3; draw(); };
    document.getElementById("p-far").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-x-range").value = 5; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Probe x (≠ 2)</span><span class="val" id="ctrl-x">2.30</span></div>' +
      '<input type="range" id="ctrl-x-range" min="0.2" max="5" step="0.01" value="2.3"></div>';
    document.getElementById("ctrl-x-range").oninput = function(){ draw(); };
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var x = Number(document.getElementById("ctrl-x-range").value);
    if(Math.abs(x - 2) < 0.02) x = x < 2 ? 1.98 : 2.02;
    document.getElementById("ctrl-x").textContent = x.toFixed(2);
    function X(t){ return 70 + t * 110; }
    function Y(y){ return 260 - y * 28; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m = axes(m, 70, 260, 700, 24);
    var d = "";
    for(var t = 0.15; t <= 5.02; t += 0.04){
      if(Math.abs(t - 2) < 0.04) continue;
      d += (d === "" ? "M" : "L") + " " + X(t) + " " + Y(t + 2);
    }
    m += '<path d="'+d+'" fill="none" stroke="#34d399" stroke-width="2" stroke-dasharray="5 4"/>';
    m += '<circle cx="'+X(2)+'" cy="'+Y(4)+'" r="6" fill="none" stroke="#f59e0b" stroke-width="2"/>';
    m += '<circle cx="'+X(x)+'" cy="'+Y(h(x))+'" r="5" fill="#38bdf8"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Cancel (x−2): hole at (2, 4). The limit is the y-value of the hole.</text>';
    svg.innerHTML = m;
    readout(cell("x", x.toFixed(2)) + cell("h(x)", h(x).toFixed(3), "#38bdf8") + cell("x + 2", (x+2).toFixed(3), "#34d399"));
    verdict("<b>Fig. 12.2:</b> h(2) has no value (0/0), but lim<sub>x→2</sub> h(x) = 4 because (x²−4) = (x−2)(x+2) and the (x−2) cancels for x ≠ 2. Limit ≠ value.");
  }
  return { mount: mount, draw: draw };
})();

/* 12.4 — sandwich: cos x < sin x / x < 1 */
window.SIMS.sandwich = (function(){
  function mount(){
    App.state.maxT = 1.5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>y = 1</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>y = sin x / x</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>y = cos x</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-unit" id="p-unit">Unit-circle inequality (*)</button>' +
      '<button class="preset-btn" data-preset="p-ex4" id="p-ex4">Example 4: sin 4x / sin 2x</button>';
    document.getElementById("p-unit").onclick = function(){ setActivePreset(this); draw(); };
    document.getElementById("p-ex4").onclick = function(){ setActivePreset(this); draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>x (radians)</span><span class="val" id="ctrl-x">0.60</span></div>' +
      '<input type="range" id="ctrl-x-range" min="0.05" max="1.4" step="0.01" value="0.6"></div>';
    document.getElementById("ctrl-x-range").oninput = function(){ draw(); };
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var x = Number(document.getElementById("ctrl-x-range").value);
    document.getElementById("ctrl-x").textContent = x.toFixed(2);
    function X(t){ return 70 + t * 420; }
    function Y(y){ return 250 - y * 180; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m = axes(m, 70, 250, 700, 24);
    var d1 = "", d2 = "", d3 = "";
    for(var t = 0.04; t <= 1.45; t += 0.03){
      d1 += (t < 0.05 ? "M" : "L") + " " + X(t) + " " + Y(1);
      d2 += (t < 0.05 ? "M" : "L") + " " + X(t) + " " + Y(Math.sin(t)/t);
      d3 += (t < 0.05 ? "M" : "L") + " " + X(t) + " " + Y(Math.cos(t));
    }
    m += '<path d="'+d1+'" fill="none" stroke="#f59e0b" stroke-width="2"/>';
    m += '<path d="'+d2+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    m += '<path d="'+d3+'" fill="none" stroke="#34d399" stroke-width="2"/>';
    var sinc = Math.sin(x)/x;
    m += '<circle cx="'+X(x)+'" cy="'+Y(sinc)+'" r="5" fill="#f8fafc"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Theorem 4: squeezed to 1 as x → 0. Hence lim sin x / x = 1.</text>';
    svg.innerHTML = m;
    var r4 = Math.sin(4*x)/Math.sin(2*x);
    readout(cell("cos x", Math.cos(x).toFixed(4), "#34d399") + cell("sin x / x", sinc.toFixed(4), "#38bdf8") + cell("sin 4x / sin 2x", r4.toFixed(4)));
    verdict("<b>Inequality (*)</b> (zoom p.18): cos x &lt; (sin x)/x &lt; 1 for 0 &lt; |x| &lt; π/2. Sandwich ⇒ lim<sub>x→0</sub> (sin x)/x = 1. Example 4 then gives sin 4x / sin 2x → 2.");
  }
  return { mount: mount, draw: draw };
})();

/* 12.5 Definition 1 — first principle slider */
window.SIMS.firstprin = (function(){
  var fn = "lin";
  function f(x){
    if(fn === "lin") return 3 * x;
    if(fn === "quad") return 2*x*x + 3*x - 5;
    return Math.sin(x);
  }
  function fExact(a){
    if(fn === "lin") return 3;
    if(fn === "quad") return 4*a + 3;
    return Math.cos(a);
  }
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>y = f(x)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>[f(a+h)−f(a)]/h</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-lin" id="p-lin">Ex 5: f(x) = 3x at a = 2</button>' +
      '<button class="preset-btn" data-preset="p-quad" id="p-quad">Ex 6: 2x²+3x−5 at a = −1</button>' +
      '<button class="preset-btn" data-preset="p-sin" id="p-sin">Ex 7: sin x at a = 0</button>';
    document.getElementById("p-lin").onclick = function(){ setActivePreset(this); fn="lin"; draw(); };
    document.getElementById("p-quad").onclick = function(){ setActivePreset(this); fn="quad"; draw(); };
    document.getElementById("p-sin").onclick = function(){ setActivePreset(this); fn="sin"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>h (increment)</span><span class="val" id="ctrl-h">0.50</span></div>' +
      '<input type="range" id="ctrl-h-range" min="-1.5" max="1.5" step="0.01" value="0.5"></div>';
    document.getElementById("ctrl-h-range").oninput = function(){ draw(); };
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var h = Number(document.getElementById("ctrl-h-range").value);
    if(Math.abs(h) < 0.01) h = h < 0 ? -0.01 : 0.01;
    document.getElementById("ctrl-h").textContent = h.toFixed(2);
    var a = fn === "lin" ? 2 : (fn === "quad" ? -1 : 0);
    var chord = (f(a+h) - f(a)) / h;
    var exact = fExact(a);
    function X(x){ return 360 + x * 70; }
    function Y(y){ return 160 - y * 18; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m = axes(m, 70, 160, 700, 24);
    var d = "";
    for(var x = -4; x <= 4.02; x += 0.05) d += (x === -4 ? "M" : "L") + " " + X(x) + " " + Y(f(x));
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<line x1="'+X(a)+'" y1="'+Y(f(a))+'" x2="'+X(a+h)+'" y2="'+Y(f(a+h))+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<circle cx="'+X(a)+'" cy="'+Y(f(a))+'" r="5" fill="#f8fafc"/>';
    m += '<circle cx="'+X(a+h)+'" cy="'+Y(f(a+h))+'" r="4" fill="#f59e0b"/>';
    svg.innerHTML = m;
    readout(cell("a", String(a)) + cell("[f(a+h)−f(a)]/h", chord.toFixed(4), "#f59e0b") + cell("f′(a) exact", exact.toFixed(4), "#34d399"));
    if(fn === "lin") verdict("<b>Example 5 (zoom p.24):</b> [3(2+h)−6]/h = 3 for every h ≠ 0. The limit is 3 — slope of a straight line is constant.");
    else if(fn === "quad") verdict("<b>Example 6:</b> f′(−1) = −1 and f′(0) = 3, so f′(0) + 3 f′(−1) = 0. Drag h → 0 and watch the chord lock onto −1.");
    else verdict("<b>Example 7:</b> [sin h − sin 0]/h = (sin h)/h → 1. So (sin x)′ at 0 is 1 = cos 0.");
  }
  return { mount: mount, draw: draw };
})();

/* 12.5.1 — product rule as growing rectangle */
window.SIMS.prodrule = (function(){
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>u Δv</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>v Δu</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Δu Δv (vanishes)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-uv" id="p-uv">Leibnitz: (uv)′ = u′v + uv′</button>';
    document.getElementById("p-uv").onclick = function(){ setActivePreset(this); draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>u</span><span class="val" id="ctrl-u">4.0</span></div>' +
      '<input type="range" id="ctrl-u-range" min="1" max="8" step="0.1" value="4"></div>' +
      '<div class="control-item"><div class="control-label"><span>v</span><span class="val" id="ctrl-v">3.0</span></div>' +
      '<input type="range" id="ctrl-v-range" min="1" max="8" step="0.1" value="3"></div>' +
      '<div class="control-item"><div class="control-label"><span>Δu = Δv = h</span><span class="val" id="ctrl-h">0.80</span></div>' +
      '<input type="range" id="ctrl-h-range" min="0.05" max="2" step="0.05" value="0.8"></div>';
    ["ctrl-u-range","ctrl-v-range","ctrl-h-range"].forEach(function(id){
      document.getElementById(id).oninput = function(){ draw(); };
    });
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var u = Number(document.getElementById("ctrl-u-range").value);
    var v = Number(document.getElementById("ctrl-v-range").value);
    var h = Number(document.getElementById("ctrl-h-range").value);
    document.getElementById("ctrl-u").textContent = u.toFixed(1);
    document.getElementById("ctrl-v").textContent = v.toFixed(1);
    document.getElementById("ctrl-h").textContent = h.toFixed(2);
    var k = 28;
    var x0 = 80, y0 = 250;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="'+x0+'" y="'+(y0-v*k)+'" width="'+(u*k)+'" height="'+(v*k)+'" fill="#1e3a5f" stroke="#38bdf8" stroke-width="2"/>';
    m += '<rect x="'+(x0+u*k)+'" y="'+(y0-v*k)+'" width="'+(h*k)+'" height="'+(v*k)+'" fill="#7c2d12" stroke="#f59e0b"/>';
    m += '<rect x="'+x0+'" y="'+(y0-(v+h)*k)+'" width="'+(u*k)+'" height="'+(h*k)+'" fill="#14532d" stroke="#34d399"/>';
    m += '<rect x="'+(x0+u*k)+'" y="'+(y0-(v+h)*k)+'" width="'+(h*k)+'" height="'+(h*k)+'" fill="#334155" stroke="#94a3b8"/>';
    m += '<text x="500" y="80" fill="#94a3b8" font-size="13">Δ(uv) = u Δv + v Δu + Δu Δv</text>';
    m += '<text x="500" y="104" fill="#94a3b8" font-size="13">÷ Δx, let Δx→0: (uv)′ = u v′ + v u′</text>';
    svg.innerHTML = m;
    var dProd = u*h + v*h + h*h;
    readout(cell("u Δv + v Δu", (u*h+v*h).toFixed(3)) + cell("Δu Δv", (h*h).toFixed(3), "#94a3b8") + cell("Δ(uv)/h", (dProd/h).toFixed(3)));
    verdict("<b>Theorem 5 (iii) zoom p.28:</b> the grey corner Δu Δv is second-order — it dies when you divide by h and send h → 0. What survives is the Leibnitz product rule.");
  }
  return { mount: mount, draw: draw };
})();

/* 12.5.2 — power and sine/cosine */
window.SIMS.powertrig = (function(){
  var kind = "power";
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>y = f(x)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>tangent of slope f′(x)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-pow" id="p-pow">Theorem 6: (xⁿ)′ = n xⁿ⁻¹</button>' +
      '<button class="preset-btn" data-preset="p-sin" id="p-sin">Ex 16: (sin x)′ = cos x</button>' +
      '<button class="preset-btn" data-preset="p-tan" id="p-tan">Ex 17: (tan x)′ = sec² x</button>';
    document.getElementById("p-pow").onclick = function(){ setActivePreset(this); kind="power"; draw(); };
    document.getElementById("p-sin").onclick = function(){ setActivePreset(this); kind="sin"; draw(); };
    document.getElementById("p-tan").onclick = function(){ setActivePreset(this); kind="tan"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>n (for xⁿ)</span><span class="val" id="ctrl-n">3</span></div>' +
      '<input type="range" id="ctrl-n-range" min="1" max="6" step="1" value="3"></div>' +
      '<div class="control-item"><div class="control-label"><span>x</span><span class="val" id="ctrl-x">1.20</span></div>' +
      '<input type="range" id="ctrl-x-range" min="-1.4" max="1.4" step="0.02" value="1.2"></div>';
    document.getElementById("ctrl-n-range").oninput = function(){ draw(); };
    document.getElementById("ctrl-x-range").oninput = function(){ draw(); };
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var n = Number(document.getElementById("ctrl-n-range").value);
    var x0 = Number(document.getElementById("ctrl-x-range").value);
    document.getElementById("ctrl-n").textContent = String(n);
    document.getElementById("ctrl-x").textContent = x0.toFixed(2);
    function f(x){
      if(kind === "power") return Math.pow(x, n);
      if(kind === "sin") return Math.sin(x);
      return Math.tan(x);
    }
    function df(x){
      if(kind === "power") return n * Math.pow(x, n-1);
      if(kind === "sin") return Math.cos(x);
      return 1/(Math.cos(x)*Math.cos(x));
    }
    function X(x){ return 360 + x * 160; }
    function Y(y){ return 160 - y * 40; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m = axes(m, 70, 160, 700, 24);
    var d = "";
    for(var x = -1.5; x <= 1.5; x += 0.03){
      var yv = f(x);
      if(!isFinite(yv) || Math.abs(yv) > 6) { d += ""; continue; }
      d += (d === "" || Math.abs(x + 1.5) < 0.04 ? "M" : "L") + " " + X(x) + " " + Y(yv);
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    var sl = df(x0);
    m += '<line x1="'+X(x0-0.5)+'" y1="'+(Y(f(x0))+sl*0.5*160/40*40)+'" x2="'+X(x0+0.5)+'" y2="'+(Y(f(x0))-sl*0.5*160)+'" stroke="#34d399" stroke-width="2"/>';
    m += '<circle cx="'+X(x0)+'" cy="'+Y(f(x0))+'" r="5" fill="#f8fafc"/>';
    svg.innerHTML = m;
    readout(cell("f(x)", f(x0).toFixed(3)) + cell("f′(x)", sl.toFixed(3), "#34d399") + cell(kind === "power" ? "n xⁿ⁻¹" : (kind === "sin" ? "cos x" : "sec² x"), sl.toFixed(3)));
    if(kind === "power") verdict("<b>Theorem 6 (zoom p.30):</b> binomial (x+h)ⁿ − xⁿ = h(n xⁿ⁻¹ + … + hⁿ⁻¹), divide by h, send h → 0 → n xⁿ⁻¹. Ex 13: (6x¹⁰⁰ − x⁵⁵ + x)′ = 600x⁹⁹ − 55x⁵⁴ + 1.");
    else if(kind === "sin") verdict("<b>Example 16:</b> [sin(x+h)−sin x]/h = [2 cos(x+h/2) sin(h/2)]/h → cos x, using lim (sin θ)/θ = 1.");
    else verdict("<b>Example 17:</b> write tan = sin/cos and use the quotient rule. The surviving identity is sec² x.");
  }
  return { mount: mount, draw: draw };
})();

/* miscellaneous first-principle playground */
window.SIMS.miscfirst = (function(){
  var which = "inv";
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>y = f(x)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>difference quotient</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-inv" id="p-inv">Misc Ex 1(ii): (−x)⁻¹</button>' +
      '<button class="preset-btn" data-preset="p-shift" id="p-shift">1(iii): sin(x+1)</button>' +
      '<button class="preset-btn" data-preset="p-cos" id="p-cos">1(iv): cos(x − π/8)</button>';
    document.getElementById("p-inv").onclick = function(){ setActivePreset(this); which="inv"; draw(); };
    document.getElementById("p-shift").onclick = function(){ setActivePreset(this); which="shift"; draw(); };
    document.getElementById("p-cos").onclick = function(){ setActivePreset(this); which="cos"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>x</span><span class="val" id="ctrl-x">1.00</span></div>' +
      '<input type="range" id="ctrl-x-range" min="-2" max="2.5" step="0.05" value="1"></div>' +
      '<div class="control-item"><div class="control-label"><span>h</span><span class="val" id="ctrl-h">0.40</span></div>' +
      '<input type="range" id="ctrl-h-range" min="0.02" max="1.2" step="0.01" value="0.4"></div>';
    document.getElementById("ctrl-x-range").oninput = function(){ draw(); };
    document.getElementById("ctrl-h-range").oninput = function(){ draw(); };
    draw();
  }
  function f(x){
    if(which === "inv") return -1/x;
    if(which === "shift") return Math.sin(x + 1);
    return Math.cos(x - Math.PI/8);
  }
  function df(x){
    if(which === "inv") return 1/(x*x);
    if(which === "shift") return Math.cos(x + 1);
    return -Math.sin(x - Math.PI/8);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var x0 = Number(document.getElementById("ctrl-x-range").value);
    var h = Number(document.getElementById("ctrl-h-range").value);
    if(which === "inv" && Math.abs(x0) < 0.15) x0 = x0 < 0 ? -0.15 : 0.15;
    document.getElementById("ctrl-x").textContent = x0.toFixed(2);
    document.getElementById("ctrl-h").textContent = h.toFixed(2);
    var chord = (f(x0+h) - f(x0)) / h;
    function X(x){ return 360 + x * 90; }
    function Y(y){ return 160 - y * 50; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m = axes(m, 70, 160, 700, 24);
    var d = "";
    for(var x = -2.4; x <= 2.6; x += 0.04){
      if(which === "inv" && Math.abs(x) < 0.12) { d += ""; continue; }
      var yv = f(x);
      if(!isFinite(yv) || Math.abs(yv) > 8) continue;
      d += (d === "" ? "M" : "L") + " " + X(x) + " " + Y(yv);
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<line x1="'+X(x0)+'" y1="'+Y(f(x0))+'" x2="'+X(x0+h)+'" y2="'+Y(f(x0+h))+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<circle cx="'+X(x0)+'" cy="'+Y(f(x0))+'" r="5" fill="#f8fafc"/>';
    svg.innerHTML = m;
    readout(cell("difference quotient", chord.toFixed(4), "#f59e0b") + cell("f′(x)", df(x0).toFixed(4), "#34d399"));
    if(which === "inv") verdict("<b>Misc 1(ii):</b> f(x) = −1/x. First principle gives 1/x². (The chain-rule view: d(x⁻¹)/dx = −x⁻², then compose with −x.)");
    else if(which === "shift") verdict("<b>Misc 1(iii):</b> sin(x+1) is a phase-shifted sine. The difference quotient uses the same sin-addition identity as Example 16, and the limit is cos(x+1).");
    else verdict("<b>Misc 1(iv):</b> cos(x − π/8)′ = −sin(x − π/8). First principle + the cosine subtraction formula.");
  }
  return { mount: mount, draw: draw };
})();
