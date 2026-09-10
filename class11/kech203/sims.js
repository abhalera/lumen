
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
// 1. conformationlab: Ethane & Butane Newman / Sawhorse Rotator
// ==========================================
window.SIMS.conformationlab = {
  mount: function(container){
    var angle = 60; // dihedral angle
    var mol = 'ethane'; // ethane, butane

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip active" id="btn-eth-stag">Ethane Staggered (60°, Min Strain)</button>' +
      '    <button class="filter-chip" id="btn-eth-ecl">Ethane Eclipsed (0°, Max Strain)</button>' +
      '    <button class="filter-chip" id="btn-but-anti">Butane Anti (180°, 0 kJ/mol)</button>' +
      '    <button class="filter-chip" id="btn-but-gauche">Butane Gauche (60°, 3.8 kJ/mol)</button>' +
      '    <button class="filter-chip" id="btn-but-ecl">Butane Eclipsed (120°, 16 kJ/mol)</button>' +
      '  </div>' +
      '  <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <label style="font-size:13px;font-weight:600;">Dihedral Angle (θ):</label>' +
      '    <input type="range" id="rng-dihedral" min="0" max="360" value="60" style="width:220px;cursor:pointer;">' +
      '    <span id="dihedral-val" style="font-weight:bold;color:var(--primary);font-size:15px;">60° (Staggered)</span>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-newman" viewBox="0 0 700 260" style="width:100%;height:auto;max-height:260px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="newman-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-newman');
      var rd = document.getElementById('newman-readout');
      var valSpan = document.getElementById('dihedral-val');
      if(!svg || !rd || !valSpan) return;

      var rad = (angle * Math.PI) / 180;
      var radFront1 = -Math.PI / 2; // 12 o'clock
      var radFront2 = radFront1 + (2 * Math.PI / 3);
      var radFront3 = radFront1 + (4 * Math.PI / 3);

      var radBack1 = radFront1 + rad;
      var radBack2 = radFront2 + rad;
      var radBack3 = radFront3 + rad;

      // Energy calculation
      var energy, confName, stabilityTxt;
      if(mol === 'ethane'){
        // E = (V0 / 2) * (1 - cos(3 * theta)) where V0 = 12.55 kJ/mol
        energy = (12.55 / 2) * (1 - Math.cos(3 * rad));
        if(angle % 120 === 60) { confName = 'Staggered Conformation'; stabilityTxt = '<span style="color:#10b981;font-weight:bold;">Global Energy Minimum (Most Stable, 0 kJ/mol)</span>'; }
        else if(angle % 120 === 0) { confName = 'Eclipsed Conformation'; stabilityTxt = '<span style="color:#ef4444;font-weight:bold;">Maximum Torsional Strain (12.55 kJ/mol, Least Stable)</span>'; }
        else { confName = 'Skew / Intermediate Conformation'; stabilityTxt = '<span style="color:#f59e0b;font-weight:bold;">Intermediate Torsional Energy</span>'; }
      } else {
        // Butane
        if(Math.abs(angle - 180) <= 5) { confName = 'Anti Conformation'; energy = 0.0; stabilityTxt = '<span style="color:#10b981;font-weight:bold;">Global Minimum: Anti-Staggered (0.0 kJ/mol)</span>'; }
        else if(Math.abs(angle - 60) <= 5 || Math.abs(angle - 300) <= 5) { confName = 'Gauche Conformation'; energy = 3.8; stabilityTxt = '<span style="color:#38bdf8;font-weight:bold;">Local Minimum: Gauche (Steric Strain 3.8 kJ/mol)</span>'; }
        else if(Math.abs(angle - 120) <= 5 || Math.abs(angle - 240) <= 5) { confName = 'Eclipsed Conformation (CH₃/H)'; energy = 16.0; stabilityTxt = '<span style="color:#f59e0b;font-weight:bold;">Torsional + Steric Barrier (16.0 kJ/mol)</span>'; }
        else if(angle === 0 || angle === 360) { confName = 'Fully Eclipsed (CH₃/CH₃)'; energy = 19.0; stabilityTxt = '<span style="color:#ef4444;font-weight:bold;">Global Maximum: Fully Eclipsed (19.0 kJ/mol)</span>'; }
        else { confName = 'Skew Butane Conformation'; energy = 8.5; stabilityTxt = 'Non-stationary rotamer'; }
      }

      valSpan.innerHTML = angle + '° · ' + confName;

      // Draw Newman projection in SVG
      var cx = 350, cy = 130, R = 58, L = 88;

      // Rear circle
      var rearBonds = '';
      var rearLigand1 = mol === 'ethane' ? 'H' : 'CH₃';
      var rearLigands = [rearLigand1, 'H', 'H'];
      var rearAngles = [radBack1, radBack2, radBack3];
      for(var i = 0; i < 3; i++){
        var bx1 = cx + R * Math.cos(rearAngles[i]);
        var by1 = cy + R * Math.sin(rearAngles[i]);
        var bx2 = cx + L * Math.cos(rearAngles[i]);
        var by2 = cy + L * Math.sin(rearAngles[i]);
        rearBonds += '<line x1="' + bx1 + '" y1="' + by1 + '" x2="' + bx2 + '" y2="' + by2 + '" stroke="#94a3b8" stroke-width="4"/>' +
                     '<circle cx="' + bx2 + '" cy="' + by2 + '" r="15" fill="#f8fafc"/>' +
                     '<text x="' + bx2 + '" y="' + (by2 + 4) + '" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">' + rearLigands[i] + '</text>';
      }

      // Front bonds from center
      var frontBonds = '';
      var frontLigand1 = mol === 'ethane' ? 'H' : 'CH₃';
      var frontLigands = [frontLigand1, 'H', 'H'];
      var frontAngles = [radFront1, radFront2, radFront3];
      for(var j = 0; j < 3; j++){
        var fx2 = cx + L * Math.cos(frontAngles[j]);
        var fy2 = cy + L * Math.sin(frontAngles[j]);
        frontBonds += '<line x1="' + cx + '" y1="' + cy + '" x2="' + fx2 + '" y2="' + fy2 + '" stroke="#38bdf8" stroke-width="5"/>' +
                      '<circle cx="' + fx2 + '" cy="' + fy2 + '" r="15" fill="#38bdf8"/>' +
                      '<text x="' + fx2 + '" y="' + (fy2 + 4) + '" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">' + frontLigands[j] + '</text>';
      }

      svg.innerHTML = 
        '<!-- Rear Carbon Circle -->' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="#1e293b" stroke="#94a3b8" stroke-width="4"/>' +
        rearBonds +
        frontBonds +
        '<!-- Front Carbon Center Point -->' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/>' +
        '<text x="60" y="40" fill="#38bdf8" font-size="12" font-weight="bold">■ Front Carbon (Center dot)</text>' +
        '<text x="60" y="60" fill="#94a3b8" font-size="12" font-weight="bold">■ Rear Carbon (Outer circle)</text>';

      rd.innerHTML = 
        '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + (mol === 'ethane' ? 'Ethane' : 'Butane') + ': ' + confName + ' (θ = ' + angle + '°)</div>' +
        '<div style="display:flex;gap:20px;margin-bottom:8px;font-size:14px;">' +
        '  <div><b>Potential Energy:</b> <span style="font-size:16px;color:#f59e0b;font-weight:bold;">' + energy.toFixed(2) + ' kJ/mol</span></div>' +
        '  <div><b>Conformational Status:</b> ' + stabilityTxt + '</div>' +
        '</div>' +
        '<div style="color:var(--muted);font-size:12.5px;">' +
        '  • <b>Torsional Strain Origin:</b> Repulsive overlap between bonding electron clouds of adjacent C–H (or C–C) σ-bonds when dihedral angle approaches 0°.<br>' +
        '  • <b>Thermal Rotation:</b> At 298 K, ambient thermal energy (RT ≈ 2.48 kJ/mol) causes rotation about the C–C σ-bond at a frequency of ~10¹¹ rotations per second.' +
        '</div>';
    }

    container.querySelector('#rng-dihedral').oninput = function(e){ angle = parseInt(e.target.value); render(); };
    container.querySelector('#btn-eth-stag').onclick = function(e){ setActivePreset(e.target); mol = 'ethane'; angle = 60; document.getElementById('rng-dihedral').value = 60; render(); };
    container.querySelector('#btn-eth-ecl').onclick = function(e){ setActivePreset(e.target); mol = 'ethane'; angle = 0; document.getElementById('rng-dihedral').value = 0; render(); };
    container.querySelector('#btn-but-anti').onclick = function(e){ setActivePreset(e.target); mol = 'butane'; angle = 180; document.getElementById('rng-dihedral').value = 180; render(); };
    container.querySelector('#btn-but-gauche').onclick = function(e){ setActivePreset(e.target); mol = 'butane'; angle = 60; document.getElementById('rng-dihedral').value = 60; render(); };
    container.querySelector('#btn-but-ecl').onclick = function(e){ setActivePreset(e.target); mol = 'butane'; angle = 120; document.getElementById('rng-dihedral').value = 120; render(); };
    render();
  }
};

