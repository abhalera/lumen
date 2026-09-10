// kebo117 interactive simulations: Locomotion and Movement
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
// 1. SIMULATION 1: Muscle Histology & Motility (muscletypessim)
// -------------------------------------------------------------------------
window.SIMS.muscletypessim = (function(){
  var view = "motility"; // "motility", "histology", "hierarchy"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Skeletal Muscle (Striated / Voluntary / Syncytial)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Visceral Smooth (Spindle / Involuntary / Uninucleate)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Cardiac Muscle (Branched / Intercalated Discs)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cellular Movements (Amoeboid, Ciliary, Flagellar)</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.muscletypessim.setView(\'motility\')">1. Cellular Motility: Amoeboid vs Ciliary vs Muscular</button>' +
        '<button class="preset-btn" onclick="SIMS.muscletypessim.setView(\'histology\')">2. Histological Triad: Skeletal, Smooth &amp; Cardiac</button>' +
        '<button class="preset-btn" onclick="SIMS.muscletypessim.setView(\'hierarchy\')">3. Skeletal Muscle Structural Hierarchy</button>';
    }
    render(0);
  }

  function setView(v){
    view = v;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (view === "motility") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">CELLULAR MOVEMENTS IN THE HUMAN BODY: MECHANISMS &amp; EXAMPLES</text>';

      // Card 1: Amoeboid
      svg += '<g transform="translate(20, 60)">';
      svg += '<rect x="0" y="0" width="225" height="290" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<rect x="0" y="0" width="225" height="36" fill="#0284c7" rx="8"/>';
      svg += '<text x="112" y="24" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">1. Amoeboid Movement</text>';
      svg += '<text x="15" y="65" fill="#38bdf8" font-size="11" font-weight="bold">Locomotor Organelle:</text>';
      svg += '<text x="15" y="85" fill="#f8fafc" font-size="11">• Pseudopodia (false feet)</text>';
      svg += '<text x="15" y="115" fill="#38bdf8" font-size="11" font-weight="bold">Molecular Motor Engine:</text>';
      svg += '<text x="15" y="135" fill="#f8fafc" font-size="11">• Microfilaments (actin polymer)</text>';
      svg += '<text x="15" y="155" fill="#cbd5e1" font-size="10">• Protoplasmic streaming</text>';
      svg += '<text x="15" y="190" fill="#38bdf8" font-size="11" font-weight="bold">Human Cells Exhibiting It:</text>';
      svg += '<text x="15" y="210" fill="#f8fafc" font-size="11">• Macrophages in tissues</text>';
      svg += '<text x="15" y="230" fill="#f8fafc" font-size="11">• Neutrophilic leucocytes in blood</text>';
      svg += '<text x="15" y="260" fill="#fbbf24" font-size="10">Primary Role: Phagocytosis &amp; Diapedesis</text>';
      svg += '</g>';

      // Card 2: Ciliary & Flagellar
      svg += '<g transform="translate(265, 60)">';
      svg += '<rect x="0" y="0" width="225" height="290" fill="#1e293b" rx="8" stroke="#34d399" stroke-width="2"/>';
      svg += '<rect x="0" y="0" width="225" height="36" fill="#059669" rx="8"/>';
      svg += '<text x="112" y="24" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">2. Ciliary &amp; Flagellar</text>';
      svg += '<text x="15" y="65" fill="#34d399" font-size="11" font-weight="bold">Locomotor Organelle:</text>';
      svg += '<text x="15" y="85" fill="#f8fafc" font-size="11">• Cilia (short, hair-like, 9+2)</text>';
      svg += '<text x="15" y="105" fill="#f8fafc" font-size="11">• Flagella (long, whip-like, 9+2)</text>';
      svg += '<text x="15" y="135" fill="#34d399" font-size="11" font-weight="bold">Molecular Motor Engine:</text>';
      svg += '<text x="15" y="155" fill="#f8fafc" font-size="11">• Microtubules (Tubulin + Dynein)</text>';
      svg += '<text x="15" y="190" fill="#34d399" font-size="11" font-weight="bold">Human Cells Exhibiting It:</text>';
      svg += '<text x="15" y="210" fill="#f8fafc" font-size="11">• Ciliated respiratory epithelium (trachea)</text>';
      svg += '<text x="15" y="230" fill="#f8fafc" font-size="11">• Fallopian tubes (propels ovum)</text>';
      svg += '<text x="15" y="250" fill="#f8fafc" font-size="11">• Sperm flagellum (motility)</text>';
      svg += '<text x="15" y="275" fill="#fbbf24" font-size="10">Primary Role: Luminal sweeping</text>';
      svg += '</g>';

      // Card 3: Muscular
      svg += '<g transform="translate(510, 60)">';
      svg += '<rect x="0" y="0" width="230" height="290" fill="#1e293b" rx="8" stroke="#ef4444" stroke-width="2"/>';
      svg += '<rect x="0" y="0" width="230" height="36" fill="#dc2626" rx="8"/>';
      svg += '<text x="115" y="24" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">3. Muscular Movement</text>';
      svg += '<text x="15" y="65" fill="#f87171" font-size="11" font-weight="bold">Contractile Machinery:</text>';
      svg += '<text x="15" y="85" fill="#f8fafc" font-size="11">• Actomyosin myofibrillar filaments</text>';
      svg += '<text x="15" y="115" fill="#f87171" font-size="11" font-weight="bold">Energetic Driver:</text>';
      svg += '<text x="15" y="135" fill="#f8fafc" font-size="11">• Myosin ATPase ATP hydrolysis</text>';
      svg += '<text x="15" y="155" fill="#fca5a5" font-size="10">• Regulated by sarcoplasmic Ca2+</text>';
      svg += '<text x="15" y="190" fill="#f87171" font-size="11" font-weight="bold">Gross Anatomical Structures:</text>';
      svg += '<text x="15" y="210" fill="#f8fafc" font-size="11">• Limbs (walking, running, grasping)</text>';
      svg += '<text x="15" y="230" fill="#f8fafc" font-size="11">• Jaws, tongue, eyelids, diaphragm</text>';
      svg += '<text x="15" y="250" fill="#f8fafc" font-size="11">• Heart chambers &amp; visceral tracts</text>';
      svg += '<text x="15" y="275" fill="#fbbf24" font-size="10">Primary Role: Locomotion &amp; Posture</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Amoeboid Engine', 'Actin Microfilaments (Pseudopodia)', '#38bdf8') +
              cell('Ciliary Engine', 'Axonemal Microtubules (9+2 Tubulin)', '#34d399') +
              cell('Muscular Engine', 'Actomyosin Sarcomeres (ATP/Ca2+)', '#ef4444') +
              cell('Locomotion Principle', 'Voluntary Translocational Movement', '#fbbf24');

      vHtml = '<strong>Cellular and Gross Movements in Humans:</strong> Cells of the human body exhibit three principal modes of movement. <em>Amoeboid movement</em> is performed by macrophages and leucocytes via pseudopodial streaming powered by actin microfilaments. <em>Ciliary movement</em> takes place in ciliated epithelia lining internal tubular organs, such as the coordinated sweeping of mucus in the trachea and conveyance of ova through fallopian tubes. <em>Muscular movement</em> is executed by specialized muscle tissues containing actomyosin contractile assemblies, driving locomotion of limbs, chewing by jaws, and pumping of the heart.';
    } else if (view === "histology") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HISTOLOGICAL TRIAD: SKELETAL VS VISCERAL (SMOOTH) VS CARDIAC MUSCLE</text>';

      // Type 1: Skeletal
      svg += '<g transform="translate(20, 60)">';
      svg += '<rect x="0" y="0" width="225" height="295" fill="#1e293b" rx="8" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="112" y="26" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">Skeletal Muscle</text>';
      // Fiber diagram
      svg += '<rect x="20" y="45" width="185" height="40" fill="#7f1d1d" stroke="#ef4444" rx="3"/>';
      // Striations
      for (var s = 0; s < 10; s++) {
        svg += '<line x1="' + (35 + s * 16) + '" y1="45" x2="' + (35 + s * 16) + '" y2="85" stroke="#fca5a5" stroke-width="2"/>';
      }
      // Peripheral nuclei
      svg += '<circle cx="50" cy="50" r="4" fill="#3b82f6"/>';
      svg += '<circle cx="170" cy="80" r="4" fill="#3b82f6"/>';

      svg += '<text x="15" y="110" fill="#f8fafc" font-size="11">• Striations: Strongly striated</text>';
      svg += '<text x="15" y="130" fill="#f8fafc" font-size="11">• Control: Voluntary (Somatic nervous)</text>';
      svg += '<text x="15" y="150" fill="#f8fafc" font-size="11">• Shape: Cylindrical, unbranched</text>';
      svg += '<text x="15" y="170" fill="#f8fafc" font-size="11">• Nuclei: Multinucleated (syncytium)</text>';
      svg += '<text x="15" y="190" fill="#f8fafc" font-size="11">• Nuclei Position: Peripheral</text>';
      svg += '<text x="15" y="210" fill="#f8fafc" font-size="11">• Intercalated Discs: ABSENT</text>';
      svg += '<text x="15" y="230" fill="#f8fafc" font-size="11">• Contraction: Fast, prone to fatigue</text>';
      svg += '<text x="15" y="255" fill="#fbbf24" font-size="11" font-weight="bold">Location:</text>';
      svg += '<text x="15" y="275" fill="#cbd5e1" font-size="10">Attached to skeletal bones via tendons</text>';
      svg += '</g>';

      // Type 2: Smooth
      svg += '<g transform="translate(265, 60)">';
      svg += '<rect x="0" y="0" width="225" height="295" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<text x="112" y="26" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Visceral (Smooth) Muscle</text>';
      // Spindle cell diagram
      svg += '<path d="M 25 65 Q 112 40, 200 65 Q 112 90, 25 65 Z" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>';
      // Central nucleus
      svg += '<circle cx="112" cy="65" r="5" fill="#3b82f6"/>';

      svg += '<text x="15" y="110" fill="#f8fafc" font-size="11">• Striations: Non-striated (smooth)</text>';
      svg += '<text x="15" y="130" fill="#f8fafc" font-size="11">• Control: Involuntary (Autonomic)</text>';
      svg += '<text x="15" y="150" fill="#f8fafc" font-size="11">• Shape: Fusiform (spindle-shaped)</text>';
      svg += '<text x="15" y="170" fill="#f8fafc" font-size="11">• Nuclei: Uninucleate</text>';
      svg += '<text x="15" y="190" fill="#f8fafc" font-size="11">• Nuclei Position: Centrally located</text>';
      svg += '<text x="15" y="210" fill="#f8fafc" font-size="11">• Intercalated Discs: ABSENT</text>';
      svg += '<text x="15" y="230" fill="#f8fafc" font-size="11">• Contraction: Slow, sustained, fatigue-free</text>';
      svg += '<text x="15" y="255" fill="#fbbf24" font-size="11" font-weight="bold">Location:</text>';
      svg += '<text x="15" y="275" fill="#cbd5e1" font-size="10">Gut, reproductive tract, blood vessels</text>';
      svg += '</g>';

      // Type 3: Cardiac
      svg += '<g transform="translate(510, 60)">';
      svg += '<rect x="0" y="0" width="230" height="295" fill="#1e293b" rx="8" stroke="#ec4899" stroke-width="2"/>';
      svg += '<text x="115" y="26" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">Cardiac Muscle</text>';
      // Branched fiber diagram
      svg += '<path d="M 25 50 L 120 50 L 150 45 L 205 45 L 205 60 L 150 60 L 120 65 L 205 65 L 205 80 L 25 80 Z" fill="#701a75" stroke="#ec4899"/>';
      // Intercalated discs
      svg += '<line x1="75" y1="50" x2="75" y2="80" stroke="#fbcfe8" stroke-width="3"/>';
      svg += '<line x1="150" y1="45" x2="150" y2="80" stroke="#fbcfe8" stroke-width="3"/>';
      // Central nucleus
      svg += '<circle cx="100" cy="65" r="4" fill="#3b82f6"/>';

      svg += '<text x="15" y="110" fill="#f8fafc" font-size="11">• Striations: Distinctly striated</text>';
      svg += '<text x="15" y="130" fill="#f8fafc" font-size="11">• Control: Involuntary (Myogenic rhythm)</text>';
      svg += '<text x="15" y="150" fill="#f8fafc" font-size="11">• Shape: Cylindrical, branched</text>';
      svg += '<text x="15" y="170" fill="#f8fafc" font-size="11">• Nuclei: Uninucleate (rarely binucleate)</text>';
      svg += '<text x="15" y="190" fill="#f8fafc" font-size="11">• Nuclei Position: Centrally located</text>';
      svg += '<text x="15" y="210" fill="#34d399" font-size="11" font-weight="bold">• Intercalated Discs: PRESENT</text>';
      svg += '<text x="15" y="230" fill="#f8fafc" font-size="11">• Contraction: Rhythmic, tireless throughout life</text>';
      svg += '<text x="15" y="255" fill="#fbbf24" font-size="11" font-weight="bold">Location:</text>';
      svg += '<text x="15" y="275" fill="#cbd5e1" font-size="10">Myocardium of heart chambers</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Skeletal Nuclei', 'Multinucleated Syncytium (Peripheral)', '#ef4444') +
              cell('Smooth Fiber Shape', 'Fusiform (Spindle), Central Nucleus', '#fbbf24') +
              cell('Cardiac Special Feature', 'Branched with Intercalated Discs', '#ec4899') +
              cell('Body Mass Percentage', '40 – 50% of Adult Body Weight', '#38bdf8');

      vHtml = '<strong>Histological Comparison of Muscle Tissues:</strong> <em>Skeletal muscle</em> is composed of long, unbranched, cylindrical fibers with prominent transverse striations, multiple flattened peripheral nuclei, under voluntary somatic motor control. <em>Visceral (smooth) muscle</em> consists of spindle-shaped (fusiform) unbranched cells lacking striations, with a single central oval nucleus and involuntary autonomic innervation. <em>Cardiac muscle</em> comprises branched, striated cylinders joined end-to-end by specialized dark junctions called <strong>intercalated discs</strong> that house desmosomes and gap junctions, allowing rapid electrical syncytial propagation.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">STRUCTURAL HIERARCHY: EPIMYSIUM, FASCICLES, MYOFIBRILS &amp; MYOFILAMENTS</text>';

      // Nested boxes showing hierarchy
      svg += '<g transform="translate(40, 60)">';
      // 1. Gross Muscle
      svg += '<rect x="0" y="0" width="680" height="50" fill="#7f1d1d" rx="6" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="20" y="30" fill="#fca5a5" font-size="13" font-weight="bold">1. Gross Skeletal Muscle Belly (Ensheathed by Epimysium connective tissue)</text>';

      // 2. Fascicle
      svg += '<rect x="30" y="60" width="650" height="50" fill="#991b1b" rx="6" stroke="#f87171" stroke-width="2"/>';
      svg += '<text x="50" y="90" fill="#fecaca" font-size="13" font-weight="bold">2. Muscle Fascicle / Bundle (Ensheathed by Perimysium / Fascia)</text>';

      // 3. Muscle Fiber
      svg += '<rect x="60" y="120" width="620" height="50" fill="#b91c1c" rx="6" stroke="#fca5a5" stroke-width="2"/>';
      svg += '<text x="80" y="150" fill="#fff" font-size="13" font-weight="bold">3. Muscle Fiber / Cell (Bounded by Sarcolemma &amp; Endomysium, Syncytial)</text>';

      // 4. Myofibrils
      svg += '<rect x="90" y="180" width="590" height="50" fill="#0f172a" rx="6" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="110" y="210" fill="#38bdf8" font-size="13" font-weight="bold">4. Myofibrils (Parallel cylindrical organelles showing alternate A and I bands)</text>';

      // 5. Myofilaments
      svg += '<rect x="120" y="240" width="560" height="50" fill="#1e293b" rx="6" stroke="#34d399" stroke-width="2"/>';
      svg += '<text x="140" y="270" fill="#34d399" font-size="13" font-weight="bold">5. Myofilaments: Thick Myosin (~1500) &amp; Thin Actin (~3000) Filaments</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Outer Muscle Sheath', 'Epimysium (Collagenous)', '#ef4444') +
              cell('Fascicle Sheath', 'Perimysium (Fascia)', '#f87171') +
              cell('Cellular Membrane', 'Sarcolemma + Sarcoplasm', '#38bdf8') +
              cell('Functional Subunit', 'Sarcomere (Between two Z-lines)', '#34d399');

      vHtml = '<strong>Hierarchical Architecture of Skeletal Muscle:</strong> An intact skeletal muscle belly is wrapped in a dense collagenous sheath called the <em>epimysium</em>. Inside, the muscle is partitioned into multiple bundles called <em>fascicles</em>, held together by a common collagenous connective tissue layer called <strong>fascia</strong> (or perimysium). Each fascicle contains hundreds of elongated muscle fibers (cells) wrapped by <em>endomysium</em>. Beneath the sarcolemma, each fiber is packed with longitudinally parallel cylindrical organelles termed <strong>myofibrils</strong>, which house the macromolecular <em>myofilaments</em> (actin and myosin) arranged in repeating sarcomeres.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Sarcomere Ultrastructure (sarcomerestructsim)
