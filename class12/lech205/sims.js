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

window.SIMS.carbclass = (function(){
  var mode = "def";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>carbohydrate</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>not a carbohydrate</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c-def">Cₓ(H₂O)ᵧ myth</button>' +
      '<button class="preset-btn" id="c-hy">Hydrolysis class</button>' +
      '<button class="preset-btn" id="c-red">Reducing vs not</button>';
    document.getElementById("c-def").onclick = function(){ setActivePreset(this); mode="def"; draw(0); };
    document.getElementById("c-hy").onclick = function(){ setActivePreset(this); mode="hy"; draw(0); };
    document.getElementById("c-red").onclick = function(){ setActivePreset(this); mode="red"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function card(x,y,w,h,title,sub,ok){
    var col = ok ? "#34d399" : "#f87171";
    return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="10" fill="#0f172a" stroke="'+col+'" stroke-width="2"/>' +
      '<text x="'+(x+w/2)+'" y="'+(y+28)+'" text-anchor="middle" fill="#e2e8f0" font-size="14">'+title+'</text>' +
      '<text x="'+(x+w/2)+'" y="'+(y+52)+'" text-anchor="middle" fill="'+col+'" font-size="12">'+sub+'</text>';
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "def"){
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Zoom p.1: the hydrate formula is neither necessary nor sufficient</text>';
      m += card(40,70,200,90,"glucose C₆H₁₂O₆","C₆(H₂O)₆  YES sugar", true);
      m += card(260,70,200,90,"acetic acid C₂H₄O₂","C₂(H₂O)₂  NOT a sugar", false);
      m += card(480,70,200,90,"rhamnose C₆H₁₂O₅","does not fit  IS a sugar", true);
      m += '<text x="360" y="210" fill="#cbd5e1" font-size="13" text-anchor="middle">Working definition: optically active polyhydroxy aldehyde or ketone,</text>';
      m += '<text x="360" y="232" fill="#cbd5e1" font-size="13" text-anchor="middle">or a molecule that yields those units on hydrolysis.</text>';
      readout(cell("Glucose","carbohydrate","#34d399") + cell("CH₃COOH","not","#f87171") + cell("Rhamnose","carbohydrate","#34d399"));
      verdict("<b>§10.1:</b> chemically they contain specific functional groups. Sweet-tasting ones are sugars; polysaccharides are non-sugars.");
    } else if(mode === "hy"){
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Classification by hydrolysis — how many monosaccharide units</text>';
      m += card(30,80,210,100,"monosaccharide","cannot hydrolyse further  glucose, fructose, ribose", true);
      m += card(255,80,210,100,"oligosaccharide","2–10 units  sucrose, maltose, lactose", true);
      m += card(480,80,210,100,"polysaccharide","many units  starch, cellulose, glycogen", true);
      m += '<text x="360" y="230" fill="#cbd5e1" font-size="13" text-anchor="middle">Sucrose → Glc + Fru · maltose → 2 Glc · lactose → Gal + Glc</text>';
      readout(cell("Mono","~20 in nature") + cell("Oligo","disaccharides most common") + cell("Poly","non-sugars"));
      verdict("<b>Table 10.1:</b> aldose vs ketose, triose → heptose. Independent of the reducing/non-reducing split.");
    } else {
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Reducing sugars reduce Fehling’s and Tollens’ — free anomeric carbon</text>';
      m += card(40,80,200,90,"all monosaccharides","reducing (aldose or ketose)", true);
      m += card(260,80,200,90,"maltose, lactose","reducing (one free C1)", true);
      m += card(480,80,200,90,"sucrose","NON-reducing (both anomers tied)", false);
      m += '<text x="360" y="230" fill="#cbd5e1" font-size="13" text-anchor="middle">A ketose still reduces because the alkaline reagent equilibrates it with an aldose.</text>';
      readout(cell("Tollens’ / Fehling’s","carbonyl test") + cell("Sucrose","both C1 and C2 tied"));
      verdict("<b>§10.1.1:</b> all monosaccharides, whether aldose or ketose, are reducing sugars. Sucrose is the teaching non-reducing disaccharide.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.carblab = (function(){
  var mode = "open";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>open-chain D-(+)-glucose</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>anomeric C1</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="g-o">Six open-chain proofs</button>' +
      '<button class="preset-btn" id="g-f">Three failures → hemiacetal</button>' +
      '<button class="preset-btn" id="g-a">α 419 K / β 423 K anomers</button>';
    document.getElementById("g-o").onclick = function(){ setActivePreset(this); mode="open"; draw(0); };
    document.getElementById("g-f").onclick = function(){ setActivePreset(this); mode="fail"; draw(0); };
    document.getElementById("g-a").onclick = function(){ setActivePreset(this); mode="anom"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "open"){
      var proofs = [
        "1. formula C₆H₁₂O₆",
        "2. HI → n-hexane (straight chain of six C)",
        "3. NH₂OH oxime + HCN cyanohydrin (carbonyl)",
        "4. Br₂ water → gluconic acid (aldehyde, not ketone)",
        "5. Ac₂O → pentaacetate (five –OH on different C)",
        "6. HNO₃ → saccharic acid (CHO and CH₂OH oxidised)"
      ];
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Open-chain evidence (zooms p.3–4) — Fischer D-(+)-glucose, C5–OH on the right</text>';
      proofs.forEach(function(p,i){
        m += '<text x="40" y="'+(56+i*34)+'" fill="#e2e8f0" font-size="14">'+p+'</text>';
      });
      readout(cell("Class","aldohexose") + cell("D means","C5 matches D-glyceraldehyde") + cell("(+) means","dextrorotatory"));
      verdict("<b>D ≠ (+).</b> D/L is configuration vs glyceraldehyde; (+)/(−) is the sign of rotation. Glucose happens to be both D and (+).");
    } else if(mode === "fail"){
      var fails = [
        ["Schiff’s test / NaHSO₃ adduct","no reaction — free CHO is not the major species"],
        ["Pentaacetate + NH₂OH","no oxime — ring cannot open (Intext 10.3)"],
        ["Two crystalline forms","α m.p. 419 K (cryst. 303 K); β m.p. 423 K (cryst. 371 K)"]
      ];
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Facts the open chain cannot explain — cyclic hemiacetal at C5 (zoom p.5)</text>';
      fails.forEach(function(f,i){
        m += '<rect x="30" y="'+(50+i*70)+'" width="660" height="58" rx="8" fill="#0f172a" stroke="#f87171"/>';
        m += '<text x="50" y="'+(74+i*70)+'" fill="#fca5a5" font-size="14">'+f[0]+'</text>';
        m += '<text x="50" y="'+(94+i*70)+'" fill="#cbd5e1" font-size="13">'+f[1]+'</text>';
      });
      readout(cell("Ring","pyranose (6, like pyran)") + cell("Partner OH","C5") + cell("Anomeric C","C1, the old aldehyde"));
      verdict("<b>Cyclic structure:</b> C5–OH adds to CHO. The two cyclic forms exist in equilibrium with a trace of open chain — that trace still slowly reduces Tollens’.");
    } else {
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Anomers differ only at C1. Haworth: α C1–OH down; β C1–OH up (zoom p.6)</text>';
      function pyr(x, label, ohUp){
        var s = '<polygon points="'+(x+40)+',80 '+(x+120)+',80 '+(x+150)+',140 '+(x+80)+',190 '+(x+10)+',140" fill="none" stroke="#38bdf8" stroke-width="2"/>';
        s += '<text x="'+(x+80)+'" y="70" text-anchor="middle" fill="#94a3b8" font-size="12">O</text>';
        s += '<text x="'+(x+(ohUp?130:30))+'" y="'+(ohUp?70:210)+'" fill="#fbbf24" font-size="13">C1–OH</text>';
        s += '<text x="'+(x+80)+'" y="230" text-anchor="middle" fill="#e2e8f0" font-size="13">'+label+'</text>';
        return s;
      }
      m += pyr(40, "α-D-(+)-glucopyranose  m.p. 419 K", false);
      m += pyr(400, "β-D-(+)-glucopyranose  m.p. 423 K", true);
      m += '<text x="360" y="270" fill="#cbd5e1" font-size="12" text-anchor="middle">Same D-series; only the anomeric carbon flipped. Commercial glucose: starch + dil. H₂SO₄, 393 K, 2–3 atm.</text>';
      readout(cell("α m.p.","419 K") + cell("α from","303 K conc. soln") + cell("β m.p.","423 K") + cell("β from","371 K sat. soln"));
      verdict("<b>Zoom p.5–6:</b> anomers = isomers that differ only in configuration at the anomeric carbon. Pyranose in analogy with pyran (O + five C).");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.invertlab = (function(){
  var hydrolysed = 0;
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>sucrose (dextro)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>invert sugar (laevo)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="i-s">Sucrose linkage</button>' +
      '<button class="preset-btn" id="i-p">Polarimeter +52.5° / −92.4°</button>' +
      '<button class="preset-btn" id="i-m">Maltose & lactose (reducing)</button>';
    document.getElementById("i-s").onclick = function(){ setActivePreset(this); hydrolysed=0; draw(0); };
    document.getElementById("i-p").onclick = function(){ setActivePreset(this); hydrolysed=1; App.resetTimeline(); App.play(); };
    document.getElementById("i-m").onclick = function(){ setActivePreset(this); hydrolysed=2; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(hydrolysed === 0){
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Sucrose: C1 of α-D-glucose to C2 of β-D-fructose (zoom p.7)</text>';
      m += '<rect x="60" y="80" width="220" height="120" rx="12" fill="#0f172a" stroke="#38bdf8"/>';
      m += '<text x="170" y="130" text-anchor="middle" fill="#7dd3fc" font-size="14">α-D-glucose</text>';
      m += '<text x="170" y="154" text-anchor="middle" fill="#94a3b8" font-size="12">C1 anomeric</text>';
      m += '<text x="310" y="145" fill="#fbbf24" font-size="14">C1–O–C2</text>';
      m += '<rect x="440" y="80" width="220" height="120" rx="12" fill="#0f172a" stroke="#34d399"/>';
      m += '<text x="550" y="130" text-anchor="middle" fill="#86efac" font-size="14">β-D-fructose</text>';
      m += '<text x="550" y="154" text-anchor="middle" fill="#94a3b8" font-size="12">C2 anomeric</text>';
      m += '<text x="360" y="240" fill="#cbd5e1" font-size="13" text-anchor="middle">Both reducing groups are tied → sucrose is non-reducing. C₁₂H₂₂O₁₁ + H₂O → two C₆H₁₂O₆</text>';
      readout(cell("Link","α-Glc-(1→2)-β-Fru") + cell("Reducing?","NO") + cell("Name","glycosidic linkage"));
      verdict("<b>Glycosidic linkage:</b> oxide bridge formed by loss of water between two monosaccharides.");
    } else if(hydrolysed === 1){
      var frac = Math.min(1, t/6);
      var rotG = 52.5, rotF = -92.4;
      var mix = (1-frac)*20 + frac*(rotG+rotF)/2; // sucrose rotation not given; mix ends negative
      // Don't invent sucrose's specific rotation — show the two products and the sign change.
      var shown = frac < 0.05 ? "+ (dextro sucrose)" : (mix >= 0 ? ("mix "+mix.toFixed(1)+"°") : ("mix "+mix.toFixed(1)+"°  LAEVO"));
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Inversion: hydrolysate is laevorotatory because |−92.4°| > +52.5°</text>';
      m += '<rect x="80" y="70" width="240" height="90" rx="10" fill="#0f172a" stroke="#38bdf8"/>';
      m += '<text x="200" y="110" text-anchor="middle" fill="#7dd3fc" font-size="16">glucose  +52.5°</text>';
      m += '<rect x="400" y="70" width="240" height="90" rx="10" fill="#0f172a" stroke="#f87171"/>';
      m += '<text x="520" y="110" text-anchor="middle" fill="#fca5a5" font-size="16">fructose  −92.4°</text>';
      var barW = 400;
      var x0 = 160;
      var zero = x0 + barW/2;
      var xMix = zero + (mix/100)*barW;
      m += '<line x1="'+x0+'" y1="210" x2="'+(x0+barW)+'" y2="210" stroke="#334155" stroke-width="4"/>';
      m += '<line x1="'+zero+'" y1="198" x2="'+zero+'" y2="222" stroke="#e2e8f0" stroke-width="2"/>';
      m += '<circle cx="'+xMix+'" cy="210" r="8" fill="'+(mix>=0?"#38bdf8":"#f87171")+'"/>';
      m += '<text x="360" y="250" fill="#e2e8f0" font-size="14" text-anchor="middle">'+shown+'</text>';
      m += '<text x="360" y="274" fill="#94a3b8" font-size="11" text-anchor="middle">This reprint does not print sucrose’s own [α]; it prints the two product rotations and the sign change.</text>';
      readout(cell("Glucose","+52.5°","#38bdf8") + cell("Fructose","−92.4°","#f87171") + cell("Equimolar mean","−19.95°") + cell("Name","invert sugar"));
      verdict("<b>Zoom p.7:</b> hydrolysis of sucrose brings about a change in the sign of rotation, from dextro (+) to laevo (−). The product is invert sugar. D/L labels do not flip.");
    } else {
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Reducing disaccharides: one anomeric carbon still free</text>';
      m += '<rect x="40" y="70" width="300" height="160" rx="12" fill="#0f172a" stroke="#34d399"/>';
      m += '<text x="190" y="110" text-anchor="middle" fill="#86efac" font-size="16">maltose</text>';
      m += '<text x="190" y="140" text-anchor="middle" fill="#cbd5e1" font-size="13">α-D-Glc-(1→4)-α-D-Glc</text>';
      m += '<text x="190" y="168" text-anchor="middle" fill="#94a3b8" font-size="12">free C1 on second glucose</text>';
      m += '<text x="190" y="196" text-anchor="middle" fill="#34d399" font-size="13">REDUCING</text>';
      m += '<rect x="380" y="70" width="300" height="160" rx="12" fill="#0f172a" stroke="#38bdf8"/>';
      m += '<text x="530" y="110" text-anchor="middle" fill="#7dd3fc" font-size="16">lactose (milk sugar)</text>';
      m += '<text x="530" y="140" text-anchor="middle" fill="#cbd5e1" font-size="13">β-D-Gal-(1→4)-β-D-Glc</text>';
      m += '<text x="530" y="168" text-anchor="middle" fill="#94a3b8" font-size="12">free C1 on glucose (zoom p.8)</text>';
      m += '<text x="530" y="196" text-anchor="middle" fill="#38bdf8" font-size="13">REDUCING</text>';
      readout(cell("Maltose","2 glucose, α1→4") + cell("Lactose","Gal + Glc, β1→4") + cell("Sucrose","non-reducing"));
      verdict("<b>Intext 10.2:</b> hydrolysis of lactose gives galactose and glucose. Maltose gives only glucose.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.polylab = (function(){
  var mode = "amy";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>α(1→4)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>α(1→6) branch</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>β(1→4) cellulose</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-a">Amylose 15–20%</button>' +
      '<button class="preset-btn" id="p-p">Amylopectin 80–85%</button>' +
      '<button class="preset-btn" id="p-c">Cellulose β</button>' +
      '<button class="preset-btn" id="p-g">Glycogen</button>';
    document.getElementById("p-a").onclick = function(){ setActivePreset(this); mode="amy"; draw(0); };
    document.getElementById("p-p").onclick = function(){ setActivePreset(this); mode="pec"; draw(0); };
    document.getElementById("p-c").onclick = function(){ setActivePreset(this); mode="cel"; draw(0); };
    document.getElementById("p-g").onclick = function(){ setActivePreset(this); mode="gly"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function chain(y, n, col, label){
    var s = '';
    for(var i=0;i<n;i++){
      var x = 50 + i*70;
      s += '<circle cx="'+x+'" cy="'+y+'" r="18" fill="none" stroke="'+col+'" stroke-width="2"/>';
      if(i<n-1) s += '<line x1="'+(x+18)+'" y1="'+y+'" x2="'+(x+52)+'" y2="'+y+'" stroke="'+col+'" stroke-width="2"/>';
    }
    s += '<text x="360" y="'+(y+40)+'" text-anchor="middle" fill="#94a3b8" font-size="12">'+label+'</text>';
    return s;
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "amy"){
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Amylose: water-soluble, unbranched, 200–1000 α-D-(+)-glucose, C1–C4 (zoom p.8)</text>';
      m += chain(140, 9, "#38bdf8", "α(1→4) only — a long linear chain (helix in reality)");
      readout(cell("% of starch","15–20%") + cell("Solubility","water-soluble") + cell("Link","C1–C4 α") + cell("Units","200–1000"));
      verdict("<b>Amylose</b> is the minority, soluble fraction. Do not say ‘starch is amylose’ — four-fifths is amylopectin.");
    } else if(mode === "pec"){
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Amylopectin: insoluble; C1–C4 chain plus C1–C6 branches</text>';
      m += chain(100, 8, "#38bdf8", "");
      m += '<line x1="330" y1="118" x2="330" y2="170" stroke="#fbbf24" stroke-width="3"/>';
      m += '<circle cx="330" cy="190" r="18" fill="none" stroke="#fbbf24" stroke-width="2"/>';
      m += '<circle cx="400" cy="190" r="18" fill="none" stroke="#fbbf24" stroke-width="2"/>';
      m += '<line x1="348" y1="190" x2="382" y2="190" stroke="#fbbf24" stroke-width="2"/>';
      m += '<text x="360" y="240" fill="#fbbf24" font-size="13" text-anchor="middle">branch = C1–C6</text>';
      readout(cell("% of starch","80–85%") + cell("Solubility","insoluble") + cell("Chain","C1–C4 α") + cell("Branch","C1–C6 α"));
      verdict("<b>Zoom p.8:</b> amylopectin is a branched polymer of α-D-glucose. Glycogen is similar but more highly branched.");
    } else if(mode === "cel"){
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Cellulose: most abundant organic substance of the plant kingdom — β-D-glucose C1–C4</text>';
      m += chain(140, 9, "#34d399", "β(1→4) unbranched — wood, cotton, paper");
      readout(cell("Anomer","β") + cell("Link","C1–C4") + cell("Branches","none") + cell("We digest?","no (no cellulase)"));
      verdict("<b>Ex 10.8:</b> starch is α (plus branches in amylopectin); cellulose is β and unbranched. Same monomer, opposite job.");
    } else {
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Glycogen = animal starch (liver, muscle, brain; also yeast and fungi)</text>';
      m += chain(90, 8, "#38bdf8", "");
      m += '<line x1="190" y1="108" x2="190" y2="155" stroke="#fbbf24" stroke-width="3"/>';
      m += '<line x1="400" y1="108" x2="400" y2="155" stroke="#fbbf24" stroke-width="3"/>';
      m += '<line x1="540" y1="108" x2="540" y2="155" stroke="#fbbf24" stroke-width="3"/>';
      m += '<circle cx="190" cy="175" r="14" fill="none" stroke="#fbbf24" stroke-width="2"/>';
      m += '<circle cx="400" cy="175" r="14" fill="none" stroke="#fbbf24" stroke-width="2"/>';
      m += '<circle cx="540" cy="175" r="14" fill="none" stroke="#fbbf24" stroke-width="2"/>';
      m += '<text x="360" y="230" fill="#cbd5e1" font-size="13" text-anchor="middle">More highly branched than amylopectin. Enzymes release glucose on demand.</text>';
      readout(cell("Where","liver, muscle, brain") + cell("Vs starch","no amylose fraction; more branches"));
      verdict("<b>§10.1.4(iii) / Ex 10.6:</b> glycogen is the animal storage polymer. Structure like amylopectin, rather more highly branched.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.zwitterion = (function(){
  var pH = 1;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>cation (acid)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>zwitterion</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>anion (base)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="z-z">Zwitterion (neutral pH)</button>' +
      '<button class="preset-btn" id="z-e">Table 10.2 essential ten</button>';
    document.getElementById("z-z").onclick = function(){ setActivePreset(this); pH=7; draw(0); };
    document.getElementById("z-e").onclick = function(){ setActivePreset(this); pH=-1; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Medium</span><span class="val" id="ctrl-ph">zwitterion</span></div>' +
      '<input type="range" id="ctrl-ph-range" min="0" max="2" step="1" value="1"></div>';
    document.getElementById("ctrl-ph-range").oninput = function(){
      pH = Number(this.value);
      document.getElementById("ctrl-ph").textContent = pH===0?"acid":(pH===1?"zwitterion":"base");
      draw(App.state.t);
    };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(pH === -1){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Table 10.2 asterisks in this reprint — ten essential amino acids</text>';
      var ess = ["Val V","Leu L","Ile I","Arg R","Lys K","Thr T","Met M","Phe F","Trp W","His H"];
      ess.forEach(function(e,i){
        var x = 40 + (i%5)*136, y = 70 + Math.floor(i/5)*90;
        m += '<rect x="'+x+'" y="'+y+'" width="120" height="60" rx="8" fill="#0f172a" stroke="#fbbf24"/>';
        m += '<text x="'+(x+60)+'" y="'+(y+36)+'" text-anchor="middle" fill="#fde68a" font-size="14">'+e+'</text>';
      });
      readout(cell("Essential","10 asterisks") + cell("Includes","Arg and His") + cell("Glycine","non-essential, achiral"));
      verdict("<b>Zoom p.10–11:</b> quote the asterisks. Non-essential: Gly, Ala, Glu, Asp, Gln, Asn, Ser, Cys, Tyr, Pro. Summary: ‘ten amino acids are called essential’.");
    } else {
      var form = pH===0 ? "R–CH(NH₃⁺)–COOH  (cation)" : (pH===1 ? "R–CH(NH₃⁺)–COO⁻  (zwitterion)" : "R–CH(NH₂)–COO⁻  (anion)");
      var col = pH===0 ? "#f87171" : (pH===1 ? "#38bdf8" : "#34d399");
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Amphoteric because both ends can take or lose a proton (zoom p.12)</text>';
      m += '<rect x="110" y="90" width="500" height="90" rx="12" fill="#0f172a" stroke="'+col+'" stroke-width="3"/>';
      m += '<text x="360" y="145" text-anchor="middle" fill="'+col+'" font-size="20">'+form+'</text>';
      m += '<text x="360" y="220" fill="#cbd5e1" font-size="13" text-anchor="middle">High m.p. and water solubility vs halo acids (Intext 10.4) — internal salt lattice + ion–dipole hydration.</text>';
      m += '<text x="360" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">Except glycine, α-carbon is asymmetric; most natural amino acids are L (–NH₂ on the left).</text>';
      readout(cell("Net charge", pH===0?"+1":(pH===1?"0":"−1"), col) + cell("Acid site","NH₃⁺") + cell("Base site","COO⁻"));
      verdict("<b>§10.2.2:</b> the zwitterion is electrically net-neutral but charged at both ends. That is why amino acids behave like salts, not like simple amines or carboxylic acids.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.peptidelab = (function(){
  var mode = "di";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>peptide –CO–NH–</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>H-bond in α-helix</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-d">Glycylalanine</button>' +
      '<button class="preset-btn" id="p-h">α-helix / β-sheet</button>' +
      '<button class="preset-btn" id="p-n">Denaturation (egg / milk)</button>';
    document.getElementById("p-d").onclick = function(){ setActivePreset(this); mode="di"; App.resetTimeline(); App.play(); };
    document.getElementById("p-h").onclick = function(){ setActivePreset(this); mode="helix"; draw(0); };
    document.getElementById("p-n").onclick = function(){ setActivePreset(this); mode="den"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "di"){
      var joined = t > 2;
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Zoom p.12: carboxyl of glycine + amino of alanine → glycylalanine + H₂O</text>';
      m += '<rect x="40" y="90" width="200" height="80" rx="10" fill="#0f172a" stroke="#38bdf8"/>';
      m += '<text x="140" y="138" text-anchor="middle" fill="#7dd3fc" font-size="14">Gly  H₂N–CH₂–COOH</text>';
      m += '<rect x="480" y="90" width="200" height="80" rx="10" fill="#0f172a" stroke="#34d399"/>';
      m += '<text x="580" y="138" text-anchor="middle" fill="#86efac" font-size="14">Ala  H₂N–CH(CH₃)–COOH</text>';
      if(!joined){
        m += '<text x="360" y="140" fill="#64748b" font-size="16">+</text>';
      } else {
        m += '<rect x="210" y="100" width="300" height="60" rx="8" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>';
        m += '<text x="360" y="136" text-anchor="middle" fill="#fde68a" font-size="14">Gly–CO–NH–Ala   peptide bond</text>';
        m += '<text x="360" y="210" fill="#94a3b8" font-size="13" text-anchor="middle">−H₂O. N-terminus is Gly (written first). Reverse dipeptide = alanylglycine, a different molecule.</text>';
      }
      readout(cell("Bond","–CO–NH– amide","#fbbf24") + cell("Lost","H₂O") + cell("Name","glycylalanine (Gly-Ala)"));
      verdict("<b>§10.2.3:</b> >10 residues = polypeptide; >100 residues and >10 000 u = protein. Insulin (51 AA) is still a protein because of its native fold.");
    } else if(mode === "helix"){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">2° structure: α-helix (Fig. 10.1) and β-pleated sheet (Fig. 10.2)</text>';
      // helix
      for(var i=0;i<6;i++){
        var x = 80 + i*18;
        var y = 80 + (i%2)*16;
        m += '<circle cx="'+x+'" cy="'+y+'" r="10" fill="none" stroke="#38bdf8"/>';
        if(i>1) m += '<line x1="'+(80+(i-2)*18)+'" y1="'+(80+((i-2)%2)*16)+'" x2="'+x+'" y2="'+y+'" stroke="#38bdf8" stroke-dasharray="3 3"/>';
      }
      m += '<text x="140" y="140" text-anchor="middle" fill="#7dd3fc" font-size="12">α-helix</text>';
      m += '<text x="140" y="158" text-anchor="middle" fill="#94a3b8" font-size="11">–NH···O=C adjacent turn</text>';
      m += '<text x="140" y="176" text-anchor="middle" fill="#94a3b8" font-size="11">right-handed screw</text>';
      // sheet
      m += '<line x1="380" y1="90" x2="680" y2="90" stroke="#fbbf24" stroke-width="3"/>';
      m += '<line x1="380" y1="120" x2="680" y2="120" stroke="#fbbf24" stroke-width="3"/>';
      m += '<line x1="380" y1="150" x2="680" y2="150" stroke="#fbbf24" stroke-width="3"/>';
      m += '<line x1="430" y1="90" x2="430" y2="150" stroke="#fbbf24" stroke-dasharray="4 3"/>';
      m += '<line x1="530" y1="90" x2="530" y2="150" stroke="#fbbf24" stroke-dasharray="4 3"/>';
      m += '<line x1="630" y1="90" x2="630" y2="150" stroke="#fbbf24" stroke-dasharray="4 3"/>';
      m += '<text x="530" y="180" text-anchor="middle" fill="#fde68a" font-size="12">β-pleated sheet — intermolecular H-bonds</text>';
      m += '<text x="360" y="230" fill="#cbd5e1" font-size="12" text-anchor="middle">3° = overall fold (fibrous vs globular). 4° = arrangement of subunits (haemoglobin, Fig. 10.4).</text>';
      m += '<text x="360" y="254" fill="#94a3b8" font-size="12" text-anchor="middle">Stabilising forces for 2°/3°: H-bonds, disulphides, van der Waals, electrostatics.</text>';
      readout(cell("α-helix","intramolecular H-bond") + cell("β-sheet","intermolecular H-bond") + cell("Fibrous","keratin, myosin") + cell("Globular","insulin, albumins"));
      verdict("<b>Ex 10.14:</b> α-helix is backbone –NH···O=C H-bonding, not side-chain disulphides (those are 3°).");
    } else {
      var unfold = Math.min(1, t/4);
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Denaturation: heat or pH — 2° and 3° lost, 1° sequence intact</text>';
      var coils = 8;
      for(var i=0;i<coils;i++){
        var a = i/coils * Math.PI*2;
        var r = 40 + unfold*70;
        var x = 220 + r*Math.cos(a + t);
        var y = 150 + r*0.4*Math.sin(a + t);
        m += '<circle cx="'+x+'" cy="'+y+'" r="8" fill="#38bdf8" opacity="'+(1-0.4*unfold)+'"/>';
      }
      m += '<text x="520" y="130" fill="#e2e8f0" font-size="14">boiled egg white</text>';
      m += '<text x="520" y="154" fill="#e2e8f0" font-size="14">milk curd (lactic acid)</text>';
      m += '<text x="520" y="186" fill="#94a3b8" font-size="12">peptide bonds still there</text>';
      readout(cell("1°","intact") + cell("2° helix/sheet","destroyed") + cell("3° fold","destroyed") + cell("Activity","lost"));
      verdict("<b>Intext 10.5:</b> the egg’s water is absorbed/adsorbed onto the coagulated (denatured) proteins — not a mysterious disappearance.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.vitaminlab = (function(){
  var mode = "table";
  var vits = [
    {n:"A", src:"fish liver oil, carrots, butter, milk", dis:"xerophthalmia, night blindness", sol:"fat"},
    {n:"B₁", src:"yeast, milk, greens, cereals", dis:"beri beri", sol:"water"},
    {n:"B₂", src:"milk, egg white, liver, kidney", dis:"cheilosis", sol:"water"},
    {n:"B₆", src:"yeast, milk, egg yolk, cereals, grams", dis:"convulsions", sol:"water"},
    {n:"B₁₂", src:"meat, fish, egg, curd", dis:"pernicious anaemia", sol:"water* stored"},
    {n:"C", src:"citrus, amla, greens", dis:"scurvy (bleeding gums)", sol:"water"},
    {n:"D", src:"sunlight, fish, egg yolk", dis:"rickets / osteomalacia", sol:"fat"},
    {n:"E", src:"wheat-germ, sunflower oil", dis:"fragile RBCs, muscle weakness", sol:"fat"},
    {n:"K", src:"green leafy vegetables", dis:"increased clotting time", sol:"fat"}
  ];
  var idx = 0;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>fat-soluble A,D,E,K</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>water-soluble B, C</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="v-t">Table 10.3</button>' +
      '<button class="preset-btn" id="v-e">Sucrase Ea 6.22 → 2.15</button>' +
      '<button class="preset-btn" id="v-h">Hormones (insulin / I₂ salt)</button>';
    document.getElementById("v-t").onclick = function(){ setActivePreset(this); mode="table"; draw(0); };
    document.getElementById("v-e").onclick = function(){ setActivePreset(this); mode="enz"; draw(0); };
    document.getElementById("v-h").onclick = function(){ setActivePreset(this); mode="horm"; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Vitamin row</span><span class="val" id="ctrl-v">A</span></div>' +
      '<input type="range" id="ctrl-v-range" min="0" max="8" step="1" value="0"></div>';
    document.getElementById("ctrl-v-range").oninput = function(){ idx = Number(this.value); draw(App.state.t); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "table"){
      var v = vits[idx];
      document.getElementById("ctrl-v").textContent = v.n;
      var col = v.sol.indexOf("fat")===0 ? "#fbbf24" : "#38bdf8";
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Table 10.3 (zooms p.16–17) — sources and deficiency as printed</text>';
      m += '<rect x="80" y="60" width="560" height="180" rx="12" fill="#0f172a" stroke="'+col+'" stroke-width="2"/>';
      m += '<text x="360" y="110" text-anchor="middle" fill="'+col+'" font-size="36">vitamin '+v.n+'</text>';
      m += '<text x="360" y="150" text-anchor="middle" fill="#e2e8f0" font-size="14">Sources: '+v.src+'</text>';
      m += '<text x="360" y="178" text-anchor="middle" fill="#fda4af" font-size="14">Deficiency: '+v.dis+'</text>';
      m += '<text x="360" y="210" text-anchor="middle" fill="#94a3b8" font-size="13">'+v.sol+'</text>';
      readout(cell("Class", v.sol, col) + cell("Stored?", v.sol.indexOf("fat")===0 || v.n==="B₁₂" ? "yes" : "no — urine"));
      verdict("<b>Intext 10.6:</b> vitamin C cannot be stored (water-soluble, excreted). B₁₂ is the water-soluble exception that is stored. Excess of vitamins is harmful.");
    } else if(mode === "enz"){
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">§10.3.1 in this reprint: two Ea numbers. Mechanism ‘has been discussed’ — no lock-and-key figure here.</text>';
      m += '<rect x="80" y="80" width="240" height="140" rx="10" fill="#0f172a" stroke="#f87171"/>';
      m += '<text x="200" y="130" text-anchor="middle" fill="#fca5a5" font-size="14">acid hydrolysis</text>';
      m += '<text x="200" y="168" text-anchor="middle" fill="#f87171" font-size="22">6.22 kJ mol⁻¹</text>';
      m += '<rect x="400" y="80" width="240" height="140" rx="10" fill="#0f172a" stroke="#34d399"/>';
      m += '<text x="520" y="130" text-anchor="middle" fill="#86efac" font-size="14">sucrase</text>';
      m += '<text x="520" y="168" text-anchor="middle" fill="#34d399" font-size="22">2.15 kJ mol⁻¹</text>';
      m += '<text x="360" y="250" fill="#cbd5e1" font-size="13" text-anchor="middle">Maltase: C₁₂H₂₂O₁₁ → 2 C₆H₁₂O₆. Ending -ase. Almost all enzymes are globular proteins.</text>';
      readout(cell("Ea acid","6.22 kJ mol⁻¹") + cell("Ea sucrase","2.15 kJ mol⁻¹") + cell("ΔEa","4.07 kJ mol⁻¹"));
      verdict("<b>Zoom p.15:</b> enzymes reduce the magnitude of activation energy. Quote 6.22 and 2.15 — do not invent a rate enhancement the PDF never printed.");
    } else {
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">§10.6 Hormones — intercellular messengers in blood</text>';
      var rows = [
        "Insulin ↓ blood glucose; glucagon ↑ blood glucose",
        "Thyroxine (iodinated tyrosine): low → hypothyroidism / goitre",
        "Iodised table salt (NaI) — the reprint’s public-health sentence",
        "Addison’s (failed adrenal cortex): hypoglycemia, weakness, stress",
        "Testosterone / estradiol / progesterone — secondary sex characters"
      ];
      rows.forEach(function(r,i){
        m += '<text x="40" y="'+(70+i*38)+'" fill="#e2e8f0" font-size="14">'+r+'</text>';
      });
      readout(cell("Classes","steroid · polypeptide · AA derivative") + cell("Iodine","iodised salt"));
      verdict("<b>§10.6:</b> chemical nature — steroids (estrogens, androgens), polypeptides (insulin, endorphins), amino-acid derivatives (epinephrine, norepinephrine, thyroxine).");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.dnapair = (function(){
  var mode = "pair";
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A–T</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>C–G</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="n-p">Fig. 10.7 complementary pairs</button>' +
      '<button class="preset-btn" id="n-u">Nucleoside vs nucleotide</button>' +
      '<button class="preset-btn" id="n-r">DNA vs RNA</button>';
    document.getElementById("n-p").onclick = function(){ setActivePreset(this); mode="pair"; App.resetTimeline(); App.play(); };
    document.getElementById("n-u").onclick = function(){ setActivePreset(this); mode="nuc"; draw(0); };
    document.getElementById("n-r").onclick = function(){ setActivePreset(this); mode="rna"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function base(x,y,letter,col){
    return '<rect x="'+(x-28)+'" y="'+(y-18)+'" width="56" height="36" rx="8" fill="#0f172a" stroke="'+col+'" stroke-width="2"/>' +
      '<text x="'+x+'" y="'+(y+6)+'" text-anchor="middle" fill="'+col+'" font-size="18" font-weight="700">'+letter+'</text>';
  }
  function hbonds(x1,x2,y,n,col){
    var s = '';
    for(var i=0;i<n;i++){
      var yy = y - 8 + i*8;
      s += '<line x1="'+x1+'" y1="'+yy+'" x2="'+x2+'" y2="'+yy+'" stroke="'+col+'" stroke-dasharray="4 3" stroke-width="2"/>';
    }
    return s;
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "pair"){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 10.7 (zoom p.19): adenine with thymine, cytosine with guanine — complementary, not identical</text>';
      var pairs = [
        {a:"A", b:"T", y:70, n:2, c:"#38bdf8"},
        {a:"T", b:"A", y:118, n:2, c:"#38bdf8"},
        {a:"G", b:"C", y:166, n:3, c:"#fbbf24"},
        {a:"C", b:"G", y:214, n:3, c:"#fbbf24"}
      ];
      var slide = (t%8)/8 * 6;
      pairs.forEach(function(p){
        m += base(180, p.y+slide, p.a, p.c);
        m += hbonds(214, 506, p.y+slide, p.n, p.c);
        m += base(540, p.y+slide, p.b, p.c);
      });
      m += '<text x="80" y="150" fill="#64748b" font-size="12" transform="rotate(-90 80 150)">5′ → 3′</text>';
      m += '<text x="660" y="150" fill="#64748b" font-size="12" transform="rotate(90 660 150)">5′ → 3′</text>';
      m += '<text x="360" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">H-bond counts (2 for A–T, 3 for G–C) are the standard Watson–Crick model; this reprint’s text states the pairs, Fig. 10.7 draws the rungs.</text>';
      readout(cell("A pairs with","T") + cell("C pairs with","G") + cell("Strands","complementary") + cell("Sugar (DNA)","2-deoxyribose"));
      verdict("<b>Zoom p.19:</b> two nucleic acid chains wound about each other, held by H-bonds between specific pairs. That is how replication copies the parent into two daughters.");
    } else if(mode === "nuc"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 10.5: nucleoside = base@1′–sugar; nucleotide adds phosphate@5′. Fig. 10.6: 5′–3′ phosphodiester</text>';
      m += '<rect x="40" y="70" width="300" height="160" rx="12" fill="#0f172a" stroke="#38bdf8"/>';
      m += '<text x="190" y="110" text-anchor="middle" fill="#7dd3fc" font-size="16">nucleoside</text>';
      m += '<text x="190" y="140" text-anchor="middle" fill="#cbd5e1" font-size="13">base attached at C1′ of pentose</text>';
      m += '<text x="190" y="168" text-anchor="middle" fill="#94a3b8" font-size="12">sugar carbons numbered 1′, 2′, 3′…</text>';
      m += '<rect x="380" y="70" width="300" height="160" rx="12" fill="#0f172a" stroke="#fbbf24"/>';
      m += '<text x="530" y="110" text-anchor="middle" fill="#fde68a" font-size="16">nucleotide</text>';
      m += '<text x="530" y="140" text-anchor="middle" fill="#cbd5e1" font-size="13">nucleoside + phosphate at 5′</text>';
      m += '<text x="530" y="168" text-anchor="middle" fill="#94a3b8" font-size="12">polymer: 5′–3′ phosphodiester</text>';
      m += '<text x="360" y="260" fill="#cbd5e1" font-size="12" text-anchor="middle">Intext 10.7: a DNA nucleotide containing thymine hydrolyses to thymine + 2-deoxyribose + phosphoric acid.</text>';
      readout(cell("1′","base") + cell("5′","phosphate") + cell("3′–5′","phosphodiester") + cell("Primary structure","base sequence"));
      verdict("<b>Ex 10.22:</b> nucleoside vs nucleotide is one phosphate. Polynucleotide = nucleic acid.");
    } else {
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">DNA vs RNA as this reprint prints them (zooms p.18–20)</text>';
      var rows = [
        ["Sugar","β-D-2-deoxyribose","β-D-ribose"],
        ["Unique base","thymine (T)","uracil (U)"],
        ["Shared bases","A, G, C","A, G, C"],
        ["Strands","double helix (Fig. 10.7)","single (may fold back)"],
        ["Role","heredity, replication, message","m / r / t-RNA: protein synthesis"]
      ];
      m += '<text x="250" y="58" fill="#38bdf8" font-size="14">DNA</text>';
      m += '<text x="520" y="58" fill="#fbbf24" font-size="14">RNA</text>';
      rows.forEach(function(r,i){
        var y = 84+i*36;
        m += '<text x="30" y="'+y+'" fill="#94a3b8" font-size="12">'+r[0]+'</text>';
        m += '<text x="250" y="'+y+'" fill="#7dd3fc" font-size="12">'+r[1]+'</text>';
        m += '<text x="520" y="'+y+'" fill="#fde68a" font-size="12">'+r[2]+'</text>';
      });
      readout(cell("RNA types","m-RNA, r-RNA, t-RNA") + cell("Intext 10.8","no A=U, G=C in RNA hydrolysate"));
      verdict("<b>Intext 10.8:</b> RNA hydrolysate has no simple base ratio — RNA is single-stranded, so Chargaff pairing is not forced. DNA fingerprinting uses the unique sequence (forensics, paternity, disaster victims).");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
