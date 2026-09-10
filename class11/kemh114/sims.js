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

/* 14.1 Event as a subset of S */
window.SIMS.eventsubset = (function(){
  var which = "oneH";
  var S = ["HH","HT","TH","TT"];
  function setOf(key){
    if(key === "oneH") return ["HT","TH"];
    if(key === "twoT") return ["TT"];
    if(key === "atLeastT") return ["HT","TH","TT"];
    if(key === "secondNotH") return ["HT","TT"];
    if(key === "sure") return S.slice();
    return []; // more than two tails
  }
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>sample point in E</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#1e293b;"></span><span>sample point not in E</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-1">Exactly one head  E={HT,TH}</button>' +
      '<button class="preset-btn" id="p-2">Exactly two tails  A={TT}</button>' +
      '<button class="preset-btn" id="p-3">At least one tail  B</button>' +
      '<button class="preset-btn" id="p-4">Impossible: more than two tails</button>';
    document.getElementById("p-1").onclick = function(){ setActivePreset(this); which="oneH"; draw(); };
    document.getElementById("p-2").onclick = function(){ setActivePreset(this); which="twoT"; draw(); };
    document.getElementById("p-3").onclick = function(){ setActivePreset(this); which="atLeastT"; draw(); };
    document.getElementById("p-4").onclick = function(){ setActivePreset(this); which="imp"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var E = setOf(which);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="80" y="40" width="560" height="220" rx="16" fill="none" stroke="#64748b" stroke-width="2"/>';
    m += '<text x="100" y="64" fill="#94a3b8" font-size="14">S = {HH, HT, TH, TT}</text>';
    S.forEach(function(pt, i){
      var x = 160 + (i % 4) * 120, y = 150;
      var on = E.indexOf(pt) >= 0;
      m += '<circle cx="'+x+'" cy="'+y+'" r="28" fill="'+(on?"#0ea5e9":"#1e293b")+'" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="'+x+'" y="'+(y+5)+'" fill="#f8fafc" font-size="14" text-anchor="middle">'+pt+'</text>';
    });
    svg.innerHTML = m;
    readout(cell("|S|", "4") + cell("|E|", String(E.length)) + cell("E", E.length ? "{"+E.join(", ")+"}" : "∅"));
    verdict("<b>Definition (zoom p.1):</b> any subset E of the sample space S is an event. The impossible event is ∅; the sure event is S itself. Tossing a coin twice is the running example of this section.");
  }
  return { mount: mount, draw: draw };
})();

/* types: simple / compound / sure / impossible */
window.SIMS.types = (function(){
  var mode = "simple";
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>simple (one sample point)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>compound (more than one)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-s">Simple: {TT}</button>' +
      '<button class="preset-btn" id="p-c">Compound: at least one head</button>' +
      '<button class="preset-btn" id="p-sure">Sure: at most two tails</button>' +
      '<button class="preset-btn" id="p-imp">Impossible: more than two tails</button>';
    document.getElementById("p-s").onclick = function(){ setActivePreset(this); mode="simple"; draw(); };
    document.getElementById("p-c").onclick = function(){ setActivePreset(this); mode="comp"; draw(); };
    document.getElementById("p-sure").onclick = function(){ setActivePreset(this); mode="sure"; draw(); };
    document.getElementById("p-imp").onclick = function(){ setActivePreset(this); mode="imp"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var S = ["HH","HT","TH","TT"];
    var E;
    if(mode === "simple") E = ["TT"];
    else if(mode === "comp") E = ["HH","HT","TH"];
    else if(mode === "sure") E = S.slice();
    else E = [];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="90" y="50" width="540" height="200" rx="12" fill="#0b1220" stroke="#64748b"/>';
    S.forEach(function(pt,i){
      var x = 170 + i*120, y = 150;
      var on = E.indexOf(pt) >= 0;
      m += '<rect x="'+(x-40)+'" y="'+(y-28)+'" width="80" height="56" rx="8" fill="'+(on?"#b45309":"#1e293b")+'" stroke="#f59e0b"/>';
      m += '<text x="'+x+'" y="'+(y+5)+'" fill="#f8fafc" font-size="16" text-anchor="middle">'+pt+'</text>';
    });
    svg.innerHTML = m;
    var kind = mode === "simple" ? "simple" : (mode === "imp" ? "impossible ∅" : (mode === "sure" ? "sure = S" : "compound"));
    readout(cell("type", kind) + cell("|E|", String(E.length)));
    verdict("<b>§14.1.2:</b> a simple event is a singleton; a compound event has more than one sample point. The sure event is S; the impossible event is empty. Play the four presets from the coin-twice table on p.1.");
  }
  return { mount: mount, draw: draw };
})();