// -------------------------------------------------------------------------
window.SIMS.sarcomerestructsim = (function(){
  var view = "sarcomere"; // "sarcomere", "thin_filament", "thick_filament"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Thin Filament (F-Actin + Tropomyosin + Troponin)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Thick Filament (Myosin / Meromyosin Hexamer)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>A-band (Constant Length: ~1.5 µm)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Z-line Boundaries (Sarcomere Unit: ~2.2 µm)</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.sarcomerestructsim.setView(\'sarcomere\')">1. Sarcomere Anatomy: A-Band, I-Band, H-Zone &amp; Z-Lines</button>' +
        '<button class="preset-btn" onclick="SIMS.sarcomerestructsim.setView(\'thin_filament\')">2. Thin Filament: F-Actin, Tropomyosin &amp; Troponin Trimer</button>' +
        '<button class="preset-btn" onclick="SIMS.sarcomerestructsim.setView(\'thick_filament\')">3. Thick Filament: Heavy (HMM) &amp; Light (LMM) Meromyosin</button>';
    }
    render(0);
  }

  function setView(v){
    view = v;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (view === "sarcomere") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">SARCOMERE BLUEPRINT: THE FUNCTIONAL UNIT OF CONTRACTION</text>';

      // Sarcomere Diagram
      svg += '<g transform="translate(60, 60)">';

      // Left Z-line
      svg += '<line x1="80" y1="20" x2="80" y2="220" stroke="#10b981" stroke-width="6"/>';
      svg += '<text x="80" y="10" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Z-Line</text>';

      // Right Z-line
      svg += '<line x1="560" y1="20" x2="560" y2="220" stroke="#10b981" stroke-width="6"/>';
      svg += '<text x="560" y="10" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Z-Line</text>';

      // Sarcomere Span Bracket
      svg += '<line x1="80" y1="235" x2="560" y2="235" stroke="#94a3b8" stroke-width="2"/>';
      svg += '<text x="320" y="250" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">SARCOMERE (2.0 – 2.5 µm at Rest)</text>';

      // Thin Filaments (Actin, light blue)
      // Left side coming from left Z-line
      for (var a = 0; a < 4; a++) {
        var ay = 50 + a * 45;
        svg += '<line x1="80" y1="' + ay + '" x2="270" y2="' + ay + '" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>';
        // Right side coming from right Z-line
        svg += '<line x1="370" y1="' + ay + '" x2="560" y2="' + ay + '" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>';
      }

      // Thick Filaments (Myosin, red, interleaved)
      for (var m = 0; m < 3; m++) {
        var my = 72 + m * 45;
        svg += '<line x1="200" y1="' + my + '" x2="440" y2="' + my + '" stroke="#ef4444" stroke-width="12" stroke-linecap="round"/>';
        // Cross-bridge heads projecting
        for (var h = 0; h < 6; h++) {
          svg += '<circle cx="' + (215 + h * 22) + '" cy="' + (my - 8) + '" r="3" fill="#fca5a5"/>';
          svg += '<circle cx="' + (315 + h * 22) + '" cy="' + (my + 8) + '" r="3" fill="#fca5a5"/>';
        }
      }

      // Central M-line
      svg += '<line x1="320" y1="40" x2="320" y2="200" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4,4"/>';
      svg += '<text x="320" y="32" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">M-Line</text>';

      // Zone Indicators at bottom
      // A-band bracket (200 to 440)
      svg += '<rect x="200" y="195" width="240" height="24" fill="#78350f" opacity="0.5" stroke="#fbbf24"/>';
      svg += '<text x="320" y="212" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">A-Band (Constant: ~1.5 µm)</text>';

      // H-zone bracket (270 to 370)
      svg += '<rect x="270" y="170" width="100" height="20" fill="#3b82f6" opacity="0.3" stroke="#60a5fa"/>';
      svg += '<text x="320" y="184" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">H-Zone</text>';

      // Left I-band bracket (80 to 200)
      svg += '<line x1="80" y1="195" x2="200" y2="195" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="140" y="212" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">1/2 I-Band</text>';

      // Right I-band bracket (440 to 560)
      svg += '<line x1="440" y1="195" x2="560" y2="195" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="500" y="212" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">1/2 I-Band</text>';
      svg += '</g>';

      // Legend box
      svg += '<g transform="translate(60, 320)">';
      svg += '<text x="0" y="16" fill="#f8fafc" font-size="11">• <strong>A-band:</strong> Overlapping thick &amp; thin filaments | <strong>I-band:</strong> Thin actin only | <strong>H-zone:</strong> Central thick myosin only</text>';
      svg += '<text x="0" y="34" fill="#34d399" font-size="11">• During contraction: Z-lines approach, I-band narrows, H-zone reduces/disappears, A-band remains invariant.</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Sarcomere Boundaries', 'Between two successive Z-lines', '#10b981') +
              cell('A-Band Behavior', 'Strictly Constant (~1.5 µm)', '#fbbf24') +
              cell('H-Zone Composition', 'Thick Myosin Filaments Only', '#38bdf8') +
              cell('I-Band Composition', 'Thin Actin Filaments Only', '#34d399');

      vHtml = '<strong>The Sarcomere Architecture:</strong> A myofibril displays alternating dark and light bands under polarized light. The dark band is the <strong>A-band (Anisotropic)</strong>, containing thick filaments (myosin) that overlap with thin filaments at their extremities. The light band is the <strong>I-band (Isotropic)</strong>, containing exclusively thin filaments (actin) and bisected by an elastic line called the <em>Z-line</em>. The portion of a myofibril between two consecutive Z-lines constitutes the <strong>sarcomere</strong>, the basic contractile unit. In a resting muscle, the central strip of thick filaments not overlapped by thin filaments is the <strong>H-zone</strong>, held at its center by the <em>M-line</em>.';
    } else if (view === "thin_filament") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">THIN FILAMENT MOLECULAR ARCHITECTURE: ACTIN, TROPOMYOSIN &amp; TROPONIN</text>';

      // Thin Filament Structural Strand Diagram
      svg += '<g transform="translate(40, 60)">';
      svg += '<rect x="0" y="0" width="680" height="120" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';

      // Helical F-actin chains (double beads)
      for (var b = 0; b < 24; b++) {
        var bx = 40 + b * 26;
        var by1 = 50 + Math.sin(b * 0.5) * 12;
        var by2 = 70 - Math.sin(b * 0.5) * 12;
        svg += '<circle cx="' + bx + '" cy="' + by1 + '" r="10" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>';
        svg += '<circle cx="' + bx + '" cy="' + by2 + '" r="10" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>';
      }

      // Tropomyosin ribbons running along grooves
      svg += '<path d="M 30 58 Q 150 78, 270 58 T 510 58 T 650 58" fill="none" stroke="#fbbf24" stroke-width="4"/>';
      svg += '<path d="M 30 62 Q 150 42, 270 62 T 510 62 T 650 62" fill="none" stroke="#f59e0b" stroke-width="4"/>';

      // Troponin Complexes at regular intervals
      var troponinPositions = [120, 310, 500];
      for (var tp = 0; tp < troponinPositions.length; tp++) {
        var tx = troponinPositions[tp];
        // Trimeric complex
        svg += '<g transform="translate(' + tx + ', 35)">';
        svg += '<circle cx="0" cy="0" r="9" fill="#10b981" stroke="#fff"/>'; // TnT
        svg += '<text x="0" y="3" fill="#fff" font-size="8" text-anchor="middle">TnT</text>';
        svg += '<circle cx="14" cy="0" r="9" fill="#ef4444" stroke="#fff"/>'; // TnI
        svg += '<text x="14" y="3" fill="#fff" font-size="8" text-anchor="middle">TnI</text>';
        svg += '<circle cx="7" cy="-12" r="9" fill="#ec4899" stroke="#fff"/>'; // TnC
        svg += '<text x="7" y="-9" fill="#fff" font-size="8" text-anchor="middle">TnC</text>';
        svg += '</g>';
      }
      svg += '</g>';

      // Molecular details below
      svg += '<g transform="translate(40, 200)">';
      // 1. F-Actin
      svg += '<rect x="0" y="0" width="215" height="150" fill="#1e293b" rx="6" stroke="#0284c7"/>';
      svg += '<text x="15" y="24" fill="#38bdf8" font-size="12" font-weight="bold">1. F-Actin (Filamentous)</text>';
      svg += '<text x="15" y="46" fill="#f8fafc" font-size="10">• Two helically wound strands</text>';
      svg += '<text x="15" y="66" fill="#f8fafc" font-size="10">• Polymer of globular G-actin</text>';
      svg += '<text x="15" y="86" fill="#f8fafc" font-size="10">• Polymeric in presence of Mg2+</text>';
      svg += '<text x="15" y="106" fill="#f8fafc" font-size="10">• Houses myosin-binding sites</text>';
      svg += '<text x="15" y="126" fill="#cbd5e1" font-size="10">• Slides inward during contraction</text>';

      // 2. Tropomyosin
      svg += '<rect x="230" y="0" width="220" height="150" fill="#1e293b" rx="6" stroke="#fbbf24"/>';
      svg += '<text x="15" y="24" transform="translate(230,0)" fill="#fbbf24" font-size="12" font-weight="bold">2. Tropomyosin</text>';
      svg += '<text x="15" y="46" transform="translate(230,0)" fill="#f8fafc" font-size="10">• Two continuous fibrous strands</text>';
      svg += '<text x="15" y="66" transform="translate(230,0)" fill="#f8fafc" font-size="10">• Runs close to F-actin throughout</text>';
      svg += '<text x="15" y="86" transform="translate(230,0)" fill="#f8fafc" font-size="10">• Fits into grooves between helices</text>';
      svg += '<text x="15" y="106" transform="translate(230,0)" fill="#f8fafc" font-size="10">• Physically shields active sites</text>';
      svg += '<text x="15" y="126" transform="translate(230,0)" fill="#cbd5e1" font-size="10">• Displaced when troponin binds Ca2+</text>';

      // 3. Troponin Complex
      svg += '<rect x="465" y="0" width="215" height="150" fill="#1e293b" rx="6" stroke="#ec4899"/>';
      svg += '<text x="15" y="24" transform="translate(465,0)" fill="#f472b6" font-size="12" font-weight="bold">3. Troponin Trimer</text>';
      svg += '<text x="15" y="46" transform="translate(465,0)" fill="#f8fafc" font-size="10">• Distributed at regular intervals</text>';
      svg += '<text x="15" y="66" transform="translate(465,0)" fill="#a7f3d0" font-size="10"><strong>TnT:</strong> Binds to tropomyosin</text>';
      svg += '<text x="15" y="86" transform="translate(465,0)" fill="#fca5a5" font-size="10"><strong>TnI:</strong> Inhibits actin-myosin binding</text>';
      svg += '<text x="15" y="106" transform="translate(465,0)" fill="#fbcfe8" font-size="10"><strong>TnC:</strong> Binds 4 Ca2+ ions cooperatively</text>';
      svg += '<text x="15" y="126" transform="translate(465,0)" fill="#cbd5e1" font-size="10">• Resting state: Masks active sites</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Actin Monomer', 'Globular G-Actin -> Filamentous F-Actin', '#38bdf8') +
              cell('Tropomyosin Strands', 'Two continuous helical strands', '#fbbf24') +
              cell('Troponin Subunits', 'TnT (Tropomyosin), TnI (Inhibitory), TnC (Ca2+)', '#ec4899') +
              cell('Resting State Mask', 'Troponin-Tropomyosin Complex', '#10b981');

      vHtml = '<strong>Molecular Composition of the Thin Filament:</strong> Each thin filament is composed of two filamentous <strong>F-actin</strong> strands helically wound around each other, with each F-actin assembled from monomeric <em>G-actins</em>. Running along the length of the actin grooves are two strands of the fibrous protein <strong>tropomyosin</strong>. At regular intervals along tropomyosin sits the trimeric regulatory protein complex <strong>troponin</strong>: <em>TnT</em> anchors to tropomyosin, <em>TnI</em> inhibits the actin-myosin interaction, and <em>TnC</em> binds $Ca^{2+}$ ions. In the resting unexcited state, a subunit of troponin masks the active myosin-binding sites on actin.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">THICK FILAMENT &amp; MEROMYOSIN: HEAVY (HMM) &amp; LIGHT (LMM) MEROMYOSIN</text>';

      // Meromyosin Monomer Graphic
      svg += '<g transform="translate(60, 60)">';
      svg += '<rect x="0" y="0" width="640" height="150" fill="#1e293b" rx="8" stroke="#ef4444" stroke-width="2"/>';

      // Tail (LMM)
      svg += '<line x1="40" y1="80" x2="380" y2="80" stroke="#f87171" stroke-width="10" stroke-linecap="round"/>';
      svg += '<text x="210" y="110" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">Light Meromyosin (LMM) — Tail</text>';

      // Short arm / Neck (HMM)
      svg += '<line x1="380" y1="80" x2="480" y2="50" stroke="#ef4444" stroke-width="12" stroke-linecap="round"/>';
      svg += '<text x="430" y="100" fill="#f87171" font-size="11" text-anchor="middle">Short Arm / Neck</text>';

      // Globular Heads (HMM)
      svg += '<ellipse cx="510" cy="40" rx="28" ry="18" fill="#dc2626" stroke="#fca5a5" stroke-width="2"/>';
      svg += '<ellipse cx="525" cy="55" rx="28" ry="18" fill="#b91c1c" stroke="#fca5a5" stroke-width="2"/>';
      svg += '<text x="515" y="45" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Globular Head</text>';

      // Sites on Head
      svg += '<rect x="495" y="28" width="30" height="10" fill="#fbbf24" rx="2"/>';
      svg += '<text x="510" y="36" fill="#78350f" font-size="8" font-weight="bold" text-anchor="middle">Actin Site</text>';

      svg += '<rect x="510" y="48" width="32" height="10" fill="#38bdf8" rx="2"/>';
      svg += '<text x="526" y="56" fill="#082f49" font-size="8" font-weight="bold" text-anchor="middle">ATPase Site</text>';

      // HMM Bracket
      svg += '<line x1="380" y1="130" x2="555" y2="130" stroke="#f87171" stroke-width="2"/>';
      svg += '<text x="470" y="144" fill="#f87171" font-size="11" font-weight="bold" text-anchor="middle">Heavy Meromyosin (HMM) = Head + Neck</text>';
      svg += '</g>';

      // Meromyosin Cleavage Specs
      svg += '<g transform="translate(60, 230)">';
      svg += '<rect x="0" y="0" width="640" height="115" fill="#1e293b" rx="8" stroke="#475569"/>';
      svg += '<text x="20" y="26" fill="#fbbf24" font-size="13" font-weight="bold">Meromyosin Enzymatic Cleavage &amp; Functional Properties:</text>';
      svg += '<text x="20" y="50" fill="#f8fafc" font-size="11">• Each thick filament is a polymer of ~ 300 monomeric <strong>Myosin</strong> molecules.</text>';
      svg += '<text x="20" y="70" fill="#f8fafc" font-size="11">• Trypsin cleaves myosin into: <strong>HMM</strong> (Heavy Meromyosin) and <strong>LMM</strong> (Light Meromyosin).</text>';
      svg += '<text x="20" y="90" fill="#fca5a5" font-size="11">• HMM projects outwards at regular distance and angle as a <strong>Cross-Arm</strong>.</text>';
      svg += '<text x="20" y="108" fill="#38bdf8" font-size="11">• The globular head is an active <strong>ATPase enzyme</strong> with binding sites for ATP and actin.</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Thick Filament Monomer', 'Myosin (Meromyosin Polymer)', '#ef4444') +
              cell('HMM Components', 'Globular Head + Short Arm (Cross-Arm)', '#f87171') +
              cell('LMM Component', 'Fibrous Linear Tail', '#fca5a5') +
              cell('Catalytic Function', 'Active Myosin ATPase (ATP Hydrolysis)', '#38bdf8');

      vHtml = '<strong>Molecular Blueprint of the Thick Filament:</strong> Each thick filament is a polymer of monomeric motor proteins called <em>myosin</em>. A single myosin molecule possesses two identical parts: a globular head with a short arm termed <strong>Heavy Meromyosin (HMM)</strong>, and a long fibrous tail termed <strong>Light Meromyosin (LMM)</strong>. The HMM component projects outwards at regular intervals and angles from the thick filament core, forming the <em>cross-arm</em>. The globular head functions as an active <strong>ATPase enzyme</strong>, bearing an ATP-binding catalytic pocket and a specific actin-binding site.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Sliding Filament Cross-Bridge Cycle (slidingfilamentsim)
