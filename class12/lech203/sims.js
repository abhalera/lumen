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

window.SIMS.carbnom = (function(){
  var row = 0;
  var names = [
    ["HCHO","formaldehyde","methanal"],
    ["CH₃CHO","acetaldehyde","ethanal"],
    ["(CH₃)₂CHCHO","isobutyraldehyde","2-methylpropanal"],
    ["CH₂=CHCHO","acrolein","prop-2-enal"],
    ["PhCHO","benzaldehyde","benzenecarbaldehyde"],
    ["CH₃COCH₂CH₂CH₃","methyl n-propyl ketone","pentan-2-one"],
    ["(CH₃)₂C=CHCOCH₃","mesityl oxide","4-methylpent-3-en-2-one"],
    ["OHCC₆H₄CHO-p","terephthalaldehyde","benzene-1,4-dicarbaldehyde"]
  ];
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>C=O polar, planar sp²</span></div>';
    var nids = ["methanal","ethanal","2-methylpropanal","prop-2-enal","benzaldehyde","pentan-2-one","mesityl-oxide","terephthalaldehyde"];
    document.getElementById("preset-bar").innerHTML =
      names.map(function(n,i){ return '<button class="preset-btn'+(i===0?' active':'')+'" data-preset="'+nids[i]+'" id="n'+i+'">'+(i+1)+'</button>'; }).join("");
    names.forEach(function(_,i){
      document.getElementById("n"+i).onclick = function(){ setActivePreset(this); row=i; draw(0); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var n = names[row];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Table 8.1 · common and IUPAC names (zoom p.04)</text>';
    m += '<text x="360" y="100" fill="#e2e8f0" font-size="20" text-anchor="middle" font-family="ui-monospace,monospace">' + n[0] + '</text>';
    m += '<text x="360" y="150" fill="#f59e0b" font-size="16" text-anchor="middle">Common: ' + n[1] + '</text>';
    m += '<text x="360" y="190" fill="#34d399" font-size="16" text-anchor="middle">IUPAC: ' + n[2] + '</text>';
    m += '<text x="360" y="250" fill="#94a3b8" font-size="13" text-anchor="middle">Alkanal / alkanone. –CHO carbon is C-1. Ketone: lowest locant to C=O.</text>';
    svg.innerHTML = m;
    readout(cell("Common", n[1]) + cell("IUPAC", n[2], "#34d399"));
    verdict("<b>§8.1:</b> carbonyl carbon is sp², planar, Cδ⁺=Oδ⁻. That polarity drives nucleophilic addition.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.prepald = (function(){
  var mode = "rosen";
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Aldehyde route</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Ketone route</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="rosenmund" id="p-r">Rosenmund / Stephen</button>' +
      '<button class="preset-btn" data-preset="etard" id="p-e">Étard / Gattermann–Koch</button>' +
      '<button class="preset-btn" data-preset="oxidation" id="p-ox">Alcohol oxidation</button>' +
      '<button class="preset-btn" data-preset="friedel-crafts" id="p-fc">Friedel–Crafts acyl</button>' +
      '<button class="preset-btn" data-preset="ozonolysis" id="p-ozo">Ozonolysis / alkyne</button>';
    document.getElementById("p-r").onclick = function(){ setActivePreset(this); mode="rosen"; draw(0); };
    document.getElementById("p-e").onclick = function(){ setActivePreset(this); mode="etard"; draw(0); };
    document.getElementById("p-ox").onclick = function(){ setActivePreset(this); mode="ox"; draw(0); };
    document.getElementById("p-fc").onclick = function(){ setActivePreset(this); mode="fc"; draw(0); };
    document.getElementById("p-ozo").onclick = function(){ setActivePreset(this); mode="ozo"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var t="", n="";
    if(mode==="rosen"){ t="RCOCl + H₂ / Pd–BaSO₄ → RCHO   (Rosenmund)"; n="Stephen: RCN + SnCl₂/HCl then H₃O⁺ → RCHO. Both stop at aldehyde."; }
    else if(mode==="etard"){ t="PhCH₃ + CrO₂Cl₂ → PhCHO   (Étard) ·  Gattermann–Koch: CO/HCl/AlCl₃/CuCl → PhCHO"; n="Side-chain oxidation of methylarenes can be stopped at ArCHO (CrO₃/Ac₂O too)."; }
    else if(mode==="ox"){ t="1° ROH  —PCC or Cu, 573 K→  RCHO    2° ROH → ketone"; n="Strong KMnO₄ / K₂Cr₂O₇ take 1° alcohols and aldehydes on to acids."; }
    else if(mode==="fc"){ t="ArH + RCOCl / (RCO)₂O  +  AlCl₃  →  ArCOR"; n="Best aromatic ketone route. Dialkylcadmium + RCOCl gives aliphatic ketones."; }
    else { t="Alkene + O₃ then Zn/H₂O → 2 carbonyls ·  RC≡CH + H₂O/Hg²⁺ → ketone"; n="Ex 8.17(x,xi): methylenecyclohexane ozonolysis / hydration logic."; }
    m += '<text x="360" y="90" fill="#e2e8f0" font-size="15" text-anchor="middle">' + t + '</text>';
    svg.innerHTML = m;
    readout(cell("Route", mode));
    verdict("<b>§8.2:</b> " + n);
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.physcarb = (function(){
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Polar C=O</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>H-bonding (alcohols, acids)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="boiling-points" id="b1">Intext 8.3 boiling points</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var items = [["CH₃CH₂CH₃","lowest",50,"#64748b"],["CH₃OCH₃","weak polar",90,"#94a3b8"],["CH₃CHO","dipole",140,"#38bdf8"],["CH₃CH₂OH","H-bonds",200,"#f59e0b"]];
    items.forEach(function(b,i){
      var x = 80+i*160;
      m += '<rect x="'+x+'" y="'+(230-b[2])+'" width="100" height="'+b[2]+'" fill="'+b[3]+'" rx="4"/>';
      m += '<text x="'+(x+50)+'" y="252" fill="#e2e8f0" font-size="12" text-anchor="middle">'+b[0]+'</text>';
    });
    m += '<text x="360" y="36" fill="#94a3b8" font-size="13" text-anchor="middle">Intext 8.3 (answers p.32): propane &lt; methoxymethane &lt; ethanal &lt; ethanol</text>';
    svg.innerHTML = m;
    readout(cell("Order","alkane &lt; ether &lt; aldehyde &lt; alcohol") + cell("Acid dimer","even higher b.p."));
    verdict("<b>§8.3:</b> Lower aldehydes/ketones are water-soluble (H-bond acceptors). Higher members are not — large hydrophobic chain.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.nucadd = (function(){
  var mode = "mech";
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Nucleophile</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Carbonyl Cδ⁺</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Tetrahedral intermediate</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="mechanism" id="u-m">Fig 8.2 mechanism</button>' +
      '<button class="preset-btn" data-preset="reactivity" id="u-r">Reactivity order</button>' +
      '<button class="preset-btn" data-preset="cyanohydrin" id="u-hcn">HCN cyanohydrin</button>' +
      '<button class="preset-btn" data-preset="acetal" id="u-ac">Acetal / ketal</button>' +
      '<button class="preset-btn" data-preset="nhz" id="u-nz">NH₂Z (oxime, 2,4-DNP)</button>' +
      '<button class="preset-btn" data-preset="benzaldehyde" id="u-bz">Ex 8.3 benzaldehyde</button>';
    document.getElementById("u-m").onclick = function(){ setActivePreset(this); mode="mech"; App.resetTimeline(); App.play(); };
    document.getElementById("u-r").onclick = function(){ setActivePreset(this); mode="reac"; draw(0); };
    document.getElementById("u-hcn").onclick = function(){ setActivePreset(this); mode="hcn"; draw(0); };
    document.getElementById("u-ac").onclick = function(){ setActivePreset(this); mode="ac"; draw(0); };
    document.getElementById("u-nz").onclick = function(){ setActivePreset(this); mode="nz"; draw(0); };
    document.getElementById("u-bz").onclick = function(){ setActivePreset(this); mode="bz"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var u = Math.min(1, t/8);
    if(mode==="mech"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 8.2 · nucleophile attacks perpendicular to the planar sp² carbonyl (zoom p.10)</text>';
      // planar carbonyl
      var tilt = u*0.9;
      m += '<line x1="260" y1="130" x2="460" y2="130" stroke="#64748b" stroke-width="2" stroke-dasharray="6 4"/>';
      m += '<circle cx="360" cy="130" r="18" fill="#f59e0b"/>';
      m += '<text x="360" y="135" fill="#0f172a" font-size="14" text-anchor="middle" font-weight="700">C</text>';
      m += '<circle cx="430" cy="'+(130-20+tilt*40)+'" r="16" fill="#38bdf8"/>';
      m += '<text x="430" y="'+(135-20+tilt*40)+'" fill="#0f172a" font-size="12" text-anchor="middle">O</text>';
      var nuY = 40 + u*90;
      m += '<circle cx="360" cy="'+nuY+'" r="14" fill="#ef4444"/>';
      m += '<text x="360" y="'+(nuY+4)+'" fill="#fff" font-size="10" text-anchor="middle">Nu</text>';
      if(u<0.4){
        m += '<text x="360" y="230" fill="#94a3b8" font-size="13" text-anchor="middle">Step 1 (slow): Nu → Cδ⁺  ·  hybridisation sp² → sp³  ·  alkoxide intermediate</text>';
      } else if(u<0.75){
        m += '<text x="360" y="230" fill="#fbbf24" font-size="13" text-anchor="middle">Tetrahedral alkoxide — carbon now tetrahedral, O⁻</text>';
      } else {
        m += '<text x="360" y="230" fill="#34d399" font-size="13" text-anchor="middle">Step 2 (fast): protonation of O⁻ → electrically neutral adduct (Nu and H across C=O)</text>';
      }
      readout(cell("Geometry","planar → tetrahedral") + cell("Hybrid","sp² → sp³") + cell("RDS","Nu attack"));
      verdict("<b>Nucleophilic addition:</b> opposite of electrophilic addition to alkenes. Play to watch the perpendicular approach.");
    } else if(mode==="reac"){
      m += '<text x="360" y="36" fill="#94a3b8" font-size="13" text-anchor="middle">Steric + electronic: HCHO &gt; RCHO &gt; RCOR  ·  alkyl groups hinder Nu and donate electrons</text>';
      var bars = [["HCHO",180,"#34d399"],["RCHO",130,"#38bdf8"],["Me₂CO",80,"#f59e0b"],["t-Bu₂CO",30,"#f87171"]];
      bars.forEach(function(b,i){
        var x = 90+i*155;
        m += '<rect x="'+x+'" y="'+(230-b[1])+'" width="100" height="'+b[1]+'" fill="'+b[2]+'" rx="4"/>';
        m += '<text x="'+(x+50)+'" y="252" fill="#e2e8f0" font-size="12" text-anchor="middle">'+b[0]+'</text>';
      });
      readout(cell("Ex 8.12(i)","MeCHO &gt; Me₂CO &gt; t-BuCOMe &gt; t-Bu₂CO") + cell("Cause","steric + +I"));
      verdict("<b>Reactivity toward HCN:</b> two large groups in ketones hinder Nu and reduce Cδ⁺.");
    } else if(mode==="hcn"){
      m += '<text x="360" y="70" fill="#e2e8f0" font-size="16" text-anchor="middle">C=O + HCN  (base cat.)  →  cyanohydrin  R₂C(OH)CN</text>';
      m += '<text x="360" y="120" fill="#94a3b8" font-size="14" text-anchor="middle">Pure HCN is slow; CN⁻ is the true nucleophile.</text>';
      m += '<text x="360" y="165" fill="#94a3b8" font-size="14" text-anchor="middle">NaHSO₃ adducts: equilibrium right for most aldehydes, left for most ketones (steric).</text>';
      m += '<text x="360" y="210" fill="#94a3b8" font-size="13" text-anchor="middle">Ex 8.18: 2,2,6-trimethylcyclohexanone is too hindered to form cyanohydrin well.</text>';
      readout(cell("Cat.","base / CN⁻") + cell("Use","C-chain +1"));
      verdict("<b>Cyanohydrins</b> are synthetic intermediates. Bisulphite adducts purify aldehydes (water-soluble, reversible).");
    } else if(mode==="ac"){
      m += '<text x="360" y="60" fill="#e2e8f0" font-size="15" text-anchor="middle">RCHO + ROH / HCl  ⇌  hemiacetal  ⇌  acetal (gem-dialkoxy)</text>';
      m += '<text x="360" y="110" fill="#e2e8f0" font-size="15" text-anchor="middle">Ketone + ethylene glycol / HCl  →  cyclic ethylene ketal</text>';
      m += '<text x="360" y="160" fill="#94a3b8" font-size="13" text-anchor="middle">Dry HCl protonates carbonyl oxygen, boosting electrophilicity.</text>';
      m += '<text x="360" y="205" fill="#94a3b8" font-size="13" text-anchor="middle">Acetals/ketals hydrolyse in aqueous acid — carbonyl protecting groups.</text>';
      readout(cell("Aldehyde","acetal") + cell("Ketone","ketal") + cell("Need","dry HCl"));
      verdict("<b>Ex 8.1:</b> hemiacetal = one OR + one OH on the same carbon; acetal = two OR.");
    } else if(mode==="nz"){
      m += '<text x="360" y="50" fill="#e2e8f0" font-size="15" text-anchor="middle">C=O + H₂N–Z  ⇌  C=N–Z + H₂O   (acid-catalysed addition–elimination)</text>';
      m += '<text x="200" y="110" fill="#94a3b8" font-size="13" text-anchor="middle">Z = OH  oxime</text>';
      m += '<text x="520" y="110" fill="#94a3b8" font-size="13" text-anchor="middle">Z = NH₂  hydrazone</text>';
      m += '<text x="200" y="150" fill="#94a3b8" font-size="13" text-anchor="middle">Z = Ph  Schiff base / imine</text>';
      m += '<text x="520" y="150" fill="#fbbf24" font-size="13" text-anchor="middle">Z = 2,4-(NO₂)₂C₆H₃NH  2,4-DNP</text>';
      m += '<text x="360" y="200" fill="#94a3b8" font-size="13" text-anchor="middle">Semicarbazide: the NH₂ next to C=O is deactivated by resonance — the other NH₂ binds (Ex 8.18).</text>';
      m += '<text x="360" y="245" fill="#94a3b8" font-size="12" text-anchor="middle">2,4-DNP orange/yellow ppt: qualitative test for C=O (Table 8.2).</text>';
      readout(cell("Oxime","C=N–OH") + cell("2,4-DNP","coloured ppt") + cell("Imine","Schiff base"));
      verdict("<b>Table 8.2:</b> N-substituted derivatives of aldehydes and ketones.");
    } else {
      m += '<text x="360" y="70" fill="#e2e8f0" font-size="16" text-anchor="middle">Ex 8.3: benzaldehyde is LESS reactive than propanal</text>';
      m += '<text x="360" y="130" fill="#94a3b8" font-size="14" text-anchor="middle">Aryl resonance donates electron density onto C=O, reducing Cδ⁺.</text>';
      m += '<text x="360" y="180" fill="#94a3b8" font-size="14" text-anchor="middle">Propanal has no such delocalisation — its carbonyl carbon is more electrophilic.</text>';
      m += '<text x="360" y="230" fill="#fbbf24" font-size="13" text-anchor="middle">p-Nitrobenzaldehyde is more reactive than benzaldehyde (Ex 8.4 answers).</text>';
      readout(cell("PhCHO vs EtCHO","less reactive") + cell("Cause","aryl resonance"));
      verdict("<b>Aromatic aldehydes:</b> resonance lowers electrophilicity. EWG on the ring restore it.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.aldolox = (function(){
  var mode = "aldol";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>α-H / enolate</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>No α-H / Cannizzaro</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="aldol" id="o-a">Aldol</button>' +
      '<button class="preset-btn" data-preset="cannizzaro" id="o-c">Cannizzaro</button>' +
      '<button class="preset-btn" data-preset="tollens-fehling" id="o-ox">Tollens / Fehling</button>' +
      '<button class="preset-btn" data-preset="clemmensen-wk" id="o-red">Clemmensen / Wolff–Kishner</button>';
    document.getElementById("o-a").onclick = function(){ setActivePreset(this); mode="aldol"; draw(0); };
    document.getElementById("o-c").onclick = function(){ setActivePreset(this); mode="can"; draw(0); };
    document.getElementById("o-ox").onclick = function(){ setActivePreset(this); mode="ox"; draw(0); };
    document.getElementById("o-red").onclick = function(){ setActivePreset(this); mode="red"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="aldol"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Need at least one α-hydrogen. Base → enolate Nu adds to another C=O</text>';
      m += '<text x="360" y="95" fill="#e2e8f0" font-size="15" text-anchor="middle">2 CH₃CHO  (dil. NaOH)  →  CH₃CH(OH)CH₂CHO  (3-hydroxybutanal)</text>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="15" text-anchor="middle">heat  →  CH₃CH=CHCHO  (but-2-enal, condensation)</text>';
      m += '<text x="360" y="195" fill="#94a3b8" font-size="13" text-anchor="middle">Ex 8.7: methanal, benzaldehyde, 2,2-dimethylbutanal — no α-H → Cannizzaro, not aldol.</text>';
      m += '<text x="360" y="240" fill="#94a3b8" font-size="13" text-anchor="middle">Ketones (cyclohexanone, PhCOCH₂CH₃) still aldol; benzophenone neither (no α-H, not aldehyde).</text>';
      readout(cell("Need","α-H") + cell("Product","β-hydroxy carbonyl") + cell("Then","α,β-unsaturated"));
      verdict("<b>Aldol:</b> ethanal → butane-1,3-diol (reduce) or but-2-enal (dehydrate) — Ex 8.8.");
    } else if(mode==="can"){
      m += '<text x="360" y="50" fill="#e2e8f0" font-size="16" text-anchor="middle">2 RCHO  (conc. NaOH)  →  RCH₂OH  +  RCOO⁻</text>';
      m += '<text x="360" y="110" fill="#94a3b8" font-size="14" text-anchor="middle">Aldehydes with NO α-H: HCHO, PhCHO, Me₃CCHO…</text>';
      m += '<text x="360" y="160" fill="#94a3b8" font-size="14" text-anchor="middle">One molecule is oxidised to carboxylate, the other reduced to alcohol.</text>';
      m += '<text x="360" y="210" fill="#fbbf24" font-size="13" text-anchor="middle">Crossed Cannizzaro: HCHO is usually oxidised; the other aldehyde is reduced.</text>';
      readout(cell("Base","conc. alkali") + cell("α-H","absent") + cell("Redox","disproportionation"));
      verdict("<b>Cannizzaro:</b> intramolecular hydride transfer from the tetrahedral adduct.");
    } else if(mode==="ox"){
      m += '<text x="360" y="55" fill="#e2e8f0" font-size="15" text-anchor="middle">Tollens: [Ag(NH₃)₂]⁺  →  silver mirror   (aldehydes)</text>';
      m += '<text x="360" y="105" fill="#e2e8f0" font-size="15" text-anchor="middle">Fehling: Cu²⁺ tartrate  →  Cu₂O red ppt   (aliphatic aldehydes)</text>';
      m += '<text x="360" y="155" fill="#94a3b8" font-size="13" text-anchor="middle">Ketones do not reduce these reagents. Benzaldehyde: Tollens yes, Fehling no.</text>';
      m += '<text x="360" y="200" fill="#94a3b8" font-size="13" text-anchor="middle">Iodoform: CH₃CO– or CH₃CH(OH)–  →  yellow CHI₃. Distinguishes pentan-2-one / pentan-3-one; ethanal / propanal.</text>';
      readout(cell("Tollens","Ag mirror") + cell("Fehling","Cu₂O") + cell("Iodoform","CHI₃ yellow"));
      verdict("<b>Ex 8.13:</b> these tests separate aldehydes from ketones and methyl ketones from others.");
    } else {
      m += '<text x="360" y="55" fill="#e2e8f0" font-size="15" text-anchor="middle">Clemmensen: Zn–Hg / conc. HCl  ·  C=O → CH₂ (acidic)</text>';
      m += '<text x="360" y="105" fill="#e2e8f0" font-size="15" text-anchor="middle">Wolff–Kishner: NH₂NH₂ / KOH, heat  ·  C=O → CH₂ (basic)</text>';
      m += '<text x="360" y="155" fill="#94a3b8" font-size="14" text-anchor="middle">NaBH₄ / LiAlH₄ / H₂–Ni → alcohols, not hydrocarbons.</text>';
      m += '<text x="360" y="205" fill="#94a3b8" font-size="13" text-anchor="middle">Choose Clemmensen if the molecule is base-sensitive; Wolff–Kishner if acid-sensitive.</text>';
      readout(cell("To CH₂","Clemmensen / WK") + cell("To CHOH","hydride / H₂"));
      verdict("<b>Ex 8.6(v):</b> cyclohexanecarbaldehyde + Zn–Hg/HCl → methylcyclohexane.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.acidnom = (function(){
  var i = 0;
  var rows = [
    ["HCOOH","formic","methanoic"],
    ["CH₃COOH","acetic","ethanoic"],
    ["(CH₃)₃CCH₂COOH","—","3,3-dimethylbutanoic"],
    ["PhCOOH","benzoic","benzenecarboxylic"],
    ["HOOC(CH₂)₄COOH","adipic","hexanedioic"],
    ["CH₂=CHCOOH","acrylic","prop-2-enoic"]
  ];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Carboxyl –COOH</span></div>';
    var cids = ["methanoic","ethanoic","dimethylbutanoic","benzoic","adipic","propenoic"];
    document.getElementById("preset-bar").innerHTML =
      rows.map(function(r,k){ return '<button class="preset-btn'+(k===0?' active':'')+'" data-preset="'+cids[k]+'" id="c'+k+'">'+(k+1)+'</button>'; }).join("") +
      '<button class="preset-btn" data-preset="preparation" id="cprep">Preparation</button>';
    rows.forEach(function(_,k){
      document.getElementById("c"+k).onclick = function(){ setActivePreset(this); i=k; draw(0); };
    });
    document.getElementById("cprep").onclick = function(){ setActivePreset(this); i=-1; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(i<0){
      m += '<text x="360" y="60" fill="#e2e8f0" font-size="14" text-anchor="middle">1° ROH / RCHO / RCH=CH₂  —[O]→  RCOOH</text>';
      m += '<text x="360" y="105" fill="#e2e8f0" font-size="14" text-anchor="middle">RCN  (H₃O⁺ or OH⁻ then H⁺)  →  RCOOH</text>';
      m += '<text x="360" y="150" fill="#e2e8f0" font-size="14" text-anchor="middle">RMgX + CO₂ then H₃O⁺ → RCOOH</text>';
      m += '<text x="360" y="195" fill="#e2e8f0" font-size="14" text-anchor="middle">ArCH₃  (KMnO₄ / CrO₃)  →  ArCOOH   (any alkyl side chain with benzylic H)</text>';
      m += '<text x="360" y="245" fill="#94a3b8" font-size="12" text-anchor="middle">Ex 8.14: benzene → methyl benzoate via Friedel–Crafts, side-chain ox, esterify.</text>';
      readout(cell("Nitrile","hydrolysis") + cell("Grignard","CO₂") + cell("ArCH₃","side-chain ox"));
      verdict("<b>§8.7:</b> four textbook routes to the carboxyl group.");
    } else {
      var r = rows[i];
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Table 8.3 · carboxylic acid names</text>';
      m += '<text x="360" y="110" fill="#e2e8f0" font-size="20" text-anchor="middle">' + r[0] + '</text>';
      m += '<text x="360" y="160" fill="#f59e0b" font-size="16" text-anchor="middle">Common: ' + r[1] + '</text>';
      m += '<text x="360" y="205" fill="#34d399" font-size="16" text-anchor="middle">IUPAC: ' + r[2] + ' acid</text>';
      readout(cell("Common", r[1]) + cell("IUPAC", r[2]+" acid"));
      verdict("<b>§8.6:</b> –COOH carbon is C-1. Dioic acids: hexanedioic acid is nylon-6,6 feedstock.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.acidstrength = (function(){
  var id = "ac";
  var acids = {
    etoh:{n:"Ethanol",p:15.9,c:"#64748b"},
    ph:{n:"Phenol",p:10.0,c:"#94a3b8"},
    pr:{n:"Propanoic",p:4.87,c:"#38bdf8"},
    ac:{n:"Acetic",p:4.76,c:"#38bdf8"},
    bz:{n:"Benzoic",p:4.19,c:"#f59e0b"},
    cl:{n:"ClCH₂COOH",p:2.86,c:"#fb923c"},
    tfa:{n:"CF₃COOH",p:0.23,c:"#f87171"},
    hcl:{n:"HCl",p:-7.0,c:"#ef4444"}
  };
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Stronger (low pKa)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Carboxylate 2 equivalent forms</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" data-preset="ethanol" id="s-et">EtOH 15.9</button>' +
      '<button class="preset-btn" data-preset="phenol" id="s-ph">PhOH 10</button>' +
      '<button class="preset-btn active" data-preset="acetic" id="s-ac">AcOH 4.76</button>' +
      '<button class="preset-btn" data-preset="benzoic" id="s-bz">PhCOOH 4.19</button>' +
      '<button class="preset-btn" data-preset="chloroacetic" id="s-cl">ClCH₂COOH</button>' +
      '<button class="preset-btn" data-preset="tfa" id="s-tf">CF₃COOH 0.23</button>' +
      '<button class="preset-btn" data-preset="why-phenol" id="s-why">Why &gt; phenol?</button>';
    document.getElementById("s-et").onclick = function(){ setActivePreset(this); id="etoh"; draw(0); };
    document.getElementById("s-ph").onclick = function(){ setActivePreset(this); id="ph"; draw(0); };
    document.getElementById("s-ac").onclick = function(){ setActivePreset(this); id="ac"; draw(0); };
    document.getElementById("s-bz").onclick = function(){ setActivePreset(this); id="bz"; draw(0); };
    document.getElementById("s-cl").onclick = function(){ setActivePreset(this); id="cl"; draw(0); };
    document.getElementById("s-tf").onclick = function(){ setActivePreset(this); id="tfa"; draw(0); };
    document.getElementById("s-why").onclick = function(){ setActivePreset(this); id="why"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(id==="why"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Ex 8.20: phenoxide has MORE resonance forms, yet carboxylic acids are stronger</text>';
      m += '<text x="360" y="100" fill="#e2e8f0" font-size="14" text-anchor="middle">Carboxylate: two equivalent structures, charge on electronegative O atoms</text>';
      m += '<text x="360" y="145" fill="#e2e8f0" font-size="14" text-anchor="middle">Phenoxide: non-equivalent forms, charge on less electronegative carbon</text>';
      m += '<text x="360" y="190" fill="#fbbf24" font-size="13" text-anchor="middle">Quality of delocalisation beats the count of cartoons</text>';
      m += '<text x="360" y="235" fill="#94a3b8" font-size="13" text-anchor="middle">pKa HCl −7; TFA 0.23; benzoic 4.19; acetic 4.76; phenol 10; ethanol ~16</text>';
      readout(cell("Carboxylate","2 equivalent O⁻") + cell("Phenoxide","charge on C") + cell("Winner","RCOOH"));
      verdict("<b>§8.9.1:</b> EWG (F, Cl, NO₂, CF₃) strengthen acids; EDG (alkyl, OMe) weaken. Closer EWG is stronger (Ex 8.8, 8.12).");
    } else {
      var a = acids[id];
      m += '<text x="360" y="50" fill="#e2e8f0" font-size="22" text-anchor="middle">' + a.n + '</text>';
      var w = Math.max(16, Math.min(560, (16-a.p)/23*560));
      m += '<rect x="80" y="100" width="560" height="22" rx="8" fill="#1e293b"/>';
      m += '<rect x="80" y="100" width="'+w+'" height="22" rx="8" fill="'+a.c+'"/>';
      m += '<text x="360" y="160" fill="#cbd5e1" font-size="16" text-anchor="middle">pKa = ' + a.p + '</text>';
      m += '<text x="360" y="210" fill="#94a3b8" font-size="13" text-anchor="middle">4-nitrobenzoic 3.41 · benzoic 4.19 · 4-methoxybenzoic 4.46 (zoom p.25)</text>';
      readout(cell("pKa", String(a.p), a.c) + cell("Ka", Math.pow(10,-a.p).toExponential(2)));
      verdict("<b>Smaller pKa = stronger acid.</b> Mineral acids &lt;1; moderate 1–5; weak 5–15; extremely weak &gt;15.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.acidrxn = (function(){
  var mode = "est";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>C–OH cleavage</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>–COOH / α-H</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="esterification" id="x-e">Esterification</button>' +
      '<button class="preset-btn" data-preset="hvz" id="x-h">HVZ halogenation</button>' +
      '<button class="preset-btn" data-preset="decarboxylation" id="x-d">Decarboxylation / LiAlH₄</button>' +
      '<button class="preset-btn" data-preset="uses" id="x-u">Uses</button>';
    document.getElementById("x-e").onclick = function(){ setActivePreset(this); mode="est"; App.resetTimeline(); App.play(); };
    document.getElementById("x-h").onclick = function(){ setActivePreset(this); mode="hvz"; draw(0); };
    document.getElementById("x-d").onclick = function(){ setActivePreset(this); mode="dec"; draw(0); };
    document.getElementById("x-u").onclick = function(){ setActivePreset(this); mode="use"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="est"){
      var u = Math.min(1,t/6);
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Fischer esterification — nucleophilic acyl substitution (zoom p.26)</text>';
      m += '<text x="360" y="95" fill="#e2e8f0" font-size="14" text-anchor="middle">RCOOH + R′OH  ⇌  RCOOR′ + H₂O   (H₂SO₄ / HCl)</text>';
      m += '<text x="360" y="145" fill="#94a3b8" font-size="13" text-anchor="middle">Protonate C=O → alcohol adds → tetrahedral intermediate → lose H₂O</text>';
      m += '<text x="360" y="195" fill="#fbbf24" font-size="13" text-anchor="middle">Ex 8.18: remove water or ester as formed — Le Chatelier</text>';
      m += '<rect x="80" y="230" width="560" height="12" rx="6" fill="#1e293b"/>';
      m += '<rect x="80" y="230" width="'+(560*u)+'" height="12" rx="6" fill="#38bdf8"/>';
      readout(cell("Cat.","H⁺") + cell("Remove","H₂O or ester") + cell("Also","PCl₅ / SOCl₂ → RCOCl"));
      verdict("<b>C–OH cleavage:</b> SOCl₂ preferred (gaseous by-products). Ammonia → ammonium salt → amide on heating.");
    } else if(mode==="hvz"){
      m += '<text x="360" y="70" fill="#e2e8f0" font-size="16" text-anchor="middle">Hell–Volhard–Zelinsky</text>';
      m += '<text x="360" y="120" fill="#e2e8f0" font-size="15" text-anchor="middle">RCH₂COOH + X₂ / red P  →  RCHXCOOH</text>';
      m += '<text x="360" y="170" fill="#94a3b8" font-size="14" text-anchor="middle">Needs an α-hydrogen. Cl₂ or Br₂.</text>';
      m += '<text x="360" y="220" fill="#94a3b8" font-size="13" text-anchor="middle">Aromatic acids: –COOH is meta-directing, deactivating; no Friedel–Crafts (AlCl₃ binds COOH).</text>';
      readout(cell("Need","α-H") + cell("X","Cl₂ or Br₂") + cell("Cat.","red P"));
      verdict("<b>§8.9.4:</b> α-halogenation of aliphatic carboxylic acids.");
    } else if(mode==="dec"){
      m += '<text x="360" y="60" fill="#e2e8f0" font-size="15" text-anchor="middle">RCOONa + NaOH/CaO (3:1 soda lime), heat  →  RH + Na₂CO₃</text>';
      m += '<text x="360" y="110" fill="#e2e8f0" font-size="15" text-anchor="middle">Kolbe electrolysis: 2 RCOO⁻ → R–R + 2 CO₂</text>';
      m += '<text x="360" y="160" fill="#e2e8f0" font-size="15" text-anchor="middle">LiAlH₄ or B₂H₆ → 1° alcohol. NaBH₄ does NOT reduce COOH.</text>';
      m += '<text x="360" y="210" fill="#94a3b8" font-size="13" text-anchor="middle">Diborane leaves ester, nitro, halo groups largely untouched — chemoselective.</text>';
      readout(cell("Soda lime","RH") + cell("LiAlH₄","RCH₂OH") + cell("NaBH₄","no reaction"));
      verdict("<b>Reduction vs decarboxylation:</b> keep the carbon chain or lose CO₂.");
    } else {
      m += '<text x="360" y="50" fill="#e2e8f0" font-size="15" text-anchor="middle">Methanoic: rubber, textile, dyeing, leather, electroplating</text>';
      m += '<text x="360" y="95" fill="#e2e8f0" font-size="15" text-anchor="middle">Ethanoic: solvent and vinegar in food</text>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="15" text-anchor="middle">Hexanedioic: nylon-6,6 ·  sodium benzoate: food preservative</text>';
      m += '<text x="360" y="185" fill="#e2e8f0" font-size="15" text-anchor="middle">Benzoate esters: perfumery ·  fatty acids: soaps and detergents</text>';
      m += '<text x="360" y="240" fill="#fbbf24" font-size="13" text-anchor="middle">Methanal, ethanal, propanone, benzaldehyde, formic, acetic, benzoic — industrial workhorses</text>';
      readout(cell("Vinegar","AcOH") + cell("Nylon-6,6","adipic") + cell("Preservative","PhCOONa"));
      verdict("<b>§8.5, 8.10:</b> carbonyls and acids in Indian food, textile, polymer and fragrance industries.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
