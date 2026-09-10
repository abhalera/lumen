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

window.SIMS.kepler = (function(){
  var ecc = 0.6;
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Sun (focus)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Planet</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="k1">Ellipse e=0.6</button>' +
      '<button class="preset-btn" id="k2">Circle (e=0)</button>';
    document.getElementById("k1").onclick = function(){ setActivePreset(this); ecc=0.6; App.resetTimeline(); App.play(); };
    document.getElementById("k2").onclick = function(){ setActivePreset(this); ecc=0; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var a=180, b=a*Math.sqrt(1-ecc*ecc), cx=360, cy=150, c=a*ecc;
    var M=t/8*2*Math.PI;
    // crude Kepler: faster near periapsis
    var E = M + ecc*Math.sin(M)*1.5;
    var x=cx+a*Math.cos(E), y=cy+b*Math.sin(E);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+a+'" ry="'+b+'" fill="none" stroke="#334155"/>';
    m += '<circle cx="'+(cx-c)+'" cy="'+cy+'" r="8" fill="#f59e0b"/>';
    m += '<circle cx="'+x+'" cy="'+y+'" r="7" fill="#38bdf8"/>';
    m += '<line x1="'+(cx-c)+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'" stroke="#94a3b8" stroke-width="1"/>';
    svg.innerHTML = m;
    readout(cell("e", ecc.toFixed(1)) + cell("focus","Sun") + cell("Kepler II","equal areas") + cell("Table 7.1","Q≈3.0×10^{-34}"));
    verdict(ecc>0
      ? "<b>Fig. 7.1–7.2:</b> Sun at one focus. Perihelion = closest, fastest. Area law: dA/dt=L/(2m) constant because gravity is central."
      : "<b>Circle:</b> the two foci merge; semi-major axis is the radius. Kepler III still holds: T² ∝ a³.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.newtonG = (function(){
  var mode = "inv";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Masses</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Force</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="n1">1/r² vs distance</button>' +
      '<button class="preset-btn" id="n2">Ex 7.2 three masses</button>' +
      '<button class="preset-btn" id="n3">Shell: inside F=0</button>';
    document.getElementById("n1").onclick = function(){ setActivePreset(this); mode="inv"; App.resetTimeline(); App.play(); };
    document.getElementById("n2").onclick = function(){ setActivePreset(this); mode="tri"; App.resetTimeline(); };
    document.getElementById("n3").onclick = function(){ setActivePreset(this); mode="shell"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="inv"){
      var r=80+t*40;
      var F=4000/(r*r);
      m += '<circle cx="120" cy="150" r="16" fill="#f59e0b"/>';
      m += '<circle cx="'+(120+r)+'" cy="150" r="8" fill="#38bdf8"/>';
      svg.innerHTML = m;
      readout(cell("r", r.toFixed(0)+" (arb)") + cell("F","∝ 1/r²") + cell("g/a_m","≈3600","#34d399"));
      verdict("<b>Eq. (7.4):</b> g/a_m = R_m²/R_E² ≈ 60² = 3600. Same inverse-square on apple and Moon. G = 6.67×10^{-11} N m² kg⁻².");
    } else if(mode==="tri"){
      m += '<polygon points="360,50 200,230 520,230" fill="none" stroke="#475569"/>';
      m += '<circle cx="360" cy="50" r="8" fill="#38bdf8"/>';
      m += '<circle cx="200" cy="230" r="8" fill="#38bdf8"/>';
      m += '<circle cx="520" cy="230" r="8" fill="#38bdf8"/>';
      m += '<circle cx="360" cy="170" r="10" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("on 2m at G","F_R = 0") + cell("A doubled","2 G m² ĵ toward A"));
      verdict("<b>Example 7.2:</b> three equal pulls 120° apart cancel. Double A and the leftover is 2Gm² toward A (AG=1 m).");
    } else {
      var x=360+80*Math.cos(t), y=150+80*Math.sin(t);
      m += '<circle cx="360" cy="150" r="110" fill="none" stroke="#38bdf8" stroke-width="10"/>';
      m += '<circle cx="'+x+'" cy="'+y+'" r="6" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("inside shell","F = 0","#34d399") + cell("outside","as a point mass"));
      verdict("<b>Shell theorems (zoom p.5):</b> uniform hollow sphere — exterior like a point at the centre; interior net force zero. No gravitational shielding of outside matter.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.gvar = (function(){
  var mode = "up";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Test mass</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Earth</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="g1">Above: g(1−2h/R)</button>' +
      '<button class="preset-btn" id="g2">Mine: g(1−d/R)</button>';
    document.getElementById("g1").onclick = function(){ setActivePreset(this); mode="up"; App.resetTimeline(); App.play(); };
    document.getElementById("g2").onclick = function(){ setActivePreset(this); mode="down"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<circle cx="360" cy="200" r="90" fill="none" stroke="#f59e0b" stroke-width="3"/>';
    if(mode==="up"){
      var h=t/6, y=200-90-h*80;
      var gfac=1/(1+h*0.5)/(1+h*0.5);
      m += '<circle cx="360" cy="'+y+'" r="7" fill="#38bdf8"/>';
      svg.innerHTML = m;
      readout(cell("h/R", (h*0.5).toFixed(2)) + cell("g(h)/g", gfac.toFixed(3)) + cell("approx","1−2h/R"));
      verdict("<b>Eq. (7.15):</b> g(h)=GM/(R+h)² ≈ g(1−2h/R) for h≪R. At h=R/2, exact ratio is (2/3)²=4/9 (Ex 7.15: 63 N → 28 N).");
    } else {
      var d=t/6, y=200-90+d*90;
      var gfac=1-d;
      m += '<circle cx="360" cy="'+y+'" r="7" fill="#38bdf8"/>';
      svg.innerHTML = m;
      readout(cell("d/R", d.toFixed(2)) + cell("g(d)/g", gfac.toFixed(3),"#34d399") + cell("centre","g=0"));
      verdict("<b>Eq. (7.19):</b> uniform Earth, g(d)=g(1−d/R). Halfway to the centre a 250 N weight is 125 N (Ex 7.16). Surface is the maximum of g.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.gravpe = (function(){
  var mode = "well";
  function mount(){
    App.state.maxT = 5;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>V(r)=−GMm/r</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p1">Newtonian well</button>' +
      '<button class="preset-btn" id="p2">Ex 7.3 four-mass square</button>';
    document.getElementById("p1").onclick = function(){ setActivePreset(this); mode="well"; App.resetTimeline(); App.play(); };
    document.getElementById("p2").onclick = function(){ setActivePreset(this); mode="sq"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="well"){
      m += '<line x1="60" y1="40" x2="60" y2="260" stroke="#475569"/><line x1="60" y1="40" x2="680" y2="40" stroke="#475569"/>';
      var d="";
      for(var x=80;x<680;x+=4){
        var r=(x-40)/40, V=-80/r;
        d += (x===80?"M":"L")+" "+x+" "+(40-V);
      }
      m += '<path d="'+d+'" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      var px=80+t*80;
      svg.innerHTML = m;
      readout(cell("zero","V(∞)=0") + cell("V","−GMm/r < 0") + cell("mgh","first-order difference"));
      verdict("<b>§7.7:</b> only differences of V are physical. mgh is the h≪R expansion of −GMm/r. Bound systems have E<0.");
    } else {
      m += '<rect x="220" y="70" width="200" height="160" fill="none" stroke="#475569"/>';
      [[220,70],[420,70],[220,230],[420,230]].forEach(function(p){
        m += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="10" fill="#38bdf8"/>';
      });
      m += '<circle cx="320" cy="150" r="6" fill="#f59e0b"/>';
      svg.innerHTML = m;
      readout(cell("W","−5.41 G m²/l") + cell("U_centre","−4√2 G m / l"));
      verdict("<b>Example 7.3 (zoom p.9):</b> 4 sides + 2 diagonals. W=−(2Gm²/l)(2+1/√2)=−5.41 Gm²/l. Centre: r=l/√2, U=−4√2 Gm/l.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.escape = (function(){
  var mode = "earth";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Projectile</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="e1">Earth v_e = 11.2 km/s</button>' +
      '<button class="preset-btn" id="e2">Ex 7.4 two spheres</button>';
    document.getElementById("e1").onclick = function(){ setActivePreset(this); mode="earth"; App.resetTimeline(); App.play(); };
    document.getElementById("e2").onclick = function(){ setActivePreset(this); mode="two"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="earth"){
      m += '<circle cx="160" cy="200" r="50" fill="#1e3a5f" stroke="#f59e0b"/>';
      var y=150-t*20;
      m += '<circle cx="160" cy="'+y+'" r="6" fill="#38bdf8"/>';
      svg.innerHTML = m;
      readout(cell("v_e","√(2gR) = 11.2 km/s","#34d399") + cell("Moon","2.3 km/s") + cell("3 v_e","v_∞ = 31.7 km/s"));
      verdict("<b>Eq. (7.32):</b> ½mv_e² = GMm/R. Independent of projectile mass. Moon 2.3 km s⁻¹ — no atmosphere. Ex 7.18: 3v_e leaves v_∞=√8 v_e=31.7 km s⁻¹.");
    } else {
      m += '<circle cx="200" cy="160" r="30" fill="#1e3a5f"/><text x="200" y="165" fill="#94a3b8" font-size="11" text-anchor="middle">M</text>';
      m += '<circle cx="520" cy="160" r="30" fill="#3b1d4a"/><text x="520" y="165" fill="#94a3b8" font-size="11" text-anchor="middle">4M</text>';
      var x=230+t/6*140;
      m += '<circle cx="'+x+'" cy="160" r="5" fill="#38bdf8"/>';
      m += '<line x1="306" y1="140" x2="306" y2="180" stroke="#34d399"/>';
      svg.innerHTML = m;
      readout(cell("N at","2R from M") + cell("v_min","√(3GM/5R)","#34d399"));
      verdict("<b>Example 7.4:</b> GM/r²=4GM/(6R−r)² ⇒ r=2R. Energy to rest at N gives v=√(3GM/5R). After N, 4M reels the projectile in.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.satellite = (function(){
  function mount(){
    App.state.maxT = 8;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 8;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Earth</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Satellite</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="s1">LEO T₀ ≈ 85 min</button>' +
      '<button class="preset-btn" id="s2">Higher h, smaller v</button>';
    document.getElementById("s1").onclick = function(){ setActivePreset(this); h=0.05; App.resetTimeline(); App.play(); };
    document.getElementById("s2").onclick = function(){ setActivePreset(this); h=0.6; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  var h=0.05;
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var R=70, r=R*(1+h), cx=360, cy=160;
    var ang=t/8*2*Math.PI;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#1e3a5f" stroke="#f59e0b"/>';
    m += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#334155" stroke-dasharray="4 3"/>';
    m += '<circle cx="'+(cx+r*Math.cos(ang))+'" cy="'+(cy+r*Math.sin(ang))+'" r="6" fill="#38bdf8"/>';
    svg.innerHTML = m;
    readout(cell("v","√(GM/r)") + cell("T","2π r^{3/2}/√(GM)") + cell("T₀","2π√(R/g) ≈ 85 min","#34d399"));
    verdict("<b>Eqs. (7.35)–(7.39):</b> gravity supplies mv²/r. Higher orbit, slower satellite, longer T. Phobos (Ex 7.5) weighs Mars: 6.48×10^{23} kg; Martian year 684 d.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.orbitE = (function(){
  var rf = 2;
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>K</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>V</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>E=K+V</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="o1">Ex 7.8 : 2R → 4R</button>' +
      '<button class="preset-btn" id="o2">Bars of K, V, E</button>';
    document.getElementById("o1").onclick = function(){ setActivePreset(this); rf=2; App.resetTimeline(); App.play(); };
    document.getElementById("o2").onclick = function(){ setActivePreset(this); rf=1; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var frac=Math.min(1,t/4);
    var r=2+2*frac; // in units of RE
    var E=-1/r, K=1/r, V=-2/r;
    function bar(x, val, color){
      var h=Math.abs(val)*80, y = val<0 ? 150 : 150-h;
      return '<rect x="'+x+'" y="'+y+'" width="40" height="'+h+'" fill="'+color+'"/>';
    }
    m += '<line x1="80" y1="150" x2="640" y2="150" stroke="#475569"/>';
    m += bar(200, K, "#38bdf8");
    m += bar(320, V, "#f59e0b");
    m += bar(440, E, "#34d399");
    m += '<text x="220" y="280" fill="#94a3b8" font-size="12" text-anchor="middle">K</text>';
    m += '<text x="340" y="280" fill="#94a3b8" font-size="12" text-anchor="middle">V</text>';
    m += '<text x="460" y="280" fill="#94a3b8" font-size="12" text-anchor="middle">E</text>';
    svg.innerHTML = m;
    readout(cell("r/R_E", r.toFixed(2)) + cell("K","+GMm/(2r)") + cell("V","−GMm/r") + cell("E","−GMm/(2r)","#34d399"));
    verdict("<b>Example 7.8:</b> 400 kg, 2R_E→4R_E. ΔE=+3.13×10⁹ J, ΔK=−3.13×10⁹ J, ΔV=+6.26×10⁹ J. Reprint’s minus on ΔV is a slip: higher orbit, V less negative.");
  }
  return { mount: mount, draw: draw };
})();
