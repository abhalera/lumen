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
function canon(a, b){
  if(a === b) return a + b;
  return (a < b) ? a + b : b + a;
}
function gametesOf(g){
  if(g.charAt(0) === g.charAt(1)) return [g.charAt(0)];
  return [g.charAt(0), g.charAt(1)];
}

window.SIMS["mendel-one-gene"] = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Dominant phenotype</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Heterozygote (hidden allele)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Recessive phenotype</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-f2">F2: Tt x Tt (3:1)</button>' +
      '<button class="preset-btn" id="p-test">Ex 5: test cross Tt x tt (1:1)</button>' +
      '<button class="preset-btn" id="p-snap">Snapdragon Rr x Rr (1:2:1)</button>' +
      '<button class="preset-btn" id="p-f1">P: TT x tt (all Tt)</button>';
    document.getElementById("p-f2").onclick = function(){ setActivePreset(this); setP("Tt", "Tt", "pea"); draw(App.state.t); };
    document.getElementById("p-test").onclick = function(){ setActivePreset(this); setP("Tt", "tt", "pea"); draw(App.state.t); };
    document.getElementById("p-snap").onclick = function(){ setActivePreset(this); setP("Rr", "Rr", "snap"); draw(App.state.t); };
    document.getElementById("p-f1").onclick = function(){ setActivePreset(this); setP("TT", "tt", "pea"); draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Parent 1</span><span class="val" id="ctrl-p1">Tt</span></div>' +
      '<select id="ctrl-p1sel"><option>TT</option><option selected>Tt</option><option>tt</option><option>RR</option><option>Rr</option><option>rr</option></select></div>' +
      '<div class="control-item"><div class="control-label"><span>Parent 2</span><span class="val" id="ctrl-p2">Tt</span></div>' +
      '<select id="ctrl-p2sel"><option>TT</option><option selected>Tt</option><option>tt</option><option>RR</option><option>Rr</option><option>rr</option></select></div>' +
      '<div class="control-item"><div class="control-label"><span>Trait</span><span class="val" id="ctrl-tr">pea height</span></div>' +
      '<select id="ctrl-trsel"><option value="pea">pea height (T/t, complete)</option><option value="snap">snapdragon (R/r, incomplete)</option></select></div>' +
      '<div class="control-item"><div class="control-label"><span>Offspring counted</span><span class="val" id="ctrl-n">960</span></div>' +
      '<input type="range" id="ctrl-n-range" min="4" max="1600" step="4" value="960"></div>';
    document.getElementById("ctrl-p1sel").onchange = function(){ draw(App.state.t); };
    document.getElementById("ctrl-p2sel").onchange = function(){ draw(App.state.t); };
    document.getElementById("ctrl-trsel").onchange = function(){ draw(App.state.t); };
    document.getElementById("ctrl-n-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function setP(a, b, tr){
    var s1 = document.getElementById("ctrl-p1sel"), s2 = document.getElementById("ctrl-p2sel"), st = document.getElementById("ctrl-trsel");
    if(tr === "snap"){ if(s1) s1.value = a.replace(/T/g, "R").replace(/t/g, "r"); if(s2) s2.value = b.replace(/T/g, "R").replace(/t/g, "r"); }
    else { if(s1) s1.value = a; if(s2) s2.value = b; }
    if(st) st.value = tr;
  }
  function phenoOf(g, trait){
    if(trait === "snap"){
      if(g === "RR") return "red";
      if(g === "rr") return "white";
      return "pink";
    }
    return (g.indexOf("T") >= 0) ? "tall" : "dwarf";
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var s1 = document.getElementById("ctrl-p1sel"), s2 = document.getElementById("ctrl-p2sel"), st = document.getElementById("ctrl-trsel");
    var p1 = s1 ? s1.value : "Tt", p2 = s2 ? s2.value : "Tt";
    var trait = st ? st.value : "pea";
    if(trait === "snap"){ p1 = p1.replace(/T/g, "R").replace(/t/g, "r"); p2 = p2.replace(/T/g, "R").replace(/t/g, "r"); }
    else { p1 = p1.replace(/R/g, "T").replace(/r/g, "t"); p2 = p2.replace(/R/g, "T").replace(/r/g, "t"); }
    var e1 = document.getElementById("ctrl-p1"); if(e1) e1.textContent = p1;
    var e2 = document.getElementById("ctrl-p2"); if(e2) e2.textContent = p2;
    var e3 = document.getElementById("ctrl-tr"); if(e3) e3.textContent = trait === "snap" ? "snapdragon" : "pea height";
    var N = Math.round(numEl("ctrl-n-range", 960));
    var en = document.getElementById("ctrl-n"); if(en) en.textContent = N;
    var gA = gametesOf(p1), gB = gametesOf(p2);
    var counts = {};
    var i, j;
    for(i=0;i<gA.length;i++) for(j=0;j<gB.length;j++){
      var g = canon(gA[i], gB[j]);
      counts[g] = (counts[g] || 0) + 1;
    }
    var total = gA.length * gB.length;
    var D = trait === "snap" ? "R" : "T", Rr = trait === "snap" ? "r" : "t";
    var cDD = counts[D+D] || 0, cDR = counts[D+Rr] || 0, cRR = counts[Rr+Rr] || 0;
    var ph = {}, k;
    for(k in counts){ var ph2 = phenoOf(k, trait); ph[ph2] = (ph[ph2] || 0) + counts[k]; }
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="200" y="24" fill="#94a3b8" font-size="13" text-anchor="middle">Punnett square: ' + p1 + ' x ' + p2 + ' (Reginald C. Punnett, Sec 4.2)</text>';
    var x0 = 90, y0 = 60, cw = 56, chh = 44;
    m += '<text x="' + (x0+cw/2) + '" y="' + (y0-8) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + gB.join(" / ") + '</text>';
    m += '<text x="' + (x0-14) + '" y="' + (y0+chh) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + gA.join("/") + '</text>';
    for(i=0;i<gA.length;i++) for(j=0;j<gB.length;j++){
      var gg = canon(gA[i], gB[j]);
      var p = phenoOf(gg, trait);
      var col = (trait === "snap") ? (gg === "Rr" ? "#f472b6" : (gg === "RR" ? "#ef4444" : "#e2e8f0")) : ((p === "tall") ? (gg === "Tt" ? "#f59e0b" : "#34d399") : "#94a3b8");
      m += '<rect x="' + (x0+j*cw) + '" y="' + (y0+i*chh) + '" width="' + cw + '" height="' + chh + '" fill="#0f1f2e" stroke="' + col + '" stroke-width="2"/>';
      m += '<text x="' + (x0+j*cw+cw/2) + '" y="' + (y0+i*chh+27) + '" fill="' + col + '" font-size="14" text-anchor="middle">' + gg + '</text>';
    }
    var dom = trait === "snap" ? "R" : "T", rec = trait === "snap" ? "r" : "t";
    m += '<text x="420" y="60" fill="#e2e8f0" font-size="14">gametes: (' + p1.split("").join(", ") + ') x (' + p2.split("").join(", ") + ')</text>';
    m += '<text x="420" y="86" fill="#38bdf8" font-size="13">genotypes ' + cDD + ' ' + dom + dom + ' : ' + cDR + ' ' + dom + rec + ' : ' + cRR + ' ' + rec + rec + '</text>';
    var phs = Object.keys(ph);
    var y = 110;
    for(var pi=0;pi<phs.length;pi++){
      var frac = ph[phs[pi]] / total;
      var exp = Math.round(N * frac);
      m += '<text x="420" y="' + y + '" fill="#e2e8f0" font-size="12">' + phs[pi] + ': ' + ph[phs[pi]] + '/' + total + ' -&gt; ' + exp + ' of ' + N + '</text>';
      y += 22;
    }
    m += '<text x="420" y="' + (y+6) + '" fill="#94a3b8" font-size="11">F1 of TT x tt all Tt tall;</text>';
    m += '<text x="420" y="' + (y+24) + '" fill="#94a3b8" font-size="11">dwarf F2 breeds true (tt)</text>';
    svg.innerHTML = m;
    var domPh = trait === "snap" ? "red" : "tall";
    readout(cell("cross", p1 + " x " + p2) + cell("genotypes", cDD + ":" + cDR + ":" + cRR, "#38bdf8") + cell(domPh + " frac", ((ph[domPh] || 0) / total).toFixed(2), "#34d399") + cell("N", String(N)));
    var key = p1 + "x" + p2;
    if(trait === "snap" && (key === "RrxRr")){
      verdict("<b>Section 4.2.2.1 (incomplete dominance):</b> RR red x rr white gives Rr pink; selfing gives <b>1 red : 2 pink : 1 white</b> — genotypes and phenotypes coincide 1:2:1. Of " + N + ", pink = <b>" + Math.round(N/2) + "</b> (quiz: 400 -&gt; 200).");
    } else if(key === "TtxTt"){
      verdict("<b>Section 4.2, F2:</b> Tt x Tt gametes (1/2T + 1/2t) squared = <b>1/4 TT : 1/2 Tt : 1/4 tt</b>; phenotypes <b>3 tall : 1 dwarf</b>. Of " + N + ": <b>" + Math.round(N*3/4) + " tall, " + Math.round(N/4) + " dwarf</b> (quiz: 960 -&gt; 720/240).");
    } else if(key === "TtxTt" || key === "ttxTt"){
      verdict("<b>Test cross, Fig. 4.5, Ex 5:</b> " + p1 + " x " + p2 + " gives <b>1 dominant : 1 recessive</b> — proves the tall parent was <b>heterozygous Tt</b>. Had it been TT, every child would be tall.");
    } else if(key === "TTxtt" || key === "ttxTT"){
      verdict("<b>Section 4.2, F1:</b> TT x tt gives <b>all Tt tall</b> — one parental trait only (Law of Dominance 4.2.1). Selfing this F1 recovers 3:1 in F2.");
    } else {
      verdict("<b>Sections 4.2-4.2.2:</b> homozygotes make one gamete type, heterozygotes two at 1/2 each (Law of Segregation). Read the grid: " + cDD + " " + dom + dom + " : " + cDR + " " + dom + rec + " : " + cRR + " " + rec + rec + ".");
    }
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["two-genes"] = (function(){
  var labels = {R: "round", r: "wrinkled", Y: "yellow", Y2: "green"};
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Round-yellow 9/16</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Wrinkled-yellow 3/16</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Round-green 3/16</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Wrinkled-green 1/16</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-di">Fig 4.7: RrYy x RrYy (9:3:3:1)</button>' +
      '<button class="preset-btn" id="p-ex7">Ex 7: TtYy x Ttyy (3/8, 1/8)</button>' +
      '<button class="preset-btn" id="p-tc">Test cross: RrYy x rryy</button>';
    document.getElementById("p-di").onclick = function(){ setActivePreset(this); setC("Rr", "Yy", "Rr", "Yy"); draw(App.state.t); };
    document.getElementById("p-ex7").onclick = function(){ setActivePreset(this); setC("Rr", "Yy", "Rr", "yy"); draw(App.state.t); };
    document.getElementById("p-tc").onclick = function(){ setActivePreset(this); setC("Rr", "Yy", "rr", "yy"); draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>P1 gene A / gene B</span><span class="val" id="ctrl-a">RrYy</span></div>' +
      '<select id="ctrl-a1"><option>RR</option><option selected>Rr</option><option>rr</option></select> ' +
      '<select id="ctrl-a2"><option>YY</option><option selected>Yy</option><option>yy</option></select></div>' +
      '<div class="control-item"><div class="control-label"><span>P2 gene A / gene B</span><span class="val" id="ctrl-b">RrYy</span></div>' +
      '<select id="ctrl-b1"><option>RR</option><option selected>Rr</option><option>rr</option></select> ' +
      '<select id="ctrl-b2"><option>YY</option><option selected>Yy</option><option>yy</option></select></div>' +
      '<div class="control-item"><div class="control-label"><span>Seeds counted</span><span class="val" id="ctrl-n2">1600</span></div>' +
      '<input type="range" id="ctrl-n2-range" min="16" max="1600" step="16" value="1600"></div>';
    var ids = ["ctrl-a1", "ctrl-a2", "ctrl-b1", "ctrl-b2"];
    for(var i=0;i<ids.length;i++){ document.getElementById(ids[i]).onchange = function(){ draw(App.state.t); }; }
    document.getElementById("ctrl-n2-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function setC(a1, a2, b1, b2){
    document.getElementById("ctrl-a1").value = a1; document.getElementById("ctrl-a2").value = a2;
    document.getElementById("ctrl-b1").value = b1; document.getElementById("ctrl-b2").value = b2;
  }
  function gam2(g1, g2){
    var a = gametesOf(g1), b = gametesOf(g2), out = [];
    for(var i=0;i<a.length;i++) for(var j=0;j<b.length;j++) out.push(a[i] + b[j]);
    return out;
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var a1 = document.getElementById("ctrl-a1").value, a2 = document.getElementById("ctrl-a2").value;
    var b1 = document.getElementById("ctrl-b1").value, b2 = document.getElementById("ctrl-b2").value;
    var ea = document.getElementById("ctrl-a"); if(ea) ea.textContent = a1 + a2;
    var eb = document.getElementById("ctrl-b"); if(eb) eb.textContent = b1 + b2;
    var N = Math.round(numEl("ctrl-n2-range", 1600));
    var en = document.getElementById("ctrl-n2"); if(en) en.textContent = N;
    var gA = gam2(a1, a2), gB = gam2(b1, b2);
    var cls = {"RY": 0, "Ry": 0, "rY": 0, "ry": 0};
    var i, j;
    for(i=0;i<gA.length;i++) for(j=0;j<gB.length;j++){
      var ga = canon(gA[i].charAt(0), gB[j].charAt(0));
      var gb = canon(gA[i].charAt(1), gB[j].charAt(1));
      var k = (ga.indexOf("R") >= 0 ? "R" : "r") + (gb.indexOf("Y") >= 0 ? "Y" : "y");
      cls[k]++;
    }
    var total = gA.length * gB.length;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="200" y="20" fill="#94a3b8" font-size="12" text-anchor="middle">' + a1 + a2 + ' x ' + b1 + b2 + ': F1 gametes 1/4 each (Sec 4.3)</text>';
    var x0 = 30, y0 = 40, cw = 40, chh = 26;
    for(j=0;j<gB.length;j++){ m += '<text x="' + (x0+(j+1)*cw+cw/2) + '" y="' + (y0-4) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + gB[j] + '</text>'; }
    for(i=0;i<gA.length;i++){
      m += '<text x="' + (x0+cw-8) + '" y="' + (y0+(i+1)*chh+17) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + gA[i] + '</text>';
      for(j=0;j<gB.length;j++){
        var ga2 = canon(gA[i].charAt(0), gB[j].charAt(0));
        var gb2 = canon(gA[i].charAt(1), gB[j].charAt(1));
        var k2 = (ga2.indexOf("R") >= 0 ? "R" : "r") + (gb2.indexOf("Y") >= 0 ? "Y" : "y");
        var col = k2 === "RY" ? "#34d399" : (k2 === "Ry" ? "#f59e0b" : (k2 === "rY" ? "#38bdf8" : "#94a3b8"));
        m += '<rect x="' + (x0+(j+1)*cw) + '" y="' + (y0+i*chh) + '" width="' + cw + '" height="' + chh + '" fill="#0f1f2e" stroke="' + col + '"/>';
        m += '<text x="' + (x0+(j+1)*cw+cw/2) + '" y="' + (y0+i*chh+17) + '" fill="' + col + '" font-size="8" text-anchor="middle">' + ga2 + gb2 + '</text>';
      }
    }
    var rows = [["RY", "round-yellow", "#34d399"], ["Ry", "round-green", "#f59e0b"], ["rY", "wrinkled-yellow", "#38bdf8"], ["ry", "wrinkled-green", "#94a3b8"]];
    var y = 60;
    for(var rI=0;rI<rows.length;rI++){
      var f = cls[rows[rI][0]] / total;
      m += '<text x="470" y="' + y + '" fill="' + rows[rI][2] + '" font-size="12">' + rows[rI][1] + ': ' + cls[rows[rI][0]] + '/' + total + ' -&gt; ' + Math.round(N*f) + ' of ' + N + '</text>';
      y += 24;
    }
    m += '<text x="470" y="' + (y+4) + '" fill="#94a3b8" font-size="11">each trait still 3:1 inside;</text>';
    m += '<text x="470" y="' + (y+22) + '" fill="#94a3b8" font-size="11">genotypes: 9 classes 1:2:1:2:4:2:1:2:1</text>';
    svg.innerHTML = m;
    readout(cell("RY", (cls.RY/total).toFixed(3), "#34d399") + cell("Ry", (cls.Ry/total).toFixed(3), "#f59e0b") + cell("rY", (cls.rY/total).toFixed(3), "#38bdf8") + cell("ry", (cls.ry/total).toFixed(3), "#94a3b8"));
    var isDi = (a1 === "Rr" && a2 === "Yy" && b1 === "Rr" && b2 === "Yy");
    var isEx7 = (a1 === "Rr" && a2 === "Yy" && b1 === "Rr" && b2 === "yy");
    var isTc = (b1 === "rr" && b2 === "yy" && gB.length === 1);
    if(isDi) verdict("<b>Section 4.3.1, Fig. 4.7:</b> RrYy makes <b>RY, Ry, rY, ry at 1/4 each</b> (50/50 x 50/50); 16 boxes give <b>9 : 3 : 3 : 1 = (3:1) x (3:1)</b>. Of " + N + ": <b>" + Math.round(N*9/16) + " : " + Math.round(N*3/16) + " : " + Math.round(N*3/16) + " : " + Math.round(N/16) + "</b> (quiz: 1600 -&gt; 900/300/300/100). Genotypes are nine classes, not four.");
    else if(isEx7) verdict("<b>Exercise 7:</b> read R as T (tall): height Tt x Tt = <b>3/4 tall</b>, colour Yy x yy = <b>1/2 green</b>. Tall-green = 3/4 x 1/2 = <b>3/8</b>; dwarf-green = 1/4 x 1/2 = <b>1/8</b> (of 800: 300 and 100).");
    else if(isTc) verdict("<b>Dihybrid test cross:</b> RrYy x rryy gives <b>1 : 1 : 1 : 1</b> — four classes equal, exposing both heterozygosities at once (Law of Independent Assortment 4.3.1).");
    else verdict("<b>Law of Independent Assortment (4.3.1):</b> segregation of one pair is independent of the other. Grid counts " + cls.RY + ":" + cls.Ry + ":" + cls.rY + ":" + cls.ry + " of " + total + " — compare with 9:3:3:1.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["chromosomal-linkage"] = (function(){
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Parental combinations</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Recombinant (non-parental)</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ca">Cross A: white-yellow 1.3%</button>' +
      '<button class="preset-btn" id="p-cb">Cross B: white-miniature 37.2%</button>' +
      '<button class="preset-btn" id="p-free">Unlinked: 50% (9:3:3:1)</button>';
    document.getElementById("p-ca").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-rf-range"); if(r) r.value=1.3; draw(App.state.t); };
    document.getElementById("p-cb").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-rf-range"); if(r) r.value=37.2; draw(App.state.t); };
    document.getElementById("p-free").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-rf-range"); if(r) r.value=50; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Recombination %</span><span class="val" id="ctrl-rf">1.3</span></div>' +
      '<input type="range" id="ctrl-rf-range" min="0" max="50" step="0.1" value="1.3"></div>' +
      '<div class="control-item"><div class="control-label"><span>Progeny counted</span><span class="val" id="ctrl-pn">1000</span></div>' +
      '<input type="range" id="ctrl-pn-range" min="100" max="2000" step="50" value="1000"></div>';
    document.getElementById("ctrl-rf-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-pn-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var rf = numEl("ctrl-rf-range", 1.3);
    var N = Math.round(numEl("ctrl-pn-range", 1000));
    var e1 = document.getElementById("ctrl-rf"); if(e1) e1.textContent = rf.toFixed(1);
    var e2 = document.getElementById("ctrl-pn"); if(e2) e2.textContent = N;
    var rec = Math.round(N * rf / 100), par = N - rec;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Morgan Drosophila dihybrid: parental vs non-parental (Sec 4.3.3, Fig. 4.11)</text>';
    m += '<line x1="150" y1="60" x2="150" y2="220" stroke="#38bdf8" stroke-width="6"/>';
    m += '<circle cx="150" cy="100" r="8" fill="#f59e0b"/><circle cx="150" cy="150" r="8" fill="#f59e0b"/>';
    m += '<text x="150" y="240" fill="#94a3b8" font-size="11" text-anchor="middle">two genes, one X chromosome</text>';
    m += '<text x="150" y="256" fill="#94a3b8" font-size="11" text-anchor="middle">(yellow-bodied white-eyed x normal)</text>';
    m += '<rect x="260" y="80" width="330" height="40" rx="6" fill="#0f1f2e" stroke="#475569"/>';
    m += '<rect x="260" y="80" width="' + (330 * par / N) + '" height="40" rx="6" fill="#38bdf8"/>';
    m += '<rect x="' + (260 + 330 * par / N) + '" y="80" width="' + (330 * rec / N) + '" height="40" rx="6" fill="#f59e0b"/>';
    m += '<text x="425" y="145" fill="#e2e8f0" font-size="13" text-anchor="middle">parental ' + par + ' vs recombinant ' + rec + ' of ' + N + '</text>';
    m += '<text x="425" y="170" fill="#f59e0b" font-size="13" text-anchor="middle">recombination = ' + rf.toFixed(1) + '% = gene distance</text>';
    m += '<text x="425" y="195" fill="#94a3b8" font-size="11" text-anchor="middle">yellow body: y; white eye: w (X-linked)</text>';
    m += '<text x="425" y="213" fill="#94a3b8" font-size="11" text-anchor="middle">miniature wing: m; F2 deviates from 9:3:3:1</text>';
    m += '<text x="425" y="235" fill="#94a3b8" font-size="11" text-anchor="middle">fly: 2-week cycle, simple medium,</text>';
    m += '<text x="425" y="251" fill="#94a3b8" font-size="11" text-anchor="middle">many progeny, visible variations</text>';
    m += '<text x="425" y="273" fill="#34d399" font-size="11" text-anchor="middle">Sturtevant: frequency as ruler -&gt; maps</text>';
    svg.innerHTML = m;
    readout(cell("recomb %", rf.toFixed(1), "#f59e0b") + cell("parental", String(par), "#38bdf8") + cell("recombinant", String(rec), "#f59e0b") + cell("N", String(N)));
    if(rf < 5) verdict("<b>Cross A, Sec 4.3.3:</b> white-yellow show only <b>1.3% recombination</b> — tightly linked: of 1000 flies ~<b>13 recombinant, 987 parental</b>. Parental excess falsifies independence; segregation within each pair still holds.");
    else if(rf < 45) verdict("<b>Cross B, Sec 4.3.3:</b> white-miniature show <b>37.2%</b> — loosely linked: of 1000, <b>372 recombinant, 628 parental</b>. Far-apart genes recombine so often they nearly assort independently.");
    else verdict("<b>Exercises 8-9, Sec 4.3.3:</b> at 50% the pairs assort independently (9:3:3:1 reference). Linked F2 instead deviates strongly toward the two <b>parental phenotypes</b> — linkage (association) vs recombination (non-parental).");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["polygenic-pleiotropy"] = (function(){
  var probs = [1, 6, 15, 20, 15, 6, 1];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Dominant-allele dose 0-6</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Pleiotropy: one gene, 3 effects</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-bell">Bell curve (AaBbCc x2)</button>' +
      '<button class="preset-btn" id="p-ext">Extreme 1/64 (AABBCC)</button>' +
      '<button class="preset-btn" id="p-pku">Phenylketonuria (pleiotropy)</button>';
    document.getElementById("p-bell").onclick = function(){ setActivePreset(this); draw(App.state.t); };
    document.getElementById("p-ext").onclick = function(){ setActivePreset(this); var r=document.getElementById("ctrl-dose-range"); if(r) r.value=6; draw(App.state.t); };
    document.getElementById("p-pku").onclick = function(){ setActivePreset(this); draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Dominant alleles (dose)</span><span class="val" id="ctrl-dose">3</span></div>' +
      '<input type="range" id="ctrl-dose-range" min="0" max="6" step="1" value="3"></div>' +
      '<div class="control-item"><div class="control-label"><span>Children counted</span><span class="val" id="ctrl-pk">640</span></div>' +
      '<input type="range" id="ctrl-pk-range" min="64" max="1280" step="64" value="640"></div>';
    document.getElementById("ctrl-dose-range").oninput = function(){ draw(App.state.t); };
    document.getElementById("ctrl-pk-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function shade(k){
    var v = Math.round(30 + k * 30);
    return "rgb(" + (120 + k * 20) + "," + (90 + k * 8) + "," + (60 + k * 4) + ")";
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var dose = Math.round(numEl("ctrl-dose-range", 3));
    var N = Math.round(numEl("ctrl-pk-range", 640));
    var e1 = document.getElementById("ctrl-dose"); if(e1) e1.textContent = dose;
    var e2 = document.getElementById("ctrl-pk"); if(e2) e2.textContent = N;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 4.4 skin colour A/B/C + Sec 4.5 phenylketonuria (one gene, many traits)</text>';
    var maxP = 20;
    for(var k=0;k<=6;k++){
      var x = 60 + k*62, h = probs[k] / maxP * 130;
      var hot = k === dose;
      m += '<rect x="' + x + '" y="' + (220-h) + '" width="50" height="' + h + '" fill="' + shade(k) + '" stroke="' + (hot ? "#f8fafc" : "#475569") + '" stroke-width="' + (hot?3:1) + '"/>';
      m += '<text x="' + (x+25) + '" y="236" fill="#94a3b8" font-size="10" text-anchor="middle">' + k + '</text>';
      m += '<text x="' + (x+25) + '" y="250" fill="#94a3b8" font-size="9" text-anchor="middle">' + probs[k] + '/64</text>';
    }
    m += '<text x="270" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">dominant-allele dose -&gt; darkness (AABBCC darkest, aabbcc lightest)</text>';
    var exp = Math.round(N * probs[dose] / 64);
    m += '<rect x="490" y="50" width="200" height="180" rx="8" fill="#0f1f2e" stroke="#f59e0b"/>';
    m += '<circle cx="590" cy="100" r="30" fill="' + shade(dose) + '" stroke="#f8fafc" stroke-width="2"/>';
    m += '<text x="590" y="150" fill="#e2e8f0" font-size="12" text-anchor="middle">dose ' + dose + ': ' + probs[dose] + '/64</text>';
    m += '<text x="590" y="170" fill="#f59e0b" font-size="12" text-anchor="middle">' + exp + ' of ' + N + ' children</text>';
    m += '<text x="590" y="190" fill="#94a3b8" font-size="10" text-anchor="middle">AaBbCc: 8 gametes 1/8</text>';
    m += '<text x="590" y="206" fill="#94a3b8" font-size="10" text-anchor="middle">extremes 1/64 each end</text>';
    m += '<text x="590" y="222" fill="#f87171" font-size="10" text-anchor="middle">PKU: 1 gene -&gt; brain +</text>';
    m += '<text x="590" y="236" fill="#f87171" font-size="10" text-anchor="middle">hair + skin (hydroxylase)</text>';
    svg.innerHTML = m;
    readout(cell("dose", String(dose) + " / 6", "#f59e0b") + cell("P(dose)", probs[dose] + "/64") + cell("expected", String(exp) + " of " + N, "#34d399"));
    if(dose === 6 || dose === 0) verdict("<b>Section 4.4 extremes:</b> P(AABBCC child of AaBbCc x AaBbCc) = <b>(1/4)^3 = 1/64</b> — of " + N + " about <b>" + Math.round(N/64) + "</b> darkest (and as many lightest). Most cluster intermediate: the gradient, plus environment (sun, nutrition).");
    else verdict("<b>Section 4.4:</b> dose " + dose + " has probability <b>" + probs[dose] + "/64</b> — of " + N + " about <b>" + exp + "</b>. Reverse pattern is <b>pleiotropy (4.5)</b>: phenylketonuria (phenylalanine hydroxylase) gives <b>mental retardation + lighter hair + lighter skin</b> together.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["sex-determination"] = (function(){
  var sys = "XY";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Female gamete</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Male gamete (decides in XY)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Haplodiploid bee sets</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-xy">Ex 11: human XY (sperm decides)</button>' +
      '<button class="preset-btn" id="p-xo">XO grasshopper</button>' +
      '<button class="preset-btn" id="p-zw">ZW birds (egg decides)</button>' +
      '<button class="preset-btn" id="p-bee">Honey bee 32/16</button>';
    document.getElementById("p-xy").onclick = function(){ setActivePreset(this); sys="XY"; draw(App.state.t); };
    document.getElementById("p-xo").onclick = function(){ setActivePreset(this); sys="XO"; draw(App.state.t); };
    document.getElementById("p-zw").onclick = function(){ setActivePreset(this); sys="ZW"; draw(App.state.t); };
    document.getElementById("p-bee").onclick = function(){ setActivePreset(this); sys="bee"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Births counted</span><span class="val" id="ctrl-bn">240</span></div>' +
      '<input type="range" id="ctrl-bn-range" min="2" max="400" step="2" value="240"></div>';
    document.getElementById("ctrl-bn-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var N = Math.round(numEl("ctrl-bn-range", 240));
    var e1 = document.getElementById("ctrl-bn"); if(e1) e1.textContent = N;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 4.6: Henking X body (1891) -&gt; XO, XY, ZW, haplodiploid (Fig. 4.12)</text>';
    if(sys === "bee"){
      m += '<circle cx="170" cy="130" r="40" fill="#f472b6"/>';
      m += '<text x="170" y="136" fill="#4a044e" font-size="12" text-anchor="middle">queen 32</text>';
      m += '<text x="170" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">egg (16) + sperm (16)</text>';
      m += '<circle cx="360" cy="130" r="28" fill="#f59e0b"/>';
      m += '<text x="360" y="136" fill="#451a03" font-size="12" text-anchor="middle">drone 16</text>';
      m += '<text x="360" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">sperm by mitosis</text>';
      m += '<line x1="210" y1="130" x2="330" y2="130" stroke="#34d399" stroke-width="3"/>';
      m += '<text x="270" y="118" fill="#34d399" font-size="11" text-anchor="middle">fertilised -&gt; female 32</text>';
      m += '<text x="270" y="220" fill="#f59e0b" font-size="11" text-anchor="middle">unfertilised egg -&gt; male 16 (parthenogenesis)</text>';
      m += '<text x="540" y="90" fill="#e2e8f0" font-size="12">males: no father, no sons;</text>';
      m += '<text x="540" y="110" fill="#e2e8f0" font-size="12">grandfather yes, grandsons yes</text>';
      m += '<text x="540" y="134" fill="#94a3b8" font-size="11">queen (32) x drone (16):</text>';
      m += '<text x="540" y="152" fill="#94a3b8" font-size="11">daughters 32 (16+16)</text>';
      m += '<text x="540" y="176" fill="#34d399" font-size="12">female diploid 32;</text>';
      m += '<text x="540" y="194" fill="#34d399" font-size="12">male haploid 16</text>';
    } else {
      var f = sys === "ZW" ? "ZW" : "XX", ml = sys === "XY" ? "XY" : (sys === "XO" ? "XO" : "ZZ");
      var fg = sys === "ZW" ? ["Z", "W"] : ["X"];
      var mg = sys === "ZW" ? ["Z"] : (sys === "XY" ? ["X", "Y"] : (sys === "XO" ? ["X", "O"] : ["Z"]));
      m += '<circle cx="150" cy="130" r="36" fill="#38bdf8"/>';
      m += '<text x="150" y="136" fill="#082f49" font-size="14" text-anchor="middle">' + f + '</text>';
      m += '<text x="150" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">female: ' + (sys==="ZW" ? "heterogametic" : "homogametic") + '</text>';
      m += '<circle cx="370" cy="130" r="36" fill="#f59e0b"/>';
      m += '<text x="370" y="136" fill="#451a03" font-size="14" text-anchor="middle">' + ml + '</text>';
      m += '<text x="370" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">male: ' + (sys==="ZW" ? "homogametic" : "heterogametic") + '</text>';
      m += '<text x="260" y="120" fill="#94a3b8" font-size="11" text-anchor="middle">x</text>';
      var y = 230, k;
      var combos = [];
      for(var i=0;i<fg.length;i++) for(var j=0;j<mg.length;j++){
        var c = sys === "ZW" ? (fg[i] === "Z" ? "ZZ male" : "ZW female") : (sys === "XO" ? (mg[j] === "X" ? "XX female" : "XO male") : (mg[j] === "X" ? "XX girl" : "XY boy"));
        combos.push(c);
      }
      for(k=0;k<combos.length;k++){
        m += '<text x="260" y="' + (y+k*18) + '" fill="#e2e8f0" font-size="11" text-anchor="middle">' + combos[k] + ' (1/' + combos.length + ')</text>';
      }
      m += '<text x="560" y="90" fill="#e2e8f0" font-size="12">' + (sys==="XY" ? "22 autosome pairs + XX/XY" : (sys==="XO" ? "XO: sperm with/without X" : "ZZ males, ZW females")) + '</text>';
      m += '<text x="560" y="112" fill="#f59e0b" font-size="12">' + (sys==="ZW" ? "egg decides the chick" : "sperm decides") + '</text>';
      m += '<text x="560" y="134" fill="#94a3b8" font-size="11">of ' + N + ' births: ~' + Math.round(N/combos.length) + ' each class</text>';
      m += '<text x="560" y="156" fill="#94a3b8" font-size="11">P(boy) = P(girl) = 1/2,</text>';
      m += '<text x="560" y="172" fill="#94a3b8" font-size="11">independent each pregnancy</text>';
    }
    svg.innerHTML = m;
    readout(cell("system", sys, "#38bdf8") + cell("who decides", sys === "ZW" ? "egg" : (sys === "bee" ? "fertilised?" : "sperm"), "#f59e0b") + cell("counts", sys === "bee" ? "32 / 16" : "1/2 each", "#34d399"));
    if(sys === "bee") verdict("<b>Section 4.6.2:</b> fertilised egg (16+16) becomes <b>female, diploid 32</b> (queen/worker); unfertilised egg becomes <b>male, haploid 16</b> by parthenogenesis; males make sperm by <b>mitosis</b> — no father and no sons, but a grandfather and grandsons.");
    else if(sys === "ZW") verdict("<b>Section 4.6, Fig. 4.12c:</b> birds use <b>female heterogamety</b> — males ZZ, females ZW — so the <b>egg decides</b> the chick's sex. Contrast with XY male heterogamety.");
    else if(sys === "XO") verdict("<b>Section 4.6 (grasshopper):</b> eggs all carry X; <b>X-bearing sperm -&gt; XX female</b>, sperm without X -&gt; <b>XO male</b>. Henking's 1891 X body proved to be the X chromosome; the rest are autosomes.");
    else verdict("<b>Exercise 11, Sec 4.6.1:</b> humans = <b>22 autosome pairs + XX/XY</b>; ova all X, sperm 50% X / 50% Y — <b>X-sperm -&gt; XX girl, Y-sperm -&gt; XY boy</b>, so the <b>sperm decides</b> (blaming mothers is a false notion). Of " + N + ": ~<b>" + N/2 + " each</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["mutation"] = (function(){
  var GT = ["IAIA", "IAi", "IBIB", "IBi", "IAIB", "ii"];
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>A antigen</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>B antigen</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>O (ii, no antigen)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Point mutation GAG-&gt;GUG</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ex12">Ex 12: IAi x IBi (4 groups)</button>' +
      '<button class="preset-btn" id="p-ab0">IAIB x ii</button>' +
      '<button class="preset-btn" id="p-mut">Point mutation panel</button>';
    document.getElementById("p-ex12").onclick = function(){ setActivePreset(this); setG("IAi", "IBi"); draw(App.state.t); };
    document.getElementById("p-ab0").onclick = function(){ setActivePreset(this); setG("IAIB", "ii"); draw(App.state.t); };
    document.getElementById("p-mut").onclick = function(){ setActivePreset(this); draw(App.state.t); };
    var opts = "";
    for(var i=0;i<GT.length;i++){ opts += '<option value="' + GT[i] + '">' + GT[i] + '</option>'; }
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Father (blood A)</span><span class="val" id="ctrl-fa">IAi</span></div>' +
      '<select id="ctrl-fasel">' + opts + '</select></div>' +
      '<div class="control-item"><div class="control-label"><span>Mother (blood B)</span><span class="val" id="ctrl-mo2">IBi</span></div>' +
      '<select id="ctrl-mosel">' + opts + '</select></div>';
    document.getElementById("ctrl-fasel").value = "IAi";
    document.getElementById("ctrl-mosel").value = "IBi";
    document.getElementById("ctrl-fasel").onchange = function(){ draw(App.state.t); };
    document.getElementById("ctrl-mosel").onchange = function(){ draw(App.state.t); };
    draw(0);
  }
  function setG(a, b){
    document.getElementById("ctrl-fasel").value = a;
    document.getElementById("ctrl-mosel").value = b;
  }
  function algam(g){
    var out = [];
    if(g === "IAIA") out = ["IA"];
    else if(g === "IAi") out = ["IA", "i"];
    else if(g === "IBIB") out = ["IB"];
    else if(g === "IBi") out = ["IB", "i"];
    else if(g === "IAIB") out = ["IA", "IB"];
    else out = ["i"];
    return out;
  }
  function gcanon(a, b){
    if(a === b) return a + a;
    var order = {"IA": 0, "IB": 1, "i": 2};
    return order[a] < order[b] ? a + b : b + a;
  }
  function bloodOf(g){
    if(g === "IAIA" || g === "IAi") return "A";
    if(g === "IBIB" || g === "IBi") return "B";
    if(g === "IAIB") return "AB";
    return "O";
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var fa = document.getElementById("ctrl-fasel").value, mo = document.getElementById("ctrl-mosel").value;
    var e1 = document.getElementById("ctrl-fa"); if(e1) e1.textContent = fa;
    var e2 = document.getElementById("ctrl-mo2"); if(e2) e2.textContent = mo;
    var gA = algam(fa), gB = algam(mo);
    var gc = {}, bc = {"A": 0, "B": 0, "AB": 0, "O": 0};
    var i, j;
    for(i=0;i<gA.length;i++) for(j=0;j<gB.length;j++){
      var g = gcanon(gA[i], gB[j]);
      gc[g] = (gc[g] || 0) + 1;
      bc[bloodOf(g)]++;
    }
    var total = gA.length * gB.length;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="200" y="22" fill="#94a3b8" font-size="12" text-anchor="middle">ABO: IA, IB co-dominant, both &gt; i (Table 4.2, Ex 12)</text>';
    m += '<text x="200" y="42" fill="#e2e8f0" font-size="13" text-anchor="middle">' + fa + ' (' + bloodOf(fa) + ') x ' + mo + ' (' + bloodOf(mo) + ')</text>';
    var x0 = 60, y0 = 60, cw = 70, chh = 44;
    for(j=0;j<gB.length;j++){ m += '<text x="' + (x0+(j+1)*cw+cw/2) + '" y="' + (y0-6) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + gB[j] + '</text>'; }
    for(i=0;i<gA.length;i++){
      m += '<text x="' + (x0+cw-10) + '" y="' + (y0+(i+1)*chh+27) + '" fill="#94a3b8" font-size="11" text-anchor="middle">' + gA[i] + '</text>';
      for(j=0;j<gB.length;j++){
        var gg = gcanon(gA[i], gB[j]);
        var b = bloodOf(gg);
        var col = b === "A" ? "#ef4444" : (b === "B" ? "#38bdf8" : (b === "AB" ? "#a78bfa" : "#94a3b8"));
        m += '<rect x="' + (x0+(j+1)*cw) + '" y="' + (y0+i*chh) + '" width="' + cw + '" height="' + chh + '" fill="#0f1f2e" stroke="' + col + '" stroke-width="2"/>';
        m += '<text x="' + (x0+(j+1)*cw+cw/2) + '" y="' + (y0+i*chh+27) + '" fill="' + col + '" font-size="11" text-anchor="middle">' + gg + '</text>';
      }
    }
    var bs = ["A", "B", "AB", "O"], cols = ["#ef4444", "#38bdf8", "#a78bfa", "#94a3b8"], y = 130;
    for(var bi=0;bi<4;bi++){
      m += '<text x="420" y="' + y + '" fill="' + cols[bi] + '" font-size="13">' + bs[bi] + ': ' + bc[bs[bi]] + '/' + total + ' = ' + (bc[bs[bi]]/total).toFixed(2) + '</text>';
      y += 24;
    }
    m += '<text x="420" y="' + (y+2) + '" fill="#94a3b8" font-size="11">O child (ii) forces one i</text>';
    m += '<text x="420" y="' + (y+20) + '" fill="#94a3b8" font-size="11">from EACH parent</text>';
    m += '<text x="420" y="' + (y+44) + '" fill="#f59e0b" font-size="11">Sec 4.7: GAG-&gt;GUG codon 6</text>';
    m += '<text x="420" y="' + (y+62) + '" fill="#f59e0b" font-size="11">Glu-&gt;Val = sickle-cell;</text>';
    m += '<text x="420" y="' + (y+80) + '" fill="#f59e0b" font-size="11">1-2 base indel = frame-shift</text>';
    svg.innerHTML = m;
    readout(cell("A", (bc.A/total).toFixed(2), "#ef4444") + cell("B", (bc.B/total).toFixed(2), "#38bdf8") + cell("AB", (bc.AB/total).toFixed(2), "#a78bfa") + cell("O", (bc.O/total).toFixed(2), "#94a3b8"));
    if(fa === "IAi" && mo === "IBi") verdict("<b>Exercise 12:</b> O child is ii, so A father must be <b>IAi</b> and B mother <b>IBi</b>. Gametes (1/2IA+1/2i) x (1/2IB+1/2i) give <b>1/4 IAIB (AB) : 1/4 IAi (A) : 1/4 IBi (B) : 1/4 ii (O)</b> — all four groups possible.");
    else verdict("<b>Sections 4.2.2.2/4.7, Table 4.2:</b> " + fa + " x " + mo + " gives A " + (bc.A/total).toFixed(2) + ", B " + (bc.B/total).toFixed(2) + ", AB " + (bc.AB/total).toFixed(2) + ", O " + (bc.O/total).toFixed(2) + ". IA, IB co-dominant (AB cells carry both sugars); six genotypes, four phenotypes. Point mutation model: <b>beta-globin codon 6 GAG-&gt;GUG (Glu-&gt;Val)</b>.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["pedigree-mendelian"] = (function(){
  var mode = "AR";
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Square male / circle female</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Half-filled carrier</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Filled affected</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ar">Sickle-cell HbAHbS x2 (1/4)</button>' +
      '<button class="preset-btn" id="p-xl">Colour-blind carrier mother (1/2 sons)</button>' +
      '<button class="preset-btn" id="p-qv">Queen Victoria haemophilia</button>';
    document.getElementById("p-ar").onclick = function(){ setActivePreset(this); mode="AR"; draw(App.state.t); };
    document.getElementById("p-xl").onclick = function(){ setActivePreset(this); mode="XL"; draw(App.state.t); };
    document.getElementById("p-qv").onclick = function(){ setActivePreset(this); mode="QV"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Children in sibship</span><span class="val" id="ctrl-sib">4</span></div>' +
      '<input type="range" id="ctrl-sib-range" min="1" max="8" step="1" value="4"></div>';
    document.getElementById("ctrl-sib-range").oninput = function(){ draw(App.state.t); };
    draw(0);
  }
  function sym(x, y, male, state, stroke){
    var s = "";
    if(male){ s += '<rect x="' + (x-13) + '" y="' + (y-13) + '" width="26" height="26" fill="#0f1f2e" stroke="' + (stroke || "#e2e8f0") + '" stroke-width="2"/>'; }
    else { s += '<circle cx="' + x + '" cy="' + y + '" r="14" fill="#0f1f2e" stroke="' + (stroke || "#e2e8f0") + '" stroke-width="2"/>'; }
    if(state === "affected"){ s += male ? '<rect x="' + (x-13) + '" y="' + (y-13) + '" width="26" height="26" fill="#f87171"/>' : '<circle cx="' + x + '" cy="' + y + '" r="14" fill="#f87171"/>'; }
    else if(state === "carrier"){ s += male ? '<rect x="' + (x-13) + '" y="' + (y-13) + '" width="13" height="26" fill="#f59e0b"/>' : '<path d="M ' + x + ' ' + (y-14) + ' A 14 14 0 0 0 ' + x + ' ' + (y+14) + ' Z" fill="#f59e0b"/>'; }
    return s;
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var nSib = Math.round(numEl("ctrl-sib-range", 4));
    var e1 = document.getElementById("ctrl-sib"); if(e1) e1.textContent = nSib;
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Fig. 4.13-4.14 style: family tree replaces test crosses (Sec 4.8.1)</text>';
    var risk, expAff, title;
    if(mode === "AR"){
      title = "HbAHbS x HbAHbS (autosomal recessive)";
      risk = 0.25; expAff = Math.round(nSib * 0.25);
      m += sym(200, 90, true, "carrier") + sym(320, 90, false, "carrier");
      m += '<line x1="213" y1="90" x2="307" y2="90" stroke="#e2e8f0" stroke-width="2"/>';
      m += '<line x1="260" y1="90" x2="260" y2="130" stroke="#e2e8f0" stroke-width="2"/>';
      for(var i=0;i<nSib;i++){
        var x = 120 + i*(280/Math.max(1, nSib-1 || 1));
        if(nSib === 1) x = 260;
        var stt = i === 0 ? "affected" : (i < 3 ? "carrier" : "normal");
        m += sym(x, 160, i % 2 === 0, stt);
        m += '<line x1="' + x + '" y1="130" x2="' + x + '" y2="146" stroke="#475569"/>';
      }
      m += '<text x="260" y="220" fill="#94a3b8" font-size="11" text-anchor="middle">1/4 HbSHbS affected : 1/2 carriers : 1/4 normal per pregnancy</text>';
      m += '<text x="260" y="240" fill="#94a3b8" font-size="11" text-anchor="middle">only HbSHbS shows disease; HbAHbS transmit at 50%</text>';
    } else if(mode === "XL"){
      title = "XHXh x XHY (X-linked recessive)";
      risk = 0.25; expAff = Math.round(Math.ceil(nSib/2) * 0.5);
      m += sym(200, 90, false, "carrier") + sym(320, 90, true, "normal");
      m += '<line x1="213" y1="90" x2="307" y2="90" stroke="#e2e8f0" stroke-width="2"/>';
      m += '<line x1="260" y1="90" x2="260" y2="130" stroke="#e2e8f0" stroke-width="2"/>';
      for(var j=0;j<nSib;j++){
        var x2 = 120 + j*(280/Math.max(1, nSib-1 || 1));
        if(nSib === 1) x2 = 260;
        var male = j % 2 === 0;
        var st2 = male ? (j === 0 ? "affected" : "normal") : (j === 1 ? "carrier" : "normal");
        m += sym(x2, 160, male, st2);
        m += '<line x1="' + x2 + '" y1="130" x2="' + x2 + '" y2="146" stroke="#475569"/>';
      }
      m += '<text x="260" y="220" fill="#94a3b8" font-size="11" text-anchor="middle">son gets X from mother: 1/2 of sons XhY affected</text>';
      m += '<text x="260" y="240" fill="#94a3b8" font-size="11" text-anchor="middle">daughter affected only if mother carrier + father colour blind</text>';
    } else {
      title = "Queen Victoria (carrier) haemophilia";
      risk = 0.25; expAff = Math.round(nSib * 0.25);
      m += sym(200, 80, false, "carrier", "#f59e0b") + sym(320, 80, true, "normal");
      m += '<text x="200" y="58" fill="#f59e0b" font-size="10" text-anchor="middle">Victoria (carrier)</text>';
      m += '<line x1="213" y1="80" x2="307" y2="80" stroke="#e2e8f0" stroke-width="2"/>';
      m += '<line x1="260" y1="80" x2="260" y2="120" stroke="#e2e8f0" stroke-width="2"/>';
      for(var q=0;q<nSib;q++){
        var x3 = 120 + q*(280/Math.max(1, nSib-1 || 1));
        if(nSib === 1) x3 = 260;
        m += sym(x3, 150, q % 2 === 0, q === 0 ? "affected" : (q === 1 ? "carrier" : "normal"));
        m += '<line x1="' + x3 + '" y1="120" x2="' + x3 + '" y2="136" stroke="#475569"/>';
      }
      m += '<text x="260" y="215" fill="#94a3b8" font-size="11" text-anchor="middle">unaffected carrier female -&gt; some sons haemophilic</text>';
      m += '<text x="260" y="235" fill="#94a3b8" font-size="11" text-anchor="middle">clotting protein fails: cut bleeds non-stop</text>';
      m += '<text x="260" y="255" fill="#94a3b8" font-size="11" text-anchor="middle">haemophilic daughter extremely rare (unviable later)</text>';
    }
    m += '<text x="520" y="70" fill="#e2e8f0" font-size="13">' + title + '</text>';
    m += '<text x="520" y="96" fill="#38bdf8" font-size="12">sibship ' + nSib + ': expect ~' + expAff + ' affected</text>';
    m += '<text x="520" y="120" fill="#94a3b8" font-size="11">colour blindness: 8% males,</text>';
    m += '<text x="520" y="138" fill="#94a3b8" font-size="11">0.4% females (X-linked rec.)</text>';
    m += '<text x="520" y="162" fill="#94a3b8" font-size="11">sickle vs thalassemia:</text>';
    m += '<text x="520" y="180" fill="#94a3b8" font-size="11">qualitative wrong globin vs</text>';
    m += '<text x="520" y="198" fill="#94a3b8" font-size="11">quantitative shortage (chr16/11)</text>';
    m += '<text x="520" y="222" fill="#94a3b8" font-size="11">PKU: no phe-&gt;tyr enzyme;</text>';
    m += '<text x="520" y="240" fill="#94a3b8" font-size="11">brain + urine phenylpyruvate</text>';
    svg.innerHTML = m;
    readout(cell("mode", mode === "AR" ? "autosomal rec." : "X-linked rec.", "#38bdf8") + cell("risk", mode === "XL" ? "1/2 of sons" : "1/4 per pregnancy", "#f87171") + cell("sibship", String(nSib)) + cell("expect", "~" + expAff + " affected", "#f59e0b"));
    if(mode === "AR") verdict("<b>Section 4.8.2, quizzes:</b> HbAHbS x HbAHbS gametes (1/2+1/2) each give <b>1/4 HbSHbS affected</b> — of 160 births, <b>40 affected, 80 carriers, 40 normal</b>. Fig. 4.14 contrasts autosomal dominant myotonic dystrophy with recessive sickle-cell.");
    else if(mode === "XL") verdict("<b>Section 4.8.2:</b> carrier mother XHXh gives Xh to <b>half her sons</b> (XhY colour blind) — of 120 sons, <b>60 affected</b>. Colour blindness ~<b>8% males, 0.4% females</b> (needs two copies in daughters).");
    else verdict("<b>Section 4.8.2:</b> <b>Queen Victoria was a carrier</b> — many haemophilic descendants. Sex-linked recessive passes <b>carrier mother -&gt; some sons</b>; clotting-cascade failure means non-stop bleeding from a simple cut.");
  }
  return { mount: mount, draw: draw };
})();

window.SIMS["chromosomal-disorders"] = (function(){
  var dis = "down";
  var data = {
    "normal": [46, "46 = 22 autosome pairs + XX/XY", "baseline: trisomy = gain, monosomy = loss"],
    "down": [47, "47, trisomy 21 (Langdon Down, 1866)", "short stature, small round head, furrowed tongue, open mouth, palm crease, retarded development"],
    "turner": [45, "45, XO female", "sterile, rudimentary ovaries, lacking secondary sexual characters"],
    "klinefelter": [47, "47, XXY male", "masculine development + gynaecomastia, sterile"]
  };
  function mount(){
    App.state.maxT = 6;
    var s = document.getElementById("time-scrubber"); if(s) s.max = 6;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Autosome pairs (22)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Sex chromosomes</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f87171;"></span><span>Extra / missing</span></div>';
    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn" id="p-nor">Normal 46</button>' +
      '<button class="preset-btn active" id="p-down">Down 47 (+21)</button>' +
      '<button class="preset-btn" id="p-tur">Turner 45 (XO)</button>' +
      '<button class="preset-btn" id="p-kli">Klinefelter 47 (XXY)</button>';
    document.getElementById("p-nor").onclick = function(){ setActivePreset(this); dis="normal"; draw(App.state.t); };
    document.getElementById("p-down").onclick = function(){ setActivePreset(this); dis="down"; draw(App.state.t); };
    document.getElementById("p-tur").onclick = function(){ setActivePreset(this); dis="turner"; draw(App.state.t); };
    document.getElementById("p-kli").onclick = function(){ setActivePreset(this); dis="klinefelter"; draw(App.state.t); };
    document.getElementById("lab-controls").innerHTML =
      '<div class="control-item"><div class="control-label"><span>Gamete error</span><span class="val" id="ctrl-nd">24 + 23</span></div>' +
      '<select id="ctrl-ndsel"><option value="47">non-disjunction: 24 + 23 = 47</option><option value="45">loss: 22 + 23 = 45</option><option value="46">normal: 23 + 23 = 46</option></select></div>';
    document.getElementById("ctrl-ndsel").onchange = function(){ draw(App.state.t); };
    draw(0);
  }
  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var ndsel = document.getElementById("ctrl-ndsel");
    var nd = ndsel ? ndsel.value : "47";
    var e1 = document.getElementById("ctrl-nd"); if(e1) e1.textContent = nd === "47" ? "24 + 23" : (nd === "45" ? "22 + 23" : "23 + 23");
    var total = data[dis][0];
    var m = '<rect width="720" height="300" fill="#09131d"/>';
    m += '<text x="360" y="22" fill="#94a3b8" font-size="13" text-anchor="middle">Sec 4.8.3: karyotype reads 46 vs 47 vs 45 (aneuploidy vs polyploidy)</text>';
    for(var p=0;p<22;p++){
      var x = 40 + (p%11)*30, y = 55 + Math.floor(p/11)*52;
      var hot = dis === "down" && p === 20;
      m += '<rect x="' + x + '" y="' + y + '" width="11" height="34" rx="3" fill="#38bdf8"/>';
      m += '<rect x="' + (x+13) + '" y="' + y + '" width="11" height="34" rx="3" fill="' + (hot ? "#f87171" : "#38bdf8") + '"/>';
      if(hot){ m += '<rect x="' + (x+26) + '" y="' + y + '" width="11" height="34" rx="3" fill="#f87171"/>'; }
      if(p === 20){ m += '<text x="' + x + '" y="' + (y+46) + '" fill="#94a3b8" font-size="9">21' + (hot ? ' x3' : '') + '</text>'; }
    }
    var sx = 400;
    if(dis === "turner"){
      m += '<rect x="' + sx + '" y="80" width="16" height="52" rx="4" fill="#f59e0b"/>';
      m += '<text x="' + (sx+8) + '" y="150" fill="#f87171" font-size="12" text-anchor="middle">X O (one missing)</text>';
    } else if(dis === "klinefelter"){
      m += '<rect x="' + sx + '" y="80" width="16" height="52" rx="4" fill="#f59e0b"/>';
      m += '<rect x="' + (sx+20) + '" y="80" width="16" height="52" rx="4" fill="#f59e0b"/>';
      m += '<rect x="' + (sx+40) + '" y="80" width="12" height="52" rx="4" fill="#f87171"/>';
      m += '<text x="' + (sx+26) + '" y="150" fill="#f87171" font-size="12" text-anchor="middle">X X Y (extra X)</text>';
    } else {
      m += '<rect x="' + sx + '" y="80" width="16" height="52" rx="4" fill="#f59e0b"/>';
      m += '<rect x="' + (sx+20) + '" y="80" width="16" height="52" rx="4" fill="#f59e0b"/>';
      m += '<text x="' + (sx+18) + '" y="150" fill="#94a3b8" font-size="12" text-anchor="middle">XX / XY</text>';
    }
    m += '<text x="' + (sx+18) + '" y="60" fill="#94a3b8" font-size="11" text-anchor="middle">sex pair</text>';
    m += '<rect x="490" y="55" width="200" height="110" rx="8" fill="#0f1f2e" stroke="' + (total === 46 ? "#34d399" : "#f87171") + '" stroke-width="3"/>';
    m += '<text x="590" y="95" fill="' + (total === 46 ? "#34d399" : "#f87171") + '" font-size="34" text-anchor="middle">' + total + '</text>';
    m += '<text x="590" y="120" fill="#e2e8f0" font-size="11" text-anchor="middle">chromosomes</text>';
    m += '<text x="590" y="140" fill="#94a3b8" font-size="10" text-anchor="middle">22 x 2 + sex count</text>';
    m += '<text x="590" y="156" fill="#94a3b8" font-size="10" text-anchor="middle">gametes: ' + (nd === "47" ? "24 + 23" : (nd === "45" ? "22 + 23" : "23 + 23")) + '</text>';
    m += '<text x="400" y="200" fill="#e2e8f0" font-size="12">' + data[dis][1] + '</text>';
    m += '<text x="400" y="222" fill="#94a3b8" font-size="11">' + data[dis][2].slice(0, 52) + '</text>';
    m += '<text x="400" y="240" fill="#94a3b8" font-size="11">' + data[dis][2].slice(52, 104) + '</text>';
    m += '<text x="400" y="258" fill="#94a3b8" font-size="11">' + data[dis][2].slice(104, 156) + '</text>';
    m += '<text x="400" y="280" fill="#94a3b8" font-size="10">segregation failure -&gt; aneuploidy; cytokinesis failure -&gt; polyploidy (plants)</text>';
    svg.innerHTML = m;
    readout(cell("total", String(total), total === 46 ? "#34d399" : "#f87171") + cell("sex", dis === "turner" ? "XO" : (dis === "klinefelter" ? "XXY" : "XX/XY"), "#f59e0b") + cell("chr 21", dis === "down" ? "x3" : "x2") + cell("sums", "22x2+2=46"));
    if(dis === "down") verdict("<b>Section 4.8.3 (Langdon Down, 1866):</b> extra chromosome 21 — <b>trisomy 21, total 47</b>. 24-chromosome gamete + 23 = 47. One extra chromosome rewrites face, palm, heart and learning: dosage matters as much as sequence.");
    else if(dis === "turner") verdict("<b>Section 4.8.3:</b> missing X — <b>45, XO female</b>: sterile with rudimentary ovaries, lacking secondary sexual characters (Fig. 4.17b). 22-chromosome gamete + 23 = 45 (monosomy).");
    else if(dis === "klinefelter") verdict("<b>Section 4.8.3:</b> extra X — <b>47, XXY male</b>: masculine development plus <b>gynaecomastia</b>, sterile (Fig. 4.17a). 46 + 1 = 47, like Down but a sex-chromosome gain.");
    else verdict("<b>Section 4.8.3 baseline:</b> normal human cell = <b>46 = 22 autosome pairs + 1 sex pair</b> (22x2+2). Gain = trisomy, loss = monosomy — both very serious. Karyotype (ordered display) reads each directly.");
  }
  return { mount: mount, draw: draw };
})();
