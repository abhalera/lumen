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
function numEl(id, fallback){
  var n = document.getElementById(id);
  return n ? Number(n.value) : fallback;
}

window.SIMS["dna-structure-packaging"] = (function(){
  var mode = "chargaff";
  var pairs = ["AT", "GC", "AT", "GC", "AT", "GC"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>A=T (2 H-bonds)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>G-triple-C (3 H-bonds)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Sugar-phosphate backbone</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-chg">Ex 2: Chargaff check</button>' +
      '<button class="preset-btn" id="p-ex3">Ex 3: 28-nt complement</button>' +
      '<button class="preset-btn" id="p-pack">Packaging: 2.2 m -&gt; nucleus</button>';
    document.getElementById("p-chg").onclick = function(){ setActivePreset(this); mode = "chargaff"; draw(App.state.t); };
    document.getElementById("p-ex3").onclick = function(){ setActivePreset(this); mode = "complement"; draw(App.state.t); };
    document.getElementById("p-pack").onclick = function(){ setActivePreset(this); mode = "pack"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>%C in dsDNA</span><span class="val" id="ctrl-c">20</span></div>' +
      '<input type="range" id="ctrl-c-range" min="0" max="50" step="1" value="20"></div>' +
      '<div class="control-item"><div class="control-label"><span>Builder pairs</span><span class="val">AT / GC</span></div>' +
      '<div><button class="preset-btn" id="b-at">+ A=T</button> ' +
      '<button class="preset-btn" id="b-gc">+ G-triple-C</button> ' +
      '<button class="preset-btn" id="b-rs">Reset</button></div></div>';
    document.getElementById("ctrl-c-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("b-at").onclick = function(){ if(pairs.length < 10) pairs.push("AT"); draw(App.state.t); };
    document.getElementById("b-gc").onclick = function(){ if(pairs.length < 10) pairs.push("GC"); draw(App.state.t); };
    document.getElementById("b-rs").onclick = function(){ pairs = ["AT", "GC", "AT", "GC", "AT", "GC"]; draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var cPct = numEl("ctrl-c-range", 20);
    var el = document.getElementById("ctrl-c"); if(el) el.textContent = cPct;
    var gPct = cPct;
    var aPct = (100 - 2 * cPct) / 2;
    var tPct = aPct;
    var nAT = 0, nGC = 0, i;
    for(i = 0; i < pairs.length; i++){ if(pairs[i] === "AT") nAT++; else nGC++; }
    var ok = (nAT >= 0 && nGC >= 0);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Double helix: antiparallel 5-3 / 3-5, pitch 3.4 nm = 10 bp x 0.34 nm</text>';
    var x0 = 90, y0 = 50, rh = 200;
    m += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + (y0 + rh) + '" stroke="#34d399" stroke-width="5"/>';
    m += '<line x1="' + (x0 + 120) + '" y1="' + y0 + '" x2="' + (x0 + 120) + '" y2="' + (y0 + rh) + '" stroke="#34d399" stroke-width="5"/>';
    m += '<text x="' + (x0 - 8) + '" y="' + (y0 - 6) + '" fill="#34d399" font-size="11">5</text>';
    m += '<text x="' + (x0 - 8) + '" y="' + (y0 + rh + 14) + '" fill="#34d399" font-size="11">3</text>';
    m += '<text x="' + (x0 + 128) + '" y="' + (y0 - 6) + '" fill="#34d399" font-size="11">3</text>';
    m += '<text x="' + (x0 + 128) + '" y="' + (y0 + rh + 14) + '" fill="#34d399" font-size="11">5</text>';
    var n = pairs.length;
    for(i = 0; i < n; i++){
      var yy = y0 + 14 + i * ((rh - 28) / Math.max(1, n - 1 || 1));
      var wob = Math.sin(t * 2 + i) * 3;
      var col = pairs[i] === "AT" ? "#38bdf8" : "#f59e0b";
      m += '<line x1="' + x0 + '" y1="' + yy + '" x2="' + (x0 + 120) + '" y2="' + (yy + wob) + '" stroke="' + col + '" stroke-width="7"/>';
      m += '<circle cx="' + (x0 + 60) + '" cy="' + (yy + wob / 2) + '" r="4" fill="#f8fafc"/>';
      m += '<text x="' + (x0 + 132) + '" y="' + (yy + 4) + '" fill="' + col + '" font-size="11">' + (pairs[i] === "AT" ? "A=T (2H)" : "G=C (3H)") + '</text>';
    }
    m += '<text x="400" y="70" fill="#e2e8f0" font-size="14">Built duplex: ' + nAT + ' x A=T, ' + nGC + ' x G=C</text>';
    m += '<text x="400" y="94" fill="#34d399" font-size="13">Builder check: A=' + nAT + ' T=' + nAT + ', G=' + nGC + ' C=' + nGC + ' ' + (ok ? 'PASS' : '') + '</text>';
    m += '<text x="400" y="118" fill="#38bdf8" font-size="13">Genome Chargaff: C=' + cPct + '% G=' + gPct + '% A=' + aPct.toFixed(1) + '% T=' + tPct.toFixed(1) + '%</text>';
    if(mode === "complement"){
      m += '<text x="400" y="150" fill="#e2e8f0" font-size="12">Ex 3 strand (5-3, 28 nt):</text>';
      m += '<text x="400" y="168" fill="#38bdf8" font-size="11">5-ATGCATGCATGC...ATGC-3</text>';
      m += '<text x="400" y="186" fill="#f59e0b" font-size="11">3-TACGTACG...TACG-5</text>';
      m += '<text x="400" y="204" fill="#34d399" font-size="11">rewritten 5-GCATGCAT...GCAT-3</text>';
    } else if(mode === "pack"){
      var nuc = Math.round(6.6e9 / 200);
      m += '<text x="400" y="150" fill="#e2e8f0" font-size="12">6.6 x 10^9 bp x 0.34 nm = 2.2 m</text>';
      m += '<text x="400" y="168" fill="#f59e0b" font-size="12">nucleosome ~200 bp on histone octamer</text>';
      m += '<text x="400" y="186" fill="#38bdf8" font-size="12">beads-on-string = chromatin -NHC-&gt; chromosome</text>';
      m += '<text x="400" y="204" fill="#94a3b8" font-size="12">~' + nuc + ' nucleosomes; euchromatin active/light</text>';
      m += '<text x="400" y="222" fill="#94a3b8" font-size="12">heterochromatin inactive/dark</text>';
    } else {
      m += '<text x="400" y="150" fill="#e2e8f0" font-size="12">Purine (A/G, double ring) faces</text>';
      m += '<text x="400" y="168" fill="#e2e8f0" font-size="12">pyrimidine (T/C, single ring):</text>';
      m += '<text x="400" y="186" fill="#94a3b8" font-size="12">uniform width; stacking stabilises</text>';
      m += '<text x="400" y="208" fill="#94a3b8" font-size="12">E. coli 1.36 mm / 0.34 nm = 4.0 x 10^6 bp</text>';
    }
    svg.innerHTML = m;
    readout(cell("%A", aPct.toFixed(1) + "%", "#38bdf8") + cell("%T", tPct.toFixed(1) + "%", "#38bdf8") +
      cell("%G", gPct.toFixed(0) + "%", "#f59e0b") + cell("%C", cPct.toFixed(0) + "%", "#f59e0b") +
      cell("pitch", "3.4 nm / 10 bp"));
    if(mode === "complement") verdict("<b>Exercise 3:</b> 5-ATGC...-3 gives antiparallel 3-TACG...-5, rewritten 5-GCATGCATGCATGCATGCATGCATGCAT-3 (28 nt). Complementarity predicts the second strand.");
    else if(mode === "pack") verdict("<b>Section 5.1.2:</b> 6.6 x 10^9 bp x 0.34 nm = <b>2.2 m</b> packed on histone octamers (~200 bp nucleosomes) into chromatin; light <b>euchromatin</b> active, dark <b>heterochromatin</b> inactive.");
    else verdict("<b>Exercise 2 (Chargaff):</b> 20% C gives G = 20%, so A+T = 60% and A = T = <b>30%</b>. [A]=[T], [G]=[C]; ratio = 1 for dsDNA (Section 5.1.1).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["genetic-material-search"] = (function(){
  var exp = "griffith";
  function stageOf(t, n){ var s = Math.floor(t); if(s < 0) s = 0; if(s > n - 1) s = n - 1; return s; }
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Virulent / hot label</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Survives / pellet</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Coat / supernatant</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-gr">Griffith 1928</button>' +
      '<button class="preset-btn" id="p-av">Avery 1944: DNase test</button>' +
      '<button class="preset-btn" id="p-hc">Hershey-Chase 1952</button>';
    document.getElementById("p-gr").onclick = function(){ setActivePreset(this); exp = "griffith"; App.state.maxT = 4; var sc = document.getElementById("time-scrubber"); if(sc) sc.max = 4; draw(App.state.t); };
    document.getElementById("p-av").onclick = function(){ setActivePreset(this); exp = "avery"; App.state.maxT = 3; var sc = document.getElementById("time-scrubber"); if(sc) sc.max = 3; draw(App.state.t); };
    document.getElementById("p-hc").onclick = function(){ setActivePreset(this); exp = "hershey"; App.state.maxT = 3; var sc = document.getElementById("time-scrubber"); if(sc) sc.max = 3; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Step (scrub time or step)</span><span class="val" id="ctrl-st">0</span></div>' +
      '<div><button class="preset-btn" id="b-prev">Prev</button> <button class="preset-btn" id="b-next">Next</button></div></div>';
    document.getElementById("b-prev").onclick = function(){ App.state.t = Math.max(0, App.state.t - 1); var sc = document.getElementById("time-scrubber"); if(sc) sc.value = App.state.t; draw(App.state.t); };
    document.getElementById("b-next").onclick = function(){ App.state.t = Math.min(App.state.maxT, App.state.t + 1); var sc = document.getElementById("time-scrubber"); if(sc) sc.value = App.state.t; draw(App.state.t); };
    draw(0);
  }
  function mouse(x, alive, label, col){
    var s = '<circle cx="' + x + '" cy="170" r="26" fill="' + (alive ? col : '#1e293b') + '" stroke="#64748b"/>';
    s += '<circle cx="' + (x - 9) + '" cy="163" r="3" fill="#0f172a"/><circle cx="' + (x + 9) + '" cy="163" r="3" fill="#0f172a"/>';
    if(!alive){ s += '<line x1="' + (x - 18) + '" y1="150" x2="' + (x + 18) + '" y2="190" stroke="#f87171" stroke-width="3"/>'; }
    s += '<text x="' + x + '" y="215" fill="#94a3b8" font-size="11" text-anchor="middle">' + label + '</text>';
    return s;
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    if(exp === "griffith"){
      var st = stageOf(t, 5);
      var elb = document.getElementById("ctrl-st"); if(elb) elb.textContent = st;
      var groups = ["live R", "live S", "heat-killed S", "heat-killed S + live R", "recovered live S"];
      var alive = [true, false, true, false, false];
      m += '<text x="360" y="30" fill="#94a3b8" font-size="13" text-anchor="middle">Griffith: Streptococcus pneumoniae S (smooth, virulent) vs R (rough)</text>';
      m += '<text x="360" y="52" fill="#e2e8f0" font-size="14" text-anchor="middle">Step ' + (st + 1) + '/5: ' + groups[st] + ' -&gt; mouse ' + (alive[st] ? 'LIVES' : 'DIES') + '</text>';
      m += mouse(150, alive[st], "mouse", "#34d399");
      m += '<rect x="260" y="120" width="120" height="90" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<text x="320" y="145" fill="#94a3b8" font-size="11" text-anchor="middle">injected</text>';
      m += '<text x="320" y="165" fill="#e2e8f0" font-size="11" text-anchor="middle">' + groups[st] + '</text>';
      m += '<text x="520" y="130" fill="#f87171" font-size="12">transforming</text>';
      m += '<text x="520" y="148" fill="#f87171" font-size="12">principle moves</text>';
      m += '<text x="520" y="166" fill="#94a3b8" font-size="12">R -&gt; virulent S</text>';
      m += '<text x="520" y="190" fill="#94a3b8" font-size="11">chemistry unknown</text>';
      m += '<text x="520" y="206" fill="#94a3b8" font-size="11">at this stage</text>';
      svg.innerHTML = m;
      readout(cell("step", (st + 1) + " / 5") + cell("mix", groups[st]) + cell("mouse", alive[st] ? "lives" : "dies", alive[st] ? "#34d399" : "#f87171"));
      verdict("<b>Section 5.2 (Griffith 1928):</b> heat-killed S alone is harmless, but heat-killed S + live R kills and yields live S — R was <b>transformed</b>. Scrub time to walk the four injections plus recovery.");
    } else if(exp === "avery"){
      var sa = stageOf(t, 4);
      var ela = document.getElementById("ctrl-st"); if(ela) ela.textContent = sa;
      var names = ["DNA alone", "+ protease", "+ RNase", "+ DNase"];
      var works = [true, true, true, false];
      m += '<text x="360" y="30" fill="#94a3b8" font-size="13" text-anchor="middle">Avery-MacLeod-McCarty 1933-44: purified fractions from heat-killed S</text>';
      m += '<text x="360" y="54" fill="#e2e8f0" font-size="14" text-anchor="middle">' + names[sa] + ': transformation ' + (works[sa] ? 'WORKS (R-&gt;S)' : 'BLOCKED') + '</text>';
      for(var i = 0; i < 4; i++){
        var xx = 120 + i * 160;
        var hot = (i === sa);
        m += '<rect x="' + (xx - 60) + '" y="100" width="120" height="90" rx="8" fill="' + (hot ? '#1e3a5f' : '#0f1f2e') + '" stroke="' + (hot ? '#38bdf8' : '#334155') + '"/>';
        m += '<text x="' + xx + '" y="130" fill="#e2e8f0" font-size="11" text-anchor="middle">' + names[i] + '</text>';
        m += '<text x="' + xx + '" y="155" fill="' + (works[i] ? '#34d399' : '#f87171') + '" font-size="13" text-anchor="middle">' + (works[i] ? 'S colonies' : 'no S') + '</text>';
      }
      m += '<text x="360" y="240" fill="#94a3b8" font-size="12" text-anchor="middle">Protease/RNase spare it; DNase destroys it -&gt; DNA is the hereditary material</text>';
      svg.innerHTML = m;
      readout(cell("fraction", names[sa]) + cell("R->S", works[sa] ? "yes" : "no", works[sa] ? "#34d399" : "#f87171") + cell("verdict", works[sa] ? "DNA intact" : "DNA digested"));
      verdict("<b>Section 5.2 (Avery):</b> only <b>DNase abolishes</b> transformation; proteases and RNases do not. DNA, not protein or RNA, is the transforming principle.");
    } else {
      var sh = stageOf(t, 4);
      var elh = document.getElementById("ctrl-st"); if(elh) elh.textContent = sh;
      var labels = ["label phage", "infect + blend", "centrifuge", "read pellet/supernatant"];
      m += '<text x="360" y="30" fill="#94a3b8" font-size="13" text-anchor="middle">Hershey-Chase 1952: 32P labels DNA, 35S labels protein (Fig. 5.5)</text>';
      m += '<text x="360" y="54" fill="#e2e8f0" font-size="14" text-anchor="middle">Step: ' + labels[sh] + '</text>';
      m += '<rect x="120" y="100" width="200" height="120" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<text x="220" y="125" fill="#94a3b8" font-size="11" text-anchor="middle">E. coli + phage</text>';
      var bob = 130 + ((t * 40) % 60);
      m += '<circle cx="180" cy="' + bob + '" r="8" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      m += '<circle cx="260" cy="' + (220 - ((t * 40) % 60)) + '" r="8" fill="none" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="220" y="205" fill="#94a3b8" font-size="11" text-anchor="middle">blender strips coats</text>';
      m += '<rect x="400" y="100" width="200" height="120" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<rect x="410" y="170" width="180" height="40" fill="#164e63"/>';
      m += '<text x="500" y="163" fill="#94a3b8" font-size="11" text-anchor="middle">supernatant: coats (35S hot)</text>';
      m += '<text x="500" y="205" fill="#34d399" font-size="11" text-anchor="middle">pellet: cells (32P hot)</text>';
      m += '<text x="360" y="255" fill="#94a3b8" font-size="12" text-anchor="middle">32P enters cells; 35S stays out -&gt; DNA passed virus -&gt; bacterium</text>';
      svg.innerHTML = m;
      readout(cell("32P (DNA)", "pellet hot", "#34d399") + cell("35S (protein)", "supernatant hot", "#f59e0b") + cell("step", labels[sh]));
      verdict("<b>Exercise 7 / Fig. 5.5:</b> blend, then spin: radioactivity in the <b>pellet only for 32P</b> proves <b>DNA entered</b>; 35S stays in coats. DNA is the genetic material.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["dna-replication"] = (function(){
  var view = "bands";
  function mount(){
    App.state.maxT = 4;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Heavy 15N</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Hybrid 15N/14N</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Light 14N</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-b">CsCl bands</button>' +
      '<button class="preset-btn" id="p-f">Fork + ligase</button>';
    document.getElementById("p-b").onclick = function(){ setActivePreset(this); view = "bands"; draw(App.state.t); };
    document.getElementById("p-f").onclick = function(){ setActivePreset(this); view = "fork"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Generations in 14N (20 min each)</span><span class="val" id="ctrl-g">1</span></div>' +
      '<input type="range" id="ctrl-g-range" min="0" max="4" step="1" value="1"></div>';
    document.getElementById("ctrl-g-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var gen = numEl("ctrl-g-range", 1);
    var el = document.getElementById("ctrl-g"); if(el) el.textContent = gen;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    var hyb = gen === 0 ? 0 : 2 / Math.pow(2, gen);
    if(gen === 0) hyb = 0;
    var heavy = gen === 0 ? 1 : 0;
    var light = 1 - hyb - heavy;
    if(view === "bands"){
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Meselson-Stahl 1958: 15N -&gt; 14N, CsCl density gradient (Fig. 5.7)</text>';
      m += '<rect x="90" y="60" width="130" height="190" rx="8" fill="#0f1f2e" stroke="#334155"/>';
      m += '<text x="155" y="52" fill="#94a3b8" font-size="11" text-anchor="middle">CsCl tube</text>';
      if(heavy > 0) m += '<rect x="100" y="200" width="110" height="14" fill="#f87171"/>';
      if(hyb > 0) m += '<rect x="100" y="155" width="110" height="14" fill="#a78bfa"/>';
      if(light > 0) m += '<rect x="100" y="110" width="110" height="14" fill="#38bdf8"/>';
      m += '<text x="155" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">Gen ' + gen + '</text>';
      m += '<text x="380" y="90" fill="#a78bfa" font-size="14">hybrid = ' + (hyb * 100).toFixed(1) + '% (= 2/2^n)</text>';
      m += '<text x="380" y="114" fill="#38bdf8" font-size="14">light = ' + (light * 100).toFixed(1) + '%</text>';
      m += '<text x="380" y="138" fill="#f87171" font-size="13">heavy = ' + (heavy * 100).toFixed(1) + '%</text>';
      m += '<text x="380" y="168" fill="#e2e8f0" font-size="12">Gen I: hybrid only. Gen II: 50/50.</text>';
      m += '<text x="380" y="188" fill="#e2e8f0" font-size="12">80 min (4 gen): 12.5% hybrid, 87.5% light.</text>';
      m += '<text x="380" y="212" fill="#94a3b8" font-size="12">Taylor (Vicia faba) confirms on chromosomes.</text>';
      m += '<text x="380" y="236" fill="#94a3b8" font-size="12">Each duplex: 1 parental + 1 new strand.</text>';
      svg.innerHTML = m;
      readout(cell("gen", gen) + cell("hybrid", (hyb * 100).toFixed(1) + "%", "#a78bfa") + cell("light", (light * 100).toFixed(1) + "%", "#38bdf8") + cell("heavy", (heavy * 100).toFixed(1) + "%", "#f87171"));
      if(gen === 1) verdict("<b>Section 5.4.1 / Fig. 5.7:</b> after one doubling every duplex is <b>hybrid</b> — rules out conservative/dispersive. Daughters each keep one parental strand (<b>Exercise 5</b>).");
      else if(gen === 2) verdict("<b>Fig. 5.7 Gen II (40 min):</b> equal <b>hybrid + light</b> bands. Hybrid fraction halves each round: 2/2^n.");
      else verdict("<b>In-text 80-min check:</b> 80/20 = 4 generations, hybrid = 2/16 = <b>12.5%</b>, light 87.5%. Semiconservative replication confirmed.");
    } else {
      var open = 60 + (t / 4) * 120;
      m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Fork: polymerase builds 5-3 only; ~2000 bp/s; dNTPs = substrate + energy (Fig. 5.8)</text>';
      m += '<line x1="80" y1="120" x2="' + (300 + open) + '" y2="120" stroke="#38bdf8" stroke-width="4"/>';
      m += '<line x1="80" y1="180" x2="' + (300 + open) + '" y2="180" stroke="#f59e0b" stroke-width="4"/>';
      m += '<text x="90" y="110" fill="#38bdf8" font-size="11">template 3-5: continuous</text>';
      m += '<text x="90" y="205" fill="#f59e0b" font-size="11">template 5-3: fragments + ligase</text>';
      for(var i = 0; i < 4; i++){
        var fx = 120 + i * 45;
        m += '<rect x="' + fx + '" y="150" width="34" height="12" fill="#1e3a5f" stroke="#38bdf8"/>';
      }
      m += '<text x="' + (300 + open + 8) + '" y="155" fill="#34d399" font-size="12">fork opens</text>';
      m += '<text x="480" y="120" fill="#94a3b8" font-size="12">ori required (vectors supply ori)</text>';
      m += '<text x="480" y="145" fill="#94a3b8" font-size="12">E. coli 4.6 x 10^6 bp in 18 min</text>';
      m += '<text x="480" y="170" fill="#94a3b8" font-size="12">eukaryotes: S-phase; failure -&gt; polyploidy</text>';
      m += '<text x="480" y="200" fill="#f59e0b" font-size="12">DNA ligase joins fragments</text>';
      svg.innerHTML = m;
      readout(cell("rate", "2000 bp/s", "#38bdf8") + cell("leading", "continuous") + cell("lagging", "fragments + ligase", "#f59e0b") + cell("origin", "ori needed"));
      verdict("<b>Section 5.4.2:</b> polymerase only builds <b>5-3</b>, so one side is continuous and the other is <b>discontinuous fragments joined by ligase</b>. Polymerase cannot initiate — <b>ori</b> defines start.");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["transcription-unit"] = (function(){
  var show = "walker";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Template 3-5 (copied)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Coding 5-3 (RNA-like)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>RNA 5-3 (U for A)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-w">Ex 4 walker</button>' +
      '<button class="preset-btn" id="p-map">Unit map p-gene-t</button>' +
      '<button class="preset-btn" id="p-proc">hnRNA processing</button>';
    document.getElementById("p-w").onclick = function(){ setActivePreset(this); show = "walker"; draw(App.state.t); };
    document.getElementById("p-map").onclick = function(){ setActivePreset(this); show = "map"; draw(App.state.t); };
    document.getElementById("p-proc").onclick = function(){ setActivePreset(this); show = "proc"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Walker position (nt)</span><span class="val" id="ctrl-pos">4</span></div>' +
      '<input type="range" id="ctrl-pos-range" min="0" max="11" step="1" value="4"></div>';
    document.getElementById("ctrl-pos-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var pos = numEl("ctrl-pos-range", 4);
    var el = document.getElementById("ctrl-pos"); if(el) el.textContent = pos;
    var coding = "ATGCATGCATGC";
    var template = "TACGTACGTACG";
    var rna = "AUGCAUGCAUGC";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Template 3-5 -&gt; RNA 5-3 (A-&gt;U); coding 5-3 = RNA (T-&gt;U) (Sec 5.5.1)</text>';
    if(show === "walker"){
      var bx;
      for(var i = 0; i < 12; i++){
        bx = 70 + i * 50;
        var hot = (i === pos);
        m += '<rect x="' + (bx - 20) + '" y="60" width="40" height="34" fill="' + (hot ? '#1e3a5f' : '#0f1f2e') + '" stroke="' + (hot ? '#38bdf8' : '#334155') + '"/>';
        m += '<text x="' + bx + '" y="83" fill="#94a3b8" font-size="13" text-anchor="middle">' + coding[i] + '</text>';
        m += '<rect x="' + (bx - 20) + '" y="100" width="40" height="34" fill="' + (hot ? '#1e3a5f' : '#0f1f2e') + '" stroke="' + (hot ? '#38bdf8' : '#334155') + '"/>';
        m += '<text x="' + bx + '" y="123" fill="#38bdf8" font-size="13" text-anchor="middle">' + template[i] + '</text>';
        m += '<rect x="' + (bx - 20) + '" y="150" width="40" height="34" fill="' + (hot ? '#064e3b' : '#0f1f2e') + '" stroke="' + (hot ? '#34d399' : '#334155') + '"/>';
        var rb = rna[i] === "U" ? "U" : rna[i];
        m += '<text x="' + bx + '" y="173" fill="#34d399" font-size="13" text-anchor="middle">' + rb + '</text>';
        if(hot) m += '<line x1="' + bx + '" y1="190" x2="' + bx + '" y2="215" stroke="#f8fafc" stroke-width="2"/>';
      }
      m += '<text x="70" y="55" fill="#94a3b8" font-size="11">coding 5</text>';
      m += '<text x="70" y="150" fill="#38bdf8" font-size="11">template 3</text>';
      m += '<text x="70" y="200" fill="#34d399" font-size="11">RNA 5</text>';
      m += '<text x="360" y="235" fill="#e2e8f0" font-size="13" text-anchor="middle">pos ' + pos + ': template ' + template[pos] + ' -&gt; RNA ' + rna[pos] + ' (pair ' + template[pos] + '-' + rna[pos] + ')</text>';
      m += '<text x="360" y="258" fill="#94a3b8" font-size="12" text-anchor="middle">Full Ex 4 (28 nt): mRNA 5-AUGCAUGC...CAUGC-3. Drag the walker.</text>';
    } else if(show === "map"){
      m += '<rect x="80" y="110" width="120" height="50" fill="#1e3a5f" stroke="#38bdf8"/>';
      m += '<text x="140" y="133" fill="#e2e8f0" font-size="12" text-anchor="middle">promoter</text>';
      m += '<text x="140" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">upstream 5; sigma</text>';
      m += '<rect x="210" y="110" width="300" height="50" fill="#0f1f2e" stroke="#34d399"/>';
      m += '<text x="360" y="133" fill="#e2e8f0" font-size="12" text-anchor="middle">structural gene</text>';
      m += '<text x="360" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">mono- vs polycistronic; exons/introns</text>';
      m += '<rect x="520" y="110" width="120" height="50" fill="#451a03" stroke="#f59e0b"/>';
      m += '<text x="580" y="133" fill="#e2e8f0" font-size="12" text-anchor="middle">terminator</text>';
      m += '<text x="580" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">downstream 3; rho</text>';
      var px = 140 + (t / 6) * 440;
      m += '<circle cx="' + px + '" cy="100" r="9" fill="#34d399"/>';
      m += '<text x="360" y="200" fill="#e2e8f0" font-size="12" text-anchor="middle">Swap promoter/terminator ends reverses which strand is template.</text>';
      m += '<text x="360" y="222" fill="#94a3b8" font-size="12" text-anchor="middle">Bacteria: 1 polymerase, coupled transcription-translation.</text>';
      m += '<text x="360" y="244" fill="#94a3b8" font-size="12" text-anchor="middle">Copying both strands would make blocking dsRNA -&gt; only one strand per segment.</text>';
    } else {
      var steps = ["hnRNA (exons + introns)", "splice introns out", "+ 5 cap (mGppp)", "+ 3 poly-A (200-300)", "mRNA exported"];
      for(var k = 0; k < 5; k++){
        var kx = 70 + k * 120;
        m += '<rect x="' + kx + '" y="110" width="105" height="60" rx="6" fill="#0f1f2e" stroke="#334155"/>';
        m += '<text x="' + (kx + 52) + '" y="135" fill="#e2e8f0" font-size="10" text-anchor="middle">' + steps[k] + '</text>';
        if(k < 4) m += '<line x1="' + (kx + 105) + '" y1="140" x2="' + (kx + 120) + '" y2="140" stroke="#34d399" stroke-width="2"/>';
      }
      m += '<text x="360" y="70" fill="#94a3b8" font-size="12" text-anchor="middle">Eukaryotes: Pol I (rRNA) / Pol III (tRNA, 5S) / Pol II (hnRNA-&gt;mRNA)</text>';
      m += '<text x="360" y="210" fill="#94a3b8" font-size="12" text-anchor="middle">Split genes + splicing echo the RNA world (Sec 5.5.3, Fig. 5.11).</text>';
    }
    svg.innerHTML = m;
    readout(cell("template", "3-&gt;5", "#38bdf8") + cell("RNA", "5-&gt;3", "#34d399") + cell("pos " + pos, template[pos] + "->" + rna[pos]) + cell("tail", "200-300 A"));
    if(show === "walker") verdict("<b>Exercise 4:</b> coding 5-ATGC...-3 gives mRNA 5-<b>AUGCAUGCAUGCAUGCAUGCAUGCAUGC</b>-3 (28 nt, U for T). Template is its antiparallel 3-TACG...-5.");
    else if(show === "map") verdict("<b>Section 5.5.1 / Fig. 5.9:</b> unit = <b>promoter (upstream 5)</b> — gene — <b>terminator (downstream 3)</b>; promoter binds polymerase (sigma start, rho stop in bacteria).");
    else verdict("<b>Section 5.5.3:</b> hnRNA -&gt; <b>splice</b> introns + <b>5 cap (methyl guanosine triphosphate)</b> + <b>3 tail (200-300 A)</b> = mRNA. Pol II makes hnRNA.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["genetic-code-trna-mutation"] = (function(){
  var mut = "none";
  var CODE = { AUG: "Met", UUU: "Phe", UUC: "Phe", UAA: "STOP", UAG: "STOP", UGA: "STOP", GAG: "Glu", GUG: "Val", CGU: "Arg", AAA: "Lys" };
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Sense codon</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Stop / shifted frame</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Start AUG</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-no">In-text: 7 codons</button>' +
      '<button class="preset-btn" id="p-fs">Frameshift +1 (RAM demo)</button>' +
      '<button class="preset-btn" id="p-3">Insert 3 (frame kept)</button>' +
      '<button class="preset-btn" id="p-sc">Sickle GAG-&gt;GUG</button>';
    document.getElementById("p-no").onclick = function(){ setActivePreset(this); mut = "none"; draw(App.state.t); };
    document.getElementById("p-fs").onclick = function(){ setActivePreset(this); mut = "fs"; draw(App.state.t); };
    document.getElementById("p-3").onclick = function(){ setActivePreset(this); mut = "ins3"; draw(App.state.t); };
    document.getElementById("p-sc").onclick = function(){ setActivePreset(this); mut = "sickle"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>tRNA view</span><span class="val">clover-leaf</span></div>' +
      '<div style="font-size:12px;color:#94a3b8">anticodon loop + 3 acceptor; no tRNA for stops; initiator for AUG</div></div>';
    draw(0);
  }
  function codonsFor(){
    if(mut === "sickle") return ["GAG", "UUC", "AUG"];
    return ["AUG", "UUU", "UUC", "UUC", "UUU", "UUU", "UUC"];
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var codons = codonsFor();
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Gamow triplet 4^3 = 64 = 61 sense + 3 stops; degenerate, contiguous, nearly universal</text>';
    var disp = [], i;
    if(mut === "fs"){
      var joined = codons.join("").split("");
      joined.splice(1, 0, "B");
      var jstr = joined.join("");
      for(i = 0; i < 7; i++){ disp.push(jstr.substr(i * 3, 3)); }
      m += '<text x="360" y="48" fill="#f87171" font-size="12" text-anchor="middle">RAM-HAS-RED-CAP + 1 base -&gt; RAM-HAS-BRE-DCA-P: frame shifted after insertion</text>';
    } else if(mut === "ins3"){
      m += '<text x="360" y="48" fill="#34d399" font-size="12" text-anchor="middle">RAM-HAS-BIG-RED-CAP: 3-base insert adds codons, frame preserved</text>';
      disp = codons.slice(0, 7);
    } else if(mut === "sickle"){
      m += '<text x="360" y="48" fill="#f59e0b" font-size="12" text-anchor="middle">Point mutation: beta-globin GAG (Glu) -&gt; GUG (Val) = sickle-cell anaemia</text>';
      disp = ["GUG", "UUC", "AUG"];
    } else {
      m += '<text x="360" y="48" fill="#e2e8f0" font-size="12" text-anchor="middle">-AUG UUU UUC UUC UUU UUU UUC- =&gt; Met-Phe x 6 (reverse is ambiguous: Phe = UUU/UUC)</text>';
      disp = codons;
    }
    for(i = 0; i < disp.length; i++){
      var cx = 60 + i * 92;
      var aa = CODE[disp[i]] || "?";
      var isStart = disp[i] === "AUG" && mut !== "sickle";
      var isStop = (aa === "STOP");
      var shifted = (mut === "fs");
      var col = isStop || shifted ? "#f87171" : (isStart ? "#34d399" : "#38bdf8");
      m += '<rect x="' + cx + '" y="80" width="80" height="46" rx="6" fill="#0f1f2e" stroke="' + col + '"/>';
      m += '<text x="' + (cx + 40) + '" y="100" fill="#e2e8f0" font-size="12" text-anchor="middle">' + disp[i] + '</text>';
      m += '<rect x="' + cx + '" y="132" width="80" height="40" rx="6" fill="#0f1f2e" stroke="' + col + '"/>';
      m += '<text x="' + (cx + 40) + '" y="157" fill="' + col + '" font-size="12" text-anchor="middle">' + aa + '</text>';
    }
    var pulse = 150 + Math.sin(t * 3) * 4;
    m += '<g><line x1="560" y1="200" x2="560" y2="230" stroke="#34d399" stroke-width="4"/>';
    m += '<line x1="560" y1="200" x2="520" y2="225" stroke="#34d399" stroke-width="4"/>';
    m += '<line x1="560" y1="200" x2="600" y2="225" stroke="#34d399" stroke-width="4"/>';
    m += '<circle cx="560" cy="' + pulse + '" r="10" fill="none" stroke="#34d399" stroke-width="2"/>';
    m += '<text x="560" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">tRNA: anticodon + acceptor</text>';
    m += '<text x="560" y="276" fill="#94a3b8" font-size="11" text-anchor="middle">clover-leaf -&gt; inverted L (Fig. 5.12)</text></g>';
    m += '<text x="200" y="240" fill="#94a3b8" font-size="12">AUG = Met + start (dual); UAA/UAG/UGA stop; UUU = Phe.</text>';
    svg.innerHTML = m;
    readout(cell("codons", "64", "#38bdf8") + cell("sense", "61") + cell("stops", "UAA/UAG/UGA", "#f87171") + cell("start", "AUG=Met", "#34d399"));
    if(mut === "fs") verdict("<b>Section 5.6.1 RAM demo:</b> insert/delete of <b>1-2 bases shifts the frame</b> from that point (RAM-HAS-BRE-DCA-P); insert of <b>3 keeps the frame</b> (BIG-RED-CAP).");
    else if(mut === "ins3") verdict("<b>Section 5.6.1:</b> a 3 (or multiple of 3) indel adds/loses codon(s) but the <b>frame is preserved</b> — RAM-HAS-BIG-RED-CAP.");
    else if(mut === "sickle") verdict("<b>Section 5.6.1:</b> point mutation <b>GAG-&gt;GUG</b> swaps <b>Glu-&gt;Val</b> in beta-globin — <b>sickle-cell anaemia</b> from one base.");
    else verdict("<b>Section 5.6 (in-text):</b> AUG UUU UUC UUC UUU UUU UUC = <b>Met-Phe-Phe-Phe-Phe-Phe-Phe</b>. Code is <b>degenerate</b>, so aa-&gt;nt has 2^6 = 64 answers for the Phes.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["translation-synthesis"] = (function(){
  function mount(){
    App.state.maxT = 3;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>mRNA codons</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>tRNA + chain</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Ribosome (23S ribozyme)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-i">Initiation (AUG)</button>' +
      '<button class="preset-btn" id="p-e">Elongation</button>' +
      '<button class="preset-btn" id="p-t">Termination (release factor)</button>';
    document.getElementById("p-i").onclick = function(){ setActivePreset(this); App.state.t = 0; var sc = document.getElementById("time-scrubber"); if(sc) sc.value = 0; draw(0); };
    document.getElementById("p-e").onclick = function(){ setActivePreset(this); App.state.t = 1.5; var sc = document.getElementById("time-scrubber"); if(sc) sc.value = 1.5; draw(1.5); };
    document.getElementById("p-t").onclick = function(){ setActivePreset(this); App.state.t = 3; var sc = document.getElementById("time-scrubber"); if(sc) sc.value = 3; draw(3); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Unit</span><span class="val">UTR-AUG...stop-UTR</span></div>' +
      '<div style="font-size:12px;color:#94a3b8">charging (ATP) first; ~80 proteins; 2 tRNA sites</div></div>';
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var phase = t < 1 ? 0 : (t < 2.2 ? 1 : 2);
    var names = ["INITIATION", "ELONGATION", "TERMINATION"];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Translational unit: 5-UTR - AUG ... codons ... stop - 3-UTR (Sec 5.7)</text>';
    m += '<line x1="60" y1="150" x2="660" y2="150" stroke="#38bdf8" stroke-width="4"/>';
    var codons = ["5-UTR", "AUG", "UUU", "UUC", "UAA", "3-UTR"];
    var i, cx;
    for(i = 0; i < codons.length; i++){
      cx = 95 + i * 95;
      m += '<rect x="' + (cx - 38) + '" y="128" width="76" height="44" rx="6" fill="#0f1f2e" stroke="#334155"/>';
      m += '<text x="' + cx + '" y="154" fill="#e2e8f0" font-size="11" text-anchor="middle">' + codons[i] + '</text>';
    }
    var rx = 190 + phase * 130 + Math.sin(t * 2) * 4;
    m += '<rect x="' + (rx - 70) + '" y="70" width="150" height="60" rx="12" fill="#451a03" stroke="#f59e0b"/>';
    m += '<rect x="' + (rx - 70) + '" y="180" width="150" height="46" rx="10" fill="#451a03" stroke="#f59e0b"/>';
    m += '<text x="' + (rx + 5) + '" y="105" fill="#f59e0b" font-size="11" text-anchor="middle">ribosome</text>';
    m += '<text x="' + (rx + 5) + '" y="120" fill="#94a3b8" font-size="10" text-anchor="middle">small + large; 23S</text>';
    if(phase === 0){
      m += '<text x="360" y="250" fill="#34d399" font-size="13" text-anchor="middle">Initiation: ribosome binds mRNA; AUG recognised only by initiator tRNA.</text>';
      cx = 190;
      m += '<rect x="' + (cx - 18) + '" y="185" width="36" height="50" rx="6" fill="#064e3b" stroke="#34d399"/>';
      m += '<text x="' + cx + '" y="212" fill="#e2e8f0" font-size="10" text-anchor="middle">Met</text>';
    } else if(phase === 1){
      m += '<text x="360" y="250" fill="#34d399" font-size="13" text-anchor="middle">Elongation: aa-tRNA pairs by anticodon; ribosome steps codon to codon.</text>';
      for(i = 0; i < 3; i++){
        cx = rx - 30 + i * 32;
        m += '<rect x="' + (cx - 15) + '" y="185" width="30" height="48" rx="6" fill="#064e3b" stroke="#34d399"/>';
      }
      m += '<polyline points="' + (rx - 45) + ',70 ' + (rx - 10) + ',55 ' + (rx + 25) + ',70" fill="none" stroke="#34d399" stroke-width="3"/>';
      m += '<text x="' + (rx + 5) + '" y="50" fill="#34d399" font-size="11" text-anchor="middle">Met-Phe-Phe-...</text>';
    } else {
      m += '<text x="360" y="250" fill="#f59e0b" font-size="13" text-anchor="middle">Termination: release factor binds UAA (no tRNA for stops); chain released.</text>';
      m += '<rect x="' + (rx + 20) + '" y="185" width="44" height="48" rx="6" fill="#7c2d12" stroke="#f59e0b"/>';
      m += '<text x="' + (rx + 42) + '" y="212" fill="#e2e8f0" font-size="9" text-anchor="middle">RF</text>';
      m += '<text x="' + (rx - 60) + '" y="60" fill="#34d399" font-size="11">free polypeptide</text>';
    }
    m += '<text x="360" y="278" fill="#94a3b8" font-size="11" text-anchor="middle">Phase: ' + names[phase] + ' (scrub time 0-3). Charging = ATP + aa + tRNA -&gt; aminoacyl-tRNA.</text>';
    svg.innerHTML = m;
    readout(cell("phase", names[phase], phase === 2 ? "#f59e0b" : "#34d399") + cell("catalyst", "23S rRNA", "#f59e0b") + cell("proteins", "~80") + cell("sites", "2 tRNA"));
    if(phase === 0) verdict("<b>Section 5.7:</b> <b>charging</b> (ATP links aa to cognate tRNA) precedes synthesis; <b>initiation</b> needs ribosome + mRNA + <b>initiator tRNA at AUG</b> (Exercise 9).");
    else if(phase === 1) verdict("<b>Section 5.7 / Fig. 5.13:</b> <b>elongation</b> adds residues as aa-tRNAs pair by <b>anticodon</b>; peptide bonds catalysed by <b>23S rRNA ribozyme</b>.");
    else verdict("<b>Section 5.7:</b> <b>release factor binds stop</b> (UAA/UAG/UGA have no tRNAs); translation ends and the <b>polypeptide is released</b>. UTRs flank for efficiency.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["lac-operon-regulation"] = (function(){
  var lactose = false;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Repressor (i product)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>RNA polymerase + mRNA</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>z / y / a enzymes</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-off">No lactose: OFF</button>' +
      '<button class="preset-btn" id="p-on">+ lactose: ON</button>' +
      '<button class="preset-btn" id="p-done">Ex 10: inducer eaten: OFF</button>';
    document.getElementById("p-off").onclick = function(){ setActivePreset(this); lactose = false; draw(App.state.t); };
    document.getElementById("p-on").onclick = function(){ setActivePreset(this); lactose = true; draw(App.state.t); };
    document.getElementById("p-done").onclick = function(){ setActivePreset(this); lactose = false; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Lactose / allolactose</span><span class="val" id="ctrl-l">absent</span></div>' +
      '<input type="range" id="ctrl-l-range" min="0" max="1" step="1" value="0"></div>';
    document.getElementById("ctrl-l-range").oninput = function(){
      lactose = numEl("ctrl-l-range", 0) === 1;
      draw(App.state.t);
    };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var lr = document.getElementById("ctrl-l-range"); if(lr) lr.value = lactose ? 1 : 0;
    var elb = document.getElementById("ctrl-l"); if(elb) elb.textContent = lactose ? "present" : "absent";
    var on = lactose;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">lac operon (Jacob + Monod): i + p + o + z + y + a (Fig. 5.14)</text>';
    var genes = ["i", "p", "o", "z", "y", "a"];
    var cols = ["#f87171", "#34d399", "#f59e0b", "#38bdf8", "#38bdf8", "#38bdf8"];
    var i, gx;
    for(i = 0; i < genes.length; i++){
      gx = 80 + i * 95;
      m += '<rect x="' + gx + '" y="100" width="80" height="52" rx="6" fill="#0f1f2e" stroke="' + cols[i] + '"/>';
      m += '<text x="' + (gx + 40) + '" y="130" fill="#e2e8f0" font-size="15" text-anchor="middle">' + genes[i] + '</text>';
    }
    m += '<text x="120" y="175" fill="#94a3b8" font-size="10" text-anchor="middle">repressor</text>';
    m += '<text x="215" y="175" fill="#94a3b8" font-size="10" text-anchor="middle">promoter</text>';
    m += '<text x="310" y="175" fill="#94a3b8" font-size="10" text-anchor="middle">operator</text>';
    m += '<text x="405" y="175" fill="#94a3b8" font-size="10" text-anchor="middle">beta-gal</text>';
    m += '<text x="500" y="175" fill="#94a3b8" font-size="10" text-anchor="middle">permease</text>';
    m += '<text x="595" y="175" fill="#94a3b8" font-size="10" text-anchor="middle">transac.</text>';
    if(!on){
      m += '<rect x="290" y="60" width="60" height="34" rx="6" fill="#f87171"/>';
      m += '<text x="320" y="82" fill="#0f172a" font-size="10" text-anchor="middle">REP</text>';
      m += '<line x1="320" y1="94" x2="310" y2="100" stroke="#f87171" stroke-width="3"/>';
      m += '<text x="480" y="82" fill="#64748b" font-size="12">polymerase BLOCKED at o</text>';
      m += '<text x="360" y="220" fill="#f87171" font-size="14" text-anchor="middle">STATUS: OFF - repressor bound to operator</text>';
    } else {
      var wob = Math.sin(t * 3) * 3;
      m += '<rect x="120" y="60" width="60" height="34" rx="6" fill="#1e293b" stroke="#f87171"/>';
      m += '<text x="150" y="82" fill="#f87171" font-size="10" text-anchor="middle">REP+X</text>';
      m += '<text x="250" y="70" fill="#f59e0b" font-size="11">lactose/allolactose</text>';
      m += '<text x="250" y="86" fill="#94a3b8" font-size="11">inactivates repressor</text>';
      m += '<line x1="360" y1="' + (90 + wob) + '" x2="620" y2="' + (90 + wob) + '" stroke="#34d399" stroke-width="3"/>';
      m += '<polygon points="620,' + (90 + wob) + ' 610,' + (84 + wob) + ' 610,' + (96 + wob) + '" fill="#34d399"/>';
      m += '<text x="480" y="115" fill="#34d399" font-size="11">pol transcribes z/y/a</text>';
      m += '<text x="360" y="220" fill="#34d399" font-size="14" text-anchor="middle">STATUS: ON - enzymes for lactose metabolism made</text>';
    }
    m += '<text x="360" y="248" fill="#94a3b8" font-size="12" text-anchor="middle">z: lactose-&gt;galactose+glucose; y: entry; a: transacetylase. Basal leak lets first lactose in.</text>';
    m += '<text x="360" y="270" fill="#94a3b8" font-size="12" text-anchor="middle">Glucose/galactose cannot induce. Negative regulation by repressor.</text>';
    svg.innerHTML = m;
    readout(cell("inducer", on ? "present" : "absent", on ? "#34d399" : "#f87171") + cell("repressor", on ? "off DNA" : "on operator") + cell("z/y/a", on ? "transcribed" : "blocked", on ? "#34d399" : "#f87171"));
    if(on) verdict("<b>Section 5.8.1:</b> <b>lactose/allolactose inactivates repressor</b>; polymerase transcribes <b>z (beta-gal), y (permease), a (transacetylase)</b>. i = <b>inhibitor</b>, not inducer.");
    else verdict("<b>Exercise 10:</b> enzymes consume the inducer; freed <b>repressor rebinds o</b> and shuts the operon — substrate induces its own enzymes (<b>negative regulation</b>).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["hgp-fingerprinting"] = (function(){
  var suspect = "B";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>VNTR bands (0.1-20 kb)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Scene match</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-a">Suspect A</button>' +
      '<button class="preset-btn active" id="p-b">Suspect B (scene match)</button>' +
      '<button class="preset-btn" id="p-c">Suspect C</button>';
    document.getElementById("p-a").onclick = function(){ setActivePreset(this); suspect = "A"; draw(App.state.t); };
    document.getElementById("p-b").onclick = function(){ setActivePreset(this); suspect = "B"; draw(App.state.t); };
    document.getElementById("p-c").onclick = function(){ setActivePreset(this); suspect = "C"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>HGP portrait</span><span class="val">3164.7 Mb</span></div>' +
      '<div style="font-size:12px;color:#94a3b8">~30,000 genes; &lt;2% coding; chr1 2968 / Y 231; 1.4M SNPs; 99.9% identical</div></div>';
    draw(0);
  }
  function lane(x, bands, label, hi){
    var s = '<rect x="' + (x - 45) + '" y="70" width="90" height="180" fill="#0f1f2e" stroke="' + (hi ? '#34d399' : '#334155') + '" stroke-width="' + (hi ? 3 : 1) + '"/>';
    for(var i = 0; i < bands.length; i++){
      s += '<rect x="' + (x - 32) + '" y="' + bands[i] + '" width="64" height="8" rx="2" fill="' + (hi ? '#34d399' : '#38bdf8') + '"/>';
    }
    s += '<text x="' + x + '" y="268" fill="' + (hi ? '#34d399' : '#94a3b8') + '" font-size="12" text-anchor="middle">' + label + '</text>';
    return s;
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var scene = [95, 130, 170, 205];
    var A = [95, 145, 175, 220];
    var B = [95, 130, 170, 205];
    var C = [100, 140, 185, 215];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="26" fill="#94a3b8" font-size="13" text-anchor="middle">Jeffreys VNTR-Southern blot: isolate - restrict - electrophorese - blot - probe - autoradiograph (Sec 5.10)</text>';
    var pick = suspect === "A" ? A : (suspect === "B" ? B : C);
    var matchA = (suspect === "A") && (A.join() === scene.join());
    var matchB = (suspect === "B") && (B.join() === scene.join());
    var matchC = (suspect === "C") && (C.join() === scene.join());
    m += lane(150, scene, "crime scene", true);
    m += lane(300, A, "suspect A", suspect === "A");
    m += lane(450, B, "suspect B", suspect === "B");
    m += lane(600, C, "suspect C", suspect === "C");
    var isMatch = pick.join() === scene.join();
    var glow = 0.6 + 0.4 * Math.sin(t * 3);
    if(isMatch){
      m += '<line x1="195" y1="' + (130 + glow * 6) + '" x2="405" y2="130" stroke="#34d399" stroke-width="2" stroke-dasharray="5 4"/>';
      m += '<text x="300" y="55" fill="#34d399" font-size="13" text-anchor="middle">MATCH: suspect ' + suspect + ' bands = scene (Fig. 5.16 logic)</text>';
    } else {
      m += '<text x="360" y="55" fill="#f87171" font-size="13" text-anchor="middle">NO MATCH: suspect ' + suspect + ' bands differ - exclude</text>';
    }
    m += '<text x="360" y="290" fill="#94a3b8" font-size="11" text-anchor="middle">HGP 1990-2003; 3 x 10^9 bp; 3300 books; BAC/YAC + Sanger; PCR -&gt; single-cell; twins excepted.</text>';
    svg.innerHTML = m;
    readout(cell("scene bands", scene.length) + cell("suspect " + suspect, isMatch ? "MATCH" : "no match", isMatch ? "#34d399" : "#f87171") + cell("probe", "VNTR mini-satellite") + cell("differing bp", "~3 million"));
    if(isMatch) verdict("<b>Exercise 13 / Fig. 5.16:</b> suspect <b>" + suspect + "</b> matches the scene — VNTR copy-number patterns are unique per individual (identical twins excepted). Uses: <b>forensics, paternity, diversity</b>.");
    else verdict("<b>Section 5.10:</b> 0.1% of 3 x 10^9 = <b>3 million</b> differing bp; <b>polymorphism (&gt;0.01)</b> in <b>VNTR 0.1-20 kb</b> gives unique Southern bands. Select another suspect to find the Fig. 5.16-style match.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS.helix = window.SIMS["dna-structure-packaging"];
window.SIMS.transformation = window.SIMS["genetic-material-search"];
window.SIMS.replication = window.SIMS["dna-replication"];
window.SIMS.transcription = window.SIMS["transcription-unit"];
window.SIMS.codon = window.SIMS["genetic-code-trna-mutation"];
window.SIMS.translation = window.SIMS["translation-synthesis"];
window.SIMS.lacoperon = window.SIMS["lac-operon-regulation"];
window.SIMS.fingerprint = window.SIMS["hgp-fingerprinting"];