/* mutually exclusive / exhaustive */
window.SIMS.exclusive = (function(){
  var pair = "CD";
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>B</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>A ∩ B</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cd">Example 2: C and D (exclusive)</button>' +
      '<button class="preset-btn" id="p-ab">A and B (not exclusive)</button>' +
      '<button class="preset-btn" id="p-ex3">Example 3: A,B,C exclusive and exhaustive</button>';
    document.getElementById("p-cd").onclick = function(){ setActivePreset(this); pair="CD"; draw(); };
    document.getElementById("p-ab").onclick = function(){ setActivePreset(this); pair="AB"; draw(); };
    document.getElementById("p-ex3").onclick = function(){ setActivePreset(this); pair="EX3"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(pair === "EX3"){
      // three disjoint events covering S of 8 points
      var cols = [["TTT","A"],["HTT","B"],["THT","B"],["TTH","B"],["HHT","C"],["HTH","C"],["THH","C"],["HHH","C"]];
      cols.forEach(function(row,i){
        var x = 70 + (i%4)*160, y = i<4 ? 90 : 190;
        var col = row[1]==="A"?"#f59e0b":(row[1]==="B"?"#38bdf8":"#34d399");
        m += '<rect x="'+x+'" y="'+y+'" width="140" height="70" rx="8" fill="'+col+'"/>';
        m += '<text x="'+(x+70)+'" y="'+(y+42)+'" fill="#0f172a" font-size="16" text-anchor="middle">'+row[0]+' ∈ '+row[1]+'</text>';
      });
      svg.innerHTML = m;
      readout(cell("A∩B", "∅") + cell("A∪B∪C", "S") + cell("status", "exclusive AND exhaustive", "#34d399"));
      verdict("<b>Example 3 (zoom p.6):</b> A = no head, B = exactly one head, C = at least two heads. Pairwise disjoint and union = S, so they partition the eight outcomes of three coin tosses.");
      return;
    }
    // two circles
    var overlap = pair === "AB";
    m += '<rect x="80" y="30" width="560" height="240" rx="8" fill="none" stroke="#64748b"/>';
    m += '<text x="100" y="52" fill="#94a3b8">S</text>';
    var cx1 = overlap ? 280 : 230, cx2 = overlap ? 430 : 500;
    m += '<circle cx="'+cx1+'" cy="160" r="90" fill="#0ea5e933" stroke="#38bdf8" stroke-width="3"/>';
    m += '<circle cx="'+cx2+'" cy="160" r="90" fill="#f59e0b33" stroke="#f59e0b" stroke-width="3"/>';
    m += '<text x="'+cx1+'" y="164" fill="#38bdf8" font-size="18" text-anchor="middle">'+(pair==="AB"?"A":"C")+'</text>';
    m += '<text x="'+cx2+'" y="164" fill="#f59e0b" font-size="18" text-anchor="middle">'+(pair==="AB"?"B":"D")+'</text>';
    svg.innerHTML = m;
    if(pair === "AB"){
      readout(cell("A∩B", "≠ ∅", "#f87171") + cell("mutually exclusive?", "NO"));
      verdict("<b>Example 2:</b> A (odd sum) and B (exactly one 2 or 5, etc.) share outcomes such as (1,5). They are not mutually exclusive. C = {(1,1),(2,1),(1,2)} and D = {(6,6)} satisfy C ∩ D = ∅.");
    } else {
      readout(cell("C∩D", "∅", "#34d399") + cell("mutually exclusive?", "YES"));
      verdict("<b>Definition:</b> A and B are mutually exclusive (disjoint) iff A ∩ B = ∅ — they cannot occur together.");
    }
  }
  return { mount: mount, draw: draw };
})();