// -------------------------------------------------------------------------
window.SIMS.slidingfilamentsim = (function(){
  var step = 0; // 0: Resting/Unmasked, 1: Cross-bridge, 2: Power Stroke, 3: Detachment, 4: Cocking

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#22c55e;"></span><span>1. Ca2+ Unmasking &amp; Cross-Bridge Attachment</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>2. Power Stroke (~45° tilt, pulls actin ~10 nm)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>3. Fresh ATP Binding &amp; Cross-Bridge Detachment</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>4. ATP Hydrolysis &amp; Head Re-cocking (90°)</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.slidingfilamentsim.setStep(0)">Stage 1: Ca2+ Release &amp; Cross-Bridge Formation</button>' +
        '<button class="preset-btn" onclick="SIMS.slidingfilamentsim.setStep(1)">Stage 2: Power Stroke (Actin Pulled to M-line)</button>' +
        '<button class="preset-btn" onclick="SIMS.slidingfilamentsim.setStep(2)">Stage 3: ATP Binding &amp; Cross-Bridge Detachment</button>' +
        '<button class="preset-btn" onclick="SIMS.slidingfilamentsim.setStep(3)">Stage 4: ATP Hydrolysis &amp; Re-Cocking (SERCA Return)</button>';
    }
    render(0);
  }

  function setStep(s){
    step = s;
    App.state.t = s;
    render(s);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
    svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">THE ROTARY CROSS-BRIDGE POWER STROKE ENGINE (HUXLEY &amp; HUXLEY)</text>';

    // Top: Thin Actin Filament track
    svg += '<g transform="translate(60, 60)">';
    svg += '<rect x="0" y="0" width="640" height="24" fill="#0284c7" rx="12"/>';
    // Beads on Actin
    for (var b = 0; b < 20; b++) {
      svg += '<circle cx="' + (20 + b * 31) + '" cy="12" r="9" fill="#0369a1" stroke="#38bdf8"/>';
    }
    svg += '<text x="320" y="16" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">THIN FILAMENT (ACTIN) — PULLED TOWARD M-LINE (➔)</text>';
    svg += '</g>';

    // Bottom: Thick Myosin Filament backbone
    svg += '<g transform="translate(60, 200)">';
    svg += '<rect x="0" y="0" width="640" height="30" fill="#7f1d1d" rx="4" stroke="#ef4444" stroke-width="2"/>';
    svg += '<text x="320" y="20" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">THICK FILAMENT (MYOSIN CORE)</text>';
    svg += '</g>';

    // Dynamic Myosin Cross-Bridge Head depending on Step
    var headX = 320;
    var headAngle = 90;
    var stateTitle = '';
    var stateDesc = '';
    var nucState = '';

    if (step === 0) {
      // Cross bridge formed, 90 deg
      headX = 320;
      headAngle = 90;
      stateTitle = '1. Cross-Bridge Formation';
      stateDesc = 'Ca2+ binds Troponin C -> Tropomyosin shifts -> Energized Myosin head (ADP + Pi) binds exposed Actin.';
      nucState = 'Bound to ADP + Pi';

      svg += '<line x1="320" y1="200" x2="320" y2="105" stroke="#ef4444" stroke-width="12" stroke-linecap="round"/>';
      svg += '<ellipse cx="320" cy="95" rx="24" ry="16" fill="#22c55e" stroke="#fff" stroke-width="2"/>';
      svg += '<text x="320" y="99" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">M · ADP · Pi</text>';
    } else if (step === 1) {
      // Power stroke, tilted 45 deg, pulled actin right
      headX = 380;
      headAngle = 45;
      stateTitle = '2. The Power Stroke';
      stateDesc = 'Release of Pi triggers head tilt (~45°) -> pulls actin filament ~10 nm toward M-line -> ADP released.';
      nucState = 'Pi & ADP Released (Rigor state)';

      svg += '<line x1="320" y1="200" x2="380" y2="95" stroke="#ef4444" stroke-width="12" stroke-linecap="round"/>';
      svg += '<ellipse cx="380" cy="90" rx="24" ry="16" fill="#ef4444" stroke="#fff" stroke-width="2" transform="rotate(30, 380, 90)"/>';
      svg += '<text x="380" y="94" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">ACTOMYOSIN</text>';
      svg += '<text x="430" y="80" fill="#facc15" font-size="16" font-weight="bold">➔ ➔ ➔</text>';
    } else if (step === 2) {
      // Detachment, fresh ATP binds
      headX = 380;
      stateTitle = '3. Cross-Bridge Detachment';
      stateDesc = 'A new molecule of ATP binds to the myosin head -> affinity for actin collapses -> Cross-bridge breaks.';
      nucState = 'Bound to fresh ATP';

      svg += '<line x1="320" y1="200" x2="360" y2="125" stroke="#ef4444" stroke-width="12" stroke-linecap="round"/>';
      svg += '<ellipse cx="360" cy="120" rx="24" ry="16" fill="#38bdf8" stroke="#fff" stroke-width="2"/>';
      svg += '<text x="360" y="124" fill="#082f49" font-size="10" font-weight="bold" text-anchor="middle">M · ATP</text>';
    } else {
      // Cocking, ATP hydrolyzed
      headX = 320;
      stateTitle = '4. ATP Hydrolysis & Cocking';
      stateDesc = 'Myosin ATPase splits ATP -> ADP + Pi -> energizes and cocks head back to 90° orientation ready for next cycle.';
      nucState = 'Hydrolyzed to ADP + Pi (High Energy)';

      svg += '<line x1="320" y1="200" x2="320" y2="125" stroke="#ef4444" stroke-width="12" stroke-linecap="round"/>';
      svg += '<ellipse cx="320" cy="120" rx="24" ry="16" fill="#fbbf24" stroke="#fff" stroke-width="2"/>';
      svg += '<text x="320" y="124" fill="#78350f" font-size="10" font-weight="bold" text-anchor="middle">Cocking 90°</text>';
    }

    // Explanatory Panel at bottom
    svg += '<g transform="translate(60, 250)">';
    svg += '<rect x="0" y="0" width="640" height="110" fill="#1e293b" rx="8" stroke="#38bdf8"/>';
    svg += '<text x="20" y="28" fill="#38bdf8" font-size="14" font-weight="bold">' + stateTitle + '</text>';
    svg += '<text x="20" y="52" fill="#f8fafc" font-size="12">' + stateDesc + '</text>';
    svg += '<text x="20" y="74" fill="#fbbf24" font-size="11"><strong>Nucleotide State:</strong> ' + nucState + '</text>';
    svg += '<text x="20" y="94" fill="#94a3b8" font-size="10">• If ATP is completely exhausted (as in death), cross-bridges cannot detach, resulting in Rigor Mortis.</text>';
    svg += '</g>';
    svg += '</svg>';

    rHtml = cell('Current Stage', stateTitle, '#38bdf8') +
            cell('Nucleotide Binding', nucState, '#fbbf24') +
            cell('Displacement / Stroke', '~ 10 nm per power stroke', '#22c55e') +
            cell('A-Band Length', 'Strictly Invariant (1.5 µm)', '#ec4899');

    vHtml = '<strong>Biomechanical Cycle of Muscle Contraction:</strong> Contraction is initiated by an action potential traversing T-tubules to trigger $Ca^{2+}$ release from the sarcoplasmic reticulum. $Ca^{2+}$ binds troponin C, unmasking actin active sites. (1) <strong>Cross-bridge formation</strong> occurs as the energized myosin head binds actin; (2) The <strong>power stroke</strong> tilts the head, pulling actin toward the M-line while releasing ADP and $P_i$; (3) <strong>Detachment</strong> occurs when a fresh ATP molecule binds the myosin head, breaking the actomyosin link; (4) Myosin ATPase <strong>hydrolyzes ATP to ADP and $P_i$</strong>, re-cocking the head into the high-energy orientation. Cycling continues as long as $Ca^{2+}$ and ATP remain available.';

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setStep: setStep
  };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Fiber Energetics & Fatigue (redwhitefibersim)
