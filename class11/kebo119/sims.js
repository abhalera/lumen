// kebo119 interactive simulations: Chemical Coordination and Integration
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
// 1. SIMULATION 1: Hypothalamus-Pituitary Axis & Feedback Loop Lab (hypothalamuspituitarysim)
// -------------------------------------------------------------------------
window.SIMS.hypothalamuspituitarysim = (function(){
  var axis = "gnrh"; // "gnrh", "trh", "crh", "gh", "oxytocin"
  var feedbackLevel = "normal"; // "low", "normal", "high"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Hypothalamus (Releasing / Inhibiting Factors)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Anterior Pituitary (Portal Blood Delivery)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Posterior Pituitary (Direct Axonal Axoplasm)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Target Endocrine Organ</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" onclick="window.SIMS.hypothalamuspituitarysim.setAxis(\'gnrh\')">GnRH &#8594; LH/FSH &#8594; Gonads</button>' +
        '<button class="lab-btn" onclick="window.SIMS.hypothalamuspituitarysim.setAxis(\'trh\')">TRH &#8594; TSH &#8594; Thyroid</button>' +
        '<button class="lab-btn" onclick="window.SIMS.hypothalamuspituitarysim.setAxis(\'crh\')">CRH &#8594; ACTH &#8594; Adrenal</button>' +
        '<button class="lab-btn" onclick="window.SIMS.hypothalamuspituitarysim.setAxis(\'gh\')">GHRH / Somatostatin &#8594; GH</button>' +
        '<button class="lab-btn" onclick="window.SIMS.hypothalamuspituitarysim.setAxis(\'oxytocin\')">Posterior: Oxytocin &amp; ADH</button>' +
        '<span style="border-left:1px solid var(--border);height:24px;margin:0 4px;"></span>' +
        '<button class="lab-btn" id="btn-toggle-fb" onclick="window.SIMS.hypothalamuspituitarysim.toggleFeedback()">Target Feedback: ' + feedbackLevel.toUpperCase() + '</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function setAxis(a){
    axis = a;
    render(App.state.t || 0);
  }

  function toggleFeedback(){
    if (feedbackLevel === "normal") feedbackLevel = "high";
    else if (feedbackLevel === "high") feedbackLevel = "low";
    else feedbackLevel = "normal";
    var btn = document.getElementById("btn-toggle-fb");
    if (btn) btn.textContent = "Target Feedback: " + feedbackLevel.toUpperCase();
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">HYPOTHALAMIC-PITUITARY AXIS &amp; NEUROVASCULAR COUPLING (FIG 19.2)</text>';

    // Hypothalamus Schematic Box
    h += '<rect x="180" y="50" width="440" height="95" rx="12" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>';
    h += '<text x="400" y="75" fill="#f87171" font-size="15" font-weight="700" text-anchor="middle">HYPOTHALAMUS (Basal Diencephalon)</text>';
    h += '<circle cx="280" cy="110" r="14" fill="#991b1b"/>';
    h += '<text x="280" y="114" fill="#fee2e2" font-size="9" font-weight="700" text-anchor="middle">Nuclei</text>';
    h += '<circle cx="520" cy="110" r="14" fill="#991b1b"/>';
    h += '<text x="520" y="114" fill="#fee2e2" font-size="9" font-weight="700" text-anchor="middle">PVN/SON</text>';

    var hypoHormone = {
      gnrh: "Gonadotrophin Releasing Hormone (GnRH)",
      trh: "Thyrotrophin Releasing Hormone (TRH)",
      crh: "Corticotrophin Releasing Hormone (CRH)",
      gh: feedbackLevel === "high" ? "Somatostatin (GH Inhibiting Hormone)" : "GHRH (Growth Hormone Releasing)",
      oxytocin: "Synthesizes Oxytocin & Vasopressin (ADH)"
    }[axis];
    h += '<text x="400" y="125" fill="#fcd34d" font-size="12" font-weight="600" text-anchor="middle">&#8680; ' + hypoHormone + '</text>';

    // Infundibular Stalk & Connections
    if (axis !== "oxytocin") {
      // Portal blood vessel path to Anterior Pituitary
      h += '<path d="M 320 145 L 320 220" stroke="#dc2626" stroke-width="6"/>';
      h += '<text x="250" y="185" fill="#fca5a5" font-size="11" font-weight="700">Hypophyseal Portal Vein</text>';
      h += '<text x="250" y="200" fill="#cbd5e1" font-size="9">(Vascular Transport)</text>';
    } else {
      // Direct Axonal tracts to Posterior Pituitary
      h += '<path d="M 480 145 L 480 220" stroke="#10b981" stroke-width="6" stroke-dasharray="4"/>';
      h += '<text x="540" y="185" fill="#6ee7b7" font-size="11" font-weight="700">Axonal Nerve Tracts</text>';
      h += '<text x="540" y="200" fill="#cbd5e1" font-size="9">(Direct Neurosecretion)</text>';
    }

    // Sella Turcica Bony Cavity Outline
    h += '<path d="M 230 200 C 230 330 570 330 570 200" fill="none" stroke="#64748b" stroke-width="8"/>';
    h += '<text x="400" y="345" fill="#94a3b8" font-size="11" text-anchor="middle">Sella Turcica (Bony Sphenoid Cavity)</text>';

    // Pituitary Gland: Anterior (Pars Distalis) & Posterior (Pars Nervosa)
    // Anterior Pituitary
    var antActive = (axis !== "oxytocin");
    var antFill = antActive ? "#1e3a8a" : "#1e293b";
    h += '<ellipse cx="330" cy="260" rx="65" ry="45" fill="' + antFill + '" stroke="#60a5fa" stroke-width="2"/>';
    h += '<text x="330" y="250" fill="#93c5fd" font-size="13" font-weight="700" text-anchor="middle">Anterior Pituitary</text>';
    h += '<text x="330" y="268" fill="#bfdbfe" font-size="10" text-anchor="middle">(Pars Distalis)</text>';

    // Posterior Pituitary
    var postActive = (axis === "oxytocin");
    var postFill = postActive ? "#064e3b" : "#1e293b";
    h += '<ellipse cx="470" cy="260" rx="55" ry="45" fill="' + postFill + '" stroke="#34d399" stroke-width="2"/>';
    h += '<text x="470" y="250" fill="#86efac" font-size="13" font-weight="700" text-anchor="middle">Posterior Pituitary</text>';
    h += '<text x="470" y="268" fill="#dcfce7" font-size="10" text-anchor="middle">(Pars Nervosa / Stores)</text>';

    // Target Organ Block (Bottom)
    var targets = {
      gnrh: { name: "Gonads (Testes / Ovaries)", hor: "LH & FSH (Gonadotrophins)", eff: "Testosterone / Estrogen & Gametogenesis", c: "#f59e0b" },
      trh: { name: "Thyroid Gland", hor: "TSH (Thyroid Stimulating Hormone)", eff: "Thyroxine (T4) & T3 &#8594; Elevates BMR", c: "#38bdf8" },
      crh: { name: "Adrenal Cortex", hor: "ACTH (Adrenocorticotrophic)", eff: "Cortisol (Glucocorticoids)", c: "#ef4444" },
      gh: { name: "Liver & Somatic Tissues", hor: "GH (Growth Hormone)", eff: "Longitudinal Bone & Muscle Growth", c: "#10b981" },
      oxytocin: { name: "Uterus & Mammary Glands", hor: "Oxytocin (also Vasopressin/ADH to Kidney)", eff: "Vigorous Parturition & Milk Ejection", c: "#ec4899" }
    }[axis];

    h += '<path d="M 330 305 L 330 375" stroke="' + targets.c + '" stroke-width="3" stroke-dasharray="3"/>';
    h += '<rect x="180" y="375" width="440" height="75" rx="10" fill="#1e293b" stroke="' + targets.c + '" stroke-width="2"/>';
    h += '<text x="400" y="398" fill="' + targets.c + '" font-size="14" font-weight="700" text-anchor="middle">Target Organ: ' + targets.name + '</text>';
    h += '<text x="400" y="418" fill="#f8fafc" font-size="12" text-anchor="middle">Pituitary Hormone: ' + targets.hor + '</text>';
    h += '<text x="400" y="436" fill="#94a3b8" font-size="11" text-anchor="middle">Physiological Action: ' + targets.eff + '</text>';

    // Negative Feedback Arc on Left
    if (feedbackLevel === "high") {
      h += '<path d="M 180 410 C 80 410 80 100 180 100" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="4"/>';
      h += '<text x="70" y="260" fill="#ef4444" font-size="12" font-weight="700" text-anchor="middle" transform="rotate(-90 70 260)">HIGH NEGATIVE FEEDBACK INHIBITION (&#8854;)</text>';
    } else if (feedbackLevel === "low") {
      h += '<path d="M 180 410 C 80 410 80 100 180 100" fill="none" stroke="#4ade80" stroke-width="3" stroke-dasharray="4"/>';
      h += '<text x="70" y="260" fill="#4ade80" font-size="12" font-weight="700" text-anchor="middle" transform="rotate(-90 70 260)">LOW HORMONAL LEVEL &#8594; AXIS STIMULATION (+)</text>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Active Axis", axis.toUpperCase(), "#38bdf8") +
      cell("Hypothalamic Hormone", hypoHormone.split(" ")[0], "#ef4444") +
      cell("Target Endocrine Gland", targets.name.split(" ")[0], targets.c) +
      cell("Feedback Status", feedbackLevel.toUpperCase() + " Loop", feedbackLevel === "high" ? "#ef4444" : "#10b981")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Hypothalamic-Hypophyseal Principle (NCERT 19.2.1):</strong> Releasing/inhibiting hormones from hypothalamic nuclei travel through the <em>hypophyseal portal system</em> to regulate the anterior pituitary. Posterior pituitary (pars nervosa) stores and releases Oxytocin and Vasopressin directly delivered via hypothalamic axons.' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setAxis: setAxis,
    toggleFeedback: toggleFeedback,
    setView: setAxis
  };
})();

