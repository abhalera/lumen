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
// 1. Body Plans & Coelom Explorer (bodyplanexplorer)
// §4.1 (pp. 37-40): three symmetries + three coelom states.
// -------------------------------------------------------------------------
window.SIMS.bodyplanexplorer = (function(){
  var coelType = "acoelomate"; // "acoelomate", "pseudocoelomate", "coelomate"
  var symType = "bilateral"; // "asymmetric", "radial", "bilateral"

  function setCoel(t){
    coelType = t;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Ectoderm (Outer)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Mesoderm (Middle)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Endoderm (Inner Gut)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-acoe">Acoelomate (Flatworm)</button>' +
      '<button class="preset-btn" id="p-pseudo">Pseudocoelomate (Roundworm)</button>' +
      '<button class="preset-btn" id="p-eu">Coelomate (Earthworm)</button>';

    document.getElementById("p-acoe").onclick = function(){ setActivePreset(this); setCoel("acoelomate"); };
    document.getElementById("p-pseudo").onclick = function(){ setActivePreset(this); setCoel("pseudocoelomate"); };
    document.getElementById("p-eu").onclick = function(){ setActivePreset(this); setCoel("coelomate"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Symmetry (§4.1.2):</label>' +
        '<select id="sym-select" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;">' +
          '<option value="asymmetric">Asymmetric (Sponges)</option>' +
          '<option value="radial">Radial (Cnidaria, Adult Echinoderm)</option>' +
          '<option value="bilateral" selected>Bilateral (Platyhelminthes → Chordata)</option>' +
        '</select>' +
      '</div>' +
      '<div class="control-group" style="grid-column:span 1;">' +
        '<label>Coelom (§4.1.5): <b style="color:#38bdf8;">very important in classification</b></label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Left: symmetry. Right: body cavity between body wall and gut wall.</div>' +
      '</div>';

    document.getElementById("sym-select").onchange = function(e){
      symType = e.target.value;
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="700" height="320" fill="#09131d"/>';

    // LEFT: Symmetry display
    m += '<rect x="20" y="20" width="320" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="40" y="48" fill="#f8fafc" font-size="14" font-weight="700">Body Symmetry</text>';

    if(symType === "bilateral"){
      m += '<ellipse cx="180" cy="160" rx="80" ry="100" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>';
      m += '<line x1="180" y1="55" x2="180" y2="265" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 4"/>';
      m += '<circle cx="150" cy="120" r="10" fill="#38bdf8"/>';
      m += '<circle cx="210" cy="120" r="10" fill="#38bdf8"/>';
      m += '<text x="180" y="285" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">One plane: left + right halves</text>';
    } else if(symType === "radial"){
      m += '<circle cx="180" cy="160" r="70" fill="#0f172a" stroke="#10b981" stroke-width="2"/>';
      for(var a = 0; a < 6; a++){
        var ang = (a / 6) * Math.PI * 2;
        m += '<line x1="180" y1="160" x2="' + (180 + Math.cos(ang) * 70) + '" y2="' + (160 + Math.sin(ang) * 70) + '" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 3"/>';
      }
      m += '<circle cx="180" cy="160" r="12" fill="#10b981"/>';
      m += '<text x="180" y="285" fill="#10b981" font-size="12" font-weight="700" text-anchor="middle">Any central plane halves it</text>';
    } else {
      m += '<path d="M 120,220 Q 100,140 170,110 Q 250,90 260,160 Q 265,230 180,250 Z" fill="#0f172a" stroke="#ec4899" stroke-width="2"/>';
      m += '<line x1="100" y1="60" x2="260" y2="260" stroke="#ef4444" stroke-width="2"/>';
      m += '<text x="180" y="285" fill="#ec4899" font-size="12" font-weight="700" text-anchor="middle">No dividing plane (sponges)</text>';
    }

    // RIGHT: Coelom cross-sections
    m += '<rect x="360" y="20" width="320" height="280" rx="8" fill="#0b1726" stroke="#1e293b" stroke-width="1.5"/>';
    m += '<text x="380" y="48" fill="#f8fafc" font-size="14" font-weight="700">Body Cavity (Coelom)</text>';

    var cx = 520, cy = 150;

    if(coelType === "acoelomate"){
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="75" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="60" fill="#78350f"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="20" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#fff" font-size="10" text-anchor="middle">Gut</text>';
      m += '<text x="' + cx + '" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">No cavity: Platyhelminthes</text>';
      m += '<text x="' + cx + '" y="268" fill="#64748b" font-size="10" text-anchor="middle">Solid between wall and gut</text>';
    } else if(coelType === "pseudocoelomate"){
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="75" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="58" fill="#451a03"/>';
      // Scattered pouches
      for(var p = 0; p < 8; p++){
        var pa = (p / 8) * Math.PI * 2;
        m += '<circle cx="' + (cx + Math.cos(pa) * 42) + '" cy="' + (cy + Math.sin(pa) * 42) + '" r="8" fill="#f59e0b"/>';
      }
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="20" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#fff" font-size="10" text-anchor="middle">Gut</text>';
      m += '<text x="' + cx + '" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">Scattered pouches: Aschelminthes</text>';
      m += '<text x="' + cx + '" y="268" fill="#64748b" font-size="10" text-anchor="middle">Mesoderm not a full lining</text>';
    } else {
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="75" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="58" fill="#052e2b"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="50" fill="none" stroke="#f59e0b" stroke-width="3"/>';
      m += '<circle cx="' + cx + '" cy="' + cy + '" r="20" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="' + cx + '" y="' + (cy + 4) + '" fill="#fff" font-size="10" text-anchor="middle">Gut</text>';
      m += '<text x="' + cx + '" y="250" fill="#94a3b8" font-size="11" text-anchor="middle">Mesoderm-lined: Annelida to Chordata</text>';
      m += '<text x="' + cx + '" y="268" fill="#64748b" font-size="10" text-anchor="middle">Annelids, molluscs, arthropods + more</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Symmetry", symType.toUpperCase(), "#38bdf8") +
      cell("Coelom State", coelType === "acoelomate" ? "ABSENT" : (coelType === "pseudocoelomate" ? "POUCHES" : "MESODERM-LINED"), "#10b981") +
      cell("Example Phylum", coelType === "acoelomate" ? "Platyhelminthes" : (coelType === "pseudocoelomate" ? "Aschelminthes" : "Annelida → Chordata"), "#f59e0b") +
      cell("Germ Layers", "Triploblastic", "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">§4.1 Body Plan:</span> ' +
      (coelType === "acoelomate" ? "Acoelomates have no body cavity between wall and gut (flatworms)." :
       (coelType === "pseudocoelomate" ? "Pseudocoelomates carry mesoderm as scattered pouches between wall and gut (roundworms)." :
        "Coelomates line the cavity with mesoderm — annelids, molluscs, arthropods, echinoderms, hemichordates, chordates."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 2. Sponge Canal System Explorer (poriferacanal)
// §4.2.1 (pp. 40-41). Water route + collar cells + spicules/spongin +
// hermaphrodite reproduction, all as printed.
// -------------------------------------------------------------------------
window.SIMS.poriferacanal = (function(){
  var pView = "choanocyte"; // "choanocyte", "spicule"
  var flowRate = 2;

  function setV(v){
    pView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Ostia → Spongocoel → Osculum</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Choanocytes (Collar Cells)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#94a3b8;"></span><span>Spicules / Spongin</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-cho">Choanocyte Chambers</button>' +
      '<button class="preset-btn" id="p-spi">Spicules &amp; Spongin Skeleton</button>';

    document.getElementById("p-cho").onclick = function(){ setActivePreset(this); setV("choanocyte"); };
    document.getElementById("p-spi").onclick = function(){ setActivePreset(this); setV("spicule"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group">' +
        '<label>Water flow (illustrative): <b id="flow-val" style="color:#38bdf8;">2x</b></label>' +
        '<input type="range" id="flow-slider" min="1" max="5" value="2" step="1">' +
      '</div>' +
      '<div class="control-group">' +
        '<label>Porifera (§4.2.1)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cellular grade · Intracellular digestion · Hermaphrodite.</div>' +
      '</div>';

    document.getElementById("flow-slider").oninput = function(e){
      flowRate = parseInt(e.target.value, 10);
      var fv = document.getElementById("flow-val"); if(fv) fv.textContent = flowRate + "x";
      draw(0);
    };

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    // Sponge vase body
    if(pView === "choanocyte"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Canal System: Ostia → Spongocoel → Osculum</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Food gathering · Respiratory exchange · Removal of wastes</text>';

      // Vase walls with ostia pores
      m += '<path d="M 180,220 L 200,110 L 320,110 L 340,220 Z" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2.5"/>';
      // Ostia pores
      for(var o = 0; o < 10; o++){
        var oy = 130 + o * 9;
        m += '<circle cx="192" cy="' + oy + '" r="2.5" fill="#bae6fd"/>';
        m += '<circle cx="328" cy="' + oy + '" r="2.5" fill="#bae6fd"/>';
      }
      m += '<text x="140" y="165" fill="#bae6fd" font-size="10">Ostia (pores)</text>';

      // Central spongocoel
      m += '<rect x="245" y="110" width="30" height="110" fill="#082f49"/>';
      m += '<text x="260" y="240" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Spongocoel</text>';

      // Osculum exit with animated flow
      m += '<rect x="230" y="80" width="60" height="30" fill="#082f49" stroke="#38bdf8" stroke-width="2"/>';
      m += '<text x="260" y="70" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">Osculum</text>';
      var animT = (t * flowRate * 0.5) % 1;
      m += '<line x1="260" y1="' + (75 - animT * 20) + '" x2="260" y2="' + (60 - animT * 20) + '" stroke="#7dd3fc" stroke-width="3"/>';

      // Choanocyte callout
      m += '<text x="440" y="130" fill="#f59e0b" font-size="13" font-weight="700">Choanocytes (collar cells):</text>';
      m += '<text x="440" y="152" fill="#cbd5e1" font-size="11">• Line the spongocoel</text>';
      m += '<text x="440" y="172" fill="#cbd5e1" font-size="11">• Line the canals</text>';
      m += '<text x="440" y="192" fill="#cbd5e1" font-size="11">• Digestion intracellular</text>';
      m += '<text x="440" y="212" fill="#cbd5e1" font-size="11">• Sycon, Spongilla, Euspongia</text>';

    } else {
      // Spicule & spongin skeleton view
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#94a3b8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#e2e8f0" font-size="15" font-weight="700">Skeleton: Spicules or Spongin Fibres</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Body supported by minute spicules or spongin fibres · Sexes hermaphrodite</text>';

      // Spicule shapes
      m += '<line x1="150" y1="200" x2="150" y2="120" stroke="#cbd5e1" stroke-width="3"/>';
      m += '<text x="150" y="225" fill="#cbd5e1" font-size="10" text-anchor="middle">Spicule</text>';

      m += '<line x1="230" y1="200" x2="230" y2="120" stroke="#cbd5e1" stroke-width="3"/>';
      m += '<line x1="200" y1="160" x2="260" y2="160" stroke="#cbd5e1" stroke-width="3"/>';
      m += '<text x="230" y="225" fill="#cbd5e1" font-size="10" text-anchor="middle">Spicule</text>';

      // Spongin fibres
      for(var f = 0; f < 5; f++){
        var fy = 130 + f * 16;
        m += '<path d="M 330,' + fy + ' Q 370,' + (fy - 8) + ' 410,' + fy + '" fill="none" stroke="#f59e0b" stroke-width="2.5"/>';
      }
      m += '<text x="370" y="225" fill="#f59e0b" font-size="10" text-anchor="middle">Spongin fibres (Euspongia)</text>';

      // Right callout
      m += '<text x="460" y="130" fill="#e2e8f0" font-size="13" font-weight="700">Poriferan Reproduction:</text>';
      m += '<text x="460" y="152" fill="#cbd5e1" font-size="11">• Hermaphrodite (same individual)</text>';
      m += '<text x="460" y="172" fill="#cbd5e1" font-size="11">• Fragmentation</text>';
      m += '<text x="460" y="192" fill="#cbd5e1" font-size="11">• Internal fertilisation</text>';
      m += '<text x="460" y="212" fill="#cbd5e1" font-size="11">• Indirect (distinct larva)</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Phylum", "PORIFERA", "#38bdf8") +
      cell("Water Route", "Ostia → Osculum", "#10b981") +
      cell("Digestion", "Intracellular", "#f59e0b") +
      cell("Skeleton", pView === "choanocyte" ? "Spicules / Spongin" : "Spicules / Spongin", "#a855f7")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Poriferan Canal System:</span> ' +
      'Water enters minute ostia, flows through the spongocoel lined with choanocytes, and exits the osculum — gathering food, exchanging gases and removing wastes.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 3. Worm Bodies Comparator (coelomclassifier)
// §4.2.4-4.2.6: flatworm (acoelomate), roundworm (pseudocoelomate),
// earthworm (segmented coelomate). Only printed organs named.
// -------------------------------------------------------------------------
window.SIMS.coelomclassifier = (function(){
  var wType = "flatworm"; // "flatworm", "roundworm", "earthworm"

  function setW(w){
    wType = w;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f43f5e;"></span><span>Acoelomate (Platyhelminthes)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Pseudocoelomate (Aschelminthes)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Coelomate (Annelida)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-pla">Flatworm (Taenia / Planaria)</button>' +
      '<button class="preset-btn" id="p-asc">Roundworm (Ascaris)</button>' +
      '<button class="preset-btn" id="p-ann">Earthworm (Metameric + Closed)</button>';

    document.getElementById("p-pla").onclick = function(){ setActivePreset(this); setW("flatworm"); };
    document.getElementById("p-asc").onclick = function(){ setActivePreset(this); setW("roundworm"); };
    document.getElementById("p-ann").onclick = function(){ setActivePreset(this); setW("earthworm"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Worm body plans (§4.2.4–4.2.6)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Cavity, gut, sexes and excretion compared across the three worm phyla.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(wType === "flatworm"){
      // Flatworm: flattened, acoelomate
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f43f5e" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f43f5e" font-size="15" font-weight="700">Platyhelminthes: Flattened &amp; Acoelomate</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Endoparasites (Taenia, Fasciola) · Hooks and suckers · Flame cells</text>';

      // Flat ribbon cross-section
      m += '<rect x="120" y="140" width="220" height="45" rx="22" fill="#881337" stroke="#f43f5e" stroke-width="2.5"/>';
      m += '<rect x="150" y="152" width="160" height="21" rx="10" fill="#450a0a"/>';
      m += '<text x="230" y="168" fill="#fecdd3" font-size="10" text-anchor="middle">No cavity</text>';
      m += '<text x="230" y="215" fill="#fda4af" font-size="11" font-weight="700" text-anchor="middle">Dorso-ventrally Flattened</text>';

      // Right callouts
      m += '<text x="420" y="120" fill="#f43f5e" font-size="13" font-weight="700">Flatworm Hallmarks:</text>';
      m += '<text x="420" y="142" fill="#cbd5e1" font-size="11">• Bilateral, triploblastic, acoelomate</text>';
      m += '<text x="420" y="162" fill="#cbd5e1" font-size="11">• Flame cells: osmo + excretion</text>';
      m += '<text x="420" y="182" fill="#cbd5e1" font-size="11">• Sexes not separate; internal fert.</text>';
      m += '<text x="420" y="202" fill="#cbd5e1" font-size="11">• Many larval stages; Planaria regrows</text>';

    } else if(wType === "roundworm"){
      // Roundworm: round, pseudocoelomate, complete gut
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Aschelminthes: Round, Pseudocoelomate, Complete Gut</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Circular cross-section · Muscular pharynx · Excretory tube + pore · Separate sexes</text>';

      // Round cross-section with unlined cavity
      m += '<circle cx="230" cy="160" r="55" fill="#451a03" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<circle cx="230" cy="160" r="38" fill="#1c0a00"/>';
      m += '<circle cx="230" cy="160" r="14" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>';
      m += '<text x="230" y="164" fill="#fef3c7" font-size="9" text-anchor="middle">Gut</text>';
      m += '<text x="230" y="235" fill="#fcd34d" font-size="11" font-weight="700" text-anchor="middle">Circular + Complete Gut</text>';

      // Right callouts
      m += '<text x="420" y="120" fill="#f59e0b" font-size="13" font-weight="700">Roundworm Hallmarks:</text>';
      m += '<text x="420" y="142" fill="#cbd5e1" font-size="11">• Pseudocoelom: scattered pouches</text>';
      m += '<text x="420" y="162" fill="#cbd5e1" font-size="11">• Complete gut, muscular pharynx</text>';
      m += '<text x="420" y="182" fill="#cbd5e1" font-size="11">• Females often longer than males</text>';
      m += '<text x="420" y="202" fill="#cbd5e1" font-size="11">• Ascaris, Wuchereria, Ancylostoma</text>';

    } else {
      // Earthworm: segmented, coelomate, closed circulation
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Annelida: Metameric Segments + Closed Circulation</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Metameres · True coelom · Nephridia · Paired ganglia + double nerve cord</text>';

      // Segmented body
      for(var s = 0; s < 8; s++){
        var sx = 110 + s * 30;
        m += '<rect x="' + sx + '" y="140" width="28" height="45" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>';
      }
      m += '<text x="230" y="215" fill="#a7f3d0" font-size="11" font-weight="700" text-anchor="middle">Segments (Metameres)</text>';

      // Right callouts
      m += '<text x="420" y="120" fill="#10b981" font-size="13" font-weight="700">Earthworm Hallmarks:</text>';
      m += '<text x="420" y="142" fill="#cbd5e1" font-size="11">• Coelom lined by mesoderm</text>';
      m += '<text x="420" y="162" fill="#cbd5e1" font-size="11">• Closed type circulation</text>';
      m += '<text x="420" y="182" fill="#cbd5e1" font-size="11">• Nephridia: osmo + excretion</text>';
      m += '<text x="420" y="202" fill="#cbd5e1" font-size="11">• Nereis, Pheretima, Hirudinaria</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Worm Phylum", wType === "flatworm" ? "PLATYHELMINTHES" : (wType === "roundworm" ? "ASCHELMINTHES" : "ANNELIDA"), "#38bdf8") +
      cell("Body Cavity", wType === "flatworm" ? "Absent" : (wType === "roundworm" ? "Pseudocoelom" : "Coelom"), "#10b981") +
      cell("Gut", wType === "flatworm" ? "Incomplete plan" : "Complete", "#f59e0b") +
      cell("Sexes", wType === "flatworm" ? "Not separate" : (wType === "roundworm" ? "Separate" : "Dioecious / Monoecious"), "#ec4899")
    );

    verdict(
      '<span style="color:#10b981;font-weight:700;">Worm Comparison:</span> ' +
      (wType === "flatworm" ? "Flatworms: flattened acoelomates with flame cells, unseparate sexes and many larval stages." :
       (wType === "roundworm" ? "Roundworms: round pseudocoelomates with a complete gut, muscular pharynx and separate sexes." :
        "Annelids: segmented coelomates with closed circulation, nephridia and paired ganglia."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 4. Arthropod Body Explorer (arthropodaseg)
// §4.2.7: over two-thirds of named species. Only the chapter's four
// respiratory organs and named example groups; no per-taxon mappings,
// no diseases, no physiology beyond the printed clauses.
// -------------------------------------------------------------------------
window.SIMS.arthropodaseg = (function(){
  var aView = "bodyplan"; // "bodyplan", "respiration", "excretion", "diversity"

  function setA(v){
    aView = v;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Head</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Thorax</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Abdomen</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Jointed Appendages</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-seg">Head, Thorax &amp; Abdomen</button>' +
      '<button class="preset-btn" id="p-resp">Four Respiratory Organs</button>' +
      '<button class="preset-btn" id="p-excr">Circulation &amp; Excretion</button>' +
      '<button class="preset-btn" id="p-div">Named Example Groups</button>';

    document.getElementById("p-seg").onclick = function(){ setActivePreset(this); setA("bodyplan"); };
    document.getElementById("p-resp").onclick = function(){ setActivePreset(this); setA("respiration"); };
    document.getElementById("p-excr").onclick = function(){ setActivePreset(this); setA("excretion"); };
    document.getElementById("p-div").onclick = function(){ setActivePreset(this); setA("diversity"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Arthropoda: Largest Phylum, over 2/3 of named species (§4.2.7)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Chitinous exoskeleton, jointed appendages, and the chapter\u2019s example roll-call.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(aView === "bodyplan"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Head + Thorax + Abdomen under Chitin</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Chitinous exoskeleton · Jointed appendages · Antennae, eyes, statocysts</text>';

      // Head
      m += '<circle cx="170" cy="160" r="45" fill="#78350f" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<circle cx="155" cy="150" r="8" fill="#0f172a" stroke="#fde68a" stroke-width="1.5"/>';
      m += '<circle cx="185" cy="150" r="8" fill="#0f172a" stroke="#fde68a" stroke-width="1.5"/>';
      m += '<path d="M 150,125 Q 135,95 120,90" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      m += '<path d="M 190,125 Q 205,95 220,90" fill="none" stroke="#f59e0b" stroke-width="2"/>';
      m += '<text x="170" y="185" fill="#fde68a" font-size="11" font-weight="700" text-anchor="middle">HEAD</text>';
      m += '<text x="170" y="225" fill="#94a3b8" font-size="10" text-anchor="middle">Antennae + Eyes</text>';

      // Thorax
      m += '<rect x="230" y="115" width="110" height="90" rx="10" fill="#0c1f36" stroke="#38bdf8" stroke-width="2.5"/>';
      for(var l = 0; l < 3; l++){
        var ly = 135 + l * 25;
        m += '<line x1="285" y1="' + ly + '" x2="320" y2="' + (ly + 12) + '" stroke="#38bdf8" stroke-width="2.5"/>';
        m += '<line x1="320" y1="' + (ly + 12) + '" x2="355" y2="' + ly + '" stroke="#38bdf8" stroke-width="2.5"/>';
      }
      m += '<text x="285" y="185" fill="#bae6fd" font-size="11" font-weight="700" text-anchor="middle">THORAX</text>';
      m += '<text x="285" y="225" fill="#94a3b8" font-size="10" text-anchor="middle">Jointed Legs</text>';

      // Abdomen
      m += '<rect x="355" y="125" width="150" height="70" rx="30" fill="#031f17" stroke="#10b981" stroke-width="2.5"/>';
      for(var sg = 0; sg < 5; sg++){
        var sx = 380 + sg * 25;
        m += '<line x1="' + sx + '" y1="127" x2="' + sx + '" y2="193" stroke="#10b981" stroke-width="1"/>';
      }
      m += '<text x="430" y="175" fill="#a7f3d0" font-size="11" font-weight="700" text-anchor="middle">ABDOMEN</text>';

      m += '<text x="560" y="150" fill="#f59e0b" font-size="11" font-weight="700">Chitinous</text>';
      m += '<text x="560" y="168" fill="#94a3b8" font-size="10">exoskeleton</text>';

    } else if(aView === "respiration"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Four Respiratory Organs (§4.2.7)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">The chapter lists all four without assigning them to taxa</text>';

      var organs = [
        { n: "Gills", c: "#38bdf8" },
        { n: "Book gills", c: "#10b981" },
        { n: "Book lungs", c: "#f59e0b" },
        { n: "Tracheal system", c: "#ec4899" }
      ];
      for(var o = 0; o < 4; o++){
        var ox = 75 + o * 150;
        m += '<rect x="' + ox + '" y="120" width="130" height="80" rx="8" fill="#030712" stroke="' + organs[o].c + '" stroke-width="1.5"/>';
        m += '<text x="' + (ox + 65) + '" y="160" fill="' + organs[o].c + '" font-size="13" font-weight="700" text-anchor="middle">' + organs[o].n + '</text>';
      }
      m += '<text x="360" y="240" fill="#cbd5e1" font-size="11" text-anchor="middle">One list, four organs — plus antennae, eyes and statocysts (balancing organs)</text>';

    } else if(aView === "excretion"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Open Circulation + Malpighian Tubules</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Circulatory system of open type · Excretion through malpighian tubules</text>';

      // Open circulation diagram
      m += '<circle cx="200" cy="160" r="40" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6 4"/>';
      m += '<circle cx="200" cy="160" r="14" fill="#0284c7"/>';
      m += '<text x="200" y="164" fill="#fff" font-size="9" text-anchor="middle">Heart</text>';
      m += '<text x="200" y="230" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">Open: blood bathes cells</text>';

      // Malpighian tubules
      for(var mt = 0; mt < 6; mt++){
        var mx = 380 + mt * 22;
        m += '<path d="M ' + mx + ',200 Q ' + (mx + 8) + ',160 ' + mx + ',120" fill="none" stroke="#10b981" stroke-width="2.5"/>';
      }
      m += '<text x="440" y="230" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">Malpighian tubules</text>';

      m += '<text x="560" y="150" fill="#cbd5e1" font-size="11">Mostly dioecious</text>';
      m += '<text x="560" y="170" fill="#cbd5e1" font-size="11">Internal fertilisation</text>';
      m += '<text x="560" y="190" fill="#cbd5e1" font-size="11">Mostly oviparous</text>';

    } else {
      // Named example groups
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#a855f7" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#a855f7" font-size="15" font-weight="700">Named Example Groups (§4.2.7)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Economically important · Vectors · Pest · Living fossil</text>';

      var groups = [
        { t: "Apis, Bombyx, Laccifer", s: "honeybee, silkworm, lac insect", c: "#f59e0b" },
        { t: "Anopheles, Culex, Aedes", s: "mosquito vectors", c: "#ef4444" },
        { t: "Locusta", s: "gregarious pest", c: "#10b981" },
        { t: "Limulus", s: "king crab, living fossil", c: "#38bdf8" }
      ];
      for(var g = 0; g < 4; g++){
        var gx = 75 + g * 150;
        m += '<rect x="' + gx + '" y="120" width="130" height="90" rx="8" fill="#030712" stroke="' + groups[g].c + '" stroke-width="1.5"/>';
        m += '<text x="' + (gx + 65) + '" y="152" fill="' + groups[g].c + '" font-size="11" font-weight="700" text-anchor="middle">' + groups[g].t + '</text>';
        m += '<text x="' + (gx + 65) + '" y="175" fill="#94a3b8" font-size="10" text-anchor="middle">' + groups[g].s + '</text>';
      }
    }

    svg.innerHTML = m;

    readout(
      cell("Phylum", "ARTHROPODA", "#f59e0b") +
      cell("Share", "Over 2/3 of species", "#10b981") +
      cell("Cover", "Chitinous exoskeleton", "#38bdf8") +
      cell("Fertilisation", "Internal", "#ec4899")
    );

    verdict(
      '<span style="color:#f59e0b;font-weight:700;">Largest Phylum:</span> ' +
      'Over two-thirds of all named species: chitinous exoskeleton, jointed appendages, four respiratory organs, open circulation, malpighian tubules, mostly dioecious and oviparous.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 5. Water Vascular & Collar-Worm Explorer (watervascular)
// §4.2.9-4.2.10. The chapter states the water system's three JOBS, not its
// plumbing — only the three printed jobs appear below.
// -------------------------------------------------------------------------
window.SIMS.watervascular = (function(){
  var eType = "echino"; // "echino", "hemi"

  function setE(t){
    eType = t;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Water Vascular Jobs</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Proboscis / Collar / Trunk</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Calcareous Ossicles</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-ech">Echinodermata (Star Fish)</button>' +
      '<button class="preset-btn" id="p-hemi">Hemichordata (Balanoglossus)</button>';

    document.getElementById("p-ech").onclick = function(){ setActivePreset(this); setE("echino"); };
    document.getElementById("p-hemi").onclick = function(){ setActivePreset(this); setE("hemi"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Spiny skins &amp; collar worms (§4.2.9–4.2.10)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Three jobs of one water system; three regions of one worm.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(eType === "echino"){
      // Starfish with function boxes
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Water Vascular System: Three Jobs (§4.2.9)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Most distinctive echinoderm feature · All marine · Adults radial, larvae bilateral</text>';

      // Star body
      m += '<circle cx="200" cy="170" r="25" fill="#b45309" stroke="#f59e0b" stroke-width="2"/>';
      for(var a = 0; a < 5; a++){
        var ang = (a / 5) * Math.PI * 2 - Math.PI / 2;
        var tx = 200 + Math.cos(ang) * 70;
        var ty = 170 + Math.sin(ang) * 70;
        m += '<line x1="200" y1="170" x2="' + tx + '" y2="' + ty + '" stroke="#b45309" stroke-width="14" stroke-linecap="round"/>';
      }
      m += '<text x="200" y="250" fill="#fcd34d" font-size="11" font-weight="700" text-anchor="middle">Calcareous ossicles (spiny)</text>';

      // Three jobs
      var jobs = [
        { t: "Locomotion", c: "#38bdf8" },
        { t: "Food capture + transport", c: "#10b981" },
        { t: "Respiration", c: "#ec4899" }
      ];
      for(var j = 0; j < 3; j++){
        var jy = 105 + j * 50;
        m += '<rect x="380" y="' + jy + '" width="250" height="38" rx="6" fill="#030712" stroke="' + jobs[j].c + '" stroke-width="1.5"/>';
        m += '<text x="505" y="' + (jy + 24) + '" fill="' + jobs[j].c + '" font-size="12" font-weight="700" text-anchor="middle">' + jobs[j].t + '</text>';
      }

    } else {
      // Balanoglossus: proboscis, collar, trunk
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Balanoglossus: Proboscis + Collar + Trunk</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Marine · Bilateral, triploblastic, coelomate · Separate phylum (ex-chordate)</text>';

      // Proboscis
      m += '<ellipse cx="180" cy="160" rx="40" ry="45" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2.5"/>';
      m += '<text x="180" y="164" fill="#fff" font-size="11" font-weight="700" text-anchor="middle">Proboscis</text>';
      m += '<text x="180" y="230" fill="#64748b" font-size="9" text-anchor="middle">proboscis gland excretes</text>';

      // Collar with stomochord
      m += '<rect x="225" y="120" width="60" height="80" rx="8" fill="#1e3a5f" stroke="#f59e0b" stroke-width="2.5"/>';
      m += '<text x="255" y="152" fill="#fde68a" font-size="10" font-weight="700" text-anchor="middle">Collar</text>';
      m += '<text x="255" y="168" fill="#fcd34d" font-size="9" text-anchor="middle">stomochord</text>';
      m += '<text x="255" y="230" fill="#64748b" font-size="9" text-anchor="middle">like a notochord</text>';

      // Trunk with gills
      m += '<rect x="290" y="130" width="160" height="60" rx="8" fill="#082f49" stroke="#38bdf8" stroke-width="2"/>';
      for(var g = 0; g < 6; g++){
        var gx = 310 + g * 22;
        m += '<line x1="' + gx + '" y1="135" x2="' + gx + '" y2="185" stroke="#7dd3fc" stroke-width="1.5"/>';
      }
      m += '<text x="370" y="215" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Trunk (gills respire)</text>';

      m += '<text x="520" y="130" fill="#38bdf8" font-size="12" font-weight="700">Collar-worm facts:</text>';
      m += '<text x="520" y="152" fill="#cbd5e1" font-size="11">• Open circulation</text>';
      m += '<text x="520" y="172" fill="#cbd5e1" font-size="11">• External fertilisation</text>';
      m += '<text x="520" y="192" fill="#cbd5e1" font-size="11">• Indirect development</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Phylum", eType === "echino" ? "ECHINODERMATA" : "HEMICHORDATA", "#f59e0b") +
      cell("Habitat", eType === "echino" ? "All marine" : "Marine", "#38bdf8") +
      cell("Signature", eType === "echino" ? "Water vascular system" : "Stomochord in collar", "#10b981") +
      cell("Development", "Indirect", "#ec4899")
    );

    verdict(
      eType === "echino" ?
      '<span style="color:#f59e0b;font-weight:700;">Most Distinctive Feature:</span> The water vascular system drives locomotion, food capture and transport, and respiration — with no excretory system at all.' :
      '<span style="color:#38bdf8;font-weight:700;">Ex-Chordate Phylum:</span> Hemichordates run a proboscis-collar-trunk body with a notochord-like stomochord, gill respiration and a proboscis gland.'
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 6. Chordate Hallmarks & Subphyla Explorer (chordatehallmarks)
// §4.2.11 + Table 4.1 (pp. 50-51). Four hallmarks, three notochord fates.
// -------------------------------------------------------------------------
window.SIMS.chordatehallmarks = (function(){
  var cGroup = "urochordata"; // "urochordata", "cephalochordata", "vertebrata"

  function setC(g){
    cGroup = g;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Notochord</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Dorsal Hollow Nerve Cord</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Gill Slits + Post-Anal Tail</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-uro">Urochordata (Tunicata)</button>' +
      '<button class="preset-btn" id="p-ceph">Cephalochordata (Amphioxus)</button>' +
      '<button class="preset-btn" id="p-vert">Vertebrata (Column)</button>';

    document.getElementById("p-uro").onclick = function(){ setActivePreset(this); setC("urochordata"); };
    document.getElementById("p-ceph").onclick = function(){ setActivePreset(this); setC("cephalochordata"); };
    document.getElementById("p-vert").onclick = function(){ setActivePreset(this); setC("vertebrata"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Phylum Chordata: four hallmarks, three subphyla (Fig. 4.16, Table 4.1)</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Urochordates + cephalochordates = protochordates, exclusively marine.</div>' +
      '</div>';

    draw(0);
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    // Hallmarks strip
    m += '<rect x="40" y="25" width="640" height="70" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
    m += '<text x="65" y="50" fill="#38bdf8" font-size="13" font-weight="700">Four hallmarks (Fig. 4.16):</text>';
    m += '<text x="65" y="72" fill="#e2e8f0" font-size="11">Notochord · Dorsal hollow nerve cord · Paired pharyngeal gill slits · Post-anal tail</text>';

    if(cGroup === "urochordata"){
      m += '<rect x="40" y="110" width="640" height="160" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="140" fill="#10b981" font-size="15" font-weight="700">Urochordata (Tunicata): Notochord in Larval Tail Only</text>';
      m += '<text x="65" y="162" fill="#cbd5e1" font-size="12">Exclusively marine · Ascidia, Salpa, Doliolum</text>';
      // Larva with tail notochord
      m += '<ellipse cx="200" cy="215" rx="30" ry="22" fill="#065f46" stroke="#10b981" stroke-width="2"/>';
      m += '<path d="M 230,215 L 330,215" stroke="#38bdf8" stroke-width="5"/>';
      m += '<text x="280" y="205" fill="#38bdf8" font-size="10" text-anchor="middle">notochord (larval tail)</text>';
      m += '<text x="480" y="215" fill="#94a3b8" font-size="11">Adult: no notochord</text>';
      m += '<text x="480" y="235" fill="#94a3b8" font-size="11">Protochordate</text>';
    } else if(cGroup === "cephalochordata"){
      m += '<rect x="40" y="110" width="640" height="160" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="140" fill="#f59e0b" font-size="15" font-weight="700">Cephalochordata: Head-to-Tail Notochord, Lifelong</text>';
      m += '<text x="65" y="162" fill="#cbd5e1" font-size="12">Exclusively marine · Branchiostoma (Amphioxus)</text>';
      // Fish-like body with full notochord
      m += '<path d="M 130,215 Q 230,175 330,215 Q 230,255 130,215 Z" fill="#451a03" stroke="#f59e0b" stroke-width="2"/>';
      m += '<line x1="150" y1="215" x2="310" y2="215" stroke="#38bdf8" stroke-width="4"/>';
      m += '<text x="230" y="205" fill="#38bdf8" font-size="10" text-anchor="middle">notochord (lifelong)</text>';
      m += '<text x="480" y="215" fill="#94a3b8" font-size="11">Head to tail, always</text>';
      m += '<text x="480" y="235" fill="#94a3b8" font-size="11">Protochordate</text>';
    } else {
      m += '<rect x="40" y="110" width="640" height="160" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="65" y="140" fill="#ec4899" font-size="15" font-weight="700">Vertebrata: Notochord → Vertebral Column</text>';
      m += '<text x="65" y="162" fill="#cbd5e1" font-size="12">Embryonic notochord · Cartilaginous or bony column · Agnatha + Gnathostomata</text>';
      // Column of vertebrae
      for(var v = 0; v < 8; v++){
        var vx = 140 + v * 24;
        m += '<rect x="' + vx + '" y="200" width="20" height="26" rx="4" fill="#831843" stroke="#ec4899" stroke-width="1.5"/>';
      }
      m += '<text x="230" y="248" fill="#f9a8d4" font-size="10" text-anchor="middle">vertebral column (adult)</text>';
      m += '<text x="480" y="205" fill="#94a3b8" font-size="11">Ventral muscular heart</text>';
      m += '<text x="480" y="225" fill="#94a3b8" font-size="11">Kidneys · Paired appendages</text>';
    }

    svg.innerHTML = m;

    readout(
      cell("Subphylum", cGroup.toUpperCase(), "#38bdf8") +
      cell("Notochord", cGroup === "urochordata" ? "Larval tail only" : (cGroup === "cephalochordata" ? "Lifelong, full length" : "Embryonic → column"), "#10b981") +
      cell("Examples", cGroup === "urochordata" ? "Ascidia, Salpa" : (cGroup === "cephalochordata" ? "Branchiostoma" : "Fishes → mammals"), "#f59e0b") +
      cell("Heart", "Ventral (chordates)", "#ec4899")
    );

    verdict(
      '<span style="color:#38bdf8;font-weight:700;">Notochord Fates:</span> ' +
      (cGroup === "urochordata" ? "Urochordates keep the notochord only in the larval tail (Ascidia, Salpa, Doliolum)." :
       (cGroup === "cephalochordata" ? "Cephalochordates keep a head-to-tail notochord lifelong (Branchiostoma)." :
        "Vertebrates replace the embryonic notochord with a cartilaginous or bony vertebral column."))
    );
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// 7. Vertebrate Classes Explorer (vertebrateheart)
// Six classes via four panels (§4.2.11), using the book's chamber word.
// Only printed clauses: chambers, skin, respiration, reproduction,
// bloodedness, examples. No circulation or mixing claims.
// -------------------------------------------------------------------------
window.SIMS.vertebrateheart = (function(){
  var vClass = "fishes"; // "fishes", "amphibia", "reptilia", "birds"

  function setV(c){
    vClass = c;
    draw(0);
  }

  function mount(){
    App.state.maxT = 5;
    document.getElementById("lab-legend").innerHTML =
      '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><span>Fishes (2 chambers)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span><span>Amphibia (3 chambers)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span><span>Reptilia (3, croc 4)</span></div>' +
      '<div class="legend-item"><span class="legend-dot" style="background:#ec4899;"></span><span>Birds + Mammals (4)</span></div>';

    document.getElementById("preset-bar").innerHTML =
      '<button class="preset-btn active" id="p-fish">Fishes (Chondrich + Ostie)</button>' +
      '<button class="preset-btn" id="p-amph">Amphibia (Dual Life)</button>' +
      '<button class="preset-btn" id="p-rep">Reptilia (Creeping)</button>' +
      '<button class="preset-btn" id="p-aves">Birds &amp; Mammals (Warm)</button>';

    document.getElementById("p-fish").onclick = function(){ setActivePreset(this); setV("fishes"); };
    document.getElementById("p-amph").onclick = function(){ setActivePreset(this); setV("amphibia"); };
    document.getElementById("p-rep").onclick = function(){ setActivePreset(this); setV("reptilia"); };
    document.getElementById("p-aves").onclick = function(){ setActivePreset(this); setV("birds"); };

    document.getElementById("lab-controls").innerHTML =
      '<div class="control-group" style="grid-column:span 2;">' +
        '<label>Gnathostome classes (§4.2.11) — hearts, skin, breathing, breeding</label>' +
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">Chambers rise 2 → 3 → 3 → 4; development moves onto land.</div>' +
      '</div>';

    draw(0);
  }

  function heartBoxes(x, chambers, col){
    var m = "";
    for(var i = 0; i < chambers; i++){
      var bx = x + i * 58;
      var label = (chambers === 2) ? (i === 0 ? "Auricle" : "Ventricle") :
        (chambers === 3) ? (i < 2 ? "Auricle" : "Ventricle") :
        (i < 2 ? "Auricle" : "Ventricle");
      m += '<rect x="' + bx + '" y="120" width="50" height="60" rx="6" fill="#030712" stroke="' + col + '" stroke-width="2"/>';
      m += '<text x="' + (bx + 25) + '" y="145" fill="' + col + '" font-size="10" font-weight="700" text-anchor="middle">' + label + '</text>';
      m += '<text x="' + (bx + 25) + '" y="162" fill="#64748b" font-size="9" text-anchor="middle">' + (i + 1) + '/' + chambers + '</text>';
    }
    return m;
  }

  function draw(t){
    var svg = svgEl(); if(!svg) return;
    var m = '<rect width="720" height="300" fill="#09131d"/>';

    if(vClass === "fishes"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#38bdf8" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#38bdf8" font-size="15" font-weight="700">Fishes: Two-Chambered Hearts (Auricle + Ventricle)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Cold-blooded · Chondrichthyes (cartilage, no operculum) vs Osteichthyes (bone, operculum, air bladder)</text>';
      m += heartBoxes(90, 2, "#38bdf8");
      m += '<text x="90" y="215" fill="#cbd5e1" font-size="11">Chondrichthyes: placoid scales, claspers, internal fert., viviparous</text>';
      m += '<text x="90" y="235" fill="#cbd5e1" font-size="11">Osteichthyes: cycloid/ctenoid scales, usually external fert., oviparous</text>';
      m += '<text x="90" y="255" fill="#64748b" font-size="10">Scoliodon, Trygon · Exocoetus, Hippocampus, Labeo, Betta</text>';
      readout(
        cell("Classes", "CHONDRICHTHYES + OSTEICHTHYES", "#38bdf8") +
        cell("Heart", "2 chambers", "#10b981") +
        cell("Bloodedness", "Cold-blooded", "#f59e0b") +
        cell("Key Split", "No operculum vs operculum", "#ec4899")
      );
      verdict(
        '<span style="color:#38bdf8;font-weight:700;">Fishes:</span> ' +
        'Two-chambered hearts (one auricle and one ventricle), cold-blooded — cartilaginous without operculum and air bladder, bony with both.'
      );
    } else if(vClass === "amphibia"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#10b981" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#10b981" font-size="15" font-weight="700">Amphibia: Three Chambers + Dual Life</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Cold-blooded · Moist scaleless skin · Gills + lungs + skin · Tympanum · Cloaca</text>';
      m += heartBoxes(90, 3, "#10b981");
      m += '<text x="90" y="215" fill="#cbd5e1" font-size="11">Two auricles and one ventricle · External fertilisation · Oviparous · Indirect</text>';
      m += '<text x="90" y="235" fill="#64748b" font-size="10">Bufo, Rana, Hyla, Salamandra, Ichthyophis</text>';
      readout(
        cell("Class", "AMPHIBIA", "#10b981") +
        cell("Heart", "3 chambers", "#38bdf8") +
        cell("Bloodedness", "Cold-blooded", "#f59e0b") +
        cell("Life", "Aquatic + terrestrial", "#ec4899")
      );
      verdict(
        '<span style="color:#10b981;font-weight:700;">Amphibia:</span> ' +
        'Dual life with moist scaleless skin, three-chambered hearts, external fertilisation and indirect development.'
      );
    } else if(vClass === "reptilia"){
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#f59e0b" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#f59e0b" font-size="15" font-weight="700">Reptilia: Three Chambers (Crocodiles: Four)</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Cold-blooded · Dry cornified skin, scales/scutes · Creeping · Internal fert. · Oviparous · Direct</text>';
      m += heartBoxes(90, 3, "#f59e0b");
      m += '<text x="330" y="150" fill="#f59e0b" font-size="11" font-weight="700">+ Crocodiles: 4 chambers</text>';
      m += '<text x="90" y="215" fill="#cbd5e1" font-size="11">Chelone, Testudo, Chameleon, Calotes, Crocodilus, Naja, Bangarus, Vipera</text>';
      m += '<text x="90" y="235" fill="#64748b" font-size="10">Book spellings: Crocodilus, Bangarus</text>';
      readout(
        cell("Class", "REPTILIA", "#f59e0b") +
        cell("Heart", "3 (croc 4)", "#38bdf8") +
        cell("Bloodedness", "Cold-blooded", "#10b981") +
        cell("Skin", "Dry, scales/scutes", "#ec4899")
      );
      verdict(
        '<span style="color:#f59e0b;font-weight:700;">Reptilia:</span> ' +
        'Creeping cold-blooded oviparous reptiles with three-chambered hearts — except crocodiles with four.'
      );
    } else {
      m += '<rect x="40" y="30" width="640" height="240" rx="8" fill="#0b1726" stroke="#ec4899" stroke-width="1.5"/>';
      m += '<text x="65" y="60" fill="#ec4899" font-size="15" font-weight="700">Birds &amp; Mammals: Four Chambers + Warm Blood</text>';
      m += '<text x="65" y="80" fill="#94a3b8" font-size="11">Warm-blooded · Feathers/wings/air sacs (birds) · Hair/pinnae/milk (mammals)</text>';
      m += heartBoxes(90, 4, "#ec4899");
      m += '<text x="340" y="150" fill="#cbd5e1" font-size="11">Birds: oviparous · crop + gizzard</text>';
      m += '<text x="340" y="170" fill="#cbd5e1" font-size="11">Mammals: viviparous (platypus lays)</text>';
      m += '<text x="90" y="215" fill="#cbd5e1" font-size="11">Corvus, Pavo, Aptenodytes · Ornithorhynchus, Balaenoptera, Panthera</text>';
      readout(
        cell("Classes", "AVES + MAMMALIA", "#ec4899") +
        cell("Heart", "4 chambers", "#38bdf8") +
        cell("Bloodedness", "Warm-blooded", "#f59e0b") +
        cell("Young", "Ovip. birds / vivip. mammals", "#10b981")
      );
      verdict(
        '<span style="color:#ec4899;font-weight:700;">Birds &amp; Mammals:</span> ' +
        'Four-chambered warm-blooded classes — feathered wings with air sacs versus hair, pinnae and mammary glands.'
      );
    }

    svg.innerHTML = m;
  }

  return { mount: mount, draw: draw };
})();

// -------------------------------------------------------------------------
// Browser-QA compatibility shims (same pattern as kebo101-103 —
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
