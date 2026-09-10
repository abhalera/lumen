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

window.SIMS["principles-first-rdna"] = (function(){
  var step = 4;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Salmonella plasmid (ori)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Resistance gene</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>E. coli clones</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-s0">Step 0: bare fragment</button>' +
      '<button class="preset-btn" id="p-s2">Step 2: cut + ligate</button>' +
      '<button class="preset-btn active" id="p-s4">Step 4: 1972 clone</button>';
    document.getElementById("p-s0").onclick = function(){ setActivePreset(this); step=0; draw(App.state.t); };
    document.getElementById("p-s2").onclick = function(){ setActivePreset(this); step=2; draw(App.state.t); };
    document.getElementById("p-s4").onclick = function(){ setActivePreset(this); step=4; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Construction step</span><span class="val" id="ctrl-st">4</span></div>' +
      '<input type="range" id="ctrl-st-range" min="0" max="4" step="1" value="4"></div>';
    document.getElementById("ctrl-st-range").oninput = function(){ step = Number(this.value); draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var se = document.getElementById("ctrl-st"); if(se) se.textContent = step;
    var sr = document.getElementById("ctrl-st-range"); if(sr && Number(sr.value) !== step) sr.value = step;
    var anim = Math.min(4, step + Math.floor(t));
    if(step === 4) anim = 4;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Cohen + Boyer 1972: resistance gene + Salmonella plasmid -ligase- into E. coli</text>';
    m += '<circle cx="150" cy="150" r="52" fill="none" stroke="#38bdf8" stroke-width="3"/>';
    m += '<circle cx="150" cy="98" r="6" fill="#38bdf8"/><text x="150" y="82" fill="#38bdf8" font-size="11" text-anchor="middle">ori</text>';
    m += '<text x="150" y="240" fill="#94a3b8" font-size="12" text-anchor="middle">Salmonella plasmid</text>';
    var gx = 330, gy = 120 + Math.sin(t * 2) * 4;
    m += '<rect x="' + gx + '" y="' + gy + '" width="120" height="26" rx="6" fill="' + (anim >= 1 ? '#f59e0b' : '#475569') + '"/>';
    m += '<text x="' + (gx + 60) + '" y="' + (gy + 18) + '" fill="#09131d" font-size="11" text-anchor="middle">resistance gene</text>';
    if(anim >= 2){
      m += '<line x1="230" y1="150" x2="330" y2="133" stroke="#f87171" stroke-width="2" stroke-dasharray="5 4"/>';
      m += '<text x="280" y="115" fill="#f87171" font-size="11" text-anchor="middle">ligase</text>';
    }
    if(anim >= 3){
      m += '<circle cx="560" cy="150" r="52" fill="none" stroke="#34d399" stroke-width="3"/>';
      m += '<rect x="520" y="138" width="80" height="22" rx="6" fill="#f59e0b"/>';
      m += '<circle cx="560" cy="100" r="6" fill="#38bdf8"/>';
      m += '<text x="560" y="240" fill="#94a3b8" font-size="12" text-anchor="middle">rDNA in E. coli</text>';
    }
    if(anim >= 4){
      for(var i=0;i<4;i++){
        var cx = 490 + i * 46;
        m += '<circle cx="' + cx + '" cy="262" r="14" fill="#0f1f2e" stroke="#34d399"/>';
        m += '<circle cx="' + cx + '" cy="262" r="7" fill="none" stroke="#34d399"/>';
      }
      m += '<text x="560" y="292" fill="#34d399" font-size="11" text-anchor="middle">clones: antibiotic resistance copied</text>';
    }
    if(anim === 0){
      m += '<text x="470" y="150" fill="#f87171" font-size="13">bare fragment, no ori: LOST</text>';
    }
    svg.innerHTML = m;
    readout(cell("step", anim + " / 4") + cell("ori linked?", anim >= 2 ? "yes" : "no", anim >= 2 ? "#34d399" : "#f87171") + cell("fate", anim >= 4 ? "cloned" : (anim === 0 ? "lost" : "building"), "#38bdf8"));
    if(anim === 0) verdict("<b>Section 9.1 prediction:</b> a bare resistance fragment with no ori cannot multiply in progeny cells — it is lost. Only ori-linked DNA is cloned.");
    else if(anim < 4) verdict("<b>Section 9.1:</b> cut the resistance gene from the <b>Salmonella typhimurium</b> plasmid with restriction enzymes, join with <b>DNA ligase</b> — sticky ends make the pasting precise.");
    else verdict("<b>Cohen + Boyer, 1972 (Section 9.1):</b> resistance gene + Salmonella plasmid -ligase- rDNA -<b>E. coli</b>- clones. Three steps: identify desirable DNA, introduce into host, maintain + inherit.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["rdna"] = window.SIMS["principles-first-rdna"];

window.SIMS["restriction-enzymes"] = (function(){
  var seq = "GAATTC";
  var circular = false;
  var nSites = 2;
  var NAMES = { "GAATTC": "EcoRI", "GGATCC": "BamHI", "AAGCTT": "HindIII", "GTCGAC": "SalI" };
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>DNA backbone</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>EcoRI cut G|AATTC</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Sticky ends</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-eco">EcoRI GAATTC</button>' +
      '<button class="preset-btn" id="p-bam">BamHI GGATCC</button>' +
      '<button class="preset-btn" id="p-hind">HindIII AAGCTT</button>' +
      '<button class="preset-btn" id="p-lin">Linear</button>' +
      '<button class="preset-btn" id="p-cir">Circular</button>';
    document.getElementById("p-eco").onclick = function(){ setActivePreset(this); seq="GAATTC"; draw(App.state.t); };
    document.getElementById("p-bam").onclick = function(){ setActivePreset(this); seq="GGATCC"; draw(App.state.t); };
    document.getElementById("p-hind").onclick = function(){ setActivePreset(this); seq="AAGCTT"; draw(App.state.t); };
    document.getElementById("p-lin").onclick = function(){ circular=false; draw(App.state.t); };
    document.getElementById("p-cir").onclick = function(){ circular=true; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Recognition sites (n)</span><span class="val" id="ctrl-n">2</span></div>' +
      '<input type="range" id="ctrl-n-range" min="0" max="3" step="1" value="2"></div>';
    document.getElementById("ctrl-n-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function isPal(s){
    var comp = { A: "T", T: "A", G: "C", C: "G" };
    var r = "";
    for(var i=s.length-1;i>=0;i--){ r += comp[s[i]] || "?"; }
    return r === s;
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    nSites = numEl("ctrl-n-range", 2);
    var el = document.getElementById("ctrl-n"); if(el) el.textContent = nSites;
    var frags = circular ? nSites : (nSites + 1);
    if(nSites === 0) frags = 1;
    var pal = isPal(seq) ? "YES" : "NO";
    var ename = NAMES[seq] || "EcoRI";
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">5\u2032-' + seq + '-3\u2032 / 3\u2032-complement-5\u2032: palindrome? ' + pal + ' (' + ename + ')</text>';
    m += '<text x="80" y="70" fill="#e2e8f0" font-size="13">5\u2032-G|AATTC-3\u2032</text>';
    m += '<text x="80" y="90" fill="#94a3b8" font-size="13">3\u2032-CTTAA|G-5\u2032</text>';
    var y0 = 130;
    if(!circular){
      m += '<line x1="80" y1="' + y0 + '" x2="640" y2="' + y0 + '" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>';
      for(var i=0;i<nSites;i++){
        var cx = 180 + i * 140;
        var bob = Math.sin(t * 3 + i) * 3;
        m += '<line x1="' + cx + '" y1="' + (y0 - 16 + bob) + '" x2="' + cx + '" y2="' + (y0 + 16 + bob) + '" stroke="#f87171" stroke-width="3"/>';
        m += '<text x="' + cx + '" y="' + (y0 - 22 + bob) + '" fill="#f87171" font-size="11" text-anchor="middle">cut</text>';
      }
      var segY = 190;
      for(var f=0;f<frags;f++){
        var fx = 90 + f * 130;
        var fw = Math.max(40, 110 - f * 12);
        m += '<rect x="' + fx + '" y="' + segY + '" width="' + fw + '" height="20" rx="4" fill="#1e293b" stroke="#f59e0b"/>';
        m += '<rect x="' + fx + '" y="' + segY + '" width="12" height="20" fill="#f59e0b" opacity="0.7"/>';
      }
      m += '<text x="80" y="240" fill="#94a3b8" font-size="12">Linear DNA, ' + nSites + ' sites: ' + frags + ' fragments (n+1). e.g. 10 kb cut at 3,7 kb: 3 + 4 + 3 kb.</text>';
    } else {
      m += '<circle cx="300" cy="160" r="60" fill="none" stroke="#38bdf8" stroke-width="8"/>';
      for(var j=0;j<nSites;j++){
        var a = -Math.PI/2 + j * 2 * Math.PI / Math.max(1, nSites) + t * 0.3;
        var px = 300 + 60 * Math.cos(a), py = 160 + 60 * Math.sin(a);
        m += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="7" fill="#f87171"/>';
      }
      m += '<text x="480" y="140" fill="#e2e8f0" font-size="14">Circular plasmid</text>';
      m += '<text x="480" y="164" fill="#f87171" font-size="13">' + nSites + ' EcoRI cuts</text>';
      m += '<text x="480" y="188" fill="#f59e0b" font-size="14">' + frags + ' fragments (n on circle)</text>';
      m += '<text x="80" y="260" fill="#94a3b8" font-size="12">Cut once: 1 linear band. Cut at 3: 3 bands on the gel.</text>';
    }
    m += '<text x="80" y="282" fill="#64748b" font-size="11">Same enzyme on vector + insert or sticky ends cannot pair (Figure 9.2 rule).</text>';
    svg.innerHTML = m;
    readout(cell("site", "5\u2032-" + seq + "-3\u2032") + cell("palindrome", pal, "#34d399") + cell("n", String(nSites)) + cell("fragments", String(frags), "#f59e0b"));
    verdict("<b>Figure 9.1 / Exercise 2:</b> <b>EcoRI</b> (E. coli RY 13, 1st enzyme) reads <b>5\u2032-GAATTC-3\u2032</b> identically 5\u2032-3\u2032 on both strands (MALAYALAM rule), cuts G|AATTC off-centre. Linear n sites give <b>n+1</b> fragments; circular give <b>n</b> (Exercise 7: GAATTC, GGATCC, AAGCTT verify by reverse-complement).");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["restriction"] = window.SIMS["restriction-enzymes"];

window.SIMS["vectors-pbr322"] = (function(){
  var mode = "intact";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>ori + rop</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>ampR</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>tetR</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Insert</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-int">Intact pBR322</button>' +
      '<button class="preset-btn" id="p-bam">BamHI insert in tetR</button>' +
      '<button class="preset-btn" id="p-pst">PstI insert in ampR</button>';
    document.getElementById("p-int").onclick = function(){ setActivePreset(this); mode="intact"; draw(App.state.t); };
    document.getElementById("p-bam").onclick = function(){ setActivePreset(this); mode="bam"; draw(App.state.t); };
    document.getElementById("p-pst").onclick = function(){ setActivePreset(this); mode="pst"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Replica-plate colonies on tetracycline</span><span class="val" id="ctrl-r">140/200 grow</span></div>' +
      '<input type="range" id="ctrl-r-range" min="0" max="200" step="10" value="140"></div>';
    document.getElementById("ctrl-r-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var grow = numEl("ctrl-r-range", 140);
    var el = document.getElementById("ctrl-r"); if(el) el.textContent = grow + "/200 grow";
    var recomb = 200 - grow;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">pBR322 (4361 bp): ori + ampR + tetR + rop; 7 sites incl. HindIII EcoRI BamHI SalI PvuII PstI ClaI</text>';
    var cx = 220, cy = 160, r = 78;
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#334155" stroke-width="14"/>';
    m += '<path d="M ' + cx + ' ' + (cy - r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + '" fill="none" stroke="#34d399" stroke-width="14"/>';
    m += '<path d="M ' + (cx + r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + cx + ' ' + (cy + r) + '" fill="none" stroke="' + (mode === "bam" ? "#475569" : "#f59e0b") + '" stroke-width="14"/>';
    m += '<text x="' + (cx + 62) + '" y="' + (cy + 62) + '" fill="#f59e0b" font-size="12">tetR</text>';
    m += '<text x="' + (cx + 62) + '" y="' + (cy - 52) + '" fill="#34d399" font-size="12">ampR</text>';
    m += '<circle cx="' + cx + '" cy="' + (cy - r) + '" r="7" fill="#38bdf8"/>';
    m += '<text x="' + cx + '" y="' + (cy - r - 12) + '" fill="#38bdf8" font-size="11" text-anchor="middle">ori</text>';
    m += '<text x="' + cx + '" y="' + (cy + 6) + '" fill="#64748b" font-size="11" text-anchor="middle">rop</text>';
    if(mode !== "intact"){
      var ix = mode === "bam" ? (cx + r - 6) : (cx + r - 6);
      var iy = mode === "bam" ? (cy + 40) : (cy - 40);
      m += '<rect x="' + (ix - 14) + '" y="' + (iy - 12) + '" width="28" height="24" fill="#f87171" stroke="#fff"/>';
      m += '<text x="' + ix + '" y="' + (iy + 26) + '" fill="#f87171" font-size="11" text-anchor="middle">insert</text>';
    }
    var amp = "resistant", tet = "resistant", col = "blue";
    if(mode === "bam"){ tet = "SENSITIVE (split)"; col = "white"; }
    if(mode === "pst"){ amp = "SENSITIVE (split)"; col = "white"; }
    m += '<rect x="380" y="60" width="280" height="180" rx="8" fill="#0f1f2e" stroke="#334155"/>';
    m += '<text x="520" y="84" fill="#e2e8f0" font-size="13" text-anchor="middle">Replica plating readout</text>';
    m += '<text x="400" y="112" fill="#34d399" font-size="13">amp: ' + amp + '</text>';
    m += '<text x="400" y="136" fill="#f59e0b" font-size="13">tet: ' + tet + '</text>';
    m += '<text x="400" y="162" fill="#e2e8f0" font-size="13">beta-gal plate: ' + col + '</text>';
    var pulse = 0.6 + 0.4 * Math.sin(t * 4);
    m += '<circle cx="610" cy="150" r="' + (14 + 6 * pulse).toFixed(1) + '" fill="' + (col === "white" ? "#f8fafc" : "#2563eb") + '" opacity="0.9"/>';
    m += '<text x="400" y="200" fill="#94a3b8" font-size="12">recombinants = ' + recomb + '/200 (' + Math.round(recomb / 2) + '%)</text>';
    m += '<text x="400" y="220" fill="#64748b" font-size="11">Insert in tetR: grows on amp, dies on tet.</text>';
    svg.innerHTML = m;
    readout(cell("ampR", mode === "pst" ? "off" : "on", "#34d399") + cell("tetR", mode === "bam" ? "off" : "on", "#f59e0b") + cell("recombinants", recomb + "/200") + cell("colour", col));
    if(mode === "intact") verdict("<b>Figure 9.4 (Section 9.2.2):</b> intact pBR322 — ori starts replication (copy number), ampR + tetR select transformants, single cloning sites avoid shattering. No insert: <b>blue</b> colonies on chromogenic substrate.");
    else if(mode === "bam") verdict("<b>Section 9.2.2:</b> BamHI insert inside <b>tetR</b> inactivates it — recombinants grow on ampicillin but <b>not tetracycline</b>; beta-gal insert gives <b>white</b> colonies. That amp-only signature is the recombinant.");
    else verdict("<b>Section 9.2.2:</b> PstI insert inside <b>ampR</b> inactivates ampicillin resistance instead — mirror logic. Disarmed <b>Ti plasmids</b> (plants) and retroviruses (animals) extend vectors to eukaryotes.");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["pbr322"] = window.SIMS["vectors-pbr322"];

window.SIMS["isolation-cutting-gel"] = (function(){
  var lanes = "digest";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#fb923c;"></span><span>EtBr orange bands (UV)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Wells (cathode, -)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Anode (+) — DNA runs here</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-und">Lane 1: undigested</button>' +
      '<button class="preset-btn active" id="p-dig">Lanes 2-4: digested</button>';
    document.getElementById("p-und").onclick = function(){ setActivePreset(this); lanes="undigested"; draw(App.state.t); };
    document.getElementById("p-dig").onclick = function(){ setActivePreset(this); lanes="digest"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Run time (migration)</span><span class="val" id="ctrl-rt">3.0</span></div>' +
      '<input type="range" id="ctrl-rt-range" min="0" max="6" step="0.1" value="3"></div>';
    document.getElementById("ctrl-rt-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var rt = numEl("ctrl-rt-range", 3);
    var el = document.getElementById("ctrl-rt"); if(el) el.textContent = rt.toFixed(1);
    var run = rt + t * 0.4;
    function dist(kb){ return Math.min(190, (Math.log(12 / kb) / Math.log(12 / 0.5)) * 190 * (0.5 + run / 6)); }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Agarose (sea-weed polymer) sieves by size: small runs farthest toward anode</text>';
    m += '<rect x="80" y="44" width="560" height="226" rx="6" fill="#0f2537" stroke="#334155"/>';
    m += '<text x="100" y="62" fill="#38bdf8" font-size="11">wells (-)</text>';
    m += '<text x="600" y="262" fill="#f87171" font-size="11">anode (+)</text>';
    for(var L=0;L<4;L++){
      var lx = 140 + L * 120;
      m += '<rect x="' + lx + '" y="56" width="44" height="12" fill="#020617" stroke="#38bdf8"/>';
      var bands;
      if(lanes === "undigested" || L === 0){ bands = [10]; }
      else if(L === 1){ bands = [4, 3, 3]; }
      else if(L === 2){ bands = [5, 2.5, 1.5, 1]; }
      else { bands = [6, 4]; }
      for(var b=0;b<bands.length;b++){
        var kb = bands[b];
        var by = 78 + dist(kb);
        m += '<rect x="' + (lx - 6) + '" y="' + by.toFixed(1) + '" width="56" height="7" rx="3" fill="#fb923c" opacity="0.95"/>';
      }
      m += '<text x="' + (lx + 22) + '" y="286" fill="#64748b" font-size="11" text-anchor="middle">lane ' + (L + 1) + '</text>';
    }
    m += '<text x="80" y="292" fill="#64748b" font-size="11">Lysozyme/cellulase/chitinase open cells; RNase + protease clean; chilled ethanol spools DNA (Fig 9.5).</text>';
    svg.innerHTML = m;
    readout(cell("lanes", lanes === "digest" ? "1 + 3 digested" : "undigested") + cell("rule", "small = far", "#fb923c") + cell("stain", "EtBr + UV", "#f59e0b") + cell("next", "elution + ligase"));
    if(lanes === "undigested") verdict("<b>Figure 9.3 lane 1 (Section 9.3.2):</b> undigested DNA sits as one slow heavy band near the well. DNA is negative, so it flees toward the <b>anode (+)</b> through <b>agarose from sea weeds</b>.");
    else verdict("<b>Figure 9.3 lanes 2-4 (Section 9.3.2):</b> digested lanes scatter into several faster orange bands (<b>EtBr + UV</b>). Cut out bands, extract DNA (<b>elution</b>), ligate to vector cut with the <b>same enzyme</b>. 4-site circular plasmid gives <b>4 bands</b> (Exercise-style count).");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["gel"] = window.SIMS["isolation-cutting-gel"];

window.SIMS["pcr-host-insertion"] = (function(){
  var n0 = 1;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Denaturation (heat splits)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Primer annealing</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Extension (Taq)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-n1">N0 = 1 molecule</button>' +
      '<button class="preset-btn" id="p-n10">N0 = 10 molecules</button>' +
      '<button class="preset-btn" id="p-ca">Ca2+ heat-shock route</button>';
    document.getElementById("p-n1").onclick = function(){ setActivePreset(this); n0=1; draw(App.state.t); };
    document.getElementById("p-n10").onclick = function(){ setActivePreset(this); n0=10; draw(App.state.t); };
    document.getElementById("p-ca").onclick = function(){ setActivePreset(this); draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>PCR cycles (n)</span><span class="val" id="ctrl-cy">20</span></div>' +
      '<input type="range" id="ctrl-cy-range" min="0" max="30" step="1" value="20"></div>';
    document.getElementById("ctrl-cy-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function fmt(n){
    if(n >= 1e9) return (n / 1e9).toFixed(2) + " x 10^9";
    if(n >= 1e6) return (n / 1e6).toFixed(2) + " x 10^6";
    if(n >= 1e3) return (n / 1e3).toFixed(2) + " x 10^3";
    return String(n);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var n = Math.round(numEl("ctrl-cy-range", 20));
    var el = document.getElementById("ctrl-cy"); if(el) el.textContent = n;
    var copies = n0 * Math.pow(2, n);
    var phase = Math.floor(t * 1.5) % 3;
    var names = ["DENATURE ~94C: dsDNA splits", "ANNEAL ~54C: 2 primer sets bind", "EXTEND ~72C: Taq (Thermus aquaticus) builds"];
    var cols = ["#f87171", "#38bdf8", "#34d399"];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">N = N0 x 2^n: 2^10 ~ 10^3, 2^20 ~ 10^6, 2^30 ~ 1.07 x 10^9 (Fig 9.6)</text>';
    for(var i=0;i<3;i++){
      var bx = 80 + i * 200;
      m += '<rect x="' + bx + '" y="50" width="180" height="64" rx="8" fill="' + (phase === i ? cols[i] : '#0f1f2e') + '" stroke="' + cols[i] + '"/>';
      m += '<text x="' + (bx + 90) + '" y="78" fill="' + (phase === i ? '#09131d' : '#e2e8f0') + '" font-size="12" text-anchor="middle">' + names[i].split(":")[0] + '</text>';
      m += '<text x="' + (bx + 90) + '" y="98" fill="' + (phase === i ? '#09131d' : '#94a3b8') + '" font-size="11" text-anchor="middle">' + names[i].split(": ")[1] + '</text>';
    }
    var barW = Math.min(560, 40 + (n / 30) * 520);
    m += '<rect x="80" y="140" width="560" height="26" rx="6" fill="#0f1f2e" stroke="#334155"/>';
    m += '<rect x="80" y="140" width="' + barW.toFixed(0) + '" height="26" rx="6" fill="#34d399"/>';
    m += '<text x="360" y="186" fill="#e2e8f0" font-size="16" text-anchor="middle">n = ' + n + '  -&gt;  N = ' + n0 + ' x 2^' + n + ' = ' + fmt(copies) + ' copies</text>';
    m += '<text x="360" y="210" fill="#94a3b8" font-size="12" text-anchor="middle">2^10 = 1024  |  2^20 = 10,48,576  |  2^30 = 1,07,37,41,824 ~ 1.07 billion</text>';
    var dots = Math.min(40, 2 + n);
    for(var d=0;d<dots;d++){
      var px = 100 + (d * 53 + Math.floor(t * 40)) % 520;
      var py = 232 + (d * 29) % 40;
      m += '<circle cx="' + px + '" cy="' + py + '" r="4" fill="#34d399" opacity="0.85"/>';
    }
    m += '<text x="80" y="292" fill="#64748b" font-size="11">Delivery: Ca2+ competent + ice - 42C shock - ice; micro-injection (animals); gene gun Au/W (plants); disarmed vectors.</text>';
    svg.innerHTML = m;
    readout(cell("n", String(n)) + cell("N0", String(n0)) + cell("N = N0 2^n", fmt(copies), "#34d399") + cell("phase", ["denature", "anneal", "extend"][phase], cols[phase]));
    verdict("<b>Section 9.3.3 (Fig 9.6):</b> only thermostable <b>Taq from Thermus aquaticus</b> survives denaturation — ordinary polymerase cooks. 30 cycles from 1 molecule give <b>2^30 = 1,07,37,41,824 (~1.07 x 10^9)</b>. DNA is hydrophilic, so bacteria need <b>Ca2+ + ice - 42 C - ice</b> competence (<b>Section 9.3.4</b>).");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["pcr"] = window.SIMS["pcr-host-insertion"];

window.SIMS["bioreactor-downstream"] = (function(){
  var sparged = false;
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Culture (100-1000 L)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Stirrer / agitator + O2</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Sterile-air sparge</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-stir">Simple stirred-tank (Fig 9.7a)</button>' +
      '<button class="preset-btn" id="p-spar">Sparged stirred-tank (Fig 9.7b)</button>';
    document.getElementById("p-stir").onclick = function(){ setActivePreset(this); sparged=false; draw(App.state.t); };
    document.getElementById("p-spar").onclick = function(){ setActivePreset(this); sparged=true; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Working volume / L</span><span class="val" id="ctrl-v">500</span></div>' +
      '<input type="range" id="ctrl-v-range" min="100" max="1000" step="50" value="500"></div>' +
      '<div class="control-item"><div class="control-label"><span>Downstream stage</span><span class="val" id="ctrl-d">purify</span></div>' +
      '<input type="range" id="ctrl-d-range" min="0" max="4" step="1" value="1"></div>';
    document.getElementById("ctrl-v-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-d-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var V = numEl("ctrl-v-range", 500);
    var di = Math.round(numEl("ctrl-d-range", 1));
    var ve = document.getElementById("ctrl-v"); if(ve) ve.textContent = V;
    var stages = ["separate", "purify", "formulate", "trial", "QC"];
    var de = document.getElementById("ctrl-d"); if(de) de.textContent = stages[di];
    var fold = (V / 5).toFixed(0);
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Continuous culture holds log phase; 5 L lab x ' + fold + ' = ' + V + ' L stirred-tank run</text>';
    m += '<rect x="60" y="50" width="170" height="200" rx="10" fill="#0f2f3f" stroke="#38bdf8"/>';
    var lvl = 90 + (V / 1000) * 140;
    m += '<rect x="68" y="' + (242 - lvl).toFixed(0) + '" width="154" height="' + lvl.toFixed(0) + '" fill="#164e63"/>';
    m += '<line x1="145" y1="50" x2="145" y2="230" stroke="#94a3b8" stroke-width="5"/>';
    var ang = t * 3;
    m += '<line x1="' + (145 - 40 * Math.cos(ang)).toFixed(1) + '" y1="200" x2="' + (145 + 40 * Math.cos(ang)).toFixed(1) + '" y2="200" stroke="#e2e8f0" stroke-width="6" stroke-linecap="round"/>';
    if(sparged){
      for(var i=0;i<8;i++){
        var bx = 100 + (i * 19) % 90;
        var by = 230 - ((t * 50 + i * 27) % 150);
        m += '<circle cx="' + bx + '" cy="' + by.toFixed(1) + '" r="4" fill="none" stroke="#34d399"/>';
      }
      m += '<text x="145" y="268" fill="#34d399" font-size="11" text-anchor="middle">sparged: sterile air bubbles</text>';
    } else {
      m += '<text x="145" y="268" fill="#94a3b8" font-size="11" text-anchor="middle">simple: stirrer mixes + O2</text>';
    }
    m += '<text x="145" y="44" fill="#94a3b8" font-size="11" text-anchor="middle">foam/T/pH controls + ports</text>';
    for(var k=0;k<5;k++){
      var sx = 260 + k * 92;
      var active = (k === di);
      var done = (k < di);
      m += '<rect x="' + sx + '" y="110" width="80" height="52" rx="6" fill="' + (active ? '#f59e0b' : (done ? '#134e4a' : '#0f1f2e')) + '" stroke="' + (active ? '#fff' : '#334155') + '"/>';
      m += '<text x="' + (sx + 40) + '" y="' + (132) + '" fill="' + (active ? '#09131d' : '#e2e8f0') + '" font-size="10" text-anchor="middle">' + stages[k] + '</text>';
      m += '<text x="' + (sx + 40) + '" y="' + (148) + '" fill="' + (active ? '#09131d' : '#64748b') + '" font-size="10" text-anchor="middle">' + (k + 1) + '/5</text>';
      if(k < 4) m += '<line x1="' + (sx + 80) + '" y1="136" x2="' + (sx + 92) + '" y2="136" stroke="#475569" stroke-width="2"/>';
    }
    m += '<text x="480" y="200" fill="#e2e8f0" font-size="13" text-anchor="middle">Recombinant protein in heterologous host</text>';
    m += '<text x="480" y="222" fill="#94a3b8" font-size="12" text-anchor="middle">drain used + feed fresh = log phase held</text>';
    svg.innerHTML = m;
    readout(cell("volume", V + " L") + cell("scale", "x" + fold + " vs 5 L", "#38bdf8") + cell("tank", sparged ? "sparged" : "stirred", "#34d399") + cell("downstream", stages[di], "#f59e0b"));
    verdict("<b>Figure 9.7 / Exercise 6 (Sections 9.3.5-9.3.6):</b> " + (sparged ? "sparged tank adds <b>sterile-air bubbling</b> to stirrer mixing. " : "Stirrer mixes evenly and supplies oxygen. ") + "Beyond aeration/mixing: <b>100-1000 L</b> scale + foam/temperature/pH control + sampling ports. Downstream: <b>separate - purify - formulate (+preservatives) - clinical trials - QC</b> (product-specific).");
  }
  return { mount: mount, draw: draw };
})();
window.SIMS["bioreactor"] = window.SIMS["bioreactor-downstream"];