// ==========================================
// 2. freeradicalsim: Free-Radical Chain Halogenation & Cracking Simulator
// ==========================================
window.SIMS.freeradicalsim = {
  mount: function(container){
    var step = 'initiation'; // initiation, prop1, prop2, term_ethane, wurtz

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip active" id="btn-rad-init">1. Initiation (Cl₂ ⟶ 2 Cl•)</button>' +
      '    <button class="filter-chip" id="btn-rad-prop1">2. Propagation A (Cl• + CH₄)</button>' +
      '    <button class="filter-chip" id="btn-rad-prop2">3. Propagation B (•CH₃ + Cl₂)</button>' +
      '    <button class="filter-chip" id="btn-rad-term">4. Termination: Ethane (Ex 9.1)</button>' +
      '    <button class="filter-chip" id="btn-rad-wurtz">5. Wurtz Odd-Alkane Flaw (Ex 9.25)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-radical" viewBox="0 0 700 220" style="width:100%;height:auto;max-height:220px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="rad-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-radical');
      var rd = document.getElementById('rad-readout');
      if(!svg || !rd) return;

      var title, eq, deltaH, desc, svgContent;
      if(step === 'initiation'){
        title = 'Stage 1: Chain Initiation (Photochemical Homolysis of Chlorine)';
        eq = 'Cl–Cl \\xrightarrow{h\\nu \\text{ or } \\Delta} Cl^\\bullet + Cl^\\bullet';
        deltaH = '+242 kJ/mol (Endothermic homolytic cleavage)';
        desc = 'The Cl–Cl bond (bond enthalpy 242 kJ/mol) is significantly weaker than the C–H bond (414 kJ/mol) or C–C bond (347 kJ/mol). Absorption of a quantum of UV light (hν) promotes homolytic fission, generating two neutral, highly reactive chlorine free radicals possessing an unpaired electron.';
        svgContent = 
          '<g transform="translate(350, 100)">' +
          '  <line x1="-70" y1="0" x2="70" y2="0" stroke="#94a3b8" stroke-width="4"/>' +
          '  <circle cx="-70" cy="0" r="24" fill="#10b981"/><text x="-70" y="6" text-anchor="middle" fill="#0f172a" font-size="14" font-weight="bold">Cl</text>' +
          '  <circle cx="70" cy="0" r="24" fill="#10b981"/><text x="70" y="6" text-anchor="middle" fill="#0f172a" font-size="14" font-weight="bold">Cl</text>' +
          '  <!-- UV Photon Wave -->' +
          '  <path d="M -20 -60 Q 0 -40 20 -60 Q 40 -80 60 -60" stroke="#f59e0b" stroke-width="3" fill="none"/>' +
          '  <text x="0" y="-70" text-anchor="middle" fill="#f59e0b" font-size="14" font-weight="bold">hν (UV Photon)</text>' +
          '  <!-- Fishhook arrows -->' +
          '  <path d="M -15 -10 Q -35 -30 -50 -15" stroke="#38bdf8" stroke-width="2" fill="none"/>' +
          '  <path d="M 15 -10 Q 35 -30 50 -15" stroke="#38bdf8" stroke-width="2" fill="none"/>' +
          '  <text x="0" y="45" text-anchor="middle" fill="#38bdf8" font-size="12">Homolytic Cleavage (1 e⁻ to each Cl atom)</text>' +
          '</g>';
      } else if(step === 'prop1'){
        title = 'Stage 2: Chain Propagation A (Hydrogen Abstraction)';
        eq = 'Cl^\\bullet + H–CH_3 \\longrightarrow HCl + ^\\bullet CH_3';
        deltaH = '+4 kJ/mol (Slightly endothermic, rate-limiting)';
        desc = 'A chlorine radical collides with a methane molecule and abstracts a hydrogen atom, forming a molecule of HCl and generating a planar, sp² hybridized methyl free radical (•CH₃) with an odd unpaired electron.';
        svgContent = 
          '<g transform="translate(350, 100)">' +
          '  <circle cx="-160" cy="0" r="20" fill="#10b981"/><text x="-160" y="5" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="bold">Cl•</text>' +
          '  <text x="-100" y="6" fill="#f8fafc" font-size="16">+</text>' +
          '  <circle cx="-20" cy="0" r="22" fill="#38bdf8"/><text x="-20" y="6" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="bold">CH₄</text>' +
          '  <text x="50" y="6" fill="#f8fafc" font-size="16">⟶</text>' +
          '  <circle cx="120" cy="0" r="18" fill="#94a3b8"/><text x="120" y="5" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">HCl</text>' +
          '  <text x="170" y="6" fill="#f8fafc" font-size="16">+</text>' +
          '  <circle cx="220" cy="0" r="20" fill="#ef4444"/><text x="220" y="5" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="bold">•CH₃</text>' +
          '  <circle cx="220" cy="-28" r="4" fill="#ef4444"/>' +
          '  <text x="0" y="60" text-anchor="middle" fill="#ef4444" font-size="12">Generates reactive methyl free radical</text>' +
          '</g>';
      } else if(step === 'prop2'){
        title = 'Stage 2: Chain Propagation B (Chlorine Abstraction & Chain Regeneration)';
        eq = '^\\bullet CH_3 + Cl–Cl \\longrightarrow CH_3Cl + Cl^\\bullet';
        deltaH = '−109 kJ/mol (Exothermic, highly favorable)';
        desc = 'The methyl radical attacks a chlorine molecule, abstracting a chlorine atom to form the chloromethane product (CH₃Cl) while regenerating a fresh chlorine radical (Cl•). This newly formed Cl• immediately attacks another methane molecule, perpetuating thousands of propagation cycles!';
        svgContent = 
          '<g transform="translate(350, 100)">' +
          '  <circle cx="-160" cy="0" r="20" fill="#ef4444"/><text x="-160" y="5" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="bold">•CH₃</text>' +
          '  <text x="-100" y="6" fill="#f8fafc" font-size="16">+</text>' +
          '  <circle cx="-40" cy="0" r="18" fill="#10b981"/><circle cx="0" cy="0" r="18" fill="#10b981"/><text x="-20" y="5" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">Cl₂</text>' +
          '  <text x="50" y="6" fill="#f8fafc" font-size="16">⟶</text>' +
          '  <circle cx="120" cy="0" r="22" fill="#38bdf8"/><text x="120" y="5" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">CH₃Cl</text>' +
          '  <text x="170" y="6" fill="#f8fafc" font-size="16">+</text>' +
          '  <circle cx="220" cy="0" r="18" fill="#10b981"/><text x="220" y="5" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="bold">Cl•</text>' +
          '  <text x="0" y="60" text-anchor="middle" fill="#10b981" font-size="12">Cl• is regenerated to continue the chain</text>' +
          '</g>';
      } else if(step === 'term_ethane'){
        title = 'Stage 3: Chain Termination — Dimerization to Trace Ethane (NCERT Ex 9.1)';
        eq = '^\\bullet CH_3 + ^\\bullet CH_3 \\longrightarrow CH_3–CH_3 \\quad (\\text{Ethane, } C_2H_6)';
        deltaH = '−368 kJ/mol (Highly exothermic radical coupling)';
        desc = 'When two methyl free radicals collide in the gas phase, their unpaired electrons pair up to form a new carbon-carbon σ-bond. This termination pathway consumes free radicals and definitively explains the presence of trace amounts of ethane in the chlorination of pure methane!';
        svgContent = 
          '<g transform="translate(350, 100)">' +
          '  <circle cx="-100" cy="0" r="22" fill="#ef4444"/><text x="-100" y="6" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="bold">•CH₃</text>' +
          '  <circle cx="-100" cy="-30" r="4" fill="#f8fafc"/>' +
          '  <text x="-40" y="6" fill="#f8fafc" font-size="18">+</text>' +
          '  <circle cx="20" cy="0" r="22" fill="#ef4444"/><text x="20" y="6" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="bold">•CH₃</text>' +
          '  <circle cx="20" cy="-30" r="4" fill="#f8fafc"/>' +
          '  <text x="80" y="6" fill="#f8fafc" font-size="18">⟶</text>' +
          '  <circle cx="160" cy="0" r="20" fill="#38bdf8"/><circle cx="200" cy="0" r="20" fill="#38bdf8"/>' +
          '  <line x1="160" y1="0" x2="200" y2="0" stroke="#0f172a" stroke-width="4"/>' +
          '  <text x="180" y="35" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">Ethane (C₂H₆)</text>' +
          '</g>';
      } else {
        title = 'Wurtz Reaction of Mixed Alkyl Halides (NCERT Ex 9.25)';
        eq = 'CH_3I + C_2H_5I + 2 Na \\xrightarrow{\\text{dry ether}} C_2H_6 + C_3H_8 + C_4H_{10} + 2 NaI';
        deltaH = 'Statistical mixture of 3 alkanes (Poor yield of propane)';
        desc = 'When synthesizing odd-carbon propane from CH₃I and C₂H₅I, sodium reacts indiscriminately with both radicals. Three combinations occur: (1) •CH₃ + •CH₃ ⟶ Ethane (b.p. −89°C), (2) •CH₃ + •C₂H₅ ⟶ Propane (b.p. −42°C), (3) •C₂H₅ + •C₂H₅ ⟶ Butane (b.p. −0.5°C). The mixture is extremely difficult to separate, rendering Wurtz reaction unviable for odd-carbon alkanes.';
        svgContent = 
          '<g transform="translate(350, 90)">' +
          '  <text x="-250" y="10" fill="#f59e0b" font-size="13" font-weight="bold">CH₃I + C₂H₅I + 2 Na</text>' +
          '  <text x="-80" y="10" fill="#f8fafc" font-size="16">⟶</text>' +
          '  <text x="0" y="-30" fill="#38bdf8" font-size="12">1. Ethane (CH₃–CH₃): b.p. −89°C</text>' +
          '  <text x="0" y="10" fill="#10b981" font-size="13" font-weight="bold">2. Propane (CH₃–CH₂–CH₃): b.p. −42°C (Desired)</text>' +
          '  <text x="0" y="50" fill="#ec4899" font-size="12">3. Butane (CH₃CH₂CH₂CH₃): b.p. −0.5°C</text>' +
          '</g>';
      }

      svg.innerHTML = svgContent;
      rd.innerHTML = 
        '<div style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + title + '</div>' +
        '<div style="font-family:monospace;font-size:13px;background:var(--paper-soft);padding:8px;border-radius:4px;color:var(--accent);margin-bottom:8px;">' + eq + '</div>' +
        '<div style="margin-bottom:6px;"><b>Enthalpy Change:</b> ' + deltaH + '</div>' +
        '<div style="color:var(--muted);font-size:12.5px;">' + desc + '</div>';
    }

    container.querySelector('#btn-rad-init').onclick = function(e){ setActivePreset(e.target); step = 'initiation'; render(); };
    container.querySelector('#btn-rad-prop1').onclick = function(e){ setActivePreset(e.target); step = 'prop1'; render(); };
    container.querySelector('#btn-rad-prop2').onclick = function(e){ setActivePreset(e.target); step = 'prop2'; render(); };
    container.querySelector('#btn-rad-term').onclick = function(e){ setActivePreset(e.target); step = 'term_ethane'; render(); };
    container.querySelector('#btn-rad-wurtz').onclick = function(e){ setActivePreset(e.target); step = 'wurtz'; render(); };
    render();
  }
};

