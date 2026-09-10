
var App = window.App;
window.SIMS = {};

function setActivePreset(btn){
  var p = btn.parentElement;
  if(p){
    p.querySelectorAll('.filter-chip').forEach(function(b){ b.classList.remove('active'); });
  }
  btn.classList.add('active');
}

// ==========================================
// 1. hybridviewer: Carbon Hybridization & Bond-Line Orbitals Lab
// ==========================================
window.SIMS.hybridviewer = {
  mount: function(container){
    var mol = 'methane'; // methane, ethene, ethyne, allene, benzene

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip active" id="btn-methane">CH₄ (Methane: sp³)</button>' +
      '    <button class="filter-chip" id="btn-ethene">C₂H₄ (Ethene: sp²)</button>' +
      '    <button class="filter-chip" id="btn-ethyne">C₂H₂ (Ethyne: sp)</button>' +
      '    <button class="filter-chip" id="btn-allene">CH₂=C=CH₂ (Allene: sp²-sp-sp²)</button>' +
      '    <button class="filter-chip" id="btn-benzene">C₆H₆ (Benzene: Delocalized sp²)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-hybrid" viewBox="0 0 700 280" style="width:100%;height:auto;max-height:280px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="hybrid-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-hybrid');
      var rd = document.getElementById('hybrid-readout');
      if(!svg || !rd) return;

      var title, hyb, angle, sChar, sigmaCount, piCount, geom, enOrder, svgContent;
      if(mol === 'methane'){
        title = 'Methane (CH₄) — Four Equivalent sp³ Hybrid Orbitals';
        hyb = 'sp³';
        angle = '109.5° (Tetrahedral)';
        sChar = '25% s, 75% p (1:3 ratio)';
        sigmaCount = '4 C–H σ bonds';
        piCount = '0 π bonds';
        geom = 'Tetrahedral geometry, maximum spatial distance between 4 bonding pairs.';
        enOrder = 'Electronegativity: sp³-C (least electronegative among hybrid carbons).';
        svgContent = 
          '<g transform="translate(350, 140)">' +
          '  <line x1="0" y1="0" x2="0" y2="-90" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="0" y1="0" x2="-80" y2="60" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="0" y1="0" x2="75" y2="65" stroke="#38bdf8" stroke-width="4"/>' +
          '  <polygon points="0,0 20,40 -15,45" fill="#64748b" opacity="0.6"/>' +
          '  <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
          '  <text x="0" y="7" text-anchor="middle" fill="#38bdf8" font-size="18" font-weight="bold">C(sp³)</text>' +
          '  <circle cx="0" cy="-90" r="16" fill="#f8fafc"/>' +
          '  <text x="0" y="-85" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="bold">H</text>' +
          '  <circle cx="-80" cy="60" r="16" fill="#f8fafc"/>' +
          '  <text x="-80" y="65" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="bold">H</text>' +
          '  <circle cx="75" cy="65" r="16" fill="#f8fafc"/>' +
          '  <text x="75" y="70" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="bold">H</text>' +
          '  <circle cx="20" cy="40" r="14" fill="#94a3b8"/>' +
          '  <text x="20" y="44" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">H(wedge)</text>' +
          '  <text x="50" y="-30" fill="#f59e0b" font-size="12" font-weight="bold">109°28\'</text>' +
          '</g>';
      } else if(mol === 'ethene'){
        title = 'Ethene (H₂C=CH₂) — Planar sp² Framework with Lateral π Overlap';
        hyb = 'sp²';
        angle = '120° (Trigonal Planar)';
        sChar = '33.33% s, 66.67% p';
        sigmaCount = '5 σ bonds (1 C–C σ + 4 C–H σ)';
        piCount = '1 C–C π bond (lateral unhybridized 2p_z overlap)';
        geom = 'All 6 atoms lie in one flat plane; π-electron cloud lies above and below the nodal molecular plane.';
        enOrder = 'Electronegativity: sp²-C > sp³-C.';
        svgContent = 
          '<g transform="translate(350, 140)">' +
          '  <!-- C-C sigma bond -->' +
          '  <line x1="-80" y1="0" x2="80" y2="0" stroke="#38bdf8" stroke-width="5"/>' +
          '  <!-- C-H sigma bonds -->' +
          '  <line x1="-80" y1="0" x2="-160" y2="-60" stroke="#38bdf8" stroke-width="3"/>' +
          '  <line x1="-80" y1="0" x2="-160" y2="60" stroke="#38bdf8" stroke-width="3"/>' +
          '  <line x1="80" y1="0" x2="160" y2="-60" stroke="#38bdf8" stroke-width="3"/>' +
          '  <line x1="80" y1="0" x2="160" y2="60" stroke="#38bdf8" stroke-width="3"/>' +
          '  <!-- pi orbital lobes -->' +
          '  <ellipse cx="-80" cy="-45" rx="14" ry="30" fill="#f43f5e" opacity="0.4" stroke="#f43f5e"/>' +
          '  <ellipse cx="-80" cy="45" rx="14" ry="30" fill="#3b82f6" opacity="0.4" stroke="#3b82f6"/>' +
          '  <ellipse cx="80" cy="-45" rx="14" ry="30" fill="#f43f5e" opacity="0.4" stroke="#f43f5e"/>' +
          '  <ellipse cx="80" cy="45" rx="14" ry="30" fill="#3b82f6" opacity="0.4" stroke="#3b82f6"/>' +
          '  <!-- lateral overlap bands -->' +
          '  <path d="M -80 -55 Q 0 -75 80 -55" stroke="#f43f5e" stroke-width="2" stroke-dasharray="4,3" fill="none"/>' +
          '  <path d="M -80 55 Q 0 75 80 55" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4,3" fill="none"/>' +
          '  <text x="0" y="-70" text-anchor="middle" fill="#f43f5e" font-size="12" font-weight="bold">π overlap (top)</text>' +
          '  <text x="0" y="80" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="bold">π overlap (bottom)</text>' +
          '  <!-- Carbons -->' +
          '  <circle cx="-80" cy="0" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
          '  <text x="-80" y="6" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">C(sp²)</text>' +
          '  <circle cx="80" cy="0" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
          '  <text x="80" y="6" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">C(sp²)</text>' +
          '  <!-- Hydrogens -->' +
          '  <circle cx="-160" cy="-60" r="13" fill="#f8fafc"/><text x="-160" y="-56" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">H</text>' +
          '  <circle cx="-160" cy="60" r="13" fill="#f8fafc"/><text x="-160" y="64" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">H</text>' +
          '  <circle cx="160" cy="-60" r="13" fill="#f8fafc"/><text x="160" y="-56" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">H</text>' +
          '  <circle cx="160" cy="60" r="13" fill="#f8fafc"/><text x="160" y="64" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">H</text>' +
          '</g>';
      } else if(mol === 'ethyne'){
        title = 'Ethyne (HC≡CH) — Linear sp Cylindrical π-Sleeve';
        hyb = 'sp';
        angle = '180° (Linear)';
        sChar = '50% s, 50% p (1:1 ratio)';
        sigmaCount = '3 σ bonds (1 C–C σ + 2 C–H σ)';
        piCount = '2 mutually perpendicular π bonds (2p_y and 2p_z)';
        geom = 'Linear arrangement with a continuous cylindrical barrel of π-electrons enclosing the internuclear axis.';
        enOrder = 'Highest Electronegativity: sp-C pulls electrons most strongly, rendering terminal alkyne protons acidic!';
        svgContent = 
          '<g transform="translate(350, 140)">' +
          '  <!-- Collinear Axis -->' +
          '  <line x1="-220" y1="0" x2="220" y2="0" stroke="#38bdf8" stroke-width="4"/>' +
          '  <!-- Py Lobes (vertical) -->' +
          '  <ellipse cx="-70" cy="-45" rx="12" ry="30" fill="#f43f5e" opacity="0.4"/>' +
          '  <ellipse cx="-70" cy="45" rx="12" ry="30" fill="#3b82f6" opacity="0.4"/>' +
          '  <ellipse cx="70" cy="-45" rx="12" ry="30" fill="#f43f5e" opacity="0.4"/>' +
          '  <ellipse cx="70" cy="45" rx="12" ry="30" fill="#3b82f6" opacity="0.4"/>' +
          '  <!-- Pz Lobes (tilted) -->' +
          '  <ellipse cx="-70" cy="0" rx="30" ry="12" fill="#10b981" opacity="0.4" transform="rotate(30, -70, 0)"/>' +
          '  <ellipse cx="70" cy="0" rx="30" ry="12" fill="#10b981" opacity="0.4" transform="rotate(30, 70, 0)"/>' +
          '  <path d="M -70 -55 L 70 -55" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3,3"/>' +
          '  <path d="M -70 55 L 70 55" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,3"/>' +
          '  <!-- C1 and C2 -->' +
          '  <circle cx="-70" cy="0" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
          '  <text x="-70" y="5" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">C(sp)</text>' +
          '  <circle cx="70" cy="0" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
          '  <text x="70" y="5" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">C(sp)</text>' +
          '  <!-- H atoms -->' +
          '  <circle cx="-190" cy="0" r="14" fill="#f8fafc"/><text x="-190" y="5" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="bold">H</text>' +
          '  <circle cx="190" cy="0" r="14" fill="#f8fafc"/><text x="190" y="5" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="bold">H</text>' +
          '  <text x="0" y="-70" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="bold">C≡C Triple Bond (1σ + 2π)</text>' +
          '</g>';
      } else if(mol === 'allene'){
        title = 'Allene (CH₂=C=CH₂) — Cumulated Dienes with Perpendicular Planes';
        hyb = 'C1(sp²) = C2(sp) = C3(sp²)';
        angle = 'C1–C2–C3 = 180°; H–C–H = 120°';
        sChar = 'Central C is 50% s (sp); Terminal Carbons are 33.3% s (sp²)';
        sigmaCount = '6 σ bonds (2 C–C σ + 4 C–H σ)';
        piCount = '2 perpendicular π bonds';
        geom = 'The two CH₂ planes are mutually perpendicular (orthogonal) at 90° due to the perpendicular 2p orbitals on central sp-C.';
        enOrder = 'Central C is significantly more electronegative than terminal carbons.';
        svgContent = 
          '<g transform="translate(350, 140)">' +
          '  <line x1="-120" y1="0" x2="120" y2="0" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="-120" y1="0" x2="-180" y2="-50" stroke="#38bdf8" stroke-width="3"/>' +
          '  <line x1="-120" y1="0" x2="-180" y2="50" stroke="#38bdf8" stroke-width="3"/>' +
          '  <line x1="120" y1="0" x2="180" y2="-20" stroke="#38bdf8" stroke-width="3"/>' +
          '  <line x1="120" y1="0" x2="180" y2="20" stroke="#38bdf8" stroke-width="6"/>' +
          '  <circle cx="-120" cy="0" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/><text x="-120" y="5" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">C1(sp²)</text>' +
          '  <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/><text x="0" y="5" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">C2(sp)</text>' +
          '  <circle cx="120" cy="0" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/><text x="120" y="5" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">C3(sp²)</text>' +
          '  <text x="0" y="-50" text-anchor="middle" fill="#38bdf8" font-size="12">Central C uses 2 perpendicular p-orbitals</text>' +
          '  <text x="0" y="50" text-anchor="middle" fill="#e2e8f0" font-size="12">Terminal =CH₂ groups are in orthogonal planes!</text>' +
          '</g>';
      } else {
        title = 'Benzene (C₆H₆) — Planar Aromatic sp² Ring with 6 Delocalized π-Electrons';
        hyb = 'All 6 Carbons are sp²';
        angle = '120° (Regular Planar Hexagon)';
        sChar = '33.3% s on every carbon';
        sigmaCount = '12 σ bonds (6 C–C σ + 6 C–H σ)';
        piCount = '3 π bonds (6 delocalized π-electrons, Hückel 4n+2 with n=1)';
        geom = 'Planar regular hexagon with identical C–C bond lengths (139 pm, intermediate between single 154 pm and double 134 pm).';
        enOrder = 'Equal electron density shared homogeneously across all 6 carbons.';
        svgContent = 
          '<g transform="translate(350, 140)">' +
          '  <polygon points="0,-70 60,-35 60,35 0,70 -60,35 -60,-35" fill="none" stroke="#38bdf8" stroke-width="4"/>' +
          '  <circle cx="0" cy="0" r="38" fill="none" stroke="#f43f5e" stroke-width="3" stroke-dasharray="6,4"/>' +
          '  <text x="0" y="5" text-anchor="middle" fill="#f43f5e" font-size="13" font-weight="bold">6 π deloc.</text>' +
          '  <!-- H atoms -->' +
          '  <line x1="0" y1="-70" x2="0" y2="-105" stroke="#94a3b8" stroke-width="2"/><circle cx="0" cy="-105" r="8" fill="#f8fafc"/>' +
          '  <line x1="60" y1="-35" x2="90" y2="-52" stroke="#94a3b8" stroke-width="2"/><circle cx="90" cy="-52" r="8" fill="#f8fafc"/>' +
          '  <line x1="60" y1="35" x2="90" y2="52" stroke="#94a3b8" stroke-width="2"/><circle cx="90" cy="52" r="8" fill="#f8fafc"/>' +
          '  <line x1="0" y1="70" x2="0" y2="105" stroke="#94a3b8" stroke-width="2"/><circle cx="0" cy="105" r="8" fill="#f8fafc"/>' +
          '  <line x1="-60" y1="35" x2="-90" y2="52" stroke="#94a3b8" stroke-width="2"/><circle cx="-90" cy="52" r="8" fill="#f8fafc"/>' +
          '  <line x1="-60" y1="-35" x2="-90" y2="-52" stroke="#94a3b8" stroke-width="2"/><circle cx="-90" cy="-52" r="8" fill="#f8fafc"/>' +
          '</g>';
      }

      svg.innerHTML = svgContent;
      rd.innerHTML = 
        '<div style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + title + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:8px;margin-bottom:8px;">' +
        '  <div><b>Hybridization:</b> ' + hyb + '</div>' +
        '  <div><b>Bond Angle:</b> ' + angle + '</div>' +
        '  <div><b>s-Character:</b> ' + sChar + '</div>' +
        '  <div><b>Bonds:</b> ' + sigmaCount + ', ' + piCount + '</div>' +
        '</div>' +
        '<div style="color:var(--muted);font-size:12.5px;">' +
        '  • <b>Geometry:</b> ' + geom + '<br>' +
        '  • <b>Electronegativity Trend:</b> ' + enOrder +
        '</div>';
    }

    container.querySelector('#btn-methane').onclick = function(e){ setActivePreset(e.target); mol = 'methane'; render(); };
    container.querySelector('#btn-ethene').onclick = function(e){ setActivePreset(e.target); mol = 'ethene'; render(); };
    container.querySelector('#btn-ethyne').onclick = function(e){ setActivePreset(e.target); mol = 'ethyne'; render(); };
    container.querySelector('#btn-allene').onclick = function(e){ setActivePreset(e.target); mol = 'allene'; render(); };
    container.querySelector('#btn-benzene').onclick = function(e){ setActivePreset(e.target); mol = 'benzene'; render(); };
    render();
  }
};