// -------------------------------------------------------------------------
window.SIMS.redwhitefibersim = (function(){
  var view = "comparison"; // "comparison", "energetics", "rigor"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#dc2626;"></span><span>Red Fibers (Type I: Slow Oxidative / High Myoglobin)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f8fafc;"></span><span>White Fibers (Type II: Fast Glycolytic / Fast Fatigue)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Phosphagen Buffer (Creatine Phosphate, 8-10s)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cori Cycle (Hepatic Lactic Acid Clearance)</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.redwhitefibersim.setView(\'comparison\')">1. Red (Type I) vs White (Type II) Fiber Lab</button>' +
        '<button class="preset-btn" onclick="SIMS.redwhitefibersim.setView(\'energetics\')">2. ATP Regeneration: Phosphagen, Glycolysis &amp; OxPhos</button>' +
        '<button class="preset-btn" onclick="SIMS.redwhitefibersim.setView(\'rigor\')">3. Lactic Fatigue, Oxygen Debt &amp; Rigor Mortis</button>';
    }
    render(0);
  }

  function setView(v){
    view = v;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (view === "comparison") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">RED (TYPE I, SLOW-TWITCH) VS WHITE (TYPE II, FAST-TWITCH) MUSCLE FIBERS</text>';

      // Left Panel: Red Fibers
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="335" height="295" fill="#1e293b" rx="8" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="167" y="28" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">Red Fibers (Type I: Slow-Twitch)</text>';

      svg += '<text x="20" y="58" fill="#fca5a5" font-size="11" font-weight="bold">• Myoglobin Content: VERY HIGH (Red appearance)</text>';
      svg += '<text x="20" y="80" fill="#f8fafc" font-size="11">• Mitochondria: Abundant, densely packed</text>';
      svg += '<text x="20" y="102" fill="#f8fafc" font-size="11">• Blood Capillary Network: Extensively vascularized</text>';
      svg += '<text x="20" y="124" fill="#34d399" font-size="11" font-weight="bold">• Primary ATP Source: Aerobic Respiration (OxPhos)</text>';
      svg += '<text x="20" y="146" fill="#f8fafc" font-size="11">• Sarcoplasmic Reticulum: Moderately developed</text>';
      svg += '<text x="20" y="168" fill="#f8fafc" font-size="11">• Myosin ATPase Velocity: Slow</text>';
      svg += '<text x="20" y="190" fill="#34d399" font-size="11" font-weight="bold">• Resistance to Fatigue: EXTREMELY HIGH</text>';
      svg += '<text x="20" y="212" fill="#f8fafc" font-size="11">• Contraction Speed: Slow, sustained, tonic</text>';
      svg += '<text x="20" y="240" fill="#fbbf24" font-size="11" font-weight="bold">Representative Anatomical Examples:</text>';
      svg += '<text x="20" y="260" fill="#f8fafc" font-size="10">• Extensor postural muscles of the human back</text>';
      svg += '<text x="20" y="278" fill="#f8fafc" font-size="10">• Flight muscles of migratory birds (e.g., kite)</text>';
      svg += '</g>';

      // Right Panel: White Fibers
      svg += '<g transform="translate(395, 60)">';
      svg += '<rect x="0" y="0" width="335" height="295" fill="#1e293b" rx="8" stroke="#f8fafc" stroke-width="2"/>';
      svg += '<text x="167" y="28" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">White Fibers (Type II: Fast-Twitch)</text>';

      svg += '<text x="20" y="58" fill="#cbd5e1" font-size="11" font-weight="bold">• Myoglobin Content: VERY LOW (Pale / White appearance)</text>';
      svg += '<text x="20" y="80" fill="#f8fafc" font-size="11">• Mitochondria: Few in number</text>';
      svg += '<text x="20" y="102" fill="#f8fafc" font-size="11">• Blood Capillary Network: Relatively sparse</text>';
      svg += '<text x="20" y="124" fill="#fbbf24" font-size="11" font-weight="bold">• Primary ATP Source: Anaerobic Glycolysis</text>';
      svg += '<text x="20" y="146" fill="#38bdf8" font-size="11" font-weight="bold">• Sarcoplasmic Reticulum: Highly extensive / abundant</text>';
      svg += '<text x="20" y="168" fill="#f8fafc" font-size="11">• Myosin ATPase Velocity: Fast</text>';
      svg += '<text x="20" y="190" fill="#ef4444" font-size="11" font-weight="bold">• Resistance to Fatigue: VERY LOW (Fatigues rapidly)</text>';
      svg += '<text x="20" y="212" fill="#f8fafc" font-size="11">• Contraction Speed: Rapid, powerful phasic bursts</text>';
      svg += '<text x="20" y="240" fill="#fbbf24" font-size="11" font-weight="bold">Representative Anatomical Examples:</text>';
      svg += '<text x="20" y="260" fill="#f8fafc" font-size="10">• Extraocular muscles of human eyeball</text>';
      svg += '<text x="20" y="278" fill="#f8fafc" font-size="10">• Flight muscles of domestic fowl (sparrow, hen)</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Red Fiber Metabolism', 'Aerobic (Oxidative Phosphorylation)', '#ef4444') +
              cell('White Fiber Metabolism', 'Anaerobic (Glycolysis -> Lactate)', '#f8fafc') +
              cell('Sarcoplasmic Reticulum', 'Abundant in White Fibers', '#38bdf8') +
              cell('Myoglobin Density', 'Highest in Red Postural Fibers', '#fbbf24');

      vHtml = '<strong>Physiological Divergence of Red vs White Muscle Fibers:</strong> Skeletal muscles house two major functional classes of fibers. <em>Red fibers</em> are enriched with <strong>myoglobin</strong>, an iron-containing oxygen-storing hemeprotein that imparts a deep red color, packed with mitochondria, and surrounded by dense capillary beds; they rely on aerobic respiration, contract slowly, and are exceptionally fatigue-resistant (ideal for postural endurance). Conversely, <em>white fibers</em> contain minimal myoglobin, few mitochondria, but possess an abundant sarcoplasmic reticulum; they rely on anaerobic glycolysis for rapid, high-intensity contractions but fatigue quickly due to lactic acid accumulation.';
    } else if (view === "energetics") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">ATP REGENERATION PATHWAYS DURING SKELETAL MUSCLE CONTRACTION</text>';

      // Three Systems Graphic
      // System 1: Phosphagen
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="220" height="280" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<text x="110" y="26" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">1. Phosphagen System</text>';
      svg += '<rect x="15" y="45" width="190" height="45" fill="#78350f" rx="6"/>';
      svg += '<text x="105" y="65" fill="#fef08a" font-size="10" text-anchor="middle">Reaction Catalyst:</text>';
      svg += '<text x="105" y="80" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Creatine Kinase</text>';
      svg += '<text x="15" y="115" fill="#f8fafc" font-size="11">PCr + ADP -> Creatine + ATP</text>';
      svg += '<text x="15" y="145" fill="#f8fafc" font-size="11">• Instantaneous cytosolic buffer</text>';
      svg += '<text x="15" y="170" fill="#f8fafc" font-size="11">• Zero oxygen required</text>';
      svg += '<text x="15" y="195" fill="#f8fafc" font-size="11">• Zero lactic acid formed</text>';
      svg += '<text x="15" y="235" fill="#fbbf24" font-size="11" font-weight="bold">Duration of Maximal Effort:</text>';
      svg += '<text x="15" y="255" fill="#fff" font-size="13" font-weight="bold">~ 8 to 10 Seconds (Sprint)</text>';
      svg += '</g>';

      // System 2: Anaerobic Glycolysis
      svg += '<g transform="translate(270, 60)">';
      svg += '<rect x="0" y="0" width="220" height="280" fill="#1e293b" rx="8" stroke="#f87171" stroke-width="2"/>';
      svg += '<text x="110" y="26" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">2. Anaerobic Glycolysis</text>';
      svg += '<rect x="15" y="45" width="190" height="45" fill="#7f1d1d" rx="6"/>';
      svg += '<text x="105" y="65" fill="#fca5a5" font-size="10" text-anchor="middle">Substrate &amp; Yield:</text>';
      svg += '<text x="105" y="80" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Glucose -> 2 Lactic Acid</text>';
      svg += '<text x="15" y="115" fill="#f8fafc" font-size="11">Net Yield: 2 ATP / Glucose</text>';
      svg += '<text x="15" y="145" fill="#f8fafc" font-size="11">• Operates when O2 is limited</text>';
      svg += '<text x="15" y="170" fill="#ef4444" font-size="11">• Accumulates Lactic Acid</text>';
      svg += '<text x="15" y="195" fill="#ef4444" font-size="11">• Causes intracellular acidosis</text>';
      svg += '<text x="15" y="235" fill="#f87171" font-size="11" font-weight="bold">Duration of Maximal Effort:</text>';
      svg += '<text x="15" y="255" fill="#fff" font-size="13" font-weight="bold">~ 1 to 2 Minutes</text>';
      svg += '</g>';

      // System 3: Aerobic Cellular Respiration
      svg += '<g transform="translate(510, 60)">';
      svg += '<rect x="0" y="0" width="220" height="280" fill="#1e293b" rx="8" stroke="#34d399" stroke-width="2"/>';
      svg += '<text x="110" y="26" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">3. Aerobic Respiration</text>';
      svg += '<rect x="15" y="45" width="190" height="45" fill="#064e3b" rx="6"/>';
      svg += '<text x="105" y="65" fill="#a7f3d0" font-size="10" text-anchor="middle">Mitochondrial Engine:</text>';
      svg += '<text x="105" y="80" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Krebs Cycle + OxPhos</text>';
      svg += '<text x="15" y="115" fill="#f8fafc" font-size="11">Net Yield: ~30-32 ATP / Glucose</text>';
      svg += '<text x="15" y="145" fill="#f8fafc" font-size="11">• Requires continuous O2</text>';
      svg += '<text x="15" y="170" fill="#f8fafc" font-size="11">• End products: CO2 + H2O</text>';
      svg += '<text x="15" y="195" fill="#34d399" font-size="11">• Zero lactic acid generation</text>';
      svg += '<text x="15" y="235" fill="#34d399" font-size="11" font-weight="bold">Duration of Sustainable Effort:</text>';
      svg += '<text x="15" y="255" fill="#fff" font-size="13" font-weight="bold">Hours (Marathon / Posture)</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Phosphagen Buffer', 'Creatine Phosphate (8–10 s)', '#fbbf24') +
              cell('Anaerobic Glycolysis', '2 ATP + Lactic Acid (1–2 min)', '#f87171') +
              cell('Aerobic Respiration', '30–32 ATP / Glucose (Hours)', '#34d399') +
              cell('Primary Muscle Glycogen', 'Store of endogenous glucose', '#38bdf8');

      vHtml = '<strong>Energetics of Muscular Work:</strong> Free cytosolic ATP is depleted within 1–2 seconds of contraction. The <em>Phosphagen System</em> instantly rephosphorylates ADP via <strong>phosphocreatine</strong> and creatine kinase, powering the first 8–10 seconds of explosive activity. For sustained high-intensity exertion up to 1–2 minutes, <em>anaerobic glycolysis</em> breaks down glycogen into lactic acid, yielding 2 ATP per glucose. For long-term endurance activities, <em>aerobic respiration</em> inside mitochondria oxidizes pyruvate, fatty acids, and amino acids to generate 30–32 ATP per glucose without fatiguing lactic accumulation.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">MUSCLE FATIGUE, OXYGEN DEBT (CORI CYCLE) &amp; RIGOR MORTIS</text>';

      // Left: Cori Cycle
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="335" height="295" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="167" y="26" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">The Cori Cycle: Lactate Clearance</text>';

      svg += '<rect x="20" y="45" width="295" height="60" fill="#7f1d1d" rx="6"/>';
      svg += '<text x="30" y="68" fill="#fca5a5" font-size="11" font-weight="bold">Skeletal Muscle under Anaerobic Debt:</text>';
      svg += '<text x="30" y="88" fill="#fff" font-size="10">Glucose -> Pyruvate -> Lactic Acid (Acidosis &amp; Fatigue)</text>';

      svg += '<text x="167" y="130" fill="#38bdf8" font-size="14" text-anchor="middle">Blood Circulation ➔ ➔</text>';

      svg += '<rect x="20" y="145" width="295" height="60" fill="#065f46" rx="6"/>';
      svg += '<text x="30" y="168" fill="#a7f3d0" font-size="11" font-weight="bold">Hepatocytes (Liver Gluconeogenesis):</text>';
      svg += '<text x="30" y="188" fill="#fff" font-size="10">2 Lactic Acid -> Glucose (Costs 6 ATP, clears debt)</text>';

      svg += '<text x="20" y="235" fill="#fbbf24" font-size="11" font-weight="bold">Oxygen Debt (EPOC):</text>';
      svg += '<text x="20" y="255" fill="#f8fafc" font-size="10">• Extra O2 consumed post-exercise to resynthesize PCr &amp; glycogen</text>';
      svg += '<text x="20" y="275" fill="#f8fafc" font-size="10">• Restores cellular ATP reserves and normalizes blood pH</text>';
      svg += '</g>';

      // Right: Rigor Mortis
      svg += '<g transform="translate(395, 60)">';
      svg += '<rect x="0" y="0" width="335" height="295" fill="#1e293b" rx="8" stroke="#ec4899" stroke-width="2"/>';
      svg += '<text x="167" y="26" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">Rigor Mortis: Post-Mortem Rigidity</text>';

      svg += '<rect x="20" y="45" width="295" height="50" fill="#0f172a" rx="6" stroke="#9d174d"/>';
      svg += '<text x="30" y="66" fill="#f472b6" font-size="11" font-weight="bold">1. Cessation of Cellular Respiration:</text>';
      svg += '<text x="30" y="82" fill="#f8fafc" font-size="10">ATP synthesis ceases completely post-mortem</text>';

      svg += '<rect x="20" y="105" width="295" height="50" fill="#0f172a" rx="6" stroke="#9d174d"/>';
      svg += '<text x="30" y="126" fill="#f472b6" font-size="11" font-weight="bold">2. Sarcoplasmic Calcium Leakage:</text>';
      svg += '<text x="30" y="142" fill="#f8fafc" font-size="10">Ca2+ leaks from SR, binding troponin and exposing actin</text>';

      svg += '<rect x="20" y="165" width="295" height="60" fill="#0f172a" rx="6" stroke="#9d174d"/>';
      svg += '<text x="30" y="186" fill="#f472b6" font-size="11" font-weight="bold">3. Permanent Actomyosin Cross-Bridges:</text>';
      svg += '<text x="30" y="202" fill="#f8fafc" font-size="10">Without new ATP, cross-bridges CANNOT detach</text>';
      svg += '<text x="30" y="216" fill="#fca5a5" font-size="10">Muscle enters persistent rigid lock (Rigor Mortis)</text>';

      svg += '<text x="20" y="255" fill="#fbbf24" font-size="11" font-weight="bold">Timeline:</text>';
      svg += '<text x="20" y="275" fill="#f8fafc" font-size="10">Begins 3–4 hrs post-mortem, peaks at 12 hrs, ends with autolysis</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Oxygen Debt Destination', 'Liver Cori Cycle (Gluconeogenesis)', '#38bdf8') +
              cell('Lactic Acid Effect', 'Inhibits PFK & displaces Ca2+ (Fatigue)', '#ef4444') +
              cell('Rigor Mortis Cause', 'Zero ATP to detach myosin cross-bridges', '#ec4899') +
              cell('Rigor Mortis Peak', '~ 12 Hours Post-Mortem', '#fbbf24');

      vHtml = '<strong>Fatigue, Metabolic Recovery and Rigor Mortis:</strong> Prolonged intense anaerobic exercise leads to accumulation of <em>lactic acid</em> in muscle fibers, causing intracellular acidosis and contractile fatigue. In the recovery phase, the <strong>Cori cycle</strong> transports lactate via the bloodstream to the liver, where gluconeogenesis expends 6 ATP to reconstitute glucose. Post-mortem, the cessation of mitochondrial ATP generation triggers <strong>Rigor Mortis</strong>: as cellular membranes degrade, $Ca^{2+}$ leaks into sarcoplasm, forming actomyosin cross-bridges. Because detachment strictly requires fresh ATP binding, cross-bridges remain permanently locked until lysosomal enzymes degrade the myofibrils.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Axial Skeleton (axialskeletonsim)
