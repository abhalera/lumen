// Class 9 Science, Chapter 3 (iesc103) — simulation labs.
// Textbook data (Fig. 3.2, Tables 3.6–3.7) are used where given; other values are labelled illustrative.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

// Lab 1 — Growth: Activity 3.1 (Fig. 3.2), three meristems, annual rings (Table 3.7)
(function(){
  var L = LAB, C = L.C;
  var A = [[1, 0.2], [2, 0.8], [3, 1.8], [4, 2.9], [5, 3.8], [6, 4.9], [7, 5.8]];
  var B = [[1, 0.2], [2, 0.7], [3, 1.6], [4, 2.6], [4.0001, 1.6], [5, 1.6], [6, 1.6], [7, 1.6]];
  var TEAK = [[5, 4, 5], [10, 8, 10], [20, 24, 20], [25, 28, 25], [30, 32, 30], [40, 40, 40]];
  var st = {preset: "act31"};
  function select(id){
    st.preset = id; L.markPreset(id);
    if(id === "act31"){ L.timeline({maxT: 7, step: 1, speed: 1, format: function(t){ return "day <b>" + L.num(Math.max(1, t), 1) + "</b>"; }}); L.legend([[C.vel, "Jar A (tips intact)"], [C.path, "Jar B (tips cut)"]]); L.watch("Activity 3.1 with the data of Fig. 3.2. The root tips in Jar B are cut on day 4."); }
    else if(id === "three"){ L.timeline({maxT: 3, step: 1, speed: 0.6}); L.legend([["#34d399", "apical meristem"], [C.path, "lateral meristem"], [C.acc, "intercalary meristem"]]); L.watch("Each second one type of meristem lights up on the plant, with the growth it causes."); }
    else { L.timeline({maxT: 40, step: 5, speed: 5, format: function(t){ return "age <b>" + Math.round(t) + "</b> years"; }}); L.legend([["#a16207", "diameter (DBH, cm)"], [C.vel, "number of annual rings"]]); L.watch("Exercise Q7 / Table 3.7: a teak tree's diameter and annual rings as it ages."); }
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "act31"){
      var g = L.graph({x0: 80, y0: 262, w: 560, h: 214, tmax: 7, vmin: 0, vmax: 6, tStep: 1, vStep: 1, tLabel: "day", vLabel: "root length (cm)"});
      m += g.svg;
      function part(P){ return P.filter(function(p){ return p[0] <= Math.max(1, t) + 1e-6; }); }
      var a = part(A), b = part(B);
      m += L.polyline(g, a, C.vel, 3) + L.polyline(g, b, C.path, 3);
      a.forEach(function(p){ m += L.circle(g.X(p[0]), g.Y(p[1]), 4, C.vel); });
      b.forEach(function(p){ m += L.circle(g.X(p[0]), g.Y(p[1]), 4, C.path); });
      if(t >= 4) m += L.text(g.X(4) + 8, g.Y(2.2), "tips cut", {size: 12, color: C.path, anchor: "start"});
      L.svg(m, "Root lengths on day " + L.num(t, 0), 290);
      var la = L.interp(A, Math.max(1, t)), lb = t >= 4 ? 1.6 : L.interp(B.slice(0, 4), Math.max(1, t));
      L.readout([["Day", L.num(Math.max(1, t), 1)], ["Jar A root length", L.num(la, 1) + " cm", C.vel], ["Jar B root length", L.num(lb, 1) + " cm", C.path]]);
      msg = t <= 0 ? "Press <b>Play</b>." : t < 7 ? "Recording root lengths…" : "<b>Activity 3.1:</b> Jar A's roots keep growing (5.8 cm by day 7); Jar B's stop at 1.6 cm after the tips are cut. Roots grow only from their tips: the <b>apical meristem</b>.";
    } else if(st.preset === "three"){
      var k = Math.floor(t + 1e-9);
      m += L.rect(0, 230, 720, 70, "#3f2a1a") + L.rect(330, 60, 20, 170, "#4d7c0f");
      m += '<path d="M340 230 q-10 30 -40 60 M340 230 q10 35 30 62" stroke="#a3a3a3" stroke-width="5" fill="none"/>';
      [100, 160].forEach(function(y){ m += '<path d="M340 ' + y + ' q-60 -20 -90 -5 q40 15 90 5 z" fill="#65a30d"/><path d="M340 ' + (y + 20) + ' q60 -20 90 -5 q-40 15 -90 5 z" fill="#65a30d"/>'; });
      var on = function(i){ return k >= i + 1 || (t > i && k === i); };
      m += L.circle(340, 58, 12, on(0) ? "#34d399" : C.faint) + L.circle(300, 292, 8, on(0) ? "#34d399" : C.faint);
      m += L.rect(326, 150, 28, 40, "none", ' stroke="' + (on(1) ? C.path : C.faint) + '" stroke-width="4" rx="6"');
      m += L.rect(322, 106, 36, 8, on(2) ? C.acc : C.faint, ' rx="3"') + L.rect(322, 166, 36, 8, on(2) ? C.acc : C.faint, ' rx="3"');
      var labels = [["apical meristem: tips → length", "#34d399", 60], ["lateral meristem: ring in stem → girth", C.path, 170], ["intercalary meristem: at nodes → regrowth", C.acc, 110]];
      labels.forEach(function(l, i){ if(on(i)) m += L.text(420, l[2], l[0], {size: 14, color: l[1], anchor: "start", weight: 700}); });
      L.svg(m, "Plant showing meristems.", 300);
      L.readout([["Apical", "tips of root and shoot → length"], ["Lateral", "ring in stem → girth"], ["Intercalary", "base of internodes / nodes → regrowth"]]);
      msg = t < 3 ? "Showing the meristems…" : "<b>Three meristems:</b> apical (length), lateral (girth) and intercalary (regrowth after cutting or grazing).";
    } else {
      var g2 = L.graph({x0: 80, y0: 262, w: 560, h: 214, tmax: 40, vmin: 0, vmax: 45, tStep: 5, vStep: 5, tLabel: "age (years)", vLabel: "cm / number of rings"});
      m += g2.svg;
      var pts = TEAK.filter(function(r){ return r[0] <= t + 1e-6; });
      m += L.polyline(g2, pts.map(function(r){ return [r[0], r[1]]; }), "#a16207", 3) + L.polyline(g2, pts.map(function(r){ return [r[0], r[2]]; }), C.vel, 3, "6 4");
      pts.forEach(function(r){ m += L.circle(g2.X(r[0]), g2.Y(r[1]), 5, "#d97706") + L.circle(g2.X(r[0]), g2.Y(r[2]), 4, C.vel); });
      var rings = Math.min(12, Math.round(t / 4));
      for(var i = rings; i >= 1; i--) m += L.circle(640, 60, 4 + i * 4, i % 2 ? "#b45309" : "#d6a45c");
      L.svg(m, "Teak tree data up to age " + Math.round(t), 290);
      var last = pts.length ? pts[pts.length - 1] : null;
      L.readout([["Age", last ? last[0] + " years" : "—"], ["Diameter (DBH)", last ? last[1] + " cm" : "—", "#d97706"], ["Annual rings", last ? String(last[2]) : "—", C.vel]]);
      msg = t < 40 ? "Plotting Table 3.7…" : "<b>Exercise Q7:</b> rings = age (one ring a year). Diameter grows fastest between 10 and 20 years (1.6 cm per year) and slower otherwise (0.8 cm per year). The <b>lateral meristem</b> makes the stem thicker.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["act31", "Activity 3.1: onion roots"], ["three", "Three meristems"], ["rings", "Exercise Q7: teak rings"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.meristem = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Plant tissues: bend test, transport, tissue systems
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "bend"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "systems" ? 3 : 6, step: 1, speed: 1});
    L.legend(id === "transport" ? [[C.vel, "xylem: water and minerals (up)"], [C.path, "phloem: food (from leaves)"]] : id === "bend" ? [["#34d399", "collenchyma (pectin corners)"], ["#b45309", "sclerenchyma (lignified)"]] : [["#fbbf24", "dermal"], ["#34d399", "ground"], [C.vel, "vascular"]]);
    L.watch({bend: "Monsoon wind pushes two young stems: one supported by collenchyma, one imagined with sclerenchyma instead (Exercise Q9).", transport: "Water rises through xylem from the roots; food moves through phloem from the leaves.", systems: "Fig. 3.10: the three tissue systems of a plant, from outside in."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "bend"){
      var force = Math.min(1, t / 4);
      function stem(x, flexible){
        var bend = flexible ? 60 * force : Math.min(10, 60 * force), broken = !flexible && force > 0.6;
        var col = flexible ? "#34d399" : "#b45309";
        if(broken) return '<path d="M' + x + ' 270 Q' + x + ' 200 ' + (x + 6) + ' 150" stroke="' + col + '" stroke-width="12" fill="none"/><path d="M' + (x + 10) + ' 148 L' + (x + 70) + ' 120" stroke="' + col + '" stroke-width="12"/>' + L.text(x + 40, 100, "snaps!", {size: 15, color: C.danger, weight: 700});
        return '<path d="M' + x + ' 270 Q' + x + ' 170 ' + (x + bend) + ' 60" stroke="' + col + '" stroke-width="12" fill="none" stroke-linecap="round"/>';
      }
      m += stem(200, true) + stem(480, false);
      for(var i = 0; i < 4; i++) m += L.arrow(40, 90 + i * 40, 40 + 60 * force, 90 + i * 40, C.vel, 3);
      m += L.text(200, 290, "collenchyma (real sapling)", {size: 13, color: "#34d399"}) + L.text(480, 290, "if it were sclerenchyma", {size: 13, color: "#b45309"});
      L.svg(m, "Two stems in wind.", 300);
      L.readout([["Wind strength", L.num(force * 100, 0) + " %"], ["Collenchyma stem", "bends and springs back", "#34d399"], ["Sclerenchyma stem", force > 0.6 ? "rigid: breaks" : "rigid", "#b45309"]]);
      msg = t < 6 ? "Wind rising…" : "<b>Collenchyma bends:</b> living cells with pectin-thickened corners give support with flexibility. Rigid, lignified sclerenchyma would resist bending and could snap in strong winds.";
    } else if(st.preset === "transport"){
      m += L.rect(340, 70, 40, 170, "#4d7c0f") + '<path d="M360 70 q-90 -40 -150 10 q80 20 150 -10 z M360 70 q90 -40 150 10 q-80 20 -150 -10 z" fill="#65a30d"/>' + L.rect(0, 240, 720, 60, "#3f2a1a");
      m += L.line(350, 240, 350, 75, "rgba(56,189,248,0.35)", 6) + L.line(372, 75, 372, 280, "rgba(245,158,11,0.35)", 6);
      for(var k = 0; k < 6; k++){
        var f = ((t * 0.5 + k / 6) % 1);
        m += L.circle(350, 240 - f * 165, 5, C.vel) + L.circle(372, 75 + f * 205, 5, C.path);
      }
      m += L.text(330, 160, "xylem ↑", {size: 13, color: C.vel, anchor: "end"}) + L.text(392, 160, "phloem ↓", {size: 13, color: C.path, anchor: "start"});
      m += L.text(360, 30, "leaves: food made, water lost by transpiration", {size: 13, color: C.text});
      L.svg(m, "Xylem and phloem transport.", 300);
      L.readout([["Xylem carries", "water and minerals, roots → leaves", C.vel], ["Phloem carries", "food, leaves → other parts", C.path], ["Pull for water", "transpiration from stomata"]]);
      msg = t < 6 ? "Transporting…" : "<b>Conducting tissues:</b> xylem carries water up from the roots, pulled by transpiration; phloem carries food from the leaves to other parts, such as the roots.";
    } else {
      var k2 = Math.floor(t + 1e-9);
      m += L.circle(260, 150, 120, k2 >= 1 ? "rgba(52,211,153,0.25)" : "#1e293b", ' stroke="' + (k2 >= 0 && t > 0 ? "#fbbf24" : C.faint) + '" stroke-width="10"');
      if(k2 >= 2) for(var j = 0; j < 8; j++){ var a = j * Math.PI / 4; m += '<ellipse cx="' + (260 + Math.cos(a) * 80) + '" cy="' + (150 + Math.sin(a) * 80) + '" rx="14" ry="20" fill="rgba(56,189,248,0.5)" stroke="' + C.vel + '" transform="rotate(' + (j * 45 + 90) + ' ' + (260 + Math.cos(a) * 80) + ' ' + (150 + Math.sin(a) * 80) + ')"/>'; }
      [["dermal: epidermis protects, reduces water loss", "#fbbf24"], ["ground: parenchyma, collenchyma, sclerenchyma", "#34d399"], ["vascular: xylem and phloem", C.vel]].forEach(function(s, i){ if(t > i) m += L.text(420, 100 + i * 40, s[0], {size: 14, color: s[1], anchor: "start", weight: 700}); });
      L.svg(m, "Cross-section of a stem showing tissue systems.", 300);
      L.readout([["Tissue systems shown", Math.min(3, Math.ceil(t)) + " of 3"]]);
      msg = t < 3 ? "Revealing tissue systems…" : "<b>Fig. 3.10:</b> plant tissues are organised into three tissue systems: dermal, ground and vascular.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["bend", "Exercise Q9: bend test"], ["transport", "Xylem and phloem"], ["systems", "Fig. 3.10: tissue systems"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.plantTissues = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Epithelium and connective tissues
(function(){
  var L = LAB, C = L.C;
  var ROWS = [["Touch your elbow", "hard, rigid", "strength, support, protection", "Bone"], ["Fold your ear or press your nose", "soft, flexible, keeps shape", "flexibility; cushions bone ends", "Cartilage"], ["Wiggle fingers, feel the forearm", "movement far from fingers", "connects muscle to bone", "Tendon"], ["Raise your leg till the knee stops", "joint stops at a limit", "connects bone to bone; stability", "Ligament"]];
  var st = {preset: "epi"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "act33" ? 4 : 6, step: 1, speed: 1});
    L.legend(id === "blood" ? [["#fde68a", "plasma ≈ 55%"], [C.danger, "formed elements ≈ 45%"]] : [[C.vel, "oxygen particles"], ["#fbbf24", "epithelial cells"]]);
    L.watch({epi: "Oxygen crosses two linings: a single layer of thin, flat cells (like the lungs) and many layers (like skin). Illustrative model.", blood: "Fig. 3.12a: blood separated into plasma and formed elements.", act33: "Activity 3.3 / Table 3.4: four actions, four connective tissues."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "epi"){
      [[180, 1, "single thin layer (lungs)"], [520, 5, "many layers (skin)"]].forEach(function(c){
        var x = c[0], layers = c[1], h = layers * 16;
        for(var i = 0; i < layers; i++) m += L.rect(x - 110, 150 - h / 2 + i * 16, 220, 14, "rgba(251,191,36,0.35)", ' stroke="#fbbf24" rx="3"');
        var passed = Math.min(10, Math.floor(t * 10 / (1 + (layers - 1) * 0.9)));
        for(var p = 0; p < 10; p++){
          var y = p < passed ? 150 + h / 2 + 20 + (p % 3) * 14 : 150 - h / 2 - 20 - (p % 3) * 14;
          m += L.circle(x - 90 + p * 20, y, 5, C.vel);
        }
        m += L.text(x, 285, c[2], {size: 13, color: C.text});
      });
      L.svg(m, "Diffusion across thin and thick linings.", 300);
      var thin = Math.min(10, Math.floor(t * 10)), thick = Math.min(10, Math.floor(t * 10 / 4.6));
      L.readout([["Crossed the single layer", thin + " of 10", C.vel], ["Crossed the many layers", thick + " of 10", C.vel]]);
      msg = t < 6 ? "Oxygen diffusing…" : "<b>Structure fits function:</b> a single layer of thin, flat cells lets materials cross quickly (Exercise Q3); many layers slow exchange but protect, as in skin.";
    } else if(st.preset === "blood"){
      var f = Math.min(1, t / 4);
      m += L.rect(290, 40, 140, 230, "none", ' stroke="#cbd5e1" stroke-width="3" rx="12"');
      m += L.rect(293, 43 + 224 * (1 - 0.45 * f) , 134, 224 * 0.45 * f, "#b91c1c", ' rx="8"');
      m += L.rect(293, 43, 134, 224 * (1 - 0.45 * f), f > 0.9 ? "#fde68a" : "#dc2626", ' rx="8"');
      if(f > 0.9){ m += L.text(460, 110, "plasma ≈ 55%", {size: 15, color: "#fde68a", anchor: "start", weight: 700}) + L.text(460, 230, "formed elements ≈ 45%", {size: 15, color: "#f87171", anchor: "start", weight: 700}) + L.text(460, 252, "RBCs, WBCs, platelets", {size: 13, color: C.muted, anchor: "start"}); }
      L.svg(m, "Blood separating into plasma and formed elements.", 300);
      L.readout([["Plasma", "≈ 55% (watery matrix)"], ["Formed elements", "≈ 45%"], ["RBCs", "haemoglobin; live about 4 months"], ["Platelets", "clotting"], ["WBCs", "fight infection"]]);
      msg = t < 6 ? "Separating…" : "<b>Blood is a fluid connective tissue:</b> plasma about 55% and formed elements about 45% of the volume (Fig. 3.12a).";
    } else {
      var k = Math.min(3, Math.floor(t + 1e-9));
      m += L.text(360, 50, ROWS[k][0], {size: 18, color: C.text, weight: 700}) + L.text(360, 100, "feels: " + ROWS[k][1], {size: 15, color: C.muted}) + L.text(360, 140, "function: " + ROWS[k][2], {size: 15, color: C.muted}) + L.text(360, 200, ROWS[k][3], {size: 30, color: C.path, weight: 700});
      L.svg(m, ROWS[k][3], 300);
      L.readoutHTML('<table class="lab-table"><caption>Table 3.4: connective tissues</caption><thead><tr><th>Action</th><th>Function</th><th>Tissue</th></tr></thead><tbody>' + ROWS.map(function(r, i){ var d = i <= k && t > 0; return '<tr' + (d ? '' : ' class="pending"') + '><td>' + r[0] + '</td><td>' + (d ? r[2] : "?") + '</td><td>' + (d ? r[3] : "?") + '</td></tr>'; }).join("") + '</tbody></table>');
      msg = t < 4 ? "Try each action…" : "<b>Activity 3.3:</b> Bone gives strength; Cartilage gives flexibility; Tendon joins muscle to bone; Ligament joins bone to bone.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["epi", "Exercise Q3: thin vs thick lining"], ["blood", "Fig. 3.12a: blood"], ["act33", "Activity 3.3: connective tissues"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.animalTissues = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Muscles and neurons
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "neuron"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "muscles" ? 3 : 5, step: 1, speed: 1});
    L.legend(id === "neuron" ? [["#fbbf24", "message (nerve impulse)"], ["#a78bfa", "neuron"]] : [["#f472b6", "muscle"], ["#a78bfa", "nucleus"]]);
    L.watch({neuron: "Fig. 3.14: a message enters at the dendrites and leaves at the axon terminals.", muscles: "Fig. 3.13: compare skeletal, smooth and cardiac muscle cells.", exercise: "During exercise the brain signals the heart to beat faster (heart-rate values are illustrative)."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "neuron"){
      m += L.circle(170, 150, 40, "rgba(167,139,250,0.3)", ' stroke="#a78bfa" stroke-width="3"') + L.circle(170, 150, 12, "#7c3aed");
      [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1]].forEach(function(d){ m += L.line(170 + d[0] * 38, 150 + d[1] * 38, 170 + d[0] * 90 + (d[0] === 0 ? 20 : 0), 150 + d[1] * 90, "#a78bfa", 4); });
      m += L.line(210, 150, 600, 150, "#a78bfa", 6);
      [[-1], [0], [1]].forEach(function(d){ m += L.line(600, 150, 650, 150 + d[0] * 40, "#a78bfa", 4) + L.circle(652, 150 + d[0] * 40, 7, "#a78bfa"); });
      m += L.text(80, 60, "dendrites", {size: 13, color: C.muted}) + L.text(170, 215, "cell body + nucleus", {size: 13, color: C.muted}) + L.text(400, 130, "axon", {size: 13, color: C.muted}) + L.text(650, 230, "axon terminals", {size: 13, color: C.muted});
      var x = t < 1 ? 80 + t * 90 : t < 2 ? 170 : 170 + (t - 2) / 3 * 480;
      if(t > 0) m += L.circle(Math.min(650, x), 150, 10, "#fbbf24", ' stroke="#fff" stroke-width="2"');
      L.svg(m, "Neuron carrying a message.", 300);
      var where = t <= 0 ? "—" : t < 1 ? "dendrites" : t < 2 ? "cell body" : t < 4.9 ? "axon" : "axon terminals";
      L.readout([["Message is at", where, "#fbbf24"], ["Dendrites", "receive signals"], ["Axon", "carries messages away"], ["Axon terminals", "pass messages on"]]);
      msg = t < 5 ? "Message travelling…" : "<b>Neuron:</b> dendrites receive, the cell body processes, the axon carries the message to the <b>axon terminals</b>, which pass it to the next cell.";
    } else if(st.preset === "muscles"){
      var k = Math.floor(t + 1e-9);
      if(t > 0){ m += L.rect(40, 110, 180, 60, "rgba(244,114,182,0.3)", ' stroke="#f472b6" stroke-width="2" rx="10"'); for(var i = 0; i < 10; i++) m += L.line(55 + i * 16, 112, 55 + i * 16, 168, "rgba(244,114,182,0.7)", 2); [70, 130, 190].forEach(function(x){ m += L.circle(x, 140, 5, "#a78bfa"); }); m += L.text(130, 200, "skeletal: striated, many nuclei, unbranched", {size: 12, color: C.text}) + L.text(130, 218, "voluntary", {size: 12, color: C.muted}); }
      if(t > 1) { m += '<path d="M270 140 q70 -40 140 0 q-70 40 -140 0 z" fill="rgba(244,114,182,0.3)" stroke="#f472b6" stroke-width="2"/>' + L.circle(340, 140, 5, "#a78bfa") + L.text(340, 200, "smooth: spindle, one nucleus, no striations", {size: 12, color: C.text}) + L.text(340, 218, "involuntary", {size: 12, color: C.muted}); }
      if(t > 2) { m += '<path d="M470 120 h80 l30 -20 M550 120 l30 20 M470 160 h110" stroke="#f472b6" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.5"/>' + L.circle(510, 120, 5, "#a78bfa") + L.circle(530, 160, 5, "#a78bfa") + L.text(560, 200, "cardiac: branched, one nucleus, faint striations", {size: 12, color: C.text}) + L.text(560, 218, "involuntary, heart only", {size: 12, color: C.muted}); }
      L.svg(m, "Three types of muscle cells.", 300);
      L.readout([["Skeletal", "voluntary; attached to bones"], ["Smooth", "involuntary; stomach, intestines"], ["Cardiac", "involuntary; heart; never tires"]]);
      msg = k < 3 ? "Adding muscle types…" : "<b>Fig. 3.13:</b> skeletal (striated, many nuclei), smooth (spindle, no striations) and cardiac (branched, faint striations) muscle.";
    } else {
      var rate = t < 1 ? 72 : Math.min(120, 72 + (t - 1) * 16);
      m += L.text(150, 80, "brain", {size: 16, color: "#a78bfa", weight: 700}) + L.circle(150, 130, 35, "rgba(167,139,250,0.3)", ' stroke="#a78bfa" stroke-width="3"');
      m += L.text(500, 80, "heart", {size: 16, color: C.danger, weight: 700});
      var beat = 1 + 0.12 * Math.abs(Math.sin(t * rate / 60 * Math.PI * 2));
      m += '<path transform="translate(500 150) scale(' + beat + ')" d="M0 30 C -60 -10 -30 -60 0 -25 C 30 -60 60 -10 0 30 z" fill="' + C.danger + '"/>';
      if(t >= 1) m += L.arrow(190, 130, 450, 140, "#fbbf24", 3) + L.text(320, 120, "nerve signal: beat faster", {size: 13, color: "#fbbf24"});
      L.svg(m, "Heart rate " + Math.round(rate), 300);
      L.readout([["Activity", t < 1 ? "resting" : "running"], ["Heart rate (illustrative)", Math.round(rate) + " beats/min", C.danger]]);
      msg = t < 5 ? "Exercising…" : "<b>Muscles need instructions:</b> during exercise the brain signals the heart to beat faster, sending more oxygen to working muscles.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["neuron", "Fig. 3.14: neuron"], ["muscles", "Fig. 3.13: three muscles"], ["exercise", "Brain and heart during exercise"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.muscleNerve = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Joints and Activity 3.4
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "ball", weight: 50};
  var J = {ball: "ball and socket (shoulder)", hinge: "hinge (elbow, knee)", pivot: "pivot (neck)", fixed: "fixed (skull)"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 6, step: 1, speed: 1});
    L.legend(id === "weight" ? [["#e2e8f0", "bone"], ["#f472b6", "muscle"]] : [["#e2e8f0", "bone"], [C.path, "range of movement"]]);
    if(id === "weight"){
      L.watch("Activity 3.4: estimate bone (12–15%) and muscle (textbook adult averages) from body weight.");
      L.controls(L.slider("j5-w", "Body weight", 30, 80, 1, st.weight, st.weight + " kg"));
      L.onInput("j5-w", function(v){ st.weight = v; L.setVal("j5-w", v + " kg"); App.seekTimeline(6); });
    } else { L.watch("Watch every position the " + J[id] + " joint allows."); L.controls(""); }
    L.restart(true);
  }
  function draw(t){
    var m = "", msg, ph = t / 6 * Math.PI * 2;
    if(st.preset === "weight"){
      var w = st.weight, b1 = w * 0.12, b2 = w * 0.15;
      m += L.rect(100, 60, 520, 40, "#334155", ' rx="8"') + L.rect(100, 60, 520 * 0.135, 40, "#e2e8f0", ' rx="8"') + L.text(360, 50, "total " + w + " kg", {size: 14, color: C.text});
      m += L.text(110, 130, "bone ≈ 12–15%: " + L.num(b1, 1) + "–" + L.num(b2, 1) + " kg", {size: 15, color: "#e2e8f0", anchor: "start"});
      m += L.text(110, 170, "muscle (adult female avg 30–40%): " + L.num(w * 0.3, 1) + "–" + L.num(w * 0.4, 1) + " kg", {size: 15, color: "#f472b6", anchor: "start"});
      m += L.text(110, 210, "muscle (adult male avg 40–50%): " + L.num(w * 0.4, 1) + "–" + L.num(w * 0.5, 1) + " kg", {size: 15, color: "#f472b6", anchor: "start"});
      L.svg(m, "Bone and muscle estimates.", 300);
      L.readout([["Body weight", w + " kg"], ["Bone (12–15%)", L.num(b1, 1) + "–" + L.num(b2, 1) + " kg"], ["Muscle (30–50%)", L.num(w * 0.3, 1) + "–" + L.num(w * 0.5, 1) + " kg"]]);
      msg = "<b>Activity 3.4:</b> for " + w + " kg, bone ≈ " + L.num(b1, 1) + "–" + L.num(b2, 1) + " kg (12–15%). Values vary with age, gender and body composition.";
    } else {
      var cx = 300, cy = 150, ang = 0, label = "";
      m += L.circle(cx, cy, 16, "#94a3b8");
      if(st.preset === "ball"){ ang = ph; m += L.circle(cx, cy, 120, "none", ' stroke="' + C.path + '" stroke-width="2" stroke-dasharray="6 5"'); label = "moves in all directions, even in a circle"; }
      else if(st.preset === "hinge"){ ang = -Math.PI / 2 + (Math.sin(ph - Math.PI / 2) + 1) / 2 * (150 * Math.PI / 180); m += '<path d="M' + cx + ' ' + (cy - 120) + ' A120 120 0 0 1 ' + (cx + 120 * Math.cos(-Math.PI / 2 + 2.6)) + ' ' + (cy + 120 * Math.sin(-Math.PI / 2 + 2.6)) + '" fill="none" stroke="' + C.path + '" stroke-width="2" stroke-dasharray="6 5"/>'; label = "bends and straightens in one plane"; }
      else if(st.preset === "pivot"){ ang = -Math.PI / 2 + Math.sin(ph) * 1.2; label = "turns side to side"; }
      else { ang = -Math.PI / 2; label = "cannot move"; }
      m += L.line(cx, cy, cx - 150, cy, "#e2e8f0", 16) + L.line(cx, cy, cx + Math.cos(ang) * 120, cy + Math.sin(ang) * 120, "#e2e8f0", 14);
      if(st.preset === "fixed") m += L.text(cx, cy - 30, "bones locked together", {size: 13, color: C.muted});
      m += L.text(560, 120, J[st.preset], {size: 16, color: C.text, weight: 700}) + L.text(560, 150, label, {size: 14, color: C.path});
      L.svg(m, J[st.preset] + " joint: " + label, 300);
      L.readout([["Joint", J[st.preset]], ["Movement", label, C.path], ["Angle now", Math.round(((ang + Math.PI / 2) * 180 / Math.PI + 360) % 360) + "°"]]);
      msg = t < 6 ? "Moving…" : st.preset === "ball" ? "<b>Ball and socket:</b> movement in all directions." : st.preset === "hinge" ? "<b>Hinge:</b> movement in one plane only, like a door." : st.preset === "pivot" ? "<b>Pivot:</b> the head turns side to side on the backbone." : "<b>Fixed joint:</b> skull bones cannot move, protecting the brain.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["ball", "Ball and socket"], ["hinge", "Hinge"], ["pivot", "Pivot"], ["fixed", "Fixed"], ["weight", "Activity 3.4: bone & muscle"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.joints = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Rib cage and spine
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "breathe"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 8, step: 1, speed: 1});
    L.legend(id === "breathe" ? [["#e2e8f0", "ribs"], [C.vel, "air"], ["#fbbf24", "cartilage"]] : [["#e2e8f0", "vertebrae"], ["#fbbf24", "cartilage discs"]]);
    L.watch(id === "breathe" ? "The rib cage expands and contracts, changing the space inside the chest (schematic)." : "Bend the spine: the cartilage discs between vertebrae squeeze on one side and stretch on the other (schematic).");
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, s = 0.5 - 0.5 * Math.cos(t / 4 * Math.PI * 2);
    if(st.preset === "breathe"){
      var w = 110 + 30 * s;
      m += L.rect(355, 40, 10, 220, "#fbbf24", ' rx="4"');
      for(var i = 0; i < 6; i++){ var y = 70 + i * 32; m += '<path d="M360 ' + y + ' q' + (-w) + ' 10 ' + (-w + 10) + ' 30 M360 ' + y + ' q' + w + ' 10 ' + (w - 10) + ' 30" stroke="#e2e8f0" stroke-width="6" fill="none"/>'; }
      var dir = Math.sin(t / 4 * Math.PI * 2) > 0 ? 1 : -1;
      m += L.arrow(360, dir > 0 ? 0 : 36, 360, dir > 0 ? 36 : 0, C.vel, 4) + L.text(420, 24, dir > 0 ? "air in" : "air out", {size: 14, color: C.vel, anchor: "start"});
      L.svg(m, "Rib cage breathing.", 300);
      L.readout([["Chest space (relative)", L.num(100 + 30 * s, 0) + " %", C.vel], ["Ribs", "12 pairs; joined by cartilage"], ["Phase", dir > 0 ? "breathing in" : "breathing out"]]);
      msg = t < 8 ? "Breathing…" : "<b>Rib cage:</b> flexible cartilage lets it expand (more space: air moves in) and contract (less space: air moves out) while still protecting the heart and lungs.";
    } else {
      var bend = Math.sin(t / 8 * Math.PI) * 0.35;
      for(var k = 0; k < 8; k++){
        var a = bend * k / 7, x = 360 + Math.sin(a) * k * 30, y = 260 - Math.cos(a) * k * 30;
        m += L.rect(x - 30, y - 10, 60, 20, "#e2e8f0", ' rx="4" transform="rotate(' + (a * 57.3) + ' ' + x + ' ' + y + ')"');
        if(k < 7) m += L.circle(x + Math.sin(a) * 15, y - Math.cos(a) * 15, 7, "#fbbf24");
      }
      L.svg(m, "Spine bending.", 300);
      L.readout([["Bend", Math.round(bend * 57) + "°"], ["Cartilage discs", "cushion and allow flexibility", "#fbbf24"]]);
      msg = t < 8 ? "Bending…" : "<b>Vertebral column:</b> many small vertebrae with cartilage discs between them let us bend and twist without injuring the spinal cord.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["breathe", "Rib cage and breathing"], ["spine", "Spine and cartilage discs"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.skeleton = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Steward's carrot experiment (Fig. 3.19, Table 3.6)
(function(){
  var L = LAB, C = L.C;
  var STEPS = ["carrot root cross-section", "2-mg fragments in nutrient medium", "single cells shear off and divide", "embryonic plant from one cell", "plantlet on agar, then soil", "adult carrot plant"];
  var st = {preset: "regen"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "regen" ? 6 : 3, step: 1, speed: 0.8});
    L.legend(id === "regen" ? [[C.path, "current stage"], ["#34d399", "growing plant"]] : [["#34d399", "increase"], [C.danger, "reduced"]]);
    L.watch(id === "regen" ? "Fig. 3.19: F. C. Steward's regeneration of a carrot plant from single phloem cells (1958)." : "Table 3.6: effect of light, air and nutrient medium on the growth of cultured carrot cells.");
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, k = Math.min(STEPS.length - 1, Math.floor(t + 1e-9));
    if(st.preset === "regen"){
      STEPS.forEach(function(s, i){
        var x = 70 + i * 116, on = t > i || (i === 0 && t > 0);
        m += L.circle(x, 130, 40, on ? "rgba(52,211,153,0.2)" : "#1e293b", ' stroke="' + (i === k && t > 0 ? C.path : on ? "#34d399" : C.faint) + '" stroke-width="3"');
        if(i < 5) m += L.arrow(x + 44, 130, x + 72, 130, on ? "#34d399" : C.faint, 3);
        m += L.text(x, 200 + (i % 2) * 20, s, {size: 11, color: on ? C.text : C.faint});
      });
      function carrot(x){ return '<path d="M' + (x - 10) + ' 112 L' + x + ' 158 L' + (x + 10) + ' 112 z" fill="#f97316"/><path d="M' + x + ' 112 l-8 -14 M' + x + ' 112 l0 -16 M' + x + ' 112 l8 -14" stroke="#22c55e" stroke-width="3"/>'; }
      m += carrot(70);
      if(t > 1) [[-10, -6], [6, -8], [-4, 8], [10, 6]].forEach(function(d){ m += L.circle(186 + d[0], 130 + d[1], 5, "#fbbf24"); });
      if(t > 2) m += L.circle(302, 130, 14, "#fbbf24") + L.line(288, 130, 316, 130, "#0f172a", 2) + L.line(302, 116, 302, 144, "#0f172a", 2);
      if(t > 3) m += '<path d="M418 150 q-12 -20 0 -40 q12 -10 6 10" stroke="#34d399" stroke-width="5" fill="none"/>';
      if(t > 4) m += L.rect(526, 110, 16, 40, "rgba(148,163,184,0.4)", ' rx="4"') + '<path d="M534 145 v-25 m0 8 l-8 -8 m8 4 l8 -8" stroke="#34d399" stroke-width="3" fill="none"/>';
      if(t > 5) m += carrot(650);
      L.svg(m, "Regeneration stage: " + STEPS[k], 300);
      L.readout([["Stage", (k + 1) + " of 6"], ["Now", t > 0 ? STEPS[k] : "—", C.path]]);
      msg = t < 6 ? "Regenerating…" : "<b>Totipotency:</b> a specialised phloem cell dedifferentiated, divided and redifferentiated into a whole carrot plant.";
    } else {
      var rows = [["light ✓, air ✗, solid medium", -1], ["light ✓, air ✓, liquid medium", 20], ["light ✗, air ✓, liquid medium", -1]];
      rows.forEach(function(r, i){
        var on = t > i, y = 70 + i * 70;
        m += L.text(40, y + 5, r[0], {size: 14, color: on ? C.text : C.faint, anchor: "start"});
        if(on) m += r[1] > 0 ? L.rect(360, y - 14, 20 * 12, 28, "#34d399", ' rx="4"') + L.text(620, y + 5, "20% increased", {size: 14, color: "#34d399", anchor: "start"}) : L.rect(330, y - 14, 30, 28, C.danger, ' rx="4"') + L.text(380, y + 5, "reduced", {size: 14, color: C.danger, anchor: "start"});
      });
      L.svg(m, "Table 3.6 results.", 300);
      L.readout([["Best growth", "light + air + liquid medium (20% increase)", "#34d399"], ["Reduced", "no air (solid) or no light"]]);
      msg = t < 3 ? "Showing results…" : "<b>Table 3.6:</b> only light + air + liquid nutrient medium increased fresh weight (by 20%). The table does not show which of the other two was reduced more.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["regen", "Fig. 3.19: cell to plant"], ["table", "Table 3.6: growing conditions"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.totipotency = {mount: mount, draw: draw, select: select, state: st};
})();
