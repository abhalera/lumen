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

window.SIMS.classnom = (function(){
  var kind = "1alc";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Alcohol C(sp³)–OH</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Phenol / ether</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c1">1° alcohol</button>' +
      '<button class="preset-btn" id="c2">2° / 3°</button>' +
      '<button class="preset-btn" id="c3">Allylic / benzylic</button>' +
      '<button class="preset-btn" id="c4">Phenol</button>' +
      '<button class="preset-btn" id="c5">Ether</button>';
    document.getElementById("c1").onclick = function(){ setActivePreset(this); kind="1alc"; draw(0); };
    document.getElementById("c2").onclick = function(){ setActivePreset(this); kind="23"; draw(0); };
    document.getElementById("c3").onclick = function(){ setActivePreset(this); kind="allyl"; draw(0); };
    document.getElementById("c4").onclick = function(){ setActivePreset(this); kind="ph"; draw(0); };
    document.getElementById("c5").onclick = function(){ setActivePreset(this); kind="eth"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var t="", n="";
    if(kind==="1alc"){ t="Primary alcohol  RCH₂OH  e.g. propan-1-ol"; n="§7.1: classified by number of –OH (mono/di/tri) and by carbon: 1°, 2°, 3°. IUPAC: alkanol, lowest locant to OH."; }
    else if(kind==="23"){ t="2° R₂CHOH (propan-2-ol) · 3° R₃COH (2-methylpropan-2-ol)"; n="Lucas test: 3° immediate turbidity with ZnCl₂/HCl, 2° in minutes, 1° not at room temperature."; }
    else if(kind==="allyl"){ t="Allylic  CH₂=CHCH₂OH  ·  benzylic  PhCH₂OH"; n="Intext 7.1–7.2: allylic alcohols have OH on sp³ carbon next to C=C. Vinylic OH is on sp² carbon of C=C."; }
    else if(kind==="ph"){ t="Phenol  Ar–OH  (OH on sp² aryl carbon)"; n="IUPAC: phenol, methylphenols = cresols. Not alcohols — different acidity and C–O chemistry."; }
    else { t="Ether  R–O–R′  (alkoxyalkanes)"; n="Table 7.2: CH₃OCH₃ methoxymethane (dimethyl ether). Unsymmetrical: smaller alkyl as alkoxy. Anisole = methoxybenzene."; }
    m += '<text x="360" y="80" fill="#e2e8f0" font-size="18" text-anchor="middle">' + t + '</text>';
    m += '<text x="360" y="160" fill="#94a3b8" font-size="13" text-anchor="middle">Tables 7.1–7.2 · common vs IUPAC names in this reprint</text>';
    svg.innerHTML = m;
    readout(cell("Class", kind));
    verdict("<b>§7.1–7.2:</b> " + n);
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.hbonds = (function(){
  var mode = "bp";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>H-bonding</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="h-bp">b.p. vs ethers / alkanes</button>' +
      '<button class="preset-btn" id="h-sol">Water solubility</button>' +
      '<button class="preset-btn" id="h-onp">o- vs p-nitrophenol steam</button>';
    document.getElementById("h-bp").onclick = function(){ setActivePreset(this); mode="bp"; draw(0); };
    document.getElementById("h-sol").onclick = function(){ setActivePreset(this); mode="sol"; draw(0); };
    document.getElementById("h-onp").onclick = function(){ setActivePreset(this); mode="onp"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="bp"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Intermolecular O–H···O hydrogen bonds raise boiling points of alcohols and phenols</text>';
      var items = [["butane","~0",40,"#64748b"],["MeOMe","low",70,"#94a3b8"],["EtOH","78 °C",160,"#38bdf8"],["PhOH","182 °C",200,"#f59e0b"]];
      items.forEach(function(b,i){
        var x = 80+i*160;
        m += '<rect x="'+x+'" y="'+(230-b[2])+'" width="90" height="'+b[2]+'" fill="'+b[3]+'" rx="4"/>';
        m += '<text x="'+(x+45)+'" y="252" fill="#e2e8f0" font-size="12" text-anchor="middle">'+b[0]+'</text>';
        m += '<text x="'+(x+45)+'" y="'+(218-b[2])+'" fill="#e2e8f0" font-size="11" text-anchor="middle">'+b[1]+'</text>';
      });
      readout(cell("EtOH b.p.","78 °C") + cell("MeOCH₃","much lower") + cell("Cause","H-bonds"));
      verdict("<b>Ex 7.4, 7.22:</b> propanol H-bonds; butane only van der Waals. Ethanol H-bonds; methoxymethane cannot donate H.");
    } else if(mode==="sol"){
      m += '<text x="360" y="80" fill="#e2e8f0" font-size="16" text-anchor="middle">Lower alcohols mix with water — they H-bond to H₂O</text>';
      m += '<text x="360" y="130" fill="#94a3b8" font-size="14" text-anchor="middle">As the hydrophobic alkyl chain grows, solubility falls.</text>';
      m += '<text x="360" y="180" fill="#94a3b8" font-size="14" text-anchor="middle">Ethers: oxygen can accept H-bonds, so solubility ≈ isomeric alcohols, b.p. ≈ alkanes.</text>';
      readout(cell("Driver","H-bond to water") + cell("Limit","long R chain"));
      verdict("<b>Ex 7.5:</b> hydrocarbons cannot H-bond with water, so they are far less soluble than alcohols of similar mass.");
    } else {
      m += '<text x="360" y="50" fill="#94a3b8" font-size="13" text-anchor="middle">Ex 7.8 steam distillation of nitrophenols</text>';
      m += '<text x="200" y="130" fill="#34d399" font-size="16" text-anchor="middle">o-nitrophenol</text>';
      m += '<text x="200" y="160" fill="#94a3b8" font-size="12" text-anchor="middle">intramolecular H-bond</text>';
      m += '<text x="200" y="185" fill="#34d399" font-size="12" text-anchor="middle">steam-volatile</text>';
      m += '<text x="520" y="130" fill="#f87171" font-size="16" text-anchor="middle">p-nitrophenol</text>';
      m += '<text x="520" y="160" fill="#94a3b8" font-size="12" text-anchor="middle">intermolecular H-bond</text>';
      m += '<text x="520" y="185" fill="#f87171" font-size="12" text-anchor="middle">not steam-volatile</text>';
      m += '<text x="360" y="250" fill="#e2e8f0" font-size="13" text-anchor="middle">Intramolecular H-bonding also lowers b.p. of the ortho isomer relative to para.</text>';
      readout(cell("Steam volatile","o-nitrophenol") + cell("H-bond","intra vs inter"));
      verdict("<b>Ex 7.8:</b> ortho isomer is steam-volatile because it does not associate intermolecularly.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.prepalc = (function(){
  var mode = "hb";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Alcohol route</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Phenol route</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-hb">Hydroboration–oxidation</button>' +
      '<button class="preset-btn" id="p-h3">Acid hydration</button>' +
      '<button class="preset-btn" id="p-gr">Grignard + carbonyl</button>' +
      '<button class="preset-btn" id="p-cu">Cumene → phenol</button>' +
      '<button class="preset-btn" id="p-dow">Dow / diazonium</button>';
    document.getElementById("p-hb").onclick = function(){ setActivePreset(this); mode="hb"; draw(0); };
    document.getElementById("p-h3").onclick = function(){ setActivePreset(this); mode="h3"; draw(0); };
    document.getElementById("p-gr").onclick = function(){ setActivePreset(this); mode="gr"; draw(0); };
    document.getElementById("p-cu").onclick = function(){ setActivePreset(this); mode="cu"; draw(0); };
    document.getElementById("p-dow").onclick = function(){ setActivePreset(this); mode="dow"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var eq="", n="";
    if(mode==="hb"){ eq="RCH=CH₂  +  (BH₃)₂  then H₂O₂/OH⁻  →  RCH₂CH₂OH"; n="Anti-Markovnikov, syn addition. Ex 7.6: propene → propan-1-ol this way; acid hydration gives propan-2-ol."; }
    else if(mode==="h3"){ eq="CH₂=CH₂ + H₂O  (H⁺)  →  CH₃CH₂OH"; n="Ex 7.11 mechanism: protonation → carbocation → water capture → deprotonation. 2°/3° C⁺ may rearrange (Ex 7.33)."; }
    else if(mode==="gr"){ eq="RMgX + HCHO → 1° ; RCHO → 2° ; R₂C=O → 3°  (then H₃O⁺)"; n="Carbon of Grignard is nucleophilic. Also catalytic H₂ or LiAlH₄/NaBH₄ reduce carbonyls to alcohols."; }
    else if(mode==="cu"){ eq="PhCHMe₂ + O₂ → cumene hydroperoxide  (H⁺)  →  PhOH + Me₂C=O"; n="Industrial phenol + acetone from cumene (Ex 7.9)."; }
    else { eq="PhCl + NaOH, 623 K, 300 atm → PhONa  (H⁺)  →  PhOH"; n="Also: ArSO₃Na fusion; ArN₂⁺ hydrolysis. Ex 7.10, 7.12 (benzene → PhSO₃H → PhOH)."; }
    m += '<text x="360" y="90" fill="#e2e8f0" font-size="15" text-anchor="middle">' + eq + '</text>';
    svg.innerHTML = m;
    readout(cell("Route", mode));
    verdict("<b>§7.4:</b> " + n);
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.phenolacidity = (function(){
  var id = "ph";
  var rows = {
    etoh: {name:"Ethanol", pka:15.9, note:"Alkoxide charge localised on oxygen. Weak acid (pKa ~16)."},
    cresol: {name:"p-Cresol", pka:10.2, note:"Electron-releasing CH₃ destabilises phenoxide slightly. Table 7.3: o/p-cresol 10.2, m 10.1."},
    ph: {name:"Phenol", pka:10.0, note:"Phenoxide is resonance-delocalised (structures I–V, zoom p.15). Phenol is ~10⁶ times more acidic than ethanol."},
    mn: {name:"m-Nitrophenol", pka:8.3, note:"−NO₂ withdraws by −I even at meta. Less effective than o/p resonance."},
    on: {name:"o-Nitrophenol", pka:7.2, note:"o-NO₂: −I plus resonance. Table 7.3 pKa 7.2."},
    pn: {name:"p-Nitrophenol", pka:7.1, note:"p-NO₂ delocalises phenoxide onto the nitro group. pKa 7.1."},
    pic: {name:"2,4,6-Trinitrophenol", pka:0.4, note:"Picric acid — three NO₂ groups. Ex 7.4 strongest of the set. (pKa ~0.4, beyond Table 7.3.)"}
  };
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Stronger acid (low pKa)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Weaker acid</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="a-et">Ethanol 15.9</button>' +
      '<button class="preset-btn" id="a-cr">p-Cresol 10.2</button>' +
      '<button class="preset-btn active" id="a-ph">Phenol 10.0</button>' +
      '<button class="preset-btn" id="a-mn">m-NO₂ 8.3</button>' +
      '<button class="preset-btn" id="a-on">o-NO₂ 7.2</button>' +
      '<button class="preset-btn" id="a-pn">p-NO₂ 7.1</button>' +
      '<button class="preset-btn" id="a-pi">Picric ~0.4</button>';
    [["a-et","etoh"],["a-cr","cresol"],["a-ph","ph"],["a-mn","mn"],["a-on","on"],["a-pn","pn"],["a-pi","pic"]].forEach(function(p){
      document.getElementById(p[0]).onclick = function(){ setActivePreset(this); id=p[1]; App.resetTimeline(); App.play(); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var r = rows[id];
    var ka = Math.pow(10, -r.pka);
    var rel = ka / Math.pow(10, -15.9);
    var u = Math.min(1, t/6);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="32" fill="#94a3b8" font-size="13" text-anchor="middle">Table 7.3 · pKa values of some phenols and ethanol (zoom p.15) · greater pKa = weaker acid</text>';
    m += '<text x="360" y="70" fill="#e2e8f0" font-size="20" text-anchor="middle" font-weight="700">' + r.name + '</text>';
    var w = Math.max(20, Math.min(560, (16-r.pka)/16*560));
    m += '<rect x="80" y="100" width="560" height="22" rx="8" fill="#1e293b"/>';
    m += '<rect x="80" y="100" width="'+w+'" height="22" rx="8" fill="'+(r.pka<8?"#f87171":(r.pka<12?"#f59e0b":"#38bdf8"))+'"/>';
    m += '<text x="360" y="150" fill="#cbd5e1" font-size="14" text-anchor="middle">pKa = '+r.pka+'   ·   Ka ≈ '+ka.toExponential(2)+'   ·   Ka / Ka(EtOH) ≈ '+rel.toExponential(2)+'</text>';
    // phenoxide resonance hint
    m += '<text x="200" y="200" fill="#94a3b8" font-size="12" text-anchor="middle">RO⁻  charge on O</text>';
    m += '<text x="520" y="200" fill="#fbbf24" font-size="12" text-anchor="middle">PhO⁻  5 resonance forms (I–V)</text>';
    m += '<text x="360" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">EWG (NO₂) at o/p help; EDG (CH₃) hurt. Ex 7.4 order: propanol &lt; 4-methylphenol &lt; phenol &lt; 3-nitro &lt; 3,5-dinitro &lt; picric</text>';
    svg.innerHTML = m;
    readout(cell("pKa", String(r.pka), r.pka<8?"#f87171":"#38bdf8") + cell("vs ethanol", rel.toExponential(1)+"×") + cell("Ionisation", Math.round(u*100)+"%"));
    verdict("<b>Acidity:</b> " + r.note + " Phenol + aq. NaOH → sodium phenoxide (alcohols do not).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.rxnalc = (function(){
  var mode = "ox";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>C–O chemistry</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="r-ox">Oxidation 1°/2°/3°</button>' +
      '<button class="preset-btn" id="r-de">Acid dehydration</button>' +
      '<button class="preset-btn" id="r-lu">Lucas / HX</button>' +
      '<button class="preset-btn" id="r-rearr">C⁺ rearrangement (Ex 7.33)</button>';
    document.getElementById("r-ox").onclick = function(){ setActivePreset(this); mode="ox"; draw(0); };
    document.getElementById("r-de").onclick = function(){ setActivePreset(this); mode="de"; App.resetTimeline(); App.play(); };
    document.getElementById("r-lu").onclick = function(){ setActivePreset(this); mode="lu"; draw(0); };
    document.getElementById("r-rearr").onclick = function(){ setActivePreset(this); mode="rearr"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="ox"){
      m += '<text x="360" y="50" fill="#e2e8f0" font-size="15" text-anchor="middle">1°  —mild→  RCHO  —strong KMnO₄→  RCOOH</text>';
      m += '<text x="360" y="100" fill="#e2e8f0" font-size="15" text-anchor="middle">2°  →  ketone   ·   3°  resistant (no H on carbinol C)</text>';
      m += '<text x="360" y="160" fill="#94a3b8" font-size="13" text-anchor="middle">PCC / Cu at 573 K stop 1° at aldehyde. Alkaline KMnO₄ takes propan-1-ol to propanoate (Ex 7.17).</text>';
      m += '<text x="360" y="210" fill="#94a3b8" font-size="13" text-anchor="middle">NaBH₄ / LiAlH₄ / catalytic H₂ do the reverse (ketone → 2° alcohol).</text>';
      readout(cell("1° strong","carboxylic acid") + cell("2°","ketone") + cell("3°","no oxidation"));
      verdict("<b>§7.4.4:</b> oxidation requires a hydrogen on the carbinol carbon.");
    } else if(mode==="de"){
      var u = Math.min(1,t/6);
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Ex 7.19: acid-catalysed dehydration of ethanol → ethene (E1-like)</text>';
      m += '<text x="360" y="100" fill="#e2e8f0" font-size="14" text-anchor="middle">CH₃CH₂OH  +  H⁺  ⇌  CH₃CH₂OH₂⁺</text>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="14" text-anchor="middle">slow: lose H₂O →  CH₃CH₂⁺   then  lose H⁺  →  CH₂=CH₂</text>';
      m += '<rect x="80" y="190" width="560" height="14" rx="6" fill="#1e293b"/>';
      m += '<rect x="80" y="190" width="'+(560*u)+'" height="14" rx="6" fill="#38bdf8"/>';
      m += '<text x="360" y="240" fill="#94a3b8" font-size="12" text-anchor="middle">Conc. H₂SO₄, 443 K. Lower T / excess alcohol → diethyl ether instead.</text>';
      readout(cell("Catalyst","H⁺") + cell("RDS","loss of water") + cell("Product", u>0.7?"ethene":"oxonium"));
      verdict("<b>Dehydration:</b> 3° > 2° > 1°. Saytzeff alkene when more than one β-H.");
    } else if(mode==="lu"){
      m += '<text x="360" y="70" fill="#e2e8f0" font-size="16" text-anchor="middle">Lucas reagent: anhyd. ZnCl₂ + conc. HCl</text>';
      m += '<text x="360" y="120" fill="#34d399" font-size="14" text-anchor="middle">3° : immediate turbidity (alkyl chloride emulsion)</text>';
      m += '<text x="360" y="155" fill="#f59e0b" font-size="14" text-anchor="middle">2° : turbidity in about 5 minutes</text>';
      m += '<text x="360" y="190" fill="#38bdf8" font-size="14" text-anchor="middle">1° : no turbidity at room temperature</text>';
      m += '<text x="360" y="240" fill="#94a3b8" font-size="13" text-anchor="middle">ROH + HX → RX + H₂O. Phenols do not cleave C–O this way (except Zn dust → benzene).</text>';
      readout(cell("3°","instant") + cell("2°","minutes") + cell("1°","heat needed"));
      verdict("<b>Lucas:</b> distinguishes 1°, 2°, 3° alcohols by carbocation ease.");
    } else {
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Ex 7.33: 3-methylbutan-2-ol + HBr → 2-bromo-2-methylbutane (rearranged)</text>';
      m += '<text x="360" y="100" fill="#e2e8f0" font-size="14" text-anchor="middle">Step I: protonate OH · Step II: lose water → 2° C⁺</text>';
      m += '<text x="360" y="145" fill="#fbbf24" font-size="14" text-anchor="middle">Hydride shift from C-3 → more stable 3° C⁺</text>';
      m += '<text x="360" y="190" fill="#e2e8f0" font-size="14" text-anchor="middle">Step III: Br⁻ captures the 3° carbocation</text>';
      m += '<text x="360" y="240" fill="#94a3b8" font-size="12" text-anchor="middle">Hint in the reprint: secondary carbocation rearranges to tertiary by hydride shift.</text>';
      readout(cell("Was","2° C⁺") + cell("Becomes","3° C⁺") + cell("Shift","H⁻"));
      verdict("<b>Rearrangement:</b> always check whether a 2° C⁺ can become 3° by H⁻ or CH₃⁻ shift.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.rxnph = (function(){
  var mode = "kolbe";
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Phenoxide (more reactive)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="k-k">Kolbe–Schmitt</button>' +
      '<button class="preset-btn" id="k-rt">Reimer–Tiemann</button>' +
      '<button class="preset-btn" id="k-br">Br₂ / HNO₃ / Friedel–Crafts</button>' +
      '<button class="preset-btn" id="k-as">Acetylation → aspirin</button>';
    document.getElementById("k-k").onclick = function(){ setActivePreset(this); mode="kolbe"; draw(0); };
    document.getElementById("k-rt").onclick = function(){ setActivePreset(this); mode="rt"; draw(0); };
    document.getElementById("k-br").onclick = function(){ setActivePreset(this); mode="br"; draw(0); };
    document.getElementById("k-as").onclick = function(){ setActivePreset(this); mode="as"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var t="", n="";
    if(mode==="kolbe"){ t="PhONa + CO₂  (heat, pressure)  then H⁺  →  2-hydroxybenzoic acid (salicylic)"; n="Ex 7.18: phenoxide is even more activating than phenol, so CO₂ carbonates at ortho."; }
    else if(mode==="rt"){ t="PhOH + CHCl₃ + aq. NaOH  →  salicylaldehyde (o-CHO)"; n="Dichlorocarbene :CCl₂ electrophile. Ex 7.17(iv)."; }
    else if(mode==="br"){ t="PhOH + Br₂/H₂O → 2,4,6-tribromophenol (white ppt)"; n="In CS₂, mainly o/p-bromophenol (Ex 7.17). Dil. HNO₃ → o + p-nitrophenol. OH is strongly o,p-directing."; }
    else { t="Salicylic acid + (CH₃CO)₂O  →  aspirin (acetylsalicylic acid)"; n="Acetylation of Ar/ROH with acid chloride needs pyridine to mop up HCl and shift equilibrium."; }
    m += '<text x="360" y="90" fill="#e2e8f0" font-size="15" text-anchor="middle">' + t + '</text>';
    svg.innerHTML = m;
    readout(cell("Reaction", mode));
    verdict("<b>Phenol EAS:</b> " + n);
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.ethersim = (function(){
  var mode = "will";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Williamson SN2</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>HI cleavage</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="e-w">Williamson</button>' +
      '<button class="preset-btn" id="e-lim">Limitation (3° RX)</button>' +
      '<button class="preset-btn" id="e-hi">HI cleavage</button>' +
      '<button class="preset-btn" id="e-an">Anisole EAS</button>';
    document.getElementById("e-w").onclick = function(){ setActivePreset(this); mode="will"; draw(0); };
    document.getElementById("e-lim").onclick = function(){ setActivePreset(this); mode="lim"; draw(0); };
    document.getElementById("e-hi").onclick = function(){ setActivePreset(this); mode="hi"; App.resetTimeline(); App.play(); };
    document.getElementById("e-an").onclick = function(){ setActivePreset(this); mode="an"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="will"){
      m += '<text x="360" y="70" fill="#e2e8f0" font-size="16" text-anchor="middle">R–O⁻ Na⁺  +  R′–X  →  R–O–R′  +  NaX</text>';
      m += '<text x="360" y="120" fill="#94a3b8" font-size="14" text-anchor="middle">SN2: use 1° alkyl halide. Phenoxide + 1° RX → alkyl aryl ether.</text>';
      m += '<text x="360" y="170" fill="#94a3b8" font-size="14" text-anchor="middle">Ex 7.24: 1-propoxypropane from CH₃CH₂CH₂ONa + CH₃CH₂CH₂Br.</text>';
      m += '<text x="360" y="220" fill="#fbbf24" font-size="13" text-anchor="middle">tert-butyl methyl ether: (CH₃)₃CONa + CH₃Br  (not the reverse — 3° RX eliminates)</text>';
      readout(cell("Nu","alkoxide/phenoxide") + cell("Substrate","1° RX") + cell("Mech","SN2"));
      verdict("<b>Williamson:</b> named-ether synthesis. Unsymmetrical ethers: put the hindered partner in the alkoxide.");
    } else if(mode==="lim"){
      m += '<text x="360" y="80" fill="#e2e8f0" font-size="15" text-anchor="middle">If R′X is 2°/3°, alkoxide acts as a base → alkene (E2)</text>';
      m += '<text x="360" y="140" fill="#94a3b8" font-size="14" text-anchor="middle">Ex 7.25, 7.27: acid dehydration of 2°/3° alcohols also gives alkenes, not ethers.</text>';
      m += '<text x="360" y="200" fill="#94a3b8" font-size="14" text-anchor="middle">Only 1° alcohols give ethers cleanly on acid dehydration (excess ROH, lower T).</text>';
      readout(cell("3° RX + RO⁻","alkene") + cell("2°/3° ROH + H⁺","alkene"));
      verdict("<b>Limitation:</b> Williamson fails when the alkyl halide prefers elimination.");
    } else if(mode==="hi"){
      var u = Math.min(1,t/6);
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Ex 7.30 mechanism: HI + methoxymethane</text>';
      m += '<text x="360" y="95" fill="#e2e8f0" font-size="14" text-anchor="middle">CH₃–O–CH₃ + H⁺  ⇌  CH₃–O⁺H–CH₃</text>';
      m += '<text x="360" y="135" fill="#e2e8f0" font-size="14" text-anchor="middle">I⁻ SN2 on methyl  →  CH₃I + CH₃OH   then excess HI → 2 CH₃I + H₂O</text>';
      m += '<text x="360" y="185" fill="#94a3b8" font-size="13" text-anchor="middle">Dialkyl: I attacks the less hindered alkyl. Alkyl aryl: I never attacks the aryl side → PhOH + RI.</text>';
      m += '<text x="360" y="230" fill="#fbbf24" font-size="12" text-anchor="middle">Benzyl ethyl ether: benzyl C⁺ path possible → PhCH₂I + EtOH</text>';
      readout(cell("First product", u<0.5?"oxonium":"MeI + MeOH") + cell("Excess HI","2 MeI"));
      verdict("<b>Cleavage:</b> HI > HBr > HCl. Aryl–O stays intact.");
    } else {
      m += '<text x="360" y="50" fill="#e2e8f0" font-size="15" text-anchor="middle">–OCH₃ activates the ring and directs o/p (Ex 7.29, 7.31)</text>';
      m += '<text x="360" y="110" fill="#94a3b8" font-size="14" text-anchor="middle">Friedel–Crafts alkylation / acylation of anisole: o + p</text>';
      m += '<text x="360" y="150" fill="#94a3b8" font-size="14" text-anchor="middle">Nitration → o- and p-nitroanisole</text>';
      m += '<text x="360" y="190" fill="#94a3b8" font-size="14" text-anchor="middle">Bromination in ethanoic acid → p-bromoanisole mainly</text>';
      m += '<text x="360" y="240" fill="#94a3b8" font-size="13" text-anchor="middle">Lone pair on oxygen conjugates into the ring — same logic as phenol, milder.</text>';
      readout(cell("Director","o,p") + cell("Activity","&gt; benzene"));
      verdict("<b>Anisole EAS:</b> alkoxy is activating and ortho/para directing by resonance.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
