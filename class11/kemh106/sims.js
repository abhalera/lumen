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
function fact(n){ var p=1; for(var i=2;i<=n;i++) p*=i; return p; }
function P(n,r){ if(r<0||r>n) return 0; var p=1; for(var i=0;i<r;i++) p*=(n-i); return p; }
function C(n,r){ if(r<0||r>n) return 0; r=Math.min(r,n-r); var p=1; for(var i=1;i<=r;i++) p=p*(n-r+i)/i; return Math.round(p); }

window.SIMS.suitcase = (function(){
  var repeat = false;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Fixed 7</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Free wheels</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-norep" id="p-norep">Suitcase: no repetition</button>' +
      '<button class="preset-btn" data-preset="p-upi" id="p-upi">UPI PIN: repetition allowed</button>';
    document.getElementById("p-norep").onclick = function(){ setActivePreset(this); repeat=false; App.resetTimeline(); App.play(); };
    document.getElementById("p-upi").onclick = function(){ setActivePreset(this); repeat=true; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var digits = repeat
      ? [7, Math.floor(t*1.7)%10, Math.floor(t*2.3)%10, Math.floor(t*3.1)%10]
      : [7, (8+Math.floor(t))%9, (6+Math.floor(t*1.4))%9, (4+Math.floor(t*1.9))%9];
    m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">'+(repeat?"UPI PIN 4 digits, repetition ON · 10⁴ = 10,000":"Suitcase · first digit 7 · no repetition · 9×8×7 = 504")+'</text>';
    for(var i=0;i<4;i++){
      var x=80+i*160;
      m += '<rect x="'+x+'" y="80" width="120" height="140" rx="16" fill="#0f172a" stroke="'+(i===0?"#38bdf8":"#f59e0b")+'" stroke-width="3"/>';
      m += '<text x="'+(x+60)+'" y="165" fill="#f8fafc" font-size="48" text-anchor="middle">'+digits[i]+'</text>';
    }
    svg.innerHTML = m;
    var n = repeat ? 10000 : 504;
    readout(cell("rule", repeat?"repeat OK":"no repeat") + cell("count", String(n), "#34d399") + cell("first digit", "7"));
    verdict(repeat
      ? "<b>Indian Connect:</b> a 4-digit UPI PIN is 10⁴ = 10,000. The suitcase intro forbids repetition."
      : "<b>§6.1:</b> wheels 2,3,4 choose from 9, then 8, then 7 leftover digits. Listing 504 codes is why we need counting.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["pants-shirts"] = (function(){
  var mode = "mohan";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Choice 1</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Choice 2</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-m" id="p-m">Mohan 3×2 = 6</button>' +
      '<button class="preset-btn" data-preset="p-s" id="p-s">Sabnam 2×3×2 = 12</button>' +
      '<button class="preset-btn" data-preset="p-r" id="p-r">ROSE 4! = 24</button>';
    document.getElementById("p-m").onclick = function(){ setActivePreset(this); mode="mohan"; App.resetTimeline(); App.play(); };
    document.getElementById("p-s").onclick = function(){ setActivePreset(this); mode="sabnam"; App.resetTimeline(); App.play(); };
    document.getElementById("p-r").onclick = function(){ setActivePreset(this); mode="rose"; App.resetTimeline(); App.play(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="mohan"){
      var k = Math.floor(t*6/6)%6;
      var pairs=[["P1","S1"],["P1","S2"],["P2","S1"],["P2","S2"],["P3","S1"],["P3","S2"]];
      m += '<text x="360" y="36" fill="#94a3b8" font-size="14" text-anchor="middle">Fig 6.1 · 3 pants × 2 shirts = 6 outfits</text>';
      pairs.forEach(function(p,i){
        m += '<rect x="'+(30+i*115)+'" y="80" width="100" height="140" rx="10" fill="'+(i===k?"#0f766e":"#1e293b")+'" stroke="#38bdf8"/>';
        m += '<text x="'+(80+i*115)+'" y="160" fill="#f8fafc" font-size="16" text-anchor="middle">'+p[0]+'·'+p[1]+'</text>';
      });
      readout(cell("outfits","6") + cell("showing", pairs[k][0]+" + "+pairs[k][1]));
      verdict("<b>FPC:</b> a pant in 3 ways, then a shirt in 2 ways, succession 3×2=6.");
    } else if(mode==="sabnam"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Fig 6.2 · 2 bags × 3 tiffins × 2 bottles = 12</text>';
      m += '<text x="360" y="150" fill="#e2e8f0" font-size="28" text-anchor="middle">2 × 3 × 2 = 12</text>';
      m += '<text x="360" y="200" fill="#94a3b8" font-size="14" text-anchor="middle">B1/B2 · T1/T2/T3 · W1/W2</text>';
      readout(cell("bag","2") + cell("tiffin","3") + cell("bottle","2") + cell("total","12"));
      verdict("<b>Three events:</b> m×n×p. Same arithmetic as 2 papers × 3 cities × 2 JEE sessions.");
    } else {
      var letters=["R","O","S","E"];
      var idx=Math.floor(t*4)%4;
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Example 1 · ROSE, no repetition · 4×3×2×1 = 24</text>';
      letters.forEach(function(L,i){
        m += '<rect x="'+(80+i*150)+'" y="90" width="120" height="120" rx="12" fill="'+(i<=idx?"#38bdf8":"#1e293b")+'"/>';
        m += '<text x="'+(140+i*150)+'" y="165" fill="#0f172a" font-size="36" text-anchor="middle">'+L+'</text>';
      });
      readout(cell("no repeat","24") + cell("with repeat","256 = 4⁴"));
      verdict("<b>Note after Example 1:</b> if repetition is allowed, 4⁴=256 words.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["npr-calc"] = (function(){
  var n=6, r=3;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>n slots of objects</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-num" id="p-num">NUMBER 6P3=120</button>' +
      '<button class="preset-btn" data-preset="p-ch" id="p-ch">12P2 chairman=132</button>' +
      '<button class="preset-btn" data-preset="p-rep" id="p-rep">Theorem 2: n^r</button>';
    document.getElementById("p-num").onclick = function(){ setActivePreset(this); n=6;r=3; App.resetTimeline(); };
    document.getElementById("p-ch").onclick = function(){ setActivePreset(this); n=12;r=2; App.resetTimeline(); };
    document.getElementById("p-rep").onclick = function(){ setActivePreset(this); n=4;r=4; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>n</span><span class="val" id="ctrl-n">6</span></div>' +
      '<input type="range" id="ctrl-n-range" min="1" max="12" step="1" value="6"></div>' +
      '<div class="control-item"><div class="control-label"><span>r</span><span class="val" id="ctrl-r">3</span></div>' +
      '<input type="range" id="ctrl-r-range" min="0" max="12" step="1" value="3"></div>';
    document.getElementById("ctrl-n-range").oninput = function(){ n=Number(this.value); draw(); };
    document.getElementById("ctrl-r-range").oninput = function(){ r=Number(this.value); draw(); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var nn=document.getElementById("ctrl-n"); if(nn) nn.textContent=String(n);
    var rr=document.getElementById("ctrl-r"); if(rr) rr.textContent=String(r);
    var nr = document.getElementById("ctrl-n-range"); if(nr) n=Number(nr.value);
    var rrg = document.getElementById("ctrl-r-range"); if(rrg) r=Number(rrg.value);
    var pr = P(n,r), rep = Math.pow(n,r);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="50" fill="#94a3b8" font-size="16" text-anchor="middle">ⁿPᵣ = n! / (n−r)!   (no repetition)</text>';
    m += '<text x="360" y="130" fill="#38bdf8" font-size="36" text-anchor="middle">'+n+'P'+r+' = '+pr+'</text>';
    m += '<text x="360" y="190" fill="#f59e0b" font-size="20" text-anchor="middle">with repetition: nʳ = '+rep+'</text>';
    m += '<text x="360" y="250" fill="#94a3b8" font-size="13" text-anchor="middle">0! = 1 ·  nP0 = 1 ·  nPn = n!</text>';
    svg.innerHTML = m;
    readout(cell("nPr", String(pr)) + cell("n^r", String(rep)) + cell("n!", n<=12?String(fact(n)):"big"));
    verdict("<b>Theorem 1 & 2.</b> NUMBER taken 3 at a time: 6P3=120; with repetition 6³=216. Chairman+VC from 12: 12P2=132.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["root-word"] = (function(){
  var word = "ROOT";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Distinct permutations</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-root" id="p-root">ROOT 4!/2! = 12</button>' +
      '<button class="preset-btn" data-preset="p-all" id="p-all">ALLAHABAD 7560</button>' +
      '<button class="preset-btn" data-preset="p-ind" id="p-ind">INDEPENDENCE 1663200</button>';
    document.getElementById("p-root").onclick = function(){ setActivePreset(this); word="ROOT"; App.resetTimeline(); };
    document.getElementById("p-all").onclick = function(){ setActivePreset(this); word="ALLAHABAD"; App.resetTimeline(); };
    document.getElementById("p-ind").onclick = function(){ setActivePreset(this); word="INDEPENDENCE"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var info = {
      ROOT:{n:12, why:"4!/2! (two O's)"},
      ALLAHABAD:{n:7560, why:"9!/(4! 2!)  ·  4 A's, 2 L's"},
      INDEPENDENCE:{n:1663200, why:"12!/(3! 4! 2!)  ·  N×3, E×4, D×2"}
    }[word];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="70" fill="#94a3b8" font-size="14" text-anchor="middle">Theorem 4 · n! / (p₁! p₂! … pₖ!)</text>';
    m += '<text x="360" y="140" fill="#e2e8f0" font-size="32" text-anchor="middle">'+word+'</text>';
    m += '<text x="360" y="200" fill="#38bdf8" font-size="22" text-anchor="middle">'+info.n.toLocaleString("en-IN")+' arrangements</text>';
    svg.innerHTML = m;
    readout(cell("word", word) + cell("count", String(info.n)) + cell("formula", info.why));
    verdict("<b>"+info.why+"</b>. Treat repeats as identical: divide the n! ‘all distinct’ count by each p!.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["vowels-together"] = (function(){
  var mode="together";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Glued vowels AUE</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-tog" id="p-tog">DAUGHTER vowels together</button>' +
      '<button class="preset-btn" data-preset="p-nev" id="p-nev">Never together</button>' +
      '<button class="preset-btn" data-preset="p-gap" id="p-gap">5 girls + 3 boys, gaps</button>';
    document.getElementById("p-tog").onclick = function(){ setActivePreset(this); mode="together"; App.resetTimeline(); };
    document.getElementById("p-nev").onclick = function(){ setActivePreset(this); mode="never"; App.resetTimeline(); };
    document.getElementById("p-gap").onclick = function(){ setActivePreset(this); mode="gap"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML = "";
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="together"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Example 14(i) · glue AUE · 6! × 3! = 4320</text>';
      m += '<rect x="40" y="90" width="220" height="100" rx="12" fill="#f59e0b"/>';
      m += '<text x="150" y="150" fill="#0f172a" font-size="22" text-anchor="middle">[A U E]</text>';
      ["D","G","H","T","R"].forEach(function(L,i){
        m += '<rect x="'+(280+i*80)+'" y="100" width="70" height="80" rx="8" fill="#38bdf8"/>';
        m += '<text x="'+(315+i*80)+'" y="150" fill="#0f172a" font-size="20" text-anchor="middle">'+L+'</text>';
      });
      readout(cell("objects","6") + cell("× vowel perm","3!") + cell("count","4320"));
      verdict("<b>Glue then permute the glue.</b> 6 objects including the vowel-block: 6!; inside the block 3!.");
    } else if(mode==="never"){
      m += '<text x="360" y="80" fill="#94a3b8" font-size="16" text-anchor="middle">Never together = total − together</text>';
      m += '<text x="360" y="160" fill="#e2e8f0" font-size="26" text-anchor="middle">8! − 6!×3! = 40320 − 4320 = 36000</text>';
      readout(cell("8!", "40320") + cell("together","4320") + cell("never","36000"));
      verdict("<b>Example 14(ii).</b> ‘Never together’ is the complement of ‘all together’, not the gap method.");
    } else {
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Example 24 · seat 5 girls, 6 gaps, 3 boys · 5! × ⁶P₃ = 14400</text>';
      var gaps=["×","G","×","G","×","G","×","G","×","G","×"];
      gaps.forEach(function(g,i){
        m += '<rect x="'+(30+i*62)+'" y="110" width="54" height="70" rx="8" fill="'+(g==="×"?"#1e293b":"#0f766e")+'" stroke="#38bdf8"/>';
        m += '<text x="'+(57+i*62)+'" y="155" fill="#f8fafc" font-size="16" text-anchor="middle">'+g+'</text>';
      });
      readout(cell("girl perms","5!=120") + cell("boy gaps","6P3=120") + cell("product","14400"));
      verdict("<b>No two boys together</b> is stricter than ‘not all boys together’. Use gaps.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["ncr-lab"] = (function(){
  var n=12, r=2;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>combination nCr</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>permutation nPr</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-hs" id="p-hs">12 handshakes 12C2</button>' +
      '<button class="preset-btn" data-preset="p-ch" id="p-ch">7 chords 7C2</button>' +
      '<button class="preset-btn" data-preset="p-card" id="p-card">52C4 cards</button>';
    document.getElementById("p-hs").onclick = function(){ setActivePreset(this); n=12;r=2; App.resetTimeline(); };
    document.getElementById("p-ch").onclick = function(){ setActivePreset(this); n=7;r=2; App.resetTimeline(); };
    document.getElementById("p-card").onclick = function(){ setActivePreset(this); n=52;r=4; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>n</span><span class="val" id="cn">12</span></div>' +
      '<input type="range" id="cn-range" min="2" max="20" step="1" value="12"></div>' +
      '<div class="control-item"><div class="control-label"><span>r</span><span class="val" id="cr">2</span></div>' +
      '<input type="range" id="cr-range" min="0" max="10" step="1" value="2"></div>';
    document.getElementById("cn-range").oninput = function(){ n=Number(this.value); draw(); };
    document.getElementById("cr-range").oninput = function(){ r=Number(this.value); draw(); };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var nr=document.getElementById("cn-range"); if(nr) n=Number(nr.value);
    var rr=document.getElementById("cr-range"); if(rr) r=Number(rr.value);
    var a=document.getElementById("cn"); if(a) a.textContent=String(n);
    var b=document.getElementById("cr"); if(b) b.textContent=String(r);
    var cc=C(n,r), pp=P(n,r);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="50" fill="#94a3b8" font-size="15" text-anchor="middle">ⁿCᵣ = ⁿPᵣ / r!   ·   handshake = nC2, not nP2</text>';
    m += '<text x="220" y="150" fill="#38bdf8" font-size="28" text-anchor="middle">nCr = '+cc+'</text>';
    m += '<text x="500" y="150" fill="#f59e0b" font-size="28" text-anchor="middle">nPr = '+pp+'</text>';
    m += '<text x="360" y="220" fill="#94a3b8" font-size="14" text-anchor="middle">nCr = nC(n−r) · Pascal: nCr + nC(r−1) = (n+1)Cr</text>';
    svg.innerHTML = m;
    readout(cell("nCr", String(cc)) + cell("nPr", String(pp)) + cell("nPr / r!", r<=8?String(pp/fact(r)):"—"));
    verdict("<b>Theorem 5.</b> XY and YX are one handshake. 12 people: 12C2=66 shakes. 52C4=270725 (Example 19).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["ipl-squad"] = (function(){
  var bowlers=4;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Bowlers (5 available)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Others (12)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-4" id="p-4">Ex 6.4 Q7: exactly 4 bowlers</button>' +
      '<button class="preset-btn" data-preset="p-21" id="p-21">Ex 21: 4G+7B team of 5</button>';
    document.getElementById("p-4").onclick = function(){ setActivePreset(this); mode="bowl"; App.resetTimeline(); };
    document.getElementById("p-21").onclick = function(){ setActivePreset(this); mode="team"; App.resetTimeline(); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>bowlers in XI</span><span class="val" id="cb">4</span></div>' +
      '<input type="range" id="cb-range" min="0" max="5" step="1" value="4"></div>';
    document.getElementById("cb-range").oninput = function(){ bowlers=Number(this.value); draw(); };
    draw(0);
  }
  var mode="bowl";
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var rg=document.getElementById("cb-range"); if(rg) bowlers=Number(rg.value);
    var lb=document.getElementById("cb"); if(lb) lb.textContent=String(bowlers);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="bowl"){
      var others=11-bowlers;
      var ways = (others>=0 && others<=12) ? C(5,bowlers)*C(12,others) : 0;
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">IPL-style XI from 17 (5 can bowl) · ⁵Cₖ × ¹²C₁₁₋ₖ</text>';
      for(var i=0;i<11;i++){
        m += '<circle cx="'+(60+i*55)+'" cy="140" r="20" fill="'+(i<bowlers?"#f59e0b":"#38bdf8")+'"/>';
      }
      m += '<text x="360" y="210" fill="#e2e8f0" font-size="18" text-anchor="middle">ways = '+ways.toLocaleString("en-IN")+'</text>';
      readout(cell("bowlers k", String(bowlers)) + cell("others", String(others)) + cell("⁵Cₖ×¹²C₁₁₋ₖ", String(ways)));
      verdict("<b>Q7:</b> exactly 4 bowlers → 5C4×12C7=5×792=3960. The slider is the same partition as Example 21.");
    } else {
      var tot=C(11,5), nogirl=C(7,5), ways=tot-nogirl;
      m += '<text x="360" y="50" fill="#94a3b8" font-size="14" text-anchor="middle">Example 21(ii) · at least one girl and one boy</text>';
      m += '<text x="360" y="140" fill="#e2e8f0" font-size="22" text-anchor="middle">11C5 − 7C5 = 462 − 21 = 441</text>';
      m += '<text x="360" y="190" fill="#94a3b8" font-size="14" text-anchor="middle">or 7+84+210+140 by cases</text>';
      readout(cell("total 11C5","462") + cell("no girl","21") + cell("at least one each","441"));
      verdict("<b>Complement:</b> 4C5=0 so ‘no boy’ is impossible. 462−21=441 matches the four-term sum.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["course-pick"] = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Compulsory (2)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Free choice from 7</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" data-preset="p-c" id="p-c">5 courses, 2 compulsory</button>' +
      '<button class="preset-btn" data-preset="p-n" id="p-n">NEET 8 Qs, ≥3 from each part</button>';
    var mode="c";
    document.getElementById("p-c").onclick = function(){ setActivePreset(this); mode="c"; draw(); };
    document.getElementById("p-n").onclick = function(){ setActivePreset(this); mode="n"; draw(); };
    document.getElementById("lab-controls").innerHTML = "";
    window._cpMode = function(){ return mode; };
    draw(0);
  }
  function draw(){
    var svg = svgEl(); if(!svg) return;
    var mode = (window._cpMode && window._cpMode()) || "c";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(mode==="c"){
      m += '<text x="360" y="40" fill="#94a3b8" font-size="14" text-anchor="middle">Ex 6.4 Q9 · 2 compulsory + 3 from 7 remaining = ⁷C₃ = 35</text>';
      for(var i=0;i<9;i++){
        var forced=i<2;
        m += '<rect x="'+(40+i*75)+'" y="100" width="65" height="80" rx="8" fill="'+(forced?"#f59e0b":"#1e293b")+'" stroke="#38bdf8"/>';
        m += '<text x="'+(72+i*75)+'" y="148" fill="#f8fafc" font-size="12" text-anchor="middle">'+(forced?"MUST":"C"+(i+1))+'</text>';
      }
      readout(cell("compulsory","2") + cell("free slots","3") + cell("7C3","35"));
      verdict("<b>35 programmes.</b> 9C5=126 would ignore the two forced courses — a standard trap.");
    } else {
      m += '<text x="360" y="50" fill="#94a3b8" font-size="14" text-anchor="middle">Misc Q7 · Part I (5) + Part II (7) · choose 8, ≥3 from each</text>';
      m += '<text x="360" y="130" fill="#e2e8f0" font-size="16" text-anchor="middle">(3,5): 210   (4,4): 175   (5,3): 35</text>';
      m += '<text x="360" y="180" fill="#34d399" font-size="22" text-anchor="middle">total 420</text>';
      readout(cell("(3,5)","210") + cell("(4,4)","175") + cell("(5,3)","35") + cell("sum","420"));
      verdict("<b>Partition ‘at least 3 from each’.</b> Same case-split as Example 21’s girls-and-boys teams.");
    }
    svg.innerHTML = m;
  }
  return { mount: mount, draw: draw };
})();
