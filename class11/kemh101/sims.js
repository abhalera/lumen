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

window.SIMS.roster = (function(){
  var mode = "school";
  var sets = {
    school: {name:"SCHOOL", roster:"{S, C, H, O, L}", builder:"{x : x is a letter of SCHOOL}", n:5, note:"Repeats of O dropped (note after roster form)."},
    loyal: {name:"LOYAL / ALLOY", roster:"{A, L, O, Y}", builder:"{x : x is a letter of LOYAL} = {x : x is a letter of ALLOY}", n:4, note:"Example 8: anagrams, same letter-set."},
    frac: {name:"Example 4", roster:"{1/2, 2/3, 3/4, 4/5, 5/6, 6/7}", builder:"{x : x = n/(n+1), n ∈ N, 1 ≤ n ≤ 6}", n:6, note:"Stacked fractions, zoom p.4 — no slash in the PDF."}
  };
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Roster braces</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Set-builder rule</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-school">SCHOOL</button>' +
      '<button class="preset-btn" id="p-loyal">LOYAL = ALLOY</button>' +
      '<button class="preset-btn" id="p-frac">Example 4 fractions</button>';
    document.getElementById("p-school").onclick = function(){ setActivePreset(this); mode="school"; App.resetTimeline(); };
    document.getElementById("p-loyal").onclick = function(){ setActivePreset(this); mode="loyal"; App.resetTimeline(); };
    document.getElementById("p-frac").onclick = function(){ setActivePreset(this); mode="frac"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var z = sets[mode];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="40" y="70" width="300" height="160" rx="12" fill="#0f2744" stroke="#38bdf8"/>';
    m += '<rect x="380" y="70" width="300" height="160" rx="12" fill="#1a1408" stroke="#f59e0b"/>';
    m += '<text x="190" y="100" fill="#38bdf8" font-size="14" text-anchor="middle">Roster</text>';
    m += '<text x="530" y="100" fill="#f59e0b" font-size="14" text-anchor="middle">Set-builder</text>';
    m += '<text x="190" y="155" fill="#f8fafc" font-size="16" text-anchor="middle">' + z.roster + '</text>';
    m += '<text x="530" y="150" fill="#f8fafc" font-size="13" text-anchor="middle">'+ z.builder.slice(0,38) + '</text>';
    m += '<text x="530" y="172" fill="#f8fafc" font-size="13" text-anchor="middle">'+ z.builder.slice(38) + '</text>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Two writings of the same set · n = ' + z.n + '</text>';
    svg.innerHTML = m;
    readout(cell("Word / example", z.name) + cell("n(S)", String(z.n), "#34d399") + cell("t", (t||0).toFixed(1)+" s"));
    verdict("<b>" + z.name + ":</b> " + z.note);
  }
  return {mount:mount, draw:draw};
})();