/* axioms */
window.SIMS.axioms = (function(){
  var asg = "fair";
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>valid assignment</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>violates an axiom</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-f">Fair coin P(H)=P(T)=1/2</button>' +
      '<button class="preset-btn" id="p-b">Biased P(H)=1/4, P(T)=3/4</button>' +
      '<button class="preset-btn" id="p-bad">Ex 14.2 Q1 (c): sums to 2.8</button>' +
      '<button class="preset-btn" id="p-neg">Q1 (d): a negative probability</button>';
    document.getElementById("p-f").onclick = function(){ setActivePreset(this); asg="fair"; draw(); };
    document.getElementById("p-b").onclick = function(){ setActivePreset(this); asg="bias"; draw(); };
    document.getElementById("p-bad").onclick = function(){ setActivePreset(this); asg="sum"; draw(); };
    document.getElementById("p-neg").onclick = function(){ setActivePreset(this); asg="neg"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var labels, vals, ok, why;
    if(asg === "fair"){ labels=["H","T"]; vals=[0.5,0.5]; ok=true; why="Axioms (i)–(iii): each ≥ 0, sum 1, disjoint union adds."; }
    else if(asg === "bias"){ labels=["H","T"]; vals=[0.25,0.75]; ok=true; why="Still a legal probability — fairness is extra, not an axiom. Zoom p.8 assignment (2)."; }
    else if(asg === "sum"){ labels=["ω1","ω2","ω3","ω4","ω5","ω6","ω7"]; vals=[0.1,0.2,0.3,0.4,0.5,0.6,0.7]; ok=false; why="Σ = 2.8 > 1, violates P(S) = 1."; }
    else { labels=["ω1","ω2","ω3","ω4","ω5","ω6","ω7"]; vals=[-0.1,0.2,0.3,0.4,-0.2,0.1,0.3]; ok=false; why="Negative entries violate P(E) ≥ 0."; }
    var sum = vals.reduce(function(a,b){ return a+b; },0);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var max = Math.max.apply(null, vals.map(Math.abs).concat([1]));
    vals.forEach(function(v,i){
      var x = 40 + i * (640/vals.length);
      var h = Math.abs(v) / max * 180;
      var y = v >= 0 ? 230 - h : 230;
      var col = v < 0 || !ok ? "#f87171" : "#34d399";
      m += '<rect x="'+x+'" y="'+y+'" width="50" height="'+h+'" fill="'+col+'"/>';
      m += '<text x="'+(x+25)+'" y="255" fill="#94a3b8" font-size="11" text-anchor="middle">'+labels[i]+'</text>';
    });
    m += '<line x1="30" y1="50" x2="700" y2="50" stroke="#64748b" stroke-dasharray="4 4"/>';
    svg.innerHTML = m;
    readout(cell("Σ P(ω)", sum.toFixed(2), ok?"#34d399":"#f87171") + cell("valid?", ok?"YES":"NO", ok?"#34d399":"#f87171"));
    verdict("<b>Axioms (zoom p.8):</b> (i) P(E) ≥ 0  (ii) P(S) = 1  (iii) P(E ∪ F) = P(E)+P(F) when E ∩ F = ∅. Consequence: P(∅) = 0. "+why);
  }
  return { mount: mount, draw: draw };
})();

