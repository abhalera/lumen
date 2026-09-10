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
// 1. SIMULATION 1: Body Plan, Symmetry & Coelom Explorer (bodyplanexplorer)
// -------------------------------------------------------------------------
window.SIMS.bodyplanexplorer = (function(){
  var cType = "eucoelomate"; // acoelomate, pseudocoelomate, eucoelomate
  var symType = "bilateral"; // asymmetrical, radial, bilateral

  function setC(t){ cType = t; draw(0); }
  function setS(s){ symType = s; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ectoderm</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Mesoderm</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Endoderm</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Coelom Space</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-eu">Eucoelomate (Annelid/Chordate)</button>' +
      '<button class="preset-btn" id="p-pseudo">Pseudocoelomate (Aschelminthes)</button>' +
      '<button class="preset-btn" id="p-acoe">Acoelomate (Platyhelminthes)</button>';

    document.getElementById("p-eu").onclick = function(){ setActivePreset(this); setC("eucoelomate"); };
    document.getElementById("p-pseudo").onclick = function(){ setActivePreset(this); setC("pseudocoelomate"); };
    document.getElementById("p-acoe").onclick = function(){ setActivePreset(this); setC("acoelomate"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Select Symmetry Plane</label>' +
        '<select id="sym-sel" class="control-select" style="background:#1e293b;color:#f8fafc;padding:6px;border-radius:6px;border:1px solid #475569;width:100%;">' +
          '<option value="bilateral" selected>Bilateral (One longitudinal plane)</option>' +
          '<option value="radial">Radial (Any central longitudinal plane)</option>' +
          '<option value="asymmetrical">Asymmetrical (No symmetry plane)</option>' +
        '</select>' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Body Plan Focus</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Interactive germ-layer and coelomic peritoneal cavity cross-section.</div>' +
      '</div>';

    var sel = document.getElementById("sym-sel");
    if(sel){
      sel.onchange = function(){ setS(this.value); };
    }

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#bgGrad)" rx="10"/>';

    // Symmetry Diagram on Left (x: 20 to 220)
    m += '<rect x="25" y="25" width="210" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="130" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">Symmetry Type</text>';

    if(symType === "asymmetrical"){
      // Amorphous shape (sponge)
      m += '<path d="M 80,100 Q 120,70 170,110 Q 200,160 170,220 Q 120,250 80,210 Q 50,150 80,100 Z" fill="#334155" stroke="#94a3b8" stroke-width="2"/>';
      m += '<text x="130" y="165" fill="#f8fafc" font-size="12" font-weight="600" text-anchor="middle">Asymmetrical</text>';
      m += '<text x="130" y="185" fill="#94a3b8" font-size="10" text-anchor="middle">No plane divides into halves</text>';
      m += '<text x="130" y="270" fill="#e2e8f0" font-size="11" text-anchor="middle">e.g. Most Sponges (Porifera)</text>';
    } else if(symType === "radial"){
      // Circular radial organism with multiple plane dashed lines
      m += '<circle cx="130" cy="155" r="55" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>';
      m += '<line x1="130" y1="85" x2="130" y2="225" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="4,3"/>';
      m += '<line x1="60" y1="155" x2="200" y2="155" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="4,3"/>';
      m += '<line x1="80" y1="105" x2="180" y2="205" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="4,3"/>';
      m += '<line x1="80" y1="205" x2="180" y2="105" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="4,3"/>';
      m += '<circle cx="130" cy="155" r="14" fill="#a855f7"/>';
      m += '<text x="130" y="270" fill="#e2e8f0" font-size="11" text-anchor="middle">Coelenterata, Ctenophora, Adult Echinoderms</text>';
    } else {
      // Bilateral symmetry
      m += '<ellipse cx="130" cy="155" rx="55" ry="70" fill="#042f2e" stroke="#14b8a6" stroke-width="2"/>';
      m += '<line x1="130" y1="70" x2="130" y2="240" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="5,3"/>';
      m += '<circle cx="110" cy="110" r="4" fill="#38bdf8"/>';
      m += '<circle cx="150" cy="110" r="4" fill="#38bdf8"/>';
      m += '<text x="130" y="160" fill="#f8fafc" font-size="11" font-weight="600" text-anchor="middle">Median Sagittal Plane</text>';
      m += '<text x="80" y="210" fill="#2dd4bf" font-size="10">Left</text>';
      m += '<text x="160" y="210" fill="#2dd4bf" font-size="10">Right</text>';
      m += '<text x="130" y="270" fill="#e2e8f0" font-size="11" text-anchor="middle">Annelids, Arthropods, Chordates</text>';
    }

    // Coelom Cross-Section on Right (x: 250 to 675)
    var cx = 380, cy = 160;
    m += '<rect x="250" y="25" width="425" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="460" y="50" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">Germ Layer & Coelom Cross-Section: ' + cType.toUpperCase() + '</text>';

    // Outer ring: Ectoderm (blue)
    m += '<circle cx="' + cx + '" cy="' + cy + '" r="85" fill="none" stroke="#38bdf8" stroke-width="12"/>';

    if(cType === "acoelomate"){
      // Solid mesenchyme between ectoderm and endoderm
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="73" fill="#dc2626" opacity="0.35"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="35" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="18" fill="#020617"/>'; // gut lumen
      m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#94a3b8" font-size="10" text-anchor="middle">Gut</text>';

      // Callout box on right
      m += '<rect x="500" y="80" width="165" height="175" rx="6" fill="#1e293b" stroke="#dc2626" stroke-width="1.5"/>';
      m += '<text x="510" y="105" fill="#ef4444" font-size="12" font-weight="700">Acoelomate Architecture</text>';
      m += '<text x="510" y="125" fill="#cbd5e1" font-size="10">• Body cavity absent.</text>';
      m += '<text x="510" y="145" fill="#cbd5e1" font-size="10">• Space filled by solid mesodermal</text>';
      m += '<text x="510" y="160" fill="#cbd5e1" font-size="10">  parenchyma / mesenchyme.</text>';
      m += '<text x="510" y="180" fill="#cbd5e1" font-size="10">• Visceral movement restrained.</text>';
      m += '<text x="510" y="205" fill="#fcd34d" font-size="10" font-weight="700">NCERT Example:</text>';
      m += '<text x="510" y="225" fill="#38bdf8" font-size="11">Platyhelminthes (Flatworms)</text>';

    } else if(cType === "pseudocoelomate"){
      // Scattered mesodermal pouches
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="73" fill="#042f2e" opacity="0.4"/>'; // persistent blastocoel
      // 6 circular mesodermal pouches
      var angles = [0, 60, 120, 180, 240, 300];
      for(var i = 0; i < angles.length; i++){
        var rad = angles[i] * Math.PI / 180;
        var px = cx + Math.cos(rad) * 52;
        var py = cy + Math.sin(rad) * 52;
        m += '<circle cx="' + px + '" cy="' + py + '" r="14" fill="#dc2626" stroke="#f87171" stroke-width="2"/>';
      }
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="30" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="16" fill="#020617"/>';
      m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#94a3b8" font-size="10" text-anchor="middle">Gut</text>';

      // Callout box on right
      m += '<rect x="500" y="80" width="165" height="175" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="510" y="105" fill="#f59e0b" font-size="12" font-weight="700">Pseudocoelomate Plan</text>';
      m += '<text x="510" y="125" fill="#cbd5e1" font-size="10">• Body cavity NOT lined</text>';
      m += '<text x="510" y="140" fill="#cbd5e1" font-size="10">  by continuous mesoderm.</text>';
      m += '<text x="510" y="160" fill="#cbd5e1" font-size="10">• Mesoderm scattered in</text>';
      m += '<text x="510" y="175" fill="#cbd5e1" font-size="10">  distinct isolated pouches.</text>';
      m += '<text x="510" y="205" fill="#fcd34d" font-size="10" font-weight="700">NCERT Example:</text>';
      m += '<text x="510" y="225" fill="#38bdf8" font-size="11">Aschelminthes (Roundworms)</text>';

    } else {
      // Eucoelomate: True coelom completely lined by somatic and splanchnic mesoderm
      // Somatic mesoderm ring (under ectoderm)
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="75" fill="none" stroke="#ef4444" stroke-width="6"/>';
      // Coelomic fluid space (green tint)
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="68" fill="#065f46" opacity="0.3"/>';
      // Splanchnic mesoderm ring (around gut)
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="40" fill="none" stroke="#ef4444" stroke-width="6"/>';
      // Mesentery bridges
      m += '<line x1="' + cx + '" y1="' + (cy - 72) + '" x2="' + cx + '" y2="' + (cy - 37) + '" stroke="#ef4444" stroke-width="4"/>';
      m += '<line x1="' + cx + '" y1="' + (cy + 37) + '" x2="' + cx + '" y2="' + (cy + 72) + '" stroke="#ef4444" stroke-width="4"/>';
      // Endoderm
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="34" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="18" fill="#020617"/>';
      m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#94a3b8" font-size="10" text-anchor="middle">Gut</text>';
      m += '<text x="' + (cx + 52) + '" y="' + (cy + 4) + '" fill="#34d399" font-size="10" font-weight="700">Coelom</text>';

      // Callout box on right
      m += '<rect x="500" y="80" width="165" height="175" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="510" y="105" fill="#10b981" font-size="12" font-weight="700">Eucoelomate (True)</text>';
      m += '<text x="510" y="125" fill="#cbd5e1" font-size="10">• Cavity completely lined</text>';
      m += '<text x="510" y="140" fill="#cbd5e1" font-size="10">  by mesodermal peritoneum.</text>';
      m += '<text x="510" y="160" fill="#cbd5e1" font-size="10">• Viscera decoupled from body wall;</text>';
      m += '<text x="510" y="175" fill="#cbd5e1" font-size="10">  hydrostatic skeleton enabled.</text>';
      m += '<text x="510" y="205" fill="#fcd34d" font-size="10" font-weight="700">NCERT Range:</text>';
      m += '<text x="510" y="225" fill="#38bdf8" font-size="11">Annelida to Chordata</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Symmetry", symType.toUpperCase(), symType === "bilateral" ? "#14b8a6" : (symType === "radial" ? "#a855f7" : "#94a3b8")) +
      cell("Coelom Architecture", cType.toUpperCase(), cType === "eucoelomate" ? "#10b981" : (cType === "pseudocoelomate" ? "#f59e0b" : "#ef4444")) +
      cell("Germ Layer Count", "Triploblastic (3 Layers)", "#38bdf8") +
      cell("Key Taxa", cType === "eucoelomate" ? "Annelida, Arthropoda, Chordata" : (cType === "pseudocoelomate" ? "Aschelminthes (Ascaris)" : "Platyhelminthes (Taenia)"), "#fcd34d")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Diagnostic Rule:</span> ' +
      (cType === "eucoelomate" ? "Eucoelomates possess a true body cavity completely lined by mesodermal peritoneum on both parietal and visceral sides." :
       (cType === "pseudocoelomate" ? "Pseudocoelomates have mesoderm scattered as isolated pouches within persistent embryonic blastocoel fluid." :
        "Acoelomates have no body cavity; solid mesenchyme fills the region between gut and external body wall."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Porifera Canal System & Choanocytes (poriferacanal)
// -------------------------------------------------------------------------
window.SIMS.poriferacanal = (function(){
  var mode = "canal"; // "canal", "choanocyte", "skeleton"
  var flowSpeed = 2;

  function setM(m){ mode = m; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Incurrent Ostia</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Spongocoel Cavity</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Osculum Discharge</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Choanocyte Collars</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-canal">Canal System & Water Route</button>' +
      '<button class="preset-btn" id="p-choano">Choanocyte Collar Cell</button>' +
      '<button class="preset-btn" id="p-skel">Spicules & Spongin Skeleton</button>';

    document.getElementById("p-canal").onclick = function(){ setActivePreset(this); setM("canal"); };
    document.getElementById("p-choano").onclick = function(){ setActivePreset(this); setM("choanocyte"); };
    document.getElementById("p-skel").onclick = function(){ setActivePreset(this); setM("skeleton"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Water Pumping Velocity: <span id="flow-val">2x</span></label>' +
        '<input type="range" id="flow-slider" min="1" max="4" value="2" step="1" style="width:100%;">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Canal Circuit Pathway</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Ostia (Pores) &rarr; Spongocoel (Central Cavity) &rarr; Osculum (Exit)</div>' +
      '</div>';

    var sl = document.getElementById("flow-slider");
    if(sl){
      sl.oninput = function(){
        flowSpeed = parseInt(this.value);
        document.getElementById("flow-val").innerText = flowSpeed + "x";
        draw(0);
      };
    }

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="spongeBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#spongeBg)" rx="10"/>';

    if(mode === "canal"){
      // Sponge vase cross-section
      // Vase outer wall
      m += '<path d="M 220,270 C 200,240 180,180 190,100 C 195,70 230,60 250,60 C 270,60 305,70 310,100 C 320,180 300,240 280,270 Z" fill="#78350f" opacity="0.3" stroke="#b45309" stroke-width="2"/>';

      // Inner cavity (Spongocoel)
      m += '<path d="M 235,260 C 220,230 210,180 220,100 C 225,80 240,75 250,75 C 260,75 275,80 280,100 C 290,180 280,230 265,260 Z" fill="#0284c7" opacity="0.25"/>';

      // Ostia pores (lateral channels)
      var ostiaY = [120, 150, 180, 210, 240];
      for(var i = 0; i < ostiaY.length; i++){
        var y = ostiaY[i];
        // Left pore
        m += '<line x1="165" y1="' + y + '" x2="218" y2="' + y + '" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>';
        m += '<polygon points="' + (213) + ',' + (y - 3) + ' ' + (219) + ',' + y + ' ' + (213) + ',' + (y + 3) + '" fill="#38bdf8"/>';
        // Right pore
        m += '<line x1="335" y1="' + y + '" x2="282" y2="' + y + '" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>';
        m += '<polygon points="' + (287) + ',' + (y - 3) + ' ' + (281) + ',' + y + ' ' + (287) + ',' + (y + 3) + '" fill="#38bdf8"/>';
      }

      // Water outflow at osculum (top)
      m += '<line x1="250" y1="75" x2="250" y2="25" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>';
      m += '<polygon points="244,30 250,20 256,30" fill="#f59e0b"/>';
      m += '<text x="250" y="15" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">Osculum Exit</text>';

      // Spongocoel label
      m += '<text x="250" y="170" fill="#bae6fd" font-size="11" font-weight="700" text-anchor="middle">Spongocoel</text>';
      m += '<text x="250" y="185" fill="#38bdf8" font-size="9" text-anchor="middle">(Choanocyte Lined)</text>';

      // Labels on left
      m += '<text x="140" y="180" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="end">Ostia (Inflow)</text>';
      m += '<text x="140" y="195" fill="#94a3b8" font-size="9" text-anchor="end">Microscopic Pores</text>';

      // Substratum base
      m += '<rect x="180" y="270" width="140" height="20" rx="4" fill="#334155"/>';
      m += '<text x="250" y="285" fill="#94a3b8" font-size="10" text-anchor="middle">Sessile Substratum</text>';

      // Right Explanation Card
      m += '<rect x="380" y="45" width="295" height="235" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="400" y="75" fill="#38bdf8" font-size="13" font-weight="700">Poriferan Water Transport System</text>';
      m += '<text x="400" y="105" fill="#f8fafc" font-size="11" font-weight="600">The 3 Vital Physiological Roles:</text>';
      m += '<text x="400" y="128" fill="#cbd5e1" font-size="10.5">1. <strong style="color:#38bdf8">Food Gathering:</strong> Filter organic particles</text>';
      m += '<text x="400" y="148" fill="#cbd5e1" font-size="10.5">2. <strong style="color:#10b981">Respiratory Gas Exchange:</strong> Direct diffusion</text>';
      m += '<text x="400" y="168" fill="#cbd5e1" font-size="10.5">3. <strong style="color:#f59e0b">Waste Removal:</strong> Excretion via osculum</text>';
      m += '<line x1="400" y1="185" x2="655" y2="185" stroke="#334155" stroke-width="1"/>';
      m += '<text x="400" y="210" fill="#e2e8f0" font-size="10.5">Digestion: <strong style="color:#ec4899">Strictly Intracellular</strong></text>';
      m += '<text x="400" y="230" fill="#e2e8f0" font-size="10.5">Body Support: Spicules &amp; Spongin fibres</text>';
      m += '<text x="400" y="250" fill="#fcd34d" font-size="10.5">NCERT Examples: Sycon, Spongilla, Euspongia</text>';

    } else if(mode === "choanocyte"){
      // Choanocyte cellular anatomy
      m += '<rect x="50" y="45" width="280" height="235" rx="8" fill="#1e293b" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="190" y="75" fill="#ec4899" font-size="13" font-weight="700" text-anchor="middle">Choanocyte (Collar Cell)</text>';

      // Cell body
      m += '<circle cx="190" cy="200" r="35" fill="#831843" stroke="#f472b6" stroke-width="2"/>';
      m += '<circle cx="190" cy="200" r="12" fill="#fda4af"/>';
      m += '<text x="190" y="204" fill="#831843" font-size="9" font-weight="700" text-anchor="middle">Nucleus</text>';

      // Collar microvilli tentacles
      m += '<path d="M 170,165 L 165,120 L 215,120 L 210,165 Z" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-dasharray="3,2"/>';
      m += '<text x="190" y="145" fill="#fbcfe8" font-size="10" text-anchor="middle">Microvilli Collar</text>';

      // Central flagellum undulating
      m += '<path d="M 190,170 Q 185,130 195,100 T 190,65" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<text x="235" y="85" fill="#38bdf8" font-size="10" font-weight="600">Flagellum</text>';

      // Food vacuole particles entering
      m += '<circle cx="178" cy="180" r="3.5" fill="#fbbf24"/>';
      m += '<circle cx="202" cy="185" r="3.5" fill="#fbbf24"/>';

      // Right Explanation Card
      m += '<rect x="360" y="45" width="315" height="235" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="380" y="75" fill="#f8fafc" font-size="13" font-weight="700">Choanocyte Functional Diagnostic</text>';
      m += '<text x="380" y="105" fill="#cbd5e1" font-size="11">• <strong>Location:</strong> Line the spongocoel and canals.</text>';
      m += '<text x="380" y="130" fill="#cbd5e1" font-size="11">• <strong>Flagellar Hydrodynamics:</strong> Rapid undulation</text>';
      m += '<text x="380" y="147" fill="#cbd5e1" font-size="11">  drives directional water flow through ostia.</text>';
      m += '<text x="380" y="172" fill="#cbd5e1" font-size="11">• <strong>Collar Trapping:</strong> Mucus mesh on microvilli</text>';
      m += '<text x="380" y="189" fill="#cbd5e1" font-size="11">  captures bacteria and microscopic plankton.</text>';
      m += '<text x="380" y="215" fill="#cbd5e1" font-size="11">• <strong>Phagocytosis:</strong> Intracellular food vacuoles</text>';
      m += '<text x="380" y="232" fill="#cbd5e1" font-size="11">  pass nutrients directly to wandering amoebocytes.</text>';
      m += '<text x="380" y="258" fill="#ec4899" font-size="10.5" font-weight="700">Crucial Diagnostic Hallmark of Phylum Porifera</text>';

    } else {
      // Skeleton: Spicules & Spongin
      m += '<rect x="40" y="45" width="290" height="235" rx="8" fill="#1e293b" stroke="#fcd34d" stroke-width="1.5"/>';
      m += '<text x="185" y="75" fill="#fcd34d" font-size="13" font-weight="700" text-anchor="middle">Skeletal Elements</text>';

      // Triaxon spicule
      m += '<line x1="110" y1="140" x2="160" y2="140" stroke="#f8fafc" stroke-width="3"/>';
      m += '<line x1="160" y1="140" x2="190" y2="100" stroke="#f8fafc" stroke-width="3"/>';
      m += '<line x1="160" y1="140" x2="190" y2="180" stroke="#f8fafc" stroke-width="3"/>';
      m += '<text x="150" y="195" fill="#e2e8f0" font-size="10" text-anchor="middle">Calcareous/Siliceous Spicule</text>';

      // Spongin fiber network
      m += '<path d="M 90,215 Q 120,230 150,215 T 210,225 T 270,210" fill="none" stroke="#d97706" stroke-width="3.5"/>';
      m += '<path d="M 110,240 Q 140,215 170,240 T 230,230" fill="none" stroke="#d97706" stroke-width="3"/>';
      m += '<text x="185" y="260" fill="#f59e0b" font-size="10" text-anchor="middle">Spongin Protein Fibre Network</text>';

      // Right Explanation Card
      m += '<rect x="360" y="45" width="315" height="235" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="380" y="75" fill="#f8fafc" font-size="13" font-weight="700">Skeletal Architecture & Reproduction</text>';
      m += '<text x="380" y="105" fill="#cbd5e1" font-size="11">• <strong>Endoskeleton:</strong> Made of needle-like spicules</text>';
      m += '<text x="380" y="122" fill="#cbd5e1" font-size="11">  (calcium carbonate or silica) or spongin fibres.</text>';
      m += '<text x="380" y="147" fill="#cbd5e1" font-size="11">• <strong>Bath Sponge (Euspongia):</strong> Skeletal framework</text>';
      m += '<text x="380" y="164" fill="#cbd5e1" font-size="11">  is composed entirely of resilient spongin fibres.</text>';
      m += '<text x="380" y="189" fill="#cbd5e1" font-size="11">• <strong>Sexuality:</strong> Hermaphrodite / Monoecious</text>';
      m += '<text x="380" y="206" fill="#cbd5e1" font-size="11">  (eggs &amp; sperms produced by same individual).</text>';
      m += '<text x="380" y="231" fill="#cbd5e1" font-size="11">• <strong>Reproduction:</strong> Asexual by fragmentation;</text>';
      m += '<text x="380" y="248" fill="#cbd5e1" font-size="11">  Sexual by gametes with indirect larval development.</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Subkingdom", "Parazoa (Cellular)", "#38bdf8") +
      cell("Water Highway", "Ostia &rarr; Spongocoel &rarr; Osculum", "#10b981") +
      cell("Digestion Mode", "Strictly Intracellular", "#ec4899") +
      cell("Pumping Velocity", flowSpeed + "x Normal", "#f59e0b")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Canal Rule:</span> ' +
      'Water enters through minute pores (ostia) in the body wall into a central cavity (spongocoel), whence it goes out through the osculum. Choanocytes line the spongocoel and canals.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Comparative Worm Lab (coelomclassifier)
// -------------------------------------------------------------------------
window.SIMS.coelomclassifier = (function(){
  var worm = "platy"; // "platy", "aschel", "annelid"

  function setW(w){ worm = w; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Platyhelminthes (Acoelomate)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Aschelminthes (Pseudocoelomate)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Annelida (True Coelomate)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-platy">Platyhelminthes (Tapeworm/Planaria)</button>' +
      '<button class="preset-btn" id="p-asch">Aschelminthes (Ascaris Roundworm)</button>' +
      '<button class="preset-btn" id="p-ann">Annelida (Earthworm/Nereis)</button>';

    document.getElementById("p-platy").onclick = function(){ setActivePreset(this); setW("platy"); };
    document.getElementById("p-asch").onclick = function(){ setActivePreset(this); setW("aschel"); };
    document.getElementById("p-ann").onclick = function(){ setActivePreset(this); setW("annelid"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Anatomical Triad Comparison</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Directly compares cross-sectional anatomy, gut completeness, excretory organs, and segmentation across worm phyla.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="wormGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#wormGrad)" rx="10"/>';

    // Left anatomical schematic
    m += '<rect x="25" y="25" width="280" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';

    if(worm === "platy"){
      m += '<text x="165" y="52" fill="#ef4444" font-size="13" font-weight="700" text-anchor="middle">Platyhelminthes (Flatworms)</text>';
      // Dorsoventrally flattened body
      m += '<path d="M 60,110 Q 165,85 270,110 Q 275,150 270,190 Q 165,215 60,190 Q 55,150 60,110 Z" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>';
      // Flame cell schematic
      m += '<circle cx="165" cy="150" r="16" fill="#ef4444"/>';
      m += '<path d="M 165,140 Q 160,150 165,160" stroke="#fef08a" stroke-width="2" fill="none"/>';
      m += '<text x="165" y="178" fill="#fef08a" font-size="10" font-weight="700" text-anchor="middle">Flame Cells (Solenocytes)</text>';
      m += '<text x="165" y="240" fill="#fca5a5" font-size="11" text-anchor="middle">Dorsoventrally Flattened Body</text>';
      m += '<text x="165" y="260" fill="#cbd5e1" font-size="10" text-anchor="middle">Blind-sac Gut (Incomplete) | Acoelomate</text>';

    } else if(worm === "aschel"){
      m += '<text x="165" y="52" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">Aschelminthes (Roundworms)</text>';
      // Cylindrical unsegmented body with sexual dimorphism
      m += '<path d="M 70,150 Q 165,125 260,150 Q 255,165 260,170 Q 165,145 70,170 Z" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>';
      // Muscular pharynx
      m += '<rect x="90" y="152" width="35" height="11" rx="2" fill="#ef4444"/>';
      m += '<text x="107" y="145" fill="#fca5a5" font-size="8.5" text-anchor="middle">Pharynx</text>';
      m += '<circle cx="210" cy="157" r="4" fill="#10b981"/>';
      m += '<text x="210" y="145" fill="#86efac" font-size="8.5" text-anchor="middle">Excretory Pore</text>';
      m += '<text x="165" y="220" fill="#fcd34d" font-size="11" text-anchor="middle">Circular in Cross-Section</text>';
      m += '<text x="165" y="240" fill="#cbd5e1" font-size="10" text-anchor="middle">Syncytial Epidermis + Cuticle</text>';
      m += '<text x="165" y="260" fill="#cbd5e1" font-size="10" text-anchor="middle">Well-developed Muscular Pharynx</text>';

    } else {
      m += '<text x="165" y="52" fill="#10b981" font-size="13" font-weight="700" text-anchor="middle">Annelida (Segmented Worms)</text>';
      // Metameric ring segments
      m += '<path d="M 55,150 Q 165,130 275,150 Q 275,175 55,175 Z" fill="#064e3b" stroke="#34d399" stroke-width="2"/>';
      for(var seg = 75; seg < 260; seg += 18){
        m += '<line x1="' + seg + '" y1="140" x2="' + seg + '" y2="173" stroke="#6ee7b7" stroke-width="1.5"/>';
      }
      // Parapodia/setae bristles
      for(var b = 75; b < 260; b += 18){
        m += '<line x1="' + b + '" y1="173" x2="' + (b-3) + '" y2="183" stroke="#a7f3d0" stroke-width="2"/>';
      }
      m += '<text x="165" y="220" fill="#6ee7b7" font-size="11" text-anchor="middle">Metamerically Segmented</text>';
      m += '<text x="165" y="240" fill="#cbd5e1" font-size="10" text-anchor="middle">Longitudinal &amp; Circular Muscles</text>';
      m += '<text x="165" y="260" fill="#cbd5e1" font-size="10" text-anchor="middle">Nephridia for Osmoregulation &amp; Excretion</text>';
    }

    // Right Comparison Table / Matrix
    m += '<rect x="325" y="25" width="350" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
    m += '<text x="345" y="52" fill="#38bdf8" font-size="13" font-weight="700">Diagnostic Feature Matrix</text>';

    var rows = [
      { label: "Coelom Status", p: "Acoelomate (Solid)", a: "Pseudocoelomate", n: "True Coelomate (Schizo)" },
      { label: "Symmetry & Germs", p: "Bilateral, Triploblastic", a: "Bilateral, Triploblastic", n: "Bilateral, Triploblastic" },
      { label: "Alimentary Canal", p: "Incomplete (Blind Sac)", a: "Complete (Muscular Pharynx)", n: "Complete with Specialized Gut" },
      { label: "Excretory Organ", p: "Flame Cells / Protonephridia", a: "Excretory Tube & Pore", n: "Coiled Nephridia" },
      { label: "Circulatory System", p: "Absent (Diffusion)", a: "Absent (Pseudocoel Fluid)", n: "CLOSED Circulatory System" },
      { label: "Key NCERT Species", p: "Taenia, Fasciola, Planaria", a: "Ascaris, Wuchereria, Ancylostoma", n: "Nereis, Pheretima, Hirudinaria" }
    ];

    var curY = 78;
    for(var r = 0; r < rows.length; r++){
      var row = rows[r];
      var hl = (worm === "platy" ? row.p : (worm === "aschel" ? row.a : row.n));
      var col = (worm === "platy" ? "#ef4444" : (worm === "aschel" ? "#f59e0b" : "#10b981"));

      m += '<rect x="338" y="' + (curY - 14) + '" width="324" height="28" rx="4" fill="' + (r % 2 === 0 ? "#1e293b" : "#0f172a") + '"/>';
      m += '<text x="345" y="' + curY + '" fill="#94a3b8" font-size="10.5" font-weight="600">' + row.label + ':</text>';
      m += '<text x="470" y="' + curY + '" fill="' + col + '" font-size="10.5" font-weight="700">' + hl + '</text>';
      curY += 32;
    }

    svg.innerHTML = m;

    readout(
      cell("Body Cross-Section", worm === "platy" ? "Dorsoventrally Flat" : (worm === "aschel" ? "Circular (Round)" : "Metameric Ringed"), worm === "platy" ? "#ef4444" : (worm === "aschel" ? "#f59e0b" : "#10b981")) +
      cell("Excretory Apparatus", worm === "platy" ? "Flame Cells" : (worm === "aschel" ? "Excretory Pore" : "Segmental Nephridia"), "#38bdf8") +
      cell("Circulation", worm === "annelid" ? "Closed Vascular" : "Absent", worm === "annelid" ? "#10b981" : "#94a3b8") +
      cell("Coelom", worm === "platy" ? "Acoelomate" : (worm === "aschel" ? "Pseudocoelomate" : "Eucoelomate"), "#fcd34d")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Evolutionary Cleavage:</span> ' +
      (worm === "platy" ? "Platyhelminthes possess bilateral symmetry and triploblastic layers but lack a coelom; flame cells regulate osmotic balance." :
       (worm === "aschel" ? "Aschelminthes possess a pseudocoelom with a complete digestive tract powered by a well-developed muscular pharynx." :
        "Annelids are the first animals to showcase true metamerism, closed circulation with hemoglobin, and true peritoneal coelomic cavities."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Arthropoda Architecture & Tagmatization (arthropodaseg)
// -------------------------------------------------------------------------
window.SIMS.arthropodaseg = (function(){
  var focus = "tagmata"; // "tagmata", "respiration", "excretion", "diversity"

  function setF(f){ focus = f; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Head (Sensory)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Thorax (Locomotion)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Abdomen (Viscera)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Chitinous Exoskeleton</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-tag">Body Tagmata & Appendages</button>' +
      '<button class="preset-btn" id="p-resp">Respiratory Adaptations</button>' +
      '<button class="preset-btn" id="p-excr">Malpighian Excretory Tubules</button>' +
      '<button class="preset-btn" id="p-div">Economic & Vector Diversity</button>';

    document.getElementById("p-tag").onclick = function(){ setActivePreset(this); setF("tagmata"); };
    document.getElementById("p-resp").onclick = function(){ setActivePreset(this); setF("respiration"); };
    document.getElementById("p-excr").onclick = function(){ setActivePreset(this); setF("excretion"); };
    document.getElementById("p-div").onclick = function(){ setActivePreset(this); setF("diversity"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Phylum Arthropoda: > 2/3 of all named animal species on Earth</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Diagnostic hallmarks: Chitinous exoskeleton, jointed appendages, open circulatory system, statocysts, and Malpighian tubules.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="arthroGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#arthroGrad)" rx="10"/>';

    if(focus === "tagmata"){
      // Grasshopper / insect tagmatization diagram
      m += '<rect x="25" y="25" width="375" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="212" y="52" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">Insect Tagmatization (NCERT Locust Body Plan)</text>';

      // Head (blue)
      m += '<ellipse cx="90" cy="150" rx="35" ry="30" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="80" cy="138" r="8" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>'; // compound eye
      m += '<text x="75" y="141" fill="#38bdf8" font-size="8">Eye</text>';
      // Antenna
      m += '<path d="M 85,120 Q 95,85 120,75" fill="none" stroke="#e2e8f0" stroke-width="2"/>';
      m += '<text x="125" y="75" fill="#e2e8f0" font-size="9">Antenna</text>';

      // Thorax (red/pink, 3 segments: pro, meso, meta)
      m += '<rect x="130" y="120" width="70" height="60" rx="10" fill="#991b1b" stroke="#ef4444" stroke-width="2"/>';
      m += '<line x1="153" y1="120" x2="153" y2="180" stroke="#f87171" stroke-dasharray="2,2"/>';
      m += '<line x1="176" y1="120" x2="176" y2="180" stroke="#f87171" stroke-dasharray="2,2"/>';
      // Wings on thorax
      m += '<ellipse cx="180" cy="105" rx="45" ry="12" fill="#38bdf8" opacity="0.4" stroke="#38bdf8" stroke-width="1.5" transform="rotate(-15 180 105)"/>';

      // Abdomen (green, segmented)
      m += '<path d="M 205,125 Q 310,135 340,150 Q 310,165 205,175 Z" fill="#065f46" stroke="#10b981" stroke-width="2"/>';
      for(var s = 225; s < 330; s += 16){
        m += '<line x1="' + s + '" y1="130" x2="' + s + '" y2="170" stroke="#34d399" stroke-width="1.5"/>';
      }

      // Jointed legs (3 pairs on thorax)
      // Leg 1
      m += '<polyline points="145,175 135,215 115,245" fill="none" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
      // Leg 2
      m += '<polyline points="165,175 165,220 155,250" fill="none" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
      // Leg 3 (large jumping leg)
      m += '<polyline points="185,170 215,215 200,255" fill="none" stroke="#fcd34d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';

      // Labels below
      m += '<text x="90" y="275" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">HEAD</text>';
      m += '<text x="165" y="275" fill="#ef4444" font-size="11" font-weight="700" text-anchor="middle">THORAX</text>';
      m += '<text x="270" y="275" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">ABDOMEN</text>';

      // Right Explanation Card
      m += '<rect x="415" y="25" width="260" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="430" y="52" fill="#fcd34d" font-size="13" font-weight="700">The Arthropod Success Triad</text>';
      m += '<text x="430" y="80" fill="#cbd5e1" font-size="11"><strong>1. Chitinous Cuticle:</strong> Tough,</text>';
      m += '<text x="430" y="96" fill="#cbd5e1" font-size="11">   waterproof exoskeleton prevents</text>';
      m += '<text x="430" y="112" fill="#cbd5e1" font-size="11">   desiccation; requires moulting (ecdysis).</text>';
      m += '<text x="430" y="138" fill="#cbd5e1" font-size="11"><strong>2. Jointed Appendages:</strong> Specialized</text>';
      m += '<text x="430" y="154" fill="#cbd5e1" font-size="11">   for walking, swimming, feeding,</text>';
      m += '<text x="430" y="170" fill="#cbd5e1" font-size="11">   and sensory perception.</text>';
      m += '<text x="430" y="196" fill="#cbd5e1" font-size="11"><strong>3. Open Circulation:</strong> Blood/hemolymph</text>';
      m += '<text x="430" y="212" fill="#cbd5e1" font-size="11">   pumped into open coelomic sinuses</text>';
      m += '<text x="430" y="228" fill="#cbd5e1" font-size="11">   (hemocoel); no closed capillaries.</text>';
      m += '<text x="430" y="260" fill="#38bdf8" font-size="10.5" font-weight="600">Statocysts: Organs of equilibrium</text>';

    } else if(focus === "respiration"){
      // Respiratory modes card
      m += '<rect x="35" y="30" width="630" height="260" rx="8" fill="#0b1329" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="350" y="60" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">Arthropod Respiratory Organs: Ecological Specialization</text>';

      var resps = [
        { name: "Gills", taxa: "Aquatic Crustaceans (e.g. Prawn)", col: "#0284c7", desc: "Delicate vascularized gill filaments immersed in water." },
        { name: "Book Gills", taxa: "King Crab (Limulus)", col: "#0d9488", desc: "Leaf-like vascular plates stacked like book pages; living fossil." },
        { name: "Book Lungs", taxa: "Arachnids (Scorpion, Spider)", col: "#e11d48", desc: "Internal air-filled lamellae pouches exchanging gases directly." },
        { name: "Tracheal System", taxa: "Insects (Cockroach, Locust)", col: "#d97706", desc: "Branching spiracles & tracheae delivering O₂ directly to cells." }
      ];

      for(var ri = 0; ri < resps.length; ri++){
        var rx = 55 + ri * 150;
        var rData = resps[ri];
        m += '<rect x="' + rx + '" y="85" width="140" height="185" rx="6" fill="#1e293b" stroke="' + rData.col + '" stroke-width="1.5"/>';
        m += '<circle cx="' + (rx + 70) + '" cy="115" r="20" fill="' + rData.col + '" opacity="0.25"/>';
        m += '<text x="' + (rx + 70) + '" y="120" fill="' + rData.col + '" font-size="11" font-weight="700" text-anchor="middle">' + rData.name + '</text>';
        m += '<text x="' + (rx + 70) + '" y="155" fill="#f8fafc" font-size="10" font-weight="600" text-anchor="middle">' + rData.taxa + '</text>';
        m += '<foreignObject x="' + (rx + 8) + '" y="175" width="124" height="85">';
        m += '<div style="color:#cbd5e1;font-size:9.5px;line-height:1.3;text-align:center;">' + rData.desc + '</div>';
        m += '</foreignObject>';
      }

    } else if(focus === "excretion"){
      // Malpighian tubules diagram
      m += '<rect x="35" y="30" width="630" height="260" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="350" y="60" fill="#fcd34d" font-size="14" font-weight="700" text-anchor="middle">Excretion & Osmoregulation: Malpighian Tubules & Green Glands</text>';

      // Digestive tract junction schematic
      m += '<rect x="70" y="110" width="120" height="40" rx="6" fill="#9a3412" stroke="#ea580c" stroke-width="2"/>';
      m += '<text x="130" y="135" fill="#fed7aa" font-size="11" font-weight="700" text-anchor="middle">Midgut (Mesenteron)</text>';
      m += '<rect x="220" y="110" width="120" height="40" rx="6" fill="#15803d" stroke="#22c55e" stroke-width="2"/>';
      m += '<text x="280" y="135" fill="#bbf7d0" font-size="11" font-weight="700" text-anchor="middle">Hindgut (Ileum/Rectum)</text>';

      // Yellow thread-like tubules arising at junction
      for(var ti = 0; ti < 6; ti++){
        var ty = 85 + ti * 16;
        m += '<path d="M 195,120 Q 205,' + (ty - 10) + ' 180,' + ty + '" fill="none" stroke="#facc15" stroke-width="2.5"/>';
      }
      m += '<text x="150" y="78" fill="#facc15" font-size="10.5" font-weight="700">Malpighian Tubules (Yellow Fibres)</text>';
      m += '<text x="195" y="180" fill="#94a3b8" font-size="10" text-anchor="middle">Bathed directly in Hemolymph</text>';

      // Right Explanation Box
      m += '<rect x="375" y="85" width="270" height="185" rx="6" fill="#0b1329" stroke="#334155" stroke-width="1"/>';
      m += '<text x="390" y="112" fill="#38bdf8" font-size="12" font-weight="700">Nitrogenous Excretion Mastery</text>';
      m += '<text x="390" y="136" fill="#cbd5e1" font-size="10.5">• <strong>Insects &amp; Centipedes:</strong> Malpighian tubules</text>';
      m += '<text x="390" y="152" fill="#cbd5e1" font-size="10.5">  absorb potassium urate from hemolymph,</text>';
      m += '<text x="390" y="168" fill="#cbd5e1" font-size="10.5">  converting it to insoluble <strong>Uric Acid</strong> (uricotelic).</text>';
      m += '<text x="390" y="194" fill="#cbd5e1" font-size="10.5">• <strong>Crustaceans (Prawns):</strong> Excrete via</text>';
      m += '<text x="390" y="210" fill="#cbd5e1" font-size="10.5">  paired <strong>Antennal Glands (Green Glands)</strong>.</text>';
      m += '<text x="390" y="238" fill="#fcd34d" font-size="10.5">Extreme water conservation for terrestrial survival</text>';

    } else {
      // Diversity cards: NCERT categories
      m += '<rect x="35" y="30" width="630" height="260" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="350" y="60" fill="#34d399" font-size="14" font-weight="700" text-anchor="middle">NCERT Classification of Key Arthropods</text>';

      var groups = [
        { title: "Economically Important", taxa: "Apis (Honeybee)\nBombyx (Silkworm)\nLaccifer (Lac insect)", col: "#10b981" },
        { title: "Disease Vectors", taxa: "Anopheles (Malaria)\nCulex (Filariasis)\nAedes (Dengue/Chikungunya)", col: "#f43f5e" },
        { title: "Gregarious Pest", taxa: "Locusta (Locust)\nForms destructive swarms destroying crops", col: "#f59e0b" },
        { title: "Living Fossil", taxa: "Limulus (King Crab)\nUnchanged ancient marine chelicerate lineage", col: "#818cf8" }
      ];

      for(var gi = 0; gi < groups.length; gi++){
        var gx = 50 + gi * 150;
        var gData = groups[gi];
        m += '<rect x="' + gx + '" y="85" width="140" height="185" rx="6" fill="#1e293b" stroke="' + gData.col + '" stroke-width="1.5"/>';
        m += '<text x="' + (gx + 70) + '" y="112" fill="' + gData.col + '" font-size="11" font-weight="700" text-anchor="middle">' + gData.title + '</text>';
        var lines = gData.taxa.split("\n");
        for(var li = 0; li < lines.length; li++){
          m += '<text x="' + (gx + 70) + '" y="' + (145 + li * 19) + '" fill="#e2e8f0" font-size="9.5" text-anchor="middle">' + lines[li] + '</text>';
        }
      }
    }

    svg.innerHTML = m;

    readout(
      cell("Body Segments", "Head, Thorax, Abdomen", "#38bdf8") +
      cell("Circulation", "Open (Hemocoel)", "#ef4444") +
      cell("Excretory Units", "Malpighian Tubules / Antennal", "#f59e0b") +
      cell("Global Share", "> 66% of All Animals", "#10b981")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Arthropod Rule:</span> ' +
      'Body consists of head, thorax, and abdomen with jointed appendages and a tough chitinous cuticle. Excretion is mediated by Malpighian tubules or green glands.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Echinoderm Water Vascular & Hemichordata (watervascular)
// -------------------------------------------------------------------------
window.SIMS.watervascular = (function(){
  var phylum = "echino"; // "echino", "hemichorda"

  function setP(p){ phylum = p; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Madreporite</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Radial Canals (5 Arms)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Ampullae & Tube Feet</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Proboscis Gland</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-echino">Echinoderm Water Vascular System</button>' +
      '<button class="preset-btn" id="p-hemi">Hemichordata (Balanoglossus)</button>';

    document.getElementById("p-echino").onclick = function(){ setActivePreset(this); setP("echino"); };
    document.getElementById("p-hemi").onclick = function(){ setActivePreset(this); setP("hemichorda"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Hydraulic & Marine Invertebrate Anatomy</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Echinoderm water vascular system (locomotion + food capture) vs Hemichordate tripartite body plan (Proboscis, Collar, Trunk).</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="echGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#echGrad)" rx="10"/>';

    if(phylum === "echino"){
      // Water vascular system diagram
      m += '<rect x="25" y="25" width="365" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="207" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">Hydraulic Water Vascular System (Asterias)</text>';

      var cx = 207, cy = 160;
      // Central ring canal
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="28" fill="none" stroke="#10b981" stroke-width="7"/>';

      // Madreporite (sieve plate) & stone canal
      m += '<line x1="' + cx + '" y1="' + (cy - 28) + '" x2="' + cx + '" y2="' + (cy - 75) + '" stroke="#38bdf8" stroke-width="5"/>';
      m += '<circle cx="' + cx + '" cy="' + (cy - 80) + '" r="12" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + cx + '" y="' + (cy - 97) + '" fill="#38bdf8" font-size="10.5" font-weight="700" text-anchor="middle">Madreporite (Sieve Plate)</text>';

      // 5 radial canals
      var armAngles = [-90 + 72, -90 + 144, -90 + 216, -90 + 288, -90];
      for(var i = 0; i < 5; i++){
        var rad = armAngles[i] * Math.PI / 180;
        var ex = cx + Math.cos(rad) * 95;
        var ey = cy + Math.sin(rad) * 95;
        m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + ex + '" y2="' + ey + '" stroke="#10b981" stroke-width="5"/>';

        // Tube feet along the arms
        for(var f = 35; f <= 85; f += 25){
          var fx = cx + Math.cos(rad) * f;
          var fy = cy + Math.sin(rad) * f;
          var px1 = fx - Math.sin(rad) * 10;
          var py1 = fy + Math.cos(rad) * 10;
          var px2 = fx + Math.sin(rad) * 10;
          var py2 = fy - Math.cos(rad) * 10;
          m += '<circle cx="' + px1 + '" cy="' + py1 + '" r="3" fill="#f59e0b"/>';
          m += '<circle cx="' + px2 + '" cy="' + py2 + '" r="3" fill="#f59e0b"/>';
        }
      }

      m += '<text x="207" y="165" fill="#ec4899" font-size="10" font-weight="700" text-anchor="middle">Ring Canal</text>';
      m += '<text x="295" y="235" fill="#f59e0b" font-size="10.5" font-weight="700">Tube Feet (Podia)</text>';

      // Right Explanation Card
      m += '<rect x="405" y="25" width="270" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="420" y="52" fill="#10b981" font-size="13" font-weight="700">Phylum Echinodermata Hallmarks</text>';
      m += '<text x="420" y="80" fill="#cbd5e1" font-size="11">• <strong>Endoskeleton:</strong> Calcareous ossicles</text>';
      m += '<text x="420" y="96" fill="#cbd5e1" font-size="11">  forming spiny skin (echinos = spiny).</text>';
      m += '<text x="420" y="122" fill="#cbd5e1" font-size="11">• <strong>Biphasic Symmetry:</strong></text>';
      m += '<text x="420" y="138" fill="#38bdf8" font-size="10.5">  - Adults: Radial (pentamerous)</text>';
      m += '<text x="420" y="154" fill="#38bdf8" font-size="10.5">  - Larvae: Bilaterally symmetrical</text>';
      m += '<text x="420" y="180" fill="#cbd5e1" font-size="11">• <strong>Water Vascular System:</strong> Performs</text>';
      m += '<text x="420" y="196" fill="#cbd5e1" font-size="11">  locomotion, food capture &amp; respiration.</text>';
      m += '<text x="420" y="222" fill="#ef4444" font-size="11"><strong>Excretory System: COMPLETELY ABSENT</strong></text>';
      m += '<text x="420" y="250" fill="#fcd34d" font-size="10.5">Examples: Asterias, Echinus, Antedon, Cucumaria</text>';

    } else {
      // Hemichordata (Balanoglossus) tripartite body
      m += '<rect x="25" y="25" width="365" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="207" y="50" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">Balanoglossus Body Architecture</text>';

      // Proboscis (conical head, pink)
      m += '<ellipse cx="100" cy="150" rx="35" ry="25" fill="#9d174d" stroke="#f472b6" stroke-width="2"/>';
      m += '<circle cx="100" cy="150" r="10" fill="#be185d"/>'; // proboscis gland
      m += '<text x="100" y="153" fill="#fbcfe8" font-size="8" font-weight="700" text-anchor="middle">Gland</text>';

      // Collar (short ring, orange)
      m += '<rect x="135" y="130" width="30" height="40" rx="4" fill="#c2410c" stroke="#fb923c" stroke-width="2"/>';

      // Long Trunk (green/slate)
      m += '<path d="M 165,135 Q 260,130 350,145 Q 350,165 260,170 Q 165,165 165,135 Z" fill="#0f766e" stroke="#2dd4bf" stroke-width="2"/>';
      // Gill slits on anterior trunk
      for(var gs = 180; gs < 240; gs += 12){
        m += '<line x1="' + gs + '" y1="140" x2="' + gs + '" y2="160" stroke="#f8fafc" stroke-width="2"/>';
      }

      // Region labels
      m += '<text x="100" y="200" fill="#f472b6" font-size="11" font-weight="700" text-anchor="middle">Proboscis</text>';
      m += '<text x="150" y="200" fill="#fb923c" font-size="11" font-weight="700" text-anchor="middle">Collar</text>';
      m += '<text x="250" y="200" fill="#2dd4bf" font-size="11" font-weight="700" text-anchor="middle">Long Trunk</text>';
      m += '<text x="210" y="125" fill="#f8fafc" font-size="9" text-anchor="middle">Pharyngeal Gill Pores</text>';

      // Right Explanation Card
      m += '<rect x="405" y="25" width="270" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="420" y="52" fill="#f59e0b" font-size="13" font-weight="700">Hemichordata Diagnostic Hallmarks</text>';
      m += '<text x="420" y="80" fill="#cbd5e1" font-size="11">• <strong>Taxonomic Shift:</strong> Earlier treated as</text>';
      m += '<text x="420" y="96" fill="#cbd5e1" font-size="11">  subphylum under Chordata; now classified as</text>';
      m += '<text x="420" y="112" fill="#cbd5e1" font-size="11">  a separate non-chordate phylum.</text>';
      m += '<text x="420" y="138" fill="#cbd5e1" font-size="11">• <strong>Stomochord:</strong> Rudimentary structure in</text>';
      m += '<text x="420" y="154" fill="#cbd5e1" font-size="11">  the collar; lacks true notochord sheath.</text>';
      m += '<text x="420" y="180" fill="#cbd5e1" font-size="11">• <strong>Excretory Organ:</strong> <strong>Proboscis Gland</strong></text>';
      m += '<text x="420" y="206" fill="#cbd5e1" font-size="11">• <strong>Respiration:</strong> Gill slits in trunk pharynx.</text>';
      m += '<text x="420" y="232" fill="#cbd5e1" font-size="11">• <strong>Circulation:</strong> Open circulatory system.</text>';
      m += '<text x="420" y="258" fill="#fcd34d" font-size="10.5">NCERT Examples: Balanoglossus, Saccoglossus</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Taxon", phylum === "echino" ? "Echinodermata" : "Hemichordata", phylum === "echino" ? "#10b981" : "#f59e0b") +
      cell("Locomotion / Body", phylum === "echino" ? "Tube Feet (Podia)" : "Proboscis / Collar / Trunk", "#38bdf8") +
      cell("Excretory Mechanism", phylum === "echino" ? "ABSENT (Diffusion)" : "Proboscis Gland", phylum === "echino" ? "#ef4444" : "#ec4899") +
      cell("Habitat", "Exclusively Marine", "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Diagnostic Rule:</span> ' +
      (phylum === "echino" ? "Echinoderms are characterized by spiny calcareous ossicles, pentamerous radial adult symmetry, and an all-purpose hydraulic water vascular system." :
       "Hemichordates have a cylindrical body divided into proboscis, collar, and trunk, with a stomochord in the collar and excretion via the proboscis gland.")
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Chordata Diagnostic Quartet & Subphyla (chordateclado)
// -------------------------------------------------------------------------
window.SIMS.chordateclado = (function(){
  var subphylum = "quartet"; // "quartet", "uro", "cephalo", "vert"

  function setSub(s){ subphylum = s; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Nerve Cord (Dorsal)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Notochord</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Gill Slits</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Post-Anal Tail</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-quartet">The 4 Diagnostic Hallmarks</button>' +
      '<button class="preset-btn" id="p-uro">Urochordata (Ascidia)</button>' +
      '<button class="preset-btn" id="p-ceph">Cephalochordata (Branchiostoma)</button>' +
      '<button class="preset-btn" id="p-vert">Vertebrata Transition</button>';

    document.getElementById("p-quartet").onclick = function(){ setActivePreset(this); setSub("quartet"); };
    document.getElementById("p-uro").onclick = function(){ setActivePreset(this); setSub("uro"); };
    document.getElementById("p-ceph").onclick = function(){ setActivePreset(this); setSub("cephalo"); };
    document.getElementById("p-vert").onclick = function(){ setActivePreset(this); setSub("vert"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Phylum Chordata: Diagnostic Blueprint & Subphyla Progression</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">All vertebrates are chordates, but all chordates are not vertebrates.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="chGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#chGrad)" rx="10"/>';

    if(subphylum === "quartet"){
      // NCERT Fig 4.16: Diagram showing chordata characteristics
      m += '<rect x="25" y="25" width="410" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="230" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">NCERT Fig 4.16: Fundamental Chordate Plan</text>';

      // Outline body of generalized chordate
      m += '<path d="M 60,160 Q 210,90 380,140 Q 400,165 370,180 Q 280,180 250,200 L 160,200 Q 60,195 60,160 Z" fill="#0f172a" stroke="#64748b" stroke-width="2"/>';

      // 1. Nerve Cord (Dorsal, hollow) - BLUE (highest)
      m += '<path d="M 80,142 Q 215,115 365,147" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>';
      m += '<text x="210" y="110" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">1. Nerve Cord (Dorsal &amp; Hollow)</text>';
      m += '<line x1="210" y1="115" x2="210" y2="128" stroke="#38bdf8" stroke-width="1.5"/>';

      // 2. Notochord (Mesodermal rod below nerve cord) - RED
      m += '<path d="M 90,154 Q 215,130 350,158" fill="none" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>';
      m += '<text x="260" y="145" fill="#ef4444" font-size="11" font-weight="700">2. Notochord</text>';

      // 3. Pharyngeal Gill Slits - ORANGE
      for(var g = 110; g <= 170; g += 15){
        m += '<line x1="' + g + '" y1="172" x2="' + (g - 5) + '" y2="190" stroke="#f59e0b" stroke-width="4"/>';
      }
      m += '<text x="140" y="215" fill="#f59e0b" font-size="10.5" font-weight="700" text-anchor="middle">3. Gill Slits</text>';

      // 4. Anus and Post-Anal Tail - GREEN
      m += '<circle cx="250" cy="198" r="4" fill="#cbd5e1"/>';
      m += '<text x="245" y="215" fill="#cbd5e1" font-size="9" text-anchor="middle">Anus</text>';
      m += '<path d="M 255,190 Q 330,175 370,178" fill="none" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>';
      m += '<text x="330" y="215" fill="#10b981" font-size="10.5" font-weight="700" text-anchor="middle">4. Post-Anal Tail</text>';

      // Right Explanation Card
      m += '<rect x="450" y="25" width="225" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="465" y="52" fill="#38bdf8" font-size="13" font-weight="700">Chordate Diagnostic Quartet</text>';
      m += '<text x="465" y="80" fill="#cbd5e1" font-size="10.5">1. <strong style="color:#38bdf8">Notochord:</strong> Solid, flexible</text>';
      m += '<text x="465" y="96" fill="#cbd5e1" font-size="10.5">   dorsal mesodermal rod.</text>';
      m += '<text x="465" y="122" fill="#cbd5e1" font-size="10.5">2. <strong style="color:#ef4444">Dorsal Hollow Nerve Cord:</strong></text>';
      m += '<text x="465" y="138" fill="#cbd5e1" font-size="10.5">   Ectodermal; non-chordates</text>';
      m += '<text x="465" y="154" fill="#cbd5e1" font-size="10.5">   have ventral solid double cord.</text>';
      m += '<text x="465" y="180" fill="#cbd5e1" font-size="10.5">3. <strong style="color:#f59e0b">Pharyngeal Gill Slits:</strong></text>';
      m += '<text x="465" y="196" fill="#cbd5e1" font-size="10.5">   Paired lateral pharyngeal clefts.</text>';
      m += '<text x="465" y="222" fill="#cbd5e1" font-size="10.5">4. <strong style="color:#10b981">Post-Anal Tail:</strong> Extends</text>';
      m += '<text x="465" y="238" fill="#cbd5e1" font-size="10.5">   posterior to anus for propulsion.</text>';
      m += '<text x="465" y="268" fill="#fcd34d" font-size="10.5">Ventral heart + Closed circulation</text>';

    } else {
      // Protochordata vs Vertebrata comparison cards
      m += '<rect x="35" y="30" width="630" height="260" rx="8" fill="#0b1329" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="350" y="60" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">Classification of Phylum Chordata Subphyla</text>';

      var subs = [
        {
          name: "Urochordata (Tunicata)",
          col: "#ec4899",
          fate: "Notochord in Larval Tail ONLY",
          desc: "Retrogressive metamorphosis; adult loses notochord & nerve cord becomes single ganglion.",
          taxa: "Ascidia, Salpa, Doliolum"
        },
        {
          name: "Cephalochordata",
          col: "#14b8a6",
          fate: "Head to Tail, Lifelong",
          desc: "Notochord extends from anterior tip of head to posterior tail; persists throughout life.",
          taxa: "Branchiostoma (Amphioxus / Lancelet)"
        },
        {
          name: "Vertebrata (Craniata)",
          col: "#f59e0b",
          fate: "Replaced by Vertebral Column",
          desc: "Notochord during embryonic stage replaced by cartilaginous or bony vertebral column in adult.",
          taxa: "Cyclostomata, Pisces, Tetrapoda"
        }
      ];

      for(var si = 0; si < subs.length; si++){
        var sx = 55 + si * 200;
        var sData = subs[si];
        var isSel = (subphylum === "uro" && si === 0) || (subphylum === "cephalo" && si === 1) || (subphylum === "vert" && si === 2);
        m += '<rect x="' + sx + '" y="80" width="190" height="195" rx="6" fill="' + (isSel ? "#1e293b" : "#0f172a") + '" stroke="' + sData.col + '" stroke-width="' + (isSel ? "2.5" : "1.5") + '"/>';
        m += '<text x="' + (sx + 95) + '" y="105" fill="' + sData.col + '" font-size="11.5" font-weight="700" text-anchor="middle">' + sData.name + '</text>';
        m += '<rect x="' + (sx + 10) + '" y="118" width="170" height="24" rx="3" fill="#020617"/>';
        m += '<text x="' + (sx + 95) + '" y="134" fill="#fcd34d" font-size="9" font-weight="700" text-anchor="middle">' + sData.fate + '</text>';
        m += '<foreignObject x="' + (sx + 10) + '" y="148" width="170" height="65">';
        m += '<div style="color:#cbd5e1;font-size:9.5px;line-height:1.3;text-align:center;">' + sData.desc + '</div>';
        m += '</foreignObject>';
        m += '<rect x="' + (sx + 10) + '" y="222" width="170" height="42" rx="3" fill="#1e293b"/>';
        m += '<text x="' + (sx + 95) + '" y="238" fill="#94a3b8" font-size="8.5" text-anchor="middle">NCERT Key Examples:</text>';
        m += '<text x="' + (sx + 95) + '" y="253" fill="#38bdf8" font-size="9" font-weight="600" text-anchor="middle">' + sData.taxa + '</text>';
      }
    }

    svg.innerHTML = m;

    readout(
      cell("Nerve Cord Position", "Dorsal & Hollow", "#38bdf8") +
      cell("Protochordates", "Uro + Cephalochordata (Exclusively Marine)", "#ec4899") +
      cell("Vertebrate Axle", "Cartilaginous / Bony Vertebral Column", "#f59e0b") +
      cell("Heart", "Ventral Muscular Chambered", "#10b981")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Axiom:</span> ' +
      'All vertebrates are chordates because they possess a notochord during embryonic development, but not all chordates are vertebrates because protochordates never replace it with a vertebral column.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Vertebrate Heart & Class Comparative Physiology (vertebrateheart)
// -------------------------------------------------------------------------
window.SIMS.vertebrateheart = (function(){
  var vClass = "pisces"; // "pisces", "amphibia", "reptilia", "aves"

  function setV(v){ vClass = v; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#0284c7;"></span><span>Deoxygenated Blood</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#dc2626;"></span><span>Oxygenated Blood</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#9333ea;"></span><span>Mixed Blood</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Complete 4-Chambered</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pisc">Fishes (2 Chambers, Venous Heart)</button>' +
      '<button class="preset-btn" id="p-amph">Amphibia (3 Chambers, Mixed Blood)</button>' +
      '<button class="preset-btn" id="p-rept">Reptilia (Incomplete 4-Chambered)</button>' +
      '<button class="preset-btn" id="p-hom">Aves & Mammalia (4 Chambers, Double)</button>';

    document.getElementById("p-pisc").onclick = function(){ setActivePreset(this); setV("pisces"); };
    document.getElementById("p-amph").onclick = function(){ setActivePreset(this); setV("amphibia"); };
    document.getElementById("p-rept").onclick = function(){ setActivePreset(this); setV("reptilia"); };
    document.getElementById("p-hom").onclick = function(){ setActivePreset(this); setV("aves"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Vertebrate Heart Evolution & Physiology</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Progression from single circulation in Pisces to double circulation in warm-blooded homeotherms.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="vGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#vGrad)" rx="10"/>';

    // Left diagram: Heart schematic
    m += '<rect x="25" y="25" width="310" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';

    var hx = 180, hy = 160;

    if(vClass === "pisces"){
      m += '<text x="180" y="52" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">2-Chambered Heart (Single Circulation)</text>';
      // Venous heart: 1 Atrium + 1 Ventricle
      m += '<rect x="135" y="95" width="90" height="55" rx="8" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="180" y="128" fill="#e0f2fe" font-size="11" font-weight="700" text-anchor="middle">Atrium (Deox)</text>';

      m += '<polygon points="175,152 185,152 180,160" fill="#38bdf8"/>'; // valve arrow

      m += '<rect x="135" y="165" width="90" height="60" rx="8" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="180" y="200" fill="#e0f2fe" font-size="11" font-weight="700" text-anchor="middle">Ventricle (Deox)</text>';

      m += '<text x="180" y="255" fill="#fcd34d" font-size="11" font-weight="600" text-anchor="middle">Heart &rarr; Gills &rarr; Body &rarr; Heart</text>';
      m += '<text x="180" y="275" fill="#94a3b8" font-size="10" text-anchor="middle">Only deoxygenated blood passes through heart</text>';

    } else if(vClass === "amphibia"){
      m += '<text x="180" y="52" fill="#a855f7" font-size="13" font-weight="700" text-anchor="middle">3-Chambered Heart (Incomplete Double)</text>';
      // 2 Atria + 1 Ventricle
      m += '<rect x="90" y="95" width="80" height="55" rx="8" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="130" y="128" fill="#e0f2fe" font-size="10" font-weight="700" text-anchor="middle">Right Atrium</text>';

      m += '<rect x="190" y="95" width="80" height="55" rx="8" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>';
      m += '<text x="230" y="128" fill="#fee2e2" font-size="10" font-weight="700" text-anchor="middle">Left Atrium</text>';

      // Single Ventricle (mixed)
      m += '<rect x="115" y="165" width="130" height="60" rx="8" fill="#581c87" stroke="#c084fc" stroke-width="2"/>';
      m += '<text x="180" y="195" fill="#f3e8ff" font-size="11" font-weight="700" text-anchor="middle">Single Ventricle</text>';
      m += '<text x="180" y="210" fill="#e9d5ff" font-size="9" text-anchor="middle">(Blood mixes here)</text>';

      m += '<text x="180" y="255" fill="#fcd34d" font-size="11" font-weight="600" text-anchor="middle">2 Atria + 1 Common Ventricle</text>';
      m += '<text x="180" y="275" fill="#94a3b8" font-size="10" text-anchor="middle">Respiration: Moist skin, Lungs, Buccal cavity</text>';

    } else if(vClass === "reptilia"){
      m += '<text x="180" y="52" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">Incomplete 4-Chambered Heart</text>';
      // 2 Atria + Partially divided Ventricle
      m += '<rect x="90" y="95" width="80" height="55" rx="8" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="130" y="128" fill="#e0f2fe" font-size="10" font-weight="700" text-anchor="middle">Right Atrium</text>';

      m += '<rect x="190" y="95" width="80" height="55" rx="8" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>';
      m += '<text x="230" y="128" fill="#fee2e2" font-size="10" font-weight="700" text-anchor="middle">Left Atrium</text>';

      // Ventricle with partial septum
      m += '<rect x="115" y="165" width="130" height="60" rx="8" fill="#701a75" stroke="#f472b6" stroke-width="2"/>';
      m += '<line x1="180" y1="180" x2="180" y2="225" stroke="#fcd34d" stroke-width="3" stroke-dasharray="3,2"/>';
      m += '<text x="180" y="180" fill="#fbcfe8" font-size="10" font-weight="700" text-anchor="middle">Partial Septum</text>';

      m += '<text x="180" y="255" fill="#f43f5e" font-size="10.5" font-weight="700" text-anchor="middle">Exception: Crocodile has 4 Chambers!</text>';
      m += '<text x="180" y="275" fill="#94a3b8" font-size="10" text-anchor="middle">Poikilotherms (Cold-blooded) with epidermal scales</text>';

    } else {
      m += '<text x="180" y="52" fill="#10b981" font-size="13" font-weight="700" text-anchor="middle">4-Chambered Heart (Double Circulation)</text>';
      // 2 Atria + 2 Ventricles completely partitioned
      m += '<rect x="90" y="95" width="80" height="55" rx="6" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="130" y="128" fill="#e0f2fe" font-size="10" font-weight="700" text-anchor="middle">Right Atrium</text>';

      m += '<rect x="190" y="95" width="80" height="55" rx="6" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>';
      m += '<text x="230" y="128" fill="#fee2e2" font-size="10" font-weight="700" text-anchor="middle">Left Atrium</text>';

      m += '<rect x="90" y="160" width="80" height="60" rx="6" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="130" y="195" fill="#e0f2fe" font-size="10" font-weight="700" text-anchor="middle">Right Ventricle</text>';

      m += '<rect x="190" y="160" width="80" height="60" rx="6" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>';
      m += '<text x="230" y="195" fill="#fee2e2" font-size="10" font-weight="700" text-anchor="middle">Left Ventricle</text>';

      // Complete septum
      m += '<line x1="180" y1="95" x2="180" y2="220" stroke="#fcd34d" stroke-width="4"/>';

      m += '<text x="180" y="255" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">Complete Separation of Oxygenated Blood</text>';
      m += '<text x="180" y="275" fill="#fcd34d" font-size="10" text-anchor="middle">Homeotherms (Warm-blooded, High Metabolism)</text>';
    }

    // Right Explanation / Class Details
    m += '<rect x="350" y="25" width="325" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';

    if(vClass === "pisces"){
      m += '<text x="370" y="52" fill="#38bdf8" font-size="13" font-weight="700">Chondrichthyes vs Osteichthyes</text>';
      m += '<text x="370" y="80" fill="#cbd5e1" font-size="10.5">• <strong>Chondrichthyes (Cartilaginous):</strong></text>';
      m += '<text x="370" y="96" fill="#94a3b8" font-size="10">  - Placoid scales, ventral mouth</text>';
      m += '<text x="370" y="112" fill="#94a3b8" font-size="10">  - No operculum; no air bladder (swim constantly)</text>';
      m += '<text x="370" y="128" fill="#94a3b8" font-size="10">  - Claspers in males; viviparous (Scoliodon)</text>';
      m += '<text x="370" y="152" fill="#cbd5e1" font-size="10.5">• <strong>Osteichthyes (Bony Fishes):</strong></text>';
      m += '<text x="370" y="168" fill="#94a3b8" font-size="10">  - Cycloid / ctenoid scales, terminal mouth</text>';
      m += '<text x="370" y="184" fill="#94a3b8" font-size="10">  - 4 pairs of gills with operculum</text>';
      m += '<text x="370" y="200" fill="#94a3b8" font-size="10">  - Air bladder regulates buoyancy; mostly oviparous</text>';
      m += '<text x="370" y="216" fill="#94a3b8" font-size="10">  - Labeo, Catla, Clarias, Betta, Hippocampus</text>';
      m += '<text x="370" y="250" fill="#fcd34d" font-size="10.5">Venous heart pumps deoxygenated blood to gills</text>';

    } else if(vClass === "amphibia"){
      m += '<text x="370" y="52" fill="#a855f7" font-size="13" font-weight="700">Class Amphibia Key Adaptations</text>';
      m += '<text x="370" y="80" fill="#cbd5e1" font-size="10.5">• <strong>Dual Habitat:</strong> Aquatic &amp; terrestrial life.</text>';
      m += '<text x="370" y="105" fill="#cbd5e1" font-size="10.5">• <strong>Skin:</strong> Moist without scales; cutaneous respiration.</text>';
      m += '<text x="370" y="130" fill="#cbd5e1" font-size="10.5">• <strong>Sensory:</strong> Tympanum represents ear.</text>';
      m += '<text x="370" y="155" fill="#cbd5e1" font-size="10.5">• <strong>Cloaca:</strong> Common chamber into which</text>';
      m += '<text x="370" y="171" fill="#cbd5e1" font-size="10.5">  alimentary, urinary, and reproductive ducts open.</text>';
      m += '<text x="370" y="196" fill="#cbd5e1" font-size="10.5">• <strong>Reproduction:</strong> External fertilisation in water;</text>';
      m += '<text x="370" y="212" fill="#cbd5e1" font-size="10.5">  indirect development with tadpole larva.</text>';
      m += '<text x="370" y="245" fill="#fcd34d" font-size="10.5">NCERT Examples: Bufo, Rana, Hyla, Salamandra, Ichthyophis</text>';

    } else if(vClass === "reptilia"){
      m += '<text x="370" y="52" fill="#f59e0b" font-size="13" font-weight="700">Class Reptilia: True Land Vertebrates</text>';
      m += '<text x="370" y="80" fill="#cbd5e1" font-size="10.5">• <strong>Creeping/Crawling:</strong> Latin &ldquo;repere&rdquo; to crawl.</text>';
      m += '<text x="370" y="105" fill="#cbd5e1" font-size="10.5">• <strong>Dry Integument:</strong> Cornified skin with</text>';
      m += '<text x="370" y="121" fill="#cbd5e1" font-size="10.5">  epidermal scales or scutes (waterproof).</text>';
      m += '<text x="370" y="146" fill="#cbd5e1" font-size="10.5">• <strong>Ecdysis:</strong> Snakes &amp; lizards shed skin cast.</text>';
      m += '<text x="370" y="171" fill="#cbd5e1" font-size="10.5">• <strong>Amniote Egg:</strong> Shelled cleidoic eggs laid on land.</text>';
      m += '<text x="370" y="196" fill="#cbd5e1" font-size="10.5">• <strong>Circulation:</strong> 3-chambered heart (ventricle</text>';
      m += '<text x="370" y="212" fill="#cbd5e1" font-size="10.5">  partially divided); <strong>4-chambered in Crocodiles</strong>.</text>';
      m += '<text x="370" y="245" fill="#fcd34d" font-size="10.5">Chelone, Testudo, Chameleon, Calotes, Naja, Vipera</text>';

    } else {
      m += '<text x="370" y="52" fill="#10b981" font-size="13" font-weight="700">Class Aves & Mammalia: Homeothermy</text>';
      m += '<text x="370" y="80" fill="#cbd5e1" font-size="10.5">• <strong>Class Aves (Birds):</strong></text>';
      m += '<text x="370" y="96" fill="#94a3b8" font-size="10">  - Feathers, pneumatic bones (air cavities)</text>';
      m += '<text x="370" y="112" fill="#94a3b8" font-size="10">  - Crop &amp; gizzard in digestive tract</text>';
      m += '<text x="370" y="128" fill="#94a3b8" font-size="10">  - Lungs with supplementary air sacs</text>';
      m += '<text x="370" y="152" fill="#cbd5e1" font-size="10.5">• <strong>Class Mammalia:</strong></text>';
      m += '<text x="370" y="168" fill="#94a3b8" font-size="10">  - Mammary glands to nourish young with milk</text>';
      m += '<text x="370" y="184" fill="#94a3b8" font-size="10">  - Hair on body, external ear pinna</text>';
      m += '<text x="370" y="200" fill="#94a3b8" font-size="10">  - Heterodont, thecodont, diphyodont dentition</text>';
      m += '<text x="370" y="216" fill="#94a3b8" font-size="10">  - Oviparous: Ornithorhynchus (Platypus)</text>';
      m += '<text x="370" y="245" fill="#fcd34d" font-size="10.5">High metabolic rates sustained by complete double circulation</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Vertebrate Class", vClass === "pisces" ? "Pisces (Fish)" : (vClass === "amphibia" ? "Amphibia" : (vClass === "reptilia" ? "Reptilia" : "Aves & Mammalia")), "#38bdf8") +
      cell("Chamber Count", vClass === "pisces" ? "2 Chambers" : (vClass === "amphibia" ? "3 Chambers" : (vClass === "reptilia" ? "3 Chambers (Croc: 4)" : "4 Chambers")), "#10b981") +
      cell("Thermoregulation", (vClass === "aves") ? "Homeotherm (Warm)" : "Poikilotherm (Cold)", (vClass === "aves") ? "#ef4444" : "#0284c7") +
      cell("Circulation Type", vClass === "pisces" ? "Single Circulation" : (vClass === "aves" ? "Complete Double" : "Incomplete Double"), "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Evolutionary Rule:</span> ' +
      (vClass === "pisces" ? "Fishes have a two-chambered venous heart with single circulation, pumping deoxygenated blood to gills for aeration." :
       (vClass === "amphibia" ? "Amphibians have a three-chambered heart where oxygenated and deoxygenated blood mix in a single ventricle." :
        (vClass === "reptilia" ? "Reptiles possess an incomplete four-chambered heart with a partial septum, except crocodiles which have four chambers." :
         "Birds and mammals possess a four-chambered heart with complete separation of oxygenated and deoxygenated circuits, powering homeothermy.")))
    );
  }

  return { mount: mount, draw: draw };
})();
