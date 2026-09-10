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
function numLine(m, y, xmin, xmax, openAt, closedAt, shadeLeft, shadeRight, special){
  var X = function(v){ return 60 + (v - xmin) / (xmax - xmin) * 600; };
  m += '<line x1="40" y1="'+y+'" x2="680" y2="'+y+'" stroke="#64748b" stroke-width="3"/>';
  m += '<polygon points="680,'+y+' 668,'+(y-6)+' 668,'+(y+6)+'" fill="#64748b"/>';
  m += '<polygon points="40,'+y+' 52,'+(y-6)+' 52,'+(y+6)+'" fill="#64748b"/>';
  for(var v = xmin; v <= xmax; v++){
    var xx = X(v);
    m += '<line x1="'+xx+'" y1="'+(y-8)+'" x2="'+xx+'" y2="'+(y+8)+'" stroke="#94a3b8"/>';
    m += '<text x="'+xx+'" y="'+(y+24)+'" fill="#94a3b8" font-size="12" text-anchor="middle">'+v+'</text>';
  }
  if(shadeLeft !== undefined){
    m += '<line x1="50" y1="'+y+'" x2="'+X(shadeLeft)+'" y2="'+y+'" stroke="#38bdf8" stroke-width="6"/>';
  }
  if(shadeRight !== undefined){
    m += '<line x1="'+X(shadeRight)+'" y1="'+y+'" x2="670" y2="'+y+'" stroke="#38bdf8" stroke-width="6"/>';
  }
  if(openAt !== undefined){
    m += '<circle cx="'+X(openAt)+'" cy="'+y+'" r="8" fill="#09131d" stroke="#f59e0b" stroke-width="3"/>';
  }
  if(closedAt !== undefined){
    m += '<circle cx="'+X(closedAt)+'" cy="'+y+'" r="8" fill="#34d399" stroke="#34d399" stroke-width="3"/>';
  }
  if(special !== undefined){
    m += '<circle cx="'+X(special)+'" cy="'+y+'" r="5" fill="#f8fafc"/>';
  }
  return m;
}