// ==========================================
// 2. iupacbuilder: Interactive IUPAC Nomenclature Engine
// ==========================================
window.SIMS.iupacbuilder = {
  mount: function(container){
    var chainLen = 5; // 3 to 8
    var fg = 'ketone'; // alkane, ol, one, al, oic, ene, yne
    var subPos = 2;
    var subGroup = 'methyl'; // none, methyl, chloro, bromo

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:10px;margin-bottom:12px;">' +
      '    <div>' +
      '      <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Principal Functional Group:</label>' +
      '      <select id="sel-fg" style="width:100%;padding:6px;border-radius:4px;border:1px solid var(--line);background:var(--paper);color:var(--ink);">' +
      '        <option value="oic">Carboxylic Acid (-oic acid)</option>' +
      '        <option value="al">Aldehyde (-al)</option>' +
      '        <option value="ketone" selected>Ketone (-one)</option>' +
      '        <option value="ol">Alcohol (-ol)</option>' +
      '        <option value="ene">Alkene (-ene)</option>' +
      '        <option value="yne">Alkyne (-yne)</option>' +
      '        <option value="alkane">Alkane (-ane)</option>' +
      '      </select>' +
      '    </div>' +
      '    <div>' +
      '      <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Carbon Chain Length (Root):</label>' +
      '      <select id="sel-chain" style="width:100%;padding:6px;border-radius:4px;border:1px solid var(--line);background:var(--paper);color:var(--ink);">' +
      '        <option value="3">3 (Prop-)</option>' +
      '        <option value="4">4 (But-)</option>' +
      '        <option value="5" selected>5 (Pent-)</option>' +
      '        <option value="6">6 (Hex-)</option>' +
      '        <option value="7">7 (Hept-)</option>' +
      '      </select>' +
      '    </div>' +
      '    <div>' +
      '      <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Substituent (Prefix):</label>' +
      '      <select id="sel-sub" style="width:100%;padding:6px;border-radius:4px;border:1px solid var(--line);background:var(--paper);color:var(--ink);">' +
      '        <option value="none">None</option>' +
      '        <option value="methyl" selected>Methyl (-CH₃)</option>' +
      '        <option value="chloro">Chloro (-Cl)</option>' +
      '        <option value="bromo">Bromo (-Br)</option>' +
      '      </select>' +
      '    </div>' +
      '    <div>' +
      '      <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Substituent Locant Position:</label>' +
      '      <select id="sel-pos" style="width:100%;padding:6px;border-radius:4px;border:1px solid var(--line);background:var(--paper);color:var(--ink);">' +
      '        <option value="2" selected>Carbon 2</option>' +
      '        <option value="3">Carbon 3</option>' +
      '        <option value="4">Carbon 4</option>' +
      '      </select>' +
      '    </div>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-iupac" viewBox="0 0 700 200" style="width:100%;height:auto;max-height:200px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="iupac-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:14px;line-height:1.6;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-iupac');
      var rd = document.getElementById('iupac-readout');
      if(!svg || !rd) return;

      var roots = {3:'prop', 4:'but', 5:'pent', 6:'hex', 7:'hept'};
      var rootWord = roots[chainLen] || 'pent';

      // Determine IUPAC components
      var prefix = '', pLocant = '', primSuffix = 'an', secSuffix = '', fgLocant = '';
      if(subGroup !== 'none'){
        var sP = Math.min(subPos, chainLen - 1);
        prefix = '<span style="color:#f59e0b;font-weight:bold;">' + sP + '-' + subGroup + '</span>';
      }

      if(fg === 'oic'){
        primSuffix = 'an';
        secSuffix = '<span style="color:#10b981;font-weight:bold;">oic acid</span>';
      } else if(fg === 'al'){
        primSuffix = 'an';
        secSuffix = '<span style="color:#10b981;font-weight:bold;">al</span>';
      } else if(fg === 'ketone'){
        primSuffix = 'an';
        secSuffix = '<span style="color:#10b981;font-weight:bold;">-2-one</span>';
      } else if(fg === 'ol'){
        primSuffix = 'an';
        secSuffix = '<span style="color:#10b981;font-weight:bold;">-2-ol</span>';
      } else if(fg === 'ene'){
        primSuffix = '<span style="color:#38bdf8;font-weight:bold;">-1-en</span>';
        secSuffix = 'e';
      } else if(fg === 'yne'){
        primSuffix = '<span style="color:#38bdf8;font-weight:bold;">-1-yn</span>';
        secSuffix = 'e';
      } else {
        primSuffix = 'ane';
      }

      var formattedName = (prefix ? prefix + '' : '') + '<span style="color:#ec4899;font-weight:bold;">' + rootWord + '</span>' + primSuffix + secSuffix;

      // Draw Zig-Zag Carbon Chain in SVG
      var startX = 350 - ((chainLen - 1) * 35);
      var pts = [];
      for(var i = 0; i < chainLen; i++){
        var x = startX + i * 70;
        var y = 100 + (i % 2 === 0 ? 30 : -30);
        pts.push({x: x, y: y});
      }

      var pathD = 'M ' + pts[0].x + ' ' + pts[0].y;
      for(var j = 1; j < pts.length; j++){
        pathD += ' L ' + pts[j].x + ' ' + pts[j].y;
      }

      var nodes = '';
      for(var k = 0; k < pts.length; k++){
        nodes += '<circle cx="' + pts[k].x + '" cy="' + pts[k].y + '" r="8" fill="#38bdf8"/>' +
                 '<text x="' + pts[k].x + '" y="' + (pts[k].y + (k % 2 === 0 ? 25 : -15)) + '" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="monospace">C' + (k + 1) + '</text>';
      }

      // Draw Functional Group at C1 or C2
      var fgDeco = '';
      if(fg === 'oic'){
        fgDeco = '<line x1="' + pts[0].x + '" y1="' + pts[0].y + '" x2="' + (pts[0].x - 40) + '" y2="' + (pts[0].y - 30) + '" stroke="#ef4444" stroke-width="3"/>' +
                 '<text x="' + (pts[0].x - 45) + '" y="' + (pts[0].y - 35) + '" fill="#ef4444" font-size="13" font-weight="bold">=O</text>' +
                 '<line x1="' + pts[0].x + '" y1="' + pts[0].y + '" x2="' + (pts[0].x - 40) + '" y2="' + (pts[0].y + 30) + '" stroke="#10b981" stroke-width="3"/>' +
                 '<text x="' + (pts[0].x - 45) + '" y="' + (pts[0].y + 35) + '" fill="#10b981" font-size="13" font-weight="bold">-OH</text>';
      } else if(fg === 'al'){
        fgDeco = '<line x1="' + pts[0].x + '" y1="' + pts[0].y + '" x2="' + (pts[0].x - 40) + '" y2="' + (pts[0].y - 30) + '" stroke="#ef4444" stroke-width="3"/>' +
                 '<text x="' + (pts[0].x - 45) + '" y="' + (pts[0].y - 35) + '" fill="#ef4444" font-size="13" font-weight="bold">=O</text>';
      } else if(fg === 'ketone'){
        fgDeco = '<line x1="' + pts[1].x + '" y1="' + pts[1].y + '" x2="' + pts[1].x + '" y2="' + (pts[1].y - 45) + '" stroke="#ef4444" stroke-width="4"/>' +
                 '<text x="' + pts[1].x + '" y="' + (pts[1].y - 50) + '" text-anchor="middle" fill="#ef4444" font-size="14" font-weight="bold">=O</text>';
      } else if(fg === 'ol'){
        fgDeco = '<line x1="' + pts[1].x + '" y1="' + pts[1].y + '" x2="' + pts[1].x + '" y2="' + (pts[1].y - 40) + '" stroke="#10b981" stroke-width="3"/>' +
                 '<text x="' + pts[1].x + '" y="' + (pts[1].y - 45) + '" text-anchor="middle" fill="#10b981" font-size="14" font-weight="bold">-OH</text>';
      } else if(fg === 'ene'){
        fgDeco = '<line x1="' + pts[0].x + '" y1="' + (pts[0].y - 8) + '" x2="' + pts[1].x + '" y2="' + (pts[1].y - 8) + '" stroke="#38bdf8" stroke-width="3"/>';
      } else if(fg === 'yne'){
        fgDeco = '<line x1="' + pts[0].x + '" y1="' + (pts[0].y - 8) + '" x2="' + pts[1].x + '" y2="' + (pts[1].y - 8) + '" stroke="#38bdf8" stroke-width="3"/>' +
                 '<line x1="' + pts[0].x + '" y1="' + (pts[0].y + 8) + '" x2="' + pts[1].x + '" y2="' + (pts[1].y + 8) + '" stroke="#38bdf8" stroke-width="3"/>';
      }

      // Draw substituent
      var subDeco = '';
      if(subGroup !== 'none'){
        var sIdx = Math.min(subPos - 1, chainLen - 2);
        if(sIdx < 0) sIdx = 1;
        var sNode = pts[sIdx];
        var sY = sNode.y > 100 ? sNode.y + 45 : sNode.y - 45;
        subDeco = '<line x1="' + sNode.x + '" y1="' + sNode.y + '" x2="' + sNode.x + '" y2="' + sY + '" stroke="#f59e0b" stroke-width="3"/>' +
                  '<text x="' + sNode.x + '" y="' + (sY > sNode.y ? sY + 15 : sY - 5) + '" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="bold">' +
                  (subGroup === 'methyl' ? 'CH₃' : (subGroup === 'chloro' ? 'Cl' : 'Br')) + '</text>';
      }

      svg.innerHTML = 
        '<path d="' + pathD + '" stroke="#94a3b8" stroke-width="4" fill="none"/>' +
        nodes + fgDeco + subDeco;

      rd.innerHTML = 
        '<div style="font-size:18px;margin-bottom:8px;"><b>Systematic IUPAC Name:</b> ' + formattedName + '</div>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap;font-size:13px;background:var(--paper-soft);padding:10px;border-radius:6px;">' +
        '  <div><span style="color:#f59e0b;">■ Prefix (Substituent):</span> ' + (subGroup !== 'none' ? subPos + '-' + subGroup : 'None') + '</div>' +
        '  <div><span style="color:#ec4899;">■ Word Root (Longest Chain):</span> ' + rootWord + ' (' + chainLen + ' Carbons)</div>' +
        '  <div><span style="color:#38bdf8;">■ Primary Suffix:</span> ' + primSuffix + ' (Saturation)</div>' +
        '  <div><span style="color:#10b981;">■ Secondary Suffix:</span> ' + (secSuffix ? secSuffix.replace(/<[^>]*>/g, '') : 'None') + ' (Principal Functional Group)</div>' +
        '</div>' +
        '<div style="margin-top:8px;font-size:12px;color:var(--muted);">' +
        '  Lowest locant rule applied: numbering starts from the end giving the principal functional group the lowest numerical locant.' +
        '</div>';
    }

    container.querySelector('#sel-fg').onchange = function(e){ fg = e.target.value; render(); };
    container.querySelector('#sel-chain').onchange = function(e){ chainLen = parseInt(e.target.value); render(); };
    container.querySelector('#sel-sub').onchange = function(e){ subGroup = e.target.value; render(); };
    container.querySelector('#sel-pos').onchange = function(e){ subPos = parseInt(e.target.value); render(); };
    render();
  }
};