window.SIMS.finiteinf = (function(){
  var mode = "empty";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Finite</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Infinite</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-empty">Empty: Class X∩XI</button>' +
      '<button class="preset-btn" id="p-evenp">Even primes {2}</button>' +
      '<button class="preset-btn" id="p-primes">All primes</button>' +
      '<button class="preset-btn" id="p-animals">Animals on Earth</button>';
    document.getElementById("p-empty").onclick = function(){ setActivePreset(this); mode="empty"; App.resetTimeline(); };
    document.getElementById("p-evenp").onclick = function(){ setActivePreset(this); mode="evenp"; App.resetTimeline(); };
    document.getElementById("p-primes").onclick = function(){ setActivePreset(this); mode="primes"; App.resetTimeline(); };
    document.getElementById("p-animals").onclick = function(){ setActivePreset(this); mode="animals"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var info = {
      empty: {title:"B = students in Class X and XI now", roster:"φ = { }", tag:"FINITE (empty)", col:"#34d399", note:"Definition 1 + 2: empty is finite. Nobody is enrolled in both classes presently."},
      evenp: {title:"Even prime numbers", roster:"{ 2 }", tag:"FINITE (singleton)", col:"#34d399", note:"Ex 1.2.1(ii) is NOT null. The set of even primes > 2 is empty."},
      primes: {title:"{x ∈ N : x is prime}", roster:"{2, 3, 5, 7, …}", tag:"INFINITE", col:"#f87171", note:"Example 6(iv). Euclid: no last prime. Dots in roster are allowed because the pattern is clear."},
      animals: {title:"Animals living on the Earth", roster:"a huge definite list", tag:"FINITE", col:"#34d399", note:"Ex 1.2.3(iv): unknown n(S), but n(S) is some natural number at a frozen instant."}
    }[mode];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="160" y="80" width="400" height="140" rx="16" fill="#0f2744" stroke="' + info.col + '" stroke-width="3"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">' + info.title + '</text>';
    m += '<text x="360" y="140" fill="#f8fafc" font-size="22" text-anchor="middle">' + info.roster + '</text>';
    m += '<text x="360" y="200" fill="' + info.col + '" font-size="16" text-anchor="middle">' + info.tag + '</text>';
    svg.innerHTML = m;
    readout(cell("Classifier", info.tag, info.col) + cell("Empty?", mode==="empty"?"YES":"NO"));
    verdict("<b>Verdict:</b> " + info.note);
  }
  return {mount:mount, draw:draw};
})();

window.SIMS.equalsets = (function(){
  var mode = "alloy";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Equal</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Unequal</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-alloy">ALLOY vs LOYAL</button>' +
      '<button class="preset-btn" id="p-quad">n² ≤ 4 vs x²−3x+2=0</button>' +
      '<button class="preset-btn" id="p-follow">FOLLOW vs WOLF</button>';
    document.getElementById("p-alloy").onclick = function(){ setActivePreset(this); mode="alloy"; App.resetTimeline(); };
    document.getElementById("p-quad").onclick = function(){ setActivePreset(this); mode="quad"; App.resetTimeline(); };
    document.getElementById("p-follow").onclick = function(){ setActivePreset(this); mode="follow"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var P = {
      alloy: {A:"{A, L, O, Y}", B:"{A, L, O, Y}", eq:true, note:"Example 8(i): repeats of L dropped. Equal letter-sets."},
      quad: {A:"{−2, −1, 0, 1, 2}", B:"{1, 2}", eq:false, note:"Example 8(ii): 0 ∈ A but 0 ∉ B. Same-looking builders can hide extra integers."},
      follow: {A:"{F, O, L, W}", B:"{W, O, L, F}", eq:true, note:"Ex 1.2.5(ii): order does not matter."}
    }[mode];
    var col = P.eq ? "#34d399" : "#f87171";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<circle cx="240" cy="150" r="90" fill="#38bdf822" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="480" cy="150" r="90" fill="#f59e0b22" stroke="#f59e0b" stroke-width="2"/>';
    m += '<text x="240" y="150" fill="#f8fafc" font-size="14" text-anchor="middle">A = '+P.A+'</text>';
    m += '<text x="480" y="150" fill="#f8fafc" font-size="14" text-anchor="middle">B = '+P.B+'</text>';
    m += '<text x="360" y="40" fill="'+col+'" font-size="18" text-anchor="middle">'+(P.eq?"A = B":"A ≠ B")+'</text>';
    svg.innerHTML = m;
    readout(cell("A", P.A) + cell("B", P.B) + cell("Equal?", P.eq?"YES":"NO", col));
    verdict("<b>Definition 3:</b> " + P.note);
  }
  return {mount:mount, draw:draw};
})();

