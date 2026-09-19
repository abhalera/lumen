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

// -------------------------------------------------------------------------
// 1. Organisation Ladder (organisationlab)
// §7.1 (pp. 79-80): cells → tissues → organs → systems.
// -------------------------------------------------------------------------
window.SIMS.organisationlab = (function(){
  var orgView = "ladder"; // "ladder", "heart", "words"

  function setV(v){
    orgView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cells + Matrix</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>Four Tissues</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Organs → Systems</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ladder">Organisation Ladder</button>' +
      '<button class="preset-btn" id="p-heart">Heart: All Four</button>' +
      '<button class="preset-btn" id="p-words">Morphology vs Anatomy</button>';

    document.getElementById("p-ladder").onclick = function(){ setActivePreset(this); setV("ladder"); };
    document.getElementById("p-heart").onclick = function(){ setActivePreset(this); setV("heart"); };
    document.getElementById("p-words").onclick = function(){ setActivePreset(this); setV("words"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Tissue (§7.1):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Similar cells + intercellular substances, one function.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Payoff: <b style="color:#38bdf8;">division of labour</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Split work, survive as a whole.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="660" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Organisation (§7.1)</text>';

    if(orgView === "ladder"){
      var steps = [
        ["Cells", "similar + matrix", "#38bdf8"],
        ["Tissues ×4", "epithelial · connective · muscular · neural", "#22c55e"],
        ["Organs", "stomach · lung · heart · kidney", "#f59e0b"],
        ["Organ systems", "digestive · respiratory · ...", "#f472b6"]
      ];
      for(var i = 0; i < steps.length; i++){
        var x = 50 + i * 160;
        m += '<rect x="' + x + '" y="90" width="140" height="130" rx="8" fill="#0f172a" stroke="' + steps[i][2] + '" stroke-width="2"/>';
        m += '<text x="' + (x + 70) + '" y="120" fill="' + steps[i][2] + '" font-size="13" font-weight="700" text-anchor="middle">' + steps[i][0] + '</text>';
        m += '<text x="' + (x + 70) + '" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">' + steps[i][1].split(' · ')[0] + '</text>';
        m += '<text x="' + (x + 70) + '" y="166" fill="#94a3b8" font-size="10" text-anchor="middle">' + (steps[i][1].split(' · ').slice(1).join(' · ') || '') + '</text>';
        if(i < 3) m += '<text x="' + (x + 150) + '" y="160" fill="#64748b" font-size="20" text-anchor="middle">→</text>';
      }
      m += '<text x="350" y="262" fill="#f8fafc" font-size="12" text-anchor="middle">division of labour → survival of the whole</text>';
    } else if(orgView === "heart"){
      m += '<ellipse cx="200" cy="170" rx="110" ry="85" fill="#7f1d1d" stroke="#dc2626" stroke-width="3"/>';
      m += '<text x="200" y="140" fill="#fecaca" font-size="14" font-weight="700" text-anchor="middle">HEART</text>';
      m += '<text x="200" y="162" fill="#fecaca" font-size="11" text-anchor="middle">one organ, four tissues</text>';
      m += '<text x="200" y="200" fill="#fca5a5" font-size="10" text-anchor="middle">epithelial · connective</text>';
      m += '<text x="200" y="216" fill="#fca5a5" font-size="10" text-anchor="middle">muscular · neural</text>';
      var ts = [["epithelial", "#38bdf8"], ["connective", "#22c55e"], ["muscular", "#f59e0b"], ["neural", "#f472b6"]];
      for(var j = 0; j < ts.length; j++){
        var ty = 80 + j * 52;
        m += '<rect x="380" y="' + ty + '" width="260" height="44" rx="6" fill="#0f172a" stroke="' + ts[j][1] + '" stroke-width="1.5"/>';
        m += '<text x="510" y="' + (ty + 28) + '" fill="' + ts[j][1] + '" font-size="13" font-weight="700" text-anchor="middle">' + ts[j][0] + '</text>';
      }
      m += '<text x="350" y="292" fill="#94a3b8" font-size="11" text-anchor="middle">only four basic types in all complex animals</text>';
    } else {
      m += '<rect x="50" y="80" width="280" height="160" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="190" y="112" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">MORPHOLOGY</text>';
      m += '<text x="190" y="140" fill="#cbd5e1" font-size="11" text-anchor="middle">form · externally visible features</text>';
      m += '<text x="190" y="160" fill="#cbd5e1" font-size="11" text-anchor="middle">animals: outside of organs/parts</text>';
      m += '<text x="190" y="196" fill="#64748b" font-size="11" text-anchor="middle">§7.2.1 Frog exterior</text>';
      m += '<rect x="370" y="80" width="280" height="160" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="510" y="112" fill="#f59e0b" font-size="15" font-weight="700" text-anchor="middle">ANATOMY</text>';
      m += '<text x="510" y="140" fill="#cbd5e1" font-size="11" text-anchor="middle">morphology of INTERNAL organs</text>';
      m += '<text x="510" y="160" fill="#cbd5e1" font-size="11" text-anchor="middle">in animals (conventional)</text>';
      m += '<text x="510" y="196" fill="#64748b" font-size="11" text-anchor="middle">§7.2.2 Frog insides</text>';
      m += '<text x="350" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">frog represents vertebrates for both</text>';
    }

    svg.innerHTML = m;

    var vName = orgView === "ladder" ? "LADDER" : (orgView === "heart" ? "HEART" : "WORDS");
    readout(
      cell("View", vName, "#38bdf8") +
      cell("Tissues", "4 basic types", "#22c55e") +
      cell("Example", "Heart holds all 4", "#f59e0b") +
      cell("Payoff", "Division of labour", "#f472b6")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">§7.1 Organisation:</span> ' +
      (orgView === "ladder" ? "Cells → tissues → organs → systems, splitting work for survival." :
       (orgView === "heart" ? "The heart holds all four tissue types: epithelial, connective, muscular and neural." :
        "Morphology reads the outside; anatomy reads the internal organs."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. Frog Exterior Bench (frogmorphlab)
// §7.2-§7.2.1 (pp. 80-81): frog morphology + sexual dimorphism (Fig. 7.1).
// -------------------------------------------------------------------------
window.SIMS.frogmorphlab = (function(){
  var frogView = "exterior"; // "exterior", "male", "female"

  function setF(v){
    frogView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#4ade80;"></span><span>Head + Trunk (no neck/tail)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Limbs: 4 fore / 5 hind</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Male Marks</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-exterior">Exterior (Fig. 7.1)</button>' +
      '<button class="preset-btn" id="p-male">Male Marks</button>' +
      '<button class="preset-btn" id="p-female">Female (Neither)</button>';

    document.getElementById("p-exterior").onclick = function(){ setActivePreset(this); setF("exterior"); };
    document.getElementById("p-male").onclick = function(){ setActivePreset(this); setF("male"); };
    document.getElementById("p-female").onclick = function(){ setActivePreset(this); setF("female"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Rana tigrina (§7.2):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Amphibia · Chordata · poikilotherm · mimicry.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Skin: <b style="color:#38bdf8;">moist, olive above, pale below</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Never drinks — absorbs through skin.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Frog Exterior</text>';

    // body: head + trunk
    m += '<ellipse cx="150" cy="170" rx="70" ry="55" fill="#14532d" stroke="#4ade80" stroke-width="2"/>';
    m += '<text x="150" y="174" fill="#bbf7d0" font-size="12" font-weight="700" text-anchor="middle">HEAD</text>';
    m += '<ellipse cx="300" cy="170" rx="100" ry="70" fill="#14532d" stroke="#4ade80" stroke-width="2"/>';
    m += '<text x="300" y="174" fill="#bbf7d0" font-size="12" font-weight="700" text-anchor="middle">TRUNK</text>';
    m += '<text x="225" y="130" fill="#ef4444" font-size="10" text-anchor="middle">no neck · no tail</text>';
    // spots dorsal
    m += '<circle cx="270" cy="140" r="6" fill="#052e16"/><circle cx="320" cy="130" r="5" fill="#052e16"/><circle cx="350" cy="155" r="6" fill="#052e16"/>';
    // eye + tympanum + nostril
    m += '<circle cx="120" cy="135" r="16" fill="#fef08a" stroke="#a16207" stroke-width="2"/>';
    m += '<circle cx="120" cy="135" r="6" fill="#0f172a"/>';
    m += '<text x="120" y="108" fill="#fef08a" font-size="9" text-anchor="middle">bulged eye + nictitating</text>';
    m += '<circle cx="175" cy="150" r="11" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    m += '<text x="175" y="175" fill="#38bdf8" font-size="9" text-anchor="middle">tympanum</text>';
    m += '<circle cx="95" cy="160" r="3" fill="#0f172a"/>';
    m += '<text x="80" y="185" fill="#94a3b8" font-size="9" text-anchor="middle">nostril</text>';
    // limbs
    m += '<line x1="230" y1="220" x2="200" y2="265" stroke="#4ade80" stroke-width="8" stroke-linecap="round"/>';
    for(var f = 0; f < 4; f++){
      m += '<line x1="200" y1="265" x2="' + (180 + f * 13) + '" y2="282" stroke="#4ade80" stroke-width="3" stroke-linecap="round"/>';
    }
    m += '<text x="150" y="292" fill="#38bdf8" font-size="10" text-anchor="middle">fore: 4 digits</text>';
    m += '<line x1="340" y1="220" x2="370" y2="255" stroke="#4ade80" stroke-width="12" stroke-linecap="round"/>';
    for(var hd = 0; hd < 5; hd++){
      m += '<line x1="370" y1="255" x2="' + (348 + hd * 12) + '" y2="280" stroke="#4ade80" stroke-width="3" stroke-linecap="round"/>';
    }
    m += '<path d="M344,272 L392,272 L384,282 L352,282 Z" fill="#38bdf8" opacity="0.5"/>';
    m += '<text x="330" y="292" fill="#38bdf8" font-size="10" text-anchor="middle">hind: 5, webbed, muscular</text>';

    if(frogView === "male"){
      m += '<circle cx="150" cy="225" r="20" fill="#f59e0b" opacity="0.85"/>';
      m += '<text x="150" y="229" fill="#451a03" font-size="9" font-weight="700" text-anchor="middle">vocal sac</text>';
      m += '<rect x="192" y="258" width="18" height="10" rx="4" fill="#f59e0b"/>';
      m += '<text x="230" y="250" fill="#f59e0b" font-size="9" text-anchor="middle">copulatory pad</text>';
    } else if(frogView === "female"){
      m += '<text x="150" y="229" fill="#64748b" font-size="10" text-anchor="middle">no sacs · no pad</text>';
    }
    m += '<text x="220" y="66" fill="#94a3b8" font-size="10" text-anchor="middle">Rana tigrina · Amphibia · Chordata</text>';

    // RIGHT: dimorphism key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Male / Female</text>';
    var rows = [
      ["exterior", "EXTERIOR", "head + trunk plan", "#4ade80"],
      ["male", "MALE", "vocal sacs + pad", "#f59e0b"],
      ["female", "FEMALE", "neither mark", "#38bdf8"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      var on = (frogView === rows[r][0]);
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="' + (on ? "#1e293b" : "#0f172a") + '" stroke="' + rows[r][3] + '" stroke-width="' + (on ? 3 : 1.5) + '"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][3] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][1] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][2] + '</text>';
    }

    svg.innerHTML = m;

    var sName = frogView === "exterior" ? "EXTERIOR" : (frogView === "male" ? "MALE" : "FEMALE");
    var marks = frogView === "male" ? "Vocal sacs + pad" : (frogView === "female" ? "Neither" : "See male/female");
    readout(
      cell("View", sName, "#4ade80") +
      cell("Body", "Head + trunk", "#38bdf8") +
      cell("Digits", "4 fore / 5 hind", "#38bdf8") +
      cell("Sex Marks", marks, "#f59e0b")
    );

    verdict(
      '<span style="color:#4ade80;font-weight:700;">§7.2 Frog:</span> ' +
      (frogView === "male" ? "Males carry vocal sacs and a first-digit copulatory pad." :
       (frogView === "female" ? "Females show neither vocal sacs nor pad." :
        "Head + trunk, no neck/tail; webbed leaping limbs; moist spotted skin."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. Canal Path Tracer (digestivelab)
// §7.2.2 digestive (pp. 81-82): frog alimentary path + glands (Fig. 7.2).
// -------------------------------------------------------------------------
window.SIMS.digestivelab = (function(){
  var digView = "path"; // "path", "duodenum", "absorb"

  function setD(v){
    digView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f9a8d4;"></span><span>Alimentary Canal</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a3e635;"></span><span>Liver + Gall Bladder</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Pancreas + Duct</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-path">Canal Path</button>' +
      '<button class="preset-btn" id="p-duodenum">Duodenum Dosing</button>' +
      '<button class="preset-btn" id="p-absorb">Absorption</button>';

    document.getElementById("p-path").onclick = function(){ setActivePreset(this); setD("path"); };
    document.getElementById("p-duodenum").onclick = function(){ setActivePreset(this); setD("duodenum"); };
    document.getElementById("p-absorb").onclick = function(){ setActivePreset(this); setD("absorb"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Carnivore logic (§7.2.2):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Short canal — intestine reduced.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Tongue: <b style="color:#38bdf8;">bilobed catcher</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">HCl + gastric juices make chyme.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Digestion (§7.2.2)</text>';

    if(digView === "path"){
      var stops = ["mouth", "buccal", "pharynx", "oesophagus", "stomach", "intestine", "rectum", "cloaca"];
      var sx = [70, 115, 160, 210, 265, 315, 360, 400];
      for(var i = 0; i < stops.length; i++){
        var big = (stops[i] === "stomach" || stops[i] === "cloaca");
        m += '<circle cx="' + sx[i] + '" cy="160" r="' + (big ? 24 : 17) + '" fill="#0f172a" stroke="#f9a8d4" stroke-width="2"/>';
        m += '<text x="' + sx[i] + '" y="164" fill="#f9a8d4" font-size="8" text-anchor="middle">' + stops[i] + '</text>';
        if(i < stops.length - 1) m += '<line x1="' + (sx[i] + 20) + '" y1="160" x2="' + (sx[i + 1] - 20) + '" y2="160" stroke="#64748b" stroke-width="2"/>';
      }
      m += '<text x="235" y="230" fill="#94a3b8" font-size="11" text-anchor="middle">short tube, reduced intestine: carnivore</text>';
      m += '<text x="235" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">bilobed tongue captures → chyme → dosed → absorbed → ejected</text>';
    } else if(digView === "duodenum"){
      m += '<rect x="80" y="110" width="120" height="120" rx="10" fill="#0f172a" stroke="#a3e635" stroke-width="2"/>';
      m += '<text x="140" y="135" fill="#a3e635" font-size="12" font-weight="700" text-anchor="middle">LIVER</text>';
      m += '<text x="140" y="155" fill="#94a3b8" font-size="10" text-anchor="middle">bile → gall bladder</text>';
      m += '<text x="140" y="195" fill="#cbd5e1" font-size="11" text-anchor="middle">emulsifies FAT</text>';
      m += '<rect x="280" y="110" width="120" height="120" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="340" y="135" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">PANCREAS</text>';
      m += '<text x="340" y="155" fill="#94a3b8" font-size="10" text-anchor="middle">pancreatic juice</text>';
      m += '<text x="340" y="195" fill="#cbd5e1" font-size="11" text-anchor="middle">carbs + PROTEINS</text>';
      m += '<line x1="200" y1="170" x2="240" y2="170" stroke="#64748b" stroke-width="3"/>';
      m += '<line x1="280" y1="170" x2="240" y2="170" stroke="#64748b" stroke-width="3"/>';
      m += '<line x1="240" y1="170" x2="240" y2="230" stroke="#f472b6" stroke-width="4"/>';
      m += '<text x="240" y="252" fill="#f472b6" font-size="11" font-weight="700" text-anchor="middle">common bile duct → duodenum</text>';
      m += '<text x="240" y="100" fill="#94a3b8" font-size="10" text-anchor="middle">chyme arrives from stomach</text>';
    } else {
      m += '<rect x="60" y="80" width="360" height="170" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>';
      m += '<line x1="70" y1="230" x2="410" y2="230" stroke="#f9a8d4" stroke-width="3"/>';
      for(var v = 0; v < 9; v++){
        var vx = 90 + v * 36;
        m += '<ellipse cx="' + vx + '" cy="195" rx="10" ry="34" fill="#f9a8d4" opacity="0.35" stroke="#f9a8d4" stroke-width="1.5"/>';
        for(var mv = 0; mv < 4; mv++){
          m += '<line x1="' + (vx - 10) + '" y1="' + (175 + mv * 14) + '" x2="' + (vx - 16) + '" y2="' + (175 + mv * 14) + '" stroke="#f9a8d4" stroke-width="1"/>';
          m += '<line x1="' + (vx + 10) + '" y1="' + (175 + mv * 14) + '" x2="' + (vx + 16) + '" y2="' + (175 + mv * 14) + '" stroke="#f9a8d4" stroke-width="1"/>';
        }
      }
      m += '<text x="240" y="110" fill="#f9a8d4" font-size="12" font-weight="700" text-anchor="middle">villi + microvilli absorb</text>';
      m += '<text x="240" y="270" fill="#94a3b8" font-size="11" text-anchor="middle">finger-like folds → waste to rectum → cloaca</text>';
    }

    // RIGHT: juices key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Juices</text>';
    var rows = [
      ["HCl + gastric", "stomach walls → chyme", "#f9a8d4"],
      ["Bile", "liver → fat emulsified", "#a3e635"],
      ["Pancreatic juice", "pancreas → carbs + proteins", "#f59e0b"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = digView === "path" ? "CANAL PATH" : (digView === "duodenum" ? "DUODENUM" : "ABSORPTION");
    readout(
      cell("View", vName, "#f9a8d4") +
      cell("Canal", "Short (carnivore)", "#38bdf8") +
      cell("Glands", "Liver + pancreas", "#a3e635") +
      cell("Exit", "Rectum → cloaca", "#f59e0b")
    );

    verdict(
      '<span style="color:#f9a8d4;font-weight:700;">§7.2.2 Digestion:</span> ' +
      (digView === "path" ? "Mouth to cloaca in eight stops; short carnivore canal." :
       (digView === "duodenum" ? "Common bile duct doses chyme with bile (fat) + pancreatic juice (carbs, proteins)." :
        "Villi and microvilli absorb; residue exits via rectum and cloaca."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. Heart and Lungs Bench (heartlunglab)
// §7.2.2 respiratory+vascular (p. 82): breathing switch + 3-chamber heart.
// -------------------------------------------------------------------------
window.SIMS.heartlunglab = (function(){
  var hlView = "water"; // "water", "land", "heart"

  function setH(v){
    hlView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Skin / Cutaneous</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f9a8d4;"></span><span>Lungs / Pulmonary</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#dc2626;"></span><span>Heart: 2 Atria + 1 Ventricle</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-water">In Water (Skin)</button>' +
      '<button class="preset-btn" id="p-land">On Land (Lungs+)</button>' +
      '<button class="preset-btn" id="p-heart">Heart + Portals</button>';

    document.getElementById("p-water").onclick = function(){ setActivePreset(this); setH("water"); };
    document.getElementById("p-land").onclick = function(){ setActivePreset(this); setH("land"); };
    document.getElementById("p-heart").onclick = function(){ setActivePreset(this); setH("heart"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Breathing rule (§7.2.2):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Water: skin · land: buccal + skin + lungs · sleep: skin.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Circulation: <b style="color:#38bdf8;">closed, single</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Hepatic + renal portal detours.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Breathing + Blood (§7.2.2)</text>';

    if(hlView === "heart"){
      m += '<rect x="60" y="70" width="150" height="90" rx="10" fill="#0f172a" stroke="#dc2626" stroke-width="2"/>';
      m += '<text x="135" y="100" fill="#fca5a5" font-size="12" font-weight="700" text-anchor="middle">Right atrium</text>';
      m += '<text x="135" y="120" fill="#94a3b8" font-size="10" text-anchor="middle">← sinus venosus</text>';
      m += '<text x="135" y="136" fill="#94a3b8" font-size="10" text-anchor="middle">← vena cava</text>';
      m += '<rect x="250" y="70" width="150" height="90" rx="10" fill="#0f172a" stroke="#dc2626" stroke-width="2"/>';
      m += '<text x="325" y="100" fill="#fca5a5" font-size="12" font-weight="700" text-anchor="middle">Left atrium</text>';
      m += '<rect x="140" y="175" width="180" height="70" rx="10" fill="#7f1d1d" stroke="#dc2626" stroke-width="2.5"/>';
      m += '<text x="230" y="205" fill="#fecaca" font-size="13" font-weight="700" text-anchor="middle">VENTRICLE (1)</text>';
      m += '<text x="230" y="225" fill="#fca5a5" font-size="10" text-anchor="middle">→ conus arteriosus (ventral)</text>';
      m += '<text x="230" y="262" fill="#f59e0b" font-size="11" text-anchor="middle">hepatic portal · renal portal · pericardium</text>';
      m += '<text x="230" y="282" fill="#94a3b8" font-size="10" text-anchor="middle">nucleated RBCs + haemoglobin · lymph lacks RBCs</text>';
    } else {
      var inWater = (hlView === "water");
      if(inWater){
        m += '<rect x="60" y="70" width="340" height="180" rx="10" fill="#0c4a6e" opacity="0.5" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="230" y="100" fill="#bae6fd" font-size="12" font-weight="700" text-anchor="middle">WATER</text>';
        m += '<ellipse cx="230" cy="170" rx="120" ry="45" fill="#14532d" stroke="#22c55e" stroke-width="3"/>';
        m += '<text x="230" y="175" fill="#bbf7d0" font-size="11" text-anchor="middle">skin: dissolved O2 by diffusion</text>';
        for(var b = 0; b < 6; b++){
          m += '<circle cx="' + (130 + b * 40) + '" cy="' + (120 + (b % 2) * 12) + '" r="3" fill="#bae6fd" opacity="0.7"/>';
        }
        m += '<text x="230" y="270" fill="#38bdf8" font-size="12" text-anchor="middle">cutaneous respiration — skin only</text>';
      } else {
        m += '<rect x="60" y="70" width="340" height="180" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>';
        m += '<text x="230" y="95" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">LAND</text>';
        m += '<rect x="80" y="115" width="95" height="60" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
        m += '<text x="127" y="140" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">buccal</text>';
        m += '<text x="127" y="158" fill="#94a3b8" font-size="10" text-anchor="middle">cavity</text>';
        m += '<rect x="185" y="115" width="95" height="60" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
        m += '<text x="232" y="140" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">skin</text>';
        m += '<rect x="290" y="115" width="95" height="60" rx="8" fill="#0b1726" stroke="#f9a8d4" stroke-width="2"/>';
        m += '<text x="337" y="140" fill="#f9a8d4" font-size="11" font-weight="700" text-anchor="middle">lungs</text>';
        m += '<text x="337" y="158" fill="#94a3b8" font-size="10" text-anchor="middle">pulmonary</text>';
        m += '<text x="230" y="210" fill="#cbd5e1" font-size="11" text-anchor="middle">nostrils → buccal cavity → lungs</text>';
        m += '<text x="230" y="232" fill="#94a3b8" font-size="10" text-anchor="middle">paired pink sacs in thorax</text>';
        m += '<text x="230" y="270" fill="#38bdf8" font-size="11" text-anchor="middle">aestivation + hibernation: skin only</text>';
      }
    }

    // RIGHT: blood key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Blood Key</text>';
    var rows = [
      ["PLASMA + CELLS", "RBC · WBC · platelets", "#dc2626"],
      ["RBC's", "nucleated + haemoglobin", "#f59e0b"],
      ["LYMPH", "lacks proteins + RBCs", "#38bdf8"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = hlView === "water" ? "WATER" : (hlView === "land" ? "LAND" : "HEART");
    var breath = hlView === "water" ? "Skin (cutaneous)" : (hlView === "land" ? "Buccal+skin+lungs" : "—");
    readout(
      cell("Scene", vName, "#38bdf8") +
      cell("Breathing", breath, "#f9a8d4") +
      cell("Heart", "2 atria + 1 ventricle", "#dc2626") +
      cell("Portals", "Hepatic + renal", "#f59e0b")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">§7.2.2 Breath + Blood:</span> ' +
      (hlView === "water" ? "Skin exchanges dissolved oxygen by diffusion (cutaneous)." :
       (hlView === "land" ? "Buccal cavity, skin and lungs serve; lungs are pulmonary." :
        "Three chambers route single circulation; sinus in, conus out; two portal detours."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. Kidney and Ureter Bench (kidneylab)
// §7.2.2 excretory (pp. 82-83): kidneys, ureter fates, bladder (Figs. 7.3-7.4).
// -------------------------------------------------------------------------
window.SIMS.kidneylab = (function(){
  var exView = "male"; // "male", "female", "filter"

  function setE(v){
    exView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#b91c1c;"></span><span>Kidneys (nephrons)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Ureters</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fef08a;"></span><span>Bladder + Cloaca</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-male">Male (Urinogenital)</button>' +
      '<button class="preset-btn" id="p-female">Female (Separate)</button>' +
      '<button class="preset-btn" id="p-filter">Filter (Urea)</button>';

    document.getElementById("p-male").onclick = function(){ setActivePreset(this); setE("male"); };
    document.getElementById("p-female").onclick = function(){ setActivePreset(this); setE("female"); };
    document.getElementById("p-filter").onclick = function(){ setActivePreset(this); setE("filter"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Excretory kit (§7.2.2):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Kidneys + ureters + cloaca + bladder.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Chemistry: <b style="color:#38bdf8;">ureotelic (urea)</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Blood → kidney → separated → excreted.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Excretion (§7.2.2)</text>';

    if(exView === "filter"){
      var steps = ["blood in", "kidney", "nephrons", "urea out"];
      for(var i = 0; i < steps.length; i++){
        var x = 60 + i * 95;
        m += '<rect x="' + x + '" y="130" width="80" height="60" rx="8" fill="#0f172a" stroke="#b91c1c" stroke-width="2"/>';
        m += '<text x="' + (x + 40) + '" y="165" fill="#fca5a5" font-size="11" font-weight="700" text-anchor="middle">' + steps[i] + '</text>';
        if(i < 3) m += '<text x="' + (x + 88) + '" y="165" fill="#64748b" font-size="18" text-anchor="middle">→</text>';
      }
      m += '<text x="230" y="110" fill="#f8fafc" font-size="11" text-anchor="middle">compact dark-red bean-like pair, flanking vertebral column</text>';
      m += '<text x="230" y="230" fill="#f59e0b" font-size="12" text-anchor="middle">ureotelic: urea excreted</text>';
      m += '<text x="230" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">bladder ventral to rectum · cloaca exit shared</text>';
    } else {
      var isMale = (exView === "male");
      m += '<ellipse cx="170" cy="130" rx="34" ry="55" fill="#7f1d1d" stroke="#b91c1c" stroke-width="2"/>';
      m += '<ellipse cx="300" cy="130" rx="34" ry="55" fill="#7f1d1d" stroke="#b91c1c" stroke-width="2"/>';
      m += '<text x="235" y="90" fill="#fca5a5" font-size="11" text-anchor="middle">kidneys (nephrons)</text>';
      m += '<line x1="170" y1="185" x2="200" y2="240" stroke="#f472b6" stroke-width="4"/>';
      m += '<line x1="300" y1="185" x2="270" y2="240" stroke="#f472b6" stroke-width="4"/>';
      m += '<text x="130" y="215" fill="#f472b6" font-size="10" text-anchor="middle">ureters (2)</text>';
      if(isMale){
        m += '<rect x="195" y="240" width="80" height="30" rx="8" fill="#f472b6" opacity="0.3" stroke="#f472b6" stroke-width="2"/>';
        m += '<text x="235" y="260" fill="#f472b6" font-size="10" font-weight="700" text-anchor="middle">urinogenital</text>';
        m += '<text x="235" y="110" fill="#64748b" font-size="9" text-anchor="middle">+ sperms via Bidder\'s canal</text>';
      } else {
        m += '<line x1="140" y1="185" x2="170" y2="240" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6 4"/>';
        m += '<line x1="330" y1="185" x2="300" y2="240" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6 4"/>';
        m += '<text x="120" y="250" fill="#38bdf8" font-size="10" text-anchor="middle">oviducts</text>';
        m += '<text x="235" y="110" fill="#64748b" font-size="9" text-anchor="middle">open seperately (as printed)</text>';
      }
      m += '<rect x="200" y="270" width="70" height="18" rx="6" fill="#fef08a" opacity="0.4" stroke="#a16207" stroke-width="1.5"/>';
      m += '<text x="235" y="283" fill="#fef08a" font-size="9" text-anchor="middle">cloaca</text>';
    }

    // RIGHT: fate key
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Ureter Fates</text>';
    var rows = [
      ["male", "MALE", "urinogenital duct", "#f472b6"],
      ["female", "FEMALE", "urine alone", "#38bdf8"],
      ["filter", "FILTER", "blood → urea", "#b91c1c"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      var on = (exView === rows[r][0]);
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="' + (on ? "#1e293b" : "#0f172a") + '" stroke="' + rows[r][3] + '" stroke-width="' + (on ? 3 : 1.5) + '"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][3] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][1] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][2] + '</text>';
    }

    svg.innerHTML = m;

    var vName = exView === "male" ? "MALE" : (exView === "female" ? "FEMALE" : "FILTER");
    var cargo = exView === "male" ? "Urine + sperms" : (exView === "female" ? "Urine alone" : "Urea");
    readout(
      cell("View", vName, "#f472b6") +
      cell("Kidneys", "Bean-like pair", "#b91c1c") +
      cell("Ureter Cargo", cargo, "#38bdf8") +
      cell("Exit", "Cloaca (+ bladder)", "#fef08a")
    );

    verdict(
      '<span style="color:#f472b6;font-weight:700;">§7.2.2 Excretion:</span> ' +
      (exView === "male" ? "Two ureters act as the urinogenital duct into the cloaca." :
       (exView === "female" ? "Ureters and oviduct open seperately in the cloaca." :
        "Blood-borne wastes separated by nephrons; urea excreted (ureotelic)."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. Brain and Senses Board (brainlab)
// §7.2.2 neural (p. 83): brain divisions, nerves, five senses.
// -------------------------------------------------------------------------
window.SIMS.brainlab = (function(){
  var brView = "brain"; // "brain", "nerves", "senses"

  function setB(v){
    brView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#a78bfa;"></span><span>Fore / Mid / Hind Brain</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cranial Nerves ×10 pairs</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Eyes + Ears (built)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-brain">Brain Divisions</button>' +
      '<button class="preset-btn" id="p-nerves">Nerves + Glands</button>' +
      '<button class="preset-btn" id="p-senses">Five Senses</button>';

    document.getElementById("p-brain").onclick = function(){ setActivePreset(this); setB("brain"); };
    document.getElementById("p-nerves").onclick = function(){ setActivePreset(this); setB("nerves"); };
    document.getElementById("p-senses").onclick = function(){ setActivePreset(this); setB("senses"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Brain box (§7.2.2):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cranium in, foramen magnum out to cord.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Senses: <b style="color:#38bdf8;">2 built, 3 aggregated</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Eyes + internal ears lead.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Control (§7.2.2)</text>';

    if(brView === "brain"){
      var parts = [
        ["FORE-BRAIN", "olfactory lobes · cerebral pair · diencephalon", "#a78bfa"],
        ["MID-BRAIN", "pair of optic lobes", "#38bdf8"],
        ["HIND-BRAIN", "cerebellum + medulla oblongata", "#f59e0b"]
      ];
      for(var i = 0; i < parts.length; i++){
        var by = 66 + i * 68;
        m += '<rect x="60" y="' + by + '" width="320" height="58" rx="8" fill="#0f172a" stroke="' + parts[i][2] + '" stroke-width="2"/>';
        m += '<text x="220" y="' + (by + 24) + '" fill="' + parts[i][2] + '" font-size="13" font-weight="700" text-anchor="middle">' + parts[i][0] + '</text>';
        m += '<text x="220" y="' + (by + 44) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + parts[i][1] + '</text>';
      }
      m += '<text x="220" y="282" fill="#94a3b8" font-size="10" text-anchor="middle">cranium → foramen magnum → spinal cord in column</text>';
    } else if(brView === "nerves"){
      m += '<rect x="60" y="66" width="320" height="70" rx="8" fill="#0f172a" stroke="#a78bfa" stroke-width="2"/>';
      m += '<text x="220" y="92" fill="#a78bfa" font-size="12" font-weight="700" text-anchor="middle">CENTRAL: brain + spinal cord</text>';
      m += '<text x="220" y="112" fill="#94a3b8" font-size="10" text-anchor="middle">10 cranial nerve pairs arise here</text>';
      m += '<rect x="60" y="146" width="155" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="137" y="170" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">PERIPHERAL</text>';
      m += '<text x="137" y="188" fill="#94a3b8" font-size="10" text-anchor="middle">cranial + spinal</text>';
      m += '<rect x="225" y="146" width="155" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="302" y="170" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">AUTONOMIC</text>';
      m += '<text x="302" y="188" fill="#94a3b8" font-size="10" text-anchor="middle">sympathetic + para</text>';
      m += '<text x="220" y="232" fill="#f59e0b" font-size="11" text-anchor="middle">8 endocrine glands → hormones</text>';
      m += '<text x="220" y="250" fill="#94a3b8" font-size="9" text-anchor="middle">pituitary · thyroid · parathyroid · thymus</text>';
      m += '<text x="220" y="264" fill="#94a3b8" font-size="9" text-anchor="middle">pineal body · islets · adrenals · gonads</text>';
    } else {
      var senses = [
        ["Touch", "sensory papillae", false],
        ["Taste", "taste buds", false],
        ["Smell", "nasal epithelium", false],
        ["Vision", "eyes (simple, one unit)", true],
        ["Hearing", "tympanum + internal ears", true]
      ];
      for(var s = 0; s < senses.length; s++){
        var sy = 62 + s * 44;
        m += '<rect x="60" y="' + sy + '" width="320" height="38" rx="6" fill="#0f172a" stroke="' + (senses[s][2] ? "#f59e0b" : "#334155") + '" stroke-width="' + (senses[s][2] ? 2 : 1.5) + '"/>';
        m += '<text x="75" y="' + (sy + 24) + '" fill="#f8fafc" font-size="11" font-weight="700">' + senses[s][0] + '</text>';
        m += '<text x="365" y="' + (sy + 24) + '" fill="#94a3b8" font-size="10" text-anchor="end">' + senses[s][1] + '</text>';
      }
      m += '<text x="220" y="292" fill="#94a3b8" font-size="10" text-anchor="middle">gold = well-organised · grey = cellular aggregations</text>';
    }

    // RIGHT: counts
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Counts</text>';
    var rows = [
      ["GLANDS", "8 endocrine", "#f59e0b"],
      ["CRANIAL", "10 pairs", "#38bdf8"],
      ["SENSES", "5 (2 built)", "#a78bfa"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = brView === "brain" ? "BRAIN" : (brView === "nerves" ? "NERVES" : "SENSES");
    readout(
      cell("View", vName, "#a78bfa") +
      cell("Brain", "Fore / mid / hind", "#a78bfa") +
      cell("Nerves", "10 cranial pairs", "#38bdf8") +
      cell("Senses", "5, eyes+ears built", "#f59e0b")
    );

    verdict(
      '<span style="color:#a78bfa;font-weight:700;">§7.2.2 Control:</span> ' +
      (brView === "brain" ? "Fore (olfactory + cerebral + diencephalon), mid (optic pair), hind (cerebellum + medulla)." :
       (brView === "nerves" ? "Central, peripheral, autonomic — plus eight hormone glands." :
        "Touch, taste, smell, vision, hearing — only eyes and internal ears well-organised."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. Reproductive Systems Board (reprolab)
// §7.2.2 reproductive (pp. 83-84): male/female tracts + cycle (Figs. 7.3-7.4).
// -------------------------------------------------------------------------
window.SIMS.reprolab = (function(){
  var repView = "rmale"; // "rmale", "rfemale", "cycle"

  function setR(v){
    repView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#facc15;"></span><span>Testes (mesorchium)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span><span>Ovaries (2500–3000 ova)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Water: external fertilisation</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-rmale">Male Tract</button>' +
      '<button class="preset-btn" id="p-rfemale">Female Tract</button>' +
      '<button class="preset-btn" id="p-cycle">Cycle + Benefits</button>';

    document.getElementById("p-rmale").onclick = function(){ setActivePreset(this); setR("rmale"); };
    document.getElementById("p-rfemale").onclick = function(){ setActivePreset(this); setR("rfemale"); };
    document.getElementById("p-cycle").onclick = function(){ setActivePreset(this); setR("cycle"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Male count (§7.2.2):</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Vasa efferentia 10–12 per side.</div>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Female count: <b style="color:#38bdf8;">2500–3000 ova</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">At a time, into water.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    m += '<rect x="20" y="20" width="400" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Reproduction (§7.2.2)</text>';

    if(repView === "rmale"){
      var stops = ["testes", "vasa ×10-12", "kidneys", "Bidder's", "duct", "cloaca"];
      for(var i = 0; i < stops.length; i++){
        var x = 48 + i * 62;
        m += '<rect x="' + x + '" y="140" width="56" height="52" rx="8" fill="#0f172a" stroke="#facc15" stroke-width="1.5"/>';
        m += '<text x="' + (x + 28) + '" y="162" fill="#facc15" font-size="8.5" font-weight="700" text-anchor="middle">' + stops[i] + '</text>';
        m += '<text x="' + (x + 28) + '" y="178" fill="#64748b" font-size="8" text-anchor="middle">' + (i + 1) + '/6</text>';
        if(i < 5) m += '<text x="' + (x + 59) + '" y="168" fill="#64748b" font-size="14" text-anchor="middle">→</text>';
      }
      m += '<text x="220" y="110" fill="#f8fafc" font-size="11" text-anchor="middle">yellowish ovoid pair on kidneys (mesorchium)</text>';
      m += '<text x="220" y="230" fill="#94a3b8" font-size="11" text-anchor="middle">cloaca passes faecal matter + urine + sperms</text>';
      m += '<text x="220" y="262" fill="#64748b" font-size="10" text-anchor="middle">Fig. 7.3 Male reproductive system</text>';
    } else if(repView === "rfemale"){
      m += '<ellipse cx="150" cy="150" rx="60" ry="45" fill="#0f172a" stroke="#f472b6" stroke-width="2"/>';
      m += '<text x="150" y="146" fill="#f472b6" font-size="12" font-weight="700" text-anchor="middle">ovaries (pair)</text>';
      m += '<text x="150" y="164" fill="#94a3b8" font-size="10" text-anchor="middle">no kidney link</text>';
      m += '<line x1="210" y1="150" x2="270" y2="150" stroke="#f472b6" stroke-width="3"/>';
      m += '<text x="240" y="140" fill="#94a3b8" font-size="9" text-anchor="middle">oviducts</text>';
      m += '<rect x="270" y="125" width="110" height="50" rx="8" fill="#0f172a" stroke="#f472b6" stroke-width="2"/>';
      m += '<text x="325" y="146" fill="#f472b6" font-size="11" font-weight="700" text-anchor="middle">cloaca</text>';
      m += '<text x="325" y="162" fill="#94a3b8" font-size="9" text-anchor="middle">separate openings</text>';
      m += '<text x="220" y="230" fill="#f472b6" font-size="13" font-weight="700" text-anchor="middle">2500 to 3000 ova at a time</text>';
      m += '<text x="220" y="262" fill="#64748b" font-size="10" text-anchor="middle">Fig. 7.4 Female reproductive system</text>';
    } else {
      m += '<rect x="60" y="80" width="100" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="110" y="105" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">ova + sperm</text>';
      m += '<text x="110" y="122" fill="#94a3b8" font-size="10" text-anchor="middle">in water</text>';
      m += '<text x="172" y="115" fill="#64748b" font-size="16" text-anchor="middle">→</text>';
      m += '<rect x="184" y="80" width="100" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="234" y="105" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">tadpole</text>';
      m += '<text x="234" y="122" fill="#94a3b8" font-size="10" text-anchor="middle">larva</text>';
      m += '<text x="296" y="115" fill="#64748b" font-size="16" text-anchor="middle">→</text>';
      m += '<rect x="308" y="80" width="100" height="60" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="358" y="105" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle">adult frog</text>';
      m += '<text x="358" y="122" fill="#94a3b8" font-size="10" text-anchor="middle">metamorphosis</text>';
      m += '<text x="234" y="175" fill="#f8fafc" font-size="11" text-anchor="middle">external fertilisation + development</text>';
      m += '<text x="234" y="205" fill="#4ade80" font-size="11" text-anchor="middle">eats insects → protects crops → food webs</text>';
      m += '<text x="234" y="225" fill="#94a3b8" font-size="10" text-anchor="middle">ecological balance · legs eaten in some countries</text>';
      m += '<text x="234" y="262" fill="#64748b" font-size="10" text-anchor="middle">oesophagous + epithelia: see Summary (PDF p. 6)</text>';
    }

    // RIGHT: numbers
    m += '<rect x="440" y="20" width="240" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="460" y="48" fill="#f8fafc" font-size="14" font-weight="700">Numbers</text>';
    var rows = [
      ["VASA", "10–12 per side", "#facc15"],
      ["OVA", "2500–3000", "#f472b6"],
      ["CYCLE", "external → tadpole", "#38bdf8"]
    ];
    for(var r = 0; r < rows.length; r++){
      var ry = 70 + r * 70;
      m += '<rect x="460" y="' + ry + '" width="200" height="56" rx="6" fill="#0f172a" stroke="' + rows[r][2] + '" stroke-width="1.5"/>';
      m += '<text x="560" y="' + (ry + 24) + '" fill="' + rows[r][2] + '" font-size="12" font-weight="700" text-anchor="middle">' + rows[r][0] + '</text>';
      m += '<text x="560" y="' + (ry + 42) + '" fill="#94a3b8" font-size="10" text-anchor="middle">' + rows[r][1] + '</text>';
    }

    svg.innerHTML = m;

    var vName = repView === "rmale" ? "MALE" : (repView === "rfemale" ? "FEMALE" : "CYCLE");
    readout(
      cell("View", vName, "#facc15") +
      cell("Male Out", "Urinogenital duct", "#facc15") +
      cell("Female Out", "Oviducts (separate)", "#f472b6") +
      cell("Cycle", "External → tadpole", "#38bdf8")
    );

    verdict(
      '<span style="color:#facc15;font-weight:700;">§7.2.2 Reproduction:</span> ' +
      (repView === "rmale" ? "Testes → vasa (10–12) → kidneys → Bidder's canal → duct → cloaca." :
       (repView === "rfemale" ? "Ovaries (no kidney link) → oviducts → cloaca; 2500 to 3000 ova." :
        "External fertilisation in water; tadpole metamorphoses into the adult."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-106 —
// per-chapter only, no shared-script changes).
// -------------------------------------------------------------------------

// Stable browser-fixture identifiers for every visible lab scenario.
Object.keys(window.SIMS).forEach(function(key){
  var sim = window.SIMS[key];
  if(!sim || typeof sim.mount !== "function") return;
  var originalMount = sim.mount;
  sim.mount = function(lesson){
    originalMount.call(sim, lesson);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn, index){
      if(!btn.dataset.preset) btn.dataset.preset = btn.id || (key + "-" + index);
    });
  };
});

// Semantic prediction aliases expected by the shared browser QA.
document.addEventListener("click", function(event){
  if(!event.target.closest("#btn-check-prediction")) return;
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  var chosen = document.querySelector('input[name="predict_ans"]:checked');
  if(!lesson || !chosen) return;
  document.querySelectorAll("#predict-options .predict-option").forEach(function(option, index){
    option.classList.toggle("is-answer", index === lesson.prediction.answer);
    option.classList.toggle("is-wrong", index === Number(chosen.value) && index !== lesson.prediction.answer);
  });
});

// Keep this chapter's presentation aligned with its data.
function normalizeChapterPresentation(){
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  var watch = document.getElementById("what-to-watch");
  if(lesson && watch && lesson.watch){
    var text = "What to watch: " + lesson.watch;
    if(watch.textContent !== text) watch.textContent = text;
  }
  document.querySelectorAll(".connect-grid").forEach(function(grid){
    var cards = Array.from(grid.querySelectorAll(":scope > .connect-card"));
    var explicitWow = cards.find(function(card){ var h = card.querySelector("h3"); return h && /^Wow/i.test(h.textContent.trim()); });
    if(!explicitWow) return;
    cards.forEach(function(card){
      if(card === explicitWow) return;
      card.classList.remove("wow"); card.removeAttribute("data-wow"); card.removeAttribute("data-source");
      var badge = card.querySelector(":scope > .wow-badge"); if(badge) badge.remove();
    });
  });
}
var conceptView = document.getElementById("concept-view");
var revisionView = document.getElementById("revision-view");
if(conceptView) new MutationObserver(normalizeChapterPresentation).observe(conceptView, {childList:true, subtree:true});
if(revisionView) new MutationObserver(normalizeChapterPresentation).observe(revisionView, {childList:true, subtree:true});
normalizeChapterPresentation();