// ==========================================
// 3. isomersim: Structural & Geometrical Isomerism Chamber
// ==========================================
window.SIMS.isomersim = {
  mount: function(container){
    var mode = 'chain'; // chain, position, functional, geometrical

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip active" id="btn-iso-chain">Chain (Pentane Isomers: C₅H₁₂)</button>' +
      '    <button class="filter-chip" id="btn-iso-pos">Position (Propan-1-ol vs Propan-2-ol)</button>' +
      '    <button class="filter-chip" id="btn-iso-func">Functional (Ethanol vs Dimethyl Ether)</button>' +
      '    <button class="filter-chip" id="btn-iso-geom">Geometrical (cis vs trans But-2-ene)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-isomer" viewBox="0 0 700 240" style="width:100%;height:auto;max-height:240px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="isomer-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-isomer');
      var rd = document.getElementById('isomer-readout');
      if(!svg || !rd) return;

      var title, explanation, svgContent;
      if(mode === 'chain'){
        title = 'Chain Isomerism: Pentane (C₅H₁₂) — Three Structural Skeletons';
        explanation = 'Compounds having identical molecular formula C₅H₁₂ but differing carbon skeletons (straight vs branched). Pentane: b.p. 309 K; Isopentane (2-methylbutane): b.p. 301 K; Neopentane (2,2-dimethylpropane): spherical shape, smallest surface area, b.p. 282.5 K (lowest b.p. due to minimized van der Waals forces).';
        svgContent = 
          '<!-- Pentane -->' +
          '<g transform="translate(110, 80)">' +
          '  <path d="M 0 30 L 30 0 L 60 30 L 90 0 L 120 30" stroke="#38bdf8" stroke-width="4" fill="none"/>' +
          '  <text x="60" y="70" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="bold">n-Pentane</text>' +
          '  <text x="60" y="90" text-anchor="middle" fill="#94a3b8" font-size="11">b.p. 36.1°C (309 K)</text>' +
          '</g>' +
          '<!-- Isopentane -->' +
          '<g transform="translate(320, 80)">' +
          '  <path d="M 0 30 L 30 0 L 60 30 L 90 0" stroke="#10b981" stroke-width="4" fill="none"/>' +
          '  <line x1="30" y1="0" x2="30" y2="-35" stroke="#10b981" stroke-width="4"/>' +
          '  <text x="45" y="70" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="bold">Isopentane (2-methylbutane)</text>' +
          '  <text x="45" y="90" text-anchor="middle" fill="#94a3b8" font-size="11">b.p. 28°C (301 K)</text>' +
          '</g>' +
          '<!-- Neopentane -->' +
          '<g transform="translate(540, 80)">' +
          '  <line x1="0" y1="0" x2="60" y2="0" stroke="#f59e0b" stroke-width="4"/>' +
          '  <line x1="30" y1="-30" x2="30" y2="30" stroke="#f59e0b" stroke-width="4"/>' +
          '  <circle cx="30" cy="0" r="28" fill="none" stroke="#f59e0b" stroke-dasharray="3,3"/>' +
          '  <text x="30" y="70" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="bold">Neopentane (2,2-dimethylpropane)</text>' +
          '  <text x="30" y="90" text-anchor="middle" fill="#94a3b8" font-size="11">b.p. 9.5°C (282.5 K)</text>' +
          '</g>';
      } else if(mode === 'position'){
        title = 'Position Isomerism: Propan-1-ol vs Propan-2-ol (C₃H₈O)';
        explanation = 'Compounds having the same molecular formula and same functional group, but differing in the position of the functional group on the carbon chain. Propan-1-ol has primary -OH at C1; Propan-2-ol has secondary -OH at C2.';
        svgContent = 
          '<!-- Propan-1-ol -->' +
          '<g transform="translate(180, 100)">' +
          '  <path d="M 0 30 L 40 0 L 80 30" stroke="#38bdf8" stroke-width="4" fill="none"/>' +
          '  <line x1="80" y1="30" x2="120" y2="0" stroke="#10b981" stroke-width="4"/>' +
          '  <text x="135" y="5" fill="#10b981" font-size="14" font-weight="bold">OH</text>' +
          '  <text x="50" y="65" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="bold">Propan-1-ol (1° Alcohol)</text>' +
          '  <text x="50" y="85" text-anchor="middle" fill="#94a3b8" font-size="11">b.p. 97°C</text>' +
          '</g>' +
          '<!-- Propan-2-ol -->' +
          '<g transform="translate(440, 100)">' +
          '  <path d="M 0 30 L 40 0 L 80 30" stroke="#f59e0b" stroke-width="4" fill="none"/>' +
          '  <line x1="40" y1="0" x2="40" y2="-40" stroke="#10b981" stroke-width="4"/>' +
          '  <text x="40" y="-48" text-anchor="middle" fill="#10b981" font-size="14" font-weight="bold">OH</text>' +
          '  <text x="40" y="65" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="bold">Propan-2-ol (2° Alcohol)</text>' +
          '  <text x="40" y="85" text-anchor="middle" fill="#94a3b8" font-size="11">b.p. 82.5°C</text>' +
          '</g>';
      } else if(mode === 'functional'){
        title = 'Functional Group Isomerism: Ethanol vs Dimethyl Ether (C₂H₆O)';
        explanation = 'Compounds having the same molecular formula C₂H₆O but entirely different functional groups. Ethanol is an alcohol with strong intermolecular hydrogen bonding (liquid, b.p. 78.3°C). Dimethyl ether is an ether with weak dipole interactions (gas, b.p. −24°C).';
        svgContent = 
          '<!-- Ethanol -->' +
          '<g transform="translate(180, 100)">' +
          '  <line x1="0" y1="20" x2="50" y2="-10" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="50" y1="-10" x2="100" y2="20" stroke="#10b981" stroke-width="4"/>' +
          '  <text x="115" y="25" fill="#10b981" font-size="14" font-weight="bold">OH</text>' +
          '  <text x="50" y="60" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="bold">Ethanol (CH₃CH₂OH)</text>' +
          '  <text x="50" y="80" text-anchor="middle" fill="#38bdf8" font-size="11">H-bonding: Liquid, b.p. 78.3°C</text>' +
          '</g>' +
          '<!-- Dimethyl Ether -->' +
          '<g transform="translate(440, 100)">' +
          '  <line x1="0" y1="20" x2="40" y2="-10" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="60" y1="-10" x2="100" y2="20" stroke="#38bdf8" stroke-width="4"/>' +
          '  <text x="50" y="-8" text-anchor="middle" fill="#ef4444" font-size="16" font-weight="bold">O</text>' +
          '  <text x="50" y="60" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="bold">Dimethyl Ether (CH₃–O–CH₃)</text>' +
          '  <text x="50" y="80" text-anchor="middle" fill="#f59e0b" font-size="11">No H-bonding: Gas, b.p. −24°C</text>' +
          '</g>';
      } else {
        title = 'Geometrical Isomerism (cis / trans): But-2-ene (C₄H₈)';
        explanation = 'Restricted rotation about C=C double bond creates stereoisomers. cis-isomer: identical groups on same side, dipole vectors reinforce (μ = 0.33 D, higher b.p. 3.7°C, less symmetrical, lower m.p. −139°C). trans-isomer: identical groups on opposite sides, dipole vectors cancel (μ = 0 D, lower b.p. 0.9°C, highly symmetrical crystal lattice, higher m.p. −106°C).';
        svgContent = 
          '<!-- cis-But-2-ene -->' +
          '<g transform="translate(180, 110)">' +
          '  <line x1="-40" y1="0" x2="40" y2="0" stroke="#38bdf8" stroke-width="5"/>' +
          '  <line x1="-40" y1="-7" x2="40" y2="-7" stroke="#38bdf8" stroke-width="3"/>' +
          '  <line x1="-40" y1="0" x2="-80" y2="-50" stroke="#f59e0b" stroke-width="3"/><text x="-95" y="-55" fill="#f59e0b" font-size="13" font-weight="bold">CH₃</text>' +
          '  <line x1="40" y1="0" x2="80" y2="-50" stroke="#f59e0b" stroke-width="3"/><text x="85" y="-55" fill="#f59e0b" font-size="13" font-weight="bold">CH₃</text>' +
          '  <line x1="-40" y1="0" x2="-75" y2="40" stroke="#94a3b8" stroke-width="2"/><text x="-85" y="55" fill="#94a3b8" font-size="12">H</text>' +
          '  <line x1="40" y1="0" x2="75" y2="40" stroke="#94a3b8" stroke-width="2"/><text x="80" y="55" fill="#94a3b8" font-size="12">H</text>' +
          '  <!-- net dipole arrow -->' +
          '  <line x1="0" y1="20" x2="0" y2="-30" stroke="#ec4899" stroke-width="3" marker-end="url(#arrow)"/>' +
          '  <text x="0" y="80" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="bold">cis-But-2-ene</text>' +
          '  <text x="0" y="100" text-anchor="middle" fill="#ec4899" font-size="11">μ = 0.33 D (Polar), b.p. 3.7°C</text>' +
          '</g>' +
          '<!-- trans-But-2-ene -->' +
          '<g transform="translate(480, 110)">' +
          '  <line x1="-40" y1="0" x2="40" y2="0" stroke="#38bdf8" stroke-width="5"/>' +
          '  <line x1="-40" y1="-7" x2="40" y2="-7" stroke="#38bdf8" stroke-width="3"/>' +
          '  <line x1="-40" y1="0" x2="-80" y2="-50" stroke="#f59e0b" stroke-width="3"/><text x="-95" y="-55" fill="#f59e0b" font-size="13" font-weight="bold">CH₃</text>' +
          '  <line x1="40" y1="0" x2="80" y2="50" stroke="#f59e0b" stroke-width="3"/><text x="85" y="65" fill="#f59e0b" font-size="13" font-weight="bold">CH₃</text>' +
          '  <line x1="-40" y1="0" x2="-75" y2="40" stroke="#94a3b8" stroke-width="2"/><text x="-85" y="55" fill="#94a3b8" font-size="12">H</text>' +
          '  <line x1="40" y1="0" x2="75" y2="-40" stroke="#94a3b8" stroke-width="2"/><text x="80" y="-45" fill="#94a3b8" font-size="12">H</text>' +
          '  <text x="0" y="80" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="bold">trans-But-2-ene</text>' +
          '  <text x="0" y="100" text-anchor="middle" fill="#10b981" font-size="11">μ = 0 D (Non-polar), m.p. higher (−106°C)</text>' +
          '</g>';
      }

      svg.innerHTML = svgContent;
      rd.innerHTML = 
        '<div style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + title + '</div>' +
        '<div style="color:var(--muted);font-size:13px;line-height:1.5;">' + explanation + '</div>';
    }

    container.querySelector('#btn-iso-chain').onclick = function(e){ setActivePreset(e.target); mode = 'chain'; render(); };
    container.querySelector('#btn-iso-pos').onclick = function(e){ setActivePreset(e.target); mode = 'position'; render(); };
    container.querySelector('#btn-iso-func').onclick = function(e){ setActivePreset(e.target); mode = 'functional'; render(); };
    container.querySelector('#btn-iso-geom').onclick = function(e){ setActivePreset(e.target); mode = 'geometrical'; render(); };
    render();
  }
};