window.SIMS.intervals = (function(){
  var mode = "open";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Included endpoint (filled)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#09131d;border:2px solid #f59e0b;"></span><span>Excluded endpoint (open)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-open">(−4, 6]  Ex 1.3.5(i)</button>' +
      '<button class="preset-btn" id="p-closed">[6, 12]</button>' +
      '<button class="preset-btn" id="p-ray">[0, ∞)</button>';
    document.getElementById("p-open").onclick = function(){ setActivePreset(this); mode="open"; App.resetTimeline(); };
    document.getElementById("p-closed").onclick = function(){ setActivePreset(this); mode="closed"; App.resetTimeline(); };
    document.getElementById("p-ray").onclick = function(){ setActivePreset(this); mode="ray"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function X(x){ return 80 + (x+8)*30; }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<line x1="40" y1="160" x2="680" y2="160" stroke="#475569" stroke-width="3"/>';
    for(var k=-6;k<=12;k++){
      m += '<line x1="'+X(k)+'" y1="154" x2="'+X(k)+'" y2="166" stroke="#64748b"/>';
      if(k%2===0) m += '<text x="'+X(k)+'" y="186" fill="#94a3b8" font-size="11" text-anchor="middle">'+k+'</text>';
    }
    var a,b,la,lb,len,label;
    if(mode==="open"){ a=-4; b=6; la=false; lb=true; len=10; label="(−4, 6] = {x ∈ R : −4 < x ≤ 6}"; }
    else if(mode==="closed"){ a=6; b=12; la=true; lb=true; len=6; label="[6, 12] = {x ∈ R : 6 ≤ x ≤ 12}"; }
    else { a=0; b=14; la=true; lb=false; len="∞"; label="[0, ∞) non-negative reals"; }
    var x1=X(a), x2=X(Math.min(b,14));
    m += '<line x1="'+x1+'" y1="160" x2="'+x2+'" y2="160" stroke="#38bdf8" stroke-width="8"/>';
    m += '<circle cx="'+x1+'" cy="160" r="8" fill="'+(la?"#38bdf8":"#09131d")+'" stroke="#f59e0b" stroke-width="3"/>';
    m += '<circle cx="'+x2+'" cy="160" r="8" fill="'+(lb?"#38bdf8":"#09131d")+'" stroke="#f59e0b" stroke-width="3"/>';
    var pulse = 8+4*Math.sin((t||0)*2);
    m += '<circle cx="'+ (x1 + (x2-x1)*0.4) +'" cy="160" r="'+pulse+'" fill="#34d399"/>';
    m += '<text x="360" y="40" fill="#94a3b8" font-size="15" text-anchor="middle">'+label+'</text>';
    m += '<text x="360" y="64" fill="#64748b" font-size="12" text-anchor="middle">length = b − a'+(mode==="ray"?"":" = "+len)+' · infinitely many points</text>';
    svg.innerHTML = m;
    readout(cell("Interval", label.split("=")[0].trim()) + cell("Length", String(len)) + cell("Finite set?", "NO — infinite", "#f59e0b"));
    verdict("<b>§1.6.2:</b> finite length is not a finite set. Endpoints: filled = included, hollow = excluded. Fig 1.1.");
  }
  return {mount:mount, draw:draw};
})();

