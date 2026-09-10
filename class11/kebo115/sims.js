// kebo115 interactive simulations: Body Fluids and Circulation
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
// 1. SIMULATION 1: Hematology Centrifuge & Smear (hematologycentrifugesim)
// -------------------------------------------------------------------------
window.SIMS.hematologycentrifugesim = (function(){
  var view = "centrifuge"; // "centrifuge", "wbc_differential", "erythrocyte"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Plasma (55%: Water 92%, Proteins 8%)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f8fafc;"></span><span>Buffy Coat (<1%: Leucocytes & Platelets)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Packed Erythrocytes (45%: 5-5.5 Million/mm³)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Albumin Oncotic Regulation</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.hematologycentrifugesim.setView(\'centrifuge\')">1. Blood Centrifuge & Fractions</button>' +
      '<button class="preset-btn" onclick="SIMS.hematologycentrifugesim.setView(\'wbc_differential\')">2. WBC Differential Morphology</button>' +
      '<button class="preset-btn" onclick="SIMS.hematologycentrifugesim.setView(\'erythrocyte\')">3. Biconcave RBC Hemoglobin Lab</button>';
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

    if (view === "centrifuge") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">WHOLE BLOOD CENTRIFUGATION: PLASMA (55%) & FORMED ELEMENTS (45%)</text>';

      // Centrifuge Tube Outline
      svg += '<path d="M 140 60 L 140 280 C 140 330, 220 330, 220 280 L 220 60" fill="none" stroke="#64748b" stroke-width="4"/>';

      // 1. Plasma (55% = y: 70 to 195 = 125 px)
      svg += '<rect x="142" y="70" width="76" height="125" fill="#fbbf24" opacity="0.8"/>';
      svg += '<text x="180" y="130" fill="#78350f" font-size="12" font-weight="bold" text-anchor="middle">Plasma (55%)</text>';

      // 2. Buffy Coat (<1% = y: 195 to 200 = 5 px)
      svg += '<rect x="142" y="195" width="76" height="6" fill="#f8fafc" opacity="0.95"/>';
      svg += '<text x="235" y="200" fill="#f8fafc" font-size="10" font-weight="bold">Buffy Coat (<1%: WBCs & Platelets)</text>';

      // 3. Packed RBCs (45% = y: 201 to 310 = 109 px)
      svg += '<path d="M 142 201 L 218 201 L 218 280 C 218 325, 142 325, 142 280 Z" fill="#dc2626" opacity="0.9"/>';
      svg += '<text x="180" y="250" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">RBCs (45%)</text>';

      // Data Panels on Right
      svg += '<g transform="translate(320, 70)">';
      // Plasma Panel
      svg += '<rect x="0" y="0" width="380" height="95" fill="#1e293b" rx="6" stroke="#fbbf24"/>';
      svg += '<text x="15" y="24" fill="#fbbf24" font-size="13" font-weight="bold">1. Plasma Components (55% of Blood Volume):</text>';
      svg += '<text x="15" y="46" fill="#f8fafc" font-size="11">• Water: 90 - 92% (universal liquid medium)</text>';
      svg += '<text x="15" y="66" fill="#f8fafc" font-size="11">• Proteins (6-8%): Fibrinogen (clotting), Globulins (immunity), Albumin (osmotic)</text>';
      svg += '<text x="15" y="86" fill="#94a3b8" font-size="10">• Serum = Plasma minus clotting factors (fibrinogen)</text>';

      // Formed Elements Panel
      svg += '<rect x="0" y="110" width="380" height="135" fill="#1e293b" rx="6" stroke="#ef4444"/>';
      svg += '<text x="15" y="134" fill="#f87171" font-size="13" font-weight="bold">2. Formed Elements (45% of Blood Volume):</text>';
      svg += '<text x="15" y="156" fill="#f8fafc" font-size="11">• Erythrocytes (RBCs): 5.0 - 5.5 Million/mm³ (Gas transport, 120-day life)</text>';
      svg += '<text x="15" y="176" fill="#f8fafc" font-size="11">• Leucocytes (WBCs): 6000 - 8000/mm³ (Defensive immunity)</text>';
      svg += '<text x="15" y="196" fill="#f8fafc" font-size="11">• Platelets (Thrombocytes): 1.5 - 3.5 Lakh/mm³ (Hemostasis / Clotting)</text>';
      svg += '<text x="15" y="222" fill="#a7f3d0" font-size="10">Produced in bone marrow; megakaryocyte-derived platelets</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Plasma Fraction', '55% of Blood Volume', '#fbbf24') +
              cell('Plasma Water / Protein', '90-92% Water / 6-8% Proteins', '#38bdf8') +
              cell('Formed Elements', '45% (Hematocrit)', '#ef4444') +
              cell('RBC Lifespan', '120 Days (Spleen Graveyard)', '#10b981');

      vHtml = '<strong>Hematological Composition:</strong> Whole blood separates into a straw-colored liquid supernatant called <em>plasma</em> (55%) and cellular <em>formed elements</em> (45%). Plasma proteins include fibrinogen (clotting), globulins (immunoglobulins for defense), and albumins (maintaining 25 mmHg oncotic pressure). Formed elements comprise erythrocytes (gas transport), leucocytes (immunity), and megakaryocyte-derived platelets (hemostasis).';
    }
    else if (view === "wbc_differential") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">LEUCOCYTE DIFFERENTIAL MORPHOLOGY & IMMUNOLOGICAL ROLES</text>';

      var wbcs = [
        {name: "Neutrophil", pct: "60-65%", role: "Phagocytic defense", nuc: "3-5 Lobes", col: "#38bdf8", x: 60},
        {name: "Eosinophil", pct: "2-3%", role: "Allergy & parasites", nuc: "Bilobed", col: "#f43f5e", x: 195},
        {name: "Basophil", pct: "0.5-1%", role: "Histamine & heparin", nuc: "S-shaped", col: "#a855f7", x: 330},
        {name: "Monocyte", pct: "6-8%", role: "Tissue macrophage", nuc: "Kidney bean", col: "#fbbf24", x: 465},
        {name: "Lymphocyte", pct: "20-25%", role: "B & T cells (Antibodies)", nuc: "Spherical", col: "#10b981", x: 600}
      ];

      for (var w = 0; w < wbcs.length; w++) {
        var it = wbcs[w];
        svg += '<g transform="translate(' + it.x + ', 70)">';
        svg += '<rect x="0" y="0" width="120" height="250" fill="#1e293b" rx="6" stroke="' + it.col + '"/>';
        svg += '<text x="60" y="24" fill="' + it.col + '" font-size="12" font-weight="bold" text-anchor="middle">' + it.name + '</text>';
        svg += '<text x="60" y="42" fill="#94a3b8" font-size="10" text-anchor="middle">' + it.pct + '</text>';

        // Cell drawing
        svg += '<circle cx="60" cy="95" r="38" fill="#334155" stroke="' + it.col + '" stroke-width="2"/>';
        if (it.name === "Neutrophil") {
          svg += '<circle cx="50" cy="85" r="10" fill="' + it.col + '"/>';
          svg += '<circle cx="70" cy="85" r="11" fill="' + it.col + '"/>';
          svg += '<circle cx="60" cy="105" r="9" fill="' + it.col + '"/>';
        } else if (it.name === "Eosinophil") {
          svg += '<circle cx="48" cy="95" r="13" fill="' + it.col + '"/>';
          svg += '<circle cx="72" cy="95" r="13" fill="' + it.col + '"/>';
          svg += '<line x1="48" y1="95" x2="72" y2="95" stroke="' + it.col + '" stroke-width="3"/>';
        } else if (it.name === "Basophil") {
          svg += '<path d="M 45 80 Q 75 95 45 110" stroke="' + it.col + '" stroke-width="12" fill="none"/>';
        } else if (it.name === "Monocyte") {
          svg += '<path d="M 45 80 C 70 70, 75 115, 45 110 C 60 100, 60 90, 45 80 Z" fill="' + it.col + '"/>';
        } else if (it.name === "Lymphocyte") {
          svg += '<circle cx="60" cy="95" r="28" fill="' + it.col + '"/>';
        }

        svg += '<text x="60" y="160" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">Nucleus:</text>';
        svg += '<text x="60" y="176" fill="#cbd5e1" font-size="9" text-anchor="middle">' + it.nuc + '</text>';
        svg += '<text x="60" y="205" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">Function:</text>';
        svg += '<text x="60" y="222" fill="#94a3b8" font-size="9" text-anchor="middle">' + it.role + '</text>';
        svg += '</g>';
      }

      svg += '</svg>';

      rHtml = cell('Neutrophils', '60-65% (Most abundant phagocytes)', '#38bdf8') +
              cell('Lymphocytes', '20-25% (Immune B & T memory)', '#10b981') +
              cell('Monocytes', '6-8% (Transform to Macrophages)', '#fbbf24') +
              cell('Basophils', '0.5-1% (Histamine & Heparin release)', '#a855f7');

      vHtml = '<strong>Leucocyte Classification:</strong> WBCs are divided into <em>Granulocytes</em> (neutrophils, eosinophils, basophils) and <em>Agranulocytes</em> (lymphocytes, monocytes). Neutrophils and monocytes are voracious phagocytes destroying foreign microbes. Basophils secrete inflammatory mediators. Eosinophils combat parasitic worms and modulate allergic responses. Lymphocytes are the master regulators of humoral and cellular adaptive immunity.';
    }
    else if (view === "erythrocyte") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">MAMMALIAN ERYTHROCYTE: BICONCAVE ENUCLEATED SPECIALIZATION</text>';

      // Biconcave RBC cross section
      svg += '<g transform="translate(180, 180)">';
      svg += '<path d="M -110 -20 C -90 -60, -30 -20, 0 -20 C 30 -20, 90 -60, 110 -20 C 125 0, 125 20, 110 40 C 90 80, 30 40, 0 40 C -30 40, -90 80, -110 40 C -125 20, -125 0, -110 -20 Z" fill="#dc2626" stroke="#fca5a5" stroke-width="3"/>';
      svg += '<text x="0" y="10" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">Biconcave Disc Profile</text>';
      svg += '<text x="0" y="90" fill="#fca5a5" font-size="11" text-anchor="middle">7.2 µm Diameter | High Surface-to-Volume Ratio</text>';
      svg += '</g>';

      // Biochemical specs
      svg += '<g transform="translate(420, 75)">';
      svg += '<rect x="0" y="0" width="300" height="230" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="15" y="28" fill="#ef4444" font-size="13" font-weight="bold">RBC Cytomorphology & Chemistry:</text>';
      svg += '<text x="15" y="55" fill="#f8fafc" font-size="11">• Count: 5.0 to 5.5 Million / mm³ in males</text>';
      svg += '<text x="15" y="80" fill="#f8fafc" font-size="11">• Enucleated: Lacks nucleus & mitochondria at maturity</text>';
      svg += '<text x="15" y="105" fill="#f8fafc" font-size="11">• Maximizes internal space for Hemoglobin packaging</text>';
      svg += '<text x="15" y="130" fill="#fbbf24" font-size="12" font-weight="bold">• Hemoglobin Content: 12 - 16 g per 100 mL blood</text>';
      svg += '<text x="15" y="155" fill="#f8fafc" font-size="11">• Average Lifespan: Exactly 120 Days</text>';
      svg += '<text x="15" y="180" fill="#10b981" font-size="11">• Spleen: Serves as the "Graveyard of RBCs"</text>';
      svg += '<text x="15" y="205" fill="#38bdf8" font-size="11">• Flexibility: Deforms through 4 µm capillary beds</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('RBC Count', '5.0 - 5.5 Million / mm³', '#ef4444') +
              cell('Hemoglobin (Hb)', '12 - 16 g / 100 mL blood', '#fbbf24') +
              cell('Enucleation Benefit', 'Maximizes Hb packaging volume', '#10b981') +
              cell('Organ of Destruction', 'Spleen (Graveyard of RBCs)', '#38bdf8');

      vHtml = '<strong>Erythrocyte Adaptations:</strong> Mature mammalian RBCs are biconcave, circular, and enucleated. Lacking a nucleus, Golgi, and mitochondria allows erythrocytes to pack ~280 million hemoglobin molecules per cell (12-16 g/100 mL blood) and prevents metabolic consumption of the oxygen being transported. Their biconcave shape optimizes gas diffusion distances and permits flexible squeeze through narrow capillaries.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setView: setView
  };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Blood Groups & Coagulation (bloodgroupcoagulationsim)