// ==========================================
// 4. arrowpusher: Curved-Arrow Reaction Mechanism & Intermediate Analyzer
// ==========================================
window.SIMS.arrowpusher = {
  mount: function(container){
    var intermediate = 'carbocation'; // carbocation, carbanion, radical

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip active" id="btn-carbocation">Carbocation (R₃C⁺)</button>' +
      '    <button class="filter-chip" id="btn-carbanion">Carbanion (R₃C⁻)</button>' +
      '    <button class="filter-chip" id="btn-radical">Free Radical (R₃C•)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-arrow" viewBox="0 0 700 240" style="width:100%;height:auto;max-height:240px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="arrow-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-arrow');
      var rd = document.getElementById('arrow-readout');
      if(!svg || !rd) return;

      var name, hyb, electrons, shape, stabilityOrder, arrowType, desc, svgContent;
      if(intermediate === 'carbocation'){
        name = 'Carbocation (Carbonium Ion: R₃C⁺)';
        hyb = 'sp² hybridised';
        electrons = '6 valence electrons (Electron sextet, highly electrophilic Lewis acid)';
        shape = 'Trigonal planar with an empty unhybridized 2p_z orbital';
        stabilityOrder = '(CH₃)₃C⁺ (3°) > (CH₃)₂CH⁺ (2°) > CH₃CH₂⁺ (1°) > CH₃⁺';
        arrowType = 'Heterolytic Cleavage: double-headed curved arrow (↷) transfers 2 electrons to leaving group.';
        desc = 'Formed when a C–X bond breaks heterolytically and X takes both bonding electrons: R₃C–X ⟶ R₃C⁺ + :X⁻. Stabilized by electron-donating alkyl groups via +I inductive effect and hyperconjugation (σ_C-H ⟶ empty 2p overlap).';
        svgContent = 
          '<g transform="translate(350, 120)">' +
          '  <!-- Planar bonds -->' +
          '  <line x1="0" y1="0" x2="-80" y2="45" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="0" y1="0" x2="80" y2="45" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="0" y1="0" x2="0" y2="-75" stroke="#38bdf8" stroke-width="4"/>' +
          '  <!-- Empty 2p orbital lobes -->' +
          '  <ellipse cx="0" cy="-35" rx="14" ry="32" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,2"/>' +
          '  <ellipse cx="0" cy="35" rx="14" ry="32" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,2"/>' +
          '  <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>' +
          '  <text x="0" y="6" text-anchor="middle" fill="#ef4444" font-size="16" font-weight="bold">C⁺</text>' +
          '  <text x="-90" y="55" fill="#f8fafc" font-size="13" font-weight="bold">R</text>' +
          '  <text x="90" y="55" fill="#f8fafc" font-size="13" font-weight="bold">R</text>' +
          '  <text x="0" y="-85" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="bold">R</text>' +
          '  <text x="50" y="-25" fill="#ef4444" font-size="12">Empty 2p_z</text>' +
          '</g>';
      } else if(intermediate === 'carbanion'){
        name = 'Carbanion (R₃C:⁻)';
        hyb = 'sp³ hybridised';
        electrons = '8 valence electrons (Electron octet + unshared lone pair, nucleophilic)';
        shape = 'Pyramidal (like ammonia NH₃)';
        stabilityOrder = 'CH₃⁻ > CH₃CH₂⁻ (1°) > (CH₃)₂CH⁻ (2°) > (CH₃)₃C⁻ (3°)';
        arrowType = 'Heterolytic Cleavage: double-headed arrow places 2 electrons on carbon atom: R₃C–Z ⟶ R₃C:⁻ + Z⁺.';
        desc = 'Formed when a leaving group departs without electrons. The unshared pair repels bond pairs. Electron-donating alkyl groups intensify negative charge and destabilize carbanions; electron-withdrawing groups (-I, -R such as -NO₂, -CN) stabilize carbanions.';
        svgContent = 
          '<g transform="translate(350, 130)">' +
          '  <!-- Pyramidal bonds -->' +
          '  <line x1="0" y1="10" x2="-75" y2="55" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="0" y1="10" x2="75" y2="55" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="0" y1="10" x2="0" y2="70" stroke="#64748b" stroke-width="5"/>' +
          '  <!-- sp3 lone pair lobe -->' +
          '  <ellipse cx="0" cy="-35" rx="16" ry="32" fill="#10b981" opacity="0.4" stroke="#10b981" stroke-width="2"/>' +
          '  <circle cx="-5" cy="-40" r="3" fill="#10b981"/>' +
          '  <circle cx="5" cy="-40" r="3" fill="#10b981"/>' +
          '  <circle cx="0" cy="10" r="22" fill="#1e293b" stroke="#10b981" stroke-width="3"/>' +
          '  <text x="0" y="16" text-anchor="middle" fill="#10b981" font-size="15" font-weight="bold">C:⁻</text>' +
          '  <text x="-85" y="65" fill="#f8fafc" font-size="13" font-weight="bold">R</text>' +
          '  <text x="85" y="65" fill="#f8fafc" font-size="13" font-weight="bold">R</text>' +
          '  <text x="0" y="90" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="bold">R</text>' +
          '  <text x="50" y="-35" fill="#10b981" font-size="12">Lone Pair in sp³ lobe</text>' +
          '</g>';
      } else {
        name = 'Carbon Free Radical (R₃C•)';
        hyb = 'sp² (Planar) or shallow pyramid';
        electrons = '7 valence electrons (Odd-electron paramagnetic species)';
        shape = 'Planar geometry with single unpaired electron in 2p_z orbital';
        stabilityOrder = '(CH₃)₃C• (3°) > (CH₃)₂CH• (2°) > CH₃CH₂• (1°) > •CH₃';
        arrowType = 'Homolytic Cleavage: single-barbed fishhook arrow (⇁) transfers 1 electron: R₃C–R ⟶ R₃C• + •R.';
        desc = 'Formed symmetrically under UV light, heat (pyrolysis), or peroxides. Stabilized by hyperconjugation and resonance similar to carbocations.';
        svgContent = 
          '<g transform="translate(350, 120)">' +
          '  <line x1="0" y1="0" x2="-80" y2="45" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="0" y1="0" x2="80" y2="45" stroke="#38bdf8" stroke-width="4"/>' +
          '  <line x1="0" y1="0" x2="0" y2="-75" stroke="#38bdf8" stroke-width="4"/>' +
          '  <ellipse cx="0" cy="-35" rx="14" ry="30" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" stroke-width="2"/>' +
          '  <ellipse cx="0" cy="35" rx="14" ry="30" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" stroke-width="2"/>' +
          '  <circle cx="0" cy="-38" r="4" fill="#f59e0b"/>' +
          '  <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/>' +
          '  <text x="0" y="6" text-anchor="middle" fill="#f59e0b" font-size="16" font-weight="bold">C•</text>' +
          '  <text x="-90" y="55" fill="#f8fafc" font-size="13" font-weight="bold">R</text>' +
          '  <text x="90" y="55" fill="#f8fafc" font-size="13" font-weight="bold">R</text>' +
          '  <text x="0" y="-85" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="bold">R</text>' +
          '  <text x="50" y="-35" fill="#f59e0b" font-size="12">Single Unpaired e⁻</text>' +
          '</g>';
      }

      svg.innerHTML = svgContent;
      rd.innerHTML = 
        '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + name + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:8px;margin-bottom:8px;">' +
        '  <div><b>Hybridization:</b> ' + hyb + '</div>' +
        '  <div><b>Valence Electrons:</b> ' + electrons + '</div>' +
        '  <div><b>Geometry:</b> ' + shape + '</div>' +
        '  <div><b>Cleavage & Arrows:</b> ' + arrowType + '</div>' +
        '</div>' +
        '<div style="margin-top:4px;"><b>Stability Hierarchy:</b> <code style="color:var(--accent);font-weight:bold;">' + stabilityOrder + '</code></div>' +
        '<div style="margin-top:6px;font-size:12.5px;color:var(--muted);">' + desc + '</div>';
    }

    container.querySelector('#btn-carbocation').onclick = function(e){ setActivePreset(e.target); intermediate = 'carbocation'; render(); };
    container.querySelector('#btn-carbanion').onclick = function(e){ setActivePreset(e.target); intermediate = 'carbanion'; render(); };
    container.querySelector('#btn-radical').onclick = function(e){ setActivePreset(e.target); intermediate = 'radical'; render(); };
    render();
  }
};