window.SIMS.vennops = (function(){
  var mode = "union";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A = {2,4,6,8}</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>B = {6,8,10,12}</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-u">A ∪ B (Fig 1.4)</button>' +
      '<button class="preset-btn" id="p-i">A ∩ B (Fig 1.5)</button>' +
      '<button class="preset-btn" id="p-d">A − B (Fig 1.8)</button>' +
      '<button class="preset-btn" id="p-dj">Disjoint (Fig 1.6)</button>';
    document.getElementById("p-u").onclick = function(){ setActivePreset(this); mode="union"; App.resetTimeline(); };
    document.getElementById("p-i").onclick = function(){ setActivePreset(this); mode="inter"; App.resetTimeline(); };
    document.getElementById("p-d").onclick = function(){ setActivePreset(this); mode="diff"; App.resetTimeline(); };
    document.getElementById("p-dj").onclick = function(){ setActivePreset(this); mode="disj"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="none" stroke="#475569"/>';
    m += '<text x="60" y="52" fill="#94a3b8" font-size="12">U</text>';
    var ax=300, ay=150, bx=420, by=150, r=80;
    if(mode==="disj"){ ax=260; bx=470; }
    var fillA = (mode==="union"||mode==="diff"||mode==="disj") ? "#38bdf844" : "#38bdf811";
    var fillB = (mode==="union"||mode==="disj") ? "#f59e0b44" : "#f59e0b11";
    m += '<circle cx="'+ax+'" cy="'+ay+'" r="'+r+'" fill="'+fillA+'" stroke="#38bdf8" stroke-width="2"/>';
    m += '<circle cx="'+bx+'" cy="'+by+'" r="'+r+'" fill="'+fillB+'" stroke="#f59e0b" stroke-width="2"/>';
    if(mode==="inter"){
      m += '<text x="360" y="155" fill="#34d399" font-size="14" text-anchor="middle">6, 8</text>';
    }
    m += '<text x="'+ (ax-40) +'" y="100" fill="#38bdf8" font-size="14">A</text>';
    m += '<text x="'+ (bx+28) +'" y="100" fill="#f59e0b" font-size="14">B</text>';
    var notes = {
      union: "Example 12: A ∪ B = {2,4,6,8,10,12}. Commons 6,8 listed once.",
      inter: "Example 15: A ∩ B = {6,8}. B ⊂ A would force A ∩ B = B.",
      diff: "Example 18 style: A − B = {2,4}. Crescent of A. Not equal to B − A.",
      disj: "Fig 1.6: A ∩ B = φ. Even and odd integers (Ex 1.4.8(iii))."
    };
    var val = {union:"{2,4,6,8,10,12}", inter:"{6,8}", diff:"{2,4}", disj:"φ"}[mode];
    svg.innerHTML = m;
    readout(cell("Operation", mode) + cell("Result", val, "#34d399"));
    verdict("<b>Venn:</b> " + notes[mode]);
  }
  return {mount:mount, draw:draw};
})();

window.SIMS.demorgan = (function(){
  var mode = "unioncomp";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Shaded = the named set</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-uc">(A ∪ B)′</button>' +
      '<button class="preset-btn" id="p-ai">A′ ∩ B′</button>' +
      '<button class="preset-btn" id="p-ic">(A ∩ B)′</button>' +
      '<button class="preset-btn" id="p-au">A′ ∪ B′</button>';
    document.getElementById("p-uc").onclick = function(){ setActivePreset(this); mode="unioncomp"; App.resetTimeline(); };
    document.getElementById("p-ai").onclick = function(){ setActivePreset(this); mode="ainter"; App.resetTimeline(); };
    document.getElementById("p-ic").onclick = function(){ setActivePreset(this); mode="intercomp"; App.resetTimeline(); };
    document.getElementById("p-au").onclick = function(){ setActivePreset(this); mode="aunion"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var pair = (mode==="unioncomp"||mode==="ainter");
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<rect x="80" y="40" width="560" height="220" rx="6" fill="'+(pair?"#34d39933":"#34d39922")+'" stroke="#475569"/>';
    m += '<text x="100" y="62" fill="#94a3b8" font-size="12">U</text>';
    var ax=300, bx=420, ay=150, r=78;
    if(pair){
      m += '<circle cx="'+ax+'" cy="'+ay+'" r="'+r+'" fill="#09131d" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="'+bx+'" cy="'+ay+'" r="'+r+'" fill="#09131d" stroke="#f59e0b" stroke-width="2"/>';
    } else {
      m += '<circle cx="'+ax+'" cy="'+ay+'" r="'+r+'" fill="#34d39944" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="'+bx+'" cy="'+ay+'" r="'+r+'" fill="#34d39944" stroke="#f59e0b" stroke-width="2"/>';
      m += '<circle cx="360" cy="150" r="40" fill="#09131d" stroke="none"/>';
    }
    m += '<text x="240" y="100" fill="#38bdf8" font-size="14">A</text>';
    m += '<text x="470" y="100" fill="#f59e0b" font-size="14">B</text>';
    var title = {unioncomp:"(A ∪ B)′", ainter:"A′ ∩ B′", intercomp:"(A ∩ B)′", aunion:"A′ ∪ B′"}[mode];
    svg.innerHTML = m;
    readout(cell("Law", title) + cell("De Morgan pair", pair ? "(A ∪ B)′ = A′ ∩ B′" : "(A ∩ B)′ = A′ ∪ B′", "#34d399"));
    verdict("<b>Example 22 / Ex 1.5.4:</b> the two left presets shade the same region; the two right presets shade the same region. Switch presets and watch the shading agree.");
  }
  return {mount:mount, draw:draw};
})();

