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

function pyramid(cx, cy, label, angle){
  var s = '<polygon points="'+(cx)+','+(cy-48)+' '+(cx-52)+','+(cy+36)+' '+(cx+52)+','+(cy+36)+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
  s += '<circle cx="'+cx+'" cy="'+(cy-8)+'" r="14" fill="#1e293b" stroke="#f8fafc" stroke-width="2"/>';
  s += '<text x="'+cx+'" y="'+(cy-3)+'" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="700">N</text>';
  s += '<text x="'+cx+'" y="'+(cy-62)+'" text-anchor="middle" fill="#94a3b8" font-size="11">lone pair</text>';
  s += '<text x="'+cx+'" y="'+(cy+58)+'" text-anchor="middle" fill="#fbbf24" font-size="12">'+label+'  ∠ '+angle+'</text>';
  return s;
}

window.SIMS.amineclass = (function(){
  var mode = "pyramid";
  var items = [
    {id:"naph1", name:"Intext 9.1(i) 1-naphthylamine", cls:"1°", iupac:"naphthalen-1-amine", why:"–NH₂ on C1 of naphthalene; one C–N at nitrogen"},
    {id:"naph3", name:"Intext 9.1(ii) N,N-dimethylnaphthalen-1-amine", cls:"3°", iupac:"N,N-dimethylnaphthalen-1-amine", why:"N bears two methyls + the naphthyl — no N–H"},
    {id:"pri", name:"Intext 9.1(iii) (C₂H₅)₂CHNH₂", cls:"1°", iupac:"pentan-3-amine", why:"Two ethyls sit on carbon, not nitrogen; N still has two H"},
    {id:"sec", name:"Intext 9.1(iv) (C₂H₅)₂NH", cls:"2°", iupac:"N-ethylethanamine", why:"Two ethyls on nitrogen; one N–H remains"},
    {id:"tab", name:"Table 9.1 N,N-diethylbutan-1-amine", cls:"3°", iupac:"N,N-diethylbutan-1-amine", why:"Common: N,N-diethylbutylamine; N-locants on butan-1-amine"}
  ];
  var sel = 0;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>sp³ N + lone pair</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>1° / 2° / 3°</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="pyramid" id="p-pyr">Fig. 9.1 pyramid (108°)</button>' +
      '<button class="preset-btn" data-preset="classifier" id="p-cls">Intext 9.1 classifier</button>';
    document.getElementById("p-pyr").onclick = function(){ setActivePreset(this); mode="pyramid"; draw(App.state.t); };
    document.getElementById("p-cls").onclick = function(){ setActivePreset(this); mode="class"; draw(App.state.t); };
    var ctr = '<div class="control-item"><div class="control-label"><span>Example</span><span class="val" id="ctrl-ex">1</span></div>' +
      '<input type="range" id="ctrl-ex-range" min="0" max="'+(items.length-1)+'" step="1" value="0"></div>';
    document.getElementById("lab-controls").innerHTML = ctr;
    document.getElementById("ctrl-ex-range").oninput = function(){ sel = Number(this.value); draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "pyramid"){
      var wob = 108 + 1.5*Math.sin(t);
      m += pyramid(360, 140, "trimethylamine (Fig. 9.1)", wob.toFixed(1)+"°");
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Ideal tetrahedral 109.5° — lone pair compresses ∠C–N–C to 108°</text>';
      readout(cell("Hybridisation","sp³") + cell("Geometry","pyramidal") + cell("∠C–N–C (Me₃N)","108°","#fbbf24"));
      verdict("<b>Fig. 9.1:</b> nitrogen is trivalent + one unshared pair. The pair occupies more space than a bonding pair, so trimethylamine is a slightly flattened pyramid.");
    } else {
      var it = items[sel];
      document.getElementById("ctrl-ex").textContent = (sel+1)+" / "+items.length;
      var col = it.cls === "1°" ? "#34d399" : (it.cls === "2°" ? "#fbbf24" : "#38bdf8");
      m += '<text x="360" y="40" fill="#e2e8f0" font-size="16" text-anchor="middle">'+it.name+'</text>';
      m += '<rect x="260" y="70" width="200" height="64" rx="10" fill="#0f172a" stroke="'+col+'" stroke-width="2"/>';
      m += '<text x="360" y="110" fill="'+col+'" font-size="28" text-anchor="middle" font-weight="700">'+it.cls+'</text>';
      m += '<text x="360" y="170" fill="#94a3b8" font-size="14" text-anchor="middle">IUPAC: '+it.iupac+'</text>';
      m += '<text x="360" y="210" fill="#cbd5e1" font-size="13" text-anchor="middle">'+it.why+'</text>';
      readout(cell("Class", it.cls, col) + cell("IUPAC", it.iupac) + cell("Count C–N at N", it.cls === "1°" ? "1" : (it.cls === "2°" ? "2" : "3")));
      verdict("<b>Intext 9.1 / Table 9.1:</b> class is how many hydrogens of NH₃ were replaced — not how many carbons sit somewhere in the formula.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.preplab = (function(){
  var route = "hoffmann";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>1° amine product</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Blocked for Ar–X</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="hoffmann" id="r-h">Hoffmann (one C less)</button>' +
      '<button class="preset-btn" data-preset="gabriel" id="r-g">Gabriel (aliphatic 1° only)</button>' +
      '<button class="preset-btn" data-preset="nitrile" id="r-n">Nitrile ascent (Example 9.2)</button>' +
      '<button class="preset-btn" data-preset="ammonia" id="r-a">Ammonolysis ladder</button>';
    document.getElementById("r-h").onclick = function(){ setActivePreset(this); route="hoffmann"; App.resetTimeline(); };
    document.getElementById("r-g").onclick = function(){ setActivePreset(this); route="gabriel"; App.resetTimeline(); };
    document.getElementById("r-n").onclick = function(){ setActivePreset(this); route="nitrile"; App.resetTimeline(); };
    document.getElementById("r-a").onclick = function(){ setActivePreset(this); route="ammo"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function box(x,y,w,h,label,col){
    return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" fill="#0f172a" stroke="'+col+'" stroke-width="2"/>' +
      '<text x="'+(x+w/2)+'" y="'+(y+h/2+5)+'" text-anchor="middle" fill="#e2e8f0" font-size="12">'+label+'</text>';
  }
  function arrow(x1,y1,x2,y2){
    return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#64748b" stroke-width="2" marker-end="url(#arr)"/>';
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#64748b"/></marker></defs>';
    var phase = Math.min(1, t/2);
    if(route === "hoffmann"){
      m += box(40,110,150,50,"RCONH₂","#94a3b8");
      m += arrow(200,135,250,135);
      m += '<text x="225" y="120" fill="#fbbf24" font-size="11" text-anchor="middle">Br₂ + 4 NaOH</text>';
      m += box(260,110,150,50,"RNH₂  (1° )","#34d399");
      m += box(460,80,220,110,"Na₂CO₃ + 2 NaBr + 2 H₂O","#38bdf8");
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Hoffmann bromamide — the amine has one carbon less than the amide</text>';
      m += '<text x="360" y="250" fill="#cbd5e1" font-size="12" text-anchor="middle">RCONH₂ + Br₂ + 4 NaOH → RNH₂ + Na₂CO₃ + 2 NaBr + 2 H₂O  (zoom p.6)</text>';
      readout(cell("Na left","4") + cell("Na right","2+2=4","#34d399") + cell("Carbon fate","carbonyl → carbonate"));
      verdict("<b>Atom check:</b> 4 Na, 2 Br, and the lost carbonyl carbon as Na₂CO₃. Example 9.3: butanamide → propanamine; benzamide → aniline.");
    } else if(route === "gabriel"){
      m += box(30,100,130,50,"phthalimide","#94a3b8");
      m += arrow(170,125,210,125);
      m += box(210,100,140,50,"K⁺ imide anion","#38bdf8");
      m += arrow(360,125,400,125);
      m += box(400,40,130,50,"R–X aliphatic","#34d399");
      m += box(400,160,130,50,"Ar–X aryl","#f87171");
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Gabriel: SN on alkyl halide, then alkaline hydrolysis → pure 1°</text>';
      var flash = (t % 2 < 1);
      if(flash) m += '<text x="535" y="195" fill="#f87171" font-size="12">NO SN → no aniline</text>';
      readout(cell("Aliphatic RX","1° amine","#34d399") + cell("Aryl halide","no reaction","#f87171") + cell("Why preferred","alkylates N only once"));
      verdict("<b>Ex 9.12:</b> aromatic 1° amines cannot be prepared by Gabriel because aryl halides do not undergo nucleophilic substitution with the phthalimide anion.");
    } else if(route === "nitrile"){
      m += box(40,110,140,50,"CH₃CH₂Cl","#94a3b8");
      m += arrow(190,135,240,135);
      m += '<text x="215" y="120" fill="#fbbf24" font-size="10" text-anchor="middle">NaCN</text>';
      m += box(250,110,160,50,"CH₃CH₂CN","#38bdf8");
      m += arrow(420,135,470,135);
      m += '<text x="445" y="120" fill="#fbbf24" font-size="10" text-anchor="middle">H₂/Ni</text>';
      m += box(480,110,200,50,"CH₃CH₂CH₂NH₂","#34d399");
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Example 9.2 — ascent of the amine series by one carbon</text>';
      m += '<text x="360" y="230" fill="#cbd5e1" font-size="12" text-anchor="middle">Benzyl chloride → PhCH₂CN → PhCH₂CH₂NH₂ (2-phenylethanamine)</text>';
      readout(cell("Start C","2") + cell("Nitrile C","3") + cell("Amine C","3 (ascent +1 from RX)"));
      verdict("<b>Example 9.2 (zoom p.6):</b> ethanolic NaCN then reduction. Complementary to Hoffmann, which shortens by one carbon.");
    } else {
      var labs = ["RNH₂ (1°)","R₂NH (2°)","R₃N (3°)","R₄N⁺ X⁻"];
      for(var i=0;i<4;i++){
        var on = t > i*1.2;
        m += box(40+i*170, 120, 150, 50, labs[i], on ? "#34d399" : "#334155");
        if(i<3) m += arrow(190+i*170,145, 210+i*170,145);
      }
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Ammonolysis at 373 K — excess NH₃ favours 1°. Reactivity RI > RBr > RCl</text>';
      readout(cell("T","373 K") + cell("Problem","mixture 1°/2°/3°/4°") + cell("Fix","excess NH₃, then Hinsberg"));
      verdict("<b>§9.4.2:</b> the 1° amine is itself a nucleophile. Free amine is liberated from the ammonium salt with a strong base.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.hbondbp = (function(){
  var data = [
    {name:"n-C₄H₉NH₂", mass:73, bp:350.8, kind:"1° amine", col:"#34d399"},
    {name:"(C₂H₅)₂NH", mass:73, bp:329.3, kind:"2° amine", col:"#fbbf24"},
    {name:"C₂H₅N(CH₃)₂", mass:73, bp:310.5, kind:"3° amine", col:"#38bdf8"},
    {name:"C₂H₅CH(CH₃)₂", mass:72, bp:300.8, kind:"alkane", col:"#94a3b8"},
    {name:"n-C₄H₉OH", mass:74, bp:390.3, kind:"alcohol", col:"#f87171"}
  ];
  var highlight = 0;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>1°</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>2°</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>3°</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>alcohol</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="table" id="h-tab">Table 9.2 bars</button>' +
      '<button class="preset-btn" data-preset="figure" id="h-fig">Fig. 9.2 H-bonds in 1°</button>';
    document.getElementById("h-tab").onclick = function(){ setActivePreset(this); highlight=0; draw(App.state.t); };
    document.getElementById("h-fig").onclick = function(){ setActivePreset(this); highlight=1; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(highlight === 0){
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Table 9.2 — molar mass 72–74; b.p. ranked by H-bonding, not mass</text>';
      var max = 400;
      data.forEach(function(d,i){
        var h = (d.bp/max)*200 * Math.min(1, t/1.5 + 0.2);
        var x = 70 + i*130;
        m += '<rect x="'+x+'" y="'+(250-h)+'" width="90" height="'+h+'" fill="'+d.col+'" opacity="0.85"/>';
        m += '<text x="'+(x+45)+'" y="'+(244-h)+'" text-anchor="middle" fill="#e2e8f0" font-size="12">'+d.bp+' K</text>';
        m += '<text x="'+(x+45)+'" y="270" text-anchor="middle" fill="#94a3b8" font-size="10">'+d.name+'</text>';
        m += '<text x="'+(x+45)+'" y="286" text-anchor="middle" fill="'+d.col+'" font-size="10">'+d.kind+'</text>';
      });
      readout(cell("1° n-BuNH₂","350.8 K","#34d399") + cell("2° Et₂NH","329.3 K","#fbbf24") + cell("3° EtNMe₂","310.5 K","#38bdf8") + cell("n-BuOH","390.3 K","#f87171"));
      verdict("<b>Order of isomeric amines:</b> 1° > 2° > 3°. Alcohols still win: EN(O)=3.5 > EN(N)=3.0, so butan-1-ol out-boils butan-1-amine by 39.5 K.");
    } else {
      var y = 140;
      function amine(x, extra){
        return '<text x="'+x+'" y="'+y+'" fill="#e2e8f0" font-size="14" text-anchor="middle">R–N–H</text>' + extra;
      }
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 9.2 — intermolecular N–H···N association in primary amines</text>';
      m += amine(180, '');
      m += amine(360, '');
      m += amine(540, '');
      var dash = 4 + 2*Math.sin(t*2);
      m += '<line x1="230" y1="'+(y-6)+'" x2="310" y2="'+(y-6)+'" stroke="#38bdf8" stroke-dasharray="'+dash+' 4" stroke-width="2"/>';
      m += '<line x1="410" y1="'+(y-6)+'" x2="490" y2="'+(y-6)+'" stroke="#38bdf8" stroke-dasharray="'+dash+' 4" stroke-width="2"/>';
      m += '<text x="360" y="200" fill="#cbd5e1" font-size="13" text-anchor="middle">1° has two N–H (network) · 2° has one · 3° has none — so b.p. 1° > 2° > 3°</text>';
      readout(cell("Donor N–H","1° two, 2° one, 3° zero") + cell("Acceptor","lone pair on N in all three"));
      verdict("<b>Fig. 9.2:</b> tertiary amines can still accept a hydrogen bond from water (they dissolve if small) but cannot donate N–H to a neighbour, so their neat boiling points stay low.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.aminebasicity = (function(){
  var phase = "aq-me";
  var table = [
    {n:"MeNH₂", pk:3.38, g:2},
    {n:"Me₂NH", pk:3.27, g:3},
    {n:"Me₃N", pk:4.22, g:4},
    {n:"EtNH₂", pk:3.29, g:2},
    {n:"Et₂NH", pk:3.00, g:3},
    {n:"Et₃N", pk:3.25, g:4},
    {n:"NH₃", pk:4.75, g:1},
    {n:"PhNH₂", pk:9.38, g:0},
    {n:"PhCH₂NH₂", pk:4.70, g:2},
    {n:"PhNHMe", pk:9.30, g:0},
    {n:"PhNMe₂", pk:8.92, g:0}
  ];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>smaller pK_b = stronger base</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>aniline (conjugated)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="aqueous-methyl" id="b-me">Aqueous methyl order</button>' +
      '<button class="preset-btn" data-preset="aqueous-ethyl" id="b-et">Aqueous ethyl order</button>' +
      '<button class="preset-btn" data-preset="gas-phase" id="b-gas">Gas phase 3°>2°>1°</button>' +
      '<button class="preset-btn" data-preset="aniline" id="b-an">Aniline resonance (5 vs 2)</button>';
    document.getElementById("b-me").onclick = function(){ setActivePreset(this); phase="aq-me"; draw(0); };
    document.getElementById("b-et").onclick = function(){ setActivePreset(this); phase="aq-et"; draw(0); };
    document.getElementById("b-gas").onclick = function(){ setActivePreset(this); phase="gas"; draw(0); };
    document.getElementById("b-an").onclick = function(){ setActivePreset(this); phase="aniline"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function bars(keys, title, note){
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">'+title+'</text>';
    var subset = table.filter(function(r){ return keys.indexOf(r.n) >= 0; });
    subset.sort(function(a,b){ return a.pk - b.pk; });
    subset.forEach(function(d,i){
      var w = Math.max(20, (10 - d.pk)*70);
      var y = 50 + i*36;
      var col = d.pk > 8 ? "#f87171" : (d.pk < 3.3 ? "#34d399" : "#38bdf8");
      m += '<text x="20" y="'+(y+16)+'" fill="#cbd5e1" font-size="12">'+d.n+'</text>';
      m += '<rect x="140" y="'+y+'" width="'+w+'" height="22" fill="'+col+'" opacity="0.9"/>';
      m += '<text x="'+(150+w)+'" y="'+(y+16)+'" fill="#e2e8f0" font-size="12">pK_b '+d.pk.toFixed(2)+'</text>';
    });
    m += '<text x="360" y="285" fill="#94a3b8" font-size="12" text-anchor="middle">'+note+'</text>';
    return m;
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m;
    if(phase === "aq-me"){
      m = bars(["Me₂NH","MeNH₂","Me₃N","NH₃"], "Table 9.3 aqueous methyl series — solvation knocks 3° below 1°",
        "(CH₃)₂NH > CH₃NH₂ > (CH₃)₃N > NH₃   (pK_b 3.27, 3.38, 4.22, 4.75)");
      readout(cell("Me₂NH","3.27","#34d399") + cell("MeNH₂","3.38") + cell("Me₃N","4.22") + cell("NH₃","4.75"));
      verdict("<b>Aqueous methyl:</b> +I wants 3° > 2° > 1°, but Me₃NH⁺ is poorly solvated. Secondary wins. Gas phase restores 3° > 2° > 1°.");
    } else if(phase === "aq-et"){
      m = bars(["Et₂NH","Et₃N","EtNH₂","NH₃"], "Table 9.3 aqueous ethyl series — larger alkyl, 3° climbs above 1°",
        "(C₂H₅)₂NH > (C₂H₅)₃N > C₂H₅NH₂ > NH₃   (pK_b 3.00, 3.25, 3.29, 4.75)");
      readout(cell("Et₂NH","3.00 strongest aliphatic","#34d399") + cell("Et₃N","3.25") + cell("EtNH₂","3.29") + cell("NH₃","4.75"));
      verdict("<b>Example 9.4:</b> (C₂H₅)₂NH > C₂H₅NH₂ > NH₃ > C₆H₅NH₂. Ethyl 3° is stronger than ethyl 1° in water; methyl 3° is not.");
    } else if(phase === "gas"){
      m = bars(["Me₃N","Me₂NH","MeNH₂","NH₃"], "Gas phase: only +I. Order 3° > 2° > 1° > NH₃ (no solvation, no steric H-bond hindrance)",
        "The reprint: ‘this trend is followed in the gaseous phase’ (zoom p.10).");
      readout(cell("Driver","+I of alkyl") + cell("Missing in gas","solvation of RNH₃⁺") + cell("Aqueous twist","steric + H-bond"));
      verdict("<b>Zoom p.10–11:</b> a subtle interplay of inductive effect, solvation and steric hindrance decides aqueous basicity. Do not quote the gas order for a pK_b table.");
    } else {
      m = '<rect width="720" height="300" fill="#09131d"/>';
      m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Aniline: 5 resonating structures; anilinium: 2 Kekulé forms (zoom p.11)</text>';
      var rings = ["I :NH₂","II ⁺NH₂ o-","III ⁺NH₂ p-","IV ⁺NH₂ o-","V :NH₂"];
      rings.forEach(function(lb,i){
        var x = 70 + i*130;
        m += '<circle cx="'+x+'" cy="120" r="28" fill="none" stroke="#fbbf24" stroke-width="2"/>';
        m += '<text x="'+x+'" y="125" text-anchor="middle" fill="#fbbf24" font-size="11">'+lb+'</text>';
        if(i<4) m += '<text x="'+(x+64)+'" y="125" fill="#64748b" font-size="16">↔</text>';
      });
      m += '<circle cx="250" cy="230" r="28" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="470" cy="230" r="28" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="250" y="235" text-anchor="middle" fill="#38bdf8" font-size="11">⁺NH₃ I</text>';
      m += '<text x="360" y="235" fill="#64748b" font-size="16" text-anchor="middle">↔</text>';
      m += '<text x="470" y="235" text-anchor="middle" fill="#38bdf8" font-size="11">⁺NH₃ II</text>';
      m += '<text x="360" y="270" fill="#94a3b8" font-size="12" text-anchor="middle">anilinium — only two forms. Free aniline is more stabilised → weaker base. pK_b 9.38 vs NH₃ 4.75</text>';
      readout(cell("Aniline forms","5","#fbbf24") + cell("Anilinium forms","2","#38bdf8") + cell("pK_b PhNH₂","9.38") + cell("pK_b PhCH₂NH₂","4.70 (not conjugated)"));
      verdict("<b>§9.6.1(b):</b> –OCH₃, –CH₃ increase arylamine basicity; –NO₂, –SO₃H, –COOH, –X decrease it. Benzylamine is aliphatic-like.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.hinsberg = (function(){
  var kind = "pri";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>dissolves in alkali</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>insoluble sulphonamide</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#64748b;"></span><span>no reaction</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="primary" id="h-1">1° ethanamine</button>' +
      '<button class="preset-btn" data-preset="secondary" id="h-2">2° diethylamine</button>' +
      '<button class="preset-btn" data-preset="tertiary" id="h-3">3° triethylamine</button>' +
      '<button class="preset-btn" data-preset="carbylamine" id="h-c">Carbylamine (1° only)</button>';
    document.getElementById("h-1").onclick = function(){ setActivePreset(this); kind="pri"; App.resetTimeline(); App.play(); };
    document.getElementById("h-2").onclick = function(){ setActivePreset(this); kind="sec"; App.resetTimeline(); App.play(); };
    document.getElementById("h-3").onclick = function(){ setActivePreset(this); kind="ter"; App.resetTimeline(); App.play(); };
    document.getElementById("h-c").onclick = function(){ setActivePreset(this); kind="carb"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function flask(x,y,fill,label){
    return '<path d="M '+(x-18)+' '+(y-40)+' h 36 v 18 l 16 36 h -68 l 16 -36 z" fill="'+fill+'" stroke="#e2e8f0" stroke-width="2"/>' +
      '<text x="'+x+'" y="'+(y+30)+'" text-anchor="middle" fill="#cbd5e1" font-size="11">'+label+'</text>';
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Hinsberg: C₆H₅SO₂Cl (replaced these days by p-toluenesulphonyl chloride)</text>';
    if(kind === "pri"){
      var dissolved = t > 2;
      m += flask(200, 150, "#1e293b", "BsCl + EtNH₂");
      m += '<text x="300" y="140" fill="#64748b" font-size="20">→</text>';
      m += flask(420, 150, dissolved ? "#14532d" : "#1e293b", dissolved ? "in alkali — dissolved" : "sulphonamide");
      m += '<text x="360" y="230" fill="#cbd5e1" font-size="13" text-anchor="middle">N-ethylbenzenesulphonamide: remaining N–H is acidic (sulphonyl withdraws) → alkali-soluble</text>';
      readout(cell("Class","1°") + cell("Product","C₆H₅SO₂NHEt") + cell("Alkali","SOLUBLE","#34d399"));
      verdict("<b>Zoom p.13:</b> the hydrogen attached to nitrogen in the 1° sulphonamide is strongly acidic. Sodium salt goes into water; that is the extractive separation.");
    } else if(kind === "sec"){
      m += flask(200, 150, "#1e293b", "BsCl + Et₂NH");
      m += '<text x="300" y="140" fill="#64748b" font-size="20">→</text>';
      m += flask(420, 150, "#78350f", "solid / organic layer");
      m += '<text x="360" y="230" fill="#cbd5e1" font-size="13" text-anchor="middle">N,N-diethylbenzenesulphonamide: no N–H, not acidic, insoluble in alkali</text>';
      readout(cell("Class","2°") + cell("Product","C₆H₅SO₂NEt₂") + cell("Alkali","INSOLUBLE","#fbbf24"));
      verdict("<b>Zoom p.14:</b> 2° product stays out of alkali. Filter or extract; hydrolyse later if you need the free amine.");
    } else if(kind === "ter"){
      m += flask(200, 150, "#1e293b", "BsCl + Et₃N");
      m += '<text x="300" y="140" fill="#64748b" font-size="20">→</text>';
      m += flask(420, 150, "#334155", "unreacted 3° amine");
      m += '<text x="360" y="230" fill="#cbd5e1" font-size="13" text-anchor="middle">Tertiary amines do not react with benzenesulphonyl chloride. Recover as the free base (soluble in HCl).</text>';
      readout(cell("Class","3°") + cell("Product","none") + cell("Alkali","no sulphonamide","#64748b"));
      verdict("<b>Separation:</b> alkali extracts 1° as salt; 2° sulphonamide is the alkali-insoluble solid; 3° is the unreacted amine. Ex 9.6.");
    } else {
      var wob = 4*Math.sin(t*3);
      m += '<text x="360" y="120" fill="#fbbf24" font-size="18" text-anchor="middle" transform="rotate('+wob+' 360 120)">R–NC  foul isocyanide</text>';
      m += '<text x="360" y="170" fill="#cbd5e1" font-size="14" text-anchor="middle">RNH₂ + CHCl₃ + 3 KOH  →  R–NC + 3 KCl + 3 H₂O</text>';
      m += '<text x="360" y="210" fill="#94a3b8" font-size="13" text-anchor="middle">2° and 3° silent. Aniline gives phenyl isocyanide (Ex 9.11 i).</text>';
      readout(cell("Test","carbylamine") + cell("Who reacts","1° aliphatic and aromatic") + cell("2° / 3°","no RNC"));
      verdict("<b>Zoom p.13:</b> isocyanide test is for primary amines only. Complementary to Hinsberg, which also separates.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.anilineeas = (function(){
  var mode = "br";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#e2e8f0;"></span><span>2,4,6-tribromo (white)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>meta from anilinium</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="bromination" id="e-br">Br₂ water → tribromo</button>' +
      '<button class="preset-btn" data-preset="nitration" id="e-no">Direct nitration 51/47/2</button>' +
      '<button class="preset-btn" data-preset="protected" id="e-ac">Protect: acetanilide → p-nitro</button>' +
      '<button class="preset-btn" data-preset="friedel-crafts" id="e-fc">No Friedel–Crafts</button>';
    document.getElementById("e-br").onclick = function(){ setActivePreset(this); mode="br"; App.resetTimeline(); };
    document.getElementById("e-no").onclick = function(){ setActivePreset(this); mode="no"; App.resetTimeline(); };
    document.getElementById("e-ac").onclick = function(){ setActivePreset(this); mode="ac"; App.resetTimeline(); };
    document.getElementById("e-fc").onclick = function(){ setActivePreset(this); mode="fc"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function hex(cx,cy,subs){
    var r = 36;
    var pts = [];
    for(var i=0;i<6;i++){
      var a = -Math.PI/2 + i*Math.PI/3;
      pts.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1));
    }
    var s = '<polygon points="'+pts.join(' ')+'" fill="none" stroke="#94a3b8" stroke-width="2"/>';
    (subs||[]).forEach(function(su){
      var a = -Math.PI/2 + su.i*Math.PI/3;
      var x = cx + (r+16)*Math.cos(a), y = cy + (r+16)*Math.sin(a);
      s += '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="'+su.c+'" font-size="12">'+su.t+'</text>';
    });
    return s;
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "br"){
      m += hex(200,150,[{i:0,t:"NH₂",c:"#38bdf8"}]);
      m += '<text x="320" y="155" fill="#64748b" font-size="18">+ 3 Br₂(aq) →</text>';
      m += hex(520,150,[{i:0,t:"NH₂",c:"#38bdf8"},{i:1,t:"Br",c:"#e2e8f0"},{i:3,t:"Br",c:"#e2e8f0"},{i:5,t:"Br",c:"#e2e8f0"}]);
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Room temperature: white ppt of 2,4,6-tribromoaniline — too activated for mono-Br</text>';
      readout(cell("T","room temp") + cell("Product","2,4,6-tribromoaniline") + cell("Colour","white ppt"));
      verdict("<b>§9.6.7(a):</b> protect as acetanilide if you want p-bromoaniline (Ex 9.8 vii). –NHCOCH₃ is a milder activator because the lone pair is shared with C=O.");
    } else if(mode === "no"){
      m += '<text x="360" y="36" fill="#94a3b8" font-size="13" text-anchor="middle">HNO₃ / H₂SO₄ / 288 K — anilinium is meta-directing (zoom p.15)</text>';
      var rows = [{l:"p-nitroaniline",p:51,c:"#38bdf8"},{l:"m-nitroaniline",p:47,c:"#f87171"},{l:"o-nitroaniline",p:2,c:"#fbbf24"}];
      rows.forEach(function(r,i){
        var y = 70+i*60;
        m += '<text x="20" y="'+(y+18)+'" fill="#cbd5e1" font-size="13">'+r.l+'</text>';
        m += '<rect x="180" y="'+y+'" width="'+(r.p*8)+'" height="28" fill="'+r.c+'"/>';
        m += '<text x="'+(190+r.p*8)+'" y="'+(y+20)+'" fill="#e2e8f0" font-size="14">'+r.p+'%</text>';
      });
      readout(cell("para","51%","#38bdf8") + cell("meta","47%","#f87171") + cell("ortho","2%","#fbbf24") + cell("T","288 K"));
      verdict("<b>Zoom p.15:</b> 51 / 47 / 2. Quote these numbers — they are why ‘–NH₂ is o,p-directing’ is not the whole nitration story.");
    } else if(mode === "ac"){
      m += hex(90,150,[{i:0,t:"NH₂",c:"#38bdf8"}]);
      m += '<text x="175" y="155" fill="#64748b" font-size="12">Ac₂O</text>';
      m += hex(280,150,[{i:0,t:"NHAc",c:"#34d399"}]);
      m += '<text x="365" y="155" fill="#64748b" font-size="12">HNO₃</text>';
      m += hex(470,150,[{i:0,t:"NHAc",c:"#34d399"},{i:3,t:"NO₂",c:"#f87171"}]);
      m += '<text x="555" y="155" fill="#64748b" font-size="12">H₃O⁺</text>';
      m += hex(650,150,[{i:0,t:"NH₂",c:"#38bdf8"},{i:3,t:"NO₂",c:"#f87171"}]);
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Protected nitration: p-nitroacetanilide is the major product → p-nitroaniline</text>';
      readout(cell("Protect","acetanilide") + cell("Major","para") + cell("Why","–NHAc less activating than –NH₂"));
      verdict("<b>§9.6.7(b):</b> acetylation then nitration then hydrolysis is the controlled route to p-nitroaniline. Sulphonation at 453–473 K gives sulphanilic acid (zwitterion).");
    } else {
      m += hex(240,150,[{i:0,t:"NH₂",c:"#38bdf8"}]);
      m += '<text x="360" y="120" fill="#f87171" font-size="16">+ AlCl₃ → salt</text>';
      m += hex(500,150,[{i:0,t:"⁺NH₃",c:"#f87171"}]);
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">No Friedel–Crafts: nitrogen becomes positive and deactivates the ring</text>';
      m += '<text x="360" y="250" fill="#cbd5e1" font-size="13" text-anchor="middle">Ex 9.3(v). The Lewis acid is consumed as a salt, not as a catalyst.</text>';
      readout(cell("Catalyst","AlCl₃") + cell("What happens","anilinium-type salt") + cell("EAS","deactivated"));
      verdict("<b>Zoom p.15 last paragraph:</b> aniline does not undergo Friedel–Crafts alkylation or acetylation for this reason.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.diazocoupling = (function(){
  var mode = "sand";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f97316;"></span><span>p-hydroxyazobenzene (orange)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>p-aminoazobenzene (yellow)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="sandmeyer" id="d-s">Sandmeyer / Gatterman</button>' +
      '<button class="preset-btn" data-preset="replace" id="d-r">Replace by I, F, H, OH, NO₂</button>' +
      '<button class="preset-btn" data-preset="coupling" id="d-c">Coupling dyes</button>';
    document.getElementById("d-s").onclick = function(){ setActivePreset(this); mode="sand"; draw(0); };
    document.getElementById("d-r").onclick = function(){ setActivePreset(this); mode="rep"; draw(0); };
    document.getElementById("d-c").onclick = function(){ setActivePreset(this); mode="coup"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "sand"){
      m += '<text x="360" y="30" fill="#94a3b8" font-size="13" text-anchor="middle">Diazotise at 273–278 K, then displace N₂ (zoom p.16–17)</text>';
      m += '<text x="360" y="70" fill="#e2e8f0" font-size="14" text-anchor="middle">C₆H₅NH₂ + NaNO₂ + 2 HCl → C₆H₅N₂⁺Cl⁻ + NaCl + 2 H₂O</text>';
      var rows = [
        ["Cu₂Cl₂ / HCl","ArCl  (Sandmeyer)"],
        ["Cu₂Br₂ / HBr","ArBr  (Sandmeyer)"],
        ["CuCN / KCN","ArCN  (Sandmeyer)"],
        ["Cu / HCl or HBr","ArCl / ArBr  (Gatterman, lower yield)"]
      ];
      rows.forEach(function(r,i){
        m += '<rect x="80" y="'+(100+i*42)+'" width="260" height="34" rx="6" fill="#0f172a" stroke="#38bdf8"/>';
        m += '<text x="210" y="'+(122+i*42)+'" text-anchor="middle" fill="#7dd3fc" font-size="13">'+r[0]+'</text>';
        m += '<text x="380" y="'+(122+i*42)+'" fill="#64748b" font-size="14">→</text>';
        m += '<text x="420" y="'+(122+i*42)+'" fill="#e2e8f0" font-size="13">'+r[1]+'</text>';
      });
      readout(cell("T diazotisation","273–278 K") + cell("Sandmeyer","Cu(I)") + cell("Gatterman","Cu powder") + cell("Yield","Sandmeyer better"));
      verdict("<b>§9.9 A.1:</b> Sandmeyer yield is better than Gatterman. Aryl fluorides, iodides and cyanides are the substitutions benzene will not do by direct methods.");
    } else if(mode === "rep"){
      var items = [
        ["KI","ArI + N₂  (no copper)"],
        ["HBF₄ then Δ","ArF + BF₃ + N₂"],
        ["H₃PO₂ or EtOH","ArH  (EtOH → ethanal)"],
        ["H₂O, 283 K","ArOH  (phenol)"],
        ["HBF₄ then NaNO₂/Cu, Δ","ArNO₂"]
      ];
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Other displacements of nitrogen — N₂ is the leaving group</text>';
      items.forEach(function(r,i){
        m += '<text x="40" y="'+(70+i*40)+'" fill="#7dd3fc" font-size="13">'+r[0]+'</text>';
        m += '<text x="320" y="'+(70+i*40)+'" fill="#e2e8f0" font-size="13">'+r[1]+'</text>';
      });
      readout(cell("Iodide","KI") + cell("Fluoride","HBF₄, heat") + cell("Phenol","283 K") + cell("Hydride","H₃PO₂"));
      verdict("<b>Ex 9.11:</b> (ii) H₃PO₂ → benzene; (iv) EtOH → benzene + ethanal; (vii) HBF₄ then NaNO₂/Cu → nitrobenzene.");
    } else {
      var mix = Math.min(1, t/3);
      var orange = "rgb(" + Math.round(80+175*mix) + "," + Math.round(40+80*mix) + ",20)";
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Retention of the diazo group — coupling (zoom p.18)</text>';
      m += '<circle cx="180" cy="130" r="34" fill="none" stroke="#94a3b8" stroke-width="2"/>';
      m += '<text x="180" y="135" text-anchor="middle" fill="#7dd3fc" font-size="11">N₂⁺</text>';
      m += '<text x="270" y="135" fill="#64748b" font-size="16">+</text>';
      m += '<circle cx="360" cy="130" r="34" fill="none" stroke="#94a3b8" stroke-width="2"/>';
      m += '<text x="360" y="135" text-anchor="middle" fill="#34d399" font-size="11">PhOH</text>';
      m += '<text x="450" y="135" fill="#64748b" font-size="16">→</text>';
      m += '<rect x="490" y="96" width="180" height="68" rx="8" fill="'+orange+'"/>';
      m += '<text x="580" y="136" text-anchor="middle" fill="#fff" font-size="12">p-HO–N=N–Ph</text>';
      m += '<text x="360" y="210" fill="#fb923c" font-size="13" text-anchor="middle">p-hydroxyazobenzene — orange dye (alkaline phenol)</text>';
      m += '<text x="360" y="236" fill="#fbbf24" font-size="13" text-anchor="middle">Aniline (acid) → p-aminoazobenzene — yellow dye</text>';
      m += '<text x="360" y="270" fill="#94a3b8" font-size="12" text-anchor="middle">Electrophilic substitution at para of the activated ring. Extended –N=N– chromophore.</text>';
      readout(cell("Phenol / OH⁻","orange","#fb923c") + cell("Aniline / H⁺","yellow","#fbbf24") + cell("Bond","–N=N– kept"));
      verdict("<b>Zoom p.18:</b> coupling keeps the diazo group. That is the industrial azo-dye reaction; Sandmeyer loses N₂ as gas.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
