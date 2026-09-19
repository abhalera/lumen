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

window.SIMS.werner = (function(){
  var idx = 0;
  var rows = [
    {id:"yellow",name:"CoCl₃·6NH₃", color:"Yellow", formula:"[Co(NH₃)₆]³⁺ 3Cl⁻", ag:3, elec:"1:3", sphere:["NH3","NH3","NH3","NH3","NH3","NH3"], free:3},
    {id:"purple",name:"CoCl₃·5NH₃", color:"Purple", formula:"[CoCl(NH₃)₅]²⁺ 2Cl⁻", ag:2, elec:"1:2", sphere:["NH3","NH3","NH3","NH3","NH3","Cl"], free:2},
    {id:"green",name:"CoCl₃·4NH₃ green", color:"Green", formula:"[CoCl₂(NH₃)₄]⁺ Cl⁻", ag:1, elec:"1:1", sphere:["NH3","NH3","NH3","NH3","Cl","Cl"], free:1},
    {id:"violet",name:"CoCl₃·4NH₃ violet", color:"Violet", formula:"[CoCl₂(NH₃)₄]⁺ Cl⁻", ag:1, elec:"1:1", sphere:["NH3","NH3","NH3","NH3","Cl","Cl"], free:1}
  ];
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>NH₃ in sphere</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Cl in sphere</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Free Cl⁻ → AgCl</span></div>';
    document.getElementById("preset-bar").innerHTML =
      rows.map(function(r,i){ return '<button class="preset-btn'+(i===0?' active':'')+'" data-preset="'+r.id+'" id="pw'+i+'">'+r.color+'</button>'; }).join("");
    rows.forEach(function(r,i){
      document.getElementById("pw"+i).onclick = function(){ setActivePreset(this); idx=i; draw(0); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var r = rows[idx];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#e2e8f0" font-size="15" text-anchor="middle" font-weight="700">Table 5.1 · '+r.name+' · '+r.color+'</text>';
    var cx=220, cy=155, rad=70;
    m += '<circle cx="'+cx+'" cy="'+cy+'" r="18" fill="#fb923c"/>';
    m += '<text x="'+cx+'" y="'+(cy+5)+'" fill="#0f172a" font-size="12" text-anchor="middle" font-weight="700">Co</text>';
    r.sphere.forEach(function(L,i){
      var ang = -Math.PI/2 + i*Math.PI/3;
      var x = cx + rad*Math.cos(ang), y = cy + rad*Math.sin(ang);
      var col = L==="Cl" ? "#f59e0b" : "#38bdf8";
      m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'" stroke="#475569"/>';
      m += '<circle cx="'+x+'" cy="'+y+'" r="16" fill="'+col+'"/>';
      m += '<text x="'+x+'" y="'+(y+4)+'" fill="#0f172a" font-size="9" text-anchor="middle" font-weight="700">'+L+'</text>';
    });
    var agShow = Math.min(r.ag, Math.floor((t/6)*r.ag + 0.01) || r.ag);
    if(t===0) agShow = r.ag;
    var k;
    for(k=0;k<r.free;k++){
      var x = 480 + (k%3)*50, y = 90 + Math.floor(k/3)*50;
      m += '<circle cx="'+x+'" cy="'+y+'" r="16" fill="#f87171"/>';
      m += '<text x="'+x+'" y="'+(y+4)+'" fill="#0f172a" font-size="9" text-anchor="middle">Cl⁻</text>';
    }
    m += '<text x="530" y="200" fill="#f87171" font-size="14" text-anchor="middle">'+r.ag+' mol AgCl / mol complex</text>';
    m += '<text x="530" y="224" fill="#94a3b8" font-size="12" text-anchor="middle">conductivity '+r.elec+' electrolyte</text>';
    m += '<text x="360" y="280" fill="#94a3b8" font-size="12" text-anchor="middle">Secondary valence = 6 (octahedron). Green vs violet ·4NH₃ are geometrical isomers.</text>';
    svg.innerHTML = m;
    readout(cell("Formula", r.formula) + cell("AgCl", r.ag+" mol","#f87171") + cell("Electrolyte", r.elec) + cell("CN","6"));
    verdict("<b>Werner 1898 (zoom p.2):</b> groups inside [ ] do not ionise. Primary valence = ionisable Cl⁻; secondary = six donors at an octahedron.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.terms = (function(){
  var idx = 0;
  var items = [
    {id:"entity",t:"Coordination entity", d:"Central metal + ligands in [ ]. Examples: [CoCl₃(NH₃)₃], [Ni(CO)₄], [Fe(CN)₆]⁴⁻.", tag:"Lewis acid + bases"},
    {id:"denticity",t:"Denticity", d:"Unidentate Cl⁻/NH₃; didentate en, C₂O₄²⁻; hexadentate EDTA⁴⁻ (2 N + 4 O). Chelate = two or more donors of one ligand on one metal.", tag:"CN counts σ donors, not π bonds"},
    {id:"ambidentate",t:"Ambidentate", d:"NO₂⁻ binds N (nitro) or O (nitrito); SCN⁻ binds S or N. Linkage isomerism follows.", tag:"Two different donor atoms"},
    {id:"polyhedron",t:"Polyhedron / OS / homo-hetero", d:"[Co(NH₃)₆]³⁺ octahedral; [Ni(CO)₄] Td; [PtCl₄]²⁻ square planar. [Cu(CN)₄]³⁻ is Cu(I). Homoleptic one ligand type; heteroleptic mixed.", tag:"Fig. 5.1"}
  ];
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>§5.2 glossary</span></div>';
    document.getElementById("preset-bar").innerHTML =
      items.map(function(it,i){ return '<button class="preset-btn'+(i===0?' active':'')+'" data-preset="'+it.id+'" id="pt'+i+'">'+it.t.split(" ")[0]+'</button>'; }).join("");
    items.forEach(function(it,i){
      document.getElementById("pt"+i).onclick = function(){ setActivePreset(this); idx=i; draw(0); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var it = items[idx];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="50" fill="#38bdf8" font-size="20" text-anchor="middle" font-weight="700">'+it.t+'</text>';
    m += '<foreignObject x="60" y="80" width="600" height="140"><div xmlns="http://www.w3.org/1999/xhtml" style="color:#e2e8f0;font:15px/1.5 system-ui;text-align:center">'+it.d+'</div></foreignObject>';
    m += '<text x="360" y="250" fill="#fbbf24" font-size="14" text-anchor="middle">'+it.tag+'</text>';
    m += '<text x="360" y="280" fill="#64748b" font-size="12" text-anchor="middle">[Fe(C₂O₄)₃]³⁻ and [Co(en)₃]³⁺ both have CN = 6.</text>';
    svg.innerHTML = m;
    readout(cell("Term", it.t) + cell("CN reminder","σ donors only"));
    verdict("<b>§5.2 (zoom p.4–5):</b> EDTA⁴⁻ is hexadentate; proteins are listed as possible ligands.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.iupac = (function(){
  var idx = 0;
  var pairs = [
    {id:"pair1",name:"triamminetriaquachromium(III) chloride", formula:"[Cr(NH₃)₃(H₂O)₃]Cl₃"},
    {id:"pair2",name:"tris(ethane-1,2-diamine)cobalt(III) sulphate", formula:"[Co(en)₃]₂(SO₄)₃"},
    {id:"pair3",name:"diamminesilver(I) dicyanidoargentate(I)", formula:"[Ag(NH₃)₂][Ag(CN)₂]"},
    {id:"pair4",name:"tetraammineaquachloridocobalt(III) chloride", formula:"[Co(NH₃)₄(H₂O)Cl]Cl₂"},
    {id:"pair5",name:"potassium tetrahydroxidozincate(II)", formula:"K₂[Zn(OH)₄]"},
    {id:"pair6",name:"diamminechloridonitrito-N-platinum(II)", formula:"[Pt(NH₃)₂Cl(NO₂)]"},
    {id:"pair7",name:"dichloridobis(ethane-1,2-diamine)cobalt(III) chloride", formula:"[CoCl₂(en)₂]Cl"},
    {id:"pair8",name:"tetracarbonylnickel(0)", formula:"[Ni(CO)₄]"}
  ];
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>2004 draft: chlorido, cyanido</span></div>';
    document.getElementById("preset-bar").innerHTML =
      pairs.map(function(p,i){ return '<button class="preset-btn'+(i===0?' active':'')+'" data-preset="'+p.id+'" id="pi'+i+'">'+(i+1)+'</button>'; }).join("");
    pairs.forEach(function(p,i){
      document.getElementById("pi"+i).onclick = function(){ setActivePreset(this); idx=i; draw(0); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var p = pairs[idx];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="13" text-anchor="middle">Examples 5.2–5.3 · alphabetical ligands · metal-ate if anion</text>';
    m += '<text x="360" y="120" fill="#38bdf8" font-size="18" text-anchor="middle" font-weight="700">'+p.formula+'</text>';
    m += '<text x="360" y="180" fill="#fde68a" font-size="16" text-anchor="middle">'+p.name+'</text>';
    m += '<text x="360" y="240" fill="#94a3b8" font-size="13" text-anchor="middle">ammine = NH₃ (two m). bis/tris when the ligand name already has a number.</text>';
    m += '<text x="360" y="270" fill="#64748b" font-size="12" text-anchor="middle">Never name the number of counter ions — charge balance does that.</text>';
    svg.innerHTML = m;
    readout(cell("Pair", (idx+1)+"/"+pairs.length) + cell("Formula", p.formula));
    verdict("<b>Zoom p.6–7:</b> ligands alphabetical regardless of charge (2004 draft). Anionic ligands end in –ido.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.isomerism = (function(){
  var mode = "cis";
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>NH₃ / en</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Cl</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="cis" id="p-cis">cis-[Co(NH₃)₄Cl₂]⁺</button>' +
      '<button class="preset-btn" data-preset="trans" id="p-trans">trans-[Co(NH₃)₄Cl₂]⁺</button>' +
      '<button class="preset-btn" data-preset="fac" id="p-fac">fac-[Ma₃b₃]</button>' +
      '<button class="preset-btn" data-preset="mer" id="p-mer">mer-[Ma₃b₃]</button>' +
      '<button class="preset-btn" data-preset="optical" id="p-opt">optical [Co(en)₃]³⁺</button>';
    document.getElementById("p-cis").onclick = function(){ setActivePreset(this); mode="cis"; draw(0); };
    document.getElementById("p-trans").onclick = function(){ setActivePreset(this); mode="trans"; draw(0); };
    document.getElementById("p-fac").onclick = function(){ setActivePreset(this); mode="fac"; draw(0); };
    document.getElementById("p-mer").onclick = function(){ setActivePreset(this); mode="mer"; draw(0); };
    document.getElementById("p-opt").onclick = function(){ setActivePreset(this); mode="opt"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function octa(svgPts, labels, cols){
    var cx=360, cy=150;
    var pos = [
      [cx, cy-80],[cx+80, cy],[cx, cy+80],[cx-80, cy],[cx-28, cy-18],[cx+28, cy+18]
    ];
    var m = '<circle cx="'+cx+'" cy="'+cy+'" r="14" fill="#fb923c"/>';
    pos.forEach(function(p,i){
      m += '<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#475569"/>';
      m += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="16" fill="'+cols[i]+'"/>';
      m += '<text x="'+p[0]+'" y="'+(p[1]+4)+'" fill="#0f172a" font-size="9" text-anchor="middle" font-weight="700">'+labels[i]+'</text>';
    });
    return m;
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var title, labels, cols, note;
    if(mode==="cis"){
      title="cis-[Co(NH₃)₄Cl₂]⁺  (Fig. 5.3) — two Cl adjacent";
      labels=["Cl","Cl","N","N","N","N"]; cols=["#f59e0b","#f59e0b","#38bdf8","#38bdf8","#38bdf8","#38bdf8"];
      note="Cis can be chiral when didentates replace ammines ([CoCl₂(en)₂]⁺).";
    } else if(mode==="trans"){
      title="trans-[Co(NH₃)₄Cl₂]⁺ — two Cl opposite";
      labels=["Cl","N","Cl","N","N","N"]; cols=["#f59e0b","#38bdf8","#f59e0b","#38bdf8","#38bdf8","#38bdf8"];
      note="Trans has a mirror plane: not optically active (Fig. 5.7 analogue).";
    } else if(mode==="fac"){
      title="fac-[Co(NH₃)₃(NO₂)₃] — three identical donors on a face (Fig. 5.5)";
      labels=["A","A","A","B","B","B"]; cols=["#38bdf8","#38bdf8","#a78bfa","#38bdf8","#a78bfa","#a78bfa"];
      note="[Ma₃b₃] has two geometrical isomers: fac and mer. Ex 5.9(ii).";
    } else if(mode==="mer"){
      title="mer-[Co(NH₃)₃(NO₂)₃] — three identical donors on a meridian";
      labels=["A","B","A","B","A","B"]; cols=["#38bdf8","#a78bfa","#38bdf8","#a78bfa","#38bdf8","#a78bfa"];
      note="Meridian = a belt of three donors including a trans pair.";
    } else {
      title="Optical isomers of [Co(en)₃]³⁺ (Fig. 5.6) — non-superimposable mirrors";
      labels=["en","en","en","en","en","en"]; cols=["#34d399","#34d399","#2dd4bf","#2dd4bf","#6ee7b7","#6ee7b7"];
      note="d rotates polarised light right, l left. Tetrahedral MX₂L₂ has NO cis/trans (Example 5.4).";
    }
    m += '<text x="360" y="28" fill="#e2e8f0" font-size="14" text-anchor="middle" font-weight="700">'+title+'</text>';
    m += octa(null, labels, cols);
    m += '<text x="360" y="280" fill="#94a3b8" font-size="12" text-anchor="middle">'+note+'</text>';
    svg.innerHTML = m;
    readout(cell("Mode", mode) + cell("Square planar [MX₂L₂]","cis/trans") + cell("Td MX₂L₂","no geom. isomers"));
    verdict("<b>Zoom p.8–9:</b> only cis-[PtCl₂(en)₂]²⁺ is optically active. Square planar MABCD (Ex 5.12) has 3 geometrical isomers, none optical.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.structiso = (function(){
  var idx = 0;
  var kinds = [
    {id:"linkage",t:"Linkage", e:"[Co(NH₃)₅(NO₂)]Cl₂ yellow (Co–NO₂) vs red (Co–ONO)", test:"Ambidentate NO₂⁻ or SCN⁻"},
    {id:"coordination",t:"Coordination", e:"[Co(NH₃)₆][Cr(CN)₆] vs [Cr(NH₃)₆][Co(CN)₆]", test:"Ligands swap spheres"},
    {id:"ionisation",t:"Ionisation", e:"[Co(NH₃)₅Br]SO₄ vs [Co(NH₃)₅SO₄]Br", test:"Ba²⁺ → BaSO₄ only if SO₄²⁻ is free; Ag⁺ → AgBr only if Br⁻ is free"},
    {id:"solvate",t:"Solvate / hydrate", e:"[Cr(H₂O)₆]Cl₃ violet vs [Cr(H₂O)₅Cl]Cl₂·H₂O grey-green", test:"Water inside vs outside the sphere"}
  ];
  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Structural (different bonds)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      kinds.map(function(k,i){ return '<button class="preset-btn'+(i===0?' active':'')+'" data-preset="'+k.id+'" id="ps'+i+'">'+k.t+'</button>'; }).join("");
    kinds.forEach(function(k,i){
      document.getElementById("ps"+i).onclick = function(){ setActivePreset(this); idx=i; draw(0); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var k = kinds[idx];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="50" fill="#fbbf24" font-size="22" text-anchor="middle" font-weight="700">'+k.t+' isomerism</text>';
    m += '<text x="360" y="130" fill="#e2e8f0" font-size="15" text-anchor="middle">'+k.e+'</text>';
    m += '<text x="360" y="200" fill="#94a3b8" font-size="14" text-anchor="middle">'+k.test+'</text>';
    m += '<text x="360" y="260" fill="#64748b" font-size="12" text-anchor="middle">Intext 5.3(iii): [Co(NH₃)₅(NO₂)](NO₃)₂ can show geometrical + ionisation + linkage (10 isomers).</text>';
    svg.innerHTML = m;
    readout(cell("Type", k.t) + cell("Stereo vs structural","structural = different bonds"));
    verdict("<b>Intext 5.4:</b> ionisation isomers dissolve to different ions and therefore fail different precipitation tests.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.vbtlab = (function(){
  var idx = 0;
  var cxplx = [
    {id:"conh3",n:"[Co(NH₃)₆]³⁺", hyb:"d²sp³", geom:"octahedral inner / low-spin", spin:"n = 0 diamagnetic", os:"Co³⁺ d⁶"},
    {id:"cof6",n:"[CoF₆]³⁻", hyb:"sp³d²", geom:"octahedral outer / high-spin", spin:"n = 4 paramagnetic", os:"Co³⁺ d⁶"},
    {id:"nicl4",n:"[NiCl₄]²⁻", hyb:"sp³", geom:"tetrahedral", spin:"n = 2 paramagnetic", os:"Ni²⁺ d⁸"},
    {id:"nicn4",n:"[Ni(CN)₄]²⁻", hyb:"dsp²", geom:"square planar", spin:"n = 0 diamagnetic", os:"Ni²⁺ d⁸"},
    {id:"nico4",n:"[Ni(CO)₄]", hyb:"sp³", geom:"tetrahedral", spin:"n = 0 diamagnetic", os:"Ni(0)"},
    {id:"mnbr4",n:"[MnBr₄]²⁻", hyb:"sp³", geom:"tetrahedral (Ex 5.7)", spin:"μ = 5.9 BM, n = 5", os:"Mn²⁺ d⁵"}
  ];
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Inner d²sp³ / dsp²</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Outer sp³ / sp³d²</span></div>';
    document.getElementById("preset-bar").innerHTML =
      cxplx.map(function(c,i){ return '<button class="preset-btn'+(i===0?' active':'')+'" data-preset="'+c.id+'" id="pv'+i+'">'+c.n+'</button>'; }).join("");
    cxplx.forEach(function(c,i){
      document.getElementById("pv"+i).onclick = function(){ setActivePreset(this); idx=i; draw(0); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var c = cxplx[idx];
    var inner = c.hyb.indexOf("d²")>=0 || c.hyb==="dsp²";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="40" fill="#e2e8f0" font-size="18" text-anchor="middle" font-weight="700">'+c.n+'</text>';
    m += '<text x="360" y="90" fill="#94a3b8" font-size="14" text-anchor="middle">'+c.os+'</text>';
    m += '<rect x="160" y="110" width="400" height="120" rx="12" fill="#0f172a" stroke="'+(inner?"#38bdf8":"#f59e0b")+'" stroke-width="2"/>';
    m += '<text x="360" y="150" fill="'+(inner?"#7dd3fc":"#fcd34d")+'" font-size="22" text-anchor="middle" font-weight="700">'+c.hyb+'</text>';
    m += '<text x="360" y="180" fill="#e2e8f0" font-size="14" text-anchor="middle">'+c.geom+'</text>';
    m += '<text x="360" y="208" fill="#94a3b8" font-size="13" text-anchor="middle">'+c.spin+'</text>';
    m += '<text x="360" y="270" fill="#64748b" font-size="12" text-anchor="middle">Table 5.2. Hybrid orbitals “do not actually exist” (p.130) — they are a wave-equation device.</text>';
    svg.innerHTML = m;
    readout(cell("Hybrid", c.hyb) + cell("Geometry", c.geom) + cell("Magnetism", c.spin));
    verdict("<b>VBT:</b> magnetism picks inner vs outer. [FeF₆]³⁻ n=5 outer; [Fe(CN)₆]³⁻ n=1 inner; [Co(C₂O₄)₃]³⁻ diamagnetic inner.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.cftlab = (function(){
  var field = "oh-hs";
  var dcount = 4;
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>e<sub>g</sub> (+0.6 Δo)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>t₂<sub>g</sub> (−0.4 Δo)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="hs" id="p-hs">Octahedral weak (Δo &lt; P)</button>' +
      '<button class="preset-btn" data-preset="ls" id="p-ls">Octahedral strong (Δo &gt; P)</button>' +
      '<button class="preset-btn" data-preset="td" id="p-td">Tetrahedral Δt = 4/9 Δo</button>' +
      '<button class="preset-btn" data-preset="ti" id="p-ti">[Ti(H₂O)₆]³⁺ 498 nm</button>';
    document.getElementById("p-hs").onclick = function(){ setActivePreset(this); field="oh-hs"; draw(0); };
    document.getElementById("p-ls").onclick = function(){ setActivePreset(this); field="oh-ls"; draw(0); };
    document.getElementById("p-td").onclick = function(){ setActivePreset(this); field="td"; draw(0); };
    document.getElementById("p-ti").onclick = function(){ setActivePreset(this); field="ti"; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>d electron count</span><span class="val" id="ctrl-d">4</span></div>' +
      '<input type="range" id="ctrl-d-range" min="1" max="8" step="1" value="4"></div>';
    document.getElementById("ctrl-d-range").oninput = function(){
      dcount = Number(this.value); document.getElementById("ctrl-d").textContent = dcount; draw(0);
    };
    draw(0);
  }
  function fillHS(n){
    var t2=0, eg=0, left=n;
    while(left>0 && t2<3){ t2++; left--; }
    while(left>0 && eg<2){ eg++; left--; }
    while(left>0 && t2<6){ t2++; left--; }
    while(left>0 && eg<4){ eg++; left--; }
    return {t2:t2, eg:eg};
  }
  function fillLS(n){
    var t2=Math.min(n,6), eg=Math.max(0,n-6);
    return {t2:t2, eg:eg};
  }
  function cfse(t2, eg){
    return (-0.4*t2 + 0.6*eg);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(field==="ti"){
      m += '<text x="360" y="36" fill="#c4b5fd" font-size="16" text-anchor="middle" font-weight="700">[Ti(H₂O)₆]³⁺  ·  Table 5.3  ·  498 nm blue-green absorbed</text>';
      m += '<text x="200" y="100" fill="#38bdf8" font-size="14">t₂g¹  ground</text>';
      m += '<text x="480" y="70" fill="#f87171" font-size="14">e_g  excited</text>';
      m += '<line x1="240" y1="130" x2="480" y2="90" stroke="#c4b5fd" stroke-width="2" marker-end="url(#arr)"/>';
      m += '<rect x="80" y="150" width="200" height="50" rx="8" fill="#38bdf8"/>';
      m += '<rect x="440" y="90" width="200" height="50" rx="8" fill="#f87171"/>';
      m += '<text x="360" y="230" fill="#e2e8f0" font-size="14" text-anchor="middle">t₂g¹ e_g⁰  →  t₂g⁰ e_g¹   complementary colour = violet</text>';
      m += '<text x="360" y="260" fill="#94a3b8" font-size="13" text-anchor="middle">Heat off the water: no ligands, no Δ, colourless. Anhydrous CuSO₄ is white for the same reason.</text>';
      svg.innerHTML = m;
      readout(cell("λ_abs","498 nm") + cell("Absorbed","blue-green") + cell("Observed","violet"));
      verdict("<b>Fig. 5.10:</b> colour is the complementary of the d–d band. [Co(CN)₆]³⁻ absorbs 310 nm (UV) and is pale yellow.");
      return;
    }
    if(field==="td"){
      m += '<text x="360" y="28" fill="#e2e8f0" font-size="15" text-anchor="middle" font-weight="700">Tetrahedral splitting (Fig. 5.9) — inverted, smaller</text>';
      m += '<text x="360" y="70" fill="#f59e0b" font-size="14" text-anchor="middle">t₂ (dxy, dyz, dxz)  +0.4 Δt</text>';
      m += '<rect x="210" y="90" width="300" height="36" rx="6" fill="#92400e"/>';
      m += '<text x="360" y="160" fill="#38bdf8" font-size="14" text-anchor="middle">e (dx²−y², dz²)  −0.6 Δt</text>';
      m += '<rect x="210" y="175" width="300" height="36" rx="6" fill="#1e3a5f"/>';
      m += '<text x="360" y="240" fill="#fde68a" font-size="16" text-anchor="middle" font-weight="700">Δt = (4/9) Δo  (same M, L, distance)</text>';
      m += '<text x="360" y="270" fill="#94a3b8" font-size="12" text-anchor="middle">Low-spin tetrahedral is rare. No g subscript (no inversion centre).</text>';
      svg.innerHTML = m;
      readout(cell("Δt / Δo","4/9") + cell("e set","−0.6 Δt") + cell("t₂ set","+0.4 Δt"));
      verdict("<b>Zoom p.16:</b> splitting inverted vs octahedral. Pairing is seldom forced.");
      return;
    }
    var fill = field==="oh-ls" ? fillLS(dcount) : fillHS(dcount);
    var E = cfse(fill.t2, fill.eg);
    m += '<text x="360" y="24" fill="#e2e8f0" font-size="14" text-anchor="middle" font-weight="700">Octahedral CFT · d'+dcount+' · '+(field==="oh-ls"?"strong field Δo > P":"weak field Δo < P")+'</text>';
    m += '<text x="120" y="70" fill="#f87171" font-size="13">e_g  +0.6 Δo   dx²−y², dz²</text>';
    m += '<rect x="80" y="80" width="240" height="40" rx="6" fill="#7f1d1d"/>';
    m += '<text x="200" y="105" fill="#fecaca" font-size="13" text-anchor="middle">e_g occupancy '+fill.eg+'</text>';
    m += '<text x="500" y="70" fill="#38bdf8" font-size="13">t₂g  −0.4 Δo   dxy, dyz, dxz</text>';
    m += '<rect x="400" y="150" width="240" height="40" rx="6" fill="#1e3a5f"/>';
    m += '<text x="520" y="175" fill="#bae6fd" font-size="13" text-anchor="middle">t₂g occupancy '+fill.t2+'</text>';
    m += '<text x="360" y="230" fill="#34d399" font-size="16" text-anchor="middle" font-weight="700">CFSE = '+E.toFixed(1)+' Δo  (pairing energy extra for LS)</text>';
    m += '<text x="360" y="262" fill="#94a3b8" font-size="12" text-anchor="middle">d⁴ HS t₂g³ e_g¹ = −0.6 Δo · LS t₂g⁴ e_g⁰ = −1.6 Δo. Spectrochemical: I⁻ &lt; … &lt; CN⁻ &lt; CO.</text>';
    m += '<text x="360" y="286" fill="#64748b" font-size="11" text-anchor="middle">d⁴–d⁷ more stable in strong fields. Limits of CFT: anions sit low in the series; covalency ignored.</text>';
    svg.innerHTML = m;
    readout(cell("dⁿ","d"+dcount) + cell("t₂g", String(fill.t2)) + cell("e_g", String(fill.eg)) +
      cell("CFSE", E.toFixed(1)+" Δo", "#34d399"));
    verdict("<b>Fig. 5.8 (zoom p.15):</b> barycentre conserved (3×0.4 = 2×0.6). Weak field: fourth electron enters e_g; strong field: it pairs in t₂g.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.apps = (function(){
  var idx = 0;
  var cards = [
    {id:"synergic",t:"Synergic carbonyls", d:"OC→M σ + M→π*(CO) back-bond. Ni(CO)₄ Td, Fe(CO)₅ TBP, Cr(CO)₆ Oh. Mn₂(CO)₁₀ Mn–Mn; Co₂(CO)₈ bridged CO."},
    {id:"biology",t:"Biology", d:"Chlorophyll (Mg), haemoglobin (Fe, O₂ carrier), vitamin B₁₂ (Co, anti-pernicious anaemia), carbonic anhydrase, carboxypeptidase A."},
    {id:"analysis",t:"Analysis & hardness", d:"EDTA, DMG, cupron, α-nitroso-β-naphthol. Na₂EDTA titration of Ca²⁺/Mg²⁺ (different Kstab)."},
    {id:"metallurgy",t:"Metallurgy", d:"Au + CN⁻ + O₂ + H₂O → [Au(CN)₂]⁻ then Zn. Mond: Ni → [Ni(CO)₄] → pure Ni. Electroplating from [Ag(CN)₂]⁻ / [Au(CN)₂]⁻."},
    {id:"medicine",t:"Medicine & photo", d:"cis-platin (tumours); EDTA (Pb); D-penicillamine (Cu); desferrioxime B (Fe). Hypo: AgBr → [Ag(S₂O₃)₂]³⁻. Wilkinson [(Ph₃P)₃RhCl] hydrogenates alkenes."}
  ];
  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>§5.6–5.7</span></div>';
    document.getElementById("preset-bar").innerHTML =
      cards.map(function(c,i){ return '<button class="preset-btn'+(i===0?' active':'')+'" data-preset="'+c.id+'" id="pa'+i+'">'+c.t.split(" ")[0]+'</button>'; }).join("");
    cards.forEach(function(c,i){
      document.getElementById("pa"+i).onclick = function(){ setActivePreset(this); idx=i; draw(0); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var c = cards[idx];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="48" fill="#34d399" font-size="20" text-anchor="middle" font-weight="700">'+c.t+'</text>';
    m += '<foreignObject x="50" y="80" width="620" height="160"><div xmlns="http://www.w3.org/1999/xhtml" style="color:#e2e8f0;font:16px/1.55 system-ui;text-align:center">'+c.d+'</div></foreignObject>';
    m += '<text x="360" y="270" fill="#64748b" font-size="12" text-anchor="middle">Chelate effect: [Fe(C₂O₄)₃]³⁻ more stable than unidentate Fe(III) analogues (Ex 5.30).</text>';
    svg.innerHTML = m;
    readout(cell("Topic", c.t) + cell("Fig. 5.14", "synergic M–CO"));
    verdict("<b>Indian connect:</b> gold cyanidation (Kolar/Hutti) is the [Au(CN)₂]⁻ extraction; municipal labs still titrate hardness with Na₂EDTA.");
  }
  return { mount: mount, draw: draw };
})();
