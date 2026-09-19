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

var BAT_A = [30, 91, 0, 64, 42, 80, 30, 5, 117, 71];
var BAT_B = [53, 46, 48, 50, 53, 53, 58, 60, 57, 52];

function mean(xs){ return xs.reduce(function(a,b){ return a+b; }, 0) / xs.length; }
function mdAbout(xs, c){
  return xs.reduce(function(a,x){ return a + Math.abs(x - c); }, 0) / xs.length;
}
function variance(xs){
  var m = mean(xs);
  return xs.reduce(function(a,x){ return a + (x-m)*(x-m); }, 0) / xs.length;
}

/* 13.1–13.3 batsmen: same mean, wildly different range */
window.SIMS.batsmen = (function(){
  var who = "both";
  function mount(){
    App.state.maxT = 10;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 10;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Batsman A (volatile)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Batsman B (steady)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Mean = median = 53</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-both" id="p-both">Fig. 13.1–13.2 both series</button>' +
      '<button class="preset-btn" data-preset="p-a" id="p-a">A only</button>' +
      '<button class="preset-btn" data-preset="p-b" id="p-b">B only</button>';
    document.getElementById("p-both").onclick = function(){ setActivePreset(this); who="both"; draw(); };
    document.getElementById("p-a").onclick = function(){ setActivePreset(this); who="A"; draw(); };
    document.getElementById("p-b").onclick = function(){ setActivePreset(this); who="B"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var k = (typeof t === "number") ? Math.min(10, Math.floor(t) + 1) : 10;
    function X(x){ return 50 + x * 5.2; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="50" y1="90" x2="680" y2="90" stroke="#475569"/>';
    m += '<line x1="50" y1="210" x2="680" y2="210" stroke="#475569"/>';
    m += '<line x1="'+X(53)+'" y1="40" x2="'+X(53)+'" y2="250" stroke="#34d399" stroke-dasharray="4 4"/>';
    function dots(arr, y, color, n){
      for(var i = 0; i < n; i++){
        m += '<circle cx="'+X(arr[i])+'" cy="'+y+'" r="6" fill="'+color+'" opacity="0.85"/>';
      }
    }
    if(who !== "B") dots(BAT_A, 90, "#f59e0b", k);
    if(who !== "A") dots(BAT_B, 210, "#38bdf8", k);
    m += '<text x="50" y="32" fill="#f59e0b" font-size="13">A: range 117 − 0 = 117</text>';
    m += '<text x="50" y="270" fill="#38bdf8" font-size="13">B: range 60 − 46 = 14</text>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Same mean 53, same median 53 — dispersion decides the better batter.</text>';
    svg.innerHTML = m;
    var a = BAT_A.slice(0, k), b = BAT_B.slice(0, k);
    readout(cell("A range", (k? Math.max.apply(null,a)-Math.min.apply(null,a):0)) +
            cell("B range", (k? Math.max.apply(null,b)-Math.min.apply(null,b):0)) +
            cell("A mean", k? mean(a).toFixed(1):"—") +
            cell("B mean", k? mean(b).toFixed(1):"—"));
    verdict("<b>Zoom p.1–3:</b> both have mean = median = 53. Range of A is 117; of B is 14. Central tendency is silent; a measure of dispersion is required.");
  }
  return { mount: mount, draw: draw };
})();

/* 13.4.1 mean deviation as stacked |x − c| */
window.SIMS.mdungroup = (function(){
  var about = "mean";
  var data = [6, 7, 10, 12, 13, 4, 8, 12]; // Example 1
  function mount(){
    App.state.maxT = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>observation</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>|xᵢ − c|</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-mean" id="p-mean">Example 1: MD about mean</button>' +
      '<button class="preset-btn" data-preset="p-med" id="p-med">Same data: MD about median</button>';
    document.getElementById("p-mean").onclick = function(){ setActivePreset(this); about="mean"; draw(); };
    document.getElementById("p-med").onclick = function(){ setActivePreset(this); about="median"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var xs = data.slice().sort(function(a,b){ return a-b; });
    var mval = mean(data);
    var M = (xs[3] + xs[4]) / 2;
    var c = about === "mean" ? mval : M;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="250" x2="700" y2="250" stroke="#475569"/>';
    function X(x){ return 40 + x * 40; }
    m += '<line x1="'+X(c)+'" y1="40" x2="'+X(c)+'" y2="250" stroke="#34d399" stroke-width="2"/>';
    data.forEach(function(x, i){
      var px = X(x), py = 230 - i * 22;
      m += '<line x1="'+X(c)+'" y1="'+py+'" x2="'+px+'" y2="'+py+'" stroke="#f59e0b" stroke-width="3"/>';
      m += '<circle cx="'+px+'" cy="'+py+'" r="5" fill="#38bdf8"/>';
    });
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">M.D.(c) = (1/n) Σ |xᵢ − c|. Signed deviations from the mean sum to 0 — that is why we take modulus.</text>';
    svg.innerHTML = m;
    var md = mdAbout(data, c);
    readout(cell("c", c.toFixed(2), "#34d399") + cell("Σ |xᵢ−c|", (md * data.length).toFixed(2)) + cell("M.D.", md.toFixed(2), "#f59e0b"));
    verdict("<b>Example 1 (zoom p.5):</b> data 6,7,10,12,13,4,8,12. Mean = 72/8 = 9, Σ|dev| = 22, M.D.(x̄) = 2.75. Signed deviations −3−2+1+3+4−5−1+3 = 0.");
  }
  return { mount: mount, draw: draw };
})();

/* histogram + mean for grouped data */
window.SIMS.histmean = (function(){
  // Ex 13.1 Q9 income
  var edges = [0,100,200,300,400,500,600,700,800];
  var freq = [4,8,9,10,7,5,4,3];
  function mount(){
    App.state.maxT = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>frequency</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>class mark xᵢ</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>mean</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-inc" id="p-inc">Ex 13.1 Q9: income / day</button>' +
      '<button class="preset-btn" data-preset="p-ht" id="p-ht">Ex 13.1 Q10: height of boys</button>';
    document.getElementById("p-inc").onclick = function(){
      setActivePreset(this);
      edges = [0,100,200,300,400,500,600,700,800];
      freq = [4,8,9,10,7,5,4,3];
      draw();
    };
    document.getElementById("p-ht").onclick = function(){
      setActivePreset(this);
      edges = [95,105,115,125,135,145,155];
      freq = [9,13,26,30,12,10];
      draw();
    };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var mids = [];
    var N = 0, sfx = 0, sfd = 0;
    for(var i = 0; i < freq.length; i++){
      var mid = (edges[i] + edges[i+1]) / 2;
      mids.push(mid);
      N += freq[i];
      sfx += freq[i] * mid;
    }
    var xbar = sfx / N;
    for(i = 0; i < freq.length; i++) sfd += freq[i] * Math.abs(mids[i] - xbar);
    var md = sfd / N;
    var xmin = edges[0], xmax = edges[edges.length-1];
    function X(x){ return 50 + (x - xmin) / (xmax - xmin) * 640; }
    var fmax = Math.max.apply(null, freq);
    function Y(f){ return 250 - f / fmax * 190; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="50" y1="250" x2="700" y2="250" stroke="#475569"/>';
    for(i = 0; i < freq.length; i++){
      var x0 = X(edges[i]), x1 = X(edges[i+1]);
      m += '<rect x="'+x0+'" y="'+Y(freq[i])+'" width="'+(x1-x0-2)+'" height="'+(250-Y(freq[i]))+'" fill="#1e3a5f" stroke="#38bdf8"/>';
      m += '<circle cx="'+X(mids[i])+'" cy="'+Y(freq[i])+'" r="3" fill="#f59e0b"/>';
    }
    m += '<line x1="'+X(xbar)+'" y1="40" x2="'+X(xbar)+'" y2="250" stroke="#34d399" stroke-width="2"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Grouped M.D.(x̄) = Σ fᵢ |xᵢ − x̄| / N, xᵢ = class mark.</text>';
    svg.innerHTML = m;
    readout(cell("N", String(N)) + cell("mean x̄", xbar.toFixed(2), "#34d399") + cell("M.D.(x̄)", md.toFixed(2), "#f59e0b"));
    verdict("<b>Formula (zoom p.31):</b> replace each class by its midpoint, then take the weighted mean of absolute deviations. Play the income vs height histograms — the mean line is the balance point of the bars.");
  }
  return { mount: mount, draw: draw };
})();

/* 13.5 variance as squared spread */
window.SIMS.variance = (function(){
  var set = "A";
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>set A (n=6, mean 30)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>set B (n=31, mean 30)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-a" id="p-a">Zoom p.16 set A: 5,15,…,55</button>' +
      '<button class="preset-btn" data-preset="p-b" id="p-b">Set B: 15 through 45</button>' +
      '<button class="preset-btn" data-preset="p-ex8" id="p-ex8">Example 8: 6,8,…,24</button>';
    document.getElementById("p-a").onclick = function(){ setActivePreset(this); set="A"; draw(); };
    document.getElementById("p-b").onclick = function(){ setActivePreset(this); set="B"; draw(); };
    document.getElementById("p-ex8").onclick = function(){ setActivePreset(this); set="E8"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var xs, note;
    if(set === "A"){ xs = [5,15,25,35,45,55]; note = "Σ(x−30)² = 1750, n = 6 so raw sum is large but n is small."; }
    else if(set === "B"){ xs = []; for(var k = 15; k <= 45; k++) xs.push(k); note = "Σ(y−30)² = 2480 over 31 points — larger sum, smaller per-point spread."; }
    else { xs = [6,8,10,12,14,16,18,20,22,24]; note = "Example 8: mean 15, Σ(x−x̄)² = 330, σ² = 33, σ = √33 ≈ 5.74."; }
    var mval = mean(xs);
    var v = variance(xs);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="250" x2="700" y2="250" stroke="#475569"/>';
    var xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs);
    function X(x){ return 50 + (x - xmin) / Math.max(1, xmax - xmin) * 620; }
    m += '<line x1="'+X(mval)+'" y1="40" x2="'+X(mval)+'" y2="250" stroke="#34d399" stroke-width="2"/>';
    xs.forEach(function(x){
      var h = (x - mval) * (x - mval);
      var hh = Math.min(180, h * (set === "B" ? 0.7 : 0.22));
      m += '<rect x="'+(X(x)-4)+'" y="'+(250-hh)+'" width="8" height="'+hh+'" fill="#f59e0b" opacity="0.8"/>';
      m += '<circle cx="'+X(x)+'" cy="250" r="4" fill="#38bdf8"/>';
    });
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">σ² = (1/n) Σ (xᵢ − x̄)² — squares so signs cannot cancel, and large deviations dominate.</text>';
    svg.innerHTML = m;
    readout(cell("n", String(xs.length)) + cell("mean", mval.toFixed(2)) + cell("σ²", v.toFixed(2), "#f59e0b") + cell("σ", Math.sqrt(v).toFixed(2), "#34d399"));
    verdict("<b>" + note + "</b> Dividing by n makes set B less dispersed than A (σ_A ≈ 17.08, σ_B ≈ 8.94) even though Σ squares is larger for B.");
  }
  return { mount: mount, draw: draw };
})();

/* discrete frequency SD */
window.SIMS.freqsd = (function(){
  function mount(){
    App.state.maxT = 7;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>xᵢ</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>fᵢ (xᵢ − x̄)²</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-ex9" id="p-ex9">Example 9 (Table 13.8)</button>';
    document.getElementById("p-ex9").onclick = function(){ setActivePreset(this); draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var x = [4,8,11,17,20,24,32], f = [3,5,9,5,4,3,1];
    var N = 0, sfx = 0;
    for(var i = 0; i < x.length; i++){ N += f[i]; sfx += f[i]*x[i]; }
    var xbar = sfx / N;
    var ss = 0;
    for(i = 0; i < x.length; i++) ss += f[i]*(x[i]-xbar)*(x[i]-xbar);
    var v = ss / N;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="50" y1="250" x2="700" y2="250" stroke="#475569"/>';
    function X(xv){ return 50 + (xv - 0) * 18; }
    function Y(fi){ return 250 - fi * 18; }
    for(i = 0; i < x.length; i++){
      m += '<rect x="'+(X(x[i])-10)+'" y="'+Y(f[i])+'" width="20" height="'+(250-Y(f[i]))+'" fill="#1e3a5f" stroke="#38bdf8"/>';
    }
    m += '<line x1="'+X(xbar)+'" y1="40" x2="'+X(xbar)+'" y2="250" stroke="#34d399" stroke-width="2"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">σ² = (1/N) Σ fᵢ (xᵢ − x̄)², N = Σ fᵢ. Example 9: N = 30, x̄ = 14, Σ f(x−x̄)² = 1374.</text>';
    svg.innerHTML = m;
    readout(cell("N", String(N)) + cell("x̄", xbar.toFixed(2)) + cell("σ²", v.toFixed(2)) + cell("σ", Math.sqrt(v).toFixed(2)));
    verdict("<b>Example 9 (zoom p.19):</b> Σ fᵢ xᵢ = 420, x̄ = 14, Σ fᵢ(xᵢ−x̄)² = 1374, σ² = 45.8, σ = √45.8 ≈ 6.77.");
  }
  return { mount: mount, draw: draw };
})();

/* shortcut y = (x − A)/h */
window.SIMS.shortcut = (function(){
  var A = 14, h = 2;
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>x</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>y = (x − A)/h</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-ex8" id="p-ex8">Example 8 step-deviation, A = 14, h = 2</button>';
    document.getElementById("p-ex8").onclick = function(){ setActivePreset(this); draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Assumed mean A</span><span class="val" id="ctrl-A">14</span></div>' +
      '<input type="range" id="ctrl-A-range" min="6" max="24" step="2" value="14"></div>' +
      '<div class="control-item"><div class="control-label"><span>Scale h</span><span class="val" id="ctrl-h">2</span></div>' +
      '<input type="range" id="ctrl-h-range" min="1" max="4" step="1" value="2"></div>';
    document.getElementById("ctrl-A-range").oninput = function(){ draw(); };
    document.getElementById("ctrl-h-range").oninput = function(){ draw(); };
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    A = Number(document.getElementById("ctrl-A-range").value);
    h = Number(document.getElementById("ctrl-h-range").value);
    document.getElementById("ctrl-A").textContent = String(A);
    document.getElementById("ctrl-h").textContent = String(h);
    var xs = [6,8,10,12,14,16,18,20,22,24];
    var n = xs.length;
    var sy = 0, sy2 = 0;
    xs.forEach(function(x){
      var y = (x - A) / h;
      sy += y; sy2 += y * y;
    });
    var ybar = sy / n;
    var xbar = A + h * ybar;
    var varY = sy2 / n - ybar * ybar;
    var varX = h * h * varY;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="50" y1="150" x2="700" y2="150" stroke="#475569"/>';
    function Xx(x){ return 50 + (x - 4) * 26; }
    function Xy(y){ return 360 + y * 28; }
    xs.forEach(function(x){
      var y = (x - A) / h;
      m += '<circle cx="'+Xx(x)+'" cy="90" r="5" fill="#38bdf8"/>';
      m += '<circle cx="'+Xy(y)+'" cy="210" r="5" fill="#f59e0b"/>';
    });
    m += '<text x="50" y="40" fill="#38bdf8" font-size="13">x-axis (raw scores)</text>';
    m += '<text x="50" y="280" fill="#f59e0b" font-size="13">y-axis (step deviations)</text>';
    svg.innerHTML = m;
    readout(cell("ȳ", ybar.toFixed(3)) + cell("x̄ = A + hȳ", xbar.toFixed(2), "#34d399") + cell("σₓ² = h² σᵧ²", varX.toFixed(2)));
    verdict("<b>§13.5.4 (zoom p.23):</b> x̄ = A + h ȳ and σₓ² = h² σᵧ². Changing A (origin) does not change σ; changing h (scale) multiplies σ by |h|. For Example 8 the true mean is 15 and σ² = 33 regardless of A.");
  }
  return { mount: mount, draw: draw };
})();

/* change of origin and scale / misc */
window.SIMS.scale = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>original x</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>a x  (scale)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-m3" id="p-m3">Misc Q3: each observation × 3</button>' +
      '<button class="preset-btn" data-preset="p-add" id="p-add">Example 15: each xᵢ increased by a</button>';
    var mode = "mul";
    document.getElementById("p-m3").onclick = function(){ setActivePreset(this); mode="mul"; draw(); };
    document.getElementById("p-add").onclick = function(){ setActivePreset(this); mode="add"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>a</span><span class="val" id="ctrl-a">3.0</span></div>' +
      '<input type="range" id="ctrl-a-range" min="-4" max="6" step="0.5" value="3"></div>';
    document.getElementById("ctrl-a-range").oninput = function(){ draw(); };
    window._scaleMode = function(){ return mode; };
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var a = Number(document.getElementById("ctrl-a-range").value);
    document.getElementById("ctrl-a").textContent = a.toFixed(1);
    var xs = [2, 4, 6, 8, 10, 12];
    var mode = (window._scaleMode && window._scaleMode()) || "mul";
    var ys = xs.map(function(x){ return mode === "mul" ? a * x : x + a; });
    var mx = mean(xs), my = mean(ys);
    var vx = variance(xs), vy = variance(ys);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="250" x2="700" y2="250" stroke="#475569"/>';
    function X(x){ return 80 + x * 18; }
    xs.forEach(function(x,i){
      m += '<circle cx="'+X(x)+'" cy="200" r="6" fill="#38bdf8"/>';
      m += '<circle cx="'+X(ys[i])+'" cy="80" r="6" fill="#f59e0b"/>';
      m += '<line x1="'+X(x)+'" y1="200" x2="'+X(ys[i])+'" y2="80" stroke="#475569"/>';
    });
    svg.innerHTML = m;
    readout(cell("mean x", mx.toFixed(2)) + cell("mean y", my.toFixed(2)) + cell("σₓ", Math.sqrt(vx).toFixed(2)) + cell("σᵧ", Math.sqrt(vy).toFixed(2)));
    if(mode === "mul") verdict("<b>Misc Q3–Q4:</b> y = a x ⇒ mean(y) = a mean(x), variance(y) = a² variance(x). Here a = "+a+". SD is multiplied by |a|.");
    else verdict("<b>Example 15:</b> adding a (change of origin) shifts the mean by a and leaves variance / SD unchanged. Dispersion is translation-invariant.");
  }
  return { mount: mount, draw: draw };
})();