// -------------------------------------------------------------------------
window.SIMS.bloodgroupcoagulationsim = (function(){
  var mode = "abo_typing"; // "abo_typing", "erythroblastosis", "clotting_cascade"
  var testGroup = "A+"; // "A+", "B+", "AB+", "O-"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Agglutination Clumping (Antigen-Antibody)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Anti-Rh Maternal Immunoglobulins (IgG)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Thrombokinase & Thrombin Activation</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Insoluble Fibrin Clot Mesh</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.bloodgroupcoagulationsim.setMode(\'abo_typing\')">1. ABO & Rh Blood Typing Tile</button>' +
      '<button class="preset-btn" onclick="SIMS.bloodgroupcoagulationsim.setMode(\'erythroblastosis\')">2. Erythroblastosis Foetalis Lab</button>' +
      '<button class="preset-btn" onclick="SIMS.bloodgroupcoagulationsim.setMode(\'clotting_cascade\')">3. Thrombin Coagulation Cascade</button>';
  }

  function setMode(m){
    mode = m;
    App.state.t = 0;
    render(0);
  }

  function setBlood(b){
    testGroup = b;
    render(App.state.t);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (mode === "abo_typing") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">ABO & Rh AGGLUTINATION TYPING TILE (TEST SAMPLE: ' + testGroup + ')</text>';

      // Blood Selection Buttons in SVG
      var bTypes = ["A+", "B+", "AB+", "O-"];
      for (var bt = 0; bt < bTypes.length; bt++) {
        var bx = 60 + bt * 120;
        var isSel = (testGroup === bTypes[bt]);
        svg += '<rect x="' + bx + '" y="55" width="100" height="30" fill="' + (isSel ? '#0284c7' : '#1e293b') + '" rx="4" stroke="#38bdf8" cursor="pointer" onclick="SIMS.bloodgroupcoagulationsim.setBlood(\'' + bTypes[bt] + '\')"/>';
        svg += '<text x="' + (bx + 50) + '" y="75" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle" cursor="pointer" onclick="SIMS.bloodgroupcoagulationsim.setBlood(\'' + bTypes[bt] + '\')">' + bTypes[bt] + '</text>';
      }

      // Three Wells: Anti-A, Anti-B, Anti-D (Rh)
      var wells = [
        {name: "Anti-A Serum", aggl: (testGroup === "A+" || testGroup === "AB+"), col: "#38bdf8", x: 140},
        {name: "Anti-B Serum", aggl: (testGroup === "B+" || testGroup === "AB+"), col: "#fbbf24", x: 380},
        {name: "Anti-D (Rh) Serum", aggl: (testGroup.includes("+")), col: "#ef4444", x: 620}
      ];

      for (var w = 0; w < wells.length; w++) {
        var wl = wells[w];
        svg += '<g transform="translate(' + wl.x + ', 220)">';
        // Ceramic well circle
        svg += '<circle cx="0" cy="0" r="75" fill="#1e293b" stroke="' + wl.col + '" stroke-width="3"/>';
        svg += '<text x="0" y="-90" fill="' + wl.col + '" font-size="13" font-weight="bold" text-anchor="middle">' + wl.name + '</text>';

        if (wl.aggl) {
          // Agglutinated clumps (particles)
          for (var cl = 0; cl < 24; cl++) {
            var ang = cl * 2 * Math.PI / 24;
            var r = 15 + (cl % 4) * 14;
            svg += '<circle cx="' + (Math.cos(ang)*r) + '" cy="' + (Math.sin(ang)*r) + '" r="5" fill="#ef4444"/>';
          }
          svg += '<text x="0" y="4" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">AGGLUTINATION</text>';
          svg += '<text x="0" y="20" fill="#fca5a5" font-size="10" text-anchor="middle">(Clumping Positive)</text>';
        } else {
          // Smooth red suspension
          svg += '<circle cx="0" cy="0" r="50" fill="#dc2626" opacity="0.6"/>';
          svg += '<text x="0" y="4" fill="#fff" font-size="11" text-anchor="middle">Smooth Suspension</text>';
          svg += '<text x="0" y="20" fill="#d1fae5" font-size="10" text-anchor="middle">(No Agglutination)</text>';
        }
        svg += '</g>';
      }

      svg += '</svg>';

      var antigens = (testGroup === "A+" ? "A, Rh (D)" : (testGroup === "B+" ? "B, Rh (D)" : (testGroup === "AB+" ? "A, B, Rh (D)" : "None (Universal Donor)")));
      var antibodies = (testGroup === "A+" ? "Anti-B" : (testGroup === "B+" ? "Anti-A" : (testGroup === "AB+" ? "None (Universal Recipient)" : "Anti-A and Anti-B")));

      rHtml = cell('Selected Blood Group', testGroup, '#38bdf8') +
              cell('RBC Surface Antigens', antigens, '#10b981') +
              cell('Plasma Antibodies', antibodies, '#fbbf24') +
              cell('Transfusion Role', (testGroup === "O-" ? "Universal Donor" : (testGroup === "AB+" ? "Universal Recipient" : "Compatible Typing")), '#ef4444');

      vHtml = '<strong>ABO & Rh Agglutination Typing:</strong> Blood grouping relies on surface agglutinogens (antigens) on the RBC membrane. Adding specific antiserum initiates visible clumping (agglutination) if the corresponding antigen is present. Group AB possesses both antigens A and B with no plasma antibodies (Universal Recipient), whereas Group O lacks antigens A and B (Universal Donor). Presence of antigen D defines Rh-positive status.';
    }
    else if (mode === "erythroblastosis") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">ERYTHROBLASTOSIS FOETALIS: Rh- INCOMPATIBILITY & PROPHYLAXIS</text>';

      // 1st Pregnancy Panel (Left)
      svg += '<g transform="translate(80, 70)">';
      svg += '<rect x="0" y="0" width="280" height="250" fill="#1e293b" rx="6" stroke="#38bdf8"/>';
      svg += '<text x="140" y="25" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">FIRST PREGNANCY (Sensitization)</text>';
      svg += '<text x="15" y="60" fill="#f8fafc" font-size="11">• Mother: Rh-Negative (No D-antigen)</text>';
      svg += '<text x="15" y="85" fill="#f8fafc" font-size="11">• Fetus: Rh-Positive (Inherited from father)</text>';
      svg += '<text x="15" y="110" fill="#10b981" font-size="11">• Normal Gestation: Placenta separates blood</text>';
      svg += '<text x="15" y="135" fill="#fbbf24" font-size="11">• Delivery: Fetal Rh+ blood leaks into mother</text>';
      svg += '<text x="15" y="160" fill="#fca5a5" font-size="11">• Maternal B-cells sensitized -> Anti-Rh IgG</text>';
      svg += '<rect x="15" y="190" width="250" height="45" fill="#047857" rx="4"/>';
      svg += '<text x="140" y="217" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">First Child Born Normal & Healthy</text>';
      svg += '</g>';

      // 2nd Pregnancy Panel (Right)
      svg += '<g transform="translate(400, 70)">';
      svg += '<rect x="0" y="0" width="280" height="250" fill="#1e293b" rx="6" stroke="#ef4444"/>';
      svg += '<text x="140" y="25" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">SUBSEQUENT Rh+ PREGNANCIES</text>';
      svg += '<text x="15" y="60" fill="#f8fafc" font-size="11">• Mother carries circulating Anti-Rh IgG</text>';
      svg += '<text x="15" y="85" fill="#ef4444" font-size="11">• Maternal IgG crosses placenta into fetus</text>';
      svg += '<text x="15" y="110" fill="#fca5a5" font-size="11">• Rapid hemolysis of fetal Rh+ erythrocytes</text>';
      svg += '<text x="15" y="135" fill="#f8fafc" font-size="11">• Consequences: Severe Anemia & Fatal Jaundice</text>';
      svg += '<rect x="15" y="170" width="250" height="65" fill="#7f1d1d" rx="4"/>';
      svg += '<text x="140" y="195" fill="#fde047" font-size="11" font-weight="bold" text-anchor="middle">CLINICAL PROPHYLAXIS:</text>';
      svg += '<text x="140" y="215" fill="#fff" font-size="10" text-anchor="middle">Inject Anti-Rh antibodies to mother right after 1st birth</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Maternal Rh Status', 'Rh Negative (Rh-)', '#ef4444') +
              cell('Fetal Rh Status', 'Rh Positive (Rh+)', '#38bdf8') +
              cell('Pathology', 'Erythroblastosis Foetalis', '#f59e0b') +
              cell('Prophylaxis', 'Anti-Rh IgG (RhoGAM) Postpartum', '#10b981');

      vHtml = '<strong>Erythroblastosis Foetalis Pathogenesis:</strong> When an Rh- mother carries an Rh+ fetus, fetal blood is normally isolated until delivery, when fetal Rh+ RBCs enter maternal circulation, sensitizing her to synthesize anti-Rh antibodies. During subsequent Rh+ pregnancies, maternal IgG crosses the placenta and destroys fetal erythrocytes, causing severe hemolytic anemia and kernicterus jaundice. Injecting anti-Rh antibodies immediately following the first delivery prevents maternal sensitization.';
    }
    else if (mode === "clotting_cascade") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HEMOSTASIS & BLOOD COAGULATION CASCADE: THROMBOKINASE TO FIBRIN</text>';

      // Step 1: Vascular Injury & Thrombokinase
      svg += '<rect x="60" y="80" width="260" height="65" fill="#1e293b" rx="6" stroke="#ef4444"/>';
      svg += '<text x="190" y="105" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">1. Vascular / Tissue Trauma</text>';
      svg += '<text x="190" y="125" fill="#f8fafc" font-size="11" text-anchor="middle">Platelets aggregate & release Thromboplastin</text>';

      // Arrow down to Thrombokinase
      svg += '<line x1="190" y1="145" x2="190" y2="180" stroke="#fbbf24" stroke-width="3"/>';
      svg += '<text x="235" y="165" fill="#fbbf24" font-size="10">Forms Enzyme</text>';

      // Step 2: Prothrombin to Thrombin
      svg += '<rect x="60" y="180" width="260" height="75" fill="#1e293b" rx="6" stroke="#fbbf24"/>';
      svg += '<text x="190" y="205" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">2. Thrombokinase Enzyme Complex</text>';
      svg += '<text x="190" y="225" fill="#fff" font-size="11" text-anchor="middle">Prothrombin + Ca2+ -> Active Thrombin</text>';
      svg += '<text x="190" y="243" fill="#6ee7b7" font-size="10" text-anchor="middle">(Calcium ions indispensable here)</text>';

      // Arrow over to Fibrinogen
      svg += '<path d="M 320 215 L 430 215" stroke="#10b981" stroke-width="4" marker-end="url(#arrow)"/>';
      svg += '<text x="375" y="205" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Thrombin</text>';

      // Step 3: Fibrinogen to Fibrin Clot
      svg += '<rect x="440" y="150" width="260" height="130" fill="#1e293b" rx="6" stroke="#10b981"/>';
      svg += '<text x="570" y="175" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">3. Fibrin Polymerization</text>';
      svg += '<text x="570" y="200" fill="#f8fafc" font-size="11" text-anchor="middle">Soluble Fibrinogen -> Insoluble Fibrin</text>';
      svg += '<text x="570" y="225" fill="#bae6fd" font-size="11" text-anchor="middle">Traps RBCs, WBCs & Platelets</text>';
      svg += '<text x="570" y="255" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="middle">Stable Gel Clot (Coagulum)</text>';

      svg += '</svg>';

      rHtml = cell('Initial Trigger', 'Thromboplastin from platelets & tissue', '#ef4444') +
              cell('Key Enzyme', 'Thrombokinase complex', '#fbbf24') +
              cell('Essential Cofactor', 'Calcium Ions (Ca2+)', '#10b981') +
              cell('Final Clot Matrix', 'Insoluble Fibrin Meshwork', '#38bdf8');

      vHtml = '<strong>The Multi-Step Coagulation Cascade:</strong> Blood clotting prevents fatal exsanguination. Damaged tissues and ruptured platelets release thromboplastin, which initiates an enzymatic cascade producing <em>thrombokinase</em>. Thrombokinase, in the required presence of <em>calcium ions</em>, converts inactive plasma prothrombin into active <em>thrombin</em>. Thrombin then cleaves soluble fibrinogen into insoluble <em>fibrin</em> threads that interlink to trap formed elements, forming a stable coagulum.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setMode: setMode,
    setBlood: setBlood
  };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Lymphatic Drainage (lymphaticdrainagesim)
