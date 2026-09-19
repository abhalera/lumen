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
function C(n,r){ if(r<0||r>n) return 0; r=Math.min(r,n-r); var p=1; for(var i=1;i<=r;i++) p=p*(n-r+i)/i; return Math.round(p); }

window.SIMS["pascal-triangle"] = (function(){
  var N=5;
  function row(n){ var a=[1]; for(var k=0;k<n;k++) a.push(a[k]*(n-k)/(k+1)); return a.map(Math.round); }
  function mount(){
    App.state.maxT = 7;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 7;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>ⁿCᵣ</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Pingala / Pascal</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p5" id="p5">Row 5 · (2x+3y)⁵</button>' +
      '<button class="preset-btn" data-preset="p7" id="p7">Row 7</button>' +
      '<button class="preset-btn" data-preset="p4" id="p4">Row 4</button>';
    document.getElementById("p5").onclick = function(){ setActivePreset(this); N=5; draw(); };
    document.getElementById("p7").onclick = function(){ setActivePreset(this); N=7; draw(); };
    document.getElementById("p4").onclick = function(){ setActivePreset(this); N=4; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>index n</span><span class="val" id="cn">5</span></div>' +
      '<input type="range" id="cn-range" min="0" max="8" step="1" value="5"></div>';
    document.getElementById("cn-range").oninput = function(){ N=Number(this.value); draw(); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var rg=document.getElementById("cn-range"); if(rg) N=Number(rg.value);
    var lb=document.getElementById("cn"); if(lb) lb.textContent=String(N);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Meru-Prastara / Pascal · each entry is the sum of the two above it</text>';
    for(var n=0;n<=N;n++){
      var r = row(n);
      var y = 50 + n*28;
      r.forEach(function(v,i){
        var x = 360 - (r.length-1)*18 + i*36;
        m += '<rect x="'+(x-14)+'" y="'+(y-12)+'" width="28" height="22" rx="4" fill="'+(n===N?"#0f766e":"#1e293b")+'" stroke="#38bdf8"/>';
        m += '<text x="'+x+'" y="'+(y+4)+'" fill="#f8fafc" font-size="11" text-anchor="middle">'+v+'</text>';
      });
    }
    svg.innerHTML = m;
    readout(cell("row n", String(N)) + cell("entries", row(N).join(" ")) + cell("n+1 terms", String(N+1)));
    verdict(N===5
      ? "<b>(2x+3y)⁵</b> uses 1 5 10 10 5 1 → 32x⁵ + 240x⁴y + 720x³y² + 1080x²y³ + 810xy⁴ + 243y⁵ (zoom p.2)."
      : "<b>Fig 7.3:</b> rewrite the row as ⁿC₀ … ⁿCₙ. That is why we do not write twelve rows to expand (2x+3y)¹².");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["expand-terms"] = (function(){
  var k=0;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>T<sub>k+1</sub> = ⁶Cₖ x⁶⁻ᵏ 2ᵏ</span></div>';
    document.getElementById("preset-bar").innerHTML =
      [0,1,2,3,4,5,6].map(function(i){ return '<button class="preset-btn'+(i===0?' active':'')+'" data-preset="pk'+i+'" id="pk'+i+'">T'+(i+1)+'</button>'; }).join("");
    [0,1,2,3,4,5,6].forEach(function(i){
      document.getElementById("pk"+i).onclick = function(){ setActivePreset(this); k=i; draw(); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var coeff = C(6,k)*Math.pow(2,k);
    var pow = 6-k;
    var terms=["x⁶","12x⁵","60x⁴","160x³","240x²","192x","64"];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">(x+2)⁶ · zoom p.4</text>';
    terms.forEach(function(t,i){
      m += '<rect x="'+(16+i*100)+'" y="90" width="92" height="70" rx="8" fill="'+(i===k?"#0f766e":"#1e293b")+'" stroke="#38bdf8"/>';
      m += '<text x="'+(62+i*100)+'" y="132" fill="#f8fafc" font-size="13" text-anchor="middle">'+t+'</text>';
    });
    m += '<text x="360" y="210" fill="#38bdf8" font-size="18" text-anchor="middle">T'+(k+1)+' = ⁶C'+k+' · x^'+pow+' · 2^'+k+' = '+coeff+(pow?(" x^"+pow):"")+'</text>';
    svg.innerHTML = m;
    readout(cell("k", String(k)) + cell("⁶Cₖ", String(C(6,k))) + cell("2ᵏ", String(Math.pow(2,k))) + cell("coeff", String(coeff)));
    verdict("<b>(x+2)⁶ = x⁶ + 12x⁵ + 60x⁴ + 160x³ + 240x² + 192x + 64.</b> The induction proof multiplies by (a+b) and uses Pascal’s identity.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["one-plus-x"] = (function(){
  var n=5, x=1;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Σ ⁿCₖ xᵏ</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p1" id="p1">x = 1 → 2ⁿ</button>' +
      '<button class="preset-btn" data-preset="pm" id="pm">x = −1 → 0</button>' +
      '<button class="preset-btn" data-preset="pxy" id="pxy">(x−2y)⁵</button>';
    var mode="one";
    document.getElementById("p1").onclick = function(){ setActivePreset(this); mode="one"; x=1; draw(); };
    document.getElementById("pm").onclick = function(){ setActivePreset(this); mode="alt"; x=-1; draw(); };
    document.getElementById("pxy").onclick = function(){ setActivePreset(this); mode="xy"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>n</span><span class="val" id="nn">5</span></div>' +
      '<input type="range" id="nn-range" min="1" max="8" step="1" value="5"></div>';
    document.getElementById("nn-range").oninput = function(){ n=Number(this.value); draw(); };
    window._opx = function(){ return mode; };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var rg=document.getElementById("nn-range"); if(rg) n=Number(rg.value);
    var lb=document.getElementById("nn"); if(lb) lb.textContent=String(n);
    var mode=(window._opx&&window._opx())||"one";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="xy"){
      m += '<text x="360" y="80" fill="#94a3b8" font-size="14" text-anchor="middle">(x−2y)⁵ = x⁵ − 10x⁴y + 40x³y² − 80x²y³ + 80xy⁴ − 32y⁵</text>';
      m += '<text x="360" y="160" fill="#e2e8f0" font-size="16" text-anchor="middle">signs +, −, +, −, +, −  because b = −2y</text>';
      readout(cell("(x−2y)⁵","alternating") + cell("last","−32y⁵"));
      verdict("<b>§7.2.2 (i).</b> Each (−y)ᵏ contributes (−1)ᵏ.");
    } else {
      var s=0, parts=[];
      for(var k=0;k<=n;k++){ var t=C(n,k)*Math.pow(mode==="alt"?-1:1,k); s+=t; parts.push((t>=0?"+":"")+t); }
      m += '<text x="360" y="70" fill="#94a3b8" font-size="14" text-anchor="middle">(1 + x)ⁿ at x = '+(mode==="alt"?-1:1)+'</text>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="16" text-anchor="middle">'+parts.join(" ")+' = '+s+'</text>';
      m += '<text x="360" y="200" fill="#38bdf8" font-size="18" text-anchor="middle">'+(mode==="alt"?"Σ (−1)ᵏ ⁿCₖ = 0":"Σ ⁿCₖ = 2ⁿ = "+Math.pow(2,n))+'</text>';
      readout(cell("n", String(n)) + cell("sum", String(s)) + cell("identity", mode==="alt"?"0":"2^n"));
      verdict(mode==="alt"
        ? "<b>(1−1)ⁿ = 0ⁿ = 0</b> for n≥1: even-sized and odd-sized subsets are equally many."
        : "<b>(1+1)ⁿ = 2ⁿ</b> counts all subsets of an n-set, including empty and full.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["x2-plus-3x"] = (function(){
  var r=0;
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>T<sub>r+1</sub></span></div>';
    document.getElementById("preset-bar").innerHTML =
      [0,1,2,3,4].map(function(i){ return '<button class="preset-btn'+(i===0?' active':'')+'" data-preset="tr'+i+'" id="tr'+i+'">T'+(i+1)+'</button>'; }).join("");
    [0,1,2,3,4].forEach(function(i){
      document.getElementById("tr"+i).onclick = function(){ setActivePreset(this); r=i; draw(); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var terms=["x⁸","12x⁵","54x²","108/x","81/x⁴"];
    var exp=[8,5,2,-1,-4];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Example 1 · (x² + 3/x)⁴ · exponent 8 − 3r</text>';
    terms.forEach(function(t,i){
      m += '<rect x="'+(30+i*138)+'" y="80" width="128" height="80" rx="10" fill="'+(i===r?"#0f766e":"#1e293b")+'" stroke="#38bdf8"/>';
      m += '<text x="'+(94+i*138)+'" y="128" fill="#f8fafc" font-size="16" text-anchor="middle">'+t+'</text>';
    });
    m += '<text x="360" y="210" fill="#e2e8f0" font-size="16" text-anchor="middle">exponent of x = 2(4−r) + (−1)r = 8 − 3r = '+exp[r]+'</text>';
    svg.innerHTML = m;
    readout(cell("r", String(r)) + cell("⁴Cᵣ", String(C(4,r))) + cell("power of x", String(exp[r])));
    verdict("<b>Zoom p.6:</b> x⁸ + 12x⁵ + 54x² + 108/x + 81/x⁴. No x⁰ term — the exponent steps by −3.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["ninety-eight"] = (function(){
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>(100−2)⁵ terms</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p98" id="p98">(98)⁵</button>' +
      '<button class="preset-btn" data-preset="p101" id="p101">(101)⁴</button>' +
      '<button class="preset-btn" data-preset="p101m" id="p101m">(1.01)¹⁰⁰⁰⁰⁰⁰ vs 10000</button>';
    var mode="98";
    document.getElementById("p98").onclick = function(){ setActivePreset(this); mode="98"; draw(); };
    document.getElementById("p101").onclick = function(){ setActivePreset(this); mode="101"; draw(); };
    document.getElementById("p101m").onclick = function(){ setActivePreset(this); mode="big"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    window._n98 = function(){ return mode; };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var mode=(window._n98&&window._n98())||"98";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="98"){
      var terms=[10000000000, -1000000000, 40000000, -800000, 8000, -32];
      var show=Math.min(6, Math.floor(t)+1);
      var acc=0;
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Example 2 · (100−2)⁵ · zoom p.6</text>';
      for(var i=0;i<show;i++){
        acc+=terms[i];
        m += '<text x="360" y="'+(70+i*28)+'" fill="'+(terms[i]>0?"#34d399":"#f87171")+'" font-size="14" text-anchor="middle">'+(terms[i]>0?"+":"")+terms[i].toLocaleString("en-IN")+'</text>';
      }
      readout(cell("partial", acc.toLocaleString("en-IN")) + cell("full (98)⁵", "9,039,207,968"));
      verdict("<b>10,040,008,000 − 1,000,800,032 = 9,039,207,968.</b> Group pluses, then minuses.");
    } else if(mode==="101"){
      m += '<text x="360" y="80" fill="#94a3b8" font-size="14" text-anchor="middle">(100+1)⁴ = 100⁴ + 4·100³ + 6·100² + 4·100 + 1</text>';
      m += '<text x="360" y="160" fill="#38bdf8" font-size="22" text-anchor="middle">104,060,401</text>';
      readout(cell("(101)⁴","104060401") + cell("(96)³","884736") + cell("(99)⁵","9509900499"));
      verdict("<b>Ex 7.1 Q6–9.</b> Always write the nearby hundred, keep the sign of the second summand.");
    } else {
      m += '<text x="360" y="70" fill="#94a3b8" font-size="14" text-anchor="middle">Example 3 · (1.01)¹⁰⁰⁰⁰⁰⁰ = 1 + 10⁶×0.01 + positives</text>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="18" text-anchor="middle">1 + 10,000 + (positive terms) &gt; 10,000</text>';
      m += '<text x="360" y="200" fill="#34d399" font-size="14" text-anchor="middle">Same idea: (1.1)¹⁰⁰⁰⁰ = 1 + 1000 + positives &gt; 1000 (Q10)</text>';
      readout(cell("linear term","10000") + cell("rest","&gt; 0") + cell("verdict","GREATER"));
      verdict("<b>The linear term already equals 10,000; every later term is positive.</b> Compound interest (1+r)ⁿ is the same expansion.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["remainder-25"] = (function(){
  var n=3;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>remainder 1</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p6" id="p6">6ⁿ − 5n mod 25</button>' +
      '<button class="preset-btn" data-preset="p4n" id="p4n">Σ 3ʳ ⁿCᵣ = 4ⁿ</button>';
    var mode="mod";
    document.getElementById("p6").onclick = function(){ setActivePreset(this); mode="mod"; draw(); };
    document.getElementById("p4n").onclick = function(){ setActivePreset(this); mode="four"; draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>n</span><span class="val" id="rn">3</span></div>' +
      '<input type="range" id="rn-range" min="1" max="8" step="1" value="3"></div>';
    document.getElementById("rn-range").oninput = function(){ n=Number(this.value); draw(); };
    window._r25 = function(){ return mode; };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var rg=document.getElementById("rn-range"); if(rg) n=Number(rg.value);
    var lb=document.getElementById("rn"); if(lb) lb.textContent=String(n);
    var mode=(window._r25&&window._r25())||"mod";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="mod"){
      var val = Math.pow(6,n) - 5*n;
      var rem = ((val % 25)+25)%25;
      m += '<text x="360" y="70" fill="#94a3b8" font-size="14" text-anchor="middle">Example 4 · 6ⁿ − 5n = 25k + 1</text>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="22" text-anchor="middle">6^'+n+' − 5·'+n+' = '+val.toLocaleString("en-IN")+'</text>';
      m += '<text x="360" y="200" fill="#34d399" font-size="18" text-anchor="middle">remainder mod 25 = '+rem+'</text>';
      readout(cell("value", String(val)) + cell("mod 25", String(rem)) + cell("k", String((val-1)/25)));
      verdict("<b>(1+5)ⁿ = 1 + 5n + 25(…).</b> Peel the first two terms; everything from ⁿC₂ onward carries 5²=25.");
    } else {
      var s=0;
      for(var r=0;r<=n;r++) s += C(n,r)*Math.pow(3,r);
      m += '<text x="360" y="80" fill="#94a3b8" font-size="14" text-anchor="middle">Ex 7.1 Q14 · Σ 3ʳ ⁿCᵣ = (1+3)ⁿ = 4ⁿ</text>';
      m += '<text x="360" y="160" fill="#38bdf8" font-size="22" text-anchor="middle">sum = '+s+' = 4^'+n+' = '+Math.pow(4,n)+'</text>';
      readout(cell("Σ", String(s)) + cell("4ⁿ", String(Math.pow(4,n))));
      verdict("<b>Substitute a=1, b=3 in the binomial theorem.</b> No listing required.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