// ==========================================
// 5. hyperlab: Electronic Displacement & Hyperconjugation Lab
// ==========================================
window.SIMS.hyperlab = {
  mount: function(container){
    var alphaH = 9; // 0, 3, 6, 9 for CH3+, 1°, 2°, 3°

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <label style="font-size:13px;font-weight:600;">Number of Hyperconjugative α-Hydrogens:</label>' +
      '    <input type="range" id="rng-alpha" min="0" max="9" step="3" value="9" style="width:200px;cursor:pointer;">' +
      '    <span id="alpha-val" style="font-weight:bold;color:var(--primary);font-size:15px;">9 α-H (tert-Butyl)</span>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-hyper" viewBox="0 0 700 240" style="width:100%;height:auto;max-height:240px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="hyper-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-hyper');
      var rd = document.getElementById('hyper-readout');
      var valSpan = document.getElementById('alpha-val');
      if(!svg || !rd || !valSpan) return;

      var ionName, formula, structuresCount, relStab, heatOfForm, explanation;
      if(alphaH === 0){
        ionName = 'Methyl Carbocation (CH₃⁺)';
        formula = 'CH₃⁺ (0 α-hydrogens)';
        structuresCount = '1 structure (no hyperconjugative canonical forms)';
        relStab = 'Least Stable (Highest Energy, cannot disperse positive charge)';
        heatOfForm = 'ΔH° = +1100 kJ/mol (Extremely high energy)';
        explanation = 'There are no adjacent C–H σ bonds to overlap with the empty 2p orbital on the carbonium center. It exists as an unstabilized high-energy intermediate.';
      } else if(alphaH === 3){
        ionName = 'Ethyl Carbocation (CH₃CH₂⁺, 1°)';
        formula = 'CH₃–CH₂⁺ (3 α-hydrogens)';
        structuresCount = '4 canonical structures (1 normal + 3 no-bond resonance forms)';
        relStab = 'Moderately Stable';
        heatOfForm = 'ΔH° = +904 kJ/mol';
        explanation = 'The 3 C–H σ bonds of the adjacent methyl group overlap with the empty 2p_z orbital, delocalizing the positive charge onto the 3 hydrogen atoms.';
      } else if(alphaH === 6){
        ionName = 'Isopropyl Carbocation ((CH₃)₂CH⁺, 2°)';
        formula = '(CH₃)₂CH⁺ (6 α-hydrogens)';
        structuresCount = '7 canonical structures (1 normal + 6 no-bond resonance forms)';
        relStab = 'Highly Stable';
        heatOfForm = 'ΔH° = +808 kJ/mol';
        explanation = 'Two flanking methyl groups provide 6 α-hydrogens for hyperconjugative overlap, significantly dispersing positive charge and lowering potential energy.';
      } else {
        ionName = 'tert-Butyl Carbocation ((CH₃)₃C⁺, 3°)';
        formula = '(CH₃)₃C⁺ (9 α-hydrogens)';
        structuresCount = '10 canonical structures (1 normal + 9 no-bond resonance forms)';
        relStab = 'Most Stable Carbocation in Class 11 Syllabus';
        heatOfForm = 'ΔH° = +732 kJ/mol (Lowest potential energy)';
        explanation = 'Three surrounding methyl groups furnish 9 α-hydrogens. Hyperconjugation (Baker-Nathan effect) + combined +I inductive effect maximizes electron density donation into the electron-deficient sp² orbital.';
      }

      valSpan.innerText = alphaH + ' α-H (' + (alphaH === 0 ? 'Methyl' : (alphaH === 3 ? '1° Ethyl' : (alphaH === 6 ? '2° Isopropyl' : '3° tert-Butyl'))) + ')';

      // SVG showing overlap between C-H sigma and empty 2p
      svg.innerHTML = 
        '<g transform="translate(350, 110)">' +
        '  <!-- Carbocation Center -->' +
        '  <circle cx="80" cy="0" r="26" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>' +
        '  <text x="80" y="8" text-anchor="middle" fill="#ef4444" font-size="18" font-weight="bold">C⁺</text>' +
        '  <!-- Empty 2p orbital on C+ -->' +
        '  <ellipse cx="80" cy="-45" rx="15" ry="35" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,2"/>' +
        '  <ellipse cx="80" cy="45" rx="15" ry="35" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,2"/>' +
        '  <text x="130" y="-45" fill="#ef4444" font-size="12">Empty 2p</text>' +
        '  <!-- Adjacent Carbon -->' +
        '  <line x1="-80" y1="0" x2="54" y2="0" stroke="#38bdf8" stroke-width="4"/>' +
        '  <circle cx="-80" cy="0" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
        '  <text x="-80" y="6" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">C(α)</text>' +
        '  <!-- Overlapping Alpha C-H bond -->' +
        (alphaH > 0 ? 
          '<line x1="-80" y1="0" x2="-20" y2="-60" stroke="#10b981" stroke-width="5"/>' +
          '<circle cx="-20" cy="-60" r="14" fill="#f8fafc"/><text x="-20" y="-55" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="bold">H⁺</text>' +
          '<path d="M -20 -40 C 20 -60 50 -60 70 -45" stroke="#10b981" stroke-width="3" stroke-dasharray="4,3" fill="none"/>' +
          '<text x="25" y="-70" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">σ(C–H) ⟶ 2p delocalization</text>' +
          '<text x="350" y="80" text-anchor="middle" fill="#94a3b8" font-size="12">No-Bond Resonance Canonical Form Active</text>'
          : '<text x="0" y="60" text-anchor="middle" fill="#94a3b8" font-size="13">No α C–H bonds available for hyperconjugation</text>'
        ) +
        '</g>';

      rd.innerHTML = 
        '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + ionName + ' (' + formula + ')</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:8px;margin-bottom:8px;">' +
        '  <div><b>Resonance Forms:</b> ' + structuresCount + '</div>' +
        '  <div><b>Relative Stability:</b> <span style="color:#10b981;font-weight:bold;">' + relStab + '</span></div>' +
        '  <div><b>Heat of Formation:</b> ' + heatOfForm + '</div>' +
        '</div>' +
        '<div style="color:var(--muted);font-size:13px;line-height:1.5;">' + explanation + '</div>';
    }

    container.querySelector('#rng-alpha').oninput = function(e){ alphaH = parseInt(e.target.value); render(); };
    render();
  }
};

