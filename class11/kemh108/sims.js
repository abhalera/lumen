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

window.SIMS["ancestor-tree"] = (function(){
  function mount(){
    App.state.maxT = 10;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 10;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>2ⁿ ancestors in generation n</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-an">10 generations</button>' +
      '<button class="preset-btn" id="p-fi">Fibonacci</button>';
    var mode="an";
    document.getElementById("p-an").onclick = function(){ setActivePreset(this); mode="an"; App.resetTimeline(); App.play(); };
    document.getElementById("p-fi").onclick = function(){ setActivePreset(this); mode="fi"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    window._anc = function(){ return mode; };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var mode=(window._anc&&window._anc())||"an";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="an"){
      var n=Math.max(1, Math.min(10, Math.floor(t)+1));
      var val=1<<n;
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">§8.1 · 300 years / 30 = 10 generations · aₙ = 2ⁿ</text>';
      for(var i=1;i<=n;i++){
        var w=Math.min(600, (1<<i)*8);
        m += '<rect x="'+(360-w/2)+'" y="'+(40+i*22)+'" width="'+w+'" height="18" rx="3" fill="#38bdf8" opacity="'+(0.3+0.07*i)+'"/>';
      }
      readout(cell("generation n", String(n)) + cell("ancestors", String(val)) + cell("a₁₀","1024"));
      verdict("<b>a₁₀=1024.</b> Summing them is Example 11: S₁₀=2(2¹⁰−1)=2046, not 2048.");
    } else {
      var F=[1,1,2,3,5,8,13,21,34,55];
      var k=Math.min(9, Math.floor(t));
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Fibonacci · a₁=a₂=1, aₙ=aₙ₋₁+aₙ₋₂</text>';
      F.forEach(function(v,i){
        m += '<rect x="'+(20+i*70)+'" y="'+(160-v)+'" width="50" height="'+Math.min(140,v*3)+'" fill="'+(i===k?"#f59e0b":"#1e293b")+'" stroke="#38bdf8"/>';
        m += '<text x="'+(45+i*70)+'" y="200" fill="#e2e8f0" font-size="12" text-anchor="middle">'+v+'</text>';
      });
      readout(cell("aₙ", String(F[k])) + cell("ratio aₙ₊₁/aₙ", k<9?(F[k+1]/F[k]).toFixed(3):"—"));
      verdict("<b>Ex 8.1 Q14 ratios:</b> 1, 2, 3/2, 5/3, 8/5. The primes, by contrast, have no formula for aₙ.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["series-sum"] = (function(){
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>odd numbers</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-odd">1+3+5+7 (sum 16)</button>' +
      '<button class="preset-btn" id="p-ex3">Example 3: 1+3+5+7+9</button>';
    var mode="odd";
    document.getElementById("p-odd").onclick = function(){ setActivePreset(this); mode="odd"; App.resetTimeline(); App.play(); };
    document.getElementById("p-ex3").onclick = function(){ setActivePreset(this); mode="ex3"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    window._ss = function(){ return mode; };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var mode=(window._ss&&window._ss())||"odd";
    var terms = mode==="odd"?[1,3,5,7]:[1,3,5,7,9];
    var k=Math.min(terms.length, Math.floor(t)+1);
    var sum=0; for(var i=0;i<k;i++) sum+=terms[i];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">The series is the indicated sum; the sum is the number</text>';
    var acc=0;
    for(var i=0;i<k;i++){
      m += '<rect x="'+(40+acc*12)+'" y="100" width="'+(terms[i]*12)+'" height="80" fill="#38bdf8" opacity="0.85" stroke="#e2e8f0"/>';
      m += '<text x="'+(40+acc*12+terms[i]*6)+'" y="148" fill="#0f172a" font-size="16" text-anchor="middle">'+terms[i]+'</text>';
      acc+=terms[i];
    }
    m += '<text x="360" y="230" fill="#34d399" font-size="18" text-anchor="middle">partial sum = '+sum+(k===4 && mode==="odd"?"  (full series sums to 16)":"")+'</text>';
    svg.innerHTML = m;
    readout(cell("terms shown", String(k)) + cell("sum", String(sum)) + cell("Σ notation", "Σ aₖ"));
    verdict("<b>§8.3 remark:</b> 1+3+5+7 is a four-term series; 16 is its sum — not itself a series.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["gp-terms"] = (function(){
  var a=5, r=5;
  function mount(){
    App.state.maxT = 10;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 10;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>aₙ = a rⁿ⁻¹</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p5">5, 25, 125, …</button>' +
      '<button class="preset-btn" id="p2">2, 8, 32, … → 131072</button>' +
      '<button class="preset-btn" id="p6">Example 6 → 3072</button>';
    document.getElementById("p5").onclick = function(){ setActivePreset(this); a=5;r=5; App.resetTimeline(); };
    document.getElementById("p2").onclick = function(){ setActivePreset(this); a=2;r=4; App.resetTimeline(); };
    document.getElementById("p6").onclick = function(){ setActivePreset(this); a=6;r=2; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>n</span><span class="val" id="gn">1</span></div>' +
      '<input type="range" id="gn-range" min="1" max="12" step="1" value="1"></div>';
    document.getElementById("gn-range").oninput = function(){ draw(); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var rg=document.getElementById("gn-range");
    var n=rg?Number(rg.value):1;
    var lb=document.getElementById("gn"); if(lb) lb.textContent=String(n);
    var an=a*Math.pow(r,n-1);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="50" fill="#94a3b8" font-size="16" text-anchor="middle">aₙ = a rⁿ⁻¹ = '+a+' · '+r+'<tspan baseline-shift="super" font-size="12">'+(n-1)+'</tspan></text>';
    m += '<text x="360" y="150" fill="#38bdf8" font-size="36" text-anchor="middle">a'+n+' = '+an.toLocaleString("en-IN")+'</text>';
    svg.innerHTML = m;
    readout(cell("a", String(a)) + cell("r", String(r)) + cell("aₙ", an.toLocaleString("en-IN")));
    verdict("<b>Example 4:</b> a₁₀=5¹⁰=9,765,625. <b>Example 5:</b> 131072 is the 9th term of 2,8,32,… <b>Example 6:</b> a₁₀=3072.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["gp-sum"] = (function(){
  var a=1, r=2/3;
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sₙ</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>infinite ceiling a/(1−r)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="pe7">Example 7 · r=2/3</button>' +
      '<button class="preset-btn" id="pe8">Example 8 · r=1/2, target 3069/512</button>';
    document.getElementById("pe7").onclick = function(){ setActivePreset(this); a=1;r=2/3; App.resetTimeline(); };
    document.getElementById("pe8").onclick = function(){ setActivePreset(this); a=3;r=0.5; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>n</span><span class="val" id="sn">5</span></div>' +
      '<input type="range" id="sn-range" min="1" max="12" step="1" value="5"></div>';
    document.getElementById("sn-range").oninput = function(){ draw(); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var rg=document.getElementById("sn-range");
    var n=rg?Number(rg.value):5;
    var lb=document.getElementById("sn"); if(lb) lb.textContent=String(n);
    var Sn = r===1 ? a*n : a*(1-Math.pow(r,n))/(1-r);
    var inf = r===1 ? Infinity : a/(1-r);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Sₙ = a(1−rⁿ)/(1−r)</text>';
    m += '<rect x="60" y="90" width="600" height="36" rx="8" fill="#1e293b"/>';
    m += '<rect x="60" y="90" width="'+Math.min(600, Sn/inf*600)+'" height="36" rx="8" fill="#38bdf8"/>';
    m += '<line x1="660" y1="86" x2="660" y2="130" stroke="#f59e0b" stroke-width="3"/>';
    m += '<text x="360" y="180" fill="#e2e8f0" font-size="20" text-anchor="middle">S'+n+' = '+Sn.toFixed(5)+'</text>';
    svg.innerHTML = m;
    readout(cell("Sₙ", Sn.toFixed(5)) + cell("a/(1−r)", inf.toFixed(3)) + cell("Example 7 S₅", "211/81 ≈ 2.605"));
    verdict(a===1
      ? "<b>Example 7, zoom p.7:</b> S₅=211/81. The ceiling is 3."
      : "<b>Example 8:</b> Sₙ=3069/512 when n=10. 2¹⁰=1024.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["sevens-series"] = (function(){
  function Sn(n){ return (7/9)*(10*(Math.pow(10,n)-1)/9 - n); }
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>7, 77, 777, …</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p7">Example 10 · sevens</button>' +
      '<button class="preset-btn" id="p11">Example 11 · 2046 ancestors</button>';
    var mode="sev";
    document.getElementById("p7").onclick = function(){ setActivePreset(this); mode="sev"; draw(); };
    document.getElementById("p11").onclick = function(){ setActivePreset(this); mode="anc"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>n</span><span class="val" id="vn">4</span></div>' +
      '<input type="range" id="vn-range" min="1" max="10" step="1" value="4"></div>';
    document.getElementById("vn-range").oninput = function(){ draw(); };
    window._sev = function(){ return mode; };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var rg=document.getElementById("vn-range");
    var n=rg?Number(rg.value):4;
    var lb=document.getElementById("vn"); if(lb) lb.textContent=String(n);
    var mode=(window._sev&&window._sev())||"sev";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="sev"){
      var term=0; for(var i=1;i<=n;i++) term=term*10+7;
      m += '<text x="360" y="50" fill="#94a3b8" font-size="14" text-anchor="middle">Sₙ = (7/9)[10(10ⁿ−1)/9 − n]</text>';
      m += '<text x="360" y="130" fill="#e2e8f0" font-size="22" text-anchor="middle">last term = '+term.toLocaleString("en-IN")+'</text>';
      m += '<text x="360" y="180" fill="#38bdf8" font-size="20" text-anchor="middle">Sₙ = '+Sn(n).toFixed(4)+'</text>';
      readout(cell("n", String(n)) + cell("Sₙ", Sn(n).toFixed(4)));
      verdict("<b>Not itself a G.P.</b> Factor 7/9 and recognise 9+99+999+… = Σ(10ᵏ−1).");
    } else {
      var S=2*(Math.pow(2,n)-1);
      m += '<text x="360" y="70" fill="#94a3b8" font-size="14" text-anchor="middle">Example 11 · a=2, r=2 · Sₙ=2(2ⁿ−1)</text>';
      m += '<text x="360" y="150" fill="#34d399" font-size="28" text-anchor="middle">S'+n+' = '+S.toLocaleString("en-IN")+'</text>';
      readout(cell("Sₙ", String(S)) + cell("S₁₀","2046"));
      verdict("<b>2046, not 2048.</b> 2+4+…+1024 = 2(1024−1)=2046. Yourself is generation 0, not counted.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["insert-gm"] = (function(){
  var sign=1;
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>inserted means</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="pp">r = +4 → 4, 16, 64</button>' +
      '<button class="preset-btn" id="pm">r = −4 → −4, 16, −64</button>';
    document.getElementById("pp").onclick = function(){ setActivePreset(this); sign=1; draw(); };
    document.getElementById("pm").onclick = function(){ setActivePreset(this); sign=-1; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var r=4*sign;
    var terms=[1, r, r*r, r*r*r, 256];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Example 12 · 256 = r⁴ · r = ±4</text>';
    terms.forEach(function(v,i){
      m += '<rect x="'+(40+i*136)+'" y="100" width="120" height="90" rx="10" fill="#0f766e" stroke="#38bdf8"/>';
      m += '<text x="'+(100+i*136)+'" y="155" fill="#f8fafc" font-size="18" text-anchor="middle">'+v+'</text>';
    });
    svg.innerHTML = m;
    readout(cell("r", String(r)) + cell("G₁", String(terms[1])) + cell("G₂", String(terms[2])) + cell("G₃", String(terms[3])));
    verdict("<b>G.M. of two positives is +√(ab).</b> Negative r is still a real G.P. when n is odd so that r^{n+1}>0.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["am-gm-compare"] = (function(){
  var a=4, b=16;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A.M.</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>G.M.</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="pe13">Example 13 · 4 and 16</button>' +
      '<button class="preset-btn" id="peq">a=b=9 · equality</button>';
    document.getElementById("pe13").onclick = function(){ setActivePreset(this); a=4;b=16; draw(); };
    document.getElementById("peq").onclick = function(){ setActivePreset(this); a=9;b=9; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>a</span><span class="val" id="aa">4</span></div>' +
      '<input type="range" id="aa-range" min="1" max="25" step="0.5" value="4"></div>' +
      '<div class="control-item"><div class="control-label"><span>b</span><span class="val" id="bb">16</span></div>' +
      '<input type="range" id="bb-range" min="1" max="25" step="0.5" value="16"></div>';
    document.getElementById("aa-range").oninput = function(){ a=Number(this.value); draw(); };
    document.getElementById("bb-range").oninput = function(){ b=Number(this.value); draw(); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var ar=document.getElementById("aa-range"); if(ar) a=Number(ar.value);
    var br=document.getElementById("bb-range"); if(br) b=Number(br.value);
    var la=document.getElementById("aa"); if(la) la.textContent=a.toFixed(1);
    var lb=document.getElementById("bb"); if(lb) lb.textContent=b.toFixed(1);
    var A=(a+b)/2, G=Math.sqrt(a*b);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">A − G = (√a − √b)² / 2 ≥ 0</text>';
    function bar(y, val, color, label){
      return '<text x="50" y="'+(y+18)+'" fill="#94a3b8" font-size="12">'+label+'</text>' +
        '<rect x="100" y="'+y+'" width="'+(val*20)+'" height="28" rx="6" fill="'+color+'"/>' +
        '<text x="'+(110+val*20)+'" y="'+(y+20)+'" fill="#e2e8f0" font-size="14">'+val.toFixed(2)+'</text>';
    }
    m += bar(80, A, "#38bdf8", "A.M.");
    m += bar(140, G, "#34d399", "G.M.");
    m += '<text x="360" y="230" fill="#f8fafc" font-size="14" text-anchor="middle">A − G = '+(A-G).toFixed(3)+'</text>';
    svg.innerHTML = m;
    readout(cell("A", A.toFixed(3)) + cell("G", G.toFixed(3)) + cell("A≥G", A>=G-1e-9?"YES":"NO", "#34d399"));
    verdict("<b>Example 13:</b> A=10, G=8 recover 4 and 16. Equality iff a=b. This is why CAGR (geometric) beats a naive average of returns.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["fd-compound"] = (function(){
  function mount(){
    App.state.maxT = 10;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 10;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>compound 10%</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>depreciation 20%</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="pfd">₹500 @ 10% for 10 yr</button>' +
      '<button class="preset-btn" id="pdep">₹15625 · (0.8)⁵</button>';
    var mode="fd";
    document.getElementById("pfd").onclick = function(){ setActivePreset(this); mode="fd"; App.resetTimeline(); App.play(); };
    document.getElementById("pdep").onclick = function(){ setActivePreset(this); mode="dep"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    window._fd = function(){ return mode; };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var mode=(window._fd&&window._fd())||"fd";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="fd"){
      var n=Math.max(0, Math.min(10, Math.floor(t)));
      var A=500*Math.pow(1.1,n);
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Ex 8.2 Q31 · 500(1.1)ⁿ</text>';
      m += '<rect x="80" y="'+(220-A/12)+'" width="120" height="'+(A/12)+'" fill="#38bdf8"/>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="22" text-anchor="middle">year '+n+' · ₹ '+A.toFixed(2)+'</text>';
      readout(cell("n", String(n)) + cell("amount", "₹ "+A.toFixed(2)) + cell("n=10", "500(1.1)¹⁰"));
      verdict("<b>Geometric, not arithmetic.</b> Adding 10% of the original each year would be simple interest (Misc. Q16).");
    } else {
      var n=Math.max(0, Math.min(5, Math.floor(t)));
      var A=15625*Math.pow(0.8,n);
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Misc. Q17 · 15625 · (4/5)ⁿ</text>';
      m += '<text x="360" y="140" fill="#f59e0b" font-size="24" text-anchor="middle">after '+n+' yr · ₹ '+A.toFixed(0)+'</text>';
      m += '<text x="360" y="190" fill="#94a3b8" font-size="14" text-anchor="middle">n=5 → ₹ 5,120  (not zero: 5×20% ≠ 100%)</text>';
      readout(cell("value", "₹ "+A.toFixed(0)) + cell("(4/5)⁵","0.32768") + cell("5·4⁵","5120"));
      verdict("<b>15625·(4/5)⁵ = 5·1024 = 5120.</b> Geometric depreciation refuses to hit zero in finite time.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