// ==========================================
// 3. cistranslab: Geometrical Isomerism & Dipole Moment Chamber
// ==========================================
window.SIMS.cistranslab = {
  mount: function(container){
    var compound = 'hexene'; // butene, hexene, dichloro

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip active" id="btn-geom-hex">Hex-2-ene (Ex 9.9: b.p. Comparison)</button>' +
      '    <button class="filter-chip" id="btn-geom-but">But-2-ene (cis vs trans)</button>' +
      '    <button class="filter-chip" id="btn-geom-dcl">1,2-Dichloroethene (Polarity)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-cistrans" viewBox="0 0 700 240" style="width:100%;height:auto;max-height:240px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="cistrans-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-cistrans');
      var rd = document.getElementById('cistrans-readout');
      if(!svg || !rd) return;

      var title, cisTxt, transTxt, r1, r2, explanation;
      if(compound === 'hexene'){
        title = 'Hex-2-ene (CH₃–CH=CH–CH₂CH₂CH₃) — NCERT Exercise 9.9';
        r1 = 'CH₃';
        r2 = 'C₃H₇';
        cisTxt = 'cis-Hex-2-ene: Polar (μ > 0), higher b.p. (68.8°C)';
        transTxt = 'trans-Hex-2-ene: Near-nonpolar (μ ≈ 0), lower b.p. (67.9°C)';
        explanation = 'In cis-hex-2-ene, the bond dipoles of the two electron-releasing alkyl groups (–CH₃ and –C₃H₇) point in the same general direction toward the sp² carbons, giving a net dipole moment. In trans-hex-2-ene, the bond moments oppose and cancel across the double bond. Stronger dipole-dipole attractions give cis-hex-2-ene the higher boiling point.';
      } else if(compound === 'butene'){
        title = 'But-2-ene (CH₃–CH=CH–CH₃)';
        r1 = 'CH₃';
        r2 = 'CH₃';
        cisTxt = 'cis-But-2-ene: μ = 0.33 D, b.p. 3.7°C, m.p. −139°C';
        transTxt = 'trans-But-2-ene: μ = 0.00 D, b.p. 0.9°C, m.p. −106°C';
        explanation = 'trans-But-2-ene is centrosymmetric: its two C–CH₃ bond moments cancel exactly (μ = 0). While cis-but-2-ene has a higher b.p. due to polarity, trans-but-2-ene has a significantly higher melting point (−106°C vs −139°C) because its symmetrical shape packs much more tightly into a solid crystal lattice.';
      } else {
        title = '1,2-Dichloroethene (CHCl=CHCl)';
        r1 = 'Cl';
        r2 = 'Cl';
        cisTxt = 'cis-1,2-Dichloroethene: μ = 1.90 D (Strongly Polar), b.p. 60.3°C';
        transTxt = 'trans-1,2-Dichloroethene: μ = 0.00 D (Completely Non-polar), b.p. 47.5°C';
        explanation = 'Chlorine is strongly electronegative. In the cis-isomer, two large C–Cl bond dipoles add vectorially to yield μ = 1.90 D. In the trans-isomer, the two C–Cl dipoles are equal and opposite at 180°, canceling completely to μ = 0.00 D, producing a 12.8°C boiling point difference!';
      }

      svg.innerHTML = 
        '<!-- CIS ISOMER -->' +
        '<g transform="translate(180, 110)">' +
        '  <line x1="-40" y1="0" x2="40" y2="0" stroke="#38bdf8" stroke-width="5"/>' +
        '  <line x1="-40" y1="-8" x2="40" y2="-8" stroke="#38bdf8" stroke-width="3"/>' +
        '  <line x1="-40" y1="0" x2="-80" y2="-50" stroke="#f59e0b" stroke-width="4"/><text x="-95" y="-55" fill="#f59e0b" font-size="13" font-weight="bold">' + r1 + '</text>' +
        '  <line x1="40" y1="0" x2="80" y2="-50" stroke="#f59e0b" stroke-width="4"/><text x="85" y="-55" fill="#f59e0b" font-size="13" font-weight="bold">' + r2 + '</text>' +
        '  <line x1="-40" y1="0" x2="-75" y2="40" stroke="#94a3b8" stroke-width="2"/><text x="-85" y="55" fill="#94a3b8" font-size="12">H</text>' +
        '  <line x1="40" y1="0" x2="75" y2="40" stroke="#94a3b8" stroke-width="2"/><text x="80" y="55" fill="#94a3b8" font-size="12">H</text>' +
        '  <!-- Resultant dipole arrow pointing up -->' +
        '  <line x1="0" y1="25" x2="0" y2="-30" stroke="#ec4899" stroke-width="3"/>' +
        '  <polygon points="0,-35 -5,-25 5,-25" fill="#ec4899"/>' +
        '  <text x="0" y="80" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="bold">cis-Isomer</text>' +
        '  <text x="0" y="98" text-anchor="middle" fill="#ec4899" font-size="11">Net Dipole μ > 0</text>' +
        '</g>' +
        '<!-- TRANS ISOMER -->' +
        '<g transform="translate(480, 110)">' +
        '  <line x1="-40" y1="0" x2="40" y2="0" stroke="#38bdf8" stroke-width="5"/>' +
        '  <line x1="-40" y1="-8" x2="40" y2="-8" stroke="#38bdf8" stroke-width="3"/>' +
        '  <line x1="-40" y1="0" x2="-80" y2="-50" stroke="#f59e0b" stroke-width="4"/><text x="-95" y="-55" fill="#f59e0b" font-size="13" font-weight="bold">' + r1 + '</text>' +
        '  <line x1="40" y1="0" x2="80" y2="50" stroke="#f59e0b" stroke-width="4"/><text x="85" y="65" fill="#f59e0b" font-size="13" font-weight="bold">' + r2 + '</text>' +
        '  <line x1="-40" y1="0" x2="-75" y2="40" stroke="#94a3b8" stroke-width="2"/><text x="-85" y="55" fill="#94a3b8" font-size="12">H</text>' +
        '  <line x1="40" y1="0" x2="75" y2="-40" stroke="#94a3b8" stroke-width="2"/><text x="80" y="-45" fill="#94a3b8" font-size="12">H</text>' +
        '  <text x="0" y="80" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="bold">trans-Isomer</text>' +
        '  <text x="0" y="98" text-anchor="middle" fill="#10b981" font-size="11">Dipoles Cancel (μ = 0)</text>' +
        '</g>';

      rd.innerHTML = 
        '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + title + '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px;">' +
        '  <div style="background:var(--paper-soft);padding:8px;border-radius:4px;"><b>cis:</b> ' + cisTxt + '</div>' +
        '  <div style="background:var(--paper-soft);padding:8px;border-radius:4px;"><b>trans:</b> ' + transTxt + '</div>' +
        '</div>' +
        '<div style="color:var(--muted);font-size:12.5px;">' + explanation + '</div>';
    }

    container.querySelector('#btn-geom-hex').onclick = function(e){ setActivePreset(e.target); compound = 'hexene'; render(); };
    container.querySelector('#btn-geom-but').onclick = function(e){ setActivePreset(e.target); compound = 'butene'; render(); };
    container.querySelector('#btn-geom-dcl').onclick = function(e){ setActivePreset(e.target); compound = 'dichloro'; render(); };
    render();
  }
};

