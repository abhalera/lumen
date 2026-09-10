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

window.SIMS.vecdef = (function(){
  var path = "arc";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Path</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Displacement PQ</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="v-arc">Curved path (Fig. 3.1b)</button>' +
      '<button class="preset-btn" id="v-dia">Straight diameter</button>';
    document.getElementById("v-arc").onclick = function(){ setActivePreset(this); path="arc"; App.resetTimeline(); App.play(); };
    document.getElementById("v-dia").onclick = function(){ setActivePreset(this); path="dia"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var f = Math.min(t/4,1);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<circle cx="200" cy="200" r="5" fill="#f8fafc"/><text x="190" y="220" fill="#94a3b8" font-size="12">P</text>';
    m += '<circle cx="520" cy="80" r="5" fill="#f8fafc"/><text x="530" y="75" fill="#94a3b8" font-size="12">Q</text>';
    m += '<line x1="200" y1="200" x2="520" y2="80" stroke="#f59e0b" stroke-width="3"/>';
    var x,y;
    if(path==="arc"){
      x = 200 + 320*f; y = 200 - 120*f - 80*Math.sin(Math.PI*f);
      var d="";
      for(var u=0;u<=f+0.001;u+=0.02){
        var xx=200+320*u, yy=200-120*u-80*Math.sin(Math.PI*u);
        d += (u===0?"M":"L")+" "+xx+" "+yy;
      }
      m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    } else {
      x = 200 + 320*f; y = 200 - 120*f;
      m += '<line x1="200" y1="200" x2="'+x+'" y2="'+y+'" stroke="#38bdf8" stroke-width="2"/>';
    }
    m += '<circle cx="'+x+'" cy="'+y+'" r="7" fill="#38bdf8"/>';
    svg.innerHTML = m;
    var disp=Math.hypot(320,120), pl = path==="dia"? disp : disp + 80;
    readout(cell("|PQ|", disp.toFixed(0)+" (arb)") + cell("path", path==="dia"?"= |PQ|":"> |PQ|","#38bdf8"));
    verdict("<b>Fig. 3.1:</b> displacement is the orange chord, independent of the blue path. |Δr| ≤ path length, equal only on a straight run.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.vecadd = (function(){
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Rain 35 m/s down</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Wind 12 m/s west</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Resultant 37 m/s</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="e31">Example 3.1 bus stop</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var f = Math.min(t/3,1);
    var ox=400, oy=50;
    var rain=160*f, wind=55*f;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="'+ox+'" y1="'+oy+'" x2="'+ox+'" y2="'+(oy+rain)+'" stroke="#38bdf8" stroke-width="3" marker-end="url(#a)"/>';
    m += '<line x1="'+ox+'" y1="'+(oy+rain)+'" x2="'+(ox-wind)+'" y2="'+(oy+rain)+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<line x1="'+ox+'" y1="'+oy+'" x2="'+(ox-wind)+'" y2="'+(oy+rain)+'" stroke="#34d399" stroke-width="3"/>';
    m += '<text x="80" y="40" fill="#94a3b8" font-size="13">Hold umbrella 19° east of vertical</text>';
    svg.innerHTML = m;
    var R=Math.hypot(35,12), th=Math.atan2(12,35)*180/Math.PI;
    readout(cell("|R|", R.toFixed(1)+" m/s","#34d399") + cell("θ from vertical", th.toFixed(1)+"°") + cell("book","37 m/s, 19°"));
    verdict("<b>Example 3.1 (zoom p.5):</b> √(35²+12²)=37 m s⁻¹. tan θ=12/35=0.343 ⇒ θ=19°. Tilt into the wind (east).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.resolve = (function(){
  var deg = 53;
  function mount(){
    App.state.maxT = 2;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 2;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>A_x î</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>A_y ĵ</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="r53">3 î + 4 ĵ (53°)</button>' +
      '<button class="preset-btn" id="r30">10 N at 30°</button>';
    document.getElementById("r53").onclick = function(){ setActivePreset(this); deg=53; App.resetTimeline(); };
    document.getElementById("r30").onclick = function(){ setActivePreset(this); deg=30; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var th=deg*Math.PI/180, A = deg===53?5:10;
    var Ax=A*Math.cos(th), Ay=A*Math.sin(th);
    var ox=120, oy=240, sc=30;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="80" y1="240" x2="680" y2="240" stroke="#475569"/><line x1="120" y1="280" x2="120" y2="40" stroke="#475569"/>';
    m += '<line x1="'+ox+'" y1="'+oy+'" x2="'+(ox+Ax*sc)+'" y2="'+oy+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<line x1="'+(ox+Ax*sc)+'" y1="'+oy+'" x2="'+(ox+Ax*sc)+'" y2="'+(oy-Ay*sc)+'" stroke="#34d399" stroke-width="3"/>';
    m += '<line x1="'+ox+'" y1="'+oy+'" x2="'+(ox+Ax*sc)+'" y2="'+(oy-Ay*sc)+'" stroke="#38bdf8" stroke-width="3"/>';
    svg.innerHTML = m;
    readout(cell("A", A.toFixed(1)) + cell("A_x", Ax.toFixed(2),"#f59e0b") + cell("A_y", Ay.toFixed(2),"#34d399") + cell("θ", deg+"°"));
    verdict("<b>Eqs. (3.13)–(3.15):</b> A_x=A cos θ, A_y=A sin θ, A=√(A_x²+A_y²). The 3–4–5 triangle is Example 3.4’s v at t=1 s.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.cosine = (function(){
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Boat 25 km/h N</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Current 10 km/h, 60° E of S</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>R ≈ 22 km/h</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="c1">Example 3.3 (θ=120°)</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var R=Math.sqrt(25*25+10*10+2*25*10*(-0.5));
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var ox=360, oy=160;
    m += '<line x1="'+ox+'" y1="'+oy+'" x2="'+ox+'" y2="'+(oy-100)+'" stroke="#38bdf8" stroke-width="3"/>';
    var cx=ox+50, cy=oy+87;
    m += '<line x1="'+ox+'" y1="'+oy+'" x2="'+cx+'" y2="'+cy+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<line x1="'+ox+'" y1="'+oy+'" x2="'+(ox+30)+'" y2="'+(oy-70)+'" stroke="#34d399" stroke-width="3"/>';
    m += '<text x="80" y="40" fill="#94a3b8" font-size="13">Law of cosines, included angle 120°</text>';
    svg.innerHTML = m;
    readout(cell("|R|", R.toFixed(1)+" km/h","#34d399") + cell("book","≅ 22 km/h") + cell("φ","≅ 23.4°"));
    verdict("<b>Example 3.3 (zoom p.8):</b> √(625+100−250)=√475≈21.8 km/h. sin φ = 10 sin 120° / 21.8 ≈ 0.397 ⇒ φ≅23.4°.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.planeva = (function(){
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>r(t)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>v(t)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p34">Example 3.4 r=3t î + 2t² ĵ + 5 k̂</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var x=3*t, y=2*t*t;
    var vx=3, vy=4*t, v=Math.hypot(vx,vy);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="60" y1="260" x2="680" y2="260" stroke="#475569"/><line x1="60" y1="260" x2="60" y2="30" stroke="#475569"/>';
    var d="";
    for(var u=0;u<=3.02;u+=0.1){
      var X=60+ (3*u)*40, Y=260-(2*u*u)*12;
      d += (u===0?"M":"L")+" "+X+" "+Y;
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    var px=60+x*40, py=260-y*12;
    m += '<circle cx="'+px+'" cy="'+py+'" r="6" fill="#f8fafc"/>';
    m += '<line x1="'+px+'" y1="'+py+'" x2="'+(px+vx*15)+'" y2="'+(py-vy*15)+'" stroke="#f59e0b" stroke-width="3"/>';
    svg.innerHTML = m;
    readout(cell("t", t.toFixed(2)+" s") + cell("|v|", v.toFixed(2)+" m/s") + cell("a","4.0 ĵ m/s²") + cell("at 1 s","5.0 m/s at 53°"));
    verdict("<b>Example 3.4 (zoom p.11):</b> v=3.0 î + 4.0 t ĵ, a=4.0 ĵ. At t=1 s, |v|=5.0 m s⁻¹, θ=tan⁻¹(4/3)≅53°.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.constacc = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Trajectory</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="e35">Example 3.5 to x=84 m</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var x=5*t+1.5*t*t, y=t*t;
    var vx=5+3*t, vy=2*t, sp=Math.hypot(vx,vy);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="260" x2="700" y2="260" stroke="#475569"/>';
    var d="";
    for(var u=0;u<=6.02;u+=0.1){
      d += (u===0?"M":"L")+" "+(40+(5*u+1.5*u*u)*7)+" "+(260-u*u*5);
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="'+(40+x*7)+'" cy="'+(260-y*5)+'" r="6" fill="#f8fafc"/>';
    m += '<line x1="'+(40+84*7)+'" y1="40" x2="'+(40+84*7)+'" y2="260" stroke="#f59e0b" stroke-dasharray="4 4"/>';
    svg.innerHTML = m;
    readout(cell("t", t.toFixed(2)+" s") + cell("x", x.toFixed(1)+" m") + cell("y", y.toFixed(1)+" m") + cell("|v|", sp.toFixed(1)+" m/s"));
    verdict("<b>Example 3.5 (zoom p.12):</b> x=84 m at t=6 s, y=36 m, v=23 î + 12 ĵ, |v|≅26 m s⁻¹.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.projectile = (function(){
  var mode = "cricket";
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Projectile</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>v_x constant</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p38">Ex 3.8 cricket 28 m/s at 30°</button>' +
      '<button class="preset-btn" id="p37">Ex 3.7 cliff 490 m, 15 m/s</button>';
    document.getElementById("p38").onclick = function(){ setActivePreset(this); mode="cricket"; App.state.maxT=3; document.getElementById("time-scrubber").max=3; App.resetTimeline(); App.play(); };
    document.getElementById("p37").onclick = function(){ setActivePreset(this); mode="cliff"; App.state.maxT=10; document.getElementById("time-scrubber").max=10; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var g=9.8;
    if(mode==="cricket"){
      var u0=28, th=Math.PI/6;
      var Tf=2*u0*Math.sin(th)/g, hm=(u0*Math.sin(th))*(u0*Math.sin(th))/(2*g), R=u0*u0*Math.sin(2*th)/g;
      var T=Math.min(t,Tf);
      var x=(u0*Math.cos(th))*T, y=(u0*Math.sin(th))*T-0.5*g*T*T;
      m += '<line x1="40" y1="260" x2="700" y2="260" stroke="#334155" stroke-width="4"/>';
      var d="";
      for(var u2=0;u2<=Tf;u2+=0.05){
        var xx=(u0*Math.cos(th))*u2, yy=(u0*Math.sin(th))*u2-0.5*g*u2*u2;
        d += (u2===0?"M":"L")+" "+(40+xx*9)+" "+(260-yy*9);
      }
      m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="'+(40+x*9)+'" cy="'+(260-y*9)+'" r="7" fill="#f8fafc"/>';
      svg.innerHTML = m;
      readout(cell("t", T.toFixed(2)+" s") + cell("h_m", hm.toFixed(1)+" m") + cell("T_f", Tf.toFixed(1)+" s") + cell("R", R.toFixed(0)+" m"));
      verdict("<b>Example 3.8 (zoom p.14):</b> h_m=10.0 m, T_f=2.9 s, R=69 m. Path is a parabola, Eq. (3.39).");
    } else {
      var T=Math.min(t,10);
      var x=15*T, y=490-0.5*g*T*T;
      if(y<0) y=0;
      m += '<rect x="40" y="40" width="18" height="220" fill="#1e293b"/>';
      m += '<line x1="40" y1="260" x2="700" y2="260" stroke="#f59e0b" stroke-width="3"/>';
      m += '<circle cx="'+(80+x*0.4)+'" cy="'+(260-y*0.4)+'" r="7" fill="#38bdf8"/>';
      svg.innerHTML = m;
      var vy=-g*T, sp=Math.hypot(15, g*10);
      readout(cell("t", T.toFixed(1)+" s") + cell("y drop", (490-y).toFixed(0)+" m") + cell("hit","t=10 s") + cell("|v|","99 m/s"));
      verdict("<b>Example 3.7:</b> −490 = −½(9.8)t² ⇒ t=10 s. √(15²+98²)=<b>99 m s⁻¹</b>.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.ucm = (function(){
  function mount(){
    App.state.maxT = 14.3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 14.3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Insect</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>a toward centre</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="u39">Example 3.9: 7 rev / 100 s</button>';
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var Rpx=90, cx=360, cy=150;
    var w=2*Math.PI*7/100;
    var ang=-Math.PI/2 + w*t;
    var x=cx+Rpx*Math.cos(ang), y=cy+Rpx*Math.sin(ang);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<circle cx="'+cx+'" cy="'+cy+'" r="'+Rpx+'" fill="none" stroke="#334155" stroke-width="2"/>';
    m += '<circle cx="'+x+'" cy="'+y+'" r="8" fill="#38bdf8"/>';
    m += '<line x1="'+x+'" y1="'+y+'" x2="'+cx+'" y2="'+cy+'" stroke="#f59e0b" stroke-width="2"/>';
    svg.innerHTML = m;
    var v=w*12, a=w*w*12;
    readout(cell("ω", w.toFixed(2)+" rad/s") + cell("v", v.toFixed(2)+" cm/s") + cell("|a|", a.toFixed(2)+" cm/s²"));
    verdict("<b>Example 3.9 (zoom p.16):</b> ω=0.44 rad/s, v=5.3 cm s⁻¹, |a|=2.3 cm s⁻² toward the centre — not a constant vector.");
  }
  return { mount: mount, draw: draw };
})();