// -------------------------------------------------------------------------
window.SIMS.lymphaticdrainagesim = (function(){
  var mode = "capillary_filtration"; // "capillary_filtration", "lymph_vs_blood", "lacteals_fat"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Arterial Capillary Filtration (Pc > Oncotic)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Venous Reabsorption (Pc < Oncotic)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Blind-Ended Lymphatic Capillary</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Intestinal Lacteal Chylomicron Transport</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.lymphaticdrainagesim.setMode(\'capillary_filtration\')">1. Microvascular Starling Filtration</button>' +
      '<button class="preset-btn" onclick="SIMS.lymphaticdrainagesim.setMode(\'lymph_vs_blood\')">2. Lymph vs Blood Composition</button>' +
      '<button class="preset-btn" onclick="SIMS.lymphaticdrainagesim.setMode(\'lacteals_fat\')">3. Intestinal Lacteals & Fat Absorption</button>';
  }

  function setMode(m){
    mode = m;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (mode === "capillary_filtration") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">MICROVASCULAR FLUID EXCHANGE & LYMPHATIC DRAINAGE (STARLING FORCES)</text>';

      // Blood Capillary (horizontal tube across middle)
      svg += '<rect x="80" y="110" width="600" height="50" fill="#dc2626" opacity="0.3" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="90" y="140" fill="#fca5a5" font-size="11" font-weight="bold">Arterial End (Pc = 35 mmHg)</text>';
      svg += '<text x="670" y="140" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="end">Venous End (Pc = 15 mmHg)</text>';

      // Filtration arrows at arterial end
      svg += '<g stroke="#ef4444" stroke-width="2.5" fill="none">';
      svg += '<path d="M 180 160 L 180 210"/>';
      svg += '<path d="M 230 160 L 230 210"/>';
      svg += '</g>';
      svg += '<text x="205" y="190" fill="#ef4444" font-size="10" text-anchor="middle">Filtration (Fluid out)</text>';

      // Reabsorption arrows at venous end
      svg += '<g stroke="#38bdf8" stroke-width="2.5" fill="none">';
      svg += '<path d="M 520 210 L 520 160"/>';
      svg += '<path d="M 570 210 L 570 160"/>';
      svg += '</g>';
      svg += '<text x="545" y="190" fill="#38bdf8" font-size="10" text-anchor="middle">Reabsorption</text>';

      // Interstitial Fluid Space in between
      svg += '<text x="380" y="210" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Interstitial Tissue Fluid Space (Bathing cells)</text>';

      // Lymphatic Capillary (Green blind-ended vessel)
      svg += '<path d="M 300 280 C 300 250, 460 250, 460 280 L 460 330 L 300 330 Z" fill="#047857" opacity="0.6" stroke="#10b981" stroke-width="3"/>';
      svg += '<text x="380" y="295" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Blind-Ended Lymphatic Capillary</text>';
      svg += '<text x="380" y="315" fill="#a7f3d0" font-size="10" text-anchor="middle">Drains excess ~2-4 L/day of fluid back to veins</text>';

      svg += '</svg>';

      rHtml = cell('Arterial Capillary Pc', '35 mmHg (Favors Filtration)', '#ef4444') +
              cell('Plasma Oncotic Pressure', '25 mmHg (Favors Reabsorption)', '#fbbf24') +
              cell('Venous Capillary Pc', '15 mmHg (Reabsorption occurs)', '#38bdf8') +
              cell('Net Daily Lymph Drainage', '2 to 4 Litres returned to circulation', '#10b981');

      vHtml = '<strong>Microvascular Fluid Filtration & Lymph Dynamics:</strong> At the arterial end of a capillary, high hydrostatic pressure ($P_c = 35\,\text{mmHg}$) exceeds plasma colloid oncotic pressure ($\Pi = 25\,\text{mmHg}$), filtering fluid into interstitial spaces to form tissue fluid. At the venous end, hydrostatic pressure drops below oncotic pressure, reabsorbing ~90% of the fluid. The remaining unabsorbed fluid is captured by blind-ended lymphatic capillaries as <em>lymph</em> and returned to the venous circulation.';
    }
    else if (mode === "lymph_vs_blood") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">COMPARATIVE CYTOCHEMISTRY: BLOOD VS LYMPH</text>';

      // Left: Blood Tube
      svg += '<g transform="translate(140, 70)">';
      svg += '<rect x="0" y="0" width="200" height="250" fill="#1e293b" rx="6" stroke="#ef4444"/>';
      svg += '<text x="100" y="28" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">WHOLE BLOOD</text>';
      svg += '<text x="15" y="65" fill="#f8fafc" font-size="11">• Color: Opaque Crimson Red</text>';
      svg += '<text x="15" y="90" fill="#f8fafc" font-size="11">• Erythrocytes: 5 - 5.5 Million/mm³</text>';
      svg += '<text x="15" y="115" fill="#f8fafc" font-size="11">• Platelets: 1.5 - 3.5 Lakh/mm³</text>';
      svg += '<text x="15" y="140" fill="#f8fafc" font-size="11">• Proteins: High (6 - 8%)</text>';
      svg += '<text x="15" y="165" fill="#f8fafc" font-size="11">• Flow Rate: Rapid under high P</text>';
      svg += '<text x="15" y="205" fill="#ef4444" font-size="11" font-weight="bold">Delivers O2 & vital nutrients</text>';
      svg += '</g>';

      // Right: Lymph Tube
      svg += '<g transform="translate(420, 70)">';
      svg += '<rect x="0" y="0" width="200" height="250" fill="#1e293b" rx="6" stroke="#10b981"/>';
      svg += '<text x="100" y="28" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">LYMPH (TISSUE FLUID)</text>';
      svg += '<text x="15" y="65" fill="#6ee7b7" font-size="11">• Color: Clear, Colorless</text>';
      svg += '<text x="15" y="90" fill="#6ee7b7" font-size="11">• Erythrocytes: COMPLETELY ZERO</text>';
      svg += '<text x="15" y="115" fill="#6ee7b7" font-size="11">• Platelets: COMPLETELY ZERO</text>';
      svg += '<text x="15" y="140" fill="#6ee7b7" font-size="11">• Cells: Specialized Lymphocytes</text>';
      svg += '<text x="15" y="165" fill="#6ee7b7" font-size="11">• Proteins: Low (~2 - 3%)</text>';
      svg += '<text x="15" y="205" fill="#10b981" font-size="11" font-weight="bold">Transports fats & immunity</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Color', 'Blood: Red | Lymph: Colorless', '#ef4444') +
              cell('RBC & Platelets', 'Present in Blood | Absent in Lymph', '#10b981') +
              cell('Lymph Cellular Content', 'Specialized Lymphocytes only', '#38bdf8') +
              cell('Protein Content', 'Blood: 6-8% | Lymph: Low', '#fbbf24');

      vHtml = '<strong>Distinctions Between Blood and Lymph:</strong> Blood is red, contains red blood cells, platelets, and high protein concentrations (6-8%), flowing within a closed, high-pressure circulatory circuit. Lymph is colorless, lacks erythrocytes and platelets completely, possesses lower protein concentrations, and carries specialized lymphocytes that patrol through regional lymph nodes before entering the subclavian veins.';
    }
    else if (mode === "lacteals_fat") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">INTESTINAL VILLUS ANATOMY & CENTRAL LACTEAL LIPID TRANSPORT</text>';

      // Villus silhouette
      svg += '<g transform="translate(240, 70)">';
      svg += '<path d="M 0 250 L 0 80 C 0 20, 120 20, 120 80 L 120 250 Z" fill="#334155" stroke="#64748b" stroke-width="3"/>';
      svg += '<text x="60" y="15" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Intestinal Villus</text>';

      // Central Lacteal (Green)
      svg += '<rect x="45" y="60" width="30" height="190" fill="#10b981" opacity="0.8" rx="6"/>';
      svg += '<text x="60" y="130" fill="#fff" font-size="11" font-weight="bold" transform="rotate(-90 60 130)" text-anchor="middle">Central Lacteal</text>';

      // Capillary network flanking lacteal
      svg += '<path d="M 20 80 L 20 250" stroke="#ef4444" stroke-width="6"/>';
      svg += '<path d="M 100 80 L 100 250" stroke="#38bdf8" stroke-width="6"/>';
      svg += '</g>';

      // Fat Absorption Annotation on Right
      svg += '<g transform="translate(440, 80)">';
      svg += '<rect x="0" y="0" width="280" height="220" fill="#1e293b" rx="6" stroke="#fbbf24"/>';
      svg += '<text x="15" y="28" fill="#fbbf24" font-size="13" font-weight="bold">Dietary Lipid Absorption Highway:</text>';
      svg += '<text x="15" y="58" fill="#f8fafc" font-size="11">1. Digested fats resynthesized into Chylomicrons</text>';
      svg += '<text x="15" y="85" fill="#f8fafc" font-size="11">2. Chylomicrons too large to enter blood capillaries</text>';
      svg += '<text x="15" y="112" fill="#10b981" font-size="11" font-weight="bold">3. Enter large pores of Central Lacteals</text>';
      svg += '<text x="15" y="140" fill="#f8fafc" font-size="11">4. Flow as milky lymph (Chyle) via Thoracic Duct</text>';
      svg += '<text x="15" y="168" fill="#38bdf8" font-size="11">5. Empties into Left Subclavian Vein</text>';
      svg += '<text x="15" y="198" fill="#a7f3d0" font-size="10">Bypasses immediate hepatic portal processing</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Lacteal Location', 'Core of Intestinal Villi', '#10b981') +
              cell('Absorbed Nutrient', 'Dietary Lipids (Chylomicrons)', '#fbbf24') +
              cell('Lymph Fluid Form', 'Chyle (Milky white lymph)', '#f8fafc') +
              cell('Venous Drainage', 'Thoracic Duct to Subclavian Vein', '#38bdf8');

      vHtml = '<strong>Lacteals and Lipid Transport:</strong> Unlike glucose and amino acids which enter mesenteric blood capillaries directly, digested dietary fats are packaged by enterocytes into large lipoprotein droplets called <em>chylomicrons</em>. Chylomicrons enter the wide, fenestrated blind-ended <em>lacteals</em> of intestinal villi. The milky lipid-rich lymph (chyle) is transported via the thoracic duct into the left subclavian vein.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setMode: setMode
  };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Vertebrate Heart Evolution (vertebrateheartevolutionsim)
