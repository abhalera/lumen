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

window.SIMS.classifycx = (function(){
  var kind = "alkyl1";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>sp³ C–X</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>sp² C–X</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="k-a1">1° alkyl</button>' +
      '<button class="preset-btn" id="k-a3">3° alkyl</button>' +
      '<button class="preset-btn" id="k-al">Allylic</button>' +
      '<button class="preset-btn" id="k-bz">Benzylic</button>' +
      '<button class="preset-btn" id="k-v">Vinylic</button>' +
      '<button class="preset-btn" id="k-ar">Aryl</button>';
    [["k-a1","alkyl1"],["k-a3","alkyl3"],["k-al","allyl"],["k-bz","benzyl"],["k-v","vinyl"],["k-ar","aryl"]].forEach(function(p){
      document.getElementById(p[0]).onclick = function(){ setActivePreset(this); kind=p[1]; App.resetTimeline(); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var title="", hyb="", note="", col="#38bdf8";
    if(kind==="alkyl1"){ title="1° haloalkane  CH₃CH₂–Br"; hyb="sp³"; note="Halogen on a carbon attached to one carbon. Homologous series CₙH₂ₙ₊₁X."; }
    else if(kind==="alkyl3"){ title="3° haloalkane  (CH₃)₃C–Br"; hyb="sp³"; note="Halogen on a carbon attached to three carbons. Fast SN1, slow SN2."; }
    else if(kind==="allyl"){ title="Allylic  CH₂=CH–CH₂–Br"; hyb="sp³ (allylic C)"; note="Halogen on sp³ carbon adjacent to C=C. Resonance-stabilised carbocation → fast SN1."; col="#34d399"; }
    else if(kind==="benzyl"){ title="Benzylic  C₆H₅CH₂–Cl"; hyb="sp³ (benzylic C)"; note="Halogen on sp³ carbon attached to an aryl ring. Resonance like allylic."; col="#34d399"; }
    else if(kind==="vinyl"){ title="Vinylic  CH₂=CH–Cl"; hyb="sp²"; note="Halogen on an sp² carbon of C=C. Unreactive in SN1/SN2."; col="#f59e0b"; }
    else { title="Aryl  C₆H₅–Cl"; hyb="sp²"; note="Halogen directly on the aromatic ring. Partial C–X double-bond character (169 pm vs 177 pm in haloalkanes)."; col="#f59e0b"; }
    m += '<text x="360" y="36" fill="#e2e8f0" font-size="18" text-anchor="middle" font-weight="700">' + title + '</text>';
    m += '<text x="360" y="62" fill="' + col + '" font-size="14" text-anchor="middle">C–X hybridisation: ' + hyb + '</text>';
    // simple C–X stick
    m += '<line x1="250" y1="150" x2="430" y2="150" stroke="#94a3b8" stroke-width="6"/>';
    m += '<circle cx="250" cy="150" r="22" fill="#334155" stroke="' + col + '" stroke-width="3"/>';
    m += '<text x="250" y="156" fill="#f8fafc" font-size="16" text-anchor="middle">C</text>';
    m += '<circle cx="430" cy="150" r="26" fill="#7c3aed" stroke="#c4b5fd" stroke-width="3"/>';
    m += '<text x="430" y="156" fill="#f8fafc" font-size="16" text-anchor="middle">X</text>';
    m += '<text x="250" y="200" fill="#38bdf8" font-size="13" text-anchor="middle">δ+</text>';
    m += '<text x="430" y="200" fill="#c4b5fd" font-size="13" text-anchor="middle">δ−</text>';
    m += '<text x="360" y="250" fill="#94a3b8" font-size="13" text-anchor="middle">Halogen more electronegative than carbon — polar C–X (Table 6.2)</text>';
    svg.innerHTML = m;
    readout(cell("Class", kind) + cell("Hybridisation", hyb, col) + cell("SN1/SN2", (kind==="vinyl"||kind==="aryl")?"inert":"active"));
    verdict("<b>§6.1:</b> " + note);
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.iupac8 = (function(){
  var idx = 0;
  var isomers = [
    {n:"1-Bromopentane", cls:"1°", f:"CH₃CH₂CH₂CH₂CH₂Br"},
    {n:"2-Bromopentane", cls:"2°", f:"CH₃CH₂CH₂CH(Br)CH₃"},
    {n:"3-Bromopentane", cls:"2°", f:"CH₃CH₂CH(Br)CH₂CH₃"},
    {n:"1-Bromo-3-methylbutane", cls:"1°", f:"(CH₃)₂CHCH₂CH₂Br"},
    {n:"2-Bromo-3-methylbutane", cls:"2°", f:"(CH₃)₂CHCHBrCH₃"},
    {n:"2-Bromo-2-methylbutane", cls:"3°", f:"(CH₃)₂CBrCH₂CH₃"},
    {n:"1-Bromo-2-methylbutane", cls:"1°", f:"CH₃CH₂CH(CH₃)CH₂Br"},
    {n:"1-Bromo-2,2-dimethylpropane", cls:"1°", f:"(CH₃)₃CCH₂Br"}
  ];
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>1° C–Br</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>2° C–Br</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>3° C–Br</span></div>';
    document.getElementById("preset-bar").innerHTML =
      isomers.map(function(it,i){ return '<button class="preset-btn'+(i===0?' active':'')+'" id="iso'+i+'">'+(i+1)+'</button>'; }).join("");
    isomers.forEach(function(_,i){
      document.getElementById("iso"+i).onclick = function(){ setActivePreset(this); idx=i; draw(0); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var it = isomers[idx];
    var col = it.cls==="1°"?"#38bdf8":(it.cls==="2°"?"#f59e0b":"#f87171");
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Example 6.1 · eight structural isomers of C₅H₁₁Br (zoom p.04–05)</text>';
    m += '<text x="360" y="90" fill="#e2e8f0" font-size="22" text-anchor="middle" font-weight="700">' + it.n + '</text>';
    m += '<text x="360" y="130" fill="#cbd5e1" font-size="16" text-anchor="middle" font-family="ui-monospace,monospace">' + it.f + '</text>';
    m += '<rect x="300" y="160" width="120" height="40" rx="8" fill="'+col+'"/>';
    m += '<text x="360" y="186" fill="#0f172a" font-size="18" text-anchor="middle" font-weight="700">' + it.cls + ' bromide</text>';
    m += '<text x="360" y="240" fill="#94a3b8" font-size="13" text-anchor="middle">IUPAC: halo as substituent on the parent alkane. Longest chain; lowest locant to halogen.</text>';
    svg.innerHTML = m;
    readout(cell("Isomer", (idx+1)+"/8") + cell("IUPAC", it.n, col) + cell("Class", it.cls));
    verdict("<b>Table 6.1 / Ex 6.1:</b> neo-pentyl bromide is 1-bromo-2,2-dimethylpropane; vinyl chloride is chloroethene; benzyl chloride is chlorophenylmethane.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.cxprep = (function(){
  var mode = "socl2";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Preferred (pure RX)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Halogen exchange</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-so">SOCl₂ from ROH</button>' +
      '<button class="preset-btn" id="p-hx">HX from ROH</button>' +
      '<button class="preset-btn" id="p-fink">Finkelstein (RCl→RI)</button>' +
      '<button class="preset-btn" id="p-sw">Swarts (RCl→RF)</button>' +
      '<button class="preset-btn" id="p-sand">Sandmeyer ArN₂⁺</button>';
    document.getElementById("p-so").onclick = function(){ setActivePreset(this); mode="socl2"; App.resetTimeline(); };
    document.getElementById("p-hx").onclick = function(){ setActivePreset(this); mode="hx"; App.resetTimeline(); };
    document.getElementById("p-fink").onclick = function(){ setActivePreset(this); mode="fink"; App.resetTimeline(); };
    document.getElementById("p-sw").onclick = function(){ setActivePreset(this); mode="sw"; App.resetTimeline(); };
    document.getElementById("p-sand").onclick = function(){ setActivePreset(this); mode="sand"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var eq="", why="", col="#34d399";
    if(mode==="socl2"){ eq="R–OH + SOCl₂ → R–Cl + SO₂↑ + HCl↑"; why="Thionyl chloride is preferred: both by-products are gases, so the alkyl chloride is obtained pure."; }
    else if(mode==="hx"){ eq="R–OH + HX → R–X + H₂O"; why="Dry HCl gas through alcohol, or heat with conc. aqueous halogen acid. Phenols fail: C–O has partial double-bond character."; col="#f59e0b"; }
    else if(mode==="fink"){ eq="R–Cl + NaI  (dry acetone)  → R–I + NaCl↓"; why="Finkelstein: NaCl precipitates in dry acetone, pulling equilibrium to alkyl iodide."; col="#f59e0b"; }
    else if(mode==="sw"){ eq="R–Cl + AgF (or Hg₂F₂, CoF₂, SbF₃) → R–F"; why="Swarts reaction — the industrial route to alkyl fluorides (and Freon 12 from CCl₄)."; col="#f59e0b"; }
    else { eq="ArN₂⁺X⁻ + CuCl/CuBr → Ar–X + N₂"; why="Sandmeyer (CuX) or Gattermann (Cu/HX) from arenediazonium salts. Direct halogenation of benzene needs Lewis acid."; col="#38bdf8"; }
    var prog = Math.min(1, t/6);
    m += '<text x="360" y="50" fill="#e2e8f0" font-size="16" text-anchor="middle" font-family="ui-monospace,monospace">' + eq + '</text>';
    m += '<rect x="80" y="120" width="560" height="16" rx="8" fill="#1e293b"/>';
    m += '<rect x="80" y="120" width="' + (560*prog) + '" height="16" rx="8" fill="'+col+'"/>';
    m += '<text x="360" y="180" fill="#94a3b8" font-size="13" text-anchor="middle">§6.4–6.5  ·  phenols do not give Ar–X with HX/PCl₅ under these conditions</text>';
    svg.innerHTML = m;
    readout(cell("Route", mode) + cell("Progress", Math.round(prog*100)+"%", col));
    verdict("<b>Preparation:</b> " + why);
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.halobp = (function(){
  var set = "mass";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Boiling point</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Density / packing</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="s-m">Same alkyl, vary X (Fig 6.1)</button>' +
      '<button class="preset-btn" id="s-b">Branching (isomeric C₄H₉Br)</button>' +
      '<button class="preset-btn" id="s-p">p- vs o-/m-C₆H₄Cl₂ (m.p.)</button>' +
      '<button class="preset-btn" id="s-d">Density Table 6.3</button>';
    document.getElementById("s-m").onclick = function(){ setActivePreset(this); set="mass"; draw(0); };
    document.getElementById("s-b").onclick = function(){ setActivePreset(this); set="branch"; draw(0); };
    document.getElementById("s-p").onclick = function(){ setActivePreset(this); set="para"; draw(0); };
    document.getElementById("s-d").onclick = function(){ setActivePreset(this); set="dens"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function bar(x, h, label, col, val){
    var y = 240 - h;
    return '<rect x="'+x+'" y="'+y+'" width="70" height="'+h+'" fill="'+col+'" rx="4"/>' +
      '<text x="'+(x+35)+'" y="258" fill="#94a3b8" font-size="11" text-anchor="middle">'+label+'</text>' +
      '<text x="'+(x+35)+'" y="'+(y-8)+'" fill="#e2e8f0" font-size="11" text-anchor="middle">'+val+'</text>';
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="50" y1="240" x2="680" y2="240" stroke="#334155"/>';
    var note="";
    if(set==="mass"){
      m += bar(90,40,"RF","#64748b","low");
      m += bar(200,80,"RCl","#38bdf8","");
      m += bar(310,120,"RBr","#f59e0b","");
      m += bar(420,170,"RI","#f87171","high");
      note="For the same alkyl group, b.p. RI > RBr > RCl > RF because van der Waals forces grow with size and polarisability of X.";
      readout(cell("Order","RI > RBr > RCl > RF") + cell("Cause","van der Waals"));
    } else if(set==="branch"){
      m += bar(120,160,"n-butyl Br","#38bdf8","highest");
      m += bar(280,120,"isobutyl Br","#f59e0b","");
      m += bar(440,70,"tert-butyl Br","#f87171","lowest");
      note="Isomeric haloalkanes: boiling point falls with branching (smaller surface → weaker van der Waals). 2-Bromo-2-methylpropane is lowest among C₄H₉Br.";
      readout(cell("Trend","branching ↓ b.p.") + cell("Example","t-BuBr lowest"));
    } else if(set==="para"){
      m += bar(140,80,"o-C₆H₄Cl₂","#38bdf8","b.p. similar");
      m += bar(300,80,"m-C₆H₄Cl₂","#38bdf8","b.p. similar");
      m += bar(460,160,"p-C₆H₄Cl₂","#f59e0b","high m.p.");
      note="Boiling points of isomeric dihalobenzenes are nearly the same, but the para isomer melts higher because its symmetry packs better in the crystal lattice.";
      readout(cell("b.p.","nearly equal") + cell("m.p.","para highest","#f59e0b"));
    } else {
      m += bar(70,50,"n-C₃H₇Cl","#38bdf8","0.89");
      m += bar(170,90,"CH₂Cl₂","#7dd3fc","1.336");
      m += bar(270,90,"n-C₃H₇Br","#f59e0b","1.335");
      m += bar(370,120,"CHCl₃","#fb923c","1.489");
      m += bar(470,140,"n-C₃H₇I","#f87171","1.747");
      m += bar(570,150,"CCl₄","#ef4444","1.595");
      note="Table 6.3 (g mL⁻¹): bromo, iodo and polychloro derivatives are heavier than water. Density rises with C count, halogen count and atomic mass of X.";
      readout(cell("CH₂Cl₂","1.336 g/mL") + cell("CHCl₃","1.489") + cell("CCl₄","1.595"));
    }
    svg.innerHTML = m;
    verdict("<b>§6.6:</b> " + note);
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.sn1sn2 = (function(){
  var mode = "sn2";
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Incoming Nu (OH⁻)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Leaving X⁻</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Carbon under attack</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="m-sn2">SN2 inversion (CH₃Cl + OH⁻)</button>' +
      '<button class="preset-btn" id="m-ster">SN2 steric order</button>' +
      '<button class="preset-btn" id="m-sn1">SN1 two-step (t-BuBr)</button>' +
      '<button class="preset-btn" id="m-lg">Leaving group I vs Cl</button>' +
      '<button class="preset-btn" id="m-allyl">Allylic/benzylic SN1</button>';
    document.getElementById("m-sn2").onclick = function(){ setActivePreset(this); mode="sn2"; App.resetTimeline(); App.play(); };
    document.getElementById("m-ster").onclick = function(){ setActivePreset(this); mode="ster"; App.resetTimeline(); };
    document.getElementById("m-sn1").onclick = function(){ setActivePreset(this); mode="sn1"; App.resetTimeline(); App.play(); };
    document.getElementById("m-lg").onclick = function(){ setActivePreset(this); mode="lg"; App.resetTimeline(); };
    document.getElementById("m-allyl").onclick = function(){ setActivePreset(this); mode="allyl"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var u = Math.min(1, t/8);
    if(mode==="sn2"){
      var nuX = 80 + u*140;
      var xX = 480 + u*120;
      var dash = u < 0.45 ? 0 : Math.min(1,(u-0.45)/0.25);
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 6.2 · Hughes–Ingold SN2 (1937): concerted backside attack, pentacoordinate TS, inversion</text>';
      m += '<circle cx="'+nuX+'" cy="150" r="16" fill="#ef4444"/>';
      m += '<text x="'+nuX+'" y="155" fill="#fff" font-size="11" text-anchor="middle">OH</text>';
      m += '<circle cx="360" cy="150" r="22" fill="#38bdf8"/>';
      m += '<text x="360" y="155" fill="#0f172a" font-size="14" text-anchor="middle" font-weight="700">C</text>';
      // three H's fanning
      var fan = 20 + dash*25;
      m += '<line x1="360" y1="128" x2="360" y2="'+(128-fan)+'" stroke="#e2e8f0" stroke-width="2"/>';
      m += '<line x1="348" y1="162" x2="'+(348-fan*0.8)+'" y2="'+(162+fan*0.5)+'" stroke="#e2e8f0" stroke-width="2"/>';
      m += '<line x1="372" y1="162" x2="'+(372+fan*0.8)+'" y2="'+(162+fan*0.5)+'" stroke="#e2e8f0" stroke-width="2"/>';
      m += '<circle cx="'+xX+'" cy="150" r="16" fill="#22c55e"/>';
      m += '<text x="'+xX+'" y="155" fill="#0f172a" font-size="12" text-anchor="middle">Cl</text>';
      if(u>0.35 && u<0.7){
        m += '<text x="360" y="230" fill="#fbbf24" font-size="13" text-anchor="middle">Transition state: C bonded to five groups — cannot be isolated</text>';
      } else if(u>=0.7){
        m += '<text x="360" y="230" fill="#34d399" font-size="13" text-anchor="middle">Umbrella inversion of configuration · rate = k[CH₃Cl][OH⁻]</text>';
      } else {
        m += '<text x="360" y="230" fill="#94a3b8" font-size="13" text-anchor="middle">Nu approaches 180° from the leaving group (backside)</text>';
      }
      readout(cell("Mechanism","SN2 bimolecular") + cell("Kinetics","2nd order") + cell("Stereochem","inversion","#34d399"));
      verdict("<b>SN2:</b> one step, no intermediate. Order CH₃X > 1° > 2° > 3°. Polar aprotic solvents help. Play the timeline to watch inversion.");
    } else if(mode==="ster"){
      m += '<text x="360" y="32" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 6.3 steric effects — relative SN2 rates (NCERT parentheses)</text>';
      var bars = [["CH₃X","30",180,"#34d399"],["1°","1",90,"#38bdf8"],["2°","0.03",40,"#f59e0b"],["3°","~0",12,"#f87171"]];
      bars.forEach(function(b,i){
        var x = 80 + i*160;
        m += '<rect x="'+x+'" y="'+(230-b[2])+'" width="90" height="'+b[2]+'" fill="'+b[3]+'" rx="4"/>';
        m += '<text x="'+(x+45)+'" y="250" fill="#e2e8f0" font-size="13" text-anchor="middle">'+b[0]+'</text>';
        m += '<text x="'+(x+45)+'" y="'+(222-b[2])+'" fill="#e2e8f0" font-size="12" text-anchor="middle">'+b[1]+'</text>';
      });
      readout(cell("SN2 order","CH₃ > 1° > 2° > 3°") + cell("Cause","backside crowding"));
      verdict("<b>Steric:</b> bulky groups on or near the electrophilic carbon block the nucleophile. Tertiary halides are essentially inert in SN2.");
    } else if(mode==="sn1"){
      var phase = u < 0.4 ? 1 : (u < 0.7 ? 2 : 3);
      m += '<text x="360" y="28" fill="#94a3b8" font-size="13" text-anchor="middle">SN1 of (CH₃)₃CBr + OH⁻ in polar protic solvent — two steps, 1st-order kinetics</text>';
      m += '<circle cx="280" cy="140" r="22" fill="#38bdf8"/>';
      m += '<text x="280" y="145" fill="#0f172a" font-size="12" text-anchor="middle" font-weight="700">C</text>';
      m += '<text x="280" y="100" fill="#94a3b8" font-size="11" text-anchor="middle">(CH₃)₃C</text>';
      if(phase===1){
        m += '<circle cx="400" cy="140" r="16" fill="#22c55e"/>';
        m += '<text x="400" y="145" fill="#0f172a" font-size="12" text-anchor="middle">Br</text>';
        m += '<text x="360" y="210" fill="#fbbf24" font-size="13" text-anchor="middle">Step I (slow, reversible): ionisation → planar 3° carbocation + Br⁻</text>';
      } else {
        m += '<circle cx="520" cy="90" r="14" fill="#22c55e"/>';
        m += '<text x="520" y="94" fill="#0f172a" font-size="11" text-anchor="middle">Br⁻</text>';
        m += '<text x="280" y="175" fill="#fbbf24" font-size="12" text-anchor="middle">planar C⁺</text>';
        var nuY = phase===2 ? 240 : 180;
        m += '<circle cx="280" cy="'+nuY+'" r="14" fill="#ef4444"/>';
        m += '<text x="280" y="'+(nuY+4)+'" fill="#fff" font-size="10" text-anchor="middle">OH</text>';
        m += '<text x="360" y="250" fill="#34d399" font-size="13" text-anchor="middle">Step II (fast): Nu attacks either face → racemisation at a chiral centre</text>';
      }
      readout(cell("Mechanism","SN1 unimolecular") + cell("RDS","C–X ionisation") + cell("Order","3° > 2° > 1° > CH₃","#f59e0b"));
      verdict("<b>SN1:</b> rate = k[RX] only. Polar protic solvents solvate X⁻. Same alkyl group: R–I > R–Br > R–Cl ≫ R–F.");
    } else if(mode==="lg"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Example 6.6: iodide is a better leaving group than chloride (larger, weaker C–X)</text>';
      m += '<text x="220" y="130" fill="#34d399" font-size="18" text-anchor="middle">n-BuI</text>';
      m += '<text x="500" y="130" fill="#f87171" font-size="18" text-anchor="middle">n-BuCl</text>';
      m += '<text x="360" y="180" fill="#e2e8f0" font-size="14" text-anchor="middle">Table 6.2: C–I 214 pm, 234 kJ mol⁻¹  vs  C–Cl 178 pm, 351 kJ mol⁻¹</text>';
      m += '<text x="360" y="230" fill="#94a3b8" font-size="13" text-anchor="middle">For a given alkyl group both SN1 and SN2: R–I > R–Br > R–Cl ≫ R–F</text>';
      readout(cell("C–I enthalpy","234 kJ/mol") + cell("C–Cl enthalpy","351 kJ/mol") + cell("Faster SN2","alkyl iodide","#34d399"));
      verdict("<b>Leaving group:</b> weaker C–X bond and more stable X⁻ (I⁻ > Br⁻ > Cl⁻ > F⁻) accelerate substitution.");
    } else {
      m += '<text x="360" y="36" fill="#94a3b8" font-size="13" text-anchor="middle">Allylic and benzylic halides are fast in SN1 — carbocation resonance (NCERT Fig.)</text>';
      m += '<text x="180" y="120" fill="#e2e8f0" font-size="14" text-anchor="middle">H₂C=CH–CH₂⁺  ↔  ⁺H₂C–CH=CH₂</text>';
      m += '<text x="520" y="120" fill="#e2e8f0" font-size="14" text-anchor="middle">Ph–CH₂⁺  (4 Kekulé forms)</text>';
      m += '<text x="360" y="190" fill="#34d399" font-size="13" text-anchor="middle">Ex 6.7: C₆H₅C(CH₃)(C₆H₅)Br fastest SN1; C₆H₅CH₂Br fastest SN2 of that set</text>';
      m += '<text x="360" y="230" fill="#94a3b8" font-size="13" text-anchor="middle">Bromobutanes SN1: 1° n-Bu &lt; i-Bu &lt; 2° &lt; t-Bu   ·   SN2 is the reverse</text>';
      readout(cell("SN1 boost","resonance C⁺") + cell("SN2 of benzyl","still 1°, unhindered"));
      verdict("<b>Ex 6.7:</b> extra phenyl groups stabilise C⁺ (SN1) but add bulk (SN2). 3° allylic/benzylic are SN1 specialists.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.stereoelim = (function(){
  var mode = "chiral";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Chiral / inversion</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Elimination / metal</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="t-ch">Chirality (butan-2-ol)</button>' +
      '<button class="preset-btn" id="t-rac">SN1 racemisation vs SN2 inversion</button>' +
      '<button class="preset-btn" id="t-say">Saytzeff elimination</button>' +
      '<button class="preset-btn" id="t-gr">Grignard / Wurtz</button>';
    document.getElementById("t-ch").onclick = function(){ setActivePreset(this); mode="chiral"; draw(0); };
    document.getElementById("t-rac").onclick = function(){ setActivePreset(this); mode="rac"; draw(0); };
    document.getElementById("t-say").onclick = function(){ setActivePreset(this); mode="say"; draw(0); };
    document.getElementById("t-gr").onclick = function(){ setActivePreset(this); mode="gr"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="chiral"){
      m += '<text x="360" y="36" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 6.5–6.6: propan-2-ol is achiral; butan-2-ol has four different groups → enantiomers</text>';
      m += '<text x="180" y="120" fill="#f87171" font-size="16" text-anchor="middle">propan-2-ol</text>';
      m += '<text x="180" y="150" fill="#94a3b8" font-size="12" text-anchor="middle">two methyls identical</text>';
      m += '<text x="180" y="175" fill="#94a3b8" font-size="12" text-anchor="middle">mirror superimposable</text>';
      m += '<text x="540" y="120" fill="#34d399" font-size="16" text-anchor="middle">butan-2-ol</text>';
      m += '<text x="540" y="150" fill="#94a3b8" font-size="12" text-anchor="middle">C* : H, OH, CH₃, C₂H₅</text>';
      m += '<text x="540" y="175" fill="#94a3b8" font-size="12" text-anchor="middle">(+)/(−) enantiomers</text>';
      m += '<text x="360" y="240" fill="#e2e8f0" font-size="13" text-anchor="middle">Racemic mixture (±) has zero net rotation. Sign of rotation ≠ absolute configuration.</text>';
      readout(cell("Chiral test","4 different groups") + cell("Hands","non-superimposable"));
      verdict("<b>§6.7.1c:</b> Pasteur, van’t Hoff, Le Bel. Polarimeter: d/(+) clockwise, l/(−) anticlockwise.");
    } else if(mode==="rac"){
      m += '<text x="360" y="50" fill="#e2e8f0" font-size="16" text-anchor="middle">Chiral R–X  +  Nu</text>';
      m += '<text x="200" y="140" fill="#38bdf8" font-size="15" text-anchor="middle">SN2 → 100% inversion</text>';
      m += '<text x="520" y="140" fill="#f59e0b" font-size="15" text-anchor="middle">SN1 → racemisation</text>';
      m += '<text x="360" y="210" fill="#94a3b8" font-size="13" text-anchor="middle">Retention = same spatial arrangement; inversion = opposite; racemisation = 1:1 mix.</text>';
      readout(cell("SN2","Walden inversion") + cell("SN1","planar C⁺ both faces"));
      verdict("<b>Summary:</b> SN2 of chiral alkyl halides inverts configuration; SN1 racemises.");
    } else if(mode==="say"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">β-Elimination with alc. KOH / EtONa — Zaitsev (Saytzeff): more substituted alkene major</text>';
      m += '<text x="360" y="110" fill="#e2e8f0" font-size="15" text-anchor="middle">2-chloro-2-methylbutane  →  2-methylbut-2-ene (major) + 2-methylbut-1-ene</text>';
      m += '<text x="360" y="160" fill="#94a3b8" font-size="13" text-anchor="middle">Aqueous KOH → substitution (alcohol). Alcoholic KOH → elimination (alkene).</text>';
      m += '<text x="360" y="210" fill="#fbbf24" font-size="13" text-anchor="middle">3° and 2° lean elimination; 1° lean SN2 substitution unless strong bulky base.</text>';
      readout(cell("Base/solvent","alc. KOH") + cell("Rule","Saytzeff major"));
      verdict("<b>Ex 6.20:</b> OH⁻ in water is a nucleophile; in alcohol the medium favours E2, and 3° C⁺ if formed loses H⁺ to give alkene.");
    } else {
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Organometallics (keep dry ether — any proton source destroys RMgX)</text>';
      m += '<text x="360" y="100" fill="#e2e8f0" font-size="15" text-anchor="middle">R–X + Mg  (dry ether)  →  Rδ⁻–Mgδ⁺X   (Grignard, 1900 / Nobel 1912)</text>';
      m += '<text x="360" y="145" fill="#e2e8f0" font-size="14" text-anchor="middle">2 R–X + 2 Na  (dry ether)  →  R–R + 2 NaX   (Wurtz)</text>';
      m += '<text x="360" y="190" fill="#e2e8f0" font-size="14" text-anchor="middle">Ar–X + R–X + 2 Na → Ar–R (Wurtz–Fittig) ·  2 Ar–X + 2 Na → Ar–Ar (Fittig)</text>';
      m += '<text x="360" y="240" fill="#f87171" font-size="13" text-anchor="middle">RMgX + H₂O / ROH / RNH₂ → RH  — that is why anhydrous conditions are mandatory</text>';
      readout(cell("C–Mg","polar covalent") + cell("Mg–X","ionic") + cell("Dry ether","required"));
      verdict("<b>§6.7.1 metals:</b> Grignard carbon is nucleophilic. Wurtz doubles the carbon chain (Ex 6.21 diagnostic).");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.haloarene = (function(){
  var mode = "why";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Haloarene C–X</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Activated o/p-NO₂</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="h-w">Why Ar–X resists SN</button>' +
      '<button class="preset-btn" id="h-no2">o/p-NO₂ activation (SNAr)</button>' +
      '<button class="preset-btn" id="h-e">EAS: o,p-directing but deactivating</button>' +
      '<button class="preset-btn" id="h-poly">Polyhalogen: CHCl₃, CCl₄, Freon, DDT</button>';
    document.getElementById("h-w").onclick = function(){ setActivePreset(this); mode="why"; draw(0); };
    document.getElementById("h-no2").onclick = function(){ setActivePreset(this); mode="no2"; App.resetTimeline(); App.play(); };
    document.getElementById("h-e").onclick = function(){ setActivePreset(this); mode="eas"; draw(0); };
    document.getElementById("h-poly").onclick = function(){ setActivePreset(this); mode="poly"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="why"){
      m += '<text x="360" y="36" fill="#94a3b8" font-size="13" text-anchor="middle">Four reasons haloarenes are far less reactive than haloalkanes toward Nu substitution</text>';
      m += '<text x="360" y="90" fill="#e2e8f0" font-size="14" text-anchor="middle">1. Resonance: C–Cl partial double bond</text>';
      m += '<text x="360" y="120" fill="#e2e8f0" font-size="14" text-anchor="middle">2. sp² C (more s-character) holds the pair tighter — C–Cl 169 pm vs 177 pm in RCl</text>';
      m += '<text x="360" y="150" fill="#e2e8f0" font-size="14" text-anchor="middle">3. Phenyl cation is not resonance-stabilised → SN1 ruled out</text>';
      m += '<text x="360" y="180" fill="#e2e8f0" font-size="14" text-anchor="middle">4. Electron-rich ring repels incoming nucleophile</text>';
      m += '<text x="360" y="240" fill="#fbbf24" font-size="13" text-anchor="middle">Industrial phenol: chlorobenzene + aq. NaOH, 623 K, 300 atm (Dow process)</text>';
      readout(cell("C–Cl Ar","169 pm") + cell("C–Cl alkyl","177 pm") + cell("SN1","no Ph⁺"));
      verdict("<b>§6.7.2:</b> Chlorobenzene’s dipole moment is lower than cyclohexyl chloride for the same reasons (Ex 6.12).");
    } else if(mode==="no2"){
      var u = Math.min(1,t/6);
      m += '<text x="360" y="32" fill="#94a3b8" font-size="13" text-anchor="middle">Addition–elimination SNAr: o/p-NO₂ withdraws density and stabilises the Meisenheimer anion</text>';
      m += '<rect x="250" y="70" width="220" height="140" rx="12" fill="#1e293b" stroke="#f59e0b"/>';
      m += '<text x="360" y="130" fill="#e2e8f0" font-size="14" text-anchor="middle">Ar–Cl  +  OH⁻</text>';
      m += '<text x="360" y="160" fill="#34d399" font-size="13" text-anchor="middle">' + (u<0.5?"carbanion intermediate":"Ar–OH + Cl⁻") + '</text>';
      m += '<text x="360" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">meta-NO₂ does not place negative charge on the carbon bearing NO₂ — no rate boost</text>';
      readout(cell("Activating","o/p-NO₂") + cell("meta-NO₂","no effect") + cell("Step", u<0.5?"addition":"elimination"));
      verdict("<b>SNAr:</b> electron-withdrawing groups at ortho and para, not meta, accelerate replacement of halogen by OH, NH₂, etc.");
    } else if(mode==="eas"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Ex 6.9: Cl is o,p-directing yet deactivating — I effect vs resonance</text>';
      m += '<text x="360" y="110" fill="#e2e8f0" font-size="14" text-anchor="middle">−I (stronger): withdraws electrons → net deactivation vs benzene</text>';
      m += '<text x="360" y="150" fill="#e2e8f0" font-size="14" text-anchor="middle">+R: donates at o/p → those positions are less deactivated than meta</text>';
      m += '<text x="360" y="200" fill="#fbbf24" font-size="13" text-anchor="middle">Reactivity controlled by inductive effect; orientation controlled by resonance</text>';
      m += '<text x="360" y="240" fill="#94a3b8" font-size="13" text-anchor="middle">Halogenation, nitration, sulphonation, Friedel–Crafts all go o/p, more slowly than benzene</text>';
      readout(cell("Directing","o,p") + cell("Activity","&lt; benzene") + cell("Control","−I vs +R"));
      verdict("<b>EAS of Ph–X:</b> further substitution is ortho/para but needs more drastic conditions than benzene.");
    } else {
      m += '<text x="360" y="36" fill="#94a3b8" font-size="13" text-anchor="middle">§6.8 Polyhalogen compounds — useful and environmentally persistent</text>';
      m += '<text x="180" y="90" fill="#e2e8f0" font-size="13" text-anchor="middle">CH₂Cl₂ paint/drug solvent; CNS toxin</text>';
      m += '<text x="540" y="90" fill="#e2e8f0" font-size="13" text-anchor="middle">CHCl₃ → phosgene in light/air</text>';
      m += '<text x="180" y="140" fill="#e2e8f0" font-size="13" text-anchor="middle">CHI₃: iodine antiseptic (replaced)</text>';
      m += '<text x="540" y="140" fill="#e2e8f0" font-size="13" text-anchor="middle">CCl₄: ozone, liver, heart</text>';
      m += '<text x="180" y="190" fill="#fbbf24" font-size="13" text-anchor="middle">Freon-12 CCl₂F₂ (Swarts from CCl₄)</text>';
      m += '<text x="540" y="190" fill="#fbbf24" font-size="13" text-anchor="middle">DDT: Müller 1939, Nobel 1948</text>';
      m += '<text x="360" y="250" fill="#f87171" font-size="12" text-anchor="middle">Freons initiate stratospheric radical chains that upset the ozone balance. DDT biomagnifies in fat.</text>';
      readout(cell("Freon-12","CCl₂F₂") + cell("CHCl₃ store","dark, full bottles") + cell("DDT","banned US 1973"));
      verdict("<b>India connect:</b> chloroquine (malaria), chloramphenicol (typhoid), thyroxine (goitre) — halogen organics in medicine, vs DDT/freon hazards.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