window.SIMS["rice-market"] = (function(){
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Spend 30x</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Budget ₹200</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ravi">Ravi: 30x &lt; 200</button>' +
      '<button class="preset-btn" id="p-upi">UPI: 1999x ≤ 100000</button>';
    document.getElementById("p-ravi").onclick = function(){ setActivePreset(this); mode="ravi"; App.resetTimeline(); App.play(); };
    document.getElementById("p-upi").onclick = function(){ setActivePreset(this); mode="upi"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  var mode = "ravi";
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "ravi"){
      var x = Math.min(8, Math.floor(t));
      var spend = 30 * x;
      var ok = spend < 200;
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Ravi · rice ₹30 / packet · wallet ₹200 · 30x &lt; 200</text>';
      for(var i=0;i<x;i++){
        m += '<rect x="'+(40+i*80)+'" y="70" width="60" height="80" rx="6" fill="'+(ok?"#38bdf8":"#f87171")+'" opacity="0.9"/>';
        m += '<text x="'+(70+i*80)+'" y="116" fill="#0f172a" font-size="12" text-anchor="middle">1 kg</text>';
      }
      m += '<rect x="40" y="200" width="640" height="18" rx="4" fill="#1e293b"/>';
      m += '<rect x="40" y="200" width="'+Math.min(640, spend/200*640)+'" height="18" rx="4" fill="'+(ok?"#34d399":"#f87171")+'"/>';
      m += '<line x1="680" y1="196" x2="680" y2="222" stroke="#f59e0b" stroke-width="3"/>';
      m += '<text x="680" y="240" fill="#f59e0b" font-size="12" text-anchor="end">₹200</text>';
      readout(cell("packets x", String(x)) + cell("spend 30x", "₹"+spend, ok?"#34d399":"#f87171") + cell("30x < 200", ok?"TRUE":"FALSE", ok?"#34d399":"#f87171"));
      verdict("<b>Solution set (whole packets):</b> {0,1,2,3,4,5,6}. At x = 7, 210 ≮ 200. He cannot hit ₹200 exactly because 30 ∤ 200.");
    } else {
      var n = Math.min(52, Math.floor(t * 7));
      var spend = 1999 * n;
      var ok = spend <= 100000;
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">UPI daily cap ₹1,00,000 · each kirana scan ₹1,999</text>';
      m += '<rect x="40" y="120" width="640" height="28" rx="6" fill="#1e293b"/>';
      m += '<rect x="40" y="120" width="'+Math.min(640, spend/100000*640)+'" height="28" rx="6" fill="'+(ok?"#38bdf8":"#f87171")+'"/>';
      m += '<text x="360" y="90" fill="#e2e8f0" font-size="16" text-anchor="middle">1999x ≤ 100000  ⇒  x ≤ 50</text>';
      readout(cell("scans x", String(n)) + cell("spend", "₹"+spend) + cell("under cap", ok?"YES":"NO", ok?"#34d399":"#f87171"));
      verdict("<b>Indian Connect:</b> a daily UPI cap is a slack inequality (equality allowed). Floor(100000/1999) = 50 scans.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["ineq-types"] = (function(){
  var items = [
    {t:"30x < 200", k:"strict linear, 1 var"},
    {t:"40x + 20y ≤ 120", k:"slack linear, 2 var"},
    {t:"ax + b ≥ 0 (a≠0)", k:"slack linear, 1 var"},
    {t:"ax² + bx + c ≤ 0", k:"quadratic (out of chapter)"},
    {t:"3 < 5 < 7", k:"numerical double inequality"},
    {t:"3 ≤ x < 5", k:"literal double inequality"}
  ];
  var idx = 0;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Linear</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Quadratic / other</span></div>';
    document.getElementById("preset-bar").innerHTML = items.map(function(it,i){
      return '<button class="preset-btn'+(i===0?' active':'')+'" id="p-t'+i+'">'+it.t+'</button>';
    }).join("");
    items.forEach(function(_,i){
      document.getElementById("p-t"+i).onclick = function(){ setActivePreset(this); idx=i; App.resetTimeline(); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var it = items[idx];
    var quad = /²/.test(it.t) || it.k.indexOf("quadratic")>=0;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="70" fill="#e2e8f0" font-size="22" text-anchor="middle">'+it.t+'</text>';
    m += '<rect x="160" y="120" width="400" height="80" rx="12" fill="'+(quad?"#7c2d12":"#0f766e")+'"/>';
    m += '<text x="360" y="168" fill="#f8fafc" font-size="18" text-anchor="middle">'+it.k+'</text>';
    m += '<text x="360" y="250" fill="#94a3b8" font-size="13" text-anchor="middle">§5.2 (5)–(14): this reprint keeps only linear inequalities in one and two variables.</text>';
    svg.innerHTML = m;
    readout(cell("Expression", it.t) + cell("Class", it.k, quad?"#f59e0b":"#34d399"));
    verdict("<b>Definition 1:</b> two reals or algebraic expressions related by &lt;, &gt;, ≤, ≥ form an inequality. Slack = ≤ or ≥.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["reverse-rule"] = (function(){
  var k = -1;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>3 and 2</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>after × k</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-neg">k = −1 (reverse)</button>' +
      '<button class="preset-btn" id="p-neg2">k = −2 (NCERT 16 &gt; 14)</button>' +
      '<button class="preset-btn" id="p-pos">k = +2 (no reverse)</button>';
    document.getElementById("p-neg").onclick = function(){ setActivePreset(this); k=-1; App.resetTimeline(); };
    document.getElementById("p-neg2").onclick = function(){ setActivePreset(this); k=-2; App.resetTimeline(); };
    document.getElementById("p-pos").onclick = function(){ setActivePreset(this); k=2; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Multiplier k</span><span class="val" id="ctrl-k">'+k+'</span></div>' +
      '<input type="range" id="ctrl-k-range" min="-5" max="5" step="1" value="'+k+'"></div>';
    document.getElementById("ctrl-k-range").oninput = function(){ k = Number(this.value); if(k===0) k=1; draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var rng = document.getElementById("ctrl-k-range");
    if(rng) k = Number(rng.value) || k;
    var kk = document.getElementById("ctrl-k"); if(kk) kk.textContent = String(k);
    var a = 3, b = 2;
    if(k === -2){ a = -8; b = -7; }
    var a2 = a * k, b2 = b * k;
    var left = a < b;
    var left2 = a2 < b2;
    var reversed = (k < 0);
    var y = 160;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Rule 2: multiply '+a+' ? '+b+' by k = '+k+'</text>';
    m = numLine(m, y, -20, 20, undefined, undefined, undefined, undefined, undefined);
    m += '<circle cx="'+(60+(a+20)/40*600)+'" cy="'+y+'" r="7" fill="#38bdf8"/>';
    m += '<circle cx="'+(60+(b+20)/40*600)+'" cy="'+y+'" r="7" fill="#e2e8f0"/>';
    var u = Math.min(1, t/3);
    var ax = a + (a2-a)*u, bx = b + (b2-b)*u;
    m += '<circle cx="'+(60+(ax+20)/40*600)+'" cy="'+(y-40)+'" r="8" fill="#f59e0b"/>';
    m += '<circle cx="'+(60+(bx+20)/40*600)+'" cy="'+(y-40)+'" r="8" fill="#34d399"/>';
    svg.innerHTML = m;
    readout(cell("start", a+" < "+b+" ? "+left) + cell("after × k", a2+" vs "+b2+" : "+a2+(left2?" < ":" > ")+b2) + cell("reversed?", reversed?"YES":"NO", reversed?"#f59e0b":"#34d399"));
    verdict("<b>Rule 2:</b> k &gt; 0 keeps the sign; k &lt; 0 reverses it. NCERT check: −8 &lt; −7 but (−8)(−2) = 16 &gt; 14 = (−7)(−2).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["algebra-lab"] = (function(){
  var which = "e2";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Solution ray</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Test x</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-e2">Ex 2: x &lt; 2</button>' +
      '<button class="preset-btn" id="p-e3">Ex 3: x &gt; −2</button>' +
      '<button class="preset-btn" id="p-e4">Ex 4: x ≥ 8</button>';
    document.getElementById("p-e2").onclick = function(){ setActivePreset(this); which="e2"; App.resetTimeline(); };
    document.getElementById("p-e3").onclick = function(){ setActivePreset(this); which="e3"; App.resetTimeline(); };
    document.getElementById("p-e4").onclick = function(){ setActivePreset(this); which="e4"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Probe x</span><span class="val" id="ctrl-x">0</span></div>' +
      '<input type="range" id="ctrl-x-range" min="-6" max="12" step="0.5" value="0"></div>';
    document.getElementById("ctrl-x-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function spec(){
    if(which==="e2") return {title:"5x − 3 < 3x + 1  ⇒  x < 2", xmin:-6, xmax:8, open:2, closed:undefined, left:2, right:undefined, test:function(x){return x<2;}};
    if(which==="e3") return {title:"4x + 3 < 6x + 7  ⇒  x > −2", xmin:-8, xmax:6, open:-2, closed:undefined, left:undefined, right:-2, test:function(x){return x>-2;}};
    return {title:"(5−2x)/3 ≤ x/6 − 5  ⇒  x ≥ 8", xmin:0, xmax:14, open:undefined, closed:8, left:undefined, right:8, test:function(x){return x>=8;}};
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var p = spec();
    var xr = document.getElementById("ctrl-x-range");
    var x = xr ? Number(xr.value) : 0;
    var lab = document.getElementById("ctrl-x"); if(lab) lab.textContent = x.toFixed(1);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">'+p.title+'</text>';
    m = numLine(m, 160, p.xmin, p.xmax, p.open, p.closed, p.left, p.right, x);
    var ok = p.test(x);
    svg.innerHTML = m;
    readout(cell("probe x", x.toFixed(1)) + cell("true?", ok?"YES":"NO", ok?"#34d399":"#f87171"));
    verdict("<b>Zoom-checked.</b> Example 4 (p.5): multiply by 6, 2(5−2x) ≤ x−30, −5x ≤ −40, reverse, x ≥ 8 so [8, ∞).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["numberline-graph"] = (function(){
  var fig = "51";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Open circle (strict)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Dark circle (slack)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-51">Fig 5.1 · x &lt; 3</button>' +
      '<button class="preset-btn" id="p-52">Fig 5.2 · x ≥ 1</button>' +
      '<button class="preset-btn" id="p-53">Fig 5.3 · 2 ≤ x &lt; 6</button>';
    document.getElementById("p-51").onclick = function(){ setActivePreset(this); fig="51"; App.resetTimeline(); };
    document.getElementById("p-52").onclick = function(){ setActivePreset(this); fig="52"; App.resetTimeline(); };
    document.getElementById("p-53").onclick = function(){ setActivePreset(this); fig="53"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var glow = 4 + 2*Math.sin(t);
    if(fig==="51"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Fig 5.1 · Example 5 · 7x+3 &lt; 5x+9 ⇒ x &lt; 3</text>';
      m = numLine(m, 160, -4, 6, 3, undefined, 3, undefined, undefined);
      verdict("<b>Open circle at 3:</b> 7·3+3 = 24 = 5·3+9, so 24 &lt; 24 is false. 3 is not a solution.");
      readout(cell("endpoint","3 open") + cell("ray","left, −∞") + cell("x=3 in set?","NO","#f87171"));
    } else if(fig==="52"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Fig 5.2 · Example 6 · (3x−4)/2 ≥ (x+1)/4 − 1 ⇒ x ≥ 1</text>';
      m = numLine(m, 160, -4, 6, undefined, 1, undefined, 1, undefined);
      verdict("<b>Dark circle at 1:</b> slack ≥ includes the endpoint. 2(3·1−4) = −2 and 1−3 = −2.");
      readout(cell("endpoint","1 dark") + cell("ray","right, +∞") + cell("x=1 in set?","YES","#34d399"));
    } else {
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Fig 5.3 · Example 11 · x &lt; 6 and x ≥ 2 ⇒ 2 ≤ x &lt; 6</text>';
      var X = function(v){ return 60 + (v+4)/12*600; };
      m += '<line x1="40" y1="160" x2="680" y2="160" stroke="#64748b" stroke-width="3"/>';
      for(var v=-4; v<=8; v++){
        m += '<line x1="'+X(v)+'" y1="152" x2="'+X(v)+'" y2="168" stroke="#94a3b8"/>';
        m += '<text x="'+X(v)+'" y="184" fill="#94a3b8" font-size="12" text-anchor="middle">'+v+'</text>';
      }
      m += '<line x1="'+X(2)+'" y1="160" x2="'+X(6)+'" y2="160" stroke="#38bdf8" stroke-width="'+glow+'"/>';
      m += '<circle cx="'+X(2)+'" cy="160" r="8" fill="#34d399"/>';
      m += '<circle cx="'+X(6)+'" cy="160" r="8" fill="#09131d" stroke="#f59e0b" stroke-width="3"/>';
      verdict("<b>Intersection of two rays:</b> include 2 (from 11−5x ≤ 1), exclude 6 (from 3x−7 &lt; 5+x).");
      readout(cell("left","2 included") + cell("right","6 excluded") + cell("set","[2, 6)"));
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["marks-upi"] = (function(){
  var mode = "ex7";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Average</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Target</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-e7">Ex 7: 62, 48, avg ≥ 60</button>' +
      '<button class="preset-btn" id="p-sun">Sunita Grade A ≥ 90</button>' +
      '<button class="preset-btn" id="p-odd">Ex 8 consecutive odds</button>';
    document.getElementById("p-e7").onclick = function(){ setActivePreset(this); mode="ex7"; App.resetTimeline(); };
    document.getElementById("p-sun").onclick = function(){ setActivePreset(this); mode="sun"; App.resetTimeline(); };
    document.getElementById("p-odd").onclick = function(){ setActivePreset(this); mode="odd"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>x (marks / smaller odd)</span><span class="val" id="ctrl-m">70</span></div>' +
      '<input type="range" id="ctrl-m-range" min="0" max="100" step="1" value="70"></div>';
    document.getElementById("ctrl-m-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var xr = document.getElementById("ctrl-m-range");
    var x = xr ? Number(xr.value) : 70;
    var lab = document.getElementById("ctrl-m"); if(lab) lab.textContent = String(x);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="ex7"){
      var avg = (62+48+x)/3;
      var ok = avg >= 60;
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Example 7 · (62+48+x)/3 ≥ 60  ⇒  x ≥ 70</text>';
      m += '<rect x="60" y="90" width="600" height="36" rx="8" fill="#1e293b"/>';
      m += '<rect x="60" y="90" width="'+Math.min(600, avg/100*600)+'" height="36" rx="8" fill="'+(ok?"#34d399":"#f87171")+'"/>';
      m += '<line x1="'+(60+0.6*600)+'" y1="86" x2="'+(60+0.6*600)+'" y2="130" stroke="#f59e0b" stroke-width="3"/>';
      m += '<text x="360" y="180" fill="#e2e8f0" font-size="18" text-anchor="middle">average = '+avg.toFixed(2)+'</text>';
      readout(cell("annual x", String(x)) + cell("average", avg.toFixed(2)) + cell("≥ 60", ok?"YES":"NO", ok?"#34d399":"#f87171"));
      verdict("<b>x ≥ 70.</b> Same algebra as Ravi’s unit tests (Q21: x ≥ 35) and Sunita’s Grade A (Q22: x ≥ 82).");
    } else if(mode==="sun"){
      var avg = (87+92+94+95+x)/5;
      var ok = avg >= 90;
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Ex 5.1 Q22 · Sunita 87,92,94,95 · fifth x · avg ≥ 90</text>';
      m += '<rect x="60" y="100" width="600" height="36" rx="8" fill="#1e293b"/>';
      m += '<rect x="60" y="100" width="'+Math.min(600, avg/100*600)+'" height="36" rx="8" fill="'+(ok?"#34d399":"#f87171")+'"/>';
      m += '<text x="360" y="190" fill="#e2e8f0" font-size="18" text-anchor="middle">average = '+avg.toFixed(2)+' · need x ≥ 82</text>';
      readout(cell("fifth", String(x)) + cell("sum", String(368+x)) + cell("avg ≥ 90", ok?"YES":"NO", ok?"#34d399":"#f87171"));
      verdict("<b>368 + x ≥ 450 ⇒ x ≥ 82.</b> Out of 100, so 82 is feasible.");
    } else {
      var pairs = [[11,13],[13,15],[15,17],[17,19]];
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Example 8 · consecutive odd naturals &gt; 10, sum &lt; 40</text>';
      pairs.forEach(function(pr,i){
        var on = pr[0] <= x;
        m += '<rect x="'+(40+i*170)+'" y="90" width="150" height="90" rx="10" fill="'+(on?"#0f766e":"#1e293b")+'" stroke="#38bdf8"/>';
        m += '<text x="'+(115+i*170)+'" y="145" fill="#f8fafc" font-size="16" text-anchor="middle">('+pr[0]+', '+pr[1]+')</text>';
      });
      readout(cell("10 < x < 19, x odd","11,13,15,17") + cell("pairs","4"));
      verdict("<b>(11,13), (13,15), (15,17), (17,19).</b> 19 as the larger is allowed; 19 as the smaller would give sum 40, not &lt; 40.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["double-ineq"] = (function(){
  var which = "e9";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Feasible overlap</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-e9">Ex 9: −1 ≤ x &lt; 2</button>' +
      '<button class="preset-btn" id="p-e10">Ex 10: −11/3 ≤ x ≤ 5</button>' +
      '<button class="preset-btn" id="p-e11">Ex 11: 2 ≤ x &lt; 6</button>';
    document.getElementById("p-e9").onclick = function(){ setActivePreset(this); which="e9"; App.resetTimeline(); };
    document.getElementById("p-e10").onclick = function(){ setActivePreset(this); which="e10"; App.resetTimeline(); };
    document.getElementById("p-e11").onclick = function(){ setActivePreset(this); which="e11"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>probe x</span><span class="val" id="ctrl-d">0</span></div>' +
      '<input type="range" id="ctrl-d-range" min="-6" max="8" step="0.1" value="0"></div>';
    document.getElementById("ctrl-d-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var xr = document.getElementById("ctrl-d-range");
    var x = xr ? Number(xr.value) : 0;
    var lab = document.getElementById("ctrl-d"); if(lab) lab.textContent = x.toFixed(1);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var lo, hi, loc, hic, title, ok;
    if(which==="e9"){ lo=-1; hi=2; loc=true; hic=false; title="−8 ≤ 5x−3 &lt; 7  ⇒  −1 ≤ x &lt; 2"; ok = x>=-1 && x<2; }
    else if(which==="e10"){ lo=-11/3; hi=5; loc=true; hic=true; title="−5 ≤ (5−3x)/2 ≤ 8  ⇒  −11/3 ≤ x ≤ 5"; ok = x>=-11/3 && x<=5; }
    else { lo=2; hi=6; loc=true; hic=false; title="x&lt;6 and x≥2  ⇒  2 ≤ x &lt; 6"; ok = x>=2 && x<6; }
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">'+title+'</text>';
    var X = function(v){ return 60 + (v+6)/14*600; };
    m += '<line x1="40" y1="160" x2="680" y2="160" stroke="#64748b" stroke-width="3"/>';
    for(var v=-6; v<=8; v++){
      m += '<line x1="'+X(v)+'" y1="152" x2="'+X(v)+'" y2="168" stroke="#94a3b8"/>';
      m += '<text x="'+X(v)+'" y="184" fill="#94a3b8" font-size="11" text-anchor="middle">'+v+'</text>';
    }
    m += '<line x1="'+X(lo)+'" y1="160" x2="'+X(hi)+'" y2="160" stroke="#38bdf8" stroke-width="6"/>';
    m += '<circle cx="'+X(lo)+'" cy="160" r="8" fill="'+(loc?"#34d399":"#09131d")+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<circle cx="'+X(hi)+'" cy="160" r="8" fill="'+(hic?"#34d399":"#09131d")+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<circle cx="'+X(x)+'" cy="120" r="6" fill="#f8fafc"/>';
    svg.innerHTML = m;
    readout(cell("x", x.toFixed(2)) + cell("in solution?", ok?"YES":"NO", ok?"#34d399":"#f87171") + cell("interval", (loc?"[":"(")+lo.toFixed(2)+", "+hi.toFixed(2)+(hic?"]":")")));
    verdict("<b>Operate on all three members.</b> A negative middle coefficient (Example 10, −3x) reverses both ends of the chain.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["mixture-temp"] = (function(){
  var mode = "acid";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Resulting %</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Allowed band</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ac">Ex 13 · 12% + 30%</button>' +
      '<button class="preset-btn" id="p-cf">Ex 12 · 30&lt;C&lt;35 → F</button>' +
      '<button class="preset-btn" id="p-iq">Misc 14 · IQ band</button>';
    document.getElementById("p-ac").onclick = function(){ setActivePreset(this); mode="acid"; App.resetTimeline(); };
    document.getElementById("p-cf").onclick = function(){ setActivePreset(this); mode="cf"; App.resetTimeline(); };
    document.getElementById("p-iq").onclick = function(){ setActivePreset(this); mode="iq"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>x (L or MA or C)</span><span class="val" id="ctrl-mix">180</span></div>' +
      '<input type="range" id="ctrl-mix-range" min="0" max="400" step="1" value="180"></div>';
    document.getElementById("ctrl-mix-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var xr = document.getElementById("ctrl-mix-range");
    var x = xr ? Number(xr.value) : 180;
    var lab = document.getElementById("ctrl-mix"); if(lab) lab.textContent = String(x);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="acid"){
      var acid = 0.30*x + 0.12*600;
      var tot = x + 600;
      var pct = 100*acid/tot;
      var ok = pct > 15 && pct < 18;
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Example 13 · 600 L of 12% + x L of 30% · want 15%–18%</text>';
      m += '<rect x="80" y="80" width="120" height="160" fill="#1e293b" stroke="#64748b"/>';
      m += '<rect x="80" y="'+(240-160*0.12)+'" width="120" height="'+(160*0.12)+'" fill="#38bdf8" opacity="0.8"/>';
      m += '<text x="140" y="70" fill="#94a3b8" font-size="12" text-anchor="middle">600 L · 12%</text>';
      var h = Math.min(160, x/4);
      m += '<rect x="260" y="'+(240-h)+'" width="80" height="'+h+'" fill="#f59e0b" opacity="0.85"/>';
      m += '<text x="300" y="70" fill="#94a3b8" font-size="12" text-anchor="middle">x L · 30%</text>';
      m += '<rect x="420" y="80" width="200" height="160" fill="#1e293b" stroke="#34d399"/>';
      m += '<rect x="420" y="'+(240-160*pct/40)+'" width="200" height="'+(160*pct/40)+'" fill="'+(ok?"#34d399":"#f87171")+'" opacity="0.85"/>';
      m += '<text x="520" y="70" fill="#94a3b8" font-size="12" text-anchor="middle">mix '+pct.toFixed(2)+'%</text>';
      readout(cell("x L", String(x)) + cell("% acid", pct.toFixed(2)+"%") + cell("15 < % < 18", ok?"YES":"NO", ok?"#34d399":"#f87171"));
      verdict("<b>120 &lt; x &lt; 300.</b> 30x+7200 &gt; 15x+9000 and 30x+7200 &lt; 18x+10800 (zoom p.10).");
    } else if(mode==="cf"){
      var C = Math.min(50, x/8);
      var F = 9/5*C + 32;
      var ok = C>30 && C<35;
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Example 12 · C = (5/9)(F−32) · 30 &lt; C &lt; 35  ⇒  86 &lt; F &lt; 95</text>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="22" text-anchor="middle">C = '+C.toFixed(1)+' °C</text>';
      m += '<text x="360" y="180" fill="#38bdf8" font-size="22" text-anchor="middle">F = '+F.toFixed(1)+' °F</text>';
      readout(cell("C", C.toFixed(1)+" °C") + cell("F", F.toFixed(1)+" °F") + cell("in window", ok?"YES":"NO", ok?"#34d399":"#f87171"));
      verdict("<b>30 °C = 86 °F, 35 °C = 95 °F.</b> Strict inequalities stay strict because F(C) is increasing.");
    } else {
      var MA = x/20;
      var IQ = (MA/12)*100;
      var ok = IQ>=80 && IQ<=140;
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Misc. Q14 · IQ = (MA/CA)×100 · CA = 12 · 80 ≤ IQ ≤ 140</text>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="22" text-anchor="middle">MA = '+MA.toFixed(2)+' yr</text>';
      m += '<text x="360" y="180" fill="#38bdf8" font-size="22" text-anchor="middle">IQ = '+IQ.toFixed(1)+'</text>';
      readout(cell("MA", MA.toFixed(2)) + cell("IQ", IQ.toFixed(1)) + cell("80–140", ok?"YES":"NO", ok?"#34d399":"#f87171"));
      verdict("<b>9.6 ≤ MA ≤ 16.8 years.</b> Multiply the IQ band by CA/100 = 0.12.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