/* equally likely dice / coins */
window.SIMS.equally = (function(){
  var exp = "die";
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>favourable</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#1e293b;"></span><span>not favourable</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-d">Die: P(prime)</button>' +
      '<button class="preset-btn" id="p-c">Example 5: a diamond from 52</button>' +
      '<button class="preset-btn" id="p-bag">Example 6: 9 discs, 4 red</button>';
    document.getElementById("p-d").onclick = function(){ setActivePreset(this); exp="die"; draw(); };
    document.getElementById("p-c").onclick = function(){ setActivePreset(this); exp="card"; draw(); };
    document.getElementById("p-bag").onclick = function(){ setActivePreset(this); exp="bag"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var fav, n, title, expl;
    if(exp === "die"){
      n = 6; fav = [2,3,5]; title = "die faces"; expl = "P(prime) = 3/6 = 1/2. Ex 14.2 Q3(i).";
      for(var i=1;i<=6;i++){
        var on = fav.indexOf(i)>=0;
        var x = 80 + (i-1)*100, y = 120;
        m += '<rect x="'+x+'" y="'+y+'" width="80" height="80" rx="12" fill="'+(on?"#0ea5e9":"#1e293b")+'" stroke="#38bdf8"/>';
        m += '<text x="'+(x+40)+'" y="'+(y+48)+'" fill="#f8fafc" font-size="28" text-anchor="middle">'+i+'</text>';
      }
    } else if(exp === "card"){
      n = 52; fav = 13; title = "deck"; expl = "Example 5: P(diamond) = 13/52 = 1/4. P(not ace) = 48/52 = 12/13. P(black) = 1/2.";
      for(var s=0;s<4;s++){
        var names=["♠","♥","♦","♣"], cols=["#e2e8f0","#f87171","#f87171","#e2e8f0"];
        m += '<rect x="'+(90+s*150)+'" y="80" width="130" height="140" rx="10" fill="#0b1220" stroke="'+cols[s]+'"/>';
        m += '<text x="'+(155+s*150)+'" y="160" fill="'+cols[s]+'" font-size="40" text-anchor="middle">'+names[s]+'</text>';
        m += '<text x="'+(155+s*150)+'" y="200" fill="#94a3b8" font-size="12" text-anchor="middle">13 cards</text>';
      }
    } else {
      n = 9; fav = 4; title = "discs"; expl = "Example 6: 4 red, 3 blue, 2 yellow. P(red) = 4/9, P(not yellow) = 7/9.";
      var cols = ["#f87171","#f87171","#f87171","#f87171","#38bdf8","#38bdf8","#38bdf8","#facc15","#facc15"];
      cols.forEach(function(c,i){
        var x = 80 + (i%9)*70, y = 140;
        m += '<circle cx="'+x+'" cy="'+y+'" r="24" fill="'+c+'"/>';
      });
    }
    svg.innerHTML = m;
    var p = (exp==="die"?3:fav)/n;
    readout(cell("n(S)", String(n)) + cell("n(E)", exp==="die"?"3":String(fav)) + cell("P(E)=m/n", p.toFixed(4), "#34d399"));
    verdict("<b>§14.2.2 (zoom p.11):</b> if all n outcomes are equally likely, P(E) = n(E)/n(S). "+expl);
  }
  return { mount: mount, draw: draw };
})();