// -------------------------------------------------------------------------
window.SIMS.vertebrateheartevolutionsim = (function(){
  var clade = "mammal_4c"; // "fish_2c", "amphibian_3c", "mammal_4c"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Oxygenated Blood Circuit</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Deoxygenated Venous Circuit</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Mixed Blood (Single Ventricle)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Complete Double Circulation</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.vertebrateheartevolutionsim.setClade(\'fish_2c\')">1. Fishes: 2-Chambered Single Circuit</button>' +
      '<button class="preset-btn" onclick="SIMS.vertebrateheartevolutionsim.setClade(\'amphibian_3c\')">2. Amphibians/Reptiles: 3-Chambered Mixing</button>' +
      '<button class="preset-btn" onclick="SIMS.vertebrateheartevolutionsim.setClade(\'mammal_4c\')">3. Birds/Mammals: 4-Chambered Double</button>';
  }

  function setClade(c){
    clade = c;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (clade === "fish_2c") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">FISHES: 2-CHAMBERED HEART & SINGLE CIRCULATION (VENOUS HEART)</text>';

      // 2 Chambers: Atrium (Top) + Ventricle (Bottom)
      svg += '<g transform="translate(240, 100)">';
      svg += '<circle cx="60" cy="50" r="45" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/>';
      svg += '<text x="60" y="55" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Atrium (1)</text>';

      svg += '<circle cx="60" cy="140" r="50" fill="#0369a1" stroke="#38bdf8" stroke-width="4"/>';
      svg += '<text x="60" y="145" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Ventricle (1)</text>';
      svg += '</g>';

      // Circuit diagram on right
      svg += '<g transform="translate(420, 70)">';
      svg += '<rect x="0" y="0" width="300" height="240" fill="#1e293b" rx="6" stroke="#38bdf8"/>';
      svg += '<text x="150" y="28" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Single Circulation Loop:</text>';
      svg += '<text x="20" y="65" fill="#f8fafc" font-size="11">1. Body Tissues -> Deoxygenated Blood</text>';
      svg += '<text x="20" y="90" fill="#f8fafc" font-size="11">2. Enters Sinus Venosus & Atrium</text>';
      svg += '<text x="20" y="115" fill="#f8fafc" font-size="11">3. Ventricle pumps blood to GILLS</text>';
      svg += '<text x="20" y="140" fill="#10b981" font-size="11" font-weight="bold">4. Oxygenated at Gill Capillaries</text>';
      svg += '<text x="20" y="165" fill="#f8fafc" font-size="11">5. Flows directly to systemic tissues</text>';
      svg += '<text x="20" y="195" fill="#ef4444" font-size="12" font-weight="bold">Pure Venous Heart (Zero oxygenated blood)</text>';
      svg += '<text x="20" y="215" fill="#94a3b8" font-size="10">Low arterial pressure at systemic tissues</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Chamber Number', '2 Chambers (1 Atrium + 1 Ventricle)', '#38bdf8') +
              cell('Circulatory Pattern', 'Single Circulation', '#10b981') +
              cell('Heart Nature', 'Pure Venous Heart (Pumps deox only)', '#ef4444') +
              cell('Vertebrate Class', 'Pisces (Fishes)', '#fbbf24');

      vHtml = '<strong>Single Circulation in Fishes:</strong> Fishes possess a 2-chambered heart consisting of one atrium and one muscular ventricle. The heart pumps only deoxygenated blood forward to the gills (branchial circulation). Once oxygenated in the gill capillaries, blood does not return to the heart; instead, it travels directly under reduced pressure to body tissues before returning to the atrium as deoxygenated blood.';
    }
    else if (clade === "amphibian_3c") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">AMPHIBIANS & REPTILES: 3-CHAMBERED HEART & INCOMPLETE DOUBLE CIRCULATION</text>';

      // 3 Chambers: 2 Atria + 1 Ventricle
      svg += '<g transform="translate(220, 90)">';
      // Right Atrium (Deox)
      svg += '<ellipse cx="30" cy="50" rx="35" ry="30" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/>';
      svg += '<text x="30" y="55" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Right Atrium</text>';
      // Left Atrium (Ox)
      svg += '<ellipse cx="110" cy="50" rx="35" ry="30" fill="#dc2626" stroke="#f87171" stroke-width="3"/>';
      svg += '<text x="110" y="55" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Left Atrium</text>';
      // Single Ventricle (Mixed)
      svg += '<path d="M -10 90 Q 70 80 150 90 C 140 180, 0 180, -10 90 Z" fill="#7c3aed" stroke="#a855f7" stroke-width="3"/>';
      svg += '<text x="70" y="135" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">Single Ventricle</text>';
      svg += '<text x="70" y="155" fill="#fbcfe8" font-size="10" text-anchor="middle">(Partial Mixing of Blood)</text>';
      svg += '</g>';

      // Explanation panel
      svg += '<g transform="translate(420, 70)">';
      svg += '<rect x="0" y="0" width="300" height="240" fill="#1e293b" rx="6" stroke="#a855f7"/>';
      svg += '<text x="150" y="28" fill="#a855f7" font-size="13" font-weight="bold" text-anchor="middle">Incomplete Double Circuit:</text>';
      svg += '<text x="20" y="65" fill="#38bdf8" font-size="11">• Right Atrium receives Deox blood from body</text>';
      svg += '<text x="20" y="90" fill="#f87171" font-size="11">• Left Atrium receives Ox blood from lungs/skin</text>';
      svg += '<text x="20" y="120" fill="#fbbf24" font-size="12" font-weight="bold">• Both Atria empty into 1 Single Ventricle</text>';
      svg += '<text x="20" y="145" fill="#f8fafc" font-size="11">• Oxygenated & deoxygenated blood mix</text>';
      svg += '<text x="20" y="170" fill="#f8fafc" font-size="11">• Ejects mixed blood to body & pulmocutaneous</text>';
      svg += '<text x="20" y="205" fill="#10b981" font-size="11" font-weight="bold">Exception: Crocodiles have 4 chambers!</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Chamber Number', '3 Chambers (2 Atria + 1 Ventricle)', '#a855f7') +
              cell('Circulatory Pattern', 'Incomplete Double Circulation', '#fbbf24') +
              cell('Ventricular Mixing', 'Partial mixing of Ox & Deox blood', '#ef4444') +
              cell('Reptilian Exception', 'Crocodilians (Have 4 chambers)', '#10b981');

      vHtml = '<strong>Incomplete Double Circulation:</strong> Amphibians and non-crocodilian reptiles possess a 3-chambered heart with two separate atria and one undivided ventricle. The left atrium receives oxygenated blood from the lungs or skin, while the right atrium receives deoxygenated blood from the body. Because both atria pump into a shared common ventricle, the blood streams partially mix before ejection.';
    }
    else if (clade === "mammal_4c") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">BIRDS & MAMMALS: 4-CHAMBERED HEART & COMPLETE DOUBLE CIRCULATION</text>';

      // 4 Chambers: RA, LA, RV, LV
      svg += '<g transform="translate(200, 80)">';
      // Right Atrium
      svg += '<rect x="0" y="0" width="75" height="65" fill="#0284c7" stroke="#38bdf8" stroke-width="3" rx="4"/>';
      svg += '<text x="37" y="35" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">RA (Deox)</text>';
      // Left Atrium
      svg += '<rect x="85" y="0" width="75" height="65" fill="#b91c1c" stroke="#ef4444" stroke-width="3" rx="4"/>';
      svg += '<text x="122" y="35" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">LA (Ox)</text>';
      // Right Ventricle
      svg += '<rect x="0" y="75" width="75" height="100" fill="#0369a1" stroke="#38bdf8" stroke-width="3" rx="4"/>';
      svg += '<text x="37" y="125" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">RV</text>';
      // Left Ventricle (Thick wall)
      svg += '<rect x="85" y="75" width="75" height="100" fill="#991b1b" stroke="#ef4444" stroke-width="5" rx="4"/>';
      svg += '<text x="122" y="125" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">LV (Thick)</text>';

      // Interventricular Septum line
      svg += '<line x1="80" y1="0" x2="80" y2="185" stroke="#f8fafc" stroke-width="4"/>';
      svg += '<text x="80" y="205" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">Complete Septum (Zero Mixing)</text>';
      svg += '</g>';

      // Explanation panel
      svg += '<g transform="translate(420, 70)">';
      svg += '<rect x="0" y="0" width="300" height="240" fill="#1e293b" rx="6" stroke="#10b981"/>';
      svg += '<text x="150" y="28" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">Complete Double Circulation:</text>';
      svg += '<text x="20" y="60" fill="#38bdf8" font-size="11">• Pulmonary Loop: RV -> Lungs -> LA</text>';
      svg += '<text x="20" y="85" fill="#ef4444" font-size="11">• Systemic Loop: LV -> Body -> RA</text>';
      svg += '<text x="20" y="115" fill="#10b981" font-size="12" font-weight="bold">• ZERO mixing of Oxygenated & Deox blood</text>';
      svg += '<text x="20" y="140" fill="#f8fafc" font-size="11">• Independent pressure regulation:</text>';
      svg += '<text x="35" y="160" fill="#bae6fd" font-size="10">High Systemic (120 mmHg) vs Low Pulm (25 mmHg)</text>';
      svg += '<text x="20" y="190" fill="#fbbf24" font-size="12" font-weight="bold">• Essential for Endothermic Homeothermy</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Chambers', '4 (2 Atria + 2 Ventricles)', '#10b981') +
              cell('Double Circulation', 'Complete (Zero blood mixing)', '#10b981') +
              cell('Pressure Partition', 'Systemic 120 / Pulmonary 25 mmHg', '#38bdf8') +
              cell('Metabolic Benefit', 'Sustains Homeothermy & Endothermy', '#fbbf24');

      vHtml = '<strong>Complete Double Circulation:</strong> In birds, mammals, and crocodilians, complete interatrial and interventricular septa permanently divide the heart into two distinct functional pumps. The right side pumps deoxygenated blood to the lungs under low pressure (~25 mmHg) to protect delicate alveolar capillaries, while the left ventricle pumps fully oxygenated blood at high pressure (~120 mmHg) to systemic tissues with zero mixing, fulfilling the immense metabolic demands of endothermy.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setClade: setClade
  };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Cardiac Cycle Engine (cardiaccycleengine)