// -------------------------------------------------------------------------
window.SIMS.axialskeletonsim = (function(){
  var view = "skull"; // "skull", "vertebrae", "ribcage"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Cranial Bones (8 Bones, Fibrous Sutures)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Facial Bones (14 Bones, Mandible Movable)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Vertebral Column (26 Serial Units, C7-T12-L5-S1-Co1)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Thoracic Cage (12 Rib Pairs + Sternum)</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.axialskeletonsim.setView(\'skull\')">1. Cranium &amp; Facial Skeleton (22 Bones + Ear Ossicles)</button>' +
        '<button class="preset-btn" onclick="SIMS.axialskeletonsim.setView(\'vertebrae\')">2. Vertebral Column: Atlas, Axis &amp; Curvatures</button>' +
        '<button class="preset-btn" onclick="SIMS.axialskeletonsim.setView(\'ribcage\')">3. Bicephalic Ribs: True, False &amp; Floating Ribs</button>';
    }
    render(0);
  }

  function setView(v){
    view = v;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (view === "skull") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HUMAN SKULL ARCHITECTURE: CRANIAL (8), FACIAL (14) &amp; ASSOCIATED (7) BONES</text>';

      // Left: Cranial Bones Card
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="335" height="295" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="167" y="26" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Cranial Bones (8 Bones, Braincase)</text>';

      svg += '<text x="20" y="55" fill="#f8fafc" font-size="11">• <strong>Frontal (1):</strong> Forehead &amp; superior orbital roofs</text>';
      svg += '<text x="20" y="78" fill="#f8fafc" font-size="11">• <strong>Parietal (2):</strong> Superior &amp; lateral braincase walls</text>';
      svg += '<text x="20" y="101" fill="#f8fafc" font-size="11">• <strong>Temporal (2):</strong> Lateral cranial walls &amp; acoustic meatus</text>';
      svg += '<text x="20" y="124" fill="#f8fafc" font-size="11">• <strong>Occipital (1):</strong> Posterior base; houses Foramen Magnum</text>';
      svg += '<text x="20" y="147" fill="#f8fafc" font-size="11">• <strong>Sphenoid (1):</strong> Keystone bone with Sella Turcica (pituitary)</text>';
      svg += '<text x="20" y="170" fill="#f8fafc" font-size="11">• <strong>Ethmoid (1):</strong> Cribriform plate &amp; nasal septum</text>';

      svg += '<line x1="20" y1="188" x2="315" y2="188" stroke="#334155"/>';
      svg += '<text x="20" y="210" fill="#fbbf24" font-size="11" font-weight="bold">Specialized Morphological Landmarks:</text>';
      svg += '<text x="20" y="230" fill="#34d399" font-size="11">• <strong>Dicondylic Skull:</strong> Two occipital condyles articulate with Atlas (C1)</text>';
      svg += '<text x="20" y="252" fill="#38bdf8" font-size="11">• <strong>Cranial Sutures:</strong> Immovable fibrous connective tissue joints</text>';
      svg += '<text x="20" y="274" fill="#f8fafc" font-size="10">• Coronal, Sagittal, Lambdoid &amp; Squamosal sutures</text>';
      svg += '</g>';

      // Right: Facial & Associated Bones Card
      svg += '<g transform="translate(395, 60)">';
      svg += '<rect x="0" y="0" width="335" height="295" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<text x="167" y="26" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Facial (14) &amp; Associated (7) Bones</text>';

      svg += '<text x="20" y="55" fill="#f8fafc" font-size="11">• <strong>Nasals (2):</strong> Form bridge of nose</text>';
      svg += '<text x="20" y="75" fill="#f8fafc" font-size="11">• <strong>Maxillae (2):</strong> Upper jaw bones with teeth sockets</text>';
      svg += '<text x="20" y="95" fill="#f8fafc" font-size="11">• <strong>Zygomatics (2):</strong> Cheekbones</text>';
      svg += '<text x="20" y="115" fill="#f8fafc" font-size="11">• <strong>Lacrimals (2):</strong> Medial eye orbits (tear ducts)</text>';
      svg += '<text x="20" y="135" fill="#f8fafc" font-size="11">• <strong>Palatines (2):</strong> Posterior hard palate</text>';
      svg += '<text x="20" y="155" fill="#f8fafc" font-size="11">• <strong>Inferior Conchae (2):</strong> Lateral nasal wall turbulence</text>';
      svg += '<text x="20" y="175" fill="#f8fafc" font-size="11">• <strong>Vomer (1):</strong> Inferior nasal septum | <strong>Mandible (1):</strong> Lower jaw</text>';

      svg += '<line x1="20" y1="188" x2="315" y2="188" stroke="#334155"/>';
      svg += '<text x="20" y="210" fill="#ec4899" font-size="11" font-weight="bold">Associated Bones (7 Bones):</text>';
      svg += '<text x="20" y="230" fill="#f472b6" font-size="11">• <strong>Hyoid Bone (1):</strong> U-shaped base of tongue, NO articulations</text>';
      svg += '<text x="20" y="252" fill="#38bdf8" font-size="11">• <strong>Ear Ossicles (6):</strong> Malleus (2), Incus (2), Stapes (2, smallest)</text>';
      svg += '<text x="20" y="274" fill="#fbbf24" font-size="11">Total Skull Complex = 22 + 1 + 6 = <strong>29 Bones</strong></text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Cranial Bones Count', '8 Bones (Fibrous Sutures)', '#38bdf8') +
              cell('Facial Bones Count', '14 Bones (Mandible Movable)', '#fbbf24') +
              cell('Skull Condyles', 'Dicondylic (2 Occipital Condyles)', '#34d399') +
              cell('Associated Cranial Bones', '1 Hyoid + 6 Ear Ossicles = 29 Total', '#ec4899');

      vHtml = '<strong>Morpho-Anatomy of the Human Skull:</strong> The human skull sits atop the vertebral column via two rounded <em>occipital condyles</em>, making it <strong>dicondylic</strong>. The skull consists of two sets of bones: 8 <em>cranial bones</em> (1 frontal, 2 parietal, 2 temporal, 1 occipital, 1 sphenoid, and 1 ethmoid) joined immovably by fibrous sutures to enclose and protect the brain; and 14 <em>facial bones</em> forming the front of the skull, with the <strong>mandible</strong> (lower jaw) being the sole movable bone. In addition, a single U-shaped <strong>hyoid bone</strong> resides at the base of the buccal cavity without articulating with any other bone, and each middle ear contains 3 tiny <em>ear ossicles</em> (malleus, incus, and stapes), totaling 29 bones in the cranial complex.';
    } else if (view === "vertebrae") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HUMAN VERTEBRAL COLUMN: 26 SERIALLY ARRANGED UNITS &amp; SPINAL CANAL</text>';

      // Left: Vertebral Regions
      var regions = [
        { name: "Cervical (C1 – C7)", count: "7 Vertebrae", desc: "Universal mammalian number; C1 Atlas (nodding 'yes'), C2 Axis (odontoid pivot 'no')", color: "#38bdf8", y: 65 },
        { name: "Thoracic (T1 – T12)", count: "12 Vertebrae", desc: "Articulate dorsally with 12 pairs of ribs via costal facets; kyphotic curve", color: "#fbbf24", y: 130 },
        { name: "Lumbar (L1 – L5)", count: "5 Vertebrae", desc: "Largest, massive cylindrical bodies designed for heavy weight-bearing; lordotic", color: "#34d399", y: 195 },
        { name: "Sacral (S1) & Coccygeal (Co1)", count: "2 Fused Bones", desc: "Sacrum (5 fused vertebrae) articulates with pelvis; Coccyx (4 fused, vestigial tail)", color: "#ec4899", y: 260 }
      ];

      for (var r = 0; r < regions.length; r++) {
        var reg = regions[r];
        svg += '<g transform="translate(40, ' + reg.y + ')">';
        svg += '<rect x="0" y="0" width="680" height="55" fill="#1e293b" rx="6" stroke="' + reg.color + '" stroke-width="2"/>';
        svg += '<text x="20" y="24" fill="' + reg.color + '" font-size="13" font-weight="bold">' + reg.name + ' — ' + reg.count + '</text>';
        svg += '<text x="20" y="44" fill="#f8fafc" font-size="11">' + reg.desc + '</text>';
        svg += '</g>';
      }

      svg += '<text x="50" y="340" fill="#94a3b8" font-size="11">Vertebral Formula: C7 T12 L5 S(5)->1 Co(4)->1 = 26 Functional Bone Units. Central Neural Canal houses Spinal Cord.</text>';
      svg += '</svg>';

      rHtml = cell('Cervical Count', '7 Vertebrae (Mammalian Hallmark)', '#38bdf8') +
              cell('Thoracic Count', '12 Vertebrae (Rib Articulations)', '#fbbf24') +
              cell('Total Adult Vertebrae', '26 Functional Units', '#34d399') +
              cell('C1 & C2 Specialization', 'Atlas (Nodding) & Axis (Pivot Dens)', '#ec4899');

      vHtml = '<strong>Zonation and Biomechanics of the Vertebral Column:</strong> The adult human vertebral column comprises <strong>26 serially arranged bones</strong> separated by fibrocartilaginous intervertebral discs. It is partitioned into five distinct anatomical regions: <strong>7 Cervical</strong> ($C_1-C_7$), <strong>12 Thoracic</strong> ($T_1-T_{12}$), <strong>5 Lumbar</strong> ($L_1-L_5$), <strong>1 Sacrum</strong> (formed by the fusion of 5 sacral vertebrae), and <strong>1 Coccyx</strong> (formed by the fusion of 4 vestigial coccygeal vertebrae). The column is perforated along its length by the <em>neural canal</em>, providing rigid protection for the delicate spinal cord. The first vertebra, the <em>atlas</em>, articulates with the occipital condyles, while the second, the <em>axis</em>, forms a pivot joint enabling head rotation.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">THORACIC CAGE &amp; BICEPHALIC RIBS: TRUE, FALSE &amp; FLOATING RIBS</text>';

      // Three rib types cards
      // Card 1: True Ribs
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="220" height="280" fill="#1e293b" rx="8" stroke="#34d399" stroke-width="2"/>';
      svg += '<text x="110" y="26" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">1. True Ribs (Pairs 1–7)</text>';
      svg += '<rect x="15" y="45" width="190" height="40" fill="#064e3b" rx="6"/>';
      svg += '<text x="105" y="69" fill="#a7f3d0" font-size="12" font-weight="bold" text-anchor="middle">Vertebrosternal Ribs</text>';
      svg += '<text x="15" y="110" fill="#f8fafc" font-size="11">• Pairs 1, 2, 3, 4, 5, 6, 7</text>';
      svg += '<text x="15" y="135" fill="#f8fafc" font-size="11">• Dorsal Attachment: T1–T7</text>';
      svg += '<text x="15" y="160" fill="#34d399" font-size="11" font-weight="bold">• Ventral Attachment:</text>';
      svg += '<text x="15" y="180" fill="#f8fafc" font-size="10">Directly to the sternum via individual hyaline costal cartilages</text>';
      svg += '<text x="15" y="220" fill="#cbd5e1" font-size="10">• Bicephalic dorsal heads (capitulum &amp; tubercle)</text>';
      svg += '</g>';

      // Card 2: False Ribs
      svg += '<g transform="translate(270, 60)">';
      svg += '<rect x="0" y="0" width="220" height="280" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<text x="110" y="26" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">2. False Ribs (Pairs 8–10)</text>';
      svg += '<rect x="15" y="45" width="190" height="40" fill="#78350f" rx="6"/>';
      svg += '<text x="105" y="69" fill="#fef08a" font-size="12" font-weight="bold" text-anchor="middle">Vertebrochondral Ribs</text>';
      svg += '<text x="15" y="110" fill="#f8fafc" font-size="11">• Pairs 8, 9, 10</text>';
      svg += '<text x="15" y="135" fill="#f8fafc" font-size="11">• Dorsal Attachment: T8–T10</text>';
      svg += '<text x="15" y="160" fill="#fbbf24" font-size="11" font-weight="bold">• Ventral Attachment:</text>';
      svg += '<text x="15" y="180" fill="#f8fafc" font-size="10">Do NOT join sternum directly; fuse with the cartilage of the 7th rib</text>';
      svg += '<text x="15" y="220" fill="#cbd5e1" font-size="10">• Form the inferior costal arch margin</text>';
      svg += '</g>';

      // Card 3: Floating Ribs
      svg += '<g transform="translate(510, 60)">';
      svg += '<rect x="0" y="0" width="220" height="280" fill="#1e293b" rx="8" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="110" y="26" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">3. Floating Ribs (11–12)</text>';
      svg += '<rect x="15" y="45" width="190" height="40" fill="#7f1d1d" rx="6"/>';
      svg += '<text x="105" y="69" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">Vertebral Ribs</text>';
      svg += '<text x="15" y="110" fill="#f8fafc" font-size="11">• Pairs 11 and 12</text>';
      svg += '<text x="15" y="135" fill="#f8fafc" font-size="11">• Dorsal Attachment: T11–T12</text>';
      svg += '<text x="15" y="160" fill="#ef4444" font-size="11" font-weight="bold">• Ventral Attachment: NONE</text>';
      svg += '<text x="15" y="180" fill="#f8fafc" font-size="10">Completely unattached ventrally; terminate freely in abdominal muscle</text>';
      svg += '<text x="15" y="220" fill="#cbd5e1" font-size="10">• Protect retroperitoneal kidneys</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('True Rib Pairs', 'Pairs 1–7 (Vertebrosternal)', '#34d399') +
              cell('False Rib Pairs', 'Pairs 8–10 (Vertebrochondral)', '#fbbf24') +
              cell('Floating Rib Pairs', 'Pairs 11–12 (Vertebral, unattached)', '#ef4444') +
              cell('Bicephalic Articulation', 'Two dorsal heads (Capitulum & Tubercle)', '#38bdf8');

      vHtml = '<strong>The Bicephalic Rib Cage Architecture:</strong> Humans possess <strong>12 pairs of ribs</strong> (24 bones). Each rib is a thin, curved flat bone connected dorsally to the thoracic vertebrae via two distinct articulation points (capitulum and tubercle), earning them the designation <strong>bicephalic</strong>. The first 7 pairs are <em>True ribs (vertebrosternal)</em>, connected ventrally directly to the sternum via hyaline costal cartilage. Pairs 8, 9, and 10 are <em>False ribs (vertebrochondral)</em>, which do not join the sternum directly but fuse into the cartilage of the 7th rib. The 11th and 12th pairs are <em>Floating ribs (vertebral)</em>, having zero ventral attachment and terminating freely to shield the kidneys.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Appendicular Skeleton (appendicularskeletonsim)