/* FLAGSHIP: addition rule Venn — P(A∪B)=P(A)+P(B)−P(A∩B) */
window.SIMS.addition = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A − B</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>A ∩ B</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>B − A</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-fig">Fig. 14.1 addition rule</button>' +
      '<button class="preset-btn" id="p-me">Mutually exclusive: intersection 0</button>' +
      '<button class="preset-btn" id="p-ex7">Example 7: Anil and Ashima</button>';
    var mode = "fig";
    document.getElementById("p-fig").onclick = function(){ setActivePreset(this); mode="fig"; sync(); draw(); };
    document.getElementById("p-me").onclick = function(){ setActivePreset(this); mode="me"; document.getElementById("ctrl-i-range").value = 0; draw(); };
    document.getElementById("p-ex7").onclick = function(){
      setActivePreset(this); mode="ex7";
      document.getElementById("ctrl-a-range").value = 0.05;
      document.getElementById("ctrl-b-range").value = 0.10;
      document.getElementById("ctrl-i-range").value = 0.02;
      draw();
    };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>P(A)</span><span class="val" id="ctrl-a">0.42</span></div>' +
      '<input type="range" id="ctrl-a-range" min="0" max="1" step="0.01" value="0.42"></div>' +
      '<div class="control-item"><div class="control-label"><span>P(B)</span><span class="val" id="ctrl-b">0.48</span></div>' +
      '<input type="range" id="ctrl-b-range" min="0" max="1" step="0.01" value="0.48"></div>' +
      '<div class="control-item"><div class="control-label"><span>P(A ∩ B)</span><span class="val" id="ctrl-i">0.16</span></div>' +
      '<input type="range" id="ctrl-i-range" min="0" max="1" step="0.01" value="0.16"></div>';
    ["ctrl-a-range","ctrl-b-range","ctrl-i-range"].forEach(function(id){
      document.getElementById(id).oninput = function(){ draw(); };
    });
    function sync(){ /* mode captured */ }
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var a = Number(document.getElementById("ctrl-a-range").value);
    var b = Number(document.getElementById("ctrl-b-range").value);
    var i = Number(document.getElementById("ctrl-i-range").value);
    // intersection cannot exceed either
    if(i > a) i = a;
    if(i > b) i = b;
    document.getElementById("ctrl-a").textContent = a.toFixed(2);
    document.getElementById("ctrl-b").textContent = b.toFixed(2);
    document.getElementById("ctrl-i").textContent = i.toFixed(2);
    var union = a + b - i;
    var onlyA = a - i, onlyB = b - i;
    var valid = union <= 1 + 1e-9 && i <= a && i <= b;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="60" y="24" width="600" height="250" rx="10" fill="none" stroke="#64748b"/>';
    m += '<text x="80" y="48" fill="#94a3b8">S</text>';
    // Circle centres: 200 px apart ≈ disjoint; 90 px ≈ heavy overlap. The subtracted P(A∩B) is the lens.
    var overlapFrac = i / Math.max(0.02, Math.min(a, b, 1));
    var dist = 200 - 110 * overlapFrac;
    var cx1 = 330 - dist / 2, cx2 = 330 + dist / 2, r = 100, cy = 150;
    m += '<circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="#0ea5e944" stroke="#38bdf8" stroke-width="3"/>';
    m += '<circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'" fill="#f59e0b44" stroke="#f59e0b" stroke-width="3"/>';
    m += '<text x="'+(cx1-40)+'" y="154" fill="#38bdf8" font-size="16" text-anchor="middle">A−B</text>';
    m += '<text x="330" y="154" fill="#34d399" font-size="16" text-anchor="middle">A∩B</text>';
    m += '<text x="'+(cx2+40)+'" y="154" fill="#f59e0b" font-size="16" text-anchor="middle">B−A</text>';
    m += '<text x="'+(cx1-40)+'" y="176" fill="#e2e8f0" font-size="13" text-anchor="middle">'+onlyA.toFixed(2)+'</text>';
    m += '<text x="330" y="176" fill="#e2e8f0" font-size="13" text-anchor="middle">'+i.toFixed(2)+'</text>';
    m += '<text x="'+(cx2+40)+'" y="176" fill="#e2e8f0" font-size="13" text-anchor="middle">'+onlyB.toFixed(2)+'</text>';
    svg.innerHTML = m;
    readout(cell("P(A−B)", onlyA.toFixed(2), "#38bdf8") + cell("P(A∩B)", i.toFixed(2), "#34d399") + cell("P(B−A)", onlyB.toFixed(2), "#f59e0b") + cell("P(A∪B)", union.toFixed(2), valid?"#34d399":"#f87171"));
    verdict("<b>Fig. 14.1 / §14.2.3 (zoom p.12–13):</b> A ∪ B = (A−B) ∪ (A∩B) ∪ (B−A), pairwise disjoint, so P(A∪B) = P(A)+P(B)−P(A∩B). If mutually exclusive, P(A∩B)=0 and the middle slice vanishes — Axiom (iii). Ex 14.2 Q17: 0.42+0.48−0.16 = 0.74.");
  }
  return { mount: mount, draw: draw };
})();