// -------------------------------------------------------------------------
window.SIMS.cardiaccycleengine = (function(){
  var mode = "cycle_animation"; // "cycle_animation", "stroke_volume", "heart_sounds"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Joint Diastole (0.4s, 70% Filling)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Atrial Systole (0.1s, 30% Filling)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Ventricular Systole (0.3s, Ejection)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>First Sound LUB / Second Sound DUB</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.cardiaccycleengine.setMode(\'cycle_animation\')">1. 0.8-Second Cycle Phases</button>' +
      '<button class="preset-btn" onclick="SIMS.cardiaccycleengine.setMode(\'stroke_volume\')">2. Stroke Volume & Cardiac Output</button>' +
      '<button class="preset-btn" onclick="SIMS.cardiaccycleengine.setMode(\'heart_sounds\')">3. Phonocardiogram: LUB vs DUB</button>';
  }

  function setMode(m){
    mode = m;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    if (mode === "cycle_animation") {
      // 0.8s cycle:
      // t=0: Early Joint Diastole (0.0 - 0.2s)
      // t=1: Late Joint Diastole (0.2 - 0.4s)
      // t=2: Atrial Systole (0.4 - 0.5s = 0.1s)
      // t=3: Ventricular Systole (0.5 - 0.8s = 0.3s) - LUB
      // t=4: Ventricular Diastole onset - DUB
      var cyclePhase = [
        {name: "Joint Diastole (Early)", dur: "0.2s", av: "Open", sl: "Closed", pV: "2 mmHg", sound: "None"},
        {name: "Joint Diastole (Passive Filling 70%)", dur: "0.4s", av: "Open", sl: "Closed", pV: "5 mmHg", sound: "None"},
        {name: "Atrial Systole (SAN Fires +30% filling)", dur: "0.1s", av: "Open", sl: "Closed", pV: "10 mmHg", sound: "None"},
        {name: "Ventricular Systole (Ejection)", dur: "0.3s", av: "CLOSED", sl: "OPEN", pV: "120 mmHg", sound: "1st Sound: LUB"},
        {name: "Ventricular Diastole Onset", dur: "0.4s", av: "Opening", sl: "CLOSED", pV: "80 -> 10 mmHg", sound: "2nd Sound: DUB"}
      ][t];

      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HUMAN CARDIAC CYCLE ROTARY ENGINE (0.8s DURATION AT 72 bpm)</text>';

      // Pie Wheel representing 0.8s
      // 0.4s Joint Diastole (180 deg) + 0.1s Atrial Systole (45 deg) + 0.3s Ventricular Systole (135 deg)
      svg += '<g transform="translate(200, 200)">';
      // Joint Diastole (180 deg: Green)
      svg += '<path d="M 0 0 L 0 -110 A 110 110 0 0 1 0 110 Z" fill="#10b981" opacity="0.8"/>';
      // Atrial Systole (45 deg: Cyan)
      svg += '<path d="M 0 0 L 0 110 A 110 110 0 0 1 -78 78 Z" fill="#38bdf8" opacity="0.85"/>';
      // Ventricular Systole (135 deg: Red)
      svg += '<path d="M 0 0 L -78 78 A 110 110 0 0 1 0 -110 Z" fill="#ef4444" opacity="0.85"/>';
      svg += '<circle cx="0" cy="0" r="45" fill="#0f172a"/>';
      svg += '<text x="0" y="5" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">0.8 s Total</text>';

      // Pointer for current phase
      var angles = [-90, -45, 115, 180, 240];
      var pa = angles[t] * Math.PI / 180;
      svg += '<line x1="0" y1="0" x2="' + (Math.cos(pa)*115) + '" y2="' + (Math.sin(pa)*115) + '" stroke="#fbbf24" stroke-width="4"/>';
      svg += '</g>';

      // Right Status Panel
      svg += '<g transform="translate(380, 70)">';
      svg += '<rect x="0" y="0" width="340" height="245" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="20" y="30" fill="#fbbf24" font-size="14" font-weight="bold">Phase: ' + cyclePhase.name + '</text>';
      svg += '<text x="20" y="60" fill="#f8fafc" font-size="12">• Phase Duration: ' + cyclePhase.dur + '</text>';
      svg += '<text x="20" y="90" fill="#f8fafc" font-size="12">• Atrioventricular (Tricuspid/Bicuspid) Valves: ' + cyclePhase.av + '</text>';
      svg += '<text x="20" y="120" fill="#f8fafc" font-size="12">• Semilunar (Aortic/Pulmonary) Valves: ' + cyclePhase.sl + '</text>';
      svg += '<text x="20" y="150" fill="#f8fafc" font-size="12">• Left Ventricular Pressure: ' + cyclePhase.pV + '</text>';

      svg += '<rect x="20" y="175" width="300" height="50" fill="#0f172a" rx="4" stroke="' + (cyclePhase.sound.includes("LUB") ? "#ef4444" : (cyclePhase.sound.includes("DUB") ? "#fbbf24" : "#475569")) + '" stroke-width="2"/>';
      svg += '<text x="170" y="205" fill="' + (cyclePhase.sound !== "None" ? "#34d399" : "#94a3b8") + '" font-size="13" font-weight="bold" text-anchor="middle">Acoustic Sound: ' + cyclePhase.sound + '</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Current Phase', cyclePhase.name, '#fbbf24') +
              cell('AV Valves Status', cyclePhase.av, (cyclePhase.av === "CLOSED" ? '#ef4444' : '#10b981')) +
              cell('Semilunar Valves', cyclePhase.sl, (cyclePhase.sl === "OPEN" ? '#10b981' : '#64748b')) +
              cell('Phonocardiogram', cyclePhase.sound, '#38bdf8');

      vHtml = '<strong>0.8-Second Human Cardiac Cycle:</strong> At rest (72 bpm), one complete cycle spans 0.8 seconds. <em>Joint Diastole</em> (0.4s) fills ventricles to 70% passively. <em>Atrial Systole</em> (0.1s) is triggered by the SAN, adding the remaining 30%. <em>Ventricular Systole</em> (0.3s) closes the AV valves producing the first sound (<strong>LUB</strong>), elevates pressure to 120 mmHg, opens semilunars, and ejects the stroke volume. Ventricular relaxation closes the semilunar valves, producing the second sound (<strong>DUB</strong>).';
    }
    else if (mode === "stroke_volume") {
      var hr = 72;
      var sv = 70;
      var co = hr * sv;

      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">STROKE VOLUME & CARDIAC OUTPUT STOICHIOMETRY (EXERCISE 15.12)</text>';

      // Formula Box
      svg += '<rect x="80" y="70" width="600" height="240" fill="#1e293b" rx="8" stroke="#334155"/>';
      svg += '<text x="110" y="105" fill="#38bdf8" font-size="14" font-weight="bold">Cardiac Output Hemodynamic Equation:</text>';
      svg += '<text x="110" y="135" fill="#f8fafc" font-size="13">• Stroke Volume (SV) = Volume ejected per ventricle per beat (~70 mL)</text>';
      svg += '<text x="110" y="165" fill="#f8fafc" font-size="13">• Heart Rate (HR) = Number of cycles per minute (~72 beats / min)</text>';
      svg += '<text x="110" y="195" fill="#fbbf24" font-size="14" font-weight="bold">• Cardiac Output (CO) = Stroke Volume × Heart Rate</text>';

      // Big Result Box
      svg += '<rect x="110" y="215" width="540" height="70" fill="#0f172a" rx="6" stroke="#10b981" stroke-width="2"/>';
      svg += '<text x="380" y="245" fill="#10b981" font-size="15" font-weight="bold" text-anchor="middle">Resting Adult Cardiac Output:</text>';
      svg += '<text x="380" y="270" fill="#6ee7b7" font-size="17" font-weight="bold" text-anchor="middle">CO = 70 mL × 72 bpm = 5040 mL/min ≈ 5.0 Litres / minute</text>';

      svg += '</svg>';

      rHtml = cell('Stroke Volume (SV)', '70 mL / beat', '#38bdf8') +
              cell('Heart Rate (HR)', '72 beats / minute', '#fbbf24') +
              cell('Cardiac Output (CO)', '5040 mL/min (~5.0 L/min)', '#10b981') +
              cell('Athlete Dynamic Range', 'Can surge to 25-30 L/min', '#ef4444');

      vHtml = '<strong>Stroke Volume and Cardiac Output:</strong> Stroke volume is the volume of blood pumped out by each ventricle during a single beat (~70 mL). Cardiac Output is the volume pumped per minute ($CO = SV \times HR$). In a healthy resting adult, $70\,\text{mL} \times 72\,\text{bpm} = 5040\,\text{mL/min} \approx 5.0\,\text{Litres/min}$. Endurance athletes achieve higher stroke volumes (~100 mL), allowing lower resting heart rates (~50 bpm) with normal output.';
    }
    else if (mode === "heart_sounds") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">PHONOCARDIOGRAPHY: FIRST SOUND (LUB) VS SECOND SOUND (DUB)</text>';

      // Left: 1st Sound LUB
      svg += '<g transform="translate(100, 70)">';
      svg += '<rect x="0" y="0" width="240" height="240" fill="#1e293b" rx="6" stroke="#ef4444"/>';
      svg += '<text x="120" y="30" fill="#ef4444" font-size="15" font-weight="bold" text-anchor="middle">FIRST SOUND: LUB</text>';
      svg += '<text x="20" y="70" fill="#f8fafc" font-size="11">• Cause: Closure of AV valves</text>';
      svg += '<text x="20" y="95" fill="#fca5a5" font-size="11">(Tricuspid & Bicuspid/Mitral)</text>';
      svg += '<text x="20" y="125" fill="#f8fafc" font-size="11">• Timing: Onset of Ventricular Systole</text>';
      svg += '<text x="20" y="150" fill="#f8fafc" font-size="11">• Pitch: Low-pitched & dull</text>';
      svg += '<text x="20" y="175" fill="#f8fafc" font-size="11">• Duration: Longer (~0.14 s)</text>';
      svg += '<text x="20" y="210" fill="#fbbf24" font-size="11" font-weight="bold">Prevents backflow into atria</text>';
      svg += '</g>';

      // Right: 2nd Sound DUB
      svg += '<g transform="translate(420, 70)">';
      svg += '<rect x="0" y="0" width="240" height="240" fill="#1e293b" rx="6" stroke="#38bdf8"/>';
      svg += '<text x="120" y="30" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">SECOND SOUND: DUB</text>';
      svg += '<text x="20" y="70" fill="#f8fafc" font-size="11">• Cause: Closure of Semilunar valves</text>';
      svg += '<text x="20" y="95" fill="#bae6fd" font-size="11">(Aortic & Pulmonary valves)</text>';
      svg += '<text x="20" y="125" fill="#f8fafc" font-size="11">• Timing: Onset of Ventricular Diastole</text>';
      svg += '<text x="20" y="150" fill="#f8fafc" font-size="11">• Pitch: High-pitched & sharp</text>';
      svg += '<text x="20" y="175" fill="#f8fafc" font-size="11">• Duration: Shorter (~0.10 s)</text>';
      svg += '<text x="20" y="210" fill="#10b981" font-size="11" font-weight="bold">Prevents backflow into ventricles</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('1st Heart Sound', 'LUB: AV valve closure (Ventricular Systole)', '#ef4444') +
              cell('2nd Heart Sound', 'DUB: Semilunar closure (Ventricular Diastole)', '#38bdf8') +
              cell('Acoustic Pitches', 'LUB is low & long | DUB is high & short', '#fbbf24') +
              cell('Clinical Auscultation', 'Murmurs detect valvular leakage', '#10b981');

      vHtml = '<strong>Origin of Heart Sounds:</strong> Auscultation with a stethoscope reveals two characteristic sounds per cycle. The first sound, <strong>LUB</strong>, occurs at the start of ventricular systole when rising intraventricular pressure snaps the atrioventricular (tricuspid and bicuspid) valves shut. The second sound, <strong>DUB</strong>, occurs at the beginning of ventricular diastole when back-surging blood snaps the semilunar valves shut.';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setMode: setMode
  };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Clinical ECG Simulator (ecgsimulator)