// ==========================================
// 4. markovnikovsim: Carbocation vs Peroxide Addition & Ozonolysis Lab
// ==========================================
window.SIMS.markovnikovsim = {
  mount: function(container){
    var mode = 'markovnikov'; // markovnikov, peroxide, ozonolysis

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip active" id="btn-mode-mark">Markovnikov Ionic Addition (2° Carbocation)</button>' +
      '    <button class="filter-chip" id="btn-mode-anti">Kharasch Peroxide Effect (2° Radical, Ex 9.16)</button>' +
      '    <button class="filter-chip" id="btn-mode-ozo">Ozonolysis Cleavage Engine (Ex 9.4, 9.5, 9.17)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-mark" viewBox="0 0 700 230" style="width:100%;height:auto;max-height:230px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="mark-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-mark');
      var rd = document.getElementById('mark-readout');
      if(!svg || !rd) return;

      var title, rxnEq, intName, prodName, desc, svgContent;
      if(mode === 'markovnikov'){
        title = 'Electrophilic Addition of HBr to Propene (Markovnikov Rule)';
        rxnEq = 'CH_3–CH=CH_2 + HBr \\xrightarrow{\\text{no peroxide}} CH_3–CH(Br)–CH_3 \\quad (\\text{2-Bromopropane})';
        intName = 'Secondary Carbocation intermediate: CH₃–C⁺H–CH₃ (6 α-hydrogens)';
        prodName = 'Major Product: 2-Bromopropane (Markovnikov addition)';
        desc = 'Step 1: The double bond attacks H⁺. Addition of H⁺ to terminal C1 yields the 2° carbocation, stabilized by 6 hyperconjugative α-H atoms (far more stable than 1° CH₃CH₂CH₂⁺). Step 2: Bromide ion (Br⁻) attacks the positive carbon to yield 2-bromopropane.';
        svgContent = 
          '<g transform="translate(350, 110)">' +
          '  <text x="-250" y="0" fill="#38bdf8" font-size="14" font-weight="bold">CH₃–CH=CH₂ + HBr</text>' +
          '  <path d="M -100 -10 Q -50 -40 0 -10" stroke="#f59e0b" stroke-width="3" marker-end="url(#arrow)" fill="none"/>' +
          '  <text x="-50" y="-45" fill="#f59e0b" font-size="11">H⁺ attacks C1</text>' +
          '  <!-- 2° Carbocation -->' +
          '  <rect x="-20" y="-30" width="140" height="60" rx="8" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>' +
          '  <text x="50" y="5" text-anchor="middle" fill="#ef4444" font-size="13" font-weight="bold">CH₃–C⁺H–CH₃</text>' +
          '  <text x="50" y="22" text-anchor="middle" fill="#94a3b8" font-size="10">2° Carbocation (Stable)</text>' +
          '  <path d="M 130 0 L 170 0" stroke="#10b981" stroke-width="3"/>' +
          '  <text x="150" y="-10" fill="#10b981" font-size="11">+ Br⁻</text>' +
          '  <text x="240" y="5" text-anchor="middle" fill="#10b981" font-size="14" font-weight="bold">CH₃–CH(Br)–CH₃</text>' +
          '</g>';
      } else if(mode === 'peroxide'){
        title = 'Free-Radical Addition of HBr to Propene (Kharasch Peroxide Effect — Ex 9.16)';
        rxnEq = 'CH_3–CH=CH_2 + HBr \\xrightarrow{\\text{Benzoyl Peroxide}} CH_3–CH_2–CH_2Br \\quad (\\text{1-Bromopropane})';
        intName = 'Secondary Free Radical intermediate: CH₃–C•H–CH₂Br';
        prodName = 'Major Product: 1-Bromopropane (Anti-Markovnikov)';
        desc = 'In the presence of peroxide, bromine free radical (Br•) attacks first. Attack at terminal C1 yields the more stable 2° carbon radical (CH₃C•H–CH₂Br). The 2° radical abstracts H from HBr to yield 1-bromopropane. HCl and HI fail because their propagation steps are endothermic!';
        svgContent = 
          '<g transform="translate(350, 110)">' +
          '  <text x="-260" y="0" fill="#38bdf8" font-size="14" font-weight="bold">CH₃–CH=CH₂ + Br•</text>' +
          '  <path d="M -100 -10 Q -50 -40 0 -10" stroke="#f59e0b" stroke-width="3" fill="none"/>' +
          '  <text x="-50" y="-45" fill="#f59e0b" font-size="11">Br• attacks C1</text>' +
          '  <!-- 2° Radical -->' +
          '  <rect x="-20" y="-30" width="140" height="60" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>' +
          '  <text x="50" y="5" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="bold">CH₃–C•H–CH₂Br</text>' +
          '  <text x="50" y="22" text-anchor="middle" fill="#94a3b8" font-size="10">2° Free Radical (Stable)</text>' +
          '  <path d="M 130 0 L 170 0" stroke="#10b981" stroke-width="3"/>' +
          '  <text x="150" y="-10" fill="#10b981" font-size="11">+ HBr</text>' +
          '  <text x="240" y="5" text-anchor="middle" fill="#10b981" font-size="14" font-weight="bold">CH₃CH₂CH₂Br</text>' +
          '</g>';
      } else {
        title = 'Ozonolysis Cleavage Engine (Alkenes & Benzene Derivatives)';
        rxnEq = '1.\\text{ Pent-2-ene} \\to \\text{Ethanal + Propanal}; \\quad 2.\\text{ o-Xylene} \\to 3\\text{ Glyoxal} + 2\\text{ Methylglyoxal} + 1\\text{ Dimethylglyoxal}';
        intName = 'Molozonide ⟶ Ozonide ⟶ Carbonyl Cleavage Products with Zn/H₂O';
        prodName = 'Pinpoints exact location of C=C double bonds in unknown hydrocarbons';
        desc = 'Zinc dust prevents H₂O₂ from oxidizing aldehydes to carboxylic acids. The isolation of glyoxal, methylglyoxal, and dimethylglyoxal in a 3:2:1 molar ratio from o-xylene provides experimental proof of the Kekulé resonance of benzene (NCERT Ex 9.17).';
        svgContent = 
          '<g transform="translate(350, 110)">' +
          '  <text x="-240" y="-20" fill="#38bdf8" font-size="13" font-weight="bold">o-Xylene (Resonance Hybrid of 2 Kekulé Forms)</text>' +
          '  <path d="M -50 -15 L 0 -15" stroke="#f8fafc" stroke-width="2"/>' +
          '  <text x="20" y="-35" fill="#10b981" font-size="12">■ 3 moles Glyoxal (OHC–CHO)</text>' +
          '  <text x="20" y="-10" fill="#f59e0b" font-size="12">■ 2 moles Methylglyoxal (CH₃–CO–CHO)</text>' +
          '  <text x="20" y="15" fill="#ec4899" font-size="12">■ 1 mole Dimethylglyoxal (CH₃–CO–CO–CH₃)</text>' +
          '  <text x="0" y="65" text-anchor="middle" fill="#38bdf8" font-size="12">Molar Ratio = 3 : 2 : 1  ⟹  Confirms Kekulé Oscillation!</text>' +
          '</g>';
      }

      svg.innerHTML = svgContent;
      rd.innerHTML = 
        '<div style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + title + '</div>' +
        '<div style="font-family:monospace;font-size:13px;background:var(--paper-soft);padding:8px;border-radius:4px;color:var(--accent);margin-bottom:8px;">' + rxnEq + '</div>' +
        '<div style="margin-bottom:6px;"><b>Intermediate:</b> ' + intName + '<br><b>Result:</b> ' + prodName + '</div>' +
        '<div style="color:var(--muted);font-size:12.5px;">' + desc + '</div>';
    }

    container.querySelector('#btn-mode-mark').onclick = function(e){ setActivePreset(e.target); mode = 'markovnikov'; render(); };
    container.querySelector('#btn-mode-anti').onclick = function(e){ setActivePreset(e.target); mode = 'peroxide'; render(); };
    container.querySelector('#btn-mode-ozo').onclick = function(e){ setActivePreset(e.target); mode = 'ozonolysis'; render(); };
    render();
  }
};