/* complement */
window.SIMS.complement = (function(){
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>A′ = S − A</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ten">10 cards, A = {2,4,6,8}</button>' +
      '<button class="preset-btn" id="p-ace">Example 5(ii): not an ace</button>';
    document.getElementById("p-ten").onclick = function(){ setActivePreset(this); draw(); };
    document.getElementById("p-ace").onclick = function(){ setActivePreset(this); draw(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>P(A)</span><span class="val" id="ctrl-p">0.40</span></div>' +
      '<input type="range" id="ctrl-p-range" min="0" max="1" step="0.01" value="0.4"></div>';
    document.getElementById("ctrl-p-range").oninput = function(){ draw(); };
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var p = Number(document.getElementById("ctrl-p-range").value);
    document.getElementById("ctrl-p").textContent = p.toFixed(2);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="70" y="40" width="580" height="220" rx="12" fill="#7c2d12" stroke="#f59e0b" stroke-width="2"/>';
    var w = 80 + p * 400;
    m += '<circle cx="280" cy="150" r="'+ (50+p*60) +'" fill="#0ea5e9" stroke="#38bdf8" stroke-width="3"/>';
    m += '<text x="280" y="154" fill="#0f172a" font-size="18" text-anchor="middle">A</text>';
    m += '<text x="520" y="154" fill="#fde68a" font-size="18" text-anchor="middle">A′</text>';
    svg.innerHTML = m;
    readout(cell("P(A)", p.toFixed(2), "#38bdf8") + cell("P(A′)", (1-p).toFixed(2), "#f59e0b") + cell("P(A)+P(A′)", "1.00", "#34d399"));
    verdict("<b>§14.2.4 (zoom p.13–14):</b> A and A′ are mutually exclusive and exhaustive, so P(A)+P(A′)=P(S)=1, hence P(not A)=1−P(A). Ten-card example: P(A)=4/10=2/5, P(A′)=3/5. Example 5: P(not ace)=1−4/52=12/13.");
  }
  return { mount: mount, draw: draw };
})();

/* cards / combinatorics applications */
window.SIMS.cards = (function(){
  var scene = "ex8";
  function C(n,k){
    if(k<0||k>n) return 0;
    var r=1; for(var i=1;i<=k;i++) r = r * (n-k+i)/i; return r;
  }
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>favourable committees / hands</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ex8">Example 8: 2 men + 2 women, committee of 2</button>' +
      '<button class="preset-btn" id="p-misc1">Misc 1: 5 marbles from 60</button>' +
      '<button class="preset-btn" id="p-misc2">Misc 2: 3 diamonds and 1 spade</button>';
    document.getElementById("p-ex8").onclick = function(){ setActivePreset(this); scene="ex8"; draw(); };
    document.getElementById("p-misc1").onclick = function(){ setActivePreset(this); scene="m1"; draw(); };
    document.getElementById("p-misc2").onclick = function(){ setActivePreset(this); scene="m2"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw();
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var note, p1, p2, p3;
    if(scene === "ex8"){
      var tot = C(4,2);
      p1 = C(2,2)/tot; p2 = (C(2,1)*C(2,1))/tot; p3 = C(2,2)/tot;
      note = "Example 8: ⁴C₂ = 6 committees. P(no man)=²C₂/⁶=1/6, P(one man)=4/6=2/3, P(two men)=1/6.";
      ["WW  1/6","MW  2/3","MM  1/6"].forEach(function(lab,i){
        m += '<rect x="'+(80+i*200)+'" y="80" width="180" height="140" rx="12" fill="#1e3a5f" stroke="#38bdf8"/>';
        m += '<text x="'+(170+i*200)+'" y="160" fill="#e2e8f0" font-size="18" text-anchor="middle">'+lab+'</text>';
      });
    } else if(scene === "m1"){
      p1 = C(20,5)/C(60,5); p2 = 1 - C(30,5)/C(60,5);
      note = "Misc 1: 10R+20B+30G, draw 5. P(all blue)=²⁰C₅/⁶⁰C₅. P(at least one green)=1 − ³⁰C₅/⁶⁰C₅ (the 30 non-green).";
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="16" text-anchor="middle">P(all blue) = '+p1.toExponential(3)+'</text>';
      m += '<text x="360" y="180" fill="#34d399" font-size="16" text-anchor="middle">P(≥1 green) = '+p2.toFixed(4)+'</text>';
    } else {
      p1 = C(13,3)*C(13,1)/C(52,4);
      note = "Misc 2: ⁴C(hands) = ⁵²C₄. Favourable ¹³C₃ · ¹³C₁.";
      m += '<text x="360" y="150" fill="#e2e8f0" font-size="18" text-anchor="middle">P(3♦ + 1♠) = (¹³C₃ · ¹³C₁) / ⁵²C₄ = '+p1.toFixed(5)+'</text>';
    }
    svg.innerHTML = m;
    readout(cell("combinatorial P", "n(E)/n(S)") + (scene==="ex8"? cell("P(one man)", "2/3"): cell("value", (p1||0).toFixed(5))));
    verdict("<b>"+note+"</b> Equally likely outcomes plus counting — the same m/n rule of §14.2.2, with ⁿCᵣ from Chapter 6.");
  }
  return { mount: mount, draw: draw };
})();