// -------------------------------------------------------------------------
window.SIMS.ecgsimulator = (function(){
  var ecgMode = "standard_ecg"; // "standard_ecg", "heart_rate_calc", "ischemia"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>P-Wave: Atrial Depolarization</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>QRS Complex: Ventricular Depolarization</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>T-Wave: Ventricular Repolarization</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>R-R Interval Rate Counter</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.ecgsimulator.setMode(\'standard_ecg\')">1. Standard ECG Waveforms & Intervals</button>' +
      '<button class="preset-btn" onclick="SIMS.ecgsimulator.setMode(\'heart_rate_calc\')">2. Heart Rate Determination (R-R)</button>' +
      '<button class="preset-btn" onclick="SIMS.ecgsimulator.setMode(\'ischemia\')">3. Ischemia & Infarction (STEMI)</button>';
  }

  function setMode(m){
    ecgMode = m;
    App.state.t = 0;
    render(0);
  }

  function render(t){
    var svg = '';
    var rHtml = '';
    var vHtml = '';

    svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
    svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">CLINICAL ELECTROCARDIOGRAPHY (ECG): LEADS, WAVES & SEGMENTS</text>';

    // ECG Paper Grid (Pink/Red grid lines)
    for (var gx = 50; gx <= 710; gx += 25) {
      svg += '<line x1="' + gx + '" y1="60" x2="' + gx + '" y2="330" stroke="#334155" stroke-width="0.5"/>';
    }
    for (var gy = 60; gy <= 330; gy += 25) {
      svg += '<line x1="50" y1="' + gy + '" x2="710" y2="' + gy + '" stroke="#334155" stroke-width="0.5"/>';
    }

    var isSTEMI = (ecgMode === "ischemia");

    // ECG Tracing
    // Baseline y = 220
    // P-wave: 140 to 180 (peak at 160, y: 195)
    // Q-wave: 210, y: 235
    // R-wave: 230, y: 90
    // S-wave: 250, y: 255
    // T-wave: normal (330 to 400, peak 365, y: 180) vs STEMI (ST elevated at y: 150)
    var ecgPath = 'M 60 220 L 130 220 Q 155 190 180 220 L 205 220 L 215 235 L 230 90 L 245 255 L 255 220 ';
    if (isSTEMI) {
      // Elevated ST segment and dome-shaped T wave
      ecgPath += 'L 280 160 Q 340 140 380 220 L 500 220';
    } else {
      ecgPath += 'L 310 220 Q 355 175 400 220 L 500 220';
    }
    svg += '<path d="' + ecgPath + '" fill="none" stroke="#22c55e" stroke-width="3.5"/>';

    if (ecgMode === "standard_ecg") {
      // Wave Labels
      svg += '<text x="155" y="175" fill="#38bdf8" font-size="13" font-weight="bold">P</text>';
      svg += '<text x="210" y="255" fill="#94a3b8" font-size="12" font-weight="bold">Q</text>';
      svg += '<text x="230" y="75" fill="#ef4444" font-size="16" font-weight="bold">R</text>';
      svg += '<text x="252" y="275" fill="#94a3b8" font-size="12" font-weight="bold">S</text>';
      svg += '<text x="355" y="160" fill="#10b981" font-size="14" font-weight="bold">T</text>';

      // Annotations Box
      svg += '<g transform="translate(470, 75)">';
      svg += '<rect x="0" y="0" width="250" height="225" fill="#1e293b" rx="6" stroke="#334155"/>';
      svg += '<text x="15" y="26" fill="#38bdf8" font-size="12" font-weight="bold">• P-Wave:</text>';
      svg += '<text x="25" y="44" fill="#cbd5e1" font-size="10">Atrial depolarization -> Atrial systole</text>';

      svg += '<text x="15" y="72" fill="#ef4444" font-size="12" font-weight="bold">• QRS Complex:</text>';
      svg += '<text x="25" y="90" fill="#cbd5e1" font-size="10">Ventricular depolarization -> Ventricular systole</text>';

      svg += '<text x="15" y="118" fill="#10b981" font-size="12" font-weight="bold">• T-Wave:</text>';
      svg += '<text x="25" y="136" fill="#cbd5e1" font-size="10">Ventricular repolarization</text>';
      svg += '<text x="25" y="152" fill="#a7f3d0" font-size="10">End of T marks end of Ventricular Systole</text>';

      svg += '<text x="15" y="180" fill="#fbbf24" font-size="12" font-weight="bold">• P-R Interval:</text>';
      svg += '<text x="25" y="198" fill="#cbd5e1" font-size="10">AV nodal conduction delay (0.12-0.20s)</text>';
      svg += '</g>';
    } else if (ecgMode === "heart_rate_calc") {
      var calcBpm = 72;
      svg += '<g transform="translate(470, 80)">';
      svg += '<rect x="0" y="0" width="250" height="200" fill="#1e293b" rx="6" stroke="#fbbf24"/>';
      svg += '<text x="125" y="28" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Heart Rate Determination:</text>';
      svg += '<text x="15" y="60" fill="#f8fafc" font-size="11">• Count QRS complexes per unit time</text>';
      svg += '<text x="15" y="85" fill="#f8fafc" font-size="11">• Standard Paper Speed: 25 mm/s</text>';
      svg += '<text x="15" y="110" fill="#f8fafc" font-size="11">• Formula: HR = 60 / (R-R interval)</text>';
      svg += '<rect x="15" y="130" width="220" height="50" fill="#0f172a" rx="4" stroke="#10b981"/>';
      svg += '<text x="125" y="160" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">Calculated HR: ' + calcBpm + ' bpm (Normal)</text>';
      svg += '</g>';
    } else if (isSTEMI) {
      svg += '<g transform="translate(450, 80)">';
      svg += '<rect x="0" y="0" width="270" height="200" fill="#1e293b" rx="6" stroke="#ef4444"/>';
      svg += '<text x="135" y="28" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">Acute Myocardial Infarction</text>';
      svg += '<text x="15" y="60" fill="#fca5a5" font-size="12" font-weight="bold">• ST-Segment Elevation (STEMI)</text>';
      svg += '<text x="15" y="85" fill="#f8fafc" font-size="11">• Complete occlusion of coronary artery</text>';
      svg += '<text x="15" y="110" fill="#f8fafc" font-size="11">• Ischemia & necrosis of ventricular wall</text>';
      svg += '<text x="15" y="135" fill="#f8fafc" font-size="11">• T-wave inversion & pathological Q waves</text>';
      svg += '<text x="15" y="170" fill="#ef4444" font-size="11" font-weight="bold">Medical Emergency: Reperfusion therapy needed</text>';
      svg += '</g>';
    }

    svg += '</svg>';

    rHtml = cell('P-Wave', 'Atrial Depolarization', '#38bdf8') +
            cell('QRS Complex', 'Ventricular Depolarization', '#ef4444') +
            cell('T-Wave', 'Ventricular Repolarization', '#10b981') +
            cell('Clinical Indication', isSTEMI ? 'STEMI (Acute Myocardial Infarction)' : 'Normal Sinus Rhythm (72 bpm)', isSTEMI ? '#ef4444' : '#10b981');

    vHtml = '<strong>Electrocardiogram (ECG) Architecture:</strong> The P-wave corresponds to atrial depolarization initiated by the SAN. The QRS complex represents rapid ventricular depolarization and initiates ventricular systole. The T-wave represents ventricular repolarization; its end marks the mechanical end of ventricular systole. Counting QRS complexes gives the patient’s heart rate. ST-segment elevations indicate acute myocardial infarction.';

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setMode: setMode
  };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Vascular Pathology (vascularpathologysim)
// -------------------------------------------------------------------------
window.SIMS.vascularpathologysim = (function(){
  var view = "double_circuit"; // "double_circuit", "hepatic_portal", "atherosclerosis_cad"

  function mount(){
    App.state.maxT = 4;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Systemic Arterial Circulation (Aorta)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Pulmonary Circulation (Lungs)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#fbbf24;"></span><span>Hepatic Portal System (Digestive -> Liver)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Atherosclerosis & Coronary Artery Plaque</span></div>';

    document.getElementById("lab-presets").innerHTML =
      '<button class="preset-btn" onclick="SIMS.vascularpathologysim.setView(\'double_circuit\')">1. Pulmonary & Systemic Double Circuit</button>' +
      '<button class="preset-btn" onclick="SIMS.vascularpathologysim.setView(\'hepatic_portal\')">2. Hepatic Portal Venous System</button>' +
      '<button class="preset-btn" onclick="SIMS.vascularpathologysim.setView(\'atherosclerosis_cad\')">3. Atherosclerosis (CAD) & Angina</button>';
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

    if (view === "double_circuit") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HUMAN DOUBLE CIRCULATION: PULMONARY & SYSTEMIC PARALLEL CIRCUITS</text>';

      // Pulmonary Loop (Top)
      svg += '<ellipse cx="380" cy="80" rx="90" ry="25" fill="#0284c7" opacity="0.3" stroke="#38bdf8" stroke-width="2"/>';
      svg += '<text x="380" y="85" fill="#bae6fd" font-size="12" font-weight="bold" text-anchor="middle">Lungs (Alveolar Capillaries)</text>';

      // Heart in Center
      svg += '<rect x="310" y="140" width="140" height="100" fill="#1e293b" stroke="#f8fafc" stroke-width="3" rx="8"/>';
      svg += '<text x="380" y="185" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">HEART (4-Chambered)</text>';
      svg += '<text x="380" y="205" fill="#fbbf24" font-size="10" text-anchor="middle">RA / RV (Right) | LA / LV (Left)</text>';

      // Systemic Loop (Bottom)
      svg += '<ellipse cx="380" cy="300" rx="120" ry="30" fill="#991b1b" opacity="0.3" stroke="#ef4444" stroke-width="2"/>';
      svg += '<text x="380" y="305" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">Systemic Body Tissues & Organs</text>';

      // Pulmonary Vessels
      svg += '<path d="M 330 140 L 330 105" stroke="#38bdf8" stroke-width="4" marker-end="url(#arrow)"/>';
      svg += '<text x="300" y="125" fill="#38bdf8" font-size="10">Pulm. Artery</text>';

      svg += '<path d="M 430 105 L 430 140" stroke="#ef4444" stroke-width="4"/>';
      svg += '<text x="460" y="125" fill="#ef4444" font-size="10">Pulm. Veins</text>';

      // Systemic Vessels
      svg += '<path d="M 430 240 L 430 270" stroke="#ef4444" stroke-width="5"/>';
      svg += '<text x="450" y="255" fill="#ef4444" font-size="10">Aorta</text>';

      svg += '<path d="M 330 270 L 330 240" stroke="#38bdf8" stroke-width="5"/>';
      svg += '<text x="300" y="255" fill="#38bdf8" font-size="10">Vena Cava</text>';

      svg += '</svg>';

      rHtml = cell('Systemic Pressure', '120 / 80 mmHg (High pressure)', '#ef4444') +
              cell('Pulmonary Pressure', '25 / 10 mmHg (Low pressure)', '#38bdf8') +
              cell('Circuit 1 (Pulmonary)', 'RV -> Pulm Artery -> Lungs -> LA', '#38bdf8') +
              cell('Circuit 2 (Systemic)', 'LV -> Aorta -> Body Tissues -> RA', '#ef4444');

      vHtml = '<strong>Double Circulation Overview:</strong> Blood circulates through two parallel loops: (1) <em>Pulmonary Circulation</em> (Right ventricle $\to$ pulmonary artery $\to$ lungs $\to$ pulmonary veins $\to$ left atrium) operates under low pressure to enable gas exchange without alveolar edema. (2) <em>Systemic Circulation</em> (Left ventricle $\to$ aorta $\to$ systemic tissues $\to$ vena cava $\to$ right atrium) pumps oxygenated blood at high pressure to nourish the entire body.';
    }
    else if (view === "hepatic_portal") {
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">HEPATIC PORTAL SYSTEM: DIGESTIVE TRACT TO LIVER SHUNT</text>';

      // Digestive Tract (Left)
      svg += '<rect x="80" y="110" width="160" height="150" fill="#1e293b" rx="6" stroke="#fbbf24"/>';
      svg += '<text x="160" y="140" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">Digestive Tract</text>';
      svg += '<text x="160" y="165" fill="#f8fafc" font-size="11" text-anchor="middle">(Stomach & Intestines)</text>';
      svg += '<text x="160" y="200" fill="#fde047" font-size="10" text-anchor="middle">Nutrient Absorption</text>';

      // Hepatic Portal Vein (Center)
      svg += '<path d="M 240 185 L 370 185" stroke="#fbbf24" stroke-width="8"/>';
      svg += '<text x="305" y="170" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">Hepatic Portal Vein</text>';

      // Liver (Center Right)
      svg += '<rect x="370" y="90" width="160" height="190" fill="#1e293b" rx="6" stroke="#10b981"/>';
      svg += '<text x="450" y="130" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">LIVER</text>';
      svg += '<text x="450" y="160" fill="#f8fafc" font-size="11" text-anchor="middle">Detoxification</text>';
      svg += '<text x="450" y="185" fill="#f8fafc" font-size="11" text-anchor="middle">Glycogen Storage</text>';
      svg += '<text x="450" y="210" fill="#f8fafc" font-size="11" text-anchor="middle">Protein Synthesis</text>';

      // Hepatic Vein to Inferior Vena Cava (Right)
      svg += '<path d="M 530 185 L 630 185" stroke="#38bdf8" stroke-width="6"/>';
      svg += '<text x="580" y="170" fill="#38bdf8" font-size="10" text-anchor="middle">Hepatic Vein</text>';
      svg += '<rect x="630" y="110" width="80" height="150" fill="#0284c7" opacity="0.3" rx="4"/>';
      svg += '<text x="670" y="185" fill="#38bdf8" font-size="11" font-weight="bold" transform="rotate(-90 670 185)" text-anchor="middle">Inferior Vena Cava</text>';

      svg += '</svg>';

      rHtml = cell('Vascular Shunt', 'Hepatic Portal Vein', '#fbbf24') +
              cell('Origin Organ', 'Stomach and Intestines', '#38bdf8') +
              cell('Target Organ', 'Liver Sinusoids', '#10b981') +
              cell('Primary Purpose', 'Metabolic processing & detoxification', '#ef4444');

      vHtml = '<strong>The Hepatic Portal System:</strong> A portal system begins and ends in capillaries without first returning to the heart. The <em>hepatic portal vein</em> collects venous blood rich in absorbed nutrients and potential toxins from the stomach, intestines, pancreas, and spleen, delivering it directly to the liver sinusoids. The liver metabolizes nutrients, stores glycogen, and detoxifies chemicals before releasing blood into the hepatic veins and inferior vena cava.';
    }
    else if (view === "atherosclerosis_cad") {
      var stenosis = 20 + t * 15; // 20% to 80% stenosis
      svg += '<svg viewBox="0 0 760 380" style="width:100%;height:380px;background:#0f172a;border-radius:8px;">';
      svg += '<text x="20" y="32" fill="#94a3b8" font-size="14" font-weight="bold">CORONARY ARTERY DISEASE (CAD): ATHEROSCLEROSIS & LUMINAL STENOSIS</text>';

      // Artery Cross-Section
      svg += '<g transform="translate(200, 200)">';
      // Tunica externa (outer fibrous)
      svg += '<circle cx="0" cy="0" r="100" fill="#334155" stroke="#64748b" stroke-width="3"/>';
      // Tunica media (smooth muscle)
      svg += '<circle cx="0" cy="0" r="85" fill="#991b1b" stroke="#ef4444" stroke-width="4"/>';
      // Tunica intima & Atherosclerotic Plaque (Yellow fat/calcium)
      var plaqueR = 65 - stenosis * 0.45;
      svg += '<circle cx="0" cy="0" r="65" fill="#facc15"/>';
      // Remaining open lumen (Red)
      svg += '<circle cx="0" cy="0" r="' + plaqueR + '" fill="#dc2626"/>';
      svg += '<text x="0" y="4" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Lumen (' + (100 - stenosis) + '%)</text>';
      svg += '</g>';

      // Pathology Info on Right
      svg += '<g transform="translate(380, 80)">';
      svg += '<rect x="0" y="0" width="340" height="230" fill="#1e293b" rx="6" stroke="#ef4444"/>';
      svg += '<text x="20" y="30" fill="#ef4444" font-size="13" font-weight="bold">CAD / Atherosclerosis Characteristics:</text>';
      svg += '<text x="20" y="60" fill="#f8fafc" font-size="11">• Deposition: Calcium, fat, cholesterol & fibrous tissue</text>';
      svg += '<text x="20" y="85" fill="#f8fafc" font-size="11">• Location: Coronary arteries supplying heart muscle</text>';
      svg += '<text x="20" y="110" fill="#fca5a5" font-size="11">• Effect: Narrows arterial lumen & stiffens walls</text>';
      svg += '<text x="20" y="140" fill="#fbbf24" font-size="12" font-weight="bold">• Angina Pectoris: Acute crushing chest pain</text>';
      svg += '<text x="35" y="160" fill="#fde047" font-size="10">(Inadequate oxygen reaching cardiac myocardium)</text>';
      svg += '<text x="20" y="190" fill="#ef4444" font-size="12" font-weight="bold">• Myocardial Infarction: Complete clot blockage</text>';
      svg += '<text x="20" y="212" fill="#94a3b8" font-size="10">Hypertension (>=140/90 mmHg) accelerates plaque damage</text>';
      svg += '</g>';

      svg += '</svg>';

      rHtml = cell('Arterial Stenosis', stenosis + '% Occlusion', '#ef4444') +
              cell('Plaque Constituents', 'Cholesterol, Calcium, Fat, Fibrous', '#fbbf24') +
              cell('Clinical Symptom', 'Angina Pectoris (Acute chest pain)', '#f59e0b') +
              cell('Hypertension Cutoff', '>= 140 / 90 mmHg', '#ef4444');

      vHtml = '<strong>Atherosclerosis and Coronary Artery Disease:</strong> Coronary Artery Disease (CAD), often termed <em>atherosclerosis</em>, is caused by progressive deposits of lipids, cholesterol, calcium, and fibrous scar tissue within the tunica intima of coronary arteries. As the lumen narrows, myocardial blood flow drops; during exertion, the resulting oxygen starvation produces acute ischemic chest pain termed <em>Angina Pectoris</em>. Complete thrombus occlusion causes acute myocardial infarction (heart attack).';
    }

    var root = document.getElementById("lab-viewport");
    if (root) root.innerHTML = svg;
    readout(rHtml);
    verdict(vHtml);
  }

  return {
    mount: mount,
    render: render,
    setView: setView
  };
})();