// ==========================================
// 5. alkynelab: Terminal Alkyne Acidity & Hydration Reactor
// ==========================================
window.SIMS.alkynelab = {
  mount: function(container){
    var testType = 'acidity'; // acidity, silver, hydration

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip active" id="btn-alk-acid">Hybridization & Acidity (Ex 9.18)</button>' +
      '    <button class="filter-chip" id="btn-alk-silver">Terminal Alkyne Tollens Test (Ag⁺)</button>' +
      '    <button class="filter-chip" id="btn-alk-hyd">Kucherov Hydration (Hg²⁺ / H₂SO₄)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-alkyne" viewBox="0 0 700 230" style="width:100%;height:auto;max-height:230px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="alk-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-alkyne');
      var rd = document.getElementById('alk-readout');
      if(!svg || !rd) return;

      var title, eq, desc, svgContent;
      if(testType === 'acidity'){
        title = 'Acidity Trend Governed by Carbon Hybridization (% s-Character)';
        eq = 'HC\\equiv CH\\ (sp,\\ 50\\%\\ s) > C_6H_6\\ (sp^2,\\ 33.3\\%\\ s) > C_6H_{14}\\ (sp^3,\\ 25\\%\\ s)';
        desc = 'Electrons in an sp orbital are held closer to the nucleus due to 50% spherical s-character, making sp carbon the most electronegative. The C–H bond is strongly polarized, and the conjugate base acetylide carbanion (HC≡C:⁻) is exceptionally stable. Ethyne has pKa ≈ 25, benzene pKa ≈ 43, and hexane pKa ≈ 50.';
        svgContent = 
          '<g transform="translate(350, 110)">' +
          '  <!-- Ethyne -->' +
          '  <rect x="-240" y="-40" width="140" height="80" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2"/>' +
          '  <text x="-170" y="-15" text-anchor="middle" fill="#10b981" font-size="14" font-weight="bold">Ethyne (HC≡CH)</text>' +
          '  <text x="-170" y="5" text-anchor="middle" fill="#f8fafc" font-size="12">sp (50% s)</text>' +
          '  <text x="-170" y="25" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">Most Acidic (pKa 25)</text>' +
          '  <!-- Benzene -->' +
          '  <rect x="-70" y="-40" width="140" height="80" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>' +
          '  <text x="0" y="-15" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">Benzene (C₆H₆)</text>' +
          '  <text x="0" y="5" text-anchor="middle" fill="#f8fafc" font-size="12">sp² (33.3% s)</text>' +
          '  <text x="0" y="25" text-anchor="middle" fill="#38bdf8" font-size="12">Moderate (pKa 43)</text>' +
          '  <!-- Hexane -->' +
          '  <rect x="100" y="-40" width="140" height="80" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="2"/>' +
          '  <text x="170" y="-15" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">Hexane (C₆H₁₄)</text>' +
          '  <text x="170" y="5" text-anchor="middle" fill="#f8fafc" font-size="12">sp³ (25% s)</text>' +
          '  <text x="170" y="25" text-anchor="middle" fill="#ef4444" font-size="12">Least Acidic (pKa 50)</text>' +
          '</g>';
      } else if(testType === 'silver'){
        title = 'Heavy Metal Acetylide Test (Distinguishing Terminal from Internal Alkynes)';
        eq = 'CH_3–C\\equiv CH + [Ag(NH_3)_2]^+ \\longrightarrow CH_3–C\\equiv C–Ag\\downarrow\\ (\\text{White Precipitate}) + NH_4^+ + NH_3';
        desc = 'Terminal alkynes contain an acidic hydrogen and form insoluble silver acetylides (white precipitate) with Tollens\' reagent and copper acetylides (red precipitate) with ammoniacal Cu₂Cl₂. Internal alkynes (like but-2-yne, CH₃–C≡C–CH₃) lack acidic hydrogen and give NO reaction!';
        svgContent = 
          '<g transform="translate(350, 100)">' +
          '  <!-- Test tube 1: But-1-yne -->' +
          '  <rect x="-160" y="-60" width="50" height="120" rx="10" fill="none" stroke="#94a3b8" stroke-width="2"/>' +
          '  <rect x="-158" y="0" width="46" height="58" rx="8" fill="#e2e8f0" opacity="0.9"/>' +
          '  <text x="-135" y="80" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">But-1-yne</text>' +
          '  <text x="-135" y="98" text-anchor="middle" fill="#e2e8f0" font-size="11">White Ag-Acetylide Ppt</text>' +
          '  <!-- Test tube 2: But-2-yne -->' +
          '  <rect x="110" y="-60" width="50" height="120" rx="10" fill="none" stroke="#94a3b8" stroke-width="2"/>' +
          '  <rect x="112" y="0" width="46" height="58" rx="8" fill="#38bdf8" opacity="0.3"/>' +
          '  <text x="135" y="80" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">But-2-yne</text>' +
          '  <text x="135" y="98" text-anchor="middle" fill="#94a3b8" font-size="11">No Precipitate (Clear)</text>' +
          '</g>';
      } else {
        title = 'Kucherov Catalytic Hydration of Alkynes (HgSO₄ / H₂SO₄ at 333 K)';
        eq = 'CH\\equiv CH + H_2O \\xrightarrow[333\\text{ K}]{Hg^{2+}/H^+} [CH_2=CH–OH] \\xrightarrow{\\text{tautomerism}} CH_3–CHO \\quad (\\text{Ethanal})';
        desc = 'Water adds across the triple bond according to Markovnikov\'s rule to form an unstable enol. Rapid keto-enol tautomerism shifts the hydrogen from oxygen to carbon, yielding an aldehyde (ethanal from ethyne) or a ketone (propan-2-one / acetone from propyne).';
        svgContent = 
          '<g transform="translate(350, 110)">' +
          '  <text x="-250" y="0" fill="#38bdf8" font-size="14" font-weight="bold">HC≡CH + H₂O</text>' +
          '  <path d="M -120 0 L -60 0" stroke="#f59e0b" stroke-width="3"/>' +
          '  <text x="-90" y="-12" fill="#f59e0b" font-size="11">Hg²⁺, 333 K</text>' +
          '  <rect x="-40" y="-30" width="130" height="60" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>' +
          '  <text x="25" y="5" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="bold">[CH₂=CH–OH]</text>' +
          '  <text x="25" y="22" text-anchor="middle" fill="#94a3b8" font-size="10">Unstable Enol</text>' +
          '  <path d="M 110 0 L 160 0" stroke="#10b981" stroke-width="3"/>' +
          '  <text x="135" y="-12" fill="#10b981" font-size="11">Tautomerize</text>' +
          '  <text x="230" y="5" text-anchor="middle" fill="#10b981" font-size="15" font-weight="bold">CH₃–CHO (Ethanal)</text>' +
          '</g>';
      }

      svg.innerHTML = svgContent;
      rd.innerHTML = 
        '<div style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + title + '</div>' +
        '<div style="font-family:monospace;font-size:13px;background:var(--paper-soft);padding:8px;border-radius:4px;color:var(--accent);margin-bottom:8px;">' + eq + '</div>' +
        '<div style="color:var(--muted);font-size:12.5px;">' + desc + '</div>';
    }

    container.querySelector('#btn-alk-acid').onclick = function(e){ setActivePreset(e.target); testType = 'acidity'; render(); };
    container.querySelector('#btn-alk-silver').onclick = function(e){ setActivePreset(e.target); testType = 'silver'; render(); };
    container.querySelector('#btn-alk-hyd').onclick = function(e){ setActivePreset(e.target); testType = 'hydration'; render(); };
    render();
  }
};

