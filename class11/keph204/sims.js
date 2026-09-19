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

window.SIMS.zeroth = (function(){
  var mode = "adiabatic";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>System A</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>System B / C</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="z-ad">Fig 11.1a adiabatic wall</button>' +
      '<button class="preset-btn" id="z-di">Fig 11.1b diathermic wall</button>' +
      '<button class="preset-btn" id="z-0">Fig 11.2 Zeroth Law</button>';
    document.getElementById("z-ad").onclick = function(){ setActivePreset(this); mode="adiabatic"; App.resetTimeline(); App.play(); };
    document.getElementById("z-di").onclick = function(){ setActivePreset(this); mode="diathermic"; App.resetTimeline(); App.play(); };
    document.getElementById("z-0").onclick = function(){ setActivePreset(this); mode="zeroth"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function box(x, y, label, T, fill){
    return '<rect x="'+x+'" y="'+y+'" width="140" height="110" rx="8" fill="'+fill+'" stroke="#94a3b8"/>' +
      '<text x="'+(x+70)+'" y="'+(y+40)+'" fill="#e2e8f0" font-size="16" text-anchor="middle">'+label+'</text>' +
      '<text x="'+(x+70)+'" y="'+(y+70)+'" fill="#f8fafc" font-size="14" text-anchor="middle">T = '+T.toFixed(0)+' K</text>';
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var f = Math.min(t/6, 1);
    if(mode === "adiabatic"){
      m += box(120, 90, "A", 400, "#7f1d1d");
      m += box(460, 90, "B", 300, "#1e3a5f");
      m += '<rect x="270" y="90" width="24" height="110" fill="#78716c"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Adiabatic wall — no heat, independent states</text>';
      readout(cell("T_A","400 K","#f87171") + cell("T_B","300 K","#38bdf8") + cell("Heat flow","none"));
      verdict("<b>Fig. 11.1a:</b> any (P_A, V_A) can sit next to any (P_B, V_B). The wall blocks the Zeroth-Law test.");
    } else if(mode === "diathermic"){
      var TA = 400 - 50*f, TB = 300 + 50*f;
      m += box(120, 90, "A", TA, "#7f1d1d");
      m += box(460, 90, "B", TB, "#1e3a5f");
      m += '<rect x="270" y="90" width="24" height="110" fill="#fbbf24"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Diathermic wall — heat flows until T_A = T_B</text>';
      readout(cell("T_A", TA.toFixed(0)+" K","#f87171") + cell("T_B", TB.toFixed(0)+" K","#38bdf8") + cell("Heat","A → B", "#fbbf24"));
      verdict("<b>Fig. 11.1b:</b> macroscopic variables change spontaneously until thermal equilibrium. That shared value is temperature.");
    } else {
      var Tc = 350;
      m += box(290, 30, "C (thermometer)", Tc, "#14532d");
      m += box(80, 160, "A", 350, "#7f1d1d");
      m += box(500, 160, "B", 350, "#1e3a5f");
      m += '<line x1="150" y1="160" x2="330" y2="140" stroke="#fbbf24" stroke-width="4"/>';
      m += '<line x1="570" y1="160" x2="390" y2="140" stroke="#fbbf24" stroke-width="4"/>';
      m += '<text x="360" y="290" fill="#94a3b8" font-size="13" text-anchor="middle">A ~ C and B ~ C  ⇒  A ~ B</text>';
      readout(cell("T_A","350 K") + cell("T_C","350 K") + cell("T_B","350 K"));
      verdict("<b>Zeroth Law:</b> two systems in thermal equilibrium with a third are in thermal equilibrium with each other. Fowler, 1931.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.heatwork = (function(){
  var mode = "heat";
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Heat Q</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Work W</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Internal energy U</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="h-q">Fig 11.4a heat in</button>' +
      '<button class="preset-btn" id="h-w">Fig 11.4b piston work on system</button>' +
      '<button class="preset-btn" id="h-boil">1 g water → steam</button>';
    document.getElementById("h-q").onclick = function(){ setActivePreset(this); mode="heat"; App.resetTimeline(); App.play(); };
    document.getElementById("h-w").onclick = function(){ setActivePreset(this); mode="work"; App.resetTimeline(); App.play(); };
    document.getElementById("h-boil").onclick = function(){ setActivePreset(this); mode="boil"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var f = Math.min(t/5, 1);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="260" y="80" width="200" height="140" rx="8" fill="#1e293b" stroke="#64748b"/>';
    m += '<text x="360" y="120" fill="#e2e8f0" font-size="14" text-anchor="middle">gas / system</text>';
    if(mode === "heat"){
      m += '<rect x="40" y="100" width="80" height="100" fill="#7f1d1d"/>';
      m += '<text x="80" y="155" fill="#fecaca" font-size="12" text-anchor="middle">hot</text>';
      var q = 80*f;
      m += '<text x="180" y="150" fill="#f59e0b" font-size="16">Q →</text>';
      m += '<text x="360" y="180" fill="#34d399" font-size="14" text-anchor="middle">U + '+q.toFixed(0)+' J</text>';
      readout(cell("mode","heat") + cell("ΔQ",(80*f).toFixed(0)+" J","#f59e0b") + cell("ΔW","0") + cell("ΔU",(80*f).toFixed(0)+" J","#34d399"));
      verdict("<b>Fig. 11.4a:</b> heat is energy transfer driven by a temperature difference. U rises; the gas does not ‘contain heat’.");
    } else if(mode === "work"){
      var y = 70 + 40*f;
      m += '<rect x="330" y="'+y+'" width="60" height="14" fill="#38bdf8"/>';
      m += '<text x="520" y="150" fill="#38bdf8" font-size="14">weight down ⇒ W on system</text>';
      var w = -60*f;
      readout(cell("mode","piston") + cell("ΔQ","0") + cell("ΔW",w.toFixed(0)+" J","#38bdf8") + cell("ΔU",(-w).toFixed(0)+" J","#34d399"));
      verdict("<b>Fig. 11.4b:</b> NCERT sign: W &gt; 0 is work <em>by</em> the system. Compressing means W &lt; 0 and ΔU = −W &gt; 0.");
    } else {
      var Q = 2256*f, W = 169.2*f, U = 2086.8*f;
      m += '<text x="360" y="50" fill="#94a3b8" font-size="14" text-anchor="middle">1 g water, 1 atm, liquid → vapour</text>';
      m += '<text x="360" y="190" fill="#e2e8f0" font-size="14" text-anchor="middle">ΔQ = 2256 J · ΔW = 169.2 J · ΔU = 2086.8 J</text>';
      readout(cell("ΔQ", Q.toFixed(0)+" J","#f59e0b") + cell("ΔW", W.toFixed(1)+" J") + cell("ΔU", U.toFixed(1)+" J","#34d399"));
      verdict("<b>Zoom p.5:</b> most of the latent heat becomes internal energy of the vapour, not piston work. ΔU = ΔQ − ΔW.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.firstlaw = (function(){
  var path = "isotherm";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Q in</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>W by system</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>ΔU</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="fl-iso">Ideal-gas isotherm ΔU = 0</button>' +
      '<button class="preset-btn" id="fl-11.7">Ex 11.7 heater 100 W</button>' +
      '<button class="preset-btn" id="fl-11.5">Ex 11.5 two paths</button>';
    document.getElementById("fl-iso").onclick = function(){ setActivePreset(this); path="isotherm"; App.resetTimeline(); App.play(); };
    document.getElementById("fl-11.7").onclick = function(){ setActivePreset(this); path="heater"; App.resetTimeline(); App.play(); };
    document.getElementById("fl-11.5").onclick = function(){ setActivePreset(this); path="twopath"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var f = Math.min(t/6, 1);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">First Law  ΔQ = ΔU + ΔW</text>';
    function bar(x, label, val, max, color){
      var h = Math.abs(val)/max*140;
      var y = val >= 0 ? 220-h : 220;
      return '<rect x="'+x+'" y="'+y+'" width="70" height="'+h+'" fill="'+color+'"/>' +
        '<text x="'+(x+35)+'" y="250" fill="#94a3b8" font-size="12" text-anchor="middle">'+label+'</text>' +
        '<text x="'+(x+35)+'" y="'+ (y-8) +'" fill="#e2e8f0" font-size="12" text-anchor="middle">'+val.toFixed(1)+'</text>';
    }
    m += '<line x1="80" y1="220" x2="640" y2="220" stroke="#475569"/>';
    if(path === "isotherm"){
      var Q = 40*f, W = 40*f, U = 0;
      m += bar(160,"ΔQ",Q,50,"#f59e0b") + bar(320,"ΔU",U,50,"#34d399") + bar(480,"ΔW",W,50,"#38bdf8");
      readout(cell("ΔQ",Q.toFixed(1)+" J") + cell("ΔU","0") + cell("ΔW",W.toFixed(1)+" J"));
      verdict("<b>Ideal-gas isotherm:</b> U = U(T) only, so ΔU = 0 and every joule of heat becomes work. Q = W = μRT ln(V₂/V₁).");
    } else if(path === "heater"){
      var Qin = 100*f, Wby = 75*f, dU = 25*f;
      m += bar(160,"Q rate",Qin,120,"#f59e0b") + bar(320,"ΔU rate",dU,120,"#34d399") + bar(480,"W rate",Wby,120,"#38bdf8");
      readout(cell("heater","100 W") + cell("work","75 W") + cell("dU/dt","25 W","#34d399"));
      verdict("<b>Ex 11.7:</b> 100 = dU/dt + 75 ⇒ internal energy increases at <b>25 W</b>.");
    } else {
      var U = 22.3, Q2 = 39.18*f, W2 = 16.88*f;
      m += bar(120,"ΔU both",U,50,"#34d399") + bar(280,"Q path 2",Q2,50,"#f59e0b") + bar(440,"W path 2",W2,50,"#38bdf8");
      readout(cell("ΔU","22.3 J") + cell("Q₂","39.18 J") + cell("W₂","16.88 J"));
      verdict("<b>Ex 11.5:</b> adiabatic A→B stores ΔU = 22.3 J. Other path: Q = 9.35 cal = 39.18 J, so W_by = 16.9 J.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.cpcv = (function(){
  var proc = "cv";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Locked piston (C_v)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Free piston (C_p)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c-v">Constant volume C_v</button>' +
      '<button class="preset-btn" id="c-p">Constant pressure C_p = C_v + R</button>';
    document.getElementById("c-v").onclick = function(){ setActivePreset(this); proc="cv"; App.resetTimeline(); App.play(); };
    document.getElementById("c-p").onclick = function(){ setActivePreset(this); proc="cp"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var f = Math.min(t/4, 1);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var h = 80 + 70*f;
    m += '<rect x="280" y="'+(200-h)+'" width="160" height="'+h+'" fill="#1e3a5f" stroke="#38bdf8"/>';
    if(proc === "cv"){
      m += '<rect x="280" y="'+(200-h-8)+'" width="160" height="8" fill="#64748b"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Piston locked — all heat becomes ΔU</text>';
      readout(cell("process","isochoric") + cell("W","0") + cell("C_v","dU/dT"));
      verdict("<b>Eq. 11.9:</b> C_v = (∂U/∂T)_V. For 1 mol, ΔQ = C_v ΔT = ΔU.");
    } else {
      m += '<rect x="280" y="'+(192-h)+'" width="160" height="8" fill="#f59e0b"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Piston free — extra heat pays for PΔV = RΔT per mole</text>';
      readout(cell("process","isobaric") + cell("extra work","R ΔT") + cell("C_p − C_v","R"));
      verdict("<b>Eq. 11.8:</b> C_p − C_v = R. Same ΔU (ideal gas); extra heat is the expansion work.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.quasistatic = (function(){
  var mode = "quasi";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Equilibrium surface</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Off-surface rush</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="q-q">Fig 11.7 quasi-static crawl</button>' +
      '<button class="preset-btn" id="q-f">Ex 11.6 free expansion</button>';
    document.getElementById("q-q").onclick = function(){ setActivePreset(this); mode="quasi"; App.resetTimeline(); App.play(); };
    document.getElementById("q-f").onclick = function(){ setActivePreset(this); mode="free"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var f = Math.min(t/6, 1);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="250" x2="660" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="40" stroke="#475569"/>';
    m += '<text x="670" y="254" fill="#94a3b8" font-size="12">V</text><text x="70" y="36" fill="#94a3b8" font-size="12">P</text>';
    if(mode === "quasi"){
      var V = 2 + 3*f, P = 8/V;
      var pts = "";
      for(var i=0;i<=20;i++){ var v=2+3*i/20; pts += (i===0?"M":"L")+" "+(80+v*80)+" "+(250- (8/v)*22); }
      m += '<path d="'+pts+'" fill="none" stroke="#34d399" stroke-width="3"/>';
      m += '<circle cx="'+(80+V*80)+'" cy="'+(250-P*22)+'" r="6" fill="#f8fafc"/>';
      readout(cell("process","quasi-static isotherm") + cell("P", P.toFixed(2)+" (arb)") + cell("on surface","YES","#34d399"));
      verdict("<b>Fig. 11.7:</b> P_ext and T_res differ only infinitesimally. Every dot is an equilibrium state.");
    } else {
      m += '<circle cx="240" cy="80" r="7" fill="#34d399"/>';
      m += '<circle cx="520" cy="160" r="7" fill="#34d399"/>';
      var x = 240 + 280*f, y = 80 + 80*Math.sin(f*12)*Math.exp(-f)*0.4 + 80*f;
      m += '<circle cx="'+x+'" cy="'+y+'" r="5" fill="#f87171"/>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Ex 11.6: end-points on the surface, history is not</text>';
      readout(cell("P_final","0.5 atm") + cell("ΔU","0") + cell("ΔT","0") + cell("intermediate","off surface","#f87171"));
      verdict("<b>Ex 11.6:</b> Q = W = 0, so ΔU = ΔT = 0 and P halves. Dashed join is not a process curve.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.pvdiag = (function(){
  var kind = "iso";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Isotherm PV = const</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Adiabat PV^γ = const</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-iso">Isothermal expansion</button>' +
      '<button class="preset-btn" id="p-ad">Adiabatic expansion</button>' +
      '<button class="preset-btn" id="p-11.8">Ex 11.8 D–E–F area</button>';
    document.getElementById("p-iso").onclick = function(){ setActivePreset(this); kind="iso"; App.resetTimeline(); App.play(); };
    document.getElementById("p-ad").onclick = function(){ setActivePreset(this); kind="ad"; App.resetTimeline(); App.play(); };
    document.getElementById("p-11.8").onclick = function(){ setActivePreset(this); kind="area"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function XV(V){ return 80 + V*90; }
  function YP(P){ return 250 - P*0.32; }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var f = Math.min(t/6, 1);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="250" x2="680" y2="250" stroke="#475569"/><line x1="80" y1="250" x2="80" y2="30" stroke="#475569"/>';
    m += '<text x="690" y="254" fill="#94a3b8" font-size="12">V</text><text x="60" y="36" fill="#94a3b8" font-size="12">P</text>';
    if(kind === "area"){
      // Fig 11.11: D(2,600)-E(5,300)-F(2,300)
      var vd = 2, ve = 2 + 3*Math.min(f/0.6,1);
      var pe = 600 - 100*(ve-2);
      if(f < 0.6){
        m += '<path d="M '+XV(2)+' '+YP(600)+' L '+XV(ve)+' '+YP(pe)+' L '+XV(ve)+' '+YP(0)+' L '+XV(2)+' '+YP(0)+' Z" fill="#34d39933"/>';
        m += '<line x1="'+XV(2)+'" y1="'+YP(600)+'" x2="'+XV(ve)+'" y2="'+YP(pe)+'" stroke="#f8fafc" stroke-width="3"/>';
        m += '<circle cx="'+XV(ve)+'" cy="'+YP(pe)+'" r="5" fill="#f59e0b"/>';
      } else {
        var vf = 5 - 3*((f-0.6)/0.4);
        m += '<path d="M '+XV(2)+' '+YP(600)+' L '+XV(5)+' '+YP(300)+' L '+XV(5)+' '+YP(0)+' L '+XV(2)+' '+YP(0)+' Z" fill="#34d39933"/>';
        m += '<path d="M '+XV(5)+' '+YP(300)+' L '+XV(vf)+' '+YP(300)+' L '+XV(vf)+' '+YP(0)+' L '+XV(5)+' '+YP(0)+' Z" fill="#f8717133"/>';
        m += '<line x1="'+XV(2)+'" y1="'+YP(600)+'" x2="'+XV(5)+'" y2="'+YP(300)+'" stroke="#f8fafc" stroke-width="3"/>';
        m += '<line x1="'+XV(5)+'" y1="'+YP(300)+'" x2="'+XV(vf)+'" y2="'+YP(300)+'" stroke="#38bdf8" stroke-width="3"/>';
        m += '<circle cx="'+XV(vf)+'" cy="'+YP(300)+'" r="5" fill="#f59e0b"/>';
      }
      m += '<text x="'+XV(2)+'" y="'+(YP(600)-8)+'" fill="#e2e8f0" font-size="12">D</text>';
      m += '<text x="'+XV(5)+'" y="'+(YP(300)-8)+'" fill="#e2e8f0" font-size="12">E</text>';
      m += '<text x="'+XV(2)+'" y="'+(YP(300)-8)+'" fill="#e2e8f0" font-size="12">F</text>';
      readout(cell("W_DE","1350 J") + cell("W_EF","−900 J") + cell("W_net","450 J","#34d399"));
      verdict("<b>Ex 11.8 / Fig. 11.11:</b> trapezium ½(600+300)×3 = 1350 J minus isobaric 300×3 = 900 J gives <b>450 J</b>.");
    } else {
      var V1 = 2, V2 = 5, V = V1 + (V2-V1)*f, g = 1.4;
      var Piso = 400/V, Pad = 400 * Math.pow(2/V, g);
      var dI="", dA="";
      for(var i=0;i<=40;i++){
        var v = 1.8 + i*0.1;
        dI += (i?"L":"M")+" "+XV(v)+" "+YP(400/v);
        dA += (i?"L":"M")+" "+XV(v)+" "+YP(400*Math.pow(2/v,g));
      }
      m += '<path d="'+dI+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<path d="'+dA+'" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      var P = kind==="iso" ? Piso : Pad;
      m += '<circle cx="'+XV(V)+'" cy="'+YP(P)+'" r="6" fill="#f8fafc"/>';
      readout(cell("V", V.toFixed(2)) + cell("P_iso", Piso.toFixed(1)) + cell("P_ad", Pad.toFixed(1),"#f59e0b"));
      verdict("<b>Fig. 11.8:</b> adiabat is steeper. Same compression raises P more when Q cannot enter. γ = C_p/C_v.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.secondlaw = (function(){
  var mode = "kelvin";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Forbidden sole result</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Allowed with a second reservoir / work</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="s-k">Kelvin–Planck (η ≠ 1)</button>' +
      '<button class="preset-btn" id="s-c">Clausius (α ≠ ∞)</button>';
    document.getElementById("s-k").onclick = function(){ setActivePreset(this); mode="kelvin"; App.resetTimeline(); };
    document.getElementById("s-c").onclick = function(){ setActivePreset(this); mode="clausius"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode === "kelvin"){
      m += '<rect x="80" y="40" width="220" height="70" rx="8" fill="#7f1d1d"/><text x="190" y="80" fill="#fecaca" text-anchor="middle">hot reservoir T₁</text>';
      m += '<rect x="130" y="150" width="120" height="70" rx="8" fill="#1e293b" stroke="#f87171"/><text x="190" y="190" fill="#f87171" text-anchor="middle">engine η=1?</text>';
      m += '<text x="190" y="250" fill="#f8fafc" text-anchor="middle">W = Q₁  (no dump)</text>';
      m += '<text x="500" y="150" fill="#f87171" font-size="16" text-anchor="middle">FORBIDDEN</text>';
      readout(cell("statement","Kelvin–Planck") + cell("η = 1","impossible","#f87171"));
      verdict("<b>Kelvin–Planck:</b> no process whose sole result is heat from one reservoir converted entirely into work. First Law would allow it; Second Law does not.");
    } else {
      m += '<rect x="80" y="40" width="200" height="60" rx="8" fill="#7f1d1d"/><text x="180" y="75" fill="#fecaca" text-anchor="middle">hot</text>';
      m += '<rect x="80" y="200" width="200" height="60" rx="8" fill="#1e3a5f"/><text x="180" y="235" fill="#bfdbfe" text-anchor="middle">cold</text>';
      m += '<text x="180" y="160" fill="#f87171" text-anchor="middle">Q up, W = 0  FORBIDDEN</text>';
      m += '<rect x="420" y="40" width="200" height="60" rx="8" fill="#7f1d1d"/><text x="520" y="75" fill="#fecaca" text-anchor="middle">hot</text>';
      m += '<rect x="420" y="200" width="200" height="60" rx="8" fill="#1e3a5f"/><text x="520" y="235" fill="#bfdbfe" text-anchor="middle">cold</text>';
      m += '<text x="520" y="160" fill="#34d399" text-anchor="middle">Q up, W in  ALLOWED</text>';
      readout(cell("statement","Clausius") + cell("α = ∞","impossible","#f87171"));
      verdict("<b>Clausius:</b> heat does not flow cold → hot as a sole result. A Chennai AC does it only by paying compressor work.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.carnot = (function(){
  var T1 = 500, T2 = 300;
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Isotherms</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Adiabats</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c500">Boiler 500 K / river 300 K</button>' +
      '<button class="preset-btn" id="c800">Hotter boiler 800 K</button>' +
      '<button class="preset-btn" id="c200">Colder sink 200 K</button>';
    document.getElementById("c500").onclick = function(){ setActivePreset(this); T1=500; T2=300; App.resetTimeline(); App.play(); };
    document.getElementById("c800").onclick = function(){ setActivePreset(this); T1=800; T2=300; App.resetTimeline(); App.play(); };
    document.getElementById("c200").onclick = function(){ setActivePreset(this); T1=500; T2=200; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function XV(V){ return 70 + Math.log(V)*90; }
  function YP(P){ return 260 - Math.log(P)*40; }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var g = 1.4;
    // Construct a Carnot rectangle in (ln V, ln P)
    var V1 = 2, V2 = 4;
    var P1 = 12, P2 = P1*V1/V2;
    var V3 = V2 * Math.pow(T1/T2, 1/(g-1));
    var P3 = P2 * Math.pow(V2/V3, g);
    var V4 = V1 * V3 / V2;
    var P4 = P1 * Math.pow(V1/V4, g);
    function Pi(V){ return P1*V1/V; }
    function Pa(V){ return P2 * Math.pow(V2/V, g); }
    function Pib(V){ return P3*V3/V; }
    function Pac(V){ return P4 * Math.pow(V4/V, g); }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="50" y1="270" x2="700" y2="270" stroke="#475569"/><line x1="50" y1="270" x2="50" y2="20" stroke="#475569"/>';
    function pathIso(Vstart, Vend, Pfun, color){
      var d="", n=24;
      for(var i=0;i<=n;i++){
        var V = Vstart + (Vend-Vstart)*i/n;
        d += (i?"L":"M")+" "+XV(V)+" "+YP(Pfun(V));
      }
      return '<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="3"/>';
    }
    m += pathIso(V1,V2,Pi,"#38bdf8");
    m += pathIso(V2,V3,Pa,"#f59e0b");
    m += pathIso(V3,V4,Pib,"#38bdf8");
    m += pathIso(V4,V1,Pac,"#f59e0b");
    var phase = (t/8)*4;
    var V, P, label;
    if(phase < 1){ V = V1+(V2-V1)*phase; P = Pi(V); label = "1→2 isothermal expansion, Q₁ in"; }
    else if(phase < 2){ var u=phase-1; V = V2+(V3-V2)*u; P = Pa(V); label = "2→3 adiabatic expansion, Q = 0"; }
    else if(phase < 3){ var u=phase-2; V = V3+(V4-V3)*u; P = Pib(V); label = "3→4 isothermal compression, Q₂ out"; }
    else { var u=phase-3; V = V4+(V1-V4)*u; P = Pac(V); label = "4→1 adiabatic compression, Q = 0"; }
    m += '<circle cx="'+XV(V)+'" cy="'+YP(P)+'" r="6" fill="#f8fafc"/>';
    m += '<text x="360" y="36" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 11.9 · '+label+'</text>';
    var eta = 1 - T2/T1;
    svg.innerHTML = m;
    readout(cell("T₁", T1+" K","#f87171") + cell("T₂", T2+" K","#38bdf8") + cell("η = 1 − T₂/T₁", (eta*100).toFixed(1)+"%","#34d399"));
    verdict("<b>Carnot:</b> η = 1 − T₂/T₁ = <b>"+(eta*100).toFixed(1)+"%</b>. No engine between these two temperatures can beat this ceiling. Independent of working substance.");
  }
  return { mount: mount, draw: draw };
})();

// Browser QA identifies each scenario by data-preset. Keep these identifiers
// local to the chapter so every visible preset has a stable fixture key.
Object.keys(window.SIMS).forEach(function(key){
  var sim = window.SIMS[key];
  if(!sim || sim.mount._qaWrapped) return;
  var originalMount = sim.mount;
  sim.mount = function(lesson){
    var result = originalMount(lesson);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn){
      if(!btn.dataset.preset) btn.dataset.preset = btn.id;
    });
    return result;
  };
  sim.mount._qaWrapped = true;
});
// The shared browser fixture names the revealed prediction states explicitly.
// Add those semantic aliases after the existing chapter runtime evaluates a choice.
document.addEventListener("click", function(event){
  if(!event.target.closest("#btn-check-prediction")) return;
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  var chosen = document.querySelector('input[name="predict_ans"]:checked');
  if(!lesson || !chosen) return;
  document.querySelectorAll("#predict-options .predict-option").forEach(function(option, index){
    option.classList.toggle("is-answer", index === lesson.prediction.answer);
    option.classList.toggle("is-wrong", index === Number(chosen.value) && index !== lesson.prediction.answer);
  });
});

// Keep this chapter's presentation aligned with its data while the shared
// Class 11 runtime remains backward-compatible with older array connect cards.
function normalizeConceptPresentation(){
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  if(!lesson) return;
  var watch = document.getElementById("what-to-watch");
  var watchText = "What to watch: " + lesson.watch;
  if(watch && lesson.watch && watch.textContent !== watchText) watch.textContent = watchText;
  document.querySelectorAll(".connect-grid").forEach(function(grid){
    var cards = Array.from(grid.querySelectorAll(":scope > .connect-card"));
    var explicitWow = cards.find(function(card){
      var heading = card.querySelector("h3");
      return heading && /^Wow/i.test(heading.textContent.trim());
    });
    if(!explicitWow) return;
    cards.forEach(function(card){
      if(card === explicitWow) return;
      card.classList.remove("wow");
      card.removeAttribute("data-wow");
      card.removeAttribute("data-source");
      var badge = card.querySelector(":scope > .wow-badge");
      if(badge) badge.remove();
    });
  });
}
var conceptView = document.getElementById("concept-view");
if(conceptView){
  new MutationObserver(normalizeConceptPresentation).observe(conceptView, {childList: true, subtree: true});
  normalizeConceptPresentation();
}
