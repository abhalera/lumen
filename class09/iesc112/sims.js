// iesc112 labs: Patterns in Life — Diversity and Classification. Drawings are schematic; values marked illustrative are not from the textbook.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function clamp12(x, a, b){ return Math.max(a, Math.min(b, x)); }
function card12(L, x, y, w, h, title, sub, col, op){ return '<g opacity="' + (op === undefined ? 1 : op).toFixed(2) + '">' + L.rect(x, y, w, h, "#1e293b", ' rx="10" stroke="' + col + '" stroke-width="2"') + L.text(x + w / 2, y + 24, title, {size: 14, color: col, weight: 700}) + (sub ? L.text(x + w / 2, y + 46, sub, {size: 11, color: L.C.muted}) : "") + '</g>'; }

// Lab 1 — Biodiversity, endemic species and hotspots
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "roles"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "crops" ? [[C.ok, "healthy plant"], [C.danger, "failed plant"]] : [[C.path, "highlighted"]]);
    L.watch({roles: "Chapter introduction: what different organisms do for life on the Earth.", endemic: "Fig. 12.1: four species found naturally only in India.", hotspots: "Section 12.1: global biodiversity hotspots that include parts of India (schematic positions).", crops: "A dry year with a pest outbreak hits a single-variety field and a mixed-variety field (numbers illustrative)."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i, f = clamp12(t / 2, 0, 1);
    if(st.preset === "roles"){
      m += L.circle(360, 150, 55, "#0f172a", ' stroke="#94a3b8" stroke-width="2"') + L.text(360, 146, "life on", {size: 13, color: C.text}) + L.text(360, 164, "the Earth", {size: 13, color: C.text});
      [["ocean algae", "most of our oxygen", 140, 60], ["fungi and bacteria", "fertile soil", 580, 60], ["bees, birds, bats", "pollination", 140, 240], ["plants", "food for nearly all life", 580, 240]].forEach(function(r, j){
        var op = clamp12(t * 1.6 - j * 0.5, 0, 1);
        m += card12(L, r[2] - 110, r[3] - 35, 220, 64, r[0], r[1], C.path, op) + (op > 0.5 ? L.line(r[2] + (r[2] < 360 ? 110 : -110), r[3], 360 + (r[2] < 360 ? -50 : 50), 150 + (r[3] < 150 ? -25 : 25), C.faint, 2) : "");
      });
      L.svg(m, "Roles of organisms", 290);
      L.readout([["Ocean algae", "release most of the oxygen we breathe"], ["Fungi and bacteria", "decompose leaves into manure"], ["Birds, bees and bats", "pollinate flowers"], ["Plants", "make food that supports nearly all life", C.path]]);
      msg = t < 3 ? "Connecting…" : "Every organism has a role: <b>algae give most of our oxygen</b>, decomposers make soil fertile, pollinators help plants reproduce, and plants feed nearly all life.";
    } else if(st.preset === "endemic"){
      [["Nilgiri tahr", "Nilgiri Hills, Western Ghats"], ["Lion-tailed macaque", "Western Ghats forests"], ["Nepenthes khasiana", "pitcher plant of Meghalaya"], ["Neelakurinji", "Western Ghats hills"]].forEach(function(r, j){
        var op = clamp12(t * 1.6 - j * 0.5, 0, 1);
        m += card12(L, 40 + (j % 2) * 340, 30 + Math.floor(j / 2) * 120, 300, 90, r[0], r[1], C.ok, op);
      });
      L.svg(m, "Endemic species of India", 280);
      L.readout([["Endemic species", "found naturally only in one region"], ["Examples (Fig. 12.1)", "Nilgiri tahr, lion-tailed macaque, Nepenthes khasiana, Neelakurinji", C.ok]]);
      msg = t < 3 ? "Showing species…" : "These four are <b>found naturally only in India</b>: they are endemic species.";
    } else if(st.preset === "hotspots"){
      m += '<ellipse cx="360" cy="160" rx="120" ry="110" fill="#1e293b" stroke="#475569" stroke-dasharray="6 5"/>' + L.text(360, 165, "India (schematic)", {size: 13, color: C.muted});
      [["Himalayas", 360, 40], ["Indo-Burma (incl. North East India)", 590, 110], ["Western Ghats", 170, 210], ["Sundaland (incl. Nicobar Islands)", 580, 250]].forEach(function(r, j){
        if(t < j * 0.6) return;
        m += L.circle(r[1], r[2], 12, C.path) + L.text(r[1], r[2] + (r[2] < 60 ? -18 : 30), r[0], {size: 13, color: C.path, weight: 700});
      });
      L.svg(m, "Biodiversity hotspots", 300);
      L.readout([["A hotspot has", "many endemic species + major habitat loss"], ["Examples", "Western Ghats, Indo-Burma, Himalayas, Sundaland", C.path]]);
      msg = t < 3 ? "Marking hotspots…" : "Hotspots including parts of India: <b>Western Ghats, Indo-Burma</b>, the Himalayas and Sundaland. Protecting them keeps food webs healthy.";
    } else {
      var hit = t >= 1.2, variety = ["#16a34a", "#65a30d", "#0d9488", "#ca8a04"];
      [[40, "one variety only", false], [380, "four varieties", true]].forEach(function(fld){
        var alive = 0;
        for(i = 0; i < 16; i++){
          var x = fld[0] + 30 + (i % 4) * 75, y = 70 + Math.floor(i / 4) * 55, v = fld[2] ? i % 4 : 0, survives = !hit || (fld[2] && (v === 1 || v === 2));
          if(survives) alive++;
          m += L.line(x, y + 20, x, y, survives ? variety[v] : "#78716c", 4) + '<ellipse cx="' + x + '" cy="' + (y - 4) + '" rx="12" ry="7" fill="' + (survives ? variety[v] : "#a8a29e") + '"/>';
        }
        m += L.text(fld[0] + 150, 290, fld[1] + ": " + alive + " of 16 survive", {size: 13, color: C.text});
      });
      if(hit) m += L.text(360, 35, "dry year + pest outbreak", {size: 14, color: C.danger, weight: 700});
      L.svg(m, "Single-variety and diverse fields", 300);
      L.readout([["Single variety", hit ? "0 of 16 plants survive" : "16 healthy", C.danger], ["Four varieties", hit ? "8 of 16 survive (drought-tolerant and pest-resistant)" : "16 healthy", C.ok]]);
      msg = t < 3 ? "Growing season…" : "The single-variety field failed all at once, while the <b>diverse field kept part of its harvest</b>. Diversity reduces the risk of crop failure.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["roles", "Roles in nature"], ["endemic", "Fig. 12.1: endemic species"], ["hotspots", "Biodiversity hotspots"], ["crops", "Why farmers keep varieties"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.biodiversity = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Grouping by different criteria (Activity 12.1) and Pakke (Activity 12.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "habitat"};
  var ORG = [["eagle", "air", "day", "meat"], ["owl", "tree", "night", "meat"], ["bat", "air", "night", "insects"], ["butterfly", "air", "day", "plants"], ["deer", "forest floor", "day", "plants"], ["leopard", "forest floor", "night", "meat"], ["frog", "water", "night", "insects"]];
  var GROUPS = {habitat: ["air", "tree", "forest floor", "water"], active: ["day", "night"], diet: ["meat", "insects", "plants"]};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 2, step: 0.05, speed: 0.6});
    L.legend([[C.path, "animals"], [C.muted, "groups"]]);
    L.watch({habitat: "Activity 12.1: group the same seven animals by where they are usually seen.", active: "Activity 12.1: group them by when they are usually active.", diet: "Table 12.2: group them by what they mainly eat.", pakke: "Activity 12.2: the Pakke Tiger Reserve and its four hornbill species."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, f = clamp12(t / 1.5, 0, 1);
    if(st.preset === "pakke"){
      m += L.rect(60, 60, 600, 30, "#1e293b", ' rx="6"') + L.rect(60, 60, 600 * 300 / 1300 * f, 30, C.path, ' rx="6"') + L.text(60, 50, "bird species: Pakke ≈ 300 of India's ≈ 1,300", {size: 13, color: C.text, anchor: "start"});
      ["Rufous-necked", "Oriental Pied", "Great", "Wreathed"].forEach(function(h, j){ var op = clamp12(t * 2 - j * 0.35, 0, 1); m += card12(L, 40 + j * 165, 130, 150, 70, h, "hornbill", C.ok, op); });
      m += L.text(360, 250, "nest only in large, old trees · eat specific fruits", {size: 13, color: C.muted});
      L.svg(m, "Pakke Tiger Reserve birds", 280);
      L.readout([["Bird species in Pakke", "≈ 300"], ["Share of India's birds", "300 ÷ 1300 ≈ 23%", C.path], ["Hornbill species", "4", C.ok]]);
      msg = t < 2 ? "Surveying…" : "Pakke holds nearly 300 of India's about 1,300 bird species (about 23%), including <b>four hornbill species</b> that need large, old trees.";
    } else {
      var key = {habitat: 1, active: 2, diet: 3}[st.preset], gs = GROUPS[st.preset], w = 640 / gs.length;
      gs.forEach(function(g, j){ m += L.rect(40 + j * w, 150, w - 12, 130, "#0f172a", ' rx="10" stroke="#475569" stroke-dasharray="5 4"') + L.text(40 + j * w + (w - 12) / 2, 172, g, {size: 13, color: C.muted, weight: 700}); });
      var count = {};
      ORG.forEach(function(o, j){
        var gi = gs.indexOf(o[key]), slot = count[gi] = (count[gi] || 0) + 1;
        var x0 = 70 + j * 95, y0 = 60, x1 = 40 + gi * w + 20 + ((slot - 1) % 2) * ((w - 52) / 2), y1 = 190 + Math.floor((slot - 1) / 2) * 38;
        var x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f;
        m += L.rect(x - 2, y, 84, 28, C.path, ' rx="14"') + L.text(x + 40, y + 19, o[0], {size: 12, color: "#0f172a", weight: 700});
      });
      L.svg(m, "Grouping animals", 300);
      L.readout(gs.map(function(g){ return [g, ORG.filter(function(o){ return o[key] === g; }).map(function(o){ return o[0]; }).join(", "), C.path]; }));
      var what = {habitat: "where they live", active: "when they are active", diet: "what they eat"}[st.preset];
      msg = t < 2 ? "Sorting…" : "Grouped by " + what + ": the same animals fall into <b>different groups</b> for each criterion (for example, the owl joins the eagle as a meat-eater but the bat as a night-flier).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["habitat", "Where they live"], ["active", "When they are active"], ["diet", "What they eat"], ["pakke", "Activity 12.2: Pakke"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.grouping = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Classification systems and the five kingdoms (Figs. 12.4–12.8)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "timeline"};
  var PATHS = {keyMushroom: {name: "Mushroom", ans: [true, false, false, true], kingdom: "Fungi"}, keyAmoeba: {name: "Amoeba", ans: [true, true], kingdom: "Protista"}};
  var Q = ["True (membrane-bound) nucleus?", "Unicellular?", "Makes its own food (autotrophic)?", "Chitin cell wall; absorbs food?"];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "timeline" ? {maxT: 4, step: 1, speed: 1} : {maxT: 3, step: 0.05, speed: 0.6});
    L.legend([[C.path, "path followed"], [C.muted, "other branches"]]);
    L.watch({timeline: "Fig. 12.4: how classification systems changed over time.", keyMushroom: "Fig. 12.5: using the five-kingdom criteria on a mushroom.", keyAmoeba: "Fig. 12.5: using the five-kingdom criteria on an amoeba.", sort: "Sorting ten organisms into the five kingdoms."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "timeline"){
      var k = Math.floor(t + 1e-9), ev = [["4th c. BCE", "Aristotle", "habitat: land, water, air"], ["1758", "Linnaeus", "two kingdoms"], ["1866", "Haeckel", "three: + Protista"], ["1938", "Copeland", "four: + Monera"], ["1969", "Whittaker", "five: + Fungi"]];
      m += L.line(50, 150, 670, 150, "#475569", 3);
      ev.forEach(function(e, j){ var x = 70 + j * 145, on = j <= k; m += L.circle(x, 150, 10, on ? C.path : "#334155") + (on ? L.text(x, 110, e[0], {size: 13, color: C.path, weight: 700}) + L.text(x, 190, e[1], {size: 13, color: C.text, weight: 700}) + L.text(x, 210, e[2], {size: 11, color: C.muted}) : ""); });
      L.svg(m, "Timeline of classification systems", 260);
      L.readout(ev.filter(function(e, j){ return j <= k; }).map(function(e){ return [e[0] + " · " + e[1], e[2]]; }));
      msg = t < 4 ? "Moving through history…" : "From Aristotle's habitat groups to <b>Whittaker's five kingdoms (1969)</b>: Monera, Protista, Fungi, Plantae, Animalia.";
    } else if(st.preset === "sort"){
      var K = ["Monera", "Protista", "Fungi", "Plantae", "Animalia"], items = [["bacteria", 0], ["cyanobacteria", 0], ["Amoeba", 1], ["Euglena", 1], ["yeast", 2], ["mushroom", 2], ["moss", 3], ["fern", 3], ["ant", 4], ["frog", 4]], f = clamp12(t / 2, 0, 1);
      K.forEach(function(k2, j){ m += L.rect(20 + j * 140, 150, 125, 130, "#0f172a", ' rx="10" stroke="#475569"') + L.text(82 + j * 140, 172, k2, {size: 13, color: C.path, weight: 700}); });
      items.forEach(function(it, j){ var x0 = 30 + j * 68, y0 = 50, n = j % 2, x1 = 30 + it[1] * 140, y1 = 190 + n * 40, x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f; m += L.rect(x, y, 105, 28, "#334155", ' rx="14"') + L.text(x + 52, y + 19, it[0], {size: 11, color: C.text}); });
      L.svg(m, "Sorting organisms into kingdoms", 300);
      L.readout(K.map(function(k2, j){ return [k2, items.filter(function(it){ return it[1] === j; }).map(function(it){ return it[0]; }).join(", ")]; }));
      msg = t < 2 ? "Sorting…" : "All ten sorted: <b>2 in each kingdom</b>, using cell type, cell wall, number of cells and mode of nutrition. (Yeast is single-celled but has a chitin wall.)";
    } else {
      var P = PATHS[st.preset], step = Math.min(P.ans.length, Math.floor(t * P.ans.length / 2.5 + 1e-9));
      var ends = [["Monera", 0, false], ["Protista", 1, true], ["Plantae", 2, true], ["Fungi", 3, true], ["Animalia", 3, false]];
      Q.forEach(function(q, j){ var y = 40 + j * 62, on = j < step, active = j === step && step < P.ans.length; m += L.rect(160, y, 300, 40, "#1e293b", ' rx="8" stroke="' + (on || active ? C.path : "#475569") + '" stroke-width="2"') + L.text(310, y + 25, q, {size: 13, color: C.text}); if(j < P.ans.length && on) m += L.text(475, y + 25, P.ans[j] ? "yes" : "no", {size: 13, color: C.path, weight: 700, anchor: "start"}); });
      ends.forEach(function(e){ var y = 40 + e[1] * 62 + 25, x = e[2] ? 600 : 90; var reached = step >= P.ans.length && e[0] === P.kingdom; m += L.text(x, y, e[0] + (e[0] === "Monera" ? " (no)" : e[0] === "Protista" ? " (yes)" : e[0] === "Plantae" ? " (yes)" : e[0] === "Fungi" ? " (yes)" : " (no)"), {size: 13, color: reached ? C.ok : C.muted, weight: reached ? 700 : 400}); });
      L.svg(m, "Five kingdom key", 290);
      L.readout([["Organism", P.name], ["Answers", P.ans.slice(0, step).map(function(a){ return a ? "yes" : "no"; }).join(" → ") || "…", C.path], ["Kingdom", step >= P.ans.length ? P.kingdom : "…", C.ok]]);
      msg = step < P.ans.length ? "Following the key…" : P.name + ": " + (P.kingdom === "Fungi" ? "true nucleus, many cells, cannot make food, chitin wall and absorbs food, so " : "true nucleus and a single cell, so ") + "<b>Kingdom " + P.kingdom + "</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["timeline", "Fig. 12.4: timeline"], ["keyMushroom", "Key: mushroom"], ["keyAmoeba", "Key: amoeba"], ["sort", "Sort ten organisms"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.kingdoms = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Kingdom Plantae: five classes (Section 12.6.4, Table 12.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "thallophyta"};
  var FEAT = ["true roots, stems, leaves", "vascular tissue", "seeds", "flowers and fruits", "needs water for reproduction"];
  var G = {thallophyta: ["Thallophyta (algae)", [0, 0, 0, 0, 1], "<b>Thallophyta</b> (e.g. Spirogyra): a <b>simple thallus</b> living in water, exchanging gases and nutrients directly."], bryophyta: ["Bryophyta (mosses)", [0, 0, 0, 0, 1], "<b>Bryophyta</b>: rhizoids and simple parts, no vascular tissue, water needed for reproduction: the <b>amphibians of the plant kingdom</b>."], pteridophyta: ["Pteridophyta (ferns)", [1, 1, 0, 0, 1], "<b>Pteridophyta</b>: true roots, stems and leaves with xylem and phloem: <b>vascular tissue but no seeds</b>."], gymnosperm: ["Gymnosperms (pines)", [1, 1, 1, 0, 0], "<b>Gymnosperms</b>: needle leaves, no water needed for fertilisation, and <b>naked seeds on cones</b>."], angiosperm: ["Angiosperms (flowering)", [1, 1, 1, 1, 0], "<b>Angiosperms</b>: the most diverse group, with <b>flowers and fruits</b> enclosing their seeds."]};
  var ORDER = ["thallophyta", "bryophyta", "pteridophyta", "gymnosperm", "angiosperm"];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 2, step: 0.05, speed: 0.6});
    L.legend([[C.ok, "feature present"], [C.danger, "feature absent"]]);
    L.watch(id === "compare" ? "Table 12.3: all five classes side by side." : "Section 12.6.4: " + G[id][0] + " and its features.");
    L.controls(""); L.restart(true);
  }
  function plant(id, x, y, s){
    var m = "", i;
    if(id === "thallophyta"){ m += L.rect(x - 60 * s, y - 50 * s, 120 * s, 60 * s, "#0369a1", ' opacity="0.4" rx="6"'); for(i = 0; i < 3; i++) m += '<path d="M' + (x - 50 * s) + ' ' + (y - 35 * s + i * 15 * s) + ' q25 -8 50 0 t50 0" fill="none" stroke="#22c55e" stroke-width="3"/>'; }
    else if(id === "bryophyta"){ m += L.rect(x - 60 * s, y - 8 * s, 120 * s, 10 * s, "#4d7c0f"); for(i = 0; i < 9; i++) m += L.line(x - 50 * s + i * 12 * s, y - 8 * s, x - 50 * s + i * 12 * s, y - 28 * s, "#84cc16", 3); }
    else if(id === "pteridophyta"){ for(i = 0; i < 5; i++){ var a = -150 + i * 30; m += '<path d="M' + x + ' ' + y + ' q' + (40 * s * Math.cos(a * Math.PI / 180)) + ' ' + (-60 * s) + ' ' + (80 * s * Math.cos(a * Math.PI / 180)) + ' ' + (-40 * s) + '" fill="none" stroke="#16a34a" stroke-width="4"/>'; } }
    else if(id === "gymnosperm"){ m += L.rect(x - 5 * s, y - 20 * s, 10 * s, 20 * s, "#78350f") + '<polygon points="' + x + ',' + (y - 110 * s) + ' ' + (x - 45 * s) + ',' + (y - 20 * s) + ' ' + (x + 45 * s) + ',' + (y - 20 * s) + '" fill="#166534"/>' + '<ellipse cx="' + (x + 20 * s) + '" cy="' + (y - 40 * s) + '" rx="' + (6 * s) + '" ry="' + (10 * s) + '" fill="#a16207"/>'; }
    else { m += L.rect(x - 6 * s, y - 40 * s, 12 * s, 40 * s, "#78350f") + L.circle(x, y - 75 * s, 45 * s, "#15803d"); for(i = 0; i < 5; i++) m += L.circle(x - 30 * s + i * 15 * s, y - 90 * s + (i % 2) * 25 * s, 5 * s, i % 2 ? "#f97316" : "#ef4444"); }
    return m;
  }
  function draw(t){
    var m = "", msg, f = clamp12(t / 1.5, 0, 1);
    if(st.preset === "compare"){
      FEAT.forEach(function(ft, j){ m += L.text(210, 70 + j * 42, ft, {size: 12, color: C.text, anchor: "end"}); });
      ORDER.forEach(function(g, gi){
        var x = 260 + gi * 95, op = clamp12(t * 2.5 - gi * 0.4, 0, 1);
        m += '<g opacity="' + op.toFixed(2) + '">' + L.text(x, 40, G[g][0].split(" ")[0], {size: 11, color: C.path, weight: 700});
        G[g][1].forEach(function(v, j){ m += L.circle(x, 66 + j * 42, 11, v ? C.ok : C.danger) + L.text(x, 71 + j * 42, v ? "✓" : "✗", {size: 12, color: "#0f172a", weight: 700}); });
        m += '</g>';
      });
      L.svg(m, "Plant classes compared", 290);
      L.readout([["Vascular tissue first appears", "Pteridophyta", C.ok], ["Seeds first appear", "Gymnosperms", C.ok], ["Flowers and fruits", "Angiosperms only", C.ok], ["Free of water for reproduction", "Gymnosperms and angiosperms"]]);
      msg = t < 2 ? "Comparing…" : "Each group adds a new feature: vascular tissue (ferns), seeds (gymnosperms), then flowers and fruits (angiosperms), freeing plants from water step by step.";
    } else {
      var g2 = G[st.preset];
      m += L.line(40, 250, 300, 250, "#475569", 2) + plant(st.preset, 170, 250, 1.3);
      FEAT.forEach(function(ft, j){ var on = t >= 0.3 + j * 0.3, v = g2[1][j]; if(on) m += L.circle(360, 60 + j * 42, 12, v ? C.ok : C.danger) + L.text(360, 65 + j * 42, v ? "✓" : "✗", {size: 13, color: "#0f172a", weight: 700}) + L.text(385, 65 + j * 42, ft, {size: 13, color: v ? C.text : C.muted, anchor: "start"}); });
      m += L.text(170, 40, g2[0], {size: 15, color: C.path, weight: 700});
      L.svg(m, g2[0], 280);
      L.readout(FEAT.map(function(ft, j){ return [ft, g2[1][j] ? "yes" : "no", g2[1][j] ? C.ok : C.danger]; }));
      msg = t < 2 ? "Checking features…" : g2[2];
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["thallophyta", "Thallophyta"], ["bryophyta", "Bryophyta"], ["pteridophyta", "Pteridophyta"], ["gymnosperm", "Gymnosperms"], ["angiosperm", "Angiosperms"], ["compare", "Table 12.3: compare"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.plantGroups = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Kingdom Animalia (Figs. 12.14–12.16, Section 12.7)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "phyla"};
  var PHY = [["Porifera", "sponges", "cellular", "none"], ["Cnidaria", "Hydra, jellyfish", "tissue", "none"], ["Platyhelminthes", "flatworms", "organ", "none"], ["Nematoda", "roundworms", "organ system", "none"], ["Annelida", "earthworm", "organ system", "none"], ["Arthropoda", "insects, crabs", "organ system", "exoskeleton"], ["Mollusca", "snail, octopus", "organ system", "shell (exoskeleton)"], ["Echinodermata", "starfish", "organ system", "endoskeleton"]];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "phyla" ? {maxT: 8, step: 1, speed: 1.5} : {maxT: 3, step: 0.05, speed: 0.6});
    L.legend([[C.path, "highlighted"], [C.ok, "result"]]);
    L.watch({phyla: "Fig. 12.16: the eight invertebrate phyla, with level of organisation and skeleton.", key: "A simple key for an earthworm, a crab and a starfish.", vertebrates: "Section 12.6.5: the five groups of vertebrates.", adaptations: "Section 12.7: structures that suit animals to their environments."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "phyla"){
      var k = Math.floor(t + 1e-9);
      PHY.forEach(function(p, j){ if(j > k) return; var x = 20 + (j % 4) * 172, y = 20 + Math.floor(j / 4) * 135; m += L.rect(x, y, 160, 120, "#1e293b", ' rx="10" stroke="' + C.path + '"') + L.text(x + 80, y + 24, p[0], {size: 13, color: C.path, weight: 700}) + L.text(x + 80, y + 46, p[1], {size: 12, color: C.text}) + L.text(x + 80, y + 76, "level: " + p[2], {size: 11, color: C.muted}) + L.text(x + 80, y + 98, "skeleton: " + p[3], {size: 11, color: C.muted}); });
      L.svg(m, "Invertebrate phyla", 300);
      L.readout([["Phyla shown", String(Math.min(8, k + 1)) + " of 8"], ["Simplest", "Porifera: cellular level, no tissues"], ["Internal skeleton without a notochord", "Echinodermata", C.path]]);
      msg = t < 8 ? "Adding phyla…" : "From sponges (cellular level) to starfish (endoskeleton), <b>body organisation becomes more complex</b>: tissues, organs, organ systems, segments and skeletons.";
    } else if(st.preset === "key"){
      var s = Math.floor(t / 0.75 + 1e-9), cols = [["earthworm", ["no", "yes", "no"], "Annelida"], ["crab", ["no", "yes", "yes"], "Arthropoda"], ["starfish", ["no", "no", "yes"], "Echinodermata"]], qs = ["Notochord?", "Segmented body?", "Jointed legs / spiny skin with endoskeleton?"];
      qs.forEach(function(q, j){ m += L.text(20, 80 + j * 60, q, {size: 12, color: C.muted, anchor: "start"}); });
      cols.forEach(function(c, j){ var x = 390 + j * 115; m += L.text(x, 40, c[0], {size: 14, color: C.text, weight: 700}); c[1].forEach(function(a, q){ if(q < s) m += L.text(x, 85 + q * 60, a, {size: 14, color: C.path, weight: 700}); }); if(s >= 4) m += L.text(x, 275, c[2], {size: 13, color: C.ok, weight: 700}); });
      L.svg(m, "Invertebrate key", 290);
      L.readout(cols.map(function(c){ return [c[0], s >= 4 ? c[2] : "…", C.ok]; }));
      msg = t < 3 ? "Answering the key…" : "No notochord for any of them. Earthworm → <b>Annelida</b> (segmented, no jointed legs); crab → Arthropoda (jointed legs, exoskeleton); starfish → Echinodermata (spiny skin, endoskeleton).";
    } else if(st.preset === "vertebrates"){
      [["Fish", "fins, gills; water"], ["Amphibians", "water and land"], ["Reptiles", "scaly skin; mostly land"], ["Birds", "feathers, hollow bones"], ["Mammals", "hair, mammary glands"]].forEach(function(v, j){ var op = clamp12(t * 2 - j * 0.35, 0, 1), x = 20 + j * 140; m += '<g opacity="' + op.toFixed(2) + '">' + L.rect(x, 60, 128, 150, "#1e293b", ' rx="10" stroke="' + C.ok + '"') + L.text(x + 64, 88, v[0], {size: 14, color: C.ok, weight: 700}) + L.text(x + 64, 112, v[1], {size: 10, color: C.muted}); for(i = 0; i < 6; i++) m += L.rect(x + 34 + i * 11, 160, 8, 14, "#e2e8f0", ' rx="2"'); m += L.text(x + 64, 195, "backbone", {size: 10, color: C.text}) + '</g>'; });
      L.svg(m, "Vertebrate groups", 250);
      L.readout([["Shared by all five", "a vertebral column (backbone)", C.ok], ["Protects", "brain and spinal cord"], ["Before them", "protochordates with a notochord (e.g. Amphioxus)"]]);
      msg = t < 3 ? "Showing groups…" : "Fish, amphibians, reptiles, birds and mammals all have a <b>backbone</b> protecting the brain and spinal cord.";
    } else {
      [["fish", "fins and gills", "swim and breathe in water"], ["birds", "feathers, hollow bones", "flight"], ["camel", "fat storage", "survive the desert"], ["polar bear", "thick fur", "survive extreme cold"]].forEach(function(a, j){ var op = clamp12(t * 2 - j * 0.35, 0, 1); m += card12(L, 20 + j * 172, 80, 160, 110, a[0], a[1], C.path, op) + (op > 0.5 ? L.text(100 + j * 172, 170, a[2], {size: 11, color: C.text}) : ""); });
      L.svg(m, "Adaptations", 260);
      L.readout([["Mammals", "mammary glands improve survival of the young", C.path], ["Pattern", "body structure fits the environment"]]);
      msg = t < 3 ? "Showing adaptations…" : "Structures suit environments: fins and gills, feathers and hollow bones, <b>fat stores and thick fur</b>, and mammary glands in mammals.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["phyla", "Fig. 12.16: invertebrate phyla"], ["key", "A classification key"], ["vertebrates", "Vertebrates"], ["adaptations", "Adaptations"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.animalGroups = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Hierarchy and binomial names (Figs. 12.17–12.19, Table 12.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "tiger"};
  var LEVELS = ["Kingdom", "Phylum", "Class", "Order", "Family", "Genus", "Species"];
  var TAX = {tiger: ["Animalia", "Chordata", "Mammalia", "Carnivora", "Felidae", "Panthera", "P. tigris"], pea: ["Plantae", "Magnoliophyta", "Magnoliopsida", "Fabales", "Fabaceae", "Pisum", "P. sativum"]};
  var NAMES = [["Panthera tigris", true, "correct"], ["panthera tigris", false, "genus needs a capital letter"], ["Panthera Tigris", false, "species must be in small letters"], ["Mangifera indica", true, "correct"], ["indica Mangifera", false, "genus must come first"]];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "tiger" || id === "pea" ? {maxT: 7, step: 1, speed: 1.5} : id === "names" ? {maxT: 5, step: 1, speed: 1.2} : {maxT: 2, step: 0.05, speed: 0.6});
    L.legend(id === "names" ? [[C.ok, "follows the rules"], [C.danger, "breaks a rule"]] : [[C.path, "level"]]);
    L.watch({tiger: "Fig. 12.17: the tiger from kingdom to species (the tiger's list also has sub-phylum Vertebrata).", pea: "Fig. 12.17: the pea plant from kingdom to species.", names: "Section 12.8: which of these scientific names are written correctly?", domains: "Ready to Go Beyond (Fig. 12.19): Carl Woese's three domains."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, k = Math.floor(t + 1e-9);
    if(st.preset === "tiger" || st.preset === "pea"){
      var tx = TAX[st.preset];
      LEVELS.forEach(function(lv, j){ if(j > k - 1 && !(t >= 7)) return; var w = 620 - j * 70, x = 360 - w / 2, y = 20 + j * 38; m += L.rect(x, y, w, 32, "#1e293b", ' rx="6" stroke="' + C.path + '"') + L.text(x + 12, y + 21, lv, {size: 12, color: C.muted, anchor: "start"}) + '<text x="' + (x + w - 12) + '" y="' + (y + 21) + '" fill="' + C.text + '" font-size="14" text-anchor="end"' + (j >= 5 ? ' font-style="italic"' : '') + ' font-weight="700">' + tx[j] + '</text>'; });
      L.svg(m, "Classification hierarchy", 300);
      L.readout([["Levels shown", Math.min(7, k) + " of 7"], ["Going down", "fewer members, more shared features", C.path], ["Scientific name", st.preset === "tiger" ? "Panthera tigris" : "Pisum sativum", C.ok]]);
      msg = t < 7 ? "Going down the levels…" : "Seven levels down to the species <b>" + (st.preset === "tiger" ? "Panthera tigris" : "Pisum sativum") + "</b>: each level holds fewer members that share more features.";
    } else if(st.preset === "names"){
      NAMES.forEach(function(nm, j){ var y = 45 + j * 50; m += '<text x="200" y="' + y + '" fill="' + C.text + '" font-size="20" font-style="italic" text-anchor="middle">' + nm[0] + '</text>'; if(j < k || t >= 5) m += L.text(360, y, nm[1] ? "✓" : "✗", {size: 20, color: nm[1] ? C.ok : C.danger, weight: 700}) + L.text(400, y, nm[2], {size: 13, color: nm[1] ? C.ok : C.danger, anchor: "start"}); });
      L.svg(m, "Checking scientific names", 280);
      L.readout([["Rule 1", "two parts: genus, then species"], ["Rule 2", "genus with a capital, species in small letters"], ["Rule 3", "italics in print, underlined by hand"]]);
      msg = t < 5 ? "Checking…" : "Correct: Panthera tigris and Mangifera indica, with the <b>genus first with a capital</b> and the species in small letters, in italics.";
    } else {
      var f = clamp12(t / 1.5, 0, 1);
      m += L.line(360, 280, 360, 200, "#94a3b8", 6);
      [["Bacteria", 140], ["Archaea", 360], ["Eukarya", 580]].forEach(function(d, j){ var ex = 360 + (d[1] - 360) * f, ey = 200 - 110 * f; m += L.line(360, 200, ex, ey, "#94a3b8", 5) + L.circle(ex, ey, 10, C.path) + (f >= 1 ? L.text(d[1], 70, d[0], {size: 16, color: C.path, weight: 700}) : ""); });
      if(f >= 1) m += L.text(580, 50, "protists, fungi, plants, animals", {size: 11, color: C.muted});
      L.svg(m, "Three domains of life", 290);
      L.readout([["Proposed by", "Carl Woese, 1977"], ["Based on", "comparing genetic material (DNA)"], ["Domains", "Bacteria, Archaea, Eukarya", C.path]]);
      msg = t < 2 ? "Branching…" : "Comparing DNA, Carl Woese (1977) proposed three domains: <b>Bacteria, Archaea and Eukarya</b>, showing that microscopic life is far more diverse than once thought.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["tiger", "Fig. 12.17: tiger"], ["pea", "Fig. 12.17: pea"], ["names", "Writing scientific names"], ["domains", "Three domains"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.hierarchy = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Fossils and threats to biodiversity (Sections 12.9–12.10)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "fossils"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "fossils" ? {maxT: 5, step: 1, speed: 1.2} : {maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "fossils" ? [[C.path, "fossils"]] : [[C.ok, "healthy"], [C.danger, "declining"]]);
    L.watch({fossils: "Section 12.9: layers of rock laid down over time (schematic).", foodweb: "Section 12.10: a forest where a bee pollinates a fruit tree (illustrative).", sangai: "Bridging Science and Society: the Sangai deer and the phumdis of Loktak Lake.", shield: "Bridging Science and Society: villages with and without mangroves in a super cyclone (bars illustrative)."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "fossils"){
      var k = Math.floor(t + 1e-9), layers = [["#78716c", "single-celled life (stromatolites)"], ["#a8a29e", "shelled sea animals"], ["#d6d3d1", "fish"], ["#a16207", "reptiles, dinosaurs"], ["#ca8a04", "mammals, early humans"]];
      layers.forEach(function(l, j){ if(j > k) return; var y = 250 - j * 45; m += L.rect(120, y, 480, 45, l[0]) + L.text(620, y + 28, l[1], {size: 12, color: C.text, anchor: "start"}); m += L.circle(200 + j * 60, y + 22, 6 + j * 2, "#1f2937", ' opacity="0.8"'); });
      m += L.arrow(90, 290, 90, 60, C.faint, 2) + L.text(80, 60, "newer", {size: 11, color: C.muted, anchor: "end"}) + L.text(80, 285, "older", {size: 11, color: C.muted, anchor: "end"});
      L.svg(m, "Fossil layers", 300);
      L.readout([["Layers laid down", String(Math.min(5, k + 1))], ["Oldest (bottom)", "simplest organisms", C.path], ["Newest (top)", "more complex forms"]]);
      msg = t < 5 ? "Layers building up…" : "Deeper, older layers generally hold <b>simpler organisms</b>; newer layers hold more complex forms. Fossils record how life has changed.";
    } else if(st.preset === "foodweb"){
      var lost = clamp12((t - 0.8) / 1.5, 0, 1), nodes = [["bee", 120, 80, 1], ["fruit tree", 360, 80, 0.8], ["monkeys", 600, 60, 0.6], ["hornbills", 600, 170, 0.6], ["new seedlings", 360, 240, 0.7]];
      [[0, 1], [1, 2], [1, 3], [3, 4]].forEach(function(e){ m += L.line(nodes[e[0]][1], nodes[e[0]][2], nodes[e[1]][1], nodes[e[1]][2], "#475569", 3); });
      nodes.forEach(function(n, j){ var health = j === 0 ? 1 - lost : 1 - lost * n[3]; m += L.circle(n[1], n[2], 34, health > 0.6 ? "#14532d" : "#7f1d1d", ' opacity="' + (0.3 + 0.7 * health).toFixed(2) + '" stroke="' + (health > 0.6 ? C.ok : C.danger) + '" stroke-width="3"') + L.text(n[1], n[2] + 5, n[0], {size: 12, color: C.text, weight: 700}); });
      L.svg(m, "Food web losing a pollinator", 290);
      L.readout([["Bee", lost >= 1 ? "gone" : "declining", C.danger], ["Fruits and seeds", lost > 0.5 ? "far fewer" : "normal"], ["Monkeys, hornbills, seedlings", lost >= 1 ? "declining" : "…", C.danger]]);
      msg = t < 3 ? "Losing the pollinator…" : "Losing the bee cut fruit and seed production, so <b>the animals and new trees that depended on it declined</b>.";
    } else if(st.preset === "sangai"){
      var f = clamp12(t / 3, 0, 1);
      m += L.rect(60, 60, 600, 160, "#0e7490", ' rx="20" opacity="0.6"');
      for(i = 0; i < 6; i++){ var r = (46 - 18 * f) * (0.7 + (i % 3) * 0.2); m += '<ellipse cx="' + (140 + i * 95) + '" cy="' + (140 + (i % 2 ? 30 : -30)) + '" rx="' + r.toFixed(1) + '" ry="' + (r * 0.55).toFixed(1) + '" fill="#65a30d" opacity="0.9"/>'; }
      m += L.text(360, 45, "Loktak Lake phumdis (floating grasslands)", {size: 13, color: C.text});
      [["1951", "declared extinct"], ["1953", "rediscovered"], ["today", "IUCN Red List; phumdis degenerating"]].forEach(function(e, j){ if(t >= j * 0.9) m += L.text(120 + j * 240, 260, e[0] + ": " + e[1], {size: 12, color: j === 2 ? C.danger : C.path, weight: 700}); });
      L.svg(m, "Sangai and the phumdis", 280);
      L.readout([["Species", "Sangai, the dancing deer (endemic to Manipur)"], ["Home", "phumdis, Keibul Lamjao National Park"], ["Threat", "habitat loss as phumdis degenerate", C.danger]]);
      msg = t < 3 ? "Time passing…" : "Declared extinct in 1951 and rediscovered in 1953, the Sangai <b>depends on the phumdis</b> of Loktak Lake, which are now degenerating, so saving the habitat is key.";
    } else {
      var hitT = clamp12((t - 0.5) / 1.5, 0, 1);
      [[40, true, "with mangroves"], [380, false, "without mangroves"]].forEach(function(p){
        m += L.rect(p[0], 190, 300, 60, "#0e7490", ' opacity="0.6"') + L.rect(p[0], 150, 300, 40, "#a16207", ' opacity="0.5"');
        if(p[1]) for(i = 0; i < 8; i++) m += L.circle(p[0] + 20 + i * 38, 185, 14, "#15803d");
        for(i = 0; i < 4; i++) m += L.rect(p[0] + 40 + i * 65, 110, 40, 40, "#e2e8f0", ' opacity="' + (p[1] ? 1 : 1 - 0.7 * hitT).toFixed(2) + '"');
        for(i = 0; i < 3; i++) m += '<path d="M' + (p[0] + 300 - hitT * (p[1] ? 60 : 250) - i * 30) + ' ' + (215 + i * 10) + ' q15 -12 30 0" fill="none" stroke="#e0f2fe" stroke-width="3"/>';
        m += L.text(p[0] + 150, 280, p[2] + ": damage " + (p[1] ? "low" : "high"), {size: 13, color: p[1] ? C.ok : C.danger, weight: 700});
      });
      L.svg(m, "Mangroves as a shield", 300);
      L.readout([["1999 super cyclone, Odisha", "villages with more mangroves suffered less"], ["Other shields", "diverse forests lower disease risk; soils trap pollutants", C.ok]]);
      msg = t < 3 ? "Storm arriving…" : "Villages behind mangroves suffered <b>less destruction</b> in the 1999 super cyclone in Odisha: diverse forests act as natural shields.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["fossils", "Fossil layers"], ["foodweb", "Losing one species"], ["sangai", "The Sangai and phumdis"], ["shield", "Forests as shields"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.threats = {mount: mount, draw: draw, select: select, state: st};
})();