// ==========================================
// 6. aromaticitytester: Hückel (4n+2)π Rule & Ring Planarity Analyzer
// ==========================================
window.SIMS.aromaticitytester = {
  mount: function(container){
    var molecule = 'benzene'; // benzene, cot, cp_anion, cp_diene, tropylium, cyclobutadiene

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip active" id="btn-aro-benz">Benzene (6π, Aromatic)</button>' +
      '    <button class="filter-chip" id="btn-aro-cot">Cyclooctatetraene (8π, Tub, Ex 9.12)</button>' +
      '    <button class="filter-chip" id="btn-aro-cpani">Cyclopentadienyl Anion (6π, Aromatic)</button>' +
      '    <button class="filter-chip" id="btn-aro-cpdie">1,3-Cyclopentadiene (sp³, Ex 9.12)</button>' +
      '    <button class="filter-chip" id="btn-aro-trop">Tropylium Cation (6π, Aromatic)</button>' +
      '    <button class="filter-chip" id="btn-aro-cbd">Cyclobutadiene (4π, Antiaromatic)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-aromatic" viewBox="0 0 700 230" style="width:100%;height:auto;max-height:230px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="aro-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-aromatic');
      var rd = document.getElementById('aro-readout');
      if(!svg || !rd) return;

      var name, piCount, nVal, isPlanar, isConj, verdict, explanation, svgContent;
      if(molecule === 'benzene'){
        name = 'Benzene (C₆H₆)';
        piCount = 6;
        nVal = 1;
        isPlanar = 'Yes (Planar regular hexagon, 120°)';
        isConj = 'Yes (All 6 carbons are sp²)';
        verdict = '<span style="color:#10b981;font-weight:bold;font-size:15px;">★ AROMATIC (4n+2 with n=1, 150.5 kJ/mol Resonance Energy)</span>';
        explanation = 'Benzene satisfies all four criteria: cyclic, planar, completely conjugated ring with 6 π-electrons filling all three bonding molecular orbitals (ψ₁, ψ₂, ψ₃).';
        svgContent = 
          '<g transform="translate(350, 115)">' +
          '  <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="none" stroke="#38bdf8" stroke-width="4"/>' +
          '  <circle cx="0" cy="0" r="32" fill="none" stroke="#f43f5e" stroke-width="3" stroke-dasharray="5,3"/>' +
          '  <text x="0" y="5" text-anchor="middle" fill="#f43f5e" font-size="13" font-weight="bold">6 π deloc.</text>' +
          '</g>';
      } else if(molecule === 'cot'){
        name = 'Cyclooctatetraene (C₈H₈) — NCERT Exercise 9.12(iii)';
        piCount = 8;
        nVal = '4n (n=2)';
        isPlanar = 'No (Flexes into non-planar tub conformation)';
        isConj = 'Broken by non-planarity';
        verdict = '<span style="color:#f59e0b;font-weight:bold;font-size:15px;">NON-AROMATIC (Escapes antiaromaticity via non-planar tub shape)</span>';
        explanation = 'If planar, cyclooctatetraene would have 8 π-electrons (4n with n=2) and be antiaromatic with unpaired diradical electrons. To minimize energy, it flexes into a non-planar tub shape, breaking p-orbital overlap and behaving as an ordinary polyene.';
        svgContent = 
          '<g transform="translate(350, 115)">' +
          '  <!-- Tub-shaped COT projection -->' +
          '  <path d="M -70 -40 L -40 30 L 40 30 L 70 -40 L 40 -20 L -40 -20 Z" fill="none" stroke="#f59e0b" stroke-width="4"/>' +
          '  <text x="0" y="5" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="bold">Non-Planar Tub Shape</text>' +
          '  <text x="0" y="65" text-anchor="middle" fill="#94a3b8" font-size="12">8 π-electrons (4n) ⟹ Non-Aromatic</text>' +
          '</g>';
      } else if(molecule === 'cp_anion'){
        name = 'Cyclopentadienyl Anion (C₅H₅⁻)';
        piCount = 6;
        nVal = 1;
        isPlanar = 'Yes (Planar regular pentagon)';
        isConj = 'Yes (All 5 carbons are sp²)';
        verdict = '<span style="color:#10b981;font-weight:bold;font-size:15px;">★ AROMATIC (4n+2 with n=1, Highly Stable Anion)</span>';
        explanation = 'Four π-electrons from two double bonds + two electrons from the carbanion lone pair = 6 π-electrons. All 5 carbons are sp² hybridized and share the negative charge equally.';
        svgContent = 
          '<g transform="translate(350, 115)">' +
          '  <polygon points="0,-55 52,-17 32,45 -32,45 -52,-17" fill="none" stroke="#10b981" stroke-width="4"/>' +
          '  <circle cx="0" cy="0" r="26" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4,2"/>' +
          '  <text x="0" y="5" text-anchor="middle" fill="#10b981" font-size="14" font-weight="bold">6 π (⊖)</text>' +
          '</g>';
      } else if(molecule === 'cp_diene'){
        name = '1,3-Cyclopentadiene — NCERT Exercise 9.12(ii)';
        piCount = 4;
        nVal = 'N/A';
        isPlanar = 'Near-planar';
        isConj = 'NO (Interrupted by sp³ –CH₂– carbon)';
        verdict = '<span style="color:#ef4444;font-weight:bold;font-size:15px;">NON-AROMATIC (sp³ carbon breaks cyclic conjugation)</span>';
        explanation = 'The –CH₂– carbon has no unhybridized p-orbital, completely blocking continuous cyclic delocalization across the ring.';
        svgContent = 
          '<g transform="translate(350, 115)">' +
          '  <polygon points="0,-55 52,-17 32,45 -32,45 -52,-17" fill="none" stroke="#64748b" stroke-width="3"/>' +
          '  <line x1="52" y1="-17" x2="32" y2="45" stroke="#38bdf8" stroke-width="5"/>' +
          '  <line x1="-52" y1="-17" x2="-32" y2="45" stroke="#38bdf8" stroke-width="5"/>' +
          '  <circle cx="0" cy="-55" r="14" fill="#ef4444"/><text x="0" y="-51" text-anchor="middle" fill="#f8fafc" font-size="10" font-weight="bold">sp³</text>' +
          '  <text x="0" y="15" text-anchor="middle" fill="#ef4444" font-size="12">sp³ carbon interrupts conjugation</text>' +
          '</g>';
      } else if(molecule === 'tropylium'){
        name = 'Tropylium Cation (Cycloheptatrienyl Cation, C₇H₇⁺)';
        piCount = 6;
        nVal = 1;
        isPlanar = 'Yes (Planar 7-membered ring)';
        isConj = 'Yes (Empty p-orbital on carbocation C+)';
        verdict = '<span style="color:#10b981;font-weight:bold;font-size:15px;">★ AROMATIC (4n+2 with n=1, Exceptionally Stable Cation)</span>';
        explanation = 'Three double bonds contribute 6 π-electrons, and the 7th carbon possesses an empty unhybridized p-orbital, allowing uninterrupted cyclic delocalization over all 7 carbons.';
        svgContent = 
          '<g transform="translate(350, 115)">' +
          '  <circle cx="0" cy="0" r="50" fill="none" stroke="#38bdf8" stroke-width="3"/>' +
          '  <circle cx="0" cy="0" r="30" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,2"/>' +
          '  <text x="0" y="5" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">6 π (⊕)</text>' +
          '</g>';
      } else {
        name = 'Cyclobutadiene (C₄H₄)';
        piCount = 4;
        nVal = '4n (n=1)';
        isPlanar = 'Planar square';
        isConj = 'Yes (All 4 carbons sp²)';
        verdict = '<span style="color:#ef4444;font-weight:bold;font-size:15px;">ANTIAROMATIC (4n π-electrons, Extremely Unstable Diradical)</span>';
        explanation = 'Cyclobutadiene has 4 π-electrons in a planar conjugated ring. Two electrons singly occupy degenerate non-bonding orbitals, resulting in massive antiaromatic destabilization and instantaneous dimerization even at 4 K!';
        svgContent = 
          '<g transform="translate(350, 115)">' +
          '  <rect x="-45" y="-45" width="90" height="90" fill="none" stroke="#ef4444" stroke-width="4"/>' +
          '  <line x1="-35" y1="-45" x2="-35" y2="45" stroke="#ef4444" stroke-width="2"/>' +
          '  <line x1="35" y1="-45" x2="35" y2="45" stroke="#ef4444" stroke-width="2"/>' +
          '  <text x="0" y="5" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">4 π Antiaromatic</text>' +
          '</g>';
      }

      svg.innerHTML = svgContent;
      rd.innerHTML = 
        '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:6px;">' + name + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:8px;margin-bottom:8px;">' +
        '  <div><b>π-Electrons:</b> ' + piCount + '</div>' +
        '  <div><b>Hückel Index (n):</b> ' + nVal + '</div>' +
        '  <div><b>Planar Ring:</b> ' + isPlanar + '</div>' +
        '  <div><b>Conjugation:</b> ' + isConj + '</div>' +
        '</div>' +
        '<div style="margin-bottom:6px;"><b>Aromaticity Verdict:</b> ' + verdict + '</div>' +
        '<div style="color:var(--muted);font-size:12.5px;">' + explanation + '</div>';
    }

    container.querySelector('#btn-aro-benz').onclick = function(e){ setActivePreset(e.target); molecule = 'benzene'; render(); };
    container.querySelector('#btn-aro-cot').onclick = function(e){ setActivePreset(e.target); molecule = 'cot'; render(); };
    container.querySelector('#btn-aro-cpani').onclick = function(e){ setActivePreset(e.target); molecule = 'cp_anion'; render(); };
    container.querySelector('#btn-aro-cpdie').onclick = function(e){ setActivePreset(e.target); molecule = 'cp_diene'; render(); };
    container.querySelector('#btn-aro-trop').onclick = function(e){ setActivePreset(e.target); molecule = 'tropylium'; render(); };
    container.querySelector('#btn-aro-cbd').onclick = function(e){ setActivePreset(e.target); molecule = 'cyclobutadiene'; render(); };
    render();
  }
};