// ==========================================
// 6. purificationlab: Fractional & Steam Distillation / Chromatography Simulator
// ==========================================
window.SIMS.purificationlab = {
  mount: function(container){
    var method = 'steam'; // simple, fractional, steam, tlc

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip" id="btn-pur-simple">Simple Distillation (ΔT > 25°C)</button>' +
      '    <button class="filter-chip" id="btn-pur-fract">Fractional Distillation (Vigreux Column)</button>' +
      '    <button class="filter-chip active" id="btn-pur-steam">Steam Distillation (Aniline + Water)</button>' +
      '    <button class="filter-chip" id="btn-pur-tlc">TLC Chromatography (Rf Calculator)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-pur" viewBox="0 0 700 250" style="width:100%;height:auto;max-height:250px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="pur-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-pur');
      var rd = document.getElementById('pur-readout');
      if(!svg || !rd) return;

      var title, principle, mathFormula, svgContent;
      if(method === 'simple'){
        title = 'Simple Distillation — For Liquids Differing in Boiling Point by > 25°C';
        principle = 'Used to separate volatile liquids from non-volatile impurities, or liquids having a large difference in boiling point (e.g., Chloroform b.p. 60°C and Aniline b.p. 184°C; or Ether b.p. 35°C and Toluene b.p. 111°C). The lower-boiling liquid vaporizes first, condenses in the Liebig condenser, and collects in the receiver.';
        mathFormula = 'Criterion: ΔT_boiling > 25 K';
        svgContent = 
          '<!-- Distillation Flask -->' +
          '<path d="M 180 180 C 140 180 130 140 160 110 L 160 50 L 180 50 L 180 110 C 210 140 200 180 180 180 Z" fill="#38bdf8" opacity="0.3" stroke="#38bdf8" stroke-width="2"/>' +
          '<rect x="155" y="140" width="30" height="35" fill="#f59e0b" opacity="0.6"/>' +
          '<!-- Condenser -->' +
          '<line x1="170" y1="70" x2="380" y2="150" stroke="#94a3b8" stroke-width="12"/>' +
          '<line x1="170" y1="70" x2="380" y2="150" stroke="#38bdf8" stroke-width="4"/>' +
          '<rect x="220" y="80" width="110" height="40" fill="#38bdf8" opacity="0.2" stroke="#38bdf8" transform="rotate(20 275 100)"/>' +
          '<!-- Receiver Flask -->' +
          '<path d="M 420 220 L 380 155 L 400 155 L 440 220 Z" fill="#10b981" opacity="0.4" stroke="#10b981" stroke-width="2"/>' +
          '<text x="170" y="210" text-anchor="middle" fill="#e2e8f0" font-size="12">Boiling Flask</text>' +
          '<text x="280" y="60" text-anchor="middle" fill="#38bdf8" font-size="12">Liebig Condenser (Water Cooling)</text>' +
          '<text x="410" y="240" text-anchor="middle" fill="#10b981" font-size="12">Distillate Receiver</text>';
      } else if(method === 'fractional'){
        title = 'Fractional Distillation — Vigreux Column with Repeated Vaporization Cycles';
        principle = 'When the boiling point difference ΔT is small (< 25°C, such as crude oil fractions or benzene and toluene), simple distillation cannot achieve pure separation. A fractionating column provides multiple theoretical plates: rising vapor condenses on glass packings and is re-vaporized by ascending hotter vapors, enriching the vapor in the more volatile component.';
        mathFormula = 'Raoult\'s Law & Multiple Theoretical Plates';
        svgContent = 
          '<!-- Vigreux Column -->' +
          '<rect x="200" y="40" width="40" height="150" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>' +
          '<path d="M 200 60 L 220 70 L 200 80 M 240 90 L 220 100 L 240 110 M 200 120 L 220 130 L 200 140 M 240 150 L 220 160 L 240 170" stroke="#f59e0b" stroke-width="3" fill="none"/>' +
          '<text x="220" y="215" text-anchor="middle" fill="#e2e8f0" font-size="12">Vigreux Column</text>' +
          '<text x="220" y="230" text-anchor="middle" fill="#94a3b8" font-size="11">Repeated Condensation-Vaporization</text>' +
          '<!-- Thermometer -->' +
          '<line x1="220" y1="20" x2="220" y2="55" stroke="#ef4444" stroke-width="3"/>' +
          '<!-- Sidearm to Condenser -->' +
          '<line x1="240" y1="50" x2="450" y2="130" stroke="#38bdf8" stroke-width="6"/>' +
          '<text x="420" y="70" fill="#38bdf8" font-size="13">Enriched Volatile Vapor ⟶</text>';
      } else if(method === 'steam'){
        title = 'Steam Distillation — Dalton\'s Law of Immiscible Liquids (Aniline + Water)';
        principle = 'Used for substances that are steam volatile and completely immiscible with water (e.g. Aniline, Nitrobenzene, essential oils). The mixture boils when total vapor pressure P_total = p_organic + p_water = 1 atm. Because water contributes substantial vapor pressure, the mixture boils below 100°C (at 98.5°C for aniline-water), safely below aniline\'s decomposition boiling point of 184°C!';
        mathFormula = 'P_total = p_org + p_water = 1 atm; \\quad \\frac{w_{org}}{w_{water}} = \\frac{p_{org} \\cdot M_{org}}{p_{water} \\cdot M_{water}}';
        svgContent = 
          '<!-- Steam Generator Flask -->' +
          '<rect x="120" y="110" width="80" height="90" rx="8" fill="#38bdf8" opacity="0.2" stroke="#38bdf8" stroke-width="2"/>' +
          '<text x="160" y="160" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">Steam Gen</text>' +
          '<!-- Steam Tube into Organic Flask -->' +
          '<path d="M 160 110 L 160 60 L 320 60 L 320 170" stroke="#f8fafc" stroke-width="3" fill="none"/>' +
          '<!-- Mixture Flask -->' +
          '<rect x="280" y="100" width="80" height="100" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>' +
          '<rect x="282" y="150" width="76" height="48" fill="#38bdf8" opacity="0.4"/>' +
          '<rect x="282" y="135" width="76" height="15" fill="#f59e0b" opacity="0.7"/>' +
          '<text x="320" y="146" text-anchor="middle" fill="#0f172a" font-size="10" font-weight="bold">Aniline</text>' +
          '<text x="320" y="175" text-anchor="middle" fill="#f8fafc" font-size="10" font-weight="bold">Water</text>' +
          '<!-- Vapor Delivery Tube -->' +
          '<path d="M 320 100 L 320 75 L 500 140" stroke="#10b981" stroke-width="4" fill="none"/>' +
          '<text x="320" y="225" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="bold">Boils at 98.5°C (< 100°C)</text>' +
          '<text x="500" y="170" text-anchor="middle" fill="#10b981" font-size="12">Immiscible Condensate</text>';
      } else {
        title = 'Thin-Layer Chromatography (TLC) — Retention Factor (Rf) Engine';
        principle = 'Differential partition / adsorption between stationary phase (silica gel sheet) and moving mobile phase (eluting solvent). The more strongly adsorbed component travels slower. The retention factor Rf is an intrinsic physical constant under standardized conditions.';
        mathFormula = 'R_f = \\frac{\\text{Distance traveled by compound from baseline (a)}}{\\text{Distance traveled by solvent front from baseline (b)}}';
        svgContent = 
          '<!-- TLC Plate -->' +
          '<g transform="translate(300, 20)">' +
          '  <rect x="0" y="0" width="100" height="190" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>' +
          '  <!-- Baseline -->' +
          '  <line x1="10" y1="160" x2="90" y2="160" stroke="#94a3b8" stroke-width="2" stroke-dasharray="2,2"/>' +
          '  <text x="50" y="175" text-anchor="middle" fill="#475569" font-size="10">Baseline</text>' +
          '  <!-- Solvent Front -->' +
          '  <line x1="10" y1="30" x2="90" y2="30" stroke="#38bdf8" stroke-width="2"/>' +
          '  <text x="50" y="25" text-anchor="middle" fill="#38bdf8" font-size="10">Solvent Front (b = 13 cm)</text>' +
          '  <!-- Spot A -->' +
          '  <circle cx="50" cy="70" r="7" fill="#ec4899"/>' +
          '  <text x="80" y="74" fill="#ec4899" font-size="11" font-weight="bold">A (Rf=0.69)</text>' +
          '  <!-- Spot B -->' +
          '  <circle cx="50" cy="120" r="7" fill="#3b82f6"/>' +
          '  <text x="80" y="124" fill="#3b82f6" font-size="11" font-weight="bold">B (Rf=0.31)</text>' +
          '</g>';
      }

      svg.innerHTML = svgContent;
      rd.innerHTML = 
        '<div style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + title + '</div>' +
        '<div style="font-family:monospace;background:var(--paper-soft);padding:8px;border-radius:4px;color:var(--accent);margin-bottom:8px;font-size:13px;">' + mathFormula + '</div>' +
        '<div style="color:var(--muted);font-size:13px;line-height:1.5;">' + principle + '</div>';
    }

    container.querySelector('#btn-pur-simple').onclick = function(e){ setActivePreset(e.target); method = 'simple'; render(); };
    container.querySelector('#btn-pur-fract').onclick = function(e){ setActivePreset(e.target); method = 'fractional'; render(); };
    container.querySelector('#btn-pur-steam').onclick = function(e){ setActivePreset(e.target); method = 'steam'; render(); };
    container.querySelector('#btn-pur-tlc').onclick = function(e){ setActivePreset(e.target); method = 'tlc'; render(); };
    render();
  }
};

