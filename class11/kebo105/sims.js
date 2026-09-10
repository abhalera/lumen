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
// 1. SIMULATION 1: Root Apex Zonation & Root Types (rootzonelab)
// -------------------------------------------------------------------------
window.SIMS.rootzonelab = (function(){
  var rMode = "zonation"; // "zonation", "tap", "fibrous", "adventitious"
  var zHighlight = "maturation"; // "cap", "meristem", "elongation", "maturation"

  function setM(m){ rMode = m; draw(0); }
  function setZ(z){ zHighlight = z; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Root Cap</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Meristematic Zone</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Elongation Zone</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Maturation &amp; Root Hairs</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-zone">Root Tip Zonation</button>' +
      '<button class="preset-btn" id="p-tap">Tap Root System (Mustard)</button>' +
      '<button class="preset-btn" id="p-fib">Fibrous Root (Wheat)</button>' +
      '<button class="preset-btn" id="p-adv">Adventitious Root (Banyan/Monstera)</button>';

    document.getElementById("p-zone").onclick = function(){ setActivePreset(this); setM("zonation"); };
    document.getElementById("p-tap").onclick = function(){ setActivePreset(this); setM("tap"); };
    document.getElementById("p-fib").onclick = function(){ setActivePreset(this); setM("fibrous"); };
    document.getElementById("p-adv").onclick = function(){ setActivePreset(this); setM("adventitious"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Select Zonation Focus</label>' +
        '<select id="zone-sel" class="control-select" style="background:#1e293b;color:#f8fafc;padding:6px;border-radius:6px;border:1px solid #475569;width:100%;">' +
          '<option value="maturation" selected>Region of Maturation (Root Hairs)</option>' +
          '<option value="elongation">Region of Elongation (Cell Lengthening)</option>' +
          '<option value="meristem">Region of Meristematic Activity (Mitosis)</option>' +
          '<option value="cap">Root Cap (Thimble Shield)</option>' +
        '</select>' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Root Morphological Architecture</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Zonation from apical meristem to differentiated absorptive tissues.</div>' +
      '</div>';

    var sel = document.getElementById("zone-sel");
    if(sel){
      sel.onchange = function(){ setZ(this.value); };
    }

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="rootBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#rootBg)" rx="10"/>';

    if(rMode === "zonation"){
      // Root Tip Diagram on Left (x: 30 to 320)
      m += '<rect x="25" y="25" width="310" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="180" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">NCERT Fig 5.3: Regions of the Root</text>';

      var cx = 180;
      // Zone of Maturation (top: y 65 to 145)
      var isMat = (zHighlight === "maturation");
      m += '<rect x="145" y="65" width="70" height="80" fill="' + (isMat ? "#065f46" : "#0f766e") + '" stroke="#10b981" stroke-width="' + (isMat ? 2.5 : 1) + '"/>';
      // Root hairs on both sides
      for(var rh = 70; rh <= 140; rh += 10){
        // Left hair
        m += '<line x1="145" y1="' + rh + '" x2="95" y2="' + rh + '" stroke="#a7f3d0" stroke-width="2"/>';
        // Right hair
        m += '<line x1="215" y1="' + rh + '" x2="265" y2="' + rh + '" stroke="#a7f3d0" stroke-width="2"/>';
      }
      m += '<text x="75" y="105" fill="#34d399" font-size="10" font-weight="700" text-anchor="end">Root Hairs</text>';
      m += '<text x="275" y="105" fill="#34d399" font-size="10.5" font-weight="700">Maturation</text>';

      // Zone of Elongation (y 145 to 205)
      var isElo = (zHighlight === "elongation");
      m += '<rect x="148" y="145" width="64" height="60" fill="' + (isElo ? "#0369a1" : "#0284c7") + '" stroke="#38bdf8" stroke-width="' + (isElo ? 2.5 : 1) + '"/>';
      m += '<text x="225" y="178" fill="#38bdf8" font-size="10.5" font-weight="700">Elongation</text>';

      // Zone of Meristematic Activity (y 205 to 235)
      var isMer = (zHighlight === "meristem");
      m += '<rect x="152" y="205" width="56" height="30" fill="' + (isMer ? "#b91c1c" : "#991b1b") + '" stroke="#ef4444" stroke-width="' + (isMer ? 2.5 : 1) + '"/>';
      m += '<text x="225" y="222" fill="#f87171" font-size="10.5" font-weight="700">Meristematic</text>';

      // Root Cap (thimble shield at bottom: y 235 to 265)
      var isCap = (zHighlight === "cap");
      m += '<path d="M 152,235 Q 180,270 208,235 Z" fill="' + (isCap ? "#d97706" : "#b45309") + '" stroke="#f59e0b" stroke-width="' + (isCap ? 2.5 : 1) + '"/>';
      m += '<text x="225" y="255" fill="#f59e0b" font-size="10.5" font-weight="700">Root Cap</text>';

      // Right Explanation Card
      m += '<rect x="355" y="25" width="320" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      if(zHighlight === "maturation"){
        m += '<text x="375" y="55" fill="#10b981" font-size="13" font-weight="700">Region of Maturation (Zone of Differentiation)</text>';
        m += '<text x="375" y="85" fill="#cbd5e1" font-size="11">• Proximal to the region of elongation.</text>';
        m += '<text x="375" y="110" fill="#cbd5e1" font-size="11">• Cells undergo cellular differentiation into permanent</text>';
        m += '<text x="375" y="127" fill="#cbd5e1" font-size="11">  xylem, phloem, cortex, and endodermis.</text>';
        m += '<text x="375" y="152" fill="#cbd5e1" font-size="11">• Epidermal cells produce fine, delicate, thread-like</text>';
        m += '<text x="375" y="169" fill="#10b981" font-size="11.5" font-weight="700">  Root Hairs for water &amp; mineral absorption.</text>';
        m += '<text x="375" y="195" fill="#cbd5e1" font-size="11">• Confined here because forward soil shearing in</text>';
        m += '<text x="375" y="212" fill="#cbd5e1" font-size="11">  elongation zone would rip hairs off.</text>';
        m += '<text x="375" y="245" fill="#fcd34d" font-size="10.5">Primary water and nutrient uptake organ</text>';
      } else if(zHighlight === "elongation"){
        m += '<text x="375" y="55" fill="#38bdf8" font-size="13" font-weight="700">Region of Elongation</text>';
        m += '<text x="375" y="85" fill="#cbd5e1" font-size="11">• Located immediately above the meristematic zone.</text>';
        m += '<text x="375" y="110" fill="#cbd5e1" font-size="11">• Cells undergo rapid enlargement, vacuolation, and</text>';
        m += '<text x="375" y="127" fill="#cbd5e1" font-size="11">  longitudinal lengthening.</text>';
        m += '<text x="375" y="152" fill="#cbd5e1" font-size="11.5" font-weight="700" style="color:#38bdf8">• Directly responsible for root growth in length.</text>';
        m += '<text x="375" y="177" fill="#cbd5e1" font-size="11">• Pushes root tip downwards into the soil profile.</text>';
        m += '<text x="375" y="245" fill="#fcd34d" font-size="10.5">Motor for longitudinal downward soil penetration</text>';
      } else if(zHighlight === "meristem"){
        m += '<text x="375" y="55" fill="#ef4444" font-size="13" font-weight="700">Region of Meristematic Activity (Root Apex)</text>';
        m += '<text x="375" y="85" fill="#cbd5e1" font-size="11">• Located a few millimetres above the root cap.</text>';
        m += '<text x="375" y="110" fill="#cbd5e1" font-size="11">• Cells are extremely small, thin-walled, with</text>';
        m += '<text x="375" y="127" fill="#cbd5e1" font-size="11">  dense protoplasm and prominent nuclei.</text>';
        m += '<text x="375" y="152" fill="#cbd5e1" font-size="11">• Divide repeatedly by mitosis to generate cells for</text>';
        m += '<text x="375" y="169" fill="#cbd5e1" font-size="11">  both the forward root cap and the rearward body.</text>';
        m += '<text x="375" y="245" fill="#fcd34d" font-size="10.5">Stem-cell niche of the underground plant axis</text>';
      } else {
        m += '<text x="375" y="55" fill="#f59e0b" font-size="13" font-weight="700">Root Cap (Calyptra)</text>';
        m += '<text x="375" y="85" fill="#cbd5e1" font-size="11">• Thimble-like parenchymatous protective covering.</text>';
        m += '<text x="375" y="110" fill="#cbd5e1" font-size="11">• Protects the tender apical meristem as the root</text>';
        m += '<text x="375" y="127" fill="#cbd5e1" font-size="11">  forces its way through abrasive soil grains.</text>';
        m += '<text x="375" y="152" fill="#cbd5e1" font-size="11">• Secretes mucilage to lubricate the root path.</text>';
        m += '<text x="375" y="177" fill="#cbd5e1" font-size="11">• Contains statoliths for gravitropism sensing.</text>';
        m += '<text x="375" y="245" fill="#fcd34d" font-size="10.5">Absent in aquatic plants (replaced by root pockets)</text>';
      }

    } else {
      // Root System Types (Tap vs Fibrous vs Adventitious)
      m += '<rect x="25" y="25" width="650" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      var rTitle = (rMode === "tap" ? "Tap Root System (Dicotyledonous Archetype: Mustard)" :
                    (rMode === "fibrous" ? "Fibrous Root System (Monocotyledonous Archetype: Wheat)" :
                     "Adventitious Root System (Non-Radicle Origin: Banyan, Monstera, Grass)"));
      m += '<text x="350" y="52" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">' + rTitle + '</text>';

      if(rMode === "tap"){
        // Tap root schematic
        m += '<rect x="50" y="70" width="220" height="200" rx="6" fill="#0f172a"/>';
        m += '<line x1="70" y1="90" x2="250" y2="90" stroke="#78350f" stroke-width="3"/>'; // soil line
        m += '<line x1="160" y1="90" x2="160" y2="245" stroke="#f59e0b" stroke-width="5"/>'; // primary tap
        // Secondary laterals
        m += '<line x1="160" y1="120" x2="110" y2="150" stroke="#fbbf24" stroke-width="2.5"/>';
        m += '<line x1="160" y1="140" x2="215" y2="175" stroke="#fbbf24" stroke-width="2.5"/>';
        m += '<line x1="160" y1="170" x2="120" y2="205" stroke="#fbbf24" stroke-width="2"/>';
        m += '<line x1="160" y1="195" x2="200" y2="225" stroke="#fbbf24" stroke-width="2"/>';
        m += '<text x="160" y="260" fill="#fcd34d" font-size="10.5" font-weight="700" text-anchor="middle">Primary Tap Root + Laterals</text>';

        // Right details
        m += '<rect x="290" y="70" width="360" height="200" rx="6" fill="#0b1329"/>';
        m += '<text x="310" y="98" fill="#10b981" font-size="12" font-weight="700">Tap Root Morphological Hallmarks</text>';
        m += '<text x="310" y="125" fill="#cbd5e1" font-size="11">• Originates by direct elongation of embryonic <strong>radicle</strong>.</text>';
        m += '<text x="310" y="150" fill="#cbd5e1" font-size="11">• Persists throughout plant life as prominent primary root.</text>';
        m += '<text x="310" y="175" fill="#cbd5e1" font-size="11">• Bears lateral roots of several orders in acropetal succession</text>';
        m += '<text x="310" y="192" fill="#cbd5e1" font-size="11">  (secondary, tertiary roots).</text>';
        m += '<text x="310" y="222" fill="#fcd34d" font-size="11">NCERT Representative: Mustard (Brassica), Dicotyledons</text>';

      } else if(rMode === "fibrous"){
        // Fibrous root schematic
        m += '<rect x="50" y="70" width="220" height="200" rx="6" fill="#0f172a"/>';
        m += '<line x1="70" y1="90" x2="250" y2="90" stroke="#78350f" stroke-width="3"/>'; // soil line
        m += '<rect x="155" y="70" width="10" height="20" fill="#15803d"/>'; // stem base
        // Cluster of roots from stem base
        var angles = [-50, -35, -20, -10, 5, 20, 35, 50];
        for(var fi = 0; fi < angles.length; fi++){
          var rad = (90 + angles[fi]) * Math.PI / 180;
          var fx = 160 + Math.cos(rad) * 130;
          var fy = 90 + Math.sin(rad) * 130;
          m += '<line x1="160" y1="90" x2="' + fx + '" y2="' + fy + '" stroke="#38bdf8" stroke-width="2"/>';
        }
        m += '<text x="160" y="260" fill="#38bdf8" font-size="10.5" font-weight="700" text-anchor="middle">Stem-Base Cluster</text>';

        // Right details
        m += '<rect x="290" y="70" width="360" height="200" rx="6" fill="#0b1329"/>';
        m += '<text x="310" y="98" fill="#38bdf8" font-size="12" font-weight="700">Fibrous Root Morphological Hallmarks</text>';
        m += '<text x="310" y="125" fill="#cbd5e1" font-size="11">• Primary root derived from radicle is <strong>short-lived</strong>.</text>';
        m += '<text x="310" y="150" fill="#cbd5e1" font-size="11">• Replaced by a large cluster of thin, thread-like roots</text>';
        m += '<text x="310" y="167" fill="#cbd5e1" font-size="11">  originating from the <strong>base of the stem</strong>.</text>';
        m += '<text x="310" y="195" fill="#cbd5e1" font-size="11">• Shallow soil penetration, excellent surface binding.</text>';
        m += '<text x="310" y="222" fill="#fcd34d" font-size="11">NCERT Representative: Wheat (Triticum), Monocotyledons</text>';

      } else {
        // Adventitious root schematic
        m += '<rect x="50" y="70" width="220" height="200" rx="6" fill="#0f172a"/>';
        m += '<line x1="70" y1="180" x2="250" y2="180" stroke="#78350f" stroke-width="3"/>'; // soil line
        m += '<rect x="90" y="80" width="140" height="16" rx="3" fill="#854d0e"/>'; // banyan horizontal branch
        // Prop roots descending
        m += '<line x1="120" y1="96" x2="120" y2="230" stroke="#ec4899" stroke-width="3.5"/>';
        m += '<line x1="160" y1="96" x2="160" y2="230" stroke="#ec4899" stroke-width="4"/>';
        m += '<line x1="200" y1="96" x2="200" y2="230" stroke="#ec4899" stroke-width="3.5"/>';
        m += '<text x="160" y="260" fill="#ec4899" font-size="10.5" font-weight="700" text-anchor="middle">Prop Roots from Aerial Branches</text>';

        // Right details
        m += '<rect x="290" y="70" width="360" height="200" rx="6" fill="#0b1329"/>';
        m += '<text x="310" y="98" fill="#ec4899" font-size="12" font-weight="700">Adventitious Root Architecture</text>';
        m += '<text x="310" y="125" fill="#cbd5e1" font-size="11">• Roots that arise from plant parts <strong>other than the radicle</strong>.</text>';
        m += '<text x="310" y="150" fill="#cbd5e1" font-size="11">• Arise from stem nodes, internodes, or aerial branches.</text>';
        m += '<text x="310" y="175" fill="#cbd5e1" font-size="11">• Specialized functional adaptations:</text>';
        m += '<text x="310" y="195" fill="#38bdf8" font-size="10.5">  - Pillar-like <strong>Prop Roots:</strong> Banyan tree (Ficus)</text>';
        m += '<text x="310" y="212" fill="#38bdf8" font-size="10.5">  - <strong>Stilt Roots:</strong> Maize &amp; Sugarcane stem nodes</text>';
        m += '<text x="310" y="240" fill="#fcd34d" font-size="11">NCERT Representatives: Grass, Monstera, Banyan tree</text>';
      }
    }

    svg.innerHTML = m;

    readout(
      cell("Root System", rMode === "zonation" ? "Apex Zonation" : (rMode === "tap" ? "Tap Root" : (rMode === "fibrous" ? "Fibrous" : "Adventitious")), "#38bdf8") +
      cell("Active Focus", rMode === "zonation" ? zHighlight.toUpperCase() : "Morphology", "#10b981") +
      cell("Absorptive Hairs", (rMode === "zonation" && zHighlight === "maturation") ? "PRESENT" : "RESTRICTED", "#f59e0b") +
      cell("Archetype", rMode === "tap" ? "Mustard (Dicot)" : (rMode === "fibrous" ? "Wheat (Monocot)" : "Banyan / Grass"), "#fcd34d")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Diagnostic Rule:</span> ' +
      (rMode === "zonation" ? "Root hairs arise exclusively from the zone of maturation to prevent shear damage during elongation through abrasive soil." :
       (rMode === "tap" ? "Tap root system develops directly from the embryonic radicle and persists throughout dicot life." :
        (rMode === "fibrous" ? "Fibrous root system originates from the base of the stem after early radicular tap root senescence." :
         "Adventitious roots originate from non-radicular shoot structures like nodes and aerial branches.")))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Phyllotaxy & Leaf Architecture (phyllotaxylab)
// -------------------------------------------------------------------------
window.SIMS.phyllotaxylab = (function(){
  var pType = "alternate"; // "alternate", "opposite", "whorled", "compound"

  function setP(p){ pType = p; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Stem Axis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Leaves / Leaflets</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Axillary Bud</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-alt">Alternate (China Rose/Mustard)</button>' +
      '<button class="preset-btn" id="p-opp">Opposite (Calotropis/Guava)</button>' +
      '<button class="preset-btn" id="p-whorl">Whorled (Alstonia)</button>' +
      '<button class="preset-btn" id="p-comp">Compound: Pinnate vs Palmate</button>';

    document.getElementById("p-alt").onclick = function(){ setActivePreset(this); setP("alternate"); };
    document.getElementById("p-opp").onclick = function(){ setActivePreset(this); setP("opposite"); };
    document.getElementById("p-whorl").onclick = function(){ setActivePreset(this); setP("whorled"); };
    document.getElementById("p-comp").onclick = function(){ setActivePreset(this); setP("compound"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Leaf Placement &amp; Blade Partitioning Lab</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Spatial distribution of leaves at nodes to optimize solar illumination and prevent mutual shading.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="leafBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#leafBg)" rx="10"/>';

    if(pType === "compound"){
      // Pinnate vs Palmate side-by-side
      m += '<rect x="25" y="25" width="650" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="350" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">NCERT Fig 5.8: Compound Leaf Architecture</text>';

      // Left: Pinnately Compound (Neem)
      m += '<rect x="45" y="68" width="285" height="210" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="187" y="92" fill="#10b981" font-size="12" font-weight="700" text-anchor="middle">Pinnately Compound (e.g. Neem)</text>';
      // Main rachis
      m += '<line x1="187" y1="260" x2="187" y2="110" stroke="#059669" stroke-width="4"/>';
      m += '<circle cx="187" cy="255" r="4" fill="#f59e0b"/>'; // axillary bud at petiole base
      m += '<text x="175" y="258" fill="#fcd34d" font-size="8.5" text-anchor="end">Axillary Bud</text>';
      // Leaflets on rachis
      for(var py = 130; py <= 220; py += 30){
        m += '<ellipse cx="150" cy="' + py + '" rx="25" ry="10" fill="#047857" stroke="#34d399" stroke-width="1.5" transform="rotate(-15 150 ' + py + ')"/>';
        m += '<ellipse cx="224" cy="' + py + '" rx="25" ry="10" fill="#047857" stroke="#34d399" stroke-width="1.5" transform="rotate(15 224 ' + py + ')"/>';
      }
      // Terminal leaflet
      m += '<ellipse cx="187" cy="115" rx="10" ry="20" fill="#047857" stroke="#34d399" stroke-width="1.5"/>';
      m += '<text x="187" y="270" fill="#cbd5e1" font-size="10" text-anchor="middle">Leaflets along extended Rachis</text>';

      // Right: Palmately Compound (Silk Cotton)
      m += '<rect x="365" y="68" width="285" height="210" rx="6" fill="#0b1329" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="507" y="92" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">Palmately Compound (e.g. Silk Cotton)</text>';
      // Petiole
      m += '<line x1="507" y1="260" x2="507" y2="185" stroke="#0284c7" stroke-width="4"/>';
      m += '<circle cx="507" cy="255" r="4" fill="#f59e0b"/>'; // axillary bud at petiole base
      m += '<text x="495" y="258" fill="#fcd34d" font-size="8.5" text-anchor="end">Axillary Bud</text>';
      // 5 leaflets radiating from tip of petiole
      var pAngles = [-60, -30, 0, 30, 60];
      for(var i = 0; i < 5; i++){
        var rot = pAngles[i];
        m += '<ellipse cx="507" cy="140" rx="12" ry="32" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5" transform="rotate(' + rot + ' 507 185)"/>';
      }
      m += '<circle cx="507" cy="185" r="5" fill="#f59e0b"/>';
      m += '<text x="507" y="270" fill="#cbd5e1" font-size="10" text-anchor="middle">Leaflets attached at single petiole tip</text>';

    } else {
      // Phyllotaxy modes (Alternate, Opposite, Whorled)
      m += '<rect x="25" y="25" width="310" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="180" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">Stem Node Architecture</text>';

      // Central stem axis
      m += '<line x1="180" y1="270" x2="180" y2="65" stroke="#15803d" stroke-width="8" stroke-linecap="round"/>';

      if(pType === "alternate"){
        // Alternate: 1 leaf per node, zigzag
        var altNodes = [
          { y: 220, side: "left" },
          { y: 170, side: "right" },
          { y: 120, side: "left" },
          { y: 75, side: "right" }
        ];
        for(var a = 0; a < altNodes.length; a++){
          var an = altNodes[a];
          m += '<circle cx="180" cy="' + an.y + '" r="6" fill="#fcd34d"/>'; // node
          if(an.side === "left"){
            m += '<ellipse cx="125" cy="' + (an.y - 10) + '" rx="40" ry="14" fill="#047857" stroke="#34d399" stroke-width="2" transform="rotate(-15 125 ' + an.y + ')"/>';
            m += '<circle cx="170" cy="' + (an.y - 6) + '" r="3" fill="#f59e0b"/>'; // bud
          } else {
            m += '<ellipse cx="235" cy="' + (an.y - 10) + '" rx="40" ry="14" fill="#047857" stroke="#34d399" stroke-width="2" transform="rotate(15 235 ' + an.y + ')"/>';
            m += '<circle cx="190" cy="' + (an.y - 6) + '" r="3" fill="#f59e0b"/>';
          }
        }
        m += '<text x="180" y="285" fill="#fcd34d" font-size="11" font-weight="700" text-anchor="middle">1 Leaf per Node (Alternate)</text>';

      } else if(pType === "opposite"){
        // Opposite: pair of leaves per node
        var oppNodes = [220, 150, 85];
        for(var o = 0; o < oppNodes.length; o++){
          var oy = oppNodes[o];
          m += '<circle cx="180" cy="' + oy + '" r="6" fill="#fcd34d"/>';
          // Left leaf
          m += '<ellipse cx="125" cy="' + oy + '" rx="42" ry="15" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
          // Right leaf
          m += '<ellipse cx="235" cy="' + oy + '" rx="42" ry="15" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
          // Axillary buds
          m += '<circle cx="170" cy="' + (oy - 5) + '" r="3" fill="#f59e0b"/>';
          m += '<circle cx="190" cy="' + (oy - 5) + '" r="3" fill="#f59e0b"/>';
        }
        m += '<text x="180" y="285" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">2 Leaves per Node (Opposite)</text>';

      } else {
        // Whorled: 3+ leaves per node in circle
        var whorlNodes = [200, 110];
        for(var w = 0; w < whorlNodes.length; w++){
          var wy = whorlNodes[w];
          m += '<circle cx="180" cy="' + wy + '" r="8" fill="#fcd34d"/>';
          m += '<ellipse cx="125" cy="' + (wy - 15) + '" rx="40" ry="12" fill="#7c3aed" stroke="#c084fc" stroke-width="2" transform="rotate(-25 125 ' + wy + ')"/>';
          m += '<ellipse cx="235" cy="' + (wy - 15) + '" rx="40" ry="12" fill="#7c3aed" stroke="#c084fc" stroke-width="2" transform="rotate(25 235 ' + wy + ')"/>';
          m += '<ellipse cx="180" cy="' + (wy - 35) + '" rx="12" ry="30" fill="#7c3aed" stroke="#c084fc" stroke-width="2"/>';
          m += '<ellipse cx="135" cy="' + (wy + 15) + '" rx="35" ry="11" fill="#7c3aed" stroke="#c084fc" stroke-width="2" transform="rotate(20 135 ' + wy + ')"/>';
          m += '<ellipse cx="225" cy="' + (wy + 15) + '" rx="35" ry="11" fill="#7c3aed" stroke="#c084fc" stroke-width="2" transform="rotate(-20 225 ' + wy + ')"/>';
        }
        m += '<text x="180" y="285" fill="#c084fc" font-size="11" font-weight="700" text-anchor="middle">&gt; 2 Leaves per Node (Whorled)</text>';
      }

      // Right Explanation Box
      m += '<rect x="355" y="25" width="320" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      if(pType === "alternate"){
        m += '<text x="375" y="55" fill="#fcd34d" font-size="13" font-weight="700">Alternate Phyllotaxy</text>';
        m += '<text x="375" y="85" fill="#cbd5e1" font-size="11">• <strong>Rule:</strong> A single leaf arises at each node</text>';
        m += '<text x="375" y="102" fill="#cbd5e1" font-size="11">  in an alternating, spiral sequence.</text>';
        m += '<text x="375" y="130" fill="#cbd5e1" font-size="11">• <strong>Geometry:</strong> Minimizes self-shading by</text>';
        m += '<text x="375" y="147" fill="#cbd5e1" font-size="11">  rotating successive leaf azimuths.</text>';
        m += '<text x="375" y="180" fill="#10b981" font-size="12" font-weight="700">NCERT Master Examples:</text>';
        m += '<text x="375" y="205" fill="#f8fafc" font-size="11">1. China Rose (<em>Hibiscus rosa-sinensis</em>)</text>';
        m += '<text x="375" y="225" fill="#f8fafc" font-size="11">2. Mustard (<em>Brassica campestris</em>)</text>';
        m += '<text x="375" y="245" fill="#f8fafc" font-size="11">3. Sunflower (<em>Helianthus annuus</em>)</text>';
      } else if(pType === "opposite"){
        m += '<text x="375" y="55" fill="#38bdf8" font-size="13" font-weight="700">Opposite Phyllotaxy</text>';
        m += '<text x="375" y="85" fill="#cbd5e1" font-size="11">• <strong>Rule:</strong> A pair of leaves arises at each node</text>';
        m += '<text x="375" y="102" fill="#cbd5e1" font-size="11">  lying directly opposite to each other.</text>';
        m += '<text x="375" y="130" fill="#cbd5e1" font-size="11">• <strong>Decussate Orientation:</strong> Typically each pair</text>';
        m += '<text x="375" y="147" fill="#cbd5e1" font-size="11">  is at right angles (90°) to the pair below.</text>';
        m += '<text x="375" y="180" fill="#10b981" font-size="12" font-weight="700">NCERT Master Examples:</text>';
        m += '<text x="375" y="205" fill="#f8fafc" font-size="11">1. <em>Calotropis</em> (Ak)</text>';
        m += '<text x="375" y="225" fill="#f8fafc" font-size="11">2. Guava (<em>Psidium guajava</em>)</text>';
      } else {
        m += '<text x="375" y="55" fill="#c084fc" font-size="13" font-weight="700">Whorled Phyllotaxy</text>';
        m += '<text x="375" y="85" fill="#cbd5e1" font-size="11">• <strong>Rule:</strong> More than two leaves arise at each</text>';
        m += '<text x="375" y="102" fill="#cbd5e1" font-size="11">  single node, forming a complete circle/whorl.</text>';
        m += '<text x="375" y="130" fill="#cbd5e1" font-size="11">• Dense umbrella-like photosynthetic tiers.</text>';
        m += '<text x="375" y="180" fill="#10b981" font-size="12" font-weight="700">NCERT Master Example:</text>';
        m += '<text x="375" y="205" fill="#f8fafc" font-size="11"><em>Alstonia</em> (Devil Tree)</text>';
      }
    }

    svg.innerHTML = m;

    readout(
      cell("Pattern", pType.toUpperCase(), pType === "alternate" ? "#fcd34d" : (pType === "opposite" ? "#38bdf8" : "#c084fc")) +
      cell("Leaves per Node", pType === "alternate" ? "1 Leaf" : (pType === "opposite" ? "2 Leaves" : (pType === "whorled" ? "&gt; 2 Leaves" : "Leaflets")), "#10b981") +
      cell("Bud Location", "Axil of Petiole Only (Never Leaflet)", "#f59e0b") +
      cell("Key Taxon", pType === "alternate" ? "China rose, Mustard" : (pType === "opposite" ? "Calotropis, Guava" : (pType === "whorled" ? "Alstonia" : "Neem / Silk Cotton")), "#38bdf8")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Phyllotaxy Rule:</span> ' +
      (pType === "alternate" ? "Alternate phyllotaxy features a single leaf at each node in an alternating spiral, as in China rose and mustard." :
       (pType === "opposite" ? "Opposite phyllotaxy features a pair of leaves at each node on opposite sides, as in Calotropis and guava." :
        (pType === "whorled" ? "Whorled phyllotaxy features more than two leaves forming a complete circle at each node, as in Alstonia." :
         "In compound leaves, an axillary bud is present in the axil of the petiole, but never in the axils of leaflets.")))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Inflorescence Branching Lab (inflorescencelab)
// -------------------------------------------------------------------------
window.SIMS.inflorescencelab = (function(){
  var infType = "racemose"; // "racemose", "cymose"

  function setInf(t){ infType = t; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Peduncle Axis</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Oldest Flowers</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fcd34d;"></span><span>Youngest Buds</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-rac">Racemose (Acropetal Succession)</button>' +
      '<button class="preset-btn" id="p-cym">Cymose (Basipetal Succession)</button>';

    document.getElementById("p-rac").onclick = function(){ setActivePreset(this); setInf("racemose"); };
    document.getElementById("p-cym").onclick = function(){ setActivePreset(this); setInf("cymose"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Inflorescence Apex Fate &amp; Succession Engine</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Racemose (indeterminate growth, acropetal) vs Cymose (determinate terminal flower, basipetal).</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="infBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#infBg)" rx="10"/>';

    // Diagram Box on Left
    m += '<rect x="25" y="25" width="330" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';

    if(infType === "racemose"){
      m += '<text x="190" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">Racemose: Indeterminate Main Axis</text>';

      // Main axis continuing to grow with arrow
      m += '<line x1="190" y1="260" x2="190" y2="75" stroke="#10b981" stroke-width="5"/>';
      m += '<polygon points="185,80 190,70 195,80" fill="#10b981"/>'; // upward growth arrow
      m += '<text x="190" y="65" fill="#10b981" font-size="10" font-weight="700" text-anchor="middle">Indeterminate Growth</text>';

      // Flowers in acropetal succession (bottom: mature open, top: young buds)
      var racFlowers = [
        { y: 220, r: 16, col: "#ec4899", label: "Oldest (1)" },
        { y: 175, r: 13, col: "#f472b6", label: "(2)" },
        { y: 135, r: 10, col: "#fb7185", label: "(3)" },
        { y: 100, r: 7, col: "#fcd34d", label: "Youngest (4)" }
      ];

      for(var ri = 0; ri < racFlowers.length; ri++){
        var rf = racFlowers[ri];
        // Left flower
        m += '<line x1="190" y1="' + rf.y + '" x2="135" y2="' + (rf.y - 10) + '" stroke="#10b981" stroke-width="2"/>';
        m += '<circle cx="135" cy="' + (rf.y - 10) + '" r="' + rf.r + '" fill="' + rf.col + '"/>';
        // Right flower
        m += '<line x1="190" y1="' + rf.y + '" x2="245" y2="' + (rf.y - 10) + '" stroke="#10b981" stroke-width="2"/>';
        m += '<circle cx="245" cy="' + (rf.y - 10) + '" r="' + rf.r + '" fill="' + rf.col + '"/>';
        m += '<text x="135" y="' + (rf.y - 8) + '" fill="#020617" font-size="8.5" font-weight="700" text-anchor="middle">' + (4 - ri) + '</text>';
        m += '<text x="245" y="' + (rf.y - 8) + '" fill="#020617" font-size="8.5" font-weight="700" text-anchor="middle">' + (4 - ri) + '</text>';
      }

      m += '<text x="190" y="280" fill="#fcd34d" font-size="10.5" font-weight="700" text-anchor="middle">Acropetal Succession (Base &rarr; Apex)</text>';

      // Right Explanation Card
      m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="395" y="55" fill="#38bdf8" font-size="13" font-weight="700">Racemose Inflorescence Diagnostic</text>';
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Main Axis:</strong> Continues to grow indefinitely</text>';
      m += '<text x="395" y="102" fill="#cbd5e1" font-size="11">  (apical meristem does not form a flower).</text>';
      m += '<text x="395" y="130" fill="#cbd5e1" font-size="11">• <strong>Succession:</strong> Lateral flowers borne in</text>';
      m += '<text x="395" y="147" fill="#38bdf8" font-size="11.5" font-weight="700">  Acropetal Succession.</text>';
      m += '<text x="395" y="172" fill="#cbd5e1" font-size="11">• Oldest, largest flowers at the base;</text>';
      m += '<text x="395" y="189" fill="#cbd5e1" font-size="11">  youngest buds near growing shoot apex.</text>';
      m += '<text x="395" y="215" fill="#cbd5e1" font-size="11">• <strong>Anthesis Order:</strong> Centripetal (outer open first).</text>';
      m += '<text x="395" y="245" fill="#fcd34d" font-size="11">NCERT Examples: Mustard, Radish, Crotalaria</text>';

    } else {
      m += '<text x="190" y="50" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">Cymose: Determinate Terminal Flower</text>';

      // Main axis terminating in flower #1
      m += '<line x1="190" y1="260" x2="190" y2="120" stroke="#10b981" stroke-width="5"/>';
      m += '<circle cx="190" cy="115" r="18" fill="#ec4899"/>'; // terminal flower
      m += '<text x="190" y="120" fill="#020617" font-size="11" font-weight="700" text-anchor="middle">1</text>';
      m += '<text x="190" y="90" fill="#ec4899" font-size="10.5" font-weight="700" text-anchor="middle">Oldest Terminal Flower</text>';

      // Lateral branch 1 terminating in flower #2
      m += '<line x1="190" y1="180" x2="115" y2="155" stroke="#10b981" stroke-width="3"/>';
      m += '<circle cx="115" cy="155" r="14" fill="#f472b6"/>';
      m += '<text x="115" y="160" fill="#020617" font-size="10" font-weight="700" text-anchor="middle">2</text>';

      // Lateral branch 2 terminating in flower #2
      m += '<line x1="190" y1="180" x2="265" y2="155" stroke="#10b981" stroke-width="3"/>';
      m += '<circle cx="265" cy="155" r="14" fill="#f472b6"/>';
      m += '<text x="265" y="160" fill="#020617" font-size="10" font-weight="700" text-anchor="middle">2</text>';

      // Tertiary lateral branches terminating in youngest flowers #3
      m += '<line x1="115" y1="180" x2="70" y2="205" stroke="#10b981" stroke-width="2"/>';
      m += '<circle cx="70" cy="205" r="9" fill="#fcd34d"/>';
      m += '<text x="70" y="209" fill="#020617" font-size="8.5" font-weight="700" text-anchor="middle">3</text>';

      m += '<line x1="265" y1="180" x2="310" y2="205" stroke="#10b981" stroke-width="2"/>';
      m += '<circle cx="310" cy="205" r="9" fill="#fcd34d"/>';
      m += '<text x="310" y="209" fill="#020617" font-size="8.5" font-weight="700" text-anchor="middle">3</text>';

      m += '<text x="190" y="280" fill="#f59e0b" font-size="10.5" font-weight="700" text-anchor="middle">Basipetal Succession (Apex &rarr; Base)</text>';

      // Right Explanation Card
      m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="395" y="55" fill="#f59e0b" font-size="13" font-weight="700">Cymose Inflorescence Diagnostic</text>';
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Main Axis:</strong> Terminates directly in a flower,</text>';
      m += '<text x="395" y="102" fill="#cbd5e1" font-size="11">  hence limited/determinate in growth.</text>';
      m += '<text x="395" y="130" fill="#cbd5e1" font-size="11">• <strong>Succession:</strong> Subsequent flowers borne in</text>';
      m += '<text x="395" y="147" fill="#f59e0b" font-size="11.5" font-weight="700">  Basipetal Succession.</text>';
      m += '<text x="395" y="172" fill="#cbd5e1" font-size="11">• Oldest flower is at the top/centre;</text>';
      m += '<text x="395" y="189" fill="#cbd5e1" font-size="11">  younger flowers emerge on lateral axes below.</text>';
      m += '<text x="395" y="215" fill="#cbd5e1" font-size="11">• <strong>Anthesis Order:</strong> Centrifugal (centre opens first).</text>';
      m += '<text x="395" y="245" fill="#fcd34d" font-size="11">NCERT Examples: Solanum, Jasmine, Bougainvillea</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Inflorescence", infType.toUpperCase(), infType === "racemose" ? "#38bdf8" : "#f59e0b") +
      cell("Axis Growth", infType === "racemose" ? "Indeterminate" : "Determinate (Terminal Flower)", infType === "racemose" ? "#10b981" : "#ef4444") +
      cell("Succession Order", infType === "racemose" ? "Acropetal (Base &rarr; Apex)" : "Basipetal (Apex &rarr; Base)", "#fcd34d") +
      cell("Key Taxa", infType === "racemose" ? "Mustard, Radish" : "Solanum, Jasmine", "#38bdf8")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Inflorescence Rule:</span> ' +
      (infType === "racemose" ? "In racemose inflorescences, the main axis continues indeterminate growth with flowers emerging laterally in acropetal succession." :
       "In cymose inflorescences, the main axis terminates in a flower, limiting its growth, and lateral flowers follow in basipetal succession.")
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Thalamus Insertion & Ovary Elevation (thalamusinsertion)
// -------------------------------------------------------------------------
window.SIMS.thalamusinsertion = (function(){
  var oType = "hypogynous"; // "hypogynous", "perigynous", "epigynous"

  function setO(o){ oType = o; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#854d0e;"></span><span>Thalamus / Receptacle</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Ovary / Gynoecium</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Calyx, Corolla &amp; Stamens</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-hypo">Hypogynous (Superior Ovary)</button>' +
      '<button class="preset-btn" id="p-peri">Perigynous (Half-Inferior Ovary)</button>' +
      '<button class="preset-btn" id="p-epi">Epigynous (Inferior Ovary)</button>';

    document.getElementById("p-hypo").onclick = function(){ setActivePreset(this); setO("hypogynous"); };
    document.getElementById("p-peri").onclick = function(){ setActivePreset(this); setO("perigynous"); };
    document.getElementById("p-epi").onclick = function(){ setActivePreset(this); setO("epigynous"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>NCERT Fig 5.13: Position of Floral Parts on Thalamus</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Direct cross-sectional comparison of superior, half-inferior, and inferior ovary insertion.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="thalBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#thalBg)" rx="10"/>';

    // Diagram Box on Left
    m += '<rect x="25" y="25" width="330" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';

    var cx = 190;

    if(oType === "hypogynous"){
      m += '<text x="190" y="50" fill="#10b981" font-size="13" font-weight="700" text-anchor="middle">Hypogynous Flower (Superior Ovary)</text>';

      // Conical/convex thalamus
      m += '<path d="M 130,220 C 130,170 250,170 250,220 Z" fill="#854d0e" stroke="#ca8a04" stroke-width="2"/>';
      m += '<line x1="190" y1="220" x2="190" y2="265" stroke="#713f12" stroke-width="6"/>'; // pedicel

      // Ovary situated at topmost summit
      m += '<ellipse cx="190" cy="140" rx="26" ry="32" fill="#059669" stroke="#34d399" stroke-width="2"/>';
      m += '<line x1="190" y1="108" x2="190" y2="75" stroke="#34d399" stroke-width="3"/>'; // style
      m += '<circle cx="190" cy="75" r="5" fill="#fcd34d"/>'; // stigma

      // Floral parts inserted below ovary
      // Sepals below
      m += '<path d="M 140,185 Q 110,180 95,200" fill="none" stroke="#22c55e" stroke-width="3"/>';
      m += '<path d="M 240,185 Q 270,180 285,200" fill="none" stroke="#22c55e" stroke-width="3"/>';
      // Petals below
      m += '<path d="M 145,180 Q 100,140 85,110" fill="none" stroke="#ec4899" stroke-width="3.5"/>';
      m += '<path d="M 235,180 Q 280,140 295,110" fill="none" stroke="#ec4899" stroke-width="3.5"/>';
      // Stamens below
      m += '<line x1="160" y1="175" x2="140" y2="120" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="140" cy="118" r="4" fill="#fbbf24"/>';
      m += '<line x1="220" y1="175" x2="240" y2="120" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="240" cy="118" r="4" fill="#fbbf24"/>';

      m += '<text x="190" y="145" fill="#f8fafc" font-size="10.5" font-weight="700" text-anchor="middle">Ovary</text>';
      m += '<text x="190" y="280" fill="#fcd34d" font-size="11" font-weight="700" text-anchor="middle">Ovary Superior: G (Hypogynous)</text>';

    } else if(oType === "perigynous"){
      m += '<text x="190" y="50" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">Perigynous Flower (Half-Inferior Ovary)</text>';

      // Cup-shaped / saucer thalamus
      m += '<path d="M 110,140 C 110,210 270,210 270,140 C 255,140 250,190 190,190 C 130,190 125,140 110,140 Z" fill="#854d0e" stroke="#ca8a04" stroke-width="2"/>';
      m += '<line x1="190" y1="195" x2="190" y2="265" stroke="#713f12" stroke-width="6"/>';

      // Ovary in central cup depression
      m += '<ellipse cx="190" cy="155" rx="24" ry="28" fill="#059669" stroke="#34d399" stroke-width="2"/>';
      m += '<line x1="190" y1="127" x2="190" y2="85" stroke="#34d399" stroke-width="3"/>';
      m += '<circle cx="190" cy="85" r="5" fill="#fcd34d"/>';

      // Floral parts on the cup rim (same horizontal level)
      // Left rim parts
      m += '<path d="M 110,140 Q 80,125 70,100" fill="none" stroke="#ec4899" stroke-width="3"/>';
      m += '<line x1="110" y1="140" x2="125" y2="95" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="125" cy="95" r="4" fill="#fbbf24"/>';
      // Right rim parts
      m += '<path d="M 270,140 Q 300,125 310,100" fill="none" stroke="#ec4899" stroke-width="3"/>';
      m += '<line x1="270" y1="140" x2="255" y2="95" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="255" cy="95" r="4" fill="#fbbf24"/>';

      m += '<text x="190" y="160" fill="#f8fafc" font-size="10.5" font-weight="700" text-anchor="middle">Ovary</text>';
      m += '<text x="190" y="280" fill="#fcd34d" font-size="11" font-weight="700" text-anchor="middle">Ovary Half-Inferior (Rim Insertion)</text>';

    } else {
      m += '<text x="190" y="50" fill="#ef4444" font-size="13" font-weight="700" text-anchor="middle">Epigynous Flower (Inferior Ovary)</text>';

      // Hollowed thalamus completely enclosing and fused with ovary
      m += '<path d="M 150,110 C 130,130 130,195 190,195 C 250,195 250,130 230,110 Z" fill="#854d0e" stroke="#ca8a04" stroke-width="2"/>';
      m += '<line x1="190" y1="195" x2="190" y2="265" stroke="#713f12" stroke-width="6"/>';

      // Ovary completely buried inside fused thalamus wall
      m += '<ellipse cx="190" cy="150" rx="20" ry="26" fill="#047857" stroke="#6ee7b7" stroke-width="1.5" stroke-dasharray="3,2"/>';
      m += '<line x1="190" y1="124" x2="190" y2="75" stroke="#34d399" stroke-width="3"/>';
      m += '<circle cx="190" cy="75" r="5" fill="#fcd34d"/>';

      // Floral parts arise strictly above the ovary summit
      m += '<path d="M 155,110 Q 110,95 90,70" fill="none" stroke="#ec4899" stroke-width="3"/>';
      m += '<path d="M 225,110 Q 270,95 290,70" fill="none" stroke="#ec4899" stroke-width="3"/>';
      m += '<line x1="165" y1="110" x2="155" y2="65" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="155" cy="65" r="4" fill="#fbbf24"/>';
      m += '<line x1="215" y1="110" x2="225" y2="65" stroke="#38bdf8" stroke-width="2"/>';
      m += '<circle cx="225" cy="65" r="4" fill="#fbbf24"/>';

      m += '<text x="190" y="155" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">Enclosed</text>';
      m += '<text x="190" y="280" fill="#fcd34d" font-size="11" font-weight="700" text-anchor="middle">Ovary Inferior: G (Epigynous)</text>';
    }

    // Right Explanation Card
    m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
    if(oType === "hypogynous"){
      m += '<text x="395" y="55" fill="#10b981" font-size="13" font-weight="700">Hypogynous Insertion &amp; Superior Ovary</text>';
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Gynoecium Position:</strong> Occupies the highest</text>';
      m += '<text x="395" y="102" fill="#cbd5e1" font-size="11">  summit position on convex thalamus.</text>';
      m += '<text x="395" y="130" fill="#cbd5e1" font-size="11">• <strong>Accessory Whorls:</strong> Calyx, corolla, and stamens</text>';
      m += '<text x="395" y="147" fill="#cbd5e1" font-size="11">  are inserted distinctly below the ovary.</text>';
      m += '<text x="395" y="175" fill="#cbd5e1" font-size="11">• <strong>Symbol:</strong> Superior G</text>';
      m += '<text x="395" y="205" fill="#10b981" font-size="12" font-weight="700">NCERT Representative Examples:</text>';
      m += '<text x="395" y="230" fill="#f8fafc" font-size="11">1. Mustard (<em>Brassica</em>)</text>';
      m += '<text x="395" y="248" fill="#f8fafc" font-size="11">2. China rose (<em>Hibiscus</em>)</text>';
      m += '<text x="395" y="266" fill="#f8fafc" font-size="11">3. Brinjal (<em>Solanum melongena</em>)</text>';
    } else if(oType === "perigynous"){
      m += '<text x="395" y="55" fill="#f59e0b" font-size="13" font-weight="700">Perigynous Insertion &amp; Half-Inferior Ovary</text>';
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Gynoecium Position:</strong> Situated centrally</text>';
      m += '<text x="395" y="102" fill="#cbd5e1" font-size="11">  in a cup- or saucer-shaped thalamus.</text>';
      m += '<text x="395" y="130" fill="#cbd5e1" font-size="11">• <strong>Accessory Whorls:</strong> Located on the rim of</text>';
      m += '<text x="395" y="147" fill="#cbd5e1" font-size="11">  the thalamus at almost the same horizontal level.</text>';
      m += '<text x="395" y="175" fill="#cbd5e1" font-size="11">• <strong>Ovary State:</strong> Half-inferior / half-superior.</text>';
      m += '<text x="395" y="205" fill="#f59e0b" font-size="12" font-weight="700">NCERT Representative Examples:</text>';
      m += '<text x="395" y="230" fill="#f8fafc" font-size="11">1. Plum (<em>Prunus</em>)</text>';
      m += '<text x="395" y="248" fill="#f8fafc" font-size="11">2. Rose (<em>Rosa</em>)</text>';
      m += '<text x="395" y="266" fill="#f8fafc" font-size="11">3. Peach</text>';
    } else {
      m += '<text x="395" y="55" fill="#ef4444" font-size="13" font-weight="700">Epigynous Insertion &amp; Inferior Ovary</text>';
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Gynoecium Position:</strong> Thalamus grows completely</text>';
      m += '<text x="395" y="102" fill="#cbd5e1" font-size="11">  upwards, enclosing and fusing with ovary wall.</text>';
      m += '<text x="395" y="130" fill="#cbd5e1" font-size="11">• <strong>Accessory Whorls:</strong> Arise strictly above the</text>';
      m += '<text x="395" y="147" fill="#cbd5e1" font-size="11">  summit of the ovary.</text>';
      m += '<text x="395" y="175" fill="#cbd5e1" font-size="11">• <strong>Symbol:</strong> Inferior G</text>';
      m += '<text x="395" y="205" fill="#ef4444" font-size="12" font-weight="700">NCERT Representative Examples:</text>';
      m += '<text x="395" y="230" fill="#f8fafc" font-size="11">1. Guava (<em>Psidium</em>)</text>';
      m += '<text x="395" y="248" fill="#f8fafc" font-size="11">2. Cucumber (<em>Cucumis</em>)</text>';
      m += '<text x="395" y="266" fill="#f8fafc" font-size="11">3. Ray florets of Sunflower</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Insertion Type", oType.toUpperCase(), oType === "hypogynous" ? "#10b981" : (oType === "perigynous" ? "#f59e0b" : "#ef4444")) +
      cell("Ovary Status", oType === "hypogynous" ? "Superior Ovary" : (oType === "perigynous" ? "Half-Inferior" : "Inferior Ovary"), "#38bdf8") +
      cell("Floral Part Elevation", oType === "hypogynous" ? "Below Ovary" : (oType === "perigynous" ? "Same Level (Rim)" : "Above Ovary"), "#fcd34d") +
      cell("Key Taxa", oType === "hypogynous" ? "Mustard, Brinjal" : (oType === "perigynous" ? "Plum, Rose, Peach" : "Guava, Cucumber"), "#10b981")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Thalamus Insertion Rule:</span> ' +
      (oType === "hypogynous" ? "Hypogynous flowers possess a superior ovary atop a convex receptacle with all other floral whorls attached below." :
       (oType === "perigynous" ? "Perigynous flowers have a cup-shaped receptacle with the ovary situated centrally and other parts attached along the rim at the same level." :
        "Epigynous flowers have an inferior ovary completely entombed and fused within the receptacle, with other parts arising above it."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Aestivation & Placentation Studio (placentationlab)
// -------------------------------------------------------------------------
window.SIMS.placentationlab = (function(){
  var mode = "placentation"; // "aestivation", "placentation"
  var sub = "axile"; // aestivation: "valvate", "twisted", "imbricate", "vexillary"; placentation: "marginal", "axile", "parietal", "free", "basal"

  function setM(m){
    mode = m;
    sub = (mode === "aestivation" ? "twisted" : "axile");
    mountControls();
    draw(0);
  }
  function setS(s){ sub = s; draw(0); }

  function mountControls(){
    if(mode === "aestivation"){
      document.getElementById("lab-controls").innerHTML =
        '<div class="control-group">' +
          '<label>Select Aestivation Mode</label>' +
          '<select id="sub-sel" class="control-select" style="background:#1e293b;color:#f8fafc;padding:6px;border-radius:6px;border:1px solid #475569;width:100%;">' +
            '<option value="valvate">Valvate (Margins touch without overlap, Calotropis)</option>' +
            '<option value="twisted" selected>Twisted (Regular directional overlap, China rose)</option>' +
            '<option value="imbricate">Imbricate (Irregular overlapping, Cassia/Gulmohur)</option>' +
            '<option value="vexillary">Vexillary (1 standard + 2 wings + 2 keels, Pea/Bean)</option>' +
          '</select>' +
        '</div>' +
        '<div class="control-group">' +
          '<label>Aestivation Diagnostic</label>' +
          '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Arrangement of sepals or petals in floral bud stage.</div>' +
        '</div>';
    } else {
      document.getElementById("lab-controls").innerHTML =
        '<div class="control-group">' +
          '<label>Select Placentation Mode</label>' +
          '<select id="sub-sel" class="control-select" style="background:#1e293b;color:#f8fafc;padding:6px;border-radius:6px;border:1px solid #475569;width:100%;">' +
            '<option value="marginal">Marginal (Ventral suture ridge, Pea)</option>' +
            '<option value="axile" selected>Axile (Multilocular with central axis, Tomato/Lemon)</option>' +
            '<option value="parietal">Parietal (Inner wall + Replum false septum, Mustard)</option>' +
            '<option value="free">Free Central (Central axis, no septa, Dianthus/Primrose)</option>' +
            '<option value="basal">Basal (Single ovule at base, Sunflower)</option>' +
          '</select>' +
        '</div>' +
        '<div class="control-group">' +
          '<label>Placentation Diagnostic</label>' +
          '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Arrangement of ovules on placenta within the ovary locule.</div>' +
        '</div>';
    }

    var sel = document.getElementById("sub-sel");
    if(sel){
      sel.onchange = function(){ setS(this.value); };
    }
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Petal / Perianth Unit</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Ovary Wall / Septum</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Ovule on Placenta</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-plac">Placentation Types (NCERT Fig 5.16)</button>' +
      '<button class="preset-btn" id="p-aest">Aestivation Types (NCERT Fig 5.15)</button>';

    document.getElementById("p-plac").onclick = function(){ setActivePreset(this); setM("placentation"); };
    document.getElementById("p-aest").onclick = function(){ setActivePreset(this); setM("aestivation"); };

    mountControls();
    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="placBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#placBg)" rx="10"/>';

    // Diagram Box on Left
    m += '<rect x="25" y="25" width="330" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';

    var cx = 190, cy = 160;

    if(mode === "aestivation"){
      m += '<text x="190" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">Aestivation Bud: ' + sub.toUpperCase() + '</text>';

      if(sub === "valvate"){
        // 5 petals with margins touching without overlapping
        for(var i = 0; i < 5; i++){
          var a1 = (i * 72 - 32) * Math.PI / 180;
          var a2 = (i * 72 + 32) * Math.PI / 180;
          var x1 = cx + Math.cos(a1) * 70, y1 = cy + Math.sin(a1) * 70;
          var x2 = cx + Math.cos(a2) * 70, y2 = cy + Math.sin(a2) * 70;
          m += '<path d="M ' + x1 + ',' + y1 + ' A 70,70 0 0,1 ' + x2 + ',' + y2 + '" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>';
        }
        m += '<text x="190" y="275" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Margins touch without overlap (Calotropis)</text>';

      } else if(sub === "twisted"){
        // 5 petals overlapping clockwise
        for(var ti = 0; ti < 5; ti++){
          var ta1 = (ti * 72 - 35) * Math.PI / 180;
          var ta2 = (ti * 72 + 35) * Math.PI / 180;
          var tx1 = cx + Math.cos(ta1) * 62, ty1 = cy + Math.sin(ta1) * 62;
          var tx2 = cx + Math.cos(ta2) * 78, ty2 = cy + Math.sin(ta2) * 78;
          m += '<path d="M ' + tx1 + ',' + ty1 + ' A 70,70 0 0,1 ' + tx2 + ',' + ty2 + '" fill="none" stroke="#34d399" stroke-width="7" stroke-linecap="round"/>';
        }
        m += '<text x="190" y="275" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Regular directional overlap (China rose, Cotton)</text>';

      } else if(sub === "imbricate"){
        // Imbricate: 1 completely inside, 1 completely outside, 3 overlapping
        // Outer petal
        m += '<path d="M 125,100 A 75,75 0 0,1 255,100" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>';
        // Inner petal
        m += '<path d="M 145,215 A 60,60 0 0,1 235,215" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>';
        // 3 overlapping lateral petals
        m += '<path d="M 255,105 A 70,70 0 0,1 250,185" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>';
        m += '<path d="M 245,185 A 70,70 0 0,1 180,235" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>';
        m += '<path d="M 135,185 A 70,70 0 0,1 125,105" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>';
        m += '<text x="190" y="275" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Irregular overlapping (Cassia, Gulmohur)</text>';

      } else {
        // Vexillary: 1 standard posterior + 2 wings + 2 fused keels anterior
        // Standard / Vexillum (largest posterior, blue)
        m += '<path d="M 110,120 A 90,90 0 0,1 270,120" fill="none" stroke="#38bdf8" stroke-width="10" stroke-linecap="round"/>';
        m += '<text x="190" y="95" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Standard (Vexillum)</text>';
        // Wings / Alae (2 lateral, green)
        m += '<path d="M 125,135 A 70,70 0 0,1 145,205" fill="none" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>';
        m += '<path d="M 255,135 A 70,70 0 0,1 235,205" fill="none" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>';
        m += '<text x="110" y="170" fill="#10b981" font-size="9" font-weight="700">Wing</text>';
        m += '<text x="270" y="170" fill="#10b981" font-size="9" font-weight="700">Wing</text>';
        // Keel / Carina (2 fused anterior, pink)
        m += '<path d="M 155,205 A 50,50 0 0,1 225,205" fill="none" stroke="#ec4899" stroke-width="8" stroke-linecap="round"/>';
        m += '<text x="190" y="225" fill="#ec4899" font-size="9.5" font-weight="700" text-anchor="middle">Keel (Fused)</text>';
        m += '<text x="190" y="275" fill="#cbd5e1" font-size="10.5" text-anchor="middle">1 Standard + 2 Wings + (2) Keel (Pea, Bean)</text>';
      }

    } else {
      // Placentation modes
      m += '<text x="190" y="50" fill="#10b981" font-size="13" font-weight="700" text-anchor="middle">Ovary Cross-Section: ' + sub.toUpperCase() + '</text>';

      if(sub === "marginal"){
        // Pea pod cross-section
        m += '<path d="M 140,160 C 140,105 240,105 240,160 C 240,215 140,215 140,160 Z" fill="#064e3b" stroke="#10b981" stroke-width="3"/>';
        m += '<line x1="140" y1="110" x2="140" y2="210" stroke="#fcd34d" stroke-width="4"/>'; // ventral suture
        m += '<circle cx="158" cy="140" r="8" fill="#f59e0b"/>';
        m += '<circle cx="158" cy="180" r="8" fill="#f59e0b"/>';
        m += '<text x="125" y="160" fill="#fcd34d" font-size="9" font-weight="700" text-anchor="end">Suture</text>';
        m += '<text x="175" y="163" fill="#f8fafc" font-size="10" font-weight="700">Ovules</text>';
        m += '<text x="190" y="275" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Along ventral suture ridge (Pea)</text>';

      } else if(sub === "axile"){
        // 3-locular ovary with central placenta
        m += '<circle cx="' + cx + '" cy="' + cy + '" r="65" fill="#042f2e" stroke="#10b981" stroke-width="3"/>';
        // 3 radial septa
        for(var s = 0; s < 3; s++){
          var sRad = (s * 120 - 90) * Math.PI / 180;
          m += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(sRad) * 65) + '" y2="' + (cy + Math.sin(sRad) * 65) + '" stroke="#10b981" stroke-width="2.5"/>';
          // 2 ovules per locule on central axis
          var o1 = sRad + 0.45;
          var o2 = sRad - 0.45;
          m += '<circle cx="' + (cx + Math.cos(o1) * 25) + '" cy="' + (cy + Math.sin(o1) * 25) + '" r="6" fill="#f59e0b"/>';
          m += '<circle cx="' + (cx + Math.cos(o2) * 25) + '" cy="' + (cy + Math.sin(o2) * 25) + '" r="6" fill="#f59e0b"/>';
        }
        m += '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="#fcd34d"/>'; // central axis
        m += '<text x="190" y="275" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Central axis in multilocular ovary (Tomato, Lemon)</text>';

      } else if(sub === "parietal"){
        // Unilocular with ovules on inner peripheral wall + false septum (replum)
        m += '<circle cx="' + cx + '" cy="' + cy + '" r="65" fill="#042f2e" stroke="#10b981" stroke-width="3"/>';
        m += '<line x1="190" y1="95" x2="190" y2="225" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,3"/>'; // replum
        m += '<text x="195" y="160" fill="#f87171" font-size="9">Replum</text>';
        // Peripheral ovules
        var pAngles = [30, 70, 110, 150, 210, 250, 290, 330];
        for(var pi = 0; pi < pAngles.length; pi++){
          var prad = pAngles[pi] * Math.PI / 180;
          m += '<circle cx="' + (cx + Math.cos(prad) * 52) + '" cy="' + (cy + Math.sin(prad) * 52) + '" r="6" fill="#f59e0b"/>';
        }
        m += '<text x="190" y="275" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Inner peripheral wall + false septum (Mustard, Argemone)</text>';

      } else if(sub === "free"){
        // Free central: ovules on central column, unilocular, no septa
        m += '<circle cx="' + cx + '" cy="' + cy + '" r="65" fill="#042f2e" stroke="#10b981" stroke-width="3"/>';
        m += '<circle cx="' + cx + '" cy="' + cy + '" r="22" fill="#065f46" stroke="#10b981" stroke-width="2"/>';
        // Ovules around central column
        for(var fi = 0; fi < 6; fi++){
          var frad = (fi * 60) * Math.PI / 180;
          m += '<circle cx="' + (cx + Math.cos(frad) * 32) + '" cy="' + (cy + Math.sin(frad) * 32) + '" r="6" fill="#f59e0b"/>';
        }
        m += '<text x="190" y="164" fill="#fcd34d" font-size="9" font-weight="700" text-anchor="middle">Axis</text>';
        m += '<text x="190" y="275" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Central column, septa absent (Dianthus, Primrose)</text>';

      } else {
        // Basal: single ovule at base of unilocular ovary
        m += '<ellipse cx="' + cx + '" cy="' + (cy - 10) + '" rx="55" ry="65" fill="#042f2e" stroke="#10b981" stroke-width="3"/>';
        // Placenta pad at base
        m += '<ellipse cx="' + cx + '" cy="205" rx="20" ry="8" fill="#15803d"/>';
        // Single ovule
        m += '<circle cx="' + cx + '" cy="175" r="14" fill="#f59e0b" stroke="#fcd34d" stroke-width="2"/>';
        m += '<text x="' + cx + '" y="179" fill="#020617" font-size="9" font-weight="700" text-anchor="middle">1</text>';
        m += '<text x="190" y="275" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Single ovule at ovary base (Sunflower, Marigold)</text>';
      }
    }

    // Right Explanation Card
    m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
    if(mode === "aestivation"){
      m += '<text x="395" y="55" fill="#38bdf8" font-size="13" font-weight="700">Aestivation Diagnostic Key</text>';
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Valvate:</strong> Margins touch without overlap</text>';
      m += '<text x="395" y="102" fill="#94a3b8" font-size="10.5">  e.g. <em>Calotropis</em></text>';
      m += '<text x="395" y="125" fill="#cbd5e1" font-size="11">• <strong>Twisted:</strong> Regular overlapping in one direction</text>';
      m += '<text x="395" y="142" fill="#94a3b8" font-size="10.5">  e.g. China rose, Lady&apos;s finger, Cotton</text>';
      m += '<text x="395" y="165" fill="#cbd5e1" font-size="11">• <strong>Imbricate:</strong> Irregular overlapping margins</text>';
      m += '<text x="395" y="182" fill="#94a3b8" font-size="10.5">  e.g. <em>Cassia</em>, Gulmohur</text>';
      m += '<text x="395" y="205" fill="#cbd5e1" font-size="11">• <strong>Vexillary:</strong> 1 Standard + 2 Wings + (2) Keel</text>';
      m += '<text x="395" y="222" fill="#94a3b8" font-size="10.5">  e.g. Pea, Bean (Papilionaceous corolla)</text>';
    } else {
      m += '<text x="395" y="55" fill="#10b981" font-size="13" font-weight="700">Placentation Diagnostic Key</text>';
      m += '<text x="395" y="80" fill="#cbd5e1" font-size="10.5">• <strong>Marginal:</strong> Ridge along ventral suture; Pea.</text>';
      m += '<text x="395" y="105" fill="#cbd5e1" font-size="10.5">• <strong>Axile:</strong> Central axis in multilocular ovary</text>';
      m += '<text x="395" y="120" fill="#94a3b8" font-size="10">  divided by septa; Tomato, Lemon, China rose.</text>';
      m += '<text x="395" y="145" fill="#cbd5e1" font-size="10.5">• <strong>Parietal:</strong> Inner wall + replum false septum;</text>';
      m += '<text x="395" y="160" fill="#94a3b8" font-size="10">  Mustard, <em>Argemone</em>.</text>';
      m += '<text x="395" y="185" fill="#cbd5e1" font-size="10.5">• <strong>Free Central:</strong> Central column, septa absent;</text>';
      m += '<text x="395" y="200" fill="#94a3b8" font-size="10">  <em>Dianthus</em>, Primrose (<em>Primula</em>).</text>';
      m += '<text x="395" y="225" fill="#cbd5e1" font-size="10.5">• <strong>Basal:</strong> Single ovule at base of locule;</text>';
      m += '<text x="395" y="240" fill="#94a3b8" font-size="10">  Sunflower, Marigold.</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Mode", mode.toUpperCase(), mode === "aestivation" ? "#38bdf8" : "#10b981") +
      cell("Pattern", sub.toUpperCase(), "#fcd34d") +
      cell("Diagnostic Trait", mode === "aestivation" ? (sub === "vexillary" ? "1 + 2 + (2)" : "Perianth Overlap") : (sub === "parietal" ? "Replum False Septum" : (sub === "free" ? "No Septa" : "Placental Alignment")), "#ec4899") +
      cell("Key Taxon", sub === "vexillary" ? "Pea, Bean" : (sub === "axile" ? "Tomato, Lemon" : (sub === "parietal" ? "Mustard" : "Dianthus")), "#38bdf8")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Structural Rule:</span> ' +
      (mode === "aestivation" ? "Aestivation dictates the overlapping topology of petals or sepals in the floral bud." :
       "Placentation defines the internal ovule distribution, providing critical evolutionary markers across angiosperm families.")
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Seed Morphology & Drupe Anatomy (seedmorphologylab)
// -------------------------------------------------------------------------
window.SIMS.seedmorphologylab = (function(){
  var sMode = "maize"; // "gram", "maize", "drupe"

  function setS(s){ sMode = s; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#fcd34d;"></span><span>Endosperm</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cotyledon / Scutellum</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Plumule (Shoot)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Radicle (Root)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-mz">Maize Grain V.S. (Monocot)</button>' +
      '<button class="preset-btn" id="p-gm">Gram Seed (Dicot)</button>' +
      '<button class="preset-btn" id="p-dr">Drupe Anatomy (Mango / Coconut)</button>';

    document.getElementById("p-mz").onclick = function(){ setActivePreset(this); setS("maize"); };
    document.getElementById("p-gm").onclick = function(){ setActivePreset(this); setS("gram"); };
    document.getElementById("p-dr").onclick = function(){ setActivePreset(this); setS("drupe"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Seed Reserves &amp; Pericarp Zonation Studio</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Comparative embryological architecture of dicot vs monocot grains, and pericarp differentiation in drupes.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="seedBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#seedBg)" rx="10"/>';

    // Diagram Box on Left
    m += '<rect x="25" y="25" width="330" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';

    if(sMode === "maize"){
      m += '<text x="190" y="50" fill="#fcd34d" font-size="13" font-weight="700" text-anchor="middle">NCERT Fig 5.18b: V.S. of Maize Grain</text>';

      // Grain outline: fused pericarp + seed coat
      m += '<path d="M 120,80 C 120,65 260,65 260,80 L 250,260 C 240,275 140,275 130,260 Z" fill="#0f172a" stroke="#ca8a04" stroke-width="2.5"/>';

      // Upper bulky Endosperm (yellow)
      m += '<path d="M 122,80 C 122,68 258,68 258,80 L 252,175 L 128,175 Z" fill="#fef08a" opacity="0.35"/>';
      m += '<text x="190" y="125" fill="#facc15" font-size="12" font-weight="700" text-anchor="middle">Starchy Endosperm</text>';

      // Proteinaceous Aleurone layer line
      m += '<line x1="125" y1="175" x2="255" y2="175" stroke="#ec4899" stroke-width="3" stroke-dasharray="3,2"/>';
      m += '<text x="190" y="170" fill="#f472b6" font-size="8.5" font-weight="700" text-anchor="middle">Aleurone Layer (Protein)</text>';

      // Lower Embryo region
      // Scutellum (shield cotyledon, blue)
      m += '<path d="M 135,185 C 135,185 175,180 180,240 C 160,255 135,245 135,185 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="155" y="215" fill="#e0f2fe" font-size="9" font-weight="700">Scutellum</text>';

      // Plumule & Coleoptile (green)
      m += '<rect x="195" y="185" width="30" height="28" rx="4" fill="#15803d" stroke="#22c55e" stroke-width="1.5"/>';
      m += '<text x="210" y="198" fill="#bbf7d0" font-size="7.5" font-weight="700" text-anchor="middle">Plumule</text>';
      m += '<text x="210" y="208" fill="#86efac" font-size="6.5" text-anchor="middle">(Coleoptile)</text>';

      // Radicle & Coleorhiza (red)
      m += '<rect x="195" y="222" width="30" height="28" rx="4" fill="#991b1b" stroke="#f87171" stroke-width="1.5"/>';
      m += '<text x="210" y="235" fill="#fecaca" font-size="7.5" font-weight="700" text-anchor="middle">Radicle</text>';
      m += '<text x="210" y="245" fill="#fca5a5" font-size="6.5" text-anchor="middle">(Coleorhiza)</text>';

      m += '<text x="190" y="285" fill="#fcd34d" font-size="10.5" font-weight="700" text-anchor="middle">Monocot Endospermic Caryopsis</text>';

      // Right Explanation Box
      m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="395" y="55" fill="#fcd34d" font-size="13" font-weight="700">Maize Grain Anatomy (NCERT)</text>';
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Pericarp &amp; Seed Coat:</strong> Fused inextricably;</text>';
      m += '<text x="395" y="102" fill="#cbd5e1" font-size="11">  technically a single-seeded fruit (caryopsis).</text>';
      m += '<text x="395" y="128" fill="#cbd5e1" font-size="11">• <strong>Endosperm:</strong> Bulky starchy reserve separated</text>';
      m += '<text x="395" y="145" fill="#ec4899" font-size="11" font-weight="700">  by a proteinaceous Aleurone Layer.</text>';
      m += '<text x="395" y="172" fill="#cbd5e1" font-size="11">• <strong>Scutellum:</strong> Single large, shield-shaped</text>';
      m += '<text x="395" y="189" fill="#38bdf8" font-size="11" font-weight="700">  cotyledon specialized for nutrient transfer.</text>';
      m += '<text x="395" y="215" fill="#cbd5e1" font-size="11">• <strong>Protective Sheaths:</strong></text>';
      m += '<text x="395" y="232" fill="#10b981" font-size="10.5">  - Plumule enclosed in <strong>Coleoptile</strong></text>';
      m += '<text x="395" y="248" fill="#ef4444" font-size="10.5">  - Radicle enclosed in <strong>Coleorhiza</strong></text>';

    } else if(sMode === "gram"){
      m += '<text x="190" y="50" fill="#10b981" font-size="13" font-weight="700" text-anchor="middle">NCERT Fig 5.17: Gram Seed (Dicot)</text>';

      // Seed opened to reveal 2 cotyledons and embryonal axis
      m += '<ellipse cx="145" cy="160" rx="35" ry="60" fill="#047857" stroke="#34d399" stroke-width="2"/>';
      m += '<text x="145" y="165" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">Cotyledon 1</text>';

      m += '<ellipse cx="235" cy="160" rx="35" ry="60" fill="#047857" stroke="#34d399" stroke-width="2"/>';
      m += '<text x="235" y="165" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">Cotyledon 2</text>';

      // Central embryonal axis
      m += '<path d="M 190,115 Q 185,160 190,210" fill="none" stroke="#fcd34d" stroke-width="4"/>';
      // Plumule top
      m += '<circle cx="190" cy="115" r="7" fill="#10b981"/>';
      m += '<text x="190" y="105" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">Plumule</text>';
      // Radicle bottom
      m += '<circle cx="190" cy="210" r="7" fill="#ef4444"/>';
      m += '<text x="190" y="228" fill="#f87171" font-size="10" font-weight="700" text-anchor="middle">Radicle</text>';

      m += '<text x="190" y="280" fill="#fcd34d" font-size="10.5" font-weight="700" text-anchor="middle">Non-Endospermic Dicot Seed</text>';

      // Right Explanation Box
      m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="395" y="55" fill="#10b981" font-size="13" font-weight="700">Dicotyledonous Seed Architecture</text>';
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Seed Coat:</strong> Double-layered with outer</text>';
      m += '<text x="395" y="102" fill="#cbd5e1" font-size="11">  thick <strong>Testa</strong> and inner thin <strong>Tegmen</strong>.</text>';
      m += '<text x="395" y="128" fill="#cbd5e1" font-size="11">• <strong>Hilum &amp; Micropyle:</strong> Scar of attachment and</text>';
      m += '<text x="395" y="145" fill="#cbd5e1" font-size="11">  small entry pore for water and oxygen.</text>';
      m += '<text x="395" y="172" fill="#cbd5e1" font-size="11">• <strong>Two Cotyledons:</strong> Large, fleshy, packed</text>';
      m += '<text x="395" y="189" fill="#cbd5e1" font-size="11">  with stored food for seedling nourishment.</text>';
      m += '<text x="395" y="215" fill="#cbd5e1" font-size="11">• <strong>Endosperm Fate:</strong> Consumed during embryo</text>';
      m += '<text x="395" y="232" fill="#cbd5e1" font-size="11">  development (non-endospermic; e.g. Gram, Pea).</text>';
      m += '<text x="395" y="258" fill="#fcd34d" font-size="10.5">Exception: Castor is endospermic</text>';

    } else {
      // Drupe anatomy: Mango vs Coconut
      m += '<text x="190" y="50" fill="#f59e0b" font-size="13" font-weight="700" text-anchor="middle">NCERT Fig 5.17: Drupe Fruit Anatomy</text>';

      // Mango cross-section
      // Epicarp outer ring (orange)
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="70" fill="none" stroke="#ea580c" stroke-width="4"/>';
      // Fleshy Mesocarp (yellow)
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="68" fill="#fef08a" opacity="0.4"/>';
      // Stony Endocarp (brown)
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="35" fill="#78350f" stroke="#b45309" stroke-width="3"/>';
      // Single Seed inside
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="18" fill="#fef9c3"/>';

      m += '<text x="190" y="110" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">Mesocarp (Fleshy)</text>';
      m += '<text x="190" y="164" fill="#f8fafc" font-size="9" font-weight="700" text-anchor="middle">Seed</text>';
      m += '<text x="190" y="200" fill="#fcd34d" font-size="9.5" font-weight="700" text-anchor="middle">Stony Endocarp</text>';
      m += '<text x="190" y="280" fill="#ea580c" font-size="10.5" font-weight="700" text-anchor="middle">Drupe of Mango (Mangifera)</text>';

      // Right Explanation Box
      m += '<rect x="375" y="25" width="300" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="395" y="55" fill="#f59e0b" font-size="13" font-weight="700">Drupe Structural Blueprint</text>';
      m += '<text x="395" y="85" fill="#cbd5e1" font-size="11">• <strong>Origin:</strong> Develop from monocarpellary</text>';
      m += '<text x="395" y="102" fill="#cbd5e1" font-size="11">  superior ovaries and are single-seeded.</text>';
      m += '<text x="395" y="128" fill="#cbd5e1" font-size="11">• <strong>Pericarp Zonation:</strong></text>';
      m += '<text x="395" y="148" fill="#cbd5e1" font-size="10.5">  1. <strong>Epicarp:</strong> Outer thin skin/peel</text>';
      m += '<text x="395" y="166" fill="#cbd5e1" font-size="10.5">  2. <strong>Mesocarp:</strong></text>';
      m += '<text x="415" y="183" fill="#fcd34d" font-size="10">• Mango: Fleshy and edible</text>';
      m += '<text x="415" y="200" fill="#38bdf8" font-size="10">• Coconut: Fibrous (coir source)</text>';
      m += '<text x="395" y="222" fill="#cbd5e1" font-size="10.5">  3. <strong>Endocarp:</strong> Inner stony hard shell</text>';
      m += '<text x="395" y="255" fill="#10b981" font-size="10.5" font-weight="700">NCERT Representatives: Mango &amp; Coconut</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Specimen", sMode === "maize" ? "Maize (Monocot Grain)" : (sMode === "gram" ? "Gram (Dicot Seed)" : "Drupe (Mango/Coconut)"), "#38bdf8") +
      cell("Endosperm", sMode === "maize" ? "Bulky Starchy" : (sMode === "gram" ? "Non-Endospermic" : "Liquid / Cellular"), "#fcd34d") +
      cell("Cotyledon", sMode === "maize" ? "1 (Scutellum)" : (sMode === "gram" ? "2 Cotyledons" : "Within Endocarp"), "#10b981") +
      cell("Pericarp", sMode === "drupe" ? "Epi + Meso + Endocarp" : (sMode === "maize" ? "Fused with Testa" : "Separate Pod"), "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Diagnostic Rule:</span> ' +
      (sMode === "maize" ? "A maize grain is a caryopsis fruit where pericarp fuses with testa, bearing a proteinaceous aleurone layer and shield-shaped scutellum." :
       (sMode === "gram" ? "Gram seeds possess two massive food-storing cotyledons and consume their endosperm prior to seed maturation." :
        "A drupe develops from a monocarpellary superior ovary with a stony endocarp protecting its solitary seed."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Family Solanaceae & Floral Formula (solanaceaefloral)
// -------------------------------------------------------------------------
window.SIMS.solanaceaefloral = (function(){
  var solTab = "formula"; // "formula", "diagram", "taxa"

  function setT(t){ solTab = t; draw(0); }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Calyx K(5)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Corolla C(5)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Epipetalous A5</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Ovary G(2) Oblique</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-form">Floral Formula Builder</button>' +
      '<button class="preset-btn" id="p-diag">Floral Diagram (Ground Plan)</button>' +
      '<button class="preset-btn" id="p-econ">Economic Species Showcase</button>';

    document.getElementById("p-form").onclick = function(){ setActivePreset(this); setT("formula"); };
    document.getElementById("p-diag").onclick = function(){ setActivePreset(this); setT("diagram"); };
    document.getElementById("p-econ").onclick = function(){ setActivePreset(this); setT("taxa"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Family Solanaceae (Potato Family) Taxonomic Studio</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Diagnostic floral formula: &#8853; &#9909; K&#8333;&#8325;&#8334; C&#8333;&#8325;&#8334;&#8212;A&#8325; G&#8333;&#8322;&#8334; (Superior Ovary).</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl();
    if(!svg) return;

    var m = '<defs>' +
      '<linearGradient id="solBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>' +
      '</defs>' +
      '<rect width="700" height="320" fill="url(#solBg)" rx="10"/>';

    if(solTab === "diagram"){
      // Floral Diagram of Solanaceae
      m += '<rect x="25" y="25" width="340" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="195" y="50" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">NCERT Fig 5.20: Floral Diagram of Solanaceae</text>';

      var cx = 195, cy = 165;
      // Mother axis (black dot at top)
      m += '<circle cx="' + cx + '" cy="68" r="5" fill="#cbd5e1"/>';
      m += '<text x="' + cx + '" y="62" fill="#94a3b8" font-size="8.5" text-anchor="middle">Mother Axis (Posterior)</text>';

      // Whorl 1: Calyx K(5) - 5 fused green sepals, valvate
      for(var si = 0; si < 5; si++){
        var sa1 = (si * 72 - 90 - 30) * Math.PI / 180;
        var sa2 = (si * 72 - 90 + 30) * Math.PI / 180;
        var sx1 = cx + Math.cos(sa1) * 85, sy1 = cy + Math.sin(sa1) * 85;
        var sx2 = cx + Math.cos(sa2) * 85, sy2 = cy + Math.sin(sa2) * 85;
        m += '<path d="M ' + sx1 + ',' + sy1 + ' A 85,85 0 0,1 ' + sx2 + ',' + sy2 + '" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round"/>';
      }
      // Gamosepalous fusion links
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="85" fill="none" stroke="#059669" stroke-width="1" stroke-dasharray="2,4"/>';

      // Whorl 2: Corolla C(5) - 5 fused petals, valvate, alternate with sepals
      for(var pi = 0; pi < 5; pi++){
        var pa1 = (pi * 72 - 90 + 36 - 28) * Math.PI / 180;
        var pa2 = (pi * 72 - 90 + 36 + 28) * Math.PI / 180;
        var px1 = cx + Math.cos(pa1) * 65, py1 = cy + Math.sin(pa1) * 65;
        var px2 = cx + Math.cos(pa2) * 65, py2 = cy + Math.sin(pa2) * 65;
        m += '<path d="M ' + px1 + ',' + py1 + ' A 65,65 0 0,1 ' + px2 + ',' + py2 + '" fill="none" stroke="#ec4899" stroke-width="4.5" stroke-linecap="round"/>';

        // Whorl 3: 5 Epipetalous stamens A5 attached to petal centers
        var stRad = (pi * 72 - 90 + 36) * Math.PI / 180;
        var stx = cx + Math.cos(stRad) * 45;
        var sty = cy + Math.sin(stRad) * 45;
        m += '<line x1="' + (cx + Math.cos(stRad) * 65) + '" y1="' + (cy + Math.sin(stRad) * 65) + '" x2="' + stx + '" y2="' + sty + '" stroke="#38bdf8" stroke-width="2"/>';
        m += '<circle cx="' + stx + '" cy="' + sty + '" r="4" fill="#38bdf8"/>';
      }

      // Whorl 4: G(2) Bicarpellary syncarpous ovary with OBLIQUE septum and swollen placenta
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="26" fill="#042f2e" stroke="#f59e0b" stroke-width="2.5"/>';
      // Oblique septum (rotated 45 deg)
      m += '<line x1="' + (cx - 18) + '" y1="' + (cy - 18) + '" x2="' + (cx + 18) + '" y2="' + (cy + 18) + '" stroke="#f59e0b" stroke-width="2.5"/>';
      // Swollen placentae with ovules
      m += '<circle cx="' + (cx + 9) + '" cy="' + (cy - 9) + '" r="9" fill="#d97706"/>';
      m += '<circle cx="' + (cx - 9) + '" cy="' + (cy + 9) + '" r="9" fill="#d97706"/>';
      m += '<circle cx="' + (cx + 9) + '" cy="' + (cy - 9) + '" r="2" fill="#fcd34d"/>';
      m += '<circle cx="' + (cx - 9) + '" cy="' + (cy + 9) + '" r="2" fill="#fcd34d"/>';

      m += '<text x="195" y="280" fill="#fcd34d" font-size="10.5" font-weight="700" text-anchor="middle">Oblique Bilocular Ovary with Swollen Placenta</text>';

      // Right Explanation Box
      m += '<rect x="385" y="25" width="290" height="270" rx="8" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="405" y="55" fill="#fcd34d" font-size="13" font-weight="700">Floral Diagram Architectural Analysis</text>';
      m += '<text x="405" y="85" fill="#cbd5e1" font-size="11">1. <strong style="color:#10b981">Calyx K(5):</strong> 5 fused sepals with valvate</text>';
      m += '<text x="405" y="100" fill="#cbd5e1" font-size="11">   aestivation; persistent in fruit.</text>';
      m += '<text x="405" y="125" fill="#cbd5e1" font-size="11">2. <strong style="color:#ec4899">Corolla C(5):</strong> 5 fused petals with valvate</text>';
      m += '<text x="405" y="140" fill="#cbd5e1" font-size="11">   aestivation; alternating with sepals.</text>';
      m += '<text x="405" y="165" fill="#cbd5e1" font-size="11">3. <strong style="color:#38bdf8">Androecium A5:</strong> 5 stamens, polyandrous,</text>';
      m += '<text x="405" y="180" fill="#cbd5e1" font-size="11">   <strong>epipetalous</strong> (filaments joined to petals).</text>';
      m += '<text x="405" y="205" fill="#cbd5e1" font-size="11">4. <strong style="color:#f59e0b">Gynoecium G(2):</strong> Bicarpellary syncarpous,</text>';
      m += '<text x="405" y="220" fill="#cbd5e1" font-size="11">   superior ovary, bilocular, <strong>oblique septum</strong>,</text>';
      m += '<text x="405" y="235" fill="#cbd5e1" font-size="11">   swollen placenta with many ovules on axile.</text>';

    } else if(solTab === "formula"){
      // Floral formula breakdown cards
      m += '<rect x="25" y="25" width="650" height="270" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>';
      m += '<text x="350" y="55" fill="#fcd34d" font-size="14" font-weight="700" text-anchor="middle">Semi-Technical Floral Formula of Family Solanaceae</text>';

      // Giant Formula Banner
      m += '<rect x="60" y="75" width="580" height="60" rx="8" fill="#0b1329" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="350" y="115" fill="#f8fafc" font-size="22" font-weight="700" text-anchor="middle">⊕   ⚥   K₍₅₎   C₍₅₎ — A₅   G₍₂₎</text>';
      // Adhesion overbracket
      m += '<path d="M 370,88 L 370,82 L 445,82 L 445,88" fill="none" stroke="#38bdf8" stroke-width="2.5"/>';

      var fParts = [
        { sym: "⊕", name: "Actinomorphic", desc: "Radial symmetry in any plane", col: "#38bdf8" },
        { sym: "⚥", name: "Bisexual", desc: "Hermaphrodite (Stamens + Carpels)", col: "#ec4899" },
        { sym: "K₍₅₎", name: "Calyx 5 Fused", desc: "Gamosepalous, valvate, persistent", col: "#10b981" },
        { sym: "C₍₅₎ ⌒ A₅", name: "Epipetalous", desc: "5 Petals fused, 5 Stamens attached", col: "#38bdf8" },
        { sym: "G₍₂₎", name: "Superior Ovary", desc: "Bicarpellary syncarpous superior", col: "#f59e0b" }
      ];

      for(var fi = 0; fi < fParts.length; fi++){
        var fx = 60 + fi * 118;
        var fp = fParts[fi];
        m += '<rect x="' + fx + '" y="150" width="108" height="125" rx="6" fill="#0f172a" stroke="' + fp.col + '" stroke-width="1.5"/>';
        m += '<text x="' + (fx + 54) + '" y="175" fill="' + fp.col + '" font-size="14" font-weight="700" text-anchor="middle">' + fp.sym + '</text>';
        m += '<text x="' + (fx + 54) + '" y="198" fill="#f8fafc" font-size="10" font-weight="600" text-anchor="middle">' + fp.name + '</text>';
        m += '<foreignObject x="' + (fx + 6) + '" y="205" width="96" height="65">';
        m += '<div style="color:#94a3b8;font-size:9px;line-height:1.25;text-align:center;">' + fp.desc + '</div>';
        m += '</foreignObject>';
      }

    } else {
      // Economic Taxa Showcase
      m += '<rect x="25" y="25" width="650" height="270" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="350" y="55" fill="#34d399" font-size="14" font-weight="700" text-anchor="middle">NCERT Economic Importance of Family Solanaceae</text>';

      var ecoGroups = [
        {
          cat: "Food Crops",
          col: "#10b981",
          plants: "Tomato (Solanum lycopersicum)\nBrinjal (Solanum melongena)\nPotato (Solanum tuberosum)"
        },
        {
          cat: "Spices",
          col: "#ef4444",
          plants: "Chilli (Capsicum annuum)\nRich in capsaicin pungent alkaloids"
        },
        {
          cat: "Medicinal Plants",
          col: "#38bdf8",
          plants: "Belladonna (Atropa belladonna)\nAshwagandha (Withania somnifera)"
        },
        {
          cat: "Fumigatory & Ornamentals",
          col: "#f59e0b",
          plants: "Tobacco (Nicotiana tabacum)\nPetunia (Ornamental garden beauty)"
        }
      ];

      for(var ei = 0; ei < ecoGroups.length; ei++){
        var ex = 45 + ei * 155;
        var eg = ecoGroups[ei];
        m += '<rect x="' + ex + '" y="80" width="145" height="195" rx="6" fill="#1e293b" stroke="' + eg.col + '" stroke-width="1.5"/>';
        m += '<text x="' + (ex + 72) + '" y="108" fill="' + eg.col + '" font-size="11.5" font-weight="700" text-anchor="middle">' + eg.cat + '</text>';
        var pLines = eg.plants.split("\n");
        for(var pli = 0; pli < pLines.length; pli++){
          m += '<text x="' + (ex + 72) + '" y="' + (142 + pli * 24) + '" fill="#e2e8f0" font-size="9.5" text-anchor="middle">' + pLines[pli] + '</text>';
        }
      }
    }

    svg.innerHTML = m;

    readout(
      cell("Family", "Solanaceae (Potato Family)", "#fcd34d") +
      cell("Floral Symmetry", "Actinomorphic (&#8853;)", "#38bdf8") +
      cell("Stamens", "5 Epipetalous (C-A fused)", "#ec4899") +
      cell("Ovary", "Bicarpellary Superior G&#8333;&#8322;&#8334; Oblique", "#10b981")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Taxonomic Diagnosis:</span> ' +
      "Solanaceae is unambiguously diagnosed by actinomorphic symmetry, persistent gamosepalous calyx, epipetalous stamens, and a bicarpellary syncarpous superior ovary with an oblique septum and swollen placenta."
    );
  }

  return { mount: mount, draw: draw };
})();