// ==========================================
// 7. easmechanism: Electrophilic Aromatic Substitution & Directive Influence Engine
// ==========================================
window.SIMS.easmechanism = {
  mount: function(container){
    var reaction = 'nitration'; // nitration, bromination, fc_alkyl, fc_acyl
    var substituent = 'methyl'; // h, methyl, chloro, nitro

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">' +
      '    <div>' +
      '      <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">EAS Reaction Type:</label>' +
      '      <select id="sel-eas-rxn" style="width:100%;padding:6px;border-radius:4px;border:1px solid var(--line);background:var(--paper);color:var(--ink);">' +
      '        <option value="nitration" selected>Nitration (HNO₃ + H₂SO₄ ⟶ NO₂⁺)</option>' +
      '        <option value="bromination">Halogenation (Br₂ + FeBr₃ ⟶ Br⁺)</option>' +
      '        <option value="fc_alkyl">Friedel-Crafts Alkylation (CH₃Cl + AlCl₃)</option>' +
      '        <option value="fc_acyl">Friedel-Crafts Acylation (CH₃COCl + AlCl₃)</option>' +
      '      </select>' +
      '    </div>' +
      '    <div>' +
      '      <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Existing Ring Substituent (Directive Effect):</label>' +
      '      <select id="sel-eas-sub" style="width:100%;padding:6px;border-radius:4px;border:1px solid var(--line);background:var(--paper);color:var(--ink);">' +
      '        <option value="methyl" selected>–CH₃ (Activating, ortho/para director)</option>' +
      '        <option value="h">–H (Unsubstituted Benzene Standard)</option>' +
      '        <option value="chloro">–Cl (Deactivating, ortho/para director)</option>' +
      '        <option value="nitro">–NO₂ (Strongly Deactivating, meta director)</option>' +
      '      </select>' +
      '    </div>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-eas" viewBox="0 0 700 240" style="width:100%;height:auto;max-height:240px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="eas-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-eas');
      var rd = document.getElementById('eas-readout');
      if(!svg || !rd) return;

      var electrophile, eFormula, rdsStep, directTxt, relRate;
      if(reaction === 'nitration'){
        electrophile = 'Nitronium ion (NO₂⁺)';
        eFormula = 'HNO₃ + 2 H₂SO₄ ⇌ NO₂⁺ + H₃O⁺ + 2 HSO₄⁻';
      } else if(reaction === 'bromination'){
        electrophile = 'Bromonium ion / Polarized complex (Br⁺ ··· FeBr₄⁻)';
        eFormula = 'Br₂ + FeBr₃ ⇌ Br⁺ + [FeBr₄]⁻';
      } else if(reaction === 'fc_alkyl'){
        electrophile = 'Methyl carbocation (CH₃⁺)';
        eFormula = 'CH₃Cl + AlCl₃ ⇌ CH₃⁺ + [AlCl₄]⁻';
      } else {
        electrophile = 'Acylium ion (CH₃–C≡O⁺)';
        eFormula = 'CH₃COCl + AlCl₃ ⇌ [CH₃–C≡O]⁺ + [AlCl₄]⁻';
      }

      if(substituent === 'methyl'){
        directTxt = '<span style="color:#10b981;font-weight:bold;">ortho/para Directing</span> (Hyperconjugation & +I effect stabilize arenium ion)';
        relRate = 'Activated (~25× faster than benzene). Undergoes nitration most easily (NCERT Ex 9.23)!';
      } else if(substituent === 'chloro'){
        directTxt = '<span style="color:#38bdf8;font-weight:bold;">ortho/para Directing</span> (+R resonance from Cl lone pairs stabilizes o/p attack)';
        relRate = 'Deactivated (~30× slower than benzene) because strong –I inductive effect withdraws electron density.';
      } else if(substituent === 'nitro'){
        directTxt = '<span style="color:#ec4899;font-weight:bold;">meta Directing</span> (–I and –R pull electron density, making ortho/para positions intolerable)';
        relRate = 'Severely Deactivated (~10⁴× slower than benzene). Resists further EAS reactions.';
      } else {
        directTxt = 'Neutral (Standard 6 equivalent positions)';
        relRate = 'Baseline Reference Standard (Relative Rate = 1.0).';
      }

      svg.innerHTML = 
        '<g transform="translate(350, 110)">' +
        '  <!-- Step 1: Reactants -->' +
        '  <g transform="translate(-200, 0)">' +
        '    <polygon points="0,-40 34,-20 34,20 0,40 -34,20 -34,-20" fill="none" stroke="#38bdf8" stroke-width="3"/>' +
        '    <circle cx="0" cy="0" r="18" fill="none" stroke="#38bdf8" stroke-dasharray="3,2"/>' +
        '    <text x="0" y="-50" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">' + (substituent === 'methyl' ? '–CH₃' : (substituent === 'chloro' ? '–Cl' : (substituent === 'nitro' ? '–NO₂' : '–H'))) + '</text>' +
        '    <text x="50" y="5" fill="#f8fafc" font-size="14">+</text>' +
        '    <text x="80" y="5" fill="#ef4444" font-size="13" font-weight="bold">E⁺</text>' +
        '  </g>' +
        '  <path d="M -80 0 L -30 0" stroke="#f8fafc" stroke-width="2"/>' +
        '  <text x="-55" y="-10" text-anchor="middle" fill="#94a3b8" font-size="10">Slow (RDS)</text>' +
        '  <!-- Step 2: Arenium Ion (sigma-complex) -->' +
        '  <g transform="translate(20, 0)">' +
        '    <path d="M -25 -25 L -25 25 L 0 40 L 25 25 L 25 -25" fill="none" stroke="#ef4444" stroke-width="3"/>' +
        '    <path d="M -20 -10 C -10 20 10 20 20 -10" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,2" fill="none"/>' +
        '    <text x="0" y="10" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">⊕</text>' +
        '    <line x1="0" y1="-40" x2="-15" y2="-25" stroke="#94a3b8" stroke-width="2"/><text x="-25" y="-30" fill="#94a3b8" font-size="10">H</text>' +
        '    <line x1="0" y1="-40" x2="15" y2="-25" stroke="#ef4444" stroke-width="2"/><text x="25" y="-30" fill="#ef4444" font-size="10" font-weight="bold">E</text>' +
        '    <text x="0" y="60" text-anchor="middle" fill="#ef4444" font-size="11">Arenium Ion (Wheland)</text>' +
        '  </g>' +
        '  <path d="M 90 0 L 140 0" stroke="#10b981" stroke-width="2"/>' +
        '  <text x="115" y="-10" text-anchor="middle" fill="#10b981" font-size="10">Fast (-H⁺)</text>' +
        '  <!-- Step 3: Product -->' +
        '  <g transform="translate(200, 0)">' +
        '    <polygon points="0,-40 34,-20 34,20 0,40 -34,20 -34,-20" fill="none" stroke="#10b981" stroke-width="3"/>' +
        '    <circle cx="0" cy="0" r="18" fill="none" stroke="#10b981" stroke-dasharray="3,2"/>' +
        '    <text x="0" y="-48" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">Substituted Ring</text>' +
        '    <text x="0" y="60" text-anchor="middle" fill="#10b981" font-size="11">Aromaticity Restored!</text>' +
        '  </g>' +
        '</g>';

      rd.innerHTML = 
        '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:6px;">EAS Reaction Mechanism: ' + electrophile + '</div>' +
        '<div style="font-family:monospace;font-size:13px;background:var(--paper-soft);padding:8px;border-radius:4px;color:var(--accent);margin-bottom:8px;">' + eFormula + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:8px;margin-bottom:8px;">' +
        '  <div><b>Directive Orientation:</b> ' + directTxt + '</div>' +
        '  <div><b>Relative Reactivity:</b> ' + relRate + '</div>' +
        '</div>' +
        '<div style="color:var(--muted);font-size:12.5px;">' +
        '  • <b>Rate-Determining Step:</b> Attack of the benzene ring π-electrons on the electrophile to form the non-aromatic carbocation arenium ion intermediate (Wheland complex).<br>' +
        '  • <b>Thermodynamic Drive:</b> Fast proton abstraction by conjugate base restores the full aromatic sextet, recovering 150.5 kJ/mol of resonance energy.' +
        '</div>';
    }

    container.querySelector('#sel-eas-rxn').onchange = function(e){ reaction = e.target.value; render(); };
    container.querySelector('#sel-eas-sub').onchange = function(e){ substituent = e.target.value; render(); };
    render();
  }
};

// Map concept aliases
window.SIMS.c1 = window.SIMS.conformationlab;
window.SIMS.c2 = window.SIMS.freeradicalsim;
window.SIMS.c3 = window.SIMS.cistranslab;
window.SIMS.c4 = window.SIMS.markovnikovsim;
window.SIMS.c5 = window.SIMS.alkynelab;
window.SIMS.c6 = window.SIMS.aromaticitytester;
window.SIMS.c7 = window.SIMS.easmechanism;