// -------------------------------------------------------------------------
// 2. SIMULATION 2: Master Human Endocrine Cartography & Target Network (endocrinemaplab)
// -------------------------------------------------------------------------
window.SIMS.endocrinemaplab = (function(){
  var selectedGland = "pituitary";

  function mount(){
    App.state.maxT = 5;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Cranial Glands (Pineal, Hypo, Pituitary)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Cervical &amp; Thoracic (Thyroid, Parathyroid, Thymus)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Abdominal (Adrenal, Pancreas)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Gonadal (Testes / Ovaries)</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" onclick="window.SIMS.endocrinemaplab.selectGland(\'pituitary\')">Pituitary</button>' +
        '<button class="lab-btn" onclick="window.SIMS.endocrinemaplab.selectGland(\'pineal\')">Pineal</button>' +
        '<button class="lab-btn" onclick="window.SIMS.endocrinemaplab.selectGland(\'thyroid\')">Thyroid &amp; Parathyroid</button>' +
        '<button class="lab-btn" onclick="window.SIMS.endocrinemaplab.selectGland(\'thymus\')">Thymus</button>' +
        '<button class="lab-btn" onclick="window.SIMS.endocrinemaplab.selectGland(\'adrenal\')">Adrenal Glands</button>' +
        '<button class="lab-btn" onclick="window.SIMS.endocrinemaplab.selectGland(\'pancreas\')">Pancreas (Islets)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.endocrinemaplab.selectGland(\'gonads\')">Gonads (Testis/Ovary)</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function selectGland(g){
    selectedGland = g;
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">HUMAN ENDOCRINE SYSTEM CARTOGRAPHY (NCERT FIG 19.1)</text>';

    // Left Half: Human Anatomical Silhouette
    h += '<rect x="40" y="50" width="360" height="400" rx="10" fill="#1e293b" stroke="#334155"/>';

    // Body Outline
    h += '<path d="M 220 70 C 240 70 250 85 250 105 C 250 125 240 135 220 135 C 200 135 190 125 190 105 C 190 85 200 70 220 70 Z" fill="#334155" stroke="#64748b"/>'; // Head
    h += '<path d="M 190 145 L 140 210 L 160 220 L 195 175 L 195 290 L 170 410 L 195 410 L 215 310 L 225 310 L 245 410 L 270 410 L 245 290 L 245 175 L 280 220 L 300 210 L 250 145 Z" fill="#334155" stroke="#64748b"/>'; // Torso & Limbs

    // Gland Hotspots
    var glandNodes = [
      { id: "pineal", name: "Pineal", x: 228, y: 95, r: 6, c: "#a855f7" },
      { id: "pituitary", name: "Pituitary", x: 215, y: 108, r: 7, c: "#38bdf8" },
      { id: "thyroid", name: "Thyroid & Parathyroid", x: 220, y: 145, r: 8, c: "#10b981" },
      { id: "thymus", name: "Thymus", x: 220, y: 185, r: 8, c: "#34d399" },
      { id: "adrenal", name: "Adrenals", x: 205, y: 245, r: 7, c: "#ef4444" },
      { id: "pancreas", name: "Pancreas", x: 225, y: 255, r: 7, c: "#f59e0b" },
      { id: "gonads", name: "Gonads", x: 220, y: 305, r: 8, c: "#ec4899" }
    ];

    for (var gi = 0; gi < glandNodes.length; gi++) {
      var gn = glandNodes[gi];
      var isSel = (selectedGland === gn.id);
      h += '<circle cx="' + gn.x + '" cy="' + gn.y + '" r="' + (isSel ? gn.r + 4 : gn.r) + '" fill="' + gn.c + '" stroke="#ffffff" stroke-width="' + (isSel ? 2.5 : 1) + '"/>';
      if (isSel) {
        h += '<circle cx="' + gn.x + '" cy="' + gn.y + '" r="' + (gn.r + 10) + '" fill="none" stroke="' + gn.c + '" stroke-width="1.5" stroke-dasharray="3"/>';
      }
    }

    // Right Half: High-Yield Pedagogical Gland Dossier
    h += '<rect x="420" y="50" width="340" height="400" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';

    var profiles = {
      pituitary: {
        title: "Pituitary Gland (Hypophysis)",
        seat: "Sella turcica of sphenoid bone, attached via stalk",
        hormones: "GH, PRL, TSH, ACTH, LH, FSH, MSH (Pars Intermedia), Oxytocin & ADH (Pars Nervosa)",
        target: "Bones, thyroid, adrenal cortex, gonads, mammary glands, kidneys",
        disorders: "Gigantism, Dwarfism, Acromegaly, Diabetes Insipidus",
        c: "#38bdf8"
      },
      pineal: {
        title: "Pineal Gland (Epiphysis)",
        seat: "Dorsal side of forebrain",
        hormones: "Melatonin (Indoleamine derivative)",
        target: "Hypothalamic SCN, melanocytes, gonads, immune cells",
        disorders: "Disruption of 24-hr diurnal sleep-wake cycle, jet lag",
        c: "#a855f7"
      },
      thyroid: {
        title: "Thyroid & Parathyroid Glands",
        seat: "Anterior trachea (Isthmus connected) & 4 dorsal parathyroids",
        hormones: "T4 (Thyroxine), T3, Thyrocalcitonin (TCT), and Parathyroid Hormone (PTH)",
        target: "All somatic metabolizing cells, bones (osteoclasts/osteoblasts), kidneys",
        disorders: "Goitre, Cretinism, Graves' disease (Exophthalmic goitre), Tetany",
        c: "#10b981"
      },
      thymus: {
        title: "Thymus Gland",
        seat: "Between lungs behind sternum on ventral side of aorta",
        hormones: "Thymosins (Peptide hormones)",
        target: "T-lymphocytes (differentiation for CMI) & B-lymphocytes (humoral)",
        disorders: "Immune senescence in elderly due to thymic degeneration",
        c: "#34d399"
      },
      adrenal: {
        title: "Adrenal Glands (Suprarenal)",
        seat: "Superior pole of each kidney; Cortex (outer) + Medulla (inner)",
        hormones: "Medulla: Catecholamines (Adrenaline/Noradrenaline); Cortex: Aldosterone, Cortisol, Androgens",
        target: "Heart, arterioles, liver, distal renal tubules, immune cells",
        disorders: "Addison's disease (cortical failure), Cushing's syndrome",
        c: "#ef4444"
      },
      pancreas: {
        title: "Endocrine Pancreas (Islets)",
        seat: "Loop of duodenum; 1-2 million Islets of Langerhans (1-2% mass)",
        hormones: "Insulin (β-cells) and Glucagon (α-cells)",
        target: "Hepatocytes (liver) and Adipocytes (fat tissue)",
        disorders: "Diabetes Mellitus (hyperglycemia, glycosuria, ketone bodies)",
        c: "#f59e0b"
      },
      gonads: {
        title: "Gonads (Testes & Ovaries)",
        seat: "Testes in scrotum (male); Ovaries in pelvis (female)",
        hormones: "Testosterone (Leydig cells), Estrogen (follicles), Progesterone (corpus luteum)",
        target: "Secondary sexual characteristics, uterus, mammary glands, brain",
        disorders: "Hypogonadism, infertility, amenorrhea, delayed puberty",
        c: "#ec4899"
      }
    };

    var p = profiles[selectedGland] || profiles.pituitary;
    h += '<text x="590" y="85" fill="' + p.c + '" font-size="16" font-weight="700" text-anchor="middle">' + p.title + '</text>';

    var rows = [
      { label: "Anatomical Location:", val: p.seat },
      { label: "Secreted Hormones:", val: p.hormones },
      { label: "Primary Target Tissues:", val: p.target },
      { label: "Clinical Pathologies:", val: p.disorders }
    ];

    for (var ri = 0; ri < rows.length; ri++) {
      var ry = 115 + ri * 80;
      h += '<rect x="435" y="' + ry + '" width="310" height="70" rx="6" fill="#0f172a" stroke="#334155"/>';
      h += '<text x="445" y="' + (ry + 20) + '" fill="#94a3b8" font-size="11" font-weight="700">' + rows[ri].label + '</text>';
      h += '<foreignObject x="445" y="' + (ry + 26) + '" width="290" height="42">';
      h += '<div xmlns="http://www.w3.org/1999/xhtml" style="color:#f8fafc;font-size:11px;line-height:1.3;">' + rows[ri].val + '</div>';
      h += '</foreignObject>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Selected Organ", p.title.split(" ")[0], p.c) +
      cell("Systemic Role", "Primary Endocrine Gland", "#10b981") +
      cell("Chemical Class", "Peptides & Steroids", "#f59e0b") +
      cell("Control Level", "Hypothalamic-Pituitary Axis", "#a855f7")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Anatomical Distribution (NCERT Fig 19.1):</strong> The human endocrine system consists of organized endocrine bodies (pituitary, pineal, thyroid, parathyroid, thymus, adrenal, pancreas, gonads) and diffuse hormone-secreting tissues in the heart (ANF), kidney (erythropoietin), and GI tract (gastrin, secretin, CCK, GIP).' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    selectGland: selectGland,
    setView: selectGland
  };
})();

// -------------------------------------------------------------------------
// 3. SIMULATION 3: Thyroid BMR & Dual Parathyroid-Calcitonin Calcium Engine (thyroidmetabolismsim)
// -------------------------------------------------------------------------
window.SIMS.thyroidmetabolismsim = (function(){
  var labMode = "calcium"; // "calcium", "bmr"
  var bloodCa = 9.8; // 6 to 14 mg/dL (normal 9-11)
  var iodineIntake = 100; // 0 to 200%

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>PTH (Parathyroid - Hypercalcemic)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>TCT (Calcitonin - Hypocalcemic)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Bone Matrix &amp; Renal Tubules</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Thyroid Follicular Cells (T3 / T4)</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" onclick="window.SIMS.thyroidmetabolismsim.setLabMode(\'calcium\')">Calcium Push-Pull (PTH vs TCT)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.thyroidmetabolismsim.setLabMode(\'bmr\')">Thyroid BMR &amp; Iodine Pathology</button>' +
        '<span style="border-left:1px solid var(--border);height:24px;margin:0 4px;"></span>' +
        '<label style="color:#cbd5e1;font-size:12px;">Blood Ca2+: <span id="val-ca" style="color:#38bdf8;font-weight:700;">' + bloodCa.toFixed(1) + ' mg/dL</span></label>' +
        '<input type="range" min="60" max="140" value="' + (bloodCa * 10) + '" oninput="window.SIMS.thyroidmetabolismsim.setCa(this.value / 10)" style="width:100px;">' +
        '<button class="lab-btn" onclick="window.SIMS.thyroidmetabolismsim.reset()">Reset to Normal</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function setLabMode(m){
    labMode = m;
    render(App.state.t || 0);
  }

  function setCa(v){
    bloodCa = parseFloat(v);
    var el = document.getElementById("val-ca");
    if (el) el.textContent = bloodCa.toFixed(1) + " mg/dL";
    render(App.state.t || 0);
  }

  function reset(){
    bloodCa = 9.8;
    iodineIntake = 100;
    var el = document.getElementById("val-ca");
    if (el) el.textContent = "9.8 mg/dL";
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    if (labMode === "calcium") {
      h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">DUAL CALCIUM HOMEOSTASIS: PARATHYROID (PTH) VS CALCITONIN (TCT)</text>';

      // Central Blood Vessel & Calcium Meter
      h += '<rect x="220" y="60" width="360" height="90" rx="12" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>';
      h += '<text x="400" y="85" fill="#c7d2fe" font-size="13" font-weight="700" text-anchor="middle">SYSTEMIC CIRCULATION (BLOOD Ca2+)</text>';

      var caColor = (bloodCa >= 9.0 && bloodCa <= 11.0) ? "#4ade80" : (bloodCa < 9.0 ? "#f43f5e" : "#fbbf24");
      h += '<text x="400" y="125" fill="' + caColor + '" font-size="32" font-weight="800" text-anchor="middle">' + bloodCa.toFixed(1) + ' mg/dL</text>';
      h += '<text x="400" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Target Physiological Range: 9.0 - 11.0 mg/dL</text>';

      // Left Gland: Parathyroid (4 glands)
      var pthActive = (bloodCa < 9.0);
      var ptStroke = pthActive ? "#ef4444" : "#475569";
      h += '<rect x="40" y="190" width="220" height="150" rx="10" fill="#1e293b" stroke="' + ptStroke + '" stroke-width="' + (pthActive ? 3 : 1.5) + '"/>';
      h += '<text x="150" y="215" fill="#f87171" font-size="14" font-weight="700" text-anchor="middle">Parathyroid Glands</text>';
      h += '<circle cx="100" cy="245" r="8" fill="#ef4444"/><circle cx="200" cy="245" r="8" fill="#ef4444"/>';
      h += '<circle cx="100" cy="285" r="8" fill="#ef4444"/><circle cx="200" cy="285" r="8" fill="#ef4444"/>';
      h += '<text x="150" y="320" fill="#fca5a5" font-size="12" font-weight="700" text-anchor="middle">&#8680; Secretes PTH (' + (pthActive ? 'HIGH' : 'Basal') + ')</text>';

      // Right Gland: Thyroid Parafollicular C-cells (TCT)
      var tctActive = (bloodCa > 11.0);
      var tctStroke = tctActive ? "#3b82f6" : "#475569";
      h += '<rect x="540" y="190" width="220" height="150" rx="10" fill="#1e293b" stroke="' + tctStroke + '" stroke-width="' + (tctActive ? 3 : 1.5) + '"/>';
      h += '<text x="650" y="215" fill="#60a5fa" font-size="14" font-weight="700" text-anchor="middle">Thyroid (C-Cells)</text>';
      h += '<path d="M 600 240 C 600 290 640 290 650 260 C 660 290 700 290 700 240 Z" fill="#1e3a8a" stroke="#3b82f6"/>';
      h += '<text x="650" y="320" fill="#93c5fd" font-size="12" font-weight="700" text-anchor="middle">&#8680; Secretes TCT (' + (tctActive ? 'HIGH' : 'Basal') + ')</text>';

      // Bottom Target Organs: Bones, Kidneys, Intestines
      h += '<rect x="40" y="360" width="720" height="100" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>';
      h += '<text x="400" y="382" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">TARGET EFFECTOR ORGANS FOR CALCIUM REGULATION</text>';

      if (pthActive) {
        h += '<text x="150" y="415" fill="#f87171" font-size="12" font-weight="700">&#8226; Bone Resorption (Osteoclasts)</text>';
        h += '<text x="150" y="435" fill="#cbd5e1" font-size="11">Dissolves bone mineral matrix</text>';
        h += '<text x="410" y="415" fill="#f87171" font-size="12" font-weight="700">&#8226; Renal Ca2+ Reabsorption</text>';
        h += '<text x="410" y="435" fill="#cbd5e1" font-size="11">Reduces urinary Ca2+ loss</text>';
        h += '<text x="630" y="415" fill="#f87171" font-size="12" font-weight="700">&#8226; Intestinal Ca2+ Uptake</text>';
        h += '<text x="630" y="435" fill="#cbd5e1" font-size="11">Activates calcitriol / Vit D</text>';
      } else if (tctActive) {
        h += '<text x="400" y="415" fill="#60a5fa" font-size="13" font-weight="700" text-anchor="middle">&#8226; Bone Deposition (Osteoblasts) Activated</text>';
        h += '<text x="400" y="435" fill="#cbd5e1" font-size="11" text-anchor="middle">Excess calcium deposited into skeleton; renal excretion promoted to lower serum Ca2+</text>';
      } else {
        h += '<text x="400" y="420" fill="#4ade80" font-size="14" font-weight="700" text-anchor="middle">&#10004; Physiological Equilibrium: PTH and TCT in Homeostatic Dynamic Balance</text>';
      }

    } else {
      // BMR & Thyroid Pathology Lab
      h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">THYROID AXIS: IODINE NUTRITION, BMR &amp; CLINICAL DISORDERS</text>';

      // Left: Thyroid Anatomical Lobes & Isthmus
      h += '<rect x="40" y="55" width="340" height="395" rx="10" fill="#1e293b" stroke="#334155"/>';
      h += '<text x="210" y="85" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">Thyroid Anatomy (NCERT Fig 19.3)</text>';

      // Trachea with cartilaginous rings
      h += '<rect x="180" y="110" width="60" height="200" fill="#334155" stroke="#64748b"/>';
      for (var tr = 0; tr < 8; tr++) {
        h += '<line x1="180" y1="' + (125 + tr * 22) + '" x2="240" y2="' + (125 + tr * 22) + '" stroke="#94a3b8" stroke-width="2"/>';
      }

      // Two Thyroid Lobes connected by Isthmus
      h += '<path d="M 140 130 C 120 180 120 250 150 280 C 170 270 170 230 180 200 Z" fill="#991b1b" stroke="#f87171" stroke-width="2"/>'; // Left lobe
      h += '<path d="M 280 130 C 300 180 300 250 270 280 C 250 270 250 230 240 200 Z" fill="#991b1b" stroke="#f87171" stroke-width="2"/>'; // Right lobe
      h += '<rect x="180" y="195" width="60" height="20" fill="#b91c1c"/>'; // Isthmus
      h += '<text x="210" y="210" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">Isthmus</text>';

      h += '<text x="210" y="340" fill="#fcd34d" font-size="12" font-weight="700" text-anchor="middle">Follicles synthesize T4 (Thyroxine) &amp; T3</text>';
      h += '<text x="210" y="360" fill="#cbd5e1" font-size="11" text-anchor="middle">Mandatory dietary requirement: Iodine</text>';

      // Right: Pathologies Comparison
      h += '<rect x="410" y="55" width="350" height="395" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';
      h += '<text x="585" y="85" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">Clinical Thyroid Spectrum</text>';

      var conditions = [
        { name: "1. Simple Endemic Goitre", desc: "Dietary iodine deficiency &#8594; low T3/T4 &#8594; elevated TSH &#8594; enlarged neck thyroid gland.", c: "#f59e0b" },
        { name: "2. Congenital Cretinism", desc: "Maternal hypothyroidism in pregnancy &#8594; stunted growth, severe mental retardation, low IQ, deaf-mutism in infant.", c: "#ef4444" },
        { name: "3. Graves' Disease (Exophthalmic)", desc: "Hyperthyroidism form: thyroid enlargement, protrusion of eyeballs (exophthalmos), elevated BMR, rapid weight loss.", c: "#ec4899" },
        { name: "4. Euthyroid Basal Homeostasis", desc: "Normal BMR, active erythropoiesis, regular menstrual cycle, balanced fluid and electrolyte homeostasis.", c: "#4ade80" }
      ];

      for (var ci = 0; ci < conditions.length; ci++) {
        var cy = 110 + ci * 80;
        h += '<rect x="425" y="' + cy + '" width="320" height="70" rx="6" fill="#0f172a" stroke="#334155"/>';
        h += '<text x="435" y="' + (cy + 20) + '" fill="' + conditions[ci].c + '" font-size="12" font-weight="700">' + conditions[ci].name + '</text>';
        h += '<foreignObject x="435" y="' + (cy + 26) + '" width="300" height="42">';
        h += '<div xmlns="http://www.w3.org/1999/xhtml" style="color:#cbd5e1;font-size:11px;line-height:1.3;">' + conditions[ci].desc + '</div>';
        h += '</foreignObject>';
      }
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Subsystem Mode", labMode.toUpperCase(), "#38bdf8") +
      cell("Serum Ca2+", bloodCa.toFixed(1) + " mg/dL", caColor) +
      cell("Active Hormone", bloodCa < 9.0 ? "PTH (Hypercalcemic)" : bloodCa > 11.0 ? "TCT (Hypocalcemic)" : "Balanced", "#f59e0b") +
      cell("Skeletal Effect", bloodCa < 9.0 ? "Bone Resorption" : bloodCa > 11.0 ? "Bone Deposition" : "Dynamic Equilibrium", "#10b981")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Calcium Antagonism Law (NCERT Sec 19.2.5):</strong> Parathyroid Hormone (PTH) is <em>hypercalcemic</em> (dissolves bone, reabsorbs Ca2+ in renal tubules). Thyrocalcitonin (TCT) from thyroid C-cells is <em>hypocalcemic</em> (promotes bone accretion). Together they maintain blood Ca2+ strictly at 9-11 mg/dL.' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setLabMode: setLabMode,
    setCa: setCa,
    reset: reset,
    setView: setLabMode
  };
})();

// -------------------------------------------------------------------------
// 4. SIMULATION 4: Adrenal Gland Dual Tissue & Cortical Tri-Zonal Simulator (adrenalstresssim)
// -------------------------------------------------------------------------
window.SIMS.adrenalstresssim = (function(){
  var regionFocus = "medulla"; // "medulla", "glomerulosa", "fasciculata", "reticularis", "addison"
  var isEmergency = false;

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Adrenal Medulla (Adrenaline / Catecholamines)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Zona Glomerulosa (Aldosterone - Mineralocorticoid)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Zona Fasciculata (Cortisol - Glucocorticoid)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><span>Zona Reticularis (Androgenic Steroids)</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" onclick="window.SIMS.adrenalstresssim.setRegion(\'medulla\')">Medulla (Fight or Flight)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.adrenalstresssim.setRegion(\'glomerulosa\')">Zona Glomerulosa (Aldosterone)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.adrenalstresssim.setRegion(\'fasciculata\')">Zona Fasciculata (Cortisol)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.adrenalstresssim.setRegion(\'reticularis\')">Zona Reticularis (Sex Steroids)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.adrenalstresssim.setRegion(\'addison\')">Addison\'s Disease</button>' +
        '<span style="border-left:1px solid var(--border);height:24px;margin:0 4px;"></span>' +
        '<button class="lab-btn" id="btn-stress" onclick="window.SIMS.adrenalstresssim.toggleStress()">Emergency Stress: ' + (isEmergency ? 'ACTIVE' : 'OFF') + '</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function setRegion(r){
    regionFocus = r;
    render(App.state.t || 0);
  }

  function toggleStress(){
    isEmergency = !isEmergency;
    var btn = document.getElementById("btn-stress");
    if (btn) btn.textContent = "Emergency Stress: " + (isEmergency ? "ACTIVE" : "OFF");
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">ADRENAL GLAND HISTOLOGY &amp; CATECHOLAMINE/STEROID SYSTEM (FIG 19.4)</text>';

    // Left Half: Cutaway Cross-Section of Adrenal Gland
    h += '<rect x="40" y="50" width="370" height="400" rx="10" fill="#1e293b" stroke="#334155"/>';
    h += '<text x="225" y="78" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">Adrenal Gland Transverse Section</text>';

    var cx = 225, cy = 250;

    // Kidney base below adrenal
    h += '<path d="M 120 370 C 120 320 330 320 330 370 L 330 420 L 120 420 Z" fill="#450a0a" stroke="#7f1d1d" stroke-width="2"/>';
    h += '<text x="225" y="390" fill="#fecaca" font-size="12" font-weight="700" text-anchor="middle">Kidney (Renal Upper Pole)</text>';

    // Adrenal Capsule (Outer fibrous shell)
    h += '<path d="M 140 320 C 140 140 310 140 310 320 Z" fill="#334155" stroke="#64748b" stroke-width="2"/>';

    // Zona Glomerulosa (Outer cortex ring)
    var zgColor = (regionFocus === "glomerulosa") ? "#f59e0b" : "#78350f";
    h += '<path d="M 146 320 C 146 150 304 150 304 320 Z" fill="' + zgColor + '" stroke="#fbbf24"/>';

    // Zona Fasciculata (Middle cortex ring - thickest)
    var zfColor = (regionFocus === "fasciculata") ? "#2563eb" : "#1e3a8a";
    h += '<path d="M 160 320 C 160 170 290 170 290 320 Z" fill="' + zfColor + '" stroke="#60a5fa"/>';

    // Zona Reticularis (Inner cortex ring)
    var zrColor = (regionFocus === "reticularis") ? "#9333ea" : "#581c87";
    h += '<path d="M 180 320 C 180 200 270 200 270 320 Z" fill="' + zrColor + '" stroke="#c084fc"/>';

    // Adrenal Medulla (Central core)
    var medColor = (regionFocus === "medulla") ? (isEmergency ? "#ef4444" : "#dc2626") : "#991b1b";
    h += '<path d="M 195 320 C 195 230 255 230 255 320 Z" fill="' + medColor + '" stroke="#fca5a5" stroke-width="2"/>';
    h += '<text x="225" y="280" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">MEDULLA</text>';
    h += '<text x="225" y="295" fill="#fee2e2" font-size="9" text-anchor="middle">Catecholamines</text>';

    // Right Half: Physiological Dossier & Emergency Response Dashboard
    h += '<rect x="430" y="50" width="340" height="400" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';

    var profiles = {
      medulla: {
        title: "Adrenal Medulla (Emergency Hormones)",
        hormones: "Adrenaline (Epinephrine) & Noradrenaline (Norepinephrine)",
        effects: [
          "Pupillary dilation (Mydriasis) & Piloerection",
          "Accelerated heart rate & stroke volume",
          "Bronchodilation to increase O2 delivery",
          "Stimulates Glycogenolysis &#8594; Hyperglycemia",
          "Lipolysis and Proteolysis for rapid fuel mobilization"
        ],
        c: "#ef4444"
      },
      glomerulosa: {
        title: "Zona Glomerulosa (Outer Cortex)",
        hormones: "Mineralocorticoids (chiefly Aldosterone)",
        effects: [
          "Acts on distal renal tubules of nephrons",
          "Stimulates active reabsorption of Na+ & water",
          "Stimulates excretion of K+ and phosphate ions",
          "Maintains extracellular fluid volume & blood pressure",
          "Regulates osmotic pressure and electrolyte balance"
        ],
        c: "#f59e0b"
      },
      fasciculata: {
        title: "Zona Fasciculata (Middle Cortex)",
        hormones: "Glucocorticoids (chiefly Cortisol)",
        effects: [
          "Stimulates gluconeogenesis, lipolysis & proteolysis",
          "Inhibits cellular amino acid uptake & utilization",
          "Produces potent anti-inflammatory reactions",
          "Suppresses immune response (lymphopenia)",
          "Stimulates RBC production (erythropoiesis)"
        ],
        c: "#60a5fa"
      },
      reticularis: {
        title: "Zona Reticularis (Inner Cortex)",
        hormones: "Androgenic Steroids (e.g., DHEA)",
        effects: [
          "Stimulates axial hair growth at puberty",
          "Stimulates pubic and facial hair development",
          "Minor contribution to systemic androgen pool",
          "Converted peripherally into active sex steroids"
        ],
        c: "#c084fc"
      },
      addison: {
        title: "Addison\'s Disease (Cortical Hyposecretion)",
        hormones: "Underproduction of Glucocorticoids & Mineralocorticoids",
        effects: [
          "Severe alteration of carbohydrate metabolism",
          "Acute muscular weakness and profound fatigue",
          "Severe hypotension (low blood pressure) & dehydration",
          "Melanin hyperpigmentation of skin and mucous membranes",
          "Potentially fatal Addisonian adrenal crisis if untreated"
        ],
        c: "#f43f5e"
      }
    };

    var pr = profiles[regionFocus] || profiles.medulla;
    h += '<text x="600" y="82" fill="' + pr.c + '" font-size="15" font-weight="700" text-anchor="middle">' + pr.title + '</text>';
    h += '<text x="600" y="105" fill="#fcd34d" font-size="11" font-weight="600" text-anchor="middle">' + pr.hormones + '</text>';

    for (var ei = 0; ei < pr.effects.length; ei++) {
      var ey = 125 + ei * 55;
      h += '<rect x="445" y="' + ey + '" width="310" height="46" rx="6" fill="#0f172a" stroke="#334155"/>';
      h += '<text x="460" y="' + (ey + 26) + '" fill="#f8fafc" font-size="11">' + pr.effects[ei] + '</text>';
    }

    if (isEmergency) {
      h += '<rect x="445" y="405" width="310" height="35" rx="6" fill="#7f1d1d" stroke="#ef4444"/>';
      h += '<text x="600" y="427" fill="#fee2e2" font-size="12" font-weight="700" text-anchor="middle">&#9889; SYMPATHO-ADRENAL ALARM REACTION ACTIVE</text>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Tissue Zone", pr.title.split(" ")[0], pr.c) +
      cell("Primary Output", regionFocus === "medulla" ? "Catecholamines" : (regionFocus === "glomerulosa" ? "Aldosterone" : "Cortisol"), "#38bdf8") +
      cell("Metabolic Vector", regionFocus === "fasciculata" ? "Gluconeogenesis" : (regionFocus === "glomerulosa" ? "Na+ Retention" : "Glycogenolysis"), "#10b981") +
      cell("Pathology State", regionFocus === "addison" ? "Addison&#39;s Disease" : (isEmergency ? "Alarm Reaction" : "Basal State"), isEmergency ? "#ef4444" : "#f59e0b")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Adrenal Structure (NCERT Sec 19.2.7):</strong> Medulla secretes catecholamines (adrenaline/noradrenaline) for emergency fight-or-flight. Cortex has three concentric layers: Zona glomerulosa (Aldosterone - mineralocorticoid), Zona fasciculata (Cortisol - glucocorticoid), and Zona reticularis (Androgens). Adrenal cortical underproduction leads to Addison&#39;s disease.' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setRegion: setRegion,
    toggleStress: toggleStress,
    setView: setRegion
  };
})();

// -------------------------------------------------------------------------
// 5. SIMULATION 5: Pancreatic Glycemic Dyad & Diabetes Mellitus Lab (pancreasglycemiasim)
// -------------------------------------------------------------------------
window.SIMS.pancreasglycemiasim = (function(){
  var glycemiaMode = "meal"; // "meal", "fasting", "diabetes"
  var glucoseLevel = 90; // mg/dL

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Insulin (Beta-Cells - Hypoglycemic)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Glucagon (Alpha-Cells - Hyperglycemic)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Hepatocyte &amp; Adipocyte Glucose Uptake</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Glycogenesis vs Glycogenolysis</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" onclick="window.SIMS.pancreasglycemiasim.setMode(\'meal\')">Post-Prandial Meal (High Glucose)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.pancreasglycemiasim.setMode(\'fasting\')">Fasting / Exercise (Low Glucose)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.pancreasglycemiasim.setMode(\'diabetes\')">Diabetes Mellitus (Insulin Failure)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.pancreasglycemiasim.reset()">Reset to Basal (90 mg/dL)</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function setMode(m){
    glycemiaMode = m;
    if (m === "meal") glucoseLevel = 160;
    else if (m === "fasting") glucoseLevel = 65;
    else glucoseLevel = 280;
    render(App.state.t || 0);
  }

  function reset(){
    glycemiaMode = "meal";
    glucoseLevel = 90;
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">PANCREATIC ISLET GLYCEMIC REGULATION &amp; DIABETES LAB</text>';

    // Top: Real-Time Blood Glucose Digital Monitor
    h += '<rect x="250" y="45" width="300" height="85" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
    h += '<text x="400" y="70" fill="#94a3b8" font-size="12" font-weight="700" text-anchor="middle">BLOOD GLUCOSE CONCENTRATION</text>';

    var gColor = (glucoseLevel >= 80 && glucoseLevel <= 120) ? "#4ade80" : (glucoseLevel > 120 ? "#ef4444" : "#f59e0b");
    h += '<text x="400" y="110" fill="' + gColor + '" font-size="34" font-weight="800" text-anchor="middle">' + glucoseLevel + ' mg/dL</text>';

    // Left Panel: Pancreatic Islet of Langerhans (Alpha & Beta Cells)
    h += '<rect x="40" y="145" width="340" height="300" rx="10" fill="#1e293b" stroke="#334155"/>';
    h += '<text x="210" y="175" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">Islet of Langerhans (1-2% Pancreatic Mass)</text>';

    // Beta cells (Insulin)
    var betaActive = (glucoseLevel > 110 && glycemiaMode !== "diabetes");
    var betaFill = betaActive ? "#065f46" : "#0f172a";
    var betaStroke = betaActive ? "#34d399" : "#334155";
    h += '<rect x="60" y="195" width="300" height="100" rx="8" fill="' + betaFill + '" stroke="' + betaStroke + '" stroke-width="2"/>';
    h += '<text x="75" y="222" fill="#6ee7b7" font-size="13" font-weight="700">&#946;-Cells (Beta Cells - 70%)</text>';
    h += '<text x="75" y="244" fill="#a7f3d0" font-size="11">&#8680; Secretes INSULIN (Hypoglycemic Peptide)</text>';
    h += '<text x="75" y="264" fill="#cbd5e1" font-size="10">Target: Hepatocytes &amp; Adipocytes &#8594; Glucose Uptake</text>';
    h += '<text x="75" y="280" fill="#cbd5e1" font-size="10">Stimulates Glycogenesis (Glucose &#8594; Glycogen)</text>';

    // Alpha cells (Glucagon)
    var alphaActive = (glucoseLevel < 85);
    var alphaFill = alphaActive ? "#7f1d1d" : "#0f172a";
    var alphaStroke = alphaActive ? "#f87171" : "#334155";
    h += '<rect x="60" y="315" width="300" height="110" rx="8" fill="' + alphaFill + '" stroke="' + alphaStroke + '" stroke-width="2"/>';
    h += '<text x="75" y="342" fill="#fca5a5" font-size="13" font-weight="700">&#945;-Cells (Alpha Cells - 20%)</text>';
    h += '<text x="75" y="364" fill="#fecaca" font-size="11">&#8680; Secretes GLUCAGON (Hyperglycemic Peptide)</text>';
    h += '<text x="75" y="384" fill="#cbd5e1" font-size="10">Target: Hepatocytes &#8594; Glycogenolysis &amp; Gluconeogenesis</text>';
    h += '<text x="75" y="400" fill="#cbd5e1" font-size="10">Reduces Cellular Glucose Uptake</text>';

    // Right Panel: Target Hepatocyte / Adipocyte Response & Pathology
    h += '<rect x="410" y="145" width="350" height="300" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>';
    h += '<text x="585" y="175" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">Metabolic Target Effect &amp; Pathology</text>';

    if (glycemiaMode === "diabetes") {
      // Diabetes Mellitus Dashboard
      h += '<rect x="425" y="195" width="320" height="230" rx="8" fill="#450a0a" stroke="#ef4444" stroke-width="2"/>';
      h += '<text x="585" y="225" fill="#fee2e2" font-size="15" font-weight="800" text-anchor="middle">DIABETES MELLITUS (TYPE 1 / 2)</text>';

      var dFeatures = [
        "1. Severe Hyperglycemia: Blood glucose > 200 mg/dL",
        "2. Glycosuria: Glucose exceeds renal threshold & spills in urine",
        "3. Osmotic Diuresis: Excessive urination (polyuria) & thirst",
        "4. Ketone Bodies: Accelerated lipolysis yields ketoacidosis",
        "5. Clinical Therapy: Successfully treated with insulin therapy"
      ];
      for (var df = 0; df < dFeatures.length; df++) {
        h += '<text x="440" y="' + (255 + df * 30) + '" fill="#fecaca" font-size="11">' + dFeatures[df] + '</text>';
      }

    } else if (glycemiaMode === "meal") {
      // Meal digestion & Insulin response
      h += '<rect x="425" y="195" width="320" height="230" rx="8" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>';
      h += '<text x="585" y="225" fill="#6ee7b7" font-size="14" font-weight="700" text-anchor="middle">POST-PRANDIAL INSULIN CLEARANCE</text>';
      h += '<text x="440" y="255" fill="#dcfce7" font-size="11">&#10004; Beta cells sense elevated blood glucose</text>';
      h += '<text x="440" y="285" fill="#dcfce7" font-size="11">&#10004; Insulin stimulates GLUT4 translocation</text>';
      h += '<text x="440" y="315" fill="#dcfce7" font-size="11">&#10004; Rapid cellular glucose uptake by liver &amp; fat</text>';
      h += '<text x="440" y="345" fill="#dcfce7" font-size="11">&#10004; Promotes Glycogenesis (stored as glycogen)</text>';
      h += '<text x="440" y="375" fill="#dcfce7" font-size="11">&#10004; Glycemia returns smoothly to normal (90 mg/dL)</text>';

    } else {
      // Fasting & Glucagon response
      h += '<rect x="425" y="195" width="320" height="230" rx="8" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>';
      h += '<text x="585" y="225" fill="#fca5a5" font-size="14" font-weight="700" text-anchor="middle">FASTING / EXERCISE GLUCAGON DEFENSE</text>';
      h += '<text x="440" y="255" fill="#fee2e2" font-size="11">&#10004; Alpha cells sense low blood glucose (&lt; 70 mg/dL)</text>';
      h += '<text x="440" y="285" fill="#fee2e2" font-size="11">&#10004; Glucagon acts on hepatocytes</text>';
      h += '<text x="440" y="315" fill="#fee2e2" font-size="11">&#10004; Stimulates Glycogenolysis (glycogen breakdown)</text>';
      h += '<text x="440" y="345" fill="#fee2e2" font-size="11">&#10004; Stimulates Gluconeogenesis (glucose from lactate/AA)</text>';
      h += '<text x="440" y="375" fill="#fee2e2" font-size="11">&#10004; Prevents neuroglycopenic hypoglycemic coma</text>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Glycemic Status", glycemiaMode.toUpperCase(), gColor) +
      cell("Blood Glucose", glucoseLevel + " mg/dL", gColor) +
      cell("Active Hormone", glycemiaMode === "meal" ? "Insulin (Hypoglycemic)" : (glycemiaMode === "fasting" ? "Glucagon (Hyperglycemic)" : "None (Deficient)"), "#38bdf8") +
      cell("Target Process", glycemiaMode === "meal" ? "Glycogenesis & Uptake" : (glycemiaMode === "fasting" ? "Glycogenolysis" : "Ketogenesis"), "#f59e0b")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Glycemic Homeostasis (NCERT Sec 19.2.8):</strong> Glucose homeostasis is maintained by two counter-regulatory hormones: <em>Insulin</em> (from &#946;-cells, increases cellular uptake and glycogenesis &#8594; hypoglycemia) and <em>Glucagon</em> (from &#945;-cells, stimulates glycogenolysis and gluconeogenesis &#8594; hyperglycemia). Insulin deficiency causes diabetes mellitus.' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setMode: setMode,
    reset: reset,
    setView: setMode
  };
})();

// -------------------------------------------------------------------------
// 6. SIMULATION 6: Hormones of Non-Endocrine Tissues: Heart (ANF), Kidney & GI Tract (nonendocrinetissuesim)
// -------------------------------------------------------------------------
window.SIMS.nonendocrinetissuesim = (function(){
  var activeOrgan = "heart"; // "heart", "kidney", "gi"

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Heart (Atrial Wall - ANF)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Kidney (JG Cells - Erythropoietin)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>GI Tract (Gastrin, Secretin, CCK, GIP)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Target Effector Organs</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" onclick="window.SIMS.nonendocrinetissuesim.selectOrgan(\'heart\')">Heart: Atrial Natriuretic Factor (ANF)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.nonendocrinetissuesim.selectOrgan(\'kidney\')">Kidney: Erythropoietin (EPO)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.nonendocrinetissuesim.selectOrgan(\'gi\')">Gastrointestinal Tract (4 Hormones)</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function selectOrgan(o){
    activeOrgan = o;
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">HORMONES OF NON-ENDOCRINE ORGANS: HEART, KIDNEY &amp; GI TRACT (SEC 19.3)</text>';

    if (activeOrgan === "heart") {
      // Atrial Natriuretic Factor Lab
      h += '<rect x="40" y="55" width="720" height="395" rx="10" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>';
      h += '<text x="400" y="88" fill="#f87171" font-size="16" font-weight="700" text-anchor="middle">HEART: ATRIAL WALL &amp; ATRIAL NATRIURETIC FACTOR (ANF)</text>';

      // Heart Schematic
      h += '<circle cx="200" cy="200" r="60" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>';
      h += '<text x="200" y="195" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle">Atrial Wall</text>';
      h += '<text x="200" y="215" fill="#fca5a5" font-size="11" text-anchor="middle">(Stretched by High BP)</text>';

      // Secretion Arrow
      h += '<path d="M 270 200 L 370 200" stroke="#fcd34d" stroke-width="4" stroke-dasharray="4"/>';
      h += '<text x="320" y="188" fill="#fcd34d" font-size="12" font-weight="700" text-anchor="middle">Secretes ANF</text>';

      // Blood vessel dilation
      h += '<rect x="380" y="160" width="340" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      h += '<text x="550" y="190" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">Systemic Blood Vessel Dilation</text>';
      h += '<text x="550" y="215" fill="#4ade80" font-size="13" font-weight="700" text-anchor="middle">&#8680; Blood Pressure DECREASES</text>';

      // Comparison Box with RAAS
      h += '<rect x="80" y="290" width="640" height="130" rx="8" fill="#0f172a" stroke="#334155"/>';
      h += '<text x="400" y="318" fill="#fcd34d" font-size="13" font-weight="700" text-anchor="middle">ANF vs RAAS Physiological Check &amp; Balance:</text>';
      h += '<text x="100" y="350" fill="#cbd5e1" font-size="12">&#8226; When BP is high, stretched atrial myocytes secrete ANF.</text>';
      h += '<text x="100" y="375" fill="#cbd5e1" font-size="12">&#8226; ANF causes vasodilation and natriuresis (urinary Na+ excretion), directly reducing blood pressure.</text>';
      h += '<text x="100" y="400" fill="#cbd5e1" font-size="12">&#8226; ANF acts as a physiological antagonist to the Renin-Angiotensin-Aldosterone System (RAAS).</text>';

    } else if (activeOrgan === "kidney") {
      // Kidney Erythropoietin Lab
      h += '<rect x="40" y="55" width="720" height="395" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>';
      h += '<text x="400" y="88" fill="#60a5fa" font-size="16" font-weight="700" text-anchor="middle">KIDNEY: JUXTAGLOMERULAR CELLS &amp; ERYTHROPOIETIN (EPO)</text>';

      // Kidney
      h += '<ellipse cx="180" cy="200" rx="55" ry="75" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>';
      h += '<text x="180" y="195" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle">Kidney JG Cells</text>';
      h += '<text x="180" y="215" fill="#bfdbfe" font-size="11" text-anchor="middle">(Senses Hypoxia)</text>';

      // Arrow
      h += '<path d="M 245 200 L 370 200" stroke="#fcd34d" stroke-width="4" stroke-dasharray="4"/>';
      h += '<text x="310" y="188" fill="#fcd34d" font-size="12" font-weight="700" text-anchor="middle">Erythropoietin</text>';

      // Bone Marrow Target
      h += '<rect x="380" y="160" width="340" height="80" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>';
      h += '<text x="550" y="190" fill="#f87171" font-size="14" font-weight="700" text-anchor="middle">Bone Marrow Erythropoiesis</text>';
      h += '<text x="550" y="215" fill="#4ade80" font-size="13" font-weight="700" text-anchor="middle">&#8680; Accelerates Red Blood Cell (RBC) Production</text>';

      h += '<rect x="80" y="290" width="640" height="130" rx="8" fill="#0f172a" stroke="#334155"/>';
      h += '<text x="400" y="318" fill="#fcd34d" font-size="13" font-weight="700" text-anchor="middle">Erythropoietin Clinical &amp; Altitude Adaptation:</text>';
      h += '<text x="100" y="350" fill="#cbd5e1" font-size="12">&#8226; Juxtaglomerular (JG) cells produce the peptide hormone erythropoietin in response to tissue hypoxia.</text>';
      h += '<text x="100" y="375" fill="#cbd5e1" font-size="12">&#8226; Stimulates committed proerythroblasts in red bone marrow to proliferate and mature into erythrocytes.</text>';
      h += '<text x="100" y="400" fill="#cbd5e1" font-size="12">&#8226; High-altitude acclimatization stimulates an endogenous EPO surge to increase oxygen carrying capacity.</text>';

    } else {
      // GI Tract Hormones (Gastrin, Secretin, CCK, GIP)
      h += '<rect x="40" y="55" width="720" height="395" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>';
      h += '<text x="400" y="85" fill="#34d399" font-size="16" font-weight="700" text-anchor="middle">GASTROINTESTINAL TRACT PEPTIDE HORMONES (THE GI TETRAD)</text>';

      var giList = [
        { name: "1. Gastrin", origin: "Gastric mucosa", target: "Gastric glands", eff: "Stimulates secretion of Hydrochloric Acid (HCl) & Pepsinogen", c: "#f59e0b" },
        { name: "2. Secretin", origin: "Duodenal mucosa", target: "Exocrine pancreas", eff: "Stimulates secretion of Water & Bicarbonate ions (HCO3-)", c: "#38bdf8" },
        { name: "3. Cholecystokinin (CCK)", origin: "Duodenal mucosa", target: "Pancreas & Gall bladder", eff: "Stimulates secretion of Pancreatic Enzymes & Bile juice ejection", c: "#ef4444" },
        { name: "4. Gastric Inhibitory Peptide (GIP)", origin: "Duodenum / Jejunum", target: "Gastric glands & muscle", eff: "Inhibits gastric acid secretion and slows gastric motility", c: "#a855f7" }
      ];

      for (var gi2 = 0; gi2 < giList.length; gi2++) {
        var gy2 = 110 + gi2 * 75;
        h += '<rect x="60" y="' + gy2 + '" width="680" height="65" rx="8" fill="#0f172a" stroke="#334155"/>';
        h += '<text x="80" y="' + (gy2 + 24) + '" fill="' + giList[gi2].c + '" font-size="13" font-weight="700">' + giList[gi2].name + '</text>';
        h += '<text x="80" y="' + (gy2 + 45) + '" fill="#94a3b8" font-size="11">Target: ' + giList[gi2].target + '</text>';
        h += '<text x="320" y="' + (gy2 + 35) + '" fill="#f8fafc" font-size="12" font-weight="600">&#8680; ' + giList[gi2].eff + '</text>';
      }

      h += '<text x="400" y="430" fill="#94a3b8" font-size="11" text-anchor="middle">Growth Factors: Several non-endocrine tissues secrete peptide growth factors essential for tissue repair and regeneration.</text>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Focused Non-Endocrine Organ", activeOrgan.toUpperCase(), "#38bdf8") +
      cell("Hormone Output", activeOrgan === "heart" ? "ANF (Natriuretic)" : (activeOrgan === "kidney" ? "Erythropoietin (EPO)" : "GI Tetrad (4 Hormones)"), "#f59e0b") +
      cell("Physiological Action", activeOrgan === "heart" ? "Decreases Blood Pressure" : (activeOrgan === "kidney" ? "Erythropoiesis (RBCs)" : "Digestive Secretions"), "#10b981") +
      cell("Chemical Class", "Peptides (Trace amounts)", "#a855f7")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Non-Endocrine Hormone Law (NCERT Sec 19.3):</strong> ANF from atrial wall lowers BP via vasodilation. Erythropoietin from kidney JG cells stimulates bone marrow RBC production. The GI tract secretes Gastrin (HCl/pepsinogen), Secretin (water/bicarbonate), CCK (pancreatic enzymes + bile ejection), and GIP (gastric inhibition).' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    selectOrgan: selectOrgan,
    setView: selectOrgan
  };
})();

// -------------------------------------------------------------------------
// 7. SIMULATION 7: Molecular Mechanisms of Hormone Action: Membrane vs Intracellular Receptors (hormonereceptorsim)
// -------------------------------------------------------------------------
window.SIMS.hormonereceptorsim = (function(){
  var mechMode = "membrane"; // "membrane" (Peptide/FSH) or "intracellular" (Steroid/Estrogen)

  function mount(){
    App.state.maxT = 4;
    var legend = document.getElementById("lab-legend");
    if (legend) {
      legend.innerHTML =
        '<div class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span><span>Hormone Ligand (Peptide vs Steroid)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span><span>Receptor (Membrane-bound vs Nuclear)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Second Messengers (cAMP / IP3 / Ca2+)</span></div>' +
        '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Genomic Transcription &amp; Protein Synthesis</span></div>';
    }
    var ctrl = document.getElementById("lab-controls");
    if (ctrl) {
      ctrl.innerHTML =
        '<div class="control-row" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">' +
        '<button class="lab-btn" onclick="window.SIMS.hormonereceptorsim.setMech(\'membrane\')">Peptide Hormone (e.g., FSH / Epinephrine - Second Messenger)</button>' +
        '<button class="lab-btn" onclick="window.SIMS.hormonereceptorsim.setMech(\'intracellular\')">Steroid Hormone (e.g., Estrogen - Nuclear Gene Expression)</button>' +
        '</div>';
    }
    render(App.state.t || 0);
  }

  function setMech(m){
    mechMode = m;
    render(App.state.t || 0);
  }

  function render(t){
    var cvs = document.getElementById("sim-canvas");
    if (!cvs) return;

    var h = '<svg viewBox="0 0 800 480" width="100%" height="100%" style="background:#0f172a;font-family:system-ui,sans-serif;">';

    h += '<text x="400" y="28" fill="#f8fafc" font-size="17" font-weight="700" text-anchor="middle">MOLECULAR MECHANISM OF HORMONE ACTION (NCERT FIG 19.5)</text>';

    if (mechMode === "membrane") {
      // Membrane-bound Receptor Mechanism (Peptide Hormone / FSH)
      h += '<rect x="40" y="50" width="720" height="400" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>';
      h += '<text x="400" y="80" fill="#38bdf8" font-size="15" font-weight="700" text-anchor="middle">(a) PROTEIN HORMONE (e.g. FSH) VIA MEMBRANE-BOUND RECEPTOR &amp; SECOND MESSENGER</text>';

      // Extracellular Fluid Zone
      h += '<text x="80" y="115" fill="#94a3b8" font-size="12" font-weight="700">EXTRACELLULAR FLUID</text>';

      // Hormone (FSH)
      h += '<circle cx="160" cy="110" r="12" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>';
      h += '<text x="160" y="114" fill="#ffffff" font-size="9" font-weight="700" text-anchor="middle">FSH</text>';
      h += '<text x="160" y="135" fill="#fca5a5" font-size="10" text-anchor="middle">Peptide Hormone</text>';

      // Plasma Membrane Bilayer
      h += '<rect x="60" y="150" width="680" height="30" rx="4" fill="#334155" stroke="#64748b"/>';
      h += '<text x="690" y="170" fill="#cbd5e1" font-size="10" text-anchor="end">Ovarian Target Cell Membrane</text>';

      // Membrane-Bound Receptor
      h += '<rect x="230" y="140" width="35" height="50" rx="6" fill="#2563eb" stroke="#93c5fd" stroke-width="2"/>';
      h += '<text x="247" y="210" fill="#93c5fd" font-size="10" font-weight="700" text-anchor="middle">FSH Receptor</text>';

      // G-protein / Adenylyl Cyclase
      h += '<rect x="300" y="145" width="40" height="40" rx="6" fill="#059669" stroke="#34d399"/>';
      h += '<text x="320" y="205" fill="#34d399" font-size="9" font-weight="700" text-anchor="middle">Adenylyl Cyclase</text>';

      // Step 1: Hormone-Receptor Complex
      h += '<path d="M 180 120 L 230 150" stroke="#fcd34d" stroke-width="3" stroke-dasharray="3"/>';
      h += '<text x="210" y="130" fill="#fcd34d" font-size="11" font-weight="700">Step 1: Binding</text>';

      // Step 2: Generation of Second Messenger
      h += '<path d="M 320 190 L 320 250" stroke="#f59e0b" stroke-width="3"/>';
      h += '<rect x="250" y="250" width="140" height="50" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>';
      h += '<text x="320" y="270" fill="#fcd34d" font-size="12" font-weight="700" text-anchor="middle">Second Messenger</text>';
      h += '<text x="320" y="288" fill="#ffffff" font-size="11" text-anchor="middle">(cyclic AMP / Ca2+ / IP3)</text>';

      // Step 3: Biochemical Responses
      h += '<path d="M 390 275 L 480 275" stroke="#10b981" stroke-width="3"/>';
      h += '<rect x="480" y="245" width="230" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>';
      h += '<text x="595" y="268" fill="#4ade80" font-size="12" font-weight="700" text-anchor="middle">Biochemical Responses</text>';
      h += '<text x="595" y="290" fill="#cbd5e1" font-size="10" text-anchor="middle">Enzyme Activation / Protein Kinase Cascade</text>';

      // Step 4: Physiological Responses
      h += '<path d="M 595 310 L 595 360" stroke="#a855f7" stroke-width="3"/>';
      h += '<rect x="460" y="360" width="270" height="60" rx="8" fill="#1e1b4b" stroke="#a855f7" stroke-width="2"/>';
      h += '<text x="595" y="385" fill="#c084fc" font-size="13" font-weight="700" text-anchor="middle">Physiological Response</text>';
      h += '<text x="595" y="405" fill="#ffffff" font-size="11" text-anchor="middle">Ovarian Growth &amp; Follicular Maturation</text>';

      h += '<text x="180" y="420" fill="#94a3b8" font-size="11">&#8226; Water-soluble hormone does NOT enter target cell.</text>';

    } else {
      // Intracellular Nuclear Receptor Mechanism (Steroid Hormone / Estrogen)
      h += '<rect x="40" y="50" width="720" height="400" rx="10" fill="#1e293b" stroke="#ec4899" stroke-width="2"/>';
      h += '<text x="400" y="80" fill="#f472b6" font-size="15" font-weight="700" text-anchor="middle">(b) STEROID HORMONE (e.g. ESTROGEN) VIA INTRACELLULAR RECEPTOR &amp; GENE EXPRESSION</text>';

      // Lipid Bilayer
      h += '<rect x="60" y="140" width="680" height="25" rx="4" fill="#334155" stroke="#64748b"/>';
      h += '<text x="690" y="157" fill="#cbd5e1" font-size="10" text-anchor="end">Target Uterine Cell Membrane</text>';

      // Steroid Hormone (Estrogen) diffusing freely across membrane
      h += '<circle cx="160" cy="110" r="12" fill="#ec4899" stroke="#fbcfe8" stroke-width="2"/>';
      h += '<text x="160" y="114" fill="#ffffff" font-size="9" font-weight="700" text-anchor="middle">E2</text>';
      h += '<text x="160" y="132" fill="#fbcfe8" font-size="10" text-anchor="middle">Estrogen (Lipophilic)</text>';

      // Arrow passing freely through bilayer
      h += '<path d="M 160 125 L 160 200" stroke="#f472b6" stroke-width="3" stroke-dasharray="3"/>';
      h += '<text x="175" y="180" fill="#fbcfe8" font-size="10">Lipid-soluble diffusion</text>';

      // Nucleus Boundary
      h += '<rect x="300" y="200" width="420" height="220" rx="12" fill="#0f172a" stroke="#818cf8" stroke-width="2"/>';
      h += '<text x="510" y="225" fill="#818cf8" font-size="13" font-weight="700" text-anchor="middle">NUCLEUS (Target Genome)</text>';

      // Intracellular Nuclear Receptor & Complex
      h += '<rect x="330" y="260" width="35" height="45" rx="6" fill="#7c3aed" stroke="#c084fc" stroke-width="2"/>';
      h += '<circle cx="347" cy="270" r="7" fill="#ec4899"/>'; // Bound hormone
      h += '<text x="347" y="325" fill="#c084fc" font-size="9" font-weight="700" text-anchor="middle">H-R Complex</text>';

      // Genomic DNA Helix & Transcription
      h += '<path d="M 430 290 Q 460 270 490 290 T 550 290 T 610 290" fill="none" stroke="#38bdf8" stroke-width="4"/>';
      h += '<text x="520" y="275" fill="#38bdf8" font-size="11" font-weight="700">Genomic DNA (HRE)</text>';

      // mRNA transcript
      h += '<path d="M 480 320 L 580 320" stroke="#4ade80" stroke-width="3" stroke-dasharray="2"/>';
      h += '<text x="530" y="340" fill="#4ade80" font-size="11" font-weight="700">mRNA Synthesis (Transcription)</text>';

      // Translation to Protein
      h += '<rect x="440" y="360" width="180" height="40" rx="6" fill="#1e1b4b" stroke="#34d399"/>';
      h += '<text x="530" y="385" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">Proteins / Uterine Tissue Growth</text>';

      h += '<text x="140" y="380" fill="#cbd5e1" font-size="11">&#8226; Directly alters gene expression</text>';
      h += '<text x="140" y="400" fill="#cbd5e1" font-size="11">&#8226; Long-term developmental changes</text>';
    }

    h += '</svg>';
    cvs.innerHTML = h;

    readout(
      cell("Hormone Mechanism", mechMode.toUpperCase(), mechMode === "membrane" ? "#38bdf8" : "#ec4899") +
      cell("Receptor Location", mechMode === "membrane" ? "Membrane-Bound" : "Intracellular Nuclear", "#f59e0b") +
      cell("Signal Relay", mechMode === "membrane" ? "Second Messengers (cAMP)" : "Genomic Transcription (mRNA)", "#10b981") +
      cell("Response Onset", mechMode === "membrane" ? "Rapid (Minutes)" : "Delayed / Sustained (Hours/Days)", "#a855f7")
    );

    verdict(
      '<div style="font-size:13px;line-height:1.5;color:var(--text);">' +
      '<strong>Dual Hormone Action Principle (NCERT Sec 19.4):</strong> Water-soluble peptide hormones and catecholamines bind surface membrane receptors, generating second messengers (cAMP, IP3, Ca2+) for rapid enzyme modulation. Lipid-soluble steroids and thyroid hormones diffuse directly to intracellular nuclear receptors, regulating gene expression and chromosome function.' +
      '</div>'
    );
  }

  return {
    mount: mount,
    render: render,
    draw: render,
    setMech: setMech,
    setView: setMech
  };
})();