window.SIMS.algebra = (function(){
  var mode = "abs";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>B or C</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-abs">Absorption A ∪ (A ∩ B)</button>' +
      '<button class="preset-btn" id="p-q8">Misc 8: A∩B=A∩C ⇏ B=C</button>' +
      '<button class="preset-btn" id="p-q10">Misc 10: pairwise ≠ triple</button>';
    document.getElementById("p-abs").onclick = function(){ setActivePreset(this); mode="abs"; App.resetTimeline(); };
    document.getElementById("p-q8").onclick = function(){ setActivePreset(this); mode="q8"; App.resetTimeline(); };
    document.getElementById("p-q10").onclick = function(){ setActivePreset(this); mode="q10"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="abs"){
      m += '<circle cx="300" cy="150" r="90" fill="#38bdf844" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="400" cy="150" r="70" fill="#f59e0b33" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="250" y="80" fill="#38bdf8">A</text><text x="450" y="90" fill="#f59e0b">B</text>';
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">A ∪ (A ∩ B) paints exactly A</text>';
      readout(cell("Identity", "A ∪ (A ∩ B) = A") + cell("Also", "A ∩ (A ∪ B) = A"));
      verdict("<b>Misc. Ex 7:</b> A ∩ B sits inside A, so union with A cannot grow. Absorption.");
    } else if(mode==="q8"){
      m += '<text x="360" y="50" fill="#94a3b8" font-size="14" text-anchor="middle">A={1,2}  B={1,3}  C={1,4}</text>';
      m += '<rect x="80" y="90" width="160" height="120" rx="8" fill="#38bdf822" stroke="#38bdf8"/>';
      m += '<rect x="280" y="90" width="160" height="120" rx="8" fill="#f59e0b22" stroke="#f59e0b"/>';
      m += '<rect x="480" y="90" width="160" height="120" rx="8" fill="#34d39922" stroke="#34d399"/>';
      m += '<text x="160" y="155" fill="#f8fafc" text-anchor="middle">A {1,2}</text>';
      m += '<text x="360" y="155" fill="#f8fafc" text-anchor="middle">B {1,3}</text>';
      m += '<text x="560" y="155" fill="#f8fafc" text-anchor="middle">C {1,4}</text>';
      readout(cell("A ∩ B", "{1}") + cell("A ∩ C", "{1}") + cell("B = C?", "NO", "#f87171"));
      verdict("<b>Misc. Ex 8:</b> equal intersections with a fixed A hide the parts of B and C that live outside A.");
    } else {
      m += '<circle cx="300" cy="140" r="70" fill="#38bdf833" stroke="#38bdf8"/>';
      m += '<circle cx="420" cy="140" r="70" fill="#f59e0b33" stroke="#f59e0b"/>';
      m += '<circle cx="360" cy="210" r="70" fill="#34d39933" stroke="#34d399"/>';
      m += '<text x="250" y="100" fill="#38bdf8">A</text><text x="460" y="100" fill="#f59e0b">B</text><text x="400" y="255" fill="#34d399">C</text>';
      m += '<text x="360" y="36" fill="#94a3b8" font-size="13" text-anchor="middle">A={1,2} B={2,3} C={3,1} — lenses non-empty, centre empty</text>';
      readout(cell("A ∩ B", "{2}") + cell("B ∩ C", "{3}") + cell("A ∩ C", "{1}") + cell("A ∩ B ∩ C", "φ", "#f87171"));
      verdict("<b>Misc. Ex 10:</b> pairwise overlap without a common triple. This reprint has no n(A∪B∪C) section; the witness still lives here.");
    }
    svg.innerHTML = m;
  }
  return {mount:mount, draw:draw};
})();