// -------------------------------------------------------------------------
window.SIMS.appendicularskeletonsim = (function(){
  var view = "limbs"; // "limbs", "pectoral", "pelvic"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Forelimb (30 Bones: Humerus, Radius, Ulna, Carpals, etc.)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Hindlimb (30 Bones: Femur, Patella, Tibia, Fibula, etc.)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Pectoral Girdle (4 Bones: Clavicle + Scapula Glenoid)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Pelvic Girdle (2 Coxal Bones: Ilium, Ischium, Pubis Acetabulum)</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.appendicularskeletonsim.setView(\'limbs\')">1. Limb Osteology &amp; Phalangeal Formula (30 x 4 = 120)</button>' +
        '<button class="preset-btn" onclick="SIMS.appendicularskeletonsim.setView(\'pectoral\')">2. Pectoral Girdle: Clavicle, Scapula &amp; Glenoid Cavity</button>' +
        '<button class="preset-btn" onclick="SIMS.appendicularskeletonsim.setView(\'pelvic\')">3. Pelvic Girdle: Coxal Fusion, Acetabulum &amp; Symphysis</button>';
    }
    render(0);
  }

  function setView(v){
    view = v;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (view === "limbs") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">APPENDICULAR LIMB OSTEOLOGY: FORELIMB (30) VS HINDLIMB (30)</text>';

      // Left Panel: Forelimb
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="335" height="295" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="167" y="26" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Forelimb (30 Bones per Arm)</text>';

      svg += '<text x="20" y="55" fill="#f8fafc" font-size="11">• <strong>Humerus (1):</strong> Upper arm bone; head fits in glenoid</text>';
      svg += '<text x="20" y="78" fill="#f8fafc" font-size="11">• <strong>Radius (1):</strong> Lateral forearm bone (thumb side)</text>';
      svg += '<text x="20" y="101" fill="#f8fafc" font-size="11">• <strong>Ulna (1):</strong> Medial forearm bone; olecranon elbow process</text>';
      svg += '<text x="20" y="124" fill="#38bdf8" font-size="11" font-weight="bold">• Carpals (8): Wrist bones arranged in two rows of 4</text>';
      svg += '<text x="20" y="147" fill="#f8fafc" font-size="11">• <strong>Metacarpals (5):</strong> Palm bones</text>';
      svg += '<text x="20" y="170" fill="#34d399" font-size="11" font-weight="bold">• Phalanges (14): Digits with formula 2, 3, 3, 3, 3</text>';
      svg += '<text x="35" y="190" fill="#94a3b8" font-size="10">Thumb (Pollex) = 2 phalanges; Fingers II–V = 3 each</text>';

      svg += '<line x1="20" y1="210" x2="315" y2="210" stroke="#334155"/>';
      svg += '<text x="20" y="235" fill="#fbbf24" font-size="11" font-weight="bold">Biomechanical Specialization:</text>';
      svg += '<text x="20" y="255" fill="#f8fafc" font-size="10">Specialized for extreme range of motion, rotation, dexterity, and tool manipulation.</text>';
      svg += '</g>';

      // Right Panel: Hindlimb
      svg += '<g transform="translate(395, 60)">';
      svg += '<rect x="0" y="0" width="335" height="295" fill="#1e293b" rx="8" stroke="#34d399" stroke-width="2"/>';
      svg += '<text x="167" y="26" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">Hindlimb (30 Bones per Leg)</text>';

      svg += '<text x="20" y="55" fill="#f8fafc" font-size="11">• <strong>Femur (1):</strong> Thigh bone; longest, heaviest &amp; strongest</text>';
      svg += '<text x="20" y="78" fill="#ec4899" font-size="11" font-weight="bold">• Patella (1): Cup-shaped knee cap (sesamoid bone)</text>';
      svg += '<text x="20" y="101" fill="#f8fafc" font-size="11">• <strong>Tibia (1):</strong> Medial, large weight-bearing shin bone</text>';
      svg += '<text x="20" y="124" fill="#f8fafc" font-size="11">• <strong>Fibula (1):</strong> Lateral slender non-weight-bearing strut</text>';
      svg += '<text x="20" y="147" fill="#34d399" font-size="11" font-weight="bold">• Tarsals (7): Ankle bones (calcaneus forms heel)</text>';
      svg += '<text x="20" y="170" fill="#f8fafc" font-size="11">• <strong>Metatarsals (5):</strong> Sole bones of foot</text>';
      svg += '<text x="20" y="193" fill="#34d399" font-size="11" font-weight="bold">• Phalanges (14): Toes with formula 2, 3, 3, 3, 3</text>';
      svg += '<text x="35" y="213" fill="#94a3b8" font-size="10">Big Toe (Hallux) = 2 phalanges; Toes II–V = 3 each</text>';

      svg += '<line x1="20" y1="225" x2="315" y2="225" stroke="#334155"/>';
      svg += '<text x="20" y="248" fill="#fbbf24" font-size="11" font-weight="bold">Biomechanical Specialization:</text>';
      svg += '<text x="20" y="268" fill="#f8fafc" font-size="10">Specialized for upright bipedal posture, shock absorption, and massive weight transfer.</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Bones per Limb', 'Exactly 30 Bones (Total 120 Limbs)', '#38bdf8') +
              cell('Carpals vs Tarsals', '8 Wrist Carpals vs 7 Ankle Tarsals', '#fbbf24') +
              cell('Sesamoid Knee Cap', 'Patella (Enclosed in Quadriceps tendon)', '#ec4899') +
              cell('Digital Formula', '2, 3, 3, 3, 3 (14 Phalanges / limb)', '#34d399');

      vHtml = '<strong>Homologous Skeletal Organization of Human Limbs:</strong> Each human upper and lower limb is constructed of precisely <strong>30 bones</strong> (totaling 120 limb bones). The forelimb comprises 1 humerus, 1 radius, 1 ulna, 8 carpals (wrist), 5 metacarpals (palm), and 14 phalanges (digits). The hindlimb mirrors this blueprint with 1 femur (the longest and strongest bone in the human body), 1 patella (a sesamoid knee cap), 1 tibia (medial weight-bearing shin bone), 1 fibula (lateral), 7 tarsals (ankle), 5 metatarsals (sole), and 14 phalanges. Both the hand and foot share the exact same digital phalangeal formula: <strong>2, 3, 3, 3, 3</strong>.';
    } else if (view === "pectoral") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">PECTORAL GIRDLE (4 BONES): CLAVICLE, SCAPULA &amp; GLENOID CAVITY</text>';

      // Left: Scapula & Clavicle Graphic
      svg += '<g transform="translate(60, 60)">';
      // Clavicle S-shape
      svg += '<path d="M 40 40 Q 140 10, 220 50 Q 300 90, 360 40" fill="none" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/>';
      svg += '<text x="200" y="25" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Clavicle (Collar bone: S-shaped, 2 curvatures)</text>';

      // Scapula Triangular Body
      svg += '<polygon points="80,100 280,100 180,260" fill="#1e3a8a" stroke="#3b82f6" stroke-width="3"/>';
      svg += '<text x="180" y="180" fill="#93c5fd" font-size="12" font-weight="bold" text-anchor="middle">Scapula (Shoulder Blade)</text>';
      svg += '<text x="180" y="200" fill="#cbd5e1" font-size="10" text-anchor="middle">Dorsal Thorax: Ribs 2 to 7</text>';

      // Spine of Scapula & Acromion
      svg += '<line x1="100" y1="110" x2="260" y2="110" stroke="#60a5fa" stroke-width="6"/>';
      svg += '<path d="M 260 110 L 300 90 L 320 100 Z" fill="#2563eb" stroke="#93c5fd"/>';
      svg += '<text x="320" y="80" fill="#38bdf8" font-size="11" font-weight="bold">Acromion Process</text>';

      // Glenoid Cavity
      svg += '<ellipse cx="290" cy="130" rx="14" ry="22" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>';
      svg += '<text x="315" y="135" fill="#f87171" font-size="11" font-weight="bold">Glenoid Cavity</text>';
      svg += '<text x="315" y="150" fill="#94a3b8" font-size="9">(Articulates with Humerus)</text>';
      svg += '</g>';

      // Right: Structural Breakdown
      svg += '<g transform="translate(440, 60)">';
      svg += '<rect x="0" y="0" width="290" height="295" fill="#1e293b" rx="8" stroke="#38bdf8"/>';
      svg += '<text x="20" y="28" fill="#38bdf8" font-size="13" font-weight="bold">Pectoral Girdle Specifications:</text>';
      svg += '<text x="20" y="52" fill="#f8fafc" font-size="11">• Total Bones: 4 (2 Clavicles + 2 Scapulae)</text>';
      svg += '<text x="20" y="74" fill="#f8fafc" font-size="11">• Each half consists of 1 Clavicle &amp; 1 Scapula</text>';

      svg += '<line x1="20" y1="88" x2="270" y2="88" stroke="#334155"/>';
      svg += '<text x="20" y="110" fill="#fbbf24" font-size="12" font-weight="bold">1. Clavicle (Collar Bone):</text>';
      svg += '<text x="20" y="130" fill="#f8fafc" font-size="10">• Slender horizontal rod with two curves (S-shape)</text>';
      svg += '<text x="20" y="148" fill="#f8fafc" font-size="10">• Articulates medially with Sternum</text>';
      svg += '<text x="20" y="166" fill="#f8fafc" font-size="10">• Articulates laterally with Acromion process</text>';

      svg += '<line x1="20" y1="180" x2="270" y2="180" stroke="#334155"/>';
      svg += '<text x="20" y="202" fill="#34d399" font-size="12" font-weight="bold">2. Scapula (Shoulder Blade):</text>';
      svg += '<text x="20" y="222" fill="#f8fafc" font-size="10">• Large triangular flat bone dorsally at Ribs 2–7</text>';
      svg += '<text x="20" y="240" fill="#f8fafc" font-size="10">• Prominent elevated ridge: Spine of Scapula</text>';
      svg += '<text x="20" y="258" fill="#f8fafc" font-size="10">• Spine projects laterally as flattened <strong>Acromion</strong></text>';
      svg += '<text x="20" y="278" fill="#ef4444" font-size="10"><strong>Glenoid Cavity:</strong> Shallow cup for Humerus head</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Pectoral Bone Count', '4 Bones (2 Clavicles + 2 Scapulae)', '#38bdf8') +
              cell('Scapular Position', 'Dorsal Thorax between Ribs 2 and 7', '#fbbf24') +
              cell('Lateral Process', 'Acromion (Articulates with Clavicle)', '#34d399') +
              cell('Articular Socket', 'Glenoid Cavity (Shoulder Ball & Socket)', '#ef4444');

      vHtml = '<strong>Anatomy of the Pectoral (Shoulder) Girdle:</strong> The pectoral girdle anchors the upper limbs to the axial skeleton and comprises <strong>4 bones</strong> (two halves, each with 1 clavicle and 1 scapula). The <em>clavicle</em> (collar bone) is a long, slender S-shaped bone with two curvatures that articulates medially with the manubrium sterni and laterally with the acromion. The <em>scapula</em> is a large triangular flat bone situated dorsally on the thorax between the 2nd and 7th ribs. Its dorsal surface features an oblique ridge called the <em>spine</em>, which expands laterally as the <strong>acromion</strong>. Immediately below the acromion lies the shallow cup-like <strong>glenoid cavity</strong>, which receives the hemispherical head of the humerus to form the highly mobile ball-and-socket shoulder joint.';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">PELVIC GIRDLE (2 COXAL BONES): ILIUM, ISCHIUM, PUBIS &amp; ACETABULUM</text>';

      // Left: Coxal Bone Fusion Graphic
      svg += '<g transform="translate(60, 60)">';
      svg += '<rect x="0" y="0" width="340" height="295" fill="#1e293b" rx="8" stroke="#ec4899" stroke-width="2"/>';
      svg += '<text x="170" y="26" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">Coxal (Hip) Bone Architecture</text>';

      // Ilium (flaring wing, pink)
      svg += '<path d="M 60 70 C 100 40, 240 40, 280 70 C 290 120, 240 140, 180 150 C 120 140, 60 120, 60 70 Z" fill="#701a75" stroke="#f472b6" stroke-width="2"/>';
      svg += '<text x="170" y="85" fill="#fbcfe8" font-size="12" font-weight="bold" text-anchor="middle">ILIUM (Superior Wing)</text>';

      // Ischium (posterior sitting bone, blue)
      svg += '<path d="M 120 180 C 100 240, 150 260, 180 250 L 180 210 Z" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/>';
      svg += '<text x="110" y="245" fill="#93c5fd" font-size="11" font-weight="bold">ISCHIUM</text>';

      // Pubis (anterior, amber)
      svg += '<path d="M 220 180 C 240 240, 190 260, 180 250 L 180 210 Z" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<text x="235" y="245" fill="#fde68a" font-size="11" font-weight="bold">PUBIS</text>';

      // Acetabulum (deep circle at junction)
      svg += '<circle cx="175" cy="165" r="22" fill="#ef4444" stroke="#fff" stroke-width="3"/>';
      svg += '<text x="175" y="170" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">Acetabulum</text>';

      // Pubic Symphysis pad
      svg += '<rect x="165" y="260" width="20" height="25" fill="#10b981" rx="4"/>';
      svg += '<text x="175" y="295" fill="#6ee7b7" font-size="10" font-weight="bold" text-anchor="middle">Pubic Symphysis (Fibrocartilage)</text>';
      svg += '</g>';

      // Right: Structural Breakdown
      svg += '<g transform="translate(430, 60)">';
      svg += '<rect x="0" y="0" width="300" height="295" fill="#1e293b" rx="8" stroke="#fbbf24"/>';
      svg += '<text x="20" y="28" fill="#fbbf24" font-size="13" font-weight="bold">Pelvic Girdle Specifications:</text>';
      svg += '<text x="20" y="52" fill="#f8fafc" font-size="11">• Total Bones: 2 Coxal (Hip) Bones</text>';
      svg += '<text x="20" y="74" fill="#f8fafc" font-size="11">• Each coxal bone formed by fusion of 3 units:</text>';
      svg += '<text x="35" y="94" fill="#f472b6" font-size="11">1. <strong>Ilium:</strong> Upper broad flaring blade</text>';
      svg += '<text x="35" y="114" fill="#38bdf8" font-size="11">2. <strong>Ischium:</strong> Lower, posterior sitting bone</text>';
      svg += '<text x="35" y="134" fill="#fbbf24" font-size="11">3. <strong>Pubis:</strong> Lower, anterior medial bone</text>';

      svg += '<line x1="20" y1="148" x2="280" y2="148" stroke="#334155"/>';
      svg += '<text x="20" y="170" fill="#ef4444" font-size="12" font-weight="bold">The Acetabulum Socket:</text>';
      svg += '<text x="20" y="190" fill="#f8fafc" font-size="10">• Deep cup-shaped cavity at confluence of all 3 bones</text>';
      svg += '<text x="20" y="208" fill="#f8fafc" font-size="10">• Receives the spherical head of the Femur</text>';
      svg += '<text x="20" y="226" fill="#f8fafc" font-size="10">• Provides immense stability for weight-bearing</text>';

      svg += '<line x1="20" y1="240" x2="280" y2="240" stroke="#334155"/>';
      svg += '<text x="20" y="260" fill="#10b981" font-size="12" font-weight="bold">Ventral Pubic Symphysis:</text>';
      svg += '<text x="20" y="280" fill="#f8fafc" font-size="10">• The two pubic bones meet ventrally via a fibrocartilage pad (loosens under relaxin during birth)</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Pelvic Girdle Count', '2 Coxal (Hip) Bones', '#ec4899') +
              cell('Coxal Triad Fusion', 'Ilium + Ischium + Pubis', '#fbbf24') +
              cell('Hip Joint Socket', 'Acetabulum (Receives Femur Head)', '#ef4444') +
              cell('Ventral Articulation', 'Pubic Symphysis (Fibrocartilage Joint)', '#10b981');

      vHtml = '<strong>Anatomy of the Pelvic (Hip) Girdle:</strong> The pelvic girdle connects the lower limbs to the sacrum and is built of <strong>two coxal bones</strong>. Each coxal bone is formed by the embryonic fusion of three bones: the superior flaring <strong>ilium</strong>, the inferior/posterior <strong>ischium</strong>, and the anterior <strong>pubis</strong>. At the junction of these three bones on the lateral surface lies a deep, cup-shaped cavity termed the <strong>acetabulum</strong>, into which the spherical head of the femur articulates. Ventrally, the two pubic bones unite along the midline at the <strong>pubic symphysis</strong>, a cartilaginous joint containing a resilient pad of fibrocartilage that softens during childbirth.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Joints & Musculoskeletal Pathology (jointsanddisorderssim)