// ==========================================
// 7. elementalanalysis: Kjeldahl & Carius Quantitative Analysis Calculator
// ==========================================
window.SIMS.elementalanalysis = {
  mount: function(container){
    var testMode = 'kjeldahl'; // liebig, kjeldahl, carius_cl, carius_s

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip active" id="btn-ana-kjeldahl">Kjeldahl Nitrogen (%N: Ex 8.33)</button>' +
      '    <button class="filter-chip" id="btn-ana-cariuscl">Carius Chlorine (%Cl: Ex 8.34)</button>' +
      '    <button class="filter-chip" id="btn-ana-cariuss">Carius Sulfur (%S: Ex 8.35)</button>' +
      '    <button class="filter-chip" id="btn-ana-liebig">Liebig Combustion (%C & %H)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <div id="ana-inputs" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin-bottom:14px;"></div>' +
      '    <div id="ana-readout" style="padding:14px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:14px;line-height:1.6;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var inDiv = document.getElementById('ana-inputs');
      var rd = document.getElementById('ana-readout');
      if(!inDiv || !rd) return;

      if(testMode === 'kjeldahl'){
        inDiv.innerHTML = 
          '<div><label style="font-size:12px;font-weight:600;">Sample Mass m (g):</label><input type="number" id="in-m" value="0.50" step="0.01" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);"></div>' +
          '<div><label style="font-size:12px;font-weight:600;">Volume of Standard Acid V (mL):</label><input type="number" id="in-v" value="10.0" step="0.5" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);"></div>' +
          '<div><label style="font-size:12px;font-weight:600;">Acid Normality N (equiv/L):</label><input type="number" id="in-n" value="2.0" step="0.1" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);"></div>';

        function calcKj(){
          var m = parseFloat(document.getElementById('in-m').value) || 0.5;
          var v = parseFloat(document.getElementById('in-v').value) || 10.0;
          var n = parseFloat(document.getElementById('in-n').value) || 2.0;
          var meq = n * v;
          var pctN = (1.4 * n * v) / m;
          rd.innerHTML = 
            '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:8px;">Kjeldahl Nitrogen Determination Result:</div>' +
            '<div style="font-size:20px;font-weight:bold;color:#10b981;margin-bottom:8px;">% Nitrogen = ' + pctN.toFixed(2) + '%</div>' +
            '<div style="font-family:monospace;font-size:13px;background:var(--paper-soft);padding:10px;border-radius:6px;">' +
            '  Formula: %N = (1.4 × N × V) / m<br>' +
            '  = (1.4 × ' + n.toFixed(2) + ' N × ' + v.toFixed(1) + ' mL) / ' + m.toFixed(2) + ' g = <b>' + pctN.toFixed(2) + '%</b>' +
            '</div>' +
            '<div style="margin-top:10px;font-size:12.5px;color:var(--muted);">' +
            '  • Milligram equivalents of NH₃ neutralized = N × V = ' + meq.toFixed(1) + ' meq<br>' +
            '  • Note: Kjeldahl\'s method is <b>not applicable</b> to nitro (-NO₂), azo (-N=N-), or heterocyclic nitrogen (pyridine) as they cannot be quantitatively converted to (NH₄)₂SO₄.' +
            '</div>';
        }
        inDiv.querySelectorAll('input').forEach(function(inp){ inp.oninput = calcKj; });
        calcKj();
      } else if(testMode === 'cariuscl'){
        inDiv.innerHTML = 
          '<div><label style="font-size:12px;font-weight:600;">Organic Compound Mass m (g):</label><input type="number" id="in-m-cl" value="0.3780" step="0.001" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);"></div>' +
          '<div><label style="font-size:12px;font-weight:600;">Mass of AgCl Precipitate m₁ (g):</label><input type="number" id="in-agcl" value="0.5740" step="0.001" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);"></div>';

        function calcCl(){
          var m = parseFloat(document.getElementById('in-m-cl').value) || 0.3780;
          var mAgCl = parseFloat(document.getElementById('in-agcl').value) || 0.5740;
          var pctCl = (35.5 / 143.5) * (mAgCl / m) * 100;
          rd.innerHTML = 
            '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:8px;">Carius Chlorine Determination Result:</div>' +
            '<div style="font-size:20px;font-weight:bold;color:#38bdf8;margin-bottom:8px;">% Chlorine = ' + pctCl.toFixed(2) + '%</div>' +
            '<div style="font-family:monospace;font-size:13px;background:var(--paper-soft);padding:10px;border-radius:6px;">' +
            '  Formula: %Cl = (35.5 / 143.5) × (m_AgCl / m) × 100<br>' +
            '  = (35.5 / 143.5) × (' + mAgCl.toFixed(4) + ' / ' + m.toFixed(4) + ') × 100 = <b>' + pctCl.toFixed(2) + '%</b>' +
            '</div>' +
            '<div style="margin-top:10px;font-size:12.5px;color:var(--muted);">' +
            '  AgCl is a white curdy precipitate soluble in aqueous NH₄OH. 1 mol AgCl (143.5 g) contains 1 mol Cl (35.5 g).' +
            '</div>';
        }
        inDiv.querySelectorAll('input').forEach(function(inp){ inp.oninput = calcCl; });
        calcCl();
      } else if(testMode === 'cariuss'){
        inDiv.innerHTML = 
          '<div><label style="font-size:12px;font-weight:600;">Organic Compound Mass m (g):</label><input type="number" id="in-m-s" value="0.468" step="0.001" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);"></div>' +
          '<div><label style="font-size:12px;font-weight:600;">Mass of BaSO₄ Precipitate m₁ (g):</label><input type="number" id="in-baso4" value="0.668" step="0.001" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);"></div>';

        function calcS(){
          var m = parseFloat(document.getElementById('in-m-s').value) || 0.468;
          var mBa = parseFloat(document.getElementById('in-baso4').value) || 0.668;
          var pctS = (32 / 233) * (mBa / m) * 100;
          rd.innerHTML = 
            '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:8px;">Carius Sulfur Determination Result:</div>' +
            '<div style="font-size:20px;font-weight:bold;color:#f59e0b;margin-bottom:8px;">% Sulfur = ' + pctS.toFixed(2) + '%</div>' +
            '<div style="font-family:monospace;font-size:13px;background:var(--paper-soft);padding:10px;border-radius:6px;">' +
            '  Formula: %S = (32 / 233) × (m_BaSO₄ / m) × 100<br>' +
            '  = (32 / 233) × (' + mBa.toFixed(4) + ' / ' + m.toFixed(4) + ') × 100 = <b>' + pctS.toFixed(2) + '%</b>' +
            '</div>' +
            '<div style="margin-top:10px;font-size:12.5px;color:var(--muted);">' +
            '  Sulfur is oxidized by fuming HNO₃ to H₂SO₄, which precipitates with BaCl₂ as insoluble white BaSO₄.' +
            '</div>';
        }
        inDiv.querySelectorAll('input').forEach(function(inp){ inp.oninput = calcS; });
        calcS();
      } else {
        inDiv.innerHTML = 
          '<div><label style="font-size:12px;font-weight:600;">Sample Mass m (g):</label><input type="number" id="in-m-l" value="0.246" step="0.01" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);"></div>' +
          '<div><label style="font-size:12px;font-weight:600;">Mass of CO₂ Absorbed (g):</label><input type="number" id="in-co2" value="0.622" step="0.01" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);"></div>' +
          '<div><label style="font-size:12px;font-weight:600;">Mass of H₂O Absorbed (g):</label><input type="number" id="in-h2o" value="0.106" step="0.01" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);"></div>';

        function calcLiebig(){
          var m = parseFloat(document.getElementById('in-m-l').value) || 0.246;
          var mCO2 = parseFloat(document.getElementById('in-co2').value) || 0.622;
          var mH2O = parseFloat(document.getElementById('in-h2o').value) || 0.106;
          var pctC = (12 / 44) * (mCO2 / m) * 100;
          var pctH = (2 / 18) * (mH2O / m) * 100;
          var pctO = 100 - (pctC + pctH);
          if(pctO < 0) pctO = 0;

          rd.innerHTML = 
            '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:8px;">Liebig Combustion Analysis:</div>' +
            '<div style="display:flex;gap:20px;margin-bottom:8px;">' +
            '  <div><b>% Carbon:</b> <span style="color:#38bdf8;font-size:18px;font-weight:bold;">' + pctC.toFixed(2) + '%</span></div>' +
            '  <div><b>% Hydrogen:</b> <span style="color:#10b981;font-size:18px;font-weight:bold;">' + pctH.toFixed(2) + '%</span></div>' +
            '  <div><b>% Oxygen (by diff):</b> <span style="color:#ec4899;font-size:18px;font-weight:bold;">' + pctO.toFixed(2) + '%</span></div>' +
            '</div>' +
            '<div style="font-family:monospace;font-size:13px;background:var(--paper-soft);padding:10px;border-radius:6px;">' +
            '  %C = (12 / 44) × (' + mCO2.toFixed(3) + ' / ' + m.toFixed(3) + ') × 100 = ' + pctC.toFixed(2) + '%<br>' +
            '  %H = (2 / 18) × (' + mH2O.toFixed(3) + ' / ' + m.toFixed(3) + ') × 100 = ' + pctH.toFixed(2) + '%' +
            '</div>';
        }
        inDiv.querySelectorAll('input').forEach(function(inp){ inp.oninput = calcLiebig; });
        calcLiebig();
      }
    }

    container.querySelector('#btn-ana-kjeldahl').onclick = function(e){ setActivePreset(e.target); testMode = 'kjeldahl'; render(); };
    container.querySelector('#btn-ana-cariuscl').onclick = function(e){ setActivePreset(e.target); testMode = 'cariuscl'; render(); };
    container.querySelector('#btn-ana-cariuss').onclick = function(e){ setActivePreset(e.target); testMode = 'cariuss'; render(); };
    container.querySelector('#btn-ana-liebig').onclick = function(e){ setActivePreset(e.target); testMode = 'liebig'; render(); };
    render();
  }
};

// Map concept aliases
window.SIMS.c1 = window.SIMS.hybridviewer;
window.SIMS.c2 = window.SIMS.iupacbuilder;
window.SIMS.c3 = window.SIMS.isomersim;
window.SIMS.c4 = window.SIMS.arrowpusher;
window.SIMS.c5 = window.SIMS.hyperlab;
window.SIMS.c6 = window.SIMS.purificationlab;
window.SIMS.c7 = window.SIMS.elementalanalysis;
