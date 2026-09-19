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

window.SIMS.cartesian = (function(){
  var mode = "colour";
  function mount(){
    App.state.maxT = 6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>First slot</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Second slot</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-c" data-preset="p-c">Colours × objects (Fig 2.1)</button>' +
      '<button class="preset-btn" id="p-p" data-preset="p-p">DL/MP/KA plates (Fig 2.2)</button>' +
      '<button class="preset-btn" id="p-r" data-preset="p-r">Nine sampled points of R × R</button>';
    document.getElementById("p-c").onclick=function(){setActivePreset(this);mode="colour";App.resetTimeline();};
    document.getElementById("p-p").onclick=function(){setActivePreset(this);mode="plate";App.resetTimeline();};
    document.getElementById("p-r").onclick=function(){setActivePreset(this);mode="plane";App.resetTimeline();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(t){
    var svg=svgEl(); if(!svg) return;
    var m='<defs><marker id="relation-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10" fill="#34d399"/></marker></defs><rect width="720" height="300" fill="#09131d"/>';
    var rows, cols, n;
    if(mode==="colour"){ rows=["red","blue"]; cols=["b","c","s"]; n=6; }
    else if(mode==="plate"){ rows=["DL","MP","KA"]; cols=["01","02","03"]; n=9; }
    else { rows=["−1","0","1"]; cols=["−1","0","1"]; n=9; }
    var k=0, lit=Math.min(n-1, Math.floor(((t||0)/6)*n));
    for(var i=0;i<rows.length;i++){
      for(var j=0;j<cols.length;j++){
        var x=80+j*120, y=70+i*70;
        var on = k===lit;
        m += '<rect x="'+x+'" y="'+y+'" width="100" height="50" rx="8" fill="'+(on?"#38bdf844":"#0f2744")+'" stroke="'+(on?"#34d399":"#334155")+'" stroke-width="2"/>';
        m += '<text x="'+(x+50)+'" y="'+(y+30)+'" fill="#f8fafc" font-size="13" text-anchor="middle">('+rows[i]+', '+cols[j]+')</text>';
        k++;
      }
    }
    m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">n(A×B) = '+n+' · play to walk the grid</text>';
    svg.innerHTML=m;
    readout(cell("n(A×B)", String(n), "#34d399") + cell("Highlighted", "("+rows[Math.floor(lit/cols.length)]+", "+cols[lit%cols.length]+")"));
    verdict("<b>Definition 1:</b> order matters. (DL,01) is not (01,DL). Empty factor ⇒ empty product.");
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.arrows = (function(){
  var mode = "fig27";
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Domain P</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Codomain Q</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-27" data-preset="p-27">Fig 2.7  y=x−2</button>' +
      '<button class="preset-btn" id="p-3x" data-preset="p-3x">Ex 2.2.1  y=3x</button>' +
      '<button class="preset-btn" id="p-all" data-preset="p-all">All 6 arrows (2⁶=64)</button>';
    document.getElementById("p-27").onclick=function(){setActivePreset(this);mode="fig27";App.resetTimeline();};
    document.getElementById("p-3x").onclick=function(){setActivePreset(this);mode="threex";App.resetTimeline();};
    document.getElementById("p-all").onclick=function(){setActivePreset(this);mode="all";App.resetTimeline();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(t){
    var svg=svgEl(); if(!svg) return;
    var m='<defs><marker id="relation-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10" fill="#34d399"/></marker></defs><rect width="720" height="300" fill="#09131d"/>';
    function oval(x,y,label,col){
      return '<circle cx="'+x+'" cy="'+y+'" r="16" fill="'+col+'"/><text x="'+x+'" y="'+(y+5)+'" fill="#0b1220" font-size="12" text-anchor="middle">'+label+'</text>';
    }
    if(mode==="fig27"){
      var P=[5,6,7], Q=[3,4,5];
      P.forEach(function(v,i){ m+=oval(180,70+i*70,v,"#38bdf8"); });
      Q.forEach(function(v,i){ m+=oval(540,70+i*70,v,"#f59e0b"); });
      var pairs=[[0,0],[1,1],[2,2]];
      var show=Math.min(3, 1+Math.floor((t||0)/2));
      for(var k=0;k<show;k++){
        var a=pairs[k];
        m += '<line x1="196" y1="'+(70+a[0]*70)+'" x2="524" y2="'+(70+a[1]*70)+'" stroke="#34d399" stroke-width="2" marker-end="url(#relation-arrow)"/>';
      }
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Fig 2.7 · R={(5,3),(6,4),(7,5)}</text>';
      readout(cell("Domain","{5,6,7}") + cell("Range","{3,4,5}") + cell("Rule","y = x − 2"));
      verdict("<b>Ex 2.2.4:</b> set-builder {(x,y): y=x−2, x∈P, y∈Q}. Codomain Q equals the range in this picture.");
    } else if(mode==="threex"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">A={1,…,14}, y=3x ≤ 14</text>';
      [[1,3],[2,6],[3,9],[4,12]].forEach(function(p,i){
        m += oval(160,55+i*55,p[0],"#38bdf8") + oval(560,55+i*55,p[1],"#f59e0b");
        m += '<line x1="176" y1="'+(55+i*55)+'" x2="544" y2="'+(55+i*55)+'" stroke="#34d399" stroke-width="2"/>';
      });
      readout(cell("Domain","{1,2,3,4}") + cell("Range","{3,6,9,12}") + cell("Codomain","{1,…,14}"));
      verdict("<b>Ex 2.2.1:</b> unused numbers 5,7,8,… stay in the codomain, not the range.");
    } else {
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">A={x,y,z} → B={1,2} · 6 possible arrows · 2⁶=64 relations</text>';
      ["x","y","z"].forEach(function(v,i){ m+=oval(200,80+i*70,v,"#38bdf8"); });
      ["1","2"].forEach(function(v,i){ m+=oval(520,100+i*80,v,"#f59e0b"); });
      var bit=Math.min(63,Math.floor((t||0)*63/6));
      var idx=0;
      for(var i=0;i<3;i++) for(var j=0;j<2;j++){
        if(bit & (1<<idx)){
          m += '<line x1="216" y1="'+(80+i*70)+'" x2="504" y2="'+(100+j*80)+'" stroke="#34d399" stroke-width="2"/>';
        }
        idx++;
      }
      readout(cell("Subset mask", "0b"+bit.toString(2).padStart(6,"0")) + cell("Relations", "64"));
      verdict("<b>Ex 2.2.8 / Example 9:</b> each of the 6 grid-cells is an independent yes/no. Play to cycle masks.");
    }
    svg.innerHTML=m;
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.funmachine = (function(){
  var mode="ok";
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Unique image (function)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Violation</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ok" data-preset="p-ok">Function (Ex 2.3.1 i)</button>' +
      '<button class="preset-btn" id="p-two" data-preset="p-two">Two images (Ex 2.3.1 iii)</button>' +
      '<button class="preset-btn" id="p-miss" data-preset="p-miss">Missing image (Example 7)</button>';
    document.getElementById("p-ok").onclick=function(){setActivePreset(this);mode="ok";App.resetTimeline();};
    document.getElementById("p-two").onclick=function(){setActivePreset(this);mode="two";App.resetTimeline();};
    document.getElementById("p-miss").onclick=function(){setActivePreset(this);mode="miss";App.resetTimeline();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function draw(){
    var svg=svgEl(); if(!svg) return;
    var m='<defs><marker id="relation-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10" fill="#34d399"/></marker></defs><rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="260" y="90" width="200" height="120" rx="12" fill="#0f2744" stroke="#38bdf8"/>';
    m += '<text x="360" y="155" fill="#f8fafc" font-size="16" text-anchor="middle">f machine</text>';
    if(mode==="ok"){
      m += '<text x="120" y="150" fill="#38bdf8" font-size="14">2,5,8,11,14,17</text>';
      m += '<text x="560" y="150" fill="#34d399" font-size="18">all → 1</text>';
      readout(cell("Test","PASS","#34d399")+cell("Domain","6 points")+cell("Range","{1}"));
      verdict("<b>Ex 2.3.1(i):</b> every input has exactly one output (here the constant 1). Reusing 1 is allowed.");
    } else if(mode==="two"){
      m += '<text x="120" y="150" fill="#38bdf8">1 , 2</text>';
      m += '<text x="560" y="120" fill="#f87171">1 → 3</text>';
      m += '<text x="560" y="180" fill="#f87171">1 → 5</text>';
      readout(cell("Test","FAIL","#f87171")+cell("Reason","1 has two images"));
      verdict("<b>Ex 2.3.1(iii) / Definition 5:</b> two pairs share a first slot. Not a function.");
    } else {
      m += '<text x="100" y="150" fill="#38bdf8">1,2,3,4,5, <tspan fill="#f87171">6</tspan></text>';
      m += '<text x="560" y="150" fill="#f8fafc">y = x+1</text>';
      m += '<text x="360" y="250" fill="#f87171" font-size="14" text-anchor="middle">6 has no image inside {1,…,6}</text>';
      readout(cell("Test","FAIL","#f87171")+cell("Reason","totality fails at 6"));
      verdict("<b>Example 7:</b> R={(x,y): y=x+1} on {1..6} is a relation, not a function — 6 is unemployed.");
    }
    svg.innerHTML=m;
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.catalogue = (function(){
  var mode="abs";
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>y = f(x)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-abs" data-preset="p-abs">|x| Fig 2.13</button>' +
      '<button class="preset-btn" id="p-sgn" data-preset="p-sgn">signum Fig 2.14</button>' +
      '<button class="preset-btn" id="p-fl" data-preset="p-fl">[x] Fig 2.15</button>' +
      '<button class="preset-btn" id="p-circ" data-preset="p-circ">√(9−x²) Ex 2.3.2</button>';
    document.getElementById("p-abs").onclick=function(){setActivePreset(this);mode="abs";App.resetTimeline();App.play();};
    document.getElementById("p-sgn").onclick=function(){setActivePreset(this);mode="sgn";App.resetTimeline();App.play();};
    document.getElementById("p-fl").onclick=function(){setActivePreset(this);mode="fl";App.resetTimeline();App.play();};
    document.getElementById("p-circ").onclick=function(){setActivePreset(this);mode="circ";App.resetTimeline();App.play();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function X(x){ return 360 + x*40; }
  function Y(y){ return 160 - y*24; }
  function draw(t){
    var svg=svgEl(); if(!svg) return;
    var x = mode==="circ" ? -3 + ((t||0)/6)*6 : -4 + ((t||0)/6)*8;
    var m='<defs><marker id="relation-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10" fill="#34d399"/></marker></defs><rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="160" x2="680" y2="160" stroke="#334155"/><line x1="360" y1="20" x2="360" y2="280" stroke="#334155"/>';
    var d="", yv=0, note="";
    if(mode==="abs"){
      for(var u=-5;u<=5.05;u+=0.1){ d += (u===-5?"M":"L")+" "+X(u)+" "+Y(Math.abs(u)); }
      yv=Math.abs(x); note="Fig 2.13: V-shape. Domain R, range [0,∞).";
    } else if(mode==="sgn"){
      m += '<line x1="'+X(-5)+'" y1="'+Y(-1)+'" x2="'+X(0)+'" y2="'+Y(-1)+'" stroke="#38bdf8" stroke-width="3"/>';
      m += '<line x1="'+X(0)+'" y1="'+Y(1)+'" x2="'+X(5)+'" y2="'+Y(1)+'" stroke="#38bdf8" stroke-width="3"/>';
      m += '<circle cx="'+X(0)+'" cy="'+Y(0)+'" r="5" fill="#f8fafc"/>';
      [-1,1].forEach(function(y){m += '<circle cx="'+X(0)+'" cy="'+Y(y)+'" r="5" fill="#09131d" stroke="#38bdf8" stroke-width="2"/>';});
      yv = x>0?1:(x<0?-1:0); note="Fig 2.14: range {−1,0,1}.";
    } else if(mode==="fl"){
      for(var n=-4;n<=4;n++){
        m += '<line x1="'+X(n)+'" y1="'+Y(n)+'" x2="'+X(n+1)+'" y2="'+Y(n)+'" stroke="#38bdf8" stroke-width="3"/>';
        m += '<circle cx="'+X(n)+'" cy="'+Y(n)+'" r="4" fill="#38bdf8"/>';
        m += '<circle cx="'+X(n+1)+'" cy="'+Y(n)+'" r="4" fill="#09131d" stroke="#38bdf8"/>';
      }
      yv=Math.floor(x); note="Fig 2.15: [x]=n on [n, n+1). Open on the right.";
    } else {
      for(var a=-3;a<=3.02;a+=0.05){ var yy=Math.sqrt(Math.max(0,9-a*a)); d += (a===-3?"M":"L")+" "+X(a)+" "+Y(yy); }
      yv = Math.abs(x)<=3 ? Math.sqrt(9-x*x) : NaN;
      note="Ex 2.3.2(ii): upper semicircle radius 3. Domain [−3,3], range [0,3].";
    }
    if(d) m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    if(!isNaN(yv)) m += '<circle cx="'+X(x)+'" cy="'+Y(yv)+'" r="6" fill="#f8fafc"/>';
    svg.innerHTML=m;
    readout(cell("x", x.toFixed(2)) + cell("f(x)", isNaN(yv)?"outside domain":yv.toFixed(2), "#34d399"));
    verdict("<b>Catalogue:</b> "+note);
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.algebrafn = (function(){
  var mode="sum";
  function f(x){ return x+1; }
  function g(x){ return 2*x-3; }
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>f(x)=x+1</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>g(x)=2x−3</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>combination</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-s" data-preset="p-s">f + g = 3x−2</button>' +
      '<button class="preset-btn" id="p-d" data-preset="p-d">f − g = −x+4</button>' +
      '<button class="preset-btn" id="p-q" data-preset="p-q">f / g  hole at 3/2</button>';
    document.getElementById("p-s").onclick=function(){setActivePreset(this);mode="sum";App.resetTimeline();App.play();};
    document.getElementById("p-d").onclick=function(){setActivePreset(this);mode="diff";App.resetTimeline();App.play();};
    document.getElementById("p-q").onclick=function(){setActivePreset(this);mode="quot";App.resetTimeline();App.play();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function X(x){ return 360 + x*50; }
  function Y(y){ return 160 - y*18; }
  function draw(t){
    var svg=svgEl(); if(!svg) return;
    var x=-3+((t||0)/6)*6;
    var m='<defs><marker id="relation-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10" fill="#34d399"/></marker></defs><rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="160" x2="680" y2="160" stroke="#334155"/><line x1="360" y1="20" x2="360" y2="280" stroke="#334155"/>';
    function path(fn, col){
      var d="", pen=false, previous=null;
      for(var u=-4;u<=4.001;u+=0.04){
        var yu=fn(u), py=Y(yu);
        if(!Number.isFinite(yu) || py<20 || py>280){pen=false;previous=null;continue;}
        if(previous!==null && mode==="quot" && previous<1.5 && u>1.5) pen=false;
        d += (pen?"L":"M")+" "+X(u)+" "+py;
        pen=true;previous=u;
      }
      return '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="2"/>';
    }
    m += path(f,"#38bdf8") + path(g,"#f59e0b");
    var comb = mode==="sum" ? function(u){return f(u)+g(u);} : mode==="diff" ? function(u){return f(u)-g(u);} : function(u){return f(u)/g(u);};
    m += path(comb,"#34d399");
    if(Number.isFinite(comb(x)) && Y(comb(x))>=20 && Y(comb(x))<=280) m += '<circle cx="'+X(x)+'" cy="'+Y(comb(x))+'" r="5" fill="#f8fafc"/>';
    if(mode==="quot") m += '<line x1="'+X(1.5)+'" y1="20" x2="'+X(1.5)+'" y2="280" stroke="#f87171" stroke-dasharray="4 4"/>';
    svg.innerHTML=m;
    var val = (mode==="quot" && Math.abs(g(x))<1e-6) ? "not defined (g=0)" : comb(x).toFixed(2);
    readout(cell("x", x.toFixed(2)) + cell("f", f(x).toFixed(2)) + cell("g", g(x).toFixed(2)) + cell("combo", val, "#34d399"));
    verdict("<b>Misc. Ex 7 / §2.4.2:</b> pointwise algebra. The red dashed line is x=3/2 where g vanishes.");
  }
  return {mount:mount,draw:draw};
})();

window.SIMS.domainlab = (function(){
  var mode="sqrt";
  function mount(){
    App.state.maxT=6; var s=document.getElementById("time-scrubber"); if(s) s.max=6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>graph</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>outside domain</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-sq" data-preset="p-sq">√(x−1)</button>' +
      '<button class="preset-btn" id="p-ab" data-preset="p-ab">|x−1|</button>' +
      '<button class="preset-btn" id="p-rat" data-preset="p-rat">x²/(1+x²) → [0,1)</button>';
    document.getElementById("p-sq").onclick=function(){setActivePreset(this);mode="sqrt";App.resetTimeline();App.play();};
    document.getElementById("p-ab").onclick=function(){setActivePreset(this);mode="abs";App.resetTimeline();App.play();};
    document.getElementById("p-rat").onclick=function(){setActivePreset(this);mode="rat";App.resetTimeline();App.play();};
    document.getElementById("lab-controls").innerHTML="";
    draw(0);
  }
  function X(x){ return 200 + x*50; }
  function Y(y){ return 240 - y*36; }
  function draw(t){
    var svg=svgEl(); if(!svg) return;
    var x=-1+((t||0)/6)*6;
    var m='<defs><marker id="relation-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10" fill="#34d399"/></marker></defs><rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="240" x2="680" y2="240" stroke="#334155"/><line x1="200" y1="20" x2="200" y2="280" stroke="#334155"/>';
    var d="", yv, note, dom, rng;
    if(mode==="sqrt"){
      for(var u=1;u<=6.05;u+=0.1){ d += (u===1?"M":"L")+" "+X(u)+" "+Y(Math.sqrt(u-1)); }
      yv = x>=1 ? Math.sqrt(x-1) : NaN; dom="[1, ∞)"; rng="[0, ∞)"; note="Misc. Ex 4. Red zone x<1 is not in the domain.";
      m += '<rect x="40" y="20" width="'+(X(1)-40)+'" height="260" fill="#f8717122"/>';
    } else if(mode==="abs"){
      for(var u=-1;u<=6.05;u+=0.1){ d += (u===-1?"M":"L")+" "+X(u)+" "+Y(Math.abs(u-1)); }
      yv=Math.abs(x-1); dom="R"; rng="[0, ∞)"; note="Misc. Ex 5. V shifted to x=1.";
    } else {
      for(var u=-1;u<=6.05;u+=0.1){ var r=u*u/(1+u*u); d += (u===-1?"M":"L")+" "+X(u)+" "+Y(r); }
      yv=x*x/(1+x*x); dom="R"; rng="[0, 1)"; note="Misc. Ex 6. Approaches 1, never arrives. Asymptote y=1.";
      m += '<line x1="40" y1="'+Y(1)+'" x2="680" y2="'+Y(1)+'" stroke="#f59e0b" stroke-dasharray="5 4"/>';
    }
    m += '<path d="'+d+'" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';
    if(!isNaN(yv)) m += '<circle cx="'+X(x)+'" cy="'+Y(yv)+'" r="5" fill="#f8fafc"/>';
    svg.innerHTML=m;
    readout(cell("x", x.toFixed(2)) + cell("f(x)", isNaN(yv)?"outside domain":yv.toFixed(3), "#34d399") + cell("Domain", dom) + cell("Range", rng));
    verdict("<b>Domain/range:</b> "+note);
  }
  return {mount:mount,draw:draw};
})();
