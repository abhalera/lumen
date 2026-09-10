// kebo107 interactive simulations: Structural Organisation in Animals
window.SIMS = window.SIMS || {};

function cell(title, val, color) {
  return '<div class="readout-cell">' +
    '<div class="readout-label">' + title + '</div>' +
    '<div class="readout-val" style="color:' + (color || 'var(--primary)') + ';">' + val + '</div>' +
    '</div>';
}

function readout(html) {
  var r = document.getElementById("lab-readouts");
  if (r) r.innerHTML = html;
}

function verdict(html) {
  var n = document.getElementById("lab-verdict");
  if (n) n.innerHTML = html;
}

// -------------------------------------------------------------------------
// 1. SIMULATION 1: Animal Tissue Architect & Matrix (tissueclasslab)
// -------------------------------------------------------------------------
window.SIMS.tissueclasslab = (function(){
  var tType = "epithelial"; // "epithelial", "connective", "muscular", "neural"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Epithelial</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Connective</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Muscular</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Neural</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.tissueclasslab.setTissue(\'epithelial\')">Epithelial</button>' +
      '<button class="preset-btn" onclick="SIMS.tissueclasslab.setTissue(\'connective\')">Connective</button>' +
      '<button class="preset-btn" onclick="SIMS.tissueclasslab.setTissue(\'muscular\')">Muscular</button>' +
      '<button class="preset-btn" onclick="SIMS.tissueclasslab.setTissue(\'neural\')">Neural</button>';
  }

  function setTissue(t){
    tType = t;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#090d16"/>';

    if (tType === "epithelial") {
      m += '<text x="' + (W/2) + '" y="35" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EPITHELIAL TISSUE: Continuous Cellular Barrier & Free Surface</text>';
      // Basement membrane
      m += '<line x1="80" y1="260" x2="' + (W - 80) + '" y2="260" stroke="#94a3b8" stroke-width="4" stroke-dasharray="6,4"/>';
      m += '<text x="' + (W - 70) + '" y="265" fill="#94a3b8" font-size="12">Basement Membrane</text>';
      // Columnar/cuboidal cells with nuclei
      var count = 8;
      var cW = (W - 180) / count;
      for (var i = 0; i < count; i++) {
        var cx = 90 + i * cW;
        m += '<rect x="' + cx + '" y="130" width="' + (cW - 4) + '" height="130" rx="4" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="2"/>';
        // Nucleus
        m += '<circle cx="' + (cx + cW/2 - 2) + '" cy="200" r="10" fill="#0284c7"/>';
        // Microvilli on free surface
        for (var v = 0; v < 4; v++) {
          var vx = cx + 4 + v * ((cW - 12)/3);
          m += '<line x1="' + vx + '" y1="130" x2="' + vx + '" y2="115" stroke="#38bdf8" stroke-width="2.5"/>';
        }
      }
      // Free surface label
      m += '<text x="' + (W/2) + '" y="100" fill="#bae6fd" font-size="13" text-anchor="middle">Free Surface (Facing Body Fluid or Lumen) with Microvilli</text>';
      // Cell junctions
      for (var j = 1; j < count; j++) {
        var jx = 90 + j * cW - 2;
        m += '<circle cx="' + jx + '" cy="150" r="3" fill="#f43f5e"/>';
        m += '<circle cx="' + jx + '" cy="180" r="3" fill="#f43f5e"/>';
      }
      m += '<text x="100" y="300" fill="#cbd5e1" font-size="12">Tight Junctions & Desmosomes seal adjacent plasma membranes</text>';
      m += '<text x="100" y="325" fill="#cbd5e1" font-size="12">Avascular: Dependent on diffusion from underlying connective tissue capillary bed</text>';
    } else if (tType === "connective") {
      m += '<text x="' + (W/2) + '" y="35" fill="#10b981" font-size="16" font-weight="bold" text-anchor="middle">CONNECTIVE TISSUE: Abundant Extracellular Matrix & Fibres</text>';
      // Matrix background
      m += '<rect x="80" y="70" width="' + (W - 160) + '" height="260" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-width="2"/>';
      // Collagen fibres (thick wavy bundles)
      m += '<path d="M 120 120 Q 220 150 320 120 T 520 130" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>';
      m += '<path d="M 150 240 Q 280 200 400 250 T 600 220" fill="none" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>';
      // Elastic fibres (thin branching lines)
      m += '<path d="M 130 180 L 260 210 L 390 170 L 510 200" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="4,2"/>';
      m += '<path d="M 260 210 L 310 260" fill="none" stroke="#e2e8f0" stroke-width="2"/>';
      // Fibroblasts
      m += '<polygon points="200,160 240,155 220,175" fill="#10b981" stroke="#059669" stroke-width="1.5"/>';
      m += '<circle cx="220" cy="163" r="4" fill="#047857"/>';
      m += '<text x="245" y="165" fill="#10b981" font-size="11">Fibroblast</text>';
      // Macrophage
      m += '<circle cx="420" cy="140" r="16" fill="rgba(244,63,94,0.4)" stroke="#f43f5e" stroke-width="2"/>';
      m += '<circle cx="420" cy="140" r="7" fill="#f43f5e"/>';
      m += '<text x="445" y="145" fill="#f43f5e" font-size="11">Macrophage (Phagocytic)</text>';
      // Mast cell
      m += '<rect x="330" y="210" width="28" height="22" rx="6" fill="#a855f7" stroke="#7e22ce" stroke-width="1.5"/>';
      m += '<text x="365" y="225" fill="#a855f7" font-size="11">Mast Cell (Histamine/Heparin)</text>';
      // Blood capillary
      m += '<rect x="110" y="270" width="180" height="36" rx="18" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="2"/>';
      m += '<circle cx="140" cy="288" r="8" fill="#ef4444"/><circle cx="170" cy="288" r="8" fill="#ef4444"/><circle cx="200" cy="288" r="8" fill="#ef4444"/>';
      m += '<text x="295" y="293" fill="#ef4444" font-size="11">Vascular Capillary Supply</text>';
      // Labels
      m += '<text x="' + (W - 220) + '" y="100" fill="#f59e0b" font-size="12">Collagen Fibres (Tensile Strength)</text>';
      m += '<text x="' + (W - 220) + '" y="120" fill="#e2e8f0" font-size="12">Elastin Fibres (Elastic Recoil)</text>';
    } else if (tType === "muscular") {
      m += '<text x="' + (W/2) + '" y="35" fill="#ec4899" font-size="16" font-weight="bold" text-anchor="middle">MUSCULAR TISSUE: Contractile Myofibrils (Actin & Myosin)</text>';
      // Skeletal / Cardiac striated fibres
      for (var f = 0; f < 4; f++) {
        var fy = 80 + f * 55;
        m += '<rect x="100" y="' + fy + '" width="' + (W - 200) + '" height="42" rx="6" fill="rgba(236,72,153,0.15)" stroke="#ec4899" stroke-width="2"/>';
        // Striations
        for (var s = 115; s < W - 115; s += 16) {
          m += '<line x1="' + s + '" y1="' + (fy + 4) + '" x2="' + s + '" y2="' + (fy + 38) + '" stroke="#f472b6" stroke-width="2" opacity="0.6"/>';
        }
        // Nuclei (peripheral in skeletal)
        m += '<ellipse cx="180" cy="' + (fy + 10) + '" rx="14" ry="5" fill="#be185d"/>';
        m += '<ellipse cx="380" cy="' + (fy + 10) + '" rx="14" ry="5" fill="#be185d"/>';
      }
      // Intercalated disc in cardiac comparison
      m += '<line x1="300" y1="135" x2="300" y2="177" stroke="#fbbf24" stroke-width="4"/>';
      m += '<text x="305" y="160" fill="#fbbf24" font-size="11">Intercalated Disc (Gap Junctions in Cardiac)</text>';
      m += '<text x="100" y="325" fill="#cbd5e1" font-size="12">Contractility: Mediates bodily movement, heart beating, and peristalsis</text>';
      m += '<text x="100" y="350" fill="#cbd5e1" font-size="12">Classification: Skeletal (Striated, Voluntary), Smooth (Visceral, Involuntary), Cardiac (Heart, Branched)</text>';
    } else { // neural
      m += '<text x="' + (W/2) + '" y="35" fill="#f59e0b" font-size="16" font-weight="bold" text-anchor="middle">NEURAL TISSUE: Excitable Neurons & Supportive Neuroglia</text>';
      // Multipolar neuron
      // Soma
      m += '<circle cx="200" cy="180" r="35" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<circle cx="200" cy="180" r="14" fill="#d97706"/>';
      m += '<text x="175" y="185" fill="#fff" font-size="11" font-weight="bold">Soma</text>';
      // Dendrites
      m += '<path d="M 170 160 L 120 130 M 180 150 L 140 100 M 165 195 L 115 220 M 180 210 L 130 250" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>';
      m += '<text x="90" y="105" fill="#fcd34d" font-size="12">Dendrites (Inputs)</text>';
      // Axon
      m += '<line x1="235" y1="180" x2="' + (W - 200) + '" y2="180" stroke="#f59e0b" stroke-width="4"/>';
      // Myelin sheaths
      for (var sc = 260; sc < W - 240; sc += 65) {
        m += '<rect x="' + sc + '" y="165" width="50" height="30" rx="6" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + (sc + 7) + '" y="184" fill="#38bdf8" font-size="10">Schwann</text>';
      }
      // Axon terminals
      var atX = W - 180;
      m += '<path d="M ' + (W - 200) + ' 180 L ' + atX + ' 150 M ' + (W - 200) + ' 180 L ' + atX + ' 180 M ' + (W - 200) + ' 180 L ' + atX + ' 210" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>';
      m += '<circle cx="' + atX + '" cy="150" r="5" fill="#f59e0b"/><circle cx="' + atX + '" cy="180" r="5" fill="#f59e0b"/><circle cx="' + atX + '" cy="210" r="5" fill="#f59e0b"/>';
      m += '<text x="' + (atX + 15) + '" y="185" fill="#f59e0b" font-size="12">Synaptic Knobs</text>';
      // Neuroglial cells
      m += '<polygon points="350,260 365,245 380,260 365,275" fill="#ec4899" stroke="#db2777" stroke-width="1.5"/>';
      m += '<text x="390" y="265" fill="#ec4899" font-size="11">Neuroglial Support Cell (> 50% Brain Volume)</text>';
      m += '<text x="100" y="340" fill="#cbd5e1" font-size="12">Excitability & Conductivity: Generates action potentials across synaptic clefts</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Tissue Archetype", tType.toUpperCase(), tType === "epithelial" ? "#38bdf8" : (tType === "connective" ? "#10b981" : (tType === "muscular" ? "#ec4899" : "#f59e0b"))) +
      cell("Cell Spacing", tType === "epithelial" ? "Compact / Minimal Matrix" : (tType === "connective" ? "Widely Spaced / Abundant Matrix" : "Fibre Bundles"), "#38bdf8") +
      cell("Vascularity", tType === "epithelial" ? "Avascular (Diffusion Bound)" : (tType === "connective" ? "Highly Vascular (Except Cartilage)" : "Rich Capillary Beds"), "#10b981") +
      cell("Core Function", tType === "epithelial" ? "Covering, Absorption, Secretion" : (tType === "connective" ? "Support, Binding, Protection" : (tType === "muscular" ? "Contraction & Locomotion" : "Impulse Conduction")), "#fcd34d")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Organ Integration Rule:</span> ' +
      (tType === "epithelial" ? "Epithelial sheets provide boundary defense and secretory surfaces, supported by basement membranes." :
       (tType === "connective" ? "Connective tissue builds the mechanical scaffolding and transport medium (blood and lymph) uniting organs." :
        (tType === "muscular" ? "Muscular tissue powers both voluntary movements and visceral involuntary pump cycles." :
         "Neural tissue constitutes the electrical telecommunications network regulating organismal homeostasis.")))
    );
  }

  return { mount: mount, setTissue: setTissue, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Frog Morphology & Dimorphism (frogmorphologylab)
// -------------------------------------------------------------------------
window.SIMS.frogmorphologylab = (function(){
  var sex = "male"; // "male", "female"
  var view = "dorsal"; // "dorsal", "ventral"

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Olive Green Dorsal Skin</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fcd34d;"></span><span>Pale Yellow Ventral Skin</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Vocal Sac (Male)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Copulatory Pad (Male)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.frogmorphologylab.setSex(\'male\')">Male Frog</button>' +
      '<button class="preset-btn" onclick="SIMS.frogmorphologylab.setSex(\'female\')">Female Frog</button>' +
      '<button class="preset-btn" onclick="SIMS.frogmorphologylab.toggleView()">Flip View</button>';
  }

  function setSex(s){
    sex = s;
    draw();
  }

  function toggleView(){
    view = (view === "dorsal") ? "ventral" : "dorsal";
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c14"/>';
    var cx = W / 2;
    var cy = H / 2 + 10;

    m += '<text x="' + cx + '" y="35" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">RANA TIGRINA MORPHOLOGY & SEXUAL DIMORPHISM (' + sex.toUpperCase() + ' - ' + view.toUpperCase() + ')</text>';

    var skinFill = (view === "dorsal") ? "#3f6212" : "#fef08a";
    var skinStroke = (view === "dorsal") ? "#65a30d" : "#eab308";

    // Hindlimbs (Large muscular legs, 5 digits with swimming web)
    // Left hindlimb
    m += '<path d="M ' + (cx - 50) + ' ' + (cy + 60) + ' Q ' + (cx - 160) + ' ' + (cy + 100) + ' ' + (cx - 130) + ' ' + (cy + 150) + ' T ' + (cx - 180) + ' ' + (cy + 170) + '" fill="none" stroke="' + skinStroke + '" stroke-width="22" stroke-linecap="round"/>';
    // Left foot webbed (5 digits)
    m += '<polygon points="' + (cx - 180) + ',' + (cy + 170) + ' ' + (cx - 240) + ',' + (cy + 140) + ' ' + (cx - 250) + ',' + (cy + 170) + ' ' + (cx - 230) + ',' + (cy + 195) + '" fill="rgba(56,189,248,0.4)" stroke="#38bdf8" stroke-width="2"/>';
    // Right hindlimb
    m += '<path d="M ' + (cx + 50) + ' ' + (cy + 60) + ' Q ' + (cx + 160) + ' ' + (cy + 100) + ' ' + (cx + 130) + ' ' + (cy + 150) + ' T ' + (cx + 180) + ' ' + (cy + 170) + '" fill="none" stroke="' + skinStroke + '" stroke-width="22" stroke-linecap="round"/>';
    // Right foot webbed (5 digits)
    m += '<polygon points="' + (cx + 180) + ',' + (cy + 170) + ' ' + (cx + 240) + ',' + (cy + 140) + ' ' + (cx + 250) + ',' + (cy + 170) + ' ' + (cx + 230) + ',' + (cy + 195) + '" fill="rgba(56,189,248,0.4)" stroke="#38bdf8" stroke-width="2"/>';

    // Forelimbs (4 digits)
    // Left forelimb
    m += '<path d="M ' + (cx - 45) + ' ' + (cy - 30) + ' Q ' + (cx - 110) + ' ' + (cy - 50) + ' ' + (cx - 130) + ' ' + (cy - 10) + '" fill="none" stroke="' + skinStroke + '" stroke-width="14" stroke-linecap="round"/>';
    // 4 digits on left hand
    m += '<line x1="' + (cx - 130) + '" y1="' + (cy - 10) + '" x2="' + (cx - 150) + '" y2="' + (cy - 20) + '" stroke="' + skinStroke + '" stroke-width="4"/>';
    m += '<line x1="' + (cx - 130) + '" y1="' + (cy - 10) + '" x2="' + (cx - 155) + '" y2="' + (cy - 8) + '" stroke="' + skinStroke + '" stroke-width="4"/>';
    m += '<line x1="' + (cx - 130) + '" y1="' + (cy - 10) + '" x2="' + (cx - 150) + '" y2="' + (cy + 5) + '" stroke="' + skinStroke + '" stroke-width="4"/>';
    m += '<line x1="' + (cx - 130) + '" y1="' + (cy - 10) + '" x2="' + (cx - 140) + '" y2="' + (cy + 15) + '" stroke="' + skinStroke + '" stroke-width="4"/>';

    // Right forelimb
    m += '<path d="M ' + (cx + 45) + ' ' + (cy - 30) + ' Q ' + (cx + 110) + ' ' + (cy - 50) + ' ' + (cx + 130) + ' ' + (cy - 10) + '" fill="none" stroke="' + skinStroke + '" stroke-width="14" stroke-linecap="round"/>';
    // 4 digits on right hand
    m += '<line x1="' + (cx + 130) + '" y1="' + (cy - 10) + '" x2="' + (cx + 150) + '" y2="' + (cy - 20) + '" stroke="' + skinStroke + '" stroke-width="4"/>';
    m += '<line x1="' + (cx + 130) + '" y1="' + (cy - 10) + '" x2="' + (cx + 155) + '" y2="' + (cy - 8) + '" stroke="' + skinStroke + '" stroke-width="4"/>';
    m += '<line x1="' + (cx + 130) + '" y1="' + (cy - 10) + '" x2="' + (cx + 150) + '" y2="' + (cy + 5) + '" stroke="' + skinStroke + '" stroke-width="4"/>';
    m += '<line x1="' + (cx + 130) + '" y1="' + (cy - 10) + '" x2="' + (cx + 140) + '" y2="' + (cy + 15) + '" stroke="' + skinStroke + '" stroke-width="4"/>';

    // Copulatory pad on male forelimb digit 1!
    if (sex === "male") {
      m += '<circle cx="' + (cx - 145) + '" cy="' + (cy - 18) + '" r="6" fill="#ec4899" stroke="#fff" stroke-width="1.5"/>';
      m += '<circle cx="' + (cx + 145) + '" cy="' + (cy - 18) + '" r="6" fill="#ec4899" stroke="#fff" stroke-width="1.5"/>';
      m += '<text x="' + (cx + 155) + '" y="' + (cy - 25) + '" fill="#ec4899" font-size="11" font-weight="bold">Copulatory / Nuptial Pad</text>';
    }

    // Body Trunk & Head
    m += '<ellipse cx="' + cx + '" cy="' + (cy + 30) + '" rx="55" ry="85" fill="' + skinFill + '" stroke="' + skinStroke + '" stroke-width="3"/>';
    m += '<polygon points="' + (cx - 45) + ',' + (cy - 20) + ' ' + cx + ',' + (cy - 110) + ' ' + (cx + 45) + ',' + (cy - 20) + '" fill="' + skinFill + '" stroke="' + skinStroke + '" stroke-width="3"/>';

    if (view === "dorsal") {
      // Dorsal spots (Camouflage mimicry)
      var spots = [
        {x: cx - 20, y: cy - 40, r: 8}, {x: cx + 25, y: cy - 30, r: 10},
        {x: cx - 15, y: cy + 10, r: 12}, {x: cx + 20, y: cy + 20, r: 11},
        {x: cx - 25, y: cy + 60, r: 9}, {x: cx + 15, y: cy + 75, r: 8},
        {x: cx, y: cy - 10, r: 14}
      ];
      for (var sp = 0; sp < spots.length; sp++) {
        m += '<ellipse cx="' + spots[sp].x + '" cy="' + spots[sp].y + '" rx="' + spots[sp].r + '" ry="' + (spots[sp].r * 0.7) + '" fill="#142807"/>';
      }
      // Bulging eyes with nictitating membrane
      m += '<circle cx="' + (cx - 28) + '" cy="' + (cy - 75) + '" r="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<circle cx="' + (cx - 28) + '" cy="' + (cy - 75) + '" r="5" fill="#f59e0b"/>';
      m += '<circle cx="' + (cx + 28) + '" cy="' + (cy - 75) + '" r="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<circle cx="' + (cx + 28) + '" cy="' + (cy - 75) + '" r="5" fill="#f59e0b"/>';
      // Tympanum
      m += '<circle cx="' + (cx - 42) + '" cy="' + (cy - 50) + '" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>';
      m += '<text x="' + (cx - 100) + '" y="' + (cy - 50) + '" fill="#94a3b8" font-size="11">Tympanum</text>';
      m += '<circle cx="' + (cx + 42) + '" cy="' + (cy - 50) + '" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>';
      m += '<text x="' + (cx + 55) + '" y="' + (cy - 50) + '" fill="#94a3b8" font-size="11">Tympanum</text>';
      // Cloacal aperture at posterior tip
      m += '<circle cx="' + cx + '" cy="' + (cy + 112) + '" r="4" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>';
      m += '<text x="' + (cx + 10) + '" y="' + (cy + 116) + '" fill="#94a3b8" font-size="10">Cloacal Aperture</text>';
    } else {
      // Ventral view
      m += '<text x="' + cx + '" y="' + (cy + 30) + '" fill="#ca8a04" font-size="12" font-weight="bold" text-anchor="middle">Smooth, Pale Yellow Mucous Integument</text>';
      if (sex === "male") {
        // Subgular vocal sacs
        m += '<ellipse cx="' + (cx - 30) + '" cy="' + (cy - 40) + '" rx="18" ry="14" fill="rgba(56,189,248,0.5)" stroke="#38bdf8" stroke-width="2"/>';
        m += '<ellipse cx="' + (cx + 30) + '" cy="' + (cy - 40) + '" rx="18" ry="14" fill="rgba(56,189,248,0.5)" stroke="#38bdf8" stroke-width="2"/>';
        m += '<text x="' + cx + '" y="' + (cy - 35) + '" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Pair of Vocal Sacs</text>';
      } else {
        m += '<text x="' + cx + '" y="' + (cy - 35) + '" fill="#94a3b8" font-size="11" text-anchor="middle">Vocal Sacs Absent (Female)</text>';
      }
      m += '<text x="' + cx + '" y="' + (cy + 60) + '" fill="#713f12" font-size="11" text-anchor="middle">Never Drinks Water (100% Absorbed Osmotically)</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Observed Sex", sex.toUpperCase(), sex === "male" ? "#38bdf8" : "#ec4899") +
      cell("View Surface", view.toUpperCase() + (view === "dorsal" ? " (Olive Spotted)" : " (Pale Yellow)"), "#10b981") +
      cell("Vocal Sacs", sex === "male" ? "PRESENT (Throat Pouch)" : "ABSENT", sex === "male" ? "#38bdf8" : "#94a3b8") +
      cell("Copulatory Pad", sex === "male" ? "PRESENT (Forelimb Digit 1)" : "ABSENT", sex === "male" ? "#ec4899" : "#94a3b8")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Dimorphism & Adaptation Rule:</span> ' +
      (sex === "male" ? "Male Rana tigrina possesses subgular vocal resonance sacs for mating calls and glandular copulatory pads on forelimb digit 1 for gripping during amplexus." :
       "Female Rana tigrina lacks vocal sacs and nuptial pads; both sexes share moist vascularised mucous skin that absorbs 100% of body water.")
    );
  }

  return { mount: mount, setSex: setSex, toggleView: toggleView, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Frog Digestive System (frogdigestivesim - Exercise 7.1)
// -------------------------------------------------------------------------
window.SIMS.frogdigestivesim = (function(){
  var stage = 0; // 0..4: tongue, stomach, hepatopancreas, ileum, cloaca
  var stages = [
    { name: "Prehensile Tongue & Mouth", organ: "Buccal Cavity", action: "Catapult flick captures prey; maxillary teeth grip" },
    { name: "Stomach Hydrolysis", organ: "Stomach", action: "Gastric juice & HCl churn food into acidic chyme" },
    { name: "Hepato-Pancreatic Duct", organ: "Duodenum", action: "Bile emulsifies fat; pancreatic juice digests protein & carbs" },
    { name: "Intestinal Villous Absorption", organ: "Ileum / Intestine", action: "Villi & microvilli absorb digested nutrients into blood & lymph" },
    { name: "Rectal Egestion & Cloaca", organ: "Cloaca & Aperture", action: "Feces stored in rectum, discharged through cloacal aperture" }
  ];

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Liver & Gall Bladder</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Stomach & Pancreas</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Small Intestine (Duodenum/Ileum)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#8b5cf6;"></span><span>Cloaca & Bilobed Bladder</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.frogdigestivesim.setStage(0)">1. Tongue</button>' +
      '<button class="preset-btn" onclick="SIMS.frogdigestivesim.setStage(1)">2. Stomach</button>' +
      '<button class="preset-btn" onclick="SIMS.frogdigestivesim.setStage(2)">3. Liver/Pancreas</button>' +
      '<button class="preset-btn" onclick="SIMS.frogdigestivesim.setStage(3)">4. Intestine</button>' +
      '<button class="preset-btn" onclick="SIMS.frogdigestivesim.setStage(4)">5. Cloaca</button>';
  }

  function setStage(s){
    stage = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#0a0f1d"/>';
    m += '<text x="' + (W/2) + '" y="30" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">EXERCISE 7.1: FROG DIGESTIVE SYSTEM & ENZYMATIC ARCHITECTURE</text>';

    // Schematic Anatomical Layout of Frog Digestive System
    var ox = 260;
    var oy = 70;

    // 1. Oesophagus
    m += '<rect x="' + (ox + 40) + '" y="' + oy + '" width="24" height="40" rx="6" fill="#64748b" stroke="#94a3b8" stroke-width="2"/>';
    m += '<text x="' + (ox - 40) + '" y="' + (oy + 25) + '" fill="#cbd5e1" font-size="12">Oesophagus (Short)</text>';

    // 2. Stomach (J-shaped)
    var stColor = (stage === 1) ? "#f59e0b" : "#b45309";
    m += '<path d="M ' + (ox + 52) + ' ' + (oy + 40) + ' C ' + (ox + 10) + ' ' + (oy + 60) + ' ' + (ox + 10) + ' ' + (oy + 120) + ' ' + (ox + 50) + ' ' + (oy + 140) + '" fill="none" stroke="' + stColor + '" stroke-width="32" stroke-linecap="round"/>';
    m += '<text x="' + (ox - 70) + '" y="' + (oy + 95) + '" fill="#fcd34d" font-size="12" font-weight="bold">Stomach (HCl + Pepsin)</text>';

    // 3. Liver & Gall Bladder
    var livColor = (stage === 2) ? "#ef4444" : "#991b1b";
    // Liver lobes
    m += '<path d="M ' + (ox + 90) + ' ' + (oy + 20) + ' Q ' + (ox + 160) + ' ' + (oy + 40) + ' ' + (ox + 140) + ' ' + (oy + 100) + ' Z" fill="' + livColor + '" opacity="0.85"/>';
    m += '<text x="' + (ox + 155) + '" y="' + (oy + 50) + '" fill="#fca5a5" font-size="12">Liver Lobes (Bile)</text>';
    // Gall bladder
    m += '<circle cx="' + (ox + 95) + '" cy="' + (oy + 90) + '" r="12" fill="#22c55e" stroke="#15803d" stroke-width="2"/>';
    m += '<text x="' + (ox + 115) + '" y="' + (oy + 95) + '" fill="#86efac" font-size="11">Gall Bladder</text>';

    // 4. Pancreas
    m += '<ellipse cx="' + (ox + 75) + '" cy="' + (oy + 145) + '" rx="22" ry="8" fill="#eab308" stroke="#ca8a04" stroke-width="1.5"/>';
    m += '<text x="' + (ox + 105) + '" y="' + (oy + 145) + '" fill="#fde047" font-size="11">Pancreas</text>';

    // 5. Duodenum (U-turn loop)
    var duoColor = (stage === 2 || stage === 3) ? "#10b981" : "#047857";
    m += '<path d="M ' + (ox + 50) + ' ' + (oy + 140) + ' C ' + (ox + 80) + ' ' + (oy + 155) + ' ' + (ox + 80) + ' ' + (oy + 185) + ' ' + (ox + 45) + ' ' + (oy + 195) + '" fill="none" stroke="' + duoColor + '" stroke-width="18" stroke-linecap="round"/>';
    m += '<text x="' + (ox + 100) + '" y="' + (oy + 180) + '" fill="#6ee7b7" font-size="11">Duodenum</text>';

    // 6. Ileum / Small Intestine (coils)
    var ileColor = (stage === 3) ? "#10b981" : "#065f46";
    m += '<path d="M ' + (ox + 45) + ' ' + (oy + 195) + ' C ' + (ox + 10) + ' ' + (oy + 215) + ' ' + (ox + 90) + ' ' + (oy + 235) + ' ' + (ox + 50) + ' ' + (oy + 255) + '" fill="none" stroke="' + ileColor + '" stroke-width="16" stroke-linecap="round"/>';
    m += '<text x="' + (ox - 80) + '" y="' + (oy + 230) + '" fill="#a7f3d0" font-size="12">Ileum (Villi Absorptive)</text>';

    // 7. Rectum
    var recColor = (stage === 4) ? "#8b5cf6" : "#6d28d9";
    m += '<rect x="' + (ox + 35) + '" y="' + (oy + 255) + '" width="30" height="35" rx="6" fill="' + recColor + '" stroke="#a78bfa" stroke-width="2"/>';
    m += '<text x="' + (ox - 65) + '" y="' + (oy + 275) + '" fill="#c4b5fd" font-size="11">Rectum (Fecal)</text>';

    // 8. Cloaca & Urinary Bladder
    m += '<polygon points="' + (ox + 30) + ',' + (oy + 290) + ' ' + (ox + 70) + ',' + (oy + 290) + ' ' + (ox + 50) + ',' + (oy + 325) + '" fill="#7c3aed" stroke="#c4b5fd" stroke-width="2"/>';
    m += '<text x="' + (ox + 80) + '" y="' + (oy + 305) + '" fill="#ddd6fe" font-size="12" font-weight="bold">Cloaca</text>';

    // Ventral bilobed urinary bladder
    m += '<path d="M ' + (ox + 20) + ' ' + (oy + 310) + ' Q ' + (ox - 20) + ' ' + (oy + 315) + ' ' + (ox - 10) + ' ' + (oy + 295) + ' Q ' + (ox + 20) + ' ' + (oy + 300) + ' ' + (ox + 30) + ' ' + (oy + 310) + '" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (ox - 110) + '" y="' + (oy + 310) + '" fill="#38bdf8" font-size="11">Bilobed Urinary Bladder</text>';

    // Highlight box for active stage
    m += '<rect x="490" y="70" width="210" height="230" rx="8" fill="rgba(30,41,59,0.8)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="595" y="95" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">ACTIVE STAGE ' + (stage + 1) + '/5</text>';
    m += '<text x="505" y="125" fill="#fcd34d" font-size="12" font-weight="bold">' + stages[stage].name + '</text>';
    m += '<text x="505" y="150" fill="#94a3b8" font-size="11">Organ: ' + stages[stage].organ + '</text>';
    m += '<foreignObject x="505" y="170" width="180" height="120"><div xmlns="http://www.w3.org/1999/xhtml" style="color:#cbd5e1;font-size:11px;line-height:1.4;">' + stages[stage].action + '</div></foreignObject>';

    svg.innerHTML = m;

    readout(
      cell("Current Sector", stages[stage].name, "#38bdf8") +
      cell("Target Organ", stages[stage].organ, "#10b981") +
      cell("Canal Length", "Short (Carnivorous Trait)", "#f59e0b") +
      cell("Common Duct", "Hepato-Pancreatic to Duodenum", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 7.1 Solution Guide:</span> ' +
      "The frog alimentary canal comprises: short oesophagus -> J-stomach (gastric digestion) -> duodenum (receives common bile duct carrying liver bile and pancreatic enzymes) -> coiled ileum (villi/microvilli absorption) -> rectum -> cloaca discharging through cloacal aperture."
    );
  }

  return { mount: mount, setStage: setStage, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Tri-Modal Respiration (frogrespiratorysim)
// -------------------------------------------------------------------------
window.SIMS.frogrespiratorysim = (function(){
  var mode = "cutaneous"; // "cutaneous", "buccopharyngeal", "pulmonary"

  function mount(){
    App.state.maxT = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cutaneous (Moist Skin)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Buccopharyngeal (Cavity Floor)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Pulmonary (Paired Sac Lungs)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.frogrespiratorysim.setMode(\'cutaneous\')">Cutaneous (Water/Burrow)</button>' +
      '<button class="preset-btn" onclick="SIMS.frogrespiratorysim.setMode(\'buccopharyngeal\')">Buccal (Land Resting)</button>' +
      '<button class="preset-btn" onclick="SIMS.frogrespiratorysim.setMode(\'pulmonary\')">Pulmonary (Land Active)</button>';
  }

  function setMode(m){
    mode = m;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070e17"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">TRI-MODAL RESPIRATORY PHYSIOLOGY: ' + mode.toUpperCase() + ' MODE</text>';

    if (mode === "cutaneous") {
      // Cutaneous respiration
      m += '<rect x="80" y="70" width="' + (W - 160) + '" height="260" rx="10" fill="rgba(56,189,248,0.06)" stroke="#38bdf8" stroke-width="2"/>';
      // Water / Moist mucus film
      m += '<rect x="90" y="80" width="' + (W - 180) + '" height="40" fill="rgba(6,182,212,0.3)" rx="4"/>';
      m += '<text x="' + (W/2) + '" y="105" fill="#a5f3fc" font-size="13" font-weight="bold" text-anchor="middle">Aqueous / Mucus Surface Film (Dissolved O2 & CO2 Diffusion)</text>';
      // Stratified Epidermis
      m += '<rect x="90" y="125" width="' + (W - 180) + '" height="45" fill="rgba(101,163,13,0.3)" stroke="#65a30d" stroke-width="1.5"/>';
      m += '<text x="110" y="152" fill="#bef264" font-size="12">Thin Epidermal Layer (Non-cornified, Mucus Gland Ducts)</text>';
      // Dermis with rich capillary bed
      m += '<rect x="90" y="175" width="' + (W - 180) + '" height="120" fill="rgba(239,68,68,0.12)" stroke="#ef4444" stroke-width="1.5"/>';
      m += '<text x="110" y="200" fill="#fca5a5" font-size="12">Vascularized Dermis: Dense Capillary Plexus</text>';
      // Capillaries
      for (var c = 140; c < W - 140; c += 80) {
        m += '<circle cx="' + c + '" cy="245" r="16" fill="rgba(239,68,68,0.4)" stroke="#ef4444" stroke-width="2"/>';
        // Diffusion arrows
        m += '<line x1="' + c + '" y1="105" x2="' + c + '" y2="225" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4,3"/>';
        m += '<polygon points="' + (c - 4) + ',225 ' + (c + 4) + ',225 ' + c + ',233" fill="#38bdf8"/>';
      }
      m += '<text x="' + (W/2) + '" y="310" fill="#cbd5e1" font-size="12" text-anchor="middle">100% active underwater & during hibernation/aestivation in subterranean burrows</text>';
    } else if (mode === "buccopharyngeal") {
      // Buccal cavity floor pumping
      m += '<rect x="80" y="70" width="' + (W - 160) + '" height="260" rx="10" fill="rgba(16,185,129,0.06)" stroke="#10b981" stroke-width="2"/>';
      // Head silhouette with moving buccal floor
      m += '<path d="M 120 180 Q 200 130 320 130 L 400 130" fill="none" stroke="#64748b" stroke-width="6"/>';
      m += '<text x="130" y="125" fill="#94a3b8" font-size="12">External Nares (Open)</text>';
      // Oscillating floor
      m += '<path d="M 120 190 Q 240 270 380 190" fill="none" stroke="#10b981" stroke-width="6" stroke-dasharray="8,4"/>';
      m += '<text x="250" y="285" fill="#6ee7b7" font-size="13" font-weight="bold" text-anchor="middle">Lowering & Raising Buccal Floor (Mucous Membrane Exchange)</text>';
      // Glottis closed!
      m += '<ellipse cx="400" cy="160" rx="12" ry="20" fill="#ef4444" stroke="#fff" stroke-width="2"/>';
      m += '<text x="425" y="165" fill="#fca5a5" font-size="12">Glottis CLOSED (Lungs Inactive)</text>';
      m += '<text x="' + (W/2) + '" y="310" fill="#cbd5e1" font-size="12" text-anchor="middle">Energy-efficient resting respiration on land without ventilating thoracic lungs</text>';
    } else {
      // Pulmonary respiration
      m += '<rect x="80" y="70" width="' + (W - 160) + '" height="260" rx="10" fill="rgba(236,72,153,0.06)" stroke="#ec4899" stroke-width="2"/>';
      m += '<text x="' + (W/2) + '" y="100" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">Positive-Pressure Buccal Force Pump -> Glottis OPEN</text>';
      // Paired elongated pink lungs
      var lx1 = W / 2 - 80;
      var lx2 = W / 2 + 80;
      m += '<ellipse cx="' + lx1 + '" cy="200" rx="45" ry="75" fill="rgba(244,63,94,0.35)" stroke="#f43f5e" stroke-width="2.5"/>';
      m += '<ellipse cx="' + lx2 + '" cy="200" rx="45" ry="75" fill="rgba(244,63,94,0.35)" stroke="#f43f5e" stroke-width="2.5"/>';
      // Internal alveoli reticulations
      m += '<circle cx="' + (lx1 - 15) + '" cy="180" r="12" fill="none" stroke="#fb7185" stroke-width="1.5"/>';
      m += '<circle cx="' + (lx1 + 15) + '" cy="210" r="14" fill="none" stroke="#fb7185" stroke-width="1.5"/>';
      m += '<circle cx="' + (lx2 - 15) + '" cy="180" r="12" fill="none" stroke="#fb7185" stroke-width="1.5"/>';
      m += '<circle cx="' + (lx2 + 15) + '" cy="210" r="14" fill="none" stroke="#fb7185" stroke-width="1.5"/>';
      m += '<text x="' + lx1 + '" y="205" fill="#fff" font-size="12" text-anchor="middle">Left Lung</text>';
      m += '<text x="' + lx2 + '" y="205" fill="#fff" font-size="12" text-anchor="middle">Right Lung</text>';
      m += '<text x="' + (W/2) + '" y="310" fill="#cbd5e1" font-size="12" text-anchor="middle">Active during swimming bursts, high-speed leaping, and terrestrial chasing</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Active Modality", mode.toUpperCase(), mode === "cutaneous" ? "#38bdf8" : (mode === "buccopharyngeal" ? "#10b981" : "#ec4899")) +
      cell("Underwater Viable", mode === "cutaneous" ? "YES (Sole Method)" : "NO (Nares Closed)", mode === "cutaneous" ? "#10b981" : "#ef4444") +
      cell("Dormancy Active", mode === "cutaneous" ? "YES (Hibernation/Aestivation)" : "NO", mode === "cutaneous" ? "#10b981" : "#ef4444") +
      cell("Pressure Mechanism", mode === "pulmonary" ? "Positive Buccal Force Pump" : "Passive Diffusion", "#fcd34d")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Respiratory Adaptation Rule:</span> ' +
      (mode === "cutaneous" ? "Cutaneous respiration operates continuously through moist vascular skin in water, burrows, and terrestrial resting." :
       (mode === "buccopharyngeal" ? "Buccopharyngeal pulsation satisfies resting oxygen demands without the muscular work of lung inflation." :
        "Pulmonary respiration engages paired sac-like thoracic lungs inflated by a positive-pressure buccal force pump."))
    );
  }

  return { mount: mount, setMode: setMode, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Cardiovascular Hemodynamics & Portals (frogcirculatorysim)
// -------------------------------------------------------------------------
window.SIMS.frogcirculatorysim = (function(){
  var viewMode = "cardiac"; // "cardiac", "hepatic_portal", "renal_portal"

  function mount(){
    App.state.maxT = 3;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Deoxygenated Blood</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Oxygenated Blood</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Mixed Ventricular Pool</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Portal Capillary Beds</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.frogcirculatorysim.setView(\'cardiac\')">3-Chamber Heart</button>' +
      '<button class="preset-btn" onclick="SIMS.frogcirculatorysim.setView(\'hepatic_portal\')">Hepatic Portal System</button>' +
      '<button class="preset-btn" onclick="SIMS.frogcirculatorysim.setView(\'renal_portal\')">Renal Portal System</button>';
  }

  function setView(v){
    viewMode = v;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#090d16"/>';

    if (viewMode === "cardiac") {
      m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">THREE-CHAMBERED HEART ARCHITECTURE & ACCESSORY STRUCTURES</text>';
      var cx = W / 2;
      var cy = H / 2 + 10;

      // Right Atrium (receives deox blood from sinus venosus)
      m += '<path d="M ' + (cx - 100) + ' ' + (cy - 30) + ' A 50 50 0 0 1 ' + cx + ' ' + (cy - 70) + ' L ' + cx + ' ' + cy + ' L ' + (cx - 100) + ' ' + cy + ' Z" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="' + (cx - 50) + '" y="' + (cy - 35) + '" fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle">Right Atrium</text>';
      m += '<text x="' + (cx - 50) + '" y="' + (cy - 20) + '" fill="#bae6fd" font-size="10" text-anchor="middle">(Deoxygenated)</text>';

      // Left Atrium (receives ox blood from pulmonary veins)
      m += '<path d="M ' + cx + ' ' + (cy - 70) + ' A 50 50 0 0 1 ' + (cx + 100) + ' ' + (cy - 30) + ' L ' + (cx + 100) + ' ' + cy + ' L ' + cx + ' ' + cy + ' Z" fill="rgba(239,68,68,0.3)" stroke="#ef4444" stroke-width="2.5"/>';
      m += '<text x="' + (cx + 50) + '" y="' + (cy - 35) + '" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">Left Atrium</text>';
      m += '<text x="' + (cx + 50) + '" y="' + (cy - 20) + '" fill="#fecaca" font-size="10" text-anchor="middle">(Oxygenated)</text>';

      // Single Ventricle (muscular apex pointing down)
      m += '<polygon points="' + (cx - 100) + ',' + cy + ' ' + (cx + 100) + ',' + cy + ' ' + cx + ',' + (cy + 120) + '" fill="rgba(168,85,247,0.3)" stroke="#a855f7" stroke-width="3"/>';
      m += '<text x="' + cx + '" y="' + (cy + 55) + '" fill="#e9d5ff" font-size="13" font-weight="bold" text-anchor="middle">Single Ventricle</text>';
      m += '<text x="' + cx + '" y="' + (cy + 75) + '" fill="#d8b4fe" font-size="10" text-anchor="middle">Trabeculae & Columnae Carneae</text>';

      // Sinus Venosus (dorsal triangular chamber leading to right atrium)
      m += '<polygon points="' + (cx - 160) + ',' + (cy - 90) + ' ' + (cx - 110) + ',' + (cy - 90) + ' ' + (cx - 135) + ',' + (cy - 40) + '" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="' + (cx - 180) + '" y="' + (cy - 70) + '" fill="#38bdf8" font-size="11">Sinus Venosus</text>';

      // Conus Arteriosus (ventral tubular trunk from ventricle)
      m += '<rect x="' + (cx - 15) + '" y="' + (cy - 25) + '" width="30" height="50" rx="6" fill="#ec4899" stroke="#f43f5e" stroke-width="2"/>';
      m += '<text x="' + (cx + 60) + '" y="' + (cy + 5) + '" fill="#ec4899" font-size="11">Conus Arteriosus</text>';

      // Nucleated RBC display
      m += '<ellipse cx="120" cy="180" rx="22" ry="14" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>';
      m += '<ellipse cx="120" cy="180" rx="8" ry="5" fill="#450a0a"/>';
      m += '<text x="120" y="210" fill="#f87171" font-size="11" text-anchor="middle">Frog RBC: NUCLEATED</text>';
      m += '<text x="120" y="225" fill="#cbd5e1" font-size="10" text-anchor="middle">Oval & Biconvex</text>';
    } else if (viewMode === "hepatic_portal") {
      m += '<text x="' + (W/2) + '" y="32" fill="#10b981" font-size="16" font-weight="bold" text-anchor="middle">HEPATIC PORTAL SYSTEM: Gut Capillaries -> Liver Capillaries</text>';
      // Alimentary tract
      m += '<rect x="80" y="100" width="160" height="150" rx="8" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="160" y="130" fill="#fcd34d" font-size="13" font-weight="bold" text-anchor="middle">Stomach & Intestine</text>';
      m += '<text x="160" y="155" fill="#cbd5e1" font-size="11" text-anchor="middle">First Capillary Bed</text>';
      m += '<text x="160" y="175" fill="#cbd5e1" font-size="11" text-anchor="middle">(Nutrient Absorption)</text>';

      // Hepatic portal vein
      m += '<line x1="240" y1="175" x2="380" y2="175" stroke="#10b981" stroke-width="6"/>';
      m += '<polygon points="380,169 380,181 395,175" fill="#10b981"/>';
      m += '<text x="310" y="160" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Hepatic Portal Vein</text>';

      // Liver
      m += '<rect x="400" y="100" width="160" height="150" rx="8" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="480" y="130" fill="#fca5a5" font-size="13" font-weight="bold" text-anchor="middle">Liver (Hepatic Bed)</text>';
      m += '<text x="480" y="155" fill="#cbd5e1" font-size="11" text-anchor="middle">Second Capillary Bed</text>';
      m += '<text x="480" y="175" fill="#cbd5e1" font-size="11" text-anchor="middle">(Metabolic Processing)</text>';

      // Postcaval to heart
      m += '<line x1="560" y1="175" x2="660" y2="175" stroke="#38bdf8" stroke-width="4"/>';
      m += '<polygon points="660,170 660,180 672,175" fill="#38bdf8"/>';
      m += '<text x="610" y="160" fill="#38bdf8" font-size="11" text-anchor="middle">Postcaval Vein</text>';
      m += '<text x="610" y="200" fill="#94a3b8" font-size="11" text-anchor="middle">-> Sinus Venosus</text>';
    } else { // renal_portal
      m += '<text x="' + (W/2) + '" y="32" fill="#a855f7" font-size="16" font-weight="bold" text-anchor="middle">RENAL PORTAL SYSTEM: Hindlimb Capillaries -> Kidney Capillaries</text>';
      // Hindlimbs
      m += '<rect x="80" y="100" width="160" height="150" rx="8" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="160" y="130" fill="#7dd3fc" font-size="13" font-weight="bold" text-anchor="middle">Hindlimbs & Pelvis</text>';
      m += '<text x="160" y="155" fill="#cbd5e1" font-size="11" text-anchor="middle">First Capillary Bed</text>';
      m += '<text x="160" y="175" fill="#cbd5e1" font-size="11" text-anchor="middle">(Femoral / Sciatic)</text>';

      // Renal portal vein
      m += '<line x1="240" y1="175" x2="380" y2="175" stroke="#a855f7" stroke-width="6"/>';
      m += '<polygon points="380,169 380,181 395,175" fill="#a855f7"/>';
      m += '<text x="310" y="160" fill="#c084fc" font-size="12" font-weight="bold" text-anchor="middle">Renal Portal Vein</text>';

      // Kidneys
      m += '<rect x="400" y="100" width="160" height="150" rx="8" fill="rgba(239,68,68,0.15)" stroke="#dc2626" stroke-width="2"/>';
      m += '<text x="480" y="130" fill="#fca5a5" font-size="13" font-weight="bold" text-anchor="middle">Kidneys (Renal Bed)</text>';
      m += '<text x="480" y="155" fill="#cbd5e1" font-size="11" text-anchor="middle">Second Capillary Bed</text>';
      m += '<text x="480" y="175" fill="#cbd5e1" font-size="11" text-anchor="middle">(Tubular Secretion)</text>';

      // Postcaval to heart
      m += '<line x1="560" y1="175" x2="660" y2="175" stroke="#38bdf8" stroke-width="4"/>';
      m += '<polygon points="660,170 660,180 672,175" fill="#38bdf8"/>';
      m += '<text x="610" y="160" fill="#38bdf8" font-size="11" text-anchor="middle">Postcaval Vein</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Circuit Focus", viewMode === "cardiac" ? "3-Chamber Heart" : (viewMode === "hepatic_portal" ? "Hepatic Portal" : "Renal Portal"), "#38bdf8") +
      cell("Atria Count", "2 (Right deox + Left ox)", "#10b981") +
      cell("Ventricle Count", "1 (Single Muscular Chamber)", "#ec4899") +
      cell("RBC Morphology", "NUCLEATED Oval Discs", "#f59e0b")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Hemodynamics Axiom:</span> ' +
      (viewMode === "cardiac" ? "Sinus venosus discharges deoxygenated systemic venous blood into right atrium, while pulmonary veins feed left atrium into a single ventricle." :
       (viewMode === "hepatic_portal" ? "The hepatic portal system directs nutrient-laden blood from gut capillaries through liver sinusoid capillary beds before systemic venous return." :
        "The renal portal system channels venous drainage from hindlimbs directly into kidney capillaries for renal tubular clearance."))
    );
  }

  return { mount: mount, setView: setView, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Comparative Urinogenital Anatomy (frogurinogenitalsim - Exercise 7.2)
// -------------------------------------------------------------------------
window.SIMS.frogurinogenitalsim = (function(){
  var sex = "male"; // "male", "female"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Kidneys (Urea Excretion)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Gonads (Testes / Ovaries)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ureter / Urinogenital Duct</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Oviduct (Female Only)</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.frogurinogenitalsim.setSex(\'male\')">Male Urinogenital System</button>' +
      '<button class="preset-btn" onclick="SIMS.frogurinogenitalsim.setSex(\'female\')">Female Urinogenital System</button>';
  }

  function setSex(s){
    sex = s;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c16"/>';
    m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">EXERCISE 7.2: URETER FUNCTION & URINOGENITAL ANATOMY (' + sex.toUpperCase() + ')</text>';

    var cx = W / 2;
    var cy = 190;

    // Paired Kidneys (dark red, compact, bean-like)
    m += '<rect x="' + (cx - 75) + '" y="' + (cy - 60) + '" width="40" height="110" rx="14" fill="#991b1b" stroke="#ef4444" stroke-width="2"/>';
    m += '<rect x="' + (cx + 35) + '" y="' + (cy - 60) + '" width="40" height="110" rx="14" fill="#991b1b" stroke="#ef4444" stroke-width="2"/>';
    m += '<text x="' + (cx - 55) + '" y="' + cy + '" fill="#fca5a5" font-size="11" text-anchor="middle">Kidney</text>';
    m += '<text x="' + (cx + 55) + '" y="' + cy + '" fill="#fca5a5" font-size="11" text-anchor="middle">Kidney</text>';

    // Fat bodies (yellow finger-like projections at top of kidneys)
    for (var f = -1; f <= 1; f += 2) {
      var fbx = cx + f * 55;
      m += '<path d="M ' + fbx + ' ' + (cy - 60) + ' L ' + (fbx - 12) + ' ' + (cy - 90) + ' M ' + fbx + ' ' + (cy - 60) + ' L ' + fbx + ' ' + (cy - 95) + ' M ' + fbx + ' ' + (cy - 60) + ' L ' + (fbx + 12) + ' ' + (cy - 90) + '" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>';
    }
    m += '<text x="' + cx + '" y="' + (cy - 85) + '" fill="#fde047" font-size="11" text-anchor="middle">Fat Bodies (Energy Store)</text>';

    // Cloaca and Bilobed Bladder
    m += '<polygon points="' + (cx - 30) + ',' + (cy + 110) + ' ' + (cx + 30) + ',' + (cy + 110) + ' ' + cx + ',' + (cy + 145) + '" fill="#7c3aed" stroke="#c4b5fd" stroke-width="2"/>';
    m += '<text x="' + cx + '" y="' + (cy + 130) + '" fill="#ddd6fe" font-size="11" font-weight="bold" text-anchor="middle">Cloaca</text>';

    // Bilobed urinary bladder
    m += '<ellipse cx="' + (cx - 40) + '" cy="' + (cy + 140) + '" rx="20" ry="12" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<ellipse cx="' + (cx + 40) + '" cy="' + (cy + 140) + '" rx="20" ry="12" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="' + (cx + 90) + '" y="' + (cy + 145) + '" fill="#38bdf8" font-size="11">Bilobed Bladder</text>';

    if (sex === "male") {
      // Testes attached by mesorchium
      m += '<ellipse cx="' + (cx - 55) + '" cy="' + (cy - 30) + '" rx="14" ry="20" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>';
      m += '<ellipse cx="' + (cx + 55) + '" cy="' + (cy - 30) + '" rx="14" ry="20" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>';
      m += '<text x="' + (cx - 105) + '" y="' + (cy - 30) + '" fill="#fbbf24" font-size="11">Testis</text>';
      m += '<text x="' + (cx + 105) + '" y="' + (cy - 30) + '" fill="#fbbf24" font-size="11">Testis</text>';

      // Vasa efferentia (10-12 fine ducts into Bidder's canal)
      for (var v = -1; v <= 1; v += 2) {
        var vx = cx + v * 55;
        for (var d = -10; d <= 10; d += 6) {
          m += '<line x1="' + (vx + (v > 0 ? -12 : 12)) + '" y1="' + (cy - 30 + d) + '" x2="' + (vx + (v > 0 ? -22 : 22)) + '" y2="' + (cy - 30 + d) + '" stroke="#fff" stroke-width="1.5"/>';
        }
      }
      m += '<text x="' + cx + '" y="' + (cy - 10) + '" fill="#fff" font-size="10" text-anchor="middle">10–12 Vasa Efferentia</text>';
      m += '<text x="' + cx + '" y="' + (cy + 10) + '" fill="#38bdf8" font-size="10" text-anchor="middle">Bidder\'s Canal in Kidney</text>';

      // Ureters acting as Urinogenital Ducts
      m += '<path d="M ' + (cx - 70) + ' ' + (cy + 50) + ' C ' + (cx - 70) + ' ' + (cy + 90) + ' ' + (cx - 20) + ' ' + (cy + 100) + ' ' + (cx - 15) + ' ' + (cy + 110) + '" fill="none" stroke="#38bdf8" stroke-width="4"/>';
      m += '<path d="M ' + (cx + 70) + ' ' + (cy + 50) + ' C ' + (cx + 70) + ' ' + (cy + 90) + ' ' + (cx + 20) + ' ' + (cy + 100) + ' ' + (cx + 15) + ' ' + (cy + 110) + '" fill="none" stroke="#38bdf8" stroke-width="4"/>';
      m += '<text x="' + (cx - 165) + '" y="' + (cy + 85) + '" fill="#38bdf8" font-size="12" font-weight="bold">Urinogenital Duct (Urine + Sperms)</text>';
    } else {
      // Female: Ovaries (multilobed, thousands of ova)
      m += '<circle cx="' + (cx - 120) + '" cy="' + (cy - 20) + '" r="28" fill="rgba(245,158,11,0.4)" stroke="#f59e0b" stroke-width="2"/>';
      m += '<circle cx="' + (cx + 120) + '" cy="' + (cy - 20) + '" r="28" fill="rgba(245,158,11,0.4)" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="' + (cx - 120) + '" y="' + (cy - 20) + '" fill="#fde047" font-size="10" text-anchor="middle">Ovary (Ova)</text>';
      m += '<text x="' + (cx + 120) + '" y="' + (cy - 20) + '" fill="#fde047" font-size="10" text-anchor="middle">Ovary (Ova)</text>';

      // Separate coiled Oviducts (Mullerian ducts)
      m += '<path d="M ' + (cx - 150) + ' ' + (cy - 80) + ' Q ' + (cx - 170) + ' ' + cy + ' ' + (cx - 140) + ' ' + (cy + 60) + ' T ' + (cx - 25) + ' ' + (cy + 115) + '" fill="none" stroke="#ec4899" stroke-width="3" stroke-dasharray="6,3"/>';
      m += '<path d="M ' + (cx + 150) + ' ' + (cy - 80) + ' Q ' + (cx + 170) + ' ' + cy + ' ' + (cx + 140) + ' ' + (cy + 60) + ' T ' + (cx + 25) + ' ' + (cy + 115) + '" fill="none" stroke="#ec4899" stroke-width="3" stroke-dasharray="6,3"/>';
      m += '<text x="' + (cx - 180) + '" y="' + (cy - 60) + '" fill="#ec4899" font-size="11">Oviducal Funnel</text>';
      m += '<text x="' + (cx + 180) + '" y="' + (cy + 60) + '" fill="#ec4899" font-size="11">Oviduct (Independent Openings)</text>';

      // Female Ureters (Purely Excretory!)
      m += '<path d="M ' + (cx - 70) + ' ' + (cy + 50) + ' C ' + (cx - 70) + ' ' + (cy + 90) + ' ' + (cx - 15) + ' ' + (cy + 100) + ' ' + (cx - 10) + ' ' + (cy + 110) + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<path d="M ' + (cx + 70) + ' ' + (cy + 50) + ' C ' + (cx + 70) + ' ' + (cy + 90) + ' ' + (cx + 15) + ' ' + (cy + 100) + ' ' + (cx + 10) + ' ' + (cy + 110) + '" fill="none" stroke="#38bdf8" stroke-width="3"/>';
      m += '<text x="' + (cx - 150) + '" y="' + (cy + 95) + '" fill="#38bdf8" font-size="12" font-weight="bold">Ureter: Pure Excretory (Urine ONLY)</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Ureter Function", sex === "male" ? "URINOGENITAL (Urine + Sperms)" : "PURE EXCRETORY (Urine Only)", sex === "male" ? "#38bdf8" : "#10b981") +
      cell("Bidder\'s Canal", sex === "male" ? "PRESENT (Traversed by Sperm)" : "ABSENT / Non-functional", sex === "male" ? "#38bdf8" : "#94a3b8") +
      cell("Oviduct Separation", sex === "male" ? "N/A" : "SEPARATE (Independent Cloacal Entry)", "#ec4899") +
      cell("Excretory Waste", "UREA (Ureotelic Animal)", "#f59e0b")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Exercise 7.2 Solution Rule:</span> ' +
      (sex === "male" ? "In male frogs, ureters function as urinogenital ducts transporting both urine from the kidneys and spermatozoa (via Bidder's canal) into the cloaca." :
       "In female frogs, ureters function strictly as urinary ducts carrying only urine; ova travel through separate coiled oviducts that open independently into the cloaca.")
    );
  }

  return { mount: mount, setSex: setSex, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Neuro-Sensory & Metamorphic Life Cycle (frogneuroreprolab)
// -------------------------------------------------------------------------
window.SIMS.frogneuroreprolab = (function(){
  var tab = "brain"; // "brain", "lifecycle"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Forebrain (Olfactory/Cerebrum)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Midbrain (Optic Lobes)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Hindbrain (Cerebellum/Medulla)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Aquatic Tadpole Metamorphosis</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.frogneuroreprolab.setTab(\'brain\')">Brain Anatomy & Cranial Nerves</button>' +
      '<button class="preset-btn" onclick="SIMS.frogneuroreprolab.setTab(\'lifecycle\')">Tadpole Metamorphosis</button>';
  }

  function setTab(t){
    tab = t;
    draw();
  }

  function draw(){
    var svg = document.getElementById("lab-canvas");
    if (!svg) return;
    var W = svg.clientWidth || 720;
    var H = svg.clientHeight || 400;

    var m = '<rect width="' + W + '" height="' + H + '" fill="#070c16"/>';

    if (tab === "brain") {
      m += '<text x="' + (W/2) + '" y="32" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">FROG BRAIN ANATOMY & 10 PAIRS OF CRANIAL NERVES</text>';
      var cx = W / 2;
      var cy = 70;

      // Forebrain: Olfactory Lobes
      m += '<ellipse cx="' + (cx - 18) + '" cy="' + (cy + 25) + '" rx="14" ry="18" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
      m += '<ellipse cx="' + (cx + 18) + '" cy="' + (cy + 25) + '" rx="14" ry="18" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx - 110) + '" y="' + (cy + 25) + '" fill="#38bdf8" font-size="12">Olfactory Lobes (Smell)</text>';

      // Cerebral Hemispheres
      m += '<ellipse cx="' + (cx - 24) + '" cy="' + (cy + 75) + '" rx="20" ry="32" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>';
      m += '<ellipse cx="' + (cx + 24) + '" cy="' + (cy + 75) + '" rx="20" ry="32" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + (cx - 140) + '" y="' + (cy + 80) + '" fill="#7dd3fc" font-size="12">Cerebral Hemispheres (Paired)</text>';

      // Diencephalon
      m += '<rect x="' + (cx - 22) + '" y="' + (cy + 115) + '" width="44" height="25" rx="6" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="' + (cx + 110) + '" y="' + (cy + 125) + '" fill="#bae6fd" font-size="11">Diencephalon (Unpaired)</text>';

      // Midbrain: Optic Lobes
      m += '<ellipse cx="' + (cx - 30) + '" cy="' + (cy + 160) + '" rx="22" ry="24" fill="#059669" stroke="#10b981" stroke-width="2.5"/>';
      m += '<ellipse cx="' + (cx + 30) + '" cy="' + (cy + 160) + '" rx="22" ry="24" fill="#059669" stroke="#10b981" stroke-width="2.5"/>';
      m += '<text x="' + (cx - 140) + '" y="' + (cy + 165) + '" fill="#10b981" font-size="12" font-weight="bold">Optic Lobes (Midbrain - Vision)</text>';

      // Hindbrain: Cerebellum
      m += '<rect x="' + (cx - 26) + '" y="' + (cy + 195) + '" width="52" height="15" rx="4" fill="#db2777" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="' + (cx + 110) + '" y="' + (cy + 205) + '" fill="#f472b6" font-size="11">Cerebellum (Balance)</text>';

      // Medulla Oblongata
      m += '<polygon points="' + (cx - 25) + ',' + (cy + 215) + ' ' + (cx + 25) + ',' + (cy + 215) + ' ' + (cx + 15) + ',' + (cy + 270) + ' ' + (cx - 15) + ',' + (cy + 270) + '" fill="#be185d" stroke="#ec4899" stroke-width="2"/>';
      m += '<text x="' + (cx - 140) + '" y="' + (cy + 245) + '" fill="#ec4899" font-size="12" font-weight="bold">Medulla Oblongata</text>';

      // Foramen Magnum & Spinal Cord
      m += '<line x1="' + cx + '" y1="' + (cy + 270) + '" x2="' + cx + '" y2="' + (cy + 310) + '" stroke="#94a3b8" stroke-width="12"/>';
      m += '<text x="' + (cx + 110) + '" y="' + (cy + 285) + '" fill="#94a3b8" font-size="11">Passes through Foramen Magnum</text>';
      m += '<text x="' + (cx + 110) + '" y="' + (cy + 305) + '" fill="#cbd5e1" font-size="11">into Spinal Cord</text>';

      // Cranial nerves (10 pairs)
      for (var cn = 0; cn < 5; cn++) {
        var cny = cy + 40 + cn * 45;
        m += '<line x1="' + (cx - 40) + '" y1="' + cny + '" x2="' + (cx - 70) + '" y2="' + (cny + 10) + '" stroke="#f59e0b" stroke-width="2"/>';
        m += '<line x1="' + (cx + 40) + '" y1="' + cny + '" x2="' + (cx + 70) + '" y2="' + (cny + 10) + '" stroke="#f59e0b" stroke-width="2"/>';
      }
      m += '<text x="' + (cx + 90) + '" y="' + (cy + 55) + '" fill="#fbbf24" font-size="12" font-weight="bold">10 Pairs of Cranial Nerves</text>';
    } else {
      m += '<text x="' + (W/2) + '" y="32" fill="#f59e0b" font-size="16" font-weight="bold" text-anchor="middle">LIFE CYCLE: EXTERNAL FERTILISATION & TADPOLE METAMORPHOSIS</text>';
      // Stage 1: Spawn / Ova
      m += '<circle cx="120" cy="160" r="45" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="2"/>';
      for (var e = 0; e < 8; e++) {
        var ex = 105 + (e % 3) * 15;
        var ey = 145 + Math.floor(e / 3) * 15;
        m += '<circle cx="' + ex + '" cy="' + ey + '" r="5" fill="#0f172a" stroke="#fff" stroke-width="1"/>';
      }
      m += '<text x="120" y="225" fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle">1. Ova Spawn</text>';
      m += '<text x="120" y="245" fill="#cbd5e1" font-size="10" text-anchor="middle">2,500–3,000 Ova / Clutch</text>';
      m += '<text x="120" y="260" fill="#cbd5e1" font-size="10" text-anchor="middle">External Fertilisation in H2O</text>';

      // Arrow 1
      m += '<line x1="175" y1="160" x2="255" y2="160" stroke="#f59e0b" stroke-width="4"/><polygon points="255,154 255,166 268,160" fill="#f59e0b"/>';

      // Stage 2: Aquatic Tadpole
      m += '<circle cx="340" cy="160" r="30" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="2"/>';
      m += '<path d="M 365 160 Q 420 130 450 160 Q 420 190 365 160" fill="#10b981" opacity="0.6"/>';
      m += '<circle cx="330" cy="150" r="4" fill="#0f172a"/>';
      m += '<text x="360" y="225" fill="#6ee7b7" font-size="12" font-weight="bold" text-anchor="middle">2. Aquatic Tadpole</text>';
      m += '<text x="360" y="245" fill="#cbd5e1" font-size="10" text-anchor="middle">Herbivorous Larva</text>';
      m += '<text x="360" y="260" fill="#cbd5e1" font-size="10" text-anchor="middle">External Gills & Swimming Tail</text>';
      m += '<text x="360" y="275" fill="#cbd5e1" font-size="10" text-anchor="middle">Ammonotelic Excretion</text>';

      // Arrow 2 (Thyroid hormone)
      m += '<line x1="465" y1="160" x2="540" y2="160" stroke="#f59e0b" stroke-width="4"/><polygon points="540,154 540,166 553,160" fill="#f59e0b"/>';
      m += '<text x="505" y="145" fill="#fbbf24" font-size="10" text-anchor="middle">Thyroxine (T4)</text>';
      m += '<text x="505" y="180" fill="#fbbf24" font-size="10" text-anchor="middle">Metamorphosis</text>';

      // Stage 3: Adult Frog
      m += '<ellipse cx="615" cy="160" rx="35" ry="40" fill="rgba(236,72,153,0.2)" stroke="#ec4899" stroke-width="2"/>';
      m += '<text x="615" y="225" fill="#f472b6" font-size="12" font-weight="bold" text-anchor="middle">3. Adult Frog</text>';
      m += '<text x="615" y="245" fill="#cbd5e1" font-size="10" text-anchor="middle">Carnivorous Predator</text>';
      m += '<text x="615" y="260" fill="#cbd5e1" font-size="10" text-anchor="middle">Legs, Lungs & Moist Skin</text>';
      m += '<text x="615" y="275" fill="#cbd5e1" font-size="10" text-anchor="middle">Ureotelic Excretion</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Active Domain", tab === "brain" ? "Cephalic Neuroanatomy" : "Tadpole Ontogeny", "#38bdf8") +
      cell("Cranial Nerves", tab === "brain" ? "10 Pairs (PNS)" : "10 Pairs in Adult", "#10b981") +
      cell("Foramen Exit", tab === "brain" ? "Medulla Oblongata" : "N/A", "#ec4899") +
      cell("Larval Transition", tab === "lifecycle" ? "Tadpole (Ammonotelic) -> Adult (Ureotelic)" : "Fore/Mid/Hind Regions", "#f59e0b")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Neuro-Ontogenetic Rule:</span> ' +
      (tab === "brain" ? "The frog brain is partitioned into forebrain (olfactory lobes, cerebral hemispheres, diencephalon), midbrain (optic lobes), and hindbrain (cerebellum and medulla oblongata exiting through foramen magnum with 10 pairs of cranial nerves)." :
       "Reproduction entails external fertilisation of 2500–3000 ova into water, hatching into ammonotelic swimming tadpoles that metamorphose into terrestrial ureotelic frogs.")
    );
  }

  return { mount: mount, setTab: setTab, draw: draw };
})();
