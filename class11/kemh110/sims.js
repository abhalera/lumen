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
function rng(id){ var n = document.getElementById(id); return n ? Number(n.value) : 0; }
function setTxt(id, t){ var n = document.getElementById(id); if(n) n.textContent = t; }

function axes(ox, oy, scale){
  var m = '<rect width="720" height="300" fill="#09131d"/>';
  m += '<line x1="20" y1="'+oy+'" x2="700" y2="'+oy+'" stroke="#334155" stroke-width="1.5"/>';
  m += '<line x1="'+ox+'" y1="20" x2="'+ox+'" y2="280" stroke="#334155" stroke-width="1.5"/>';
  m += '<polygon points="700,'+oy+' 688,'+(oy-5)+' 688,'+(oy+5)+'" fill="#64748b"/>';
  m += '<polygon points="'+ox+',20 '+(ox-5)+',32 '+(ox+5)+',32" fill="#64748b"/>';
  m += '<text x="688" y="'+(oy+16)+'" fill="#94a3b8" font-size="11">x</text>';
  m += '<text x="'+(ox+8)+'" y="28" fill="#94a3b8" font-size="11">y</text>';
  return m;
}
function X(ox,s,x){ return ox + x*s; }
function Y(oy,s,y){ return oy - y*s; }

window.SIMS.conecut = (function(){
  var kind = "circle";
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Double-napped cone</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Cutting plane</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="k-c">β=90° circle</button>' +
      '<button class="preset-btn" id="k-e">α&lt;β&lt;90° ellipse</button>' +
      '<button class="preset-btn" id="k-p">β=α parabola</button>' +
      '<button class="preset-btn" id="k-h">β&lt;α hyperbola</button>' +
      '<button class="preset-btn" id="k-d">vertex: degenerate</button>';
    [["k-c","circle"],["k-e","ellipse"],["k-p","parabola"],["k-h","hyperbola"],["k-d","degen"]].forEach(function(p){
      document.getElementById(p[0]).onclick = function(){ setActivePreset(this); kind=p[1]; draw(0); };
    });
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="360" y1="30" x2="360" y2="270" stroke="#475569" stroke-dasharray="4 4"/>';
    m += '<text x="372" y="40" fill="#94a3b8" font-size="11">axis ℓ</text>';
    m += '<polygon points="360,70 250,270 470,270" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<polygon points="360,70 250,-10 470,-10" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.45"/>';
    m += '<circle cx="360" cy="70" r="5" fill="#f8fafc"/>';
    m += '<text x="372" y="68" fill="#e2e8f0" font-size="12">V</text>';
    var note;
    if(kind==="circle"){
      m += '<ellipse cx="360" cy="180" rx="70" ry="16" fill="none" stroke="#f59e0b" stroke-width="3"/>';
      note = "β = 90°: plane ⟂ axis, section is a circle (Fig 10.4).";
    } else if(kind==="ellipse"){
      m += '<ellipse cx="360" cy="175" rx="78" ry="28" fill="none" stroke="#f59e0b" stroke-width="3" transform="rotate(-18 360 175)"/>';
      note = "α < β < 90°: plane cuts one nappe in an ellipse (Fig 10.5).";
    } else if(kind==="parabola"){
      m += '<path d="M 300 250 Q 360 140 455 255" fill="none" stroke="#f59e0b" stroke-width="3"/>';
      note = "β = α: plane parallel to a generator — parabola (Fig 10.6).";
    } else if(kind==="hyperbola"){
      m += '<path d="M 300 230 Q 340 175 300 120" fill="none" stroke="#f59e0b" stroke-width="3"/>';
      m += '<path d="M 420 40 Q 380 10 430 -5" fill="none" stroke="#f59e0b" stroke-width="3"/>';
      note = "0 ≤ β < α: plane cuts both nappes — hyperbola (Fig 10.7).";
    } else {
      m += '<circle cx="360" cy="70" r="8" fill="none" stroke="#f87171" stroke-width="2"/>';
      m += '<line x1="300" y1="70" x2="470" y2="200" stroke="#f87171" stroke-width="2"/>';
      note = "Plane through V: a point, a line (degenerate parabola) or two lines (degenerate hyperbola).";
    }
    readout(cell("Apollonius section", kind, "#f59e0b") + cell("generator angle", "α fixed"));
    verdict("<b>§10.2:</b> "+note);
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.circlehk = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Circle</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Centre (h,k)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="c0">x²+y²=r² origin</button>' +
      '<button class="preset-btn active" id="c1">Ex 2: (−3,2), r=4</button>' +
      '<button class="preset-btn" id="c2">Ex 3: complete the square</button>';
    document.getElementById("c0").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-h").value=0; document.getElementById("ctrl-k").value=0; document.getElementById("ctrl-r").value=4; draw(0); };
    document.getElementById("c1").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-h").value=-3; document.getElementById("ctrl-k").value=2; document.getElementById("ctrl-r").value=4; draw(0); };
    document.getElementById("c2").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-h").value=-4; document.getElementById("ctrl-k").value=-5; document.getElementById("ctrl-r").value=7; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>h</span><span class="val" id="h-val">−3</span></div><input type="range" id="ctrl-h" min="-6" max="6" step="0.5" value="-3"></div>' +
      '<div class="control-item"><div class="control-label"><span>k</span><span class="val" id="k-val">2</span></div><input type="range" id="ctrl-k" min="-6" max="6" step="0.5" value="2"></div>' +
      '<div class="control-item"><div class="control-label"><span>r</span><span class="val" id="r-val">4</span></div><input type="range" id="ctrl-r" min="1" max="8" step="0.5" value="4"></div>';
    ["ctrl-h","ctrl-k","ctrl-r"].forEach(function(id){ document.getElementById(id).oninput = function(){ draw(0); }; });
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var h=rng("ctrl-h"), k=rng("ctrl-k"), r=rng("ctrl-r");
    setTxt("h-val", h.toFixed(1)); setTxt("k-val", k.toFixed(1)); setTxt("r-val", r.toFixed(1));
    var ox=360, oy=150, sc=18;
    var m = axes(ox, oy, sc);
    m += '<circle cx="'+X(ox,sc,h)+'" cy="'+Y(oy,sc,k)+'" r="'+(r*sc)+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    m += '<circle cx="'+X(ox,sc,h)+'" cy="'+Y(oy,sc,k)+'" r="4" fill="#f59e0b"/>';
    m += '<line x1="'+X(ox,sc,h)+'" y1="'+Y(oy,sc,k)+'" x2="'+X(ox,sc,h+r)+'" y2="'+Y(oy,sc,k)+'" stroke="#34d399" stroke-width="2"/>';
    readout(cell("equation","(x − ("+h+"))² + (y − ("+k+"))² = "+(r*r).toFixed(1),"#38bdf8") + cell("r", r.toFixed(1),"#34d399"));
    verdict("<b>Definition 1 / zoom p.5:</b> |CP|=r becomes (x−h)²+(y−k)²=r². Completing the square recovers (h,k) and r (Example 3: centre (−4,−5), r=7).");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.parabola = (function(){
  var form = "y2p";
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Parabola</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Focus F</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Directrix</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Latus rectum</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="f-yp">y²=4ax (right)</button>' +
      '<button class="preset-btn" id="f-yn">y²=−4ax (left)</button>' +
      '<button class="preset-btn" id="f-xp">x²=4ay (up)</button>' +
      '<button class="preset-btn" id="f-xn">x²=−4ay (down)</button>';
    document.getElementById("f-yp").onclick = function(){ setActivePreset(this); form="y2p"; draw(0); };
    document.getElementById("f-yn").onclick = function(){ setActivePreset(this); form="y2n"; draw(0); };
    document.getElementById("f-xp").onclick = function(){ setActivePreset(this); form="x2p"; draw(0); };
    document.getElementById("f-xn").onclick = function(){ setActivePreset(this); form="x2n"; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>a</span><span class="val" id="a-val">2</span></div><input type="range" id="ctrl-a" min="0.5" max="4" step="0.1" value="2"></div>';
    document.getElementById("ctrl-a").oninput = function(){ draw(0); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var a=rng("ctrl-a"); setTxt("a-val", a.toFixed(1));
    var ox=360, oy=150, sc=22;
    var m = axes(ox, oy, sc);
    var d="", t, x, y;
    for(t=-6; t<=6.05; t+=0.08){
      if(form==="y2p"){ y=t; x=t*t/(4*a); }
      else if(form==="y2n"){ y=t; x=-t*t/(4*a); }
      else if(form==="x2p"){ x=t; y=t*t/(4*a); }
      else { x=t; y=-t*t/(4*a); }
      d += (t<-5.9?"M":"L")+" "+X(ox,sc,x)+" "+Y(oy,sc,y);
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    var Fx=0, Fy=0, dir;
    if(form==="y2p"){ Fx=a; dir='<line x1="'+X(ox,sc,-a)+'" y1="20" x2="'+X(ox,sc,-a)+'" y2="280" stroke="#34d399" stroke-width="2" stroke-dasharray="6 4"/>'; m += '<line x1="'+X(ox,sc,a)+'" y1="'+Y(oy,sc,-2*a)+'" x2="'+X(ox,sc,a)+'" y2="'+Y(oy,sc,2*a)+'" stroke="#f472b6" stroke-width="2"/>'; }
    else if(form==="y2n"){ Fx=-a; dir='<line x1="'+X(ox,sc,a)+'" y1="20" x2="'+X(ox,sc,a)+'" y2="280" stroke="#34d399" stroke-width="2" stroke-dasharray="6 4"/>'; m += '<line x1="'+X(ox,sc,-a)+'" y1="'+Y(oy,sc,-2*a)+'" x2="'+X(ox,sc,-a)+'" y2="'+Y(oy,sc,2*a)+'" stroke="#f472b6" stroke-width="2"/>'; }
    else if(form==="x2p"){ Fy=a; dir='<line x1="20" y1="'+Y(oy,sc,-a)+'" x2="700" y2="'+Y(oy,sc,-a)+'" stroke="#34d399" stroke-width="2" stroke-dasharray="6 4"/>'; m += '<line x1="'+X(ox,sc,-2*a)+'" y1="'+Y(oy,sc,a)+'" x2="'+X(ox,sc,2*a)+'" y2="'+Y(oy,sc,a)+'" stroke="#f472b6" stroke-width="2"/>'; }
    else { Fy=-a; dir='<line x1="20" y1="'+Y(oy,sc,a)+'" x2="700" y2="'+Y(oy,sc,a)+'" stroke="#34d399" stroke-width="2" stroke-dasharray="6 4"/>'; m += '<line x1="'+X(ox,sc,-2*a)+'" y1="'+Y(oy,sc,-a)+'" x2="'+X(ox,sc,2*a)+'" y2="'+Y(oy,sc,-a)+'" stroke="#f472b6" stroke-width="2"/>'; }
    m += dir;
    m += '<circle cx="'+X(ox,sc,Fx)+'" cy="'+Y(oy,sc,Fy)+'" r="5" fill="#f59e0b"/>';
    var eq = form==="y2p"?"y² = 4ax": form==="y2n"?"y² = −4ax": form==="x2p"?"x² = 4ay":"x² = −4ay";
    readout(cell("standard", eq, "#38bdf8") + cell("focus", "("+Fx.toFixed(1)+", "+Fy.toFixed(1)+")", "#f59e0b") + cell("latus rectum", (4*a).toFixed(1), "#f472b6"));
    verdict("<b>PF = PB</b> (zoom p.8) ⇒ y²=4ax. Latus rectum through the focus has length 4a. Example 5: y²=8x has a=2, focus (2,0), directrix x=−2, LR=8.");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.ellipse = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ellipse</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Foci</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Latus rectum</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="e-x">Ex 9: x²/25 + y²/9 = 1</button>' +
      '<button class="preset-btn" id="e-y">Ex 10: major on y-axis</button>';
    document.getElementById("e-x").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-a").value=5; document.getElementById("ctrl-b").value=3; document.getElementById("ctrl-ax").value=0; draw(0); };
    document.getElementById("e-y").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-a").value=3; document.getElementById("ctrl-b").value=2; document.getElementById("ctrl-ax").value=1; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>semi-major a</span><span class="val" id="a-val">5</span></div><input type="range" id="ctrl-a" min="2" max="7" step="0.1" value="5"></div>' +
      '<div class="control-item"><div class="control-label"><span>semi-minor b</span><span class="val" id="b-val">3</span></div><input type="range" id="ctrl-b" min="1" max="6" step="0.1" value="3"></div>' +
      '<div class="control-item"><div class="control-label"><span>major axis</span><span class="val" id="ax-val">x</span></div><input type="range" id="ctrl-ax" min="0" max="1" step="1" value="0"></div>';
    ["ctrl-a","ctrl-b","ctrl-ax"].forEach(function(id){ document.getElementById(id).oninput = function(){ draw(0); }; });
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var a=rng("ctrl-a"), b=rng("ctrl-b"), yax=rng("ctrl-ax")>0.5;
    if(b>a){ var tmp=a; a=b; b=tmp; }
    setTxt("a-val", a.toFixed(1)); setTxt("b-val", b.toFixed(1)); setTxt("ax-val", yax?"y":"x");
    var c = Math.sqrt(Math.max(0, a*a-b*b));
    var e = a>0 ? c/a : 0;
    var ox=360, oy=150, sc=22;
    var m = axes(ox, oy, sc);
    var rx = (yax?b:a)*sc, ry=(yax?a:b)*sc;
    m += '<ellipse cx="'+ox+'" cy="'+oy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    if(yax){
      m += '<circle cx="'+ox+'" cy="'+Y(oy,sc,c)+'" r="5" fill="#f59e0b"/>';
      m += '<circle cx="'+ox+'" cy="'+Y(oy,sc,-c)+'" r="5" fill="#f59e0b"/>';
      var lr=b*b/a;
      m += '<line x1="'+X(ox,sc,-lr)+'" y1="'+Y(oy,sc,c)+'" x2="'+X(ox,sc,lr)+'" y2="'+Y(oy,sc,c)+'" stroke="#f472b6" stroke-width="2"/>';
    } else {
      m += '<circle cx="'+X(ox,sc,c)+'" cy="'+oy+'" r="5" fill="#f59e0b"/>';
      m += '<circle cx="'+X(ox,sc,-c)+'" cy="'+oy+'" r="5" fill="#f59e0b"/>';
      var lr=b*b/a;
      m += '<line x1="'+X(ox,sc,c)+'" y1="'+Y(oy,sc,-lr)+'" x2="'+X(ox,sc,c)+'" y2="'+Y(oy,sc,lr)+'" stroke="#f472b6" stroke-width="2"/>';
    }
    readout(cell("c=√(a²−b²)", c.toFixed(2)) + cell("e=c/a", e.toFixed(3), "#f59e0b") + cell("LR=2b²/a", (2*b*b/a).toFixed(2), "#f472b6"));
    verdict("<b>PF₁+PF₂=2a</b> with 2a > F₁F₂. Standard: x²/a² + y²/b² = 1 (major on x) or x²/b² + y²/a² = 1 (major on y). Example 9: a=5, b=3, c=4, e=4/5, LR=18/5.");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.hyperbola = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Hyperbola</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Foci</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="h-x">x²/a² − y²/b² = 1</button>' +
      '<button class="preset-btn" id="h-y">y²/a² − x²/b² = 1</button>';
    document.getElementById("h-x").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-or").value=0; draw(0); };
    document.getElementById("h-y").onclick = function(){ setActivePreset(this); document.getElementById("ctrl-or").value=1; draw(0); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>a</span><span class="val" id="a-val">3</span></div><input type="range" id="ctrl-a" min="1.5" max="5" step="0.1" value="3"></div>' +
      '<div class="control-item"><div class="control-label"><span>b</span><span class="val" id="b-val">4</span></div><input type="range" id="ctrl-b" min="1.5" max="6" step="0.1" value="4"></div>' +
      '<div class="control-item"><div class="control-label"><span>transverse</span><span class="val" id="or-val">x</span></div><input type="range" id="ctrl-or" min="0" max="1" step="1" value="0"></div>';
    ["ctrl-a","ctrl-b","ctrl-or"].forEach(function(id){ document.getElementById(id).oninput = function(){ draw(0); }; });
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var a=rng("ctrl-a"), b=rng("ctrl-b"), ytr=rng("ctrl-or")>0.5;
    setTxt("a-val", a.toFixed(1)); setTxt("b-val", b.toFixed(1)); setTxt("or-val", ytr?"y":"x");
    var c=Math.sqrt(a*a+b*b), e=c/a;
    var ox=360, oy=150, sc=18;
    var m = axes(ox, oy, sc);
    var d1="", d2="", t, x, y, first=true, first2=true;
    for(t=-8; t<=8.05; t+=0.08){
      if(!ytr){
        x = (t<0?-1:1)*a*Math.cosh(Math.abs(t)/2);
        y = b*Math.sinh(t/2);
      } else {
        y = (t<0?-1:1)*a*Math.cosh(Math.abs(t)/2);
        x = b*Math.sinh(t/2);
      }
      if((!ytr && x>=a) || (ytr && y>=a)){
        d1 += (first?"M":"L")+" "+X(ox,sc,x)+" "+Y(oy,sc,y); first=false;
      }
      if((!ytr && x<=-a) || (ytr && y<=-a)){
        d2 += (first2?"M":"L")+" "+X(ox,sc, !ytr?x:x)+" "+Y(oy,sc,y); first2=false;
      }
    }
    // parametric: use x = a sec θ, y = b tan θ
    d1=""; d2="";
    for(t=-1.35; t<=1.35; t+=0.03){
      var sec=1/Math.cos(t), tn=Math.tan(t);
      if(!ytr){ x=a*sec; y=b*tn; d1+=(t<-1.3?"M":"L")+" "+X(ox,sc,x)+" "+Y(oy,sc,y); d2+=(t<-1.3?"M":"L")+" "+X(ox,sc,-x)+" "+Y(oy,sc,y); }
      else { y=a*sec; x=b*tn; d1+=(t<-1.3?"M":"L")+" "+X(ox,sc,x)+" "+Y(oy,sc,y); d2+=(t<-1.3?"M":"L")+" "+X(ox,sc,x)+" "+Y(oy,sc,-y); }
    }
    m += '<path d="'+d1+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    m += '<path d="'+d2+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    if(!ytr){
      m += '<circle cx="'+X(ox,sc,c)+'" cy="'+oy+'" r="5" fill="#f59e0b"/>';
      m += '<circle cx="'+X(ox,sc,-c)+'" cy="'+oy+'" r="5" fill="#f59e0b"/>';
      m += '<circle cx="'+X(ox,sc,a)+'" cy="'+oy+'" r="4" fill="#e2e8f0"/>';
      m += '<circle cx="'+X(ox,sc,-a)+'" cy="'+oy+'" r="4" fill="#e2e8f0"/>';
    } else {
      m += '<circle cx="'+ox+'" cy="'+Y(oy,sc,c)+'" r="5" fill="#f59e0b"/>';
      m += '<circle cx="'+ox+'" cy="'+Y(oy,sc,-c)+'" r="5" fill="#f59e0b"/>';
    }
    readout(cell("c=√(a²+b²)", c.toFixed(2)) + cell("e=c/a (>1)", e.toFixed(3), "#f59e0b") + cell("LR=2b²/a", (2*b*b/a).toFixed(2)));
    verdict("<b>|PF₁−PF₂|=2a</b> with e≥1. Example 14(i): x²/9 − y²/16 = 1 has a=3, b=4, c=5, e=5/3, LR=32/3.");
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.conicapp = (function(){
  function mount(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Parabolic mirror y²=20x</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Focus</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="ap-m">Ex 17: mirror a=5, depth 45</button>' +
      '<button class="preset-btn" id="ap-b">Ex 18: beam sag</button>';
    document.getElementById("ap-m").onclick = function(){ setActivePreset(this); mode="m"; draw(0); };
    document.getElementById("ap-b").onclick = function(){ setActivePreset(this); mode="b"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    var mode="m";
    window._conicMode = function(){ return mode; };
    draw(0);
  }
  var mode = "m";
  var _oldMount = null;
  // rebind mode via buttons after mount
  function mount2(){
    App.state.maxT = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Application parabola</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Focus / vertex</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="ap-m">Ex 17 mirror AB=60 cm</button>' +
      '<button class="preset-btn" id="ap-b">Ex 18 beam 2√6 m</button>';
    document.getElementById("ap-m").onclick = function(){ setActivePreset(this); mode="m"; draw(0); };
    document.getElementById("ap-b").onclick = function(){ setActivePreset(this); mode="b"; draw(0); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var ox=200, oy=150, sc=4;
    var m = axes(ox, oy, sc);
    var d="", t, x, y;
    if(mode==="m"){
      for(t=-32;t<=32;t+=0.5){ y=t; x=y*y/20; d+=(t<-31?"M":"L")+" "+X(ox,sc,x)+" "+Y(oy,sc,y); }
      m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<circle cx="'+X(ox,sc,5)+'" cy="'+oy+'" r="5" fill="#f59e0b"/>';
      m += '<line x1="'+X(ox,sc,45)+'" y1="'+Y(oy,sc,-30)+'" x2="'+X(ox,sc,45)+'" y2="'+Y(oy,sc,30)+'" stroke="#f472b6" stroke-width="2"/>';
      readout(cell("a","5 cm") + cell("x=45","y=±30") + cell("AB","60 cm","#34d399"));
      verdict("<b>Example 17:</b> y²=20x, at x=45, y=±30 so AB=60 cm. Headlights and satellite dishes put the bulb at the focus.");
    } else {
      ox=360; oy=250; sc=8;
      m = axes(ox, oy, sc);
      d="";
      for(t=-6.2;t<=6.2;t+=0.1){ x=t; y=x*x/(4*300); d+=(t<-6?"M":"L")+" "+X(ox,sc,x)+" "+Y(oy,sc,y*100); }
      m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
      readout(cell("span","12 m") + cell("centre sag","3 cm") + cell("1 cm sag at","2√6 m from centre","#34d399"));
      verdict("<b>Example 18:</b> x²=4ay through (6, 0.03) gives a=300 m. At y=0.02, x=√24=2√6 m from the centre.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount2, draw: draw };
})();
