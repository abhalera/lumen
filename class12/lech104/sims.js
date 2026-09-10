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

var ROW3D = [
  {sym:"Sc", z:21, d:1, s:2, note:"3d¹4s²", trans:true},
  {sym:"Ti", z:22, d:2, s:2, note:"3d²4s²", trans:true},
  {sym:"V",  z:23, d:3, s:2, note:"3d³4s²", trans:true},
  {sym:"Cr", z:24, d:5, s:1, note:"3d⁵4s¹ (not 3d⁴4s²)", trans:true},
  {sym:"Mn", z:25, d:5, s:2, note:"3d⁵4s²", trans:true},
  {sym:"Fe", z:26, d:6, s:2, note:"3d⁶4s²", trans:true},
  {sym:"Co", z:27, d:7, s:2, note:"3d⁷4s²", trans:true},
  {sym:"Ni", z:28, d:8, s:2, note:"3d⁸4s²", trans:true},
  {sym:"Cu", z:29, d:10,s:1, note:"3d¹⁰4s¹ (not 3d⁹4s²)", trans:true},
  {sym:"Zn", z:30, d:10,s:2, note:"3d¹⁰4s² — not a transition metal", trans:false}
];

window.SIMS.dfill = (function(){
  var idx = 3;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>3d electron</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>4s electron</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Zn excluded by IUPAC</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-sc">Sc 3d¹4s²</button>' +
      '<button class="preset-btn active" id="p-cr">Cr 3d⁵4s¹</button>' +
      '<button class="preset-btn" id="p-cu">Cu 3d¹⁰4s¹</button>' +
      '<button class="preset-btn" id="p-zn">Zn 3d¹⁰4s²</button>';
    document.getElementById("p-sc").onclick = function(){ setActivePreset(this); idx=0; draw(0); };
    document.getElementById("p-cr").onclick = function(){ setActivePreset(this); idx=3; draw(0); };
    document.getElementById("p-cu").onclick = function(){ setActivePreset(this); idx=8; draw(0); };
    document.getElementById("p-zn").onclick = function(){ setActivePreset(this); idx=9; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Element (Sc→Zn)</span><span class="val" id="ctrl-el">Cr</span></div>' +
      '<input type="range" id="ctrl-el-range" min="0" max="9" step="1" value="3"></div>';
    document.getElementById("ctrl-el-range").oninput = function(){
      idx = Number(this.value);
      document.getElementById("ctrl-el").textContent = ROW3D[idx].sym;
      draw(App.state.t);
    };
    draw(0);
  }
  function orb(x, y, filled, color){
    var c = filled ? color : "#1e293b";
    var st = filled ? color : "#475569";
    return '<circle cx="'+x+'" cy="'+y+'" r="11" fill="'+c+'" stroke="'+st+'" stroke-width="2"/>';
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var el = ROW3D[idx];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="28" fill="#e2e8f0" font-size="16" text-anchor="middle" font-weight="700">' +
      el.sym + ' (Z = ' + el.z + ')  ·  Table 4.1 ground state: ' + el.note + '</text>';
    m += '<text x="80" y="70" fill="#94a3b8" font-size="13">4s</text>';
    m += '<text x="80" y="150" fill="#94a3b8" font-size="13">3d</text>';
    var i, x;
    for(i=0;i<2;i++){
      x = 140 + i*36;
      m += orb(x, 64, i < el.s, "#f59e0b");
    }
    var dShown = Math.min(el.d, Math.floor((t/6)*el.d + 0.001) + (t>0?1:el.d));
    if(t === 0) dShown = el.d;
    for(i=0;i<5;i++){
      x = 140 + i*48;
      var up = i < el.d;
      var down = i < (el.d - 5);
      m += '<rect x="'+(x-16)+'" y="118" width="32" height="70" rx="6" fill="#0f172a" stroke="#334155"/>';
      if(up) m += '<circle cx="'+x+'" cy="136" r="8" fill="#38bdf8"/>';
      if(down) m += '<circle cx="'+x+'" cy="168" r="8" fill="#7dd3fc"/>';
    }
    m += '<text x="360" y="220" fill="#94a3b8" font-size="13" text-anchor="middle">Hund filling of 3d (boxes) + 4s (gold). Cr and Cu break naïve aufbau.</text>';
    var badge = el.trans ? "YES — incomplete d in atom or ion" : "NO — d¹⁰ in atom and Zn²⁺";
    var col = el.trans ? "#34d399" : "#f87171";
    m += '<text x="360" y="255" fill="'+col+'" font-size="15" text-anchor="middle" font-weight="700">IUPAC transition metal? '+badge+'</text>';
    m += '<text x="360" y="286" fill="#64748b" font-size="12" text-anchor="middle">Pd (4d¹⁰5s⁰) is the other famous exception in Table 4.1.</text>';
    svg.innerHTML = m;
    readout(cell("Config", el.note) + cell("3d count", String(el.d)) + cell("4s count", String(el.s)) +
      cell("Transition?", el.trans ? "YES" : "NO", col));
    verdict(el.trans
      ? "<b>Table 4.1 (zoom p.2–3):</b> incomplete 3d in the atom. Ag is still transition because Ag²⁺ is 4d⁹ (Intext 4.1)."
      : "<b>Example 4.1:</b> Zn atom and Zn²⁺ are both 3d¹⁰. IUPAC therefore excludes Zn, Cd, Hg and Cn.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.physprop = (function(){
  var mode = "dah";
  var DAH = [326,473,515,397,281,416,425,430,339,126];
  var RAD = [164,147,135,129,137,126,125,125,128,137];
  var DEN = [3.43,4.1,6.07,7.19,7.21,7.8,8.7,8.9,8.9,7.1];
  var SY = ["Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Table 4.2 value</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Zr 160 / Hf 159 pm</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-dah">Δ<sub>a</sub>H° (kJ mol⁻¹)</button>' +
      '<button class="preset-btn" id="p-rad">Metallic radius / pm</button>' +
      '<button class="preset-btn" id="p-den">Density / g cm⁻³</button>';
    document.getElementById("p-dah").onclick = function(){ setActivePreset(this); mode="dah"; draw(0); };
    document.getElementById("p-rad").onclick = function(){ setActivePreset(this); mode="rad"; draw(0); };
    document.getElementById("p-den").onclick = function(){ setActivePreset(this); mode="den"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var data = mode==="dah" ? DAH : (mode==="rad" ? RAD : DEN);
    var max = mode==="dah" ? 550 : (mode==="rad" ? 180 : 10);
    var min = mode==="dah" ? 0 : (mode==="rad" ? 110 : 0);
    var nShow = Math.max(1, Math.min(10, Math.floor(1 + (t/6)*9)));
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var title = mode==="dah" ? "Enthalpy of atomisation ΔaH° / kJ mol⁻¹ (Table 4.2)" :
      (mode==="rad" ? "Metallic radius M / pm (Table 4.2)" : "Density / g cm⁻³ (Table 4.2)");
    m += '<text x="360" y="24" fill="#e2e8f0" font-size="14" text-anchor="middle" font-weight="700">'+title+'</text>';
    var i, x, h, y;
    for(i=0;i<nShow;i++){
      x = 50 + i*66;
      h = ((data[i]-min)/(max-min))*200;
      y = 250 - h;
      var col = (mode==="dah" && i===9) || (mode==="rad" && i===0) ? "#f59e0b" : "#38bdf8";
      if(mode==="dah" && i===2) col = "#34d399";
      m += '<rect x="'+(x-14)+'" y="'+y+'" width="28" height="'+h+'" rx="3" fill="'+col+'"/>';
      m += '<text x="'+x+'" y="268" fill="#94a3b8" font-size="12" text-anchor="middle">'+SY[i]+'</text>';
      m += '<text x="'+x+'" y="'+(y-6)+'" fill="#e2e8f0" font-size="10" text-anchor="middle">'+data[i]+'</text>';
    }
    if(mode==="rad"){
      m += '<text x="360" y="292" fill="#f59e0b" font-size="12" text-anchor="middle">Lanthanoid contraction pair (not in this row): Zr 160 pm ≈ Hf 159 pm</text>';
    } else {
      m += '<text x="360" y="292" fill="#64748b" font-size="12" text-anchor="middle">Zn ΔaH = 126 kJ mol⁻¹ is the 3d minimum (Intext 4.2). Density rebounds at Zn (radius 137 pm).</text>';
    }
    svg.innerHTML = m;
    var hi = SY[data.indexOf(Math.max.apply(null, data.slice(0,nShow)))];
    readout(cell("Series", "Sc–Zn") + cell("Showing", nShow+"/10") + cell("Peak among shown", hi));
    verdict(mode==="dah"
      ? "<b>Fig. 4.2 / Table 4.2:</b> mid-series maximum (V 515) from unpaired d electrons in metallic bonding. Mn 281 is anomalously low."
      : (mode==="rad"
        ? "<b>Zoom p.6:</b> slow contraction across 3d; 5d ≈ 4d because 4f filling (Zr 160, Hf 159 pm). Do not invent other 4d/5d radii."
        : "<b>Table 4.2:</b> Ti 4.1 → Cu 8.9 g cm⁻³ as radius falls and mass rises; Zn 7.1 as radius rebounds."));
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.oxmap = (function(){
  var OS = {
    Sc:["+3"], Ti:["+2","+3","+4"], V:["+2","+3","+4","+5"],
    Cr:["+2","+3","+4","+5","+6"], Mn:["+2","+3","+4","+5","+6","+7"],
    Fe:["+2","+3","+4","+6"], Co:["+2","+3","+4"], Ni:["+2","+3","+4"],
    Cu:["+1","+2"], Zn:["+2"]
  };
  var BOLD = {Sc:["+3"],Ti:["+4"],V:["+5"],Cr:["+3","+6"],Mn:["+2","+7"],Fe:["+2","+3"],Co:["+2","+3"],Ni:["+2"],Cu:["+2"],Zn:["+2"]};
  var SY = ["Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn"];
  var sel = 4;
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Most common (bold in Table 4.3)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Also known</span></div>';
    document.getElementById("preset-bar").innerHTML =
      SY.map(function(s,i){ return '<button class="preset-btn'+(i===4?' active':'')+'" id="pox'+i+'">'+s+'</button>'; }).join("");
    SY.forEach(function(s,i){
      document.getElementById("pox"+i).onclick = function(){ setActivePreset(this); sel=i; draw(0); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var el = SY[sel];
    var list = OS[el];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="28" fill="#e2e8f0" font-size="16" text-anchor="middle" font-weight="700">Table 4.3 · '+el+' oxidation states (bold = most common)</text>';
    list.forEach(function(os, i){
      var x = 80 + i*90;
      var bold = BOLD[el].indexOf(os) >= 0;
      m += '<rect x="'+x+'" y="70" width="70" height="70" rx="10" fill="'+(bold?"#92400e":"#0f172a")+'" stroke="'+(bold?"#fbbf24":"#38bdf8")+'" stroke-width="2"/>';
      m += '<text x="'+(x+35)+'" y="114" fill="'+(bold?"#fde68a":"#7dd3fc")+'" font-size="22" text-anchor="middle" font-weight="700">'+os+'</text>';
    });
    m += '<text x="360" y="180" fill="#94a3b8" font-size="13" text-anchor="middle">Greatest variety in the middle of the row (Mn +2…+7). Sc only +3; Zn only +2.</text>';
    m += '<text x="360" y="210" fill="#94a3b8" font-size="13" text-anchor="middle">Group-number OS as oxo species: TiO₂, VO₂⁺, CrO₄²⁻, MnO₄⁻ — then a sharp drop.</text>';
    m += '<text x="360" y="250" fill="#fbbf24" font-size="13" text-anchor="middle">Cr(VI) oxidising; Mo(VI)/W(VI) not — higher OS more stable down a d-group.</text>';
    m += '<text x="360" y="280" fill="#64748b" font-size="12" text-anchor="middle">Zero OS with π-acceptors: Ni(CO)₄, Fe(CO)₅.</text>';
    svg.innerHTML = m;
    readout(cell("Element", el) + cell("OS listed", list.join(", ")) + cell("Most common", BOLD[el].join(", "), "#fbbf24"));
    verdict("<b>Table 4.3 (zoom p.8):</b> OS differ by unity (contrast p-block, differ by two). Intext 4.3: Mn has the most OS because it has the most unpaired electrons.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.ezero = (function(){
  var couple = "m2";
  var M2 = [{s:"Ti",v:-1.63},{s:"V",v:-1.18},{s:"Cr",v:-0.90},{s:"Mn",v:-1.18},{s:"Fe",v:-0.44},{s:"Co",v:-0.28},{s:"Ni",v:-0.25},{s:"Cu",v:0.34},{s:"Zn",v:-0.76}];
  var M3 = [{s:"Ti",v:-0.37},{s:"V",v:-0.26},{s:"Cr",v:-0.41},{s:"Mn",v:1.57},{s:"Fe",v:0.77},{s:"Co",v:1.97}];
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>E° / V (Table 4.2)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Positive / oxidising</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-m2">E°(M²⁺/M)</button>' +
      '<button class="preset-btn" id="p-m3">E°(M³⁺/M²⁺)</button>' +
      '<button class="preset-btn" id="p-cu">Why Cu is +0.34 V</button>';
    document.getElementById("p-m2").onclick = function(){ setActivePreset(this); couple="m2"; draw(0); };
    document.getElementById("p-m3").onclick = function(){ setActivePreset(this); couple="m3"; draw(0); };
    document.getElementById("p-cu").onclick = function(){ setActivePreset(this); couple="cu"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(couple==="cu"){
      m += '<text x="360" y="36" fill="#e2e8f0" font-size="16" text-anchor="middle" font-weight="700">Intext 4.4 · E°(Cu²⁺/Cu) = +0.34 V</text>';
      m += '<text x="360" y="90" fill="#94a3b8" font-size="14" text-anchor="middle">High ΔaH (339 kJ mol⁻¹) + high IE₁+IE₂ (745+1958)</text>';
      m += '<text x="360" y="120" fill="#94a3b8" font-size="14" text-anchor="middle">are not repaid by ΔhydH(Cu²⁺) = −2121 kJ mol⁻¹ (Table 4.4).</text>';
      m += '<text x="360" y="170" fill="#f87171" font-size="15" text-anchor="middle" font-weight="700">Consequence: Cu does not liberate H₂ from non-oxidising acids.</text>';
      m += '<text x="360" y="210" fill="#94a3b8" font-size="13" text-anchor="middle">2 Cu⁺(aq) → Cu²⁺(aq) + Cu(s)  —  ΔhydH of Cu²⁺ also drives disproportionation.</text>';
      m += '<text x="360" y="250" fill="#64748b" font-size="12" text-anchor="middle">Only HNO₃ and hot conc. H₂SO₄ dissolve copper (acids themselves reduced).</text>';
      svg.innerHTML = m;
      readout(cell("E° Cu²⁺/Cu","+0.34 V","#f87171") + cell("ΔaH","339 kJ mol⁻¹") + cell("ΔhydH","−2121 kJ mol⁻¹"));
      verdict("<b>Table 4.4 (zoom p.11):</b> unique positive E° in the 3d M²⁺/M list. Mn, Ni, Zn are more negative than the trend (d⁵, hydration, d¹⁰).");
      return;
    }
    var data = couple==="m2" ? M2 : M3;
    var title = couple==="m2" ? "E°(M²⁺/M) / V  — Table 4.2" : "E°(M³⁺/M²⁺) / V  — Table 4.2";
    m += '<text x="360" y="24" fill="#e2e8f0" font-size="14" text-anchor="middle" font-weight="700">'+title+'</text>';
    m += '<line x1="40" y1="160" x2="700" y2="160" stroke="#334155" stroke-width="2"/>';
    m += '<text x="50" y="154" fill="#64748b" font-size="11">0 V</text>';
    data.forEach(function(d, i){
      var x = 70 + i*(couple==="m2"?70:100);
      var h = d.v * (couple==="m2"?50:40);
      var y1 = 160, y2 = 160 - h;
      var col = d.v > 0 ? "#f87171" : "#38bdf8";
      m += '<rect x="'+(x-16)+'" y="'+Math.min(y1,y2)+'" width="32" height="'+Math.abs(h)+'" rx="3" fill="'+col+'"/>';
      m += '<text x="'+x+'" y="280" fill="#94a3b8" font-size="12" text-anchor="middle">'+d.s+'</text>';
      m += '<text x="'+x+'" y="'+(Math.min(y1,y2)-8)+'" fill="#e2e8f0" font-size="11" text-anchor="middle">'+d.v+'</text>';
    });
    svg.innerHTML = m;
    readout(cell("Couple", couple==="m2"?"M²⁺/M":"M³⁺/M²⁺") + cell("Cu", couple==="m2"?"+0.34 V":"—") +
      cell("Mn³⁺/Mn²⁺", "+1.57 V","#f87171") + cell("Co³⁺/Co²⁺","+1.97 V","#f87171"));
    verdict(couple==="m2"
      ? "<b>+2/+3 lab:</b> less negative E° across the row. Cr²⁺, V²⁺, Ti²⁺ reduce H⁺; Cu will not."
      : "<b>Example 4.4 / 4.7:</b> Mn³⁺ (d⁴→d⁵) and Co³⁺ are strong oxidants. Cr²⁺ (d⁴→d³ t₂g³) is reducing.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.spinonly = (function(){
  var n = 5;
  function mu(n){ return Math.sqrt(n*(n+2)); }
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Unpaired e⁻</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>μ = √n(n+2) BM</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-ti">Ti³⁺ n=1</button>' +
      '<button class="preset-btn" id="p-cr">Cr²⁺ n=4</button>' +
      '<button class="preset-btn active" id="p-mn">Mn²⁺ n=5 (Ex 4.8)</button>' +
      '<button class="preset-btn" id="p-co">Co²⁺ n=3 (Intext 4.8)</button>' +
      '<button class="preset-btn" id="p-zn">Zn²⁺ n=0</button>';
    document.getElementById("p-ti").onclick = function(){ setActivePreset(this); n=1; draw(0); };
    document.getElementById("p-cr").onclick = function(){ setActivePreset(this); n=4; draw(0); };
    document.getElementById("p-mn").onclick = function(){ setActivePreset(this); n=5; draw(0); };
    document.getElementById("p-co").onclick = function(){ setActivePreset(this); n=3; draw(0); };
    document.getElementById("p-zn").onclick = function(){ setActivePreset(this); n=0; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Unpaired electrons n</span><span class="val" id="ctrl-n">5</span></div>' +
      '<input type="range" id="ctrl-n-range" min="0" max="5" step="1" value="5"></div>';
    document.getElementById("ctrl-n-range").oninput = function(){
      n = Number(this.value); document.getElementById("ctrl-n").textContent = n; draw(0);
    };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var val = mu(n);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="30" fill="#e2e8f0" font-size="16" text-anchor="middle" font-weight="700">Spin-only formula  μ = √n(n+2)  BM  (3d, orbital part quenched)</text>';
    var i;
    for(i=0;i<5;i++){
      var x = 80 + i*50;
      var filled = i < n;
      m += '<circle cx="'+x+'" cy="100" r="16" fill="'+(filled?"#38bdf8":"#1e293b")+'" stroke="#475569" stroke-width="2"/>';
      if(filled) m += '<text x="'+x+'" y="105" fill="#0f172a" font-size="12" text-anchor="middle" font-weight="700">↑</text>';
    }
    m += '<rect x="400" y="60" width="280" height="90" rx="10" fill="#0f172a" stroke="#34d399"/>';
    m += '<text x="540" y="95" fill="#94a3b8" font-size="13" text-anchor="middle">μ calculated</text>';
    m += '<text x="540" y="128" fill="#34d399" font-size="28" text-anchor="middle" font-weight="700">'+val.toFixed(2)+' BM</text>';
    m += '<text x="360" y="190" fill="#94a3b8" font-size="13" text-anchor="middle">Table 4.7: n=0 → 0; 1 → 1.73; 2 → 2.84; 3 → 3.87; 4 → 4.90; 5 → 5.92</text>';
    m += '<text x="360" y="220" fill="#94a3b8" font-size="13" text-anchor="middle">Observed Fe²⁺ 5.3–5.5 and Co²⁺ 4.4–5.2 exceed spin-only (residual orbital contribution).</text>';
    m += '<text x="360" y="255" fill="#fbbf24" font-size="13" text-anchor="middle">Example 4.8: Z=25, M²⁺ is d⁵, μ = √35 = 5.92 BM. Intext 4.8: Co²⁺ (Z=27) d⁷, μ = √15 = 3.87 BM.</text>';
    m += '<text x="360" y="285" fill="#64748b" font-size="12" text-anchor="middle">Colours (Table 4.8): d⁰/d¹⁰ colourless; Ti³⁺ purple; Mn²⁺ pink; Ni²⁺ green; Cu²⁺ blue.</text>';
    svg.innerHTML = m;
    readout(cell("n", String(n)) + cell("μ calc", val.toFixed(2)+" BM", "#34d399") + cell("n=1", "1.73") + cell("n=5","5.92"));
    verdict("<b>Zoom p.14:</b> one unpaired electron = 1.73 BM. Ferromagnetism is extreme paramagnetism (Fe, Co, Ni metals).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.oxoanion = (function(){
  var mode = "cr";
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f97316;"></span><span>Cr(VI) orange / yellow</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Mn(VII) purple</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cr">K₂Cr₂O₇  E°=1.33 V</button>' +
      '<button class="preset-btn" id="p-mn">KMnO₄  pH ladder</button>' +
      '<button class="preset-btn" id="p-ph">Chromate ⇌ dichromate</button>';
    document.getElementById("p-cr").onclick = function(){ setActivePreset(this); mode="cr"; draw(0); };
    document.getElementById("p-mn").onclick = function(){ setActivePreset(this); mode="mn"; draw(0); };
    document.getElementById("p-ph").onclick = function(){ setActivePreset(this); mode="ph"; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>pH (chromate switch)</span><span class="val" id="ctrl-ph">1</span></div>' +
      '<input type="range" id="ctrl-ph-range" min="1" max="12" step="1" value="1"></div>';
    document.getElementById("ctrl-ph-range").oninput = function(){
      document.getElementById("ctrl-ph").textContent = this.value; draw(0);
    };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var ph = Number((document.getElementById("ctrl-ph-range")||{value:1}).value);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="cr"){
      m += '<text x="360" y="28" fill="#fb923c" font-size="16" text-anchor="middle" font-weight="700">Potassium dichromate — primary standard</text>';
      m += '<text x="360" y="70" fill="#e2e8f0" font-size="14" text-anchor="middle">4 FeCr₂O₄ + 8 Na₂CO₃ + 7 O₂ → 8 Na₂CrO₄ + 2 Fe₂O₃ + 8 CO₂</text>';
      m += '<text x="360" y="100" fill="#94a3b8" font-size="13" text-anchor="middle">Acidify → Na₂Cr₂O₇ · 2H₂O;  Na₂Cr₂O₇ + 2 KCl → K₂Cr₂O₇ + 2 NaCl</text>';
      m += '<text x="360" y="150" fill="#fdba74" font-size="15" text-anchor="middle">Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H₂O    E° = 1.33 V</text>';
      m += '<text x="360" y="190" fill="#94a3b8" font-size="13" text-anchor="middle">Oxidises I⁻ → I₂, Fe²⁺ → Fe³⁺, H₂S → S, Sn²⁺ → Sn⁴⁺ (6-electron half-cell).</text>';
      m += '<text x="360" y="230" fill="#94a3b8" font-size="13" text-anchor="middle">CrO₄²⁻ tetrahedral; Cr₂O₇²⁻ two tetrahedra sharing a corner, Cr–O–Cr = 126°.</text>';
      m += '<text x="360" y="270" fill="#64748b" font-size="12" text-anchor="middle">OS of Cr is +6 in both chromate and dichromate.</text>';
      readout(cell("E°","1.33 V","#fb923c") + cell("e⁻ / Cr₂O₇²⁻","6") + cell("Product","Cr³⁺"));
      verdict("<b>Sukinda chromite</b> is fused in alkali/air exactly as written. Increasing pH turns orange dichromate yellow (chromate) without changing OS.");
    } else if(mode==="mn"){
      m += '<text x="360" y="28" fill="#c084fc" font-size="16" text-anchor="middle" font-weight="700">KMnO₄ — three reduction levels</text>';
      m += '<text x="360" y="70" fill="#e2e8f0" font-size="14" text-anchor="middle">MnO₄⁻ + e⁻ → MnO₄²⁻          E° = +0.56 V  (alkaline, green manganate)</text>';
      m += '<text x="360" y="105" fill="#e2e8f0" font-size="14" text-anchor="middle">MnO₄⁻ + 4 H⁺ + 3 e⁻ → MnO₂ + 2 H₂O     E° = +1.69 V</text>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="14" text-anchor="middle">MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O     E° = +1.52 V</text>';
      m += '<text x="360" y="185" fill="#94a3b8" font-size="13" text-anchor="middle">Solubility 6.4 g / 100 g water at 293 K; decomposes at 513 K → K₂MnO₄ + MnO₂ + O₂.</text>';
      m += '<text x="360" y="215" fill="#94a3b8" font-size="13" text-anchor="middle">MnO₄⁻ diamagnetic; MnO₄²⁻ paramagnetic (one unpaired). Do not titrate in HCl (→ Cl₂).</text>';
      m += '<text x="360" y="250" fill="#c084fc" font-size="13" text-anchor="middle">3 MnO₄²⁻ + 4 H⁺ → 2 MnO₄⁻ + MnO₂ + 2 H₂O  (Example 4.9 disproportionation)</text>';
      m += '<text x="360" y="280" fill="#64748b" font-size="12" text-anchor="middle">Water oxidation is thermodynamically allowed at [H⁺]=1 but kinetically slow unless Mn²⁺ is present.</text>';
      readout(cell("Acid E°","1.52 V","#c084fc") + cell("to MnO₂","1.69 V") + cell("to MnO₄²⁻","0.56 V") + cell("solubility","6.4 g/100 g"));
      verdict("<b>Zoom p.19:</b> isostructural with KClO₄. Pyrolusite fusion then electrolytic oxidation is the commercial route.");
    } else {
      var acidic = ph < 7;
      var col = acidic ? "#f97316" : "#facc15";
      m += '<rect x="200" y="70" width="320" height="120" rx="16" fill="'+col+'"/>';
      m += '<text x="360" y="40" fill="#e2e8f0" font-size="16" text-anchor="middle" font-weight="700">pH switch · OS of Cr stays +6</text>';
      m += '<text x="360" y="125" fill="#0f172a" font-size="20" text-anchor="middle" font-weight="700">'+(acidic?"Cr₂O₇²⁻  orange":"CrO₄²⁻  yellow")+'</text>';
      m += '<text x="360" y="155" fill="#0f172a" font-size="13" text-anchor="middle">pH = '+ph+'</text>';
      m += '<text x="360" y="230" fill="#94a3b8" font-size="13" text-anchor="middle">2 CrO₄²⁻ + 2 H⁺ ⇌ Cr₂O₇²⁻ + H₂O</text>';
      m += '<text x="360" y="260" fill="#94a3b8" font-size="13" text-anchor="middle">Cr₂O₇²⁻ + 2 OH⁻ → 2 CrO₄²⁻ + H₂O</text>';
      readout(cell("pH", String(ph)) + cell("Dominant", acidic?"dichromate":"chromate", col) + cell("OS(Cr)","+6"));
      verdict("<b>Not a redox change.</b> Raising pH of K₂Cr₂O₇ turns the solution yellow without reducing chromium.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.lnradii = (function(){
  var metals = [187,183,182,181,181,180,199,180,178,177,176,175,174,173,null];
  var ion3 = [106,103,101,99,98,96,95,94,92,91,89,88,87,86,null];
  var names = ["La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu"];
  var mode = "ion";
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Table 4.9 listed value</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Not tabulated (Lu)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Eu/Yb metallic outliers</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ion">Ln³⁺ radii / pm</button>' +
      '<button class="preset-btn" id="p-met">Metallic radii / pm</button>' +
      '<button class="preset-btn" id="p-zrhf">Zr 160 · Hf 159 consequence</button>';
    document.getElementById("p-ion").onclick = function(){ setActivePreset(this); mode="ion"; draw(0); };
    document.getElementById("p-met").onclick = function(){ setActivePreset(this); mode="met"; draw(0); };
    document.getElementById("p-zrhf").onclick = function(){ setActivePreset(this); mode="zrhf"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="zrhf"){
      m += '<text x="360" y="40" fill="#e2e8f0" font-size="16" text-anchor="middle" font-weight="700">Only 4d/5d pair quoted in this chapter</text>';
      m += '<rect x="140" y="90" width="180" height="100" rx="12" fill="#0f172a" stroke="#38bdf8"/>';
      m += '<text x="230" y="135" fill="#94a3b8" font-size="14" text-anchor="middle">Zr</text>';
      m += '<text x="230" y="165" fill="#38bdf8" font-size="28" text-anchor="middle" font-weight="700">160 pm</text>';
      m += '<rect x="400" y="90" width="180" height="100" rx="12" fill="#0f172a" stroke="#f59e0b"/>';
      m += '<text x="490" y="135" fill="#94a3b8" font-size="14" text-anchor="middle">Hf</text>';
      m += '<text x="490" y="165" fill="#f59e0b" font-size="28" text-anchor="middle" font-weight="700">159 pm</text>';
      m += '<text x="360" y="230" fill="#94a3b8" font-size="13" text-anchor="middle">4f filling before 5d almost cancels the expected size jump.</text>';
      m += '<text x="360" y="260" fill="#f87171" font-size="13" text-anchor="middle">Do not invent a “pm per element” contraction or a Lu radius — Table 4.9 leaves Lu blank.</text>';
      svg.innerHTML = m;
      readout(cell("Zr","160 pm") + cell("Hf","159 pm","#f59e0b") + cell("Lu radii","not listed","#f87171"));
      verdict("<b>Zoom p.6 and Table 4.9:</b> the contraction is demonstrated by listed La→Yb numbers plus this pair.");
      return;
    }
    var data = mode==="ion" ? ion3 : metals;
    var max = mode==="ion" ? 110 : 210;
    var min = mode==="ion" ? 80 : 165;
    var nShow = Math.max(1, Math.min(15, Math.floor(1+(t/6)*14)));
    m += '<text x="360" y="22" fill="#e2e8f0" font-size="14" text-anchor="middle" font-weight="700">'+(mode==="ion"?"Ln³⁺ radii / pm":"Metallic radii / pm")+' · Table 4.9 only</text>';
    data.forEach(function(v,i){
      if(i>=nShow) return;
      var x = 30 + i*46;
      if(v===null){
        m += '<rect x="'+x+'" y="80" width="36" height="160" rx="4" fill="#1e293b" stroke="#f87171" stroke-dasharray="4 3"/>';
        m += '<text x="'+(x+18)+'" y="160" fill="#f87171" font-size="10" text-anchor="middle">n/a</text>';
      } else {
        var h = ((v-min)/(max-min))*160;
        var col = (mode!=="ion" && (i===6||i===13)) ? "#f59e0b" : "#38bdf8";
        m += '<rect x="'+x+'" y="'+(240-h)+'" width="36" height="'+h+'" rx="4" fill="'+col+'"/>';
        m += '<text x="'+(x+18)+'" y="'+(234-h)+'" fill="#e2e8f0" font-size="10" text-anchor="middle">'+v+'</text>';
      }
      m += '<text x="'+(x+18)+'" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">'+names[i]+'</text>';
    });
    m += '<text x="360" y="292" fill="#64748b" font-size="11" text-anchor="middle">E°(Ce⁴⁺/Ce³⁺)=+1.74 V · mischmetall ~95% Ln + ~5% Fe · Sm m.p. 1623 K</text>';
    svg.innerHTML = m;
    readout(cell("La³⁺","106 pm") + cell("Yb³⁺","86 pm") + cell("Lu","not listed","#f87171") + cell("Eu metal","199 pm","#f59e0b"));
    verdict("<b>Table 4.9 (zoom p.22):</b> fairly regular Ln³⁺ decrease. Metallic Eu (199) and Yb (173) bulge because of stable f⁷/f¹⁴ divalent cores.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.actinoid = (function(){
  var rows = [
    {s:"Ac", os:[3]},{s:"Th", os:[3,4]},{s:"Pa", os:[3,4,5]},{s:"U", os:[3,4,5,6]},
    {s:"Np", os:[3,4,5,6,7]},{s:"Pu", os:[3,4,5,6,7]},{s:"Am", os:[3,4,5,6]},
    {s:"Cm", os:[3,4]},{s:"Bk", os:[3,4]},{s:"Cf", os:[3]},{s:"Es", os:[3]},
    {s:"Fm", os:[3]},{s:"Md", os:[3]},{s:"No", os:[3]},{s:"Lr", os:[3]}
  ];
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>+3</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>+4 to +6</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>+7 (Np, Pu)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-tab">Table 4.11 OS map</button>' +
      '<button class="preset-btn" id="p-lr">Lr Z=103</button>';
    document.getElementById("p-tab").onclick = function(){ setActivePreset(this); draw(0); };
    document.getElementById("p-lr").onclick = function(){ setActivePreset(this); draw(1); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(t>=1 && document.querySelector("#p-lr.active")){
      m += '<text x="360" y="50" fill="#e2e8f0" font-size="16" text-anchor="middle" font-weight="700">Last actinoid · Ex 4.30</text>';
      m += '<text x="360" y="110" fill="#38bdf8" font-size="28" text-anchor="middle" font-weight="700">Lr (Z = 103)</text>';
      m += '<text x="360" y="155" fill="#e2e8f0" font-size="16" text-anchor="middle">5f¹⁴ 6d¹ 7s²</text>';
      m += '<text x="360" y="195" fill="#94a3b8" font-size="14" text-anchor="middle">Table 4.11 lists only +3. Half-life ~3 minutes; nanogram quantities.</text>';
      m += '<text x="360" y="235" fill="#94a3b8" font-size="13" text-anchor="middle">5f electrons are less buried than 4f → wider OS and steeper contraction (Intext 4.10).</text>';
      svg.innerHTML = m;
      readout(cell("Z","103") + cell("Config","5f¹⁴6d¹7s²") + cell("OS listed","+3"));
      verdict("<b>Table 4.10:</b> Lr closes 5f. Early actinoids (Th–Np) climb Th+4, Pa+5, U+6, Np+7.");
      return;
    }
    m += '<text x="360" y="22" fill="#e2e8f0" font-size="14" text-anchor="middle" font-weight="700">Table 4.11 oxidation states of Ac and the actinoids</text>';
    rows.forEach(function(r,i){
      var x = 18 + i*46;
      r.os.forEach(function(o){
        var y = 260 - o*28;
        var col = o===7 ? "#f87171" : (o>=4 ? "#f59e0b" : "#38bdf8");
        m += '<rect x="'+x+'" y="'+y+'" width="40" height="24" rx="4" fill="'+col+'"/>';
        m += '<text x="'+(x+20)+'" y="'+(y+16)+'" fill="#0f172a" font-size="11" text-anchor="middle" font-weight="700">+'+o+'</text>';
      });
      m += '<text x="'+(x+20)+'" y="290" fill="#94a3b8" font-size="10" text-anchor="middle">'+r.s+'</text>';
    });
    svg.innerHTML = m;
    readout(cell("Th max","+4") + cell("Pa max","+5") + cell("U max","+6") + cell("Np/Pu max","+7","#f87171"));
    verdict("<b>Zoom p.24:</b> +3 throughout; the ceiling climbs then falls. Actinoid contraction &gt; lanthanoid contraction element-to-element because 5f shielding is poorer.");
  }
  return { mount: mount, draw: draw };
})();