// -------------------------------------------------------------------------
window.SIMS.jointsanddisorderssim = (function(){
  var view = "synovial_joints"; // "synovial_joints", "joint_types", "pathology"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Fibrous (Immovable Sutures: Skull)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Cartilaginous (Slightly Movable: Vertebrae, Pubic Symphysis)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#34d399;"></span><span>Synovial (Freely Movable: Cavity + Fluid)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Musculoskeletal Pathology (Myasthenia, Tetany, Gout)</span></div>';
    }

    var presets = document.getElementById("lab-presets");
    if (presets) {
      presets.innerHTML =
        '<button class="preset-btn" onclick="SIMS.jointsanddisorderssim.setView(\'synovial_joints\')">1. Synovial Joint Micro-Anatomy: Capsule &amp; Fluid</button>' +
        '<button class="preset-btn" onclick="SIMS.jointsanddisorderssim.setView(\'joint_types\')">2. Five Major Classes of Synovial Joints</button>' +
        '<button class="preset-btn" onclick="SIMS.jointsanddisorderssim.setView(\'pathology\')">3. Musculoskeletal Disorders (Myasthenia, Tetany, Osteoporosis, Gout)</button>';
    }
    render(0);
  }

  function setView(v){
    view = v;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (view === "synovial_joints") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">SYNOVIAL JOINT MICRO-ANATOMY: ARTICULAR CARTILAGE &amp; SYNOVIAL FLUID</text>';

      // Diagram of Synovial Joint
      svg += '<g transform="translate(60, 60)">';
      // Upper Bone
      svg += '<path d="M 100 20 L 100 100 C 100 130, 200 130, 200 100 L 200 20 Z" fill="#334155" stroke="#94a3b8" stroke-width="2"/>';
      svg += '<text x="150" y="60" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Bone 1 (Proximal)</text>';

      // Hyaline Articular Cartilage (Upper)
      svg += '<path d="M 100 100 C 100 130, 200 130, 200 100 L 200 115 C 200 145, 100 145, 100 115 Z" fill="#38bdf8" opacity="0.9"/>';
      svg += '<text x="25" y="125" fill="#38bdf8" font-size="10" font-weight="bold">Articular Cartilage (Hyaline)</text>';
      svg += '<line x1="85" y1="120" x2="105" y2="120" stroke="#38bdf8" stroke-width="2"/>';

      // Lower Bone
      svg += '<path d="M 100 240 L 100 160 C 100 130, 200 130, 200 160 L 200 240 Z" fill="#334155" stroke="#94a3b8" stroke-width="2"/>';
      svg += '<text x="150" y="210" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Bone 2 (Distal)</text>';

      // Hyaline Articular Cartilage (Lower)
      svg += '<path d="M 100 160 C 100 130, 200 130, 200 160 L 200 145 C 200 115, 100 115, 100 145 Z" fill="#38bdf8" opacity="0.9"/>';

      // Synovial Cavity & Fluid
      svg += '<ellipse cx="150" cy="130" rx="40" ry="12" fill="#34d399" opacity="0.6"/>';
      svg += '<text x="235" y="134" fill="#34d399" font-size="10" font-weight="bold">Synovial Cavity (Fluid)</text>';
      svg += '<line x1="195" y1="130" x2="225" y2="130" stroke="#34d399" stroke-width="2"/>';

      // Fibrous Articular Capsule
      svg += '<path d="M 95 80 C 70 130, 70 140, 95 180" fill="none" stroke="#ef4444" stroke-width="5"/>';
      svg += '<path d="M 205 80 C 230 130, 230 140, 205 180" fill="none" stroke="#ef4444" stroke-width="5"/>';
      svg += '<text x="150" y="265" fill="#f87171" font-size="10" font-weight="bold" text-anchor="middle">Fibrous Capsule &amp; Synovial Membrane</text>';
      svg += '</g>';

      // Right: Structural Classification Table
      svg += '<g transform="translate(390, 60)">';
      svg += '<rect x="0" y="0" width="340" height="295" fill="#1e293b" rx="8" stroke="#38bdf8"/>';
      svg += '<text x="20" y="26" fill="#38bdf8" font-size="13" font-weight="bold">Three Structural Classes of Joints:</text>';

      // Class 1: Fibrous
      svg += '<rect x="15" y="42" width="310" height="65" fill="#0f172a" rx="6" stroke="#64748b"/>';
      svg += '<text x="25" y="62" fill="#94a3b8" font-size="11" font-weight="bold">1. Fibrous Joints (Synarthroses):</text>';
      svg += '<text x="25" y="80" fill="#f8fafc" font-size="10">• ZERO movement permitted (Immovable)</text>';
      svg += '<text x="25" y="96" fill="#f8fafc" font-size="10">• Bones fused end-to-end via dense fibrous sutures (Cranial bones)</text>';

      // Class 2: Cartilaginous
      svg += '<rect x="15" y="117" width="310" height="65" fill="#0f172a" rx="6" stroke="#fbbf24"/>';
      svg += '<text x="25" y="137" fill="#fbbf24" font-size="11" font-weight="bold">2. Cartilaginous Joints (Amphiarthroses):</text>';
      svg += '<text x="25" y="155" fill="#f8fafc" font-size="10">• SLIGHT movement permitted</text>';
      svg += '<text x="25" y="171" fill="#f8fafc" font-size="10">• Fibrocartilage pads (Intervertebral discs, Pubic Symphysis)</text>';

      // Class 3: Synovial
      svg += '<rect x="15" y="192" width="310" height="85" fill="#0f172a" rx="6" stroke="#34d399"/>';
      svg += '<text x="25" y="212" fill="#34d399" font-size="11" font-weight="bold">3. Synovial Joints (Diarthroses):</text>';
      svg += '<text x="25" y="230" fill="#f8fafc" font-size="10">• CONSIDERABLE free movement permitted</text>';
      svg += '<text x="25" y="246" fill="#f8fafc" font-size="10">• Articular cartilage covers bone ends, reducing friction</text>';
      svg += '<text x="25" y="262" fill="#f8fafc" font-size="10">• Synovial fluid acts as hydraulic shock absorber &amp; lubricant</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Fibrous Movement', 'Zero Movement (Sutures of Cranium)', '#94a3b8') +
              cell('Cartilaginous Movement', 'Slight Movement (Intervertebral Discs)', '#fbbf24') +
              cell('Synovial Movement', 'Considerable Free Movement', '#34d399') +
              cell('Lubricant Fluid', 'Hyaluronic Acid Synovial Fluid', '#38bdf8');

      vHtml = '<strong>Classification of Joints:</strong> Joints are points of contact between bones or between bone and cartilage. Structurally, they are classified into three types: (1) <strong>Fibrous joints (synarthroses)</strong> allow no movement; bones are fused tightly with dense fibrous connective tissue, as seen in flat skull sutures; (2) <strong>Cartilaginous joints (amphiarthroses)</strong> permit slight movement where bones are joined by cartilage, such as intervertebral discs between adjacent vertebrae and the pubic symphysis; (3) <strong>Synovial joints (diarthroses)</strong> allow extensive free movement and are characterized by a fluid-filled <em>synovial cavity</em> between articular cartilage-covered ends of bones, playing a primary role in animal locomotion.';
    } else if (view === "joint_types") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">THE FIVE MAJOR CLASSES OF SYNOVIAL JOINTS IN THE HUMAN SKELETON</text>';

      // 5 Synovial Joint Rows
      var joints = [
        { type: "1. Ball and Socket Joint", move: "Multiaxial (360°)", examples: "Shoulder (Humerus in Glenoid) & Hip (Femur in Acetabulum)", color: "#ef4444", y: 60 },
        { type: "2. Hinge Joint", move: "Uniaxial Angular", examples: "Knee joint, Elbow joint, Interphalangeal joints of fingers/toes", color: "#fbbf24", y: 115 },
        { type: "3. Pivot Joint", move: "Uniaxial Rotational", examples: "Atlanto-axial joint between Atlas and Axis (head turning 'no')", color: "#34d399", y: 170 },
        { type: "4. Gliding Joint", move: "Non-axial Planar", examples: "Between carpal bones of wrist & between tarsal bones of ankle", color: "#38bdf8", y: 225 },
        { type: "5. Saddle Joint", move: "Biaxial Reciprocal", examples: "Between carpal (trapezium) and metacarpal of the human thumb", color: "#ec4899", y: 280 }
      ];

      for (var j = 0; j < joints.length; j++) {
        var jt = joints[j];
        svg += '<g transform="translate(30, ' + jt.y + ')">';
        svg += '<rect x="0" y="0" width="700" height="48" fill="#1e293b" rx="6" stroke="' + jt.color + '" stroke-width="2"/>';
        svg += '<text x="20" y="28" fill="' + jt.color + '" font-size="12" font-weight="bold">' + jt.type + '</text>';
        svg += '<text x="230" y="28" fill="#fff" font-size="11">[' + jt.move + ']</text>';
        svg += '<text x="360" y="28" fill="#cbd5e1" font-size="11">' + jt.examples + '</text>';
        svg += '</g>';
      }

      svg += '<text x="50" y="355" fill="#94a3b8" font-size="11">Synovial joints are encapsulated by fibrous articular capsules and lubricated by viscous synovial fluid.</text>';
      svg += '</svg>';

      rHtml = cell('Ball and Socket', 'Shoulder &amp; Hip Joints', '#ef4444') +
              cell('Hinge Joint', 'Knee, Elbow, Interphalangeal', '#fbbf24') +
              cell('Pivot Joint', 'Atlas - Axis (Atlanto-Axial)', '#34d399') +
              cell('Saddle Joint', 'Carpal &amp; Metacarpal of Thumb', '#ec4899');

      vHtml = '<strong>The Five Major Synovial Joint Categories:</strong> (1) <strong>Ball and socket joint</strong>: Multiaxial ball fitting in cup, enabling maximum angular range (humerus in glenoid cavity, femur in acetabulum); (2) <strong>Hinge joint</strong>: Uniaxial angular movement in a single plane like a door hinge (knee, elbow, interphalangeal joints); (3) <strong>Pivot joint</strong>: Uniaxial rotation of one bone around the process of another (between atlas and odontoid process of axis); (4) <strong>Gliding joint</strong>: Flat surfaces sliding over each other with minimal friction (intercarpal and intertarsal joints); (5) <strong>Saddle joint</strong>: Biaxial joint with interlocking concave-convex surfaces providing the thumb its unique opposability (between carpal and metacarpal of thumb).';
    } else {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">CLINICAL PATHOLOGY: DISORDERS OF THE MUSCULAR AND SKELETAL SYSTEMS</text>';

      // Grid of 6 disorders
      // Disorder 1: Myasthenia Gravis
      svg += '<g transform="translate(30, 60)">';
      svg += '<rect x="0" y="0" width="220" height="135" fill="#1e293b" rx="6" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="15" y="24" fill="#f87171" font-size="12" font-weight="bold">1. Myasthenia Gravis</text>';
      svg += '<text x="15" y="46" fill="#fca5a5" font-size="10" font-weight="bold">Autoimmune Disease</text>';
      svg += '<text x="15" y="66" fill="#f8fafc" font-size="10">• Antibodies attack ACh receptors</text>';
      svg += '<text x="15" y="82" fill="#f8fafc" font-size="10">• Affects neuromuscular junction</text>';
      svg += '<text x="15" y="100" fill="#f8fafc" font-size="10">• Fatigue, muscle weakness, ptosis</text>';
      svg += '<text x="15" y="118" fill="#ef4444" font-size="10">Leads to progressive paralysis</text>';
      svg += '</g>';

      // Disorder 2: Muscular Dystrophy
      svg += '<g transform="translate(270, 60)">';
      svg += '<rect x="0" y="0" width="220" height="135" fill="#1e293b" rx="6" stroke="#fbbf24" stroke-width="2"/>';
      svg += '<text x="15" y="24" fill="#fbbf24" font-size="12" font-weight="bold">2. Muscular Dystrophy</text>';
      svg += '<text x="15" y="46" fill="#fde68a" font-size="10" font-weight="bold">Genetic X-Linked Disorder</text>';
      svg += '<text x="15" y="66" fill="#f8fafc" font-size="10">• Mutation in Dystrophin gene</text>';
      svg += '<text x="15" y="82" fill="#f8fafc" font-size="10">• Progressive muscle wasting</text>';
      svg += '<text x="15" y="100" fill="#f8fafc" font-size="10">• Necrosis of skeletal muscle fibers</text>';
      svg += '<text x="15" y="118" fill="#fbbf24" font-size="10">Primarily inherited in young males</text>';
      svg += '</g>';

      // Disorder 3: Tetany
      svg += '<g transform="translate(510, 60)">';
      svg += '<rect x="0" y="0" width="220" height="135" fill="#1e293b" rx="6" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="15" y="24" fill="#38bdf8" font-size="12" font-weight="bold">3. Tetany</text>';
      svg += '<text x="15" y="46" fill="#93c5fd" font-size="10" font-weight="bold">Hypocalcemic Spasms</text>';
      svg += '<text x="15" y="66" fill="#f8fafc" font-size="10">• Rapid wild spasms in muscles</text>';
      svg += '<text x="15" y="82" fill="#f8fafc" font-size="10">• Due to low Ca2+ in body fluids</text>';
      svg += '<text x="15" y="100" fill="#f8fafc" font-size="10">• Hypoparathyroidism trigger</text>';
      svg += '<text x="15" y="118" fill="#38bdf8" font-size="10">Neuronal membrane hyperexcitability</text>';
      svg += '</g>';

      // Disorder 4: Arthritis
      svg += '<g transform="translate(30, 210)">';
      svg += '<rect x="0" y="0" width="220" height="135" fill="#1e293b" rx="6" stroke="#34d399" stroke-width="2"/>';
      svg += '<text x="15" y="24" fill="#34d399" font-size="12" font-weight="bold">4. Arthritis</text>';
      svg += '<text x="15" y="46" fill="#a7f3d0" font-size="10" font-weight="bold">Joint Inflammation</text>';
      svg += '<text x="15" y="66" fill="#f8fafc" font-size="10">• Osteoarthritis: Cartilage wear</text>';
      svg += '<text x="15" y="82" fill="#f8fafc" font-size="10">• Rheumatoid: Autoimmune pannus</text>';
      svg += '<text x="15" y="100" fill="#f8fafc" font-size="10">• Painful swelling &amp; stiffness</text>';
      svg += '<text x="15" y="118" fill="#34d399" font-size="10">Severely restricts joint motility</text>';
      svg += '</g>';

      // Disorder 5: Osteoporosis
      svg += '<g transform="translate(270, 210)">';
      svg += '<rect x="0" y="0" width="220" height="135" fill="#1e293b" rx="6" stroke="#ec4899" stroke-width="2"/>';
      svg += '<text x="15" y="24" fill="#f472b6" font-size="12" font-weight="bold">5. Osteoporosis</text>';
      svg += '<text x="15" y="46" fill="#fbcfe8" font-size="10" font-weight="bold">Age-Related Bone Loss</text>';
      svg += '<text x="15" y="66" fill="#f8fafc" font-size="10">• Decreased bone mineral density</text>';
      svg += '<text x="15" y="82" fill="#f8fafc" font-size="10">• Increased fracture risk (hip, spine)</text>';
      svg += '<text x="15" y="100" fill="#f8fafc" font-size="10">• Common cause: Estrogen drop</text>';
      svg += '<text x="15" y="118" fill="#ec4899" font-size="10">High incidence in post-menopausal women</text>';
      svg += '</g>';

      // Disorder 6: Gout
      svg += '<g transform="translate(510, 210)">';
      svg += '<rect x="0" y="0" width="220" height="135" fill="#1e293b" rx="6" stroke="#f59e0b" stroke-width="2"/>';
      svg += '<text x="15" y="24" fill="#fbbf24" font-size="12" font-weight="bold">6. Gout</text>';
      svg += '<text x="15" y="46" fill="#fef08a" font-size="10" font-weight="bold">Uric Acid Arthropathy</text>';
      svg += '<text x="15" y="66" fill="#f8fafc" font-size="10">• Inflammation of synovial joints</text>';
      svg += '<text x="15" y="82" fill="#f8fafc" font-size="10">• Deposition of uric acid crystals</text>';
      svg += '<text x="15" y="100" fill="#f8fafc" font-size="10">• Hyperuricemia metabolic defect</text>';
      svg += '<text x="15" y="118" fill="#fbbf24" font-size="10">Classic severe pain in big toe</text>';
      svg += '</g>';
      svg += '</svg>';

      rHtml = cell('Myasthenia Gravis', 'Autoimmune Attack on ACh Receptors at NMJ', '#ef4444') +
              cell('Tetany Trigger', 'Hypocalcemia (Low Ca2+ in Body Fluid)', '#38bdf8') +
              cell('Osteoporosis Etiology', 'Decreased Estrogen in Postmenopausal Women', '#ec4899') +
              cell('Gout Etiology', 'Deposition of Uric Acid Crystals in Joints', '#fbbf24');

      vHtml = '<strong>Pathologies of the Musculoskeletal System:</strong> (1) <strong>Myasthenia Gravis</strong>: An autoimmune disorder affecting neuromuscular junctions, where autoantibodies destroy nicotinic ACh receptors, causing fatigue, weakening, and paralysis of skeletal muscle; (2) <strong>Muscular Dystrophy</strong>: A genetic (predominantly X-linked) degenerative disease characterized by progressive wasting of skeletal muscles; (3) <strong>Tetany</strong>: Wild, rapid spasms of muscle caused by <em>low $Ca^{2+}$ in body fluids</em> (hypocalcemia), which elevates neuronal membrane excitability; (4) <strong>Arthritis</strong>: Inflammation of joints presenting as stiffness and swelling; (5) <strong>Osteoporosis</strong>: An age-related systemic loss of bone mineral density predisposing to fractures, commonly precipitated by post-menopausal <em>estrogen deficiency</em>; (6) <strong>Gout</strong>: Acute inflammatory arthropathy caused by accumulation and crystallization of <em>uric acid crystals</em> in synovial joints.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setView: setView
  };
})();
